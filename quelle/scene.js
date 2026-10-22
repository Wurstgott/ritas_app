/* ============================================================
   Lichtung – das Bild (Canvas 2D)
   Tunnelbuch: sechs Papierebenen hintereinander, von hinten beleuchtet.
   Alles deterministisch aus den Einträgen. Nichts verschwindet.
   Virtuelle Fläche 1000 × 920.
   ============================================================ */
const VW = 1000, VH = 920, TAU = Math.PI * 2;
const HORIZONT = 470;

/* ---------- Farbe ---------- */
function hex2rgb(h) { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgb2hex([r, g, b]) { return "#" + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join(""); }
function mix(a, b, k) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * k)); }
function mul(a, b) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v * B[i] / 255)); }

/* ---------- Sonne & Mond (NOAA-Näherung, Spandau 52.55 N, 13.17 E) ---------- */
function sonne(d) {
  const lat = 52.55 * Math.PI / 180, lon = 13.17;
  const start = new Date(d.getFullYear(), 0, 0); const doy = Math.floor((d - start) / 864e5);
  const stunde = d.getUTCHours() + d.getUTCMinutes() / 60;
  const g = TAU / 365 * (doy - 1 + (stunde - 12) / 24);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const tst = stunde * 60 + eqt + 4 * lon; const ha = (tst / 4 - 180) * Math.PI / 180;
  const cz = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha);
  const zen = Math.acos(clamp(cz, -1, 1)); const alt = 90 - zen * 180 / Math.PI;
  let az = Math.acos(clamp((Math.sin(lat) * Math.cos(zen) - Math.sin(decl)) / (Math.cos(lat) * Math.sin(zen)), -1, 1)) * 180 / Math.PI;
  az = ha > 0 ? (az + 180) % 360 : (540 - az) % 360;
  return { alt, az };
}
function mondPhase(d) { const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14); return (((d - ref) / 864e5) % syn + syn) % syn / syn; }

/* ---------- Jahreszeit ---------- */
function jahreszeit(d) { const m = d.getMonth(); return m < 2 || m === 11 ? "winter" : m < 5 ? "fruehling" : m < 8 ? "sommer" : "herbst"; }
function schneeTag(d) { const m = d.getMonth(); if (!(m === 0 || m === 1 || (m === 11 && d.getDate() > 20))) return false; return (hash32("schnee" + tagVon(d)) % 100) < 38; }
const SAISON = {
  fruehling: { laub: ["#7FA862", "#93B874", "#6E9A57"], wiese: "#B5CB8A", wiese2: "#A3BE79", farn: "#5D8A4E", blume: ["#F4F0E2", "#E9D36A", "#C7B6E6"] },
  sommer: { laub: ["#567F49", "#638D53", "#4B7140"], wiese: "#A7BF7A", wiese2: "#97B26C", farn: "#4E7742", blume: ["#F4F0E2", "#D9603C", "#7D6BB8"] },
  herbst: { laub: ["#C98A3E", "#A55A2E", "#D4A445"], wiese: "#BDB27E", wiese2: "#ACA06B", farn: "#9A7A3A", blume: ["#B5532F", "#7D5BA6", "#E2C26B"] },
  winter: { laub: null, wiese: "#CFCCB9", wiese2: "#C2BFAA", farn: "#6E7C62", blume: ["#B83A2E", "#F4F0E2", "#6E8BA8"] }
};

/* ---------- Szene-Zustand ---------- */
const SZ = { canvas: null, ctx: null, dpr: 1, w: 0, h: 0, neu: null, animStart: 0, regionen: [], anker: {}, grain: null, grainCv: null, raf: 0 };

function grainPattern(ctx) {
  if (SZ.grain) return SZ.grain;
  const c = document.createElement("canvas"); c.width = c.height = 160; const g = c.getContext("2d");
  const r = mulberry32(4711), img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - .5) * 60; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  g.globalAlpha = .1; g.strokeStyle = "#4a3a20"; g.lineWidth = .8;
  for (let k = 0; k < 160; k++) { const x = r() * 160, y = r() * 160, a = r() * Math.PI, l = 5 + r() * 14; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l / 2 + r() * 3, y + Math.sin(a) * l / 2 + r() * 3, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  SZ.grainCv = c; SZ.grain = ctx.createPattern(c, "repeat");
  return SZ.grain;
}

/* ---------- Papier-Werkzeuge ---------- */
let LICHT = { sx: 1, sy: 1, nacht: 0, gold: 0, tint: "#FFFFFF" };
function papier(ctx, p, farbe, tiefe = 3, opt = {}) {
  const f = LICHT.nacht > 0 ? mix(farbe, mul(farbe, "#7084B4"), LICHT.nacht * .6) : farbe;
  if (tiefe > 0) {
    ctx.save(); ctx.translate(LICHT.sx * tiefe, LICHT.sy * tiefe);
    ctx.fillStyle = `rgba(20,28,24,${opt.schatten ?? .26})`; ctx.fill(p); ctx.restore();
  }
  if (opt.saum && LICHT.gold > .05) { // Gegenlicht-Saum: dieselbe Form leicht zur Sonne versetzt, hell
    ctx.save(); ctx.translate(-LICHT.sx * 1.8, -1.8);
    ctx.fillStyle = `rgba(255,212,140,${.85 * LICHT.gold})`; ctx.fill(p); ctx.restore();
  }
  ctx.fillStyle = f; ctx.fill(p);
}
/* unregelmäßig geschnittene Fläche (Schere statt Zirkel) */
function fetzen(p, cx, cy, rx, ry, r, n = 13, rot = 0) {
  for (let i = 0; i <= n; i++) {
    const a = i / n * TAU, k = .82 + r() * .3, x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k;
    const xx = x * Math.cos(rot) - 0, yy = y;
    i ? p.lineTo(xx, yy) : p.moveTo(xx, yy);
  }
  p.closePath();
}
function kreis(p, x, y, r) { p.moveTo(x + r, y); p.arc(x, y, r, 0, TAU); }
function ellipse(p, x, y, rx, ry, rot = 0) { p.moveTo(x + rx * Math.cos(rot), y + rx * Math.sin(rot)); p.ellipse(x, y, rx, ry, rot, 0, TAU); }
function poly(p, pts, r, amp = 1.2) {
  pts.forEach(([x, y], i) => { const jx = r ? (r() - .5) * 2 * amp : 0, jy = r ? (r() - .5) * 2 * amp : 0; i ? p.lineTo(x + jx, y + jy) : p.moveTo(x + jx, y + jy); });
  p.closePath();
}
function rr(p, x, y, w, h, r = 3) { p.roundRect ? p.roundRect(x, y, w, h, r) : p.rect(x, y, w, h); }

/* Kiefer, wie im Spandauer Forst: hoher Stamm, Krone oben aus Büscheln */
function kiefer(ctx, x, y, h, r, farbeKrone, farbeStamm, tiefe) {
  const stamm = new Path2D(), sb = h * .045;
  poly(stamm, [[x - sb, y], [x - sb * .55, y - h * .78], [x + sb * .55, y - h * .78], [x + sb, y]], r, .6);
  // ein, zwei Seitenäste
  const a1 = y - h * (.55 + r() * .15), dir = r() < .5 ? -1 : 1;
  poly(stamm, [[x, a1], [x + dir * h * .16, a1 - h * .08], [x + dir * h * .16, a1 - h * .065], [x, a1 + h * .02]], null);
  papier(ctx, stamm, farbeStamm, tiefe * .7, { saum: true });
  const krone = new Path2D(), n = 4 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const bx = x + (r() - .5) * h * .36, by = y - h * (.74 + r() * .22), rx = h * (.08 + r() * .07), ry = rx * (.38 + r() * .14);
    fetzen(krone, bx, by, rx, ry, r, 15);
  }
  fetzen(krone, x + dir * h * .17, a1 - h * .085, h * .075, h * .03, r, 11);
  papier(ctx, krone, farbeKrone, tiefe, { saum: true });
}
/* Laubbaum-Krone aus Kreisen (gleiche Farbe → eine Fläche) */
function krone(ctx, cx, cy, rad, n, r, farbe, tiefe) {
  const p = new Path2D();
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, d = Math.sqrt(r()) * rad * .62, cr = rad * (.32 + r() * .22);
    fetzen(p, cx + Math.cos(a) * d * 1.25, cy + Math.sin(a) * d * .8, cr, cr * .92, r, 14);
  }
  papier(ctx, p, farbe, tiefe, { saum: true });
}
function aeste(ctx, x, y, h, r, farbe, tiefe) { // kahle Äste im Winter, als feiner Scherenschnitt
  const p = new Path2D();
  const ast = (x0, y0, len, ang, dicke, stufe) => {
    const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len, nx = Math.cos(ang + Math.PI / 2) * dicke, ny = Math.sin(ang + Math.PI / 2) * dicke;
    poly(p, [[x0 + nx, y0 + ny], [x1 + nx * .4, y1 + ny * .4], [x1 - nx * .4, y1 - ny * .4], [x0 - nx, y0 - ny]], null);
    if (stufe < 3) for (let i = 0; i < 2; i++) ast(x1, y1, len * (.55 + r() * .2), ang + (i ? .45 : -.5) + (r() - .5) * .3, dicke * .55, stufe + 1);
  };
  ast(x, y, h * .3, -Math.PI / 2 - .5, h * .02, 1); ast(x, y, h * .32, -Math.PI / 2 + .45, h * .02, 1); ast(x, y, h * .26, -Math.PI / 2, h * .018, 1);
  papier(ctx, p, farbe, tiefe * .6);
}

/* ---------- Horizont-Silhouetten (Ausflüge) ---------- */
function silhouette(p, form, x, y, s) {
  const P = pts => poly(p, pts.map(([a, b]) => [x + a * s, y - b * s]), null);
  switch (form) {
    case "binger": // Berliner Altbau mit Erkern
      P([[-26, 0], [-26, 46], [-20, 50], [-20, 56], [-8, 56], [-8, 50], [8, 50], [8, 58], [18, 58], [18, 50], [26, 46], [26, 0]]); break;
    case "zitadelle": P([[-34, 0], [-34, 20], [-28, 20], [-28, 26], [-22, 26], [-22, 20], [-6, 20], [-6, 52], [-8, 52], [-8, 56], [4, 56], [4, 52], [2, 52], [2, 20], [34, 20], [34, 0]]); break;
    case "kirche": P([[-16, 0], [-16, 22], [-6, 22], [-6, 40], [0, 66], [6, 40], [6, 22], [22, 22], [22, 0]]); break;
    case "wasserturm": P([[-8, 0], [-6, 34], [-14, 36], [-14, 50], [-10, 54], [0, 60], [10, 54], [14, 50], [14, 36], [6, 34], [8, 0]]); break;
    case "funkturm": P([[-12, 0], [-2, 52], [-6, 52], [-6, 56], [-1, 56], [-1, 72], [1, 72], [1, 56], [6, 56], [6, 52], [2, 52], [12, 0]]); break;
    case "schiff": P([[-30, 6], [-26, 0], [26, 0], [32, 8], [14, 8], [14, 16], [6, 16], [6, 26], [2, 26], [2, 16], [-18, 16], [-18, 8]]); break;
    case "muehle": P([[-10, 0], [-7, 30], [-12, 32], [0, 42], [12, 32], [7, 30], [10, 0]]); P([[-1, 36], [-22, 58], [-19, 60], [1, 39]]); P([[1, 36], [22, 58], [19, 60], [-1, 39]]); P([[-1, 39], [-22, 16], [-19, 14], [1, 36]]); P([[1, 39], [22, 16], [19, 14], [-1, 36]]); break;
    case "bruecke": P([[-40, 0], [-40, 14], [40, 14], [40, 0], [30, 0], [26, 8], [14, 8], [10, 0], [-10, 0], [-14, 8], [-26, 8], [-30, 0]]); break;
    case "schloss": P([[-34, 0], [-34, 24], [-26, 24], [-26, 34], [-20, 40], [-14, 34], [-14, 24], [14, 24], [14, 34], [20, 40], [26, 34], [26, 24], [34, 24], [34, 0]]); kreis(p, x, y - 30 * s, 8 * s); break;
    case "kiefersee": P([[-36, 0], [36, 0], [36, 3], [-36, 3]]); P([[-2, 3], [-1, 42], [1, 42], [2, 3]]); ellipse(p, x - 4 * s, y - 44 * s, 14 * s, 7 * s); ellipse(p, x + 6 * s, y - 50 * s, 11 * s, 6 * s); break;
    case "leuchtturm": P([[-9, 0], [-5, 50], [-8, 50], [-8, 56], [-4, 56], [-4, 62], [0, 66], [4, 62], [4, 56], [8, 56], [8, 50], [5, 50], [9, 0]]); break;
    case "schwedenhaus": P([[-22, 0], [-22, 24], [0, 40], [22, 24], [22, 0]]); P([[10, 30], [10, 40], [15, 40], [15, 26]]); break;
    default: // Hügel
      P([[-40, 0], [-30, 10], [-16, 22], [0, 28], [16, 22], [30, 10], [40, 0]]);
  }
}

/* ---------- Geometrie: Blick von der Stadtrandstraße die Zufahrt entlang ----------
   Fluchtpunkt (FP, HORIZONT). Die Zufahrt endet unten zwischen x 40 und 330 und läuft auf den Parkplatz
   im Innenwinkel des L zu: Hauptgebäude quer hinten, Seitenflügel rechts zum Betrachter hin. */
const FP = 500;
const STR = { l: 40, r: 330 };
function strasseL(y) { return STR.l + (FP - STR.l) * (VH - y) / (VH - HORIZONT); }
function strasseR(y) { return STR.r + (FP - STR.r) * (VH - y) / (VH - HORIZONT); }
const HAUS = { l: 260, r: 700, y: 622, h: 165 };
const PARK = { hinten: 644, vorn: 730 };
/* Seitenflügel: f 0 = am Hauptbau, 1 = vorn; hh 0 = Boden, 1 = Dachkante. Liefert [x, y, Maßstab]. */
function fluegel(f, hh) {
  const k0 = HAUS.y - HORIZONT, k1 = 250, k = 1 / (1 / k0 + f * (1 / k1 - 1 / k0)), s = k / k0;
  const x = FP + (HAUS.r - FP) * s, yb = HORIZONT + k, yt = HORIZONT - (HORIZONT - (HAUS.y - HAUS.h)) * s;
  return [x, yb + (yt - yb) * hh, s];
}
function fluegelX(y) { return FP + (HAUS.r - FP) * (y - HORIZONT) / (HAUS.y - HORIZONT); }
/* Waldweg rechts: u 0 = vorn unten, 1 = hinter der großen Kiefer am Waldrand. [x, y, halbe Breite] */
function wegPunkt(u) { return [800 + u * 165 - Math.sin(u * Math.PI) * 18, VH + 10 - u * 200, 64 * (1 - u * .7)]; }
const QUELLE = [700, 768], WEIHER = [560, 848];
const HUHN_NACHT = [742, 694]; // nachts sitzt Hühnchen vor dem Hauseingang an der Innenseite des Flügels

/* ---------- Hauptzeichnung ---------- */
function zeichneSzene(canvas, opt = {}) {
  const ctx = canvas.getContext("2d");
  const cw = canvas.clientWidth, ch = canvas.clientHeight;
  if (!cw || !ch) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) { canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); }
  const sk = Math.max(cw / VW, ch / VH);
  const ox = (cw - VW * sk) / 2, oy = (ch - VH * sk) * .72;
  ctx.setTransform(dpr * sk, 0, 0, dpr * sk, dpr * ox, dpr * oy);
  ctx.clearRect(-ox / sk, -oy / sk, cw / sk, ch / sk);

  const M = opt.modell || modell();
  const st = M.stufe;
  const d = opt.datum || jetzt();
  const saison = jahreszeit(d), SA = SAISON[saison], schnee = schneeTag(d);
  const so = sonne(d);
  const R = key => rnd("bild:" + key);
  const t = opt.anim ?? 1;                  // Ankunfts-Animation (0..1) für M.neu
  const neu = opt.neu || null;
  const wachs = (key) => (neu && neu === key) ? (0.4 + 0.6 * easeOut(t)) : 1;
  SZ.regionen = []; SZ.anker = {}; SZ.SA = SA; SZ.mondDa = 0;

  // Licht
  const alt = so.alt;
  const nacht = clamp((-alt - 2) / 8, 0, 1) * (opt.immerTag ? 0 : 1);
  const gold = clamp(1 - Math.abs(alt - 4) / 10, 0, 1) * (1 - nacht);
  const sunX = clamp(500 + (so.az - 180) / 100 * 470, 40, 960);
  LICHT = { sx: sunX < 500 ? .9 : -.9, sy: 1, nacht, gold };

  // ===== E0 Himmel =====
  const tag = ["#A8C6D6", "#E9E4D0"], goldS = ["#86A3C2", "#F2C88E"], nachtS = ["#2F4A74", "#647DAA"];
  let oben = mix(tag[0], goldS[0], gold), unten = mix(tag[1], goldS[1], gold);
  oben = mix(oben, nachtS[0], nacht); unten = mix(unten, nachtS[1], nacht);
  if (saison === "winter") { oben = mix(oben, "#B9C4CC", .25 * (1 - nacht)); unten = mix(unten, "#E6E6E0", .3 * (1 - nacht)); }
  const gr = ctx.createLinearGradient(0, 0, 0, HORIZONT + 60); gr.addColorStop(0, oben); gr.addColorStop(1, unten);
  ctx.fillStyle = gr; ctx.fillRect(-ox / sk - 2, -oy / sk - 2, cw / sk + 4, ch / sk + 4);
  // Sterne als Nadelstiche
  if (nacht > .2) {
    const r = R("sterne"); ctx.fillStyle = `rgba(255,246,220,${.8 * nacht})`;
    for (let i = 0; i < 70; i++) { const x = r() * VW, y = r() * (HORIZONT - 60); ctx.beginPath(); ctx.arc(x, y, .9 + r() * 1.3, 0, TAU); ctx.fill(); }
    if (S.gekauft.sternbilder) sternbilder(ctx, nacht);
  }
  // Sonne / Mond als Papierscheiben
  if (alt > -4) {
    const sy = HORIZONT - 30 - clamp(alt, -4, 62) / 62 * 380;
    const p = new Path2D(); kreis(p, sunX, sy, 34);
    ctx.save(); ctx.globalAlpha = .35 + .4 * gold; ctx.fillStyle = gold > .3 ? "#F6D9A0" : "#FFF6DC"; ctx.beginPath(); ctx.arc(sunX, sy, 52, 0, TAU); ctx.fill(); ctx.restore();
    papier(ctx, p, gold > .3 ? "#F2B65E" : "#FBEFC8", 0);
  } else {
    const ph = mondPhase(d), mx = 780, my = 120, mr = 26; SZ.mondDa = Math.abs(ph - .5) < .47 ? 1 : 0;
    const p = new Path2D(); kreis(p, mx, my, mr);
    ctx.fillStyle = "#F4EDD6"; ctx.fill(p);
    // Phasen-Schatten
    const off = (ph < .5 ? 1 : -1) * (1 - Math.abs(ph - .5) * 2) * mr * 2;
    ctx.save(); ctx.clip(p); ctx.fillStyle = mix(oben, "#000000", .1); ctx.beginPath(); ctx.arc(mx + (ph < .5 ? -off : -off), my, mr, 0, TAU);
    if (Math.abs(ph - .5) > .03) ctx.fill(); ctx.restore();
  }
  // Wolken (Papierstreifen), wenige
  { const r = R("wolken" + tagVon(d)); const n = 2 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) { const p = new Path2D(), x = r() * VW, y = 60 + r() * 200, w = 80 + r() * 120;
      for (let k = 0; k < 4; k++) ellipse(p, x + (k - 1.5) * w * .28, y - (k === 1 || k === 2 ? 12 : 0), w * .26, 16 + r() * 8);
      papier(ctx, p, mix(unten, "#FFFFFF", .55 - nacht * .4), 2, { schatten: .08 }); } }

  // ===== E1 Horizont: Land und Ausflugs-Silhouetten =====
  { const r = R("land"), p = new Path2D(); p.moveTo(-60, HORIZONT + 10);
    for (let x = -60; x <= VW + 60; x += 40) p.lineTo(x, HORIZONT - 8 - Math.sin(x / 140 + 1) * 10 - r() * 6);
    p.lineTo(VW + 60, VH); p.lineTo(-60, VH); p.closePath();
    papier(ctx, p, mix("#9DAF8E", unten, .45), 0); }
  const sichtbar = st >= 7 ? 1 : st >= 3 ? .65 : .45;
  M.ausfluege.slice(0, 24).forEach((a, i) => {
    const x = 80 + ((i * 0.618034 + .13) % 1) * 840, s = .8 + (hash32(a.ziel) % 30) / 100 + (a.mal ? Math.min(a.mal, 6) * .04 : 0);
    const p = new Path2D(); const g = wachs("horizont:" + a.ziel);
    silhouette(p, a.form, x, HORIZONT - 4, s * g * 1.45);
    papier(ctx, p, mix(a.form === "schwedenhaus" ? "#9A3A2A" : a.form === "binger" ? "#8A6A58" : "#6E6660", unten, .3 + (1 - sichtbar) * .2), 2, { saum: true, schatten: .12 });
    if ((a.form === "binger" || a.form === "schwedenhaus") && nacht > .3) { ctx.fillStyle = "#F2C36B"; ctx.fillRect(x - 6, HORIZONT - 4 - 28 * s, 4, 5); ctx.fillRect(x + 3, HORIZONT - 4 - 28 * s, 4, 5); }
    SZ.regionen.push({ ort: "horizont", x: x - 40, y: HORIZONT - 80, w: 80, h: 80, a });
  });

  // ===== E2 Fernwald: Kiefernreihe mit Schneise =====
  { const r = R("fernwald"); const luecke = [0, 40, 70, 160, 190, 210, 230, 360][Math.min(st, 7)] + (st > 7 ? 60 : 0);
    const kroneF = mix("#3E5E46", unten, .42), stammF = mix("#6B4A3A", unten, .45);
    for (let x = -30; x < VW + 40; x += 20 + r() * 14) {
      const mitte = Math.abs(x - 520); const h = 115 + r() * 55 - (mitte < luecke ? 120 : 0) - Math.min(st, 4) * 8;
      if (h < 80) continue;
      kiefer(ctx, x, HORIZONT + 70, h, r, kroneF, stammF, 2);
    } }

  // ===== E3 Lichtung: Boden =====
  const bodenY = 560;
  { const p = new Path2D(); const r = R("boden");
    p.moveTo(-60, bodenY); for (let x = -60; x <= VW + 60; x += 50) p.lineTo(x, bodenY - 12 + Math.sin(x / 90) * 8 + r() * 6);
    p.lineTo(VW + 60, VH + 20); p.lineTo(-60, VH + 20); p.closePath();
    papier(ctx, p, schnee ? "#ECEBE4" : SA.wiese, 4, { saum: true });
    const p2 = new Path2D(); p2.moveTo(-60, 720);
    for (let x = -60; x <= VW + 60; x += 60) p2.lineTo(x, 715 + Math.sin(x / 70 + 2) * 10 + r() * 6);
    p2.lineTo(VW + 60, VH + 20); p2.lineTo(-60, VH + 20); p2.closePath();
    papier(ctx, p2, schnee ? "#F2F1EB" : SA.wiese2, 3); }
  // Sonnenkeil (ab „Licht fällt ein“)
  if (st >= 3 && nacht < .5 && alt > 0) {
    ctx.save(); ctx.globalAlpha = .18 * (1 - nacht); ctx.fillStyle = "#FFF4D6"; ctx.beginPath();
    ctx.moveTo(sunX - 20, HORIZONT - 40); ctx.lineTo(sunX + 30, HORIZONT - 40); ctx.lineTo(560, 860); ctx.lineTo(330, 860); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  // ===== Waldsaum ringsum: mittlere Kiefern links, rechts und hinter dem Seitenflügel (bleibt dicht) =====
  { const r = R("waldsaum"), kF = mix("#3A5A41", unten, .2), sF = mix("#5E4334", unten, .22);
    const kF2 = mix("#3E5E46", unten, .34), sF2 = mix("#6B4A3A", unten, .36);
    for (const [x, y, h] of [[300, 566, 230], [372, 562, 214], [446, 560, 236], [596, 562, 220], [668, 566, 240], [96, 590, 250], [190, 586, 232]])
      kiefer(ctx, x, y, h * (.92 + r() * .16), r, kF2, sF2, 2);
    for (const [x, y, h] of [[-34, 646, 360], [44, 626, 300], [140, 610, 262], [226, 602, 236], [742, 594, 300], [800, 598, 330], [858, 602, 312], [918, 610, 344], [968, 640, 330], [1016, 652, 370]])
      kiefer(ctx, x, y, h * (.92 + r() * .16), r, kF, sF, 3);
    // Unterholz am Waldsaum: junge Kiefern und Büsche
    for (const [x, y, h] of [[18, 648, 120], [70, 636, 104], [196, 628, 96], [950, 664, 118]]) kiefer(ctx, x, y, h, r, mix(kF, "#2F4A36", .3), sF, 2);
    const uh = new Path2D(); for (let x = -30; x < 262; x += 22) fetzen(uh, x, 628 + Math.sin(x / 40) * 6 + r() * 6, 16 + r() * 8, 11 + r() * 5, r, 11);
    for (let x = 930; x < 1030; x += 22) fetzen(uh, x, 690 + r() * 10, 16 + r() * 8, 12 + r() * 5, r, 11);
    papier(ctx, uh, schnee ? "#DCDDD6" : mix("#41603F", unten, .12), 2, { saum: true });
    // Vogelnest auf einem Ast der Kiefer hinter dem Seitenflügel
    const ast = new Path2D(); poly(ast, [[920, 428], [878, 420], [878, 424], [920, 434]], null); papier(ctx, ast, sF, 1);
    const nest = new Path2D(); ellipse(nest, 886, 417, 10, 5); papier(ctx, nest, "#7A5A3A", 1);
    if (nacht < .3 && saison !== "winter") { ctx.fillStyle = "#6A5A48"; for (const k of [-4, 1, 6]) { ctx.beginPath(); ctx.arc(886 + k, 411, 2.2, 0, TAU); ctx.fill(); } }
    SZ.anker.nest = [886, 416];
  }

  // ===== Hochsitz (Stufe 8): am linken Waldsaum =====
  if (st >= 8) { const p = new Path2D(), x = 236, y = 620, g = wachs("stufe:8") * .48;
    ctx.save(); ctx.translate(x, y); ctx.scale(g, g); ctx.translate(-x, -y);
    poly(p, [[x - 26, y], [x - 20, y - 120], [x - 16, y - 120], [x - 20, y]], null); poly(p, [[x + 26, y], [x + 20, y - 120], [x + 16, y - 120], [x + 22, y]], null);
    poly(p, [[x - 30, y - 118], [x + 30, y - 118], [x + 30, y - 150], [x - 30, y - 150]], null);
    poly(p, [[x - 36, y - 150], [x, y - 172], [x + 36, y - 150]], null);
    for (let k = 1; k < 5; k++) poly(p, [[x - 22, y - k * 24], [x + 22, y - k * 24], [x + 22, y - k * 24 - 4], [x - 22, y - k * 24 - 4]], null);
    papier(ctx, p, "#7B5A3E", 3, { saum: true }); ctx.restore();
    SZ.regionen.push({ ort: "hochsitz", x: 214, y: 532, w: 44, h: 92 }); }

  // ===== Birken (Stufe 9): zwischen Eiche und Hochsitz =====
  if (st >= 9) { const r = R("birken"), g = wachs("stufe:9");
    for (let i = 0; i < 3; i++) { const x = 170 + i * 22, y = 640 + i * 5, h = (128 + r() * 26) * g;
      if (SA.laub) krone(ctx, x, y - h * .84, 26, 6, r, mix(SA.laub[1], "#E4DC8A", saison === "herbst" ? .6 : .2), 2);
      const p = new Path2D(); poly(p, [[x - 3.5, y], [x - 2, y - h * .9], [x + 2, y - h * .9], [x + 3.5, y]], r, .3); papier(ctx, p, "#EDEAE0", 2);
      ctx.fillStyle = "#2B2B28"; for (let k = 0; k < 5; k++) ctx.fillRect(x - 3, y - 14 - k * h * .15 - r() * 6, 4 + r() * 2, 2);
      if (!SA.laub) aeste(ctx, x, y - h * .85, h * .8, r, "#5C4B3A", 2); } }

  // ===== Zufahrt von der Stadtrandstraße und Parkplatz im Innenwinkel des L =====
  { const yh = PARK.hinten, yv = PARK.vorn, asphalt = schnee ? "#D9DAD5" : mix("#9C9A92", unten, .12);
    const p = new Path2D();
    p.moveTo(strasseL(yh), yh); p.lineTo(fluegelX(yh) - 3, yh); p.lineTo(fluegelX(yv) - 3, yv); p.lineTo(strasseR(yv), yv);
    p.lineTo(strasseR(VH - 16), VH - 16); p.quadraticCurveTo(strasseR(VH - 4) + 2, VH - 2, STR.r + 24, VH + 6);
    p.lineTo(STR.l - 24, VH + 6); p.quadraticCurveTo(strasseL(VH - 4) - 2, VH - 2, strasseL(VH - 16), VH - 16); p.closePath();
    papier(ctx, p, asphalt, 2, { saum: true });
    // Bordsteinkante an beiden Seiten der Zufahrt
    ctx.save(); ctx.strokeStyle = schnee ? "rgba(255,255,255,.7)" : "rgba(236,232,220,.75)"; ctx.lineCap = "round";
    for (const f of [strasseL, strasseR]) { ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(f(yv - 30), yv - 30); for (let y = yv - 30; y <= VH - 16; y += 10) { ctx.lineWidth = 1 + (y - HORIZONT) / 140; ctx.lineTo(f(y), y); } ctx.stroke(); }
    // Mittelstreifen: Striche werden zum Fluchtpunkt hin kürzer
    ctx.fillStyle = "rgba(255,253,245,.6)";
    for (let k = 0; k < 9; k++) { const ya = HORIZONT + 450 / (1 + k * .32), yb = HORIZONT + 450 / (1 + (k + .5) * .32); if (yb < yh + 50) break;
      const m = y => (strasseL(y) + strasseR(y)) / 2, wa = 1 + (ya - HORIZONT) / 160, wb = 1 + (yb - HORIZONT) / 160;
      const q = new Path2D(); poly(q, [[m(ya) - wa, ya], [m(yb) - wb, yb], [m(yb) + wb, yb], [m(ya) + wa, ya]], null); ctx.fill(q); }
    // Parkbuchten (Linien zum Fluchtpunkt)
    ctx.strokeStyle = "rgba(255,253,245,.55)"; ctx.lineWidth = 1.4;
    for (let k = 0; k < 5; k++) { const x = 488 + k * 48, y1 = 670, y0 = yh + 3; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x + (FP - x) * (y1 - y0) / (y1 - HORIZONT), y0); ctx.stroke(); }
    for (let k = 0; k < 7; k++) { const x = 440 + k * 56, y1 = yv - 2, y0 = 690; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x + (FP - x) * (y1 - y0) / (y1 - HORIZONT), y0); ctx.stroke(); }
    ctx.restore();
    // Bordstein der Stadtrandstraße, an der Einfahrt abgesenkt
    const bord = new Path2D(); poly(bord, [[-60, VH - 9], [STR.l - 24, VH - 9], [STR.l - 18, VH + 6], [-60, VH + 6]], null); poly(bord, [[STR.r + 24, VH - 9], [VW + 60, VH - 9], [VW + 60, VH + 6], [STR.r + 18, VH + 6]], null);
    papier(ctx, bord, schnee ? "#E4E4DE" : "#BDB8AC", 1);
  }

  // ===== Häuser am Waldrand: ein L aus Hauptgebäude (quer) und Seitenflügel (rechts, zum Betrachter) =====
  { const { l: hl, r: hr, y, h: hh } = HAUS, x = (hl + hr) / 2, top = y - hh, sonneLinks = sunX < 500;
    // hinteres Haus: dicht dahinter, ragt mit dem obersten Geschoss über das Dach
    { const p = new Path2D(), bl = hl + 64, br = hr - 70, bt = top - 46;
      poly(p, [[bl, top + 6], [bl, bt], [br, bt], [br, top + 6]], R("hinten"), .4); papier(ctx, p, mix("#D8CDB6", unten, .3), 3, { saum: true });
      const d = new Path2D(); poly(d, [[bl - 5, bt + 4], [bl - 5, bt - 4], [br + 5, bt - 4], [br + 5, bt + 4]], null); papier(ctx, d, mix("#6F6A62", unten, .3), 1);
      for (let k = 0; k < 7; k++) { const fx = bl + 22 + k * ((br - bl - 44) / 6); ctx.fillStyle = nacht > .3 && hash32("hf" + k) % 3 ? "#E9C77A" : mix("#4A5260", unten, .35); ctx.fillRect(fx - 9, bt + 13, 18, 15); } }
    // Hauptgebäude: flach, zwei Geschosse
    const hrr = HAUS.r + 64 + 34; // Hauptbau reicht bis zum zweiten Flügel
    const p = new Path2D(); poly(p, [[hl, y], [hl, top], [hrr, top], [hrr, y]], R("haus"), .5);
    papier(ctx, p, "#D8CDB6", 4, { saum: true });
    ctx.fillStyle = "rgba(90,80,60,.2)"; ctx.fillRect(hl, y - 7, hr - hl, 7); ctx.fillStyle = "rgba(90,80,60,.16)"; ctx.fillRect(hl, y - hh / 2 - 2, hr - hl, 5);
    ctx.fillStyle = nacht > .3 && hash32("zw" + tagVon(d)) % 2 ? "#E9C77A" : mix("#4A5260", unten, .1); ctx.fillRect(hr + 26, y - 140, 34, 30);
    const dach = new Path2D(); poly(dach, [[hl - 9, top + 6], [hl - 9, top - 7], [hrr + 4, top - 7], [hrr + 4, top + 6]], null); papier(ctx, dach, "#6F6A62", 3, { saum: true });
    // Spatzen auf der Dachkante (tagsüber)
    if (nacht < .3) { const sp = new Path2D(); for (const [sx, k] of [[372, 0], [386, 1], [404, 0]]) { ellipse(sp, sx, top - 10, 4.6, 3.4); kreis(sp, sx + (k ? -4 : 4), top - 13, 2.5); } papier(ctx, sp, "#7A6248", 1); }
    SZ.anker.spatzen = [388, top - 8];
    // Mitte unten: Treppenhausfenster (der Eingang liegt am Seitenflügel)
    { const f = new Path2D(); rr(f, x - 14, y - 70, 28, 52, 2); ctx.fillStyle = nacht > .3 ? "#E9C77A" : mix("#4A5260", unten, .1); ctx.fill(f); ctx.fillStyle = "#D8CDB6"; ctx.fillRect(x - 14, y - 45, 28, 2.4); }
    // Fenster: oben 5, unten 4 (Mitte: Treppenhaus)
    const plaetze = [[-176, -124], [-88, -124], [0, -124], [88, -124], [176, -124], [-176, -43], [-88, -43], [88, -43], [176, -43]];
    const RITA = 3; // Ritas Fenster mit Balkon (oben, zweites von rechts)
    const pers = S.menschen.map(m => m.id);
    const zahl = Object.keys(M.menschen); const sortiert = pers.concat(zahl.filter(z => !pers.includes(z) && z !== "_"));
    const frei = plaetze.map((_, i) => i).filter(i => i !== RITA);
    const musikL = Math.min(M.musik + M.tanzStunden, st >= 5 ? 16 : 5);
    plaetze.forEach(([dx, dy], i) => {
      const fw = 40, fh = 32, f = new Path2D(); rr(f, x + dx - fw / 2, y + dy - fh / 2, fw, fh, 2);
      const idx = frei.indexOf(i), id = i === RITA ? "rita" : sortiert[idx];
      const mensch = S.menschen.find(m => m.id === id), g = wachs("fenster:" + id);
      const dabei = i === RITA || !!mensch || (id && M.menschen[id] > 0);
      const lichtF = mix("#F2C36B", mensch ? mensch.farbe : "#F2C36B", .18);
      ctx.fillStyle = dabei ? mix("#3D4450", lichtF, .85 * g) : "#4A5260"; ctx.fill(f);
      if (dabei && (nacht > .3 || gold > .4)) fensterLicht(ctx, x + dx, y + dy, Math.max(nacht, gold * .6) * .8);
      ctx.fillStyle = "#D8CDB6"; ctx.fillRect(x + dx - 1.3, y + dy - fh / 2, 2.6, fh);
      ctx.fillStyle = "rgba(90,80,60,.35)"; ctx.fillRect(x + dx - fw / 2 - 2, y + dy + fh / 2, fw + 4, 2.5);
    });
    // Verkleidete Balkone vor den oberen Fenstern (geschlossene Brüstung aus Platten), manche mit Blumen
    { const platte = mix("#A9B4AE", unten, .08), fuge = "rgba(60,70,66,.28)";
      plaetze.forEach(([dx, dy], i) => { if (dy > -100 || i === RITA || i === 2) return;
        const bx0 = x + dx, b0 = y + dy + 10, pl = new Path2D(); poly(pl, [[bx0 - 30, b0], [bx0 + 30, b0], [bx0 + 30, b0 + 20], [bx0 - 30, b0 + 20]], null);
        const sl = new Path2D(); poly(sl, [[bx0 - 32, b0 + 20], [bx0 + 32, b0 + 20], [bx0 + 32, b0 + 23], [bx0 - 32, b0 + 23]], null);
        if (i === 0 || i === 4 || hash32("balk" + i + tagVon(d).slice(0, 7)) % 2) { const bl = new Path2D(), gr2 = new Path2D(); for (let k = 0; k < 5; k++) { fetzen(gr2, bx0 - 22 + k * 11, b0 - 2, 6, 4, rnd("bk" + i + k), 8); if (SA.laub) kreis(bl, bx0 - 22 + k * 11, b0 - 4, 2.8); } papier(ctx, gr2, "#5F8A4E", 0); papier(ctx, bl, SA.blume[(i + 1) % 3] === "#F4F0E2" ? "#D9603C" : SA.blume[(i + 1) % 3], 0); }
        papier(ctx, pl, platte, 2, { saum: true }); papier(ctx, sl, "#6F6A62", 1);
        ctx.fillStyle = fuge; ctx.fillRect(bx0 - 10.5, b0, 1.2, 20); ctx.fillRect(bx0 + 9.5, b0, 1.2, 20); }); }
    // Ritas Balkon mit Pflänzchen (wachsen mit „Pflanzen versorgt“) – auch verkleidet, aber mit Lichterkette
    const [rdx, rdy] = plaetze[RITA], bx = x + rdx, by = y + rdy + 20;
    // Musik & Tanz wohnen drinnen: warmes Licht in Ritas Fenster, je mehr Tanzstunden, desto wärmer
    if (M.tanzStunden || M.musik) { const k = Math.min(.25 + (M.tanzStunden + M.musik) / 40, .8) * wachs("tanz"); gluehen(ctx, bx, y + rdy, 30 + Math.min(M.tanzStunden, 30), Math.max(k * .55, nacht * k)); }
    ctx.save(); ctx.translate(bx, by); ctx.scale(1.35, 1.35); ctx.translate(-bx, -by);
    { const pfl = Math.min(S.eintraege.filter(e => e.t === "pflanzen").length, 6);
      const topf = new Path2D(), gruen = new Path2D(), bl = new Path2D();
      for (let k = 0; k < 2 + Math.min(pfl, 3); k++) { const tx = bx - 20 + k * 10; rr(topf, tx - 3.5, by - 9, 7, 7, 1); fetzen(gruen, tx, by - 13, 5 + Math.min(pfl, 5) * .6, 5 + Math.min(pfl, 5) * .9, rnd("bal" + k), 9); if (pfl > k && SA.laub) kreis(bl, tx + 1, by - 16, 1.8); }
      papier(ctx, gruen, "#5F8A4E", 0); papier(ctx, bl, SA.blume[1] === "#F4F0E2" ? "#D9603C" : SA.blume[1], 0); papier(ctx, topf, "#A35A3A", 0);
      const bal = new Path2D(); poly(bal, [[bx - 25, by - 8], [bx + 25, by - 8], [bx + 25, by + 6], [bx - 25, by + 6]], null);
      papier(ctx, bal, mix("#B7A48A", unten, .06), 1.5, { saum: true });
      const sl = new Path2D(); poly(sl, [[bx - 26, by + 6], [bx + 26, by + 6], [bx + 26, by + 8], [bx - 26, by + 8]], null); papier(ctx, sl, "#6F6A62", .6);
      ctx.fillStyle = "rgba(60,50,40,.25)"; ctx.fillRect(bx - 8.5, by - 8, .9, 14); ctx.fillRect(bx + 7.6, by - 8, .9, 14); }
    ctx.restore();
    // Lichterkette am Balkon (Musik & Tanz): wächst mit jeder Musik- und Tanzstunde
    if (musikL > 0) {
      const kette = []; // Bogen über dem Fenster, an den Seiten hinunter bis zum Geländer
      for (let i = 0; i <= 40; i++) { const t = i / 40; let px, py;
        if (t < .2) { px = bx - 34; py = by - 14 - t / .2 * 34; }
        else if (t < .8) { const u = (t - .2) / .6; px = bx - 34 + u * 68; py = by - 48 + Math.sin(u * TAU * 1.5) * -3 + Math.sin(u * Math.PI) * 9; }
        else { px = bx + 34; py = by - 48 + (t - .8) / .2 * 34; }
        kette.push([px, py]); }
      ctx.strokeStyle = "#3A3028"; ctx.lineWidth = 1; ctx.beginPath(); kette.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.stroke();
      const farben = ["#E2A93B", "#C9563A", "#E8C66A", "#B5532F", "#F2D27A"];
      for (let i = 0; i < musikL; i++) { const [lx, ly] = kette[Math.round((i + .5) / musikL * 40)], g = wachs("laterne:" + i);
        ctx.fillStyle = farben[i % farben.length]; ctx.beginPath(); ctx.ellipse(lx, ly + 3, 2.6 * g, 3.4 * g, 0, 0, TAU); ctx.fill();
        if (nacht > .25 || gold > .4) gluehen(ctx, lx, ly + 3, 11 * g, Math.max(nacht, gold * .6)); }
    }
    SZ.regionen.push({ ort: "tanz", x: bx - 46, y: by - 66, w: 92, h: 76 });
    // Blumenkästen: wachsen mit allen Begegnungen zusammen (nie pro Person)
    { const ges = Object.values(M.menschen).reduce((a, b) => a + b, 0), k = Math.min(Math.ceil(ges / 3), 8);
      const kasten = new Path2D(), bl = new Path2D();
      const kp = plaetze.filter((_, i) => i !== RITA && plaetze[i][1] > -50); for (let i = 0; i < Math.min(k, kp.length); i++) { const [dx, dy] = kp[i]; rr(kasten, x + dx - 20, y + dy + 17, 40, 7, 1); for (let j = 0; j < 4; j++) kreis(bl, x + dx - 15 + j * 10, y + dy + 15 - (j % 2) * 2.5, 4.4); }
      if (k) { papier(ctx, kasten, "#7A5A3E", 1); papier(ctx, bl, SA.blume[1] === "#F4F0E2" ? "#D9603C" : SA.blume[1], 0); } }

    // Zwei Flügel im rechten Winkel zum Hauptbau, beide zum Betrachter hin:
    // vorn (innen, am Parkplatz) ein eingeschossiger Flügel mit dem breiten Eingang an seiner Innenseite,
    // dahinter, weiter rechts versetzt, ein zweigeschossiger Flügel als zweite Reihe.
    const FW = 64, HH = .5, FB = .6, XB = HAUS.r + FW + 30; // XB: Innenkante des zweiten Flügels (Maßstab 1)
    const seiteF = mix("#D8CDB6", "#8C8270", sonneLinks ? .08 : .3), stirnF = mix("#D8CDB6", "#8C8270", sonneLinks ? .24 : .05);
    const flB = (f, hh) => { const [, yy, s] = fluegel(f, hh); return [FP + (XB - FP) * s, yy, s]; };
    const quad = (P, f0, f1, h0, h1) => { const [x1, y1a] = P(f0, h1), [, y1b] = P(f0, h0), [x2, y2a] = P(f1, h1), [, y2b] = P(f1, h0); return [[x1, y1a], [x2, y2a], [x2, y2b], [x1, y1b]]; };
    const fensterSeite = (P, f0, f1, h0, h1, key) => { const Q = quad(P, f0, f1, h0, h1), q = new Path2D(); poly(q, Q, null);
      const an = nacht > .3 && hash32("fl" + key) % 3 !== 0; ctx.fillStyle = an ? "#E9C77A" : mix("#4A5260", unten, .1); ctx.fill(q);
      if (an) fensterLicht(ctx, (Q[0][0] + Q[1][0]) / 2, (Q[0][1] + Q[3][1]) / 2, nacht * .5); };
    // --- zweite Reihe: zweigeschossiger Flügel (weiter hinten rechts) ---
    { const [b0x, b0y] = flB(0, 0), [b1x, b1y] = flB(0, 1), [c1x, c1y, sb] = flB(FB, 1), [c0x, c0y] = flB(FB, 0);
      const sw = new Path2D(); poly(sw, [[b0x, b0y], [b1x, b1y], [c1x, c1y], [c0x, c0y]], R("fluegelB"), .4); papier(ctx, sw, mix(seiteF, unten, .08), 3, { saum: true });
      for (const [h0, h1] of [[.66, .85], [.16, .36]]) for (const f of [.1, .34]) fensterSeite(flB, f, f + .14, h0, h1, "b" + f + h0);
      const d = new Path2D(); poly(d, [[b1x, b1y - 7], [c1x, c1y - 8 * sb], [c1x, c1y + 6 * sb], [b1x, b1y + 6]], null); papier(ctx, d, "#6F6A62", 2);
      const ox0 = c1x, ox1 = c1x + FW * sb, OW = ox1 - ox0, OH = c0y - c1y;
      const st0 = new Path2D(); poly(st0, [[ox0, c0y], [ox0, c1y], [ox1, c1y], [ox1, c0y]], R("stirnB"), .4); papier(ctx, st0, mix(stirnF, unten, .06), 3, { saum: true });
      ctx.fillStyle = "rgba(90,80,60,.16)"; ctx.fillRect(ox0, c1y + OH / 2 - 3, OW, 6);
      const dd = new Path2D(); poly(dd, [[ox0 - 3, c1y + 7], [ox0 - 3, c1y - 9], [ox1 + 7, c1y - 9], [ox1 + 7, c1y + 7]], null); papier(ctx, dd, "#6F6A62", 3, { saum: true });
      const ow = OW * .3, oh = OH * .19;
      [[.28, .25], [.72, .25], [.28, .74], [.72, .74]].forEach(([u, v], i) => { const wx = ox0 + OW * u, wy = c1y + OH * v, f = new Path2D(); rr(f, wx - ow / 2, wy - oh / 2, ow, oh, 2);
        const an = nacht > .3 && (i === 0 || hash32("stB" + i) % 2), liest = i === 0 && nacht > .3;
        ctx.fillStyle = an ? "#EAC777" : mix("#4A5260", unten, .08); ctx.fill(f); if (an) fensterLicht(ctx, wx, wy, nacht * .7);
        if (liest) { ctx.save(); ctx.clip(f); ctx.fillStyle = "#4A3A2E"; ctx.beginPath(); ctx.arc(wx + 3, wy, 4.6, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(wx + 2, wy + oh * .5, 9, 8, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#F4EDD6"; ctx.fillRect(wx - 5, wy + 4, 6, 4); ctx.restore(); }
        ctx.fillStyle = stirnF; ctx.fillRect(wx - 1.2, wy - oh / 2, 2.4, oh); ctx.fillStyle = "rgba(90,80,60,.35)"; ctx.fillRect(wx - ow / 2 - 2, wy + oh / 2, ow + 4, 2.5);
        if (i === 0) SZ.anker.lesefenster = [wx, wy]; }); }
    // --- vorderer Flügel: eingeschossig, Innenseite zum Parkplatz mit breitem Eingang ---
    const [ax, ay] = fluegel(0, 0), [bx2, by2] = fluegel(0, HH), [cx2, cy2, s1] = fluegel(1, HH), [dx2, dy2] = fluegel(1, 0);
    // Flachdach (von oben sichtbar, die Augenhöhe liegt darüber)
    { const dachF = new Path2D(); poly(dachF, [[bx2, by2], [cx2, cy2], [cx2 + FW * s1, cy2], [bx2 + FW, by2]], null); papier(ctx, dachF, schnee ? "#EEEEE8" : mix("#8E897E", unten, .1), 2); }
    const sw = new Path2D(); poly(sw, [[ax, ay], [bx2, by2], [cx2, cy2], [dx2, dy2]], R("fluegel"), .4); papier(ctx, sw, seiteF, 3, { saum: true });
    { const so = new Path2D(); poly(so, [[ax, ay], [ax, ay - 7], [dx2, dy2 - 7 * s1], [dx2, dy2]], null); ctx.fillStyle = "rgba(90,80,60,.2)"; ctx.fill(so);
      const att = new Path2D(); poly(att, [[bx2, by2 - 4], [cx2, cy2 - 6 * s1], [cx2, cy2 + 5 * s1], [bx2, by2 + 4]], null); papier(ctx, att, "#6F6A62", 2); }
    for (const f of [.06, .22]) fensterSeite(fluegel, f, f + .11, .14, .36, "a" + f);
    fensterSeite(fluegel, .86, .96, .14, .36, "a.86");
    // breiter Eingang an der Innenseite: Glasfront mit Doppeltür, Vordach auf Stützen
    { const E0 = .4, E1 = .8, EH = .38, G = quad(fluegel, E0, E1, 0, EH), g = new Path2D(); poly(g, G, null);
      ctx.fillStyle = nacht > .3 || gold > .5 ? "#EBC983" : "rgba(196,214,222,.95)"; ctx.fill(g);
      const [mx, my] = fluegel((E0 + E1) / 2, EH * .4); if (nacht > .3) gluehen(ctx, mx, my, 50, nacht * .8);
      const rahmen = new Path2D();
      for (const f of [E0, E0 + .08, (E0 + E1) / 2 - .012, (E0 + E1) / 2 + .012, E1 - .08, E1]) { const Q = quad(fluegel, f - .005, f + .005, 0, EH); poly(rahmen, Q, null); }
      poly(rahmen, quad(fluegel, E0, E1, EH * .7, EH * .73), null); poly(rahmen, quad(fluegel, E0, E1, EH - .015, EH), null);
      ctx.fillStyle = "#4E4A44"; ctx.fill(rahmen);
      // Vordach: ragt zum Parkplatz hin aus der Wand
      const [p0x, p0y, ps0] = fluegel(E0 - .05, EH + .05), [p1x, p1y, ps1] = fluegel(E1 + .06, EH + .05);
      const vd = new Path2D(); poly(vd, [[p0x, p0y], [p1x, p1y], [p1x - 16 * ps1, p1y + 3 * ps1], [p0x - 16 * ps0, p0y + 3 * ps0]], null);
      poly(vd, [[p0x - 16 * ps0, p0y + 3 * ps0], [p1x - 16 * ps1, p1y + 3 * ps1], [p1x - 16 * ps1, p1y + 7 * ps1], [p0x - 16 * ps0, p0y + 7 * ps0]], null);
      papier(ctx, vd, "#6F6A62", 3, { saum: true });
      const st2 = new Path2D(); for (const [f, ps, px, py] of [[E0 - .03, ps0, p0x, p0y], [E1 + .04, ps1, p1x, p1y]]) { const [, yb] = fluegel(f, 0), xx = fluegel(f, 0)[0] - 14 * ps; poly(st2, [[xx - 1.4 * ps, yb + 6 * ps], [xx - 1.4 * ps, py + 6 * ps], [xx + 1.4 * ps, py + 6 * ps], [xx + 1.4 * ps, yb + 6 * ps]], null); }
      papier(ctx, st2, "#5A5650", 1);
      // Vorplatz vor dem Eingang
      const [v0x, v0y, vs0] = fluegel(E0 - .06, 0), [v1x, v1y, vs1] = fluegel(E1 + .08, 0);
      const vp = new Path2D(); poly(vp, [[v0x, v0y], [v1x, v1y], [v1x - 26 * vs1, v1y + 4 * vs1], [v0x - 26 * vs0, v0y + 4 * vs0]], null); papier(ctx, vp, schnee ? "#E4E4DE" : "#CFC6B4", 1);
      SZ.anker.eingang = [mx - 10, fluegel((E0 + E1) / 2, 0)[1]]; }
    // Stirnseite des eingeschossigen Flügels (zum Betrachter)
    const fx0 = dx2, fx1 = dx2 + FW * s1, fy0 = cy2, fy1 = dy2, W = fx1 - fx0, H = fy1 - fy0;
    const stirn = new Path2D(); poly(stirn, [[fx0, fy1], [fx0, fy0], [fx1, fy0], [fx1, fy1]], R("stirn"), .5); papier(ctx, stirn, stirnF, 4, { saum: true });
    ctx.fillStyle = "rgba(90,80,60,.2)"; ctx.fillRect(fx0, fy1 - 9, W, 9);
    { const dd = new Path2D(); poly(dd, [[fx0 - 3, fy0 + 7], [fx0 - 3, fy0 - 8], [fx1 + 7, fy0 - 8], [fx1 + 7, fy0 + 7]], null); papier(ctx, dd, "#6F6A62", 3, { saum: true }); }
    [.3, .74].forEach((u, i) => { const wx = fx0 + W * u, wy = fy0 + H * .4, ww = W * .26, wh = H * .32, f = new Path2D(); rr(f, wx - ww / 2, wy - wh / 2, ww, wh, 2);
      const an = nacht > .3 && hash32("vf" + i + tagVon(d)) % 2; ctx.fillStyle = an ? "#EAC777" : mix("#4A5260", unten, .08); ctx.fill(f); if (an) fensterLicht(ctx, wx, wy, nacht * .6);
      ctx.fillStyle = stirnF; ctx.fillRect(wx - 1.2, wy - wh / 2, 2.4, wh); ctx.fillStyle = "rgba(90,80,60,.35)"; ctx.fillRect(wx - ww / 2 - 2, wy + wh / 2, ww + 4, 2.5); });
    // Mülltonnen an der Stirnseite
    { const t = new Path2D(), t2 = new Path2D(), mx0 = fx0 + W * .52; rr(t, mx0 - 19, fy1 - 25, 17, 24, 2); rr(t2, mx0, fy1 - 23, 16, 22, 2);
      papier(ctx, t, "#6E7470", 1.5); papier(ctx, t2, "#3E5A78", 1.5); ctx.fillStyle = "rgba(20,20,20,.3)"; ctx.fillRect(mx0 - 20, fy1 - 26, 19, 3); ctx.fillRect(mx0 - 1, fy1 - 24, 18, 3);
      SZ.anker.muell = [mx0, fy1 - 14]; }
    SZ.regionen.push({ ort: "fenster", x: hl - 10, y: top - 60, w: fx1 - hl + 20, h: PARK.vorn - top + 60 });

    // Vorgarten: niedrige Hecke an der ganzen Front
    { const hk = new Path2D(), r = R("vorgarten"); for (let k = 0; k < 30; k++) fetzen(hk, hl + 14 + k * 14.5, y - 2, 9 + r() * 3, 7 + r() * 2, r, 9); papier(ctx, hk, schnee ? "#E8E8E0" : "#4E6B40", 2);
      if (st >= 6) { const g = new Path2D(), r2 = R("zaun"); for (let k = 0; k < 12; k++) { const zx = strasseL(640) + 6 + k * 10.5; poly(g, [[zx, 646], [zx, 628], [zx + 3, 624], [zx + 6, 628], [zx + 6, 646]], r2, .3); }
        poly(g, [[strasseL(640) + 4, 634], [x - 22, 634], [x - 22, 638], [strasseL(640) + 4, 638]], null); papier(ctx, g, "#F1EBDD", 2);
        const bl = new Path2D(); for (let k = 0; k < 11; k++) kreis(bl, hl + 22 + k * 15, y - 8 - (k % 2) * 3, 4.2); papier(ctx, bl, SA.blume[1], 1); } }
  }

  // ===== Parkplatz: Autos in zwei Reihen, Laterne, Hecken =====
  { const r = R("autos" + tagVon(d)), farben = ["#7E93A8", "#B5534A", "#D8CFB8", "#4F6656", "#C9A24A", "#5A5F6E", "#9A6A8A", "#E6E1D6"], dichte = nacht > .3 ? .92 : .7;
    [512, 560, 608, 656].forEach((ax, i) => { if (i === 2 || r() < dichte) auto(ctx, ax, 668, .9, farben[(i * 3 + Math.floor(r() * 8)) % 8], nacht, false); });
    // Katze auf dem Autodach
    { const k = new Path2D(); ellipse(k, 606, 646, 6.5, 3.6); kreis(k, 612, 643, 2.8); poly(k, [[610.2, 641.5], [611, 638.4], [612.6, 641]], null); poly(k, [[613, 641], [614.4, 638.2], [615, 641.6]], null);
      papier(ctx, k, "#3A3530", 1); ctx.strokeStyle = "#3A3530"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(600, 647); ctx.quadraticCurveTo(594, 650, 597, 642); ctx.stroke();
      if (nacht > .3) { ctx.fillStyle = "#E8E07A"; ctx.fillRect(612.4, 642.4, 1.1, 1.1); ctx.fillRect(614.2, 642.4, 1.1, 1.1); } SZ.anker.katze = [606, 642]; }
    // Grünstreifen mit Büschen und einem kleinen Baum teilt den Parkplatz zwischen den Reihen
    { const g0 = 452, g1 = 724, gy = 678, gr = R("gruenstreifen" ), gruen = schnee ? "#E8E8E0" : SA.wiese2;
      const bord = new Path2D(); rr(bord, g0 - 3, gy - 7, g1 - g0 + 6, 15, 7); papier(ctx, bord, schnee ? "#E4E4DE" : "#C9C3B4", 1.5);
      const st = new Path2D(); rr(st, g0, gy - 5, g1 - g0, 10, 5); papier(ctx, st, gruen, 0);
      const bx = 598, by = gy; // kleiner Baum (Feldahorn), Krone je nach Jahreszeit
      const stamm = new Path2D(); poly(stamm, [[bx - 2, by], [bx - 1.4, by - 30], [bx + 1.4, by - 30], [bx + 2, by]], null); papier(ctx, stamm, "#6A4A36", 1.5);
      if (SA.laub) krone(ctx, bx, by - 40, 20, 7, gr, mix(SA.laub[1], "#4E6B40", .25), 2); else aeste(ctx, bx, by - 28, 60, gr, "#5C4B3A", 1.5);
      const bu = new Path2D(); for (const x of [474, 500, 540, 652, 690, 708]) fetzen(bu, x, gy - 4, 9 + gr() * 4, 6.5 + gr() * 2, gr, 10);
      papier(ctx, bu, schnee ? "#E8E8E0" : saison === "herbst" ? "#66773F" : "#4E6B40", 1.5, { saum: true }); }
    // Laterne an der Einfahrt
    { const lx = 404, ly = PARK.vorn + 6, p = new Path2D(); poly(p, [[lx - 2, ly], [lx - 1.4, ly - 92], [lx + 1.4, ly - 92], [lx + 2, ly]], null); poly(p, [[lx - 9, ly - 92], [lx + 9, ly - 92], [lx + 5, ly - 100], [lx - 5, ly - 100]], null); papier(ctx, p, "#4A4A48", 1.5);
      ctx.fillStyle = nacht > .2 || gold > .5 ? "#FFE3A0" : "#E8E2D2"; ctx.fillRect(lx - 6, ly - 92, 12, 3); if (nacht > .2) gluehen(ctx, lx, ly - 88, 46, nacht); SZ.anker.laterne = [lx, ly - 92]; }
    [468, 524, 580, 636, 692, 748].forEach((ax, i) => { if (r() < dichte) auto(ctx, ax, 718, 1.1, farben[(i * 5 + Math.floor(r() * 8)) % 8], nacht, true); });
    // Hecke am Parkplatz vorn und entlang des Seitenflügels, Büsche links
    const hecke = schnee ? "#E8E8E0" : saison === "herbst" ? "#66773F" : "#4E6B40", hr = R("hecke");
    const h1 = new Path2D(); poly(h1, [[414, PARK.vorn + 16], [414, PARK.vorn - 2], [fluegelX(PARK.vorn) - 2, PARK.vorn - 6], [fluegelX(PARK.vorn) + 4, PARK.vorn + 16]], null);
    for (let hx = 420; hx < fluegelX(PARK.vorn); hx += 13) fetzen(h1, hx, PARK.vorn - 1, 9 + hr() * 3, 8 + hr() * 2, hr, 9);
    for (let f = .04; f < .98; f += .08) { if (f > .3 && f < .9) continue; const [px, py, s] = fluegel(f, 0); fetzen(h1, px - 5 * s, py - 4 * s, 7 * s, 6 * s, hr, 9); }
    papier(ctx, h1, hecke, 2, { saum: true });
    const b = new Path2D(); for (const [bx, by, br] of [[276, 632, 13], [300, 640, 17], [328, 646, 14], [254, 626, 10]]) fetzen(b, bx, by - br * .5, br, br * .8, hr, 11);
    papier(ctx, b, mix(hecke, "#2F4A36", .25), 2, { saum: true }); SZ.anker.igel = [304, 650];
  }

  // ===== Leseeiche (Lesen): links vorn am Waldsaum =====
  { const x = 118, y = 670, r = R("eiche");
    const gr = clamp(.62 + Math.log2(1 + M.leseMin / 30) * .07 + (st >= 5 ? .12 : 0), .62, 1.18) * (neu === "eiche" ? (.92 + .08 * easeOut(t)) : 1);
    const h = 240 * gr;
    const stamm = new Path2D();
    poly(stamm, [[x - 22 * gr, y], [x - 12 * gr, y - h * .5], [x - 40 * gr, y - h * .72], [x - 30 * gr, y - h * .76], [x - 4 * gr, y - h * .56], [x + 2 * gr, y - h * .8], [x + 12 * gr, y - h * .8], [x + 12 * gr, y - h * .52], [x + 40 * gr, y - h * .7], [x + 46 * gr, y - h * .64], [x + 18 * gr, y - h * .42], [x + 24 * gr, y]], r, .8);
    papier(ctx, stamm, "#5E4632", 4, { saum: true });
    if (SA.laub) {
      const dichte = clamp(9 + Math.floor(Math.sqrt(M.leseMin / 10) * 2.2), 9, 34);
      krone(ctx, x, y - h * .8, 100 * gr, dichte, R("eichekrone"), SA.laub[0], 4);
      krone(ctx, x - 8, y - h * .86, 75 * gr, Math.round(dichte * .6), R("eichekrone2"), SA.laub[1], 3);
    } else aeste(ctx, x, y - h * .7, h * 1.4, r, "#5E4632", 3);
    SZ.anker.eiche = [x + 4, y - h * .62];
    // Uhu in der Astgabel (nachts) – ein kleiner Scherenschnitt
    if (nacht > .3) { const u = new Path2D(), ux = x + 3 * gr, uy = y - h * .58; ellipse(u, ux, uy, 6, 8); poly(u, [[ux - 6, uy - 5], [ux - 5, uy - 12], [ux - 2, uy - 7]], null); poly(u, [[ux + 6, uy - 5], [ux + 5, uy - 12], [ux + 2, uy - 7]], null); papier(ctx, u, "#3E3428", 1);
      ctx.fillStyle = "#F2B04A"; ctx.beginPath(); ctx.arc(ux - 2.4, uy - 4, 1.4, 0, TAU); ctx.arc(ux + 2.4, uy - 4, 1.4, 0, TAU); ctx.fill(); }
    // Lesezeichen-Bänder je ausgelesenem Buch
    const farben = ["#7A2A1B", "#463873", "#1A4560", "#C98A1B", "#1F4A34", "#B5532F"];
    const astP = [[-62, .7], [48, .66], [-30, .62], [70, .6], [-84, .64], [22, .7], [-8, .58]];
    M.buecher.slice(0, 7).forEach((b, i) => {
      const extra = Math.floor((M.buecher.length - 1 - i) / 7);
      const bx = x + astP[i][0] * gr * .85, by = y - h * astP[i][1];
      const p = new Path2D(), L = 32 + (i % 3) * 6 + extra * 9, gg = wachs("buch:" + Math.min(i, 6));
      poly(p, [[bx - 3.5, by], [bx + 3.5, by], [bx + 3.5, by + L * gg], [bx, by + L * gg - 6], [bx - 3.5, by + L * gg]], null);
      papier(ctx, p, farben[(b.farbe || i) % farben.length], 2);
    });
    // Vogelhaus (Stufe 10)
    if (st >= 10) { const p = new Path2D(), vx = x + 4, vy = y - h * .42; poly(p, [[vx - 12, vy], [vx - 12, vy - 19], [vx, vy - 29], [vx + 12, vy - 19], [vx + 12, vy]], null); papier(ctx, p, "#A0703F", 2); ctx.fillStyle = "#2B2620"; ctx.beginPath(); ctx.arc(vx, vy - 12, 3.4, 0, TAU); ctx.fill(); }
    SZ.regionen.push({ ort: "eiche", x: x - 110, y: y - h - 20, w: 230, h: h + 30 });
  }

  // ===== Quelle → Bach → Weiher (Ruhe): rechts vorn auf der Wiese =====
  { const qx = QUELLE[0], qy = QUELLE[1], n = M.ruhe, [wx, wy] = WEIHER;
    const len = clamp(n / 10, 0, 1), weiher = clamp((n - 8) / 40, 0, 1);
    if (weiher > 0) { const p = new Path2D(), g = wachs("quelle"); ellipse(p, wx, wy, (70 + weiher * 80) * g, (16 + weiher * 20) * g); papier(ctx, p, mix("#7FA7B5", oben, .25), 2);
      ctx.save(); ctx.clip(p); ctx.fillStyle = `rgba(255,255,255,${.25 - nacht * .15})`; ctx.fillRect(wx - 60, wy - 8, 150, 4); ctx.fillRect(wx - 30, wy + 4, 110, 3);
      if (nacht > .3) { ctx.fillStyle = "rgba(244,237,214,.75)"; for (let k = 0; k < 4; k++) ctx.fillRect(wx + 30 - k * 2, wy - 10 + k * 5, 16 - k * 3, 2.2); }
      ctx.restore(); SZ.anker.wasser = [wx + 20, wy]; }
    if (n > 0) {
      const p = new Path2D(), pts = [[qx, qy]], r = R("bach");
      const ziel = [[qx - 30, qy + 16], [qx - 62, qy + 32], [qx - 96, qy + 48], [wx + 30, wy - 4]]; const k = Math.max(1, Math.round(len * 4));
      for (let i = 0; i < k; i++) pts.push([ziel[i][0] + (r() - .5) * 8, ziel[i][1]]);
      const breite = 4 + len * 5;
      p.moveTo(pts[0][0], pts[0][1] - breite);
      pts.forEach(([a, b], i) => p.lineTo(a, b - breite * (1 + i * .25)));
      for (let i = pts.length - 1; i >= 0; i--) p.lineTo(pts[i][0] + 2, pts[i][1] + breite * (1 + i * .25));
      p.closePath(); papier(ctx, p, mix("#6E9CAE", oben, .2), 1.5);
    }
    const q = new Path2D(), g = wachs("quelle"); ellipse(q, qx, qy, (16 + Math.min(n, 12) * .8) * g, (6 + Math.min(n, 12) * .3) * g); papier(ctx, q, mix("#6E9CAE", oben, .15), 2);
    if (!SZ.anker.wasser) SZ.anker.wasser = [qx, qy];
    const steine = new Path2D(); const r = R("quellsteine"); for (let i = 0; i < 5; i++) ellipse(steine, qx - 26 + i * 13 + r() * 4, qy - 5 + (i % 2) * 11, 6 + r() * 3, 4); papier(ctx, steine, "#9A9488", 1.5);
    // Steg (Stufe 4)
    if (st >= 4) { const p = new Path2D(), sx = qx - 62, sy = qy + 34; poly(p, [[sx - 22, sy - 10], [sx + 20, sy + 8], [sx + 16, sy + 12], [sx - 26, sy - 6]], null);
      poly(p, [[sx - 22, sy - 8], [sx - 21, sy - 24], [sx - 18, sy - 24], [sx - 19, sy - 8]], null); poly(p, [[sx + 16, sy + 8], [sx + 17, sy - 8], [sx + 20, sy - 8], [sx + 19, sy + 8]], null);
      papier(ctx, p, "#9B7550", 2); }
    SZ.regionen.push({ ort: "quelle", x: wx - 160, y: qy - 30, w: qx - wx + 200, h: wy - qy + 80 });
  }

  // ===== Fest (Stufe 12): langer Tisch auf der Wiese, Lichter quer =====
  if (st >= 12) { const p = new Path2D(), x = 560, y = 786, k = .8;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
    poly(p, [[x - 110, y - 26], [x + 110, y - 26], [x + 110, y - 18], [x - 110, y - 18]], null);
    for (const dx of [-100, 100]) poly(p, [[x + dx - 3, y - 18], [x + dx + 3, y - 18], [x + dx + 3, y + 8], [x + dx - 3, y + 8]], null);
    for (let k2 = 0; k2 < 6; k2++) { const cx = x - 90 + k2 * 36; poly(p, [[cx - 9, y + 10], [cx - 9, y - 6], [cx + 9, y - 6], [cx + 9, y + 10], [cx + 7, y + 10], [cx + 7, y], [cx - 7, y], [cx - 7, y + 10]], null); }
    papier(ctx, p, "#E6D8BC", 3, { saum: true }); ctx.restore();
    ctx.strokeStyle = "#3A3028"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(150, 600); ctx.quadraticCurveTo(480, 800, 829, 640); ctx.stroke();
    for (let i = 0; i < 18; i++) { const tt = (i + .5) / 18, lx = (1 - tt) * (1 - tt) * 150 + 2 * (1 - tt) * tt * 480 + tt * tt * 829, ly = (1 - tt) * (1 - tt) * 600 + 2 * (1 - tt) * tt * 800 + tt * tt * 640;
      ctx.fillStyle = "#F2C36B"; ctx.beginPath(); ctx.arc(lx, ly + 4, 4, 0, TAU); ctx.fill(); if (nacht > .3) gluehen(ctx, lx, ly + 4, 14, nacht * .7); } }

  // ===== Pavillon (Stufe 11): rechts vorn zwischen Weiher und Waldweg =====
  if (st >= 11) { const x = 770, y = 808, p = new Path2D();
    ctx.save(); ctx.translate(x, y); ctx.scale(.7, .7); ctx.translate(-x, -y);
    poly(p, [[x - 50, y], [x - 46, y - 80], [x - 40, y - 80], [x - 44, y]], null); poly(p, [[x + 50, y], [x + 46, y - 80], [x + 40, y - 80], [x + 44, y]], null);
    poly(p, [[x - 62, y - 78], [x, y - 122], [x + 62, y - 78]], null); papier(ctx, p, "#E8DCC4", 3, { saum: true }); ctx.restore(); }

  // ===== Wiese: Blumen (Hände & Haus) =====
  { const r = R("blumen"), n = Math.min(M.wiese, 70), p = [new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < n; i++) {
      let fx, fy, versuch = 0;
      do { fx = 20 + r() * 940; fy = 690 + r() * 215; versuch++; } while (versuch < 14 && blockiert(fx, fy, M));
      if (schnee || blockiert(fx, fy, M)) continue;
      const gg = wachs("wiese:" + i), s = (5 + r() * 3) * gg * (.75 + (fy - 690) / 860), art = i % 3;
      const st2 = new Path2D(); poly(st2, [[fx - .8, fy + 14], [fx - .8, fy], [fx + .8, fy], [fx + .8, fy + 14]], null); ctx.fillStyle = "#4E6B3E"; ctx.fill(st2);
      if (art === 0) { for (let k = 0; k < 5; k++) kreis(p[0], fx + Math.cos(k / 5 * TAU) * s * .8, fy + Math.sin(k / 5 * TAU) * s * .8, s * .55); }
      else if (art === 1) kreis(p[1], fx, fy, s * .8);
      else { poly(p[2], [[fx - s * .7, fy], [fx, fy - s * 1.5], [fx + s * .7, fy]], null); }
    }
    p.forEach((pp, i) => papier(ctx, pp, SA.blume[i], 1));
    if (n) SZ.regionen.push({ ort: "wiese", x: 20, y: 740, w: 960, h: 170 });
  }

  // ===== E4 Weg (Kilometer): Waldweg rechts, verschwindet hinter der großen Kiefer im Wald =====
  if (st >= 1) {
    const anteil = clamp(.45 + Math.sqrt(M.km) / 20, .45, 1) * (neu === "weg" ? (.85 + .15 * easeOut(t)) : 1);
    const pts = []; const N = 40;
    for (let i = 0; i <= N; i++) pts.push(wegPunkt(i / N * anteil));
    const p = new Path2D();
    p.moveTo(pts[0][0] - pts[0][2], pts[0][1] + 20);
    pts.forEach(([x, y, w]) => p.lineTo(x - w, y)); pts.slice().reverse().forEach(([x, y, w]) => p.lineTo(x + w, y)); p.lineTo(pts[0][0] + pts[0][2], pts[0][1] + 20);
    p.closePath(); papier(ctx, p, schnee ? "#F4F2EA" : "#E3D2AE", 3);
    // Wegsteine je 5 km, Pfahl je 25 km, Wegweiser je 100 km
    const steine = Math.min(Math.floor(M.km / 5), 30), pfaehle = Math.min(Math.floor(M.km / 25), 8), weiser = Math.min(Math.floor(M.km / 100), 2);
    const st3 = new Path2D();
    for (let i = 0; i < steine; i++) { const k = Math.min(N, 1 + Math.floor((i + .5) / 30 * (N - 2))); const [x, y, w] = pts[k]; const side = i % 2 ? 1 : -1, s = w / 64 + .3; ellipse(st3, x + side * (w + 7 * s), y, 7 * s, 4.4 * s); }
    if (steine) papier(ctx, st3, "#A39C8E", 1.5);
    for (let i = 0; i < pfaehle; i++) { const k = 3 + i * 4; const [x, y, w] = pts[Math.min(k, N)]; const s = w / 64 + .3; const pf = new Path2D(); poly(pf, [[x + w + 12, y], [x + w + 12, y - 30 * s], [x + w + 18, y - 33 * s], [x + w + 18, y]], null); papier(ctx, pf, "#7A5A3E", 2); }
    for (let i = 0; i < weiser; i++) { const k = 6 + i * 8; const [x, y, w] = pts[Math.min(k, N)]; const s = w / 64 + .35; const ww = new Path2D(); poly(ww, [[x - w - 18, y], [x - w - 18, y - 54 * s], [x - w - 14, y - 54 * s], [x - w - 14, y]], null); poly(ww, [[x - w - 42, y - 50 * s], [x - w + 4, y - 50 * s], [x - w + 11, y - 44 * s], [x - w + 4, y - 38 * s], [x - w - 42, y - 38 * s]], null); papier(ctx, ww, "#8A6A48", 2); }
    // Bank (Stufe 2) und Rastbänke („War zu viel“)
    const baenke = (st >= 2 ? 1 : 0) + Math.min(M.baenke, 2), BP = [[.25, -1], [.1, 1], [.62, -1]];
    for (let i = 0; i < baenke; i++) { const [x, y, w] = pts[Math.round(BP[i][0] * N)], s = w / 64 * .8 + .4, bxx = x + BP[i][1] * (w + 42 * s); bank(ctx, bxx, y - 4, s * (i === 0 ? wachs("stufe:2") : 1)); if (i === 0) SZ.bankPos = [bxx, y - 4]; }
    SZ.anker.schnecke = [pts[Math.round(N * .5)][0] - 6, pts[Math.round(N * .5)][1]];
    SZ.regionen.push({ ort: "weg", x: 730, y: 700, w: 270, h: 220 });
  }

  // ===== Glühwürmchen (Mut): am Waldsaum links und über der Wiese rechts =====
  { const r = R("gluehw"), n = Math.min(M.mut, 30);
    for (let i = 0; i < n; i++) { let x, y, v = 0;
      do { if (i % 3 === 0) { x = 60 + r() * 170; y = 640 + r() * 100; } else { x = 400 + r() * 520; y = 750 + r() * 140; } v++; } while (v < 8 && x > 400 && y < PARK.vorn + 20);
      const gg = wachs("mut:" + i);
      ctx.fillStyle = nacht > .3 || gold > .5 ? "#FFE08A" : "#E2A93B"; ctx.beginPath(); ctx.arc(x, y, 3.4 * gg, 0, TAU); ctx.fill();
      if (nacht > .2) gluehen(ctx, x, y, 16, nacht);
      if (i === 0) SZ.anker.gluehw = [x, y]; }
    if (n) { SZ.regionen.push({ ort: "mut", x: 10, y: 590, w: 230, h: 170 }); SZ.regionen.push({ ort: "mut", x: 390, y: 740, w: 540, h: 160 }); } }

  // ===== Freigeschaltetes aus dem Kramladen =====
  ladenDinge(ctx, M, SA, nacht, wachs);

  // ===== Dickicht (verschwindet mit den Stufen: Licht fällt ein) =====
  { const n = [7, 4, 2][st] ?? 0; const r = R("dickicht");
    if (n && alt > 0) { ctx.save(); ctx.globalAlpha = .22; ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.moveTo(470, 0); ctx.lineTo(560, 0); ctx.lineTo(600, VH); ctx.lineTo(500, VH); ctx.closePath(); ctx.fill(); ctx.restore(); }
    const plaetze = [[740, 912, 0], [150, 800, 1], [470, 886, 1], [620, 918, 0], [60, 832, 1], [735, 840, 1], [560, 872, 0]];
    for (let i = 0; i < n; i++) { const [x, y, tief] = plaetze[i];
      kiefer(ctx, x, y + r() * 8, (tief ? 200 : 250) + r() * 30, r, tief ? "#3C5A42" : "#2F4A36", tief ? "#6A4A36" : "#5A3E2E", tief ? 3 : 5); } }

  // ===== E5 Portal: Vordergrund-Stämme, Farn, Moos =====
  { const r = R("portal");
    kiefer(ctx, 14, VH + 30, 900, r, mix("#2E4733", "#000000", .05), "#5B3B2A", 6);
    kiefer(ctx, 986, VH + 30, 860, r, mix("#2E4733", "#000000", .05), "#5B3B2A", 6);
    if (nacht >= .3) { // nachts: Kobel (Eichhörnchennest) in der Kiefer, darin schläft es
      ctx.save(); ctx.fillStyle = "#3A2E24"; ctx.beginPath(); ctx.ellipse(966, 688, 11, 8, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = "#4A3A2C"; ctx.lineWidth = 1.2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(956 + i * 5, 682); ctx.lineTo(958 + i * 4, 694); ctx.stroke(); } ctx.restore();
      SZ.anker.eich2 = [966, 688]; }
    if (nacht < .3) { // zweites Eichhörnchen klettert die große Kiefer rechts hoch
      ctx.save(); ctx.translate(968, 690); ctx.fillStyle = "#A8562A";
      ctx.beginPath(); ctx.ellipse(0, 0, 4.2, 8, -.15, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-.8, -9.5, 3.4, 3.2, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-3, -12); ctx.lineTo(-2.4, -15.5); ctx.lineTo(-1, -12.2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(1.5, 6); ctx.quadraticCurveTo(-9, 14, -7, 2); ctx.quadraticCurveTo(-6, -4, -3, 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#1C2620"; ctx.beginPath(); ctx.arc(.8, -10, .8, 0, TAU); ctx.fill(); ctx.restore();
      SZ.anker.eich2 = [966, 688]; }
    const farn = new Path2D();
    for (const [fx, dir] of [[6, 1], [960, -1], [906, -1]]) for (let k = 0; k < 6; k++) {
      const a = -Math.PI / 2 + dir * (k * .22 - .2), L = 90 + r() * 40, bx = fx + dir * k * 4, by = VH + 8;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L;
      poly(farn, [[bx - 3, by], [ex, ey], [bx + 3, by]], null);
      for (let j = 1; j < 7; j++) { const tx = bx + (ex - bx) * j / 7, ty = by + (ey - by) * j / 7, l = 18 * (1 - j / 8); poly(farn, [[tx, ty], [tx + Math.cos(a - 1.2) * l, ty + Math.sin(a - 1.2) * l], [tx + 2, ty + 2]], null); poly(farn, [[tx, ty], [tx + Math.cos(a + 1.2) * l, ty + Math.sin(a + 1.2) * l], [tx - 2, ty + 2]], null); }
    }
    papier(ctx, farn, schnee ? "#7C8A72" : SA.farn, 3);
    // Moos am Boden (Ruhe rahmt das Bild leise mit)
    const moos = new Path2D(); for (let i = 0; i < Math.min(4 + M.ruhe, 22); i++) ellipse(moos, (i % 2 ? 940 : 4) + (r() - .5) * (i % 2 ? 120 : 50), VH - 4 - r() * 18, 16 + r() * 18, 8 + r() * 5);
    papier(ctx, moos, schnee ? "#E8E8E0" : "#4F6B3C", 2);
  }

  // ===== Schnee als zusätzliche Papierlage =====
  if (schnee) { const r = R("schnee" + tagVon(d)); ctx.fillStyle = "rgba(250,250,246,.92)"; for (let i = 0; i < 90; i++) { ctx.beginPath(); ctx.arc(r() * VW, r() * VH, 1.2 + r() * 2.2, 0, TAU); ctx.fill(); } }

  // ===== Hühnchen (Ton): steht, wo Rita zuletzt etwas getan hat =====
  { const pos0 = nacht > .5 ? HUHN_NACHT : huehnchenPos(M.letzte); const besuch = figurenHeute();
    if (S.figuren !== false && nacht < .5) { const fs = pos0[1] / 640; figur(ctx, pos0[0] - 30 * fs, pos0[1] + 2, fs * 1.05, "rita"); besuch.forEach((w, i) => figur(ctx, pos0[0] - 62 * fs - i * 28 * fs, pos0[1] + 4, fs * 1.05, w)); SZ.regionen.push({ ort: "figuren", x: pos0[0] - 120, y: pos0[1] - 90, w: 110, h: 95, besuch }); } }
  if (S.huhn) { const pos = nacht > .5 ? HUHN_NACHT : huehnchenPos(M.letzte); huehnchenZeichnen(ctx, pos[0], pos[1], .6 * pos[1] / 680); SZ.anker.huhn = [pos[0], pos[1] - 16]; SZ.regionen.push({ ort: "huehnchen", x: pos[0] - 18, y: pos[1] - 36, w: 40, h: 40 }); }

  // ===== Papierfaser über allem =====
  ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = .07; ctx.fillStyle = grainPattern(ctx);
  ctx.fillRect(-ox / sk, -oy / sk, cw / sk, ch / sk); ctx.restore();
  // Nacht: leichter Blauschleier, aber hell
  if (nacht > 0) { ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = `rgba(170,188,225,${nacht * .18})`; ctx.fillRect(-ox / sk, -oy / sk, cw / sk, ch / sk); ctx.restore(); }
  SZ.sk = sk; SZ.ox = ox; SZ.oy = oy;
}
function blockiert(x, y, M) {
  // Zufahrt, Parkplatz, Hecke, Häuser
  if (y < PARK.vorn + 18 && x > strasseL(Math.max(y, PARK.hinten - 40)) - 16) return true;
  if (y > PARK.hinten - 30 && x > strasseL(y) - 14 && x < strasseR(y) + 14) return true;
  // Waldweg
  const u = (VH + 10 - y) / 200; if (u >= 0 && u <= 1) { const [px, , w] = wegPunkt(u); if (Math.abs(x - px) < w + 16) return true; }
  // Weiher, Quelle und Bach
  if (M.ruhe > 8 && ((x - WEIHER[0]) / 165) ** 2 + ((y - WEIHER[1]) / 44) ** 2 < 1) return true;
  const [qx, qy] = QUELLE, dx = WEIHER[0] + 30 - qx, dy = WEIHER[1] - 4 - qy;
  const t = clamp(((x - qx) * dx + (y - qy) * dy) / (dx * dx + dy * dy), 0, 1); if (Math.hypot(x - (qx + dx * t), y - (qy + dy * t)) < 28) return true;
  // Pavillon (Stufe 11), Festtisch (Stufe 12)
  if (S.maxStufe >= 11 && x > 726 && x < 816 && y > 720 && y < 816) return true;
  if (S.maxStufe >= 12 && x > 460 && x < 660 && y > 750 && y < 800) return true;
  // Eichenstamm
  if (Math.abs(x - 118) < 30 && y < 692) return true;
  return false;
}
function easeOut(x) { return 1 - Math.pow(1 - clamp(x, 0, 1), 3); }

function laterne(ctx, x, y, i, nacht, g = 1) {
  const farben = ["#E2A93B", "#C9563A", "#E8C66A", "#B5532F"];
  const p = new Path2D(); ellipse(p, x, y + 10 * g, 8 * g, 11 * g);
  ctx.strokeStyle = "#3A3028"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y); ctx.stroke();
  papier(ctx, p, farben[i % farben.length], 1.5);
  if (nacht > .25) gluehen(ctx, x, y + 10, 26 * g, nacht * .9);
}
function gluehen(ctx, x, y, r, k) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(242,195,107,${.55 * k})`); g.addColorStop(1, "rgba(242,195,107,0)");
  ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function fensterLicht(ctx, x, y, k) { if (k > .1) gluehen(ctx, x, y, 34, k); }
function bank(ctx, x, y, s) {
  const p = new Path2D();
  poly(p, [[x - 34 * s, y - 14 * s], [x + 34 * s, y - 14 * s], [x + 34 * s, y - 8 * s], [x - 34 * s, y - 8 * s]], null);
  poly(p, [[x - 32 * s, y - 30 * s], [x + 32 * s, y - 30 * s], [x + 32 * s, y - 24 * s], [x - 32 * s, y - 24 * s]], null);
  for (const dx of [-28, 26]) poly(p, [[x + dx * s, y - 30 * s], [x + (dx + 4) * s, y - 30 * s], [x + (dx + 4) * s, y + 4 * s], [x + dx * s, y + 4 * s]], null);
  papier(ctx, p, "#8E6A45", 2, { saum: true });
}
/* ---------- Figuren aus Papier: Rita, Max, Christiane, Micha (nach Fotos stilisiert, keine Porträts) ---------- */
const FIGUREN = {
  rita: { haut: "#F0C9AA", haar: "#B9AB8E", strähne: "#DCD6C8", oben: "#22304A", unten: "#8FA9C4", schuh: "#C9A27E", gross: 1 },
  max: { haut: "#E6B593", haar: "#6B4A30", oben: "#1E1E22", unten: "#3A3F4A", schuh: "#2A2A2A", locken: true, undercut: false, gross: 1.08 },
  christiane: { haut: "#EBBE9E", haar: "#E3CF94", oben: "#8E2B4F", unten: "#2A3550", schuh: "#3A2A22", brille: "#C0282A", tuch: "#2B3A66", gross: .98 },
  micha: { haut: "#E0AE8C", haar: null, oben: "#1F2D4F", unten: "#4A4A4A", schuh: "#2A2A2A", gross: 1.05 }
};
function figur(ctx, x, y, s, wer, opt = {}) {
  const F = FIGUREN[wer] || FIGUREN.rita; s *= F.gross;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (LICHT.nacht > .3) ctx.filter = `brightness(${1 - LICHT.nacht * .35})`;
  ctx.fillStyle = "rgba(20,28,24,.25)"; ctx.beginPath(); ctx.ellipse(0, 1, 13, 3.2, 0, 0, TAU); ctx.fill();
  const flaeche = (pts, c) => { const p = new Path2D(); poly(p, pts, null); ctx.fillStyle = c; ctx.fill(p); };
  // Beine / Hose
  flaeche([[-7, 0], [-6, -30], [6, -30], [7, 0], [2, 0], [0, -20], [-2, 0]], F.unten);
  flaeche([[-9, 0], [-2, 0], [-2, -3], [-8, -3]], F.schuh); flaeche([[2, 0], [9, 0], [8, -3], [2, -3]], F.schuh);
  // Oberkörper
  flaeche([[-9, -29], [-10, -52], [-6, -58], [6, -58], [10, -52], [9, -29]], F.oben);
  // Arme
  flaeche([[-10, -52], [-14, -34], [-11, -33], [-7, -48]], F.oben); flaeche([[10, -52], [14, -34], [11, -33], [7, -48]], F.oben);
  ctx.fillStyle = F.haut; ctx.beginPath(); ctx.arc(-12.6, -32.5, 2.4, 0, TAU); ctx.arc(12.6, -32.5, 2.4, 0, TAU); ctx.fill();
  if (F.tuch) { flaeche([[-6, -58], [6, -58], [4, -53], [0, -50], [-4, -53]], F.tuch); flaeche([[1, -53], [4, -42], [1, -43]], F.tuch); }
  // Hals & Kopf
  ctx.fillStyle = F.haut; ctx.fillRect(-2.2, -61, 4.4, 4); ctx.beginPath(); ctx.ellipse(0, -67, 7, 8, 0, 0, TAU); ctx.fill();
  // Haare
  if (F.locken) { if (F.undercut) { ctx.fillStyle = "#6A5646"; ctx.beginPath(); ctx.ellipse(-6.6, -67, 1.6, 4, 0, 0, TAU); ctx.ellipse(6.6, -67, 1.6, 4, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = F.haar; for (const [hx, hy, hr] of [[-4.5, -73, 3.4], [-1, -76, 3.8], [3.5, -75.5, 3.6], [6, -72, 3], [0, -72, 3]]) { ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.fill(); } }
  else if (F.haar) { const h = new Path2D(); h.moveTo(-8.6, -60); h.quadraticCurveTo(-10, -76, 0, -76); h.quadraticCurveTo(10, -76, 8, -62); h.lineTo(6, -62); h.quadraticCurveTo(6, -71, 0, -71); h.quadraticCurveTo(-6, -71, -6, -62); h.closePath(); ctx.fillStyle = F.haar; ctx.fill(h); if (F.strähne) { ctx.strokeStyle = F.strähne; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-5, -73); ctx.quadraticCurveTo(0, -75, 5, -72); ctx.stroke(); } }
  if (F.brille) { ctx.strokeStyle = F.brille; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(-3, -67, 2.4, 0, TAU); ctx.moveTo(5.4, -67); ctx.arc(3, -67, 2.4, 0, TAU); ctx.stroke(); }
  if (F.hut) { flaeche([[-15, -72], [15, -72], [12, -75], [-12, -75]], F.hut); const k = new Path2D(); k.moveTo(-7, -74); k.quadraticCurveTo(-7, -83, 0, -83); k.quadraticCurveTo(7, -83, 7, -74); k.closePath(); ctx.fillStyle = F.hut; ctx.fill(k); ctx.fillStyle = "#8C6A3A"; ctx.fillRect(-7, -76, 14, 1.6); }
  ctx.restore();
}
/* Wer heute in der Lichtung steht: Rita immer, Herzensmenschen nach einem gemeinsamen Eintrag (3 Tage lang) */
function figurenHeute() {
  const h = heute(), grenze = tagPlus(h, -2), dabei = [];
  for (const e of S.eintraege) if (e.tag >= grenze && e.tag <= h && e.person && FIGUREN[e.person] && !dabei.includes(e.person)) dabei.push(e.person);
  return dabei.slice(-2);
}
function huehnchenPos(ort) {
  const w = wegPunkt(.16);
  const P = { weg: [w[0], w[1]], fenster: [744, 702], tanz: [560, 692], eiche: [178, 696], quelle: [716, 796], wiese: [470, 896], horizont: [640, 900], mut: [720, 892], bank: SZ.bankPos ? [SZ.bankPos[0] + 6, SZ.bankPos[1] - 14] : [w[0] - 60, w[1] - 20] };
  return P[ort] || [560, 900];
}
/* Auto in Heck- bzw. Frontansicht, Fuß bei (x, y) */
function auto(ctx, x, y, s, farbe, nacht, heck) {
  const a = new Path2D(); rr(a, x - 20 * s, y - 13 * s, 40 * s, 11 * s, 3 * s); poly(a, [[x - 15 * s, y - 13 * s], [x - 11 * s, y - 22 * s], [x + 11 * s, y - 22 * s], [x + 15 * s, y - 13 * s]], null);
  papier(ctx, a, farbe, 1.5 * s);
  const f = new Path2D(); poly(f, [[x - 12 * s, y - 13.5 * s], [x - 9.5 * s, y - 20.5 * s], [x + 9.5 * s, y - 20.5 * s], [x + 12 * s, y - 13.5 * s]], null); ctx.fillStyle = nacht > .3 ? "#3D4450" : "rgba(214,228,236,.9)"; ctx.fill(f);
  ctx.fillStyle = "#2A2A2A"; ctx.fillRect(x - 18 * s, y - 3 * s, 7 * s, 3.5 * s); ctx.fillRect(x + 11 * s, y - 3 * s, 7 * s, 3.5 * s);
  ctx.fillStyle = heck ? "#B83A2E" : "#F1E6CF"; ctx.fillRect(x - 18 * s, y - 10 * s, 5 * s, 2.4 * s); ctx.fillRect(x + 13 * s, y - 10 * s, 5 * s, 2.4 * s);
  ctx.fillStyle = "#F4F0E2"; ctx.fillRect(x - 5 * s, y - 8 * s, 10 * s, 3 * s);
}
/* Hühnchen in der Szene: dieselbe Comic-Figur wie in der Oberfläche (Pfade aus figuren.js), Fuß bei (x, y) */
const HUHN_PFADE = [
  ["M31 83 L67 83 Q72 83 72 88 Q72 93 67 93 L31 93 Q26 93 26 88 Q26 83 31 83Z", "#5B8A47"],
  ["M30 60 Q16 50 19 34 Q26 44 38 50Z", "#C9913C"],
  ["M26 66 Q24 46 44 44 Q62 42 72 56 Q80 70 68 80 Q56 88 42 86 Q28 84 26 66Z", "#E4B24F"],
  ["M34 62 Q46 52 60 60 Q58 73 46 75 Q35 73 34 62Z", "#CC913C"],
  ["M48 46 Q42 22 60 18 Q78 15 79 32 Q80 47 66 51 Q54 53 48 46Z", "#E4B24F"],
  ["M73 45 Q78 51 73 56 Q68 52 69.5 46Z", "#D9473A"],
  ["M76 39 L88 41 L76 45Z", "#D9921C"], ["M76 30 Q86 31 93 36 Q86 39 76 40Z", "#F4B92A"]
].map(([d, c]) => [new Path2D(d), c]);
function huehnchenZeichnen(ctx, x, y, s) {
  const k = s * .62;
  ctx.save(); ctx.translate(x - 50 * k, y - 94 * k); ctx.scale(k, k);
  if (LICHT.nacht > .3) ctx.filter = `brightness(${1 - LICHT.nacht * .4})`;
  ctx.fillStyle = "rgba(20,28,24,.2)"; ctx.beginPath(); ctx.ellipse(50, 95, 26, 3.2, 0, 0, TAU); ctx.fill();
  for (const [p, c] of HUHN_PFADE) { ctx.fillStyle = c; ctx.fill(p); }
  ctx.fillStyle = "#D9473A"; ctx.beginPath(); ctx.arc(56, 16, 5, 0, TAU); ctx.arc(63, 12.5, 5.6, 0, TAU); ctx.arc(70, 15.5, 4.6, 0, TAU); ctx.fill();
  ctx.fillStyle = "#FFFDF5"; ctx.beginPath(); ctx.ellipse(65, 31, 8.5, 9.5, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#1C2620"; ctx.beginPath(); ctx.arc(68, 32, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(69.8, 29.8, 1.8, 0, TAU); ctx.fill();
  ctx.restore();
}
function sternbilder(ctx, k) {
  const B = [[[160, 90], [195, 100], [230, 98], [262, 110], [270, 145], [312, 150], [318, 118]], [[560, 70], [590, 95], [620, 78], [650, 100], [680, 80]]];
  ctx.save(); ctx.strokeStyle = `rgba(255,246,220,${.35 * k})`; ctx.lineWidth = 1; ctx.fillStyle = `rgba(255,246,220,${.95 * k})`;
  for (const b of B) { ctx.beginPath(); b.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); b.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill(); }); }
  ctx.restore();
}
function ladenDinge(ctx, M, SA, nacht, wachs) {
  const G = S.gekauft;
  if (G.traenke) { const p = new Path2D(); ellipse(p, 190, 728, 18, 5); poly(p, [[185, 728], [195, 728], [192, 746], [188, 746]], null); papier(ctx, p, "#A8A296", 2); }
  if (G.igelhaus) { const p = new Path2D(); ellipse(p, 252, 662, 24, 15); papier(ctx, p, "#8C6A3E", 2); ctx.fillStyle = "#2A221A"; ctx.beginPath(); ctx.ellipse(244, 668, 6, 5, 0, 0, TAU); ctx.fill(); }
  if (G.rosenbogen) { const [x, y, w] = wegPunkt(.3), R0 = w + 14, R1 = R0 - 7, p = new Path2D(); p.moveTo(x - R0, y); p.arc(x, y - 10, R0, Math.PI, 0); p.lineTo(x + R1, y); p.arc(x, y - 10, R1, 0, Math.PI, true); p.closePath(); papier(ctx, p, "#6E5A40", 2);
    const r = rnd("rosen"), bl = new Path2D(); for (let i = 0; i < 14; i++) { const a = Math.PI + r() * Math.PI; kreis(bl, x + Math.cos(a) * (R0 - 3), y - 10 + Math.sin(a) * (R0 - 3), 4.6); } papier(ctx, bl, "#C9563A", 1); }
  if (G.haengematte) { const pf = new Path2D(); poly(pf, [[208, 666], [209, 602], [213, 602], [214, 666]], null); papier(ctx, pf, "#6B4A32", 1.5);
    ctx.strokeStyle = "#5A4A3A"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(134, 606); ctx.quadraticCurveTo(172, 654, 211, 608); ctx.stroke(); const p = new Path2D(); p.moveTo(141, 614); p.quadraticCurveTo(172, 664, 203, 616); p.quadraticCurveTo(172, 650, 141, 614); papier(ctx, p, "#E6D3A8", 1.5); }
  if (G.rotkehlchen) { const h = jetzt().getHours(); if (h >= 5 && h < 12) { const x = 560, y = PARK.vorn - 10; const p = new Path2D(); ellipse(p, x, y, 8, 6); kreis(p, x + 7, y - 4, 4.4); papier(ctx, p, "#7A6248", 1); ctx.fillStyle = "#D9603C"; ctx.beginPath(); ctx.ellipse(x + 4, y - 1, 4.4, 4.4, 0, 0, TAU); ctx.fill(); } }
}

/* ---------- Ankunfts-Animation eines neuen Elements ---------- */
function bildMitAnkunft(canvas, neu) {
  cancelAnimationFrame(SZ.raf);
  if (!neu || REDUCED()) { zeichneSzene(canvas, {}); return; }
  const t0 = performance.now(), dauer = 1200;
  const schritt = () => {
    const t = (performance.now() - t0) / dauer;
    zeichneSzene(canvas, { neu, anim: t });
    if (t < 1) SZ.raf = requestAnimationFrame(schritt);
  };
  schritt();
}
function bildRegion(canvas, cx, cy) {
  const r = canvas.getBoundingClientRect(); const x = (cx - r.left - SZ.ox) / SZ.sk, y = (cy - r.top - SZ.oy) / SZ.sk;
  const treffer = SZ.regionen.filter(g => x >= g.x && x <= g.x + g.w && y >= g.y && y <= g.y + g.h);
  treffer.sort((a, b) => a.w * a.h - b.w * b.h);
  return treffer[0] || null;
}
/* Ring an der Stelle des neuen Elements (nach 1,8 s) */
function ringAn(container, ort) {
  const reg = SZ.regionen.find(g => g.ort === ort); if (!reg || REDUCED()) return;
  const ring = document.createElement("div"); ring.className = "ring";
  ring.style.left = (SZ.ox + (reg.x + reg.w / 2) * SZ.sk) + "px"; ring.style.top = (SZ.oy + (reg.y + reg.h / 2) * SZ.sk) + "px";
  container.appendChild(ring); setTimeout(() => ring.remove(), 2500);
  const cv = container.querySelector("canvas"); if (cv) { const r = container.getBoundingClientRect(); if (r.bottom < 60 || r.top > innerHeight - 80) container.scrollIntoView({ block: "center", behavior: "smooth" }); cv.style.transformOrigin = `${ring.style.left} ${ring.style.top}`; cv.classList.remove("zoom"); void cv.offsetWidth; cv.classList.add("zoom"); setTimeout(() => cv.classList.remove("zoom"), 2400); }
}
/* Text-Beschreibung des Bildes (für Screenreader und „Bild als Liste“) */
function bildBeschreibung(M) {
  const st = D.stufen[M.stufe]; const z = [];
  z.push(`Stufe ${M.stufe + 1}: ${st.name}.`);
  z.push("Blick von der Straße: Die Zufahrt führt zu den Häusern am Waldrand – hinten das lange Hauptgebäude mit verkleideten Balkonen, rechts ein eingeschossiger Flügel mit dem breiten Hauseingang zum Parkplatz hin, dahinter ein zweigeschossiger Flügel, dazwischen der Parkplatz mit Hecken. Ringsum Wald.");
  const pers = Object.keys(M.menschen).length; if (pers) z.push(`Die Häuser: ${pers} ${pers === 1 ? "Fenster leuchtet" : "Fenster leuchten"} für deine Herzensmenschen.`);
  const L = Math.min(M.musik + M.tanzStunden, M.stufe >= 5 ? 16 : 5);
  if (L) z.push(`Musik im Haus: ${L} ${L === 1 ? "Licht" : "Lichter"} am Balkon.`);
  if (M.leseMin) z.push(`Die Leseeiche: ${Math.round(M.leseMin)} Minuten gelesen oder gehört${M.buecher.length ? `, ${M.buecher.length} Lesezeichen am Ast` : ""}.`);
  if (M.ruhe) z.push(`Die Quelle: ${M.ruhe}-mal bewusst ausgeruht oder für dich gesorgt${M.ruhe > 8 ? " – daraus ist ein Weiher geworden" : ""}.`);
  if (M.wiese) z.push(`Die Wiese: ${Math.min(M.wiese, 70)} ${M.wiese === 1 ? "Blume" : "Blumen"}.`);
  if (M.km) z.push(`Der Weg: ${fmt(M.km)} km gegangen – der Waldweg rechts führt in den Wald.`);
  if (M.ausfluege.length) z.push(`Der Horizont: ${M.ausfluege.map(a => a.titel).join(", ")}.`);
  if (M.mut) z.push(`Glühwürmchen: ${M.mut} für Mut.`);
  if (M.baenke) z.push(`${M.baenke} Rastbank am Weg.`);
  const ent = ENTDECKEN.filter(h => S.entdeckt && S.entdeckt[h.id]);
  if (ent.length) z.push(`Entdeckt: ${ent.map(h => h.name).join(", ")}.`);
  return z;
}

/* ============================================================
   Entdecken: kleine Dinge, die unter der Lupe auftauchen,
   wenn man mit dem Finger (oder der Maus) übers Bild fährt.
   ============================================================ */
const ENTDECKEN = [
  { id: "eichhoernchen", name: "Eichhörnchen", nacht: false, anker: "eiche", x: 122, y: 520, r: 60, text: "Wer hat da geraschelt?", mal: vEichhoernchen },
  { id: "eich2", name: "Eichhörnchen in der Kiefer", nacht: "egal", anker: "eich2", x: 0, y: 0, r: 34, text: n => n ? "Psst – im Kobel schläft das Eichhörnchen, zusammengerollt unter seinem Schwanz." : "Noch eins! Das hier saust die Kiefer hoch.", mal: vEichKletter, wenn: () => !!(SZ.anker && SZ.anker.eich2) },
  { id: "uhu", name: "Uhu", nacht: true, anker: "eiche", x: 122, y: 520, r: 60, text: "Der Uhu hält Nachtwache in der Eiche.", mal: vUhu },
  { id: "nest", name: "Vogelnest", nacht: false, anker: "nest", x: 886, y: 416, r: 46, text: () => jahreszeit(jetzt()) === "winter" ? "Ein leeres Nest. Im Frühling ist hier wieder Betrieb." : "Drei Schnäbel, ein Gedanke: Hunger!", mal: vNest },
  { id: "spatzen", name: "Spatzen", nacht: false, anker: "spatzen", x: 388, y: 450, r: 46, text: "Die Spatzen halten Dachkonferenz.", mal: vSpatzen },
  { id: "katze", name: "Katze auf dem Autodach", nacht: "egal", anker: "katze", x: 606, y: 642, r: 40, text: n => n ? "Die Katze bewacht den Parkplatz." : "Das wärmste Autodach gehört der Katze.", mal: vKatze },
  { id: "igel", name: "Igel", nacht: "egal", anker: "igel", x: 304, y: 650, r: 44, text: () => jahreszeit(jetzt()) === "winter" ? "Psst – unterm Busch hält einer Winterschlaf." : "Unterm Busch schnauft einer.", mal: vIgel },
  { id: "nachbar", name: "Nachbar mit Mülltonne", nacht: false, anker: "muell", x: 868, y: 704, r: 42, text: "Der Nachbar bringt den Müll raus. In Pantoffeln.", mal: vNachbar },
  { id: "frosch", name: "Frosch", nacht: false, anker: "wasser", x: 560, y: 848, r: 50, text: "Ein Frosch sitzt am Ufer und hält ganz still.", mal: vFrosch },
  { id: "reh", name: "Reh", nacht: false, x: 940, y: 728, r: 42, text: "Ganz leise – da schaut ein Reh aus dem Wald.", mal: vReh },
  { id: "schnecke", name: "Schnecke", nacht: false, anker: "schnecke", x: 860, y: 830, r: 40, text: "Eine Schnecke geht auch spazieren. Ganz in Ruhe.", mal: vSchnecke },
  { id: "fuchs", name: "Fuchs", nacht: true, x: 940, y: 728, r: 46, text: "Ein Fuchs schnürt am Waldrand entlang.", mal: vFuchs },
  { id: "lesen", name: "Lesendes Fenster", nacht: true, anker: "lesefenster", x: 858, y: 522, r: 40, text: "Da liest noch jemand. Nur noch ein Kapitel …", mal: vLesefenster },
  { id: "mond", name: "Mond im Wasser", nacht: true, anker: "wasser", x: 560, y: 848, r: 52, text: "Der Mond schaut sich im Wasser an.", mal: vMond, wenn: () => (SZ.mondDa || 0) > 0 },
  { id: "motten", name: "Motten an der Laterne", nacht: true, anker: "laterne", x: 404, y: 644, r: 40, text: "Die Motten drehen ihre Runden ums Licht.", mal: vMotten },
  { id: "huhn", name: "Hühnchen", nacht: "egal", anker: "huhn", x: 0, y: 0, r: 34, text: n => n ? "Hühnchen hält vor der Tür Wache. Mit einem Auge." : ["Hühnchen tut so, als würde es nicht gucken.", "Hühnchen hält hier die Stellung.", "Hühnchen zählt heimlich mit, was du heute machst."][hash32("hv" + heute()) % 3], mal: vHuhn, wenn: () => !!(S.huhn && SZ.anker && SZ.anker.huhn) },
  { id: "gluehw", name: "Glühwürmchen", nacht: true, anker: "gluehw", x: 0, y: 0, r: 44, text: "Glühwürmchen funken sich was zu.", mal: vGluehw, wenn: () => !!(SZ.anker && SZ.anker.gluehw) }
];
function entdeckbar() {
  const n = LICHT.nacht > .3, A0 = SZ.anker || {};
  return ENTDECKEN.filter(h => (h.nacht === "egal" || h.nacht === n) && (!h.wenn || h.wenn()) && (!h.anker || A0[h.anker] || h.x))
    .map(h => { const a = h.anker && A0[h.anker]; return { ...h, x: a ? a[0] : h.x, y: a ? a[1] : h.y }; });
}
function entdecktZahl() { const E = S.entdeckt && typeof S.entdeckt === "object" ? S.entdeckt : {}; return ENTDECKEN.filter(h => E[h.id]).length; }
function entdecktText() {
  const n = entdecktZahl();
  return n ? `${n} von ${ENTDECKEN.length} kleinen Dingen entdeckt${n < ENTDECKEN.length ? A(" – manche zeigen sich nur nachts.", " – manche zeigen sich nur nachts.") : ". Alle gefunden!"}`
    : A("Fahr mit dem Finger übers Bild – da versteckt sich was.", "Fahren Sie mit dem Finger übers Bild – da versteckt sich was.");
}
function entdecktMerken(id) {
  if (!S.entdeckt || typeof S.entdeckt !== "object" || Array.isArray(S.entdeckt)) S.entdeckt = {};
  if (S.entdeckt[id]) return false;
  S.entdeckt[id] = heute(); speichern();
  const el = document.getElementById("entdeck-hinweis"); if (el) { el.textContent = entdecktText(); el.classList.add("gefunden"); }
  return true;
}

/* ---------- Lupe ---------- */
const LUPE = { el: null, cv: null, txt: null, id: null, start: null, timer: 0, gezogen: false };
function lupeEl() {
  if (LUPE.el && LUPE.el.isConnected) return LUPE.el;
  const el = document.createElement("div"); el.className = "lupe"; el.setAttribute("aria-hidden", "true");
  const px = Math.round(120 * Math.min(window.devicePixelRatio || 1, 3));
  el.innerHTML = `<canvas width="${px}" height="${px}"></canvas><div class="lupe-text"></div>`;
  document.body.appendChild(el); LUPE.el = el; LUPE.cv = el.querySelector("canvas"); LUPE.txt = el.querySelector(".lupe-text");
  return el;
}
function hotspotBei(canvas, cx, cy) {
  if (!SZ.sk) return null;
  const r = canvas.getBoundingClientRect(), x = (cx - r.left - SZ.ox) / SZ.sk, y = (cy - r.top - SZ.oy) / SZ.sk;
  let best = null, bd = 1e9;
  for (const h of entdeckbar()) { const d = Math.hypot(x - h.x, y - h.y); if (d * SZ.sk < Math.max(h.r * SZ.sk, 24) && d < bd) { best = h; bd = d; } }
  return best;
}
function lupePruefen(canvas, cx, cy) {
  const h = hotspotBei(canvas, cx, cy);
  if (!h) { lupeWeg(); return; }
  const el = lupeEl(), G = 120, abst = 70, vw = innerWidth;
  let lx = cx - G / 2, ly = cy - abst - G;            // oberhalb des Fingers
  if (ly < 8) { ly = Math.max(8, cy - G / 2 - 20); lx = cx + (cx < vw / 2 ? abst - 10 : -abst + 10 - G); } // oben kein Platz: seitlich
  lx = clamp(lx, 6, vw - G - 6); el.style.left = lx + "px"; el.style.top = ly + "px";
  if (h.id !== LUPE.id) {
    LUPE.id = h.id; const n = LICHT.nacht > .3;
    lupeMalen(h, n); LUPE.txt.textContent = typeof h.text === "function" ? h.text(n) : h.text;
    if (entdecktMerken(h.id)) haptik("erfolg"); else haptik("auswahl");
  }
  const tw = LUPE.txt.offsetWidth || 160; LUPE.txt.style.left = (clamp(lx + G / 2, tw / 2 + 6, vw - tw / 2 - 6) - lx) + "px";
  el.classList.add("an");
}
function lupeWeg() { if (LUPE.el) LUPE.el.classList.remove("an"); LUPE.id = null; }
function lupeMalen(h, n) {
  const c = LUPE.cv, g = c.getContext("2d"), k = c.width / 120;
  g.setTransform(k, 0, 0, k, 0, 0); g.clearRect(0, 0, 120, 120);
  g.save(); g.beginPath(); g.arc(60, 60, 60, 0, TAU); g.clip();
  try { h.mal(g, n); } catch (e) { }
  if (SZ.grainCv) { g.globalCompositeOperation = "multiply"; g.globalAlpha = .08; g.fillStyle = g.createPattern(SZ.grainCv, "repeat"); g.fillRect(0, 0, 120, 120); }
  g.restore();
}
(function lupeEreignisse() {
  if (typeof document === "undefined") return;
  const imBild = ev => ev.target && ev.target.closest ? ev.target.closest("#bild-gross") : null;
  document.addEventListener("pointerdown", ev => {
    LUPE.gezogen = false; const c = imBild(ev); if (!c) return;
    LUPE.start = { x: ev.clientX, y: ev.clientY, lx: ev.clientX, ly: ev.clientY, id: ev.pointerId, c };
    clearTimeout(LUPE.timer);
    if (ev.pointerType !== "mouse") LUPE.timer = setTimeout(() => { if (LUPE.start) { LUPE.gezogen = true; lupePruefen(LUPE.start.c, LUPE.start.lx, LUPE.start.ly); } }, 380);
  });
  document.addEventListener("pointermove", ev => {
    const s = LUPE.start;
    if (s && ev.pointerId === s.id) { s.lx = ev.clientX; s.ly = ev.clientY;
      if (!LUPE.gezogen && Math.hypot(ev.clientX - s.x, ev.clientY - s.y) > 9) LUPE.gezogen = true;
      if (LUPE.gezogen) lupePruefen(s.c, ev.clientX, ev.clientY); return; }
    if (ev.pointerType === "mouse" && !ev.buttons) { const c = imBild(ev); if (c) lupePruefen(c, ev.clientX, ev.clientY); else if (LUPE.id) lupeWeg(); }
  }, { passive: true });
  const ende = ev => { const s = LUPE.start; if (!s || ev.pointerId !== s.id) return; LUPE.start = null; clearTimeout(LUPE.timer); if (ev.pointerType !== "mouse" || LUPE.gezogen || ev.type === "pointercancel") lupeWeg(); };
  document.addEventListener("pointerup", ende); document.addEventListener("pointercancel", ende);
  // Darüberfahren öffnet kein Orts-Blatt; nur ein kurzes Antippen tut das
  document.addEventListener("click", ev => { if (!imBild(ev)) return; if (LUPE.gezogen) { ev.stopImmediatePropagation(); ev.preventDefault(); LUPE.gezogen = false; } lupeWeg(); }, true);
  document.addEventListener("contextmenu", ev => { if (imBild(ev)) ev.preventDefault(); });
  addEventListener("scroll", () => { if (LUPE.id && !LUPE.start) lupeWeg(); }, { passive: true });
})();

/* ---------- Vignetten im Scherenschnitt (120 × 120) ---------- */
function vP(g, bau, farbe, t = 1.6) { const p = new Path2D(); bau(p); if (t) { g.save(); g.translate(t * .7, t); g.fillStyle = "rgba(20,28,24,.3)"; g.fill(p); g.restore(); } g.fillStyle = farbe; g.fill(p); return p; }
function vHimmel(g, n, unten = 120) { const gr = g.createLinearGradient(0, 0, 0, unten); if (n) { gr.addColorStop(0, "#1E2F50"); gr.addColorStop(1, "#3E5682"); } else { gr.addColorStop(0, "#B7D0DC"); gr.addColorStop(1, "#EEE7D2"); } g.fillStyle = gr; g.fillRect(0, 0, 120, 120); }
function vSterne(g) { const r = mulberry32(7); g.fillStyle = "rgba(255,246,220,.85)"; for (let i = 0; i < 22; i++) { g.beginPath(); g.arc(r() * 120, r() * 70, .6 + r() * .9, 0, TAU); g.fill(); } }
function vMondScheibe(g, x, y, r) { g.fillStyle = "rgba(244,237,214,.25)"; g.beginPath(); g.arc(x, y, r * 1.7, 0, TAU); g.fill(); vP(g, p => kreis(p, x, y, r), "#F4EDD6", 0); }
function vLaub(n) { const SA = SZ.SA || SAISON.sommer; const l = SA.laub || ["#8A7A5E", "#9A8A6A", "#7A6A50"]; return n ? l.map(c => mix(c, "#1E2F50", .55)) : l; }
function vBoden(g, farbe, y = 96) { vP(g, p => { p.moveTo(0, y); for (let x = 0; x <= 120; x += 20) p.lineTo(x, y - 3 + Math.sin(x / 13) * 3); p.lineTo(120, 120); p.lineTo(0, 120); p.closePath(); }, farbe, 0); }
function vGras(g, farbe, y = 120, n = 26, h = 22) { const r = mulberry32(3); vP(g, p => { for (let i = 0; i < n; i++) { const x = r() * 124 - 2, hh = h * (.5 + r() * .7), b = (r() - .5) * 10; poly(p, [[x - 2, y], [x + b, y - hh], [x + 2, y]], null); } }, farbe, 1); }

function vEichhoernchen(g) {
  const L = vLaub(false); vHimmel(g, false);
  const r = mulberry32(11); vP(g, p => { for (let i = 0; i < 9; i++) fetzen(p, r() * 120, r() * 70, 18 + r() * 10, 13 + r() * 8, r, 11); }, L[0], 2);
  vP(g, p => poly(p, [[-4, 96], [124, 82], [124, 92], [-4, 106]], null), "#5E4632", 2);
  vP(g, p => { ellipse(p, 42, 56, 14, 28, -.35); ellipse(p, 36, 30, 11, 12); }, "#B5622E", 2);
  vP(g, p => { ellipse(p, 62, 76, 13, 16); kreis(p, 70, 52, 10); poly(p, [[64, 46], [66, 33], [71, 43]], null); poly(p, [[72, 44], [77, 33], [79, 46]], null); ellipse(p, 79, 55, 5, 4); }, "#A85A2A", 2);
  vP(g, p => ellipse(p, 66, 80, 7, 10), "#E8D2AE", 0);
  vP(g, p => { kreis(p, 76, 66, 4.6); }, "#7A5230", 1); vP(g, p => ellipse(p, 76, 62.5, 4.8, 2), "#5A3E22", 0);
  g.fillStyle = "#1C1A16"; g.beginPath(); g.arc(73.5, 50, 2, 0, TAU); g.arc(83.5, 54, 1.2, 0, TAU); g.fill(); g.fillStyle = "#fff"; g.fillRect(74, 48.6, 1, 1);
  vP(g, p => { fetzen(p, 102, 104, 26, 16, r, 11); fetzen(p, 14, 112, 24, 14, r, 11); fetzen(p, 108, 18, 20, 13, r, 11); }, L[2] || L[1], 2);
}
function vUhu(g) {
  vHimmel(g, true); vSterne(g); vMondScheibe(g, 94, 24, 11);
  vP(g, p => poly(p, [[-4, 98], [124, 90], [124, 99], [-4, 107]], null), "#2E241C", 2);
  vP(g, p => { ellipse(p, 58, 72, 21, 27); ellipse(p, 58, 44, 18, 15); poly(p, [[44, 38], [40, 22], [51, 33]], null); poly(p, [[72, 38], [76, 22], [65, 33]], null); }, "#6E5840", 2);
  vP(g, p => ellipse(p, 58, 80, 12, 17), "#9C845E", 0);
  g.strokeStyle = "#5A4630"; g.lineWidth = 1.2; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(52, 70 + k * 6); g.lineTo(58, 74 + k * 6); g.lineTo(64, 70 + k * 6); g.stroke(); }
  vP(g, p => { kreis(p, 50, 45, 8.5); kreis(p, 66, 45, 8.5); }, "#B39A72", 0);
  vP(g, p => { kreis(p, 50, 45, 5.4); kreis(p, 66, 45, 5.4); }, "#F2A33A", 0);
  g.fillStyle = "#16120E"; g.beginPath(); g.arc(50, 45, 2.6, 0, TAU); g.arc(66, 45, 2.6, 0, TAU); g.fill(); g.fillStyle = "#fff"; g.fillRect(50.5, 43.3, 1.2, 1.2); g.fillRect(66.5, 43.3, 1.2, 1.2);
  vP(g, p => poly(p, [[55, 51], [61, 51], [58, 57]], null), "#3A2E22", 0);
  vP(g, p => { for (const fx of [50, 62]) for (let k = 0; k < 3; k++) ellipse(p, fx + k * 3, 98, 1.6, 3); }, "#C9A23A", 0);
}
function vNest(g, n) {
  vHimmel(g, false);
  vP(g, p => poly(p, [[124, 66], [30, 82], [30, 88], [124, 76]], null), "#5E4334", 2);
  const r = mulberry32(5); vP(g, p => { for (let i = 0; i < 6; i++) fetzen(p, 70 + r() * 60, 30 + r() * 30, 18, 8, r, 15); }, "#3A5A41", 2);
  const winter = jahreszeit(jetzt()) === "winter";
  if (!winter) { vP(g, p => { for (const [x, y] of [[44, 64], [58, 59], [72, 64]]) kreis(p, x, y, 7); }, "#8A7A66", 1);
    vP(g, p => { for (const [x, y] of [[44, 64], [58, 59], [72, 64]]) poly(p, [[x - 4, y - 5], [x, y - 17], [x + 4, y - 5]], null); }, "#F2C33A", 0);
    g.fillStyle = "#1C1A16"; for (const [x, y] of [[44, 64], [58, 59], [72, 64]]) { g.beginPath(); g.arc(x + 3, y - 2, 1.2, 0, TAU); g.fill(); }
    vP(g, p => { ellipse(p, 96, 34, 11, 7, -.3); kreis(p, 86, 30, 5.5); poly(p, [[96, 30], [116, 14], [104, 36]], null); poly(p, [[80, 29], [74, 31], [80, 32]], null); }, "#6A5A48", 2);
    g.strokeStyle = "#C9563A"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(75, 31); g.quadraticCurveTo(72, 36, 76, 38); g.stroke(); }
  vP(g, p => { ellipse(p, 58, 76, 30, 13); }, "#7A5A3A", 2);
  g.strokeStyle = "#5A3E22"; g.lineWidth = 1; for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(30 + k * 6, 70 + (k % 3) * 3); g.lineTo(38 + k * 6, 82 - (k % 2) * 4); g.stroke(); }
}
function vSpatzen(g) {
  vHimmel(g, false); vP(g, p => { rr(p, -4, 74, 128, 50, 0); }, "#D8CDB6", 0); vP(g, p => rr(p, -4, 66, 128, 12, 0), "#6F6A62", 2);
  const spatz = (x, y, s, kopf) => { vP(g, p => { ellipse(p, x, y, 11 * s, 8 * s); poly(p, [[x - 8 * s, y - 2 * s], [x - 22 * s, y + 2 * s], [x - 8 * s, y + 5 * s]], null); kreis(p, x + kopf * 9 * s, y - 8 * s, 6.5 * s); }, "#8A6A4A", 2);
    vP(g, p => ellipse(p, x + kopf * 9 * s, y - 12 * s, 5 * s, 2.6 * s), "#7A7A78", 0); vP(g, p => ellipse(p, x + kopf * 10 * s, y - 6 * s, 3.5 * s, 2.6 * s), "#F1E6CF", 0);
    vP(g, p => poly(p, [[x + kopf * 14 * s, y - 9 * s], [x + kopf * 19 * s, y - 7.5 * s], [x + kopf * 14 * s, y - 6 * s]], null), "#3A2E22", 0);
    g.fillStyle = "#1C1A16"; g.beginPath(); g.arc(x + kopf * 11 * s, y - 9 * s, 1.2, 0, TAU); g.fill();
    g.strokeStyle = "#3A2E22"; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 2, y + 8 * s); g.lineTo(x - 2, y + 12 * s); g.moveTo(x + 3, y + 8 * s); g.lineTo(x + 3, y + 12 * s); g.stroke(); };
  spatz(28, 56, 1, 1); spatz(64, 52, 1.1, -1); spatz(96, 56, .95, -1);
}
function vEichKletter(g, n) {
  if (n) { vHimmel(g, true); vSterne(g); vP(g, p => { rr(p, 58, -10, 34, 140, 6); }, "#3E2C20", 2);
    vP(g, p => { ellipse(p, 60, 66, 30, 22); }, "#4A3A2C", 2);
    g.strokeStyle = "rgba(0,0,0,.3)"; g.lineWidth = 2; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(34 + i * 8, 52); g.lineTo(38 + i * 7, 82); g.stroke(); }
    vP(g, p => { ellipse(p, 60, 70, 15, 10); }, "#8E4A24", 0); vP(g, p => { p.moveTo(46, 72); p.quadraticCurveTo(52, 52, 74, 62); p.quadraticCurveTo(64, 70, 50, 76); p.closePath(); }, "#A8562A", 0);
    g.strokeStyle = "#1C2620"; g.lineWidth = 1.4; g.beginPath(); g.arc(66, 70, 2, 0, Math.PI); g.stroke();
    g.fillStyle = "rgba(255,246,220,.85)"; g.font = "bold 13px Nunito, sans-serif"; g.fillText("z", 80, 52); g.font = "bold 10px Nunito, sans-serif"; g.fillText("z", 88, 42); return; }
  vHimmel(g, false); vP(g, p => { rr(p, 58, -10, 34, 140, 6); }, "#5B3B2A", 2);
  for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 2; g.beginPath(); g.moveTo(62, 8 + i * 20); g.lineTo(86, 14 + i * 20); g.stroke(); }
  g.save(); g.translate(64, 66); g.rotate(-.1);
  vP(g, p => { p.moveTo(6, 22); p.quadraticCurveTo(-30, 44, -24, 6); p.quadraticCurveTo(-20, -10, -8, 8); p.closePath(); }, "#B5652B", 2);
  vP(g, p => { ellipse(p, 0, 4, 11, 20); ellipse(p, -1, -20, 9, 8.5); poly(p, [[-7, -26], [-6, -36], [-2, -27]], null); poly(p, [[3, -27], [5, -36], [7, -25]], null); }, "#A8562A", 2);
  g.fillStyle = "#EAD3B0"; g.beginPath(); g.ellipse(4, 6, 4, 10, 0, 0, TAU); g.fill();
  g.fillStyle = "#1C2620"; g.beginPath(); g.arc(3, -22, 1.8, 0, TAU); g.fill();
  g.fillStyle = "#3A2A20"; g.beginPath(); g.arc(8, -18, 1.4, 0, TAU); g.fill(); g.restore();
}
function vHuhn(g, n) {
  vHimmel(g, n); if (n) vSterne(g);
  vBoden(g, n ? "#2E3A2C" : "#9BB36A", 98); vGras(g, n ? "#26331F" : "#7E9A4E", 122, 18, 14);
  huehnchenZeichnen(g, 60, 116, 1.55);
}
function vKatze(g, n) {
  vHimmel(g, n); if (n) vSterne(g);
  vP(g, p => { rr(p, -10, 70, 140, 60, 20); }, n ? "#7A3A36" : "#B5534A", 2);
  vP(g, p => poly(p, [[6, 74], [22, 92], [98, 92], [114, 74]], null), n ? "#2D3440" : "rgba(214,228,236,.95)", 0);
  const fell = n ? "#24201C" : "#D08A3E";
  if (n) { vP(g, p => { ellipse(p, 60, 60, 13, 12); ellipse(p, 60, 40, 10, 9); poly(p, [[51, 36], [52, 24], [58, 33]], null); poly(p, [[69, 36], [68, 24], [62, 33]], null); }, fell, 2);
    g.strokeStyle = fell; g.lineWidth = 3.5; g.lineCap = "round"; g.beginPath(); g.moveTo(70, 68); g.quadraticCurveTo(88, 70, 86, 50); g.stroke();
    g.fillStyle = "#E8E07A"; g.beginPath(); g.ellipse(56, 40, 2.4, 1.6, 0, 0, TAU); g.ellipse(64, 40, 2.4, 1.6, 0, 0, TAU); g.fill(); }
  else { vP(g, p => { ellipse(p, 60, 62, 24, 10); kreis(p, 78, 58, 9); poly(p, [[72, 52], [73, 43], [79, 50]], null); poly(p, [[80, 50], [86, 43], [86, 53]], null); }, fell, 2);
    g.strokeStyle = fell; g.lineWidth = 4.5; g.lineCap = "round"; g.beginPath(); g.moveTo(38, 64); g.quadraticCurveTo(34, 74, 58, 72); g.stroke();
    g.strokeStyle = "#A8662A"; g.lineWidth = 1.6; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(46 + k * 7, 54); g.lineTo(44 + k * 7, 62); g.stroke(); }
    g.strokeStyle = "#3A2A1A"; g.lineWidth = 1.1; g.beginPath(); g.moveTo(75, 57); g.quadraticCurveTo(77, 59, 79, 57); g.moveTo(81, 57); g.quadraticCurveTo(83, 59, 85, 57); g.stroke(); }
}
function vIgel(g, n) {
  vHimmel(g, n); vBoden(g, n ? "#3A3A2A" : "#A99A6A", 84);
  const L = vLaub(n), r = mulberry32(9); vP(g, p => { for (let i = 0; i < 7; i++) fetzen(p, 10 + i * 17, 28 + r() * 16, 22, 20, r, 11); }, n ? "#2E4436" : "#4E6B40", 2);
  vP(g, p => { const cx = 56, cy = 88; p.moveTo(cx - 32, cy); for (let i = 0; i <= 18; i++) { const a = Math.PI + i / 18 * Math.PI, R0 = i % 2 ? 26 : 33; p.lineTo(cx + Math.cos(a) * R0 * 1.15, cy + Math.sin(a) * R0 * .8); } p.closePath(); }, n ? "#3A3028" : "#5A4632", 2);
  vP(g, p => { poly(p, [[80, 76], [100, 84], [80, 90]], null); ellipse(p, 82, 84, 7, 6); }, n ? "#7A6248" : "#C9A27E", 1);
  g.fillStyle = "#1C1A16"; g.beginPath(); g.arc(100, 84, 2.2, 0, TAU); g.arc(86, 80, 1.5, 0, TAU); g.fill();
  vP(g, p => { for (const [x, y, a] of [[48, 66, .4], [64, 70, -.3], [34, 76, .9]]) ellipse(p, x, y, 6, 3, a); }, L[0], 1);
  if (jahreszeit(jetzt()) === "winter") { g.strokeStyle = "#1C1A16"; g.lineWidth = 1; g.beginPath(); g.moveTo(84, 79); g.lineTo(88, 79); g.stroke(); g.fillStyle = "rgba(255,255,255,.8)"; g.font = "bold 10px sans-serif"; g.fillText("z", 96, 66); g.fillText("z", 103, 58); }
}
function vNachbar(g) {
  vP(g, p => rr(p, 0, 0, 120, 120, 0), "#CBBFA6", 0); vP(g, p => rr(p, 64, 18, 34, 84, 2), "#6B4A32", 1); g.fillStyle = "rgba(220,232,240,.55)"; g.fillRect(70, 26, 22, 18);
  vBoden(g, "#9C9A92", 102);
  vP(g, p => { rr(p, 8, 64, 24, 38, 3); }, "#6E7470", 2); vP(g, p => rr(p, 6, 60, 28, 6, 2), "#4E5450", 1);
  vP(g, p => { rr(p, 40, 62, 24, 40, 3); }, "#3E5A78", 2); vP(g, p => rr(p, 38, 58, 28, 6, 2), "#2E4660", 1);
  vP(g, p => { ellipse(p, 36, 104, 3, 3); ellipse(p, 62, 104, 3, 3); }, "#222", 0);
  // Nachbar im Strickjacken-Look, Pantoffeln
  vP(g, p => { poly(p, [[84, 104], [86, 78], [100, 78], [102, 104], [96, 104], [93, 86], [90, 104]], null); }, "#4A4A52", 2);
  vP(g, p => { poly(p, [[82, 80], [80, 54], [86, 48], [100, 48], [106, 54], [104, 80]], null); poly(p, [[82, 56], [62, 62], [62, 66], [84, 62]], null); }, "#8A6A48", 2);
  vP(g, p => { kreis(p, 93, 39, 8); kreis(p, 62, 63.5, 2.6); }, "#E6B593", 1); vP(g, p => { ellipse(p, 93, 33, 8, 3.4); }, "#B9AB8E", 0);
  vP(g, p => { ellipse(p, 88, 106, 6, 2.4); ellipse(p, 100, 106, 6, 2.4); }, "#9A3A2A", 0);
}
function vFrosch(g) {
  vHimmel(g, false); vP(g, p => rr(p, -4, 60, 128, 64, 0), mix("#7FA7B5", "#A8C6D6", .3), 0);
  g.fillStyle = "rgba(255,255,255,.45)"; g.fillRect(10, 76, 40, 2); g.fillRect(70, 90, 36, 2);
  vP(g, p => ellipse(p, 60, 86, 40, 10), "#5F8A4E", 2);
  vP(g, p => { ellipse(p, 60, 72, 20, 13); ellipse(p, 46, 82, 8, 4); ellipse(p, 74, 82, 8, 4); kreis(p, 51, 59, 6); kreis(p, 69, 59, 6); }, "#6E9A3E", 2);
  vP(g, p => ellipse(p, 60, 76, 12, 6), "#C9D88A", 0);
  vP(g, p => { kreis(p, 51, 59, 3.8); kreis(p, 69, 59, 3.8); }, "#F2D27A", 0);
  g.fillStyle = "#1C1A16"; g.beginPath(); g.ellipse(51, 59, 2.6, 1.4, 0, 0, TAU); g.ellipse(69, 59, 2.6, 1.4, 0, 0, TAU); g.fill();
  g.strokeStyle = "#3A5A2A"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(52, 70); g.quadraticCurveTo(60, 74, 68, 70); g.stroke();
  vGras(g, "#4E6B3E", 122, 10, 40);
}
function vReh(g) {
  vHimmel(g, false); vBoden(g, "#8F9E6E", 92);
  vP(g, p => { rr(p, 2, -4, 14, 110, 0); rr(p, 100, -4, 16, 110, 0); }, "#5B3B2A", 2);
  vP(g, p => { ellipse(p, 54, 72, 25, 13); poly(p, [[70, 66], [78, 42], [86, 44], [80, 70]], null); ellipse(p, 86, 40, 11, 7, .3); poly(p, [[80, 36], [76, 22], [84, 32]], null); poly(p, [[86, 34], [90, 20], [92, 33]], null);
    for (const lx of [36, 44, 64, 72]) rr(p, lx, 78, 3.4, 20, 1); }, "#A8703F", 2);
  vP(g, p => ellipse(p, 31, 66, 5, 6), "#F1E6CF", 0);
  g.fillStyle = "#1C1A16"; g.beginPath(); g.arc(87, 38, 1.8, 0, TAU); g.arc(96, 43, 1.8, 0, TAU); g.fill();
  vP(g, p => rr(p, 28, -4, 12, 110, 0), "#4A3022", 2);
  vGras(g, "#5D8A4E", 122, 20, 26);
}
function vFuchs(g) {
  vHimmel(g, true); vSterne(g); vMondScheibe(g, 24, 22, 9); vBoden(g, "#2E3A30", 90);
  vP(g, p => { rr(p, 96, -4, 14, 110, 0); rr(p, 70, -4, 8, 100, 0); }, "#1E2620", 2);
  vP(g, p => { p.moveTo(36, 72); p.quadraticCurveTo(6, 64, 10, 92); p.quadraticCurveTo(20, 80, 38, 80); p.closePath(); }, "#B85A28", 2);
  vP(g, p => ellipse(p, 11, 90, 5, 4), "#F1E6CF", 0);
  vP(g, p => { ellipse(p, 56, 76, 22, 10); poly(p, [[72, 70], [92, 62], [104, 72], [86, 80]], null); poly(p, [[86, 64], [88, 50], [94, 62]], null); poly(p, [[92, 63], [98, 51], [100, 65]], null);
    for (const lx of [40, 48, 64, 70]) rr(p, lx, 82, 3, 14, 1); }, "#C8662E", 2);
  vP(g, p => poly(p, [[90, 74], [104, 72], [92, 80]], null), "#F1E6CF", 0);
  g.fillStyle = "#F2E07A"; g.beginPath(); g.arc(92, 68, 1.6, 0, TAU); g.fill(); g.fillStyle = "#16120E"; g.beginPath(); g.arc(104, 72, 1.6, 0, TAU); g.fill();
  vGras(g, "#1E2A20", 122, 22, 22);
}
function vSchnecke(g) {
  vP(g, p => rr(p, 0, 0, 120, 120, 0), "#E3D2AE", 0); const r = mulberry32(21);
  vP(g, p => { for (let i = 0; i < 9; i++) ellipse(p, r() * 120, 20 + r() * 90, 3 + r() * 4, 2 + r() * 2); }, "#B8A888", 1);
  g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 92); g.quadraticCurveTo(30, 88, 48, 86); g.stroke();
  vP(g, p => { p.moveTo(40, 88); p.quadraticCurveTo(60, 80, 86, 84); p.quadraticCurveTo(96, 80, 96, 72); p.lineTo(100, 72); p.quadraticCurveTo(102, 86, 90, 90); p.quadraticCurveTo(64, 94, 40, 92); p.closePath(); }, "#B79A74", 2);
  g.strokeStyle = "#8A7050"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(94, 74); g.lineTo(90, 58); g.moveTo(98, 74); g.lineTo(102, 58); g.stroke();
  g.fillStyle = "#3A2E22"; g.beginPath(); g.arc(90, 57, 2, 0, TAU); g.arc(102, 57, 2, 0, TAU); g.fill();
  vP(g, p => kreis(p, 64, 66, 19), "#A0703F", 2);
  g.strokeStyle = "#6B4A2E"; g.lineWidth = 2; g.beginPath(); for (let a = 0; a < 14; a += .2) { const rr0 = 17 - a * 1.15, x = 64 + Math.cos(a) * rr0, y = 66 + Math.sin(a) * rr0; a ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  vGras(g, "#5D8A4E", 122, 8, 20);
}
function vLesefenster(g) {
  vP(g, p => rr(p, 0, 0, 120, 120, 0), "#343B4E", 0);
  const gr = g.createRadialGradient(56, 64, 4, 60, 60, 60); gr.addColorStop(0, "#FFE3A0"); gr.addColorStop(1, "#E2A94B");
  g.fillStyle = gr; g.fillRect(20, 16, 80, 86);
  vP(g, p => { poly(p, [[20, 16], [36, 16], [30, 102], [20, 102]], null); poly(p, [[100, 16], [86, 16], [92, 102], [100, 102]], null); }, "#B5532F", 0);
  vP(g, p => { rr(p, 36, 66, 40, 36, 8); }, "#7A3A2A", 0);
  vP(g, p => { kreis(p, 56, 46, 9); ellipse(p, 56, 72, 16, 15); poly(p, [[52, 36], [58, 33], [64, 40]], null); }, "#3A2E26", 0);
  vP(g, p => { poly(p, [[62, 66], [76, 60], [78, 70], [64, 74]], null); }, "#F4EDD6", 1);
  g.strokeStyle = "#C9B78E"; g.lineWidth = .8; g.beginPath(); g.moveTo(70, 62); g.lineTo(71, 72); g.stroke();
  vP(g, p => { rr(p, 16, 12, 88, 6, 0); rr(p, 16, 100, 88, 7, 0); rr(p, 58, 16, 4, 86, 0); }, "#C8BCA2", 1);
  g.fillStyle = "rgba(255,240,200,.18)"; g.fillRect(0, 0, 120, 120);
}
function vMond(g) {
  vHimmel(g, true, 60); vSterne(g); vMondScheibe(g, 60, 26, 13);
  vP(g, p => rr(p, -4, 62, 128, 62, 0), "#22385A", 0);
  g.fillStyle = "rgba(244,237,214,.8)"; for (let k = 0; k < 7; k++) { const w = 24 - k * 3 + (k % 2) * 4; g.fillRect(60 - w / 2 + (k % 2 ? 3 : -2), 70 + k * 6, w, 2.4); }
  vP(g, p => { for (const [x, h] of [[8, 58], [16, 46], [22, 52], [104, 50], [112, 60]]) { rr(p, x, 120 - h, 2.4, h, 1); ellipse(p, x + 1.2, 120 - h, 3, 8); } }, "#162236", 1);
}
function vMotten(g) {
  vHimmel(g, true); vSterne(g);
  const gr = g.createRadialGradient(60, 40, 2, 60, 40, 56); gr.addColorStop(0, "rgba(255,227,160,.9)"); gr.addColorStop(1, "rgba(255,227,160,0)"); g.fillStyle = gr; g.fillRect(0, 0, 120, 120);
  vP(g, p => { rr(p, 57, 44, 6, 80, 1); poly(p, [[44, 40], [76, 40], [68, 28], [52, 28]], null); }, "#2E2E2C", 2);
  g.fillStyle = "#FFE3A0"; g.fillRect(48, 40, 24, 5);
  const r = mulberry32(17); vP(g, p => { for (let i = 0; i < 7; i++) { const a = r() * TAU, d = 22 + r() * 22, x = 60 + Math.cos(a) * d, y = 46 + Math.sin(a) * d * .7, s = 3 + r() * 2; poly(p, [[x, y], [x - s * 1.6, y - s], [x - s * 1.2, y + s * .6]], null); poly(p, [[x, y], [x + s * 1.6, y - s], [x + s * 1.2, y + s * .6]], null); } }, "#E8DCC0", 1);
}
function vGluehw(g) {
  vHimmel(g, true); vSterne(g);
  const r = mulberry32(29);
  for (let i = 0; i < 11; i++) { const x = 10 + r() * 100, y = 30 + r() * 64, rad = 10 + r() * 8;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, "rgba(255,224,138,.9)"); gr.addColorStop(1, "rgba(255,224,138,0)"); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    g.fillStyle = "#FFF2B8"; g.beginPath(); g.arc(x, y, 2, 0, TAU); g.fill(); }
  vGras(g, "#16261C", 122, 34, 46);
}
