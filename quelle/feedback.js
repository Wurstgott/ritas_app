/* ============================================================
   Rückmeldung pro Tipp (nach Biotop 4.1)
   Familien: Auswahl · Aktion · Erfolg · Fehler · Navigation · Schalter (+ Taler, Umblättern)
   – EIN delegierter Klick-Handler (capture) erkennt die Familie über data-fb oder die Tabelle FB_FAM.
   – Während eines Tipps sammelt haptik() nur (fbMelde); nach dem Klick gibt fbFertig() GENAU EINE
     Rückmeldung: Vibration, Bild und Ton. Erfolg/Fehler/Stufe aus den Handlern schlagen die Familie.
   – Effekte sind farbneutral (currentColor bzw. --fb-*-Tokens), damit sie jedes Design mitmachen.
   ============================================================ */
const FB_FAM = [
  ["fehler", "[data-fb=fehler],.bald-kachel,[aria-disabled=true]"],
  ["schalter", "[data-fb=schalter],.schalter-zeile,[role=switch]"],
  ["nav", "[data-fb=nav],nav.tabs button,[data-tab]"],
  ["taler", "[data-fb=taler],.taler-plakette,.muenze-knopf"],
  ["blatt", "[data-fb=blatt],[data-act=onb-weiter],[data-act=onb-zurueck],[data-act=ruhe-weiter],[data-act=ruhe-zurueck]"],
  ["auswahl", "[data-fb=auswahl],.chip,.tf,.av-wahl,.av-farbe,.wetter-chip,.ks-teil,.ks-fig,.ks-punkt,.bingo-feld,[aria-pressed],[role=radio],[role=tab]"],
  ["aktion", "[data-fb=aktion],button,a[href],[data-act],summary,.kachel,.liste-zeile,.tuer,.karte:not(.zu),.fach:not(.leer)"]
];
const FB_ALLE = FB_FAM.map(f => f[1]).join(",");
const FB_RANG = { auswahl: 1, aktion: 1, taler: 1, atemaus: 2, achtung: 3, erfolg: 4, stufe: 5 };
const FB_VIB = { fehler: "achtung", auswahl: "auswahl", aktion: "aktion", blatt: "aktion", taler: "taler", nav: null, schalter: null };
let FBTAP = null, FBNACH = null, FB_PUNKT = null;

function fbFamilie(el) {
  if (!el) return null;
  if (el.dataset && el.dataset.fb) return el.dataset.fb;
  for (const [n, s] of FB_FAM) if (el.matches(s)) return n;
  return null;
}
/* aus core.js haptik(): true = „gesammelt bzw. schon erledigt“, nicht sofort vibrieren */
function fbMelde(art) {
  if (FBTAP && !FBTAP.fertig) { FBTAP.arts.push(art); return true; }
  // Nachzügler desselben Tipps (z. B. Antwort der Figur 650 ms später) nicht noch einmal vibrieren lassen
  if (FBNACH && performance.now() < FBNACH.bis && (FB_RANG[art] || 1) <= FBNACH.rang) return true;
  return false;
}
function fbTonMelde() { if (FBTAP && !FBTAP.fertig) FBTAP.toene++; }

function fbGrund(el) { const c = getComputedStyle(el); return { c: c.backgroundColor, i: c.backgroundImage }; }

addEventListener("pointerdown", e => { FB_PUNKT = { x: e.clientX, y: e.clientY, t: performance.now() }; }, { passive: true, capture: true });
/* Fehler-Tipp auf gesperrte (disabled) Knöpfe – die bekommen keinen click */
addEventListener("pointerup", e => {
  const t = e.target; if (!t || !t.closest || performance.now() < abbrechenBis) return;
  const el = t.closest("button[disabled]"); if (!el || !el.matches("[data-act]") || el.closest("nav")) return;
  if (FB_PUNKT && Math.hypot(e.clientX - FB_PUNKT.x, e.clientY - FB_PUNKT.y) > 10) return;
  FBTAP = { el, fam: "fehler", x: e.clientX, y: e.clientY, arts: [], toene: 0, ev: null, alt: null, toast: $(".toast"), fertig: false };
  setTimeout(fbFertig, 0);
}, { passive: true, capture: true });

addEventListener("click", e => {
  if (FBTAP && !FBTAP.fertig) return;                 // Folge-Klick (label → Feld) gehört zum selben Tipp
  const t = e.target; if (!t || !t.closest) return;
  if (t.matches("label.hap")) return;                 // iOS: gleich folgt der Klick aufs Schalter-Feld darin
  const el = t.closest(FB_ALLE);
  let x = e.clientX, y = e.clientY;
  if (!x && !y) {                                     // weitergereichter Klick (label → Feld) oder Tastatur
    const p = FB_PUNKT && performance.now() - FB_PUNKT.t < 1500 ? FB_PUNKT : null;
    if (p && e.detail !== 0 || p && t.closest("label.hap")) { x = p.x; y = p.y; } else x = y = null;
  }
  FBTAP = { el, fam: fbFamilie(el), x, y, arts: [], toene: 0, ev: e, alt: el ? fbGrund(el) : null, toast: $(".toast"), fertig: false };
  setTimeout(fbFertig, 0);
}, true);

function fbFertig() {
  const T = FBTAP; if (!T || T.fertig) return; T.fertig = true;
  const rang = a => FB_RANG[a] || 1;
  const hoch = T.arts.filter(a => rang(a) > 1).sort((a, b) => rang(b) - rang(a))[0];
  // von einer Geste geschluckt (Lupe, langes Drücken, Funkeln im Bild …) und kein Handler hat sich gemeldet
  if (T.ev && T.ev.cancelBubble && !T.arts.length) return;
  if (!T.fam && !T.arts.length) return;
  const art = hoch || (T.fam ? FB_VIB[T.fam] : T.arts[0]) || null;
  if (art) vibriere(art);
  FBNACH = { bis: performance.now() + 1000, rang: art ? rang(art) : 1 };
  const art2 = hoch === "stufe" ? "erfolg" : hoch === "achtung" ? "fehler" : hoch === "erfolg" ? "erfolg" : T.fam;
  if (!REDUCED()) try { fbBild(art2, T); } catch (e) { }
  if (S.ton && !T.toene) try { if (art2 === "erfolg") ton("erfolg"); else fbKlick(art2, T.el); } catch (e) { }
}

/* Das Element nach dem Klick (Handler rendern oft neu): dasselbe, sonst das an derselben Stelle */
function fbLebend(T) {
  if (T.x == null) return T.el && T.el.isConnected ? T.el : null;
  const hier = document.elementFromPoint(T.x, T.y); if (!hier) return null;
  if (T.el && T.el.isConnected && T.el.contains(hier)) return T.el;
  // neu gerendert: dasselbe Element an seinen data-Attributen wiedererkennen (der Umbruch kann sich verschoben haben)
  if (T.el && !T.el.isConnected && T.el.dataset && T.el.dataset.act) {
    const sel = T.el.tagName.toLowerCase() + Object.entries(T.el.dataset).filter(([k]) => k !== "fb").map(([k, v]) => `[data-${k.replace(/[A-Z]/g, c => "-" + c.toLowerCase())}="${CSS.escape(v)}"]`).join("");
    let best = null, bd = 1e9;
    try { for (const k of document.querySelectorAll(sel)) { const r = k.getBoundingClientRect(); if (!r.width) continue; const d = Math.hypot(r.left + r.width / 2 - T.x, r.top + r.height / 2 - T.y); if (d < bd) { bd = d; best = k; } } } catch (e) { }
    if (best && bd < 160) { const oben = document.elementFromPoint(clamp(T.x, best.getBoundingClientRect().left + 1, best.getBoundingClientRect().right - 1), clamp(T.y, best.getBoundingClientRect().top + 1, best.getBoundingClientRect().bottom - 1)); if (oben && best.contains(oben)) return best; }
  }
  const n = hier.closest(FB_ALLE);
  return n && fbFamilie(n) === T.fam ? n : null;
}
function fbBild(art, T) {
  if (art === "erfolg") {
    const neuToast = $(".toast"); if ((neuToast && neuToast !== T.toast && neuToast.querySelector(".haken-svg")) || $(".stempel")) return;
    const el = fbLebend(T), r = el && el.getBoundingClientRect();
    fbHaken(T.x != null ? T.x : r ? r.left + r.width / 2 : innerWidth / 2, T.y != null ? T.y : r ? r.top + r.height / 2 : innerHeight / 2);
    return;
  }
  const el = fbLebend(T); if (!el) return;
  if (art === "fehler") return fbZuck(el);
  if (art === "auswahl") return fbFuell(el, T);
  if (art === "aktion" || art === "blatt") return fbWelle(el, T.x, T.y);
  // nav: Abdunkeln (gedrückt) + gleitender Zeiger (fbTabs); schalter: Daumen gleitet; taler: die Münze dreht sich selbst
}
function fbPos(el) { if (getComputedStyle(el).position === "static") el.style.position = "relative"; }
function fbEbene(el) { fbPos(el); const e = document.createElement("span"); e.className = "fb-ebene"; e.setAttribute("aria-hidden", "true"); el.appendChild(e); return e; }

/* Aktion: matte Welle in currentColor, 16 % → 0 in 600 ms, in eigener Ebene über dem Element */
function fbWelle(el, x, y) {
  if (el.matches("#knopf-einst, .logo-knopf, canvas")) return;
  const r = el.getBoundingClientRect(); if (!r.width) return;
  if (x == null) { x = r.left + r.width / 2; y = r.top + r.height / 2; }
  const d = Math.hypot(Math.max(x - r.left, r.right - x), Math.max(y - r.top, r.bottom - y)) * 2;
  const eb = fbEbene(el), w = document.createElement("span"); w.className = "fb-welle";
  w.style.cssText = `width:${d}px;height:${d}px;left:${x - r.left - d / 2}px;top:${y - r.top - d / 2}px`;
  eb.appendChild(w); setTimeout(() => eb.remove(), 650);
}
/* Auswahl: der neue Zustand läuft vom Fingerpunkt ein (@property --r, Klasse fill-in) */
function fbFuell(el, T) {
  const r = el.getBoundingClientRect(); if (!r.width) return;
  const x = T.x == null ? r.width / 2 : T.x - r.left, y = T.y == null ? r.height / 2 : T.y - r.top;
  el.style.setProperty("transition", "none", "important");      // laufende Übergänge beenden → Endfarbe lesen
  const neu = fbGrund(el), alt = T.el === el || (T.alt && T.el && !T.el.isConnected) ? T.alt : null;
  const gleich = !alt || (alt.c === neu.c && alt.i === neu.i);
  fbPos(el);
  const sp = document.createElement("span"); sp.className = "fb-fuell" + (gleich ? " puls" : ""); sp.setAttribute("aria-hidden", "true");
  if (!gleich) {
    sp.style.backgroundColor = neu.c; if (neu.i && neu.i !== "none") sp.style.backgroundImage = neu.i;
    el.style.setProperty("background-color", alt.c, "important"); el.style.setProperty("background-image", alt.i || "none", "important");
  }
  el.style.setProperty("--fx", x + "px"); el.style.setProperty("--fy", y + "px");
  el.classList.add("fill-in"); el.appendChild(sp);
  setTimeout(() => {
    el.style.removeProperty("background-color"); el.style.removeProperty("background-image");
    void el.offsetWidth; sp.remove(); el.classList.remove("fill-in"); el.style.removeProperty("transition");
  }, gleich ? 520 : 400);
}
/* Fehler: einmaliges Seitwärtszucken ≤ 5 px (eigene translate-Eigenschaft, stört kein transform) */
function fbZuck(el) { el.classList.remove("fb-zuck"); void el.offsetWidth; el.classList.add("fb-zuck"); setTimeout(() => el.classList.remove("fb-zuck"), 380); }
/* Erfolg: ein Haken zeichnet sich – nur wenn kein Toast-Haken und kein Stempel kommt */
function fbHaken(x, y) {
  const h = document.createElement("div"); h.className = "fb-haken"; h.setAttribute("aria-hidden", "true");
  h.style.left = clamp(x, 30, innerWidth - 30) + "px"; h.style.top = clamp(y, 30, innerHeight - 30) + "px";
  h.innerHTML = `<svg viewBox="0 0 30 30"><path d="M8.5 15.5l4.2 4.2 8.8-9.4" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(h); setTimeout(() => h.remove(), 900);
}

/* Navigation: ein Zeiger gleitet zur aktiven Lasche (die Laschen werden bei jedem render() neu gebaut) */
let FB_TABX = null;
function fbTabs() {
  const nav = document.getElementById("tabs"); if (!nav) return;
  const b = nav.querySelector("button[aria-current=page]"); let p = nav.querySelector(":scope>.fb-tabzeiger");
  if (!b || !b.offsetWidth) { if (p) p.remove(); nav.classList.remove("fb-gleit"); return; }
  const x = b.offsetLeft + b.offsetWidth * .18, w = b.offsetWidth * .64;
  if (!p) {
    p = document.createElement("span"); p.className = "fb-tabzeiger"; p.setAttribute("aria-hidden", "true");
    if (FB_TABX) { p.style.transform = `translateX(${FB_TABX.x}px)`; p.style.width = FB_TABX.w + "px"; }
    nav.appendChild(p); nav.classList.add("fb-gleit");
    if (FB_TABX && !REDUCED()) void p.offsetWidth;
  }
  if (FB_TABX && FB_TABX.x === x && p.style.width === w + "px") return;
  p.style.transform = `translateX(${x}px)`; p.style.width = w + "px"; FB_TABX = { x, w };
}
(function fbTabsBeobachten() {
  const los = () => { const nav = document.getElementById("tabs"); if (!nav) return setTimeout(los, 200);
    let raf = 0; new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fbTabs); }).observe(nav, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-current"] });
    fbTabs(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los); else setTimeout(los, 0);
  addEventListener("resize", () => { FB_TABX = null; const p = document.querySelector("#tabs>.fb-tabzeiger"); if (p) p.remove(); fbTabs(); });
})();

/* ---------- Leise Klick-Töne: kurze gefilterte Rausch-Klicks, kein Piepen (nur mit S.ton) ---------- */
let FB_RAUSCH = null;
function fbRausch() {
  if (FB_RAUSCH) return FB_RAUSCH;
  const n = Math.round(AC.sampleRate * .25), b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return (FB_RAUSCH = b);
}
function fbKnack(t0, f, q, laut, lang, typ = "bandpass") {
  const s = AC.createBufferSource(), fi = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = fbRausch(); fi.type = typ; fi.frequency.value = f; fi.Q.value = q;
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(laut, t0 + .0015); g.gain.exponentialRampToValueAtTime(.0003, t0 + lang);
  s.connect(fi).connect(g).connect(AC.destination); s.start(t0, Math.random() * .2); s.stop(t0 + lang + .02);
  return fi;
}
function fbKlick(art, el) {
  if (!S.ton || !art || !audio()) return;
  const t = AC.currentTime + .005;
  switch (art) {
    case "auswahl": fbKnack(t, 1900, 1.6, .05, .03); break;                          // weiches „tock“
    case "aktion": fbKnack(t, 3200, 1.3, .04, .02); break;                           // feines „tick“
    case "nav": fbKnack(t, 1500, 1.2, .03, .025); break;
    case "schalter": fbKnack(t, 2600, 2, .04, .018); fbKnack(t + .045, 1500, 2, .03, .02); break; // „klick-klack“
    case "fehler": fbKnack(t, 380, 1, .07, .05, "lowpass"); fbKnack(t + .1, 340, 1, .06, .05, "lowpass"); break; // zwei dumpfe Klopfer
    case "taler": if (el && el.matches && el.matches(".muenze-knopf")) break;        // die Münze klimpert selbst (skins.js)
      fbKnack(t, 5600, 9, .045, .07); fbKnack(t + .075, 6400, 9, .035, .06); break;  // feines doppeltes Klimpern
    case "blatt": { const fi = fbKnack(t, 900, .7, .028, .16); fi.frequency.exponentialRampToValueAtTime(5200, t + .14); break; } // Umblättern
  }
}
