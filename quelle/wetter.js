/* ============================================================
   Wetter im Spandauer Forst (Open-Meteo, ohne Konto): Antippen von
   Sonne/Mond auf „Heute“. Plus Wege zur eigenen Wetter-App.
   ============================================================ */
const WETTER_ORT = { lat: 52.566, lon: 13.165, name: "Spandauer Forst" };
function wetterArt(c) { return c <= 1 ? "klar" : c <= 3 || c === 45 || c === 48 ? "wolkig" : (c >= 71 && c <= 77) || c === 85 || c === 86 ? "schnee" : "regen"; }
const WETTER_TEXT = { 0: "Klarer Himmel", 1: "Überwiegend klar", 2: "Teils bewölkt", 3: "Bedeckt", 45: "Nebel", 48: "Raureif-Nebel", 51: "Leichter Nieselregen", 53: "Nieselregen", 55: "Starker Nieselregen", 61: "Leichter Regen", 63: "Regen", 65: "Starker Regen", 66: "Gefrierender Regen", 67: "Gefrierender Regen", 71: "Leichter Schneefall", 73: "Schneefall", 75: "Starker Schneefall", 77: "Schneegriesel", 80: "Regenschauer", 81: "Regenschauer", 82: "Heftige Schauer", 85: "Schneeschauer", 86: "Schneeschauer", 95: "Gewitter", 96: "Gewitter mit Hagel", 99: "Gewitter mit Hagel" };
function wetterLaden(erzwingen) {
  if (!erzwingen && S.wetter && Date.now() - S.wetter.zeit < 30 * 60e3) return Promise.resolve(S.wetter);
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${WETTER_ORT.lat}&longitude=${WETTER_ORT.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,sunrise,sunset&timezone=Europe%2FBerlin&forecast_days=3`;
  return fetch(u).then(r => r.ok ? r.json() : null).then(j => {
    if (!j || !j.current) return null;
    S.wetter = { zeit: Math.min(Date.now(), Date.parse(j.current.time) || Date.now()), geladen: Date.now(), temp: j.current.temperature_2m, gefuehlt: j.current.apparent_temperature, feuchte: j.current.relative_humidity_2m, code: j.current.weather_code, wind: j.current.wind_speed_10m,
      tage: (j.daily.time || []).map((t, i) => ({ t, max: j.daily.temperature_2m_max[i], min: j.daily.temperature_2m_min[i], regen: j.daily.precipitation_probability_max[i], code: j.daily.weather_code[i], auf: j.daily.sunrise[i], unter: j.daily.sunset[i] })) };
    speichern(); return S.wetter;
  }).catch(() => null);
}
function wetterTipp(W) {
  const t = W.temp, c = W.code;
  if (wetterArt(c) === "regen") return "Regenwetter: gut für ein Kapitel, einen Tee – oder mit Schirm eine kleine Runde, danach schmeckt der Tee doppelt.";
  if (wetterArt(c) === "schnee") return "Schnee! Der Forst sieht aus wie gepudert.";
  if (t < 3) return "Richtig kalt: Schal vor Mund und Nase, dann atmet sich die Kälte leichter.";
  if (t > 26) return "Warm heute: viel trinken, und raus lieber am Morgen oder Abend.";
  if (c <= 1) return "Schönes Wetter für eine Runde im Forst – oder eine Bank in der Sonne.";
  return "Ein ganz normaler Tag zum Draußensein. Jacke mit, dann passt’s.";
}
function wetterInhalt() {
  const W = S.wetter;
  const links = `<h3 style="margin-top:18px">Mit deiner Wetter-App</h3><p class="klein" style="margin-top:0">Ritas App kann nicht direkt in andere Apps hineinschauen. Aber mit einem Tipp bist du drüben:</p>
    <div class="stapel"><a class="knopf zweit voll" href="https://www.dwd.de/DE/wetter/wetterundklima_vorort/berlin_brandenburg/berlin_brandenburg_node.html" target="_blank" rel="noopener">Deutscher Wetterdienst: Berlin ↗</a><a class="knopf zweit voll" href="https://play.google.com/store/apps/details?id=de.dwd.warnapp" target="_blank" rel="noopener">WarnWetter-App (DWD) im Play Store ↗</a><a class="knopf leise voll" href="https://www.google.com/search?q=wetter+spandau" target="_blank" rel="noopener">Google-Wetter für Spandau ↗</a></div>
    <p class="klein">Tipp: Das Wetter-Widget lässt sich auch direkt auf den Startbildschirm legen – lange auf eine freie Stelle drücken → „Widgets“ → „Wetter“.</p>`;
  if (!W) return `${wetterKopf()}<p>${WETTER_LAEDT ? "Das Wetter wird gerade geladen …" : "Das Wetter lässt sich gerade nicht laden – vielleicht kein Internet."}</p>${links}`;
  // „Heute/Morgen“ nach Datum, nicht nach Position – ein alter Stand zeigt keine vergangenen Tage
  const tage = (W.tage || []).filter(d => d.t >= heute()).map(d => `<div class="wetter-tag"><span style="font-weight:700">${d.t === heute() ? "Heute" : d.t === tagPlus(heute(), 1) ? "Morgen" : datumLang(d.t).split(",")[0]}</span><span>${esc(WETTER_TEXT[d.code] || "")}</span><span class="zahl">${Math.round(d.min)}° / ${Math.round(d.max)}°</span><span class="klein">${d.regen != null ? `Regen ${d.regen} %` : ""}</span></div>`).join("");
  const h0 = (W.tage || []).find(d => d.t === heute());
  return `${wetterKopf()}<div class="wetter-jetzt"><span class="wetter-grad zahl">${Math.round(W.temp)}°</span><div><p style="margin:0;font-weight:700">${esc(WETTER_TEXT[W.code] || "")}</p><p class="klein" style="margin:2px 0 0">gefühlt ${Math.round(W.gefuehlt)}° · Wind ${Math.round(W.wind)} km/h · Luftfeuchte ${W.feuchte} %</p>${h0 ? `<p class="klein" style="margin:2px 0 0">Sonne ${h0.auf.slice(11)} – ${h0.unter.slice(11)} Uhr</p>` : ""}</div></div>
    <div class="bogen mulde" style="margin-top:12px"><p style="margin:0">${esc(wetterTipp(W))}</p></div>
    <div class="wetter-tage">${tage}</div>
    <p class="klein">Für den ${WETTER_ORT.name} · Daten: Open-Meteo</p>${links}`;
}
function wetterStand(ms) { const d = new Date(ms), t = tagVon(d), uhr = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr"; return t === tagVon(new Date()) ? uhr : t === tagPlus(tagVon(new Date()), -1) ? `gestern, ${uhr}` : `${datumLang(t)}, ${uhr}`; }
/* Kopfzeile im Sheet: „Stand: 14:32“ + Knopf „Aktualisieren“ (mit Lade-Zustand) */
let WETTER_LAEDT = false, WETTER_FEHLER = false;
function wetterKopf() {
  const W = S.wetter, t = W && (W.geladen || W.zeit);
  const stand = t ? `Stand: ${wetterStand(t).replace(" Uhr", "")}` : WETTER_LAEDT ? "Wird geladen …" : "";
  return `<div class="wetter-kopf"><div class="wetter-stand" aria-live="polite"><span class="zahl">${esc(stand)}</span>${!WETTER_LAEDT && WETTER_FEHLER ? `<span class="klein">Gerade kein Internet – das ist der letzte Stand.</span>` : ""}</div>
    <button class="knopf klein zweit wetter-neu${WETTER_LAEDT ? " laedt" : ""}" data-act="wetter-neu" aria-busy="${WETTER_LAEDT}"><span class="wetter-kreis" aria-hidden="true"></span>${WETTER_LAEDT ? "Lädt …" : "Aktualisieren"}</button></div>`;
}
function wetterNeuZeigen() { const sh = aktuellesSheet(); if (sh && sh.dataset.id === "wetter") sheetInhalt(wetterInhalt()); }
function wetterAktualisieren() {
  if (WETTER_LAEDT) return;
  WETTER_LAEDT = true; WETTER_FEHLER = false; wetterNeuZeigen();
  const t0 = Date.now();
  wetterLaden(true).then(W => new Promise(r => setTimeout(() => r(W), Math.max(0, 600 - (Date.now() - t0))))).then(W => {
    WETTER_LAEDT = false; WETTER_FEHLER = !W; wetterNeuZeigen();
    if (W) render({ halteScroll: true, ohneAnim: true });
  });
}
function wetterSheet() {
  sheet({ titel: "Wetter", id: "wetter", inhalt: wetterInhalt() });
  wetterAktualisieren();
}
document.addEventListener("click", ev => { const el = ev.target.closest && ev.target.closest("[data-act='wetter-neu']"); if (el) wetterAktualisieren(); });
