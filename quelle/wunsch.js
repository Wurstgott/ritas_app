/* ============================================================
   Wunsch an Max: Rita schreibt Verbesserungswünsche – mit Anregungen,
   welche Art Rückmeldung hilft – und schickt sie per WhatsApp an Max.
   ============================================================ */
const MAX_WA = atob("NDkxNzkzNDc4NjAw");
const WUNSCH_ANREGUNGEN = [
  ["Eine Gewohnheit fehlt", "Ich mache regelmäßig … – das würde ich gern eintragen können."],
  ["Ein Mensch soll vorkommen", "… gehört in meinen Alltag. Schön wäre, wenn …"],
  ["Das nervt mich", "Mich stört, dass …"],
  ["Das verstehe ich nicht", "Ich weiß nicht, was … bedeutet / wofür … gut ist."],
  ["Das macht mir Spaß", "Am liebsten mag ich …, davon gern mehr."],
  ["Das ist zu klein / zu viel", "… ist mir zu klein / zu viel / zu oft."],
  ["Eine Idee für die App", "Toll wäre, wenn die App …"]
];
let WUNSCH = "";
function wunschSheet() {
  sheet({ titel: "Wunsch an Max", id: "wunsch", inhalt: wunschInhalt(), fuss: `<button class="knopf haupt voll" data-act="wunsch-senden">${ic("brief")} Per WhatsApp an Max schicken</button>` });
}
function wunschInhalt() {
  return `<div class="zeile" style="gap:12px;align-items:flex-start;margin-bottom:12px"><div class="fig-idle">${maxSVG(56)}</div><p style="margin:0">Ich baue die App für dich weiter. Am meisten helfen mir <b>konkrete</b> Sachen aus deinem echten Alltag: Was machst du wirklich, wer gehört dazu, was fehlt, was nervt? Ein Satz reicht. Auch Kritik ist willkommen – je ehrlicher, desto besser wird’s.</p></div>
    <label class="feld">Worum geht’s? (antippen = Satzanfang)</label>
    <div class="chips">${WUNSCH_ANREGUNGEN.map(([t], i) => chip(false, t, `data-act="wunsch-anr" data-i="${i}"`)).join("")}</div>
    <label class="feld" for="wunsch-text">Dein Wunsch</label>
    <textarea id="wunsch-text" class="text" rows="6" data-wunsch="1" placeholder="Zum Beispiel: Ich gehe jeden Donnerstag mit Gisela schwimmen – das würde ich gern eintragen.">${esc(WUNSCH)}</textarea>
    <p class="klein">Beim Abschicken öffnet sich WhatsApp mit deinem Text an Max. Dort nur noch auf „Senden“ tippen.</p>`;
}
document.addEventListener("input", ev => { if (ev.target.dataset && ev.target.dataset.wunsch) WUNSCH = ev.target.value; });
function wunschAktion(a, d) {
  if (a === "wunsch-auf") { wunschSheet(); return; }
  if (a === "wunsch-anr") { const t = WUNSCH_ANREGUNGEN[Number(d.i)][1]; WUNSCH = (WUNSCH.trim() ? WUNSCH.trim() + "\n" : "") + t; sheetInhalt(wunschInhalt()); const ta = $("#wunsch-text"); if (ta) { ta.focus(); const p = ta.value.indexOf("…"); if (p >= 0) ta.setSelectionRange(p, p + 1); } return; }
  if (a === "wunsch-senden") {
    const t = (WUNSCH || "").trim(); if (!t) { toast("Schreib erst ein, zwei Sätze."); $("#wunsch-text")?.focus(); return; }
    const text = `Wunsch für Ritas App:\n${t}`;
    S.wuensche = [{ tag: heute(), text: t }, ...(S.wuensche || [])].slice(0, 50); speichern();
    window.open(`https://wa.me/${MAX_WA}?text=${encodeURIComponent(text)}`, "_blank");
    WUNSCH = ""; sheetZu(); toast("Danke! Max freut sich.", { erfolg: true });
  }
}
