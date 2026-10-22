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
    letzteSicherung: ""
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
  S.menschen = S.menschen.filter(m => m && typeof m === "object" && m.id && m.name);
  S.menschen.forEach((m, i) => { if (typeof m.farbe !== "string" || !/^#[0-9a-f]{6}$/i.test(m.farbe)) m.farbe = ["#7A5A9A", "#3F7A6A", "#9A6A3A", "#5A7A9A", "#9A4A5A"][i % 5]; });
  S.plaene = S.plaene.filter(p => p && typeof p === "object" && p.id && D.leiter && D.leiter[Number(p.leiter) - 1]);
  S.missionen.aktiv = S.missionen.aktiv.filter(a => a && typeof a === "object" && a.id).map(a => ({ ...a, tage: Array.isArray(a.tage) ? a.tage : [] }));
  if (!Number.isFinite(S.taler)) S.taler = 0;
  S.gekauft.patience = true;
  if (!S.eintraege.some(e => e.person === "tanzschueler")) S.menschen = S.menschen.filter(m => m.id !== "tanzschueler");
  if (Array.isArray(S.checkliste) && !S.checkliste.some(c => c.id === "maske")) { const i = S.checkliste.findIndex(c => c.id === "desinf"); S.checkliste.splice(i < 0 ? S.checkliste.length : i, 0, { id: "maske", text: "FFP2-Maske eingesteckt (und eine Ersatzmaske)", an: false }); }
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
const VIB = { atemaus: [8, 80, 8], auswahl: 10, aktion: 12, erfolg: [10, 60, 14], achtung: [24, 60, 24], stufe: [12, 60, 12, 60, 30] };
function haptik(art) {
  if (!S.vib || REDUCED()) return;
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return; // ohne Nutzergeste blockt der Browser ohnehin
  try { if (navigator.vibrate) navigator.vibrate(VIB[art] || 10); } catch (e) { }
}
/* iOS: echter Schalter unter einem label erzeugt den System-Tick (ab iOS 18) */
const HAPSEL = ".ks-teil,.ks-fig,.ks-karte,.taler-plakette,.laden-schrank,.bild-wetter-knopf,.mem-karte,.wetter-chip,.tel-leiste,.tuer-gross,.notfall-leiste,.tel-kontakt,.tel-karte-knopf,.exkurs-karte,.bingo-feld,.huhn-karte,.tuer,.logo-knopf,.knopf,.kachel,.tf,.chip,.liste-zeile,nav.tabs button,.karte:not(.zu),.fach:not(.leer),.schalter-zeile";
function armHaptics() {
  if (!IOS || !S.vib) return;
  $$(HAPSEL).forEach(el => {
    if (el.querySelector(":scope>label.hap") || el.disabled) return;
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
  t.addEventListener("click", ev => { if (!ev.target.closest("button")) { t.classList.add("weg"); setTimeout(() => t.remove(), 250); } });
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
function sheetZu(ohneHistory) {
  const s = SHEETS.pop(); if (!s) return;
  s.sh.classList.add("zu"); s.schleier.style.opacity = 0;
  setTimeout(() => { s.sh.remove(); s.schleier.remove(); }, REDUCED() ? 0 : 220);
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
const TAPSEL = ".knopf,.kachel,.tf,.chip,.liste-zeile,nav.tabs button,.karte,.fach,.schalter-zeile,.buehne button.ueber";
let tg = null, abbrechenBis = 0;
addEventListener("pointerdown", e => {
  abbrechenBis = 0;
  const el = e.target.closest(TAPSEL); if (!el || el.disabled) { tg = null; return; }
  tg = { el, x: e.clientX, y: e.clientY, moved: false };
  el.classList.add("gedrueckt"); el._seit = performance.now();
}, { passive: true, capture: true });
addEventListener("pointermove", e => {
  if (!tg || tg.moved) return;
  if (Math.hypot(e.clientX - tg.x, e.clientY - tg.y) > 16) { tg.moved = true; tg.el.classList.remove("gedrueckt"); }
}, { passive: true, capture: true });
function loesen(e) {
  if (!tg) return;
  const el = tg.el, rest = Math.max(0, 120 - (performance.now() - (el._seit || 0)));
  setTimeout(() => el.classList.remove("gedrueckt"), rest);
  if (tg.moved) abbrechenBis = performance.now() + 600;
  else if (e && e.type === "pointerup") welle(el, e.clientX, e.clientY);
  tg = null;
}
addEventListener("pointerup", loesen, { passive: true, capture: true });
addEventListener("pointercancel", e => { if (tg) { tg.moved = true; } loesen(e); }, { passive: true, capture: true });
addEventListener("click", e => { if (performance.now() < abbrechenBis) { abbrechenBis = 0; e.preventDefault(); e.stopImmediatePropagation(); } }, true);
function welle(el, x, y) {
  if (REDUCED() || el.classList.contains("tf") || el.classList.contains("karte")) return;
  const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
  const w = document.createElement("span"); w.className = "welle";
  w.style.cssText = `width:${d}px;height:${d}px;left:${x - r.left - d / 2}px;top:${y - r.top - d / 2}px`;
  el.appendChild(w); setTimeout(() => w.remove(), 650);
}
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
function ic(name, cls = "icon") { const p = IC[name] || IC.stern; return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${p}"/></svg>`; }

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
