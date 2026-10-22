/* Spaß-Telefon mit Dani (Daniel, Ritas Sohn in Schweden). Gleiches Schema wie D.anrufe.
   Zusätze (telefon.js versteht sie):
   - wer: "linus" an einem Knoten → Linus (Ritas Enkel) ist kurz selbst am Telefon
   - lacht: true an einem Knoten → die Figur lacht herzhaft bei diesem Satz (Max und Dani), schlussLacht: true beim Schlusssatz
   Grundton: herzlich, Alltag in Schweden, ein paar schwedische Brocken. Keine Vorwürfe, keine Entfernung als Problem, nichts Ernstes. */
D.anrufeDani = [

{ id: "dani-01", wer: "dani", thema: "Schnee",
  knoten: {
    start: { sagt: "Hej Mama! Hier hat’s heute Nacht geschneit. Vierzig Zentimeter. Ich hab das Auto erst beim zweiten Versuch gefunden.", antworten: [
      { text: "Wo war’s denn beim ersten?", weiter: "k2" },
      { text: "Vierzig? Bei uns nieselt’s nur.", weiter: "k3" } ] },
    k2: { sagt: "Beim ersten hab ich das Auto vom Nachbarn freigeschaufelt. Der hat sich sehr gefreut.", lacht: true, antworten: [
      { text: "Gute Tat ist gute Tat.", weiter: "k4" },
      { text: "Und deins?", weiter: "k4" } ] },
    k3: { sagt: "Nieseln, das kenn ich noch. Hier sagen sie ja: Es gibt kein schlechtes Wetter …", antworten: [
      { text: "… bara dåliga kläder.", weiter: "k5" },
      { text: "… nur die falsche Jacke.", weiter: "k4" } ] },
    k4: { sagt: "Das Auto steht jetzt jedenfalls frei und dampft. Die Kinder haben auf der Motorhaube einen Schneemann gebaut, mit Möhre und allem.", antworten: [
      { text: "Fährst du so los?", weiter: "k6" },
      { text: "Mach ein Foto!", weiter: "k6" } ] },
    k5: { sagt: "Genau! Mama, dein Schwedisch ist besser als meins am Montagmorgen.", lacht: true, antworten: [
      { text: "Tack, tack.", weiter: "k4" },
      { text: "Ich übe ja auch fleißig.", weiter: "k4" } ] },
    k6: { sagt: "Der Schneemann fährt mit bis zum Bäcker. Dann gibt’s Zimtschnecken. Für alle, auch für ihn.", antworten: [
      { text: "Grüß ihn von mir.", weiter: null },
      { text: "Ich will auch eine!", weiter: null } ] }
  },
  schluss: "Mach ich. Hej då, Mama!" },

{ id: "dani-02", wer: "dani", thema: "Zimtschnecken-Tag",
  knoten: {
    start: { sagt: "Hej Mama! Wusstest du, dass es in Schweden einen eigenen Tag für Zimtschnecken gibt? Am vierten Oktober.", antworten: [
      { text: "Kanelbullens dag. Weiß ich doch.", weiter: "k2" },
      { text: "Einen ganzen Tag nur für Gebäck?", weiter: "k3" } ] },
    k2: { sagt: "Natürlich weißt du das. Du weißt mehr über Schweden als die Hälfte meiner Kollegen.", antworten: [
      { text: "Ich lese eben die richtigen Krimis.", weiter: "k4" },
      { text: "Und, habt ihr gebacken?", weiter: "k5" } ] },
    k3: { sagt: "Ja! Und alle machen mit. Im Büro stand heute früh ein ganzes Blech. Um zehn war’s leer.", antworten: [
      { text: "Um zehn schon?", weiter: "k5" },
      { text: "Das nenn ich Fika.", weiter: "k5" } ] },
    k4: { sagt: "Stimmt, die Kommissare trinken da auch ständig Kaffee. Ich glaub, ohne Fika wird hier kein Fall gelöst.", lacht: true, antworten: [
      { text: "Und habt ihr gebacken?", weiter: "k5" },
      { text: "Ohne Kaffee keine Spur.", weiter: "k5" } ] },
    k5: { sagt: "Wir haben’s versucht. Die Kinder haben mehr Hagelzucker gestreut, als wir Teig hatten. Mareike sagt, es sind Zimtschnecken-Nester. Oh, warte, hier will jemand ans Telefon.", antworten: [
      { text: "Her mit ihm!", weiter: "k6" },
      { text: "Wer denn?", weiter: "k6" } ] },
    k6: { sagt: "Hej Oma! Ich war das mit dem meisten Zucker. Wie geht’s dir?", wer: "linus", antworten: [
      { text: "Mir geht’s gut, Linus! Und dir?", weiter: "k7" },
      { text: "Bra, tack! Und du bist der Bäcker?", weiter: "k7" } ] },
    k7: { sagt: "Gut! Meine Geschwister sagen Hej. Und Mama auch. Ich geb dich Papa zurück!", wer: "linus", antworten: [
      { text: "Grüß alle ganz lieb!", weiter: null },
      { text: "Hej då, Linus!", weiter: null } ] }
  },
  schluss: "Und weg ist er. Zur letzten Zimtschnecke, schätze ich. Kram, Mama!", schlussLacht: true },

{ id: "dani-03", wer: "dani", thema: "Der Elch",
  knoten: {
    start: { sagt: "Mama, ich hab heute früh einen Elch gesehen. Er stand am Straßenrand und hat geguckt.", antworten: [
      { text: "Und du? Hast du zurückgeguckt?", weiter: "k2" },
      { text: "Ein echter? Nicht der aus Holz?", weiter: "k3" } ] },
    k2: { sagt: "Klar. Wir haben uns bestimmt eine Minute angestarrt. Dann hat er entschieden, dass ich langweilig bin.", lacht: true, antworten: [
      { text: "Elche haben eben Ansprüche.", weiter: "k4" },
      { text: "Hast du ein Foto?", weiter: "k5" } ] },
    k3: { sagt: "Ein echter! Der aus Holz steht bei uns im Flur. Der guckt nicht so kritisch.", lacht: true, antworten: [
      { text: "Hast du ein Foto?", weiter: "k5" },
      { text: "Wo wollte er denn hin?", weiter: "k4" } ] },
    k4: { sagt: "Zum Apfelbaum vom Nachbarn, glaub ich. Der Nachbar sagt, der kommt jeden Herbst.", antworten: [
      { text: "Ein Stammgast.", weiter: "k6" },
      { text: "Und der Nachbar lässt ihn?", weiter: "k6" } ] },
    k5: { sagt: "Ich hab das Handy rausgeholt, und genau da hat er sich umgedreht. Ich hab jetzt ein sehr scharfes Foto von einem Elch-Hinterteil.", lacht: true, antworten: [
      { text: "Schick’s mir trotzdem.", weiter: "k4" },
      { text: "Das ist doch auch ein Elch.", weiter: "k4" } ] },
    k6: { sagt: "Die Kinder sagen, er heißt Bosse. Keine Ahnung, woher sie das wissen. Er kriegt jetzt das Fallobst.", antworten: [
      { text: "Hälsa till Bosse!", weiter: null },
      { text: "Bosse passt.", weiter: null } ] }
  },
  schluss: "Richte ich ihm aus, wenn er morgen wieder vorbeischaut. Hej då!" },

{ id: "dani-04", wer: "dani", thema: "Fredagsmys",
  knoten: {
    start: { sagt: "Hej Mama! Freitag, das heißt hier: fredagsmys. Alle aufs Sofa, Tacos, Chips, ein Film.", antworten: [
      { text: "Tacos? Ich dachte, Köttbullar.", weiter: "k2" },
      { text: "Fredagsmys mach ich heute auch.", weiter: "k3" } ] },
    k2: { sagt: "Nee, freitags sind Tacos. Das ist hier fast ein Gesetz. Köttbullar gibt’s, wenn man jemanden beeindrucken will.", antworten: [
      { text: "Und wer sucht den Film aus?", weiter: "k4" },
      { text: "Ein Taco-Gesetz. Typisch Schweden.", weiter: "k4" } ] },
    k3: { sagt: "Sehr gut! Decke, Chips, einer von deinen Krimis. Dann machen wir quasi zusammen fredagsmys.", antworten: [
      { text: "Genau so.", weiter: "k4" },
      { text: "Und was guckt ihr?", weiter: "k4" } ] },
    k4: { sagt: "Das wird jeden Freitag abgestimmt. Heute hat wieder der Film mit dem Hund gewonnen. Zum vierten Mal.", lacht: true, antworten: [
      { text: "Der Hund ist eben gut.", weiter: "k5" },
      { text: "Ihr seid eine Demokratie.", weiter: "k5" } ] },
    k5: { sagt: "Mareike und ich sind überstimmt. Aber wir schlafen eh meistens nach zwanzig Minuten ein.", antworten: [
      { text: "Das ist doch der beste Teil.", weiter: null },
      { text: "Mysigt.", weiter: null } ] }
  },
  schluss: "Eben. Ich hol jetzt die Chips, bevor sie alle sind. Ha det bra, Mama!" },

{ id: "dani-05", wer: "dani", thema: "Linus will Schwedisch hören",
  knoten: {
    start: { sagt: "Mama, Linus hat gefragt, wieso du Schwedisch kannst. Ich hab gesagt, du bist eben schlau.", antworten: [
      { text: "Und ich lese viele Krimis.", weiter: "k2" },
      { text: "Ich übe jeden Tag ein bisschen.", weiter: "k2" } ] },
    k2: { sagt: "Er will’s mit eigenen Ohren hören. Warte, ich geb ihn dir.", antworten: [
      { text: "Gern!", weiter: "k3" },
      { text: "Oh, jetzt bin ich aufgeregt.", weiter: "k3" } ] },
    k3: { sagt: "Hej Oma! Sag mal was auf Schwedisch!", wer: "linus", antworten: [
      { text: "Hej Linus, hur mår du?", weiter: "k4" },
      { text: "Jag gillar kanelbullar.", weiter: "k5" } ] },
    k4: { sagt: "Bra! Du klingst wie unsere Lehrerin. Und wie geht’s dir, Oma?", wer: "linus", antworten: [
      { text: "Mir geht’s richtig gut.", weiter: "k6" },
      { text: "Bra, tack!", weiter: "k6" } ] },
    k5: { sagt: "Ich auch! Am liebsten die großen. Wie geht’s dir, Oma?", wer: "linus", antworten: [
      { text: "Mir geht’s richtig gut.", weiter: "k6" },
      { text: "Bra, tack!", weiter: "k6" } ] },
    k6: { sagt: "Alle sagen Hej! Meine Geschwister und Mama auch. Tschüss, Oma!", wer: "linus", antworten: [
      { text: "Hej då, Linus!", weiter: "k7" },
      { text: "Grüß alle zurück!", weiter: "k7" } ] },
    k7: { sagt: "Er hat gesagt, du klingst wie die Lehrerin. Von ihm ist das ein Riesenkompliment.", lacht: true, antworten: [
      { text: "Dann bin ich jetzt Lehrerin.", weiter: null },
      { text: "Tack så mycket!", weiter: null } ] }
  },
  schluss: "Fröken Rita. Klingt gut. Hej då, Mama!" },

{ id: "dani-06", wer: "dani", thema: "Eisbaden",
  knoten: {
    start: { sagt: "Mama, ich hab’s getan. Ich war eisbaden. Mit den Kollegen, nach der Sauna.", antworten: [
      { text: "Freiwillig?", weiter: "k2" },
      { text: "Wie lange warst du drin?", weiter: "k3" } ] },
    k2: { sagt: "Halb freiwillig. Die haben gesagt, das macht hier jeder. Hinterher hab ich gemerkt: Macht nicht jeder.", lacht: true, antworten: [
      { text: "Wie lange warst du drin?", weiter: "k3" },
      { text: "Reingelegt!", weiter: "k3" } ] },
    k3: { sagt: "Zehn Sekunden. Kam mir vor wie eine Stunde. Ich hab Geräusche gemacht, die ich von mir nicht kannte.", antworten: [
      { text: "Und danach?", weiter: "k4" },
      { text: "Hätte ich gern gehört.", weiter: "k4" } ] },
    k4: { sagt: "Danach fühlt man sich wie neu, ehrlich. Wie nach zwei Kaffee auf einmal.", antworten: [
      { text: "Ich bleib bei Tee.", weiter: "k5" },
      { text: "Ich nehm lieber die Badewanne.", weiter: "k5" } ] },
    k5: { sagt: "Sehr vernünftig. Mareike will nächstes Mal mit. Ich glaub, sie will nur mein Gesicht sehen.", lacht: true, antworten: [
      { text: "Da hat sie recht.", weiter: null },
      { text: "Mach ein Foto davon!", weiter: null } ] }
  },
  schluss: "Sie steht am Ufer, mit Thermoskanne und Handy. Hej då, Mama!" },

{ id: "dani-07", wer: "dani", thema: "Lucia",
  knoten: {
    start: { sagt: "Hej Mama! Bei uns wird schon für Lucia geübt. Seit drei Tagen singt das ganze Haus „Sankta Lucia“.", antworten: [
      { text: "Wer ist die Lucia?", weiter: "k2" },
      { text: "Singst du mit?", weiter: "k3" } ] },
    k2: { sagt: "Das wird noch verhandelt. Linus ist Sternenknabe. Er hat einen spitzen Hut und setzt ihn nicht mehr ab, auch nicht beim Essen.", lacht: true, antworten: [
      { text: "Der Hut gehört dazu.", weiter: "k4" },
      { text: "Stjärngosse! Wie schön.", weiter: "k4" } ] },
    k3: { sagt: "Ich brumm mit. Mareike hat mir dann die Kerzen in die Hand gedrückt, damit ich beschäftigt bin.", lacht: true, antworten: [
      { text: "Kluge Frau.", weiter: "k4" },
      { text: "Brummen ist auch Singen.", weiter: "k4" } ] },
    k4: { sagt: "Du kannst den Text bestimmt besser als ich.", antworten: [
      { text: "Natten går tunga fjät …", weiter: "k5" },
      { text: "Nur die erste Strophe.", weiter: "k5" } ] },
    k5: { sagt: "Siehst du! Ich sing immer nur „Sankta Luuucia“ und warte, bis die anderen wieder einsetzen.", antworten: [
      { text: "Das reicht völlig.", weiter: null },
      { text: "So machen das alle.", weiter: null } ] }
  },
  schluss: "Dann üb ich weiter. Leise. Hej då, Mama!" },

{ id: "dani-08", wer: "dani", thema: "Pfifferlinge",
  knoten: {
    start: { sagt: "Mama, wir waren am Wochenende im Wald, Pfifferlinge suchen. Die Kinder haben einen ganzen Korb voll gefunden.", antworten: [
      { text: "Einen ganzen Korb? Wo denn?", weiter: "k2" },
      { text: "Und du?", weiter: "k3" } ] },
    k2: { sagt: "Das ist unser smultronställe. Das verrät man hier nicht mal der eigenen Mutter.", lacht: true, antworten: [
      { text: "Smultronställe! Kenn ich.", weiter: "k4" },
      { text: "Na hör mal!", weiter: "k4" } ] },
    k3: { sagt: "Ich hab drei gefunden. Zwei davon waren Blätter.", lacht: true, antworten: [
      { text: "Einer ist besser als keiner.", weiter: "k4" },
      { text: "Die Kinder haben die besseren Augen.", weiter: "k4" } ] },
    k4: { sagt: "Mareike hat sie in Butter gebraten, auf Toast. Die Kinder haben die Pilze runtergepickt und nur den Toast gegessen. Warte, Linus will dir was erzählen.", antworten: [
      { text: "Gib ihn mir!", weiter: "k5" },
      { text: "Na klar!", weiter: "k5" } ] },
    k5: { sagt: "Hej Oma! Ich hab die meisten gefunden! Wie geht’s dir?", wer: "linus", antworten: [
      { text: "Gut! Du bist ja ein Pilzprofi.", weiter: "k6" },
      { text: "Bra, tack! Und dir?", weiter: "k6" } ] },
    k6: { sagt: "Gut! Alle grüßen dich, auch Mama. Ich muss jetzt Zähne putzen. Hej då!", wer: "linus", antworten: [
      { text: "Hej då, Linus!", weiter: null },
      { text: "Grüß alle zurück!", weiter: null } ] }
  },
  schluss: "Und ich guck mal, ob er wirklich putzt. Kram, Mama!" }
];
if (Array.isArray(D.anrufe)) D.anrufe.push(...D.anrufeDani.filter(a => !D.anrufe.some(x => x.id === a.id)));

/* Max lacht herzhaft an seinen eigenen Pointen. Nur Markierungen – die Texte in data-anrufe.js bleiben unberührt.
   Fehlt ein Gespräch oder Knoten (weil es überarbeitet wurde), passiert einfach nichts. */
D.anrufLacht = {
  "max-02": ["k2"], "max-03": ["k2"], "max-04": ["k5"], "max-07": ["k4"], "max-10": ["k4"],
  "max-14": ["k2", "k4"], "max-15": ["k3"], "max-16": ["k4"], "max-17": ["k4"], "max-18": ["k3"]
};
[D.anrufe, D.anrufe2].forEach(L => (L || []).forEach(a => (D.anrufLacht[a.id] || []).forEach(k => { if (k === "schluss") a.schlussLacht = true; else if (a.knoten && a.knoten[k]) a.knoten[k].lacht = true; })));

/* Zwei kleine Ereignisse mit Dani (Format wie D.ereignisse2; lacht: true an einer Antwort = Dani lacht dabei) */
if (Array.isArray(D.ereignisse2)) D.ereignisse2.push(
  { id: "e2-dani-fika", wer: "dani", wann: { von: 14, bis: 17 }, zeilen: ["Hej Mama! Ich hab gerade Fika im Büro.", "Kaffee, Zimtschnecke, und ich dachte: Mama trinkt jetzt bestimmt auch Kaffee."],
    antworten: [{ text: "Erwischt!", sagt: "Wusst ich’s doch. Skål, mit Kaffee!", effekt: "herzen", lacht: true }, { text: "Heute Tee.", sagt: "Auch gut. Hauptsache, wir machen gleichzeitig Pause." }] },
  { id: "e2-dani-norrsken", wer: "dani", wann: { monate: [10, 11, 12, 1, 2, 3] }, zeilen: ["Hej Mama! Gestern Abend war hier der Himmel grün. Polarlicht!", "Die Kinder standen im Schlafanzug draußen und haben gejubelt."],
    antworten: [{ text: "Norrsken! Wie schön.", sagt: "Ich schick dir ein Foto. Ist bisschen verwackelt, ich hab mitgejubelt.", effekt: "herzen", lacht: true }, { text: "Im Schlafanzug?", sagt: "Mit Mütze! Wir sind ja nicht verrückt." }] }
);
