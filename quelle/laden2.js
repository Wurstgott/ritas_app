/* ============================================================
   Laden-Lektorat (22.10.): Schaufenster der Woche (immer etwas Neues, wiederkaufbar),
   „Bald im Laden“, Regal „Aus Halle“ (Einlösen per WhatsApp, Postkarte jeden Monat),
   Kartenrücken für die Patience.
   Zustand: S.halle = { verlauf: [{ id, kauf, eingeloest }] } · S.schaufenster = { kaeufe: {id: n}, tag: {id: "JJJJ-MM-TT"} } · S.spiel.ruecken
   ============================================================ */

/* ---------- Migration (aus skinsMigrieren aufgerufen) ---------- */
function laden2Migrieren() {
  const h = skObj(S.halle);
  S.halle = { verlauf: Array.isArray(h.verlauf) ? h.verlauf.filter(v => v && typeof v.id === "string" && typeof v.kauf === "string" && typeof v.eingeloest === "string") : [] };
  const sf = skObj(S.schaufenster);
  S.schaufenster = { kaeufe: skObj(sf.kaeufe), tag: skObj(sf.tag) };
  if (S.spiel && typeof S.spiel === "object" && typeof S.spiel.ruecken !== "string") S.spiel.ruecken = (S.gekauft || {}).rueckenmotiv ? "rueckenmotiv" : "";
}
const l2Datum = tag => { const d = tagDatum(tag); return `${d.getDate()}. ${MONAT[d.getMonth()]} ${d.getFullYear()}`; };

/* ============================================================
   Aus Halle: kleine echte Überraschungen per Post – nie ein Treffen
   ============================================================ */
function halleVerlauf(id) { return ((S.halle && S.halle.verlauf) || []).filter(v => v.id === id); }
/* gekauft und schon eingelöst? (für Waren, die man nur einmal kauft) */
function halleEingeloest(id) { const k = (S.gekauft || {})[id]; if (!k) return ""; const v = halleVerlauf(id).filter(x => x.kauf === k).pop(); return v ? v.eingeloest : ""; }
/* Postkarte: höchstens eine im Monat. Liefert das Datum, ab dem die nächste geht – oder "" */
function halleGesperrt(x) {
  if (!x.jedenMonat || (S.gekauft || {})[x.id]) return "";
  const m = skMonat(); if (!halleVerlauf(x.id).some(v => v.kauf.slice(0, 7) === m)) return "";
  const d = jetzt(), n = new Date(d.getFullYear(), d.getMonth() + 1, 1, 12); return `1.\u00a0${MONAT[n.getMonth()]}`;
}
/* Schild auf der Kachel im Regal */
function halleSchild(x, t) {
  const hat = (S.gekauft || {})[x.id], ein = halleEingeloest(x.id), sperre = halleGesperrt(x);
  if (hat && ein) return `<span class="ks-hat">${ic("haken")} Eingelöst</span>`;
  if (hat) return `<span class="ks-hat">${ic("haken")} Gehört dir</span>`;
  if (sperre) return `<span class="klein halle-ab">Nächste ab ${esc(sperre)}</span>`;
  return "";
}
/* Waren-Blatt: Einlösen, Eingelöst-Vermerk, Monatsgrenze. null = normal kaufen */
function halleWare(x, t) {
  const g = (D.gutscheine || []).find(y => y.id === x.id) || x, hat = (S.gekauft || {})[x.id], ein = halleEingeloest(x.id);
  const alle = halleVerlauf(x.id).filter(v => v.eingeloest);
  const extra = alle.length ? `<p class="klein halle-verlauf">${ic("haken")} Eingelöst am ${alle.slice(-6).map(v => esc(l2Datum(v.eingeloest))).join(", ")}</p>` : "";
  if (hat && !ein) return { extra: extra + `<p class="klein" style="margin-bottom:4px">Das geht an Max:</p><div class="bogen mulde halle-nachricht">${esc(g.nachricht || "")}</div>`,
    fuss: `<div class="stapel"><button class="knopf haupt voll" data-act="sk-einloesen" data-id="${x.id}">${ic("brief")} Einlösen: per WhatsApp an Max</button><p class="klein" style="margin:0;text-align:center">WhatsApp öffnet sich mit dem Text. Dort nur noch auf „Senden“ tippen.</p></div>` };
  if (hat && ein) return { extra, fuss: `<p class="klein" style="margin:0;text-align:center">${ic("haken")} Gehört dir – eingelöst am ${esc(l2Datum(ein))}. Max weiß Bescheid.</p>` };
  const sperre = halleGesperrt(x);
  if (sperre) return { extra, fuss: `<p class="klein" style="margin:0;text-align:center">Diesen Monat ist schon eine Postkarte unterwegs. Die nächste gibt’s ab ${esc(sperre)}.</p>` };
  return { extra, fuss: "" };
}
function halleEinloesen(id) {
  const g = (D.gutscheine || []).find(y => y.id === id), k = (S.gekauft || {})[id]; if (!g || !k) return;
  if (!halleEingeloest(id)) { S.halle.verlauf.push({ id, kauf: typeof k === "string" ? k : heute(), eingeloest: heute() }); if (g.jedenMonat) delete S.gekauft[id]; }
  speichern(); haptik("erfolg");
  try { window.open(`https://wa.me/${MAX_WA}?text=${encodeURIComponent(g.nachricht)}`, "_blank"); } catch (e) { }
  const sh = aktuellesSheet(); if (sh && sh.dataset.id === "ware") { sheetZu(); setTimeout(() => { const l = aktuellesSheet(); if (l && l.dataset.id === "laden") sheetInhalt(ladenInhalt()); wareSheet(id); }, 240); }
  toast(`Eingelöst am ${l2Datum(heute())}. Max weiß Bescheid.${g.jedenMonat ? "\nDie nächste Postkarte gibt’s im nächsten Monat." : ""}`, { erfolg: true });
}

/* ============================================================
   Kartenrücken für die Patience
   ============================================================ */
const RUECKEN = { rueckenmotiv: { kl: " r-zapfen", name: "Kiefernzapfen" }, rueckendala: { kl: " r-dala", name: "Dalapferd" } };
function rueckenKlasse() { const r = S.spiel && S.spiel.ruecken; return r && RUECKEN[r] && (S.gekauft || {})[r] ? RUECKEN[r].kl : ""; }
function rueckenFuss(id) {
  const an = S.spiel && S.spiel.ruecken === id;
  return `<div class="stapel">${an ? `<p class="klein" style="margin:0;text-align:center">${ic("haken")} Gehört dir – liegt gerade auf den Karten.</p><button class="knopf zweit voll" data-act="spiel">Patience spielen</button><button class="knopf leise voll" data-act="sk-ruecken" data-v="">Wieder die schlichten Karten</button>`
    : `<button class="knopf haupt voll" data-act="sk-ruecken" data-v="${id}">Auf die Karten legen</button>`}</div>`;
}
function rueckenSetzen(id) {
  if (id && !(S.gekauft || {})[id]) return;
  S.spiel.ruecken = id; speichern(); haptik("auswahl");
  const sh = aktuellesSheet(), w = sh && sh.dataset.ware; if (w) { sheetZu(); setTimeout(() => wareSheet(w), 240); }
  toast(id ? `Die Patience-Karten haben jetzt ${RUECKEN[id].name} auf dem Rücken.` : "Die Karten sind wieder schlicht.");
}
/* Nach einem Kauf im Laden (main.js, kaufen-ja) */
function nachLadenKauf(x) {
  if (RUECKEN[x.id] && S.spiel) { S.spiel.ruecken = x.id; speichern(); }
  window._letzteWare = x.id;
}

/* ============================================================
   Schaufenster der Woche: jede Woche ein kleines Ereignis fürs Bild,
   beliebig oft zu haben. Kein Zufall beim Kaufen – man sieht vorher, was es ist.
   ============================================================ */
const SF = [
  { id: "sf-ballon", name: "Heißluftballon über dem Forst", preis: 30, m: [4, 5, 6, 7, 8, 9, 10], text: "Ein bunter Ballon schwebt einmal quer übers Bild. Hühnchen winkt. Der Ballon hat zu tun.", satz: "Ich hab gewinkt! Die haben zurückgewinkt. Glaub ich." },
  { id: "sf-laternen", name: "Laternenumzug", preis: 30, m: [10, 11], text: "Kleine Laternen ziehen den Weg entlang. Hühnchen läuft vorneweg und singt. Den Text kann es nicht.", satz: "Laterne, Laterne … wie ging’s weiter? Egal, ich sing einfach." },
  { id: "sf-drachen", name: "Drachen steigen lassen", preis: 25, m: [9, 10, 11], text: "Ein roter Drachen tanzt über der Wiese. Wer ihn hält, verrät Hühnchen nicht.", satz: "Ich halt die Schnur. Also, ich guck, wer sie hält." },
  { id: "sf-kraniche", name: "Kraniche bestellen", preis: 25, m: [3, 10], text: "Ein ganzer Zug Kraniche über dem Haus. Laut, pünktlich, auf Bestellung.", satz: "Bestellt und geliefert. Ich hab nachgezählt: alle da." },
  { id: "sf-seifen", name: "Seifenblasen-Nachmittag", preis: 25, m: [4, 5, 6, 7, 8, 9], text: "Hühnchen pustet Seifenblasen übers ganze Bild. Fangen ist erlaubt.", satz: "Die große war meine. Jetzt ist sie weg. Typisch." },
  { id: "sf-regenbogen", name: "Regenbogen", preis: 25, m: [3, 4, 5, 6, 7, 8, 9], text: "Ein Regenbogen über dem Forst, ganz ohne Regen vorher.", satz: "Am Ende liegt ein Topf Gold. Ich geh mal gucken." },
  { id: "sf-sternschnuppen", name: "Sternschnuppen", preis: 30, m: [7, 8, 11, 12], text: "Ein paar Sternschnuppen über dem Haus. Wünschen ist erlaubt, verraten nicht.", satz: "Ich hab mir was gewünscht. Es hat mit Kuchen zu tun." },
  { id: "sf-schnee", name: "Eine Ladung Schnee", preis: 20, m: [11, 12, 1, 2], text: "Dicke Flocken, nur fürs Bild. Draußen bleibt alles, wie es ist.", satz: "Schnee! Ich hab einen gefangen. Er war kalt." },
  { id: "sf-feuerwerk", name: "Feuerwerk über Spandau", preis: 40, m: [12, 1], text: "Ein kleines Feuerwerk über dem Haus, so oft du willst. Ohne Knallerei.", satz: "Oooh. Und ganz ohne Krach. So mag ich das." },
  { id: "sf-polarlicht", name: "Polarlicht", preis: 35, m: [11, 12, 1, 2, 3], text: "Grünes Licht über den Kiefern. In Schweden heißt es norrsken. In Spandau heißt es: Hast du das gesehen?", satz: "Hast du das gesehen? Das war norrsken. Sagt Karin." }
];
function sfFuer(tag) { const m = tagDatum(tag).getMonth() + 1, k = SF.filter(e => e.m.includes(m)), p = k.length ? k : SF; return p[hash32("fenster" + kwVon(tag)) % p.length]; }
function sfDieseWoche() { return sfFuer(heute()); }
const SF_BILD = {
  "sf-ballon": `<rect width="64" height="64" fill="#BFDCEA"/><ellipse cx="32" cy="24" rx="15" ry="17" fill="#E0558A"/><path d="M24 10q-4 14 3 31M32 7v34M40 10q4 14-3 31" stroke="#F2C33A" stroke-width="3.4" fill="none"/><path d="M21 34l7 11h8l7-11Z" fill="#E0558A"/><path d="M28 45l1 5M36 45l-1 5" stroke="#6B4A30"/><rect x="27" y="50" width="10" height="7" rx="1" fill="#A0703F"/>`,
  "sf-laternen": `<rect width="64" height="64" fill="#2C3A5A"/><path d="M0 52h64v12H0Z" fill="#3E4E3A"/>${[[14, 34, "#F2A33A"], [32, 28, "#E0558A"], [50, 34, "#F2D27A"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}" opacity=".22"/><path d="M${x} ${y - 14}v6" stroke="#6B4A30" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="6.6" fill="${c}"/><path d="M${x - 6.6} ${y}h13.2" stroke="#FFF3C8" stroke-width="1" opacity=".7"/>`).join("")}`,
  "sf-drachen": `<rect width="64" height="64" fill="#CFE3EC"/><path d="M0 54q32-8 64 0v10H0Z" fill="#A7BF7A"/><path d="M38 8l10 12-10 14-10-14Z" fill="#C8363A"/><path d="M38 8v26M28 20h20" stroke="#F2D27A" stroke-width="1.4"/><path d="M38 34q-4 6 0 10t-2 10" stroke="#3A3A40" stroke-width="1" fill="none"/>${[38, 44, 50].map((y, i) => `<path d="M${36 + i} ${y}l-3-2v4Zl3-2v4Z" fill="#F2C33A"/>`).join("")}<path d="M38 34L8 62" stroke="#3A3A40" stroke-width=".8"/>`,
  "sf-kraniche": `<rect width="64" height="64" fill="#E6DCC6"/>${[[16, 26], [26, 20], [36, 14], [26, 32], [36, 38], [46, 44]].map(([x, y]) => `<path d="M${x - 6} ${y + 2}q3-4 6 0q3-4 6 0" stroke="#3A3A40" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join("")}`,
  "sf-seifen": `<rect width="64" height="64" fill="#D8ECF2"/>${[[20, 22, 10], [42, 18, 7], [36, 40, 12], [14, 46, 5], [52, 36, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.35)" stroke="#8FB8C8" stroke-width="1.4"/><path d="M${x - r * .5} ${y - r * .4}a${r * .6} ${r * .6} 0 0 1 ${r * .5}-${r * .3}" stroke="#fff" stroke-width="1.4" fill="none"/>`).join("")}`,
  "sf-regenbogen": `<rect width="64" height="64" fill="#DCEBF2"/>${["#D9473A", "#E8902E", "#F2C33A", "#5BA35A", "#3E7FB8", "#6B4FA0"].map((c, i) => `<path d="M${6 + i * 3.4} 56a${26 - i * 3.4} ${26 - i * 3.4} 0 0 1 ${52 - i * 6.8} 0" stroke="${c}" stroke-width="3.4" fill="none"/>`).join("")}`,
  "sf-sternschnuppen": `<rect width="64" height="64" fill="#1E2A4A"/><path d="M10 14l26 14M22 8l24 12M30 30l20 10" stroke="#FFF6DC" stroke-width="1.4" opacity=".55"/><g fill="#FFF6DC"><circle cx="36" cy="28" r="2.4"/><circle cx="46" cy="20" r="2"/><circle cx="50" cy="40" r="2"/><circle cx="10" cy="44" r=".9"/><circle cx="22" cy="54" r=".9"/><circle cx="56" cy="8" r=".9"/></g>`,
  "sf-schnee": `<rect width="64" height="64" fill="#C9D6DE"/><g stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"><path d="M32 14v36M16.4 23l31.2 18M16.4 41l31.2-18"/><path d="M27 17l5 5 5-5M27 47l5-5 5 5" fill="none"/></g>`,
  "sf-feuerwerk": `<rect width="64" height="64" fill="#1E2A4A"/>${[[22, 24, "#F2C36B"], [44, 30, "#E0558A"], [32, 46, "#8FD0F0"]].map(([x, y, c]) => `<g stroke="${c}" stroke-width="1.8" stroke-linecap="round">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return `<path d="M${(x + Math.cos(a) * 4).toFixed(1)} ${(y + Math.sin(a) * 4).toFixed(1)}L${(x + Math.cos(a) * 10).toFixed(1)} ${(y + Math.sin(a) * 10).toFixed(1)}"/>`; }).join("")}</g>`).join("")}`,
  "sf-polarlicht": `<rect width="64" height="64" fill="#16223A"/><path d="M0 30q16-14 32-4t32-6v18q-16 10-32 2T0 44Z" fill="#4FD08A" opacity=".55"/><path d="M0 22q16-10 32-2t32-8v8q-16 8-32 2T0 30Z" fill="#7FE0C0" opacity=".35"/><path d="M0 64V52l8-10 8 10 6-8 8 10 8-12 8 12 6-8 12 8v10Z" fill="#0E1A14"/>`
};
function sfBild(e, gr = 64) { return `<svg class="ware-svg sf-svg" viewBox="0 0 64 64" width="${gr}" height="${gr}" aria-hidden="true"><defs><clipPath id="sfc-${e.id}-${gr}"><rect width="64" height="64" rx="8"/></clipPath></defs><g clip-path="url(#sfc-${e.id}-${gr})">${SF_BILD[e.id] || ""}</g></svg>`; }
function sfRegal() {
  const e = sfDieseWoche(), t = talerStand(), naechste = sfFuer(tagPlus(heute(), 7)), n = (S.schaufenster && S.schaufenster.kaeufe[e.id]) || 0;
  return `<section class="laden-abt" id="abt-fenster"><h3 class="abt-schild">${ic("stern")} Schaufenster der Woche</h3>
    <button class="schaufenster" data-act="sf-auf"><span class="sf-glas">${sfBild(e, 84)}</span><span class="sf-text"><span class="ware-name">${esc(e.name)}</span><span class="klein">Passiert einmal im Bild – und gibt’s immer wieder.${n ? ` Schon ${n === 1 ? "einmal" : n + "-mal"} bestellt.` : ""}</span><span class="preis-schild${t >= e.preis ? " geht" : ""}">${MUENZE()}${e.preis}</span></span></button>
    <p class="klein sf-naechste">${naechste.id === e.id ? "Bleibt auch nächste Woche im Fenster." : `Nächste Woche im Fenster: ${esc(naechste.name)}.`}</p></section>`;
}
function sfSheet() {
  const e = sfDieseWoche(), t = talerStand(), heuteSchon = S.schaufenster.tag[e.id] === heute();
  const fuss = `<div class="stapel">${t >= e.preis ? `<button class="knopf haupt voll" data-act="sf-kaufen" data-id="${e.id}">${MUENZE()} Für ${e.preis} Taler bestellen</button>` : skFortschritt(e.preis, t, "dann geht’s los")}${heuteSchon ? `<button class="knopf zweit voll" data-act="sf-zeigen" data-id="${e.id}">Heute nochmal ansehen – kostet nichts</button>` : ""}</div>`;
  sheet({ titel: "Schaufenster der Woche", id: "fenster", inhalt: `<div class="ware-gross">${sfBild(e, 120)}</div><h3 style="margin:0 0 6px">${esc(e.name)}</h3><p>${esc(e.text)}</p><p class="klein">Zu sehen im Bild unter „Zuhause“. Am selben Tag kannst du es dir so oft ansehen, wie du willst. Jede Woche liegt etwas anderes im Fenster.</p>`, fuss });
}
function sfKaufen(id) {
  const e = SF.find(x => x.id === id); if (!e || e.id !== sfDieseWoche().id || talerStand() < e.preis) return;
  S.taler -= e.preis; S.talerAusgegeben = (S.talerAusgegeben || 0) + e.preis;
  S.schaufenster.kaeufe[id] = (S.schaufenster.kaeufe[id] || 0) + 1; S.schaufenster.tag[id] = heute();
  speichern(); haptik("erfolg"); try { ton("erfolg"); } catch (x) { }
  sfAbspielen(id);
}
/* ins Bild wechseln und abspielen */
function sfAbspielen(id) {
  const e = SF.find(x => x.id === id); if (!e) return;
  alleSheetsZu();
  setTimeout(() => {
    if (TAB !== "lichtung") { TAB = "lichtung"; render(); }
    setTimeout(() => { const b = document.getElementById("buehne-gross"); if (b) b.scrollIntoView({ block: "center", behavior: REDUCED() ? "auto" : "smooth" }); setTimeout(() => sfStart(e), REDUCED() ? 100 : 650); }, 120);
  }, 280);
}
function sfStart(e) {
  if (typeof FX === "undefined" || !FX.cv || !FX.geo || !FX.cv.isConnected) { toast(`${e.name}: zu sehen im Bild unter „Zuhause“.`); return; }
  const mal = SF_MAL[e.id]; if (!mal) return;
  FX.anim = FX.anim.filter(x => !String(x.id).startsWith("sf-"));
  FX.anim.push({ id: e.id, t0: performance.now(), dauer: e.id === "sf-feuerwerk" ? 10000 : 9000, P: [0, 0], mal: (g, t, P, k) => { try { mal(g, REDUCED() ? .5 : t, k, REDUCED() ? 1 : clamp(Math.min(t * 7, (1 - t) * 7), 0, 1)); } catch (x) { } } });
  if (FX.raf) { cancelAnimationFrame(FX.raf); FX.raf = 0; } fxLos();
  if (S.huhn) setTimeout(() => { try { const G = FX.geo; fxBlase({ id: e.id, blase: "oben", dauer: 6000, anker: () => [(FX.w / 2 - G.ox) / G.sk, (FX.h * .66 - G.oy) / G.sk] }, { text: e.satz, wer: "huhn" }, 0); } catch (x) { } }, REDUCED() ? 200 : 2200);
}
/* Zeichnungen auf der Effekt-Ebene: g = Canvas, t = 0…1, k = Maßstab, a = Ein-/Ausblenden */
const SF_MAL = {
  "sf-ballon"(g, t, k, a) {
    const W = FX.w, H = FX.h, x = -60 * k + t * (W + 120 * k), y = H * .2 + Math.sin(t * 9) * 6 * k, R = 20 * k;
    g.save(); g.globalAlpha = a;
    g.strokeStyle = "#6B4A30"; g.lineWidth = .8 * k; g.beginPath(); g.moveTo(x - R * .5, y + R * .9); g.lineTo(x - R * .22, y + R * 1.5); g.moveTo(x + R * .5, y + R * .9); g.lineTo(x + R * .22, y + R * 1.5); g.stroke();
    g.fillStyle = "#A0703F"; g.fillRect(x - R * .26, y + R * 1.5, R * .52, R * .38);
    g.beginPath(); g.ellipse(x, y, R * .86, R, 0, 0, TAU); g.moveTo(x - R * .62, y + R * .7); g.lineTo(x - R * .3, y + R * 1.12); g.lineTo(x + R * .3, y + R * 1.12); g.lineTo(x + R * .62, y + R * .7); g.fillStyle = "#E0558A"; g.fill();
    g.save(); g.beginPath(); g.ellipse(x, y, R * .86, R, 0, 0, TAU); g.clip(); g.fillStyle = "#F2C33A"; for (const o of [-.5, .1]) g.fillRect(x + o * R, y - R, R * .3, R * 2.2); g.restore();
    g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.ellipse(x - R * .38, y - R * .4, R * .16, R * .34, -.3, 0, TAU); g.fill(); g.restore();
  },
  "sf-laternen"(g, t, k, a) {
    const W = FX.w, H = FX.h, y0 = H * .8, f = ["#F2A33A", "#E0558A", "#F2D27A", "#E8902E", "#C9E07A", "#F2A33A", "#8FD0F0"];
    g.save(); g.globalAlpha = a * .25; g.fillStyle = "#1E2A4A"; g.fillRect(0, 0, W, H); g.restore();
    for (let i = 0; i < 7; i++) { const x = -40 * k - i * 36 * k + t * (W + 300 * k), y = y0 - (i % 2) * 6 * k + Math.sin(t * 50 + i) * 1.6 * k; if (x < -30 || x > W + 30) continue;
      g.save(); g.globalAlpha = a; const gr = g.createRadialGradient(x, y, 0, x, y, 22 * k); gr.addColorStop(0, "rgba(255,230,160,.6)"); gr.addColorStop(1, "rgba(255,230,160,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 22 * k, 0, TAU); g.fill();
      g.strokeStyle = "#5A4630"; g.lineWidth = 1.2 * k; g.beginPath(); g.moveTo(x, y - 7 * k); g.lineTo(x - 4 * k, y - 20 * k); g.stroke();
      g.fillStyle = f[i]; g.beginPath(); g.arc(x, y, 6.4 * k, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,.45)"; g.fillRect(x - 6.4 * k, y - .6 * k, 12.8 * k, 1.2 * k); g.restore(); }
  },
  "sf-drachen"(g, t, k, a) {
    const W = FX.w, H = FX.h, x = W * .58 + Math.sin(t * TAU * 1.4) * W * .16, y = H * .2 + Math.sin(t * TAU * 2.8) * H * .05, s = 13 * k, r = Math.sin(t * TAU * 2) * .25;
    g.save(); g.globalAlpha = a; g.strokeStyle = "rgba(40,40,46,.7)"; g.lineWidth = .8 * k; g.beginPath(); g.moveTo(x, y + s * 1.2); g.quadraticCurveTo(W * .4, H * .6, W * .18, H * 1.02); g.stroke();
    g.beginPath(); g.moveTo(x, y + s * 1.2); for (let i = 1; i <= 5; i++) g.lineTo(x + Math.sin(t * 30 + i) * 5 * k, y + s * 1.2 + i * 7 * k); g.stroke();
    for (let i = 1; i <= 4; i++) { const bx = x + Math.sin(t * 30 + i) * 5 * k, by = y + s * 1.2 + i * 8 * k; g.fillStyle = i % 2 ? "#F2C33A" : "#3E7FB8"; g.beginPath(); g.moveTo(bx - 3 * k, by - 2 * k); g.lineTo(bx + 3 * k, by + 2 * k); g.lineTo(bx + 3 * k, by - 2 * k); g.lineTo(bx - 3 * k, by + 2 * k); g.fill(); }
    g.translate(x, y); g.rotate(r); g.fillStyle = "#C8363A"; g.beginPath(); g.moveTo(0, -s); g.lineTo(s * .8, 0); g.lineTo(0, s * 1.2); g.lineTo(-s * .8, 0); g.closePath(); g.fill();
    g.strokeStyle = "#F2D27A"; g.lineWidth = 1.2 * k; g.beginPath(); g.moveTo(0, -s); g.lineTo(0, s * 1.2); g.moveTo(-s * .8, 0); g.lineTo(s * .8, 0); g.stroke(); g.restore();
  },
  "sf-kraniche"(g, t, k, a) { if (typeof SPIEL_ANIM === "undefined" || !SPIEL_ANIM.kraniche) return; g.save(); g.globalAlpha = a; SPIEL_ANIM.kraniche(g, t, [0, FX.h * .16], k * 1.2); SPIEL_ANIM.kraniche(g, Math.min(1, t * 1.15), [0, FX.h * .26], k); g.restore(); },
  "sf-seifen"(g, t, k, a) {
    const W = FX.w, H = FX.h; g.save(); g.globalAlpha = a;
    for (let i = 0; i < 20; i++) { const ph = (i * 37 % 100) / 100, x = W * ((i * 53 % 100) / 100) + Math.sin(t * 12 + i) * 10 * k, y = H * 1.05 - ((t * 1.3 + ph) % 1.25) * H, r = (5 + (i % 5) * 2.4) * k;
      g.fillStyle = "rgba(200,230,255,.16)"; g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.2 * k; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.stroke();
      g.strokeStyle = "rgba(255,190,230,.6)"; g.beginPath(); g.arc(x, y, r * .7, 3.6, 4.6); g.stroke(); }
    g.restore();
  },
  "sf-regenbogen"(g, t, k, a) {
    const W = FX.w, H = FX.h, cx = W * .5, cy = H * .92, R = Math.max(W, H) * .62, b = 6 * k; g.save(); g.globalAlpha = a * .5; g.lineWidth = b;
    ["#D9473A", "#E8902E", "#F2C33A", "#5BA35A", "#3E7FB8", "#6B4FA0"].forEach((c, i) => { g.strokeStyle = c; g.beginPath(); g.arc(cx, cy, R - i * b, Math.PI, TAU); g.stroke(); }); g.restore();
  },
  "sf-sternschnuppen"(g, t, k, a) {
    const W = FX.w, H = FX.h; g.save(); const gr = g.createLinearGradient(0, 0, 0, H * .7); gr.addColorStop(0, `rgba(18,26,52,${.7 * a})`); gr.addColorStop(1, "rgba(18,26,52,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H * .7);
    g.fillStyle = `rgba(255,246,220,${.8 * a})`; for (let i = 0; i < 24; i++) { g.beginPath(); g.arc(W * ((i * 61 % 100) / 100), H * .5 * ((i * 29 % 100) / 100), (i % 3 ? .8 : 1.3) * k, 0, TAU); g.fill(); }
    for (let i = 0; i < 6; i++) { const p = t * 6 - i * .85; if (p < 0 || p > 1) continue; const x = W * (.12 + .14 * i), y = H * (.06 + .05 * (i % 3)), hx = x + p * 90 * k, hy = y + p * 42 * k;
      const s = g.createLinearGradient(hx - 46 * k, hy - 21 * k, hx, hy); s.addColorStop(0, "rgba(255,246,220,0)"); s.addColorStop(1, `rgba(255,246,220,${(1 - p) * a})`); g.strokeStyle = s; g.lineWidth = 2 * k; g.beginPath(); g.moveTo(hx - 46 * k, hy - 21 * k); g.lineTo(hx, hy); g.stroke(); }
    g.restore();
  },
  "sf-schnee"(g, t, k, a) {
    const W = FX.w, H = FX.h; g.save(); g.fillStyle = `rgba(255,255,255,${.92 * a})`;
    for (let i = 0; i < 80; i++) { const ph = (i * 41 % 100) / 100, x = W * ((i * 67 % 100) / 100) + Math.sin(t * 8 + i) * 9 * k, y = ((t * 1.6 + ph) % 1.1) * H - 10, r = (1.6 + (i % 4) * .7) * k; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
    g.restore();
  },
  "sf-feuerwerk"(g, t, k, a) {
    const W = FX.w, H = FX.h; g.save(); g.fillStyle = `rgba(18,26,52,${.45 * a})`; g.fillRect(0, 0, W, H * .6);
    const c = ["#F2C36B", "#E0558A", "#8FD0F0", "#9BE07A", "#F2C36B", "#E0558A", "#8FD0F0", "#F2D27A"];
    for (let i = 0; i < 8; i++) { const p = (t - i * .1) / .32; if (p < 0 || p > 1) continue; const x = W * (.15 + ((i * 37) % 70) / 100), y = H * (.1 + (i % 3) * .07);
      g.globalAlpha = (1 - p) * a; g.fillStyle = c[i]; for (let j = 0; j < 18; j++) { const w = j / 18 * TAU; g.beginPath(); g.arc(x + Math.cos(w) * p * 42 * k, y + Math.sin(w) * p * 42 * k + p * p * 12 * k, 1.8 * k, 0, TAU); g.fill(); } }
    g.restore();
  },
  "sf-polarlicht"(g, t, k, a) {
    const W = FX.w, H = FX.h; g.save(); const d = g.createLinearGradient(0, 0, 0, H * .65); d.addColorStop(0, `rgba(14,22,40,${.75 * a})`); d.addColorStop(1, "rgba(14,22,40,0)"); g.fillStyle = d; g.fillRect(0, 0, W, H * .65);
    for (let j = 0; j < 3; j++) for (let x = 0; x <= W; x += 5) { const y = H * (.1 + j * .06) + Math.sin(x / W * TAU * 1.3 + t * 5 + j * 1.7) * 14 * k, l = (50 + j * 10) * k;
      const s = g.createLinearGradient(x, y, x, y + l); s.addColorStop(0, `rgba(${j === 1 ? "127,224,192" : "79,208,138"},${(.38 - j * .08) * a})`); s.addColorStop(1, "rgba(79,208,138,0)"); g.strokeStyle = s; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + l); g.stroke(); }
    g.restore();
  }
};

/* ============================================================
   Bald im Laden: was als Nächstes kommt (Vorfreude, kein Druck)
   ============================================================ */
function baldRegal() {
  const bald = D_SKINS.filter(s => s.preis && !skinDa(s)).sort((a, b) => a.ab < b.ab ? -1 : a.ab > b.ab ? 1 : 0).slice(0, 4);
  if (!bald.length) return "";
  return `<section class="laden-abt" id="abt-bald"><h3 class="abt-schild">${ic("uhr")} Bald im Laden</h3>${S.huhn ? `<p class="laden-huhn">${huhnSVG({ gr: 40, kopf: true })}<span><span class="wer">Hühnchen</span> Hinten im Lager rumpelt’s. Mehr darf ich nicht verraten.</span></p>` : ""}
    <div class="regal">${bald.map(s => `<div class="ware-kachel bald-kachel"><span class="ware-bild">${figurMini(s.fuer, s.id, 64)}</span><span class="ware-name">${esc(s.name)}</span><span class="klein">${s.fuer === "huhn" ? "für Hühnchen · " : ""}ab ${MONAT[Number(s.ab.slice(5)) - 1]}${s.ab.slice(0, 4) !== String(jetzt().getFullYear()) ? " " + s.ab.slice(0, 4) : ""}</span></div>`).join("")}</div><div class="regal-brett" aria-hidden="true"></div></section>`;
}

/* ---------- Klicks ---------- */
document.addEventListener("click", ev => {
  const el = ev.target.closest && ev.target.closest("[data-act^='sf-']"); if (!el || el.disabled) return;
  try {
    const a = el.dataset.act;
    if (a === "sf-auf") sfSheet();
    else if (a === "sf-kaufen") sfKaufen(el.dataset.id);
    else if (a === "sf-zeigen") sfAbspielen(el.dataset.id);
  } catch (e) { console.warn(e); }
});
