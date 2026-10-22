/* Spaß-Telefon: kleine Dialogspiele mit Hühnchen, Max und Jane.
   Reines Datenobjekt. weiter:null = Gespräch endet nach dieser Antwort. */
D.anrufe = [

/* ==================== HÜHNCHEN ==================== */

{ id: "huhn-01", wer: "huhn", thema: "Brennofen",
  knoten: {
    start: { sagt: "Ich hab heute an den Brennofen gedacht. Da war es gemütlich. Neunhundert Grad, keine Zugluft.", antworten: [
      { text: "Hast du da drin geschwitzt?", weiter: "k2" },
      { text: "Erzähl, wer war noch im Ofen?", weiter: "k3" } ] },
    k2: { sagt: "Ton schwitzt nicht. Ton wird hart. Das ist quasi meine ganze Persönlichkeit.", antworten: [
      { text: "Hart, aber herzlich, würde ich sagen.", weiter: "k4" },
      { text: "Bei mir heißt das Stehaufmännchen.", weiter: "k4" } ] },
    k3: { sagt: "Ein Krug, zwei Teller und ein Lama. Das Lama hat die ganze Zeit von seiner Glasur geredet.", antworten: [
      { text: "Angeber gibt’s in jedem Ofen.", weiter: "k4" },
      { text: "Und du? Was hast du geredet?", weiter: "k5" } ] },
    k4: { sagt: "Jedenfalls bin ich rausgekommen und war fertig. Ein Gefühl wie nach einer abgehakten Liste.", antworten: [
      { text: "Das Gefühl kenne ich gut.", weiter: null },
      { text: "Soll ich dich mal abhaken?", weiter: "k6" } ] },
    k5: { sagt: "Nichts. Ich hatte noch keinen Schnabel. Der kam erst ganz zum Schluss.", antworten: [
      { text: "Dafür redest du jetzt umso mehr.", weiter: "k4" },
      { text: "Sehr vernünftige Reihenfolge.", weiter: "k4" } ] },
    k6: { sagt: "Bitte vorsichtig. Ich bin ockergelb, nicht kugelschreiberfest.", antworten: [
      { text: "Dann nur ein ganz kleiner Haken.", weiter: null },
      { text: "Gut, du bleibst unabgehakt.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt wieder rumstehen. Das kann ich am besten." },

{ id: "huhn-02", wer: "huhn", thema: "Beine",
  knoten: {
    start: { sagt: "Ich hab eine Frage, die mich seit Jahren beschäftigt. Wozu sind Beine eigentlich gut?", antworten: [
      { text: "Zum Tanzen, ganz klar.", weiter: "k2" },
      { text: "Zum Weglaufen vor dem Hasen.", weiter: "k3" } ] },
    k2: { sagt: "Tanzen. Hm. Ich kann mich leicht nach links neigen, wenn jemand am Regal wackelt.", antworten: [
      { text: "Das ist doch schon ein Schritt!", weiter: "k4" },
      { text: "Das nennt man Sockel-Walzer.", weiter: "k4" } ] },
    k3: { sagt: "Der Hase läuft auch nicht. Der ist aus Porzellan. Wir sind hier alle eher Steh-Typen.", antworten: [
      { text: "Eine Wohngemeinschaft ohne Eile.", weiter: "k5" },
      { text: "Dann braucht ihr auch keine Beine.", weiter: "k5" } ] },
    k4: { sagt: "Sockel-Walzer. Ich lass mir das schützen. Dein Tanzschüler darf ihn als Erster lernen.", antworten: [
      { text: "Er wird begeistert sein.", weiter: null },
      { text: "Der kann ja nicht mal Walzer.", weiter: "k5" } ] },
    k5: { sagt: "Weißt du was? Ich behalte meinen Sockel. Er ist grün und er hat noch nie gestolpert.", antworten: [
      { text: "Ein sehr zuverlässiger Sockel.", weiter: null },
      { text: "Mein Teppich könnte das nicht.", weiter: null } ] }
  },
  schluss: "Ich neige mich jetzt zum Abschied. Nach links. Mehr geht nicht." },

{ id: "huhn-03", wer: "huhn", thema: "Glücksschwein",
  knoten: {
    start: { sagt: "Das Glücksschwein hat gesagt, es bringt mehr Glück als ich. Ich bin empört. Leise, aber empört.", antworten: [
      { text: "Was bringst du denn so?", weiter: "k2" },
      { text: "Soll ich mal mit ihm reden?", weiter: "k3" } ] },
    k2: { sagt: "Ich bringe Ruhe. Und gelegentlich einen Schatten auf die Fensterbank.", antworten: [
      { text: "Schatten ist im Sommer Gold wert.", weiter: "k4" },
      { text: "Ruhe ist unterschätzt.", weiter: "k4" } ] },
    k3: { sagt: "Bitte nicht. Es grunzt dann wieder nicht zurück, und ich muss das aushalten.", antworten: [
      { text: "Dann schreib ich ihm einen Zettel.", weiter: "k5" },
      { text: "Ignorier es einfach eine Woche.", weiter: "k4" } ] },
    k4: { sagt: "Gute Idee. Ich schlage einen Wettbewerb vor: Wer bringt bis Sonntag mehr Glück?", antworten: [
      { text: "Ich führe eine Strichliste.", weiter: "k6" },
      { text: "Und der Hase ist Schiedsrichter.", weiter: "k6" } ] },
    k5: { sagt: "Ein Zettel! Schreib drauf: „Liebes Schwein, Hühner sind auch rosa. Innerlich.“", antworten: [
      { text: "Das unterschreibe ich sofort.", weiter: "k4" },
      { text: "Bist du innerlich rosa?", weiter: "k4" } ] },
    k6: { sagt: "Perfekt. Erster Punkt für mich: Ich hab dich zum Lachen gebracht. Das zählt doppelt.", antworten: [
      { text: "Einverstanden. Zwei Striche fürs Huhn.", weiter: null },
      { text: "Das Schwein wird Einspruch erheben.", weiter: null } ] }
  },
  schluss: "Ich muss los. Ich hab einen Vorsprung zu verteidigen." },

{ id: "huhn-04", wer: "huhn", thema: "Der grüne Hase",
  knoten: {
    start: { sagt: "Der grüne Hase redet seit drei Tagen nicht mit mir. Er redet sonst auch nicht. Aber diesmal fühlt es sich absichtlich an.", antworten: [
      { text: "Habt ihr euch gestritten?", weiter: "k2" },
      { text: "Vielleicht denkt er nur nach.", weiter: "k3" } ] },
    k2: { sagt: "Ich hab gesagt, Grün ist keine Hasenfarbe. Das war vielleicht unsensibel.", antworten: [
      { text: "Ockergelb ist auch keine Hühnerfarbe.", weiter: "k4" },
      { text: "Entschuldige dich mit Schmeichelei.", weiter: "k5" } ] },
    k3: { sagt: "Worüber denn? Er guckt seit Jahren aus dem Fenster, immer in dieselbe Richtung.", antworten: [
      { text: "Vielleicht wartet er auf einen Bus.", weiter: "k4" },
      { text: "Dann denkt er sehr gründlich.", weiter: "k4" } ] },
    k4: { sagt: "Oh, du hast recht: Wir sind beide farblich mutig. Ich glaub, ich hab ihn falsch verstanden.", antworten: [
      { text: "Sag ihm, er ist wunderbar grün.", weiter: "k5" },
      { text: "Zeit für ein Friedensangebot.", weiter: "k5" } ] },
    k5: { sagt: "Ich hab ihm gerade zugenickt, gedanklich. Er hat zurückgeguckt, ich glaub, wir sind wieder gut.", antworten: [
      { text: "Na siehst du, geht doch.", weiter: null },
      { text: "Hat er wirklich geguckt?", weiter: "k6" } ] },
    k6: { sagt: "Er guckt immer. Aber diesmal war es so ein versöhnliches Gucken.", antworten: [
      { text: "Das zählt absolut.", weiter: null },
      { text: "Ich glaub dir jedes Wort.", weiter: null } ] }
  },
  schluss: "Ich steh jetzt ein Stück näher an ihm. Also, theoretisch." },

{ id: "huhn-05", wer: "huhn", thema: "Hogwarts",
  knoten: {
    start: { sagt: "Ich hab heimlich in deinem Harry-Potter-Buch mitgelesen. Über die Schulter. Ich hab ja keine Schultern, aber du weißt, was ich meine.", antworten: [
      { text: "Und, wie findest du es?", weiter: "k2" },
      { text: "In welches Haus würdest du kommen?", weiter: "k3" } ] },
    k2: { sagt: "Sehr spannend. Allerdings kommen viel zu wenig Hühner vor. Eulen, Eulen, Eulen.", antworten: [
      { text: "Du könntest Post austragen.", weiter: "k4" },
      { text: "Ein Huhn bei den Eulen? Mutig.", weiter: "k4" } ] },
    k3: { sagt: "Hufflepuff, ganz klar. Treu, fleißig und gelb. Ich hab mich ja quasi schon gefärbt.", antworten: [
      { text: "Passt wie angegossen. Gebrannt, meine ich.", weiter: "k5" },
      { text: "Ich hätte dich für Slytherin gehalten.", weiter: "k6" } ] },
    k4: { sagt: "Ich könnte Briefe bringen, sehr langsam. Eigentlich müsste man sie bei mir abholen.", antworten: [
      { text: "Das wäre ein Abholhuhn.", weiter: "k5" },
      { text: "Dann warte ich gern.", weiter: "k5" } ] },
    k5: { sagt: "Abholhuhn. Ich schreib das in meine Bewerbung. Gleich nach „hat keine Hände“.", antworten: [
      { text: "Ehrlichkeit kommt immer gut an.", weiter: null },
      { text: "Lass das mit den Händen weg.", weiter: null } ] },
    k6: { sagt: "Slytherin, ich? Ich hab einmal einem Staubkorn mit voller Absicht den Weg versperrt. Vielleicht hast du recht.", antworten: [
      { text: "Siehst du, ein Huhn mit Ehrgeiz.", weiter: "k5" },
      { text: "Bleib lieber bei Hufflepuff.", weiter: "k5" } ] }
  },
  schluss: "Ich lese jetzt weiter. Du musst nur umblättern, wenn ich nicke." },

{ id: "huhn-06", wer: "huhn", thema: "Hühnchens Liste",
  knoten: {
    start: { sagt: "Ich hab mir von dir abgeguckt, wie man Listen macht. Hier ist meine: Punkt eins, rumstehen.", antworten: [
      { text: "Und Punkt zwei?", weiter: "k2" },
      { text: "Schon erledigt?", weiter: "k3" } ] },
    k2: { sagt: "Punkt zwei: weiter rumstehen. Punkt drei: kurz über Punkt zwei nachdenken.", antworten: [
      { text: "Eine sehr realistische Liste.", weiter: "k4" },
      { text: "Da fehlt was Aufregendes.", weiter: "k5" } ] },
    k3: { sagt: "Ich bin mittendrin. Das ist bei rumstehen so eine Sache. Man weiß nie, wann es fertig ist.", antworten: [
      { text: "Mach einfach einen Zwischenhaken.", weiter: "k4" },
      { text: "Wie bei meinem Abwasch.", weiter: "k4" } ] },
    k4: { sagt: "Ein Zwischenhaken. Du bist ein Genie. Kann ich davon gleich mehrere haben?", antworten: [
      { text: "So viele du willst.", weiter: null },
      { text: "Maximal drei pro Tag.", weiter: null } ] },
    k5: { sagt: "Aufregendes, okay. Punkt vier: einmal anders rum stehen, mit dem Rücken zum Fenster.", antworten: [
      { text: "Wow. Ganz schön wild.", weiter: "k4" },
      { text: "Der Hase wird geschockt sein.", weiter: "k4" } ] }
  },
  schluss: "Ich hab gerade Punkt eins abgehakt. Gedanklich. Es war großartig." },

{ id: "huhn-07", wer: "huhn", thema: "Fensterbank-Wetter",
  knoten: {
    start: { sagt: "Wetterbericht von der Fensterbank: Die Sonne steht links vom Hasen. Tendenz: weiter nach rechts.", antworten: [
      { text: "Sehr präzise, danke.", weiter: "k2" },
      { text: "Und wie wird’s morgen?", weiter: "k3" } ] },
    k2: { sagt: "Ich bin hier sozusagen die Wetterstation. Ich merke Regen daran, dass du die Gardine zuziehst.", antworten: [
      { text: "Das ist geschummelt!", weiter: "k4" },
      { text: "Und Wind?", weiter: "k5" } ] },
    k3: { sagt: "Morgen wird es wahrscheinlich hell. Dann dunkel. Ich lege mich da ungern weiter fest.", antworten: [
      { text: "Sicher ist sicher.", weiter: "k4" },
      { text: "Das kann sogar ich vorhersagen.", weiter: "k4" } ] },
    k4: { sagt: "Ich nenne es Erfahrungswerte. Ich stehe hier schon länger als manches Wetter.", antworten: [
      { text: "Da hast du allerdings recht.", weiter: null },
      { text: "Du bist ein altes Wetterhuhn.", weiter: null } ] },
    k5: { sagt: "Wind merke ich nicht. Ich wiege zu viel. Das ist mein einziger Vorteil gegenüber Herbstlaub.", antworten: [
      { text: "Gut, dass du nicht wegfliegst.", weiter: "k4" },
      { text: "Laub ist trotzdem hübsch.", weiter: "k4" } ] }
  },
  schluss: "Das war der Wetterbericht. Es folgt: Stille. Ich übernehme das." },

{ id: "huhn-08", wer: "huhn", thema: "Postkarte aus Peru",
  knoten: {
    start: { sagt: "Ich überlege, eine Postkarte nach Peru zu schreiben. An die Werkstatt, in der ich gemacht wurde.", antworten: [
      { text: "Was willst du denn schreiben?", weiter: "k2" },
      { text: "Wie willst du ohne Hände schreiben?", weiter: "k3" } ] },
    k2: { sagt: "„Liebe Werkstatt, mir geht es gut, ich stehe in Berlin und die Aussicht ist grün. Bitte keine Beine nachschicken.“", antworten: [
      { text: "Sehr schön formuliert.", weiter: "k4" },
      { text: "Schreib noch was über mich.", weiter: "k5" } ] },
    k3: { sagt: "Ich diktiere. Du schreibst. Du hast doch so schöne Stifte für deine Listen.", antworten: [
      { text: "Na gut, ich hole den Füller.", weiter: "k2" },
      { text: "Was zahlst du mir dafür?", weiter: "k6" } ] },
    k4: { sagt: "Jetzt noch eine Briefmarke. Ich würde ja lecken, aber mein Schnabel ist glasiert.", antworten: [
      { text: "Ich mach das schon.", weiter: null },
      { text: "Wir nehmen einen Klebestift.", weiter: null } ] },
    k5: { sagt: "„PS: Ich wohne bei Rita. Sie macht Listen und lacht viel. Ich hab das beste Regal bekommen.“", antworten: [
      { text: "Oh, das ist lieb von dir.", weiter: "k4" },
      { text: "Das beste Regal? Stimmt.", weiter: "k4" } ] },
    k6: { sagt: "Ich kann dir anbieten: einen Monat lang nicht umfallen. Garantiert.", antworten: [
      { text: "Abgemacht, das ist ein fairer Lohn.", weiter: "k2" },
      { text: "Das machst du doch sowieso.", weiter: "k2" } ] }
  },
  schluss: "Die Karte geht raus. Irgendwann. Ich hab keine Eile, ich bin aus Ton." },

{ id: "huhn-09", wer: "huhn", thema: "Eier legen",
  knoten: {
    start: { sagt: "Ich muss dir was gestehen. Ich hab noch nie ein Ei gelegt.", antworten: [
      { text: "Das hat auch keiner erwartet.", weiter: "k2" },
      { text: "Willst du es mal versuchen?", weiter: "k3" } ] },
    k2: { sagt: "Doch, das Glücksschwein fragt jeden Morgen. Ich glaube, es will Rührei.", antworten: [
      { text: "Das Schwein soll sich benehmen.", weiter: "k4" },
      { text: "Sag, du hast frei.", weiter: "k4" } ] },
    k3: { sagt: "Ich hab mich gerade sehr konzentriert. Es kam aber nur ein leises Knacken. Ich glaube, das war das Regal.", antworten: [
      { text: "Vielleicht ein Regal-Ei?", weiter: "k5" },
      { text: "Lass das lieber, bevor was bricht.", weiter: "k4" } ] },
    k4: { sagt: "Ich hab beschlossen: Ich lege keine Eier, ich lege Wert. Auf Ordnung, auf Ruhe, auf dich.", antworten: [
      { text: "Das ist das schönste Ei überhaupt.", weiter: null },
      { text: "Das schreib ich mir auf.", weiter: null } ] },
    k5: { sagt: "Ein Regal-Ei. Rund, aus Kiefer, mit Schrauben. Ich wäre sehr stolz, aber auch sehr verwirrt.", antworten: [
      { text: "Ich wäre einfach nur verwirrt.", weiter: "k4" },
      { text: "Wir nennen es Ikea-Ostern.", weiter: "k4" } ] }
  },
  schluss: "Ich gehe jetzt brüten. Über Gedanken. Die schlüpfen schneller." },

{ id: "huhn-10", wer: "huhn", thema: "Staubwischen",
  knoten: {
    start: { sagt: "Ich hab gehört, du wischst heute Staub. Ich hätte gern das volle Programm. Wellness, bitte.", antworten: [
      { text: "Feuchtes Tuch oder Pinsel?", weiter: "k2" },
      { text: "Wellness kostet extra.", weiter: "k3" } ] },
    k2: { sagt: "Pinsel. Feucht macht meinen Kamm so wellig. Und der muss sitzen, ich bin hier das Gesicht des Regals.", antworten: [
      { text: "Pinsel kommt sofort.", weiter: "k4" },
      { text: "Du bist ganz schön eitel.", weiter: "k5" } ] },
    k3: { sagt: "Ich zahle in Bewunderung. Ich gucke dich den ganzen Tag bewundernd an. Das kann ich gut.", antworten: [
      { text: "Dann mach ich dir einen Sonderpreis.", weiter: "k2" },
      { text: "Gucken kostet dich doch nichts.", weiter: "k2" } ] },
    k4: { sagt: "Ahhh, ja. Da hinter dem Sockel war seit Ostern eine Fluse, sie hieß Gerda.", antworten: [
      { text: "Gerda ist jetzt im Staubsauger.", weiter: "k6" },
      { text: "Soll ich Gerda zurücklegen?", weiter: "k6" } ] },
    k5: { sagt: "Eitel? Ich bin gebrannt, glasiert und von Hand bemalt. Ich darf das.", antworten: [
      { text: "Na gut, das stimmt.", weiter: "k4" },
      { text: "Ich bin auch handbemalt. Lippenstift.", weiter: "k4" } ] },
    k6: { sagt: "Nein, lass sie ziehen. Gerda war nie für die Ewigkeit gemacht. Nicht wie ich.", antworten: [
      { text: "Sehr gefasst, Hühnchen.", weiter: null },
      { text: "Mach’s gut, Gerda.", weiter: null } ] }
  },
  schluss: "Ich glänze. Der Hase guckt neidisch. Endlich passiert hier mal was." },

{ id: "huhn-11", wer: "huhn", thema: "Was ist ein Huhn?",
  knoten: {
    start: { sagt: "Philosophische Frage: Bin ich ein Huhn, das eine Figur ist, oder eine Figur, die ein Huhn ist?", antworten: [
      { text: "Du bist einfach mein Hühnchen.", weiter: "k2" },
      { text: "Was war zuerst da, Ton oder Huhn?", weiter: "k3" } ] },
    k2: { sagt: "Oh. Das ist die beste Antwort. Die hat sogar eine Possessivform.", antworten: [
      { text: "Ich bin halt gut in Grammatik.", weiter: "k4" },
      { text: "Jetzt werd nicht rührselig.", weiter: "k4" } ] },
    k3: { sagt: "Der Ton, eindeutig. Der lag schon rum, bevor jemand Huhn zu ihm gesagt hat.", antworten: [
      { text: "Also bist du uralt.", weiter: "k5" },
      { text: "Und das Ei?", weiter: "k5" } ] },
    k4: { sagt: "Ich werde nie rührselig. Ich bin nur ein bisschen gerührt. Wegen der Glasur sieht man’s nicht.", antworten: [
      { text: "Ich seh es trotzdem.", weiter: null },
      { text: "Dein Geheimnis ist bei mir sicher.", weiter: null } ] },
    k5: { sagt: "Das Ei ist ein Thema, über das ich nicht spreche. Da hab ich eine Lücke im Lebenslauf.", antworten: [
      { text: "Gut, wechseln wir das Thema.", weiter: "k2" },
      { text: "Lücken machen interessant.", weiter: "k4" } ] }
  },
  schluss: "Ich denk noch ein bisschen weiter. Ich hab ja Zeit, ich bin Keramik." },

{ id: "huhn-12", wer: "huhn", thema: "Eichhörnchen im Forst",
  knoten: {
    start: { sagt: "Du warst im Forst, ich rieche es. Na gut, ich rieche nichts, aber du hast ein Blatt am Ärmel.", antworten: [
      { text: "Ich hab Eichhörnchen gesehen.", weiter: "k2" },
      { text: "Das Blatt ist für dich.", weiter: "k3" } ] },
    k2: { sagt: "Eichhörnchen! Haben sie nach mir gefragt? Ich bin in der Tierwelt bestimmt sehr bekannt.", antworten: [
      { text: "Eins hat ganz interessiert geguckt.", weiter: "k4" },
      { text: "Die waren mit Nüssen beschäftigt.", weiter: "k5" } ] },
    k3: { sagt: "Ein Geschenk! Leg es bitte neben mich, ich werde es mit meinem Leben bewachen. Also, mit meinem Stehen.", antworten: [
      { text: "Das ist ein Eichenblatt.", weiter: "k6" },
      { text: "Wird gemacht, Wachhuhn.", weiter: "k6" } ] },
    k4: { sagt: "Sag ihm beim nächsten Mal: Das Huhn grüßt. Und: Wir sind beide nicht gut im Fliegen.", antworten: [
      { text: "Eichhörnchen springen doch.", weiter: "k5" },
      { text: "Ich richte es aus.", weiter: null } ] },
    k5: { sagt: "Immer nur Nüsse, typisch. Kein Interesse an Kunst.", antworten: [
      { text: "Du bist ja auch keine Nuss.", weiter: null },
      { text: "Nimm’s nicht persönlich.", weiter: null } ] },
    k6: { sagt: "Ich nenne es Herbert. Herbert und ich werden zusammen sehr braun und sehr weise.", antworten: [
      { text: "Herbert hat Glück mit dir.", weiter: null },
      { text: "Du wirst nicht braun.", weiter: null } ] }
  },
  schluss: "Grüß den Forst von mir. Ich kann nicht mit, ich muss hier Herbert hüten." },

{ id: "huhn-13", wer: "huhn", thema: "Tanzstunde fürs Huhn",
  knoten: {
    start: { sagt: "Du bringst deinem Nachbarn Tanzen bei. Ich will auch. Ich hab extra den Sockel geputzt.", antworten: [
      { text: "Gut, wir fangen mit Walzer an.", weiter: "k2" },
      { text: "Wie wär’s mit Tango?", weiter: "k3" } ] },
    k2: { sagt: "Eins, zwei, drei, eins, zwei, drei … ich stehe, ich stehe, ich stehe. Wie mache ich mich?", antworten: [
      { text: "Taktsicher wie ein Metronom.", weiter: "k4" },
      { text: "Etwas mehr Hüfte, bitte.", weiter: "k5" } ] },
    k3: { sagt: "Tango! Ich kann sehr dramatisch gucken. Ich gucke immer dramatisch, das war die Pinselführung.", antworten: [
      { text: "Dann bist du ein Naturtalent.", weiter: "k4" },
      { text: "Jetzt noch den Kopf werfen.", weiter: "k5" } ] },
    k4: { sagt: "Ich bin besser als dein Tanzschüler, oder? Du kannst ehrlich sein. Ich bin hart im Nehmen.", antworten: [
      { text: "Du trittst mir zumindest nie auf.", weiter: "k6" },
      { text: "Das sag ich ihm lieber nicht.", weiter: "k6" } ] },
    k5: { sagt: "Ich habe keine Hüfte. Ich habe keinen beweglichen Kopf. Ich habe Ausstrahlung.", antworten: [
      { text: "Ausstrahlung ist die halbe Miete.", weiter: "k4" },
      { text: "Na gut, wir tanzen mit Ausstrahlung.", weiter: "k4" } ] },
    k6: { sagt: "Nächstes Mal stellst du mich auf den Tisch, wenn ihr übt. Ich zähle mit. Lautlos.", antworten: [
      { text: "Du bist engagiert.", weiter: null },
      { text: "Aber nicht vorsagen.", weiter: null } ] }
  },
  schluss: "Und eins, zwei, drei … Ich bleib in Position. Für immer, wahrscheinlich." },

{ id: "huhn-14", wer: "huhn", thema: "Wie das Huhn telefoniert",
  knoten: {
    start: { sagt: "Du fragst dich bestimmt, wie ich dich ohne Hände angerufen hab.", antworten: [
      { text: "Ehrlich gesagt, ja.", weiter: "k2" },
      { text: "Ich frag lieber nicht.", weiter: "k3" } ] },
    k2: { sagt: "Ich hab sehr lange auf das Telefon gestarrt. Irgendwann hat es aufgegeben.", antworten: [
      { text: "Die Methode probiere ich mal.", weiter: "k4" },
      { text: "Hat der Hase geholfen?", weiter: "k5" } ] },
    k3: { sagt: "Klug. Manche Geheimnisse sind besser in Ton gebrannt.", antworten: [
      { text: "Na gut, sag schon.", weiter: "k2" },
      { text: "Warum rufst du denn an?", weiter: "k6" } ] },
    k4: { sagt: "Bei dir dauert das zu lange. Du blinzelst. Ich hab da einen eingebauten Vorteil.", antworten: [
      { text: "Gut, dann bleib ich bei Tasten.", weiter: "k6" },
      { text: "Dafür hab ich Daumen.", weiter: "k6" } ] },
    k5: { sagt: "Der Hase hat die Nummer gewusst. Ich hab sie aus seinen Ohren gelesen. Die stehen manchmal wie eine Vier.", antworten: [
      { text: "Das ist sehr kompliziert.", weiter: "k6" },
      { text: "Ein Telefonhase, wie praktisch.", weiter: "k6" } ] },
    k6: { sagt: "Eigentlich wollte ich nur Hallo sagen. Das hab ich jetzt. Mission erfüllt.", antworten: [
      { text: "Hallo zurück, mein Hühnchen.", weiter: null },
      { text: "Ruf ruhig öfter an.", weiter: null } ] }
  },
  schluss: "Ich leg jetzt auf. Also, ich starre so lange, bis es von allein aufhört." },

{ id: "huhn-15", wer: "huhn", thema: "Kreuzworträtsel",
  knoten: {
    start: { sagt: "Ich hab ein Kreuzworträtsel gesehen. Auf deinem Tisch. Ich hätte da einen Vorschlag für sieben senkrecht.", antworten: [
      { text: "Und der wäre?", weiter: "k2" },
      { text: "Sieben senkrecht hab ich schon.", weiter: "k3" } ] },
    k2: { sagt: "„Huhn“. Ich schlage für jedes Feld „Huhn“ vor. Statistisch muss es irgendwann passen.", antworten: [
      { text: "Gesucht ist ein Fluss mit vier Buchstaben.", weiter: "k4" },
      { text: "Das ist keine Strategie.", weiter: "k5" } ] },
    k3: { sagt: "Oh. Dann acht waagerecht, da bin ich mir ganz sicher: „Huhn“.", antworten: [
      { text: "Acht waagerecht hat elf Buchstaben.", weiter: "k5" },
      { text: "Du bist besessen.", weiter: "k5" } ] },
    k4: { sagt: "Ein Fluss mit vier Buchstaben? Eindeutig „Huhn“, ein sehr ruhiger Fluss, der nicht fließt.", antworten: [
      { text: "Es ist die Havel. Fünf Buchstaben.", weiter: "k6" },
      { text: "Ich geb dir einen Punkt für Mut.", weiter: "k6" } ] },
    k5: { sagt: "Dann schreib „Hühnchenfigur“. Das sind dreizehn. Du darfst ein bisschen über den Rand schreiben.", antworten: [
      { text: "Das sag ich der Zeitung.", weiter: "k6" },
      { text: "Rätselbetrug, Hühnchen!", weiter: "k6" } ] },
    k6: { sagt: "Gut. Ich ziehe mich als Rätselberaterin zurück. Aber wenn je „Huhn“ gesucht wird, will ich angerufen werden.", antworten: [
      { text: "Du bist meine erste Wahl.", weiter: null },
      { text: "Versprochen, ganz bestimmt.", weiter: null } ] }
  },
  schluss: "Fünf Buchstaben für „sehr zufriedenes Tier“? H-u-h-n-n. Passt fast." },

{ id: "huhn-16", wer: "huhn", thema: "Die Regal-Band",
  knoten: {
    start: { sagt: "Ich gründe eine Band. Mit dem Glücksschwein und dem grünen Hasen. Wir heißen „Die Unbeweglichen“.", antworten: [
      { text: "Wer spielt was?", weiter: "k2" },
      { text: "Was für Musik macht ihr?", weiter: "k3" } ] },
    k2: { sagt: "Das Schwein ist die Sparbüchse, es klimpert beim Schütteln. Der Hase ist der Bass: Er sagt nichts, aber tief.", antworten: [
      { text: "Und du?", weiter: "k4" },
      { text: "Klingt nach einem Hit.", weiter: "k5" } ] },
    k3: { sagt: "Stillleben-Rock, sehr leise. Viele sagen, man hört es kaum, das ist Absicht.", antworten: [
      { text: "Ich bin trotzdem Fan.", weiter: "k5" },
      { text: "Wer singt?", weiter: "k4" } ] },
    k4: { sagt: "Ich bin Sängerin. Ich habe einen geöffneten Schnabel. Der Rest passiert im Kopf des Publikums.", antworten: [
      { text: "Sehr modernes Konzept.", weiter: "k5" },
      { text: "Ich höre es schon.", weiter: "k5" } ] },
    k5: { sagt: "Unser erstes Konzert ist Sonntag auf der Fensterbank. Du bist der einzige Gast. Du kriegst den besten Platz.", antworten: [
      { text: "Ich bring Kekse mit.", weiter: "k6" },
      { text: "Muss ich Eintritt zahlen?", weiter: "k6" } ] },
    k6: { sagt: "Kein Eintritt. Nur Applaus. Bitte nicht zu laut, das Schwein ist empfindlich.", antworten: [
      { text: "Ich klatsche ganz leise.", weiter: null },
      { text: "Zugabe gibt’s auch?", weiter: null } ] }
  },
  schluss: "Probe beginnt jetzt. Bitte nicht stören. Du würdest es sowieso nicht hören." },

{ id: "huhn-17", wer: "huhn", thema: "Der Mond",
  knoten: {
    start: { sagt: "Es ist spät, und der Mond guckt durchs Fenster. Ich glaube, er ist auch aus Ton.", antworten: [
      { text: "Der Mond ist aus Käse.", weiter: "k2" },
      { text: "Warum glaubst du das?", weiter: "k3" } ] },
    k2: { sagt: "Käse? Das würde erklären, warum die Maus aus dem Keller immer so sehnsüchtig nach oben guckt.", antworten: [
      { text: "Wir haben keine Maus.", weiter: "k4" },
      { text: "Arme Maus, so weit weg.", weiter: "k4" } ] },
    k3: { sagt: "Er ist rund, blass und steht einfach da. Das ist eindeutig meine Familie.", antworten: [
      { text: "Dann hast du große Verwandtschaft.", weiter: "k5" },
      { text: "Der Mond bewegt sich aber.", weiter: "k5" } ] },
    k4: { sagt: "Dann eben eine ausgedachte Maus. Die sind auch sehr sehnsüchtig. Vielleicht noch mehr.", antworten: [
      { text: "Gut, wir behalten sie.", weiter: "k5" },
      { text: "Du bist heut sehr poetisch.", weiter: "k5" } ] },
    k5: { sagt: "Nachts werde ich immer so. Tagsüber bin ich sachlich. Nachts bin ich ein Gedicht mit Sockel.", antworten: [
      { text: "Ein schönes Gedicht.", weiter: null },
      { text: "Reimst du auch?", weiter: "k6" } ] },
    k6: { sagt: "Huhn auf dem Regal, sieht den Mond, ganz egal. Ich arbeite noch dran.", antworten: [
      { text: "Das ist schon fast Kaléko.", weiter: null },
      { text: "Das reicht für heute.", weiter: null } ] }
  },
  schluss: "Gute Nacht. Ich halte Wache. Ich mache das ja sowieso." },

{ id: "huhn-18", wer: "huhn", thema: "Brenntag",
  knoten: {
    start: { sagt: "Heute ist mein Brenntag. Also, ich hab ihn mir ausgesucht. Es könnte heute sein.", antworten: [
      { text: "Herzlichen Glückwunsch, Hühnchen!", weiter: "k2" },
      { text: "Wie alt wirst du denn?", weiter: "k3" } ] },
    k2: { sagt: "Danke! Ich wünsche mir ein Lied. Aber nicht zu viele Strophen, ich will mich nicht verausgaben.", antworten: [
      { text: "Hoch soll es leben, das Huhn!", weiter: "k4" },
      { text: "Ich summe dir was.", weiter: "k4" } ] },
    k3: { sagt: "Ich zähle nicht in Jahren, sondern in Staubschichten. Ich bin etwa vierzig Mal gewischt.", antworten: [
      { text: "Für vierzig Mal siehst du jung aus.", weiter: "k5" },
      { text: "Das ist ein stolzes Alter.", weiter: "k5" } ] },
    k4: { sagt: "Das war wunderschön. Das Schwein hat innerlich mitgegrunzt, ich hab’s gespürt.", antworten: [
      { text: "Willst du Kuchen?", weiter: "k6" },
      { text: "Jetzt Geschenke?", weiter: "k6" } ] },
    k5: { sagt: "Danke, das liegt an der Glasur. Und Falten sind kein Thema, ich habe ja keine Haut.", antworten: [
      { text: "Darauf ein Lied!", weiter: "k4" },
      { text: "Darauf ein Stück Kuchen.", weiter: "k6" } ] },
    k6: { sagt: "Stell mir einfach ein Kuchenkrümelchen hin. Ich gucke es an. Das ist bei mir wie Essen, nur kalorienfrei.", antworten: [
      { text: "Mit einer Kerze?", weiter: null },
      { text: "Den Rest esse ich für dich.", weiter: null } ] }
  },
  schluss: "Das war der schönste Brenntag seit dem letzten. Den hab ich mir auch ausgesucht." },

/* ==================== MAX ==================== */

{ id: "max-01", wer: "max", thema: "Besuch planen",
  knoten: {
    start: { sagt: "Rita! Ich komm am Wochenende, oder am übernächsten. Auf jeden Fall an einem Wochenende.", antworten: [
      { text: "Ich schreib’s auf. Welches genau?", weiter: "k2" },
      { text: "Bring Hunger mit.", weiter: "k3" } ] },
    k2: { sagt: "Das, an dem der Zug fährt. Ich hab mir drei Verbindungen rausgesucht und alle drei wieder vergessen.", antworten: [
      { text: "Ich mach dir eine Liste.", weiter: "k4" },
      { text: "Typisch Max.", weiter: "k4" } ] },
    k3: { sagt: "Hunger hab ich immer, das ist mein zuverlässigster Charakterzug. Gibt’s was Bestimmtes?", antworten: [
      { text: "Überraschung.", weiter: "k5" },
      { text: "Wünsch dir was.", weiter: "k5" } ] },
    k4: { sagt: "Eine Liste! Mit Häkchen? Dann komm ich bestimmt pünktlich, versprochen.", antworten: [
      { text: "Mit Häkchen und Uhrzeit.", weiter: "k6" },
      { text: "Das hast du letztes Mal auch gesagt.", weiter: "k6" } ] },
    k5: { sagt: "Ich wünsche mir Kartoffelsalat. Und dass du mir den neuen Tanzschritt zeigst, über den alle reden.", antworten: [
      { text: "Wer redet denn darüber?", weiter: "k6" },
      { text: "Nur wenn du mittanzt.", weiter: "k6" } ] },
    k6: { sagt: "Abgemacht. Ich muss jetzt los, die Waschmaschine piept, als hätte sie was zu sagen.", antworten: [
      { text: "Dann lauf, sonst wird sie sauer.", weiter: null },
      { text: "Na, dann bis bald.", weiter: null } ] }
  },
  schluss: "Na dann … Tschüss!" },

{ id: "max-02", wer: "max", thema: "Koch-Experiment",
  knoten: {
    start: { sagt: "Ich hab heute gekocht. Ganz allein. Die Küche steht noch.", antworten: [
      { text: "Was gab es denn?", weiter: "k2" },
      { text: "Und der Rauchmelder?", weiter: "k3" } ] },
    k2: { sagt: "Es sollte Risotto werden. Es ist ein Reisziegel geworden. Sehr stabil.", antworten: [
      { text: "Damit kannst du anbauen.", weiter: "k4" },
      { text: "Zu wenig Brühe, mein Lieber.", weiter: "k5" } ] },
    k3: { sagt: "Der Rauchmelder und ich sind jetzt per du. Er hat mich mehrfach beim Namen gerufen.", antworten: [
      { text: "Was hast du da angestellt?", weiter: "k2" },
      { text: "Wenigstens funktioniert er.", weiter: "k2" } ] },
    k4: { sagt: "Ich überlege, eine Garage draus zu machen. Fürs Fahrrad. Halle braucht mehr Stellplätze.", antworten: [
      { text: "Frag beim nächsten Mal Jane.", weiter: "k6" },
      { text: "Ich zeig dir, wie es geht.", weiter: "k6" } ] },
    k5: { sagt: "Brühe! Ich wusste, dass da was fehlt. Ich dachte, es wäre Liebe.", antworten: [
      { text: "Liebe ist in der Brühe.", weiter: "k6" },
      { text: "Liebe allein macht nicht satt.", weiter: "k6" } ] },
    k6: { sagt: "Gut, nächstes Mal kochen wir zusammen. Und jetzt geh ich den Ziegel einweichen.", antworten: [
      { text: "Viel Glück, du Sternekoch.", weiter: null },
      { text: "Gib ihn lieber auf.", weiter: null } ] }
  },
  schluss: "Na gut … Tschüss, Rita!" },

{ id: "max-03", wer: "max", thema: "Tanzschritt",
  knoten: {
    start: { sagt: "Ich hab versucht, den Schritt zu üben, den du mir gezeigt hast. Ich glaube, ich hab einen neuen erfunden.", antworten: [
      { text: "Zeig mal. Also, beschreib mal.", weiter: "k2" },
      { text: "War es noch Cha-Cha-Cha?", weiter: "k3" } ] },
    k2: { sagt: "Vor, zurück, Drehung, dann stolpern über den Teppich. Das Stolpern ist der Clou.", antworten: [
      { text: "Das Stolpern lassen wir weg.", weiter: "k4" },
      { text: "Nennen wir ihn Halle-Hopser.", weiter: "k5" } ] },
    k3: { sagt: "Es war eher Cha-Cha-Chaos. Mit einer sehr gefühlvollen Armbewegung am Ende.", antworten: [
      { text: "Die Arme waren nie dein Problem.", weiter: "k4" },
      { text: "Chaos kann man üben.", weiter: "k5" } ] },
    k4: { sagt: "Ohne Stolpern ist er aber nur halb so lustig. Dein Tanzschüler hat sicher auch eigene Erfindungen.", antworten: [
      { text: "Der zählt immer nur bis drei.", weiter: "k6" },
      { text: "Ihr wärt ein tolles Duo.", weiter: "k6" } ] },
    k5: { sagt: "Halle-Hopser! Ich lass mir das schützen. Du kriegst die Hälfte der Einnahmen.", antworten: [
      { text: "Die Hälfte von null?", weiter: "k6" },
      { text: "Ich will Tantiemen in Kuchen.", weiter: "k6" } ] },
    k6: { sagt: "Okay, ich übe weiter. Nächstes Mal bei dir tanze ich ihn vor, mit Teppich.", antworten: [
      { text: "Ich räume vorher die Vasen weg.", weiter: null },
      { text: "Ich freu mich drauf.", weiter: null } ] }
  },
  schluss: "So, ich hopse jetzt los … Tschüss!" },

{ id: "max-04", wer: "max", thema: "Die Zimmerpflanze",
  knoten: {
    start: { sagt: "Rita, ich brauch Rat. Meine Pflanze guckt mich so vorwurfsvoll an.", antworten: [
      { text: "Wann hast du sie gegossen?", weiter: "k2" },
      { text: "Was für eine Pflanze ist es?", weiter: "k3" } ] },
    k2: { sagt: "Das kommt drauf an, was du unter „gießen“ verstehst. Ich hab sie mal angeatmet.", antworten: [
      { text: "Das zählt nicht.", weiter: "k4" },
      { text: "Gib ihr sofort ein Glas Wasser.", weiter: "k4" } ] },
    k3: { sagt: "Grün, mit Blättern. Sie heißt Gisela. Mehr weiß ich nicht.", antworten: [
      { text: "Gisela braucht Wasser.", weiter: "k4" },
      { text: "Und wie lange hat Gisela schon?", weiter: "k2" } ] },
    k4: { sagt: "Erledigt. Sie hat sofort weniger vorwurfsvoll geguckt. Kann man Pflanzen auf eine Liste setzen?", antworten: [
      { text: "Man muss sogar. Jeden Sonntag.", weiter: "k5" },
      { text: "Ich ruf dich einfach an.", weiter: "k5" } ] },
    k5: { sagt: "Perfekt, du bist ab sofort Giselas Patentante. Patentante zum Quadrat sozusagen.", antworten: [
      { text: "Ich nehme die Ehre an.", weiter: null },
      { text: "Die Taufe machen wir mit Gießkanne.", weiter: null } ] }
  },
  schluss: "Gisela sagt danke. Ich auch. Tschüss!" },

{ id: "max-05", wer: "max", thema: "Neuer Knopf in der App",
  knoten: {
    start: { sagt: "Ich hab eine geniale Idee für die App: einen Knopf, der gar nichts macht.", antworten: [
      { text: "Wozu soll der gut sein?", weiter: "k2" },
      { text: "Den hab ich schon gefunden.", weiter: "k3" } ] },
    k2: { sagt: "Zum Drücken! Manchmal will man einfach was drücken, ohne dass gleich was passiert.", antworten: [
      { text: "Wie der Fahrstuhlknopf, wenn er schon leuchtet.", weiter: "k4" },
      { text: "Das klingt nach dir.", weiter: "k4" } ] },
    k3: { sagt: "Was, wo? Ich hab ihn doch noch gar nicht gebaut, oder hab ich?", antworten: [
      { text: "Unten rechts. Der macht wirklich nichts.", weiter: "k5" },
      { text: "War nur ein Scherz.", weiter: "k4" } ] },
    k4: { sagt: "Genau! Ich mach ihn rund und gelb. Wie das Hühnchen, nur flacher.", antworten: [
      { text: "Frag das Hühnchen um Erlaubnis.", weiter: "k6" },
      { text: "Mach ihn lieber rot.", weiter: "k6" } ] },
    k5: { sagt: "Oh nein. Dann ist das ein Fehler. Ich hab aus Versehen meine eigene Idee schon umgesetzt.", antworten: [
      { text: "Du bist deiner Zeit voraus.", weiter: "k6" },
      { text: "Lass ihn drin, er ist süß.", weiter: "k6" } ] },
    k6: { sagt: "Okay, beschlossen: Der Knopf bleibt, und er macht weiter nichts. Ich bin sehr stolz auf uns.", antworten: [
      { text: "Bestes Team der Welt.", weiter: null },
      { text: "Ich drück ihn gleich mal.", weiter: null } ] }
  },
  schluss: "Ich programmier dann mal weiter nichts … Tschüss!" },

{ id: "max-06", wer: "max", thema: "Harry-Potter-Häuser",
  knoten: {
    start: { sagt: "Wichtige Frage: Wenn wir beide nach Hogwarts kämen, wären wir im selben Haus?", antworten: [
      { text: "Ich bin klar Gryffindor.", weiter: "k2" },
      { text: "Du wärst bei den Hauselfen.", weiter: "k3" } ] },
    k2: { sagt: "Gryffindor, das passt, du bist mutiger als alle, die ich kenne. Und ich? Ich hätte gern Ravenclaw.", antworten: [
      { text: "Mit deinem Reisziegel? Eher nicht.", weiter: "k4" },
      { text: "Für dich reicht’s locker.", weiter: "k5" } ] },
    k3: { sagt: "Hey! Na gut, ich räum nicht gern auf, die würden mich sofort feuern.", antworten: [
      { text: "Dann Hufflepuff, wie das Hühnchen.", weiter: "k5" },
      { text: "Stimmt, die sind ordentlicher.", weiter: "k4" } ] },
    k4: { sagt: "Okay, ich gebe mich geschlagen. Dafür darf ich der Hut sein, der entscheidet.", antworten: [
      { text: "Du redest ja auch ständig.", weiter: "k6" },
      { text: "Ein sprechender Max-Hut.", weiter: "k6" } ] },
    k5: { sagt: "Dann sehen wir uns zum Essen in der großen Halle. Ich halte dir einen Platz neben dem Pudding frei.", antworten: [
      { text: "Neben dem Pudding, sehr gut.", weiter: "k6" },
      { text: "Ich bring meine Liste mit.", weiter: "k6" } ] },
    k6: { sagt: "Abgemacht. Ich muss jetzt Schluss machen, bevor mich ein Brief per Eule erreicht.", antworten: [
      { text: "Na, dann flieg mal.", weiter: null },
      { text: "Grüß die Eule.", weiter: null } ] }
  },
  schluss: "Und jetzt … Tschüss, Professorin Rita!" },

{ id: "max-07", wer: "max", thema: "Verlaufen in Halle",
  knoten: {
    start: { sagt: "Ich steh gerade an einer Ecke und weiß nicht genau, welche. Halle ist heute anders als gestern.", antworten: [
      { text: "Was siehst du?", weiter: "k2" },
      { text: "Du wohnst da doch!", weiter: "k3" } ] },
    k2: { sagt: "Eine Taube, ein Schild und einen Mann mit Hut. Der Mann guckt, als wüsste er auch nicht, wo er ist.", antworten: [
      { text: "Frag die Taube.", weiter: "k4" },
      { text: "Lies das Schild vor!", weiter: "k5" } ] },
    k3: { sagt: "Ja, aber nur in einem Teil. Die anderen Teile sind eher Gerüchte.", antworten: [
      { text: "Was siehst du denn?", weiter: "k2" },
      { text: "Ich male dir eine Karte.", weiter: "k5" } ] },
    k4: { sagt: "Die Taube ist weggeflogen. Ich glaube, das war ein Hinweis. Ich geh einfach in ihre Richtung.", antworten: [
      { text: "Gute Navigation, Max.", weiter: "k6" },
      { text: "Pass auf, Tauben fliegen über Dächer.", weiter: "k6" } ] },
    k5: { sagt: "Oh. Auf dem Schild steht meine Straße. Ich steh direkt vor meiner Tür.", antworten: [
      { text: "Herzlichen Glückwunsch, du bist da.", weiter: "k6" },
      { text: "Das erzähle ich Jane.", weiter: "k6" } ] },
    k6: { sagt: "Bitte erzähl das nicht weiter. Ich bin ein Mann mit Orientierung, nur heute eben nicht.", antworten: [
      { text: "Mein Mund ist versiegelt.", weiter: null },
      { text: "Zu spät, ich schreib’s auf.", weiter: null } ] }
  },
  schluss: "So, ich geh jetzt rein … Tschüss!" },

{ id: "max-08", wer: "max", thema: "Listen lernen",
  knoten: {
    start: { sagt: "Rita, bring mir bei, wie man Listen macht. Meine sehen aus wie Einkaufszettel nach einem Sturm.", antworten: [
      { text: "Erste Regel: ein Stift, nicht drei.", weiter: "k2" },
      { text: "Lies mir deine Liste vor.", weiter: "k3" } ] },
    k2: { sagt: "Nur einer? Aber dann kann ich ja nicht farbig planen. Ich hab Lila für „vielleicht“.", antworten: [
      { text: "„Vielleicht“ gehört nicht auf Listen.", weiter: "k4" },
      { text: "Gut, Lila darf bleiben.", weiter: "k4" } ] },
    k3: { sagt: "„Milch, Rita anrufen, Dings.“ Das ist alles. Ich weiß nicht mehr, was Dings ist.", antworten: [
      { text: "Rita anrufen kannst du abhaken.", weiter: "k5" },
      { text: "Dings ist immer wichtig.", weiter: "k5" } ] },
    k4: { sagt: "Zweite Regel? Ich hab Stift und Papier bereit, also Papier. Der Stift ist irgendwo.", antworten: [
      { text: "Zweite Regel: Stift suchen.", weiter: "k5" },
      { text: "Der Stift liegt hinter deinem Ohr.", weiter: "k5" } ] },
    k5: { sagt: "Ha! Erster Haken meines Lebens. Das fühlt sich großartig an, ich versteh dich jetzt total.", antworten: [
      { text: "Willkommen im Club.", weiter: "k6" },
      { text: "Nicht übertreiben, mein Lieber.", weiter: "k6" } ] },
    k6: { sagt: "Ich schreib jetzt gleich auf: „Auflegen, aber erst nach dem Tschüss.“", antworten: [
      { text: "Das ist ein guter Punkt.", weiter: null },
      { text: "Den haken wir zusammen ab.", weiter: null } ] }
  },
  schluss: "Punkt eins der Liste: Tschüss!" },

{ id: "max-09", wer: "max", thema: "Die Ente an der Saale",
  knoten: {
    start: { sagt: "Ich war an der Saale spazieren und hab eine Ente kennengelernt. Ich glaube, wir sind jetzt befreundet.", antworten: [
      { text: "Wie heißt sie?", weiter: "k2" },
      { text: "Hast du sie gefüttert?", weiter: "k3" } ] },
    k2: { sagt: "Sie hat mir ihren Namen nicht gesagt. Ich nenn sie Frau Quaßmann, sie wirkt sehr seriös.", antworten: [
      { text: "Grüß Frau Quaßmann von mir.", weiter: "k4" },
      { text: "Seriöse Enten sind die besten.", weiter: "k4" } ] },
    k3: { sagt: "Ich hatte nur ein Pfefferminzbonbon. Sie hat es angeguckt wie eine Kritikerin.", antworten: [
      { text: "Enten mögen keine Bonbons.", weiter: "k2" },
      { text: "Zu Recht.", weiter: "k2" } ] },
    k4: { sagt: "Sie hat genickt. Also, sie hat den Kopf ins Wasser gesteckt. Das deute ich als Ja.", antworten: [
      { text: "Das deute ich auch so.", weiter: "k5" },
      { text: "Vielleicht hatte sie nur Hunger.", weiter: "k5" } ] },
    k5: { sagt: "Das Hühnchen und Frau Quaßmann müssen sich unbedingt kennenlernen. Ein Vogel-Gipfeltreffen.", antworten: [
      { text: "Das Hühnchen redet aber kaum.", weiter: "k6" },
      { text: "Ich backe Kekse dafür.", weiter: "k6" } ] },
    k6: { sagt: "Dann passen sie perfekt zusammen. Ich muss los, sie schwimmt gerade weg und ich will winken.", antworten: [
      { text: "Wink von mir mit.", weiter: null },
      { text: "Na los, lauf hinterher.", weiter: null } ] }
  },
  schluss: "Frau Quaßmann und ich sagen … Tschüss!" },

{ id: "max-10", wer: "max", thema: "Socken-Rätsel",
  knoten: {
    start: { sagt: "Rita, die Waschmaschine hat schon wieder eine Socke gefressen. Ich glaube, sie sammelt.", antworten: [
      { text: "Welche Farbe?", weiter: "k2" },
      { text: "Bei mir passiert das nie.", weiter: "k3" } ] },
    k2: { sagt: "Die mit den kleinen Igeln drauf. Meine Glückssocke. Jetzt hab ich nur noch einen halben Glückstag.", antworten: [
      { text: "Ein halber Glückstag ist doch was.", weiter: "k4" },
      { text: "Guck mal im Bettbezug.", weiter: "k5" } ] },
    k3: { sagt: "Wie machst du das? Hast du eine Socken-Liste?", antworten: [
      { text: "Natürlich hab ich eine Socken-Liste.", weiter: "k4" },
      { text: "Ich zähle vorher, ganz einfach.", weiter: "k4" } ] },
    k4: { sagt: "Ich fang auch an zu zählen: eins … zwei … okay, ich hab nur eine.", antworten: [
      { text: "Dann guck im Bettbezug.", weiter: "k5" },
      { text: "Ich strick dir eine neue.", weiter: "k6" } ] },
    k5: { sagt: "Da war sie! Mit drei fremden Socken und einem Kassenbon von 2019.", antworten: [
      { text: "Das ist ja ein ganzes Nest.", weiter: "k6" },
      { text: "Die fremden Socken behältst du.", weiter: "k6" } ] },
    k6: { sagt: "Ich bin heute ein reicher Mann. An Socken jedenfalls. Ich muss das jetzt alles sortieren.", antworten: [
      { text: "Mach eine Liste.", weiter: null },
      { text: "Viel Spaß beim Sortieren.", weiter: null } ] }
  },
  schluss: "So, Sockenpause … Tschüss!" },

{ id: "max-11", wer: "max", thema: "Geschenk für Jane",
  knoten: {
    start: { sagt: "Psst, Geheimauftrag. Ich brauch eine Geschenkidee für Mama. Sie darf nichts merken.", antworten: [
      { text: "Was Neues für die Küche?", weiter: "k2" },
      { text: "Ein Ausflug zu zweit?", weiter: "k3" } ] },
    k2: { sagt: "Sie hat schon alles für die Küche. Ich glaube, sie hat sogar Geräte, die noch gar nicht erfunden sind.", antworten: [
      { text: "Dann eine selbstgemalte Schürze.", weiter: "k4" },
      { text: "Koch du mal für sie.", weiter: "k5" } ] },
    k3: { sagt: "Gute Idee! Aber wohin? Sie will bestimmt wieder nur über Kuchen reden.", antworten: [
      { text: "Dann in ein Café.", weiter: "k4" },
      { text: "Das ist doch das Beste an ihr.", weiter: "k4" } ] },
    k4: { sagt: "Ich schreib das auf, in Lila, also „vielleicht“. Nein, Quatsch, in Schwarz: Das wird gemacht!", antworten: [
      { text: "Du lernst schnell.", weiter: "k6" },
      { text: "Ich sag kein Wort.", weiter: "k6" } ] },
    k5: { sagt: "Ich soll für sie kochen, nach dem Reisziegel? Das wäre eher eine Strafe als ein Geschenk.", antworten: [
      { text: "Mit meiner Hilfe klappt das.", weiter: "k4" },
      { text: "Dann lieber das Café.", weiter: "k4" } ] },
    k6: { sagt: "Danke, du bist die beste Komplizin. Wenn sie fragt: Wir haben übers Wetter geredet.", antworten: [
      { text: "Sehr sonnig heute, nicht?", weiter: null },
      { text: "Übers Wetter, ganz klar.", weiter: null } ] }
  },
  schluss: "Ende der Geheimübertragung … Tschüss!" },

{ id: "max-12", wer: "max", thema: "Die Wette",
  knoten: {
    start: { sagt: "Ich wette mit dir, dass ich heute beim Tschüss gewinne. Ich hab trainiert.", antworten: [
      { text: "Was ist der Einsatz?", weiter: "k2" },
      { text: "Du verlierst doch immer.", weiter: "k3" } ] },
    k2: { sagt: "Wer verliert, muss beim nächsten Besuch den Abwasch machen. Ganz, mit Töpfen.", antworten: [
      { text: "Dann bring deine Gummihandschuhe mit.", weiter: "k4" },
      { text: "Ich bin dabei.", weiter: "k4" } ] },
    k3: { sagt: "Das war früher. Ich hab jetzt eine Technik: tief einatmen und mit Gefühl tschüssen.", antworten: [
      { text: "Tschüssen ist kein Wort.", weiter: "k5" },
      { text: "Zeig mal deine Technik.", weiter: "k5" } ] },
    k4: { sagt: "Ich spür schon, wie ich gewinne. Mein Bauchgefühl war nie so stark.", antworten: [
      { text: "Das ist wahrscheinlich Hunger.", weiter: "k6" },
      { text: "Warte nur ab.", weiter: "k6" } ] },
    k5: { sagt: "Ab heute schon. Ich hab’s erfunden, das darf ich. Ich hab ja auch die App erfunden.", antworten: [
      { text: "Fair genug.", weiter: "k4" },
      { text: "Na dann zeig, was du kannst.", weiter: "k4" } ] },
    k6: { sagt: "Okay, ich bin bereit. Ich zähl bis drei, dann geht’s los.", antworten: [
      { text: "Eins, zwei …", weiter: null },
      { text: "Ich bin auch bereit.", weiter: null } ] }
  },
  schluss: "Drei! Tschüss!" },

{ id: "max-13", wer: "max", thema: "Der Tanzschüler",
  knoten: {
    start: { sagt: "Wie läuft’s mit deinem Tanzschüler? Ist er schon bereit für die große Bühne?", antworten: [
      { text: "Er zählt schon bis vier.", weiter: "k2" },
      { text: "Er hat letzte Woche gelächelt.", weiter: "k3" } ] },
    k2: { sagt: "Bis vier! Das ist ein Fortschritt von einer ganzen Zahl. Ich bin stolz auf euch beide.", antworten: [
      { text: "Nächstes Ziel: Takt halten.", weiter: "k4" },
      { text: "Nächstes Ziel: nicht auf mich treten.", weiter: "k4" } ] },
    k3: { sagt: "Beim Tanzen? Das ist großes Kino. Da fängt alles an.", antworten: [
      { text: "Leider beim Stolpern.", weiter: "k5" },
      { text: "Mitten im Walzer, ganz plötzlich.", weiter: "k5" } ] },
    k4: { sagt: "Ich komm mal mit und tanz vor. Dann sieht er, dass es noch schlimmer geht.", antworten: [
      { text: "Das wäre tatsächlich motivierend.", weiter: "k6" },
      { text: "Du bringst ihn nur durcheinander.", weiter: "k6" } ] },
    k5: { sagt: "Stolpern mit Lächeln ist eine ganz eigene Tanzform. Ich beherrsche die schon.", antworten: [
      { text: "Das weiß ich, du Halle-Hopser.", weiter: "k6" },
      { text: "Ihr wärt ein gutes Paar.", weiter: "k6" } ] },
    k6: { sagt: "Abgemacht, ich komm zur nächsten Stunde. Ich bring gute Laune und schlechte Schuhe.", antworten: [
      { text: "Bring lieber gute Schuhe.", weiter: null },
      { text: "Ich halte dir einen Platz frei.", weiter: null } ] }
  },
  schluss: "Ich tanz jetzt raus … Tschüss!" },

{ id: "max-14", wer: "max", thema: "Das Fahrrad",
  knoten: {
    start: { sagt: "Ich hab ein neues Fahrrad. Also ein gebrauchtes. Es quietscht bei jedem Tritt, wie ein Akkordeon.", antworten: [
      { text: "Öl hilft.", weiter: "k2" },
      { text: "Dann hast du Musik dabei.", weiter: "k3" } ] },
    k2: { sagt: "Ich hab Salatöl genommen. Jetzt riecht es nach Vinaigrette und quietscht trotzdem.", antworten: [
      { text: "Max, das war das falsche Öl.", weiter: "k4" },
      { text: "Dann gibt es Fahrradsalat.", weiter: "k4" } ] },
    k3: { sagt: "Stimmt. Ich kann bergauf Polka spielen. Die Leute drehen sich schon um.", antworten: [
      { text: "Spiel mal einen Walzer.", weiter: "k5" },
      { text: "Wegen der Musik, sicher.", weiter: "k5" } ] },
    k4: { sagt: "Ich frag am besten Micha. Der weiß sowas, und er redet dabei nicht so viel.", antworten: [
      { text: "Gute Idee.", weiter: "k6" },
      { text: "Ich hätte es dir auch gesagt.", weiter: "k6" } ] },
    k5: { sagt: "Für Walzer muss ich im Dreivierteltakt treten. Das ist auf Kopfsteinpflaster eine Herausforderung.", antworten: [
      { text: "Du schaffst das.", weiter: "k6" },
      { text: "Steig lieber ab und schieb.", weiter: "k6" } ] },
    k6: { sagt: "Ich fahr jetzt eine Proberunde. Wenn du ein Quietschen aus Richtung Halle hörst, das bin ich.", antworten: [
      { text: "Ich lausche.", weiter: null },
      { text: "Fahr vorsichtig, du Akkordeonist.", weiter: null } ] }
  },
  schluss: "Quietsch, quietsch … Tschüss!" },

{ id: "max-15", wer: "max", thema: "Der Bart",
  knoten: {
    start: { sagt: "Ich lass mir einen Bart wachsen. Bis jetzt sind es drei Haare, aber sie sind sehr entschlossen.", antworten: [
      { text: "Drei? Hast du sie gezählt?", weiter: "k2" },
      { text: "Warum denn ein Bart?", weiter: "k3" } ] },
    k2: { sagt: "Ich hab ihnen sogar Namen gegeben. Harry, Ron und Hermine.", antworten: [
      { text: "Hermine wächst bestimmt am schnellsten.", weiter: "k4" },
      { text: "Wo ist Dumbledore?", weiter: "k5" } ] },
    k3: { sagt: "Ich will weiser aussehen. Wie ein Professor. Oder wenigstens wie jemand, der weiß, wo seine Schlüssel sind.", antworten: [
      { text: "Dafür brauchst du eher eine Liste.", weiter: "k4" },
      { text: "Wie Dumbledore?", weiter: "k5" } ] },
    k4: { sagt: "Haha, Hermine ist tatsächlich schon die längste. Typisch, die strengt sich immer am meisten an.", antworten: [
      { text: "Gib Ron noch etwas Zeit.", weiter: "k6" },
      { text: "Rasier sie lieber nicht ab.", weiter: "k6" } ] },
    k5: { sagt: "Dumbledore kommt, wenn ich achtzig bin. Dann können wir zusammen weise gucken.", antworten: [
      { text: "Ich gucke jetzt schon weise.", weiter: "k6" },
      { text: "Das dauert noch, mein Lieber.", weiter: "k6" } ] },
    k6: { sagt: "Beim nächsten Besuch zeig ich dir den Bart. Bring eine Lupe mit.", antworten: [
      { text: "Ich bring die von der Zeitung.", weiter: null },
      { text: "Ich freu mich auf alle drei.", weiter: null } ] }
  },
  schluss: "Harry, Ron, Hermine und ich sagen … Tschüss!" },

{ id: "max-16", wer: "max", thema: "Pizza-Verwechslung",
  knoten: {
    start: { sagt: "Ich hab Pizza bestellt. Gekommen ist ein Salat und ein Mann, der sehr überzeugt war, dass ich Salat bestellt hab.", antworten: [
      { text: "Und, hast du ihn gegessen?", weiter: "k2" },
      { text: "Hast du reklamiert?", weiter: "k3" } ] },
    k2: { sagt: "Ja, und weißt du was? Er war gut. Ich fühl mich verraten von meinem eigenen Magen.", antworten: [
      { text: "Das nennt man Wachstum.", weiter: "k4" },
      { text: "Dein Magen weiß, was gut ist.", weiter: "k4" } ] },
    k3: { sagt: "Ich wollte. Aber er hat so freundlich geguckt. Da hab ich Danke gesagt und Trinkgeld gegeben.", antworten: [
      { text: "Du bist zu nett.", weiter: "k2" },
      { text: "Das hätte ich auch gemacht.", weiter: "k2" } ] },
    k4: { sagt: "Ich glaub, ich bestell nächstes Mal extra Salat. Vielleicht kommt dann ja Pizza.", antworten: [
      { text: "Raffiniert. Probier es aus.", weiter: "k5" },
      { text: "Oder du kochst selber.", weiter: "k6" } ] },
    k5: { sagt: "Ich schreib’s auf meine neue Liste: „Salat bestellen, Pizza bekommen.“ Mit schwarzem Stift.", antworten: [
      { text: "Das ist mein Junge.", weiter: null },
      { text: "Ich bin gespannt.", weiter: null } ] },
    k6: { sagt: "Selber kochen? Ich erinnere an den Reisziegel. Wir wollen ja niemanden gefährden.", antworten: [
      { text: "Gut, dann bestell weiter.", weiter: "k5" },
      { text: "Wir kochen zusammen, versprochen.", weiter: null } ] }
  },
  schluss: "Ich hör die Klingel … Tschüss!" },

{ id: "max-17", wer: "max", thema: "Rätselhilfe",
  knoten: {
    start: { sagt: "Du bist doch Rätselprofi. Ich brauch ein Wort mit fünf Buchstaben für „Telefonat ohne Ende“.", antworten: [
      { text: "Das sind wir zwei.", weiter: "k2" },
      { text: "Wo steht das denn?", weiter: "k3" } ] },
    k2: { sagt: "Haha. Das passt aber nicht in fünf Kästchen. Wir sind mindestens zwölf.", antworten: [
      { text: "Probier mal „Tschüss“.", weiter: "k4" },
      { text: "Dann ist das Rätsel falsch.", weiter: "k5" } ] },
    k3: { sagt: "Nirgendwo, das hab ich mir selbst ausgedacht. Ich wollte nur, dass du anrufst, also, dass ich anrufe.", antworten: [
      { text: "Du bist ein Schlitzohr.", weiter: "k5" },
      { text: "Schön, dass du anrufst.", weiter: "k5" } ] },
    k4: { sagt: "„Tschüss“ hat sieben Buchstaben. Aber gefühlt dauert es unendlich. Du hast es geknackt.", antworten: [
      { text: "Ich bin halt ein Profi.", weiter: "k6" },
      { text: "Das war nicht schwer.", weiter: "k6" } ] },
    k5: { sagt: "Ich hab noch eins: „Was macht man am Ende eines Telefonats?“ Neun Buchstaben.", antworten: [
      { text: "Auflegen. Acht.", weiter: "k6" },
      { text: "Gar nicht erst aufhören.", weiter: "k6" } ] },
    k6: { sagt: "Dann lass uns das Rätsel lieber praktisch lösen. Bist du bereit?", antworten: [
      { text: "Jederzeit.", weiter: null },
      { text: "Ich wärme meine Stimme auf.", weiter: null } ] }
  },
  schluss: "Na dann … Tschüss!" },

{ id: "max-18", wer: "max", thema: "Max’ Quiz",
  knoten: {
    start: { sagt: "Ich hab ein Quiz für dich. Frage eins: Wer ist dein Lieblingspatensohn?", antworten: [
      { text: "Gibt es da Auswahlmöglichkeiten?", weiter: "k2" },
      { text: "Das Glücksschwein.", weiter: "k3" } ] },
    k2: { sagt: "Nein. Die Antwort lautet Max, mit großem M. Zehn Punkte für Rita!", antworten: [
      { text: "Ich hab doch noch gar nichts gesagt.", weiter: "k4" },
      { text: "Na gut, ich nehm die Punkte.", weiter: "k4" } ] },
    k3: { sagt: "Das Schwein ist kein Patensohn! Es hat ja nicht mal eine App für dich gebaut.", antworten: [
      { text: "Na gut, dann eben du.", weiter: "k4" },
      { text: "Es grunzt aber netter.", weiter: "k5" } ] },
    k4: { sagt: "Frage zwei: Wer kann besser tanzen, du oder ich?", antworten: [
      { text: "Das ist keine echte Frage.", weiter: "k6" },
      { text: "Der Halle-Hopser natürlich.", weiter: "k6" } ] },
    k5: { sagt: "Es grunzt gar nicht, das sagt das Hühnchen auch immer. Ich lasse die Antwort nicht gelten.", antworten: [
      { text: "Gut, dann bist du es.", weiter: "k4" },
      { text: "Du bist so eifersüchtig.", weiter: "k4" } ] },
    k6: { sagt: "Richtig, du! Ende des Quiz, du hast gewonnen. Der Preis ist ein Besuch von mir.", antworten: [
      { text: "Den nehm ich gern.", weiter: null },
      { text: "Gibt’s auch einen zweiten Platz?", weiter: null } ] }
  },
  schluss: "Siegerehrung beendet … Tschüss!" },

/* ==================== JANE ==================== */

{ id: "jane-01", wer: "jane", thema: "Sonntagsessen",
  knoten: {
    start: { sagt: "Rita, Sonntag! Ich plane schon. Braten oder Rouladen, das ist hier die Frage.", antworten: [
      { text: "Rouladen, eindeutig.", weiter: "k2" },
      { text: "Warum nicht beides?", weiter: "k3" } ] },
    k2: { sagt: "Rouladen, hervorragend. Dann muss ich nur noch den Zahnstocher-Vorrat prüfen, Micha baut daraus immer Türmchen.", antworten: [
      { text: "Ich bring Zahnstocher mit.", weiter: "k4" },
      { text: "Und was gibt’s dazu?", weiter: "k5" } ] },
    k3: { sagt: "Beides! Du bist ja mutig. Mein Ofen hat dabei zuletzt so geguckt, als wollte er kündigen.", antworten: [
      { text: "Dein Ofen schafft das.", weiter: "k5" },
      { text: "Gut, dann doch nur Rouladen.", weiter: "k2" } ] },
    k4: { sagt: "Wunderbar. Und Nachtisch? Ich hätte da einen Verdacht, dass du was Bestimmtes willst.", antworten: [
      { text: "Rote Grütze mit Vanillesoße.", weiter: "k6" },
      { text: "Überrasch mich.", weiter: "k6" } ] },
    k5: { sagt: "Rotkohl und Klöße, selbstverständlich. Die Klöße sind diesmal rund, versprochen, nicht wie letztes Mal.", antworten: [
      { text: "Ich mochte die eckigen.", weiter: "k4" },
      { text: "Rund ist schön.", weiter: "k4" } ] },
    k6: { sagt: "Abgemacht. Ich schreib’s mir auf, also auf deine Art, mit Haken. Ich hab das von dir.", antworten: [
      { text: "Gelernt ist gelernt.", weiter: null },
      { text: "Ich freu mich auf Sonntag.", weiter: null } ] }
  },
  schluss: "Bis Sonntag, Rita. Komm hungrig!" },

{ id: "jane-02", wer: "jane", thema: "Der launische Ofen",
  knoten: {
    start: { sagt: "Mein Ofen hat heute wieder Launen. Er heizt nur, wenn ich nett zu ihm bin.", antworten: [
      { text: "Was sagst du ihm denn?", weiter: "k2" },
      { text: "Droh ihm mit dem Elektriker.", weiter: "k3" } ] },
    k2: { sagt: "„Lieber Ofen, du bist der schönste Ofen der Binger Straße.“ Dann tickt er zufrieden.", antworten: [
      { text: "Ist er das denn?", weiter: "k4" },
      { text: "So spreche ich mit dem Hühnchen.", weiter: "k5" } ] },
    k3: { sagt: "Um Himmels willen, nicht so laut! Das letzte Mal hat er daraufhin den Kuchen absichtlich blass gelassen.", antworten: [
      { text: "Rachsüchtiger Ofen.", weiter: "k4" },
      { text: "Entschuldige dich bei ihm.", weiter: "k2" } ] },
    k4: { sagt: "Er ist der einzige Ofen, den ich kenne, der eine eigene Meinung hat. Aber er backt wie ein Engel.", antworten: [
      { text: "Wie seine Besitzerin.", weiter: "k6" },
      { text: "Mit Meinung backt es sich besser.", weiter: "k6" } ] },
    k5: { sagt: "Siehst du, das Hühnchen versteht das. Unsere Gegenstände haben Gefühle, das weiß jede ordentliche Hausfrau.", antworten: [
      { text: "Mein Toaster ist eher kühl.", weiter: "k6" },
      { text: "Mein Teekessel pfeift immer zurück.", weiter: "k6" } ] },
    k6: { sagt: "Oh, er tickt gerade. Ich glaub, er hat gemerkt, dass wir über ihn reden.", antworten: [
      { text: "Grüß ihn schön von mir.", weiter: null },
      { text: "Dann lass ich euch allein.", weiter: null } ] }
  },
  schluss: "Ich muss jetzt nach ihm sehen. Er wird sonst eifersüchtig." },

{ id: "jane-03", wer: "jane", thema: "Kuchen-Abstimmung",
  knoten: {
    start: { sagt: "Ich brauche dein Fachurteil. Für Samstag: Apfelkuchen oder Käsekuchen?", antworten: [
      { text: "Apfelkuchen mit Streuseln.", weiter: "k2" },
      { text: "Käsekuchen, ohne Rosinen!", weiter: "k3" } ] },
    k2: { sagt: "Streusel, gute Wahl. Wie viele Streusel ist für dich „genug“?", antworten: [
      { text: "Mehr Streusel als Apfel.", weiter: "k4" },
      { text: "So viele, dass man staunt.", weiter: "k4" } ] },
    k3: { sagt: "Ohne Rosinen, natürlich. Ich weiß gar nicht, wer Rosinen jemals eingeladen hat.", antworten: [
      { text: "Die haben sich reingeschlichen.", weiter: "k5" },
      { text: "Ich esse sie, um sie loszuwerden.", weiter: "k5" } ] },
    k4: { sagt: "Ich hab früher mal Streusel in so einer Menge gemacht, dass der Apfel um Hilfe gerufen hat.", antworten: [
      { text: "Genau so will ich ihn.", weiter: "k6" },
      { text: "Der Apfel hat’s überlebt?", weiter: "k6" } ] },
    k5: { sagt: "Dann machen wir den Käsekuchen ganz hoch und fluffig. Er darf nur nicht einsinken, sonst schmollt der Ofen.", antworten: [
      { text: "Und wenn er doch einsinkt?", weiter: "k6" },
      { text: "Ich halte die Daumen.", weiter: "k6" } ] },
    k6: { sagt: "Ach, egal was passiert, es wird gegessen. Das ist das Schöne an Kuchen: Er nimmt nichts übel.", antworten: [
      { text: "Ganz im Gegensatz zum Ofen.", weiter: null },
      { text: "Ich bin am Samstag da.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt Butter weich werden lassen. Bis Samstag!" },

{ id: "jane-04", wer: "jane", thema: "Der Kuchendieb",
  knoten: {
    start: { sagt: "Rita, es gibt einen Kuchendieb in der Binger Straße. Es fehlt ein Stück vom Blech.", antworten: [
      { text: "Verdächtige?", weiter: "k2" },
      { text: "War es vielleicht ein Eichhörnchen?", weiter: "k3" } ] },
    k2: { sagt: "Nur einer. Er sitzt gerade auf dem Sofa und tut so, als würde er Zeitung lesen. Mit Krümeln am Kinn.", antworten: [
      { text: "Micha, du bist überführt!", weiter: "k4" },
      { text: "Die Zeitung ist sein Alibi.", weiter: "k5" } ] },
    k3: { sagt: "Ein Eichhörnchen mit Lesebrille? Ich hab da eher jemand Bestimmten im Verdacht.", antworten: [
      { text: "Micha?", weiter: "k2" },
      { text: "Vielleicht du selbst, Jane?", weiter: "k6" } ] },
    k4: { sagt: "Er sagt, er habe nur „probiert, ob er gut ist“. Mit einem ganzen Stück.", antworten: [
      { text: "Gründlicher Prüfer.", weiter: "k5" },
      { text: "Das ist Qualitätskontrolle.", weiter: "k5" } ] },
    k5: { sagt: "Ich verhänge eine Strafe: Er muss den Abwasch machen. Mit Gesang.", antworten: [
      { text: "Was singt er denn?", weiter: "k7" },
      { text: "Gerecht, aber hart.", weiter: "k7" } ] },
    k6: { sagt: "Ich? Na hör mal! Also, es könnte sein, dass ich vorhin ganz kurz die Kante begradigt habe.", antworten: [
      { text: "Ha, ertappt!", weiter: "k5" },
      { text: "Kanten begradigen ist erlaubt.", weiter: "k5" } ] },
    k7: { sagt: "Meistens Schlager, ziemlich falsch. Aber das Geschirr wird trotzdem sauber.", antworten: [
      { text: "Spar mir ein Stück auf.", weiter: null },
      { text: "Sag ihm, ich halte zu ihm.", weiter: null } ] }
  },
  schluss: "Ich versteck den Rest jetzt im Ofen. Da traut er sich nicht ran." },

{ id: "jane-05", wer: "jane", thema: "Geheimrezept",
  knoten: {
    start: { sagt: "Rita, du wolltest doch immer mein Geheimrezept für den Gugelhupf. Heute verrate ich es dir.", antworten: [
      { text: "Endlich! Ich hab Stift und Zettel.", weiter: "k2" },
      { text: "Ich will’s lieber nicht wissen.", weiter: "k3" } ] },
    k2: { sagt: "Also, Zutat eins: Butter. Zutat zwei: noch mehr Butter. Den Rest erfährst du nach dem nächsten Kaffee.", antworten: [
      { text: "Das ist kein Geheimnis.", weiter: "k4" },
      { text: "Kommt Butter an dritter Stelle?", weiter: "k4" } ] },
    k3: { sagt: "Wie bitte? Du willst es nicht wissen? Das hat noch keiner gesagt!", antworten: [
      { text: "Dann muss ich ja nie selber backen.", weiter: "k5" },
      { text: "Na gut, erzähl.", weiter: "k2" } ] },
    k4: { sagt: "Das Geheimnis ist eigentlich, dass ich mit ihm spreche, während er im Ofen ist. Ganz leise.", antworten: [
      { text: "Was sagst du ihm?", weiter: "k6" },
      { text: "Das mach ich mit meinen Pflanzen.", weiter: "k6" } ] },
    k5: { sagt: "Ach, du bist ja raffiniert. Dann back ich ihn eben weiter für dich. Für immer.", antworten: [
      { text: "Das war mein Plan.", weiter: null },
      { text: "Ich lade dafür zum Tanzen ein.", weiter: null } ] },
    k6: { sagt: "„Geh schön auf, mein Kleiner.“ Und dann geht er auf. Wenn das kein Rezept ist.", antworten: [
      { text: "Das steht ab jetzt auf meiner Liste.", weiter: null },
      { text: "Dein Ofen hat’s gut.", weiter: null } ] }
  },
  schluss: "Aber verrat’s keinem. Vor allem nicht dem Ofen." },

{ id: "jane-06", wer: "jane", thema: "Übermütiger Hefeteig",
  knoten: {
    start: { sagt: "Rita, ich hab ein Problem. Mein Hefeteig ist so gut aufgegangen, dass er die Schüssel verlassen will.", antworten: [
      { text: "Wo ist er jetzt?", weiter: "k2" },
      { text: "Gib ihm eine größere Schüssel.", weiter: "k3" } ] },
    k2: { sagt: "Er hat das Handtuch angehoben wie eine Bettdecke und guckt raus. Ich glaub, er ist neugierig.", antworten: [
      { text: "Zeig ihm die Küche.", weiter: "k4" },
      { text: "Drück ihn sanft zurück.", weiter: "k5" } ] },
    k3: { sagt: "Ich hab keine größere mehr. Die größte ist der Bräter, und den hab ich für Sonntag reserviert.", antworten: [
      { text: "Dann nimm die Badewanne.", weiter: "k4" },
      { text: "Mach doch einfach zwei Zöpfe draus.", weiter: "k5" } ] },
    k4: { sagt: "Ha, du bist schlimm. Wenn ich nicht aufpasse, besetzt er noch das Sofa, und das gehört Micha.", antworten: [
      { text: "Micha kann ja umziehen.", weiter: "k5" },
      { text: "Teig auf dem Sofa? Gemütlich.", weiter: "k5" } ] },
    k5: { sagt: "Ich mach jetzt einen Hefezopf, einen großen. Der kriegt dann seinen eigenen Stuhl am Tisch.", antworten: [
      { text: "Heb mir ein Stück auf.", weiter: null },
      { text: "Wie heißt der Gast?", weiter: "k6" } ] },
    k6: { sagt: "Ich nenne ihn Herr Zopf. Er ist etwas aufgeblasen, aber innerlich ganz weich.", antworten: [
      { text: "Wie manche Leute, die ich kenne.", weiter: null },
      { text: "Grüß mir Herrn Zopf.", weiter: null } ] }
  },
  schluss: "Er ist schon wieder gewachsen, ich muss los!" },

{ id: "jane-07", wer: "jane", thema: "Das Paket",
  knoten: {
    start: { sagt: "Bei mir ist ein Paket für den Nachbarn abgegeben worden. Es raschelt, Rita, es raschelt!", antworten: [
      { text: "Schüttel mal vorsichtig.", weiter: "k2" },
      { text: "Das geht dich doch nichts an.", weiter: "k3" } ] },
    k2: { sagt: "Ich hab geschüttelt, es klingt wie Nudeln. Oder wie sehr kleine Maracas.", antworten: [
      { text: "Bestimmt Nudeln, er kocht gern.", weiter: "k4" },
      { text: "Er gründet eine Band!", weiter: "k5" } ] },
    k3: { sagt: "Natürlich nicht. Ich gucke es nur an, mit großem Abstand und noch größerem Interesse.", antworten: [
      { text: "Na gut, schüttel einmal.", weiter: "k2" },
      { text: "Stell es weg und back was.", weiter: "k6" } ] },
    k4: { sagt: "Nudeln? Ich hab ihn noch nie kochen gerochen. Und ich rieche alles in diesem Haus.", antworten: [
      { text: "Vielleicht kocht er heimlich.", weiter: "k6" },
      { text: "Dann eben Maracas.", weiter: "k5" } ] },
    k5: { sagt: "Eine Band! Dann bin ich ab sofort deren Catering. Musiker haben immer Hunger.", antworten: [
      { text: "Und das Hühnchen singt.", weiter: "k6" },
      { text: "Ich mach die Choreografie.", weiter: "k6" } ] },
    k6: { sagt: "Oh, er klingelt. Ich geb’s ihm jetzt ganz unschuldig. Ich sag nichts vom Schütteln.", antworten: [
      { text: "Frag ihn, was drin ist!", weiter: null },
      { text: "Schau unauffällig.", weiter: null } ] }
  },
  schluss: "Ich ruf dich gleich zurück, wenn ich was weiß. Spätestens beim Kuchen." },

{ id: "jane-08", wer: "jane", thema: "Der Ofen bekommt einen Namen",
  knoten: {
    start: { sagt: "Ich hab beschlossen, meinem Ofen endlich einen Namen zu geben. Nach all den Jahren.", antworten: [
      { text: "Wie wär’s mit Heinz?", weiter: "k2" },
      { text: "Etwas Edles, bitte.", weiter: "k3" } ] },
    k2: { sagt: "Heinz? Oh, er hat gerade empört geklickt. Ich glaube, mein Ofen ist eine Sie.", antworten: [
      { text: "Verzeihung, gnädige Frau Ofen.", weiter: "k5" },
      { text: "Dann eben Hildegard.", weiter: "k5" } ] },
    k3: { sagt: "Edel? Sie ist eher bodenständig. Sie riecht nach Zimt und hat einen Kratzer an der Tür.", antworten: [
      { text: "Dann Gräfin von Zimt.", weiter: "k5" },
      { text: "Wie wär’s mit Heinz?", weiter: "k2" } ] },
    k5: { sagt: "Ich hab „Hildegard“ geflüstert, und sie hat zufrieden gebrummt. Das ist ihr Name, eindeutig.", antworten: [
      { text: "Hildegard passt wunderbar.", weiter: "k4" },
      { text: "Gräfin Hildegard von Zimt.", weiter: "k4" } ] },
    k4: { sagt: "Ich hab ihr gerade einen Zettel mit ihrem Namen drangeklebt. Micha guckt mich komisch an.", antworten: [
      { text: "Micha versteht nichts von Öfen.", weiter: "k6" },
      { text: "Kleb Micha auch einen Zettel an.", weiter: "k6" } ] },
    k6: { sagt: "Jetzt fehlt nur noch eine Taufe. Ich back ihr zu Ehren einen Marmorkuchen.", antworten: [
      { text: "Ich komm zur Feier.", weiter: null },
      { text: "Ich schick das Hühnchen als Patin.", weiter: null } ] }
  },
  schluss: "Ich stell euch gleich mal vor. Hildegard, das ist Rita. Rita, das ist Hildegard." },

{ id: "jane-09", wer: "jane", thema: "Plätzchenzeit",
  knoten: {
    start: { sagt: "Rita, die Plätzchenzeit hat begonnen. Ich hab den Ausstecher-Karton schon aus dem Keller geholt.", antworten: [
      { text: "Welche Formen hast du?", weiter: "k2" },
      { text: "Ist das nicht zu früh?", weiter: "k3" } ] },
    k2: { sagt: "Sterne, Herzen, Tannen und ein sehr seltsames Tier. Keiner weiß, was es sein soll.", antworten: [
      { text: "Das ist bestimmt ein Huhn.", weiter: "k4" },
      { text: "Vielleicht ein grüner Hase.", weiter: "k4" } ] },
    k3: { sagt: "Zu früh? Für Plätzchen ist es nie zu früh. Nur zu spät, wenn Micha sie gefunden hat.", antworten: [
      { text: "Da hast du recht.", weiter: "k2" },
      { text: "Dann versteck sie gut.", weiter: "k5" } ] },
    k4: { sagt: "Ein Huhn, natürlich! Dann gibt es dieses Jahr Hühnerplätzchen mit gelbem Zuckerguss.", antworten: [
      { text: "Das Hühnchen wird geschmeichelt sein.", weiter: "k5" },
      { text: "Mit grünem Sockel, bitte.", weiter: "k5" } ] },
    k5: { sagt: "Ich backe zuerst Vanillekipferl, dann sehen wir weiter. Kommst du zum Ausstechen?", antworten: [
      { text: "Ich bring meine Schürze.", weiter: "k6" },
      { text: "Ich bin Chef-Verkosterin.", weiter: "k6" } ] },
    k6: { sagt: "Abgemacht. Die ersten Kipferl gehören dir, egal ob sie krumm oder schön werden.", antworten: [
      { text: "Kipferl sollen ja krumm sein.", weiter: null },
      { text: "Ich freu mich riesig.", weiter: null } ] }
  },
  schluss: "Ich hör schon den Teig rufen. Bis bald, Rita!" },

{ id: "jane-10", wer: "jane", thema: "Probeessen",
  knoten: {
    start: { sagt: "Ich hab ein neues Rezept und brauch eine Probeesserin. Du bist die Einzige mit gutem Geschmack.", antworten: [
      { text: "Was ist es denn?", weiter: "k2" },
      { text: "Wann soll ich kommen?", weiter: "k3" } ] },
    k2: { sagt: "Eine Kürbis-Quiche mit Walnüssen. Klingt fein, oder? Ich hab sie schon dreimal in Gedanken gebacken.", antworten: [
      { text: "In Gedanken schmeckt alles.", weiter: "k4" },
      { text: "Klingt himmlisch.", weiter: "k4" } ] },
    k3: { sagt: "Am liebsten sofort, aber ich hab noch nicht angefangen. Sagen wir Donnerstag.", antworten: [
      { text: "Donnerstag steht auf meiner Liste.", weiter: "k2" },
      { text: "Was gibt’s denn?", weiter: "k2" } ] },
    k4: { sagt: "Du musst aber ganz ehrlich sein. Nicht so wie Micha, der sagt zu allem „lecker“.", antworten: [
      { text: "Ich bin gnadenlos ehrlich.", weiter: "k5" },
      { text: "Ich vergebe Sterne.", weiter: "k6" } ] },
    k5: { sagt: "Gnadenlos? Oh. Dann back ich lieber gleich zwei, falls die erste durchfällt.", antworten: [
      { text: "Bei dir fällt nichts durch.", weiter: null },
      { text: "Gute Strategie.", weiter: null } ] },
    k6: { sagt: "Sterne! Wie viele gibt’s maximal? Ich will alle.", antworten: [
      { text: "Fünf Sterne und ein Hühnchen.", weiter: null },
      { text: "Das kommt auf den Nachtisch an.", weiter: null } ] }
  },
  schluss: "Ich fang gleich mal mit der ersten an. Für die Wissenschaft." },

{ id: "jane-11", wer: "jane", thema: "Jane will tanzen",
  knoten: {
    start: { sagt: "Du bringst deinem Nachbarn Tanzen bei, hab ich gehört. Ich will auch. Aber ich warne dich, ich trete.", antworten: [
      { text: "Wir fangen ganz einfach an.", weiter: "k2" },
      { text: "Ich hab Stahlkappenschuhe.", weiter: "k3" } ] },
    k2: { sagt: "Einfach ist gut. Ich kann sehr gut im Takt umrühren, zählt das?", antworten: [
      { text: "Das ist schon halber Walzer.", weiter: "k4" },
      { text: "Nur mit Kochlöffel als Partner.", weiter: "k5" } ] },
    k3: { sagt: "Haha! Dann sind wir ja beide geschützt. Ich trage auch immer Topflappen, sicherheitshalber.", antworten: [
      { text: "Topflappen sind keine Tanzhandschuhe.", weiter: "k2" },
      { text: "Bring sie ruhig mit.", weiter: "k2" } ] },
    k4: { sagt: "Walzer in der Küche, das gefällt mir. Hildegard, mein Ofen, macht die Musik mit ihrem Ticken.", antworten: [
      { text: "Ein sehr rhythmischer Ofen.", weiter: "k6" },
      { text: "Ich bring lieber Musik mit.", weiter: "k6" } ] },
    k5: { sagt: "Der Kochlöffel ist ein sehr verlässlicher Partner. Er tritt nie und er widerspricht nicht.", antworten: [
      { text: "Das kann nicht jeder sagen.", weiter: "k6" },
      { text: "Dann schlag ich Michas Platz vor.", weiter: "k6" } ] },
    k6: { sagt: "Abgemacht, wir tanzen nach dem Sonntagsessen. Dann ist der Braten gleich wieder weg.", antworten: [
      { text: "Ich freu mich auf dich.", weiter: null },
      { text: "Und eins, zwei, drei!", weiter: null } ] }
  },
  schluss: "Ich übe schon mal mit dem Kochlöffel. Bis bald, Rita!" },

{ id: "jane-12", wer: "jane", thema: "Einkaufsliste",
  knoten: {
    start: { sagt: "Rita, hilf mir. Ich steh im Laden und hab meine Einkaufsliste zu Hause liegen lassen.", antworten: [
      { text: "Was wolltest du backen?", weiter: "k2" },
      { text: "Ich diktiere dir meine.", weiter: "k3" } ] },
    k2: { sagt: "Einen Zitronenkuchen, glaub ich, oder war es Mohn? Irgendwas mit Gelb oder Grau.", antworten: [
      { text: "Kauf beides, sicher ist sicher.", weiter: "k4" },
      { text: "Zitrone. Mohn ist grau-blau.", weiter: "k4" } ] },
    k3: { sagt: "Deine Liste? Die ist bestimmt alphabetisch sortiert. Dann fangen wir mit A an.", antworten: [
      { text: "A wie Äpfel.", weiter: "k5" },
      { text: "Natürlich alphabetisch.", weiter: "k5" } ] },
    k4: { sagt: "Ich hab jetzt Zitronen, Mohn und aus Versehen ein Glas Gurken im Korb. Die Gurken hab ich mir nicht erklärt.", antworten: [
      { text: "Gurkenkuchen? Revolutionär.", weiter: "k6" },
      { text: "Die sind für Micha.", weiter: "k6" } ] },
    k5: { sagt: "Äpfel, Butter, Eier … Rita, das ist ja eine Kuchenliste! Du hast heimlich vor zu backen.", antworten: [
      { text: "Erwischt.", weiter: "k6" },
      { text: "Die Liste ist für dich.", weiter: "k6" } ] },
    k6: { sagt: "Weißt du was, ich nehm einfach alles mit. Irgendwas wird schon draus.", antworten: [
      { text: "Bei dir wird immer was draus.", weiter: null },
      { text: "Ich freu mich aufs Ergebnis.", weiter: null } ] }
  },
  schluss: "Ich muss an die Kasse. Sie gucken schon, weil ich mit dem Korb telefoniere." },

{ id: "jane-13", wer: "jane", thema: "Die Geheimzutat in der Soße",
  knoten: {
    start: { sagt: "Micha sagt, meine Soße hätte eine Geheimzutat. Er hat recht, aber ich sag sie nicht.", antworten: [
      { text: "Mir sagst du sie doch.", weiter: "k2" },
      { text: "Ich rate. Ist es Rotwein?", weiter: "k3" } ] },
    k2: { sagt: "Dir? Na gut, aber nur flüsternd. Komm näher ans Telefon.", antworten: [
      { text: "Ich bin ganz Ohr.", weiter: "k4" },
      { text: "Näher geht nicht.", weiter: "k4" } ] },
    k3: { sagt: "Kalt. Rotwein ist kein Geheimnis, das ist Grundausstattung.", antworten: [
      { text: "Eine Prise Zucker?", weiter: "k5" },
      { text: "Gib mir einen Tipp.", weiter: "k2" } ] },
    k4: { sagt: "Die Geheimzutat ist … Geduld. Und ein Löffel Johannisbeergelee.", antworten: [
      { text: "Johannisbeergelee! Ich wusste es.", weiter: "k6" },
      { text: "Geduld hab ich nicht im Schrank.", weiter: "k6" } ] },
    k5: { sagt: "Warm! Sehr warm. Es ist süß und rot und kommt aus einem Glas mit kariertem Deckel.", antworten: [
      { text: "Johannisbeergelee!", weiter: "k6" },
      { text: "Erdbeermarmelade?", weiter: "k4" } ] },
    k6: { sagt: "Psst! Jetzt bist du eingeweiht. Wenn du es verrätst, gibt es für dich nur noch Kartoffeln ohne Soße.", antworten: [
      { text: "Ich schweige wie das Hühnchen.", weiter: null },
      { text: "Das ist eine harte Strafe.", weiter: null } ] }
  },
  schluss: "Und Micha weiß es immer noch nicht. So soll es bleiben." },

{ id: "jane-14", wer: "jane", thema: "Die Küchenwaage",
  knoten: {
    start: { sagt: "Meine Küchenwaage spinnt. Sie zeigt bei einem Ei 412 Gramm an.", antworten: [
      { text: "Ein Riesenei!", weiter: "k2" },
      { text: "Hast du den Daumen drauf?", weiter: "k3" } ] },
    k2: { sagt: "Ich hab es genau angeschaut. Es ist ein ganz normales Ei, nur die Waage hält es für einen Strauß.", antworten: [
      { text: "Vielleicht braucht sie Batterien.", weiter: "k4" },
      { text: "Back ohne Waage, nach Gefühl.", weiter: "k5" } ] },
    k3: { sagt: "Oh, ja, Daumen weg, jetzt sind es 63 Gramm. Ich hab einen 349-Gramm-Daumen.", antworten: [
      { text: "Ein sehr kräftiger Daumen.", weiter: "k4" },
      { text: "Den nehmen wir ins Rezept.", weiter: "k5" } ] },
    k4: { sagt: "Jedenfalls hab ich heute gelernt, dass man der Waage nicht alles glauben darf.", antworten: [
      { text: "Und dem Ofen?", weiter: "k6" },
      { text: "Dafür hast du ja Gefühl.", weiter: "k5" } ] },
    k5: { sagt: "Nach Gefühl backen kann ich am besten. Meine Kuchen kennen mich und ich kenne sie.", antworten: [
      { text: "Das ist wahre Freundschaft.", weiter: null },
      { text: "Und sie gelingen trotzdem.", weiter: null } ] },
    k6: { sagt: "Dem Ofen glaub ich alles. Aber ich geb ihm auch nicht so viele Gelegenheiten zu lügen.", antworten: [
      { text: "Kluge Frau.", weiter: null },
      { text: "Grüß Hildegard von mir.", weiter: null } ] }
  },
  schluss: "Ich wieg jetzt die Butter. Mit beiden Daumen weg." },

{ id: "jane-15", wer: "jane", thema: "Kürbissuppe",
  knoten: {
    start: { sagt: "Oktober, Rita! Kürbiszeit. Ich hab einen Kürbis gekauft, der größer ist als mein Kopf.", antworten: [
      { text: "Wie willst du den schneiden?", weiter: "k2" },
      { text: "Mach ein Gesicht rein!", weiter: "k3" } ] },
    k2: { sagt: "Mit dem großen Messer und viel Entschlossenheit. Und ein bisschen Fluchen, aber das zählt ja nicht.", antworten: [
      { text: "Fluchen gehört dazu.", weiter: "k4" },
      { text: "Lass Micha das machen.", weiter: "k4" } ] },
    k3: { sagt: "Ein Gesicht? Er guckt jetzt schon so gemütlich. Ich glaub, ich bring es nicht übers Herz.", antworten: [
      { text: "Dann bleibt er Deko.", weiter: "k5" },
      { text: "Suppe ist auch ein schönes Schicksal.", weiter: "k4" } ] },
    k4: { sagt: "Gut, Suppe. Mit Ingwer und einem Schuss Sahne, und Kürbiskerne obendrauf.", antworten: [
      { text: "Ich komm mit einem Löffel.", weiter: "k6" },
      { text: "Das duftet bis Spandau.", weiter: "k6" } ] },
    k5: { sagt: "Dann kauf ich mir einen zweiten für die Suppe. Und der erste schaut zu. Das ist vielleicht grausam.", antworten: [
      { text: "Er ist großzügig.", weiter: "k6" },
      { text: "Stell ihn ins Wohnzimmer.", weiter: "k6" } ] },
    k6: { sagt: "Ich koch einen ganzen Topf. Wer Suppe will, muss nur in die Binger Straße kommen.", antworten: [
      { text: "Ich bin schon unterwegs.", weiter: null },
      { text: "Heb mir eine Schüssel auf.", weiter: null } ] }
  },
  schluss: "So, ich geh dem Kürbis jetzt gegenübertreten." },

{ id: "jane-16", wer: "jane", thema: "Butterbier",
  knoten: {
    start: { sagt: "Rita, du liest doch Harry Potter. Was ist eigentlich dieses Butterbier? Ich will es nachkochen.", antworten: [
      { text: "Es ist süß und wärmt.", weiter: "k2" },
      { text: "Das ist erfunden, Jane.", weiter: "k3" } ] },
    k2: { sagt: "Süß und warm, das klingt nach meiner Küche. Ich nehme Karamell, Milch und eine Prise Zauberei.", antworten: [
      { text: "Woher nimmst du die Zauberei?", weiter: "k4" },
      { text: "Probier eine Butterflocke dazu.", weiter: "k4" } ] },
    k3: { sagt: "Erfunden? Das hat mich noch nie aufgehalten. Meine besten Rezepte waren am Anfang auch erfunden.", antworten: [
      { text: "Na dann, ran an den Topf.", weiter: "k2" },
      { text: "Wie der Gurkenkuchen?", weiter: "k5" } ] },
    k4: { sagt: "Die Zauberei kommt vom Umrühren gegen den Uhrzeigersinn. Hab ich gerade beschlossen.", antworten: [
      { text: "Klingt sehr magisch.", weiter: "k6" },
      { text: "Wir machen das zusammen.", weiter: "k6" } ] },
    k5: { sagt: "Gurkenkuchen gibt es nicht! Das war nur so ein Gedanke im Laden.", antworten: [
      { text: "Noch nicht.", weiter: "k2" },
      { text: "Gut, dann Butterbier.", weiter: "k2" } ] },
    k6: { sagt: "Beim nächsten Besuch gibt’s Butterbier aus Omas Tassen. Und du liest mir ein Kapitel vor.", antworten: [
      { text: "Abgemacht, ich such ein gutes aus.", weiter: null },
      { text: "Ich bring das Hühnchen mit.", weiter: null } ] }
  },
  schluss: "Ich rühr dann mal gegen den Uhrzeigersinn. Bis bald!" },

{ id: "jane-17", wer: "jane", thema: "Küchenklatsch",
  knoten: {
    start: { sagt: "Ich hab Neuigkeiten aus meiner Küche. Der Toaster und der Wasserkocher reden nicht mehr miteinander.", antworten: [
      { text: "Was ist passiert?", weiter: "k2" },
      { text: "Wer hat angefangen?", weiter: "k3" } ] },
    k2: { sagt: "Der Wasserkocher war heute Morgen schneller fertig. Der Toaster findet, das war unfair.", antworten: [
      { text: "Der Toaster ist ein schlechter Verlierer.", weiter: "k4" },
      { text: "Zum Frühstück zählen beide.", weiter: "k5" } ] },
    k3: { sagt: "Der Toaster, eindeutig. Er hat eine Scheibe zu früh rausgeworfen, aus Protest.", antworten: [
      { text: "Was sagt denn Hildegard dazu?", weiter: "k5" },
      { text: "Ein Toaster mit Temperament.", weiter: "k4" } ] },
    k4: { sagt: "Er hat immer schon so getan, als wäre er der Wichtigste. Dabei backt er nicht mal Kuchen.", antworten: [
      { text: "Das kann nur Hildegard.", weiter: "k5" },
      { text: "Bei mir toastet das Hühnchen.", weiter: "k6" } ] },
    k5: { sagt: "Hildegard, also der Ofen, hält sich raus. Sie steht über solchen Dingen, wortwörtlich, sie ist höher.", antworten: [
      { text: "Eine weise Ofendame.", weiter: null },
      { text: "Hoffentlich vertragen sie sich bald.", weiter: null } ] },
    k6: { sagt: "Das Hühnchen toastet? Ach, du meinst, es spricht einen Toast aus. Na, dann soll es auf den Frieden in meiner Küche anstoßen.", antworten: [
      { text: "Auf den Frieden!", weiter: null },
      { text: "Ich richte es aus.", weiter: null } ] }
  },
  schluss: "Ich halte dich auf dem Laufenden. Die Kaffeemaschine hat auch schon was gehört." },

{ id: "jane-18", wer: "jane", thema: "Ein Blech zu viel",
  knoten: {
    start: { sagt: "Rita, ich hab ein Blech Pflaumenkuchen zu viel gebacken. Rein zufällig, versteht sich.", antworten: [
      { text: "Wie viele Bleche hast du gebacken?", weiter: "k2" },
      { text: "Ganz zufällig, natürlich.", weiter: "k3" } ] },
    k2: { sagt: "Drei. Eins für uns, eins für die Nachbarn und eins für dich. Das dritte ist das zu viele.", antworten: [
      { text: "Das dritte ist das wichtigste.", weiter: "k4" },
      { text: "Willst du, dass ich es hole?", weiter: "k5" } ] },
    k3: { sagt: "Ja, wirklich. Meine Hand ist einfach noch mal zum Mehl gegangen. Ich konnte nichts tun.", antworten: [
      { text: "Diese Hand ist großartig.", weiter: "k4" },
      { text: "Wie viele Bleche denn?", weiter: "k2" } ] },
    k4: { sagt: "Ich wusste, dass du das sagst. Ich hab schon Sahne geschlagen, ebenfalls zufällig.", antworten: [
      { text: "Was für ein Zufall!", weiter: "k5" },
      { text: "Die Zufälle häufen sich.", weiter: "k5" } ] },
    k5: { sagt: "Max kommt bald bei dir vorbei, den schick ich mit dem Kuchen los. Er darf ein Stück unterwegs essen, mehr nicht.", antworten: [
      { text: "Ich zähle die Stücke nach.", weiter: null },
      { text: "Er schafft bestimmt zwei.", weiter: "k6" } ] },
    k6: { sagt: "Zwei? Dann back ich vorsichtshalber noch ein viertes Blech. Rein zufällig, versteht sich.", antworten: [
      { text: "Du bist unverbesserlich.", weiter: null },
      { text: "Ich freu mich auf alle.", weiter: null } ] }
  },
  schluss: "Ich hab dich lieb, Rita. Und jetzt such ich die Kuchenbox." }
];
