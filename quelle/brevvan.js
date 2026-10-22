/* ============================================================
   Brieffreundin Karin aus Vimmerby: kleine Briefwechsel auf Schwedisch.
   Rita wählt vorformulierte Antworten; Übersetzung auf Wunsch.
   Karin schreibt dienstags und freitags; ein verpasster Brief bleibt liegen.
   Gelesene bleiben zum Nochmal-Lesen.
   ============================================================ */
let BV = null;
function karinSVG(gr = 44) { return karinKopfSVG(gr); }
function bvVerfuegbar() {
  const alle = D.brevvan || [], gel = S.brevGelesen || {}, m = jetzt().getMonth() + 1;
  return alle.filter(b => !b.monat || b.monat.includes(m)).filter(b => !gel[b.id]);
}
const BV_POSTTAGE = [2, 5]; // Dienstag, Freitag
function bvLetzterPosttag(h) { for (let i = 0; i < 7; i++) { const t = tagPlus(h, -i); if (BV_POSTTAGE.includes(tagDatum(t).getDay())) return t; } return h; }
function bvNaechsterPosttag(h) { for (let i = 1; i <= 7; i++) { const t = tagPlus(h, i); if (BV_POSTTAGE.includes(tagDatum(t).getDay())) return t; } return h; }
// Der allererste Brief kommt sofort; danach an Posttagen. Nichts verfällt: verpasste Post wartet.
function bvHeuteNeu() { if (!bvVerfuegbar().length) return false; if (!S.brevTag) return true; return S.brevTag < bvLetzterPosttag(heute()); }
function bvWaehlen() {
  const m = jetzt().getMonth() + 1, v = bvVerfuegbar(); if (!v.length) return null;
  const saison = v.filter(b => b.monat && b.monat.includes(m));
  const pool = saison.length ? saison : v;
  return pool[hash32("bv" + heute() + S.seed) % pool.length];
}
function bvUebersichtSheet() {
  const gel = Object.keys(S.brevGelesen || {}), alle = D.brevvan || [];
  const neu = bvHeuteNeu();
  const archiv = alle.filter(b => gel.includes(b.id)).sort((a, b) => (S.brevGelesen[b.id] || "").localeCompare(S.brevGelesen[a.id] || ""));
  sheet({ titel: "Post von Karin", id: "brevvan", inhalt: `<div class="bv-kopf">${karinSVG(64)}<div><p style="margin:0;font-weight:700">Karin Sjöberg</p><p class="klein" style="margin:2px 0 0">Brieffreundin in Vimmerby, Småland. Rotes Holzhaus, Katze Sotis, Krimis bis unters Dach.</p><p class="klein" style="margin:4px 0 0;font-style:italic">Karin gibt es nur hier in der App – zum Schwedisch-Auffrischen, ein kleiner Ausflug nach Småland.</p></div></div>
    ${neu ? `<button class="bv-umschlag" data-act="bv-neu"><span class="bv-marke">SVERIGE</span><span class="bv-an">Rita<br>Spandauer Forst, Berlin</span><span class="bv-auf">Neuer Brief – aufmachen</span></button>`
      : `<div class="bogen mulde"><p style="margin:0">${(D.brevvan || []).length && !bvVerfuegbar().length ? "Alle Briefe gelesen. Karin schreibt bestimmt bald wieder." : `Karin schreibt dienstags und freitags. Der nächste Brief kommt am ${WOCHENTAG[tagDatum(bvNaechsterPosttag(heute())).getDay()]}.`}</p></div>`}
    <div style="margin-top:12px">${schalter(!!S.svHilfe, "Übersetzungen gleich zeigen", `data-act="bv-hilfe"`)}</div>
    ${archiv.length ? `<h3 style="margin-top:18px">Nochmal lesen</h3><div class="liste">${archiv.map(b => zeileBtn("briefkasten", b.thema, b.ord ? `Wort: ${b.ord.sv}` : "", `data-act="bv-lesen" data-id="${b.id}"`, "k-menschen")).join("")}</div>` : ""}
    ${(() => { const w = archiv.filter(b => b.ord && b.ord.sv); return w.length ? `<h3 style="margin-top:18px">Meine schwedischen Wörter</h3><ul class="bv-woerter">${w.map(b => `<li><span lang="sv" style="font-weight:700">${esc(b.ord.sv)}</span> – ${esc(b.ord.de || "")}</li>`).join("")}</ul>` : ""; })()}` });
}
function bvStarten(b) {
  const neu = { b, knoten: "start", verlauf: [], ende: false };
  // die Übersicht bleibt darunter, Zurück führt wieder zu Karins Briefen
  if (aktuellesSheet()?.dataset.id === "bv-brief") sheetZu(); setTimeout(() => { BV = neu; sheet({ titel: "Brief von Karin", id: "bv-brief", inhalt: "", onclose: () => { if (BV === neu) BV = null; } }); bvKarinSchreibt(b.knoten.start, () => { neu.knoten = "start"; }); }, 240);
}
function bvZeile(z, i) {
  const de = z.de && (S.svHilfe || z.offen) ? `<span class="bv-de">${esc(z.de)}</span>` : "";
  const knopf = z.de && !S.svHilfe ? `<button class="bv-ue" data-act="bv-ue" data-i="${i}" aria-label="Übersetzung">${z.offen ? "ausblenden" : "auf Deutsch"}</button>` : "";
  return z.wer === "karin" ? `<div class="bv-zeile karin"><div class="bv-papier"><span class="bv-sv" lang="sv">${esc(z.sv)}</span>${de}${knopf}</div></div>`
    : `<div class="bv-zeile rita"><div class="bv-papier rita"><span class="bv-sv" lang="sv">${esc(z.sv)}</span>${de}${knopf}</div></div>`;
}
function bvAnsicht() {
  const T = BV, k = T.b.knoten[T.knoten];
  let unten = "";
  if (T.ende) {
    const o = T.b.ord;
    unten = `${o ? `<div class="bv-ord"><span class="klein" style="font-weight:700">Dagens ord · Wort des Tages</span><p class="serif" style="font-size:1.3rem;margin:4px 0 2px" lang="sv">${esc(o.sv)}</p><p style="margin:0">${esc(o.de)}</p>${o.tipp ? `<p class="klein" style="margin:4px 0 0">${esc(o.tipp)}</p>` : ""}</div>` : ""}
      ${o && !(S.brevGelernt || {})[T.b.id] ? `<button class="knopf klein leise" style="margin-top:8px" data-act="bv-gelernt">${ic("funke")} „Neues gelernt“ eintragen</button>` : ""}
      <div class="stapel" style="margin-top:12px"><button class="knopf zweit voll" data-act="bv-auf">Zu Karins Briefen</button><button class="knopf leise" data-act="sheet-zu">Fertig</button></div>`;
  } else if (k && T.knoten !== "__warte") unten = `<p class="klein" style="margin:10px 0 6px">Deine Antwort:</p><div class="tel-antworten">${k.antworten.map((a, i) => `<button class="knopf zweit voll bv-antwort" data-act="bv-antwort" data-i="${i}"><span lang="sv">${esc(a.text)}</span>${S.svHilfe && a.de ? `<small class="bv-de-k">${esc(a.de)}</small>` : ""}</button>`).join("")}</div>`;
  return `<div class="tel-kopf"><span class="tel-figur fig-idle">${karinSVG(44)}</span><span><span style="font-weight:700">Karin</span><br><span class="klein">${esc(T.b.thema)}</span></span></div><div class="bv-verlauf" id="bv-verlauf">${T.verlauf.map(bvZeile).join("")}</div>${unten}`;
}
function bvZeige() { sheetInhalt(bvAnsicht()); const sc = aktuellesSheet()?.querySelector(".sheet-inhalt"); if (sc) sc.scrollTop = sc.scrollHeight; }
function bvKarinSchreibt(kn, dann) {
  BV.knoten = "__warte"; bvZeige();
  const v = $("#bv-verlauf"); if (v) v.insertAdjacentHTML("beforeend", `<div class="bv-zeile karin"><div class="bv-papier tippt">Karin skriver …</div></div>`);
  const T = BV, mund = an => { const f = aktuellesSheet()?.querySelector(".tel-kopf .tel-figur"); if (f) f.classList.toggle("spricht", an); };
  mund(true);
  setTimeout(() => { if (BV !== T) return; T.verlauf.push({ wer: "karin", sv: kn.sagt, de: kn.de }); if (dann) dann(); bvZeige(); mund(true); setTimeout(() => mund(false), 800); haptik("auswahl"); }, REDUCED() ? 0 : 900);
}
function bvEnde() {
  S.brevGelesen = S.brevGelesen || {}; const neu = !S.brevGelesen[BV.b.id];
  if (neu) { S.brevGelesen[BV.b.id] = heute(); S.brevTag = heute(); }
  speichern();
  const s = BV.b.schluss;
  if (s) bvKarinSchreibt({ sagt: s.sv, de: s.de }, () => { BV.ende = true; });
  else { BV.ende = true; bvZeige(); }
}
function bvAktion(a, d, el) {
  switch (a) {
    case "bv-auf": bvUebersichtSheet(); return true;
    case "bv-neu": { const b = bvWaehlen(); if (b) bvStarten(b); return true; }
    case "bv-lesen": { const b = (D.brevvan || []).find(x => x.id === d.id); if (b) bvStarten(b); return true; }
    case "bv-gelernt": { if (!BV || !BV.b.ord) return true; S.brevGelernt = S.brevGelernt || {}; S.brevGelernt[BV.b.id] = heute(); const r = eintragSpeichern({ t: "gelernt", tag: heute(), min: 10, notiz: "Schwedisch: " + BV.b.ord.sv }); nachEintrag(r, `Eingetragen: Neues gelernt – ${BV.b.ord.sv}.`); return true; }
    case "bv-hilfe": { S.svHilfe = !S.svHilfe; speichern(); haptik("auswahl"); const z = el && el.closest(".schalter-zeile"); if (z) z.outerHTML = schalter(S.svHilfe, "Übersetzungen gleich zeigen", `data-act="bv-hilfe"`); armHaptics(); return true; }
    case "bv-ue": { const z = BV && BV.verlauf[Number(d.i)]; if (z) { z.offen = !z.offen; bvZeige(); } return true; }
    case "bv-antwort": {
      if (!BV || BV.knoten === "__warte") return true;
      const k = BV.b.knoten[BV.knoten], ant = k && k.antworten[Number(d.i)]; if (!ant) return true;
      BV.verlauf.push({ wer: "rita", sv: ant.text, de: ant.de }); haptik("auswahl");
      if (ant.weiter && BV.b.knoten[ant.weiter]) { const ziel = ant.weiter; bvKarinSchreibt(BV.b.knoten[ziel], () => { BV.knoten = ziel; }); }
      else { BV.knoten = "__ende"; bvZeige(); bvEnde(); }
      return true; }
  }
  return false;
}
