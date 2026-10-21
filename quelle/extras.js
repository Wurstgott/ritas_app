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
    toast(["Bingo! Ich hab vor Freude mit dem Sockel gewackelt. Fast umgekippt.", "Reihe voll. Der Hase hat applaudiert. Mit den Ohren.", "Bingo! Das Schwein sagt, es hätte das auch gekonnt. Glaub ich nicht."][linien % 3] + ` · +${5 * neu} Taler`, { erfolg: true }); }
  if (!B.voll && B.an.every(Boolean)) { B.voll = true; S.taler += 20; S.fundstuecke = [{ id: "bingo", tag: heute(), wer: "huhn", text: "Eine ganze Bingo-Karte voll. Ich lass sie rahmen. Also: im Kopf." }, ...(S.fundstuecke || [])]; toast("Karte voll! +20 Taler. Das kommt in die Fundstücke.", { erfolg: true }); }
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
    document.body.appendChild(gross); lange = true; haptik("auswahl");
  };
  const weg = () => { clearTimeout(zeitV); if (gross) { const g = gross; g.classList.add("zu"); setTimeout(() => g.remove(), 220); gross = null; } };
  document.addEventListener("pointerdown", ev => { const el = ev.target.closest("#logo"); if (!el) return; lange = false; zeitV = setTimeout(() => zeigen(el), 320); });
  document.addEventListener("pointerup", () => { weg(); });
  document.addEventListener("pointercancel", weg);
  document.addEventListener("pointerover", ev => { if (ev.pointerType === "mouse" && ev.target.closest("#logo")) { clearTimeout(zeitV); zeitV = setTimeout(() => zeigen(ev.target.closest("#logo")), 250); } });
  document.addEventListener("pointerout", ev => { if (ev.pointerType === "mouse" && ev.target.closest("#logo") && !(ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest("#logo"))) weg(); });
  document.addEventListener("contextmenu", ev => { if (ev.target.closest("#logo")) ev.preventDefault(); });
  // langes Halten soll nicht zusätzlich die Tipp-Überraschung auslösen
  document.addEventListener("click", ev => { if (lange && ev.target.closest("#logo")) { ev.stopImmediatePropagation(); lange = false; } }, true);
}
