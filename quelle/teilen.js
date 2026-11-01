/* ============================================================
   Nutzung mit Max teilen – freiwillig und durchsichtig.
   Rita sieht vorher genau, was verschickt wird, und schickt es selbst ab (WhatsApp, MAX_WA aus wunsch.js).
   Es gibt keinen Server: Nichts verlässt das Handy ohne ihren Tipp.
   Inhalt: NUR Zahlen und Nutzungsmuster – nie Texte aus Tagebuch, Momenten, Dank, Merkzettel, Liste,
   eigenen Ideen/Tätigkeiten, Notfallplan, keine Telefonnummern, keine Namen von Herzensmenschen, keine Gesichter.
   Alles, was ausgegeben wird, stammt aus Zählern oder aus festen App-Inhalten (Tätigkeits-, Waren-, Outfit-Namen).
   Zustand: S.teilen = { ok: null|true|false, erinnern: true, seit, tage: [..], offen: {sheetId: n}, tabs: {tab: n},
            z: {schluessel: n}, gesendet: [..], kopiert: n, naechste: "JJJJ-MM-TT", neinAb: erstes Nein, gefragt: "JJJJ-MM-TT", nein: n, var: n }
   Hooks: core.js sheet() → teilenGeoeffnet · scene.js spielAusloesen → teilenZaehl("funkeln") ·
          main.js aktion() default → teilenAktion · views.js Einstellungen → Zeile „Nutzung mit Max teilen“
   ============================================================ */
const TEILEN_JA_TAGE = 28;      // zugestimmt: etwa alle 4 Wochen ein dezenter Hinweis „Neue Übersicht für Max?“
const TEILEN_NEIN_TAGE = 7, TEILEN_NEIN_SPAETER = 14, TEILEN_NEIN_PHASE = 28; // abgelehnt: in den ersten 4 Wochen nach dem ersten Nein wöchentlich, danach alle 14 Tage (Max, endgültig)
const TEILEN_OFFEN_TAGE = 7;    // Blatt ohne Entscheidung geschlossen: in einer Woche nochmal
const TEILEN_LINK_MAX = 1800;   // längerer Text: erst kopieren, dann WhatsApp öffnen
const TEILEN_KENNUNG = "Ritas App – Nutzung";

/* Blätter, deren Öffnen gezählt wird (nur feste Kennungen, nie Inhalte) */
const TEILEN_BLAETTER = {
  telefon: "Kurz plaudern", "tel-gespraech": "Plauder-Gespräch", brevvan: "Post von Karin", "bv-brief": "Karin-Brief",
  tv: "Film & Fernsehen", lesen: "Lesen", "buch-neu": "Buch eintragen", winter: "Gut durch den Winter", angebote: "Angebote",
  laden: "Kramladen", ware: "Kramladen-Ware", "fh-ware": "Für Hühnchen", "fh-album": "Hühnchen-Album", schrank: "Kleiderschrank",
  goennen: "Gönn-Karten", avatar: "Gesichter basteln", ruhe: "Notfallplan", "ruhe-flow": "Notfallplan-Ablauf", "ruhe-edit": "Notfallplan bearbeiten",
  bildwetter: "Wetter im Bild", wetter: "Wetter", spiel: "Waldpatience", memory: "Memory", bingo: "Forst-Bingo", hilft: "Was hilft",
  eintragen: "Eintragen", ausflug: "Ausflug", "mb-brief": "Brief von Max", "mb-ablage": "Briefe von Max", "kurze-post": "Kurze Post",
  "rb-schoen": "Was war heute schön", "rb-archiv": "Rückblick-Archiv", "rb-alle": "Rückblick alle", "rb-zuletzt": "Zuletzt",
  "jf-tag": "Tagesfarbe", "hp-pinnwand": "Akte Pinnwand", funde: "Fundstücke", rede: "Redensarten", einst: "Einstellungen",
  helfer: "Technik & Sicherung", wunsch: "Wunsch an Max", eigenes: "Eigene Tätigkeit", tuer: "Ideen-Tür", thema: "Ideen-Thema",
  fenster: "Schaufenster", takt: "Takt", spotify: "Spotify-Info", teilen: "Nutzung teilen"
};
const TEILEN_TABS = { heute: "Heute", ideen: "Ideen", lichtung: "Zuhause", tagebuch: "Rückblick" };

/* Max erklärt es – immer derselbe Kern: nur, was du wie oft benutzt */
const TEILEN_ERINNERN = [
  "Ich bau weiter an deiner App und rate dabei oft ins Blaue. Mit einer kleinen Übersicht – nur, was du wie oft benutzt – müsste ich weniger raten.",
  "Kleine Bitte von mir: Zeig mir ab und zu, welche Teile du benutzt und wie oft. Was du schreibst, bleibt bei dir. Versprochen.",
  "Ich frag nochmal, weil’s mir echt hilft: nur Zahlen, welche Ecken der App du wie oft öffnest. Kein Wort von deinen Einträgen.",
  "Hühnchen meint, ich soll nicht drängeln. Tu ich nicht. Ich frag nur: Darf ich sehen, was du wie oft benutzt? Nichts von dem, was du schreibst.",
  "Wenn ich wüsste, was du gern benutzt und was nie, könnte ich das eine besser und das andere kleiner machen. Mehr steht in der Übersicht nicht drin.",
  "Ehrlich gesagt bau ich manche Sachen, die vielleicht keiner braucht. Eine Übersicht, was du wie oft benutzt, würde mir das sagen. Deine Texte bleiben auf deinem Handy.",
  "Ich bin neugierig, aber nicht auf deine Tagebuchseiten. Nur darauf, welche Teile der App du wie oft öffnest. Du siehst vorher alles.",
  "Kurz und ohne Druck: Eine Übersicht, was du wie oft benutzt, ist für mich wie ein Wegweiser. Du schickst sie selbst ab – oder eben nicht."
];

function teilenS() {
  let T = S.teilen;
  if (!T || typeof T !== "object" || Array.isArray(T)) T = S.teilen = {};
  if (T.ok !== true && T.ok !== false) T.ok = null;
  if (typeof T.erinnern !== "boolean") T.erinnern = true;
  for (const k of ["offen", "tabs", "z"]) if (!T[k] || typeof T[k] !== "object" || Array.isArray(T[k])) T[k] = {};
  for (const k of ["tage", "gesendet"]) if (!Array.isArray(T[k])) T[k] = [];
  for (const k of ["seit", "naechste", "gefragt", "neinAb"]) if (typeof T[k] !== "string") T[k] = "";
  for (const k of ["kopiert", "nein", "var"]) if (!Number.isFinite(T[k])) T[k] = 0;
  if (!T.seit) T.seit = heute();
  return T;
}
function tlNeinNaechste() { const T = teilenS(), h = heute(); if (!T.neinAb) T.neinAb = h; return tagPlus(h, tlTage(T.neinAb, h) < TEILEN_NEIN_PHASE ? TEILEN_NEIN_TAGE : TEILEN_NEIN_SPAETER); }
function teilenZaehl(k) { try { const T = teilenS(); T.z[k] = (T.z[k] || 0) + 1; speichern(); } catch (e) { } }
function teilenGeoeffnet(id) { try { if (!TEILEN_BLAETTER[id]) return; const T = teilenS(); T.offen[id] = (T.offen[id] || 0) + 1; } catch (e) { } } // gespeichert wird beim nächsten speichern()
/* Tabs und Plauder-Anrufe mitzählen (nur Kennungen) */
document.addEventListener("click", ev => {
  try {
    const el = ev.target && ev.target.closest && ev.target.closest("[data-tab],[data-act=tel-ruf],[data-act=tel-nochmal]"); if (!el) return;
    const T = teilenS();
    if (el.dataset.tab && TEILEN_TABS[el.dataset.tab]) T.tabs[el.dataset.tab] = (T.tabs[el.dataset.tab] || 0) + 1;
    else if (el.dataset.wer && /^[a-z]+$/.test(el.dataset.wer)) T.z["tel:" + el.dataset.wer] = (T.z["tel:" + el.dataset.wer] || 0) + 1;
    speichern();
  } catch (e) { }
}, true);

/* ---------- Zahlen sammeln ---------- */
const tlDatum = t => { if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return "–"; const d = tagDatum(t); return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`; };
const tlId = s => String(s).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24);
const tlObj = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
const tlN = v => Number.isFinite(Number(v)) ? Math.max(0, Math.round(Number(v))) : 0;
const tlTagen = n => `an ${n} ${n === 1 ? "Tag" : "Tagen"}`;
function tlTage(von, bis) { return Math.round((tagDatum(bis) - tagDatum(von)) / 864e5); }
/* Tätigkeit → fester App-Name; eigene Tätigkeiten (von Rita benannt) nur als Sammelposten */
function tlTat(id) {
  const eigen = typeof id !== "string" || id.startsWith("eig") || (S.eigeneT || []).some(x => x && x.id === id);
  if (eigen) return { k: "eig", n: "Eigene Tätigkeiten" };
  const t = (D.taetigkeiten || []).find(x => x.id === id);
  if (t) return { k: tlId(id), n: t.kurz || t.name };
  const fest = { ausflug: "Ausflug", planung: "Ausflug geplant" }; return fest[id] ? { k: id, n: fest[id] } : { k: "andere", n: "Andere" };
}
function teilenDaten() {
  const T = teilenS(), h = heute(), E = Array.isArray(S.eintraege) ? S.eintraege : [];
  const start = /^\d{4}-\d{2}-\d{2}$/.test(S.start || "") ? S.start : T.seit;
  const tageIn = n => { const ab = tagPlus(h, -(n - 1)); return new Set(E.filter(e => e.tag >= ab && e.tag <= h).map(e => e.tag)).size; };
  const ab30 = tagPlus(h, -29), kat = {};
  E.forEach(e => { const t = tlTat(e.t); const k = kat[t.k] || (kat[t.k] = { n: t.n, g: 0, m: 0 }); k.g++; if (e.tag >= ab30) k.m++; });
  const kats = Object.entries(kat).sort((a, b) => b[1].g - a[1].g);
  const dunkel = S.theme === "dark" || (S.theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  const B = {}; // Bereiche: { label, ja, info, kurz }
  const KL = { mitbringsel: "Mitbringsel", lupe: "Lupe/Funkeln", rundgang: "Rundgang", tv: "TV", winter: "Winter", gesicht: "Gesichter", huhn: "Hühnchen halten", maxbriefe: "Max-Briefe", raetsel: "Rätsel", rede: "Redensarten", ereignisse: "Besuch", buecher: "Bücherregal", tagebuch: "Tagebuch-Frage", wetter: "Wetter", akte: "Akte", bingo: "Bingo", dank: "Dankbar", schoen: "Schön-Momente", kramladen: "Kramladen", kleiderschrank: "Kleiderschrank", karin: "Karin", patience: "Patience", plaudern: "Plaudern", goennen: "Gönn-Karten", tagesfarben: "Tagesfarben", notfall: "Notfallplan", angebote: "Angebote", memory: "Memory", wunsch: "Wunsch" };
  const add = (k, label, ja, info, kurz) => { B[k] = { label, kl: KL[k], ja: !!ja, info: info || "", kurz: kurz == null ? (ja ? 1 : 0) : kurz }; };
  const ent = tlObj(S.entdeckt), off = T.offen, z = T.z;
  // Kurz plaudern: Anrufe pro Figur (gezählt) und verschiedene Gespräche (aus dem Telefon-Zähler)
  try {
    const gef = tlObj(S.anrufeGefuehrt), proWer = {};
    let alle = (D.anrufe || []).slice(); try { if (typeof hpAnrufe === "function") alle = alle.concat(hpAnrufe() || []); } catch (x) { }
    for (const id in gef) { const a = alle.find(x => x && x.id === id); const w = a && /^[a-z]+$/.test(a.wer) ? a.wer : "andere"; proWer[w] = proWer[w] || { g: 0, a: 0 }; proWer[w].g++; }
    for (const k in z) if (k.startsWith("tel:")) { const w = k.slice(4); proWer[w] = proWer[w] || { g: 0, a: 0 }; proWer[w].a += tlN(z[k]); }
    const wl = typeof TEL_WER === "object" ? TEL_WER : {};
    const teile = Object.entries(proWer).sort((a, b) => (b[1].a + b[1].g) - (a[1].a + a[1].g)).map(([w, v]) => `${wl[w] || "Andere"} ${v.a}× (${v.g} Gespr.)`);
    add("plaudern", "Kurz plaudern", teile.length || ent.plaudern, teile.join(", "), Object.values(proWer).reduce((s, v) => s + v.a, 0));
    T._tel = Object.entries(proWer).map(([w, v]) => `${tlId(w)}:${v.a}/${v.g}`).join(",");
  } catch (e) { add("plaudern", "Kurz plaudern", ent.plaudern); }
  const kv = Object.keys(tlObj(S.brevGelesen)).length; add("karin", "Briefe von Karin", kv || ent.karin, `${kv} gelesen`, kv);
  try {
    const a = S.akte && S.akte.b && S.akte.b[4], kap = (D.hpAkte && D.hpAkte.baende && D.hpAkte.baende[4] && D.hpAkte.baende[4].kapitel) || 37;
    const st = a ? tlN(a.stand) : 0; add("akte", "Akte Feuerkelch", !!S.akte, S.akte ? `Kapitel ${st} von ${kap}` : "", st);
    T._hp = S.akte ? `${st}/${kap}` : "0";
  } catch (e) { add("akte", "Akte Feuerkelch", !!S.akte); }
  if (S.hp && Number.isFinite(S.hp.kapitel)) T._lb = `${tlN(S.hp.band)}.${tlN(S.hp.kapitel)}`;
  add("patience", "Waldpatience", tlN(off.spiel) || (S.spiel && S.spiel.genutzt), `${tlN(off.spiel)}× geöffnet`, tlN(off.spiel));
  // Kramladen: Anzahl und welche Waren (feste Waren-Namen)
  try {
    const gk = Object.keys(tlObj(S.gekauft)).filter(id => id !== "patience"), name = id => ((D.laden || []).find(x => x.id === id) || {}).name;
    const sf = tlObj(S.schaufenster && S.schaufenster.kaeufe), sfn = Object.entries(sf).filter(([, n]) => tlN(n)).map(([id, n]) => { const x = typeof SF !== "undefined" ? SF.find(y => y.id === id) : null; return x ? `${x.name}${tlN(n) > 1 ? " ×" + tlN(n) : ""}` : null; }).filter(Boolean);
    const hv = (S.halle && Array.isArray(S.halle.verlauf)) ? S.halle.verlauf.length : 0;
    const waren = gk.map(name).filter(Boolean).concat(sfn);
    const n = gk.length + Object.values(sf).reduce((s, v) => s + tlN(v), 0);
    add("kramladen", "Kramladen", n || ent.kramladen || off.laden, `${n} ${n === 1 ? "Kauf" : "Käufe"}${waren.length ? ": " + waren.join(", ") : ""}${hv ? ` · Aus Halle eingelöst: ${hv}` : ""}`, n);
    T._ka = gk.map(tlId).concat(Object.keys(sf).map(tlId)).join(",");
  } catch (e) { add("kramladen", "Kramladen", ent.kramladen); }
  try {
    const sk = S.skins || {}, map = typeof SKIN_MAP === "object" ? SKIN_MAP : {}, ge = tlObj(sk.geschenkt);
    const bes = Object.keys(tlObj(sk.besitz)).filter(id => map[id]), gek = bes.filter(id => !ge[id]);
    const traegt = ["rita", "huhn"].map(f => sk[f] && map[sk[f]] ? `${f === "rita" ? "Rita" : "Hühnchen"}: ${map[sk[f]].name}` : "").filter(Boolean);
    add("kleiderschrank", "Kleiderschrank", gek.length || ent.kleiderschrank || off.schrank, `${gek.length} gekauft, ${bes.length - gek.length} geschenkt${traegt.length ? " · trägt gerade " + traegt.join(", ") : ""}`, gek.length);
    T._sk = `${gek.length}/${bes.length}`;
  } catch (e) { add("kleiderschrank", "Kleiderschrank", ent.kleiderschrank); }
  try {
    const fh = S.fuerHuhn || {}, sum = o => Object.values(tlObj(o)).reduce((s, v) => s + tlN(v), 0), g = sum(fh.gekauft), gg = sum(fh.gegeben);
    add("mitbringsel", "Mitbringsel für Hühnchen", g || off["fh-ware"], `${g} gekauft, ${gg} gegeben, Album: ${Object.keys(tlObj(fh.album)).length}`, g);
    T._fh = `${g}/${gg}`;
  } catch (e) { add("mitbringsel", "Mitbringsel für Hühnchen", false); }
  const gkn = S.goenn && Array.isArray(S.goenn.karten) ? S.goenn.karten.length : 0; add("goennen", "Gönn-Karten", gkn || ent.goennen, `${gkn} gesammelt`, gkn);
  const jfn = S.jf && S.jf.tage && typeof S.jf.tage === "object" ? Object.keys(S.jf.tage).length : 0; add("tagesfarben", "Tagesfarben", jfn, `${tlTagen(jfn)} gewählt${S.jf && S.jf.an === false ? " (ausgeschaltet)" : ""}`, jfn);
  const rg = S.rundgang && typeof S.rundgang === "object" ? S.rundgang : null;
  add("rundgang", "Rundgang mit Max", rg && (rg.fertig || rg.gesehen), rg ? (rg.fertig ? "abgeschlossen" : rg.gesehen ? "angefangen, nicht beendet" : "eingeladen, nicht gestartet") : "noch nie", rg && rg.fertig ? 2 : rg && rg.gesehen ? 1 : 0);
  const geu = tlN(S.ruhe && S.ruhe.geuebt); add("notfall", "Notfallplan", geu || ent.notfall || off.ruhe, `geübt: ${geu ? "ja, " + geu + "×" : "nein"} · ${tlN(off.ruhe)}× geöffnet`, geu);
  add("wetter", "Wetter", ent.wetter || off.wetter || off.bildwetter, `Wetter-Blatt ${tlN(off.wetter)}× · Wetter im Bild: ${S.bildWetter && S.bildWetter !== "echt" ? "selbst eingestellt (" + tlId(S.bildWetter) + ")" : "echt"}`, tlN(off.wetter));
  let en = 0, eg = 0; try { en = entdecktZahl(); eg = entdeckFest().length; } catch (e) { }
  const fu = tlN(z.funkeln);
  add("lupe", "Lupe und Funkeln im Bild", (S.halte && S.halte.lupe) || en || fu || ent.bild, `Lupe benutzt: ${S.halte && S.halte.lupe ? "ja" : "nein"} · entdeckt ${en} von ${eg} · Funkeln angetippt ${fu}×`, fu);
  add("tagebuch", "Tagebuch-Frage", ent.tagebuch || off["rb-schoen"], "", ent.tagebuch ? 1 : 0);
  add("buecher", "Bücherregal", ent.buecher || off.lesen, `${(S.buecherEigen || []).length} Bücher eingetragen`, (S.buecherEigen || []).length);
  add("tv", "Film & Fernsehen", ent.tv || off.tv, `${tlN(off.tv)}× geöffnet, ${(S.tvMerk || []).length || Object.keys(tlObj(S.tvMerk)).length} gemerkt`, tlN(off.tv));
  add("winter", "Gut durch den Winter", ent.winter || off.winter, `${tlN(off.winter)}× geöffnet`, tlN(off.winter));
  add("angebote", "Angebote", ent.angebote || off.angebote, `${tlN(off.angebote)}× geöffnet`, tlN(off.angebote));
  add("gesicht", "Gesichter basteln", ent.gesicht, `${(S.menschen || []).filter(m => m && m.avatar).length} von ${(S.menschen || []).length} Herzensmenschen mit Gesicht`, (S.menschen || []).filter(m => m && m.avatar).length);
  add("huhn", "Hühnchen festhalten", S.halte && S.halte.huhn, "", S.halte && S.halte.huhn ? 1 : 0);
  const mbn = S.maxBriefe && Array.isArray(S.maxBriefe.archiv) ? S.maxBriefe.archiv.length : 0; add("maxbriefe", "Briefe von Max", mbn, `${mbn} gelesen`, mbn);
  const mem = tlN(S.memory && S.memory.spiele); add("memory", "Memory", mem || off.memory, `${mem} Spiele`, mem);
  const bl = Object.values(tlObj(S.bingo)).reduce((s, b) => s + tlN(b && b.linien), 0), bw = Object.keys(tlObj(S.bingo)).length; add("bingo", "Forst-Bingo", bw || off.bingo, `${bw} Wochen, ${bl} Reihen`, bl);
  const rae = Object.values(tlObj(S.raetsel)).filter(r => r && r.geloest).length; add("raetsel", "Rätsel der Woche", Object.keys(tlObj(S.raetsel)).length, `${rae} gelöst`, rae);
  const red = Object.keys(tlObj(S.rede && S.rede.gesendet)).length; add("rede", "Schwedische Redensarten", red || off.rede, `${red}× an Max geschickt`, red);
  const dk = Object.keys(tlObj(S.dank && S.dank.tage)).length; add("dank", "Dankbar heute", dk, tlTagen(dk), dk);
  const mo = Object.keys(tlObj(S.momente)).length; add("schoen", "Was war heute schön?", mo, tlTagen(mo), mo);
  const er = Object.keys(tlObj(S.ereignisse)).length; add("ereignisse", "Besuch (Ereignisse)", er, `${er} verschiedene erlebt`, er);
  const wu = (S.wuensche || []).length; add("wunsch", "Wunsch an Max", wu || off.wunsch, `${wu} geschickt`, wu);
  const zahlen = {
    tschuess: tlN(S.tschuessSiege), daumen: tlN(S.daumen), menschen: (S.menschen || []).length,
    liste: (S.liste || []).length, listeErl: (S.liste || []).filter(x => x && x.erledigt).length,
    vorhaben: (S.missionen && Array.isArray(S.missionen.fertig)) ? S.missionen.fertig.length : 0, plaene: (S.plaene || []).length, eigene: (S.eigeneT || []).filter(x => x && !x.weg).length
  };
  const verdient = tlN(S.taler) + tlN(S.talerAusgegeben);
  return { T, h, start, a30: tageIn(30), a90: tageIn(90), offenTage: T.tage.length, kats, dunkel, B, zahlen, verdient };
}

/* ---------- Text bauen ---------- */
function teilenText(frei) {
  const d = teilenDaten(), T = d.T, h = d.h, Z = [];
  const letzte = T.gesendet.length ? T.gesendet[T.gesendet.length - 1] : "";
  Z.push(`${TEILEN_KENNUNG} ${tlDatum(h)}`);
  const nt = tlTage(d.start, h) + 1;
  Z.push(`Zeitraum: ${tlDatum(d.start)} bis ${tlDatum(h)} (${nt} ${nt === 1 ? "Tag" : "Tage"})${letzte ? ` · letzte Übersicht: ${tlDatum(letzte)}` : ""}`);
  Z.push(`Version ${BUILD} · Schrift: ${["", "Normal", "Groß", "Sehr groß"][S.size] || S.size} · ${S.theme === "auto" ? `wie das Handy (gerade ${d.dunkel ? "dunkel" : "hell"})` : d.dunkel ? "dunkel" : "hell"} · Anrede: ${S.anrede === "sie" ? "Sie" : "du"}`);
  Z.push("");
  Z.push(`Aktive Tage: ${d.a30} der letzten 30 · ${d.a90} der letzten 90`);
  Z.push(`App geöffnet an ${d.offenTage} ${d.offenTage === 1 ? "Tag" : "Tagen"} (gezählt seit ${tlDatum(T.seit)})`);
  Z.push("");
  const E = d.kats, sum = E.reduce((s, [, v]) => s + v.g, 0);
  Z.push(`Einträge: ${sum} (gesamt/30 Tage)`);
  if (E.length) { const top = E.slice(0, 14).map(([, v]) => `${v.n} ${v.g}/${v.m}`), rest = E.slice(14); Z.push(top.join(" · ") + (rest.length ? ` · ${rest.length} weitere Arten ${rest.reduce((s, [, v]) => s + v.g, 0)}` : "")); }
  Z.push("");
  Z.push("Bereiche:");
  const B = Object.values(d.B), nie = B.filter(b => !b.ja);
  B.filter(b => b.ja).forEach(b => Z.push(`– ${b.label}${b.info ? ": " + b.info : ""}`));
  const zz = d.zahlen;
  Z.push(`– Sonst: Tschüss-Siege ${zz.tschuess} · Liste ${zz.liste} (${zz.listeErl} erledigt) · Vorhaben fertig ${zz.vorhaben} · Herzensmenschen ${zz.menschen} · eigene Tätigkeiten ${zz.eigene}`);
  const tabs = Object.entries(T.tabs).filter(([k]) => TEILEN_TABS[k]).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${TEILEN_TABS[k]} ${tlN(n)}`);
  if (tabs.length) { Z.push(""); Z.push("Tabs geöffnet: " + tabs.join(" · ")); } // welche Blätter wie oft: im Block unten (o=)
  Z.push("");
  Z.push(`Nie geöffnet: ${nie.length ? nie.map(b => b.kl || b.label).join(", ") : "nichts – alles schon ausprobiert"}`);
  Z.push(`Taler: ${tlN(S.taler)} übrig · ${tlN(S.talerAusgegeben)} ausgegeben · ${d.verdient} verdient`);
  const f = String(frei || "").trim();
  if (f) { Z.push(""); Z.push("Was ich Max noch sagen will:"); Z.push(f); }
  Z.push("");
  Z.push(teilenMaschine(d));
  return Z.join("\n");
}
/* Maschinenlesbarer Block: kompakt, nur Kennungen und Zahlen */
function teilenMaschine(d) {
  const T = d.T, q = [];
  const kv = (k, v) => { if (v !== "" && v != null) q.push(`${k}=${v}`); };
  kv("v", 1); kv("d", d.h); kv("st", d.start); kv("b", String(BUILD).replace(" ", "T").replace(/[^0-9:T-]/g, "")); kv("sz", tlN(S.size)); kv("th", `${tlId(S.theme)}/${d.dunkel ? "d" : "h"}`); kv("an", S.anrede === "sie" ? "sie" : "du");
  kv("a30", d.a30); kv("a90", d.a90); kv("ot", d.offenTage); if (T.seit !== d.start) kv("ts", T.seit);
  kv("e", d.kats.map(([k, v]) => `${k}:${v.g}${v.m ? "/" + v.m : ""}`).join(","));
  kv("t", Object.entries(T.tabs).filter(([k]) => TEILEN_TABS[k]).map(([k, n]) => `${k}:${tlN(n)}`).join(","));
  kv("o", Object.entries(T.offen).filter(([k]) => TEILEN_BLAETTER[k]).map(([k, n]) => `${k}:${tlN(n)}`).join(","));
  kv("tel", T._tel || ""); kv("hp", T._hp || ""); kv("lb", T._lb || ""); kv("ka", T._ka || ""); kv("sk", T._sk || ""); kv("fh", T._fh || "");
  kv("u", Object.entries(d.B).filter(([, b]) => b.ja).map(([k, b]) => `${k}:${tlN(b.kurz) || 1}`).join(",")); // fehlt ein Bereich, wurde er nie genutzt
  kv("tl", `${tlN(S.taler)}/${tlN(S.talerAusgegeben)}`); kv("gs", T.gesendet.length);
  return `[RA-NUTZUNG ${q.join(";")}]`;
}

/* ---------- Ansichten ---------- */
let TEILEN_FREI = "", TEILEN_SCHRITT = "";  // Freitext bleibt nur im Speicher, bis das Blatt zu ist
const tlMaxKopf = html => `<div class="max-karte teilen-max"><span class="fig-idle">${maxSVG(56)}</span><div class="bogen post brief" style="flex:1;min-width:0;margin:0">${html}</div></div>`;
function teilenVorschau() { return `<pre class="teilen-vorschau" id="teilen-vorschau" aria-label="So sieht die Nachricht an Max aus">${esc(teilenText(TEILEN_FREI))}</pre>`; }
function teilenInhalt() {
  const T = teilenS(), lang = teilenText(TEILEN_FREI).length > TEILEN_LINK_MAX;
  return tlMaxKopf(`<p style="margin:0">${A("Hilf mir, die App besser zu machen. Ich sehe nur, welche Teile du wie oft benutzt – nichts von dem, was du schreibst.", "Helfen Sie mir, die App besser zu machen. Ich sehe nur, welche Teile Sie wie oft benutzen – nichts von dem, was Sie schreiben.")}</p>`)
    + `<h3 style="margin-top:16px">Das geht an Max</h3>
    <p class="klein" style="margin-top:0">Genau dieser Text, nichts sonst. ${A("Du schickst", "Sie schicken")} ihn selbst ab.</p>
    ${teilenVorschau()}
    <p class="klein teilen-ohne">${ic("schild")}<span>Nicht dabei: Tagebuch, „Was war heute schön?“, Dank-Zeilen, Merkzettel, Liste, eigene Ideen, Notfallplan, Telefonnummern, Namen und Gesichter.</span></p>
    <label class="feld" for="teilen-frei">Was ich Max noch sagen will <span class="klein">(freiwillig)</span></label>
    <textarea id="teilen-frei" class="text" rows="3" data-teilen-frei="1" placeholder="Zum Beispiel: Das Memory spiel ich am liebsten.">${esc(TEILEN_FREI)}</textarea>
    <p class="klein" id="teilen-lang"${lang ? "" : " hidden"}>Der Text ist lang. Beim Schicken wird er erst kopiert, dann öffnet sich WhatsApp – dort einfügen und senden.</p>
    <h3 style="margin-top:18px">Einstellung</h3>
    ${schalter(T.ok === true, "Nutzung mit Max teilen", `data-act="teilen-um"`, T.ok === true ? "Etwa alle vier Wochen fragt die App, ob eine neue Übersicht rausgehen soll." : "Aus. Schicken geht trotzdem jederzeit hier.")}
    ${T.ok === true ? "" : schalter(T.erinnern !== false, "Erinnerungen an ‚Nutzung teilen‘", `data-act="teilen-erinnern"`, "Max fragt ab und zu nochmal nach.")}
    ${T.gesendet.length ? `<p class="klein">Zuletzt geschickt: ${tlDatum(T.gesendet[T.gesendet.length - 1])}.</p>` : ""}`;
}
function teilenFuss() {
  if (TEILEN_SCHRITT === "kopiert") return `<div class="stapel"><p class="klein teilen-anleitung" style="margin:0"><b>Text ist kopiert.</b> Jetzt WhatsApp öffnen, im Chat mit Max lange ins Textfeld tippen, „Einfügen“ wählen und auf Senden tippen.</p><button class="knopf haupt voll" data-act="teilen-wa">${ic("brief")} WhatsApp öffnen</button><button class="knopf leise" data-act="teilen-kopie">Nochmal kopieren</button></div>`;
  return `<div class="stapel"><button class="knopf haupt voll" data-act="teilen-senden">${ic("brief")} An Max schicken</button><button class="knopf zweit voll" data-act="teilen-kopie">Als Text kopieren</button></div>`;
}
function teilenSheet() {
  TEILEN_SCHRITT = "";
  sheet({ titel: "Nutzung mit Max teilen", id: "teilen", inhalt: teilenInhalt(), fuss: teilenFuss(), onclose: () => { TEILEN_FREI = ""; TEILEN_SCHRITT = ""; } });
}
/* Erste Frage (einmal) und Erinnerungen nach „Lieber nicht“ */
let TEILEN_ENTSCHIEDEN = false;
function teilenFrageSheet(erinnerung) {
  const T = teilenS(); TEILEN_ENTSCHIEDEN = false; T.gefragt = heute(); speichern();
  const text = erinnerung ? TEILEN_ERINNERN[T.var % TEILEN_ERINNERN.length]
    : "Ich würd gern sehen, welche Teile du am meisten benutzt, damit ich die App für dich besser machen kann. Nur, was du wie oft öffnest – nichts von dem, was du schreibst.";
  if (erinnerung) { T.var = (T.var + 1) % 1000; speichern(); }
  sheet({ titel: erinnerung ? "Kleine Bitte von Max" : "Eine Frage von Max", id: "teilen-frage",
    inhalt: tlMaxKopf(`<p style="margin:0">${esc(text)}</p><p class="mb-ort" style="margin:8px 0 0;text-align:right">Dein Max</p>`)
      + `<p class="klein" style="margin-top:12px">Geschickt wird nur, wenn ${A("du selbst tippst", "Sie selbst tippen")}. Vorher ${A("siehst du", "sehen Sie")} genau, was drinsteht.</p>`
      + `<div id="teilen-frage-vorschau"></div>`
      + (erinnerung ? `<p class="klein">Diese Erinnerung lässt sich in den Einstellungen ausschalten.</p>` : ""),
    fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="teilen-ja">Ja, gern</button><button class="knopf zweit voll" data-act="teilen-nein">${erinnerung ? "Nicht jetzt" : "Lieber nicht"}</button><button class="knopf leise" data-act="teilen-was">Was genau?</button></div>`,
    onclose: () => { if (!TEILEN_ENTSCHIEDEN) { const t = teilenS(); if (t.ok == null) t.naechste = tagPlus(heute(), TEILEN_OFFEN_TAGE); else if (t.ok === false) t.naechste = tlNeinNaechste(); speichern(); } } });
}

/* ---------- Aktionen ---------- */
function tlWhatsApp(text) { const u = `https://wa.me/${MAX_WA}${text ? "?text=" + encodeURIComponent(text) : ""}`; try { window.open(u, "_blank"); } catch (e) { location.href = u; } }
function tlGesendet() { const T = teilenS(), h = heute(); if (T.gesendet[T.gesendet.length - 1] !== h) T.gesendet.push(h); T.gesendet = T.gesendet.slice(-24); if (T.ok === true) T.naechste = tagPlus(h, TEILEN_JA_TAGE); speichern(); }
function teilenAktion(a, d, el) {
  const T = teilenS();
  switch (a) {
    case "teilen-auf": teilenSheet(); return;
    case "teilen-ja": TEILEN_ENTSCHIEDEN = true; T.ok = true; T.neinAb = ""; T.erinnern = true; T.naechste = tagPlus(heute(), TEILEN_JA_TAGE); speichern(); haptik("erfolg");
      sheetZu(); setTimeout(teilenSheet, REDUCED() ? 0 : 240); return; // gleich die Übersicht mit „An Max schicken“
    case "teilen-nein": TEILEN_ENTSCHIEDEN = true; T.ok = false; T.nein++; T.naechste = tlNeinNaechste(); speichern(); haptik("auswahl");
      sheetZu(); toast("Alles klar. Geht jederzeit in den Einstellungen unter „Hilfe und Infos“."); return;
    case "teilen-was": { const v = $("#teilen-frage-vorschau"); if (!v) return; if (v.innerHTML) { v.innerHTML = ""; return; } v.innerHTML = `<h3 style="margin-top:12px">So sähe die Nachricht aus</h3>${teilenVorschau()}<p class="klein teilen-ohne">${ic("schild")}<span>Nicht dabei: Tagebuch, „Was war heute schön?“, Dank-Zeilen, Merkzettel, Liste, eigene Ideen, Notfallplan, Telefonnummern, Namen und Gesichter.</span></p>`; armHaptics(); return; }
    case "teilen-um": T.ok = T.ok === true ? false : true; if (T.ok) { T.neinAb = ""; T.naechste = tagPlus(heute(), TEILEN_JA_TAGE); } else { T.neinAb = ""; T.naechste = tlNeinNaechste(); } speichern(); sheetInhalt(teilenInhalt()); return;
    case "teilen-erinnern": T.erinnern = !T.erinnern; if (T.erinnern && T.ok === false && !T.naechste) T.naechste = tlNeinNaechste(); speichern(); sheetInhalt(aktuellesSheet()?.dataset.id === "einst" ? einstellungenInhalt() : teilenInhalt()); return;
    case "teilen-kopie": kopieren(teilenText(TEILEN_FREI), "Kopiert. Jetzt bei Max in WhatsApp einfügen."); T.kopiert++; speichern(); return;
    case "teilen-senden": {
      const text = teilenText(TEILEN_FREI);
      if (text.length > TEILEN_LINK_MAX) { kopieren(text, "Kopiert."); T.kopiert++; speichern(); TEILEN_SCHRITT = "kopiert"; sheetFuss(teilenFuss()); return; }
      tlWhatsApp(text); tlGesendet(); TEILEN_FREI = ""; sheetZu(); toast("Danke! Max freut sich.", { erfolg: true }); return;
    }
    case "teilen-wa": tlWhatsApp(""); tlGesendet(); TEILEN_FREI = ""; TEILEN_SCHRITT = ""; sheetZu(); toast("Danke! Im Chat mit Max einfügen und senden.", { erfolg: true, dauer: 9000 }); return;
  }
}
document.addEventListener("input", ev => {
  const el = ev.target; if (!el.dataset || !el.dataset.teilenFrei) return;
  TEILEN_FREI = el.value.slice(0, 600);
  const p = $("#teilen-vorschau"), t = teilenText(TEILEN_FREI); if (p) p.textContent = t;
  const l = $("#teilen-lang"); if (l) l.hidden = t.length <= TEILEN_LINK_MAX;
});

/* ---------- Einstellungen: eine Zeile ---------- */
function teilenEinstZeile() {
  const T = teilenS(), unter = T.ok === true ? "An – Übersicht ansehen und schicken" : T.ok === false ? "Aus – antippen zum Ansehen" : "Freiwillig: nur, was du wie oft benutzt";
  return zeileBtn("liste", "Nutzung mit Max teilen", unter, `data-act="teilen-auf"`)
    + (T.ok === true ? "" : schalter(T.erinnern !== false, "Erinnerungen an ‚Nutzung teilen‘", `data-act="teilen-erinnern"`, "Max fragt ab und zu nochmal nach."));
}

/* ---------- Wann fragt die App? ----------
   – höchstens einmal am Tag, nie über einem offenen Fenster, nie während des Rundgangs,
   – nicht beim ersten Öffnen, wenn gerade Post oder Besuch da ist: dann erst nach dem ersten Tipp,
   – Erinnerungen (nach Nein) nie gleich beim Öffnen, sondern nach dem ersten Tipp und etwas Zeit. */
(function () {
  const T0 = teilenS(), schonEingerichtet = !!S.onboard, h0 = heute();
  if (T0.tage[T0.tage.length - 1] !== h0) { T0.tage.push(h0); T0.tage = T0.tage.slice(-120); }
  speichern();
  const auto = () => !navigator.webdriver || window.TEILEN_AUTO === true; // Testläufe: nur auf Wunsch
  let getippt = false, fertig = false, t0 = Date.now();
  const frei = () => {
    if (SHEETS.length || $$(".sheet:not(.zu)").length) return false;
    if (window.RUNDGANG && RUNDGANG.aktiv) return false; if ($("#rundgang")) return false;
    if ($(".ereignis:not(.weg)")) return false;
    const rg = S.rundgang; if (rg && rg.eingeladen === heute() && !rg.gesehen && !rg.fertig) return false; // heute lädt Max schon zum Rundgang ein
    return true;
  };
  const postDa = () => !!$("button.umschlag") || !!$(".ereignis:not(.weg)");
  function pruefen(art) {
    if (fertig || !auto()) return;
    try {
      const T = teilenS(), h = heute(); if (!S.onboard || !schonEingerichtet) return;
      if (T.gefragt === h) { fertig = true; return; } // höchstens einmal am Tag
      if (!frei()) return;
      if (T.ok == null) {
        if (T.naechste && h < T.naechste) { fertig = true; return; }
        if (art === "start" && postDa()) return; // erst nach dem ersten Tipp
        fertig = true; teilenFrageSheet(false); return;
      }
      if (T.ok === false) {
        if (!T.erinnern || (T.naechste && h < T.naechste)) { fertig = true; return; }
        if (art === "start" || !getippt || Date.now() - t0 < 15000 || postDa()) return; // nie gleich beim Öffnen, nie wenn Post oder Besuch wartet
        fertig = true; teilenFrageSheet(true); return;
      }
      if (T.ok === true) {
        if (!T.naechste || h < T.naechste) { fertig = true; return; }
        if (art === "start" && postDa()) return;
        fertig = true; T.gefragt = h; T.naechste = tagPlus(h, TEILEN_JA_TAGE); speichern();
        toast("Neue Übersicht für Max?\nWelche Teile du wie oft benutzt – du siehst vorher alles.", { knopf: { act: "teilen-auf", text: "Ansehen" }, dauer: 12000 });
      }
    } catch (e) { }
  }
  setTimeout(() => pruefen("start"), 4500);
  document.addEventListener("pointerdown", () => { getippt = true; }, true);
  // nach einem Tipp (Fenster zu, Tab gewechselt …) in Ruhe nochmal schauen
  document.addEventListener("click", () => { if (!fertig) setTimeout(() => pruefen("tipp"), 1200); }, true);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { const T = teilenS(), h = heute(); if (T.tage[T.tage.length - 1] !== h) { T.tage.push(h); T.tage = T.tage.slice(-120); speichern(); } fertig = false; t0 = Date.now(); getippt = false; setTimeout(() => pruefen("start"), 2500); } });
  window.TEILEN_PRUEFEN = pruefen; // für Tests
})();
