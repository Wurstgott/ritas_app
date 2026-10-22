/* ============================================================
   Lichtung – Steuerung: Rendern, ein Klick-Handler, Aktionen
   ============================================================ */
function themaAnwenden() {
  const r = document.documentElement;
  r.dataset.size = S.size;
  if (S.theme === "auto") delete r.dataset.theme; else r.dataset.theme = S.theme;
  if (S.motion === "ruhig") r.dataset.motion = "ruhig"; else delete r.dataset.motion;
}
function render(opt = {}) {
  themaAnwenden();
  const main = $("#main");
  const offen = $$("details[open]", main).map(d => d.dataset.id).filter(Boolean);
  const y = scrollY;
  const views = { heute: viewHeute, ideen: viewIdeen, lichtung: viewLichtung, tagebuch: viewTagebuch };
  main.innerHTML = `<div class="ansicht${opt.ohneAnim ? "" : ""}" style="${opt.ohneAnim ? "animation:none" : ""}">${views[TAB]()}</div>`;
  offen.forEach(id => { const d = $(`details[data-id="${id}"]`, main); if (d) d.open = true; });
  $("#tabs").innerHTML = TABS.map(t => `<button data-tab="${t.id}" ${TAB === t.id ? 'aria-current="page"' : ""}>${ic(t.icon)}<span>${t.name}</span></button>`).join("");
  if (opt.halteScroll) scrollTo(0, y);
  if (!SHEETS.length && (document.activeElement === document.body || !document.activeElement || !document.contains(document.activeElement))) { const z = (opt.fokus && $(opt.fokus, main)) || null; if (z) z.focus({ preventScroll: true }); }
  bilderZeichnen(opt.neu);
  figurenMalen();
  const lg = $("#logo"); if (lg && !lg.firstChild) lg.innerHTML = ritaSVG(72);
  armHaptics();
}
function bilderZeichnen(neu) {
  const c1 = $("#bild-heute"), c2 = $("#bild-gross");
  requestAnimationFrame(() => {
    if (c1) bildMitAnkunft(c1, neu);
    if (c2) bildMitAnkunft(c2, neu);
  });
}
function wechsleTab(id) {
  if (TAB === id) { scrollTo({ top: 0, behavior: REDUCED() ? "auto" : "smooth" }); return; }
  TAB = id; alleSheetsZu(); $$(".toast").forEach(t => t.remove()); $$(".ereignis:not(.weg)").forEach(ereignisWeg); render(); scrollTo(0, 0);
  if (id === "heute" && window._bingoTanz) setTimeout(() => { try { bingoTanz(); } catch (e) { } }, 500);
  haptik("auswahl");
}

/* ---------- Eintragen ---------- */
function eintragSpeichern(entwurf, altId) {
  const t = tat(entwurf.t);
  if (altId && !S.eintraege.some(x => x.id === altId)) altId = null; // veralteter Knopf: nicht den letzten Eintrag löschen
  const vorherStufe = stufe(), vorherModell = modell();
  const e = { ...entwurf };
  delete e.notizOffen; delete e.tagOffen;
  e.id = altId || ("e" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36));
  e.ts = e.ts || Date.now(); e.rv = RV;
  e.tf = S.tf[e.tag] || "";
  e.stern = !!(t.stern || e.tf === "C" || e.tf === "D");
  if (t.art !== "km") delete e.km; if (!["min", "person"].includes(t.art) && e.t !== "timer") { if (t.art !== "min") delete e.min; }
  if (t.art !== "person") delete e.person;
  if (e.wie === "zuviel") e.zuViel = true;
  if (e.wie) S.nachherTag = heute();
  if (e.person === "_") e.person = "";
  // Doppel-Schutz: identischer Eintrag innerhalb 3 s
  const l = S.eintraege[S.eintraege.length - 1];
  if (!altId && l && l.t === e.t && Date.now() - l.ts < 3000 && l.km === e.km && l.min === e.min && l.notiz === e.notiz && l.person === e.person && l.listeId === e.listeId) return null;
  let alt = null;
  if (altId) { const i = S.eintraege.findIndex(x => x.id === altId); alt = S.eintraege[i]; S.eintraege.splice(i, 1); S.taler -= (alt.taler || 0); }
  const vorher = S.eintraege.filter(x => x.tag === e.tag);
  e.w = rechneWirkung(e, vorher);
  if (altId && alt) e.w = Math.max(e.w, 0); // Festschreiben: neu gerechnet nur für die geänderte Eingabe
  e.taler = typeof talerGanz === "function" ? talerGanz(e.w / 4) : e.w / 4; // ganze Taler, Rest wird gesammelt (skins.js)
  S.eintraege.push(e);
  S.eintraege.sort((a, b) => a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : a.ts - b.ts);
  S.taler += e.taler;
  const neuSt = stufeVon(wSumme());
  if (neuSt > S.maxStufe) S.maxStufe = neuSt;
  // Missionen: passende Tätigkeit trägt den Tag ein
  for (const a of S.missionen.aktiv) { const m = (D.missionen || []).find(x => x.id === a.id); if (m && m.t === e.t) { a.tage = a.tage || []; if (!a.tage.includes(e.tag)) a.tage.push(e.tag); } }
  speichern();
  return { e, vorherStufe, nachStufe: stufe(), neuKey: neuSchluessel(e, vorherModell) };
}
function neuSchluessel(e, M) {
  const t = tat(e.t);
  if (e.t === "ausflug") return "horizont:" + (e.ziel || "eigen:" + e.titel);
  if (t.bild === "fenster" || (e.person && t.feld === "menschen")) return "fenster:" + (e.person || "_");
  if (e.t === "tanzstunde") return "fuss:" + Math.min(M.tanzStunden, 23);
  if (t.bild === "tanz") return "laterne:" + Math.min(M.musik + M.tanzStunden, 15);
  if (e.t === "buchfertig") return "buch:" + Math.min(M.buecher.length, 15);
  if (t.bild === "eiche") return "eiche";
  if (t.bild === "quelle") return "quelle";
  if (t.bild === "wiese") return "wiese:" + Math.min(M.wiese, 69);
  if (t.bild === "weg") return "weg";
  if (t.bild === "mut" || e.mut) return "mut:" + Math.min(M.mut, 29);
  return null;
}
const NACH_HAK = [[/anruf|telefon|ruf .* an|\banrufen/i, "telefon"], [/\blesen\b|kapitel|buch/i, "lesen"], [/spazier|runde|gehen|\bkm\b/i, "gehen"], [/tagebuch/i, "tagebuch"], [/tanz/i, "tanzstunde"], [/besuch|kaffee mit|treffen/i, "besuch"]];
function nachEintrag(r, text) {
  if (!r) { alleSheetsZu(); render({ halteScroll: true, ohneAnim: true }); toast("Steht schon drin."); return; } // Doppelschutz: nicht stumm bleiben
  const { e, vorherStufe, nachStufe, neuKey } = r;
  const t = tat(e.t);
  const info = e.t === "ausflug" ? (e.umgekehrt ? "Umgekehrt – zählt genauso." : "Am Horizont steht jetzt ein neuer Ort.") : waehle(t.info || ["Eingetragen. Das zählt."], e.id);
  const ort = e.t === "ausflug" ? "horizont" : e.t === "tagebuch" ? "tagebuch" : e.t === "abgehakt" ? "abgehakt" : e.t === "ruheuebung" ? "ruhe" : (e.mut ? "mut" : tat(e.t).bild);
  const huhn = S.huhn ? (e.t === "hofladen" ? huehnchenReagiert("hofladen") : huehnchenReagiert(ort)) : "";
  try { eierEintrag(e); } catch (err) { }
  // Besuche kommen nicht mehr nach Einträgen, nur beim Öffnen – die Belohnung soll für sich stehen
  const taler = Math.round(e.taler * 10) / 10;
  alleSheetsZu();
  haptik("erfolg"); ton("erfolg");
  render({ neu: neuKey, halteScroll: true, ohneAnim: true });
  const talerTxt = taler >= .5 ? `+${Math.max(1, Math.round(taler))} Taler` : "";
  const auchNeu = [];
  if (e.t === "ausflug" && !S.leiter.neuland[e.leiter] && !e.umgekehrt) { S.leiter.neuland[e.leiter] = e.tag; const bonus = 5 * e.leiter; S.taler += bonus; auchNeu.push(`Zum ersten Mal: „${(D.leiter[e.leiter - 1] || {}).name || "neuer Ausflug"}“ (+${bonus} Taler)`); speichern(); }
  if (e.t === "buchfertig" && !S.meilensteine.buch) { S.meilensteine.buch = e.tag; auchNeu.push("das erste Lesezeichen an der Eiche"); speichern(); }
  window._auchNeu = auchNeu;
  const neueStufe = nachStufe > (S.gesehenStufe || 0) && !(S.stufeGemeldet >= nachStufe);
  if (neueStufe) { S.stufeGemeldet = nachStufe; speichern(); haptik("stufe"); }
  let knopf = neueStufe ? { text: "Ansehen", act: "stufe-zeigen" } : null;
  if (!knopf && e.t === "abgehakt") { const m = NACH_HAK.find(([re]) => re.test(e.notiz || "")); if (m) { window._nachHak = m[1]; knopf = { text: `Auch als „${tat(m[1]).kurz}“ eintragen`, act: "nach-hak" }; } }
  // Rückmeldung immer gleich gebaut: 1. was eingetragen wurde  2. ein Satz (Hühnchen, sonst Max’ Info)  3. Taler und Neues im Bild
  const satz = e.t === "abgehakt" && !huhn ? "" : (huhn ? "Hühnchen: „" + huhn + "“" : info);
  const lohn = [talerTxt, neueStufe ? `Neue Stufe im Bild: ${D.stufen[nachStufe].name}` : (auchNeu.length ? `Neu: ${auchNeu.join(", ")}` : "")].filter(Boolean).join(" · ");
  toast([text || "Eingetragen.", satz, lohn].filter(Boolean).join("\n"), { rueck: e.id, erfolg: true, knopf, dauer: knopf ? 12000 : e.t === "abgehakt" ? 6000 : undefined });
  const buehne = $("#buehne-heute") || $("#buehne-gross");
  if (buehne && neuKey) setTimeout(() => ringAn(buehne, neuKey.split(":")[0] === "fuss" || neuKey.startsWith("laterne") ? "tanz" : neuKey.split(":")[0] === "buch" ? "eiche" : neuKey.split(":")[0]), REDUCED() ? 0 : 1200);
}
function eintragLoeschen(id, still) {
  const i = S.eintraege.findIndex(x => x.id === id); if (i < 0) return;
  const e = S.eintraege[i]; S.eintraege.splice(i, 1);
  if (e.t === "abgehakt") { const x = (S.liste || []).find(y => y.eintrag === id || (e.listeId && y.id === e.listeId)); if (x) { delete x.erledigt; delete x.eintrag; } }
  e.talerAb = Math.min(S.taler, e.taler || 0); S.taler -= e.talerAb;
  if (!still) { S.geloescht.push({ ...e, weg: Date.now() }); }
  speichern(); render({ halteScroll: true, ohneAnim: true });
  if (!still) toast("Eintrag gelöscht.", { rueck: "wieder:" + id });
}
function eintragWiederher(id) {
  const i = S.geloescht.findIndex(x => x.id === id); if (i < 0) return;
  const e = S.geloescht.splice(i, 1)[0]; delete e.weg;
  S.eintraege.push(e); S.eintraege.sort((a, b) => a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : a.ts - b.ts);
  if (e.t === "abgehakt" && e.listeId) { const x = (S.liste || []).find(y => y.id === e.listeId); if (x) { x.erledigt = e.tag; x.eintrag = e.id; } }
  S.taler += e.talerAb ?? e.taler ?? 0; delete e.talerAb; speichern(); render({ halteScroll: true, ohneAnim: true });
}

/* ---------- Sicherung ---------- */
function sicherungText() { return JSON.stringify({ app: "lichtung", gv: GV, gesichert: new Date().toISOString(), S }); }
function sicherungPruefen(txt) {
  try { const o = JSON.parse(txt.trim()); const s = o.S || o; if (!s || typeof s !== "object" || !Array.isArray(s.eintraege) || !(o.app === "lichtung" || o.app === "ritas-app" || s.gv)) throw 0; if (!s.eintraege.every(e => e && typeof e.t === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.tag || ""))) throw 0; return s; } catch (e) { return null; }
}
function sicherungFrage(s) {
  sheet({ titel: "Sicherung einspielen", inhalt: `<p>Diese Sicherung enthält <span style="font-weight:700">${s.eintraege.length} ${s.eintraege.length === 1 ? "Eintrag" : "Einträge"}</span> für ${esc(s.name || "—")}.</p><p>Sie ersetzt alles, was jetzt auf diesem Handy ist (${S.eintraege.length} ${S.eintraege.length === 1 ? "Eintrag" : "Einträge"}).</p><button class="knopf zweit voll" data-act="sichern-kopie">Vorher aktuellen Stand kopieren</button>`,
    fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="einspielen-ja">Ja, einspielen</button><button class="knopf leise" data-act="sheet-zu">Abbrechen</button></div>` });
  window._import = s;
}
async function kopieren(text, meldung = "Kopiert.") {
  try { await navigator.clipboard.writeText(text); toast(meldung); }
  catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast(meldung); } catch (x) { toast("Kopieren ging nicht. Bitte lange auf den Text tippen."); } ta.remove(); }
}
function dateiSpeichern() {
  const blob = new Blob([sicherungText()], { type: "application/json" });
  const name = `ritas-app-sicherung-${heute()}.json`;
  const f = new File([blob], name, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: "Ritas App – Sicherung" }).then(() => { S.letzteSicherung = heute(); speichern(); }).catch(() => { }); return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  S.letzteSicherung = heute(); speichern(); toast("Sicherung gespeichert. Wenn kein Download kommt: „Sicherung kopieren“.");
}

/* ---------- Ein Klick-Handler für alles ---------- */
document.addEventListener("click", ev => {
  const el = ev.target.closest("[data-act],[data-tab]"); if (!el) return;
  if (el.disabled || gesperrt(el)) return;
  if (el.dataset.tab) { wechsleTab(el.dataset.tab); if (el.dataset.tab === "heute") try { ereignisPruefen("tab"); } catch (e) { } return; }
  const a = el.dataset.act, d = el.dataset;
  // Füllung vom Fingerpunkt bei Auswahl
  if ((el.classList.contains("tf") || el.classList.contains("chip")) && !REDUCED()) { const r = el.getBoundingClientRect(); el.style.setProperty("--x", (ev.clientX - r.left) + "px"); el.style.setProperty("--y", (ev.clientY - r.top) + "px"); }
  aktion(a, d, el, ev);
});
document.addEventListener("keydown", ev => {
  if (ev.key === "Enter" && ev.target.id === "eig") { ev.preventDefault(); const k = $("[data-act=eigen-weiter]"); aktion("eigen-weiter", k ? k.dataset : {}, ev.target, ev); return; }
  if (ev.key === "Enter" && ev.target.id === "liste-neu") { ev.preventDefault(); aktion("liste-neu", {}, ev.target, ev); return; }
  if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches(".schalter-zeile")) { ev.preventDefault(); ev.target.click(); }
});
document.addEventListener("input", ev => {
  const el = ev.target;
  if (el.dataset.feld && E) { E[el.dataset.feld] = el.value; }
  if (el.dataset.einst) { S[el.dataset.einst] = el.value.trim() || (el.dataset.einst === "name" ? "Rita" : ""); speichern(); }
  if (el.dataset.lb) { S.lebensbuch[el.dataset.lb] = el.value; speichern(); }
  if (el.dataset.geburtstag) { const m = /^(\d{1,2})\.(\d{1,2})/.exec(el.value.trim()); S.geburtstag = m ? `${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : ""; speichern(); }
  if (el.dataset.listeText) { const x = (S.liste || []).find(y => y.id === el.dataset.listeText); if (x && el.value.trim()) { x.text = el.value.trim().slice(0, 120); speichern(); } }
});
document.addEventListener("change", ev => {
  const el = ev.target;
  if (el.dataset.actFile === "import" && el.files[0]) { const fr = new FileReader(); fr.onload = () => { const s = sicherungPruefen(fr.result); if (s) sicherungFrage(s); else toast("Diese Datei ist keine Sicherung von Ritas App."); }; fr.readAsText(el.files[0]); }
});

function aktion(a, d, el, ev) {
  switch (a) {
    /* Allgemein */
    case "sheet-zu": sheetZu(); break;
    case "toast-zu": $$(".toast").forEach(t => t.remove()); break;
    case "toast-daumen": { const t = el.closest(".toast"), r = el.getBoundingClientRect(); S.daumen = (S.daumen || 0) + 1; speichern(); haptik("erfolg");
      const n = 1 + (Math.random() < .25 ? 2 : 0); for (let i = 0; i < n; i++) { const f = document.createElement("div"); f.className = "daumen-flug"; f.innerHTML = DAUMEN_SVG; f.style.left = (r.left + r.width / 2 - 20 + (i - (n - 1) / 2) * 34) + "px"; f.style.top = (r.top - 10) + "px"; f.style.animationDelay = i * 90 + "ms"; document.body.appendChild(f); setTimeout(() => f.remove(), 1500); }
      if (t) { t.classList.add("weg"); setTimeout(() => t.remove(), 260); }
      if (S.huhn && Math.random() < .35) { S.huhnSagt = { tag: heute(), text: ["Daumen hoch! Ich hab keinen, aber ich hätte einen gehoben.", "Ich nehm den Daumen als Applaus.", "Daumen gesehen. Gut gemacht."][Math.floor(Math.random() * 3)] }; speichern(); setTimeout(() => render({ halteScroll: true, ohneAnim: true }), 300); }
      break; }
    case "toast-rueck": {
      const t = el.closest(".toast"), r = t && t._rueck; t && t.remove();
      if (!r) break;
      if (r.startsWith("wieder:")) eintragWiederher(r.slice(7));
      else if (r.startsWith("kauf:")) { const id = r.slice(5), x = D.laden.find(y => y.id === id); if (S.gekauft[id]) { delete S.gekauft[id]; S.taler += x.preis; S.talerAusgegeben -= x.preis; speichern(); render({ halteScroll: true, ohneAnim: true }); toast("Rückgängig gemacht. Die Taler sind wieder da."); } }
      else { eintragLoeschen(r, true); toast("Rückgängig gemacht."); }
      haptik("achtung"); break;
    }
    case "go": if (d.go === "einstellungen") einstellungenSheet(); break;

    /* Tagesform */
    case "tf": S.tf[heute()] = d.v; if (S.huhn) S.huhnSagt = { tag: heute(), text: { A: "Mehr Energie? Dann halt ich hier die Stellung, und du ziehst los.", B: "Gemächlich? Mein Tempo. Ich hab ja nur das eine.", C: "Ruhig angehen. Da bin ich Profi, ich steh seit Jahren still.", D: "Sparflamme. Dann halt ich heute auch mal den Schnabel." }[d.v] }; try { eierTagesform(d.v); } catch (e) { } speichern(); haptik("auswahl"); el.setAttribute("aria-pressed", "true"); el.classList.add("fill-in");
      setTimeout(() => { try { ereignisPruefen("tf"); } catch (e) { } }, 2000); // Besuch erst, wenn die Morgenfrage beantwortet ist
      setTimeout(() => { render({ halteScroll: true, ohneAnim: true }); const f = D.tagesformen.find(x => x.id === d.v); sag(`${f.name} gewählt.`); }, REDUCED() ? 0 : 320); break;
    case "tf-onb": S.tf[heute()] = d.v; speichern(); haptik("auswahl"); sheetInhalt(onboardingInhalt()); break;
    case "tf-aendern": delete S.tf[heute()]; speichern(); render({ halteScroll: true, ohneAnim: true }); break;

    /* Eintragen */
    case "eintragen": eintragenSheet(d.t); break;
    case "alles": alleSheet(); break;
    case "waehle-t": sheetZu(); setTimeout(() => eintragenSheet(d.t), 240); break;
    case "step": { const f = d.f, dd = Number(d.d); E[f] = f === "km" ? clamp(Math.round((E[f] + dd) * 2) / 2, .5, 40) : clamp(E[f] + dd, 5, 300); haptik("auswahl"); sheetInhalt(eintragenInhalt()); break; }
    case "setz": {
      let v = d.v; if (["km", "min", "leiter", "hpKap"].includes(d.f)) v = Number(v);
      if (d.f === "wie" && E.wie === v) v = "";
      E[d.f] = v; haptik("auswahl");
      const id = aktuellesSheet()?.dataset.id;
      sheetInhalt(id === "zurueck" ? zurueckInhalt() : id === "timerneu" ? timerNeuInhalt() : eintragenInhalt());
      if (d.f === "tag" && id === "eintragen") sheetFuss(eintragenFuss()); break;
    }
    case "umschalt": E[d.f] = !E[d.f]; haptik("auswahl"); sheetInhalt(aktuellesSheet()?.dataset.id === "zurueck" ? zurueckInhalt() : eintragenInhalt()); break;
    case "notiz-auf": E.notizOffen = true; sheetInhalt(eintragenInhalt()); setTimeout(() => $("#notiz")?.focus(), 50); break;
    case "tag-auf": E.tagOffen = true; haptik("auswahl"); sheetInhalt(aktuellesSheet()?.dataset.id === "zurueck" ? zurueckInhalt() : eintragenInhalt()); break;
    case "speichern": {
      const t = tat(E.t);
      if (t.art === "buch" && !E.titel.trim()) { toast("Bitte den Buchtitel eintragen."); haptik("achtung"); break; }
      if (t.art === "buch" && D.hp) { const b = D.hp.baende.find(x => x.nr === S.hp.band); if (b && E.titel.trim() === b.titel && D.hp.baende.find(x => x.nr === b.nr + 1)) { S.hp.band = b.nr + 1; S.hp.kapitel = 0; } }
      const alt = E._alt; delete E._alt;
      if (E.hpKap && D.hp) { const b = D.hp.baende.find(x => x.nr === S.hp.band); if (b) { const vorK = S.hp.kapitel; setTimeout(() => { if (vorK < 13 && S.hp.kapitel >= 13) eierKapitel(13); }, 50); S.hp.kapitel = Math.min(b.kapitel, S.hp.kapitel + Number(E.hpKap)); E.notiz = E.notiz || `${b.titel.replace("Harry Potter und d", "D")}, bis Kapitel ${S.hp.kapitel}`; if (S.hp.kapitel >= b.kapitel) E._buchFertig = b.titel; } } delete E.hpKap;
      const fertig = E._buchFertig; delete E._buchFertig;
      const r = eintragSpeichern(E, alt);
      if (fertig && r) { // letztes Kapitel: das Buch kommt als eigener Eintrag dazu, der nächste Band ist dran
        const r2 = eintragSpeichern({ t: "buchfertig", tag: E.tag, titel: fertig });
        const b = D.hp.baende.find(x => x.titel === fertig), n = b && D.hp.baende.find(x => x.nr === b.nr + 1); if (n) { S.hp.band = n.nr; S.hp.kapitel = 0; speichern(); }
        nachEintrag(r2 || r, `Eingetragen: ${eintragText(r.e).replace(/\.$/, "")} – und das Buch ist ausgelesen!`); break; }
      nachEintrag(r, alt ? "Geändert." : `Eingetragen: ${eintragText(r ? r.e : E).replace(/\.$/, "")}.`); break;
    }
    case "eintrag": eintragSheet(d.id); break;
    case "aendern": { if (aktuellesSheet()) sheetZu(); const e = S.eintraege.find(x => x.id === d.id); if (!e) break; if (e.t === "ausflug" || e.t === "planung") { toast("Ausflüge lassen sich löschen und neu eintragen."); break; } eintragenSheet(e.t, { ...e, _alt: e.id, notizOffen: !!e.notiz, wie: e.zuViel ? "zuviel" : e.wie || "" }); break; }
    case "loeschen": if (aktuellesSheet()) sheetZu(); eintragLoeschen(d.id); break;
    case "liste-neu": { const inp = $("#liste-neu"); const t = inp.value.trim(); if (!t) { inp.focus(); break; } S.liste = S.liste || []; S.liste.push({ id: "l" + Date.now().toString(36), text: t, neu: heute() }); speichern(); render({ halteScroll: true, ohneAnim: true }); setTimeout(() => $("#liste-neu")?.focus(), 30); break; }
    case "liste-edit": LISTE_EDIT = !LISTE_EDIT; haptik("auswahl"); render({ halteScroll: true, ohneAnim: true, fokus: '[data-act="liste-edit"]' }); break;
    case "liste-weg": { const i = (S.liste || []).findIndex(y => y.id === d.id); if (i < 0) break; const [weg] = S.liste.splice(i, 1); speichern(); haptik("auswahl"); if (!S.liste.some(y => !y.erledigt)) LISTE_EDIT = false; render({ halteScroll: true, ohneAnim: true, fokus: '[data-act="liste-edit"]' }); toast(`Gelöscht: ${weg.text}`, { dauer: 4000 }); break; }
    case "liste-hak": { const x = (S.liste || []).find(y => y.id === d.id); if (!x) break; x.erledigt = heute(); const r = eintragSpeichern({ t: "abgehakt", tag: heute(), notiz: x.text, listeId: x.id }); x.eintrag = r && r.e.id; speichern(); if (r) nachEintrag(r, `Abgehakt: ${x.text.replace(/[.!?]+$/, "")}.`); else render({ halteScroll: true, ohneAnim: true }); break; }
    case "liste-zurueck": { const x = (S.liste || []).find(y => y.id === d.id); if (!x) break; delete x.erledigt; if (x.eintrag) eintragLoeschen(x.eintrag, true); speichern(); render({ halteScroll: true, ohneAnim: true }); break; }
    case "erklaerung": erklaerungSheet(); break;
    case "post-auf": { const p = postHeute(); if (p && p.extra) S.extraPost.offen = true; else S.postOffen = heute(); } speichern(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); break;
    case "tschuess-los": S.tschuess = { tag: heute(), verlauf: [["rita", "Danke, Max!"], ["max", "Gern! Tschüss!"]], grenze: 2 + Math.floor(Math.random() * 4), n: 0 }; speichern(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); break;
    case "tschuess": { const T = S.tschuess; if (!T || T.ende) break; T.n++; eierTschuess(T.n); T.verlauf.push(["rita", TSCHUESS[Math.floor(Math.random() * TSCHUESS.length)]]); if (T.n >= T.grenze || (T.n >= 2 && Math.random() < .2)) { T.verlauf.push(["max", "Ich leg jetzt auf. Tschüss!"]); T.ende = "max"; } else T.verlauf.push(["max", TSCHUESS[Math.floor(Math.random() * TSCHUESS.length)]]); if (T.verlauf.length > 9) T.verlauf = [...T.verlauf.slice(0, 2), ...T.verlauf.slice(-7)]; speichern(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); break; }
    case "tschuess-auflegen": { const T = S.tschuess; if (!T || T.ende) break; T.verlauf.push(["rita", "Ich leg jetzt auf. Tschüss!"]); T.ende = "rita"; S.tschuessSiege = (S.tschuessSiege || 0) + 1; speichern(); haptik("erfolg"); render({ halteScroll: true, ohneAnim: true }); break; }
    case "liste-hilfe": listeHilfeSheet(); break;
    case "nach-hak": { $$(".toast").forEach(t => t.remove()); const t2 = window._nachHak; if (t2) eintragenSheet(t2); break; }
    case "abend": { const t = tat(d.t), letzte = [...S.eintraege].reverse().find(e => e.t === d.t); const r = eintragSpeichern({ t: d.t, tag: heute(), km: t.art === "km" ? (letzte?.km || 2) : undefined, min: t.art === "min" || t.art === "person" ? (letzte?.min || t.std || 20) : undefined, person: t.art === "person" ? "_" : undefined, notiz: "" }); if (r) nachEintrag(r, `Eingetragen: ${eintragText(r.e)}.`); break; }
    case "abend-weg": S.abendWeg = heute(); speichern(); render({ halteScroll: true, ohneAnim: true }); break;
    case "zettel-weg": if (S.zettel) S.zettel.weg = true; speichern(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); break;
    case "huhn-tap": { const h = el.querySelector(".huhn"); if (h) { h.classList.remove("freut"); void h.getBBox; h.classList.add("freut"); setTimeout(() => h.classList.remove("freut"), 1100); } haptik("auswahl"); eierHuhnTap(); break; }
    case "eier-um": S.eierAus = !S.eierAus; speichern(); sheetInhalt(einstellungenInhalt()); break;
    case "tuer": tuerSheet(d.v); break;
    case "logo": logoSpass(el); break;
    case "post-gelesen": { const p = postHeute(); S.briefe = S.briefe || []; if (p && !S.briefe.some(b => b.tag === heute() && b.text === p.text)) S.briefe.push({ tag: heute(), text: p.text, wer: p.wer }); if (p && p.extra) { S.extraPost.gelesen = true; speichern(); render({ halteScroll: true, ohneAnim: true }); break; } } S.postGelesen = heute(); speichern(); render({ halteScroll: true, ohneAnim: true }); break;
    case "stufe-zeigen": $$(".toast").forEach(t => t.remove()); S.gesehenStufe = stufe(); speichern(); stufeMoment(stufe(), window._auchNeu || []); break;

    /* Hilft / Ideen */
    case "hilft": alleSheetsZu(); hilftSheet(); break;
    case "hilft-neu": sheetZu(); setTimeout(hilftSheet, 240); break;
    case "idee": ideeSheet(d.id); break;
    case "idee-thema": ideenThemaSheet(d.v); break;
    case "idee-erledigt": { const v = (D.stattDaddeln || []).find(x => x.id === d.id); const t = tat(v?.t || "frei"); const ent = { t: t.id, tag: heute(), min: v?.min || t.std || 10, km: t.art === "km" ? 1 : undefined, draussen: !!t.draussen, mut: false, notiz: v?.titel || "" }; if (t.art === "person") ent.person = ""; const r = eintragSpeichern(ent); nachEintrag(r, `Eingetragen: ${v?.titel || t.name}.`); break; }
    case "mischen": S._mischen = (S._mischen || 0) + 1; render({ halteScroll: true, ohneAnim: true }); break;

    /* Timer */
    case "timer-neu": timerNeuSheet(); break;
    case "timer-start": { const v = D.timerVorlagen.find(x => x.id === d.t); alleSheetsZu(); timerStarten(d.t, Number(d.min), d.name || v?.name || tat(d.t).name); break; }
    case "timer-los": { const v = D.timerVorlagen.find(x => x.id === E.t); const kl = E.klang; sheetZu(); timerStarten(E.t, E.min, v?.name || tat(E.t).name, kl); break; }
    case "timer-zeigen": timerSheet(); break;
    case "timer-pause": if (!S.timer) break; S.timer.pause = Date.now(); speichern(); klangStopp(); $("#timer-ansicht").innerHTML = timerAnsicht(); armHaptics(); break;
    case "timer-fort": if (!S.timer) break; S.timer.pauseSum = (S.timer.pauseSum || 0) + (Date.now() - S.timer.pause); S.timer.pause = 0; speichern(); if (S.timer.klang) klangStart(S.timer.klang); $("#timer-ansicht").innerHTML = timerAnsicht(); armHaptics(); break;
    case "timer-weiter": { const T = S.timer; if (!T) break; T.start = Date.now(); T.pauseSum = 0; T.pause = 0; T.gemeldet = false; T.vorher = (T.vorher || 0) + T.min * 60; speichern(); $("#timer-ansicht").innerHTML = timerAnsicht(); timerTick(); armHaptics(); break; }
    case "timer-ende": timerBeenden(); break;

    /* Ausflüge */
    case "ausflug": alleSheetsZu(); ausflugSheet(); break;
    case "leiter": leiterSheet(Number(d.s)); break;
    case "ziel": zielSheet(d.id); break;
    case "eigen-weiter": { const inp = $("#eig"), n = (inp?.value || "").trim(); if (!n) { inp?.focus(); toast("Wohin soll’s gehen?"); break; }
      sheetZu(); setTimeout(() => planNeu({ id: "eigen:" + n, name: n, leiter: Number(d.s) || 1, form: "huegel" }), 240); break; }
    case "eigenes-ziel": sheetZu(); setTimeout(() => { E = null; planNeu({ id: "", name: "", leiter: Number(d.s), form: "huegel" }, true); }, 240); break;
    case "planen": { const z = (D.ausflugsziele || []).find(x => x.id === d.id); planNeu(z); break; }
    case "plan": planSheet(d.id); break;
    case "check": S.checkliste[Number(d.i)].an = !S.checkliste[Number(d.i)].an; speichern(); haptik("auswahl"); $("#checkliste").innerHTML = checklisteHTML(); armHaptics(); break;
    case "wenndann": { const p = S.plaene.find(x => x.status === "geplant" && aktuellesSheet()?.querySelector(`[data-act="losgehen"][data-id="${x.id}"]`)); if (p) { p.wennDann = Number(d.i); speichern(); sheetZu(); setTimeout(() => planSheet(p.id), 240); } break; }
    case "losgehen": { const p = S.plaene.find(x => x.id === d.id); if (!p) break; p.status = "unterwegs"; p.los = Date.now(); S.checkliste.forEach(c => c.an = false); speichern(); alleSheetsZu(); TAB = "heute"; render(); scrollTo(0, 0); toast("Viel Spaß unterwegs! Wenn du zurück bist, tippe auf „Ich bin zurück“."); haptik("erfolg"); break; }
    case "plan-weg": { const p = S.plaene.find(x => x.id === d.id); S.plaene = S.plaene.filter(x => x.id !== d.id); speichern(); alleSheetsZu(); render({ halteScroll: true }); window._planWeg = p; toast("Plan verworfen.", { knopf: { text: "Rückgängig", act: "plan-zurueck" } }); break; }
    case "plan-zurueck": if (window._planWeg) { S.plaene.push(window._planWeg); window._planWeg = null; speichern(); render({ halteScroll: true }); $$(".toast").forEach(t => t.remove()); } break;
    case "ausflug-zurueck": zurueckSheet(d.id); break;
    case "ausflug-nachtragen": alleSheetsZu(); zurueckSheet(null, d.id || null); break;
    case "ausflug-speichern": {
      if (!E.titel.trim()) { toast("Bitte eintragen, wohin es ging."); haptik("achtung"); break; }
      const planId = E.planId; delete E.planId;
      if (!E.ziel) E.ziel = "eigen:" + E.titel.trim();
      const r = eintragSpeichern(E);
      if (planId) S.plaene = S.plaene.filter(x => x.id !== planId);
      S.taler += 3; speichern();
      nachEintrag(r, `Willkommen zurück: ${E.titel}.`); break;
    }
    case "kopieren": kopieren($("#" + d.was).textContent, "Text kopiert."); break;
    case "kopieren-text": kopieren(d.text, "Kopiert."); break;
    case "runden": infoListe("Runden im Forst", D.runden, ["text", "km"]); break;
    case "angebote": angeboteSheet(); break;
    case "praktisch": infoListe("Praktisches für unterwegs", D.praktisch, ["text"]); break;

    /* Lichtung */
    case "laden": alleSheetsZu(); ladenSheet(); break;
    case "kaufen": kaufenFrage(d.id); break;
    case "kaufen-ja": { const x = D.laden.find(y => y.id === d.id); if (talerStand() < x.preis) break; S.taler -= x.preis; S.talerAusgegeben += x.preis; S.gekauft[x.id] = heute(); if (x.id === "patience") S.spiel.marken += 3; speichern(); sheetZu(); haptik("erfolg"); ton("erfolg");
      setTimeout(() => { sheetInhalt(ladenInhalt()); const imBild = x.gruppe === "Wald & Garten"; window._kaufZeigen = imBild ? x.id : null;
        toast(`Freigeschaltet: ${x.name}.${x.id === "rotkehlchen" ? "\nEs kommt am liebsten morgens." : x.id === "sternbilder" ? "\nZu sehen, wenn es dunkel ist." : ""}`, { rueck: "kauf:" + x.id, erfolg: true, knopf: imBild ? { text: "Im Bild ansehen", act: "kauf-zeigen" } : null }); render({ halteScroll: true, ohneAnim: true }); }, 260); break; }
    case "kauf-zeigen": { const id = window._kaufZeigen; $$(".toast").forEach(t => t.remove()); if (!id) break; alleSheetsZu(); if (TAB !== "lichtung") { TAB = "lichtung"; render(); } scrollTo(0, 0);
      setTimeout(() => kaufRing(id), REDUCED() ? 50 : 500); break; }
    case "lesen": leseSheet(d.was); break;
    case "takt": taktSheet(); break;
    case "takt-tanz": { const t = TAENZE.find(x => x.id === d.v); TAKT.tanz = t.id; TAKT.bpm = t.bpm; const an = TAKT.an; taktStopp(); sheetInhalt(taktInhalt()); if (an) { taktStart(); sheetInhalt(taktInhalt()); } break; }
    case "takt-bpm": { TAKT.bpm = clamp(TAKT.bpm + Number(d.d), 40, 200); const an = TAKT.an; if (an) { taktStopp(); taktStart(); } sheetInhalt(taktInhalt()); break; }
    case "takt-an": if (TAKT.an) taktStopp(); else taktStart(); sheetInhalt(taktInhalt()); break;
    case "setzkasten": setzkastenSheet(); break;
    case "andenken": andenkenSheet(Number(d.i)); break;
    case "bildliste": bildListeSheet(); break;
    case "stufen": stufenSheet(); break;
    case "wissen": wissenSheet(); break;
    case "lebensbuch": lebensbuchSheet(); break;

    /* Tagebuch */
    case "moment": momentSheet(); break;
    case "moment-speichern": { const t = $("#moment-text").value.trim(); eierMoment(t); const h = heute(); const neu = !S.momente[h]; if (t) S.momente[h] = t; else delete S.momente[h]; if (t && neu) S.taler += 1; speichern(); sheetZu(); render({ halteScroll: true, ohneAnim: true }); if (t) toast(neu ? "Aufgeschrieben.\n+1 Taler" : "Aufgeschrieben.", { erfolg: true }); break; }
    case "rueckblick": rueckblickSheet(); break;
    case "rueckblick-fertig": { const kw = kwVon(heute()); const neu = !S.rueckblick[kw]; S.rueckblick[kw] = heute(); S.wennDann = $("#vorsatz").value.trim(); if (neu) S.taler += 10; if (S.hinweis.tag === heute()) S.hinweis.zu = true; speichern(); sheetZu(); render({ halteScroll: true, ohneAnim: true }); toast(neu ? "Woche angeschaut.\n+10 Taler" : "Gespeichert.", { erfolg: true }); break; }
    case "tb-mehr": S._tbMehr = true; render({ halteScroll: true, ohneAnim: true }); break;

    /* Hinweis */
    case "hinweis-weg": { if (d.fuerImmer === "1") S.hinweis.weg[d.id] = heute(); S.hinweis.tag = heute(); S.hinweis.zu = true; speichern(); render({ halteScroll: true, ohneAnim: true }); break; }

    /* Missionen */
    case "missionen": missionenSheet(); break;
    case "mission": missionSheet(d.id); break;
    case "mission-wahl": sheetZu(); setTimeout(() => missionSheet(d.id), 240); break;
    case "mission-start": S.missionen.aktiv.push({ id: d.id, start: heute(), tage: [] }); speichern(); sheetZu(); render({ halteScroll: true, ohneAnim: true }); toast("Vorhaben begonnen. Ohne Eile."); break;
    case "mission-heute": { const a = S.missionen.aktiv.find(x => x.id === d.id), m = (D.missionen || []).find(x => x.id === d.id); if (!a.tage.includes(heute())) a.tage.push(heute()); speichern(); sheetZu();
      if (m && m.t) { const t = tat(m.t); const r = eintragSpeichern({ t: t.id, tag: heute(), min: t.std || 15, km: t.art === "km" ? (t.std || 2) : undefined, draussen: !!t.draussen, notiz: m.titel }); nachEintrag(r, `Eingetragen: ${m.titel}.`); } else render({ halteScroll: true }); break; }
    case "mission-fertig": { const m = (D.missionen || []).find(x => x.id === d.id); S.missionen.aktiv = S.missionen.aktiv.filter(x => x.id !== d.id); S.missionen.fertig.push({ id: d.id, tag: heute() }); S.taler += 10; speichern(); sheetZu(); render({ halteScroll: true }); toast(`Vorhaben abgeschlossen: ${m.titel}.\n+10 Taler`, { erfolg: true }); haptik("erfolg"); break; }
    case "mission-pause": S.missionen.aktiv = S.missionen.aktiv.filter(x => x.id !== d.id); speichern(); sheetZu(); render({ halteScroll: true }); toast("Zur Seite gelegt. Es läuft nichts ab."); break;

    /* Lesebegleiter */
    case "kapitel": alleSheetsZu(); setTimeout(() => { eintragenSheet("lesen"); E.hpKap = 1; sheetInhalt(eintragenInhalt()); }, 240); break;
    case "lesebegleiter": lesebegleiterSheet(); break;
    case "band": S.hp.band = Number(d.nr); S.hp.kapitel = 0; speichern(); sheetZu(); setTimeout(lesebegleiterSheet, 240); render({ halteScroll: true, ohneAnim: true }); break;
    case "band-fertig": { const b = D.hp.baende.find(x => x.nr === Number(d.nr)); const r = eintragSpeichern({ t: "buchfertig", tag: heute(), titel: b.titel, notiz: "abgehakt" }); if (S.hp.band === b.nr) { const n = D.hp.baende.find(x => x.nr === b.nr + 1 && !S.eintraege.some(e => e.t === "buchfertig" && e.titel === x.titel)); if (n) { S.hp.band = n.nr; S.hp.kapitel = 0; } } speichern(); nachEintrag(r, `Eingetragen: „${b.titel}“ ausgelesen.`); break; }
    case "kap": { const fertig = hpKapitel(Number(d.d), false); sheetZu(); setTimeout(lesebegleiterSheet, 240);
      if (fertig) { window._bandFertig = fertig.nr; setTimeout(() => toast(`${fertig.titel.replace("Harry Potter und d", "D")} ausgelesen?`, { knopf: { text: "Ins Regal stellen", act: "band-fertig-toast" }, dauer: 12000 }), 420); } break; }
    case "band-fertig-toast": $$(".toast").forEach(t => t.remove()); if (window._bandFertig) { const nr = window._bandFertig; window._bandFertig = null; aktion("band-fertig", { nr: String(nr) }, el, ev); } break;

    /* Spiel */
    case "spiel": alleSheetsZu(); setTimeout(spielStarten, 10); break;
    case "spiel-nochmal": alleSheetsZu(); S.spiel.laufend = null; setTimeout(spielOeffnen, 260); break;
    case "marke-nutzen": markeEinloesen(false); break;
    case "marke-kaufen": markeEinloesen(true); break;
    case "g-stapel": gewaehlt = null; stapelTipp(); spielRender(); break;
    case "g-karte": spielKarteTipp(d.q, d.i); break;
    case "g-leer": if (gewaehlt) spielKarteTipp(d.q, 0); break;
    case "g-zurueck": if (G.hist.length) { const h = JSON.parse(G.hist.pop()); Object.assign(G, h); gewaehlt = null; spielRender(); } break;
    case "g-tipp": { const t = tippHinweis(); if (!t) { toast("Gerade passt nichts mehr. „Neu geben“ ist erlaubt."); break; } toast(t.q === "stock" ? "Tipp: eine Karte vom Stapel ziehen." : "Tipp: Diese Karte kann wandern – einfach antippen."); spielRender(); const sel = t.q === "stock" ? `[data-act="g-stapel"]` : t.q === "waste" ? `[data-q="waste"]` : `[data-q="${t.q}"][data-i="${t.i}"]`; const k = $(sel); if (k) { k.classList.add("hinweis-puls"); k.scrollIntoView({ block: "nearest" }); } break; }
    case "g-auto": automatischLegen(); break;
    case "g-neu": G = neuesSpiel(hash32(S.seed + ":" + Date.now())); gewaehlt = null; spielRender(); break;
    case "g-aufhoeren": spielPausieren(); spielEnde(false); break;

    /* Einstellungen */
    case "einst": { let v = d.v; if (d.k === "size") v = Number(v); if (d.k === "ton") v = v === "1"; S[d.k] = v; speichern(); themaAnwenden(); haptik("auswahl");
      if (aktuellesSheet()?.dataset.id === "onboard") sheetInhalt(onboardingInhalt()); else sheetInhalt(einstellungenInhalt()); render({ halteScroll: true, ohneAnim: true }); break; }
    case "einst-um": S[d.k] = !S[d.k]; speichern(); haptik("auswahl"); sheetInhalt(einstellungenInhalt()); render({ halteScroll: true, ohneAnim: true }); break;
    case "einst-motion": S.motion = S.motion === "ruhig" ? "normal" : "ruhig"; speichern(); themaAnwenden(); sheetInhalt(einstellungenInhalt()); break;
    case "spiel-an": S.spiel.an = !S.spiel.an; speichern(); sheetInhalt(einstellungenInhalt()); render({ halteScroll: true, ohneAnim: true }); break;
    case "spiel-limit": S.spiel.limitNeu = Number(d.v); speichern(); sheetInhalt(einstellungenInhalt()); break;
    case "spiel-frei": S.spiel.frei = !S.spiel.frei; speichern(); sheetInhalt(helferInhalt()); break;
    case "mensch-weg": { const i = Number(d.i), m = S.menschen[i]; S.menschen.splice(i, 1); speichern(); sheetInhalt(einstellungenInhalt()); window._menschWeg = [i, m]; toast(`${m.name} aus der Liste genommen. Einträge bleiben.`, { knopf: { text: "Rückgängig", act: "mensch-zurueck" } }); break; }
    case "mensch-zurueck": if (window._menschWeg) { const [i, m] = window._menschWeg; S.menschen.splice(i, 0, m); window._menschWeg = null; speichern(); sheetInhalt(einstellungenInhalt()); $$(".toast").forEach(t => t.remove()); } break;
    case "person-dazu": { const n = ($("#person-neu")?.value || "").trim(); if (!n) { $("#person-neu")?.focus(); break; } const farben = ["#7A5A9A", "#3F7A6A", "#9A6A3A", "#5A7A9A", "#9A4A5A"]; const id = "m" + Date.now().toString(36); S.menschen.push({ id, name: n.slice(0, 30), rolle: "", farbe: farben[S.menschen.length % farben.length] }); E.person = id; speichern(); haptik("erfolg"); sheetInhalt(eintragenInhalt()); toast(`${n} ist jetzt dauerhaft in der Auswahl.`, { dauer: 3500 }); break; }
    case "mensch-neu": { const inp = $("#neu-mensch"); const n = inp.value.trim(); if (!n) break; const farben = ["#7A5A9A", "#3F7A6A", "#9A6A3A", "#5A7A9A", "#9A4A5A"]; S.menschen.push({ id: "m" + Date.now().toString(36), name: n, rolle: "", farbe: farben[S.menschen.length % farben.length] }); speichern(); sheetInhalt(einstellungenInhalt()); break; }
    case "helfer": helferSheet(); break;
    case "ueber": ueberSheet(); break;
    case "schnell": S.schnellGeaendert = true; S.schnell[Number(d.i)] = d.v; speichern(); sheetInhalt(aktuellesSheet()?.dataset.id === "helfer" ? helferInhalt() : einstellungenInhalt()); render({ halteScroll: true, ohneAnim: true }); break;
    case "sichern-datei": dateiSpeichern(); break;
    case "sichern-kopie": kopieren(sicherungText(), "Sicherung kopiert. Am besten in eine Notiz oder Mail einfügen."); S.letzteSicherung = heute(); speichern(); break;
    case "einspielen-text": { const s = sicherungPruefen($("#import-text").value); if (s) sicherungFrage(s); else { toast("Das sieht nicht wie eine Sicherung von Ritas App aus."); haptik("achtung"); } break; }
    case "einspielen-ja": { if (!window._import) break; const vorher = JSON.stringify(S); S = window._import; window._import = null; try { migrieren(); eigeneRegistrieren(); alleSheetsZu(); render(); } catch (err) { S = JSON.parse(vorher); speichern(); alleSheetsZu(); render(); toast("Diese Sicherung ließ sich nicht lesen. Es bleibt alles, wie es war."); break; } toast("Sicherung eingespielt.", { erfolg: true }); break; }
    case "wiederher": eintragWiederher(d.id); sheetInhalt(helferInhalt()); break;
    case "reset-1": sheet({ titel: "Wirklich alles löschen?", inhalt: `<p>Alle Einträge, das Bild, Taler und Einstellungen auf diesem Handy werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button class="knopf zweit voll" data-act="sichern-kopie">Vorher Sicherung kopieren</button>`, fuss: `<div class="stapel"><button class="knopf voll rand warn" data-act="reset-2">Ja, alles löschen</button><button class="knopf haupt voll" data-act="sheet-zu">Nein, behalten</button></div>` }); break;
    case "reset-2": { S = frisch(); speichern(); eigeneRegistrieren(); alleSheetsZu(); TAB = "heute"; ONB = 1; LISTE_EDIT = false; EINST_OFFEN = new Set(["aussehen"]); render(); setTimeout(onboardingSheet, 350); break; }

    /* Installation */
    case "install": installSheet(); break;
    case "install-andere": sheetZu(); setTimeout(() => installSheet(true), 240); break;
    case "install-spaeter": S.installKarte = tagPlus(heute(), 7); speichern(); render({ halteScroll: true, ohneAnim: true }); break;
    case "install-direkt": if (window._installPrompt) { window._installPrompt.prompt(); window._installPrompt = null; } break;

    /* Einrichtung */
    case "onb-weiter": if (ONB < 3) { ONB++; sheetInhalt(onboardingInhalt()); sheetFuss(onboardingFuss()); aktuellesSheet().querySelector(".sheet-inhalt").scrollTop = 0; } else onboardingFertig(); break;
    case "onb-zurueck": ONB = Math.max(1, ONB - 1); sheetInhalt(onboardingInhalt()); sheetFuss(onboardingFuss()); break;
    case "ton-probe": ton("erfolg", true); break;
    case "spotify-an": S.spotify = !S.spotify; speichern(); sheetInhalt(einstellungenInhalt()); break;
    case "spotify-an-info": S.spotify = true; speichern(); sheetZu(); toast("Spotify eingeschaltet. Bei Hörtipps gibt’s jetzt einen Spotify-Knopf.", { erfolg: true }); break;
    case "spotify-info": spotifyInfoSheet(); break;
    case "wetter": wetterSheet(); break;
    case "ang-luft": S.angLuft = !!el.checked; speichern(); sheetInhalt(angeboteInhalt()); break;
    case "angebot-kat": ANG_KAT = d.v; haptik("auswahl"); sheetInhalt(angeboteInhalt()); aktuellesSheet().querySelector(".sheet-inhalt").scrollTop = 0; break;
    case "angebot-liste": { const x = D.angebote.find(y => y.id === d.id); if (!x) break; S.liste = S.liste || []; const text = angebotKurz(x); if (!S.liste.some(y => !y.erledigt && (y.angebot === x.id || y.text === text))) S.liste.push({ id: "l" + Date.now().toString(36), text, angebot: x.id }); speichern(); haptik("auswahl"); toast(`Steht auf ${A("deiner", "Ihrer")} Liste.`, { erfolg: true, dauer: 4000 }); el.outerHTML = `<p class="klein" style="margin:6px 0 0">${ic("haken")} Steht auf ${A("deiner", "Ihrer")} Liste.</p>`; render({ halteScroll: true, ohneAnim: true }); break; }
    default: if (a && a.startsWith("ruhe-") && typeof ruheAktion === "function") ruheAktion(a, d, el); else if (a && (a.startsWith("eigen") || a.startsWith("eig-"))) eigenAktion(a, d); else if (a === "bingo" || a === "bingo-drinnen") bingoAktion(a, d); else if (a === "bingo-auf") bingoSheet(); else if (a === "raetsel") raetselAktion(d); else if (a === "gutschein") gutscheinSheet(d.id); else if (a && a.startsWith("tel-")) telAktion(a, d); else if (a && a.startsWith("tb-")) tbAktion(a, d); else if (a && a.startsWith("bv-")) bvAktion(a, d, el); else if (a && (a.startsWith("buch-") || a.startsWith("bn-"))) buchAktion(a, d); else if (a && a.startsWith("tv-")) tvAktion(a, d); else if (a && a.startsWith("wi-")) winterAktion(a, d); else if (a && a.startsWith("wunsch-")) wunschAktion(a, d);
  }
}

/* Ring an die Stelle im großen Bild, wo das Gekaufte steht (Koordinaten wie in scene.js) */
function kaufRing(id) {
  const buehne = $("#buehne-gross"); if (!buehne || typeof SZ === "undefined" || !SZ.sk) return;
  const pos = { traenke: [190, 728], igelhaus: [252, 662], haengematte: [211, 630], rotkehlchen: [560, PARK.vorn - 14], rosenbogen: (() => { const [x, y] = wegPunkt(.3); return [x, y - 30]; })(), sternbilder: [500, 120] }[id];
  if (!pos) return;
  const ring = document.createElement("div"); ring.className = "ring";
  ring.style.left = (SZ.ox + pos[0] * SZ.sk) + "px"; ring.style.top = (SZ.oy + pos[1] * SZ.sk) + "px";
  buehne.appendChild(ring); setTimeout(() => ring.remove(), 2500);
  buehne.scrollIntoView({ block: "center", behavior: REDUCED() ? "auto" : "smooth" });
}
function hpKapitel(dd, eintragen) {
  const b = D.hp.baende.find(x => x.nr === S.hp.band);
  const vorher = S.hp.kapitel;
  S.hp.kapitel = clamp(S.hp.kapitel + dd, 0, b.kapitel); speichern();
  // letztes Kapitel über den Stepper: nachfragen, ob das Buch ausgelesen ist
  if (!eintragen) return dd > 0 && vorher < b.kapitel && S.hp.kapitel >= b.kapitel && !S.eintraege.some(e => e.t === "buchfertig" && e.titel === b.titel) ? b : null;
  if (S.hp.kapitel >= b.kapitel) {
    const r = eintragSpeichern({ t: "buchfertig", tag: heute(), titel: b.titel });
    const naechster = D.hp.baende.find(x => x.nr === S.hp.band + 1);
    if (naechster) { S.hp.band = naechster.nr; S.hp.kapitel = 0; speichern(); }
    nachEintrag(r, `Eingetragen: „${b.titel}“ ausgelesen.`);
  } else {
    const r = eintragSpeichern({ t: "lesen", tag: heute(), min: 20, notiz: `${b.titel}, Kapitel ${S.hp.kapitel}` });
    nachEintrag(r, `Kapitel ${S.hp.kapitel} gelesen.`);
  }
}
function planNeu(z, eigen) {
  if (eigen) {
    sheet({ titel: "Eigenes Ziel", inhalt: `<label class="feld" for="eig">Wohin?</label><input id="eig" class="text" placeholder="z. B. Café am Lindenufer">`, fuss: `<button class="knopf haupt voll" data-act="eigen-weiter" data-s="${z.leiter}">Weiter</button>` });
    return;
  }
  const p = { id: "p" + Date.now().toString(36), ziel: z.id, titel: z.name, leiter: z.leiter, form: z.form || "huegel", status: "geplant", wennDann: -1 };
  S.plaene.push(p);
  const vorher = S.eintraege.filter(x => x.tag === heute());
  const e = { t: "planung", tag: heute(), titel: z.name, leiter: z.leiter, id: "e" + Date.now().toString(36), ts: Date.now(), rv: RV };
  e.w = rechneWirkung(e, vorher); e.taler = typeof talerGanz === "function" ? talerGanz(e.w / 4) : e.w / 4; S.eintraege.push(e); S.taler += e.taler;
  speichern(); alleSheetsZu(); setTimeout(() => planSheet(p.id), 240);
  toast("Planen zählt schon. Eingetragen.", { erfolg: true });
}
function timerStarten(tid, min, name, klang) {
  if (S.timer) { toast("Es läuft schon ein Timer."); timerSheet(); return; }
  S.timer = { t: tid, min, name, start: Date.now(), pause: 0, pauseSum: 0, gemeldet: false, klang: klang || "" };
  speichern(); audio(); if (klang) klangStart(klang);
  wachHalten(); timerSheet(); render({ halteScroll: true, ohneAnim: true });
}
/* Während ein Timer läuft, bleibt der Bildschirm an – dann kommt das Signal auch pünktlich */
let WACH = null;
function wachHalten() { if (!S.timer || WACH || !navigator.wakeLock || document.hidden) return; navigator.wakeLock.request("screen").then(w => { WACH = w; w.addEventListener("release", () => { if (WACH === w) WACH = null; }); if (!S.timer) wachLos(); }).catch(() => { }); }
function wachLos() { if (WACH) { const w = WACH; WACH = null; w.release().catch(() => { }); } }
document.addEventListener("visibilitychange", () => { if (!document.hidden && S.timer) wachHalten(); });
function timerBeenden() {
  const T = S.timer; if (!T) return;
  const sek = timerGelaufen() + (T.vorher || 0);
  const min = Math.round(sek / 60);
  S.timer = null; klangStopp(); clearInterval(timerIv); wachLos();
  S.taler += 2; speichern();
  if (min < 1) { alleSheetsZu(); render({ halteScroll: true }); toast("Timer beendet."); return; }
  const t = tat(T.t);
  const eigen = T.name && T.name !== t.name && !D.timerVorlagen.some(v => v.name === T.name);
  const r = eintragSpeichern({ t: t.id, tag: heute(), min: Math.max(min, 1), draussen: false, notiz: eigen ? T.name : "", mut: false });
  nachEintrag(r, `${min} ${min === 1 ? "Minute" : "Minuten"} ${T.name.toLowerCase().startsWith("les") ? "gelesen" : "– " + T.name} – eingetragen.`.replace("– eingetragen", "· eingetragen"));
}

/* ---------- Start ---------- */
function start() {
  // unlesbarer Speicherstand: nicht überschreiben, sondern Rettungsansicht zeigen (Kopie liegt unter „…-defekt-Datum“)
  if (LADEFEHLER) { themaAnwenden(); notfall(LADEFEHLER, true); return; }
  migrieren(); eigeneRegistrieren();
  themaAnwenden();
  // Testzugang: ?t=JJJJ-MM-TTTHH:MM setzt die Uhr (nur für Prüfungen)
  const q = new URLSearchParams(location.search);
  if (q.get("zeit")) { const z = new Date(q.get("zeit")); if (!isNaN(z)) ZEITVERSATZ = z - Date.now(); }
  try { eierTag(); render(); } catch (err) { notfall(err); return; }
  try { ereignisPruefen(); } catch (e) { }
  ["gesturestart", "gesturechange"].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
  postLaden(); try { angeboteAnwenden(); } catch (e) { } angeboteLaden(); tvLaden(); wetterLaden().then(W => { if (W) render({ halteScroll: true, ohneAnim: true }); });
  if (!S.onboard) setTimeout(onboardingSheet, 300);
  else if (S.timer) setTimeout(() => { wachHalten(); if (timerRest() <= 0) timerSheet(); }, 400);
  addEventListener("resize", () => { clearTimeout(window._rs); window._rs = setTimeout(() => bilderZeichnen(), 150); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { try { eierTag(); } catch (e) { } render({ halteScroll: true, ohneAnim: true }); try { ereignisPruefen(); } catch (e) { } } });
  // Bild alle 10 Minuten neu (Sonnenstand)
  setInterval(() => { if (!document.hidden && !SHEETS.length) bilderZeichnen(); }, 600000);
  // Mitternacht bei offener App: „Heute“ auf den neuen Tag umstellen
  window._tag = heute();
  setInterval(() => { if (document.hidden || SHEETS.length || heute() === window._tag) return; window._tag = heute(); try { eierTag(); } catch (e) { } render({ halteScroll: true, ohneAnim: true }); }, 60000);
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); window._installPrompt = e; });
  // Antippen im großen Bild → Ort erklären
  document.addEventListener("click", ev => {
    const c = ev.target.closest("#bild-gross"); if (!c) return;
    const reg = bildRegion(c, ev.clientX, ev.clientY); if (reg) { haptik("auswahl"); ortSheet(reg); }
  });
  // iOS-Haptik für neu gerenderte Elemente nachrüsten
  if (IOS) { let raf = 0; new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(armHaptics); }).observe(document.body, { childList: true, subtree: true }); }
}
try { if ("serviceWorker" in navigator && /github\.io$/.test(location.hostname)) navigator.serviceWorker.register("sw.js"); } catch (e) { }
start();

/* Eingabefeld im Blatt nicht unter der Knopfleiste verstecken */
document.addEventListener("focusin", ev => { if (ev.target.matches("input.text, textarea") && ev.target.closest(".sheet")) setTimeout(() => ev.target.scrollIntoView({ block: "center", behavior: REDUCED() ? "auto" : "smooth" }), 300); });

/* Notfall: Wenn beim Start etwas klemmt, Daten sichern statt leere Seite */
function notfall(err, defekt) {
  let roh = ""; try { roh = localStorage.getItem(KEY) || ""; } catch (e) { }
  $("#main").innerHTML = `<div class="gruss"><h1>Da hat was geklemmt.</h1></div><p>Deine Einträge sind noch da. Ruf am besten Max an. Er kann mit diesem Text alles wiederherstellen:</p><textarea class="text" readonly style="min-height:160px">${esc(roh)}</textarea><button class="knopf zweit voll" style="margin-top:10px" onclick="try{navigator.clipboard.writeText(this.previousElementSibling.value)}catch(e){}">Text kopieren</button><p class="klein">${esc(String(err && err.message || err))}</p>${defekt ? `<p class="klein">Eine Kopie dieses Textes bleibt auf dem Handy gespeichert. Danach kannst du neu anfangen und Max spielt die Daten später wieder ein.</p><button class="knopf leise voll" onclick="try{localStorage.removeItem(KEY)}catch(e){}location.reload()">Neu anfangen (Kopie bleibt)</button>` : ""}`;
}

/* Ritas Gesicht oben links: jedes Antippen eine andere kleine Überraschung */
const LOGO_SPAESSE = ["zwinkern", "huepfen", "brille", "herzen", "drehen", "huhn", "wackeln", "sprech"];
let logoLetzter = "";
function logoSpass(el) {
  if (el.dataset.laeuft) return; el.dataset.laeuft = "1"; setTimeout(() => delete el.dataset.laeuft, 900);
  let a; do { a = LOGO_SPAESSE[Math.floor(Math.random() * LOGO_SPAESSE.length)]; } while (a === logoLetzter); logoLetzter = a;
  haptik("auswahl");
  if (REDUCED()) a = "zwinkern";
  const r = el.getBoundingClientRect();
  if (["zwinkern", "huepfen", "brille", "drehen", "wackeln"].includes(a)) { el.classList.remove(...[...el.classList].filter(c => c.startsWith("a-"))); void el.offsetWidth; el.classList.add("a-" + a); setTimeout(() => el.classList.remove("a-" + a), 2500); return; }
  if (a === "herzen") { for (let i = 0; i < 5; i++) { const h = document.createElement("span"); h.className = "logo-flug"; h.textContent = ["♥", "✿", "♥", "★", "♥"][i]; h.style.color = ["#C8372D", "#E2A93B", "#D9603C", "#5B8A47", "#C8372D"][i]; h.style.left = (r.left + r.width / 2 - 8) + "px"; h.style.top = (r.top + 6) + "px"; h.style.setProperty("--dx", ((i - 2) * 16) + "px"); h.style.animationDelay = (i * 90) + "ms"; document.body.appendChild(h); setTimeout(() => h.remove(), 2000); } return; }
  if (a === "huhn") { const h = document.createElement("span"); h.className = "logo-huhn"; h.innerHTML = huhnSVG({ gr: 30, stimmung: "freut" }); h.style.left = (r.right - 4) + "px"; h.style.top = (r.top + 8) + "px"; document.body.appendChild(h); setTimeout(() => h.remove(), 1900); return; }
  if (a === "sprech") { const t = ["Kitzelt!", "Na, du?", "Ich hab alles im Blick.", "Heute schon gelacht?", "Bitte nicht so fest, ich bin frisch frisiert.", "Huch!", "Hallo, ich bin’s, Rita. Ach, das weißt du ja."][Math.floor(Math.random() * 7)]; const b = document.createElement("span"); b.className = "logo-sprech"; b.textContent = t; b.style.left = (r.left + 4) + "px"; b.style.top = (r.bottom + 6) + "px"; document.body.appendChild(b); setTimeout(() => b.remove(), 2300); }
}

document.addEventListener("click", ev => { if (ev.target.closest && ev.target.closest(".einst-gruppe > summary")) window._einstKlick = Date.now(); }, true);
document.addEventListener("toggle", ev => { const g = ev.target && ev.target.dataset && ev.target.dataset.einstGruppe; if (g) {
  if (ev.target.open) {
    // Akkordeon: immer nur eine Gruppe offen, die geöffnete an den Blattanfang
    EINST_OFFEN = new Set([g]);
    $$("details.einst-gruppe[open]").forEach(x => { if (x !== ev.target) x.open = false; });
    if (Date.now() - (window._einstKlick || 0) < 800) setTimeout(() => ev.target.scrollIntoView({ block: "start", behavior: REDUCED() ? "auto" : "smooth" }), 30);
  } else EINST_OFFEN.delete(g); } }, true);
