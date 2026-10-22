/* ============================================================
   Lesen: Harry Potter (dynamisch), eigene Bücher (auch Geschenke),
   Bücherregal mit ausgedachten Buchdeckeln, Tipps und Merkliste.
   ============================================================ */
const BUCH_FARBEN = [["#2F5E8E", "#F2C230"], ["#8E2F3C", "#F3D9B1"], ["#2F6B4F", "#E9D8A6"], ["#4B3B6B", "#E8C4D8"], ["#B5652B", "#FBEBD0"], ["#1F3A4A", "#9FD3C7"], ["#6B4A2B", "#E7C27D"], ["#3F5A2A", "#D7E3B5"], ["#7A2E5C", "#F6D365"], ["#2B2D42", "#EF8354"]];
function buchCover(titel, autor = "", breite = 84) {
  const h = hash32("buch" + titel), [bg, fg] = BUCH_FARBEN[h % BUCH_FARBEN.length], motiv = (h >> 4) % 5, H = Math.round(breite * 1.5);
  const worte = String(titel).replace(/^Harry Potter und (der |die |das |den )?/, m => m ? "Harry Potter – " + (m.replace("Harry Potter und ", "")) : m).split(/\s+/), zeilen = []; let z = "";
  for (const w of worte) { if ((z + " " + w).trim().length > 13 && z) { zeilen.push(z); z = w; } else z = (z + " " + w).trim(); } if (z) zeilen.push(z);
  const zl = zeilen.slice(0, 5); if (zeilen.length > 5) zl[4] += "…";
  const m = [
    `<circle cx="70" cy="34" r="16" fill="${fg}" opacity=".85"/>`,
    `<path d="M0 118 L18 92 L30 108 L44 84 L60 110 L74 90 L100 118 V150 H0Z" fill="${fg}" opacity=".55"/>`,
    `${[0, 1, 2, 3].map(i => `<path d="M0 ${104 + i * 12} Q25 ${96 + i * 12} 50 ${104 + i * 12} T100 ${104 + i * 12}" stroke="${fg}" stroke-width="3" fill="none" opacity=".6"/>`).join("")}`,
    `${[0, 1, 2, 3, 4].map(i => `<rect x="${8 + i * 18}" y="0" width="5" height="150" fill="${fg}" opacity=".18"/>`).join("")}`,
    `<path d="M50 96 l6 12 13 2 -9 9 2 13 -12 -6 -12 6 2 -13 -9 -9 13 -2Z" fill="${fg}" opacity=".7"/>`][motiv];
  return `<svg class="buch-cover" viewBox="0 0 100 150" width="${breite}" height="${H}" role="img" aria-label="${esc(titel)}"><rect width="100" height="150" rx="4" fill="${bg}"/>${m}<rect x="0" y="0" width="7" height="150" fill="rgba(0,0,0,.18)"/>
    <text x="54" y="${motiv === 0 ? 62 : 26}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="11.5" fill="${fg}">${zl.map((l, i) => `<tspan x="54" dy="${i ? 13 : 0}">${esc(l)}</tspan>`).join("")}</text>
    ${autor ? `<text x="54" y="142" text-anchor="middle" font-family="Nunito, sans-serif" font-size="8" fill="${fg}" opacity=".9">${esc(autor.length > 22 ? autor.slice(0, 21) + "…" : autor)}</text>` : ""}</svg>`;
}
function hpBand() { return D.hp?.baende?.find(b => b.nr === S.hp.band) || null; }
function regalBuecher() {
  const seen = new Set(), out = [];
  for (const e of [...S.eintraege].reverse()) if (e.t === "buchfertig" && e.titel && !seen.has(e.titel)) { seen.add(e.titel); const eig = S.buecherEigen.find(b => b.titel === e.titel); const hp = D.hp?.baende?.find(b => b.titel === e.titel); out.push({ titel: e.titel, autor: eig?.autor || (hp ? "J. K. Rowling" : ""), von: eig?.von || "", tag: e.tag }); }
  return out;
}
let BN = null;
function lesebegleiterSheet() {
  const b = hpBand(), liest = S.buecherEigen.filter(x => x.status === "liest"), wunsch = S.buecherEigen.filter(x => x.status === "wunsch"), regal = regalBuecher();
  const hpOffen = (D.hp?.baende || []).filter(x => x.nr < S.hp.band && !S.eintraege.some(e => e.t === "buchfertig" && e.titel === x.titel));
  let h = `<h3 style="margin-top:0">Gerade dabei</h3>`;
  if (b) h += `<div class="buch-zeile">${buchCover(b.titel, "J. K. Rowling", 64)}<div style="flex:1;min-width:0"><div style="font-weight:700">${esc(b.titel)}</div><p class="klein" style="margin:2px 0 6px">Band ${b.nr} · Kapitel ${S.hp.kapitel} von ${b.kapitel}</p>
    <div class="stepper"><button class="knopf zweit" data-act="kap" data-d="-1" aria-label="Ein Kapitel zurück">${ic("minus")}</button><div class="wert zahl">${S.hp.kapitel}<small>von ${b.kapitel}</small></div><button class="knopf zweit" data-act="kap" data-d="1" aria-label="Ein Kapitel weiter">${ic("plus")}</button></div></div></div>`;
  h += liest.map(x => `<div class="buch-zeile">${buchCover(x.titel, x.autor, 64)}<div style="flex:1;min-width:0"><div style="font-weight:700">${esc(x.titel)}</div><p class="klein" style="margin:2px 0 6px">${esc([x.autor, x.von ? "von " + x.von : ""].filter(Boolean).join(" · "))}</p>
    <div class="zeile" style="gap:6px;flex-wrap:wrap"><button class="knopf klein zweit" data-act="buch-stueck" data-id="${x.id}">${ic("plus")} Ein Stück gelesen</button><button class="knopf klein haupt" data-act="buch-fertig" data-id="${x.id}">${ic("haken")} Ausgelesen</button></div></div></div>`).join("");
  h += `<button class="knopf zweit voll" style="margin-top:10px" data-act="buch-neu">${ic("plus")} Neues Buch eintragen</button><p class="klein" style="margin:6px 0 0">Zum Beispiel ein Geschenk von Christiane. Ausgelesene Bücher zählen und kommen ins Regal.</p>`;
  h += `<h3 style="margin-top:22px">Mein Regal${regal.length ? ` · ${regal.length}` : ""}</h3>${regal.length ? `<div class="regal">${regal.map(x => `<button class="regal-buch" data-act="buch-info" data-titel="${esc(x.titel)}">${buchCover(x.titel, x.autor, 76)}</button>`).join("")}</div>` : `<p class="klein">Noch leer. Das erste ausgelesene Buch steht dann hier.</p>`}`;
  if (hpOffen.length) h += `<button class="knopf klein zweit" style="margin-top:10px" data-act="buch-hp-vorher">${ic("haken")} Harry Potter 1–${S.hp.band - 1} schon gelesen? Ins Regal stellen</button>`;
  if (wunsch.length) h += `<h3 style="margin-top:22px">Will ich lesen</h3><div class="liste">${wunsch.map(x => `<div class="zeile" style="gap:8px"><button class="liste-zeile" style="flex:1" data-act="buch-anfangen" data-id="${x.id}">${ic("lesezeichen")}<span class="text"><span class="titel">${esc(x.titel)}</span><br><span class="unter">${esc(x.autor || "")} · Jetzt anfangen</span></span></button><button class="knopf klein leise" data-act="buch-weg" data-id="${x.id}" aria-label="Von der Liste nehmen">${ic("schliessen")}</button></div>`).join("")}</div>`;
  const tipps = (D.buecher || []).filter(t => !S.buecherEigen.some(x => x.titel === t.titel) && !regal.some(x => x.titel === t.titel));
  if (tipps.length) h += `<h3 style="margin-top:22px">Tipps von Max</h3>${tipps.map(x => `<div class="bogen buch-tipp">${buchCover(x.titel, x.autor, 56)}<div style="flex:1;min-width:0"><div style="font-weight:700">${esc(x.titel)}</div><div class="klein">${esc(x.autor || "")}</div><p style="margin:6px 0 8px">${esc(x.text || "")}</p><button class="knopf klein zweit" data-act="buch-merken" data-titel="${esc(x.titel)}">${ic("plus")} Auf meine Liste</button></div></div>`).join("")}`;
  h += `<details class="einst-gruppe" style="margin-top:18px"><summary>Harry-Potter-Band ändern</summary><div class="liste" style="margin-top:8px">${(D.hp?.baende || []).map(x => `<button class="liste-zeile" data-act="band" data-nr="${x.nr}" aria-pressed="${x.nr === S.hp.band}">${ic(x.nr === S.hp.band ? "buch" : "box")}<span class="text"><span class="titel">${x.nr}. ${esc(x.titel.replace("Harry Potter und ", "… "))}</span></span></button>`).join("")}</div><p class="klein">${esc(D.hp?.hinweis || "")}</p></details>`;
  sheet({ titel: "Lesen", id: "lesen", inhalt: h });
}
function buchNeuSheet(vorlage = {}) {
  BN = { titel: vorlage.titel || "", autor: vorlage.autor || "", von: "", status: "liest" };
  sheet({ titel: "Neues Buch", id: "buch-neu", inhalt: buchNeuInhalt(), fuss: `<button class="knopf haupt voll" data-act="buch-speichern">${ic("haken")} Eintragen</button>` });
}
function buchNeuInhalt() {
  const leute = S.menschen.filter(m => m.name).map(m => m.name);
  return `<label class="feld" for="bn-titel">Titel</label><input id="bn-titel" class="text" data-bn="titel" value="${esc(BN.titel)}" maxlength="80" placeholder="z. B. Die Brandmauer">
    <label class="feld" for="bn-autor">Autorin oder Autor</label><input id="bn-autor" class="text" data-bn="autor" value="${esc(BN.autor)}" maxlength="60" placeholder="z. B. Henning Mankell">
    <label class="feld">Geschenkt von</label><div class="chips">${["", ...leute].map(n => chip(BN.von === n, n || "Selbst besorgt", `data-act="bn-von" data-v="${esc(n)}"`)).join("")}</div>
    <label class="feld">Wie weit?</label><div class="chips">${[["liest", "Lese ich gerade"], ["fertig", "Schon ausgelesen"], ["wunsch", "Will ich lesen"]].map(([v, t]) => chip(BN.status === v, t, `data-act="bn-status" data-v="${v}"`)).join("")}</div>
    ${BN.titel ? `<div style="display:grid;place-items:center;margin-top:16px">${buchCover(BN.titel, BN.autor, 96)}</div>` : ""}`;
}
document.addEventListener("input", ev => { const k = ev.target.dataset && ev.target.dataset.bn; if (k && BN) BN[k] = ev.target.value; });
function buchAusgelesen(titel) {
  const r = eintragSpeichern({ t: "buchfertig", tag: heute(), titel });
  if (r) { S.huhnSagt = { tag: heute(), text: ["Ausgelesen! Ich hab ein neues Lesezeichen an die Eiche gehängt.", "Noch ein Buch im Regal. Das Regal wird langsam angeberisch.", "Fertig! Und? Wer war’s?"][Math.floor(Math.random() * 3)] }; speichern(); nachEintrag(r, `Ausgelesen: ${titel}.`); }
}
function buchAktion(a, d) {
  const id = d.id, x = S.buecherEigen.find(b => b.id === id);
  switch (a) {
    case "buch-neu": buchNeuSheet(); return;
    case "bn-von": BN.von = d.v || ""; sheetInhalt(buchNeuInhalt()); return;
    case "bn-status": BN.status = d.v; sheetInhalt(buchNeuInhalt()); return;
    case "buch-speichern": {
      const titel = (BN.titel || "").trim(); if (!titel) { toast("Wie heißt das Buch?"); $("#bn-titel")?.focus(); return; }
      const b = { id: "b" + Date.now().toString(36), titel, autor: (BN.autor || "").trim(), von: BN.von, status: BN.status, seit: heute() };
      S.buecherEigen.push(b); speichern(); const st = BN.status; BN = null; sheetZu();
      if (st === "fertig") setTimeout(() => buchAusgelesen(titel), 260);
      else { toast(st === "wunsch" ? `„${titel}“ steht auf deiner Liste.` : `„${titel}“ liegt jetzt neben dem Sofa.${b.von ? `\nGeschenkt von ${b.von}.` : ""}`); setTimeout(lesebegleiterSheet, 260); }
      render({ halteScroll: true, ohneAnim: true }); return; }
    case "buch-stueck": if (x) { const r = eintragSpeichern({ t: "lesen", tag: heute(), min: 20, notiz: x.titel }); nachEintrag(r, `Gelesen: ${x.titel}.`); } return;
    case "buch-fertig": if (x) { x.status = "fertig"; x.ende = heute(); speichern(); sheetZu(); setTimeout(() => buchAusgelesen(x.titel), 260); } return;
    case "buch-anfangen": if (x) { x.status = "liest"; x.seit = heute(); speichern(); sheetInhalt(""); sheetZu(); setTimeout(lesebegleiterSheet, 240); } return;
    case "buch-weg": S.buecherEigen = S.buecherEigen.filter(b => b.id !== id); speichern(); sheetZu(); setTimeout(lesebegleiterSheet, 240); return;
    case "buch-merken": { const t = (D.buecher || []).find(b => b.titel === d.titel); if (t) { S.buecherEigen.push({ id: "b" + Date.now().toString(36), titel: t.titel, autor: t.autor || "", von: "Tipp von Max", status: "wunsch", seit: heute() }); speichern(); haptik("auswahl"); sheetZu(); setTimeout(lesebegleiterSheet, 240); } return; }
    case "buch-hp-vorher": { for (const b of (D.hp?.baende || []).filter(b => b.nr < S.hp.band)) if (!S.eintraege.some(e => e.t === "buchfertig" && e.titel === b.titel)) eintragSpeichern({ t: "buchfertig", tag: heute(), titel: b.titel, notiz: "abgehakt", ts: Date.now() - (10 - b.nr) * 5000 }); speichern(); toast(`Harry Potter 1–${S.hp.band - 1} stehen jetzt im Regal.`, { erfolg: true }); sheetZu(); setTimeout(lesebegleiterSheet, 240); render({ halteScroll: true, ohneAnim: true }); return; }
    case "buch-info": { const r = regalBuecher().find(b => b.titel === d.titel); if (!r) return; sheet({ titel: r.titel, inhalt: `<div style="display:grid;place-items:center;margin-bottom:12px">${buchCover(r.titel, r.autor, 120)}</div><p style="text-align:center;margin:0">${esc(r.autor || "")}</p><p class="klein" style="text-align:center">Ausgelesen am ${esc(datumLang(r.tag))}${r.von ? ` · geschenkt von ${esc(r.von)}` : ""}</p>` }); return; }
  }
}
