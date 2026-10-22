/* Brevvän: Briefwechsel mit Karin Sjöberg aus Vimmerby (Småland).
   Reines Datenobjekt. monat: null = ganzjährig, sonst Monate (1–12).
   weiter:null = Brief endet nach dieser Antwort, dann folgt „schluss“. */
D.brevvan = [

/* ==================== GANZJÄHRIG ==================== */

{ id: "sv-01", thema: "Fika am Freitag", monat: null,
  ord: { sv: "fika", de: "Kaffeepause mit etwas Süßem", tipp: "Geht als Verb und Nomen: „Ska vi fika?“ – „Wollen wir Fika machen?“" },
  knoten: {
    start: { sagt: "Hej Rita! Det är fredag, och jag har just satt på kaffet. Vad har du till kaffet idag?", de: "Hallo Rita! Es ist Freitag, und ich hab gerade Kaffee aufgesetzt. Was gibt’s bei dir heute zum Kaffee?", antworten: [
      { text: "En bit kaka. Och du?", de: "Ein Stück Kuchen. Und bei dir?", weiter: "kaka" },
      { text: "Ingenting. Jag bantar!", de: "Nichts. Ich mach Diät!", weiter: "diet" } ] },
    kaka: { sagt: "Kanelbullar, förstås. Och Sotis sitter bredvid och räknar varenda tugga.", de: "Zimtschnecken natürlich. Und Sotis sitzt daneben und zählt jeden Bissen mit.", antworten: [
      { text: "Ge henne ingen bulle!", de: "Gib ihr bloß keine Zimtschnecke!", weiter: "ost" },
      { text: "Vem vinner, du eller Sotis?", de: "Wer gewinnt, du oder Sotis?", weiter: "vinner" } ] },
    diet: { sagt: "Bantar? På en fredag? Det är nästan brottsligt i Sverige.", de: "Diät? An einem Freitag? Das ist in Schweden fast strafbar.", antworten: [
      { text: "Okej, okej. En liten bit, då.", de: "Okay, okay. Dann eben ein kleines Stück.", weiter: "liten" },
      { text: "Det var ett skämt!", de: "Das war ein Witz!", weiter: "skamt" } ] },
    ost: { sagt: "Nej då. Hon får en bit ost. Hon är lagom bortskämd.", de: "Keine Sorge. Sie kriegt ein Stück Käse. Sie ist lagom verwöhnt.", antworten: [
      { text: "Lagom bortskämd – det låter bra!", de: "Lagom verwöhnt – klingt gut!", weiter: null },
      { text: "Hälsa Sotis från mig!", de: "Grüß Sotis von mir!", weiter: null } ] },
    vinner: { sagt: "Sotis, alltid. Jag är bara personalen här.", de: "Sotis, immer. Ich bin hier nur das Personal.", antworten: [
      { text: "Så är det med katter.", de: "So ist das mit Katzen.", weiter: null },
      { text: "Personalen får också en bulle!", de: "Das Personal kriegt auch eine Zimtschnecke!", weiter: null } ] },
    liten: { sagt: "Bra! En liten bit är lagom. På fredagar är två bitar också lagom.", de: "Gut! Ein kleines Stück ist genau richtig. Freitags sind zwei auch genau richtig.", antworten: [
      { text: "Du har alltid en regel.", de: "Du hast immer eine Regel parat.", weiter: null },
      { text: "Då tar jag två!", de: "Dann nehm ich zwei!", weiter: null } ] },
    skamt: { sagt: "Puh! Jag höll på att ringa polisen.", de: "Puh! Fast hätte ich die Polizei gerufen.", antworten: [
      { text: "Ring Wallander, han gillar kaffe.", de: "Ruf Wallander an, der mag Kaffee.", weiter: null },
      { text: "Lugn, jag har redan kakan här.", de: "Keine Sorge, der Kuchen steht schon da.", weiter: null } ] }
  },
  schluss: { sv: "Kram från Vimmerby! /Karin", de: "Umarmung aus Vimmerby! /Karin" } },

{ id: "sv-02", thema: "Wallander und der Kaffee", monat: null,
  ord: { sv: "påtår", de: "die zweite Tasse Kaffee", tipp: "Und die dritte heißt „tretår“. „Vill du ha påtår?“ – „Noch eine Tasse?“" },
  knoten: {
    start: { sagt: "Hej Rita! Jag läser Wallander igen, för tredje gången. Han dricker mer kaffe än jag!", de: "Hallo Rita! Ich lese wieder Wallander, zum dritten Mal. Der trinkt mehr Kaffee als ich!", antworten: [
      { text: "Omöjligt! Ingen dricker mer kaffe än du.", de: "Unmöglich! Keiner trinkt mehr Kaffee als du.", weiter: "kaffe" },
      { text: "Vilken bok läser du?", de: "Welches Buch liest du?", weiter: "bok" } ] },
    kaffe: { sagt: "Sant. Jag tar alltid påtår. Wallander tar påtår och sedan tretår.", de: "Stimmt. Ich nehm immer eine zweite Tasse. Wallander nimmt die zweite und dann noch eine dritte.", antworten: [
      { text: "Vad är en påtår?", de: "Was ist eine „påtår“?", weiter: "patar" },
      { text: "Jag tar också tretår idag.", de: "Ich nehm heute auch eine dritte.", weiter: "tretar" } ] },
    bok: { sagt: "Den allra första. Ystad i regn och blåst – perfekt för en grå dag.", de: "Den allerersten. Ystad bei Regen und Wind – perfekt für einen grauen Tag.", antworten: [
      { text: "Ystad låter fint. Jag vill åka dit!", de: "Ystad klingt schön. Da will ich hin!", weiter: "ystad" },
      { text: "Wallander är alltid så trött.", de: "Wallander ist immer so müde.", weiter: "trott" } ] },
    patar: { sagt: "Påtår är kopp nummer två. Ett mycket viktigt ord i Sverige!", de: "„Påtår“ ist Tasse Nummer zwei. Ein sehr wichtiges Wort in Schweden!", antworten: [
      { text: "Då är jag expert på påtår.", de: "Dann bin ich Expertin für „påtår“.", weiter: null },
      { text: "Tack, fröken!", de: "Danke, Frau Lehrerin!", weiter: null } ] },
    tretar: { sagt: "Rita! Nu dricker du som en riktig svensk kommissarie.", de: "Rita! Jetzt trinkst du wie eine echte schwedische Kommissarin.", antworten: [
      { text: "Kommissarie Rita från Spandau!", de: "Kommissarin Rita aus Spandau!", weiter: null },
      { text: "Bara om jag får kaka också.", de: "Nur wenn’s Kuchen dazu gibt.", weiter: null } ] },
    ystad: { sagt: "Kom! Vi tar tåget, dricker kaffe och letar efter Wallanders gata. Mariagatan, tror jag.", de: "Komm! Wir nehmen den Zug, trinken Kaffee und suchen Wallanders Straße. Die Mariagatan, glaube ich.", antworten: [
      { text: "Jag packar väskan!", de: "Ich pack schon den Koffer!", weiter: null },
      { text: "Och vi tar med kanelbullar.", de: "Und wir nehmen Zimtschnecken mit.", weiter: null } ] },
    trott: { sagt: "Ja, stackars Kurt. Han jobbar för mycket och sover för lite.", de: "Ja, der arme Kurt. Er arbeitet zu viel und schläft zu wenig.", antworten: [
      { text: "Och dricker för mycket kaffe!", de: "Und trinkt zu viel Kaffee!", weiter: null },
      { text: "Skicka honom till Vimmerby!", de: "Schick ihn nach Vimmerby!", weiter: null } ] }
  },
  schluss: { sv: "En påtår och en kram! /Karin", de: "Eine zweite Tasse und eine Umarmung! /Karin" } },

{ id: "sv-03", thema: "Ausflug nach Fjällbacka", monat: null,
  ord: { sv: "smultronställe", de: "Lieblingsort (wörtlich: Walderdbeer-Stelle)", tipp: "Ein geheimer, besonderer Ort, an den man gern zurückkehrt." },
  knoten: {
    start: { sagt: "Hej Rita! Nu är jag hemma från Fjällbacka, där Camilla Läckbergs böcker utspelar sig. Jag tittade efter Erica Falck överallt, men jag hittade bara en glasskiosk.", de: "Hallo Rita! Ich bin zurück aus Fjällbacka, wo Camilla Läckbergs Bücher spielen. Ich hab überall nach Erica Falck Ausschau gehalten, aber nur einen Eisstand gefunden.", antworten: [
      { text: "Glass är också bra!", de: "Eis ist auch gut!", weiter: "glass" },
      { text: "Var Patrik där?", de: "War Patrik da?", weiter: "patrik" } ] },
    glass: { sagt: "Ja, två kulor. Och Erica äter säkert också glass ibland.", de: "Ja, zwei Kugeln. Und Erica isst bestimmt auch mal Eis.", antworten: [
      { text: "Mellan två mord, ja.", de: "Zwischen zwei Morden, ja.", weiter: "wall" },
      { text: "Vilken smak?", de: "Welche Sorte?", weiter: "smak" } ] },
    patrik: { sagt: "Nej. Han är säkert på jobbet i Tanumshede.", de: "Nein. Der ist bestimmt auf der Wache in Tanumshede.", antworten: [
      { text: "Synd. Jag har några frågor till honom.", de: "Schade. Ich hätte ein paar Fragen an ihn.", weiter: "fragor" },
      { text: "Hur var Fjällbacka annars?", de: "Wie war Fjällbacka sonst?", weiter: "smultron" } ] },
    wall: { sagt: "Ha! Och mellan två barn. Hon har mycket att göra, den kvinnan.", de: "Ha! Und zwischen zwei Kindern. Die Frau hat viel zu tun.", antworten: [
      { text: "Då behöver hon två kulor.", de: "Dann braucht sie zwei Kugeln.", weiter: null },
      { text: "Och jag tar vaniljglass, tack.", de: "Und ich nehm Vanilleeis, bitte.", weiter: null } ] },
    smak: { sagt: "Lakrits! Nu rynkar du på näsan, eller hur?", de: "Lakritz! Jetzt rümpfst du die Nase, stimmt’s?", antworten: [
      { text: "Ja! Lakrits är ett brott.", de: "Ja! Lakritz ist ein Verbrechen.", weiter: null },
      { text: "Nej, jag gillar lakrits!", de: "Nein, ich mag Lakritz!", weiter: null } ] },
    fragor: { sagt: "Skriv en lista! Du är ju bra på listor.", de: "Schreib eine Liste! Listen kannst du doch.", antworten: [
      { text: "Fråga ett: var är kaffet?", de: "Frage eins: Wo ist der Kaffee?", weiter: null },
      { text: "Listan är redan klar.", de: "Die Liste ist schon fertig.", weiter: null } ] },
    smultron: { sagt: "Ett riktigt smultronställe. Klippor, havet och röda sjöbodar vid vattnet.", de: "Ein echter Lieblingsort. Felsen, das Meer und rote Bootshäuser am Wasser.", antworten: [
      { text: "Dit vill jag också åka!", de: "Da will ich auch hin!", weiter: null },
      { text: "Vilket fint ord: smultronställe!", de: "Was für ein schönes Wort: „smultronställe“!", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar från Vimmerby – hemma igen! /Karin", de: "Grüße aus Vimmerby – wieder daheim! /Karin" } },

{ id: "sv-04", thema: "Martin Beck im Billy-Regal", monat: null,
  ord: { sv: "klart som korvspad", de: "sonnenklar (wörtlich: klar wie Würstchenwasser)", tipp: "Würstchenwasser ist gar nicht klar – genau das ist der Witz." },
  knoten: {
    start: { sagt: "Hej Rita! Jag läser om Martin Beck. Sjöwall och Wahlöö skrev tio böcker om honom – jag har alla i bokhyllan.", de: "Hallo Rita! Ich lese wieder Martin Beck. Sjöwall und Wahlöö haben zehn Bände über ihn geschrieben – ich hab alle im Regal.", antworten: [
      { text: "I en Billy-hylla, antar jag?", de: "In einem Billy-Regal, nehme ich an?", weiter: "billy" },
      { text: "Vem är din favorit i gruppen?", de: "Wer ist dein Liebling in der Truppe?", weiter: "favorit" } ] },
    billy: { sagt: "Klart som korvspad! Alla svenskar har en Billy.", de: "Sonnenklar! Jeder Schwede hat ein Billy.", antworten: [
      { text: "Korvspad? Vad är det?", de: "„Korvspad“? Was ist das?", weiter: "korv" },
      { text: "Jag har två Billy i Spandau.", de: "Ich hab zwei Billys in Spandau.", weiter: "tva" } ] },
    favorit: { sagt: "Kollberg! Han älskar god mat. Och Gunvald Larsson med sina fina kläder.", de: "Kollberg! Der liebt gutes Essen. Und Gunvald Larsson mit seinen feinen Anzügen.", antworten: [
      { text: "Kollberg skulle gilla Christianes söndagsmat.", de: "Kollberg würde Christianes Sonntagsessen mögen.", weiter: "jane" },
      { text: "Jag gillar Martin Beck mest.", de: "Ich mag Martin Beck am liebsten.", weiter: "beck" } ] },
    korv: { sagt: "Vattnet som man kokar korv i. Klart som korvspad betyder: helt självklart!", de: "Das Wasser, in dem man Würstchen kocht. „Klar wie Würstchenwasser“ heißt: völlig klar!", antworten: [
      { text: "Men korvspad är ju inte klart!", de: "Aber Würstchenwasser ist doch gar nicht klar!", weiter: null },
      { text: "Det ska jag säga till Christiane.", de: "Das erzähl ich Christiane.", weiter: null } ] },
    tva: { sagt: "Två! Du är mer svensk än jag trodde.", de: "Zwei! Du bist schwedischer, als ich dachte.", antworten: [
      { text: "Hälften svensk, hälften Spandau.", de: "Halb Schwedin, halb Spandauerin.", weiter: null },
      { text: "Och snart kommer en tredje.", de: "Und bald kommt ein drittes.", weiter: null } ] },
    jane: { sagt: "Absolut. Han skulle flytta in hos henne direkt.", de: "Auf jeden Fall. Der würde sofort bei ihr einziehen.", antworten: [
      { text: "Det skulle Micha inte gilla!", de: "Da hätte Micha was dagegen!", weiter: null },
      { text: "Jag hälsar henne från dig.", de: "Ich richte ihr Grüße von dir aus.", weiter: null } ] },
    beck: { sagt: "Bra val. Han säger inte mycket, men han tänker hela tiden.", de: "Gute Wahl. Er redet nicht viel, aber er denkt die ganze Zeit.", antworten: [
      { text: "Som Hühnchen!", de: "Wie Hühnchen!", weiter: null },
      { text: "Inte som jag, alltså!", de: "Also nicht wie ich!", weiter: null } ] }
  },
  schluss: { sv: "Ha det gott! /Karin", de: "Lass es dir gut gehen! /Karin" } },

{ id: "sv-05", thema: "Ugglor i mossen", monat: null,
  ord: { sv: "Det är ugglor i mossen", de: "Da ist was faul (wörtlich: Eulen im Moor)", tipp: "Perfekt für Krimi-Fans: Wenn etwas verdächtig ist, sitzen Eulen im Moor." },
  knoten: {
    start: { sagt: "Hej Rita! Mina grannar har en ny stor bil, och gardinerna är alltid fördragna. Det är ugglor i mossen!", de: "Hallo Rita! Meine Nachbarn haben ein neues großes Auto, und die Vorhänge sind immer zu. Da ist was faul!", antworten: [
      { text: "Ugglor? I mossen? Vad menar du?", de: "Eulen? Im Moor? Was meinst du?", weiter: "uggla" },
      { text: "Ring Fredrika Bergman genast!", de: "Ruf sofort Fredrika Bergman an!", weiter: "fredrika" } ] },
    uggla: { sagt: "Det betyder att något är skumt. Fast jag har kanske läst för mycket Kristina Ohlsson.", de: "Das heißt, dass da was faul ist. Aber vielleicht hab ich auch zu viel Kristina Ohlsson gelesen.", antworten: [
      { text: "Man kan aldrig läsa för mycket.", de: "Zu viel lesen kann man nie.", weiter: "kikare" },
      { text: "Vad gör grannarna egentligen?", de: "Was machen die Nachbarn eigentlich?", weiter: "losning" } ] },
    fredrika: { sagt: "Hon har nog mycket att göra i Stockholm. Jag får lösa fallet själv.", de: "Die hat in Stockholm bestimmt genug zu tun. Ich muss den Fall selbst lösen.", antworten: [
      { text: "Jag hjälper dig från Spandau!", de: "Ich helf dir von Spandau aus!", weiter: "hjalp" },
      { text: "Vad gör grannarna egentligen?", de: "Was machen die Nachbarn eigentlich?", weiter: "losning" } ] },
    kikare: { sagt: "Tack! Då fortsätter jag. Just nu sitter jag vid fönstret med kikare.", de: "Danke! Dann mach ich weiter. Gerade sitz ich mit dem Fernglas am Fenster.", antworten: [
      { text: "Glöm inte kaffet!", de: "Vergiss den Kaffee nicht!", weiter: "losning" },
      { text: "Karin, du är värre än jag!", de: "Karin, du bist schlimmer als ich!", weiter: "losning" } ] },
    hjalp: { sagt: "Tack! Du tar hand om listan över misstänkta.", de: "Danke! Du kümmerst dich um die Liste der Verdächtigen.", antworten: [
      { text: "Nummer ett: Sotis.", de: "Nummer eins: Sotis.", weiter: "losning" },
      { text: "Listan är redan klar!", de: "Die Liste ist schon fertig!", weiter: "losning" } ] },
    losning: { sagt: "Fallet är löst! Barnbarnen är på besök. Bilen är deras, och de sover till lunch.", de: "Der Fall ist gelöst! Die Enkel sind zu Besuch. Das Auto gehört ihnen, und sie schlafen bis mittags.", antworten: [
      { text: "Till lunch? Det är också misstänkt!", de: "Bis mittags? Das ist auch verdächtig!", weiter: null },
      { text: "Synd. Jag ville ha en riktig deckare.", de: "Schade. Ich wollte einen echten Krimi.", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar från detektivbyrån Sjöberg! /Karin", de: "Grüße vom Detektivbüro Sjöberg! /Karin" } },

{ id: "sv-06", thema: "Sotis und der Pullover", monat: null,
  ord: { sv: "spinna", de: "schnurren", tipp: "„Katten spinner“ – die Katze schnurrt. Sie spinnt also nicht, sie ist zufrieden." },
  knoten: {
    start: { sagt: "Hej Rita! Sotis har hittat en ny sovplats: min stickade tröja. Nu får jag inte ha den på mig längre.", de: "Hallo Rita! Sotis hat einen neuen Schlafplatz: meinen Strickpulli. Jetzt darf ich ihn nicht mehr anziehen.", antworten: [
      { text: "Köp en ny tröja!", de: "Kauf dir einen neuen Pulli!", weiter: "ny" },
      { text: "Spinner hon i tröjan?", de: "Schnurrt sie im Pulli?", weiter: "spinner" } ] },
    ny: { sagt: "Det har jag gjort. Nu sover hon på den nya.", de: "Hab ich schon. Jetzt schläft sie auf dem neuen.", antworten: [
      { text: "Ha! Sotis vinner alltid.", de: "Ha! Sotis gewinnt immer.", weiter: "vinner" },
      { text: "Sticka en tröja åt Sotis!", de: "Strick doch Sotis einen Pulli!", weiter: "sticka" } ] },
    spinner: { sagt: "Hon spinner som en traktor. Fint verb, va? På tyska betyder det ju något helt annat.", de: "Sie schnurrt wie ein Traktor. Schönes Verb, oder? Auf Deutsch heißt das ja was ganz anderes.", antworten: [
      { text: "Ja, på tyska betyder det galen!", de: "Ja, auf Deutsch heißt das verrückt!", weiter: "galen" },
      { text: "En traktor? Det låter högt!", de: "Ein Traktor? Das klingt laut!", weiter: "hogt" } ] },
    vinner: { sagt: "Alltid. Jag har bara en tröja kvar, och den har jag på mig nu.", de: "Immer. Ich hab nur noch einen Pulli, und den hab ich gerade an.", antworten: [
      { text: "Ta inte av den!", de: "Zieh ihn bloß nicht aus!", weiter: null },
      { text: "Sotis tittar redan på den, va?", de: "Sotis guckt ihn schon an, oder?", weiter: null } ] },
    sticka: { sagt: "Sotis i tröja? Det skulle hon aldrig förlåta mig.", de: "Sotis im Pulli? Das würde sie mir nie verzeihen.", antworten: [
      { text: "Hon vill ju bara ha din.", de: "Sie will eben nur deinen.", weiter: null },
      { text: "Då stickar du en till dig själv.", de: "Dann strickst du eben einen für dich.", weiter: null } ] },
    galen: { sagt: "Ibland stämmer båda. Klockan tre på natten springer hon runt i hela huset.", de: "Manchmal passt beides. Um drei Uhr nachts rast sie durchs ganze Haus.", antworten: [
      { text: "Katter har ingen klocka.", de: "Katzen haben keine Uhr.", weiter: null },
      { text: "Då spinner hon på båda språken!", de: "Dann spinnt sie in beiden Sprachen!", weiter: null } ] },
    hogt: { sagt: "Hon är liten, men motorn är stor. Särskilt klockan fem på morgonen.", de: "Sie ist klein, aber der Motor ist groß. Besonders um fünf Uhr morgens.", antworten: [
      { text: "En väckarklocka med päls!", de: "Ein Wecker mit Fell!", weiter: null },
      { text: "Hälsa den lilla traktorn!", de: "Grüß den kleinen Traktor!", weiter: null } ] }
  },
  schluss: { sv: "Mjau och kram! /Karin och Sotis", de: "Miau und eine Umarmung! /Karin und Sotis" } },

{ id: "sv-07", thema: "Elch im Garten", monat: null,
  ord: { sv: "en älg", de: "ein Elch", tipp: "Mehrzahl: „älgar“. Achtung: „elg“ ist Norwegisch." },
  knoten: {
    start: { sagt: "Hej Rita! I morse stod en älg i min trädgård och åt mina äpplen. Han skämdes inte ett dugg.", de: "Hallo Rita! Heute früh stand ein Elch in meinem Garten und hat meine Äpfel gefressen. Er hat sich kein bisschen geschämt.", antworten: [
      { text: "Fick han betala?", de: "Musste er bezahlen?", weiter: "betala" },
      { text: "Hur stor var han?", de: "Wie groß war er?", weiter: "stor" } ] },
    betala: { sagt: "Nej, han hade glömt plånboken. Typiskt älgar.", de: "Nein, er hatte sein Portemonnaie vergessen. Typisch Elche.", antworten: [
      { text: "Skicka räkningen till skogen!", de: "Schick die Rechnung in den Wald!", weiter: "rakning" },
      { text: "Ge honom ett namn!", de: "Gib ihm einen Namen!", weiter: "namn" } ] },
    stor: { sagt: "Högre än min Volvo. Och hornen var breda som en hatthylla.", de: "Höher als mein Volvo. Und das Geweih war so breit wie eine Hutablage.", antworten: [
      { text: "Hängde du upp din hatt?", de: "Hast du deinen Hut drangehängt?", weiter: "hatt" },
      { text: "Ge honom ett namn!", de: "Gib ihm einen Namen!", weiter: "namn" } ] },
    namn: { sagt: "Han heter Bosse nu. Och Bosse kommer säkert tillbaka i morgon – det finns äpplen kvar.", de: "Er heißt jetzt Bosse. Und Bosse kommt bestimmt morgen wieder – es sind noch Äpfel übrig.", antworten: [
      { text: "Hälsa Bosse från Spandau!", de: "Grüß Bosse aus Spandau!", weiter: null },
      { text: "Spara några äpplen åt honom.", de: "Heb ihm ein paar Äpfel auf.", weiter: null } ] },
    rakning: { sagt: "Bra idé. Adress: Stora skogen, utan nummer.", de: "Gute Idee. Adresse: Großer Wald, ohne Hausnummer.", antworten: [
      { text: "Han betalar säkert aldrig.", de: "Der zahlt bestimmt nie.", weiter: null },
      { text: "Skriv ”sista påminnelsen”!", de: "Schreib „letzte Mahnung“ drauf!", weiter: null } ] },
    hatt: { sagt: "Nej då, jag stod bakom gardinen med kaffet. Man går inte ut till en älg.", de: "Nein, nein, ich stand mit meinem Kaffee hinter der Gardine. Zu einem Elch geht man nicht raus.", antworten: [
      { text: "Klokt! Han var ju större.", de: "Klug! Er war ja größer.", weiter: null },
      { text: "Och han fick äpplena ändå.", de: "Und die Äpfel hat er trotzdem gekriegt.", weiter: null } ] }
  },
  schluss: { sv: "Kram från mig och Bosse! /Karin", de: "Umarmung von mir und Bosse! /Karin" } },

{ id: "sv-08", thema: "Loppis am Samstag", monat: null,
  ord: { sv: "loppis", de: "Flohmarkt", tipp: "Kurz für „loppmarknad“. Auf dem Land steht oft ein Schild am Straßenrand: „Loppis!“" },
  knoten: {
    start: { sagt: "Hej Rita! På lördag är det loppis i Vimmerby. Jag letar efter fina koppar – fast jag har redan fyrtio.", de: "Hallo Rita! Am Samstag ist Flohmarkt in Vimmerby. Ich such hübsche Tassen – obwohl ich schon vierzig hab.", antworten: [
      { text: "Fyrtio? Det är inte lagom!", de: "Vierzig? Das ist nicht lagom!", weiter: "lagom" },
      { text: "Köp en till mig också!", de: "Kauf mir auch eine!", weiter: "till" } ] },
    lagom: { sagt: "Fyrtio koppar är lagom för en dam med många gäster. Och Sotis knuffar ner en ibland.", de: "Vierzig Tassen sind lagom für eine Dame mit vielen Gästen. Und Sotis schubst ab und zu eine runter.", antworten: [
      { text: "Då behöver du fyrtio till!", de: "Dann brauchst du noch vierzig!", weiter: "fyrtio" },
      { text: "Vad säljer man mer på loppis?", de: "Was gibt’s sonst noch auf dem Flohmarkt?", weiter: "saljer" } ] },
    till: { sagt: "Gärna! Blå eller blommig? Jag sparar den åt dig.", de: "Gern! Blau oder geblümt? Ich heb sie dir auf.", antworten: [
      { text: "Blommig, tack!", de: "Geblümt, bitte!", weiter: "blommig" },
      { text: "Vad säljer man mer på loppis?", de: "Was gibt’s sonst noch auf dem Flohmarkt?", weiter: "saljer" } ] },
    fyrtio: { sagt: "Nu pratar du som en riktig loppisdrottning!", de: "Jetzt redest du wie eine echte Flohmarktkönigin!", antworten: [
      { text: "Det är jag i Spandau också.", de: "Das bin ich in Spandau auch.", weiter: null },
      { text: "Kom ihåg: koppar med fat!", de: "Denk dran: Tassen mit Untertasse!", weiter: null } ] },
    blommig: { sagt: "Klart! Med små gula blommor. Den står i mitt skåp och väntar på dig.", de: "Klar! Mit kleinen gelben Blumen. Die steht in meinem Schrank und wartet auf dich.", antworten: [
      { text: "Tusen tack, Karin!", de: "Tausend Dank, Karin!", weiter: null },
      { text: "Ur den dricker jag påtår!", de: "Daraus trink ich meine zweite Tasse!", weiter: null } ] },
    saljer: { sagt: "Allt möjligt! Men bäst är lådorna med gamla deckare. Tio kronor styck.", de: "Alles Mögliche! Aber am besten sind die Kisten mit alten Krimis. Zehn Kronen das Stück.", antworten: [
      { text: "Lådor med deckare? Jag kommer!", de: "Kisten voller Krimis? Ich komme!", weiter: null },
      { text: "Köp alla deckare åt mig!", de: "Kauf alle Krimis für mich!", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar från loppisdrottningen! /Karin", de: "Grüße von der Flohmarktkönigin! /Karin" } },

{ id: "sv-09", thema: "IKEA-Namen", monat: null,
  ord: { sv: "en poäng", de: "ein Punkt (im Spiel, im Quiz)", tipp: "„Du får en poäng!“ – „Du kriegst einen Punkt!“ Und ein IKEA-Sessel heißt so." },
  knoten: {
    start: { sagt: "Hej Rita! Visste du att IKEA-namn ofta är riktiga ord? Jag sitter i en Poäng – och poäng betyder Punkt.", de: "Hallo Rita! Wusstest du, dass IKEA-Namen oft echte Wörter sind? Ich sitz in einem Poäng – und „poäng“ heißt Punkt.", antworten: [
      { text: "Då får du en poäng!", de: "Dann kriegst du einen Punkt!", weiter: "poang" },
      { text: "Vad betyder Billy då?", de: "Und was heißt Billy?", weiter: "billy" } ] },
    poang: { sagt: "Tack! Och min soffa heter Klippan. Det är en stad – och klippa betyder Felsen.", de: "Danke! Und mein Sofa heißt Klippan. Das ist eine Stadt – und „klippa“ heißt Felsen.", antworten: [
      { text: "Sitter du skönt på en klippa?", de: "Sitzt du bequem auf einem Felsen?", weiter: "skont" },
      { text: "Har IKEA en möbel som heter Rita?", de: "Hat IKEA ein Möbel namens Rita?", weiter: "rita" } ] },
    billy: { sagt: "Billy är bara ett namn – efter en man som jobbade på IKEA.", de: "Billy ist einfach ein Name – nach einem Mann, der bei IKEA gearbeitet hat.", antworten: [
      { text: "Har IKEA en möbel som heter Rita?", de: "Hat IKEA ein Möbel namens Rita?", weiter: "rita" },
      { text: "Så tråkigt! Jag ville ha ett ord.", de: "Wie langweilig! Ich wollte ein Wort.", weiter: "ord" } ] },
    rita: { sagt: "Kanske inte. Men rita betyder zeichnen på svenska! Du är ett verb, Rita.", de: "Vielleicht nicht. Aber „rita“ heißt auf Schwedisch zeichnen! Du bist ein Verb, Rita.", antworten: [
      { text: "Ett verb! Det passar mig.", de: "Ein Verb! Das passt zu mir.", weiter: null },
      { text: "Då ritar jag en Billy-hylla.", de: "Dann zeichne ich ein Billy-Regal.", weiter: null } ] },
    skont: { sagt: "Mjukare än en klippa, lovar jag. Men den heter så.", de: "Weicher als ein Felsen, versprochen. Aber so heißt es halt.", antworten: [
      { text: "Svenskar är roliga.", de: "Schweden sind lustig.", weiter: null },
      { text: "Jag vill också ha en Klippan!", de: "Ich will auch ein Klippan!", weiter: null } ] },
    ord: { sagt: "Okej: Lack är ett bord. Och lack betyder – precis som på tyska – Lack.", de: "Okay: Lack ist ein Tisch. Und „lack“ heißt – genau wie auf Deutsch – Lack.", antworten: [
      { text: "Äntligen ett lätt ord!", de: "Endlich mal ein leichtes Wort!", weiter: null },
      { text: "Jag har ett Lack-bord!", de: "Ich hab einen Lack-Tisch!", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar från min Poäng! /Karin", de: "Grüße aus meinem Poäng! /Karin" } },

{ id: "sv-10", thema: "Gustav, der Volvo", monat: null,
  ord: { sv: "Det är ingen ko på isen", de: "Kein Grund zur Sorge (wörtlich: Es ist keine Kuh auf dem Eis)", tipp: "Ganz gelassen: „Ingen ko på isen!“ – das kriegen wir hin." },
  knoten: {
    start: { sagt: "Hej Rita! Min gamla Volvo fyller trettio i år. Han startar alltid – utom när det regnar.", de: "Hallo Rita! Mein alter Volvo wird dieses Jahr dreißig. Er springt immer an – außer wenn’s regnet.", antworten: [
      { text: "Det regnar ju alltid i Sverige!", de: "In Schweden regnet’s doch immer!", weiter: "regn" },
      { text: "Vad heter din Volvo?", de: "Wie heißt dein Volvo?", weiter: "namn" } ] },
    regn: { sagt: "Ja, men det är ingen ko på isen. Då går jag till fots.", de: "Ja, aber keine Sorge. Dann geh ich eben zu Fuß.", antworten: [
      { text: "En ko på isen? Var då?", de: "Eine Kuh auf dem Eis? Wo denn?", weiter: "ko" },
      { text: "Vet du vad Volvo betyder?", de: "Weißt du, was Volvo heißt?", weiter: "betyder" } ] },
    namn: { sagt: "Gustav. Han är röd, stark och lite envis. Som jag.", de: "Gustav. Er ist rot, stark und ein bisschen stur. Wie ich.", antworten: [
      { text: "Och som jag!", de: "Und wie ich!", weiter: "envis" },
      { text: "Vet du vad Volvo betyder?", de: "Weißt du, was Volvo heißt?", weiter: "betyder" } ] },
    ko: { sagt: "Ha! Det betyder: ingen fara. Hela uttrycket är: ingen ko på isen, så länge rumpan är på land.", de: "Ha! Das heißt: keine Gefahr. Ganz heißt es: keine Kuh auf dem Eis, solange der Hintern an Land ist.", antworten: [
      { text: "Då har jag lärt mig något idag.", de: "Dann hab ich heute was gelernt.", weiter: null },
      { text: "Så länge rumpan är på land!", de: "Solange der Hintern an Land ist!", weiter: null } ] },
    betyder: { sagt: "Jag rullar – på latin. Gustav rullar, men långsamt.", de: "„Ich rolle“ – auf Latein. Gustav rollt, aber langsam.", antworten: [
      { text: "Lagom snabbt, alltså!", de: "Also lagom schnell!", weiter: null },
      { text: "Jag rullar på elsparkcykel!", de: "Ich roll mit dem E-Roller!", weiter: null } ] },
    envis: { sagt: "Då är vi tre envisa. Ett bra team!", de: "Dann sind wir drei Sturköpfe. Ein gutes Team!", antworten: [
      { text: "Gustav kör, vi bestämmer!", de: "Gustav fährt, wir bestimmen!", weiter: null },
      { text: "Och Hühnchen är nummer fyra!", de: "Und Hühnchen ist Nummer vier!", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar från mig och Gustav! /Karin", de: "Grüße von mir und Gustav! /Karin" } },

{ id: "sv-11", thema: "Allemansrätten", monat: null,
  ord: { sv: "allemansrätten", de: "das Jedermannsrecht", tipp: "Wandern, pflücken, eine Nacht zelten – mit Rücksicht. Motto: „Inte störa, inte förstöra.“" },
  knoten: {
    start: { sagt: "Hej Rita! Idag plockade jag blåbär i skogen. Tack vare allemansrätten får man gå nästan överallt i naturen.", de: "Hallo Rita! Heute hab ich im Wald Blaubeeren gepflückt. Dank Jedermannsrecht darf man in der Natur fast überall hin.", antworten: [
      { text: "Får man tälta också?", de: "Darf man auch zelten?", weiter: "talta" },
      { text: "Får man plocka i din trädgård?", de: "Darf man auch in deinem Garten pflücken?", weiter: "tradgard" } ] },
    talta: { sagt: "Ja, en natt. Men inte precis framför någons hus.", de: "Ja, eine Nacht. Aber nicht direkt vor jemandes Haus.", antworten: [
      { text: "Jag tältar framför ditt hus!", de: "Ich zelte vor deinem Haus!", weiter: "framfor" },
      { text: "Jag sover hellre i en säng.", de: "Ich schlaf lieber in einem Bett.", weiter: "sang" } ] },
    tradgard: { sagt: "Nej! Trädgården räknas inte. Fast älgen tycker annorlunda.", de: "Nein! Der Garten zählt nicht. Auch wenn der Elch das anders sieht.", antworten: [
      { text: "Älgen har inte läst reglerna.", de: "Der Elch hat die Regeln nicht gelesen.", weiter: "regler" },
      { text: "Var finns de bästa blåbären?", de: "Wo gibt’s die besten Blaubeeren?", weiter: "hemlig" } ] },
    framfor: { sagt: "Då får du kaffe i tältet varje morgon. Det är Karinsrätten.", de: "Dann kriegst du jeden Morgen Kaffee ins Zelt. Das ist das Karinsrecht.", antworten: [
      { text: "Bästa rätten i Sverige!", de: "Das beste Recht in Schweden!", weiter: null },
      { text: "Och kanelbullar, tack.", de: "Und Zimtschnecken, bitte.", weiter: null } ] },
    sang: { sagt: "Klokt. Mitt gästrum har en säng och inga myggor.", de: "Klug. Mein Gästezimmer hat ein Bett und keine Mücken.", antworten: [
      { text: "Inga myggor? Då kommer jag!", de: "Keine Mücken? Dann komm ich!", weiter: null },
      { text: "Boka rummet åt mig i juni!", de: "Reservier mir das Zimmer im Juni!", weiter: null } ] },
    regler: { sagt: "Nej, och det tänker han inte göra heller.", de: "Nein, und das hat er auch nicht vor.", antworten: [
      { text: "Typiskt älgar!", de: "Typisch Elch!", weiter: null },
      { text: "Sätt upp en skylt!", de: "Stell ein Schild auf!", weiter: null } ] },
    hemlig: { sagt: "Det är hemligt! Sitt bästa blåbärsställe berättar man inte för någon.", de: "Geheim! Seine beste Blaubeerstelle verrät man niemandem.", antworten: [
      { text: "Inte ens för mig?", de: "Nicht mal mir?", weiter: null },
      { text: "Jag hittar det ändå!", de: "Ich find sie trotzdem!", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar med blå fingrar! /Karin", de: "Grüße mit blauen Fingern! /Karin" } },

{ id: "sv-12", thema: "Vier Wetter vor elf", monat: null,
  ord: { sv: "Det finns inget dåligt väder, bara dåliga kläder.", de: "Es gibt kein schlechtes Wetter, nur schlechte Kleidung.", tipp: "Lieblingsspruch aller Schweden – meistens im Regen gesagt." },
  knoten: {
    start: { sagt: "Hej Rita! Idag har vi haft sol, regn, hagel och sol igen. Och klockan är bara elva.", de: "Hallo Rita! Heute hatten wir Sonne, Regen, Hagel und wieder Sonne. Und es ist erst elf.", antworten: [
      { text: "Här i Spandau är det bara grått.", de: "Hier in Spandau ist es einfach nur grau.", weiter: "gratt" },
      { text: "Vad har du på dig då?", de: "Und was ziehst du da an?", weiter: "klader" } ] },
    gratt: { sagt: "Grått är inte så illa. Då kan man fika inne med gott samvete.", de: "Grau ist gar nicht so schlecht. Dann kann man mit gutem Gewissen drinnen Fika machen.", antworten: [
      { text: "Man kan fika i alla väder.", de: "Fika geht bei jedem Wetter.", weiter: "allt" },
      { text: "Hos dig är det i alla fall spännande.", de: "Bei dir ist’s wenigstens spannend.", weiter: "spannande" } ] },
    klader: { sagt: "Allt! Regnjacka, solglasögon och mössa. Det finns inget dåligt väder, bara dåliga kläder.", de: "Alles! Regenjacke, Sonnenbrille und Mütze. Es gibt kein schlechtes Wetter, nur schlechte Kleidung.", antworten: [
      { text: "Det säger alla svenskar!", de: "Das sagen alle Schweden!", weiter: "alla" },
      { text: "Och efter det: bastu?", de: "Und danach: Sauna?", weiter: "bastu" } ] },
    allt: { sagt: "Rätt! Du är nästan svensk nu.", de: "Richtig! Du bist schon fast Schwedin.", antworten: [
      { text: "Nästan? Jag är redan svensk!", de: "Fast? Ich bin längst Schwedin!", weiter: null },
      { text: "Då tar jag en kanelbulle.", de: "Dann nehm ich eine Zimtschnecke.", weiter: null } ] },
    spannande: { sagt: "Spännande, ja. Sotis gick ut i solen och kom hem i hagel. Nu pratar hon inte med mig.", de: "Spannend, ja. Sotis ist bei Sonne rausgegangen und im Hagel heimgekommen. Jetzt redet sie nicht mehr mit mir.", antworten: [
      { text: "Det är ju inte ditt fel!", de: "Das ist doch nicht deine Schuld!", weiter: null },
      { text: "Ge henne en bit ost.", de: "Gib ihr ein Stück Käse.", weiter: null } ] },
    alla: { sagt: "Ja, det är vår andra nationalsång.", de: "Ja, das ist unsere zweite Nationalhymne.", antworten: [
      { text: "Jag lär mig texten!", de: "Ich lerne den Text!", weiter: null },
      { text: "Och fika är nummer tre?", de: "Und Fika ist Nummer drei?", weiter: null } ] },
    bastu: { sagt: "Självklart! Bastu vid sjön och sedan ett dopp. Brrr – men skönt.", de: "Na klar! Sauna am See und dann einmal rein ins Wasser. Brrr – aber herrlich.", antworten: [
      { text: "Du är modig, Karin!", de: "Du bist mutig, Karin!", weiter: null },
      { text: "Jag tittar på från bryggan.", de: "Ich guck vom Steg aus zu.", weiter: null } ] }
  },
  schluss: { sv: "Blöta men glada hälsningar! /Karin", de: "Nasse, aber fröhliche Grüße! /Karin" } },

{ id: "sv-13", thema: "Karins Kanelbullar", monat: null,
  ord: { sv: "kardemumma", de: "Kardamom", tipp: "Das Geheimnis schwedischer Zimtschnecken: Kardamom im Teig." },
  knoten: {
    start: { sagt: "Hej Rita! Du ville ha mitt recept på kanelbullar. Hemligheten är kardemumma i degen!", de: "Hallo Rita! Du wolltest mein Zimtschnecken-Rezept. Das Geheimnis ist Kardamom im Teig!", antworten: [
      { text: "Hur mycket kardemumma?", de: "Wie viel Kardamom?", weiter: "hur" },
      { text: "Kan man inte köpa dem?", de: "Kann man die nicht einfach kaufen?", weiter: "kopa" } ] },
    hur: { sagt: "En tesked. Eller lagom – det betyder: lite mer än receptet säger.", de: "Einen Teelöffel. Oder lagom – das heißt: ein bisschen mehr, als im Rezept steht.", antworten: [
      { text: "Och smöret? Också lagom?", de: "Und die Butter? Auch lagom?", weiter: "smor" },
      { text: "Hur länge i ugnen?", de: "Wie lange in den Ofen?", weiter: "ugn" } ] },
    kopa: { sagt: "Rita! Det låtsas jag att jag inte hörde. Baka en gång själv, sedan pratar vi.", de: "Rita! Das hab ich jetzt mal überhört. Back einmal selbst, dann reden wir.", antworten: [
      { text: "Okej, jag bakar på lördag.", de: "Okay, am Samstag back ich.", weiter: "lordag" },
      { text: "Christiane kan baka åt mig!", de: "Christiane kann für mich backen!", weiter: "jane" } ] },
    smor: { sagt: "Nej. Med smör snålar man inte.", de: "Nein. Mit Butter wird nicht gespart.", antworten: [
      { text: "Det är en bra regel.", de: "Das ist eine gute Regel.", weiter: null },
      { text: "Det skriver jag i dagboken.", de: "Das schreib ich ins Tagebuch.", weiter: null } ] },
    ugn: { sagt: "Pensla med ägg, strö pärlsocker och in i ugnen: åtta minuter, 225 grader.", de: "Mit Ei bepinseln, Hagelzucker drauf und ab in den Ofen: acht Minuten, 225 Grad.", antworten: [
      { text: "Klart! Jag bakar på lördag.", de: "Alles klar! Am Samstag back ich.", weiter: null },
      { text: "Pärlsocker? Det måste jag hitta.", de: "Hagelzucker? Den muss ich auftreiben.", weiter: null } ] },
    lordag: { sagt: "Bra! Skicka en bild. Jag ger poäng från ett till tio.", de: "Gut! Schick ein Foto. Ich vergebe Punkte von eins bis zehn.", antworten: [
      { text: "Jag siktar på elva!", de: "Ich will die Elf!", weiter: null },
      { text: "Hühnchen smakar först.", de: "Hühnchen probiert zuerst.", weiter: null } ] },
    jane: { sagt: "Smart! Men då vill jag ha Christianes recept också.", de: "Clever! Aber dann will ich auch Christianes Rezept.", antworten: [
      { text: "Jag frågar henne på söndag.", de: "Ich frag sie am Sonntag.", weiter: null },
      { text: "Hennes recept är hemligt!", de: "Ihr Rezept ist geheim!", weiter: null } ] }
  },
  schluss: { sv: "Lycka till med degen! /Karin", de: "Viel Glück mit dem Teig! /Karin" } },

{ id: "sv-14", thema: "Rolig oder ruhig?", monat: null,
  ord: { sv: "rolig", de: "lustig, unterhaltsam (nicht: ruhig!)", tipp: "Ruhig heißt „lugn“. „Det var roligt!“ – „Das hat Spaß gemacht!“" },
  knoten: {
    start: { sagt: "Hej Rita! Hur var din helg? Var den lugn eller rolig?", de: "Hallo Rita! Wie war dein Wochenende? Ruhig oder lustig?", antworten: [
      { text: "Rolig eller lugn? Jag blandar ihop dem!", de: "Rolig oder lugn? Die verwechsle ich immer!", weiter: "fel" },
      { text: "Rolig! Christiane och jag spelade kort.", de: "Lustig! Christiane und ich haben Karten gespielt.", weiter: "kort" } ] },
    fel: { sagt: "Det gör alla tyskar! Rolig betyder lustig. Ruhig heter lugn på svenska.", de: "Das machen alle Deutschen! „Rolig“ heißt lustig. Ruhig heißt auf Schwedisch „lugn“.", antworten: [
      { text: "Då var den lugn. Jag läste hela dagen.", de: "Dann war es ruhig. Ich hab den ganzen Tag gelesen.", weiter: "lugn" },
      { text: "Lugn. Men boken var rolig!", de: "Ruhig. Aber das Buch war lustig!", weiter: "boken" } ] },
    kort: { sagt: "Vem vann? Jag gissar på dig.", de: "Wer hat gewonnen? Ich tippe auf dich.", antworten: [
      { text: "Självklart jag!", de: "Natürlich ich!", weiter: "vann" },
      { text: "Christiane. Jag tror att hon fuskar.", de: "Christiane. Ich glaube, sie schummelt.", weiter: "fusk" } ] },
    lugn: { sagt: "Låter skönt. Och en lugn helg kan ju också vara rolig.", de: "Klingt schön. Und ein ruhiges Wochenende kann ja auch lustig sein.", antworten: [
      { text: "Lugn och rolig – som jag!", de: "Ruhig und lustig – wie ich!", weiter: null },
      { text: "Tack för lektionen, Karin!", de: "Danke für die Nachhilfe, Karin!", weiter: null } ] },
    boken: { sagt: "Då var helgen både lugn och rolig. Perfekt!", de: "Dann war das Wochenende ruhig und lustig. Perfekt!", antworten: [
      { text: "Ja, och nu är jag på sidan 300!", de: "Ja, und jetzt bin ich auf Seite 300!", weiter: null },
      { text: "Lugn och rolig – som jag!", de: "Ruhig und lustig – wie ich!", weiter: null } ] },
    vann: { sagt: "Klart. Du har ett pokeransikte som Martin Beck.", de: "Klar. Du hast ein Pokerface wie Martin Beck.", antworten: [
      { text: "Och Christiane har inget alls!", de: "Und Christiane hat gar keins!", weiter: null },
      { text: "Nästa gång spelar vi tre.", de: "Nächstes Mal spielen wir zu dritt.", weiter: null } ] },
    fusk: { sagt: "Ugglor i mossen! Du får titta noga nästa gång.", de: "Da ist was faul! Nächstes Mal musst du genau hinsehen.", antworten: [
      { text: "Jag tar med kikaren.", de: "Ich bring das Fernglas mit.", weiter: null },
      { text: "Kanske fuskar jag också lite.", de: "Vielleicht schummel ich auch ein bisschen.", weiter: null } ] }
  },
  schluss: { sv: "Lugna och roliga hälsningar! /Karin", de: "Ruhige und lustige Grüße! /Karin" } },

{ id: "sv-15", thema: "Falsche Freunde", monat: null,
  ord: { sv: "gift", de: "verheiratet (und ja, auch: Gift)", tipp: "„Är du gift?“ heißt „Bist du verheiratet?“ – kein Grund zur Panik." },
  knoten: {
    start: { sagt: "Hej Rita! Min granne sa till en tysk turist: ”Jag har varit gift i fyrtio år.” Stackarn blev alldeles blek.", de: "Hallo Rita! Meine Nachbarin hat zu einem deutschen Touristen gesagt: „Ich bin seit vierzig Jahren gift.“ Der Arme wurde ganz blass.", antworten: [
      { text: "Ha! Har du fler falska vänner?", de: "Ha! Hast du noch mehr falsche Freunde?", weiter: "fler" },
      { text: "Det är ett farligt språk!", de: "Das ist eine gefährliche Sprache!", weiter: "farligt" } ] },
    fler: { sagt: "Massor! Semester betyder Urlaub. Och glass är Eis, inte Glas.", de: "Massenhaft! „Semester“ heißt Urlaub. Und „glass“ ist Eis, nicht Glas.", antworten: [
      { text: "Jag vill ha semester och glass!", de: "Ich will Urlaub und Eis!", weiter: "glass" },
      { text: "Ett till, snälla!", de: "Noch eins, bitte!", weiter: "slut" } ] },
    farligt: { sagt: "Bara lite. Om du beställer öl i Sverige, får du ingen olja – du får en öl!", de: "Nur ein bisschen. Wenn du in Schweden „öl“ bestellst, kriegst du kein Öl – sondern ein Bier!", antworten: [
      { text: "Det är ju en bra falsk vän!", de: "Das ist ja mal ein guter falscher Freund!", weiter: "bra" },
      { text: "Ett till, snälla!", de: "Noch eins, bitte!", weiter: "slut" } ] },
    glass: { sagt: "Kom i juli! Då har vi båda.", de: "Komm im Juli! Dann gibt’s beides.", antworten: [
      { text: "Jag packar redan!", de: "Ich pack schon!", weiter: null },
      { text: "Två kulor, tack!", de: "Zwei Kugeln, bitte!", weiter: null } ] },
    slut: { sagt: "Okej, ett sista: en rock är en Mantel. Så om en svensk herre har rock på sig, är allt i ordning.", de: "Okay, ein letzter: „rock“ ist ein Mantel. Wenn ein schwedischer Herr also „rock“ trägt, ist alles in Ordnung.", antworten: [
      { text: "Puh, tur att jag frågade!", de: "Puh, gut, dass ich gefragt hab!", weiter: null },
      { text: "Det skriver jag på listan.", de: "Das kommt auf meine Liste.", weiter: null } ] },
    bra: { sagt: "Den bästa! Skål, Rita.", de: "Der beste! Prost, Rita.", antworten: [
      { text: "Skål, Karin!", de: "Prost, Karin!", weiter: null },
      { text: "Jag dricker hellre kaffe.", de: "Ich trink lieber Kaffee.", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar från en äkta vän! /Karin", de: "Grüße von einer echten Freundin! /Karin" } },

{ id: "sv-16", thema: "Lagom", monat: null,
  ord: { sv: "lagom", de: "genau richtig – nicht zu viel, nicht zu wenig", tipp: "Kaum zu übersetzen. In Schweden sagt man: „Lagom är bäst.“" },
  knoten: {
    start: { sagt: "Hej Rita! Grannen frågade hur mycket socker jag ville ha i kaffet. Jag sa bara: lagom – och han förstod precis.", de: "Hallo Rita! Mein Nachbar hat gefragt, wie viel Zucker ich in den Kaffee will. Ich hab nur gesagt: lagom – und er hat sofort verstanden.", antworten: [
      { text: "Men hur mycket är lagom?", de: "Aber wie viel ist lagom?", weiter: "hur" },
      { text: "I Spandau säger vi: ordentligt!", de: "In Spandau sagen wir: ordentlich!", weiter: "ordentligt" } ] },
    hur: { sagt: "Det vet ingen. Men alla vet när det inte är lagom.", de: "Das weiß keiner. Aber jeder merkt, wenn’s nicht lagom ist.", antworten: [
      { text: "Som mina listor – de är aldrig lagom.", de: "Wie meine Listen – die sind nie lagom.", weiter: "lista" },
      { text: "Är jag lagom, Karin?", de: "Bin ich lagom, Karin?", weiter: "ar" } ] },
    ordentligt: { sagt: "Ordentligt! Det låter väldigt tyskt. Och lite mer än lagom, va?", de: "Ordentlich! Das klingt sehr deutsch. Und ein bisschen mehr als lagom, oder?", antworten: [
      { text: "Mycket mer! Och med grädde.", de: "Viel mehr! Und mit Sahne.", weiter: "gradde" },
      { text: "Är jag lagom, Karin?", de: "Bin ich lagom, Karin?", weiter: "ar" } ] },
    lista: { sagt: "En lista ska vara lång. Det är regel nummer ett.", de: "Eine Liste muss lang sein. Das ist Regel Nummer eins.", antworten: [
      { text: "Då gör jag allt rätt!", de: "Dann mach ich alles richtig!", weiter: null },
      { text: "Det skriver jag upp!", de: "Das schreib ich mir auf!", weiter: null } ] },
    ar: { sagt: "Nej. Du är mer än lagom – och det är bra.", de: "Nein. Du bist mehr als lagom – und das ist gut so.", antworten: [
      { text: "Det vet jag!", de: "Weiß ich doch!", weiter: null },
      { text: "Tack! Du också, Karin.", de: "Danke! Du auch, Karin.", weiter: null } ] },
    gradde: { sagt: "Ha! Nästa gång säger jag: Rita-mycket.", de: "Ha! Nächstes Mal sag ich: Rita-viel.", antworten: [
      { text: "Det blir ett nytt svenskt ord!", de: "Das wird ein neues schwedisches Wort!", weiter: null },
      { text: "Rita-mycket är perfekt.", de: "Rita-viel ist perfekt.", weiter: null } ] }
  },
  schluss: { sv: "Lagom många kramar! /Karin", de: "Lagom viele Umarmungen! /Karin" } },

{ id: "sv-17", thema: "Astrid Lindgren und Vimmerby", monat: null,
  ord: { sv: "hyss", de: "Unfug, Streiche", tipp: "„Emil hittar på hyss“ – Emil heckt Streiche aus." },
  knoten: {
    start: { sagt: "Hej Rita! Idag gick jag förbi Astrid Lindgrens barndomshem på Näs. Här i Vimmerby är alla lite Emil och lite Pippi.", de: "Hallo Rita! Heute bin ich an Astrid Lindgrens Elternhaus in Näs vorbeigegangen. Hier in Vimmerby sind alle ein bisschen Michel und ein bisschen Pippi.", antworten: [
      { text: "Är du mer Emil eller Pippi?", de: "Bist du mehr Michel oder Pippi?", weiter: "vem" },
      { text: "Jag läste Pippi på tyska som barn.", de: "Ich hab Pippi als Kind auf Deutsch gelesen.", weiter: "tyska" } ] },
    vem: { sagt: "Emil. Jag hittar på hyss, och sedan får jag sitta i snickerboa. Fast min snickerboa är köket.", de: "Michel. Ich hecke Streiche aus und muss dann in den Tischlerschuppen. Nur ist mein Tischlerschuppen die Küche.", antworten: [
      { text: "Snickerboa? Vad är det?", de: "„Snickerboa“? Was ist das?", weiter: "boa" },
      { text: "Och vad täljer du där?", de: "Und was schnitzt du da?", weiter: "talja" } ] },
    tyska: { sagt: "Pippi Langstrumpf! Det låter så strängt på tyska.", de: "Pippi Langstrumpf! Das klingt auf Deutsch so streng.", antworten: [
      { text: "Långstrump låter mjukare, ja.", de: "Långstrump klingt weicher, ja.", weiter: "mjuk" },
      { text: "Ville du också ha en häst?", de: "Wolltest du auch ein Pferd?", weiter: "hast" } ] },
    boa: { sagt: "Där satt Emil när han hade gjort hyss. Han täljde trägubbar.", de: "Da saß Michel, wenn er was angestellt hatte. Er hat Holzmännchen geschnitzt.", antworten: [
      { text: "Hühnchen är min lergubbe!", de: "Hühnchen ist mein Tonmännchen!", weiter: null },
      { text: "Jag behöver också en snickerboa.", de: "Ich brauch auch einen Tischlerschuppen.", weiter: null } ] },
    talja: { sagt: "Inga trägubbar. Jag bakar kanelbullar i stället – det är mitt straff.", de: "Keine Holzmännchen. Ich backe stattdessen Zimtschnecken – das ist meine Strafe.", antworten: [
      { text: "Vilket gott straff!", de: "Was für eine leckere Strafe!", weiter: null },
      { text: "Då hittar jag också på hyss!", de: "Dann heck ich auch Streiche aus!", weiter: null } ] },
    mjuk: { sagt: "Precis. Och i Vimmerby finns Villa Villekulla – där kan du gå in!", de: "Genau. Und in Vimmerby steht die Villa Kunterbunt – da kannst du rein!", antworten: [
      { text: "Jag kommer och lyfter hästen!", de: "Ich komm und heb das Pferd hoch!", weiter: null },
      { text: "Då kommer jag på besök!", de: "Dann komm ich zu Besuch!", weiter: null } ] },
    hast: { sagt: "Klart! Men jag fick nöja mig med en katt. Sotis är min Lilla Gubben.", de: "Na klar! Aber ich musste mich mit einer Katze begnügen. Sotis ist mein Kleiner Onkel.", antworten: [
      { text: "En häst på verandan är lite mycket.", de: "Ein Pferd auf der Veranda ist etwas viel.", weiter: null },
      { text: "Sotis bestämmer mer än en häst.", de: "Sotis bestimmt mehr als ein Pferd.", weiter: null } ] }
  },
  schluss: { sv: "Busiga hälsningar från Vimmerby! /Karin", de: "Freche Grüße aus Vimmerby! /Karin" } },

{ id: "sv-18", thema: "Harry Potter auf Schwedisch", monat: null,
  ord: { sv: "en mugglare", de: "ein Muggel", tipp: "Mehrzahl auch: „mugglare“. Hogwarts bleibt auf Schwedisch Hogwarts." },
  knoten: {
    start: { sagt: "Hej Rita! Läser du fortfarande Harry Potter? På svenska heter bok fyra Harry Potter och den flammande bägaren.", de: "Hallo Rita! Liest du noch Harry Potter? Auf Schwedisch heißt Band vier „Harry Potter och den flammande bägaren“.", antworten: [
      { text: "Ja! Vad betyder bägaren?", de: "Ja! Was heißt „bägaren“?", weiter: "bagare" },
      { text: "Ja! Är du en mugglare, Karin?", de: "Ja! Bist du ein Muggel, Karin?", weiter: "muggel" } ] },
    bagare: { sagt: "En bägare är en stor kopp, nästan en pokal. Inte en bagare – han bakar bröd!", de: "„Bägare“ ist ein großer Becher, fast ein Pokal. Nicht „bagare“ – der backt Brot!", antworten: [
      { text: "Ha! Den flammande bagaren – bra bok!", de: "Ha! Der flammende Bäcker – gutes Buch!", weiter: "bok" },
      { text: "Har du också läst den?", de: "Hast du das auch gelesen?", weiter: "ocksa" } ] },
    muggel: { sagt: "Ja, en mugglare med katt. Men Sotis är nog en häxa.", de: "Ja, ein Muggel mit Katze. Aber Sotis ist bestimmt eine Hexe.", antworten: [
      { text: "Och Hühnchen kan säkert trolla.", de: "Und Hühnchen kann bestimmt zaubern.", weiter: "trolla" },
      { text: "Har du också läst boken?", de: "Hast du das Buch auch gelesen?", weiter: "ocksa" } ] },
    bok: { sagt: "Ja! Om en trollkarl som bränner alla sina kanelbullar.", de: "Ja! Über einen Zauberer, dem alle Zimtschnecken anbrennen.", antworten: [
      { text: "Den köper jag direkt!", de: "Das kauf ich sofort!", weiter: null },
      { text: "Skriv den, Karin!", de: "Schreib es, Karin!", weiter: null } ] },
    ocksa: { sagt: "Ja, två gånger. Men jag säger inget om slutet – jag lovar!", de: "Ja, zweimal. Aber vom Ende verrate ich nichts – versprochen!", antworten: [
      { text: "Tack! Jag har bara kommit till sidan 200.", de: "Danke! Ich bin erst auf Seite 200.", weiter: null },
      { text: "Inte ett ord, Karin!", de: "Kein Wort, Karin!", weiter: null } ] },
    trolla: { sagt: "Säkert. Fråga om Hühnchen kan trolla fram kaffe.", de: "Bestimmt. Frag Hühnchen, ob es Kaffee herzaubern kann.", antworten: [
      { text: "Hühnchen försöker varje morgon.", de: "Hühnchen versucht’s jeden Morgen.", weiter: null },
      { text: "Det kan bara Christiane.", de: "Das kann nur Christiane.", weiter: null } ] }
  },
  schluss: { sv: "Magiska hälsningar från en mugglare! /Karin", de: "Magische Grüße von einem Muggel! /Karin" } },

{ id: "sv-19", thema: "Grüße an Hühnchen", monat: null,
  ord: { sv: "Hälsa … från mig!", de: "Grüß … von mir!", tipp: "„Hälsa Hühnchen från mig!“ – und schon ist der Gruß unterwegs." },
  knoten: {
    start: { sagt: "Hej Rita! Hur mår Hühnchen? Håller Hühnchen fortfarande koll på Spandau från fönstret?", de: "Hallo Rita! Wie geht’s Hühnchen? Behält Hühnchen Spandau immer noch vom Fenster aus im Blick?", antworten: [
      { text: "Ja, Hühnchen ser allt!", de: "Ja, Hühnchen sieht alles!", weiter: "ser" },
      { text: "Hühnchen vill lära sig svenska.", de: "Hühnchen will Schwedisch lernen.", weiter: "svenska" } ] },
    ser: { sagt: "Bra. En vakt i fönstret är guld värd.", de: "Gut. Eine Wache am Fenster ist Gold wert.", antworten: [
      { text: "Hühnchen löser alla fall.", de: "Hühnchen löst jeden Fall.", weiter: "fall" },
      { text: "Hühnchen hälsar till Sotis!", de: "Hühnchen lässt Sotis grüßen!", weiter: "sotis" } ] },
    svenska: { sagt: "Toppen! Första ordet: kyckling. Det betyder Hühnchen.", de: "Super! Erstes Wort: „kyckling“. Das heißt Hühnchen.", antworten: [
      { text: "Hühnchen säger: tack, Karin!", de: "Hühnchen sagt: Danke, Karin!", weiter: "tack" },
      { text: "Hühnchen hälsar till Sotis!", de: "Hühnchen lässt Sotis grüßen!", weiter: "sotis" } ] },
    fall: { sagt: "Och utan att lämna fönsterbrädan. Det kallar jag talang.", de: "Und ohne die Fensterbank zu verlassen. Das nenn ich Talent.", antworten: [
      { text: "Hühnchen är av lera. Alltid lugn.", de: "Hühnchen ist aus Ton. Immer gelassen.", weiter: null },
      { text: "Och Hühnchen vill inte ha någon lön.", de: "Und Gehalt will Hühnchen auch keins.", weiter: null } ] },
    sotis: { sagt: "Sotis säger mjau tillbaka. Fast hon undrar nog om man kan äta Hühnchen.", de: "Sotis sagt miau zurück. Wobei sie sich wohl fragt, ob man Hühnchen fressen kann.", antworten: [
      { text: "Säg att Hühnchen är av lera!", de: "Sag ihr, Hühnchen ist aus Ton!", weiter: null },
      { text: "Mjau från Spandau!", de: "Miau aus Spandau!", weiter: null } ] },
    tack: { sagt: "Varsågod, lilla kyckling! Vi hörs i nästa brev.", de: "Gern geschehen, kleines Hühnchen! Bis zum nächsten Brief.", antworten: [
      { text: "Hühnchen bugar.", de: "Hühnchen verbeugt sich.", weiter: null },
      { text: "Kyckling – det hamnar på listan!", de: "„Kyckling“ – das kommt auf die Liste!", weiter: null } ] }
  },
  schluss: { sv: "Hälsa Hühnchen från mig! /Karin", de: "Grüß Hühnchen von mir! /Karin" } },

{ id: "sv-20", thema: "Christianes Sonntagsessen", monat: null,
  ord: { sv: "middag", de: "Abendessen, Hauptmahlzeit (nicht: Mittag!)", tipp: "Mittagessen heißt „lunch“. „Söndagsmiddag“ ist das große Sonntagsessen." },
  knoten: {
    start: { sagt: "Hej Rita! Lagar Christiane söndagsmiddag igen? Vad blir det den här gången?", de: "Hallo Rita! Kocht Christiane am Sonntag wieder? Was gibt’s diesmal?", antworten: [
      { text: "Kåldolmar, som i Sverige!", de: "Kohlrouladen, wie in Schweden!", weiter: "kal" },
      { text: "Hemligt! Christiane säger aldrig något.", de: "Geheim! Christiane verrät nie was.", weiter: "hemligt" } ] },
    kal: { sagt: "Kåldolmar! Med lingon? Annars är det inte svenskt.", de: "Kohlrouladen! Mit Preiselbeeren? Sonst ist es nicht schwedisch.", antworten: [
      { text: "Christiane har lingon från IKEA.", de: "Christiane hat Preiselbeeren von IKEA.", weiter: "ikea" },
      { text: "Lingon på allt? Även i kaffet?", de: "Preiselbeeren auf alles? Auch in den Kaffee?", weiter: "allt" } ] },
    hemligt: { sagt: "Som i en riktig deckare! Då får vi gissa.", de: "Wie in einem echten Krimi! Dann müssen wir raten.", antworten: [
      { text: "Jag gissar på soppa.", de: "Ich tippe auf Suppe.", weiter: "gissa" },
      { text: "Jag kikar i hennes kylskåp.", de: "Ich guck in ihren Kühlschrank.", weiter: "kyl" } ] },
    ikea: { sagt: "Perfekt. Då är söndagsmiddagen nästan svensk.", de: "Perfekt. Dann ist das Sonntagsessen fast schwedisch.", antworten: [
      { text: "Nästan svensk och helt god.", de: "Fast schwedisch und total lecker.", weiter: null },
      { text: "Jag sparar en kåldolme åt dig.", de: "Ich heb dir eine Kohlroulade auf.", weiter: null } ] },
    allt: { sagt: "Nej, nej. Där går gränsen – även för en svensk.", de: "Nein, nein. Da ist Schluss – sogar für eine Schwedin.", antworten: [
      { text: "Bra att veta!", de: "Gut zu wissen!", weiter: null },
      { text: "Det säger jag till Christiane.", de: "Das sag ich Christiane.", weiter: null } ] },
    gissa: { sagt: "Jag gissar på något med potatis. Det blir nästan alltid potatis.", de: "Ich tippe auf irgendwas mit Kartoffeln. Kartoffeln gibt’s fast immer.", antworten: [
      { text: "Ha! Du känner Christiane bättre än jag.", de: "Ha! Du kennst Christiane besser als ich.", weiter: null },
      { text: "Jag hör av mig efter söndag!", de: "Ich melde mich nach Sonntag!", weiter: null } ] },
    kyl: { sagt: "Ha! Kommissarie Rita på hemligt uppdrag. Rapportera i nästa brev!", de: "Ha! Kommissarin Rita im Geheimeinsatz. Bericht im nächsten Brief!", antworten: [
      { text: "Rapporten blir lång!", de: "Der Bericht wird lang!", weiter: null },
      { text: "Uppdraget är redan klart.", de: "Auftrag schon erledigt.", weiter: null } ] }
  },
  schluss: { sv: "Hälsa Christiane och smaklig måltid! /Karin", de: "Grüß Christiane und guten Appetit! /Karin" } },

/* ==================== SAISONAL ==================== */

{ id: "sv-21", thema: "Lucia", monat: [12],
  ord: { sv: "en lussekatt", de: "ein Safranbrötchen zum Luciafest", tipp: "Die gelbe Farbe kommt vom Safran (saffran) – mit einer Katze hat es nichts zu tun." },
  knoten: {
    start: { sagt: "Hej Rita! Den 13 december är det Lucia. Kören sjunger i kyrkan och alla äter lussekatter.", de: "Hallo Rita! Am 13. Dezember ist Lucia. Der Chor singt in der Kirche und alle essen Safranbrötchen.", antworten: [
      { text: "Har du ljus i håret?", de: "Trägst du Kerzen im Haar?", weiter: "ljus" },
      { text: "Vad är en lussekatt?", de: "Was ist eine „lussekatt“?", weiter: "katt" } ] },
    ljus: { sagt: "Nej tack! Mina ljus står på bordet. Det är säkrare för håret.", de: "Nein danke! Meine Kerzen stehen auf dem Tisch. Das ist sicherer fürs Haar.", antworten: [
      { text: "Sjunger du med?", de: "Singst du mit?", weiter: "sjunga" },
      { text: "Vad är en lussekatt?", de: "Was ist eine „lussekatt“?", weiter: "katt" } ] },
    katt: { sagt: "En gul bulle med saffran, formad som ett S. Ingen katt alls!", de: "Ein gelbes Brötchen mit Safran, geformt wie ein S. Gar keine Katze!", antworten: [
      { text: "Sotis blir glad att höra det.", de: "Sotis wird sich freuen, das zu hören.", weiter: "sotis" },
      { text: "Skicka receptet, tack!", de: "Schick mir das Rezept, bitte!", weiter: "recept" } ] },
    sjunga: { sagt: "Bara i köket. Sotis går ut när jag börjar.", de: "Nur in der Küche. Sotis geht raus, wenn ich anfange.", antworten: [
      { text: "Sotis har ingen musiksmak.", de: "Sotis hat keinen Musikgeschmack.", weiter: null },
      { text: "Jag sjunger med i Spandau!", de: "Ich sing in Spandau mit!", weiter: null } ] },
    sotis: { sagt: "Hon är lättad. Hon vill vara den enda katten här.", de: "Sie ist erleichtert. Sie will hier die einzige Katze sein.", antworten: [
      { text: "En katt är lagom.", de: "Eine Katze ist lagom.", weiter: null },
      { text: "Glad Lucia, Sotis!", de: "Schönes Luciafest, Sotis!", weiter: null } ] },
    recept: { sagt: "Det kommer! Och glöm inte russinen.", de: "Kommt! Und vergiss die Rosinen nicht.", antworten: [
      { text: "Jag bakar dem med Christiane.", de: "Ich back sie mit Christiane.", weiter: null },
      { text: "Russin? Det skriver jag upp.", de: "Rosinen? Schreib ich mir auf.", weiter: null } ] }
  },
  schluss: { sv: "Glad Lucia! /Karin", de: "Schönes Luciafest! /Karin" } },

{ id: "sv-22", thema: "Jul in Vimmerby", monat: [12],
  ord: { sv: "julbord", de: "weihnachtliches Buffet", tipp: "Mit Hering, Schinken, Köttbullar und „Janssons frestelse“ (Kartoffel-Sprotten-Auflauf)." },
  knoten: {
    start: { sagt: "Hej Rita! På julafton klockan tre tittar hela Sverige på Kalle Anka på tv. Jag också!", de: "Hallo Rita! An Heiligabend um drei schaut ganz Schweden Donald Duck im Fernsehen. Ich auch!", antworten: [
      { text: "Kalle Anka? På riktigt?", de: "Donald Duck? Im Ernst?", weiter: "riktigt" },
      { text: "Och vad äter du på julafton?", de: "Und was isst du an Heiligabend?", weiter: "julbord" } ] },
    riktigt: { sagt: "På riktigt! I över sextio år. Ingen ringer mellan tre och fyra.", de: "Im Ernst! Seit über sechzig Jahren. Zwischen drei und vier ruft keiner an.", antworten: [
      { text: "Då ringer jag klockan fem.", de: "Dann ruf ich um fünf an.", weiter: "fem" },
      { text: "Och vad äter du på julafton?", de: "Und was isst du an Heiligabend?", weiter: "julbord" } ] },
    julbord: { sagt: "Julbord! Sill, skinka, köttbullar och Janssons frestelse. Och sedan ris à la Malta.", de: "Julbord! Hering, Schinken, Fleischbällchen und Janssons Versuchung. Und danach Milchreis mit Sahne.", antworten: [
      { text: "Janssons frestelse? Vem är Jansson?", de: "Janssons Versuchung? Wer ist Jansson?", weiter: "jansson" },
      { text: "Det är för mycket för en dag!", de: "Das ist zu viel für einen Tag!", weiter: "mycket" } ] },
    fem: { sagt: "Perfekt. Då är Kalle Anka slut och jag är på bra humör.", de: "Perfekt. Dann ist Donald Duck vorbei und ich bin gut gelaunt.", antworten: [
      { text: "Jag ringer klockan fem prick!", de: "Ich ruf Punkt fünf an!", weiter: null },
      { text: "God jul, Karin!", de: "Frohe Weihnachten, Karin!", weiter: null } ] },
    jansson: { sagt: "Ingen vet säkert. Det sägs att det var en operasångare.", de: "Das weiß keiner genau. Es heißt, es war ein Opernsänger.", antworten: [
      { text: "Då gillar Wallander den säkert!", de: "Dann mag Wallander den bestimmt!", weiter: null },
      { text: "God jul till dig och Sotis!", de: "Frohe Weihnachten dir und Sotis!", weiter: null } ] },
    mycket: { sagt: "Julbord ska inte vara lagom. Det är hela poängen.", de: "Julbord soll nicht lagom sein. Das ist ja der Witz daran.", antworten: [
      { text: "Då gör jag ett undantag.", de: "Dann mach ich eine Ausnahme.", weiter: null },
      { text: "God jul och smaklig måltid!", de: "Frohe Weihnachten und guten Appetit!", weiter: null } ] }
  },
  schluss: { sv: "God jul och en stor kram! /Karin", de: "Frohe Weihnachten und eine dicke Umarmung! /Karin" } },

{ id: "sv-23", thema: "Semla am Fettisdagen", monat: [2],
  ord: { sv: "fettisdagen", de: "Fastnachtsdienstag (der Semla-Tag)", tipp: "„Fett“ + „tisdag“ (Dienstag). Mehrzahl von „semla“: „semlor“." },
  knoten: {
    start: { sagt: "Hej Rita! Idag är det fettisdagen. Jag har redan ätit två semlor – och klockan är bara tio.", de: "Hallo Rita! Heute ist Fettisdagen. Ich hab schon zwei Semlor gegessen – und es ist erst zehn.", antworten: [
      { text: "Vad är en semla?", de: "Was ist eine Semla?", weiter: "vad" },
      { text: "Två? Det är inte lagom!", de: "Zwei? Das ist nicht lagom!", weiter: "lagom" } ] },
    vad: { sagt: "En vetebulle med mandelmassa och vispgrädde. Och florsocker på locket.", de: "Ein Hefebrötchen mit Mandelmasse und Schlagsahne. Und Puderzucker auf dem Deckel.", antworten: [
      { text: "Det låter som en dröm!", de: "Das klingt traumhaft!", weiter: "drom" },
      { text: "Hur äter man den utan att kladda?", de: "Wie isst man die, ohne zu kleckern?", weiter: "kladda" } ] },
    lagom: { sagt: "På fettisdagen är två semlor lagom. Tre är festligt.", de: "Am Fettisdagen sind zwei Semlor lagom. Drei sind festlich.", antworten: [
      { text: "Då blir det festligt för mig!", de: "Dann wird’s bei mir festlich!", weiter: "fest" },
      { text: "Hur äter man den utan att kladda?", de: "Wie isst man die, ohne zu kleckern?", weiter: "kladda" } ] },
    drom: { sagt: "Kom till Vimmerby nästa februari! Jag sparar en semla med ditt namn på.", de: "Komm nächsten Februar nach Vimmerby! Ich leg dir eine Semla mit deinem Namen zurück.", antworten: [
      { text: "Jag bokar biljetten!", de: "Ich buch die Fahrkarte!", weiter: null },
      { text: "Ät inte upp den!", de: "Iss sie bloß nicht auf!", weiter: null } ] },
    kladda: { sagt: "Det går inte. Grädde på näsan hör till traditionen.", de: "Geht nicht. Sahne auf der Nase gehört zur Tradition.", antworten: [
      { text: "Då är jag redo!", de: "Dann bin ich bereit!", weiter: null },
      { text: "Sotis slickar bort den, va?", de: "Sotis leckt sie weg, oder?", weiter: null } ] },
    fest: { sagt: "Bra! Vi firar tillsammans – du i Spandau, jag här.", de: "Gut! Wir feiern zusammen – du in Spandau, ich hier.", antworten: [
      { text: "Skål med semla!", de: "Prost mit Semla!", weiter: null },
      { text: "Christiane bakar några åt mig.", de: "Christiane backt mir welche.", weiter: null } ] }
  },
  schluss: { sv: "Gräddiga hälsningar! /Karin", de: "Sahnige Grüße! /Karin" } },

{ id: "sv-24", thema: "Valborg", monat: [4],
  ord: { sv: "valborgsbrasa", de: "Walpurgisfeuer", tipp: "Am 30. April brennen in ganz Schweden Feuer, und Chöre „sjunger in våren“ – singen den Frühling herbei." },
  knoten: {
    start: { sagt: "Hej Rita! Ikväll är det Valborg. Vi tänder en stor brasa vid sjön och sjunger in våren.", de: "Hallo Rita! Heute Abend ist Valborg. Wir zünden am See ein großes Feuer an und singen den Frühling herbei.", antworten: [
      { text: "Kommer våren om ni sjunger?", de: "Kommt der Frühling, wenn ihr singt?", weiter: "sjunga" },
      { text: "I Tyskland dansar häxorna i natt!", de: "In Deutschland tanzen heute Nacht die Hexen!", weiter: "haxor" } ] },
    sjunga: { sagt: "Inte alltid. Förra året sjöng vi i snö.", de: "Nicht immer. Letztes Jahr haben wir im Schnee gesungen.", antworten: [
      { text: "Sjung högre i år!", de: "Singt dieses Jahr lauter!", weiter: "hogre" },
      { text: "Ta på dig mössan!", de: "Setz die Mütze auf!", weiter: "mossa" } ] },
    haxor: { sagt: "Häxor? Våra häxor flyger till Blåkulla redan i påsk.", de: "Hexen? Unsere fliegen schon zu Ostern zum Blocksberg.", antworten: [
      { text: "Då är de hos oss nu!", de: "Dann sind die jetzt bei uns!", weiter: "hos" },
      { text: "Ta på dig mössan vid brasan!", de: "Setz am Feuer die Mütze auf!", weiter: "mossa" } ] },
    hogre: { sagt: "Okej, jag sjunger för två. Då hör våren mig kanske ända till Spandau.", de: "Okay, ich sing für zwei. Dann hört mich der Frühling vielleicht bis nach Spandau.", antworten: [
      { text: "Jag öppnar fönstret!", de: "Ich mach das Fenster auf!", weiter: null },
      { text: "Trevlig Valborg, Karin!", de: "Schöne Walpurgisnacht, Karin!", weiter: null } ] },
    mossa: { sagt: "Mössa och vantar, ja. Svensk vår kan vara kall.", de: "Mütze und Handschuhe, ja. Der schwedische Frühling kann kalt sein.", antworten: [
      { text: "Med kaffe i termosen, hoppas jag.", de: "Mit Kaffee in der Thermoskanne, hoffe ich.", weiter: null },
      { text: "Trevlig Valborg, Karin!", de: "Schöne Walpurgisnacht, Karin!", weiter: null } ] },
    hos: { sagt: "Hälsa dem! Och säg att de ska ta med sig vårvädret.", de: "Grüß sie! Und sag ihnen, sie sollen das Frühlingswetter mitbringen.", antworten: [
      { text: "Jag säger till dem!", de: "Ich sag’s ihnen!", weiter: null },
      { text: "Trevlig Valborg, Karin!", de: "Schöne Walpurgisnacht, Karin!", weiter: null } ] }
  },
  schluss: { sv: "Varma hälsningar från brasan! /Karin", de: "Warme Grüße vom Feuer! /Karin" } },

{ id: "sv-25", thema: "Midsommar", monat: [6],
  ord: { sv: "Små grodorna", de: "„Die kleinen Frösche“ – das Midsommar-Tanzlied", tipp: "Man hüpft wie ein Frosch um die Midsommarstange. Ja, auch die Erwachsenen." },
  knoten: {
    start: { sagt: "Hej Rita! På fredag är det midsommar. Vi dansar runt stången och hoppar som små grodor.", de: "Hallo Rita! Am Freitag ist Midsommar. Wir tanzen um die Stange und hüpfen wie kleine Frösche.", antworten: [
      { text: "Som grodor? Du skojar!", de: "Wie Frösche? Du machst Witze!", weiter: "skojar" },
      { text: "Vad äter ni på midsommar?", de: "Was esst ihr an Midsommar?", weiter: "mat" } ] },
    skojar: { sagt: "Inte alls! Sången heter Små grodorna. Hela Sverige hoppar.", de: "Gar nicht! Das Lied heißt „Små grodorna“. Ganz Schweden hüpft.", antworten: [
      { text: "Jag hoppar med i Spandau!", de: "Ich hüpf in Spandau mit!", weiter: "hoppa" },
      { text: "Hoppar Sotis också?", de: "Hüpft Sotis auch?", weiter: "sotis" } ] },
    mat: { sagt: "Sill, färskpotatis, gräddfil och jordgubbar. Och en liten nubbe.", de: "Hering, neue Kartoffeln, Sauerrahm und Erdbeeren. Und ein kleines Schnäpschen.", antworten: [
      { text: "Nubbe? Vad är det?", de: "„Nubbe“? Was ist das?", weiter: "nubbe" },
      { text: "Jordgubbar ja, sill nej tack.", de: "Erdbeeren ja, Hering nein danke.", weiter: "sill" } ] },
    hoppa: { sagt: "Bra! Ta med Christiane och Micha. Micha får vara stången.", de: "Gut! Nimm Christiane und Micha mit. Micha darf die Stange sein.", antworten: [
      { text: "Micha står gärna still.", de: "Micha steht gern still.", weiter: null },
      { text: "Glad midsommar, Karin!", de: "Schönen Midsommar, Karin!", weiter: null } ] },
    sotis: { sagt: "Nej, hon tittar från verandan och tycker att vi är galna.", de: "Nein, sie guckt von der Veranda zu und findet, wir spinnen.", antworten: [
      { text: "Kanske har Sotis rätt.", de: "Vielleicht hat Sotis recht.", weiter: null },
      { text: "Glad midsommar, Karin!", de: "Schönen Midsommar, Karin!", weiter: null } ] },
    nubbe: { sagt: "En liten snaps. Först sjunger man en visa, sedan säger man skål.", de: "Ein kleiner Schnaps. Erst singt man ein Lied, dann sagt man Prost.", antworten: [
      { text: "Jag sjunger gärna. Skål!", de: "Ich sing gern. Prost!", weiter: null },
      { text: "Glad midsommar, Karin!", de: "Schönen Midsommar, Karin!", weiter: null } ] },
    sill: { sagt: "Okej, du får två portioner jordgubbar. Jag tar din sill.", de: "Okay, du kriegst zwei Portionen Erdbeeren. Ich nehm deinen Hering.", antworten: [
      { text: "Ett perfekt byte!", de: "Ein perfekter Tausch!", weiter: null },
      { text: "Glad midsommar, Karin!", de: "Schönen Midsommar, Karin!", weiter: null } ] }
  },
  schluss: { sv: "Glad midsommar! /Karin", de: "Schönen Midsommar! /Karin" } },

{ id: "sv-26", thema: "Kräftskiva", monat: [8],
  ord: { sv: "Helan går", de: "das berühmteste schwedische Trinklied", tipp: "„Helan“ ist der erste Schnaps, „halvan“ der zweite. Gesungen wird vor dem Prost." },
  knoten: {
    start: { sagt: "Hej Rita! På lördag har vi kräftskiva hos grannen. Lyktor i trädgården, roliga hattar och massor av kräftor.", de: "Hallo Rita! Am Samstag ist Krebsfest beim Nachbarn. Laternen im Garten, lustige Hütchen und jede Menge Krebse.", antworten: [
      { text: "Roliga hattar? Hur roliga?", de: "Lustige Hütchen? Wie lustig?", weiter: "hattar" },
      { text: "Hur äter man en kräfta?", de: "Wie isst man einen Krebs?", weiter: "ata" } ] },
    hattar: { sagt: "Mycket! Min har en stor kräfta på toppen. Grannarna skrattar varje år.", de: "Sehr! Auf meinem sitzt oben ein großer Krebs. Die Nachbarn lachen jedes Jahr.", antworten: [
      { text: "Skicka en bild, snälla!", de: "Schick bitte ein Foto!", weiter: "bild" },
      { text: "Sjunger ni också?", de: "Singt ihr auch?", weiter: "sjunga" } ] },
    ata: { sagt: "Med fingrarna och mycket ljud. Man suger på skalet – det är helt okej.", de: "Mit den Fingern und viel Geräusch. Man lutscht an der Schale – das ist völlig in Ordnung.", antworten: [
      { text: "Så gör man inte i Spandau!", de: "Das macht man in Spandau aber nicht!", weiter: "spandau" },
      { text: "Sjunger ni också?", de: "Singt ihr auch?", weiter: "sjunga" } ] },
    bild: { sagt: "Okej, men bara till dig. Inte till Christiane!", de: "Okay, aber nur für dich. Nicht für Christiane!", antworten: [
      { text: "Jag lovar ingenting!", de: "Ich verspreche nichts!", weiter: null },
      { text: "Den hamnar i dagboken.", de: "Das kommt ins Tagebuch.", weiter: null } ] },
    sjunga: { sagt: "Hela tiden! Helan går, sjung hopp faderallan lallan lej … Lär dig den!", de: "Die ganze Zeit! „Helan går, sjung hopp faderallan lallan lej“ … Lern das!", antworten: [
      { text: "Lallan lej? Det kan jag!", de: "Lallan lej? Das kann ich!", weiter: null },
      { text: "Jag övar med Hühnchen.", de: "Ich üb mit Hühnchen.", weiter: null } ] },
    spandau: { sagt: "I Vimmerby gör man det – men bara i augusti. Sedan är vi fina igen.", de: "In Vimmerby schon – aber nur im August. Danach benehmen wir uns wieder.", antworten: [
      { text: "En gång om året? Det klarar jag!", de: "Einmal im Jahr? Das schaff ich!", weiter: null },
      { text: "Jag tar med en extra servett.", de: "Ich bring eine extra Serviette mit.", weiter: null } ] }
  },
  schluss: { sv: "Skål och kram! /Karin", de: "Prost und Umarmung! /Karin" } },

{ id: "sv-27", thema: "Surströmming beim Nachbarn", monat: [8, 9],
  ord: { sv: "surströmming", de: "vergorener Ostseehering aus der Dose", tipp: "Die Dose wird draußen geöffnet. Immer. Wirklich." },
  knoten: {
    start: { sagt: "Hej Rita! Min granne har köpt surströmming. Han öppnar burken ute – och jag stänger alla fönster.", de: "Hallo Rita! Mein Nachbar hat Surströmming gekauft. Er macht die Dose draußen auf – und ich mach alle Fenster zu.", antworten: [
      { text: "Luktar den så illa?", de: "Riecht der so schlimm?", weiter: "lukt" },
      { text: "Jag vill smaka!", de: "Ich will probieren!", weiter: "smaka" } ] },
    lukt: { sagt: "Värre! Igår sprang älgen till skogen.", de: "Schlimmer! Gestern ist der Elch in den Wald geflüchtet.", antworten: [
      { text: "Då fungerar den mot älgar!", de: "Dann hilft er ja gegen Elche!", weiter: "alg" },
      { text: "Varför äter folk det?", de: "Warum essen Leute das?", weiter: "varfor" } ] },
    smaka: { sagt: "Modigt! Man äter den i tunnbröd med potatis och lök. Och helst utomhus.", de: "Mutig! Man isst ihn in Fladenbrot mit Kartoffeln und Zwiebeln. Und am besten draußen.", antworten: [
      { text: "Okej, kanske bara potatisen.", de: "Okay, vielleicht nur die Kartoffeln.", weiter: "potatis" },
      { text: "Varför äter folk det?", de: "Warum essen Leute das?", weiter: "varfor" } ] },
    alg: { sagt: "Ha! Då säljer jag burkar till alla i Småland som har äppelträd.", de: "Ha! Dann verkauf ich Dosen an alle in Småland, die Apfelbäume haben.", antworten: [
      { text: "Du blir rik, Karin!", de: "Du wirst reich, Karin!", weiter: null },
      { text: "Men då luktar äpplena också.", de: "Aber dann riechen auch die Äpfel.", weiter: null } ] },
    varfor: { sagt: "Tradition. Och för att man kan skryta efteråt.", de: "Tradition. Und weil man hinterher angeben kann.", antworten: [
      { text: "Det förstår jag!", de: "Das versteh ich!", weiter: null },
      { text: "Jag skryter hellre med kanelbullar.", de: "Ich geb lieber mit Zimtschnecken an.", weiter: null } ] },
    potatis: { sagt: "Klokt val. Potatisen är det bästa ändå.", de: "Kluge Wahl. Die Kartoffeln sind sowieso das Beste.", antworten: [
      { text: "Lagom modig, alltså.", de: "Also lagom mutig.", weiter: null },
      { text: "Och en kanelbulle efteråt!", de: "Und danach eine Zimtschnecke!", weiter: null } ] }
  },
  schluss: { sv: "Hälsningar bakom stängda fönster! /Karin", de: "Grüße hinter geschlossenen Fenstern! /Karin" } },

{ id: "sv-28", thema: "Pfifferlinge", monat: [9],
  ord: { sv: "inte för allt smör i Småland", de: "nicht für alles Geld der Welt (wörtlich: nicht für alle Butter in Småland)", tipp: "Karins Heimat-Redewendung – passt perfekt zu jedem Pilzgeheimnis." },
  knoten: {
    start: { sagt: "Hej Rita! Igår hittade jag en hel korg kantareller i skogen. Men var de växer säger jag inte för allt smör i Småland!", de: "Hallo Rita! Gestern hab ich einen ganzen Korb Pfifferlinge im Wald gefunden. Aber wo sie wachsen, verrate ich nicht für alles Geld der Welt!", antworten: [
      { text: "Inte ens för mig?", de: "Nicht mal mir?", weiter: "ens" },
      { text: "Hur lagar du dem?", de: "Wie machst du sie?", weiter: "laga" } ] },
    ens: { sagt: "Kanske. Om du kommer hit och har ögonbindel på dig.", de: "Vielleicht. Wenn du herkommst und eine Augenbinde trägst.", antworten: [
      { text: "Okej! Jag tar med korgen.", de: "Abgemacht! Ich bring den Korb mit.", weiter: "korg" },
      { text: "Jag hittar egna i Spandau!", de: "Ich find meine eigenen in Spandau!", weiter: "spandau" } ] },
    laga: { sagt: "I smör, med lite salt. Sedan på en smörgås. Enkelt och gott.", de: "In Butter, mit etwas Salz. Dann aufs Brot. Einfach und lecker.", antworten: [
      { text: "Bara smör? Ingen grädde?", de: "Nur Butter? Keine Sahne?", weiter: "gradde" },
      { text: "Mmm, det låter gott!", de: "Mmm, das klingt lecker!", weiter: "mysig" } ] },
    korg: { sagt: "Bra. Och kaffe i termosen – utan fika plockar man ingen svamp.", de: "Gut. Und Kaffee in die Thermoskanne – ohne Fika sammelt man keine Pilze.", antworten: [
      { text: "Termosen är redan packad!", de: "Die Thermoskanne ist schon gepackt!", weiter: null },
      { text: "Och kanelbullar i fickan.", de: "Und Zimtschnecken in der Jackentasche.", weiter: null } ] },
    spandau: { sagt: "I Spandauer Forst? Visst! Svampar bryr sig inte om gränser.", de: "Im Spandauer Forst? Klar! Pilze kümmern sich nicht um Grenzen.", antworten: [
      { text: "Jag rapporterar varje fynd.", de: "Ich melde jeden Fund.", weiter: null },
      { text: "Mina ställen är också hemliga!", de: "Meine Stellen sind auch geheim!", weiter: null } ] },
    gradde: { sagt: "Okej, lite grädde. Det är fortfarande lagom.", de: "Okay, ein bisschen Sahne. Das ist immer noch lagom.", antworten: [
      { text: "Lagom – ditt favoritord!", de: "Lagom – dein Lieblingswort!", weiter: null },
      { text: "Jag tar mycket grädde.", de: "Ich nehm viel Sahne.", weiter: null } ] },
    mysig: { sagt: "Det är det! Med en kopp te efteråt. September är min bästa månad.", de: "Ist es auch! Mit einer Tasse Tee danach. September ist mein liebster Monat.", antworten: [
      { text: "Jag älskar september!", de: "Ich liebe den September!", weiter: null },
      { text: "Smaklig måltid, Karin!", de: "Guten Appetit, Karin!", weiter: null } ] }
  },
  schluss: { sv: "Gyllene hälsningar från skogen! /Karin", de: "Goldene Grüße aus dem Wald! /Karin" } },

{ id: "sv-29", thema: "Herbstdunkel und Mys", monat: [11],
  ord: { sv: "mysig", de: "gemütlich", tipp: "Das Verb dazu: „mysa“ – es sich gemütlich machen. „Fredagsmys“ ist der gemütliche Freitagabend." },
  knoten: {
    start: { sagt: "Hej Rita! Nu blir det mörkt redan klockan fyra. Jag tänder ljus i alla fönster och gör det mysigt.", de: "Hallo Rita! Jetzt wird’s schon um vier dunkel. Ich zünde in allen Fenstern Kerzen an und mach’s mir gemütlich.", antworten: [
      { text: "Och vad gör du sedan?", de: "Und was machst du dann?", weiter: "gor" },
      { text: "Mörkt klockan fyra? Som i en deckare!", de: "Um vier dunkel? Wie in einem Krimi!", weiter: "deckare" } ] },
    gor: { sagt: "Filt, te, Sotis i knät och en deckare. Det kallas mys.", de: "Decke, Tee, Sotis auf dem Schoß und ein Krimi. Das nennt man „mys“.", antworten: [
      { text: "Samma här! Fast med Harry Potter.", de: "Genau wie bei mir! Nur mit Harry Potter.", weiter: "harry" },
      { text: "Och på fredag – fredagsmys?", de: "Und am Freitag – fredagsmys?", weiter: "fredag" } ] },
    deckare: { sagt: "Ja! Perfekt ljus för en deckare. Jag läser Sjöwall och Wahlöö igen.", de: "Ja! Perfektes Licht für einen Krimi. Ich lese wieder Sjöwall und Wahlöö.", antworten: [
      { text: "Martin Beck i mörkret – mysigt!", de: "Martin Beck im Dunkeln – gemütlich!", weiter: "beck" },
      { text: "Och på fredag – fredagsmys?", de: "Und am Freitag – fredagsmys?", weiter: "fredag" } ] },
    harry: { sagt: "Fint. En trollkarl i Spandau och en kommissarie i Vimmerby.", de: "Schön. Ein Zauberer in Spandau und ein Kommissar in Vimmerby.", antworten: [
      { text: "Och båda med te!", de: "Und beide mit Tee!", weiter: null },
      { text: "Ha det mysigt, Karin!", de: "Mach’s dir gemütlich, Karin!", weiter: null } ] },
    fredag: { sagt: "Klart! Fredagsmys betyder chips, tv och soffa. Hela Sverige gör det.", de: "Klar! Fredagsmys heißt Chips, Fernsehen und Sofa. Ganz Schweden macht das.", antworten: [
      { text: "Jag har fredagsmys med Christiane!", de: "Ich mach fredagsmys mit Christiane!", weiter: null },
      { text: "Ha det mysigt, Karin!", de: "Mach’s dir gemütlich, Karin!", weiter: null } ] },
    beck: { sagt: "Ja, han är bäst i november. Han är lika grå som himlen.", de: "Ja, im November ist er am besten. Er ist genauso grau wie der Himmel.", antworten: [
      { text: "Grå, men klok!", de: "Grau, aber klug!", weiter: null },
      { text: "Ha det mysigt, Karin!", de: "Mach’s dir gemütlich, Karin!", weiter: null } ] }
  },
  schluss: { sv: "Mysiga hälsningar i mörkret! /Karin", de: "Gemütliche Grüße aus dem Dunkeln! /Karin" } },

{ id: "sv-30", thema: "Gott nytt år", monat: [1],
  ord: { sv: "ett nyårslöfte", de: "ein Neujahrsvorsatz", tipp: "„Ett löfte“ = ein Versprechen. Mehrzahl: „nyårslöften“." },
  knoten: {
    start: { sagt: "Gott nytt år, Rita! Har du några nyårslöften i år? Jag vet att du har en lista.", de: "Frohes neues Jahr, Rita! Hast du dieses Jahr Vorsätze? Ich weiß doch, dass du eine Liste hast.", antworten: [
      { text: "Klart! Löfte ett: mer svenska.", de: "Klar! Vorsatz eins: mehr Schwedisch.", weiter: "svenska" },
      { text: "Inga löften. Jag är redan perfekt.", de: "Keine Vorsätze. Ich bin schon perfekt.", weiter: "perfekt" } ] },
    svenska: { sagt: "Bra löfte! Och nummer två?", de: "Guter Vorsatz! Und Nummer zwei?", antworten: [
      { text: "Läsa ut Harry Potter fyra.", de: "Harry Potter vier zu Ende lesen.", weiter: "harry" },
      { text: "Fler kanelbullar!", de: "Mehr Zimtschnecken!", weiter: "bullar" } ] },
    perfekt: { sagt: "Ha! Då är mitt löfte att bli lika perfekt som Rita.", de: "Ha! Dann ist mein Vorsatz, genauso perfekt zu werden wie Rita.", antworten: [
      { text: "Det blir svårt, Karin.", de: "Das wird schwer, Karin.", weiter: "svart" },
      { text: "Vad är ditt riktiga löfte?", de: "Was ist dein echter Vorsatz?", weiter: "riktigt" } ] },
    harry: { sagt: "Och sedan bok fem! Ett löfte med fortsättning.", de: "Und dann Band fünf! Ein Vorsatz mit Fortsetzung.", antworten: [
      { text: "Precis! Gott nytt år, Karin!", de: "Genau! Frohes neues Jahr, Karin!", weiter: null },
      { text: "Det skriver jag i dagboken.", de: "Das schreib ich ins Tagebuch.", weiter: null } ] },
    bullar: { sagt: "Det löftet är lätt att hålla. Gott nytt år, kära vän!", de: "Den Vorsatz hält man leicht. Frohes neues Jahr, liebe Freundin!", antworten: [
      { text: "Gott nytt år, Karin!", de: "Frohes neues Jahr, Karin!", weiter: null },
      { text: "Med kardemumma, förstås!", de: "Mit Kardamom, versteht sich!", weiter: null } ] },
    svart: { sagt: "Jag vet. Men jag har ett helt år på mig.", de: "Ich weiß. Aber ich hab ein ganzes Jahr Zeit.", antworten: [
      { text: "Lycka till! Gott nytt år!", de: "Viel Glück! Frohes neues Jahr!", weiter: null },
      { text: "Börja med en fika!", de: "Fang mit einer Fika an!", weiter: null } ] },
    riktigt: { sagt: "Att lära Sotis att inte sova på mina brev.", de: "Sotis beizubringen, nicht auf meinen Briefen zu schlafen.", antworten: [
      { text: "Det klarar inte ens Wallander.", de: "Das schafft nicht mal Wallander.", weiter: null },
      { text: "Gott nytt år, Karin och Sotis!", de: "Frohes neues Jahr, Karin und Sotis!", weiter: null } ] }
  },
  schluss: { sv: "Gott nytt år och tusen kramar! /Karin", de: "Frohes neues Jahr und tausend Umarmungen! /Karin" } }

];
