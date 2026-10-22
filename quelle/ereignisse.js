/* ============================================================
   Zufällige Ereignisse: Max, Jane, Micha, Karin oder Hühnchen
   schauen kurz vorbei – mit sprechender Figur, Antworten und
   kleinen Effekten. Höchstens eins am Tag, nie am ersten Tag,
   nicht an Sparflamme-Tagen, abschaltbar mit den Überraschungen.
   ============================================================ */
const EREIGNISSE = [
  /* ---------- Max ---------- */
  { id: "max-rad", wer: "max", zeilen: ["Ich fahr gerade mit dem Rad an der Saale lang.", "Und da dachte ich: Kurz bei Rita klingeln. Digital."],
    antworten: [{ text: "Tschüss-Duell?", sagt: "Oh nein. Oh doch. Ich ruf an!", aktion: "tel:max" }, { text: "Fahr vorsichtig!", sagt: "Mach ich. Fast immer. Tschüss!", effekt: "herzen" }] },
  { id: "max-backen", wer: "max", zeilen: ["Mama hat mir ihr Kuchenrezept geschickt.", "Ich hab’s versucht. Ergebnis: essbar. Knapp."],
    antworten: [{ text: "Schick ein Foto!", sagt: "Lieber nicht. Das ist jetzt Beweismaterial." }, { text: "Nächstes Mal backen wir zusammen", sagt: "Abgemacht! Du rührst, ich esse.", effekt: "herzen" }] },
  { id: "max-quiz", wer: "max", zeilen: ["Kurze Quizfrage, ganz spontan:", "Wie viele Kapitel hat der Feuerkelch?"],
    antworten: [{ text: "37", sagt: "Richtig! Du Streberin. Ich bin stolz.", effekt: "konfetti" }, { text: "Zu viele", sagt: "Auch richtig. Aber jedes einzelne lohnt sich." }] },
  { id: "max-tv", wer: "max", wenn: () => typeof tvDaten === "function" && (tvDaten().fernsehen || []).some(x => x.datum === heute()), zeilen: ["Psst, ich hab dir was rausgesucht.", "Heute Abend läuft was Gutes im Fernsehen."],
    antworten: [{ text: "Zeig her!", sagt: "Bitte sehr. Popcorn musst du selbst machen.", aktion: "tv-auf" }, { text: "Ich lese lieber", sagt: "Auch gut. Hermine wäre einverstanden." }] },
  { id: "max-wetter", wer: "max", zeilen: ["In Halle regnet’s seit drei Tagen.", "Wie ist es bei dir im Forst?"],
    antworten: [{ text: "Sonne!", sagt: "Gemein. Schick mir welche rüber!", effekt: "sonne" }, { text: "Auch grau", sagt: "Dann trinken wir jetzt beide einen Tee. Gleichzeitig. Auf Abstand." }] },
  { id: "max-nikolaus", wer: "max", wann: { monat: 12, tag: 6 }, zeilen: ["Hast du gestern Abend die Stiefel rausgestellt?", "Ich frag nur, weil … ach, schau einfach mal in die Post."],
    antworten: [{ text: "Natürlich!", sagt: "Dann ist ja alles vorbereitet. Ho ho ho!", effekt: "schnee" }] },
  { id: "max-spotify", wer: "max", wenn: () => !S.spotify, zeilen: ["Ich hab gerade eine Playlist gemacht: ‚Ritas Sonntag‘.", "Leider kannst du sie noch nicht hören …"],
    antworten: [{ text: "Erzähl mehr", sagt: "Ich hätte da ein Angebot.", aktion: "spotify-info" }, { text: "Ich hab ja YouTube", sagt: "Stimmt. Und ein Radio. Und mich." }] },
  /* ---------- Jane ---------- */
  { id: "jane-sonntag", wer: "jane", wann: { wochentag: 0, von: 10, bis: 15 }, zeilen: ["Rita! Der Braten ist im Ofen und ich hab wieder viel zu viel Soße gemacht.", "Wie immer eigentlich."],
    antworten: [{ text: "Heb mir was auf!", sagt: "Ist schon im Glas. Mit Deckel und Namen drauf.", effekt: "herzen" }, { text: "Was gibt’s dazu?", sagt: "Klöße. Und Rotkohl. Und Micha, der vorher nascht." }] },
  { id: "jane-kuchen", wer: "jane", zeilen: ["Ich hab einen Kuchen gebacken, der aussieht wie ein Unfall.", "Aber er schmeckt wie ein Gedicht."],
    antworten: [{ text: "Welcher denn?", sagt: "Pflaume. Oder Apfel. Das Etikett ist abgefallen." }, { text: "Ich will ein Stück!", sagt: "Liegt schon auf dem Teller mit deinem Namen.", effekt: "herzen" }] },
  { id: "jane-krimi", wer: "jane", zeilen: ["Hast du den neuen Kommissar Beck gesehen?", "Ich hab den Täter in Minute zwölf erraten!"],
    antworten: [{ text: "Verrat bloß nichts!", sagt: "Meine Lippen sind versiegelt. Mmmh-mmh." }, { text: "Wo läuft der?", sagt: "In der Mediathek. Ich zeig’s dir.", aktion: "tv-auf" }] },
  { id: "jane-runde", wer: "jane", zeilen: ["Lust auf eine Runde im Forst?", "Ich bring die Thermoskanne mit und Zimtschnecken."],
    antworten: [{ text: "Sehr gern!", sagt: "Ich schreib’s dir auf die Liste!", aktion: "liste:Runde im Forst mit Jane", effekt: "herzen" }, { text: "Diese Woche nicht", sagt: "Dann nächste. Die Zimtschnecken warten." }] },
  { id: "jane-test", wer: "jane", wann: { monate: [10, 11, 12, 1, 2, 3] }, zeilen: ["Ich komm am Wochenende vorbei.", "Test mach ich vorher – versprochen. Und ich bring die gute Butter."],
    antworten: [{ text: "Du bist die Beste", sagt: "Ich weiß. Aber sag’s ruhig öfter.", effekt: "herzen" }, { text: "Und Kuchen?", sagt: "Rita. Ich bitte dich. Natürlich Kuchen." }] },
  { id: "jane-telefon", wer: "jane", zeilen: ["Ich hab eben was Unglaubliches beim Bäcker gehört.", "Aber das erzähl ich dir lieber am Telefon."],
    antworten: [{ text: "Ruf an!", sagt: "Klingelt schon!", aktion: "tel:jane" }, { text: "Ich bin gespannt", sagt: "Zu Recht. Es geht um Mohnschnecken." }] },
  /* ---------- Micha ---------- */
  { id: "micha-chili", wer: "micha", wann: { monate: [8, 9, 10] }, zeilen: ["Rita, meine Chilis tragen wie verrückt.", "Willst du welche? Die gelben sind harmlos. Die roten nicht."],
    antworten: [{ text: "Die gelben, bitte", sagt: "Vernünftige Frau. Ich pack dir welche ein." }, { text: "Die roten! Ich bin mutig.", sagt: "Ich ruf schon mal vorsorglich die Feuerwehr.", effekt: "konfetti" }] },
  { id: "micha-werkzeug", wer: "micha", zeilen: ["Falls bei dir was klemmt – Schublade, Fenster, Weltlage –", "ich hab Werkzeug."],
    antworten: [{ text: "Die Weltlage!", sagt: "Da brauch ich den ganz großen Schraubenzieher." }, { text: "Alles läuft", sagt: "Sehr gut. Dann geh ich wieder zu meinen Chilis." }] },
  { id: "micha-gruss", wer: "micha", zeilen: ["Jane steht neben mir und sagt, ich soll schön grüßen.", "Also: schön grüßen!"],
    antworten: [{ text: "Grüß zurück!", sagt: "Mach ich. Sie hat übrigens schon wieder Kuchen gebacken.", effekt: "herzen" }] },
  /* ---------- Karin ---------- */
  { id: "karin-sotis", wer: "karin", zeilen: ["Hej Rita! Sotis hat heute einen Elch gesehen. Sagt sie.", "Ich glaube, es war der Briefkasten."],
    antworten: [{ text: "Ha! Typisch Katze.", sagt: "Precis! Sie ist trotzdem sehr stolz." }, { text: "Hast du mir geschrieben?", sagt: "Ja! Der Brief liegt bei dir.", aktion: "bv-auf" }] },
  { id: "karin-fika", wer: "karin", wann: { wochentag: 5, von: 13, bis: 18 }, zeilen: ["Det är fredag – fika!", "Was gibt’s bei dir heute zum Kaffee?"],
    antworten: [{ text: "Kanelbulle!", sagt: "Bra val! Du bist halbe Schwedin.", effekt: "konfetti" }, { text: "Nur Kekse", sagt: "Kekse zählen. Das ist lagom." }] },
  { id: "karin-lucia", wer: "karin", wann: { monat: 12, tag: 13 }, zeilen: ["Glad Lucia, Rita!", "Heute tragen hier alle Kerzen auf dem Kopf. Ich bleib bei meiner Mütze."],
    antworten: [{ text: "Glad Lucia!", sagt: "Tack! Und jetzt: Safranschnecken.", effekt: "schnee" }] },
  { id: "karin-krimi", wer: "karin", zeilen: ["Ich lese gerade einen Krimi, der so spannend ist,", "dass ich die Katze vergessen habe zu füttern. Sie hat sich beschwert."],
    antworten: [{ text: "Welcher?", sagt: "Martin Beck. Zum dritten Mal. Ich vergess immer, wer’s war." }, { text: "Arme Sotis!", sagt: "Sie hat jetzt doppelt bekommen. Lagom ist das nicht." }] },
  /* ---------- Greta (Max’ Freundin) ---------- */
  { id: "greta-umzug", wer: "greta", zeilen: ["Hallo Rita! Ich packe gerade Kisten für Leipzig.", "Max sagt, du hast den besten Tipp gegen Umzugschaos."],
    antworten: [{ text: "Listen!", sagt: "Er hat gesagt, dass du das sagst. Ich schreib jetzt eine Liste.", effekt: "konfetti" }, { text: "Alles beschriften", sagt: "Hab ich! Auf einer Kiste steht jetzt ‚Kram, wichtig‘." }] },
  { id: "greta-gruenkohl", wer: "greta", wann: { monate: [10, 11, 12, 1, 2] }, zeilen: ["Ich hab heute Grünkohl geerntet.", "Der schmeckt erst nach dem ersten Frost richtig gut – wusstest du das?"],
    antworten: [{ text: "Natürlich!", sagt: "Klar weißt du das. Max sagt, du weißt eigentlich alles." }, { text: "Warum eigentlich?", sagt: "Bei Kälte macht die Pflanze aus Stärke Zucker – als Frostschutz. Darum wird er süßer." }] },
  { id: "greta-maxklein", wer: "greta", zeilen: ["Ich wollte dich schon lange mal was fragen:", "Wie war Max eigentlich als kleiner Junge?"],
    antworten: [{ text: "Ein Wirbelwind!", sagt: "Das erklärt einiges. Danke, ich sammle Beweise.", effekt: "herzen" }, { text: "Das bleibt unter uns", sagt: "Hihi. Dann frag ich nächstes Mal wieder." }] },
  { id: "greta-tee", wer: "greta", wann: { monate: [10, 11, 12, 1, 2, 3] }, zeilen: ["Ich hab dir eine Teemischung zusammengestellt:", "Thymian, Salbei und ein bisschen Ingwer. Max bringt sie dir mit."],
    antworten: [{ text: "Wie lieb von dir!", sagt: "Gern! Zehn Minuten ziehen lassen, mit Deckel.", effekt: "herzen" }, { text: "Mehr Tee-Ideen?", sagt: "Hier hab ich dir ein paar rausgesucht.", aktion: "wi-auf" }] },
  /* ---------- Pauli (Max’ Schwester) ---------- */
  { id: "pauli-wie", wer: "pauli", zeilen: ["Hey Rita! Ich wollt einfach mal fragen, wie’s dir geht.", "Ganz ohne Grund."],
    antworten: [{ text: "Richtig gut!", sagt: "Schön! Max sagt immer, du bist die Coolste von allen.", effekt: "herzen" }, { text: "Erzähl du lieber!", sagt: "War auf einer Demo und hab danach drei Stunden diskutiert. Also: alles wie immer." }] },
  { id: "pauli-buch", wer: "pauli", zeilen: ["Hast du einen Buchtipp für mich?", "Gern was mit starken Frauen."],
    antworten: [{ text: "Pippi Langstrumpf!", sagt: "Ha! Die Urmutter aller starken Frauen. Stark.", effekt: "konfetti" }, { text: "Einen Krimi!", sagt: "Mit einer Kommissarin, die allen die Show stiehlt? Gekauft." }] },
  { id: "pauli-kaffee", wer: "pauli", zeilen: ["Max und ich waren heute in Halle Kaffee trinken.", "Wir haben über dich geredet. Nur Gutes, versprochen."],
    antworten: [{ text: "Das will ich hoffen!", sagt: "Ehrenwort. Du bist bei uns quasi Familienlegende.", effekt: "herzen" }, { text: "Grüß Max!", sagt: "Mach ich. Er grinst schon." }] },
  /* ---------- Max erzählt (Rita weiß ja eh alles) ---------- */
  { id: "max-leipzig", wer: "max", zeilen: ["Ich muss dir was erzählen:", "Greta und ich haben uns Wohnungen in Leipzig angeguckt!"],
    antworten: [{ text: "Erzähl!", sagt: "Altbau, Balkon, und Platz für einen Gast. Rate mal, für wen.", effekt: "herzen" }, { text: "Und Halle?", sagt: "Ist ja nur eine halbe Stunde. Und Berlin bleibt Berlin." }] },
  { id: "max-rat", wer: "max", zeilen: ["Ich brauch mal deinen Rat – du kennst mich ja besser als ich mich selbst.", "Buch oder Pflanze als Geschenk für Greta?"],
    antworten: [{ text: "Eine Pflanze!", sagt: "Stimmt, die studierte Gärtnerin. Wie immer: Du hast recht." }, { text: "Beides!", sagt: "Ein Buch über Pflanzen! Du bist ein Genie.", effekt: "konfetti" }] },
  { id: "max-danke", wer: "max", selten: .3, zeilen: ["Ich hab heute an dich gedacht. Einfach so.", "Danke, dass du immer da bist."],
    antworten: [{ text: "Immer gern, mein Lieber", sagt: "Ich weiß. Genau deshalb. Tschüss! … Ach, nee, das wird sonst wieder ein Duell.", effekt: "herzen" }] },
  /* ---------- Hühnchen ---------- */
  { id: "huhn-detektiv", wer: "huhn", zeilen: ["Ich ermittle in einem Fall.", "Jemand hat einen Keks gegessen. Die Spuren führen … zu dir."],
    antworten: [{ text: "Ich war’s!", sagt: "Wusst ich’s doch! Fall gelöst.", effekt: "konfetti" }, { text: "Das warst du!", sagt: "Ich … hab kein Alibi. Und keine Hände. Freispruch!" }] },
  { id: "huhn-tanz", wer: "huhn", zeilen: ["Ich hab heute Nacht geübt.", "Pass auf, jetzt kommt’s!"],
    antworten: [{ text: "Zeig her!", sagt: "Ta-daaa!", effekt: "noten", tanz: true }, { text: "Lieber später", sagt: "Dann übe ich noch ein bisschen. Heimlich." }] },
  { id: "huhn-wetter", wer: "huhn", zeilen: ["Wetterbericht vom Fensterbrett:", "Hundert Prozent Chance auf Tee."],
    antworten: [{ text: "Klingt gut", sagt: "Ich empfehle Ingwer. Ich hab da ein paar Rezepte.", aktion: "wi-auf" }, { text: "Und morgen?", sagt: "Morgen: leicht bewölkt mit Aussicht auf Kuchen." }] },
  { id: "huhn-grusel", wer: "huhn", wann: { monat: 10, tag: 31 }, zeilen: ["Buh!", "… hast du dich erschrocken? Ein bisschen? Ein ganz kleines bisschen?"],
    antworten: [{ text: "Fürchterlich!", sagt: "Jaaa! Ich bin ein Gespenst-Huhn!", effekt: "konfetti" }, { text: "Nö.", sagt: "Mist. Nächstes Jahr dann." }] },
  { id: "huhn-schnee", wer: "huhn", wann: { monate: [12, 1, 2] }, zeilen: ["Ich hab gehört, es soll schneien.", "Ich hab noch nie Schnee gesehen. Ich bin aus Peru!"],
    antworten: [{ text: "Er ist kalt und weich", sagt: "Wie Quark? Nur von oben?", effekt: "schnee" }, { text: "Du wirst staunen", sagt: "Ich staune jetzt schon. Vorsorglich." }] },
  { id: "huhn-buch", wer: "huhn", zeilen: ["Ich hab heimlich in deinem Buch gelesen.", "Keine Sorge, ich hab das Lesezeichen wieder richtig reingelegt. Glaub ich."],
    antworten: [{ text: "Und? Gut?", sagt: "Zu wenig Hühner. Sonst prima.", aktion: "lesebegleiter" }, { text: "Hühnchen!", sagt: "Ich konnt nicht anders. Die Spannung!" }] },
];
const ER_WER = { max: "Max", jane: "Jane", micha: "Micha", karin: "Karin", greta: "Greta", pauli: "Pauli", huhn: "Hühnchen" };
function erFigur(wer, gr) {
  if (wer === "huhn") return huhnFrontSVG(gr);
  return { max: maxSVG, jane: janeSVG, micha: michaSVG, karin: karinKopfSVG, greta: gretaSVG, pauli: pauliSVG }[wer](gr);
}
function erPasst(e) {
  const d = jetzt(), w = e.wann || {};
  if (w.monat && d.getMonth() + 1 !== w.monat) return false;
  if (w.tag && d.getDate() !== w.tag) return false;
  if (w.monate && !w.monate.includes(d.getMonth() + 1)) return false;
  if (w.wochentag != null && d.getDay() !== w.wochentag) return false;
  if (w.von != null && (d.getHours() < w.von || d.getHours() >= w.bis)) return false;
  if (e.wer === "huhn" && !S.huhn) return false;
  if (e.wenn && !e.wenn()) return false;
  if (e.selten && (hash32('sel' + e.id + heute()) % 100) / 100 > e.selten) return false;
  return true;
}
function ereignisPruefen() {
  if (S.eierAus || !S.onboard || SHEETS.length || $(".ereignis") || S.timer) return;
  const h = heute(); S.ereignisse = S.ereignisse || {};
  if (h === S.start || S.ereignisTag === h || S.tf[h] === "D") return;
  const kand = EREIGNISSE.filter(e => erPasst(e) && !(S.ereignisse[e.id] && (tagDatum(h) - tagDatum(S.ereignisse[e.id])) / 864e5 < 45));
  if (!kand.length) return;
  const datiert = kand.filter(e => e.wann && (e.wann.tag || e.wann.wochentag != null));
  const chance = datiert.length ? .8 : .35;
  if ((hash32("er" + h + S.seed) % 1000) / 1000 > chance) { S.ereignisTag = h; speichern(); return; }
  const pool = datiert.length ? datiert : kand;
  const e = pool[hash32("erw" + h + S.seed) % pool.length];
  S.ereignisTag = h; S.ereignisse[e.id] = h; speichern();
  setTimeout(() => ereignisZeigen(e), 1400);
}
function ereignisZeigen(e) {
  if (typeof e === "string") e = EREIGNISSE.find(x => x.id === e); if (!e || $(".ereignis")) return;
  const el = document.createElement("div"); el.className = "ereignis"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", `${ER_WER[e.wer]} schaut vorbei`);
  el.innerHTML = `<button class="ereignis-zu" data-er="zu" aria-label="Schließen">${ic("schliessen")}</button><div class="ereignis-kopf"><div class="er-figur fig-idle ${e.wer === "huhn" ? "er-huhn" : ""}">${erFigur(e.wer, 84)}</div><div class="er-text"><span class="er-name">${ER_WER[e.wer]}</span><p class="er-blase" aria-live="polite"></p></div></div><div class="er-antworten"></div>`;
  document.body.appendChild(el); haptik("auswahl");
  const fig = el.querySelector(".er-figur"), blase = el.querySelector(".er-blase"), ant = el.querySelector(".er-antworten");
  let i = 0;
  const weiter = () => {
    if (i < e.zeilen.length) { sprechen(blase, e.zeilen[i], fig, () => { i++; setTimeout(weiter, 650); }); return; }
    ant.innerHTML = e.antworten.map((a, k) => `<button class="knopf zweit" data-er="a" data-k="${k}">${esc(a.text)}</button>`).join("");
  };
  setTimeout(weiter, 450);
  el.addEventListener("click", ev => {
    const b = ev.target.closest("[data-er]"); if (!b) return;
    if (b.dataset.er === "zu") { ereignisWeg(el); return; }
    const a = e.antworten[Number(b.dataset.k)]; ant.innerHTML = "";
    sprechen(blase, a.sagt, fig, () => {
      if (a.effekt) erEffekt(a.effekt, fig);
      if (a.tanz) fig.classList.add("er-tanzt");
      if (a.aktion && a.aktion.startsWith("liste:")) { S.liste = S.liste || []; S.liste.push({ id: "l" + Date.now().toString(36), text: a.aktion.slice(6), neu: heute() }); speichern(); render({ halteScroll: true, ohneAnim: true }); }
      setTimeout(() => {
        ereignisWeg(el);
        if (a.aktion && !a.aktion.startsWith("liste:")) setTimeout(() => {
          if (a.aktion.startsWith("tel:")) telStarten(a.aktion.slice(4)); else aktion(a.aktion, {}, document.body);
        }, 260);
      }, a.aktion ? 900 : 2400);
    });
  });
}
function ereignisWeg(el) { el.classList.add("weg"); setTimeout(() => el.remove(), 300); }
/* Sprechen: Text erscheint Buchstabe für Buchstabe, der Mund bewegt sich dazu */
function sprechen(ziel, text, fig, fertig) {
  ziel.textContent = ""; if (fig) fig.classList.add("spricht");
  if (REDUCED()) { ziel.textContent = text; if (fig) setTimeout(() => fig.classList.remove("spricht"), 400); if (fertig) setTimeout(fertig, 500); return; }
  let n = 0; const tick = () => { n++; ziel.textContent = text.slice(0, n); if (n < text.length) setTimeout(tick, /[.,!?…–]/.test(text[n - 1]) ? 160 : 32); else { if (fig) fig.classList.remove("spricht"); if (fertig) fertig(); } };
  tick();
}
function erEffekt(art, fig) {
  const r = fig.getBoundingClientRect(), zeichen = { konfetti: ["✦", "●", "▲", "■"], herzen: ["♥"], noten: ["♪", "♫"], schnee: ["❄", "✻", "•"], sonne: ["☀"] }[art] || ["✦"];
  const farben = ["#C8462F", "#E2A93B", "#2F7A4F", "#2F5E8E", "#B0505A"];
  for (let i = 0; i < (art === "konfetti" ? 18 : 9); i++) {
    const s = document.createElement("span"); s.className = "er-flug er-" + art; s.textContent = zeichen[i % zeichen.length];
    s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + r.height / 3) + "px";
    s.style.setProperty("--dx", ((Math.random() - .5) * 220) + "px"); s.style.setProperty("--dy", (-60 - Math.random() * 140) + "px");
    if (art === "konfetti") s.style.color = farben[i % farben.length];
    s.style.animationDelay = (i * 40) + "ms"; document.body.appendChild(s); setTimeout(() => s.remove(), 2200);
  }
}
