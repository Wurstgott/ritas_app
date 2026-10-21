#!/usr/bin/env python3
"""Fügt app.html + app.css + data.js + app.js zu EINER Datei zusammen.
dist/app.html  -> Artifact-Fassung (vollständiges Dokument, ohne PWA-Verweise)
repo/index.html -> GitHub-Pages-Fassung mit manifest + Icons (PWA)
"""
import datetime, pathlib, re, json
d = pathlib.Path(__file__).parent
stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

shell = (d / "app.html").read_text()
css = (d / "fonts.css").read_text() + (d / "app.css").read_text()
data = "\n".join((d / f).read_text() for f in ["data.js","data-orte.js","data-inhalte.js","data-laden.js","data-korrektur.js","data-sprache.js","data-lektorat.js","data-angebote.js"] if (d / f).exists())
app = "\n".join((d / f).read_text() for f in ["core.js","figuren.js","scene.js","views.js","ruheplan.js","game.js","main.js"]).replace("__BUILD__", stamp)
body = shell.replace("/*CSS*/", css).replace("/*DATA*/", data).replace("/*APP*/", app)

HEAD_COMMON = """<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
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
