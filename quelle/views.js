/* ============================================================
   Lichtung – Ansichten (Tabs) und Blätter (Sheets)
   ============================================================ */
let TAB = "heute";
const TABS = [
  { id: "heute", name: "Heute", icon: "heute" },
  { id: "ideen", name: "Ideen", icon: "ideen" },
  { id: "lichtung", name: "Zuhause", icon: "lichtung" },
  { id: "tagebuch", name: "Rückblick", icon: "tagebuch" }
];

/* ---------- kleine Bausteine ---------- */
const kachel = (t, unter, act, extra = "") => `<button class="kachel ${D.felder[t.feld]?.k || ""} ${extra}" ${act}>${ic(t.icon)}<span><span class="titel">${esc(t.kurz || t.name)}</span>${unter ? `<br><span class="unter">${esc(unter)}</span>` : ""}</span></button>`;
const zeileBtn = (icon, titel, unter, act, k = "") => `<button class="liste-zeile ${k}" ${act}>${ic(icon)}<span class="text"><span class="titel">${esc(titel)}</span>${unter ? `<br><span class="unter">${esc(unter)}</span>` : ""}</span>${ic("pfeil", "pfeil")}</button>`;
const schalter = (an, text, act, unter = "") => `<div class="schalter-zeile" role="switch" aria-checked="${an}" tabindex="0" ${act}><span><span style="font-weight:600">${esc(text)}</span>${unter ? `<br><span class="schalter-text">${esc(unter)}</span>` : ""}</span><span class="zeile" style="gap:8px"><span class="schalter-text">${an ? "An" : "Aus"}</span><span class="schalter ${an ? "an" : ""}" aria-hidden="true"></span></span></div>`;
const chip = (an, text, act, k = "") => `<button class="chip ${k}" aria-pressed="${an}" ${act}>${an ? ic("haken") : ""}${esc(text)}</button>`;
function talerText(n) { return `${n} ${n === 1 ? "Taler" : "Taler"}`; }
function minText(m) { m = Math.round(m); if (m < 60) return `${m} Min.`; const h = Math.floor(m / 60), r = m % 60; return r ? `${h} Std. ${r} Min.` : `${h} ${h === 1 ? "Stunde" : "Stunden"}`; }
function eintragText(e) {
  const t = tat(e.t);
  if (e.t === "ausflug") return `Ausflug: ${e.titel}${e.umgekehrt ? " (bewusst umgekehrt)" : ""}`;
  if (e.t === "planung") return `Ausflug geplant: ${e.titel}`;
  if (e.t === "abgehakt") return `Erledigt: ${e.notiz || "ein Punkt von der Liste"}`;
  let s = t.name;
  if (t.art === "km") s = `${fmt(e.km)} km gegangen`;
  else if (e.t === "buchfertig") s = `Buch ausgelesen: ${e.titel || ""}`;
  else if (e.min && t.art !== "klein" && t.art !== "fest") s += ` · ${minText(e.min)}`;
  if (e.person) { const p = S.menschen.find(m => m.id === e.person), nm = p ? p.name : e.personName; if (nm) s += ` · ${nm}`; }
  return s;
}
/* Personen-Chip beim Eintragen: mit Gesicht, wenn es eins gibt */
function personChip(m) {
  const an = E.person === m.id, bild = personBild(m, 38);
  return bild ? `<button class="chip k-menschen chip-person" aria-pressed="${an}" data-act="setz" data-f="person" data-v="${esc(m.id)}"><span class="chip-gesicht">${bild}</span>${esc(m.name)}${an ? ic("haken") : ""}</button>` : chip(an, m.name, `data-act="setz" data-f="person" data-v="${m.id}"`, "k-menschen");
}
function eintragPersonBild(e) { const p = e.person && S.menschen.find(m => m.id === e.person); const b = p ? personBild(p, 34, true) : ""; return b ? `<span class="ez-person">${b}</span>` : ""; }
function feldK(e) { if (e.t === "ausflug" || e.t === "planung") return "k-draussen"; const t = tat(e.t); return t.bild === "tanz" ? "k-tanz" : (D.felder[t.feld]?.k || ""); }
function iconVon(e) { return e.t === "ausflug" || e.t === "planung" ? "rucksack" : tat(e.t).icon; }

/* ============================================================
   HEUTE
   ============================================================ */
function grussHimmel() {
  const st = jetzt().getHours(), nacht = st >= 18 || st < 6, W = S.wetter && S.wetter.code != null && Date.now() - S.wetter.zeit < 3 * 3600e3 ? S.wetter : null;
  const art = W ? wetterArt(W.code) : "klar";
  let svg;
  if (nacht) svg = `<path d="M38 8 A22 22 0 1 0 52 40 A17 17 0 1 1 38 8Z" fill="#F2D27A"/><circle cx="30" cy="24" r="2.4" fill="#E2BF5E" opacity=".6"/><circle cx="24" cy="36" r="1.6" fill="#E2BF5E" opacity=".5"/>${art === "klar" ? `<g class="sterne" fill="#F2D27A"><path class="st1" d="M52 12 l1 2.6 2.6 1 -2.6 1 -1 2.6 -1 -2.6 -2.6 -1 2.6 -1Z"/><path class="st2" d="M10 8 l.8 2 2 .8 -2 .8 -.8 2 -.8 -2 -2 -.8 2 -.8Z"/><path class="st3" d="M56 30 l.6 1.5 1.5 .6 -1.5 .6 -.6 1.5 -.6 -1.5 -1.5 -.6 1.5 -.6Z"/></g>` : ""}`;
  else svg = `<g class="strahlen" stroke="#E8A93A" stroke-width="3" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map(w => `<path d="M30 6 L30 12" transform="rotate(${w} 30 30)"/>`).join("")}</g><circle cx="30" cy="30" r="12" fill="#F2C14E"/>`;
  if (art !== "klar") svg += `<g class="wolke"><path d="M18 50 Q10 50 10 43 Q10 36 18 36 Q20 28 29 28 Q38 28 40 36 Q49 35 50 43 Q50 50 42 50Z" fill="${nacht ? "#9AA6B8" : "#E4E8EE"}" stroke="${nacht ? "#7C889A" : "#C5CCD6"}" stroke-width="1.2"/></g>`;
  if (art === "regen") svg += `<g class="tropfen" stroke="#5E8EC8" stroke-width="2" stroke-linecap="round"><path d="M20 54 l-2 5"/><path d="M30 54 l-2 5"/><path d="M40 54 l-2 5"/></g>`;
  if (art === "schnee") svg += `<g class="flocken" fill="#9FC2E6"><circle cx="20" cy="56" r="1.8"/><circle cx="30" cy="58" r="1.8"/><circle cx="40" cy="56" r="1.8"/></g>`;
  // ohne Wetterdaten ein neutrales Thermometer statt Sonne/Mond
  if (!W) return `<button class="gruss-himmel wetter-chip ohne" data-act="wetter" aria-label="Wetter ansehen"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4Zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5Z"/></svg><span class="gruss-temp">Wetter</span></button>`;
  return `<button class="gruss-himmel wetter-chip ${nacht ? "mond" : "sonne"}" data-act="wetter" aria-label="Wetter ansehen"><svg viewBox="0 0 60 64" aria-hidden="true">${svg}</svg><span class="gruss-temp">${W ? `${Math.round(W.temp)}°` : "Wetter"}</span></button>`;
}
/* Altes Wählscheiben-Telefon (Anspielung auf die Telefonhäuschen, die in „Link’s Awakening“ einfach überall auf der Insel stehen) */
function altesTelefonSVG(gr = 56) {
  const loecher = Array.from({ length: 10 }, (_, i) => { const w = (-60 + i * 27) * Math.PI / 180; return `<circle cx="${(32 + 7.4 * Math.cos(w)).toFixed(1)}" cy="${(37 + 7.4 * Math.sin(w)).toFixed(1)}" r="1.7"/>`; }).join("");
  return `<svg class="alt-tel" viewBox="0 0 64 56" width="${gr}" height="${gr * 56 / 64}" aria-hidden="true">
    <path d="M58 40c4 2 4 7 0 9" fill="none" stroke="#3B1F1C" stroke-width="1.6" stroke-dasharray="2.2 1.6" stroke-linecap="round"/>
    <path d="M14 27h36l7 20a3 3 0 0 1-3 4H10a3 3 0 0 1-3-4Z" fill="#8E2F2A"/>
    <path d="M14 27h36l1.6 4.6H12.4Z" fill="#A9433A"/>
    <circle cx="32" cy="37" r="11" fill="#F3E3C0"/>
    <g fill="#8E2F2A">${loecher}</g>
    <circle cx="32" cy="37" r="3.2" fill="#C9A35E"/>
    <path d="M38.6 30.4l4.2-1.8" stroke="#3B1F1C" stroke-width="1.4" stroke-linecap="round"/>
    <g class="hoerer"><rect x="17" y="21" width="30" height="5" rx="2.5" fill="#6F2420"/>
      <path d="M7 19c0-5 4-8 9-8h32c5 0 9 3 9 8v3c0 2-1.4 3-3 3h-6c-1.8 0-3-1.2-3-3v-2H19v2c0 1.8-1.2 3-3 3h-6c-1.6 0-3-1-3-3Z" fill="#8E2F2A"/>
      <path d="M12 13.4c2-1.4 4-1.9 6-1.9h28" stroke="#B9564B" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>
    <g class="klingel" stroke="#C98A1B" stroke-width="2" stroke-linecap="round" fill="none"><path d="M3 9l3 2.4"/><path d="M1.5 16h3.4"/><path d="M61 9l-3 2.4"/><path d="M62.5 16h-3.4"/></g>
  </svg>`;
}
let TEL_GEKLINGELT = false;
function telKarteHTML() {
  const alle = D.anrufe || [], wer = TEL_REIHE.filter(w => alle.some(a => a.wer === w));
  const bl = wer.slice(0, 3).map((w, i) => `<span class="tel-blase b${i}">${w === "huhn" ? huhnFrontSVG(30) : telBild(w, 30)}</span>`).join("");
  let klingelt = ""; if (!TEL_GEKLINGELT && Math.random() < .3) { TEL_GEKLINGELT = true; klingelt = " klingelt"; } // ab und zu (höchstens einmal je Öffnen) klingelt es einfach – wie in den Telefonhäuschen von Koholint
  return `<section class="abschnitt"><button class="tel-leiste${klingelt}" data-act="tel-auf" aria-label="Kurz plaudern – zum Spaß"><span class="tel-bild" aria-hidden="true">${altesTelefonSVG(46)}${bl}</span><span class="text"><span class="titel">Kurz plaudern <span class="tel-zusatz">zum Spaß, mit Hühnchen und Co.</span></span></span>${ic("pfeil", "pfeil")}</button></section>`;
}
function viewHeute() {
  const h = heute(), tf = S.tf[h];
  const liste = eintraegeAm(h);
  const name = S.anrede === "sie" ? (S.nachname ? `Frau ${S.nachname}` : S.name) : S.name;
  // Wetter dezent als kleine Plakette in der Datumszeile – rechts oben bleibt nur das Zahnrad
  let html = `<div class="gruss gruss-heute"><h1>${tageszeitGruss()}, ${esc(name)}.</h1><div class="datum gruss-zeile"><span>${datumLang(h)}</span>${grussHimmel()}</div></div>`;
  if (typeof mbHeuteOben === "function") html += mbHeuteOben(); // Geburtstagstorte (maxbriefe.js)

  // laufender Timer / Ausflug unterwegs
  if (S.timer) html += timerKarte();
  const unterwegs = S.plaene.find(p => p.status === "unterwegs");
  if (unterwegs) html += `<section class="abschnitt"><div class="bogen streifen k-draussen"><h3>Unterwegs: ${esc(unterwegs.titel)}</h3><p class="klein">Seit ${new Date(unterwegs.los).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr. Schön, dass du los bist.</p><button class="knopf haupt voll" data-act="ausflug-zurueck" data-id="${unterwegs.id}">${ic("haus")} Ich bin zurück</button></div></section>`;

  // Geplante Ausflüge sichtbar halten
  const geplantH = S.plaene.filter(p => p.status === "geplant");
  if (geplantH.length && !unterwegs) html += `<section class="abschnitt"><div class="liste">${geplantH.map(p => zeileBtn("rucksack", `Geplant: ${p.titel}`, "Liste für unterwegs ansehen, dann los", `data-act="plan" data-id="${p.id}"`, "k-draussen")).join("")}</div></section>`;
  // Tagesform
  html += `<section class="abschnitt" aria-labelledby="tf-h">`;
  if (!tf) {
    // K-F-18: abends nicht nach der Morgen-Energie fragen
    const std = jetzt().getHours();
    const frage = std >= 21 || std < 4 ? A("Wie geht’s dir gerade?", "Wie geht es Ihnen gerade?") : std >= 17 ? A("Wie geht’s dir heute Abend?", "Wie geht es Ihnen heute Abend?") : A("Wie ist deine Energie heute?", "Wie ist Ihre Energie heute?");
    html += S.huhn ? `<div class="huhn-karte" style="margin-bottom:12px">${huhnSVG({ gr: 76, stimmung: "spricht" })}<div class="sprechblase"><span class="wer">Hühnchen</span><span id="tf-h">${tfFrageSatz()} ${frage}</span></div></div>` : `<h2 id="tf-h">${frage}</h2>`;
    html += `<div class="tagesform">${D.tagesformen.map(f => `<button class="tf" aria-pressed="false" data-act="tf" data-v="${f.id}">${ic(f.icon)}<span>${f.name}<br><span class="tf-text">${esc(f.text)}</span></span></button>`).join("")}</div><p class="klein" style="margin-top:8px">Danach richten sich die Ideen.</p>`;
  } else {
    const f = D.tagesformen.find(x => x.id === tf);
    html += `<div class="bogen mulde zeile zwischen" style="padding:10px 12px 10px 16px"><span class="tf-kurz">${ic(f.icon)}<span><span style="font-weight:700">${f.name}</span><br><span class="klein">${esc(TF_WIRKUNG[tf] || f.text)}</span></span></span><button class="knopf klein leise" data-act="tf-aendern">Ändern</button></div>`;
  }
  html += `</section>`;

  // Hühnchen sagt etwas (ein Satz am Tag), ab und zu Post von Max
  if (S.huhn && tf) html += `<section class="abschnitt"><div class="huhn-karte" data-act="huhn-tap">${huhnSVG({ gr: 84, stimmung: "spricht" })}<div class="sprechblase"><span class="wer">Hühnchen</span>${esc(huehnchenSatz())}</div></div></section>`;
  const ruhig = tf === "C" || tf === "D";
  const post = postHeute();
  if (post) { const von = EI_WER[post.wer] || "Max", gruss = post.wer === "christiane" ? "Deine Christiane" : post.wer === "huhn" ? "Dein Hühnchen" : "Dein Max";
    html += post.offen
    ? `<section class="abschnitt"><div class="brief-papier"><span class="brief-marke" aria-hidden="true">${post.wer === "max" ? maxSVG(52) : post.wer === "christiane" ? janeSVG(52) : post.wer === "micha" ? michaSVG(52) : huhnSVG({ gr: 52, kopf: true })}</span><p class="brief-anrede">Liebe ${esc(S.name)},</p><p class="brief-text">${esc(post.text)}</p><p class="brief-gruss">${gruss} <span aria-hidden="true">♥</span></p>${post.extra ? `<button class="knopf klein leise" style="padding-left:0" data-act="post-gelesen">Zumachen</button>` : tschuessHTML()}</div></section>`
    : `<section class="abschnitt"><button class="umschlag" data-act="post-auf" aria-label="Post von ${von} – zum Öffnen antippen">${umschlagSVG(von)}<span class="umschlag-hinweis">Post von ${von} · zum Öffnen antippen</span></button></section>`; }
  if (typeof mbHeutePost === "function") html += mbHeutePost(); // Brief von Max (maxbriefe.js)
  if (ruhig) html += `<section class="abschnitt"><button class="kachel breit k-ruhe" data-act="hilft">${ic("windrad")}<span><span class="titel">Ablenkung?</span><br><span class="unter">Wenn der Rücken zwickt oder das Handyspiel lockt.</span></span></button></section>`;
  // Was Rita jeden Tag tut, steht oben: To-do-Liste und Eintragen – dann das Bild und der Rest
  html += listeHTML();
  html += `<section class="abschnitt"><h2>Eintragen</h2><div class="kacheln">${schnellHeute(tf).map(id => { const t = tat(id); return kachel(t, zuletztText(id), `data-act="eintragen" data-t="${id}"`); }).join("")}</div>
    <button class="knopf haupt voll" style="margin-top:12px" data-act="alles">${ic("plus")} Etwas anderes eintragen</button></section>`;
  const st = D.stufen[stufe()];
  html += `<section class="abschnitt"><div class="buehne flach" id="buehne-heute"><canvas id="bild-heute" role="img" aria-label="${esc(bildBeschreibung(modell()).join(" "))}"></canvas><button class="ueber" data-tab="lichtung" aria-label="Das Bild groß ansehen"></button></div>
    <p class="klein" style="margin-top:8px">${esc(st.name)}${!S.eintraege.some(x => (x.w || 0) > 0) ? " · bald wächst hier was" : modell().letzte && D.orte[modell().letzte] ? ` · zuletzt gewachsen: ${esc(D.orte[modell().letzte].name.replace(/^(Der|Die|Das) /, m => m.toLowerCase()))}` : ""}</p></section>`;
  html += zettelHTML();
  html += raetselHTML();
  html += tvHeuteHTML();
  html += abendkarteHTML(tf);
  // abends nur eine kompakte Zeile – die volle Tagebuch-Karte (mit Merkzettel) steht im Rückblick
  if (tbZeileHeute()) html += `<section class="abschnitt"><div class="liste">${zeileBtn("feder", "Für dein Tagebuch", "Eine Frage für heute Abend", 'data-tab="tagebuch"', "k-geist")}</div></section>`;
  if (tf === "A") html += draussenVorschlagHTML();
  if (!ruhig) html += `<section class="abschnitt"><button class="kachel breit k-ruhe" data-act="hilft">${ic("windrad")}<span><span class="titel">Ablenkung?</span><br><span class="unter">Wenn der Rücken zwickt oder das Handyspiel lockt.</span></span></button></section>`;
  // Heute eingetragen
  const ohneHaken = liste.filter(e => e.t !== "abgehakt");
  if (ohneHaken.length) {
    html += `<section class="abschnitt"><h2>Heute eingetragen</h2><div class="liste">${ohneHaken.slice().reverse().map(e => eintragZeile(e, true, true)).join("")}</div></section>`;
  }

  // Hinweis des Tages (höchstens einer)
  const tagNr = Math.round((tagDatum(h) - tagDatum(S.start)) / 864e5);
  const postDa = !!postHeute();
  const hw = tf && tagNr >= 3 && !postDa && !(S.zettel && S.zettel.tag === h && !S.zettel.weg) ? hinweisDesTages() : null;
  if (hw) html += `<section class="abschnitt"><div class="hinweis" role="note"><p style="margin:0">${hw.html}</p><div class="zeile zwischen">${hw.knopf || ""}<button class="knopf klein leise" data-act="hinweis-weg" data-id="${hw.id}" data-fuer-immer="${hw.immer ? 1 : 0}">${hw.immer ? "Passt so" : "Danke"}</button></div></div></section>`;

  // App aufs Handy legen
  if (!istInstalliert() && S.onboard && h !== S.start && S.installKarte !== "nie" && (!S.installKarte || S.installKarte <= h) && S.eintraege.length >= 1)
    html += `<section class="abschnitt"><div class="bogen streifen"><h3>Die App aufs Handy legen</h3><p class="klein">Dann findest du sie wie jede andere App auf dem Startbildschirm.</p><div class="zeile"><button class="knopf klein zweit" data-act="install">Anleitung zeigen</button><button class="knopf klein leise" data-act="install-spaeter">Später</button></div></div></section>`;
  html += telKarteHTML();
  html += `<p style="text-align:center;margin:18px 0 6px"><button class="link-knopf" data-act="wunsch-auf">Wunsch oder Idee für die App? Schreib Max!</button></p>`;
  html += `<p class="ersteller-fuss">Mit Liebe ausgedacht von Carlo Maximilian Engeländer für seine Patentante Rita</p>`;
  return html;
}
function tbZeileHeute() { return jetzt().getHours() >= 18 && !eintraegeAm(heute()).some(e => e.t === "tagebuch") && S.tf[heute()] !== "D"; }
function zuletztText(id) {
  const t = tat(id), l = [...S.eintraege].reverse().find(e => e.t === id);
  if (!l) return t.art === "km" ? "z. B. 2 km" : t.art === "person" ? "mit wem?" : t.std ? `z. B. ${minText(t.std)}` : "";
  if (t.art === "km") return `zuletzt ${fmt(l.km)} km`;
  if (t.art === "person") return "mit wem?";
  if (l.min) return `zuletzt ${minText(l.min)}`;
  return "";
}
function eintragZeile(e, mitAktionen, stern) {
  const inhalt = `${ic(iconVon(e))}<span class="text"><span class="titel" style="display:block">${esc(eintragText(e))}${stern && e.stern ? ` <span class="stern" title="an einem ruhigen Tag">✱</span>` : ""}</span>${e.notiz && e.t !== "abgehakt" ? `<span class="unter" style="display:block">${esc(e.notiz)}</span>` : ""}${e.zuViel ? `<span class="unter" style="display:block">War zu viel. Ist notiert.</span>` : ""}</span>${eintragPersonBild(e)}`;
  return mitAktionen ? `<button class="liste-zeile eintrag-zeile ${feldK(e)}" data-act="eintrag" data-id="${e.id}" aria-label="${esc(eintragText(e))} – ändern oder löschen">${inhalt}${ic("pfeil", "pfeil")}</button>` : `<div class="eintrag ${feldK(e)}">${inhalt}</div>`;
}
function eintragSheet(id) {
  const e = S.eintraege.find(x => x.id === id); if (!e) return;
  const aenderbar = e.t !== "ausflug" && e.t !== "planung";
  sheet({ titel: "Eintrag", inhalt: `<p style="font-weight:700">${esc(eintragText(e))}</p><p class="klein">${datumLang(e.tag)}${e.notiz ? ` · ${esc(e.notiz)}` : ""}</p>`,
    fuss: `<div class="stapel">${aenderbar ? `<button class="knopf haupt voll" data-act="aendern" data-id="${e.id}">Ändern</button>` : ""}<button class="knopf zweit voll" data-act="loeschen" data-id="${e.id}">Löschen</button></div>` });
}
function timerKarte() {
  const T = S.timer, rest = timerRest();
  return `<section class="abschnitt"><div class="bogen streifen k-geist"><h3>Timer: ${esc(T.name)}</h3><p class="klein">${T.pause ? "Pausiert." : rest > 0 ? `Läuft bis ${new Date(Date.now() + rest * 1000).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr.` : "Die Zeit ist um."}</p><button class="knopf zweit voll" data-act="timer-zeigen">${ic("uhr")} Timer öffnen</button></div></section>`;
}

/* ---------- Hinweis des Tages ---------- */
function hinweisDesTages() {
  const h = heute(), d = tagDatum(h), weg = S.hinweis.weg || {};
  if (S.hinweis.tag === h && S.hinweis.zu) return null;
  const n = S.eintraege.length;
  const kandidaten = [];
  // Sonntag: Wochenrückblick
  const kw = kwVon(h);
  if (d.getDay() === 0 && jetzt().getHours() >= 14 && !S.rueckblick[kw] && n >= 3)
    kandidaten.push({ id: "rueckblick", html: "Sonntag. Lust auf einen kurzen Blick auf die Woche?", knopf: `<button class="knopf klein zweit" data-act="rueckblick">Wochenrückblick</button>` });
  // Pacing an weiten Tagen
  const bew = eintraegeAm(h).filter(e => tat(e.t).feld === "bewegung").reduce((s, e) => s + minutenVon(e), 0);
  if (bew >= 100 || eintraegeAm(h).some(e => e.t === "ausflug" && e.leiter >= 5)) kandidaten.push({ id: "pacing", html: "Ganz schön viel geschafft heute. Jetzt hat sich das Sofa einen Besuch verdient." });
  // Tageshinweis mit Hühnchen oder aus dem Vorrat
  const mon = d.getMonth() + 1; const pool = (D.tageshinweise || []).filter((x, i) => !weg["th" + i] && (!x.monate || x.monate.includes(mon)));
  if (pool.length) { const i = hash32("th" + h) % pool.length; const idx = (D.tageshinweise || []).indexOf(pool[i]); kandidaten.push({ id: "th" + idx, html: esc(pool[i].text || pool[i]) }); }
  return kandidaten[0] || null;
}

/* ============================================================
   IDEEN
   ============================================================ */
/* Ideen als Schaufenster (Gestaltung C2): „Heute entdecken“ (neuer Karin-Brief hat Vorrang),
   Drinnen/Draußen als Emaille-Türen, „Was es hier alles gibt“ mit Markisen-Fächern, Stöberkiste statt Schlagwortliste */
function cFunde() {
  const A2 = (du, sie) => (typeof A === "function" ? A(du, sie) : du);
  const neuPost = typeof bvHeuteNeu === "function" && bvHeuteNeu();
  const f = [
    { id: "tel", act: `data-act="fenster" data-ziel="tel-auf"`, icon: "telefon", ton: "falu", titel: "Kurz plaudern", text: "Mit Hühnchen, Christiane, Max und Co. – nur zum Spaß" },
    { id: "post", act: `data-act="fenster" data-ziel="bv-auf"`, icon: "briefkasten", ton: "dala", titel: "Post aus Vimmerby", text: neuPost ? "Karin hat geschrieben – auf Schwedisch, mit Übersetzung" : "Briefe von Karin auf Schwedisch, mit Übersetzung", marke: neuPost ? "Neu" : "" },
    { id: "tv", act: `data-act="fenster" data-ziel="tv-auf"`, icon: "fernseher", ton: "senf", titel: "Film & Fernsehen", text: "Krimis und gute Filme aus der Mediathek" },
    { id: "buch", act: `data-act="fenster" data-ziel="lesebegleiter"`, icon: "buch", ton: "pflaume", titel: "Bücher & Hörbücher", text: "Dein Bücherregal, Tipps, das nächste Buch" },
    { id: "winter", act: `data-act="fenster" data-ziel="wi-auf"`, icon: "tasse", ton: "petrol", titel: "Gut durch den Winter", text: "Tees, Ingwer-Tricks, Heizen und Lüften" },
    { id: "angebote", act: `data-act="fenster" data-ziel="angebote"`, icon: "tassen", ton: "falu", titel: "Angebote in Spandau", text: "Konzerte, Treffs und Feste mit Terminen" },
    { id: "bingo", act: `data-act="fenster" data-ziel="bingo-auf"`, icon: "bingo", ton: "moos", titel: "Forst-Bingo", text: "Hühnchens Karte für diese Woche" },
    { id: "ausflug", act: `data-act="fenster" data-ziel="ausflug"`, icon: "rucksack", ton: "moos", titel: "Ausflug planen", text: "Von nah bis weit, mit Checkliste" },
    { id: "tagebuch", act: `data-act="fenster" data-ziel="tab:tagebuch"`, icon: "tagebuch", ton: "pflaume", titel: "Tagebuch", text: A2("Eine Frage für deinen Abend", "Eine Frage für Ihren Abend") },
    { id: "wissen", act: `data-act="fenster" data-ziel="wissen"`, icon: "funke", ton: "senf", titel: "Wissen", text: "Kurze Häppchen, mit Quelle" },
    { id: "vorhaben", act: `data-act="fenster" data-ziel="missionen"`, icon: "stern", ton: "dala", titel: "Kleine Vorhaben", text: "Ein paar Tage dranbleiben, mit Kästchen" }
  ];
  if (S.spiel && S.spiel.an) f.push({ id: "spiel", act: `data-act="fenster" data-ziel="spiel"`, icon: "karten", ton: "petrol", titel: "Waldpatience", text: "Eine ruhige Runde Karten" });
  f.push({ id: "laden", act: `data-act="fenster" data-ziel="laden"`, icon: "laden", ton: "falu", titel: "Kramladen", text: "Taler ausgeben: Bilder, Spiele, Kostüme" });
  return f;
}
function cTag() { return Math.round(tagDatum(heute()) / 864e5); }
function viewIdeen() {
  const tf = S.tf[heute()] || "B";
  const form = D.tagesformen.find(f => f.id === tf);
  const F = cFunde(), post = F.find(x => x.id === "post" && x.marke), top = post || F[cTag() % F.length];
  const topTon = top.ton === "senf" || top.ton === "moos" ? "dala" : top.ton; // Drinnen = Senf, Draußen = Moos
  let html = `<div class="gruss c-kopf"><span class="c-kicker">Schaufenster</span><h1>Ideen</h1><div class="datum">${S.tf[heute()] ? `${A("Passend zu deinem Tag", "Passend zu Ihrem Tag")}: ${esc(form.name)}` : A("Für einen gemächlichen Tag", "Für einen gemächlichen Tag")}</div></div>`;
  html += `<section class="abschnitt"><button class="c-entdecken c-ton-${topTon}" ${top.act}>${top.marke ? `<span class="ks-marke c-entdecken-marke">Neuer Brief</span>` : ""}
    <span class="c-kicker">Heute entdecken</span>
    <span class="c-teller" aria-hidden="true">${ic(top.icon)}</span>
    <span class="c-titel">${esc(top.titel)}</span><span class="c-text">${esc(top.text)}</span>
    <span class="c-los">Anschauen${ic("pfeil", "pfeil")}</span></button></section>`;
  html += `<section class="abschnitt"><div class="tueren-gross">
    <button class="tuer-gross drinnen" data-act="tuer" data-v="drinnen"><span class="tg-bild" aria-hidden="true">${ic("lampe")}</span><span class="titel">Drinnen</span><span class="unter">Lesen, Telefon, Filme, Tee, Patience</span></button>
    <button class="tuer-gross draussen" data-act="tuer" data-v="draussen"><span class="tg-bild" aria-hidden="true">${ic("rucksack")}</span><span class="titel">Draußen</span><span class="unter">Ausflüge, Bingo, Binger, Angebote</span></button>
  </div>${notfallLeiste("ruhe-plan")}</section>`;
  const vorschl = vorschlaege(tf, 3, "ideen" + heute() + (S._mischen || 0));
  html += `<section class="abschnitt"><h2>Jetzt vielleicht</h2><div class="liste kurz-liste">${vorschl.map(v => zeileBtn(katIcon(v.kat, v), v.titel, ideeKurz(v), `data-act="idee" data-id="${v.id}"`, "k-geist")).join("")}</div>
    <p class="c-mitte"><button class="knopf leise" data-act="mischen">Andere Ideen zeigen</button></p></section>`;
  html += `<section class="abschnitt"><h2>Was es hier alles gibt</h2><div class="c-fenster">${F.filter(x => x !== top).map(x => `<button class="c-fach c-ton-${x.ton}" ${x.act}><span class="c-fach-bild" aria-hidden="true">${ic(x.icon)}</span>${x.marke ? `<span class="ks-marke c-fach-marke">${esc(x.marke)}</span>` : ""}<span class="c-fach-titel">${esc(x.titel)}</span><span class="c-fach-text">${esc(x.text)}</span></button>`).join("")}</div></section>`;
  const th = ideenThemen(), summe = th.reduce((a, [, n]) => a + n, 0);
  html += `<section class="abschnitt c-stoeber"><h2>Stöberkiste</h2><p class="c-unter">${summe} kleine Ideen, nach Themen sortiert. Einfach reingreifen.</p><div class="c-setzkasten">${th.map(([k, n]) => `<button class="c-kasten" data-act="idee-thema" data-v="${esc(k)}">${ic(katIcon(k))}<span class="c-kasten-name">${esc(k)}</span><span class="c-kasten-zahl zahl">${n}</span></button>`).join("")}</div></section>`;
  return html;
}
function tuerSheet(was) {
  const tf = S.tf[heute()] || "B";
  let html = "";
  if (was === "draussen") {
    html += `<div class="liste">
    ${zeileBtn("blatt", "Forst-Bingo", "Hühnchens Karte für diese Woche", `data-act="bingo-auf"`, "k-draussen")}
    ${zeileBtn("rucksack", "Ausflug planen", "Von nah bis weit, Ziele, Checkliste", `data-act="ausflug"`, "k-draussen")}
    ${zeileBtn("haus", "In die Binger", "Zu Christiane und Micha", `data-act="ziel" data-id="binger"`, "k-menschen")}
    ${zeileBtn("tassen", "Angebote in Spandau", "Konzerte, Treffs, Feste – mit Terminen", `data-act="angebote"`, "k-menschen")}
    ${zeileBtn("schluessel", "Praktisches für unterwegs", "Taxi, Bus, Fahrdienste", `data-act="praktisch"`, "k-draussen")}</div>`;
    sheet({ titel: "Draußen", inhalt: html, id: "tuer" }); return;
  }
  // Reihenfolge wie auf der Tür: Lesen, Vergnügen (Telefon, Filme, Winter-Tees), Vorhaben, Patience – Timer am Ende
  const hp = D.hp && D.hp.baende ? D.hp.baende.find(b => b.nr === S.hp.band) : null;
  if (hp) html += `<h3 style="margin-top:4px">Lesen</h3><div class="bogen streifen k-geist"><h3>${esc(hp.titel)}</h3><p class="klein">${S.hp.kapitel ? `Kapitel ${S.hp.kapitel} von ${hp.kapitel}` : A("Wo bist du gerade? Stell dein Kapitel ein.", "Wo sind Sie gerade? Stellen Sie Ihr Kapitel ein.")}</p><div class="fortschritt" aria-hidden="true"><i style="width:${Math.round(S.hp.kapitel / hp.kapitel * 100)}%;background:var(--flieder)"></i></div>
    <div class="zeile" style="margin-top:12px;flex-wrap:wrap"><button class="knopf klein zweit" data-act="kapitel">${ic("plus")} Ein Kapitel gelesen</button></div>${typeof hpKnopf === "function" ? hpKnopf(true) : ""}</div>`;
  html += `${S.buecherEigen.filter(x => x.status === "liest").map(x => `<div class="buch-zeile">${buchCover(x.titel, x.autor, 48)}<div style="flex:1;min-width:0"><div style="font-weight:700">${esc(x.titel)}</div><div class="zeile" style="gap:6px;margin-top:6px;flex-wrap:wrap"><button class="knopf klein zweit" data-act="buch-stueck" data-id="${x.id}">${ic("plus")} Ein Stück gelesen</button></div></div></div>`).join("")}<button class="knopf zweit voll" style="margin-top:10px" data-act="lesebegleiter">${ic("buch")} Bücherregal, Tipps, neues Buch</button>`;
  html += `<h3 style="margin-top:20px">Zum Vergnügen</h3><div class="liste">${zeileBtn("plaudern", "Kurz plaudern", "Mit Hühnchen, Christiane, Max und Co. – nur zum Spaß", `data-act="tel-auf"`, "k-menschen")}${zeileBtn("fernseher", "Film & Fernsehen", "Krimis und gute Filme aus der Mediathek, Tipps der Woche", `data-act="tv-auf"`, "k-geist")}${zeileBtn("tasse", "Gut durch den Winter", "Tees, Ingwer-Tricks, Heizen & Lüften, Besuch", `data-act="wi-auf"`, "k-ruhe")}${zeileBtn("funke", "Wissen", "Kurze Häppchen mit Quelle", `data-act="wissen"`, "k-geist")}${zeileBtn("sprechen", "Erzählfragen", "Zum Plaudern, mit Max oder beim Kaffee", `data-act="lebensbuch"`, "k-geist")}</div>
    <p class="klein" style="margin-top:8px">${WOCHENPLAN}</p>`;
  const aktiv = S.missionen.aktiv.map(a => ({ a, m: (D.missionen || []).find(x => x.id === a.id) })).filter(x => x.m);
  html += `<h3 style="margin-top:20px">Kleine Vorhaben</h3>${aktiv.length ? `<div class="liste">${aktiv.map(({ a, m }) => zeileBtn("funke", m.titel, `${a.tage?.length || 0} von ${m.tage} Tagen`, `data-act="mission" data-id="${m.id}"`, "k-mut")).join("")}</div>` : `<p class="klein">Ein Vorhaben für ein paar Tage – mit Kästchen zum Abhaken.</p>`}
    <button class="knopf zweit voll" style="margin-top:10px" data-act="missionen">Vorhaben aussuchen</button>`;
  if (S.spiel.an) html += `<h3 style="margin-top:20px">Waldpatience</h3><div class="liste">${zeileBtn("karten", "Eine Runde Patience", spielInfoText(), `data-act="spiel"`, "k-geist")}</div>`;
  html += `<h3 style="margin-top:20px">Timer</h3><div class="liste">${zeileBtn("uhr", "Timer stellen", "Eine Sache für ein paar Minuten, ohne Ablenkung. Angefangene Zeit zählt immer.", `data-act="timer-neu"`, "k-geist")}</div>`;
  sheet({ titel: "Drinnen", inhalt: html, id: "tuer" });
}
/* Ein Notfallplan, überall gleich benannt und gleich gestaltet */
const notfallLeiste = act => `<button class="notfall-leiste" data-act="${act}">${ic("atem")}<span><span class="titel">Mein Notfallplan</span><span class="unter">Bei Unruhe oder Anspannung – Schritt für Schritt</span></span></button>`;
/* Ideen kurz anteasern: erster Satz und Dauer, der Volltext steht im Ideen-Blatt */
function ideeKurz(v) { const t = String(v.text || ""), m = /^(.+?[.!?…])(\s|$)/.exec(t); return `${m ? m[1] : t}${v.min ? " · " + v.min + " Min." : ""}`; }
const WOCHENPLAN = "Montags neue Bingo-Karte · Dienstags und freitags Post von Karin · Sonntags Christianes Rätsel und Max’ Wochenpost.";
const THEMEN_REIHE = ["Handy", "Kreativ", "Krimi", "Schwedisch", "Geschichte", "Essen", "Tee & Wärme", "Gut geschützt", "Lesen", "Hören", "Musik", "Lernen", "Listen", "Erinnern", "Kontakt", "Körper", "Sinne", "Hände", "Ordnen"];
function ideenThemen() { const z = {}; (D.stattDaddeln || []).forEach(v => { if (v.kat) z[v.kat] = (z[v.kat] || 0) + 1; }); return Object.entries(z).sort((a, b) => { const ia = THEMEN_REIHE.indexOf(a[0]), ib = THEMEN_REIHE.indexOf(b[0]); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); }); }
function ideenThemaSheet(kat) {
  const arr = (D.stattDaddeln || []).filter(v => v.kat === kat);
  sheet({ titel: kat, id: "thema", inhalt: `<p class="klein" style="margin-top:0">${arr.length} Ideen. Antippen, dann steht alles da.</p><div class="liste kurz-liste">${arr.map(v => zeileBtn(katIcon(v.kat, v), v.titel, ideeKurz(v), `data-act="idee" data-id="${v.id}"`, "k-geist")).join("")}</div>` });
}
function katIcon(kat, v) { { const k0 = (kat || "").toLowerCase(); if (k0.includes("krimi")) return "lupe"; if (k0.includes("körper")) return "matte"; if (k0.includes("hände")) return "pinsel"; } if (/list/i.test(kat || "")) return "feder"; if (v && /karte|brief|post/i.test(v.titel + v.text)) return "brief"; const k = (kat || "").toLowerCase(); if (k.includes("handy")) return "handy"; if (k.includes("tee")) return "waerme"; if (k.includes("geschützt")) return "schild"; if (k.includes("essen")) return "topf"; if (k.includes("krimi")) return "maske"; if (k.includes("kreativ")) return "pinsel"; if (k.includes("schwed")) return "sprechen"; if (k.includes("geschicht")) return "lesezeichen"; return k.includes("les") ? "buch" : k.includes("hör") ? "kopfhoerer" : k.includes("hand") || k.includes("händ") ? "pinsel" : k.includes("kontakt") ? "telefon" : k.includes("körper") ? "matte" : k.includes("sinn") ? "blume" : k.includes("erinn") ? "feder" : k.includes("ordn") ? "kiste" : k.includes("lern") ? "funke" : k.includes("musik") || k.includes("tanz") ? "note" : "stern"; }
function vorschlaege(tf, n, key) {
  const pool = (D.stattDaddeln || []).filter(v => (v.tf || "ABCD").includes(tf) && (tf !== "D" || /Hören|Körper|Sinne|Musik|Lesen/.test(v.kat)) && (tf !== "C" || !/Ordnen/.test(v.kat)));
  const r = rnd(key), a = pool.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  // möglichst verschiedene Kategorien
  const out = [], kats = new Set();
  for (const v of a) { if (out.length >= n) break; if (!kats.has(v.kat)) { out.push(v); kats.add(v.kat); } }
  for (const v of a) { if (out.length >= n) break; if (!out.includes(v)) out.push(v); }
  return out;
}

/* ============================================================
   LICHTUNG
   ============================================================ */
function viewLichtung() {
  const M = modell(), st = stufe(), S0 = D.stufen[st], naechste = D.stufen[st + 1];
  const w = wSumme();
  const anteil = naechste ? clamp((w - S0.w) / (naechste.w - S0.w), 0, 1) : 1;
  let html = `<div class="gruss"><h1>Zuhause</h1><div class="datum">${A("Dein Bild. Es wächst mit allem, was du einträgst.", "Ihr Bild. Es wächst mit allem, was Sie eintragen.")}</div></div>`;
  html += `<section class="abschnitt"><div class="buehne" id="buehne-gross"><canvas id="bild-gross" role="img" aria-label="${esc(bildBeschreibung(M).join(" "))}"></canvas></div><p class="klein entdeck-hinweis${entdecktZahl() ? " gefunden" : ""}" id="entdeck-hinweis">${esc(entdecktZahl() ? entdecktText() : A("Tipp aufs Bild, dann erfährst du mehr – wo’s funkelt, passiert was. Finger drauf halten und herumfahren: Da versteckt sich noch mehr.", "Tippen Sie aufs Bild, dann erfahren Sie mehr – wo’s funkelt, passiert was. Finger drauf halten und herumfahren: Da versteckt sich noch mehr."))}</p></section>`;
  if (typeof zuhauseZusatz === "function") html += zuhauseZusatz(); // Funkeln, Wetter im Bild, Kleiderschrank (skins.js)
  html += `<section class="abschnitt"><div class="bogen stufe-karte"><div class="stufe-nr">Stufe ${st + 1} von ${D.stufen.length}</div><h2>${esc(S0.name)}</h2><p>${esc(S0.text)}</p>
    ${naechste ? `<div class="fortschritt" role="img" aria-label="Weg zur nächsten Stufe"><i style="width:${Math.round(anteil * 100)}%"></i></div><p class="klein" style="margin-top:6px">Als Nächstes: ${esc(naechste.name)}</p>` : `<p class="klein">Das Bild wächst weiter mit allem, was du tust.</p>`}</div>`;
  if (M.km > 0) { const ziel = [...D.massstab].reverse().find(z => M.km >= z.km); html += `<div class="bogen streifen k-bewegung"><p style="margin:0"><span class="zahl" style="font-weight:700">${fmt(M.km)} km</span> gegangen${ziel ? ` – so weit wie ${esc(ziel.ziel)}` : ""}.</p>${massstabZeile(M.km)}</div>`; }
  html += `</section>`;
  // Zuhause = Bild und Sammlung (Wissen und Erzählfragen stehen jetzt unter Ideen › Drinnen)
  html += `<section class="abschnitt"><h2>Rund ums Bild</h2><div class="liste">
    ${zeileBtn("treppe", "Alle Stufen", "Was schon dazugekommen ist", `data-act="stufen"`)}
    ${zeileBtn("liste", "Bild als Liste", "Was im Bild zu sehen ist, in Worten", `data-act="bildliste"`)}
    ${zeileBtn("setzkasten", "Setzkasten", M.ausfluege.length ? `${M.ausfluege.length} ${M.ausfluege.length === 1 ? "Andenken" : "Andenken"} von Ausflügen` : "Andenken von Ausflügen", `data-act="setzkasten"`, "k-draussen")}
    ${typeof zuhauseZusatz === "function" ? "" : zeileBtn("kiste", "Kramladen", `Sachen fürs Bild, Spiele, Klänge · ${talerText(talerStand())}`, `data-act="laden"`, "k-mut")}</div></section>`;
  if (typeof mbZuhauseHTML === "function") html += mbZuhauseHTML(); // Briefe von Max (maxbriefe.js)
  const gekauft = gekaufteInhalteZeilen();
  if (gekauft) html += `<section class="abschnitt"><h2>Gekauft im Kramladen</h2><div class="liste">${gekauft}</div></section>`;
  return html;
}
function massstabZeile(km) {
  const n = D.massstab.findIndex(z => z.km > km); const a = D.massstab[Math.max(0, n - 1)], b = D.massstab[n];
  if (!b) return "";
  const vorher = n > 0 ? a.km : 0, ant = clamp((km - vorher) / (b.km - vorher), 0, 1);
  return `<div class="fortschritt" aria-hidden="true" style="height:10px"><i style="width:${Math.round(ant * 100)}%"></i></div><div class="massstab"><span>${n > 0 ? esc(a.ziel.replace(/^(bis |in die |bis an die )/, "")) : "Zuhause"}</span><span>${esc(b.ziel.replace(/^(bis |in die |bis an die )/, ""))}</span></div>`;
}
function gekaufteInhalteZeilen() {
  const z = [];
  const G = S.gekauft;
  if (G.gedichte1) z.push(zeileBtn("feder", "Gedichte: Jahreszeiten", "", `data-act="lesen" data-was="gedichte1"`, "k-geist"));
  if (G.gedichte2) z.push(zeileBtn("feder", "Gedichte: Unterwegs", "", `data-act="lesen" data-was="gedichte2"`, "k-geist"));
  if (G.rezepte1) z.push(zeileBtn("topf", "Rezepte: Einfach und warm", "", `data-act="lesen" data-was="rezepte1"`, "k-schaffen"));
  if (G.rezepte2) z.push(zeileBtn("kuchen", "Rezepte: Kuchen für Besuch", "", `data-act="lesen" data-was="rezepte2"`, "k-schaffen"));
  if (G.rezepte3) z.push(zeileBtn("kuchen", "Rezepte: Schwedisch backen", "", `data-act="lesen" data-was="rezepte3"`, "k-schaffen"));
  if (G.briefe) z.push(zeileBtn("brief", "Erste Sätze für Briefe", "", `data-act="lesen" data-was="briefe"`, "k-menschen"));
  if (G.fragen) z.push(zeileBtn("frage", "Fangfragen fürs Telefon", "", `data-act="lesen" data-was="fragen"`, "k-menschen"));
  if (G.tanzkarten) z.push(zeileBtn("fuss", "Tanzkarten mit Geschichten", "", `data-act="lesen" data-was="tanzkarten"`, "k-tanz"));
  if (G.takt) z.push(zeileBtn("note", "Tanz-Taktgeber", "Für die Tanzstunden", `data-act="takt"`, "k-tanz"));
  return z.join("");
}

/* ============================================================
   TAGEBUCH
   ============================================================ */
function viewTagebuch() {
  const h = heute();
  let html = `<div class="gruss"><h1>Rückblick</h1><div class="datum">Alles, was du eingetragen und abgehakt hast. Ändern geht immer.</div></div>`;
  // Woche
  const wo = wochenZahlen(h);
  html += `<section class="abschnitt"><div class="bogen"><h3>Diese Woche</h3><p style="margin:0">${wo.length ? esc(wo.join(" · ")) : "Noch nichts eingetragen."}</p>
    <div class="zeile" style="margin-top:12px;flex-wrap:wrap"><button class="knopf klein zweit" data-act="moment">${ic("stern")} Schönster Moment heute</button>${tagDatum(h).getDay() === 0 || (tagDatum(h).getDay() === 1 && !S.rueckblick[kwVon(tagPlus(h, -1))]) ? `<button class="knopf klein leise" data-act="rueckblick">Wochenrückblick</button>` : ""}</div></div></section>`;
  html += rueckblickExtras(h);
  if ((S.briefe || []).length) html += `<section class="abschnitt"><details class="bogen" data-id="briefe"><summary style="font-weight:700;cursor:pointer;min-height:44px;display:flex;align-items:center">${ic("brief")}&nbsp; Briefe (${S.briefe.length})</summary>${S.briefe.slice().reverse().map(b => `<div class="brief-papier" style="margin-top:12px;animation:none"><p class="brief-anrede">Liebe ${esc(S.name)},</p><p class="brief-text">${esc(b.text)}</p><p class="brief-gruss">${b.wer === "christiane" ? "Deine Christiane" : b.wer === "huhn" ? "Dein Hühnchen" : "Dein Max"} <span aria-hidden="true">♥</span> · ${datumLang(b.tag)}</p></div>`).join("")}</details></section>`;
  // Tage
  const tage = [...new Set(S.eintraege.map(e => e.tag).concat(Object.keys(S.momente)))].sort().reverse();
  if (!tage.length) html += `<p>${A("Sobald du etwas einträgst, steht es hier – nach Tagen sortiert.", "Sobald Sie etwas eintragen, steht es hier – nach Tagen sortiert.")}</p>`;
  const zeige = tage.slice(0, S._tbMehr ? 400 : 21);
  for (const t of zeige) {
    const es = eintraegeAm(t), tf = S.tf[t];
    const schwer = (tf === "C" || tf === "D") && t === h;
    html += `<section class="abschnitt"><h3>${datumRelativ(t)}${schwer ? ` <span class="stern" title="ein ruhiger Tag">✱</span>` : ""}</h3>
      ${S.momente[t] ? `<div class="bogen" style="margin-bottom:8px"><div class="klein">Schönster Moment</div><div style="font-style:italic">„${esc(S.momente[t])}“</div></div>` : ""}
      <div class="liste">${es.slice().reverse().map(e => eintragZeile(e, true, t === h)).join("")}</div>
      ${schwer && es.length ? `<p class="klein" style="margin-top:6px">✱ Ein ruhiger Tag – und trotzdem was geschafft.</p>` : ""}</section>`;
  }
  if (tage.length > zeige.length) html += `<button class="knopf zweit voll" data-act="tb-mehr">Ältere Tage zeigen</button>`;
  return html;
}
function wochenZahlen(h) {
  const d = tagDatum(h), mo = tagPlus(h, -((d.getDay() + 6) % 7));
  const es = S.eintraege.filter(e => e.tag >= mo && e.tag <= h);
  if (!es.length) return [];
  const km = es.filter(e => tat(e.t).art === "km").reduce((s, e) => s + (e.km || 0), 0);
  const lesen = es.filter(e => tat(e.t).bild === "eiche").reduce((s, e) => s + (e.min || 0), 0);
  const menschen = es.filter(e => tat(e.t).feld === "menschen").length;
  const ruhe = es.filter(e => tat(e.t).feld === "sorge").length;
  const z = [];
  if (km) z.push(`${fmt(km)} km gegangen`);
  if (lesen) z.push(`${minText(lesen)} gelesen oder gehört`);
  if (menschen) z.push(`${menschen}× Zeit mit Menschen`);
  if (ruhe) z.push(`${ruhe}× etwas Gutes für dich`);
  const haken = es.filter(e => e.t === "abgehakt").length;
  if (haken) z.unshift(`davon ${haken} von der Liste`);
  z.unshift(`${es.length} ${es.length === 1 ? "Sache" : "Sachen"} geschafft`);
  const aus = es.filter(e => e.t === "ausflug").length; if (aus) z.push(`${aus} ${aus === 1 ? "Ausflug" : "Ausflüge"}`);
  return z;
}

/* ============================================================
   SHEETS
   ============================================================ */
/* ---------- Eintragen ---------- */
let E = null; // Entwurf
function eintragenSheet(tid, vorlage) {
  const t = tat(tid);
  const letzte = [...S.eintraege].reverse().find(e => e.t === tid);
  E = vorlage ? { ...vorlage } : { t: tid, tag: heute(), km: letzte?.km || t.std || 2, min: letzte?.min || t.std || 20, person: t.art === "person" ? (letzte?.person || "") : "", draussen: !!t.draussen, mut: false, notiz: "", wie: "", titel: "" };
  if (t.art === "buch" && !E.titel && D.hp?.baende) { const b = D.hp.baende.find(b => b.nr === S.hp.band); if (b) E.titel = b.titel; }
  sheet({ titel: vorlage ? "Eintrag ändern" : t.name, inhalt: eintragenInhalt(), fuss: eintragenFuss(), id: "eintragen" });
}
/* Fuß: ein Knopf, der sagt, was passiert – auch für welchen Tag */
function eintragenFuss() {
  const anderer = E && E.tag && E.tag !== heute();
  const text = E && E._alt ? "Änderung speichern" : anderer ? `Für ${datumRelativ(E.tag).replace(/^(Heute|Gestern|Vorgestern)$/, m => m.toLowerCase())} eintragen` : "Eintragen";
  return `<button class="knopf haupt voll" data-act="speichern">${ic("haken")} ${esc(text)}</button>`;
}
/* Minuten: vier sinnvolle Werte rund um die übliche Dauer der Tätigkeit */
function minKurz(m) { if (m < 60) return `${m} Min.`; if (m === 90) return "1½ Std."; if (m % 60 === 0) return `${m / 60} Std.`; return minText(m); }
function minutenWerte(t, aktuell) {
  const std = t.std || 20;
  const w = std <= 15 ? [5, 10, 15, 30] : std <= 30 ? [10, 20, 30, 60] : std <= 60 ? [30, 45, 60, 90] : [60, 90, 120, 180];
  if (aktuell && !w.includes(aktuell)) { w.push(aktuell); w.sort((a, b) => a - b); }
  return w;
}
/* Eintrag-Blatt: zeigt nur, was zur Tätigkeit passt.
   1. Wie viel (km, Minuten, mit wem, welches Buch)  2. höchstens zwei passende Zusätze
   3. „Wie ging’s dir danach?“ nur bei Bewegung  4. Notiz und anderer Tag eingeklappt */
function eintragenInhalt() {
  const t = tat(E.t); let h = "";
  if (t.art === "km") {
    h += `<label class="feld">Wie weit ungefähr?</label><div class="stepper"><button class="knopf zweit" data-act="step" data-f="km" data-d="-0.5" aria-label="Einen halben Kilometer weniger">${ic("minus")}</button><div class="wert zahl" aria-live="polite">${fmt(E.km)}<small>Kilometer</small></div><button class="knopf zweit" data-act="step" data-f="km" data-d="0.5" aria-label="Einen halben Kilometer mehr">${ic("plus")}</button></div>
      <p class="klein" style="margin-top:8px">Von der Uhr abgelesen oder grob geschätzt – beides ist in Ordnung.${E.km > 6 ? " Ein langer Weg heute. Die Füße haben sich ein Sofa verdient." : ""}</p>`;
  } else if (t.art === "min" || t.art === "person") {
    if (t.art === "person") h += personWahl();
    h += `<label class="feld">Wie lange ungefähr?</label><div class="chips raster">${minutenWerte(t, E.min).map(k => chip(E.min === k, minKurz(k), `data-act="setz" data-f="min" data-v="${k}"`)).join("")}</div>`;
    if (E.t === "lesen" && D.hp && D.hp.baende) { const b = D.hp.baende.find(x => x.nr === S.hp.band); if (b && !E._alt) { const n = E.hpKap || 0; h += `<label class="feld">Harry Potter dabei?</label><div class="chips">${[[0, "Nein"], [1, "1 Kapitel"], [2, "2 Kapitel"], [3, "3 Kapitel"]].map(([v, l]) => chip(n === v, l, `data-act="setz" data-f="hpKap" data-v="${v}"`, "k-geist")).join("")}</div><p class="klein" style="margin-top:6px">„${esc(b.titel.replace("Harry Potter und d", "D"))}“: ${n ? `danach bist du bei Kapitel ${Math.min(b.kapitel, S.hp.kapitel + n)} von ${b.kapitel}` : S.hp.kapitel ? `du bist bei Kapitel ${S.hp.kapitel} von ${b.kapitel}` : "Wo bist du gerade? Unter „Lesen“ kannst du dein Kapitel einstellen"}.</p>`; } }
  } else if (t.art === "buch") {
    h += `<label class="feld" for="buchtitel">Welches Buch?</label><input id="buchtitel" class="text" data-feld="titel" value="${esc(E.titel)}" placeholder="Titel">`;
  } else {
    h += `<p class="klein" style="margin-top:0">Ohne Minuten – einmal eintragen genügt.</p>`;
  }
  // Zusätze nur, wo sie passen
  const zusatz = [];
  if (t.draussenOpt) zusatz.push(schalter(E.draussen, "Draußen gemacht", `data-act="umschalt" data-f="draussen"`, "Frische Luft zählt im Bild etwas mehr."));
  if (t.mutOpt) zusatz.push(schalter(E.mut, "Hat Mut gebraucht", `data-act="umschalt" data-f="mut"`, "Neu oder ungewohnt? Dann leuchtet ein Glühwürmchen mehr im Wald."));
  if (t.muehOpt) zusatz.push(schalter(E.anstrengend, "War ein bisschen anstrengend", `data-act="umschalt" data-f="anstrengend"`, "Dann zählt es ein Stück mehr."));
  if (zusatz.length) h += `<div class="zusaetze">${zusatz.join("")}</div>`;
  // Bewegung und Mut: „Wie ging’s dir danach?“ – freiwillig, höchstens einmal am Tag
  if ((t.feld === "bewegung" || t.mut) && (S.nachherTag !== heute() || E.wie))
    h += wieDanachHTML();
  h += notizUndTag();
  return h;
}
function wieDanachHTML() {
  return `<label class="feld">Wie ging’s dir danach? <span class="klein">(freiwillig)</span></label><div class="chips">${[["gut", "Gut"], ["gleich", "Ging so"], ["zuviel", "War zu viel"]].map(([v, l]) => chip(E.wie === v, l, `data-act="setz" data-f="wie" data-v="${v}"`)).join("")}</div>${E.wie === "zuviel" ? `<p class="klein" style="margin-top:6px">Notiert. Im Bild steht dafür eine Bank zum Ausruhen.</p>` : ""}`;
}
/* Notiz und anderer Tag: eingeklappt, bis man sie braucht (gemeinsam für Eintrag und Ausflug) */
function notizUndTag(notizId = "notiz") {
  const tagAuf = E.tagOffen || (E.tag && E.tag !== heute());
  const notizAuf = E.notizOffen || E.notiz;
  let h = "";
  if (notizAuf) h += `<label class="feld" for="${notizId}">Notiz</label><textarea id="${notizId}" class="text" data-feld="notiz" placeholder="Ein Satz, wenn du magst">${esc(E.notiz)}</textarea>`;
  if (tagAuf) h += `<label class="feld">Für welchen Tag?</label><div class="chips">${[0, -1, -2].map(n => { const tg = tagPlus(heute(), n); return chip(E.tag === tg, datumRelativ(tg), `data-act="setz" data-f="tag" data-v="${tg}"`); }).join("")}</div>`;
  if (!notizAuf || !tagAuf) h += `<div class="zeile klapp-zeile">${notizAuf ? "" : `<button class="knopf klein leise" data-act="notiz-auf">${ic("plus")} Notiz</button>`}${tagAuf ? "" : `<button class="knopf klein leise" data-act="tag-auf">${ic("plus")} Anderer Tag</button>`}</div>`;
  return h;
}
function personWahl() {
  return `<label class="feld">Mit wem?</label><div class="chips">${S.menschen.filter(m => !(E.t === "telefon" && m.id === "micha")).map(m => personChip(m)).join("")}${chip(E.person === "_", "Jemand anderes", `data-act="setz" data-f="person" data-v="_"`, "k-menschen")}</div>
    ${E.person === "_" ? `<div class="zeile" style="margin-top:10px"><input id="person-neu" class="text" maxlength="30" placeholder="Name – bleibt dann in der Auswahl" aria-label="Name der Person, wird gemerkt"><button class="knopf zweit" data-act="person-dazu" aria-label="Person dauerhaft hinzufügen">${ic("plus")}</button></div><p class="klein" style="margin-top:4px">Leer lassen geht auch.</p>` : ""}`;
}
function alleSheet() {
  const eig = (S.eigeneT || []).filter(x => !x.weg);
  // erst finden, dann (selten) neu anlegen: „Meine“ oben, das Anlegen ganz unten
  const meine = eig.length ? `<h3 style="margin-top:4px">Meine</h3><div class="liste">${eig.map(x => { const t = tat(x.id); return `<div class="zeile" style="gap:8px">${zeileBtn(t.icon, t.name, "", `data-act="waehle-t" data-t="${x.id}"`, D.felder[t.feld]?.k).replace('class="liste-zeile', 'style="flex:1" class="liste-zeile')}<button class="knopf klein leise" data-act="eigen-bearbeiten" data-id="${x.id}" aria-label="${esc(x.name)} ändern">Ändern</button></div>`; }).join("")}</div>` : "";
  const anlegen = `<h3 style="margin-top:18px">Fehlt etwas?</h3><p class="klein">Was hier fehlt, kannst du selbst anlegen – es zählt wie ähnliche Dinge.</p><button class="knopf zweit voll" style="margin-top:6px" data-act="eigen-neu">${ic("plus")} Eigene Tätigkeit anlegen</button>`;
  sheet({ titel: "Etwas anderes eintragen", inhalt: meine + D.gruppen.map((g, gi) => `<h3 style="margin-top:${gi || meine ? 14 : 4}px">${esc(g.name)}</h3><div class="liste">${g.ids.map(id => { const t = tat(id); return zeileBtn(t.icon, t.name, "", `data-act="waehle-t" data-t="${id}"`, D.felder[t.feld]?.k); }).join("")}</div>`).join("") + `<h3 style="margin-top:14px">Ausflug</h3><div class="liste">${zeileBtn("rucksack", "Ausflug eintragen oder planen", "", `data-act="ausflug"`, "k-draussen")}</div>` + anlegen });
}

/* ---------- Statt Daddeln: „Ablenkung?“ ---------- */
function hilftSheet() {
  const tf = S.tf[heute()] || "C";
  let v = vorschlaege(tf === "A" || tf === "B" ? tf : (tf === "D" ? "D" : "C"), 3, "hilft" + Date.now());
  if (tf === "C" || tf === "D") { const lind = (D.stattDaddeln || []).filter(x => /Körper|Hören/.test(x.kat) && x.tf.includes(tf)); if (lind.length && !v.some(x => lind.includes(x))) v = [lind[Math.floor(Math.random() * lind.length)], ...v.slice(0, 2)]; }
  let html = `${notfallLeiste("ruhe-jetzt")}<p>${A("Drei Ideen für jetzt. Oder keine – auch gut.", "Drei Ideen für jetzt. Oder keine – auch gut.")}</p><div class="liste kurz-liste">${v.map(x => zeileBtn(katIcon(x.kat, x), x.titel, ideeKurz(x), `data-act="idee" data-id="${x.id}"`, "k-geist")).join("")}</div>`;
  if (S.spiel.an && S.gekauft.patience && (tf === "C" || tf === "D")) html += `<div class="bogen mulde" style="margin-top:14px"><p style="margin:0 0 8px">Spiel ruhig eine Runde Patience – nach 10 Minuten ist sie vorbei.</p><button class="knopf zweit voll" data-act="spiel">${ic("karten")} Waldpatience</button></div>`;
  html += `<button class="knopf leise" data-act="hilft-neu">Andere Ideen</button><div class="liste" style="margin-top:12px">${zeileBtn("plaudern", "Kurz plaudern – zum Spaß", "Mit Hühnchen, Christiane, Max und Co.", `data-act="tel-auf"`, "k-menschen")}${zeileBtn("briefkasten", "Post von Karin aus Vimmerby", "Briefwechsel auf Schwedisch", `data-act="bv-auf"`, "k-menschen")}${zeileBtn("fernseher", "Film & Fernsehen", "Krimis und gute Filme aus der Mediathek", `data-act="tv-auf"`, "k-geist")}</div>`;
  sheet({ titel: "Ablenkung?", inhalt: html, id: "hilft" });
}
function ideeSheet(id) {
  const v = (D.stattDaddeln || []).find(x => x.id === id); if (!v) return;
  const t = tat(v.t || "frei");
  sheet({ titel: v.titel, inhalt: `<p>${esc(v.text)}</p>${v.schritte ? `<ol class="idee-schritte">${v.schritte.map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}${v.links ? `<div class="stapel" style="margin:10px 0">${v.links.map(l => `<a class="knopf zweit voll" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.text)} ↗</a>`).join("")}</div>` : ""}${v.gedicht ? `<div class="bogen mulde idee-gedicht"><p style="margin:0 0 6px;font-weight:700">${esc(v.gedicht.titel || "")}${v.gedicht.autor ? ` <span class="klein">· ${esc(v.gedicht.autor)}</span>` : ""}</p><p class="serif" style="white-space:pre-line;margin:0">${esc(v.gedicht.original || "")}</p>${v.gedicht.deutsch ? `<details style="margin-top:8px"><summary class="klein" style="font-weight:700">Auf Deutsch</summary><p class="serif" style="white-space:pre-line;margin:6px 0 0">${esc(v.gedicht.deutsch)}</p></details>` : ""}${v.gedicht.hinweis ? `<p class="klein" style="margin:8px 0 0">${esc(v.gedicht.hinweis)}</p>` : ""}</div>` : ""}${v.hoeren ? `<div class="stapel" style="margin:10px 0">${v.hoeren.map(l => `<a class="knopf haupt voll" href="${esc(l.url)}" target="_blank" rel="noopener">${ic("kopfhoerer")} ${esc(l.text)}</a>${S.spotify && l.spotify ? `<a class="knopf zweit voll" href="https://open.spotify.com/search/${encodeURIComponent(l.spotify)}" target="_blank" rel="noopener">${ic("note")} In Spotify öffnen</a>` : ""}`).join("")}</div>${!S.spotify && v.hoeren.some(l => l.spotify) ? `<p class="klein" style="margin:-2px 0 10px">Mit Spotify ginge das mit einem Tipp. <button class="link-knopf" data-act="spotify-info">Max hätte da ein Angebot …</button></p>` : ""}` : ""}${v.optionen ? `<div class="chips" style="margin:8px 0">${v.optionen.map(o => `<span class="chip">${esc(o)}</span>`).join("")}</div>` : ""}<p class="klein">${v.min ? `Etwa ${v.min} Minuten` : "Kurz"}${v.haltung ? ` · ${esc(v.haltung)}` : ""}</p>`,
    fuss: `<div class="stapel">${v.min >= 5 ? `<button class="knopf haupt voll" data-act="timer-start" data-t="${t.id}" data-min="${v.min}" data-name="${esc(v.titel)}">${ic("uhr")} Mit Timer: ${v.min} Min.</button>` : ""}<button class="knopf zweit voll" data-act="idee-erledigt" data-id="${v.id}">${ic("haken")} Gemacht – eintragen</button></div>` });
}

/* ---------- Ruhe-Timer ---------- */
function timerRest() { const T = S.timer; if (!T) return 0; const lief = (T.pause ? T.pause : Date.now()) - T.start - (T.pauseSum || 0); return Math.max(0, T.min * 60 - lief / 1000); }
function timerGelaufen() { const T = S.timer; if (!T) return 0; const lief = (T.pause ? T.pause : Date.now()) - T.start - (T.pauseSum || 0); return Math.min(T.min * 60, lief / 1000); }
function timerNeuSheet(tid = "lesen", min = 10) {
  E = { t: tid, min };
  sheet({ titel: "Timer stellen", inhalt: timerNeuInhalt(), fuss: `<button class="knopf haupt voll" data-act="timer-los">${ic("uhr")} Timer starten</button>`, id: "timerneu" });
}
function timerNeuInhalt() {
  return `<label class="feld">Was machst du?</label><div class="chips">${D.timerVorlagen.map(v => chip(E.t === v.id, v.name, `data-act="setz" data-f="t" data-v="${v.id}"`)).join("")}</div>
    <label class="feld">Wie lange?</label><div class="chips">${[5, 10, 15, 20, 30, 45].map(m => chip(E.min === m, m + " Min.", `data-act="setz" data-f="min" data-v="${m}"`)).join("")}</div>
    ${klangWahl()}
    <p class="klein" style="margin-top:12px">Lass die App offen, dann klingelt’s am Ende. Ist das Handy gesperrt, zählt die Zeit trotzdem weiter. Aufhören geht jederzeit – die Zeit bis dahin zählt.</p>`;
}
function klangWahl() {
  const k = []; if (S.gekauft.regen) k.push(["regen", "Regen am Fenster"]); if (S.gekauft.waldmorgen) k.push(["waldmorgen", "Waldmorgen"]);
  if (!k.length) return "";
  return `<label class="feld">Klang dazu?</label><div class="chips">${chip(!E.klang, "Stille", `data-act="setz" data-f="klang" data-v=""`)}${k.map(([id, n]) => chip(E.klang === id, n, `data-act="setz" data-f="klang" data-v="${id}"`)).join("")}</div>`;
}
function timerSheet() {
  sheet({ titel: "Timer", inhalt: `<div id="timer-ansicht">${timerAnsicht()}</div>`, id: "timer", voll: false });
  timerTick();
}
function timerAnsicht() {
  const T = S.timer; if (!T) return "<p>Kein Timer läuft.</p>";
  const rest = timerRest(), ges = T.min * 60, ant = 1 - rest / ges;
  const R = 46, U = 2 * Math.PI * R;
  const fertig = rest <= 0;
  return `<div class="timer-kreis"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${R}" fill="none" stroke="var(--mulde)" stroke-width="7"/>
      <circle cx="50" cy="50" r="${R}" fill="none" stroke="var(--flieder)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${U}" stroke-dashoffset="${U * (1 - ant)}" style="transition:stroke-dashoffset 1s linear"/></svg>
      <div class="mitte"><div class="rest zahl" role="timer">${fertig ? "Fertig" : `${Math.floor(rest / 60)}:${String(Math.floor(rest % 60)).padStart(2, "0")}`}</div><div class="was">${esc(T.name)}</div></div></div>
    ${fertig ? `<p style="text-align:center">Die ${T.min} Minuten sind um. ${T.t === "lesen" ? "Weiterlesen oder Pause? Beides ist richtig." : "Schön."}</p><div class="stapel"><button class="knopf haupt voll" data-act="timer-ende">${ic("haken")} Eintragen</button><button class="knopf zweit voll" data-act="timer-weiter">Noch ${T.min} Minuten</button></div>`
      : `<div class="stapel"><button class="knopf zweit voll" data-act="${T.pause ? "timer-fort" : "timer-pause"}">${T.pause ? "Weiter" : "Pause"}</button><button class="knopf leise" data-act="timer-ende">Ich höre auf – Zeit eintragen</button></div>`}`;
}
let timerIv = 0;
function timerTick() {
  clearInterval(timerIv);
  timerIv = setInterval(() => {
    const el = $("#timer-ansicht");
    if (!S.timer) { clearInterval(timerIv); return; }
    const rest = timerRest();
    if (rest <= 0 && !S.timer.gemeldet) { S.timer.gemeldet = true; speichern(); haptik("erfolg"); ton(S.gekauft.klangschale ? "klangschale" : S.gekauft.spieluhr ? "spieluhr" : "ende", S.gekauft.klangschale || S.gekauft.spieluhr); klangStopp(); if (el) el.innerHTML = timerAnsicht(); armHaptics(); }
    else if (el && !S.timer.pause) { const r = $(".rest", el); if (r && rest > 0) r.textContent = `${Math.floor(rest / 60)}:${String(Math.floor(rest % 60)).padStart(2, "0")}`; const c = $$("circle", el)[1]; if (c) { const U = 2 * Math.PI * 46; c.setAttribute("stroke-dashoffset", U * (rest / (S.timer.min * 60))); } }
  }, 1000);
}

/* ---------- Klangteppich (Web Audio, ohne Dateien) ---------- */
let KLANG = null;
function klangStart(art) {
  klangStopp(); if (!art || !audio()) return;
  const len = 2 * AC.sampleRate, buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * .1848) * .11; }
  const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = AC.createBiquadFilter(); f.type = art === "regen" ? "lowpass" : "bandpass"; f.frequency.value = art === "regen" ? 1400 : 600; f.Q.value = .6;
  const g = AC.createGain(); g.gain.value = 0; g.gain.linearRampToValueAtTime(art === "regen" ? .5 : .32, AC.currentTime + 2);
  src.connect(f).connect(g).connect(AC.destination); src.start();
  let vogel = 0;
  if (art === "waldmorgen") vogel = setInterval(() => { if (Math.random() < .35) { const o = AC.createOscillator(), gg = AC.createGain(), t0 = AC.currentTime; o.type = "sine"; const f0 = 2600 + Math.random() * 1400; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f0 * 1.35, t0 + .09); o.frequency.exponentialRampToValueAtTime(f0 * .9, t0 + .18); gg.gain.setValueAtTime(0, t0); gg.gain.linearRampToValueAtTime(.035, t0 + .02); gg.gain.exponentialRampToValueAtTime(.0005, t0 + .22); o.connect(gg).connect(AC.destination); o.start(t0); o.stop(t0 + .25); } }, 1700);
  KLANG = { src, g, vogel };
}
function klangStopp() { if (!KLANG) return; try { KLANG.g.gain.linearRampToValueAtTime(0, AC.currentTime + .6); const s = KLANG.src; setTimeout(() => s.stop(), 700); } catch (e) { } clearInterval(KLANG.vogel); KLANG = null; }

/* ---------- Tanz-Taktgeber ---------- */
const TAENZE = [{ id: "lw", name: "Langsamer Walzer", takt: 3, bpm: 87 }, { id: "ww", name: "Wiener Walzer", takt: 3, bpm: 174 }, { id: "fox", name: "Foxtrott", takt: 4, bpm: 112 }, { id: "disco", name: "Discofox", takt: 4, bpm: 120 }, { id: "cha", name: "Cha-Cha-Cha", takt: 4, bpm: 120 }, { id: "rumba", name: "Rumba", takt: 4, bpm: 100 }];
let TAKT = { an: false, tanz: "lw", bpm: 87, iv: 0, schlag: 0 };
function taktSheet() { sheet({ titel: "Tanz-Taktgeber", inhalt: taktInhalt(), id: "takt", onclose: taktStopp }); }
function taktInhalt() {
  const t = TAENZE.find(x => x.id === TAKT.tanz);
  return `<p class="klein">Für die Tanzstunden: Der erste Schlag jedes Takts klingt etwas höher.</p><div class="chips">${TAENZE.map(x => chip(TAKT.tanz === x.id, x.name, `data-act="takt-tanz" data-v="${x.id}"`, "k-tanz")).join("")}</div>
    <label class="feld">Tempo</label><div class="stepper"><button class="knopf zweit" data-act="takt-bpm" data-d="-4" aria-label="Langsamer">${ic("minus")}</button><div class="wert zahl">${TAKT.bpm}<small>Schläge pro Minute · ${t.takt}/4-Takt</small></div><button class="knopf zweit" data-act="takt-bpm" data-d="4" aria-label="Schneller">${ic("plus")}</button></div>
    <div class="zeile" id="takt-punkte" style="justify-content:center;gap:14px;margin:18px 0" aria-hidden="true">${Array.from({ length: t.takt }, (_, i) => `<span style="width:22px;height:22px;border-radius:50%;background:var(--mulde-2)" data-i="${i}"></span>`).join("")}</div>
    <button class="knopf haupt voll" data-act="takt-an">${TAKT.an ? "Anhalten" : "Takt starten"}</button>`;
}
function taktStart() {
  taktStopp(); if (!audio()) return; TAKT.an = true; TAKT.schlag = 0;
  const t = TAENZE.find(x => x.id === TAKT.tanz);
  const klick = () => {
    const i = TAKT.schlag % t.takt, o = AC.createOscillator(), g = AC.createGain(), t0 = AC.currentTime;
    o.type = "triangle"; o.frequency.value = i === 0 ? 1320 : 880; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(i === 0 ? .25 : .15, t0 + .005); g.gain.exponentialRampToValueAtTime(.0005, t0 + .09);
    o.connect(g).connect(AC.destination); o.start(t0); o.stop(t0 + .1);
    $$("#takt-punkte span").forEach((s, k) => s.style.background = k === i ? "var(--ziegel)" : "var(--mulde-2)");
    TAKT.schlag++;
  };
  klick(); TAKT.iv = setInterval(klick, 60000 / TAKT.bpm);
}
function taktStopp() { clearInterval(TAKT.iv); TAKT.an = false; }

/* ---------- Ausflüge: Mut-Leiter, Ziele, Plan ---------- */
function zieleFuer(stufeL) { return (D.ausflugsziele || []).filter(z => (z.paket !== "weiter" || S.gekauft.orte2) && (!stufeL || z.leiter === stufeL)); }
function ausflugSheet() {
  const max = Math.max(0, ...S.eintraege.filter(e => e.t === "ausflug" && !e.umgekehrt).map(e => e.leiter || 0));
  let html = `<p>${A("Sieben Ausflugsarten, von vor der Tür bis zur Übernachtung. Such dir aus, worauf du Lust hast – jede so oft du magst.", "Sieben Ausflugsarten, von vor der Tür bis zur Übernachtung. Suchen Sie sich aus, worauf Sie Lust haben – jede so oft Sie mögen.")}</p><div class="liste">`;
  html += D.leiter.map(l => { const n = zieleFuer(l.s).length; const war = S.leiter.neuland[l.s]; return zeileBtn(war ? "haken" : "rucksack", `${l.s}. ${l.name}`, `${l.text} · ${l.dauer}${n ? ` · ${n} Ziele` : ""}`, `data-act="leiter" data-s="${l.s}"`, l.s <= max ? "k-draussen" : "k-mut"); }).join("");
  html += `</div><h3 style="margin-top:18px">Schon zurück?</h3><button class="knopf zweit voll" data-act="ausflug-nachtragen">${ic("rucksack")} Ausflug nachträglich eintragen</button>`;
  const geplant = S.plaene.filter(p => p.status === "geplant");
  if (geplant.length) html += `<h3 style="margin-top:18px">Geplant</h3><div class="liste">${geplant.map(p => zeileBtn("karte", p.titel, (D.leiter[p.leiter - 1] || {}).name || "", `data-act="plan" data-id="${p.id}"`, "k-draussen")).join("")}</div>`;
  sheet({ titel: "Ausflug planen", inhalt: html, id: "ausflug" });
}
function leiterSheet(s) {
  const l = D.leiter.find(x => x.s === s), ziele = zieleFuer(s);
  let html = `<p>${esc(l.text)} <span class="klein">(${l.dauer})</span></p>`;
  html += ziele.length ? `<div class="liste">${ziele.map(z => zeileBtn("rucksack", z.name, `${z.km ? "ca. " + fmt(z.km) + " km · " : ""}${z.text}`, `data-act="ziel" data-id="${z.id}"`, "k-draussen")).join("")}</div>` : `<p class="klein">Hier passt jeder Ort, den du selbst kennst.</p>`;
  if (!S.gekauft.orte2 && (D.ausflugsziele || []).some(z => z.paket === "weiter" && z.leiter === s)) html += `<p class="klein" style="margin-top:10px">Weitere Ziele gibt es im Kramladen („Weiter weg“).</p>`;
  html += `<button class="knopf zweit voll" style="margin-top:14px" data-act="eigenes-ziel" data-s="${s}">${ic("plus")} Eigenes Ziel</button>`;
  sheet({ titel: `${l.s}. ${l.name}`, inhalt: html });
}
function zielSheet(id) {
  const z = (D.ausflugsziele || []).find(x => x.id === id); if (!z) return;
  const sauber = v => { if (!v) return v; if (/^(prüfen|unbekannt)/i.test(v)) return "vorher kurz erfragen"; return v.replace(/\s*\((prüfen|vermutlich)\)/gi, "").replace(/\(u\. a\. GdB 50[^)]*\)/g, "").trim(); };
  const zeile = (k, v) => (v = sauber(v)) ? `<p style="margin:0 0 6px"><span style="font-weight:700">${k}:</span> ${esc(v)}</p>` : "";
  sheet({ titel: z.name, inhalt: `<p>${esc(z.text)}</p><div class="bogen mulde">${zeile("Anreise", z.anreise)}${zeile("Zu Fuß", z.gehen)}${zeile("Sitzen", z.baenke)}${zeile("Ruhige Zeit", z.ruhig)}${zeile("Jahreszeit", z.saison)}${zeile("Kosten", z.kosten)}</div>
    ${z.pruefen ? `<p class="klein" style="margin-top:8px">Einige Angaben sind noch ungeprüft – vorher kurz nachsehen.</p>` : ""}${z.quelle ? `<p class="klein"><a href="${esc(z.quelle)}" target="_blank" rel="noopener">Quelle ansehen</a></p>` : ""}`,
    fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="planen" data-id="${z.id}">${ic("tagebuch")} Ausflug planen</button><button class="knopf zweit voll" data-act="ausflug-nachtragen" data-id="${z.id}">Ich war schon da – eintragen</button></div>` });
}
function planSheet(planId) {
  const p = S.plaene.find(x => x.id === planId); if (!p) return;
  const html = `<p>Ausflug: ${esc(D.leiter[p.leiter - 1].name)}</p>
    <h3>${A("Deine Liste für unterwegs", "Ihre Liste für unterwegs")}</h3><p class="klein">Antippen zum Abhaken.</p><div class="liste" id="checkliste">${checklisteHTML()}</div>
    <h3 style="margin-top:16px">Wenn es unterwegs hakt …</h3><div class="liste">${D.wennDann.map((w, i) => `<button class="liste-zeile" data-act="wenndann" data-i="${i}" aria-pressed="${p.wennDann === i}">${ic(p.wennDann === i ? "haken" : "funke")}<span class="text">${esc(w)}</span></button>`).join("")}</div>
    <h3 style="margin-top:16px">Bei Unruhe oder Anspannung</h3><button class="knopf zweit voll" style="margin-top:8px" data-act="ruhe-plan">${ic("atem")} Notfallplan ansehen oder üben</button>
    <h3 style="margin-top:16px">Jemandem Bescheid sagen</h3><p class="klein">Text kopieren und per Nachricht schicken:</p><div class="bogen mulde" id="bescheid">${esc(bescheidText(p))}</div><button class="knopf zweit voll" style="margin-top:10px" data-act="kopieren" data-was="bescheid">Text kopieren</button>`;
  sheet({ titel: p.titel, inhalt: html, fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="losgehen" data-id="${p.id}">${ic("rucksack")} Ich gehe los</button><button class="knopf leise" style="margin-top:16px" data-act="plan-weg" data-id="${p.id}">Plan verwerfen</button></div>` });
}
function checklisteHTML() { return S.checkliste.map((c, i) => `<button class="liste-zeile" data-act="check" data-i="${i}" aria-pressed="${!!c.an}">${ic(c.an ? "boxhaken" : "box")}<span class="text">${esc(c.text)}</span></button>`).join(""); }
function bescheidText(p) { return `Ich mache heute einen Ausflug: ${p.titel}. Ich melde mich, wenn ich zurück bin. ${S.name}`; }
function zurueckSheet(planId, zielId) {
  const p = planId ? S.plaene.find(x => x.id === planId) : null;
  const z = zielId ? (D.ausflugsziele || []).find(x => x.id === zielId) : null;
  E = { t: "ausflug", tag: heute(), titel: p ? p.titel : z ? z.name : "", ziel: p ? p.ziel : z ? z.id : "", leiter: p ? p.leiter : z ? z.leiter : 2, form: p ? p.form : z ? z.form : "huegel", andenken: waehle(D.andenken, "and" + Date.now()), notiz: "", wie: "", umgekehrt: false, planId, mut: false };
  sheet({ titel: p ? "Willkommen zurück" : "Ausflug eintragen", inhalt: zurueckInhalt(), fuss: `<button class="knopf haupt voll" data-act="ausflug-speichern">${ic("haken")} Eintragen</button>`, id: "zurueck" });
}
function zurueckInhalt() {
  const leer = !E.ziel;
  return `${leer ? `<label class="feld" for="ztitel">Wohin ging’s?</label><input id="ztitel" class="text" data-feld="titel" value="${esc(E.titel)}" placeholder="z. B. Havelufer">` : `<p><span style="font-weight:700">${esc(E.titel)}</span></p>`}
    <label class="feld">Wie weit weg war das?</label><div class="chips">${D.leiter.map(l => chip(E.leiter === l.s, `${l.s}. ${l.name}`, `data-act="setz" data-f="leiter" data-v="${l.s}"`, "k-draussen")).join("")}</div>
    ${leer ? `<label class="feld">Was soll dafür im Bild am Horizont stehen?</label><div class="chips">${D.formen.map(f => chip(E.form === f.id, f.name, `data-act="setz" data-f="form" data-v="${f.id}"`, "k-draussen")).join("")}</div>` : ""}
    ${wieDanachHTML()}
    ${schalter(E.umgekehrt, "Ich bin bewusst umgekehrt", `data-act="umschalt" data-f="umgekehrt"`, "Zählt genauso.")}
    ${schalter(E.mut, "Hat Mut gebraucht", `data-act="umschalt" data-f="mut"`, "Neu oder ungewohnt? Dann leuchtet ein Glühwürmchen mehr im Wald.")}
    <label class="feld" for="znotiz">Was war schön?</label><textarea id="znotiz" class="text" data-feld="notiz" placeholder="Ein Satz reicht">${esc(E.notiz)}</textarea>
    ${E.tagOffen || E.tag !== heute() ? `<label class="feld">Für welchen Tag?</label><div class="chips">${[0, -1, -2].map(n => { const tg = tagPlus(heute(), n); return chip(E.tag === tg, datumRelativ(tg), `data-act="setz" data-f="tag" data-v="${tg}"`); }).join("")}</div>` : `<div class="zeile klapp-zeile"><button class="knopf klein leise" data-act="tag-auf">${ic("plus")} Anderer Tag</button></div>`}`;
}

/* ---------- Kramladen ---------- */
function ladenSheet() { sheet({ titel: "Kramladen", inhalt: ladenInhalt(), id: "laden" }); }
function ladenInhalt() {
  if (typeof kramladenInhalt === "function") return kramladenInhalt(); // Laden mit Abteilungen (skins.js)
  const t = talerStand();
  let html = `<div class="bogen mulde zeile zwischen"><span><span style="font-weight:700" class="zahl">${talerText(t)}</span><br><span class="klein">Taler kommen von allem, was du einträgst. Sie verfallen nie.</span></span>${ic("laden")}</div>`;
  const gruppen = [...new Set(D.laden.map(x => x.gruppe))];
  for (const g of gruppen) {
    html += `<h3 style="margin-top:18px">${esc(g)}</h3><div class="liste">`;
    html += D.laden.filter(x => x.gruppe === g).map(x => {
      const hat = S.gekauft[x.id];
      return `<div class="bogen" style="padding:14px 16px"><div class="zeile" style="align-items:flex-start">${ic(x.icon)}<div style="flex:1"><div style="font-weight:700">${esc(x.name)}</div><div class="klein">${esc(x.text)}</div></div></div>
        <div style="margin-top:10px">${hat ? `<span class="klein" style="font-weight:700;color:var(--moos)">${ic("haken")} Gehört dir</span>${ladenOeffnen(x.id)}` : `<button class="knopf klein ${t >= x.preis ? "zweit" : "rand"}" data-act="kaufen" data-id="${x.id}" ${t >= x.preis ? "" : "disabled"}>${t >= x.preis ? `Für ${x.preis} Taler kaufen` : `${x.preis} Taler · noch ${Math.ceil(x.preis - t)} sammeln`}</button>`}</div></div>`;
    }).join("");
    html += `</div>`;
  }
  return html;
}
function ladenOeffnen(id) {
  const m = { gedichte1: "lesen", gedichte2: "lesen", rezepte1: "lesen", rezepte2: "lesen", rezepte3: "lesen", briefe: "lesen", fragen: "lesen", tanzkarten: "lesen" };
  if (m[id]) return ` <button class="knopf klein leise" data-act="lesen" data-was="${id}">Öffnen</button>`;
  if (id === "takt") return ` <button class="knopf klein leise" data-act="takt">Öffnen</button>`;
  if (id === "patience") return ` <button class="knopf klein leise" data-act="spiel">Spielen</button>`;
  if ((D.gutscheine || []).some(g => g.id === id)) return ` <button class="knopf klein leise" data-act="gutschein" data-id="${id}">Einlösen</button>`;
  return "";
}
function kaufenFrage(id) {
  const x = D.laden.find(y => y.id === id);
  sheet({ titel: x.name, inhalt: `<p>${esc(x.text)}</p><p>Für <span style="font-weight:700">${x.preis} Taler</span> kaufen? ${A("Danach gehört es dir.", "Danach gehört es Ihnen.")}</p>`, fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="kaufen-ja" data-id="${id}">Ja, kaufen</button><button class="knopf leise" data-act="sheet-zu">Doch nicht</button></div>` });
}

/* ---------- Lesestoff aus dem Laden ---------- */
function leseSheet(was) {
  let titel = "", html = "";
  if (was.startsWith("gedichte")) { titel = was === "gedichte1" ? "Gedichte: Jahreszeiten" : "Gedichte: Unterwegs"; html = (D.gedichte?.[was] || []).map(g => `<div class="bogen"><h3>${esc(g.titel)}</h3><p style="white-space:pre-line;font-family:var(--f-stimme);line-height:1.6">${esc(g.text)}</p><p class="klein">${esc(g.autor)}${g.jahr ? `, ${esc(g.jahr)}` : ""}</p></div>`).join(""); }
  else if (was.startsWith("rezepte")) { titel = was === "rezepte1" ? "Einfach und warm" : was === "rezepte3" ? "Schwedisch backen" : "Kuchen für Besuch"; html = (D.rezepte?.[was] || []).map(r => `<div class="bogen"><h3>${esc(r.titel)}</h3>${r.dauer ? `<p class="klein">${esc(r.dauer)}</p>` : ""}<p style="font-weight:700;margin-bottom:4px">Zutaten</p><ul style="margin:0 0 10px;padding-left:22px">${r.zutaten.map(z => `<li>${esc(z)}</li>`).join("")}</ul><p style="font-weight:700;margin-bottom:4px">So geht’s</p><ol style="margin:0 0 10px;padding-left:22px">${r.schritte.map(z => `<li style="margin-bottom:4px">${esc(z)}</li>`).join("")}</ol>${r.tipp ? `<p class="klein">${esc(r.tipp)}</p>` : ""}</div>`).join(""); }
  else if (was === "briefe") { titel = "Briefanfänge"; html = (D.briefe || []).map((b, i) => `<div class="bogen"><div class="klein">${esc(b.anlass)}</div><p style="font-family:var(--f-stimme);margin:6px 0 10px">${esc(b.anfang)}</p><button class="knopf klein leise" data-act="kopieren-text" data-text="${esc(b.anfang)}">Kopieren</button></div>`).join(""); }
  else if (was === "fragen") { titel = "Fangfragen fürs Telefon"; html = `<p class="klein">Für das nächste Telefonat. Eine reicht, zwei sind frech.</p>` + (D.fragekarten || []).map(f => `<div class="bogen"><p style="margin:0;font-family:var(--f-stimme)">${esc(f)}</p></div>`).join(""); }
  else if (was === "tanzkarten") { titel = "Tanzkarten mit Geschichten"; html = `<p class="klein">Zum Weitererzählen in der Tanzstunde – und Musik zum Reinhören.</p>` + (D.tanzkarten || []).map(k => `<div class="bogen streifen k-tanz"><h3>${esc(k.tanz)}</h3>${k.takt ? `<p class="klein" style="margin-top:0">${esc(k.takt)}</p>` : ""}${(k.erzaehl || k.schritte || []).map(s => `<p style="white-space:pre-line${/\n/.test(s) ? ";font-family:var(--f-stimme);font-style:italic" : ""}">${esc(s)}</p>`).join("")}${(k.musik || []).length ? `<div class="tanz-musik">${k.musik.map(m => `<a class="knopf zweit klein" href="https://www.youtube.com/results?search_query=${encodeURIComponent(m)}" target="_blank" rel="noopener">${ic("note")} ${esc(m)}</a>`).join("")}</div>` : ""}${k.tipp ? `<p class="klein">${esc(k.tipp)}</p>` : ""}</div>`).join("") + (S.gekauft.takt ? `<button class="knopf zweit voll" data-act="takt">${ic("note")} Taktgeber öffnen</button>` : ""); }
  sheet({ titel, inhalt: html || "<p>Hier kommt bald etwas.</p>" });
}

/* ---------- Setzkasten ---------- */
const ANDENKEN_SVG = {
  fahrkarte: "M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V7Zm5 2v1.5h8V9H8Zm0 3.5V14h5v-1.5H8Z",
  eichel: "M12 3c-.8 0-1.5.6-1.5 1.4V5C7 5.4 5 7.4 5 10h14c0-2.6-2-4.6-5.5-5v-.6C13.5 3.6 12.8 3 12 3ZM6 11.5c.4 4.7 3 8.5 6 8.5s5.6-3.8 6-8.5H6Z",
  muschel: "M12 4c5 0 9 3.6 9 8 0 2.8-1.6 5.2-4 6.6V20H7v-1.4C4.6 17.2 3 14.8 3 12c0-4.4 4-8 9-8Zm0 2.5-1 11h2l-1-11Zm-4 1.3L9.6 17h1.7L9.4 7.4l-1.4.4Zm8 0-1.4-.4-1.9 9.6h1.7L16 7.8Z",
  blatt: IC.blatt, postkarte: "M3 5h18v14H3V5Zm2 2v10h8V7H5Zm10 1v2h4V8h-4Zm0 4v1.5h4V12h-4Zm0 3v1.5h4V15h-4Z",
  tasse: IC.tasse, stein: "M5 15c0-4.2 3.4-8 8-8 3.6 0 6 2.4 6 5.6 0 3.8-3.2 6.4-7.6 6.4C7.4 19 5 17.6 5 15Z",
  feder: IC.feder, schluessel: "M8 7a5 5 0 1 1 0 10A5 5 0 0 1 8 7Zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm4.7 1H22v2h-2v3h-2v-3h-2v2h-2v-2h-1.3a5 5 0 0 0 0-2Z"
};
function setzkastenSheet() {
  const M = modell(), a = M.ausfluege;
  const faecher = Math.max(9, Math.ceil((a.length + 1) / 3) * 3);
  let html = `<p class="klein">${A("Jeder Ausflug legt ein Andenken in ein Fach. Leere Fächer sind Platz für später.", "Jeder Ausflug legt ein Andenken in ein Fach. Leere Fächer sind Platz für später.")}</p><div class="setzkasten">`;
  for (let i = 0; i < faecher; i++) {
    const x = a[i];
    html += x ? `<button class="fach" data-act="andenken" data-i="${i}" aria-label="${esc(x.titel)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${ANDENKEN_SVG[x.andenken] || ANDENKEN_SVG.stein}"/></svg><span class="fach-name">${esc(x.titel)}</span></button>` : `<div class="fach leer" aria-hidden="true"></div>`;
  }
  html += `</div>`;
  sheet({ titel: "Setzkasten", inhalt: html });
}
function andenkenSheet(i) {
  const x = modell().ausfluege[i]; if (!x) return;
  const alle = S.eintraege.filter(e => e.t === "ausflug" && (e.ziel || "eigen:" + e.titel) === x.ziel);
  sheet({ titel: x.titel, inhalt: `<div style="width:120px;height:120px;margin:4px auto 12px;color:var(--havel)"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${ANDENKEN_SVG[x.andenken] || ANDENKEN_SVG.stein}"/></svg></div>` + alle.map(e => `<div class="bogen"><div class="klein">${datumLang(e.tag)}</div>${e.notiz ? `<p style="margin:4px 0 0;font-style:italic">„${esc(e.notiz)}“</p>` : `<p class="klein" style="margin:4px 0 0">Ohne Notiz.</p>`}</div>`).join("") });
}

/* ---------- Bild als Liste, Ort-Info, Stufen ---------- */
function bildListeSheet() { const z = bildBeschreibung(modell()); sheet({ titel: "Dein Bild in Worten", inhalt: `<ul style="padding-left:22px">${z.map(x => `<li style="margin-bottom:8px">${esc(x)}</li>`).join("")}</ul>` }); }
function ortSheet(reg) {
  const M = modell();
  if (reg.ort === "huehnchen") { sheet({ titel: "Hühnchen", inhalt: `<div style="display:grid;place-items:center;margin:8px 0 14px">${huhnSVG({ gr: 130, stimmung: "freut" })}</div><p>Ein kleines ockergelbes Huhn aus Ton, aus Peru. Wohnt neben Glücksschwein und grünem Hasen und steht im Bild dort, wo du zuletzt etwas getan hast.</p><p class="klein">Zu allem, was du machst, hat es eine Meinung. Die steht jeden Tag auf „Heute“.</p>` }); return; }
  if (reg.ort === "figuren") { const namen = (reg.besuch || []).map(w => (S.menschen.find(m => m.id === w) || { name: "" }).name).filter(Boolean); sheet({ titel: "Wer heute da ist", inhalt: `<div style="display:grid;place-items:center;margin:4px 0 12px"><canvas class="figur-bild" data-wer="rita${reg.besuch && reg.besuch.length ? "," + reg.besuch.join(",") : ""}" width="240" height="150" style="width:240px;height:150px"></canvas></div><p>Das bist du${namen.length ? `, und daneben ${esc(namen.join(" und "))}` : ""}.</p><p class="klein">Wer mit dir Zeit verbracht hat, steht ein paar Tage mit im Bild.</p>` }); figurenMalen(); return; }
  if (reg.ort === "hochsitz") { sheet({ titel: "Der Hochsitz", inhalt: `<p>Von hier oben sieht man, wie weit die Wege schon reichen.</p><div class="bogen streifen k-bewegung"><p style="margin:0"><span class="zahl" style="font-weight:700">${fmt(M.km)} km</span> gegangen.</p>${massstabZeile(M.km)}</div><div class="liste" style="margin-top:12px">${D.massstab.map(z => `<div class="liste-zeile" style="cursor:default">${ic(M.km >= z.km ? "haken" : "karte")}<span class="text"><span class="titel">${z.km} km</span><br><span class="unter">${esc(z.ziel)}</span></span></div>`).join("")}</div>` }); return; }
  if (reg.ort === "horizont" && reg.a) { const i = M.ausfluege.indexOf(M.ausfluege.find(a => a.ziel === reg.a.ziel)); andenkenSheet(i); return; }
  const o = D.orte[reg.ort]; if (!o) return;
  let extra = "";
  if (reg.ort === "fenster") extra = `<div class="liste">${S.menschen.map(m => `<div class="liste-zeile" style="cursor:default"><span class="mensch-bild">${personBild(m, 44)}</span><span class="text"><span class="titel">${esc(m.name)}</span><br><span class="unter">${esc(m.rolle || "")}</span></span></div>`).join("")}</div>`;
  if (reg.ort === "eiche" && M.buecher.length) extra = `<h3>Lesezeichen am Ast</h3><ul style="padding-left:22px">${M.buecher.map(b => `<li>${esc(b.titel)} <span class="klein">(${datumLang(b.tag)})</span></li>`).join("")}</ul>`;
  sheet({ titel: o.name, inhalt: `<p>${esc(o.text)}</p>${extra}<p class="klein">${esc(bildBeschreibung(M).find(x => x.replace(/^(Der|Die|Das) /, "").startsWith(o.name.replace(/^(Der|Die|Das) /, "").slice(0, 4))) || "")}</p>` });
}
function stufenSheet() {
  const st = stufe();
  sheet({ titel: "Alle Stufen", inhalt: `<div class="liste">${D.stufen.map((s, i) => i <= st ? `<div class="bogen ${i === st ? "streifen" : ""}"><div class="klein">Stufe ${i + 1}</div><h3>${esc(s.name)}</h3><p style="margin:0">${esc(s.text)}</p></div>` : i === st + 1 ? `<div class="bogen mulde"><div class="klein">Als Nächstes</div><h3>${esc(s.name)}</h3></div>` : "").join("")}</div>` });
}
function stufeMoment(neuSt, auchNeu) {
  $$(".toast").forEach(t => t.remove());
  const s = D.stufen[neuSt];
  sheet({ titel: "Neu im Bild", inhalt: `<div class="buehne klein" style="margin-bottom:14px"><canvas id="bild-moment"></canvas></div><div class="klein">Stufe ${neuSt + 1} von ${D.stufen.length}</div><h2>${esc(s.name)}</h2><p>${esc(s.text)}</p>${auchNeu && auchNeu.length ? `<p class="klein">Auch neu: ${esc(auchNeu.join(", "))}</p>` : ""}`, fuss: `<button class="knopf haupt voll" data-act="sheet-zu">Klasse!</button>`, id: "moment" });
  setTimeout(() => { const c = $("#bild-moment"); if (c) zeichneSzene(c, {}); }, 60);
  haptik("stufe"); ton("erfolg");
}

/* ---------- Wissen, Lebensbuch, Moment, Rückblick ---------- */
function wissenSheet() {
  const w = D.wissen || [];
  sheet({ titel: "Wissen", inhalt: `<p class="klein">Kurz, ehrlich, mit Quelle. „Beleg“ sagt, wie gut es untersucht ist.</p>` + w.map(x => `<details class="bogen" style="margin-bottom:10px"><summary style="font-weight:700;cursor:pointer;min-height:44px;display:flex;align-items:center">${esc(x.titel)}</summary><p style="margin-top:8px">${esc(x.text)}</p><p class="klein">Beleg: ${esc(x.beleg)}${x.quelle ? ` · <a href="${esc(x.quelle)}" target="_blank" rel="noopener">${esc(x.quelleName || "Quelle")}</a>` : ""}</p></details>`).join("") });
}
function lebensbuchSheet() {
  const f = D.lebensbuch || [];
  sheet({ titel: "Erzählfragen", inhalt: `<p class="klein">Fragen zum Plaudern – beim Kaffee, am Telefon oder mit Max. Nichts davon muss.</p>` + f.map(x => `<div class="bogen"><p style="font-family:var(--f-stimme);font-weight:600">${esc(x.frage)}</p><p class="klein">${x.mit === "zusammen" ? "Zum Erzählen" : "Zum Aufschreiben"}</p><textarea class="text" data-lb="${x.id}" placeholder="Wenn du magst …">${esc(S.lebensbuch[x.id] || "")}</textarea></div>`).join("") });
}
function momentSheet() {
  const h = heute();
  sheet({ titel: "Schönster Moment heute", inhalt: `<p>Was war heute schön? Ein Satz reicht.</p><textarea id="moment-text" class="text" placeholder="z. B. Sonne auf dem Balkon">${esc(S.momente[h] || "")}</textarea>`, fuss: `<button class="knopf haupt voll" data-act="moment-speichern">${ic("haken")} Aufschreiben</button>` });
}
function rueckblickSheet() {
  const h = heute(), d = tagDatum(h), mo = tagPlus(h, -((d.getDay() + 6) % 7));
  const wo = wochenZahlen(h);
  const momente = Object.entries(S.momente).filter(([t]) => t >= mo && t <= h);
  const geben = S.eintraege.filter(e => e.tag >= mo && (e.t === "tanzstunde" || e.t === "geholfen" || e.t === "brief")).length;
  sheet({ titel: "Wochenrückblick", inhalt: `<div class="bogen"><h3>Diese Woche</h3><p>${wo.length ? esc(wo.join(" · ")) : "Eine ruhige Woche."}</p>${geben ? `<p class="klein">Du hast anderen etwas gegeben: Tanzstunden, Hilfe, Post.</p>` : ""}</div>
    ${momente.length ? `<h3 style="margin-top:14px">Schöne Momente</h3>${momente.map(([t, m]) => `<div class="bogen"><div class="klein">${datumLang(t)}</div><p style="margin:4px 0 0;font-style:italic">„${esc(m)}“</p></div>`).join("")}` : ""}
    <h3 style="margin-top:14px">Für nächste Woche</h3><p class="klein">Ein kleiner Vorsatz, wenn du magst. Zum Beispiel: „Wenn die Sonne scheint, gehe ich zur Bank am Forst.“</p><textarea id="vorsatz" class="text" placeholder="Wenn … dann …">${esc(S.wennDann || "")}</textarea>`, fuss: `<button class="knopf haupt voll" data-act="rueckblick-fertig">${ic("haken")} Fertig</button>` });
}

/* ---------- Missionen ---------- */
function missionenSheet() {
  const tf = S.tf[heute()] || "B";
  const ms = (D.missionen || []).filter(m => !S.missionen.aktiv.some(a => a.id === m.id));
  sheet({ titel: "Kleine Vorhaben", inhalt: `<p class="klein">Ein Vorhaben für ein paar Tage. Pausen sind erlaubt, es läuft nichts ab.</p><div class="liste">${ms.map(m => zeileBtn("funke", m.titel, `${m.tage} Tage · ${m.text}`, `data-act="mission-wahl" data-id="${m.id}"`, "k-mut")).join("")}</div>` });
}
function missionSheet(id) {
  const m = (D.missionen || []).find(x => x.id === id); if (!m) return;
  const a = S.missionen.aktiv.find(x => x.id === id);
  const tage = a ? a.tage || [] : [];
  const heuteSchon = tage.includes(heute());
  const darfFertig = a && tage.length >= Math.ceil(m.tage / 2);
  sheet({ titel: m.titel, inhalt: `<p>${esc(m.text)}</p><div class="bogen mulde"><p style="margin:0"><span style="font-weight:700">Wenn-dann:</span> ${esc(m.wennDann || "")}</p></div>
    ${a ? `<p style="margin-top:12px">${tage.length} von ${m.tage} Tagen.</p><div class="zeile" style="flex-wrap:wrap;gap:6px" aria-hidden="true">${Array.from({ length: m.tage }, (_, i) => `<span style="width:26px;height:26px;border-radius:6px;background:${i < tage.length ? "var(--mut)" : "var(--mulde)"}"></span>`).join("")}</div>` : ""}`,
    fuss: a ? `<div class="stapel"><button class="knopf haupt voll" data-act="mission-heute" data-id="${id}" ${heuteSchon ? "disabled" : ""}>${heuteSchon ? "Heute schon gemacht" : "Heute gemacht"}</button>${darfFertig ? `<button class="knopf zweit voll" data-act="mission-fertig" data-id="${id}">Vorhaben abschließen</button>` : ""}<button class="knopf leise" data-act="mission-pause" data-id="${id}">Zur Seite legen</button></div>`
      : `<button class="knopf haupt voll" data-act="mission-start" data-id="${id}">Vorhaben beginnen</button>` });
}

/* Spotify: Max' Duo-Angebot */
function spotifyInfoSheet() {
  sheet({ titel: "Musik ohne Ende?", id: "spotify", inhalt: `<div class="zeile" style="gap:12px;align-items:flex-start">${maxSVG(54)}<p style="margin:0">Max sagt: „Ich hab Spotify gerade allein. Für 8 Euro im Monat könnte ich dich in ein Duo-Abo mitnehmen – dann hörst du so viel Musik, Hörbücher-Häppchen und Podcasts, wie du willst. Werbefrei, auch ohne Internet, wenn du vorher was runterlädst.“</p></div>
    <h3 style="margin-top:16px">Was das in Ritas App bringt</h3><ul><li>Bei Musik- und Hörtipps gibt’s dann einen Knopf „In Spotify öffnen“ – ein Tipp, und es läuft.</li><li>Vivaldi, Krimi-Hörspiele, Podcasts über Geschichte oder Schweden: alles an einem Ort.</li><li>Eigene Listen anlegen, zum Beispiel „Sonntagsmusik“ oder „Für Karin“.</li></ul>
    <h3 style="margin-top:16px">So geht’s</h3><ol class="idee-schritte"><li>Max Bescheid sagen – er schickt dir einen Einladungslink.</li><li>Spotify aus dem Play Store laden.</li><li>Den Link von Max antippen und mit deiner E-Mail-Adresse ein Konto anlegen.</li><li>Hier in den Einstellungen „Ich habe Spotify“ einschalten.</li></ol>
    <div class="stapel" style="margin-top:12px"><a class="knopf zweit voll" href="https://play.google.com/store/apps/details?id=com.spotify.music" target="_blank" rel="noopener">Spotify im Play Store ansehen ↗</a><button class="knopf leise" data-act="spotify-an-info">Hab ich schon – einschalten</button></div>
    <p class="klein">Ohne Spotify geht natürlich alles weiter über YouTube und ARD Sounds – kostenlos.</p>` });
}

/* Lesebegleiter: siehe buecher.js */

/* ---------- Infos: Angebote, Praktisch, Runden ---------- */
function infoListe(titel, arr, felder) {
  sheet({ titel, inhalt: (arr || []).map(x => `<div class="bogen"><h3>${esc(x.name || x.titel)}</h3>${felder.map(f => x[f] ? `<p style="margin:0 0 4px">${esc(x[f])}</p>` : "").join("")}${x.tel ? `<p style="margin:0 0 4px"><a href="tel:${esc(x.tel.replace(/[^\d+]/g, ""))}">${esc(x.tel)}</a></p>` : ""}${x.quelle ? `<p class="klein"><a href="${esc(x.quelle)}" target="_blank" rel="noopener">Quelle</a></p>` : ""}</div>`).join("") || "<p>Noch keine Einträge.</p>" });
}

/* ---------- Einstellungen ---------- */
function einstellungenSheet() { sheet({ titel: "Einstellungen", inhalt: einstellungenInhalt(), id: "einst" }); }
let EINST_OFFEN = new Set(["aussehen"]);
function einstGruppe(id, icon, titel, unter, inhalt) {
  return `<details class="einst-gruppe" data-einst-gruppe="${id}" ${EINST_OFFEN.has(id) ? "open" : ""}><summary>${ic(icon)}<span class="text"><span class="titel">${titel}</span><br><span class="unter">${unter}</span></span>${ic("pfeil", "pfeil")}</summary><div class="einst-inhalt">${inhalt}</div></details>`;
}
function einstellungenInhalt() {
  return einstGruppe("aussehen", "schrift", "Schrift und Farben", "Schriftgröße, hell oder dunkel",
      `<h3>Schriftgröße</h3><div class="chips">${[[1, "Normal"], [2, "Groß"], [3, "Sehr groß"]].map(([v, l]) => chip(S.size === v, l, `data-act="einst" data-k="size" data-v="${v}"`)).join("")}</div>
      <p class="klein" style="margin-top:6px">So sieht dein Text aus. Heute bin ich 4 km gegangen.</p>
      <h3 style="margin-top:16px">Hell oder dunkel</h3><div class="chips">${[["auto", "Wie das Handy"], ["light", "Hell"], ["dark", "Dunkel"]].map(([v, l]) => chip(S.theme === v, l, `data-act="einst" data-k="theme" data-v="${v}"`)).join("")}</div>`)
    + einstGruppe("name", "hand", "Name und Anrede", `${esc(S.name)} · ${S.anrede === "sie" ? "Sie" : "Du"}`,
      `<label class="feld" for="e-name">Name</label><input id="e-name" class="text" data-einst="name" value="${esc(S.name)}">
      <div class="chips" style="margin-top:10px">${chip(S.anrede === "du", "Du", `data-act="einst" data-k="anrede" data-v="du"`)}${chip(S.anrede === "sie", "Sie", `data-act="einst" data-k="anrede" data-v="sie"`)}</div>`)
    + einstGruppe("huhn", "geschenk", "Hühnchen und Überraschungen", "Wer spricht und wie oft",
      `${schalter(S.huhn, "Hühnchen zeigen und sprechen lassen", `data-act="einst-um" data-k="huhn"`)}
      ${schalter(!S.eierAus, "Kleine Überraschungen", `data-act="eier-um"`, "Ab und zu melden sich Max, Hühnchen oder Christiane")}`)
    + einstGruppe("rueck", "glocke", "Ton, Vibration, Bewegung", "Rückmeldung beim Tippen",
      `${IOS ? "" : schalter(S.vib, "Vibration", `data-act="einst-um" data-k="vib"`)}
      ${schalter(S.ton, "Leiser Ton beim Eintragen", `data-act="einst-um" data-k="ton"`)}
      ${schalter(S.motion === "ruhig", "Bewegung reduzieren", `data-act="einst-motion"`, "Keine Animationen")}`)
    + einstGruppe("kacheln", "heute", "Kacheln auf „Heute“", S.schnell.map(id => tat(id).kurz).join(", "),
      `<p class="klein" style="margin-top:0">Vier Tätigkeiten, die auf „Heute“ unter „Eintragen“ stehen. Sie werden nicht automatisch umsortiert.</p>
    ${[0, 1, 2, 3].map(i => `<label class="feld">Kachel ${i + 1}</label><div class="chips">${["gehen", "lesen", "telefon", "tagebuch", "handarbeit", "tanzstunde", "hoerbuch", "besuch", "ruhe", "gymnastik", "brief", "musik", ...(S.eigeneT || []).filter(x => !x.weg).map(x => x.id)].map(id => chip(S.schnell[i] === id, tat(id).kurz, `data-act="schnell" data-i="${i}" data-v="${id}"`)).join("")}</div>`).join("")}`)
    + einstGruppe("menschen", "herz", "Herzensmenschen", `${S.menschen.length} in der Auswahl`,
      `<div class="liste">${S.menschen.map((m, i) => `<div class="liste-zeile mensch-zeile" style="cursor:default">${personFest(m) ? `<span class="mensch-bild">${personBild(m, 52)}</span>` : `<button class="mensch-bild av-knopf" data-act="av-auf" data-id="${esc(m.id)}" aria-label="Gesicht für ${esc(m.name)} aussuchen">${personBild(m, 52)}</button>`}<span class="text"><span class="titel">${esc(m.name)}</span>${m.rolle ? `<br><span class="unter">${esc(m.rolle)}</span>` : ""}</span><span class="mensch-knoepfe${personFest(m) ? " nur-weg" : ""}">${personFest(m) ? "" : `<button class="knopf klein zweit" data-act="av-auf" data-id="${esc(m.id)}">Gesicht</button>`}<button class="knopf klein leise" data-act="mensch-weg" data-i="${i}" aria-label="${esc(m.name)} entfernen">Entfernen</button></span></div>`).join("")}</div>
      <div class="zeile" style="margin-top:10px"><input id="neu-mensch" class="text" maxlength="30" enterkeyhint="done" placeholder="Name" aria-label="Neuer Herzensmensch"><button class="knopf zweit" data-act="mensch-neu">Dazu</button></div>`)
    + einstGruppe("spiel", "karten", "Waldpatience", S.spiel.an ? `${S.spiel.limitNeu ?? S.spiel.limit} Runden à 10 Minuten pro Tag` : "ausgeblendet",
      `${schalter(S.spiel.an, "Spiel anzeigen", `data-act="spiel-an"`)}
      ${S.spiel.an ? `<label class="feld">Runden pro Tag (je 10 Minuten)</label><div class="chips">${[0, 1, 2, 3, 4, 5, 6].map(n => chip((S.spiel.limitNeu ?? S.spiel.limit) === n, String(n), `data-act="spiel-limit" data-v="${n}" aria-label="${n} Runden pro Tag"`)).join("")}</div><p class="klein">${S.spiel.limitNeu != null && S.spiel.limitNeu !== S.spiel.limit ? "Gilt ab morgen." : "Änderungen gelten ab dem nächsten Tag."}</p>` : ""}`)
    + einstGruppe("musik", "kopfhoerer", "Musik und Podcasts", S.spotify ? "Mit Spotify" : "Über YouTube und ARD Sounds",
      `${schalter(!!S.spotify, "Ich habe Spotify", `data-act="spotify-an"`, "Dann gibt es bei Musik- und Hörtipps zusätzlich einen Spotify-Knopf.")}${S.spotify ? "" : `<button class="knopf klein leise" data-act="spotify-info">Was hätte ich davon?</button>`}`)
    + einstGruppe("hilfe", "frage", "Hilfe und Infos", "So funktioniert’s, aufs Handy legen, Wunsch an Max",
      `<div class="liste">${zeileBtn("frage", "So funktioniert’s", "Liste, Bild, Taler – kurz erklärt", `data-act="erklaerung"`)}
      ${zeileBtn("handy", "App aufs Handy legen", "Anleitung mit Bildern", `data-act="install"`)}
      ${zeileBtn("info", "Über die App", "Von Max, für Rita", `data-act="ueber"`)}
      ${zeileBtn("stift", "Wunsch oder Kritik an Max", "Per WhatsApp – ein Satz reicht", `data-act="wunsch-auf"`)}</div>`)
    + `<div class="ersteller"><span class="fig-idle">${maxSVG(48)}</span><p>Ausgedacht und gebaut von <b>Carlo Maximilian Engeländer</b> – für seine tolle Patentante Rita.<br><span class="klein">Idee und Konzept: Carlo Maximilian Engeländer, umgesetzt mit Unterstützung von Claude (KI). © 2026</span></p></div>`
    + einstGruppe("daten", "kiste", "Daten und Neustart", "Sicherung und Technik",
      `<div class="liste">${zeileBtn("werkzeug", "Technik & Sicherung", "Für Max: Sicherung, Wiederherstellen, Geburtstag, Zurücksetzen", `data-act="helfer"`)}</div>`)
    + `<p class="klein" style="margin-top:16px">Version ${esc(BUILD)}</p>`;
}
function helferSheet() { sheet({ titel: "Technik & Sicherung", inhalt: helferInhalt(), id: "helfer" }); }
function helferInhalt() {
  return `<p>Hier geht es um die Daten. Alles liegt nur auf diesem Handy.</p>
  <div class="bogen"><h3>Ritas Geburtstag</h3><p class="klein">Für eine kleine Überraschung am Tag selbst.</p><input class="text" type="text" inputmode="numeric" placeholder="TT.MM., z. B. 14.03." value="${S.geburtstag ? S.geburtstag.split("-").reverse().join(".") + "." : ""}" data-geburtstag="1" aria-label="Geburtstag als Tag und Monat"></div>
  <div class="bogen"><h3>Sicherung</h3><p class="klein">${S.letzteSicherung ? `Zuletzt gesichert: ${datumLang(S.letzteSicherung)}.` : "Noch nie gesichert."} Am besten einmal im Monat.</p>
    <div class="stapel">${/github\.io$/.test(location.hostname) || location.protocol === "file:" ? `<button class="knopf zweit voll" data-act="sichern-datei">Sicherung speichern</button>` : ""}<button class="knopf zweit voll" data-act="sichern-kopie">Sicherung kopieren</button></div></div>
  <div class="bogen"><h3>Sicherung einspielen</h3><p class="klein">Ersetzt alles auf diesem Handy. Vorher wird automatisch eine Kopie angeboten.</p>
    <textarea id="import-text" class="text" placeholder="Kopierte Sicherung hier einfügen"></textarea><div class="stapel" style="margin-top:10px"><button class="knopf zweit voll" data-act="einspielen-text">Eingefügte Sicherung prüfen</button><label class="knopf zweit voll" style="cursor:pointer">Datei auswählen<input type="file" accept="application/json,.json,.txt" data-act-file="import" class="sr"></label></div></div>
  <div class="bogen"><h3>Zuletzt gelöscht</h3>${S.geloescht.length ? S.geloescht.slice().reverse().map(e => `<div class="eintrag">${ic(iconVon(e))}<div class="text"><div>${esc(eintragText(e))}</div><div class="klein">${datumLang(e.tag)}</div><div class="aktionen"><button class="knopf klein zweit" data-act="wiederher" data-id="${e.id}">Wiederherstellen</button></div></div></div>`).join("") : `<p class="klein">Nichts. Gelöschtes bleibt hier 30 Tage.</p>`}</div>
  <div class="bogen"><h3>Spiel</h3>${schalter(S.spiel.frei, "Spiel ohne Zeitgrenze", `data-act="spiel-frei"`, `Nur, wenn ${esc(S.name)} das selbst so möchte.`)}</div>
  <div class="bogen"><h3>Alles zurücksetzen</h3><p class="klein">Löscht alle Einträge und das Bild auf diesem Handy.</p><button class="knopf klein rand warn" data-act="reset-1">Alles löschen …</button></div>`;
}
function ueberSheet() { sheet({ titel: "Über die App", inhalt: D.ueber.map(p => `<p>${telLinks(esc(p))}</p>`).join("") + `<p class="klein">Wie stark etwas im Bild wächst, ist eine Schätzung von Max, keine Messung. Ortsangaben können sich ändern – vor dem Losfahren kurz prüfen.</p>` }); }

/* ---------- Aufs Handy legen ---------- */
function istInstalliert() { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; }
function installSheet(andere) {
  const ios = andere ? !IOS : IOS;
  const schritte = ios ? [
    ["Öffne diese Seite in Safari (der blaue Kompass).", "kompass"], ["Tippe unten auf die drei Punkte oder direkt auf „Teilen“ (Quadrat mit Pfeil).", "teilen"],
    ["Schiebe die Liste nach oben und tippe auf „Zum Home-Bildschirm“.", "liste"], ["Tippe oben rechts auf „Hinzufügen“.", "fertig"]
  ] : [
    ["Öffne diese Seite in Chrome.", "kompass"], ["Tippe oben rechts auf die drei Punkte ⋮.", "punkte"],
    ["Tippe auf „Zum Startbildschirm hinzufügen“ oder „App installieren“.", "liste"], ["Tippe auf „Installieren“ bzw. „Hinzufügen“.", "fertig"]
  ];
  sheet({ titel: "App aufs Handy legen", inhalt: `${window._installPrompt && !ios ? `<button class="knopf haupt voll" data-act="install-direkt">Jetzt installieren</button><p class="klein" style="margin-top:8px">Oder Schritt für Schritt:</p>` : ""}` + schritte.map(([t, b], i) => `<div class="bogen"><div class="zeile" style="align-items:flex-start"><span class="serif" style="font-size:2rem;line-height:1;color:var(--moos);min-width:32px">${i + 1}</span><div style="flex:1">${handySkizze(b, ios)}<p style="margin:0">${esc(t)}</p></div></div></div>`).join("") +
    `<div class="bogen mulde"><p class="klein" style="margin:0"><span style="font-weight:700">Für Helfer:</span> Auf dem iPhone haben Browser und Startbildschirm-App getrennte Daten. Am besten gleich nach dem Einrichten hinzufügen – oder vorher sichern und danach einspielen.</p></div>
    <button class="knopf leise" data-act="install-andere">Ich habe ein ${ios ? "Android-Handy" : "iPhone"}</button>` });
}
function handySkizze(art, ios) {
  const markiere = { kompass: [50, 140], teilen: [50, 150], punkte: [82, 22], liste: [50, 92], fertig: [80, 22] }[art];
  return `<svg class="schritt-bild" viewBox="0 0 100 170" aria-hidden="true"><rect x="6" y="2" width="88" height="166" rx="12" fill="var(--bogen)" stroke="var(--tinte-2)" stroke-width="2"/>
    <rect x="14" y="14" width="72" height="14" rx="4" fill="var(--mulde)"/><rect x="14" y="36" width="72" height="44" rx="4" fill="var(--mulde)"/>${art === "liste" ? `<rect x="14" y="84" width="72" height="16" rx="4" fill="var(--moos)" opacity=".85"/>` : `<rect x="14" y="86" width="50" height="6" rx="3" fill="var(--mulde-2)"/>`}
    <rect x="14" y="104" width="62" height="6" rx="3" fill="var(--mulde-2)"/><rect x="14" y="116" width="40" height="6" rx="3" fill="var(--mulde-2)"/>
    ${ios ? `<rect x="14" y="140" width="72" height="18" rx="9" fill="var(--mulde)"/>` : `<circle cx="82" cy="21" r="2" fill="var(--tinte-2)"/><circle cx="82" cy="26" r="0"/>`}
    <circle cx="${markiere[0]}" cy="${markiere[1]}" r="11" fill="none" stroke="var(--ziegel)" stroke-width="3.5"/></svg>`;
}

/* ---------- Einrichtung (3 Schritte): Max erklärt, am Ende meldet sich Hühnchen ---------- */
let ONB = 1;
function onboardingSheet() {
  sheet({ titel: "Einrichten", inhalt: onboardingInhalt(), fuss: onboardingFuss(), voll: true, ohneZu: true, id: "onboard", onclose: () => { if (!S.onboard) onboardingFertig(true); } });
}
const maxZettel = (html) => `<div class="max-karte">${maxSVG(60)}<div class="bogen post brief" style="flex:1;min-width:0;margin:0">${html}</div></div>`;
function onboardingInhalt() {
  const kaestchen = `<div class="zeile" style="gap:6px;margin:0 0 14px" aria-label="Schritt ${ONB} von 3">${[1, 2, 3].map(i => `<span class="onb-punkt ${i <= ONB ? "an" : ""}"></span>`).join("")}</div>`;
  // Schritt 1: kurzer Brief, darunter gleich das Namensfeld (nicht hinter „Weiter“); der Rest zum Aufklappen
  if (ONB === 1) return kaestchen + `<div class="onb1"><div class="onb1-brief">` + maxZettel(`<p>Liebe ${esc(S.name)},</p><p>das ist deine App. Du schreibst auf, was ansteht, und trägst ein, was du gemacht hast. Davon wächst ein Bild von deinem Zuhause.</p><p style="margin:0">Zwei Sachen noch, dann geht’s los. Dein Max</p>`) + `</div>
    <div class="onb1-name"><label class="feld" for="o-name" style="margin-top:14px">So nennt dich die App</label><input id="o-name" class="text" data-einst="name" value="${esc(S.name)}" aria-describedby="o-name-h"><p class="klein onb-hinweis" id="o-name-h">Lieber „Sie“? Geht später in den Einstellungen.</p></div>
    <details class="onb-mehr"><summary>Was es sonst noch gibt</summary><p>Dazu gibt’s Ideen, ein Telefon zum Plaudern, Post aus Småland, dein Tagebuch und ab und zu Besuch. Im Bild funkelt’s manchmal – antippen bringt Taler, und im Kleiderschrank ziehst du dir und Hühnchen damit was Verrücktes an.</p></details></div>`;
  if (ONB === 2) return kaestchen + maxZettel(`<p style="margin:0">Kannst du das gut lesen? Tippe die Größe an, die du bequem lesen kannst.</p>`) +
    `<div class="liste" style="margin-top:14px">${[[1, "Normal", 18], [2, "Groß", 21], [3, "Sehr groß", 27]].map(([v, l, px]) => `<button class="liste-zeile" data-act="einst" data-k="size" data-v="${v}" aria-pressed="${S.size === v}">${ic(S.size === v ? "boxhaken" : "box")}<span class="text"><span class="titel">${l}</span><br><span style="font-size:${px}px">Heute 3 km gegangen.</span></span></button>`).join("")}</div>
    <h3 style="margin-top:20px">Hell oder dunkel?</h3><div class="chips">${[["auto", "Wie das Handy"], ["light", "Hell"], ["dark", "Dunkel"]].map(([v, l]) => chip(S.theme === v, l, `data-act="einst" data-k="theme" data-v="${v}"`)).join("")}</div>`;
  return kaestchen + maxZettel(`<p>So funktioniert’s, in drei Schritten:</p>
      <div class="liste onb-haken">${["Morgens tippst du an, wie viel Energie du hast. Danach richten sich die Ideen.", "Was ansteht, kommt auf deine Liste. Erledigt? Einmal antippen.", "Was du gemacht hast – spazieren, lesen, telefonieren, Tagebuch –, trägst du mit einem Fingertipp ein. Und dein Bild wächst mit."].map((t, i) => `<div class="eintrag" style="--i:${i}"><span class="onb-nr">${i + 1}</span><span class="text">${t}</span></div>`).join("")}</div>
      <p style="margin:10px 0 0" class="klein">Falls was klemmt: Ruf mich an. Oder schimpf mit Hühnchen.</p>`);
}
function onboardingFuss() { return `<div class="stapel"><button class="knopf haupt voll" data-act="onb-weiter">${ONB < 3 ? "Weiter" : "Los geht’s"}</button>${ONB > 1 ? `<button class="knopf leise" data-act="onb-zurueck">Zurück</button>` : ""}</div>`; }
function onboardingFertig(still) {
  S.onboard = true; S.liste = S.liste || []; if (!S.eintraege.length) S.start = heute();
  if (!S.liste.some(x => x.id === "l-start")) { const r = eintragSpeichern({ t: "abgehakt", tag: heute(), notiz: "App eingerichtet", listeId: "l-start" }); S.liste.push({ id: "l-start", text: "App eingerichtet", erledigt: heute(), eintrag: r && r.e.id }); }
  speichern(); if (!still) sheetZu(); render();
  if (!still && !REDUCED()) setTimeout(() => { const wm = $(".wm-haken"); if (wm) wm.classList.add("zeichnen"); }, 350);
}

/* Figuren in kleine Leinwände malen (UI) */
function figurenMalen() {
  requestAnimationFrame(() => $$("canvas.figur-bild").forEach(c => {
    const wer = c.dataset.wer.split(","), dpr = Math.min(devicePixelRatio || 1, 3), w = c.clientWidth, h = c.clientHeight; if (!w) return;
    c.width = w * dpr; c.height = h * dpr;
    const ctx = c.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const sk = h / 92;
    LICHT = { sx: 1, sy: 1, nacht: 0, gold: 0 };
    wer.forEach((x, i) => x === "huhn" ? huehnchenZeichnen(ctx, w / 2 + (i - (wer.length - 1) / 2) * 34 * sk, h - 6, sk * (wer.length > 1 ? .5 : .9)) : figur(ctx, w / 2 + (i - (wer.length - 1) / 2) * 34 * sk, h - 8, sk, x));
  }));
}

/* ---------- Hühnchen spricht ---------- */
function huehnchenSatz() {
  const h = heute(), d = jetzt(), std = d.getHours(), mon = d.getMonth() + 1;
  if (S.huhnSagt && S.huhnSagt.tag === h && S.huhnSagt.text) return S.huhnSagt.text;
  const wann = std < 11 ? "morgens" : std < 17 ? "mittags" : "abends";
  const zuletzt = S.huhnZuletzt || [];
  let pool = (D.huehnchenSaetze || []).filter(x => (!x.wann || x.wann === "immer" || x.wann === wann) && (!x.monate || x.monate.includes(mon)));
  const frisch = pool.filter(x => !zuletzt.includes(x.text)); if (frisch.length) pool = frisch;
  const x = pool.length ? pool[hash32(S.seed + h + wann) % pool.length] : { text: "Ich bin da. Was steht heute auf der Liste?" };
  if (!zuletzt.includes(x.text)) { S.huhnZuletzt = [x.text, ...zuletzt].slice(0, 25); S.huhnSagt = { tag: h, text: x.text }; speichern(); }
  return x.text;
}
function huehnchenReagiert(ort) {
  const r = (D.huehnchenReaktionen || {})[ort]; if (!r || !r.length) return "";
  const t = r[Math.floor(Math.random() * r.length)];
  S.huhnSagt = { tag: heute(), text: t }; speichern(); return t;
}
/* Post von Max: etwa jeden vierten Tag, immer derselbe Satz an diesem Tag */
function maxPost() {
  const h = heute(); if (!(D.maxSaetze || []).length) return "";
  if (typeof mbStill === "function" && mbStill()) return ""; // an Brief- und Geburtstagstagen kommt der lange Brief (maxbriefe.js)
  if (h === S.start) return "Erster Tag! Schreib einfach auf, was ansteht, und hak ab, was erledigt ist. Den Rest erzähl ich dir nach und nach.";
  if (tagDatum(h).getDay() === 0) { const z = wochenZahlen(h); if (z.length) { const schluss = ["Hut ab. Ich hab zwar keinen, aber trotzdem.", "Nicht schlecht für eine Woche. Ehrlich nicht.", "Erzähl mir beim nächsten Telefonat den besten Moment davon.", "Und jetzt: Sonntag. Füße hoch."][hash32("ws" + h) % 4]; return `Sonntagspost! Deine Woche in Kürze: ${z.join(", ")}. ${schluss}`; } }
  if (hash32("post" + S.seed + h) % 4 !== 0) return "";
  return D.maxSaetze[hash32("postsatz" + h) % D.maxSaetze.length];
}

function erklaerungSheet() {
  sheet({ titel: "So funktioniert’s", inhalt: `${maxZettel(`<p style="margin:0">Kurz gesagt: Du trägst ein, was du gemacht hast, und hakst ab, was auf deiner Liste stand. Beides wächst im Bild und bringt Taler. Der Rest hier ist zum Nachschlagen.</p>`)}
    <div class="bogen" style="margin-top:14px"><h3>Eintragen und Abhaken</h3><p style="margin:0 0 8px"><span style="font-weight:700">Eintragen</span> heißt: festhalten, was du gemacht hast – spaziert, gelesen, telefoniert. Mit den Kacheln auf „Heute“ oder mit „Etwas anderes eintragen“.</p><p style="margin:0">Auf deiner <span style="font-weight:700">To-do-Liste</span> steht, was du vorhast. Ist es erledigt, tippst du drauf: abgehakt. Die Striche zählen alles, was du diese Woche geschafft hast.</p></div>
    <div class="bogen"><h3>Das Bild</h3><p style="margin:0">Alles, was du einträgst, wächst im Bild an seinem Platz: Gehen wird zum Weg, Lesen zur Eiche, Zeit mit anderen zu Blumen an den Häusern, Ruhe zur Quelle, Ausflüge zu Orten am Horizont. Nichts verschwindet wieder.</p><p style="margin:8px 0 0">Manche Einträge fragen zusätzlich: <span style="font-weight:700">Draußen gemacht?</span> – frische Luft zählt etwas mehr. <span style="font-weight:700">Hat Mut gebraucht?</span> – dann leuchtet ein Glühwürmchen mehr im Wald.</p></div>
    <div class="bogen"><h3>Stufen</h3><p style="margin:0">Mit der Zeit kommen neue Dinge dazu: eine Bank, ein Steg, eine Lichterkette, ein Hochsitz … Was als Nächstes kommt, steht unter „Zuhause“.</p></div>
    <div class="bogen"><h3>Taler</h3><p style="margin:0">Für jeden Eintrag gibt es ein paar Taler. Damit kannst du im Kramladen einkaufen: Gedichte, Rezepte, den Tanz-Taktgeber, Schönes fürs Bild, Outfits im Kleiderschrank. Taler verfallen nie.</p></div>
    <div class="bogen"><h3>Der Stern ✱</h3><p style="margin:0">Ein Stern heißt: ruhiger Tag – und trotzdem was geschafft. Er ist nur am selben Tag zu sehen.</p></div>
    <div class="bogen"><h3>Patience</h3><p style="margin:0">Eine Runde dauert 10 Minuten und kostet 10 Taler. An ruhigen Tagen ist das Spiel kostenlos.</p></div>
    <div class="bogen"><h3>Hühnchen</h3><p style="margin:0">Hühnchen fragt morgens nach deiner Energie, sagt ab und zu was dazu und steht im Bild immer da, wo du zuletzt etwas getan hast. Wenn’s nervt: oben rechts aufs Zahnrad, unter „Hühnchen und Überraschungen“ „Hühnchen zeigen und sprechen lassen“ ausschalten.</p></div>
    <div class="bogen"><h3>Notfallplan</h3><p style="margin:0">Unter „Ideen“ und bei „Ablenkung?“ liegt dein Notfallplan: für Momente mit Unruhe, Anspannung und dergleichen. Was drinsteht, bestimmst du. Ab und zu üben, dann sitzt er.</p></div>` });
}

/* ---------- Meine Liste (Ritas eigene Abhak-Liste) ---------- */
let LISTE_EDIT = false;
function listeHTML() {
  const L = S.liste || [], h = heute();
  const offen = L.filter(x => !x.erledigt), heuteFertig = L.filter(x => x.erledigt === h);
  return `<section class="abschnitt"><div class="zeile zwischen"><h2 style="margin:0">Meine To-do-Liste</h2><button class="knopf klein leise frage-knopf" data-act="liste-hilfe" aria-label="Wofür ist die To-do-Liste?">${ic("frage")}</button></div>${(() => { const n = hakenDieseWoche(); return n ? `<div class="klein zeile" style="gap:10px;margin-top:6px;flex-wrap:wrap" aria-label="Diese Woche: ${n} Sachen geschafft">${strichHTML(n)}<span>Diese Woche: ${n} ${n === 1 ? "Sache" : "Sachen"} geschafft</span></div>` : ""; })()}
    <div class="liste" style="margin-top:10px">${LISTE_EDIT ? offen.map(x => `<div class="zeile liste-edit"><input class="text" data-liste-text="${x.id}" value="${esc(x.text)}" aria-label="Punkt umbenennen"><button class="knopf zweit" data-act="liste-weg" data-id="${x.id}" aria-label="${esc(x.text)} löschen">${ic("schliessen")}</button></div>`).join("") : offen.map(x => `<button class="liste-zeile" data-act="liste-hak" data-id="${x.id}" aria-pressed="false" aria-label="${esc(x.text)} – offen, antippen zum Abhaken">${ic("box")}<span class="text"><span class="titel">${esc(x.text)}</span></span></button>`).join("")}
    ${heuteFertig.map(x => `<button class="liste-zeile" data-act="liste-zurueck" data-id="${x.id}" style="opacity:.75" aria-pressed="true" aria-label="${esc(x.text)} – abgehakt, antippen zum Zurücknehmen">${ic("boxhaken")}<span class="text"><span class="titel" style="text-decoration:line-through">${esc(x.text)}</span></span></button>`).join("")}</div>
    ${offen.length ? `<button class="knopf klein leise" data-act="liste-edit" style="margin-top:4px">${LISTE_EDIT ? "Fertig" : "Liste bearbeiten"}</button>` : ""}<div class="zeile" style="margin-top:10px"><input id="liste-neu" class="text" placeholder="Was steht an?" aria-label="Neuer Punkt für die To-do-Liste" style="min-height:56px"><button class="knopf zweit" data-act="liste-neu" aria-label="Auf die Liste setzen">${ic("plus")}</button></div></section>`;
}

/* ---------- Hühnchen stellt die Tagesfrage ---------- */
function tfFrageSatz() {
  if (heute() === S.start) return `Tach, ${esc(S.name)}! Hühnchen hier.`;
  const std = jetzt().getHours();
  if (std >= 21 || std < 4) return [`Noch wach, ${esc(S.name)}?`, "Psst, ich bin’s.", "Na, du Nachteule?"][hash32("tfn" + S.seed + heute()) % 3];
  if (std >= 17) return [`Guten Abend, ${esc(S.name)}!`, "Na?", "Kurze Frage zum Abend:"][hash32("tfa" + S.seed + heute()) % 3];
  const v = [`Tach, ${esc(S.name)}!`, "Na?", "Kurze Frage:", `Moin, ${esc(S.name)}!`];
  return v[hash32("tf" + S.seed + heute()) % v.length];
}

/* Umschlag für „Post von Max“ (Briefmarke mit Max) */
function umschlagSVG(von = "Max") {
  const mon = ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"][jetzt().getMonth()], tag = jetzt().getDate(), jahr = String(jetzt().getFullYear()).slice(2);
  const ort = /max/i.test(von) ? "HALLE (SAALE)" : /christiane|jane|micha/i.test(von) ? "BERLIN" : "SPANDAU";
  const absOrt = /max/i.test(von) ? "06108 Halle (Saale)" : /christiane|jane|micha/i.test(von) ? "Binger Straße, Berlin" : "Fensterbrett, Spandauer Forst";
  const stempel = (x, y, r, dreh, deckung) => `<g transform="translate(${x} ${y}) rotate(${dreh})" opacity="${deckung}" fill="none" stroke="#5A3A5E" stroke-width="1.4" stroke-dasharray="14 1.6 6 1.2">
      <circle r="${r}"/><circle r="${r - 4.5}" stroke-width=".7" stroke-dasharray="9 1.4"/>
      <path id="pm${x}" d="M${-r + 6} 0 A${r - 6} ${r - 6} 0 0 1 ${r - 6} 0" stroke="none"/>
      <text font-family="Familjen Grotesk, sans-serif" font-size="5" font-weight="800" fill="#5A3A5E" stroke="none" letter-spacing=".6"><textPath href="#pm${x}" startOffset="50%" text-anchor="middle">${ort}</textPath></text>
      <text y="5" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="6.4" font-weight="800" fill="#5A3A5E" stroke="none">${tag}.${mon}.${jahr}</text>
      <text y="12" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="4.6" font-weight="700" fill="#5A3A5E" stroke="none">12-14</text></g>`;
  return `<svg class="umschlag-bild" viewBox="0 0 300 150" aria-hidden="true">
    <rect x="3" y="3" width="294" height="144" rx="6" fill="var(--umschlag)" stroke="var(--umschlag-rand)" stroke-width="1.6"/>
    <text x="18" y="27" font-family="Literata, Georgia, serif" font-size="11.5" font-style="italic" fill="var(--tinte-2)">${esc(von)}</text>
    <text x="18" y="40" font-family="Literata, Georgia, serif" font-size="9" font-style="italic" fill="var(--tinte-2)" opacity=".85">${esc(absOrt)}</text>
    <g transform="translate(234 13) rotate(3)">
      <rect x="0" y="0" width="52" height="62" rx="2" fill="#FFFDF5" stroke="#FFFDF5" stroke-width="6" stroke-dasharray="3 3"/>
      <rect x="4" y="4" width="44" height="54" fill="#CFE3DA"/>
      <svg x="4" y="10" width="44" height="48" viewBox="8 2 92 98">${huhnSVG({ gr: 10 }).replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}${markenWitz()}</svg>
      <text x="26" y="11" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="6.5" font-weight="800" fill="#1F4A34">1 KUSS</text>
    </g>
    <g opacity=".62" fill="none" stroke="#5A3A5E" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="22 2 9 1.5">
      <path d="M178 34 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0"/><path d="M178 43 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0"/><path d="M178 52 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0"/><path d="M178 61 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0"/>
    </g>
    ${stempel(226, 62, 21, -12, .78)}${stempel(206, 30, 17, 9, .32)}
    <text x="70" y="104" font-family="Literata, Georgia, serif" font-size="19" font-style="italic" fill="var(--tinte)">An ${esc(S.name)}</text>
    <text x="70" y="126" font-family="Literata, Georgia, serif" font-size="13" font-style="italic" fill="var(--tinte-2)">Am Spandauer Forst, Berlin</text>
    <path d="M70 110 H230 M70 132 H210" stroke="var(--umschlag-rand)" stroke-width="1" opacity=".6"/>
  </svg>`;
}


/* Termine: nächstes Datum ab heute, vergangene ausblenden */
function angebotDaten(a) {
  const w = String(a.wann || ""), out = [], H = tagDatum(heute());
  // Termine ohne Jahr: liegt der Monat mehr als zwei Monate zurück, ist das nächste Jahr gemeint
  const push = (d, mo, y) => { mo = +mo; y = y ? +y : (mo < H.getMonth() + 1 - 2 ? H.getFullYear() + 1 : H.getFullYear()); if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) out.push(tagVon(new Date(y, mo - 1, +d, 12))); };
  for (const m of w.matchAll(/((?:\d{1,2}\.\/)*)(\d{1,2})\.(\d{1,2})\.(\d{4})?/g)) { push(m[2], m[3], m[4]); (m[1].match(/\d{1,2}/g) || []).forEach(d => push(d, m[3], m[4])); }
  const MON = ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"];
  for (const m of w.matchAll(/(\d{1,2})\.\s*(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)(?:\s+(\d{4}))?/gi)) push(m[1], MON.indexOf(m[2].toLowerCase()) + 1, m[3]);
  return out.sort();
}
function angebotRegel(a) { return /tags\b|tags |jeden|Absprache|wöchentlich|Di–Sa|Mo, Mi|erfragen|bis März/i.test(a.wann || ""); }
function angebotNaechstes(a) { if (/Ausstellung/.test(a.wann || "")) return ""; const h = heute(); return angebotDaten(a).find(d => d >= h) || ""; }
function angebotVorbei(a) { const d = angebotDaten(a); return !angebotRegel(a) && d.length > 0 && d[d.length - 1] < heute(); }
function angebotWann(a) { const d = angebotNaechstes(a); if (!d) return ""; const dt = tagDatum(d), uhr = /(\d{1,2}:\d{2})/.exec(String(a.wann || "")); return `${["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][dt.getDay()]} ${dt.getDate()}.${dt.getMonth() + 1}.${uhr ? ", " + uhr[1] + " Uhr" : ""}`; }
function angebotKurz(a) {
  let n = a.name.replace(/[„“"]/g, "").split(" – ")[0].trim(); if (n.length > 48) n = n.slice(0, 46).replace(/\s+\S*$/, "") + " …"; // am Wortende kürzen
  const d = angebotNaechstes(a); if (!d) return n;
  const dt = tagDatum(d), uhr = /(\d{1,2}:\d{2})/.exec(a.wann || "");
  return `${n} · ${["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][dt.getDay()]} ${dt.getDate()}.${dt.getMonth() + 1}.${uhr ? ", " + uhr[1] : ""}`;
}

/* ---------- Angebote in Spandau, nach Art sortiert, mit „Auf meine Liste“ ---------- */
let ANG_KAT = "";
function angeboteSheet() { sheet({ titel: "Angebote in Spandau", inhalt: angeboteInhalt(), id: "angebote" }); }
function angeboteInhalt() {
  const passt = a => !angebotVorbei(a) && !(S.angLuft !== false && a.luft === "drinnen voll");
  const zahl = k => D.angebote.filter(a => (a.kategorie || "Kultur") === k && passt(a)).length;
  // Rubriken mit Treffern zuerst, leere ans Ende; Start-Rubrik ist die erste mit Treffern
  const alle = (D.angeboteKat || [...new Set(D.angebote.map(a => a.kategorie))]).filter(k => D.angebote.some(a => a.kategorie === k)).sort((x, y) => (zahl(y) > 0) - (zahl(x) > 0));
  if (!alle.includes(ANG_KAT)) ANG_KAT = alle[0];
  const kats = [ANG_KAT];
  const zeile = (k, v) => v ? `<p style="margin:0 0 4px"><span style="font-weight:700">${k}:</span> ${esc(v)}</p>` : "";
  const html = `<div class="chips" style="margin-bottom:6px">${alle.map(k => chip(k === ANG_KAT, `${k} · ${zahl(k)}`, `data-act="angebot-kat" data-v="${esc(k)}"`)).join("")}</div><label class="schalter-zeile" style="margin:4px 0 2px"><span>Nur draußen oder mit viel Platz</span><input type="checkbox" switch data-act="ang-luft" ${S.angLuft !== false ? "checked" : ""}></label><p class="klein">Stand: ${D.angeboteStand ? datumLang(D.angeboteStand).replace(/^[^,]*, /, "") : "Oktober 2026"}. Die Liste frischt sich jeden Sonntag von selbst auf. Termine und Preise vorher kurz nachfragen – angerufen ist schnell.</p>` + kats.map(k => {
    const h = heute(), arr = D.angebote.filter(a => (a.kategorie || "Kultur") === k && !angebotVorbei(a) && !(S.angLuft !== false && a.luft === "drinnen voll")).sort((x, y) => (angebotNaechstes(x) || "9") < (angebotNaechstes(y) || "9") ? -1 : 1); if (!arr.length) return `<p class="klein" style="margin-top:14px">Gerade nichts${S.angLuft !== false ? " mit viel Platz" : ""} in dieser Rubrik.${S.angLuft !== false ? " Schalter oben aus, dann siehst du alles." : ""}</p>`;
    return `<h3 style="margin-top:18px">${esc(k)}</h3>` + arr.map(a => {
      const auf = (S.liste || []).some(y => !y.erledigt && (y.angebot === a.id || y.text === angebotKurz(a)));
      return `<div class="bogen"><h3 style="font-size:1.05rem">${esc(a.name)}</h3>${a.luft ? `<span class="luft-marke luft-${a.luft === "draußen" ? "aussen" : a.luft === "weitläufig" ? "weit" : "voll"}">${a.luft === "draußen" ? "Draußen" : a.luft === "weitläufig" ? "Viel Platz" : "Eher voll"}</span>` : ""}${a.text ? `<p style="margin:0 0 8px">${esc(a.text)}</p>` : ""}${zeile("Wann", a.wann)}${zeile("Wo", a.wo)}${zeile("Kosten", a.kosten)}
        ${a.tel ? `<a class="knopf klein zweit" style="margin:6px 0 4px" href="tel:${esc(a.tel.replace(/[^\d+]/g, ""))}">${ic("telefon")} Anrufen: ${esc(a.tel)}</a>` : ""}
        ${a.pruefen ? `<p class="klein" style="margin:4px 0">Noch nicht ganz sicher – vorher nachfragen.</p>` : ""}
        <div class="zeile zwischen" style="margin-top:6px;flex-wrap:wrap">${auf ? `<p class="klein" style="margin:6px 0 0">${ic("haken")} Steht auf ${A("deiner", "Ihrer")} Liste.</p>` : `<button class="knopf klein zweit" data-act="angebot-liste" data-id="${a.id}">${ic("plus")} Auf meine Liste</button>`}${sicher(a.quelle) ? `<a class="knopf klein leise" style="min-height:44px" href="${sicher(a.quelle)}" target="_blank" rel="noopener">Quelle</a>` : ""}</div></div>`;
    }).join("");
  }).join("");
  return html;
}

/* ---------- Strichliste: Haken dieser Woche ---------- */
function hakenDieseWoche() {
  const kw = kwVon(heute());
  return S.eintraege.filter(e => kwVon(e.tag) === kw).length + (S.liste || []).filter(x => x.erledigt && kwVon(x.erledigt) === kw && !x.eintrag).length;
}
function strichHTML(n) {
  const fuenfer = Math.floor(n / 5), rest = n % 5, max = 8;
  const bund = `<svg viewBox="0 0 26 20" style="width:26px;height:20px" aria-hidden="true"><g stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 3v14M9 3v14M14 3v14M19 3v14"/><path d="M1 15L23 5"/></g></svg>`;
  const s = `<svg viewBox="0 0 ${rest * 5 + 2} 20" style="width:${rest * 5 + 2}px;height:20px" aria-hidden="true"><g stroke="currentColor" stroke-width="2.2" stroke-linecap="round">${Array.from({ length: rest }, (_, i) => `<path d="M${i * 5 + 3} 3v14"/>`).join("")}</g></svg>`;
  return `<span class="strich" style="display:inline-flex;gap:4px;align-items:center;flex-wrap:wrap">${bund.repeat(Math.min(fuenfer, max))}${fuenfer > max ? "…" : ""}${rest ? s : ""}</span>`;
}

function telLinks(html) { return html.replace(/(^|[^\d])(0800[ \d]{5,12}\d|0\d{2,4}[ \d/-]{5,12}\d|112|116 117)(?![\d])/g, (m, v, n) => `${v}<a href="tel:${n.replace(/[^\d]/g, "")}">${n}</a>`); }

/* ---------- Das Tschüss-Spiel (wie am Telefon mit Max): wer zuerst „Ich leg jetzt auf“ sagt ---------- */
const TSCHUESS = ["Tschüss!", "Tschüüüss!", "Tschü-hüss!", "Tschüss.", "Tschüssi!", "TSCHÜSS!", "Tschüss-tschüss!", "Na dann: Tschüss!"];
function tschuessHTML() {
  const T = S.tschuess && S.tschuess.tag === heute() ? S.tschuess : null;
  if (!T) return `<div class="zeile" style="flex-wrap:wrap;margin-top:6px"><button class="knopf klein zweit" data-act="tschuess-los">Danke, Max!</button><button class="knopf klein leise" data-act="post-gelesen">Zumachen</button></div>`;
  const zeilen = T.verlauf.map(([wer, t]) => `<div class="tschuess ${wer}"><span class="wer">${wer === "max" ? "Max" : esc(S.name)}</span> ${esc(t)}</div>`).join("");
  if (T.ende) return `<div class="tschuess-verlauf">${zeilen}</div><p class="klein" style="margin:8px 0 4px">${T.ende === "rita" ? "Aufgelegt. Runde an dich!" : "Max hat aufgelegt. Aus Versehen, sagt er. Zählt nicht – Revanche!"}${S.tschuessSiege ? ` · Gewonnen: ${S.tschuessSiege}×` : ""}</p><button class="knopf klein leise" style="padding-left:0" data-act="post-gelesen">Zumachen</button>`;
  return `<div class="tschuess-verlauf">${zeilen}</div><div class="zeile" style="flex-wrap:wrap;margin-top:8px"><button class="knopf klein zweit" data-act="tschuess">Tschüss!</button>${T.n >= 2 ? `<button class="knopf klein haupt" data-act="tschuess-auflegen">Ich leg jetzt auf. Tschüss!</button>` : ""}</div>`;
}

function listeHilfeSheet() {
  sheet({ titel: "Meine To-do-Liste", inhalt: maxZettel(`<p>Das ist ganz einfach deine To-do-Liste – wie ein Zettel am Kühlschrank.</p><p>Schreib rein, was du vorhast: Blumen gießen, Christiane anrufen, Rezept abholen, das nächste Kapitel. Ist es erledigt, tippst du drauf. Dann ist es abgehakt, zählt im Bild mit und steht im Rückblick.</p><p style="margin:0">Was nicht klappt, bleibt einfach stehen. Kein Stress, keine Frist.</p>`) });
}

function postHeute() {
  const h = heute(), x = S.extraPost;
  if (x && x.tag === h && !x.gelesen) return { wer: x.wer, text: x.text, extra: true, offen: !!x.offen };
  const p = maxPost(); if (p && S.postGelesen !== h) return { wer: "max", text: p, offen: S.postOffen === h };
  return null;
}

/* Rückblick-Extras: Wann zuletzt, vor einem Monat, Stichworte fürs Tagebuch, Fundstücke */
function rueckblickExtras(h) {
  let html = "";
  // Stichworte fürs Papier-Tagebuch: die letzten 3 Tage in einer Zeile
  const tage3 = [0, 1, 2].map(k => tagPlus(h, -k)).filter(t => eintraegeAm(t).length || S.momente[t]);
  html += tagebuchKarte(h);
  // Wann zuletzt? (ohne Wertung)
  const zuletzt = [];
  // nur Tätigkeiten, keine Personen: kein stilles Kontakt-Messen
  const aus = [...S.eintraege].reverse().find(x => x.t === "ausflug"); if (aus) zuletzt.push([`Ausflug: ${aus.titel}`, aus.tag]);
  const gang = [...S.eintraege].reverse().find(x => tat(x.t).art === "km"); if (gang) zuletzt.push(["Spaziergang", gang.tag]);
  const tanz = [...S.eintraege].reverse().find(x => x.t === "tanzstunde"); if (tanz) zuletzt.push(["Tanzstunde", tanz.tag]);
  if (zuletzt.length) html += `<section class="abschnitt"><details class="bogen" data-id="zuletzt"><summary style="font-weight:700;cursor:pointer;min-height:44px;display:flex;align-items:center">${ic("uhr")}&nbsp; Wann war das zuletzt?</summary><div style="margin-top:8px">${zuletzt.map(([n, t]) => `<p style="margin:4px 0">${esc(n)} <span class="klein">· ${t === h ? "heute" : t === tagPlus(h, -1) ? "gestern" : datumLang(t)}</span></p>`).join("")}</div></details></section>`;
  // Vor einem Monat
  const vm = (() => { const d = tagDatum(h), t = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() - 1); d.setDate(Math.min(t, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())); return tagVon(d); })();
  const vmE = eintraegeAm(vm);
  if (vmE.length || S.momente[vm]) html += `<section class="abschnitt"><div class="bogen"><h3>Heute vor einem Monat</h3><p style="margin:0">${esc([...new Set(vmE.map(e => e.t === "abgehakt" ? e.notiz : tat(e.t).name))].join(" · "))}${S.momente[vm] ? `<br><span class="serif">„${esc(S.momente[vm])}“</span>` : ""}</p></div></section>`;
  // Fundstücke
  const f = S.fundstuecke || [];
  if (f.length || S.tschuessSiege) html += `<section class="abschnitt"><details class="bogen" data-id="funde"><summary style="font-weight:700;cursor:pointer;min-height:44px;display:flex;align-items:center">${ic("stern")}&nbsp; Fundstücke (${f.length})</summary>${S.tschuessSiege ? `<p class="klein" style="margin-top:8px">Tschüss-Duell: ${S.tschuessSiege}× zuerst aufgelegt.</p>` : ""}${f.map(x => `<p style="margin:10px 0 0"><span class="klein" style="font-weight:700">${esc(EI_WER[x.wer] || "")} · ${datumLang(x.tag)}</span><br>${esc(x.text)}</p>`).join("")}</details></section>`;
  return html;
}

/* Abendkarte: den Tag mit ein paar Tipps nachtragen */
const ABEND_IDS = ["gehen", "lesen", "telefon", "tagebuch", "ruhe", "musik", "kochen", "pflanzen", "raetsel", "draussensitzen", "durchgehalten"];
function abendkarteHTML(tf) {
  const h = heute(); if (!tf || jetzt().getHours() < 17 || S.abendWeg === h) return "";
  const ids = [...ABEND_IDS, ...(S.eigeneT || []).filter(x => !x.weg).map(x => x.id)].filter(id => D.taetigkeiten.some(t => t.id === id) && !(id === "tagebuch" && tbZeileHeute())); // Tagebuch hat abends seinen eigenen Weg
  const heuteT = new Set(eintraegeAm(h).map(e => e.t));
  return `<section class="abschnitt"><div class="bogen streifen k-geist"><h3>Was war heute dabei?</h3><p class="klein" style="margin-top:0">Antippen genügt – ungefähre Werte, Ändern geht im Rückblick.</p><div class="chips">${ids.map(id => chip(heuteT.has(id), tat(id).kurz, heuteT.has(id) ? "disabled" : `data-act="abend" data-t="${id}"`)).join("")}</div><button class="knopf klein leise" style="padding-left:0;margin-top:6px" data-act="abend-weg">Fertig für heute</button></div></section>`;
}

/* Briefmarke: Hühnchen mit wechselndem Ulk (Schnurrbart, Brille, Zylinder, Fliege, Sonnenbrille) */
function markenWitz() {
  const v = hash32("marke" + heute()) % 5;
  if (v === 0) return `<path d="M74 47 Q80 43 86 47 Q92 51 96 46 Q93 54 86 51 Q80 49 74 52 Q70 52 74 47Z" fill="#3A2618"/>`;
  if (v === 1) return `<g fill="none" stroke="#1C2620" stroke-width="2.2"><circle cx="65" cy="31" r="10.5"/><path d="M54.5 30 L44 27"/></g>`;
  if (v === 2) return `<g fill="#1C2620"><rect x="52" y="-4" width="20" height="16" rx="2"/><rect x="47" y="10" width="30" height="4" rx="2"/><rect x="52" y="6" width="20" height="3" fill="#C8372D"/></g>`;
  if (v === 3) return `<g fill="#C8372D"><path d="M58 60 L46 54 L46 66Z"/><path d="M58 60 L70 54 L70 66Z"/><circle cx="58" cy="60" r="3"/></g>`;
  return `<g fill="#1C2620"><rect x="55" y="25" width="20" height="11" rx="5"/><path d="M55 29 L44 26" stroke="#1C2620" stroke-width="2"/></g><path d="M58 28 L63 28" stroke="#fff" stroke-width="1.4" opacity=".7"/>`;
}

/* Tagesform: was sie heute bewirkt (sichtbar unter der Wahl) */
const TF_WIRKUNG = {
  A: "Heute: Ideen für draußen, Bingo und was in Spandau los ist.",
  B: "Heute: Ideen für zu Hause und in der Nähe.",
  C: "Heute: ruhige Ideen. Jeder Eintrag bekommt einen Stern ✱, die Patience ist frei.",
  D: "Heute zählt jede Kleinigkeit, mit Stern ✱. Ablenkung steht oben, die Patience ist frei."
};
function schnellHeute(tf) {
  const k = S.schnell.slice();
  if (tf === "C" || tf === "D") { const tausch = { gehen: "ruhe", tanzstunde: "hoerbuch", besuch: "musik", gymnastik: "waerme" }; return k.map(id => tausch[id] && !k.includes(tausch[id]) ? tausch[id] : id); }
  return k;
}
function draussenVorschlagHTML() {
  const a = (D.angebote || []).filter(x => !angebotVorbei(x) && angebotNaechstes(x) && !(S.angLuft !== false && x.luft === "drinnen voll")).sort((x, y) => angebotNaechstes(x) < angebotNaechstes(y) ? -1 : 1)[0];
  return `<section class="abschnitt"><div class="bogen streifen k-draussen"><h3>Heute raus?</h3>${a ? `<p style="margin:0">${esc(a.name.replace(/[„“"]/g, ""))}</p><p class="klein" style="margin:2px 0 8px">${esc(angebotWann(a))}</p>` : ""}<div class="zeile" style="flex-wrap:wrap;gap:8px">${a ? `<button class="knopf klein zweit" data-act="angebote">Angebote ansehen</button>` : ""}<button class="knopf klein zweit" data-act="bingo-auf">${ic("blatt")} Forst-Bingo</button><button class="knopf klein leise" data-act="ausflug">Ausflug planen</button></div></div></section>`;
}
