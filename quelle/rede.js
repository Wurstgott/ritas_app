/* ============================================================
   Schwedische Redensarten: „Bring’s Max bei“ (Max, 14:26)
   Im Ideen-Blatt „Keine Kuh auf dem Eis“ (SD256): jede Redensart mit Bedeutung und
   Aussprache-Hilfe. Rita schickt sie Max per WhatsApp (Nummer wie in wunsch.js: MAX_WA)
   oder merkt sie sich fürs nächste Telefonat (To-do-Liste).
   Aussprache: einfache Lautschrift auf Deutsch, GROSS = betont, „s“ immer scharf wie in „Bus“.
   Geprüft gegen die Standardaussprache (IPA in Klammern):
   – ko [kuː] → KUH · på [poː] → poh · isen [ˈiːsɛn] → IHsen · ingen [ˈɪŋːɛn] → INgen
   – ordnar [ˈoːɖnar]: langes o wie „Ohr“ (nicht kurz wie in „Ordnung“), r und d verschmelzen → OHRdnar · sig [sɛj] → sej
   – räkmacka [ˈrɛːkˌmakːa] → RÄHKmacka · glida [ˈɡliːda] → GLIEda
   – smör [smœːr] → SMÖHR · Småland [ˈsmoːland] → SMOHland
   – där [dɛːr] → dähr · hund [hɵnd] → HÖND · begraven [bɛˈɡrɑːvɛn] → beGRAHwen
   – ute [ˈʉːtɛ] → ÜHte · cyklar [ˈsʏklar] → SÜCKlar · du [dʉː] → düh · och [ɔ] → o
   – ugglor [ˈɵɡlʊr] → ÖGGlur · mossen [ˈmɔsːɛn] → MOSSen · anar [ˈɑːnar] → AHnar · jag [jɑː(ɡ)] → jah
   – lagom [ˈlɑːɡɔm] → LAHgom · bäst [bɛst] → BEST
   Zustand: S.rede = { gesendet: { id: "JJJJ-MM-TT" }, gemerkt: { id: "JJJJ-MM-TT" } }
   ============================================================ */
const REDENSARTEN = [
  { id: "ko", sv: "Det är ingen ko på isen.", laut: "deh äh INgen KUH poh IHsen", wort: "Es ist keine Kuh auf dem Eis.", heisst: "Kein Grund zur Sorge." },
  { id: "ordnar", sv: "Det ordnar sig.", laut: "deh OHRdnar sej", wort: "Das ordnet sich.", heisst: "Das wird schon." },
  { id: "raekmacka", sv: "Glida in på en räkmacka.", laut: "GLIEda in poh en RÄHKmacka", wort: "Auf einem Krabbenbrot hereingleiten.", heisst: "Mühelos ans Ziel kommen, ohne sich anzustrengen." },
  { id: "smoer", sv: "Inte för allt smör i Småland!", laut: "INte för allt SMÖHR ih SMOHland", wort: "Nicht für alle Butter in Småland.", heisst: "Um nichts in der Welt." },
  { id: "hund", sv: "Där ligger en hund begraven.", laut: "dähr LIGGer en HÖND beGRAHwen", wort: "Da liegt ein Hund begraben.", heisst: "Da stimmt was nicht – das ist verdächtig." },
  { id: "cykla", sv: "Du är ute och cyklar!", laut: "düh äh ÜHte o SÜCKlar", wort: "Du bist draußen und fährst Fahrrad.", heisst: "Du liegst völlig daneben." },
  { id: "ugglor", sv: "Jag anar ugglor i mossen.", laut: "jah AHnar ÖGGlur ih MOSSen", wort: "Ich ahne Eulen im Moor.", heisst: "Da ist doch was im Busch." },
  { id: "lagom", sv: "Lagom är bäst.", laut: "LAHgom äh BEST", wort: "Gerade richtig ist am besten.", heisst: "Nicht zu viel, nicht zu wenig." }
];
function redeS() { const r = S.rede && typeof S.rede === "object" && !Array.isArray(S.rede) ? S.rede : {}; const o = x => x && typeof x === "object" && !Array.isArray(x) ? x : {}; S.rede = { gesendet: o(r.gesendet), gemerkt: o(r.gemerkt) }; return S.rede; }
function redeText(r) {
  return `Hej Max! Schwedisch-Stunde bei ${S.name || "Rita"}:\n„${r.sv}“\nSo klingt’s: ${r.laut} (GROSS = betont)\nWörtlich: ${r.wort}\nGemeint: ${r.heisst}\nBeim nächsten Telefonat frag ich ab!`;
}
/* im Ideen-Blatt (views.js ideeSheet): nur bei Ideen mit "rede": true */
function redeBlock(v) {
  if (!v || !v.rede) return "";
  const R = redeS();
  return `<div class="rede-wrap"><div class="rede-liste">${REDENSARTEN.map(r => `<div class="bogen rede-karte"><p class="rede-sv" lang="sv">${esc(r.sv)}</p>
    <p class="rede-laut"><span class="rede-ohr" aria-hidden="true">${ic("sprechen")}</span><span><span class="klein">So klingt’s:</span> ${redeLaut(r.laut)}</span></p>
    <p class="klein rede-de">Wörtlich: ${esc(r.wort)}<br><b>Gemeint:</b> ${esc(r.heisst)}</p>
    <div class="zeile rede-knoepfe"><button class="knopf klein zweit" data-act="rede-max" data-id="${r.id}">${ic("plaudern")} Bring’s Max bei</button>${R.gesendet[r.id] ? `<span class="klein rede-ok">${ic("haken")} Max hat sie schon</span>` : ""}</div></div>`).join("")}</div>
    <p class="klein rede-hinweis">Großbuchstaben = betonen. Ein „s“ ist im Schwedischen immer scharf wie in „Bus“.</p></div>`;
}
function redeLaut(l) { return esc(l).replace(/([A-ZÄÖÜ]{2,})/g, `<b>$1</b>`); }
function redeSheet(id) {
  const r = REDENSARTEN.find(x => x.id === id); if (!r) return;
  const R = redeS();
  sheet({ titel: "Bring’s Max bei", id: "rede", inhalt: `<div class="zeile" style="gap:12px;align-items:flex-start;margin-bottom:12px"><div class="fig-idle">${maxSVG(56)}</div><p class="sprechblase" style="margin:0;flex:1"><span class="wer">Max</span><br>Mein Schwedisch ist ungefähr auf Hühnchen-Niveau. Bring mir was bei!</p></div>
    <div class="bogen rede-karte"><p class="rede-sv" lang="sv">${esc(r.sv)}</p><p class="rede-laut"><span class="rede-ohr" aria-hidden="true">${ic("sprechen")}</span><span><span class="klein">So klingt’s:</span> ${redeLaut(r.laut)}</span></p><p class="klein rede-de">Gemeint: ${esc(r.heisst)}</p></div>
    <h3 style="margin:16px 0 6px">Am schönsten: vorsprechen</h3>
    <p style="margin:0">Sprich Max die Redensart als <b>Sprachnachricht</b> vor – in WhatsApp das Mikrofon unten rechts gedrückt halten, sprechen, loslassen. Oder heb sie dir fürs <b>nächste Telefonat</b> auf und frag ihn ab.</p>
    <p class="klein" style="margin:10px 0 0">Mit „Per WhatsApp“ geht die Redensart samt Aussprache und Bedeutung als Text an Max. Dort nur noch auf „Senden“ tippen.</p>`,
    fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="rede-senden" data-id="${r.id}">${ic("brief")} Per WhatsApp an Max</button>${R.gemerkt[r.id] ? `<p class="klein" style="margin:0;text-align:center">${ic("haken")} Steht auf ${A("deiner", "Ihrer")} Liste fürs nächste Telefonat.</p>` : `<button class="knopf zweit voll" data-act="rede-merken" data-id="${r.id}">${ic("telefon")} Fürs nächste Telefonat merken</button>`}</div>` });
}
function redeSenden(id) {
  const r = REDENSARTEN.find(x => x.id === id); if (!r) return;
  redeS().gesendet[id] = heute(); speichern();
  try { window.open(`https://wa.me/${MAX_WA}?text=${encodeURIComponent(redeText(r))}`, "_blank"); } catch (e) { }
  sheetZu(); toast("Bra jobbat! Max lernt jetzt Schwedisch.", { erfolg: true });
  setTimeout(redeAuffrischen, 320);
}
function redeAuffrischen() {
  const w = $(".rede-wrap"), v = (D.stattDaddeln || []).find(x => x.rede); if (w && v) w.outerHTML = redeBlock(v);
}
function redeMerken(id) {
  const r = REDENSARTEN.find(x => x.id === id); if (!r) return;
  const text = `Max am Telefon beibringen: „${r.sv.replace(/[.!]$/, "")}“`.slice(0, 120);
  S.liste = Array.isArray(S.liste) ? S.liste : [];
  if (!S.liste.some(y => !y.erledigt && y.text === text)) S.liste.push({ id: "l" + Date.now().toString(36), text });
  redeS().gemerkt[id] = heute(); speichern(); haptik("erfolg");
  sheetZu(); render({ halteScroll: true, ohneAnim: true });
  setTimeout(redeAuffrischen, 320);
  toast(`Steht auf ${A("deiner", "Ihrer")} Liste. Beim nächsten Telefonat: Max abfragen!`, { erfolg: true });
}
document.addEventListener("click", ev => {
  const el = ev.target.closest && ev.target.closest("[data-act^='rede-']"); if (!el || el.disabled) return;
  try {
    const a = el.dataset.act, id = el.dataset.id;
    if (a === "rede-max") redeSheet(id);
    else if (a === "rede-senden") redeSenden(id);
    else if (a === "rede-merken") redeMerken(id);
  } catch (e) { console.warn(e); }
});
