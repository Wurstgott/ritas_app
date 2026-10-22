/* Spaß-Telefon, Teil 2: kleine Dialogspiele mit Greta, Pauli und Micha.
   Reines Datenobjekt, gleiches Schema wie D.anrufe. weiter:null = Gespräch endet nach dieser Antwort. */
D.anrufe2 = [

/* ==================== GRETA ==================== */

{ id: "greta-01", wer: "greta", thema: "Vollmond",
  knoten: {
    start: { sagt: "Hallo Rita! Ich wollt nur kurz fragen, siehst du den Mond auch? Der ist heute riesig.", antworten: [
      { text: "Der hängt direkt überm Forst.", weiter: "k2" },
      { text: "Ich seh nur meine Gardine.", weiter: "k3" } ] },
    k2: { sagt: "Wie schön. Ich hab ihn Max gezeigt, und er hat gesagt: „Jo. Mond.“", antworten: [
      { text: "So ist er, der Romantiker.", weiter: "k4" },
      { text: "Hat er wenigstens hingeguckt?", weiter: "k4" } ] },
    k3: { sagt: "Dann zieh sie mal kurz auf! Ich warte.", antworten: [
      { text: "Na gut. Oh, wirklich riesig.", weiter: "k4" },
      { text: "Es ist kalt, ich glaub’s dir.", weiter: "k5" } ] },
    k4: { sagt: "Ich weiß, ich bin da ein bisschen kitschig. Aber bei Vollmond darf man das, finde ich.", antworten: [
      { text: "Darf man immer.", weiter: "k6" },
      { text: "Bisschen Kitsch schadet nicht.", weiter: "k6" } ] },
    k5: { sagt: "Okay, dann beschreib ich ihn dir. Rund, ganz hell, und daneben eine Wolke, die aussieht wie ein Brötchen.", antworten: [
      { text: "Ich seh ihn genau vor mir.", weiter: "k6" },
      { text: "Jetzt hab ich Hunger.", weiter: "k6" } ] },
    k6: { sagt: "Ich hab übrigens noch Melissentee übrig. Max bringt ihn dir beim nächsten Mal mit.", antworten: [
      { text: "Wenn er ihn nicht vergisst.", weiter: null },
      { text: "Den trink ich bei Vollmond.", weiter: null } ] }
  },
  schluss: "Gute Nacht, Rita. Schlaf gut!" },

{ id: "greta-02", wer: "greta", thema: "Umzugskisten",
  knoten: {
    start: { sagt: "Rita, ich brauch Verstärkung. Max schreibt auf alle Umzugskisten nur „Zeug“.", antworten: [
      { text: "Na, ehrlich ist er.", weiter: "k2" },
      { text: "Gib ihm einen dicken Stift.", weiter: "k3" } ] },
    k2: { sagt: "Ehrlich schon. Aber in Leipzig stehen dann dreißig Kisten Zeug, und ich such die Teekanne.", antworten: [
      { text: "Die Teekanne fährt auf deinem Schoß.", weiter: "k4" },
      { text: "Nummern drauf und eine Liste.", weiter: "k5" } ] },
    k3: { sagt: "Hat er schon. Jetzt steht da „ZEUG“, in groß.", antworten: [
      { text: "Immerhin gut lesbar.", weiter: "k2" },
      { text: "Dann kriegt er Farben.", weiter: "k5" } ] },
    k4: { sagt: "Ja, so mach ich’s, in ein Handtuch gewickelt. Die ist noch von meiner Oma.", antworten: [
      { text: "So gehört sich das.", weiter: "k6" },
      { text: "Dann muss Max hinten sitzen.", weiter: "k6" } ] },
    k5: { sagt: "Eine Liste! Max hat gesagt, dass du genau das sagst. Er kennt dich echt gut.", antworten: [
      { text: "Und trotzdem schreibt er Zeug.", weiter: "k6" },
      { text: "Ich bin leicht zu erraten.", weiter: "k6" } ] },
    k6: { sagt: "Ich schreib jetzt klein drunter, was wirklich drin ist. Auf seine schreib ich Max-Zeug.", antworten: [
      { text: "Und eine Kiste nur für Socken.", weiter: null },
      { text: "Das nenn ich Ordnung.", weiter: null } ] }
  },
  schluss: "Danke, Rita! Ich geh jetzt Kisten beschriften." },

{ id: "greta-03", wer: "greta", thema: "Lieblingstee",
  knoten: {
    start: { sagt: "Ich misch grad Tee für den Winter. Was trinkst du eigentlich am liebsten?", antworten: [
      { text: "Schwarz, kräftig, mit Zucker.", weiter: "k2" },
      { text: "Kommt auf den Tag an.", weiter: "k3" } ] },
    k2: { sagt: "Oh. Okay. Dann ist meine Kräutermischung vielleicht nicht ganz deins.", antworten: [
      { text: "Probieren tu ich alles.", weiter: "k4" },
      { text: "Was ist denn drin?", weiter: "k5" } ] },
    k3: { sagt: "Erzähl mal. Ich mag das, wenn jemand für jeden Tag einen eigenen Tee hat.", antworten: [
      { text: "Morgens schwarz, abends Pfefferminz.", weiter: "k4" },
      { text: "Beim Krimi immer Fenchel.", weiter: "k5" } ] },
    k4: { sagt: "Gut, dann pack ich dir ein Tütchen ein. Wenn’s nichts ist, sag’s ruhig ehrlich.", antworten: [
      { text: "Mach ich, keine Sorge.", weiter: "k6" },
      { text: "Dann trinkt Max den Rest.", weiter: "k6" } ] },
    k5: { sagt: "Melisse, Apfelminze, bisschen Ringelblume. Und ich hab beim Trocknen auf den Mond geachtet, ja, ich weiß.", antworten: [
      { text: "Schmeckt man den Mond?", weiter: "k4" },
      { text: "Klingt nach Sommer.", weiter: "k4" } ] },
    k6: { sagt: "Ich kleb ein Schild drauf, damit Max die Finger davon lässt.", antworten: [
      { text: "Schreib Rita drauf, das reicht.", weiter: null },
      { text: "Ich zähl die Beutel nach.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita! Ich pack dir gleich was ein." },

{ id: "greta-04", wer: "greta", thema: "Die Wurmkiste",
  knoten: {
    start: { sagt: "Rita, ich muss dir was beichten. Wir haben jetzt Würmer. Also, in einer Kiste, für Kompost.", antworten: [
      { text: "In der Wohnung?", weiter: "k2" },
      { text: "Was sagt Max dazu?", weiter: "k3" } ] },
    k2: { sagt: "Unterm Küchentisch. Die fressen Gemüseschalen, und raus kommt Erde, das ist eigentlich toll.", antworten: [
      { text: "Und das riecht nicht?", weiter: "k4" },
      { text: "Das will ich mir angucken.", weiter: "k5" } ] },
    k3: { sagt: "Er wollte sie zählen, bis ich gesagt hab, das sind ein paar Hundert. Seitdem heißen alle Kevin.", antworten: [
      { text: "Typisch Max.", weiter: "k4" },
      { text: "Kevin ist ein guter Wurmname.", weiter: "k4" } ] },
    k4: { sagt: "Gar nicht, ehrlich. Nur einmal, als Max Zwiebeln reingeworfen hat, die mögen sie nicht.", antworten: [
      { text: "Ich roh auch nicht.", weiter: "k6" },
      { text: "Max lernt das noch.", weiter: "k6" } ] },
    k5: { sagt: "Echt? Die meisten sagen nur „iiih“ und reden dann übers Wetter.", antworten: [
      { text: "Ich hab früher Regenwürmer gesammelt.", weiter: "k6" },
      { text: "Ich bin neugierig, nicht zimperlich.", weiter: "k6" } ] },
    k6: { sagt: "Du bist echt die Beste. Wenn ich in Leipzig ein Beet hab, kriegst du die ersten Radieschen.", antworten: [
      { text: "Grüß die Kevins.", weiter: null },
      { text: "Ich freu mich drauf.", weiter: null } ] }
  },
  schluss: "So, ich geh füttern. Bis bald, Rita!" },

{ id: "greta-05", wer: "greta", thema: "Hofladen",
  knoten: {
    start: { sagt: "Max sagt, du fährst so gern zum Hofladen. Was holst du da am liebsten?", antworten: [
      { text: "Eier, Kartoffeln und … psst.", weiter: "k2" },
      { text: "Alles, was frisch reinkommt.", weiter: "k3" } ] },
    k2: { sagt: "Psst? Warum flüstern wir?", antworten: [
      { text: "Das Hühnchen steht neben mir.", weiter: "k4" },
      { text: "Es geht um Maishähnchen.", weiter: "k5" } ] },
    k3: { sagt: "Schön. Ich frag in Hofläden immer, wie die Tiere gehalten werden, das ist so ein Studiending.", antworten: [
      { text: "Frag die Bäuerin, die erzählt gern.", weiter: "k5" },
      { text: "Die Hühner laufen da draußen.", weiter: "k5" } ] },
    k4: { sagt: "Ach so! Dann reden wir in Codes. Ich sag „gelbe Sonne“, und du weißt Bescheid.", antworten: [
      { text: "Die gelbe Sonne war köstlich.", weiter: "k6" },
      { text: "Gelbe Sonne mit Kartoffeln.", weiter: "k6" } ] },
    k5: { sagt: "Mit Auslauf, das find ich gut. Aber leise, dem Hühnchen erzählen wir das nicht.", antworten: [
      { text: "Das bleibt unter uns.", weiter: "k6" },
      { text: "Es hat schon so geguckt.", weiter: "k6" } ] },
    k6: { sagt: "Wenn ich das nächste Mal da bin, fahren wir zusammen hin. Ich will die Bäuerin kennenlernen.", antworten: [
      { text: "Abgemacht. Ich zeig dir alles.", weiter: null },
      { text: "Die wird dich ausfragen.", weiter: null } ] }
  },
  schluss: "Grüß die gelbe Sonne von mir. Bis bald!" },

{ id: "greta-06", wer: "greta", thema: "Max als Kind",
  knoten: {
    start: { sagt: "Rita, darf ich dich was fragen? War Max als Kind auch schon so, dass er alles in letzter Minute macht?", antworten: [
      { text: "Schon im Kindergarten.", weiter: "k2" },
      { text: "Was hat er denn jetzt verschwitzt?", weiter: "k3" } ] },
    k2: { sagt: "Wirklich? Erzähl!", antworten: [
      { text: "Laternenfest ohne Laterne, jedes Jahr.", weiter: "k4" },
      { text: "Die Schuhe immer verkehrt rum.", weiter: "k4" } ] },
    k3: { sagt: "Er hat den Umzugswagen erst gestern bestellt. Für Samstag.", antworten: [
      { text: "Und es hat noch geklappt?", weiter: "k5" },
      { text: "Für ihn ist das früh.", weiter: "k5" } ] },
    k4: { sagt: "Ich lach mich kaputt. Darf ich ihn damit aufziehen?", antworten: [
      { text: "Aber nicht sagen, von wem.", weiter: "k6" },
      { text: "Nur ein bisschen.", weiter: "k6" } ] },
    k5: { sagt: "Ja, der letzte Wagen. Er hat sich gefreut, als hätte er im Lotto gewonnen.", antworten: [
      { text: "So war er schon immer.", weiter: "k4" },
      { text: "Glück hat er ja immer.", weiter: "k6" } ] },
    k6: { sagt: "Danke, Rita. Ich glaub, ich versteh ihn jetzt ein bisschen besser.", antworten: [
      { text: "Er ist ein Guter.", weiter: null },
      { text: "Frag mich jederzeit.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt Kisten packen. Er natürlich erst morgen." },

{ id: "greta-07", wer: "greta", thema: "Tagebuch",
  knoten: {
    start: { sagt: "Max hat erzählt, du schreibst Tagebuch, auf Papier. Ich hab auch wieder angefangen.", antworten: [
      { text: "Mit Füller?", weiter: "k2" },
      { text: "Was schreibst du denn rein?", weiter: "k3" } ] },
    k2: { sagt: "Mit Bleistift. Ist das schlimm?", antworten: [
      { text: "Bleistift ist was für Vorsichtige.", weiter: "k4" },
      { text: "Hauptsache, du schreibst.", weiter: "k4" } ] },
    k3: { sagt: "Meistens, was im Garten los war. Und manchmal Sachen, die Max so sagt.", antworten: [
      { text: "Da hast du viel zu tun.", weiter: "k5" },
      { text: "Was sagt er denn so?", weiter: "k5" } ] },
    k4: { sagt: "Ich radier halt gern. Bei dir wird bestimmt nie was durchgestrichen, oder?", antworten: [
      { text: "Doch, ganz viel.", weiter: "k6" },
      { text: "Ich streich mit Lineal.", weiter: "k6" } ] },
    k5: { sagt: "Gestern: „Ich bin nicht müde, ich bin nur leise.“ Um halb zehn, auf dem Sofa.", antworten: [
      { text: "Das schreib ich mir auch auf.", weiter: "k6" },
      { text: "Das hat er von Micha.", weiter: "k6" } ] },
    k6: { sagt: "Ich mal manchmal noch was an den Rand, ein Blatt oder so. Machst du das auch?", antworten: [
      { text: "Manchmal das Hühnchen.", weiter: null },
      { text: "Bei mir sind’s Pfeile.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita. Du kommst heute auch in mein Tagebuch." },

{ id: "greta-08", wer: "greta", thema: "Balkon in Leipzig",
  knoten: {
    start: { sagt: "Die Wohnung in Leipzig hat einen Balkon! Ich plan schon, was ich da pflanze.", antworten: [
      { text: "Wie groß ist er denn?", weiter: "k2" },
      { text: "Was soll da wachsen?", weiter: "k3" } ] },
    k2: { sagt: "Na ja. Zwei Stühle passen drauf. Oder ein Stuhl und sehr viele Töpfe.", antworten: [
      { text: "Ich weiß, was du nimmst.", weiter: "k4" },
      { text: "Dann geh in die Höhe.", weiter: "k5" } ] },
    k3: { sagt: "Tomaten, Kräuter, Kapuzinerkresse. Und Max will Erdbeeren.", antworten: [
      { text: "Die isst er vor der Ernte.", weiter: "k4" },
      { text: "Erdbeeren gehen gut im Topf.", weiter: "k5" } ] },
    k4: { sagt: "Ja, das ist mir auch klar. Ich pflanz einfach doppelt so viele.", antworten: [
      { text: "Oder eine Sorte, die er nicht mag.", weiter: "k6" },
      { text: "Ein Schild hilft da nicht.", weiter: "k6" } ] },
    k5: { sagt: "Micha baut mir ein Regal dafür. Er hat mir nur geschrieben: „Maße?“", antworten: [
      { text: "Dann miss gut nach.", weiter: "k6" },
      { text: "Das hält dann ewig.", weiter: "k6" } ] },
    k6: { sagt: "Im Sommer kriegst du die erste Tomate. Versprochen.", antworten: [
      { text: "Ich mal sie vorher ab.", weiter: null },
      { text: "Ich halt dich beim Wort.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt mit dem Zollstock raus. Bis bald!" },

{ id: "greta-09", wer: "greta", thema: "Malen",
  knoten: {
    start: { sagt: "Max sagt, du malst. Was malst du gerade?", antworten: [
      { text: "Bäume aus dem Forst.", weiter: "k2" },
      { text: "Das Hühnchen, mal wieder.", weiter: "k3" } ] },
    k2: { sagt: "Schön. Mit Wasserfarben?", antworten: [
      { text: "Aquarell, ja.", weiter: "k4" },
      { text: "Mit allem, was da ist.", weiter: "k4" } ] },
    k3: { sagt: "Und? Hält es still?", antworten: [
      { text: "Still schon, aber es meckert.", weiter: "k5" },
      { text: "Besser als jedes Modell.", weiter: "k5" } ] },
    k4: { sagt: "Ich hab’s auch mal probiert, aber bei mir wird alles braun. Wie Pfützenwasser.", antworten: [
      { text: "Warten, bis es trocken ist.", weiter: "k6" },
      { text: "Zu viel Wasser im Pinsel.", weiter: "k6" } ] },
    k5: { sagt: "Haha. Es will bestimmt immer von seiner guten Seite gemalt werden.", antworten: [
      { text: "Es hat nur eine.", weiter: "k4" },
      { text: "Von links, sagt es.", weiter: "k4" } ] },
    k6: { sagt: "Zeigst du mir das mal? Wenn ich das nächste Mal da bin, mit Tee?", antworten: [
      { text: "Gerne. Bring Papier mit.", weiter: null },
      { text: "Und ich zeig dir den Trick.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita! Ich freu mich aufs Malen." },

{ id: "greta-10", wer: "greta", thema: "Krimi für die Bahn",
  knoten: {
    start: { sagt: "Rita, ich brauch einen Krimi für die Bahn. Max sagt, du kennst dich aus.", antworten: [
      { text: "Wie gruselig darf’s sein?", weiter: "k2" },
      { text: "Wie lange fährst du denn?", weiter: "k3" } ] },
    k2: { sagt: "Nicht so sehr. Ich les manchmal die letzte Seite zuerst, damit ich ruhig bleibe.", antworten: [
      { text: "Greta! Das macht man nicht.", weiter: "k4" },
      { text: "Dann was Gemütliches mit Schnee.", weiter: "k5" } ] },
    k3: { sagt: "Halle–Leipzig, eine halbe Stunde. Für einen ganzen Mord wird das knapp.", antworten: [
      { text: "Dann einen mit kurzen Kapiteln.", weiter: "k5" },
      { text: "Du fährst ja öfter.", weiter: "k5" } ] },
    k4: { sagt: "Ich weiß. Max hat genauso geguckt, wie du gerade klingst.", antworten: [
      { text: "Ich klinge entsetzt.", weiter: "k6" },
      { text: "Lies wenigstens nicht den Namen.", weiter: "k6" } ] },
    k5: { sagt: "Gemütlich klingt gut. Mit einem netten Kommissar?", antworten: [
      { text: "Grummelig, aber mit gutem Herz.", weiter: "k6" },
      { text: "Nett wird er ab Seite hundert.", weiter: "k6" } ] },
    k6: { sagt: "Okay, ich versuch’s diesmal ohne Schummeln. Wenn ich’s nicht aushalte, ruf ich dich an.", antworten: [
      { text: "Und ich verrat nichts.", weiter: null },
      { text: "Dann lies einfach weiter.", weiter: null } ] }
  },
  schluss: "Danke, Rita! Ich such mir gleich einen raus." },

/* ==================== PAULI ==================== */

{ id: "pauli-01", wer: "pauli", thema: "Kochende Männer",
  knoten: {
    start: { sagt: "Rita, kurze Umfrage für meine WG. Müssen Männer kochen können?", antworten: [
      { text: "Müssen nicht. Sollten.", weiter: "k2" },
      { text: "Wer will das wissen?", weiter: "k3" } ] },
    k2: { sagt: "Gut. Das schreib ich genau so an den Kühlschrank.", antworten: [
      { text: "Wie viele hast du gefragt?", weiter: "k4" },
      { text: "Mit Ausrufezeichen.", weiter: "k4" } ] },
    k3: { sagt: "Ich. Weil ich gestern bei Max Nudeln gegessen hab.", antworten: [
      { text: "Dann lautet die Antwort: ja.", weiter: "k5" },
      { text: "Waren sie wenigstens warm?", weiter: "k5" } ] },
    k4: { sagt: "Drei. Dich, meine Mitbewohnerin und den Typen vom Späti, der hat nur mit den Schultern gezuckt.", antworten: [
      { text: "Das ist eine Enthaltung.", weiter: "k6" },
      { text: "Repräsentativ ist das nicht.", weiter: "k6" } ] },
    k5: { sagt: "Lauwarm, mit Ketchup. Er nennt das italienisch.", antworten: [
      { text: "Italien würde widersprechen.", weiter: "k6" },
      { text: "Ich ruf ihn nachher an.", weiter: "k6" } ] },
    k6: { sagt: "Ich halt fest: Rita ist für kochende Männer. Und gegen Ketchup auf Nudeln.", antworten: [
      { text: "Das kannst du so drucken.", weiter: null },
      { text: "Gegen Ketchup hab ich nichts.", weiter: null } ] }
  },
  schluss: "Danke, Rita. Du warst die beste Stimme der Umfrage." },

{ id: "pauli-02", wer: "pauli", thema: "Tanzen damals",
  knoten: {
    start: { sagt: "Rita, sag mal ehrlich. Wurde früher besser getanzt als heute?", antworten: [
      { text: "Früher wurde mehr getanzt.", weiter: "k2" },
      { text: "Heute wird mehr gehüpft.", weiter: "k3" } ] },
    k2: { sagt: "Mehr? Wo denn überhaupt?", antworten: [
      { text: "Überall, wo Musik lief.", weiter: "k4" },
      { text: "Im Tanzlokal, jeden Samstag.", weiter: "k4" } ] },
    k3: { sagt: "Okay, das ist fair. Ich hüpf auf Konzerten auch nur.", antworten: [
      { text: "Hüpfen ist auch Sport.", weiter: "k5" },
      { text: "Ich zeig dir mal einen Walzer.", weiter: "k5" } ] },
    k4: { sagt: "Und wer hat aufgefordert? Ihr oder die Jungs?", antworten: [
      { text: "Ich hab nie lange gewartet.", weiter: "k6" },
      { text: "Wer zu lange wartet, sitzt.", weiter: "k6" } ] },
    k5: { sagt: "Walzer? Ich tret dir auf die Füße, da kannst du sicher sein.", antworten: [
      { text: "Dann führst halt du.", weiter: "k6" },
      { text: "Meine Füße sind das gewohnt.", weiter: "k6" } ] },
    k6: { sagt: "Ehrlich, du bist cooler als die Hälfte meiner Freundinnen.", antworten: [
      { text: "Nur die Hälfte?", weiter: null },
      { text: "Sag ihnen das lieber nicht.", weiter: null } ] }
  },
  schluss: "Ich hüpf dann mal weiter. Bis bald, Rita!" },

{ id: "pauli-03", wer: "pauli", thema: "Plakat-Spruch",
  knoten: {
    start: { sagt: "Ich mal grad ein Plakat für den Frauentag. Mir fehlt noch der Spruch.", antworten: [
      { text: "Worum soll’s gehen?", weiter: "k2" },
      { text: "Kurz und frech.", weiter: "k3" } ] },
    k2: { sagt: "Gleicher Lohn. Aber nicht so bierernst, sonst lacht die WG.", antworten: [
      { text: "Gleiche Arbeit, gleiches Geld. Punkt.", weiter: "k4" },
      { text: "Das haben wir in der Bank auch gefordert.", weiter: "k5" } ] },
    k3: { sagt: "Kurz ist mein Problem. Ich schreib immer ganze Absätze auf die Pappe.", antworten: [
      { text: "Drei Wörter, nicht mehr.", weiter: "k4" },
      { text: "Dann nimm eine größere Pappe.", weiter: "k4" } ] },
    k4: { sagt: "Oh, das ist gut. Schön trocken.", antworten: [
      { text: "Und mit Ausrufezeichen.", weiter: "k6" },
      { text: "Trocken wirkt am besten.", weiter: "k6" } ] },
    k5: { sagt: "Echt? Und, habt ihr’s gekriegt?", antworten: [
      { text: "Nicht gleich. Aber wir waren laut.", weiter: "k6" },
      { text: "Teilweise. Den Rest machst du.", weiter: "k6" } ] },
    k6: { sagt: "Ich schick dir ein Foto, wenn’s fertig ist. Du bist ab jetzt meine Chefredakteurin.", antworten: [
      { text: "Gehalt in Kuchen, bitte.", weiter: null },
      { text: "Ich nehm die Stelle an.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt malen. Der Edding ist schon offen." },

{ id: "pauli-04", wer: "pauli", thema: "Halle gegen Berlin",
  knoten: {
    start: { sagt: "Steile These: Halle ist das bessere Berlin.", antworten: [
      { text: "Das sagt ihr jedes Jahr.", weiter: "k2" },
      { text: "Wo ist dann euer Forst?", weiter: "k3" } ] },
    k2: { sagt: "Ja, und jedes Jahr stimmt’s ein bisschen mehr. Keine Staus, und die Miete kann man bezahlen.", antworten: [
      { text: "Wir haben Wildschweine.", weiter: "k4" },
      { text: "Die Miete zählt, zugegeben.", weiter: "k5" } ] },
    k3: { sagt: "Wir haben die Heide. Und die Saale.", antworten: [
      { text: "Die Havel ist breiter.", weiter: "k4" },
      { text: "Na gut, ein Punkt für Halle.", weiter: "k5" } ] },
    k4: { sagt: "Okay, okay. Dafür haben wir den besten Döner, das ist bewiesen.", antworten: [
      { text: "Das sagt jede Stadt.", weiter: "k6" },
      { text: "Spandau hält da mit.", weiter: "k6" } ] },
    k5: { sagt: "Siehst du! Aus dir wird noch eine Hallenserin.", antworten: [
      { text: "Spandauerin bleib ich.", weiter: "k6" },
      { text: "Höchstens zu Besuch.", weiter: "k6" } ] },
    k6: { sagt: "Dann komm vorbei, und wir klären das vor Ort. Mit Döner.", antworten: [
      { text: "Und Stadtführung von dir.", weiter: null },
      { text: "Ich bleib aber parteiisch.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita. Halle wartet auf dich." },

{ id: "pauli-05", wer: "pauli", thema: "Max zieht weg",
  knoten: {
    start: { sagt: "Max zieht nach Leipzig. Dann bin ich die Einzige von uns in Halle.", antworten: [
      { text: "Dann gehört die Stadt dir.", weiter: "k2" },
      { text: "Wirst du ihn vermissen?", weiter: "k3" } ] },
    k2: { sagt: "Genau. Als Erstes übernehm ich sein Lieblingscafé, da gibt’s den besten Käsekuchen.", antworten: [
      { text: "Feindliche Übernahme.", weiter: "k4" },
      { text: "Weiß er das schon?", weiter: "k4" } ] },
    k3: { sagt: "Pff. Vielleicht ein bisschen. Wem soll ich denn jetzt was vorschimpfen, wenn die Nachrichten laufen?", antworten: [
      { text: "Ruf mich an, ich hör zu.", weiter: "k5" },
      { text: "Leipzig ist nicht weit.", weiter: "k5" } ] },
    k4: { sagt: "Noch nicht. Ich sag’s ihm, wenn der Umzugswagen um die Ecke ist.", antworten: [
      { text: "Das ist gemein.", weiter: "k6" },
      { text: "Gutes Timing.", weiter: "k6" } ] },
    k5: { sagt: "Echt? Dann ruf ich dich an. Du widersprichst wenigstens.", antworten: [
      { text: "Wenn du Unsinn redest, ja.", weiter: "k6" },
      { text: "Jederzeit.", weiter: "k6" } ] },
    k6: { sagt: "Ehrlich gesagt freu ich mich für die zwei. Aber sag ihm das nicht, sonst wird er rührselig.", antworten: [
      { text: "Ich sag kein Wort.", weiter: null },
      { text: "Ich sag nur: Pauli grüßt.", weiter: null } ] }
  },
  schluss: "So, ich muss. Das Café hat nur noch eine Stunde auf." },

{ id: "pauli-06", wer: "pauli", thema: "Fahrradreparatur",
  knoten: {
    start: { sagt: "Ich hab heute mein Fahrrad selbst repariert. Ohne Video und ohne einen Typen, der’s mir erklärt.", antworten: [
      { text: "Bravo! Was war kaputt?", weiter: "k2" },
      { text: "Und, fährt es noch?", weiter: "k3" } ] },
    k2: { sagt: "Die Kette ist dauernd rausgesprungen. Jetzt nicht mehr.", antworten: [
      { text: "Hast du sie gespannt?", weiter: "k4" },
      { text: "Dann bist du jetzt Mechanikerin.", weiter: "k5" } ] },
    k3: { sagt: "Es fährt. Quietscht ein bisschen, aber es fährt.", antworten: [
      { text: "Ein Tropfen Öl, dann ist Ruhe.", weiter: "k4" },
      { text: "Fahren ist die Hauptsache.", weiter: "k5" } ] },
    k4: { sagt: "Mit dem Schlüssel von Micha. Den hab ich ihm letztes Jahr geklaut, er weiß es noch nicht.", antworten: [
      { text: "Gib ihn Sonntag zurück.", weiter: "k6" },
      { text: "Der merkt das schon noch.", weiter: "k6" } ] },
    k5: { sagt: "Ich bin ganz schön stolz, ehrlich gesagt. Hast du so was früher auch gemacht?", antworten: [
      { text: "Was ich nicht konnte, hab ich gelernt.", weiter: "k6" },
      { text: "Selbst ist die Frau.", weiter: "k6" } ] },
    k6: { sagt: "Ich nenn das Rad jetzt Rosa. Du weißt schon, nach wem.", antworten: [
      { text: "Das passt zu dir.", weiter: null },
      { text: "Die hätte auch geschraubt.", weiter: null } ] }
  },
  schluss: "Rosa und ich drehen jetzt eine Runde. Tschau, Rita!" },

{ id: "pauli-07", wer: "pauli", thema: "Hermines B.ELFE.R.",
  knoten: {
    start: { sagt: "Max sagt, du liest Harry Potter, Band vier. Ist das der, in dem Hermine B.ELFE.R. gründet, den Bund für Elfenrechte?", antworten: [
      { text: "Genau der. Keiner will mitmachen.", weiter: "k2" },
      { text: "Woher weißt du das denn?", weiter: "k3" } ] },
    k2: { sagt: "Typisch. Sie hat recht, und alle finden sie anstrengend.", antworten: [
      { text: "Das kenn ich.", weiter: "k4" },
      { text: "Sie bleibt trotzdem dran.", weiter: "k5" } ] },
    k3: { sagt: "Hab ich mit zwölf gelesen. Hermine war mein erstes politisches Vorbild.", antworten: [
      { text: "Gute Wahl.", weiter: "k2" },
      { text: "Ich hätte sie auch gewählt.", weiter: "k2" } ] },
    k4: { sagt: "Echt? Wobei denn?", antworten: [
      { text: "Ich hab immer gesagt, was nicht stimmt.", weiter: "k6" },
      { text: "Bei jeder Betriebsversammlung.", weiter: "k6" } ] },
    k5: { sagt: "Und verkauft trotzdem weiter ihre Anstecker. Ich find das super, die gibt einfach nicht auf.", antworten: [
      { text: "Mach doch mit.", weiter: "k6" },
      { text: "Davon kann man was lernen.", weiter: "k6" } ] },
    k6: { sagt: "Okay, ich les Band vier nochmal. Dann reden wir drüber.", antworten: [
      { text: "Aber nichts verraten, ich bin mittendrin.", weiter: null },
      { text: "Ich freu mich drauf.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita. Grüß Hermine von mir." },

{ id: "pauli-08", wer: "pauli", thema: "Vorbilder",
  knoten: {
    start: { sagt: "Ich schreib was für die Uni über starke Frauen. Wer war dein Vorbild?", antworten: [
      { text: "Ich hab mir keins gesucht.", weiter: "k2" },
      { text: "Jede, die einfach anfängt.", weiter: "k3" } ] },
    k2: { sagt: "Gar keins? Das ist ja fast noch stärker.", antworten: [
      { text: "Ich hatte keine Zeit dafür.", weiter: "k4" },
      { text: "Ich hab einfach gemacht.", weiter: "k4" } ] },
    k3: { sagt: "Einfach anfangen. Klingt leicht, ist es aber nicht.", antworten: [
      { text: "Darum morgens, bevor man nachdenkt.", weiter: "k4" },
      { text: "Mit einer Liste geht’s.", weiter: "k5" } ] },
    k4: { sagt: "Kann ich das zitieren? Ohne Nachnamen, versprochen.", antworten: [
      { text: "Mit Vornamen ist gut.", weiter: "k6" },
      { text: "Nur, wenn ich’s lesen darf.", weiter: "k6" } ] },
    k5: { sagt: "Du und deine Listen. Max hat jetzt übrigens auch eine, wegen dir.", antworten: [
      { text: "Und, hält er sich dran?", weiter: "k4" },
      { text: "Na also, es wirkt.", weiter: "k4" } ] },
    k6: { sagt: "Klar. Du kriegst den Text als Erste, noch vor meiner Professorin.", antworten: [
      { text: "Ich les mit Rotstift.", weiter: null },
      { text: "Ich bin gespannt.", weiter: null } ] }
  },
  schluss: "Danke, Rita. Das wird ein guter Text." },

{ id: "pauli-09", wer: "pauli", thema: "Kaffee oder Tee",
  knoten: {
    start: { sagt: "Grundsatzfrage: Kaffee oder Tee?", antworten: [
      { text: "Tee. Da verhandle ich nicht.", weiter: "k2" },
      { text: "Morgens Kaffee, nachmittags Tee.", weiter: "k3" } ] },
    k2: { sagt: "Respekt. Ich bin bei vier Kaffee am Tag. Mit Hafermilch.", antworten: [
      { text: "Vier? Du zitterst ja.", weiter: "k4" },
      { text: "Hafermilch hab ich auch probiert.", weiter: "k5" } ] },
    k3: { sagt: "Vernünftig. Ich hab um vier noch einen getrunken und bereu es jetzt schon.", antworten: [
      { text: "Probier mal Tee.", weiter: "k4" },
      { text: "Das wird eine lange Nacht.", weiter: "k4" } ] },
    k4: { sagt: "Okay, was soll ich nehmen? Ich hab nur so einen Beuteltee, den meine Mitbewohnerin dagelassen hat.", antworten: [
      { text: "Schwarz, kräftig, mit Zucker.", weiter: "k6" },
      { text: "Frag Greta, die hat Kisten voll.", weiter: "k6" } ] },
    k5: { sagt: "Echt? Und?", antworten: [
      { text: "Im Kaffee geht’s. Pur nicht.", weiter: "k4" },
      { text: "Schmeckt wie flüssiger Haferbrei.", weiter: "k4" } ] },
    k6: { sagt: "Gut. Ich trink morgen einen und schreib dir, wie’s war.", antworten: [
      { text: "Ich erwarte einen Bericht.", weiter: null },
      { text: "Und keinen Kaffee hinterher.", weiter: null } ] }
  },
  schluss: "Ich setz jetzt Wasser auf. Für Tee. Wahrscheinlich." },

{ id: "pauli-10", wer: "pauli", thema: "WG-Putzplan",
  knoten: {
    start: { sagt: "Rita, unsere WG hat einen Putzplan. Hält sich nur keiner dran.", antworten: [
      { text: "Wie sieht der Plan aus?", weiter: "k2" },
      { text: "Du auch nicht?", weiter: "k3" } ] },
    k2: { sagt: "Ein Zettel am Kühlschrank, mit Smileys. Die keiner abhakt.", antworten: [
      { text: "Smileys sind zu nett.", weiter: "k4" },
      { text: "Ohne Haken wird nicht geputzt.", weiter: "k4" } ] },
    k3: { sagt: "Ich auch nicht. Aber ich hab wenigstens ein schlechtes Gewissen.", antworten: [
      { text: "Davon wird das Bad nicht sauber.", weiter: "k5" },
      { text: "Ist ja schon mal was.", weiter: "k4" } ] },
    k4: { sagt: "Was würdest du machen? Du bist doch die mit den Listen.", antworten: [
      { text: "Wer nicht putzt, kocht.", weiter: "k6" },
      { text: "Kuchen für den, der’s macht.", weiter: "k6" } ] },
    k5: { sagt: "Autsch. Stimmt aber.", antworten: [
      { text: "Also, was machen wir?", weiter: "k4" },
      { text: "Dann fang heute an.", weiter: "k6" } ] },
    k6: { sagt: "Gut, das führ ich heute Abend ein. Ich sag, das ist eine alte Spandauer Regel.", antworten: [
      { text: "Ab heute ist sie eine.", weiter: null },
      { text: "Viel Glück damit.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt revolutionieren. Erst den Plan, dann das Bad." },

/* ==================== MICHA ==================== */

{ id: "micha-01", wer: "micha", thema: "Chili-Ernte",
  knoten: {
    start: { sagt: "Rita. Micha. Die Chilis sind reif.", antworten: [
      { text: "Wie scharf sind sie dieses Jahr?", weiter: "k2" },
      { text: "Wie viele sind es?", weiter: "k3" } ] },
    k2: { sagt: "Ich hab eine probiert. Danach hab ich fünf Minuten nichts gesagt.", antworten: [
      { text: "Das merkt bei dir doch keiner.", weiter: "k4" },
      { text: "Hast du Milch getrunken?", weiter: "k5" } ] },
    k3: { sagt: "Dreiundvierzig. Zweimal gezählt.", antworten: [
      { text: "Gründlich wie immer.", weiter: "k4" },
      { text: "Mit Handschuhen?", weiter: "k5" } ] },
    k4: { sagt: "Eine Sorte hab ich nach dir benannt.", antworten: [
      { text: "Nach mir? Warum?", weiter: "k6" },
      { text: "Hoffentlich die schönste.", weiter: "k6" } ] },
    k5: { sagt: "Nein. Jetzt weiß ich’s fürs nächste Jahr.", antworten: [
      { text: "Das sagst du jedes Jahr.", weiter: "k4" },
      { text: "Und, brennen die Finger?", weiter: "k4" } ] },
    k6: { sagt: "Klein. Sieht harmlos aus. Ist sie nicht.", antworten: [
      { text: "Das nehm ich als Kompliment.", weiter: null },
      { text: "Ich will ein Glas davon.", weiter: null } ] }
  },
  schluss: "Ich bring dir welche mit. Mit Warnung." },

{ id: "micha-02", wer: "micha", thema: "Der Akkuschrauber",
  knoten: {
    start: { sagt: "Hab einen neuen Akkuschrauber. Christiane sagt, das ist der dritte.", antworten: [
      { text: "Und was sagst du?", weiter: "k2" },
      { text: "Was kann der neue?", weiter: "k3" } ] },
    k2: { sagt: "Der erste ist für Holz. Der zweite für Metall.", antworten: [
      { text: "Und der dritte?", weiter: "k4" },
      { text: "Klingt fast vernünftig.", weiter: "k4" } ] },
    k3: { sagt: "Licht vorne. Und er brummt zufrieden.", antworten: [
      { text: "So wie du nach dem Essen.", weiter: "k5" },
      { text: "Licht ist praktisch.", weiter: "k4" } ] },
    k4: { sagt: "Der dritte ist für die Stimmung.", antworten: [
      { text: "Und, hebt er sie?", weiter: "k6" },
      { text: "Das kauft dir Christiane nicht ab.", weiter: "k6" } ] },
    k5: { sagt: "Sagt Christiane auch.", antworten: [
      { text: "Na siehst du.", weiter: "k4" },
      { text: "Wer brummt lauter?", weiter: "k4" } ] },
    k6: { sagt: "Meine schon. An Christianes arbeite ich noch.", antworten: [
      { text: "Bring ihr Blumen mit.", weiter: null },
      { text: "Schraub ihr was an.", weiter: null } ] }
  },
  schluss: "Ich muss los. Er lädt. Ich auch." },

{ id: "micha-03", wer: "micha", thema: "Das Regal",
  knoten: {
    start: { sagt: "Christiane sagt, dein Regal ist schief.", antworten: [
      { text: "Das ist nicht schief, das ist Stil.", weiter: "k2" },
      { text: "Woher weiß sie das?", weiter: "k3" } ] },
    k2: { sagt: "Wie viel Grad Stil?", antworten: [
      { text: "So viel, dass Bücher rutschen.", weiter: "k4" },
      { text: "Ganz wenig. Elegant.", weiter: "k5" } ] },
    k3: { sagt: "Sie sagt, die Tassen halten sich aneinander fest.", antworten: [
      { text: "Meine Tassen sind sportlich.", weiter: "k4" },
      { text: "Na gut, ein bisschen.", weiter: "k5" } ] },
    k4: { sagt: "Ich komm Samstag mit der Wasserwaage.", antworten: [
      { text: "Bring Hunger mit.", weiter: "k6" },
      { text: "Und kein Wort zu Christiane.", weiter: "k6" } ] },
    k5: { sagt: "Elegant schief. Merk ich mir.", antworten: [
      { text: "Darfst du gern verwenden.", weiter: "k4" },
      { text: "Kostet aber was.", weiter: "k4" } ] },
    k6: { sagt: "Gut. Ich mach das Regal, du machst Kaffee.", antworten: [
      { text: "Tee, mein Lieber.", weiter: null },
      { text: "Und danach steht alles gerade.", weiter: null } ] }
  },
  schluss: "Bis Samstag. Halt durch, Regal." },

{ id: "micha-04", wer: "micha", thema: "Sonntagsbraten",
  knoten: {
    start: { sagt: "Rita. Kurze Frage. Wie viel darf man vom Braten naschen, bevor’s auffällt?", antworten: [
      { text: "Genau ein Stück.", weiter: "k2" },
      { text: "Hast du schon?", weiter: "k3" } ] },
    k2: { sagt: "Und wenn das Stück groß ist?", antworten: [
      { text: "Dann sind’s zwei.", weiter: "k4" },
      { text: "Dann merkt Christiane es sofort.", weiter: "k5" } ] },
    k3: { sagt: "Direkte Frage. Sagen wir: theoretisch.", antworten: [
      { text: "Theoretisch fehlt eine Ecke?", weiter: "k4" },
      { text: "Micha, ich hör dich kauen.", weiter: "k5" } ] },
    k4: { sagt: "Die Ecke war nicht schön. Jetzt sieht er besser aus.", antworten: [
      { text: "Sehr selbstlos.", weiter: "k6" },
      { text: "Du bist ein Künstler.", weiter: "k6" } ] },
    k5: { sagt: "Sie steht hinter mir.", antworten: [
      { text: "Dann sag schön Hallo.", weiter: "k6" },
      { text: "Viel Glück, mein Lieber.", weiter: "k6" } ] },
    k6: { sagt: "Christiane sagt, du sollst mich nicht auch noch ermutigen.", antworten: [
      { text: "Ich plädiere auf Hunger.", weiter: null },
      { text: "Ich hab gar nichts gesagt.", weiter: null } ] }
  },
  schluss: "Ich muss los. Küchenverbot. Mal wieder." },

{ id: "micha-05", wer: "micha", thema: "Fahrt zum Hofladen",
  knoten: {
    start: { sagt: "Ich fahr Samstag zum Hofladen. Soll ich dir was mitbringen?", antworten: [
      { text: "Eier und Kartoffeln, bitte.", weiter: "k2" },
      { text: "Das Übliche. Du weißt schon.", weiter: "k3" } ] },
    k2: { sagt: "Eier, Kartoffeln. Sonst nichts?", antworten: [
      { text: "Und vielleicht ein … Vögelchen.", weiter: "k3" },
      { text: "Na gut, noch Äpfel.", weiter: "k4" } ] },
    k3: { sagt: "Verstehe. Das Gelbe. Sag nichts.", antworten: [
      { text: "Psst. Das Hühnchen hört mit.", weiter: "k4" },
      { text: "Gut eingepackt, bitte.", weiter: "k5" } ] },
    k4: { sagt: "Ich wickel alles in Zeitung. Da guckt keiner rein.", antworten: [
      { text: "Nimm den Sportteil.", weiter: "k6" },
      { text: "Sehr unauffällig.", weiter: "k6" } ] },
    k5: { sagt: "Doppelt in Zeitung. Und ich trag die Tüte, als wär’s Gemüse.", antworten: [
      { text: "Und pfeif dabei.", weiter: "k6" },
      { text: "Perfekte Tarnung.", weiter: "k6" } ] },
    k6: { sagt: "Ich hab schon Christianes Geburtstagstorte an ihr vorbeigeschmuggelt. Das hier schaff ich auch.", antworten: [
      { text: "Daran zweifle ich nicht.", weiter: null },
      { text: "Ich bin beeindruckt.", weiter: null } ] }
  },
  schluss: "Bis Samstag. Unauffällig wie immer." },

{ id: "micha-06", wer: "micha", thema: "Erster Frost",
  knoten: {
    start: { sagt: "Es soll Frost geben. Ich hol die Chilis rein.", antworten: [
      { text: "Alle auf einmal?", weiter: "k2" },
      { text: "Wohin denn damit?", weiter: "k3" } ] },
    k2: { sagt: "Siebzehn Töpfe. Christiane hat bei zwölf aufgehört zu zählen.", antworten: [
      { text: "Aus Liebe oder Protest?", weiter: "k4" },
      { text: "Wo stehen die alle?", weiter: "k3" } ] },
    k3: { sagt: "Fensterbank, Flur, Bad. Einer steht auf dem Klavier.", antworten: [
      { text: "Spielt er auch?", weiter: "k5" },
      { text: "Und wo wohnt ihr jetzt?", weiter: "k4" } ] },
    k4: { sagt: "Christiane sagt, wir wohnen jetzt in einem Gewächshaus mit Sofa.", antworten: [
      { text: "Klingt doch gemütlich.", weiter: "k6" },
      { text: "Hauptsache, das Sofa bleibt frei.", weiter: "k6" } ] },
    k5: { sagt: "Nein. Aber wenn Christiane spielt, wird er röter.", antworten: [
      { text: "Ein musikalischer Chili.", weiter: "k6" },
      { text: "Das ist Rührung.", weiter: "k6" } ] },
    k6: { sagt: "Ich sag, wer Chilis im Haus hat, braucht weniger Heizung. Christiane sagt, das stimmt nicht.", antworten: [
      { text: "Christiane hat meistens recht.", weiter: null },
      { text: "Zieh lieber einen Pullover an.", weiter: null } ] }
  },
  schluss: "Ich muss los. Der Flur kriegt noch einen." },

{ id: "micha-07", wer: "micha", thema: "Umzugshilfe",
  knoten: {
    start: { sagt: "Max zieht um. Ich trag.", antworten: [
      { text: "Und was macht Max?", weiter: "k2" },
      { text: "Wie viele Kisten?", weiter: "k3" } ] },
    k2: { sagt: "Max trägt die Verantwortung. Die ist leichter.", antworten: [
      { text: "Typisch.", weiter: "k4" },
      { text: "Und Greta?", weiter: "k5" } ] },
    k3: { sagt: "Vierunddreißig. Auf allen steht „Zeug“.", antworten: [
      { text: "Greta hat nachgebessert, hab ich gehört.", weiter: "k5" },
      { text: "Sehr übersichtlich.", weiter: "k4" } ] },
    k4: { sagt: "Ich hab ihm meine alte Bohrmaschine geschenkt. Zum Einzug.", antworten: [
      { text: "Die gute?", weiter: "k6" },
      { text: "Kann er damit umgehen?", weiter: "k6" } ] },
    k5: { sagt: "Greta trägt die Pflanzen. Sie redet mit ihnen, damit sie ruhig bleiben.", antworten: [
      { text: "Das ist lieb.", weiter: "k4" },
      { text: "Redest du mit den Kisten?", weiter: "k4" } ] },
    k6: { sagt: "Er hat geguckt wie ein Kind vorm Weihnachtsbaum. Ich hab Dübel dazugelegt.", antworten: [
      { text: "Du bist ein Guter, Micha.", weiter: null },
      { text: "Dübel sind Liebe.", weiter: null } ] }
  },
  schluss: "Ich geh Kisten heben. Aus den Knien, sagt Christiane." },

{ id: "micha-08", wer: "micha", thema: "Krimiabend",
  knoten: {
    start: { sagt: "Christiane und ich gucken heute Krimi. Hast du einen Tipp, wer’s war?", antworten: [
      { text: "Welcher Krimi denn?", weiter: "k2" },
      { text: "Immer der Freundliche.", weiter: "k3" } ] },
    k2: { sagt: "Was mit Schnee. Kommissar, der nie lacht.", antworten: [
      { text: "Dann der Freundliche.", weiter: "k3" },
      { text: "Bleibst du diesmal wach?", weiter: "k4" } ] },
    k3: { sagt: "Der Freundliche. Dann wär’s hier im Haus Christiane.", antworten: [
      { text: "Das sag ich ihr.", weiter: "k5" },
      { text: "Oder der, der nascht.", weiter: "k5" } ] },
    k4: { sagt: "Letztes Mal zwölf Minuten. Ich steiger mich.", antworten: [
      { text: "Und wer erzählt dir das Ende?", weiter: "k6" },
      { text: "Heute schaffst du zwanzig.", weiter: "k6" } ] },
    k5: { sagt: "Ich nehm alles zurück. Ich will heute noch Abendbrot.", antworten: [
      { text: "Wie lange hältst du durch?", weiter: "k4" },
      { text: "Wer erzählt dir dann das Ende?", weiter: "k6" } ] },
    k6: { sagt: "Christiane. Morgens beim Kaffee. Das ist der beste Teil.", antworten: [
      { text: "Das ist ja fast romantisch.", weiter: null },
      { text: "Dann schlaf schön.", weiter: null } ] }
  },
  schluss: "Der Vorspann läuft. Ich bin schon müde." },

{ id: "micha-09", wer: "micha", thema: "Zahnstocher-Turm",
  knoten: {
    start: { sagt: "Neuer Rekord. Zahnstocherturm, einunddreißig Stockwerke.", antworten: [
      { text: "Wie hast du das geschafft?", weiter: "k2" },
      { text: "Und die Rouladen?", weiter: "k3" } ] },
    k2: { sagt: "Ruhige Hand. Und Christiane war einkaufen.", antworten: [
      { text: "Also ohne Aufsicht.", weiter: "k4" },
      { text: "Steht er noch?", weiter: "k5" } ] },
    k3: { sagt: "Die müssen jetzt mit Bindfaden auskommen.", antworten: [
      { text: "Christiane wird begeistert sein.", weiter: "k4" },
      { text: "Kunst geht vor.", weiter: "k5" } ] },
    k4: { sagt: "Sie hat ihn gesehen. Sie hat nur „Micha“ gesagt. In dem Ton.", antworten: [
      { text: "Den Ton kenn ich.", weiter: "k6" },
      { text: "Das ist fast ein Lob.", weiter: "k6" } ] },
    k5: { sagt: "Er steht. Wackelt nur, wenn einer atmet.", antworten: [
      { text: "Dann atme ich leise.", weiter: "k4" },
      { text: "Mach schnell ein Foto.", weiter: "k4" } ] },
    k6: { sagt: "Zu deinem Geburtstag bau ich dir einen. Mit Fahrstuhl.", antworten: [
      { text: "Mit Balkon, bitte.", weiter: null },
      { text: "Ich bring die Rouladen.", weiter: null } ] }
  },
  schluss: "Ich muss los. Der Turm wackelt." },

{ id: "micha-10", wer: "micha", thema: "Das letzte Stück Kuchen",
  knoten: {
    start: { sagt: "Rita. Ich brauch eine Schiedsrichterin. Es geht um Kuchen.", antworten: [
      { text: "Ich höre.", weiter: "k2" },
      { text: "Wer hat ihn gebacken?", weiter: "k3" } ] },
    k2: { sagt: "Das letzte Stück Pflaumenkuchen. Christiane sagt, das ist für dich.", antworten: [
      { text: "Christiane hat völlig recht.", weiter: "k4" },
      { text: "Und was sagst du?", weiter: "k5" } ] },
    k3: { sagt: "Christiane. Und sie hat das letzte Stück schon für dich eingepackt.", antworten: [
      { text: "Dann ist die Sache klar.", weiter: "k4" },
      { text: "Umsichtig, die Gute.", weiter: "k4" } ] },
    k4: { sagt: "Ich hab Alufolie drumgemacht. Ohne zu naschen.", antworten: [
      { text: "Ich zähl die Pflaumen nach.", weiter: "k6" },
      { text: "Du bist ein Gentleman.", weiter: "k6" } ] },
    k5: { sagt: "Ich sag nichts. Ich guck nur.", antworten: [
      { text: "Den Blick kenn ich.", weiter: "k4" },
      { text: "Zieht bei mir nicht.", weiter: "k4" } ] },
    k6: { sagt: "Bei Kuchen bin ich bei Christiane auf Platz zwei. Hinter dir.", antworten: [
      { text: "Platz zwei ist Silber.", weiter: null },
      { text: "Beim Werkzeug bist du Erster.", weiter: null } ] }
  },
  schluss: "Kommt Sonntag mit. Unversehrt, wahrscheinlich." }

];
