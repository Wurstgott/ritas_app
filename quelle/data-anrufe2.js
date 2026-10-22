/* Spaß-Telefon, Teil 2: kleine Dialogspiele mit Greta, Pauli und Micha.
   Reines Datenobjekt, gleiches Schema wie D.anrufe. weiter:null = Gespräch endet nach dieser Antwort. */
D.anrufe2 = [

/* ==================== GRETA ==================== */

{ id: "greta-01", wer: "greta", thema: "Vollmond",
  knoten: {
    start: { sagt: "Hallo Rita, heute ist Vollmond! Ich wollte nur fragen, ob du ihn auch siehst.", antworten: [
      { text: "Groß und rund über dem Forst.", weiter: "k2" },
      { text: "Der guckt mir gerade ins Fenster.", weiter: "k3" } ] },
    k2: { sagt: "Wie schön. Bei Vollmond soll man Kräuter ernten, dann sind sie besonders kräftig, sagt man.", antworten: [
      { text: "Mein Schnittlauch ist immer kräftig.", weiter: "k4" },
      { text: "Und was sagt die Wissenschaft?", weiter: "k5" } ] },
    k3: { sagt: "Dann sag ihm Hallo von mir. Ich bin sicher, er hat einen guten Geschmack, was Fenster angeht.", antworten: [
      { text: "Er hat einen Logenplatz, der Gute.", weiter: "k4" },
      { text: "Ich mach ihm gleich einen Tee.", weiter: "k4" } ] },
    k4: { sagt: "Ich gehe gleich raus und schneide Zitronenmelisse. Max hält mir die Taschenlampe.", antworten: [
      { text: "Bei Vollmond braucht man keine Lampe.", weiter: "k6" },
      { text: "Hauptsache, er leuchtet nicht dir ins Gesicht.", weiter: "k6" } ] },
    k5: { sagt: "Die Wissenschaft sagt: Bitte mehr Studien. Ich finde, ein bisschen Mondzauber schadet trotzdem nicht.", antworten: [
      { text: "Ein bisschen Zauber ist nie verkehrt.", weiter: "k4" },
      { text: "Ich bin eher der Teebeutel-Typ.", weiter: "k4" } ] },
    k6: { sagt: "Das hab ich ihm auch gesagt. Er meint, er leuchte lieber den Mond an, damit der sich nicht übersehen fühlt.", antworten: [
      { text: "Ganz der Max.", weiter: null },
      { text: "Grüß ihn und den Mond.", weiter: null } ] }
  },
  schluss: "Gute Nacht, Rita. Der Mond und ich winken dir." },

{ id: "greta-02", wer: "greta", thema: "Umzugskisten",
  knoten: {
    start: { sagt: "Rita, ich brauch kurz deine Expertise. Max beschriftet alle Umzugskisten mit „Zeug“.", antworten: [
      { text: "Das ist wenigstens ehrlich.", weiter: "k2" },
      { text: "Gib ihm sofort einen dicken Stift.", weiter: "k3" } ] },
    k2: { sagt: "Ehrlich schon. Aber in Leipzig stehen dann zwanzig Kisten „Zeug“, und ich suche die Teekanne.", antworten: [
      { text: "Die Teekanne trägst du selbst.", weiter: "k4" },
      { text: "Mach eine Liste mit Nummern.", weiter: "k5" } ] },
    k3: { sagt: "Hat er schon. Jetzt steht „ZEUG“ in Großbuchstaben drauf.", antworten: [
      { text: "Immerhin ist er gut lesbar.", weiter: "k2" },
      { text: "Dann bekommt er ein Farbsystem.", weiter: "k5" } ] },
    k4: { sagt: "Das ist weise. Die Teekanne fährt auf meinem Schoß, in ein Handtuch gewickelt wie ein Baby.", antworten: [
      { text: "So gehört sich das.", weiter: "k6" },
      { text: "Und Max auf dem Rücksitz?", weiter: "k6" } ] },
    k5: { sagt: "Eine Liste! Max hat gesagt, du würdest genau das sagen. Er kennt dich wirklich gut.", antworten: [
      { text: "Und trotzdem schreibt er „Zeug“.", weiter: "k6" },
      { text: "Listen sind mein zweiter Vorname.", weiter: "k6" } ] },
    k6: { sagt: "Ich glaube, ich schreibe jetzt auf jede Kiste noch ein kleines Wort dazu. „Küchenzeug“, „Bücherzeug“, „Gretazeug“.", antworten: [
      { text: "Und eine Kiste „Maxzeug“.", weiter: null },
      { text: "So sieht Ordnung aus. Bravo!", weiter: null } ] }
  },
  schluss: "Danke, Rita! Ich geh jetzt Kisten taufen." },

{ id: "greta-03", wer: "greta", thema: "Lieblingstee",
  knoten: {
    start: { sagt: "Ich mische gerade Kräutertee für den Winter. Was ist eigentlich dein Lieblingstee, Rita?", antworten: [
      { text: "Schwarz, stark, mit Zucker.", weiter: "k2" },
      { text: "Kommt drauf an, wie der Tag war.", weiter: "k3" } ] },
    k2: { sagt: "Oh, eine Frau mit klarer Haltung. Ich würde dir trotzdem gern eine kleine Mischung schicken, ganz unverbindlich.", antworten: [
      { text: "Was ist denn drin?", weiter: "k4" },
      { text: "Unverbindlich trinke ich alles.", weiter: "k5" } ] },
    k3: { sagt: "Das gefällt mir. Also ein Tee für jede Stimmung? Erzähl mal.", antworten: [
      { text: "Morgens wach, abends gemütlich.", weiter: "k4" },
      { text: "Bei Krimis immer Pfefferminze.", weiter: "k5" } ] },
    k4: { sagt: "Melisse, Ringelblume und ein bisschen Apfelminze. Ich hab sie bei abnehmendem Mond getrocknet.", antworten: [
      { text: "Schmeckt man den Mond?", weiter: "k6" },
      { text: "Klingt nach einem Sommer in der Tasse.", weiter: "k6" } ] },
    k5: { sagt: "Perfekt. Dann nenne ich die Mischung „Rita“. Mit einem kleinen Kommissar auf dem Etikett.", antworten: [
      { text: "Mit Hut, bitte.", weiter: "k6" },
      { text: "Ich fühle mich sehr geehrt.", weiter: "k6" } ] },
    k6: { sagt: "Ich packe sie dir ein und Max bringt sie beim nächsten Besuch mit. Wenn er sie nicht vorher austrinkt.", antworten: [
      { text: "Kleb ein Schild „Finger weg“ drauf.", weiter: null },
      { text: "Ich zähle die Teebeutel nach.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita! Und lass dir den Tee schmecken." },

{ id: "greta-04", wer: "greta", thema: "Atemübung",
  knoten: {
    start: { sagt: "Ich hab heute eine neue Atemübung gelernt. Vier Sekunden ein, vier halten, vier aus. Willst du mitmachen?", antworten: [
      { text: "Ich atme schon ein Leben lang.", weiter: "k2" },
      { text: "Na gut, zähl du vor.", weiter: "k3" } ] },
    k2: { sagt: "Ha! Und das sehr erfolgreich, würde ich sagen. Du bist quasi Profi.", antworten: [
      { text: "Ohne Zertifikat, aber mit Erfahrung.", weiter: "k4" },
      { text: "Ich könnte Kurse geben.", weiter: "k5" } ] },
    k3: { sagt: "Eins, zwei, drei, vier … und halten … Rita, kicherst du?", antworten: [
      { text: "Ich halte nur sehr fröhlich.", weiter: "k4" },
      { text: "Das Hühnchen guckt so komisch.", weiter: "k4" } ] },
    k4: { sagt: "Das ist die beste Version, die ich je gehört habe. Ich glaube, Lachen zählt auch als Atemübung.", antworten: [
      { text: "Dann übe ich jeden Tag.", weiter: "k6" },
      { text: "Bei Max-Anrufen übe ich doppelt.", weiter: "k6" } ] },
    k5: { sagt: "Ich wäre die Erste in der Reihe. Wie hieße dein Kurs?", antworten: [
      { text: "„Einfach machen“, ganz klar.", weiter: "k6" },
      { text: "„Tief durchatmen und Tee kochen“.", weiter: "k6" } ] },
    k6: { sagt: "Den Titel klau ich mir für meinen Kalender. Mit Quellenangabe, versprochen.", antworten: [
      { text: "Rita, Spandauer Forst, sehr gerne.", weiter: null },
      { text: "Ich will Tantiemen in Tee.", weiter: null } ] }
  },
  schluss: "Danke fürs Mitatmen, Rita. Das war schön." },

{ id: "greta-05", wer: "greta", thema: "Hofladen",
  knoten: {
    start: { sagt: "Rita, ich hab gehört, du hast einen tollen Hofladen in der Nähe. Was kaufst du da am liebsten?", antworten: [
      { text: "Eier, Kartoffeln und … psst.", weiter: "k2" },
      { text: "Alles, was nach Sonntag riecht.", weiter: "k3" } ] },
    k2: { sagt: "Psst? Warum flüstern wir? Ist jemand in der Nähe?", antworten: [
      { text: "Das Hühnchen hört mit.", weiter: "k4" },
      { text: "Es geht um Maishähnchen.", weiter: "k5" } ] },
    k3: { sagt: "Was für eine schöne Beschreibung. Ich frag bei Hofläden immer, wie die Tiere leben, das ist so ein Studiending.", antworten: [
      { text: "Frag die Bäuerin, die erzählt gern.", weiter: "k4" },
      { text: "Die Hühner dort laufen draußen.", weiter: "k5" } ] },
    k4: { sagt: "Oh, ich verstehe. Dann reden wir in Codewörtern. Ich sage „gelbe Sonne“, und du weißt Bescheid.", antworten: [
      { text: "Die gelbe Sonne war köstlich.", weiter: "k6" },
      { text: "Gelbe Sonne mit Kartoffeln, perfekt.", weiter: "k6" } ] },
    k5: { sagt: "Ganz leise: Maishähnchen von Höfen mit Auslauf finde ich gut. Aber das Hühnchen muss das ja nicht wissen.", antworten: [
      { text: "Das bleibt unter uns.", weiter: "k6" },
      { text: "Das Hühnchen ist aus Ton.", weiter: "k6" } ] },
    k6: { sagt: "Wenn ich das nächste Mal da bin, gehen wir zusammen hin. Ich bringe einen Korb und gute Tarnung mit.", antworten: [
      { text: "Ich bringe die Sonnenbrille.", weiter: null },
      { text: "Abgemacht. Geheimmission Hofladen.", weiter: null } ] }
  },
  schluss: "Ich muss los, Rita. Grüß die gelbe Sonne von mir!" },

{ id: "greta-06", wer: "greta", thema: "Max’ Macken",
  knoten: {
    start: { sagt: "Rita, darf ich dich was fragen? Max sortiert seine Socken nach Laune, nicht nach Farbe. War das schon immer so?", antworten: [
      { text: "Max hatte schon immer System.", weiter: "k2" },
      { text: "Was ist denn heute seine Laune?", weiter: "k3" } ] },
    k2: { sagt: "Ja, sein eigenes. Ich verstehe es nur noch nicht ganz. Gibt es eine Anleitung?", antworten: [
      { text: "Die hat er nur im Kopf.", weiter: "k4" },
      { text: "Frag ihn mit viel Geduld.", weiter: "k5" } ] },
    k3: { sagt: "Heute sind es die grünen mit den Dinos. Er sagt, das ist ein „Dienstagsgefühl“.", antworten: [
      { text: "Dinos sind ein guter Dienstag.", weiter: "k4" },
      { text: "Und mittwochs trägt er Wale?", weiter: "k5" } ] },
    k4: { sagt: "Ich glaube, ich fange an, es zu mögen. Man weiß morgens immer, wie er drauf ist.", antworten: [
      { text: "Ein Barometer mit Füßen.", weiter: "k6" },
      { text: "Praktischer als jede Wetter-App.", weiter: "k6" } ] },
    k5: { sagt: "Ich hab gefragt. Er hat eine halbe Stunde erklärt und am Ende selbst gelacht.", antworten: [
      { text: "Das ist das beste Zeichen.", weiter: "k4" },
      { text: "Dann hat er es auch nicht verstanden.", weiter: "k4" } ] },
    k6: { sagt: "Danke, Rita. Du weißt so viel über ihn, ich frag dich jetzt öfter, wenn ich ihn entschlüsseln muss.", antworten: [
      { text: "Mein Telefon ist immer offen.", weiter: null },
      { text: "Für Max-Fragen gibt’s keine Wartezeit.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt Socken deuten. Bis bald, Rita!" },

{ id: "greta-07", wer: "greta", thema: "Tagebuch",
  knoten: {
    start: { sagt: "Max hat erzählt, du schreibst Tagebuch auf Papier. Ich hab gerade auch damit angefangen!", antworten: [
      { text: "Willkommen im Club der Füller.", weiter: "k2" },
      { text: "Was schreibst du denn so rein?", weiter: "k3" } ] },
    k2: { sagt: "Ich schreibe allerdings mit Bleistift. Darf ich trotzdem in den Club?", antworten: [
      { text: "Bleistift ist die Probezeit.", weiter: "k4" },
      { text: "Mit Radiergummi ist das Schummeln.", weiter: "k4" } ] },
    k3: { sagt: "Mondphasen, was im Garten blüht und drei gute Dinge pro Tag. Heute war eins davon: Rita anrufen.", antworten: [
      { text: "Da bin ich ja in bester Gesellschaft.", weiter: "k5" },
      { text: "Und die anderen zwei?", weiter: "k5" } ] },
    k4: { sagt: "Ha, du bist streng! Was schreibst du eigentlich rein, wenn ich fragen darf?", antworten: [
      { text: "Alles, was der Tag so bringt.", weiter: "k6" },
      { text: "Das ist streng geheim.", weiter: "k6" } ] },
    k5: { sagt: "Ein Kohlrabi, der endlich gewachsen ist, und Max, der ohne Wecker aufgestanden ist. Beides selten.", antworten: [
      { text: "Das Zweite ist seltener.", weiter: "k6" },
      { text: "Das gehört eingerahmt.", weiter: "k6" } ] },
    k6: { sagt: "Ich male jetzt noch einen kleinen Mond an den Rand. Das gehört bei mir dazu.", antworten: [
      { text: "Ich male heute ein Hühnchen.", weiter: null },
      { text: "Mach ihn halb, wie heute.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita. Ich schreib dich gleich auf." },

{ id: "greta-08", wer: "greta", thema: "Balkon in Leipzig",
  knoten: {
    start: { sagt: "Die neue Wohnung in Leipzig hat einen Balkon! Ich plane schon ein Hochbeet.", antworten: [
      { text: "Wie groß ist der Balkon?", weiter: "k2" },
      { text: "Was soll denn reinwachsen?", weiter: "k3" } ] },
    k2: { sagt: "Ehrlich gesagt: zwei Stühle und ein Gedanke. Aber ich bin ja Expertin für kleine Flächen.", antworten: [
      { text: "Dann wird es ein Hochbeetchen.", weiter: "k4" },
      { text: "Stapel die Töpfe in die Höhe.", weiter: "k5" } ] },
    k3: { sagt: "Tomaten, Kapuzinerkresse und Kräuter für Tee. Und Max will unbedingt Erdbeeren.", antworten: [
      { text: "Die isst er vor der Ernte.", weiter: "k4" },
      { text: "Erdbeeren sind ein guter Plan.", weiter: "k5" } ] },
    k4: { sagt: "Das hab ich auch schon befürchtet. Vielleicht pflanze ich einfach doppelt so viele.", antworten: [
      { text: "Eine für ihn, eine für dich.", weiter: "k6" },
      { text: "Oder ein Schild „Nicht naschen“.", weiter: "k6" } ] },
    k5: { sagt: "Ja, in die Höhe! Ein grüner Turm. Micha baut mir vielleicht ein Gestell.", antworten: [
      { text: "Dann hält es hundert Jahre.", weiter: "k6" },
      { text: "Und hängt Chilis dran.", weiter: "k6" } ] },
    k6: { sagt: "Wenn es fertig ist, schicke ich dir ein Foto. Und im Sommer gibt’s die erste Tomate für dich.", antworten: [
      { text: "Ich freu mich drauf.", weiter: null },
      { text: "Ich male sie dir dann.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt Balkon vermessen. Mit Zollstock und Hoffnung." },

{ id: "greta-09", wer: "greta", thema: "Malen",
  knoten: {
    start: { sagt: "Max sagt, du malst so schön. Was malst du gerade?", antworten: [
      { text: "Bäume aus dem Forst.", weiter: "k2" },
      { text: "Das Hühnchen, schon wieder.", weiter: "k3" } ] },
    k2: { sagt: "Oh, wie schön. Kiefern oder Eichen? Ich hab ein Herz für Eichen.", antworten: [
      { text: "Kiefern, die halten still.", weiter: "k4" },
      { text: "Alles, was sich gerade färbt.", weiter: "k5" } ] },
    k3: { sagt: "Das Hühnchen! Steht es dir gern Modell?", antworten: [
      { text: "Es bewegt sich nie. Perfekt.", weiter: "k4" },
      { text: "Es will immer seine gute Seite.", weiter: "k4" } ] },
    k4: { sagt: "Ich male gerade Mandalas aus Blättern. Das beruhigt so schön, und am Ende fegt der Wind sie weg.", antworten: [
      { text: "Moderne Kunst mit Ablaufdatum.", weiter: "k6" },
      { text: "Mach vorher ein Foto.", weiter: "k6" } ] },
    k5: { sagt: "Der Herbst ist der beste Maler, finde ich. Wir dürfen nur abmalen.", antworten: [
      { text: "Und ich mische die Farben nach.", weiter: "k4" },
      { text: "Der Herbst hat mehr Farben als ich.", weiter: "k4" } ] },
    k6: { sagt: "Weißt du was? Wenn ich bei dir bin, malen wir zusammen. Du zeigst mir die Bäume, ich bringe die Blätter.", antworten: [
      { text: "Abgemacht. Ich koche den Tee.", weiter: null },
      { text: "Das Hühnchen macht die Jury.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita! Pinsel hoch!" },

{ id: "greta-10", wer: "greta", thema: "Krimi-Tipp",
  knoten: {
    start: { sagt: "Rita, ich brauche einen Krimi für die Zugfahrt. Max meint, du bist die Expertin.", antworten: [
      { text: "Wie viel Gänsehaut verträgst du?", weiter: "k2" },
      { text: "Wie lange fährt der Zug?", weiter: "k3" } ] },
    k2: { sagt: "Eher wenig. Ich lese manchmal mit einer Hand vor den Augen.", antworten: [
      { text: "Dann etwas mit Schnee und Tee.", weiter: "k4" },
      { text: "Die Hand ist der Lesetrick.", weiter: "k5" } ] },
    k3: { sagt: "Bis Leipzig ungefähr eine Stunde. Der Mörder muss sich also beeilen.", antworten: [
      { text: "Dann nimm einen mit kurzen Kapiteln.", weiter: "k4" },
      { text: "Gute Kommissare sind schnell.", weiter: "k5" } ] },
    k4: { sagt: "Schnee und Tee klingt sehr nach mir. Gibt’s da auch einen netten Kommissar?", antworten: [
      { text: "Einen grummeligen mit gutem Herzen.", weiter: "k6" },
      { text: "Nett ist er erst ab Seite hundert.", weiter: "k6" } ] },
    k5: { sagt: "Ich merk schon, du liest anders als ich. Du liest wie eine Ermittlerin.", antworten: [
      { text: "Ich errate den Täter meistens früh.", weiter: "k6" },
      { text: "Ich hab den Spürsinn im Blut.", weiter: "k6" } ] },
    k6: { sagt: "Dann verrat mir bitte nur nicht, wer es war. Ich will mich wenigstens ein bisschen gruseln.", antworten: [
      { text: "Ich schweige wie ein Grab.", weiter: null },
      { text: "Nur ein kleiner Tipp: der Gärtner.", weiter: null } ] }
  },
  schluss: "Danke, Rita! Ich such mir gleich einen aus." },

/* ==================== PAULI ==================== */

{ id: "pauli-01", wer: "pauli", thema: "Kochende Männer",
  knoten: {
    start: { sagt: "Rita, kurze Umfrage. Müssen Männer heute kochen können?", antworten: [
      { text: "Sie müssen nicht. Sie sollten.", weiter: "k2" },
      { text: "Kommt drauf an, wer fragt.", weiter: "k3" } ] },
    k2: { sagt: "Sehr gut formuliert. Ich notier das für meine Statistik.", antworten: [
      { text: "Wie viele hast du schon gefragt?", weiter: "k4" },
      { text: "Schreib dazu: mit Nachdruck.", weiter: "k4" } ] },
    k3: { sagt: "Ich frage. Und ich hab gestern Max’ Nudeln gegessen.", antworten: [
      { text: "Dann lautet die Antwort: ja.", weiter: "k5" },
      { text: "Waren sie wenigstens heiß?", weiter: "k5" } ] },
    k4: { sagt: "Drei. Du, meine Mitbewohnerin und der Typ vom Späti. Der hat nur gegrunzt.", antworten: [
      { text: "Grunzen zählt als Enthaltung.", weiter: "k6" },
      { text: "Repräsentativ ist das nicht.", weiter: "k6" } ] },
    k5: { sagt: "Lauwarm und mit Ketchup. Er nannte es „italienisch inspiriert“.", antworten: [
      { text: "Inspiriert ist ein dehnbarer Begriff.", weiter: "k6" },
      { text: "Italien wäre beleidigt.", weiter: "k6" } ] },
    k6: { sagt: "Ich halte fest: Rita ist für kochende Männer und gegen lauwarme Ausreden.", antworten: [
      { text: "Das kannst du so drucken.", weiter: null },
      { text: "Und für Frauen mit Meinung.", weiter: null } ] }
  },
  schluss: "Umfrage beendet. Danke, Rita, du warst die beste Stimme." },

{ id: "pauli-02", wer: "pauli", thema: "Tanzen früher",
  knoten: {
    start: { sagt: "Rita, sag mal ehrlich. Wurde früher besser getanzt als heute?", antworten: [
      { text: "Früher wurde mehr getanzt.", weiter: "k2" },
      { text: "Heute wird mehr gehüpft.", weiter: "k3" } ] },
    k2: { sagt: "Mehr? Ihr hattet doch gar kein Handy, das euch ablenkt.", antworten: [
      { text: "Eben. Wir hatten die Füße frei.", weiter: "k4" },
      { text: "Wir hatten Musik und Mut.", weiter: "k4" } ] },
    k3: { sagt: "Gehüpft! Das ist hart, aber fair. Ich hüpfe auf Konzerten wirklich nur.", antworten: [
      { text: "Hüpfen ist auch eine Kunst.", weiter: "k5" },
      { text: "Ich zeig dir mal einen Walzer.", weiter: "k5" } ] },
    k4: { sagt: "Klingt besser als jede Clubnacht in Halle. Hat dich jemand aufgefordert oder hast du aufgefordert?", antworten: [
      { text: "Ich hab nie lange gewartet.", weiter: "k6" },
      { text: "Wer zögert, hält die Handtasche.", weiter: "k6" } ] },
    k5: { sagt: "Walzer, ich? Ich würde dir auf die Füße treten, ganz emanzipiert.", antworten: [
      { text: "Meine Füße sind das gewohnt.", weiter: "k6" },
      { text: "Dann führst eben du.", weiter: "k6" } ] },
    k6: { sagt: "Rita, du bist cooler als die Hälfte meiner Freundinnen. Sag das bloß niemandem.", antworten: [
      { text: "Nur der Hälfte?", weiter: null },
      { text: "Das wusste ich schon.", weiter: null } ] }
  },
  schluss: "Ich hüpf dann mal weiter. Bis bald, Rita!" },

{ id: "pauli-03", wer: "pauli", thema: "Plakat-Spruch",
  knoten: {
    start: { sagt: "Ich bastle ein Plakat für den Frauentag. Mir fehlt nur noch der Spruch.", antworten: [
      { text: "Was soll er denn sagen?", weiter: "k2" },
      { text: "Kurz und frech, bitte.", weiter: "k3" } ] },
    k2: { sagt: "Irgendwas mit Stärke. Aber nicht so pathetisch, sonst lacht mich meine WG aus.", antworten: [
      { text: "„Frauen machen das schon.“", weiter: "k4" },
      { text: "„Einfach machen. Grüße, Rita.“", weiter: "k5" } ] },
    k3: { sagt: "Frech kann ich. Kurz ist mein Problem, ich schreibe immer Romane auf Pappe.", antworten: [
      { text: "Drei Wörter, nicht mehr.", weiter: "k4" },
      { text: "Größere Pappe, kleinere Buchstaben.", weiter: "k5" } ] },
    k4: { sagt: "Oh, das ist gut. Trocken, selbstbewusst, passt auf jede Pappe.", antworten: [
      { text: "Mit Ausrufezeichen, bitte.", weiter: "k6" },
      { text: "Und mal eine Blume dran.", weiter: "k6" } ] },
    k5: { sagt: "Ich hab’s laut vorgelesen, meine Mitbewohnerin hat applaudiert. Darf ich dich zitieren?", antworten: [
      { text: "Mit vollem Namen, bitte.", weiter: "k6" },
      { text: "Gegen eine kleine Gebühr.", weiter: "k6" } ] },
    k6: { sagt: "Ich schick dir ein Foto vom fertigen Plakat. Du bist jetzt offiziell meine Chefredakteurin.", antworten: [
      { text: "Ich nehme die Wahl an.", weiter: null },
      { text: "Gehalt in Kuchen, bitte.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt malen. Mit Edding und Haltung." },

{ id: "pauli-04", wer: "pauli", thema: "Halle gegen Berlin",
  knoten: {
    start: { sagt: "Ich hab eine steile These. Halle ist das neue Berlin.", antworten: [
      { text: "Das sagt ihr jedes Jahr.", weiter: "k2" },
      { text: "Wo ist dann euer Forst?", weiter: "k3" } ] },
    k2: { sagt: "Und jedes Jahr stimmt es ein bisschen mehr. Wir haben Kunst, Kneipen und keine Staus.", antworten: [
      { text: "Wir haben Wildschweine.", weiter: "k4" },
      { text: "Keine Staus? Dann ist es langweilig.", weiter: "k5" } ] },
    k3: { sagt: "Wir haben die Heide. Und die Saale. Das ist so ähnlich, nur mit mehr Ruderern.", antworten: [
      { text: "Ruderer sind keine Kiefern.", weiter: "k4" },
      { text: "Na gut, ein Punkt für Halle.", weiter: "k5" } ] },
    k4: { sagt: "Okay, Wildschweine sind ein starkes Argument. Die haben wir nur in der Kneipe.", antworten: [
      { text: "Das gilt nicht.", weiter: "k6" },
      { text: "Dann steht’s unentschieden.", weiter: "k6" } ] },
    k5: { sagt: "Langweilig? Rita, du klingst wie eine echte Berlinerin.", antworten: [
      { text: "Spandauerin. Das ist was anderes.", weiter: "k6" },
      { text: "Das nehme ich als Kompliment.", weiter: "k6" } ] },
    k6: { sagt: "Ich schlage vor: Du besuchst mich, und wir entscheiden vor Ort. Mit Kaffee und Stadtrundgang.", antworten: [
      { text: "Ich bringe meine Wanderschuhe.", weiter: null },
      { text: "Aber ich bleibe parteiisch.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita. Halle wartet. Ich auch." },

{ id: "pauli-05", wer: "pauli", thema: "Max zieht weg",
  knoten: {
    start: { sagt: "Max zieht nach Leipzig. Ich bin dann offiziell das einzige Geschwisterkind in Halle.", antworten: [
      { text: "Glückwunsch zur Alleinherrschaft.", weiter: "k2" },
      { text: "Wer bringt dir jetzt Nudeln?", weiter: "k3" } ] },
    k2: { sagt: "Danke. Ich plane schon meine erste Amtshandlung. Sein Lieblingscafé gehört jetzt mir.", antworten: [
      { text: "Das ist eine feindliche Übernahme.", weiter: "k4" },
      { text: "Sehr pragmatisch, Frau Präsidentin.", weiter: "k4" } ] },
    k3: { sagt: "Niemand, zum Glück. Ich koche jetzt selbst, also, ich bestelle selbst.", antworten: [
      { text: "Das ist auch eine Fähigkeit.", weiter: "k5" },
      { text: "Ich schick dir ein Rezept.", weiter: "k5" } ] },
    k4: { sagt: "Eine freundliche. Leipzig ist ja nur eine halbe Stunde weg, er darf jederzeit zu Besuch kommen.", antworten: [
      { text: "Und Greta bringt Kräutertee mit.", weiter: "k6" },
      { text: "Mit Kuchen als Eintrittskarte.", weiter: "k6" } ] },
    k5: { sagt: "Ein Rezept von dir? Das häng ich in die WG-Küche. Neben den Putzplan.", antworten: [
      { text: "Dann wird es auch benutzt.", weiter: "k6" },
      { text: "Da hängt es gut.", weiter: "k6" } ] },
    k6: { sagt: "Ehrlich gesagt freu ich mich für die zwei. Aber sag ihm das nicht, sonst wird er sentimental.", antworten: [
      { text: "Mein Mund ist versiegelt.", weiter: null },
      { text: "Ich sag nur „Pauli grüßt“.", weiter: null } ] }
  },
  schluss: "So, ich muss los. Das Café ruft. Mein Café." },

{ id: "pauli-06", wer: "pauli", thema: "Fahrradreparatur",
  knoten: {
    start: { sagt: "Ich hab heute mein Fahrrad selbst repariert. Ohne Video, ohne Typen, der mir’s erklärt.", antworten: [
      { text: "Bravo! Was war kaputt?", weiter: "k2" },
      { text: "Und, fährt es noch?", weiter: "k3" } ] },
    k2: { sagt: "Die Kette. Sie ist runtergesprungen, wie jeden Dienstag. Ich glaube, sie hat Freiheitsdrang.", antworten: [
      { text: "Das kenn ich, die Gute.", weiter: "k4" },
      { text: "Spann sie, dann bleibt sie da.", weiter: "k5" } ] },
    k3: { sagt: "Es fährt. Es quietscht jetzt nur ein bisschen, wie ein Protestlied.", antworten: [
      { text: "Ein Fahrrad mit Haltung.", weiter: "k4" },
      { text: "Ein Tropfen Öl, und es singt leiser.", weiter: "k5" } ] },
    k4: { sagt: "Genau. Ich nenn es jetzt Rosa. Nach der Farbe oder nach der Revolution, such dir was aus.", antworten: [
      { text: "Beides passt zu dir.", weiter: "k6" },
      { text: "Ein schöner Name für ein Rad.", weiter: "k6" } ] },
    k5: { sagt: "Du bist ja handwerklich unterwegs. Hast du immer alles selbst repariert?", antworten: [
      { text: "Was ich nicht kann, lerne ich.", weiter: "k6" },
      { text: "Selbst ist die Frau.", weiter: "k6" } ] },
    k6: { sagt: "Das schreib ich mir an die Wand. Du bist echt mein Vorbild für Selbermachen.", antworten: [
      { text: "Und du meins für Mut.", weiter: null },
      { text: "Jetzt fahr vorsichtig, Meisterin.", weiter: null } ] }
  },
  schluss: "Rosa und ich drehen eine Runde. Tschau, Rita!" },

{ id: "pauli-07", wer: "pauli", thema: "Hermine",
  knoten: {
    start: { sagt: "Max sagt, du liest Harry Potter, Band vier. Wer ist da eigentlich die Heldin?", antworten: [
      { text: "Hermine, ganz klar.", weiter: "k2" },
      { text: "Die Heldin? Nicht der Held?", weiter: "k3" } ] },
    k2: { sagt: "Wusste ich’s. Sie gründet da doch diesen Verein für die Hauselfen, oder?", antworten: [
      { text: "Und keiner will Mitglied werden.", weiter: "k4" },
      { text: "Sie strickt sogar Mützen für sie.", weiter: "k5" } ] },
    k3: { sagt: "Ich frag immer nach der Heldin. Alte Gewohnheit, wenn man feministisch erzogen wurde.", antworten: [
      { text: "Gute Erziehung, würde ich sagen.", weiter: "k2" },
      { text: "Dann ist es Hermine.", weiter: "k2" } ] },
    k4: { sagt: "Typisch. Erst wenn es zu spät ist, merken alle, dass sie recht hatte.", antworten: [
      { text: "Das kenne ich von mir.", weiter: "k6" },
      { text: "Hermine hat meistens recht.", weiter: "k6" } ] },
    k5: { sagt: "Mützen stricken für die Revolution. Das ist so liebenswert, dass es schon wieder radikal ist.", antworten: [
      { text: "Strick du doch auch mal.", weiter: "k6" },
      { text: "Mit Wolle die Welt verbessern.", weiter: "k6" } ] },
    k6: { sagt: "Okay, ich bin überzeugt. Ich leih mir Band vier, dann diskutieren wir.", antworten: [
      { text: "Aber nicht spoilern, ich bin mittendrin.", weiter: null },
      { text: "Gründen wir einen Lesekreis.", weiter: null } ] }
  },
  schluss: "Bis bald, Rita. Hermine wäre stolz auf uns." },

{ id: "pauli-08", wer: "pauli", thema: "Vorbilder",
  knoten: {
    start: { sagt: "Ich schreib gerade was über starke Frauen. Rita, wer ist dein Vorbild?", antworten: [
      { text: "Ehrlich? Ich selbst, an guten Tagen.", weiter: "k2" },
      { text: "Jede, die einfach anfängt.", weiter: "k3" } ] },
    k2: { sagt: "Ha! Das ist die selbstbewussteste Antwort, die ich bisher bekommen habe. Und an schlechten Tagen?", antworten: [
      { text: "Da trinke ich Tee und warte.", weiter: "k4" },
      { text: "Da gibt es keine schlechten.", weiter: "k5" } ] },
    k3: { sagt: "Einfach anfangen. Das klingt so leicht und ist so schwer.", antworten: [
      { text: "Darum fang ich immer morgens an.", weiter: "k4" },
      { text: "Mit einer Liste geht’s leichter.", weiter: "k5" } ] },
    k4: { sagt: "Ich nehme das als Zitat für meinen Text. Darf ich dich „Rita, Macherin“ nennen?", antworten: [
      { text: "Das darfst du.", weiter: "k6" },
      { text: "Mit Ausrufezeichen dahinter.", weiter: "k6" } ] },
    k5: { sagt: "Du bist wirklich die Coolste. Max hatte recht, und das sag ich nicht oft.", antworten: [
      { text: "Schreib das bitte auch auf.", weiter: "k4" },
      { text: "Max hat öfter recht, als er denkt.", weiter: "k4" } ] },
    k6: { sagt: "Mein Text wird so gut. Ich schick ihn dir, du darfst als Erste lesen.", antworten: [
      { text: "Ich lese mit Rotstift.", weiter: null },
      { text: "Ich freu mich drauf.", weiter: null } ] }
  },
  schluss: "Danke, Rita, Macherin! Bis bald." },

{ id: "pauli-09", wer: "pauli", thema: "Kaffee oder Tee",
  knoten: {
    start: { sagt: "Wichtige Grundsatzfrage. Kaffee oder Tee?", antworten: [
      { text: "Tee. Darüber verhandle ich nicht.", weiter: "k2" },
      { text: "Morgens Tee, nachmittags auch Tee.", weiter: "k3" } ] },
    k2: { sagt: "Respekt. Ich trinke Hafermilch-Kaffee, viermal am Tag. Meine Mitbewohnerin nennt mich die Kaffeemaschine.", antworten: [
      { text: "Viermal? Du vibrierst ja.", weiter: "k4" },
      { text: "Hafermilch? Was ist das denn?", weiter: "k5" } ] },
    k3: { sagt: "Konsequent. Ich bewundere das. Ich bin eher eine Wechselwählerin der Getränke.", antworten: [
      { text: "Probier mal Tee mit Zucker.", weiter: "k4" },
      { text: "Wechseln ist auch eine Haltung.", weiter: "k4" } ] },
    k4: { sagt: "Ich wage mal einen Versuch. Was empfiehlst du einer Anfängerin?", antworten: [
      { text: "Schwarzen Tee, kräftig gezogen.", weiter: "k6" },
      { text: "Greta hat sicher eine Mischung.", weiter: "k6" } ] },
    k5: { sagt: "Hafer, Wasser, ein bisschen Ehrgeiz. Schmeckt wie Milch, die sich Mühe gibt.", antworten: [
      { text: "Dann lieber Tee pur.", weiter: "k4" },
      { text: "Ich bleibe bei meiner Kuh.", weiter: "k4" } ] },
    k6: { sagt: "Abgemacht. Ich trinke morgen eine Tasse Tee und schreib dir, wie es war.", antworten: [
      { text: "Ein Kaffee wird sich nicht wehren.", weiter: null },
      { text: "Ich erwarte einen Bericht.", weiter: null } ] }
  },
  schluss: "Ich koch jetzt Wasser. Für Tee. Wahrscheinlich." },

{ id: "pauli-10", wer: "pauli", thema: "WG-Putzplan",
  knoten: {
    start: { sagt: "Rita, ich brauch dich als Beraterin. Unsere WG hat einen Putzplan, aber keiner hält sich dran.", antworten: [
      { text: "Wie sieht der Plan aus?", weiter: "k2" },
      { text: "Wer hält sich nicht dran?", weiter: "k3" } ] },
    k2: { sagt: "Ein Zettel am Kühlschrank. Mit kleinen Smileys, die keiner abhakt.", antworten: [
      { text: "Smileys sind zu freundlich.", weiter: "k4" },
      { text: "Ohne Haken wird nicht geputzt.", weiter: "k5" } ] },
    k3: { sagt: "Alle. Ich auch, wenn ich ehrlich bin. Aber ich fühl mich wenigstens schlecht dabei.", antworten: [
      { text: "Das ist schon mal ein Anfang.", weiter: "k4" },
      { text: "Schlechtes Gewissen putzt nicht.", weiter: "k5" } ] },
    k4: { sagt: "Was würdest du machen? Du bist ja die Königin der Listen.", antworten: [
      { text: "Wer nicht putzt, kocht.", weiter: "k6" },
      { text: "Ein Kuchen für den Ordentlichsten.", weiter: "k6" } ] },
    k5: { sagt: "Uff. Das ist so wahr, dass ich es aufschreiben muss.", antworten: [
      { text: "Auf den Putzplan, bitte.", weiter: "k4" },
      { text: "Und gleich danach abhaken.", weiter: "k4" } ] },
    k6: { sagt: "Das ist genial. Ich führe das heute Abend ein und sag, es ist eine alte Spandauer Tradition.", antworten: [
      { text: "Ab heute ist es eine.", weiter: null },
      { text: "Viel Erfolg, Putzministerin.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt revolutionieren. Erst den Plan, dann das Bad." },

/* ==================== MICHA ==================== */

{ id: "micha-01", wer: "micha", thema: "Chili-Ernte",
  knoten: {
    start: { sagt: "Rita. Micha hier. Die Chilis sind reif.", antworten: [
      { text: "Wie scharf sind sie dieses Jahr?", weiter: "k2" },
      { text: "Wie viele sind es denn?", weiter: "k3" } ] },
    k2: { sagt: "Eine hab ich probiert. Ich hab jetzt fünf Minuten Ruhe gehabt, ganz ohne Ton.", antworten: [
      { text: "Das war bestimmt schön für Jane.", weiter: "k4" },
      { text: "Hast du wenigstens Milch getrunken?", weiter: "k5" } ] },
    k3: { sagt: "Dreiundvierzig. Ich hab zweimal gezählt, beim zweiten Mal mit Handschuhen.", antworten: [
      { text: "Sehr gründlich.", weiter: "k4" },
      { text: "Und beim ersten Mal?", weiter: "k5" } ] },
    k4: { sagt: "Eine Sorte hab ich nach dir benannt.", antworten: [
      { text: "Nach mir? Warum das denn?", weiter: "k6" },
      { text: "Hoffentlich die schönste.", weiter: "k6" } ] },
    k5: { sagt: "Die Finger brennen noch. Ich trag die Erfahrung mit Würde.", antworten: [
      { text: "Und mit Handschuhen, beim nächsten Mal.", weiter: "k4" },
      { text: "Ein echter Chili-Held.", weiter: "k4" } ] },
    k6: { sagt: "Klein, rot, und wer sie unterschätzt, hat verloren.", antworten: [
      { text: "Das nehme ich als Kompliment.", weiter: null },
      { text: "Ich verlange ein Glas davon.", weiter: null } ] }
  },
  schluss: "Ich bring dir welche mit. Mit Warnschild." },

{ id: "micha-02", wer: "micha", thema: "Der Akkuschrauber",
  knoten: {
    start: { sagt: "Ich hab einen neuen Akkuschrauber. Jane sagt, das ist mein dritter.", antworten: [
      { text: "Und was sagst du?", weiter: "k2" },
      { text: "Was kann der neue?", weiter: "k3" } ] },
    k2: { sagt: "Ich sag, der erste war für Holz, der zweite für Metall.", antworten: [
      { text: "Und der dritte?", weiter: "k4" },
      { text: "Klingt vernünftig. Fast.", weiter: "k4" } ] },
    k3: { sagt: "Er hat ein Licht vorne. Und er macht ein sehr zufriedenes Geräusch.", antworten: [
      { text: "So wie du beim Mittagessen.", weiter: "k5" },
      { text: "Ein Licht? Wie modern.", weiter: "k4" } ] },
    k4: { sagt: "Der dritte ist für die Stimmung.", antworten: [
      { text: "Und, hebt er sie?", weiter: "k6" },
      { text: "Jane überzeugt das bestimmt.", weiter: "k6" } ] },
    k5: { sagt: "Das hat Jane auch gesagt. Sie meint, wir klingen gleich.", antworten: [
      { text: "Ihr passt eben zusammen.", weiter: "k4" },
      { text: "Wer ist lauter?", weiter: "k4" } ] },
    k6: { sagt: "Meine schon. Ihre muss ich noch reparieren.", antworten: [
      { text: "Mit Blumen geht’s ohne Akku.", weiter: null },
      { text: "Bring ihr einen Kuchen mit.", weiter: null } ] }
  },
  schluss: "Ich muss los. Er lädt gerade. Ich auch." },

{ id: "micha-03", wer: "micha", thema: "Das Regal",
  knoten: {
    start: { sagt: "Jane sagt, dein Regal ist schief.", antworten: [
      { text: "Das ist nicht schief. Das ist Stil.", weiter: "k2" },
      { text: "Woher weiß sie das?", weiter: "k3" } ] },
    k2: { sagt: "Stil. Verstehe. Wie viel Grad Stil?", antworten: [
      { text: "So viel, dass Bücher rutschen.", weiter: "k4" },
      { text: "Nur ein bisschen, ganz elegant.", weiter: "k5" } ] },
    k3: { sagt: "Sie hat gesagt, die Tassen stehen da so, als würden sie sich festhalten.", antworten: [
      { text: "Meine Tassen sind sportlich.", weiter: "k4" },
      { text: "Na gut, ein kleines bisschen.", weiter: "k5" } ] },
    k4: { sagt: "Ich komm Samstag mit der Wasserwaage.", antworten: [
      { text: "Bring auch Kuchenhunger mit.", weiter: "k6" },
      { text: "Nur, wenn du nichts verrätst.", weiter: "k6" } ] },
    k5: { sagt: "Elegant schief. Ich schreib das auf, für meine Werkstatt.", antworten: [
      { text: "Das darfst du gern übernehmen.", weiter: "k4" },
      { text: "Gegen eine kleine Gebühr.", weiter: "k4" } ] },
    k6: { sagt: "Abgemacht. Ich richte das Regal, du richtest den Kaffee.", antworten: [
      { text: "Ich mach Tee, mein Lieber.", weiter: null },
      { text: "Und der Kaffee steht gerade.", weiter: null } ] }
  },
  schluss: "Bis Samstag. Halt durch, Regal." },

{ id: "micha-04", wer: "micha", thema: "Sonntagsbraten",
  knoten: {
    start: { sagt: "Rita. Kurze Frage. Wie lange darf man vom Braten naschen, bevor es auffällt?", antworten: [
      { text: "Genau ein Stück.", weiter: "k2" },
      { text: "Hast du schon genascht?", weiter: "k3" } ] },
    k2: { sagt: "Ein Stück. Und wenn das Stück sehr groß ist?", antworten: [
      { text: "Dann sind es zwei Stück.", weiter: "k4" },
      { text: "Dann merkt Jane es sofort.", weiter: "k5" } ] },
    k3: { sagt: "Das ist eine sehr direkte Frage. Ich würde sagen: theoretisch.", antworten: [
      { text: "Theoretisch fehlt eine Ecke?", weiter: "k4" },
      { text: "Ich hör dich kauen, Micha.", weiter: "k5" } ] },
    k4: { sagt: "Die Ecke war sowieso nicht schön. Ich hab den Braten optisch verbessert.", antworten: [
      { text: "Sehr selbstlos von dir.", weiter: "k6" },
      { text: "Du bist ein Künstler.", weiter: "k6" } ] },
    k5: { sagt: "Sie steht gerade hinter mir.", antworten: [
      { text: "Dann sag schön Hallo.", weiter: "k6" },
      { text: "Viel Glück, mein Lieber.", weiter: "k6" } ] },
    k6: { sagt: "Jane sagt, du sollst mich nicht noch ermutigen. Ich sage, du bist meine Anwältin.", antworten: [
      { text: "Ich plädiere auf Hunger.", weiter: null },
      { text: "Ich lege das Mandat nieder.", weiter: null } ] }
  },
  schluss: "Ich muss los. Ich hab Küchenverbot. Mal wieder." },

{ id: "micha-05", wer: "micha", thema: "Fahrt zum Hofladen",
  knoten: {
    start: { sagt: "Samstag fahr ich raus zum Hofladen. Soll ich dir was mitbringen?", antworten: [
      { text: "Eier und Kartoffeln, bitte.", weiter: "k2" },
      { text: "Das Übliche. Du weißt schon.", weiter: "k3" } ] },
    k2: { sagt: "Eier und Kartoffeln. Mehr nicht?", antworten: [
      { text: "Und vielleicht ein … Vögelchen.", weiter: "k3" },
      { text: "Na gut, noch Äpfel.", weiter: "k4" } ] },
    k3: { sagt: "Ah. Das Gelbe. Sag nichts, ich verstehe.", antworten: [
      { text: "Psst. Das Hühnchen hört mit.", weiter: "k4" },
      { text: "Gut eingepackt, bitte.", weiter: "k5" } ] },
    k4: { sagt: "Ich wickel alles in Zeitung. Da guckt keiner rein.", antworten: [
      { text: "Du bist ein Profi.", weiter: "k6" },
      { text: "Nimm den Sportteil, der ist dick.", weiter: "k6" } ] },
    k5: { sagt: "Doppelt in Zeitung. Und ich trag die Tüte so, als wär’s nur Gemüse.", antworten: [
      { text: "Pfeif dabei unauffällig.", weiter: "k6" },
      { text: "Perfekte Tarnung.", weiter: "k6" } ] },
    k6: { sagt: "Ich hab schon Schlimmeres geschmuggelt. Janes Geburtstagstorte, zum Beispiel. An ihr vorbei.", antworten: [
      { text: "Dann schaffst du auch das.", weiter: null },
      { text: "Ich bin beeindruckt.", weiter: null } ] }
  },
  schluss: "Bis Samstag. Unauffällig wie immer." },

{ id: "micha-06", wer: "micha", thema: "Erster Frost",
  knoten: {
    start: { sagt: "Es soll Frost geben. Ich hol die Chilis rein.", antworten: [
      { text: "Alle auf einmal?", weiter: "k2" },
      { text: "Wohin denn damit?", weiter: "k3" } ] },
    k2: { sagt: "Alle siebzehn Töpfe. Jane hat bei Nummer zwölf aufgehört zu zählen.", antworten: [
      { text: "Aus Liebe oder Protest?", weiter: "k4" },
      { text: "Wo stehen die alle?", weiter: "k3" } ] },
    k3: { sagt: "Fensterbank, Flur, Badezimmer. Einer steht auf dem Klavier.", antworten: [
      { text: "Spielt er auch?", weiter: "k5" },
      { text: "Und wo wohnt ihr jetzt?", weiter: "k4" } ] },
    k4: { sagt: "Jane sagt, wir wohnen jetzt in einem Gewächshaus mit Sofa.", antworten: [
      { text: "Das klingt doch gemütlich.", weiter: "k6" },
      { text: "Hauptsache, das Sofa bleibt frei.", weiter: "k6" } ] },
    k5: { sagt: "Nein. Aber er hört zu, wenn Jane spielt. Er wird jedes Mal ein bisschen röter.", antworten: [
      { text: "Das ist Musikalität.", weiter: "k6" },
      { text: "Er wird rot vor Rührung.", weiter: "k6" } ] },
    k6: { sagt: "Ich sag immer: Wer im Winter Chilis hat, braucht keine Heizung. Jane sagt, das stimmt nicht.", antworten: [
      { text: "Jane hat meistens recht.", weiter: null },
      { text: "Probier’s aus, aber mit Pullover.", weiter: null } ] }
  },
  schluss: "Ich muss los. Der Flur braucht noch einen Topf." },

{ id: "micha-07", wer: "micha", thema: "Umzugshilfe",
  knoten: {
    start: { sagt: "Max zieht um. Ich trage.", antworten: [
      { text: "Und was macht Max?", weiter: "k2" },
      { text: "Wie viele Kisten sind es?", weiter: "k3" } ] },
    k2: { sagt: "Max trägt die Verantwortung. Die ist leichter.", antworten: [
      { text: "Typisch Max.", weiter: "k4" },
      { text: "Und Greta?", weiter: "k5" } ] },
    k3: { sagt: "Vierunddreißig. Auf allen steht „Zeug“.", antworten: [
      { text: "Greta hat da noch nachgebessert.", weiter: "k5" },
      { text: "Das ist ja sehr übersichtlich.", weiter: "k4" } ] },
    k4: { sagt: "Ich hab ihm die Bohrmaschine geschenkt. Zum Einzug. Die alte, die gute.", antworten: [
      { text: "Ein großer Moment.", weiter: "k6" },
      { text: "Kann er damit umgehen?", weiter: "k6" } ] },
    k5: { sagt: "Greta trägt die Pflanzen. Und redet mit ihnen, damit sie keine Angst haben.", antworten: [
      { text: "Das ist sehr lieb.", weiter: "k4" },
      { text: "Redest du mit den Kisten?", weiter: "k4" } ] },
    k6: { sagt: "Er hat sie angeguckt wie ein Kind den Weihnachtsbaum. Ich hab ihm noch Dübel dazugelegt.", antworten: [
      { text: "Du bist ein guter Papa.", weiter: null },
      { text: "Dübel sind wahre Liebe.", weiter: null } ] }
  },
  schluss: "Ich geh jetzt Kisten heben. Mit den Knien, sagt Jane." },

{ id: "micha-08", wer: "micha", thema: "Krimiabend",
  knoten: {
    start: { sagt: "Jane und ich gucken heute Abend Krimi. Hast du einen Tipp, wer der Täter ist?", antworten: [
      { text: "Welcher Krimi denn?", weiter: "k2" },
      { text: "Immer der Freundliche.", weiter: "k3" } ] },
    k2: { sagt: "Irgendwas mit Schnee und einem Kommissar, der nie lacht.", antworten: [
      { text: "Dann ist es der Nachbar.", weiter: "k3" },
      { text: "Schläfst du wieder nach zehn Minuten?", weiter: "k4" } ] },
    k3: { sagt: "Der Freundliche. Gut. Dann ist es hier im Haus also Jane.", antworten: [
      { text: "Das sag ich ihr.", weiter: "k5" },
      { text: "Oder der, der nascht.", weiter: "k5" } ] },
    k4: { sagt: "Zwölf. Ich hab mich verbessert.", antworten: [
      { text: "Und wie erfährst du den Täter?", weiter: "k6" },
      { text: "Bald schaffst du die Hälfte.", weiter: "k6" } ] },
    k5: { sagt: "Ich nehm alles zurück. Ich will heute noch Abendbrot.", antworten: [
      { text: "Kluge Entscheidung.", weiter: "k4" },
      { text: "Feigling.", weiter: "k4" } ] },
    k6: { sagt: "Jane erzählt mir das Ende am nächsten Morgen. Mit Kaffee. Bester Teil.", antworten: [
      { text: "Das ist ja fast romantisch.", weiter: null },
      { text: "Dann viel Spaß beim Schlafen.", weiter: null } ] }
  },
  schluss: "Der Vorspann läuft. Ich bin schon müde." },

{ id: "micha-09", wer: "micha", thema: "Zahnstocher-Turm",
  knoten: {
    start: { sagt: "Ich hab einen neuen Rekord. Zahnstocher-Turm, einunddreißig Stockwerke.", antworten: [
      { text: "Wie hast du das geschafft?", weiter: "k2" },
      { text: "Und die Rouladen?", weiter: "k3" } ] },
    k2: { sagt: "Ruhige Hand. Und Jane war einkaufen.", antworten: [
      { text: "Also ohne Aufsicht.", weiter: "k4" },
      { text: "Steht er noch?", weiter: "k5" } ] },
    k3: { sagt: "Die Rouladen müssen jetzt mit Bindfaden auskommen. Ein Opfer für die Kunst.", antworten: [
      { text: "Jane wird begeistert sein.", weiter: "k4" },
      { text: "Kunst geht vor.", weiter: "k5" } ] },
    k4: { sagt: "Sie hat ihn schon gesehen. Sie hat nur „Micha“ gesagt. In diesem Ton.", antworten: [
      { text: "Ich kenne diesen Ton.", weiter: "k6" },
      { text: "Das ist fast ein Lob.", weiter: "k6" } ] },
    k5: { sagt: "Er steht. Er wackelt nur, wenn jemand atmet.", antworten: [
      { text: "Dann atme ich ganz leise.", weiter: "k4" },
      { text: "Mach schnell ein Foto.", weiter: "k4" } ] },
    k6: { sagt: "Ich bau dir zum Geburtstag einen. Mit Fahrstuhl.", antworten: [
      { text: "Mit Treppe reicht mir auch.", weiter: null },
      { text: "Ich bring die Rouladen mit.", weiter: null } ] }
  },
  schluss: "Ich muss los. Der Turm braucht Gesellschaft." },

{ id: "micha-10", wer: "micha", thema: "Das letzte Stück Kuchen",
  knoten: {
    start: { sagt: "Rita, ich brauch eine Schiedsrichterin. Es geht um Kuchen.", antworten: [
      { text: "Ich bin ganz Ohr.", weiter: "k2" },
      { text: "Wer hat ihn gebacken?", weiter: "k3" } ] },
    k2: { sagt: "Das letzte Stück Pflaumenkuchen. Jane sagt, das ist für dich.", antworten: [
      { text: "Jane hat völlig recht.", weiter: "k4" },
      { text: "Und was sagst du?", weiter: "k5" } ] },
    k3: { sagt: "Jane. Und sie hat das letzte Stück schon für dich eingepackt.", antworten: [
      { text: "Dann ist die Sache klar.", weiter: "k4" },
      { text: "Sehr umsichtig, die Gute.", weiter: "k4" } ] },
    k4: { sagt: "Ich wollte es nur sagen. Ich hab Alufolie drumgemacht. Ganz ohne zu naschen.", antworten: [
      { text: "Ich zähle die Pflaumen nach.", weiter: "k6" },
      { text: "Du bist ein Gentleman.", weiter: "k6" } ] },
    k5: { sagt: "Ich sag nichts. Ich guck nur traurig.", antworten: [
      { text: "Das Gucken kenne ich.", weiter: "k4" },
      { text: "Das zieht bei mir nicht.", weiter: "k4" } ] },
    k6: { sagt: "Bei Kuchen bin ich bei ihr nur auf Platz zwei. Hinter dir. Ich hab mich daran gewöhnt.", antworten: [
      { text: "Platz zwei ist auch Silber.", weiter: null },
      { text: "Beim Werkzeug bist du Erster.", weiter: null } ] }
  },
  schluss: "Der Kuchen kommt Sonntag. Unversehrt, wahrscheinlich." }

];
