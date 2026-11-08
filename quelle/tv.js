/* ============================================================
   Film & Fernsehen: Mediathek-Tipps und gute Sendungen der Woche.
   Daten aus tv.json (jeden Sonntag frisch). Merken bis zum Datum,
   danach verschwinden gemerkte Sendungen von selbst.
   ============================================================ */
let TV_TAB = "mediathek", TV_GENRE = "Alle";
function tvDaten() { const R = REPO.tv, T = R && R.stand && (!D.tv || R.stand >= D.tv.stand) ? R : (D.tv || { mediathek: [], fernsehen: [] }); return tvDuKlein(T); }
/* „Du/Dir/Dein“ aus dem Sonntags-Job mitten im Satz klein (einmal je geladenem Stand, nur im Speicher) */
const TV_KLEIN = new WeakSet();
function tvDuKlein(T) { if (!T || TV_KLEIN.has(T)) return T; TV_KLEIN.add(T); for (const k of ["mediathek", "fernsehen"]) (Array.isArray(T[k]) ? T[k] : []).forEach(x => { if (x && typeof x.text === "string") x.text = duKlein(x.text); }); return T; }
function tvId(x) { return "tv-" + angebotId((x.titel || "") + (x.datum || "") + (x.zeit || "") + (x.sender || "")); }
function tvAufraeumen() {
  const h = heute(); if (!Array.isArray(S.tvMerk)) S.tvMerk = [];
  const vor = S.tvMerk.length;
  S.tvMerk = S.tvMerk.filter(m => m.datum ? m.datum >= h : (m.bis ? m.bis >= h : (tagDatum(h) - tagDatum(m.gemerkt || h)) / 864e5 < 60));
  if (S.tvMerk.length !== vor) speichern();
}
function tvLaden() {
  if (!/github\.io$/.test(location.hostname)) return;
  fetch("tv.json", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(T => { if (T && typeof T.stand === "string" && Array.isArray(T.mediathek) && (!REPO.tv || REPO.tv.stand !== T.stand)) { const ok = x => x && typeof x === "object" && typeof x.titel === "string" && ["text", "sender", "datum", "zeit", "link", "genre", "bis", "art", "laenge"].every(k => x[k] == null || typeof x[k] === "string"); T.mediathek = T.mediathek.filter(ok); T.fernsehen = (Array.isArray(T.fernsehen) ? T.fernsehen : []).filter(ok); repoSchreiben("tv", T); } }).catch(() => { });
}
/* Rückfall-Links: stabile Startseiten der Sender, falls ein Einzel-Link ins Leere geht */
const TV_SENDER = (() => {
  const ard = ["https://www.ardmediathek.de/", "zur ARD Mediathek"], zdf = ["https://www.zdf.de/", "zur ZDF-Mediathek"];
  return { ard, daserste: ard, one: ard, tagesschau24: ard, zdf, zdfneo: zdf, arte: ["https://www.arte.tv/de/", "zur arte-Mediathek"], "3sat": ["https://www.3sat.de/", "zur 3sat-Mediathek"],
    phoenix: ["https://www.phoenix.de/", "zu phoenix"], ndr: ["https://www.ndr.de/", "zum NDR"], wdr: ["https://www1.wdr.de/", "zum WDR"], br: ["https://www.br.de/", "zum BR"],
    swr: ["https://www.swr.de/", "zum SWR"], mdr: ["https://www.mdr.de/", "zum MDR"], rbb: ["https://www.rbb-online.de/", "zum rbb"], hr: ["https://www.hr.de/", "zum HR"], sr: ["https://www.sr.de/", "zum SR"] };
})();
function tvRueckfall(x) {
  const s = String(x.sender || "").toLowerCase(), r = TV_SENDER[s.replace(/[^a-z0-9]/g, "")] || TV_SENDER[(s.split(/[\/,·&+]| und /)[0] || "").replace(/[^a-z0-9]/g, "")];
  if (!r || String(x.link || "").trim() === r[0]) return "";
  return `<p class="klein tv-rueckfall" style="margin:6px 0 0">${sicher(x.link) ? "Falls der Link nicht geht: " : ""}<a href="${r[0]}" target="_blank" rel="noopener" style="display:inline-block;padding:8px 0">${r[1]} ↗</a></p>`;
}
function tvKurzDatum(t) { const h = heute(); return t === h ? "Heute" : t === tagPlus(h, 1) ? "Morgen" : datumLang(t).replace(/ \d{4}$/, ""); }
function tvKarte(x, art) {
  const id = tvId(x), gemerkt = (S.tvMerk || []).some(m => m.id === id);
  const kopf = art === "tv" ? `<span class="tv-zeit">${esc(tvKurzDatum(x.datum))} · ${esc(x.zeit || "")} · ${esc(x.sender || "")}</span>` : `<span class="tv-zeit">${esc(x.sender || "")} · ${esc([x.art, x.laenge].filter(Boolean).join(", "))}</span>`;
  return `<div class="bogen tv-karte">${kopf}<h3 style="font-size:1.05rem;margin:4px 0 6px">${esc(x.titel)}</h3>${x.genre ? `<span class="tv-genre">${esc(x.genre)}</span>` : ""}<p style="margin:6px 0 8px">${esc(x.text || "")}</p>
    ${art !== "tv" && x.bis ? `<p class="klein" style="margin:0 0 6px">In der Mediathek bis ${esc(datumLang(x.bis).replace(/^[^,]*, /, ""))}</p>` : ""}
    <div class="zeile" style="gap:8px;flex-wrap:wrap">${gemerkt ? `<button class="knopf klein leise" data-act="tv-weg" data-id="${id}">${ic("haken")} Gemerkt</button>` : `<button class="knopf klein zweit" data-act="tv-merk" data-id="${id}" data-art="${art}">${ic("plus")} Merken</button>`}${sicher(x.link) ? `<a class="knopf klein leise" style="min-height:44px" href="${sicher(x.link)}" target="_blank" rel="noopener">${art === "tv" ? "Zur Sendung" : "Ansehen"} ↗</a>` : ""}</div>${tvRueckfall(x)}</div>`;
}
function tvInhalt() {
  tvAufraeumen();
  const T = tvDaten(), h = heute();
  const tv = (T.fernsehen || []).filter(x => x.datum >= h).sort((a, b) => (a.datum + a.zeit) < (b.datum + b.zeit) ? -1 : 1);
  const mt = (T.mediathek || []).filter(x => !x.bis || x.bis >= h);
  const genres = ["Alle", ...new Set(mt.map(x => x.genre).filter(Boolean))];
  let html = standHinweis(T.stand, true) + `<div class="chips" style="margin-bottom:8px">${[["mediathek", "Mediathek"], ["tv", "Im Fernsehen"], ["merk", `Gemerkt${S.tvMerk.length ? " · " + S.tvMerk.length : ""}`]].map(([v, t]) => chip(TV_TAB === v, t, `data-act="tv-tab" data-v="${v}"`)).join("")}</div>`;
  if (TV_TAB === "mediathek") {
    html += `<p class="klein" style="margin-top:0">Kostenlos in den Mediatheken von ARD, ZDF, arte & Co. – im Browser oder in der App.</p><div class="chips" style="margin-bottom:6px">${genres.map(g => chip(TV_GENRE === g, g, `data-act="tv-genre" data-v="${esc(g)}"`)).join("")}</div>`;
    const arr = mt.filter(x => TV_GENRE === "Alle" || x.genre === TV_GENRE);
    html += arr.length ? arr.map(x => tvKarte(x, "mt")).join("") : `<p>Gerade nichts in dieser Rubrik.</p>`;
  } else if (TV_TAB === "tv") {
    let tag = ""; html += tv.length ? tv.map(x => { const k = x.datum !== tag ? `<h3 style="margin-top:16px">${esc(tvKurzDatum(x.datum))}</h3>` : ""; tag = x.datum; return k + tvKarte(x, "tv"); }).join("") : `<p>Die neuen Tipps kommen am Sonntag.</p>`;
  } else {
    html += S.tvMerk.length ? S.tvMerk.slice().sort((a, b) => (a.datum || "9") < (b.datum || "9") ? -1 : 1).map(m => tvKarte(m, m.datum ? "tv" : "mt")).join("") + `<p class="klein">Sendungen verschwinden nach ihrem Termin von selbst von der Liste.</p>` : `<p>Noch nichts gemerkt. Mit „Merken“ landet ein Tipp hier – und am Tag selbst erinnert die App auf „Heute“ daran.</p>`;
  }
  html += `<p class="klein" style="margin-top:14px">Stand: ${esc(T.stand ? datumLang(T.stand).replace(/^[^,]*, /, "") : "–")}. Jeden Sonntag kommen neue Tipps dazu.</p>`;
  return html;
}
function tvSheet() { sheet({ titel: "Film & Fernsehen", id: "tv", inhalt: tvInhalt(), onclose: () => setTimeout(() => { if (!SHEETS.length) render({ halteScroll: true, ohneAnim: true }); }, 250) }); }
function tvHeuteHTML() {
  tvAufraeumen(); const h = heute(), heuteTv = (S.tvMerk || []).filter(m => m.datum === h);
  if (!heuteTv.length) return "";
  return `<section class="abschnitt"><div class="bogen streifen k-geist"><h3>Heute im Fernsehen</h3>${heuteTv.map(m => `<p style="margin:4px 0"><span style="font-weight:700">${esc(m.zeit || "")} · ${esc(m.sender || "")}</span> – ${esc(m.titel)}</p>`).join("")}<button class="knopf klein leise" data-act="tv-auf">Mehr Tipps</button></div></section>`;
}
function tvAktion(a, d) {
  switch (a) {
    case "tv-auf": tvSheet(); return;
    case "tv-tab": TV_TAB = d.v; sheetInhalt(tvInhalt()); return;
    case "tv-genre": TV_GENRE = d.v; sheetInhalt(tvInhalt()); return;
    case "tv-merk": { const T = tvDaten(), x = [...(T.fernsehen || []), ...(T.mediathek || [])].find(y => tvId(y) === d.id); if (x) { S.tvMerk = S.tvMerk || []; S.tvMerk.push({ ...x, id: d.id, gemerkt: heute() }); speichern(); haptik("auswahl"); toast(x.datum ? `Gemerkt: ${x.titel}\n${tvKurzDatum(x.datum)}, ${x.zeit} Uhr, ${x.sender}. Die App erinnert dich am Tag.` : `Gemerkt: ${x.titel}`); } sheetInhalt(tvInhalt()); return; }
    case "tv-weg": S.tvMerk = (S.tvMerk || []).filter(m => m.id !== d.id); speichern(); sheetInhalt(tvInhalt()); return;
  }
}
