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
const SZ = { canvas: null, ctx: null, dpr: 1, w: 0, h: 0, neu: null, animStart: 0, regionen: [], grain: null, raf: 0 };

function grainPattern(ctx) {
  if (SZ.grain) return SZ.grain;
  const c = document.createElement("canvas"); c.width = c.height = 160; const g = c.getContext("2d");
  const r = mulberry32(4711), img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - .5) * 60; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  g.globalAlpha = .1; g.strokeStyle = "#4a3a20"; g.lineWidth = .8;
  for (let k = 0; k < 160; k++) { const x = r() * 160, y = r() * 160, a = r() * Math.PI, l = 5 + r() * 14; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l / 2 + r() * 3, y + Math.sin(a) * l / 2 + r() * 3, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  SZ.grain = ctx.createPattern(c, "repeat");
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
  SZ.regionen = [];

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
    const ph = mondPhase(d), mx = 780, my = 120, mr = 26;
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

  // ===== Hochsitz (Stufe 8) =====
  if (st >= 8) { const p = new Path2D(), x = 650, y = 560, g = wachs("stufe:8") * .72;
    ctx.save(); ctx.translate(x, y); ctx.scale(g, g); ctx.translate(-x, -y);
    poly(p, [[x - 26, y], [x - 20, y - 120], [x - 16, y - 120], [x - 20, y]], null); poly(p, [[x + 26, y], [x + 20, y - 120], [x + 16, y - 120], [x + 22, y]], null);
    poly(p, [[x - 30, y - 118], [x + 30, y - 118], [x + 30, y - 150], [x - 30, y - 150]], null);
    poly(p, [[x - 36, y - 150], [x, y - 172], [x + 36, y - 150]], null);
    for (let k = 1; k < 5; k++) poly(p, [[x - 22, y - k * 24], [x + 22, y - k * 24], [x + 22, y - k * 24 - 4], [x - 22, y - k * 24 - 4]], null);
    papier(ctx, p, "#7B5A3E", 3, { saum: true }); ctx.restore();
    SZ.regionen.push({ ort: "hochsitz", x: 620, y: 430, w: 60, h: 135 }); }

  // ===== Birken (Stufe 9) =====
  if (st >= 9) { const r = R("birken"), g = wachs("stufe:9");
    for (let i = 0; i < 3; i++) { const x = 290 + i * 34, y = 590 + i * 6, h = (190 + r() * 40) * g;
      if (SA.laub) krone(ctx, x, y - h * .82, 40, 7, r, mix(SA.laub[1], "#E4DC8A", saison === "herbst" ? .6 : .2), 2);
      const p = new Path2D(); poly(p, [[x - 5, y], [x - 3, y - h * .9], [x + 3, y - h * .9], [x + 5, y]], r, .4); papier(ctx, p, "#EDEAE0", 2);
      ctx.fillStyle = "#2B2B28"; for (let k = 0; k < 6; k++) ctx.fillRect(x - 4, y - 20 - k * h * .13 - r() * 10, 5 + r() * 3, 2.5);
      if (!SA.laub) aeste(ctx, x, y - h * .85, h, r, "#5C4B3A", 2); } }

  // ===== Haus am Waldsaum mit Fenstern (Menschen) =====
  { const x = 725, y = 652, HK = 1.42;
    ctx.save(); ctx.translate(x, y); ctx.scale(HK, HK); ctx.translate(-x, -y);
    // hintere Flachbauten (heller, weiter weg)
    const hinten = [[620, 592, 64, 58], [990, 600, 58, 72]];
    for (const [hx, hy, hw, hh] of hinten) { const p = new Path2D(); poly(p, [[hx - hw, hy], [hx - hw, hy - hh], [hx + hw, hy - hh], [hx + hw, hy]], R("hinten" + hx), .4); papier(ctx, p, mix("#D8CDB6", unten, .28), 3, { saum: true });
      const d = new Path2D(); poly(d, [[hx - hw - 5, hy - hh + 4], [hx - hw - 5, hy - hh - 3], [hx + hw + 5, hy - hh - 3], [hx + hw + 5, hy - hh + 4]], null); papier(ctx, d, mix("#6F6A62", unten, .3), 1);
      for (let k = 0; k < Math.floor(hw / 22); k++) for (const ry of [-hh * .62, -hh * .28]) { const fx = hx - hw + 18 + k * 44; ctx.fillStyle = nacht > .3 && hash32("hf" + hx + k + ry) % 3 ? "#E9C77A" : mix("#4A5260", unten, .3); ctx.fillRect(fx, hy + ry - 7, 16, 14); } }
    // Hauptbau: Ritas Haus – flach, zwei Geschosse
    const p = new Path2D(); poly(p, [[x - 130, y], [x - 130, y - 92], [x + 130, y - 92], [x + 130, y]], R("haus"), .5);
    papier(ctx, p, "#D8CDB6", 4, { saum: true });
    const band = new Path2D(); poly(band, [[x - 130, y - 48], [x + 130, y - 48], [x + 130, y - 44], [x - 130, y - 44]], null); ctx.fillStyle = "rgba(90,80,60,.18)"; ctx.fill(band);
    const dach = new Path2D(); poly(dach, [[x - 138, y - 88], [x - 138, y - 98], [x + 138, y - 98], [x + 138, y - 88]], null); papier(ctx, dach, "#6F6A62", 3, { saum: true });
    // Eingang mit Vordach
    const tuer = new Path2D(); rr(tuer, x - 13, y - 38, 26, 38, 2); papier(ctx, tuer, "#6B4A32", 1);
    const vd = new Path2D(); poly(vd, [[x - 24, y - 42], [x + 24, y - 42], [x + 24, y - 38], [x - 24, y - 38]], null); papier(ctx, vd, "#6F6A62", 1);
    // Fenster: oben 5, unten 4 (Mitte ist der Eingang)
    const plaetze = [[-104, -70], [-52, -70], [0, -70], [52, -70], [104, -70], [-104, -24], [-52, -24], [52, -24], [104, -24]];
    const RITA = 3; // Ritas Fenster mit Balkon (oben, zweites von rechts)
    const pers = S.menschen.map(m => m.id);
    const zahl = Object.keys(M.menschen); const sortiert = pers.concat(zahl.filter(z => !pers.includes(z) && z !== "_"));
    const frei = plaetze.map((_, i) => i).filter(i => i !== RITA);
    plaetze.forEach(([dx, dy], i) => {
      const fw = 30, fh = 24, f = new Path2D(); rr(f, x + dx - fw / 2, y + dy - fh / 2, fw, fh, 2);
      const idx = frei.indexOf(i), id = i === RITA ? "rita" : sortiert[idx];
      const mensch = S.menschen.find(m => m.id === id), g = wachs("fenster:" + id);
      const dabei = i === RITA || !!mensch || (id && M.menschen[id] > 0);
      const lichtF = mix("#F2C36B", mensch ? mensch.farbe : "#F2C36B", .18);
      ctx.fillStyle = dabei ? mix("#3D4450", lichtF, .85 * g) : "#4A5260"; ctx.fill(f);
      if (dabei && (nacht > .3 || gold > .4)) fensterLicht(ctx, x + dx, y + dy, Math.max(nacht, gold * .6) * .8);
      ctx.fillStyle = "#D8CDB6"; ctx.fillRect(x + dx - 1, y + dy - fh / 2, 2, fh);
    });
    // Ritas Balkon mit Pflänzchen (wachsen mit „Pflanzen versorgt“)
    { const [dx, dy] = plaetze[RITA], bx = x + dx, by = y + dy + 16;
      const pfl = Math.min(S.eintraege.filter(e => e.t === "pflanzen").length, 6);
      const topf = new Path2D(), gruen = new Path2D(), bl = new Path2D();
      for (let k = 0; k < 2 + Math.min(pfl, 3); k++) { const tx = bx - 20 + k * 10; rr(topf, tx - 3.5, by - 9, 7, 7, 1); fetzen(gruen, tx, by - 13, 5 + Math.min(pfl, 5) * .6, 5 + Math.min(pfl, 5) * .9, rnd("bal" + k), 9); if (pfl > k && SA.laub) kreis(bl, tx + 1, by - 16, 1.8); }
      papier(ctx, gruen, "#5F8A4E", 0); papier(ctx, bl, SA.blume[1] === "#F4F0E2" ? "#D9603C" : SA.blume[1], 0); papier(ctx, topf, "#A35A3A", 0);
      const bal = new Path2D(); poly(bal, [[bx - 26, by], [bx + 26, by], [bx + 26, by + 4], [bx - 26, by + 4]], null);
      for (let k = 0; k < 7; k++) poly(bal, [[bx - 25 + k * 8, by], [bx - 24 + k * 8, by - 10], [bx - 23 + k * 8, by - 10], [bx - 22 + k * 8, by]], null);
      poly(bal, [[bx - 26, by - 11], [bx + 26, by - 11], [bx + 26, by - 9], [bx - 26, by - 9]], null);
      papier(ctx, bal, "#5A5650", 1); }
    // Blumenkästen: wachsen mit allen Begegnungen zusammen (nie pro Person)
    { const ges = Object.values(M.menschen).reduce((a, b) => a + b, 0), k = Math.min(Math.ceil(ges / 3), 8);
      const kasten = new Path2D(), bl = new Path2D();
      const kp = plaetze.filter((_, i) => i !== RITA && plaetze[i][1] > -50); for (let i = 0; i < Math.min(k, kp.length); i++) { const [dx, dy] = kp[i]; rr(kasten, x + dx - 15, y + dy + 13, 30, 6, 1); for (let j = 0; j < 4; j++) kreis(bl, x + dx - 11 + j * 7, y + dy + 11 - (j % 2) * 2, 3.4); }
      if (k) { papier(ctx, kasten, "#7A5A3E", 1); papier(ctx, bl, SA.blume[1] === "#F4F0E2" ? "#D9603C" : SA.blume[1], 0); } }
    SZ.regionen.push({ ort: "fenster", x: x - 140 * HK, y: y - 100 * HK, w: 280 * HK, h: 105 * HK });
    // Garten am Haus (Stufe 6)
    if (st >= 6) { const g = new Path2D(), r = R("zaun"); for (let k = 0; k < 16; k++) { const zx = x - 128 + k * 16; poly(g, [[zx, y + 34], [zx, y + 8], [zx + 4, y + 2], [zx + 8, y + 8], [zx + 8, y + 34]], r, .4); }
      poly(g, [[x - 130, y + 16], [x + 128, y + 16], [x + 128, y + 21], [x - 130, y + 21]], null);
      papier(ctx, g, "#F1EBDD", 2);
      const beet = new Path2D(); ellipse(beet, x - 40, y + 48, 60, 10); papier(ctx, beet, "#7A5A3E", 1);
      const bl = new Path2D(); for (let k = 0; k < 9; k++) kreis(bl, x - 90 + k * 12, y + 42 - (k % 2) * 4, 5); papier(ctx, bl, SA.blume[1], 1); }
    ctx.restore();
    // Zufahrt: Straße führt rechts aus dem Bild zur Stadtrandstraße, davor parken Autos
    { const st2 = new Path2D(); st2.moveTo(x - 60, y + 4); st2.lineTo(x + 150 * HK, y + 4); st2.quadraticCurveTo(VW - 40, y + 10, VW + 60, y + 70); st2.lineTo(VW + 60, y + 118); st2.quadraticCurveTo(VW - 60, y + 42, x + 150 * HK, y + 40); st2.lineTo(x - 60, y + 40); st2.closePath();
      papier(ctx, st2, schnee ? "#DADBD6" : mix("#9C9A92", unten, .15), 2, { saum: true });
      const mark = new Path2D(); for (let k = 0; k < 4; k++) { const t = k / 4; const mx = x + 150 * HK + 30 + t * (VW - x - 150 * HK + 10), my = y + 24 + t * t * 55; rr(mark, mx, my, 16, 3, 1); } ctx.fillStyle = "rgba(255,253,245,.55)"; ctx.fill(mark);
      const autos = [[x - 20, "#7E93A8"], [x + 60, "#B5534A"], [x + 150, "#D8CFB8"], [x + 230, "#4F6656"]];
      for (const [ax, farbe] of autos) { const ay = y + 30, a = new Path2D(); rr(a, ax - 30, ay - 16, 60, 16, 5); poly(a, [[ax - 18, ay - 16], [ax - 11, ay - 28], [ax + 13, ay - 28], [ax + 20, ay - 16]], null); papier(ctx, a, farbe, 2);
        const fen = new Path2D(); poly(fen, [[ax - 14, ay - 17], [ax - 9, ay - 25], [ax + 11, ay - 25], [ax + 16, ay - 17]], null); ctx.fillStyle = nacht > .3 ? "#3D4450" : "rgba(220,232,240,.85)"; ctx.fill(fen);
        const rad = new Path2D(); kreis(rad, ax - 17, ay, 6); kreis(rad, ax + 17, ay, 6); papier(ctx, rad, "#2A2A2A", 0); } }
  }

  // ===== Pavillon (Stufe 11) =====
  if (st >= 11) { const x = 600, y = 652, p = new Path2D();
    poly(p, [[x - 50, y], [x - 46, y - 80], [x - 40, y - 80], [x - 44, y]], null); poly(p, [[x + 50, y], [x + 46, y - 80], [x + 40, y - 80], [x + 44, y]], null);
    poly(p, [[x - 62, y - 78], [x, y - 122], [x + 62, y - 78]], null); papier(ctx, p, "#E8DCC4", 3, { saum: true }); }

  // ===== Leseeiche (Lesen) =====
  { const x = 175, y = 650, r = R("eiche");
    const g = wachs("eiche");
    const gr = clamp(.62 + Math.log2(1 + M.leseMin / 30) * .07 + (st >= 5 ? .12 : 0), .62, 1.18) * (neu === "eiche" ? (.92 + .08 * easeOut(t)) : 1);
    const h = 300 * gr;
    const stamm = new Path2D();
    poly(stamm, [[x - 22 * gr, y], [x - 12 * gr, y - h * .5], [x - 40 * gr, y - h * .72], [x - 30 * gr, y - h * .76], [x - 4 * gr, y - h * .56], [x + 2 * gr, y - h * .8], [x + 12 * gr, y - h * .8], [x + 12 * gr, y - h * .52], [x + 40 * gr, y - h * .7], [x + 46 * gr, y - h * .64], [x + 18 * gr, y - h * .42], [x + 24 * gr, y]], r, .8);
    papier(ctx, stamm, "#5E4632", 4, { saum: true });
    if (SA.laub) {
      const dichte = clamp(9 + Math.floor(Math.sqrt(M.leseMin / 10) * 2.2), 9, 34);
      krone(ctx, x, y - h * .8, 120 * gr, dichte, R("eichekrone"), SA.laub[0], 4);
      krone(ctx, x - 10, y - h * .86, 90 * gr, Math.round(dichte * .6), R("eichekrone2"), SA.laub[1], 3);
    } else aeste(ctx, x, y - h * .7, h * 1.4, r, "#5E4632", 3);
    // Lesezeichen-Bänder je ausgelesenem Buch
    const farben = ["#7A2A1B", "#463873", "#1A4560", "#C98A1B", "#1F4A34", "#B5532F"];
    const astP = [[-62, .7], [48, .66], [-30, .62], [70, .6], [-84, .64], [22, .7], [-8, .58]];
    M.buecher.slice(0, 7).forEach((b, i) => {
      const extra = Math.floor((M.buecher.length - 1 - i) / 7);
      const bx = x + astP[i][0] * gr, by = y - h * astP[i][1];
      const p = new Path2D(), L = 38 + (i % 3) * 6 + extra * 10, gg = wachs("buch:" + Math.min(i, 6));
      poly(p, [[bx - 4, by], [bx + 4, by], [bx + 4, by + L * gg], [bx, by + L * gg - 7], [bx - 4, by + L * gg]], null);
      papier(ctx, p, farben[(b.farbe || i) % farben.length], 2);
    });
    // Vogelhaus (Stufe 10)
    if (st >= 10) { const p = new Path2D(), vx = x + 4, vy = y - h * .42; poly(p, [[vx - 14, vy], [vx - 14, vy - 22], [vx, vy - 34], [vx + 14, vy - 22], [vx + 14, vy]], null); papier(ctx, p, "#A0703F", 2); ctx.fillStyle = "#2B2620"; ctx.beginPath(); ctx.arc(vx, vy - 14, 4, 0, TAU); ctx.fill(); }
    SZ.regionen.push({ ort: "eiche", x: x - 130, y: y - h - 20, w: 260, h: h + 30 });
  }

  // ===== Quelle → Bach → Weiher (Ruhe) =====
  { const qx = 600, qy = 690, n = M.ruhe;
    const len = clamp(n / 10, 0, 1), weiher = clamp((n - 8) / 40, 0, 1);
    if (weiher > 0) { const p = new Path2D(), g = wachs("quelle"); ellipse(p, 760, 790, (70 + weiher * 90) * g, (16 + weiher * 22) * g); papier(ctx, p, mix("#7FA7B5", oben, .25), 2);
      // Spiegelung von Himmel
      ctx.save(); ctx.clip(p); ctx.fillStyle = `rgba(255,255,255,${.25 - nacht * .15})`; ctx.fillRect(700, 780, 160, 4); ctx.fillRect(730, 792, 110, 3); ctx.restore(); }
    if (n > 0) {
      const p = new Path2D(), pts = [[qx, qy]], r = R("bach");
      const ziel = [[640, 712], [690, 735], [720, 760], [760, 790]]; const k = Math.max(1, Math.round(len * 4));
      for (let i = 0; i < k; i++) pts.push([ziel[i][0] + (r() - .5) * 10, ziel[i][1]]);
      const breite = 5 + len * 6;
      p.moveTo(pts[0][0] - breite, pts[0][1]);
      pts.forEach(([a, b], i) => p.lineTo(a - breite * (1 + i * .25), b));
      for (let i = pts.length - 1; i >= 0; i--) p.lineTo(pts[i][0] + breite * (1 + i * .25), pts[i][1] + 3);
      p.closePath(); papier(ctx, p, mix("#6E9CAE", oben, .2), 1.5);
    }
    const q = new Path2D(), g = wachs("quelle"); ellipse(q, qx, qy, (18 + Math.min(n, 12)) * g, (7 + Math.min(n, 12) * .35) * g); papier(ctx, q, mix("#6E9CAE", oben, .15), 2);
    const steine = new Path2D(); const r = R("quellsteine"); for (let i = 0; i < 5; i++) ellipse(steine, qx - 30 + i * 15 + r() * 4, qy - 6 + (i % 2) * 12, 7 + r() * 3, 4.5); papier(ctx, steine, "#9A9488", 1.5);
    // Steg (Stufe 4)
    if (st >= 4) { const p = new Path2D(), sx = 676, sy = 724; poly(p, [[sx - 34, sy - 4], [sx + 34, sy - 12], [sx + 36, sy - 4], [sx - 32, sy + 4]], null);
      poly(p, [[sx - 30, sy], [sx - 28, sy - 18], [sx - 25, sy - 18], [sx - 26, sy]], null); poly(p, [[sx + 30, sy - 8], [sx + 31, sy - 26], [sx + 34, sy - 26], [sx + 33, sy - 8]], null);
      papier(ctx, p, "#9B7550", 2); }
    SZ.regionen.push({ ort: "quelle", x: qx - 50, y: qy - 30, w: 300, h: 130 });
  }

  // ===== Tanzboden: Laternen, Fußspuren (Tanz & Musik) =====
  { const x = 470, y = 662, p = new Path2D(); const g = wachs("tanz");
    ellipse(p, x, y, 118, 34); papier(ctx, p, "#B88B5C", 3, { saum: true });
    // Bretter (Papierstreifen)
    ctx.save(); ctx.clip(p); ctx.fillStyle = "rgba(60,40,20,.14)"; for (let k = -6; k <= 6; k++) ctx.fillRect(x + k * 19, y - 40, 1.6, 80); ctx.restore();
    // Fußspuren in einer Walzer-Box, Figur für Figur
    const fuss = new Path2D(), F = Math.min(M.tanzStunden, 16);
    const box = [[-22, 10], [-22, -10], [0, -14], [22, -10], [22, 10], [0, 14]];
    for (let i = 0; i < F; i++) {
      const ring = Math.floor(i / 6), [bx, by] = box[i % 6], s = 1 + ring * .55, gg = wachs("fuss:" + i);
      const fx = x + bx * s * 1.8 + (ring % 2 ? 6 : 0), fy = y + by * s * .55;
      const sohle = (sx, sy) => { ellipse(fuss, sx, sy - 3 * gg, 4.2 * gg, 5.6 * gg, .15); ellipse(fuss, sx + .6, sy + 5 * gg, 3 * gg, 3 * gg, .15); };
      sohle(fx - 6, fy); sohle(fx + 7, fy - 4);
    }
    if (F) papier(ctx, fuss, "#F1E6CF", 0);
    if (M.tanzStunden > 16) { ctx.save(); ctx.clip(p); ctx.fillStyle = `rgba(255,236,200,${Math.min(.25, (M.tanzStunden - 16) / 80)})`; ctx.fillRect(x - 120, y - 36, 240, 72); ctx.restore(); }
    // Laternenschnur (Stufe 5) oder Laternen an Pfählen
    const L = Math.min(M.musik + M.tanzStunden, st >= 5 ? 16 : 5);
    if (st >= 5) {
      const pf = new Path2D(); poly(pf, [[296, 650], [298, 516], [304, 516], [306, 650]], null); poly(pf, [[644, 650], [646, 516], [652, 516], [654, 650]], null); papier(ctx, pf, "#6B4A32", 2);
      ctx.strokeStyle = "#3A3028"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(300, 520); ctx.quadraticCurveTo(470, 600, 650, 520); ctx.stroke();
      for (let i = 0; i < L; i++) { const tt = (i + 1) / (L + 1), lx = (1 - tt) * (1 - tt) * 300 + 2 * (1 - tt) * tt * 470 + tt * tt * 650, ly = (1 - tt) * (1 - tt) * 520 + 2 * (1 - tt) * tt * 600 + tt * tt * 520;
        laterne(ctx, lx, ly + 8, i, nacht, wachs("laterne:" + i)); }
    } else for (let i = 0; i < L; i++) { const lx = x - 120 + i * 60, ly = y - 70; const pf = new Path2D(); poly(pf, [[lx - 2, y - 20], [lx - 2, ly], [lx + 2, ly], [lx + 2, y - 20]], null); papier(ctx, pf, "#4A3A2C", 1); laterne(ctx, lx, ly + 4, i, nacht, wachs("laterne:" + i)); }
    SZ.regionen.push({ ort: "tanz", x: x - 130, y: y - 110, w: 260, h: 150 });
  }

  // ===== Fest (Stufe 12): langer Tisch, Stühle, Lichter quer =====
  if (st >= 12) { const p = new Path2D(), x = 780, y = 742;
    poly(p, [[x - 110, y - 26], [x + 110, y - 26], [x + 110, y - 18], [x - 110, y - 18]], null);
    for (const dx of [-100, 100]) poly(p, [[x + dx - 3, y - 18], [x + dx + 3, y - 18], [x + dx + 3, y + 8], [x + dx - 3, y + 8]], null);
    for (let k = 0; k < 6; k++) { const cx = x - 90 + k * 36; poly(p, [[cx - 9, y + 10], [cx - 9, y - 6], [cx + 9, y - 6], [cx + 9, y + 10], [cx + 7, y + 10], [cx + 7, y], [cx - 7, y], [cx - 7, y + 10]], null); }
    papier(ctx, p, "#E6D8BC", 3, { saum: true });
    ctx.strokeStyle = "#3A3028"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(40, 500); ctx.quadraticCurveTo(500, 640, 960, 500); ctx.stroke();
    for (let i = 0; i < 18; i++) { const tt = (i + .5) / 18, lx = (1 - tt) * (1 - tt) * 40 + 2 * (1 - tt) * tt * 500 + tt * tt * 960, ly = (1 - tt) * (1 - tt) * 500 + 2 * (1 - tt) * tt * 640 + tt * tt * 500;
      ctx.fillStyle = "#F2C36B"; ctx.beginPath(); ctx.arc(lx, ly + 4, 4, 0, TAU); ctx.fill(); if (nacht > .3) gluehen(ctx, lx, ly + 4, 14, nacht * .7); } }

  // ===== Wiese: Blumen (Hände & Haus) =====
  { const r = R("blumen"), n = Math.min(M.wiese, 70), p = [new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < n; i++) {
      let fx, fy, versuch = 0;
      do { fx = 60 + r() * 880; fy = 730 + r() * 150; versuch++; } while (versuch < 12 && blockiert(fx, fy, M));
      if (schnee || blockiert(fx, fy, M)) continue;
      const gg = wachs("wiese:" + i), s = (5 + r() * 3) * gg, art = i % 3;
      const st2 = new Path2D(); poly(st2, [[fx - .8, fy + 14], [fx - .8, fy], [fx + .8, fy], [fx + .8, fy + 14]], null); ctx.fillStyle = "#4E6B3E"; ctx.fill(st2);
      if (art === 0) { for (let k = 0; k < 5; k++) kreis(p[0], fx + Math.cos(k / 5 * TAU) * s * .8, fy + Math.sin(k / 5 * TAU) * s * .8, s * .55); }
      else if (art === 1) kreis(p[1], fx, fy, s * .8);
      else { poly(p[2], [[fx - s * .7, fy], [fx, fy - s * 1.5], [fx + s * .7, fy]], null); }
    }
    p.forEach((pp, i) => papier(ctx, pp, SA.blume[i], 1));
    if (n) SZ.regionen.push({ ort: "wiese", x: 40, y: 730, w: 920, h: 150 });
  }

  // ===== E4 Weg (Kilometer) =====
  if (st >= 1) {
    const anteil = clamp(.45 + Math.sqrt(M.km) / 20, .45, 1) * (neu === "weg" ? (.85 + .15 * easeOut(t)) : 1);
    const pts = []; const N = 40;
    for (let i = 0; i <= N; i++) { const u = i / N * anteil, y = VH + 10 - u * 300, x = 280 + Math.sin(u * 2.8) * 70 + u * 20; pts.push([x, y, 66 * (1 - u * .72)]); }
    const p = new Path2D();
    p.moveTo(pts[0][0] - pts[0][2], pts[0][1]);
    pts.forEach(([x, y, w]) => p.lineTo(x - w, y)); pts.slice().reverse().forEach(([x, y, w]) => p.lineTo(x + w, y));
    p.closePath(); papier(ctx, p, schnee ? "#F4F2EA" : "#E3D2AE", 3);
    // Wegsteine je 5 km, Pfahl je 25 km, Wegweiser je 100 km
    const steine = Math.min(Math.floor(M.km / 5), 30), pfaehle = Math.min(Math.floor(M.km / 25), 8), weiser = Math.min(Math.floor(M.km / 100), 2);
    const st3 = new Path2D();
    for (let i = 0; i < steine; i++) { const k = Math.min(N, 2 + Math.floor((i + .5) / 30 * (N - 4) * anteil / anteil)); const [x, y, w] = pts[Math.min(k, pts.length - 1)]; const side = i % 2 ? 1 : -1; ellipse(st3, x + side * (w + 10), y, 8 * (w / 70 + .3), 5 * (w / 70 + .3)); }
    if (steine) papier(ctx, st3, "#A39C8E", 1.5);
    for (let i = 0; i < pfaehle; i++) { const k = 4 + i * 4; const [x, y, w] = pts[Math.min(k, N)]; const s = w / 70 + .3; const pf = new Path2D(); poly(pf, [[x + w + 18, y], [x + w + 18, y - 34 * s], [x + w + 25, y - 37 * s], [x + w + 25, y]], null); papier(ctx, pf, "#7A5A3E", 2); }
    for (let i = 0; i < weiser; i++) { const k = 6 + i * 8; const [x, y, w] = pts[Math.min(k, N)]; const s = w / 70 + .4; const ww = new Path2D(); poly(ww, [[x - w - 20, y], [x - w - 20, y - 60 * s], [x - w - 16, y - 60 * s], [x - w - 16, y]], null); poly(ww, [[x - w - 46, y - 56 * s], [x - w + 6, y - 56 * s], [x - w + 14, y - 49 * s], [x - w + 6, y - 42 * s], [x - w - 46, y - 42 * s]], null); papier(ctx, ww, "#8A6A48", 2); }
    // Bank (Stufe 2) und Rastbänke („War zu viel“)
    const baenke = (st >= 2 ? 1 : 0) + Math.min(M.baenke, 2);
    for (let i = 0; i < baenke; i++) { const k = 10 + i * 7; const [x, y, w] = pts[Math.min(k, N)]; bank(ctx, x + (i % 2 ? -1 : 1) * (w + 44), y - 4, (w / 70 + .45) * (i === 0 ? wachs("stufe:2") : 1)); if (i === 0) SZ.bankPos = [x + (w + 44), y - 4]; }
    SZ.regionen.push({ ort: "weg", x: 180, y: VH - 320, w: 380, h: 330 });
  }

  // ===== Glühwürmchen (Mut) =====
  { const r = R("gluehw"), n = Math.min(M.mut, 30);
    for (let i = 0; i < n; i++) { const x = 220 + r() * 600, y = 560 + r() * 200, gg = wachs("mut:" + i);
      ctx.fillStyle = nacht > .3 || gold > .5 ? "#FFE08A" : "#E2A93B"; ctx.beginPath(); ctx.arc(x, y, 3.4 * gg, 0, TAU); ctx.fill();
      if (nacht > .2) gluehen(ctx, x, y, 16, nacht); }
    if (n) SZ.regionen.push({ ort: "mut", x: 220, y: 550, w: 600, h: 220 }); }

  // ===== Freigeschaltetes aus dem Kramladen =====
  ladenDinge(ctx, M, SA, nacht, wachs);

  // ===== Dickicht (verschwindet mit den Stufen: Licht fällt ein) =====
  { const n = [7, 4, 2][st] ?? 0; const r = R("dickicht");
    if (n && alt > 0) { ctx.save(); ctx.globalAlpha = .22; ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.moveTo(470, 0); ctx.lineTo(560, 0); ctx.lineTo(600, VH); ctx.lineTo(500, VH); ctx.closePath(); ctx.fill(); ctx.restore(); }
    for (let i = 0; i < n; i++) { const tief = i % 2, x = 180 + ((i * 0.618 + .1) % 1) * 640; if ((x > 440 && x < 990)) continue;
      kiefer(ctx, x, 880 - tief * 90 + r() * 20, (tief ? 270 : 340) + r() * 70, r, tief ? "#3C5A42" : "#2F4A36", tief ? "#6A4A36" : "#5A3E2E", tief ? 3 : 5); } }

  // ===== E5 Portal: Vordergrund-Stämme, Farn, Moos =====
  { const r = R("portal");
    kiefer(ctx, 14, VH + 30, 900, r, mix("#2E4733", "#000000", .05), "#5B3B2A", 6);
    kiefer(ctx, 986, VH + 30, 860, r, mix("#2E4733", "#000000", .05), "#5B3B2A", 6);
    const farn = new Path2D();
    for (const [fx, dir] of [[40, 1], [960, -1], [120, 1], [880, -1]]) for (let k = 0; k < 6; k++) {
      const a = -Math.PI / 2 + dir * (k * .22 - .2), L = 90 + r() * 40, bx = fx + dir * k * 4, by = VH + 8;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L;
      poly(farn, [[bx - 3, by], [ex, ey], [bx + 3, by]], null);
      for (let j = 1; j < 7; j++) { const tx = bx + (ex - bx) * j / 7, ty = by + (ey - by) * j / 7, l = 18 * (1 - j / 8); poly(farn, [[tx, ty], [tx + Math.cos(a - 1.2) * l, ty + Math.sin(a - 1.2) * l], [tx + 2, ty + 2]], null); poly(farn, [[tx, ty], [tx + Math.cos(a + 1.2) * l, ty + Math.sin(a + 1.2) * l], [tx - 2, ty + 2]], null); }
    }
    papier(ctx, farn, schnee ? "#7C8A72" : SA.farn, 3);
    // Moos am Boden (Ruhe rahmt das Bild leise mit)
    const moos = new Path2D(); for (let i = 0; i < Math.min(4 + M.ruhe, 22); i++) ellipse(moos, (i % 2 ? 940 : 60) + (r() - .5) * 120, VH - 4 - r() * 18, 16 + r() * 18, 8 + r() * 5);
    papier(ctx, moos, schnee ? "#E8E8E0" : "#4F6B3C", 2);
  }

  // ===== Schnee als zusätzliche Papierlage =====
  if (schnee) { const r = R("schnee" + tagVon(d)); ctx.fillStyle = "rgba(250,250,246,.92)"; for (let i = 0; i < 90; i++) { ctx.beginPath(); ctx.arc(r() * VW, r() * VH, 1.2 + r() * 2.2, 0, TAU); ctx.fill(); } }

  // ===== Hühnchen (Ton): steht, wo Rita zuletzt etwas getan hat =====
  { const pos0 = nacht > .5 ? [790, 618] : huehnchenPos(M.letzte); const besuch = figurenHeute();
    if (S.figuren !== false && nacht < .5) { const fs = pos0[1] / 640; figur(ctx, pos0[0] - 30 * fs, pos0[1] + 2, fs * 1.05, "rita"); besuch.forEach((w, i) => figur(ctx, pos0[0] - 62 * fs - i * 28 * fs, pos0[1] + 4, fs * 1.05, w)); SZ.regionen.push({ ort: "figuren", x: pos0[0] - 120, y: pos0[1] - 90, w: 110, h: 95, besuch }); } }
  if (S.huhn) { const pos = nacht > .5 ? [790, 618] : huehnchenPos(M.letzte); huehnchenZeichnen(ctx, pos[0], pos[1], .6 * pos[1] / 680); SZ.regionen.push({ ort: "huehnchen", x: pos[0] - 18, y: pos[1] - 36, w: 40, h: 40 }); }

  // ===== Papierfaser über allem =====
  ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = .07; ctx.fillStyle = grainPattern(ctx);
  ctx.fillRect(-ox / sk, -oy / sk, cw / sk, ch / sk); ctx.restore();
  // Nacht: leichter Blauschleier, aber hell
  if (nacht > 0) { ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = `rgba(170,188,225,${nacht * .18})`; ctx.fillRect(-ox / sk, -oy / sk, cw / sk, ch / sk); ctx.restore(); }
  SZ.sk = sk; SZ.ox = ox; SZ.oy = oy;
}
function blockiert(x, y, M) {
  const u = (VH + 10 - y) / 300; if (u >= 0 && u <= 1) { const px = 280 + Math.sin(u * 2.8) * 70 + u * 20, w = 66 * (1 - u * .72) + 18; if (Math.abs(x - px) < w) return true; }
  if (((x - 470) / 135) ** 2 + ((y - 662) / 45) ** 2 < 1) return true;
  if (M.ruhe > 8 && ((x - 760) / 175) ** 2 + ((y - 790) / 45) ** 2 < 1) return true;
  const t = clamp(((x - 600) * 160 + (y - 690) * 100) / (160 * 160 + 100 * 100), 0, 1); if (M.ruhe && Math.hypot(x - (600 + 160 * t), y - (690 + 100 * t)) < 24) return true;
  if (S.maxStufe >= 12 && x > 660 && x < 900 && y > 700 && y < 770) return true;
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
  const P = { weg: [430, 860], fenster: [740, 650], tanz: [560, 690], eiche: [240, 680], quelle: [565, 712], wiese: [880, 790], horizont: [520, 760], mut: [500, 760], bank: SZ.bankPos ? [SZ.bankPos[0] + 6, SZ.bankPos[1] - 14] : [430, 820] };
  return P[ort] || [520, 800];
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
  if (G.traenke) { const p = new Path2D(); ellipse(p, 360, 708, 22, 6); poly(p, [[354, 708], [366, 708], [362, 728], [358, 728]], null); papier(ctx, p, "#A8A296", 2); }
  if (G.igelhaus) { const p = new Path2D(); ellipse(p, 930, 720, 34, 22); papier(ctx, p, "#8C6A3E", 2); ctx.fillStyle = "#2A221A"; ctx.beginPath(); ctx.ellipse(918, 728, 8, 7, 0, 0, TAU); ctx.fill(); }
  if (G.rosenbogen) { const p = new Path2D(), x = 395, y = 800; p.moveTo(x - 60, y); p.arc(x, y, 60, Math.PI, 0); p.lineTo(x + 52, y); p.arc(x, y, 52, 0, Math.PI, true); p.closePath(); papier(ctx, p, "#6E5A40", 2);
    const r = rnd("rosen"), bl = new Path2D(); for (let i = 0; i < 14; i++) { const a = Math.PI + r() * Math.PI; kreis(bl, x + Math.cos(a) * 56, y + Math.sin(a) * 56, 5); } papier(ctx, bl, "#C9563A", 1); }
  if (G.haengematte) { ctx.strokeStyle = "#5A4A3A"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(880, 640); ctx.quadraticCurveTo(930, 700, 975, 640); ctx.stroke(); const p = new Path2D(); p.moveTo(890, 650); p.quadraticCurveTo(930, 712, 968, 650); p.quadraticCurveTo(930, 696, 890, 650); papier(ctx, p, "#E6D3A8", 1.5); }
  if (G.rotkehlchen) { const h = jetzt().getHours(); if (h >= 5 && h < 12) { const x = 700, y = 604; const p = new Path2D(); ellipse(p, x, y, 9, 7); kreis(p, x + 8, y - 5, 5); papier(ctx, p, "#7A6248", 1); ctx.fillStyle = "#D9603C"; ctx.beginPath(); ctx.ellipse(x + 5, y - 1, 5, 5, 0, 0, TAU); ctx.fill(); } }
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
  if (M.km) z.push(`Der Weg: ${fmt(M.km)} km gegangen.`);
  const pers = Object.keys(M.menschen).length; if (pers) z.push(`Das Haus: ${pers} ${pers === 1 ? "Fenster leuchtet" : "Fenster leuchten"}.`);
  if (M.tanzStunden) z.push(`Der Tanzboden: ${M.tanzStunden} Paar Fußspuren.`);
  if (M.musik) z.push(`${Math.min(M.musik, 16)} ${M.musik === 1 ? "Laterne" : "Laternen"} für Musik.`);
  if (M.leseMin) z.push(`Die Leseeiche: ${Math.round(M.leseMin)} Minuten gelesen oder gehört${M.buecher.length ? `, ${M.buecher.length} ${M.buecher.length === 1 ? "Lesezeichen" : "Lesezeichen"} am Ast` : ""}.`);
  if (M.ruhe) z.push(`Die Quelle: ${M.ruhe}-mal bewusst ausgeruht oder für dich gesorgt.`);
  if (M.wiese) z.push(`Die Wiese: ${Math.min(M.wiese, 70)} ${M.wiese === 1 ? "Blume" : "Blumen"}.`);
  if (M.ausfluege.length) z.push(`Am Horizont: ${M.ausfluege.map(a => a.titel).join(", ")}.`);
  if (M.mut) z.push(`${M.mut} Glühwürmchen für Mut.`);
  if (M.baenke) z.push(`${M.baenke} Rastbank am Weg.`);
  return z;
}
