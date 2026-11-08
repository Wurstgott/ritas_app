#!/usr/bin/env python3
"""Prüft angebote.json und tv.json für Ritas App, bevor der Sonntags-Auftrag pusht.

Aufruf:  python3 check_daten.py [angebote.json] [tv.json] [--links]
         (ohne Dateinamen: angebote.json und tv.json im aktuellen Ordner)

Fehler      → Exit-Code 1 (nicht pushen): Pflichtfelder, Kategorie, luft, Datumsformate, https,
              Doppelte, Links, die mit der Zeit falsch werden (Wochentag ohne Datum, „heute“, Suche, Session-ID).
Warnungen   → Exit-Code bleibt 0: Abgelaufenes, alter Stand, pruefen ohne tel, zu wenige Einträge.
--links     → prüft jede URL kurz übers Netz (parallel). 404/410 = Fehler; 401/403/429, Bot-Sperren,
              Cloudflare und Netzfehler = „nicht prüfbar“ (kein Fehler).
"""
import json, re, sys
from datetime import date, datetime
from urllib.parse import urlsplit

LUFT = {"draußen", "weitläufig", "drinnen voll"}
MINDEST = {"angebote": 40, "mediathek": 15, "fernsehen": 8}
STAND_TAGE = 10
TAGE = r"montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|sonnabend|wochenende"

fehler, warnungen, unpruefbar = [], [], []


def tag(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d").date() if isinstance(s, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", s) else None
    except ValueError:
        return None


def link_muster(u):
    """Gibt einen Grund zurück, wenn die URL mit der Zeit falsch wird (sonst None)."""
    p = urlsplit(u)
    pfad, query, ganz = p.path.lower(), p.query.lower(), u.lower()
    hat_datum = re.search(r"\d{4}-\d{2}-\d{2}|\d{1,2}[-.]\d{1,2}[-.]\d{4}|(?<!\d)20\d{6}(?!\d)", pfad + "?" + query)
    if not hat_datum and re.search(rf"(^|[/_-])({TAGE})([/_.;-]|$)", pfad):
        return "Wochentag ohne Datum im Pfad"
    if re.search(r"(^|/)(heute|morgen|gestern|today|tomorrow|jetzt|aktuell-im-tv)(/|;|\.\w+$|$)", pfad):
        return "„heute/morgen“-Seite"
    if "tagestipp" in ganz:
        return "Tagestipp-Seite"
    if re.search(r"(^|&)(tag|day|datum|date)=", query) and not hat_datum:
        return "Tag als Parameter ohne Datum"
    if re.search(r"(^|/)(suche|suchergebnisse?|search|searchresults?)(/?$|\.\w+$)", pfad) or re.search(r"(^|&)(q|query|suche|search|suchbegriff|searchterm|keyword|s)=", query):
        return "Suchergebnis-Seite"
    if re.search(r"jsessionid|phpsessid|(^|[&;])(sid|sessionid|session_id|session)=", ganz.replace("?", "&")):
        return "Session-ID im Link"
    return None


def pruef_url(wo, u, links):
    if not isinstance(u, str) or not u.strip():
        fehler.append(f"{wo}: Link fehlt"); return
    if not re.match(r"https://[^\s/]+\.[^\s/]+", u.strip()) or re.search(r"\s", u.strip()):
        fehler.append(f"{wo}: Link ist nicht https: {u}"); return
    g = link_muster(u)
    if g: fehler.append(f"{wo}: {g} – bitte stabile Seite nehmen: {u}")
    links.setdefault(u.strip(), []).append(wo)


def pflicht(wo, x, felder):
    for k, art in felder.items():
        if k not in x:
            fehler.append(f"{wo}: Pflichtfeld „{k}“ fehlt"); continue
        v = x[k]
        if art == "text" and not (isinstance(v, str) and v.strip()): fehler.append(f"{wo}: „{k}“ ist leer")
        elif art == "str" and not isinstance(v, str): fehler.append(f"{wo}: „{k}“ muss Text sein")
        elif art == "bool" and not isinstance(v, bool): fehler.append(f"{wo}: „{k}“ muss true/false sein")
        elif art == "wc" and v not in (None, True, False): fehler.append(f"{wo}: „wc“ muss null/true/false sein")
        elif art == "bis" and v is not None and not tag(v): fehler.append(f"{wo}: „bis“ ist kein Datum JJJJ-MM-TT: {v!r}")


def stand_pruefen(name, d, heute):
    st = d.get("stand")
    if st is None: fehler.append(f"{name}: „stand“ fehlt"); return
    t = tag(st)
    if not t: fehler.append(f"{name}: „stand“ ist kein Datum JJJJ-MM-TT: {st!r}"); return
    if (heute - t).days > STAND_TAGE: warnungen.append(f"{name}: Stand {st} ist älter als {STAND_TAGE} Tage")
    if t > heute: warnungen.append(f"{name}: Stand {st} liegt in der Zukunft")


def kurz(x, k):
    return (str(x.get(k, "")) if isinstance(x, dict) else "")[:50]


def angebote_pruefen(name, d, heute, links):
    stand_pruefen(name, d, heute)
    kat = d.get("kategorien")
    if not (isinstance(kat, list) and kat and all(isinstance(k, str) for k in kat)):
        fehler.append(f"{name}: „kategorien“ fehlt oder ist keine Liste"); kat = []
    arr = d.get("angebote")
    if not isinstance(arr, list): fehler.append(f"{name}: „angebote“ fehlt oder ist keine Liste"); return
    gesehen, namen, aktiv = {}, {}, 0
    for i, x in enumerate(arr):
        wo = f"Angebot {i + 1} „{kurz(x, 'name')}“"
        if not isinstance(x, dict): fehler.append(f"{wo}: kein Objekt"); continue
        pflicht(wo, x, {"name": "text", "kategorie": "text", "wann": "text", "wo": "text", "text": "text", "kosten": "str",
                        "wc": "wc", "tel": "str", "quelle": "str", "pruefen": "bool", "luft": "text"})
        if kat and isinstance(x.get("kategorie"), str) and x["kategorie"] not in kat: fehler.append(f"{wo}: Kategorie „{x['kategorie']}“ steht nicht in „kategorien“")
        if "luft" in x and x["luft"] not in LUFT: fehler.append(f"{wo}: „luft“ muss draußen, weitläufig oder drinnen voll sein: {x['luft']!r}")
        if "quelle" in x: pruef_url(wo, x["quelle"], links)
        lt = x.get("letzter_termin")
        vorbei = False
        if lt is not None:
            t = tag(lt)
            if not t: fehler.append(f"{wo}: „letzter_termin“ ist kein Datum JJJJ-MM-TT: {lt!r}")
            elif t < heute: warnungen.append(f"{wo}: abgelaufen (letzter_termin {lt}) – bitte entfernen"); vorbei = True
        if x.get("pruefen") is True and not str(x.get("tel") or "").strip(): warnungen.append(f"{wo}: pruefen ohne tel – Nummer nachtragen, wenn es eine gibt")
        schl = (str(x.get("name", "")).strip().lower(), str(x.get("wann", "")).strip().lower())
        if schl in gesehen: fehler.append(f"{wo}: doppelt (gleicher Name und „wann“ wie Angebot {gesehen[schl]})")
        else: gesehen[schl] = i + 1
        n = schl[0]
        if n in namen and namen[n] != gesehen.get(schl): warnungen.append(f"{wo}: gleicher Name wie Angebot {namen[n]} – die App gibt beiden dieselbe ID (Listen-Haken), besser Namen unterscheiden")
        namen.setdefault(n, i + 1)
        aktiv += not vorbei
    if aktiv < MINDEST["angebote"]: warnungen.append(f"{name}: nur {aktiv} aktuelle Angebote (mindestens {MINDEST['angebote']})")
    return len(arr)


def tv_pruefen(name, d, heute, links):
    stand_pruefen(name, d, heute)
    gesehen, n = {}, {}
    for teil, felder in (("mediathek", {"titel": "text", "sender": "text", "art": "str", "genre": "str", "text": "text", "laenge": "str", "bis": "bis", "link": "str"}),
                         ("fernsehen", {"titel": "text", "sender": "text", "datum": "text", "zeit": "text", "art": "str", "genre": "str", "text": "text", "link": "str"})):
        arr = d.get(teil)
        if not isinstance(arr, list): fehler.append(f"{name}: „{teil}“ fehlt oder ist keine Liste"); n[teil] = 0; continue
        aktiv = 0
        for i, x in enumerate(arr):
            wo = f"{teil.capitalize()} {i + 1} „{kurz(x, 'titel')}“"
            if not isinstance(x, dict): fehler.append(f"{wo}: kein Objekt"); continue
            pflicht(wo, x, felder)
            if "link" in x: pruef_url(wo, x["link"], links)
            vorbei = False
            if teil == "mediathek":
                t = tag(x.get("bis"))
                if t and t < heute: warnungen.append(f"{wo}: abgelaufen (bis {x['bis']}) – bitte entfernen"); vorbei = True
            else:
                t = tag(x.get("datum"))
                if "datum" in x and not t: fehler.append(f"{wo}: „datum“ ist kein Datum JJJJ-MM-TT: {x.get('datum')!r}")
                elif t and t < heute: warnungen.append(f"{wo}: abgelaufen (datum {x['datum']}) – bitte entfernen"); vorbei = True
                z = x.get("zeit")
                if "zeit" in x and not (isinstance(z, str) and re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", z)): fehler.append(f"{wo}: „zeit“ muss HH:MM sein: {z!r}")
            schl = (str(x.get("titel", "")).strip().lower(), str(x.get("sender", "")).strip().lower(), str(x.get("datum", "")))
            if schl in gesehen: fehler.append(f"{wo}: doppelt (gleicher Titel, Sender und Datum wie {gesehen[schl]})")
            else: gesehen[schl] = wo
            aktiv += not vorbei
        n[teil] = len(arr)
        if aktiv < MINDEST[teil]: warnungen.append(f"{name}: nur {aktiv} aktuelle Einträge in „{teil}“ (mindestens {MINDEST[teil]})")
    return n


def links_pruefen(links):
    import concurrent.futures, ssl, urllib.request, urllib.error, os
    ctx = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE") or None)
    UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36"

    def eins(u):
        letzte = None
        for methode in ("HEAD", "GET"):
            try:
                req = urllib.request.Request(u, method=methode, headers={"User-Agent": UA, "Accept": "text/html,*/*", "Accept-Language": "de"})
                with urllib.request.urlopen(req, timeout=8, context=ctx) as r:
                    return "ok", r.status
            except urllib.error.HTTPError as e:
                h = {k.lower(): v for k, v in (e.headers or {}).items()}
                if e.code in (404, 410): return "fehler", e.code
                if e.code in (401, 403, 429) or "cf-ray" in h or "cloudflare" in h.get("server", "").lower(): return "unpruefbar", f"{e.code} (Sperre)"
                letzte = ("unpruefbar", e.code)   # 405/5xx: mit GET noch einmal
            except Exception as e:
                letzte = ("unpruefbar", type(e).__name__)
        return letzte

    with concurrent.futures.ThreadPoolExecutor(16) as ex:
        for u, (art, info) in zip(links, ex.map(eins, links)):
            wo = links[u][0] + (f" (+{len(links[u]) - 1})" if len(links[u]) > 1 else "")
            if art == "fehler": fehler.append(f"{wo}: Seite gibt es nicht mehr ({info}): {u}")
            elif art == "unpruefbar": unpruefbar.append(f"{wo}: {info}: {u}")


def main(argv):
    mit_links = "--links" in argv
    dateien = [a for a in argv if not a.startswith("--")] or ["angebote.json", "tv.json"]
    heute, links, zeilen = date.today(), {}, []
    for f in dateien:
        try:
            with open(f, encoding="utf-8") as fh: d = json.load(fh)
        except Exception as e:
            fehler.append(f"{f}: nicht lesbar ({e})"); continue
        if not isinstance(d, dict): fehler.append(f"{f}: kein JSON-Objekt"); continue
        if "angebote" in d: zeilen.append(f"{f}: {angebote_pruefen(f, d, heute, links)} Angebote")
        elif "mediathek" in d or "fernsehen" in d:
            n = tv_pruefen(f, d, heute, links); zeilen.append(f"{f}: {n.get('mediathek', 0)} Mediathek, {n.get('fernsehen', 0)} Fernsehen")
        else: fehler.append(f"{f}: weder „angebote“ noch „mediathek“/„fernsehen“ gefunden")
    if mit_links and links: links_pruefen(links)
    print(f"check_daten ({heute.isoformat()}): " + "; ".join(zeilen) + (f"; {len(links)} Links {'geprüft' if mit_links else '(ohne --links nicht abgerufen)'}" if links else ""))
    for titel, arr in (("FEHLER", fehler), ("WARNUNGEN", warnungen), ("NICHT PRÜFBAR", unpruefbar)):
        if arr:
            print(f"\n{titel} ({len(arr)}):")
            for z in arr: print("  - " + z)
    print(f"\nErgebnis: {len(fehler)} Fehler, {len(warnungen)} Warnungen, {len(unpruefbar)} nicht prüfbar → " + ("NICHT pushen" if fehler else "ok"))
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
