/* ============================================================
   Rote Zahl an den Tabs (Max, 22.10. 14:06)
   - Zeigt, wie viel es auf einem anderen Tab Neues gibt: Funkeln im Bild (Zuhause),
     neuer Brief von Karin oder ein neues Aktenblatt (Ideen), Brief von Max oder neue Gönn-Karte (Heute).
   - Jede Neuigkeit hat einen festen Schlüssel. Wer den Tab ansieht, hat alle seine Schlüssel gesehen → Zahl weg.
   - Der Rückblick (tagebuch) bekommt NIE eine Zahl.
   - Die Tabs werden bei jedem render() neu gebaut: ein MutationObserver hängt die Zahl danach wieder an.
   Zustand: S.tabGesehen = { schluessel: tag }
   ============================================================ */
const TZ_QUELLEN = {
  heute: () => {
    const k = [];
    try { for (const f of [mbGbFaellig(), mbBriefFaellig()]) if (f && !f.gelesen) k.push(`mb:${f.art}:${f.tag}`); } catch (e) { }
    try { if (S.goenn && gkNeu()) k.push("gk:" + S.goenn.ausgestellt); } catch (e) { }
    return k;
  },
  ideen: () => {
    const k = [];
    try { if (bvHeuteNeu()) k.push("bv:" + bvLetzterPosttag(heute())); } catch (e) { }
    try {
      if (hpSiegelWartet()) { const a = hpZustand(), s = hpStatus(a.band); k.push(`hp:${a.band}:${s.sammelBereit ? "s" : ""}${s.bereit.map(b => b.id).join(",")}`); }
    } catch (e) { }
    return k;
  },
  lichtung: () => {
    try { const st = bildSpielStand(); return spieleAktiv().filter(s => !st.erledigt[s.id]).map(s => `sp:${heute()}:${s.id}`); } catch (e) { return []; }
  }
  // tagebuch (Rückblick): bewusst keine Quelle
};
function tzGesehen() { if (!S.tabGesehen || typeof S.tabGesehen !== "object" || Array.isArray(S.tabGesehen)) S.tabGesehen = {}; return S.tabGesehen; }
function tzNeu(tab) { const q = TZ_QUELLEN[tab]; if (!q) return []; const g = tzGesehen(); return q().filter(k => !g[k]); }
function tzAnsehen(tab) {
  const neu = tzNeu(tab); if (!neu.length) return;
  const g = tzGesehen(), h = heute(); neu.forEach(k => g[k] = h);
  const alt = tagPlus(h, -90); for (const k in g) if (!(g[k] >= alt)) delete g[k]; // nicht endlos wachsen
  speichern();
}
function tabZahlen() {
  const nav = document.getElementById("tabs"); if (!nav) return;
  if (!S.onboard || LADEFEHLER) { $$(".tab-zahl", nav).forEach(x => x.remove()); return; }
  if (TZ_QUELLEN[TAB]) tzAnsehen(TAB); // was gerade zu sehen ist, ist gesehen
  for (const b of $$("button[data-tab]", nav)) {
    const tab = b.dataset.tab, n = tab === TAB || tab === "tagebuch" ? 0 : tzNeu(tab).length;
    let z = b.querySelector(":scope > .tab-zahl");
    const name = (b.querySelector(":scope > span:not(.tab-zahl)") || {}).textContent || tab;
    if (!n) { if (z) z.remove(); b.removeAttribute("aria-label"); continue; }
    if (!z) { z = document.createElement("span"); z.className = "tab-zahl"; z.setAttribute("aria-hidden", "true"); b.appendChild(z); }
    const txt = n > 9 ? "9+" : String(n); if (z.textContent !== txt) z.textContent = txt;
    b.setAttribute("aria-label", `${name}, ${n === 1 ? "eine Neuigkeit" : n + " Neuigkeiten"}`);
  }
}
(function tzBeobachten() {
  let raf = 0;
  const plane = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { try { tabZahlen(); } catch (e) { } }); };
  const los = () => {
    const nav = document.getElementById("tabs"); if (!nav) return setTimeout(los, 200);
    new MutationObserver(plane).observe(nav, { childList: true }); // nur die Laschen selbst, nicht unsere Zahl
    plane();
    setInterval(() => { if (!document.hidden) plane(); }, 60e3); // abends kommen neue Spielereien ins Bild
    document.addEventListener("visibilitychange", () => { if (!document.hidden) plane(); });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los); else setTimeout(los, 0);
})();
