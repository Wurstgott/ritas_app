/* ============================================================
   Waldpatience – Klondike, 1 Karte ziehen, Tippen statt Ziehen.
   Nichts wird automatisch abgelegt; bei mehreren Zielen wählt Rita.
   Farben: Blüte & Laub (rot), Eichel & Kiefer (dunkel)
   Keine Punkte, keine Zeitwertung, unbegrenztes Rückgängig.
   ============================================================ */
const FARBEN = [
  { n: "Blüte", rot: true, p: "M12 3.2c1.5 0 2.5 1.5 2.2 3.1 1.4-.8 3.2-.2 3.7 1.3.5 1.5-.6 2.9-2 3.3 1.3.9 1.6 2.7.5 3.9s-2.9 1-3.8-.2c-.2 1.5-1.5 2.6-3 2.3-1.5-.4-2.2-2-1.5-3.4-1.5.4-2.9-.5-3.1-2-.2-1.6 1.1-2.7 2.6-2.6-.7-1.4-.1-3.2 1.4-3.6.9-.3 1.8 0 2.4.6.1-1.5.9-2.2.6-2.7ZM12 9.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" },
  { n: "Eichel", rot: false, p: ANDENKEN_SVG.eichel },
  { n: "Laub", rot: true, p: "M12 2.5 14 7l3.6-1.6-.8 4 4.2.6-3 3 2.4 3.4-4.3.2.4 4.3-4.5-3.2-4.5 3.2.4-4.3-4.3-.2L6.2 13l-3-3 4.2-.6-.8-4L10 7l2-4.5Zm-.8 13.5h1.6v5.5h-1.6V16Z" },
  { n: "Kiefer", rot: false, p: "M12 2 17 9h-2.6l4.1 5.5h-3l4 5.5H4.5l4-5.5h-3L9.6 9H7l5-7Zm-1 18h2v2.5h-2V20Z" }
];
const WERT = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "B", "D", "K"];
let G = null, gewaehlt = null, spielIv = 0, nachspiel = 0;

function neuesSpiel(seed) {
  const r = mulberry32(seed >>> 0), deck = [];
  for (let s = 0; s < 4; s++) for (let w = 1; w <= 13; w++) deck.push({ s, w, up: false });
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  const tab = Array.from({ length: 7 }, () => []);
  for (let c = 0; c < 7; c++) for (let k = 0; k <= c; k++) { const kt = deck.pop(); kt.up = k === c; tab[c].push(kt); }
  return { seed, stock: deck, waste: [], found: [[], [], [], []], tab, hist: [], fertig: false };
}
const istRot = k => FARBEN[k.s].rot;
const oben = a => a[a.length - 1];
function passtAblage(k) { const f = G.found[k.s]; return f.length ? oben(f).w === k.w - 1 : k.w === 1; }
function passtSaeule(k, col) { const c = G.tab[col]; if (!c.length) return k.w === 13; const o = oben(c); return o.up && istRot(o) !== istRot(k) && o.w === k.w + 1; }
function merke() { G.hist.push(JSON.stringify({ stock: G.stock, waste: G.waste, found: G.found, tab: G.tab })); if (G.hist.length > 300) G.hist.shift(); }
function umdrehen() { for (const c of G.tab) if (c.length && !oben(c).up) oben(c).up = true; }

/* Nichts wird von allein abgelegt (Max: „Karten strategisch zwischennutzen“).
   Quelle: "waste" | Säule 0–6 | "ablage" (idx = Farbe; Karte zurück ins Spiel).
   ziele() nennt alle erlaubten Plätze; das Spiel wählt nie selbst zwischen mehreren. */
function kartenVon(quelle, idx) {
  if (quelle === "waste") return G.waste.length ? [oben(G.waste)] : [];
  if (quelle === "ablage") { const f = G.found[idx]; return f && f.length ? [oben(f)] : []; }
  return G.tab[quelle] ? G.tab[quelle].slice(idx) : [];
}
function ziele(quelle, idx) {
  const karten = kartenVon(quelle, idx);
  if (!karten.length || !karten[0].up) return [];
  const z = [];
  if (quelle !== "ablage" && karten.length === 1 && passtAblage(karten[0])) z.push("found");
  for (let c = 0; c < 7; c++) {
    if (c === quelle || !passtSaeule(karten[0], c)) continue;
    // einen König nicht sinnlos von einer leeren Säule auf eine andere leere schieben
    if (!G.tab[c].length && typeof quelle === "number" && idx === 0) continue;
    z.push(c);
  }
  return z;
}
/* Für „passt nur an einen Platz?“: mehrere leere Säulen sind gleichwertig und zählen einmal */
function zieleVerschieden(quelle, idx) { let leer = false; return ziele(quelle, idx).filter(z => z === "found" || G.tab[z].length || (leer ? false : (leer = true))); }
/* Doppeltipp-Schutz: Ein zweiter, zu schneller Tipp nach einem Zug träfe die Karte, die gerade frei wurde,
   und würde sie ungewollt weiterschicken. Solche Tipps (unter DOPPEL_MS) werden überhört. */
let zugZeit = 0, DOPPEL_MS = 350;
function zieh(quelle, idx, ziel) {
  merke(); zugZeit = performance.now();
  let karten = quelle === "waste" ? [G.waste.pop()] : quelle === "ablage" ? [G.found[idx].pop()] : G.tab[quelle].splice(idx);
  if (ziel === "found") G.found[karten[0].s].push(karten[0]);
  else G.tab[ziel].push(...karten);
  umdrehen();
  haptik("auswahl");
  pruefeFertig();
}
function stapelTipp() {
  merke();
  if (G.stock.length) { const k = G.stock.pop(); k.up = true; G.waste.push(k); }
  else if (G.waste.length) { G.stock = G.waste.reverse().map(k => ({ ...k, up: false })); G.waste = []; }
  else G.hist.pop();
  haptik("auswahl");
}
const alleAbgelegt = () => G.found.every(f => f.length === 13);
function pruefeFertig() {
  if (G.fertig || !alleAbgelegt()) return;
  G.fertig = true; gewaehlt = null; haptik("erfolg");
  const g0 = G;
  // Wurde in der kurzen Pause noch „Zurück“ gedrückt, ist die Runde nicht vorbei
  setTimeout(() => { if (G !== g0) return; if (alleAbgelegt()) spielEnde(); else { G.fertig = false; spielRender(); } }, 700);
}
/* Alles offen, Stapel leer: Jede Säule ist eine absteigende Folge, die kleinste Karte liegt also
   immer oben und passt aufs Ass – die Runde ist sicher gewonnen. Erst dann wird „Rest ablegen?“ angeboten. */
function alleOffen() { return !G.stock.length && !G.waste.length && G.tab.every(c => c.every(k => k.up)); }
let autoLauf = false;
function automatischLegen() {
  if (!G || G.fertig || autoLauf || !alleOffen() || alleAbgelegt()) return;
  gewaehlt = null; merke();
  const g0 = G, h0 = G.hist.length; autoLauf = true;
  const schritt = () => {
    // abbrechen, wenn zwischendurch „Zurück“, „Neu geben“ oder das Blatt geschlossen wurde
    if (G !== g0 || G.hist.length !== h0 || !$("#spiel")) { autoLauf = false; spielRender(); return; }
    let best = -1;
    for (let c = 0; c < 7; c++) { const col = G.tab[c]; if (col.length && passtAblage(oben(col)) && (best < 0 || oben(col).w < oben(G.tab[best]).w)) best = c; }
    if (best >= 0) { const k = G.tab[best].pop(); G.found[k.s].push(k); }
    if (best >= 0 && !alleAbgelegt()) { spielRender(); setTimeout(schritt, REDUCED() ? 0 : 120); }
    else { autoLauf = false; spielRender(); pruefeFertig(); }
  };
  schritt();
}
function tippHinweis() {
  // 1) Säulen-Zug, der eine Karte aufdeckt, 2) etwas aufs Ass, 3) Waste in Säule, 4) Stapel
  for (let c = 0; c < 7; c++) { const col = G.tab[c]; const i = col.findIndex(k => k.up); if (i > 0 && ziele(c, i).some(z => z !== "found")) return { q: c, i }; }
  for (let c = 0; c < 7; c++) { const col = G.tab[c]; if (col.length && oben(col).up && passtAblage(oben(col))) return { q: c, i: col.length - 1 }; }
  if (G.waste.length && passtAblage(oben(G.waste))) return { q: "waste" };
  if (G.waste.length && ziele("waste").length) return { q: "waste" };
  if (G.stock.length || G.waste.length) return { q: "stock" };
  return null;
}

/* ---------- Marken & Zeit ---------- */
function spielTagPruefen() {
  const h = heute(), sp = S.spiel;
  if (sp.tag !== h) {
    sp.tag = h; sp.genutzt = 0; sp.geschenkt = 0; sp.gratisGegeben = false;
    if (sp.limitNeu != null) { sp.limit = sp.limitNeu; sp.limitNeu = null; }
  }
  const tf = S.tf[h];
  if ((tf === "C" || tf === "D") && !sp.gratisGegeben) { sp.geschenkt = 2; sp.gratisGegeben = true; }
  speichern();
}
function spielInfoText() {
  spielTagPruefen(); const sp = S.spiel;
  if (sp.frei) return "Ohne Zeitgrenze";
  if (sp.restSek > 0) return `Noch ${Math.ceil(sp.restSek / 60)} Min. in dieser Runde`;
  const frei = sp.geschenkt + sp.marken;
  return `${sp.genutzt} von ${sp.limit} Runden heute${frei ? ` · noch ${frei} frei` : ""}`;
}
function spielStarten() {
  spielTagPruefen(); const sp = S.spiel;
  const tfH = S.tf[heute()];
  // Nachspielzeit läuft noch (Fenster zwischendurch geschlossen): Runde ohne neue Marke fertig legen
  if (sp.laufend && !sp.laufend.fertig && (sp.nachspiel || 0) > 0 && sp.restSek <= 0) return spielOeffnen();
  if (sp.frei || sp.restSek > 0 || tfH === "C" || tfH === "D") { if (!sp.frei && sp.restSek <= 0) sp.restSek = 600; return spielOeffnen(); }
  if (sp.genutzt >= sp.limit) {
    sheet({ titel: "Waldpatience", inhalt: `<p>Für heute sind alle Runden gespielt.</p><p class="klein">In den Einstellungen ${A("kannst du", "können Sie")} mehr erlauben. An Tagen mit „Ruhig angehen“ oder „Sparflamme“ ist das Spiel ohnehin frei.</p>`, fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="hilft">Andere Ablenkung</button><button class="knopf zweit voll" data-act="go" data-go="einstellungen">Einstellungen</button></div>` });
    return;
  }
  const t = talerStand();
  const html = `<p>Eine Runde Patience dauert <span style="font-weight:700">10 Minuten</span>. Ist die Zeit um, ${A("darfst du", "dürfen Sie")} die Karten noch in Ruhe fertig legen.</p>
    <div class="bogen mulde"><p style="margin:0">Heute schon gespielt: ${sp.genutzt}-mal von ${sp.limit}.${sp.geschenkt ? ` ${sp.geschenkt === 1 ? "Eine Runde ist" : sp.geschenkt + " Runden sind"} heute geschenkt.` : ""}${sp.marken ? ` ${sp.marken === 1 ? "Eine bezahlte Runde liegt" : sp.marken + " bezahlte Runden liegen"} bereit.` : ""}</p></div>`;
  const knopf = sp.geschenkt || sp.marken ? `<button class="knopf haupt voll" data-act="marke-nutzen">${ic("karten")} Jetzt spielen</button>`
    : `<button class="knopf haupt voll" data-act="marke-kaufen" ${t >= 10 ? "" : "disabled"}>${ic("karten")} ${t >= 10 ? "Für 10 Taler spielen" : `Noch ${10 - t} Taler sammeln`}</button><p class="klein">Eine Runde kostet 10 Taler (du hast ${t}). Taler gibt’s für alles, was du einträgst – zum Beispiel einen Spaziergang oder ein Kapitel.</p>`;
  sheet({ titel: "Waldpatience", inhalt: html, fuss: knopf });
}
function markeEinloesen(kaufen) {
  const sp = S.spiel;
  if (kaufen) { if (talerStand() < 10) return; S.taler -= 10; S.talerAusgegeben += 10; }
  else if (sp.geschenkt) sp.geschenkt--; else if (sp.marken) sp.marken--; else return;
  sp.genutzt++; sp.restSek = 600; speichern();
  sheetZu(); setTimeout(spielOeffnen, 260);
}
function spielOeffnen() {
  if (!S.spiel.laufend || S.spiel.laufend.fertig) G = neuesSpiel(hash32(S.seed + ":" + Date.now()));
  else { G = S.spiel.laufend; G.hist = G.hist || []; }
  gewaehlt = null; nachspiel = S.spiel.laufend && S.spiel.restSek <= 0 ? (S.spiel.nachspiel || 0) : 0;
  sheet({ titel: "Waldpatience", inhalt: `<div id="spiel"></div>`, voll: true, id: "spiel", onclose: spielPausieren });
  spielRender();
  clearInterval(spielIv);
  spielIv = setInterval(spielUhr, 1000);
}
function spielPausieren() { clearInterval(spielIv); if (G) { S.spiel.laufend = G.fertig ? null : { ...G, hist: G.hist.slice(-40) }; S.spiel.nachspiel = G.fertig ? 0 : nachspiel; speichern(); } }
function spielUhr() {
  if (document.hidden || S.spiel.frei) return;
  const sp = S.spiel;
  if (sp.restSek > 0) { sp.restSek--; if (sp.restSek % 15 === 0) speichern(); if (sp.restSek === 0) { nachspiel = 300; spielRender(); } }
  else if (nachspiel > 0) { nachspiel--; S.spiel.nachspiel = nachspiel; if (nachspiel % 15 === 0) speichern(); if (nachspiel === 0) { spielPausieren(); spielEnde(true); } }
}
function spielEnde(zeitUm) {
  clearInterval(spielIv);
  if (G && G.fertig) S.spiel.laufend = null;
  speichern();
  const tf = S.tf[heute()] || "C";
  const v = vorschlaege(tf, 3, "nachspiel" + Date.now());
  const html = `<div class="buehne klein" style="margin-bottom:14px"><canvas id="bild-spielende"></canvas></div>
    <p>${G && G.fertig ? "Gelegt. Alle Karten liegen auf ihren Plätzen." : zeitUm ? "Die Karten bleiben liegen, bis du wiederkommst." : "Die Runde ist gemerkt."}</p>
    <h3>Und jetzt vielleicht</h3><div class="liste">${v.map(x => zeileBtn(katIcon(x.kat), x.titel, x.text, `data-act="idee" data-id="${x.id}"`, "k-geist")).join("")}</div>
    ${S.spiel.frei || S.spiel.restSek > 0 ? `<button class="knopf leise" data-act="spiel-nochmal">Noch eine Runde</button>` : S.spiel.genutzt < S.spiel.limit ? `<button class="knopf leise" data-act="spiel">Noch eine Runde</button><p class="klein">Heute ${S.spiel.genutzt} von ${S.spiel.limit} Runden.</p>` : ""}`;
  if (aktuellesSheet()?.dataset.id === "spiel") sheetZu();
  setTimeout(() => { sheet({ titel: "Waldpatience", inhalt: html, id: "spielende" }); const c = $("#bild-spielende"); if (c) zeichneSzene(c, {}); }, 260);
}

/* ---------- Darstellung ---------- */
function karteHTML(k, attrs, top, extra = "", tag = "button") {
  if (!k.up) return `<div class="karte zu${typeof rueckenKlasse === "function" ? rueckenKlasse() : ""}" style="top:${top}px" aria-hidden="true"></div>`;
  const F = FARBEN[k.s];
  return `<${tag} class="karte ${F.rot ? "rot" : ""} f${k.s}${extra}" style="top:${top}px" ${attrs} aria-label="${WERT[k.w]} ${F.n}"><span class="w">${WERT[k.w]}</span><svg class="f" viewBox="0 0 24 24"><path fill="currentColor" d="${F.p}"/></svg><svg class="gross" viewBox="0 0 24 24"><path fill="currentColor" d="${F.p}"/></svg></${tag}>`;
}
function spielRender() {
  const el = $("#spiel"); if (!el || !G) return;
  if (gewaehlt && !kartenVon(gewaehlt.q, gewaehlt.i).length) gewaehlt = null;
  const kb = Math.floor((Math.min(innerWidth, 560) - 28 - 6 * 4) / 7), kh = Math.round(kb * 1.42);
  const vZu = Math.round(kb * .24), vAuf = Math.round(kb * .56);
  // Gewählte Karte(n) heben sich, alle erlaubten Plätze leuchten
  const zl = gewaehlt ? ziele(gewaehlt.q, gewaehlt.i) : [];
  const istSel = (q, i) => gewaehlt && gewaehlt.q === q && (q === "waste" || i >= gewaehlt.i && (q !== "ablage" || i === gewaehlt.i));
  let h = `<div class="tisch${gewaehlt ? " waehlt" : ""}" style="--kb:${kb}px"><div class="reihe" style="gap:4px">`;
  // Stapel + Ablage (Waste)
  h += `<button class="platz" data-act="g-stapel" aria-label="${G.stock.length ? "Karte ziehen" : "Stapel neu auflegen"}" style="border:0;cursor:pointer;padding:0">${G.stock.length ? `<div class="karte zu${typeof rueckenKlasse === "function" ? rueckenKlasse() : ""}" style="top:0"></div>` : `<svg viewBox="0 0 24 24" style="width:60%;height:60%;color:var(--tinte-2)" aria-hidden="true"><path fill="currentColor" d="M12 5V2L7 6.5 12 11V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-8Z"/></svg>`}</button>`;
  h += `<div class="platz" style="background:transparent;box-shadow:none">${G.waste.length ? karteHTML(oben(G.waste), `data-act="g-karte" data-q="waste"`, 0, istSel("waste") ? " gewaehlt" : "") : ""}</div><div></div>`;
  // Ass-Stapel: antippbar – als Ziel für eine gewählte Karte, oder um die oberste Karte zurück ins Spiel zu holen
  for (let f = 0; f < 4; f++) {
    const a = G.found[f], ziel = zl.includes("found") && gewaehlt && kartenVon(gewaehlt.q, gewaehlt.i)[0].s === f;
    const lab = `Ass-Stapel ${FARBEN[f].n}: ${a.length ? `bis ${WERT[a.length]}` : "leer"}${ziel ? " – hierher legen" : ""}`;
    h += `<button class="platz ablage${ziel ? " ziel" : ""}" data-act="g-karte" data-q="ablage" data-i="${f}" aria-label="${lab}">${a.length ? karteHTML(oben(a), `aria-hidden="true"`, 0, istSel("ablage", f) ? " gewaehlt" : "", "div") : `<svg viewBox="0 0 24 24" style="position:absolute;inset:22%;color:var(--mulde-2)" aria-hidden="true"><path fill="currentColor" d="${FARBEN[f].p}"/></svg>`}</button>`;
  }
  h += `</div><div class="reihe" style="gap:4px;margin-top:12px">`;
  for (let c = 0; c < 7; c++) {
    const col = G.tab[c], ziel = zl.includes(c); let top = 0, inner = "";
    col.forEach((k, i) => { inner += karteHTML(k, `data-act="g-karte" data-q="${c}" data-i="${i}"`, top, (istSel(c, i) ? " gewaehlt" : "") + (ziel && i === col.length - 1 ? " ziel" : "")); top += k.up ? vAuf : vZu; });
    const hoehe = Math.max(kh, top - (col.length ? (oben(col).up ? vAuf : vZu) : 0) + kh);
    h += `<div class="saeule" style="height:${hoehe}px">${col.length ? "" : `<button class="platz${ziel ? " ziel" : ""}" data-act="g-leer" data-q="${c}" aria-label="Leere Säule${ziel ? " – hierher legen" : ""}" style="border:0;cursor:pointer"></button>`}${inner}</div>`;
  }
  h += `</div></div>`;
  const sp = S.spiel;
  const zeit = sp.frei ? "" : sp.restSek > 0 ? `Noch ${Math.ceil(sp.restSek / 60)} Min.` : "";
  const status = G.fertig ? "Geschafft – alle Karten liegen auf den Ass-Stapeln."
    : gewaehlt ? `${gewaehlt.q === "ablage" ? "Zurück ins Spiel?" : "Wohin damit?"} ${A("Tippe", "Tippen Sie")} auf einen leuchtenden Platz. Noch einmal auf die Karte tippen: abbrechen.` : "";
  h += `<p class="spiel-status" role="status" aria-live="polite">${status}</p>`;
  h += `${!sp.frei && sp.restSek === 0 && !G.fertig ? `<div class="bogen mulde" role="status" style="margin-top:12px"><p style="margin:0">${A("Deine", "Ihre")} Zeit ist um. ${A("Leg", "Legen Sie")} diese Runde in Ruhe zu Ende.</p></div>` : ""}
    ${alleOffen() && !G.fertig && !autoLauf ? `<div class="bogen mulde spiel-angebot" style="margin-top:12px"><p style="margin:0 0 10px">Alle Karten liegen offen – die Runde ist gewonnen. Rest automatisch ablegen?</p><button class="knopf haupt voll" data-act="g-auto">Ja, Rest ablegen</button><p class="klein" style="margin:8px 0 0">Oder ${A("leg", "legen Sie")} die Karten selbst weiter.</p></div>` : ""}
    <div class="spiel-leiste">
      <button class="knopf klein zweit" data-act="g-zurueck" ${G.hist.length && !G.fertig ? "" : "disabled"}>Zurück</button>
      <button class="knopf klein zweit" data-act="g-tipp" ${G.fertig ? "disabled" : ""}>Tipp</button>
      <button class="knopf klein leise" data-act="g-neu">Neu geben</button>
    </div><p class="klein">${zeit ? zeit + " · " : ""}Karte antippen: Passt sie an genau einen Platz, wandert sie dorthin. Passt sie an mehrere, hebt sie sich, und die möglichen Plätze leuchten – dann den Platz antippen. Von allein wird nichts abgelegt.</p>
    <details class="spiel-regeln"><summary>Spielregeln</summary>
      <p>Ziel: alle Karten nach Farben geordnet auf die vier Ass-Stapel oben rechts legen – vom Ass bis zum König.</p>
      <p>In den sieben Säulen legt man absteigend und immer abwechselnd rot und dunkel: zum Beispiel eine rote 7 auf eine dunkle 8. Rot sind Blüte und Laub, dunkel sind Eichel und Kiefer. Auf eine leere Säule passt nur ein König.</p>
      <p>Tippt man eine offene Karte mitten in einer Säule an, wandern die Karten, die auf ihr liegen, mit. Wird eine verdeckte Karte frei, dreht sie sich um – und bleibt liegen, bis man sie selbst bewegt.</p>
      <p>Von allein kommt keine Karte auf einen Ass-Stapel. Passt eine angetippte Karte an mehrere Plätze, etwa auf eine Säule und aufs Ass, hebt sie sich, und die möglichen Plätze leuchten. Dann den gewünschten Platz antippen. So kann man eine Karte auch bewusst noch in den Säulen behalten.</p>
      <p>Der Stapel oben links deckt bei jedem Antippen eine Karte auf. Ist er leer, ihn noch einmal antippen: Die Karten kommen zurück, so oft man will.</p>
      <p>Eine Karte auf einem Ass-Stapel darf wieder zurück ins Spiel: antippen, dann den leuchtenden Platz.</p>
      <p>„Zurück“ nimmt Züge zurück. „Tipp“ zeigt einen möglichen Zug. Sind Stapel und gezogene Karten aufgebraucht und liegen alle Karten offen, bietet das Spiel an, den Rest abzulegen.</p>
    </details>
    <button class="knopf zweit voll" data-act="g-aufhoeren">Für jetzt aufhören</button>`;
  // Regeln aufgeklappt lassen, wenn sie offen waren
  const offen = el.querySelector(".spiel-regeln")?.open;
  el.innerHTML = h;
  if (offen) el.querySelector(".spiel-regeln").open = true;
  armHaptics();
}
function spielKarteTipp(q, i) {
  if (!G || G.fertig || autoLauf || performance.now() - zugZeit < DOPPEL_MS) return;
  const quelle = q === "waste" || q === "ablage" ? q : Number(q), idx = Number(i) || 0;
  if (gewaehlt) {
    const gq = gewaehlt.q, gi = gewaehlt.i;
    // dieselbe Karte (oder dieselbe Säule) noch einmal → abbrechen
    if (gq === quelle && (quelle !== "ablage" || gi === idx)) { gewaehlt = null; spielRender(); return; }
    const karten = kartenVon(gq, gi);
    const ok = !karten.length ? false
      : quelle === "ablage" ? gq !== "ablage" && karten.length === 1 && karten[0].s === idx && passtAblage(karten[0])
      : quelle === "waste" ? false
      : passtSaeule(karten[0], quelle) && !(G.tab[quelle].length === 0 && typeof gq === "number" && gi === 0);
    gewaehlt = null;
    if (ok) { zieh(gq, gi, quelle === "ablage" ? "found" : quelle); spielRender(); return; }
    haptik("achtung"); toast("Dort passt sie nicht hin. Die Karte bleibt, wo sie war."); spielRender(); return;
  }
  if (quelle === "ablage" && !G.found[idx].length) return;   // leerer Ass-Stapel ohne gewählte Karte: nichts tun
  const k = kartenVon(quelle, idx)[0];
  if (!k || !k.up) return;
  const z = zieleVerschieden(quelle, idx);
  if (!z.length) { haptik("achtung"); toast("Diese Karte passt gerade nirgends hin."); spielRender(); return; }
  // Genau ein Platz: die Karte wandert dorthin. Mehrere Plätze – oder Karte vom Ass-Stapel: Rita wählt selbst.
  if (z.length === 1 && quelle !== "ablage") { zieh(quelle, idx, z[0]); spielRender(); return; }
  gewaehlt = { q: quelle, i: idx }; haptik("auswahl"); spielRender();
}
