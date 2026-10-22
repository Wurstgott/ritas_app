/* ============================================================
   Für Hühnchen (Synthese aus „Mitbringsel“ und „Naschdose“, 22.10.)
   Rita bringt Hühnchen etwas mit. Hühnchen ist aus Ton und tut nur so, als würde es naschen –
   danach gibt es Kritiken ab wie ein Restaurantkritiker (ab und zu mit Krümel-Wertung).
   Kein Füttern, kein Hunger, keine Sättigung, kein Gratis-Krümel, kein Zufallsgeschenk, kein Tageszustand.
   – Regal „Für Hühnchen“ im Kramladen (unter Schaufenster und Skins), beliebig nachkaufbar, 4–12 Taler
   – Gekauftes liegt in einer kleinen Blechdose bei der Hühnchen-Karte auf „Heute“ (nur sichtbar, wenn etwas drin ist)
   – Antippen gibt (Standard), Ziehen auf Hühnchen ist ein Extra
   – Kombinationen mit Hühnchen-Outfits lösen eine kleine Szene aus → Fotoalbum (ohne Lücken, ohne Zähler)
   Zustand: S.fuerHuhn = { dose: {id: n}, gekauft: {id: n}, gegeben: {id: n}, album: {kombi: "JJJJ-MM-TT"}, zuletzt: {id: i}, n: Zahl }
   ============================================================ */

/* ---------- Symbole (48er Raster, Farbklassen wie ICF in core.js) ---------- */
const FH_BILD_QUELLE = {
  "fh-knaecke": `<g transform="rotate(-8 24 24)"><rect class="H" x="6" y="12" width="36" height="26" rx="3"/><rect class="h" x="6" y="10" width="36" height="26" rx="3"/><rect class="c" x="9" y="13" width="30" height="20" rx="2" opacity=".55"/><g class="H">${[13, 19, 25, 31, 37].map(x => [17, 23, 29].map(y => `<circle cx="${x - 1}" cy="${y}" r="1.2"/>`).join("")).join("")}</g></g>`,
  "fh-zimt": `<ellipse class="H" cx="24" cy="31" rx="19" ry="11"/><ellipse class="h" cx="24" cy="28" rx="19" ry="11"/><path class="-H" stroke-width="2.6" d="M24 28c0-2 3-2 3 0 0 3-6 3-6 0 0-4 9-4 9 0 0 5-12 5-12 0 0-6 16-6 16 0"/><g class="w"><circle cx="13" cy="24" r="1.2"/><circle cx="33" cy="22" r="1.2"/><circle cx="36" cy="30" r="1.2"/><circle cx="14" cy="32" r="1.2"/><circle cx="24" cy="20" r="1.2"/><circle cx="27" cy="35" r="1.2"/></g>`,
  "fh-salmiak": `<g class="k"><path d="M14 8l9 9-9 9-9-9Z"/><path d="M33 12l9 9-9 9-9-9Z"/><path d="M20 24l9 9-9 9-9-9Z"/></g><g class="-e" stroke-width="1.1" stroke-linejoin="round" fill="none" opacity=".7"><path d="M14 8l9 9-9 9-9-9Z"/><path d="M33 12l9 9-9 9-9-9Z"/><path d="M20 24l9 9-9 9-9-9Z"/></g><g class="w"><circle cx="13" cy="15" r=".9"/><circle cx="16" cy="18" r=".9"/><circle cx="33" cy="19" r=".9"/><circle cx="31" cy="23" r=".9"/><circle cx="35" cy="22" r=".9"/><circle cx="19" cy="31" r=".9"/><circle cx="22" cy="34" r=".9"/></g><path class="-w" stroke-width="1.4" d="M10 14l3-3M29 18l3-3M16 30l3-3" opacity=".6"/>`,
  "fh-torte": `<ellipse class="e" cx="24" cy="41" rx="20" ry="3.4"/><path class="c" d="M7 24h34v15H7Z"/><path class="y" d="M7 31h34v3H7Z"/><path class="r" d="M7 27h34v2H7Z"/><path class="g" d="M7 25c2-11 32-13 34 0Z"/><path class="G" d="M7 25h34v1.6H7Z" opacity=".5"/><circle class="p" cx="23" cy="13.4" r="4.2"/><path class="-r" stroke-width="1.2" d="M21 13.4a2 2 0 1 1 2 2" opacity=".7"/><path class="G" d="M26 15c3-1 5 0 5 2-3 .6-4.4 0-5-2Z"/>`,
  "fh-beeren": `<path class="g" d="M23 6c6-2 11 1 12 6-6 1.6-10-1-12-6Z"/><path class="-G" stroke-width="1.6" d="M24 8c-1 4-1 8 0 12"/><g class="B"><circle cx="15" cy="26" r="7"/><circle cx="30" cy="25" r="7"/><circle cx="22" cy="36" r="7"/><circle cx="35" cy="37" r="6"/></g><g class="b"><circle cx="14" cy="25" r="5.4"/><circle cx="29" cy="24" r="5.4"/><circle cx="21" cy="35" r="5.4"/><circle cx="34" cy="36" r="4.6"/></g><g class="-B" stroke-width="1.4"><path d="M13 22.6l1 1.4 1-1.4M28 21.6l1 1.4 1-1.4M20 32.6l1 1.4 1-1.4"/></g><g class="w" opacity=".7"><circle cx="11.6" cy="27" r="1"/><circle cx="26.6" cy="26" r="1"/><circle cx="18.6" cy="37" r="1"/></g>`,
  "fh-fika": `<ellipse class="e" cx="23" cy="39" rx="19" ry="4.4"/><ellipse class="w" cx="23" cy="37.6" rx="16" ry="3.4"/><path class="-b" stroke-width="3" d="M33 22.4h3a4 4 0 0 1 0 8h-3"/><path class="b" d="M11 19h24v8a12 12 0 0 1-24 0Z"/><ellipse class="H" cx="23" cy="19" rx="12" ry="2.8"/><g class="w"><circle cx="16" cy="26" r="1.3"/><circle cx="23" cy="29" r="1.3"/><circle cx="30" cy="26" r="1.3"/></g><path class="-e" stroke-width="1.8" d="M18 13q-2-3 0-6M24 13q-2-3 0-6M30 13q-2-3 0-6" opacity=".8"/>`,
  "fh-wachs": `<rect class="Y" x="7" y="19" width="34" height="21" rx="4"/><rect class="y" x="7" y="17" width="34" height="19" rx="4"/><rect class="H" x="6" y="12" width="36" height="7" rx="2.4"/><rect class="r" x="12" y="22" width="24" height="10" rx="1.4"/><path class="-w" stroke-width="1.6" d="M15 27h18" opacity=".8"/><path class="-w" stroke-width="2" d="M10 14h8" opacity=".55"/><path class="y" d="M41 4l1.2 3.4L45.6 8.6 42.2 9.8 41 13.2 39.8 9.8 36.4 8.6 39.8 7.4Z"/>`,
  "fh-waerme": `<rect class="R" x="19" y="4" width="10" height="9" rx="2"/><path class="r" d="M14 12h20a5 5 0 0 1 5 5v20a7 7 0 0 1-7 7H16a7 7 0 0 1-7-7V17a5 5 0 0 1 5-5Z"/><path class="-w" stroke-width="1.6" d="M12 19l3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3M12 38l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3" opacity=".75"/><path class="p" d="M24 34c-4-2.6-6-4.4-6-6.4a2.8 2.8 0 0 1 6-.8 2.8 2.8 0 0 1 6 .8c0 2-2 3.8-6 6.4Z"/>`,
  "fh-disko": `<path class="-e" stroke-width="1.6" d="M24 2v9"/><circle class="e" cx="24" cy="27" r="16"/><g class="s"><path d="M15 16h6v6h-6zM27 22h6v6h-6zM15 28h6v6h-6zM33 30h4v5h-4z"/></g><g class="w"><path d="M21 22h6v6h-6zM27 16h5v6h-5zM21 34h6v4h-6z"/></g><path class="-c" stroke-width="1" d="M8.4 22h31M8 28h32M9.6 34h28.8M15 12.6v29M21 11.2v31.6M27 11.2v31.6M33 12.6v29" opacity=".7"/><path class="y" d="M42 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1ZM6 38l.8 2.2 2.2.8-2.2.8L6 44l-.8-2.2L3 41l2.2-.8Z"/>`,
  "fh-album": `<rect class="h" x="6" y="7" width="36" height="35" rx="3"/><rect class="H" x="6" y="7" width="5" height="35" rx="2"/><g transform="rotate(-6 26 22)"><rect class="w" x="15" y="12" width="21" height="22" rx="1"/><rect class="s" x="17.4" y="14.4" width="16.2" height="13" /><circle class="y" cx="28.6" cy="18.4" r="2.6"/><path class="g" d="M17.4 27.4l5-6 4 4 2.4-2.4 4.8 4.4Z"/></g>`,
  "fh-kassette": `<rect class="B" x="4" y="11" width="40" height="27" rx="3"/><rect class="c" x="8" y="14" width="32" height="14" rx="1.6"/><path class="-r" stroke-width="1.6" d="M11 18h18"/><rect class="k" x="14" y="21" width="20" height="8" rx="4"/><circle class="w" cx="18.4" cy="25" r="2.6"/><circle class="w" cx="29.6" cy="25" r="2.6"/><circle class="k" cx="18.4" cy="25" r="1"/><circle class="k" cx="29.6" cy="25" r="1"/><path class="e" d="M12 38l3-6h18l3 6Z"/><path class="y" d="M37 15l-4 7h3l-2 5 6-8h-3l2-4Z"/>`
};
const FH_BILD = {}; for (const k in FH_BILD_QUELLE) FH_BILD[k] = FH_BILD_QUELLE[k].replace(/class="(-?)(\w)"/g, (m, l, c) => `class="${l ? "l" : "f"}-${c}"`);
const fhBild = (id, gr = 64, k = "ware-svg") => `<svg class="${k} ic-f" viewBox="0 0 48 48" width="${gr}" height="${gr}" aria-hidden="true">${FH_BILD[id] || ""}</svg>`;

/* ---------- Sortiment: jede Sache ist eine Zeile Konfiguration ----------
   b = Bewegung (picken · stemmen · schluerfen · umarmen), fx = Effekte (kruemel · dampf · sterne),
   x = kleine Zugabe in der Szene (nase · blau · dreh · licht), s = Sprüche, k = Krümel-Kritik [1–5, Satz] */
const FH_WAREN = [
  { id: "fh-knaecke", name: "Knäckebrot", preis: 5, b: "picken", fx: ["kruemel"], text: "Eine Scheibe Roggenknäcke. Hühnchen knackt sie so laut, dass man es bis zur Tür hört.", s: ["Knack. Das hat man bis Vimmerby gehört.", "Trocken, aber ehrlich. Wie ich.", "Die Krümel fegt nachher jemand weg. Ich nicht, ich hab keinen Besen."], k: [4, "Abzug für den einen Krümel unterm Tisch."] },
  { id: "fh-fika", name: "Tasse Fika-Kaffee", preis: 4, b: "schluerfen", fx: ["dampf"], text: "Ein Tässchen Kaffee mit Untertasse. Hühnchen schlürft wie im Café in Stockholm.", s: ["Kaffee. Ohne Kaffee kein Kanelbulle. Das ist Gesetz.", "Fika. Heißt: Wir sitzen jetzt erst mal.", "Schwarz, ohne Zucker. Na gut, ein Stück."], k: [3, "Kaffee krümelt halt nicht. Dafür kann er nichts."] },
  { id: "fh-zimt", name: "Kanelbulle", preis: 8, b: "picken", fx: ["kruemel", "dampf"], text: "Eine Zimtschnecke vom Blech, noch warm. Hühnchen pickt zuerst die Zuckerperlen ab.", s: ["Zimt. Das ist Schwedisch für: noch eine.", "Erst die Zuckerperlen, dann der Rest. Das macht man so.", "Lauwarm. Genau richtig. Ich hab nachgefühlt."], k: [5, "Mehr gibt’s nicht, sonst hätt ich mehr gegeben."] },
  { id: "fh-salmiak", name: "Salmiak-Lakritz", preis: 6, b: "picken", fx: ["sterne"], text: "Schwarze Rauten, salzig und streng. Hühnchen findet sie schrecklich. Und will noch eine.", s: ["Schrecklich. … Hast du noch eine?", "Salzig, schwarz und frech. Deswegen mag ich sie.", "Die Schweden essen das freiwillig. Ich jetzt auch."], k: [2, "Und eine Träne. Ich komm trotzdem wieder."] },
  { id: "fh-beeren", name: "Blaubeeren vom Forst", preis: 6, b: "picken", fx: ["sterne"], x: "blau", text: "Eine Handvoll Blaubeeren aus dem Forst. Danach ist Hühnchens Schnabel kurz verdächtig blau.", s: ["Ich hab nichts gegessen. Wieso?", "Eine für dich, eine für mich. Eine für mich.", "Die kleinen sind die süßesten. Hab ich alle geprüft."], k: [4, "Abzug, weil ich jetzt blau bin."] },
  { id: "fh-torte", name: "Stück Prinsesstårta", preis: 12, b: "umarmen", fx: ["sterne"], x: "nase", text: "Ein Stück grüne Prinzessinnentorte. Das Marzipan bleibt Hühnchen an der Schnabelspitze kleben.", s: ["Prinsesstårta. Ich fühl mich gleich adelig.", "Marzipan an der Nase? Das trägt man so bei Hofe.", "Ich bin aus Ton. Aber für Sahne mach ich eine Ausnahme."], k: [5, "Und eine Krone. Die Krone behalt ich."] },
  { id: "fh-wachs", name: "Parkettwachs", preis: 8, b: "umarmen", fx: ["sterne"], x: "dreh", text: "Eine Dose Bohnerwachs. Hühnchen nimmt Anlauf und dreht eine Pirouette.", s: ["Wer hat hier gebohnert? Ich tanz sowieso gleich.", "Ich rutsch nicht. Ich gleite.", "Eine Pirouette. Mehr ist mit Ton nicht drin."], k: [3, "Schmeckt nach nichts, glänzt aber."] },
  { id: "fh-waerme", name: "Wärmflasche im Strickbezug", preis: 7, b: "umarmen", fx: [], text: "Eine kleine Wärmflasche im gestrickten Bezug. Hühnchen kuschelt sich dran und macht die Augen zu.", s: ["Nicht stören. Ich bin im Winterschlaf. Bis zum Kaffee.", "Wer hat den Bezug gestrickt? Ich frag nicht. Ich behalt ihn.", "So. Jetzt bin ich warm gebrannt. Zum zweiten Mal."], k: [4, "Für die Wärme. Geschmacklich eher Gummi."] },
  { id: "fh-disko", name: "Diskokugel", preis: 12, b: "stemmen", fx: ["sterne"], x: "licht", text: "Eine Diskokugel in Hühnchen-Größe. Lichtpunkte tanzen über Hühnchens Karte.", s: ["Licht aus, Kugel an. Ich führe.", "Ich hab Rhythmus. Man sieht’s nur nicht, ich bin aus Ton.", "Die Lichtpunkte gehören alle mir. Den da darfst du haben."], k: [3, "Knusprig ist anders. Aber das Licht!"] },
  { id: "fh-kassette", name: "Krimi-Kassette", preis: 9, b: "umarmen", fx: ["sterne"], text: "Ein Hörspiel-Krimi auf Kassette. Hühnchen hält sie fest und rätselt mit.", s: ["Pst. Gleich kommt raus, wer’s war.", "Ich hab’s gewusst. Seit Seite A.", "Spul nicht vor. Ich hab die Augen zu, aber ich hör alles."], k: [4, "Spannend bis zum Schluss. Bandsalat gab’s nicht."] }
];
const FH_MAP = Object.fromEntries(FH_WAREN.map(w => [w.id, w]));

/* ---------- Kombinationen mit Hühnchen-Outfits (nur Outfits, die es schon gibt) ---------- */
const FH_KOMBIS = [
  { id: "k-skal", skin: "h-wikinger", ware: "fh-knaecke", b: "stemmen", fx: ["kruemel", "sterne"], titel: "Skål!", s: "Skål! Ein Schild aus Knäckebrot. Hält genau einen Biss." },
  { id: "k-fall", skin: "h-detektiv", ware: "fh-kassette", b: "umarmen", fx: ["sterne"], titel: "Fall gelöst. Fast.", s: "Ich hab mitgeschrieben. Der Gärtner war’s. Nee, warte – der hat ein Alibi." },
  { id: "k-disco", skin: "h-fliege", ware: "fh-disko", b: "stemmen", fx: ["sterne"], x: ["licht", "dreh"], titel: "Discofox", s: "Discofox mit Fliege. Eins, zwei, tipp – du darfst führen." },
  { id: "k-all", skin: "h-astronaut", ware: "fh-zimt", b: "schluerfen", fx: ["dampf", "sterne"], titel: "Zimt im All", s: "Zimtschnecke im All. Schwebt mir dauernd vom Schnabel weg." },
  { id: "k-chef", skin: "h-koch", ware: "fh-torte", b: "picken", fx: ["sterne"], x: ["nase"], titel: "Fünf Krümel vom Chef", s: "Als Fachmann sag ich: Da ändere ich nichts. Höchstens die Nase.", k: [5, "Höchste Wertung. Vom Chef persönlich."] },
  { id: "k-menuett", skin: "h-haendel", ware: "fh-wachs", b: "umarmen", fx: ["sterne"], x: ["dreh"], titel: "Menuett auf Parkett", s: "Ein Menuett auf frischem Wachs. Händel hätte geklatscht. Oder gleich was komponiert." }
];
const FH_KOMBI_MAP = Object.fromEntries(FH_KOMBIS.map(k => [k.id, k]));
/* nur Kombinationen, deren Outfit es im Laden schon gibt (Datum „ab“) oder das Hühnchen schon hat */
const fhKombiDa = k => { const s = typeof SKIN_MAP !== "undefined" && SKIN_MAP[k.skin]; return !!s && !!FH_MAP[k.ware] && (skinDa(s) || skinHat(s.id)); };

/* ---------- Zustand und Migration ---------- */
let FH_GEPRUEFT = null;
function fhMigrieren() {
  const obj = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
  const zahl = v => Number.isFinite(v) && v > 0 ? Math.min(9999, Math.floor(v)) : 0;
  const zaehler = o => { const r = {}; for (const k in obj(o)) { const n = zahl(obj(o)[k]); if (n && typeof k === "string" && /^fh-[a-z]+$/.test(k)) r[k] = n; } return r; };
  const z = obj(S.fuerHuhn), TAG = /^\d{4}-\d{2}-\d{2}$/;
  const album = {}; for (const k in obj(z.album)) if (FH_KOMBI_MAP[k] && typeof z.album[k] === "string" && TAG.test(z.album[k])) album[k] = z.album[k];
  const zuletzt = {}; for (const k in obj(z.zuletzt)) { const i = obj(z.zuletzt)[k]; if (FH_MAP[k] && Number.isInteger(i) && i >= 0 && i < 9) zuletzt[k] = i; }
  S.fuerHuhn = { dose: zaehler(z.dose), gekauft: zaehler(z.gekauft), gegeben: zaehler(z.gegeben), album, zuletzt, n: zahl(z.n) };
  FH_GEPRUEFT = S.fuerHuhn;
}
/* robust auch nach Zurücksetzen oder Einspielen einer Sicherung (dann ist S ein neues Objekt) */
function fhZ() { if (!S.fuerHuhn || S.fuerHuhn !== FH_GEPRUEFT) fhMigrieren(); return S.fuerHuhn; }
const fhInDose = () => { const d = fhZ().dose; return FH_WAREN.filter(w => d[w.id] > 0); };
const fhDoseZahl = () => fhInDose().reduce((a, w) => a + fhZ().dose[w.id], 0);
const fhAn = () => !!(S && S.huhn && S.onboard);

/* ============================================================
   Kramladen: Regal „Für Hühnchen“
   ============================================================ */
const FH_LADEN_SATZ = ["Ich bin aus Ton. Ich ess nicht wirklich, ich tu nur so. Aber mit Hingabe.", "Mitbringen ist freiwillig. Gucken auch. Ich guck trotzdem.", "Ich brauch nichts, ich bin ja aus Ton. Aber ich nehm’s gern."];
function fhRegal() {
  if (!fhAn()) return "";
  const t = talerStand(), z = fhZ(), satz = FH_LADEN_SATZ[hash32("fh" + heute()) % FH_LADEN_SATZ.length];
  const album = Object.keys(z.album).length;
  return `<section class="laden-abt fh-abt" id="abt-fuerhuhn"><h3 class="abt-schild"><span class="fh-schild-kopf" aria-hidden="true">${huhnSVG({ gr: 30, kopf: true, skin: false })}</span> Für Hühnchen</h3>
    <p class="laden-huhn">${huhnSVG({ gr: 40, kopf: true })}<span><span class="wer">Hühnchen</span> ${esc(satz)}</span></p>
    <p class="klein fh-erklaer">Kleinigkeiten zum Mitbringen. Sie landen in Hühnchens Dose auf „Heute“. Dort tippst du drauf, dann bekommt Hühnchen sie.</p>
    <div class="regal">${FH_WAREN.map(w => { const n = z.dose[w.id] || 0;
      return `<button class="ware-kachel fh-ware" data-act="fh-ware" data-id="${w.id}"><span class="ware-bild">${fhBild(w.id, 60)}</span><span class="ware-name">${esc(w.name)}</span><span class="preis-schild${t >= w.preis ? " geht" : ""}">${MUENZE()}${w.preis}</span>${n ? `<span class="klein fh-indose">${n} in der Dose</span>` : ""}</button>`; }).join("")}</div><div class="regal-brett" aria-hidden="true"></div>
    ${album ? `<button class="fh-album-knopf" data-act="fh-album">${fhAlbumSymbol()}<span><span class="lt-titel">Hühnchens Fotoalbum</span><span class="klein">Besondere Momente mit Outfit</span></span>${ic("pfeil", "pfeil")}</button>` : ""}</section>`;
}
function fhWareSheet(id) {
  const w = FH_MAP[id]; if (!w) return;
  const sh = sheet({ titel: w.name, id: "fh-ware", inhalt: `<div class="ware-gross">${fhBild(w.id, 120)}</div><p>${esc(w.text)}</p><p class="klein">Hühnchen ist aus Ton und tut nur so, als ob. Das aber mit voller Überzeugung.</p>`, fuss: fhWareFuss(w) });
  if (sh) sh.dataset.ware = w.id;
}
function fhWareFuss(w, gekauft) {
  const t = talerStand(), n = fhZ().dose[w.id] || 0;
  const kauf = t >= w.preis ? `<button class="knopf ${gekauft ? "zweit" : "haupt"} voll" data-act="fh-kaufen" data-id="${w.id}" data-fb="taler">${MUENZE()} ${gekauft ? "Noch eins mitbringen" : "Mitbringen"} – ${w.preis} Taler</button>` : skFortschritt(w.preis, t, "dann kannst du es mitbringen");
  const geben = n ? `<button class="knopf ${gekauft ? "haupt" : "zweit"} voll" data-act="fh-hin">Zu Hühnchen auf „Heute“</button>` : "";
  const status = gekauft ? `<p class="klein fh-fuss-satz">${ic("haken")} Liegt in Hühnchens Dose auf „Heute“${n > 1 ? ` (${n} Stück)` : ""}.</p>` : n ? `<p class="klein fh-fuss-satz">In der Dose: ${n}</p>` : "";
  return `<div class="stapel">${status}${gekauft ? geben + kauf : kauf + geben}</div>`;
}
function fhKaufen(id) {
  const w = FH_MAP[id]; if (!w || !fhAn() || talerStand() < w.preis) return;
  const z = fhZ();
  S.taler -= w.preis; S.talerAusgegeben = (S.talerAusgegeben || 0) + w.preis;
  z.dose[id] = (z.dose[id] || 0) + 1; z.gekauft[id] = (z.gekauft[id] || 0) + 1;
  speichern();                                   // Rückmeldung: Familie „taler“ am Knopf (feedback.js), die Plakette zählt herunter
  const sh = aktuellesSheet(); if (sh && sh.dataset.id === "fh-ware") sheetFuss(fhWareFuss(w, true));
  const l = SHEETS.find(x => x.id === "laden"); if (l) { const r = l.sh.querySelector("#abt-fuerhuhn"); if (r) { const neu = document.createElement("div"); neu.innerHTML = fhRegal(); r.replaceWith(neu.firstElementChild); } }
  fhDekorieren();
}
function fhHin() {
  alleSheetsZu(); $$(".toast").forEach(t => t.remove());
  setTimeout(() => {
    if (TAB !== "heute") { TAB = "heute"; render(); }
    setTimeout(() => { fhDekorieren(); const z = document.querySelector(".fh-zeile"); if (!z) return; z.scrollIntoView({ block: "center", behavior: REDUCED() ? "auto" : "smooth" }); setTimeout(() => fhTablett(true), REDUCED() ? 50 : 450); }, 80);
  }, 260);
}

/* ============================================================
   „Heute“: Blechdose mit Papieretikett bei der Hühnchen-Karte
   ============================================================ */
function fhDoseSVG(n) {
  return `<svg class="fh-dose-svg" viewBox="0 0 60 54" aria-hidden="true">
    <ellipse class="fh-dose-schatten" cx="30" cy="50" rx="24" ry="3.4"/>
    <path class="fh-dose-koerper" d="M7 19v23c0 4.4 10.3 8 23 8s23-3.6 23-8V19Z"/>
    <path class="fh-dose-band" d="M7 22c0 4.4 10.3 8 23 8s23-3.6 23-8v3c0 4.4-10.3 8-23 8S7 29.4 7 25Z"/>
    <g class="fh-dose-blumen"><circle cx="13" cy="38" r="2.4"/><circle cx="47" cy="38" r="2.4"/></g>
    <g class="fh-dose-blatt"><path d="M9.6 38.6q-2.4-3 .2-4.6M50.4 38.6q2.4-3-.2-4.6"/></g>
    <g class="fh-etikett"><path d="M18 31.4l24-1 .8 13.6-24 1.2Z"/><text x="30.6" y="41.6" text-anchor="middle" transform="rotate(-2.4 30 38)">${n}</text></g>
    <g class="fh-deckel"><path class="fh-dose-rand" d="M5.6 14v5c0 4.4 10.9 8 24.4 8s24.4-3.6 24.4-8v-5Z"/><ellipse class="fh-dose-oben" cx="30" cy="14" rx="24.4" ry="7.6"/><ellipse class="fh-dose-knauf" cx="30" cy="13" rx="9" ry="2.6"/><path class="fh-dose-glanz" d="M14 10.4q8-3.4 18-3.6"/></g>
  </svg>`;
}
function fhKarte() {
  const m = document.getElementById("main"); if (!m || TAB !== "heute") return null;
  const k = m.querySelector(".huhn-karte[data-act=huhn-tap]"); if (k) return k;
  const f = m.querySelector(".huhn-karte #tf-h"); return f ? f.closest(".huhn-karte") : null;
}
function fhDekorieren() {
  try {
    const alt = document.querySelector(".fh-zeile"), n = fhAn() ? fhDoseZahl() : 0, k = fhKarte();
    if (!k || !n) { if (alt && !FH.laeuft) alt.remove(); return; }
    if (alt && alt.previousElementSibling === k) { fhDoseMalen(alt); return; }
    if (alt) alt.remove();
    const z = document.createElement("div"); z.className = "fh-zeile";
    z.innerHTML = `<div class="fh-tablett" id="fh-tablett" hidden></div><button class="fh-dose" data-act="fh-dose" aria-expanded="false" aria-controls="fh-tablett"></button>`;
    k.insertAdjacentElement("afterend", z); fhDoseMalen(z);
    if (typeof armHaptics === "function") armHaptics();
  } catch (e) { console.warn(e); }
}
function fhDoseMalen(z) {
  const n = fhDoseZahl(), d = z.querySelector(".fh-dose"); if (!d) return;
  const lab = `Hühnchens Dose: ${n === 1 ? "eine Sache" : n + " Sachen"} drin – zum Öffnen antippen`;
  if (d.getAttribute("aria-label") !== lab) { const hap = d.querySelector(":scope>label.hap"); d.innerHTML = fhDoseSVG(n); if (hap) d.appendChild(hap); d.setAttribute("aria-label", lab); }
  const t = z.querySelector(".fh-tablett"); if (t && !t.hidden) t.innerHTML = fhTablettInhalt();
}
function fhTablettInhalt() {
  const z = fhZ();
  return fhInDose().map(w => `<button class="fh-ding" data-act="fh-geben" data-id="${w.id}" aria-label="${esc(w.name)} Hühnchen geben${z.dose[w.id] > 1 ? ` (${z.dose[w.id]} in der Dose)` : ""}">${fhBild(w.id, 40, "fh-ding-svg")}${z.dose[w.id] > 1 ? `<span class="fh-ding-zahl" aria-hidden="true">${z.dose[w.id]}</span>` : ""}</button>`).join("")
    + (Object.keys(z.album).length ? `<button class="fh-ding fh-ding-album" data-act="fh-album" aria-label="Hühnchens Fotoalbum">${fhAlbumSymbol()}</button>` : "");
}
function fhTablett(auf) {
  const z = document.querySelector(".fh-zeile"); if (!z) return;
  const t = z.querySelector(".fh-tablett"), d = z.querySelector(".fh-dose"); if (!t || !d) return;
  const offen = auf === undefined ? t.hidden : auf;
  t.hidden = !offen; d.setAttribute("aria-expanded", String(offen)); z.classList.toggle("offen", offen);
  if (offen) { t.innerHTML = fhTablettInhalt(); if (typeof armHaptics === "function") armHaptics(); if (!REDUCED()) $$(".fh-ding", t).forEach((b, i) => b.style.animationDelay = i * 45 + "ms"); }
}

/* ============================================================
   Geben: Szene aus dem Baukasten
   ============================================================ */
const FH = { laeuft: false, zieh: null };
/* Wo das Ding im 100er-Raster des Hühnchens liegt (links oben, Größe) und wo die Effekte entstehen */
const FH_BEWEGUNG = {
  picken: { x: 78, y: 62, gr: 27, fx: [91, 68] },
  stemmen: { x: 47, y: -18, gr: 32, fx: [63, -2] },
  schluerfen: { x: 84, y: 34, gr: 26, fx: [97, 36] },
  umarmen: { x: 56, y: 48, gr: 29, fx: [70, 50] }
};
const FH_STERNE = [[38, 12], [86, 6], [96, 26], [28, 34], [74, -4]];
function fhEffekte(fx, b) {
  const [cx, cy] = FH_BEWEGUNG[b].fx; let h = "";
  if (fx.includes("kruemel")) for (let i = 0; i < 8; i++) h += `<circle class="fh-k" cx="${(cx + (i % 4 - 1.5) * 2.6).toFixed(1)}" cy="${cy + (i % 2) * 2}" r="${(1 + (i % 3) * .45).toFixed(2)}" style="--dx:${((i - 3.5) * 2.4).toFixed(1)}px;--dy:${20 + (i % 3) * 5}px;animation-delay:${200 + i * 110}ms"/>`;
  if (fx.includes("dampf")) for (let i = 0; i < 3; i++) h += `<path class="fh-d" d="M${cx - 5 + i * 5} ${cy - 2}q-3-5 0-9q3-5 0-9" style="animation-delay:${i * 280}ms"/>`;
  if (fx.includes("sterne")) FH_STERNE.forEach(([x, y], i) => { h += `<path class="fh-s" d="M${x} ${y - 5}l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4Z" style="animation-delay:${500 + i * 160}ms"/>`; });
  return h;
}
function fhSpruch(w) {
  const z = fhZ(), alt = z.zuletzt[w.id];
  let i = Math.floor(Math.random() * w.s.length); if (w.s.length > 1 && i === alt) i = (i + 1 + Math.floor(Math.random() * (w.s.length - 1))) % w.s.length;
  z.zuletzt[w.id] = i; return w.s[i];
}
const FH_KRUEMEL = an => `<svg viewBox="0 0 16 14" class="fh-kr${an ? " an" : ""}" aria-hidden="true"><path d="M3 8.6c-.6-2.6 1.4-5 3.8-5.4 1.2-1.8 4-2 5.2-.2 2 .2 3.4 2.2 2.8 4.2.8 1.8-.4 4-2.4 4.2-1.2 1.6-3.8 1.8-5 .4C5 12 3 10.8 3 8.6Z"/></svg>`;
const FH_ZAHLWORT = ["", "Ein Krümel", "Zwei Krümel", "Drei Krümel", "Vier Krümel", "Fünf Krümel"];
function fhKritik(k) { return `<span class="fh-kritik"><span class="fh-kritik-reihe" role="img" aria-label="${k[0]} von 5 Krümeln">${[1, 2, 3, 4, 5].map(i => FH_KRUEMEL(i <= k[0])).join("")}</span><span class="fh-kritik-satz">${FH_ZAHLWORT[k[0]]}. ${esc(k[1])}</span></span>`; }

function fhGeben(id, von) {
  const w = FH_MAP[id], z = fhZ(); if (!w || !(z.dose[id] > 0) || FH.laeuft) return;
  const karte = fhKarte(), svg = karte && karte.querySelector("svg.huhn"); if (!svg) return;
  // Kombination? Nur mit dem Outfit, das Hühnchen gerade trägt
  const traegt = typeof skinEffektiv === "function" ? skinEffektiv("huhn") : null;
  const kombi = FH_KOMBIS.find(k => k.ware === id && k.skin === traegt && fhKombiDa(k)) || null;
  const neuFoto = kombi && !z.album[kombi.id];
  z.dose[id]--; if (!z.dose[id]) delete z.dose[id];
  z.gegeben[id] = (z.gegeben[id] || 0) + 1; z.n++;
  if (neuFoto) z.album[kombi.id] = heute();
  const satz = kombi ? kombi.s : fhSpruch(w);
  // Krümel-Kritik als Running Gag: jedes dritte Mal (fest, kein Zufall), bei der Chef-Szene immer
  const kritik = kombi && kombi.k ? kombi.k : !kombi && z.n % 3 === 0 ? w.k : null;
  S.huhnSagt = { tag: heute(), text: satz };
  speichern();
  fhTablett(false);
  const zl = document.querySelector(".fh-zeile"); if (zl) { if (fhDoseZahl()) fhDoseMalen(zl); else zl.classList.add("leer"); }
  fhSzene({ w, kombi, satz, kritik, neuFoto, karte, svg, von });
}
function fhSzene(o) {
  const { w, kombi, karte, svg } = o, b = kombi ? kombi.b : w.b, fx = kombi ? kombi.fx : w.fx, x = kombi ? (kombi.x || []) : (w.x ? [w.x] : []);
  const P = FH_BEWEGUNG[b], ruhig = REDUCED();
  FH.laeuft = true; const zeile = document.querySelector(".fh-zeile"); if (zeile) zeile.classList.add("szene");
  const blase = karte.querySelector(".sprechblase");
  const textSetzen = (html, neu) => { if (!blase) return; blase.innerHTML = `<span class="wer">Hühnchen</span><span class="fh-satz${neu && !ruhig ? " fh-ein" : ""}">${html}</span>`; };
  // Bühne: alle Teile in zwei Gruppen (Drehung außen, Bewegung innen), Ding und Effekte als Schicht im 100er-Raster
  const ns = "http://www.w3.org/2000/svg", dreh = document.createElementNS(ns, "g"), alle = document.createElementNS(ns, "g");
  dreh.setAttribute("class", "fh-drehg"); alle.setAttribute("class", "fh-alle");
  while (svg.firstChild) alle.appendChild(svg.firstChild); dreh.appendChild(alle); svg.appendChild(dreh);
  const ding = document.createElementNS(ns, "g"); ding.setAttribute("class", "fh-obj ic-f" + (ruhig ? "" : " fh-obj-weg"));
  ding.setAttribute("transform", `translate(${P.x} ${P.y}) scale(${(P.gr / 48).toFixed(3)})`); ding.innerHTML = FH_BILD[w.id];
  const fluegel = alle.querySelector(".huhn-fluegel");
  if (b === "umarmen" && fluegel) fluegel.parentNode.insertBefore(ding, fluegel); else alle.appendChild(ding);
  const fxg = document.createElementNS(ns, "g"); fxg.setAttribute("class", "fh-fx"); alle.appendChild(fxg);
  const kopf = alle.querySelector(".huhn-kopf");
  if (x.includes("nase") && kopf) { const n = document.createElementNS(ns, "ellipse"); n.setAttribute("class", "fh-nase"); n.setAttribute("cx", "91"); n.setAttribute("cy", "35.4"); n.setAttribute("rx", "3.6"); n.setAttribute("ry", "2.6"); kopf.appendChild(n); }
  const licht = x.includes("licht") ? fhLicht(karte) : null;
  const ende = () => {
    svg.classList.remove("fh-b-" + b, "fh-blau", "fh-dreh", "fh-tanz", "fh-spielt");
    ding.remove(); fxg.remove(); const n = svg.querySelector(".fh-nase"); if (n) n.remove();
    while (alle.firstChild) svg.insertBefore(alle.firstChild, dreh); dreh.remove();
    if (licht) licht.remove();
    if (!ruhig) fertigText();
    karte.classList.remove("fh-buehne");
    setTimeout(() => {
      FH.laeuft = false; if (zeile) zeile.classList.remove("szene");
      fhDekorieren();
      if (o.neuFoto) toast(`Neues Foto in Hühnchens Fotoalbum: „${kombi.titel}“`, { knopf: { act: "fh-album", text: "Ansehen" }, dauer: 9000 });
    }, ruhig ? 0 : 420);
  };
  const fertigText = () => textSetzen(esc(o.satz) + (o.kritik ? fhKritik(o.kritik) : ""), true);
  if (ruhig) {   // ruhige Version: Standbild mit dem Ding neben Hühnchen, Spruch sofort
    if (x.includes("blau")) svg.classList.add("fh-blau");
    fertigText(); setTimeout(ende, 3600); return;
  }
  karte.classList.add("fh-buehne");   // Sprechblase tritt kurz zurück, Hühnchen hat die Bühne für sich
  setTimeout(() => {
    const r = svg.getBoundingClientRect(), mx = r.left + (P.x + P.gr / 2) / 100 * r.width, my = r.top + (P.y + P.gr / 2) / 100 * r.height, gr = P.gr / 100 * r.width;
    const start = o.von || { left: mx - 60, top: my + 80, width: 40, height: 40 };
    fhFlug(w.id, start, mx, my, gr, () => {
      ding.classList.remove("fh-obj-weg");
      svg.classList.add("fh-b-" + b, "fh-spielt"); if (kombi) svg.classList.add("fh-tanz");
      if (x.includes("blau")) setTimeout(() => svg.classList.add("fh-blau"), 500);
      if (x.includes("dreh")) svg.classList.add("fh-dreh");
      fxg.innerHTML = fhEffekte(fx, b);
      setTimeout(() => { ding.classList.add("fh-obj-weg"); }, kombi ? 2300 : 1850);
      setTimeout(ende, kombi ? 2650 : 2200);
    });
  }, 380);
}
/* Das Ding fliegt im kleinen Bogen von der Dose zu Hühnchen */
function fhFlug(id, von, zx, zy, gr, fertig) {
  const f = document.createElement("div"); f.className = "fh-flug"; f.setAttribute("aria-hidden", "true"); f.innerHTML = fhBild(id, 40, "fh-flug-svg");
  const sx = von.left + von.width / 2, sy = von.top + von.height / 2;
  f.style.left = (sx - 20) + "px"; f.style.top = (sy - 20) + "px"; document.body.appendChild(f);
  const dx = zx - sx, dy = zy - sy, s = gr / 40;
  const a = f.animate([{ transform: "translate(0,0) scale(1) rotate(0)" }, { transform: `translate(${dx * .5}px,${Math.min(dy, 0) * .6 - 60}px) scale(${(1 + s) / 2}) rotate(-14deg)`, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(0)` }], { duration: 520, easing: "cubic-bezier(.4,0,.4,1)", fill: "forwards" });
  let ok = false; const fin = () => { if (ok) return; ok = true; f.remove(); fertig(); };
  a.onfinish = fin; setTimeout(fin, 900);
}
/* Diskokugel: Lichtpunkte nur auf der Hühnchen-Karte */
function fhLicht(karte) {
  const l = document.createElement("span"); l.className = "fh-licht"; l.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 14; i++) { const p = document.createElement("i"); p.style.left = (6 + (i * 37) % 88) + "%"; p.style.top = (10 + (i * 53) % 78) + "%"; p.style.animationDelay = (i * 90) + "ms"; p.style.setProperty("--lx", ((i % 2 ? 1 : -1) * (14 + i % 5 * 6)) + "px"); l.appendChild(p); }
  karte.appendChild(l); return l;
}

/* ---------- Ziehen (Extra): ein Ding aus der Dose auf Hühnchen ziehen ---------- */
document.addEventListener("pointerdown", ev => {
  const b = ev.target.closest && ev.target.closest(".fh-ding[data-act=fh-geben]"); if (!b || FH.laeuft || ev.button > 0) return;
  FH.zieh = { b, id: b.dataset.id, x: ev.clientX, y: ev.clientY, pid: ev.pointerId, geist: null };
});
document.addEventListener("pointermove", ev => {
  const Z = FH.zieh; if (!Z || ev.pointerId !== Z.pid) return;
  if (!Z.geist) {
    if (Math.hypot(ev.clientX - Z.x, ev.clientY - Z.y) < 10) return;
    const g = document.createElement("div"); g.className = "fh-flug fh-geist"; g.setAttribute("aria-hidden", "true"); g.innerHTML = fhBild(Z.id, 40, "fh-flug-svg"); document.body.appendChild(g); Z.geist = g;
    try { Z.b.setPointerCapture(ev.pointerId); } catch (e) { }
    const k = fhKarte(); if (k) k.classList.add("fh-ziel");
  }
  Z.geist.style.left = (ev.clientX - 20) + "px"; Z.geist.style.top = (ev.clientY - 34) + "px";
  const k = fhKarte(), h = k && k.querySelector("svg.huhn");
  if (h) { const r = h.getBoundingClientRect(), drin = ev.clientX > r.left - 24 && ev.clientX < r.right + 24 && ev.clientY > r.top - 24 && ev.clientY < r.bottom + 24; k.classList.toggle("fh-ziel-drin", drin); }
});
function fhZiehEnde(ev, abbruch) {
  const Z = FH.zieh; if (!Z || ev.pointerId !== Z.pid) return; FH.zieh = null;
  const k = fhKarte(); if (k) k.classList.remove("fh-ziel", "fh-ziel-drin");
  if (!Z.geist) return;
  const g = Z.geist, gr = g.getBoundingClientRect(); g.remove();
  const h = k && k.querySelector("svg.huhn"), r = h && h.getBoundingClientRect();
  if (!abbruch && r && ev.clientX > r.left - 24 && ev.clientX < r.right + 24 && ev.clientY > r.top - 24 && ev.clientY < r.bottom + 24) {
    haptik("aktion"); fhGeben(Z.id, gr);   // nach dem Ziehen kommt kein Klick (core.js bricht ihn ab) – also hier genau eine Rückmeldung
  }
}
document.addEventListener("pointerup", ev => fhZiehEnde(ev, false));
document.addEventListener("pointercancel", ev => fhZiehEnde(ev, true));

/* ============================================================
   Fotoalbum: nur, was schon gefunden wurde – keine Lücken, kein Zähler
   ============================================================ */
const fhAlbumSymbol = () => fhBild("fh-album", 44, "fh-album-svg");
function fhAlbumSheet() {
  const z = fhZ(), fotos = FH_KOMBIS.filter(k => z.album[k.id]).sort((a, b) => z.album[a.id] < z.album[b.id] ? -1 : 1);
  const inhalt = fotos.length ? `<p class="klein" style="margin-top:0">Manchmal passt ein Mitbringsel besonders gut zu Hühnchens Outfit. Dann macht es ein Foto.</p><div class="fh-album">${fotos.map((k, i) => { const d = tagDatum(z.album[k.id]);
      return `<figure class="fh-polaroid" style="--dreh:${i % 2 ? 2.2 : -2.4}deg"><span class="fh-foto">${huhnSVG({ gr: 104, skin: k.skin })}<span class="fh-foto-ding">${fhBild(k.ware, 40, "fh-foto-svg")}</span></span><figcaption><span class="fh-foto-titel">${esc(k.titel)}</span><span class="klein">${d.getDate()}. ${MONAT[d.getMonth()]} ${d.getFullYear()}</span></figcaption></figure>`; }).join("")}</div>`
    : `<p>Noch keine Fotos. Manchmal passiert mit einem Outfit etwas Besonderes – dann macht Hühnchen ein Foto.</p>`;
  sheet({ titel: "Hühnchens Fotoalbum", id: "fh-album", inhalt });
}

/* ---------- Klicks ---------- */
document.addEventListener("click", ev => {
  const el = ev.target.closest && ev.target.closest("[data-act^='fh-']"); if (!el || el.disabled) return;
  try {
    const a = el.dataset.act, id = el.dataset.id;
    if (a === "fh-ware") fhWareSheet(id);
    else if (a === "fh-kaufen") fhKaufen(id);
    else if (a === "fh-hin") fhHin();
    else if (a === "fh-dose") fhTablett();
    else if (a === "fh-geben") { const r = el.getBoundingClientRect(); fhGeben(id, { left: r.left, top: r.top, width: r.width, height: r.height }); }
    else if (a === "fh-album") { $$(".toast").forEach(t => t.remove()); fhAlbumSheet(); }
  } catch (e) { console.warn(e); }
});
/* Nach jedem Rendern von „Heute“: Dose dazulegen */
(function fhBeobachten() {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") return;
  let raf = 0; const los = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fhDekorieren); };
  const start = () => { try { fhMigrieren(); } catch (e) { } const m = document.getElementById("main"); if (m) new MutationObserver(los).observe(m, { childList: true }); los(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
