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
  const gross = h > 300, krone = new Path2D(), n = gross ? 9 + Math.floor(r() * 3) : 4 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    // große Vordergrund-Kiefern: mehr, dichter gestaffelte Büschel, damit die Krone eine geschlossene Form hat
    const bx = x + (r() - .5) * h * (gross ? .3 : .36), by = y - h * (gross ? .75 + (i / n) * .19 + r() * .03 : .74 + r() * .22), rx = h * (gross ? .075 + r() * .05 : .08 + r() * .07), ry = rx * (gross ? .45 + r() * .12 : .38 + r() * .14);
    fetzen(krone, bx, by, rx, ry, r, 15);
  }
  fetzen(krone, x + dir * h * .17, a1 - h * .085, h * .075, h * .03, r, 11);
  papier(ctx, krone, farbeKrone, tiefe, { saum: true });
  // Nadelbüschel: hellere Oberseiten und ein paar dunkle Unterseiten – die Krone soll nicht wie ein flacher Klecks wirken
  if (h > 300) {
    const hell = new Path2D(), dunkel = new Path2D(), m = n + 1;
    for (let i = 0; i < m; i++) {
      const bx = x + (r() - .5) * h * .3, by = y - h * (.76 + r() * .2), rx = h * (.05 + r() * .045), ry = rx * (.34 + r() * .1);
      nadeln(hell, bx - rx * .1, by - ry * .45, rx, ry, r);
      nadeln(dunkel, bx + rx * .15, by + ry * .55, rx * .8, ry * .45, r);
    }
    const lh = LICHT.nacht > 0 ? .06 : .12;
    ctx.save(); ctx.fillStyle = mix(farbeKrone, "#0E1A12", .35); ctx.globalAlpha = .55; ctx.fill(dunkel); ctx.restore();
    ctx.save(); ctx.fillStyle = mix(farbeKrone, "#B7C98F", lh); ctx.fill(hell); ctx.restore();
    ctx.save(); ctx.globalAlpha = .7; ctx.fillStyle = mix(farbeKrone, "#D9E2A6", lh + .08); const top = new Path2D();
    for (let i = 0; i < Math.ceil(m / 2); i++) { const bx = x + (r() - .5) * h * .26, by = y - h * (.8 + r() * .16), rx = h * (.03 + r() * .025); nadeln(top, bx, by - rx * .3, rx, rx * .3, r); }
    ctx.fill(top); ctx.restore();
  }
}
/* Büschel – gleicher Papier-Stil wie die Krone, nur kleiner */
function nadeln(p, cx, cy, rx, ry, r) { fetzen(p, cx, cy, rx, ry, r, 15); }
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
  const BW = bildWetter(), saison = jahreszeit(d), SA = SAISON[saison], schnee = schneeTag(d) || BW.art === "schnee";
  const trueb = { regen: .5, wolken: .3, nebel: .32, schnee: .36 }[BW.art] || 0;
  const so = sonne(d);
  const R = key => rnd("bild:" + key);
  const t = opt.anim ?? 1;                  // Ankunfts-Animation (0..1) für M.neu
  const neu = opt.neu || null;
  const wachs = (key) => (neu && neu === key) ? (0.4 + 0.6 * easeOut(t)) : 1;
  SZ.regionen = []; SZ.anker = {}; SZ.SA = SA; SZ.mondDa = 0; SZ.wetter = BW.art; SZ.schnee = schnee;

  // Licht
  const alt = so.alt;
  const nacht = clamp((-alt - 2) / 8, 0, 1) * (opt.immerTag ? 0 : 1);
  const gold = clamp(1 - Math.abs(alt - 4) / 10, 0, 1) * (1 - nacht) * Math.max(0, 1 - trueb * 1.4);
  const sunX = clamp(500 + (so.az - 180) / 100 * 470, 40, 960);
  LICHT = { sx: sunX < 500 ? .9 : -.9, sy: 1, nacht, gold };

  // ===== E0 Himmel =====
  const tag = ["#A8C6D6", "#E9E4D0"], goldS = ["#86A3C2", "#F2C88E"], nachtS = ["#2F4A74", "#647DAA"];
  let oben = mix(tag[0], goldS[0], gold), unten = mix(tag[1], goldS[1], gold);
  oben = mix(oben, nachtS[0], nacht); unten = mix(unten, nachtS[1], nacht);
  if (saison === "winter") { oben = mix(oben, "#B9C4CC", .25 * (1 - nacht)); unten = mix(unten, "#E6E6E0", .3 * (1 - nacht)); }
  if (trueb) { oben = mix(oben, nacht > .5 ? "#2C3546" : BW.art === "regen" ? "#7F8B97" : "#A4AEB6", trueb); unten = mix(unten, nacht > .5 ? "#4A5266" : "#D4D6D2", trueb * .9); }
  const gr = ctx.createLinearGradient(0, 0, 0, HORIZONT + 60); gr.addColorStop(0, oben); gr.addColorStop(1, unten);
  ctx.fillStyle = gr; ctx.fillRect(-ox / sk - 2, -oy / sk - 2, cw / sk + 4, ch / sk + 4);
  // Sterne als Nadelstiche
  if (nacht > .2) {
    const r = R("sterne"); ctx.fillStyle = `rgba(255,246,220,${.8 * nacht})`;
    for (let i = 0; i < 70; i++) { const x = r() * VW, y = r() * (HORIZONT - 60); ctx.beginPath(); ctx.arc(x, y, .9 + r() * 1.3, 0, TAU); ctx.fill(); }
    if (S.gekauft.sternbilder) sternbilder(ctx, nacht);
  }
  // Sonne / Mond als Papierscheiben
  if (alt > -4 && BW.art !== "regen" && BW.art !== "nebel" && BW.art !== "schnee") {
    const sy = HORIZONT - 30 - clamp(alt, -4, 62) / 62 * 380;
    const p = new Path2D(); kreis(p, sunX, sy, 34);
    ctx.save(); ctx.globalAlpha = (.35 + .4 * gold) * (BW.art === "wolken" ? .5 : 1); ctx.fillStyle = gold > .3 ? "#F6D9A0" : "#FFF6DC"; ctx.beginPath(); ctx.arc(sunX, sy, 52, 0, TAU); ctx.fill(); ctx.restore();
    papier(ctx, p, gold > .3 ? "#F2B65E" : "#FBEFC8", 0);
  } else if (alt <= -4 && !trueb) {
    const ph = mondPhase(d), mx = 780, my = 120, mr = 26; SZ.mondDa = Math.abs(ph - .5) < .47 ? 1 : 0;
    const p = new Path2D(); kreis(p, mx, my, mr);
    ctx.fillStyle = "#F4EDD6"; ctx.fill(p);
    // Phasen-Schatten
    const off = (ph < .5 ? 1 : -1) * (1 - Math.abs(ph - .5) * 2) * mr * 2;
    ctx.save(); ctx.clip(p); ctx.fillStyle = mix(oben, "#000000", .1); ctx.beginPath(); ctx.arc(mx + (ph < .5 ? -off : -off), my, mr, 0, TAU);
    if (Math.abs(ph - .5) > .03) ctx.fill(); ctx.restore();
  }
  // Wolken (Papierstreifen), wenige
  { const r = R("wolken" + tagVon(d)), viel = trueb > 0; const n = viel ? 7 + Math.floor(r() * 3) : 2 + Math.floor(r() * 3);
    const wf = BW.art === "regen" ? mix(oben, "#5E6874", .45) : viel ? mix(unten, "#FFFFFF", .3 - nacht * .3) : mix(unten, "#FFFFFF", .55 - nacht * .4);
    for (let i = 0; i < n; i++) { const p = new Path2D(), x = viel ? (i + r() * .6) / n * (VW + 160) - 80 : r() * VW, y = viel ? 40 + r() * 230 : 60 + r() * 200, w = (viel ? 150 : 80) + r() * 120;
      for (let k = 0; k < 4; k++) ellipse(p, x + (k - 1.5) * w * .28, y - (k === 1 || k === 2 ? 12 : 0), w * .26, (viel ? 22 : 16) + r() * 8);
      papier(ctx, p, i % 2 && viel ? mix(wf, "#FFFFFF", .15) : wf, 2, { schatten: viel ? .12 : .08 }); } }

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

  if (BW.art === "nebel") nebelSchleier(ctx, HORIZONT - 220, 600, .7);
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
  if (st >= 3 && nacht < .5 && alt > 0 && !trueb) {
    ctx.save(); ctx.globalAlpha = .18 * (1 - nacht); { const lg = ctx.createLinearGradient(0, HORIZONT - 40, 0, HORIZONT + 90); lg.addColorStop(0, "rgba(255,244,214,0)"); lg.addColorStop(1, "rgba(255,244,214,1)"); ctx.fillStyle = lg; } ctx.beginPath();
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
    if (BW.art === "regen") { ctx.save(); ctx.fillStyle = mix(oben, "#FFFFFF", .25); ctx.globalAlpha = .75; for (const [px, py, prx] of [[205, 884, 34], [292, 836, 22], [240, 790, 14], [600, 703, 18], [520, 662, 12]]) { ctx.beginPath(); ctx.ellipse(px, py, prx, prx * .17, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
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
    SZ.anker.ritafenster = [bx, y + rdy]; SZ.anker.balkon = [bx, by - 12];
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
    SZ.anker.eiche = [x + 4, y - h * .62]; SZ.eicheGeo = { x, y, h, gr };
    SZ.anker.futter = st >= 10 ? [x + 4, y - h * .42 - 12] : [x + 40 * gr, y - h * .6];
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
    if (n && alt > 0 && !trueb) { ctx.save(); ctx.globalAlpha = .22; const lg = ctx.createLinearGradient(0, 330, 0, 560); lg.addColorStop(0, "rgba(255,241,204,0)"); lg.addColorStop(1, "rgba(255,241,204,1)"); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(470, 0); ctx.lineTo(560, 0); ctx.lineTo(600, VH); ctx.lineTo(500, VH); ctx.closePath(); ctx.fill(); ctx.restore(); }
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

  // ===== Feste (FUN-17) und was Rita heute im Bild gemacht hat =====
  try { festeZeichnen(ctx, d, nacht, gold); bildSpielZustand(ctx, nacht, gold, schnee); } catch (e) { }
  if (BW.art === "nebel") nebelSchleier(ctx, 520, VH + 20, .4);
  // ===== Schnee als zusätzliche Papierlage =====
  if (schnee) { const r = R("schnee" + tagVon(d)); ctx.fillStyle = "rgba(250,250,246,.92)"; for (let i = 0; i < 90; i++) { ctx.beginPath(); ctx.arc(r() * VW, r() * VH, 1.2 + r() * 2.2, 0, TAU); ctx.fill(); } }

  // ===== Hühnchen (Ton): steht, wo Rita zuletzt etwas getan hat =====
  { const pos0 = nacht > .5 ? HUHN_NACHT : huehnchenPos(M.letzte); const besuch = figurenHeute();
    if (S.figuren !== false && nacht < .5) { const pl = figurenPlaetze(pos0, besuch.length, M); figur(ctx, pl[0][0], pl[0][1], pl[0][2] * 1.05, "rita", { schirm: BW.art === "regen", muetze: BW.art === "schnee" || (schnee && saison === "winter") }); besuch.forEach((w, i) => figur(ctx, pl[i + 1][0], pl[i + 1][1], pl[i + 1][2] * 1.05, w)); const xs = pl.map(q => q[0]); SZ.regionen.push({ ort: "figuren", x: Math.min(...xs) - 16, y: Math.min(...pl.map(q => q[1])) - 90, w: Math.max(...xs) - Math.min(...xs) + 32, h: 95, besuch }); } }
  if (S.huhn) { const pos = nacht > .5 ? HUHN_NACHT : huehnchenPos(M.letzte); huehnchenZeichnen(ctx, pos[0], pos[1], .6 * pos[1] / 680); SZ.anker.huhn = [pos[0], pos[1] - 16]; SZ.regionen.push({ ort: "huehnchen", x: pos[0] - 18, y: pos[1] - 36, w: 40, h: 40 }); }

  // ===== Papierfaser über allem =====
  ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = .07; ctx.fillStyle = grainPattern(ctx);
  ctx.fillRect(-ox / sk, -oy / sk, cw / sk, ch / sk); ctx.restore();
  // Nacht: leichter Blauschleier, aber hell
  if (nacht > 0) { ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = `rgba(170,188,225,${nacht * .18})`; ctx.fillRect(-ox / sk, -oy / sk, cw / sk, ch / sk); ctx.restore(); }
  if (BW.art === "regen") { ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(150,162,178,.16)"; ctx.fillRect(-ox / sk, -oy / sk, cw / sk, ch / sk); ctx.restore(); }
  SZ.sk = sk; SZ.ox = ox; SZ.oy = oy;
  if (canvas.id === "bild-gross") try { fxEinrichten(canvas); } catch (e) { }
}
function blockiert(x, y, M, wegOk) {
  // Zufahrt, Parkplatz, Hecke, Häuser
  if (y < PARK.vorn + 18 && x > strasseL(Math.max(y, PARK.hinten - 40)) - 16) return true;
  if (y > PARK.hinten - 30 && x > strasseL(y) - 14 && x < strasseR(y) + 14) return true;
  // Waldweg
  const u = (VH + 10 - y) / 200; if (!wegOk && u >= 0 && u <= 1) { const [px, , w] = wegPunkt(u); if (Math.abs(x - px) < w + 16) return true; }
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
/* Rita und Besuch stehen nur auf freier Wiese oder dem Waldweg – nie auf Straße, Parkplatz/Autos,
   Grünstreifen, Häusern, Baumstämmen, Weiher oder Bank. Liefert [[x, y, Maßstab], …]: Rita zuerst. */
function figurPlatzFrei(x, y, M) {
  if (x < 72 || x > 928 || y < 690 || y > VH - 16) return false;                                  // Bildrand, Kiefernstämme vorn
  if (y > HORIZONT && x > strasseL(y) - 26 && x < strasseR(y) + 28) return false;                // Straße/Zufahrt (mit Saum)
  if (y < PARK.vorn + 30 && x > strasseL(Math.max(y, PARK.hinten - 40)) - 20) return false;      // Parkplatz, Autos, Grünstreifen, Häuser
  if (Math.abs(x - 118) < 36 && y < 716) return false;                                           // Eichenstamm
  if (SZ.bankPos && Math.abs(x - SZ.bankPos[0]) < 40 && Math.abs(y - SZ.bankPos[1]) < 18) return false; // Bank
  return !blockiert(x, y, M, true);
}
function figurenPlaetze(pos0, n, M) {
  const reihe = (ax, ay, seite) => { const fs = ay / 640, p = [[ax + seite * 30 * fs, ay + 2, fs]]; for (let i = 0; i < n; i++) p.push([ax + seite * (62 + i * 28) * fs, ay + 4, fs]); return p; };
  const passt = p => p.every(([x, y, fs]) => figurPlatzFrei(x - 9 * fs, y, M) && figurPlatzFrei(x + 9 * fs, y, M));
  const kand = [];
  for (let dy = -120; dy <= 200; dy += 10) for (let dx = -460; dx <= 460; dx += 15) kand.push([dx, dy, Math.abs(dx) + 1.6 * Math.abs(dy)]);
  kand.sort((a, b) => a[2] - b[2]);
  for (const [dx, dy] of kand) {
    const ax = pos0[0] + dx, ay = pos0[1] + dy;
    for (const seite of [-1, 1]) { const p = reihe(ax, ay, seite); if (passt(p)) return p; }
  }
  return reihe(560, 880, -1); // Wiese vorn in der Mitte (Notlösung)
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
  max: { haut: "#E6B593", haar: "#6B4A30", oben: "#5E6168", unten: "#3A3F4A", schuh: "#2A2A2A", locken: true, undercut: false, bart: "rgba(122,65,36,.34)", kette: "#D7DADF", gross: 1.08 },
  christiane: { haut: "#EBBE9E", haar: "#E3CF94", oben: "#8E2B4F", unten: "#2A3550", schuh: "#3A2A22", brille: "#C0282A", tuch: "#2B3A66", gross: .98 },
  micha: { haut: "#E0AE8C", haar: null, oben: "#1F2D4F", unten: "#4A4A4A", schuh: "#2A2A2A", gross: 1.05 }
};
function figur(ctx, x, y, s, wer, opt = {}) {
  const F = FIGUREN[wer] || (typeof avatarFigur === "function" && avatarFigur(wer)) || FIGUREN.rita; s *= F.gross;
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
  if (F.frisur && typeof avFigurExtras === "function") avFigurExtras(ctx, F, flaeche); // eigene Herzensmenschen (avatar.js)
  if (F.bart) { ctx.fillStyle = F.bart; ctx.beginPath(); ctx.moveTo(-6.6, -67); ctx.quadraticCurveTo(-6.4, -59.6, 0, -59); ctx.quadraticCurveTo(6.4, -59.6, 6.6, -67); ctx.quadraticCurveTo(4, -63.4, 0, -63.8); ctx.quadraticCurveTo(-4, -63.4, -6.6, -67); ctx.fill(); }
  if (F.kette) { ctx.strokeStyle = F.kette; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(-2.6, -58.6); ctx.quadraticCurveTo(0, -56.4, 2.6, -58.6); ctx.stroke(); }
  if (F.brille) { ctx.strokeStyle = F.brille; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(-3, -67, 2.4, 0, TAU); ctx.moveTo(5.4, -67); ctx.arc(3, -67, 2.4, 0, TAU); ctx.stroke(); }
  if (opt.muetze) { const m = new Path2D(); m.moveTo(-7.6, -70); m.quadraticCurveTo(-8, -80, 0, -80.6); m.quadraticCurveTo(8, -80, 7.6, -70); m.closePath(); ctx.fillStyle = "#C8463B"; ctx.fill(m); ctx.fillStyle = "#EFE7D6"; ctx.fillRect(-8, -72, 16, 3); ctx.beginPath(); ctx.arc(0, -81.6, 2.4, 0, TAU); ctx.fill();
    flaeche([[-6, -59], [6, -59], [5, -55], [-5, -55]], "#C8463B"); flaeche([[2, -56], [5, -44], [2, -45]], "#C8463B"); }
  if (opt.schirm) { ctx.strokeStyle = "#3A3028"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(12.6, -33); ctx.lineTo(12.6, -88); ctx.stroke();
    const sch = new Path2D(); sch.moveTo(-10, -86); sch.quadraticCurveTo(12.6, -110, 35, -86); sch.quadraticCurveTo(29.4, -89, 23.8, -86); sch.quadraticCurveTo(18.2, -89, 12.6, -86); sch.quadraticCurveTo(7, -89, 1.4, -86); sch.quadraticCurveTo(-4.2, -89, -10, -86); sch.closePath(); ctx.fillStyle = "#C8363A"; ctx.fill(sch);
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.moveTo(12.6, -100); ctx.quadraticCurveTo(4, -96, 1.4, -86.4); ctx.lineTo(6, -86.4); ctx.quadraticCurveTo(8, -96, 12.6, -100); ctx.fill(); }
  if (F.hut) { flaeche([[-15, -72], [15, -72], [12, -75], [-12, -75]], F.hut); const k = new Path2D(); k.moveTo(-7, -74); k.quadraticCurveTo(-7, -83, 0, -83); k.quadraticCurveTo(7, -83, 7, -74); k.closePath(); ctx.fillStyle = F.hut; ctx.fill(k); ctx.fillStyle = "#8C6A3A"; ctx.fillRect(-7, -76, 14, 1.6); }
  ctx.restore();
}
/* Wer heute in der Lichtung steht: Rita immer, Herzensmenschen nach einem gemeinsamen Eintrag (3 Tage lang) */
function figurenHeute() {
  const h = heute(), grenze = tagPlus(h, -2), dabei = [];
  for (const e of S.eintraege) if (e.tag >= grenze && e.tag <= h && e.person && (FIGUREN[e.person] || (typeof avatarFigur === "function" && avatarFigur(e.person))) && !dabei.includes(e.person)) dabei.push(e.person);
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
function huehnchenZeichnen(ctx, x, y, s, wahl) {
  const k = s * .62, SK = typeof skinCanvasSchichten === "function" ? skinCanvasSchichten(wahl) : null;
  ctx.save(); ctx.translate(x - 50 * k, y - 94 * k); ctx.scale(k, k);
  if (LICHT.nacht > .3) ctx.filter = `brightness(${1 - LICHT.nacht * .4})`;
  ctx.fillStyle = "rgba(20,28,24,.2)"; ctx.beginPath(); ctx.ellipse(50, 95, 26, 3.2, 0, 0, TAU); ctx.fill();
  HUHN_PFADE.forEach(([p, c], i) => { if (i === 1 && SK) skinCanvas(ctx, SK.s.hinten); if (i === 4 && SK) skinCanvas(ctx, SK.s.koerper); ctx.fillStyle = c; ctx.fill(p); });
  if (!SK || SK.deckt !== "kamm") { ctx.fillStyle = "#D9473A"; ctx.beginPath(); ctx.arc(56, 16, 5, 0, TAU); ctx.arc(63, 12.5, 5.6, 0, TAU); ctx.arc(70, 15.5, 4.6, 0, TAU); ctx.fill(); }
  ctx.fillStyle = "#FFFDF5"; ctx.beginPath(); ctx.ellipse(65, 31, 8.5, 9.5, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#1C2620"; ctx.beginPath(); ctx.arc(68, 32, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(69.8, 29.8, 1.8, 0, TAU); ctx.fill();
  if (SK) skinCanvas(ctx, SK.s.kopf);
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
  { id: "eich2", name: "Eichhörnchen in der Kiefer", nacht: "egal", anker: "eich2", x: 0, y: 0, r: 34, text: n => n ? "Psst – im Kobel schläft eins. Der Schwanz ist die Bettdecke." : "Noch eins! Das hier saust die Kiefer hoch.", mal: vEichKletter, wenn: () => !!(SZ.anker && SZ.anker.eich2) },
  { id: "uhu", name: "Uhu", nacht: true, anker: "eiche", x: 122, y: 520, r: 60, text: "Der Uhu hält Nachtwache in der Eiche.", mal: vUhu },
  { id: "nest", name: "Vogelnest", nacht: false, anker: "nest", x: 886, y: 416, r: 46, text: () => ["winter", "herbst"].includes(jahreszeit(jetzt())) ? "Ein leeres Nest. Im Frühling ist hier wieder Betrieb." : "Drei Schnäbel, ein Gedanke: Hunger!", mal: vNest },
  { id: "spatzen", name: "Spatzen", nacht: false, anker: "spatzen", x: 388, y: 450, r: 46, text: "Die Spatzen halten Dachkonferenz.", mal: vSpatzen },
  { id: "katze", name: "Katze auf dem Autodach", nacht: "egal", anker: "katze", x: 606, y: 642, r: 40, text: n => n ? "Die Katze bewacht den Parkplatz." : "Das wärmste Autodach gehört der Katze.", mal: vKatze },
  { id: "igel", name: "Igel", nacht: "egal", anker: "igel", x: 304, y: 650, r: 44, text: () => jahreszeit(jetzt()) === "winter" ? "Psst – unterm Busch hält einer Winterschlaf." : "Unterm Busch schnauft einer.", mal: vIgel },
  { id: "nachbar", name: "Nachbar mit Mülltonne", nacht: false, anker: "muell", x: 868, y: 704, r: 42, text: "Der Nachbar bringt den Müll raus. In Pantoffeln.", mal: vNachbar },
  { id: "frosch", name: "Frosch", nacht: false, anker: "wasser", x: 560, y: 848, r: 50, text: "Ein Frosch am Ufer. Er tut so, als wär er ein Stein.", mal: vFrosch },
  { id: "reh", name: "Reh", nacht: false, x: 940, y: 728, r: 42, text: "Ganz leise – da schaut ein Reh aus dem Wald.", mal: vReh },
  { id: "schnecke", name: "Schnecke", nacht: false, anker: "schnecke", x: 860, y: 830, r: 40, text: "Eine Schnecke ist unterwegs. Ankunft: irgendwann morgen.", mal: vSchnecke },
  { id: "fuchs", name: "Fuchs", nacht: true, x: 940, y: 728, r: 46, text: "Ein Fuchs schnürt am Waldrand entlang.", mal: vFuchs },
  { id: "lesen", name: "Lesendes Fenster", nacht: true, anker: "lesefenster", x: 858, y: 522, r: 40, text: "Da liest noch jemand. Nur noch ein Kapitel …", mal: vLesefenster },
  { id: "mond", name: "Mond im Wasser", nacht: true, anker: "wasser", x: 560, y: 848, r: 52, text: "Der Mond schaut sich im Wasser an. Ein bisschen eitel ist er ja.", mal: vMond, wenn: () => (SZ.mondDa || 0) > 0 },
  { id: "motten", name: "Motten an der Laterne", nacht: true, saison: true, wenn: () => ["sommer", "fruehling"].includes(jahreszeit(jetzt())), anker: "laterne", x: 404, y: 644, r: 40, text: "Die Motten drehen ihre Runden ums Licht.", mal: vMotten },
  { id: "huhn", name: "Hühnchen", nacht: "egal", anker: "huhn", x: 0, y: 0, r: 34, text: n => n ? "Hühnchen hält vor der Tür Wache. Mit einem Auge." : ["Hühnchen tut so, als würde es nicht gucken.", "Hühnchen hält hier die Stellung.", "Hühnchen hat dich längst gesehen. Es tut nur so cool."][hash32("hv" + heute()) % 3], mal: vHuhn, wenn: () => !!(S.huhn && SZ.anker && SZ.anker.huhn) },
  { id: "gluehw", name: "Glühwürmchen", nacht: true, anker: "gluehw", x: 0, y: 0, r: 44, text: "Glühwürmchen funken sich was zu.", mal: vGluehw, wenn: () => !!(SZ.anker && SZ.anker.gluehw) }
];
function tageszeit(d = jetzt()) { const h = d.getHours(); return h >= 5 && h < 11 ? "morgen" : h < 14 && h >= 11 ? "mittag" : h >= 14 && h < 17 ? "nachmittag" : h >= 17 && h < 22 ? "abend" : "nacht"; }
function entdeckbar() {
  const n = LICHT.nacht > .3, A0 = SZ.anker || {}, tz = tageszeit();
  return ENTDECKEN.filter(h => (h.nacht === "egal" || h.nacht === n || h.nacht === undefined) && (!h.zeit || h.zeit.includes(tz)) && (!h.wenn || h.wenn()) && (!h.anker || A0[h.anker] || h.x))
    .map(h => { const a = h.anker && A0[h.anker]; return { ...h, x: a ? a[0] + (h.dx || 0) : h.x, y: a ? a[1] + (h.dy || 0) : h.y }; });
}
/* Feste Funde zählen; Jahreszeiten-Funde (saison: true) kommen obendrauf und zählen nicht mit (FUN-16) */
const entdeckFest = () => ENTDECKEN.filter(h => !h.saison);
function entdecktZahl() { const E = S.entdeckt && typeof S.entdeckt === "object" ? S.entdeckt : {}; return entdeckFest().filter(h => E[h.id]).length; }
function entdecktText() {
  const n = entdecktZahl(), g = entdeckFest().length, E = S.entdeckt && typeof S.entdeckt === "object" ? S.entdeckt : {};
  const sz = ENTDECKEN.filter(h => h.saison && E[h.id]).length, plus = sz ? ` Dazu ${sz === 1 ? "ein Jahreszeiten-Fund" : sz + " Jahreszeiten-Funde"}.` : "";
  return n ? `${n} von ${g} kleinen Dingen entdeckt${n < g ? " – manche zeigen sich nur morgens, manche erst nachts." : ". Alle gefunden – fürs Erste. Das Jahr hat noch was vor."}${plus}`
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
  if (typeof halteGemerkt === "function") halteGemerkt("lupe");
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
  const winter = ["winter", "herbst"].includes(jahreszeit(jetzt()));
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
    g.fillStyle = "rgba(255,246,220,.85)"; g.font = "bold 13px 'Familjen Grotesk', sans-serif"; g.fillText("z", 80, 52); g.font = "bold 10px 'Familjen Grotesk', sans-serif"; g.fillText("z", 88, 42); return; }
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

/* ============================================================
   Wetter im Bild (Auftrag 6): echtes Wetter aus S.wetter oder Ritas Wahl
   ============================================================ */
function bildWetter(nurEcht) {
  const w = nurEcht ? "echt" : S.bildWetter || "echt";
  if (w !== "echt") return { art: w, wind: w === "regen" ? 14 : 6, echt: false };
  const W = S.wetter;
  if (!W || !Number.isFinite(W.code) || Math.abs(Date.now() - (W.zeit || 0)) > 6 * 3600e3) return { art: "sonne", wind: 0, echt: true, unbekannt: true };
  const c = W.code, a = c === 45 || c === 48 ? "nebel" : typeof wetterArt === "function" ? wetterArt(c) : "klar";
  return { art: a === "klar" ? "sonne" : a === "wolkig" ? "wolken" : a, wind: W.wind || 0, echt: true };
}
function nebelSchleier(ctx, y0, y1, a) {
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, "rgba(228,230,226,0)"); g.addColorStop(.35, `rgba(228,230,226,${a})`); g.addColorStop(1, `rgba(228,230,226,${a * .55})`);
  ctx.save(); ctx.fillStyle = g; ctx.fillRect(-200, y0, VW + 400, y1 - y0); ctx.restore();
}

/* ============================================================
   Feste im Bild (FUN-17) – nur kleine Zusätze an vorhandenen Ankern
   ============================================================ */
function festeZeichnen(ctx, d, nacht, gold) {
  if (typeof festHeute !== "function") return;
  const F = festHeute(d), h = d.getHours(), A0 = SZ.anker, abends = nacht > .2 || gold > .3 || h >= 16;
  const fen = A0.ritafenster, bal = A0.balkon;
  // Advent: Schwibbogen im Fenster (abends), an Lucia ein Kerzenkranz
  if (fen && abends && (F.advent || F.weihnachten || F.lucia)) {
    const [fx, fy] = fen; ctx.save();
    if (F.lucia) { ctx.fillStyle = "#3F6B3A"; ctx.beginPath(); ctx.ellipse(fx, fy + 6, 11, 3, 0, 0, TAU); ctx.fill();
      for (const k of [-7, -2.4, 2.4, 7]) { ctx.fillStyle = "#FBF6EA"; ctx.fillRect(fx + k - 1, fy - 2, 2, 7); gluehen(ctx, fx + k, fy - 3, 9, .9); ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.ellipse(fx + k, fy - 3.4, 1.1, 1.8, 0, 0, TAU); ctx.fill(); } }
    else { const b = new Path2D(); b.moveTo(fx - 16, fy + 8); b.arc(fx, fy + 8, 16, Math.PI, 0); b.lineTo(fx + 13, fy + 8); b.arc(fx, fy + 8, 13, 0, Math.PI, true); b.closePath(); ctx.fillStyle = "#3A2A20"; ctx.fill(b);
      for (let i = 0; i < 7; i++) { const a = Math.PI + (i + .5) / 7 * Math.PI, lx = fx + Math.cos(a) * 14.5, ly = fy + 8 + Math.sin(a) * 14.5; gluehen(ctx, lx, ly - 2, 8, .8); ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.arc(lx, ly - 2, 1.3, 0, TAU); ctx.fill(); } }
    gluehen(ctx, fx, fy, 30, .5); ctx.restore();
  }
  // Weihnachten: Bäumchen mit Lichtern auf dem Balkon
  if (bal && F.weihnachten) { const [bx, by] = bal, p = new Path2D(); poly(p, [[bx + 14, by - 22], [bx + 6, by - 6], [bx + 22, by - 6]], null); poly(p, [[bx + 14, by - 28], [bx + 8, by - 14], [bx + 20, by - 14]], null); papier(ctx, p, "#2F5E3A", 1);
    ctx.fillStyle = "#6B4A30"; ctx.fillRect(bx + 13, by - 6, 2, 4); for (const [lx, ly] of [[bx + 12, by - 18], [bx + 17, by - 12], [bx + 10, by - 9], [bx + 15, by - 23]]) { ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.arc(lx, ly, 1.1, 0, TAU); ctx.fill(); if (abends) gluehen(ctx, lx, ly, 6, .7); } }
  // Halloween: Kürbis auf dem Balkon
  if (bal && F.halloween && h >= 15) { const [bx, by] = bal, k = new Path2D(); ellipse(k, bx - 14, by - 5, 6, 4.6); papier(ctx, k, "#E8902E", 1); ctx.fillStyle = "#5B8A47"; ctx.fillRect(bx - 14.6, by - 11, 1.4, 2.6);
    if (abends) { ctx.fillStyle = "#FFE08A"; poly(new Path2D(), [], null); ctx.beginPath(); ctx.moveTo(bx - 17, by - 6); ctx.lineTo(bx - 15.6, by - 7.6); ctx.lineTo(bx - 15, by - 5.6); ctx.moveTo(bx - 11, by - 6); ctx.lineTo(bx - 12.4, by - 7.6); ctx.lineTo(bx - 13, by - 5.6); ctx.fill(); ctx.fillRect(bx - 16, by - 3.6, 4, 1.2); gluehen(ctx, bx - 14, by - 5, 12, .7); } }
  // Geburtstag: Wimpelkette am Balkon
  if (bal && F.geburtstag) { const [bx, by] = bal; ctx.strokeStyle = "#3A3028"; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(bx - 34, by - 40); ctx.quadraticCurveTo(bx, by - 28, bx + 34, by - 40); ctx.stroke();
    const fb = ["#C9563A", "#E2A93B", "#3E7FB8", "#5BA35A", "#E0558A"]; for (let i = 0; i < 9; i++) { const t = (i + .5) / 9, px = bx - 34 + 68 * t, py = by - 40 + 24 * t * (1 - t) * 1; ctx.fillStyle = fb[i % 5]; ctx.beginPath(); ctx.moveTo(px - 3, py); ctx.lineTo(px + 3, py); ctx.lineTo(px, py + 6); ctx.fill(); } }
  // Ostern: bunte Eier im Gras
  if (F.ostern && nacht < .5) { const fb = ["#E0558A", "#3E7FB8", "#E2A93B", "#5BA35A"]; [[524, 884], [548, 896], [612, 878], [690, 900]].forEach(([ex, ey], i) => { const p = new Path2D(); ellipse(p, ex, ey, 4.4, 5.8); papier(ctx, p, fb[i], 1); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(ex - 4, ey - 1, 8, 1.4); }); SZ.anker.osterei = [548, 892]; }
  // Midsommar: Midsommarstång auf der Wiese
  if (F.midsommar) { const mx = 636, my = 848, p = new Path2D(); poly(p, [[mx - 1.6, my], [mx - 1.2, my - 70], [mx + 1.2, my - 70], [mx + 1.6, my]], null); poly(p, [[mx - 22, my - 56], [mx + 22, my - 56], [mx + 22, my - 53], [mx - 22, my - 53]], null); papier(ctx, p, "#5D8A4E", 2);
    const kr = new Path2D(); kreis(kr, mx - 18, my - 44, 8); kreis(kr, mx + 18, my - 44, 8); ctx.strokeStyle = "#4E7F45"; ctx.lineWidth = 3; ctx.stroke(kr);
    for (let i = 0; i < 10; i++) { ctx.fillStyle = ["#F4F0E2", "#E9D36A", "#C7B6E6", "#D9603C"][i % 4]; ctx.beginPath(); ctx.arc(mx + (i % 2 ? 18 : -18) + Math.cos(i) * 8, my - 44 + Math.sin(i) * 8, 1.8, 0, TAU); ctx.fill(); } }
  // Silvester: ein paar Feuerwerkssterne (das Funkeln macht die Effekt-Ebene)
  if ((F.silvester && h >= 18) || (F.neujahr && h < 1)) { for (const [fx, fy, fc] of [[260, 150, "#F2C36B"], [520, 96, "#E0558A"], [760, 180, "#8FD0F0"]]) { ctx.strokeStyle = fc; ctx.lineWidth = 1.6; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(fx + Math.cos(a) * 8, fy + Math.sin(a) * 8); ctx.lineTo(fx + Math.cos(a) * 22, fy + Math.sin(a) * 22); ctx.stroke(); } gluehen(ctx, fx, fy, 30, .6); } SZ.anker.rakete = [520, 110]; }
}

/* ============================================================
   Spielereien im Bild (Auftrag 1): täglich 2–3, ein leises Funkeln, Antippen → kurze Animation + Satz + Taler
   ============================================================ */
const SCHNEEMANN = [104, 826], LAUBHAUFEN = [126, 868];
const BILDSPIELE = [
  { id: "eichhoernchen", blase: "unten", wo: "an der Eiche", satz: "Nuss geschnappt und weg. Nicht mal Tschüss gesagt.", jahr: c => !c.schnee || true, uhr: c => c.h >= 7 && c.h < 18 && c.tag, anker: () => SZ.eicheGeo && [SZ.eicheGeo.x + 30 * SZ.eicheGeo.gr, SZ.eicheGeo.y - SZ.eicheGeo.h * .64], dauer: 3000 },
  { id: "blumen", wo: "auf deinem Balkon", wer: "huhn", satz: "Gegossen. Ich hab dabei streng geguckt – das hilft auch.", jahr: c => c.m >= 4 && c.m <= 10 && c.art !== "regen" && !c.schnee, uhr: c => c.h >= 7 && c.h < 20, anker: () => SZ.anker.balkon, dauer: 2600, bleibt: true },
  { id: "nachbar", wo: "bei den Mülltonnen", satz: "Er hat zurückgewinkt. Mit dem Deckel.", jahr: c => c.art !== "regen" && c.art !== "schnee", uhr: c => c.h >= 7 && c.h < 19, anker: () => SZ.anker.muell, dauer: 2800 },
  { id: "licht", blase: "unten", wo: "an deinem Fenster", satz: "Licht an. Jetzt fehlt nur noch der Tee.", jahr: () => true, uhr: c => c.h >= 16 && c.h < 23 && (c.nacht > .05 || c.gold > .3 || c.h >= 18), anker: () => SZ.anker.ritafenster, dauer: 1600, bleibt: true, abends: true },
  { id: "katze", wo: "bei der Katze", satz: "Gestreichelt. Sie schnurrt – und rührt sich keinen Zentimeter.", jahr: c => c.art !== "regen", uhr: () => true, anker: () => SZ.anker.katze, dauer: 2600 },
  { id: "vogelhaus", blase: "unten", wo: "am Vogelfutter", taler: 3, satz: "Die Meisen sind zuerst da. Der Spatz tut so, als wär er eingeladen.", jahr: c => [11, 12, 1, 2, 3].includes(c.m), uhr: c => c.h >= 8 && c.h < 16, anker: () => SZ.anker.futter, dauer: 3400, bleibt: true },
  { id: "schneemann", wo: "auf der Wiese", taler: 3, wer: "huhn", satz: "Schneemann steht. Ich halt lieber Abstand – der guckt so.", jahr: c => c.schnee, uhr: c => c.h >= 8 && c.h < 18, anker: () => [SCHNEEMANN[0], SCHNEEMANN[1] - 34], dauer: 3400, bleibt: true },
  { id: "laub", wo: "auf der Wiese", satz: "Laub zusammengeharkt. Ein Igel ist schon eingezogen.", jahr: c => (c.m === 10 || c.m === 11) && !c.schnee, uhr: c => c.h >= 8 && c.h < 18, anker: () => [LAUBHAUFEN[0], LAUBHAUFEN[1] - 6], dauer: 3000, bleibt: true },
  { id: "igel", wo: "am Busch", satz: "Er schmatzt. Sehr laut für so einen Kleinen.", jahr: c => c.m >= 4 && c.m <= 10, uhr: c => c.h >= 17 && c.h < 23, anker: () => SZ.anker.igel, dauer: 3000, abends: true },
  { id: "laterne", blase: "unten", wo: "an der Laterne", satz: "Flackert kurz, dann brennt sie. Jetzt findet jeder heim.", jahr: () => true, uhr: c => c.h >= 16 && c.h < 23 && (c.nacht > .05 || c.gold > .25 || c.h >= 18), anker: () => SZ.anker.laterne, dauer: 2400, bleibt: true, abends: true },
  { id: "seifenblasen", blase: "unten", wo: "auf deinem Balkon", wer: "huhn", satz: "Ich hab eine gefangen. Sie war weg. Betrug!", jahr: c => c.m >= 5 && c.m <= 8 && c.art !== "regen", uhr: c => c.h >= 9 && c.h < 20 && c.tag, anker: () => SZ.anker.balkon, dauer: 3400 },
  { id: "kraniche", blase: "unten", wo: "am Himmel", taler: 3, wer: "huhn", satz: "Die ziehen los. Ich nicht. Ich hab hier meine Fensterbank.", jahr: c => c.m === 10 || c.m === 3, uhr: c => c.h >= 8 && c.h < 17 && c.tag, anker: () => [700, 120], dauer: 4200 }
];
/* Die Tagesauswahl hängt nur vom echten Wetter und vom Datum ab (K-F-13) – Umstellen des Bildwetters ändert sie nicht */
function spielKontext() {
  const d = jetzt(), so = sonne(d), nacht = clamp((-so.alt - 2) / 8, 0, 1), gold = clamp(1 - Math.abs(so.alt - 4) / 10, 0, 1) * (1 - nacht), BW = bildWetter(true);
  return { h: d.getHours(), m: d.getMonth() + 1, nacht, gold, tag: nacht < .3, art: BW.art, schnee: schneeTag(d) || BW.art === "schnee" };
}
function bildSpielStand() {
  if (!S.bildspiel || typeof S.bildspiel !== "object") S.bildspiel = { tag: "", erledigt: {}, zustand: {}, schneemann: "" };
  if (S.bildspiel.tag !== heute()) S.bildspiel = { tag: heute(), erledigt: {}, zustand: {}, schneemann: S.bildspiel.schneemann || "" };
  if (!S.bildspiel.erledigt || typeof S.bildspiel.erledigt !== "object") S.bildspiel.erledigt = {};
  if (!S.bildspiel.zustand || typeof S.bildspiel.zustand !== "object") S.bildspiel.zustand = {};
  return S.bildspiel;
}
/* Die Auswahl des Tages: 2–3 Spielereien, deterministisch (Datum + Seed), höchstens eine abendliche, nie zwei am selben Ort */
function spieleDesTages() {
  const st = bildSpielStand();
  if (Array.isArray(st.wahl)) return st.wahl.map(id => BILDSPIELE.find(s => s.id === id)).filter(Boolean);
  const c = spielKontext(), key = "spiel" + heute() + S.seed;
  const kand = BILDSPIELE.filter(s => s.jahr(c)).sort((a, b) => hash32(key + a.id) - hash32(key + b.id));
  const n = 2 + hash32(key) % 2, wahl = [];
  for (const s of kand) { if (wahl.length >= n) break; if (s.abends && wahl.some(x => x.abends)) continue; if ((s.id === "blumen" && wahl.some(x => x.id === "seifenblasen")) || (s.id === "seifenblasen" && wahl.some(x => x.id === "blumen"))) continue; if (s.id === "licht" && wahl.some(x => x.id === "laterne") || s.id === "laterne" && wahl.some(x => x.id === "licht")) continue; wahl.push(s); }
  st.wahl = wahl.map(s => s.id); // für heute festhalten
  return wahl;
}
function spieleAktiv() { if (!S.onboard) return []; const c = spielKontext(); return spieleDesTages().filter(s => s.uhr(c)); }
function bildSpielZeile() {
  const st = bildSpielStand(), offen = spieleAktiv().filter(s => !st.erledigt[s.id]);
  const orte = [...new Set(offen.map(s => s.wo))];
  return `<p class="klein bildspiel-zeile${orte.length ? "" : " leer"}" id="bildspiel-zeile">${orte.length ? `<span class="funke-mini" aria-hidden="true"></span>Heute funkelt’s im Bild ${esc(orte.length > 1 ? orte.slice(0, -1).join(", ") + " und " + orte[orte.length - 1] : orte[0])}. Tipp drauf!` : ""}</p>`;
}
function spielSatz(s) { const sk = typeof skinEffektiv === "function" && skinEffektiv("huhn"), r = sk && typeof SKIN_REAKTION !== "undefined" && SKIN_REAKTION[sk] && SKIN_REAKTION[sk][s.id]; return r ? { text: r, wer: "huhn" } : { text: s.satz, wer: s.wer || "" }; }
function spielAusloesen(s, cx, cy) {
  const st = bildSpielStand(), erstes = !st.erledigt[s.id];
  if (s.id === "licht") st.zustand.licht = !st.zustand.licht; else if (s.bleibt) st.zustand[s.id] = true;
  if (s.id === "schneemann") st.schneemann = heute();
  const satz = spielSatz(s);
  if (erstes) { st.erledigt[s.id] = true; S.taler += s.taler || 2; if (typeof PLAK !== "undefined") PLAK.leise = true; }
  speichern(); haptik(erstes ? "erfolg" : "auswahl");
  fxAnim(s, () => { const c = document.getElementById("bild-gross"); if (c && s.bleibt) zeichneSzene(c, {}); });
  if (erstes || s.id !== "licht" || st.zustand.licht) setTimeout(() => fxBlase(s, satz, erstes ? (s.taler || 2) : 0), REDUCED() ? 0 : Math.min(1300, s.dauer * .42));
  const z = document.getElementById("bildspiel-zeile"); if (z) z.outerHTML = bildSpielZeile();
}
/* Was Rita heute im Bild gemacht hat, bleibt bis zum Abend sichtbar */
function bildSpielZustand(ctx, nacht, gold, schnee) {
  const st = S.bildspiel && S.bildspiel.tag === heute() ? S.bildspiel.zustand : {}, A0 = SZ.anker;
  if (st.licht && A0.ritafenster) { const [fx, fy] = A0.ritafenster, f = new Path2D(); rr(f, fx - 19, fy - 15, 38, 30, 2); ctx.fillStyle = "#F4CF7E"; ctx.fill(f); gluehen(ctx, fx, fy, 46, .9);
    ctx.fillStyle = "#7A3A2A"; ctx.beginPath(); ctx.moveTo(fx + 8, fy - 9); ctx.lineTo(fx + 14, fy - 9); ctx.lineTo(fx + 16, fy - 3); ctx.lineTo(fx + 6, fy - 3); ctx.fill(); ctx.fillRect(fx + 10.4, fy - 3, 1.4, 9); ctx.fillStyle = "#D8CDB6"; ctx.fillRect(fx - 1.3, fy - 15, 2.6, 30); }
  if (st.laterne && A0.laterne) { const [lx, ly] = A0.laterne; ctx.fillStyle = "#FFE3A0"; ctx.fillRect(lx - 6, ly, 12, 3); gluehen(ctx, lx, ly + 4, 60, .95); }
  if (st.blumen && A0.balkon) { const [bx, by] = A0.balkon, p = new Path2D(); for (let i = 0; i < 6; i++) kreis(p, bx - 22 + i * 8.6, by - 2 - (i % 2) * 3, 2.8); papier(ctx, p, "#E0558A", .6); const q = new Path2D(); for (let i = 0; i < 5; i++) kreis(q, bx - 18 + i * 8.6, by - 4 + (i % 2) * 2, 2.2); papier(ctx, q, "#F2D27A", .6); }
  if (st.vogelhaus && A0.futter && (S.maxStufe || 0) < 10) { const [fx, fy] = A0.futter; ctx.strokeStyle = "#5A4630"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(fx, fy - 12); ctx.lineTo(fx, fy - 4); ctx.stroke(); const k = new Path2D(); kreis(k, fx, fy, 5); papier(ctx, k, "#C9A46A", 1); ctx.strokeStyle = "rgba(60,80,50,.7)"; ctx.lineWidth = .7; for (const o of [-3, 0, 3]) { ctx.beginPath(); ctx.moveTo(fx + o, fy - 5); ctx.lineTo(fx + o, fy + 5); ctx.stroke(); } }
  if (st.laub) { const [lx, ly] = LAUBHAUFEN, p = new Path2D(), r = mulberry32(31); for (let i = 0; i < 30; i++) { const a = r() * Math.PI, d0 = r() * 24; ellipse(p, lx + Math.cos(a) * d0 * 1.5, ly - Math.sin(a) * d0 * .8, 4, 2.2, r() * 3); } papier(ctx, p, "#C98A3E", 1.5); const q = new Path2D(); for (let i = 0; i < 16; i++) ellipse(q, lx + (r() - .5) * 54, ly - 2 - r() * 14, 3.4, 1.9, r() * 3); papier(ctx, q, "#A55A2E", 0); }
  if (schnee && S.bildspiel && S.bildspiel.schneemann) schneemannMalen(ctx, SCHNEEMANN[0], SCHNEEMANN[1], 1);
}
function schneemannMalen(ctx, x, y, s, teil = 1) {
  const p = new Path2D(); if (teil > 0) kreis(p, x, y - 14 * s, 15 * s); if (teil > .4) kreis(p, x, y - 36 * s, 11 * s); if (teil > .65) kreis(p, x, y - 53 * s, 8 * s);
  papier(ctx, p, "#FBFBF6", 2);
  if (teil > .8) { ctx.fillStyle = "#1C2620"; for (const [a, b] of [[-3, -55], [3, -55], [0, -38], [0, -33]]) { ctx.beginPath(); ctx.arc(x + a * s, y + b * s, 1.4 * s, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#E8902E"; ctx.beginPath(); ctx.moveTo(x, y - 52 * s); ctx.lineTo(x + 9 * s, y - 50.6 * s); ctx.lineTo(x, y - 49.4 * s); ctx.fill();
    const hut = typeof skinEffektiv === "function" && skinEffektiv("huhn"), farbe = { "h-chullo": "#C8363A", "h-weihnacht": "#C8363A", "h-hexe": "#5A3E86", "h-pirat": "#1E1E24", "h-zylinder": "#2A2A30", "h-wikinger": "#8E959A", "h-koch": "#FBFAF6" }[hut] || "#2E4E8E";
    ctx.fillStyle = farbe; ctx.beginPath(); ctx.ellipse(x, y - 60 * s, 9 * s, 2.6 * s, 0, 0, TAU); ctx.fill(); ctx.fillRect(x - 6 * s, y - 70 * s, 12 * s, 10 * s);
    ctx.strokeStyle = "#6B4A30"; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.moveTo(x - 10 * s, y - 38 * s); ctx.lineTo(x - 22 * s, y - 46 * s); ctx.moveTo(x + 10 * s, y - 38 * s); ctx.lineTo(x + 21 * s, y - 44 * s); ctx.stroke(); }
}

/* ============================================================
   Effekt-Ebene über dem großen Bild: Wetter, Funkeln, Animationen
   ============================================================ */
const FX = { cv: null, ctx: null, raf: 0, teil: [], anim: [], sichtbar: true, letzt: 0, art: "", geo: null, w: 0, h: 0, dpr: 1, io: null };
function fxP(a) { const g = FX.geo; return [g.ox + a[0] * g.sk, g.oy + a[1] * g.sk]; }
function fxK() { return clamp((FX.geo ? FX.geo.sk : .36) / .36, .8, 1.8); }
function fxEinrichten(canvas) {
  const b = canvas.parentElement; if (!b) return;
  let cv = b.querySelector("canvas.bild-fx");
  if (!cv) { cv = document.createElement("canvas"); cv.className = "bild-fx"; cv.setAttribute("aria-hidden", "true"); b.appendChild(cv); FX.teil = []; FX.art = "";
    if (FX.io) FX.io.disconnect(); if (typeof IntersectionObserver !== "undefined") { FX.io = new IntersectionObserver(e => { FX.sichtbar = e[0].isIntersecting; if (FX.sichtbar) fxLos(); }); FX.io.observe(cv); } }
  const dpr = Math.min(devicePixelRatio || 1, 2), w = canvas.clientWidth, h = canvas.clientHeight;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  FX.cv = cv; FX.ctx = cv.getContext("2d"); FX.dpr = dpr; FX.w = w; FX.h = h;
  FX.geo = { sk: SZ.sk, ox: SZ.ox, oy: SZ.oy, anker: { ...SZ.anker }, eiche: SZ.eicheGeo, nacht: LICHT.nacht, gold: LICHT.gold };
  const art = SZ.wetter + (S.bildWetter || ""); if (art !== FX.art) { FX.art = art; fxTeilchen(); }
  fxLos();
}
function fxTeilchen() {
  const BW = bildWetter(), r = Math.random, w = FX.w, h = FX.h; FX.teil = [];
  if (BW.art === "regen") for (let i = 0; i < 110; i++) FX.teil.push({ x: r() * (w + 60) - 30, y: r() * h, v: 7 + r() * 5, l: 9 + r() * 9, a: .25 + r() * .35 });
  if (BW.art === "schnee") for (let i = 0; i < 80; i++) FX.teil.push({ x: r() * w, y: r() * h, v: .35 + r() * .7, rr: .9 + r() * 1.9, ph: r() * TAU });
  if (BW.art === "nebel") for (let i = 0; i < 5; i++) FX.teil.push({ x: r() * w, y: h * (.35 + r() * .5), v: .08 + r() * .14, rx: w * (.35 + r() * .3), ry: 18 + r() * 22 });
  if (BW.art === "wolken") for (let i = 0; i < 3; i++) FX.teil.push({ x: r() * w, y: h * (.05 + r() * .22), v: .06 + r() * .1, s: .7 + r() * .6, wolke: 1 });
  if (BW.wind > 26 && !["regen", "schnee"].includes(BW.art)) { const SA = SZ.SA || SAISON.sommer, L = SA.laub || ["#C98A3E", "#A55A2E"]; for (let i = 0; i < 9; i++) FX.teil.push({ x: r() * w, y: h * (.4 + r() * .5), v: 1.2 + r() * 1.6, ph: r() * TAU, blatt: L[i % L.length] }); }
}
function fxLos() {
  if (FX.raf || !FX.cv) return;
  const f = now => {
    FX.raf = 0; if (!FX.cv || !FX.cv.isConnected) return;
    if (document.hidden || !FX.sichtbar) return;
    if (now - FX.letzt >= 32) { FX.letzt = now; try { fxMalen(now); } catch (e) { } }
    if (!REDUCED() || FX.anim.length) FX.raf = requestAnimationFrame(f);
  };
  FX.raf = requestAnimationFrame(f);
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) fxLos(); });
function fxMalen(now) {
  const g = FX.ctx, w = FX.w, h = FX.h, ruhig = REDUCED(); if (!g || !FX.geo) return;
  g.setTransform(FX.dpr, 0, 0, FX.dpr, 0, 0); g.clearRect(0, 0, w, h);
  // Wetter
  for (const p of FX.teil) {
    if (p.wolke) { if (!ruhig) p.x += p.v; if (p.x > w + 90) p.x = -90; g.save(); g.globalAlpha = (FX.geo.nacht || 0) > .3 ? .45 : .55; g.fillStyle = (FX.geo.nacht || 0) > .3 ? "#56658A" : "#F7F5EE"; g.beginPath(); for (let k = 0; k < 4; k++) g.ellipse(p.x + (k - 1.5) * 26 * p.s, p.y - (k === 1 || k === 2 ? 9 : 0) * p.s, 24 * p.s, 13 * p.s, 0, 0, TAU); g.fill(); g.restore(); continue; }
    if (p.rx) { if (!ruhig) p.x += p.v; if (p.x - p.rx > w) p.x = -p.rx; const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rx); gr.addColorStop(0, "rgba(236,238,234,.42)"); gr.addColorStop(1, "rgba(236,238,234,0)"); g.save(); g.fillStyle = gr; g.translate(p.x, p.y); g.scale(1, p.ry / p.rx); g.translate(-p.x, -p.y); g.beginPath(); g.arc(p.x, p.y, p.rx, 0, TAU); g.fill(); g.restore(); continue; }
    if (p.blatt) { if (!ruhig) { p.x += p.v; p.ph += .08; p.y += Math.sin(p.ph) * .9; } if (p.x > w + 10) { p.x = -10; p.y = h * (.4 + Math.random() * .5); } g.save(); g.translate(p.x, p.y); g.rotate(p.ph); g.fillStyle = p.blatt; g.beginPath(); g.ellipse(0, 0, 3.4, 1.8, 0, 0, TAU); g.fill(); g.restore(); continue; }
    if (p.l) { if (!ruhig) { p.y += p.v; p.x -= p.v * .22; } if (p.y > h) { p.y = -p.l; p.x = Math.random() * (w + 60) - 10; } g.strokeStyle = `rgba(226,234,242,${p.a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.l * .22, p.y + p.l); g.stroke(); continue; }
    if (p.rr) { if (!ruhig) { p.y += p.v; p.ph += .02; p.x += Math.sin(p.ph) * .35; } if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; } g.fillStyle = "rgba(255,255,255,.92)"; g.beginPath(); g.arc(p.x, p.y, p.rr, 0, TAU); g.fill(); }
  }
  // Silvester-Funkeln
  if (typeof festHeute === "function") { const F = festHeute(), hh = jetzt().getHours(); if ((F.silvester && hh >= 18) || (F.neujahr && hh < 1)) fxFeuerwerk(g, now); }
  // FUN-09: was heute im Kramladen fürs Bild gekauft wurde, leuchtet sanft auf
  { const G = S.gekauft || {}, h0 = heute(), hh = jetzt().getHours(), n = (FX.geo.nacht || 0) > .3;
    const ORTE = { traenke: [190, 728], igelhaus: [252, 662], rosenbogen: wegPunkt(.3).slice(0, 2).map((v, i) => i ? v - 26 : v), haengematte: [172, 632], rotkehlchen: hh >= 5 && hh < 12 ? [560, PARK.vorn - 12] : null, sternbilder: n ? [240, 120] : null };
    for (const id in ORTE) if (G[id] === h0 && ORTE[id]) { const [x, y] = fxP(ORTE[id]), pu = ruhig ? .7 : .55 + .45 * Math.sin(now / 420), r = 26 * k;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,240,190,${.5 * pu})`); gr.addColorStop(1, "rgba(255,240,190,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
      g.strokeStyle = `rgba(242,195,107,${.9 * pu})`; g.lineWidth = 2; g.setLineDash([4, 4]); g.beginPath(); g.arc(x, y, r * .8, 0, TAU); g.stroke(); g.setLineDash([]); } }
  // Funkeln an den Spielereien des Tages
  const st = bildSpielStand(), k = fxK();
  for (const s of spieleAktiv()) { if (st.erledigt[s.id]) continue; const a = s.anker(); if (!a) continue; const [x, y] = fxP(a); funkeln(g, x, y, k, ruhig ? 0 : now / 1000 + hash32(s.id) % 7); }
  // Laufende Animationen
  FX.anim = FX.anim.filter(an => { const t = clamp((now - an.t0) / an.dauer, 0, 1); try { an.mal(g, ruhig ? 1 : t, an.P, k * 1.3, an); } catch (e) { } if (t >= 1 || ruhig && now - an.t0 > 1800) { if (an.fertig) an.fertig(); return false; } return true; });
}
function stern4(g, x, y, r) { g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x + r * .18, y - r * .18, x + r, y); g.quadraticCurveTo(x + r * .18, y + r * .18, x, y + r); g.quadraticCurveTo(x - r * .18, y + r * .18, x - r, y); g.quadraticCurveTo(x - r * .18, y - r * .18, x, y - r); g.fill(); }
function funkeln(g, x, y, k, t) {
  const pos = [[0, -16, 0], [13, 3, 2.1], [-12, 6, 4.2]];
  g.save();
  const halo = g.createRadialGradient(x, y - 4 * k, 0, x, y - 4 * k, 22 * k); halo.addColorStop(0, `rgba(255,236,170,${t ? .32 + .14 * Math.sin(t * 2) : .36})`); halo.addColorStop(1, "rgba(255,236,170,0)"); g.fillStyle = halo; g.beginPath(); g.arc(x, y - 4 * k, 22 * k, 0, TAU); g.fill();
  for (const [dx, dy, ph] of pos) { const pu = t ? .55 + .45 * Math.sin(t * 2.4 + ph) : .8, r = (4 + 3.4 * pu) * k;
    g.fillStyle = "rgba(90,60,10,.35)"; stern4(g, x + dx * k + .8, y + dy * k + 1, r); g.fillStyle = "#FFF4C8"; stern4(g, x + dx * k, y + dy * k, r); g.fillStyle = "#F2C36B"; stern4(g, x + dx * k, y + dy * k, r * .45); }
  g.restore();
}
function fxFeuerwerk(g, now) {
  const t = now / 1000, k = fxK();
  for (let i = 0; i < 3; i++) { const z = (t * .45 + i / 3) % 1, x = FX.w * (.2 + .3 * i) + Math.sin(i * 7) * 20, y = FX.h * (.12 + .06 * i), c = ["#F2C36B", "#E0558A", "#8FD0F0"][i];
    g.save(); g.globalAlpha = 1 - z; g.fillStyle = c; for (let j = 0; j < 14; j++) { const a = j / 14 * TAU; g.beginPath(); g.arc(x + Math.cos(a) * z * 34 * k, y + Math.sin(a) * z * 34 * k + z * z * 10, 1.6 * k, 0, TAU); g.fill(); } g.restore(); }
}
function fxAnim(s, fertig) {
  const a = s.anker(); if (!a || !FX.geo) { if (fertig) fertig(); return; }
  FX.anim = FX.anim.filter(x => x.id !== s.id);
  FX.anim.push({ id: s.id, t0: performance.now(), dauer: s.dauer, P: fxP(a), mal: SPIEL_ANIM[s.id] || (() => { }), fertig, licht: S.bildspiel && S.bildspiel.zustand.licht });
  if (FX.raf) { cancelAnimationFrame(FX.raf); FX.raf = 0; } fxLos();
}
function fxBlase(s, satz, taler) {
  const b = FX.cv && FX.cv.parentElement; if (!b) return; const a = s.anker(); if (!a) return;
  b.querySelectorAll(".bild-blase").forEach(x => x.remove());
  const [x, y] = fxP(a), unten = s.blase === "unten" || y < 90, el = document.createElement("div"); el.className = "bild-blase" + (unten ? " unten" : "");
  el.innerHTML = `${satz.wer === "huhn" ? `<span class="wer">Hühnchen</span>` : ""}${esc(satz.text)}${taler ? `<span class="bb-taler">+${taler} Taler</span>` : ""}`;
  el.style.top = (unten ? y + 30 : y - 26) + "px"; b.appendChild(el);
  const bh = el.offsetHeight; if (unten && y + 30 + bh > FX.h - 4 && y - 26 - bh > 4) { el.classList.remove("unten"); el.style.top = (y - 26) + "px"; } else if (!unten && y - 26 - bh < 4) { el.classList.add("unten"); el.style.top = Math.min(y + 30, FX.h - bh - 4) + "px"; }
  const hw = Math.min(el.offsetWidth, FX.w - 12) / 2, lx = clamp(x, hw + 6, FX.w - hw - 6); el.style.left = lx + "px"; el.style.setProperty("--pfeil", clamp(x - lx, -hw + 14, hw - 14) + "px");
  sag(satz.text);
  setTimeout(() => { el.classList.add("weg"); setTimeout(() => el.remove(), 400); }, Math.max(3400, s.dauer * .7 + 1600));
}
/* Antippen: kurzes Tippen auf ein Funkeln geht vor dem Orts-Blatt; Ziehen und Halten bleiben bei der Lupe */
document.addEventListener("click", ev => {
  const c = ev.target && ev.target.closest ? ev.target.closest("#bild-gross") : null; if (!c || !FX.cv || !FX.geo) return;
  const r = FX.cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
  let best = null, bd = 1e9;
  for (const s of spieleAktiv()) { const a = s.anker(); if (!a) continue; const [px, py] = fxP(a), dd = Math.hypot(x - px, y - py); if (dd < 30 * fxK() && dd < bd) { best = s; bd = dd; } }
  if (!best) return;
  ev.stopImmediatePropagation(); ev.preventDefault(); lupeWeg();
  spielAusloesen(best, ev.clientX, ev.clientY);
}, true);

/* ---------- Die kleinen Animationen (Bildschirm-Pixel, k = Maßstab) ---------- */
const ein = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
function eichhMalen(g, x, y, k, sitzt, kopfOben = true) {
  g.save(); g.translate(x, y); g.scale(k, k); if (!kopfOben) g.rotate(Math.PI);
  g.fillStyle = "#B5652B"; g.beginPath(); g.moveTo(2, 6); g.quadraticCurveTo(-14, 10, -11, -6); g.quadraticCurveTo(-9, -16, -3, -6); g.closePath(); g.fill();
  g.fillStyle = "#A8562A"; g.beginPath(); g.ellipse(1, 0, 4.6, 7.4, sitzt ? 0 : -.2, 0, TAU); g.fill(); g.beginPath(); g.arc(2, -8.4, 3.8, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(.4, -11); g.lineTo(.8, -14.6); g.lineTo(2.4, -11.4); g.fill();
  g.fillStyle = "#EAD3B0"; g.beginPath(); g.ellipse(2.6, 1, 2, 4.6, 0, 0, TAU); g.fill();
  g.fillStyle = "#1C2620"; g.beginPath(); g.arc(3.6, -9, .9, 0, TAU); g.fill(); g.restore();
}
function nussMalen(g, x, y, k) { g.fillStyle = "#8A5A2B"; g.beginPath(); g.ellipse(x, y, 2.8 * k, 3.4 * k, 0, 0, TAU); g.fill(); g.fillStyle = "#5A3A1A"; g.beginPath(); g.ellipse(x, y - 2.4 * k, 3 * k, 1.4 * k, 0, 0, TAU); g.fill(); }
function vogelMalen(g, x, y, k, farbe, brust, links, pick = 0) {
  g.save(); g.translate(x, y); g.scale(links ? -k : k, k);
  g.fillStyle = farbe; g.beginPath(); g.ellipse(0, 0, 5.4, 4, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-4, -1); g.lineTo(-10, 1); g.lineTo(-4, 2.4); g.fill();
  g.beginPath(); g.arc(4.2, -3 + pick, 3, 0, TAU); g.fill(); if (brust) { g.fillStyle = brust; g.beginPath(); g.ellipse(1.6, 1.2, 3.2, 2.4, 0, 0, TAU); g.fill(); }
  g.fillStyle = "#2A2A2A"; g.beginPath(); g.moveTo(7, -3.4 + pick); g.lineTo(9.6, -2.6 + pick); g.lineTo(7, -1.8 + pick); g.fill(); g.beginPath(); g.arc(5, -3.8 + pick, .7, 0, TAU); g.fill(); g.restore();
}
function herzMalen(g, x, y, r, c) { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + r * .9); g.bezierCurveTo(x - r * 1.4, y - r * .2, x - r * .6, y - r * 1.2, x, y - r * .4); g.bezierCurveTo(x + r * .6, y - r * 1.2, x + r * 1.4, y - r * .2, x, y + r * .9); g.fill(); }
const SPIEL_ANIM = {
  eichhoernchen(g, t, [x, y], k) {
    // klein (Maßstab wie die Figuren im Bild): flitzt den Ast entlang, fängt die Nuss, macht Männchen, flitzt zurück
    const s = k * .42, n = ein(t, .05, .34);
    if (t < .4) { const sx = x + 46 * k, sy = y + 46 * k; nussMalen(g, sx + (x - sx) * n, sy + (y - 3 * k - sy) * n - Math.sin(n * Math.PI) * 30 * k, s * 1.2); }
    let ex, sitzt = false, op = 1;
    if (t < .36) ex = x - 22 * k + 22 * k * ein(t, 0, .3); else if (t < .72) { ex = x; sitzt = true; } else { ex = x - 26 * k * ein(t, .72, 1); op = 1 - ein(t, .86, 1); }
    g.save(); g.globalAlpha = op * ein(t, 0, .08); eichhMalen(g, ex, y - 7 * s, s, sitzt, true); if (sitzt) nussMalen(g, ex + 1.6 * s, y - 8 * s, s * .9); g.restore();
  },
  blumen(g, t, [x, y], k) {
    const kx = x + 18 * k, ky = y - 26 * k, w = -.7 * ein(t, .08, .3) * (1 - ein(t, .78, .95));
    g.save(); g.globalAlpha = ein(t, 0, .1) * (1 - ein(t, .88, 1)); g.translate(kx, ky); g.rotate(w); g.fillStyle = "#4F8A9E"; g.fillRect(-7 * k, -5 * k, 13 * k, 10 * k); g.beginPath(); g.moveTo(-7 * k, -3 * k); g.lineTo(-17 * k, -9 * k); g.lineTo(-16 * k, -6 * k); g.lineTo(-7 * k, 1 * k); g.fill();
    g.strokeStyle = "#4F8A9E"; g.lineWidth = 1.6 * k; g.beginPath(); g.arc(1 * k, -6 * k, 5 * k, Math.PI, 0); g.stroke(); g.restore();
    for (let i = 0; i < 6; i++) { const tt = ein(t, .26 + i * .05, .5 + i * .05); if (tt <= 0 || tt >= 1) continue; g.fillStyle = "rgba(140,190,220,.9)"; g.beginPath(); g.ellipse(x - 2 * k - i * 2.4 * k, y - 32 * k + tt * 30 * k, 1.3 * k, 2 * k, 0, 0, TAU); g.fill(); }
    const b = ein(t, .55, .85); if (b > 0) for (let i = 0; i < 5; i++) { const bx = x - 20 * k + i * 10 * k, r = (1 + Math.sin(b * Math.PI) * .5) * 2.8 * k * b; g.fillStyle = ["#E0558A", "#F2D27A", "#D9603C", "#C7B6E6", "#E0558A"][i]; g.beginPath(); g.arc(bx, y - 2 * k, r, 0, TAU); g.fill(); }
  },
  nachbar(g, t, [x, y], k) {
    const op = ein(t, 0, .15) * (1 - ein(t, .86, 1)), nx = x - 26 * k, ny = y + 12 * k;
    g.save(); g.globalAlpha = op; g.translate(nx, ny); g.scale(k * 1.15, k * 1.15);
    g.fillStyle = "#4A4A52"; g.fillRect(-4, -14, 3.4, 14); g.fillRect(.6, -14, 3.4, 14); g.fillStyle = "#9A3A2A"; g.fillRect(-5, -1, 5, 2); g.fillRect(.6, -1, 5, 2);
    g.fillStyle = "#8A6A48"; g.beginPath(); g.moveTo(-5.4, -14); g.lineTo(-6, -28); g.lineTo(6, -28); g.lineTo(5.4, -14); g.fill();
    g.fillStyle = "#E6B593"; g.beginPath(); g.arc(0, -32.6, 4.6, 0, TAU); g.fill(); g.fillStyle = "#B9AB8E"; g.beginPath(); g.ellipse(0, -36, 4.6, 1.8, 0, 0, TAU); g.fill();
    const wink = t > .18 && t < .85 ? Math.sin((t - .18) * TAU * 3.2) * .55 : 0;
    g.save(); g.translate(-5, -26); g.scale(-1, 1); g.rotate(-2.3 + wink); g.fillStyle = "#8A6A48"; g.fillRect(0, -1.6, 10, 3.2); g.fillStyle = "#E6B593"; g.beginPath(); g.arc(11, 0, 2, 0, TAU); g.fill(); g.restore();
    g.restore();
    const hop = Math.sin(ein(t, .45, .62) * Math.PI) * 6 * k; if (hop > .1) { g.fillStyle = "#2E4660"; g.fillRect(x - 1 * k, y - 12 * k - hop, 8 * k, 2.4 * k); }
  },
  licht(g, t, [x, y], k, an) {
    const z = ein(t, 0, .5), gr = g.createRadialGradient(x, y, 0, x, y, 40 * k);
    const a0 = an.licht ? z : 1 - z; gr.addColorStop(0, `rgba(255,226,150,${.75 * a0})`); gr.addColorStop(1, "rgba(255,226,150,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 40 * k, 0, TAU); g.fill();
  },
  katze(g, t, [x, y], k) {
    for (let i = 0; i < 3; i++) { const tt = ein(t, i * .18, .55 + i * .18); if (tt <= 0 || tt >= 1) continue; g.save(); g.globalAlpha = Math.sin(tt * Math.PI); herzMalen(g, x + (i - 1) * 9 * k + Math.sin(tt * 6) * 3 * k, y - 8 * k - tt * 30 * k, 3.4 * k, i === 1 ? "#E0558A" : "#D9473A"); g.restore(); }
    const w = ein(t, .1, .9); if (w > 0 && w < 1) { g.save(); g.globalAlpha = Math.sin(w * Math.PI); g.strokeStyle = "#FBF8F1"; g.lineWidth = 1.6 * k; g.lineCap = "round"; for (let j = 0; j < 3; j++) { const yy = y - 4 * k - j * 6 * k - w * 6 * k; g.beginPath(); g.moveTo(x + 14 * k, yy); g.quadraticCurveTo(x + 17 * k, yy - 3 * k, x + 20 * k, yy); g.quadraticCurveTo(x + 23 * k, yy + 3 * k, x + 26 * k, yy); g.stroke(); } g.restore(); }
  },
  vogelhaus(g, t, [x, y], k) {
    for (let i = 0; i < 12; i++) { const tt = ein(t, i * .02, .3 + i * .02); if (tt <= 0 || tt >= 1) continue; g.fillStyle = "#C9A46A"; g.beginPath(); g.arc(x + ((i * 37) % 11 - 5) * k, y - 16 * k + tt * 24 * k, 1.2 * k, 0, TAU); g.fill(); }
    const voegel = [["#3E6FA8", "#F2D27A", -12, -2, .25], ["#3E6FA8", "#F2D27A", 11, 2, .38], ["#8A6A4A", "#C9B89A", -2, 10, .52]];
    voegel.forEach(([c, b, dx, dy, st], i) => { const tt = ein(t, st, st + .22); if (tt <= 0) return; const fx = x + dx * k + (1 - tt) * (90 + i * 20) * k, fy = y + dy * k - (1 - tt) * 40 * k - Math.sin(tt * Math.PI) * 10 * k, pick = tt >= 1 ? Math.max(0, Math.sin((t - st) * 28)) * 2 : 0; vogelMalen(g, fx, fy, k * 1.1, c, b, dx > 0 ? false : true, pick); });
  },
  schneemann(g, t, [x, y], k) {
    const g2 = FX.geo; g.save(); g.translate(g2.ox, g2.oy); g.scale(g2.sk, g2.sk); const s = clamp(.9 / g2.sk * .36, .9, 1.6);
    schneemannMalen(g, SCHNEEMANN[0], SCHNEEMANN[1], 1, ein(t, 0, .85)); g.restore();
    if (t < .3) { g.fillStyle = "rgba(255,255,255,.9)"; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x - 30 * k + t * 100 * k + i * 3, y + 30 * k - Math.random() * 3, 1.4 * k, 0, TAU); g.fill(); } }
  },
  laub(g, t, [x, y], k) {
    const r = mulberry32(5); for (let i = 0; i < 16; i++) { const sx = x + (r() - .5) * 120 * k, sy = y + (r() - .2) * 20 * k, tt = ein(t, .05 + i * .02, .6 + i * .015); g.fillStyle = i % 2 ? "#C98A3E" : "#A55A2E"; g.save(); g.translate(sx + (x - sx) * tt, sy + (y - sy) * tt); g.rotate(i + t * 6); g.beginPath(); g.ellipse(0, 0, 3.2 * k, 1.8 * k, 0, 0, TAU); g.fill(); g.restore(); }
    const rx = x + Math.sin(t * 14) * 26 * k * (1 - ein(t, .6, .7)); g.save(); g.globalAlpha = 1 - ein(t, .65, .75); g.strokeStyle = "#7A5A3A"; g.lineWidth = 2 * k; g.beginPath(); g.moveTo(rx + 10 * k, y - 34 * k); g.lineTo(rx, y + 2 * k); g.stroke(); g.lineWidth = 1.4 * k; g.beginPath(); g.moveTo(rx - 7 * k, y + 2 * k); g.lineTo(rx + 7 * k, y + 2 * k); for (let j = -6; j <= 6; j += 3) { g.moveTo(rx + j * k, y + 2 * k); g.lineTo(rx + j * k, y + 6 * k); } g.stroke(); g.restore();
    const ig = ein(t, .72, .9); if (ig > 0) { g.fillStyle = "#5A4632"; g.beginPath(); g.ellipse(x + 10 * k, y + 2 * k - ig * 4 * k, 6 * k, 3.6 * k * ig, 0, Math.PI, 0); g.fill(); g.fillStyle = "#1C1A16"; g.beginPath(); g.arc(x + 16 * k, y + 1 * k - ig * 4 * k, 1 * k, 0, TAU); g.fill(); }
  },
  igel(g, t, [x, y], k) {
    const ax = x - 50 * k + 44 * k * ein(t, 0, .3), ay = y + 10 * k; g.fillStyle = "#F4EDD6"; g.beginPath(); g.arc(ax, ay, 4 * k, Math.PI * .1, Math.PI * 1.1); g.fill(); g.fillStyle = "#C8363A"; g.beginPath(); g.arc(ax, ay, 4 * k, Math.PI * 1.1, Math.PI * 1.25); g.lineTo(ax, ay); g.fill();
    const ix = x + 16 * k - 12 * k * ein(t, .25, .55), op = ein(t, .2, .35);
    g.save(); g.globalAlpha = op; g.translate(ix, y + 10 * k); g.scale(k * 1.3, k * 1.3); g.fillStyle = "#5A4632"; g.beginPath(); for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI, R0 = i % 2 ? 7 : 9; g.lineTo(Math.cos(a) * R0 * 1.2, Math.sin(a) * R0 * .8); } g.fill();
    g.fillStyle = "#C9A27E"; g.beginPath(); g.moveTo(-8, -2); g.lineTo(-14, 0); g.lineTo(-8, 1); g.fill(); g.fillStyle = "#1C1A16"; g.beginPath(); g.arc(-14, 0, .9, 0, TAU); g.fill(); g.restore();
    if (t > .55) { g.save(); g.globalAlpha = Math.sin(ein(t, .55, 1) * Math.PI); g.fillStyle = "#FBF8F1"; g.font = `700 ${Math.round(10 * k)}px 'Familjen Grotesk', sans-serif`; g.fillText("mampf", x - 30 * k, y - 8 * k - ein(t, .55, 1) * 8 * k); g.restore(); }
  },
  laterne(g, t, [x, y], k) {
    const an = t < .1 || (t > .16 && t < .22) || t > .3; if (an) { const gr = g.createRadialGradient(x, y + 4 * k, 0, x, y + 4 * k, 34 * k); gr.addColorStop(0, "rgba(255,230,160,.8)"); gr.addColorStop(1, "rgba(255,230,160,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y + 4 * k, 34 * k, 0, TAU); g.fill(); }
    if (t > .3) for (let i = 0; i < 4; i++) { const a = t * 9 + i * 1.6, mx = x + Math.cos(a) * (12 + i * 3) * k, my = y + 6 * k + Math.sin(a * 1.3) * 9 * k, f = Math.abs(Math.sin(t * 60 + i)) * 2.4 * k; g.fillStyle = "#F4EDD6"; g.beginPath(); g.ellipse(mx - 1.6 * k, my, f + .6, 1.4 * k, .5, 0, TAU); g.ellipse(mx + 1.6 * k, my, f + .6, 1.4 * k, -.5, 0, TAU); g.fill(); }
  },
  seifenblasen(g, t, [x, y], k) {
    for (let i = 0; i < 8; i++) { const st = i * .06, tt = ein(t, st, st + .75); if (tt <= 0 || tt >= 1) continue; const bx = x + (i - 3.5) * 5 * k + Math.sin(tt * 5 + i) * 10 * k + (i === 5 ? tt * 70 * k : 0), by = y - 10 * k - tt * (60 + i * 6) * k, r = (3.4 + (i % 3) * 1.6) * k;
      if (tt > .94) { g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1; for (let j = 0; j < 6; j++) { const a = j / 6 * TAU; g.beginPath(); g.moveTo(bx + Math.cos(a) * r, by + Math.sin(a) * r); g.lineTo(bx + Math.cos(a) * r * 1.6, by + Math.sin(a) * r * 1.6); g.stroke(); } continue; }
      g.fillStyle = "rgba(220,240,255,.18)"; g.beginPath(); g.arc(bx, by, r, 0, TAU); g.fill(); g.strokeStyle = `hsla(${(i * 50 + tt * 200) % 360},80%,75%,.9)`; g.lineWidth = 1.1 * k; g.stroke(); g.fillStyle = "rgba(255,255,255,.85)"; g.beginPath(); g.arc(bx - r * .35, by - r * .35, r * .22, 0, TAU); g.fill(); }
  },
  kraniche(g, t, [x, y], k) {
    const kx = FX.w + 60 - t * (FX.w + 160), ky = y - Math.sin(t * Math.PI) * 10;
    g.strokeStyle = "#3A3A40"; g.lineWidth = 1.6 * k; g.lineCap = "round";
    for (let i = 0; i < 9; i++) { const reihe = Math.ceil(i / 2), seite = i % 2 ? -1 : 1, bx = kx + reihe * 13 * k, by = ky + (i ? seite * reihe * 7 * k : 0), fl = Math.sin(t * 40 + i) * 3 * k;
      g.beginPath(); g.moveTo(bx - 7 * k, by - fl); g.quadraticCurveTo(bx - 3 * k, by - 3 * k, bx, by); g.quadraticCurveTo(bx + 3 * k, by - 3 * k, bx + 7 * k, by - fl); g.stroke(); g.beginPath(); g.moveTo(bx - 1 * k, by); g.lineTo(bx - 6 * k, by + 1 * k); g.stroke(); }
  }
};

/* ============================================================
   Mehr Verstecktes (Auftrag 5, FUN-16): Tageszeit-Funde zählen mit,
   Jahreszeiten- und Fest-Funde (saison: true) kommen obendrauf
   ============================================================ */
const monatIst = (...m) => () => m.includes(jetzt().getMonth() + 1);
const festIst = k => () => typeof festHeute === "function" && !!festHeute()[k];
ENTDECKEN.push(
  { id: "zeitung", name: "Zeitung vor der Tür", zeit: ["morgen"], anker: "eingang", dx: -6, dy: -4, r: 36, text: "Die Zeitung liegt noch vor der Tür. Wer zuerst kommt …", mal: vZeitung },
  { id: "specht", name: "Buntspecht", zeit: ["morgen", "mittag"], x: 46, y: 500, r: 44, text: "Tock-tock-tock. Der Buntspecht klopft. Aufmachen muss keiner.", mal: vSpecht },
  { id: "kaffee", name: "Kaffee auf dem Balkon", zeit: ["morgen"], anker: "balkon", dx: -14, r: 30, text: "Auf dem Balkon dampft eine Tasse. Erst Kaffee, dann der Rest.", mal: vKaffee },
  { id: "waesche", name: "Wäsche nebenan", zeit: ["mittag", "nachmittag"], x: 304, y: 506, r: 36, text: "Nebenan flattert Wäsche. Die Socken sind alle zu zweit. Fast.", mal: vWaesche, wenn: () => jahreszeit(jetzt()) !== "winter" },
  { id: "paket", name: "Paketbote", zeit: ["mittag"], anker: "eingang", dx: -16, dy: -6, r: 36, text: "Der Paketbote sucht die richtige Klingel. Mal wieder.", mal: vPaket },
  { id: "kuchen", name: "Kuchen hinterm Fenster", zeit: ["nachmittag"], x: 304, y: 579, r: 34, text: "Hinterm Fenster wird Kuchen angeschnitten. Kaffeezeit!", mal: vKuchen },
  { id: "fledermaus", name: "Fledermaus", zeit: ["abend"], x: 190, y: 360, r: 50, text: "Eine Fledermaus fängt sich ihr Abendbrot.", mal: vFledermaus, wenn: () => jahreszeit(jetzt()) !== "winter" },
  { id: "amsel", name: "Amsel auf dem Dach", zeit: ["abend"], x: 640, y: 446, r: 40, text: "Die Amsel gibt ihr Abendkonzert vom Dach. Eintritt frei.", mal: vAmsel },
  { id: "krimi", name: "Krimi-Fenster", zeit: ["abend"], x: 392, y: 498, r: 36, text: "Bei den Nachbarn läuft ein Krimi. Man sieht’s am Flackern.", mal: vKrimi },
  { id: "sternschnuppe", name: "Sternschnuppe", zeit: ["nacht"], x: 300, y: 150, r: 70, text: "Eine Sternschnuppe! Schnell was wünschen.", mal: vSternschnuppe },
  { id: "waschbaer", name: "Waschbär", zeit: ["nacht"], anker: "muell", dx: -10, r: 40, text: "Ein Waschbär prüft die Mülltonnen. Sehr gründlich.", mal: vWaschbaer },
  { id: "dachs", name: "Dachs", zeit: ["nacht"], x: 96, y: 700, r: 46, text: "Ein Dachs schnüffelt am Waldrand entlang. Er hat’s nicht eilig.", mal: vDachs },
  // Jahreszeiten und Feste (zählen nicht mit)
  { id: "kerze", name: "Kerze im Fenster", saison: true, anker: "ritafenster", r: 34, text: "In deinem Fenster brennen Lichter. Von der Straße sieht’s richtig gemütlich aus.", mal: vKerze, wenn: () => (festIst("advent")() || festIst("weihnachten")() || festIst("lucia")()) && (LICHT.nacht > .2 || jetzt().getHours() >= 16) },
  { id: "schneemann", name: "Schneemann", saison: true, x: 104, y: 800, r: 44, text: () => S.bildspiel && S.bildspiel.schneemann ? "Dein Schneemann steht noch. Die Möhre auch." : "Schnee! Da wäre Platz für einen Schneemann.", mal: vSchneemann, wenn: () => !!SZ.schnee },
  { id: "osterei", name: "Osterei", saison: true, anker: "osterei", r: 40, text: "Ein buntes Ei im Gras. Hühnchen: „Das war ich nicht.“", mal: vOsterei, wenn: () => !!(SZ.anker && SZ.anker.osterei) },
  { id: "johannis", name: "Johanniswürmchen", saison: true, nacht: true, x: 150, y: 700, r: 50, text: "Johanniswürmchen! Der Waldrand hat seine Lichterkette an.", mal: vGluehw, wenn: monatIst(6) },
  { id: "rakete", name: "Silvesterrakete", saison: true, anker: "rakete", r: 70, text: "Raketen über dem Forst! Hühnchen guckt lieber durchs Fenster.", mal: vRakete, wenn: () => !!(SZ.anker && SZ.anker.rakete) },
  { id: "kuerbis", name: "Kürbis auf dem Balkon", saison: true, anker: "balkon", dx: -14, dy: 6, r: 30, text: "Ein Kürbis mit Gesicht auf dem Balkon. Er grinst nur ein bisschen.", mal: vKuerbis, wenn: () => festIst("halloween")() && jetzt().getHours() >= 15 },
  { id: "pilze", name: "Pilze", saison: true, nacht: false, x: 238, y: 640, r: 40, text: "Pilze unter der Kiefer. Hühnchen probiert einen als Hut.", mal: vPilze, wenn: monatIst(9, 10, 11) },
  { id: "schneegloeckchen", name: "Schneeglöckchen", saison: true, nacht: false, x: 262, y: 676, r: 40, text: "Die ersten Schneeglöckchen. Der Winter packt langsam ein.", mal: vSchneegloeckchen, wenn: monatIst(2, 3) },
  { id: "schwalben", name: "Schwalben", saison: true, nacht: false, x: 470, y: 452, r: 50, text: "Schwalben flitzen unterm Dach durch. Es gibt Mücken zum Mittag.", mal: vSchwalben, wenn: monatIst(5, 6, 7, 8) }
);
/* ---------- Vignetten dazu (120 × 120, Scherenschnitt) ---------- */
function vHaus(g, f = "#D8CDB6") { vP(g, p => rr(p, 0, 0, 120, 120, 0), f, 0); }
function vFensterLicht(g, x, y, w, h, c1 = "#FFE3A0", c2 = "#E2A94B") { const gr = g.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, w * .7); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(x, y, w, h); }
function vZeitung(g) {
  vHaus(g, "#CFC6B4"); vP(g, p => rr(p, 30, -4, 70, 92, 2), "rgba(196,214,222,.95)", 0); vP(g, p => { rr(p, 28, -4, 4, 92, 0); rr(p, 63, -4, 4, 92, 0); rr(p, 98, -4, 4, 92, 0); }, "#4E4A44", 0);
  vP(g, p => rr(p, 18, 86, 86, 20, 3), "#8A5A3A", 1); g.strokeStyle = "rgba(0,0,0,.18)"; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(22 + i * 10, 88); g.lineTo(22 + i * 10, 104); g.stroke(); }
  vP(g, p => { rr(p, 34, 78, 46, 14, 7); }, "#EDE8DA", 2); g.strokeStyle = "#9AA3B0"; g.lineWidth = 1; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(42, 82 + i * 3.4); g.lineTo(72, 82 + i * 3.4); g.stroke(); }
  vP(g, p => rr(p, 52, 77, 3, 16, 1), "#C9563A", 0);
}
function vSpecht(g) {
  vHimmel(g, false); vP(g, p => rr(p, 44, -4, 36, 130, 4), "#6B4A3A", 2); g.strokeStyle = "rgba(0,0,0,.2)"; g.lineWidth = 2; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(48, 10 + i * 20); g.lineTo(76, 16 + i * 20); g.stroke(); }
  const L = vLaub(false); vP(g, p => { fetzen(p, 14, 20, 20, 12, mulberry32(4), 11); fetzen(p, 108, 30, 18, 10, mulberry32(6), 11); }, "#3E5E46", 2);
  vP(g, p => { ellipse(p, 38, 62, 9, 17, .2); poly(p, [[34, 76], [30, 92], [38, 80]], null); kreis(p, 40, 44, 8); }, "#1C1C20", 2);
  vP(g, p => { ellipse(p, 36, 64, 5, 11, .2); ellipse(p, 36, 42, 4.6, 3.4); }, "#F1EDE4", 0); vP(g, p => ellipse(p, 38, 36.6, 4.4, 2.6), "#C8363A", 0); vP(g, p => ellipse(p, 36, 76, 3.6, 3), "#C8363A", 0);
  vP(g, p => poly(p, [[46, 44], [58, 46], [46, 47.6]], null), "#3A3A3A", 0); g.fillStyle = "#fff"; g.beginPath(); g.arc(43, 42, 1.5, 0, TAU); g.fill(); g.fillStyle = "#1C1C20"; g.beginPath(); g.arc(43.3, 42, .8, 0, TAU); g.fill();
  g.fillStyle = "#4A3022"; for (const [x, y] of [[66, 40], [70, 38], [62, 43]]) { g.beginPath(); g.arc(x, y, 1.2, 0, TAU); g.fill(); } g.fillStyle = "#1C2620"; g.font = "bold 11px 'Familjen Grotesk', sans-serif"; g.fillText("tock", 82, 30);
}
function vKaffee(g) {
  vHimmel(g, false); vP(g, p => rr(p, -4, 74, 128, 50, 0), "#B7A48A", 2); vP(g, p => rr(p, -4, 70, 128, 6, 0), "#6F6A62", 1);
  vP(g, p => { rr(p, 44, 46, 30, 28, 6); }, "#F1EDE4", 2); vP(g, p => { p.moveTo(74, 52); p.arc(74, 60, 8, -Math.PI / 2, Math.PI / 2); p.lineTo(74, 64); p.arc(74, 60, 4, Math.PI / 2, -Math.PI / 2, true); p.closePath(); }, "#F1EDE4", 1);
  vP(g, p => rr(p, 47, 48, 24, 4, 2), "#6B4A30", 0); vP(g, p => { rr(p, 52, 58, 14, 2.6, 1); }, "#C9563A", 0);
  g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 2.4; g.lineCap = "round"; for (const dx of [52, 60, 68]) { g.beginPath(); g.moveTo(dx, 42); g.bezierCurveTo(dx - 6, 34, dx + 6, 28, dx, 18); g.stroke(); }
  vP(g, p => { for (let k = 0; k < 4; k++) kreis(p, 14 + k * 9, 66, 5); }, "#5F8A4E", 1); vP(g, p => { kreis(p, 18, 62, 2.2); kreis(p, 34, 63, 2.2); }, "#D9603C", 0);
}
function vWaesche(g) {
  vHimmel(g, false); vP(g, p => rr(p, -4, 88, 128, 40, 0), "#A9B4AE", 2);
  g.strokeStyle = "#5A5048"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-4, 26); g.quadraticCurveTo(60, 38, 124, 24); g.stroke();
  vP(g, p => { poly(p, [[10, 28], [32, 30], [34, 64], [24, 62], [22, 44], [20, 62], [10, 60]], null); }, "#3E7FB8", 2);
  vP(g, p => { poly(p, [[42, 32], [56, 33], [56, 52], [64, 62], [56, 66], [48, 54], [42, 54]], null); poly(p, [[66, 33], [78, 33], [78, 52], [86, 62], [78, 66], [70, 54], [66, 54]], null); }, "#E0558A", 2);
  vP(g, p => { poly(p, [[90, 30], [116, 28], [118, 70], [88, 72]], null); }, "#F2D27A", 2); vP(g, p => { rr(p, 92, 40, 24, 3, 0); rr(p, 92, 52, 24, 3, 0); }, "#E09A3A", 0);
  vP(g, p => { for (const x of [16, 28, 46, 54, 70, 76, 94, 112]) rr(p, x, 24, 3, 7, 1); }, "#8A6A48", 0);
}
function vPaket(g) {
  vHaus(g, "#CFC6B4"); vP(g, p => rr(p, 60, 10, 50, 80, 2), "rgba(196,214,222,.95)", 0); vP(g, p => { for (let i = 0; i < 4; i++) rr(p, 22, 22 + i * 12, 22, 8, 2); }, "#B8B2A4", 1); vP(g, p => { for (let i = 0; i < 4; i++) kreis(p, 40, 26 + i * 12, 1.8); }, "#4E4A44", 0);
  vBoden(g, "#9C9A92", 104);
  vP(g, p => { poly(p, [[60, 104], [62, 76], [76, 76], [78, 104], [72, 104], [69, 86], [66, 104]], null); }, "#2E3A5A", 2);
  vP(g, p => { poly(p, [[58, 78], [56, 50], [62, 44], [76, 44], [82, 50], [80, 78]], null); }, "#E2B13C", 2); vP(g, p => { kreis(p, 69, 36, 8); }, "#E6B593", 1); vP(g, p => { rr(p, 61, 26, 16, 6, 3); rr(p, 59, 30, 20, 2, 1); }, "#2E3A5A", 0);
  vP(g, p => rr(p, 46, 56, 24, 20, 2), "#B8875A", 2); vP(g, p => rr(p, 46, 63, 24, 3, 0), "#E6D3A8", 0); g.fillStyle = "#1C2620"; g.beginPath(); g.arc(66, 35, 1, 0, TAU); g.fill();
  g.fillStyle = "#1C2620"; g.font = "bold 14px 'Familjen Grotesk', sans-serif"; g.fillText("?", 84, 30);
}
function vKuchen(g) {
  vHaus(g); vFensterLicht(g, 18, 18, 84, 78, "#FFF0C8", "#F2D28A"); vP(g, p => { rr(p, 16, 14, 88, 6, 0); rr(p, 16, 94, 88, 7, 0); rr(p, 58, 18, 4, 78, 0); }, "#C8BCA2", 1);
  vP(g, p => rr(p, 22, 74, 76, 6, 2), "#8A6A48", 1);
  vP(g, p => { p.moveTo(30, 74); p.lineTo(30, 60); p.arc(50, 60, 20, Math.PI, Math.PI * 1.62); p.lineTo(50, 60); p.closePath(); }, "#D9A45A", 2); vP(g, p => { rr(p, 30, 58, 40, 4, 2); }, "#F4EDD6", 0);
  vP(g, p => { for (const [x, y] of [[36, 52], [44, 46]]) kreis(p, x, y, 2.6); }, "#C8363A", 0);
  vP(g, p => { poly(p, [[66, 74], [86, 74], [76, 62]], null); }, "#D9A45A", 1); vP(g, p => rr(p, 66, 66, 20, 2.4, 1), "#F4EDD6", 0);
  vP(g, p => { rr(p, 80, 40, 3, 22, 1); poly(p, [[78, 40], [86, 40], [84, 30], [80, 30]], null); }, "#B8B8B0", 1);
}
function vFledermaus(g) {
  const gr = g.createLinearGradient(0, 0, 0, 120); gr.addColorStop(0, "#3E4A78"); gr.addColorStop(1, "#E2A06A"); g.fillStyle = gr; g.fillRect(0, 0, 120, 120);
  vP(g, p => { for (const [x, h] of [[10, 40], [24, 52], [100, 44], [112, 36]]) { rr(p, x, 120 - h, 3, h, 1); ellipse(p, x + 1.5, 120 - h, 9, 14); } }, "#1E2620", 1);
  vP(g, p => { ellipse(p, 60, 54, 6, 8); poly(p, [[56, 48], [57, 40], [60, 47]], null); poly(p, [[64, 48], [63, 40], [60, 47]], null);
    p.moveTo(56, 52); p.quadraticCurveTo(40, 36, 22, 44); p.quadraticCurveTo(28, 50, 26, 58); p.quadraticCurveTo(34, 54, 38, 62); p.quadraticCurveTo(46, 56, 56, 60); p.closePath();
    p.moveTo(64, 52); p.quadraticCurveTo(80, 36, 98, 44); p.quadraticCurveTo(92, 50, 94, 58); p.quadraticCurveTo(86, 54, 82, 62); p.quadraticCurveTo(74, 56, 64, 60); p.closePath(); }, "#24202A", 2);
  g.fillStyle = "#F2D27A"; g.beginPath(); g.arc(58, 52, .9, 0, TAU); g.arc(62, 52, .9, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,.7)"; for (const [x, y] of [[84, 30], [90, 24], [94, 34]]) { g.beginPath(); g.arc(x, y, .9, 0, TAU); g.fill(); }
}
function vAmsel(g) {
  const gr = g.createLinearGradient(0, 0, 0, 120); gr.addColorStop(0, "#7E8FB8"); gr.addColorStop(1, "#F2C88E"); g.fillStyle = gr; g.fillRect(0, 0, 120, 120);
  vP(g, p => rr(p, -4, 86, 128, 40, 0), "#6F6A62", 2); vP(g, p => { rr(p, 56, 40, 3, 48, 0); rr(p, 44, 44, 28, 2.4, 0); rr(p, 48, 54, 20, 2.4, 0); }, "#3A3A3A", 1);
  vP(g, p => { ellipse(p, 60, 34, 10, 7); poly(p, [[52, 32], [38, 38], [52, 37]], null); kreis(p, 68, 27, 5.6); }, "#1E1C1C", 2);
  vP(g, p => poly(p, [[72, 26], [80, 23], [73, 29]], null), "#F2A33A", 0); vP(g, p => poly(p, [[72, 28.6], [79, 30], [73, 29.4]], null), "#F2A33A", 0);
  g.strokeStyle = "#E2A33A"; g.lineWidth = .8; g.beginPath(); g.arc(69.6, 26, 1.6, 0, TAU); g.stroke();
  g.fillStyle = "#1C2620"; g.font = "bold 13px serif"; g.fillText("♪", 84, 20); g.font = "bold 10px serif"; g.fillText("♫", 96, 12);
  g.strokeStyle = "#1E1C1C"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(58, 40); g.lineTo(57, 44); g.moveTo(62, 40); g.lineTo(62, 44); g.stroke();
}
function vKrimi(g) {
  vP(g, p => rr(p, 0, 0, 120, 120, 0), "#343B4E", 0);
  const gr = g.createRadialGradient(60, 60, 4, 60, 60, 60); gr.addColorStop(0, "#A8D0F0"); gr.addColorStop(1, "#4A6E9E"); g.fillStyle = gr; g.fillRect(20, 16, 80, 86);
  vP(g, p => { rr(p, 26, 76, 68, 26, 10); }, "#5A3A32", 0); vP(g, p => { kreis(p, 46, 64, 7.4); ellipse(p, 46, 84, 12, 12); kreis(p, 72, 66, 6.6); ellipse(p, 72, 84, 11, 12); }, "#232838", 0);
  vP(g, p => rr(p, 24, 22, 18, 12, 1), "rgba(255,255,255,.25)", 0);
  vP(g, p => { rr(p, 16, 12, 88, 6, 0); rr(p, 16, 100, 88, 7, 0); rr(p, 58, 16, 4, 86, 0); }, "#C8BCA2", 1);
  g.fillStyle = "rgba(200,230,255,.18)"; g.fillRect(0, 0, 120, 120);
}
function vSternschnuppe(g) {
  vHimmel(g, true); vSterne(g);
  const gr = g.createLinearGradient(30, 30, 90, 70); gr.addColorStop(0, "rgba(255,246,220,0)"); gr.addColorStop(1, "rgba(255,246,220,.95)"); g.strokeStyle = gr; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(24, 26); g.lineTo(88, 66); g.stroke();
  g.fillStyle = "#FFF6DC"; g.beginPath(); g.arc(89, 67, 3.2, 0, TAU); g.fill(); g.fillStyle = "rgba(255,246,220,.3)"; g.beginPath(); g.arc(89, 67, 9, 0, TAU); g.fill();
  vP(g, p => { for (const [x, h] of [[8, 30], [20, 22], [100, 28], [112, 34]]) { rr(p, x, 120 - h, 3, h, 1); ellipse(p, x + 1.5, 120 - h, 8, 12); } }, "#162236", 1);
}
function vWaschbaer(g) {
  vHimmel(g, true); vSterne(g); vBoden(g, "#3A3E44", 100);
  vP(g, p => rr(p, 54, 40, 32, 62, 3), "#2E3E52", 2); vP(g, p => rr(p, 52, 36, 36, 6, 2), "#22303E", 1);
  vP(g, p => { ellipse(p, 46, 70, 14, 10); kreis(p, 50, 52, 9); poly(p, [[43, 46], [44, 38], [49, 44]], null); poly(p, [[55, 45], [57, 38], [59, 46]], null); rr(p, 54, 40, 10, 4, 2); }, "#7A7A80", 2);
  vP(g, p => { ellipse(p, 50, 53, 8, 3.6); }, "#26262A", 0); g.fillStyle = "#F2E07A"; g.beginPath(); g.arc(47, 53, 1.3, 0, TAU); g.arc(53, 53, 1.3, 0, TAU); g.fill();
  vP(g, p => { ellipse(p, 50, 58, 3.4, 2.4); }, "#D8D8DC", 0); g.fillStyle = "#16161A"; g.beginPath(); g.arc(50, 57, 1.2, 0, TAU); g.fill();
  vP(g, p => { p.moveTo(34, 74); p.quadraticCurveTo(18, 70, 16, 86); p.quadraticCurveTo(22, 80, 34, 82); p.closePath(); }, "#7A7A80", 1); g.strokeStyle = "#2A2A2E"; g.lineWidth = 2; for (const x of [20, 25, 30]) { g.beginPath(); g.moveTo(x, 74 + (x - 20) * .2); g.lineTo(x, 84 - (x - 20) * .3); g.stroke(); }
}
function vDachs(g) {
  vHimmel(g, true); vSterne(g); vBoden(g, "#2E3A30", 88); vP(g, p => { rr(p, 98, -4, 14, 110, 0); }, "#1E2620", 2);
  vP(g, p => { ellipse(p, 54, 80, 26, 12); poly(p, [[74, 74], [100, 82], [74, 88]], null); for (const lx of [36, 44, 62, 70]) rr(p, lx, 86, 4, 8, 2); }, "#8A8A90", 2);
  vP(g, p => { poly(p, [[76, 76], [100, 82], [80, 79]], null); }, "#F1EDE4", 0); vP(g, p => { poly(p, [[76, 82], [100, 82.6], [78, 86]], null); poly(p, [[78, 74], [96, 79], [80, 76.6]], null); }, "#1C1C20", 0);
  g.fillStyle = "#1C1C20"; g.beginPath(); g.arc(100, 82, 1.8, 0, TAU); g.fill(); vGras(g, "#1E2A20", 122, 22, 18);
}
function vKerze(g) {
  vP(g, p => rr(p, 0, 0, 120, 120, 0), "#343B4E", 0); vFensterLicht(g, 20, 16, 80, 86, "#FFE7B0", "#C98A4A");
  vP(g, p => { p.moveTo(24, 94); p.arc(60, 94, 36, Math.PI, 0); p.lineTo(90, 94); p.arc(60, 94, 30, 0, Math.PI, true); p.closePath(); }, "#3A2A20", 1);
  for (let i = 0; i < 7; i++) { const a = Math.PI + (i + .5) / 7 * Math.PI, x = 60 + Math.cos(a) * 33, y = 94 + Math.sin(a) * 33; g.fillStyle = "#FBF6EA"; g.fillRect(x - 1.6, y - 8, 3.2, 8); const gr = g.createRadialGradient(x, y - 11, 0, x, y - 11, 8); gr.addColorStop(0, "rgba(255,226,140,.95)"); gr.addColorStop(1, "rgba(255,226,140,0)"); g.fillStyle = gr; g.fillRect(x - 8, y - 19, 16, 16); g.fillStyle = "#FFF1B8"; g.beginPath(); g.ellipse(x, y - 11, 1.4, 2.6, 0, 0, TAU); g.fill(); }
  vP(g, p => { rr(p, 16, 12, 88, 6, 0); rr(p, 16, 100, 88, 7, 0); }, "#C8BCA2", 1);
}
function vSchneemann(g) {
  vHimmel(g, false); g.fillStyle = "rgba(255,255,255,.4)"; g.fillRect(0, 0, 120, 120); vBoden(g, "#F2F1EB", 92);
  if (S.bildspiel && S.bildspiel.schneemann) { schneemannMalen(g, 60, 110, 1.35); }
  else { vP(g, p => { ellipse(p, 40, 98, 16, 6); ellipse(p, 80, 102, 10, 4); }, "#FBFBF6", 1); }
  g.fillStyle = "rgba(255,255,255,.95)"; const r = mulberry32(12); for (let i = 0; i < 30; i++) { g.beginPath(); g.arc(r() * 120, r() * 120, .8 + r() * 1.4, 0, TAU); g.fill(); }
}
function vOsterei(g) {
  vHimmel(g, false); vBoden(g, "#9BB36A", 84);
  vP(g, p => ellipse(p, 60, 80, 15, 19), "#E0558A", 2); vP(g, p => { rr(p, 46, 74, 28, 4, 2); }, "#F2D27A", 0); vP(g, p => { for (const x of [52, 60, 68]) kreis(p, x, 86, 2); }, "#3E7FB8", 0);
  vP(g, p => ellipse(p, 92, 96, 9, 11), "#3E7FB8", 1); vP(g, p => rr(p, 84, 94, 16, 3, 1), "#F4F0EA", 0);
  vGras(g, "#7E9A4E", 122, 30, 26); vP(g, p => { for (const [x, y] of [[22, 100], [30, 96]]) { for (let k = 0; k < 5; k++) kreis(p, x + Math.cos(k * 1.26) * 3, y + Math.sin(k * 1.26) * 3, 2); } }, "#F4F0E2", 0);
}
function vRakete(g) {
  vHimmel(g, true); vSterne(g);
  const farben = ["#F2C36B", "#E0558A", "#8FD0F0"]; [[40, 40, 26], [84, 56, 20], [64, 24, 14]].forEach(([x, y, r], i) => { g.strokeStyle = farben[i]; g.lineWidth = 2; g.lineCap = "round"; for (let j = 0; j < 14; j++) { const a = j / 14 * TAU; g.beginPath(); g.moveTo(x + Math.cos(a) * r * .35, y + Math.sin(a) * r * .35); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke(); } });
  g.strokeStyle = "rgba(255,240,200,.6)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(84, 120); g.quadraticCurveTo(80, 90, 84, 62); g.stroke();
  vP(g, p => { for (const [x, h] of [[8, 30], [20, 22], [104, 26]]) { rr(p, x, 120 - h, 3, h, 1); ellipse(p, x + 1.5, 120 - h, 8, 12); } }, "#162236", 1);
}
function vKuerbis(g) {
  vHimmel(g, true); vSterne(g); vP(g, p => rr(p, -4, 84, 128, 40, 0), "#6E6658", 2); vP(g, p => rr(p, -4, 80, 128, 6, 0), "#4A4640", 1);
  const gr = g.createRadialGradient(60, 66, 2, 60, 66, 50); gr.addColorStop(0, "rgba(255,200,110,.5)"); gr.addColorStop(1, "rgba(255,200,110,0)"); g.fillStyle = gr; g.fillRect(0, 0, 120, 120);
  vP(g, p => { ellipse(p, 46, 66, 14, 15); ellipse(p, 74, 66, 14, 15); ellipse(p, 60, 66, 15, 16); }, "#E8902E", 2); vP(g, p => rr(p, 57, 44, 5, 9, 2), "#5B8A47", 0);
  vP(g, p => { poly(p, [[48, 60], [54, 54], [56, 62]], null); poly(p, [[72, 60], [66, 54], [64, 62]], null); poly(p, [[46, 72], [52, 76], [58, 72], [62, 77], [68, 72], [74, 72], [68, 80], [52, 80]], null); }, "#FFE08A", 0);
}
function vPilze(g) {
  vHimmel(g, false); vBoden(g, "#8A7A5A", 86); vP(g, p => rr(p, 84, -4, 22, 100, 0), "#6B4A3A", 2);
  vP(g, p => { rr(p, 40, 70, 9, 22, 3); rr(p, 66, 80, 7, 14, 3); }, "#F1EDE4", 1);
  vP(g, p => { p.moveTo(24, 74); p.quadraticCurveTo(44, 46, 64, 74); p.closePath(); }, "#C8363A", 2); vP(g, p => { p.moveTo(56, 82); p.quadraticCurveTo(70, 62, 84, 82); p.closePath(); }, "#9A6A3A", 2);
  vP(g, p => { for (const [x, y] of [[36, 64], [46, 58], [52, 68], [40, 70]]) kreis(p, x, y, 2); }, "#FBF8EE", 0);
  vGras(g, "#5D7A3E", 122, 16, 20); vP(g, p => { for (const [x, y, a] of [[20, 96, .4], [96, 100, -.3]]) ellipse(p, x, y, 6, 3, a); }, "#C98A3E", 1);
}
function vSchneegloeckchen(g) {
  vHimmel(g, false); vBoden(g, "#D8D6C8", 90); vP(g, p => { ellipse(p, 30, 100, 20, 5); ellipse(p, 96, 104, 16, 4); }, "#F2F1EB", 0);
  for (const [x, h, n] of [[44, 50, -.2], [60, 58, .1], [76, 46, .3]]) { g.strokeStyle = "#4E7F45"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 104); g.quadraticCurveTo(x - 2, 104 - h * .6, x + 6, 104 - h); g.stroke();
    vP(g, p => { ellipse(p, x + 7, 104 - h + 7, 4.4, 7, n); }, "#FBFBF6", 1); vP(g, p => ellipse(p, x + 7, 104 - h + 12, 2, 1.4), "#7FB46A", 0);
    vP(g, p => { p.moveTo(x - 1, 104); p.quadraticCurveTo(x - 8, 84, x - 4, 70); p.quadraticCurveTo(x - 2, 86, x + 2, 104); p.closePath(); }, "#5D9A50", 0); }
}
function vSchwalben(g) {
  vHimmel(g, false); vP(g, p => rr(p, -4, 74, 128, 50, 0), "#D8CDB6", 0); vP(g, p => rr(p, -4, 66, 128, 12, 0), "#6F6A62", 2);
  vP(g, p => { ellipse(p, 30, 84, 10, 6); }, "#8A6A48", 1);
  const schwalbe = (x, y, s, r) => { g.save(); g.translate(x, y); g.rotate(r); g.scale(s, s);
    vP(g, p => { p.moveTo(-12, 0); p.quadraticCurveTo(-4, -10, 4, -2); p.quadraticCurveTo(14, -12, 22, -8); p.quadraticCurveTo(12, -2, 6, 2); p.lineTo(-2, 4); p.lineTo(-14, 10); p.lineTo(-8, 3); p.closePath(); }, "#1E2A44", 1);
    vP(g, p => ellipse(p, 3, 3, 4, 2.2), "#F1E6CF", 0); vP(g, p => kreis(p, 6, 0, 1.8), "#C8563A", 0); g.restore(); };
  schwalbe(46, 34, 1.4, -.2); schwalbe(88, 52, 1, .25); schwalbe(80, 18, .8, -.1);
}
