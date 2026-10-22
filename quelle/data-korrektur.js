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

  /* ---------- Statt Daddeln ---------- */
  const SD = D.stattDaddeln;
  setze(SD, "SD28", { titel: "Deine Physio-Übung im Sitzen", text: "Eine Übung aus deinem Physio-Blatt, die im Sitzen geht. Mehr braucht es heute nicht.", t: "ruecken" });
  setze(SD, "SD30", { titel: "Deine Gleichgewichtsübung", text: "Mach die Gleichgewichtsübung, die dir deine Physiotherapie gezeigt hat, mit beiden Händen in Griffnähe. Hast du keine, frag beim nächsten Termin danach.", tf: "AB" });
  setze(SD, "SD41", { titel: "Ein Weg, den ich liebe", text: "Erinnere dich an einen Lieblingsweg – zu Fuß oder mit dem Auto – und erzähl ihn jemandem.", tf: "AB" });
  setze(SD, "SD38", { tf: "ABC", text: "Beantworte eine der Erzählfragen – schriftlich, als Sprachaufnahme oder nur im Kopf." });
  ["SD06", "SD15", "SD16", "SD22", "SD24", "SD37", "SD40", "SD41", "SD42", "SD44", "SD45", "SD46", "SD48", "SD52", "SD53", "SD58"].forEach(id => { const x = SD.find(y => y.id === id); if (x) x.tf = x.tf.replace("D", "") || "ABC"; });
  SD.forEach(x => { x.text = x.text.replace(/\s*\((vgl\.|siehe|Teil) [^)]*\)/g, "").replace(/aus Teil 3/g, "aus dem Wissen").replace(/Emil, /g, "Kästner, ").replace(/; morgen kommen zwei dazu\./, "; wenn du magst, morgen zwei weitere."); });
  SD.push({ id: "SD61", titel: "Einfach liegen bleiben", text: "Decke, Wärmflasche, Augen zu. Das ist heute genug.", min: 0, tf: "CD", kat: "Körper sanft", haltung: "im Liegen", t: "ruhe" });

  /* ---------- Vorhaben ---------- */
  const M = D.missionen;
  const kuerzel = s => s.replace(/\s*\((SD|W|Z|M)\d+[^)]*\)/g, "").replace(/\s*Begründung: W\d+\.?/g, "").replace(/\bNur G\/M\b\.?/g, "Für gute Tage und Tage, an denen es geht.").replace(/\bG\/M\b\.?/g, "An guten Tagen und wenn es geht.")
    .replace(/einen G-Tag/g, "einen guten Tag").replace(/am G-Tag/g, "an einem guten Tag").replace(/G-Tag/g, "guter Tag").replace(/an S-Tagen/g, "an leisen Tagen").replace(/S-Tagen/g, "leisen Tagen")
    .replace(/Ideal für S\/P-Phasen\./g, "Gut für leise Tage.").replace(/Ziel:/g, "Zum Beispiel:").replace(/\s{2,}/g, " ").trim();
  M.forEach(m => { m.text = kuerzel(m.text).replace(/Wegen der Immunsuppression/g, "Zur Sicherheit").replace(/Wegen Knochen und Stoma:?/g, "Zur Sicherheit:"); m.wennDann = kuerzel(m.wennDann); });
  SD.forEach(x => { x.text = x.text.replace(/\(?(SD|W|Z|M)\d+\)?/g, "").replace(/\s{2,}/g, " ").replace(/\s+([.,;])/g, "$1"); });
  setze(M, "M04", { text: "Schritte lassen sich im Sitzen planen. Beim Vorführen reicht es, zu zählen und zu erklären; Drehungen übt der Schüler mit seiner Tanzpartnerin. Vorschlag: Langsamer Walzer, Grundschritt.", wennDann: "Wenn mein Schüler zur Stunde klingelt, dann zeige ich zuerst die neue Figur und danach die alte." });
  setze(M, "M07", { text: "An leisen Tagen: auslassen. Das Vorhaben wartet.", tf: "ABC" });
  setze(M, "M11", { text: "Geht auch im Liegen. Vorschlag: Mörike, „Er ist’s“, oder Eichendorff, „Wünschelrute“." });
  setze(M, "M13", { text: "Tag 1: mit dem Behandlungsteam klären, ob das für dich passt. Danach nur an guten Tagen, nur in Begleitung, mit Helm.", tf: "A", t: "eroller" });
  setze(M, "M14", { text: "Für alle Tagesformen. Es gibt keine Strafe und keine Zählung.", wennDann: "Wenn ich die Spiele-App öffnen will, dann öffne ich zuerst „Ablenkung?“ und schaue eine Idee an; danach spiele ich, wenn ich mag." });
  setze(M, "M17", { text: "Für einen guten Tag: einen Randplatz und ein Taxi einplanen." });
  setze(M, "M18", { text: "Nur mit Übungen, die dir die Physiotherapie gezeigt hat. Hände immer in Griffnähe.", wennDann: "Wenn der Wasserkocher läuft, dann mache ich am Tresen meine Gleichgewichtsübung von der Physio.", tf: "AB" });
  setze(M, "M20", { text: "An guten Tagen und wenn es geht. An leisen Tagen geht es auch am Fenster.", tf: "ABC" });
  setze(M, "M28", { text: "Die ersten Tage dienen der Planung (geht auch an leisen Tagen), der Ausflug selbst an einem guten Tag. Für mehr Sicherheit bei längeren Ausflügen." });
  setze(M, "M29", { text: "Pausentage sind normal; die Strecke wartet. An leisen Tagen zählt jeder kleine Weg." });
  setze(M, "M30", { text: "Die Gastgeberin legt die Musik auf und gibt den Takt an, gern im Sitzen. Und vielleicht tanzt dein Schüler zum ersten Mal vor Publikum." });

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

  /* ---------- Monate & Zitate ---------- */
  D.monate.forEach(m => m.impulse.forEach(i => { i.text = i.text.replace(/Verabschiede die Mauersegler/g, "Hör den Mauerseglern noch zu, bevor sie nach Afrika ziehen").replace(/dann sind sie auf dem Weg nach Afrika\./g, "dann sind sie schon unterwegs.").replace(/beim Abschied zu/g, "beim Aufbruch zu"); }));
  D.zitate = D.zitate.filter(z => !/Nietzsche|Luxemburg|Lichtenberg|Claudius/.test(z.autor));

  /* ---------- Orte ---------- */
  const O = D.ausflugsziele;
  O.forEach(z => {
    z.anreise = z.anreise.split(/;\s*/).filter(a => !/E-Roller|E-Scooter/i.test(a)).join("; ");
    for (const k of ["text", "anreise", "wc", "baenke", "ruhig", "saison", "kosten", "gehen"]) if (typeof z[k] === "string")
      z[k] = z[k].replace(/\s*\(\s*(Termin jährlich prüfen|Adressen prüfen|prüfen)\s*\)/gi, " (vorher nachsehen)").replace(/unbekannt – prüfen und in der App selbst eintragen lassen/g, "unbekannt").replace(/⚠️/g, "").replace(/infektarm/g, "ruhig und luftig").replace(/ab Waldkrankenhaus/g, "ab der Haltestelle in der Nähe").replace(/Haltestelle Waldkrankenhaus/g, "Haltestelle in der Nähe").replace(/\s{2,}/g, " ").trim();
  });
  { const z = O.find(x => /waldkrankenhaus/i.test(x.id)); if (z) Object.assign(z, { name: "Waldrand-Runde vor der Tür", text: "Ein kurzer, immer gleicher Weg am Waldrand in den südlichen Spandauer Forst. Deine feste kleine Runde, die immer geht.", wc: "unterwegs keine – vorher zu Hause", anreise: "zu Fuß" }); }
  O.forEach(z => { if (/krankenhaus/i.test(z.wc)) z.wc = z.wc.replace(/[^.;]*krankenhaus[^.;]*/gi, "").trim() || "vorher zu Hause"; });
  { const z = O.find(x => x.id === "lasszinssee"); if (z) { z.leiter = 4; z.text += " Unterwegs keine Toilette – vorher bei Heidis Landgasthaus."; } }
  O.forEach(z => { if (["teufelsbruch", "kuhlake-uferweg"].includes(z.id)) z.leiter = 4; });
  { const z = O.find(x => x.id === "hausgarten-wohnanlage"); if (z) z.text = "Zehn Minuten draußen auf einer Bank sitzen, mit Tee oder Buch. Zählt jedes Mal als kleiner Ausflug – so oft du willst."; }
  { const z = O.find(x => /freudstr/.test(x.id)); if (z) z.text = z.text.replace(/Ein guter Ort, um Tanzpartner[^.]*\./, "Ein guter Ort für Gespräche bei Kaffee und Musik zum Zuhören."); }
  { const z = O.find(x => x.id === "seniorenklub-hakenfelde"); if (z) z.text = z.text.replace(/genau das Richtige für eine Tanzlehrerin[^.]*/, "Live-Musik zum Zuhören – und vielleicht ein Übungsabend für deinen Tanzschüler"); }
  { const z = O.find(x => x.id === "wochenmarkt-spandau"); if (z) z.text += " Am besten mit Einkaufstrolley oder leichter Tasche."; }
  D.angebote.forEach(a => { if (/Flinke Füße/.test(a.name)) a.text += " Zuschauen und Musik hören zählt genauso."; if (/Fitness/.test(a.name)) a.text += " Vorher mit der Physiotherapie klären, welche Teile passen."; });
  D.runden = D.runden.map(r => {
    if (/Kuhlake/.test(r.name)) return { ...r, km: "frei wählbar – schön: bis zur Kreuztränke und zurück, etwa 3 km", text: "Am Bach entlang, Buchen und Eichen, mit etwas Glück ein Eisvogel. Rastplatz an der Kreuztränke. Umkehren geht jederzeit." };
    if (/Spandauer-Forst-Runde/.test(r.name)) return { ...r, name: "Wildgehege bis Laßzinssee", km: "etwa 6 km hin und zurück", text: "Für gute Tage – oder in zwei Hälften an zwei Tagen. Unterwegs keine Toilette, vorher bei Heidis Landgasthaus." };
    return r;
  });
  { const p = D.praktisch.find(x => x.titel === "Bus"); if (p) p.text = p.text.replace("Ab Waldkrankenhaus", "Ab der Haltestelle in der Nähe"); }

  /* ---------- Laden-Inhalte ---------- */
  D.tanzkarten = D.tanzkarten.filter(k => !/Wiener/.test(k.tanz));
  D.tanzkarten.forEach(k => k.tipp += " Zum Zeigen reicht oft das Zählen und Erklären.");
  D.briefe.forEach(b => { b.anfang = b.anfang.replace("Ich wollte dir schon lange einmal sagen, wie gut es mir tut, dass es dich gibt.", "Ich musste heute an dich denken und habe mich gefreut, dass es dich gibt.").replace("– das vergesse ich dir nicht.", "– daran denke ich heute noch gern."); });

  /* ---------- Tageshinweise: Jahreszeit beachten ---------- */
  const SAISON = [[/färben sich die Eichen|Kraniche/, [9, 10, 11]], [/Im November/, [11]], [/Im Winter|Spuren im Schnee/, [12, 1, 2]], [/ab Ende Dezember/, [12, 1]], [/Im März/, [3]], [/Im Mai/, [5]], [/Im Juni/, [6]], [/Im September/, [9]], [/Moos im Forst ist im Herbst/, [10, 11]]];
  D.tageshinweise = D.tageshinweise.filter(t => !/nicht mit Fleiß/.test(t)).map(t => {
    if (/Heute schon etwas getrunken/.test(t)) t = "Ein Glas Wasser in Reichweite ist eine kleine Pflege.";
    const s = SAISON.find(([r]) => r.test(t)); return s ? { text: t, monate: s[1] } : { text: t };
  });
})();
