/* ============================================================
   Kleine Überraschungen: Max, Hühnchen und Christiane melden sich
   ab und zu – an bestimmten Tagen, nach bestimmten Dingen, zufällig.
   Regeln: höchstens 1 Tages-Ereignis, dazu höchstens 2 nach Antippen/Abhaken;
   nicht am ersten Tag; an Sparflamme-Tagen nur die leisen; abschaltbar.
   ============================================================ */
const EI_LEISE = ["huhn-sparflamme-3", "max-sparflamme-zettel", "christiane-weihnachten", "max-geburtstag", "huhn-lange-weg", "max-wieder-da"];
const EI_EINMAL = ["huhn-100", "max-250", "christiane-500", "huhn-marathon", "max-100km", "huhn-tanz-10", "max-tschuess-zehn"];

function eiZustand() { if (!S.eier || typeof S.eier !== "object") S.eier = {}; if (!S.eierTag || S.eierTag.tag !== heute()) S.eierTag = { tag: heute(), tages: 0, extra: 0 }; return S.eier; }
function eiWuerfel(id) { return (hash32("ei" + id + heute() + S.seed) % 10000) / 10000; }
function eiErlaubt(id, art) {
  if (S.eierAus || !D.eier || !D.eier[id]) return false;
  const e = D.eier[id], gefunden = eiZustand()[id];
  if (heute() === S.start) return false;
  if (e.wer === "huhn" && !S.huhn) return false;
  if (S.tf[heute()] === "D" && !EI_LEISE.includes(id)) return false;
  if (S.timer || S.plaene.some(p => p.status === "unterwegs")) return false;
  if (gefunden && EI_EINMAL.includes(id)) return false;
  if (gefunden && (tagDatum(heute()) - tagDatum(gefunden)) / 864e5 < 60) return false;
  if (art === "tag" && S.eierTag.tages >= 1) return false;
  if (art === "extra" && S.eierTag.extra >= 2) return false;
  return eiWuerfel(id) < (e.selten ?? 1);
}
const EI_WER = { huhn: "Hühnchen", max: "Max", christiane: "Christiane", micha: "Micha" };
function eiZeigen(id, art) {
  const e = D.eier[id]; eiZustand()[id] = heute();
  if (art === "tag") S.eierTag.tages++; else S.eierTag.extra++;
  S.fundstuecke = [{ id, tag: heute(), wer: e.wer, text: e.text }, ...(S.fundstuecke || [])].slice(0, 120);
  if (e.form === "sprechblase" || (e.form === "bild" && e.wer === "huhn")) S.huhnSagt = { tag: heute(), text: e.text };
  else if (e.form === "brief") S.extraPost = { tag: heute(), wer: e.wer, text: e.text };
  else if (e.form === "zettel" || e.form === "bild") S.zettel = { tag: heute(), wer: e.wer, text: e.text };
  speichern();
  if (e.form === "toast") {
    // nach einem Eintrag erst, wenn die Rückmeldung weg ist – nicht alles auf einmal
    const bis = Date.now() + 30000;
    const zeig = () => { if (art === "extra" && $(".toast") && Date.now() < bis) { setTimeout(zeig, 700); return; } toast(`${EI_WER[e.wer]}: „${e.text}“`, { dauer: 7000 }); };
    setTimeout(zeig, art === "extra" ? 1800 : 600);
  }
  return true;
}
function eiVersuch(ids, art) { for (const id of ids) if (eiErlaubt(id, art)) return eiZeigen(id, art); return false; }

/* Tages-Ereignisse: beim Öffnen von „Heute“ */
function eierTag() {
  if (S.eierAus || !S.onboard || SHEETS.length) return;
  eiZustand();
  const d = jetzt(), h = d.getHours(), m = d.getMonth() + 1, t = d.getDate(), so = d.getDay() === 0, j = d.getFullYear();
  const zuletzt = S.zuletztOffen && S.zuletztOffen !== heute() ? Math.round((tagDatum(heute()) - tagDatum(S.zuletztOffen)) / 864e5) : 0;
  const km = S.eintraege.filter(e => tat(e.t).art === "km").reduce((s, e) => s + (e.km || 0), 0), n = S.eintraege.length;
  const kandidaten = [];
  if (S.geburtstag && S.geburtstag === `${String(m).padStart(2, "0")}-${String(t).padStart(2, "0")}` && typeof mbIstGeburtstag !== "function") kandidaten.push("max-geburtstag"); // sonst kommt der Geburtstagsbrief aus maxbriefe.js
  if (m === 12 && t === 24 && h >= 12) kandidaten.push("christiane-weihnachten");
  if (m === 12 && t === 31 && h >= 18) kandidaten.push("max-silvester");
  if (m === 4 && t === 1) kandidaten.push("max-erster-april");
  if (m === 9 && t === 1) kandidaten.push("max-gleis");
  if (m === 7 && t === 31) kandidaten.push("huhn-harry-geburtstag");
  if (m === 12 && t === 6) kandidaten.push("max-nikolaus");
  if (heute() === osterSonntag(j)) kandidaten.push("huhn-ostern");
  if (m === 12 && t <= 26) kandidaten.push("huhn-muetze");
  if (zuletzt >= 14) kandidaten.push("huhn-lange-weg"); else if (zuletzt >= 7) kandidaten.push("max-wieder-da");
  if (n >= 500) kandidaten.push("christiane-500"); if (n >= 250) kandidaten.push("max-250"); if (n >= 100) kandidaten.push("huhn-100");
  if (km > 100) kandidaten.push("max-100km"); if (km > 42.2) kandidaten.push("huhn-marathon");
  if (S.eintraege.filter(e => e.t === "tanzstunde").length >= 10) kandidaten.push("huhn-tanz-10");
  if ((S.tschuessSiege || 0) >= 10) kandidaten.push("max-tschuess-zehn");
  if (so && m === 11 && t <= 7 && h >= 11 && h < 15) kandidaten.push("christiane-braeter");
  if (so && (m >= 4 && m <= 5 || (m === 6 && t <= 24)) && h >= 11 && h < 16) kandidaten.push("christiane-rhabarber");
  if (so && (m === 8 || m === 9) && h >= 13 && h < 17) kandidaten.push("christiane-pflaume");
  if (so && h >= 11 && h < 14) kandidaten.push("christiane-sonntag");
  if (h < 5) kandidaten.push("huhn-nachtschicht");
  eiVersuch(kandidaten, "tag");
  S.zuletztOffen = heute(); speichern();
}
function letzterSonntag(y, monat) { const d = new Date(y, monat, 0, 12); return d.getDate() - d.getDay(); } // Tag im Monat (1–12)
function osterSonntag(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1; return tagVon(new Date(y, mo - 1, da, 12)); }

/* Nach einem Eintrag */
function eierEintrag(e) {
  if (!e) return; eiZustand(); const ids = [];
  if (e.t === "telefon" && e.person === "christiane" && (e.min || 0) >= 60) ids.push("christiane-stunde");
  if (e.t === "telefon" && e.person === "max") ids.push("max-aufgelegt");
  if (e.t === "besuch" && e.person === "christiane" && tagDatum(e.tag).getDay() === 0) ids.push("christiane-stueck");
  if (e.t === "buchfertig" && (D.hp?.baende || []).some(b => b.titel === e.titel)) ids.push("max-band-fertig");
  if (e.t === "abgehakt") { const x = e.notiz || "";
    if (/kuchen|backen|gebacken|torte/i.test(x)) ids.push("christiane-liste-kuchen");
    if (/christiane/i.test(x)) ids.push("christiane-liste-name");
    if (/\bmax\b/i.test(x)) ids.push("max-liste-name");
    if (/fenster/i.test(x)) ids.push("huhn-liste-fenster");
    if (/steuer|finanzamt|formular|antrag|versicherung|rechnung|überweis/i.test(x)) ids.push("huhn-liste-papier"); }
  eiVersuch(ids, "extra");
}
/* Tagesform gewählt */
function eierTagesform(v) {
  const vor = k => S.tf[tagPlus(heute(), -k)];
  if (v === "D" && vor(1) === "D" && vor(2) === "D") eiVersuch(["huhn-sparflamme-3"], "extra");
  else if (v !== "D" && vor(1) === "D" && vor(2) === "D" && vor(3) === "D") eiVersuch(["huhn-andere-kachel", "max-sparflamme-zettel"], "extra");
}
/* Hühnchen 7× antippen, Kapitel 13, schönster Moment, Tschüss-Ausdauer, lange Sitzung */
let EI_TAPS = [];
function eierHuhnTap() { const n = Date.now(); EI_TAPS = EI_TAPS.filter(t => n - t < 5000).concat(n); if (EI_TAPS.length >= 7) { EI_TAPS = []; if (eiVersuch(["huhn-antippen-7"], "extra")) render({ halteScroll: true, ohneAnim: true }); } }
function eierKapitel(k) { if (k === 13) eiVersuch(["huhn-kapitel-13"], "extra"); }
function eierMoment(text) { if (/huhn|hühnchen/i.test(text || "")) eiVersuch(["huhn-moment"], "extra"); }
function eierTschuess(n) { if (n === 8) eiVersuch(["max-tschuess-daumen"], "extra"); }
let EI_SITZUNG = Date.now();
document.addEventListener("visibilitychange", () => { if (!document.hidden) EI_SITZUNG = Date.now(); });
setInterval(() => { if (!document.hidden && Date.now() - EI_SITZUNG > 600000 && !SHEETS.length && !S.timer) { EI_SITZUNG = Date.now() + 864e5; eiVersuch(["huhn-zehn-minuten"], "extra"); } }, 30000);

/* Zettel auf „Heute“ */
function zettelHTML() {
  const z = S.zettel; if (!z || z.tag !== heute() || z.weg) return "";
  const kopf = z.wer === "max" ? maxSVG(40) : z.wer === "huhn" ? huhnSVG({ gr: 40, kopf: true }) : z.wer === "christiane" ? janeSVG(40) : z.wer === "micha" ? michaSVG(40) : `<span class="zettel-initial">${(EI_WER[z.wer] || "?")[0]}</span>`;
  return `<section class="abschnitt"><div class="zettel-notiz"><span class="zettel-nadel" aria-hidden="true"></span><div class="zeile" style="gap:10px;align-items:flex-start">${kopf}<div style="flex:1;min-width:0"><span class="klein" style="font-weight:700">${esc(EI_WER[z.wer] || "")}</span><p style="margin:2px 0 0">${esc(z.text)}</p></div></div><button class="knopf klein leise" data-act="zettel-weg" style="margin-top:6px">Schön, danke</button></div></section>`;
}
