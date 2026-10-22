#!/usr/bin/env python3
"""Fügt app.html + app.css + data.js + app.js zu EINER Datei zusammen.
dist/app.html  -> Artifact-Fassung (vollständiges Dokument, ohne PWA-Verweise)
repo/index.html -> GitHub-Pages-Fassung mit manifest + Icons (PWA)
"""
import datetime, pathlib, re, json
d = pathlib.Path(__file__).parent
stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

shell = (d / "app.html").read_text()
css = (d / "fonts.css").read_text() + (d / "app.css").read_text() + ((d / "skins.css").read_text() if (d / "skins.css").exists() else "") + ((d / "goennen.css").read_text() if (d / "goennen.css").exists() else "") + ((d / "maxbriefe.css").read_text() if (d / "maxbriefe.css").exists() else "") + ((d / "feedback.css").read_text() if (d / "feedback.css").exists() else "") + ((d / "hp.css").read_text() if (d / "hp.css").exists() else "") + ((d / "design.css").read_text() if (d / "design.css").exists() else "") + ((d / "rundgang.css").read_text() if (d / "rundgang.css").exists() else "") + ((d / "nachtrag.css").read_text() if (d / "nachtrag.css").exists() else "") + ((d / "huhnfutter.css").read_text() if (d / "huhnfutter.css").exists() else "") + ((d / "figuren.css").read_text() if (d / "figuren.css").exists() else "") + ((d / "jahrfarben.css").read_text() if (d / "jahrfarben.css").exists() else "") + ((d / "tabzahl.css").read_text() if (d / "tabzahl.css").exists() else "") + ((d / "rueckblick.css").read_text() if (d / "rueckblick.css").exists() else "")  # Gestaltung C2, dann Rundgang mit Max
data = "\n".join((d / f).read_text() for f in ["data.js","data-orte.js","data-inhalte.js","data-laden.js","data-korrektur.js","data-sprache.js","data-lektorat.js","data-ablenkung.js", "data-winter.js","data-angebote.js","data-eier.js","data-eier2.js","data-anrufe.js", "data-anrufe2.js", "data-brevvan.js", "data-ereignisse2.js", "data-anrufe3.js", "data-feinschliff.js", "data-hp.js"] if (d / f).exists())
_tj = d / "tv.json"
if _tj.exists():
    import json as _json2
    data += "\n/* TV-Tipps aus tv.json */\nD.tv=" + _json2.dumps(_json2.loads(_tj.read_text()), ensure_ascii=False) + ";\n"
_aj = d / "angebote.json"
if _aj.exists():
    import json as _json
    _a = _json.loads(_aj.read_text())
    data += "\n/* Angebote aus angebote.json */\n(function(){var A=" + _json.dumps(_a, ensure_ascii=False) + ";D.angeboteStand=A.stand;if(A.kategorien)D.angeboteKat=A.kategorien;D.angebote=A.angebote.map(function(x){return Object.assign({},x,{id:'an-'+angebotId(x.name)})});})();\n"
app = "\n".join((d / f).read_text() for f in ["core.js","feedback.js","skins.js","figuren.js","avatar.js","scene.js","views.js","ruheplan.js","eigenes.js","eier.js","extras.js","telefon.js", "brevvan.js", "buecher.js", "hp.js", "tv.js", "winter.js", "ereignisse.js", "wunsch.js", "wetter.js","game.js","goennen.js","laden2.js","huhnfutter.js","maxbriefe.js","dank.js","jahrfarben.js","rede.js","main.js","rundgang.js","tabzahl.js","rueckblick.js"]).replace("__BUILD__", stamp)
# --- Schriften verkleinern (QA-17): Kaushan Script fällt weg (von Satisfy verdrängt),
#     alle übrigen werden auf die Zeichen reduziert, die in der App vorkommen (+ Latin-1/Ext-A, Typo-Zeichen, Pfeile).
def _fonts_klein(css_all, text):
    import base64, io
    try:
        from fontTools import subset as _ss
        from fontTools.ttLib import TTFont
    except Exception:
        return css_all
    zeichen = {ord(c) for c in text if ord(c) >= 32}
    zeichen |= set(range(0x20, 0x7F)) | set(range(0xA0, 0x180)) | set(range(0x2010, 0x2028)) | {0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2197, 0x2713, 0x2731, 0x2665, 0x266A, 0x266B}
    def neu(m):
        block = m.group(0)
        if "Kaushan" in block: return ""
        u = re.search(r"url\(data:font/woff;base64,([A-Za-z0-9+/=]+)\)", block)
        if not u: return block
        try:
            f = TTFont(io.BytesIO(base64.b64decode(u.group(1))))
            opt = _ss.Options(); opt.flavor = "woff"; opt.notdef_outline = True; opt.layout_features = list(opt.layout_features) + ["lnum", "tnum", "pnum", "zero"]  # Ziffern-Varianten behalten (klare „0“ in der Kasse)
            sub = _ss.Subsetter(opt); sub.populate(unicodes=zeichen); sub.subset(f)
            out = io.BytesIO(); f.flavor = "woff"; f.save(out)
            return block.replace(u.group(1), base64.b64encode(out.getvalue()).decode())
        except Exception as e:
            print("Schrift nicht verkleinert:", e); return block
    return re.sub(r"@font-face\s*\{.*?\}", neu, css_all, flags=re.S)
_fonts = (d / "fonts.css").read_text()
css = _fonts_klein(_fonts, shell + css[len(_fonts):] + data + app) + css[len(_fonts):]
# --- Typografie-Wache (UX-15): gerade Apostrophe in Texten melden (nur Hinweis, bricht nichts ab)
for _f in sorted(d.glob("*.js")):
    for _i, _z in enumerate(_f.read_text().splitlines(), 1):
        for _m in re.finditer(r"[A-Za-zÄÖÜäöüß]'s\b", _z):
            print(f"Hinweis Typografie: {_f.name}:{_i}: gerader Apostroph „{_z[max(0,_m.start()-12):_m.end()+6]}“ – besser ’")
# --- Akte Feuerkelch: Spoiler- und Regelprüfung (Register, Vorgriffswörter, dunkle Kapitel, Fragen-Takt)
def _hp_pruefen():
    import subprocess, shutil
    if not shutil.which("node") or not (d / "data-hp.js").exists(): return
    js = ("const vm=require('vm'),fs=require('fs');const ctx={console,S:{}};vm.createContext(ctx);"
          "for(const f of JSON.parse(process.argv[1])){if(fs.existsSync(f))vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});}"
          "const r=vm.runInContext('D.hpPruefen(D.hpFremdTexte())',ctx);console.log(JSON.stringify(r));")
    files = [str(d / f) for f in ["data.js","data-orte.js","data-inhalte.js","data-laden.js","data-korrektur.js","data-sprache.js","data-lektorat.js","data-ablenkung.js","data-winter.js","data-angebote.js","data-eier.js","data-eier2.js","data-anrufe.js","data-anrufe2.js","data-brevvan.js","data-ereignisse2.js","data-feinschliff.js","data-hp.js"]]
    try:
        r = json.loads(subprocess.run(["node", "-e", js, json.dumps(files)], capture_output=True, text=True, timeout=60).stdout)
    except Exception as ex:
        print("HP-Prüfung nicht gelaufen:", ex); return
    for w in r["warnungen"]: print("HP-Warnung (Altlast):", w)
    for f in r["fehler"]: print("HP-FEHLER:", f)
    print("HP-Prüfung:", "OK" if not r["fehler"] else f"{len(r['fehler'])} Fehler")
_hp_pruefen()
body = shell.replace("/*CSS*/", css).replace("/*DATA*/", data).replace("/*APP*/", app)

HEAD_COMMON = """<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<title>Ritas App</title>
<meta name="description" content="Ritas App: Liste, rausgehen, lesen, tanzen – und Hühnchen ist dabei.">
<meta name="theme-color" content="#F3EDE0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#14171A" media="(prefers-color-scheme: dark)">

"""
PWA = """<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Ritas App">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" href="icon-192.png">
<meta property="og:title" content="Ritas App"><meta property="og:description" content="Schönes sammeln, rausgehen, lesen, tanzen.">
"""

def doc(extra):
    return f"<!doctype html>\n<html lang=\"de\">\n<head>\n{HEAD_COMMON}{extra}</head>\n{body}\n</html>\n"

(d / "dist").mkdir(exist_ok=True)
(d / "repo").mkdir(exist_ok=True)
inner = body.replace("<body>", "", 1).rsplit("</body>", 1)[0]
art = '<title>Ritas App</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n' + inner
(d / "dist" / "app.html").write_text(art)
(d / "dist" / "test.html").write_text(doc(""))
(d / "repo" / "index.html").write_text(doc(PWA))
print("built", stamp, len(art.encode()) // 1024, "KB")
