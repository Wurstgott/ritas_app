/* ============================================================
   Gut durch den Winter: Tees, Ingwer, Heizen & Lüften, Schutz,
   Besuch (Test-Bitte zum Abschicken), Treffen draußen.
   ============================================================ */
let WI_TAB = "tees";
function winterInhalt() {
  const W = D.winter; if (!W) return "<p>Kommt bald.</p>";
  const tabs = [["tees", "Tees"], ["ingwer", "Ingwer"], ["luft", "Heizen & Lüften"], ["schutz", "Gut geschützt"], ["besuch", "Besuch"], ["draussen", "Draußen treffen"]];
  let h = `<div class="chips" style="margin-bottom:10px">${tabs.map(([v, t]) => chip(WI_TAB === v, t, `data-act="wi-tab" data-v="${v}"`)).join("")}</div>`;
  const liste = arr => arr.map(x => `<div class="bogen"><h3 style="font-size:1.05rem">${esc(x.titel)}</h3><p style="margin:0">${esc(x.text)}</p></div>`).join("");
  if (WI_TAB === "tees") h += W.tees.map((t, i) => `<details class="bogen wi-tee"><summary><span style="font-weight:700">${esc(t.titel)}</span><br><span class="klein">${esc(t.warum || "")}</span></summary><p style="margin:10px 0 4px;font-weight:700">Du brauchst</p><ul style="margin:0 0 8px">${t.zutaten.map(z => `<li>${esc(z)}</li>`).join("")}</ul><p style="margin:0 0 10px">${esc(t.zubereitung)}</p><button class="knopf klein zweit" data-act="timer-start" data-t="getrunken" data-min="10" data-name="${esc(t.titel)}">${ic("uhr")} Ziehzeit-Timer: 10 Min.</button></details>`).join("");
  else if (WI_TAB === "ingwer") h += liste(W.ingwer);
  else if (WI_TAB === "luft") h += liste(W.luft);
  else if (WI_TAB === "schutz") h += liste(W.schutz);
  else if (WI_TAB === "draussen") h += liste(W.draussenTreffen);
  else if (WI_TAB === "besuch") h += `<p>${esc(W.besuch.intro)}</p>` + W.besuch.nachrichten.map((n, i) => `<div class="bogen"><p style="margin:0 0 10px" class="serif">${esc(n)}</p><button class="knopf klein zweit" data-act="wi-kopie" data-i="${i}">${ic("brief")} Verschicken</button></div>`).join("");
  return h;
}
function winterSheet() { sheet({ titel: "Gut durch den Winter", id: "winter", inhalt: winterInhalt() }); }
function winterAktion(a, d) {
  if (a === "wi-auf") { winterSheet(); return; }
  if (a === "wi-tab") { WI_TAB = d.v; sheetInhalt(winterInhalt()); return; }
  if (a === "wi-kopie") { const t = D.winter.besuch.nachrichten[Number(d.i)];
    const ok = () => toast("Kopiert. Jetzt in die Nachricht einfügen (lange drücken → Einfügen).", { erfolg: true });
    if (navigator.share && /Android|iPhone/i.test(navigator.userAgent)) { navigator.share({ text: t }).catch(() => { }); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, () => toast("Kopieren ging nicht – einfach den Text lange drücken und markieren."));
    else toast("Einfach den Text lange drücken und markieren."); }
}
