/* ============================================================
   Mein Notfallplan – bei Unruhe, Anspannung und dergleichen.
   Bewusst allgemein formuliert (zu Hause oder unterwegs), ohne Anlass zu benennen.
   Es wird nie erfasst, WANN es eng war – nur das Üben zählt als Eintrag.
   Grundlage: „Mein kleiner Notfallplan bei Angst und Panik“ (von Max mitgegeben).
   ============================================================ */
D.ruhe = {
  hilft: [
    { id: "fuesse", text: "Beide Füße fest auf den Boden" },
    { id: "hand", text: "Eine Hand auf Brust oder Bauch" },
    { id: "wasser", text: "Ein Glas Wasser, in kleinen Schlucken" },
    { id: "luft", text: "Frische Luft, Fenster auf" },
    { id: "platz", text: "Ein ruhiger Platz zum Sitzen" },
    { id: "decke", text: "Eine warme Decke oder Jacke" },
    { id: "musik", text: "Ruhige Musik" },
    { id: "bonbon", text: "Ein Bonbon oder Kaugummi" },
    { id: "zaehlen", text: "Etwas zählen: Bäume, Fenster, rote Dinge" },
    { id: "anrufen", text: "Jemanden anrufen" }
  ],
  saetze: [
    "Ich muss nicht die ganze Zukunft bewältigen. Nur den nächsten Moment.",
    "Das ist unangenehm, aber es geht vorbei. Ich bleibe sitzen, bis es leiser wird.",
    "Ein Atemzug nach dem anderen.",
    "Ich darf stehen bleiben. Ich darf mir helfen lassen. Ich muss niemandem etwas beweisen.",
    "Stehaufmännchen kippen auch mal. Und stehen wieder auf.",
    "Mein Kopf macht gerade Theater. Ich muss nicht mitspielen."
  ],
  unterwegs: [
    { id: "pausen", text: "Pausen vorher einplanen" },
    { id: "halt", text: "Wissen, wo ich mich hinsetzen oder umkehren kann" },
    { id: "bescheid", text: "Jemand weiß, dass ich unterwegs bin" },
    { id: "ohren", text: "Musik oder Hörbuch dabei" },
    { id: "wasser", text: "Wasser und ein Bonbon in der Tasche" },
    { id: "pause", text: "Ich darf Pause machen. Und danach weiter." }
  ]
};
if (D.huehnchenReaktionen) D.huehnchenReaktionen.ruhe = ["Geübt. Ich hab mitgeatmet. Glaub ich.", "Ruhig ein, langsam aus. Ich bin aus Ton, ich kann das von Natur aus.", "Sitzt schon besser. Respekt.", "Training ist Training. Haken dran."];
D.taetigkeiten.push({ id: "ruheuebung", name: "Ruhe geübt", kurz: "Ruhe geübt", art: "klein", feld: "sorge", bild: "quelle", tf: "ABCD", icon: "atem",
  info: ["Geübt. Dann sitzt es, wenn es drauf ankommt.", "Ruhe geübt. Das ist Training, genau wie Gehen."] });

let RUHE = { schritt: 0, modus: "jetzt", iv: 0, atemZ: 0, atemEnde: 0 };
const RUHE_SCHRITTE = 7;

function ruheP() { if (!S.ruhe) S.ruhe = frisch().ruhe; const u = S.ruhe.unterwegs.indexOf("umdrehen"); if (u >= 0) S.ruhe.unterwegs.splice(u, 1, "pause"); return S.ruhe; }
const notfallKlein = () => "";
function ruheSatz() { const R = ruheP(); return R.satzEigen || D.ruhe.saetze[R.satz || 0]; }
function ruheHilftListe() { const R = ruheP(); return [...D.ruhe.hilft.filter(h => R.hilft.includes(h.id)).map(h => h.text), ...(R.eigene || [])]; }
function ruheUnterwegsListe() { const R = ruheP(); return [...D.ruhe.unterwegs.filter(h => R.unterwegs.includes(h.id)).map(h => h.text), ...(R.unterwegsEigen || [])]; }

/* ---------- Übersicht ---------- */
function ruheSheet() { sheet({ titel: "Mein Notfallplan", inhalt: ruheInhalt(), id: "ruhe" }); }
/* Übersicht (Gestaltung C2): Schild mit eigenem Satz und EINEM Knopf · Plan (Hilft als Symbol-Raster, höchstens 3 sichtbar;
   Anrufen als tel:-Felder; Unterwegs aufklappbar) · Plan zusammenstellen · Üben */
const C_RUHE_IC = { fuesse: "schuh", hand: "hand", wasser: "glas", luft: "blatt", platz: "bank", decke: "decke", musik: "note", bonbon: "geschenk", zaehlen: "funke", anrufen: "telefon",
  pausen: "bank", halt: "karte", bescheid: "handy", ohren: "kopfhoerer", pause: "tasse" };
function ruheInhalt() {
  const R = ruheP();
  const hilft = [...D.ruhe.hilft.filter(h => R.hilft.includes(h.id)).map(h => ({ t: h.text, i: C_RUHE_IC[h.id] })), ...(R.eigene || []).map(t => ({ t, i: "herz" }))];
  const unterwegs = [...D.ruhe.unterwegs.filter(h => R.unterwegs.includes(h.id)).map(h => ({ t: h.text, i: C_RUHE_IC[h.id] || "rucksack" })), ...(R.unterwegsEigen || []).map(t => ({ t, i: "herz" }))];
  const leute = R.leute || [];
  // höchstens 3 Punkte sichtbar, der Rest unter „n weitere“
  const mitMehr = (arr, bau) => arr.length <= 3 ? bau(arr) : `${bau(arr.slice(0, 3))}<details class="c-mehr"><summary>${arr.length - 3} weitere</summary>${bau(arr.slice(3))}</details>`;
  const raster = arr => `<div class="c-hilft">${arr.map(x => `<div class="c-hilft-feld">${ic(x.i || "stern")}<span>${esc(x.t)}</span></div>`).join("")}</div>`;
  const zeilen = arr => `<ul class="c-ruhe-liste">${arr.map(x => `<li>${ic(x.i || "stern")}<span>${esc(x.t)}</span></li>`).join("")}</ul>`;
  const tel = arr => `<div class="c-tel-liste">${arr.map(p => p.nr ? `<a class="c-tel" href="tel:${esc(String(p.nr).replace(/[^0-9+]/g, ""))}">${ic("telefon")}<span class="c-tel-text"><span class="c-tel-name">${esc(p.name)}</span><span class="c-tel-nr zahl">${esc(p.nr)}</span></span></a>` : `<div class="c-tel">${ic("telefon")}<span class="c-tel-text"><span class="c-tel-name">${esc(p.name)}</span></span></div>`).join("")}</div>`;
  const leer = t => `<p class="c-ruhe-leer">${t}</p>`;
  return `<div class="c-ruhe-schild"><span class="c-kicker">${A("Dein Satz", "Ihr Satz")}</span><p class="c-ruhe-satz">„${esc(ruheSatz())}“</p>
    <button class="knopf haupt voll" data-act="ruhe-jetzt">${ic("atem")} Jetzt Schritt für Schritt</button></div>
    <details class="c-wozu"><summary>Wofür ist der Plan?</summary><p>${A("Bei Unruhe, Anspannung und dergleichen, zu Hause oder unterwegs: Hier steht, was dir dann hilft. Am besten ab und zu an einem ruhigen Tag durchgehen – dann sitzt es, wenn du es brauchst.", "Bei Unruhe, Anspannung und dergleichen, zu Hause oder unterwegs: Hier steht, was Ihnen dann hilft. Am besten ab und zu an einem ruhigen Tag durchgehen – dann sitzt es, wenn Sie es brauchen.")}</p></details>
    <h3 class="c-ruhe-h">${A("Dein Plan", "Ihr Plan")}</h3>
    <div class="c-ruhe-fach"><h4>Was mir hilft</h4>${hilft.length ? mitMehr(hilft, raster) : leer("Noch nichts ausgewählt.")}</div>
    <div class="c-ruhe-fach"><h4>Wen ich anrufen kann</h4>${leute.length ? mitMehr(leute, tel) : leer("Noch niemand eingetragen.")}</div>
    ${unterwegs.length ? `<details class="c-ruhe-fach c-unterwegs"><summary>${ic("rucksack")}<span>Für unterwegs <span class="c-anzahl">· ${unterwegs.length} ${unterwegs.length === 1 ? "Punkt" : "Punkte"}</span></span></summary>${zeilen(unterwegs)}</details>` : `<div class="c-ruhe-fach"><h4>Für unterwegs</h4>${leer("Noch nichts ausgewählt.")}</div>`}
    <button class="knopf zweit voll" style="margin-top:12px" data-act="ruhe-bearbeiten">${ic("stift")} ${A("Plan zusammenstellen", "Plan zusammenstellen")}</button>
    <h3 class="c-ruhe-h">Üben, wenn es ruhig ist</h3>
    <div class="c-ruhe-ueben">
      <button class="c-ruhe-kachel" data-act="ruhe-atmen">${ic("atem")}<span class="c-rk-text"><span class="titel">Atmen üben</span><span class="unter">2 Minuten</span></span></button>
      <button class="c-ruhe-kachel" data-act="ruhe-probe">${ic("feder")}<span class="c-rk-text"><span class="titel">Probelauf</span><span class="unter">alle Schritte</span></span></button>
    </div>${R.geuebt ? `<p class="c-geuebt">${ic("stern")}<span>Schon ${R.geuebt}-mal geübt</span></p>` : ""}`;
}

/* ---------- Plan zusammenstellen ---------- */
function ruheBearbeitenSheet() { sheet({ titel: "Plan zusammenstellen", inhalt: ruheBearbeitenInhalt(), id: "ruhe-edit", fuss: `<button class="knopf haupt voll" data-act="ruhe-fertig">${ic("haken")} Fertig</button>` }); }
function ruheBearbeitenInhalt() {
  const R = ruheP();
  return `<p class="klein">Antippen zum Auswählen. Alles lässt sich jederzeit ändern.</p>
    <h3>Was mir hilft</h3><div class="chips">${D.ruhe.hilft.map(h => chip(R.hilft.includes(h.id), h.text, `data-act="ruhe-hilft" data-v="${h.id}"`)).join("")}
      ${(R.eigene || []).map((t, i) => chip(true, t, `data-act="ruhe-eigen-weg" data-i="${i}"`)).join("")}</div>
    <div class="zeile" style="margin-top:10px"><input id="ruhe-eigen" class="text" placeholder="Eigenes, z. B. Hühnchen in die Hand nehmen" aria-label="Eigenes hinzufügen"><button class="knopf zweit" data-act="ruhe-eigen" aria-label="Hinzufügen">${ic("plus")}</button></div>
    <h3 style="margin-top:20px">Wen ich anrufen kann</h3>
    ${(R.leute || []).length ? `<div class="liste">${R.leute.map((p, i) => `<div class="liste-zeile" style="cursor:default">${ic("telefon")}<span class="text"><span class="titel">${esc(p.name)}</span>${p.nr ? `<br><span class="unter zahl">${esc(p.nr)}</span>` : ""}</span><button class="knopf klein leise" data-act="ruhe-mensch-weg" data-i="${i}" aria-label="${esc(p.name)} entfernen">Entfernen</button></div>`).join("")}</div>` : `<p class="klein">Ein, zwei Menschen, bei denen ein kurzer Anruf reicht.</p>`}
    <div class="stapel" style="margin-top:10px"><input id="ruhe-name" class="text" placeholder="Name" aria-label="Name der Person zum Anrufen"><input id="ruhe-nr" class="text" placeholder="Telefonnummer (freiwillig)" inputmode="tel" aria-label="Telefonnummer"><button class="knopf zweit voll" data-act="ruhe-mensch">${ic("plus")} Dazu</button></div>
    <h3 style="margin-top:20px">Mein Satz</h3><div class="liste">${D.ruhe.saetze.map((s, i) => `<button class="liste-zeile" data-act="ruhe-satz" data-i="${i}" aria-pressed="${!R.satzEigen && (R.satz || 0) === i}">${ic(!R.satzEigen && (R.satz || 0) === i ? "boxhaken" : "box")}<span class="text">${esc(s)}</span></button>`).join("")}</div>
    <label class="feld" for="ruhe-satz-eigen">Oder ein eigener Satz</label><input id="ruhe-satz-eigen" class="text" data-ruhe="satzEigen" value="${esc(R.satzEigen || "")}" placeholder="Was ich mir selbst sagen möchte">
    <h3 style="margin-top:20px">Für unterwegs</h3><div class="chips">${D.ruhe.unterwegs.map(h => chip(R.unterwegs.includes(h.id), h.text, `data-act="ruhe-unterwegs" data-v="${h.id}"`)).join("")}
      ${(R.unterwegsEigen || []).map((t, i) => chip(true, t, `data-act="ruhe-ueigen-weg" data-i="${i}"`)).join("")}</div>
    <div class="zeile" style="margin-top:10px"><input id="ruhe-ueigen" class="text" placeholder="Eigenes für unterwegs" aria-label="Eigenes für unterwegs"><button class="knopf zweit" data-act="ruhe-ueigen" aria-label="Hinzufügen">${ic("plus")}</button></div>`;
}

/* ---------- Schritt für Schritt (jetzt oder als Probelauf) ---------- */
function ruheFlow(modus) {
  RUHE.modus = modus; RUHE.schritt = 0;
  sheet({ titel: modus === "probe" ? "Probelauf" : "Schritt für Schritt", inhalt: ruheSchrittHTML(), fuss: ruheFussHTML(), id: "ruhe-flow", voll: true, onclose: ruheStopp });
  ruheSchrittAn();
}
function ruheSchrittHTML() {
  const i = RUHE.schritt, R = ruheP();
  const punkte = `<p class="sr">Schritt ${i + 1} von ${RUHE_SCHRITTE}</p><div class="ruhe-punkte" aria-hidden="true">${Array.from({ length: RUHE_SCHRITTE }, (_, k) => `<i class="${k <= i ? "an" : ""}"></i>`).join("")}</div>`;
  const gross = t => `<p class="ruhe-gross">${t}</p>`;
  let h = "";
  if (i === 0) h = `<h2>Erst ein sicherer Platz</h2>${gross("Erst sicher stehen oder sitzen. Dann alles Weitere.")}<p>${A("Unterwegs: stehen bleiben oder die nächste Bank suchen. Zu Hause: hinsetzen, beide Füße auf den Boden.", "Unterwegs: stehen bleiben oder die nächste Bank suchen. Zu Hause: hinsetzen, beide Füße auf den Boden.")}</p>`;
  else if (i === 1) h = `<h2>Innehalten</h2>${gross("„Aha. Da ist sie, die Unruhe.“")}<p>Woher sie kommt, ist jetzt egal. Lösen muss ich auch nichts. Erst mal durchatmen.</p>`;
  else if (i === 2) h = `<h2>Atmen</h2>${atemKreisHTML()}<p class="klein" style="text-align:center">Ganz normal einatmen, nicht besonders tief. Langsam ausatmen, wie durch einen Strohhalm. Passt ein anderes Tempo besser, ist das richtig.</p>`;
  else if (i === 3) h = `<h2>Ankommen</h2><ul class="ruhe-fragen"><li>Was sehe ich gerade?</li><li>Was höre ich?</li><li>Was spüre ich unter Händen und Füßen?</li></ul><p class="klein">Ein paar Antworten reichen. Laut sagen hilft.</p>`;
  else if (i === 4) h = `<h2>Abwarten können</h2>${gross(`„${esc(ruheSatz())}“`)}<p>So eine Welle steigt, bleibt kurz oben und flaut wieder ab, meist schon nach ein paar Minuten. Ich muss nicht jedem Gedanken hinterherlaufen.</p>`;
  else if (i === 5) { const hilft = ruheHilftListe(); h = `<h2>Was jetzt guttut</h2>
      ${(R.leute || []).length ? `<div class="liste">${R.leute.map(p => p.nr ? `<a class="liste-zeile" href="tel:${esc(p.nr.replace(/[^\d+]/g, ""))}">${ic("telefon")}<span class="text"><span class="titel">${esc(p.name)} anrufen</span><br><span class="unter zahl">${esc(p.nr)}</span></span></a>` : `<div class="liste-zeile" style="cursor:default">${ic("telefon")}<span class="text"><span class="titel">${esc(p.name)}</span></span></div>`).join("")}</div><p class="klein" style="margin-top:8px">Erklären muss man nichts. Zum Beispiel: „Hast du kurz Zeit? Erzähl mir irgendwas, ich brauch grad eine Stimme.“</p>` : (RUHE.modus === "probe" ? `<button class="knopf zweit voll" data-act="ruhe-bearbeiten">${ic("telefon")} Jemanden zum Anrufen eintragen</button>` : "")}
      ${hilft.length ? `<ul class="ruhe-fragen">${hilft.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : `<p>Ein Glas Wasser, frische Luft, ein ruhiger Platz.</p>`}`; }
  else h = `<h2>Später</h2><p>Unterwegs gilt: Weiter geht’s, wenn ich mich wieder sicher fühle. Sonst hole ich mir jemanden dazu oder lasse mich abholen.</p><p>Wenn es ruhiger ist, kann ich mich fragen: Was weiß ich gerade wirklich? Gibt es einen nächsten kleinen Schritt? Und wenn nicht: Die Frage kann warten.</p>${gross("Geschafft. Wenn ein Schritt geholfen hat, reicht das völlig.")}`;
  return punkte + h + (i === 5 || i === 0 ? notfallKlein() : "");
}
function ruheFussHTML() {
  const i = RUHE.schritt, letzter = i === RUHE_SCHRITTE - 1;
  const haupt = letzter ? (RUHE.modus === "probe" ? `<button class="knopf haupt voll" data-act="ruhe-geuebt">${ic("haken")} Geübt – eintragen</button>` : `<button class="knopf haupt voll" data-act="sheet-zu">Fertig</button>`)
    : `<button class="knopf haupt voll" data-act="ruhe-weiter">${i === 0 ? "Ich bin an einem sicheren Platz" : "Weiter"}</button>`;
  const L = (ruheP().leute || []).filter(p => p.nr), anruf = RUHE.modus === "jetzt" && i > 0 && i !== 5 && L.length
    ? (L.length === 1 ? `<a class="knopf leise" href="tel:${esc(L[0].nr.replace(/[^\d+]/g, ""))}">${ic("telefon")} ${esc(L[0].name)} anrufen</a>` : `<button class="knopf leise" data-act="ruhe-anrufen">${ic("telefon")} Jemanden anrufen</button>`) : "";
  return `<div class="stapel">${haupt}<div class="zeile zwischen" style="flex-wrap:wrap">${i > 0 ? `<button class="knopf leise" data-act="ruhe-zurueck">Zurück</button>` : "<span></span>"}${anruf}</div></div>`;
}
function ruheSchrittAn() { clearInterval(RUHE.iv); if (RUHE.schritt === 2 || RUHE.modus === "atmen") atemStart(); }
function ruheStopp() { clearInterval(RUHE.iv); RUHE.iv = 0; }

/* ---------- Atemkreis: 4 Sekunden ein, 6 Sekunden aus ---------- */
function atemKreisHTML(mitZaehler) {
  return `<div class="atem-buehne"><div class="atem-kreis" id="atem-kreis"></div><div class="atem-text" id="atem-text" aria-live="polite">Einatmen</div></div>${mitZaehler ? `<p class="klein" id="atem-rest" style="text-align:center">2:00</p>` : ""}`;
}
function atemStart() {
  clearInterval(RUHE.iv);
  let t0 = Date.now(), phase = "";
  const schritt = () => {
    const k = $("#atem-kreis"), tx = $("#atem-text"); if (!k) { clearInterval(RUHE.iv); return; }
    const s = ((Date.now() - t0) / 1000) % 10, neu = s < 4 ? "ein" : "aus";
    const sek = neu === "ein" ? Math.ceil(4 - s) : Math.ceil(10 - s);
    if (neu !== phase) { phase = neu; k.className = "atem-kreis " + neu; haptik(neu === "ein" ? "auswahl" : "atemaus"); }
    tx.textContent = (neu === "ein" ? "Einatmen" : "Ausatmen") + (REDUCED() ? ` · ${sek}` : "");
    if (RUHE.modus === "atmen") {
      const rest = Math.max(0, RUHE.atemEnde - Date.now()), r = $("#atem-rest");
      if (r) { const s = Math.ceil(rest / 1000); r.textContent = rest > 0 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "Geschafft."; }
      if (rest <= 0 && !RUHE.fertig) { RUHE.fertig = true; sheetFuss(`<div class="stapel"><button class="knopf haupt voll" data-act="ruhe-geuebt">${ic("haken")} Geübt – eintragen</button><button class="knopf leise" data-act="ruhe-atmen-mehr">Noch eine Minute</button></div>`); haptik("erfolg"); }
    }
  };
  schritt(); RUHE.iv = setInterval(schritt, 250);
}
function atmenUebenSheet(min = 2) {
  RUHE.modus = "atmen"; RUHE.fertig = false; RUHE.atemEnde = Date.now() + min * 60000;
  sheet({ titel: "Atmen üben", inhalt: `<p>Bequem hinsetzen. Mit dem Kreis einatmen, ganz normal, nicht tief. Mit dem Kreis langsam ausatmen.</p>${atemKreisHTML(true)}`, fuss: `<div class="stapel"><button class="knopf zweit voll" data-act="ruhe-geuebt">Reicht für heute – eintragen</button></div>`, id: "ruhe-atmen", voll: true, onclose: ruheStopp });
  atemStart();
}

/* ---------- Aktionen ---------- */
function ruheAktion(a, d) {
  const R = ruheP();
  const tausch = (arr, v) => { const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); };
  const neuEdit = () => { speichern(); haptik("auswahl"); sheetInhalt(ruheBearbeitenInhalt()); };
  switch (a) {
    case "ruhe-plan": ruheSheet(); break;
    case "ruhe-jetzt": ruheFlow("jetzt"); break;
    case "ruhe-probe": ruheFlow("probe"); break;
    case "ruhe-atmen": atmenUebenSheet(2); break;
    case "ruhe-atmen-mehr": RUHE.atemEnde = Date.now() + 60000; RUHE.fertig = false; sheetFuss(`<div class="stapel"><button class="knopf zweit voll" data-act="ruhe-geuebt">Reicht für heute – eintragen</button></div>`); break;
    case "ruhe-weiter": RUHE.schritt = Math.min(RUHE_SCHRITTE - 1, RUHE.schritt + 1); sheetInhalt(ruheSchrittHTML()); sheetFuss(ruheFussHTML()); aktuellesSheet().querySelector(".sheet-inhalt").scrollTop = 0; ruheSchrittAn(); break;
    case "ruhe-anrufen": RUHE.schritt = 5; sheetInhalt(ruheSchrittHTML()); sheetFuss(ruheFussHTML()); ruheSchrittAn(); break;
    case "ruhe-zurueck": RUHE.schritt = Math.max(0, RUHE.schritt - 1); sheetInhalt(ruheSchrittHTML()); sheetFuss(ruheFussHTML()); ruheSchrittAn(); break;
    case "ruhe-geuebt": { ruheStopp(); R.geuebt = (R.geuebt || 0) + 1; speichern(); const r = eintragSpeichern({ t: "ruheuebung", tag: heute() }); if (r) nachEintrag(r, "Eingetragen: Ruhe geübt."); else { alleSheetsZu(); toast("Der Haken für heute steht schon. Geübt ist geübt."); } break; }
    case "ruhe-bearbeiten": ruheBearbeitenSheet(); break;
    case "ruhe-fertig": sheetZu(); setTimeout(() => { const id = aktuellesSheet()?.dataset.id; if (id === "ruhe") sheetInhalt(ruheInhalt()); else if (id === "ruhe-flow") { sheetInhalt(ruheSchrittHTML()); sheetFuss(ruheFussHTML()); } }, 260); break;
    case "ruhe-hilft": tausch(R.hilft, d.v); neuEdit(); break;
    case "ruhe-unterwegs": tausch(R.unterwegs, d.v); neuEdit(); break;
    case "ruhe-eigen": { const v = $("#ruhe-eigen").value.trim(); if (v) { (R.eigene = R.eigene || []).push(v.slice(0, 80)); neuEdit(); } break; }
    case "ruhe-eigen-weg": R.eigene.splice(Number(d.i), 1); neuEdit(); break;
    case "ruhe-ueigen": { const v = $("#ruhe-ueigen").value.trim(); if (v) { (R.unterwegsEigen = R.unterwegsEigen || []).push(v.slice(0, 80)); neuEdit(); } break; }
    case "ruhe-ueigen-weg": R.unterwegsEigen.splice(Number(d.i), 1); neuEdit(); break;
    case "ruhe-satz": R.satz = Number(d.i); R.satzEigen = ""; neuEdit(); break;
    case "ruhe-mensch": { const n = $("#ruhe-name").value.trim(), nr = $("#ruhe-nr").value.trim(); if (!n) { $("#ruhe-name").focus(); break; } (R.leute = R.leute || []).push({ name: n.slice(0, 40), nr: nr.slice(0, 30) }); neuEdit(); break; }
    case "ruhe-mensch-weg": R.leute.splice(Number(d.i), 1); neuEdit(); break;
    default: return false;
  }
  return true;
}
document.addEventListener("input", ev => { const k = ev.target.dataset && ev.target.dataset.ruhe; if (k) { ruheP()[k] = ev.target.value.trim().slice(0, 140); speichern(); } });
