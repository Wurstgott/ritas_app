/* ============================================================
   Mein Ruhe-Plan – für Momente, in denen es eng wird.
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
    "Ich darf anhalten. Ich darf mir helfen lassen. Ich muss niemandem etwas beweisen.",
    "Stehaufmännchen kippen auch mal. Und stehen wieder auf.",
    "Mein Kopf macht gerade Theater. Ich muss nicht mitspielen."
  ],
  unterwegs: [
    { id: "pausen", text: "Pausen vorher einplanen" },
    { id: "halt", text: "Wissen, wo ich anhalten oder aussteigen kann" },
    { id: "bescheid", text: "Jemand weiß, dass ich unterwegs bin" },
    { id: "ohren", text: "Musik oder Hörbuch dabei" },
    { id: "wasser", text: "Wasser und ein Bonbon in der Tasche" },
    { id: "pause", text: "Ich darf Pause machen. Und danach weiter." }
  ]
};
D.taetigkeiten.push({ id: "ruheuebung", name: "Ruhe geübt", kurz: "Ruhe geübt", art: "klein", feld: "sorge", bild: "quelle", tf: "ABCD", icon: "atem",
  info: ["Geübt. Dann sitzt es, wenn es drauf ankommt.", "Ruhe geübt. Das ist Training, genau wie Gehen."] });

let RUHE = { schritt: 0, modus: "jetzt", iv: 0, atemZ: 0, atemEnde: 0 };
const RUHE_SCHRITTE = 7;

function ruheP() { if (!S.ruhe) S.ruhe = frisch().ruhe; const u = S.ruhe.unterwegs.indexOf("umdrehen"); if (u >= 0) S.ruhe.unterwegs.splice(u, 1, "pause"); return S.ruhe; }
const notfallKlein = () => `<p class="klein" style="margin-top:14px">Druck oder Schmerz in der Brust, Luftnot, die nicht besser wird, Fieber oder „So kenne ich das nicht“: nicht abwarten, <a href="tel:112">112 anrufen</a>.</p>`;
function ruheSatz() { const R = ruheP(); return R.satzEigen || D.ruhe.saetze[R.satz || 0]; }
function ruheHilftListe() { const R = ruheP(); return [...D.ruhe.hilft.filter(h => R.hilft.includes(h.id)).map(h => h.text), ...(R.eigene || [])]; }
function ruheUnterwegsListe() { const R = ruheP(); return [...D.ruhe.unterwegs.filter(h => R.unterwegs.includes(h.id)).map(h => h.text), ...(R.unterwegsEigen || [])]; }

/* ---------- Übersicht ---------- */
function ruheSheet() { sheet({ titel: "Mein Ruhe-Plan", inhalt: ruheInhalt(), id: "ruhe" }); }
function ruheInhalt() {
  const R = ruheP(), hilft = ruheHilftListe();
  return `<p>${A("Für Momente, in denen es eng wird – zu Hause oder unterwegs. Am besten an ruhigen Tagen üben, gern auch mal auf einer Bank oder im Café. Dann sitzt es, wenn es drauf ankommt.", "Für Momente, in denen es eng wird – zu Hause oder unterwegs. Am besten an ruhigen Tagen üben, gern auch mal auf einer Bank oder im Café. Dann sitzt es, wenn es drauf ankommt.")}</p>
    <button class="knopf haupt voll" data-act="ruhe-jetzt">${ic("atem")} Jetzt Schritt für Schritt</button>
    <h3 style="margin-top:20px">Üben</h3><div class="liste">
      ${zeileBtn("atem", "Atmen üben", "2 Minuten, länger aus als ein", `data-act="ruhe-atmen"`, "k-ruhe")}
      ${zeileBtn("feder", "Probelauf", "Alle Schritte einmal in Ruhe durchgehen", `data-act="ruhe-probe"`, "k-ruhe")}
    </div>${R.geuebt ? `<p class="klein" style="margin-top:6px">Schon ${R.geuebt}-mal geübt.</p>` : ""}
    <h3 style="margin-top:20px">${A("Dein Plan", "Ihr Plan")}</h3>
    <div class="bogen mulde ruhe-plan">
      <p class="serif" style="margin:0 0 10px;font-size:1.1rem">„${esc(ruheSatz())}“</p>
      ${hilft.length ? `<p style="margin:0 0 4px;font-weight:700">Was mir hilft</p><ul>${hilft.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${(R.leute || []).length ? `<p style="margin:10px 0 4px;font-weight:700">Wen ich anrufen kann</p><ul>${R.leute.map(p => `<li>${esc(p.name)}${p.nr ? ` · <span class="zahl">${esc(p.nr)}</span>` : ""}</li>`).join("")}</ul>` : ""}
      ${ruheUnterwegsListe().length ? `<p style="margin:10px 0 4px;font-weight:700">Für unterwegs</p><ul>${ruheUnterwegsListe().map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    </div>
    <button class="knopf zweit voll" style="margin-top:10px" data-act="ruhe-bearbeiten">${ic("feder")} ${A("Plan zusammenstellen", "Plan zusammenstellen")}</button>
    <p class="klein" style="margin-top:16px">Nicht jedes Körpergefühl ist Unruhe. Druck oder Schmerz in der Brust, Luftnot, die nicht besser wird, Fieber oder etwas ganz Ungewohntes: nicht abwarten, <a href="tel:112">112</a>. Gut ist, einmal mit der Ärztin zu besprechen, bei welchen Beschwerden ${A("du", "Sie")} sofort anrufen ${A("sollst", "sollen")}. Der Plan ersetzt keine Behandlung.</p>`;
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
  if (i === 0) h = `<h2>Erst ein sicherer Platz</h2>${gross("Erst sicher stehen oder sitzen. Dann alles Weitere.")}<p>${A("Unterwegs: aufmerksam bleiben, langsamer werden und an der nächsten sicheren Stelle anhalten. Das Handy erst in die Hand nehmen, wenn du stehst. Zu Hause: hinsetzen, beide Füße auf den Boden.", "Unterwegs: aufmerksam bleiben, langsamer werden und an der nächsten sicheren Stelle anhalten. Das Handy erst in die Hand nehmen, wenn Sie stehen. Zu Hause: hinsetzen, beide Füße auf den Boden.")}</p>`;
  else if (i === 1) h = `<h2>Innehalten</h2>${gross("„Aha. Da ist sie wieder, die Unruhe.“")}<p>Woher sie kommt, ist jetzt egal. Lösen muss ich auch nichts. Erst mal durchatmen.</p>`;
  else if (i === 2) h = `<h2>Atmen</h2>${atemKreisHTML()}<p class="klein" style="text-align:center">Ganz normal einatmen, nicht besonders tief. Langsam ausatmen, wie durch einen Strohhalm. Passt ein anderes Tempo besser, ist das richtig.</p>`;
  else if (i === 3) h = `<h2>Ankommen</h2><ul class="ruhe-fragen"><li>Was sehe ich gerade?</li><li>Was höre ich?</li><li>Was spüre ich unter Händen und Füßen?</li></ul><p class="klein">Ein paar Antworten reichen. Laut sagen hilft.</p>`;
  else if (i === 4) h = `<h2>Abwarten können</h2>${gross(`„${esc(ruheSatz())}“`)}<p>So eine Welle steigt, bleibt kurz oben und flaut wieder ab, meist schon nach ein paar Minuten. Ich muss nicht jedem Gedanken hinterherlaufen.</p>`;
  else if (i === 5) { const hilft = ruheHilftListe(); h = `<h2>Was jetzt guttut</h2>${hilft.length ? `<ul class="ruhe-fragen">${hilft.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : `<p>Ein Glas Wasser, frische Luft, ein ruhiger Platz.</p>`}
      ${(R.leute || []).length ? `<h3 style="margin-top:14px">Anrufen</h3><div class="liste">${R.leute.map(p => p.nr ? `<a class="liste-zeile" href="tel:${esc(p.nr.replace(/[^\d+]/g, ""))}">${ic("telefon")}<span class="text"><span class="titel">${esc(p.name)}</span><br><span class="unter zahl">${esc(p.nr)}</span></span></a>` : `<div class="liste-zeile" style="cursor:default">${ic("telefon")}<span class="text"><span class="titel">${esc(p.name)}</span></span></div>`).join("")}</div>` : ""}
      ${(R.leute || []).length ? `<p class="klein" style="margin-top:10px">Erklären muss man nichts. Zum Beispiel: „Hast du kurz Zeit? Erzähl mir irgendwas, ich brauch grad eine Stimme.“</p>` : `<p class="klein" style="margin-top:10px">Ein Anruf hilft oft.</p>${RUHE.modus === "probe" ? `<button class="knopf zweit voll" data-act="ruhe-bearbeiten">${ic("telefon")} Jemanden zum Anrufen eintragen</button>` : ""}`}`; }
  else h = `<h2>Später</h2><p>Unterwegs gilt: Weiter geht es erst, wenn ich mich wieder sicher und klar fühle. Wenn nicht, hole ich mir jemanden dazu oder lasse mich abholen. Das ist kein Aufgeben, das ist klug.</p><p>Wenn es ruhiger ist, kann ich mich fragen: Was weiß ich gerade wirklich? Gibt es einen nächsten kleinen Schritt? Und wenn nicht: Die Frage kann warten.</p>${gross("Geschafft. Wenn ein Schritt geholfen hat, reicht das völlig.")}`;
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
    case "ruhe-geuebt": { ruheStopp(); R.geuebt = (R.geuebt || 0) + 1; speichern(); const r = eintragSpeichern({ t: "ruheuebung", tag: heute() }); if (r) nachEintrag(r, "Ruhe geübt."); else { alleSheetsZu(); toast("Der Haken für heute steht schon. Geübt ist geübt."); } break; }
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
