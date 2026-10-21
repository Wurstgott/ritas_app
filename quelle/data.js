/* ============================================================
   Lichtung – Inhalte als Daten (Kern)
   Wirkwerte sind fachlich begründete Setzungen (siehe Konzept 01/02),
   keine Messgrößen. Quellen stehen bei den Wissens-Inhalten.
   ============================================================ */
"use strict";
const D = {};

/* ---------- Felder (Lebensbereiche) ---------- */
D.felder = {
  bewegung: { name: "Bewegung", gewicht: 1.0, k: "k-bewegung", maxMin: 90 },
  menschen: { name: "Menschen", gewicht: 1.0, k: "k-menschen" },
  mut:      { name: "Neues & Mut", gewicht: 1.0, k: "k-mut" },
  geist:    { name: "Lesen & Genuss", gewicht: 0.8, k: "k-geist" },
  schaffen: { name: "Hände & Haus", gewicht: 0.8, k: "k-schaffen" },
  sorge:    { name: "Gut für mich", gewicht: 0.6, k: "k-ruhe", maxMin: 90 }
};

/* Bildorte: wo eine Tätigkeit in der Lichtung sichtbar wird */
D.orte = {
  weg:      { name: "Der Weg", text: "Jeder Weg, den du gehst, wird hier sichtbar: Steine am Rand, ab und zu ein Pfahl, später Wegweiser.", k: "k-bewegung" },
  fenster:  { name: "Die Häuser", text: "Jeder Herzensmensch hat hier ein helles Fenster. Wenn ihr Zeit miteinander verbringt, blühen vor dem Haus Blumen in den Kästen.", k: "k-menschen" },
  tanz:     { name: "Der Tanzboden", text: "Jede Tanzstunde legt Fußspuren auf den Boden, Musik hängt eine Laterne an die Schnur.", k: "k-tanz" },
  eiche:    { name: "Die Leseeiche", text: "Lesen und Hören lassen die Krone dichter werden. Jedes ausgelesene Buch hängt als Band am Ast.", k: "k-geist" },
  quelle:   { name: "Die Quelle", text: "Ruhe ist hier eine Quelle. Aus ihr wird ein Bach und mit der Zeit ein Weiher.", k: "k-ruhe" },
  wiese:    { name: "Die Wiese", text: "Was deine Hände tun, blüht hier – Blumen je nach Jahreszeit.", k: "k-schaffen" },
  horizont: { name: "Der Horizont", text: "Jeder Ausflug wird eine Silhouette in der Ferne und ein Andenken im Setzkasten.", k: "k-draussen" },
  mut:      { name: "Glühwürmchen", text: "Wenn etwas Überwindung gekostet hat, leuchtet danach ein Glühwürmchen mehr im Wald.", k: "k-mut" }
};

/* ---------- Tagesform (filtert Vorschläge, bewertet nichts) ---------- */
D.tagesformen = [
  { id: "A", name: "Voller Schwung", text: "Ich hab was vor", icon: "sonne" },
  { id: "B", name: "Halbe Kraft", text: "Was Kleines geht, nicht zu weit", icon: "tasse" },
  { id: "C", name: "Gemütlich", text: "Heute eher drinnen und in Ruhe", icon: "lampe" },
  { id: "D", name: "Sparflamme", text: "Nur das Nötigste, und das reicht", icon: "waerme" }
];

/* ---------- Tätigkeiten ----------
   art: km | min | klein | fest | person | buch
   feld: Hauptfeld, neben: Nebenfeld (50 % der Minuten)
   bild: Bildort; tf: an welchen Tagen vorgeschlagen; info: sachlicher Satz nach dem Eintragen */
D.taetigkeiten = [
  // Bewegung
  { id: "gehen", name: "Gehen", kurz: "Gehen", art: "km", std: 2, feld: "bewegung", bild: "weg", draussen: true, tf: "ABC", icon: "schuh",
    info: ["Gehen zählt – ob zum Briefkasten oder die große Runde im Forst.", "Lieber zweimal kurz als einmal zu lang – beides zählt.", "Gehen trainiert ganz nebenbei das Gleichgewicht."] },
  { id: "gymnastik", name: "Gymnastik oder Seniorensport", kurz: "Gymnastik", art: "min", std: 30, feld: "bewegung", bild: "weg", tf: "AB", icon: "arme",
    info: ["Kraft und Beweglichkeit machen vieles leichter: Treppe, Einkauf, Tanzstunde."] },
  { id: "gleichgewicht", name: "Gleichgewichtsübung (wie von der Physio)", kurz: "Gleichgewicht", art: "min", std: 10, feld: "bewegung", bild: "weg", tf: "ABC", icon: "waage",
    info: ["Sicher auf den Beinen – das merkt man bei jedem Schritt."] },
  { id: "ruecken", name: "Meine Rückenübungen", kurz: "Rücken", art: "min", std: 15, feld: "bewegung", bild: "weg", tf: "ABC", icon: "ruecken",
    info: ["Deine Übungen aus der Physiotherapie – genau so, wie sie für dich gedacht sind."] },
  { id: "dehnen", name: "Dehnen oder Atmen im Sitzen", kurz: "Dehnen", art: "min", std: 10, feld: "bewegung", bild: "weg", tf: "BCD", icon: "atem",
    info: ["Ruhiges Atmen und Dehnen im Sitzen ist Bewegung, die an jedem Tag geht."] },
  { id: "alltag", name: "Alltagsbewegung (Treppe, kleiner Einkauf mit Trolley)", kurz: "Alltag", art: "min", std: 20, feld: "bewegung", bild: "weg", tf: "AB", icon: "tasche",
    info: ["Alltagsbewegung zählt genauso wie ein Spaziergang."] },
  { id: "sitztanz", name: "Im Sitzen zur Musik bewegt", kurz: "Sitztanz", art: "min", std: 15, feld: "bewegung", neben: "geist", bild: "tanz", tf: "BCD", icon: "note",
    info: ["Musik und Bewegung im Sitzen – Rhythmus tut dem Kopf und dem Körper gut."] },
  // Tanz & Menschen
  { id: "tanzstunde", name: "Tanzstunde gegeben", kurz: "Tanzstunde", art: "min", std: 60, feld: "menschen", neben: "bewegung", bild: "tanz", tf: "AB", icon: "fuss",
    info: ["Tanzstunde gegeben – heute hat jemand von dir gelernt.", "Dein Tanzschüler weiß hoffentlich, was für eine Lehrerin er hat."] },
  { id: "tanzplanen", name: "Schritte und Musik für die Stunde ausgedacht", kurz: "Stunde planen", art: "min", std: 20, feld: "geist", bild: "tanz", tf: "BC", icon: "note",
    info: ["Gut vorbereitet geht die Stunde leichter von der Hand."] },
  { id: "besuch", name: "Besuch (bekommen oder gemacht)", kurz: "Besuch", art: "person", std: 60, feld: "menschen", bild: "fenster", tf: "AB", icon: "tassen",
    info: ["Zusammen gewesen – am Küchentisch, unterwegs oder in der Binger."] },
  { id: "telefon", name: "Telefoniert", kurz: "Telefoniert", art: "person", std: 20, feld: "menschen", bild: "fenster", tf: "ABCD", icon: "telefon",
    info: ["Telefoniert. Und bestimmt an alles gedacht, was du fragen wolltest."] },
  { id: "nachbar", name: "Gespräch im Haus", kurz: "Im Haus", art: "person", std: 15, feld: "menschen", bild: "fenster", tf: "ABC", icon: "haus",
    info: ["Ein Schwatz im Haus – so bleibt man auf dem Laufenden."] },
  { id: "brief", name: "Brief, Karte oder lange Nachricht", kurz: "Geschrieben", art: "person", std: 20, feld: "menschen", bild: "fenster", tf: "BC", icon: "brief",
    info: ["Geschriebene Worte kann man aufheben und noch einmal lesen."] },
  { id: "gemeinschaft", name: "Mit dabei gewesen (Kaffeerunde, Fest, Kurs)", kurz: "Dabei gewesen", art: "min", std: 60, feld: "menschen", bild: "fenster", tf: "AB", icon: "tassen",
    info: ["Gemeinsam etwas erleben, ohne viel planen zu müssen."] },
  { id: "geholfen", name: "Jemandem geholfen", kurz: "Geholfen", art: "person", std: 30, feld: "menschen", bild: "fenster", tf: "ABC", icon: "hand",
    info: ["Geholfen. Wer sonst hätte daran gedacht?"] },
  { id: "hilfe", name: "Hilfe angenommen", kurz: "Hilfe angenommen", art: "fest", w: 15, feld: "sorge", bild: "quelle", tf: "BCD", icon: "hand",
    info: ["Zu zweit geht’s schneller. Und der andere freut sich, dass er randurfte."] },
  // Lesen & Genuss
  { id: "lesen", name: "Gelesen", kurz: "Lesen", art: "min", std: 20, feld: "geist", bild: "eiche", tf: "ABC", icon: "buch",
    info: ["Gelesen. Lesezeichen rein, morgen geht’s spannend weiter.", "Seite gemerkt?"] },
  { id: "hoerbuch", name: "Hörbuch oder Hörspiel", kurz: "Hörbuch", art: "min", std: 30, feld: "geist", bild: "eiche", tf: "BCD", icon: "kopfhoerer",
    info: ["Hören geht auch mit geschlossenen Augen – und zählt wie Lesen."] },
  { id: "buchfertig", name: "Ein Buch ausgelesen", kurz: "Buch fertig", art: "buch", feld: "geist", bild: "eiche", tf: "ABC", icon: "lesezeichen", w: 20,
    info: ["Ein ganzes Buch. An der Eiche hängt jetzt ein Lesezeichen mit seinem Titel."] },
  { id: "tagebuch", name: "Tagebuch geschrieben", kurz: "Tagebuch", art: "min", std: 15, feld: "geist", bild: "eiche", tf: "ABCD", icon: "feder",
    info: ["Aufgeschrieben ist aufgehoben.", "Ein paar Zeilen am Tag sortieren die Gedanken."] },
  { id: "raetsel", name: "Rätsel auf Papier", kurz: "Rätsel", art: "min", std: 20, feld: "geist", bild: "eiche", tf: "BC", icon: "raetsel",
    info: ["Knobeln hält den Kopf beweglich."] },
  { id: "radio", name: "Radio, Podcast oder Doku bewusst", kurz: "Gehört", art: "min", std: 30, feld: "geist", bild: "eiche", tf: "BCD", icon: "radio",
    info: ["Gut zugehört. Das kannst du ja sowieso."] },
  { id: "gelernt", name: "Etwas Neues gelernt", kurz: "Gelernt", art: "min", std: 15, feld: "mut", bild: "mut", tf: "ABC", icon: "funke",
    info: ["Wieder was gelernt. Gesprächsstoff für die nächste Kaffeerunde."] },
  { id: "erinnern", name: "Erinnerungen aufgeschrieben oder erzählt", kurz: "Erinnert", art: "min", std: 20, feld: "geist", neben: "menschen", bild: "eiche", tf: "BC", icon: "feder",
    info: ["Erinnerungen erzählen ist wie Fotos anschauen, nur wärmer."] },
  { id: "musik", name: "Musik gehört, die mir guttut", kurz: "Musik", art: "min", std: 20, feld: "geist", bild: "tanz", tf: "ABCD", icon: "note",
    info: ["Ein gutes Lied hebt den ganzen Tag."] },
  { id: "singen", name: "Gesungen oder mitgesummt", kurz: "Gesungen", art: "klein", feld: "geist", bild: "tanz", tf: "ABC", icon: "note",
    info: ["Mitgesungen! Schief oder schön – zählt beides."] },
  { id: "kultur", name: "Konzert, Theater oder Kino", kurz: "Kultur", art: "min", std: 120, feld: "geist", neben: "mut", bild: "tanz", tf: "A", icon: "maske",
    info: ["Raus und was erlebt. Erzähl!"] },
  { id: "goennen", name: "Mir etwas gegönnt", kurz: "Gegönnt", art: "klein", feld: "geist", bild: "wiese", tf: "ABC", icon: "kuchen",
    info: ["Gegönnt. Steht völlig zu Recht auf der Liste."] },
  { id: "licht", name: "Licht, Himmel oder Abendrot angeschaut", kurz: "Angeschaut", art: "klein", feld: "geist", bild: "wiese", draussen: true, tf: "ABCD", icon: "sonne",
    info: ["Gut hingeguckt. Der Himmel hat sowieso das beste Programm."] },
  { id: "natur", name: "Etwas in der Natur entdeckt", kurz: "Entdeckt", art: "klein", feld: "geist", bild: "wiese", draussen: true, tf: "ABC", icon: "blatt",
    info: ["Wer genau hinschaut, findet im Forst jeden Tag etwas Neues."] },
  // Hände & Haus
  { id: "kochen", name: "Mir etwas Gutes gekocht", kurz: "Gekocht", art: "min", std: 30, feld: "schaffen", bild: "wiese", tf: "BC", icon: "topf",
    info: ["Selbst gekocht schmeckt es doppelt."] },
  { id: "handarbeit", name: "Gemalt, gebastelt oder Handarbeit", kurz: "Handarbeit", art: "min", std: 30, feld: "schaffen", bild: "wiese", tf: "BC", icon: "pinsel",
    info: ["Selbst gemacht – und kein anderer hat so eins."] },
  { id: "pflanzen", name: "Pflanzen versorgt (Balkon, Zimmer)", kurz: "Pflanzen", art: "klein", feld: "schaffen", bild: "wiese", tf: "ABC", icon: "blume",
    info: ["Etwas wächst, weil du dich kümmerst."] },
  { id: "ordnung", name: "Eine kleine Ecke aufgeräumt", kurz: "Aufgeräumt", art: "min", std: 15, feld: "schaffen", bild: "wiese", tf: "BC", icon: "kiste",
    info: ["Eine Schublade, ein Fach – kleine Ordnung, sichtbarer Unterschied."] },
  { id: "papier", name: "Papierkram erledigt", kurz: "Papierkram", art: "klein", feld: "schaffen", bild: "wiese", tf: "BC", icon: "brief",
    info: ["Erledigt. Eine Sache weniger im Kopf."] },
  { id: "foto", name: "Ein schönes Foto gemacht", kurz: "Foto", art: "klein", feld: "schaffen", bild: "wiese", tf: "ABC", icon: "kamera",
    info: ["Ein Foto hält einen Moment fest, den man sonst vergessen hätte."] },
  { id: "zimmer", name: "Es mir in meinem Zimmer schön gemacht", kurz: "Gemütlich", art: "min", std: 30, feld: "sorge", bild: "quelle", tf: "BCD", icon: "lampe",
    info: ["Schön gemacht. Jetzt sieht’s noch mehr nach dir aus."] },
  // Für mich sorgen
  { id: "ruhe", name: "Bewusst ausgeruht (Couch, Bett, Sessel)", kurz: "Ausgeruht", art: "min", std: 30, feld: "sorge", bild: "quelle", tf: "BCD", icon: "decke",
    info: ["Pause gemacht. Darf auf die Liste – mit Haken."] },
  { id: "arzt", name: "Arzttag überstanden", kurz: "Arzttag", art: "fest", w: 20, feld: "sorge", bild: "quelle", tf: "ABCD", icon: "kreuz", stern: true,
    info: ["Ein Arzttag ist ein Arbeitstag. Gut, dass er hinter dir liegt."] },
  { id: "durchgehalten", name: "Heute durchgehalten", kurz: "Durchgehalten", art: "fest", w: 18, feld: "sorge", bild: "quelle", tf: "CD", icon: "waerme", stern: true,
    info: ["Durchgehalten. Der wichtigste Haken des Tages."] },
  { id: "waerme", name: "Wärmflasche, Bad oder Eincremen", kurz: "Wärme", art: "min", std: 20, feld: "sorge", bild: "quelle", tf: "CD", icon: "waerme",
    info: ["Etwas Gutes für den Körper."] },
  { id: "versorgung", name: "Meine Routine in Ruhe erledigt", kurz: "Routine", art: "klein", feld: "sorge", bild: "quelle", tf: "BCD", icon: "kiste",
    info: ["In Ruhe gemacht, ohne Eile."] },
  { id: "getrunken", name: "Genug getrunken", kurz: "Getrunken", art: "klein", feld: "sorge", bild: "quelle", tf: "ABCD", icon: "glas",
    info: ["Glas leer, Haken dran."] },
  { id: "ausgesprochen", name: "Etwas Belastendes ausgesprochen", kurz: "Ausgesprochen", art: "min", std: 30, feld: "menschen", neben: "sorge", bild: "quelle", tf: "BCD", icon: "sprechen",
    info: ["Gut, dass es raus ist. Gesagt ist gesagt."] },
  { id: "draussensitzen", name: "Auf dem Balkon oder draußen gesessen", kurz: "Balkon", art: "min", std: 20, feld: "sorge", bild: "quelle", draussen: true, tf: "BCD", icon: "bank",
    info: ["Frische Luft und Tageslicht tun gut, auch im Sitzen."] },
  // Neues & Mut
  { id: "eroller", name: "E-Roller geübt (mit Begleitung)", kurz: "E-Roller", art: "fest", w: 15, feld: "mut", bild: "mut", draussen: true, tf: "A", icon: "roller", mut: true,
    info: ["Helm auf und los. Rollerfahren kannst du jetzt also auch."] },
  { id: "erstesmal", name: "Etwas zum ersten Mal gemacht", kurz: "Zum ersten Mal", art: "fest", w: 15, feld: "mut", bild: "mut", tf: "AB", icon: "funke", mut: true,
    info: ["Zum ersten Mal! Heute Abend leuchtet ein Glühwürmchen mehr im Wald."] },
  { id: "abgehakt", name: "Von meiner Liste abgehakt", kurz: "Abgehakt", art: "klein", feld: "schaffen", bild: "wiese", tf: "ABCD", icon: "boxhaken",
    info: ["Haken dran."] },
  { id: "frei", name: "Etwas anderes, das mir gutgetan hat", kurz: "Etwas anderes", art: "min", std: 20, feld: "geist", bild: "wiese", tf: "ABCD", icon: "stern",
    info: ["Eingetragen. Das zählt."] }
];

/* Schnell-Kacheln (Voreinstellung, unter „Für Helfer“ änderbar) */
D.schnell = ["gehen", "lesen", "telefon", "tagebuch"];

/* Gruppen für „Etwas anderes eintragen“ */
D.gruppen = [
  { name: "Bewegung", ids: ["gehen", "gymnastik", "gleichgewicht", "ruecken", "dehnen", "alltag", "sitztanz"] },
  { name: "Menschen", ids: ["telefon", "besuch", "nachbar", "brief", "tanzstunde", "gemeinschaft", "geholfen", "ausgesprochen"] },
  { name: "Lesen, Hören, Musik", ids: ["tagebuch", "lesen", "hoerbuch", "buchfertig", "musik", "singen", "tanzplanen", "radio", "raetsel", "erinnern", "kultur"] },
  { name: "Draußen & Neues", ids: ["draussensitzen", "natur", "licht", "eroller", "erstesmal", "gelernt"] },
  { name: "Hände & Haus", ids: ["kochen", "handarbeit", "pflanzen", "ordnung", "papier", "foto", "zimmer"] },
  { name: "Gut für mich", ids: ["ruhe", "arzt", "durchgehalten", "waerme", "versorgung", "getrunken", "hilfe", "goennen"] },
  { name: "Sonst", ids: ["frei"] }
];

/* ---------- Herzensmenschen (Voreinstellung) ----------
   Jede Person hat ihr eigenes Fenster im Haus. Kein Zählen, kein „lange nicht gemeldet“. */
D.menschenStart = [
  { id: "max", name: "Max", rolle: "Patensohn", farbe: "#C98A1B" },
  { id: "christiane", name: "Christiane", rolle: "Freundin", farbe: "#B5532F" },
  { id: "daniel", name: "Daniel und Familie", rolle: "Sohn, in Schweden", farbe: "#3F6E8C" },
  { id: "tanzschueler", name: "Mein Tanzschüler", rolle: "Nachbar", farbe: "#7A2A1B" },
  { id: "micha", name: "Micha", rolle: "Christianes Mann", farbe: "#4A6B3A" },
  { id: "nachbarin", name: "Nachbarin", rolle: "im Haus", farbe: "#6B4A7A" }
];

/* ---------- Stufen der Lichtung ----------
   Name, Text und Bild sind deckungsgleich: was der Name sagt, kommt ins Bild. */
D.stufen = [
  { w: 0,     name: "Dickicht", el: "start",
    text: "Hier ist noch dichter Wald. Zwischen zwei Kiefern fällt ein schmaler Streifen Licht." },
  { w: 15,    name: "Trampelpfad", el: "pfad",
    text: "Die ersten Meter Weg sind zu sehen. Jemand ist hier gegangen: du." },
  { w: 100,   name: "Die Bank", el: "bank",
    text: "Am Weg steht jetzt eine Holzbank. Bester Platz für einen Schwatz." },
  { w: 300,   name: "Licht fällt ein", el: "licht",
    text: "Die Bäume treten einen Schritt zurück. Die Sonne reicht bis auf den Boden." },
  { w: 700,   name: "Der Steg", el: "steg",
    text: "Über den Bach führt ein kleiner Holzsteg. Man kann trockenen Fußes hinüber." },
  { w: 1400,  name: "Die Laternenschnur", el: "schnur",
    text: "Zwischen zwei Bäumen hängt eine Schnur über dem Tanzboden. Musik findet hier ihren Platz." },
  { w: 2500,  name: "Der Garten am Haus", el: "garten",
    text: "Vor dem Haus ist ein kleiner Garten entstanden, mit Zaun und Beet." },
  { w: 4000,  name: "Die Schneise", el: "schneise",
    text: "Hinter den Bäumen öffnet sich das Land. Man sieht weit – bis zu den Orten, an denen du warst." },
  { w: 6000,  name: "Der Hochsitz", el: "hochsitz",
    text: "Am Waldrand steht ein Hochsitz. Von oben sieht man, wie weit die Wege schon reichen." },
  { w: 9000,  name: "Die Birken", el: "birken",
    text: "Drei helle Birken stehen zwischen den Kiefern. Ihr Laub flirrt im Wind." },
  { w: 13000, name: "Das Vogelhaus", el: "vogelhaus",
    text: "An der Eiche hängt ein Vogelhaus. Morgens ist hier viel los." },
  { w: 18500, name: "Der Pavillon", el: "pavillon",
    text: "Neben dem Tanzboden steht ein kleiner Pavillon. Darunter ist Platz für Musik und für Gäste." },
  { w: 26000, name: "Das Fest", el: "fest",
    text: "Lichter zwischen den Häusern und ein langer Tisch mit Kuchen. Max, Christiane und die Nachbarn sitzen mit dran." }
];

/* ---------- Mut-Leiter (Ausflüge) ---------- */
D.leiter = [
  { s: 1, name: "Vor der Tür", text: "Runde ums Haus, zum Briefkasten, Bank vor der Tür.", dauer: "10–20 Min." },
  { s: 2, name: "Im Forst", text: "Eine deiner Runden im Spandauer Forst.", dauer: "bis 1 Std." },
  { s: 3, name: "Kleine Erledigung", text: "Mit Auto oder Bus zum Bäcker, zur Apotheke, auf den Markt.", dauer: "1–2 Std." },
  { s: 4, name: "Café, Park, See", text: "Ein Ort in der Nähe, allein, zu zweit oder mit Freunden.", dauer: "2–3 Std." },
  { s: 5, name: "In die Stadt", text: "Ausflug in die Stadt oder zu Freunden – mit bekanntem Ankerpunkt.", dauer: "halber Tag" },
  { s: 6, name: "Neuer Ort", text: "Etwas Neues, gern zu zweit: Museum, Garten, Konzert am Nachmittag.", dauer: "halber bis ganzer Tag" },
  { s: 7, name: "Großer Ausflug", text: "Ein ganzer Tag oder eine Übernachtung.", dauer: "Tag und mehr" }
];

/* Checkliste „Unterwegs“ – ihre eigene Liste, änderbar */
D.checkliste = [
  { id: "wechsel", text: "Wechselset dabei (Beutel, Tücher, Abwurfbeutel)" },
  { id: "leeren", text: "Beutel vor dem Losgehen geleert" },
  { id: "wc", text: "Toilette am Ziel und unterwegs überlegt" },
  { id: "euro", text: "Euroschlüssel eingesteckt (falls vorhanden)" },
  { id: "wasser", text: "Wasser und etwas zu essen" },
  { id: "pause", text: "Pausenplatz überlegt (Bank, Café)" },
  { id: "bescheid", text: "Jemandem Bescheid gesagt" },
  { id: "rueckweg", text: "Rückweg geklärt (Taxi, Bus, Abholung)" },
  { id: "handy", text: "Handy geladen" },
  { id: "desinf", text: "Kleines Handdesinfektionsmittel" }
];

D.wennDann = [
  "Wenn es mir unterwegs zu viel wird, dann setze ich mich auf die nächste Bank und entscheide in Ruhe.",
  "Wenn ich eine Toilette brauche, dann gehe ich ins nächste Café und frage freundlich.",
  "Wenn ich losfahren will und zögere, dann packe ich zuerst nur die Tasche – der Rest kommt von allein.",
  "Wenn ich zurück bin, dann trage ich den Ausflug ein und schreibe einen Satz dazu.",
  "Wenn das Wetter umschlägt, dann nehme ich mir ein Taxi zurück und ärgere mich nicht."
];

/* ---------- Horizont-Silhouetten (Ausflüge) ---------- */
D.formen = [
  { id: "binger", name: "Die Binger (Altbau)" },
  { id: "zitadelle", name: "Zitadelle" },
  { id: "kirche", name: "Kirchturm" },
  { id: "wasserturm", name: "Wasserturm" },
  { id: "funkturm", name: "Funkturm" },
  { id: "schiff", name: "Dampfer" },
  { id: "muehle", name: "Windmühle" },
  { id: "bruecke", name: "Brücke" },
  { id: "schloss", name: "Schloss" },
  { id: "huegel", name: "Hügel" },
  { id: "kiefersee", name: "Kiefer am See" },
  { id: "leuchtturm", name: "Leuchtturm" },
  { id: "schwedenhaus", name: "Rotes Holzhaus" }
];

/* Andenken im Setzkasten (Form des kleinen Gegenstands) */
D.andenken = ["fahrkarte", "eichel", "muschel", "blatt", "postkarte", "tasse", "stein", "feder", "schluessel"];

/* ---------- Maßstab: Gesamtkilometer, eingeordnet ---------- */
D.massstab = [
  { km: 6, ziel: "in die Spandauer Altstadt" },
  { km: 18, ziel: "in die Binger" },
  { km: 25, ziel: "bis Potsdam" },
  { km: 60, ziel: "bis Brandenburg an der Havel" },
  { km: 120, ziel: "bis an die Müritz" },
  { km: 230, ziel: "bis an die Ostsee nach Warnemünde" },
  { km: 290, ziel: "bis Hamburg" },
  { km: 350, ziel: "bis Prag" },
  { km: 500, ziel: "bis Kopenhagen" },
  { km: 880, ziel: "bis Paris" },
  { km: 1200, ziel: "bis Rom" }
];

/* ---------- Kramladen (Taler) ---------- */
D.laden = [
  { id: "patience", gruppe: "Spiel", name: "Waldpatience", preis: 60, text: "Eine ruhige Patience mit Karten aus dem Forst. Jede Runde hat ein Ende.", icon: "karten" },
  { id: "rueckenmotiv", gruppe: "Spiel", name: "Kartenrücken „Kiefernzapfen“", preis: 30, text: "Ein anderer Rücken für die Karten.", icon: "karten" },

  { id: "rotkehlchen", gruppe: "Wald & Garten", name: "Rotkehlchen", preis: 50, text: "Kommt morgens und sitzt auf dem Zaun oder der Bank.", icon: "vogel" },
  { id: "traenke", gruppe: "Wald & Garten", name: "Vogeltränke", preis: 40, text: "Eine flache Schale aus Stein am Rand der Wiese.", icon: "schale" },
  { id: "igelhaus", gruppe: "Wald & Garten", name: "Igelhaus", preis: 60, text: "Ein kleines Haus aus Laub und Holz unter der Hecke.", icon: "igel" },
  { id: "rosenbogen", gruppe: "Wald & Garten", name: "Rosenbogen", preis: 120, text: "Ein Bogen mit Kletterrosen über dem Weg.", icon: "blume" },
  { id: "haengematte", gruppe: "Wald & Garten", name: "Hängematte", preis: 150, text: "Zwischen zwei Kiefern, für lange Nachmittage.", icon: "decke" },
  { id: "sternbilder", gruppe: "Wald & Garten", name: "Sternbilder", preis: 250, text: "Nachts erscheinen Großer Wagen, Kassiopeia und Orion am Himmel.", icon: "stern" },

  { id: "klangschale", gruppe: "Klänge", name: "Timer-Gong: Klangschale", preis: 40, text: "Ein weicher Klang, wenn der Ruhe-Timer endet.", icon: "glocke" },
  { id: "spieluhr", gruppe: "Klänge", name: "Timer-Gong: Spieluhr", preis: 40, text: "Drei helle Töne zum Ende des Timers.", icon: "glocke" },
  { id: "regen", gruppe: "Klänge", name: "Klangteppich „Regen am Fenster“", preis: 80, text: "Leises Rauschen, während der Ruhe-Timer läuft.", icon: "regen" },
  { id: "waldmorgen", gruppe: "Klänge", name: "Klangteppich „Waldmorgen“", preis: 80, text: "Wind in den Kiefern und ab und zu ein Vogel.", icon: "blatt" },
  { id: "takt", gruppe: "Klänge", name: "Tanz-Taktgeber", preis: 120, text: "Für die Tanzstunden: Walzer, Langsamer Walzer, Foxtrott, Cha-Cha – Tempo einstellbar.", icon: "note" },

  { id: "gedichte1", gruppe: "Zum Lesen", name: "Gedichte: Jahreszeiten", preis: 40, text: "Kurze Gedichte von Mörike, Eichendorff, Rilke und anderen.", icon: "feder" },
  { id: "gedichte2", gruppe: "Zum Lesen", name: "Gedichte: Unterwegs", preis: 40, text: "Gedichte übers Wandern, Reisen und Ankommen.", icon: "feder" },
  { id: "rezepte1", gruppe: "Zum Lesen", name: "Rezeptheft „Einfach & warm“", preis: 50, text: "Fünf einfache Gerichte für einen Topf und wenig Aufwand.", icon: "topf" },
  { id: "rezepte2", gruppe: "Zum Lesen", name: "Rezeptheft „Kuchen für Besuch“", preis: 50, text: "Fünf Kuchen, die gelingen und Besuch anlocken.", icon: "kuchen" },
  { id: "briefe", gruppe: "Zum Lesen", name: "Briefanfänge an Herzensmenschen", preis: 60, text: "Erste Sätze für Karten und Briefe – den Rest schreibst du.", icon: "brief" },
  { id: "fragen", gruppe: "Zum Lesen", name: "Fragekarten fürs Telefonat", preis: 50, text: "„Erzähl mal …“ – Fragen, die ein Gespräch öffnen.", icon: "telefon" },
  { id: "tanzkarten", gruppe: "Zum Lesen", name: "Tanzschritt-Karten zum Unterrichten", preis: 80, text: "Grundschritte erklärt, so wie man sie einem Anfänger zeigt.", icon: "fuss" },
  { id: "orte2", gruppe: "Ausflüge", name: "Ausflugspaket „Weiter weg“", preis: 100, text: "Zusätzliche Ziele für halbe und ganze Tage, mit Toiletten- und Pausenangaben.", icon: "karte" }
];

/* ---------- Hühnchen: wo es steht (je Bildort) ---------- */
D.huehnchenOrt = {
  weg: "Hühnchen steht heute am Weg.",
  fenster: "Hühnchen steht heute vor dem Haus.",
  tanz: "Hühnchen steht heute am Rand des Tanzbodens.",
  eiche: "Hühnchen sitzt heute unter der Leseeiche.",
  quelle: "Hühnchen sitzt heute an der Quelle.",
  wiese: "Hühnchen steht heute in der Wiese.",
  horizont: "Hühnchen schaut heute zum Horizont.",
  mut: "Hühnchen steht heute bei den Glühwürmchen.",
  bank: "Hühnchen sitzt heute auf der Bank."
};

/* ---------- Ruhe-Timer: Vorlagen ---------- */
D.timerVorlagen = [
  { id: "lesen", name: "Lesen", min: 10 },
  { id: "hoerbuch", name: "Hörbuch hören", min: 20 },
  { id: "ruhe", name: "Ausruhen", min: 20 },
  { id: "handarbeit", name: "Handarbeit", min: 20 },
  { id: "tanzplanen", name: "Tanzstunde vorbereiten", min: 15 },
  { id: "brief", name: "Brief schreiben", min: 15 },
  { id: "raetsel", name: "Rätsel", min: 15 },
  { id: "dehnen", name: "Dehnen", min: 10 }
];

/* ---------- Hilfe & Über ---------- */
D.ueber = [
  "Ritas App ist eine Begleiterin für alle Tage – kein Medizinprodukt. Die App gibt keine medizinischen Ratschläge und ersetzt weder Arzt noch Stomatherapie, Physiotherapie oder psychoonkologische Beratung.",
  "Was du dir an Bewegung zutraust, besprichst du am besten mit deinem Behandlungsteam.",
  "Bei Fieber, plötzlichen oder neuen Schmerzen, Atemnot oder Problemen mit dem Stoma: Praxis anrufen. Nachts und am Wochenende: 116 117. Im Notfall: 112.",
  "Wenn Sorgen sehr belasten: Psychoonkologische Beratung gibt es kostenlos, zum Beispiel beim Krebsinformationsdienst (0800 420 30 40, täglich 8–20 Uhr) oder bei der Berliner Krebsgesellschaft.",
  "Alle Einträge bleiben auf diesem Handy. Nichts wird verschickt."
];
