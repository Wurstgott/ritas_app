/* ============================================================
   Gönn dir was – Gönn-Karten
   Für je 150 insgesamt gesammelte Taler liegt eine Gönn-Karte bereit:
   von Rita, für Rita. Es wird nichts abgebucht, nichts verfällt,
   nichts ist gesperrt. „Mach ich“ setzt die Sache auf die To-do-Liste;
   abgehakt steht sie als „Gegönnt: …“ im Rückblick (ohne Taler).
   Zustand: S.goenn = { ausgestellt, gesehen, karten: [{ id, nr, tag, idx, text, z }], ideen: [] }
   ============================================================ */
const GK_SCHRITT = 150;
/* Vorschläge: klein, oft kostenlos, draußen oder zu Hause. m = nur in diesen Monaten */
const GK_VORSCHLAEGE = [
  { t: "Ein Strauß vom Markt", z: "Der, der dir als Erstes ins Auge fällt." },
  { t: "Ein neues Buch", z: "Einfach eins, auf das du Lust hast." },
  { t: "Kuchen vom Lieblingsbäcker", z: "Zum Mitnehmen. Ein Stück mehr als geplant." },
  { t: "Eine Taxifahrt zu einem schönen Ort", z: "Hin und zurück, ohne Umsteigen." },
  { t: "Was richtig Gutes vom Hofladen", z: "Hühnchen muss ja nicht alles wissen." },
  { t: "Ein Konzert vom Sofa aus", z: "Von vorn bis hinten, mit Tee und Decke." },
  { t: "Eine neue Pflanze für den Balkon", m: [3, 4, 5, 6, 7, 8, 9] },
  { t: "Ein Fotobuch mit deinen Handybildern", z: "Das Aussuchen ist schon der halbe Spaß." },
  { t: "Ein schöner Stift fürs Tagebuch" },
  { t: "Ein Ausflug an einem ruhigen Wochentag", z: "Wenn die anderen alle arbeiten müssen." },
  { t: "Ein Schwedenkrimi, den du noch nicht kennst" },
  { t: "Eine richtig gute Tafel Schokolade", z: "Nicht die aus dem Angebot." },
  { t: "Neue Farben oder gutes Aquarellpapier" },
  { t: "Eine Teesorte, die du noch nie hattest" },
  { t: "Ein Vormittag ganz ohne Plan" },
  { t: "Kakao in der Thermoskanne und eine Bank am Forst", m: [10, 11, 12, 1, 2, 3] },
  { t: "Frische Erdbeeren vom Feld", m: [5, 6, 7] },
  { t: "Eine Kugel Eis auf die Hand", m: [4, 5, 6, 7, 8, 9] },
  { t: "Kaffee und Kuchen auf einer Terrasse", z: "Am Nachmittag, wenn wenig los ist.", m: [5, 6, 7, 8, 9] },
  { t: "Eine Dampferfahrt auf der Havel", z: "Oben an Deck, an einem Wochentag.", m: [5, 6, 7, 8, 9] },
  { t: "Ein Hörbuch für die langen Abende", m: [10, 11, 12, 1, 2, 3] },
  { t: "Ein ganzer Nachmittag Harry Potter" },
  { t: "Frische Brötchen und ein langes Frühstück" },
  { t: "Eine schöne Tasse für den Lieblingstee" },
  { t: "Dein Lieblingsfilm, zum x-ten Mal" },
  { t: "Ein Glas Honig vom Imker" },
  { t: "Deine Lieblingsmusik, richtig laut", z: "Die Nachbarn kennen das schon." },
  { t: "Ein Spaziergang zum Sonnenuntergang" },
  { t: "Eine schöne Postkarte, nur für deine Pinnwand" },
  { t: "Ein Schwedenkrimi-Abend mit Zimtschnecken" },
  { t: "Eine Runde mit dem Voi-Roller an einem sonnigen Vormittag", m: [4, 5, 6, 7, 8, 9] },
  { t: "Ein Abend mit schwedischem Radio", z: "Sveriges Radio P2 läuft auch im Internet." },
  { t: "Ein Rätselheft und ein guter Bleistift" },
  { t: "Ein Bund Tulpen", z: "Wenn draußen noch alles grau ist.", m: [1, 2, 3] }
];
const GK = { eingabe: null, alle: false };

/* ---------- Zählen und Ausstellen ---------- */
function gkGesammelt() { return Math.max(0, talerStand() + Math.max(0, Number(S.talerAusgegeben) || 0)); }
function gkNoch() { return GK_SCHRITT - (gkGesammelt() % GK_SCHRITT); }
function gkPool(k) {
  const mo = jetzt().getMonth() + 1, r = rnd("gk-" + k.id);
  const vor = GK_VORSCHLAEGE.filter(v => !v.m || v.m.includes(mo));
  for (let i = vor.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [vor[i], vor[j]] = [vor[j], vor[i]]; }
  const eig = S.goenn.ideen, o = eig.length ? (k.nr || 0) % eig.length : 0;
  return [...eig.slice(o), ...eig.slice(0, o)].map(t => ({ t, eigen: true })).concat(vor);
}
function gkSetze(k, idx) {
  const p = gkPool(k); if (!p.length) return;
  let i = ((idx % p.length) + p.length) % p.length;
  if (p.length > 1 && p[i].t === k.text) i = (i + 1) % p.length;
  k.idx = i; k.text = p[i].t; k.z = p[i].z || ""; k.eigen = !!p[i].eigen;
}
function gkNeueKarte(nr) {
  const k = { id: "gk" + nr, nr, tag: heute(), idx: 0, text: "", z: "" };
  if (S.goenn.karten.some(x => x.id === k.id)) return;
  gkSetze(k, 0); S.goenn.karten.push(k);
}
function gkPruefen() {
  const g = S && S.goenn; if (!g || !Array.isArray(g.karten)) return;
  const n = Math.floor(gkGesammelt() / GK_SCHRITT);
  if (g.ausgestellt < 0) { g.ausgestellt = n; if (n >= 1) gkNeueKarte(n); return; } // Einführung: höchstens eine Karte für das schon Gesammelte
  let neu = 0;
  while (g.ausgestellt < n) { g.ausgestellt++; if (neu++ < 3) gkNeueKarte(g.ausgestellt); }
}
/* Status wird aus Liste und Einträgen abgeleitet – so bleibt alles zurücknehmbar */
function gkStatus(k) {
  const e = S.eintraege.find(x => x.goenn === k.id); if (e) return { s: "gegoennt", tag: e.tag };
  const l = (S.liste || []).find(x => x.goenn === k.id && !x.erledigt); if (l) return { s: "vor", l };
  return { s: "offen" };
}
const gkOffen = () => S.goenn.karten.filter(k => gkStatus(k).s !== "gegoennt");
const gkNeu = () => S.goenn.gesehen < S.goenn.ausgestellt && gkOffen().length > 0;

/* ---------- Bilder ---------- */
function gkStempel(cls = "gk-stempel") {
  return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="gk-kreis" d="M50 50m-34 0a34 34 0 1 1 68 0a34 34 0 1 1 -68 0"/></defs>
  <g fill="none" stroke="currentColor"><circle cx="50" cy="50" r="46" stroke-width="3"/><circle cx="50" cy="50" r="27" stroke-width="1.6"/></g>
  <text fill="currentColor" font-family="Nunito, system-ui, sans-serif" font-weight="800" font-size="11.5" letter-spacing="2.2"><textPath href="#gk-kreis" startOffset="2%">GÖNN DIR WAS · GÖNN DIR WAS ·</textPath></text>
  <g fill="currentColor"><ellipse cx="48" cy="56" rx="13" ry="11"/><ellipse cx="53.5" cy="47" rx="6" ry="7"/><circle cx="56" cy="41" r="7.5"/><circle cx="52" cy="33.6" r="2.4"/><circle cx="55.6" cy="32.4" r="2.6"/><circle cx="59.2" cy="33.6" r="2.4"/><path d="M63 39.4 69.5 42.4 63 45.4Z"/><path d="M37 53 29 44.5 33 56Z"/><path d="M36.5 57 28 53 34.5 61.5Z"/></g>
  <g fill="none" stroke="var(--gk-papier, #FFF7E6)" stroke-width="1.6" stroke-linecap="round"><path d="M42 55.5q6 6.5 12.5 0"/></g><circle cx="58.2" cy="40" r="1.7" fill="var(--gk-papier, #FFF7E6)"/>
  <path d="M45 66.5v5.5M52 66.5v5.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
}
function gkDatum(tag) { const d = tagDatum(tag); return `${d.getDate()}. ${MONAT[d.getMonth()]} ${d.getFullYear()}`; }
function gkKarteHTML(k) {
  const st = gkStatus(k), name = esc(S.name || "Rita");
  const knoepfe = st.s === "vor"
    ? `<p class="gk-vermerk">${ic("haken")} Steht auf deiner To-do-Liste.</p><button class="knopf klein leise voll" data-act="gk-doch" data-id="${k.id}">Doch nicht – von der Liste nehmen</button>`
    : GK.eingabe === k.id
      ? `<label class="feld" for="gk-eigen-text">Was gönnst du dir?</label><input id="gk-eigen-text" class="text" maxlength="90" placeholder="z. B. Pflaumenkuchen" autocomplete="off"><div class="gk-reihe"><button class="knopf haupt" data-act="gk-eigen-ok" data-id="${k.id}">Auf die Karte</button><button class="knopf leise" data-act="gk-eigen-ab">Abbrechen</button></div>`
      : `<button class="knopf haupt voll" data-act="gk-mach" data-id="${k.id}">${ic("haken")} Mach ich</button><div class="gk-reihe"><button class="knopf zweit" data-act="gk-anders" data-id="${k.id}">Was anderes</button><button class="knopf zweit" data-act="gk-eigen" data-id="${k.id}">${ic("feder")} Eigene Idee</button></div>`;
  return `<article class="gk-karte${st.s === "vor" ? " vor" : ""}" aria-label="Gönn-Karte Nummer ${k.nr}: ${esc(k.text)}">
    <div class="gk-kopf"><span class="gk-titel">Gönn-Karte</span><span class="gk-nr">Nr. ${k.nr}</span></div>
    <p class="gk-von"><span class="gk-label">Von</span> <span class="gk-hand">${name}</span> <span class="gk-label">für</span> <span class="gk-hand">${name}</span></p>
    <span class="gk-label">Gut für</span>
    <p class="gk-was gk-hand">${esc(k.text)}</p>${k.z ? `<p class="gk-zusatz">${esc(k.z)}</p>` : k.eigen ? `<p class="gk-zusatz">Von deiner eigenen Liste.</p>` : ""}
    <p class="gk-fuss">${esc(gkDatum(k.tag))} · läuft nie ab</p>
    ${gkStempel()}
  </article><div class="gk-knoepfe">${knoepfe}</div>`;
}

/* ---------- Ansicht ---------- */
function gkInhalt() {
  const g = S.goenn, ges = gkGesammelt(), noch = gkNoch(), anteil = Math.round(((GK_SCHRITT - noch) / GK_SCHRITT) * 100);
  const offen = gkOffen().slice().reverse(), zeig = GK.alle ? offen : offen.slice(0, 3);
  let h = `<p class="gk-intro">Für je ${GK_SCHRITT} Taler, die du sammelst, liegt hier eine Gönn-Karte bereit, von dir für dich. Kostet nichts: Deine Taler bleiben, wo sie sind. Die Karte ist nur der Schubs.</p>`;
  h += `<div class="gk-stand"><div class="zeile zwischen"><span>Schon gesammelt: <b>${ges} Taler</b></span></div><div class="gk-balken" role="img" aria-label="Noch ${noch} Taler bis zur nächsten Karte"><i style="width:${anteil}%"></i></div><p class="klein" style="margin:6px 0 0">Noch ${noch} Taler sammeln, dann liegt die ${g.karten.length ? "nächste" : "erste"} Karte da – geschenkt.</p></div>`;
  if (zeig.length) {
    if (S.huhn && offen.some(k => k.tag === heute() && gkStatus(k).s === "offen")) h += `<p class="gk-huhn">${huhnSVG({ gr: 44, kopf: true })}<span>Hühnchen: „Neue Karte! Den Stempel hab ich schon draufgehauen.“</span></p>`;
    h += zeig.map(gkKarteHTML).join("");
    if (offen.length > zeig.length) h += `<button class="knopf leise voll" data-act="gk-alle">Noch ${offen.length - zeig.length} ältere ${offen.length - zeig.length === 1 ? "Karte" : "Karten"} – laufen nicht weg</button>`;
  } else h += `<p class="klein gk-leer">${g.karten.length ? "Gerade liegt keine Karte offen. Die nächste kommt von allein." : "Deine erste Karte kommt von allein, sobald die Taler zusammen sind."}</p>`;
  // Ritas eigene Liste
  h += `<h3 class="gk-h">Das gönn ich mir</h3><p class="klein" style="margin:0 0 8px">Deine eigenen Ideen. Die kommen zuerst auf die Karten.</p>`;
  h += g.ideen.length ? `<div class="liste">${g.ideen.map((t, i) => `<div class="gk-idee"><span>${esc(t)}</span><button class="knopf zweit" data-act="gk-idee-weg" data-i="${i}" aria-label="${esc(t)} streichen">${ic("schliessen")}</button></div>`).join("")}</div>` : "";
  h += `<div class="zeile" style="margin-top:8px"><input id="gk-idee" class="text" maxlength="90" placeholder="Was hättest du gern?" aria-label="Neue Idee für deine Liste" autocomplete="off" style="min-height:56px"><button class="knopf zweit" data-act="gk-idee-neu" aria-label="Auf die Liste setzen">${ic("plus")}</button></div>`;
  // Schon gegönnt
  const fertig = g.karten.map(k => ({ k, st: gkStatus(k) })).filter(x => x.st.s === "gegoennt").sort((a, b) => a.st.tag < b.st.tag ? 1 : -1);
  if (fertig.length) h += `<h3 class="gk-h">Schon gegönnt</h3><ul class="gk-album">${fertig.slice(0, 10).map(({ k, st }) => `<li>${gkStempel("gk-stempel-mini")}<span><span class="gk-hand">${esc(k.text)}</span><br><span class="klein">${esc(datumRelativ(st.tag))}</span></span></li>`).join("")}</ul>`;
  return h;
}
function gkSheet() {
  S.goenn.gesehen = S.goenn.ausgestellt; speichern();
  GK.eingabe = null; GK.alle = false;
  sheet({ titel: "Gönn dir was", id: "goennen", inhalt: gkInhalt() });
  gkPlakette();
}
function gkNeuZeigen() { const sh = aktuellesSheet(); if (sh && sh.dataset.id === "goennen") sheetInhalt(gkInhalt()); }

/* Leiste im Kramladen (oben, unter der Kasse) */
function gkLeiste() {
  const noch = gkNoch(), anteil = Math.round(((GK_SCHRITT - noch) / GK_SCHRITT) * 100), neu = gkNeu(), offen = gkOffen().length;
  return `<button class="goenn-leiste" data-act="gk-auf">${gkStempel("gk-stempel-leiste")}<span class="gl-text"><span class="gl-titel">Gönn dir was${neu ? ` <span class="ks-marke">Neue Karte</span>` : ""}</span><span class="gl-unter">${offen ? `${offen === 1 ? "Eine Gönn-Karte liegt" : offen + " Gönn-Karten liegen"} bereit · die nächste kommt in ${noch} Talern` : `Noch ${noch} Taler sammeln, dann liegt die ${S.goenn.karten.length ? "nächste" : "erste"} Karte da`}</span><span class="gl-gratis">Geschenkt – kostet keine Taler</span><span class="gk-balken klein-balken" aria-hidden="true"><i style="width:${anteil}%"></i></span></span>${ic("pfeil", "pfeil")}</button>`;
}
/* Dezenter Hinweis auf „Heute“, über der To-do-Liste – bis die Karte angesehen oder weggelegt ist */
function gkHinweisHTML() {
  if (!S.goenn || !gkNeu() || !S.onboard) return "";
  return `<section class="abschnitt"><div class="goenn-hinweis">${gkStempel("gk-stempel-leiste")}<p>Eine neue Gönn-Karte liegt für dich bereit.</p><div class="gk-reihe"><button class="knopf klein zweit" data-act="gk-auf">Ansehen</button><button class="knopf klein leise" data-act="gk-hinweis-weg">Später</button></div></div></section>`;
}
function gkPlakette() { const el = document.getElementById("taler-plakette"); if (el) el.classList.toggle("gk-neu", !!(S.goenn && gkNeu())); }

/* ---------- Aktionen ---------- */
function gkAktion(a, d, el) {
  const k = d.id ? S.goenn.karten.find(x => x.id === d.id) : null;
  switch (a) {
    case "gk-auf": { const sh = aktuellesSheet(); if (sh && sh.dataset.id === "goennen") break; gkSheet(); break; }
    case "gk-hinweis-weg": S.goenn.gesehen = S.goenn.ausgestellt; speichern(); render({ halteScroll: true, ohneAnim: true }); toast("Liegt im Kramladen unter „Gönn dir was“. Läuft nicht weg."); break;
    case "gk-mach": {
      if (!k || gkStatus(k).s !== "offen") break;
      S.liste = S.liste || []; S.liste.push({ id: "l" + Date.now().toString(36), text: k.text, goenn: k.id, neu: heute() });
      speichern(); haptik("erfolg"); gkNeuZeigen(); render({ halteScroll: true, ohneAnim: true });
      toast("Steht auf deiner To-do-Liste.\nWenn’s erledigt ist, einfach abhaken.", { erfolg: true, dauer: 5000 }); break; }
    case "gk-doch": { const i = (S.liste || []).findIndex(x => x.goenn === d.id && !x.erledigt); if (i >= 0) S.liste.splice(i, 1); speichern(); haptik("auswahl"); gkNeuZeigen(); render({ halteScroll: true, ohneAnim: true }); break; }
    case "gk-anders": if (!k) break; gkSetze(k, (k.idx || 0) + 1); speichern(); haptik("auswahl"); gkNeuZeigen(); break;
    case "gk-eigen": GK.eingabe = d.id; gkNeuZeigen(); setTimeout(() => { const f = document.getElementById("gk-eigen-text"); if (f) f.focus(); }, 60); break;
    case "gk-eigen-ab": GK.eingabe = null; gkNeuZeigen(); break;
    case "gk-eigen-ok": {
      const f = document.getElementById("gk-eigen-text"), t = f ? f.value.trim().replace(/\s+/g, " ").slice(0, 90) : "";
      if (!k) break; if (!t) { if (f) f.focus(); break; }
      if (!S.goenn.ideen.includes(t)) S.goenn.ideen.push(t);
      k.text = t; k.z = ""; k.eigen = true; GK.eingabe = null; speichern(); haptik("erfolg"); gkNeuZeigen(); break; }
    case "gk-idee-neu": {
      const f = document.getElementById("gk-idee"), t = f ? f.value.trim().replace(/\s+/g, " ").slice(0, 90) : "";
      if (!t) { if (f) f.focus(); break; }
      if (!S.goenn.ideen.includes(t)) S.goenn.ideen.push(t);
      speichern(); haptik("auswahl"); gkNeuZeigen(); setTimeout(() => { const g = document.getElementById("gk-idee"); if (g) g.focus(); }, 40); break; }
    case "gk-idee-weg": { const i = Number(d.i); if (!(i >= 0 && i < S.goenn.ideen.length)) break; const [weg] = S.goenn.ideen.splice(i, 1); window._gkWeg = { t: weg, i }; speichern(); gkNeuZeigen(); toast(`Gestrichen: ${weg}`, { knopf: { text: "Doch behalten", act: "gk-idee-zurueck" }, dauer: 6000 }); break; }
    case "gk-idee-zurueck": { const w = window._gkWeg; if (w && !S.goenn.ideen.includes(w.t)) { S.goenn.ideen.splice(Math.min(w.i, S.goenn.ideen.length), 0, w.t); speichern(); gkNeuZeigen(); } window._gkWeg = null; $$(".toast").forEach(t => t.remove()); break; }
    case "gk-alle": GK.alle = true; gkNeuZeigen(); break;
  }
}
document.addEventListener("click", ev => {
  const el = ev.target.closest && ev.target.closest("[data-act^='gk-']"); if (!el || el.disabled) return;
  try { gkAktion(el.dataset.act, el.dataset, el); } catch (e) { console.warn(e); }
});
document.addEventListener("keydown", ev => {
  if (ev.key !== "Enter" || !ev.target || !ev.target.id) return;
  if (ev.target.id === "gk-idee") { ev.preventDefault(); gkAktion("gk-idee-neu", {}, ev.target); }
  else if (ev.target.id === "gk-eigen-text" && GK.eingabe) { ev.preventDefault(); gkAktion("gk-eigen-ok", { id: GK.eingabe }, ev.target); }
});

/* ---------- Einhängen ---------- */
{ const s0 = speichern; speichern = function () { try { gkPruefen(); } catch (e) { } s0(); try { gkPlakette(); } catch (e) { } }; }
/* Abhaken einer Gönn-Sache: Eintrag merkt sich die Karte, keine Taler dafür */
{ const e0 = eintragSpeichern; eintragSpeichern = function (entwurf, altId) {
  let gk = null;
  if (entwurf && entwurf.t === "abgehakt" && entwurf.listeId) { const x = (S.liste || []).find(y => y.id === entwurf.listeId); if (x && x.goenn) { gk = x.goenn; entwurf = { ...entwurf, goenn: gk }; } }
  const r = e0(entwurf, altId);
  if (r && gk && r.e.taler) { S.taler -= r.e.taler; r.e.taler = 0; speichern(); }
  return r;
}; }
{ const n0 = nachEintrag; nachEintrag = function (r, text) { if (r && r.e && r.e.goenn) text = `Gegönnt: ${String(r.e.notiz || "").replace(/[.!?]+$/, "")}.`; return n0(r, text); }; }
{ const t0 = eintragText; eintragText = function (e) { return e && e.t === "abgehakt" && e.goenn ? `Gegönnt: ${e.notiz || "etwas Schönes"}` : t0(e); }; }
{ const l0 = listeHTML; listeHTML = function () { let h = ""; try { h = gkHinweisHTML(); } catch (e) { } return h + l0(); }; }
if (typeof kramladenInhalt === "function") { const k0 = kramladenInhalt; kramladenInhalt = function () { const h = k0(); let l = ""; try { l = gkLeiste(); } catch (e) { return h; } const m = '<div class="laden-chips-rahmen">'; return h.includes(m) ? h.replace(m, l + m) : l + h; }; }
if (typeof plaketteMalen === "function") { const p0 = plaketteMalen; plaketteMalen = function (n, zwang) { p0(n, zwang); try { gkPlakette(); } catch (e) { } }; }
