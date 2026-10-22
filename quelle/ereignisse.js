/* ============================================================
   Zufällige Ereignisse: Max, Christiane, Micha, Karin oder Hühnchen
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
  { id: "max-quiz", wer: "max", ab: [4, 0], zeilen: ["Kurze Quizfrage, ganz spontan:", "Wie viele Kapitel hat der Feuerkelch?"],
    antworten: [{ text: "37", sagt: "Richtig! Du Streberin. Ich bin stolz.", effekt: "konfetti" }, { text: "Zu viele", sagt: "Auch richtig. Aber du schaffst die locker." }] },
  { id: "max-tv", wer: "max", wenn: () => typeof tvDaten === "function" && (tvDaten().fernsehen || []).some(x => x.datum === heute()), zeilen: ["Psst, ich hab dir was rausgesucht.", "Heute Abend läuft was Gutes im Fernsehen."],
    antworten: [{ text: "Zeig her!", sagt: "Bitte sehr. Popcorn musst du selbst machen.", aktion: "tv-auf" }, { text: "Ich lese lieber", sagt: "Auch gut. Hermine wäre einverstanden." }] },
  { id: "max-wetter", wer: "max", zeilen: ["In Halle regnet’s seit drei Tagen.", "Wie ist es bei dir im Forst?"],
    antworten: [{ text: "Sonne!", sagt: "Gemein. Schick mir welche rüber!", effekt: "sonne" }, { text: "Auch grau", sagt: "Dann trinken wir jetzt beide einen Tee. Du in Spandau, ich in Halle." }] },
  { id: "max-nikolaus", wer: "max", wann: { monat: 12, tag: 6 }, zeilen: ["Hast du gestern Abend die Stiefel rausgestellt?", "Ich frag nur, weil … ach, schau einfach mal in die Post."],
    antworten: [{ text: "Natürlich!", sagt: "Dann ist ja alles vorbereitet. Ho ho ho!", effekt: "schnee" }] },
  { id: "max-spotify", wer: "max", wenn: () => !S.spotify, zeilen: ["Ich hab gerade eine Playlist gemacht: „Ritas Sonntag“.", "Leider kannst du sie noch nicht hören …"],
    antworten: [{ text: "Erzähl mehr", sagt: "Ich hätte da ein Angebot.", aktion: "spotify-info" }, { text: "Ich hab ja YouTube", sagt: "Stimmt. Da findest du die meisten Lieder auch." }] },
  /* ---------- Christiane ---------- */
  { id: "jane-sonntag", wer: "jane", wann: { wochentag: 0, von: 10, bis: 15 }, zeilen: ["Rita! Der Braten ist im Ofen und ich hab wieder viel zu viel Soße gemacht.", "Wie immer eigentlich."],
    antworten: [{ text: "Heb mir was auf!", sagt: "Ist schon im Glas. Mit Deckel und Namen drauf.", effekt: "herzen" }, { text: "Was gibt’s dazu?", sagt: "Klöße. Und Rotkohl. Und Micha, der vorher nascht." }] },
  { id: "jane-kuchen", wer: "jane", zeilen: ["Ich hab einen Kuchen gebacken. Beim Stürzen ist er ein bisschen zerbrochen.", "Schmeckt aber. Micha hat schon zweimal probiert."],
    antworten: [{ text: "Welcher denn?", sagt: "Pflaume. Oder Apfel. Das Etikett ist abgefallen." }, { text: "Ich will ein Stück!", sagt: "Liegt schon auf dem Teller mit deinem Namen.", effekt: "herzen" }] },
  { id: "jane-krimi", wer: "jane", zeilen: ["Hast du den neuen Kommissar Beck gesehen?", "Ich hab den Täter in Minute zwölf erraten!"],
    antworten: [{ text: "Verrat bloß nichts!", sagt: "Meine Lippen sind versiegelt. Mmmh-mmh." }, { text: "Wo läuft der?", sagt: "In der Mediathek. Ich zeig’s dir.", aktion: "tv-auf" }] },
  { id: "jane-runde", wer: "jane", zeilen: ["Ich hab heute an unsere Runden im Forst gedacht.", "Mit Thermoskanne und Zimtschnecken. Weißt du noch?"],
    antworten: [{ text: "Lass uns mal wieder!", sagt: "Gute Idee. Frag mich mal!", aktion: "liste:Christiane fragen: Lust auf eine Forstrunde?", effekt: "herzen" }, { text: "Die Zimtschnecken!", sagt: "Die waren gut. Micha behauptet bis heute, er hätte nur eine gegessen." }] },
  { id: "jane-test", wer: "jane", wann: { monate: [10, 11, 12, 1, 2, 3] }, zeilen: ["Wenn ich das nächste Mal komme, mach ich vorher einen Test – versprochen.", "Und die gute Butter bring ich dann auch mit."],
    antworten: [{ text: "Du bist die Beste", sagt: "Ich weiß. Aber sag’s ruhig öfter.", effekt: "herzen" }, { text: "Und Kuchen?", sagt: "Rita. Ich bitte dich. Natürlich Kuchen." }] },
  { id: "jane-telefon", wer: "jane", zeilen: ["Ich hab eben was Unglaubliches beim Bäcker gehört.", "Aber das erzähl ich dir lieber am Telefon."],
    antworten: [{ text: "Ruf an!", sagt: "Klingelt schon!", aktion: "tel:jane" }, { text: "Ich bin gespannt", sagt: "Zu Recht. Es geht um Mohnschnecken." }] },
  /* ---------- Micha ---------- */
  { id: "micha-chili", wer: "micha", wann: { monate: [8, 9, 10] }, zeilen: ["Rita, meine Chilis tragen wie verrückt.", "Willst du welche? Die gelben sind harmlos. Die roten nicht."],
    antworten: [{ text: "Die gelben, bitte", sagt: "Vernünftige Frau. Ich pack dir welche ein." }, { text: "Die roten! Ich bin mutig.", sagt: "Ich ruf schon mal vorsorglich die Feuerwehr.", effekt: "konfetti" }] },
  { id: "micha-werkzeug", wer: "micha", zeilen: ["Falls bei dir was klemmt oder tropft:", "Ich hab Werkzeug. Und am Wochenende nichts vor."],
    antworten: [{ text: "Der Wasserhahn tropft", sagt: "Dichtung. Kostet zwanzig Cent und eine Stunde Fluchen." }, { text: "Alles läuft", sagt: "Sehr gut. Dann geh ich wieder zu meinen Chilis." }] },
  { id: "micha-gruss", wer: "micha", zeilen: ["Christiane steht neben mir und sagt, ich soll schön grüßen.", "Also: schön grüßen!"],
    antworten: [{ text: "Grüß zurück!", sagt: "Mach ich. Sie hat übrigens schon wieder Kuchen gebacken.", effekt: "herzen" }] },
  /* ---------- Karin ---------- */
  { id: "karin-sotis", wer: "karin", wenn: () => typeof bvHeuteNeu === "function" && bvHeuteNeu(), zeilen: ["Hej Rita! Sotis hat heute einen Elch gesehen. Sagt sie.", "Ich glaube, es war der Briefkasten."],
    antworten: [{ text: "Ha! Typisch Katze.", sagt: "Precis! Sie ist trotzdem sehr stolz." }, { text: "Hast du mir geschrieben?", sagt: "Ja! Der Brief liegt bei dir.", aktion: "bv-auf" }] },
  { id: "karin-fika", wer: "karin", wann: { wochentag: 5, von: 13, bis: 18 }, zeilen: ["Det är fredag – fika!", "Was gibt’s bei dir heute zum Kaffee?"],
    antworten: [{ text: "Kanelbulle!", sagt: "Bra val! Du bist halbe Schwedin.", effekt: "konfetti" }, { text: "Nur Kekse", sagt: "Kekse zählen. Das ist lagom." }] },
  { id: "karin-lucia", wer: "karin", wann: { monat: 12, tag: 13 }, zeilen: ["Glad Lucia, Rita!", "Heute tragen hier alle Kerzen auf dem Kopf. Ich bleib bei meiner Mütze."],
    antworten: [{ text: "Glad Lucia!", sagt: "Tack! Und jetzt: Safranschnecken.", effekt: "schnee" }] },
  { id: "karin-krimi", wer: "karin", zeilen: ["Ich lese gerade einen Krimi, der so spannend ist,", "dass ich die Katze vergessen habe zu füttern. Sie hat sich beschwert."],
    antworten: [{ text: "Welcher?", sagt: "Martin Beck. Zum dritten Mal. Ich vergess immer, wer’s war." }, { text: "Arme Sotis!", sagt: "Sie hat jetzt doppelt bekommen. Lagom ist das nicht." }] },
  /* ---------- Greta (Max’ Freundin) ---------- */
  { id: "greta-umzug", wer: "greta", zeilen: ["Hallo Rita! Ich packe gerade Kisten für Leipzig.", "Max sagt, du hast den besten Tipp gegen Umzugschaos."],
    antworten: [{ text: "Listen!", sagt: "Er hat gesagt, dass du das sagst. Ich schreib jetzt eine Liste.", effekt: "konfetti" }, { text: "Alles beschriften", sagt: "Hab ich! Auf einer Kiste steht jetzt „Kram, wichtig“." }] },
  { id: "greta-gruenkohl", wer: "greta", wann: { monate: [10, 11, 12, 1, 2] }, zeilen: ["Ich hab heute Grünkohl geerntet.", "Der schmeckt erst nach dem ersten Frost richtig gut – wusstest du das?"],
    antworten: [{ text: "Natürlich!", sagt: "Klar weißt du das. Max sagt, du weißt eigentlich alles." }, { text: "Warum eigentlich?", sagt: "Bei Kälte macht die Pflanze aus Stärke Zucker – als Frostschutz. Darum wird er süßer." }] },
  { id: "greta-maxklein", wer: "greta", zeilen: ["Ich wollte dich schon lange mal was fragen:", "Wie war Max eigentlich als kleiner Junge?"],
    antworten: [{ text: "Ein Wirbelwind!", sagt: "Das erklärt einiges. Danke, ich sammle Beweise.", effekt: "herzen" }, { text: "Das bleibt unter uns", sagt: "Hihi. Dann frag ich nächstes Mal wieder." }] },
  { id: "greta-tee", wer: "greta", wann: { monate: [10, 11, 12, 1, 2, 3] }, zeilen: ["Ich hab dir eine Teemischung zusammengestellt:", "Thymian, Salbei und ein bisschen Ingwer. Probier’s mal aus!"],
    antworten: [{ text: "Wie lieb von dir!", sagt: "Gern! Zehn Minuten ziehen lassen, mit Deckel.", effekt: "herzen" }, { text: "Mehr Tee-Ideen?", sagt: "Hier hab ich dir ein paar rausgesucht.", aktion: "wi-auf" }] },
  /* ---------- Pauli (Max’ Schwester) ---------- */
  { id: "pauli-wie", wer: "pauli", zeilen: ["Hey Rita! Ich wollt einfach mal fragen, wie’s dir geht.", "Ganz ohne Grund."],
    antworten: [{ text: "Richtig gut!", sagt: "Schön! Max sagt immer, du bist die Coolste von allen.", effekt: "herzen" }, { text: "Erzähl du lieber!", sagt: "War auf einer Demo und hab danach drei Stunden diskutiert. Also: alles wie immer." }] },
  { id: "pauli-buch", wer: "pauli", zeilen: ["Hast du einen Buchtipp für mich?", "Gern was mit starken Frauen."],
    antworten: [{ text: "Pippi Langstrumpf!", sagt: "Ha! Die trägt ein Pferd. Da kann keiner mithalten.", effekt: "konfetti" }, { text: "Einen Krimi!", sagt: "Mit einer Kommissarin, die allen die Show stiehlt? Gekauft." }] },
  { id: "pauli-kaffee", wer: "pauli", zeilen: ["Max und ich waren heute in Halle Kaffee trinken.", "Er behauptet, er gewinnt jedes Tschüss-Duell gegen dich."],
    antworten: [{ text: "Niemals!", sagt: "Dachte ich mir. Ich sag ihm, er soll üben.", effekt: "herzen" }, { text: "Grüß Max!", sagt: "Mach ich. Er grinst schon." }] },
  /* ---------- Max erzählt (Rita weiß ja eh alles) ---------- */
  { id: "max-leipzig", wer: "max", zeilen: ["Ich muss dir was erzählen:", "Greta und ich haben uns Wohnungen in Leipzig angeguckt!"],
    antworten: [{ text: "Erzähl!", sagt: "Altbau, Balkon, und Platz für einen Gast. Rate mal, für wen.", effekt: "herzen" }, { text: "Und Halle?", sagt: "Ist ja nur eine halbe Stunde. Und Berlin bleibt Berlin." }] },
  { id: "max-rat", wer: "max", zeilen: ["Ich brauch mal deinen Rat.", "Buch oder Pflanze als Geschenk für Greta?"],
    antworten: [{ text: "Eine Pflanze!", sagt: "Stimmt, sie kennt sich mit allem aus, was wächst. Du hast mal wieder recht." }, { text: "Beides!", sagt: "Ein Buch über Pflanzen! Du bist ein Genie.", effekt: "konfetti" }] },
  { id: "max-danke", wer: "max", selten: .3, zeilen: ["Ich hab heute an dich gedacht. Einfach so.", "Danke, dass du immer da bist."],
    antworten: [{ text: "Immer gern, mein Lieber", sagt: "Ich weiß. Genau deshalb. Tschüss! … Ach, nee, das wird sonst wieder ein Duell.", effekt: "herzen" }] },
  /* ---------- Feiertage (nur diese kommen an solchen Tagen) ---------- */
  { id: "jane-heiligabend", wer: "jane", wann: { monat: 12, tag: 24 }, zeilen: ["Frohe Weihnachten, Rita!", "Micha hat den Baum schief aufgestellt. Ich hab gesagt: Das ist Charakter."],
    antworten: [{ text: "Frohe Weihnachten!", sagt: "Dir auch, meine Liebe! Ich heb dir Klöße auf – mit Deckel und Namen drauf.", effekt: "schnee" }, { text: "Gruß an alle in der Binger!", sagt: "Richte ich aus. Micha winkt schon. Mit der Lichterkette.", effekt: "herzen" }] },
  { id: "huhn-weihnachten", wer: "huhn", wann: { monat: 12, tag: 25 }, zeilen: ["Frohe Weihnachten!", "Ich hab mir Lametta umgehängt. Steht mir, oder?"],
    antworten: [{ text: "Sehr festlich!", sagt: "Danke. Ich bleib heute so.", effekt: "konfetti" }, { text: "Du glitzerst", sagt: "Das ist Absicht. Weihnachten darf man das." }] },
  { id: "max-neujahr", wer: "max", wann: { monat: 1, tag: 1 }, zeilen: ["Frohes Neues, Rita!", "Erste Amtshandlung im neuen Jahr: Ich sag nicht Tschüss."],
    antworten: [{ text: "Frohes Neues!", sagt: "Dir auch! Und jetzt sag ich’s doch. Tschüss!", effekt: "konfetti" }, { text: "Das hältst du nicht durch", sagt: "Stimmt. Hab ich gestern schon gemerkt.", effekt: "herzen" }] },
  { id: "huhn-geburtstag", wer: "huhn", wann: { geburtstag: true }, zeilen: ["Heute ist dein Geburtstag!", "Ich hab geübt. Pass auf, jetzt sing ich."],
    antworten: [{ text: "Na los!", sagt: "Zum Geburtstag viel Glück … Den Rest summ ich.", effekt: "noten", tanz: true }, { text: "Danke, Hühnchen!", sagt: "Alles Gute, Rita! Von Herzen. Aus Ton.", effekt: "herzen" }] },
  { id: "huhn-schnee-2", wer: "huhn", wann: { monate: [12, 1, 2] }, wenn: () => { const t = (S.ereignisse || {})["huhn-schnee"]; return !!t && (tagDatum(heute()) - tagDatum(t)) / 864e5 > 200; }, zeilen: ["Letztes Jahr dachte ich, Schnee ist Quark von oben.", "Ich hatte recht."],
    antworten: [{ text: "Du Schlauberger", sagt: "Ich weiß. Steht so auch auf meinem Sockel.", effekt: "schnee" }, { text: "Bau ein Schneehuhn!", sagt: "Aus Schnee? Dann schmilzt es. Ich bleib lieber aus Ton." }] },
  /* ---------- Passend zu dem, was Rita eingetragen hat ---------- */
  { id: "micha-pilze", wer: "micha", wann: { monate: [8, 9, 10, 11] }, wenn: () => { const mo = tagPlus(heute(), -((tagDatum(heute()).getDay() + 6) % 7)); return S.eintraege.filter(e => e.tag >= mo && (e.t === "gehen" || e.t === "draussen")).length >= 3; }, zeilen: ["Wenn du so viel im Forst unterwegs bist:", "Hast du Pilze gesehen? Ich frag nur. Für die Pfanne."],
    antworten: [{ text: "Ein paar!", sagt: "Wusst ich’s. Wo, verrätst du natürlich nicht.", effekt: "herzen" }, { text: "Nur Eichhörnchen", sagt: "Die sammeln auch. Aber die teilen nicht." }] },
  { id: "max-buch-fertig", wer: "max", wenn: () => S.eintraege.some(e => e.t === "buchfertig" && e.tag >= tagPlus(heute(), -1)), zeilen: ["Hühnchen hat gepetzt: Du hast ein Buch ausgelesen.", "Und, wie war’s?"],
    antworten: [{ text: "Großartig!", sagt: "Dann brauchst du Nachschub. Accio nächstes Buch!", aktion: "lesebegleiter" }, { text: "Ging so", sagt: "Auch gut zu wissen. Das nächste wird besser." }] },
  /* ---------- Hühnchen ---------- */
  { id: "huhn-detektiv", wer: "huhn", zeilen: ["Ich ermittle in einem Fall.", "Jemand hat einen Keks gegessen. Die Spuren führen … zu dir."],
    antworten: [{ text: "Ich war’s!", sagt: "Wusst ich’s doch! Fall gelöst.", effekt: "konfetti" }, { text: "Das warst du!", sagt: "Ich … hab kein Alibi. Und keine Hände. Freispruch!" }] },
  { id: "huhn-tanz", wer: "huhn", zeilen: ["Ich hab heute Nacht geübt.", "Pass auf, jetzt kommt’s!"],
    antworten: [{ text: "Zeig her!", sagt: "Ta-daaa!", effekt: "noten", tanz: true }, { text: "Lieber später", sagt: "Dann übe ich noch ein bisschen. Heimlich." }] },
  { id: "huhn-wetter", wer: "huhn", zeilen: ["Wetterbericht vom Fensterbrett:", "Hundert Prozent Chance auf Tee."],
    antworten: [{ text: "Klingt gut", sagt: "Ich empfehle Ingwer. Ich hab da ein paar Rezepte.", aktion: "wi-auf" }, { text: "Und morgen?", sagt: "Morgen: leicht bewölkt mit Aussicht auf Kuchen." }] },
  { id: "huhn-grusel", wer: "huhn", wann: { monat: 10, tag: 31 }, zeilen: ["Buh!", "… hast du dich erschrocken? Ein bisschen? Ein ganz kleines bisschen?"],
    antworten: [{ text: "Fürchterlich!", sagt: "Jaaa! Ich bin ein Gespenst-Huhn!", effekt: "konfetti" }, { text: "Nö.", sagt: "Mist. Nächstes Jahr dann." }] },
  { id: "huhn-schnee", wer: "huhn", wann: { monate: [12, 1, 2] }, wenn: () => !(S.ereignisse || {})["huhn-schnee"], zeilen: ["Ich hab gehört, es soll schneien.", "Ich hab noch nie Schnee gesehen. Ich steh ja immer drinnen!"],
    antworten: [{ text: "Er ist kalt und weich", sagt: "Wie Quark? Nur von oben?", effekt: "schnee" }, { text: "Du wirst staunen", sagt: "Ich staune jetzt schon. Vorsorglich." }] },
  { id: "huhn-buch", wer: "huhn", zeilen: ["Ich hab heimlich in deinem Buch gelesen.", "Keine Sorge, ich hab das Lesezeichen wieder richtig reingelegt. Glaub ich."],
    antworten: [{ text: "Und? Gut?", sagt: "Zu wenig Hühner. Sonst prima.", aktion: "lesebegleiter" }, { text: "Hühnchen!", sagt: "Ich konnt nicht anders. Die Spannung!" }] },
];
const ER_WER = { max: "Max", jane: "Christiane", micha: "Micha", karin: "Karin", greta: "Greta", pauli: "Pauli", dani: "Dani", huhn: "Hühnchen" };
function erFigur(wer, gr) {
  if (wer === "huhn") return huhnFrontSVG(gr);
  return ({ max: maxSVG, jane: janeSVG, micha: michaSVG, karin: karinKopfSVG, greta: gretaSVG, pauli: pauliSVG, dani: typeof daniSVG === "function" ? daniSVG : maxSVG }[wer] || maxSVG)(gr);
}
function erPasst(e) {
  const d = jetzt(), w = e.wann || {};
  if (w.monat && d.getMonth() + 1 !== w.monat) return false;
  if (w.tag && d.getDate() !== w.tag) return false;
  if (w.geburtstag && !(S.geburtstag && S.geburtstag === heute().slice(5))) return false;
  if (w.ostern && !(typeof osterSonntag === "function" && heute() === osterSonntag(d.getFullYear()))) return false;
  if (w.monate && !w.monate.includes(d.getMonth() + 1)) return false;
  if (w.wochentag != null && d.getDay() !== w.wochentag) return false;
  if (w.von != null && (d.getHours() < w.von || d.getHours() >= w.bis)) return false;
  if (e.wer === "huhn" && !S.huhn) return false;
  if (e.ab && typeof hpFrei === "function" && !hpFrei(e.ab)) return false; // Harry Potter: erst ab dem Kapitel
  if (e.wenn && !e.wenn()) return false;
  if (e.selten && (hash32('sel' + e.id + heute()) % 100) / 100 > e.selten) return false;
  return true;
}
if (typeof D !== "undefined" && Array.isArray(D.ereignisse2)) EREIGNISSE.push(...D.ereignisse2.filter(e => e && e.id && !EREIGNISSE.some(x => x.id === e.id)));
/* Wann kommt jemand vorbei? Selten: Ein festes Tages-Los bestimmt die Besuchstage (etwa 2–3 pro Woche),
   dann höchstens ein Besuch am Tag (an Anlässen zwei), mindestens 25 Minuten Abstand.
   Erst nach der Morgenfrage, nie nach Einträgen, nicht am ersten Tag und nicht an Sparflamme-Tagen.
   An Feiertagen kommen nur die Besuche, die zu diesem Tag gehören. */
function erFesttag(h) {
  const md = h.slice(5), y = Number(h.slice(0, 4));
  return ["12-24", "12-25", "12-26", "12-31", "01-01"].includes(md) || (typeof osterSonntag === "function" && h === osterSonntag(y)) || (!!S.geburtstag && S.geburtstag === md);
}
const erDatiert = e => !!(e.wann && (e.wann.tag || e.wann.wochentag != null || e.wann.geburtstag));
function ereignisPruefen(anlass = "start") {
  if (S.eierAus || !S.onboard || SHEETS.length || $(".ereignis") || S.timer) return;
  const h = heute(); S.ereignisse = S.ereignisse || {};
  const kurzWeg = anlass === "start" && Date.now() - (S.letztesOeffnen || 0) < 90 * 60e3; // kurzes Wegwischen zählt nicht
  if (anlass === "start") { S.letztesOeffnen = Date.now(); speichern(); }
  if (h === S.start || S.tf[h] === "D" || !S.tf[h]) return;
  if (!S.erHeute || S.erHeute.tag !== h) S.erHeute = { tag: h, n: 0, zuletzt: 0 };
  if (Date.now() - S.erHeute.zuletzt < 25 * 60e3 || kurzWeg) return;
  const kand = EREIGNISSE.filter(e => erPasst(e) && !(S.ereignisse[e.id] && (tagDatum(h) - tagDatum(S.ereignisse[e.id])) / 864e5 < 75));
  if (!kand.length) return;
  const datiert = kand.filter(erDatiert);
  if (erFesttag(h) && !datiert.length) return;
  const erTag = (hash32("ertag" + h + S.seed) % 100) < 35;
  if (!erTag && !datiert.length) return;
  if (S.erHeute.n >= (datiert.length ? 2 : 1)) return;
  const chance = datiert.length && !S.erHeute.n ? .7 : .35;
  if (Math.random() > chance) return;
  const pool = datiert.length && (!S.erHeute.n || erFesttag(h)) ? datiert : kand;
  const e = pool[Math.floor(Math.random() * pool.length)];
  S.erHeute.n++; S.erHeute.zuletzt = Date.now(); S.ereignisse[e.id] = h; speichern();
  setTimeout(() => { if (!SHEETS.length && !$(".ereignis")) ereignisZeigen(e); }, anlass === "tab" ? 900 + Math.random() * 1600 : 1400);
}
const ER_TSCHUESS = { max: "Tschüss, Max!", jane: "Tschüss, Christiane!", micha: "Tschüss, Micha!", karin: "Hej då, Karin!", greta: "Tschüss, Greta!", pauli: "Tschüss, Pauli!", dani: "Hej då, Dani!", huhn: "Bis gleich, Hühnchen!" };
function ereignisZeigen(e) {
  if (typeof e === "string") e = EREIGNISSE.find(x => x.id === e); if (!e || $(".ereignis")) return;
  const el = document.createElement("div"); el.className = "ereignis"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", `${ER_WER[e.wer]} schaut vorbei`);
  el.innerHTML = `<button class="ereignis-zu" data-er="zu" aria-label="Schließen">${ic("schliessen")}</button><div class="ereignis-kopf"><div class="er-figur fig-idle ${e.wer === "huhn" ? "er-huhn" : ""}">${erFigur(e.wer, 84)}</div><div class="er-text"><span class="er-name">${ER_WER[e.wer]}</span><div class="er-blase" aria-live="polite"></div></div></div><div class="er-antworten"></div>`;
  document.body.appendChild(el); haptik("auswahl"); histBesuchAuf();
  const fig = el.querySelector(".er-figur"), blase = el.querySelector(".er-blase"), ant = el.querySelector(".er-antworten");
  // jede Zeile bleibt stehen, die nächste kommt darunter
  const zeile = (text, cb, art = "") => { const p = document.createElement("p"); p.className = "er-zeile " + art; blase.appendChild(p); sprechen(p, text, fig, cb); blase.scrollTop = blase.scrollHeight; };
  let i = 0;
  const weiter = () => {
    if (el._weg) return;
    if (i < e.zeilen.length) { const z = e.zeilen[i]; zeile(z, () => { i++; setTimeout(weiter, el._sofort ? 250 : i < e.zeilen.length ? Math.max(1000, z.length * 35) : 400); }); return; }
    ant.innerHTML = e.antworten.map((a, k) => `<button class="knopf zweit" data-er="a" data-k="${k}">${esc(a.text)}</button>`).join("");
  };
  setTimeout(weiter, 450);
  el.addEventListener("click", ev => {
    // Antippen der Sprechblase zeigt den Text sofort ganz
    if (ev.target.closest(".er-blase")) { el._sofort = true; return; }
    const b = ev.target.closest("[data-er]"); if (!b) return;
    if (b.dataset.er === "zu" || b.dataset.er === "ende") { ereignisWeg(el); return; }
    if (b.dataset.er !== "a") return;
    const a = e.antworten[Number(b.dataset.k)]; ant.innerHTML = ""; el._sofort = false;
    const du = document.createElement("p"); du.className = "er-zeile er-du"; du.textContent = a.text; blase.appendChild(du);
    zeile(a.sagt, () => {
      if (el._weg) return;
      if (a.effekt) erEffekt(a.effekt, fig);
      if (a.lacht && typeof maxLacht === "function") maxLacht(fig);
      if (a.tanz) fig.classList.add("er-tanzt");
      if (a.aktion && a.aktion.startsWith("liste:")) { S.liste = S.liste || []; S.liste.push({ id: "l" + Date.now().toString(36), text: a.aktion.slice(6), neu: heute() }); speichern(); render({ halteScroll: true, ohneAnim: true }); }
      if (a.aktion && !a.aktion.startsWith("liste:")) setTimeout(() => {
        if (el._weg) return;
        ereignisWeg(el);
        setTimeout(() => { if (a.aktion.startsWith("tel:")) telStarten(a.aktion.slice(4)); else aktion(a.aktion, {}, document.body); }, 260);
      }, 1500);
      else ant.innerHTML = `<button class="knopf zweit" data-er="ende">${esc(ER_TSCHUESS[e.wer] || "Tschüss!")}</button>`;
    });
  });
}
function ereignisWeg(el) { if (el._weg) return; el._weg = true; el.classList.add("weg"); setTimeout(() => el.remove(), 300); if (typeof histBesuchZu === "function") histBesuchZu(); }
/* Sprechen: Text erscheint Buchstabe für Buchstabe, der Mund bewegt sich dazu */
function sprechen(ziel, text, fig, fertig) {
  ziel.textContent = ""; if (fig) fig.classList.add("spricht");
  if (REDUCED()) { ziel.textContent = text; if (fig) setTimeout(() => fig.classList.remove("spricht"), 400); if (fertig) setTimeout(fertig, 500); return; }
  // Platz für den ganzen Satz gleich reservieren, damit nichts springt
  const sicht = document.createElement("span"), rest = document.createElement("span"); rest.className = "rest"; rest.textContent = text; ziel.textContent = ""; ziel.append(sicht, rest);
  let n = 0, letzt = 0, warte = 0;
  const schritt = t => { if (!letzt) letzt = t; const dt = t - letzt;
    if (dt >= warte) { letzt = t; n++; sicht.textContent = text.slice(0, n); rest.textContent = text.slice(n); warte = /[.,!?…–]/.test(text[n - 1]) ? 160 : 30; if (ziel.closest && (ziel.closest(".ereignis") || {})._sofort) { n = text.length; sicht.textContent = text; rest.textContent = ""; } }
    if (n < text.length) requestAnimationFrame(schritt); else { if (fig) fig.classList.remove("spricht"); if (fertig) fertig(); } };
  requestAnimationFrame(schritt);
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
