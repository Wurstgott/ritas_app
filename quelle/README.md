# Ritas App – Hinweise für Entwickler

Kurz und praktisch: Wie die App gebaut ist, was man nie tun darf und wie man prüft und ausliefert.
Diese Datei liegt in `/home/claude/app/README-entwickler.md` und wird als `ritas_app/quelle/README.md` mit ausgeliefert.

## 1. Wo ist was?

| Ort | Was |
|---|---|
| `/home/claude/app/` | **Die echte Quelle.** Nur hier ändern, bauen und testen. |
| `app/dist/test.html` | Testfassung (vollständiges Dokument), gegen die alle Tests laufen. |
| `app/dist/app.html` | Artifact-Fassung (ohne PWA-Verweise). |
| `app/repo/index.html` | GitHub-Pages-Fassung (mit Manifest und Icons) – das wird ausgeliefert. |
| `/home/claude/ritas_app/` | Git-Repo der Auslieferung: `index.html`, `sw.js`, `manifest.json`, Icons, `angebote.json`, `tv.json`. |
| `ritas_app/quelle/` | **Kopie** von `app/` (für alle, die nur das Repo sehen). Nie dort ändern. |
| `/home/claude/test/` | Tests und `check.py`. |

## 2. Bauen und Lade-Reihenfolge

`cd /home/claude/app && python3 build.py` fügt alles zu **einer** HTML-Datei zusammen (`dist/` und `repo/`).

- Die Listen `CSS`, `DATA` und `APP` stehen in `build.py` **genau einmal**. Ihre Reihenfolge trägt Logik:
  **spätere Dateien überschreiben bzw. umwickeln frühere.**
- Alle Skripte landen in **einem** `<script>`. Die Wrapper (z. B. um `speichern`, `aktion`, `nachEintrag`) verlassen sich auf
  Hoisting. Deshalb: **nicht** in Module oder mehrere Script-Tags aufteilen.
- `angebote.json` und `tv.json` (sonntags automatisch erneuert) baut der Build in `D` ein und legt sie neben `repo/index.html`.
  Gibt es `angebote.json`, fällt `data-angebote.js` (Notfall-Stand) weg.
  Die App blendet Vergangenes nur bei der Anzeige aus (`fernsehen.datum`, `mediathek.bis`, optional `angebote.letzter_termin`)
  und zeigt bei `stand` älter als 10 Tage einen ruhigen Hinweis. Prüfen der Daten: `python3 check_daten.py angebote.json tv.json [--links]`.
- Der Build bricht ab, wenn eine Datei fehlt. Er verkleinert die Schriften (braucht `fontTools`) und lässt die
  HP-Spoiler-Prüfung laufen (braucht `node`). Erwartet: `HP-Prüfung: OK`.
- Die Schrift-Blobs ändern sich bei jedem Build (Zeitstempel von fontTools). Das ist harmlos.

## 3. Zustand und Migration

- Alles steht in `S`, gespeichert unter `localStorage["lichtung-v1"]` (`KEY` in core.js). **Schlüssel nie umbenennen**,
  alte Sicherungen müssen einspielbar bleiben. Sicherungsformat: `{ app: "lichtung", gv, gesichert, S }` (`sicherungText()`).
- `GV` = Zustandsversion. `migrieren()` (core.js) füllt fehlende Felder auf (`fuelle`), filtert `null` aus Listen und
  migriert nach `gvAlt`. Neue Migration: `if (gvAlt < 4) { … }` und `GV` hochzählen, **nur additiv**.
- Eigene Schlüssel: `lichtung-v1-angebote`, `-tv`, `-post` (`REPO_KEY`) und `lichtung-v1-vorher`.
  `-vorher` ist **genau ein** Rohtext-Schnappschuss: vor der Migration nach einem Fassungswechsel (`S.buildZuletzt ≠ BUILD`)
  und vor jedem Import. Scheitert er an der Quote, wird er still übersprungen.
- Unlesbarer Stand oder Fehler beim Start → Notfall-Ansicht mit Rohtext zum Kopieren (`LADEFEHLER`, `notfall()`), und
  `speichern()` schreibt dann nichts. Diese Teile und den Rollback in `einspielen-ja` (main.js) nicht anfassen.

## 4. Die zwei Grundregeln

1. **IDs nie löschen, nur Texte ändern.** Muss ein Eintrag weg, wird er versteckt (z. B. `aus: true`, beim Rendern bzw.
   Vorschlagen ausgefiltert). Sonst gehen gespeicherte Stände (Käufe, Pläne, Favoriten, Erledigt) still verloren:
   `skinsMigrieren()` (skins.js) und `migrieren()` werfen unbekannte IDs weg.
2. **Texte dort ändern, wo sie zuletzt gesetzt werden** (siehe Tabelle unten), danach in `dist/test.html` prüfen.
   Eine Änderung in `data.js` bleibt wirkungslos, wenn eine spätere Datei denselben Schlüssel überschreibt.

## 5. Welche Datei setzt welchen D-Schlüssel zuletzt?

Stand 2.11.2026, Reihenfolge wie in `DATA` (build.py). Pfeil = spätere Datei überschreibt bzw. ändert den Schlüssel.
**Fett** = hier gilt der Text.

| Schlüssel | Kette |
|---|---|
| `tagesformen` | data.js → data-sprache.js → **data-lektorat.js** |
| `taetigkeiten` | data.js → **data-sprache.js** (eigenes.js und ruheplan.js hängen zur Laufzeit an) |
| `gruppen`, `stufen` | data.js → data-sprache.js → **data-feinschliff.js** |
| `orte`, `timerVorlagen` | data.js → **data-feinschliff.js** |
| `laden` | data.js → **data-eier2.js** |
| `ausflugsziele`, `runden`, `angebote` | data-orte.js → **data-korrektur.js** (`angebote` danach aus angebote.json) |
| `buecher`, `lebensbuch` | data-inhalte.js → **data-korrektur.js** |
| `wissen` | data-inhalte.js → data-korrektur.js → **data-feinschliff.js** |
| `briefe` | data-laden.js → **data-korrektur.js** |
| `hp` | data-inhalte.js → **data-hp.js** |
| `huehnchenReaktionen`, `missionen` | data-lektorat.js → **data-feinschliff.js** |
| `stattDaddeln` | data-ablenkung.js → data-winter.js → **data-feinschliff.js** |
| `anrufe` | data-anrufe.js → data-anrufe3.js → data-feinschliff.js (führt anrufe + anrufe2 zusammen) → **data-hp.js** |
| `anrufe2` | data-anrufe2.js → **data-hp.js** |
| `ereignisse2` | data-ereignisse2.js → data-anrufe3.js → data-feinschliff.js → **data-hp.js** |
| alle übrigen | nur in einer Datei, z. B. `winter` (data-winter.js), `eier` (data-eier.js), `brevvan` (data-brevvan.js) |

Achtung: `data-feinschliff.js` enthält auch Logik, z. B. `angebotId()` (braucht der Build) und das Zusammenführen der Anrufe.
Die Tabelle neu erzeugen: alle `DATA`-Dateien der Reihe nach in einer `vm` laden und nach jeder Datei `JSON.stringify(D[k])` vergleichen.

## 6. Test-Hooks

| Hook | Wirkung |
|---|---|
| `?zeit=JJJJ-MM-TTTHH:MM` | stellt die Uhr (`ZEITVERSATZ`), greift schon vor `laden()` und `migrieren()`. |
| `navigator.webdriver` | Testläufe: Rundgang und Teilen-Bitte starten **nicht** von selbst. |
| `window.RUNDGANG_AUTOSTART = true` | Rundgang trotz Testlauf automatisch zeigen. |
| `window.TEILEN_AUTO = true` | Teilen-Bitte trotz Testlauf automatisch zeigen. |
| `github.io`-Schalter | Service Worker und Repo-Abrufe nur auf GitHub Pages; Tests und Artifact bleiben netzfrei. |

## 7. Prüfen

```
python3 /home/claude/test/check.py            # alles, Dauer ca. 20 Minuten
python3 /home/claude/test/check.py lupe2       # nur ausgewählte Tests (Build und Vergleich laufen immer)
```

`check.py` baut, startet alle Tests nacheinander (je höchstens 300 s, echter Exit-Code), vergleicht `app/` mit
`ritas_app/quelle/` sowie `repo/index.html` mit `ritas_app/index.html` (**nur Meldung, kopiert nichts**) und endet mit
`EXIT 0` (alles grün) oder `EXIT 1`. Protokolle stehen in `test/check-log/`.
Neue Tests enden mit `sys.exit(1 if errs else 0)` und kommen in die Liste `TESTS` in check.py.

## 8. Ausliefern (Deploy)

Nur wenn `check.py` grün ist:

1. `cp /home/claude/app/repo/index.html /home/claude/ritas_app/index.html`
   (und `angebote.json`, `tv.json` aus `app/repo/`, falls neu).
2. `app/` nach `ritas_app/quelle/` spiegeln: alle Dateien aus `app/` außer `dist/`, `repo/` und `lektorat-ui.md`;
   `README-entwickler.md` wird dort zu `README.md`.
3. In `ritas_app/sw.js` den Cache-Namen von Hand hochzählen (`const C = "ritas-app-vNN"`; check.py ändert sw.js nicht).
   Dann übernimmt der neue Service Worker, und die App lädt einmal neu – erst, wenn Rita gerade nichts tippt (`ruhig()` in main.js).
4. `check.py` noch einmal laufen lassen: Der Vergleich muss „gleich“ melden.
5. In `ritas_app/` committen und pushen (GitHub Pages liefert aus).

## 9. Tabus

Inhaltliche Leitplanken stehen in `BRIEF.md` (Review-Ordner, nicht im Repo) – vor Textänderungen lesen. Kurzfassung:

- Keine privaten Daten in Code, Texten, Commits oder Doku: keine Telefonnummern, keine E-Mail-Adressen, keine Herkunftsangaben
  zu Figuren.
- Feste Entscheidungen von Max nicht zurückdrehen: Name und Schriftzug, die vier Tabs, Laden-Kopf (Markise, Münze, Taler),
  Figuren immer leicht animiert, Ersteller-Hinweis bleibt.
- Keine Krankheits-, Pflege-, Einsamkeits- oder Todesthemen, nichts Belehrendes, keine Altersmarker.
- Gesperrte Dateien: `data-brevvan.js` (Schwedisch-Lektorat), `data-anrufe.js` und `data-anrufe2.js` – nur nach Absprache.
- Nicht anfassen ohne Pixelvergleich: Szenen-Geometrie in scene.js. Ohne Absprache nicht ändern: Service-Worker-Strategie,
  `KEY`, Sicherungsformat, Notfall-Ansicht.
