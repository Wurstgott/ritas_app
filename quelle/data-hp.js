/* ============================================================
   Akte Feuerkelch – Inhalte (Elsbeth Rohde, Kommissarin a. D., Lüneburg, AUSGEDACHT)
   Regeln:
   - Jede Zeile hat ihre eigene Freigabe ab: [Band, Kapitel]. Ein Blatt öffnet erst, wenn sein letztes Kapitel (bis) gelesen ist.
   - Kapitel mit Toten (dunkel): je Kapitel höchstens zwei sachliche Sätze, keine Frage, kein Vermerk, kein Witz, kein Anruf.
   - Höchstens jedes zweite Blatt hat eine Frage. Keine Kapiteltitel in Rückfragen, keine Seitenzahlen.
   - Fakten: geprüft, Quelle in faktencheck.md (Nummer im Feld fakt). Unsicheres ist rausgeflogen.
   - Buch, nicht Film. Keine Zitate, nur eigene Worte.
   Prüfung: D.hpPruefen() (läuft beim Build und im Test) – Register der Erstauftritte, Erwähnungen,
   Enthüllungen und Identitäten + Liste verbotener Vorgriffswörter.
   ============================================================ */
D.hpAkte = {
  version: 1,
  /* ---------- Register: ab wann darf ein Wort (oder eine Wortkombination) in einem Text stehen? ----------
     art: auftritt · erwaehnung · enthuellung · identitaet. m = Muster (klein, alle müssen vorkommen). */
  register: [
    { m: ["wurmschwanz"], ab: [4, 1], art: "auftritt" }, { m: ["voldemort"], ab: [4, 1], art: "auftritt" },
    { m: ["little hangleton"], ab: [4, 1], art: "erwaehnung" }, { m: ["frank bryce"], ab: [4, 1], art: "auftritt" }, { m: ["riddle"], ab: [4, 1], art: "erwaehnung" },
    { m: ["bertha"], ab: [4, 1], art: "erwaehnung" },
    { m: ["sirius"], ab: [4, 2], art: "erwaehnung" },
    { m: ["weltmeisterschaft"], ab: [4, 3], art: "erwaehnung" },
    { m: ["fuchsbau"], ab: [4, 4], art: "erwaehnung" }, { m: ["dudley", "zunge"], ab: [4, 4], art: "enthuellung" },
    { m: ["charlie"], ab: [4, 5], art: "auftritt" }, { m: ["percy"], ab: [4, 5], art: "auftritt" }, { m: ["bagman"], ab: [4, 5], art: "erwaehnung" },
    { m: ["portschlüssel"], ab: [4, 6], art: "erwaehnung" }, { m: ["portkey"], ab: [4, 6], art: "erwaehnung" }, { m: ["stiefel"], ab: [4, 6], art: "enthuellung" },
    { m: ["diggory"], ab: [4, 6], art: "auftritt" }, { m: ["cedric"], ab: [4, 6], art: "auftritt" },
    { m: ["crouch"], ab: [4, 7], art: "auftritt" }, { m: ["krum"], ab: [4, 7], art: "erwaehnung" }, { m: ["irland"], ab: [4, 7], art: "erwaehnung" }, { m: ["bulgarien"], ab: [4, 7], art: "erwaehnung" },
    { m: ["winky"], ab: [4, 8], art: "auftritt" }, { m: ["dobby"], ab: [4, 8], art: "erwaehnung" }, { m: ["fudge"], ab: [4, 8], art: "auftritt" }, { m: ["veela"], ab: [4, 8], art: "auftritt" },
    { m: ["dunkle mal"], ab: [4, 9], art: "enthuellung" }, { m: ["todesser"], ab: [4, 9], art: "erwaehnung" },
    { m: ["kimmkorn"], ab: [4, 10], art: "erwaehnung" }, { m: ["skeeter"], ab: [4, 10], art: "erwaehnung" },
    { m: ["durmstrang"], ab: [4, 11], art: "erwaehnung" }, { m: ["moody"], ab: [4, 11], art: "erwaehnung" }, { m: ["mad-eye"], ab: [4, 11], art: "erwaehnung" },
    { m: ["turnier"], ab: [4, 12], art: "enthuellung" }, { m: ["trimagisch"], ab: [4, 12], art: "enthuellung" }, { m: ["beauxbatons"], ab: [4, 12], art: "erwaehnung" },
    { m: ["siebzehn"], ab: [4, 12], art: "enthuellung" }, { m: ["champion"], ab: [4, 12], art: "enthuellung" },
    { m: ["frettchen"], ab: [4, 13], art: "enthuellung" },
    { m: ["b.elfe.r"], ab: [4, 14], art: "enthuellung" }, { m: ["elfenrechte"], ab: [4, 14], art: "enthuellung" }, { m: ["s.p.e.w"], ab: [4, 14], art: "enthuellung" }, { m: ["unverzeihlich"], ab: [4, 14], art: "enthuellung" },
    { m: ["maxime"], ab: [4, 15], art: "auftritt" }, { m: ["karkaroff"], ab: [4, 15], art: "auftritt" },
    { m: ["fleur"], ab: [4, 16], art: "auftritt" }, { m: ["delacour"], ab: [4, 16], art: "auftritt" }, { m: ["alterslinie"], ab: [4, 16], art: "enthuellung" },
    { m: ["drei bestellt"], ab: [4, 16], art: "enthuellung" }, { m: ["vier champions"], ab: [4, 16], art: "enthuellung" }, { m: ["vierten champion"], ab: [4, 16], art: "enthuellung" },
    { m: ["harrys namen", "kelch"], ab: [4, 16], art: "enthuellung" }, { m: ["fred", "bart"], ab: [4, 16], art: "enthuellung" }, { m: ["fall:"], ab: [4, 16], art: "enthuellung" },
    { m: ["ollivander"], ab: [4, 18], art: "auftritt" }, { m: ["eichung"], ab: [4, 18], art: "erwaehnung" }, { m: ["besenkammer"], ab: [4, 18], art: "enthuellung" },
    { m: ["drache", "aufgabe"], ab: [4, 19], art: "enthuellung" }, { m: ["hornschwanz"], ab: [4, 19], art: "enthuellung" }, { m: ["horntail"], ab: [4, 19], art: "enthuellung" },
    { m: ["karkaroff", "todesser"], ab: [4, 19], art: "identitaet" },
    { m: ["goldene ei"], ab: [4, 20], art: "enthuellung" }, { m: ["besen", "accio"], ab: [4, 20], art: "enthuellung" }, { m: ["zweite aufgabe"], ab: [4, 20], art: "enthuellung" },
    { m: ["weihnachtsball"], ab: [4, 22], art: "enthuellung" }, { m: ["yule"], ab: [4, 22], art: "enthuellung" }, { m: ["ersten tanz"], ab: [4, 22], art: "enthuellung" }, { m: ["walzer"], ab: [4, 22], art: "enthuellung" },
    { m: ["parvati"], ab: [4, 22], art: "auftritt" }, { m: ["ballrobe"], ab: [4, 23], art: "enthuellung" },
    { m: ["halbries"], ab: [4, 23], art: "identitaet" }, { m: ["hagrid", "riese"], ab: [4, 23], art: "identitaet" }, { m: ["mit dem ei", "bad"], ab: [4, 23], art: "enthuellung" },
    { m: ["riesenknüller"], ab: [4, 24], art: "erwaehnung" },
    { m: ["unter wasser"], ab: [4, 25], art: "enthuellung" },
    { m: ["dianthuskraut"], ab: [4, 26], art: "enthuellung" }, { m: ["gillyweed"], ab: [4, 26], art: "enthuellung" },
    { m: ["crouch", "sohn"], ab: [4, 27], art: "identitaet" }, { m: ["crouch junior"], ab: [4, 27], art: "identitaet" }, { m: ["barty junior"], ab: [4, 27], art: "identitaet" },
    { m: ["irrgarten"], ab: [4, 28], art: "enthuellung" }, { m: ["hecke"], ab: [4, 28], art: "enthuellung" }, { m: ["dritte aufgabe"], ab: [4, 28], art: "enthuellung" },
    { m: ["denkarium"], ab: [4, 30], art: "enthuellung" }, { m: ["pensieve"], ab: [4, 30], art: "enthuellung" }, { m: ["gerichtsverhandlung"], ab: [4, 30], art: "enthuellung" },
    { m: ["snape", "todesser"], ab: [4, 30], art: "identitaet" }, { m: ["bagman", "todesser"], ab: [4, 30], art: "identitaet" },
    { m: ["sphinx"], ab: [4, 31], art: "enthuellung" }, { m: ["pokal", "portschlüssel"], ab: [4, 31], art: "enthuellung" },
    { m: ["friedhof"], ab: [4, 32], art: "enthuellung" }, { m: ["cedric", "getötet"], ab: [4, 32], art: "enthuellung" }, { m: ["cedric", "stirbt"], ab: [4, 32], art: "enthuellung" },
    { m: ["voldemort", "gestalt"], ab: [4, 32], art: "enthuellung" }, { m: ["neuen körper"], ab: [4, 32], art: "enthuellung" },
    { m: ["voldemort", "zurück"], ab: [4, 33], art: "enthuellung" }, { m: ["duell"], ab: [4, 34], art: "enthuellung" },
    { m: ["veritaserum"], ab: [4, 35], art: "enthuellung" }, { m: ["wahrheitsserum"], ab: [4, 35], art: "enthuellung" }, { m: ["vielsaft"], ab: [4, 35], art: "identitaet" },
    { m: ["als moody verkleidet"], ab: [4, 35], art: "identitaet" }, { m: ["echte moody"], ab: [4, 35], art: "identitaet" }, { m: ["falsche moody"], ab: [4, 35], art: "identitaet" },
    { m: ["moody", "koffer"], ab: [4, 35], art: "identitaet" }, { m: ["winky", "barty"], ab: [4, 35], art: "identitaet" }, { m: ["krum", "imperius"], ab: [4, 35], art: "enthuellung" },
    { m: ["käfer"], ab: [4, 37], art: "identitaet" }, { m: ["animagus"], ab: [4, 37], art: "identitaet" }, { m: ["einmachglas"], ab: [4, 37], art: "identitaet" }, { m: ["preisgeld", "fred"], ab: [4, 37], art: "enthuellung" },
    /* spätere Bände (Altlasten-Wache) */
    { m: ["strick"], ab: [5, 1], art: "enthuellung", hinweis: "Hermine strickt den Elfen Mützen erst in Band 5" },
    { m: ["elfenmütze"], ab: [5, 1], art: "enthuellung" }, { m: ["umbridge"], ab: [5, 1], art: "auftritt" },
    { m: ["sirius", "stirbt"], ab: [5, 35], art: "enthuellung" }, { m: ["horkrux"], ab: [6, 23], art: "enthuellung" },
    { m: ["dumbledore", "stirbt"], ab: [6, 28], art: "enthuellung" }, { m: ["snape", "mörder"], ab: [6, 28], art: "enthuellung" }
  ],
  /* Wörter, die nach vorn schauen – in keinem Text vor dem letzten Kapitel */
  vorgriff: ["später", "nächsten band", "nächster band", "wart’s ab", "warte ab", "abwarten", "du wirst sehen", "wirst schon sehen", "noch nicht wissen", "ahnst", "ahnt noch", "spoiler", "am ende", "zum schluss", "bald wirst", "bald kommt", "schon bald", "demnächst", "kommt noch", "in wahrheit", "in wirklichkeit", "wendung", "überraschung", "pass auf", "merk dir"],

  /* ---------- Einstieg (Elsbeth siezt, bis sie das Du anbietet) ---------- */
  intro: {
    max: { ab: [4, 0], t: "Darf ich vorstellen? Elsbeth Rohde, Kriminal\u00adhaupt\u00adkommissarin a.\u00a0D. aus Lüneburg. Ausgedacht, wie Karin – aber sie liest den Feuerkelch mit dir, und zwar wie einen Krimi." },
    elsbeth: [
      { ab: [4, 0], t: "Rohde. Angenehm. Meine Nichte hat mir die Bücher hingelegt und gesagt, das sei im Grunde ein Krimi. Seitdem lese ich dienstlich." },
      { ab: [4, 0], t: "Ich lese genau so weit wie Sie, keine Seite weiter. Ehrenwort. Wo stehen Sie gerade?" }
    ]
  },
  du: { ab: [4, 3], t: "Und noch was: Wir ermitteln jetzt zusammen, da sag ich nicht länger Sie. Elsbeth." },

  baende: {
    4: {
      titel: "Akte Feuerkelch", kapitel: 37,
      fall: { ab: [4, 16], t: "Der Fall: Wer hat Harrys Namen in den Kelch geworfen?" },
      dunkel: [1, 32, 33, 34, 35, 36, 37],
      blaetter: [
        { id: "b4-01", von: 1, bis: 1, dunkel: true,
          zeilen: [{ ab: [4, 1], t: "Kapitel 1 spielt nicht in Hogwarts, sondern in einem leeren alten Haus in Little Hangleton.", fakt: "F05" },
            { ab: [4, 1], t: "Der alte Gärtner Frank Bryce hört dort nachts ein Gespräch mit, das er nicht hören sollte, und überlebt die Nacht nicht.", fakt: "F05" }],
          kurz: { ab: [4, 1], t: "Kapitel 1: Ein dunkler Anfang in Little Hangleton. Der alte Gärtner Frank Bryce überlebt die Nacht nicht." } },
        { id: "b4-02", von: 2, bis: 3, du: true,
          zeilen: [{ ab: [4, 2], t: "Kapitel 2: Harry wacht mit schmerzender Narbe auf und schreibt seinem Paten Sirius. Ein Junge, der bei Kopfweh seinem Paten schreibt – das notier ich gern.", fakt: "F06" },
            { ab: [4, 3], t: "Kapitel 3: Die Einladung zur Weltmeisterschaft kommt mit der ganz normalen Post. Der Umschlag ist über und über mit Briefmarken beklebt. Mrs Weasley wollte sichergehen.", fakt: "F07" }],
          vermerk: { ab: [4, 3], t: "Übersetzt hat den Feuerkelch Klaus Fritz. Er übersetzt Harry Potter seit dem ersten Band, also seit 1998, und hat in Berlin studiert. Ein halber Berliner also, wie du – gewissermaßen.", fundstelle: "Impressum", fakt: "F03" },
          kurz: { ab: [4, 3], t: "Kapitel 2 und 3: Harrys Narbe schmerzt, er schreibt Sirius. Dann kommt die Einladung zur Weltmeisterschaft – mit viel zu vielen Briefmarken." } },
        { id: "b4-03", von: 4, bis: 5,
          zeilen: [{ ab: [4, 4], t: "Kapitel 4: Die Weasleys kommen durch den Kamin, den die Dursleys verschlossen hatten. Danach hat Dudley eine sehr lange Zunge, und ich hab beim Lesen laut gelacht.", fakt: "F08" },
            { ab: [4, 4], t: "Buch, nicht Film: Im Film fehlt diese ganze Szene bei den Dursleys. Schade drum.", fakt: "F61" },
            { ab: [4, 5], t: "Kapitel 5: Im Fuchsbau sitzen auf einmal alle Weasleys am Tisch, auch Bill und Charlie. Fred und George basteln an Scherzartikeln, und Mrs Weasley findet das gar nicht komisch.", fakt: "F09" }],
          vermerk: { ab: [4, 5], t: "Im Original heißt der Traum der Zwillinge „Weasleys’ Wizard Wheezes“. Herr Fritz hat daraus „Weasleys zauberhafte Zauberscherze“ gemacht. Den Gleichklang hat er gerettet, nur mit Z statt W.", fundstelle: "Kapitel 5", fakt: "F10" },
          kurz: { ab: [4, 5], t: "Kapitel 4 und 5: Die Weasleys holen Harry durch den Kamin ab, Dudley bekommt eine lange Zunge. Im Fuchsbau sind alle Weasleys versammelt." } },
        { id: "b4-04", von: 6, bis: 7,
          zeilen: [{ ab: [4, 6], t: "Kapitel 6: Früh um fünf auf einem Hügel, und der Portschlüssel ist ein alter Stiefel. Ich hätte ihn weggeworfen. Gut, dass ich nie im Ministerium war.", fakt: "F11" },
            { ab: [4, 6], t: "Mit dabei: Amos Diggory und sein Sohn Cedric.", fakt: "F11" },
            { ab: [4, 7], t: "Kapitel 7: Auf dem Zeltplatz kämpft Mr Weasley mit Muggelgeld. Ludo Bagman wettet mit den Zwillingen, Barty Crouch ist steif wie ein Bügelbrett, und Harry kauft für sich, Ron und Hermine magische Ferngläser.", fakt: "F13" }],
          vermerk: { ab: [4, 6], t: "Im Original heißt der Stiefel-Reiseweg „Portkey“, key heißt Schlüssel. Herr Fritz hat es fast wörtlich genommen: Portschlüssel.", fundstelle: "Kapitel 6", fakt: "F12" },
          kurz: { ab: [4, 7], t: "Kapitel 6 und 7: Mit einem alten Stiefel als Portschlüssel geht es zur Weltmeisterschaft. Auf dem Zeltplatz tauchen Ludo Bagman und Barty Crouch auf." } },
        { id: "b4-05", von: 8, bis: 9,
          zeilen: [{ ab: [4, 8], t: "Kapitel 8: Das Endspiel. Irland gewinnt, obwohl Bulgariens Sucher Viktor Krum den goldenen Schnatz fängt. Ich hab’s zweimal gelesen und versteh es immer noch nicht.", fakt: "F14" },
            { ab: [4, 8], t: "Oben in der Loge hält eine kleine Hauselfe namens Winky ihrem Herrn einen Platz frei.", fakt: "F14" },
            { ab: [4, 9], t: "Kapitel 9: Nach dem Spiel wird es auf dem Zeltplatz ungemütlich, und am Himmel steht das Dunkle Mal. Winky wird mit Harrys Zauberstab gefunden. Ich hab danach erst mal im Flur Licht gemacht.", fakt: "F15" }],
          kurz: { ab: [4, 9], t: "Kapitel 8 und 9: Irland gewinnt das Endspiel, obwohl Krum den Schnatz fängt. Danach steht das Dunkle Mal am Himmel, und Winky hat Harrys Zauberstab." } },
        { id: "b4-06", von: 10, bis: 10,
          zeilen: [{ ab: [4, 10], t: "Kapitel 10: In der Zeitung steht ein Artikel über die Nacht auf dem Zeltplatz, geschrieben von einer gewissen Rita Kimmkorn. Bill sagt, die macht gern Leute schlecht.", fakt: "F16" },
            { ab: [4, 10], t: "Rita, ausgerechnet. Ich hab den Namen in der Akte unterstrichen und daneben geschrieben: nicht verwandt, nicht verschwägert, nicht so.", fakt: "F16" },
            { ab: [4, 10], t: "Außerdem bekommt Ron einen alten Umhang mit Spitze. Er ist entsetzt. Ich fand ihn eigentlich hübsch.", fakt: "F16" }],
          vermerk: { ab: [4, 10], t: "Im Original heißt sie Rita Skeeter. „Skeeter“ sagt man umgangssprachlich für Mücke. Bei Kimmkorn denk ich an Kimme und Korn, also ans Zielen. Ob Herr Fritz das auch so gemeint hat, weiß ich nicht – das ist nur meine Vermutung.", fundstelle: "Kapitel 10", fakt: "F17" },
          kurz: { ab: [4, 10], t: "Kapitel 10: Eine Rita Kimmkorn schreibt in der Zeitung über die Nacht auf dem Zeltplatz. Nicht verwandt mit dir, nicht verschwägert, nicht so." } },
        { id: "b4-07", von: 11, bis: 12,
          zeilen: [{ ab: [4, 11], t: "Kapitel 11: Im Hogwarts-Express erzählt Draco Malfoy, sein Vater hätte ihn fast nach Durmstrang geschickt. Ich hätte nichts dagegen gehabt.", fakt: "F20" },
            { ab: [4, 12], t: "Kapitel 12: Dumbledore kündigt das Trimagische Turnier an. Mitten in seine Rede platzt der neue Lehrer für Verteidigung gegen die dunklen Künste: Mad-Eye Moody.", fakt: "F21" }],
          kurz: { ab: [4, 12], t: "Kapitel 11 und 12: Im Zug prahlt Draco mit Durmstrang. In Hogwarts wird das Trimagische Turnier angekündigt, und Mad-Eye Moody kommt als neuer Lehrer." } },
        { id: "b4-08", von: 13, bis: 14,
          zeilen: [{ ab: [4, 13], t: "Kapitel 13: Moody verwandelt Draco Malfoy in ein Frettchen. Ich sag nichts dazu. Ich hab’s nur dreimal gelesen.", fakt: "F22" },
            { ab: [4, 13], t: "Und Hagrid bringt neue Tierchen mit, bei denen keiner weiß, wo vorne ist. Übrigens: „Mad-Eye“ hat Herr Fritz gar nicht übersetzt, das heißt auch bei uns so.", fakt: "F23" },
            { ab: [4, 14], t: "Kapitel 14: Moodys erste Stunde geht allen an die Nieren, Neville am meisten. Abends gründet Hermine einen Verein für Hauselfen: B.Elfe.R., den Bund für Elfenrechte. Ich wäre eingetreten.", fakt: "F24" }],
          vermerk: { ab: [4, 14], t: "Im Original heißt Hermines Verein S.P.E.W. Liest man das als Wort, heißt „spew“ so viel wie ausspucken. Herr Fritz hat lieber B.Elfe.R. draus gemacht. Ich finde: zu Recht.", fundstelle: "Kapitel 14", fakt: "F25" },
          kurz: { ab: [4, 14], t: "Kapitel 13 und 14: Moody macht aus Draco ein Frettchen und gibt eine harte erste Stunde. Hermine gründet B.Elfe.R., den Bund für Elfenrechte." } },
        { id: "b4-09", von: 15, bis: 16,
          zeilen: [{ ab: [4, 15], t: "Kapitel 15: Die Gäste kommen. Beauxbatons in einer riesigen fliegenden Kutsche mit Madame Maxime, Durmstrang auf einem Schiff aus dem See, mit Karkaroff. Ron erkennt Viktor Krum sofort.", fakt: "F26" },
            { ab: [4, 15], t: "Buch, nicht Film: Im Film reisen mit Beauxbatons nur Mädchen an. Im Buch ist das keine Mädchenschule.", fakt: "F27" },
            { ab: [4, 16], t: "Kapitel 16: Der Kelch steht bereit, mit einer Alterslinie drumherum. Fred und George trinken einen Trank, der sie älter machen soll, und fliegen raus – mit Bärten.", fakt: "F28" },
            { ab: [4, 16], t: "Dann wirft der Kelch die Namen aus: Fleur Delacour, Viktor Krum, Cedric Diggory. Und noch einen: Harry Potter. Drei bestellt, vier geliefert. Ab jetzt ist das hier eine richtige Akte.", fakt: "F28" }],
          vermerk: { ab: [4, 16], t: "Im Original ist der Kelch ein „Goblet of Fire“. Auf Schwedisch heißt der Band „Harry Potter och den flammande bägaren“, wörtlich: der flammende Becher.", fundstelle: "Kapitel 16", fakt: "F29" },
          kurz: { ab: [4, 16], t: "Kapitel 15 und 16: Beauxbatons und Durmstrang kommen an. Der Kelch wählt Fleur, Krum und Cedric – und dann noch Harry. Drei bestellt, vier geliefert." } },
        { id: "b4-10", von: 17, bis: 18,
          zeilen: [{ ab: [4, 17], t: "Kapitel 17: Harry sagt, er hat seinen Namen nicht eingeworfen, und Dumbledore glaubt ihm. Ron leider nicht. Das tat mir beim Lesen richtig weh.", fakt: "F30" },
            { ab: [4, 18], t: "Kapitel 18: Rita Kimmkorn in echt. Sie zieht Harry in eine Besenkammer, und ihre Feder schreibt Sachen auf, die er nie gesagt hat. So hätte ich nie vernommen.", fakt: "F31" },
            { ab: [4, 18], t: "Danach prüft Mr Ollivander die Zauberstäbe der vier Champions.", fakt: "F31" }],
          vermerk: { ab: [4, 18], t: "Im Original heißt das Stäbe-Prüfen „The Weighing of the Wands“, also das Wiegen. Herr Fritz nennt es „Eichung“. Wie beim Eichamt. Das gefällt mir.", fundstelle: "Kapitel 18", fakt: "F32" },
          kurz: { ab: [4, 18], t: "Kapitel 17 und 18: Dumbledore glaubt Harry, Ron nicht. Rita Kimmkorn taucht persönlich auf, und Mr Ollivander prüft die Zauberstäbe." } },
        { id: "b4-11", von: 19, bis: 20,
          zeilen: [{ ab: [4, 19], t: "Kapitel 19: Hagrid nimmt Harry nachts mit in den Wald und zeigt ihm, was bei der ersten Aufgabe wartet: Drachen. Charlie Weasley ist auch dabei.", fakt: "F33" },
            { ab: [4, 20], t: "Kapitel 20: Die erste Aufgabe. Harry holt sich das goldene Ei im Flug. Und Ron und Harry vertragen sich wieder – das war mir wichtiger als das Ei.", fakt: "F35" }],
          vermerk: { ab: [4, 19], t: "Harrys Drache heißt im Original „Hungarian Horntail“. Herr Fritz hat ihn fast Wort für Wort übersetzt: Ungarischer Hornschwanz.", fundstelle: "Kapitel 19", fakt: "F34" },
          kurz: { ab: [4, 20], t: "Kapitel 19 und 20: Hagrid zeigt Harry die Drachen. Bei der ersten Aufgabe holt Harry das goldene Ei, und er und Ron vertragen sich wieder." } },
        { id: "b4-12", von: 21, bis: 22,
          zeilen: [{ ab: [4, 21], t: "Kapitel 21: In der Schulküche arbeiten jetzt Dobby und Winky. Dobby bekommt Lohn und ist glücklich. Winky ist es nicht.", fakt: "F36" },
            { ab: [4, 22], t: "Kapitel 22: Professor McGonagall kündigt den Weihnachtsball an, und die Champions müssen den ersten Tanz eröffnen. Harry findet erst spät eine Partnerin, Cho geht mit Cedric. Harry hat mir leidgetan, ehrlich.", fakt: "F37" }],
          vermerk: { ab: [4, 22], t: "Buch, nicht Film: Im Film bringt McGonagall den Schülern das Tanzen bei und tanzt dabei mit Ron. Im Buch kommt das nicht vor.", fundstelle: "Kapitel 22", fakt: "F38" },
          kurz: { ab: [4, 22], t: "Kapitel 21 und 22: Dobby und Winky arbeiten in der Schulküche. Dann wird der Weihnachtsball angekündigt, und Harry braucht eine Partnerin." } },
        { id: "b4-13", von: 23, bis: 24,
          zeilen: [{ ab: [4, 23], t: "Kapitel 23: Der Ball. Hermine kommt mit Viktor Krum, und Ron guckt den ganzen Abend nur böse.", fakt: "F39" },
            { ab: [4, 23], t: "Cedric gibt Harry noch einen Tipp: Er soll mit dem Ei baden gehen. Klingt komisch, notiert ist es trotzdem.", fakt: "F39" },
            { ab: [4, 24], t: "Kapitel 24: Rita Kimmkorn schreibt einen gemeinen Artikel über Hagrid, und er macht niemandem mehr die Tür auf. Dumbledore und die drei holen ihn zurück in den Unterricht.", fakt: "F41" },
            { ab: [4, 24], t: "Im Original heißt so ein Artikel „Scoop“. Bei Herrn Fritz wird ein „Riesenknüller“ draus. Das Wort hab ich seit Jahren nicht gehört.", fakt: "F42" }],
          vermerk: { ab: [4, 23], t: "Im Original heißt der Ball „Yule Ball“. Yule ist ein altes englisches Wort für die Weihnachtszeit. Klingt wie das schwedische „jul“ aus „God Jul“.", fundstelle: "Kapitel 23", fakt: "F40" },
          kurz: { ab: [4, 24], t: "Kapitel 23 und 24: Beim Weihnachtsball kommt Hermine mit Krum. Danach schreibt Rita Kimmkorn einen gemeinen Artikel über Hagrid." } },
        { id: "b4-14", von: 25, bis: 26,
          zeilen: [{ ab: [4, 25], t: "Kapitel 25: In einem sehr feinen Badezimmer mit Marmor und Schaum hört Harry das Ei unter Wasser singen. Ein Gespenst gibt ihm ungefragt Tipps.", fakt: "F43" },
            { ab: [4, 25], t: "Auf dem Rückweg bleibt er mit dem Fuß in einer Trickstufe stecken, und Moody holt ihn da raus.", fakt: "F43" },
            { ab: [4, 26], t: "Kapitel 26: Die zweite Aufgabe im See. Dobby bringt Harry in letzter Minute ein Kraut, mit dem er unter Wasser atmen kann. Harry holt Ron hoch und dazu noch Fleurs kleine Schwester.", fakt: "F44" },
            { ab: [4, 26], t: "Er kommt als Letzter an und bekommt trotzdem viele Punkte, weil er auf alle gewartet hat. Gut so.", fakt: "F44" }],
          vermerk: { ab: [4, 26], t: "Buch, nicht Film: Im Buch bringt Dobby das Kraut. Im Film macht das Neville, und Dobby kommt im ganzen Film nicht vor.", fundstelle: "Kapitel 26", fakt: "F45" },
          kurz: { ab: [4, 26], t: "Kapitel 25 und 26: Das Ei singt nur unter Wasser. Bei der zweiten Aufgabe hilft Dobby mit einem Kraut, und Harry holt Ron und Fleurs Schwester aus dem See." } },
        { id: "b4-15", von: 27, bis: 28,
          zeilen: [{ ab: [4, 27], t: "Kapitel 27: Sirius wartet als großer schwarzer Hund und führt die drei zu seiner Höhle. Er lebt dort von Ratten. Ich koch ihm im Geiste eine Suppe.", fakt: "F46" },
            { ab: [4, 28], t: "Kapitel 28: Hermine bekommt böse Briefe wegen Rita Kimmkorns Artikel. Für die dritte Aufgabe wird ein Irrgarten angelegt.", fakt: "F47" },
            { ab: [4, 28], t: "Am Waldrand taucht Mr Crouch auf, völlig durcheinander, und will zu Dumbledore. Als Harry mit Dumbledore zurückkommt, ist er weg.", fakt: "F47" }],
          vermerk: { ab: [4, 28], t: "Rufus Beck, der die deutschen Hörbücher spricht, hat nach eigener Aussage nie einen Harry-Potter-Film gesehen. Buch, nicht Film – sympathisch.", fundstelle: "Interview", fakt: "F58" },
          kurz: { ab: [4, 28], t: "Kapitel 27 und 28: Sirius versteckt sich in einer Höhle. Für die dritte Aufgabe entsteht ein Irrgarten, und Mr Crouch taucht am Waldrand auf und ist dann verschwunden." } },
        { id: "b4-16", von: 29, bis: 31,
          zeilen: [{ ab: [4, 29], t: "Kapitel 29: Harry nickt im Unterricht ein, träumt schlecht und wacht mit schmerzender Narbe auf. Er geht sofort zu Dumbledore. Richtig so.", fakt: "F48" },
            { ab: [4, 30], t: "Kapitel 30: Harry fällt in Dumbledores Denkarium, eine Schale voller Erinnerungen, und sieht alte Gerichtsverhandlungen. Für eine Kommissarin a.\u00a0D. ist das ein Traum: ein Archiv, in das man hineinfallen kann.", fakt: "F49" },
            { ab: [4, 31], t: "Kapitel 31: Die dritte Aufgabe. Im Irrgarten trifft Harry auf eine Sphinx mit einem Rätsel. Kurz vor dem Ziel greifen er und Cedric den Pokal gemeinsam.", fakt: "F51" }],
          vermerk: { ab: [4, 30], t: "Im Original heißt die Schale „Pensieve“. Herr Fritz nennt sie Denkarium.", fundstelle: "Kapitel 30", fakt: "F50" },
          kurz: { ab: [4, 31], t: "Kapitel 29 bis 31: Harry träumt schlecht und fällt in Dumbledores Denkarium. Bei der dritten Aufgabe greifen er und Cedric den Pokal gemeinsam." } },
        { id: "b4-17", von: 32, bis: 32, dunkel: true,
          zeilen: [{ ab: [4, 32], t: "Kapitel 32: Der Pokal bringt Harry und Cedric auf einen fremden Friedhof.", fakt: "F52" },
            { ab: [4, 32], t: "Dort wird Cedric Diggory getötet, und Voldemort steigt in neuer Gestalt aus einem Kessel.", fakt: "F52" }],
          kurz: { ab: [4, 32], t: "Kapitel 32: Auf einem fremden Friedhof wird Cedric Diggory getötet, und Voldemort bekommt eine neue Gestalt." } },
        { id: "b4-18", von: 33, bis: 34, dunkel: true,
          zeilen: [{ ab: [4, 33], t: "Kapitel 33: Voldemort ruft seine alten Anhänger, die Todesser, auf dem Friedhof zusammen.", fakt: "F53" },
            { ab: [4, 33], t: "Er erzählt ihnen, wie er zurückgekommen ist.", fakt: "F53" },
            { ab: [4, 34], t: "Kapitel 34: Harry muss sich mit Voldemort duellieren, und ihre Zauberstäbe verbinden sich mit einem Lichtfaden.", fakt: "F54" },
            { ab: [4, 34], t: "So kann Harry entkommen und Cedric mit zurückbringen.", fakt: "F54" }],
          kurz: { ab: [4, 34], t: "Kapitel 33 und 34: Voldemort versammelt die Todesser. Harry übersteht das Duell und bringt Cedric zurück." } },
        { id: "b4-19", von: 35, bis: 37, dunkel: true,
          zeilen: [{ ab: [4, 35], t: "Kapitel 35: Unter Veritaserum kommt heraus, wer Harrys Namen in den Kelch geworfen hat: Barty Crouch junior, der das ganze Jahr als Moody verkleidet war.", fakt: "F55" },
            { ab: [4, 35], t: "Der echte Moody steckte die ganze Zeit in einem Koffer.", fakt: "F55" },
            { ab: [4, 36], t: "Kapitel 36: Minister Fudge will nicht glauben, dass Voldemort zurück ist.", fakt: "F56" },
            { ab: [4, 36], t: "Dumbledore schickt Sirius und Snape mit Aufträgen los, und Mrs Weasley nimmt Harry in den Arm.", fakt: "F56" },
            { ab: [4, 37], t: "Kapitel 37: Auf der Heimfahrt zeigt Hermine ein Einmachglas mit einem Käfer darin – Rita Kimmkorn ist ein nicht gemeldeter Animagus.", fakt: "F57" },
            { ab: [4, 37], t: "Und Harry schenkt Fred und George sein Preisgeld für ihren Scherzartikelladen.", fakt: "F57" }],
          kurz: { ab: [4, 37], t: "Kapitel 35 bis 37: Hinter Moody steckte Barty Crouch junior. Fudge will nichts wahrhaben. Auf der Heimfahrt sitzt Rita Kimmkorn als Käfer im Einmachglas." } }
      ],
      /* Fragen: höchstens jedes zweite Blatt. Rita hilft, sie wird nicht geprüft. */
      quiz: [
        { id: "q4-1", blatt: "b4-03", ab: [4, 4], frage: { ab: [4, 4], t: "Wie kommen die Weasleys bei den Dursleys ins Haus?" },
          antworten: [{ t: "Durch den Kamin", richtig: true }, { t: "Mit dem fliegenden Auto" }, { t: "Durch die Hintertür" }],
          aufl: { ab: [4, 4], t: "Durch den Kamin, mit Flohpulver und viel Lärm. Dass die Dursleys den verschlossen hatten, hat keinen aufgehalten." },
          huhn: { ab: [4, 4], t: "Durch den Briefschlitz. So würd ich’s machen." }, fakt: "F08" },
        { id: "q4-2", blatt: "b4-05", ab: [4, 8], frage: { ab: [4, 8], t: "Wer gewinnt die Weltmeisterschaft? Ich hab mir nur den Schnatz notiert." },
          antworten: [{ t: "Irland", richtig: true }, { t: "Bulgarien" }, { t: "Unentschieden" }],
          aufl: { ab: [4, 8], t: "Irland. Krum fängt zwar den Schnatz, aber da liegt Bulgarien schon zu weit hinten." },
          huhn: { ab: [4, 8], t: "Bulgarien. Die hatten doch den Schnatz. Logisch." }, fakt: "F14" },
        { id: "q4-3", blatt: "b4-07", ab: [4, 12], frage: { ab: [4, 12], t: "Wie alt muss man sein, um beim Turnier mitzumachen? Ich hab sechzehn notiert und wieder durchgestrichen." },
          antworten: [{ t: "Sechzehn" }, { t: "Siebzehn", richtig: true }, { t: "Achtzehn" }],
          aufl: { ab: [4, 12], t: "Siebzehn. Fred und George finden das gar nicht gut." },
          huhn: { ab: [4, 12], t: "Achtzehn. Wie beim Führerschein." }, fakt: "F21" },
        { id: "q4-4", blatt: "b4-09", ab: [4, 16], frage: { ab: [4, 16], t: "Wer wollte mit einem Trank über die Alterslinie?" },
          antworten: [{ t: "Fred und George", richtig: true }, { t: "Neville" }, { t: "Ron" }],
          aufl: { ab: [4, 16], t: "Fred und George. Die Linie hat sie rausgeworfen, mit Bart." },
          huhn: { ab: [4, 16], t: "Neville. Der traut sich was." }, fakt: "F28" },
        { id: "q4-5", blatt: "b4-11", ab: [4, 20], frage: { ab: [4, 20], t: "Wie kommt Harry bei der ersten Aufgabe an das goldene Ei?" },
          antworten: [{ t: "Er ruft seinen Besen herbei und fliegt", richtig: true }, { t: "Er schleicht sich unsichtbar ran" }, { t: "Er singt den Drachen in den Schlaf" }],
          aufl: { ab: [4, 20], t: "Mit dem Besen. Accio, und los." },
          huhn: { ab: [4, 20], t: "Er singt. Drachen mögen Musik. Hab ich mal gehört." }, fakt: "F35" },
        { id: "q4-6", blatt: "b4-14", ab: [4, 26], frage: { ab: [4, 26], t: "Wie heißt das Kraut, mit dem Harry unter Wasser atmen kann?" },
          antworten: [{ t: "Dianthuskraut", richtig: true }, { t: "Kiemenklee" }, { t: "Seetangwurz" }],
          aufl: { ab: [4, 26], t: "Dianthuskraut. Im Original heißt es „Gillyweed“. Ich musste auch nachgucken." },
          huhn: { ab: [4, 26], t: "Petersilie. Die hilft immer." }, fakt: "F44" }
      ],
      keineAhnung: [{ ab: [4, 0], t: "Macht nichts. Dafür steht’s ja hier." }, { ab: [4, 0], t: "Geht mir genauso. Deshalb schreib ich alles auf." }],
      /* Bitte an die Fachfrau (Tanzlehrerin) – ab der Ankündigung des Balls */
      bitten: [
        { id: "tanz", ab: [4, 22], t: "Bitte an die Fachfrau: In Hogwarts müssen die Champions den Weihnachtsball mit dem ersten Tanz eröffnen, und Harry graut’s davor. Was würdest du ihm als Erstes sagen?",
          antworten: [
            { t: "Nicht auf die Füße gucken. Die bleiben schon dran.", antwort: { ab: [4, 22], t: "Hab ich mitgeschrieben. Auf meinem ersten Polizeiball hab ich nur auf meine Füße geguckt. Und auf die vom Kollegen." } },
            { t: "Walzer. Und die Dame wird hinterher zurückgebracht.", antwort: { ab: [4, 22], t: "Das mit dem Zurückbringen hat mir damals keiner gesagt. Wird nachgetragen." } },
            { t: "Lächeln und zählen. Eins, zwei, drei.", antwort: { ab: [4, 22], t: "Zählen ist erlaubt? Das ändert alles. Danke, Frau Fachfrau." } }] }
      ],
      /* Pinnwand: alle aufgetretenen Personen, gleichrangig, alphabetisch (nach s), ab ihrem Auftritt */
      pinnwand: [
        { n: "Ludo Bagman", s: "Bagman", ab: [4, 7] }, { n: "Sirius Black", s: "Black", ab: [4, 19] }, { n: "Barty Crouch", s: "Crouch", ab: [4, 7] },
        { n: "Barty Crouch junior", s: "Crouch junior", ab: [4, 30] }, { n: "Fleur Delacour", s: "Delacour", ab: [4, 16] }, { n: "Amos Diggory", s: "Diggory A", ab: [4, 6] },
        { n: "Cedric Diggory", s: "Diggory C", ab: [4, 6] }, { n: "Dobby", s: "Dobby", ab: [4, 21] }, { n: "Albus Dumbledore", s: "Dumbledore", ab: [4, 12] },
        { n: "Cornelius Fudge", s: "Fudge", ab: [4, 8] }, { n: "Hermine Granger", s: "Granger", ab: [4, 7] }, { n: "Rubeus Hagrid", s: "Hagrid", ab: [4, 11] },
        { n: "Igor Karkaroff", s: "Karkaroff", ab: [4, 15] }, { n: "Rita Kimmkorn", s: "Kimmkorn", ab: [4, 18] }, { n: "Viktor Krum", s: "Krum", ab: [4, 8] },
        { n: "Neville Longbottom", s: "Longbottom", ab: [4, 11] }, { n: "Draco Malfoy", s: "Malfoy D", ab: [4, 8] }, { n: "Lucius Malfoy", s: "Malfoy L", ab: [4, 8] },
        { n: "Madame Maxime", s: "Maxime", ab: [4, 15] }, { n: "Minerva McGonagall", s: "McGonagall", ab: [4, 13] }, { n: "Alastor Moody", s: "Moody", ab: [4, 12] },
        { n: "Mr Ollivander", s: "Ollivander", ab: [4, 18] }, { n: "Severus Snape", s: "Snape", ab: [4, 17] }, { n: "Lord Voldemort", s: "Voldemort", ab: [4, 1] },
        { n: "Charlie Weasley", s: "Weasley C", ab: [4, 5] }, { n: "Fred und George Weasley", s: "Weasley F", ab: [4, 4] }, { n: "Percy Weasley", s: "Weasley P", ab: [4, 5] },
        { n: "Ron Weasley", s: "Weasley R", ab: [4, 4] }, { n: "Winky", s: "Winky", ab: [4, 8] }, { n: "Wurmschwanz", s: "Wurmschwanz", ab: [4, 1] }
      ],
      pinHinweis: { ab: [4, 16], t: "Ein Zettel, ein Name. Umhängen darfst du jederzeit. Aufgemacht wird erst, wenn das Buch zu ist. Meiner liegt schon in der Schublade." },
      /* Bandende: Elsbeths Zettel (geschrieben bei Kapitel 16, gezeigt erst nach Kapitel 37) – plausibel, aber falsch */
      elsbethZettel: { ab: [4, 37], name: "Igor Karkaroff", t: "Karkaroff. Er hat sich am lautesten beschwert, als der Kelch einen vierten Namen ausgespuckt hat. Und wer am lautesten schreit, hat meistens was zu verbergen.", fakt: "F30" },
      aufloesung: [
        { ab: [4, 37], t: "Dreißig Jahre Dienst, und dann sowas. Karkaroff hatte zwar Dreck am Stecken, aber den Namen hat er nicht eingeworfen.", fakt: "F60" },
        { ab: [4, 37], t: "Laut Akte war es Barty Crouch junior, das ganze Jahr als Moody verkleidet. Den hatte ich nicht mal auf dem Zettel.", fakt: "F55" }
      ],
      ritaNah: { ab: [4, 37], t: "Du warst näher dran als ich. Deutlich. Ich trag das so ins Protokoll ein." },
      ritaCrouch: { ab: [4, 37], t: "Richtiger Familienname, falscher Crouch. Das zählt bei mir als halber Treffer." },
      ritaAnders: { ab: [4, 37], t: "Da lagen wir beide daneben. Ich schlimmer, das ist amtlich." },
      ritaLeer: { ab: [4, 37], t: "Du hast nichts aufgeschrieben. Klug. Wer nichts aufschreibt, kann nicht danebenliegen." },
      maxZeile: { ab: [4, 37], t: "Elsbeth und du habt den Feuerkelch geschlossen. Ich bin beeindruckt und ein bisschen neidisch. Max" },
      /* Elsbeths seltene Anrufe – über das Telefon „Kurz plaudern“, nie in Kapiteln mit Toten */
      anrufe: [
        { id: "els-4-a", wer: "elsbeth", thema: "Siegellack", ab: [4, 4],
          knoten: {
            start: { sagt: "Rohde hier. Ich wollte nur hören, ob die Akte gut bei dir angekommen ist.", antworten: [
              { text: "Ist angekommen. Mit Siegel!", weiter: "k2" }, { text: "Wer ist da, bitte?", weiter: "k3" }] },
            k2: { sagt: "Das ist echter Siegellack. Mein Nachbar sagt, ich übertreib. Der mäht sonntags um acht Rasen.", antworten: [
              { text: "Das ist ja ein Fall für sich.", weiter: "k4" }, { text: "Und? Anzeige?", weiter: "k4" }] },
            k3: { sagt: "Elsbeth. Die Kommissarin aus Lüneburg. Ausgedacht, aber pünktlich.", antworten: [
              { text: "Ach, Elsbeth! Hallo.", weiter: "k2" }, { text: "Ausgedacht und pünktlich, das passt.", weiter: "k2" }] },
            k4: { sagt: "Ich hab ihm einen Zettel an den Zaun gehängt. Sachlich. Mit Uhrzeit.", antworten: [
              { text: "Gut so.", weiter: null }, { text: "Ein Protokoll. Sehr schön.", weiter: null }] }
          },
          schluss: "So. Ich les weiter, du auch. Rohde Ende." },
        { id: "els-4-b", wer: "elsbeth", thema: "Der vierte Name", ab: [4, 16],
          knoten: {
            start: { sagt: "Rohde. Ich hab schlecht geschlafen wegen dem Kelch. Drei bestellt, vier geliefert.", antworten: [
              { text: "Ich auch nicht.", weiter: "k2" }, { text: "Ich hab einen Verdacht.", weiter: "k3" }] },
            k2: { sagt: "Wer hatte Gelegenheit? Das ist immer die erste Frage. Die zweite ist, wer was davon hat.", antworten: [
              { text: "Das klingt nach Ystad.", weiter: "k4" }, { text: "Ich schreib’s auf meinen Zettel.", weiter: "k3" }] },
            k3: { sagt: "Nicht sagen! Ein Verdacht wird aufgeschrieben, nicht ausgesprochen. Meiner liegt schon in der Schublade.", antworten: [
              { text: "Meiner kommt auch dahin.", weiter: null }, { text: "Und wenn ich danebenliege?", weiter: "k5" }] },
            k4: { sagt: "Ystad ist weit weg. Ich hab nur Lüneburg und eine Thermoskanne. Reicht auch.", antworten: [
              { text: "Mit Kaffee geht alles.", weiter: null }, { text: "Dann schreib ich jetzt meinen Zettel.", weiter: null }] },
            k5: { sagt: "Dann liegen wir zu zweit daneben. Das ist im Ermittlungsteam erlaubt.", antworten: [
              { text: "Abgemacht.", weiter: null }, { text: "Beruhigend.", weiter: null }] }
          },
          schluss: "Also dann. Augen auf beim Weiterlesen." },
        { id: "els-4-c", wer: "elsbeth", thema: "Walzer", ab: [4, 23],
          knoten: {
            start: { sagt: "Rohde. Ich muss was gestehen: Ich kann keinen Walzer.", antworten: [
              { text: "Das lernt man!", weiter: "k2" }, { text: "Gar nicht?", weiter: "k3" }] },
            k2: { sagt: "Sagt die Fachfrau. Ich hab immer laut mitgezählt, da haben alle geguckt.", antworten: [
              { text: "Eins, zwei, drei ist genau richtig.", weiter: "k4" }, { text: "Zählen ist erlaubt.", weiter: "k4" }] },
            k3: { sagt: "Auf meinem ersten Polizeiball hab ich nur am Rand gestanden. Mit Apfelsaft.", antworten: [
              { text: "Das ändern wir.", weiter: "k2" }, { text: "Am Rand sieht man am meisten.", weiter: "k4" }] },
            k4: { sagt: "Dann übe ich in der Küche. Da guckt keiner. Höchstens der Kater von gegenüber.", antworten: [
              { text: "Viel Spaß!", weiter: null }, { text: "Teppich vorher wegrollen.", weiter: null }] }
          },
          schluss: "Danke, Frau Fachfrau. Rohde Ende." },
        { id: "els-4-d", wer: "elsbeth", thema: "Schwedenkrimi", ab: [4, 26],
          knoten: {
            start: { sagt: "Rohde. Ich hab mein Fernsehheft verlegt. Kommt heute was Schwedisches?", antworten: [
              { text: "Ich guck gleich nach.", weiter: "k2" }, { text: "Martin Beck vielleicht?", weiter: "k3" }] },
            k2: { sagt: "Danke. Das Heft lag übrigens unter dem Kater. Der hat’s gewärmt.", antworten: [
              { text: "Fall gelöst.", weiter: "k3" }, { text: "Kluger Kater.", weiter: "k3" }] },
            k3: { sagt: "Die zehn Martin-Beck-Bände stehen bei mir im Regal. Direkt neben dem Feuerkelch. Gute Nachbarschaft.", antworten: [
              { text: "Die stehen bei mir auch.", weiter: null }, { text: "Und Wallander?", weiter: "k4" }] },
            k4: { sagt: "Ein Fach drunter. Ich war nie in Ystad, aber ich kenn mich da aus. Vom Lesen.", antworten: [
              { text: "So geht’s mir auch.", weiter: null }, { text: "Ich würd mal hinfahren.", weiter: null }] }
          },
          schluss: "Gut. Ich mach mir einen Tee. Du dir auch, ja?" }
      ]
    },
    /* Band 5–7: Struktur steht, Inhalte kommen in Lieferungen. Neutrale Namen, die Akte zeigt nur „Neue Akte folgt“. */
    5: { titel: "Akte Nr. 5", kapitel: 38, platzhalter: true },
    6: { titel: "Akte Nr. 6", kapitel: 30, platzhalter: true },
    7: { titel: "Akte Nr. 7", kapitel: 37, platzhalter: true }
  },
  platzhalter: { ab: [0, 0], t: "Neue Akte folgt. Ich hab schon mal einen frischen Ordner hingelegt. Lies in Ruhe los – ich bin dann genau da, wo du bist." },
  /* Lesepausen: Elsbeths Nebenfälle, ganz ohne Buch */
  nebenfaelle: [
    { ab: [0, 0], t: "Nebenfall Rasenmäher: Der Nachbar mäht wieder sonntags um acht. Ich hab die Uhrzeit notiert, sonst nichts. Fürs Erste." },
    { ab: [0, 0], t: "Nebenfall Zeitung: Seit drei Tagen liegt meine Zeitung im Beet statt vor der Tür. Der Austräger hat einen neuen Wurf. Weit, aber ungenau." },
    { ab: [0, 0], t: "Nebenfall Butterkuchen: Beim Bäcker war der letzte Butterkuchen weg, als ich dran war. Die Frau vor mir hatte zwei. Ich sag nichts. Ich hab’s nur gesehen." },
    { ab: [0, 0], t: "Nebenfall Wetter: In Lüneburg nieselt es seit Dienstag. Ich lese mit Wolldecke und rede mit niemandem über den Himmel." },
    { ab: [0, 0], t: "Nebenfall Schlüssel: Schlüssel weg. Zwanzig Minuten gesucht. Er steckte von außen in der Tür. Dreißig Jahre Dienst." },
    { ab: [0, 0], t: "Nebenfall Kater: Der Kater von gegenüber sitzt jeden Morgen auf meiner Fußmatte. Motiv unklar. Ich vermute Leberwurst." },
    { ab: [0, 0], t: "Nebenfall Fernsehen: Gestern einen Schwedenkrimi angefangen. Nach zehn Minuten wusste ich, wer’s war. Hab trotzdem zu Ende geguckt. Wegen der Landschaft." },
    { ab: [0, 0], t: "Nebenfall Ystad: Ich war nie in Ystad, aber durch Wallander kenn ich mich da aus. Das kommt vom Lesen.", fakt: "F59" },
    { ab: [0, 0], t: "Nebenfall Martin Beck: Zehn Bände stehen bei mir im Regal. Ich les sie alle paar Jahre wieder. Man vergisst gnädigerweise, wer’s war.", fakt: "F59" },
    { ab: [0, 0], t: "Nebenfall Einkaufszettel: Mein Einkaufszettel lag im Kühlschrank. Neben der Butter. Die stand drauf." },
    { ab: [0, 0], t: "Nebenfall Treppenhaus: Im Treppenhaus riecht es nach Zimt. Ich ermittle nicht. Ich genieße." },
    { ab: [0, 0], t: "Nebenfall Brille: Brille gesucht. Saß auf dem Kopf. Bitte nicht weitererzählen." },
    { ab: [0, 0], t: "Nebenfall Fahrrad: Mein Rad hat einen Platten. Tatverdächtig ist der Bordstein vor dem Blumenladen. Der hat Vorstrafen." },
    { ab: [0, 0], t: "Nebenfall Kreuzworträtsel: Gesucht war „Ermittlerin im Ruhestand“. Ich hab „Rohde“ eingetragen. Passt nicht. Ist mir egal." }
  ]
};

/* Vorhandene Harry-Potter-Texte anderer Teile bekommen eine Freigabe (ohne die Dateien selbst zu ändern) */
D.hpFremdAb = { "pauli-07": [4, 14], "max-quiz": [4, 0], "jane-16": [4, 0], "max-06": [4, 0], "huhn-05": [4, 0] };
(D.anrufe || []).forEach(a => { if (a && D.hpFremdAb[a.id]) a.ab = D.hpFremdAb[a.id]; });

/* Seltene Besuche: Hühnchen meldet die Akte (Bedingungen in hp.js) */
D.ereignisse2 = D.ereignisse2 || [];
D.ereignisse2.push(
  { id: "huhn-akte-anruf", wer: "huhn", selten: .6, wenn: () => typeof hpAnrufWartet === "function" && hpAnrufWartet(),
    zeilen: ["Telefon! Eine Frau Rohde aus Lüneburg.", "Sie sagt, es geht um die Akte. Ich hab gesagt, ich hol dich."],
    antworten: [{ text: "Ich geh ran", sagt: "Ich stell durch. Das kann ich jetzt.", aktion: "tel:elsbeth" }, { text: "Gerade nicht", sagt: "Ich sag ihr, du liest. Das versteht sie." }] },
  { id: "huhn-akte-siegel", wer: "huhn", selten: .5, wenn: () => typeof hpSiegelWartet === "function" && hpSiegelWartet(),
    zeilen: ["Da liegt ein Umschlag mit rotem Siegel. Aus Lüneburg.", "Ich hab nicht reingeguckt. Das Siegel ist noch ganz."],
    antworten: [{ text: "Zeig her", sagt: "Bitte sehr. Ich halt die Lupe.", aktion: "hp-auf" }, { text: "Nachher", sagt: "Gut. Ich pass so lange drauf auf." }] },
  { id: "huhn-pinnwand", wer: "huhn", selten: .4, wenn: () => typeof hpPinnwandOffen === "function" && hpPinnwandOffen(),
    zeilen: ["Ich hab mir deine Pinnwand angeguckt. Mit Lupe.", "Ich hab einen Verdacht. Er ist aber geheim. Sogar vor mir."],
    antworten: [{ text: "Erzähl!", sagt: "Nee. Elsbeth sagt, ein Verdacht wird aufgeschrieben, nicht ausgesprochen." }, { text: "Du und deine Lupe", sagt: "Die ist nur zum Angeben. Sehen kann ich auch so." }] }
);

/* ============================================================
   Spoiler- und Regelprüfung (Build: node, Test: Browser).
   Gibt { fehler: [], warnungen: [] } zurück. Fehler = eigene Texte, Warnung = Altlasten anderer Dateien.
   ============================================================ */
D.hpPruefen = function (fremd) {
  const A = D.hpAkte, fehler = [], warnungen = [];
  const vgl = (a, b) => (a[0] - b[0]) || (a[1] - b[1]);
  const klein = s => String(s).toLowerCase().replace(/’/g, "'");
  const findet = (text, m) => { const t = klein(text); return m.every(x => { const k = klein(x).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); return new RegExp("(^|[^a-zäöüß])" + k).test(t); }); };
  const NICHT = new Set(["id", "fakt", "fundstelle", "art", "hinweis", "wer", "weiter", "m", "s", "blatt", "titel", "thema"]);
  function texte(o, ab, pfad, aus) {
    if (o == null) return;
    if (typeof o === "string") { aus.push({ t: o, ab, pfad }); return; }
    if (Array.isArray(o)) { o.forEach((x, i) => texte(x, ab, pfad + "[" + i + "]", aus)); return; }
    if (typeof o === "object") { const eigen = Array.isArray(o.ab) ? o.ab : ab; for (const k in o) { if (NICHT.has(k) || k === "ab" || typeof o[k] === "function" || typeof o[k] === "boolean" || typeof o[k] === "number") continue; texte(o[k], eigen, pfad + "." + k, aus); } }
  }
  function pruefe(liste, ziel, wo, ende) {
    for (const x of liste) {
      for (const r of A.register) if (vgl(r.ab, x.ab) > 0 && findet(x.t, r.m)) ziel.push(`${wo}${x.pfad} [ab ${x.ab}]: „${r.m.join(" + ")}“ erst ab ${r.ab} (${r.art}) – ${x.t.slice(0, 80)}`);
      if (vgl(x.ab, ende) < 0) for (const v of A.vorgriff) if (findet(x.t, [v])) ziel.push(`${wo}${x.pfad} [ab ${x.ab}]: Vorgriffswort „${v}“ – ${x.t.slice(0, 80)}`);
    }
  }
  /* eigene Texte */
  const eig = []; texte({ intro: A.intro, du: A.du, platzhalter: A.platzhalter, nebenfaelle: A.nebenfaelle }, [0, 0], "", eig);
  for (const e of D.ereignisse2 || []) if (/^huhn-(akte|pinnwand)/.test(e.id)) texte({ zeilen: e.zeilen, antworten: e.antworten }, [4, 0], "ereignis:" + e.id, eig);
  pruefe(eig, fehler, "Akte", [4, 37]);
  for (const nr in A.baende) {
    const B = A.baende[nr]; if (B.platzhalter) continue;
    const ende = [Number(nr), B.kapitel], liste = []; texte(B, [Number(nr), 0], `Band${nr}`, liste);
    pruefe(liste, fehler, "", ende);
    const dunkel = new Set(B.dunkel || []);
    let vorherQuiz = false, letztesBis = 0;
    for (const bl of B.blaetter) {
      if (bl.von !== letztesBis + 1) fehler.push(`${bl.id}: Kapitel-Lücke vor ${bl.von}`); letztesBis = bl.bis;
      for (const z of [...bl.zeilen, bl.vermerk, bl.kurz].filter(Boolean)) {
        if (!Array.isArray(z.ab) || vgl(z.ab, [Number(nr), bl.bis]) > 0) fehler.push(`${bl.id}: Zeile mit ab ${z.ab} liegt hinter dem Blatt (bis ${bl.bis})`);
        if (z.fakt == null && z !== bl.kurz) fehler.push(`${bl.id}: Zeile ohne Faktennummer – ${String(z.t).slice(0, 50)}`);
      }
      const hatDunkel = [...Array(bl.bis - bl.von + 1)].some((_, i) => dunkel.has(bl.von + i));
      if (hatDunkel && !bl.dunkel) fehler.push(`${bl.id}: enthält ein Kapitel mit Toten, ist aber nicht als dunkel markiert`);
      if (bl.dunkel) {
        if (bl.vermerk) fehler.push(`${bl.id}: dunkles Blatt mit Vermerk`);
        for (let k = bl.von; k <= bl.bis; k++) { const n = bl.zeilen.filter(z => z.ab[1] === k).reduce((s, z) => s + (z.t.match(/[.!?](\s|$)/g) || []).length, 0); if (n > 2) fehler.push(`${bl.id}: Kapitel ${k} hat ${n} Sätze (höchstens 2)`); }
      }
      const q = (B.quiz || []).find(q => q.blatt === bl.id);
      if (q && bl.dunkel) fehler.push(`${bl.id}: Frage auf dunklem Blatt`);
      if (q && vorherQuiz) fehler.push(`${bl.id}: zwei Blätter mit Frage hintereinander`);
      vorherQuiz = !!q;
      if (q) for (const t of [q.frage, q.aufl, q.huhn]) if (vgl(t.ab, [Number(nr), bl.bis]) > 0) fehler.push(`${q.id}: Freigabe hinter dem Blatt`);
    }
    if (letztesBis !== B.kapitel) fehler.push(`Band ${nr}: Blätter enden bei ${letztesBis}, Band hat ${B.kapitel} Kapitel`);
    for (const a of B.anrufe || []) { if (dunkel.has(a.ab[1])) fehler.push(`${a.id}: Anruf in einem Kapitel mit Toten`); if (vgl(a.ab, [Number(nr), 3]) < 0) fehler.push(`${a.id}: Anruf vor dem Du`); }
    for (const p of B.pinnwand || []) if (!Array.isArray(p.ab)) fehler.push(`Pinnwand ${p.n}: ohne Freigabe`);
  }
  /* Altlasten anderer Teile: Warnung */
  for (const f of fremd || []) { const l = []; texte(f.o, f.ab || [4, 0], f.wo, l); pruefe(l, warnungen, "", [9, 0]); }
  return { fehler, warnungen };
};
D.hpFremdTexte = function () {
  const ids = ["huhn-05", "max-06", "jane-16", "pauli-07"], out = [];
  for (const a of D.anrufe || []) if (ids.includes(a.id)) out.push({ wo: "anrufe:" + a.id, ab: a.ab || [4, 0], o: { knoten: a.knoten, schluss: a.schluss } });
  for (const b of D.brevvan || []) if (b && /Harry Potter/.test(b.thema || "")) out.push({ wo: "karin:" + b.id, ab: [4, 0], o: { knoten: b.knoten, schluss: b.schluss } });
  for (const s of D.stattDaddeln || []) if (/Potter|Feuerkelch|Zauber/.test((s.titel || "") + (s.text || ""))) out.push({ wo: "ideen:" + s.id, ab: [4, 0], o: { kopf: s.titel, text: s.text } });
  if (typeof EREIGNISSE !== "undefined") for (const e of EREIGNISSE) if (/Potter|Feuerkelch|Buch|Hogwarts/.test(JSON.stringify(e.zeilen))) out.push({ wo: "ereignis:" + e.id, ab: e.ab || [4, 0], o: { zeilen: e.zeilen, antworten: e.antworten } });
  return out;
};
