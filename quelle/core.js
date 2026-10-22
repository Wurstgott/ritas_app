/* ============================================================
   Lichtung – Kern: Zustand, Rechnen, Rückmeldung, Bausteine
   Build: __BUILD__
   ============================================================ */
"use strict";
const BUILD = "__BUILD__";
const KEY = "lichtung-v1";
const GV = 3;            // Zustandsversion (Migrationen)
const RV = 1;            // Regelversion (wird je Eintrag festgeschrieben)
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sicher = u => /^https:\/\//i.test(typeof u === "string" ? u.trim() : "") ? esc(u.trim()) : ""; // Fremd-URLs nur https
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString("de-DE", { maximumFractionDigits: d });
const REDUCED = () => matchMedia("(prefers-reduced-motion: reduce)").matches || S.motion === "ruhig";
const IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/* ---------- Zeit ---------- */
function tagVon(d = new Date()) { const z = new Date(d); return `${z.getFullYear()}-${String(z.getMonth() + 1).padStart(2, "0")}-${String(z.getDate()).padStart(2, "0")}`; }
function heute() { return tagVon(jetzt()); }
let ZEITVERSATZ = 0;               // für Tests
function jetzt() { return new Date(Date.now() + ZEITVERSATZ); }
function tagDatum(tag) { const [y, m, d] = tag.split("-").map(Number); return new Date(y, m - 1, d, 12); }
function tagPlus(tag, n) { const d = tagDatum(tag); d.setDate(d.getDate() + n); return tagVon(d); }
const WOCHENTAG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONAT = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
function datumLang(tag) { const d = tagDatum(tag); return `${WOCHENTAG[d.getDay()]}, ${d.getDate()}. ${MONAT[d.getMonth()]}`; }
function datumRelativ(tag) {
  const h = heute();
  if (tag === h) return "Heute";
  if (tag === tagPlus(h, -1)) return "Gestern";
  if (tag === tagPlus(h, -2)) return "Vorgestern";
  return datumLang(tag);
}
function tageszeitGruss() {
  const h = jetzt().getHours();
  if (h < 5) return "Gute Nacht";
  if (h < 11) return "Guten Morgen";
  if (h < 14) return "Guten Tag";
  if (h < 18) return "Guten Nachmittag";
  return "Guten Abend";
}
function kwVon(tag) { // ISO-Kalenderwoche als "JJJJ-WW"
  const d = tagDatum(tag); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const n = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - n);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, "0")}`;
}

/* ---------- Deterministischer Zufall ---------- */
function hash32(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = key => mulberry32(hash32(S.seed + ":" + key));
function waehle(arr, key) { return arr[Math.floor(rnd(key)() * arr.length)]; }

/* ---------- Zustand ---------- */
function frisch() {
  return {
    gv: GV, seed: String(Math.floor(Math.random() * 1e9)), start: tagVon(jetzt()),
    onboard: false, name: "Rita", anrede: "du", nachname: "",
    size: 2, theme: "auto", vib: true, ton: false, motion: "normal", huhn: true,
    tf: {},                 // { "JJJJ-MM-TT": "A".."D" } – nur für Vorschläge und ✱, keine Auswertung
    eintraege: [], geloescht: [],
    taler: 0, talerAusgegeben: 0, maxStufe: 0, gesehenStufe: 0,
    gekauft: { patience: true }, menschen: D.menschenStart.map(m => ({ ...m })),
    schnell: D.schnell.slice(),
    hinweis: { tag: "", id: "", weg: {} },
    momente: {}, lebensbuch: {}, wissen: {},
    missionen: { aktiv: [], fertig: [] },
    leiter: { neuland: {} }, plaene: [],
    checkliste: D.checkliste.map(c => ({ ...c, an: false })), liste: [],
    wennDann: "", eigeneT: [],
    ruhe: { hilft: ["fuesse", "wasser", "platz"], eigene: [], leute: [], satz: 0, satzEigen: "", unterwegs: ["pausen", "umdrehen"], unterwegsEigen: [], geuebt: 0 },
    timer: null,
    rueckblick: {},
    spiel: { an: true, frei: false, limit: 4, limitNeu: null, limitAb: "", marken: 0, tag: "", genutzt: 0, geschenkt: 0, laufend: null, restSek: 0, rueckenmotiv: false },
    hp: { band: 4, kapitel: 0 },
    installKarte: "", nachherTag: "", meilensteine: {},
    goenn: { ausgestellt: -1, gesehen: 0, karten: [], ideen: [] }, // Gönn-Karten (goennen.js); -1 = noch nie gezählt
    letzteSicherung: "",
    geburtstag: "12-07", entdeckt: {}, // Briefe von Max (maxbriefe.js)
    maxBriefe: { archiv: [], gbMigr: 0, entMigr: 0, letzteEmpf: "", puste: "", gbTaler: "", benutzt: {} }
  };
}
let LADEFEHLER = null;   // unlesbarer Stand: Rohtext wird gesichert, Notfall-Ansicht statt Überschreiben
function laden() {
  let r = null;
  try { r = localStorage.getItem(KEY); } catch (e) { return null; }
  if (!r) return null;
  try { const o = JSON.parse(r); if (o && typeof o === "object" && !Array.isArray(o)) return o; throw new Error("Kein Spielstand"); }
  catch (e) { try { localStorage.setItem(KEY + "-defekt-" + tagVon(new Date()), r); } catch (x) { } LADEFEHLER = e; return null; }
}
let S = laden() || frisch();
let SPEICHERFEHLER_GEMELDET = false;
function speichern() {
  if (LADEFEHLER) return; // den alten Rohtext nicht überschreiben, solange die Notfall-Ansicht offen ist
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { if (!SPEICHERFEHLER_GEMELDET) { SPEICHERFEHLER_GEMELDET = true; setTimeout(() => { try { toast("Speichern klappt gerade nicht – bitte Max Bescheid sagen."); } catch (x) { } }, 50); } }
}
/* Fehlende oder kaputte Felder rekursiv aus dem frischen Stand auffüllen (null im Soll = beliebig) */
function fuelle(ist, soll) {
  for (const k in soll) {
    const s = soll[k], i = ist[k];
    if (s === null) { if (i === undefined) ist[k] = null; continue; }
    if (i == null || Array.isArray(s) !== Array.isArray(i) || typeof i !== typeof s) ist[k] = structuredClone(s);
    else if (typeof s === "object" && !Array.isArray(s)) fuelle(i, s);
  }
}
function migrieren() {
  try { (S.menschen || []).forEach(x => { if (x.id === "christiane" && x.name === "Jane") x.name = "Christiane"; }); } catch (e) { }
  const f = frisch();
  if (!S || typeof S !== "object" || Array.isArray(S)) S = f;
  const gvAlt = Number(S.gv) || 1;
  if (S.hp && typeof S.hp.band === "string") S.hp.band = Number(S.hp.band);
  fuelle(S, f);
  S.hp.band = clamp(Number(S.hp.band) || 4, 1, 7);
  S.hp.kapitel = Math.max(0, Number(S.hp.kapitel) || 0);
  const TAG = /^\d{4}-\d{2}-\d{2}$/;
  S.eintraege = S.eintraege.filter(e => e && typeof e === "object" && typeof e.t === "string" && TAG.test(e.tag || ""));
  S.liste = S.liste.filter(x => x && typeof x === "object" && typeof x.text === "string");
  // Fremde/kaputte Personen reparieren statt still löschen: Name wird Text, fehlende oder doppelte ids werden neu vergeben
  S.menschen = S.menschen.filter(m => m && typeof m === "object" && !Array.isArray(m));
  { const ids = new Set(); S.menschen.forEach((m, i) => {
      const nm = typeof m.name === "string" || typeof m.name === "number" ? String(m.name) : Array.isArray(m.name) ? m.name.filter(x => typeof x === "string" || typeof x === "number").join(" ") : "";
      m.name = nm.trim() || "Unbekannt";
      let id = typeof m.id === "string" || typeof m.id === "number" ? String(m.id) : ""; if (!id) id = "m-rep" + i;
      if (ids.has(id)) { let k = 2; while (ids.has(id + "-" + k)) k++; id = id + "-" + k; }
      ids.add(id); m.id = id; }); }
  S.eintraege.forEach(e => { if (typeof e.person === "number") e.person = String(e.person); });
  S.menschen.forEach(m => { if (typeof m.rolle !== "string") m.rolle = ""; if (m.avatar != null && (typeof m.avatar !== "object" || Array.isArray(m.avatar) || (typeof avatarGueltig === "function" && !avatarGueltig(m.avatar)))) delete m.avatar; }); // Gesicht (avatar.js): Kaputtes fällt auf die Initiale zurück
  S.menschen.forEach((m, i) => { if (typeof m.farbe !== "string" || !/^#[0-9a-f]{6}$/i.test(m.farbe)) m.farbe = ["#7A5A9A", "#3F7A6A", "#9A6A3A", "#5A7A9A", "#9A4A5A"][i % 5]; });
  S.plaene = S.plaene.filter(p => p && typeof p === "object" && p.id && D.leiter && D.leiter[Number(p.leiter) - 1]);
  S.missionen.aktiv = S.missionen.aktiv.filter(a => a && typeof a === "object" && a.id).map(a => ({ ...a, tage: Array.isArray(a.tage) ? a.tage : [] }));
  if (!Number.isFinite(S.taler)) S.taler = 0;
  { const g = S.goenn; // Gönn-Karten: defensiv aufräumen
    if (!Number.isFinite(g.ausgestellt)) g.ausgestellt = -1; else g.ausgestellt = Math.max(-1, Math.floor(g.ausgestellt));
    if (!Number.isFinite(g.gesehen)) g.gesehen = 0;
    g.karten = g.karten.filter(k => k && typeof k === "object" && typeof k.id === "string" && typeof k.text === "string" && k.text && TAG.test(k.tag || "")).map(k => ({ ...k, nr: Number.isFinite(k.nr) ? k.nr : 0, idx: Number.isFinite(k.idx) ? k.idx : 0, z: typeof k.z === "string" ? k.z : "" }));
    g.ideen = [...new Set(g.ideen.filter(t => typeof t === "string" && t.trim()).map(t => t.trim().slice(0, 90)))].slice(0, 80); }
  S.gekauft.patience = true;
  if (!S.eintraege.some(e => e.person === "tanzschueler")) S.menschen = S.menschen.filter(m => m.id !== "tanzschueler");
  if (Array.isArray(S.checkliste) && !S.checkliste.some(c => c.id === "maske")) { const i = S.checkliste.findIndex(c => c.id === "desinf"); S.checkliste.splice(i < 0 ? S.checkliste.length : i, 0, { id: "maske", text: "FFP2-Maske eingesteckt (und eine Ersatzmaske)", an: false }); }
  if (Array.isArray(S.checkliste)) S.checkliste = S.checkliste.filter(c => c.eigen || !["wc", "euro"].includes(c.id)); // Toiletten sind kein Thema (Max)
  if (Array.isArray(S.checkliste)) S.checkliste.forEach(c => { const neu = (D.checkliste || []).find(x => x.id === c.id); if (neu && c.text !== neu.text && !c.eigen) c.text = neu.text; });
  if (gvAlt < 3) { if (S.hp && S.hp.band < 4 && !S.hp.kapitel && !S.eintraege.some(e => e.t === "buchfertig" && /Harry Potter/.test(e.titel || ""))) S.hp.band = 4; if (!Array.isArray(S.buecherEigen)) S.buecherEigen = []; }
  if (!Array.isArray(S.buecherEigen)) S.buecherEigen = [];
  if (gvAlt < 2) { const i = S.schnell.indexOf("tanzstunde"); if (i >= 0 && !S.schnellGeaendert) S.schnell[i] = "tagebuch"; }
  S.gv = GV;
  // künftige Migrationen: if (gvAlt < 4) { … }  (gvAlt = Stand vor dem Auffüllen)
  // Papierkorb: älter als 30 Tage endgültig weg
  const grenze = Date.now() - 30 * 864e5;
  S.geloescht = (S.geloescht || []).filter(e => (e.weg || 0) > grenze);
  if (typeof skinsMigrieren === "function") try { skinsMigrieren(); } catch (e) { } // Kleiderschrank, Bild-Spielereien (skins.js)
  if (typeof mbMigrieren === "function") try { mbMigrieren(); } catch (e) { } // Briefe von Max, Geburtstag (maxbriefe.js)
  speichern();
}

/* ---------- Anrede ---------- */
function A(du, sie) { return S.anrede === "sie" ? sie : du; }

/* ---------- Rechnen: Wirkung & Taler ---------- */
const Dosis = m => 10 * Math.log2(1 + m / 10);
const REIHE = [1, .8, .6, .4, .2, 0];
const tat = id => D.taetigkeiten.find(t => t.id === id) || { id, name: id, feld: "geist", bild: "wiese", art: "min", icon: "stern" };
const eintraegeAm = tag => S.eintraege.filter(e => e.tag === tag);

function minutenVon(e) {
  const t = tat(e.t);
  if (t.art === "km") return Math.min((e.km || 0) * 15, 90);
  return e.min || 0;
}
/* Berechnet Wirkung für einen neuen Eintrag e, gegeben die schon vorhandenen Einträge desselben Tages */
function rechneWirkung(e, vorher) {
  const t = tat(e.t);
  let w = 0;
  if (e.t === "ausflug") { const n = vorher.filter(x => x.t === "ausflug").length; w = (12 + 5 * (e.leiter || 1)) * [1, .5, 0][Math.min(n, 2)]; }
  else if (e.t === "planung") w = vorher.some(x => x.t === "planung") ? 0 : 4 + (e.leiter || 1);
  else if (t.art === "klein") {
    const n = vorher.filter(x => tat(x.t).art === "klein").length;
    w = n < 5 ? 3 : 0;
  } else if (t.art === "fest" || t.art === "buch") w = t.w || 10;
  else {
    const m = minutenVon(e);
    if (m < 5) { const n = vorher.filter(x => tat(x.t).art === "klein").length; w = n < 5 ? 3 : 0; }
    else {
      const felder = [[t.feld, m]]; if (t.neben) felder.push([t.neben, m / 2]);
      for (let [f, mm] of felder) {
        const F = D.felder[f];
        if (F.maxMin) { // Für mich sorgen: max. 45 Min. pro Tag zählen
          const schon = vorher.reduce((s, x) => { const tx = tat(x.t); return s + (tx.feld === f ? minutenVon(x) : tx.neben === f ? minutenVon(x) / 2 : 0); }, 0);
          mm = Math.max(0, Math.min(mm, F.maxMin - schon));
        }
        if (mm <= 0) continue;
        const n = vorher.filter(x => tat(x.t).feld === f).length;
        w += F.gewicht * Dosis(mm) * (e.draussen ? 1.25 : 1) * REIHE[Math.min(n, 5)];
      }
    }
  }
  if (e.mut && !vorher.some(x => x.mut)) w += 5;
  if (e.anstrengend && vorher.filter(x => x.anstrengend).length < 2) w += 3;
  return Math.round(w * 10) / 10;
}
const wSumme = () => S.eintraege.reduce((s, e) => s + (e.w || 0), 0);
function stufeVon(w) { let s = 0; D.stufen.forEach((st, i) => { if (w >= st.w) s = i; }); return s; }
function stufe() { return Math.max(S.maxStufe || 0, stufeVon(wSumme())); }
function talerStand() { return Math.floor(S.taler + 1e-9); }

/* ---------- Bildmodell: aus den Einträgen abgeleitet ---------- */
function modell() {
  const m = { km: 0, gehenN: 0, menschen: {}, tanzStunden: 0, musik: 0, leseMin: 0, buecher: [], ruhe: 0, wiese: 0, ausfluege: [], mut: 0, baenke: 0, letzte: null, sterne: 0 };
  const zielZahl = {};
  for (const e of S.eintraege) {
    const t = tat(e.t);
    if (e.t === "ausflug") {
      const z = e.ziel || "eigen:" + (e.titel || "");
      zielZahl[z] = (zielZahl[z] || 0) + 1;
      if (zielZahl[z] === 1) m.ausfluege.push({ ziel: z, form: e.form || "huegel", titel: e.titel, tag: e.tag, andenken: e.andenken, id: e.id, notiz: e.notiz });
      else { const a = m.ausfluege.find(a => a.ziel === z); if (a) a.mal = zielZahl[z]; }
    }
    else if (t.bild === "weg") { m.km += t.art === "km" ? (e.km || 0) : (e.min || 0) / 15; m.gehenN++; }
    else if (t.bild === "fenster" || (e.person && t.feld === "menschen")) { const p = e.person || "_"; m.menschen[p] = (m.menschen[p] || 0) + 1; }
    if (e.t === "tanzstunde") m.tanzStunden++;
    else if (t.bild === "tanz") m.musik++;
    if (t.bild === "eiche") m.leseMin += e.min || (t.art === "buch" ? 0 : 5);
    if (e.t === "buchfertig") m.buecher.push({ titel: e.titel || "Ein Buch", tag: e.tag, farbe: e.farbe || 0 });
    if (t.bild === "quelle") m.ruhe++;
    if (t.bild === "wiese") m.wiese++;
    if (e.mut || t.mut) m.mut++;
    if (e.zuViel) m.baenke++;
    if (e.stern) m.sterne++;
  }
  const l = S.eintraege[S.eintraege.length - 1];
  if (l) m.letzte = l.zuViel ? "bank" : (l.t === "ausflug" ? "horizont" : tat(l.t).bild);
  m.stufe = stufe();
  m.gekauft = S.gekauft;
  return m;
}

/* ---------- Haptik ---------- */
const VIB = { atemaus: [8, 80, 8], auswahl: 10, aktion: 12, erfolg: [10, 60, 14], achtung: [24, 60, 24], stufe: [12, 60, 12, 60, 30], taler: [6, 45, 8] };
/* Während eines Tipps sammelt feedback.js (fbMelde) die Wünsche und gibt danach GENAU EINE Rückmeldung:
   Erfolg/Fehler/Stufe aus dem Handler schlagen die Familie des Elements (Auswahl 10, Aktion 12, Navigation/Schalter –). */
function haptik(art) {
  if (typeof fbMelde === "function" && fbMelde(art)) return;
  vibriere(art);
}
function vibriere(art) {
  if (!S.vib || REDUCED()) return;
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return; // ohne Nutzergeste blockt der Browser ohnehin
  try { if (navigator.vibrate) navigator.vibrate(VIB[art] || 10); } catch (e) { }
}
/* iOS: echter Schalter unter einem label erzeugt den System-Tick (ab iOS 18) */
const HAPSEL = ".rg-knopf,.rg-skip,.rg-muenze,.rg-huhn,.rg-einst,.c-entdecken,.c-fach,.c-kasten,.c-ruhe-kachel,.link-knopf,button.umschlag,.buehne button.ueber,.mb-torte,.mb-umschlag,.av-wahl,.av-farbe,.av-knopf,.ks-teil,.ks-fig,.ks-karte,.taler-plakette,.laden-schrank,.bild-wetter-knopf,.mem-karte,.wetter-chip,.tel-leiste,.tuer-gross,.notfall-leiste,.tel-kontakt,.tel-karte-knopf,.goenn-leiste,.ware-kachel:not(.bald-kachel),.laden-tuer,.muenze-knopf,.ks-punkt,.schaufenster,.exkurs-karte,.bingo-feld,.huhn-karte,.tuer,.logo-knopf,.knopf,.kachel,.tf,.chip,.liste-zeile,nav.tabs button,.karte:not(.zu),.fach:not(.leer),.schalter-zeile";
function armHaptics() {
  if (!IOS) return;
  // Vibration aus oder Bewegung reduziert: keine Haptik, auch kein iOS-Tick
  if (!S.vib || REDUCED()) { $$("label.hap").forEach(l => l.remove()); return; }
  $$(HAPSEL).forEach(el => {
    if (el.querySelector(":scope>label.hap") || el.disabled) return;
    // Kein Label über eigenen Knöpfen/Feldern (sonst schluckt es auf dem iPhone deren Tipps) und keins auf Zeilen ohne Aktion
    if (el.querySelector("button, a[href], input:not([switch]), select, textarea, [data-act], [data-tab]")) return;
    if (el.matches(".liste-zeile") && !el.matches("button, a, label, [data-act]")) return;
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    const l = document.createElement("label"); l.className = "hap"; l.setAttribute("aria-hidden", "true");
    l.addEventListener("click", e => { if (e.target === l) e.stopPropagation(); });
    const i = document.createElement("input"); i.type = "checkbox"; i.setAttribute("switch", ""); i.tabIndex = -1;
    l.appendChild(i); el.appendChild(l);
  });
}

/* ---------- Ton (Web Audio, standardmäßig aus) ---------- */
let AC = null;
function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (AC && AC.state === "suspended") AC.resume(); return AC; }
function ton(art, zwang) {
  if ((!S.ton && !zwang) || !audio()) return;
  if (typeof fbTonMelde === "function") fbTonMelde(art);
  const t0 = AC.currentTime + .01;
  const noten = { erfolg: [[523.25, 0], [783.99, .12]], achtung: [[220, 0]], klangschale: [[392, 0], [588, 0], [784, 0]], spieluhr: [[1046.5, 0], [1318.5, .28], [1568, .56]], ende: [[659.25, 0], [880, .2]] }[art] || [[523.25, 0]];
  const lang = art === "klangschale" ? 4.5 : art === "spieluhr" ? 1.6 : .45;
  for (const [f, d] of noten) {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0 + d); g.gain.linearRampToValueAtTime(art === "klangschale" ? .09 : .12, t0 + d + .02);
    g.gain.exponentialRampToValueAtTime(.0005, t0 + d + lang);
    o.connect(g).connect(AC.destination); o.start(t0 + d); o.stop(t0 + d + lang + .05);
  }
}

/* ---------- Live-Region ---------- */
function sag(text) { const l = $("#live"); l.textContent = ""; setTimeout(() => l.textContent = text, 30); }

/* ---------- Toast mit Rückgängig ---------- */
const DAUMEN_SVG = `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>`;
let toastTimer = null;
function toast(text, opt = {}) {
  $$(".toast").forEach(t => t.remove());
  clearTimeout(toastTimer);
  const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status");
  const haken = opt.erfolg ? `<svg class="haken-svg" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" stroke-width="2" opacity=".35"/><path d="M8.5 15.5l4.2 4.2 8.8-9.4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>` : "";
  const [kopf, ...weiter] = String(text).split("\n");
  t.innerHTML = `${haken}<div class="text">${esc(kopf)}${weiter.filter(Boolean).map(z => `<small>${esc(z)}</small>`).join("")}</div>${opt.rueck || opt.knopf ? `<div class="toast-knoepfe">` : `<div class="toast-knoepfe" hidden>`}${opt.rueck ? `<button class="knopf rueck-mini" data-act="toast-rueck">Rückgängig</button>` : ""}<button class="knopf zu" data-act="toast-zu" aria-label="Schließen" hidden>Schließen</button>${opt.rueck && !opt.knopf ? `<button class="knopf daumen mit-text" data-act="toast-daumen" aria-label="Danke, Hühnchen">${DAUMEN_SVG}<span>Danke!</span></button>` : ""}${opt.knopf ? `<button class="knopf" data-act="${opt.knopf.act}">${esc(opt.knopf.text)}</button>` : ""}</div>`;
  t._rueck = opt.rueck;
  const t0 = Date.now(); // ein Doppeltipp auf den Knopf darunter soll weder die Meldung schließen noch ihren Knopf (z. B. „Rückgängig“) auslösen
  t.addEventListener("click", ev => { if (Date.now() - t0 < 600) { ev.stopPropagation(); ev.preventDefault(); } }, true);
  t.addEventListener("click", ev => { if (Date.now() - t0 < 600) return; if (!ev.target.closest("button")) { t.classList.add("weg"); setTimeout(() => t.remove(), 250); } });
  document.body.appendChild(t);
  hebeToast();
  armHaptics();
  let rest = opt.dauer || (opt.rueck ? 14000 : 8000);
  const tick = () => { toastTimer = setTimeout(() => { if (beruehrt) { tick(); return; } t.remove(); }, rest); };
  tick();
  sag(String(text).replace(/\n/g, ' '));
}
let beruehrt = false;
addEventListener("touchstart", () => beruehrt = true, { passive: true });
addEventListener("touchend", () => setTimeout(() => beruehrt = false, 300), { passive: true });
function hebeToast() {
  const t = $(".toast"); if (!t) return;
  const sh = $(".sheet:not(.zu)");
  // K-F-15: Ist das Fenster so hoch, dass der Toast Titel und „Schließen“ verdecken würde, kommt er unten über den Fuß
  if (sh) { const platz = innerHeight - sh.offsetHeight - 12; if (platz >= t.offsetHeight + 12) { document.documentElement.style.setProperty("--toast-hoch", (sh.offsetHeight + 12) + "px"); t.classList.add("hoch"); t.classList.remove("im-blatt"); } else { const fuss = $(".sheet-fuss", sh); document.documentElement.style.setProperty("--toast-hoch", ((fuss ? fuss.offsetHeight : 0) + 12) + "px"); t.classList.add("hoch", "im-blatt"); } }
  else t.classList.remove("hoch", "im-blatt");
}

/* ---------- Stempel ---------- */
function stempel(text) {
  if (REDUCED()) return;
  const s = document.createElement("div"); s.className = "stempel"; s.setAttribute("aria-hidden", "true");
  s.innerHTML = esc(text).replace(/\n/g, "<br>");
  document.body.appendChild(s); setTimeout(() => s.remove(), 1200);
}

/* ---------- Sheets ---------- */
const SHEETS = [];
function sheet(opt) {
  // opt: { titel, inhalt (html), fuss (html), voll, onclose, id }
  const ebene = $("#ebene");
  // gleiches Fenster nicht doppelt stapeln: vorhandenes (und alles darüber) erst schließen
  if (opt.id && SHEETS.some(s => s.id === opt.id)) { while (SHEETS.some(s => s.id === opt.id)) sheetZu(); }
  // ein Besuch (Zufallsereignis) soll nicht über dem neuen Fenster liegen
  if (typeof ereignisWeg === "function") $$(".ereignis:not(.weg)").forEach(ereignisWeg);
  $$(".toast").forEach(t => t.remove());
  const schleier = document.createElement("div"); schleier.className = "schleier"; schleier.dataset.act = "sheet-zu";
  const sh = document.createElement("div"); sh.className = "sheet" + (opt.voll ? " voll" : "");
  sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true"); sh.setAttribute("aria-label", opt.titel || "Fenster"); sh.tabIndex = -1;
  if (opt.id) sh.dataset.id = opt.id;
  if (opt.id && typeof mbGeoeffnet === "function") try { mbGeoeffnet(opt.id); } catch (e) { } // „Entdeckt“-Merker (maxbriefe.js)
  sh.innerHTML = `${opt.voll ? "" : `<div class="griff" aria-hidden="true"></div>`}
    <div class="sheet-kopf"><h2>${esc(opt.titel || "")}</h2>${opt.ohneZu ? "" : `<button class="knopf klein leise" data-act="sheet-zu">Schließen</button>`}</div>
    <div class="sheet-inhalt">${opt.inhalt || ""}</div>${opt.fuss ? `<div class="sheet-fuss">${opt.fuss}</div>` : ""}`;
  ebene.append(schleier, sh);
  const vorher = document.activeElement;
  SHEETS.push({ sh, schleier, vorher, onclose: opt.onclose, id: opt.id });
  document.body.style.overflow = "hidden";
  setTimeout(() => { sh.focus({ preventScroll: true }); }, 30);
  ziehZumSchliessen(sh);
  armHaptics(); hebeToast(); if (typeof figurenMalen === "function") figurenMalen();
  histPlanen();
  return sh;
}
addEventListener("pointerdown", () => { window._letzterTipp = Date.now(); }, true);
function sheetZu(ohneHistory) {
  const s = SHEETS.pop(); if (!s) return;
  s.sh.classList.add("zu"); s.schleier.style.opacity = 0;
  s.sh.style.pointerEvents = "none"; s.schleier.removeAttribute("data-act"); // ein Sheet, das sich schließt, nimmt keine Tipps mehr an (der Schleier fängt sie bis zum Ende ab)
  setTimeout(() => s.sh.remove(), REDUCED() ? 0 : 220);
  // Wurde per Fingertipp geschlossen, fängt der (unsichtbare) Schleier noch kurz einen zweiten, zu schnellen Tipp ab, damit er nicht auf der Seite darunter landet
  setTimeout(() => s.schleier.remove(), Date.now() - (window._letzterTipp || 0) < 300 ? 380 : REDUCED() ? 0 : 220);
  if (!SHEETS.length) document.body.style.overflow = "";
  try { s.vorher && s.vorher.focus && s.vorher.focus({ preventScroll: true }); } catch (e) { }
  if (s.onclose) s.onclose();
  if (!ohneHistory) histPlanen();
  setTimeout(hebeToast, 240);
}
function alleSheetsZu() { while (SHEETS.length) sheetZu(true); histPlanen(); }
/* Zurück-Taste: Der Verlauf wird zentral am Sheet-Stapel ausgerichtet – gebündelt per Microtask,
   damit „schließen und sofort öffnen“ keine Verlaufsbewegung erzeugt. */
let IGNORE_POP = 0, HIST_TIEFE = 0, HIST_GEPLANT = false;
function histSync() {
  HIST_GEPLANT = false;
  const soll = SHEETS.length;
  try {
    // Ein offener Besuch hat schon einen Verlaufseintrag: den übernimmt das neue Fenster
    if (soll > HIST_TIEFE && ER_HIST) { ER_HIST = false; history.replaceState({ sheet: ++HIST_TIEFE }, ""); }
    if (soll > HIST_TIEFE) { while (HIST_TIEFE < soll) history.pushState({ sheet: ++HIST_TIEFE }, ""); }
    else if (soll < HIST_TIEFE) { const n = HIST_TIEFE - soll; HIST_TIEFE = soll; IGNORE_POP++; history.go(-n); }
  } catch (e) { HIST_TIEFE = soll; }
}
function histPlanen() { if (!HIST_GEPLANT) { HIST_GEPLANT = true; queueMicrotask(histSync); } }
/* Besuche (Zufallsereignisse) bekommen einen eigenen Verlaufseintrag: Zurück schließt den Besuch, nicht die App */
let ER_HIST = false;
function histBesuchAuf() { if (ER_HIST) return; try { history.pushState({ sheet: HIST_TIEFE, er: 1 }, ""); ER_HIST = true; } catch (e) { } }
function histBesuchZu() { setTimeout(() => { if (!ER_HIST) return; ER_HIST = false; IGNORE_POP++; try { history.back(); } catch (e) { IGNORE_POP--; } }, 0); }
addEventListener("popstate", () => {
  if (IGNORE_POP > 0) { IGNORE_POP--; return; }
  if (ER_HIST) { ER_HIST = false; const el = $(".ereignis:not(.weg)"); if (el && typeof ereignisWeg === "function") ereignisWeg(el); if (!(history.state && history.state.er)) { HIST_TIEFE = (history.state && history.state.sheet) || 0; while (SHEETS.length > HIST_TIEFE) sheetZu(true); } return; }
  HIST_TIEFE = (history.state && history.state.sheet) || 0;
  while (SHEETS.length > HIST_TIEFE) sheetZu(true);
});
try { if (history.state && history.state.sheet) history.replaceState(null, ""); } catch (e) { }
function aktuellesSheet() { return SHEETS.length ? SHEETS[SHEETS.length - 1].sh : null; }
function fokusMerken(sh) { const a = document.activeElement; if (!a || !sh.contains(a) || a === sh) return null; const d = a.dataset || {}; return d.act ? `[data-act="${d.act}"]${d.v != null ? `[data-v="${CSS.escape(d.v)}"]` : ""}${d.i != null ? `[data-i="${d.i}"]` : ""}${d.k != null ? `[data-k="${d.k}"]` : ""}${d.d != null ? `[data-d="${d.d}"]` : ""}` : (a.id ? "#" + CSS.escape(a.id) : null); }
function fokusZurueck(sh, sel) { const el = sel && sh.querySelector(sel); (el || sh).focus({ preventScroll: true }); }
function sheetInhalt(html) { const sh = aktuellesSheet(); if (sh) { const sel = fokusMerken(sh) || (sh.contains(document.activeElement) ? null : ""); const sc = $(".sheet-inhalt", sh); const y = sc.scrollTop; sc.innerHTML = html; sc.scrollTop = y; armHaptics(); if (typeof figurenMalen === "function") figurenMalen(); if (sel !== null || !sh.contains(document.activeElement)) fokusZurueck(sh, sel); } }
function sheetFuss(html) { const sh = aktuellesSheet(); if (sh) { const sel = fokusMerken(sh); let f = $(".sheet-fuss", sh); if (!f) { f = document.createElement("div"); f.className = "sheet-fuss"; sh.appendChild(f); } f.innerHTML = html; armHaptics(); if (!sh.contains(document.activeElement)) fokusZurueck(sh, sel); } }
/* Fokusfalle + Escape */
addEventListener("keydown", e => {
  const sh = aktuellesSheet(); if (!sh) return;
  if (e.key === "Escape") { e.preventDefault(); sheetZu(); return; }
  if (e.key !== "Tab") return;
  const f = $$("button,[href],input,textarea,select,[tabindex]:not([tabindex='-1'])", sh).filter(x => !x.disabled && x.offsetParent !== null);
  if (!f.length) return;
  const a = f[0], z = f[f.length - 1];
  if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
  else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
});
/* Herunterziehen zum Schließen – nur zusätzlich, erst ab 120 px */
function ziehZumSchliessen(sh) {
  let y0 = null, dy = 0;
  const kopf = () => [$(".griff", sh), $(".sheet-kopf", sh)];
  sh.addEventListener("touchstart", e => { if (!kopf().some(k => k && k.contains(e.target))) return; y0 = e.touches[0].clientY; dy = 0; }, { passive: true });
  sh.addEventListener("touchmove", e => { if (y0 == null) return; dy = Math.max(0, e.touches[0].clientY - y0); sh.style.transform = `translateY(${dy}px)`; sh.style.transition = "none"; }, { passive: true });
  sh.addEventListener("touchend", () => { if (y0 == null) return; sh.style.transition = ""; if (dy > 120) sheetZu(); else sh.style.transform = ""; y0 = null; }, { passive: true });
}

/* ---------- Tippen: Abbruch bei Wischen, gedrückt-Zustand, Doppel-Sperre ---------- */
/* Alle antippbaren Familien (feedback.js). Bild/Leinwand bleiben draußen: Lupe und langes Drücken regeln das selbst. */
const TAPSEL = ".knopf,.kachel,.tf,.chip,.liste-zeile,nav.tabs button,.karte,.fach,.schalter-zeile,.buehne button.ueber,button,a[href],[data-act],[data-tab],summary,[role=switch]";
const TAP_NICHT = "canvas,#bild-gross,input,textarea,select";
let tg = null, abbrechenBis = 0;
addEventListener("pointerdown", e => {
  abbrechenBis = 0;
  const el = e.target.closest && e.target.closest(TAPSEL); if (!el || el.disabled || el.matches(TAP_NICHT)) { tg = null; return; }
  tg = { el, x: e.clientX, y: e.clientY, moved: false };
  el.classList.remove("nopress"); el.classList.add("gedrueckt"); el._seit = performance.now();
}, { passive: true, capture: true });
addEventListener("pointermove", e => {
  if (!tg || tg.moved) return;
  // ab 10 px Bewegung ist es kein Tippen mehr: gedrücktes Aussehen weg, Loslassen löst nichts aus
  if (Math.hypot(e.clientX - tg.x, e.clientY - tg.y) > 10) { tg.moved = true; tg.el.classList.remove("gedrueckt"); tg.el.classList.add("nopress"); }
}, { passive: true, capture: true });
function loesen(e) {
  if (!tg) return;
  const el = tg.el, rest = Math.max(0, 120 - (performance.now() - (el._seit || 0)));
  setTimeout(() => el.classList.remove("gedrueckt", "nopress"), rest);
  if (tg.moved) abbrechenBis = performance.now() + 600;
  tg = null;   // Welle, Füllung usw. macht feedback.js beim Klick – genau eine Rückmeldung pro Tipp
}
addEventListener("pointerup", loesen, { passive: true, capture: true });
addEventListener("pointercancel", e => { if (tg) { tg.moved = true; } loesen(e); }, { passive: true, capture: true });
addEventListener("click", e => { if (performance.now() < abbrechenBis) { abbrechenBis = 0; e.preventDefault(); e.stopImmediatePropagation(); } }, true);
const sperre = new WeakMap();
function gesperrt(el) {
  if (el.dataset && (el.dataset.act === "huhn-tap" || el.dataset.act === "tschuess")) return false;
  const t = performance.now(), l = sperre.get(el) || 0;
  if (t - l < 600) return true; sperre.set(el, t); return false;
}

/* ---------- Icons (gefüllte Silhouetten, 24er Raster) ---------- */
const IC = {
  schuh: "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2ZM9.8 8.9 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7",
  buch: "M3 5.2C5.6 4.3 8.6 4.4 11 6v13.5c-2.4-1.5-5.4-1.7-8-.8V5.2Zm18 0c-2.6-.9-5.6-.8-8 .8v13.5c2.4-1.5 5.4-1.7 8-.8V5.2Z",
  telefon: "M6.6 3.2 9 3l1.6 4.3-1.9 1.4a11 11 0 0 0 6.6 6.6l1.4-1.9L21 15l-.2 2.4c-.1 1.4-1.3 2.5-2.7 2.4C10.3 19.3 4.7 13.7 4.2 5.9c-.1-1.4 1-2.6 2.4-2.7Z",
  fuss: "M7.5 3c1.6 0 2.6 1.8 2.6 4.3S9 12 7.5 12 5 9.6 5 7.3 5.9 3 7.5 3Zm-1.8 10h3.7l-.3 3c-.1 1-.9 1.8-1.6 1.8s-1.5-.8-1.6-1.8l-.2-3Zm10.8-7c1.6 0 2.5 1.8 2.5 4.2S17.9 15 16.5 15 14 12.7 14 10.3 14.9 6 16.5 6Zm-1.8 10h3.6l-.2 2.9c-.1 1-.9 1.9-1.6 1.9s-1.5-.9-1.6-1.9l-.2-2.9Z",
  tassen: "M2 9h9v4.5A4.5 4.5 0 0 1 6.5 18 4.5 4.5 0 0 1 2 13.5V9Zm9 1h1.2a2 2 0 0 1 0 4H11v-1.4h1.1a.6.6 0 0 0 0-1.2H11V10Zm2.5-3h8.5v4.3A4.3 4.3 0 0 1 17.7 15.6a4.3 4.3 0 0 1-4.2-3.3V7ZM1.5 19.5h11v1.5h-11v-1.5Z",
  haus: "M12 3 2.5 11h2.5v9.5h5.5v-6h3v6H19V11h2.5L12 3Z",
  brief: "M3 6h18v12H3V6Zm1.8 1.6L12 12.8l7.2-5.2H4.8Z",
  hand: "M8 21c-2-1.2-3.6-3.6-4.3-6l-.9-3.2c-.2-.8.6-1.4 1.3-1l2 1.6V5.2c0-.8.6-1.3 1.3-1.3S8.7 4.4 8.7 5.2V11h1V3.7c0-.8.6-1.3 1.3-1.3s1.3.5 1.3 1.3V11h1V4.6c0-.8.6-1.3 1.3-1.3s1.3.5 1.3 1.3V11h1V6.7c0-.8.6-1.3 1.3-1.3s1.3.5 1.3 1.3V14c0 3.7-2.2 7-6.3 7H8Z",
  kopfhoerer: "M12 3a8.5 8.5 0 0 0-8.5 8.5V18a2.5 2.5 0 0 0 2.5 2.5h2V13H5.3v-1.5a6.7 6.7 0 0 1 13.4 0V13H16v7.5h2a2.5 2.5 0 0 0 2.5-2.5v-6.5A8.5 8.5 0 0 0 12 3Z",
  lesezeichen: "M6 2.5h12V22l-6-4.4L6 22V2.5Z",
  raetsel: "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11Z",
  radio: "M4 8.5 17 4l.5 1.4-8.7 3.1H20c.6 0 1 .4 1 1V19c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V9.5c0-.5.4-.9 1-1Zm4 3.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6.5.5v1.5h4.5v-1.5h-4.5Zm0 3v1.5h4.5v-1.5h-4.5Z",
  funke: "M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z",
  feder: "M20.5 3.5C14 3.6 8.3 7.8 6.4 14l-1 3.5L3 21l1.2.6 2.4-3.5 3.4-1.1c6-2 9.8-7.3 10.5-13.5ZM9 15.5l-1.4.4.4-1.5c1.2-3.5 4.2-6.6 7.7-8.2-2.8 2.6-5 5.8-6.7 9.3Z",
  note: "M9 4.5 20 2v13.5a3 3 0 1 1-2-2.8V6.6L11 8.2v9.3a3 3 0 1 1-2-2.8V4.5Z",
  maske: "M4 4h16v6.5C20 15.2 16.4 19 12 19s-8-3.8-8-8.5V4Zm4.5 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM8.5 14c.8 1.6 2.1 2.4 3.5 2.4s2.7-.8 3.5-2.4h-7Z",
  kuchen: "M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2Zm4.6 9.99-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01ZM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9Z",
  sonne: "M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-.8-5h1.6v3h-1.6V2Zm0 17h1.6v3h-1.6v-3ZM2 11.2h3v1.6H2v-1.6Zm17 0h3v1.6h-3v-1.6ZM4.4 5.5l1.1-1.1 2.1 2.1-1.1 1.1-2.1-2.1Zm12 12 1.1-1.1 2.1 2.1-1.1 1.1-2.1-2.1Zm-12 1 2.1-2.1 1.1 1.1-2.1 2.1-1.1-1.1Zm12-12 2.1-2.1 1.1 1.1-2.1 2.1-1.1-1.1Z",
  blatt: "M20 3C11 3 4 8 4 15.5c0 1.6.5 3 1.2 4.1L3 21.8l1.1 1.1 2.2-2.2c1.1.8 2.6 1.3 4.2 1.3C18 22 21 13 20 3ZM8 18.3c1.8-4.7 5-8.3 9-10.6-3.3 3.1-5.8 6.7-7.3 11.3L8 18.3Z",
  topf: "M3 9h18v2h-1.5v6.5A2.5 2.5 0 0 1 17 20H7a2.5 2.5 0 0 1-2.5-2.5V11H3V9Zm5.5-4.5h7V7h-7V4.5Z",
  pinsel: "M20.7 3.3c.6.6.4 1.6-.3 2.2L13 12.2 11.8 11l6.7-7.4c.6-.7 1.6-.9 2.2-.3ZM10.7 12l1.3 1.3c.1 2.6-1.7 5.2-4.7 5.6-1.8.3-3.3.2-4.8-.5 1.3-.8 1.6-1.8 1.8-3 .5-2.6 3.3-3.8 6.4-3.4Z",
  blume: "M12 2.5c1.6 0 2.7 1.6 2.4 3.3 1.5-.8 3.4-.2 3.9 1.3.5 1.6-.6 3.1-2.1 3.5 1.4 1 1.7 2.9.6 4.1-1.1 1.2-3 1-4-.2-.2 1.6-1.6 2.8-3.2 2.4-1.6-.4-2.3-2.2-1.6-3.6-1.6.4-3.1-.6-3.2-2.2-.2-1.6 1.2-2.8 2.8-2.7C6.8 7 7.4 5 9 4.5c1-.3 2 0 2.6.7.1-1.6.8-2.7.4-2.7ZM11 18h2v4h-2v-4Z",
  kiste: "M3 7.5 12 3l9 4.5V17l-9 4.5L3 17V7.5Zm2 1.4v7l6 3v-7l-6-3Zm8 3v7l6-3v-7l-6 3Z",
  kamera: "M8.5 4.5h7l1.5 2H21c.6 0 1 .4 1 1V19c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V7.5c0-.6.4-1 1-1h4l1.5-2ZM12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  lampe: "M7 3h10l3 8H4l3-8Zm4 9h2v6h4v3H7v-3h4v-6Z",
  decke: "M3 8c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3v9H3V8Zm-1 10h20v2H2v-2Zm5-9a2 2 0 1 0 0 4h3V9H7Z",
  kreuz: "M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5V3Z",
  kerze: "M10 9h4v12h-4V9Zm2-7c1.5 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .5-2.2 2-4Z",
  waerme: "M10 1.5h4v2.5h-4V1.5Zm-.5 3h5v2h-5v-2ZM6.5 7.5h11a2 2 0 0 1 2 2v1.5h-15V9.5a2 2 0 0 1 2-2Zm-2 5h15v3h-15v-3Zm0 4.5h15v1.5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3V17Z",
  glas: "M5.5 3h13l-1.8 17c-.1.6-.6 1-1.2 1H8.5c-.6 0-1.1-.4-1.2-1L5.5 3Zm2.4 6 .9 9.5h6.4l.9-9.5H7.9Z",
  sprechen: "M3 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2H10l-5 4.5V16H5c-1.1 0-2-.9-2-2V5Z",
  bank: "M3 10h18v2.5H3V10Zm1-4h16v2.5H4V6Zm0 7.5h2V20H4v-6.5Zm14 0h2V20h-2v-6.5Zm-12.5 2h13V17h-13v-1.5Z",
  roller: "M14.5 3h3v2h-1.3L19 16.1a3 3 0 1 1-1.9.6L16.2 13l-6.5 4.8a3 3 0 1 1-1.2-1.6L15.6 11 14.5 5V3ZM6 17.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  stern: "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5Z",
  arme: "M12 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 7.5l1-1.6L10 9h4l6-3.1 1 1.6-6 3.6V14l2 7.5h-2.3L12 15.5 9.3 21.5H7L9 14v-3.4L3 7.5Z",
  waage: "M11 3h2v3.2l6 1.3.9-.2.5 1.9-1 .3 2.6 5.5c0 1.7-1.6 3-3.5 3s-3.5-1.3-3.5-3l2.6-5.3L13 8v11h4v2H7v-2h4V8l-4.5.7 2.6 5.3c0 1.7-1.6 3-3.5 3S2.1 15.7 2.1 14l2.6-5.5-1-.3.5-1.9.9.2 6-1.3V3ZM5.6 10l-1.8 4h3.6l-1.8-4Zm12.8 0-1.8 4h3.6l-1.8-4Z",
  ruecken: "M11 2h2v20h-2V2Zm-5 3.5h12v2H6v-2Zm1 4h10v2H7v-2Zm-1 4h12v2H6v-2Zm1 4h10v2H7v-2Z",
  atem: "M3 9h11a2.5 2.5 0 1 0-2.4-3.2l-1.9-.6A4.5 4.5 0 1 1 14 11H3V9Zm0 4h15a3 3 0 1 1-2.9 3.8l1.9-.5A1 1 0 1 0 18 15H3v-2Z",
  tasche: "M8 7V6a4 4 0 0 1 8 0v1h3.5l1 14h-17l1-14H8Zm2 0h4V6a2 2 0 0 0-4 0v1Z",
  tasse: "M3 8h13v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm13 1.5h1.5a3 3 0 0 1 0 6H16V13.5h1.5a1 1 0 0 0 0-2H16v-2Zm-13 11h15v1.5H3v-1.5ZM7.5 2.5c.8.9.8 2.1 0 3l-1-1c.3-.3.3-.7 0-1l1-1Zm3.5 0c.8.9.8 2.1 0 3l-1-1c.3-.3.3-.7 0-1l1-1Z",
  karten: "M7 3.5h10c.8 0 1.5.7 1.5 1.5v14c0 .8-.7 1.5-1.5 1.5H7c-.8 0-1.5-.7-1.5-1.5V5c0-.8.7-1.5 1.5-1.5Zm5 5c-1.4 1.6-3 2.8-3 4.2 0 1 .8 1.8 1.8 1.8.4 0 .7-.1 1-.3l-.6 2.3h1.6l-.6-2.3c.3.2.6.3 1 .3 1 0 1.8-.8 1.8-1.8 0-1.4-1.6-2.6-3-4.2Z",
  vogel: "M16 4.5a3 3 0 0 1 3 3v.3l2.5 1.2-2.6 1C18.4 14 15.3 17 11.5 17H9.6l-2 3H5.5l1.4-3.3C4.3 15.8 2.5 13.4 2.5 10.5V9l4.7 2.4C8.5 8.6 10.8 7 13.3 7c.1-1.4 1.3-2.5 2.7-2.5Z",
  schale: "M2.5 10h19c0 4.6-3.8 8.3-8.5 8.5V20h3v1.5H8V20h3v-1.5C6.3 18.3 2.5 14.6 2.5 10Zm3-2.5C7.5 6 9.5 5.3 12 5.3s4.5.7 6.5 2.2h-13Z",
  igel: "M4 15.5C4 11.4 7.6 8 12 8c3.7 0 6.8 2.4 7.7 5.6l2.3.9-1.8 1.5C19.4 18 17 19.5 14 19.5H6.5A2.5 2.5 0 0 1 4 17v-1.5Zm1.5-6 1.7 1.2L6 6.8l2.7 2.1.4-3.2 2.1 2.4 1.1-3 1.3 3 2-2.2.2 3.1 2.5-1.8-1 3.2-11.8-1.9Z",
  glocke: "M12 2.5c.8 0 1.5.7 1.5 1.5v.7c3 .7 5 3.3 5 6.4V16l2 2.5v1H3.5v-1L5.5 16v-4.9c0-3.1 2-5.7 5-6.4V4c0-.8.7-1.5 1.5-1.5ZM9.8 20.5h4.4a2.2 2.2 0 0 1-4.4 0Z",
  regen: "M6.5 13a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.7 3.7 0 0 1 17.5 13h-11Zm1 2h1.6l-1.2 4H6.3l1.2-4Zm4.5 0h1.6l-1.2 4h-1.6L12 15Zm4.5 0h1.6l-1.2 4h-1.6l1.2-4Z",
  karte: "M3 5.5 9 3l6 2.5L21 3v15.5L15 21l-6-2.5L3 21V5.5Zm6-.4v13.3l6 2.5V7.6L9 5.1Z",
  zahnrad: "M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm8.4 4.9-.1-1.5 2-1.6-2-3.4-2.4.9a8 8 0 0 0-2.6-1.5L14.9 2h-3.8l-.4 2.4a8 8 0 0 0-2.6 1.5l-2.4-.9-2 3.4 2 1.6a7.7 7.7 0 0 0 0 3l-2 1.6 2 3.4 2.4-.9c.8.6 1.6 1.1 2.6 1.5l.4 2.4h3.8l.4-2.4c1-.4 1.8-.9 2.6-1.5l2.4.9 2-3.4-2-1.6Z",
  pfeil: "M8.6 4.6 10 3.2 18.8 12 10 20.8l-1.4-1.4L16 12 8.6 4.6Z",
  plus: "M10.8 3h2.4v7.8H21v2.4h-7.8V21h-2.4v-7.8H3v-2.4h7.8V3Z",
  minus: "M3 10.8h18v2.4H3v-2.4Z",
  heute: "M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-.8-5h1.6v3h-1.6V2Zm0 17h1.6v3h-1.6v-3ZM2 11.2h3v1.6H2v-1.6Zm17 0h3v1.6h-3v-1.6Z",
  ideen: "M12 2a7 7 0 0 1 4.2 12.6c-.7.6-1.2 1.4-1.2 2.4v.5H9V17c0-1-.5-1.8-1.2-2.4A7 7 0 0 1 12 2Zm-3 17h6v1.5c0 .8-.7 1.5-1.5 1.5h-3c-.8 0-1.5-.7-1.5-1.5V19Z",
  lichtung: "M2 20 7.5 6l2.7 6.5L12 9l1.8 3.5L16.5 6 22 20H2Zm10-6.5a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z",
  tagebuch: "M5 2.5h12.5c.8 0 1.5.7 1.5 1.5v16c0 .8-.7 1.5-1.5 1.5H5V2.5Zm3 4v1.6h8V6.5H8Zm0 4v1.6h8v-1.6H8Zm0 4v1.6h5v-1.6H8ZM3 4h1.5v16H3V4Z",
  uhr: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-1 5v6l5 3 .8-1.4-4.1-2.4V7H11Z",
  rucksack: "M9 3.5h6V5c2.5.6 4 2.7 4 5.3V20c0 .8-.7 1.5-1.5 1.5h-11C5.7 21.5 5 20.8 5 20v-9.7C5 7.7 6.5 5.6 9 5V3.5Zm-1 10v5h8v-5H8Zm1.8-6.3v1.6h4.4V7.2H9.8Z",
  frage: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-.9 13.5v2.2h2.2v-2.2h-2.2ZM12 6c-2.1 0-3.7 1.4-3.8 3.4h2.1c.1-.9.8-1.5 1.7-1.5 1 0 1.7.6 1.7 1.5 0 1.9-2.9 1.8-2.6 4.8h2.1c-.1-2.4 2.7-2.5 2.7-5C15.9 7.3 14.2 6 12 6Z",
  schliessen: "M5.6 4.2 12 10.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4Z",
  box: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2.2v13.6h14V5.2H5Z",
  boxhaken: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm5.3 13.1 7.6-7.6-1.5-1.5-6.1 6.1-2.8-2.8-1.5 1.5 4.3 4.3Z",
  haken: "M9.5 16.2 4.8 11.5l-1.6 1.6 6.3 6.3L21 7.9l-1.6-1.6L9.5 16.2Z",
  /* neu (Icon-Prüfung): eindeutige Zeichen statt Doppelbelegungen */
  flamme: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67ZM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8Z",
  sessel: "M21 9V7c0-1.65-1.35-3-3-3H6C4.35 4 3 5.35 3 7v2c-1.65 0-3 1.35-3 3v5c0 1.65 1.35 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1h14v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.65 0 3-1.35 3-3v-5c0-1.65-1.35-3-3-3ZM5 7c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v2.78c-.61.55-1 1.34-1 2.22v2H6v-2c0-.88-.39-1.67-1-2.22V7Z",
  bett: "M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78c-.61.55-1 1.34-1 2.22v6h2v-2h16v2h2v-6c0-.88-.39-1.67-1-2.22ZM13 9c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1h-6V9ZM5 9c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1H5V9Z",
  info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z",
  schluessel: "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65ZM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z",
  handy: "M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99ZM17 19H7V5h10v14Z",
  treppe: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-1 5h-2.42v3.33H13v3.33h-2.58V18H6v-2h2.42v-3.33H11V9.33h2.58V6H18v2Z",
  liste: "M3 13h2v-2H3v2Zm0 4h2v-2H3v2Zm0-8h2V7H3v2Zm4 4h14v-2H7v2Zm0 4h14v-2H7v2ZM7 7v2h14V7H7Z",
  werkzeug: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4Z",
  /* Kommission K-D-04: weitere eindeutige Zeichen */
  setzkasten: "M4 8h4V4H4v4Zm6 12h4v-4h-4v4Zm-6 0h4v-4H4v4Zm0-6h4v-4H4v4Zm6 0h4v-4h-4v4Zm6-10v4h4V4h-4Zm-6 4h4V4h-4v4Zm6 6h4v-4h-4v4Zm0 6h4v-4h-4v4Z",
  matte: "M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm9 12v-2c-2.24 0-4.16-.96-5.6-2.68l-1.34-1.6A1.98 1.98 0 0 0 12.53 9h-1.05c-.59 0-1.15.26-1.53.72l-1.34 1.6C7.16 13.04 5.24 14 3 14v2c2.77 0 5.19-1.17 7-3.25V15l-3.88 1.55c-.67.27-1.12.93-1.12 1.66C5 19.2 5.8 20 6.79 20H9v-.5a2.5 2.5 0 0 1 2.5-2.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.83 0-1.5.67-1.5 1.5v.5h7.21c.99 0 1.79-.8 1.79-1.79 0-.73-.45-1.39-1.12-1.66L14 15v-2.25c1.81 2.08 4.23 3.25 7 3.25Z",
  briefkasten: "M20 6H10v6H8V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2Z",
  stift: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z",
  plaudern: "M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1Zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1Z",
  geschenk: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2Zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1ZM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Zm11 15H4v-2h16v2Zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6Z",
  schrift: "M9 4v3h5v12h3V7h5V4H9Zm-6 8h3v7h3v-7h3V9H3v3Z",
  herz: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z",
  schild: "M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Z"
};

/* ---------- Mehrfarbige Objekt-Symbole (Gestaltung C2, 48er Raster) ----------
   Flach, ohne Kontur, 4–5 Farben je Symbol. Farben stehen NICHT im SVG, sondern als Klassen,
   die auf Token zeigen (design.css: .ic-f .f-x = Fläche, .l-x = Linie) – so wirken sie hell und dunkel.
   Kurzschrift im Quelltext: class="r" (Fläche Rot), class="-r" (Linie Rot).
   Palette: r R rot · g G grün · y Y senf · b B blau · s himmel · c creme · w weiß · p rosa · h H holz · k tinte · l lila · e grau
   Bedienzeichen (Haken, Plus, Pfeil …) bleiben einfarbig aus IC. */
const ICF_QUELLE = {
  /* ---------- Bewegung ---------- */
  schuh: `<path class="r" d="M8 31V15a2 2 0 0 1 2-2h9c1.4 5 5.4 8 11 9l8 1.6c4 .8 6.4 3.6 6.4 7.4H8Z"/><path class="R" d="M8 15a2 2 0 0 1 2-2h9l.6 2.6H8Z"/><path class="c" d="M5 31h40v4.5a2.5 2.5 0 0 1-2.5 2.5h-35A2.5 2.5 0 0 1 5 35.5Z"/><path class="H" d="M5 35h40v.5a2.5 2.5 0 0 1-2.5 2.5h-35A2.5 2.5 0 0 1 5 35.5Z"/><path class="-w" stroke-width="2.2" d="M21.5 18.5l4 2.4M24 15.6l4 2.4M27 21.4l3.4 1.6"/>`,
  arme: `<circle class="b" cx="24" cy="25" r="17"/><path class="y" d="M7.4 21.4c6 4 27 4.4 33.4-1.4.3 1.6.2 3.4 0 5-7.4 5-27 5-33.6.8-.2-1.4-.1-3 .2-4.4Z"/><path class="r" d="M12 36.6c7-3.6 17-3.8 24.4-.6A17 17 0 0 1 12 36.6Z"/><ellipse class="w" cx="17" cy="15" rx="4.2" ry="2.6" transform="rotate(-30 17 15)"/>`,
  waage: `<ellipse class="e" cx="24" cy="38" rx="15" ry="5.6"/><ellipse class="c" cx="24" cy="28.4" rx="11" ry="5"/><ellipse class="s" cx="24" cy="19.6" rx="8" ry="4.4"/><ellipse class="b" cx="24" cy="11.6" rx="5" ry="3.6"/><path class="g" d="M31 6c3.6-1.4 6.4 0 7 2.6-3 1.2-5.8.4-7-2.6Z"/>`,
  ruecken: `<rect class="g" x="3" y="34" width="42" height="6" rx="2"/><path class="G" d="M3 38h42v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle class="p" cx="9.5" cy="29" r="4.6"/><path class="H" d="M5 27.4a4.8 4.8 0 0 1 8.6-1.6c-2.6-.4-5.6.2-8.6 1.6Z"/><path class="b" d="M13 29.6h13.4a3 3 0 0 1 0 6H13a3 3 0 0 1 0-6Z"/><path class="B" d="M24 30.4 32.6 18a3 3 0 0 1 5 .2l5.8 12.4a3 3 0 0 1-5.4 2.6L34 24.6 28.4 34Z"/><path class="-y" stroke-width="2.4" d="M38 6l1 3.4 3.4 1-3.4 1L38 15l-1-3.6-3.4-1 3.4-1Z"/>`,
  matte: `<path class="g" d="M14 12h24a8 8 0 0 1 0 16H14Z"/><ellipse class="G" cx="14" cy="20" rx="7" ry="8"/><ellipse class="g" cx="14" cy="20" rx="4.6" ry="5.4"/><ellipse class="G" cx="14" cy="20" rx="2.2" ry="2.6"/><path class="-c" stroke-width="2.6" d="M24 12.4v15.2M33 12.4v15.2"/><path class="g" d="M38 28H18c-2 0-3 1.4-3 3v8h28v-6a5 5 0 0 0-5-5Z"/><path class="G" d="M15 36h28v3H15z"/><path class="-k" stroke-width="2" d="M24 12c0-4 9-4 9 0" opacity=".7"/>`,
  atem: `<path class="-b" stroke-width="4" d="M6 18h20a5 5 0 1 0-5-5"/><path class="-s" stroke-width="4" d="M6 27h28a5 5 0 1 1-5 5"/><path class="-b" stroke-width="4" d="M10 36h10"/><path class="g" d="M34 8c6-2 9 1 9 5-5 1.6-8.4-.6-9-5Z"/>`,
  tasche: `<path class="-H" stroke-width="3" d="M14 20c0-9 20-9 20 0"/><path class="g" d="M30 6l3 14h-4z"/><path class="r" d="M17 9c2 2 3 6 3 11h-5c-1-4 0-8 2-11Z"/><circle class="r" cx="26" cy="17" r="5"/><path class="G" d="M26 12c0-2 1-3 3-3"/><path class="h" d="M6 19h36l-3.6 19a3 3 0 0 1-3 2.4H12.6a3 3 0 0 1-3-2.4Z"/><path class="-H" stroke-width="2" d="M10 26h28M11.4 33h25.2M18 19l1 21M30 19l-1 21"/>`,
  fuss: `<path class="r" d="M8 23c3 3 7 5 12 5.6 6 .6 10 .6 13.4 1.2 5 .8 9.6 2.6 10.6 5.6.6 2-.6 3.4-2.6 3.4H28c-6 0-11-5.4-18.4-5.8Z"/><path class="R" d="M8.4 31.4l4.8.6-1.2 12H9.8Z"/><path class="R" d="M28 38.8h14v1.6H28Z" opacity=".8"/><ellipse class="-y" stroke-width="2.4" cx="12" cy="22.4" rx="6.6" ry="2.6"/><path class="-y" stroke-width="2.4" d="M22 29 18.4 24"/><circle class="y" cx="18.2" cy="23.6" r="1.9"/><path class="-w" stroke-width="2" d="M32 32.6c3 .2 6 1 8 2.4" opacity=".55"/>`,
  kuchen: `<ellipse class="e" cx="24" cy="41" rx="21" ry="3.4"/><path class="y" d="M5 36 42 18v21H5Z"/><path class="r" d="M11.2 33 17.3 30H42v3.4H11.2Z"/><path class="w" d="M4 36.6 42 17.6v-4L3.6 33.4Z"/><path class="Y" d="M40 18.6 42 17.6V39h-2Z"/><path class="-G" stroke-width="1.8" d="M37 9c0-3 2-5 4-5"/><circle class="r" cx="36.6" cy="12" r="3.6"/>`,
  roller: `<path class="r" d="M29 8h5l4.6 24h-4.4Z"/><path class="-k" stroke-width="3" d="M27 8h8"/><path class="r" d="M8 32h26v4H10a2 2 0 0 1-2-2Z"/><circle class="k" cx="12" cy="38" r="5"/><circle class="k" cx="37" cy="38" r="5"/><circle class="e" cx="12" cy="38" r="2"/><circle class="e" cx="37" cy="38" r="2"/>`,
  /* ---------- Menschen ---------- */
  telefon: `<path class="R" d="M5 15c0-4 3-6.4 7-6.4h24c4 0 7 2.4 7 6.4v2.6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2H17v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"/><path class="r" d="M13 22h22l6 14a2.4 2.4 0 0 1-2.2 3.4H9.2A2.4 2.4 0 0 1 7 36Z"/><circle class="c" cx="24" cy="31" r="7"/><g class="r"><circle cx="24" cy="26.6" r="1.3"/><circle cx="28" cy="29" r="1.3"/><circle cx="28" cy="33.2" r="1.3"/><circle cx="24" cy="35.4" r="1.3"/><circle cx="20" cy="33.2" r="1.3"/><circle cx="20" cy="29" r="1.3"/></g><circle class="y" cx="24" cy="31" r="2"/>`,
  haus: `<path class="B" d="M4 22 24 7l20 15-2.4 3L24 12 6.4 25Z"/><path class="r" d="M9 22.6 24 11.4l15 11.2V41H9Z"/><path class="w" d="M9 22.6h2.4V41H9zM36.6 22.6H39V41h-2.4z"/><rect class="w" x="13.4" y="25" width="8" height="8" rx="1"/><rect class="s" x="14.6" y="26.2" width="5.6" height="5.6"/><path class="w" d="M17 26h.8v7H17z"/><rect class="B" x="26" y="27" width="7" height="14" rx="1"/><circle class="y" cx="31.4" cy="34.4" r="1"/>`,
  brief: `<rect class="c" x="5" y="11" width="38" height="27" rx="2.4"/><path class="Y" d="M5.6 12.4 24 27l18.4-14.6A2.4 2.4 0 0 0 40.6 11H7.4a2.4 2.4 0 0 0-1.8 1.4Z" opacity=".55"/><path class="-Y" stroke-width="2" d="M6 37 19 25M42 37 29 25"/><circle class="r" cx="24" cy="26" r="5"/><path class="R" d="M21.6 24.4h4.8v3.2h-4.8z"/>`,
  hand: `<path class="p" d="M10 40c-3-3-5-8-5-12v-6c0-1.6 1.2-2.6 2.6-2.6S10 20.4 10 22v5h1.4V13c0-1.6 1.2-2.6 2.6-2.6s2.6 1 2.6 2.6v12h1.4V10c0-1.6 1.2-2.6 2.6-2.6s2.6 1 2.6 2.6v15h1.4V12.4c0-1.6 1.2-2.6 2.6-2.6S29.8 11 29.8 12.4V33c0 4-3 7-7 7Z"/><path class="r" d="M37 30c-4.6-3-7-5.4-7-8.4a3.6 3.6 0 0 1 7-1.2 3.6 3.6 0 0 1 7 1.2c0 3-2.4 5.4-7 8.4Z"/>`,
  tassen: `<path class="-e" stroke-width="2.4" d="M15 10c-2 2 2 3 0 5M30 8c-2 2 2 3 0 5"/><path class="r" d="M5 19h17v8a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7Z"/><path class="-r" stroke-width="2.6" d="M22 22h2a3 3 0 0 1 0 6h-2.4"/><path class="b" d="M24 17h18v9a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7Z"/><path class="-b" stroke-width="2.6" d="M42 20h2a3 3 0 0 1 0 6h-2.4"/><path class="w" d="M27 20h2v6h-2z" opacity=".6"/><rect class="c" x="3" y="36" width="42" height="4" rx="2"/>`,
  tasse: `<path class="-e" stroke-width="2.4" d="M17 6c-2.4 2.4 2.4 3.6 0 6M25 6c-2.4 2.4 2.4 3.6 0 6"/><path class="r" d="M8 16h26v10a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 26Z"/><path class="-r" stroke-width="3" d="M34 19h3a4.4 4.4 0 0 1 0 8.8h-3.4"/><path class="w" d="M12 20h3v8h-3z" opacity=".55"/><path class="c" d="M4 37h34a2 2 0 0 1 0 4H8a4 4 0 0 1-4-4Z"/>`,
  sprechen: `<path class="b" d="M5 8h26a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H15l-6 5v-5H5a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z"/><path class="y" d="M43 19H22a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12l5.4 5v-5H43a3 3 0 0 0 3-3V22a3 3 0 0 0-3-3Z"/><g class="w"><circle cx="11" cy="17" r="1.8"/><circle cx="17.4" cy="17" r="1.8"/><circle cx="23.8" cy="17" r="1.8"/></g><path class="-Y" stroke-width="2.4" d="M25 26h14M25 30.4h9"/>`,
  plaudern: `<path class="r" d="M5 8h26a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H15l-6 5v-5H5a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z"/><path class="c" d="M43 19H22a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12l5.4 5v-5H43a3 3 0 0 0 3-3V22a3 3 0 0 0-3-3Z"/><path class="w" d="M17.4 21c-3.6-2.4-5.4-4.2-5.4-6.4a2.7 2.7 0 0 1 5.4-.8 2.7 2.7 0 0 1 5.4.8c0 2.2-1.8 4-5.4 6.4Z"/><g class="R"><circle cx="27" cy="27" r="1.8"/><circle cx="32.4" cy="27" r="1.8"/><circle cx="37.8" cy="27" r="1.8"/></g>`,
  briefkasten: `<path class="H" d="M22 34h4v10h-4z"/><path class="y" d="M8 18a10 10 0 0 1 10-10h12a10 10 0 0 1 10 10v16H8Z"/><path class="Y" d="M8 30h32v4H8z"/><rect class="k" x="14" y="16" width="20" height="3" rx="1.5"/><circle class="b" cx="24" cy="25" r="3.4"/><path class="-b" stroke-width="2" d="M18 25h-4"/>`,
  /* ---------- Geist ---------- */
  buch: `<path class="B" d="M3 14a2 2 0 0 1 2-2h38a2 2 0 0 1 2 2v25H27.6L24 41.4 20.4 39H3Z"/><path class="w" d="M6 11c6.4-2.4 13-1.6 18 2.2V37c-5-3.4-11.6-4.2-18-2Z"/><path class="c" d="M42 11c-6.4-2.4-13-1.6-18 2.2V37c5-3.4 11.6-4.2 18-2Z"/><path class="-e" stroke-width="1.6" d="M10 17.4c3-.8 6-.6 9 .6M10 22.4c3-.8 6-.6 9 .6M10 27.4c3-.8 6-.6 9 .6M29 18c3-1.2 6-1.4 9-.6M29 23c3-1.2 6-1.4 9-.6"/><path class="r" d="M31 9h4.6v13l-2.3-2.2L31 22Z"/>`,
  lesezeichen: `<path class="c" d="M12 8h26v32H12z"/><path class="g" d="M9 6h24a2 2 0 0 1 2 2v30a2 2 0 0 1-2 2H9Z"/><path class="G" d="M9 6h4v34H9z"/><rect class="c" x="17" y="13" width="13" height="7" rx="1"/><path class="r" d="M26 34h5v10l-2.5-2.4L26 44Z"/><path class="y" d="M39 6l1.5 3.2 3.5.4-2.6 2.4.7 3.4-3.1-1.8-3.1 1.8.7-3.4-2.6-2.4 3.5-.4Z"/>`,
  kopfhoerer: `<path class="-B" stroke-width="4" d="M9 28v-4a15 15 0 0 1 30 0v4"/><rect class="r" x="5" y="25" width="10" height="16" rx="4"/><rect class="r" x="33" y="25" width="10" height="16" rx="4"/><rect class="R" x="10" y="27" width="5" height="12" rx="2"/><rect class="R" x="33" y="27" width="5" height="12" rx="2"/>`,
  feder: `<path class="B" d="M6 36h16v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3Z"/><path class="b" d="M9.4 31h9.2v5H9.4z"/><path class="y" d="M43 4C30 5 20 14 17.4 27.4c-.4 2-.4 4 0 5.4 1.6-.4 3.6-1.6 5.4-3.4C33 21 40 13 43 4Z"/><path class="-Y" stroke-width="1.8" d="M42 5 15 34"/><path class="-Y" stroke-width="1.6" d="M30 12l3 4M25 17.4l3.4 3.8"/>`,
  tagebuch: `<path class="c" d="M12 6h27v36H12z"/><path class="r" d="M9 5h26a2 2 0 0 1 2 2v34a2 2 0 0 1-2 2H9Z"/><path class="R" d="M9 5h4v38H9z"/><rect class="c" x="18" y="12" width="13" height="8" rx="1"/><path class="-Y" stroke-width="1.6" d="M20.4 16h8"/><path class="y" d="M33 26h9v6h-9z"/><circle class="Y" cx="38" cy="29" r="1.4"/>`,
  raetsel: `<rect class="w" x="5" y="7" width="30" height="30" rx="2"/><path class="k" d="M15 7h10v10H15zM5 27h10v10H5zM25 17h10v10H25z" opacity=".85"/><path class="-e" stroke-width="1.4" d="M15 7v30M25 7v30M5 17h30M5 27h30"/><rect class="-e" stroke-width="1.6" x="5" y="7" width="30" height="30" rx="2"/><path class="y" d="M40 12l5 5-16 16-6 1 1-6Z"/><path class="r" d="M40 12l2.5-2.5 5 5L45 17Z"/><path class="H" d="M24 28l5 5-6 1Z"/>`,
  radio: `<path class="-k" stroke-width="2" d="M14 12 34 5"/><rect class="h" x="4" y="12" width="40" height="28" rx="6"/><rect class="c" x="9" y="17" width="18" height="18" rx="9"/><path class="-h" stroke-width="1.6" d="M11 22h14M10 26h16M11 30h14"/><rect class="y" x="30" y="17" width="10" height="7" rx="1.4"/><path class="-R" stroke-width="1.4" d="M35 17.6v5.8"/><circle class="H" cx="32.4" cy="31" r="2.4"/><circle class="H" cx="38.6" cy="31" r="2.4"/><path class="H" d="M10 40h5v3h-5zM33 40h5v3h-5z"/>`,
  funke: `<path class="y" d="M20 4c1.4 9 4.6 12.4 14 14-9.4 1.6-12.6 5-14 14-1.4-9-4.6-12.4-14-14 9.4-1.6 12.6-5 14-14Z"/><path class="r" d="M37 26c.8 5 2.6 7 7.6 7.8-5 .8-6.8 2.8-7.6 7.8-.8-5-2.6-7-7.6-7.8 5-.8 6.8-2.8 7.6-7.8Z"/><circle class="b" cx="10" cy="38" r="3"/>`,
  maske: `<path class="R" d="M3 5h42v6H3z"/><path class="r" d="M3 9h12c0 10 3 22 8 32H3Z"/><path class="r" d="M45 9H33c0 10-3 22-8 32h20Z"/><path class="y" d="M3 9c6 4 15 4 21 0 6 4 15 4 21 0v4c-6 3-15 3-21 0-6 3-15 3-21 0Z"/><path class="-R" stroke-width="1.6" d="M8 14c1 9 3 18 7 27M38 14c-1 9-3 18-7 27"/><rect class="H" x="3" y="41" width="42" height="3" rx="1"/>`,
  lupe: `<path class="H" d="M28 31l4-4 12 12a2.8 2.8 0 0 1-4 4Z"/><circle class="B" cx="19" cy="19" r="15"/><circle class="s" cx="19" cy="19" r="11"/><path class="w" d="M12 15a8 8 0 0 1 6-5.4" stroke="none"/><path class="-w" stroke-width="2.6" d="M12.4 16.4a8 8 0 0 1 5-5"/>`,
  note: `<path class="B" d="M16 12 40 6v24h-4.4V13.6L20.4 17.4V36H16Z"/><ellipse class="B" cx="12.4" cy="36.4" rx="6.4" ry="5" transform="rotate(-18 12.4 36.4)"/><ellipse class="B" cx="32" cy="30.6" rx="6.4" ry="5" transform="rotate(-18 32 30.6)"/><ellipse class="w" cx="10.4" cy="35" rx="2" ry="1.2" transform="rotate(-18 10.4 35)" opacity=".7"/><path class="y" d="M41 34c.6 3.4 1.8 4.6 5 5.2-3.2.6-4.4 1.8-5 5.2-.6-3.4-1.8-4.6-5-5.2 3.2-.6 4.4-1.8 5-5.2Z"/>`,
  /* ---------- Draußen / Natur ---------- */
  sonne: `<g class="y"><path d="M24 2l3.2 7h-6.4zM24 46l-3.2-7h6.4zM2 24l7-3.2v6.4zM46 24l-7 3.2v-6.4zM8.4 8.4l7.2 2.8-4.4 4.4zM39.6 39.6l-7.2-2.8 4.4-4.4zM8.4 39.6l2.8-7.2 4.4 4.4zM39.6 8.4l-2.8 7.2-4.4-4.4z"/></g><circle class="r" cx="24" cy="24" r="11"/><circle class="y" cx="24" cy="24" r="8"/>`,
  blatt: `<path class="r" d="M24 4c8 6 14 15 13 24-1 7-6 11-13 11S12 35 11 28c-1-9 5-18 13-24Z"/><path class="-R" stroke-width="2" d="M24 9v36M24 20l-6-4M24 20l6-4M24 28l-8-5M24 28l8-5"/><path class="y" d="M35 6c4 0 7 3 7 7-4 0-7-3-7-7Z"/>`,
  blume: `<path class="-g" stroke-width="2.6" d="M24 30V16M24 26c-5 0-8-3-9-7M24 23c5 0 8-3 9-7"/><path class="g" d="M14 18c-3-4 0-7 3-6 1 3 0 5-3 6ZM34 15c3-4 0-7-3-6-1 3 0 5 3 6Z"/><g class="r"><circle cx="24" cy="8" r="3.4"/><circle cx="20" cy="11" r="3.4"/><circle cx="28" cy="11" r="3.4"/><circle cx="21.6" cy="15" r="3.4"/><circle cx="26.4" cy="15" r="3.4"/></g><circle class="y" cx="24" cy="12" r="2"/><path class="h" d="M13 29h22l-3 13a2 2 0 0 1-2 1.6H18a2 2 0 0 1-2-1.6Z"/><rect class="H" x="11" y="28" width="26" height="5" rx="1.4"/>`,
  bank: `<path class="k" d="M10 30h3v12h-3zM35 30h3v12h-3z"/><rect class="g" x="5" y="10" width="38" height="5" rx="1.4"/><rect class="g" x="5" y="17" width="38" height="5" rx="1.4"/><rect class="G" x="4" y="26" width="40" height="5" rx="1.4"/><path class="k" d="M9 8h3v19H9zM36 8h3v19h-3z"/>`,
  kamera: `<rect class="e" x="14" y="8" width="12" height="6" rx="1.4"/><rect class="B" x="4" y="12" width="40" height="27" rx="4"/><path class="c" d="M4 18h40v4H4z"/><circle class="e" cx="24" cy="26" r="10"/><circle class="k" cx="24" cy="26" r="7"/><circle class="b" cx="24" cy="26" r="4.4"/><circle class="w" cx="22" cy="24" r="1.6"/><rect class="y" x="35" y="14.4" width="6" height="2.4" rx="1"/><circle class="r" cx="10" cy="15" r="1.8"/>`,
  lampe: `<path class="c" d="M12 40h24l-5-8H17z" opacity=".55"/><path class="y" d="M15 6h18l7 17H8Z"/><path class="Y" d="M8 21h32l.8 2H7.2z"/><path class="H" d="M22.6 23h2.8v13h-2.8z"/><path class="h" d="M15 36h18a2 2 0 0 1 2 2v3H13v-3a2 2 0 0 1 2-2Z"/><path class="-R" stroke-width="1.6" d="M31 23v6"/><circle class="R" cx="31" cy="30" r="1.4"/>`,
  bett: `<path class="h" d="M4 14a3 3 0 0 1 6 0v28H4zM38 24a3 3 0 0 1 6 0v18h-6z"/><rect class="w" x="10" y="20" width="12" height="7" rx="3"/><path class="b" d="M10 27h31a3 3 0 0 1 3 3v6H10Z"/><path class="B" d="M18 27h4v9h-4zM28 27h4v9h-4z" opacity=".5"/><path class="H" d="M4 36h40v3H4z"/>`,
  kreuz: `<rect class="w" x="6" y="12" width="36" height="27" rx="4"/><path class="h" d="M17 12V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3h-3V9h-8v3Z"/><path class="H" d="M6 21h36v2H6z" opacity=".35"/><path class="r" d="M21 18h6v6h6v6h-6v6h-6v-6h-6v-6h6Z"/>`,
  waerme: `<rect class="R" x="20" y="4" width="8" height="6" rx="1.4"/><path class="r" d="M14 12h20a4 4 0 0 1 4 4v22a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V16a4 4 0 0 1 4-4Z"/><path class="-p" stroke-width="2.2" d="M14 20h20M14 26h20M14 32h20M14 38h20"/><path class="w" d="M24 33c-4-2.6-6-4.6-6-7a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2.4-2 4.4-6 7Z"/>`,
  glas: `<path class="s" d="M11 8h26l-3.4 32a3 3 0 0 1-3 2.6H17.4a3 3 0 0 1-3-2.6Z" opacity=".6"/><path class="b" d="M12.8 22h22.4l-1.6 18a3 3 0 0 1-3 2.6H17.4a3 3 0 0 1-3-2.6Z"/><path class="-w" stroke-width="2" d="M16 12l2 26" opacity=".8"/><circle class="y" cx="33" cy="10" r="6"/><circle class="c" cx="33" cy="10" r="3.6"/><path class="-y" stroke-width="1.2" d="M33 6.4v7.2M29.4 10h7.2"/>`,
  topf: `<path class="-k" stroke-width="2.8" d="M5 22h4M39 22h4"/><path class="r" d="M8 18h32v17a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7Z"/><path class="R" d="M6 15h36a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/><rect class="k" x="20" y="10" width="8" height="5" rx="2"/><g class="w"><circle cx="15" cy="26" r="2"/><circle cx="24" cy="30" r="2"/><circle cx="33" cy="26" r="2"/><circle cx="19" cy="35" r="2"/><circle cx="29" cy="35" r="2"/></g><path class="-e" stroke-width="2.2" d="M16 4c-2 2 2 3 0 5M32 4c-2 2 2 3 0 5"/>`,
  pinsel: `<path class="c" d="M22 6C10 6 3 14 3 23c0 8 6 14 13 14 3 0 4-2 4-4s-2-3-2-5 2-3 4-3h7c5 0 9-3 9-8C38 11 31 6 22 6Z"/><circle class="r" cx="13" cy="18" r="3.2"/><circle class="y" cx="21" cy="13" r="3.2"/><circle class="b" cx="30" cy="15" r="3.2"/><circle class="g" cx="11" cy="27" r="3.2"/><path class="H" d="M44 22 31 36l-2.6-2.6 13-14Z"/><path class="k" d="M28.4 33.4 31 36c-1 3-3.6 5-7.6 5.4 1-3.2 2.2-6 5-8Z"/>`,
  kiste: `<path class="Y" d="M6 16 24 9l18 7-18 7Z"/><path class="y" d="M6 16l18 7v19L6 35Z"/><path class="h" d="M42 16 24 23v19l18-7Z"/><path class="c" d="M12.6 18.6l18-7 4.6 1.8-18 7Z"/><path class="c" d="M17.2 20.4v6.2l-4.6-1.8v-6.2Z" opacity=".85"/>`,
  stern: `<path class="y" d="M24 4l6 12.6 13.6 1.8-10 9.4 2.6 13.6L24 34.8l-12.2 6.6 2.6-13.6-10-9.4L18 16.6Z"/><path class="Y" d="M24 4v30.8l-12.2 6.6 2.6-13.6-10-9.4L18 16.6Z" opacity=".55"/>`,
  flamme: `<path class="y" d="M24 6c6 7 9 11 9 16a9 9 0 0 1-18 0c0-3 1.4-5 3-7 0 3 1.6 4.6 3 4.6 0-4.6 1-9 3-13.6Z"/><path class="r" d="M24 16c3 3.6 4.4 6 4.4 8.4a4.4 4.4 0 0 1-8.8 0c0-2.4 1.6-5 4.4-8.4Z"/><path class="e" d="M10 33h28v5a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z"/><rect class="w" x="12" y="31" width="24" height="4" rx="2"/>`,
  kerze: `<path class="y" d="M24 4c3 3.6 4.4 6.4 4.4 8.6a4.4 4.4 0 0 1-8.8 0C19.6 10.4 21 7.6 24 4Z"/><rect class="w" x="18" y="18" width="12" height="20" rx="1.4"/><path class="c" d="M18 18h12v4H18z"/><path class="r" d="M10 38h28v3a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3Z"/>`,
  windrad: `<path class="H" d="M23 22h2.6v23H23z"/><path class="r" d="M24 23 13 5c7-2 13 3 11 18Z"/><path class="y" d="M24 23 42 12c2 7-3 13-18 11Z"/><path class="b" d="M24 23l11 18c-7 2-13-3-11-18Z"/><path class="g" d="M24 23 6 34c-2-7 3-13 18-11Z"/><circle class="c" cx="24.3" cy="23" r="2.6"/>`,
  /* ---------- Sorge / Alltag ---------- */
  handy: `<rect class="B" x="13" y="4" width="22" height="40" rx="4"/><rect class="s" x="16" y="9" width="16" height="27" rx="1"/><path class="y" d="M19 13h10v6H19z"/><path class="w" d="M19 22h10v2H19zM19 26h7v2h-7z"/><circle class="e" cx="24" cy="40" r="1.8"/>`,
  schild: `<path class="B" d="M24 4 41 10v11c0 11-7 19-17 23C14 40 7 32 7 21V10Z"/><path class="b" d="M24 4v40c10-4 17-12 17-23V10Z"/><path class="-w" stroke-width="3.4" d="M16 24l6 6 11-12"/>`,
  schluessel: `<circle class="y" cx="14" cy="24" r="10"/><circle class="c" cx="14" cy="24" r="4"/><path class="y" d="M22 21h22v6h-3v6h-5v-6h-3v4h-5v-4h-6Z"/><path class="Y" d="M22 25h22v2H22z"/>`,
  karten: `<g transform="rotate(-12 18 26)"><rect class="w" x="6" y="9" width="22" height="31" rx="3"/><rect class="-e" stroke-width="1.4" x="6" y="9" width="22" height="31" rx="3"/><path class="k" d="M17 18c-3.6 3.6-5.6 5.4-5.6 7.6a2.8 2.8 0 0 0 4.8 2l-1 3.6h3.6l-1-3.6a2.8 2.8 0 0 0 4.8-2c0-2.2-2-4-5.6-7.6Z"/></g><g transform="rotate(9 32 24)"><rect class="w" x="20" y="8" width="22" height="31" rx="3"/><rect class="-e" stroke-width="1.4" x="20" y="8" width="22" height="31" rx="3"/><path class="r" d="M31 31c-5-3.4-7.4-6-7.4-8.6a3.7 3.7 0 0 1 7.4-1 3.7 3.7 0 0 1 7.4 1c0 2.6-2.4 5.2-7.4 8.6Z"/></g>`,
  glocke: `<path class="y" d="M24 6a3 3 0 0 1 3 3v1c6 1.4 10 6.6 10 13v8l4 5H7l4-5v-8c0-6.4 4-11.6 10-13V9a3 3 0 0 1 3-3Z"/><path class="Y" d="M24 10v26H7l4-5v-8c0-6.4 4-11.6 10-13Z" opacity=".45"/><circle class="r" cx="24" cy="40" r="4"/><path class="-w" stroke-width="2" d="M16 22c0-3 1.6-5.4 4-6.6" opacity=".8"/>`,
  rucksack: `<path class="H" d="M18 6h12v6h-3V9h-6v3h-3z"/><path class="g" d="M10 20a10 10 0 0 1 10-10h8a10 10 0 0 1 10 10v20a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3Z"/><path class="G" d="M10 20a10 10 0 0 1 10-10h8a10 10 0 0 1 10 10v2H10Z"/><rect class="h" x="14" y="28" width="20" height="11" rx="2.4"/><path class="y" d="M22 30h4v4h-4z"/><path class="-H" stroke-width="2.4" d="M17 22v6M31 22v6"/>`,
  buegel: `<path class="-H" stroke-width="2.4" d="M24 12V9.6a3.2 3.2 0 1 1 3.4-3.2"/><path class="h" d="M24 11 4 22a1.4 1.4 0 0 0 .7 2.6h38.6A1.4 1.4 0 0 0 44 22Z"/><path class="c" d="M24 14.4 10.4 22h27.2Z"/><path class="r" d="M17 22h14l2 4-3 2 6 16H12l6-16-3-2Z"/><path class="R" d="M17 28h14v3H17z"/>`,
  laden: `<rect class="c" x="6" y="18" width="36" height="25"/><path class="r" d="M3 8h42l-2 10H5Z"/><path class="w" d="M10 8h5l-1 10h-5zM20 8h5v10h-5zM30 8h5l1 10h-5zM40 8h5l-1 10h-3z"/><path class="r" d="M5 18c0 2.2 1.8 4 4 4s4-1.8 4-4c0 2.2 1.8 4 4 4s4-1.8 4-4c0 2.2 1.8 4 4 4s4-1.8 4-4c0 2.2 1.8 4 4 4s4-1.8 4-4c0 2.2 1.8 4 4 4s3-1.4 3-4Z"/><rect class="s" x="10" y="26" width="14" height="11" rx="1"/><rect class="g" x="28" y="26" width="9" height="17" rx="1"/><circle class="y" cx="34.6" cy="35" r="1"/><path class="H" d="M4 42h40v3H4z"/>`,
  geschenk: `<rect class="r" x="7" y="18" width="34" height="24" rx="2"/><rect class="R" x="5" y="13" width="38" height="8" rx="2"/><path class="y" d="M21 13h6v29h-6z"/><path class="y" d="M24 13c-4-6-11-7-11-2 0 3 6 3 11 2Zm0 0c4-6 11-7 11-2 0 3-6 3-11 2Z"/>`,
  herz: `<path class="r" d="M24 42C11 33 5 26 5 18.4A9.4 9.4 0 0 1 24 13a9.4 9.4 0 0 1 19 5.4C43 26 37 33 24 42Z"/><path class="-w" stroke-width="2.4" d="M11 17a5 5 0 0 1 5-4" opacity=".7"/>`,
  uhr: `<path class="r" d="M7 12a6 6 0 0 1 10-3ZM41 12a6 6 0 0 0-10-3Z"/><path class="-k" stroke-width="3" d="M14 40l-3 4M34 40l3 4"/><circle class="r" cx="24" cy="26" r="16"/><circle class="w" cx="24" cy="26" r="12.4"/><path class="-k" stroke-width="2.6" d="M24 18v8l5 3"/><circle class="k" cx="24" cy="26" r="1.8"/>`,
  setzkasten: `<rect class="h" x="4" y="6" width="40" height="36" rx="2"/><path class="c" d="M7 9h10v9H7zM19 9h10v9H19zM31 9h10v9H31zM7 21h10v9H7zM19 21h10v9H19zM31 21h10v9H31zM7 33h10v6H7zM19 33h10v6H19zM31 33h10v6H31z"/><circle class="r" cx="12" cy="14" r="3"/><path class="b" d="M21 16l3-5 3 5Z"/><rect class="y" x="33" y="11" width="6" height="5" rx="1"/><circle class="g" cx="24" cy="26" r="3"/><path class="y" d="M12 22.4l1.4 2.6 2.6.4-2 1.8.6 2.6-2.6-1.4-2.6 1.4.6-2.6-2-1.8 2.6-.4Z"/>`,
  werkzeug: `<path class="e" d="M30 4a9 9 0 0 0-8.6 11.6L5 32l5 5 16.4-16.4A9 9 0 0 0 38 10l-5 5-4-1-1-4 5-5a9 9 0 0 0-3-1Z"/><path class="r" d="M5 32l5 5-3 3a3.5 3.5 0 0 1-5-5Z"/>`,
  stift: `<path class="y" d="M34 6l8 8-24 24-8-8Z"/><path class="r" d="M34 6l3-3a2.8 2.8 0 0 1 4 0l4 4a2.8 2.8 0 0 1 0 4l-3 3Z"/><path class="c" d="M10 30l8 8-11 3Z"/><path class="k" d="M7.6 37.6 7 41l3.4-.6Z"/>`,
  karte: `<path class="c" d="M4 10l13-4 14 4 13-4v32l-13 4-14-4-13 4Z"/><path class="Y" d="M17 6v32l14 4V10Z" opacity=".35"/><path class="-g" stroke-width="2.4" stroke-dasharray="3 3" d="M8 32c6-8 12-6 16-10s6-8 12-8"/><path class="r" d="M30 14a6 6 0 0 1 12 0c0 5-6 11-6 11s-6-6-6-11Z"/><circle class="w" cx="36" cy="14" r="2.2"/>`,
  /* ---------- Natur / Laden-Waren ---------- */
  vogel: `<path class="H" d="M4 40h40v3H4z"/><path class="h" d="M10 34c0-9 6-16 15-16 3 0 5-3 8-3 4 0 7 3 7 7l5 2-5 1.4c-1 7-7 12.6-15 12.6H16l-5 3v-4c-1-1-1-2-1-3Z"/><path class="r" d="M25 22c6 0 10 4 10 9 0 4-4 6-9 6-5 0-8-3-8-7s3-8 7-8Z"/><circle class="k" cx="35" cy="20" r="1.6"/><path class="H" d="M10 30c-4 0-7 2-8 4l9-1Z"/>`,
  igel: `<path class="H" d="M6 34c0-11 8-19 18-19 7 0 13 4 16 10l5 2-3 3c-1 4-5 7-10 7H10a4 4 0 0 1-4-3Z"/><path class="h" d="M30 21c5 1 9 4 10 9l5 1-3 3c-1 3-5 4-9 4h-5c2-3 3-8 2-17Z"/><g class="H"><path d="M8 26l-4-3 6 0zM12 19l-2-5 5 2zM19 15l0-5 4 4zM27 15l3-4 1 5z"/></g><circle class="k" cx="38" cy="27" r="1.6"/><circle class="k" cx="45" cy="31" r="1.6"/><path class="k" d="M14 38h4v4h-4zM30 38h4v4h-4z"/>`,
  schale: `<path class="e" d="M18 34h12l2 8H16z"/><path class="e" d="M4 24h40c0 6-8 10-20 10S4 30 4 24Z"/><ellipse class="s" cx="24" cy="24" rx="18" ry="3.6"/><path class="h" d="M28 18c0-3 3-6 6-6 2 0 3 1 4 2l3 1-3 1c0 3-3 6-7 6h-3Z"/><path class="r" d="M30 17c2 0 4 1 4 3l-4 1Z"/><circle class="k" cx="36" cy="14" r="1"/>`,
  decke: `<path class="r" d="M5 12h38v18H5z"/><path class="R" d="M5 30h38l-3 8H8Z"/><path class="-c" stroke-width="2.4" d="M5 18h38M5 24h38M14 12v18M24 12v18M34 12v18"/><path class="-y" stroke-width="1.6" d="M8 38v4M14 38v4M20 38v4M26 38v4M32 38v4M38 38v4"/>`,
  regen: `<path class="e" d="M12 30a8 8 0 0 1-1-16 11 11 0 0 1 21-2 8 8 0 0 1 5 15 7 7 0 0 1-4 3Z"/><path class="w" d="M15 18a6 6 0 0 1 6-5" stroke="none"/><g class="b"><path d="M14 34l3 0-2 7h-3zM23 34h3l-2 7h-3zM32 34h3l-2 7h-3z"/></g>`,
  wolke: `<path class="e" d="M12 36a9 9 0 0 1-1-18 12 12 0 0 1 23-2 9 9 0 0 1 2 18 7 7 0 0 1-3 2Z"/><path class="w" d="M14 30a6 6 0 0 1 0-8" opacity=".6"/>`,
  mond: `<path class="y" d="M30 5a19 19 0 1 0 13 30A16 16 0 0 1 30 5Z"/><circle class="Y" cx="17" cy="20" r="2.6" opacity=".6"/><circle class="Y" cx="22" cy="32" r="1.8" opacity=".6"/>`,
  fernseher: `<path class="-k" stroke-width="2" d="M18 4l6 6 7-7"/><rect class="h" x="3" y="10" width="42" height="30" rx="5"/><rect class="s" x="7" y="14" width="27" height="22" rx="5"/><path class="w" d="M10 18a4 4 0 0 1 4-2h4" opacity=".7"/><circle class="c" cx="39.6" cy="19" r="2.6"/><circle class="c" cx="39.6" cy="27" r="2.6"/><path class="-H" stroke-width="1.6" d="M37 32.6h5.4M37 35h5.4"/><path class="H" d="M10 40h4l-1.4 5h-3zM34 40h4l1.4 5h-3z"/>`,
  bingo: `<rect class="c" x="5" y="5" width="38" height="38" rx="3"/><path class="-h" stroke-width="1.4" d="M17.6 5v38M30.4 5v38M5 17.6h38M5 30.4h38"/><g class="g"><circle cx="11.3" cy="11.3" r="4.4"/><circle cx="24" cy="24" r="4.4"/><circle cx="36.7" cy="36.7" r="4.4"/></g><circle class="r" cx="36.7" cy="11.3" r="4.4"/><path class="G" d="M24 31.6l2 4.6h-4Z"/><path class="G" d="M11.3 32l3 5h-6Z"/>`,
  /* ---------- Navigation ---------- */
  heute: `<path class="y" d="M10 30a14 14 0 0 1 28 0Z"/><g class="y"><path d="M24 6l2.4 6h-4.8zM8.6 13.6l5.6 3-3.4 3.4zM39.4 13.6l-2.2 6.4-3.4-3.4zM3 28l6-1.6v3.6zM45 28l-6 2v-3.6z"/></g><path class="r" d="M16 30a8 8 0 0 1 16 0Z"/><rect class="b" x="4" y="32" width="40" height="4" rx="2"/><rect class="s" x="10" y="39" width="28" height="3" rx="1.5"/>`,
  ideen: `<path class="y" d="M24 4a14 14 0 0 1 8.4 25.2c-1.6 1.2-2.4 2.6-2.4 4.8v1H18v-1c0-2.2-.8-3.6-2.4-4.8A14 14 0 0 1 24 4Z"/><path class="Y" d="M24 4a14 14 0 0 1 8.4 25.2c-1.6 1.2-2.4 2.6-2.4 4.8v1h-6Z" opacity=".5"/><path class="-w" stroke-width="2.4" d="M16.4 16a8 8 0 0 1 5-5.4" opacity=".85"/><rect class="e" x="18" y="35" width="12" height="4" rx="1"/><rect class="k" x="19" y="39" width="10" height="4" rx="2" opacity=".75"/>`,
  lichtung: `<path class="G" d="M38 6l7 14h-3.4L46 30H30l4.4-10H31Z"/><path class="H" d="M37 30h2.4v6H37z"/><path class="B" d="M2 24 17 12l15 12-2 2.4L17 16 4 26.4Z"/><path class="r" d="M6 24 17 15l11 9v16H6Z"/><path class="w" d="M6 24h2v16H6zM26 24h2v16h-2z"/><rect class="s" x="10" y="26" width="6" height="6" rx=".6"/><rect class="B" x="19" y="28" width="5" height="12" rx=".6"/><path class="g" d="M2 40h44v4H2z"/>`
};
/* Waren im Kramladen (eigene Bilder, gleicher Stil) */
const WARE_QUELLE = {
  patience: ICF_QUELLE.karten,
  rueckenmotiv: `<g transform="rotate(-8 24 24)"><rect class="G" x="11" y="5" width="26" height="38" rx="3"/><rect class="-c" stroke-width="1.6" x="14" y="8" width="20" height="32" rx="2"/><ellipse class="h" cx="24" cy="25" rx="6" ry="9"/><path class="-H" stroke-width="1.4" d="M18.4 21h11.2M18 25h12M18.4 29h11.2M21 17l6 16M27 17l-6 16"/><path class="H" d="M23 13h2v4h-2z"/></g>`,
  memory: `<g transform="rotate(-10 16 24)"><rect class="G" x="4" y="8" width="22" height="30" rx="3"/><rect class="-c" stroke-width="1.4" x="7" y="11" width="16" height="24" rx="2"/><circle class="y" cx="15" cy="23" r="3"/></g><g transform="rotate(8 32 24)"><rect class="w" x="22" y="8" width="22" height="30" rx="3"/><rect class="-e" stroke-width="1.4" x="22" y="8" width="22" height="30" rx="3"/><circle class="p" cx="33" cy="22" r="6"/><path class="e" d="M27 21c0-5 3-7 6-7s6 2 6 7c-2-2-4-3-6-3s-4 1-6 3Z"/><path class="b" d="M26 34c1-4 4-6 7-6s6 2 7 6Z"/></g>`,
  igelhaus: `<path class="h" d="M3 42C4 22 13 10 24 10s20 12 21 32Z"/><g class="Y"><ellipse cx="14" cy="22" rx="5" ry="2.4" transform="rotate(-35 14 22)"/><ellipse cx="33" cy="17" rx="5" ry="2.4" transform="rotate(25 33 17)"/><ellipse cx="39" cy="32" rx="5" ry="2.4" transform="rotate(55 39 32)"/><ellipse cx="9" cy="35" rx="4" ry="2" transform="rotate(-60 9 35)"/></g><g class="r"><ellipse cx="24" cy="15" rx="4" ry="2" transform="rotate(10 24 15)"/><ellipse cx="26" cy="27" rx="4" ry="2" transform="rotate(-20 26 27)"/></g><path class="k" d="M15 42a9 9 0 0 1 18 0Z"/><path class="c" d="M19 42a5 4 0 0 1 10 0Z"/><circle class="k" cx="24" cy="40" r="1"/>`,
  rosenbogen: `<path class="H" d="M8 44V22a16 16 0 0 1 32 0v22h-5V22a11 11 0 0 0-22 0v22Z"/><g class="g"><ellipse cx="10" cy="30" rx="3" ry="1.6" transform="rotate(-40 10 30)"/><ellipse cx="16" cy="12" rx="3" ry="1.6" transform="rotate(30 16 12)"/><ellipse cx="32" cy="12" rx="3" ry="1.6" transform="rotate(-30 32 12)"/><ellipse cx="38" cy="30" rx="3" ry="1.6" transform="rotate(40 38 30)"/><ellipse cx="38" cy="40" rx="3" ry="1.6" transform="rotate(-30 38 40)"/></g><g class="r"><circle cx="10" cy="22" r="3.2"/><circle cx="12" cy="36" r="2.8"/><circle cx="21" cy="8.6" r="3.2"/><circle cx="29" cy="8.6" r="3.2"/><circle cx="38" cy="22" r="3.2"/><circle cx="36" cy="35" r="2.8"/></g><g class="p"><circle cx="13.4" cy="14.4" r="2.6"/><circle cx="35" cy="14.4" r="2.6"/></g><rect class="g" x="2" y="43" width="44" height="3" rx="1"/>`,
  haengematte: `<path class="H" d="M4 6h5v38H4zM39 6h5v38h-5z"/><circle class="G" cx="6.5" cy="7" r="6"/><circle class="G" cx="41.5" cy="7" r="6"/><path class="-k" stroke-width="1.4" d="M9 16l5 6M39 16l-5 6"/><path class="r" d="M12 21c4 12 20 12 24 0-4 5-20 5-24 0Z"/><path class="-y" stroke-width="2" d="M14 26c5 4 15 4 20 0"/><path class="g" d="M2 44h44v2H2z"/>`,
  sternbilder: `<circle class="B" cx="24" cy="24" r="21"/><path class="-s" stroke-width="1.2" d="M11 22l7 2 7-1 6 4 2 7 9 1M31 27l6-6" opacity=".7"/><g class="y"><circle cx="11" cy="22" r="1.8"/><circle cx="18" cy="24" r="1.8"/><circle cx="25" cy="23" r="1.8"/><circle cx="31" cy="27" r="1.8"/><circle cx="33" cy="34" r="1.8"/><circle cx="42" cy="35" r="1.2"/><circle cx="37" cy="21" r="1.8"/></g><g class="w"><circle cx="17" cy="11" r="1"/><circle cx="30" cy="10" r="1"/><circle cx="15" cy="36" r="1"/><circle cx="24" cy="40" r="1"/></g><path class="c" d="M36 6a8 8 0 1 0 6 10 6 6 0 0 1-6-10Z"/>`,
  klangschale: `<path class="-b" stroke-width="2.2" d="M8 16c-3-3-3-7 0-10M40 16c3-3 3-7 0-10M13 15c-2-2-2-5 0-7M35 15c2-2 2-5 0-7"/><path class="y" d="M6 24h36c0 10-8 16-18 16S6 34 6 24Z"/><ellipse class="Y" cx="24" cy="24" rx="18" ry="4"/><path class="-w" stroke-width="2" d="M11 29c2 4 6 6 10 6.6" opacity=".7"/><path class="H" d="M28 10l16 8-1.4 2.6-16-8Z"/><rect class="r" x="14" y="41" width="20" height="4" rx="2"/>`,
  spieluhr: `<path class="-B" stroke-width="2.4" d="M17 16V6l9-2v10"/><circle class="B" cx="14.6" cy="16.4" r="3"/><circle class="B" cx="23.6" cy="14.4" r="3"/><rect class="h" x="6" y="26" width="32" height="16" rx="2"/><path class="H" d="M4 26h36v-3a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3Z"/><path class="-y" stroke-width="1.8" d="M10 33h24"/><path class="-k" stroke-width="2.4" d="M38 33h5v-5"/><circle class="r" cx="43" cy="27" r="2.6"/>`,
  regen: `<rect class="c" x="6" y="5" width="36" height="38" rx="2"/><rect class="s" x="10" y="9" width="28" height="30"/><path class="-c" stroke-width="3" d="M24 9v30M10 24h28"/><path class="-b" stroke-width="2" d="M14 12l-2 5M20 15l-2 5M30 11l-2 5M35 16l-2 5M14 27l-2 5M20 30l-2 5M30 28l-2 5M36 31l-2 5"/><rect class="h" x="3" y="41" width="42" height="4" rx="1"/>`,
  waldmorgen: `<circle class="c" cx="24" cy="24" r="21"/><circle class="y" cx="31" cy="17" r="7"/><path class="g" d="M3.4 32C10 28 18 29 24 31s13 1 20.6-1A21 21 0 0 1 3.4 32Z"/><path class="G" d="M13 6l7 14h-3l5 10H4l5-10H6Z"/><path class="H" d="M12 30h2.4v6H12z"/><path class="G" d="M38 16l4 8h-2l3 7H33l3-7h-2Z"/><path class="-k" stroke-width="1.6" d="M24 22q2-2 4 0q2-2 4 0"/>`,
  takt: `<path class="h" d="M16 44 21 6h6l5 38Z"/><path class="c" d="M19 38 22.4 10h3.2L29 38Z"/><path class="-k" stroke-width="2" d="M24 34 33 11"/><rect class="r" x="28" y="17" width="6" height="5" rx="1" transform="rotate(22 31 19.5)"/><rect class="H" x="12" y="41" width="24" height="4" rx="1"/>`,
  gedichte1: `<path class="c" d="M6 10c6-2 13-1.6 18 1.6V40c-5-3-12-3.6-18-1.6Z"/><path class="w" d="M42 10c-6-2-13-1.6-18 1.6V40c5-3 12-3.6 18-1.6Z"/><path class="-e" stroke-width="1.4" d="M10 16c3-.6 6-.4 9 .6M10 21c3-.6 6-.4 9 .6M28 17c3-1 6-1.2 9-.6M28 22c3-1 6-1.2 9-.6"/><path class="g" d="M28 36c2-8 8-12 13-12-1 7-6 11-13 12Z"/><circle class="r" cx="14" cy="31" r="3.2"/><circle class="y" cx="14" cy="31" r="1.2"/>`,
  gedichte2: `<path class="c" d="M6 10c6-2 13-1.6 18 1.6V40c-5-3-12-3.6-18-1.6Z"/><path class="w" d="M42 10c-6-2-13-1.6-18 1.6V40c5-3 12-3.6 18-1.6Z"/><path class="-e" stroke-width="1.4" d="M10 16c3-.6 6-.4 9 .6M10 21c3-.6 6-.4 9 .6M10 26c3-.6 6-.4 9 .6M28 17c3-1 6-1.2 9-.6"/><path class="-B" stroke-width="1.6" d="M28 37c4-6 9-9 13-10"/><path class="l" d="M41 27c-2-5 0-9 4-12 1 5-1 9-4 12Z"/>`,
  briefe: `<rect class="c" x="4" y="11" width="40" height="28" rx="2.4"/><path class="-Y" stroke-width="2" d="M5 13l19 15 19-15" opacity=".7"/><path class="r" d="M24 36c-5-3.4-7.4-5.6-7.4-8a3.4 3.4 0 0 1 7.4-1 3.4 3.4 0 0 1 7.4 1c0 2.4-2.4 4.6-7.4 8Z"/><rect class="b" x="34" y="14" width="7" height="8" rx="1"/>`,
  fragen: `<path class="c" d="M7 7h30a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H20l-9 8v-8H7a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z"/><path class="-b" stroke-width="3.4" d="M17 15a5 5 0 1 1 7 4.6c-1.4.7-2 1.6-2 3V24"/><circle class="b" cx="22" cy="28.6" r="2"/><path class="r" d="M36 32l8 3-2 9-8-2Z"/>`,
  tanzkarten: `<rect class="w" x="10" y="4" width="28" height="40" rx="3"/><rect class="-e" stroke-width="1.4" x="10" y="4" width="28" height="40" rx="3"/><g class="r"><ellipse cx="19" cy="35" rx="3.4" ry="5"/><ellipse cx="29" cy="26" rx="3.4" ry="5"/><ellipse cx="19" cy="17" rx="3.4" ry="5"/></g><g class="R"><circle cx="19" cy="42" r="0"/></g><path class="-l" stroke-width="1.6" stroke-dasharray="2 2.4" d="M21 31q4-3 6-1M21 21q4-2 6 0"/>`,
  rueckendala: `<g transform="rotate(6 24 24)"><rect class="B" x="11" y="5" width="26" height="38" rx="3"/><rect class="-c" stroke-width="1.6" x="14" y="8" width="20" height="32" rx="2"/><path class="r" d="M17 31l1.6-6.4c-1.2-.8-1.6-2.4-.6-3.6l3-3.6 1-3.4 2.4 1.6 3.6-.4 2 2.4-1 1.6-2.2-.2-.6 2.6 1.4 3.4.6 6h-2.2l-.8-4.4h-4.6l-.8 4.4Z"/><path class="-y" stroke-width="1.2" d="M20 24.6c1.4.8 3 .8 4.4 0"/><circle class="w" cx="26.6" cy="16.6" r=".9"/></g>`,
  rezepte3: `<ellipse class="e" cx="24" cy="40" rx="19" ry="3.4"/><path class="h" d="M6 28c0-9 8-15 18-15s18 6 18 15c0 6-7 10-18 10S6 34 6 28Z"/><path class="-H" stroke-width="2.6" d="M24 26c0-2 3-2 3 0 0 3-6 3-6 0 0-4 9-4 9 0 0 6-12 6-12 0 0-6 15-6 15 1"/><g class="w"><circle cx="15" cy="21" r="1"/><circle cx="31" cy="19" r="1"/><circle cx="34" cy="28" r="1"/><circle cx="13" cy="30" r="1"/><circle cx="22" cy="33" r="1"/></g>`,
  "g-karte-halle": `<g transform="rotate(-5 24 24)"><rect class="c" x="3" y="9" width="42" height="30" rx="2"/><rect class="-e" stroke-width="1.2" x="3" y="9" width="42" height="30" rx="2"/><rect class="r" x="34" y="12.6" width="8" height="9.4" rx=".6"/><path class="-w" stroke-width="1" stroke-dasharray="1.2 1.2" d="M34.6 13.2h6.8v8.2h-6.8Z"/><path class="-e" stroke-width="1.4" d="M26 14v22M29 26h12M29 30h12M29 34h9"/><path class="B" d="M8 35V22l2.4-5 2.4 5v13ZM15 35V22l2.4-5 2.4 5v13Z"/><path class="b" d="M8 35h12v-8H8Z" opacity=".55"/><circle class="y" cx="12" cy="15" r="0"/></g>`,
  "g-haendel-huhn": `<g transform="rotate(4 24 24)"><rect class="w" x="7" y="3" width="34" height="41" rx="1.6"/><rect class="-e" stroke-width="1.2" x="7" y="3" width="34" height="41" rx="1.6"/><rect class="s" x="10" y="6" width="28" height="27"/><path class="e" d="M15 33V27h10v6Z"/><path class="H" d="M17.4 27c0-4 .6-8 2.6-10 2 2 2.6 6 2.6 10Z"/><circle class="H" cx="20" cy="14" r="3"/><path class="H" d="M14 22l6-3 6 3-1 2-5-2-5 2Z"/><path class="y" d="M28 33c0-3 2-5 4.6-5 1 0 1.6-1.4 2.6-1.4 1.4 0 2.4 1 2.4 2.4l1.6.6-1.6.6c-.4 2-2.4 2.8-4.6 2.8Z"/><path class="r" d="M34.4 26.2c.4-1 1.4-1 1.8 0Z"/><circle class="k" cx="35.6" cy="28" r=".7"/></g>`,
  "g-halloren": `<rect class="R" x="4" y="13" width="40" height="27" rx="3"/><rect class="c" x="7" y="16" width="34" height="21" rx="2"/><g class="H"><circle cx="13" cy="22" r="3.4"/><circle cx="21" cy="22" r="3.4"/><circle cx="29" cy="22" r="3.4"/><circle cx="37" cy="22" r="3.4"/><circle cx="13" cy="31" r="3.4"/><circle cx="21" cy="31" r="3.4"/><circle cx="29" cy="31" r="3.4"/><circle cx="37" cy="31" r="3.4"/></g><g class="w" opacity=".5"><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><circle cx="28" cy="21" r="1"/><circle cx="36" cy="21" r="1"/><circle cx="12" cy="30" r="1"/><circle cx="20" cy="30" r="1"/><circle cx="28" cy="30" r="1"/><circle cx="36" cy="30" r="1"/></g><path class="y" d="M22 13h4v27h-4z"/><path class="y" d="M24 13c-3-5-9-6-9-2 0 2 5 3 9 2Zm0 0c3-5 9-6 9-2 0 2-5 3-9 2Z"/>`,
  orte2: ICF_QUELLE.karte,
  traenke: ICF_QUELLE.schale,
  rotkehlchen: ICF_QUELLE.vogel,
  rezepte1: ICF_QUELLE.topf,
  rezepte2: ICF_QUELLE.kuchen
};
/* Kurzschrift → Klassen (f-x Fläche, l-x Linie) */
const _icfKlassen = s => s.replace(/class="(-?)(\w)"/g, (m, l, c) => `class="${l ? "l" : "f"}-${c}"`);
const ICF = {}, WARE_ICF = {};
for (const k in ICF_QUELLE) ICF[k] = _icfKlassen(ICF_QUELLE[k]);
for (const k in WARE_QUELLE) WARE_ICF[k] = _icfKlassen(WARE_QUELLE[k]);
/* Diese bleiben bewusst einfarbig (Bedien-Zeichen, folgen der Textfarbe) */
const IC_EINFARBIG = new Set(["haken", "plus", "minus", "pfeil", "schliessen", "box", "boxhaken", "frage", "info", "zahnrad", "liste", "treppe", "schrift", "muenze"]);

function ic(name, cls = "icon") {
  const f = !IC_EINFARBIG.has(name) && ICF[name];
  if (f) return `<svg class="${cls} ic-f" viewBox="0 0 48 48" aria-hidden="true">${f}</svg>`;
  const p = IC[name] || IC.stern; return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${p}"/></svg>`;
}

/* ---------- Hühnchen (Ton-Figur, nach Beschreibung: peruanische Keramik) ---------- */
function huehnchenSVG(gr = 40) {
  return `<svg class="huehnchen-mini" style="width:${gr}px;height:${gr}px" viewBox="0 0 48 48" aria-hidden="true">
    <ellipse cx="24" cy="44" rx="14" ry="2.6" fill="rgba(0,0,0,.18)"/>
    <path d="M10 30c0-8 6-14 14-14 2 0 3.6.3 5 1l1.6-7.2c.4-2 1.8-3.4 3.6-3.4 2.2 0 3.8 2 3.6 4.4l-.3 2.6 3.5 1.3-3.6 1.6c-.6 5.4-1.6 10.6-3.2 13.7H38c0 6-6 10.5-14 10.5S10 37 10 30Z" fill="#B8552F"/>
    <path d="M14 28c5-4 11-4 15-1-3 4-9 6-15 4Z" fill="#E9D3AE"/>
    <path d="M15.5 29c4-2 8-2.5 12-1.5" stroke="#7A2A1B" stroke-width="1" fill="none"/>
    <circle cx="18" cy="28.6" r="1.3" fill="#2F6B9A"/><circle cx="22.5" cy="27.4" r="1.1" fill="#C98A1B"/><circle cx="26.5" cy="28.2" r="1.2" fill="#3E7A4A"/><circle cx="16" cy="37" r="1" fill="#2F6B9A"/><circle cx="29" cy="36" r="1" fill="#C98A1B"/>
    <path d="M33.2 6.4c.6-1.8 2.4-2.6 3.6-1.6-1-.2-1.3.8-.7 1.6.9-1 2.6-.6 2.8.8-1.4-.6-2.4.4-2.4 1.6h-3.6l.3-2.4Z" fill="#9A2A1A"/>
    <circle cx="35.4" cy="11" r="1.1" fill="#1C2620"/>
    <path d="M38.8 12.2l3.4 1.3-3.6 1.2z" fill="#E2A93B"/>
    <path d="M12 26c-1.6-.6-3-2.2-3.4-4.4 2 .8 3.6 1.2 5 1" fill="#9A3E22"/>
  </svg>`;
}
