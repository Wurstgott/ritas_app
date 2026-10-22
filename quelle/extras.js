/* ============================================================
   Extras: weitere Überraschungen (deklarativ), Forst-Bingo,
   Christianes Sonntagsrätsel, Gutscheine für Echtes, Post aus dem Repo.
   ============================================================ */

/* ---------- Überraschungen aus D.eier2 (mit Auslöser-Beschreibung) ---------- */
D.eierWann = {};
(D.eier2 || []).forEach(e => { D.eier[e.id] = { wer: e.wer, text: e.text, form: e.form, selten: e.selten ?? 1 }; D.eierWann[e.id] = e.wann || { typ: "zufall" }; if (e.wann && e.wann.typ === "tagesform" && e.wann.v === "D") EI_LEISE.push(e.id); if (e.wann && e.wann.typ === "zaehler") EI_EINMAL.push(e.id); });
function eier2Tag() {
  const d = jetzt(), h = d.getHours(), m = d.getMonth() + 1, md = `${String(m).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`, wt = d.getDay();
  const zeit = w => (w.ab == null || h >= w.ab) && (w.bis == null || h < w.bis);
  const ids = Object.entries(D.eierWann).filter(([, w]) =>
    (w.typ === "datum" && w.md === md && zeit(w)) ||
    (w.typ === "wochentag" && w.tag === wt && zeit(w) && (!w.monate || w.monate.includes(m))) ||
    (w.typ === "uhr" && zeit(w)) || (w.typ === "monat" && w.m === m)).map(([id]) => id);
  // Datum zuerst, dann der Rest gemischt
  ids.sort((a, b) => (D.eierWann[b].typ === "datum") - (D.eierWann[a].typ === "datum") || hash32(a + heute()) - hash32(b + heute()));
  if (eiVersuch(ids, "tag")) return;
  const zufall = Object.entries(D.eierWann).filter(([, w]) => w.typ === "zufall").map(([id]) => id).sort((a, b) => hash32(a + heute()) - hash32(b + heute()));
  eiVersuch(zufall.slice(0, 3), "tag");
}
function eier2Eintrag(e) {
  const ids = Object.entries(D.eierWann).filter(([id, w]) =>
    (w.typ === "eintrag" && w.t === e.t && (!w.person || w.person === e.person) && (!w.minMin || (e.min || 0) >= w.minMin)) ||
    (w.typ === "hak" && e.t === "abgehakt" && (() => { try { return new RegExp(w.re, "i").test(e.notiz || ""); } catch (x) { return false; } })()) ||
    (w.typ === "zaehler" && w.t === e.t && S.eintraege.filter(x => x.t === e.t).length === w.n)).map(([id]) => id);
  eiVersuch(ids, "extra");
}
function eier2Tagesform(v) { eiVersuch(Object.entries(D.eierWann).filter(([, w]) => w.typ === "tagesform" && w.v === v).map(([id]) => id).sort((a, b) => hash32(a + heute()) - hash32(b + heute())), "extra"); }
// in die vorhandenen Haken einklinken
{ const t0 = eierTag, e0 = eierEintrag, f0 = eierTagesform;
  eierTag = function () { t0(); try { if (!S.eierAus && S.onboard && !SHEETS.length && S.eierTag && S.eierTag.tages < 1) eier2Tag(); } catch (x) { } };
  eierEintrag = function (e) { e0(e); try { if (e) eier2Eintrag(e); } catch (x) { } };
  eierTagesform = function (v) { f0(v); try { eier2Tagesform(v); } catch (x) { } }; }

/* ---------- Forst-Bingo von Hühnchen (jede Woche neu) ---------- */
function bingoKarte() {
  const kw = kwVon(heute()); S.bingo = S.bingo || {};
  if (!S.bingo[kw]) {
    const pool = (D.bingo?.draussen || []).slice(), ersatz = (D.bingo?.drinnen || []).slice(), r = rnd("bingo" + kw + S.seed);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    for (let i = ersatz.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ersatz[i], ersatz[j]] = [ersatz[j], ersatz[i]]; }
    S.bingo[kw] = { felder: pool.slice(0, 9), ersatz: ersatz.slice(0, 9), an: Array(9).fill(false), drinnen: Array(9).fill(false), linien: 0, voll: false };
    for (const k of Object.keys(S.bingo)) if (k !== kw) delete S.bingo[k];
  }
  return S.bingo[kw];
}
const BINGO_LINIEN = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function bingoSheet() { sheet({ titel: "Forst-Bingo", inhalt: bingoInhalt(), id: "bingo" }); }
function bingoInhalt() {
  if (!(D.bingo?.draussen || []).length) return "<p>Kommt bald.</p>";
  const B = bingoKarte();
  return `<div class="huhn-karte" style="margin-bottom:12px">${huhnSVG({ gr: 60, kopf: true })}<div class="sprechblase"><span class="wer">Hühnchen</span>Neue Karte jede Woche. Drei in einer Reihe, und ich mach was Albernes. Für drinnen gibt’s unten Ersatzfelder.</div></div>
    <div class="bingo" role="grid" lang="de">${B.felder.map((f, i) => { const txt = B.drinnen[i] ? B.ersatz[i] : f; return `<button class="bingo-feld ${B.an[i] ? "an" : ""}" data-act="bingo" data-i="${i}" aria-pressed="${B.an[i]}">${esc(txt)}${B.an[i] ? `<span class="bingo-haken" aria-hidden="true">✓</span>` : ""}</button>`; }).join("")}</div>
    <div class="zeile" style="margin-top:12px;flex-wrap:wrap;gap:8px"><button class="knopf klein zweit" data-act="bingo-drinnen">${ic("haus")} Heute drinnen: Ersatzfelder</button></div>
    <p class="klein" style="margin-top:8px">${B.linien ? `Schon ${B.linien} ${B.linien === 1 ? "Reihe" : "Reihen"} diese Woche.` : "Montag gibt’s eine neue Karte."}</p>`;
}
function bingoAktion(a, d) {
  const B = bingoKarte();
  if (a === "bingo-drinnen") { for (let i = 0; i < 9; i++) if (!B.an[i]) B.drinnen[i] = !B.drinnen[i]; speichern(); sheetInhalt(bingoInhalt()); return true; }
  if (a !== "bingo") return false;
  const i = Number(d.i); B.an[i] = !B.an[i]; haptik("auswahl");
  const linien = BINGO_LINIEN.filter(l => l.every(k => B.an[k])).length;
  if (linien > B.linien) { const neu = linien - B.linien; B.linien = linien; S.taler += 5 * neu; haptik("erfolg"); ton("erfolg");
    toast(["Bingo! Ich hab vor Freude mit dem Sockel gewackelt. Fast umgekippt.", "Reihe voll. Der Hase hat applaudiert. Mit den Ohren.", "Bingo! Das Schwein sagt, es hätte das auch gekonnt. Glaub ich nicht."][linien % 3] + `\n+${5 * neu} Taler`, { erfolg: true }); }
  if (!B.voll && B.an.every(Boolean)) { B.voll = true; S.taler += 20; S.fundstuecke = [{ id: "bingo", tag: heute(), wer: "huhn", text: "Eine ganze Bingo-Karte voll. Ich lass sie rahmen. Also: im Kopf." }, ...(S.fundstuecke || [])]; toast("Karte voll! Das kommt in die Fundstücke.\n+20 Taler", { erfolg: true }); }
  speichern(); sheetInhalt(bingoInhalt()); return true;
}

/* ---------- Christianes Sonntagsrätsel ---------- */
function raetselDerWoche() { const r = D.raetsel || []; if (!r.length) return null; const kw = kwVon(heute()); return { kw, ...r[hash32("raetsel" + kw) % r.length] }; }
function raetselHTML() {
  const d = jetzt(); if (d.getDay() !== 0 || !S.onboard) return "";
  const R = raetselDerWoche(); if (!R) return "";
  const st = (S.raetsel || {})[R.kw] || {};
  if (st.weg) return "";
  return `<section class="abschnitt"><div class="zettel-notiz raetsel"><span class="zettel-nadel" aria-hidden="true"></span><span class="klein" style="font-weight:700">Christianes Sonntagsrätsel</span><p style="margin:4px 0 8px;font-family:Fraunces,Georgia,serif;font-size:1.08rem">${esc(R.frage)}</p>
    ${st.tipp ? `<p class="klein" style="margin:0 0 6px">Tipp: ${esc(R.tipp || "")}</p>` : ""}${st.geloest ? `<p style="margin:0 0 6px;font-weight:700">${esc(R.antwort)}</p>` : ""}
    <div class="zeile" style="flex-wrap:wrap;gap:6px">${!st.tipp && R.tipp ? `<button class="knopf klein leise" data-act="raetsel" data-v="tipp">Tipp</button>` : ""}${!st.geloest ? `<button class="knopf klein leise" data-act="raetsel" data-v="loesen">Auflösung (nach dem Anruf bei Christiane)</button>` : `<button class="knopf klein leise" data-act="raetsel" data-v="weg">Schön, danke</button>`}</div></div></section>`;
}
function raetselAktion(d) { const R = raetselDerWoche(); if (!R) return; S.raetsel = S.raetsel || {}; const st = S.raetsel[R.kw] = S.raetsel[R.kw] || {}; st[d.v === "loesen" ? "geloest" : d.v] = true; speichern(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); }

/* ---------- Gutscheine: Taler gegen Echtes ---------- */
(D.gutscheine || []).forEach(g => { if (!D.laden.some(x => x.id === g.id)) D.laden.push({ id: g.id, gruppe: "Echtes (von Max versprochen)", name: g.name, preis: g.preis, text: g.text, icon: "brief", gutschein: true }); });
function gutscheinSheet(id) {
  const g = (D.gutscheine || []).find(x => x.id === id); if (!g) return;
  sheet({ titel: g.name, inhalt: `<p>${esc(g.text)}</p><p class="klein">Zum Einlösen diesen Text an Max oder Christiane schicken:</p><div class="bogen mulde" id="gutschein-text">${esc(g.nachricht)}</div><button class="knopf zweit voll" style="margin-top:10px" data-act="kopieren" data-was="gutschein-text">Text kopieren</button>` });
}

/* ---------- Echte Post von Max aus dem Repo (post.json) ---------- */
/* Angebote: jeden Sonntag frisch (angebote.json im Repo) */
function angeboteAnwenden() {
  const A = S.angeboteRepo; if (!A || !Array.isArray(A.angebote) || !A.stand || (D.angeboteStand && A.stand < D.angeboteStand)) return;
  D.angeboteStand = A.stand; if (Array.isArray(A.kategorien)) D.angeboteKat = A.kategorien;
  D.angebote = A.angebote.filter(x => x && typeof x.name === "string").map(x => ({ ...x, id: "an-" + angebotId(x.name) }));
}
function angeboteLaden() {
  if (!/github\.io$/.test(location.hostname)) return;
  fetch("angebote.json", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(A => { if (A && Array.isArray(A.angebote) && A.stand && (!S.angeboteRepo || S.angeboteRepo.stand !== A.stand)) { S.angeboteRepo = A; speichern(); angeboteAnwenden(); } }).catch(() => { });
}
function postLaden() {
  if (!/github\.io$/.test(location.hostname)) return;
  fetch("post.json", { cache: "no-store" }).then(r => r.ok ? r.json() : []).then(arr => { if (Array.isArray(arr)) { S.postRepo = arr.filter(b => b && typeof b.text === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.datum || "")); speichern(); } }).catch(() => { });
}
{ const m0 = maxPost; maxPost = function () { const h = heute(); const r = (S.postRepo || []).filter(b => b.datum <= h && !(S.briefe || []).some(x => x.text === b.text)).sort((a, b) => a.datum < b.datum ? -1 : 1)[0]; return r ? r.text : m0(); }; }

/* ---------- Ritas Porträt: Finger drauf halten (oder Maus drüber) = groß daneben, blinzelt und lächelt ---------- */
{ let zeitV = 0, gross = null, lange = false;
  const zeigen = (el) => {
    if (gross) return; const r = el.getBoundingClientRect();
    gross = document.createElement("div"); gross.className = "portrait-gross"; gross.setAttribute("aria-hidden", "true");
    gross.innerHTML = ritaSVG(170);
    gross.style.left = Math.min(innerWidth - 186, r.right + 14) + "px"; gross.style.top = (r.bottom + 10) + "px";
    if ((window._ritaGewunken || 0) < 2 || Math.random() < .6) { window._ritaGewunken = (window._ritaGewunken || 0) + 1; gross._bis = Date.now() + 2300; const verz = (180 + Math.random() * 250) / 1000;
      const arm = `<defs><clipPath id="pg-clip"><rect x="0" y="0" width="100" height="100"/></clipPath></defs><g clip-path="url(#pg-clip)"><g class="winkarm" style="animation-delay:${verz}s"><g class="winkunter" style="animation-delay:${verz + .25}s"><path d="M78 108 Q79 90 82 73" stroke="#141D30" stroke-width="11.6" stroke-linecap="round" fill="none"/><path d="M78 108 Q79 90 82 73" stroke="#22304A" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M77.6 73.6 Q82 71.6 86.4 73.6" stroke="#3A4B6B" stroke-width="2.4" stroke-linecap="round" fill="none"/><g class="winkhand" style="animation-delay:${verz + .25}s"><g transform="translate(-2 4) translate(166 0) scale(-1 1)"><path d="M78 66 Q76 60 77 54 Q77.5 52 79 53 L79.6 58 L79.5 50 Q80 48 81.4 49 L81.8 57 L82.4 48.6 Q83.2 47 84.4 48.4 L84.2 57 L85.4 51 Q86.6 49.8 87.4 51.2 L86.6 60 Q88.6 57.6 90 58.6 Q90.6 60 88.6 62.6 Q86 67 82 67.6 Q79.6 67.8 78 66Z" fill="#F0C9AA" stroke="#D49A7C" stroke-width=".5"/></g></g></g></g></g>`;
      gross.innerHTML = gross.innerHTML.replace("</svg>", arm + "</svg>"); }
    document.body.appendChild(gross); lange = true; haptik("auswahl");
  };
  const weg = () => { clearTimeout(zeitV); if (gross) { const g = gross; gross = null; const rest = Math.max(0, (g._bis || 0) - Date.now()); setTimeout(() => { g.classList.add("zu"); setTimeout(() => g.remove(), 220); }, rest); } };
  document.addEventListener("pointerdown", ev => { const el = ev.target.closest("#logo"); if (!el) return; lange = false; zeitV = setTimeout(() => zeigen(el), 320); });
  document.addEventListener("pointerup", () => { weg(); });
  document.addEventListener("pointercancel", weg);
  document.addEventListener("pointerover", ev => { if (ev.pointerType === "mouse" && ev.target.closest("#logo")) { clearTimeout(zeitV); zeitV = setTimeout(() => zeigen(ev.target.closest("#logo")), 250); } });
  document.addEventListener("pointerout", ev => { if (ev.pointerType === "mouse" && ev.target.closest("#logo") && !(ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest("#logo"))) weg(); });
  document.addEventListener("contextmenu", ev => { if (ev.target.closest("#logo")) ev.preventDefault(); });
  // langes Halten soll nicht zusätzlich die Tipp-Überraschung auslösen
  document.addEventListener("click", ev => { if (lange && ev.target.closest("#logo")) { ev.stopImmediatePropagation(); lange = false; } }, true);
}

const HG_EMOJI = [
  { art: "emo-froh", zeichen: ["✨", "⭐", "✨"], n: 5, flug: "steigen", sprueche: ["Ich glitzere heute. Einfach so.", "Sternstunde! Meine.", "Funkel, funkel, Hühnchen."] },
  { art: "emo-froh", zeichen: ["🍰", "☕"], n: 4, flug: "steigen", sprueche: ["Hab ich da Kuchen gehört?", "Kaffee? Kuchen? Kaffee UND Kuchen?", "Ich nehm das Stück mit der Kirsche."] },
  { art: "emo-zu", zeichen: ["💤", "z", "Z"], n: 4, flug: "steigen", sprueche: ["Bin wach! … Fast.", "Ich hab nur kurz die Augen geschont.", "Mittagsschlaf ist auch Sport."] },
  { art: "emo-froh", zeichen: ["🎉", "🎊", "✨"], n: 6, flug: "steigen", sprueche: ["Party! Warum? Darum!", "Ich feier dich. Einfach so.", "Konfetti ist mein Lieblingswetter."] },
  { art: "emo-froh", zeichen: ["🌸", "🌼", "🌷"], n: 5, flug: "fall", sprueche: ["Blumen für dich. Hab ich selbst … gefunden.", "Riecht nach Frühling hier. Oder nach dir."] },
  { art: "emo-schreck", zeichen: ["❗", "❓"], n: 3, flug: "steigen", sprueche: ["Huch! Du schon wieder!", "Ich hab dich gar nicht kommen sehen!", "Erschreck mich doch nicht so, ich bin aus Ton!"] },
  { art: "emo-froh", zeichen: ["📚", "🔍"], n: 3, flug: "steigen", sprueche: ["Ich lese gerade. Krimi. Der Gärtner war’s nicht.", "Ich ermittle. Verdächtig: alle."] },
  { art: "emo-froh", zeichen: ["☀️", "🌤️"], n: 3, flug: "steigen", sprueche: ["Wetterbericht: Hühnchen sonnig.", "Ich hab die Sonne bestellt. Gern geschehen."] },
  { art: "emo-froh", zeichen: ["❄️", "❄"], n: 7, flug: "fall", sprueche: ["Mir ist kalt. Ich bin aus Peru!", "Schneeflocken! Darf man die essen?"] },
  { art: "emo-froh", zeichen: ["💪"], n: 2, flug: "steigen", sprueche: ["Guck mal, mein Bizeps. … Okay, ich hab keinen.", "Training! Ich hab heute zweimal genickt."] },
  { art: "emo-schreck", zeichen: ["🌽"], n: 2, flug: "steigen", sprueche: ["Wer hat hier Mais gesagt? Ich frag nur.", "Ich hab da so ein Gefühl wegen dem Hofladen …"] },
  { art: "emo-froh", zeichen: ["🎵", "🎶"], n: 5, flug: "steigen", sprueche: ["La-la-laaa! Ich hab Talent. Glaub ich.", "Ich übe für den Chor. Der weiß nur noch nichts davon."] },
  { art: "emo-froh", zeichen: ["🌈"], n: 1, flug: "steigen", sprueche: ["Regenbogen. Für dich hingestellt.", "Ich kann auch bunt."] },
  { art: "emo-froh", zeichen: ["🥚"], n: 1, flug: "steigen", sprueche: ["Nein, das war ich nicht.", "Kein Kommentar."] }
];
/* ---------- Hühnchen: Finger drauf halten = großer Kopf daneben; oft antippen = Feder fliegt ---------- */
{ let zeitH = 0, grossH = null, langH = false, taps = [];
  let mal = [];
  const zeigen = (el) => {
    if (grossH) return; const r = el.querySelector(".huhn")?.getBoundingClientRect() || el.getBoundingClientRect();
    const jetztMs = Date.now(); mal = mal.filter(t => jetztMs - t < 8000).concat(jetztMs); const n = mal.length;
    grossH = document.createElement("div"); grossH.className = "huhn-gross hg-guckt"; grossH.setAttribute("aria-hidden", "true");
    const rot = `<path class="hg-rotkopf" d="M48 46 Q42 22 60 18 Q78 15 79 32 Q80 47 66 51 Q54 53 48 46Z" fill="#E2584A"/><g class="hg-striche" stroke="#B8382C" stroke-width="1.4" stroke-linecap="round"><path d="M53 40 L51 44"/><path d="M57 40.5 L55 44.5"/><path d="M61 41 L59 45"/></g>`;
    grossH.innerHTML = `<div class="hg-dreh"><div class="hg-seite">${huhnSVG({ gr: 150, kopf: true, stimmung: "spricht" }).replace('<g class="huhn-augen">', rot + '<g class="huhn-augen">')}</div><div class="hg-vorn">${huhnFrontSVG(150)}</div></div>`;
    grossH.style.left = Math.min(innerWidth - 166, r.right + 8) + "px"; grossH.style.top = Math.max(8, r.top - 150) + "px";
    const blase = t => { const b = document.createElement("span"); b.className = "hg-blase"; b.textContent = t; grossH.appendChild(b); };
    let art;
    const zuf = arr => arr[Math.floor(Math.random() * arr.length)];
    if (n === 2) art = zuf(["rot", "cool", "frech"]);
    else if (n === 3) art = zuf(["frage", "frech", "cool"]);
    else if (n >= 4) art = "weg";
    else art = zuf(["zwinkern", "kamm", "noten", "herz", "nicken", "cool", "frech", "emoji", "emoji", "emoji"]);
    if (art === "emoji") { const E = zuf(HG_EMOJI); art = E.art; blase(zuf(E.sprueche)); grossH._emoji = E; }
    if (art === "rot" && Math.random() < .5) blase(zuf(["Guck nicht so.", "Oh. Du schon wieder.", "Ich werd ja ganz verlegen."]));
    if (art === "frage") blase(zuf(["Ist was?", "Hab ich was im Gesicht?", "Ich hab Körner gezählt. Was gibt's?"]));
    if (art === "weg") blase(zuf(["Hmpf. Ich guck jetzt woandershin.", "Bin nicht da.", "Pause. Hühnerpause."]));
    if (art === "cool") blase(zuf(["Läuft bei mir.", "Sonnenbrille. Weil ich’s kann.", "Ich bin aus Peru. Ich bin cool geboren.", "Autogramme gibt’s später.", "Chillen ist auch eine Tätigkeit.", "Ich mach heute auf Sparflamme. Stylisch."]));
    if (art === "frech") blase(zuf(["Na, auch hier?", "Was guckst du? Ich bin handgemacht.", "Erst die Liste, dann das Hühnchen!", "Ich hab dich zuerst gesehen.", "Schon wieder du? Ich fühl mich geehrt.", "Finger weg, ich bin frisch glasiert!", "Ich bin klein, aber ich hab Meinungen.", "Huhn sein ist ein Vollzeitjob.", "Du hast da was. … Reingefallen!", "Ich bin nicht neugierig. Ich bin informiert."]));
    grossH.classList.add("hg-" + art);
    if (grossH._emoji) { const E = grossH._emoji; for (let i = 0; i < E.n; i++) { const z = document.createElement("span"); z.className = "hg-flug hg-emo hg-" + E.flug; z.textContent = E.zeichen[i % E.zeichen.length]; z.style.left = (70 + Math.random() * 70) + "px"; z.style.top = (E.flug === "fall" ? 0 : 50) + "px"; z.style.animationDelay = (1900 + i * 140) + "ms"; z.style.setProperty("--dx", ((Math.random() - .5) * 90) + "px"); grossH.appendChild(z); } }
    if (art === "noten" || art === "herz") for (let i = 0; i < 3; i++) { const z = document.createElement("span"); z.className = "hg-flug"; z.textContent = art === "noten" ? ["♪", "♫", "♪"][i] : "♥"; z.style.left = (95 + i * 14) + "px"; z.style.top = "40px"; z.style.animationDelay = (1950 + i * 160) + "ms"; z.style.setProperty("--dx", (8 + i * 10) + "px"); grossH.appendChild(z); }
    document.body.appendChild(grossH); langH = true; haptik("auswahl");
  };
  const weg = () => { clearTimeout(zeitH); if (grossH) { const g = grossH; g.classList.add("zu"); setTimeout(() => g.remove(), 220); grossH = null; } };
  document.addEventListener("pointerdown", ev => { const el = ev.target.closest(".huhn-karte"); if (!el) return; langH = false; zeitH = setTimeout(() => zeigen(el), 340); });
  document.addEventListener("pointerup", weg); document.addEventListener("pointercancel", weg);
  document.addEventListener("pointerover", ev => { if (ev.pointerType === "mouse" && ev.target.closest(".huhn-karte .huhn")) { clearTimeout(zeitH); zeitH = setTimeout(() => zeigen(ev.target.closest(".huhn-karte")), 300); } });
  document.addEventListener("pointerout", ev => { if (ev.pointerType === "mouse" && ev.target.closest(".huhn-karte") && !(ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest(".huhn-karte"))) weg(); });
  document.addEventListener("contextmenu", ev => { if (ev.target.closest(".huhn-karte")) ev.preventDefault(); });
  document.addEventListener("click", ev => {
    const k = ev.target.closest(".huhn-karte"); if (!k) return;
    if (langH) { ev.stopImmediatePropagation(); langH = false; return; }
    const n = Date.now(); taps = taps.filter(t => n - t < 2500).concat(n);
    if (taps.length >= 3 && !REDUCED()) { const h = k.querySelector(".huhn").getBoundingClientRect(); const f = document.createElement("div"); f.className = "feder-flug"; f.setAttribute("aria-hidden", "true");
      f.innerHTML = `<svg viewBox="0 0 20 44" width="20" height="44"><path d="M10 43 L10 6" stroke="#8A5A2B" stroke-width="1.4"/><path d="M10 4 Q19 12 16 28 Q13 36 10 40 Q7 36 4 28 Q1 12 10 4Z" fill="#E4B24F"/><path d="M10 10 L15 16 M10 16 L15 22 M10 22 L14 28 M10 12 L5 18 M10 18 L5 24 M10 24 L6 30" stroke="#C9913C" stroke-width="1"/></svg>`;
      f.style.left = (h.left + h.width * .4) + "px"; f.style.top = (h.top + h.height * .4) + "px"; f.style.setProperty("--dx", (Math.random() * 120 - 60) + "px"); document.body.appendChild(f); setTimeout(() => f.remove(), 3200); }
  }, true);
}

/* ---------- Fürs Tagebuch: eine Frage aus dem, was heute in der App steht ---------- */
const TB_FRAGEN = {
  person: ["Was hat {P} erzählt, das du behalten willst?", "Worüber habt ihr gelacht, {P} und du?", "Was fragst du {P} beim nächsten Mal?"],
  gehen: ["Was hast du unterwegs gesehen, das nächste Woche schon anders aussieht?", "Wer oder was ist dir unterwegs begegnet?", "Wie hat der Forst heute gerochen?"],
  lesen: ["Welcher Satz oder welche Figur ist hängen geblieben?", "Was würdest du der Figur gern mal sagen?", "Wie geht's weiter, was meinst du?"],
  musik: ["Welches Lied lief, und woran hat es dich erinnert?"],
  hak: ["„{N}“ ist erledigt. War's leichter oder schwerer als gedacht?", "„{N}“ abgehakt. Wer sollte das erfahren?"],
  moment: ["Dein schönster Moment heute: „{M}“. Wie kam's dazu?"],
  allg: ["Was war heute das Beste, auch wenn's klein war?", "Worüber hast du heute den Kopf geschüttelt?", "Was soll morgen anders laufen als heute?", "Wen hättest du heute gern dabeigehabt, und wobei?", "Welches Wort passt zu heute?"]
};
function tbTag(h) { if (eintraegeAm(h).some(e => e.t !== "tagebuch") || S.momente[h]) return h; const g = tagPlus(h, -1); return eintraegeAm(g).length || S.momente[g] ? g : h; }
function tbFragen(tag) {
  const out = [], es = eintraegeAm(tag).filter(e => e.t !== "tagebuch" && e.notiz !== "App eingerichtet");
  if (S.momente[tag]) out.push(...TB_FRAGEN.moment.map(f => f.replace("{M}", S.momente[tag])));
  for (const e of es) {
    const p = e.person && S.menschen.find(m => m.id === e.person);
    if (p) out.push(...TB_FRAGEN.person.map(f => f.replace("{P}", p.name)));
    else if (e.t === "abgehakt" && e.notiz) out.push(...TB_FRAGEN.hak.map(f => f.replace("{N}", e.notiz)));
    else if (["gehen", "ausflug", "draussen"].includes(e.t) || e.draussen) out.push(...TB_FRAGEN.gehen);
    else if (["lesen", "hoerbuch", "buchfertig"].includes(e.t)) out.push(...TB_FRAGEN.lesen);
    else if (tat(e.t).bild === "tanz") out.push(...TB_FRAGEN.musik);
  }
  return [...new Set(out.concat(TB_FRAGEN.allg))];
}
function tbFrueherFragen() { return [...(D.tbFrueher || []), ...((D.lebensbuch || []).map(x => x.frage).filter(f => /Kind|früher|jung|Schul|Eltern|Mutter|Vater|damals/i.test(f)))]; }
function tbMerkHTML() {
  const M = S.tbMerk || [];
  return `<div class="tb-merk"><p class="klein" style="margin:12px 0 6px"><span style="font-weight:700">Merkzettel</span> – fällt dir tagsüber was ein? Kurz notieren, abends ins Tagebuch übertragen. Dann verschwindet’s hier wieder.</p>
    ${M.map(m => `<div class="tb-merk-zeile"><span>${esc(m.text)}</span><button class="knopf klein leise" data-act="tb-merk-weg" data-id="${m.id}" aria-label="Übertragen">${ic("haken")} übertragen</button></div>`).join("")}
    <div class="zeile" style="gap:6px;margin-top:6px"><input id="tb-merk-neu" class="text" maxlength="120" placeholder="Stichwort, z. B. „Omas Küchenradio“" style="flex:1;min-width:0"><button class="knopf klein zweit" data-act="tb-merk-neu" aria-label="Merken">${ic("plus")}</button></div></div>`;
}
function tagebuchKarte(h) {
  if (S.tbModus === "frueher") { const fr = tbFrueherFragen(), f = fr[(S.tbDreh || 0) % fr.length], schon = eintraegeAm(h).some(e => e.t === "tagebuch");
    return `<section class="abschnitt"><div class="bogen streifen k-geist tb-karte"><div class="zeile zwischen" style="align-items:center"><h3 style="margin:0">Für dein Tagebuch</h3><div class="chips">${chip(false, "Heute", `data-act="tb-modus" data-v="heute"`)}${chip(true, "Von früher", `data-act="tb-modus" data-v="frueher"`)}</div></div>
      <p class="serif tb-frage" style="margin-top:10px">${esc(f)}</p>
      <div class="zeile" style="gap:8px;flex-wrap:wrap;margin-top:10px">${schon ? "" : `<button class="knopf klein haupt" data-act="tb-geschrieben">${ic("feder")} Hab’s aufgeschrieben</button>`}<button class="knopf klein leise" data-act="tb-andere">Andere Frage</button></div>${tbMerkHTML()}</div></section>`; }
  const tag = tbTag(h), es = eintraegeAm(tag).filter(e => e.t !== "tagebuch" && e.notiz !== "App eingerichtet");
  const was = [...new Set(es.map(e => e.t === "abgehakt" ? e.notiz : (e.person && (S.menschen.find(m => m.id === e.person) || {}).name ? `${tat(e.t).kurz || tat(e.t).name} (${S.menschen.find(m => m.id === e.person).name})` : tat(e.t).kurz || tat(e.t).name)))].filter(Boolean);
  const fr = tbFragen(tag), i = (S.tbDreh || 0) % fr.length, schon = eintraegeAm(h).some(e => e.t === "tagebuch");
  const wann = tag === h ? "Heute" : "Gestern";
  return `<section class="abschnitt"><div class="bogen streifen k-geist tb-karte"><div class="zeile zwischen" style="align-items:center"><h3 style="margin:0">Für dein Tagebuch</h3><div class="chips">${chip(true, "Heute", `data-act="tb-modus" data-v="heute"`)}${chip(false, "Von früher", `data-act="tb-modus" data-v="frueher"`)}</div></div><div style="height:8px"></div>
    ${was.length ? `<p class="klein" style="margin:0 0 8px"><span style="font-weight:700">${wann} in der App:</span> ${esc(was.join(", "))}</p>` : `<p class="klein" style="margin:0 0 8px">Noch nichts eingetragen – eine Frage gibt's trotzdem.</p>`}
    <p class="serif tb-frage">${esc(fr[i])}</p>
    ${schon ? `<p class="klein" style="margin:10px 0 0">✓ Heute schon ins Tagebuch geschrieben. Hühnchen liest nicht mit, Ehrenwort.</p><div class="zeile" style="margin-top:8px"><button class="knopf klein leise" data-act="tb-andere">Andere Frage</button></div>`
      : `<div class="zeile" style="gap:8px;flex-wrap:wrap;margin-top:10px"><button class="knopf klein haupt" data-act="tb-geschrieben">${ic("feder")} Hab's aufgeschrieben</button><button class="knopf klein leise" data-act="tb-andere">Andere Frage</button></div>`}
    ${tbMerkHTML()}
  </div></section>`;
}
function tbAktion(a, d) {
  if (a === "tb-modus") { S.tbModus = d.v; speichern(); render({ halteScroll: true, ohneAnim: true }); return; }
  if (a === "tb-merk-neu") { const i = $("#tb-merk-neu"), t = (i?.value || "").trim(); if (!t) { i?.focus(); return; } S.tbMerk = [...(S.tbMerk || []), { id: "m" + Date.now().toString(36), text: t, tag: heute() }]; speichern(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); return; }
  if (a === "tb-merk-weg") { S.tbMerk = (S.tbMerk || []).filter(m => m.id !== d.id); speichern(); haptik("erfolg"); render({ halteScroll: true, ohneAnim: true }); return; }
  if (a === "tb-andere") { S.tbDreh = (S.tbDreh || 0) + 1; speichern(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); return; }
  if (a === "tb-geschrieben") {
    const fr = S.tbModus === "frueher" ? tbFrueherFragen() : tbFragen(tbTag(heute())), f = fr[(S.tbDreh || 0) % fr.length];
    const r = eintragSpeichern({ t: "tagebuch", tag: heute(), min: 15, notiz: f });
    if (r) { S.huhnSagt = { tag: heute(), text: ["Steht drin! Ich hab nicht reingeguckt. Fast nicht.", "Tagebuch geschrieben. Das Papier freut sich.", "Aufgeschrieben ist aufgehoben."][Math.floor(Math.random() * 3)] }; speichern(); nachEintrag(r); }
    render({ halteScroll: true, ohneAnim: true });
  }
}
