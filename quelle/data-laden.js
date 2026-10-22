/* Lichtung – Inhalte für den Kramladen und die Tageshinweise
   Gedichte: nur gemeinfreie Autoren (vor 1956 gestorben). */
D.gedichte = {
  gedichte1: [
    { titel: "Er ist’s", autor: "Eduard Mörike", jahr: "1829", text: "Frühling läßt sein blaues Band\nWieder flattern durch die Lüfte;\nSüße, wohlbekannte Düfte\nStreifen ahnungsvoll das Land.\nVeilchen träumen schon,\nWollen balde kommen.\n– Horch, von fern ein leiser Harfenton!\nFrühling, ja du bist’s!\nDich hab ich vernommen!" },
    { titel: "Juli", autor: "Theodor Storm", jahr: "", text: "Klingt im Wind ein Wiegenlied,\nSonne warm herniedersieht,\nSeine Ähren senkt das Korn,\nRote Beere schwillt am Dorn,\nSchwer von Segen ist die Flur –\nJunge Frau, was sinnst du nur?" },
    { titel: "Septembermorgen", autor: "Eduard Mörike", jahr: "1827", text: "Im Nebel ruhet noch die Welt,\nNoch träumen Wald und Wiesen:\nBald siehst du, wenn der Schleier fällt,\nDen blauen Himmel unverstellt,\nHerbstkräftig die gedämpfte Welt\nIn warmem Golde fließen." },
    { titel: "Die drei Spatzen", autor: "Christian Morgenstern", jahr: "", text: "In einem leeren Haselstrauch\nda sitzen drei Spatzen, Bauch an Bauch.\n\nDer Erich rechts und links der Franz\nund mittendrin der freche Hans.\n\nSie haben die Augen zu, ganz zu,\nund obendrüber, da schneit es, hu!\n\nSie rücken zusammen dicht an dicht.\nSo warm wie der Hans hat’s niemand nicht.\n\nSie hör’n alle drei ihrer Herzlein Gepoch.\nUnd wenn sie nicht weg sind, so sitzen sie noch." }
  ],
  gedichte2: [
    { titel: "Gefunden", autor: "Johann Wolfgang von Goethe", jahr: "1813", text: "Ich ging im Walde\nSo für mich hin,\nUnd nichts zu suchen,\nDas war mein Sinn.\n\nIm Schatten sah ich\nEin Blümchen stehn,\nWie Sterne leuchtend,\nWie Äuglein schön.\n\nIch wollt es brechen,\nDa sagt’ es fein:\nSoll ich zum Welken\nGebrochen sein?\n\nIch grub’s mit allen\nDen Würzlein aus,\nZum Garten trug ich’s\nAm hübschen Haus.\n\nUnd pflanzt es wieder\nAm stillen Ort;\nNun zweigt es immer\nUnd blüht so fort." },
    { titel: "Die Ameisen", autor: "Joachim Ringelnatz", jahr: "", text: "In Hamburg lebten zwei Ameisen,\nDie wollten nach Australien reisen.\nBei Altona auf der Chaussee\nDa taten ihnen die Beine weh,\nUnd da verzichteten sie weise\nDann auf den letzten Teil der Reise." },
    { titel: "Wünschelrute", autor: "Joseph von Eichendorff", jahr: "1835", text: "Schläft ein Lied in allen Dingen,\nDie da träumen fort und fort,\nUnd die Welt hebt an zu singen,\nTriffst du nur das Zauberwort." }
  ]
};

D.rezepte = {
  rezepte1: [
    { titel: "Kartoffelsuppe aus einem Topf", dauer: "etwa 40 Minuten, davon 10 Minuten Arbeit", zutaten: ["500 g mehligkochende Kartoffeln", "1 Möhre", "1 Stück Lauch", "1 Zwiebel", "1 Liter Gemüsebrühe", "1 Becher Schmand oder Sahne", "Majoran, Salz, Pfeffer", "nach Lust: 2 Wiener Würstchen"], schritte: ["Gemüse schälen und klein schneiden.", "Zwiebel in etwas Öl glasig dünsten, das übrige Gemüse dazu.", "Brühe angießen und 20–25 Minuten köcheln, bis alles weich ist.", "Mit dem Kartoffelstampfer grob zerdrücken, Schmand einrühren.", "Mit Majoran abschmecken. Würstchen in Scheiben darin heiß werden lassen."], tipp: "Reicht für zwei Tage und schmeckt aufgewärmt noch besser." },
    { titel: "Milchreis mit warmen Äpfeln", dauer: "etwa 35 Minuten", zutaten: ["125 g Milchreis", "750 ml Milch", "1 EL Zucker", "1 Prise Salz", "2 Äpfel", "1 TL Butter, Zimt"], schritte: ["Milch mit Zucker und Salz aufkochen, Reis einrühren.", "Bei kleinster Hitze mit Deckel 30 Minuten quellen lassen, ab und zu umrühren.", "Äpfel in Spalten schneiden und in Butter weich dünsten, mit Zimt bestreuen.", "Warm zusammen essen."], tipp: "Der Reis passt auf sich selbst auf, wenn die Platte ganz klein gestellt ist." },
    { titel: "Ofengemüse vom Blech", dauer: "etwa 45 Minuten, davon 10 Minuten Arbeit", zutaten: ["Kartoffeln, Möhren, Kürbis oder Pastinaken – was da ist", "1 rote Zwiebel", "3 EL Öl", "Salz, Rosmarin oder Thymian", "1 Becher Kräuterquark"], schritte: ["Ofen auf 200 °C vorheizen.", "Gemüse in mundgerechte Stücke schneiden, mit Öl und Salz mischen.", "Auf dem Blech 35 Minuten backen, bis die Ränder braun sind.", "Mit Kräuterquark essen."], tipp: "Ein Blech, ein Löffel, wenig Abwasch." },
    { titel: "Rührei mit Schnittlauch", dauer: "10 Minuten", zutaten: ["2 Eier", "1 Schuss Milch", "Salz", "1 TL Butter", "Schnittlauch", "1 Scheibe gutes Brot"], schritte: ["Eier mit Milch und Salz verquirlen.", "Butter in der Pfanne schmelzen, Eier hinein.", "Bei mittlerer Hitze rühren, bis das Ei ganz gestockt ist.", "Mit Schnittlauch bestreuen und mit Brot essen."], tipp: "Schnittlauch mit der Schere direkt über die Pfanne. Spart das Brett." },
    { titel: "Linsensuppe mit Würstchen", dauer: "etwa 40 Minuten", zutaten: ["200 g Tellerlinsen", "1 Bund Suppengemüse", "1 Kartoffel", "1 Liter Gemüsebrühe", "2 Wiener Würstchen", "1 Schuss Essig, Salz, Pfeffer"], schritte: ["Gemüse und Kartoffel würfeln.", "Mit Linsen und Brühe aufkochen und 30 Minuten köcheln.", "Würstchen in Scheiben dazugeben und heiß werden lassen.", "Mit einem Schuss Essig abschmecken."], tipp: "Der Schuss Essig am Schluss ist kein Versehen, sondern der Trick." }
  ],
  rezepte2: [
    { titel: "Rührkuchen mit Zitrone", dauer: "etwa 70 Minuten, davon 15 Minuten Arbeit", zutaten: ["250 g weiche Butter", "200 g Zucker", "4 Eier", "300 g Mehl", "1 Päckchen Backpulver", "1 Bio-Zitrone", "100 g Puderzucker"], schritte: ["Ofen auf 175 °C vorheizen, Kastenform fetten.", "Butter und Zucker cremig rühren, Eier einzeln unterrühren.", "Mehl, Backpulver und Zitronenschale unterheben.", "55–60 Minuten backen – Stäbchenprobe.", "Puderzucker mit etwas Zitronensaft verrühren und über den abgekühlten Kuchen gießen."], tipp: "Am zweiten Tag ist er noch saftiger. Wenn er so lange hält." },
    { titel: "Apfelkuchen vom Blech, ganz einfach", dauer: "etwa 60 Minuten", zutaten: ["1 Rolle Blätterteig oder Mürbeteig aus dem Kühlregal", "4 Äpfel", "2 EL Zucker", "Zimt", "2 EL Mandelblättchen", "Puderzucker"], schritte: ["Ofen auf 200 °C vorheizen.", "Teig mit dem Backpapier aufs Blech legen.", "Äpfel in dünne Spalten schneiden und dachziegelartig darauflegen.", "Mit Zucker, Zimt und Mandeln bestreuen.", "25–30 Minuten backen, abgekühlt mit Puderzucker bestäuben."], tipp: "Gelingt immer und sieht nach viel Arbeit aus." },
    { titel: "Marmorkuchen", dauer: "etwa 75 Minuten", zutaten: ["250 g weiche Butter", "220 g Zucker", "4 Eier", "350 g Mehl", "1 Päckchen Backpulver", "125 ml Milch", "2 EL Kakao"], schritte: ["Ofen auf 175 °C vorheizen, Gugelhupfform fetten.", "Butter und Zucker cremig rühren, Eier unterrühren.", "Mehl, Backpulver und Milch unterrühren.", "Ein Drittel des Teigs mit Kakao verrühren.", "Hell und dunkel abwechselnd einfüllen, mit einer Gabel durchziehen.", "Etwa 55 Minuten backen – Stäbchenprobe."], tipp: "Mit der Gabel nur einmal in Spiralen durchziehen. Wer rührt, bekommt Kakaokuchen." },
    { titel: "Schneller Quarkkuchen ohne Boden", dauer: "etwa 70 Minuten", zutaten: ["1 kg Magerquark", "4 Eier", "150 g Zucker", "1 Päckchen Vanillepuddingpulver", "100 ml Öl", "1 Zitrone (Saft und Schale)"], schritte: ["Ofen auf 170 °C vorheizen, Springform fetten.", "Alle Zutaten glatt rühren.", "In die Form gießen und 55–60 Minuten backen, bis er fest ist.", "Im ausgeschalteten Ofen bei offener Tür abkühlen lassen."], tipp: "Er sinkt beim Abkühlen ein bisschen ein. Das gehört so." },
    { titel: "Zitronen-Muffins", dauer: "etwa 40 Minuten", zutaten: ["250 g Mehl", "2 TL Backpulver", "120 g Zucker", "2 Eier", "100 ml Öl", "150 g Joghurt", "1 Bio-Zitrone"], schritte: ["Ofen auf 180 °C vorheizen, Papierförmchen ins Blech.", "Trockene und feuchte Zutaten getrennt verrühren, dann kurz zusammenrühren.", "In die Förmchen füllen und 20–22 Minuten backen."], tipp: "Klein, handlich, gut zum Mitnehmen in die Binger." }
  ],
  rezepte3: [
    { titel: "Kanelbullar (Zimtschnecken)", dauer: "etwa 2 Stunden, davon 30 Minuten Arbeit", zutaten: ["25 g frische Hefe", "250 ml Milch", "75 g Butter", "60 g Zucker", "1 TL gemahlener Kardamom", "1 Prise Salz", "etwa 500 g Mehl", "Für die Füllung: 75 g weiche Butter, 50 g Zucker, 1 EL Zimt", "1 Ei zum Bestreichen, Hagelzucker"], schritte: ["Milch und Butter lauwarm werden lassen, die Hefe darin auflösen.", "Zucker, Kardamom, Salz und nach und nach das Mehl dazu, zu einem weichen Teig kneten. Zugedeckt 45 Minuten gehen lassen.", "Teig zu einem großen Rechteck ausrollen, mit der Füllung bestreichen und von der langen Seite her aufrollen.", "In gut 2 cm dicke Scheiben schneiden, in Papierförmchen setzen und noch einmal 30 Minuten gehen lassen.", "Mit Ei bestreichen, Hagelzucker drüber und bei 225 °C etwa 8–10 Minuten backen."], tipp: "Am 4. Oktober ist in Schweden „Kanelbullens dag“. Gebacken werden darf aber das ganze Jahr." },
    { titel: "Kladdkaka", dauer: "etwa 35 Minuten", zutaten: ["100 g Butter", "2 Eier", "200 g Zucker", "4 EL Kakao", "100 g Mehl", "1 Päckchen Vanillezucker", "1 Prise Salz", "Butter und Semmelbrösel für die Form"], schritte: ["Ofen auf 175 °C vorheizen, eine kleine Springform (22 cm) fetten und mit Bröseln ausstreuen.", "Butter schmelzen und etwas abkühlen lassen.", "Eier und Zucker kurz verrühren, dann Kakao, Mehl, Vanillezucker, Salz und die Butter unterrühren – nicht schaumig schlagen.", "15–20 Minuten backen. Die Mitte soll noch weich sein.", "Abkühlen lassen, mit Puderzucker bestäuben. Dazu Schlagsahne."], tipp: "„Kladdig“ heißt klebrig. Genau so soll sie sein." },
    { titel: "Chokladbollar", dauer: "15 Minuten und etwas Kühlschrank", zutaten: ["100 g weiche Butter", "80 g Zucker", "1 Päckchen Vanillezucker", "2 EL Kakao", "150 g zarte Haferflocken", "2 EL kalter, starker Kaffee", "Kokosraspel zum Wälzen"], schritte: ["Butter, Zucker, Vanillezucker und Kakao gut verkneten.", "Haferflocken und Kaffee dazu, alles zu einer festen Masse kneten.", "Walnussgroße Kugeln rollen und in Kokosraspeln wälzen.", "Eine Stunde in den Kühlschrank stellen."], tipp: "Ganz ohne Ofen. In Schweden gibt’s die zu jeder Fika." },
    { titel: "Lussekatter (Safranschnecken)", dauer: "etwa 2 Stunden, davon 30 Minuten Arbeit", zutaten: ["0,5 g Safran", "250 ml Milch", "100 g Butter", "25 g frische Hefe", "80 g Zucker", "1 Prise Salz", "etwa 500 g Mehl", "Rosinen", "1 Ei zum Bestreichen"], schritte: ["Safran mit einem Teelöffel Zucker im Mörser zerreiben.", "Milch und Butter lauwarm werden lassen, Hefe und Safran darin auflösen.", "Zucker, Salz und Mehl dazu, kneten und zugedeckt 45 Minuten gehen lassen.", "Fingerdicke Rollen formen, zu einem S eindrehen und in jede Schnecke eine Rosine drücken.", "Noch 30 Minuten gehen lassen, mit Ei bestreichen und bei 225 °C etwa 8–10 Minuten backen."], tipp: "Für den Lucia-Morgen am 13. Dezember. Das S soll eine eingerollte Katze sein, die Rosinen sind die Augen." }
  ]
};

D.briefe = [
  { anlass: "Danke", anfang: "Ich wollte dir schon lange einmal sagen, wie gut es mir tut, dass es dich gibt." },
  { anlass: "Danke", anfang: "Neulich habe ich an den Tag gedacht, an dem du einfach vorbeigekommen bist – das vergesse ich dir nicht." },
  { anlass: "Weißt du noch …", anfang: "Weißt du noch, wie wir damals …" },
  { anlass: "Weißt du noch …", anfang: "Heute ist mir beim Aufräumen etwas in die Hände gefallen, das dich zum Lachen bringen wird." },
  { anlass: "Was ich an dir mag", anfang: "Was ich an dir besonders mag: dass du …" },
  { anlass: "Geburtstag", anfang: "Alles Liebe zum Geburtstag! Ich hebe dir ein Stück Kuchen auf – oder bringe gleich einen ganzen mit." },
  { anlass: "Geburtstag", anfang: "Herzlichen Glückwunsch! Ich wünsche dir ein Jahr mit vielen guten Tagen und mindestens einem Ausflug mit mir." },
  { anlass: "Gruß nach Schweden", anfang: "Ihr Lieben in Schweden, hier bei mir im Forst ist es gerade …" },
  { anlass: "Gruß nach Schweden", anfang: "Ich habe an euch gedacht, als ich heute …" },
  { anlass: "Weihnachten", anfang: "Ich freue mich schon auf Weihnachten in der Binger – und darauf, euch alle zu sehen." },
  { anlass: "Weihnachten", anfang: "Fröhliche Weihnachten! Bei mir steht ein kleines Hühnchen am Fenster und schaut nach Schnee." },
  { anlass: "Einfach so", anfang: "Einfach so, weil heute ein guter Tag ist: ein Gruß aus Spandau – Hühnchen grüßt mit." },
  { anlass: "Einfach so", anfang: "Ich habe gerade ein Kapitel gelesen und musste an dich denken, weil …" },
  { anlass: "An Max", anfang: "Lieber Max, die App, die du mir gemacht hast, sagt heute …" },
  { anlass: "Nach einem Besuch", anfang: "Es war so schön bei euch. Ich grinse immer noch." }
];

D.fragekarten = [
  "Erzähl mal: Was war heute das Beste an deinem Tag?",
  "Was hast du zuletzt zum ersten Mal gemacht?",
  "Welches Buch oder welche Serie macht dir gerade Freude?",
  "Wohin würdest du gern einmal reisen?",
  "Was hat dich diese Woche zum Lachen gebracht?",
  "Was kochst du am liebsten, wenn Besuch kommt?",
  "Welches Lied hörst du gerade rauf und runter?",
  "Was ist bei euch draußen gerade los – Wetter, Garten, Tiere?",
  "Worauf freust du dich in den nächsten Wochen?",
  "Welcher Krimi hat dich zuletzt reingelegt?",
  "Welche Erinnerung aus deiner Kindheit fällt dir als Erstes ein?",
  "Was würdest du an einem freien Tag am liebsten machen?",
  "Wer hat dir zuletzt eine Freude gemacht?",
  "Was steht bei euch gerade auf dem Fensterbrett?",
  "Welches Lied kannst du nach zwei Takten mitsingen?",
  "Was hast du neulich gegoogelt, das keiner wissen darf?",
  "Welchen Promi würdest du gern mal zum Kaffee einladen – und welchen bloß nicht?",
  "Welchen Film sollte ich unbedingt sehen?",
  "Was sammelst du – oder was hast du früher gesammelt?",
  "Wenn du einen Tag lang Kommissar wärst: Wen würdest du verhören?",
  "Was gibt es Neues bei euch im Ort?",
  "Wie war der letzte Ausflug, den ihr gemacht habt?",
  "Wer von euch hat zuletzt was verlegt – und wo war’s?",
  "Was ist dein Lieblingsessen in diesem Jahr?",
  "Was soll ich dir das nächste Mal erzählen?"
];

D.tanzkarten = [
  { tanz: "Hambo", takt: "3/4-Takt, aus der Polska-Familie", erzaehl: ["Schwedens Paartanz schlechthin. Der Name kommt von der „Hamburska“, einem Tanz, der im 19. Jahrhundert über Hamburg nach Schweden kam.", "In Delsbo in Hälsingland treffen sich jeden Sommer Paare zum großen Hambo-Wettbewerb. Wer nicht antritt, guckt zu und wippt mit."], musik: ["Hambo Delsbo", "Hambo spelmanslag"], tipp: "Für deinen Tanzschüler vielleicht mal was anderes als Walzer." },
  { tanz: "Schottis", takt: "Gerader Takt, gemütlich hüpfend", erzaehl: ["Der Schottis ist der „Schottische“ – und kommt trotzdem nicht aus Schottland, sondern aus Mitteleuropa. In den Ballsälen um 1850 war er groß in Mode.", "In Schweden hat er sich gehalten: auf dem Land, auf Tanzböden am See und bei jedem zweiten Midsommarfest."], musik: ["Schottis svensk folkmusik", "Schottis spelmanslag"], tipp: "Klingt nach Sommerabend, auch im November." },
  { tanz: "Små grodorna", takt: "Kein Paartanz, sondern ein Lied zum Mithüpfen", erzaehl: ["Zu Midsommar tanzt ganz Schweden um die Mittsommerstange – und bei diesem Lied hüpfen auch gestandene Leute wie die Frösche.", "Små grodorna, små grodorna är lustiga att se.\nEj öron, ej öron, ej svansar hava de.\nKou ack ack ack, kou ack ack ack,\nkou ack ack ack ack kaa.", "Auf Deutsch: Die kleinen Frösche sind lustig anzusehen. Keine Ohren, keine Schwänze haben sie."], musik: ["Små grodorna midsommar"], tipp: "Karin hüpft da bestimmt mit." },
  { tanz: "Bugg", takt: "4/4-Takt, wie Discofox", erzaehl: ["Schwedens beliebtester Tanz für den Samstagabend. Er stammt vom Jitterbug ab und ist mit Jive und Discofox verwandt.", "Getanzt wird zu Dansband-Musik: Schlager mit Saxofon und viel Gefühl. Ganze Tanzpaläste leben davon."], musik: ["Dansband bugg", "Vikingarna"], tipp: "Wenn du Discofox kannst, kannst du Bugg. Fast." },
  { tanz: "Cha-Cha-Cha", takt: "4/4-Takt", erzaehl: ["Anfang der Fünfzigerjahre in Havanna erfunden, vom Geiger Enrique Jorrín. Also ungefähr so alt wie du.", "Der Name soll vom Geräusch der Füße auf dem Parkett kommen: cha-cha-cha."], musik: ["Enrique Jorrín La Engañadora", "Cha cha cha Tanzmusik"], tipp: "Erzählt sich gut, während alle noch die Schuhe wechseln." },
  { tanz: "Wiener Walzer", takt: "3/4-Takt, etwa 58–60 Takte pro Minute", erzaehl: ["Um 1800 galt der Walzer als unanständig: Paare, die sich eng umfassen und schnell drehen – das ging vielen zu weit.", "Heute eröffnet er jedes Jahr am 1. Januar das Neujahrskonzert der Wiener Philharmoniker im Fernsehen."], musik: ["An der schönen blauen Donau", "Kaiserwalzer Strauss"], tipp: "Die Donau hört man am besten laut." },
  { tanz: "Foxtrott", takt: "4/4-Takt", erzaehl: ["Benannt nach Harry Fox, einem Varieté-Künstler, der um 1914 in New York damit auftrat. Ob er ihn wirklich erfunden hat, ist bis heute umstritten.", "Aus dem Foxtrott sind später der Slowfox und der Quickstep geworden."], musik: ["Foxtrott Tanzmusik", "Puttin on the Ritz Fred Astaire"], tipp: "Fred Astaire ist dafür immer ein guter Vorwand." }
];

D.tageshinweise = [
  "Draußen färben sich die Eichen gerade gelb und braun. Ein Blick aus dem Fenster reicht schon.",
  "Hühnchen hat heute nichts vor. Du auch nicht? Auch das ist ein Plan.",
  "Ein Kapitel ist eine gute Einheit für einen Nachmittag.",
  "Lieber zweimal kurz als einmal zu lang. Das gilt für Wege und fürs Lesen.",
  "Im Spandauer Forst ziehen im Oktober oft Kraniche über die Bäume. Man hört sie, bevor man sie sieht.",
  "Wenn heute wenig geht: Die Quelle im Bild wächst auch mit Ruhe.",
  "Ein Anruf dauert manchmal nur fünf Minuten und hält trotzdem den ganzen Tag.",
  "Die Balkonpflanzen freuen sich über einen Blick, auch ohne Gießkanne.",
  "Musik von früher ist wie ein kleiner Ausflug, ohne dass man los muss.",
  "Was wäre heute ein kleiner, schöner Moment? Er darf ganz klein sein.",
  "Eine Postkarte ist schneller geschrieben als gedacht. Drei Sätze reichen.",
  "Im November wird es früh dunkel. Eine Lampe an, ein Hörbuch dazu – gemütlich.",
  "Wer anderen etwas beibringt, lernt selbst am meisten. Grüß deinen Tanzschüler.",
  "Ein Gang zum Briefkasten ist auch ein Weg.",
  "Das Moos im Forst ist im Herbst am grünsten.",
  "Wenn das Handy lockt: Erst ein Lied hören, dann entscheiden.",
  "Die Eiche vor dem Haus wird mit jeder Lesestunde dichter.",
  "Im Winter sieht man im Forst die Vogelnester in den kahlen Bäumen.",
  "Ein schöner Satz aus dem Buch, aufgeschrieben, hält länger.",
  "Manche Tage sind zum Ausruhen da. Heute vielleicht.",
  "Spuren im Schnee verraten, wer nachts im Forst unterwegs war.",
  "Die Tage werden ab Ende Dezember wieder länger, jeden Tag ein kleines Stück.",
  "Ein Ausflug beginnt mit dem Packen der Tasche. Der Rest ergibt sich oft.",
  "In der Binger ist immer ein Stuhl frei.",
  "Im März blühen die ersten Buschwindröschen am Waldboden.",
  "Hühnchen steht heute einfach da. Das kann es gut.",
  "Wenn es draußen regnet, ist drinnen Lesewetter.",
  "Ein Rätsel auf Papier ist auch Bewegung – für den Kopf.",
  "Was hat heute gut geschmeckt? Genuss zählt mit.",
  "Ein bekannter Weg ist eine gute Wahl. Neu muss nicht sein.",
  "Im Mai singen morgens die Amseln am lautesten.",
  "Erinnerungen erzählen ist wie Fotos anschauen, nur wärmer.",
  "Wer umkehrt, weil es reicht, hat eine gute Entscheidung getroffen.",
  "Im Juni riecht der Forst nach Kiefernharz, besonders nach Regen.",
  "Ein Lied summen geht auch im Liegen.",
  "Im September steht morgens oft Nebel über den Wiesen.",
  "Heute ist ein guter Tag, um jemandem Danke zu sagen.",
  "Das Bild wächst mit allem, was dir guttut – nicht mit Fleiß."
];
