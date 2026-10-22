/* ============================================================
   Deine Tage (Rückblick): abends freiwillig „Wie war dein Tag?“
   – sechs gleichrangige, klare Wörter mit je einer warmen Farbe, ein Tipp reicht, höchstens zwei.
   – Anzeige NUR im Rückblick: Monatsblatt wie mit Buntstift ausgemalt, aufklappbar das ganze Jahr (Flickenteppich).
   – Bewusst NICHT: Tagesform (S.tf) auswerten, Zahlen, Häufigkeiten, Linien, Vergleiche, Taler, Serien,
     Erinnerungen, Hühnchen-Kommentare, Teilen, Reaktion im Zuhause-Bild. (Gutachten Psychologin, entschieden)
   Zustand: S.jf = { an: true, tage: { "JJJJ-MM-TT": ["gemuetlich", "ruhig"] }, weg: "JJJJ-MM-TT" }
   ============================================================ */
const JF_FARBEN = [
  { id: "froehlich", name: "Fröhlich" },
  { id: "aktiv", name: "Aktiv" },
  { id: "gesellig", name: "Gesellig" },
  { id: "gemuetlich", name: "Gemütlich" },
  { id: "ruhig", name: "Ruhig" },
  { id: "durchwachsen", name: "Durchwachsen" }
];
const JF_ALT = { lachen: "froehlich", schwung: "aktiv", erlebt: "gesellig", still: "ruhig" }; // frühe Testfassung
const JF_IDS = JF_FARBEN.map(f => f.id), JF_TAG = /^\d{4}-\d{2}-\d{2}$/, JF_AB = 17, JF_NACH = 7;
const JF = { monat: "", jahr: false, jahrNr: 0, offen: "" }; // Ansicht (nicht gespeichert)

/* robust: Kaputtes wird repariert statt verworfen */
function jfMigrieren() {
  const o = S.jf && typeof S.jf === "object" && !Array.isArray(S.jf) ? S.jf : {};
  const roh = o.tage && typeof o.tage === "object" && !Array.isArray(o.tage) ? o.tage : {}, tage = {};
  for (const k of Object.keys(roh)) {
    if (!JF_TAG.test(k)) continue;
    let v = roh[k]; if (typeof v === "string") v = [v]; if (!Array.isArray(v)) continue;
    const l = [...new Set(v.map(x => JF_ALT[x] || x).filter(x => typeof x === "string" && JF_IDS.includes(x)))].slice(0, 2);
    if (l.length) tage[k] = l;
  }
  S.jf = { an: o.an !== false, tage, weg: typeof o.weg === "string" && JF_TAG.test(o.weg) ? o.weg : "" };
  return S.jf;
}
function jfS() { const j = S.jf; return j && typeof j === "object" && j.tage && typeof j.tage === "object" && !Array.isArray(j.tage) ? j : jfMigrieren(); }
function jfAn() { return jfS().an !== false; }
function jfName(id) { return (JF_FARBEN.find(f => f.id === id) || {}).name || ""; }
function jfNamen(l) { return l.map(jfName).join(" und "); }
/* Malen geht für heute ab 17 Uhr und still für die letzten 7 Tage */
function jfDarf(tag) { const h = heute(); if (tag === h) return jetzt().getHours() >= JF_AB; return tag < h && tag >= tagPlus(h, -JF_NACH); }

/* Kleines Buntstift-Feld (Farbe per Klasse; zwei Farben = diagonal geteilt) */
function jfFeld(l, cls = "") {
  if (!l || !l.length) return `<span class="jf-mal ${cls}" aria-hidden="true"></span>`;
  return `<span class="jf-mal ${cls} jf-${l[0]}${l[1] ? " jf-zwei" : ""}" aria-hidden="true">${l[1] ? `<span class="jf-halb jf-${l[1]}"></span>` : ""}</span>`;
}
function jfWahlHTML(tag) {
  const l = jfS().tage[tag] || [];
  return `<div class="jf-wahl-reihe" role="group" aria-label="Wie war der Tag">${JF_FARBEN.map(f => `<button class="chip jf-wahl" aria-pressed="${l.includes(f.id)}" data-act="jf-farbe" data-tag="${tag}" data-v="${f.id}">${jfFeld([f.id], "punkt")}<span>${f.name}</span></button>`).join("")}</div>`;
}

/* ---------- Die Abendfrage (dezent, freiwillig) – eigenständig, in jeder Karte aufrufbar ----------
   jfFrageHTML({ tag, titel, rahmen }) → "" wenn aus / nicht erlaubt / „Heute nicht“.
   tag: Standard heute (erst ab 17 Uhr), sonst einer der letzten 7 Tage (still nachtragen).
   rahmen: false = ohne eigenen Bogen (zum Einbetten in eine fremde Karte, z. B. „Für dein Tagebuch“). */
function jfFrageHTML(opt = {}) {
  try {
    const h = heute(), t = JF_TAG.test(opt.tag || "") ? opt.tag : h;
    if (!jfAn() || !jfDarf(t)) return "";
    const J = jfS(), l = J.tage[t] || [], istHeute = t === h;
    if (!l.length && istHeute && J.weg === h) return "";
    if (l.length && JF.offen !== t) // Tag abgeschlossen: eine stille Zeile, mehr nicht
      return `<div class="jf-fertig">${jfFeld(l, "klein")}<span class="jf-fertig-text">${istHeute ? A("Dein", "Ihr") + " Tag" : t === tagPlus(h, -1) ? "Gestern" : esc(datumLang(t))}: <b>${esc(jfNamen(l))}</b></span><button class="knopf klein leise" data-act="jf-aendern" data-tag="${t}">Ändern</button></div>`;
    const erstes = Object.keys(J.tage).length < 3;
    const titel = opt.titel || (istHeute ? A("Wie war dein Tag?", "Wie war Ihr Tag?") : t === tagPlus(h, -1) ? "Wie war gestern?" : `Wie war ${A("dein", "Ihr")} ${esc(datumLang(t))}?`);
    const innen = `<h3 class="jf-titel">${titel}</h3>
      ${erstes && !l.length ? `<p class="klein jf-unter">Daraus wird im Rückblick nach und nach ein buntes Jahr – nur für ${A("dich", "Sie")}.</p>` : ""}
      ${jfWahlHTML(t)}
      <div class="zeile jf-fuss"><span class="klein">${l.length ? (l.length < 2 ? "Eingemalt. Eine zweite geht auch." : "Eingemalt.") : "Ein Tipp reicht. Zwei gehen auch."}</span>${l.length ? `<button class="knopf klein leise" data-act="jf-fertig" data-tag="${t}">Fertig</button>` : istHeute ? `<button class="knopf klein leise" data-act="jf-weg">Heute nicht</button>` : ""}</div>`;
    return opt.rahmen === false ? `<div class="jf-frage jf-eingebettet">${innen}</div>` : `<div class="bogen jf-frage">${innen}</div>`;
  } catch (e) { console.warn(e); return ""; }
}
/* Heute: dieselbe Frage als eigener Abschnitt (wird beim Rückblick-Umbau durch die Karte „Für dein Tagebuch“ ersetzt) */
function jfHeuteHTML() { const f = jfFrageHTML(); return f ? `<section class="abschnitt">${f}</section>` : ""; }

/* ---------- Rückblick: Monatsblatt + aufklappbares Jahr ---------- */
function jfMonatName(m) { return `${MONAT[Number(m.slice(5)) - 1]} ${m.slice(0, 4)}`; }
function jfMonatPlus(m, n) { const d = new Date(Number(m.slice(0, 4)), Number(m.slice(5)) - 1 + n, 1, 12); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; }
function jfErsterMonat() {
  const t = Object.keys(jfS().tage).sort()[0], s = typeof S.start === "string" && JF_TAG.test(S.start) ? S.start : heute();
  return (t && t < s ? t : s).slice(0, 7);
}
function jfTageImMonat(m) { return new Date(Number(m.slice(0, 4)), Number(m.slice(5)), 0).getDate(); }
function jfBlatt(m) {
  const an = jfAn(), h = heute(), J = jfS(), n = jfTageImMonat(m), vorn = (new Date(Number(m.slice(0, 4)), Number(m.slice(5)) - 1, 1).getDay() + 6) % 7;
  let z = "";
  for (let i = 0; i < vorn; i++) z += `<span class="jf-leer" aria-hidden="true"></span>`;
  for (let d = 1; d <= n; d++) {
    const t = `${m}-${String(d).padStart(2, "0")}`, l = an ? J.tage[t] || [] : [];
    if (t > h) { z += `<span class="jf-tag jf-zukunft" aria-hidden="true"><span class="jf-zahl">${d}</span></span>`; continue; }
    // Rückblick-Umbau: Senfstern für Tage mit schönstem Moment; ohne Farben ein Punkt für Tage mit Einträgen
    const stern = typeof rbSchoen === "function" ? rbSchoen(t).length > 0 : !!(S.momente && S.momente[t]);
    const punkt = !an && (typeof rbTagHatWas === "function" ? rbTagHatWas(t) : eintraegeAm(t).length > 0);
    z += `<button class="jf-tag${l.length ? " gemalt" : ""}${t === h ? " heute" : ""}${punkt ? " mit-punkt" : ""}" data-act="jf-tag" data-v="${t}" aria-label="${esc(datumLang(t))}${l.length ? ": " + esc(jfNamen(l)) : ""}${punkt ? ", mit Einträgen" : ""}${stern ? ", mit schönstem Moment" : ""}">${l.length ? jfFeld(l) : ""}<span class="jf-zahl">${d}</span>${punkt ? `<span class="jf-punkt" aria-hidden="true"></span>` : ""}${stern ? `<span class="jf-stern" aria-hidden="true">★</span>` : ""}</button>`;
  }
  return `<div class="jf-wt" aria-hidden="true">${["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(w => `<span>${w}</span>`).join("")}</div><div class="jf-blatt">${z}</div>`;
}
function jfLegende() { return `<div class="jf-legende" aria-hidden="true">${JF_FARBEN.map(f => `<span>${jfFeld([f.id], "punkt")}${f.name}</span>`).join("")}</div>`; }
function jfJahr(y) {
  const J = jfS(), h = heute();
  const flicken = MONAT.map((name, i) => {
    const m = `${y}-${String(i + 1).padStart(2, "0")}`, n = jfTageImMonat(m), vorn = (new Date(y, i, 1).getDay() + 6) % 7;
    let px = ""; for (let k = 0; k < vorn; k++) px += `<i class="jf-px leer"></i>`;
    for (let d = 1; d <= n; d++) { const t = `${m}-${String(d).padStart(2, "0")}`, l = t <= h ? J.tage[t] || [] : []; px += l.length ? `<i class="jf-px jf-${l[0]}${l[1] ? " jf-zwei" : ""}">${l[1] ? `<i class="jf-halb jf-${l[1]}"></i>` : ""}</i>` : `<i class="jf-px${t > h ? " zukunft" : ""}"></i>`; }
    const geht = m <= h.slice(0, 7);
    return geht ? `<button class="jf-flicken${m === JF.monat ? " an" : ""}" data-act="jf-zu-monat" data-v="${m}" aria-label="${name} ${y} ansehen"><span class="jf-fname">${name.slice(0, 3)}</span><span class="jf-pixel">${px}</span></button>`
      : `<span class="jf-flicken zukunft" aria-hidden="true"><span class="jf-fname">${name.slice(0, 3)}</span><span class="jf-pixel">${px}</span></span>`;
  }).join("");
  const y0 = Number(jfErsterMonat().slice(0, 4)), y1 = Number(h.slice(0, 4));
  const nav = y0 < y1 ? `<div class="jf-nav jf-jahr-nav"><button class="knopf klein leise jf-pfeil" data-act="jf-jahrnr" data-v="-1" aria-label="Voriges Jahr" ${y <= y0 ? "disabled" : ""}>‹</button><h3>${y}</h3><button class="knopf klein leise jf-pfeil" data-act="jf-jahrnr" data-v="1" aria-label="Nächstes Jahr" ${y >= y1 ? "disabled" : ""}>›</button></div>` : `<h3 class="jf-jahr-titel">${y}</h3>`;
  return `<div class="jf-jahr" id="jf-jahr">${nav}<div class="jf-teppich">${flicken}</div></div>`;
}
function jfRueckblickHTML(h) {
  try {
    const an = jfAn(); // ausgeschaltet: Kalender ohne Farben (Punkte für Tage mit Einträgen), ohne Legende und Jahr
    const jetztM = (h || heute()).slice(0, 7), erst = jfErsterMonat();
    if (!JF.monat || JF.monat > jetztM || JF.monat < erst) JF.monat = jetztM;
    if (!JF.jahrNr) JF.jahrNr = Number(JF.monat.slice(0, 4));
    const m = JF.monat, leer = !Object.keys(jfS().tage).length;
    return `<section class="abschnitt" id="jf-karte"><div class="bogen jf-karte">
      <span class="c-kicker">Deine Tage</span>
      <div class="jf-nav"><button class="knopf klein leise jf-pfeil" data-act="jf-monat" data-v="-1" aria-label="Voriger Monat" ${m <= erst ? "disabled" : ""}>‹</button><h3>${jfMonatName(m)}</h3><button class="knopf klein leise jf-pfeil" data-act="jf-monat" data-v="1" aria-label="Nächster Monat" ${m >= jetztM ? "disabled" : ""}>›</button></div>
      ${jfBlatt(m)}
      ${!an ? `<p class="klein jf-hinweis">Tipp auf einen Tag zeigt, was da los war.</p>` : leer ? `<p class="klein jf-hinweis">Abends ab 17 Uhr ${A("kannst du deinem", "können Sie Ihrem")} Tag oben eine Farbe geben. Tipp auf einen Tag zeigt, was da los war.</p>` : jfLegende()}
      ${an ? `<button class="knopf klein zweit voll jf-jahr-knopf" data-act="jf-jahr" aria-expanded="${JF.jahr}" aria-controls="jf-jahr">${ic("pinsel")} ${JF.jahr ? "Das ganze Jahr zuklappen" : "Das ganze Jahr ansehen"}</button>
      ${JF.jahr ? jfJahr(JF.jahrNr) : ""}` : ""}
    </div></section>`;
  } catch (e) { console.warn(e); return ""; }
}

/* ---------- Tag antippen: Farbe(n), Einträge, Schönster Moment, Dankbar, Merkzettel ---------- */
function jfTagInhalt(t) {
  const an = jfAn(), l = an ? jfS().tage[t] || [] : [], es = eintraegeAm(t).filter(e => e.notiz !== "App eingerichtet"), darf = an && jfDarf(t);
  let html = "";
  if (l.length) html += `<div class="jf-tag-farbe">${jfFeld(l, "gross")}<span class="serif">${esc(jfNamen(l))}</span></div>`;
  if (darf) html += `<p class="klein jf-tag-hinweis${l.length ? " mit-farbe" : ""}">${l.length ? "Ändern geht noch. Zwei Farben gehen auch." : A("Wie war der Tag? Wenn du magst.", "Wie war der Tag? Wenn Sie mögen.")}</p>${jfWahlHTML(t)}`;
  try { // nur lesen, nichts migrieren
    // alle schönen Einträge des Tages (Moment zuerst, dann ältere Dankbar-Zeilen) – ein Zeichen, eine Schrift
    const sch = typeof rbSchoen === "function" ? rbSchoen(t) : (S.momente && S.momente[t] ? [S.momente[t]] : []);
    if (sch.length) html += `<div class="bogen mulde jf-zitat jf-schoen"><span class="c-kicker">Was schön war</span><ul class="ab-liste">${sch.map(x => `<li class="ab-m"><span class="ab-z" aria-hidden="true">★</span><span>${esc(x)}</span></li>`).join("")}</ul></div>`;
  } catch (e) { }
  const merk = (S.tbMerk || []).filter(x => x && x.tag === t && typeof x.text === "string");
  if (merk.length) html += `<div class="bogen mulde jf-zitat"><span class="c-kicker">Fürs Tagebuch notiert</span><ul>${merk.map(x => `<li>${esc(x.text)}</li>`).join("")}</ul></div>`;
  if (es.length) html += `<h3 class="jf-tag-h">Eingetragen</h3><div class="liste">${es.slice().reverse().map(e => eintragZeile(e, true, false)).join("")}</div>`; // änderbar (Tipp → Ändern/Löschen)
  if (!html) html = `<p>An diesem Tag steht nichts drin. Auch gut.</p>`;
  return html;
}
/* Tagesblatt als eigenes Sheet – von überall aufrufbar (Monatsblatt, Jahr, Wochenstreifen, „Alle Tage“ …) */
function jfTagSheet(t) { if (!JF_TAG.test(t || "")) return; sheet({ titel: datumLang(t) + (t.slice(0, 4) !== heute().slice(0, 4) ? " " + t.slice(0, 4) : ""), id: "jf-tag", inhalt: jfTagInhalt(t) }); const sh = aktuellesSheet(); if (sh) sh.dataset.tag = t; }

/* ---------- Einstellungen ---------- */
function jfEinstGruppe() {
  if (typeof einstGruppe !== "function") return "";
  return einstGruppe("jf", "pinsel", "Deine Tage", jfAn() ? "Abendfrage an" : "Abendfrage aus",
    `${schalter(jfAn(), "Abends fragen: Farbe für den Tag", `data-act="jf-an"`, "Ab 17 Uhr im Rückblick unter ‚Für dein Tagebuch‘. Ausgeschaltet verschwinden die Farben, der Kalender bleibt. Alles bleibt gespeichert.")}`);
}

/* ---------- Malen ---------- */
function jfMalen(t, id) {
  if (!JF_IDS.includes(id) || !jfDarf(t)) return false;
  const J = jfS(), l = (J.tage[t] || []).slice(), i = l.indexOf(id);
  if (i >= 0) l.splice(i, 1); else if (l.length < 2) l.push(id); else l[1] = id;
  if (l.length) J.tage[t] = l; else delete J.tage[t];
  speichern(); return true;
}
function jfNeu() {
  render({ halteScroll: true, ohneAnim: true });
  const sh = aktuellesSheet(); if (sh && sh.dataset.id === "jf-tag" && sh.dataset.tag) sheetInhalt(jfTagInhalt(sh.dataset.tag));
}
document.addEventListener("click", ev => {
  const el = ev.target.closest && ev.target.closest("[data-act^='jf-']"); if (!el || el.disabled) return;
  try {
    const a = el.dataset.act, v = el.dataset.v || "", h = heute();
    if (a === "jf-farbe") {
      const t = el.dataset.tag || h, vorher = (jfS().tage[t] || []).length;
      if (!jfMalen(t, v)) return;
      haptik("auswahl");
      if (!vorher && !SHEETS.length) JF.offen = t; // nach dem ersten Tipp bleibt die Wahl in der Karte kurz offen (zweite Farbe)
      jfNeu();
    }
    else if (a === "jf-fertig") { JF.offen = ""; haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); }
    else if (a === "jf-aendern") { JF.offen = JF_TAG.test(el.dataset.tag || "") ? el.dataset.tag : h; render({ halteScroll: true, ohneAnim: true }); }
    else if (a === "jf-weg") { jfS().weg = h; speichern(); JF.offen = ""; render({ halteScroll: true, ohneAnim: true }); }
    else if (a === "jf-tag") jfTagSheet(v);
    else if (a === "jf-monat") { JF.monat = jfMonatPlus(JF.monat || h.slice(0, 7), Number(v) || 0); JF.jahrNr = Number(JF.monat.slice(0, 4)); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); }
    else if (a === "jf-jahr") { JF.jahr = !JF.jahr; JF.jahrNr = Number((JF.monat || h).slice(0, 4)); render({ halteScroll: true, ohneAnim: true }); }
    else if (a === "jf-jahrnr") { JF.jahrNr += Number(v) || 0; haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); }
    else if (a === "jf-zu-monat") { JF.monat = v; haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); const k = $("#jf-karte"); if (k) k.scrollIntoView({ block: "start", behavior: REDUCED() ? "auto" : "smooth" }); }
    else if (a === "jf-an") { jfS().an = !jfAn(); speichern(); sheetInhalt(einstellungenInhalt()); render({ halteScroll: true, ohneAnim: true }); }
  } catch (e) { console.warn(e); }
});
