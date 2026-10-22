/* ============================================================
   Akte Feuerkelch: Elsbeth Rohde (ausgedacht) liest mit Rita den Feuerkelch als Fall.
   - Lesestand = S.hp (Lesebegleiter). Die Akte merkt sich je Band ihren bestätigten Stand (S.akte.b[n].stand).
   - Kapitel abhaken mit „Rückgängig“ (10 s). Sprünge über zwei Kapitel und Bandwechsel nur mit Rückfrage.
   - Ein Blatt pro etwa zwei Kapitel, versiegelt; es liegt frühestens am Tag nach dem Abhaken bereit.
     Mehrere fertige Blätter kommen unter EIN Siegel (kein Stapel, keine Zahl).
   - Einstieg mitten im Band: ein Sammelblatt „Was bisher geschah“.
   - Jede Zeile hat ihre eigene Freigabe (data-hp.js); nichts hinter dem Lesezeichen wird gezeigt.
   - Taler: fest je Blatt/Antwort/Bitte/Schublade – nie abhängig vom Lesetempo.
   ============================================================ */
const HP_TAG = /^\d{4}-\d{2}-\d{2}$/;
const hpVgl = (a, b) => (a[0] - b[0]) || (a[1] - b[1]);
const hpObj = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
const hpInt = (v, a, b, d) => { const n = Math.floor(Number(v)); return Number.isFinite(n) ? clamp(n, a, b) : d; };
function hpBandDaten(nr) { return (D.hpAkte && D.hpAkte.baende && D.hpAkte.baende[nr]) || null; }
/* Für fremde Texte und Skins: Lesestand laut App (Lesebegleiter) */
function hpFrei(ab) {
  if (!Array.isArray(ab)) return true;
  try { return S.hp.band > ab[0] || (S.hp.band === ab[0] && S.hp.kapitel >= ab[1]); } catch (e) { return false; }
}

/* ---------- Zustand (robust: wird bei jedem Zugriff aufgeräumt) ---------- */
function hpBNorm(x, kap) {
  const b = hpObj(x), tage = {}, offen = {}, quiz = {}, joker = {}, bitten = {};
  for (const k in hpObj(b.tage)) if (HP_TAG.test(b.tage[k]) && Number(k) >= 1 && Number(k) <= kap) tage[Number(k)] = b.tage[k];
  for (const k in hpObj(b.offen)) { const o = hpObj(b.offen[k]); if (HP_TAG.test(o.tag || "")) offen[k] = { tag: o.tag, stand: hpInt(o.stand, 0, kap, 0) }; }
  for (const k in hpObj(b.quiz)) { const q = hpObj(b.quiz[k]); if (HP_TAG.test(q.tag || "")) quiz[k] = { wahl: typeof q.wahl === "number" ? q.wahl : -1, tag: q.tag }; }
  for (const k in hpObj(b.joker)) if (b.joker[k]) joker[k] = true;
  for (const k in hpObj(b.bitten)) { const q = hpObj(b.bitten[k]); if (HP_TAG.test(q.tag || "")) bitten[k] = { i: hpInt(q.i, 0, 9, 0), tag: q.tag, weg: !!q.weg }; }
  const v = hpObj(b.verdacht), fr = hpObj(b.frage);
  return { stand: hpInt(b.stand, 0, kap, 0), einstieg: b.einstieg == null ? null : hpInt(b.einstieg, 0, kap, null), sammel: HP_TAG.test(b.sammel || "") ? b.sammel : "",
    tage, offen, quiz, joker, bitten, verdacht: typeof v.name === "string" && v.name.trim() ? { name: v.name.trim().slice(0, 60), tag: HP_TAG.test(v.tag || "") ? v.tag : "" } : null,
    schublade: HP_TAG.test(b.schublade || "") ? b.schublade : "", frage: fr.ziel != null ? { ziel: hpInt(fr.ziel, 0, kap, 0) } : null, pause: !!b.pause };
}
function hpZustand() {
  hpSkinUmzug(); const a = S.akte; if (!a || typeof a !== "object" || Array.isArray(a)) return null;
  a.v = 1; a.band = hpInt(a.band, 4, 7, 4); if (!hpBandDaten(a.band)) a.band = 4;
  a.du = !!a.du; if (!HP_TAG.test(a.start || "")) a.start = heute(); if (!HP_TAG.test(a.zuletzt || "")) a.zuletzt = a.start;
  if (typeof a.letzterAnruf !== "string" || !(a.letzterAnruf === "" || HP_TAG.test(a.letzterAnruf))) a.letzterAnruf = "";
  a.b = hpObj(a.b);
  for (const k of Object.keys(a.b)) { const B = hpBandDaten(Number(k)); if (!B) delete a.b[k]; }
  return a;
}
const HP_GEPRUEFT = new WeakSet(); // einmal aufgeräumt = dasselbe Objekt behalten (sonst gingen Änderungen verloren)
function hpB(nr) { const a = hpZustand(), B = hpBandDaten(nr); if (!a || !B) return null; if (!HP_GEPRUEFT.has(a.b[nr])) { a.b[nr] = hpBNorm(a.b[nr], B.kapitel); HP_GEPRUEFT.add(a.b[nr]); } return a.b[nr]; }
/* Was sagt der Lesebegleiter über Band nr? null = Rita ist noch in einem früheren Band */
function hpExtern(nr) { const B = hpBandDaten(nr); if (!B) return null; if (S.hp.band > nr) return B.kapitel; if (S.hp.band === nr) return clamp(S.hp.kapitel, 0, B.kapitel); return null; }
function hpStandSetzen(b, n) { for (let k = b.stand + 1; k <= n; k++) if (!b.tage[k]) b.tage[k] = heute(); b.stand = n; const a = hpZustand(); if (a) a.zuletzt = heute(); }
function hpSync() {
  const a = hpZustand(); if (!a) return; const nr = a.band, b = hpB(nr), ext = hpExtern(nr); if (!b || ext == null) return;
  if (b.frage) { if (ext === b.stand) b.frage = null; else { b.frage.ziel = ext; return; } }
  if (ext > b.stand) { if (ext - b.stand <= 2 && S.hp.band === nr) hpStandSetzen(b, ext); else b.frage = { ziel: ext }; }
  else if (ext < b.stand && S.hp.band === nr) b.stand = ext; // Rückschritt sperrt nichts, es kommt nur nichts Neues
}
function hpStatus(nr) {
  const b = hpB(nr), B = hpBandDaten(nr), h = heute();
  if (!b || !B || B.platzhalter) return { offen: [], bereit: [], morgen: [], sammelBereit: false };
  const gedeckt = bl => b.einstieg != null && bl.bis <= b.einstieg;
  const reif = B.blaetter.filter(bl => !b.offen[bl.id] && !gedeckt(bl) && bl.bis <= b.stand);
  return { offen: B.blaetter.filter(bl => b.offen[bl.id]), bereit: reif.filter(bl => !b.tage[bl.bis] || b.tage[bl.bis] < h), morgen: reif.filter(bl => b.tage[bl.bis] && b.tage[bl.bis] >= h), sammelBereit: b.einstieg != null && !b.sammel };
}
const hpDu = (du, sie) => { const a = hpZustand(); return a && a.du ? du : sie; };
const hpT = x => x && typeof x.t === "string" ? x.t : "";

/* ---------- Für Hühnchen-Besuche, Telefon, Zugang ---------- */
function hpSiegelWartet() { const a = hpZustand(); if (!a) return false; hpSync(); const b = hpB(a.band); if (!b || b.frage) return false; const s = hpStatus(a.band); return s.sammelBereit || s.bereit.length > 0; }
function hpPinnwandOffen() { const a = hpZustand(); if (!a || a.band !== 4) return false; const b = hpB(4); return !!b && b.stand >= 16 && !b.schublade; }
function hpDunkelGerade() { const a = hpZustand(); if (!a) return true; const B = hpBandDaten(a.band), b = hpB(a.band); if (!B || !B.dunkel) return false; return b.stand >= Math.min(...B.dunkel.filter(k => k > 1)) - 1 && !b.schublade; }
function hpAnrufe() {
  const a = hpZustand(); if (!a || !a.du) return []; const B = hpBandDaten(a.band), b = hpB(a.band); if (!B || !B.anrufe || b.schublade || hpDunkelGerade()) return []; // nie rund um Kapitel mit Toten, nach dem Bandende Ruhe
  return B.anrufe.filter(x => hpVgl(x.ab, [a.band, b.stand]) <= 0);
}
function hpAnrufNeu() { const g = S.anrufeGefuehrt || {}; return hpAnrufe().filter(x => !g[x.id]); }
function hpAnrufWartet() {
  const a = hpZustand(); if (!a || !hpAnrufNeu().length) return false;
  const tage = t => t ? (tagDatum(heute()) - tagDatum(t)) / 864e5 : 999;
  return tage(a.start) >= 2 && tage(a.letzterAnruf) >= 10;
}

/* ---------- Bilder ---------- */
Object.assign(IC, { akte: "M2.5 5.5c0-.8.7-1.5 1.5-1.5h5.4l2 2.2H20c.8 0 1.5.7 1.5 1.5v11.3c0 .8-.7 1.5-1.5 1.5H4c-.8 0-1.5-.7-1.5-1.5V5.5Zm2 3.2v9.8h15V8.7h-15Zm2.5 2.3h6v1.6H7V11Zm0 3h9v1.6H7V14Z" });
/* Elsbeth Rohde, 76, Kommissarin a. D.: kurzes silbergraues Haar, halbe Lesebrille an der Kette, Blazer mit weißem Kragen */
function elsbethSVG(gr = 64) {
  return `<svg class="portrait elsbeth" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#E3E7EE"/>
  <path d="M12 100 Q14 77 50 75 Q86 77 88 100Z" fill="#2C3E5C"/>
  <path d="M39 75.6 L50 92 L61 75.6 L64 77 L50 97 L36 77Z" fill="#22324C"/>
  <path d="M42.6 74.6 L50 86 L57.4 74.6 Q50 78.6 42.6 74.6Z" fill="#F4F1EA"/>
  <path d="M42.5 66.6 L57.5 66.6 L57 75.6 Q50 79.6 43 75.6Z" fill="#EBC1A4"/>
  <ellipse cx="31.6" cy="50.4" rx="2.5" ry="4" fill="#E4B496"/><ellipse cx="68.4" cy="50.4" rx="2.5" ry="4" fill="#E4B496"/>
  <circle cx="31.4" cy="55.6" r="1.3" fill="#F3EFE6"/><circle cx="68.6" cy="55.6" r="1.3" fill="#F3EFE6"/>
  <path d="M50 28 C61.5 28 68 37.5 68 48.5 C68 60.5 62 70.6 50 73.6 C38 70.6 32 60.5 32 48.5 C32 37.5 38.5 28 50 28Z" fill="#F0CBB0"/>
  <path d="M30.6 49 Q27.4 30 37 23.6 Q43 19.4 50.6 19.8 Q60 19.4 66 24.6 Q73.6 31 69.4 49 Q68.6 40 64.4 35.6 Q61 37 56.4 34.6 Q53 37.4 47.4 35.6 Q42 37.4 37.6 35.4 Q33 39 30.6 49Z" fill="#C4C3BF"/>
  <g fill="#D8D7D3"><path d="M36 27.6 Q41 22.6 48 23 Q42.6 25 39.6 29.6Z"/><path d="M53 22.4 Q60.6 22.8 64 27.6 Q59 25.6 55 26Z"/></g>
  <path d="M40 32.4 Q44 30 47.6 32.6 M52.6 32 Q57 29.8 61 32.6" stroke="#A9A8A3" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M39.6 42.6 Q43.4 41.2 47 42.4 M53 42.4 Q56.6 41.2 60.4 42.6" stroke="#9C9A93" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <g class="augen"><ellipse cx="43.5" cy="47.4" rx="3" ry="1.8" fill="#FFFDF5"/><circle cx="43.8" cy="47.6" r="1.6" fill="#6F8798"/><circle cx="43.8" cy="47.6" r=".75" fill="#1C2620"/><circle cx="44.3" cy="47" r=".4" fill="#fff"/><ellipse cx="56.5" cy="47.4" rx="3" ry="1.8" fill="#FFFDF5"/><circle cx="56.2" cy="47.6" r="1.6" fill="#6F8798"/><circle cx="56.2" cy="47.6" r=".75" fill="#1C2620"/><circle cx="56.7" cy="47" r=".4" fill="#fff"/></g>
  <path d="M38.4 49.6 L36.4 50.6 M61.6 49.6 L63.6 50.6" stroke="#D9A588" stroke-width=".7" stroke-linecap="round"/>
  <path d="M37.6 47.8 H48.4 Q48.6 52 45.6 52.4 H40.4 Q37.6 52 37.6 47.8Z M51.6 47.8 H62.4 Q62.4 52 59.6 52.4 H54.4 Q51.4 52 51.6 47.8Z" fill="rgba(255,255,255,.18)" stroke="#7A2A3A" stroke-width="1.1"/>
  <path d="M48.4 48.6 Q50 47.6 51.6 48.6" stroke="#7A2A3A" stroke-width="1" fill="none"/>
  <path d="M37.6 48.6 Q33 58 36 68 Q40 76 44 79 M62.4 48.6 Q67 58 64 68 Q60 76 56 79" stroke="#C9A24A" stroke-width=".7" fill="none" stroke-dasharray="1.4 1"/>
  <path d="M50.3 50.6 Q48.6 55.4 50.9 56.4" stroke="#D29A7A" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="mund"><path d="M44.4 62.2 Q50 65.8 55.6 61.6" stroke="#9A4A44" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>
  <path d="M42 64 Q43 66.6 45.4 67.6 M58 63.4 Q57.4 66 55 67.2" stroke="#E2B49A" stroke-width=".7" fill="none" stroke-linecap="round"/>
  <ellipse cx="38.6" cy="57" rx="3.1" ry="1.8" fill="#E08A76" opacity=".3"/><ellipse cx="61.4" cy="57" rx="3.1" ry="1.8" fill="#E08A76" opacity=".3"/>
</svg>`;
}
function hpSiegelSVG(gr = 84) {
  const z = [...Array(18)].map((_, i) => { const w = i / 18 * Math.PI * 2, r = i % 2 ? 44 : 47; return `${(50 + Math.cos(w) * r).toFixed(1)} ${(50 + Math.sin(w) * r).toFixed(1)}`; }).join(" L");
  return `<svg class="hp-siegel-svg" viewBox="0 0 100 100" width="${gr}" height="${gr}" aria-hidden="true"><path d="M${z}Z" fill="#8E2A22"/><circle cx="50" cy="50" r="35" fill="#A8382C"/><circle cx="50" cy="50" r="30" fill="none" stroke="#7A2018" stroke-width="2"/>
    <text x="50" y="62" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="34" font-weight="700" fill="#6E1C15">R</text><path d="M30 36 Q38 28 50 27" stroke="#D86A58" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>
    <circle class="hp-ring" cx="50" cy="50" r="46" fill="none" stroke="var(--licht)" stroke-width="5" stroke-dasharray="289" stroke-dashoffset="289" transform="rotate(-90 50 50)"/></svg>`;
}

/* ---------- Kleiderschrank: genau zwei Teile (ohne Figuren, ohne Wappen) ---------- */
const hpStern = (x, y, r, c) => SP(`M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3}Z`, c, { cls: "skin-funkel" });
const HP_SKINS = [
  { id: "r-festumhang", fuer: "rita", fach: "ganz", name: "Festumhang", naechst: "den Festumhang", preis: 160, wenn: () => hpFrei([4, 23]),
    text: "Dunkelgrün, mit Sternenstaub, der beim Drehen glitzert. Für den Weihnachtsball – und für jeden Walzer im Wohnzimmer.",
    r: { vorn: [SP("M11.6 100 Q13.4 78.6 38.6 75.6 L50 84 L61.4 75.6 Q86.6 78.6 88.4 100Z", "#1F5A3A"),
      SP("M38.6 75.6 L50 84 L61.4 75.6 L58.8 74.4 L50 80.4 L41.2 74.4Z", "#C9CED2"),
      SP("M23 100 Q29 88 40 84 Q33.6 92 32.6 100Z", "#2C7550", { op: .8 }), SP("M77 100 Q71 88 60 84 Q66.4 92 67.4 100Z", "#174A30", { op: .8 }),
      ...[[21, 94, 1.9, "#F2D27A"], [29, 87.4, 1.3, "#FFFFFF"], [36.4, 95.6, 1.6, "#F2D27A"], [45, 90.4, 1.1, "#FFFFFF"], [50, 97, 1.4, "#F2D27A"], [56, 92.6, 1.5, "#FFFFFF"], [64, 88, 1.2, "#F2D27A"], [70.6, 96, 1.7, "#FFFFFF"], [79, 92, 1.4, "#F2D27A"]].map(([x, y, r, c]) => hpStern(x, y, r, c))] } },
  { id: "h-posteule", fuer: "huhn", fach: "ganz", name: "Posteule", naechst: "die Posteule", es: "die Eule", preis: 90, wenn: () => !!(S && S.akte),
    text: "Eine kleine braune Eule reist auf Hühnchens Rücken mit, einen Brief im Schnabel. Hühnchen guckt leicht genervt. Die Eule auch.",
    s: { koerper: [SE(31.6, 40, 3, 6, "#6E4C30", { rot: 14 }), SE(35.4, 39.4, 7, 8.4, "#8A6240"), SE(36.2, 41.8, 4.4, 5.4, "#D9C29A"),
        SL("M34.6 40.6 l1 .8 l1 -.8 M34.8 43.4 l1 .8 l1 -.8", "#A07E58", .7), SL("M32.8 47 L33.2 49 M37.6 47 L37.2 49", "#E2A93B", 1.1),
        SC(35.6, 28.8, 6.6, "#8A6240"), SP("M30.4 24.6 L29.4 19.6 L33 22.8Z M40.6 24.4 L42 19.8 L38.4 22.8Z", "#6E4C30"), SE(37, 29.4, 5, 4.4, "#E8D6B0"),
        SC(35, 29, 1.7, "#FFFDF5"), SC(39, 29, 1.7, "#FFFDF5"), SC(35.3, 29.4, .9, "#1C2620"), SC(39.3, 29.4, .9, "#1C2620"),
        SL("M33.2 26.8 L36.4 27.6 M40.8 26.8 L37.6 27.6", "#4A3220", .9),
        SP("M37.4 30.6 L39 30.6 L38.2 32.6Z", "#E2A93B"), SP("M37.6 32 L44.6 30.8 L45.4 35.4 L38.4 36.6Z", "#FBF6EA"), SL("M37.8 32.2 L41.4 34 L44.8 31", "#C9BFA8", .6), SC(41.6, 33.8, .9, "#C8363A")],
      kopf: [SP("M56.4 26.6 Q65 24.2 73.6 26.6 L73.6 21 L56.4 21Z", "#E4B24F"), SL("M56.6 26.6 Q65 24.4 73.4 26.6", "#1C2620", 1.1)] },
    f: { kopf: [SP("M54.4 28.4 Q61 26.6 67.6 28.4 V22.6 H54.4Z M68.4 28.4 Q75 26.6 81.6 28.4 V22.6 H68.4Z", "#E4B24F"), SL("M54.6 28.4 Q61 26.8 67.4 28.4 M68.6 28.4 Q75 26.8 81.4 28.4", "#1C2620", 1),
      SP("M43.6 47.4 L43 43.8 L45.8 45.8Z M51.4 47.4 L52.2 43.8 L49.4 45.8Z", "#6E4C30"), SC(47.6, 50.6, 4.8, "#8A6240"), SE(48, 51, 3.4, 3, "#E8D6B0"), SC(46.6, 50.4, 1, "#FFFDF5"), SC(49.4, 50.4, 1, "#FFFDF5"), SC(46.8, 50.6, .5, "#1C2620"), SC(49.6, 50.6, .5, "#1C2620")] } }
];
if (typeof D_SKINS !== "undefined" && typeof SKIN_MAP !== "undefined") for (const s of HP_SKINS) if (!SKIN_MAP[s.id]) { D_SKINS.push(s); SKIN_MAP[s.id] = s; }
/* Umbenennung „Ballrobe“ → „Festumhang“: alte Käufe und Auswahl übernehmen (läuft vor skinsMigrieren und nach jedem Einspielen) */
function hpSkinUmzug() { try { const k = S && S.skins; if (!k || typeof k !== "object") return; const b = k.besitz;
  if (b && typeof b === "object") { if (b["r-ballrobe"] && !b["r-festumhang"]) b["r-festumhang"] = b["r-ballrobe"]; delete b["r-ballrobe"]; }
  if (k.geschenkt && k.geschenkt["r-ballrobe"]) { k.geschenkt["r-festumhang"] = k.geschenkt["r-ballrobe"]; delete k.geschenkt["r-ballrobe"]; }
  for (const f of ["rita", "ziel", "zielGemeldet"]) if (k[f] === "r-ballrobe") k[f] = "r-festumhang"; } catch (e) { } }
hpSkinUmzug();

/* ---------- Zugang (Ideen › Lesen und Lesebegleiter) ---------- */
function hpKnopf(klein) {
  if (!D.hpAkte) return "";
  const a = hpZustand(), B = hpBandDaten(a ? a.band : 4), neu = a && hpSiegelWartet();
  return `<button class="knopf ${klein ? "klein " : ""}zweit voll hp-zugang" data-act="hp-auf">${ic("akte")}<span class="hp-zugang-text"><span>${esc(B ? B.titel : "Akte Feuerkelch")}</span><span class="hp-zugang-unter">${neu ? "Ein neues Blatt liegt bereit" : a ? "Elsbeth liest mit" : "Eine Kommissarin liest mit"}</span></span></button>`;
}

/* ---------- Ansicht ---------- */
let HP_INTRO_KAP = null, HP_SIEGEL_FRAGE = false, HP_RUECK = null, HP_NEU = [];
function hpAkteSheet() { HP_NEU = []; HP_SIEGEL_FRAGE = false; hpSync(); speichern(); sheet({ titel: (hpBandDaten(hpZustand()?.band || 4) || {}).titel || "Akte Feuerkelch", id: "hp-akte", inhalt: hpInhalt() }); }
function hpNeuZeichnen() {
  const sh = aktuellesSheet(); if (!sh) return;
  if (sh.dataset.id === "hp-akte") { const t = $(".sheet-kopf h2", sh), B = hpBandDaten(hpZustand()?.band || 4); if (t && B) t.textContent = B.titel; sheetInhalt(hpInhalt()); }
  else if (sh.dataset.id === "hp-pinnwand") sheetInhalt(hpPinInhalt());
}
function hpIntroHTML() {
  const I = D.hpAkte.intro;
  if (HP_INTRO_KAP == null) HP_INTRO_KAP = S.hp.band === 4 ? clamp(S.hp.kapitel, 0, 37) : S.hp.band > 4 ? 37 : 0;
  const k = HP_INTRO_KAP;
  return `<div class="hp-sprecher"><span class="fig-idle">${maxSVG(52)}</span><p class="hp-blase"><strong>Max:</strong> ${esc(I.max.t)}</p></div>
    <div class="hp-kopf"><span class="fig-idle hp-fig">${elsbethSVG(76)}</span><div class="hp-kopf-text"><span class="hp-name">Elsbeth Rohde <span class="hp-plakette">ausgedacht</span></span>${I.elsbeth.map(z => `<p>${esc(z.t)}</p>`).join("")}</div></div>
    <div class="bogen hp-lesezeichen"><span class="hp-band-zier" aria-hidden="true"></span><div class="hp-lz-text"><span class="klein">Lesestand</span><strong>Band 4 · Kapitel ${k}</strong><span class="klein">${k ? `von 37 gelesen` : "noch nicht angefangen"}</span></div>
      <div class="stepper hp-stepper"><button class="knopf zweit" data-act="hp-intro-kap" data-d="-1" aria-label="Ein Kapitel weniger">${ic("minus")}</button><div class="wert zahl">${k}<small>von 37</small></div><button class="knopf zweit" data-act="hp-intro-kap" data-d="1" aria-label="Ein Kapitel mehr">${ic("plus")}</button></div></div>
    <p class="klein">${k >= 3 ? "Weil Sie schon mittendrin sind, fasse ich das Bisherige auf einem einzigen Blatt zusammen. Danach geht’s Kapitel für Kapitel weiter." : "Wir fangen vorne an. Nach etwa zwei Kapiteln liegt jeweils ein versiegeltes Blatt von mir bereit."}</p>
    <button class="knopf haupt voll" data-act="hp-start">${ic("haken")} So stimmt’s – Akte anlegen</button>`;
}
function hpKopfHTML(a, b, nr) {
  const B = hpBandDaten(nr); let satz;
  const tage = t => t ? (tagDatum(heute()) - tagDatum(t)) / 864e5 : 0;
  if (!a.du) satz = "Rohde, Kommissarin a.\u00a0D., Lüneburg. Ich lese genau so weit wie Sie, keine Seite weiter.";
  else if (tage(a.zuletzt) >= 14 && !b.pause && !B.platzhalter && b.stand < B.kapitel) { satz = "Wo stehen wir in der Sache? Ich frag nur einmal, versprochen. Keine Eile."; b.pause = true; speichern(); }
  else satz = waehle(["Ich bin genau da, wo du bist. Keine Seite weiter.", "Die Akte liegt auf dem Küchentisch, der Kaffee daneben.", "Lies in deinem Tempo. Die Akte läuft nicht weg.", "Kein Stapel, keine Eile. Nur wir zwei und ein Buch."], "hp-gruss" + heute());
  return `<div class="hp-kopf"><span class="fig-idle hp-fig">${elsbethSVG(64)}</span><div class="hp-kopf-text"><span class="hp-name">Elsbeth Rohde <span class="hp-plakette">ausgedacht</span></span><p>${esc(satz)}</p></div></div>`;
}
function hpLesezeichenHTML(b, nr, B) {
  const fertig = b.stand >= B.kapitel;
  return `<div class="bogen hp-lesezeichen" id="hp-lesezeichen"><span class="hp-band-zier" aria-hidden="true"></span><div class="hp-lz-text"><span class="klein">Lesezeichen</span><strong>Band ${nr} · ${fertig ? "ausgelesen" : b.stand ? `Kapitel ${b.stand}` : "noch nicht angefangen"}</strong><span class="klein">${fertig ? `alle ${B.kapitel} Kapitel` : `von ${B.kapitel} Kapiteln`}</span></div>
    ${b.frage ? "" : `<div class="hp-lz-knoepfe">${fertig ? "" : `<button class="knopf haupt" data-act="hp-kap">${ic("haken")} Kapitel ${b.stand + 1} gelesen</button>`}${b.stand > 0 ? `<button class="knopf leise klein" data-act="hp-zurueck">Ein Kapitel zurück</button>` : ""}</div>`}</div>`;
}
function hpFrageHTML(b, nr) {
  const z = b.frage.ziel, sprung = S.hp.band !== nr;
  const text = sprung ? hpDu(`Laut Lesebegleiter bist du schon bei Band ${S.hp.band}. Ist Band ${nr} durch?`, `Laut Lesebegleiter sind Sie schon bei Band ${S.hp.band}. Ist Band ${nr} durch?`)
    : z > b.stand ? `${(["", "", "", "Drei", "Vier", "Fünf", "Sechs", "Sieben", "Acht", "Neun", "Zehn"][z - b.stand] || z - b.stand)} Kapitel auf einmal? Respekt. ${hpDu("Stimmt das so – du bist jetzt bei Kapitel " + z + "?", "Stimmt das so – Sie sind jetzt bei Kapitel " + z + "?")}` : `Stimmt das so – Kapitel ${z}?`;
  return `<div class="bogen hp-rueckfrage" role="group" aria-label="Rückfrage"><p><strong>Rückfrage.</strong> ${esc(text)}</p><div class="hp-knoepfe"><button class="knopf haupt" data-act="hp-frage-ja">${esc(sprung ? `Ja, Band ${nr} ist durch` : `Ja, bis Kapitel ${z}`)}</button><button class="knopf zweit" data-act="hp-frage-nein">${esc(`Nein, ich bin bei Kapitel ${b.stand}`)}</button></div></div>`;
}
function hpBundleText(st, nr) {
  const bl = st.bereit; const b = hpB(nr);
  if (st.sammelBereit) return { titel: "Was bisher geschah", unter: `Meine Notizen bis Kapitel ${b.einstieg}${bl.length ? ` und das Blatt bis Kapitel ${bl[bl.length - 1].bis}` : ""}` };
  const von = bl[0].von, bis = bl[bl.length - 1].bis;
  return { titel: bl.length > 1 ? "Neue Aktenblätter" : "Neues Aktenblatt", unter: von === bis ? `Kapitel ${von}` : `Kapitel ${von} bis ${bis}`, von, bis };
}
function hpSiegelHTML(st, b, nr) {
  if (b.frage) return "";
  if (st.sammelBereit || st.bereit.length) {
    const t = hpBundleText(st, nr);
    const frage = t.von ? (t.von === t.bis ? `Kapitel ${t.von} gelesen?` : `Kapitel ${t.von} bis ${t.bis} gelesen?`) : "Dann mach ich das Sammelblatt auf.";
    return `<div class="bogen hp-siegel-karte"><div class="hp-siegel" data-hp-halten="1" role="img" aria-label="Siegel – zum Öffnen den Finger darauf halten">${hpSiegelSVG(88)}</div>
      <div class="hp-siegel-text"><h3>${esc(t.titel)}</h3><p class="klein">${esc(t.unter)} · Finger aufs Siegel halten oder:</p>
      ${HP_SIEGEL_FRAGE ? `<p class="hp-mini-frage">${esc(frage)}</p><div class="hp-knoepfe"><button class="knopf haupt" data-act="hp-siegel-ja">Ja, aufmachen</button><button class="knopf zweit" data-act="hp-siegel-nein">Doch nicht</button></div>` : `<button class="knopf zweit" data-act="hp-siegel">Siegel brechen</button>`}</div></div>`;
  }
  if (st.morgen.length) { const v = st.morgen[0].von, bis = st.morgen[st.morgen.length - 1].bis; return `<div class="bogen mulde hp-morgen"><p class="klein" style="margin:0">${esc(`Notiert. Mein Blatt zu ${v === bis ? `Kapitel ${v}` : `Kapitel ${v} bis ${bis}`} schreib ich heute Abend ins Reine. Morgen liegt es hier, versiegelt.`)}</p></div>`; }
  return "";
}
function hpZeilenHTML(zeilen, grenze) { return zeilen.filter(z => z && hpVgl(z.ab, grenze) <= 0).map(z => `<p>${esc(z.t)}</p>`).join(""); }
function hpBlattHTML(bl, b, nr, B, offen) {
  const o = b.offen[bl.id], grenze = [nr, Math.max(b.stand, o ? o.stand : 0)];
  let h = `<div class="hp-blatt-kopf"><span class="hp-stempel">Aktenblatt</span><span class="klein">${bl.von === bl.bis ? `Kapitel ${bl.von}` : `Kapitel ${bl.von}–${bl.bis}`}</span></div>`;
  let zeilen = bl.zeilen.slice(); if (bl.du && b.offen[bl.id] && hpVgl(D.hpAkte.du.ab, grenze) <= 0) zeilen.push(D.hpAkte.du);
  h += `<div class="hp-zeilen${bl.dunkel ? " hp-dunkel" : ""}">${hpZeilenHTML(zeilen, grenze)}</div>`;
  if (bl.vermerk && hpVgl(bl.vermerk.ab, grenze) <= 0) h += `<div class="hp-vermerk"><span class="hp-vermerk-titel">Aktenvermerk</span><p>${esc(bl.vermerk.t)}</p><div class="hp-vermerk-fuss"><span class="klein">Fundstelle: ${esc(bl.vermerk.fundstelle || `Kapitel ${bl.bis}`)}</span><button class="knopf leise klein" data-act="hp-einspruch" data-blatt="${bl.id}">Einspruch</button></div></div>`;
  const q = (B.quiz || []).find(x => x.blatt === bl.id); if (q && hpVgl(q.frage.ab, grenze) <= 0) h += hpQuizHTML(q, b, grenze);
  return `<article class="bogen hp-blatt${bl.dunkel ? " ist-dunkel" : ""}" id="hp-${bl.id}">${h}</article>`;
}
function hpSammelHTML(b, nr, B) {
  const grenze = [nr, b.einstieg];
  const kurz = B.blaetter.filter(bl => bl.bis <= b.einstieg).map(bl => bl.kurz).filter(z => z && hpVgl(z.ab, grenze) <= 0);
  const rest = B.blaetter.find(bl => bl.von <= b.einstieg && bl.bis > b.einstieg); // angefangenes Blatt: nur die Kapitel bis zum Einstieg
  const teil = rest ? rest.zeilen.filter(z => hpVgl(z.ab, grenze) <= 0 && !rest.dunkel) : [];
  return `<article class="bogen hp-blatt hp-sammel" id="hp-sammel"><div class="hp-blatt-kopf"><span class="hp-stempel">Was bisher geschah</span><span class="klein">bis Kapitel ${b.einstieg}</span></div>
    <div class="hp-zeilen"><p>${esc("Sie sind schon mittendrin, also hab ich das Bisherige zusammengefasst. Kurz, wie ein Übergabeprotokoll.")}</p>${hpVgl(D.hpAkte.du.ab, grenze) <= 0 ? `<p>${esc(D.hpAkte.du.t)}</p>` : ""}${kurz.map(z => `<p>${esc(z.t)}</p>`).join("")}${teil.map(z => `<p>${esc(z.t)}</p>`).join("")}</div></article>`;
}
const HP_LUECKE = ["Mein Protokoll hat ’ne Lücke.", "Hilf mir mal kurz.", "Ich hab da was nicht mitgeschrieben."];
function hpQuizHTML(q, b, grenze) {
  const r = b.quiz[q.id], i = (Number(q.id.replace(/\D/g, "")) || 0) % HP_LUECKE.length;
  let h = `<div class="hp-quiz" id="hp-${q.id}"><p class="hp-quiz-frage"><strong>${esc(HP_LUECKE[i])}</strong> ${esc(q.frage.t)}</p>`;
  if (b.joker[q.id] && hpVgl(q.huhn.ab, grenze) <= 0) h += `<p class="hp-huhn"><span class="hp-huhn-fig" aria-hidden="true">${huhnSVG({ gr: 34, kopf: true, stimmung: "spricht" })}</span><span><strong>Hühnchen:</strong> ${esc(q.huhn.t)}</span></p>`;
  if (r) {
    const ant = r.wahl >= 0 ? q.antworten[r.wahl] : null, ka = D.hpAkte.baende[4].keineAhnung || [];
    const reakt = !ant ? hpT(ka[(i + 1) % ka.length]) : ant.richtig ? waehle(["Genau so. Danke!", "Richtig. Wird eingetragen.", "Stimmt. Was würd ich ohne dich machen."], q.id) : waehle(["Hätte ich auch fast getippt.", "Zu Protokoll genommen.", "Klingt vernünftig. War’s aber nicht ganz."], q.id);
    h += `<p class="hp-du"><strong>Du:</strong> ${esc(ant ? ant.t : "Keine Ahnung mehr.")}</p>${hpVgl(q.aufl.ab, grenze) <= 0 ? `<p>${esc(reakt + " " + q.aufl.t)}</p>` : ""}`;
  } else {
    h += `<div class="hp-antworten">${q.antworten.map((x, k) => `<button class="knopf zweit voll" data-act="hp-quiz" data-q="${q.id}" data-i="${k}">${esc(x.t)}</button>`).join("")}
      <div class="hp-knoepfe"><button class="knopf leise" data-act="hp-quiz" data-q="${q.id}" data-i="-1">Keine Ahnung mehr</button>${b.joker[q.id] ? "" : `<button class="knopf zweit klein" data-act="hp-joker" data-q="${q.id}">Hühnchen fragen</button>`}</div></div>`;
  }
  return h + `</div>`;
}
function hpFallHTML(b, nr, B) {
  if (!B.fall || hpVgl(B.fall.ab, [nr, b.stand]) > 0 || b.schublade) return "";
  return `<div class="bogen hp-fall"><h3>${esc(B.fall.t)}</h3><p class="klein">Dein Zettel: <strong>${b.verdacht ? esc(b.verdacht.name) : "noch leer"}</strong>${b.verdacht ? " · zugeklebt" : ""}</p><p class="klein">${esc(hpT(B.pinHinweis))}</p><button class="knopf zweit voll" data-act="hp-pinnwand">${ic("liste")} Zur Pinnwand</button></div>`;
}
function hpBitteHTML(b, nr, B) {
  return (B.bitten || []).filter(x => hpVgl(x.ab, [nr, b.stand]) <= 0 && !(b.bitten[x.id] && b.bitten[x.id].weg)).map(x => {
    const r = b.bitten[x.id];
    if (r) return `<div class="bogen hp-bitte"><p class="hp-du"><strong>Du:</strong> ${esc(x.antworten[r.i].t)}</p><p>${esc(hpT(x.antworten[r.i].antwort))}</p><button class="knopf zweit klein" data-act="hp-bitte-weg" data-b="${x.id}">Zu den Akten</button></div>`;
    return `<div class="bogen hp-bitte"><p>${esc(x.t)}</p><div class="hp-antworten">${x.antworten.map((y, k) => `<button class="knopf zweit voll" data-act="hp-bitte" data-b="${x.id}" data-i="${k}">${esc(y.t)}</button>`).join("")}</div></div>`;
  }).join("");
}
function hpAnrufHTML() { return hpAnrufNeu().length ? `<div class="bogen hp-anruf"><p style="margin:0 0 10px">Elsbeth möchte kurz telefonieren. Nichts Dringendes.</p><button class="knopf zweit voll" data-act="hp-anruf">${ic("telefon")} Elsbeth anrufen</button></div>` : ""; }
function hpEndeHTML(b, nr, B) {
  if (B.platzhalter || b.stand < B.kapitel) return "";
  const letztes = B.blaetter[B.blaetter.length - 1]; if (!b.offen[letztes.id] && !(b.einstieg != null && letztes.bis <= b.einstieg && b.sammel)) return "";
  if (!b.schublade) return `<div class="bogen hp-schublade"><h3>Das Buch ist zu.</h3><p>${esc(hpDu("Zeit für die Schublade. Beide Zettel kommen auf den Tisch, deiner und meiner.", "Zeit für die Schublade."))}</p><button class="knopf haupt voll" data-act="hp-schublade">Schublade aufmachen</button></div>`;
  const v = b.verdacht ? b.verdacht.name : "", k = v.toLowerCase();
  const reakt = !v ? B.ritaLeer : /crouch\s*(jr|jun)|barty crouch junior|moody/.test(k) ? B.ritaNah : /crouch/.test(k) ? B.ritaCrouch : B.ritaAnders;
  let h = `<div class="bogen hp-schublade offen"><h3>Die Schublade</h3><div class="hp-zettel-paar"><div class="hp-zettel"><span class="klein">Dein Zettel</span><strong>${v ? esc(v) : "leer"}</strong></div><div class="hp-zettel elsbeth"><span class="klein">Elsbeths Zettel</span><strong>${esc(B.elsbethZettel.name)}</strong></div></div>
    <p>${esc(B.elsbethZettel.t)}</p>${B.aufloesung.map(z => `<p>${esc(z.t)}</p>`).join("")}<p>${esc(hpT(reakt))}</p>
    <div class="hp-sprecher hp-max"><span class="fig-idle">${maxSVG(44)}</span><p class="hp-blase">${esc(B.maxZeile.t)}</p></div></div>`;
  const n = hpBandDaten(nr + 1);
  if (n) h += `<div class="bogen hp-weiter"><p style="margin:0 0 10px">${esc("Neuer Band, neue Akte. Wenn du so weit bist:")}</p><button class="knopf zweit voll" data-act="hp-band-wechsel">${ic("akte")} Band ${nr + 1} aufschlagen</button></div>`;
  return h;
}
function hpNebenfallHTML() { const N = D.hpAkte.nebenfaelle || []; if (!N.length) return ""; const z = N[hash32("hp-nf" + heute() + S.seed) % N.length]; return `<div class="bogen mulde hp-nebenfall"><span class="hp-vermerk-titel">Aus Lüneburg · ohne Buch</span><p style="margin:0">${esc(z.t)}</p></div>`; }
function hpInhalt() {
  const a = hpZustand(); if (!a) return hpIntroHTML();
  hpSync();
  const nr = a.band, B = hpBandDaten(nr), b = hpB(nr), st = hpStatus(nr);
  let h = hpKopfHTML(a, b, nr);
  if (b.frage) h += hpFrageHTML(b, nr);
  h += hpLesezeichenHTML(b, nr, B);
  if (B.platzhalter) return h + `<div class="bogen hp-platzhalter"><h3>${esc(B.titel)}</h3><p style="margin:0">${esc(D.hpAkte.platzhalter.t)}</p></div>` + hpNebenfallHTML();
  h += hpSiegelHTML(st, b, nr) + hpEndeHTML(b, nr, B) + hpFallHTML(b, nr, B) + hpBitteHTML(b, nr, B) + hpAnrufHTML();
  const offen = st.offen.slice().reverse();
  if (offen.length || b.sammel) {
    h += `<h3 class="hp-akte-titel">Deine Akte</h3>`;
    const karten = offen.map(bl => ({ id: bl.id, html: hpBlattHTML(bl, b, nr, B), label: bl.von === bl.bis ? `Kapitel ${bl.von}` : `Kapitel ${bl.von}–${bl.bis}` }));
    if (b.sammel) karten.push({ id: "sammel", html: hpSammelHTML(b, nr, B), label: `Was bisher geschah · bis Kapitel ${b.einstieg}` });
    h += karten.map((k, i) => i === 0 || HP_NEU.includes(k.id) ? k.html : `<details class="hp-alt"><summary>${esc(k.label)}</summary>${k.html}</details>`).join("");
  }
  return h + hpNebenfallHTML();
}

/* ---------- Pinnwand (alphabetisch, gleichrangig, freies Namensfeld) ---------- */
function hpPinInhalt() {
  const a = hpZustand(), nr = a.band, B = hpBandDaten(nr), b = hpB(nr);
  const namen = (B.pinnwand || []).filter(p => hpVgl(p.ab, [nr, b.stand]) <= 0).sort((x, y) => x.s.localeCompare(y.s, "de"));
  const v = b.verdacht ? b.verdacht.name : "";
  return `<p>${esc(B.fall.t)}</p><p class="klein">${esc(hpT(B.pinHinweis))}</p>
    <div class="hp-pinnwand" role="group" aria-label="Namen auf der Pinnwand">${namen.map(p => `<button class="chip hp-pin" aria-pressed="${v === p.n}" data-act="hp-pin" data-n="${esc(p.n)}">${v === p.n ? ic("haken") : ""}${esc(p.n)}</button>`).join("")}</div>
    <label class="feld" for="hp-frei">Oder selbst einen Namen aufschreiben</label><div class="hp-frei-zeile"><input id="hp-frei" class="text" maxlength="60" placeholder="Name" value="${namen.some(p => p.n === v) ? "" : esc(v)}"><button class="knopf zweit" data-act="hp-pin-frei">Anheften</button></div>
    ${v ? `<p class="klein" style="margin-top:12px">Dein Zettel: <strong>${esc(v)}</strong>, zugeklebt.</p><button class="knopf leise klein" data-act="hp-pin-leer">Zettel leer lassen</button>` : ""}`;
}

/* ---------- Siegel halten ---------- */
let HP_HALT = null;
document.addEventListener("pointerdown", ev => {
  const el = ev.target && ev.target.closest && ev.target.closest("[data-hp-halten]"); if (!el) return;
  hpHaltAus(); el.classList.add("haelt");
  HP_HALT = { el, x: ev.clientX, y: ev.clientY, t: setTimeout(() => { if (!HP_HALT || HP_HALT.el !== el) return; HP_HALT = null; el.classList.remove("haelt"); haptik("erfolg"); hpSiegelBrechen(); }, REDUCED() ? 600 : 900) };
}, { passive: true });
function hpHaltAus() { if (HP_HALT) { clearTimeout(HP_HALT.t); HP_HALT.el.classList.remove("haelt"); HP_HALT = null; } }
document.addEventListener("pointermove", ev => { if (HP_HALT && Math.hypot(ev.clientX - HP_HALT.x, ev.clientY - HP_HALT.y) > 14) hpHaltAus(); }, { passive: true });
["pointerup", "pointercancel"].forEach(t => document.addEventListener(t, hpHaltAus, { passive: true }));

function hpSiegelBrechen() {
  const a = hpZustand(); if (!a) return; const nr = a.band, b = hpB(nr), st = hpStatus(nr); if (b.frage) return;
  if (!st.sammelBereit && !st.bereit.length) return;
  let taler = 0; HP_NEU = [];
  if (st.sammelBereit) { b.sammel = heute(); taler += 10; a.du = true; HP_NEU.push("sammel"); }
  for (const bl of st.bereit) { b.offen[bl.id] = { tag: heute(), stand: b.stand }; taler += 2; HP_NEU.push(bl.id); if (bl.du && hpVgl(D.hpAkte.du.ab, [nr, b.stand]) <= 0) a.du = true; }
  S.taler += taler; HP_SIEGEL_FRAGE = false; speichern();
  hpNeuZeichnen(); stempel("Siegel\ngebrochen");
  toast(`Siegel gebrochen.\n+${taler} Taler`, { erfolg: true });
  setTimeout(() => { const el = $("#hp-" + HP_NEU[HP_NEU.length - 1]) || $("#hp-" + HP_NEU[0]); if (el) el.scrollIntoView({ block: "start", behavior: REDUCED() ? "auto" : "smooth" }); }, 120);
}
function hpBandFrage(nr) {
  const B = (D.hp.baende || []).find(x => x.nr === nr); if (!B) return;
  sheet({ titel: "Band wechseln?", id: "hp-bandfrage", inhalt: `<p>${esc(`Du bist bei Band ${S.hp.band}, Kapitel ${S.hp.kapitel}. Wirklich zu Band ${nr} wechseln? Dein Lesezeichen fängt dort bei Kapitel 0 an.`)}</p>`,
    fuss: `<div class="hp-knoepfe"><button class="knopf haupt" data-act="band" data-nr="${nr}" data-ok="1">Ja, zu Band ${nr}</button><button class="knopf zweit" data-act="sheet-zu">Lieber nicht</button></div>` });
}

/* ---------- Aktionen ---------- */
function hpAktion(a, d, el) {
  const z = hpZustand();
  switch (a) {
    case "hp-auf": if (aktuellesSheet()?.dataset.id === "hp-akte") { hpNeuZeichnen(); return; } hpAkteSheet(); return;
    case "hp-intro-kap": HP_INTRO_KAP = clamp((HP_INTRO_KAP || 0) + Number(d.d), 0, 37); haptik("auswahl"); hpNeuZeichnen(); return;
    case "hp-start": {
      const k = clamp(HP_INTRO_KAP == null ? 0 : HP_INTRO_KAP, 0, 37);
      S.akte = { v: 1, band: 4, start: heute(), zuletzt: heute(), du: false, letzterAnruf: "", b: { 4: { stand: k, einstieg: k >= 3 ? k : null, tage: {}, offen: {} } } };
      if (S.hp.band <= 4) { S.hp.band = 4; S.hp.kapitel = k; }
      HP_INTRO_KAP = null; speichern(); haptik("erfolg"); hpNeuZeichnen(); toast(k >= 3 ? "Akte angelegt. Das Sammelblatt liegt bereit." : "Akte angelegt.", { erfolg: true }); return; }
    case "hp-kap": {
      if (!z) return; const nr = z.band, B = hpBandDaten(nr), b = hpB(nr); if (b.frage || b.stand >= B.kapitel) return;
      const vorher = b.stand, war = !!b.tage[vorher + 1];
      if (S.hp.band !== nr) S.hp.band = nr;
      hpStandSetzen(b, vorher + 1); S.hp.kapitel = b.stand; speichern(); haptik("auswahl");
      HP_RUECK = { nr, vorher, war, bis: Date.now() + 10500 };
      hpNeuZeichnen(); toast(`Kapitel ${vorher + 1} abgehakt.`, { knopf: { text: "Rückgängig", act: "hp-rueck" }, dauer: 10000 }); return; }
    case "hp-rueck": {
      $$(".toast").forEach(t => t.remove());
      const r = HP_RUECK; HP_RUECK = null; if (!r || Date.now() > r.bis || !z) return;
      const b = hpB(r.nr); if (!b || b.stand !== r.vorher + 1) return;
      b.stand = r.vorher; if (!r.war) delete b.tage[r.vorher + 1];
      if (S.hp.band === r.nr) S.hp.kapitel = r.vorher; speichern(); haptik("aktion"); hpNeuZeichnen(); toast("Rückgängig gemacht. Lesezeichen liegt wieder bei Kapitel " + r.vorher + "."); return; }
    case "hp-zurueck": {
      if (!z) return; const nr = z.band, b = hpB(nr); if (b.frage || b.stand <= 0) return;
      b.stand -= 1; if (S.hp.band === nr) S.hp.kapitel = b.stand; speichern(); haptik("auswahl"); hpNeuZeichnen(); toast(`Lesezeichen auf Kapitel ${b.stand} zurückgelegt.`); return; }
    case "hp-frage-ja": { if (!z) return; const nr = z.band, b = hpB(nr); if (!b.frage) return; const ziel = b.frage.ziel; b.frage = null; hpStandSetzen(b, ziel); speichern(); haptik("auswahl"); hpNeuZeichnen(); return; }
    case "hp-frage-nein": { if (!z) return; const nr = z.band, b = hpB(nr); if (!b.frage) return; b.frage = null; S.hp.band = nr; S.hp.kapitel = b.stand; speichern(); haptik("auswahl"); hpNeuZeichnen(); toast(`Gut. Das Lesezeichen bleibt bei Kapitel ${b.stand}.`); try { render({ halteScroll: true, ohneAnim: true }); } catch (e) { } return; }
    case "hp-siegel": HP_SIEGEL_FRAGE = true; haptik("auswahl"); hpNeuZeichnen(); return;
    case "hp-siegel-nein": HP_SIEGEL_FRAGE = false; hpNeuZeichnen(); return;
    case "hp-siegel-ja": hpSiegelBrechen(); return;
    case "hp-quiz": {
      if (!z) return; const nr = z.band, B = hpBandDaten(nr), b = hpB(nr), q = (B.quiz || []).find(x => x.id === d.q); if (!q || b.quiz[q.id]) return;
      b.quiz[q.id] = { wahl: Number(d.i), tag: heute() }; S.taler += 1; speichern(); haptik("auswahl"); HP_NEU = [q.blatt]; hpNeuZeichnen();
      setTimeout(() => $("#hp-" + q.id)?.scrollIntoView({ block: "nearest", behavior: REDUCED() ? "auto" : "smooth" }), 80); return; }
    case "hp-joker": { if (!z) return; const b = hpB(z.band); b.joker[d.q] = true; speichern(); haptik("auswahl"); const q = (hpBandDaten(z.band).quiz || []).find(x => x.id === d.q); if (q) HP_NEU = [q.blatt]; hpNeuZeichnen(); return; }
    case "hp-pinnwand": sheet({ titel: "Pinnwand", id: "hp-pinnwand", inhalt: hpPinInhalt(), onclose: () => setTimeout(hpNeuZeichnen, 260) }); return;
    case "hp-pin": case "hp-pin-frei": case "hp-pin-leer": {
      if (!z) return; const b = hpB(z.band);
      const name = a === "hp-pin" ? d.n : a === "hp-pin-frei" ? ($("#hp-frei")?.value || "").trim().slice(0, 60) : "";
      if (a === "hp-pin-frei" && !name) { $("#hp-frei")?.focus(); toast("Schreib erst einen Namen auf."); return; }
      b.verdacht = name ? { name, tag: heute() } : null; speichern(); haptik("auswahl"); sheetInhalt(hpPinInhalt());
      toast(name ? "Angeheftet. Zugeklebt, bis das Buch zu ist." : "Zettel ist wieder leer."); return; }
    case "hp-bitte": { if (!z) return; const b = hpB(z.band); if (b.bitten[d.b]) return; b.bitten[d.b] = { i: Number(d.i), tag: heute(), weg: false }; S.taler += 2; speichern(); haptik("erfolg"); hpNeuZeichnen(); return; }
    case "hp-bitte-weg": { if (!z) return; const b = hpB(z.band); if (b.bitten[d.b]) b.bitten[d.b].weg = true; speichern(); hpNeuZeichnen(); return; }
    case "hp-anruf": { if (!z) return; z.letzterAnruf = heute(); speichern(); hpNeuZeichnen(); telStarten("elsbeth"); return; }
    case "hp-schublade": { if (!z) return; const b = hpB(z.band); if (b.schublade) return; b.schublade = heute(); S.taler += 40; speichern(); haptik("erfolg"); hpNeuZeichnen(); toast("Schublade auf.\n+40 Taler", { erfolg: true }); return; }
    case "hp-band-wechsel": { if (!z) return; const n = z.band + 1; if (!hpBandDaten(n)) return;
      sheet({ titel: `Band ${n} aufschlagen?`, id: "hp-bandwechsel", inhalt: `<p>${esc(`Neue Akte für Band ${n}. Dein Lesezeichen fängt dort bei Kapitel 0 an. Band ${z.band} bleibt in der Schublade, nichts geht verloren.`)}</p>`,
        fuss: `<div class="hp-knoepfe"><button class="knopf haupt" data-act="hp-band-ja">Ja, Band ${n}</button><button class="knopf zweit" data-act="sheet-zu">Noch nicht</button></div>` }); return; }
    case "hp-band-ja": { if (!z) return; const alt = z.band, n = alt + 1; if (!hpBandDaten(n)) return; z.band = n; hpB(n); if (S.hp.band <= alt) { S.hp.band = n; S.hp.kapitel = 0; } speichern(); sheetZu(); setTimeout(hpNeuZeichnen, 240); try { render({ halteScroll: true, ohneAnim: true }); } catch (e) { } return; }
    case "hp-einspruch": {
      const bl = z && (hpBandDaten(z.band).blaetter || []).find(x => x.id === d.blatt); if (!bl || typeof wunschSheet !== "function") return;
      WUNSCH = `Einspruch zur Akte Feuerkelch, Aktenvermerk zu Kapitel ${bl.von === bl.bis ? bl.von : bl.von + "–" + bl.bis}: …`; wunschSheet(); toast("Einspruch ist zulässig. Wird geprüft."); return; }
  }
}
