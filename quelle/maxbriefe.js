/* ============================================================
   Briefe von Max – ab und zu ein richtiger Brief (alle 9–14 Tage, fest nach Datum),
   dazu Ritas Geburtstag: Torte auf „Heute“, goldenes Licht, Geburtstagsbrief.
   Alles hier; in den anderen Dateien stehen nur kleine Haken (typeof-geprüft).
   Zustand: S.maxBriefe = { archiv, gbMigr, entMigr, letzteEmpf, puste, gbTaler, benutzt }, S.entdeckt = { funktion: datum }
   ============================================================ */

/* ---------- kleine Helfer ---------- */
const MB_ART_GB = "gb", MB_ART_BRIEF = "brief";
function mbS() { if (!S.maxBriefe || typeof S.maxBriefe !== "object" || Array.isArray(S.maxBriefe)) S.maxBriefe = { archiv: [], gbMigr: 1, entMigr: 1, letzteEmpf: "", puste: "", gbTaler: "", benutzt: {} }; if (!Array.isArray(S.maxBriefe.archiv)) S.maxBriefe.archiv = []; if (!S.maxBriefe.benutzt || typeof S.maxBriefe.benutzt !== "object") S.maxBriefe.benutzt = {}; return S.maxBriefe; }
const mbTage = (a, b) => Math.round((tagDatum(b) - tagDatum(a)) / 864e5);
function mbDatum(tag) { const d = tagDatum(tag); return `${d.getDate()}. ${MONAT[d.getMonth()]}`; }
function mbUnd(arr) { return arr.length < 2 ? arr.join("") : arr.slice(0, -1).join(", ") + " und " + arr[arr.length - 1]; }
function mbZahl(n) { return ["null", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"][n] || String(n); }
function mbMal(n) { return n === 1 ? "einmal" : `${n} Mal`; }
/* Text aus einem Vorrat wählen: fest nach Schlüssel, aber nicht dasselbe wie in den letzten Briefen */
function mbWaehle(arr, key, art) {
  const B = mbS().benutzt, zuletzt = Array.isArray(B[art]) ? B[art] : [], n = arr.length; if (!n) return "";
  const sperre = zuletzt.slice(-Math.min(n - 1, 6));
  let i = hash32(key + ":" + S.seed) % n;
  for (let k = 0; k < n && sperre.includes(i); k++) i = (i + 1) % n;
  B[art] = [...zuletzt, i].slice(-8);
  return arr[i];
}
const mbFill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? v[k] : "");

/* ---------- Zustand & Migration ---------- */
function mbMigrieren() {
  const M = mbS();
  // Geburtstag: einmalig auf den 7. Dezember setzen, wenn noch nichts eingetragen ist (Eigenes bleibt)
  if (!M.gbMigr) { if (typeof S.geburtstag !== "string" || !/^\d{2}-\d{2}$/.test(S.geburtstag)) S.geburtstag = "12-07"; M.gbMigr = 1; }
  if (S.geburtstag != null && typeof S.geburtstag !== "string") S.geburtstag = "";
  if (!S.entdeckt || typeof S.entdeckt !== "object" || Array.isArray(S.entdeckt)) S.entdeckt = {};
  for (const k in S.entdeckt) if (typeof S.entdeckt[k] !== "string") delete S.entdeckt[k];
  M.archiv = M.archiv.filter(b => b && typeof b === "object" && /^\d{4}-\d{2}-\d{2}$/.test(b.tag || "") && Array.isArray(b.absaetze) && b.absaetze.every(p => typeof p === "string")).slice(-200);
  M.archiv.forEach(b => { if (b.art !== MB_ART_GB) b.art = MB_ART_BRIEF; if (b.wd && (typeof b.wd !== "object" || typeof b.wd.text !== "string")) b.wd = null; ["anrede", "schluss", "gruss", "ps"].forEach(k => { if (typeof b[k] !== "string") b[k] = ""; }); });
  if (typeof M.letzteEmpf !== "string") M.letzteEmpf = "";
  if (typeof M.puste !== "string") M.puste = "";
  if (typeof M.gbTaler !== "string") M.gbTaler = "";
  // Was Rita schon benutzt hat, bevor es den Merker gab (einmalig aus dem Stand ablesen)
  if (!M.entMigr) {
    const h = tagVon(new Date()), e = S.entdeckt, setz = k => { if (!e[k]) e[k] = h; };
    try {
      if (Object.keys(S.brevGelesen || {}).length) setz("karin");
      if ((S.buecherEigen || []).length) setz("buecher");
      if (Object.keys(S.gekauft || {}).some(k => k !== "patience")) setz("kramladen");
      if (S.skins && S.skins.besitz && Object.keys(S.skins.besitz).some(id => !(S.skins.geschenkt || {})[id])) setz("kleiderschrank");
      if ((S.menschen || []).some(m => m && m.avatar)) setz("gesicht");
      if (S.ruhe && S.ruhe.geuebt > 0) setz("notfall");
      if (S.bildWetter && S.bildWetter !== "echt") setz("wetter");
      if (S.tbModus || (S.tbMerk || []).length) setz("tagebuch");
    } catch (x) { }
    M.entMigr = 1;
  }
}

/* ---------- „Entdeckt“-Merker ---------- */
const MB_SHEET_FUNKTION = { telefon: "plaudern", "tel-gespraech": "plaudern", brevvan: "karin", "bv-brief": "karin", tv: "tv", lesen: "buecher", "buch-neu": "buecher", winter: "winter", angebote: "angebote", laden: "kramladen", ware: "kramladen", schrank: "kleiderschrank", "schrank-neu": "kleiderschrank", goennen: "goennen", avatar: "gesicht", ruhe: "notfall", "ruhe-flow": "notfall", "ruhe-edit": "notfall", "ruhe-atmen": "notfall", bildwetter: "wetter" };
function mbEntdeckt(k) { if (!S || !S.entdeckt || typeof S.entdeckt !== "object") return; if (!S.entdeckt[k]) { S.entdeckt[k] = heute(); speichern(); } }
function mbGeoeffnet(id) { const k = MB_SHEET_FUNKTION[id]; if (k) mbEntdeckt(k); }
function mbHat(k) {
  if (S.entdeckt && S.entdeckt[k]) return true;
  if (k === "huhn") return !!(S.halte && S.halte.huhn);
  return false;
}
// zentral mitlesen: Tagebuch-Karte (tb-…), Antippen im großen Bild
document.addEventListener("click", ev => {
  try {
    const t = ev.target; if (!t || !t.closest) return;
    const el = t.closest("[data-act]"); const a = el && el.dataset.act;
    if (a && a.startsWith("tb-")) mbEntdeckt("tagebuch");
    if (t.closest("#bild-gross")) mbEntdeckt("bild");
  } catch (e) { }
}, true);

/* ---------- Wann kommt Post? ---------- */
function mbGbVon(jahr) { return S.geburtstag && /^\d{2}-\d{2}$/.test(S.geburtstag) ? `${jahr}-${S.geburtstag}` : ""; }
function mbIstGeburtstag(h = heute()) { return !!S.geburtstag && h.slice(5) === S.geburtstag; }
/* Regelmäßige Brieftage: erster 9–14 Tage nach dem Start, dann alle 9–14 Tage. Rund um den Geburtstag rücken sie ein Stück. */
function mbBriefTage(bis) {
  const out = []; if (!S.start || !/^\d{4}-\d{2}-\d{2}$/.test(S.start)) return out;
  let t = tagPlus(S.start, 9 + hash32("mb0:" + S.seed) % 6), n = 0;
  while (t <= bis && n < 500) {
    for (const j of [Number(t.slice(0, 4)), Number(t.slice(0, 4)) - 1]) { const gb = mbGbVon(j); if (gb && t >= gb && t <= tagPlus(gb, 2)) t = tagPlus(gb, 3); }
    if (t > bis) break;
    out.push(t); n++;
    t = tagPlus(t, 9 + hash32("mb" + n + ":" + S.seed) % 6);
  }
  return out;
}
function mbImArchiv(tag, art) { return mbS().archiv.find(b => b.tag === tag && b.art === art) || null; }
/* Der Geburtstagsbrief liegt ab dem Tag bis zu sechs Tage bereit (falls die App mal zu bleibt) */
function mbGbFaellig() {
  if (!S.onboard) return null;
  const h = heute(), y = Number(h.slice(0, 4));
  for (const j of [y, y - 1]) {
    const gb = mbGbVon(j); if (!gb || h < gb || h > tagPlus(gb, 6) || (S.start && S.start > gb)) continue;
    return { tag: gb, art: MB_ART_GB, gelesen: !!mbImArchiv(gb, MB_ART_GB) };
  }
  return null;
}
function mbBriefFaellig() {
  if (!S.onboard) return null;
  const tage = mbBriefTage(heute()), t = tage[tage.length - 1]; if (!t) return null;
  return { tag: t, art: MB_ART_BRIEF, gelesen: !!mbImArchiv(t, MB_ART_BRIEF) };
}
/* Für maxPost(): an Brief- und Geburtstagstagen keine Ein-Satz-Post */
function mbStill() {
  try {
    const h = heute();
    if (mbIstGeburtstag(h)) return true;
    const g = mbGbFaellig(); if (g && !g.gelesen) return true;
    const b = mbBriefFaellig(); if (b && (!b.gelesen || b.tag === h)) return true;
  } catch (e) { }
  return false;
}

/* ============================================================
   TEXTE (Max’ Ton: echt, warm, ein bisschen frech – kein Kalenderspruch)
   ============================================================ */
const MB_ANREDE = ["Liebe {name},", "Liebe {name},", "Hallo {name},", "Liebe {name},", "Hej {name},", "Liebe {name},"];
/* a) Nettes aus Max’ Leben – dezent; m = passende Monate */
const MB_LEBEN = [
  { t: "ich sitz gerade am Küchentisch in Halle, der Kaffee ist kalt geworden, weil ich zu lange überlegt hab, womit ich anfange. Also einfach so." },
  { t: "Pauli war am Wochenende da und hat mir in einer Stunde erklärt, was in der Welt alles schiefläuft. Ich hab genickt und Kaffee nachgeschenkt. Sie lässt dich grüßen." },
  { t: "Greta lässt dich grüßen. Sie fragt jedes Mal, was Hühnchen so treibt, und ich weiß nie, was ich antworten soll." },
  { t: "Mama hat angerufen und gefragt, ob ich dir schon geschrieben hab. Hiermit: ja." },
  { t: "ich hab heute Halloren gekauft, eigentlich für Greta. Jetzt sind es noch drei. Ich weiß auch nicht, wie das passiert ist." },
  { t: "kurzer Bericht aus Halle: Die Saale ist noch da, die Straßenbahn auch, und ich hab endlich meine Fahrradlampe repariert. Hat nur drei Monate gedauert." },
  { t: "Greta und ich haben angefangen, Kisten für Leipzig zu packen. Es sind jetzt schon zu viele. Greta sagt, die Hälfte davon sind Kabel. Sie hat recht." },
  { t: "Micha hat mir eine Chili-Pflanze geschenkt. Sie heißt jetzt Horst und wächst schneller als meine Geduld." },
  { t: "ich war heute an der Peißnitz spazieren, und da stand eine Bank, die genauso aussieht wie die in deinem Bild. Ich hab mich kurz draufgesetzt, aus Solidarität." },
  { t: "Pauli hat mir ein Buch geliehen und gesagt, sie fragt nächste Woche ab. Ich bin auf Seite zwölf. Drück mir die Daumen." },
  { t: "bei uns im Haus hat jemand einen Zettel aufgehängt: „Wer hat meinen Schirm?“ Darunter steht inzwischen eine richtige Diskussion. Ich hab an dich gedacht. Du hättest den Fall längst gelöst." },
  { t: "ich hab mir vorgenommen, öfter richtige Briefe zu schreiben. Das hier ist der Beweis, dass es klappt. Zumindest bei dir." },
  { t: "Greta hat Tomaten aus dem Gewächshaus mitgebracht, die schmecken wie früher. Ich hab sie alle allein gegessen. Sag’s ihr nicht.", m: [7, 8, 9] },
  { t: "in Halle ist es jetzt so kalt, dass ich den dicken Schal wieder rausgeholt hab. Greta sagt, ich seh aus wie ein Wollknäuel mit Brille.", m: [11, 12, 1, 2] },
  { t: "auf dem Marktplatz bauen sie schon die Buden auf. Es riecht nach gebrannten Mandeln, und ich hab beschlossen, dass das jetzt bis Januar so bleibt.", m: [11, 12] },
  { t: "Greta hat am Wochenende Kartoffeln gesetzt. Also, sie hat gesetzt, und ich hab erklärt, wie man es richtig macht. Sie war nicht begeistert.", m: [3, 4, 5] },
  { t: "es regnet seit Tagen in Halle, und ich hab beschlossen: Das ist Briefwetter.", m: [10, 11, 3, 4] },
  { t: "in Halle ist Sommer, die Saale ist voller Paddler, und ich sitz im Schatten und schreib dir. Klingt faul, ist es auch.", m: [6, 7, 8] }
];
/* Einleitung vor dem Lob (die App zählt auf Ritas Handy, Max sieht nichts) */
const MB_ZAEHLT = ["Die App hat mir für diesen Brief ein bisschen was verraten.", "Ich hab die App gebeten, mal kurz nachzuzählen.", "Kleiner Bericht aus deiner App, frisch ausgezählt.", "Die App hat mir was zugesteckt.", "Ich hab die App gefragt, was bei dir so los war."];
/* b) Lob – je Fakt mehrere Fassungen */
const MB_LOB = {
  ersterAusflug: ["Dein erster Ausflug mit der App: {titel}! Ich hab mich gefreut, als hätte ich selbst den Rucksack gepackt. Im Bild steht er jetzt am Horizont, und da bleibt er.", "{titel}! Dein erster Ausflug, der im Bild am Horizont steht. Ich find’s richtig gut, dass du los bist. Erzähl mir davon, auch die unwichtigen Sachen.", "Erster Ausflug, eingetragen und alles: {titel}. Hühnchen tut so, als wär’s seine Idee gewesen."],
  ausflug: ["{titel} steht jetzt auch am Horizont. Du sammelst ja langsam richtig Orte.", "Und dann noch ein Ausflug: {titel}. Ich bin ein bisschen neidisch.", "{titel}, eingetragen. Dein Horizont im Bild wird voll, Rita."],
  buch: ["„{titel}“ ausgelesen! Ich bin beeindruckt. Ich lese gerade seit drei Wochen dasselbe Kapitel.", "Du hast „{titel}“ durch. An der Eiche im Bild hängt jetzt ein neues Lesezeichen. Wie fandst du’s?", "„{titel}“: fertig! Wenn du magst, erzähl mir beim nächsten Telefonat, ob es sich gelohnt hat. Ich such nämlich was."],
  stufe: ["Im Bild ist was Neues dazugekommen: {name}. Das wächst ja nicht von allein, das warst du.", "Dein Bild hat eine neue Stufe: {name}. Ich hab mir das beim Programmieren ausgedacht und nicht gedacht, dass du so schnell da bist.", "Neue Stufe im Bild: {name}. Da steckt ganz schön viel Gehen, Lesen und Machen drin."],
  kmRekord: ["{km} Kilometer an einem Stück! Das ist dein längster Weg bisher in der App. Hühnchen wär nach der Hälfte umgekehrt.", "Neuer Rekord: {km} km auf einmal. Ich hab’s zweimal gelesen, weil ich’s so gut fand.", "Dein längster Spaziergang bisher: {km} km. Respekt. Ich bin heute bis zum Bäcker gekommen."],
  serie: ["Du hast {n} Tage hintereinander was eingetragen. Ich krieg das nicht mal beim Blumengießen hin.", "{n} Tage am Stück! Ich hab das programmiert, aber gemacht hast es du.", "Seit {n} Tagen steht jeden Tag was drin. Man merkt, wer hier die Listen-Expertin ist."],
  mehr: ["{seit} hast du {n} Sachen eingetragen. Das sind {diff} mehr als in der Zeit davor. Läuft bei dir, würde Pauli sagen.", "{n} Einträge {seitKlein}, {diff} mehr als vorher. Ich hab extra nachgezählt. Also, die App.", "Ich hab verglichen: {n} Einträge diesmal, {diff} mehr als in den Tagen davor. Nicht schlecht, Herr Specht. Frau Specht."],
  skin: ["Und im Kleiderschrank hast du dir was gegönnt: {name}. Sehr gute Wahl. {wem}", "{name} aus dem Kleiderschrank! {wem} Hühnchen findet das übrigens auch.", "Ich hab gehört, im Kleiderschrank fehlt jetzt {name}. Gekauft von einer gewissen Rita. {wem}"],
  km: ["{malGross} spazieren, zusammen {km} km. Der Forst kennt dich langsam mit Vornamen.", "{seit} bist du {km} km gegangen. Das ist mehr, als ich in der Zeit geschafft hab. Deutlich mehr.", "{km} Kilometer {seitKlein}. Im Bild wird der Weg immer länger."],
  telefon: ["Du hast {mal} telefoniert. Ich hoffe, es war auch was zum Lachen dabei.", "{malGross} telefoniert {seitKlein}. Du bist besser vernetzt als ich, und ich hab drei Handys. Na gut, eins."],
  liste: ["{n} Sachen von deiner Liste abgehakt. Ich hab auch eine Liste. Da steht drauf: „Rita schreiben“. Abgehakt!", "Von deiner To-do-Liste sind {n} Sachen erledigt. Bei mir wächst die Liste nur. Ich glaub, du machst was richtig."],
  tagebuch: ["{malGross} Tagebuch geschrieben. Ich wette, deins ist spannender als jeder Schwedenkrimi.", "Du schreibst fleißig Tagebuch, {mal} {seitKlein}. Hühnchen will mitlesen. Ich hab Nein gesagt."],
  mut: ["Und mindestens einmal hat’s Mut gebraucht. Das find ich richtig stark, egal, was es war.", "Im Wald in deinem Bild leuchtet ein Glühwürmchen mehr. Das gibt’s nur für Mut. Ich hab’s mir gemerkt."],
  leute: ["Du warst unter Leuten. Schön! Erzähl mir mal, wer am meisten geredet hat. Außer dir, meine ich.", "Du warst mit dabei, unter Leuten. Das freut mich. Ich hoffe, der Kuchen war gut."],
  lesen: ["{std} Stunden gelesen {seitKlein}. Die Eiche im Bild freut sich, und ich mich auch.", "Fast {std} Stunden mit Büchern. Ich bin ehrlich neidisch. Ich schaff gerade zwei Seiten vorm Einschlafen."],
  allgemein: ["{seit} hast du {n} Sachen eingetragen. Schön, dass du dabei bist.", "{n} Einträge {seitKlein}. Jeder davon ist ein Stückchen Bild.", "{n} Mal hat die App {seitKlein} was von dir gehört. Sie freut sich jedes Mal, sagt sie. Ich glaub ihr."]
};
/* wenn wenig los war: kein Vorwurf, einfach was Nettes */
const MB_WENIG = [
  "In der App war’s die letzten Tage eher ruhig. Das Bild wartet geduldig, das kann es gut. Ich hoff einfach, du hattest es schön.",
  "Viel eingetragen hast du diesmal nicht, und das ist völlig in Ordnung. Ich schreib dir trotzdem. Oder gerade deswegen.",
  "Hühnchen hat gepetzt, dass es ruhig war. Ich hab gesagt: Na und? Rita weiß schon, was sie tut.",
  "Ruhige Tage zählen bei mir genauso. Die App ist ja kein Stundenzettel.",
  "Diesmal steht nicht viel drin. Macht nix. Ich wollt dir sowieso einfach nur mal schreiben.",
  "Ich bin auch nicht jeden Tag fleißig. Gestern hab ich zum Beispiel ausschließlich Kekse gegessen. Also: alles gut.",
  "Die App ist geduldig, und ich bin es auch. Wenn dir nach Eintragen ist, ist sie da. Wenn nicht, auch.",
  "Es war ruhig in der App. Ich stell mir vor, du hast stattdessen einen guten Krimi gelesen und gar nicht dran gedacht. Perfekt.",
  "Wenig los diesmal? Dann ist der Brief eben einfach nur ein Brief. Darf auch mal sein.",
  "Ich hab diesmal gar nicht nachgezählt. Ich wollte einfach nur Hallo sagen.",
  "Das Bild hat mir erzählt, dass es gerade eine Pause macht. Es sagt, das steht ihm gut."
];
/* c) Wusstest du eigentlich …: Funktionen, die Rita noch nicht benutzt hat */
const MB_FUNKTIONEN = [
  { id: "plaudern", text: "dass auf „Heute“ ganz unten ein altes Telefon steht? Da kannst du zum Spaß mit Hühnchen, Mama, Micha oder mir plaudern. Ich bin da übrigens deutlich schlagfertiger als in echt.", knopf: "Kurz plaudern" },
  { id: "karin", text: "dass dir eine Karin aus Vimmerby auf Schwedisch schreibt? Ausgedacht, aber sehr nett, mit Katze. Und mit Übersetzung zum Aufklappen, falls ein Wort klemmt.", knopf: "Post von Karin" },
  { id: "tv", text: "dass unter „Ideen“ jede Woche Film- und Krimitipps aus der Mediathek stehen? Ich hab da ein paar Schwedenkrimis reingeschmuggelt.", knopf: "Film & Fernsehen" },
  { id: "buecher", text: "dass du dir in der App ein Bücherregal einrichten kannst? Mit Lesezeichen für Harry Potter und ein paar Tipps von mir.", knopf: "Zum Bücherregal" },
  { id: "winter", text: "dass es eine Ecke „Gut durch den Winter“ gibt? Tees, Ingwer-Tricks und solche Sachen. Mama hat ihren Teil beigesteuert, man merkt’s.", knopf: "Gut durch den Winter", m: [10, 11, 12, 1, 2, 3] },
  { id: "angebote", text: "dass die App jeden Sonntag neue Angebote in Spandau raussucht? Konzerte, Feste, Treffs. Mit einem Tipp steht’s auf deiner Liste.", knopf: "Angebote ansehen" },
  { id: "tagebuch", text: "dass unter „Rückblick“ jeden Tag eine Frage fürs Tagebuch wartet? Wahlweise auch eine von früher. Fürs Papier-Tagebuch, die App liest nicht mit.", knopf: "Zur Tagebuch-Frage" },
  { id: "kramladen", text: "dass du mit deinen Talern im Kramladen einkaufen kannst? Sachen fürs Bild, kleine Spiele, Klänge. Hühnchen hat sich auch schon was ausgeguckt.", knopf: "Zum Kramladen" },
  { id: "kleiderschrank", text: "dass es unter „Zuhause“ einen Kleiderschrank gibt? Hühnchen als Detektiv, du mit Sonnenhut. Ich sag nur: Wikingerhelm.", knopf: "Zum Kleiderschrank" },
  { id: "goennen", text: "dass im Kramladen „Gönn dir was“-Karten liegen? Kleine Sachen, die einfach nur schön sind. Ohne Grund, ohne Haken.", knopf: "Gönn dir was" },
  { id: "gesicht", text: "dass du den Leuten in der App Gesichter basteln kannst? Frisur, Brille, Ohrringe. In den Einstellungen unter „Herzensmenschen“. Ich bin gespannt, was du draus machst.", knopf: "Gesichter basteln" },
  { id: "notfall", text: "dass unter „Ideen“ ein Notfallplan liegt? Den richtest du dir in Ruhe so ein, wie er zu dir passt. Wie ein Zettel im Portemonnaie: Man muss ihn nicht brauchen, aber er ist da.", knopf: "Notfallplan ansehen" },
  { id: "huhn", text: "dass Hühnchen dir was zeigt, wenn du den Finger länger draufhältst? Ich verrat nicht, was. Probier’s auf „Heute“.", knopf: "Zu Hühnchen" },
  { id: "bild", text: "dass du im großen Bild unter „Zuhause“ auf alles tippen kannst? Bank, Eiche, Quelle: Jedes Ding erzählt dir, wo es herkommt.", knopf: "Zum Bild" },
  { id: "wetter", text: "dass du im Bild das Wetter selbst machen kannst? Schnee im Juli, wenn dir danach ist. Unter „Zuhause“ bei „Wetter im Bild“.", knopf: "Wetter im Bild" }
];
/* … und wenn schon alles entdeckt ist: Max’ Lieblings-Tipps */
const MB_LIEBLING = [
  { id: "l-moment", text: "Mein Lieblingsding in der App ist „Schönster Moment heute“ im Rückblick. Ein Satz am Abend, und nach einem Monat hast du eine kleine Sammlung.", knopf: "Schönster Moment" },
  { id: "l-lebensbuch", text: "Mein Lieblingstipp gerade: die Erzählfragen unter „Ideen“. Such dir eine aus und erzähl sie mir beim nächsten Telefonat. Ich hab Zeit mitgebracht.", knopf: "Erzählfragen" },
  { id: "l-wissen", text: "Ich les selbst gern die Wissen-Häppchen unter „Ideen“. Gestern hab ich gelernt, dass ich vorher nichts wusste.", knopf: "Wissen" },
  { id: "l-bingo", text: "Das Forst-Bingo ist mein heimlicher Favorit. Eichhörnchen, Specht, Pilz: Wer zuerst eine Reihe hat, darf angeben.", knopf: "Forst-Bingo" },
  { id: "l-vorhaben", text: "Unter „Ideen“ gibt’s kleine Vorhaben mit Kästchen zum Abhaken. Ganz ohne Eile. Ich hab mir selbst eins vorgenommen, verrate aber nicht, welches.", knopf: "Vorhaben" },
  { id: "l-setzkasten", text: "Mein Lieblingsort in der App ist der Setzkasten. Da liegt von jedem Ausflug ein kleines Andenken. Wie eine Vitrine, nur ohne Staub.", knopf: "Setzkasten" },
  { id: "l-stufen", text: "Schau mal wieder unter „Alle Stufen“ nach. Da steht, was im Bild schon dazugekommen ist. Ich find, es ist eine ganze Menge.", knopf: "Alle Stufen" },
  { id: "l-woche", text: "Sonntags gibt’s den Wochenrückblick. Ich mag den, weil da drinsteht, was gut war, und sonst nichts.", knopf: "Wochenrückblick" },
  { id: "l-hp", text: "Der Harry-Potter-Lesebegleiter merkt sich dein Kapitel. Hermine wäre stolz. Ich auch.", knopf: "Lesebegleiter" },
  { id: "l-ausflug", text: "Ausflüge kann man in der App vorher planen, mit Checkliste und allem. Ich plane meine immer erst, wenn ich schon da bin. Das ist der Unterschied zwischen uns.", knopf: "Ausflug planen" },
  { id: "l-logo", text: "Tipp mal oben auf dein Gesicht, gleich mehrmals. Da passiert jedes Mal was anderes. Ich hab mir Mühe gegeben.", knopf: "" }
];
/* d) Schluss und Gruß */
const MB_SCHLUSS = [
  "Ich drück dich. Und Hühnchen kriegt einen Klaps auf den Schnabel, von mir.",
  "Bis bald am Telefon. Diesmal leg ich zuerst auf. Vielleicht.",
  "Fühl dich gedrückt, ganz fest.",
  "Ich freu mich aufs nächste Telefonat.",
  "Mach’s gut und lass dir von Hühnchen nichts erzählen.",
  "So, jetzt muss ich los. Also, eigentlich nicht, aber das sagt man so.",
  "Lass es dir gut gehen, Rita.",
  "Schreib mir mal, was du gerade liest. Ich brauch Nachschub.",
  "Ich denk an dich. Öfter, als du denkst.",
  "Mehr hab ich gar nicht. Doch: Hab dich lieb.",
  "Grüß den Forst von mir.",
  "Bis bald, und mach nichts, was ich nicht auch machen würde. Das lässt dir viel Spielraum."
];
const MB_GRUSS = ["Dein Max", "Dein Max", "Dein Max", "Dein Max", "Dein Maxi", "Dein Max (Greta winkt)", "Dein Max"];
/* das Nette obendrauf */
const MB_PS = [
  "PS: Ich hab neulich jemanden „lagom“ sagen hören und sofort an dich gedacht.",
  "PS: Wenn du mal wieder eine Liste schreibst, setz mich drauf. Unter „Anrufen“, nicht unter „Erledigt“.",
  "PS: Greta will wissen, welcher Schwedenkrimi der beste ist. Ich hab gesagt, das weißt nur du.",
  "PS: Ich erzähl immer noch jedem, dass du Voi-Roller gefahren bist. Die Leute sind jedes Mal beeindruckt. Zu Recht.",
  "PS: Mama sagt, sonntags in der Binger ist immer Kuchen übrig. Ist er wirklich, ich hab’s überprüft.",
  "PS: Du hast mir mal erklärt, wie man einen Überweisungsträger ausfüllt. Ich mach das heute alles am Handy, aber ich denk jedes Mal an dich.",
  "PS: Kein Grund, einfach so: Danke, dass du immer da warst.",
  "PS: Pauli lässt ausrichten, du bist eine der wenigen Erwachsenen, die sie ernst nimmt. Das ist bei ihr das höchste Lob.",
  "PS: Hab dich lieb. Musste mal wieder gesagt werden.",
  "PS: Falls Hühnchen fragt: Nein, es kriegt keinen eigenen Brief. Noch nicht.",
  "PS: Micha lässt grüßen. Also, er hat genickt, als ich gesagt hab, dass ich dir schreibe. Bei ihm zählt das.",
  "PS: Ich hab beim Aufräumen ein altes Foto von uns gefunden. Ich hatte eine sehr mutige Frisur. Du nicht.",
  "PS: Wenn du einen Wunsch für die App hast: Auf „Heute“ ganz unten steht, wie du ihn mir schickst."
];

/* ---------- Geburtstagsbriefe (jedes Jahr ein anderer) ---------- */
const MB_GB_BRIEFE = [
  ["alles, alles Gute zum Geburtstag! Ich hab lange überlegt, was ich dir schreibe, und dann hat Hühnchen gesagt: „Schreib einfach, was du denkst.“ Seitdem hält es sich für einen Briefberater.",
    "{zahlen}",
    "Ich wünsch dir ein Jahr mit vielen guten Tagen, mit Kuchen zur richtigen Zeit und mit Schwedenkrimis, bei denen du den Täter schon auf Seite 40 hast.",
    "Und danke. Für so vieles, was du für mich gemacht hast, früher und heute. Das meiste weißt du wahrscheinlich gar nicht mehr. Ich schon.",
    "Feier schön! Die Torte auf „Heute“ ist von mir. Kalorienfrei, dafür leider nicht essbar."],
  ["herzlichen Glückwunsch! Heute ist dein Tag, und die App weiß das auch: Sie hat sich extra schick gemacht. Ich hab ihr gesagt, sie soll nicht übertreiben. Hat nicht ganz geklappt.",
    "{zahlen}",
    "Mama, Greta und Pauli lassen dich ganz doll grüßen. Micha auch, auf seine Art: Er hat genickt.",
    "Ich bin froh, dass es dich gibt. So, jetzt ist es raus.",
    "Lass dich feiern, und zwar ordentlich."],
  ["zum Geburtstag nur das Beste! Diesmal schreib ich dir einen richtigen Brief, mit Umschlag und Marke, auch wenn er nur auf deinem Handy liegt. Die Marke hab ich selbst gemalt. Man sieht’s.",
    "{zahlen}",
    "Weißt du, was ich an dir mag? Dass du immer was Neues ausprobierst. Andere reden darüber, du machst es einfach. Voi-Roller, ChatGPT, diese App hier.",
    "Danke, dass du immer für mich da warst. Ich sag das zu selten, also steht es jetzt hier schwarz auf weiß. Na gut, dunkelgrau auf hellbeige.",
    "Und wenn wir das nächste Mal telefonieren: Diesmal gewinn ich das Tschüss-Duell. Wahrscheinlich nicht."],
  ["alles Liebe zum Geburtstag! Hühnchen hat seit Tagen geübt, was es heute sagen will, und ist jetzt so aufgeregt, dass es nur noch „Torte!“ sagt.",
    "{zahlen}",
    "Fürs neue Jahr wünsch ich dir, dass der Forst dich oft sieht und die Krimis spannend bleiben. Und dass Hühnchen ab und zu mal still ist. Wobei, nein, dann wär’s ja langweilig.",
    "Du hast mir früher so viel beigebracht. Jetzt bau ich dir Apps. Ich find das einen fairen Tausch, aber ich bin noch lange nicht fertig mit dem Zurückgeben.",
    "Lass es dir heute richtig gut gehen!"],
  ["Geburtstag! Ich hab heute in Halle schon ein Stück Kuchen für dich mitgegessen. Stellvertretend. Es war ein Opfer, aber ich hab’s gern gebracht.",
    "{zahlen}",
    "Ich hab der App beigebracht, an deinem Geburtstag ein bisschen anzugeben, mit Torte und goldenem Licht. Wenn’s zu viel ist: Morgen ist alles wieder normal.",
    "Danke für alles, Rita. Das ist ein großes Wort für einen kleinen Brief, aber es passt.",
    "Feier schön und lass dich beschenken. Die Kerzen auf „Heute“ darfst du übrigens auspusten, so oft du willst."]
];
const MB_GB_ZAEHLT = ["Ich hab die App gebeten, für diesen Brief mal nachzuzählen. Keine Sorge, das bleibt alles bei dir auf dem Handy, ich seh nur das, was hier steht.", "Die App hat für mich nachgezählt, und ich muss sagen: Hut ab.", "Kleine Geburtstagsstatistik, frisch aus deiner App:"];
const MB_GB_LIEBLING = ["Am häufigsten steht bei dir übrigens „{name}“ drin. Passt zu dir.", "Dein Lieblingseintrag: „{name}“. Hätt ich auch so geraten.", "Ganz vorn liegt „{name}“. Überrascht mich kein bisschen."];
const MB_GB_LEER = "Die App ist noch ganz frisch bei dir, da gibt’s noch nicht viel zu zählen. Nächstes Jahr mach ich hier eine richtige Statistik, mit Tortendiagramm. Passt ja.";
const MB_GB_SPAET = "Falls du den Brief erst jetzt aufmachst: macht gar nichts. Geburtstag ist bei mir die ganze Woche.";
const MB_PUSTE = [
  "Alle aus! Du hast dir was gewünscht, oder? Nicht verraten!",
  "Puh! Fast hättest du mich gleich mit ausgepustet.",
  "Bravo! Jetzt Kuchen. Ich nehm das Stück mit den meisten Streuseln.",
  "Wunsch ist unterwegs. Ich hab ihn per Eilpost geschickt.",
  "Sauber ausgepustet! Mit dem Schnabel hätte ich das nie hingekriegt.",
  "Und? Was gewünscht? Ein Huhn kann schweigen. Meistens.",
  "Ich hab ein Ständchen vorbereitet. Es ist kurz. Es heißt: Hurra!",
  "Alles Gute, Rita! Von Herzen. Aus Ton.",
  "Heute ist dein Tag. Ich halt mich zurück. Ab morgen wieder frech.",
  "Ich hab die Kerzen nicht gezählt. Ehrenwort. Ich kann gar nicht so weit zählen."
];
const MB_ANZUENDEN = ["Nochmal? Gern! Ich hab Streichhölzer im Gefieder.", "Brennt wieder! Einmal wünschen ist eh zu wenig.", "Neue Runde, neuer Wunsch."];

/* ============================================================
   ZAHLEN AUS DER APP
   ============================================================ */
function mbIn(von, bis) { return S.eintraege.filter(e => e.tag >= von && e.tag <= bis); }
const mbGang = e => tat(e.t).art === "km" && (e.km || 0) > 0;
function mbSerie(bis) {
  const tage = new Set(S.eintraege.map(e => e.tag)); let t = tage.has(bis) ? bis : tagPlus(bis, -1), n = 0;
  while (tage.has(t) && n < 400) { n++; t = tagPlus(t, -1); }
  return n;
}
function mbFakten(von, bis, letzter) {
  const E = mbIn(von, bis), vorE = S.eintraege.filter(e => e.tag < von), F = [];
  const aus = E.filter(e => e.t === "ausflug" && e.titel);
  if (aus.length) F.push(vorE.some(e => e.t === "ausflug") ? { art: "ausflug", p: 72, titel: aus[aus.length - 1].titel } : { art: "ersterAusflug", p: 100, titel: aus[0].titel });
  const bu = E.filter(e => e.t === "buchfertig"); if (bu.length) F.push({ art: "buch", p: 90, titel: bu[bu.length - 1].titel || "dein Buch" });
  const st = stufe(); if (letzter && Number.isFinite(letzter.stufe) && st > letzter.stufe && D.stufen[st]) F.push({ art: "stufe", p: 85, name: D.stufen[st].name });
  const maxVor = Math.max(0, ...vorE.filter(mbGang).map(e => e.km)), maxJ = Math.max(0, ...E.filter(mbGang).map(e => e.km));
  if (maxJ >= 2 && maxJ > maxVor && vorE.some(mbGang)) F.push({ art: "kmRekord", p: 80, km: fmt(maxJ) });
  const se = mbSerie(bis); if (se >= 4) F.push({ art: "serie", p: 75, n: se });
  const L = mbTage(von, bis) + 1, vVon = tagPlus(von, -L);
  if (letzter && S.start && vVon >= S.start) { const vn = mbIn(vVon, tagPlus(von, -1)).length; if (E.length >= 5 && vn > 0 && E.length >= vn + 3) F.push({ art: "mehr", p: 70, n: E.length, diff: E.length - vn }); }
  if (typeof SKIN_MAP === "object" && S.skins && S.skins.besitz) {
    const ge = S.skins.geschenkt || {}, k = Object.keys(S.skins.besitz).filter(id => SKIN_MAP[id] && !ge[id] && S.skins.besitz[id] >= von && S.skins.besitz[id] <= bis);
    if (k.length) { const s = SKIN_MAP[k[k.length - 1]]; F.push({ art: "skin", p: 60, name: s.name, wem: s.fuer === "huhn" ? "Hühnchen trägt’s mit Würde." : "Steht dir bestimmt." }); }
  }
  const g = E.filter(mbGang), km = g.reduce((s, e) => s + e.km, 0); if (km >= 3) F.push({ art: "km", p: 55, km: fmt(km), n: g.length });
  const tel = E.filter(e => e.t === "telefon").length; if (tel >= 2) F.push({ art: "telefon", p: 50, n: tel });
  const li = E.filter(e => e.t === "abgehakt").length; if (li >= 3) F.push({ art: "liste", p: 50, n: li });
  const tb = E.filter(e => e.t === "tagebuch").length; if (tb >= 2) F.push({ art: "tagebuch", p: 45, n: tb });
  if (E.some(e => e.mut || tat(e.t).mut)) F.push({ art: "mut", p: 44 });
  if (E.some(e => ["gemeinschaft", "kultur", "besuch"].includes(e.t))) F.push({ art: "leute", p: 40 });
  const lm = E.filter(e => ["lesen", "hoerbuch"].includes(e.t)).reduce((s, e) => s + (e.min || 0), 0); if (lm >= 120) F.push({ art: "lesen", p: 42, std: Math.round(lm / 60) });
  F.sort((a, b) => b.p - a.p || (hash32(a.art + bis) % 7) - (hash32(b.art + bis) % 7));
  return { F, n: E.length };
}
function mbLobText(f, key, v) {
  const n = f.n || 0;
  return mbFill(mbWaehle(MB_LOB[f.art], key + f.art, "lob-" + f.art), { ...v, ...f, mal: mbMal(n), malGross: n === 1 ? "Einmal" : `${n} Mal` });
}
function mbGbZahlen(gbTag, key) {
  // Zeitraum: seit dem letzten Geburtstag – oder seit Rita die App hat
  const vorjahr = tagPlus(gbTag, -365), von = S.start && S.start > vorjahr ? S.start : tagPlus(vorjahr, 1);
  const E = mbIn(von, gbTag), seit = von === S.start ? `Seit du die App hast, also seit dem ${mbDatum(S.start)},` : "Seit deinem letzten Geburtstag";
  const gehen = E.filter(mbGang), km = gehen.reduce((s, e) => s + e.km, 0), bu = E.filter(e => e.t === "buchfertig").length, tel = E.filter(e => e.t === "telefon").length, aus = E.filter(e => e.t === "ausflug").length;
  const saetze = [];
  if (gehen.length) saetze.push(`${seit} warst du ${mbMal(gehen.length)} spazieren${km >= 1 ? `, zusammen ${fmt(km)} km` : ""}.`);
  const hast = [];
  if (bu) hast.push(bu === 1 ? "ein Buch ausgelesen" : `${bu} Bücher ausgelesen`);
  if (tel) hast.push(`${mbMal(tel)} telefoniert`);
  if (aus) hast.push(aus === 1 ? "einen Ausflug gemacht" : `${aus} Ausflüge gemacht`);
  if (hast.length) saetze.push(`${saetze.length ? "Du hast" : seit + " hast du"} ${mbUnd(hast)}.`);
  const z = {}; E.forEach(e => { if (!["abgehakt", "planung"].includes(e.t)) z[e.t] = (z[e.t] || 0) + 1; });
  const top = Object.entries(z).sort((a, b) => b[1] - a[1])[0];
  if (!saetze.length && !(top && top[1] >= 3)) return MB_GB_LEER;
  let txt = mbWaehle(MB_GB_ZAEHLT, key + "z", "gbz") + " " + saetze.join(" ");
  if (top && top[1] >= 3) txt += " " + mbFill(mbWaehle(MB_GB_LIEBLING, key + "l", "gbl"), { name: tat(top[0]).name });
  return txt.trim();
}

/* ---------- Brief erzeugen (einmal, dann bleibt er so im Archiv) ---------- */
function mbWusstest(key) {
  const M = mbS(), mon = jetzt().getMonth() + 1;
  const offen = MB_FUNKTIONEN.filter(f => !mbHat(f.id) && (!f.m || f.m.includes(mon)) && f.id !== M.letzteEmpf && mbZiel(f.id));
  let w = offen.length ? offen[hash32("wd" + key + S.seed) % offen.length] : null;
  if (w) { M.letzteEmpf = w.id; return { id: w.id, text: "Wusstest du eigentlich, " + w.text, knopf: w.knopf }; }
  const lieb = MB_LIEBLING.filter(f => f.id !== M.letzteEmpf);
  w = lieb[hash32("wl" + key + S.seed) % lieb.length]; M.letzteEmpf = w.id;
  return { id: w.id, text: w.text, knopf: w.knopf, lieb: true };
}
function mbErzeugen(f) {
  const M = mbS(), key = f.art + f.tag, name = S.name || "Rita";
  const b = { tag: f.tag, art: f.art, gelesen: heute(), stufe: stufe(), anrede: "", absaetze: [], wd: null, schluss: "", gruss: "", ps: "" };
  if (f.art === MB_ART_GB) {
    const jahr = Number(f.tag.slice(0, 4)), vorlage = MB_GB_BRIEFE[(jahr + hash32("gbv" + S.seed)) % MB_GB_BRIEFE.length];
    b.anrede = `Liebe ${name},`;
    b.absaetze = vorlage.slice(0, -1).map(p => p === "{zahlen}" ? mbGbZahlen(f.tag, key) : p);
    if (heute() > f.tag) b.absaetze.splice(1, 0, MB_GB_SPAET);
    b.schluss = vorlage[vorlage.length - 1];
    b.gruss = hash32("gbg" + jahr + S.seed) % 4 === 0 ? "Dein Maxi" : "Dein Max";
    b.ps = heute() === f.tag ? "PS: Die Kerzen auf „Heute“ kannst du auspusten. Einfach antippen." : "";
  } else {
    const letzter = [...M.archiv].reverse().find(x => x.tag < f.tag) || null;
    const von = letzter ? tagPlus(letzter.tag, 1) : S.start, bis = heute();
    const seit = letzter ? "Seit meinem letzten Brief" : "Seit du mit der App angefangen hast", seitKlein = letzter ? "seit meinem letzten Brief" : "seit dem Start";
    const mon = tagDatum(f.tag).getMonth() + 1;
    b.anrede = mbFill(mbWaehle(MB_ANREDE, key + "a", "anrede"), { name });
    const leben = MB_LEBEN.filter(x => !x.m || x.m.includes(mon));
    b.absaetze.push(mbWaehle(leben.map(x => x.t), key + "o", "leben-" + mon));
    const { F, n } = mbFakten(von, bis, letzter), v = { seit, seitKlein, n };
    if (n < 3 && !(F[0] && F[0].p >= 70)) b.absaetze.push(mbWaehle(MB_WENIG, key + "w", "wenig"));
    else {
      let lob = mbWaehle(MB_ZAEHLT, key + "z", "zaehlt") + " " + (F[0] ? mbLobText(F[0], key, v) : mbFill(mbWaehle(MB_LOB.allgemein, key + "g", "lob-allg"), v));
      const zweit = F[0] ? F.slice(1).find(x => x.p >= 40 && x.art !== F[0].art) : null;
      b.absaetze.push(lob);
      if (zweit) b.absaetze.push(mbLobText(zweit, key + "2", v));
    }
    b.wd = mbWusstest(key);
    b.schluss = mbWaehle(MB_SCHLUSS, key + "s", "schluss");
    b.gruss = mbWaehle(MB_GRUSS, key + "g", "gruss");
    b.ps = mbWaehle(MB_PS, key + "p", "ps");
  }
  M.archiv.push(b); M.archiv.sort((x, y) => x.tag < y.tag ? -1 : x.tag > y.tag ? 1 : 0);
  speichern();
  return b;
}

/* ============================================================
   ANSICHTEN
   ============================================================ */
/* Umschlag: normaler Brief mit Roter-Turm-Marke, Geburtstag mit Torten-Marke und Konfetti-Rand */
function mbUmschlagSVG(art, tag) {
  const d = tagDatum(tag), mon = ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"][d.getMonth()], dat = `${d.getDate()}.${mon}.${String(d.getFullYear()).slice(2)}`;
  const gb = art === MB_ART_GB, tinte = "#5A3A5E";
  const stempel = (x, y, r, dreh, op, id) => `<g transform="translate(${x} ${y}) rotate(${dreh})" opacity="${op}" fill="none" stroke="${tinte}" stroke-width="1.4" stroke-dasharray="14 1.6 6 1.2"><circle r="${r}"/><circle r="${r - 4.5}" stroke-width=".7" stroke-dasharray="9 1.4"/><path id="${id}" d="M${-r + 6} 0 A${r - 6} ${r - 6} 0 0 1 ${r - 6} 0" stroke="none"/><text font-family="Familjen Grotesk, sans-serif" font-size="5" font-weight="800" fill="${tinte}" stroke="none" letter-spacing=".6"><textPath href="#${id}" startOffset="50%" text-anchor="middle">HALLE (SAALE)</textPath></text><text y="5" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="6.4" font-weight="800" fill="${tinte}" stroke="none">${dat}</text></g>`;
  // Briefmarke: Roter Turm (Halle) – oder ein Tortenstück mit Kerze
  const marke = gb
    ? `<rect x="4" y="4" width="44" height="54" fill="#F6D9DF"/><path d="M12 46 L40 46 L40 34 Q26 26 12 34Z" fill="#FFF6E6" stroke="#B8552F" stroke-width="1"/><path d="M12 34 Q26 26 40 34 L40 37 Q36 40 33 37 Q30 41 26 37 Q22 41 19 37 Q15 40 12 37Z" fill="#E58FA0"/><circle cx="18" cy="42" r="1.4" fill="#2F6B9A"/><circle cx="26" cy="42.5" r="1.4" fill="#C98A1B"/><circle cx="34" cy="42" r="1.4" fill="#3E7A4A"/><rect x="24.6" y="20" width="2.8" height="10" fill="#2F6B9A"/><path d="M26 13 C28.5 16.5 28.5 18.5 26 20 C23.5 18.5 23.5 16.5 26 13Z" fill="#F2B33D"/><text x="26" y="55" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="5.6" font-weight="800" fill="#7A2A1B">ALLES GUTE</text>`
    : `<rect x="4" y="4" width="44" height="54" fill="#DCE8F0"/><path d="M4 50 Q16 44 26 48 T48 46 L48 58 L4 58Z" fill="#9CC0D8"/><rect x="21" y="22" width="10" height="26" fill="#A8432F"/><path d="M19.5 22 L26 9 L32.5 22Z" fill="#3E5A4A"/><rect x="23.4" y="27" width="2" height="3.6" fill="#F2D27A"/><rect x="26.6" y="27" width="2" height="3.6" fill="#F2D27A"/><rect x="23.4" y="35" width="2" height="3.6" fill="#F2D27A"/><rect x="26.6" y="35" width="2" height="3.6" fill="#F2D27A"/><path d="M10 48 L10 34 L13 30 L16 34 L16 48Z M36 48 L36 32 L39 27 L42 32 L42 48Z" fill="#6E7F8A"/><text x="26" y="14" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="5.6" font-weight="800" fill="#1A4560" transform="translate(0 -4)">1 BRIEF</text>`;
  const konfetti = gb ? Array.from({ length: 26 }, (_, i) => { const r = mulberry32(hash32("kf" + i))(); const x = 10 + (i * 283 / 26) % 280, y = i % 2 ? 140 - r * 6 : 8 + r * 6; return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="5" height="2.4" rx="1" fill="${["#E2A93B", "#C8462F", "#2F7A4F", "#2F5E8E", "#B0505A"][i % 5]}" transform="rotate(${(i * 47) % 180} ${(x + 2.5).toFixed(1)} ${(y + 1.2).toFixed(1)})" opacity=".85"/>`; }).join("") : "";
  const gbTag = S.geburtstag ? `${Number(S.geburtstag.slice(3))}. ${MONAT[Number(S.geburtstag.slice(0, 2)) - 1]}` : "";
  return `<svg class="umschlag-bild mb-umschlag-bild" viewBox="0 0 300 150" aria-hidden="true">
    <rect x="3" y="3" width="294" height="144" rx="6" fill="var(--umschlag)" stroke="${gb ? "var(--mb-gold)" : "var(--umschlag-rand)"}" stroke-width="${gb ? 2.2 : 1.6}"/>${konfetti}
    <text x="18" y="27" font-family="Literata, Georgia, serif" font-size="11.5" font-style="italic" fill="var(--tinte-2)">Max</text>
    <text x="18" y="40" font-family="Literata, Georgia, serif" font-size="9" font-style="italic" fill="var(--tinte-2)" opacity=".85">06108 Halle (Saale)</text>
    ${gb ? `<g transform="translate(18 52) rotate(-4)"><rect x="0" y="0" width="118" height="22" rx="3" fill="none" stroke="#B8552F" stroke-width="1.3"/><text x="59" y="9.4" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="6.6" font-weight="800" fill="#B8552F" letter-spacing=".4">NICHT VOR DEM ${esc(gbTag.toUpperCase())} ÖFFNEN!</text><text x="59" y="18" text-anchor="middle" font-family="Literata, Georgia, serif" font-style="italic" font-size="7.4" fill="var(--tinte-2)">(heute darfst du)</text></g>`
      : `<g transform="translate(18 54) rotate(-3)"><rect x="0" y="0" width="62" height="15" rx="2" fill="none" stroke="#B8552F" stroke-width="1.3"/><text x="31" y="10.4" text-anchor="middle" font-family="Familjen Grotesk, sans-serif" font-size="7.4" font-weight="800" fill="#B8552F" letter-spacing="1">PERSÖNLICH</text></g>`}
    <g transform="translate(234 13) rotate(3)"><rect x="0" y="0" width="52" height="62" rx="2" fill="#FFFDF5" stroke="#FFFDF5" stroke-width="6" stroke-dasharray="3 3"/>${marke}</g>
    <g opacity=".55" fill="none" stroke="${tinte}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="22 2 9 1.5"><path d="M178 36 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0"/><path d="M178 45 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0"/><path d="M178 54 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0"/></g>
    ${stempel(224, 64, 21, -10, .78, "mbpm" + art)}
    <text x="70" y="104" font-family="Literata, Georgia, serif" font-size="19" font-style="italic" fill="var(--tinte)">An ${esc(S.name)}</text>
    <text x="70" y="126" font-family="Literata, Georgia, serif" font-size="13" font-style="italic" fill="var(--tinte-2)">Am Spandauer Forst, Berlin</text>
    <path d="M70 110 H230 M70 132 H210" stroke="var(--umschlag-rand)" stroke-width="1" opacity=".6"/>
  </svg>`;
}
/* Die Geburtstagstorte (Tupfen wie auf Hühnchens Ton-Gefieder) */
function mbTorteSVG(aus) {
  const farben = ["#2F6B9A", "#C98A1B", "#3E7A4A", "#B8552F", "#7A5A9A"], xs = [98, 114, 130, 146, 162];
  const kerzen = xs.map((x, i) => `<g class="mb-kerze" style="--i:${i}">
      <rect x="${x - 3.5}" y="54" width="7" height="34" rx="2" fill="${farben[i]}"/><path d="M${x - 3.5} 62 l7 -4 M${x - 3.5} 70 l7 -4 M${x - 3.5} 78 l7 -4 M${x - 3.5} 86 l7 -4" stroke="#FFFDF5" stroke-width="1.6" opacity=".75"/>
      <path d="M${x} 54 v-5" stroke="#3A3028" stroke-width="1.3" stroke-linecap="round"/>
      <g transform="translate(${x} 47)"><g class="mb-flamme"><circle r="11" fill="url(#mbGlut)"/><path d="M0 -15 C5.5 -7.5 6.5 -2 0 2.2 C-6.5 -2 -5.5 -7.5 0 -15Z" fill="#F4B63F"/><path d="M0 -8.5 C2.6 -4.6 3 -1.4 0 .9 C-3 -1.4 -2.6 -4.6 0 -8.5Z" fill="#FFF3C4"/></g></g>
      <path class="mb-rauch" d="M${x} 48 c-3 -4 3 -7 0 -11 c-3 -4 3 -7 0 -11" fill="none" stroke="#9A948A" stroke-width="1.6" stroke-linecap="round"/></g>`).join("");
  const tupfen = Array.from({ length: 11 }, (_, i) => `<circle cx="${56 + i * 14.8}" cy="176" r="3" fill="${farben[i % 4]}"/>`).join("");
  return `<svg class="mb-torte-svg${aus ? " aus" : ""}" viewBox="18 24 224 184" role="img" aria-label="Geburtstagstorte mit fünf Kerzen${aus ? ", ausgepustet" : ""}">
    <defs><radialGradient id="mbGlut"><stop offset="0" stop-color="#FFD877" stop-opacity=".75"/><stop offset="1" stop-color="#FFD877" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="130" cy="198" rx="104" ry="8" fill="rgba(20,28,24,.16)"/>
    <ellipse cx="130" cy="190" rx="108" ry="13" fill="#FFFDF5" stroke="#D9C49A" stroke-width="1.4"/>
    <path d="M42 130 H218 V180 Q218 188 208 188 H52 Q42 188 42 180Z" fill="#F4DDB6"/>
    <path d="M42 130 H218 V140 Q212 150 206 142 Q198 156 190 142 Q182 150 172 141 Q162 158 152 142 Q142 150 132 141 Q122 154 112 142 Q102 150 92 141 Q82 156 72 142 Q62 150 54 141 Q48 148 42 140Z" fill="#E58FA0"/>
    <ellipse cx="130" cy="130" rx="88" ry="10" fill="#EDA0AF"/>
    <text x="130" y="168" text-anchor="middle" font-family="Satisfy, cursive" font-size="22" fill="#9A3D50">${esc(S.name || "Rita")}</text>
    ${tupfen}
    <path d="M72 88 H188 V128 Q188 134 180 134 H80 Q72 134 72 128Z" fill="#FBF0DC"/>
    <path d="M72 88 H188 V96 Q183 104 178 97 Q170 108 162 97 Q154 104 146 96 Q138 108 130 97 Q122 104 114 96 Q106 108 98 97 Q90 104 82 96 Q77 102 72 96Z" fill="#FFFDF5" stroke="#E6D3AE" stroke-width=".8"/>
    <ellipse cx="130" cy="88" rx="58" ry="8" fill="#FFFDF5"/>
    <circle cx="84" cy="88" r="4" fill="#C8372D"/><circle cx="176" cy="88" r="4" fill="#C8372D"/><path d="M84 84 q2 -5 5 -6 M176 84 q-2 -5 -5 -6" stroke="#3E7A4A" stroke-width="1.2" fill="none"/>
    <g fill="#E2A93B">${[[86, 112], [108, 118], [152, 118], [174, 112], [130, 122]].map(([x, y]) => `<path d="M${x} ${y - 4} l1.2 2.8 2.8 1.2 -2.8 1.2 -1.2 2.8 -1.2 -2.8 -2.8 -1.2 2.8 -1.2Z"/>`).join("")}</g>
    ${kerzen}
  </svg>`;
}
function mbTorteHTML() {
  const aus = mbS().puste === heute(), name = S.name || "Rita";
  return `<section class="abschnitt"><div class="bogen mb-fest">
    <h2 class="mb-fest-titel">Alles Gute zum Geburtstag, ${esc(name)}!</h2>
    <div class="mb-torte-buehne">
      <span class="mb-torte-huhn fig-idle" aria-hidden="true">${S.huhn !== false ? huhnSVG({ gr: 74, stimmung: "freut" }) : ""}</span>
      <button class="mb-torte" data-act="mb-pusten" aria-label="${aus ? "Kerzen wieder anzünden" : "Kerzen auspusten"}">${mbTorteSVG(aus)}</button>
    </div>
    <p class="mb-torte-hinweis klein" aria-live="polite">${aus ? "Ausgepustet! Antippen zündet sie wieder an." : "Tipp auf die Kerzen und wünsch dir was."}</p>
  </div></section>`;
}
/* Auf „Heute“ oben: am Geburtstag die Torte */
function mbHeuteOben() { try { return S.onboard && mbIstGeburtstag() ? mbTorteHTML() : ""; } catch (e) { return ""; } }
/* Auf „Heute“ an der Stelle der Post: der Umschlag */
function mbHeutePost() {
  try {
    const f = [mbGbFaellig(), mbBriefFaellig()].find(x => x && !x.gelesen); if (!f) return "";
    const gb = f.art === MB_ART_GB, hinweis = gb ? "Geburtstagspost von Max · zum Öffnen antippen" : "Ein Brief von Max · zum Öffnen antippen";
    return `<section class="abschnitt"><button class="umschlag mb-umschlag${gb ? " mb-umschlag-gb" : ""}" data-act="mb-auf" data-art="${f.art}" data-tag="${f.tag}" aria-label="${esc(hinweis)}">${mbUmschlagSVG(f.art, f.tag)}<span class="umschlag-hinweis">${esc(hinweis)}</span></button></section>`;
  } catch (e) { return ""; }
}
function mbBriefHTML(b) {
  const gb = b.art === MB_ART_GB;
  const wd = b.wd ? `<div class="mb-wusstest">${ic("ideen")}<div><p class="mb-wusstest-text">${esc(b.wd.text)}</p>${b.wd.knopf && mbZiel(b.wd.id) ? `<button class="knopf klein zweit" data-act="mb-zu" data-ziel="${esc(b.wd.id)}">${esc(b.wd.knopf)} ${ic("pfeil")}</button>` : ""}</div></div>` : "";
  return `<article class="brief-papier mb-brief${gb ? " mb-brief-gb" : ""}">
    <span class="brief-marke" aria-hidden="true">${gb ? `<svg viewBox="40 0 180 200" width="52" height="58">${mbTorteSVG(true).replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/id="mbGlut"/, 'id="mbGlutM"')}</svg>` : maxSVG(52)}</span>
    <p class="mb-ort">Halle, ${mbDatum(b.tag)}</p>
    <p class="brief-anrede">${esc(b.anrede)}</p>
    ${b.absaetze.map(p => `<p class="brief-text">${esc(p)}</p>`).join("")}
    ${wd}
    <p class="brief-text">${esc(b.schluss)}</p>
    <p class="brief-gruss">${esc(b.gruss)} <span aria-hidden="true">♥</span></p>
    ${b.ps ? `<p class="brief-text mb-ps">${esc(b.ps)}</p>` : ""}
  </article>`;
}
function mbBriefSheet(b, ausAblage) {
  const titel = b.art === MB_ART_GB ? "Geburtstagsbrief von Max" : "Brief von Max";
  sheet({ titel, id: "mb-brief", inhalt: mbBriefHTML(b), fuss: `<div class="stapel">${ausAblage ? "" : `<button class="knopf zweit voll" data-act="mb-ablage">${ic("brief")} Alle Briefe von Max</button>`}<button class="knopf haupt voll" data-act="sheet-zu">Schön, danke!</button></div>`, onclose: () => { if (!ausAblage) render({ halteScroll: true, ohneAnim: true }); } });
}
function mbAblageSheet() {
  const A = [...mbS().archiv].reverse();
  const zeilen = A.map((b, i) => zeileBtn(b.art === MB_ART_GB ? "kuchen" : "brief", b.art === MB_ART_GB ? `Geburtstagsbrief ${b.tag.slice(0, 4)}` : `Brief vom ${mbDatum(b.tag)}`, (b.absaetze[0] || "").replace(/^(\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+\S+).*$/, "$1 …"), `data-act="mb-lesen" data-i="${A.length - 1 - i}"`, "k-menschen")).join("");
  const naechster = (() => { const h = heute(); for (let i = 1; i <= 15; i++) { const t = tagPlus(h, i); if (mbBriefTage(t).slice(-1)[0] === t) return t; } return ""; })();
  sheet({ titel: "Briefe von Max", id: "mb-ablage", inhalt: `<div class="max-karte">${maxSVG(60)}<div class="bogen post brief" style="flex:1;min-width:0;margin:0"><p style="margin:0">Ab und zu schreib ich dir einen richtigen Brief. Was drinsteht, zählt die App auf deinem Handy zusammen – ich selbst seh deine Einträge nicht.</p></div></div>
    ${A.length ? `<h3 style="margin-top:18px">Nochmal lesen</h3><div class="liste">${zeilen}</div>` : `<div class="bogen mulde" style="margin-top:14px"><p style="margin:0">Der erste Brief ist schon unterwegs${naechster ? ` und kommt am ${WOCHENTAG[tagDatum(naechster).getDay()]}` : ""}.</p></div>`}` });
}
/* Unter „Zuhause“: die Ablage */
function mbZuhauseHTML() {
  try {
    const n = mbS().archiv.length;
    return `<section class="abschnitt"><h2>Post</h2><div class="liste">${zeileBtn("brief", "Briefe von Max", n ? `${n} ${n === 1 ? "Brief" : "Briefe"} zum Nochmal-Lesen` : "Ab und zu kommt einer – der erste ist unterwegs", `data-act="mb-ablage"`, "k-menschen")}</div></section>`;
  } catch (e) { return ""; }
}

/* ---------- Wusstest-du-Knöpfe: direkt zur Funktion ---------- */
function mbZiel(id) {
  const tab = (t, sel) => () => { wechsleTab(t); setTimeout(() => { const el = sel && $(sel); if (el) { el.scrollIntoView({ block: "center", behavior: REDUCED() ? "auto" : "smooth" }); el.classList.add("mb-zeig"); setTimeout(() => el.classList.remove("mb-zeig"), 2600); } }, 120); };
  const akt = a => () => aktion(a, {}, null);
  const Z = {
    plaudern: typeof telAktion === "function" && akt("tel-auf"), karin: typeof bvAktion === "function" && akt("bv-auf"), tv: typeof tvAktion === "function" && akt("tv-auf"),
    buecher: typeof lesebegleiterSheet === "function" && akt("lesebegleiter"), winter: typeof winterAktion === "function" && akt("wi-auf"), angebote: akt("angebote"),
    tagebuch: typeof tbAktion === "function" && tab("tagebuch", ".tb-karte"), kramladen: () => ladenSheet(),
    kleiderschrank: typeof skAktion === "function" && (() => skAktion("sk-schrank", {}, null)), goennen: typeof gkSheet === "function" && (() => gkSheet()),
    gesicht: typeof avatarEditor === "function" && (() => { const m = (S.menschen || []).find(x => x.id === "nachbarin" && !personFest(x)) || (S.menschen || []).find(x => x.id !== "daniel" && !personFest(x)); if (m) avatarEditor(m.id); else { EINST_OFFEN = new Set(["menschen"]); einstellungenSheet(); } }), notfall: typeof ruheAktion === "function" && akt("ruhe-plan"),
    huhn: S.huhn !== false && (() => tab("heute", ".huhn-karte")()), bild: () => tab("lichtung", "#buehne-gross")(), wetter: typeof skAktion === "function" && (() => skAktion("sk-wetter", {}, null)),
    "l-moment": akt("moment"), "l-lebensbuch": akt("lebensbuch"), "l-wissen": akt("wissen"), "l-bingo": typeof bingoSheet === "function" && (() => bingoSheet()), "l-vorhaben": akt("missionen"),
    "l-setzkasten": akt("setzkasten"), "l-stufen": akt("stufen"), "l-woche": akt("rueckblick"), "l-hp": akt("lesebegleiter"), "l-ausflug": akt("ausflug")
  };
  return Z[id] || null;
}

/* ---------- Torte auspusten ---------- */
function mbKonfetti(el) {
  if (REDUCED()) return;
  const r = el.getBoundingClientRect(), farben = ["#E2A93B", "#C8462F", "#2F7A4F", "#2F5E8E", "#B0505A", "#F2C14E"];
  for (let i = 0; i < 46; i++) {
    const s = document.createElement("i"); s.className = "mb-konfetti"; s.setAttribute("aria-hidden", "true");
    s.style.left = (r.left + r.width * (.25 + Math.random() * .5)) + "px"; s.style.top = (r.top + r.height * .25) + "px";
    s.style.background = farben[i % farben.length];
    s.style.setProperty("--dx", ((Math.random() - .5) * 320) + "px"); s.style.setProperty("--hoch", (-90 - Math.random() * 150) + "px");
    s.style.setProperty("--fall", (innerHeight * .45 + Math.random() * 160) + "px"); s.style.setProperty("--dreh", (Math.random() * 900 - 450) + "deg");
    s.style.animationDelay = (Math.random() * 160) + "ms"; if (i % 3 === 0) s.style.borderRadius = "50%";
    document.body.appendChild(s); setTimeout(() => s.remove(), 2900);
  }
}
function mbPusten(el) {
  const M = mbS(), h = heute(), svg = el.querySelector(".mb-torte-svg"), karte = el.closest(".mb-fest"), hw = karte && karte.querySelector(".mb-torte-hinweis");
  if (M.puste === h) { // wieder anzünden
    M.puste = ""; speichern(); haptik("auswahl");
    if (svg) svg.classList.remove("aus", "pustet"); el.setAttribute("aria-label", "Kerzen auspusten");
    if (hw) hw.textContent = MB_ANZUENDEN[Math.floor(Math.random() * MB_ANZUENDEN.length)];
    return;
  }
  M.puste = h;
  const erstes = M.gbTaler !== h; if (erstes) { M.gbTaler = h; S.taler = (Number(S.taler) || 0) + 7; }
  speichern(); haptik("erfolg"); ton("erfolg");
  if (svg) { svg.classList.add("pustet"); setTimeout(() => svg.classList.add("aus"), REDUCED() ? 0 : 380); }
  el.setAttribute("aria-label", "Kerzen wieder anzünden");
  setTimeout(() => mbKonfetti(el), REDUCED() ? 0 : 300);
  const spruch = MB_PUSTE[hash32("puste" + h + Date.now()) % MB_PUSTE.length];
  if (hw) hw.textContent = "Ausgepustet! Antippen zündet sie wieder an.";
  const huhn = karte && karte.querySelector(".mb-torte-huhn .huhn"); if (huhn) { huhn.classList.remove("freut"); void huhn.getBBox; huhn.classList.add("freut"); }
  setTimeout(() => toast(`Hühnchen: „${spruch}“${erstes ? "\n+7 Geburtstagstaler" : ""}`, { dauer: 7000 }), REDUCED() ? 50 : 700);
}

/* ---------- Goldenes Festlicht ---------- */
function mbFestLicht(r) { try { r = r || document.documentElement; if (S.onboard && mbIstGeburtstag()) r.dataset.fest = "geburtstag"; else if (r.dataset.fest === "geburtstag") delete r.dataset.fest; } catch (e) { } }

/* ---------- Aktionen ---------- */
function mbAktion(a, d, el) {
  switch (a) {
    case "mb-auf": {
      const f = [mbGbFaellig(), mbBriefFaellig()].find(x => x && x.tag === d.tag && x.art === d.art); if (!f) { render({ halteScroll: true, ohneAnim: true }); break; }
      const b = mbImArchiv(f.tag, f.art) || mbErzeugen(f); haptik("auswahl"); mbBriefSheet(b, false); break; }
    case "mb-ablage": { const sh = aktuellesSheet(); if (sh && sh.dataset.id === "mb-brief") { sheetZu(); setTimeout(mbAblageSheet, 240); } else mbAblageSheet(); break; }
    case "mb-lesen": { const b = mbS().archiv[Number(d.i)]; if (b) mbBriefSheet(b, true); break; }
    case "mb-zu": { const los = mbZiel(d.ziel); if (!los) break; haptik("auswahl"); if (SHEETS.length) { alleSheetsZu(); setTimeout(los, 260); } else los(); break; }
    case "mb-pusten": mbPusten(el); break;
  }
}
document.addEventListener("click", ev => {
  const el = ev.target.closest && ev.target.closest("[data-act^='mb-']"); if (!el || el.disabled) return;
  try { mbAktion(el.dataset.act, el.dataset, el); } catch (e) { console.warn(e); }
});
