/* ============================================================
   Rückblick (Umbau nach Feinkonzept vom 22.10., Nachtrag und Blindvergleich)
   Reihenfolge fest: Kopf · Für dein Tagebuch (#abend) · Diese Woche · Deine Tage · Postkarte · Zum Nachlesen.
   Nur der Inhalt der ersten Karte wechselt mit der Uhrzeit (Morgen 4–10:59, Tag 11–16:59, Abend 17–3:59).
   „Was war heute schön?“ (Sieger im Blindvergleich, Basis „Schönster Moment“): ein Satz, ein Knopf.
   Dankbarkeit nur leise als gelegentliche Unterzeile. Nach dem ersten Eintrag „+ Noch was Schönes“ (höchstens 3).
   Speichern kompatibel: erster Eintrag → S.momente[tag], weitere → S.dank.tage[tag]. Alte Dank-Zeilen bleiben sichtbar.
   Datenformen bleiben unverändert: S.momente, S.dank, S.jf, S.tbMerk, S.briefe, S.fundstuecke, S.rueckblick.
   Beim Anzeigen wird NICHTS geschrieben (auch nicht migriert) – nur ausdrückliche Handlungen speichern.
   ============================================================ */
const RB = { offen: "", stempelNeu: 0, nlMonat: "", alleMonat: "", farbeNach: "", dreh: 0 }; // Ansicht, nicht gespeichert
const RB_KURZMONAT = ["JAN.", "FEB.", "MÄRZ", "APR.", "MAI", "JUNI", "JULI", "AUG.", "SEP.", "OKT.", "NOV.", "DEZ."];
const RB_LAENGE = 200, RB_SCHOEN_TALER = 1, RB_SCHOEN_MAX = 3;
/* Unterzeile: meist die ruhige Grundzeile mit leiser Dankbarkeit, an manchen Tagen eine Wechselfrage */
const RB_UNTER = [
  ["Ein Satz reicht – oder: Wofür bist du heute dankbar?", "Ein Satz reicht – oder: Wofür sind Sie heute dankbar?"],
  ["Oder: Was hat Hühnchen heute ausnahmsweise richtig gemacht?", "Oder: Was hat Hühnchen heute ausnahmsweise richtig gemacht?", "huhn"],
  ["Oder: Was hat dich heute zum Lachen gebracht?", "Oder: Was hat Sie heute zum Lachen gebracht?"],
  ["Oder: Worüber hast du dich gefreut, ohne dass es geplant war?", "Oder: Worüber haben Sie sich gefreut, ohne dass es geplant war?"],
  ["Oder: Wer hat dir heute was Gutes getan?", "Oder: Wer hat Ihnen heute was Gutes getan?"],
  ["Oder: Was hat heute gut geschmeckt?", "Oder: Was hat Ihnen heute gut geschmeckt?"],
  ["Oder: Was war heute draußen los – Vogel, Wolke, Wind?", "Oder: Was war heute draußen los – Vogel, Wolke, Wind?"]
];

/* ---------- Daten nur lesen (kein dankS()/jfS(): die würden bei fehlenden Feldern migrieren) ---------- */
function rbDankTage() { const d = S.dank; return d && typeof d === "object" && d.tage && typeof d.tage === "object" && !Array.isArray(d.tage) ? d.tage : {}; }
function rbDank(t) { const l = rbDankTage()[t]; return Array.isArray(l) ? l.filter(x => (typeof x === "string" || typeof x === "number") && String(x).trim()).map(String) : typeof l === "string" && l.trim() ? [l] : []; }
function rbMoment(t) { const m = S.momente && typeof S.momente === "object" ? S.momente[t] : ""; return typeof m === "string" && m.trim() ? m : ""; }
/* alle schönen Einträge eines Tages: Moment zuerst, dann (auch alte) Dankbar-Zeilen */
function rbSchoen(t) { const m = rbMoment(t); return (m ? [m] : []).concat(rbDank(t)); }
function rbJfAn() { return !(S.jf && S.jf.an === false); }
function rbFarben(t) { const j = S.jf && S.jf.tage; const l = j && Array.isArray(j[t]) ? j[t].filter(x => typeof JF_IDS === "undefined" || JF_IDS.includes(x)) : []; return rbJfAn() ? l.slice(0, 2) : []; }
function rbEintraege(t) { return eintraegeAm(t).filter(e => e.t !== "tagebuch" && e.notiz !== "App eingerichtet"); }
function rbTagHatWas(t) { return rbEintraege(t).length > 0 || rbSchoen(t).length > 0; }
function rbHatDaten() { return S.eintraege.some(e => e.notiz !== "App eingerichtet") || Object.keys(S.momente || {}).length > 0 || Object.keys(rbDankTage()).length > 0; }
function rbSchoenTage() {
  const k = new Set();
  Object.keys(S.momente || {}).forEach(t => { if (rbMoment(t)) k.add(t); });
  Object.keys(rbDankTage()).forEach(t => { if (rbDank(t).length) k.add(t); });
  return [...k].filter(t => /^\d{4}-\d{2}-\d{2}$/.test(t)).sort().reverse();
}

/* ---------- Uhrzeit ---------- */
/* der Tag, um den es abends geht: nach Mitternacht bis 3:59 noch der Vortag */
function rbAbendTag() { return jetzt().getHours() < 4 ? tagPlus(heute(), -1) : heute(); }
function rbZustand() {
  const std = jetzt().getHours(), h = heute();
  if ((typeof RUNDGANG !== "undefined" && RUNDGANG && RUNDGANG.aktiv) || RB.offen === h) return "abend";
  if (std >= 17 || std < 4) return "abend";
  if (std < 11) return rbTagHatWas(tagPlus(h, -1)) ? "morgen" : "tag";
  return "tag";
}
function rbKurzDatum(t) { const d = tagDatum(t); return `${d.getDate()}. ${RB_KURZMONAT[d.getMonth()]}`; }

/* ---------- Stichworte (Text zum Abschreiben) ---------- */
function rbWas(t) {
  return [...new Set(rbEintraege(t).map(e => e.t === "abgehakt" ? e.notiz : e.t === "planung" ? `Ausflug geplant (${e.titel || ""})`.replace(" ()", "")
    : e.t === "ausflug" && e.titel ? `Ausflug: ${e.titel}`
    : (e.person && (S.menschen.find(m => m.id === e.person) || {}).name ? `${tat(e.t).kurz || tat(e.t).name} (${S.menschen.find(m => m.id === e.person).name})` : tat(e.t).kurz || tat(e.t).name)))].filter(Boolean);
}
function rbStichworteHTML(t, wort, mitSchoen) {
  const z = rbWas(t).map(w => ["•", w, "e"]);
  if (mitSchoen) rbSchoen(t).forEach(x => z.push(["★", x, "m"]));
  const max = 6, mehr = z.length - max;
  return `<div class="ab-stich"><p class="ab-h">${wort} in der App</p>${z.length
    ? `<ul class="ab-liste">${z.slice(0, mehr > 1 ? max - 1 : max + 1).map(([s, w, k]) => `<li class="ab-${k}"><span class="ab-z" aria-hidden="true">${s}</span><span>${esc(w)}</span></li>`).join("")}${mehr > 1 ? `<li class="ab-e ab-mehr"><span class="ab-z" aria-hidden="true">•</span><span>und ${mehr + 1} weitere</span></li>` : ""}</ul>`
    : `<p class="ab-leer">Noch nichts eingetragen. Eine Frage gibt’s trotzdem.</p>`}</div>`;
}

/* ---------- Fragen ---------- */
let RB_FRAGEN = null; // die gerade gezeigte Fragenliste (für „Ins Tagebuch geschrieben“ in extras.js)
function rbFragen(tag) { const f = tbFragen(tag); return f.length ? f : TB_FRAGEN.allg.slice(); }
function rbFragenAktuell() { return RB_FRAGEN || (S.tbModus === "frueher" ? tbFrueherFragen() : rbFragen(rbAbendTag())); }
function rbGeschrieben(tage) { return S.eintraege.filter(e => e.t === "tagebuch" && tage.includes(e.tag)).sort((a, b) => (b.ts || 0) - (a.ts || 0))[0] || null; }

/* ---------- Merkzettel ---------- */
function rbMerkHTML(offen) {
  const M = (S.tbMerk || []).filter(m => m && typeof m.text === "string");
  const neu = `<div class="zeile ab-merk-neu"><input id="tb-merk-neu" class="text" maxlength="120" placeholder="Stichwort" aria-label="Stichwort für den Merkzettel"><button class="knopf klein zweit" data-act="tb-merk-neu">Merken</button></div>`;
  if (!offen && !M.length) return `<div class="tb-merk ab-merk zu"><p class="ab-h">Merkzettel</p>${neu}</div>`;
  return `<div class="tb-merk ab-merk"><p class="ab-h">Merkzettel</p><p class="klein ab-hilfe">Tagsüber kurz notieren, abends ins Tagebuch übertragen.</p>
    ${M.map(m => `<div class="tb-merk-zeile ab-merk-zeile" data-merk="${esc(m.id)}"><span>${esc(m.text)}</span><button class="knopf klein leise" data-act="tb-merk-weg" data-id="${esc(m.id)}" aria-label="${esc(m.text)} – übertragen">${ic("haken")} übertragen</button></div>`).join("")}
    ${neu}</div>`;
}

/* ---------- „Was war heute schön?“ ---------- */
function rbUnterzeile(t) {
  const pool = RB_UNTER.filter(x => x[2] !== "huhn" || S.huhn), n = pool.length, b = hash32("schoen" + t);
  const k = b % 3 ? 0 : 1 + (b % (n - 1)); // an etwa jedem dritten Tag eine Wechselfrage
  const q = pool[(k + RB.dreh) % n];
  return A(q[0], q[1]);
}
function rbSchoenBezahlt(t) { return rbSchoen(t).length > 0 || !!(S.dank && S.dank.taler && S.dank.taler[t]); }
function rbSchoenHTML(t) {
  const l = rbSchoen(t);
  if (!l.length) return `<div class="ab-schoen" id="ab-schoen"><h3 class="ab-schoen-titel">Was war heute schön?</h3>
    <p class="ab-anregung">${esc(rbUnterzeile(t))}</p>
    <div class="zeile ab-schoen-knoepfe"><button class="knopf klein zweit" data-act="rb-schoen">${ic("stift")} Aufschreiben</button></div></div>`;
  return `<div class="ab-schoen voll" id="ab-schoen"><h3 class="ab-schoen-titel">Was war heute schön?</h3>
    <ul class="ab-liste ab-schoen-liste">${l.map(x => `<li class="ab-m"><span class="ab-z" aria-hidden="true">★</span><span>${esc(x)}</span></li>`).join("")}</ul>
    <p class="klein ab-notiert">${ic("haken")} Für dein Tagebuch notiert</p>
    <div class="zeile ab-schoen-knoepfe"><button class="knopf klein leise ab-klein" data-act="rb-schoen">Ändern</button>${l.length < RB_SCHOEN_MAX ? `<button class="knopf klein leise ab-klein" data-act="rb-schoen" data-mehr="1">+ Noch was Schönes</button>` : ""}</div></div>`;
}
/* Blatt: ein Satz; beim Ändern alle Einträge ohne Nummern; mit „+ Noch was Schönes“ genau ein neues Feld */
function rbSchoenSheet(mehr) {
  const t = rbAbendTag(), m = rbMoment(t), dk = rbDank(t);
  const feld = (wert, q, i, neu) => `<textarea class="text rb-schoen-feld" data-q="${q}" rows="${i === 0 ? 3 : 2}" maxlength="${RB_LAENGE}" aria-label="${neu ? "Noch was Schönes" : "Was war schön"}"${i === 0 && !wert ? ` placeholder="z. B. Kaffee auf dem Balkon"` : ""}>${esc(wert)}</textarea>`;
  const felder = [];
  if (m) felder.push(feld(m, "m", 0));
  dk.forEach(x => felder.push(feld(x, "d", felder.length)));
  if (!felder.length || (mehr && felder.length < RB_SCHOEN_MAX)) felder.push(feld("", m ? "d" : "m", felder.length, felder.length > 0));
  sheet({ titel: t === heute() ? "Was war heute schön?" : "Was war gestern schön?", id: "rb-schoen", inhalt: `<div class="rb-schoen-sheet">
    <p class="rb-unter">${esc(rbUnterzeile(t))}</p>
    <p class="rb-andere"><button class="knopf klein leise" data-act="rb-schoen-andere">Andere Frage</button></p>
    <div class="rb-felder">${felder.join("")}</div></div>`,
    fuss: `<button class="knopf haupt voll" data-act="rb-schoen-speichern">${ic("haken")} Aufschreiben</button>` });
  const sh = aktuellesSheet(); if (sh) sh.dataset.tag = t;
  setTimeout(() => { const f = $$(".rb-schoen-feld"); const z = mehr ? f[f.length - 1] : f[0]; if (z && !REDUCED()) try { z.focus({ preventScroll: true }); } catch (e) { } }, 320);
}
function rbSchoenSpeichern() {
  const sh = aktuellesSheet(), t = (sh && sh.dataset.tag) || rbAbendTag();
  const sauber = s => String(s || "").replace(/\s+/g, " ").trim();
  const f = $$(".rb-schoen-feld").map(x => ({ q: x.dataset.q, v: sauber(x.value).slice(0, RB_LAENGE) }));
  const mFeld = f.find(x => x.q === "m"), dl = f.filter(x => x.q === "d").map(x => x.v).filter(Boolean);
  const mAlt = rbMoment(t), dAlt = rbDank(t);
  if (!f.some(x => x.v) && !mAlt && !dAlt.length) { const z = $(".rb-schoen-feld"); if (z) z.focus(); return; }
  const bezahlt = rbSchoenBezahlt(t);
  let geaendert = false;
  if (mFeld && mFeld.v !== mAlt) {
    if (mFeld.v) { if (!mAlt) eierMoment(mFeld.v); S.momente[t] = mFeld.v; } else delete S.momente[t];
    geaendert = true;
  }
  if (JSON.stringify(dl) !== JSON.stringify(dAlt)) { const D0 = dankS(); if (dl.length) D0.tage[t] = dl; else delete D0.tage[t]; geaendert = true; }
  const erstes = f.some(x => x.v) && !bezahlt;
  if (erstes) dankS().taler[t] = 1;
  sheetZu(); render({ halteScroll: true, ohneAnim: true });
  // Karte so zeigen, dass der Eintrag frei steht (nicht unter der Tab-Leiste); kein Toast über dem Text
  const k = $("#ab-schoen"); if (k) k.scrollIntoView({ block: "nearest", behavior: "auto" });
  haptik("erfolg");
  if (erstes) rbTalerFlug(RB_SCHOEN_TALER);
  else if (geaendert) speichern();
}
/* Taler fliegen vom Eintrag zur Plakette oben – auch wenn die Kopfzeile weggescrollt ist (dann über den oberen Rand) */
function rbTalerFlug(n) {
  const quelle = $("#ab-schoen .ab-schoen-liste li:last-child") || $("#ab-schoen");
  const r = quelle ? quelle.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const q = { x: r.left + 14, y: r.top + r.height / 2 };
  const plak = typeof plaketteEl === "function" ? plaketteEl() : null, mz = plak && plak.querySelector(".muenze");
  const ziel = mz ? mz.getBoundingClientRect() : { left: 40, top: -40 };
  const sichtbar = ziel.bottom > 4;
  if (sichtbar || REDUCED() || typeof PLAK !== "object") { if (typeof PLAK === "object") PLAK.quelle = { x: q.x, y: q.y, t: performance.now() }; S.taler = (Number(S.taler) || 0) + n; speichern(); return; }
  PLAK.leise = true; S.taler = (Number(S.taler) || 0) + n; speichern(); // Plakette zählt still weiter
  const m = document.createElement("div"); m.className = "taler-flug"; m.innerHTML = typeof MUENZE === "function" ? MUENZE() : ""; m.style.left = (q.x - 11) + "px"; m.style.top = (q.y - 11) + "px"; document.body.appendChild(m);
  const dx = ziel.left - q.x + 2, dy = Math.min(ziel.top, -30) - q.y;
  const a = m.animate([{ transform: "translate(0,0) scale(.6)", opacity: 0 }, { transform: `translate(${dx * .3}px,-40px) scale(1.15)`, opacity: 1, offset: .3 }, { transform: `translate(${dx}px,${dy}px) scale(.8)`, opacity: .9 }], { duration: 900, easing: "cubic-bezier(.4,0,.3,1)", fill: "forwards" });
  a.onfinish = () => m.remove();
}

/* ---------- Karte „Für dein Tagebuch“ ---------- */
function rbAbendKarte() {
  const h = heute(), z = rbZustand();
  if (z === "tag") {
    const sch = rbSchoen(h), l = rbFarben(h), schon = [];
    if (sch.length) schon.push(`★ ${sch[0].length > 40 ? sch[0].slice(0, 38) + "…" : sch[0]}`);
    if (l.length) schon.push(`Farbe: ${jfNamen(l)}`);
    return `<section class="abschnitt" id="abend"><div class="bogen tb-karte abendblatt zustand-tag">
      <div class="ab-kopf"><span class="ab-kicker">Für dein Tagebuch</span></div>
      ${rbMerkHTML(true)}
      <div class="ab-trenn perfo" aria-hidden="true"></div>
      <p class="ab-spaeter">Abends steht hier deine Frage.</p>
      <div class="zeile ab-knoepfe"><button class="knopf klein zweit" data-act="abend-auf">${ic("feder")} Frage jetzt ansehen</button></div>
      ${schon.length ? `<p class="klein ab-schon">Heute: ${esc(schon.join(" · "))}</p>` : ""}
    </div></section>`;
  }
  const morgen = z === "morgen", t = morgen ? tagPlus(h, -1) : rbAbendTag(), wort = morgen ? "Gestern" : "Heute";
  const l = rbFarben(t);
  const frueher = S.tbModus === "frueher";
  const fr = frueher ? tbFrueherFragen() : rbFragen(t); RB_FRAGEN = fr;
  const f = fr[(S.tbDreh || 0) % fr.length] || "";
  const ges = rbGeschrieben([t, h]);
  const neuGestempelt = Date.now() - RB.stempelNeu < 1500 && !REDUCED();
  const knoepfe = ges
    ? `<div class="ab-fertig"><div class="rb-stempel${neuGestempelt ? " neu" : ""}" role="img" aria-label="Ins Tagebuch geschrieben am ${esc(datumLang(ges.tag))}">Ins Tagebuch geschrieben · ${rbKurzDatum(ges.tag)}</div>
       <p class="klein ab-huhn">${S.huhn ? "Hühnchen liest nicht mit, Ehrenwort." : "Die App liest nicht mit."}</p>
       <div class="zeile ab-knoepfe"><button class="knopf klein leise" data-act="tb-andere">Andere Frage</button></div></div>`
    : `<div class="zeile ab-knoepfe stapel-mitte"><button class="knopf haupt" data-act="tb-geschrieben">${ic("feder")} Ins Tagebuch geschrieben</button><button class="knopf klein leise" data-act="tb-andere">Andere Frage</button></div>`;
  // Farbe: abends für heute (jfFrageHTML, eingebettet), morgens „Farbe für gestern“ nachtragen (aufklappbar)
  let farbe = "";
  if (rbJfAn()) {
    if (morgen) {
      farbe = l.length || RB.farbeNach === t
        ? jfFrageHTML({ tag: t, titel: "Farbe für gestern", rahmen: false })
        : `<div class="ab-zeile"><span class="ab-zeile-titel">Farbe für gestern</span><button class="knopf klein leise" data-act="rb-farbe-nach" data-tag="${t}">Farbe nachtragen</button></div>`;
    } else farbe = jfFrageHTML({ tag: t, titel: t === h ? "Farbe für heute" : "Farbe für gestern", rahmen: false });
  }
  const merkOffen = (S.tbMerk || []).length > 0 || morgen;
  return `<section class="abschnitt" id="abend"><div class="bogen tb-karte abendblatt zustand-${z}">
    <div class="ab-kopf"><span class="ab-kicker">Für dein Tagebuch <span class="ab-kicker-zeit">· ${morgen ? "Gestern" : "Heute Abend"}</span></span>${l.length ? jfFeld(l, "klein ab-feld") : ""}</div>
    ${rbStichworteHTML(t, wort, morgen)}
    <div class="chips tb-modus" role="group" aria-label="Frage zu">${chip(!frueher, wort, `data-act="tb-modus" data-v="heute"`)}${chip(frueher, "Früher", `data-act="tb-modus" data-v="frueher"`)}</div>
    <p class="serif tb-frage ab-frage">${esc(f)}</p>
    ${frueher ? `<p class="ab-frueher-link"><button class="link-knopf" data-act="lebensbuch">Mehr Fragen von früher</button></p>` : ""}
    ${knoepfe}
    ${morgen ? "" : `<div class="ab-trenn punkt" aria-hidden="true"></div>${rbSchoenHTML(t)}`}
    ${farbe ? `<div class="ab-trenn punkt" aria-hidden="true"></div><div class="ab-farbe">${farbe}</div>` : ""}
    <div class="ab-trenn perfo" aria-hidden="true"></div>
    ${rbMerkHTML(merkOffen)}
  </div></section>`;
}

/* ---------- Diese Woche ---------- */
function rbWocheHTML() {
  const h = heute(), d = tagDatum(h), mo = tagPlus(h, -((d.getDay() + 6) % 7));
  const tage = Array.from({ length: 7 }, (_, i) => tagPlus(mo, i));
  const n = hakenDieseWoche();
  const km = S.eintraege.filter(e => e.tag >= mo && e.tag <= h && tat(e.t).art === "km").reduce((s, e) => s + (Number(e.km) || 0), 0);
  const zeile = [];
  if (n) zeile.push(`${n} ${n === 1 ? "Sache" : "Sachen"} geschafft`);
  if (km) zeile.push(`${fmt(km)} km zu Fuß`);
  const an = rbJfAn(), WT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const streifen = tage.map((t, i) => {
    const kopf = `<span class="wo-wt">${WT[i]}</span>`;
    if (t > h) return `<span class="wo-tag zukunft" aria-hidden="true">${kopf}${an ? `<span class="wo-feld leinen"></span>` : ""}</span>`;
    const l = rbFarben(t), es = rbEintraege(t), icons = [...new Set(es.map(iconVon))].slice(0, 3), stern = rbSchoen(t).length > 0;
    const lab = `${datumLang(t)}${l.length ? ": " + jfNamen(l) : ""}${es.length ? `, ${es.length} ${es.length === 1 ? "Eintrag" : "Einträge"}` : ""}${stern ? ", mit etwas Schönem" : ""}`;
    return `<button class="wo-tag${t === h ? " heute" : ""}" data-act="jf-tag" data-v="${t}" aria-label="${esc(lab)}">${kopf}${an ? (l.length ? jfFeld(l, "wo-feld") : `<span class="wo-feld leinen" aria-hidden="true"></span>`) : ""}<span class="wo-ics" aria-hidden="true">${icons.map(x => ic(x, "wo-ic")).join("")}${stern ? `<span class="wo-stern">★</span>` : ""}</span></button>`;
  }).join("");
  const wr = d.getDay() === 0 || (d.getDay() === 1 && !S.rueckblick[kwVon(tagPlus(h, -1))]);
  return `<section class="abschnitt rb-woche"><h2>Diese Woche</h2><div class="wo-streifen">${streifen}</div>
    <p class="wo-zeile">${zeile.length ? esc(zeile.join(" · ")) : "Diese Woche steht noch nichts drin."}</p>
    ${wr ? `<div class="zeile wo-knoepfe"><button class="knopf klein zweit" data-act="rueckblick">${ic("stern")} Wochenrückblick</button></div>` : ""}</section>`;
}

/* ---------- Heute vor einem Jahr / Monat ---------- */
function rbVorTag(h, monate) { const d = tagDatum(h), t = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() - monate); d.setDate(Math.min(t, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())); return tagVon(d); }
function rbPostkarteHTML() {
  const h = heute();
  const kand = [[rbVorTag(h, 12), "Heute vor einem Jahr"], [rbVorTag(h, 1), "Heute vor einem Monat"]].find(([t]) => rbTagHatWas(t));
  if (!kand) return "";
  const [t, titel] = kand, satz = rbSchoen(t)[0] || "", was = rbWas(t);
  return `<section class="abschnitt"><button class="rb-postkarte" data-act="jf-tag" data-v="${t}" aria-label="${esc(titel)}: ${esc(datumLang(t))} ansehen">
    <span class="rb-pk-stempel" aria-hidden="true">${rbKurzDatum(t)}</span>
    <span class="c-kicker rb-pk-kicker">${titel}</span>
    ${satz ? `<span class="rb-pk-satz">„${esc(satz)}“</span>` : ""}
    ${was.length ? `<span class="rb-pk-was">${esc(was.slice(0, 4).join(" · "))}</span>` : ""}</button></section>`;
}

/* ---------- Zum Nachlesen: drei Karteikarten → Sheets ---------- */
function rbZuletzt() {
  const z = [];
  const aus = [...S.eintraege].reverse().find(x => x.t === "ausflug"); if (aus) z.push([`Ausflug: ${aus.titel || "ohne Namen"}`, aus.tag]);
  const gang = [...S.eintraege].reverse().find(x => tat(x.t).art === "km"); if (gang) z.push(["Spaziergang", gang.tag]);
  const tanz = [...S.eintraege].reverse().find(x => x.t === "tanzstunde"); if (tanz) z.push(["Tanzstunde", tanz.tag]);
  return z; // nur Tätigkeiten, keine Personen: kein stilles Kontakt-Messen
}
function rbWann(t) { const h = heute(); return t === h ? "heute" : t === tagPlus(h, -1) ? "gestern" : datumLang(t); }
function rbNachlesenHTML() {
  const k = [], schoen = rbSchoenTage(), zul = rbZuletzt(), alle = S.eintraege.some(e => e.notiz !== "App eingerichtet");
  const karte = (icon, titel, vor, act) => `<button class="rb-karteikarte" data-act="${act}"><span class="rb-kk-ic" aria-hidden="true">${ic(icon)}</span><span class="rb-kk-text"><span class="rb-kk-titel">${esc(titel)}</span><span class="rb-kk-vor">${esc(vor)}</span></span></button>`;
  // ohne Zähler (Vorgabe Psychologin): Vorschau ist der letzte Satz
  if (schoen.length) { const s = rbSchoen(schoen[0])[0] || ""; k.push(karte("stern", "Schöne Momente", `„${s.length > 34 ? s.slice(0, 32) + "…" : s}“`, "rb-nl-schoen")); }
  if (zul.length) k.push(karte("uhr", "Wann war das zuletzt?", `${zul[0][0].replace(/^Ausflug: .*/, "Ausflug")} · ${rbWann(zul[0][1])}`, "rb-nl-zuletzt"));
  if (alle) k.push(karte("buch", "Alle Tage", "Einträge ansehen und ändern", "rb-nl-alle"));
  if (!k.length) return "";
  return `<section class="abschnitt rb-nachlesen"><h2>Zum Nachlesen</h2><div class="rb-kartei">${k.join("")}</div></section>`;
}
function rbMonatName(m) { return `${MONAT[Number(m.slice(5)) - 1]}${m.slice(0, 4) !== heute().slice(0, 4) ? " " + m.slice(0, 4) : ""}`; }
/* Archiv ruhig: Datum und Sätze, alle mit demselben Zeichen in derselben Schrift; kein Zähler, keine Lücken */
function rbArchivInhalt() {
  const tage = rbSchoenTage();
  if (!tage.length) return `<p>Hier sammelt sich, was ${A("du aufschreibst", "Sie aufschreiben")}.</p>`;
  const monate = [...new Set(tage.map(t => t.slice(0, 7)))];
  if (!monate.includes(RB.nlMonat)) RB.nlMonat = monate[0];
  const wahl = monate.length > 1 ? `<div class="chips rb-monate" role="group" aria-label="Monat">${monate.map(m => chip(m === RB.nlMonat, rbMonatName(m), `data-act="rb-nl-monat" data-v="${m}"`)).join("")}</div>` : `<p class="c-kicker" style="margin:0 0 6px">${esc(rbMonatName(monate[0]))}</p>`;
  return `${wahl}<div class="rb-archiv">${tage.filter(t => t.startsWith(RB.nlMonat)).map(t => `<div class="rb-archiv-tag"><p class="klein rb-archiv-datum">${t === heute() ? "Heute" : t === tagPlus(heute(), -1) ? "Gestern" : esc(datumLang(t))}</p><ul class="ab-liste">${rbSchoen(t).map(x => `<li class="ab-m"><span class="ab-z" aria-hidden="true">★</span><span class="rb-archiv-satz">${esc(x)}</span></li>`).join("")}</ul></div>`).join("")}</div>`;
}
function rbArchivSheet() { RB.nlMonat = ""; sheet({ titel: "Schöne Momente – zum Nachlesen", id: "rb-archiv", inhalt: rbArchivInhalt() }); }
function rbZuletztSheet() {
  const z = rbZuletzt();
  sheet({ titel: "Wann war das zuletzt?", id: "rb-zuletzt", inhalt: `<p class="klein" style="margin-top:0">Nur zum Nachschauen – ohne Wertung.</p><div class="rb-zuletzt">${z.map(([n, t]) => `<p class="rb-zuletzt-zeile"><span>${esc(n)}</span><span class="klein">${esc(rbWann(t))}</span></p>`).join("")}</div>` });
}
function rbAlleInhalt() {
  const h = heute();
  const tage = [...new Set(S.eintraege.filter(e => e.notiz !== "App eingerichtet").map(e => e.tag).concat(rbSchoenTage()))].filter(t => /^\d{4}-\d{2}-\d{2}$/.test(t)).sort().reverse();
  if (!tage.length) return `<p>${A("Sobald du etwas einträgst, steht es hier – nach Tagen sortiert.", "Sobald Sie etwas eintragen, steht es hier – nach Tagen sortiert.")}</p>`;
  const monate = [...new Set(tage.map(t => t.slice(0, 7)))];
  if (!monate.includes(RB.alleMonat)) RB.alleMonat = monate[0];
  const wahl = monate.length > 1 ? `<div class="chips rb-monate" role="group" aria-label="Monat">${monate.map(m => chip(m === RB.alleMonat, rbMonatName(m), `data-act="rb-alle-monat" data-v="${m}"`)).join("")}</div>` : "";
  return `${wahl}${tage.filter(t => t.startsWith(RB.alleMonat)).map(t => {
    const es = eintraegeAm(t).filter(e => e.notiz !== "App eingerichtet"), tf = S.tf[t], schwer = (tf === "C" || tf === "D") && t === h;
    return `<div class="rb-alle-tag"><h3>${datumRelativ(t)}${schwer ? ` <span class="stern" title="ein ruhiger Tag">✱</span>` : ""}</h3>
      ${rbSchoen(t).map(x => `<p class="rb-alle-moment"><span class="ab-z" aria-hidden="true">★</span> ${esc(x)}</p>`).join("")}
      ${es.length ? `<div class="liste">${es.slice().reverse().map(e => eintragZeile(e, true, t === h)).join("")}</div>` : ""}</div>`;
  }).join("")}`;
}
function rbAlleSheet() { RB.alleMonat = ""; sheet({ titel: "Alle Tage", id: "rb-alle", inhalt: `<p class="klein" style="margin-top:0">Antippen zum Ändern oder Löschen.</p>${rbAlleInhalt()}` }); }

/* ---------- Ansicht ---------- */
function rbAnsicht() {
  const h = heute(), d = tagDatum(h), daten = rbHatDaten();
  RB_FRAGEN = null;
  let html = `<div class="gruss rb-kopf"><h1>Rückblick</h1><div class="datum">${WOCHENTAG[d.getDay()]}, ${d.getDate()}. ${MONAT[d.getMonth()]}</div></div>`;
  html += rbAbendKarte();
  if (daten) html += rbWocheHTML();
  if (typeof jfRueckblickHTML === "function") html += jfRueckblickHTML(h);
  if (daten) html += rbPostkarteHTML() + rbNachlesenHTML();
  return html;
}

/* ---------- Leiste auf „Heute“ (ab 17 Uhr bis 3:59) ---------- */
function abendLeisteAn() { const s = jetzt().getHours(); return s >= 17 || s < 4; }
function abendLeisteHTML() {
  try {
    if (!abendLeisteAn() || !S.onboard) return "";
    const t = rbAbendTag(), h = heute(), l = rbFarben(t);
    const erledigt = [];
    if (rbGeschrieben([t, h])) erledigt.push("Ins Tagebuch geschrieben");
    if (rbSchoen(t).length) erledigt.push("Schönes aufgeschrieben ✓");
    if (l.length) erledigt.push(`Farbe: ${jfNamen(l)}`);
    const unter = erledigt.length ? erledigt.join(" · ")
      : S.tf[h] === "D" ? (rbJfAn() ? A("Wenn du magst: eine Frage und eine Farbe", "Wenn Sie mögen: eine Frage und eine Farbe") : A("Wenn du magst: eine Frage", "Wenn Sie mögen: eine Frage"))
      : `Eine Frage für heute Abend, was schön war${rbJfAn() ? ", Farbe für den Tag" : ""}`;
    const bild = l.length ? jfFeld(l, "klein abend-leiste-feld") : ic("feder");
    return `<section class="abschnitt"><div class="liste"><button class="liste-zeile k-geist abend-leiste" data-act="abend-zu">${bild}<span class="text"><span class="titel">Für dein Tagebuch</span><br><span class="unter">${esc(unter)}</span></span>${ic("pfeil", "pfeil")}</button></div></section>`;
  } catch (e) { console.warn(e); return ""; }
}

/* ---------- Zuhause: Kurze Post und Fundstücke ---------- */
function kurzePostZeile() {
  const n = (S.briefe || []).length; if (!n) return "";
  return zeileBtn("brief", "Kurze Post", n > 2 ? `${n} Zettel zum Nochmal-Lesen` : "Zettel von Max, Christiane und Hühnchen", `data-act="rb-kurzepost"`, "k-menschen");
}
function kurzePostSheet() {
  const B = (S.briefe || []).filter(b => b && typeof b.text === "string").slice().reverse();
  sheet({ titel: "Kurze Post", id: "kurze-post", inhalt: B.length ? B.map(b => `<div class="brief-papier" style="margin-top:12px;animation:none"><p class="brief-anrede">Liebe ${esc(S.name)},</p><p class="brief-text">${esc(b.text)}</p><p class="brief-gruss">${b.wer === "christiane" ? "Deine Christiane" : b.wer === "huhn" ? "Dein Hühnchen" : "Dein Max"} <span aria-hidden="true">♥</span>${/^\d{4}-\d{2}-\d{2}$/.test(b.tag || "") ? ` · ${datumLang(b.tag)}` : ""}</p></div>`).join("") : `<p>Hier sammeln sich die Zettel.</p>` });
}
function fundZeileHTML() {
  const f = (S.fundstuecke || []).length, s = Number(S.tschuessSiege) || 0;
  if (!f && !s) return "";
  return zeileBtn("stern", "Fundstücke", `${f} ${f === 1 ? "Sache" : "Sachen"} gefunden${s ? ` · Tschüss-Duell: ${s}× gewonnen` : ""}`, `data-act="rb-funde"`, "k-mut");
}
function fundstueckeSheet() {
  const f = (S.fundstuecke || []).filter(x => x && typeof x.text === "string");
  sheet({ titel: "Fundstücke", id: "funde", inhalt: `${S.tschuessSiege ? `<p class="klein" style="margin-top:0">Tschüss-Duell: ${S.tschuessSiege}× zuerst aufgelegt.</p>` : ""}${f.map(x => `<p style="margin:12px 0 0"><span class="klein" style="font-weight:700">${esc(EI_WER[x.wer] || "")}${/^\d{4}-\d{2}-\d{2}$/.test(x.tag || "") ? ` · ${datumLang(x.tag)}` : ""}</span><br>${esc(x.text)}</p>`).join("")}${!f.length ? `<p>Noch nichts gefunden.</p>` : ""}` });
}

/* ---------- Aktionen ---------- */
function rbBlattAuffrischen() {
  const sh = aktuellesSheet(); if (!sh) return;
  if (sh.dataset.id === "jf-tag" && sh.dataset.tag && typeof jfTagInhalt === "function") sheetInhalt(jfTagInhalt(sh.dataset.tag));
  else if (sh.dataset.id === "rb-alle") sheetInhalt(`<p class="klein" style="margin-top:0">Antippen zum Ändern oder Löschen.</p>${rbAlleInhalt()}`);
}
function rbZuAbend() {
  RB.offen = heute();
  if (SHEETS.length) alleSheetsZu();
  if (TAB !== "tagebuch") wechsleTab("tagebuch"); else render({ halteScroll: true, ohneAnim: true });
  setTimeout(() => { const el = $("#abend"); if (el) el.scrollIntoView({ block: "start", behavior: "auto" }); rbNichtHalb(); }, 120);
}
/* Kein Knopf halb unter der Tab-Leiste: ragt „Aufschreiben“ teilweise darunter, ein Stück weiter schieben */
function rbNichtHalb() {
  const b = $("#ab-schoen [data-act=rb-schoen]"), nav = $("nav.tabs"); if (!b || !nav) return;
  const r = b.getBoundingClientRect(), n = nav.getBoundingClientRect().top;
  if (r.top < n && r.bottom > n - 8) scrollBy({ top: Math.ceil(r.bottom - n + 16), behavior: "auto" });
}
function rbAktion(a, d, el) {
  switch (a) {
    case "abend-zu": rbZuAbend(); return true;
    case "abend-auf": RB.offen = heute(); haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); return true;
    case "moment": rbSchoenSheet(); return true; // alter Weg (Hinweise, ältere Knöpfe) → dasselbe Blatt
    case "rb-schoen": rbSchoenSheet(!!(d && d.mehr)); return true;
    case "rb-schoen-speichern": rbSchoenSpeichern(); return true;
    case "rb-schoen-andere": { // nur die Unterzeile wechselt, nichts wird gespeichert
      RB.dreh = (RB.dreh + 1) % 100; haptik("auswahl");
      const p = $(".rb-unter"), sh = aktuellesSheet(); if (p) p.textContent = rbUnterzeile((sh && sh.dataset.tag) || rbAbendTag());
      return true; }
    case "rb-farbe-nach": RB.farbeNach = d.tag || ""; haptik("auswahl"); render({ halteScroll: true, ohneAnim: true }); return true;
    case "rb-nl-schoen": rbArchivSheet(); return true;
    case "rb-nl-monat": RB.nlMonat = d.v || ""; haptik("auswahl"); sheetInhalt(rbArchivInhalt()); return true;
    case "rb-nl-zuletzt": rbZuletztSheet(); return true;
    case "rb-nl-alle": rbAlleSheet(); return true;
    case "rb-alle-monat": RB.alleMonat = d.v || ""; haptik("auswahl"); rbBlattAuffrischen(); return true;
    case "rb-kurzepost": kurzePostSheet(); return true;
    case "rb-funde": fundstueckeSheet(); return true;
  }
  return false;
}
/* in den zentralen Weg (main.js aktion) einhängen: data-act-Klicks und „fenster“-Ziele laufen dort durch */
(function () {
  const alt = aktion;
  aktion = function (a, d, el, ev) {
    if (a === "tb-geschrieben") RB.stempelNeu = Date.now();
    try { if (rbAktion(a, d || {}, el)) return; } catch (e) { console.warn(e); return; }
    const r = alt(a, d, el, ev);
    if (a === "speichern" || a === "loeschen") setTimeout(rbBlattAuffrischen, 60);
    return r;
  };
})();
/* Merkzettel: übertragene Zeile wird durchgestrichen und gleitet weg (300 ms; bei reduzierter Bewegung sofort) */
document.addEventListener("click", ev => {
  const b = ev.target.closest && ev.target.closest(".ab-merk [data-act=tb-merk-weg]"); if (!b || REDUCED() || b.dataset.laeuft) return;
  const z = b.closest(".ab-merk-zeile"); if (!z) return;
  ev.stopImmediatePropagation(); ev.preventDefault(); b.dataset.laeuft = "1";
  z.classList.add("weg"); haptik("erfolg");
  setTimeout(() => tbAktion("tb-merk-weg", { id: b.dataset.id }), 300);
}, true);
document.addEventListener("keydown", ev => {
  if (ev.key === "Enter" && ev.target && ev.target.id === "tb-merk-neu") { ev.preventDefault(); tbAktion("tb-merk-neu", {}); }
});
/* Rote Zahl: neues Fundstück → Zuhause (der Rückblick bekommt nie eine Zahl, siehe tabzahl.js) */
(function () {
  if (typeof TZ_QUELLEN !== "object" || !TZ_QUELLEN.lichtung) return;
  const alt = TZ_QUELLEN.lichtung;
  TZ_QUELLEN.lichtung = () => { const k = alt() || []; try { (S.fundstuecke || []).filter(x => x && x.tag === heute()).forEach(x => k.push(`fs:${x.tag}:${x.id}`)); } catch (e) { } return k; };
})();
