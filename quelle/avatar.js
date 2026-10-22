/* ============================================================
   Gesichter für eigene Herzensmenschen (Avatar-Editor)
   avatarSVG(cfg, gr) malt ein Porträt im Stil von figuren.js: viewBox 0 0 100 100, runder Hintergrund,
   flache Flächen, <g class="augen"> und <g class="mund"> (Blinzeln/Sprechen aus app.css).
   Gespeichert wird nur die Auswahl (m.avatar = { alter, haut, haar, frisur, … } mit festen Kennungen).
   ============================================================ */

const AV = {
  alter: [["jung", "Jung"], ["mittel", "Mittel"], ["aelter", "Älter"]],
  haut: [["h1", "#F7DCCB", "Sehr hell"], ["h2", "#F0C9AA", "Hell"], ["h3", "#E6B593", "Hell, warm"], ["h4", "#D9A07A", "Mittel"], ["h5", "#C08A62", "Oliv"], ["h6", "#9E6A47", "Braun"], ["h7", "#7C4F34", "Dunkelbraun"], ["h8", "#5C3A27", "Sehr dunkel"]],
  haar: [["schwarz", "#2B2522", "Schwarz"], ["dunkel", "#4A3426", "Dunkelbraun"], ["braun", "#6E4C32", "Braun"], ["hasel", "#9A7048", "Hellbraun"], ["kupfer", "#B0502E", "Rot"], ["blond", "#D9BC76", "Blond"], ["asch", "#AD9470", "Aschblond"], ["meliert", "#8A857C", "Grau meliert"], ["grau", "#B4B0A8", "Grau"], ["weiss", "#E8E4DC", "Weiß"]],
  frisur: [["glatze", "Glatze"], ["kranz", "Haarkranz"], ["kurz", "Kurz"], ["scheitel", "Seitenscheitel"], ["wuschel", "Wuschelig"], ["welle", "Kurze Locken"], ["locken", "Lockenkopf"], ["bob", "Bob"], ["lang", "Lang"], ["zopf", "Zopf"], ["dutt", "Dutt"]],
  augen: [["braun", "#6B4A30", "Braun"], ["dunkel", "#3E2A1E", "Dunkelbraun"], ["hasel", "#8A6E3A", "Haselnuss"], ["gruen", "#5E8A5A", "Grün"], ["blau", "#4A86AE", "Blau"], ["hellblau", "#7C9DB4", "Hellblau"], ["grau", "#7F8A90", "Grau"]],
  nase: [["klein", "Klein"], ["gerade", "Gerade"], ["kraeftig", "Kräftig"], ["stups", "Stups"]],
  mund: [["lachen", "Lachen"], ["laecheln", "Lächeln"], ["schmunzeln", "Schmunzeln"]],
  brille: [["keine", "Keine"], ["rund", "Rund"], ["eckig", "Eckig"], ["bunt", "Bunt"]],
  bart: [["keiner", "Keiner"], ["stoppel", "Drei-Tage"], ["schnurr", "Schnurrbart"], ["voll", "Vollbart"]],
  ohrringe: [["keine", "Keine"], ["stecker", "Kleine Stecker"], ["creolen", "Creolen"], ["perlen", "Perlen"]],
  oben: [["marine", "#22304A", "Dunkelblau"], ["himmel", "#6D86C8", "Blau"], ["tuerkis", "#3E9A8E", "Türkis"], ["gruen", "#4F7A45", "Grün"], ["senf", "#C99A2E", "Senfgelb"], ["rot", "#B8352C", "Rot"], ["beere", "#A8336A", "Beere"], ["lila", "#7A5A9A", "Lila"], ["grau", "#6A6E72", "Grau"], ["creme", "#E6D8BC", "Creme"]],
  hg: [["sand", "#F3E3C0", "Sand"], ["salbei", "#E2EBDD", "Salbei"], ["rosa", "#F6E0E2", "Rosa"], ["himmel", "#DAE7F2", "Himmel"], ["flieder", "#E7E1F2", "Flieder"], ["apricot", "#F6DCC8", "Apricot"], ["mint", "#D8EEE6", "Mint"], ["zitrone", "#F4EDC2", "Zitrone"]]
};
const AV_STANDARD = { alter: "mittel", haut: "h2", haar: "braun", frisur: "kurz", augen: "braun", nase: "gerade", mund: "laecheln", brille: "keine", bart: "keiner", ohrringe: "keine", oben: "marine", hg: "salbei" };
const AV_FEST = { max: "maxSVG", christiane: "janeSVG", jane: "janeSVG", micha: "michaSVG", greta: "gretaSVG", pauli: "pauliSVG", karin: "karinKopfSVG", rita: "ritaSVG" };


/* Auswahl prüfen: alles Unbekannte fällt auf den Standard zurück (alte oder kaputte Daten) */
function avatarNorm(cfg) {
  const c = {}; const q = cfg && typeof cfg === "object" ? cfg : {};
  for (const k in AV_STANDARD) c[k] = AV[k].some(o => o[0] === q[k]) ? q[k] : AV_STANDARD[k];
  return c;
}
/* Ist mindestens eine Angabe bekannt? Sonst ist es kein (lesbares) Gesicht → Initiale */
function avatarGueltig(cfg) {
  try { return !!cfg && typeof cfg === "object" && Object.keys(AV_STANDARD).some(k => AV[k].some(o => o[0] === cfg[k])); } catch (e) { return true; }
}
function avWert(k, id) { const o = AV[k].find(x => x[0] === id) || AV[k][0]; return o[1]; }
/* Farben mischen: a → b um t (0…1) */
function avMix(a, b, t) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
/* Helligkeit und Kontrast (WCAG) */
function avLum(h) { return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); }
function avKontrast(a, b) { const x = avLum(a), y = avLum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
/* Text: erstes Zeichen (auch Emoji mit Hautton) und Kürzen ohne kaputte Zeichen */
function avZeichen(t) {
  t = String(t == null ? "" : t);
  try { if (typeof Intl !== "undefined" && Intl.Segmenter) return [...new Intl.Segmenter("de", { granularity: "grapheme" }).segment(t)].map(x => x.segment); } catch (e) { }
  return Array.from(t);
}
function avKuerzen(t, n) { const z = avZeichen(t); return z.length > n ? z.slice(0, n).join("").trim() : String(t == null ? "" : t); }
function avInitiale(name) { const z = avZeichen(String(name == null ? "" : name).trim()); return (z[0] || "?").toLocaleUpperCase("de"); }

/* Frisuren: hinten (hinter Kopf/Körper), vorn (über der Stirn), ohren (sichtbar?) */
function avFrisur(id) {
  switch (id) {
    case "glatze": return { ohren: true, vorn: "", glanz: true };
    case "kranz": return { ohren: true, glanz: true, kahl: true, hinten: `<path d="M33.6 40 Q30.2 42.4 30 48.6 Q29.8 54.6 32.4 58.6 Q34 59.4 34.6 57.4Z M66.4 40 Q69.8 42.4 70 48.6 Q70.2 54.6 67.6 58.6 Q66 59.4 65.4 57.4Z"/>`, vorn: `<path d="M31.8 40.6 Q31 46 32.4 51 L34 50.4 Q33.2 46 33.8 41Z M68.2 40.6 Q69 46 67.6 51 L66 50.4 Q66.8 46 66.2 41Z"/>` };
    case "kurz": return { ohren: true, vorn: `<path d="M30.6 49 Q27.4 20.5 50 18.2 Q72.6 20.5 69.4 49 L67.8 49 Q67.6 38 63.6 33.6 Q60 31 55 32.4 Q52 30.4 48 31.8 Q43 30.2 39.6 33 Q33.6 37 32.2 49Z"/>`, licht: "M40 22.6 Q48 20 58 22" };
    case "scheitel": return { ohren: true, vorn: `<path d="M30.6 47.5 Q27.6 20.5 50 18.2 Q72.4 20.5 69.4 47.5 Q68.4 38 65 33.4 Q60 29.6 52 30.6 Q44 31.6 39 36.4 Q35.6 39.8 34 46 Q32 44 30.6 47.5Z"/><path d="M37.6 33 Q44 25.4 56 25.6 Q65.6 26.4 69 37 Q62.4 30.6 53 31.2 Q45 31.8 39.4 37.6Z"/>`, linie: "M40.6 20.6 Q38.4 25 37.6 31.6", licht: "M44 27.6 Q53 25.4 62 28.6" };
    case "wuschel": return { ohren: true, vorn: `<path d="M31 49 Q27 30 40 23 Q46 18 54 20 Q66 20 69 32 Q71 40 68.5 49 Q67 38 61 35 Q63 40 58 41 Q59 36 54 34.5 Q52 39 46 40 Q48 36 45 34 Q40 37 39.5 41 Q37 37 35 39 Q32.5 43 31 49Z"/>`, licht: "M40 25.6 Q44 21.6 49 22.4 M53 21.8 Q58.6 21.6 62 25" };
    case "welle": return { ohren: true, kreise: [[31.6, 45, 4.6], [32, 38, 5.6], [35.4, 31, 6.2], [41, 25.6, 6.6], [48, 22.6, 6.8], [55, 22.8, 6.8], [61.6, 26, 6.4], [66.4, 31.6, 6], [68.4, 38.4, 5.4], [68.6, 45, 4.4], [40, 32, 5], [47, 29.6, 5], [54, 29.8, 5], [60.6, 32.4, 4.8], [44, 22, 4], [52, 19.6, 4.4], [59, 21, 3.8]], licht: "M42 23 Q47 20 52 20.4" };
    case "locken": return { ohren: false, ringX: 33.4, hinten: [[25.4, 62, 8], [24, 50, 9], [26, 37, 9.6], [33, 25.6, 10], [43.4, 18.4, 10], [56.6, 18.4, 10], [67, 25.6, 10], [74, 37, 9.6], [76, 50, 9], [74.6, 62, 8], [29.6, 71, 6.4], [70.4, 71, 6.4]], kreise: [[36, 32.6, 5.4], [42.4, 28, 5.6], [49.4, 26.6, 5.8], [56.6, 27.6, 5.6], [63.4, 32, 5.4], [33, 39.4, 4.4], [67, 39.4, 4.4]], licht: "M38 23 Q44 18.6 50 18.8" };
    case "bob": return { ohren: false, ringX: 33.6, ringY: 57, hinten: `<path d="M22 57 Q17 20 50 15 Q83 20 78 57 Q78 68.6 71 72.6 L66 71.4 Q70 42 50 37 Q30 42 34 71.4 L29 72.6 Q22 68.6 22 57Z"/>`, vorn: `<path d="M29 44 Q31 19 54 19 Q74 22 73 45 Q66 31 50 32 Q40 33 34 40 Q31 43 29 46Z"/>`, licht: "M44 23 Q55 20 66 27" };
    case "lang": return { ohren: false, ringX: 37.8, hinten: `<path d="M27.6 42 Q25.6 21.6 50 19.6 Q74.4 21.6 72.4 42 L76 90 Q66 95 60 87 L40 87 Q34 95 24 90Z"/>`,
      vorn: `<path d="M50 19.8 Q36 20.6 31.6 35 Q29.4 50 30.4 64 Q30.6 79 27 91 Q33.6 93 38.6 87 Q36.4 74 37 60 Q36.6 45 40 36.6 Q44 30.4 50 29.6Z M50 19.8 Q64 20.6 68.4 35 Q70.6 50 69.6 64 Q69.4 79 73 91 Q66.4 93 61.4 87 Q63.6 74 63 60 Q63.4 45 60 36.6 Q56 30.4 50 29.6Z"/>`, linie: "M50 20.4 L50 29.2", licht: "M40.6 26.6 Q45 24 49 24 M57 25 Q62 26.6 65 31" };
    case "zopf": return { ohren: true, zopf: true, hinten: `<path d="M33 48 Q31 64 40 69 L60 69 Q69 64 67 48Z"/>`,
      vorn: `<path d="M30.8 48 Q28.6 20.6 50 19.4 Q71.4 20.6 69.2 48 Q67.4 34.4 60.4 30.6 Q55 28.6 50 29.6 Q45 28.6 39.6 30.6 Q32.6 34.4 30.8 48Z"/>`, linie: "M50 19.8 L50 29.2", licht: "M39 25.6 Q44 22.4 48.4 22.2 M51.6 22.2 Q56 22.4 61 25.6" };
    case "dutt": return { ohren: true, hinten: [[50, 15.4, 8.4]], vorn: `<path d="M30.8 48 Q28.6 21 50 19.6 Q71.4 21 69.2 48 Q67.4 34.4 60.4 30.8 Q55 28.8 50 29.2 Q45 28.8 39.6 30.8 Q32.6 34.4 30.8 48Z"/>`, band: true, licht: "M40 26 Q46 22.2 54 22.4" };
  }
  return { ohren: true, vorn: "" };
}
const avKreise = k => (k || []).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("");
const AV_GRAU = ["grau", "weiss", "meliert"];
function avHash(t) { let h = 7; for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) % 100003; return h; }

/* Farben eines Gesichts (auch für die Figur im Bild) */
function avFarben(c) {
  const haut = avWert("haut", c.haut), oben = avWert("oben", c.oben);
  let haar = avWert("haar", c.haar);
  const dunkleHaut = ["h6", "h7", "h8"].includes(c.haut), hellesHaar = ["blond", "grau", "weiss", "asch"].includes(c.haar);
  // Haar fast so hell/dunkel wie die Haut: dunkles Haar etwas dunkler machen, helles bekommt später eine feine Kante
  let haarKante = false;
  if (avKontrast(haar, haut) < 1.25) { if (avLum(haar) < .3) haar = avMix(haar, "#1A100A", .38); else haarKante = true; }
  const bart = hellesHaar ? avMix(haar, "#5A4030", .35) : dunkleHaut ? avMix(haar, "#000000", .3) : haar;
  return { haut, oben, haar, dunkleHaut, hellesHaar, haarKante, bart };
}

function avatarSVG(cfg, gr = 64, opt = {}) {
  const c = avatarNorm(cfg), n = "av" + (avatarSVG.n = (avatarSVG.n || 0) + 1);
  const FA = avFarben(c), { haut, oben, haar, dunkleHaut, hellesHaar } = FA;
  const iris = avWert("augen", c.augen), F = avFrisur(c.frisur);
  const klein = gr <= 40 && !opt.vb, k = klein ? 1.5 : 1; // kleine Bilder: kräftigere Linien, kein Schmuck
  const alt = c.alter === "aelter", mittel = c.alter === "mittel";
  const schatten = avMix(haut, "#7A4A30", .16);
  const linie = c.haut === "h8" ? avMix(haut, "#F2C8A8", .35) : c.haut === "h7" ? avMix(haut, "#1E0E08", .6) : avMix(haut, "#5A2A1A", dunkleHaut ? .45 : .3);
  const wange = dunkleHaut ? "#C0563F" : "#E07F62";
  const haarDunkel = avMix(haar, "#2A1A12", hellesHaar ? .22 : .3), haarHell = avMix(haar, "#FFF6E0", hellesHaar ? .45 : .22);
  const haarHinten = c.frisur === "dutt" || c.frisur === "kranz" ? haar : hellesHaar ? avMix(haar, "#2A1A12", .12) : haarDunkel;
  const braue = F.kahl || c.frisur === "glatze" ? (AV_GRAU.includes(c.haar) ? avMix(haar, "#3A2A22", .38) : avMix(haar, "#3A2A22", .3)) : avMix(haar, "#3A2A22", hellesHaar ? .38 : .18);
  const lippe = c.bart === "voll" ? (c.haut === "h8" ? "#D48A7E" : "#C0625A") : c.haut === "h8" ? "#C47A6E" : c.haut === "h7" ? "#3A1712" : dunkleHaut ? "#6E2A22" : "#A9454A";
  const mundInnen = c.haut === "h8" ? "#2A0E0A" : dunkleHaut ? "#4A1C18" : "#8E3028";
  const oben2 = avMix(oben, "#101418", .22);
  const silber = alt && !AV_GRAU.includes(c.haar);
  // Hintergrund etwas abdunkeln, wenn Haut, Haar oder Oberteil sonst darin verschwinden
  let hg = avWert("hg", c.hg);
  const haarSichtbar = c.frisur !== "glatze";
  if (avKontrast(hg, haut) < 1.15 || (haarSichtbar && avKontrast(hg, haar) < 1.15) || avKontrast(hg, oben) < 1.12) hg = avMix(hg, "#7A6A5A", .2);
  // Kopf: Schädelform wie bei den festen Porträts, das Haar legt sich darüber
  const kopf = "M50 24 C62.4 24 68.6 33.6 68.6 47 C68.6 61 64 72 50 75.4 C36 72 31.4 61 31.4 47 C31.4 33.6 37.6 24 50 24Z";
  const vornForm = (F.vorn || "") + avKreise(F.kreise);
  const vb = opt.vb || (klein ? "9 9 82 82" : "0 0 100 100");
  const blinz = (avHash(JSON.stringify(c)) % 54) / 10;
  let s = `<svg class="portrait avatar" viewBox="${vb}" style="width:${gr}px;height:${gr}px" aria-hidden="true"><defs><clipPath id="${n}r"><circle cx="50" cy="50" r="49.2"/></clipPath>${vornForm ? `<clipPath id="${n}h">${vornForm}</clipPath>` : ""}${c.bart === "stoppel" ? `<pattern id="${n}p" width="1.5" height="1.5" patternUnits="userSpaceOnUse"><circle cx=".75" cy=".75" r="${klein ? .5 : .36}" fill="${FA.bart}"/></pattern>` : ""}</defs><g clip-path="url(#${n}r)">
  <circle cx="50" cy="50" r="48" fill="${hg}"/>`;
  // Haar hinten (beim Zopf auch der Ansatz hinter dem Ohr)
  if (F.hinten) s += `<g fill="${haarHinten}">${typeof F.hinten === "string" ? F.hinten : avKreise(F.hinten)}</g>`;
  if (F.zopf) s += `<path d="M66.6 49 Q71.6 52.6 71.8 60" stroke="${haar}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (F.band) s += `<path d="M42.6 21.6 Q50 18.8 57.4 21.6" stroke="${avMix(oben, "#000000", .1)}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  // Oberteil und Hals
  s += `<path d="M14 100 Q16 78 50 76 Q84 78 86 100Z" fill="${oben}"/>
  <path d="M42 68 L58 68 L57.4 78.6 Q50 83 42.6 78.6Z" fill="${schatten}"/><path d="M40.6 77.6 Q50 86.6 59.4 77.6" stroke="${oben2}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  // Kopf, Ohren
  s += `<path d="${kopf}" fill="${haut}"/>`;
  if (["h1", "h2"].includes(c.haut)) s += `<path d="M33 60 Q38 71 50 75.4 Q62 71 67 60" stroke="${schatten}" stroke-width="1.4" opacity=".5" fill="none"/>`;
  if (F.ohren) s += `<ellipse cx="31.2" cy="50.4" rx="2.7" ry="4.5" fill="${schatten}"/><ellipse cx="68.8" cy="50.4" rx="2.7" ry="4.5" fill="${schatten}"/><path d="M31.6 48.4 Q30.4 50.4 31.6 52.6 M68.4 48.4 Q69.6 50.4 68.4 52.6" stroke="${linie}" stroke-width=".6" fill="none" opacity=".5"/>`;
  // Stirnfalten (liegen unter dem Pony)
  if (alt) s += `<path d="M42.4 35.6 Q50 34 57.6 35.6 M44 38.4 Q50 37.2 56 38.4" stroke="${linie}" stroke-width=".65" fill="none" stroke-linecap="round" opacity=".55"/>`;
  if (F.glanz) s += `<path d="M42 29 Q50 26.6 58 29" stroke="#FFF4E6" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="${dunkleHaut ? .22 : .5}"/>`;
  // Ohrringe bei Frisuren, die die Ohren bedecken: unter das Haar
  const ohrring = (x, y) => {
    if (klein || c.ohrringe === "keine") return "";
    const p = (fx) => c.ohrringe === "stecker" ? `<circle cx="${fx}" cy="${y}" r="1.1" fill="#E4C76A"/>` : c.ohrringe === "perlen" ? `<circle cx="${fx}" cy="${y + .6}" r="1.5" fill="#FBF6EA"/><circle cx="${fx - .4}" cy="${y + .1}" r=".5" fill="#fff"/>` : `<circle cx="${fx}" cy="${y + 2.6}" r="2.8" fill="none" stroke="#D4B25A" stroke-width="1.3"/>`;
    return p(x) + p(100 - x);
  };
  if (!F.ohren) s += ohrring(F.ringX || 33.4, F.ringY || 57.6);
  // Haar vorn
  if (vornForm) {
    s += `<g fill="${haar}">${vornForm}</g>`;
    if (FA.haarKante && F.vorn) s += `<g fill="none" stroke="${avMix(haar, "#5A4030", .45)}" stroke-width=".8" opacity=".55">${F.vorn}</g>`;
    s += `<g clip-path="url(#${n}h)" fill="none" stroke-linecap="round">`;
    if (F.kreise) s += `<path d="${F.kreise.filter((q, i) => i % 2 === 0).map(([x, y, r]) => `M${(x - r * .55).toFixed(1)} ${(y + r * .25).toFixed(1)} Q${x} ${(y + r * .8).toFixed(1)} ${(x + r * .55).toFixed(1)} ${(y + r * .25).toFixed(1)}`).join(" ")}" stroke="${haarDunkel}" stroke-width="1" opacity="${hellesHaar ? .45 : .6}"/>`;
    if (F.licht) s += `<path d="${F.licht}" stroke="${haarHell}" stroke-width="1.7" opacity=".85"/>`;
    if (F.linie) s += `<path d="${F.linie}" stroke="${haarDunkel}" stroke-width="${hellesHaar ? .8 : 1.1}" opacity="${hellesHaar ? .45 : 1}"/>`;
    if (silber) s += `<path d="M30 46 Q32 30 46 22 M36 46 Q38 34 50 27 M56 21 Q68 26 70 42 M62 30 Q67 36 67.6 46" stroke="#ECE8DE" stroke-width="1.1" opacity=".6"/>`;
    else if (mittel && !AV_GRAU.includes(c.haar)) s += `<path d="M31 44 Q31.4 39 33.4 35.6 M69 44 Q68.6 39 66.6 35.6" stroke="#E6E2D8" stroke-width="1.1" opacity=".45"/>`;
    s += `</g>`;
  }
  // Brauen (bei großer bunter Brille höher, damit der Rahmen sie nicht verdeckt)
  const by = c.brille === "bunt" ? -2.6 : c.brille === "eckig" ? -.8 : 0;
  s += `<path d="M39.8 ${42.6 + by} Q43.5 ${41.2 + by} 47 ${42.6 + by} M53 ${42.6 + by} Q56.5 ${41.2 + by} 60.2 ${42.6 + by}" stroke="${braue}" stroke-width="${(c.bart !== "keiner" ? 1.4 : 1.15) * (klein ? 1.4 : 1)}" fill="none" stroke-linecap="round"/>`;
  // Augen
  const ry = alt ? 1.7 : 1.9;
  const auge = (x, q) => `<g class="auge-${q}"><ellipse cx="${x}" cy="47.6" rx="3.2" ry="${ry}" fill="#FFFDF5"/><circle cx="${x + .3}" cy="47.8" r="1.75" fill="${iris}"/><circle cx="${x + .3}" cy="47.8" r=".8" fill="#1C2620"/><circle cx="${x + .9}" cy="47.2" r=".45" fill="#fff"/><path d="M${x - 3.6} 47.8 Q${x} ${alt ? 44.8 : 44.4} ${x + 3.6} 47.8" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>`;
  s += `<g class="augen" style="animation-delay:-${blinz}s">${auge(43.5, "l")}${auge(56.5, "r")}</g>`;
  if (alt || mittel) s += `<path d="M40.9 50.1 Q43.5 51.2 46.1 50.1 M53.9 50.1 Q56.5 51.2 59.1 50.1" stroke="${linie}" stroke-width=".7" fill="none" stroke-linecap="round" opacity="${alt ? .8 : .45}"/><path d="M37.6 47 L35.9 46.2${alt ? " M37.8 48.6 L36 48.8" : ""} M62.4 47 L64.1 46.2${alt ? " M62.2 48.6 L64 48.8" : ""}" stroke="${linie}" stroke-width=".7" stroke-linecap="round" opacity="${alt ? .75 : .45}"/>`;
  // Nase
  const nase = { klein: "M50.4 52 Q49.2 55 50.8 55.6", gerade: "M50.4 51 Q48.4 55.8 50.9 56.8", kraeftig: "M50.8 49.8 Q47.6 55.2 48.2 56.6 Q50 58.2 52.8 56.6", stups: "M50.2 52.4 Q48.6 55.6 50 56.2 Q51.4 56.6 52.4 55.4" }[c.nase];
  const nk = (opt.dick ? 1.6 : 1) * (klein ? 1.3 : 1);
  s += `<path d="${nase}" stroke="${linie}" stroke-width="${(c.nase === "kraeftig" ? 1.2 : 1) * nk}" fill="none" stroke-linecap="round"/>`;
  if (c.nase === "kraeftig") s += `<path d="M47.6 55.6 Q46.4 56.4 47.4 57.4" stroke="${linie}" stroke-width="${.8 * nk}" fill="none" stroke-linecap="round" opacity=".7"/>`;
  if (alt) s += `<path d="M44.6 57 Q42 59.8 43 63.2 M55.4 57 Q58 59.8 57 63.2" stroke="${linie}" stroke-width=".7" fill="none" stroke-linecap="round" opacity=".5"/>`;
  // Bart
  if (c.bart === "stoppel") s += `<path d="M32.4 52 Q33 70.4 50 75.4 Q67 70.4 67.6 52 Q66.4 63.4 60 65.4 Q55 61.4 50 62 Q45 61.4 40 65.4 Q33.6 63.4 32.4 52Z M43 60 Q46 56.8 50 58 Q54 56.8 57 60 Q53.6 59.4 50 59.8 Q46.4 59.4 43 60Z" fill="url(#${n}p)" opacity=".85"/>`;
  if (c.bart === "voll") s += `<path d="M31.6 46.6 Q30.6 71 50 79 Q69.4 71 68.4 46.6 L66.6 50 Q65.8 62.6 59.6 65 Q55 61.4 50 62 Q45 61.4 40.4 65 Q34.2 62.6 33.4 50Z" fill="${FA.bart}"/><path d="M40 70 Q50 76.6 60 70" stroke="${avMix(FA.bart, "#1A100A", .3)}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6"/>`;
  if (c.bart === "schnurr" || c.bart === "voll") s += `<path d="M42.4 60.6 Q44.6 56.6 50 58 Q55.4 56.6 57.6 60.6 Q55.4 61.8 53 61 Q50 60.2 47 61 Q44.6 61.8 42.4 60.6Z" fill="${c.bart === "voll" ? avMix(FA.bart, "#1A100A", .25) : FA.bart}"/>`;
  // Mund
  const mund = {
    lachen: `<path d="M43 62.6 Q50 69.1 57 62.6 Q50 64.3 43 62.6Z" fill="${mundInnen}"/><path d="M44.3 63 Q50 64.8 55.7 63 L55 64.2 Q50 65.6 45 64.2Z" fill="#FFFDF5"/>`,
    laecheln: `<path d="M43.6 62.2 Q50 67.2 56.4 62.2 Q50 63.8 43.6 62.2Z" fill="${lippe}"/>`,
    schmunzeln: `<path d="M44.4 62.8 Q50.4 65.8 56.2 61.6" stroke="${lippe}" stroke-width="${1.6 * (klein ? 1.4 : 1)}" fill="none" stroke-linecap="round"/>`
  }[c.mund];
  s += `<g class="mund">${mund}</g>`;
  if (c.bart === "keiner" || c.bart === "stoppel") s += `<ellipse cx="38.5" cy="56.4" rx="3.4" ry="2.1" fill="${wange}" opacity="${c.alter === "jung" ? .42 : .32}"/><ellipse cx="61.5" cy="56.4" rx="3.4" ry="2.1" fill="${wange}" opacity="${c.alter === "jung" ? .42 : .32}"/>`;
  // Zopf: fällt über die Schulter nach vorn
  if (F.zopf) { const z2 = hellesHaar ? avMix(haar, haarDunkel, .5) : haarDunkel, gummi = c.oben === "rot" ? "#F2C14E" : "#D2342C";
    s += `<g>${[[71.8, 61], [72.4, 66.4], [72.8, 71.8], [73, 77.2]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="3.2" fill="${i % 2 ? z2 : haar}" transform="rotate(${i % 2 ? 14 : -14} ${x} ${y})"/>`).join("")}<rect x="70.6" y="79.4" width="5" height="2.6" rx="1.2" fill="${gummi}"/><path d="M71.4 82 Q71 86.6 73 89 Q75.2 86.6 74.8 82Z" fill="${haar}"/></g>`; }
  // Ohrringe am Ohrläppchen
  if (F.ohren) s += ohrring(31, 53.8);
  // Brille (Bügel nur, wenn die Ohren frei sind)
  const bk = klein ? 1.6 : 1;
  if (c.brille === "rund") s += `<g fill="none" stroke="#9A7A3E" stroke-width="${1.2 * bk}"><circle cx="43.5" cy="47.8" r="5"/><circle cx="56.5" cy="47.8" r="5"/><path d="M48.5 47.2 Q50 46 51.5 47.2${F.ohren ? " M38.5 47 L31.4 45.6 M61.5 47 L68.6 45.6" : ""}"/></g>`;
  if (c.brille === "eckig") s += `<g fill="none" stroke="#2A2A2E" stroke-width="${1.5 * bk}"><rect x="37.4" y="43.8" width="11.4" height="7.6" rx="1.6"/><rect x="51.2" y="43.8" width="11.4" height="7.6" rx="1.6"/><path d="M48.8 46.4 Q50 45.4 51.2 46.4${F.ohren ? " M37.4 46 L31.4 45 M62.6 46 L68.6 45" : ""}"/></g>`;
  if (c.brille === "bunt") s += `<g fill="none" stroke="#D2342C" stroke-width="${1.7 * bk}"><path d="M38 44 Q38.5 41 43.5 41.2 Q48.3 41.4 48 45.4 Q47.5 51.6 43 51.6 Q38.4 51.4 38 47Z M52 45.4 Q51.7 41.4 56.5 41.2 Q61.5 41 62 44 L62 47 Q61.6 51.4 57 51.6 Q52.5 51.6 52 45.4Z"/><path d="M48 45 Q50 43.8 52 45${F.ohren ? " M38 44.6 L31.4 44 M62 44.6 L68.6 44" : ""}" stroke-width="1.3"/></g>`;
  return s + `</g></svg>`;
}

/* Bild einer Person für Listen, Chips, Einträge: feste Figuren → ihr Porträt, sonst eigenes Gesicht oder Initiale */
function personBild(m, gr = 40, ohneInitiale) {
  if (!m || typeof m !== "object") return "";
  const fest = AV_FEST[m.id];
  if (fest) { const f = { maxSVG, janeSVG, michaSVG, gretaSVG, pauliSVG, karinKopfSVG, ritaSVG }[fest]; if (f) return f(gr); }
  if (m.avatar && typeof m.avatar === "object") return avatarSVG(m.avatar, gr);
  if (ohneInitiale) return "";
  return avInitialeHTML(m, gr);
}
function avInitialeHTML(m, gr) {
  const farbe = typeof m.farbe === "string" && /^#[0-9a-f]{6}$/i.test(m.farbe) ? m.farbe : "#7A5A9A";
  return `<span class="person-initiale" style="width:${gr}px;height:${gr}px;background:${farbe};font-size:${Math.round(gr * .45)}px" aria-hidden="true">${esc(avInitiale(m.name))}</span>`;
}
const personFest = m => !!(m && AV_FEST[m.id]);

/* Farben und Frisur für die kleine Figur im Bild „Wer heute da ist“ (scene.js) */
function avatarFigur(id) {
  const m = (S.menschen || []).find(x => x.id === id); if (!m || !m.avatar) return null;
  const c = avatarNorm(m.avatar), FA = avFarben(c), kahl = c.frisur === "glatze" || c.frisur === "kranz";
  return { haut: FA.haut, haar: kahl ? null : FA.haar, kranz: c.frisur === "kranz" ? FA.haar : null, frisur: c.frisur, bart: c.bart === "voll" || c.bart === "schnurr" ? FA.bart : null, bartArt: c.bart,
    oben: FA.oben, unten: "#5A6272", schuh: "#3A3530", brille: c.brille === "keine" ? null : c.brille === "bunt" ? "#D2342C" : "#2A2A2E", locken: ["locken", "welle"].includes(c.frisur), gross: 1 };
}

/* Frisur und Bart der kleinen Figur (Canvas, Kopf bei 0/-67) */
function avFigurExtras(ctx, F, flaeche) {
  const kreis = (x, y, r, f) => { ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
  if (F.haar && F.frisur === "lang") { flaeche([[-8.6, -62], [-9, -51], [-6, -51], [-6, -62]], F.haar); flaeche([[8.6, -62], [9, -51], [6, -51], [6, -62]], F.haar); }
  if (F.haar && F.frisur === "bob") { flaeche([[-8.6, -63], [-8.8, -58.6], [-6, -58.6], [-6, -63]], F.haar); flaeche([[8.6, -63], [8.8, -58.6], [6, -58.6], [6, -63]], F.haar); }
  if (F.haar && F.frisur === "dutt") kreis(0, -77.5, 3, F.haar);
  if (F.haar && F.frisur === "zopf") [[7, -60], [7.6, -56], [8, -52]].forEach(([x, y]) => kreis(x, y, 1.8, F.haar));
  if (F.kranz) { ctx.fillStyle = F.kranz; ctx.beginPath(); ctx.ellipse(-6.8, -66, 1.4, 3, 0, 0, Math.PI * 2); ctx.ellipse(6.8, -66, 1.4, 3, 0, 0, Math.PI * 2); ctx.fill(); }
  if (F.bart && F.bartArt === "voll") { ctx.fillStyle = F.bart; ctx.beginPath(); ctx.ellipse(0, -62.4, 5.6, 3.8, 0, 0, Math.PI); ctx.fill(); ctx.fillRect(-5.6, -64, 11.2, 1.8); }
  if (F.bart && F.bartArt === "schnurr") { ctx.fillStyle = F.bart; ctx.fillRect(-2.6, -64.4, 5.2, 1.3); }
}

/* ---------- Editor ---------- */
let AVED = null; // { id, cfg, ohne (nur Anfangsbuchstabe), geaendert, neu, zurueck }
function avZufall() {
  const w = k => AV[k][Math.floor(Math.random() * AV[k].length)][0], ja = p => Math.random() < p;
  const alter = w("alter"), c = { alter, haut: w("haut"), augen: w("augen"), nase: w("nase"), mund: w("mund"), oben: w("oben"), hg: w("hg") };
  c.haar = alter === "aelter" ? (ja(.6) ? AV_GRAU[Math.floor(Math.random() * 3)] : w("haar")) : AV.haar.filter(h => !["grau", "weiss"].includes(h[0]))[Math.floor(Math.random() * 8)][0];
  c.frisur = w("frisur"); if (c.frisur === "glatze" && alter === "jung" && ja(.7)) c.frisur = "kurz";
  c.bart = ja(.3) ? w("bart") : "keiner"; c.brille = ja(.45) ? AV.brille[1 + Math.floor(Math.random() * 3)][0] : "keine"; c.ohrringe = ja(.4) ? AV.ohrringe[1 + Math.floor(Math.random() * 3)][0] : "keine";
  return c;
}
function avVorname(name) { const w = String(name || "").trim().split(/\s+/)[0] || ""; return avZeichen(w).length <= 14 ? w : ""; }
function avatarEditor(id, opt = {}) {
  const m = S.menschen.find(x => x.id === String(id)); if (!m || personFest(m)) return;
  const hat = !!(m.avatar && typeof m.avatar === "object");
  AVED = { id: m.id, cfg: avatarNorm(hat ? m.avatar : avZufall()), ohne: !hat && !opt.neu, geaendert: false, neu: !!opt.neu, zurueck: opt.zurueck || null };
  if (opt.neu) { m.avatar = { ...AVED.cfg }; speichern(); } // neues Gesicht gilt sofort (auch wenn die App zwischendurch zugeht)
  const vn = avVorname(m.name);
  const titel = opt.neu ? (vn ? `Wie sieht ${vn} aus?` : "Gesicht aussuchen") : hat ? "Gesicht ändern" : "Gesicht aussuchen";
  sheet({ titel, id: "avatar", inhalt: avatarEditorInhalt(),
    fuss: `<div class="zeile" style="gap:10px"><button class="knopf zweit" data-act="av-zufall" style="flex:1">${ic("funke")}Zufällig</button><button class="knopf" data-act="av-fertig" style="flex:1.4">Fertig</button></div>`,
    onclose: () => { if (!AVED) return; avNamenUebernehmen(); const mm = S.menschen.find(x => x.id === AVED.id);
      if (mm && AVED.geaendert) { if (AVED.ohne) delete mm.avatar; else mm.avatar = { ...AVED.cfg }; }
      speichern(); const z = AVED.zurueck; AVED = null;
      try { render({ halteScroll: true, ohneAnim: true }); } catch (e) { }
      if (z) z(); else if (SHEETS.length && SHEETS[SHEETS.length - 1].id === "einst") sheetInhalt(einstellungenInhalt()); } });
}
/* Vorschau für die Frisur-Kacheln: Haarfarbe, die sich sicher vom Hintergrund und der Haut abhebt */
function avFrisurVorschau(c) {
  const hg = "himmel", haut = avWert("haut", c.haut), ok = h => avKontrast(avWert("haar", h), haut) >= 1.3 && avKontrast(avWert("haar", h), avWert("hg", hg)) >= 1.3;
  return { ...c, hg, haar: ok(c.haar) ? c.haar : ["asch", "braun", "schwarz", "hasel"].find(ok) || "braun", bart: "keiner", brille: "keine" };
}
function avatarEditorInhalt() {
  const m = S.menschen.find(x => x.id === AVED.id); if (!m) return "";
  const c = AVED.cfg, ohne = AVED.ohne;
  const kachel = (k, o, bild) => `<button class="av-wahl" aria-pressed="${!ohne && c[k] === o[0]}" data-act="av-setz" data-k="${k}" data-v="${o[0]}">${bild}<span>${o[1].startsWith("#") ? o[2] : o[1]}</span></button>`;
  const kacheln = (k, titel, vb, basis = c, extra = {}) => `<h3 class="av-titel">${titel}</h3><div class="av-raster">${AV[k].map(o => kachel(k, o, avatarSVG({ ...basis, [k]: o[0] }, 56, { vb, ...extra }))).join("")}</div>`;
  const farben = (k, titel) => `<h3 class="av-titel">${titel}</h3><div class="av-farben">${AV[k].map(o => { const an = !ohne && c[k] === o[0]; return `<button class="av-farbe${avLum(o[1]) > .45 ? " hell" : ""}" aria-pressed="${an}" aria-label="${o[2]}" title="${o[2]}" data-act="av-setz" data-k="${k}" data-v="${o[0]}" style="--f:${o[1]}">${an ? ic("haken") : ""}</button>`; }).join("")}</div><p class="klein av-gewaehlt">${ohne ? "" : avName(k, c[k])}</p>`;
  const gesicht = "26 28 48 48", unten = "24 38 52 52";
  const bild = ohne ? avInitialeHTML(m, 116) : avatarSVG(c, 116);
  return `<div class="av-vorschau"><div class="av-bild">${bild}</div><div class="av-name"><label class="feld" for="av-name">Name</label><input id="av-name" class="text" value="${esc(m.name)}" maxlength="30" aria-label="Name"><label class="feld" for="av-rolle">Wer ist das für dich?</label><input id="av-rolle" class="text" value="${esc(m.rolle || "")}" maxlength="40" placeholder="z. B. Nachbarin" aria-label="Rolle"></div></div>
  <h3 class="av-titel">Bild in der Liste</h3><div class="av-raster av-zwei"><button class="av-wahl" aria-pressed="${!ohne}" data-act="av-mit">${avatarSVG(c, 56)}<span>Gesicht</span></button><button class="av-wahl" aria-pressed="${ohne}" data-act="av-ohne">${avInitialeHTML(m, 56)}<span>Nur Anfangs&shy;buchstabe</span></button></div>
  <p class="klein" style="margin:8px 0 0">${ohne ? "Tipp auf „Gesicht“ oder gleich unten auf etwas, das passt." : "Tipp auf das, was passt. Alles lässt sich jederzeit wieder ändern."}</p>
  ${kacheln("alter", "Alter", "30 28 40 40")}${farben("haut", "Hautfarbe")}${kacheln("frisur", "Frisur", "12 6 76 76", avFrisurVorschau(c))}${farben("haar", "Haarfarbe")}${farben("augen", "Augenfarbe")}
  ${kacheln("nase", "Nase", "38 45 24 24", { ...c, brille: "keine", bart: "keiner" }, { dick: true })}${kacheln("mund", "Mund", "34 48 32 32")}${kacheln("brille", "Brille", gesicht)}${kacheln("bart", "Bart", unten)}${kacheln("ohrringe", "Ohrringe", "22 36 56 56")}
  ${farben("oben", "Oberteil")}${farben("hg", "Hintergrund")}`;
}
function avName(k, id) { const o = AV[k].find(x => x[0] === id); return o ? o[o.length - 1] : ""; }
function avNamenUebernehmen() {
  const m = S.menschen.find(x => x.id === AVED.id); if (!m) return;
  const ni = $("#av-name"), ri = $("#av-rolle"); if (!ni) return;
  const n = (ni.value || "").trim(), r = (ri ? ri.value : m.rolle || "").trim();
  if (n) m.name = avKuerzen(n, 30); m.rolle = avKuerzen(r, 40);
}
function avNeuMalen() {
  avNamenUebernehmen();
  const sh = aktuellesSheet(); if (!sh || sh.dataset.id !== "avatar") return;
  sheetInhalt(avatarEditorInhalt());
}
function avSpeichern(m) { AVED.geaendert = true; if (AVED.ohne) delete m.avatar; else m.avatar = { ...AVED.cfg }; speichern(); }
function avAktion(a, d) {
  if (a === "av-auf") { const m = S.menschen.find(x => x.id === d.id); if (m && !personFest(m)) avatarEditor(m.id); return; }
  if (!AVED) return;
  const m = S.menschen.find(x => x.id === AVED.id); if (!m) return;
  if (a === "av-setz") { if (!(d.k in AV_STANDARD)) return; AVED.cfg = avatarNorm({ ...AVED.cfg, [d.k]: d.v }); AVED.ohne = false; avSpeichern(m); haptik("auswahl"); avNeuMalen(); sag(`${avName(d.k, d.v)} gewählt.`); }
  else if (a === "av-mit" || a === "av-ohne") { AVED.ohne = a === "av-ohne"; avSpeichern(m); haptik("auswahl"); avNeuMalen(); sag(AVED.ohne ? "Nur der Anfangsbuchstabe." : "Mit Gesicht."); }
  else if (a === "av-zufall") { AVED.cfg = avatarNorm(avZufall()); AVED.ohne = false; avSpeichern(m); haptik("auswahl"); avNeuMalen(); const b = $(".av-bild .portrait"); if (b && !REDUCED()) b.animate([{ transform: "scale(.9) rotate(-4deg)" }, { transform: "scale(1.04) rotate(2deg)" }, { transform: "none" }], { duration: 380, easing: "ease-out" }); }
  else if (a === "av-fertig") { avNamenUebernehmen(); avSpeichern(m); haptik("erfolg"); const neu = AVED.neu, ohne = AVED.ohne; sheetZu(); toast(ohne ? `${m.name} bleibt beim Anfangsbuchstaben.` : neu ? `${m.name} ist jetzt in der Auswahl – mit Gesicht.` : `So sieht ${m.name} jetzt aus.`, { dauer: 2800 }); }
}
