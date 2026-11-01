/* Lichtung – Korrekturen nach der Fachprüfung (Psychoonkologie/Geriatrie)
   Wird nach allen Datendateien geladen und passt Inhalte gezielt an. */
(() => {
  const setze = (arr, id, f) => { const x = arr.find(y => y.id === id); if (x) Object.assign(x, f); };

  /* ---------- Wissen: kein Lebenszeit-Bezug, keine Klinik, kurze Titel ---------- */
  const W = D.wissen;
  setze(W, "W01", { text: "Die WHO sagt vor allem: Jede Bewegung zählt, auch kleine Portionen, und jede Unterbrechung langen Sitzens hilft. Wie viel zu dir passt, weißt du selbst am besten." });
  setze(W, "W03", { text: "Gegen bleierne Müdigkeit halfen in einer Auswertung von über 100 Studien Bewegung und gute Gespräche oft mehr als Medikamente allein." });
  setze(W, "W04", { text: "In einer großen Auswertung war mehr tägliches Gehen gesünder, aber nur bis zu einem Punkt: Bei über 60-Jährigen flachte der Nutzen bei etwa 6.000–8.000 Schritten ab. Darunter zählt jeder Schritt, darüber muss niemand Rekorde jagen." });
  { const w5 = W.find(x => x.id === "W05"); if (w5) w5.text = "Gleichgewichts- und Alltagsübungen machen sicherer auf den Beinen – das zeigt eine Cochrane-Übersicht mit über 100 Studien. Die Übungen, die du schon kennst, zählen genau dafür."; }
  setze(W, "W10", { text: "Schon der Blick ins Grüne tut gut: In Studien erholten sich Menschen mit Blick auf Bäume schneller als mit Blick auf eine Mauer. Der Fensterplatz zählt." });
  setze(W, "W18", { text: "Wer regelmäßig liest, bleibt in Studien geistig wacher. Ob das Lesen die Ursache ist, weiß man nicht – aber ein Kapitel am Tag ist ein schöner Grund." });
  setze(W, "W21", { text: "Eine Auswertung von 148 Studien zeigt: Menschen, die gut eingebunden sind, geht es körperlich und seelisch besser. Ein Anruf, ein Tee im Haus, eine Tanzstunde – das ist keine Kleinigkeit." });
  setze(W, "W23", { text: "Wer sich für andere einsetzt – etwa einem Nachbarn Tanzen beibringt –, fühlt sich in Studien zufriedener und gebrauchter. Geben tut auch dem gut, der gibt." });
  setze(W, "W24", { text: "In einer englischen Langzeitstudie fühlten sich Menschen, die ab und zu ins Museum, Konzert oder Theater gingen, wohler und verbundener." });
  setze(W, "W32", { text: (W.find(x => x.id === "W32")?.text || "").replace(/Das „Statt Daddeln“-Menü[^.]*\./, "Der Knopf „Ablenkung?“ ist deshalb auch ein Schmerz-Werkzeug.") });
  { const w = W.find(x => x.id === "W33"); if (w) w.text = w.text.replace(/Daddeln ist also kein Verbrechen\.[^]*$/, "Daddeln ist also in Ordnung. Wenn es irgendwann nicht mehr guttut, ist das ein guter Moment für etwas anderes."); }
  setze(W, "W34", { text: "Musik zu hören senkt in vielen Studien die Anspannung – gerade dann, wenn man sonst nervös wäre." });
  { const w = W.find(x => x.id === "W40"); if (w) w.text = w.text.replace(/\s*In einer älteren Studie[^.]*\./, ""); }
  const TITEL = { W01: "Jede Bewegung zählt", W02: "Bewegung und Stimmung", W03: "Bewegung gegen Erschöpfung", W04: "Gehen: genug ist genug", W05: "Gleichgewicht trainieren", W06: "Bewegung nach Tagesform", W07: "Zwei Stunden Natur pro Woche", W08: "Waldbaden", W09: "Was der Wald bewirkt", W10: "Der Blick ins Grüne", W11: "Vögel hören tut gut", W12: "Staunspaziergänge", W13: "Tanzen und Gedächtnis", W14: "Neue Tanzfolgen lernen", W15: "Tanzen bei Vergesslichkeit", W16: "Kunst, Tanz und Gesundheit", W17: "Die 68-%-Lese-Legende", W18: "Lesen hält wach", W19: "Lesen und Gedächtnis", W20: "Hören zählt wie Lesen", W21: "Eingebunden sein", W22: "Verbundenheit", W23: "Geben tut gut", W24: "Kultur ist kein Luxus", W25: "Kleine Begegnungen zählen", W26: "Bewegung und Schlaf", W27: "Wenn der Schlaf nicht kommt", W28: "Gut geschlafen ist halb gewonnen", W29: "Abends lieber Papier", W30: "Warum Ablenkung wirkt", W31: "Selbst ausgesuchte Musik", W32: "Ablenkung, die einnimmt", W33: "Handyspiele, ehrlich betrachtet", W34: "Musik entspannt", W35: "Musik tut gut", W36: "Lieder aus der Jugend", W37: "Dankesbriefe", W38: "Dankbarkeit – ehrlich", W39: "Neugier und Lernen", W40: "Etwas Neues lernen" };
  W.forEach(w => { if (TITEL[w.id]) w.titel = TITEL[w.id]; w.text = w.text.replace(/\s*\((vgl\.|siehe) [A-Z]+\d+[^)]*\)/g, ""); });

  /* Statt Daddeln, Vorhaben, Monate, Zitate und Tageshinweise: Korrekturen sind in die späteren Fassungen
     (data-lektorat.js, data-ablenkung.js) eingegangen; die alten Listen werden nicht mehr mitgeliefert. */

  /* ---------- Erzählfragen (statt „Lebensbuch“) ---------- */
  D.lebensbuch.forEach(l => { l.frage = l.frage.replace(/\s*\*?\((Chochinov|nach Chochinov)[^)]*\)\*?/gi, "").replace(/\s*\*\s*$/, "").trim(); });
  setze(D.lebensbuch, "L21", { frage: "Was würdest du gern einmal mit deinem Patenkind zusammen ausprobieren?" });
  setze(D.lebensbuch, "L22", { frage: "Welches Ritual macht dir das Jahr schön – und wann ist es wieder so weit?" });
  setze(D.lebensbuch, "L29", { frage: "Worauf freust du dich in den nächsten Wochen?" });

  /* ---------- Bücher ---------- */
  D.buecher = D.buecher.filter(b => !/Sommerbuch/.test(b.titel)).map(b => {
    if (/Kerkeling/.test(b.autor)) b.text = "Kerkeling pilgert zu Fuß nach Santiago – ehrlich und sehr komisch. Das Hörbuch liest er selbst.";
    b.text = b.text.replace(/\s*Ausgaben in.*$/,"").replace(/⚠️|bitte prüfen|nicht einzeln bestätigt/g, "");
    return b;
  });
  D.buecher.push({ titel: "Als ich ein kleiner Junge war", autor: "Erich Kästner", text: "Kästner erzählt von seiner Dresdner Kindheit – warm, witzig und in kurzen Kapiteln." });

  /* ---------- Orte ---------- */
  const O = D.ausflugsziele;
  O.forEach(z => {
    z.anreise = z.anreise.split(/;\s*/).filter(a => !/E-Roller|E-Scooter/i.test(a)).join("; ");
    for (const k of ["text", "anreise", "baenke", "ruhig", "saison", "kosten", "gehen"]) if (typeof z[k] === "string")
      z[k] = z[k].replace(/\s*\(\s*(Termin jährlich prüfen|Adressen prüfen|prüfen)\s*\)/gi, " (vorher nachsehen)").replace(/unbekannt – prüfen und in der App selbst eintragen lassen/g, "unbekannt").replace(/⚠️/g, "").replace(/infektarm/g, "ruhig und luftig").replace(/\s{2,}/g, " ").trim();
  });
  { const z = O.find(x => x.id === "lasszinssee"); if (z) z.leiter = 4; }
  O.forEach(z => { if (["teufelsbruch", "kuhlake-uferweg"].includes(z.id)) z.leiter = 4; });
  { const z = O.find(x => x.id === "hausgarten-wohnanlage"); if (z) z.text = "Zehn Minuten draußen auf einer Bank sitzen, mit Tee oder Buch. Zählt jedes Mal als kleiner Ausflug – so oft du willst."; }
  { const z = O.find(x => /freudstr/.test(x.id)); if (z) z.text = z.text.replace(/Ein guter Ort, um Tanzpartner[^.]*\./, "Ein guter Ort für Gespräche bei Kaffee und Musik zum Zuhören."); }
  { const z = O.find(x => x.id === "seniorenklub-hakenfelde"); if (z) z.text = z.text.replace(/genau das Richtige für eine Tanzlehrerin[^.]*/, "Live-Musik zum Zuhören – und vielleicht ein Übungsabend für deinen Tanzschüler"); }
  { const z = O.find(x => x.id === "wochenmarkt-spandau"); if (z) z.text += " Am besten mit Einkaufstrolley oder leichter Tasche."; }
  D.angebote.forEach(a => { if (/Flinke Füße/.test(a.name)) a.text += " Zuschauen und Musik hören zählt genauso."; if (/Fitness/.test(a.name)) a.text += " Vorher mit der Physiotherapie klären, welche Teile passen."; });
  D.runden = D.runden.map(r => {
    if (/Kuhlake/.test(r.name)) return { ...r, km: "frei wählbar – schön: bis zur Kreuztränke und zurück, etwa 3 km", text: "Am Bach entlang, Buchen und Eichen, mit etwas Glück ein Eisvogel. Rastplatz an der Kreuztränke. Umkehren geht jederzeit." };
    if (/Spandauer-Forst-Runde/.test(r.name)) return { ...r, name: "Wildgehege bis Laßzinssee", km: "etwa 6 km hin und zurück", text: "Für gute Tage – oder in zwei Hälften an zwei Tagen." };
    return r;
  });

  /* ---------- Laden-Inhalte ---------- */
  /* Tanzkarten: seit dem Laden-Lektorat Geschichten und Musik statt Grundschritte (data-laden.js) */
  D.briefe.forEach(b => { b.anfang = b.anfang.replace("Ich wollte dir schon lange einmal sagen, wie gut es mir tut, dass es dich gibt.", "Ich musste heute an dich denken und habe mich gefreut, dass es dich gibt.").replace("– das vergesse ich dir nicht.", "– daran denke ich heute noch gern."); });
})();
