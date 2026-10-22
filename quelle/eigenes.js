/* ============================================================
   Eigene Tätigkeiten: Rita legt selbst an, was sie macht.
   Jede bekommt einen Bereich – daraus folgen Wertung und Platz im Bild,
   genau wie bei ähnlichen vorhandenen Tätigkeiten.
   ============================================================ */
const EIGEN_BEREICHE = [
  { feld: "bewegung", name: "Bewegung", bild: "weg", icon: "schuh", bsp: "z. B. Treppe statt Aufzug" },
  { feld: "menschen", name: "Mit anderen", bild: "fenster", icon: "tassen", bsp: "z. B. Kaffeeklatsch" },
  { feld: "geist", name: "Lesen, Musik, Kultur", bild: "eiche", icon: "buch", bsp: "z. B. Kreuzworträtsel" },
  { feld: "schaffen", name: "Selbst gemacht", bild: "wiese", icon: "pinsel", bsp: "z. B. Balkon umgetopft" },
  { feld: "sorge", name: "Gut für mich", bild: "quelle", icon: "decke", bsp: "z. B. Fußbad" },
  { feld: "mut", name: "Draußen & Neues", bild: "mut", icon: "funke", bsp: "z. B. Neues Café ausprobiert" }
];
const EIGEN_ICONS = ["stern", "blume", "note", "pinsel", "tasse", "feder", "schuh", "buch", "kopfhoerer", "sonne", "kamera", "topf", "kuchen", "blatt", "karten", "raetsel"];

function eigeneRegistrieren() {
  D.taetigkeiten = D.taetigkeiten.filter(t => !t.eigen);
  for (const x of (S.eigeneT || [])) {
    const b = EIGEN_BEREICHE.find(b => b.feld === x.feld) || EIGEN_BEREICHE[3];
    D.taetigkeiten.push({ id: x.id, name: x.name, kurz: x.name.length > 16 ? x.name.slice(0, 15) + "…" : x.name, art: x.minuten ? "min" : "klein", std: 20, feld: b.feld, bild: b.bild, tf: "ABCD", icon: x.icon || b.icon, eigen: true,
      draussenOpt: !!x.minuten && b.feld === "bewegung", mutOpt: !!x.minuten && ["bewegung", "menschen", "schaffen"].includes(b.feld),
      info: ["Eigenes. Zählt genauso.", "Selbst ausgedacht, selbst gemacht."] });
  }
}

function eigenesSheet(id) {
  const x = id ? (S.eigeneT || []).find(y => y.id === id) : null;
  E2 = x ? { ...x } : { name: "", feld: "", minuten: true, icon: "" };
  sheet({ titel: x ? "Eigene Tätigkeit ändern" : "Eigene Tätigkeit anlegen", inhalt: eigenesInhalt(), id: "eigenes",
    fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="eigen-speichern">${ic("haken")} ${x ? "Speichern" : "Anlegen"}</button>${x ? `<button class="knopf leise" data-act="eigen-loeschen" data-id="${x.id}">Aus der Auswahl nehmen</button>` : ""}</div>` });
}
let E2 = null;
function eigenesInhalt() {
  const b = EIGEN_BEREICHE.find(b => b.feld === E2.feld);
  return `<label class="feld" for="eig-name">Wie heißt sie?</label><input id="eig-name" class="text" data-eig="name" value="${esc(E2.name)}" placeholder="${esc(b ? b.bsp : "z. B. Kreuzworträtsel")}" maxlength="40">
    <label class="feld">Wozu gehört das?</label><div class="chips">${EIGEN_BEREICHE.map(x => chip(E2.feld === x.feld, x.name, `data-act="eig-setz" data-f="feld" data-v="${x.feld}"`)).join("")}</div>
    <p class="klein" style="margin-top:6px">${b ? `Zählt wie andere Dinge aus „${esc(b.name)}“ und wächst im Bild ${({ weg: "am Weg", fenster: "an den Fenstern", eiche: "an der Leseeiche", wiese: "auf der Wiese", quelle: "an der Quelle", mut: "bei den Glühwürmchen" })[b.bild]}.` : "Danach richtet sich, wie es zählt und wo es im Bild wächst."}</p>
    <label class="feld">Mit Minuten?</label><div class="chips">${chip(E2.minuten, "Ja, wie lange", `data-act="eig-setz" data-f="minuten" data-v="1"`)}${chip(!E2.minuten, "Nein, einfach abhaken", `data-act="eig-setz" data-f="minuten" data-v="0"`)}</div>
    <label class="feld">Symbol</label><div class="icon-wahl">${EIGEN_ICONS.map(i => `<button class="knopf zweit" data-act="eig-setz" data-f="icon" data-v="${i}" aria-pressed="${(E2.icon || (b && b.icon)) === i}" aria-label="Symbol ${i}">${ic(i)}</button>`).join("")}</div>`;
}
function eigenAktion(a, d) {
  switch (a) {
    case "eigen-neu": sheetZu(); setTimeout(() => eigenesSheet(), 240); return true;
    case "eigen-bearbeiten": sheetZu(); setTimeout(() => eigenesSheet(d.id), 240); return true;
    case "eig-setz": E2[d.f] = d.f === "minuten" ? d.v === "1" : d.v; haptik("auswahl"); sheetInhalt(eigenesInhalt()); return true;
    case "eigen-speichern": {
      const n = (E2.name || "").trim(); if (!n) { $("#eig-name")?.focus(); toast("Erst einen Namen eintragen."); return true; }
      if (!E2.feld) { toast("Noch antippen, wozu es gehört."); return true; }
      S.eigeneT = S.eigeneT || [];
      if (E2.id) { const i = S.eigeneT.findIndex(y => y.id === E2.id); S.eigeneT[i] = { ...E2, name: n }; }
      else { E2.id = "eig-" + Date.now().toString(36); S.eigeneT.push({ ...E2, name: n }); }
      speichern(); eigeneRegistrieren(); haptik("erfolg"); const id = E2.id; sheetZu();
      setTimeout(() => { toast(`„${n}“ steht jetzt in der Auswahl.`, { erfolg: true, knopf: { text: "Gleich eintragen", act: "eigen-eintragen" }, dauer: 7000 }); window._eigenId = id; render({ halteScroll: true, ohneAnim: true }); }, 260);
      return true; }
    case "eigen-eintragen": $$(".toast").forEach(t => t.remove()); if (window._eigenId) eintragenSheet(window._eigenId); return true;
    case "eigen-loeschen": (S.eigeneT || []).forEach(y => { if (y.id === d.id) y.weg = true; }); S.schnell = S.schnell.map(s => s === d.id ? "gehen" : s); speichern(); eigeneRegistrieren(); sheetZu(); toast("Aus der Auswahl genommen. Alte Einträge bleiben."); return true;
  }
  return false;
}
document.addEventListener("input", ev => { const k = ev.target.dataset && ev.target.dataset.eig; if (k && E2) E2[k] = ev.target.value; });
