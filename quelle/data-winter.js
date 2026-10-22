/* ============================================================
   Ritas App – Herbst & Winter: Tee, Ingwer, Luft, Schutz, Besuch
   Ton: praktisch, freundlich, auf Augenhöhe. Wohltuend, nicht heilend.
   Geprüfte Zahlen (Stand Okt. 2026):
   - Raumtemperatur Wohnraum ~20 °C, Küche ~18 °C, Schlafzimmer ~17 °C;
     Stoßlüften statt Kipp (Umweltbundesamt, „Richtig heizen“)
   - Stoßlüften im Winter 5–10 Min., mehrmals täglich (3–4×), relative
     Luftfeuchte ca. 40–60 %, Räume nicht unter ~16 °C auskühlen (Öko-Test
     mit Verweis auf BMUV/Verbraucherzentrale)
   - CO2: bis ca. 1000 ppm gilt als ausreichender Luftwechsel, Ampeln meist
     grün < 1000, gelb 1000–2000, rot > 2000 ppm (Deutsche Handwerks
     Zeitung mit Verweis auf UBA)
   - FFP2: Dichtsitz – beim Einatmen saugt sie sich an, beim kräftigen
     Ausatmen darf seitlich keine Luft entweichen; durchfeuchtet wechseln
     (Anleitung FH Südwestfalen); 7-Masken-Wechsel, je 7 Tage trocknen
     lassen (FH Münster, zit. Pharmazeutische Zeitung)
   - Kräutertee mit sprudelnd kochendem Wasser, mind. 5 Min. ziehen, nicht
     stundenlang lauwarm stehen lassen (BfR); Thymian zugedeckt ~10 Min.
     (Apotheken Umschau)
   - Süßholz/Lakritz: Glycyrrhizin kann den Blutdruck erhöhen (BfR)
   - Antigen-Schnelltests: Ablaufdatum (Sanduhr) beachten, Lagerung laut
     Packung meist ca. 5–30 °C, nicht in Kälte/Sonne (AZ München)
   ============================================================ */

D.winter = {

  /* ---------- Tees ---------- */
  tees: [
    {
      titel: "Der Klassiker: Ingwer, Zitrone, Honig",
      zutaten: ["3–4 dünne Scheiben frischer Ingwer (oder 1 TL gerieben)", "1 Scheibe Zitrone", "1 TL Honig", "250 ml Wasser"],
      zubereitung: "Ingwer mit sprudelnd kochendem Wasser übergießen, zugedeckt 8–10 Minuten ziehen lassen. Zitrone dazu, Honig erst rein, wenn der Tee trinkwarm ist – dann schmeckt er nach Honig und nicht nach heißem Zucker.",
      warum: "Wärmt von innen und tut dem Hals angenehm gut.",
      saison: "ganzjährig"
    },
    {
      titel: "Thymian mit Deckel",
      zutaten: ["1–2 TL getrockneter Thymian (oder 3 frische Zweige)", "250 ml Wasser", "nach Wunsch etwas Honig"],
      zubereitung: "Sprudelnd kochendes Wasser drüber, Untertasse als Deckel drauf und etwa 10 Minuten ziehen lassen. Den Deckel abnehmen und das Kondenswasser zurück in die Tasse tropfen lassen – da steckt das Duftöl drin.",
      warum: "Würzig-warm, viele empfinden ihn als angenehm für Hals und Bronchien.",
      saison: "winter"
    },
    {
      titel: "Salbei, kurz und kräftig",
      zutaten: ["4–5 frische Salbeiblätter oder 1 TL getrocknet", "250 ml Wasser", "1 TL Honig"],
      zubereitung: "Mit kochendem Wasser aufgießen, zugedeckt 5–10 Minuten ziehen lassen. Je länger, desto herber – nach 5 Minuten einmal probieren und selbst entscheiden.",
      warum: "Herb und aromatisch, angenehm für einen kratzigen Hals.",
      saison: "herbst"
    },
    {
      titel: "Lindenblüte für den Abend",
      zutaten: ["1–2 TL Lindenblüten", "250 ml Wasser", "1 TL Honig"],
      zubereitung: "Kochendes Wasser drüber, zugedeckt 5–10 Minuten ziehen lassen. Schmeckt mild und leicht nach Honig, auch ganz ohne Honig.",
      warum: "Mild und blumig, ein schöner Tee zum Runterkommen.",
      saison: "winter"
    },
    {
      titel: "Holunderblüte – Sommer in der Tasse",
      zutaten: ["1–2 TL getrocknete Holunderblüten", "250 ml Wasser", "1 Scheibe Zitrone"],
      zubereitung: "Mit sprudelnd kochendem Wasser aufgießen, 5–10 Minuten ziehen lassen, Zitrone dazu. Wer mag, mischt halb und halb mit Lindenblüten – das ist die Großmutter-Mischung.",
      warum: "Duftet nach Juni und wärmt im Januar.",
      saison: "winter"
    },
    {
      titel: "Hagebutte, schön rot",
      zutaten: ["1 EL Hagebuttenschalen (zerkleinert)", "300 ml Wasser", "nach Wunsch ein Stück Apfel"],
      zubereitung: "Hagebutte mit kochendem Wasser übergießen und 10 Minuten ziehen lassen. Für mehr Geschmack: 5 Minuten leise mitköcheln lassen. Ein Apfelschnitz macht ihn runder.",
      warum: "Fruchtig-säuerlich, wärmt und sieht dabei gut aus.",
      saison: "herbst"
    },
    {
      titel: "Fenchel-Anis-Kümmel nach Apothekerart",
      zutaten: ["je ½ TL Fenchel, Anis und Kümmel", "250 ml Wasser"],
      zubereitung: "Die Samen kurz im Mörser oder mit dem Boden eines Glases andrücken, damit sie ihr Aroma hergeben. Kochendes Wasser drüber, zugedeckt 10 Minuten ziehen lassen.",
      warum: "Süßlich-würzig, angenehm nach dem Essen und für den Bauch.",
      saison: "ganzjährig"
    },
    {
      titel: "Chai ohne Schwarztee",
      zutaten: ["1 Zimtstange (oder ½ TL Zimt)", "3 Kardamomkapseln, angedrückt", "2 Nelken", "3 Scheiben Ingwer", "1 Prise Pfeffer", "200 ml Wasser", "100 ml Milch oder Haferdrink", "1 TL Honig"],
      zubereitung: "Gewürze mit dem Wasser im Topf 5–8 Minuten leise köcheln lassen, Milch dazu, noch einmal heiß werden lassen, absieben und süßen. Duftet durch die ganze Wohnung – Nachbarn klingeln womöglich.",
      warum: "Würzig und wärmend, auch abends, weil kein Koffein drin ist.",
      saison: "winter"
    },
    {
      titel: "Orangenschale und Zimt",
      zutaten: ["Schale von ½ Bio-Orange (in Streifen)", "1 Zimtstange", "250 ml Wasser", "1 Spritzer Orangensaft"],
      zubereitung: "Orangenschale und Zimt mit kochendem Wasser übergießen, zugedeckt 8–10 Minuten ziehen lassen. Ein Spritzer Saft obendrauf. Tipp: Orangenschalen im Winter auf der Heizung trocknen und in ein Glas füllen.",
      warum: "Riecht nach Weihnachtsmarkt, ganz ohne Gedränge.",
      saison: "winter"
    },
    {
      titel: "Rooibos mit Vanille",
      zutaten: ["1 TL Rooibos", "1 Stück Vanilleschote (oder 1 Prise Vanille)", "250 ml Wasser", "ein Schuss Milch nach Wunsch"],
      zubereitung: "Mit kochendem Wasser aufgießen und 5–8 Minuten ziehen lassen – Rooibos wird nicht bitter, man kann ihn auch vergessen. Die Vanilleschote kann man zwei-, dreimal verwenden.",
      warum: "Mild, leicht süß und ohne Koffein – ein Tee für jede Uhrzeit.",
      saison: "ganzjährig"
    },
    {
      titel: "Glögg-Tee ohne Alkohol – ein Gruß an Karin",
      zutaten: ["250 ml roter Traubensaft oder Johannisbeersaft", "100 ml Hagebutten- oder Früchtetee", "1 Zimtstange", "2 Nelken", "2 Kardamomkapseln", "1 Streifen Orangenschale", "1 EL Rosinen und ein paar Mandelblättchen"],
      zubereitung: "Alles außer Rosinen und Mandeln im Topf langsam heiß werden lassen (nicht kochen), 10 Minuten ziehen lassen, absieben. In Schweden kommen Rosinen und Mandeln mit in die Tasse und werden mit dem Löffel gefischt. Skål!",
      warum: "Würzig, warm und ein bisschen Schweden-Urlaub auf dem Sofa.",
      saison: "winter"
    },
    {
      titel: "Apfel-Zimt aus der Schale",
      zutaten: ["Schale und Kerngehäuse von 1 Apfel (gut gewaschen)", "1 Prise Zimt oder 1 Zimtstange", "300 ml Wasser"],
      zubereitung: "Apfelreste mit Zimt 10 Minuten leise köcheln lassen, absieben. Wer ohnehin Apfelkuchen backt, bekommt den Tee gratis dazu.",
      warum: "Mild-süß, wärmend und aus etwas, das sonst im Müll landet.",
      saison: "herbst"
    },
    {
      titel: "Süßholz-Fenchel für Naschkatzen",
      zutaten: ["½ TL Süßholzwurzel (Apotheke oder Teeladen)", "½ TL Fenchel, angedrückt", "250 ml Wasser"],
      zubereitung: "Mit kochendem Wasser übergießen, 10 Minuten ziehen lassen. Schmeckt von selbst süß, Honig braucht es nicht. Nur ab und zu, nicht literweise: Süßholz kann den Blutdruck steigen lassen – wer da aufpassen muss, lieber nur gelegentlich.",
      warum: "Lakritzig-süß, schmeichelt dem Hals.",
      saison: "winter"
    },
    {
      titel: "Pfefferminz mit einem Hauch Ingwer",
      zutaten: ["1 TL Pfefferminze oder 1 Handvoll frische Blätter", "2 Scheiben Ingwer", "250 ml Wasser"],
      zubereitung: "Mit kochendem Wasser aufgießen, zugedeckt 5–8 Minuten ziehen lassen. Mit Ingwer wird aus dem frischen Tee ein wärmender.",
      warum: "Frisch und klar im Kopf, mit warmem Abgang.",
      saison: "ganzjährig"
    }
  ],

  /* ---------- Ingwer ---------- */
  ingwer: [
    { titel: "Ingwer einfrieren, gefroren reiben", text: "Ganze Knolle (gewaschen, mit Schale) in einer Dose ins Gefrierfach. Bei Bedarf gefroren auf der feinen Reibe reiben – geht leichter als frisch, fasert nicht, und es gibt nie wieder schrumpelige Reste in der Gemüseschale." },
    { titel: "Schälen mit dem Teelöffel", text: "Die Schale mit der Kante eines Teelöffels abkratzen. Geht um jede Ecke herum, und es bleibt viel mehr Ingwer übrig als mit dem Messer. Junger Ingwer mit dünner Schale muss gar nicht geschält werden." },
    { titel: "Der Ingwer-Shot", text: "Ein daumengroßes Stück Ingwer mit dem Saft einer Orange und einer halben Zitrone pürieren oder fein reiben, durchs Sieb drücken, Löffel Honig dazu. Ein Schnapsglas voll – scharf, wach, Gesichtsausdruck garantiert. Im Kühlschrank 2–3 Tage gut." },
    { titel: "Ingwer-Honig im Glas", text: "Ein sauberes Schraubglas abwechselnd mit dünnen Ingwerscheiben und Honig füllen, ein paar Zitronenscheiben dazu. Im Kühlschrank ein paar Tage durchziehen lassen, dann löffelweise in heißes Wasser. Innerhalb von ein, zwei Wochen aufbrauchen und immer einen sauberen Löffel nehmen." },
    { titel: "Kandierter Ingwer selbst gemacht", text: "Geschälten Ingwer in dünne Scheiben schneiden, 10 Minuten in Wasser köcheln, abgießen. Dann mit gleicher Menge Zucker und etwas Wasser köcheln, bis der Sirup fast weg ist, auf Backpapier in Zucker wälzen und trocknen lassen. Der Sirup vom ersten Mal ist ein Schatz für Tee." },
    { titel: "Ingwer ins Essen schmuggeln", text: "Ein Teelöffel geriebener Ingwer in Kürbis- oder Möhrensuppe, ins Apfelmus, in den Milchreis oder an gebratenes Gemüse. Erst zum Schluss dazugeben, dann bleibt die Schärfe frisch." },
    { titel: "Schalen nicht wegwerfen", text: "Ingwerschalen in einer Dose im Gefrierfach sammeln und beim nächsten Tee oder Gemüsebrühe mitkochen. Sparsam, aromatisch, und man kommt sich sehr schlau vor." },
    { titel: "Wie scharf ist meiner?", text: "Ingwer ist nicht gleich Ingwer: Frischer, saftiger ist milder, alter und faseriger schärfer. Ein dünnes Scheibchen roh probieren, bevor die ganze Kanne gebraut wird – dann weißt du, ob drei Scheiben reichen oder fünf." }
  ],

  /* ---------- Heizen, Lüften, Luftfeuchte ---------- */
  luft: [
    { titel: "Ein Hygrometer für ein paar Euro", text: "Ein kleines Thermo-Hygrometer zeigt Temperatur und Luftfeuchte. Wohlfühlbereich: etwa 40 bis 60 Prozent. Ein Gerät ins Wohnzimmer, eins ins Schlafzimmer – und du weißt, statt zu raten." },
    { titel: "Stoßlüften statt Kippfenster", text: "Im Winter mehrmals am Tag, etwa 3- bis 4-mal, das Fenster 5 bis 10 Minuten ganz öffnen, Heizung dabei zudrehen. Gegenüberliegende Fenster gleichzeitig auf (Durchzug) geht noch schneller. Das Kippfenster kühlt nur die Wand aus und bringt kaum frische Luft." },
    { titel: "Die richtige Wärme pro Zimmer", text: "Wohnzimmer um 20 Grad, Küche etwa 18, Schlafzimmer kühler, um 17 bis 18 Grad. Nicht unter 16 Grad auskühlen lassen, sonst wird es klamm an den Wänden. Die Zahl auf dem Thermostat ist kein Grad-Wert: Stufe 3 heißt meist ungefähr 20 Grad." },
    { titel: "Wäsche ist kein Luftbefeuchter-Ersatz", text: "Ein Wäscheständer bringt Feuchte – aber oft zu viel auf einmal und an der falschen Stelle. Lieber im gut gelüfteten Raum trocknen und das Hygrometer im Blick behalten. Über 60 Prozent: Fenster auf." },
    { titel: "Trockene Heizungsluft sanft befeuchten", text: "Zeigt das Hygrometer dauerhaft unter 40 Prozent, helfen eine Schale Wasser auf der Heizung (täglich frisch, Schale regelmäßig heiß ausspülen) oder ein Verdunster. Jeder Befeuchter braucht Pflege: Stehendes Wasser wird sonst schnell zur Keimzucht." },
    { titel: "Schlafzimmer kühl, Bett warm", text: "Kühle Luft und warme Decke, das empfinden viele Bronchien als angenehm. Abends kurz stoßlüften, Tür zu, Wärmflasche oder Bettsocken rein. Morgens noch einmal lüften, dann kann die Nachtfeuchte raus." },
    { titel: "Schal vor den Mund bei Frost", text: "Ganz kalte Luft ist für empfindliche Bronchien ein Reiz. Draußen den Schal locker über Mund und Nase ziehen, ruhig durch die Nase atmen und die ersten Minuten gemächlich gehen – dann wärmt sich die Atemluft vor." },
    { titel: "Kerzen und Duftlampen sparsam", text: "Kerzen, Räucherstäbchen und Duftöle machen es gemütlich, bringen aber Rauch, feine Partikel oder Duftstoffe in die Luft. Für empfindliche Bronchien: lieber selten, nicht stundenlang, und danach lüften. Eine LED-Kerze flackert auch schön." },
    { titel: "Heizkörper entstauben", text: "Staub auf den Heizkörpern wird mit der warmen Luft durchs Zimmer gewirbelt. Zum Heizstart einmal mit einer langen Heizkörperbürste oder einem feuchten Tuch durch die Rippen – das ist eine Sache von zehn Minuten und riecht danach weniger nach angebrannt." },
    { titel: "Pflanzen: schön, aber keine Klimaanlage", text: "Zimmerpflanzen tun der Stimmung gut, befeuchten aber nur wenig. Wichtiger: kein Wasser im Untersetzer stehen lassen und weißen Belag auf der Erde abnehmen oder die oberste Schicht erneuern. Umtopfen lieber mit Handschuhen und am offenen Fenster – oder draußen." }
  ],

  /* ---------- Schutz im Alltag ---------- */
  schutz: [
    { titel: "Einkaufen zu ruhigen Zeiten", text: "Früh morgens kurz nach Öffnung oder werktags um die Mittagszeit ist es in vielen Supermärkten am leersten; Samstag und der Feierabend sind am vollsten. Mit Einkaufszettel geht es doppelt so schnell." },
    { titel: "Liefern lassen oder abholen", text: "Viele Supermärkte und die Apotheke liefern oder packen vor (Click & Collect). Bestellen am Handy, abholen an der Tür oder Packstation – Max richtet das gern einmal mit dir ein." },
    { titel: "Besuch mit offenem Fenster", text: "Wenn jemand da ist: zwischendurch alle 20 bis 30 Minuten kurz querlüften. Eine CO2-Ampel zeigt es dir ohne Rechnen – grün ist gut, ab gelb (etwa 1000 ppm) Fenster auf. Sieht aus wie ein kleines Spielzeug und ist erstaunlich überzeugend für Gäste." },
    { titel: "Schnelltests vorrätig", text: "Ein paar Antigen-Schnelltests im Schrank, bei Zimmertemperatur und nicht in der Sonne oder im kalten Auto. Ablaufdatum (die kleine Sanduhr) ab und zu checken. Für Besuch: Test am selben Tag, kurz vorher – und Tests gern auch verschenken, das macht das Fragen leichter." },
    { titel: "Im Bus der gute Platz", text: "Nahe der Tür, wo bei jedem Halt frische Luft reinkommt, oder am Fenster. Wenn es voll wird: einfach die nächste nehmen." },
    { titel: "Die Bank als Verabredung", text: "Mit warmer Jacke, Sitzkissen und Thermoskanne ist eine Bank im Winter eine prima Verabredung. Unter freiem Himmel verteilt sich die Luft ganz von selbst." },
    { titel: "Kino am Nachmittag", text: "Unter der Woche um drei ist im Kino oft kaum jemand. Freie Platzwahl, eine Reihe ganz für dich – und wenn du rauskommst, ist es noch hell." },
    { titel: "Museum zur stillen Stunde", text: "Dienstag bis Donnerstag am Vormittag sind viele Museen fast leer. Mit einem Zeitfenster-Ticket kommen außerdem nicht alle auf einmal." },
    { titel: "Konzert vom Sofa", text: "ARTE Concert zeigt ganze Konzerte zum Nachschauen, von Klassik bis Pop. Kostenlos, bester Platz, und an der Garderobe drängelt keiner." }
  ],

  /* ---------- Besuch: Bitte um einen Test ---------- */
  besuch: {
    intro: "Bei mir gilt im Winter: Wer reinkommt, testet vorher – drei fertige Nachrichten zum Abschicken, ganz ohne Erklärungsnot.",
    nachrichten: [
      "Ich freu mich riesig auf dich! Eine kleine Bitte hab ich: Mach vorher einen Schnelltest, ich pass im Winter gut auf mich auf. Dafür gibt’s Kuchen und ein offenes Fenster als Bonus.",
      "Hallo du! Wie schön, dass du kommst. Sei so lieb und teste dich am selben Tag kurz vorher – das ist mein Eintrittsgeld. Kaffee steht dann bereit, ich hab schon den guten Becher rausgestellt.",
      "Freu mich! Bitte vorher testen. Danke dir!"
    ]
  },

  /* ---------- Draußen treffen statt Café ---------- */
  draussenTreffen: [
    { titel: "Thermoskannen-Fika auf der Bank", text: "Zwei Thermoskannen (Tee und Kaffee), zwei Becher, Sitzkissen, Zimtschnecken in der Dose. Auf Schwedisch heißt das Fika und ist quasi Pflicht. Eine Bank in der Sonne suchen, Decke über die Knie." },
    { titel: "Weihnachtsmarkt gleich nach Öffnung", text: "Der Spandauer Weihnachtsmarkt in der Altstadt ist werktags gleich nach Öffnung viel ruhiger als am Abend. Einmal durchschlendern, Maske in der Tasche, gebrannte Mandeln für den Heimweg." },
    { titel: "Spandauer Forst mit Ziel", text: "Ein Spaziergang ist besser mit Ziel: zum Wildgehege, den Kuhlake-Uferweg entlang, zum Moor am Teufelsbruch oder bis zur nächsten Bank mit Aussicht. Unterwegs Vögel zählen oder Spuren im Schnee raten." },
    { titel: "Zitadellen-Runde", text: "Einmal außen um die Zitadelle über den Wassergraben schauen, die Enten begrüßen, Fotos machen. Danach einen Tee aus der Thermoskanne auf der Bank am Wasser." },
    { titel: "Havelufer-Spaziergang", text: "An der Havel entlang ist die Luft weit und das Licht im Winter oft wunderschön. Wer zuerst einen Graureiher entdeckt, bekommt den letzten Keks." },
    { titel: "Glühpunsch am Fenster im Hof", text: "Nachbarin unten im Hof, du am offenen Fenster – oder umgekehrt. Beide mit einem Becher alkoholfreiem Punsch, Lichterkette dran – der kleinste Weihnachtsmarkt Spandaus." },
    { titel: "Gartentor-Kaffee", text: "Kurz vorbeikommen, nicht reinkommen: Ein Becher Tee am Gartentor oder auf dem Balkon, zehn Minuten Schwatz, warme Hände am Becher." },
    { titel: "Spaziergang mit Telefon", text: "Wenn Treffen gerade nicht klappt: Beide gehen gleichzeitig los, jede in ihrem Viertel, und telefonieren dabei. Man erzählt sich, was man sieht – das ist erstaunlich gesellig." }
  ]
};

/* ---------- Neue Ideen: Tee & Wärme / Gut geschützt ---------- */
D.stattDaddeln.push(
  {"id":"SD401","titel":"Ingwer auf Eis legen","text":"Kauf eine schöne Ingwerknolle, wasch sie und leg sie ganz ins Gefrierfach. Ab jetzt wird gefroren gerieben – ab morgen hast du immer Ingwer im Haus.","min":5,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Stehen","t":"kochen"},
  {"id":"SD402","titel":"Die Teelöffel-Schälprobe","text":"Schäl ein Stück Ingwer einmal mit dem Messer und einmal mit der Kante eines Teelöffels. Welche Methode gewinnt? Die Reste wandern in den Tee.","min":5,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen, im Stehen","t":"kochen"},
  {"id":"SD403","titel":"Ingwer-Honig ansetzen","text":"Füll ein sauberes Schraubglas abwechselnd mit Ingwerscheiben, Zitrone und Honig und stell es in den Kühlschrank. In ein paar Tagen hast du Tee-Konzentrat zum Löffeln.","min":15,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen, im Stehen","t":"kochen",
   "schritte":["Glas heiß ausspülen und trocknen lassen.","Ingwer in dünne Scheiben schneiden, eine Bio-Zitrone in Scheiben.","Schichten: Ingwer, Zitrone, Honig – bis das Glas voll ist und alles bedeckt.","Datum aufs Glas, ab in den Kühlschrank, in ein, zwei Wochen aufbrauchen."]},
  {"id":"SD404","titel":"Ein Ingwer-Shot mit Grimasse","text":"Mach dir einen Ingwer-Shot aus Ingwer, Orange, Zitrone und Honig – und schick Max ein Foto von deinem Gesicht beim ersten Schluck.","min":10,"tf":"AB","kat":"Tee & Wärme","haltung":"im Stehen","t":"kochen"},
  {"id":"SD405","titel":"Kandierter Ingwer","text":"Koch dir eine kleine Portion kandierten Ingwer. Den Sirup gießt du in ein Glas – ein Löffel davon macht jeden Tee zum Wintertee.","min":45,"tf":"AB","kat":"Tee & Wärme","haltung":"im Stehen","t":"kochen",
   "schritte":["Etwa 150 g Ingwer schälen und in dünne Scheiben schneiden.","10 Minuten in Wasser köcheln, abgießen.","Mit 150 g Zucker und 100 ml Wasser köcheln, bis der Sirup fast eingekocht ist.","Scheiben auf Backpapier in Zucker wälzen und über Nacht trocknen lassen."]},
  {"id":"SD406","titel":"Drei-Tassen-Verkostung","text":"Brüh drei kleine Tassen mit drei verschiedenen Tees auf und vergib Noten für Duft, Farbe und Geschmack wie eine Sommelière. Der Sieger kommt in den Vorrat.","min":20,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen","t":"getrunken",
   "optionen":["Ingwer-Zitrone gegen Thymian gegen Salbei","Lindenblüte gegen Holunder gegen beides gemischt","Hagebutte gegen Rooibos-Vanille gegen Apfel-Zimt","Fenchel-Anis gegen Pfefferminz-Ingwer gegen Chai","Drei Tees aus dem Schrank, die du lange nicht getrunken hast"]},
  {"id":"SD407","titel":"Die eigene Hausmischung","text":"Misch dir eine eigene Teemischung aus dem, was im Schrank ist, füll sie in ein Glas und gib ihr einen Namen – „Ritas Waldtee“ oder „Spandauer Nebel“.","min":15,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen","t":"kochen",
   "schritte":["Eine Basis wählen: Hagebutte, Rooibos oder Lindenblüte.","Eine Würze dazu: Zimt, Orangenschale, Ingwer oder Fenchel.","Einen Löffel probieren und abschmecken.","In ein Glas füllen, Etikett mit Name und Datum dran."]},
  {"id":"SD408","titel":"Etiketten für die Teedosen","text":"Mal oder schreib schöne Etiketten für deine Teegläser: Name, Ziehzeit und ein kleines Bild. Dann weißt du im Dunkeln, was Thymian ist und was Fenchel.","min":15,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen","t":"handarbeit"},
  {"id":"SD409","titel":"Thymian mit Deckel","text":"Brüh einen Thymiantee auf und deck die Tasse 10 Minuten mit einer Untertasse ab. Riech danach an der Unterseite – da hängt der ganze Duft.","min":12,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen","t":"getrunken"},
  {"id":"SD410","titel":"Glögg-Tee für Karin","text":"Koch dir einen alkoholfreien Glögg-Tee mit Traubensaft, Zimt, Nelken und Kardamom, fotografier die Tasse mit Rosinen und Mandeln und schick das Bild nach Schweden.","min":20,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Stehen, im Sitzen","t":"kochen"},
  {"id":"SD411","titel":"Chai ohne Schwarztee","text":"Koch einen Chai nur mit Gewürzen, Milch und Honig. Zähl hinterher, wie viele Gewürze du herausschmeckst – ohne aufs Rezept zu schielen.","min":15,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Stehen","t":"kochen"},
  {"id":"SD412","titel":"Orangenschalen auf der Heizung","text":"Schäl eine Bio-Orange in Streifen und leg die Schalen zum Trocknen auf ein Tellerchen an die Heizung. Duftet sofort, und in ein paar Tagen ist es Teezutat.","min":5,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen","t":"kochen"},
  {"id":"SD413","titel":"Die Thermoskanne präparieren","text":"Spül die Thermoskanne einmal mit kochendem Wasser vor, gieß aus und füll erst dann den Tee ein – so bleibt er stundenlang heiß. Mit Tee für einen Ausflug oder die Bank vor dem Haus.","min":10,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Stehen","t":"kochen"},
  {"id":"SD414","titel":"Apfelschalen-Tee","text":"Mach aus Apfelschalen und einer Zimtstange einen Tee, statt die Schalen wegzuwerfen. Gut gewaschen und 10 Minuten geköchelt – überraschend lecker.","min":15,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Stehen","t":"kochen"},
  {"id":"SD415","titel":"Kürbissuppe mit Ingwerkick","text":"Koch eine Kürbis- oder Möhrensuppe und reib zum Schluss einen Teelöffel Ingwer hinein. Ein Teller für heute, eine Portion zum Einfrieren.","min":40,"tf":"AB","kat":"Tee & Wärme","haltung":"im Stehen","t":"kochen"},
  {"id":"SD416","titel":"Die Ziehzeit-Wette","text":"Lass einen Salbeitee ziehen und probier nach 3, 6 und 10 Minuten je einen Schluck. Wann ist er für dich genau richtig? Notier es aufs Teeglas.","min":12,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen","t":"getrunken"},
  {"id":"SD417","titel":"Teewissen: Wo wächst Rooibos?","text":"Find heraus, wo Rooibos wächst, warum er rot wird und was das Wort bedeutet. Den besten Fakt erzählst du beim nächsten Telefonat.","min":10,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen, im Liegen","t":"gelernt"},
  {"id":"SD418","titel":"Ein Teepaket verschenken","text":"Füll eine kleine Tüte mit deiner Hausmischung, schreib Ziehzeit und einen Gruß dazu und leg sie jemandem in den Briefkasten.","min":15,"tf":"ABC","kat":"Tee & Wärme","haltung":"im Sitzen","t":"brief"},
  {"id":"SD419","titel":"Hygrometer-Rundgang","text":"Trag das Hygrometer einmal durch die Wohnung und schreib für jedes Zimmer Temperatur und Luftfeuchte auf. Welches Zimmer ist das trockenste, welches das kühlste?","min":10,"tf":"ABC","kat":"Gut geschützt","haltung":"im Stehen","t":"ordnung"},
  {"id":"SD420","titel":"Mein Lüftungsplan","text":"Schreib dir einen Lüftungsplan an den Kühlschrank: morgens, mittags, nachmittags und abends je 5 bis 10 Minuten Fenster ganz auf. Hak eine Woche lang ab.","min":10,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen","t":"papier",
   "schritte":["Vier Zeiten festlegen, etwa nach dem Aufstehen, vor dem Mittag, nachmittags, vor dem Schlafen.","Heizung beim Lüften zudrehen, Fenster ganz auf – nicht kippen.","Wecker im Handy stellen oder Zettel ans Fenster.","Nach einer Woche aufs Hygrometer schauen: Hat sich was getan?"]},
  {"id":"SD424","titel":"Test-Vorrat checken","text":"Zähl deine Schnelltests, schau auf die kleine Sanduhr fürs Ablaufdatum und schreib auf, was nachgekauft werden muss. Die ältesten nach vorn.","min":5,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen","t":"versorgung"},
  {"id":"SD425","titel":"Die ruhigste Supermarkt-Stunde","text":"Finde heraus, wann dein Supermarkt am leersten ist: Bei Google Maps steht unter dem Laden „Stoßzeiten“, oder frag an der Kasse. Notier deine Lieblingszeit.","min":10,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen, im Liegen","t":"gelernt"},
  {"id":"SD426","titel":"Einmal liefern lassen","text":"Bestell einen Einkauf oder etwas aus der Apotheke zum ersten Mal per Lieferung oder Click & Collect. Wenn es hakt: Max anrufen und zusammen durchklicken.","min":20,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen","t":"erstesmal"},
  {"id":"SD427","titel":"Die Besuchsnachricht verschicken","text":"Such dir eine der fertigen Besuchsnachrichten aus und schick sie an jemanden, der bald vorbeikommen will. Kurz, freundlich, erledigt.","min":3,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen, im Liegen","t":"brief",
   "optionen":["Die herzliche mit Kuchen und offenem Fenster","Die mit dem Eintrittsgeld","Die ganz kurze mit Kaffeetasse","Eine eigene Version in deinen Worten"]},
  {"id":"SD428","titel":"Ein Draußen-Treffen verabreden","text":"Ruf jemanden an und verabrede ein Treffen unter freiem Himmel: Bank mit Thermoskanne, Zitadellen-Runde oder Spaziergang im Forst. Datum und Ort gleich in den Kalender.","min":10,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen","t":"telefon"},
  {"id":"SD429","titel":"Die Draußen-Tasche packen","text":"Pack eine Tasche, die im Winter immer bereitsteht: Sitzkissen, Thermoskanne, zweiter Becher, Ersatzmaske, Taschentücher und eine Decke für die Knie.","min":10,"tf":"ABC","kat":"Gut geschützt","haltung":"im Stehen","t":"ordnung"},
  {"id":"SD430","titel":"Heizkörper-Frühjahrsputz im Herbst","text":"Entstaub einen Heizkörper gründlich mit Bürste oder feuchtem Tuch, auch zwischen den Rippen. Einer heute, der nächste ein andermal.","min":10,"tf":"AB","kat":"Gut geschützt","haltung":"im Stehen","t":"ordnung"},
  {"id":"SD431","titel":"CO2-Ampel im Selbstversuch","text":"Stell eine CO2-Ampel ins Wohnzimmer und beobachte, wie schnell sie bei geschlossenem Fenster gelb wird – und wie schnell sie nach dem Lüften wieder grün ist.","min":15,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen","t":"gelernt"},
  {"id":"SD432","titel":"Schnelltests als Geschenk","text":"Pack zwei Schnelltests in einen Umschlag mit einem netten Zettel – „Für unseren nächsten Kaffee“ – und gib ihn jemandem mit, der dich bald besucht.","min":10,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen","t":"brief"},
  {"id":"SD433","titel":"Der Heimkomm-Platz","text":"Richte am Eingang einen Heimkomm-Platz ein: Haken für die Jacke, Schale für Schlüssel und Maske, Handcreme neben dem Waschbecken. Ankommen in drei Handgriffen.","min":15,"tf":"AB","kat":"Gut geschützt","haltung":"im Stehen","t":"ordnung"},
  {"id":"SD435","titel":"Kino zur Kaffeezeit","text":"Such dir im Programm des Kinos in der Altstadt eine Nachmittagsvorstellung unter der Woche heraus. Um drei sitzt man da oft mit einer Handvoll Leuten im Saal und hat freie Platzwahl.","min":10,"tf":"ABC","kat":"Gut geschützt","haltung":"im Sitzen","t":"kultur"},
  {"id":"SD436","titel":"Ein Konzert vom Sofa","text":"Such dir bei ARTE Concert ein ganzes Konzert aus, Klassik, Jazz oder Pop, und schau es groß auf dem Fernseher oder Tablet. Logenplatz ohne Schlange an der Garderobe.","min":30,"tf":"ABCD","kat":"Gut geschützt","haltung":"im Sitzen, im Liegen","t":"musik","links":[{"text":"ARTE Concert öffnen","url":"https://www.arte.tv/de/arte-concert/"}]},
  {"id":"SD434","titel":"Schal-Atmen im Frost","text":"Geh eine kurze Runde in die Kälte, den Schal locker über Mund und Nase, und atme ruhig durch die Nase. Spür nach: Wie fühlt sich die Luft nach ein paar Minuten an?","min":15,"tf":"AB","kat":"Gut geschützt","haltung":"unterwegs","t":"gehen"}
);
