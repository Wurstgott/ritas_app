/* Spaß-Telefon: kleine Dialogspiele mit Hühnchen, Max und Christiane.
   Reines Datenobjekt. weiter:null = Gespräch endet nach dieser Antwort. */
D.anrufe = [

/* ==================== HÜHNCHEN ==================== */

{ id: "huhn-01", wer: "huhn", thema: "Durchzug",
  knoten: {
    start: { sagt: "Sag mal, hast du schon wieder das Fenster auf? Ich steh hier genau im Zug.", antworten: [
      { text: "Nur zehn Minuten, das muss sein.", weiter: "k2" },
      { text: "Du bist aus Ton, dir ist nie kalt.", weiter: "k3" } ] },
    k2: { sagt: "Zehn Minuten, sagst du. Ich zähl mit, und ich bin schon bei elf.", antworten: [
      { text: "Du kannst doch gar nicht zählen.", weiter: "k4" },
      { text: "Gut, ich mach gleich zu.", weiter: "k4" } ] },
    k3: { sagt: "Im Brennofen waren es neunhundert Grad. Dagegen ist das hier Nordpol.", antworten: [
      { text: "Du warst genau einmal im Ofen.", weiter: "k4" },
      { text: "Soll ich dir einen Schal stricken?", weiter: "k5" } ] },
    k4: { sagt: "Einmal reicht, das prägt einen. Kannst du mich wenigstens ein Stück Richtung Heizung rücken?", antworten: [
      { text: "Zwei Zentimeter. Mehr nicht.", weiter: null },
      { text: "Dann stehst du vorm Hasen.", weiter: "k6" } ] },
    k5: { sagt: "Einen Schal? Ich hab keinen Hals, Rita. Aber nett, dass du fragst.", antworten: [
      { text: "Dann ein Deckchen unter den Sockel.", weiter: "k4" },
      { text: "Irgendwo ist da ein Hals.", weiter: "k4" } ] },
    k6: { sagt: "Der Hase steht seit Jahren da und kriegt die ganze Wärme ab. Das ist nicht gerecht.", antworten: [
      { text: "Na gut, ihr tauscht bis Sonntag.", weiter: null },
      { text: "Der Hase war zuerst da.", weiter: null } ] }
  },
  schluss: "Ich sag nichts mehr. Ich frier jetzt still vor mich hin." },

{ id: "huhn-02", wer: "huhn", thema: "Der Krimi gestern",
  knoten: {
    start: { sagt: "Den Krimi gestern hab ich mitgeguckt. Weggucken ging nicht, meine Augen sind aufgemalt.", antworten: [
      { text: "War’s dir zu spannend?", weiter: "k2" },
      { text: "Und, wer war’s deiner Meinung nach?", weiter: "k3" } ] },
    k2: { sagt: "Bei der Stelle im Keller hab ich mich hinterm Hasen versteckt. Innerlich.", antworten: [
      { text: "Da hab ich auch geschluckt.", weiter: "k4" },
      { text: "Der Hase hat nichts gemerkt.", weiter: "k4" } ] },
    k3: { sagt: "Der Pfarrer. Der hat so geguckt, und mit Gucken kenn ich mich aus.", antworten: [
      { text: "Falsch. Es war die Schwester.", weiter: "k4" },
      { text: "Der Pfarrer war’s nicht.", weiter: "k4" } ] },
    k4: { sagt: "Na ja. Nächstes Mal sagst du mir vorher, wann ich weggucken soll.", antworten: [
      { text: "Abgemacht. Ich warn dich vorm Keller.", weiter: "k5" },
      { text: "Aber dann nichts verraten, ja?", weiter: "k6" } ] },
    k5: { sagt: "Und mach nicht wieder das Licht aus, wenn’s spannend wird. Für mich ist das doppelt dunkel.", antworten: [
      { text: "Na gut, die Stehlampe bleibt an.", weiter: null },
      { text: "Dann gucken wir am Nachmittag.", weiter: null } ] },
    k6: { sagt: "Wem soll ich’s denn verraten? Das Schwein hört eh nie zu.", antworten: [
      { text: "Das Schwein ist sehr verschwiegen.", weiter: null },
      { text: "Gut, dann guckst du wieder mit.", weiter: null } ] }
  },
  schluss: "Heute Abend wieder? Ich steh schon mal Richtung Fernseher." },

{ id: "huhn-03", wer: "huhn", thema: "Glücksschwein",
  knoten: {
    start: { sagt: "Das Glücksschwein behauptet, es bringt mehr Glück als ich. Seit Silvester redet es von nichts anderem.", antworten: [
      { text: "Und was bringst du so?", weiter: "k2" },
      { text: "Soll ich mal mit ihm reden?", weiter: "k3" } ] },
    k2: { sagt: "Ich pass auf. Wenn du deinen Schlüssel suchst, weiß ich immer, wo er liegt.", antworten: [
      { text: "Und warum sagst du’s nie?", weiter: "k4" },
      { text: "Das ist tatsächlich was wert.", weiter: "k5" } ] },
    k3: { sagt: "Bloß nicht, dann fühlt es sich wichtig. Es ist eh schon so rund vor Stolz.", antworten: [
      { text: "Schweine sind nun mal rund.", weiter: "k5" },
      { text: "Gut, ich ignorier es eine Woche.", weiter: "k5" } ] },
    k4: { sagt: "Ich darf ja nichts sagen, ich bin Deko. Aber ich guck dann ganz doll in die Richtung.", antworten: [
      { text: "Ab jetzt guck ich, wohin du guckst.", weiter: "k5" },
      { text: "Ganz doll guckst du nie.", weiter: "k5" } ] },
    k5: { sagt: "Ich schlag vor, wir machen einen Wettbewerb bis Sonntag. Du führst Strichliste, das kannst du ja.", antworten: [
      { text: "Gut. Ein Strich für den Schlüssel.", weiter: "k6" },
      { text: "Und wer ist Schiedsrichter?", weiter: "k6" } ] },
    k6: { sagt: "Der Hase. Der ist neutral, der redet mit keinem von uns.", antworten: [
      { text: "Dann ist das fair.", weiter: null },
      { text: "Der schläft doch die ganze Zeit.", weiter: null } ] }
  },
  schluss: "So. Ich konzentrier mich jetzt aufs Glück. Das Schwein soll sich warm anziehen." },

{ id: "huhn-04", wer: "huhn", thema: "Der grüne Hase",
  knoten: {
    start: { sagt: "Der Hase redet nicht mehr mit mir. Gut, er hat noch nie geredet, aber jetzt merkt man’s.", antworten: [
      { text: "Habt ihr euch gestritten?", weiter: "k2" },
      { text: "Vielleicht hat er schlechte Laune.", weiter: "k3" } ] },
    k2: { sagt: "Ich hab gesagt, Grün ist keine Farbe für einen Hasen. Das kam vielleicht falsch an.", antworten: [
      { text: "Und Ocker ist eine fürs Huhn?", weiter: "k4" },
      { text: "Na, das war auch frech.", weiter: "k4" } ] },
    k3: { sagt: "Seit du ihn umgestellt hast, guckt er auf die Wand. Da würd ich auch schlechte Laune kriegen.", antworten: [
      { text: "Oh. Das war beim Staubwischen.", weiter: "k5" },
      { text: "Die Wand ist frisch gestrichen.", weiter: "k4" } ] },
    k4: { sagt: "Ja ja, schon gut. Was soll ich jetzt machen, ich kann ja schlecht rübergehen.", antworten: [
      { text: "Ich dreh ihn ein bisschen zu dir.", weiter: "k6" },
      { text: "Sag einfach Entschuldigung.", weiter: "k6" } ] },
    k5: { sagt: "Dann dreh ihn bitte zurück. Am besten zu mir, ich bin die schönere Aussicht.", antworten: [
      { text: "Bescheiden wie immer.", weiter: "k6" },
      { text: "Gut, er kriegt dich zu sehen.", weiter: "k6" } ] },
    k6: { sagt: "Hm. Er guckt. Ich glaub, das wird wieder.", antworten: [
      { text: "Na siehst du.", weiter: null },
      { text: "Jetzt vertragt euch aber.", weiter: null } ] }
  },
  schluss: "Ich sag ihm jetzt, dass Grün doch ganz schön ist. Leise, damit’s keiner hört." },

{ id: "huhn-05", wer: "huhn", thema: "Hogwarts",
  knoten: {
    start: { sagt: "Ich les bei dir mit, über die Schulter. Du blätterst übrigens zu schnell um.", antworten: [
      { text: "Du kannst doch gar nicht lesen.", weiter: "k2" },
      { text: "Wo bist du denn gerade?", weiter: "k3" } ] },
    k2: { sagt: "Die Kapitelüberschriften schon, die sind groß. Den Rest denk ich mir.", antworten: [
      { text: "Und, was denkst du dir so?", weiter: "k4" },
      { text: "Das machen manche Kritiker auch.", weiter: "k4" } ] },
    k3: { sagt: "Bei den Drachen. Ehrlich gesagt erinnern die mich an meinen Brennofen.", antworten: [
      { text: "Keine Sorge, das geht gut aus.", weiter: "k4" },
      { text: "Dann blätter ich da langsamer.", weiter: "k4" } ] },
    k4: { sagt: "Sag mal, in welches Haus würd ich eigentlich kommen?", antworten: [
      { text: "Hufflepuff. Treu und gelb.", weiter: "k5" },
      { text: "Slytherin, so wie du guckst.", weiter: "k6" } ] },
    k5: { sagt: "Hab ich mir auch gedacht. Die haben, glaub ich, auch das bessere Essen.", antworten: [
      { text: "Du isst doch gar nichts.", weiter: null },
      { text: "Und sie sind nett zueinander.", weiter: null } ] },
    k6: { sagt: "Ich guck nicht so, das ist die Glasur. Aber ehrgeizig bin ich schon, das stimmt.", antworten: [
      { text: "Na also. Grün steht dir.", weiter: null },
      { text: "Gut, dann doch Hufflepuff.", weiter: null } ] }
  },
  schluss: "Lies ruhig weiter. Ich sag Bescheid, wenn du umblättern darfst." },

{ id: "huhn-06", wer: "huhn", thema: "Hühnchen auf die Liste",
  knoten: {
    start: { sagt: "Ich hab deine Liste am Kühlschrank gesehen. Ich steh da gar nicht drauf.", antworten: [
      { text: "Was soll ich denn schreiben?", weiter: "k2" },
      { text: "Das ist meine Einkaufsliste.", weiter: "k3" } ] },
    k2: { sagt: "„Hühnchen abstauben“ zum Beispiel. Oder „Hühnchen was Nettes sagen“.", antworten: [
      { text: "Das Zweite mach ich gleich.", weiter: "k4" },
      { text: "Abgestaubt hab ich doch Montag.", weiter: "k5" } ] },
    k3: { sagt: "Ach so. Dann will ich da erst recht nicht drauf, zwischen Quark und Klopapier.", antworten: [
      { text: "Gut, du kriegst eine eigene.", weiter: "k2" },
      { text: "Quark ist doch was Feines.", weiter: "k2" } ] },
    k4: { sagt: "Na los, ich warte.", antworten: [
      { text: "Du bist das hübscheste Huhn hier.", weiter: "k6" },
      { text: "Deine Glasur glänzt heute so.", weiter: "k6" } ] },
    k5: { sagt: "Montag ist lange her. Ich spür schon wieder was auf dem Kopf.", antworten: [
      { text: "Na gut, Freitag wird gewischt.", weiter: "k6" },
      { text: "Das ist dein Kamm.", weiter: "k6" } ] },
    k6: { sagt: "Danke. Das kannst du jetzt abhaken.", antworten: [
      { text: "Abgehakt. Mit Ausrufezeichen.", weiter: null },
      { text: "Steht nächste Woche wieder drauf.", weiter: null } ] }
  },
  schluss: "Ich steh jetzt ein bisschen gerader. Merkt keiner außer mir." },

{ id: "huhn-07", wer: "huhn", thema: "Die Meise am Fenster",
  knoten: {
    start: { sagt: "Draußen sitzt wieder diese Meise. Die guckt mich an, als wär ich nicht echt.", antworten: [
      { text: "Na ja, bist du ja auch nicht.", weiter: "k2" },
      { text: "Die will bloß ans Futter.", weiter: "k3" } ] },
    k2: { sagt: "Ich bin echt. Echter Ton. Die ist bloß echte Meise.", antworten: [
      { text: "Da hast du auch wieder recht.", weiter: "k4" },
      { text: "Sie kann aber fliegen.", weiter: "k5" } ] },
    k3: { sagt: "Futter? Du fütterst die? Ich krieg nie was.", antworten: [
      { text: "Du hast keinen Magen, Hühnchen.", weiter: "k4" },
      { text: "Du kriegst dafür mein Ohr.", weiter: "k4" } ] },
    k4: { sagt: "Trotzdem. Die soll nicht so tun, die ist ja winzig.", antworten: [
      { text: "Klein, aber sie kommt jeden Tag.", weiter: "k6" },
      { text: "Du bist auch nicht riesig.", weiter: "k6" } ] },
    k5: { sagt: "Fliegen, pff. Dafür kann ich stillstehen, das schafft die keine fünf Sekunden.", antworten: [
      { text: "Stimmt, die zappelt ständig.", weiter: "k6" },
      { text: "Das wär ein unfairer Wettkampf.", weiter: "k6" } ] },
    k6: { sagt: "Weißt du was, sag ihr, sie darf mich angucken. Aber von draußen.", antworten: [
      { text: "Ich richt’s ihr aus.", weiter: null },
      { text: "Sehr großzügig von dir.", weiter: null } ] }
  },
  schluss: "Sie ist weg. Na also. Der Vogel hier drin bin immer noch ich." },

{ id: "huhn-08", wer: "huhn", thema: "Postkarte an die Töpferei",
  knoten: {
    start: { sagt: "Ich will eine Karte schreiben. An die Werkstatt, wo sie mich gemacht haben.", antworten: [
      { text: "Was willst du denn schreiben?", weiter: "k2" },
      { text: "Und wer schreibt? Du hast keine Hände.", weiter: "k3" } ] },
    k2: { sagt: "„Mir geht’s gut, ich steh in Berlin, hier ist es kalt, aber ich wohne bei Rita.“", antworten: [
      { text: "Schreib noch was über mich.", weiter: "k4" },
      { text: "Kalt ist es nur beim Lüften.", weiter: "k4" } ] },
    k3: { sagt: "Du. Du hast doch die schönen Stifte, ich diktier.", antworten: [
      { text: "Na gut, ich hol den Füller.", weiter: "k2" },
      { text: "Und was krieg ich dafür?", weiter: "k5" } ] },
    k4: { sagt: "„PS: Sie lacht viel und schreibt Listen. Ich hab den besten Platz im Regal.“", antworten: [
      { text: "Das ist lieb. Stimmt auch.", weiter: "k6" },
      { text: "Den Platz hab ich ausgesucht.", weiter: "k6" } ] },
    k5: { sagt: "Ich guck dich einen Monat lang freundlich an. Ohne Pause.", antworten: [
      { text: "Das machst du sowieso.", weiter: "k2" },
      { text: "Abgemacht, das ist ein Lohn.", weiter: "k2" } ] },
    k6: { sagt: "Jetzt noch die Briefmarke. Ich würd ja lecken, aber ich bin glasiert.", antworten: [
      { text: "Die klebt von selbst.", weiter: null },
      { text: "Ich mach das schon.", weiter: null } ] }
  },
  schluss: "Die darf ruhig lange unterwegs sein. Ich hab keine Eile." },

{ id: "huhn-09", wer: "huhn", thema: "Eier legen",
  knoten: {
    start: { sagt: "Ich muss dir was gestehen. Ich hab noch nie ein Ei gelegt.", antworten: [
      { text: "Das hat auch keiner erwartet.", weiter: "k2" },
      { text: "Möchtest du denn eins?", weiter: "k3" } ] },
    k2: { sagt: "Doch, das Schwein. Das fragt jeden Morgen, ob heute was kommt.", antworten: [
      { text: "Das Schwein soll sich benehmen.", weiter: "k4" },
      { text: "Sag ihm, du hast Urlaub.", weiter: "k4" } ] },
    k3: { sagt: "Ich hab’s grad mal probiert. Es hat geknackt, aber das war das Regal.", antworten: [
      { text: "Lass das lieber, bevor was bricht.", weiter: "k4" },
      { text: "Das Regal knackt immer.", weiter: "k4" } ] },
    k4: { sagt: "Ich glaub, ich bin einfach kein Ei-Typ. Ich bin mehr zum Angucken.", antworten: [
      { text: "Und das machst du sehr gut.", weiter: "k5" },
      { text: "Eier hol ich eh im Hofladen.", weiter: "k6" } ] },
    k5: { sagt: "Danke. Ich üb ja auch jeden Tag.", antworten: [
      { text: "Merkt man.", weiter: null },
      { text: "Morgen wieder, gleiche Zeit.", weiter: null } ] },
    k6: { sagt: "Im Hofladen? Was gibt’s da sonst noch so?", antworten: [
      { text: "Kartoffeln. Äpfel. Nichts Besonderes.", weiter: null },
      { text: "Ach, nur Gemüse. Ganz langweilig.", weiter: null } ] }
  },
  schluss: "Na gut. Dann bin ich hier eben die ohne Eier. Steht mir auch." },

{ id: "huhn-10", wer: "huhn", thema: "Staubwischen",
  knoten: {
    start: { sagt: "Ich seh das Tuch, du wischst heute Staub. Bei mir bitte den Pinsel, nicht das nasse Ding.", antworten: [
      { text: "Warum denn nicht nass?", weiter: "k2" },
      { text: "Wer sagt, dass du dran bist?", weiter: "k3" } ] },
    k2: { sagt: "Da krieg ich Streifen auf die Glasur. Und dann guckt der Hase.", antworten: [
      { text: "Gut, du kriegst den Pinsel.", weiter: "k4" },
      { text: "Der Hase guckt sowieso.", weiter: "k4" } ] },
    k3: { sagt: "Ich steh ganz vorne, also bin ich als Erste dran. Das ist Regalordnung.", antworten: [
      { text: "Die hast du dir ausgedacht.", weiter: "k4" },
      { text: "Na gut, du zuerst.", weiter: "k4" } ] },
    k4: { sagt: "Ah, ja, schön. Hinten am Sockel, da, wo’s kitzelt.", antworten: [
      { text: "Da war ja eine dicke Fluse.", weiter: "k5" },
      { text: "Halt still. Ganz sanft jetzt.", weiter: "k5" } ] },
    k5: { sagt: "Die wohnt da seit Ostern. Die hätt ich selber nie weggekriegt.", antworten: [
      { text: "Jetzt ist sie im Sauger.", weiter: null },
      { text: "Du hättest was sagen können.", weiter: "k6" } ] },
    k6: { sagt: "Hab ich doch. Ich hab die ganze Zeit hingeguckt, du hast es nur nicht gemerkt.", antworten: [
      { text: "Nächstes Mal guckst du lauter.", weiter: null },
      { text: "Gut, ich guck jetzt öfter hin.", weiter: null } ] }
  },
  schluss: "So. Ich glänze. Kannst ruhig mal kurz rübergucken." },

{ id: "huhn-11", wer: "huhn", thema: "Hühnchen im Handy",
  knoten: {
    start: { sagt: "Hast du gesehen? Ich bin jetzt in deinem Handy drin. Max hat mich da reingemalt.", antworten: [
      { text: "Ja, du bist gut getroffen.", weiter: "k2" },
      { text: "Wie fühlt sich das an?", weiter: "k3" } ] },
    k2: { sagt: "Findest du? Ich find, er hat mich ein bisschen breiter gemacht.", antworten: [
      { text: "Das Handy macht alle breiter.", weiter: "k4" },
      { text: "Du bist eben ein stattliches Huhn.", weiter: "k4" } ] },
    k3: { sagt: "Komisch. Ich steh hier und bin gleichzeitig da drin, und da drin red ich sogar.", antworten: [
      { text: "Hier redest du doch auch.", weiter: "k5" },
      { text: "Und da drin bist du netter.", weiter: "k5" } ] },
    k4: { sagt: "Hm. Sag Max, er soll das nochmal machen. Von links, da bin ich besser.", antworten: [
      { text: "Du bist nur vorne bemalt.", weiter: "k6" },
      { text: "Ich sag’s ihm beim nächsten Anruf.", weiter: "k6" } ] },
    k5: { sagt: "Frechheit. Da drin hab ich wenigstens Sprechblasen.", antworten: [
      { text: "Und ganz schön viele.", weiter: "k4" },
      { text: "Die schreibt aber Max.", weiter: "k4" } ] },
    k6: { sagt: "Jedenfalls nicht von oben. Von oben seh ich so platt aus.", antworten: [
      { text: "Ich richt’s ihm aus.", weiter: null },
      { text: "Du bist ganz schön eitel.", weiter: null } ] }
  },
  schluss: "Und wenn du mich da drin antippst, bitte vorsichtig. Ich bin da auch empfindlich." },

{ id: "huhn-12", wer: "huhn", thema: "Ein Blatt aus dem Forst",
  knoten: {
    start: { sagt: "Du warst im Forst, oder? Du hast ein Blatt am Ärmel.", antworten: [
      { text: "Ich hab ein Eichhörnchen gesehen.", weiter: "k2" },
      { text: "Das Blatt hab ich dir mitgebracht.", weiter: "k3" } ] },
    k2: { sagt: "Ein echtes? Was hat es gemacht?", antworten: [
      { text: "Nüsse vergraben und mich ignoriert.", weiter: "k4" },
      { text: "Mich angeguckt, ganz frech.", weiter: "k5" } ] },
    k3: { sagt: "Für mich? Leg’s mir hin, bitte. Direkt vor den Sockel.", antworten: [
      { text: "Da liegt es schön.", weiter: "k6" },
      { text: "Der Hase kriegt keins.", weiter: "k6" } ] },
    k4: { sagt: "Typisch. Die denken nur an Nüsse, für Kunst haben die keinen Blick.", antworten: [
      { text: "Du bist ja auch keine Nuss.", weiter: null },
      { text: "Nimm’s nicht persönlich.", weiter: null } ] },
    k5: { sagt: "Frech gucken kann ich auch. So wie ich jetzt?", antworten: [
      { text: "Fast. Es hatte mehr Fell.", weiter: "k4" },
      { text: "Nee, du guckst viel frecher.", weiter: "k4" } ] },
    k6: { sagt: "Danke. Das ist mein erstes Blatt. Ich pass gut drauf auf.", antworten: [
      { text: "Wenn’s trocken ist, press ich’s.", weiter: null },
      { text: "Morgen bring ich noch eins.", weiter: null } ] }
  },
  schluss: "Grüß den Forst von mir. Das Eichhörnchen nicht, das hat’s nicht verdient." },

{ id: "huhn-13", wer: "huhn", thema: "Zuschauen bei der Tanzstunde",
  knoten: {
    start: { sagt: "Du bringst doch dem Nachbarn Tanzen bei. Darf ich nächstes Mal zugucken?", antworten: [
      { text: "Wenn du still bist, ja.", weiter: "k2" },
      { text: "Willst du nicht lieber mittanzen?", weiter: "k3" } ] },
    k2: { sagt: "Ich bin immer still. Ich hab noch nie eine Tanzstunde gestört.", antworten: [
      { text: "Du warst ja auch nie in einer.", weiter: "k4" },
      { text: "Gut, du kommst aufs Fensterbrett.", weiter: "k4" } ] },
    k3: { sagt: "Mittanzen? Ich hab keine Beine, Rita. Das ist beim Tanzen ein Nachteil.", antworten: [
      { text: "Dann gibst du den Takt vor.", weiter: "k5" },
      { text: "Du hast Haltung, das reicht.", weiter: "k5" } ] },
    k4: { sagt: "Und wenn er dir auf den Fuß tritt, sag ich nichts. Ich guck nur.", antworten: [
      { text: "Das ist schlimmer als was sagen.", weiter: "k6" },
      { text: "Er tritt kaum noch, ehrlich.", weiter: "k6" } ] },
    k5: { sagt: "Takt kann ich. Ich steh einfach, und ihr dreht euch um mich rum.", antworten: [
      { text: "Wie um einen Maibaum.", weiter: "k4" },
      { text: "Dann bist du die Mitte.", weiter: "k4" } ] },
    k6: { sagt: "Ich bin halt eine strenge Zuschauerin. Aber gerecht.", antworten: [
      { text: "Dann bist du ab jetzt Jury.", weiter: null },
      { text: "Er wird sich anstrengen.", weiter: null } ] }
  },
  schluss: "Und eins, zwei, drei. Ich bin so weit, wenn ihr so weit seid." },

{ id: "huhn-14", wer: "huhn", thema: "Wie das Huhn telefoniert",
  knoten: {
    start: { sagt: "Du fragst dich bestimmt, wie ich ohne Hände telefonier.", antworten: [
      { text: "Ehrlich gesagt, ja.", weiter: "k2" },
      { text: "Ich frag lieber nicht.", weiter: "k3" } ] },
    k2: { sagt: "Ich guck so lange aufs Handy, bis es klingelt. Dauert manchmal.", antworten: [
      { text: "Wie lange denn?", weiter: "k4" },
      { text: "Hilft dir der Hase?", weiter: "k5" } ] },
    k3: { sagt: "Ist auch besser so. Sonst programmiert Max da wieder was.", antworten: [
      { text: "Na gut, sag schon.", weiter: "k2" },
      { text: "Warum rufst du überhaupt an?", weiter: "k6" } ] },
    k4: { sagt: "Heute seit halb neun. Ich hab ja keine Termine.", antworten: [
      { text: "Beneidenswert.", weiter: "k6" },
      { text: "Ich hab heute drei.", weiter: "k6" } ] },
    k5: { sagt: "Der Hase hilft nie. Der guckt nur zu und denkt sich seinen Teil.", antworten: [
      { text: "Das macht er bei mir auch.", weiter: "k6" },
      { text: "Wenigstens stört er nicht.", weiter: "k6" } ] },
    k6: { sagt: "Ich wollt eigentlich nur Hallo sagen. Hab ich jetzt.", antworten: [
      { text: "Hallo zurück, mein Hühnchen.", weiter: null },
      { text: "Ruf ruhig öfter an.", weiter: null } ] }
  },
  schluss: "So, jetzt guck ich wieder weg. Dann legt es von selbst auf." },

{ id: "huhn-15", wer: "huhn", thema: "Kreuzworträtsel",
  knoten: {
    start: { sagt: "Du sitzt schon ewig über dem Rätsel. Lies mal vor, ich helf dir.", antworten: [
      { text: "Hausvogel, vier Buchstaben.", weiter: "k2" },
      { text: "Du und Rätsel? Seit wann?", weiter: "k3" } ] },
    k2: { sagt: "Na? Da muss ich ja nicht lange überlegen.", antworten: [
      { text: "Huhn. Passt sogar.", weiter: "k4" },
      { text: "Gans hat auch vier.", weiter: "k5" } ] },
    k3: { sagt: "Ich steh den ganzen Tag neben deinen Rätseln. Da bleibt was hängen.", antworten: [
      { text: "Gut. Hausvogel, vier Buchstaben.", weiter: "k2" },
      { text: "Fluss in Berlin, fünf Buchstaben?", weiter: "k6" } ] },
    k4: { sagt: "Siehst du. Schreib’s groß, damit der Hase das sieht.", antworten: [
      { text: "Ganz groß, in Druckbuchstaben.", weiter: null },
      { text: "Jetzt bild dir nichts ein.", weiter: null } ] },
    k5: { sagt: "Gans, na toll. Und was steht im zweiten Kästchen?", antworten: [
      { text: "Ein U. Also doch Huhn.", weiter: "k4" },
      { text: "Gut, du hast recht.", weiter: "k4" } ] },
    k6: { sagt: "Spree oder Havel, such dir eins aus. Ich bin ein Fensterbank-Huhn, ich hab keine Ahnung.", antworten: [
      { text: "Havel. Das V passt.", weiter: "k4" },
      { text: "So weit war ich auch.", weiter: "k4" } ] }
  },
  schluss: "Und wenn mal wieder ein Hausvogel gesucht wird, du weißt, wen du fragst." },

{ id: "huhn-16", wer: "huhn", thema: "Das Lied im Radio",
  knoten: {
    start: { sagt: "Was war das vorhin im Radio? Das mit der Trompete?", antworten: [
      { text: "Keine Ahnung, ich hab nur mitgesummt.", weiter: "k2" },
      { text: "Hat’s dir gefallen?", weiter: "k3" } ] },
    k2: { sagt: "Du hast gesummt? Ich dachte, das war der Kühlschrank.", antworten: [
      { text: "Frechheit. Ich summe sehr schön.", weiter: "k4" },
      { text: "Der summt tiefer als ich.", weiter: "k4" } ] },
    k3: { sagt: "Ich hab ein bisschen mitgewippt. Innerlich, von außen sieht man das nicht.", antworten: [
      { text: "Ich hab’s trotzdem gesehen.", weiter: "k4" },
      { text: "Innerlich wippen zählt auch.", weiter: "k4" } ] },
    k4: { sagt: "Kannst du das nochmal anmachen? Das Schwein hat’s verschlafen.", antworten: [
      { text: "Das war Radio, das ist weg.", weiter: "k5" },
      { text: "Ich such’s dir im Handy raus.", weiter: "k6" } ] },
    k5: { sagt: "Einfach weg? So wie Wetter?", antworten: [
      { text: "Morgen kommt was anderes Schönes.", weiter: null },
      { text: "Ich summ’s dir nochmal vor.", weiter: null } ] },
    k6: { sagt: "Das kannst du? Hat dir das Max gezeigt?", antworten: [
      { text: "Das hab ich selbst rausgefunden.", weiter: null },
      { text: "Bisschen Max, bisschen ich.", weiter: null } ] }
  },
  schluss: "Aber nicht zu laut. Das Schwein ist empfindlich, auch wenn’s das nicht zugibt." },

{ id: "huhn-17", wer: "huhn", thema: "Mondlicht",
  knoten: {
    start: { sagt: "Bist du noch wach? Der Mond scheint mir genau auf den Kamm.", antworten: [
      { text: "Ich les noch ein bisschen.", weiter: "k2" },
      { text: "Soll ich die Gardine zuziehen?", weiter: "k3" } ] },
    k2: { sagt: "Gut. Dann bin ich nicht die Einzige, die noch guckt.", antworten: [
      { text: "Kannst du denn nicht schlafen?", weiter: "k4" },
      { text: "Du guckst doch immer.", weiter: "k4" } ] },
    k3: { sagt: "Nein, lass mal. Im Mondlicht seh ich richtig gut aus, so silbrig.", antworten: [
      { text: "Eitles Huhn.", weiter: "k4" },
      { text: "Na gut, die bleibt offen.", weiter: "k4" } ] },
    k4: { sagt: "Ich schlaf nie, ich hab keine Lider. Aber nachts ist es hier am schönsten, so ruhig.", antworten: [
      { text: "Bis du anrufst.", weiter: "k5" },
      { text: "Und morgens bin ich wieder da.", weiter: "k6" } ] },
    k5: { sagt: "Ich red ja leise. Das zählt nicht.", antworten: [
      { text: "Na gut, gilt nicht.", weiter: null },
      { text: "Dann flüstern wir weiter.", weiter: null } ] },
    k6: { sagt: "Weiß ich doch. Dann machst du das Licht an und sagst: Morgen, Hühnchen.", antworten: [
      { text: "Das sag ich jeden Morgen.", weiter: null },
      { text: "Und du sagst nie was zurück.", weiter: null } ] }
  },
  schluss: "Gute Nacht. Ich pass auf, bis es hell wird." },

{ id: "huhn-18", wer: "huhn", thema: "Brenntag",
  knoten: {
    start: { sagt: "Weißt du was? Ich glaub, heute ist mein Brenntag. So was wie Geburtstag.", antworten: [
      { text: "Herzlichen Glückwunsch, Hühnchen!", weiter: "k2" },
      { text: "Woher weißt du das denn?", weiter: "k3" } ] },
    k2: { sagt: "Danke! Singst du mir was? Aber nur eine Strophe, ich will nicht übertreiben.", antworten: [
      { text: "Zum Geburtstag viel Glück …", weiter: "k4" },
      { text: "Ich summ dir was.", weiter: "k4" } ] },
    k3: { sagt: "Gar nicht. Ich hab ihn mir ausgesucht, das darf man, wenn keiner aufgeschrieben hat, wann man aus dem Ofen kam.", antworten: [
      { text: "Gute Wahl, heute ist schönes Wetter.", weiter: "k2" },
      { text: "Dann such ich mir auch einen aus.", weiter: "k5" } ] },
    k4: { sagt: "Schön. Das Schwein hat nicht mitgesungen, aber ich glaub, es hat zugehört.", antworten: [
      { text: "Willst du ein Stück Kuchen?", weiter: "k6" },
      { text: "Und jetzt Geschenke?", weiter: "k6" } ] },
    k5: { sagt: "Nee, du hast doch schon einen. Einer pro Person, sonst wird’s unübersichtlich.", antworten: [
      { text: "Na gut, dann feiern wir deinen.", weiter: "k2" },
      { text: "Du bist ganz schön streng.", weiter: "k2" } ] },
    k6: { sagt: "Stell mir einfach einen Krümel hin. Ich guck ihn an, das reicht mir.", antworten: [
      { text: "Und den Rest ess ich für dich.", weiter: null },
      { text: "Mit Kerze?", weiter: null } ] }
  },
  schluss: "Das war schön. Nächstes Jahr such ich mir wieder diesen Tag aus." },

/* ==================== MAX ==================== */

{ id: "max-01", wer: "max", thema: "Besuch planen",
  knoten: {
    start: { sagt: "Na? Ich wollt nur sagen, ich komm bald mal vorbei. Am Wochenende oder am übernächsten.", antworten: [
      { text: "Welches denn nun?", weiter: "k2" },
      { text: "Dann bring Hunger mit.", weiter: "k3" } ] },
    k2: { sagt: "Das, wo der Zug fährt. Ich hab drei Verbindungen rausgesucht und alle wieder zugemacht.", antworten: [
      { text: "Ich schreib dir eine raus.", weiter: "k4" },
      { text: "Das ist so typisch du.", weiter: "k4" } ] },
    k3: { sagt: "Hunger hab ich immer. Machst du wieder diesen Kartoffelsalat?", antworten: [
      { text: "Wenn du pünktlich bist.", weiter: "k4" },
      { text: "Mal sehen, was der Hofladen hat.", weiter: "k5" } ] },
    k4: { sagt: "Ich bin pünktlich, versprochen. Und wenn nicht, ist es die Bahn.", antworten: [
      { text: "Es ist nie die Bahn.", weiter: "k6" },
      { text: "Ich hab da mal mitgezählt.", weiter: "k6" } ] },
    k5: { sagt: "Hofladen klingt gut. Fahren wir zusammen hin, wenn ich da bin?", antworten: [
      { text: "Gerne. Du trägst.", weiter: "k6" },
      { text: "Wenn du nicht alles probierst.", weiter: "k6" } ] },
    k6: { sagt: "Abgemacht. Oh, die Waschmaschine piept, ich muss.", antworten: [
      { text: "Na los, lauf.", weiter: null },
      { text: "Schreib mir, wann du kommst.", weiter: null } ] }
  },
  schluss: "Ich schick dir das Datum. Wirklich. Tschüss!" },

{ id: "max-02", wer: "max", thema: "Risotto",
  knoten: {
    start: { sagt: "Ich hab heute selbst gekocht. Die Küche steht noch, keine Sorge.", antworten: [
      { text: "Was gab’s denn?", weiter: "k2" },
      { text: "Und der Rauchmelder?", weiter: "k3" } ] },
    k2: { sagt: "Risotto. Also, es sollte Risotto werden, jetzt kann man’s schneiden.", antworten: [
      { text: "Zu wenig Brühe, mein Lieber.", weiter: "k4" },
      { text: "Hast du zwischendurch umgerührt?", weiter: "k5" } ] },
    k3: { sagt: "Der hat kurz Bescheid gesagt. Ich hab mit dem Handtuch gewedelt, dann war Ruhe.", antworten: [
      { text: "Was hast du denn gekocht?", weiter: "k2" },
      { text: "Die Nachbarn freuen sich bestimmt.", weiter: "k2" } ] },
    k4: { sagt: "Brühe! Ich hatte so das Gefühl, da fehlt was. Ich dachte, Parmesan.", antworten: [
      { text: "Parmesan kommt zum Schluss.", weiter: "k6" },
      { text: "Meistens fehlt beides bei dir.", weiter: "k6" } ] },
    k5: { sagt: "Zwischendurch? Ich hab’s aufgesetzt und in der Zeit Wäsche aufgehängt.", antworten: [
      { text: "Na, da haben wir’s ja.", weiter: "k6" },
      { text: "Risotto will Gesellschaft, Max.", weiter: "k6" } ] },
    k6: { sagt: "Okay. Nächstes Mal ruf ich dich beim Kochen an, und du sagst, wann ich rühren muss.", antworten: [
      { text: "Abgemacht. Telefonkochen.", weiter: null },
      { text: "Dann koch ich gleich mit.", weiter: null } ] }
  },
  schluss: "Ich weich jetzt den Topf ein. Tschüss!" },

{ id: "max-03", wer: "max", thema: "Tanzschritt in der Küche",
  knoten: {
    start: { sagt: "Ich hab den Schritt geübt, den du mir gezeigt hast. In der Küche.", antworten: [
      { text: "Und? Wie lief’s?", weiter: "k2" },
      { text: "In der Küche? Bei dem Platz?", weiter: "k3" } ] },
    k2: { sagt: "Vor, zurück, Drehung, und dann Kühlschrank. Der Kühlschrank war nicht eingeplant.", antworten: [
      { text: "Die Drehung ist zu groß.", weiter: "k4" },
      { text: "Ist was kaputtgegangen?", weiter: "k5" } ] },
    k3: { sagt: "Ich hab den Tisch an die Wand geschoben. Greta kam rein und ist sofort wieder raus.", antworten: [
      { text: "Und dann?", weiter: "k2" },
      { text: "Kluge Frau.", weiter: "k2" } ] },
    k4: { sagt: "Kleiner drehen, okay. Ich dreh immer mit so viel Schwung, das ist das Problem.", antworten: [
      { text: "Erst langsam, dann Schwung.", weiter: "k6" },
      { text: "Schwung kommt aus der Hüfte.", weiter: "k6" } ] },
    k5: { sagt: "Nur der Magnet von der Ostsee. Und ein bisschen mein Stolz.", antworten: [
      { text: "Der Stolz wächst nach.", weiter: "k4" },
      { text: "Den Magnet klebst du wieder.", weiter: "k4" } ] },
    k6: { sagt: "Zeigst du’s mir nochmal, wenn ich da bin? Bei dir ist mehr Platz.", antworten: [
      { text: "Ich räum schon mal die Vase weg.", weiter: null },
      { text: "Gern. Ohne Kühlschrank.", weiter: null } ] }
  },
  schluss: "Ich üb noch ein bisschen. Mit Abstand. Tschüss!" },

{ id: "max-04", wer: "max", thema: "Gisela, die Pflanze",
  knoten: {
    start: { sagt: "Rita, kurze Frage. Wie oft muss man so eine Pflanze eigentlich gießen?", antworten: [
      { text: "Was für eine Pflanze denn?", weiter: "k2" },
      { text: "Wann hast du zuletzt gegossen?", weiter: "k3" } ] },
    k2: { sagt: "So eine grüne, mit großen Blättern. Greta hat sie mir geschenkt, sie heißt Gisela.", antworten: [
      { text: "Gisela braucht Wasser, glaub mir.", weiter: "k4" },
      { text: "Wie sehen die Blätter aus?", weiter: "k5" } ] },
    k3: { sagt: "Puh. Ich weiß noch, dass draußen Sommer war.", antworten: [
      { text: "Max! Sofort ein Glas Wasser.", weiter: "k4" },
      { text: "Und jetzt ist Herbst.", weiter: "k4" } ] },
    k4: { sagt: "Mach ich. Hängt sie deswegen so?", antworten: [
      { text: "Ja. Morgen steht sie wieder.", weiter: "k6" },
      { text: "Die hängt, weil sie dich kennt.", weiter: "k6" } ] },
    k5: { sagt: "Die hängen ein bisschen. So wie ich montags.", antworten: [
      { text: "Das ist Durst, Max.", weiter: "k4" },
      { text: "Dann gieß sie. Und dich auch.", weiter: "k4" } ] },
    k6: { sagt: "Okay. Ich schreib’s mir auf. Wobei, Zettel verlier ich auch.", antworten: [
      { text: "Stell dir einen Wecker im Handy.", weiter: null },
      { text: "Ich frag sonntags nach.", weiter: null } ] }
  },
  schluss: "Gisela sagt Danke. Ich auch. Tschüss!" },

{ id: "max-05", wer: "max", thema: "Ein Knopf für nichts",
  knoten: {
    start: { sagt: "Ich hab ’ne Idee für die App. Ein Knopf, der gar nichts macht.", antworten: [
      { text: "Wozu soll der gut sein?", weiter: "k2" },
      { text: "Davon hab ich schon ein paar.", weiter: "k3" } ] },
    k2: { sagt: "Zum Draufdrücken. Manchmal will man einfach was drücken.", antworten: [
      { text: "Wie beim Fahrstuhl, wenn er schon leuchtet.", weiter: "k4" },
      { text: "Das klingt sehr nach dir.", weiter: "k4" } ] },
    k3: { sagt: "Was? Wo denn?", antworten: [
      { text: "War nur Spaß, alles läuft.", weiter: "k4" },
      { text: "Auf der Fernbedienung, gleich drei.", weiter: "k5" } ] },
    k4: { sagt: "Ich mach ihn rund und gelb. Wie das Hühnchen, nur flacher.", antworten: [
      { text: "Frag das Hühnchen vorher.", weiter: "k6" },
      { text: "Hauptsache, er ist schön groß.", weiter: "k6" } ] },
    k5: { sagt: "Ach, die Fernbedienung. Ja, die hat bei jedem so welche, das ist normal.", antworten: [
      { text: "Siehst du. Gibt’s also schon.", weiter: "k6" },
      { text: "Dann bau einen schöneren.", weiter: "k6" } ] },
    k6: { sagt: "Okay, ich bau ihn trotzdem. Du darfst als Erste drücken.", antworten: [
      { text: "Ich drück ganz vorsichtig.", weiter: null },
      { text: "Und dann passiert nichts?", weiter: null } ] }
  },
  schluss: "Ich setz mich dann mal dran. Tschüss!" },

{ id: "max-06", wer: "max", thema: "Harry-Potter-Häuser",
  knoten: {
    start: { sagt: "Wichtige Frage. Wenn wir beide nach Hogwarts kämen, wären wir im selben Haus?", antworten: [
      { text: "Ich wär Gryffindor.", weiter: "k2" },
      { text: "Du landest bei den Hauselfen.", weiter: "k3" } ] },
    k2: { sagt: "Passt. Und ich? Ich hätt gern Ravenclaw, die Schlauen.", antworten: [
      { text: "Mit deinem Risotto? Eher nicht.", weiter: "k4" },
      { text: "Für dich reicht’s locker.", weiter: "k5" } ] },
    k3: { sagt: "Hey! Die räumen den ganzen Tag auf, die würden mich nach einem Tag rauswerfen.", antworten: [
      { text: "Dann Hufflepuff, wie das Hühnchen.", weiter: "k5" },
      { text: "Stimmt, die sind ordentlicher.", weiter: "k4" } ] },
    k4: { sagt: "Okay, okay. Dann werd ich halt der Hut, der die Häuser verteilt.", antworten: [
      { text: "Und wohin steckst du mich?", weiter: "k6" },
      { text: "Der redet auch so viel.", weiter: "k6" } ] },
    k5: { sagt: "Dann sehen wir uns beim Essen in der großen Halle. Ich halt dir einen Platz frei.", antworten: [
      { text: "Neben dem Pudding, bitte.", weiter: "k6" },
      { text: "Aber nicht wieder zu spät kommen.", weiter: "k6" } ] },
    k6: { sagt: "Du sitzt jedenfalls bei mir am Tisch. Egal, was der Hut sagt.", antworten: [
      { text: "So muss das sein.", weiter: null },
      { text: "Das ist Schummelei, Max.", weiter: null } ] }
  },
  schluss: "Ich muss los, bevor hier ’ne Eule reinfliegt. Tschüss!" },

{ id: "max-07", wer: "max", thema: "Verlaufen in Halle",
  knoten: {
    start: { sagt: "Ich steh hier an einer Ecke und weiß nicht genau, an welcher. Das Handy hat noch zwei Prozent.", antworten: [
      { text: "Was siehst du denn?", weiter: "k2" },
      { text: "Du wohnst da doch!", weiter: "k3" } ] },
    k2: { sagt: "Eine Bäckerei, ein Schild, eine Taube. Die Taube guckt, als wüsste sie’s.", antworten: [
      { text: "Lies das Schild vor.", weiter: "k4" },
      { text: "Frag in der Bäckerei.", weiter: "k5" } ] },
    k3: { sagt: "Ja, aber ich bin auf der falschen Seite aus der Bahn raus. Jetzt ist alles spiegelverkehrt.", antworten: [
      { text: "Was siehst du denn?", weiter: "k2" },
      { text: "Dreh dich einmal um.", weiter: "k4" } ] },
    k4: { sagt: "Moment … Das ist meine Straße. Ich steh fast vor der Tür.", antworten: [
      { text: "Glückwunsch, du bist zu Hause.", weiter: "k6" },
      { text: "Das erzähl ich Greta.", weiter: "k6" } ] },
    k5: { sagt: "Gute Idee, dann nehm ich mir gleich ein Brötchen mit. Oder zwei.", antworten: [
      { text: "Und frag nach dem Weg.", weiter: "k4" },
      { text: "Erst den Weg, dann Brötchen.", weiter: "k4" } ] },
    k6: { sagt: "Bitte nicht weitererzählen. Ich hab einen Ruf als Mann mit Orientierung.", antworten: [
      { text: "Den hattest du nie.", weiter: null },
      { text: "Bleibt unter uns.", weiter: null } ] }
  },
  schluss: "So, Akku ist gleich alle. Tschüss!" },

{ id: "max-08", wer: "max", thema: "Listen lernen",
  knoten: {
    start: { sagt: "Rita, wie machst du das mit deinen Listen? Meine sehen aus wie ein Einkaufszettel, der im Regen lag.", antworten: [
      { text: "Lies mal vor.", weiter: "k2" },
      { text: "Erste Regel: ein Zettel, nicht fünf.", weiter: "k3" } ] },
    k2: { sagt: "„Milch, Rita anrufen, Dings.“ Und ich weiß nicht mehr, was Dings ist.", antworten: [
      { text: "Rita anrufen kannst du abhaken.", weiter: "k4" },
      { text: "Dings ist meistens wichtig.", weiter: "k5" } ] },
    k3: { sagt: "Fünf? Ich hab elf, und die Hälfte find ich nicht. Moment, einer liegt hier.", antworten: [
      { text: "Na, dann lies den vor.", weiter: "k2" },
      { text: "Den behalten wir. Lies vor.", weiter: "k2" } ] },
    k4: { sagt: "Abgehakt! Oh, das fühlt sich gut an. Jetzt versteh ich dich.", antworten: [
      { text: "Siehst du. Das macht süchtig.", weiter: "k6" },
      { text: "Nicht übertreiben, mein Lieber.", weiter: "k6" } ] },
    k5: { sagt: "Ha, ja, warte … Dings war Geschenkpapier, für Mama.", antworten: [
      { text: "Na bitte. Gleich dazuschreiben.", weiter: "k4" },
      { text: "Gut, dass wir drüber geredet haben.", weiter: "k4" } ] },
    k6: { sagt: "Ich schreib gleich noch was drauf: Beim Tschüss nicht wieder verlieren.", antworten: [
      { text: "Den Punkt hakst du nie ab.", weiter: null },
      { text: "Viel Glück damit.", weiter: null } ] }
  },
  schluss: "Punkt eins: Tschüss!" },

{ id: "max-09", wer: "max", thema: "Die Ente an der Saale",
  knoten: {
    start: { sagt: "Ich war an der Saale, und da war so eine Ente. Die ist mir die ganze Zeit hinterhergeschwommen.", antworten: [
      { text: "Hattest du was zu essen dabei?", weiter: "k2" },
      { text: "Wie sah sie denn aus?", weiter: "k3" } ] },
    k2: { sagt: "Nur ein Pfefferminz. Das hat sie angeguckt und ist weitergeschwommen, sehr kritisch.", antworten: [
      { text: "Zu Recht, Max.", weiter: "k4" },
      { text: "Enten mögen keine Bonbons.", weiter: "k4" } ] },
    k3: { sagt: "Braun, bisschen zerzaust, sehr ernster Blick. Ich hab sie Frau Quaßmann getauft.", antworten: [
      { text: "Grüß Frau Quaßmann von mir.", weiter: "k4" },
      { text: "Das passt zu einer Ente.", weiter: "k4" } ] },
    k4: { sagt: "Ich glaub, sie mag mich trotzdem. Sie hat kurz den Kopf ins Wasser gesteckt.", antworten: [
      { text: "Das heißt bei Enten gar nichts.", weiter: "k5" },
      { text: "Das war ein Knicks.", weiter: "k6" } ] },
    k5: { sagt: "Für mich heißt es was. Ich nehm, was ich kriegen kann.", antworten: [
      { text: "Nimm nächstes Mal Haferflocken mit.", weiter: null },
      { text: "Du bist ein Romantiker.", weiter: null } ] },
    k6: { sagt: "Siehst du! Ich wusste, du verstehst das. Greta sagt, ich bild mir das ein.", antworten: [
      { text: "Greta hat meistens recht.", weiter: null },
      { text: "Ich glaub dir das.", weiter: null } ] }
  },
  schluss: "Frau Quaßmann und ich sagen: Tschüss!" },

{ id: "max-10", wer: "max", thema: "Die Igelsocke",
  knoten: {
    start: { sagt: "Die Waschmaschine hat schon wieder eine Socke gefressen. Ich glaub, die sammelt.", antworten: [
      { text: "Welche denn?", weiter: "k2" },
      { text: "Bei mir kommt keine weg.", weiter: "k3" } ] },
    k2: { sagt: "Die mit den Igeln, die du mir geschenkt hast. Jetzt hab ich nur noch einen Igel.", antworten: [
      { text: "Guck mal im Bettbezug.", weiter: "k4" },
      { text: "Ich hab noch Wolle da.", weiter: "k5" } ] },
    k3: { sagt: "Wie machst du das? Zählst du die vorher?", antworten: [
      { text: "Paarweise rein, paarweise raus.", weiter: "k6" },
      { text: "Guck mal im Bettbezug.", weiter: "k4" } ] },
    k4: { sagt: "Moment … tatsächlich, da ist sie! Und zwei fremde und ein Zehner.", antworten: [
      { text: "Der Zehner ist Finderlohn.", weiter: "k6" },
      { text: "Wem gehören die fremden?", weiter: "k6" } ] },
    k5: { sagt: "Du strickst mir neue? Mit Igeln?", antworten: [
      { text: "Mit Igeln. Dauert aber.", weiter: "k6" },
      { text: "Erst guckst du im Bettbezug.", weiter: "k4" } ] },
    k6: { sagt: "Okay. Ich glaub, ich klammer ab jetzt meine Socken zusammen. Wie ein Erwachsener.", antworten: [
      { text: "Das wird ja was.", weiter: null },
      { text: "Ich bin stolz auf dich.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt sortieren. Tschüss!" },

{ id: "max-11", wer: "max", thema: "Geschenk für Christiane",
  knoten: {
    start: { sagt: "Psst. Mama hat bald Geburtstag, und ich hab noch nichts. Du kennst sie doch am besten.", antworten: [
      { text: "Was Neues für die Küche?", weiter: "k2" },
      { text: "Ein Ausflug mit dir?", weiter: "k3" } ] },
    k2: { sagt: "Die hat schon alles. Die hat sogar so ein Ding, mit dem man Kirschen entkernt.", antworten: [
      { text: "Dann was Selbstgemachtes.", weiter: "k4" },
      { text: "Koch du doch mal für sie.", weiter: "k5" } ] },
    k3: { sagt: "Ausflug ist gut. Aber wohin? Sie will dann eh nur über Kuchen reden.", antworten: [
      { text: "Dann in ein schönes Café.", weiter: "k4" },
      { text: "Das ist doch das Schöne an ihr.", weiter: "k4" } ] },
    k4: { sagt: "Gute Idee, eigentlich. Warum fällt mir so was nie selber ein?", antworten: [
      { text: "Weil du mich hast.", weiter: "k6" },
      { text: "Fällt dir doch, nur später.", weiter: "k6" } ] },
    k5: { sagt: "Für sie kochen? Nach dem Risotto? Das wär eher eine Strafe.", antworten: [
      { text: "Ich helf dir am Telefon.", weiter: "k4" },
      { text: "Gut, dann doch das Café.", weiter: "k4" } ] },
    k6: { sagt: "Danke. Und wenn sie fragt: Wir haben übers Wetter geredet.", antworten: [
      { text: "Sehr wechselhaft, ganz klar.", weiter: null },
      { text: "Ich sag kein Wort.", weiter: null } ] }
  },
  schluss: "Ich muss los, sie klopft gerade an. Tschüss!" },

{ id: "max-12", wer: "max", thema: "Die Wette",
  knoten: {
    start: { sagt: "Heute gewinn ich beim Tschüss. Ich hab geübt.", antworten: [
      { text: "Was ist der Einsatz?", weiter: "k2" },
      { text: "Das sagst du jedes Mal.", weiter: "k3" } ] },
    k2: { sagt: "Wer verliert, macht beim nächsten Besuch den Abwasch. Mit Töpfen.", antworten: [
      { text: "Dann bring Handschuhe mit.", weiter: "k4" },
      { text: "Ich bin dabei.", weiter: "k4" } ] },
    k3: { sagt: "Ja, aber diesmal hab ich eine Technik. Ich atme vorher tief durch.", antworten: [
      { text: "Das hilft dir auch nicht.", weiter: "k4" },
      { text: "Zeig mal.", weiter: "k5" } ] },
    k4: { sagt: "Ich spür’s, heute ist mein Tag. Mein Bauch sagt das.", antworten: [
      { text: "Das ist bloß Hunger.", weiter: "k6" },
      { text: "Wir werden sehen.", weiter: "k6" } ] },
    k5: { sagt: "Nee, später. Ich will die Überraschung nicht verderben.", antworten: [
      { text: "Ach so. Na dann.", weiter: "k4" },
      { text: "Ich hab keine Angst.", weiter: "k4" } ] },
    k6: { sagt: "Okay. Bereit? Ich zähl bis drei.", antworten: [
      { text: "Eins, zwei …", weiter: null },
      { text: "Ich bin bereit.", weiter: null } ] }
  },
  schluss: "Drei! Tschüss!" },

{ id: "max-13", wer: "max", thema: "Der Tanzschüler",
  knoten: {
    start: { sagt: "Und, wie läuft’s mit deinem Tanzschüler?", antworten: [
      { text: "Er zählt jetzt bis vier.", weiter: "k2" },
      { text: "Er hat letztes Mal gelacht.", weiter: "k3" } ] },
    k2: { sagt: "Bis vier! Beim Walzer ist das aber einer zu viel, oder?", antworten: [
      { text: "Eben. Daran arbeiten wir.", weiter: "k4" },
      { text: "Er tanzt jetzt Foxtrott.", weiter: "k4" } ] },
    k3: { sagt: "Gelacht? Über dich oder mit dir?", antworten: [
      { text: "Über sich selbst. Das ist gut.", weiter: "k5" },
      { text: "Über meine Musik. Schlager.", weiter: "k5" } ] },
    k4: { sagt: "Ich könnte mal mitkommen und vortanzen. Dann sieht er, dass es schlimmer geht.", antworten: [
      { text: "Das wär tatsächlich motivierend.", weiter: "k6" },
      { text: "Du bringst ihn nur raus.", weiter: "k6" } ] },
    k5: { sagt: "Das ist doch das Wichtigste. Hast du mir früher auch immer gesagt.", antworten: [
      { text: "Und es stimmt immer noch.", weiter: "k4" },
      { text: "Schön, dass du zugehört hast.", weiter: "k4" } ] },
    k6: { sagt: "Okay, ich komm zur nächsten Stunde. Ich bring Kuchen mit, dann ist er abgelenkt.", antworten: [
      { text: "Kuchen geht immer.", weiter: null },
      { text: "Erst tanzen, dann Kuchen.", weiter: null } ] }
  },
  schluss: "Ich muss los, Greta ruft. Tschüss!" },

{ id: "max-14", wer: "max", thema: "Das Fahrrad",
  knoten: {
    start: { sagt: "Ich hab ein Fahrrad gekauft. Gebraucht. Es quietscht bei jedem Tritt.", antworten: [
      { text: "Öl hilft.", weiter: "k2" },
      { text: "Wie viel hast du bezahlt?", weiter: "k3" } ] },
    k2: { sagt: "Hab ich probiert. Olivenöl. Jetzt quietscht es und riecht nach Salat.", antworten: [
      { text: "Max. Das falsche Öl.", weiter: "k4" },
      { text: "Frag lieber Micha.", weiter: "k4" } ] },
    k3: { sagt: "Fünfzig Euro. Der Typ hat gesagt, das Quietschen ist Charakter.", antworten: [
      { text: "Charakter gab’s gratis dazu.", weiter: "k5" },
      { text: "Der hat dich übers Ohr gehauen.", weiter: "k5" } ] },
    k4: { sagt: "Ich hab Micha angerufen. Er hat gesagt: „Kette.“ Dann hat er aufgelegt.", antworten: [
      { text: "Mehr braucht’s bei Micha nicht.", weiter: "k6" },
      { text: "Und, war’s die Kette?", weiter: "k6" } ] },
    k5: { sagt: "Nee, eigentlich fährt es gut. Nur bergauf hören es alle.", antworten: [
      { text: "Dann fahr nicht bergauf.", weiter: "k4" },
      { text: "Ruf mal Micha an.", weiter: "k4" } ] },
    k6: { sagt: "Ich guck mir das morgen an. Wenn’s dann nicht mehr quietscht, kriegst du Bescheid.", antworten: [
      { text: "Ich warte auf die Meldung.", weiter: null },
      { text: "Sonst ruf Micha nochmal an.", weiter: null } ] }
  },
  schluss: "Ich schieb’s jetzt nach Hause. Tschüss!" },

{ id: "max-15", wer: "max", thema: "Bart gestutzt",
  knoten: {
    start: { sagt: "Ich hab mir heute selbst den Bart gestutzt. Links sieht’s super aus.", antworten: [
      { text: "Und rechts?", weiter: "k2" },
      { text: "Was sagt Greta?", weiter: "k3" } ] },
    k2: { sagt: "Rechts ist … kürzer. Ich hab versucht, es anzugleichen. Dann war links kürzer.", antworten: [
      { text: "Hör auf, solange noch was dran ist.", weiter: "k4" },
      { text: "Das kenn ich vom Pony-Schneiden.", weiter: "k4" } ] },
    k3: { sagt: "Sie hat mich angeguckt, den Kopf schief gelegt und gesagt: „Mutig.“", antworten: [
      { text: "Mutig ist nie ein Kompliment.", weiter: "k4" },
      { text: "Kluge Frau, diplomatisch.", weiter: "k4" } ] },
    k4: { sagt: "Ich geh nächste Woche zum Friseur. Bis dahin halte ich beim Videotelefonieren den Kopf ein bisschen schräg.", antworten: [
      { text: "Dann zeig mir die gute Seite.", weiter: null },
      { text: "Ich seh dich auch schief gern.", weiter: null } ] }
  },
  schluss: "Ich üb jetzt meinen Schrägblick. Tschüss!" },

{ id: "max-16", wer: "max", thema: "Pizza-Verwechslung",
  knoten: {
    start: { sagt: "Ich hab Pizza bestellt. Gekommen ist ein Salat, und ein Fahrer, der ganz sicher war, dass ich Salat wollte.", antworten: [
      { text: "Hast du reklamiert?", weiter: "k2" },
      { text: "Und, hast du ihn gegessen?", weiter: "k3" } ] },
    k2: { sagt: "Ich wollte. Aber er war so freundlich, da hab ich Danke gesagt und Trinkgeld gegeben.", antworten: [
      { text: "Du bist zu nett, Max.", weiter: "k3" },
      { text: "Das hätt ich auch gemacht.", weiter: "k3" } ] },
    k3: { sagt: "Ja. Und weißt du was? Der war richtig gut.", antworten: [
      { text: "Na siehst du.", weiter: "k4" },
      { text: "Sag das bloß nicht weiter.", weiter: "k4" } ] },
    k4: { sagt: "Ich bestell nächstes Mal einfach Salat. Vielleicht kommt dann ja Pizza.", antworten: [
      { text: "Gute Strategie. Probier’s aus.", weiter: "k5" },
      { text: "Oder du kochst selbst.", weiter: "k6" } ] },
    k5: { sagt: "Ich erzähl dir, wie’s ausgeht.", antworten: [
      { text: "Ich bin gespannt.", weiter: null },
      { text: "Ich tipp auf Suppe.", weiter: null } ] },
    k6: { sagt: "Selbst kochen? Du weißt, wie das beim letzten Mal war.", antworten: [
      { text: "Diesmal mit mir am Telefon.", weiter: null },
      { text: "Gut, bestell weiter.", weiter: null } ] }
  },
  schluss: "Oh, es klingelt. Vielleicht doch die Pizza. Tschüss!" },

{ id: "max-17", wer: "max", thema: "Fluss mit fünf Buchstaben",
  knoten: {
    start: { sagt: "Du machst doch Kreuzworträtsel. Ich hab eins aus der Zeitung und häng fest.", antworten: [
      { text: "Lies vor.", weiter: "k2" },
      { text: "Seit wann rätselst du?", weiter: "k3" } ] },
    k2: { sagt: "Nebenfluss der Elbe, fünf Buchstaben. Ich komm nicht drauf.", antworten: [
      { text: "Guck mal aus dem Fenster.", weiter: "k4" },
      { text: "Na, wo wohnst du denn?", weiter: "k4" } ] },
    k3: { sagt: "Seit heute früh. Im Zug lag eine Zeitung rum.", antworten: [
      { text: "Na, dann lies mal vor.", weiter: "k2" },
      { text: "Wie weit bist du?", weiter: "k5" } ] },
    k4: { sagt: "Ach, die Saale! Oh Mann, da wohn ich seit Jahren dran.", antworten: [
      { text: "Nicht mehr lange, dann Leipzig.", weiter: "k6" },
      { text: "Jetzt vergisst du’s nie wieder.", weiter: "k6" } ] },
    k5: { sagt: "Ein Wort. Und das ist falsch, glaub ich, weil nichts mehr passt.", antworten: [
      { text: "Mit Kuli? Max.", weiter: "k2" },
      { text: "Radier es. Was ist das nächste?", weiter: "k2" } ] },
    k6: { sagt: "Stimmt, in Leipzig ist es dann die Pleiße. Die kann ich mir nie merken.", antworten: [
      { text: "Die kommt bestimmt auch mal dran.", weiter: null },
      { text: "Schreib sie dir auf.", weiter: null } ] }
  },
  schluss: "Ich mach dann weiter, mit Bleistift. Tschüss!" },

{ id: "max-18", wer: "max", thema: "Max’ Quiz",
  knoten: {
    start: { sagt: "Ich hab ein Quiz für dich, drei Fragen. Frage eins: Wer ist dein Lieblingspatensohn?", antworten: [
      { text: "Gibt’s Antwortmöglichkeiten?", weiter: "k2" },
      { text: "Das Glücksschwein.", weiter: "k3" } ] },
    k2: { sagt: "Nein. Die Antwort ist Max. Ein Punkt für dich.", antworten: [
      { text: "Ich hab doch gar nichts gesagt.", weiter: "k4" },
      { text: "Ich nehm den Punkt.", weiter: "k4" } ] },
    k3: { sagt: "Das Schwein ist kein Patensohn! Das hat dir auch keine App gebaut.", antworten: [
      { text: "Aber es ruft nie zu spät an.", weiter: "k4" },
      { text: "Na gut, dann eben du.", weiter: "k4" } ] },
    k4: { sagt: "Frage zwei: Wer tanzt besser, du oder ich?", antworten: [
      { text: "Ist das eine ernste Frage?", weiter: "k5" },
      { text: "Ich. Mit Abstand.", weiter: "k5" } ] },
    k5: { sagt: "Richtig. Frage drei: Wer gewinnt gleich beim Tschüss?", antworten: [
      { text: "Ich, wie immer.", weiter: "k6" },
      { text: "Das ist eine Fangfrage.", weiter: "k6" } ] },
    k6: { sagt: "Das klären wir gleich praktisch. Zwei von drei hast du jedenfalls.", antworten: [
      { text: "Zwei reichen mir.", weiter: null },
      { text: "Und was ist der Preis?", weiter: null } ] }
  },
  schluss: "Der Preis ist ein Besuch von mir. Tschüss!" },

/* ==================== JANE ==================== */

{ id: "jane-01", wer: "jane", thema: "Sonntagsessen",
  knoten: {
    start: { sagt: "Rita, ich bin’s. Sag mal, Sonntag, Rouladen oder Braten? Ich kann mich nicht entscheiden.", antworten: [
      { text: "Rouladen, ganz klar.", weiter: "k2" },
      { text: "Was sagt denn Micha?", weiter: "k3" } ] },
    k2: { sagt: "Hab ich mir gedacht. Dann muss ich nur noch Senf holen, wir haben nur noch so einen süßen.", antworten: [
      { text: "Süßer Senf geht gar nicht.", weiter: "k4" },
      { text: "Ich bring dir ein Glas mit.", weiter: "k4" } ] },
    k3: { sagt: "„Mir egal.“ Das sagt er immer, und dann isst er drei Stück.", antworten: [
      { text: "Dann Rouladen, für Micha.", weiter: "k2" },
      { text: "Dann mach doch beides.", weiter: "k5" } ] },
    k4: { sagt: "Und dazu Rotkohl und Klöße. Die Klöße werden diesmal rund, das schwör ich dir.", antworten: [
      { text: "Ich mochte die letzten.", weiter: "k6" },
      { text: "Rund ist überbewertet.", weiter: "k6" } ] },
    k5: { sagt: "Beides? Du bist gut, ich hab einen Ofen und zwei Hände. Na gut, Rouladen.", antworten: [
      { text: "Gute Entscheidung.", weiter: "k4" },
      { text: "Siehst du, war doch einfach.", weiter: "k4" } ] },
    k6: { sagt: "Ach du. Und zum Nachtisch, sag nichts, ich weiß schon: rote Grütze.", antworten: [
      { text: "Mit Vanillesoße, bitte.", weiter: null },
      { text: "Du kennst mich zu gut.", weiter: null } ] }
  },
  schluss: "Gut, dann schreib ich mir das auf. Bis Sonntag, und komm mit Hunger!" },

{ id: "jane-02", wer: "jane", thema: "Der launische Ofen",
  knoten: {
    start: { sagt: "Mein Ofen spinnt wieder. Der heizt, wann er will.", antworten: [
      { text: "Wie alt ist der denn?", weiter: "k2" },
      { text: "Hast du Micha gefragt?", weiter: "k3" } ] },
    k2: { sagt: "Den hab ich, seit wir hier wohnen. Der kennt jeden Kuchen von mir.", antworten: [
      { text: "Dann ist er einfach launisch.", weiter: "k4" },
      { text: "Der braucht mal Urlaub.", weiter: "k4" } ] },
    k3: { sagt: "Micha hat reingeguckt und gesagt: „Der geht doch.“ Und dann war er wieder auf dem Sofa.", antworten: [
      { text: "Typisch Micha.", weiter: "k4" },
      { text: "Und, geht er?", weiter: "k4" } ] },
    k4: { sagt: "Mal so, mal so. Der Marmorkuchen gestern war oben fast schwarz und innen noch feucht.", antworten: [
      { text: "Oberhitze runter, länger backen.", weiter: "k5" },
      { text: "Habt ihr ihn trotzdem gegessen?", weiter: "k6" } ] },
    k5: { sagt: "Ach, du bist gut. Probier ich Sonntag, dann kannst du gleich mitessen.", antworten: [
      { text: "Ich bring Sahne mit.", weiter: null },
      { text: "Ich bin gern Testesserin.", weiter: null } ] },
    k6: { sagt: "Na klar, Micha hat die Mitte rausgelöffelt. Er sagt, das ist jetzt ein Napfkuchen.", antworten: [
      { text: "Der Mann hat Ideen.", weiter: null },
      { text: "Recht hat er.", weiter: null } ] }
  },
  schluss: "Ich muss nach ihm gucken, der tickt schon wieder so komisch." },

{ id: "jane-03", wer: "jane", thema: "Kuchen für Samstag",
  knoten: {
    start: { sagt: "Rita, du musst entscheiden. Samstag: Apfelkuchen oder Käsekuchen?", antworten: [
      { text: "Apfel mit Streuseln.", weiter: "k2" },
      { text: "Käsekuchen, aber ohne Rosinen.", weiter: "k3" } ] },
    k2: { sagt: "Streusel, gut. Wie viel? Ich frag, weil Micha immer sagt, zu wenig.", antworten: [
      { text: "Mehr Streusel als Apfel.", weiter: "k4" },
      { text: "Da hat Micha mal recht.", weiter: "k4" } ] },
    k3: { sagt: "Ohne Rosinen, versteht sich. Ich weiß gar nicht, wer die mal eingeladen hat.", antworten: [
      { text: "Die haben sich reingeschmuggelt.", weiter: "k5" },
      { text: "Pauli pult die eh raus.", weiter: "k5" } ] },
    k4: { sagt: "Dann mach ich die doppelte Menge, und der Rest kommt in die Dose, für unter der Woche.", antworten: [
      { text: "Eine Streuseldose. Das ist Luxus.", weiter: "k6" },
      { text: "Die ist Montag leer.", weiter: "k6" } ] },
    k5: { sagt: "Dann wird er schön hoch. Wenn er mir nur nicht wieder einfällt.", antworten: [
      { text: "Ofen aus, Tür einen Spalt auf.", weiter: "k6" },
      { text: "Eingefallen schmeckt er genauso.", weiter: "k6" } ] },
    k6: { sagt: "Ach, gegessen wird er sowieso. Bei uns bleibt nie was übrig.", antworten: [
      { text: "Ich bin Samstag da.", weiter: null },
      { text: "Heb mir die Ecke auf.", weiter: null } ] }
  },
  schluss: "So, ich stell schon mal die Butter raus. Bis Samstag!" },

{ id: "jane-04", wer: "jane", thema: "Der Kuchendieb",
  knoten: {
    start: { sagt: "Rita, bei uns fehlt ein Stück vom Blech. Ich hab da einen Verdacht.", antworten: [
      { text: "Micha?", weiter: "k2" },
      { text: "Warst du’s nicht selber?", weiter: "k3" } ] },
    k2: { sagt: "Der sitzt auf dem Sofa und liest Zeitung. Mit Krümeln am Pullover.", antworten: [
      { text: "Dann ist der Fall klar.", weiter: "k4" },
      { text: "Die Zeitung ist kein Alibi.", weiter: "k4" } ] },
    k3: { sagt: "Ich? Na hör mal. Ich hab nur die Kante gerade geschnitten, die war schief.", antworten: [
      { text: "Und die Kante hast du gegessen?", weiter: "k5" },
      { text: "Ha, ertappt.", weiter: "k5" } ] },
    k4: { sagt: "Er sagt, er hat nur probiert, ob er gut ist. Mit einem ganzen Stück.", antworten: [
      { text: "Gründlich ist er ja.", weiter: "k6" },
      { text: "Und, war er gut?", weiter: "k6" } ] },
    k5: { sagt: "Na ja, eine Kante. Aber das ganze Stück war Micha, da wett ich drauf.", antworten: [
      { text: "Ich glaub dir. Fast.", weiter: "k6" },
      { text: "Ihr seid beide verdächtig.", weiter: "k6" } ] },
    k6: { sagt: "Jedenfalls macht er heute den Abwasch. Da hat er Zeit zum Nachdenken.", antworten: [
      { text: "Spar mir ein Stück auf.", weiter: null },
      { text: "Sag ihm, ich halt zu ihm.", weiter: null } ] }
  },
  schluss: "Ich versteck den Rest jetzt im Ofen. Da guckt er nie rein." },

{ id: "jane-05", wer: "jane", thema: "Der lockere Gugelhupf",
  knoten: {
    start: { sagt: "Rita, du wolltest doch immer wissen, wie ich den Gugelhupf so locker krieg. Heute sag ich’s dir.", antworten: [
      { text: "Warte, ich hol einen Stift.", weiter: "k2" },
      { text: "Endlich! Nach all den Jahren.", weiter: "k3" } ] },
    k2: { sagt: "Also, Eier trennen, das Eiweiß steif schlagen und ganz zum Schluss unterheben.", antworten: [
      { text: "Und das ist das Geheimnis?", weiter: "k4" },
      { text: "Unterheben, nicht rühren?", weiter: "k5" } ] },
    k3: { sagt: "Ich wollte ja immer. Aber dann hätte ich dich nicht mehr damit locken können.", antworten: [
      { text: "Locken kannst du mich trotzdem.", weiter: "k2" },
      { text: "Na los, raus damit.", weiter: "k2" } ] },
    k4: { sagt: "Nee, das ist nur die halbe Wahrheit. Die andere Hälfte ist ein Schuss Rum, aber nicht Micha erzählen.", antworten: [
      { text: "Warum nicht Micha?", weiter: "k6" },
      { text: "Ich schweige.", weiter: "k6" } ] },
    k5: { sagt: "Unterheben! Sonst fällt alles wieder zusammen. Mit dem Teigschaber, ganz sachte von unten nach oben.", antworten: [
      { text: "Hab’s aufgeschrieben.", weiter: "k4" },
      { text: "Das hab ich immer falsch gemacht.", weiter: "k4" } ] },
    k6: { sagt: "Weil die Flasche sonst leer ist, wenn ich backen will.", antworten: [
      { text: "Dann versteck ich meine auch.", weiter: null },
      { text: "Verstehe. Bleibt unter uns.", weiter: null } ] }
  },
  schluss: "Und wenn du keine Lust zum Backen hast, kommst du einfach zu mir." },

{ id: "jane-06", wer: "jane", thema: "Übermütiger Hefeteig",
  knoten: {
    start: { sagt: "Rita, der Hefeteig geht mir über. Der hebt schon das Handtuch hoch.", antworten: [
      { text: "Zu viel Hefe genommen?", weiter: "k2" },
      { text: "Wo steht er denn?", weiter: "k3" } ] },
    k2: { sagt: "Einen ganzen Würfel, wie immer. Aber in der Küche ist es heute so warm.", antworten: [
      { text: "Dann stell ihn kühler.", weiter: "k4" },
      { text: "Schlag ihn einmal zusammen.", weiter: "k4" } ] },
    k3: { sagt: "Auf der Heizung. Ja, ich weiß. Hab ich nicht nachgedacht.", antworten: [
      { text: "Na, dann wundert’s mich nicht.", weiter: "k4" },
      { text: "Runter da, aber schnell.", weiter: "k4" } ] },
    k4: { sagt: "So, er steht jetzt am Fenster. Er sieht ein bisschen beleidigt aus.", antworten: [
      { text: "Der kriegt sich wieder.", weiter: "k5" },
      { text: "Was wird’s denn?", weiter: "k6" } ] },
    k5: { sagt: "Hoffentlich. Ich will heute noch einen Zopf draus machen.", antworten: [
      { text: "Heb mir ein Stück auf.", weiter: null },
      { text: "Mit Hagelzucker, bitte.", weiter: null } ] },
    k6: { sagt: "Hefezopf, ein großer. Die Hälfte friere ich ein, für wenn du kommst.", antworten: [
      { text: "Dann komm ich bald.", weiter: null },
      { text: "Du denkst immer an alle.", weiter: null } ] }
  },
  schluss: "Ich muss los, der kriecht schon wieder hoch. Bis bald!" },

{ id: "jane-07", wer: "jane", thema: "Das Paket vom Nachbarn",
  knoten: {
    start: { sagt: "Bei mir ist ein Paket für den Nachbarn abgegeben worden. Und es raschelt, Rita.", antworten: [
      { text: "Schüttel mal vorsichtig.", weiter: "k2" },
      { text: "Das geht dich nichts an.", weiter: "k3" } ] },
    k2: { sagt: "Hab ich schon. Klingt wie Nudeln. Oder wie Vogelfutter.", antworten: [
      { text: "Hat der einen Wellensittich?", weiter: "k4" },
      { text: "Vielleicht kocht er heimlich.", weiter: "k4" } ] },
    k3: { sagt: "Weiß ich doch. Ich guck’s ja nur an, es steht halt auf meinem Küchentisch.", antworten: [
      { text: "Na gut, einmal schütteln.", weiter: "k2" },
      { text: "Stell’s in den Flur.", weiter: "k5" } ] },
    k4: { sagt: "Das wüsste ich. Die Wände sind hier so dünn, da piept nichts.", antworten: [
      { text: "Dann zieht was Neues ein.", weiter: "k6" },
      { text: "Du hörst durch die Wand?", weiter: "k6" } ] },
    k5: { sagt: "Im Flur steht es dann und guckt mich an, jedes Mal, wenn ich vorbeigeh.", antworten: [
      { text: "Back was, dann vergisst du’s.", weiter: "k6" },
      { text: "Pakete gucken nicht, Christiane.", weiter: "k6" } ] },
    k6: { sagt: "Oh, es klingelt. Das ist er bestimmt, ich frag mal ganz nebenbei, was drin ist.", antworten: [
      { text: "Ganz nebenbei, natürlich.", weiter: null },
      { text: "Erzähl mir alles.", weiter: null } ] }
  },
  schluss: "Ich ruf dich nachher an, wenn ich’s weiß. Spätestens Sonntag." },

{ id: "jane-08", wer: "jane", thema: "Der Ofen kriegt einen Namen",
  knoten: {
    start: { sagt: "Rita, mein Ofen kriegt einen Namen. Nach all den Jahren hat er sich das verdient.", antworten: [
      { text: "Wie wär’s mit Heinz?", weiter: "k2" },
      { text: "Was Feines, bitte.", weiter: "k3" } ] },
    k2: { sagt: "Heinz? So hieß doch unser Filialleiter. Weißt du das nicht mehr?", antworten: [
      { text: "Oh doch. Dann lieber nicht.", weiter: "k4" },
      { text: "Der musste auch erst warm werden.", weiter: "k5" } ] },
    k3: { sagt: "Was Feines, hm. Der ist eher bodenständig, der riecht nach Zimt.", antworten: [
      { text: "Dann Hildegard.", weiter: "k4" },
      { text: "Gräfin von Zimt.", weiter: "k4" } ] },
    k4: { sagt: "Hildegard! Ja, das passt, die ist genau so.", antworten: [
      { text: "Hildegard aus der Binger.", weiter: "k6" },
      { text: "Kleb ihr einen Zettel dran.", weiter: "k6" } ] },
    k5: { sagt: "Ha, stimmt! Aber nee, dann denk ich bei jedem Kuchen an Kontoauszüge.", antworten: [
      { text: "Dann Hildegard.", weiter: "k4" },
      { text: "Gut, was Feines ohne Bank.", weiter: "k3" } ] },
    k6: { sagt: "Ich hab’s gerade auf ein Stück Kreppband geschrieben und drangeklebt. Micha guckt, als hätt ich sie nicht alle.", antworten: [
      { text: "Micha hat keine Ahnung von Öfen.", weiter: null },
      { text: "Kleb ihm auch eins an.", weiter: null } ] }
  },
  schluss: "Hildegard grüßt dich. Sie tickt, das heißt ja." },

{ id: "jane-09", wer: "jane", thema: "Plätzchenzeit",
  knoten: {
    start: { sagt: "Rita, ich hab die Ausstecher aus dem Keller geholt. Ich weiß, es ist noch früh.", antworten: [
      { text: "Für Plätzchen ist nie zu früh.", weiter: "k2" },
      { text: "Ist das nicht ein bisschen früh?", weiter: "k3" } ] },
    k2: { sagt: "Sag ich ja. Micha sagt, ich spinn.", antworten: [
      { text: "Essen tut er sie trotzdem.", weiter: "k4" },
      { text: "Was hast du für Formen?", weiter: "k5" } ] },
    k3: { sagt: "Wenn ich jetzt nicht anfang, isst Micha alles weg, bevor die Dose überhaupt voll ist.", antworten: [
      { text: "Dann musst du sie verstecken.", weiter: "k4" },
      { text: "Was hast du für Formen?", weiter: "k5" } ] },
    k4: { sagt: "Versteckt hab ich die schon überall. Letztes Jahr hab ich im März noch eine Dose gefunden.", antworten: [
      { text: "Und, waren sie noch gut?", weiter: "k6" },
      { text: "Wo war die denn?", weiter: "k6" } ] },
    k5: { sagt: "Sterne, Herzen und so ein Tier, keiner weiß, was das sein soll. Pauli sagt, ein Huhn.", antworten: [
      { text: "Dann gibt’s Hühnerplätzchen.", weiter: "k4" },
      { text: "Schick mir mal ein Foto.", weiter: "k4" } ] },
    k6: { sagt: "Im Wäscheschrank, hinter den Handtüchern. Und die waren noch gut, Vanillekipferl halten ewig.", antworten: [
      { text: "Ich komm zum Ausstechen.", weiter: null },
      { text: "Die ersten Kipferl gehören mir.", weiter: null } ] }
  },
  schluss: "Ich fang mit den Kipferln an. Bis bald, Rita!" },

{ id: "jane-10", wer: "jane", thema: "Probeessen",
  knoten: {
    start: { sagt: "Ich hab ein neues Rezept, Kürbis-Quiche mit Walnüssen. Und ich brauch jemanden, der ehrlich ist.", antworten: [
      { text: "Da bist du bei mir richtig.", weiter: "k2" },
      { text: "Ist Micha nicht ehrlich?", weiter: "k3" } ] },
    k2: { sagt: "Weiß ich doch. Kannst du Donnerstag? Dann ist sie noch warm, wenn du kommst.", antworten: [
      { text: "Donnerstag passt.", weiter: "k4" },
      { text: "Ich schreib’s mir auf.", weiter: "k4" } ] },
    k3: { sagt: "Micha sagt zu allem „lecker“. Auch zu dem Auflauf, den ich selber weggeschmissen hätte.", antworten: [
      { text: "Der Mann ist eben höflich.", weiter: "k2" },
      { text: "Gut, dann komm ich.", weiter: "k2" } ] },
    k4: { sagt: "Aber sag mir wirklich, wenn was fehlt. Nicht wie letztes Mal, da hast du nur „interessant“ gesagt.", antworten: [
      { text: "Das war die Rote-Bete-Torte.", weiter: "k5" },
      { text: "Interessant ist doch ein Kompliment.", weiter: "k6" } ] },
    k5: { sagt: "Ja, ja. Die hat keiner gegessen, nicht mal Micha.", antworten: [
      { text: "Siehst du, ich war ehrlich.", weiter: null },
      { text: "Die Quiche wird besser.", weiter: null } ] },
    k6: { sagt: "Bei dir nicht, Rita. Bei dir heißt das: nie wieder.", antworten: [
      { text: "Na gut, ertappt.", weiter: null },
      { text: "Diesmal sag ich lecker.", weiter: null } ] }
  },
  schluss: "Gut, dann bis Donnerstag. Ich mach heute schon mal den Teig." },

{ id: "jane-11", wer: "jane", thema: "Christiane will tanzen",
  knoten: {
    start: { sagt: "Du gibst doch Tanzstunden. Ich will auch mal, aber ich warn dich, ich trete.", antworten: [
      { text: "Wir fangen ganz langsam an.", weiter: "k2" },
      { text: "Ich hab festes Schuhwerk.", weiter: "k3" } ] },
    k2: { sagt: "Langsam ist gut. Ich kann im Takt umrühren, zählt das?", antworten: [
      { text: "Das ist schon halber Walzer.", weiter: "k4" },
      { text: "Dann rühr mal im Dreiertakt.", weiter: "k4" } ] },
    k3: { sagt: "Ha! Micha sagt immer, ich tanz, wie ich koche. Mit vollem Einsatz und ohne Rezept.", antworten: [
      { text: "Das klingt doch gut.", weiter: "k4" },
      { text: "Ohne Rezept tanzt sich’s freier.", weiter: "k4" } ] },
    k4: { sagt: "Wann denn? Nach dem Sonntagsessen, da hab ich noch Schwung.", antworten: [
      { text: "Nach dem Essen schläfst du ein.", weiter: "k5" },
      { text: "Gut, in der Küche.", weiter: "k6" } ] },
    k5: { sagt: "Ich schlaf nie ein. Das ist Micha, der schläft ein, und ich räum ab.", antworten: [
      { text: "Dann tanzen wir beim Abräumen.", weiter: "k6" },
      { text: "Gut. Erst Kaffee, dann Walzer.", weiter: "k6" } ] },
    k6: { sagt: "Abgemacht. Ich schieb den Küchentisch zur Seite, dann haben wir Platz.", antworten: [
      { text: "Und eins, zwei, drei!", weiter: null },
      { text: "Ich bring Musik mit.", weiter: null } ] }
  },
  schluss: "Ich üb schon mal mit dem Kochlöffel. Bis Sonntag, Rita!" },

{ id: "jane-12", wer: "jane", thema: "Zettel vergessen",
  knoten: {
    start: { sagt: "Rita, ich steh im Laden und hab den Zettel zu Hause liegen lassen. Du musst mir helfen.", antworten: [
      { text: "Was wolltest du denn backen?", weiter: "k2" },
      { text: "Wie soll ich das wissen?", weiter: "k3" } ] },
    k2: { sagt: "Zitronenkuchen. Oder Mohn? Irgendwas mit Puderzucker obendrauf.", antworten: [
      { text: "Zitronen und Puderzucker, fertig.", weiter: "k4" },
      { text: "Nimm beides, sicher ist sicher.", weiter: "k4" } ] },
    k3: { sagt: "Weil du immer alles weißt. Ich hab dir doch gestern erzählt, was ich vorhab.", antworten: [
      { text: "Zitronenkuchen. Für Sonntag.", weiter: "k4" },
      { text: "Du hast vom Wetter erzählt.", weiter: "k5" } ] },
    k4: { sagt: "Gut, dann hab ich Zitronen, Puderzucker und … warum hab ich Gurken im Korb?", antworten: [
      { text: "Die sind für Micha.", weiter: "k6" },
      { text: "Gurkenkuchen? Lieber nicht.", weiter: "k6" } ] },
    k5: { sagt: "Stimmt, das auch. Aber danach hab ich vom Kuchen erzählt, ganz sicher.", antworten: [
      { text: "Na gut. Zitronenkuchen.", weiter: "k4" },
      { text: "Dann Zitrone, ich bin fast sicher.", weiter: "k4" } ] },
    k6: { sagt: "Ach, die nehm ich trotzdem mit. Irgendwer isst die schon.", antworten: [
      { text: "Bei euch wird alles gegessen.", weiter: null },
      { text: "Und denk an die Butter.", weiter: null } ] }
  },
  schluss: "Die gucken hier schon, weil ich mit dem Korb telefonier. Tschüss, Rita!" },

{ id: "jane-13", wer: "jane", thema: "Was in der Soße ist",
  knoten: {
    start: { sagt: "Micha will unbedingt wissen, was in meiner Soße ist. Ich sag’s ihm nicht.", antworten: [
      { text: "Mir sagst du’s aber.", weiter: "k2" },
      { text: "Lass mich raten. Rotwein?", weiter: "k3" } ] },
    k2: { sagt: "Na gut, aber ganz leise. Er sitzt nebenan.", antworten: [
      { text: "Ich bin ganz Ohr.", weiter: "k4" },
      { text: "Ich halt den Hörer ganz dicht.", weiter: "k4" } ] },
    k3: { sagt: "Rotwein ist doch kein Geheimnis, das ist Grundausstattung.", antworten: [
      { text: "Eine Prise Zucker?", weiter: "k5" },
      { text: "Gib mir einen Tipp.", weiter: "k5" } ] },
    k4: { sagt: "Ein Löffel Johannisbeergelee. Und Zeit, viel Zeit.", antworten: [
      { text: "Das hätt ich nie geraten.", weiter: "k6" },
      { text: "Darum schmeckt sie so rund.", weiter: "k6" } ] },
    k5: { sagt: "Warm. Süß und rot, im Glas mit kariertem Deckel.", antworten: [
      { text: "Johannisbeergelee!", weiter: "k6" },
      { text: "Erdbeermarmelade?", weiter: "k4" } ] },
    k6: { sagt: "Pssst! Jetzt weißt du’s. Wenn Micha fragt, du hast keine Ahnung.", antworten: [
      { text: "Ich weiß von nichts.", weiter: null },
      { text: "Was für eine Soße?", weiter: null } ] }
  },
  schluss: "Und von mir hast du’s nicht. Bis Sonntag!" },

{ id: "jane-14", wer: "jane", thema: "Die Küchenwaage",
  knoten: {
    start: { sagt: "Meine Küchenwaage spinnt. Ich leg ein Ei drauf, und sie sagt vierhundert Gramm.", antworten: [
      { text: "Hast du den Daumen drauf?", weiter: "k2" },
      { text: "Dann ist es ein Straußenei.", weiter: "k3" } ] },
    k2: { sagt: "Oh. Ja. Jetzt sind es sechzig.", antworten: [
      { text: "Ein schwerer Daumen.", weiter: "k4" },
      { text: "Siehst du, die Waage kann nichts.", weiter: "k4" } ] },
    k3: { sagt: "Na, das wär was. Da würd ein Kuchen für die ganze Straße draus.", antworten: [
      { text: "Guck mal, wo dein Daumen ist.", weiter: "k2" },
      { text: "Vielleicht ist die Batterie leer.", weiter: "k5" } ] },
    k4: { sagt: "Ich wieg eigentlich eh nach Gefühl. Die Waage hab ich nur, weil Max sie mir geschenkt hat.", antworten: [
      { text: "Dann sag’s ihm nicht.", weiter: "k6" },
      { text: "Nach Gefühl wird’s am besten.", weiter: "k6" } ] },
    k5: { sagt: "Die hat eine Batterie? Ich dachte, die läuft einfach so.", antworten: [
      { text: "Hinten ist ein kleines Fach.", weiter: "k4" },
      { text: "Frag Micha, der weiß das.", weiter: "k4" } ] },
    k6: { sagt: "Nee, ich sag nichts. Er hat sich so gefreut, als er die ausgesucht hat.", antworten: [
      { text: "Dann wieg wenigstens ab und zu.", weiter: null },
      { text: "Das ist lieb von dir.", weiter: null } ] }
  },
  schluss: "So, und jetzt die Butter. Ohne Daumen." },

{ id: "jane-15", wer: "jane", thema: "Der Riesenkürbis",
  knoten: {
    start: { sagt: "Rita, ich hab einen Kürbis gekauft, der ist größer als mein Kopf. Ich krieg den nicht auf.", antworten: [
      { text: "Mit dem großen Messer.", weiter: "k2" },
      { text: "Lass das Micha machen.", weiter: "k3" } ] },
    k2: { sagt: "Hab ich versucht. Jetzt steckt das Messer drin und will nicht mehr raus.", antworten: [
      { text: "Klopf mit dem Nudelholz drauf.", weiter: "k4" },
      { text: "Jetzt aber Micha holen.", weiter: "k3" } ] },
    k3: { sagt: "Micha hat gesagt: „Moment.“ Das war vor zwanzig Minuten.", antworten: [
      { text: "Dann ruf nochmal.", weiter: "k4" },
      { text: "Ich wart mit dir.", weiter: "k5" } ] },
    k4: { sagt: "Hat geklappt! Jetzt hab ich zwei Hälften und überall Kerne.", antworten: [
      { text: "Die Kerne röstest du.", weiter: "k6" },
      { text: "Und jetzt Suppe?", weiter: "k6" } ] },
    k5: { sagt: "Oh, da kommt er. Mit der Säge. Ich glaub, er freut sich richtig.", antworten: [
      { text: "Das ist sein Moment.", weiter: "k4" },
      { text: "Bloß nicht den Tisch mitsägen.", weiter: "k4" } ] },
    k6: { sagt: "Suppe mit Ingwer und einem Schuss Sahne. Die Kerne kommen obendrauf.", antworten: [
      { text: "Heb mir eine Schüssel auf.", weiter: null },
      { text: "Das riech ich bis Spandau.", weiter: null } ] }
  },
  schluss: "So, ich geh schälen. Drück mir die Daumen." },

{ id: "jane-16", wer: "jane", thema: "Butterbier",
  knoten: {
    start: { sagt: "Du liest doch Harry Potter. Was ist dieses Butterbier? Ich will das mal machen.", antworten: [
      { text: "Süß und warm, mehr weiß keiner.", weiter: "k2" },
      { text: "Das gibt’s nur im Buch, Christiane.", weiter: "k3" } ] },
    k2: { sagt: "Süß und warm, das kann ich. Ich denk an Milch, Karamell und ein Stück Butter.", antworten: [
      { text: "Und eine Prise Zimt.", weiter: "k4" },
      { text: "Klingt nach deiner Küche.", weiter: "k4" } ] },
    k3: { sagt: "Na und? Meine Kürbis-Quiche gab’s auch nur in meinem Kopf, bis ich sie gemacht hab.", antworten: [
      { text: "Das stimmt allerdings.", weiter: "k2" },
      { text: "Dann los, ran an den Topf.", weiter: "k2" } ] },
    k4: { sagt: "Zimt, genau. Ich probier das heute Abend, Micha muss vorkosten.", antworten: [
      { text: "Der sagt eh lecker.", weiter: "k5" },
      { text: "Schreib mir, wie’s war.", weiter: "k6" } ] },
    k5: { sagt: "Eben. Darum ruf ich dich danach an, damit ich die Wahrheit hör.", antworten: [
      { text: "Die kriegst du.", weiter: null },
      { text: "Bring mir eine Tasse mit.", weiter: null } ] },
    k6: { sagt: "Mach ich. Und wenn’s gut wird, gibt’s das Sonntag, und du liest mir ein Kapitel vor.", antworten: [
      { text: "Abgemacht. Ein spannendes.", weiter: null },
      { text: "Das mit dem Drachen.", weiter: null } ] }
  },
  schluss: "Ich geh schon mal Karamell kochen. Bis bald!" },

{ id: "jane-17", wer: "jane", thema: "Wiedersehen auf dem Markt",
  knoten: {
    start: { sagt: "Rita, rate mal, wen ich heute auf dem Markt getroffen hab. Du kommst nie drauf.", antworten: [
      { text: "Jemand von der Bank?", weiter: "k2" },
      { text: "Sag schon, ich platz gleich.", weiter: "k3" } ] },
    k2: { sagt: "Genau! Die Behrendt aus der Kreditabteilung. Weißt du noch, die mit den großen Ohrringen?", antworten: [
      { text: "Die mit dem Lachen durchs Treppenhaus?", weiter: "k4" },
      { text: "Die so streng mit dem Kaffee war?", weiter: "k5" } ] },
    k3: { sagt: "Die Behrendt! Kreditabteilung! Die hat immer so gelacht, dass man’s bis in den Tresorraum gehört hat.", antworten: [
      { text: "Ach Gott, die Behrendt!", weiter: "k4" },
      { text: "Wie geht’s ihr denn?", weiter: "k4" } ] },
    k4: { sagt: "Lacht immer noch genauso. Der halbe Markt hat sich umgedreht.", antworten: [
      { text: "Hat sie nach mir gefragt?", weiter: "k6" },
      { text: "Das hätt ich gern gehört.", weiter: "k6" } ] },
    k5: { sagt: "Die mit dem Kaffee, ja! Wer die letzte Tasse nimmt, setzt neuen auf, das sagt sie heute noch.", antworten: [
      { text: "Recht hatte sie ja.", weiter: "k4" },
      { text: "Ich hab immer neuen aufgesetzt.", weiter: "k4" } ] },
    k6: { sagt: "Klar. Ich soll schön grüßen, und sie sagt, du warst die Einzige, die alle Zahlen im Kopf hatte.", antworten: [
      { text: "Das stimmt sogar.", weiter: null },
      { text: "Grüß sie lieb zurück.", weiter: null } ] }
  },
  schluss: "Den Rest erzähl ich dir Sonntag. Da gibt’s noch mehr." },

{ id: "jane-18", wer: "jane", thema: "Ein Blech zu viel",
  knoten: {
    start: { sagt: "Rita, ich hab aus Versehen ein Blech Pflaumenkuchen zu viel gebacken.", antworten: [
      { text: "Aus Versehen, ja?", weiter: "k2" },
      { text: "Wie viele sind es denn?", weiter: "k3" } ] },
    k2: { sagt: "Ganz aus Versehen. Die Pflaumen waren im Angebot, da hat meine Hand einfach zugegriffen.", antworten: [
      { text: "Diese Hand kenn ich.", weiter: "k4" },
      { text: "Und wie viele Bleche?", weiter: "k3" } ] },
    k3: { sagt: "Drei. Eins für uns, eins für die Nachbarn und eins … tja.", antworten: [
      { text: "Und eins für mich.", weiter: "k4" },
      { text: "Das dritte ist das wichtigste.", weiter: "k4" } ] },
    k4: { sagt: "Genau. Sahne hab ich auch schon geschlagen. Auch aus Versehen.", antworten: [
      { text: "Was für ein Zufall.", weiter: "k5" },
      { text: "Die Zufälle häufen sich.", weiter: "k5" } ] },
    k5: { sagt: "Max kommt doch bald zu dir. Der kommt vorher bei mir vorbei und kriegt den Kuchen mit.", antworten: [
      { text: "Zähl die Stücke vorher.", weiter: "k6" },
      { text: "Der kommt nie mit allen an.", weiter: "k6" } ] },
    k6: { sagt: "Ein Stück darf er unterwegs essen. Hab ich ihm gesagt, er hat nur gegrinst.", antworten: [
      { text: "Das heißt zwei.", weiter: null },
      { text: "Ich freu mich auf den Rest.", weiter: null } ] }
  },
  schluss: "Ich hab dich lieb, Rita. Und jetzt such ich die Kuchenbox." }
];
