/* ============================================================
   Kleiderschrank: Outfits für Rita und Hühnchen (Taler), Kramladen als Laden,
   Taler-Plakette, Sammelreihen, Fest-Geschenke, Halte-Hinweise, Figuren-Memory.
   Die Figuren selbst (figuren.js) bleiben unverändert – Skins sind Zusätze,
   die figuren.js über skinSchichten() an festen Stellen einsetzt.
   ============================================================ */

/* ---------- Mini-Zeichensprache: dieselben Formen für SVG und Canvas ---------- */
const SP = (d, f, o) => ["p", d, f, o || {}];                       // Pfad
const SL = (d, farbe, w, o) => ["p", d, null, { s: farbe, w, ...(o || {}) }]; // Linie
const SC = (cx, cy, r, f, o) => ["c", cx, cy, r, f, o || {}];          // Kreis
const SE = (cx, cy, rx, ry, f, o) => ["e", cx, cy, rx, ry, f, o || {}]; // Ellipse (o.rot in Grad)
function skAttr(f, o) {
  let a = ` fill="${f || "none"}"`;
  if (o.s) a += ` stroke="${o.s}" stroke-width="${o.w || 1}" stroke-linecap="round" stroke-linejoin="round"`;
  if (o.op != null) a += ` opacity="${o.op}"`;
  if (o.cls) a += ` class="${o.cls}"`;
  return a;
}
function skinSVG(ls) {
  return (ls || []).map(l => l[0] === "p" ? `<path d="${l[1]}"${skAttr(l[2], l[3])}/>`
    : l[0] === "c" ? `<circle cx="${l[1]}" cy="${l[2]}" r="${l[3]}"${skAttr(l[4], l[5])}/>`
    : `<ellipse cx="${l[1]}" cy="${l[2]}" rx="${l[3]}" ry="${l[4]}"${l[6].rot ? ` transform="rotate(${l[6].rot} ${l[1]} ${l[2]})"` : ""}${skAttr(l[5], l[6])}/>`).join("");
}
const SK_PFAD = new Map();
function skinCanvas(ctx, ls) {
  for (const l of ls || []) {
    const o = l[l.length - 1], f = l[0] === "p" ? l[2] : l[0] === "c" ? l[4] : l[5];
    let p;
    if (l[0] === "p") { p = SK_PFAD.get(l[1]); if (!p) { p = new Path2D(l[1]); SK_PFAD.set(l[1], p); } }
    else { p = new Path2D(); if (l[0] === "c") p.arc(l[1], l[2], l[3], 0, Math.PI * 2); else p.ellipse(l[1], l[2], l[3], l[4], (o.rot || 0) * Math.PI / 180, 0, Math.PI * 2); }
    ctx.save(); if (o.op != null) ctx.globalAlpha *= o.op;
    if (f) { ctx.fillStyle = f; ctx.fill(p); }
    if (o.s) { ctx.strokeStyle = o.s; ctx.lineWidth = o.w || 1; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke(p); }
    ctx.restore();
  }
}
/* kleine Blüte aus Kreisen */
const skBluete = (x, y, r, farbe, mitte = "#F2C33A", n = 5) => { const a = []; for (let i = 0; i < n; i++) { const w = i / n * Math.PI * 2 - Math.PI / 2; a.push(SC(+(x + Math.cos(w) * r * .95).toFixed(2), +(y + Math.sin(w) * r * .95).toFixed(2), +(r * .62).toFixed(2), farbe)); } a.push(SC(x, y, +(r * .5).toFixed(2), mitte)); return a; };
const skPerlen = (pts, r) => pts.flatMap(([x, y]) => [SC(x, y, r, "#F6F1E4"), SC(x - r * .35, y - r * .35, r * .35, "#FFFFFF", { op: .9 })]);
const skFlamme = (x, y, s = 1) => [SP(`M${x} ${y - 6 * s} Q${x + 2.6 * s} ${y - 2.6 * s} ${x + 1.8 * s} ${y - .6 * s} Q${x} ${y + 1.2 * s} ${x - 1.8 * s} ${y - .6 * s} Q${x - 2.6 * s} ${y - 2.6 * s} ${x} ${y - 6 * s}Z`, "#F6B93B", { cls: "skin-flamme" }), SE(x, y - 1.6 * s, .9 * s, 1.6 * s, "#FFF1B8", { cls: "skin-flamme" })];
const skKerze = (x, yo, h, w = 3.4) => [SP(`M${x - w / 2} ${yo} h${w} v${h} h${-w}Z`, "#FBF6EA"), SP(`M${x + w / 2 - 1} ${yo} h1 v${h} h-1Z`, "#E6DCC4"), ...skFlamme(x, yo - .4, 1)];

/* ---------- Die Teile ----------
   fach: kopf (Hüte & Kränze) · augen (Brillen) · hals (Schals & Schmuck) · ganz (Kostüme)
   Rita: r.hinten (hinter dem Haar) / r.vorn · Hühnchen von der Seite (auch Kopfbild & Bild): s.hinten / s.koerper / s.kopf · von vorn: f.kopf
   Koordinaten: Rita 0–100 (Augen y 47,6, Haaransatz y 15–28), Hühnchen seitlich 0–100 (Kopf x 48–80, Auge 65/31), vorn Mitte x 68, Augen y 31. */
const SKIN_FAECHER = [
  { id: "kopf", name: "Hüte und Kränze" }, { id: "augen", name: "Brillen" }, { id: "hals", name: "Schals und Schmuck" }, { id: "ganz", name: "Ganze Outfits" }
];
const SKIN_REIHEN = [
  { id: "tanzsaal", name: "Tanzsaal", ids: ["r-tangorose", "r-federboa", "r-perlen", "h-fliege"], bonus: 50, satz: "Musik an, Licht runter. Hühnchen hat sich die Fliege schon dreimal zurechtgerückt." },
  { id: "schweden", name: "Schwedische Reihe", ids: ["r-lucia", "r-midsommar", "r-strick", "r-dalapferd", "h-wikinger", "h-elch"], bonus: 50, satz: "Alles komplett für Schweden. Karin würde sagen: „Nu är du nästan svensk.“" },
  { id: "krimi", name: "Krimi-Reihe", ids: ["r-kommissarin", "h-detektiv", "h-sonnenbrille", "r-katzenauge"], bonus: 50, satz: "Die Ermittlungsgruppe ist vollständig. Der Fall kann kommen." },
  { id: "welt", name: "Hühnchens Weltreise", ids: ["h-chullo", "h-pirat", "h-astronaut", "h-taucher"], bonus: 50, satz: "Einmal um die Welt und zurück auf die Fensterbank. Hühnchen hat nicht mal Jetlag." },
  { id: "sommer", name: "Sommerfrische", ids: ["r-sonnenhut", "r-sonnenbrille", "h-strohhut", "h-schleife"], bonus: 50, satz: "Fertig für die Sommerfrische. Fehlt nur noch der Sommer." },
  { id: "winter", name: "Winterfein", ids: ["r-bommel", "r-zauberschal", "r-ohrenwaermer", "h-schal"], bonus: 50, satz: "Warm eingepackt bis zur Nasenspitze. Hühnchen wickelt sich den Schal heute doppelt." },
  { id: "buehne", name: "Bühne frei", ids: ["h-cape", "h-hexe", "h-zylinder", "h-party"], bonus: 50, satz: "Einmal alles für die große Bühne. Hühnchen verbeugt sich schon." }
];
const D_SKINS = [
  /* ===== Rita ===== */
  { id: "r-sonnenbrille", fuer: "rita", fach: "augen", name: "Sonnenbrille", preis: 40, text: "Dunkel, rund, ein bisschen Hollywood. Wer dahinter sitzt, muss nicht jeden grüßen.",
    r: { vorn: [SP("M37.4 44.4 Q37.4 43.4 38.6 43.4 H48 Q49.2 43.4 49 44.8 L48.4 49.2 Q48 51.8 45 51.8 H41.2 Q38.2 51.8 37.8 49.2Z M62.6 44.4 Q62.6 43.4 61.4 43.4 H52 Q50.8 43.4 51 44.8 L51.6 49.2 Q52 51.8 55 51.8 H58.8 Q61.8 51.8 62.2 49.2Z", "#1E262C"),
      SL("M49 45.4 Q50 44.4 51 45.4", "#1E262C", 1.3), SL("M37.6 45.2 L34 44.4 M62.4 45.2 L66 44.4", "#1E262C", 1.2),
      SL("M37.6 44.2 H48.6 M51.4 44.2 H62.4", "#C9A24A", .7), SL("M39.8 45.4 L43.2 45 M53.2 45.4 L56.6 45", "#FFFFFF", .9, { op: .65 })] } },
  { id: "r-katzenauge", fuer: "rita", fach: "augen", name: "Katzenaugen-Brille", preis: 60, reihe: "krimi", text: "Rot, mit Schwung nach oben wie in den Sechzigern. So eine trägt im Krimi immer die Sekretärin, die als Erste weiß, wer’s war.",
    r: { vorn: [SP("M36 44 Q42 42.2 48.6 43.6 Q49 48.8 46.4 51.2 Q42.4 52.6 39.2 50.6 Q36.6 48.4 36 44Z M64 44 Q58 42.2 51.4 43.6 Q51 48.8 53.6 51.2 Q57.6 52.6 60.8 50.6 Q63.4 48.4 64 44Z", "rgba(255,255,255,.18)", { s: "#C0282A", w: 1.7 }),
      SP("M36.4 44.6 L33.2 40.8 L39.4 43.2Z M63.6 44.6 L66.8 40.8 L60.6 43.2Z", "#C0282A"), SL("M48.6 44.8 Q50 43.6 51.4 44.8", "#C0282A", 1.4),
      SC(34.4, 41.8, .7, "#FFF6DC"), SC(65.6, 41.8, .7, "#FFF6DC")] } },
  { id: "r-perlen", fuer: "rita", fach: "hals", name: "Perlen wie damals am Schalter", preis: 70, reihe: "tanzsaal", text: "Kette und Ohrringe wie damals am Schalter. Heute ohne Kundschaft, dafür mit Hühnchen.",
    r: { vorn: [...skPerlen([[41.2, 77], [43.2, 79.6], [45.5, 81.5], [47.8, 82.6], [50.2, 83], [52.6, 82.6], [54.9, 81.5], [57.1, 79.6], [59, 77]], 1.55), SC(31, 60.4, 3.3, "#F6F1E4"), SC(30, 59.3, 1, "#FFFFFF", { op: .9 }), SC(69, 60.4, 3.3, "#F6F1E4"), SC(68, 59.3, 1, "#FFFFFF", { op: .9 })] } },
  { id: "r-zauberschal", fuer: "rita", fach: "hals", name: "Zauberschal", preis: 60, reihe: "winter", text: "Rot-gold geringelt wie in Gryffindor, lang genug für zweimal rum. Zaubern kann er nicht. Bis jetzt.",
    r: { vorn: [SP("M36.5 73.6 Q50 82.6 63.5 73.6 L65 80 Q50 89.6 35 80Z", "#8E2430"),
      SP("M39.5 75.6 L42.6 77.2 L42.2 84 L38.6 82.6Z M46.4 78.6 L49.6 79.2 L49.6 86 L46 85.6Z M53.4 78.8 L56.6 78 L57.4 84.8 L53.8 85.6Z M60.2 76 L63 74.6 L64 80.8 L60.8 82.6Z", "#E2B13C"),
      SP("M38.6 80.6 L33 100 L41.4 100.5 L44.4 82.6Z", "#8E2430"), SP("M36.6 87.4 L42.8 89.2 L42 92 L35.8 90.2Z M34.6 94 L41.2 95.6 L40.6 98.6 L33.8 97Z", "#E2B13C")] } },
  { id: "r-sonnenhut", fuer: "rita", fach: "kopf", name: "Sonnenhut", preis: 100, reihe: "sommer", saison: [5, 6, 7, 8], text: "Breite Strohkrempe, rotes Band, eine Margerite. Für den Balkon und die Fahrt zum Hofladen.",
    r: { vorn: [SE(50, 29, 33, 4.6, "rgba(70,50,20,.18)"), SE(50, 25.6, 40.5, 8.8, "#E7C77C"), SP("M9.6 26.4 Q50 40.4 90.4 26.4 Q50 35.8 9.6 26.4Z", "#C9A456"),
      SP("M31.6 25.2 Q30.6 8.6 50 7.6 Q69.4 8.6 68.4 25.2 Q50 28.4 31.6 25.2Z", "#F0D48F"), SL("M35.2 13.6 Q50 11.2 64.8 13.6 M33.2 17.6 Q50 15.4 66.8 17.6", "#D2B06A", .6),
      SP("M32.1 20.4 Q50 23.8 67.9 20.4 L68.4 25.2 Q50 28.4 31.6 25.2Z", "#C9563A"), ...skBluete(35.4, 23.2, 2.7, "#FBF8EE")] } },
  { id: "r-bommel", fuer: "rita", fach: "kopf", name: "Bommelmütze", preis: 80, reihe: "winter", saison: [11, 12, 1, 2], text: "Rot gestrickt, mit weißem Bommel. Für Tage, an denen der Forst nach Schnee riecht.",
    r: { vorn: [SP("M26.6 31 Q25.4 9.6 50 8.4 Q74.6 9.6 73.4 31Z", "#C8463B"),
      SL("M36 29 Q34.8 19 39.4 11.6 M43.4 29 Q42.8 18 45.2 9.4 M50 29 L50 8.8 M56.6 29 Q57.2 18 54.8 9.4 M64 29 Q65.2 19 60.6 11.6", "#A9382F", .9, { op: .7 }),
      ...[32, 38, 44, 50, 56, 62, 68].map((x, i) => SC(x, i % 2 ? 19.2 : 20.4, .95, "#F7F1E6")),
      SP("M25.2 26.2 Q50 21.6 74.8 26.2 L75.4 34 Q50 29.4 24.6 34Z", "#EFE7D6"), SL("M30 25.6 L29.6 32.4 M36 24.4 L35.8 31.2 M42 23.6 L42 30.4 M48 23.2 L48 30 M54 23.2 L54 30 M60 23.6 L60.2 30.4 M66 24.4 L66.4 31.2 M71 25.4 L71.4 32.2", "#D6CCB8", 1),
      SC(50, 7.2, 6.4, "#F7F2E8"), SC(47.6, 5.2, 2, "#FFFFFF"), SC(53.4, 8.6, 1.6, "#E6DED0")] } },
  { id: "r-barett", fuer: "rita", fach: "kopf", name: "Maler-Barett", naechst: "das Maler-Barett", preis: 90, text: "Ein rotes Barett, ein Pinsel hinterm Ohr und ein paar Farbkleckse. Fehlt nur noch die Staffelei.",
    r: { vorn: [SE(46, 20, 23.5, 8.6, "#B83A2E", { rot: -10 }), SP("M24 24.6 Q46 30.6 68.6 19.4", null, { s: "#8E2A22", w: 2.6 }), SL("M44.6 11.8 L43.6 8.2", "#8E2A22", 1.8),
      SE(40, 16.6, 8, 2.4, "#CF4A3C", { rot: -14, op: .8 }),
      SL("M63.6 41 L76 24.6", "#8A5A2B", 1.7), SP("M73.6 27.6 L75.8 24.8 L77.4 26 L75.2 28.8Z", "#B8B8B0"), SP("M75.6 25 Q78.4 20.8 80 19.8 Q80.4 21.8 77.2 26.2Z", "#3E7FB8"),
      SC(28, 91, 2.6, "#3E7FB8"), SC(33.4, 95.4, 1.9, "#E8C23A"), SC(71.4, 92.4, 2.3, "#5BA35A"), SC(25.4, 96.6, 1.4, "#E8C23A"), SC(61.6, 57.6, .9, "#3E7FB8", { op: .8 })] } },
  { id: "r-helm", fuer: "rita", fach: "kopf", name: "Roller-Helm mit Blitz", preis: 120, text: "Für die nächste Runde mit dem Voi-Roller. Der Blitz macht nicht schneller. Hühnchen hat nachgemessen.",
    r: { vorn: [SP("M25.6 32.6 Q23.8 8.6 50 6.8 Q76.2 8.6 74.4 32.6 Q50 27.4 25.6 32.6Z", "#2F8F8A"), SP("M27 22 Q30 11.6 42 8.4 Q32 13 29.6 23Z", "#46ABA5", { op: .8 }),
      SL("M38.6 11.6 Q40.4 18 39.4 25.8 M61.4 11.6 Q59.6 18 60.6 25.8", "#1E5E5A", 2.2), SP("M53.6 11 L47.4 19.6 L51.6 19.6 L46.6 28.6 L56.6 17.4 L52.2 17.4 L56.6 11Z", "#F2C33A"),
      SP("M27.4 30.4 Q50 25.2 72.6 30.4 L73.4 34 Q50 29 26.6 34Z", "#1E4E4A"), SL("M27.8 34 L30.4 54 M72.2 34 L69.6 54", "#1E2A2A", 1)] } },
  { id: "r-lucia", fuer: "rita", fach: "kopf", name: "Lucia-Kranz", preis: 120, reihe: "schweden", saison: [12], text: "Preiselbeerkranz mit fünf Kerzen, wie am 13. Dezember in Schweden. Dazu summt man „Sankta Lucia“. Die Flammen flackern mit.",
    r: { vorn: [SL("M23.6 25 Q50 15.6 76.4 25", "#3F6B3A", 3.6), ...skKerze(34.6, 14.4, 9), ...skKerze(42.2, 11.6, 11), ...skKerze(50, 10.4, 12), ...skKerze(57.8, 11.6, 11), ...skKerze(65.4, 14.4, 9),
      SP("M23 24.6 Q50 34.6 77 24.6 Q50 29 23 24.6Z", "#3F6B3A"), ...[[25.6, 24.6], [30.4, 28], [37, 30.2], [44, 31], [51, 31.2], [58, 30.8], [64.8, 29.8], [70.6, 27.6], [74.6, 24.4], [33, 31.4], [67, 31.2]].map(([x, y], i) => SE(x, y, 3.6, 1.8, i % 2 ? "#4F8A45" : "#5D9A50", { rot: i % 2 ? 24 : -20 })),
      ...[[28.6, 26.6], [40.4, 30], [47.4, 31.4], [54.6, 31.2], [61.4, 30.2], [72.2, 26.4], [35, 32.6], [65, 32.4]].map(([x, y]) => SC(x, y, 1.2, "#C8363A"))] } },
  { id: "r-midsommar", fuer: "rita", fach: "kopf", name: "Midsommar-Kranz", preis: 100, reihe: "schweden", saison: [6], text: "Ein Blumenkranz wie zu Midsommar, mit Bändern hinten. In Schweden tanzt man um die Mittsommerstange. Um den Couchtisch geht auch.",
    r: { hinten: [SL("M72 30 Q81 50 77 72", "#6E8BD0", 2.4), SL("M74.6 29 Q85 46 83 68", "#F2D27A", 2.4)],
      vorn: [SL("M22.6 23.6 Q50 33 77.4 23.6", "#4E7F45", 2.8), ...[[27, 25.4], [35, 28.6], [43, 30.4], [57, 30.4], [65, 28.6], [73, 25.4]].map(([x, y], i) => SE(x, y, 2.8, 1.3, "#5D9A50", { rot: i < 3 ? 18 : -18 })),
      ...skBluete(23.6, 23.2, 2.9, "#FBF8EE"), ...skBluete(31, 27.2, 2.9, "#C7B6E6", "#F2E3A0"), ...skBluete(39.4, 29.6, 3.1, "#F2D27A", "#E09A3A"), ...skBluete(50, 30.6, 3.4, "#FBF8EE"),
      ...skBluete(60.6, 29.6, 3.1, "#E9A0B8", "#F2E3A0"), ...skBluete(69, 27.2, 2.9, "#C7B6E6", "#F2E3A0"), ...skBluete(76.4, 23.2, 2.9, "#F2D27A", "#E09A3A")] } },
  { id: "r-ohrenwaermer", fuer: "rita", fach: "kopf", name: "Ohrenwärmer", preis: 70, reihe: "winter", ab: "2026-12", saison: [12, 1, 2], text: "Flauschig, flieder, mit Bügel übers Haar. Hält warm und sieht aus wie zwei kleine Wolken.",
    r: { vorn: [SL("M28 52 Q24 14 50 12 Q76 14 72 52", "#7E5A92", 3.4), SL("M29 46 Q27 19 50 16.8", "#9C7AAE", 1, { op: .8 }),
      ...[[29, 56.4, 7.6], [71, 56.4, 7.6]].flatMap(([x, y, r]) => [SC(x, y, r, "#E7DCEF"), SC(x - 4.6, y - 4.4, 3, "#F1EAF6"), SC(x + 4.4, y - 4.4, 3, "#F1EAF6"), SC(x - 5.4, y + 2.6, 3, "#E0D3EA"), SC(x + 5.4, y + 2.6, 3, "#E0D3EA"), SC(x, y + 5.6, 3, "#E0D3EA"), SC(x - 1.4, y - 1.6, 2.2, "#FFFFFF", { op: .7 })])] } },
  { id: "r-konfetti", fuer: "rita", fach: "augen", name: "Konfetti-Brille", preis: 60, ab: "2027-02", saison: [2], text: "Zwei pinke Sterne als Brille, dazu Konfetti. Für Fasching. Oder für einen Dienstag, der’s nötig hat.",
    r: { vorn: [SP("M43 40.4 L44.8 44.4 L49.2 44.6 L45.8 47.4 L47 51.6 L43 49.2 L39 51.6 L40.2 47.4 L36.8 44.6 L41.2 44.4Z M57 40.4 L58.8 44.4 L63.2 44.6 L59.8 47.4 L61 51.6 L57 49.2 L53 51.6 L54.2 47.4 L50.8 44.6 L55.2 44.4Z", "rgba(255,255,255,.2)", { s: "#E0558A", w: 1.8 }),
      SL("M48.8 46.4 Q50 45.4 51.2 46.4", "#E0558A", 1.3), SL("M36.8 45 L31.6 43.8 M63.2 45 L68.4 43.8", "#E0558A", 1.1),
      ...[[22, 30, "#3E7FB8"], [78, 34, "#F2C33A"], [26, 78, "#5BA35A"], [80, 74, "#E0558A"], [16, 54, "#F2C33A"], [84, 54, "#3E7FB8"]].map(([x, y, c], i) => SP(`M${x} ${y} l2.4 ${i % 2 ? -1 : 1} l.6 1.8 l-2.4 ${i % 2 ? 1 : -1}Z`, c))] } },
  { id: "r-blumen", fuer: "rita", fach: "kopf", name: "Blumen im Haar", preis: 70, ab: "2027-04", saison: [4, 5], text: "Drei Blüten und zwei Blätter, seitlich ins Haar gesteckt. Die Amseln am Forst halten dich jetzt für eine von ihnen.",
    r: { vorn: [SE(31.4, 30.4, 4.6, 2, "#5D9A50", { rot: -40 }), SE(38.4, 22, 4.2, 1.8, "#4F8A45", { rot: 30 }), ...skBluete(30.6, 24, 4, "#E9A0B8", "#F2E3A0"), ...skBluete(37.4, 27.6, 3, "#FBF8EE"), ...skBluete(26.6, 31.6, 2.6, "#C7B6E6", "#F2E3A0")] } },
  { id: "r-strick", fuer: "rita", fach: "ganz", name: "Schwedenpulli", preis: 150, reihe: "schweden", text: "Dunkelblau mit weißer Bordüre und Rollkragen. Darin liest sich ein Schwedenkrimi gleich doppelt so spannend.",
    r: { vorn: [SP("M12.6 100 Q14.6 77.6 50 75.2 Q85.4 77.6 87.4 100Z", "#2E4E8E"),
      SP("M14.2 88.6 Q50 83 85.8 88.6 L86.4 96 Q50 90.4 13.6 96Z", "#26427A"),
      ...[18, 25, 32, 39, 46, 53, 60, 67, 74, 81].map((x, i) => SP(`M${x} ${92.2 - Math.sin((x - 14) / 72 * Math.PI) * 4.6} l2.4 -2.8 l2.4 2.8 l-2.4 2.8Z`, "#F3EDE0")),
      ...[21.5, 35.5, 49.5, 63.5, 77.5].map(x => SC(x, 85.8 - Math.sin((x - 14) / 72 * Math.PI) * 4, .8, "#F3EDE0")),
      SP("M39.4 73.4 Q50 78.6 60.6 73.4 L61.8 80.4 Q50 86.6 38.2 80.4Z", "#3A5C9E"), SL("M41 76 L40.6 81 M44.6 77.4 L44.4 82.6 M48.4 78 L48.4 83.4 M52 78 L52 83.4 M55.6 77.4 L55.8 82.6 M59.2 76 L59.6 81", "#2E4E8E", .9)] } },
  { id: "r-kommissarin", fuer: "rita", fach: "ganz", name: "Kommissarin", naechst: "den Kommissarinnen-Mantel", preis: 220, reihe: "krimi", text: "Trenchcoat mit hochgestelltem Kragen, Hut und Notizblock. In Ystad hätten sie dich längst eingestellt.",
    r: { vorn: [SP("M11.6 100 Q13.4 79 39.6 75.4 L50 88.6 L60.4 75.4 Q86.6 79 88.4 100Z", "#C8AE7E"),
      SP("M39.6 75.4 L34.4 69.8 L32.6 79.4 L44.2 88.8 L50 88.6Z", "#B39663"), SP("M60.4 75.4 L65.6 69.8 L67.4 79.4 L55.8 88.8 L50 88.6Z", "#B39663"),
      SP("M24 92 Q50 96 76 92 L76 95.6 Q50 99.6 24 95.6Z", "#A88A58"), SC(44.6, 93.2, 1.2, "#6B4E2E"), SC(55.4, 93.2, 1.2, "#6B4E2E"),
      SP("M70.4 84.6 L80.6 83.4 L82 96 L71.8 97.2Z", "#FBF6EA"), SL("M72.6 87.4 L79.6 86.6 M72.9 90 L79.9 89.2 M73.2 92.6 L80.2 91.8", "#9AA3B0", .7),
      SE(50, 24.4, 31, 5.6, "#4A3A2E"), SP("M32 23.6 Q31 9.4 50 8.6 Q69 9.4 68 23.6 Q50 26.2 32 23.6Z", "#5E4A3A"),
      SL("M43.6 10.4 Q50 14.2 56.4 10.4", "#4A3A2E", 1.3), SP("M32.3 19.4 Q50 22.4 67.7 19.4 L68 23.6 Q50 26.2 32 23.6Z", "#2E241C")] } },
  { id: "r-forscherin", fuer: "rita", fach: "ganz", name: "Forscherin", naechst: "die Forscherinnen-Ausrüstung", preis: 200, ab: "2027-07", text: "Hellgrüner Tropenhut und ein Fernglas um den Hals. Für die Kraniche über dem Forst – und ganz unauffällig für den Nachbarn.",
    r: { vorn: [SE(50, 24.6, 35, 6.6, "#A9B58A"), SP("M10 24.6 Q50 36 90 24.6 Q50 32 10 24.6Z", "#8E9A6E"), SP("M30.4 24 Q29.4 6.6 50 6 Q70.6 6.6 69.6 24 Q50 27 30.4 24Z", "#BCC89C"),
      SP("M30.8 19.4 Q50 22.6 69.2 19.4 L69.6 24 Q50 27 30.4 24Z", "#6E5A3A"), SL("M38 12 Q50 9.8 62 12", "#A9B58A", .8),
      SL("M41 76 Q46 86 45.4 90 M59 76 Q54 86 54.6 90", "#4A3A2E", 1.1), SP("M40.4 88.6 H48.6 V98.6 H40.4Z M51.4 88.6 H59.6 V98.6 H51.4Z", "#2E3238"), SP("M48.6 91 H51.4 V95 H48.6Z", "#4A4E56"),
      SC(44.5, 97.4, 2.6, "#7FA7B5"), SC(55.5, 97.4, 2.6, "#7FA7B5")] } },
  /* Laden-Lektorat: Tanzsaal, Schweden, Harry Potter, Herbst */
  { id: "r-tangorose", fuer: "rita", fach: "kopf", name: "Tango-Rose", preis: 70, reihe: "tanzsaal", ab: "2026-10", text: "Eine rote Rose überm Ohr. Damit lernt selbst Hühnchen den Ocho. Zumindest guckt es so.",
    r: { vorn: [SE(65.6, 41.6, 4.4, 1.9, "#4F8A45", { rot: 38 }), SE(76.4, 41.2, 4, 1.7, "#5D9A50", { rot: -34 }), SL("M71 41 L71.6 46", "#4F8A45", 1),
      SC(71, 35.6, 6, "#A51E28"), SC(71, 35.4, 4.6, "#C8303A"), SL("M71.2 32.4 Q74.4 33.4 73.6 36.6 Q71.6 39 69 37 Q68.6 34.6 71 34.4 Q72.4 35.2 71.4 36.4", "#86141E", 1.1), SC(69, 33.4, 1.1, "#F0707A", { op: .6 })] } },
  { id: "r-federboa", fuer: "rita", fach: "hals", name: "Federboa", preis: 110, reihe: "tanzsaal", ab: "2026-10", text: "Für die Damenwahl. Hühnchen guckt die Federn misstrauisch an. Verwandtschaft?",
    r: { vorn: [...[[25, 85], [27.4, 92], [26, 99], [29, 80], [33, 82.6], [37, 84.8], [41, 86.6], [45, 87.8], [50, 88.4], [55, 87.8], [59, 86.6], [63, 84.8], [67, 82.6], [71, 80], [74, 85.6], [73.6, 92.4], [75, 99]].flatMap(([x, y], i) => [
      SE(x - 1.6, y + .6, 4.6, 2.6, "#D96A98", { rot: (i * 47) % 180 }), SE(x + 1.4, y - .8, 4.4, 2.4, "#EE93B6", { rot: (i * 71 + 30) % 180 }), SE(x, y, 3, 1.8, "#F7BFD3", { rot: (i * 29 + 60) % 180 })])] } },
  { id: "r-zauberbrille", fuer: "rita", fach: "augen", name: "Runde Zauberbrille", preis: 50, ab: "2026-10", text: "Rund, mit dünnem Goldrand. Ein Junge aus dem Schrank unter der Treppe hat so eine. Dir steht sie besser.",
    r: { vorn: [SC(43.5, 47.6, 5.2, "rgba(255,255,255,.14)", { s: "#B8902E", w: 1.2 }), SC(56.5, 47.6, 5.2, "rgba(255,255,255,.14)", { s: "#B8902E", w: 1.2 }),
      SL("M48.6 46.6 Q50 45.4 51.4 46.6", "#B8902E", 1.1), SL("M38.4 46.8 L33 45.4 M61.6 46.8 L67 45.4", "#B8902E", 1), SL("M40.6 45.6 Q41.6 44.4 43 44.2 M53.6 45.6 Q54.6 44.4 56 44.2", "#FFFFFF", .8, { op: .7 })] } },
  { id: "r-dalapferd", fuer: "rita", fach: "hals", name: "Dalapferd-Brosche", preis: 50, reihe: "schweden", ab: "2026-10", text: "Ein rotes Pferdchen aus Dalarna. In Schweden steht es auf jedem zweiten Fensterbrett, bei dir am Kragen.",
    r: { vorn: [SC(59.6, 86.4, 7, "#F6EBD0", { s: "#C9A24A", w: 1.1 }),
      SP("M55.2 87 L56.6 85 L61 85 L62 82.8 L61.4 81 L63.2 81.2 L64.8 82.8 L64.4 84.4 L63.4 84.6 L62.8 86.8 L62.8 91 L61.6 91 L61.4 88.4 L57.2 88.4 L57 91 L55.8 91 L55.8 88.2Z", "#C8363A"),
      SL("M57.4 86.2 Q59 85.2 60.6 86.2", "#FBF8F1", .8), SC(59, 87.2, .55, "#3E7FB8"), SC(61.6, 83.6, .5, "#FBF8F1"), SL("M62.2 82 Q63 81 64 82", "#F2C33A", .6)] } },
  { id: "r-herbstbarett", fuer: "rita", fach: "kopf", name: "Herbst-Barett", naechst: "das Herbst-Barett", preis: 70, saison: [9, 10, 11], ab: "2026-10", text: "Rostrot, mit einem Eichenblatt vom Forst. Passt zu Kranichen und zu Pfützen.",
    r: { vorn: [SE(47, 20.4, 24, 8.4, "#A9532A", { rot: -8 }), SP("M24.4 25 Q47 30.6 69.6 20.6", null, { s: "#7E3A1C", w: 2.6 }), SL("M46 12 L45.2 8.6", "#7E3A1C", 1.8), SE(41, 17, 8.4, 2.4, "#C0683A", { rot: -12, op: .7 }),
      SP("M57 19.4 Q55.6 16.6 57.8 15.6 Q57 13.4 59.4 13.2 Q59.4 11 61.8 11.4 Q62.8 9.4 64.8 10.6 Q66.4 11.8 64.8 13.4 Q66.8 14.4 65 16 Q65.8 17.8 63.4 17.8 Q62.6 19.8 60.2 18.8 Q58.8 20.4 57 19.4Z", "#D9A13A"),
      SL("M57.6 19 L64.4 11.4", "#A8741E", .8), SL("M57.6 19 L56 21", "#A8741E", 1)] } },
  { id: "r-krone", fuer: "rita", fach: "kopf", name: "Geburtstagskrone", geschenk: "geburtstag", text: "Hühnchen hat sie poliert. Am Geburtstag setzt sie sich von selbst auf – danach gehört sie dir für immer.",
    r: { vorn: [SP("M31 25.4 L28.6 8.6 L38 16.6 L44 5.8 L50 14.6 L56 5.8 L62 16.6 L71.4 8.6 L69 25.4 Q50 22.4 31 25.4Z", "#E8B83A"), SP("M33 22.6 L31.6 12.6 L37.6 18 Z M67 22.6 L68.4 12.6 L62.4 18Z", "#F6D77A", { op: .7 }),
      SP("M31 25.4 Q50 22.4 69 25.4 L69.4 29 Q50 26 30.6 29Z", "#D49A22"), SC(40, 26, 1.6, "#C8363A"), SC(50, 24.8, 1.9, "#3E7FB8"), SC(60, 26, 1.6, "#C8363A"),
      ...[[28.6, 8.6], [44, 5.8], [56, 5.8], [71.4, 8.6]].map(([x, y]) => SC(x, y, 1.4, "#F6D77A"))] } },

  /* ===== Hühnchen ===== */
  { id: "h-schleife", fuer: "huhn", fach: "kopf", name: "Große Schleife", preis: 30, reihe: "sommer", geschenk: "start", text: "Pink mit Punkten, hinten am Kopf. Hühnchen sagt, sie sei „gar nicht so wichtig“. Guckt aber dauernd in den Spiegel.",
    s: { kopf: [SP("M49 20 L39.6 13.6 Q36.6 20.4 40 26.6Z", "#E0558A"), SP("M49 20 L56.4 14.6 Q59.6 20 56.8 25.6Z", "#E0558A"), SP("M47.6 22 L44.4 30 L47.4 29.2 L49.4 22.6Z", "#C7437A"),
      SC(41, 17, .9, "#FFF"), SC(40.8, 23, .9, "#FFF"), SC(54.8, 18, .8, "#FFF"), SC(55.6, 22.6, .8, "#FFF"), SC(49, 20, 2.8, "#C7437A")] },
    f: { kopf: [SP("M80 19 L72.6 13.4 Q70.4 19 73 24.4Z", "#E0558A"), SP("M80 19 L87.4 13 Q90.4 19 87.4 24.8Z", "#E0558A"), SC(74, 16.6, .8, "#FFF"), SC(86.6, 17, .8, "#FFF"), SC(86.8, 22, .8, "#FFF"), SC(80, 19, 2.6, "#C7437A")] } },
  { id: "h-sonnenbrille", fuer: "huhn", fach: "augen", name: "Undercover-Brille", preis: 40, reihe: "krimi", text: "Hühnchen ist jetzt inkognito. Dass es trotzdem jeder erkennt, findet es unerklärlich.",
    s: { kopf: [SL("M56 27.6 L47.6 26.4", "#1C2620", 1.6), SP("M56 25.6 H73.4 Q75 25.6 74.6 27.6 L73.2 35 Q72.6 37.8 69.4 37.8 H60 Q57 37.8 56.4 35 L55 27.6 Q54.8 25.6 56 25.6Z", "#1C2620"),
      SL("M74.4 28.4 L76.6 29", "#1C2620", 1.4), SL("M58.4 28.6 L62.4 28.6", "#FFFFFF", 1.2, { op: .7 })] },
    f: { kopf: [SP("M53.5 26.5 H66 Q66.6 26.5 66.4 27.2 L65 34.5 Q64.5 36.6 62 36.6 H57.6 Q55 36.6 54.4 34.4 L53 27.4 Q52.9 26.5 53.5 26.5Z M70 26.5 H82.5 Q83.1 26.5 83 27.4 L81.6 34.4 Q81 36.6 78.4 36.6 H74 Q71.5 36.6 71 34.5 L69.6 27.2 Q69.4 26.5 70 26.5Z", "#1C2620"), SL("M66 28.4 H70", "#1C2620", 1.6), SL("M55.6 28.6 L58.6 28.6 M72.2 28.6 L75.2 28.6", "#FFFFFF", 1.1, { op: .7 })] } },
  { id: "h-chullo", fuer: "huhn", fach: "kopf", name: "Bommelmütze mit Ohrenklappen", preis: 90, reihe: "welt", deckt: "kamm", text: "Die bunte Strickmütze mit Ohrenklappen. Hühnchen: „Endlich mal was Vernünftiges auf dem Kopf.“",
    s: { kopf: [SP("M48 23 Q46.6 32.6 50.8 37.6 Q55.2 33 55 23.6Z", "#C8363A"), SL("M49 27 L51.6 29.4 L54 27 M49.4 31 L51.6 33.4 L53.8 31", "#F2C33A", 1),
      SL("M50.8 37.6 L50.8 46", "#F2C33A", 1.1), SC(50.8, 47.6, 2.4, "#2FA6A0"),
      SP("M46.8 25 Q45.6 5.8 63 4.6 Q80.4 5.8 79.8 25 Q63 20.6 46.8 25Z", "#C8363A"), SL("M48.2 16.4 L51.2 13.4 L54.2 16.4 L57.2 13.4 L60.2 16.4 L63.2 13.4 L66.2 16.4 L69.2 13.4 L72.2 16.4 L75.2 13.4 L78.2 16.4", "#F2C33A", 1.5),
      SP("M47.2 19.6 Q63 15.6 79.4 19.6 L79.8 25 Q63 20.6 46.8 25Z", "#2FA6A0"), ...[51, 56, 61, 66, 71, 76].map(x => SC(x, 21.8 - Math.sin((x - 47) / 32 * Math.PI) * 1.8, .9, "#FBF6EA")),
      SL("M63 4.6 L63 1.6", "#F2C33A", 1.2), SC(63, 1, 2.2, "#F2C33A")] },
    f: { kopf: [SP("M50.4 24 Q48.6 34 52.6 39.6 Q57 34.4 56.6 25Z M85.6 24 Q87.4 34 83.4 39.6 Q79 34.4 79.4 25Z", "#C8363A"), SL("M52.6 39.6 L52.6 47 M83.4 39.6 L83.4 47", "#F2C33A", 1.1), SC(52.6, 48.6, 2.4, "#2FA6A0"), SC(83.4, 48.6, 2.4, "#2FA6A0"),
      SP("M49.6 26 Q49.4 6 68 4.8 Q86.6 6 86.4 26 Q68 21.6 49.6 26Z", "#C8363A"), SL("M51.4 16.6 L54.4 13.6 L57.4 16.6 L60.4 13.6 L63.4 16.6 L66.4 13.6 L69.4 16.6 L72.4 13.6 L75.4 16.6 L78.4 13.6 L81.4 16.6 L84.4 13.6", "#F2C33A", 1.5),
      SP("M50 20.4 Q68 16.2 86 20.4 L86.4 26 Q68 21.6 49.6 26Z", "#2FA6A0"), ...[54, 60, 66, 72, 78, 83].map(x => SC(x, 22.4 - Math.sin((x - 50) / 36 * Math.PI) * 1.8, .9, "#FBF6EA")), SL("M68 4.8 L68 1.8", "#F2C33A", 1.2), SC(68, 1.2, 2.2, "#F2C33A")] },
    vbKopf: "38 -2 60 60", vbFront: "38 -2 60 60" },
  { id: "h-koch", fuer: "huhn", fach: "kopf", name: "Chefkoch", preis: 100, deckt: "kamm", text: "Hohe Kochmütze, rotes Halstuch, Holzlöffel. Hühnchen kocht nicht, es probiert nur.",
    s: { koerper: [SL("M41.6 66.4 L30.6 50.6", "#A0703F", 2.2), SE(29.4, 48.4, 3, 4.4, "#B07A44", { rot: -34 }), SP("M53.4 47.4 Q63 53.4 72.4 47 L71.4 52.6 Q63 57.8 55 52.8Z", "#D9473A"), SP("M60.4 53.4 L63.4 61.6 L66.8 53.4Z", "#C23A2E"), SC(63.4, 53.4, 2, "#C23A2E")],
      kopf: [SP("M50.4 19.4 Q44 13.4 47.6 7.4 Q49.8 1.2 56 2.6 Q60 -3.4 66.4 -.4 Q72.4 -3.4 75.6 3 Q81.6 7.4 77 19.4 Q63 15.6 50.4 19.4Z", "#FBFAF6"), SL("M55 4.8 Q56.6 10 55.6 15.6 M66 1.8 Q66.8 9 66 15 M74 5.4 Q73 11 72.4 16.4", "#E2DED4", 1.1),
        SP("M50 19 Q63 15.2 77.4 19 L77 24.4 Q63 20.4 50.6 24.4Z", "#F1EDE4"), SL("M51 21.6 Q63 18 76.8 21.6", "#E2DED4", .8)] },
    f: { kopf: [SP("M55 20.4 Q48.6 14.4 52.2 8.4 Q54.4 2.2 60.6 3.6 Q64.6 -2.4 71 .6 Q77 -2.4 80.2 4 Q86.2 8.4 81.6 20.4 Q68 16.6 55 20.4Z", "#FBFAF6"), SL("M59.6 5.8 Q61.2 11 60.2 16.6 M70.6 2.8 Q71.4 10 70.6 16 M78.6 6.4 Q77.6 12 77 17.4", "#E2DED4", 1.1),
      SP("M54.6 20 Q68 16.2 82 20 L81.6 25.4 Q68 21.4 55.2 25.4Z", "#F1EDE4"), SP("M56 50.6 Q68 56.4 80 50.6 L78.6 55.6 Q68 60 57.4 55.6Z", "#D9473A")] },
    hoch: 6, vbKopf: "38 -4 62 62", vbFront: "38 -4 62 62" },
  { id: "h-wikinger", fuer: "huhn", fach: "kopf", name: "Wikinger", preis: 180, reihe: "schweden", deckt: "kamm", text: "Helm mit Hörnern und ein geflochtener Zopf. Echte Wikinger hatten keine Hörner. Hühnchen hat trotzdem welche. „Skål!“ – auch beim Tee.",
    s: { kopf: [SE(48.2, 29.2, 2.8, 3.6, "#E8C66A"), SE(47, 34.8, 2.7, 3.5, "#E2BC5C"), SE(46.4, 40.4, 2.5, 3.3, "#E8C66A"), SC(46.6, 44.4, 1.3, "#C8363A"),
      SP("M53.4 15.6 Q45.6 11.6 43.6 .4 Q41 10.6 49.6 19.6Z", "#EFE6D2"), SP("M72.6 15.6 Q80.4 11.6 82.4 .4 Q85 10.6 76.4 19.6Z", "#EFE6D2"), SL("M45.6 6.6 L47.6 7.4 M80.4 6.6 L78.4 7.4", "#C9BEA4", 1),
      SP("M47.6 24.4 Q46.6 7.6 63 6.6 Q79.4 7.6 78.6 24.4 Q63 20.6 47.6 24.4Z", "#8E959A"), SP("M51 12 Q56 8.6 62 8.2 Q54 11.4 52.2 17Z", "#B4BABE", { op: .8 }),
      SP("M47.4 20.6 Q63 16.8 78.8 20.6 L78.6 25 Q63 21.2 47.6 25Z", "#6E747A"), ...[[51, 22.4], [57, 21.4], [63, 21.1], [69, 21.4], [75, 22.4]].map(([x, y]) => SC(x, y, .95, "#D4D8DB")),
      SP("M76.4 22 L77.8 31 L79.8 30.6 L78.6 22Z", "#6E747A")] },
    f: { kopf: [SE(51.4, 30, 2.8, 3.6, "#E8C66A"), SE(50.6, 35.6, 2.7, 3.5, "#E2BC5C"), SE(50.6, 41.2, 2.5, 3.3, "#E8C66A"), SC(50.8, 45.2, 1.3, "#C8363A"),
      SE(84.6, 30, 2.8, 3.6, "#E8C66A"), SE(85.4, 35.6, 2.7, 3.5, "#E2BC5C"), SE(85.4, 41.2, 2.5, 3.3, "#E8C66A"), SC(85.2, 45.2, 1.3, "#C8363A"),
      SP("M53.6 16.6 Q44.6 12.6 42.4 1.4 Q39.4 12 49.6 21.6Z", "#EFE6D2"), SP("M82.4 16.6 Q91.4 12.6 93.6 1.4 Q96.6 12 86.4 21.6Z", "#EFE6D2"),
      SP("M50.6 25.4 Q49.6 7.8 68 6.8 Q86.4 7.8 85.4 25.4 Q68 21.6 50.6 25.4Z", "#8E959A"), SP("M54.6 12.4 Q60 8.8 66 8.4 Q58 11.8 56 17.4Z", "#B4BABE", { op: .8 }),
      SP("M50.4 21.6 Q68 17.8 85.6 21.6 L85.4 26 Q68 22.2 50.6 26Z", "#6E747A"), ...[54, 61, 68, 75, 82].map(x => SC(x, 23.6 - Math.sin((x - 50) / 36 * Math.PI) * 1.4, .95, "#D4D8DB")), SP("M66.9 22.6 L67.1 33.4 L68.9 33.4 L69.1 22.6Z", "#6E747A")] },
    vbKopf: "38 -2 60 60", vbFront: "38 -2 60 60" },
  { id: "h-hexe", fuer: "huhn", fach: "kopf", name: "Hexenhut", preis: 110, reihe: "buehne", saison: [10], deckt: "kamm", text: "Spitz, lila, mit kleinem Kürbis. Am 31. Oktober wird gezaubert. Bis dahin übt Hühnchen am Lichtschalter.",
    s: { kopf: [SE(63, 20.6, 20.6, 4.4, "#3E2A60", { rot: -5 }), SP("M51.4 19.6 Q57.6 6.6 61.6 -.6 Q57 -4.6 49.8 -5.6 Q59.6 -9.6 66.4 -2 Q70.4 7.6 75 19.4 Q63 22.4 51.4 19.6Z", "#5A3E86"),
      SP("M53 15.8 Q63 18.2 73.6 15.6 L74.8 19 Q63 21.8 51.8 19.2Z", "#5B8A47"), SC(70.6, 16.8, 2.6, "#E8902E"), SL("M70.6 14.2 L71.2 12.8", "#5B8A47", 1), SL("M69.4 16.4 L69.6 18.4 M71.8 16.4 L71.6 18.4", "#C46E1A", .6),
      SC(60.4, 6, .9, "#F2D27A"), SC(64.6, 11.6, .7, "#F2D27A"), SC(57.6, 12.6, .6, "#F2D27A")] },
    f: { kopf: [SE(68, 21, 22, 4.6, "#3E2A60"), SP("M56.2 20 Q62.6 6.6 66.6 -.6 Q62 -4.6 54.8 -5.6 Q64.6 -9.6 71.4 -2 Q75.4 7.6 80 19.8 Q68 22.8 56.2 20Z", "#5A3E86"),
      SP("M57.8 16.2 Q68 18.6 78.6 16 L79.8 19.4 Q68 22.2 56.6 19.6Z", "#5B8A47"), SC(75.6, 17.2, 2.6, "#E8902E"), SL("M75.6 14.6 L76.2 13.2", "#5B8A47", 1), SC(65.4, 6.4, .9, "#F2D27A"), SC(69.6, 12, .7, "#F2D27A")] },
    hoch: 10, vbKopf: "34 -10 68 68", vbFront: "34 -10 68 68" },
  { id: "h-detektiv", fuer: "huhn", fach: "ganz", name: "Detektiv", preis: 220, reihe: "krimi", deckt: "kamm", text: "Karierte Mütze und Lupe. Hühnchen ermittelt. Hauptverdächtiger: der Hofladen.",
    s: { koerper: [SL("M41.2 69 L48 76", "#6B4A30", 2.8), SC(36, 63.6, 6.6, "rgba(214,236,244,.55)", { s: "#6B4A30", w: 1.9 }), SL("M32.4 60.6 Q34 59.4 35.6 59.6", "#FFFFFF", 1, { op: .8 })],
      kopf: [SP("M49.4 22 Q42 20.6 39.6 24 Q45 25.8 50.2 24.6Z", "#7A5C3A"), SP("M76.6 22 Q84 20.8 86.4 24 Q81 25.8 75.8 24.6Z", "#7A5C3A"),
        SP("M47 24.6 Q46 8 63 7 Q80 8 79 24.6 Q63 20.4 47 24.6Z", "#8B6B45"),
        SL("M53 10.6 Q51.4 17 52 23 M58 8.4 Q57 15 57.6 21.6 M63 7.4 L63 21 M68 8.4 Q69 15 68.4 21.6 M73 10.6 Q74.6 17 74 23", "#6A4E2E", .7, { op: .75 }),
        SL("M48 15.4 Q63 11 78 15.4 M47.4 20.2 Q63 16 78.6 20.2", "#6A4E2E", .7, { op: .75 }), SL("M50.6 11.6 Q63 8.4 75.4 11.6", "#C9A27A", .6, { op: .7 }),
        SP("M61.4 7.4 L57.4 4.6 L58.2 8.8Z M64.6 7.4 L68.6 4.6 L67.8 8.8Z", "#6A4E2E"), SC(63, 7.2, 1.2, "#6A4E2E")] },
    f: { kopf: [SP("M49.6 26 Q49.6 8 68 7 Q86.4 8 86.4 26 Q68 21.6 49.6 26Z", "#8B6B45"),
      SL("M56 10.6 Q54.4 18 55 24 M62 8.2 Q61 15 61.6 22.4 M68 7.4 L68 22 M74 8.2 Q75 15 74.4 22.4 M80 10.6 Q81.6 18 81 24", "#6A4E2E", .7, { op: .75 }), SL("M51 15.6 Q68 11 85 15.6 M50.4 20.8 Q68 16.4 85.6 20.8", "#6A4E2E", .7, { op: .75 }),
      SP("M55 24 Q68 31.4 81 24 Q68 27.6 55 24Z", "#7A5C3A"), SP("M66.4 7.4 L62.4 4.6 L63.2 8.8Z M69.6 7.4 L73.6 4.6 L72.8 8.8Z", "#6A4E2E"), SC(68, 7.2, 1.2, "#6A4E2E"),
      SL("M81.6 38.4 L88.6 46.8", "#6B4A30", 2.8), SC(75, 31, 9.4, "rgba(214,236,244,.4)", { s: "#6B4A30", w: 1.9 }), SC(74.2, 32.2, 5.6, "#1C2620"), SC(76.4, 29.4, 2, "#FFFFFF")] } },
  { id: "h-pirat", fuer: "huhn", fach: "ganz", name: "Pirat", preis: 240, reihe: "welt", deckt: "kamm", text: "Dreispitz mit Keks-Wappen, Augenklappe, gestreiftes Halstuch und eine eigene Flagge. Arrr. Bitte.",
    s: { koerper: [SL("M28 84 L28 61", "#6B4A30", 1.4), SP("M28 61.4 L41 64.4 L28 68.6Z", "#1C2620"), SC(32.4, 64.8, 1.3, "#F3EDE0"),
        SP("M53.4 47.4 Q63 53.4 72.4 47 L71.4 52.6 Q63 57.8 55 52.8Z", "#D9473A"), SL("M55.6 49.4 Q63 54 71 49.4 M56 51.8 Q63 56.2 70.6 51.8", "#FBF6EA", .9), SP("M61 53.6 L63.4 61 L66.2 53.6Z", "#D9473A")],
      kopf: [SL("M50 24.4 Q61 21 79.6 26.6", "#1C2620", 1.4), SP("M47 21.4 Q47 9 63 8 Q79 9 79 21.4Z", "#2A2A30"), SP("M41 22.6 Q43.6 13.2 50.2 15 Q63 19.4 75.8 15 Q82.4 13.2 85 22.6 Q63 26.6 41 22.6Z", "#1E1E24"),
        SL("M41.6 22 Q63 26 84.4 22", "#D9A93A", 1.1), SL("M58.4 10.4 L67.6 18.4 M67.6 10.4 L58.4 18.4", "#F3EDE0", 1.2), SC(63, 14.4, 3.3, "#E0B070"), SC(62, 13.6, .5, "#8A5A2B"), SC(64.2, 15.2, .5, "#8A5A2B"), SC(63.6, 13, .45, "#8A5A2B")] },
    f: { kopf: [SL("M54.6 27 L50.4 24.4 M67.4 28 Q76 22.4 85.6 25", "#1C2620", 1.4), SE(61, 31, 7, 7.8, "#1C2620"), SL("M58.6 27.6 Q61 26.6 63.4 27.6", "#3A4048", 1),
      SP("M51.4 22.4 Q51.4 9 68 8 Q84.6 9 84.6 22.4Z", "#2A2A30"), SP("M45 23.6 Q47.4 13 54 15 Q68 19.6 82 15 Q88.6 13 91 23.6 Q68 27.6 45 23.6Z", "#1E1E24"), SL("M45.6 23 Q68 27 90.4 23", "#D9A93A", 1.1),
      SL("M63.4 10.4 L72.6 18.4 M72.6 10.4 L63.4 18.4", "#F3EDE0", 1.2), SC(68, 14.4, 3.3, "#E0B070"), SC(67, 13.6, .5, "#8A5A2B"), SC(69.2, 15.2, .5, "#8A5A2B"),
      SP("M56 50.6 Q68 56.4 80 50.6 L78.6 55.6 Q68 60 57.4 55.6Z", "#D9473A"), SL("M57.6 52.6 Q68 57.6 78.6 52.6", "#FBF6EA", .9)],
      }, vbKopf: "36 2 62 60", vbFront: "40 2 56 56" },
  { id: "h-astronaut", fuer: "huhn", fach: "ganz", name: "Raumfahrt-Huhn", naechst: "das Raumfahrt-Kostüm", preis: 250, reihe: "welt", text: "Helmkugel, Antenne, Abzeichen mit Stern. Kleiner Schritt für ein Huhn, großer Schritt für die Hühnheit.",
    s: { koerper: [SP("M43.6 52 Q63 61 83 49.6 L83.4 55 Q63 66.6 43.6 57.6Z", "#E8ECEF"), SL("M44 54.6 Q63 63.4 83 52.2", "#B9C2CA", .8), SC(57.4, 66, 4.4, "#3E5F9E"),
        SP("M57.4 62.8 L58.3 65 L60.6 65.1 L58.8 66.6 L59.4 68.8 L57.4 67.6 L55.4 68.8 L56 66.6 L54.2 65.1 L56.5 65Z", "#F2D27A")],
      kopf: [SL("M70 7.4 L74.4 -1", "#8E959A", 1.3), SC(74.8, -1.8, 1.8, "#D9473A"),
        SE(66, 32, 26.4, 25.6, "rgba(220,236,246,.2)", { s: "#C9D2DA", w: 2.4 }), SL("M45 25.6 Q49.6 13.4 61.4 9.6", "#FFFFFF", 2.2, { op: .75 }), SL("M48.2 34 Q48 30.4 49.4 27.6", "#FFFFFF", 1.4, { op: .5 })] },
    f: { kopf: [SL("M72 9.6 L76.4 1.4", "#8E959A", 1.3), SC(76.8, .6, 1.8, "#D9473A"), SC(68, 33, 24.4, "rgba(220,236,246,.2)", { s: "#C9D2DA", w: 2.4 }),
      SL("M47.6 26.6 Q52 14.4 63.4 10.8", "#FFFFFF", 2.2, { op: .75 }), SP("M50 52 Q68 59 86 52 L85.2 57.6 Q68 64 50.8 57.6Z", "#E8ECEF")] },
    hoch: 6, vbKopf: "38 -4 62 62", vbFront: "38 -4 62 62" },
  { id: "h-cape", fuer: "huhn", fach: "hals", name: "Super-Huhn", naechst: "das Super-Cape", preis: 130, reihe: "buehne", text: "Rotes Cape, gelbes Blitz-Abzeichen. Hühnchen rettet heute … den Keks.",
    s: { hinten: [SP("M60.6 46.6 Q40 43.4 21 55.6 Q11.6 72.4 21.6 88.6 Q29 80 37.6 84.4 Q33.6 70 45.6 58.6 Q53.6 52.4 62 50.6Z", "#D9473A", { cls: "skin-cape" }), SP("M58 47.6 Q42 46 27 55 Q36 50.6 46 51.6Z", "#B8382C", { op: .7 })],
      koerper: [SP("M62.2 57.4 L70.6 57.4 L70.6 63.4 Q66.4 67.6 62.2 63.4Z", "#F2C33A"), SP("M67.4 58.2 L64.6 61.8 L66.6 61.8 L64.8 65.4 L68.8 60.8 L66.8 60.8 L68.6 58.2Z", "#D9473A"), SC(60.4, 49.4, 1.9, "#F2C33A")] },
    f: { kopf: [SP("M50.4 48.6 Q49.4 39.6 52.4 33.6 L56.4 51.6Z M85.6 48.6 Q86.6 39.6 83.6 33.6 L79.6 51.6Z", "#D9473A"), SC(68, 52.4, 2, "#F2C33A")] } },
  { id: "h-taucher", fuer: "huhn", fach: "augen", name: "Taucherbrille mit Schnorchel", preis: 70, reihe: "welt", saison: [6, 7, 8], text: "Gelbe Taucherbrille, blauer Schnorchel. Für die Quelle im Bild. Die ist zwar flach, aber Hühnchen hat kurze Beine.",
    s: { kopf: [SL("M77.4 41.4 Q70 46.4 59.6 44.6 Q52.4 43 51.6 32.4 L51.6 5.6", "#2F6FA8", 2.8), SP("M50 1.8 H53.4 V6.4 H50Z", "#E8902E"),
      SL("M54.6 28.4 Q50 26.4 47.4 27.2", "#2F6FA8", 2.4), SE(65, 31, 10.6, 11.6, "rgba(150,210,230,.3)", { s: "#F2C33A", w: 2.6 }), SL("M58.6 25.6 Q61 23.6 64 23.4", "#FFFFFF", 1.2, { op: .7 })] },
    f: { kopf: [SL("M80.4 41.6 Q86.4 38.6 87.2 30.4 L87.2 3.4", "#2F6FA8", 2.8), SP("M85.6 -.4 H89 V4.2 H85.6Z", "#E8902E"),
      SE(61, 31, 7.8, 8.8, "rgba(150,210,230,.3)", { s: "#F2C33A", w: 2.4 }), SE(75, 31, 7.8, 8.8, "rgba(150,210,230,.3)", { s: "#F2C33A", w: 2.4 }), SL("M66.6 29.6 Q68 28.4 69.4 29.6", "#F2C33A", 2), SL("M53.4 30 L50.4 29", "#2F6FA8", 2.2)] },
    hoch: 4, vbKopf: "38 -2 60 60", vbFront: "38 -4 62 62" },
  { id: "h-zylinder", fuer: "huhn", fach: "kopf", name: "Zauberhuhn", naechst: "den Zauberhut", preis: 140, reihe: "buehne", ab: "2026-11", deckt: "kamm", text: "Zylinder und Zauberstab. Mal kommt ein Kaninchen raus, mal ein Ei. Vorher weiß das keiner, Hühnchen auch nicht.",
    s: { koerper: [SL("M43.6 64 L28.6 54", "#1E1E24", 2.4), SL("M30.8 55.4 L28.6 54", "#FBF6EA", 2.4), SC(26.4, 50.6, .9, "#F2D27A"), SC(23.6, 54.4, .7, "#F2D27A"), SC(27.4, 47, .6, "#F2D27A")],
      kopf: [SE(63.4, 19.6, 17.6, 3.6, "#1E1E24", { rot: -4 }), SP("M52.6 19.4 L53.6 -1.6 Q63.4 -3.8 73.2 -1.6 L74.2 19Z", "#2A2A30"), SE(63.4, -1.8, 9.8, 2, "#3A3A42"),
        SP("M52.9 13.6 L73.9 13.4 L74.1 18.4 L52.7 18.6Z", "#8E2A5A"), SL("M55.6 1.6 L55.8 11", "#4A4A54", 1.2, { op: .8 })] },
    f: { kopf: [SE(68, 20.2, 18.6, 3.8, "#1E1E24"), SP("M57 20 L58 -1 Q68 -3.2 78 -1 L79 20Z", "#2A2A30"), SE(68, -1.2, 10, 2, "#3A3A42"), SP("M57.3 14.2 L78.7 14.2 L78.9 19.2 L57.1 19.2Z", "#8E2A5A"), SL("M60 2.2 L60.2 11.6", "#4A4A54", 1.2, { op: .8 })] },
    hoch: 8, vbKopf: "36 -6 64 64", vbFront: "36 -6 64 64" },
  { id: "h-schal", fuer: "huhn", fach: "hals", name: "Ringelschal", preis: 50, reihe: "winter", ab: "2027-01", saison: [12, 1, 2], text: "Grün-weiß geringelt, viel zu lang. Hühnchen tritt nur ganz selten drauf.",
    s: { koerper: [SP("M51.6 45.4 Q63 54.4 74.4 45.6 L74.4 51.6 Q63 60.4 51.6 51.6Z", "#3F8F5A"), SL("M55.4 48.6 L55 54.2 M60.2 51 L60 56.8 M65.4 51.4 L65.6 57 M70.4 49.2 L70.8 54.6", "#F3EDE0", 2),
      SP("M55.6 52.6 Q51 66 50.4 79.6 L56.4 80 Q57 66 60.2 54Z", "#3F8F5A"), SL("M54.6 57.4 L59 58.2 M53.2 63 L57.8 63.6 M52 68.6 L56.8 69 M51.2 74.2 L56.4 74.6", "#F3EDE0", 2), SL("M50.8 80 L50.4 82.4 M52.8 80.2 L52.6 82.6 M54.8 80.2 L54.8 82.6 M56.4 80.2 L56.6 82.4", "#3F8F5A", .9)] },
    f: { kopf: [SP("M51.6 48.6 Q68 57.2 84.4 48.6 L84.4 55 Q68 63.6 51.6 55Z", "#3F8F5A"), SL("M56 51 L55.6 57 M62 53.4 L61.8 59.6 M68 54.6 L68 60.8 M74 53.4 L74.2 59.6 M80 51 L80.4 57", "#F3EDE0", 2)] } },
  { id: "h-osterohren", fuer: "huhn", fach: "kopf", name: "Hasenohren", ab: "2027-03", saison: [3, 4], geschenk: "ostern", es: "die Ohren", text: "Ein Haarreif mit Hasenohren. Hühnchen findet: Wer Eier legt, darf auch Hase sein.",
    s: { kopf: [SP("M64.6 16.4 Q72 -5.6 78.4 -2.8 Q81.6 1.2 70.2 18.2Z", "#F4F0EA"), SP("M66.8 13.6 Q72.6 -1.4 76.4 -.6 Q77.6 2 70.4 14.6Z", "#F2B8C8"),
      SL("M50 22.4 Q63 13.6 78.4 20.2", "#E5869E", 2.2), SP("M55.6 17.4 Q49.6 -6.2 56.6 -8.2 Q62.8 -6.4 61 16.4Z", "#F4F0EA"), SP("M57 14.4 Q53 -2.2 57.2 -4.4 Q60.4 -2.4 59.6 14.4Z", "#F2B8C8")] },
    f: { kopf: [SL("M51 26 Q68 13.6 85 26", "#E5869E", 2.2), SP("M60 17.6 Q53.6 -6 60.6 -8 Q66.8 -6.2 65 16.8Z", "#F4F0EA"), SP("M61.4 14.6 Q57.4 -2 61.6 -4.2 Q64.8 -2.2 64 14.6Z", "#F2B8C8"),
      SP("M71 16.8 Q71.4 -6.2 77.6 -6.6 Q83.6 -4.2 76.2 17.6Z", "#F4F0EA"), SP("M72.6 14.6 Q73.4 -2.4 77 -2.6 Q80.4 -.8 75 14.6Z", "#F2B8C8")] },
    hoch: 10, vbKopf: "34 -10 68 68", vbFront: "34 -10 68 68" },
  { id: "h-ritter", fuer: "huhn", fach: "ganz", name: "Ritter von der Zitadelle", preis: 260, ab: "2027-05", deckt: "kamm", text: "Silberhelm mit hochgeklapptem Visier, rotem Federbusch und Schild. Die Spandauer Zitadelle hat einen neuen Wächter.",
    s: { koerper: [SP("M34.6 57.6 L49.4 57.6 L49.4 67.6 Q42 76.4 34.6 67.6Z", "#C8363A"), SP("M37.4 70 V63 H39 V61.4 H40.8 V63 H43.2 V61.4 H45 V63 H46.6 V70 Q42 73 37.4 70Z", "#FBF8F1"), SP("M41 70.6 V67.4 Q42 66 43 67.4 V70.6Z", "#C8363A")],
      kopf: [SP("M62 8.6 Q56 -1.6 44 -2.4 Q49.6 1.6 46 6.6 Q52 4.4 55.6 8.4 Q50 8 47.4 12.6 Q55 10.6 59 11Z", "#C8363A", { cls: "skin-feder" }), SP("M60.4 7.4 Q54 1.4 47 .6 Q53 3.6 56.6 8Z", "#E25A4C", { op: .8 }), SP("M47.8 22 L46.2 37.6 Q50 39.6 54.6 37 L55 23Z", "#8E959A"),
        SP("M47.6 24.6 Q46.6 7.6 63 6.6 Q79.4 7.6 78.6 24.6 Q63 20.8 47.6 24.6Z", "#A9B0B6"), SP("M51 12 Q56 8.6 62 8.2 Q54 11.4 52.2 17Z", "#D0D5D9", { op: .8 }),
        SP("M64.6 9 L79.6 11.4 L80.4 17.4 L65.4 15Z", "#7A8288"), SL("M67 12.6 L78.6 14.4", "#2E3238", 1.4), SL("M47.6 24.4 Q63 20.6 78.6 24.4", "#7A8288", 1.4), ...[52, 58, 64, 70, 75].map(x => SC(x, 23.2 - Math.sin((x - 47) / 32 * Math.PI) * 1.4, .8, "#D4D8DB"))] },
    f: { kopf: [SP("M66 9 Q63 -1 68.6 -6 Q72.4 -.6 70.6 9Z", "#C8363A", { cls: "skin-feder" }), SP("M67.4 8 Q66 1 68.6 -2.6 Q70.4 1.6 69.4 8Z", "#E25A4C", { op: .8 }), SP("M50.8 23 L50 40 L55.4 38.4 L56 24.6Z M85.2 23 L86 40 L80.6 38.4 L80 24.6Z", "#8E959A"),
      SP("M50.6 25.4 Q49.6 7.8 68 6.8 Q86.4 7.8 85.4 25.4 Q68 21.6 50.6 25.4Z", "#A9B0B6"), SP("M54.6 12.4 Q60 8.8 66 8.4 Q58 11.8 56 17.4Z", "#D0D5D9", { op: .8 }),
      SP("M55 9.6 H81 V15.6 H55Z", "#7A8288"), SL("M58 12.6 H78", "#2E3238", 1.4), SL("M50.6 25.2 Q68 21.4 85.4 25.2", "#7A8288", 1.4)] },
    hoch: 8, vbKopf: "36 -8 66 66", vbFront: "36 -8 66 66" },
  { id: "h-strohhut", fuer: "huhn", fach: "kopf", name: "Strohhut", preis: 80, ab: "2027-06", saison: [6, 7, 8], reihe: "sommer", deckt: "kamm", text: "Breite Krempe, rotes Band. Hühnchen macht Sommerfrische – im Schatten der eigenen Krempe.",
    s: { kopf: [SE(63.4, 18.6, 25.4, 5, "#E7C77C", { rot: -4 }), SP("M38.6 19.4 Q63 30.4 88.4 17.6 Q63 25 38.6 19.4Z", "#C9A456"), SP("M51.4 18.4 Q51 5.6 63.4 5 Q75.8 5.6 75.4 18 Q63.4 20.6 51.4 18.4Z", "#F0D48F"),
      SP("M51.6 14.6 Q63.4 17 75.6 14.2 L75.4 18 Q63.4 20.6 51.4 18.4Z", "#C9563A"), ...skBluete(55, 15.6, 2.2, "#FBF8EE")] },
    f: { kopf: [SE(68, 19.4, 27, 5.4, "#E7C77C"), SP("M41.2 19.8 Q68 31 94.8 19.8 Q68 26.6 41.2 19.8Z", "#C9A456"), SP("M55.6 19 Q55.2 5.6 68 5 Q80.8 5.6 80.4 19 Q68 21.6 55.6 19Z", "#F0D48F"),
      SP("M55.8 15.2 Q68 17.6 80.2 15.2 L80.4 19 Q68 21.6 55.6 19Z", "#C9563A"), ...skBluete(59.4, 16.4, 2.2, "#FBF8EE")] },
    vbKopf: "36 -2 62 62", vbFront: "36 -2 62 62" },
  { id: "h-party", fuer: "huhn", fach: "kopf", name: "Partyhütchen", preis: 50, ab: "2027-08", reihe: "buehne", text: "Spitzes Hütchen mit Bommel und Gummiband. Hühnchen behauptet, es hätte heute Geburtstag. Das behauptet es jeden Tag.",
    s: { kopf: [SP("M55.6 17.6 L61.4 -6 L69.4 16.4Z", "#3E7FB8"), SL("M57 12 L68 10.6 M58.6 5.6 L66.2 4.8", "#F2D27A", 1.8), SC(61.4, -6.6, 2.6, "#E0558A")] },
    f: { kopf: [SP("M61.6 16 L68 -7 L74.4 16Z", "#3E7FB8"), SL("M63 10.4 L73 10.4 M64.8 4 L71.2 4", "#F2D27A", 1.8), SC(68, -7.6, 2.6, "#E0558A")] },
    hoch: 10, vbKopf: "34 -10 68 68", vbFront: "34 -10 68 68" },
  { id: "h-fliege", fuer: "huhn", fach: "hals", name: "Fliege", naechst: "die Fliege", preis: 60, reihe: "tanzsaal", ab: "2026-10", es: "die Fliege", text: "Schwarze Fliege, frisch gebügelt. Hühnchen ist heute dein Tanzpartner. Es führt nicht, es wird geführt.",
    s: { koerper: [SL("M56.4 48.6 Q63.4 53.6 71.2 48.4", "#FBF8F1", 1.6), SP("M63.6 53.6 L57.8 50.2 L58 57.2Z", "#1C2620"), SP("M63.6 53.6 L69.4 50.2 L69.2 57.2Z", "#1C2620"), SC(63.6, 53.6, 1.9, "#34403A"), SL("M59.4 52 L60.2 52.6", "#FFFFFF", .7, { op: .5 })] },
    f: { kopf: [SP("M68 55 L60.4 51 L60.6 59Z", "#1C2620"), SP("M68 55 L75.6 51 L75.4 59Z", "#1C2620"), SC(68, 55, 2.1, "#34403A")] }, vbFront: "38 2 60 60" },
  { id: "h-elch", fuer: "huhn", fach: "kopf", name: "Elchgeweih", naechst: "das Elchgeweih", preis: 80, reihe: "schweden", saison: [11, 12, 1], ab: "2026-10", es: "das Geweih", text: "Ein Geweih aus Filz. Hühnchen ruft jetzt „Älg!“ und erwartet, dass die Autos bremsen.",
    s: { kopf: [SL("M49.6 22.6 Q63 13.4 78.6 20", "#6B4A30", 2.2),
      SL("M55.4 17.4 Q53.6 10 49.4 5.6 M54.2 12 L49.8 12.4 M52.4 8.4 Q53 4.2 55.4 2", "#9A6A3E", 2.6), SL("M71.4 16 Q73.4 8.4 78.6 4.6 M72.8 10.8 L77.4 11.4 M75.2 7 Q75.2 2.8 73 .6", "#B07A44", 2.6)] },
    f: { kopf: [SL("M51 26 Q68 13.6 85 26", "#6B4A30", 2.2), SL("M60.4 18.4 Q57 10.6 51.6 6.8 M58.2 13 L53 13.8 M55.2 9.2 Q55.6 4.6 58.4 2.6", "#9A6A3E", 2.6), SL("M75.6 18.4 Q79 10.6 84.4 6.8 M77.8 13 L83 13.8 M80.8 9.2 Q80.4 4.6 77.6 2.6", "#9A6A3E", 2.6)] },
    hoch: 8, vbKopf: "36 -6 64 64", vbFront: "36 -6 64 64" },
  { id: "h-haendel", fuer: "huhn", fach: "kopf", name: "Händel-Perücke", naechst: "die Händel-Perücke", preis: 150, deckt: "kamm", ab: "2026-10", es: "die Perücke", text: "Weiß, gelockt, barock. Hühnchen summt jetzt den ganzen Tag das Halleluja. Falsch, aber mit Hingabe.",
    s: { kopf: [...[[44.6, 30], [43.8, 36.4], [44.4, 42.6], [46.6, 48.4], [40.4, 33.6], [40, 40], [41.4, 46.2]].map(([x, y], i) => SC(x, y, 4.2, i % 2 ? "#E6E0D2" : "#F4F0E6")),
      ...[[49.4, 22.4], [53.6, 16.4], [59.6, 12.6], [66.4, 12], [72.6, 14.4], [77.2, 19.4], [48.6, 27.6]].map(([x, y], i) => SC(x, y, 5, i % 2 ? "#E6E0D2" : "#F7F3EA")),
      SL("M51 21 Q53 18 56 18 M61 14.4 Q63.6 13 66 14.2 M70.6 16 Q73.4 16.4 75 19", "#CFC8B6", 1)] },
    f: { kopf: [...[[51, 24], [50, 30.6], [50.4, 37], [51.6, 43.4], [85, 24], [86, 30.6], [85.6, 37], [84.4, 43.4]].map(([x, y], i) => SC(x, y, 4.4, i % 2 ? "#E6E0D2" : "#F4F0E6")),
      ...[[54.6, 17.4], [60.6, 13.4], [68, 12], [75.4, 13.4], [81.4, 17.4]].map(([x, y], i) => SC(x, y, 5.2, i % 2 ? "#E6E0D2" : "#F7F3EA"))] },
    vbKopf: "34 0 64 64", vbFront: "40 2 56 56" },
  { id: "h-weihnacht", fuer: "huhn", fach: "kopf", geschenk: "advent", name: "Weihnachtsmütze", es: "die Mütze", deckt: "kamm", text: "Im Advent setzt Hühnchen sie von selbst auf. „Die Mütze war nicht meine Idee.“ Trägt sie trotzdem bis Silvester.",
    s: { kopf: [SP("M48 22 Q50 5.6 64 4.6 Q74.6 4.6 80.4 11.6 Q84.6 16.6 86.6 24 Q80.4 16 76.4 15 Q78 19.6 78 22 Q63 18.6 48 22Z", "#C8363A"), SP("M52 12 Q56 6.6 63 6 Q56 9 54.6 15Z", "#E05A4C", { op: .7 }),
      SP("M46.4 20.8 Q63 16.4 79.6 20.8 L79.8 26.2 Q63 21.6 46.2 26.2Z", "#F4EFE4"), SC(86.6, 24, 3.6, "#F4EFE4"), SC(85.4, 22.6, 1.2, "#FFFFFF")] },
    f: { kopf: [SP("M51 23 Q52 6.6 68 5.6 Q80 5.6 86 13.6 Q90 18.6 91 26 Q86 18 82 17 Q83 21 83 23 Q68 19.6 51 23Z", "#C8363A"), SP("M49.4 21.8 Q68 17.4 86.6 21.8 L86.8 27.2 Q68 22.6 49.2 27.2Z", "#F4EFE4"), SC(91, 26, 3.6, "#F4EFE4")] },
    vbKopf: "38 0 60 60", vbFront: "38 0 60 60" },
  { id: "h-lucia", fuer: "huhn", fach: "kopf", geschenk: "lucia", name: "Kleiner Lucia-Kranz", es: "den Kranz", text: "Am 13. Dezember trägt Hühnchen einen kleinen Kranz mit Kerzen. „Kerzen auf dem Kopf und keiner sagt was. Ich mag Schweden.“",
    s: { kopf: [...skKerze(56.6, 6.4, 8, 2.8), ...skKerze(63, 3.6, 10, 2.8), ...skKerze(69.4, 6.4, 8, 2.8), SE(63, 16.6, 13.4, 3.8, "#3F6B3A"), ...[[52, 16.4], [57.6, 19.2], [63, 20], [68.4, 19.2], [74, 16.4]].map(([x, y], i) => SE(x, y, 2.6, 1.3, i % 2 ? "#4F8A45" : "#5D9A50", { rot: i < 2 ? 18 : -18 })), SC(55, 18.6, 1, "#C8363A"), SC(65.6, 20, 1, "#C8363A"), SC(71.6, 18.2, 1, "#C8363A")] },
    f: { kopf: [...skKerze(61.6, 7.4, 8, 2.8), ...skKerze(68, 4.6, 10, 2.8), ...skKerze(74.4, 7.4, 8, 2.8), SE(68, 17.6, 13.4, 3.8, "#3F6B3A"), SC(60, 19.6, 1, "#C8363A"), SC(70.6, 21, 1, "#C8363A"), SC(76.6, 19.2, 1, "#C8363A")] },
    hoch: 4, vbKopf: "38 -4 62 62", vbFront: "38 -4 62 62" },
  { id: "h-bingo", fuer: "huhn", fach: "kopf", geschenk: "bingo", name: "Bingo-Kranz", text: "Für eine ganze volle Bingo-Karte: ein Kranz aus Blättern und einer Eichel. Verdient, nicht gekauft.",
    s: { kopf: [SL("M46.6 21.4 Q63 26.4 80 19.4", "#7A5A3A", 1.6), ...[[48.4, 21.6, "#C98A3E", 30], [54.2, 23.6, "#5D9A50", -10], [60, 24.6, "#D4A445", 20], [65.8, 24.4, "#A55A2E", -20], [71.4, 23, "#5D9A50", 14], [77, 20.6, "#C98A3E", -26], [57, 22, "#A55A2E", 40], [68.6, 21.8, "#D4A445", -40]].map(([x, y, c, r]) => SE(x, y, 4.8, 2.5, c, { rot: r })),
      SE(72.6, 25.4, 2.2, 2.7, "#A0703F"), SP("M70.2 24.2 Q72.6 22 75 24.2Z", "#6B4A30"), SL("M72.6 22.4 L73.2 21", "#6B4A30", .9)] },
    f: { kopf: [SL("M49.6 19 Q68 27.6 86.4 19", "#7A5A3A", 1.6), ...[[51.4, 19.6, "#C98A3E", 30], [57.4, 22.6, "#5D9A50", 12], [63, 24.2, "#D4A445", 4], [73, 24.2, "#A55A2E", -4], [78.6, 22.6, "#5D9A50", -12], [84.6, 19.6, "#C98A3E", -30]].map(([x, y, c, r]) => SE(x, y, 4.8, 2.5, c, { rot: r })),
      SE(68, 23.6, 2.2, 2.6, "#A0703F"), SP("M65.6 22.4 Q68 20.2 70.4 22.4Z", "#6B4A30")] } }
];
/* Farbe des Monats (Laden-Lektorat): jeden Monat eine neue Farbvariante eines bekannten Teils – so geht der Schrank nie leer.
   [Vorbild, neue id, Name, ab Monat, Farbtausch, Text] */
const SKIN_VARIANTEN = [
  ["r-zauberschal", "r-zauberschal-blau", "Zauberschal, blau-bronze", "2026-11", { "#8E2430": "#1F3B73", "#E2B13C": "#B07A44" }, "Blau und bronze wie bei Ravenclaw. Die sind klug, heißt es. Passt."],
  ["r-bommel", "r-bommel-gruen", "Bommelmütze, tannengrün", "2026-12", { "#C8463B": "#2F6B4A", "#A9382F": "#245539" }, "Die Bommelmütze in Tannengrün, passend zum Forst."],
  ["h-schal", "h-schal-rot", "Ringelschal, rot-weiß", "2027-01", { "#3F8F5A": "#C8363A" }, "Rot-weiß geringelt. Hühnchen sieht damit aus wie ein Leuchtturm. Ein kleiner."],
  ["r-zauberschal", "r-zauberschal-gruen", "Zauberschal, grün-silber", "2027-02", { "#8E2430": "#1F5A3A", "#E2B13C": "#C9CED2" }, "Grün und silber. Hühnchen sagt, die sind nicht alle schlimm. Ein paar schon."],
  ["h-sonnenbrille", "h-sonnenbrille-rosa", "Undercover-Brille, rosa", "2027-03", { "#1C2620": "#C9507E" }, "Inkognito in Rosa. Fällt noch mehr auf. Hühnchen ist das egal."],
  ["r-strick", "r-strick-rot", "Schwedenpulli, rot", "2027-04", { "#2E4E8E": "#A8322E", "#26427A": "#8E2826", "#3A5C9E": "#B8403A" }, "Rot mit weißer Bordüre, wie die Häuser in Småland. Fehlt nur der Elch im Garten."],
  ["r-sonnenbrille", "r-sonnenbrille-braun", "Sonnenbrille, Schildpatt", "2027-05", { "#1E262C": "#6B3E22" }, "Braun gesprenkelt wie in alten Filmen. Darin sieht jeder Balkon nach Riviera aus."],
  ["h-schleife", "h-schleife-gelb", "Große Schleife, gelb", "2027-06", { "#E0558A": "#EBB52E", "#C7437A": "#C98F1C" }, "Die Schleife in Sonnengelb. Hühnchen guckt jetzt doppelt so oft in den Spiegel."],
  ["h-strohhut", "h-strohhut-blau", "Strohhut mit blauem Band", "2027-07", { "#C9563A": "#2F5E8E" }, "Der Strohhut, diesmal mit blauem Band. Blau und Gelb, sehr schwedisch."],
  ["r-zauberschal", "r-zauberschal-gelb", "Zauberschal, gelb-schwarz", "2027-08", { "#8E2430": "#2A2A2A", "#E2B13C": "#E8C23A" }, "Gelb und schwarz wie bei Hufflepuff. Die sind treu und backen gern, sagt man."],
  ["r-katzenauge", "r-katzenauge-tuerkis", "Katzenaugen-Brille, türkis", "2027-09", { "#C0282A": "#2A8C8A" }, "Türkis statt Rot. Ermittelt wird trotzdem."],
  ["h-chullo", "h-chullo-blau", "Chullo, blau", "2027-10", { "#C8363A": "#2F5E8E" }, "Die Ohrenklappen-Mütze in Blau. Blau trägt man jetzt, sagt Hühnchen. Woher es das weiß, sagt es nicht."],
  ["r-ohrenwaermer", "r-ohrenwaermer-mint", "Ohrenwärmer, mint", "2027-11", { "#7E5A92": "#3F7A6A", "#9C7AAE": "#6FA898", "#E7DCEF": "#DCEFE8", "#F1EAF6": "#EDF8F4", "#E0D3EA": "#CFE8DF" }, "Flauschig in Mint. Wie zwei kleine Pfefferminzwolken."],
  ["r-bommel", "r-bommel-blau", "Bommelmütze, blau-gelb", "2027-12", { "#C8463B": "#2F5E8E", "#A9382F": "#244A78", "#F7F2E8": "#F2C33A", "#F7F1E6": "#F2C33A" }, "Blau mit gelbem Bommel. Schwedischer geht eine Mütze nicht."],
  ["h-schal", "h-schal-blau", "Ringelschal, blau-gelb", "2028-01", { "#3F8F5A": "#2F5E8E", "#F3EDE0": "#F2C33A" }, "Blau-gelb geringelt. Hühnchen ruft jetzt „Heja Sverige!“, auch wenn gar kein Spiel ist."],
  ["r-konfetti", "r-konfetti-gold", "Konfetti-Brille, gold", "2028-02", { "#E0558A": "#C9A24A" }, "Die Sternchenbrille in Gold. Für Fasching oder einen Mittwoch, der glänzen soll."],
  ["h-fliege", "h-fliege-rot", "Fliege, rot gepunktet", "2028-03", { "#1C2620": "#B8303A", "#34403A": "#8E2028" }, "Rot statt Schwarz. Für Tanzabende, an denen Hühnchen auffallen will. Also für alle."],
  ["r-blumen", "r-blumen-gelb", "Blumen im Haar, gelb", "2028-04", { "#E9A0B8": "#F2D27A", "#C7B6E6": "#FBF8EE" }, "Gelbe Blüten, seitlich gesteckt. Wie Löwenzahn, nur ordentlicher."]
];
{ const tausch = (v, m) => Array.isArray(v) ? v.map(x => tausch(x, m)) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, tausch(x, m)])) : typeof v === "string" && m[v] ? m[v] : v;
  for (const [von, id, name, ab, m, text] of SKIN_VARIANTEN) { const b = D_SKINS.find(s => s.id === von); if (!b || D_SKINS.some(s => s.id === id)) continue;
    const { reihe, geschenk, naechst, ...rest } = b; D_SKINS.push({ ...tausch(rest, m), id, name, ab, text, preis: b.preis || 60, variante: von }); } }
const SKIN_MAP = Object.fromEntries(D_SKINS.map(s => [s.id, s]));
/* Was Hühnchen in bestimmten Kostümen zu Bild-Spielereien sagt */
const SKIN_REAKTION = {
  "h-pirat": { kraniche: "Vögel voraus! Kurs halten!", katze: "Eine Schiffskatze! Die heuern wir an." },
  "h-detektiv": { nachbar: "Verdächtig freundlich, der Mann.", eichhoernchen: "Die Nuss ist weg. Ich hab da einen Verdacht." },
  "h-astronaut": { kraniche: "Das sind keine Ufos. Hab ich geprüft.", laterne: "Bodenkontrolle an Laterne: Licht ist an." },
  "h-koch": { eichhoernchen: "Nüsse roh? Na gut. Jeder, wie er mag.", igel: "Apfel ohne Zimt. Na ja, er ist ja kein Feinschmecker." },
  "h-wikinger": { kraniche: "Skål, ihr Vögel!", schneemann: "Den nehmen wir mit auf die nächste Fahrt." },
  "h-hexe": { laterne: "Das war Zauberei. Und ein bisschen der Schalter." },
  "h-taucher": { blumen: "Gegossen. Falls es zu viel war: Ich tauch nach." },
  "h-zylinder": { seifenblasen: "Zack, weg. Ich sag ja: Zauberei." },
  "h-elch": { kraniche: "Ich bin ein Elch. Elche fliegen nicht. Ich guck nur.", katze: "Keine Angst. Ich bin ein freundlicher Elch." },
  "h-fliege": { nachbar: "Er hat gewinkt. Ich hab mich verbeugt. So macht man das." },
  "h-haendel": { blumen: "Gegossen. Mit Gefühl, wie ein Adagio.", laterne: "Licht an! Und jetzt: Feuerwerksmusik." }
};
for (const s of D_SKINS) if (s.variante && SKIN_REAKTION[s.variante]) SKIN_REAKTION[s.id] = SKIN_REAKTION[s.variante];

/* ============================================================
   Zustand, Regeln, Feste
   ============================================================ */
const SK_WETTER = ["echt", "sonne", "wolken", "regen", "schnee", "nebel"];
/* nur noch die Gutscheine, die Zeit mit Max „verkauft“ hätten – die gibt’s ohne Taler. Postkarte und Halloren bleiben (Regal „Aus Halle“). */
const SK_GUTSCHEINE = { "g-klatsch-telefon": 500, "g-tschuess-revanche": 700, "g-handy-besuch": 800, "g-spaziergang": 900 };
const skObj = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
function skinsMigrieren() {
  const k = skObj(S.skins), str = v => typeof v === "string" && v ? v : null;
  S.skins = { besitz: skObj(k.besitz), rita: str(k.rita), huhn: str(k.huhn), auto: k.auto !== false, ziel: str(k.ziel), zielGemeldet: str(k.zielGemeldet), geschenkt: skObj(k.geschenkt), reihen: skObj(k.reihen),
    festAus: skObj(k.festAus), intro: typeof k.intro === "string" ? k.intro : "", neuGesehen: typeof k.neuGesehen === "string" ? k.neuGesehen : "", geprueft: typeof k.geprueft === "string" ? k.geprueft : "",
    erstattet: Number.isFinite(k.erstattet) ? k.erstattet : 0, erstattetGemeldet: !!k.erstattetGemeldet };
  for (const id in S.skins.besitz) if (!SKIN_MAP[id]) delete S.skins.besitz[id];
  for (const f of ["rita", "huhn"]) if (S.skins[f] && (!SKIN_MAP[S.skins[f]] || SKIN_MAP[S.skins[f]].fuer !== f)) S.skins[f] = null;
  if (S.skins.ziel && !SKIN_MAP[S.skins.ziel] && !(D.laden || []).some(x => x.id === S.skins.ziel)) S.skins.ziel = null;
  const b = skObj(S.bildspiel); S.bildspiel = { tag: typeof b.tag === "string" ? b.tag : "", erledigt: skObj(b.erledigt), zustand: skObj(b.zustand), schneemann: typeof b.schneemann === "string" ? b.schneemann : "", ...(Array.isArray(b.wahl) && b.wahl.every(x => typeof x === "string") ? { wahl: b.wahl } : {}) };
  if (!SK_WETTER.includes(S.bildWetter)) S.bildWetter = "echt";
  if (!Number.isFinite(S.talerRest)) S.talerRest = 0;
  if (Array.isArray(S.eintraege)) S.eintraege.forEach(e => { if (e && Number.isFinite(e.taler) && e.taler % 1) e.taler = Math.round(e.taler); });
  if (Number.isFinite(S.taler) && Math.abs(S.taler - Math.round(S.taler)) > 1e-6) { const g = Math.floor(S.taler + 1e-9); S.talerRest = Math.min(1, S.talerRest + S.taler - g); S.taler = g; }
  else if (Number.isFinite(S.taler)) S.taler = Math.round(S.taler);
  const h = skObj(S.halte); S.halte = { rita: typeof h.rita === "string" ? h.rita : "", huhn: typeof h.huhn === "string" ? h.huhn : "", lupe: typeof h.lupe === "string" ? h.lupe : "" };
  const m = skObj(S.memory); S.memory = { tag: typeof m.tag === "string" ? m.tag : "", spiele: Number.isFinite(m.spiele) ? m.spiele : 0, paare: m.paare === 8 ? 8 : 6 };
  // FUN-21: Gutscheine „Echtes von Max“ gibt es nicht mehr – schon gekaufte werden als Taler zurückgezahlt (einmalig)
  if (S.gekauft && typeof S.gekauft === "object") for (const id in SK_GUTSCHEINE) if (S.gekauft[id]) {
    delete S.gekauft[id]; S.taler = (Number(S.taler) || 0) + SK_GUTSCHEINE[id]; S.talerAusgegeben = Math.max(0, (S.talerAusgegeben || 0) - SK_GUTSCHEINE[id]); S.skins.erstattet += SK_GUTSCHEINE[id]; S.skins.erstattetGemeldet = false; }
  // Laden-Lektorat: Hasenohren sind nur noch Ostergeschenk – wer sie gekauft hat, bekommt die 60 Taler zurück und behält sie
  if (S.skins.besitz["h-osterohren"] && !S.skins.geschenkt["h-osterohren"]) { S.skins.geschenkt["h-osterohren"] = S.skins.besitz["h-osterohren"]; S.taler = (Number(S.taler) || 0) + 60; S.talerAusgegeben = Math.max(0, (S.talerAusgegeben || 0) - 60); S.skins.erstattet += 60; S.skins.erstattetGemeldet = false; }
  if (typeof laden2Migrieren === "function") laden2Migrieren();
  if (typeof dankMigrieren === "function") try { dankMigrieren(); } catch (e) { S.dank = { tage: {}, taler: {}, dreh: 0 }; } // Dankbar heute (dank.js)
}
/* K-F-09: Taler nur ganzzahlig buchen; Bruchteile sammeln sich in S.talerRest */
/* Große Tätigkeiten (Max, 14:37): ganze Extra-Taler obendrauf, maßvoll gestaffelt und gedeckelt.
   Pro Eintrag höchstens 3, pro Tag zusammen höchstens 3. Nur wenn der Eintrag überhaupt zählt (w > 0).
   „Gut für mich“-Minuten (Ausruhen, Wärme …) bekommen keinen Zuschlag – länger ausruhen ist keine Leistung. */
const TALER_GROSS_TAG = 3;
function talerGrossStufe(e) {
  const t = tat(e.t), m = Number(e.min) || 0;
  if (e.t === "ausflug") { const l = Number(e.leiter) || 1; return l >= 7 ? 3 : l >= 6 ? 2 : l >= 4 ? 1 : 0; }
  if (t.art === "km") { const km = Number(e.km) || 0; return km >= 6 ? 2 : km >= 4 ? 1 : 0; }
  if (e.t === "tanzstunde") return m >= 90 ? 2 : m >= 45 ? 1 : 0;
  if ((t.art === "min" || t.art === "person") && t.feld !== "sorge") return m >= 150 ? 2 : m >= 90 ? 1 : 0;
  return 0;
}
function talerGross(e, vorher) {
  if (!(e.w > 0)) return 0;
  const schon = (vorher || []).reduce((s, x) => s + (Number(x.tg) || 0), 0);
  return Math.max(0, Math.min(talerGrossStufe(e), TALER_GROSS_TAG - schon));
}
function talerGanz(roh) { const r = (Number(S.talerRest) || 0) + (Number(roh) || 0), g = Math.floor(r + 1e-9); S.talerRest = Math.max(0, Math.round((r - g) * 1000) / 1000); return g; }
function skMonat(d = jetzt()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; }
const skinDa = s => (!s.ab || skMonat() >= s.ab) && (!s.wenn || !!s.wenn()); // wenn: z. B. Ballrobe erst ab Band 4, Kapitel 23 (hp.js)
const skinHat = id => !!(S.skins && S.skins.besitz[id]);
const skinKaufbar = s => !!s.preis && skinDa(s) && !skinHat(s.id);
function skOstern(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), t = ((h + l - 7 * m + 114) % 31) + 1; return new Date(y, mo - 1, t, 12); }
function skAdvent(y) { const d = new Date(y, 11, 24, 12); return tagVon(new Date(y, 11, 24 - d.getDay() - 21, 12)); }
/* Welche Feste sind heute? (für Kleiderschrank und Bild) */
function festHeute(d = jetzt()) {
  const y = d.getFullYear(), m = d.getMonth() + 1, t = d.getDate(), tag = tagVon(d), md = `${String(m).padStart(2, "0")}-${String(t).padStart(2, "0")}`;
  const o = skOstern(y), od = Math.round((tagDatum(tag) - tagDatum(tagVon(o))) / 864e5);
  const mitt = (() => { for (let x = 19; x <= 25; x++) { const dd = new Date(y, 5, x, 12); if (dd.getDay() === 5) return x; } return 0; })();
  return { advent: tag >= skAdvent(y) && m === 12 && t <= 23, weihnachten: m === 12 && t >= 24 && t <= 26, lucia: m === 12 && t === 13, silvester: m === 12 && t === 31, neujahr: m === 1 && t === 1,
    ostern: od >= -1 && od <= 1, ostersonntag: od === 0, halloween: m === 10 && t === 31, midsommar: m === 6 && (t === mitt || t === mitt + 1),
    geburtstag: !!S.geburtstag && S.geburtstag === md, winterzeit: (tag >= skAdvent(y) && m === 12) };
}
function festSkin(fig) {
  const f = festHeute();
  if (fig === "rita") return f.geburtstag ? "r-krone" : null;
  if (f.lucia) return "h-lucia";
  if (f.winterzeit) return "h-weihnacht";
  if (f.ostern) return "h-osterohren";
  return null;
}
function notfallOffen() { try { return SHEETS.some(x => /^ruhe/.test(x.id || "")); } catch (e) { return false; } }
/* Welcher Skin ist gerade an? Eine Stelle für alle Regeln (Notfallplan, Sparflamme, Fest-Geschenke). */
function skinEffektiv(fig) {
  if (!S || !S.skins || notfallOffen()) return null;
  let id = S.skins[fig];
  if (!id && S.skins.auto && S.skins.festAus[fig] !== heute()) { const f = festSkin(fig); if (f && skinHat(f)) id = f; }
  const s = id && SKIN_MAP[id]; if (!s || s.fuer !== fig) return null;
  if (fig === "rita" && s.fach === "ganz" && S.tf && S.tf[heute()] === "D") return null;
  return id;
}
/* Fragmente für figuren.js. wahl: undefined = was gerade an ist, false/null = nichts, "id" = Anprobe */
function skinSchichten(fig, ansicht, wahl) {
  let id; try { id = wahl === undefined ? skinEffektiv(fig) : wahl; } catch (e) { id = null; }
  const s = id && SKIN_MAP[id]; if (!s || s.fuer !== fig) return null;
  if (fig === "rita") return { id, hinten: skinSVG(s.r.hinten), vorn: skinSVG(s.r.vorn) };
  if (ansicht === "front") return s.f ? { id, kopf: skinSVG(s.f.kopf), ohneKamm: s.deckt === "kamm", vb: s.vbFront } : null;
  const k = ansicht === "kopf";
  return { id, hinten: k ? "" : skinSVG(s.s.hinten), koerper: k ? "" : skinSVG(s.s.koerper), kopf: skinSVG(s.s.kopf), ohneKamm: s.deckt === "kamm", vb: k ? s.vbKopf : null, hoch: s.hoch || 0 };
}
/* Für das Canvas-Hühnchen (scene.js): Schichten im 100er-System */
function skinCanvasSchichten(wahl) { const id = wahl === undefined ? skinEffektiv("huhn") : wahl; const s = id && SKIN_MAP[id]; return s && s.fuer === "huhn" ? s : null; }

/* Geschenke (Feste, Bingo) – einmal am Tag geprüft */
function geschenkePruefen() {
  if (!S.skins || S.skins.geprueft === heute() || !S.onboard) return;
  S.skins.geprueft = heute();
  const neu = [];
  const gib = id => { if (!skinHat(id) && SKIN_MAP[id]) { S.skins.besitz[id] = heute(); S.skins.geschenkt[id] = heute(); neu.push(SKIN_MAP[id]); } };
  for (const fig of ["rita", "huhn"]) { const f = festSkin(fig); if (f) gib(f); }
  if (Object.values(skObj(S.bingo)).some(b => b && b.voll)) gib("h-bingo");
  if (neu.length) { speichern(); setTimeout(() => toast(neu.map(s => s.id === "r-krone" ? (skinEffektiv("rita") === "r-krone" ? "Alles Gute! Hühnchen hat dir die Geburtstagskrone aufgesetzt." : "Alles Gute! Eine Geburtstagskrone liegt im Kleiderschrank für dich bereit.") : s.id === "h-bingo" ? "Für die volle Bingo-Karte: Ein Bingo-Kranz für Hühnchen liegt im Kleiderschrank." : `Geschenkt: ${s.name}. ${skinEffektiv(s.fuer) === s.id ? (s.fuer === "rita" ? "Hühnchen hat es dir gleich aufgesetzt." : "Hühnchen hat’s schon an.") : "Liegt im Kleiderschrank bereit."}`).join("\n"), { knopf: { act: "sk-schrank", text: "Ansehen" } }), 1400); }
}

/* ---------- Als Nächstes ---------- */
function skWaren() {
  return [...D_SKINS.filter(s => skinKaufbar(s) && !(s.geschenk === "start" && !(S.skins && S.skins.intro))).map(s => ({ id: s.id, name: s.naechst || s.name, fuer: s.fuer, preis: s.preis, skin: true })),
    ...(D.laden || []).filter(x => !SK_GUTSCHEINE[x.id] && !/^fh-/.test(x.id) && x.preis && !(S.gekauft || {})[x.id] && !(x.gutschein && typeof halleGesperrt === "function" && halleGesperrt(x))).map(x => ({ id: x.id, name: x.name, preis: x.preis }))];
}
function alsNaechstes() {
  const t = talerStand(), w = skWaren();
  const z = S.skins && S.skins.ziel && w.find(x => x.id === S.skins.ziel);
  if (z) return { ...z, fehlt: Math.max(0, z.preis - t), ziel: true };
  const skins = w.filter(x => x.skin), pool = skins.length ? skins : w;
  const geht = pool.filter(x => x.preis <= t).sort((a, b) => b.preis - a.preis)[0];
  if (geht) return { ...geht, fehlt: 0 };
  const bald = (skins.length ? skins : w).filter(x => x.preis > t).sort((a, b) => a.preis - b.preis)[0];
  return bald ? { ...bald, fehlt: bald.preis - t } : null;
}
const skWarenName = n => n.skin ? `${n.name}${n.fuer === "huhn" ? " für Hühnchen" : A(" für dich", " für Sie")}` : n.name;
function naechstesText() {
  const n = alsNaechstes();
  if (!n) { const sf = typeof sfDieseWoche === "function" && sfDieseWoche(); return sf ? `Im Schaufenster diese Woche: ${sf.name} (${sf.preis} Taler).` : "Alles gekauft, was im Laden steht. Hühnchen guckt trotzdem jeden Tag ins Schaufenster."; }
  return n.fehlt ? `${n.ziel ? "Dein Ziel" : "Als Nächstes"}: ${skWarenName(n)} – noch ${n.fehlt} Taler.` : `Reicht schon für: ${skWarenName(n)} (${n.preis} Taler).`;
}

/* ---------- Münze, Icons ---------- */
const MUENZE = (k = "muenze") => `<svg class="${k}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12.6" r="10" fill="#B9801E"/><circle cx="12" cy="11.4" r="10" fill="#E8B23E"/><circle cx="12" cy="11.4" r="7.2" fill="none" stroke="#C48C24" stroke-width="1.4"/><path d="M8.4 8.2h7.2v2h-2.6v5.6h-2V10.2H8.4Z" fill="#8A5A12"/><path d="M6.4 7.4a7 7 0 0 1 4-3" stroke="#FFF3C8" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/></svg>`;
Object.assign(IC, {
  laden: "M3.2 3.5h17.6l1.7 5.6c0 1.6-1.3 2.9-2.9 2.9-1.1 0-2.1-.6-2.5-1.6-.5 1-1.5 1.6-2.6 1.6S12.4 11.4 12 10.4c-.4 1-1.4 1.6-2.5 1.6S7.3 11.4 6.9 10.4C6.4 11.4 5.4 12 4.3 12 2.7 12 1.5 10.7 1.5 9.1L3.2 3.5ZM4 13.6c.1 0 .2 0 .3 0 1 0 1.9-.3 2.6-.8.7.5 1.6.8 2.6.8s1.8-.3 2.5-.8c.7.5 1.6.8 2.5.8s1.9-.3 2.6-.8c.7.5 1.6.8 2.6.8h.3V21h-6v-5h-4v5H4v-7.4Z",
  buegel: "M12 3a3 3 0 0 1 3 3c0 1.2-.7 2.2-1.8 2.7v1.4l8.3 6.1c.8.6.4 1.8-.6 1.8H3.1c-1 0-1.4-1.2-.6-1.8l8.3-6.1V7.6h1.2a1.2 1.2 0 1 0-1.2-1.2H9A3 3 0 0 1 12 3Z",
  muenze: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-3.6 6.2v2h2.6v5.6h2v-5.6h2.6v-2H8.4Z",
  wolke: "M6.5 19a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.7 3.7 0 0 1 17.5 19h-11Z",
  mond: "M14.6 2.6a9.6 9.6 0 1 0 6.8 15.6A8.4 8.4 0 0 1 14.6 2.6Z"
});

/* ============================================================
   Taler-Plakette in der Kopfzeile (mit Münzflug und Hochzählen)
   ============================================================ */
const PLAK = { n: null, quelle: null, zaehl: 0 };
function plaketteEl() {
  let el = document.getElementById("taler-plakette"); if (el) return el;
  const kopf = document.querySelector("header.kopf"); if (!kopf) return null;
  el = document.createElement("button"); el.id = "taler-plakette"; el.className = "taler-plakette"; el.dataset.act = "sk-taler";
  el.innerHTML = `<span class="tp-pille">${MUENZE()}<span class="tp-zahl zahl"></span></span>`;
  kopf.appendChild(el); plakettePlatzieren(); return el;
}
/* Ziel: die Plakette bekommt einen Ring um die Münze, der sich füllt */
function skZielStand() {
  const id = S.skins && S.skins.ziel; if (!id) return null;
  const w = skWaren().find(x => x.id === id); if (!w) return null;
  const t = talerStand(); return { ...w, fehlt: Math.max(0, w.preis - t), pct: Math.min(100, Math.round(t / w.preis * 100)) };
}
function plaketteMalen(n, zwang) { if (PLAK.laeuft && !zwang) return; const el = plaketteEl(); if (!el) return; el.querySelector(".tp-zahl").textContent = n;
  let z = null; try { z = skZielStand(); } catch (e) { }
  el.classList.toggle("tp-ziel", !!z); if (z) el.style.setProperty("--tp-p", z.pct + "%");
  el.setAttribute("aria-label", `${n} Taler${z ? (z.fehlt ? ` – für dein Ziel fehlen noch ${z.fehlt}` : " – dein Ziel ist erreicht") : ""} – zum Kramladen`); }
/* Ziel erreicht: einmal ein kleiner Glückwunsch von Hühnchen (wartet, bis kein anderer Hinweis mehr zu sehen ist) */
function zielPruefen() {
  if (!S || !S.skins || !S.onboard) return;
  const z = skZielStand(); if (!z) return;
  if (z.fehlt) { if (S.skins.zielGemeldet === z.id) S.skins.zielGemeldet = null; return; }
  if (S.skins.zielGemeldet === z.id || KS.zielWartet) return;
  KS.zielWartet = true; let n = 0;
  const zeig = () => { const z2 = skZielStand(); if (!z2 || z2.fehlt) { KS.zielWartet = false; return; }
    if (document.querySelector(".toast") && n++ < 30) { setTimeout(zeig, 2500); return; }
    KS.zielWartet = false; S.skins.zielGemeldet = z2.id; speichern();
    toast(`Hühnchen: „Dein Ziel ist drin! Die Taler für ${skWarenName(z2)} liegen zusammen.“`, { erfolg: true, knopf: { act: "sk-ziel-zeigen", text: "Ansehen" }, dauer: 9000 }); };
  setTimeout(zeig, 1600);
}
function plakettePlatzieren() {
  const el = document.getElementById("taler-plakette"), lg = document.getElementById("logo"), kopf = document.querySelector("header.kopf"); if (!el || !lg || !kopf) return;
  const r = lg.getBoundingClientRect(), k = kopf.getBoundingClientRect(); if (!r.width) return;
  el.style.left = Math.round(r.right - k.left - 20) + "px"; el.style.top = Math.round(r.bottom - k.top - 30) + "px";
}
function talerPruefen() {
  if (!S || typeof talerStand !== "function") return;
  const n = talerStand();
  try { zielPruefen(); } catch (e) { }
  if (PLAK.n == null || !document.getElementById("taler-plakette")) { PLAK.n = n; plaketteMalen(n, true); return; }
  if (n === PLAK.n) return;
  const alt = PLAK.n; PLAK.n = n;
  if (n > alt && !REDUCED()) talerFlug(alt, n); else zaehle(alt, n, 350);
}
function zaehle(von, bis, ms) {
  const el = plaketteEl(); if (!el) return; cancelAnimationFrame(PLAK.zaehl);
  const t0 = performance.now(), z = el.querySelector(".tp-zahl");
  PLAK.laeuft = true;
  const f = now => { const k = clamp((now - t0) / ms, 0, 1); z.textContent = Math.round(von + (bis - von) * (1 - Math.pow(1 - k, 2))); if (k < 1) PLAK.zaehl = requestAnimationFrame(f); else { PLAK.laeuft = false; plaketteMalen(PLAK.n != null ? PLAK.n : bis, true); } };
  PLAK.zaehl = requestAnimationFrame(f);
  if (bis > von) { el.classList.remove("tp-hops"); void el.offsetWidth; el.classList.add("tp-hops"); }
}
function talerFlug(von, bis, start) {
  const el = plaketteEl(); if (!el) return;
  const ziel = el.querySelector(".muenze").getBoundingClientRect();
  const q = start || (PLAK.quelle && performance.now() - PLAK.quelle.t < 5000 ? PLAK.quelle : { x: innerWidth / 2, y: innerHeight * .6 });
  const n = Math.min(bis - von, 5), sichtbar = ziel.bottom > 4 && ziel.top < innerHeight;
  if (PLAK.leise) { PLAK.leise = false; if (!sichtbar) { plaketteMalen(bis, true); return; } }
  if (!sichtbar) { // Kopfzeile weggescrollt: kleine „+N“-Münze an Ort und Stelle
    const p = document.createElement("div"); p.className = "taler-plus"; p.innerHTML = `${MUENZE()}<span>+${bis - von}</span>`; p.style.left = q.x + "px"; p.style.top = q.y + "px"; document.body.appendChild(p); setTimeout(() => p.remove(), 1600); plaketteMalen(bis, true); return; }
  PLAK.laeuft = true; plaketteMalen(von, true); PLAK.laeuft = true;
  for (let i = 0; i < n; i++) {
    const m = document.createElement("div"); m.className = "taler-flug"; m.innerHTML = MUENZE(); m.style.left = (q.x - 11) + "px"; m.style.top = (q.y - 11) + "px"; document.body.appendChild(m);
    const dx = ziel.left - q.x + 2, dy = ziel.top - q.y + 2, mx = dx * .4 + (i - n / 2) * 18, my = Math.min(dy, 0) - 70 - i * 6;
    const a = m.animate([{ transform: "translate(0,0) scale(.6)", opacity: 0 }, { transform: `translate(${mx}px,${my}px) scale(1.1)`, opacity: 1, offset: .45 }, { transform: `translate(${dx}px,${dy}px) scale(.8)`, opacity: 1 }], { duration: 760 + i * 90, delay: i * 90, easing: "cubic-bezier(.4,0,.3,1)", fill: "forwards" });
    a.onfinish = () => { m.remove(); if (i === n - 1) zaehle(von, bis, 520); };
  }
  if (S.ton) try { ton("erfolg"); } catch (e) { }
}
{ const s0 = speichern; speichern = function () { s0(); try { talerPruefen(); } catch (e) { } }; }
document.addEventListener("pointerdown", ev => { PLAK.quelle = { x: ev.clientX, y: ev.clientY, t: performance.now() }; }, true);
addEventListener("resize", () => setTimeout(plakettePlatzieren, 60));

/* ============================================================
   Logo und Figuren aktualisieren
   ============================================================ */
let SK_LOGO = "?";
function figurenAktualisieren(erzwingen) {
  const lg = document.getElementById("logo"); if (!lg) return;
  const id = skinEffektiv("rita") || "";
  if (erzwingen || id !== SK_LOGO || !lg.firstChild) { SK_LOGO = id; const f = lg.querySelector(".halte-finger"); lg.innerHTML = ritaSVG(72); if (f) lg.appendChild(f); }
}
function skRender() { try { render({ halteScroll: true, ohneAnim: true }); } catch (e) { } figurenAktualisieren(); }

/* ============================================================
   Kleiderschrank
   ============================================================ */
const KS = { fig: "rita", sel: null, probe: {}, rueck: null };
const skOutfit = fig => { const id = skinEffektiv(fig); return id ? SKIN_MAP[id].name : "wie immer"; };
const skProbe = fig => KS.probe[fig] !== undefined ? KS.probe[fig] : skinEffektiv(fig);
const skNeu = s => s.ab && s.ab === skMonat() && !skinHat(s.id);
const skSaison = s => s.saison && s.saison.includes(jetzt().getMonth() + 1);
const GESCHENK_WANN = { start: "zum Start", advent: "im Advent", lucia: "am 13. Dezember", geburtstag: "an deinem Geburtstag", bingo: "für eine volle Bingo-Karte", ostern: "zu Ostern" };
function figurMini(fig, id, gr) {
  if (fig === "rita") return ritaSVG(gr, { skin: id });
  const s = id && SKIN_MAP[id], kopf = !s || s.fach === "kopf" || s.fach === "augen";
  return huhnSVG({ gr, kopf, skin: id || null });
}
function kleiderschrankKarte() {
  const neu = D_SKINS.some(s => skNeu(s));
  return `<section class="abschnitt"><button class="ks-karte" data-act="sk-schrank" aria-label="Kleiderschrank öffnen">
    <span class="ks-titel">${ic("buegel")} Kleiderschrank${neu ? ` <span class="ks-marke">Neu</span>` : ""}${ic("pfeil", "pfeil")}</span>
    <span class="ks-karte-zeile"><span class="ks-karte-figs" aria-hidden="true">${ritaSVG(56)}${huhnSVG({ gr: 62 })}</span>
    <span class="ks-karte-text"><span class="klein">${esc(S.name || "Rita")}: ${esc(skOutfit("rita"))}<br>Hühnchen: ${esc(skOutfit("huhn"))}</span>
    <span class="ks-naechst">${MUENZE()}<span>${esc(naechstesText())}</span></span></span></span></button></section>`;
}
function zweiTueren() {
  const neu = D_SKINS.some(s => skNeu(s));
  return `<section class="abschnitt"><div class="tueren-zwei">
    <button class="laden-tuer" data-act="sk-schrank"><span class="lt-bild" aria-hidden="true">${ritaSVG(50)}${huhnSVG({ gr: 54 })}</span><span class="lt-titel">${ic("buegel")} Kleiderschrank${neu ? ` <span class="ks-marke">Neu</span>` : ""}</span><span class="lt-unter">Hüte, Brillen, Outfits</span></button>
    <button class="laden-tuer" data-act="laden"><span class="lt-bild" aria-hidden="true">${LADEN_FRONT}</span><span class="lt-titel">${ic("laden")} Kramladen</span><span class="lt-unter">Bild, Spiele, Lesestoff, Post aus Halle</span></button>
  </div><p class="ks-naechst tueren-naechst">${MUENZE()}<span>${esc(naechstesText())}</span></p></section>`;
}
function kleiderschrankSheet(fig) {
  if (fig) KS.fig = fig; KS.sel = null; KS.probe = {};
  if (S.skins) { S.skins.neuGesehen = skMonat(); speichern(); }
  sheet({ titel: "Kleiderschrank", id: "schrank", inhalt: ksInhalt(), fuss: ksFuss(), onclose: () => { KS.probe = {}; KS.sel = null; } });
}
function ksInhalt() {
  const t = talerStand(), f = KS.fig;
  let h = `<div class="ks-buehne">${["rita", "huhn"].map(x => { const id = skProbe(x); return `<button class="ks-fig${x === f ? " an" : ""}" data-act="sk-fig" data-v="${x}" aria-pressed="${x === f}">${x === "rita" ? ritaSVG(112, { skin: id || null }) : huhnSVG({ gr: 118, skin: id || null })}<span class="ks-fig-text"><span class="ks-fig-name">${x === "rita" ? esc(S.name || "Rita") : "Hühnchen"}</span><span class="klein">${id ? esc(SKIN_MAP[id].name) : "wie immer"}</span>${KS.probe[x] !== undefined && KS.probe[x] !== skinEffektiv(x) ? `<span class="ks-probe-marke">zur Probe</span>` : ""}</span></button>`; }).join("")}</div>`;
  h += `<div class="ks-kasse">${MUENZE()}<span><span class="zahl" style="font-weight:700">${t} Taler</span><br><span class="klein">${esc(naechstesText())}</span></span></div>`;
  for (const fa of SKIN_FAECHER) {
    const teile = D_SKINS.filter(s => s.fuer === f && s.fach === fa.id && (skinDa(s) || skinHat(s.id)));
    if (!teile.length) continue;
    h += `<h3 class="ks-fach">${esc(fa.name)}</h3><div class="ks-raster">${teile.map(s => ksKachel(s, t)).join("")}</div>`;
  }
  h += `<h3 class="ks-fach">Sammelreihen</h3><p class="klein" style="margin-top:0">Ist eine Reihe komplett, legt Max ${SKIN_REIHEN[0].bonus} Taler obendrauf. Tipp auf ein Teil, dann wird es anprobiert.</p><div class="ks-reihen">${SKIN_REIHEN.map(r => { const voll = S.skins.reihen[r.id]; return `<div class="ks-reihe${voll ? " voll" : ""}"><span class="ks-reihe-name">${esc(r.name)}${voll ? ` ${ic("haken")}` : ` <span class="klein">+${r.bonus} Taler</span>`}</span>${voll ? `<p class="klein ks-reihe-satz">${esc(r.satz)}</p>` : ""}<span class="ks-reihe-teile">${r.ids.map(id => { const s = SKIN_MAP[id]; if (!s) return ""; const da = skinDa(s) || skinHat(id); return `<button class="ks-punkt${skinHat(id) ? " hat" : ""}${da ? "" : " bald"}" data-act="sk-probe" data-id="${id}" aria-label="${esc(s.name)} – ${s.fuer === "rita" ? esc(S.name || "Rita") : "Hühnchen"}${skinHat(id) ? ", gehört dir" : ""}"><span class="ks-punkt-kopf" aria-hidden="true">${s.fuer === "rita" ? ritaSVG(30, { skin: id }) : huhnSVG({ gr: 30, kopf: true, skin: s.fach === "kopf" || s.fach === "augen" ? id : null })}</span><span class="ks-punkt-text"><span class="ks-punkt-wer">${s.fuer === "rita" ? esc(S.name || "Rita") : "Hühnchen"}</span><span>${esc(s.name)}${da ? "" : ` <i>(ab ${MONAT[Number(s.ab.slice(5)) - 1]})</i>`}</span></span>${skinHat(id) ? ic("haken") : ""}</button>`; }).join("")}</span></div>`; }).join("")}</div>`;
  h += `<div class="liste" style="margin-top:16px">${schalter(!!S.skins.auto, "Hühnchen zieht sich zu Festen selbst an", `data-act="sk-auto"`, "Im Advent, an Lucia, zu Ostern – und an deinem Geburtstag. Was du selbst aussuchst, geht vor.")}</div>`;
  h += `<p style="text-align:center;margin:14px 0 4px"><button class="knopf klein leise" data-act="sk-alleaus">Beide wieder wie immer</button></p>`;
  return h;
}
function ksKachel(s, t) {
  const hat = skinHat(s.id), traegt = skinEffektiv(s.fuer) === s.id, sel = KS.sel === s.id;
  const marke = traegt ? `<span class="ks-marke traegt">${s.fuer === "rita" ? A("Trägst du", "Tragen Sie") : "Hat’s an"}</span>` : skNeu(s) ? `<span class="ks-marke">Neu</span>` : (!hat && skSaison(s)) ? `<span class="ks-marke saison">Passt gerade</span>` : "";
  const preis = hat ? `<span class="ks-hat">${ic("haken")} Gehört dir</span>` : s.preis ? `<span class="preis-schild${t >= s.preis ? " geht" : ""}">${MUENZE()}${s.preis}</span>` : `<span class="ks-geschenk">Geschenk ${esc(GESCHENK_WANN[s.geschenk] || "")}</span>`;
  return `<button class="ks-teil${sel ? " gewaehlt" : ""}${traegt ? " traegt" : ""}" data-act="sk-probe" data-id="${s.id}" aria-pressed="${sel}"><span class="ks-teil-bild" aria-hidden="true">${figurMini(s.fuer, s.id, 70)}</span>${marke}<span class="ks-teil-name">${esc(s.name)}</span>${preis}</button>`;
}
function ksFuss() {
  const s = KS.sel && SKIN_MAP[KS.sel];
  if (!s) return `<p class="klein ks-fuss-tipp">Tipp auf ein Teil, dann wird anprobiert. Kostet nichts.</p>`;
  const t = talerStand(), hat = skinHat(s.id), traegt = skinEffektiv(s.fuer) === s.id, wer = s.fuer === "rita" ? A("dir", "Ihnen") : "Hühnchen";
  let k = "";
  if (hat) k = traegt ? `<button class="knopf zweit voll" data-act="sk-aus" data-v="${s.fuer}">Ausziehen</button>` : `<button class="knopf haupt voll" data-act="sk-an" data-id="${s.id}">Anziehen</button>`;
  else if (!s.preis) k = `<p class="klein" style="margin:0">Das gibt’s nicht zu kaufen – es kommt ${esc(GESCHENK_WANN[s.geschenk] || "als Geschenk")}.</p>`;
  else if (t >= s.preis) k = `<button class="knopf haupt voll" data-act="sk-kaufen" data-id="${s.id}">${MUENZE()} Für ${s.preis} Taler kaufen</button>`;
  else if (!skinDa(s)) k = `<p class="klein" style="margin:0">Kommt im ${MONAT[Number(s.ab.slice(5)) - 1]} in den Laden. Anprobieren geht schon.</p>`;
  else k = `<div class="stapel">${skFortschritt(s.preis, t, s.fuer === "huhn" ? "dann gehört es Hühnchen" : A("dann gehört es dir", "dann gehört es Ihnen"))}${S.skins.ziel === s.id ? `<button class="knopf leise voll" data-act="sk-ziel" data-id="">${ic("haken")} Ist dein Ziel – nicht mehr merken</button>` : `<button class="knopf zweit voll" data-act="sk-ziel" data-id="${s.id}">${ic("stern")} Als Ziel merken</button>`}</div>`;
  return `<div class="ks-fuss"><div class="ks-fuss-text"><span style="font-weight:700">${esc(s.name)}</span><span class="klein">${esc(s.text)}</span></div>${k}</div>`;
}
function ksNeu(wackel) {
  const sh = aktuellesSheet(); if (!sh || sh.dataset.id !== "schrank") return;
  sheetInhalt(ksInhalt()); sheetFuss(ksFuss());
  if (wackel && !REDUCED()) { const el = sh.querySelector(`.ks-fig[data-v="${wackel}"]`); if (el) { el.classList.remove("hops"); void el.offsetWidth; el.classList.add("hops"); } }
}
function reiheVoll() {
  for (const r of SKIN_REIHEN) if (!S.skins.reihen[r.id] && r.ids.every(skinHat)) { S.skins.reihen[r.id] = heute(); S.taler += r.bonus; return r; }
  return null;
}
function skinKaufen(id) {
  const s = SKIN_MAP[id]; if (!s || !skinKaufbar(s) || talerStand() < s.preis) return;
  const vorher = S.skins[s.fuer], zielVorher = S.skins.ziel;
  S.taler -= s.preis; S.talerAusgegeben = (S.talerAusgegeben || 0) + s.preis; S.skins.besitz[id] = heute(); S.skins[s.fuer] = id; if (S.skins.ziel === id) S.skins.ziel = null;
  const r = reiheVoll();
  KS.rueck = { id, fuer: s.fuer, vorher, zielVorher, reihe: r && r.id, bonus: r ? r.bonus : 0 }; KS.probe = {};
  speichern(); haptik("erfolg"); try { ton("erfolg"); } catch (e) { }
  figurenAktualisieren(); ksNeu(s.fuer);
  toast(`Gehört dir: ${s.name}. ${s.fuer === "rita" ? A("Steht dir!", "Steht Ihnen!") : "Hühnchen hat’s gleich an."}${r ? `\n${r.name} komplett! ${r.satz}\nMax legt ${r.bonus} Taler obendrauf.` : ""}`, { erfolg: true, knopf: { act: "sk-rueck", text: "Rückgängig" }, dauer: r ? 9000 : undefined });
  setTimeout(() => skRender(), 30);
}
function skinRueck() {
  const k = KS.rueck; KS.rueck = null; if (!k || !skinHat(k.id)) return;
  const s = SKIN_MAP[k.id]; delete S.skins.besitz[k.id]; S.taler += s.preis; S.talerAusgegeben = Math.max(0, (S.talerAusgegeben || 0) - s.preis);
  S.skins[k.fuer] = k.vorher; S.skins.ziel = k.zielVorher; if (k.reihe) { delete S.skins.reihen[k.reihe]; S.taler -= k.bonus; }
  speichern(); figurenAktualisieren(); ksNeu(); skRender(); toast("Rückgängig gemacht. Die Taler sind wieder da.");
}

/* ============================================================
   Kramladen als Laden mit Abteilungen
   ============================================================ */
const LADEN_ABT = { "Wald & Garten": { id: "bild", name: "Fürs Bild", icon: "blume" }, "Spiel": { id: "spiele", name: "Spiele", icon: "karten" }, "Klänge": { id: "hoeren", name: "Zum Hören", icon: "glocke" }, "Zum Lesen": { id: "lesen", name: "Zum Lesen", icon: "buch" }, "Ausflüge": { id: "ausflug", name: "Für Ausflüge", icon: "rucksack" }, "Aus Halle": { id: "halle", name: "Aus Halle", icon: "brief" } };
if (typeof D !== "undefined" && Array.isArray(D.laden) && !D.laden.some(x => x.id === "memory")) D.laden.splice(Math.max(0, D.laden.findIndex(x => x.id === "rueckenmotiv")) + 1, 0, { id: "memory", gruppe: "Spiel", name: "Figuren-Memory", preis: 70, text: `${A("Du", "Sie")}, Max, Christiane, Hühnchen und die anderen als Kartenpaare. Wer findet Micha zweimal? Ohne Uhr, ohne Punkte. Einmal am Tag gibt’s 3 Taler fürs Durchspielen.`, icon: "karten" });
/* Waren-Bild: eigenes Motiv (WARE_ICF in core.js), sonst das Symbol des Artikels – im Stil der Objekt-Symbole.
   Der runde „Lindberg-Teller“ dahinter kommt aus design.css (.ware-bild). */
function wareBild(x, gr = 64) {
  const f = WARE_ICF[x.id] || ICF[x.icon] || ICF.stern;
  return `<svg class="ware-svg ic-f" viewBox="0 0 48 48" width="${gr}" height="${gr}" aria-hidden="true">${f}</svg>`;
}
const LADEN_FRONT = `<svg class="laden-front-svg" viewBox="0 0 96 64" aria-hidden="true"><rect x="10" y="20" width="76" height="42" fill="#E8DCC0"/><rect x="10" y="20" width="76" height="42" fill="none" stroke="#B5A486" stroke-width="2"/><path d="M6 10h84l-4 12H10Z" fill="#B5532F"/><path d="M18 10l-3 12M30 10l-2 12M42 10l-1 12M54 10l1 12M66 10l2 12M78 10l3 12" stroke="#F3E6CF" stroke-width="5"/><path d="M10 22 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 4 0" fill="#B5532F"/><rect x="16" y="32" width="34" height="22" rx="2" fill="#BFD3DC"/><rect x="58" y="30" width="20" height="32" rx="2" fill="#6B4A30"/><circle cx="74" cy="47" r="1.4" fill="#E2A93B"/><g><circle cx="24" cy="48" r="4" fill="#C8363A"/><rect x="31" y="42" width="7" height="10" fill="#3E7FB8"/><path d="M40 52 l4-10 l4 10Z" fill="#E2A93B"/></g></svg>`;
/* Hühnchen hilft im Laden aus: ein Satz pro Tag an der Kasse */
const LADEN_HUHN = ["Anfassen erlaubt. Kaufen auch.", "Ich krieg keine Provision. Sag ich nur.", "Die Sternbilder hab ich nachts schon mal angeguckt. Leuchten gut.", "Halloren? Ich hab nichts gesehen. Und nichts gegessen.", "Na? Ich hab extra Staub gewischt.", "Das Rotkehlchen hat gefragt, ob’s bei dir einziehen darf. Ich hab gesagt: Frag die Chefin.", "Rabatt gibt’s nicht. Aber ich halt dir die Tür auf.", "Schau mal ins Schaufenster. Hab ich selbst dekoriert."];
/* Fortschritt statt ausgegrautem Knopf */
function skFortschritt(preis, t, satz) {
  const n = Math.max(0, Math.ceil(preis - t)), pct = Math.min(100, Math.round(t / preis * 100));
  return `<div class="sk-fortschritt"><span class="gk-balken" role="img" aria-label="${pct} Prozent"><i style="width:${pct}%"></i></span><p class="klein" style="margin:6px 0 0">Noch <b>${n} Taler</b>, ${esc(satz)}.</p></div>`;
}
function kramladenInhalt() {
  const t = talerStand();
  const abt = []; for (const x of D.laden || []) { if (SK_GUTSCHEINE[x.id]) continue; const a = LADEN_ABT[x.gruppe] || { id: "x" + hash32(x.gruppe), name: x.gruppe, icon: "stern" }; let e = abt.find(y => y.id === a.id); if (!e) { e = { ...a, waren: [] }; abt.push(e); } e.waren.push(x); }
  const satz = LADEN_HUHN[hash32("laden" + heute()) % LADEN_HUHN.length];
  let h = `<div class="laden-front"><div class="markise" aria-hidden="true"></div><div class="laden-kasse"><button class="muenze-knopf" data-act="sk-muenze" aria-label="Münze drehen">${MUENZE("muenze gross")}</button><span><span class="zahl" style="font-weight:700;font-size:1.25em">${t} Taler</span><br><span class="klein">Gibt’s für alles, was du einträgst, und fürs Spielen im Bild. Verfallen nie – anders als Quark.</span></span></div>${S.huhn ? `<p class="laden-huhn">${huhnSVG({ gr: 40, kopf: true })}<span><span class="wer">Hühnchen</span> ${esc(satz)}</span></p>` : ""}<p class="laden-naechst">${ic("stern")}<span>${esc(naechstesText())}</span></p></div>`;
  h += `<div class="laden-chips-rahmen"><div class="chips laden-chips">${[{ id: "fenster", name: "Schaufenster" }, ...abt, { id: "bald", name: "Bald im Laden" }, ...(typeof fhRegal === "function" && S.huhn ? [{ id: "fuerhuhn", name: "Für Hühnchen" }] : []), { id: "nebenan", name: "Nebenan: Kleiderschrank" }].map(a => `<button class="chip" data-act="sk-abt" data-v="${a.id}">${esc(a.name)}</button>`).join("")}</div></div>`;
  if (typeof sfRegal === "function") h += sfRegal();
  for (const a of abt) {
    h += `<section class="laden-abt" id="abt-${a.id}"><h3 class="abt-schild">${ic(a.icon)} ${esc(a.name)}</h3><div class="regal">${a.waren.map(x => {
      const hat = (S.gekauft || {})[x.id], hs = x.gutschein && typeof halleSchild === "function" ? halleSchild(x, t) : "";
      return `<button class="ware-kachel${hat ? " hat" : ""}" data-act="sk-ware" data-id="${x.id}"><span class="ware-bild">${wareBild(x, 60)}</span><span class="ware-name">${esc(x.name)}</span>${hs || (hat ? `<span class="ks-hat">${ic("haken")} Gehört dir</span>` : `<span class="preis-schild${t >= x.preis ? " geht" : ""}">${MUENZE()}${x.preis}</span>`)}</button>`;
    }).join("")}</div><div class="regal-brett" aria-hidden="true"></div></section>`;
  }
  if (typeof baldRegal === "function") h += baldRegal();
  if (typeof fhRegal === "function") h += fhRegal(); // Für Hühnchen (huhnfutter.js): unter Schaufenster und Skins
  const neu = D_SKINS.some(skNeu);
  h += `<section class="laden-abt laden-nebenan" id="abt-nebenan"><p class="klein nebenan-schild">Eine Tür weiter</p><button class="laden-tuer nebenan-tuer" data-act="sk-schrank"><span class="lt-bild" aria-hidden="true">${ritaSVG(50)}${huhnSVG({ gr: 54 })}</span><span class="nebenan-text"><span class="lt-titel">Nebenan: Kleiderschrank${neu ? ` <span class="ks-marke">Neu</span>` : ""}</span><span class="lt-unter">Hüte, Brillen und Outfits für dich und Hühnchen. Anprobieren kostet nichts.</span></span>${ic("pfeil", "pfeil")}</button></section>`;
  return h;
}
function wareSheet(id) {
  const x = (D.laden || []).find(y => y.id === id); if (!x) return;
  const t = talerStand(), hat = (S.gekauft || {})[x.id];
  const halle = x.gutschein && typeof halleWare === "function" ? halleWare(x, t) : null;
  const oeffnen = x.id === "memory" ? `<button class="knopf haupt voll" data-act="sk-memory">Spielen</button>` : (typeof ladenOeffnen === "function" ? ladenOeffnen(x.id).replace(/knopf klein leise/g, "knopf haupt voll") : "");
  const fuss = halle && halle.fuss ? halle.fuss
    : hat && /^rueck/.test(x.id) && typeof rueckenFuss === "function" ? rueckenFuss(x.id)
    : hat ? (oeffnen ? `<div class="stapel">${oeffnen}</div>` : `<p class="klein" style="margin:0;text-align:center">${ic("haken")} Gehört dir – ${/Wald & Garten/.test(x.gruppe) ? "schau mal ins Bild." : "liegt bereit."}</p>`)
    : t >= x.preis ? `<button class="knopf haupt voll" data-act="kaufen-ja" data-id="${x.id}">${MUENZE()} Für ${x.preis} Taler kaufen</button>`
    : `<div class="stapel">${skFortschritt(x.preis, t, A("dann gehört es dir", "dann gehört es Ihnen"))}${S.skins.ziel === x.id ? `<button class="knopf leise voll" data-act="sk-ziel" data-id="">${ic("haken")} Ist dein Ziel – nicht mehr merken</button>` : `<button class="knopf zweit voll" data-act="sk-ziel" data-id="${x.id}">${ic("stern")} Als Ziel merken</button>`}</div>`;
  const sh = sheet({ titel: x.name, id: "ware", inhalt: `<div class="ware-gross">${wareBild(x, 120)}</div><p>${esc(x.text)}</p>${halle && halle.extra || ""}`, fuss }); if (sh) sh.dataset.ware = x.id;
}

/* ============================================================
   Wetter im Bild (Auswahl)
   ============================================================ */
const SK_WETTER_NAME = { echt: "Wie draußen", sonne: "Sonne", wolken: "Wolken", regen: "Regen", schnee: "Schnee", nebel: "Nebel" };
function bildWetterKnopf() {
  let w = { art: "sonne", unbekannt: true }; try { w = bildWetter(); } catch (e) { }
  let nachts = false; try { nachts = spielKontext().nacht > .5; } catch (e) { }
  const art = w.art, icon = w.unbekannt && S.bildWetter === "echt" ? "lichtung" : art === "sonne" ? (nachts ? "mond" : "sonne") : { wolken: "wolke", regen: "regen", schnee: "stern", nebel: "wolke" }[art] || "sonne";
  const wort = { sonne: "klar", wolken: "bewölkt", regen: "Regen", schnee: "Schnee", nebel: "Nebel" }[art] || "";
  const was = S.bildWetter === "echt" ? `wie draußen${!w.unbekannt && wort ? ` (${wort})` : ""}` : esc(SK_WETTER_NAME[S.bildWetter]);
  return `<button class="bild-wetter-knopf" data-act="sk-wetter">${ic(icon)}<span>Wetter im Bild: <span style="font-weight:700">${was}</span></span><span class="klein">ändern</span></button>`;
}
function bildWetterInhalt() {
  return `<p>Das Bild zeigt sonst das Wetter wie draußen am Spandauer Forst. ${A("Du kannst", "Sie können")} es auch selbst bestimmen – zum Beispiel Schnee, wenn ${A("dir", "Ihnen")} danach ist.</p><div class="chips">${SK_WETTER.map(w => chip(S.bildWetter === w, SK_WETTER_NAME[w], `data-act="sk-wetter-setz" data-v="${w}"`)).join("")}</div><p class="klein" style="margin-top:12px">Bei Schnee im Bild kann man manchmal einen Schneemann bauen.</p>`;
}

/* ============================================================
   Figuren-Memory
   ============================================================ */
const MEM = { karten: [], offen: [], gefunden: [], zuege: 0, sperre: false };
const MEM_FIG = { rita: g => ritaSVG(g, { skin: false }), huhn: g => huhnSVG({ gr: g, kopf: true, skin: false }), max: g => maxSVG(g), jane: g => janeSVG(g), micha: g => michaSVG(g), greta: g => gretaSVG(g), pauli: g => pauliSVG(g), karin: g => karinKopfSVG(g) };
const MEM_NAME = { rita: S && S.name || "Rita", huhn: "Hühnchen", max: "Max", jane: "Christiane", micha: "Micha", greta: "Greta", pauli: "Pauli", karin: "Karin" };
function memNeu(paare) {
  paare = paare === 8 ? 8 : 6; S.memory.paare = paare; speichern();
  const wer = Object.keys(MEM_FIG).sort(() => Math.random() - .5).slice(0, paare);
  MEM.karten = [...wer, ...wer].map(w => ({ w })).sort(() => Math.random() - .5); MEM.offen = []; MEM.gefunden = []; MEM.zuege = 0; MEM.sperre = false;
}
function memorySheet() { memNeu(S.memory.paare); sheet({ titel: "Figuren-Memory", id: "memory", inhalt: memInhalt() }); }
function memInhalt() {
  const fertig = MEM.gefunden.length === MEM.karten.length;
  return `<div class="chips" style="margin-bottom:10px">${chip(S.memory.paare === 6, "6 Paare", `data-act="sk-mem-neu" data-v="6"`)}${chip(S.memory.paare === 8, "8 Paare", `data-act="sk-mem-neu" data-v="8"`)}</div>
  <div class="mem-tisch p${MEM.karten.length}">${MEM.karten.map((k, i) => { const auf = MEM.offen.includes(i) || MEM.gefunden.includes(i); return `<button class="mem-karte${auf ? " auf" : ""}${MEM.gefunden.includes(i) ? " weg" : ""}" data-act="sk-mem" data-i="${i}" aria-label="${auf ? esc(MEM_NAME[k.w]) : "Karte " + (i + 1)}"><span class="mem-innen"><span class="mem-rueck" aria-hidden="true"></span><span class="mem-vorn" aria-hidden="true">${MEM_FIG[k.w](58)}</span></span></button>`; }).join("")}</div>
  <p class="klein mem-status" aria-live="polite">${fertig ? `Alle gefunden, in ${MEM.zuege} Zügen. ${MEM.belohnt ? "3 Taler fürs Durchspielen sind gebucht." : ""}` : `Zwei Karten aufdecken. Gleiche Gesichter bleiben liegen.`}</p>
  ${fertig ? `<button class="knopf haupt voll" data-act="sk-mem-neu" data-v="${S.memory.paare}">Nochmal mischen</button>` : ""}`;
}
function memKarte(i) {
  if (MEM.sperre || MEM.offen.includes(i) || MEM.gefunden.includes(i)) return;
  MEM.offen.push(i); haptik("auswahl");
  if (MEM.offen.length === 2) {
    MEM.zuege++; const [a, b] = MEM.offen;
    if (MEM.karten[a].w === MEM.karten[b].w) { MEM.gefunden.push(a, b); MEM.offen = []; haptik("erfolg");
      if (MEM.gefunden.length === MEM.karten.length) { MEM.belohnt = false; if (S.memory.tag !== heute()) { S.memory.tag = heute(); S.taler += 3; MEM.belohnt = true; } S.memory.spiele++; speichern(); try { ton("erfolg"); } catch (e) { } }
    } else { MEM.sperre = true; setTimeout(() => { MEM.offen = []; MEM.sperre = false; memZeigen(); }, 1100); }
  }
  memZeigen();
}
function memZeigen() { const sh = aktuellesSheet(); if (sh && sh.dataset.id === "memory") sheetInhalt(memInhalt()); }

/* ============================================================
   Halte-Hinweise (BRIEF 8): in den ersten Wochen gelegentlich, bis Rita es einmal benutzt hat
   ============================================================ */
const HALTE_TAGE = [1, 2, 3, 5, 7, 10, 13, 17, 21, 26, 30];
function halteHeute() {
  if (!S.onboard || !S.halte || !S.start) return null;
  const d = Math.round((tagDatum(heute()) - tagDatum(S.start)) / 864e5); if (!HALTE_TAGE.includes(d)) return null;
  const offen = ["huhn", "rita", "lupe"].filter(k => !S.halte[k]); return offen.length ? offen[d % offen.length] : null;
}
const FINGER = `<svg viewBox="0 0 32 40" aria-hidden="true"><circle class="hf-ring" cx="12" cy="9" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9.5a2 2 0 0 1 4 0v9.2l1.2-.2a2 2 0 0 1 2.3 1.4l.1-.1a2 2 0 0 1 2.9 1.2 2 2 0 0 1 2.9 1.4l.6 5.6c.4 3.6-2 7-5.6 7.6l-2.4.3c-2.4.3-4.8-.7-6.1-2.7l-4.8-7.3a1.9 1.9 0 0 1 2.8-2.5l2.1 1.8V9.5Z" fill="#FBF8F1" stroke="#1C2620" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
function halteDekorieren() {
  $$(".halte-finger").forEach(x => x.remove());
  const art = halteHeute(); if (!art || SHEETS.length) return;
  const setz = (el, k) => { if (!el || el.querySelector(".halte-finger")) return; const f = document.createElement("span"); f.className = "halte-finger hf-" + k; f.innerHTML = FINGER; el.appendChild(f); };
  if (art === "rita") setz(document.getElementById("logo"), "rita");
  if (art === "huhn") { const k = document.querySelector(".huhn-karte[data-act=huhn-tap]") || document.querySelector(".huhn-karte"); if (k) { setz(k.querySelector(".huhn") ? k : null, "huhn"); if (S.huhn && (!S.huhnSagt || S.huhnSagt.tag !== heute() || !/Finger/.test(S.huhnSagt.text || "")) && k.dataset.act === "huhn-tap" && !(S.huhnSagt && S.huhnSagt.tag === heute() && S.huhnSagt.halte)) { S.huhnSagt = { tag: heute(), text: "Halt mal deinen Finger auf mich. Nicht tippen – halten. Ich zeig dir was.", halte: true }; speichern(); const b = k.querySelector(".sprechblase"); if (b) b.innerHTML = `<span class="wer">Hühnchen</span>${esc(S.huhnSagt.text)}`; } } }
  if (art === "lupe") setz(document.getElementById("buehne-gross"), "lupe");
}
function halteGemerkt(k) { if (S.halte && !S.halte[k]) { S.halte[k] = heute(); speichern(); $$(".halte-finger.hf-" + k).forEach(x => x.remove()); } }
{ let tR = 0, tH = 0;
  document.addEventListener("pointerdown", ev => {
    if (ev.target.closest && ev.target.closest("#logo")) { clearTimeout(tR); tR = setTimeout(() => halteGemerkt("rita"), 420); }
    if (ev.target.closest && ev.target.closest(".huhn-karte")) { clearTimeout(tH); tH = setTimeout(() => halteGemerkt("huhn"), 440); }
  });
  const weg = () => { clearTimeout(tR); clearTimeout(tH); };
  document.addEventListener("pointerup", weg); document.addEventListener("pointercancel", weg);
}

/* ============================================================
   Einstieg: Max-Zettel beim ersten Besuch in „Zuhause“ (50 Taler + Schleife)
   ============================================================ */
function skinsEinstieg() {
  if (!S.onboard || !S.skins || S.skins.intro || SHEETS.length || TAB !== "lichtung" || heute() === S.start) return; // nicht am Einrichtungstag: eine Neuigkeit nach der anderen
  S.skins.intro = heute(); S.taler += 50; S.skins.besitz["h-schleife"] = heute(); S.skins.geschenkt["h-schleife"] = heute(); if (!S.skins.huhn) S.skins.huhn = "h-schleife";
  const erst = S.skins.erstattet && !S.skins.erstattetGemeldet; if (erst) S.skins.erstattetGemeldet = true;
  speichern(); skRender();
  sheet({ titel: "Neu: der Kleiderschrank", id: "schrank-neu", inhalt: `${maxZettel(`<p>Liebe ${esc(S.name || "Rita")},</p><p>für deine Taler gibt’s jetzt Hüte, Brillen und Kostüme – für dich und für Hühnchen. Anprobieren kostet nichts. Und im Bild funkelt’s manchmal: Tipp drauf, dann passiert was.</p><p style="margin:0">50 Taler Startgeld hab ich dir schon hingelegt. Hühnchen hat sich die Schleife geschnappt.${erst ? ` Ein paar Sachen hab ich aus dem Laden genommen – deine ${S.skins.erstattet} Taler dafür sind wieder bei dir.` : ""}</p>`)}<div class="ks-buehne klein-buehne" aria-hidden="true">${ritaSVG(90)}${huhnSVG({ gr: 96, stimmung: "freut" })}</div>`,
    fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="sk-schrank">${ic("buegel")} Kleiderschrank ansehen</button><button class="knopf leise" data-act="sheet-zu">Später</button></div>` });
}
function erstattungMelden() {
  if (!S.skins || !S.skins.erstattet || S.skins.erstattetGemeldet || !S.skins.intro) return;
  S.skins.erstattetGemeldet = true; speichern(); setTimeout(() => toast(`Max hat den Laden umgeräumt. ${S.skins.erstattet} Taler sind wieder bei dir.`), 900);
}

/* ============================================================
   Einhängen: Zuhause-Zusatz, Klicks, Beobachter
   ============================================================ */
function zuhauseZusatz() {
  let h = `<section class="abschnitt bild-unter">${typeof bildSpielZeile === "function" ? bildSpielZeile() : ""}${bildWetterKnopf()}</section>`;
  h += zweiTueren();
  if ((S.gekauft || {}).memory) h += `<section class="abschnitt"><div class="liste">${zeileBtn("karten", "Figuren-Memory", "Paare finden, ohne Zeitdruck", `data-act="sk-memory"`, "k-geist")}</div></section>`;
  return h;
}
/* Abteilungs-Chips: Ziel selbst ausrechnen und scrollTop am Blatt setzen (iOS scrollt mit scrollIntoView/smooth im Blatt nicht zuverlässig) */
function skAbtScroll(v) {
  const z = document.getElementById("abt-" + v); if (!z) return;
  const sc = z.closest(".sheet-inhalt") || z.closest(".sheet"); if (!sc) { z.scrollIntoView(); return; }
  const ch = sc.querySelector(".laden-chips-rahmen"), klebt = ch && getComputedStyle(ch).position === "sticky";
  const ziel = Math.max(0, Math.min(sc.scrollHeight - sc.clientHeight, sc.scrollTop + z.getBoundingClientRect().top - sc.getBoundingClientRect().top - (klebt ? ch.offsetHeight : 0) - 10));
  haptik("auswahl");
  if (REDUCED()) { sc.scrollTop = ziel; return; }
  const von = sc.scrollTop, t0 = performance.now(), ms = 380;
  const f = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); sc.scrollTop = von + (ziel - von) * e; if (k < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
/* Münze antippen: dreht sich wie eine echte Münze um die senkrechte Achse, mit kleinem Klimpern */
function muenzKlimpern() {
  if (!S.ton || typeof audio !== "function" || !audio()) return;
  const t0 = AC.currentTime + .01;
  [[2637, 0], [3136, .07], [2349, .16]].forEach(([f, d], i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = "triangle"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0 + d); g.gain.linearRampToValueAtTime(.07 - i * .015, t0 + d + .005); g.gain.exponentialRampToValueAtTime(.0005, t0 + d + .22); o.connect(g).connect(AC.destination); o.start(t0 + d); o.stop(t0 + d + .25); });
}
function muenzeDrehen(m, leise) {
  haptik("auswahl"); if (!leise) muenzKlimpern();
  if (!m || REDUCED()) return;
  m.classList.remove("dreht"); void m.getBoundingClientRect(); m.classList.add("dreht");
  setTimeout(() => m.classList.remove("dreht"), 1000);
}
document.addEventListener("scroll", ev => { const c = ev.target; if (c && c.classList && c.classList.contains("laden-chips")) { const r = c.closest(".laden-chips-rahmen"); if (r) r.classList.toggle("am-ende", c.scrollLeft + c.clientWidth >= c.scrollWidth - 6); } }, true);
function skAktion(a, d, el) {
  switch (a) {
    case "sk-taler": muenzeDrehen(el.querySelector(".muenze"), true); alleSheetsZu(); ladenSheet(); break;
    case "sk-schrank": { const offen = aktuellesSheet(); if (offen && offen.dataset.id === "schrank") break;
      if (offen && offen.dataset.id === "laden") { kleiderschrankSheet(); break; } // aus dem Kramladen: darüberlegen, „Schließen“ führt zurück in den Laden
      if (offen) { alleSheetsZu(); setTimeout(() => kleiderschrankSheet(), 240); } else kleiderschrankSheet(); break; }
    case "sk-fig": KS.fig = d.v; KS.sel = null; ksNeu(d.v); break;
    case "sk-probe": { const s = SKIN_MAP[d.id]; if (!s) break; KS.fig = s.fuer; if (KS.sel === s.id) { KS.sel = null; delete KS.probe[s.fuer]; } else { KS.sel = s.id; KS.probe[s.fuer] = s.id; } haptik("auswahl"); ksNeu(s.fuer); break; }
    case "sk-kaufen": skinKaufen(d.id); break;
    case "sk-rueck": { const t = el.closest(".toast"); if (t) t.remove(); skinRueck(); break; }
    case "sk-an": { const s = SKIN_MAP[d.id]; if (!s || !skinHat(s.id)) break; S.skins[s.fuer] = s.id; delete KS.probe[s.fuer]; speichern(); haptik("erfolg"); figurenAktualisieren(); ksNeu(s.fuer); skRender(); break; }
    case "sk-aus": { const f = d.v; S.skins[f] = null; if (festSkin(f)) S.skins.festAus[f] = heute(); KS.probe[f] = null; speichern(); figurenAktualisieren(); ksNeu(f); skRender(); break; }
    case "sk-alleaus": for (const f of ["rita", "huhn"]) { S.skins[f] = null; if (festSkin(f)) S.skins.festAus[f] = heute(); } KS.probe = {}; KS.sel = null; speichern(); figurenAktualisieren(); ksNeu("huhn"); skRender(); break;
    case "sk-ziel": S.skins.ziel = d.id || null; speichern(); ksNeu(); { const sh = aktuellesSheet(); if (sh && sh.dataset.id === "ware") { const wid = d.id || (el.closest(".sheet") && el.closest(".sheet").dataset.ware); sheetZu(); if (wid) setTimeout(() => wareSheet(wid), 240); } } plaketteMalen(talerStand(), true); if (d.id) toast(`Gemerkt. Der Ring um die Münze oben füllt sich, bis es reicht.`); break;
    case "sk-auto": S.skins.auto = !S.skins.auto; speichern(); figurenAktualisieren(); ksNeu(); skRender(); break;
    case "sk-abt": skAbtScroll(d.v); break;
    case "sk-muenze": muenzeDrehen(el.querySelector(".muenze") || el); break;
    case "sk-wetter": sheet({ titel: "Wetter im Bild", id: "bildwetter", inhalt: bildWetterInhalt() }); break;
    case "sk-wetter-setz": S.bildWetter = SK_WETTER.includes(d.v) ? d.v : "echt"; speichern(); sheetInhalt(bildWetterInhalt()); skRender(); haptik("auswahl"); break;
    case "sk-ware": wareSheet(d.id); break;
    case "sk-ware-letzte": { $$(".toast").forEach(t => t.remove()); if (window._letzteWare) wareSheet(window._letzteWare); break; }
    case "sk-ziel-zeigen": { $$(".toast").forEach(t => t.remove()); const id = S.skins.ziel || S.skins.zielGemeldet, s = SKIN_MAP[id]; if (!id) break; alleSheetsZu();
      setTimeout(() => { if (s) { kleiderschrankSheet(s.fuer); KS.sel = s.id; KS.probe[s.fuer] = s.id; ksNeu(s.fuer); } else wareSheet(id); }, 260); break; }
    case "sk-einloesen": if (typeof halleEinloesen === "function") halleEinloesen(d.id); break;
    case "sk-ruecken": if (typeof rueckenSetzen === "function") rueckenSetzen(d.v || ""); break;
    case "sk-memory": alleSheetsZu(); memorySheet(); break;
    case "sk-mem": memKarte(Number(d.i)); break;
    case "sk-mem-neu": memNeu(Number(d.v)); memZeigen(); break;
  }
}
document.addEventListener("click", ev => {
  const el = ev.target.closest && ev.target.closest("[data-act^='sk-']"); if (!el || el.disabled) return;
  try { skAktion(el.dataset.act, el.dataset, el); } catch (e) { console.warn(e); }
});
/* Nach jedem Rendern: Plakette, Logo, Hinweise, Einstieg */
function skinsDekorieren() {
  try {
    geschenkePruefen(); plaketteEl(); if (PLAK.n == null) { PLAK.n = talerStand(); } plaketteMalen(PLAK.n); plakettePlatzieren();
    figurenAktualisieren(); halteDekorieren(); erstattungMelden();
    if (TAB === "lichtung") setTimeout(skinsEinstieg, 700);
  } catch (e) { console.warn(e); }
}
(function skinsBeobachten() {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") return;
  let raf = 0;
  const los = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(skinsDekorieren); };
  const start = () => {
    const m = document.getElementById("main"), e = document.getElementById("ebene");
    if (m) new MutationObserver(los).observe(m, { childList: true });
    if (e) new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { figurenAktualisieren(); if (SHEETS.length) $$(".halte-finger").forEach(x => x.remove()); else halteDekorieren(); }); }).observe(e, { childList: true });
    los(); // das erste Rendern passiert schon vor DOMContentLoaded
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
