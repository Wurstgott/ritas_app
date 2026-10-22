/* ============================================================
   Waldpatience – Klondike, 1 Karte ziehen, Tippen statt Ziehen
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

/* Ziel für Karte/Stapel finden: erst Ablage, dann Säule (nicht leer bevorzugt) */
function besterZug(quelle, idx) {
  let karten;
  if (quelle === "waste") karten = G.waste.length ? [oben(G.waste)] : [];
  else karten = G.tab[quelle].slice(idx);
  if (!karten.length || !karten[0].up) return null;
  if (karten.length === 1 && passtAblage(karten[0])) return { ziel: "found" };
  const kandid = [];
  for (let c = 0; c < 7; c++) if (c !== quelle && passtSaeule(karten[0], c)) kandid.push(c);
  // Einen König nicht sinnlos von einer leeren Säule auf eine andere leere schieben
  const sinnvoll = kandid.filter(c => !(G.tab[c].length === 0 && quelle !== "waste" && idx === 0));
  const voll = sinnvoll.filter(c => G.tab[c].length);
  const c = voll[0] ?? sinnvoll[0];
  return c == null ? null : { ziel: c };
}
function zieh(quelle, idx, ziel) {
  merke();
  let karten = quelle === "waste" ? [G.waste.pop()] : G.tab[quelle].splice(idx);
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
function pruefeFertig() { if (G.found.every(f => f.length === 13)) { G.fertig = true; haptik("erfolg"); setTimeout(spielEnde, 700); } }
function alleOffen() { return !G.stock.length && !G.waste.length && G.tab.every(c => c.every(k => k.up)); }
function automatischLegen() {
  let geschafft = true;
  const schritt = () => {
    geschafft = false;
    for (let c = 0; c < 7; c++) { const col = G.tab[c]; if (col.length && passtAblage(oben(col))) { G.found[oben(col).s].push(col.pop()); geschafft = true; break; } }
    spielRender();
    if (geschafft && !G.fertig) setTimeout(schritt, REDUCED() ? 0 : 120); else pruefeFertig();
  };
  merke(); schritt();
}
function tippHinweis() {
  // 1) etwas auf die Ablage, 2) Säulen-Zug, der eine Karte aufdeckt, 3) Waste in Säule, 4) Stapel
  for (let c = 0; c < 7; c++) { const col = G.tab[c]; if (col.length && oben(col).up && passtAblage(oben(col))) return { q: c, i: col.length - 1 }; }
  if (G.waste.length && passtAblage(oben(G.waste))) return { q: "waste" };
  for (let c = 0; c < 7; c++) { const col = G.tab[c]; const i = col.findIndex(k => k.up); if (i > 0) { const z = besterZug(c, i); if (z && z.ziel !== "found") return { q: c, i }; } }
  if (G.waste.length && besterZug("waste")) return { q: "waste" };
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
  if (sp.frei) return "Ohne Spielmarken";
  if (sp.restSek > 0) return `Noch ${Math.ceil(sp.restSek / 60)} Min. in der laufenden Marke`;
  const frei = sp.geschenkt + sp.marken;
  return `${sp.genutzt} von ${sp.limit} Marken heute${frei ? ` · ${frei} bereit` : ""}`;
}
function spielStarten() {
  spielTagPruefen(); const sp = S.spiel;
  const tfH = S.tf[heute()];
  if (sp.frei || sp.restSek > 0 || tfH === "C" || tfH === "D") { if (!sp.frei && sp.restSek <= 0) sp.restSek = 600; return spielOeffnen(); }
  if (sp.genutzt >= sp.limit) {
    sheet({ titel: "Waldpatience", inhalt: `<p>Die Spielmarken für heute sind aufgebraucht.</p><p class="klein">In den Einstellungen ${A("kannst du", "können Sie")} mehr erlauben. An leisen Tagen und Durchhalte-Tagen ist das Spiel ohnehin frei.</p>`, fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="hilft">Andere Ablenkung</button><button class="knopf zweit voll" data-act="go" data-go="einstellungen">Einstellungen</button></div>` });
    return;
  }
  const t = talerStand();
  const html = `<p>Eine Runde Patience dauert <span style="font-weight:700">10 Minuten</span>. Ist die Zeit um, ${A("darfst du", "dürfen Sie")} die Karten noch in Ruhe fertig legen. So bleibt das Spiel ein Vergnügen und frisst nicht den Tag.</p>
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
  gewaehlt = null; nachspiel = 0;
  sheet({ titel: "Waldpatience", inhalt: `<div id="spiel"></div>`, voll: true, id: "spiel", onclose: spielPausieren });
  spielRender();
  clearInterval(spielIv);
  spielIv = setInterval(spielUhr, 1000);
}
function spielPausieren() { clearInterval(spielIv); if (G) { S.spiel.laufend = G.fertig ? null : { ...G, hist: G.hist.slice(-40) }; speichern(); } }
function spielUhr() {
  if (document.hidden || S.spiel.frei) return;
  const sp = S.spiel;
  if (sp.restSek > 0) { sp.restSek--; if (sp.restSek % 15 === 0) speichern(); if (sp.restSek === 0) { nachspiel = 300; spielRender(); } }
  else if (nachspiel > 0) { nachspiel--; if (nachspiel === 0) { spielPausieren(); spielEnde(true); } }
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
    ${S.spiel.frei || S.spiel.restSek > 0 ? `<button class="knopf leise" data-act="spiel-nochmal">Noch eine Runde</button>` : S.spiel.genutzt < S.spiel.limit ? `<button class="knopf leise" data-act="spiel">Noch eine Marke</button><p class="klein">Heute ${S.spiel.genutzt} von ${S.spiel.limit} Marken.</p>` : ""}`;
  if (aktuellesSheet()?.dataset.id === "spiel") sheetZu();
  setTimeout(() => { sheet({ titel: "Waldpatience", inhalt: html, id: "spielende" }); const c = $("#bild-spielende"); if (c) zeichneSzene(c, {}); }, 260);
}

/* ---------- Darstellung ---------- */
function karteHTML(k, attrs, top) {
  if (!k.up) return `<div class="karte zu" style="top:${top}px" aria-hidden="true"></div>`;
  const F = FARBEN[k.s];
  const sel = gewaehlt && attrs.includes(gewaehlt.attr) ? " gewaehlt" : "";
  return `<button class="karte ${F.rot ? "rot" : ""} f${k.s}${sel}" style="top:${top}px" ${attrs} aria-label="${WERT[k.w]} ${F.n}"><span class="w">${WERT[k.w]}</span><svg class="f" viewBox="0 0 24 24"><path fill="currentColor" d="${F.p}"/></svg><svg class="gross" viewBox="0 0 24 24"><path fill="currentColor" d="${F.p}"/></svg></button>`;
}
function spielRender() {
  const el = $("#spiel"); if (!el || !G) return;
  const kb = Math.floor((Math.min(innerWidth, 560) - 28 - 6 * 4) / 7), kh = Math.round(kb * 1.42);
  const vZu = Math.round(kb * .24), vAuf = Math.round(kb * .56);
  let h = `<div class="tisch" style="--kb:${kb}px"><div class="reihe" style="gap:4px">`;
  // Stapel + Ablage (Waste)
  h += `<button class="platz" data-act="g-stapel" aria-label="${G.stock.length ? "Karte ziehen" : "Stapel neu auflegen"}" style="border:0;cursor:pointer;padding:0">${G.stock.length ? `<div class="karte zu" style="top:0"></div>` : `<svg viewBox="0 0 24 24" style="width:60%;height:60%;color:var(--tinte-2)" aria-hidden="true"><path fill="currentColor" d="M12 5V2L7 6.5 12 11V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-8Z"/></svg>`}</button>`;
  h += `<div class="platz" style="background:transparent;box-shadow:none">${G.waste.length ? karteHTML(oben(G.waste), `data-act="g-karte" data-q="waste"`, 0) : ""}</div><div></div>`;
  for (let f = 0; f < 4; f++) { const a = G.found[f]; h += `<div class="platz" aria-label="Ablage ${FARBEN[f].n}">${a.length ? karteHTML(oben(a), `data-act="g-nix"`, 0).replace("<button", "<div").replace("</button>", "</div>") : `<svg viewBox="0 0 24 24" style="position:absolute;inset:22%;color:var(--mulde-2)" aria-hidden="true"><path fill="currentColor" d="${FARBEN[f].p}"/></svg>`}</div>`; }
  h += `</div><div class="reihe" style="gap:4px;margin-top:12px">`;
  for (let c = 0; c < 7; c++) {
    const col = G.tab[c]; let top = 0, inner = "";
    col.forEach((k, i) => { inner += karteHTML(k, `data-act="g-karte" data-q="${c}" data-i="${i}"`, top); top += k.up ? vAuf : vZu; });
    const hoehe = Math.max(kh, top - (col.length ? (oben(col).up ? vAuf : vZu) : 0) + kh);
    h += `<div class="saeule" style="height:${hoehe}px">${col.length ? "" : `<button class="platz" data-act="g-leer" data-q="${c}" aria-label="Leere Säule" style="border:0;cursor:pointer"></button>`}${inner}</div>`;
  }
  h += `</div></div>`;
  const sp = S.spiel;
  const zeit = sp.frei ? "" : sp.restSek > 0 ? `Noch ${Math.ceil(sp.restSek / 60)} Min.` : "";
  h += `${!sp.frei && sp.restSek === 0 && !G.fertig ? `<div class="bogen mulde" role="status" style="margin-top:12px"><p style="margin:0">Deine Zeit ist um. Leg diese Runde in Ruhe zu Ende.</p></div>` : ""}
    <div class="spiel-leiste">
      <button class="knopf klein zweit" data-act="g-zurueck" ${G.hist.length ? "" : "disabled"}>Zurück</button>
      <button class="knopf klein zweit" data-act="g-tipp">Tipp</button>
      ${alleOffen() && !G.fertig ? `<button class="knopf klein haupt" data-act="g-auto">Fertig legen</button>` : ""}
      <button class="knopf klein leise" data-act="g-neu">Neu geben</button>
    </div><p class="klein">${zeit ? zeit + " · " : ""}Karte antippen: Sie wandert an einen passenden Platz. Passt sie mehrfach, erst antippen, dann die Säule.</p>
    <button class="knopf zweit voll" data-act="g-aufhoeren">Für jetzt aufhören</button>`;
  el.innerHTML = h;
  armHaptics();
}
function spielKarteTipp(q, i) {
  const quelle = q === "waste" ? "waste" : Number(q), idx = Number(i);
  // Ist eine Karte gewählt und wird eine andere Säule angetippt → dorthin legen
  if (gewaehlt && quelle !== "waste" && gewaehlt.q !== quelle) {
    const karten = gewaehlt.q === "waste" ? [oben(G.waste)] : G.tab[gewaehlt.q].slice(gewaehlt.i);
    if (passtSaeule(karten[0], quelle)) { const gq = gewaehlt.q, gi = gewaehlt.i; gewaehlt = null; zieh(gq, gi, quelle); spielRender(); return; }
    gewaehlt = null; haptik("achtung"); spielRender(); return;
  }
  if (gewaehlt && gewaehlt.q === quelle) { gewaehlt = null; spielRender(); return; }
  const z = besterZug(quelle, idx);
  if (!z) { // nichts passt automatisch → auswählen
    const k = quelle === "waste" ? oben(G.waste) : G.tab[quelle][idx];
    if (k && k.up) { gewaehlt = { q: quelle, i: idx, attr: quelle === "waste" ? `data-q="waste"` : `data-q="${quelle}" data-i="${idx}"` }; haptik("auswahl"); }
    spielRender(); return;
  }
  // Mehrere Säulen möglich? Dann trotzdem die beste nehmen (einfach), Auswahl bleibt für Sonderfälle.
  zieh(quelle, idx, z.ziel); spielRender();
}
