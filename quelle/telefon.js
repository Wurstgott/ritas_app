/* ============================================================
   Spaß-Telefon: mit Hühnchen, Max oder Jane plaudern.
   Gespräche aus D.anrufe; noch nicht geführte kommen zuerst.
   Bei Max endet jedes Gespräch im Tschüss-Duell.
   ============================================================ */
const TEL_WER = { huhn: "Hühnchen", max: "Max", jane: "Jane" };
let TEL = null;

function telBild(wer, gr) {
  if (wer === "huhn") return huhnSVG({ gr, kopf: true, stimmung: "spricht" });
  if (wer === "max") return maxSVG(gr);
  return janeSVG(gr);
}
function telAuswahlSheet() {
  const alle = D.anrufe || [], gef = S.anrufeGefuehrt || {};
  const zahl = w => alle.filter(a => a.wer === w).length, neu = w => alle.filter(a => a.wer === w && !gef[a.id]).length;
  sheet({ titel: "Kurz anrufen", id: "telefon", inhalt: `<p class="klein" style="margin-top:0">Nur zum Spaß – niemand wird wirklich angerufen.</p>
    <div class="tel-wahl">${["huhn", "max", "jane"].map(w => `<button class="tel-kontakt" data-act="tel-ruf" data-wer="${w}">${telBild(w, 64)}<span class="titel">${TEL_WER[w]}</span><span class="unter">${zahl(w) ? (neu(w) ? `${neu(w)} neue Gespräche` : "alles schon gehört – nochmal?") : "bald"}</span></button>`).join("")}</div>
    <p class="klein" style="margin-top:14px">${Object.keys(gef).length} von ${alle.length} Gesprächen entdeckt.</p>` });
}
function telStarten(wer) {
  const alle = (D.anrufe || []).filter(a => a.wer === wer); if (!alle.length) return;
  const gef = S.anrufeGefuehrt || {}; const neu = alle.filter(a => !gef[a.id]);
  const pool = neu.length ? neu : alle;
  const g = pool[Math.floor(Math.random() * pool.length)];
  TEL = { g, knoten: "start", verlauf: [], ende: false, duell: null };
  sheetZu(); setTimeout(() => { sheet({ titel: TEL_WER[wer], id: "tel-gespraech", inhalt: telKlingeln(), onclose: () => { TEL = null; } }); }, 240);
}
function telKlingeln() {
  return `<div class="tel-klingel">${telBild(TEL.g.wer, 110)}<p class="serif" style="font-size:1.2rem;margin:14px 0 4px">${TEL_WER[TEL.g.wer]} ist dran …</p><p class="klein" style="margin:0 0 16px">Ring, ring.</p><button class="knopf haupt" data-act="tel-ab">${ic("telefon")} Abnehmen</button></div>`;
}
function telAnsicht() {
  const T = TEL, k = T.g.knoten[T.knoten];
  const bubbles = T.verlauf.map(([w, t]) => `<div class="tel-zeile ${w}">${w === "fig" ? `<span class="tel-mini">${telBild(T.g.wer, 30)}</span>` : ""}<span class="tel-blase">${esc(t)}</span></div>`).join("");
  let unten = "";
  if (T.duell) unten = telDuellHTML();
  else if (T.ende) unten = `<p class="klein" style="text-align:center;margin:12px 0 4px">Aufgelegt.</p><div class="stapel"><button class="knopf zweit voll" data-act="tel-nochmal" data-wer="${T.g.wer}">Nochmal anrufen</button><button class="knopf leise" data-act="sheet-zu">Fertig</button></div>`;
  else if (k) unten = `<div class="tel-antworten">${k.antworten.map((a, i) => `<button class="knopf zweit voll" data-act="tel-antwort" data-i="${i}">${esc(a.text)}</button>`).join("")}</div>`;
  return `<div class="tel-kopf">${telBild(T.g.wer, 44)}<span><span style="font-weight:700">${TEL_WER[T.g.wer]}</span><br><span class="klein">im Gespräch</span></span></div><div class="tel-verlauf" id="tel-verlauf">${bubbles}</div>${unten}`;
}
function telZeige() { sheetInhalt(telAnsicht()); const v = $("#tel-verlauf"); const sc = aktuellesSheet()?.querySelector(".sheet-inhalt"); if (sc) sc.scrollTop = sc.scrollHeight; }
function telFigurSagt(text, dann) {
  // kleine Tipp-Pause, damit es nach Gespräch aussieht
  const v = $("#tel-verlauf"); if (v) v.insertAdjacentHTML("beforeend", `<div class="tel-zeile fig tippt"><span class="tel-mini">${telBild(TEL.g.wer, 30)}</span><span class="tel-blase">…</span></div>`);
  setTimeout(() => { if (!TEL) return; TEL.verlauf.push(["fig", text]); if (dann) dann(); telZeige(); haptik("auswahl"); }, REDUCED() ? 0 : 650);
}
function telEnde() {
  const T = TEL; S.anrufeGefuehrt = S.anrufeGefuehrt || {}; const neu = !S.anrufeGefuehrt[T.g.id]; S.anrufeGefuehrt[T.g.id] = heute(); speichern();
  if (T.g.schluss) telFigurSagt(T.g.schluss, () => { if (T.g.wer === "max") T.duell = { n: 0, grenze: 2 + Math.floor(Math.random() * 4) }; else T.ende = true; });
  else { if (T.g.wer === "max") T.duell = { n: 0, grenze: 2 + Math.floor(Math.random() * 4) }; else T.ende = true; telZeige(); }
  if (neu && Object.keys(S.anrufeGefuehrt).length % 10 === 0) setTimeout(() => toast(`${Object.keys(S.anrufeGefuehrt).length} Gespräche entdeckt. Es gibt noch mehr.`, { dauer: 4000 }), 1200);
}
function telDuellHTML() {
  const d = TEL.duell;
  if (d.fertig) return `<p class="klein" style="text-align:center;margin:12px 0 4px">${d.fertig === "rita" ? "Aufgelegt. Runde an dich!" : "Max hat aufgelegt."}</p><div class="stapel"><button class="knopf zweit voll" data-act="tel-nochmal" data-wer="max">Nochmal anrufen</button><button class="knopf leise" data-act="sheet-zu">Fertig</button></div>`;
  return `<div class="tel-antworten"><button class="knopf zweit voll" data-act="tel-tschuess">Tschüss!</button>${d.n >= 2 ? `<button class="knopf leise voll" data-act="tel-auflegen">Ich leg jetzt auf. Tschüss!</button>` : ""}</div>`;
}
function telAktion(a, d) {
  switch (a) {
    case "tel-auf": telAuswahlSheet(); return true;
    case "tel-ruf": case "tel-nochmal": telStarten(d.wer); return true;
    case "tel-ab": haptik("erfolg"); TEL.verlauf = []; TEL.knoten = "__warte"; telZeige(); telFigurSagt(TEL.g.knoten.start.sagt, () => { TEL.knoten = "start"; }); return true;
    case "tel-antwort": {
      const k = TEL.g.knoten[TEL.knoten], ant = k && k.antworten[Number(d.i)]; if (!ant) return true;
      TEL.verlauf.push(["rita", ant.text]); haptik("auswahl");
      if (ant.weiter && TEL.g.knoten[ant.weiter]) { TEL.knoten = ant.weiter; const n = TEL.g.knoten[ant.weiter]; TEL.knoten = "__warte"; telZeige(); telFigurSagt(n.sagt, () => { TEL.knoten = ant.weiter; }); }
      else { TEL.knoten = "__ende"; telZeige(); telEnde(); }
      return true; }
    case "tel-tschuess": { const du = TEL.duell; du.n++; TEL.verlauf.push(["rita", TSCHUESS[Math.floor(Math.random() * TSCHUESS.length)]]);
      if (du.n >= du.grenze || (du.n >= 2 && Math.random() < .2)) { telZeige(); telFigurSagt("Ich leg jetzt auf. Tschüss!", () => { du.fertig = "max"; }); }
      else { telZeige(); telFigurSagt(TSCHUESS[Math.floor(Math.random() * TSCHUESS.length)]); }
      return true; }
    case "tel-auflegen": TEL.verlauf.push(["rita", "Ich leg jetzt auf. Tschüss!"]); TEL.duell.fertig = "rita"; S.tschuessSiege = (S.tschuessSiege || 0) + 1; speichern(); haptik("erfolg"); telZeige(); return true;
  }
  return false;
}
