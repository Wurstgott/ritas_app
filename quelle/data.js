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
  mut:      { name: "Draußen & Neues", gewicht: 1.0, k: "k-mut" },
  geist:    { name: "Lesen, Musik, Kultur", gewicht: 0.8, k: "k-geist" },
  schaffen: { name: "Selbst gemacht", gewicht: 0.8, k: "k-schaffen" },
  sorge:    { name: "Gut für mich", gewicht: 0.6, k: "k-ruhe", maxMin: 90 }
};

/* Bildorte: wo eine Tätigkeit in der Lichtung sichtbar wird */
D.orte = {
  weg:      { name: "Der Weg", text: "Jeder Weg, den du gehst, macht den Weg im Bild länger: erst Steine am Rand, später Wegweiser.", k: "k-bewegung" },
  fenster:  { name: "Die Häuser", text: "Jeder Herzensmensch hat hier ein helles Fenster. Wenn ihr Zeit miteinander verbringt, blühen vor dem Haus Blumen in den Kästen.", k: "k-menschen" },
  tanz:     { name: "Der Tanzboden", text: "Jede Tanzstunde legt Fußspuren auf den Boden, Musik hängt eine Laterne an die Schnur.", k: "k-tanz" },
  eiche:    { name: "Die Leseeiche", text: "Lesen und Hören lassen die Krone dichter werden. Jedes ausgelesene Buch hängt als Band am Ast.", k: "k-geist" },
  quelle:   { name: "Die Quelle", text: "Alles, was du für dich tust – ausruhen, Wärmflasche, in Ruhe machen –, lässt hier Wasser fließen: erst eine Quelle, dann ein Bach, später ein kleiner Teich.", k: "k-ruhe" },
  wiese:    { name: "Die Wiese", text: "Kochen, Basteln, Pflanzen, Aufräumen: Dafür blühen hier Blumen, je nach Jahreszeit.", k: "k-schaffen" },
  horizont: { name: "Der Horizont", text: "Für jeden Ausflug erscheint in der Ferne der Umriss des Ortes, etwa ein Kirchturm. Dazu kommt ein Andenken in den Setzkasten.", k: "k-draussen" },
  mut:      { name: "Glühwürmchen", text: "Hast du etwas Neues oder Ungewohntes gemacht, leuchtet danach ein Glühwürmchen mehr im Wald.", k: "k-mut" }
};

/* ---------- Tagesform (filtert Vorschläge, bewertet nichts) ---------- */
D.tagesformen = [
  { id: "A", name: "Voller Schwung", text: "Ich hab was vor", icon: "sonne" },
  { id: "B", name: "Halbe Kraft", text: "Was Kleines geht, nicht zu weit", icon: "tasse" },
  { id: "C", name: "Gemütlich", text: "Heute eher drinnen und in Ruhe", icon: "lampe" },
  { id: "D", name: "Sparflamme", text: "Nur das Nötigste, und das reicht", icon: "flamme" }
];

/* ---------- Tätigkeiten ----------
   art: km | min | klein | fest | person | buch
   feld: Hauptfeld, neben: Nebenfeld (50 % der Minuten)
   draussen: findet immer draußen statt (zählt automatisch mit Frischluft-Bonus)
   draussenOpt: kann drinnen oder draußen sein → Eintrag-Blatt fragt „Draußen gemacht“
   mutOpt: kann neu oder ungewohnt sein → Eintrag-Blatt fragt „Hat Mut gebraucht“ (Glühwürmchen)
   bild: Bildort; tf: an welchen Tagen vorgeschlagen; info: sachlicher Satz nach dem Eintragen */
D.taetigkeiten = [
  // Bewegung
  { id: "gehen", mutOpt: true, name: "Gehen", kurz: "Gehen", art: "km", std: 2, feld: "bewegung", bild: "weg", draussen: true, tf: "ABC", icon: "schuh",
    info: ["Gehen zählt – ob zum Briefkasten oder die große Runde im Forst.", "Lieber zweimal kurz als einmal zu lang – beides zählt.", "Gehen trainiert ganz nebenbei das Gleichgewicht."] },
  { id: "gymnastik", draussenOpt: true, mutOpt: true, name: "Gymnastik oder Seniorensport", kurz: "Gymnastik", art: "min", std: 30, feld: "bewegung", bild: "weg", tf: "AB", icon: "arme",
    info: ["Kraft und Beweglichkeit machen vieles leichter: Treppe, Einkauf, Tanzstunde."] },
  { id: "gleichgewicht", draussenOpt: true, name: "Gleichgewichtsübung (wie von der Physio)", kurz: "Gleichgewicht", art: "min", std: 10, feld: "bewegung", bild: "weg", tf: "ABC", icon: "waage",
    info: ["Sicher auf den Beinen – das merkt man bei jedem Schritt."] },
  { id: "ruecken", name: "Meine Rückenübungen", kurz: "Rücken", art: "min", std: 15, feld: "bewegung", bild: "weg", tf: "ABC", icon: "ruecken",
    info: ["Deine Übungen aus der Physiotherapie – genau so, wie sie für dich gedacht sind."] },
  { id: "dehnen", draussenOpt: true, name: "Dehnen oder Atmen im Sitzen", kurz: "Dehnen", art: "min", std: 10, feld: "bewegung", bild: "weg", tf: "BCD", icon: "atem",
    info: ["Ruhiges Atmen und Dehnen im Sitzen ist Bewegung, die an jedem Tag geht."] },
  { id: "hofladen", draussenOpt: true, name: "Zum Hofladen gefahren", kurz: "Hofladen", art: "klein", feld: "sorge", neben: "bewegung", bild: "weg", tf: "AB", icon: "tasche",
    info: ["Hofladen! Was Feines mitgebracht? Psst – nur nichts verraten.", "Frisch vom Hof. Hühnchen fragt besser nicht nach.", "Eingekauft, wo’s schmeckt. Ein guter Tag."] },
  { id: "alltag", name: "Alltagsbewegung (Treppe, kleiner Einkauf mit Trolley)", kurz: "Alltag", art: "min", std: 20, feld: "bewegung", bild: "weg", tf: "AB", icon: "tasche",
    info: ["Alltagsbewegung zählt genauso wie ein Spaziergang."] },
  { id: "sitztanz", name: "Im Sitzen zur Musik bewegt", kurz: "Sitztanz", art: "min", std: 15, feld: "bewegung", neben: "geist", bild: "tanz", tf: "BCD", icon: "note",
    info: ["Musik und Bewegung im Sitzen – Rhythmus tut dem Kopf und dem Körper gut."] },
  // Tanz & Menschen
  { id: "tanzstunde", mutOpt: true, name: "Tanzstunde gegeben", kurz: "Tanzstunde", art: "min", std: 60, feld: "menschen", neben: "bewegung", bild: "tanz", tf: "AB", icon: "fuss",
    info: ["Tanzstunde gegeben – heute hat jemand von dir gelernt.", "Dein Tanzschüler weiß hoffentlich, was für eine Lehrerin er hat."] },
  { id: "tanzplanen", name: "Schritte und Musik für die Stunde ausgedacht", kurz: "Stunde planen", art: "min", std: 20, feld: "geist", bild: "tanz", tf: "BC", icon: "note",
    info: ["Gut vorbereitet geht die Stunde leichter von der Hand."] },
  { id: "besuch", draussenOpt: true, mutOpt: true, muehOpt: true, name: "Besuch (bekommen oder gemacht)", kurz: "Besuch", art: "person", std: 60, feld: "menschen", bild: "fenster", tf: "AB", icon: "tassen",
    info: ["Zusammen gewesen – am Küchentisch, unterwegs oder in der Binger."] },
  { id: "telefon", muehOpt: true, name: "Telefonieren", kurz: "Telefonieren", art: "person", std: 20, feld: "menschen", bild: "fenster", tf: "ABCD", icon: "telefon",
    info: ["Telefoniert. Und bestimmt an alles gedacht, was du fragen wolltest."] },
  { id: "nachbar", name: "Gespräch im Haus", kurz: "Im Haus", art: "person", std: 15, feld: "menschen", bild: "fenster", tf: "ABC", icon: "haus",
    info: ["Ein Schwatz im Haus – so bleibt man auf dem Laufenden."] },
  { id: "brief", muehOpt: true, name: "Brief, Karte oder lange Nachricht", kurz: "Geschrieben", art: "person", std: 20, feld: "menschen", bild: "fenster", tf: "BC", icon: "brief",
    info: ["Geschrieben und eingetragen."] },
  { id: "gemeinschaft", mutOpt: true, muehOpt: true, name: "Mit dabei gewesen (Kaffeerunde, Fest, Kurs)", kurz: "Dabei gewesen", art: "min", std: 60, feld: "menschen", bild: "fenster", tf: "AB", icon: "tassen",
    info: ["Gemeinsam etwas erleben, ohne viel planen zu müssen."] },
  { id: "geholfen", name: "Jemandem geholfen", kurz: "Geholfen", art: "person", std: 30, feld: "menschen", bild: "fenster", tf: "ABC", icon: "hand",
    info: ["Geholfen. Wer sonst hätte daran gedacht?"] },
  { id: "hilfe", name: "Hilfe angenommen", kurz: "Hilfe angenommen", art: "fest", w: 15, feld: "sorge", bild: "quelle", tf: "BCD", icon: "hand",
    info: ["Zu zweit geht’s schneller. Und der andere freut sich, dass er randurfte."] },
  // Lesen & Genuss
  { id: "lesen", draussenOpt: true, name: "Gelesen", kurz: "Gelesen", art: "min", std: 20, feld: "geist", bild: "eiche", tf: "ABC", icon: "buch",
    info: ["Gelesen. Lesezeichen rein, morgen geht’s spannend weiter.", "Seite gemerkt?"] },
  { id: "hoerbuch", draussenOpt: true, name: "Hörbuch oder Hörspiel", kurz: "Hörbuch", art: "min", std: 30, feld: "geist", bild: "eiche", tf: "BCD", icon: "kopfhoerer",
    info: ["Hören geht auch mit geschlossenen Augen – und zählt wie Lesen."] },
  { id: "buchfertig", name: "Ein Buch ausgelesen", kurz: "Buch fertig", art: "buch", feld: "geist", bild: "eiche", tf: "ABC", icon: "lesezeichen", w: 20,
    info: ["Ein ganzes Buch! An der Leseeiche hängt jetzt ein Band mit seinem Titel."] },
  { id: "tagebuch", name: "Tagebuch geschrieben", kurz: "Tagebuch", art: "min", std: 15, feld: "geist", bild: "eiche", tf: "ABCD", icon: "feder",
    info: ["Aufgeschrieben ist aufgehoben.", "Ein paar Zeilen am Tag sortieren die Gedanken."] },
  { id: "raetsel", draussenOpt: true, name: "Rätsel auf Papier", kurz: "Rätsel", art: "min", std: 20, feld: "geist", bild: "eiche", tf: "BC", icon: "raetsel",
    info: ["Knobeln hält den Kopf beweglich."] },
  { id: "radio", draussenOpt: true, name: "Radio, Podcast oder Doku gehört", kurz: "Gehört", art: "min", std: 30, feld: "geist", bild: "eiche", tf: "BCD", icon: "radio",
    info: ["Gut zugehört. Das kannst du ja sowieso."] },
  { id: "gelernt", name: "Etwas Neues gelernt", kurz: "Gelernt", art: "min", std: 15, feld: "mut", bild: "mut", tf: "ABC", icon: "funke",
    info: ["Wieder was gelernt. Gesprächsstoff für die nächste Kaffeerunde."] },
  { id: "erinnern", name: "Erinnerungen aufgeschrieben oder erzählt", kurz: "Erinnert", art: "min", std: 20, feld: "geist", neben: "menschen", bild: "eiche", tf: "BC", icon: "feder",
    info: ["Erinnerungen erzählen ist wie Fotos anschauen, nur wärmer."] },
  { id: "musik", draussenOpt: true, name: "Musik gehört, die mir guttut", kurz: "Musik", art: "min", std: 20, feld: "geist", bild: "tanz", tf: "ABCD", icon: "note",
    info: ["Musik eingetragen – Hühnchen summt schon falsch mit."] },
  { id: "singen", name: "Gesungen oder mitgesummt", kurz: "Gesungen", art: "klein", feld: "geist", bild: "tanz", tf: "ABC", icon: "note",
    info: ["Mitgesungen! Schief oder schön – zählt beides."] },
  { id: "kultur", mutOpt: true, name: "Konzert, Theater oder Kino", kurz: "Kultur", art: "min", std: 120, feld: "geist", neben: "mut", bild: "tanz", tf: "A", icon: "maske",
    info: ["Raus und was erlebt. Erzähl!"] },
  { id: "goennen", name: "Mir etwas gegönnt", kurz: "Gegönnt", art: "klein", feld: "geist", bild: "wiese", tf: "ABC", icon: "kuchen",
    info: ["Gegönnt. Steht völlig zu Recht auf der Liste."] },
  { id: "licht", name: "Licht, Himmel oder Abendrot angeschaut", kurz: "Angeschaut", art: "klein", feld: "geist", bild: "wiese", draussen: true, tf: "ABCD", icon: "sonne",
    info: ["Gut hingeguckt. Der Himmel hat sowieso das beste Programm."] },
  { id: "natur", name: "Etwas in der Natur entdeckt", kurz: "Entdeckt", art: "klein", feld: "geist", bild: "wiese", draussen: true, tf: "ABC", icon: "blatt",
    info: ["Wer genau hinschaut, findet im Forst jeden Tag etwas Neues."] },
  // Hände & Haus
  { id: "kochen", mutOpt: true, muehOpt: true, name: "Mir etwas Gutes gekocht", kurz: "Gekocht", art: "min", std: 30, feld: "schaffen", bild: "wiese", tf: "BC", icon: "topf",
    info: ["Selbst gekocht. Hühnchen hat am Duft mitgegessen."] },
  { id: "handarbeit", mutOpt: true, name: "Gemalt, gebastelt oder Handarbeit", kurz: "Kreativ", art: "min", std: 30, feld: "schaffen", bild: "wiese", tf: "BC", icon: "pinsel",
    info: ["Selbst gemacht – und kein anderer hat so eins."] },
  { id: "pflanzen", name: "Pflanzen versorgt (Balkon, Zimmer)", kurz: "Pflanzen", art: "klein", feld: "schaffen", bild: "wiese", tf: "ABC", icon: "blume",
    info: ["Gegossen. Im Bild sieht der Balkon das auch."] },
  { id: "ordnung", muehOpt: true, name: "Eine kleine Ecke aufgeräumt", kurz: "Aufgeräumt", art: "min", std: 15, feld: "schaffen", bild: "wiese", tf: "BC", icon: "kiste",
    info: ["Eine Schublade, ein Fach – kleine Ordnung, sichtbarer Unterschied."] },
  { id: "papier", muehOpt: true, name: "Papierkram erledigt", kurz: "Papierkram", art: "klein", feld: "schaffen", bild: "wiese", tf: "BC", icon: "brief",
    info: ["Erledigt. Eine Sache weniger im Kopf."] },
  { id: "foto", name: "Ein schönes Foto gemacht", kurz: "Foto", art: "klein", feld: "schaffen", bild: "wiese", tf: "ABC", icon: "kamera",
    info: ["Ein Foto hält einen Moment fest, den man sonst vergessen hätte."] },
  { id: "zimmer", name: "Es mir in meinem Zimmer schön gemacht", kurz: "Gemütlich", art: "min", std: 30, feld: "sorge", bild: "quelle", tf: "BCD", icon: "lampe",
    info: ["Schön gemacht. Jetzt sieht’s noch mehr nach dir aus."] },
  // Für mich sorgen
  { id: "ruhe", name: "Bewusst ausgeruht (Couch, Bett, Sessel)", kurz: "Ausgeruht", art: "min", std: 30, feld: "sorge", bild: "quelle", tf: "BCD", icon: "bett",
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
  { id: "ausgesprochen", muehOpt: true, name: "Etwas Belastendes ausgesprochen", kurz: "Ausgesprochen", art: "min", std: 30, feld: "menschen", neben: "sorge", bild: "quelle", tf: "BCD", icon: "sprechen",
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
  { name: "Draußen & Neues", ids: ["hofladen", "draussensitzen", "natur", "licht", "eroller", "erstesmal", "gelernt"] },
  { name: "Hände & Haus", ids: ["kochen", "handarbeit", "pflanzen", "ordnung", "papier", "foto", "zimmer"] },
  { name: "Gut für mich", ids: ["ruhe", "arzt", "durchgehalten", "waerme", "versorgung", "getrunken", "hilfe", "goennen"] },
  { name: "Sonst", ids: ["frei"] }
];

/* ---------- Herzensmenschen (Voreinstellung) ----------
   Jede Person hat ihr eigenes Fenster im Haus. Kein Zählen, kein „lange nicht gemeldet“. */
D.menschenStart = [
  { id: "max", name: "Max", rolle: "Patensohn", farbe: "#C98A1B" },
  { id: "christiane", name: "Christiane", rolle: "beste Freundin", farbe: "#B5532F" },
  { id: "daniel", name: "Daniel und Familie", rolle: "Sohn, in Schweden", farbe: "#3F6E8C" },
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
  { s: 5, name: "In die Stadt", text: "Ausflug in die Stadt oder zu Freunden – zu einem Ort, den du schon kennst.", dauer: "halber Tag" },
  { s: 6, name: "Neuer Ort", text: "Etwas Neues, gern zu zweit: Museum, Garten, Konzert am Nachmittag.", dauer: "halber bis ganzer Tag" },
  { s: 7, name: "Großer Ausflug", text: "Ein ganzer Tag oder eine Übernachtung.", dauer: "Tag und mehr" }
];

/* Checkliste „Unterwegs“ – ihre eigene Liste, änderbar */
D.checkliste = [
  { id: "wechsel", text: "Wechselsachen eingepackt" },
  { id: "leeren", text: "Vor dem Losgehen noch mal ins Bad" },
  { id: "wasser", text: "Wasser und etwas zu essen" },
  { id: "pause", text: "Pausenplatz überlegt (Bank, Café)" },
  { id: "bescheid", text: "Jemandem Bescheid gesagt" },
  { id: "rueckweg", text: "Rückweg geklärt (Taxi, Bus, Abholung)" },
  { id: "handy", text: "Handy geladen" },
  { id: "maske", text: "FFP2-Maske eingesteckt (und eine Ersatzmaske)" },
  { id: "desinf", text: "Kleines Handdesinfektionsmittel" }
];

D.wennDann = [
  "Wenn es mir unterwegs zu viel wird, dann setze ich mich auf die nächste Bank und entscheide in Ruhe.",
  "Wenn ich eine Pause brauche, dann gehe ich ins nächste Café und bestelle mir etwas Warmes.",
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
  { id: "patience", gruppe: "Spiel", name: "Waldpatience", preis: 60, text: "Das bekannte Kartenspiel für eine Person: alle Karten nach Farben von Ass bis König ablegen. Jeder Zug lässt sich zurücknehmen, und wenn die zehn Minuten um sind, legst du in Ruhe fertig.", icon: "karten" },
  { id: "rueckenmotiv", gruppe: "Spiel", name: "Kartenrücken „Kiefernzapfen“", preis: 30, text: "Kiefernzapfen auf Tannengrün, auf der Rückseite der Patience-Karten. Die sammelt Hühnchen sonst im Forst.", icon: "karten" },
  { id: "rueckendala", gruppe: "Spiel", name: "Kartenrücken „Dalapferd“", preis: 30, text: "Rote Dalapferdchen auf Blau, wie aus der Werkstatt bei Mora. Hühnchen zählt beim Spielen die Pferde mit.", icon: "karten" },

  { id: "rotkehlchen", gruppe: "Wald & Garten", name: "Rotkehlchen", preis: 50, text: "Kommt morgens, setzt sich auf den Zaun und guckt, ob du schon wach bist.", icon: "vogel" },
  { id: "traenke", gruppe: "Wald & Garten", name: "Vogeltränke", preis: 40, text: "Eine flache Steinschale am Wiesenrand. Die Spatzen baden darin, die Amsel trinkt nur. Sie hat Stil.", icon: "schale" },
  { id: "igelhaus", gruppe: "Wald & Garten", name: "Igelhaus", preis: 60, text: "Ein Igelhaus aus Laub und Reisig unter der Hecke. Der Mieter zahlt in Schmatzgeräuschen.", icon: "igel" },
  { id: "rosenbogen", gruppe: "Wald & Garten", name: "Rosenbogen", preis: 120, text: "Kletterrosen über dem Weg. Im Juni blühen sie, den Rest des Jahres tun sie wichtig.", icon: "blume" },
  { id: "haengematte", gruppe: "Wald & Garten", name: "Hängematte", preis: 150, text: "Zwischen zwei Kiefern. Hühnchen hat sie schon getestet und ist nicht wieder rausgekommen.", icon: "decke" },
  { id: "sternbilder", gruppe: "Wald & Garten", name: "Sternbilder", preis: 250, text: "Sobald es dunkel ist, stehen Großer Wagen, Kassiopeia und Orion über dem Haus. In Schweden heißt der Wagen übrigens Karlavagnen.", icon: "stern" },

  { id: "klangschale", gruppe: "Klänge", name: "Gong für den Timer: Klangschale", preis: 40, text: "Ein weicher, langer Ton, wenn die Zeit um ist. Kein Wecker-Schreck.", icon: "glocke" },
  { id: "spieluhr", gruppe: "Klänge", name: "Gong für den Timer: Spieluhr", preis: 40, text: "Drei helle Töne wie aus einer alten Spieldose, wenn die Zeit um ist.", icon: "glocke" },
  { id: "regen", gruppe: "Klänge", name: "Hintergrundklang „Regen am Fenster“", preis: 80, text: "Leises Regenrauschen, solange der Timer läuft.", icon: "regen" },
  { id: "waldmorgen", gruppe: "Klänge", name: "Hintergrundklang „Waldmorgen“", preis: 80, text: "Wind in den Kiefern und ab und zu ein Vogel – leise, solange der Timer läuft.", icon: "blatt" },
  { id: "takt", gruppe: "Klänge", name: "Tanz-Taktgeber", preis: 60, text: "Klickt den Takt für deine Tanzstunde: Langsamer und Wiener Walzer, Foxtrott, Discofox, Cha-Cha-Cha, Rumba. Das Tempo bestimmst du.", icon: "note" },

  { id: "gedichte1", gruppe: "Zum Lesen", name: "Gedichte: Jahreszeiten", preis: 40, text: "Vier kurze Gedichte, eins für jede Jahreszeit: von Mörike, Storm und Morgenstern.", icon: "feder" },
  { id: "gedichte2", gruppe: "Zum Lesen", name: "Gedichte: Unterwegs", preis: 40, text: "Drei Gedichte für unterwegs, zum Mitnehmen im Kopf: Goethe, Ringelnatz, Eichendorff.", icon: "feder" },
  { id: "rezepte1", gruppe: "Zum Lesen", name: "Rezeptheft „Einfach und warm“", preis: 50, text: "Fünf einfache warme Gerichte mit wenig Arbeit und wenig Abwasch.", icon: "topf" },
  { id: "rezepte2", gruppe: "Zum Lesen", name: "Rezeptheft „Kuchen für Besuch“", preis: 50, text: "Fünf Kuchen, die sicher gelingen – für den nächsten Besuch.", icon: "kuchen" },
  { id: "rezepte3", gruppe: "Zum Lesen", name: "Rezeptheft „Schwedisch backen“", preis: 50, text: "Kanelbullar, Kladdkaka, Chokladbollar und Lussekatter für den Dezember. Fika kann kommen.", icon: "kuchen" },
  { id: "briefe", gruppe: "Zum Lesen", name: "Erste Sätze für Briefe", preis: 60, text: "Der erste Satz ist immer der schwerste. Hier sind fünfzehn. Den Rest kannst du sowieso.", icon: "brief" },
  { id: "fragen", gruppe: "Zum Lesen", name: "Fangfragen fürs Telefon", preis: 50, text: "25 Fragen, bei denen am anderen Ende erst gestutzt und dann gelacht wird. Zum Beispiel: „Wenn du einen Tag lang Kommissar wärst – wen würdest du verhören?“", icon: "telefon" },
  { id: "tanzkarten", gruppe: "Zum Lesen", name: "Tanzkarten mit Geschichten", preis: 80, text: "Hambo, Schottis, Bugg und der Froschtanz zu Midsommar, dazu Geschichten zu Walzer, Foxtrott und Cha-Cha-Cha. Mit Musik zum Anhören. Die Schritte kennst du ja.", icon: "fuss" },
  { id: "orte2", gruppe: "Ausflüge", name: "Ausflugspaket „Weiter weg“", preis: 60, text: "Ziele für einen halben oder ganzen Tag, ein Stück weiter raus. Mit allem, was man vorher wissen will.", icon: "karte" }
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
  { id: "handarbeit", name: "Malen & Basteln", min: 20 },
  { id: "tanzplanen", name: "Tanzstunde vorbereiten", min: 15 },
  { id: "brief", name: "Brief schreiben", min: 15 },
  { id: "raetsel", name: "Rätsel", min: 15 },
  { id: "dehnen", name: "Dehnen", min: 10 }
];

/* ---------- Hilfe & Über ---------- */
D.ueber = [
  "Ritas App hat Max für Rita gebaut: eine Liste, ein Bild, das mitwächst, ein paar Ideen – und Hühnchen.",
  "Alle Einträge bleiben auf diesem Handy. Nichts wird verschickt."
];
