/* Feinschliff: Tanzen kleiner – nur noch als eine Sache unter vielen, und immer drinnen. */
(() => {
  const ohneTanzPlan = x => x.t !== "tanzplanen" && x.id !== "SD124";
  if (D.stattDaddeln) D.stattDaddeln = D.stattDaddeln.filter(ohneTanzPlan).map(x => x.id === "SD24" ? { ...x, text: x.text.replace(" oder dem Tanzschüler", " oder der Nachbarin") } : x);
  if (D.missionen) D.missionen = D.missionen.filter(m => m.id !== "M04" && m.id !== "M30" && m.t !== "tanzplanen");
  if (D.wissen) { D.wissen = D.wissen.filter(w => !["W03", "W06", "W14", "W15", "W19"].includes(w.id));
    D.wissen.forEach(w => { if (w.text) w.text = w.text.replace(/ ?[–(,]? ?etwa einem Nachbarn Tanzen beibringt ?[–),]?/g, "").replace(/einem Nachbarn Tanz[a-zäöü ]*beibringen/g, "anderen helfen"); }); }
  (D.monate || []).forEach(m => (m.impulse || []).forEach(i => { if (i.drinnen) i.drinnen = i.drinnen.replace(" und eine Figur für die Tanzstunde „stehlen“", ""); }));
  if (D.timerVorlagen) D.timerVorlagen = D.timerVorlagen.filter(v => v.id !== "tanzplanen");
  (D.gruppen || []).forEach(g => { g.ids = g.ids.filter(i => i !== "tanzplanen"); if (g.ids.includes("tanzstunde")) g.ids = g.ids.filter(i => i !== "tanzstunde").concat("tanzstunde"); });
  if (D.orte?.tanz) Object.assign(D.orte.tanz, { name: "Musik im Haus", text: "Musik und Tanzstunden finden drinnen statt. Man sieht es trotzdem: Mit der Zeit hängt eine Lichterkette an deinem Balkon." });
  if (D.huehnchenOrt) D.huehnchenOrt.tanz = "Hühnchen sitzt heute unterm Balkon und wippt mit.";
  (D.stufen || D.meilensteine || []).forEach(s => { if (s.el === "schnur") Object.assign(s, { name: "Die Lichterkette", text: "An deinem Balkon hängt eine Lichterkette. Drinnen läuft Musik." }); if (s.el === "pavillon") s.text = "Zwischen den Häusern steht ein kleiner Pavillon. Darunter ist Platz für Gäste."; });
})();

/* Harry-Potter-Vorhaben: immer der Band, bei dem Rita gerade ist */
(() => {
  const m = (D.missionen || []).find(x => x.id === "M31"); if (!m) return;
  const band = () => { try { return (D.hp?.baende || []).find(b => b.nr === S.hp.band); } catch (e) { return null; } };
  Object.defineProperty(m, "titel", { get() { const b = band(); return b ? `Harry Potter, Band ${b.nr}` : "Harry Potter, der nächste Band"; } });
  Object.defineProperty(m, "text", { get() { const b = band(); return b ? `Du bist bei Band ${b.nr}, „${b.titel.replace("Harry Potter und d", "D")}“: Kapitel für Kapitel, ${b.kapitel} insgesamt. Ein Kapitel pro Abend reicht.` : "Kapitel für Kapitel durch den nächsten Band."; } });
})();

/* Angebots-IDs stabil aus dem Namen */
function angebotId(name) { return [...String(name)].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261).toString(36); }

/* Spotify-Idee (Max' Duo-Angebot) */
(() => { if (!D.stattDaddeln || D.stattDaddeln.some(x => x.id === "SD600")) return;
  D.stattDaddeln.push({ id: "SD600", titel: "Spotify mit Max teilen", text: "Max hat Spotify und könnte dich für 8 Euro im Monat in sein Duo-Abo nehmen: Musik und Podcasts ohne Ende, und in Ritas App öffnet sich jeder Hörtipp mit einem Tipp.", min: 10, tf: "ABC", kat: "Handy", haltung: "im Sitzen", t: "gelernt",
    schritte: ["Max anrufen oder schreiben: „Ich will in dein Duo!“", "Spotify aus dem Play Store laden.", "Den Einladungslink von Max antippen und ein Konto anlegen.", "In Ritas App unter Einstellungen → Musik und Podcasts „Ich habe Spotify“ einschalten."],
    links: [{ text: "Spotify im Play Store", url: "https://play.google.com/store/apps/details?id=com.spotify.music" }] }); })();

/* Hofladen: Hühnchen ahnt nichts. Oder doch? */
if (D.huehnchenReaktionen) D.huehnchenReaktionen.hofladen = [
  "Hofladen? Was gab’s denn? … Nein, warte. Sag’s mir lieber nicht.",
  "Du riechst nach Bauernhof. Ich stell keine Fragen.",
  "Eier, Gemüse, Kuchen – ich hoffe, es waren Eier, Gemüse und Kuchen.",
  "Schön, dass du draußen warst! Ich hab hier nur ganz kurz das Kochbuch zugeklappt.",
  "Hofladen. Ich hab gehört, die haben da sehr nette … Möhren."
];

/* QR-Code-Jagd kennt Rita längst – raus */
if (D.stattDaddeln) D.stattDaddeln = D.stattDaddeln.filter(x => x.id !== "SD228");
/* Fragen „von früher“ fürs Papier-Tagebuch */
D.tbFrueher = [
  "Welche Reise aus deiner Kindheit hast du noch genau vor Augen?",
  "Wer hat dich als Kind getröstet – und wie?",
  "Welches Lied haben die Erwachsenen gesungen, als du klein warst?",
  "Was gab es sonntags zu essen, als du ein Kind warst?",
  "Wie sah dein Schulweg aus? Was lag am Wegrand?",
  "Welcher Erwachsene hat dich als Kind ernst genommen?",
  "Was war dein erster eigener Besitz, auf den du stolz warst?",
  "Wie habt ihr als Kinder Weihnachten gefeiert?",
  "Welche Regel von früher findest du heute noch richtig – und welche nicht?",
  "Welcher Satz deiner Eltern klingt dir heute noch im Ohr?",
  "Wo warst du als Kind am liebsten allein?",
  "Was hast du dich als Mädchen getraut, was sich andere nicht getraut haben?",
  "Welche Nachricht aus den Erwachsenengesprächen hast du als Kind aufgeschnappt?",
  "Welches Kleidungsstück aus deiner Kindheit siehst du noch genau vor dir?",
  "Was würdest du der zehnjährigen Rita heute gern sagen?"
];

/* Erfundene Erinnerungen vermeiden */
if (D.ereignisse2) D.ereignisse2 = D.ereignisse2.filter(e => !["e2-max-klausur", "e2-max-bingo"].includes(e.id));

/* Weitere Spaß-Telefonate (Greta, Pauli, Micha) */
if (Array.isArray(D.anrufe2)) D.anrufe = [...(D.anrufe || []), ...D.anrufe2.filter(a => !(D.anrufe || []).some(x => x.id === a.id))];
