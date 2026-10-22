/* ============================================================
   Rundgang mit Max (Team 2) – eigenständiges Modul
   Ein geführter erster Rundgang: Max erzählt, Hühnchen quatscht dazwischen,
   ein Scherenschnitt-Rahmen („Ausschneidebogen“) zeigt auf das echte Element.
   Einbindung (build.py): rundgang.js nach main.js, rundgang.css nach design.css.
   Haken in der App: onboardingFertig() → rundgangNachOnboarding(), Einstellungen-Zeile
   data-act="rundgang" → aktion() → RUNDGANG.start(), HAPSEL enthält die rg-Knöpfe.
   Ziele werden nur über data-act / data-ziel / data-tab gesucht (mehrere Ersatzwege);
   fehlt eins, zeigt die Station ihren Text ohne Rahmen und meldet data-ohne-ziel.
   ============================================================ */
(function () {
  "use strict";
  if (window.RUNDGANG) return;

  /* ---------- kleine Helfer (unabhängig von der App) ---------- */
  const q = (s, r = document) => { try { return r.querySelector(s); } catch (e) { return null; } };
  const qa = (s, r = document) => { try { return [...r.querySelectorAll(s)]; } catch (e) { return []; } };
  const warte = ms => new Promise(r => setTimeout(r, ms));
  const ruhig = () => { try { return typeof REDUCED === "function" ? REDUCED() : matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  const zustand = () => { try { return S; } catch (e) { return null; } };
  const tabJetzt = () => { try { return TAB; } catch (e) { return null; } };
  const name = () => { const s = zustand(); return (s && s.name) || "Rita"; };
  const tag = () => { try { return heute(); } catch (e) { return new Date().toISOString().slice(0, 10); } };
  const merken = () => { try { speichern(); } catch (e) { } };
  const brumm = art => { try { haptik(art); } catch (e) { } };
  const html = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const BELOHNUNG = 10;

  /* ---------- Stationen ----------
     ziel:   Liste von Selektoren (erster Treffer gewinnt)
     alle:   alle Treffer des Selektors zusammen umrahmen
     bereich: Element → umrahmter Bereich (z. B. die ganze Karte)
     tab:    vorher dorthin wechseln (der Rahmen tippt sichtbar auf den Reiter)
     mitmach: "huhn" | "muenze" – darf, muss aber nicht */
  const huhnAn = () => { const s = zustand(); return !s || s.huhn !== false; };
  /* ziel: Liste von Alternativen, jede eine Liste von Selektoren. Die erste Alternative mit Treffer gewinnt.
     alle: alle Treffer der Alternative zusammen umrahmen; bereich: Element → umrahmter Bereich */
  const STATIONEN = [
    { id: "hallo", titel: "Hallo", mitte: true,
      max: () => `Hallo ${name()}! Ich bin’s, Max. Ich zeig dir einmal, was wo ist. Du tippst nur auf „Weiter“ – dauert keine zwei Minuten.`,
      huhn: "Ich komm mit. Gefragt hat mich keiner." },
    { id: "liste", titel: "Deine Liste", tab: "heute", ziel: [["[data-act=liste-neu]"], ["#liste-neu"]], bereich: el => el.closest("section") || el.parentElement,
      max: "Das ist deine Liste. Was ansteht, schreibst du hier rein. Erledigt? Einmal antippen, Haken dran.",
      huhn: "Und ich? Steh nie auf der Liste. Frechheit." },
    { id: "eintragen", titel: "Eintragen", tab: "heute", ziel: [["[data-act=eintragen]", "[data-act=alles]"]], alle: true,
      max: "Was du gemacht hast, trägst du hier ein: spazieren, lesen, telefonieren, Tagebuch. Ein Tipp reicht – und dein Bild wächst jedes Mal ein Stück." },
    { id: "huhn", titel: "Deine Tagesform", tab: "heute",
      ziel: () => huhnAn() ? [["[data-act=huhn-tap]"], [".huhn-karte"], ["[data-act=tf]"]] : [["[data-act=tf]"]],
      alle: () => !huhnAn() || !q("[data-act=huhn-tap], .huhn-karte"),
      mitmach: () => huhnAn() && q("[data-act=huhn-tap], .huhn-karte") ? "huhn" : null,
      max: () => huhnAn() ? "Und das ist Hühnchen – ja, das aus Peru. Morgens fragt es nach deiner Energie. Tipp mal drauf oder halt den Finger länger drauf."
        : "Morgens tippst du hier an, wie viel Energie du hast. Danach richten sich die Ideen.",
      huhn: "Na los. Ich beiß nicht. Meistens." },
    { id: "telefon", titel: "Kurz plaudern", tab: "heute", ziel: [["[data-act=tel-auf]"], ["[data-ziel=tel-auf]"]],
      max: "Das alte Telefon: Kurz plaudern, nur zum Spaß – mit Hühnchen und Co. Ab und zu klingelt’s von selbst. Rangehen musst du nicht.",
      huhn: "Ich ruf nur an, wenn’s wichtig ist. Also ständig." },
    { id: "ideen", titel: "Ideen", tab: "ideen", ziel: [["[data-act=tuer]"], ["[data-ziel=drinnen]", "[data-ziel=draussen]"], [".c-fach[data-act=fenster]"]], alle: true,
      max: "Unter „Ideen“ gibt’s Futter für die Neugier. Erst drinnen oder draußen, dann suchst du dir was aus: Krimi, Schwedisch, Tee, Handy-Kniffe.",
      huhn: "Mein Tipp: alles, wo Kekse vorkommen." },
    { id: "notfall", titel: "Notfallplan", tab: "ideen", ziel: [["[data-act=ruhe-plan]"], ["[data-ziel=ruhe-plan]"], ["[data-act=ruhe-jetzt]"]],
      max: "Dein Notfallplan. Wenn’s mal eng wird, geht er Schritt für Schritt mit dir durch. Was drinsteht, bestimmst du – in Ruhe, wann du magst." },
    { id: "post", titel: "Post aus Vimmerby", tab: "ideen", ziel: [["[data-act=bv-auf]"], [".c-fach[data-ziel=bv-auf]"], ["[data-ziel=bv-auf]"]],
      max: "Und Post aus Vimmerby: Karin schreibt dir auf Schwedisch, die Übersetzung klappst du auf. Karin hab ich mir ausgedacht – ihr Schwedisch ist echt.",
      huhn: "Über mich schreibt sie nie was. Verdächtig." },
    { id: "bild", titel: "Dein Zuhause", tab: "lichtung", ziel: [["#buehne-gross"], ["#bild-gross"], ["[data-act=sk-wetter]"]],
      max: "Das ist dein Zuhause. Tipp aufs Bild, dann erfährst du was. Halt den Finger drauf und fahr herum – das ist die Lupe. Da steckt allerhand drin.",
      huhn: "Ich bin auch irgendwo drin. Such mich." },
    { id: "laden", titel: "Laden & Schrank", tab: "lichtung", ziel: [["[data-act=sk-schrank]", "[data-act=laden]"], ["[data-ziel=laden]"], ["[data-act=sk-taler]"]], alle: true,
      max: "Fürs Eintragen gibt’s Taler. Ausgeben kannst du sie hier: im Kramladen und im Kleiderschrank – Hüte und Kostüme für dich und Hühnchen.",
      huhn: "Wikingerhelm. Ich sag’s nur." },
    { id: "rueckblick", titel: "Rückblick", tab: "tagebuch", ziel: [["[data-act=tb-geschrieben]", "[data-act=tb-andere]", "[data-act=tb-modus]"], ["[data-act=moment]"]], bereich: el => el.closest(".tb-karte") || el,
      max: "Im Rückblick steht, was du gemacht hast. Und jeden Tag gibt’s eine Frage für dein Papier-Tagebuch – von heute oder von früher.",
      huhn: "Schreib ruhig was über mich. Nur Gutes." },
    { id: "einst", titel: "Einstellungen", tab: "heute", ziel: [["[data-act=go][data-go=einstellungen]"], ["[data-go=einstellungen]"], ["#knopf-einst"]],
      max: "Am Zahnrad machst du die Schrift größer. Und unter „Wunsch an Max“ schreibst du mir, was fehlt oder nervt. Ich nehm’s sportlich." },
    { id: "ende", titel: "Geschafft", tab: "heute", ziel: [["[data-act=sk-taler]"], ["#taler-plakette"]], rund: true, pad: 5, mitmach: "muenze",
      max: () => belohnt() ? "Geschafft! Die Taler gab’s schon beim ersten Mal – Hühnchen hat aufgepasst."
        : `Geschafft! Fürs Mitkommen gibt’s ${BELOHNUNG} Taler – tipp auf die Münze.`,
      huhn: () => belohnt() ? "Hab ich. Ich vergess nie was." : "Und von mir Applaus. Ich hab Flügel, das geht." }
  ];
  const wert = (x, ...a) => typeof x === "function" ? x(...a) : x;
  const belohnt = () => { const s = zustand(); return !!(s && s.rundgang && s.rundgang.taler); };

  const HUHN_TIPP = ["Ich bin Kunst aus Peru. Bitte mit Respekt drücken.", "He! Das kitzelt.", "Noch mal, und ich pick zurück.", "Okay, okay. Ich bin wach."];
  const HUHN_HALT = "Na? Von nahem noch hübscher, oder?";

  /* ---------- Zustand ---------- */
  const RG = { an: false, i: 0, el: null, gen: 0, histEigen: false, selbstZurueck: false, tippN: 0, timer: [], orig: {}, rahmen: null, scrollSperre: null };
  window.RUNDGANG = { start: starten, stop: () => beenden("weg"), stationen: STATIONEN, get aktiv() { return RG.an; }, get station() { return RG.i; } };

  /* ---------- Aufbau ---------- */
  const SCHERE = `<svg class="rg-schere" viewBox="0 0 32 32" aria-hidden="true"><g class="rg-blatt-a"><path d="M15 16 L30 9.5 L30.8 11 L16.6 17.6Z" fill="#9AA3A8"/><circle cx="8" cy="10" r="4.6" fill="none" stroke="#C0472F" stroke-width="2.6"/><path d="M11.6 12.4 L16.4 16" stroke="#C0472F" stroke-width="2.6" stroke-linecap="round"/></g><g class="rg-blatt-b"><path d="M15 16 L30 22.5 L30.8 21 L16.6 14.4Z" fill="#B7BEC2"/><circle cx="8" cy="22" r="4.6" fill="none" stroke="#C0472F" stroke-width="2.6"/><path d="M11.6 19.6 L16.4 16" stroke="#C0472F" stroke-width="2.6" stroke-linecap="round"/></g><circle cx="16" cy="16" r="1.3" fill="#5A6066"/></svg>`;
  const SPUR = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18 L10 9 M10 9 L4.5 3.5 M10 9 L10 2 M10 9 L15.5 3.5 M10 13 L7 16.5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const FINGER = `<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M15 6 Q15 2 18.5 2 Q22 2 22 6 L22 20 L27 20.5 Q34 21.5 34 28 L33 38 Q32 46 24 46 L19 46 Q14 46 11 41 L5 31 Q3.5 28 6 26.5 Q8.5 25.5 10.5 28 L15 33Z" fill="#FBF3E2" stroke="#3A2A22" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
  const FEDER = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20 Q6 9 18 4 Q16 12 7 18Z" fill="#E4B24F"/><path d="M5 20 L14 9" stroke="#C9913C" stroke-width="1.4"/></svg>`;
  const MUENZE_GROSS = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="34" cy="34" r="27" fill="#8A5A12" opacity=".35"/><circle cx="31" cy="31" r="27" fill="#E2A93B"/><circle cx="31" cy="31" r="21" fill="none" stroke="#FFF1C9" stroke-width="2" stroke-dasharray="3 3"/><path d="M22 23 H40 V28 H34 V43 H28 V28 H22Z" fill="#8A5A12"/></svg>`;

  function aufbauen() {
    const el = document.createElement("div");
    el.id = "rundgang"; el.className = "rg";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "rg-name");
    const maxBild = typeof maxSVG === "function" ? maxSVG(76) : "";
    const huhnBild = typeof huhnSVG === "function" ? huhnSVG({ gr: 70 }) : "";
    el.innerHTML = `
      <div class="rg-fang" aria-hidden="true"></div>
      <div class="rg-loch" aria-hidden="true">${SCHERE}<span class="rg-finger">${FINGER}</span></div>
      <div class="rg-neben" aria-hidden="true"></div>
      <div class="rg-karte">
        <div class="rg-papier" aria-hidden="true"></div>
        <div class="rg-max" aria-hidden="true">${maxBild}</div>
        <button class="rg-huhn" type="button" data-fb="auswahl" aria-label="Hühnchen antippen">${huhnBild}</button>
        <div class="rg-kopf">
          <div class="rg-wer"><span class="rg-name" id="rg-name">Max</span><span class="rg-ort"><span class="rg-titel"></span><span class="rg-zaehler"></span></span></div>
          <button class="rg-skip" type="button" data-rg="skip" data-fb="aktion">Überspringen</button>
        </div>
        <div class="rg-rede">
          <p class="rg-text" aria-live="polite"></p>
          <p class="rg-huhn-satz" aria-live="polite"><span class="rg-huhn-wer">Hühnchen</span><span class="rg-huhn-txt"></span></p>
          <div class="rg-belohnung"></div>
        </div>
        <div class="rg-spuren" aria-hidden="true"></div>
        <div class="rg-knoepfe">
          <button class="rg-knopf rg-zurueck" type="button" data-rg="zurueck" data-fb="blatt">Zurück</button>
          <button class="rg-knopf rg-weiter" type="button" data-rg="weiter" data-fb="blatt">Weiter</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.classList.toggle("ohne-huhn", !huhnAn());
    el.querySelector(".rg-spuren").innerHTML = STATIONEN.map((s, i) => `<span class="rg-spur" style="--k:${i % 2 ? 1 : -1}">${SPUR}</span>`).join("");

    el.addEventListener("click", klick);
    const fang = el.querySelector(".rg-fang");
    fang.addEventListener("pointerdown", fangRunter);
    fang.addEventListener("pointerup", fangHoch);
    fang.addEventListener("pointercancel", () => clearTimeout(RG.halt));
    // Scrollen hinter dem Rundgang sperren (sonst verrutscht der Rahmen) – außer im Kartentext
    RG.scrollSperre = ev => { if (!ev.target.closest || !ev.target.closest(".rg-rede")) ev.preventDefault(); };
    el.addEventListener("wheel", RG.scrollSperre, { passive: false });
    el.addEventListener("touchmove", RG.scrollSperre, { passive: false });
    return el;
  }

  /* ---------- Start / Ende ---------- */
  async function starten(opt = {}) {
    if (RG.an) return;
    const s = zustand(); if (!s) return;
    RG.an = true; RG.i = 0; RG.tippN = 0; RG.gen++;
    // offene Fenster, Hinweise und Besuche weg – der Rundgang hat jetzt die Bühne
    try { if (typeof SHEETS !== "undefined" && SHEETS.length) { alleSheetsZu(); await warte(380); } } catch (e) { }
    if (!RG.an) return;
    qa(".toast").forEach(t => t.remove());
    try { qa(".ereignis:not(.weg)").forEach(x => typeof ereignisWeg === "function" ? ereignisWeg(x) : x.remove()); } catch (e) { }
    if (typeof window.ereignisPruefen === "function") { RG.orig.ereignisPruefen = window.ereignisPruefen; window.ereignisPruefen = function () { }; }
    RG.vorher = document.activeElement;
    RG.scrollVorher = scrollY; RG.tabVorher = tabJetzt();
    document.documentElement.classList.add("rg-an");
    RG.el = aufbauen();
    // Platz unter der Seite, damit auch Ziele ganz unten über die Karte gescrollt werden können
    RG.platz = document.createElement("div"); RG.platz.className = "rg-platz"; RG.platz.setAttribute("aria-hidden", "true");
    document.body.insertBefore(RG.platz, RG.el);
    // Zurück-Taste: eigener Verlaufseintrag
    try { history.pushState({ rg: 1, sheet: 0 }, ""); RG.histEigen = true; } catch (e) { RG.histEigen = false; }
    s.rundgang = Object.assign({}, s.rundgang, { gesehen: tag() }); merken();
    requestAnimationFrame(() => RG.el && RG.el.classList.add("da"));
    addEventListener("resize", neuLegen);
    document.addEventListener("keydown", taste, true);
    zeige(0, 1);
  }

  function beenden(wie, ohneHistory) {
    if (!RG.an) return;
    const s = zustand();
    if (wie === "fertig" && s) { s.rundgang = Object.assign({}, s.rundgang, { fertig: tag() }); }
    const neuBelohnt = wie === "fertig" && (gutschreiben(q(".rg-weiter", RG.el)) || RG.belohntJetzt);
    RG.belohntJetzt = false;
    merken();
    RG.an = false; RG.gen++;
    RG.timer.forEach(clearTimeout); RG.timer = []; clearTimeout(RG.halt);
    removeEventListener("resize", neuLegen);
    document.removeEventListener("keydown", taste, true);
    if (RG.orig.ereignisPruefen) { window.ereignisPruefen = RG.orig.ereignisPruefen; RG.orig.ereignisPruefen = null; }
    const el = RG.el; RG.el = null;
    if (RG.platz) { RG.platz.remove(); RG.platz = null; }
    if (el) {
      el.classList.remove("da"); el.classList.add("weg");
      // Wichtig (iOS): die Ebene fängt ab sofort nichts mehr und ist gleich ganz aus dem DOM
      el.style.pointerEvents = "none"; qa("*", el).forEach(x => x.style.pointerEvents = "none");
      setTimeout(() => { el.remove(); document.documentElement.classList.remove("rg-an"); }, ruhig() ? 0 : 280);
    } else document.documentElement.classList.remove("rg-an");
    if (RG.histEigen && !ohneHistory) { RG.selbstZurueck = true; try { history.back(); } catch (e) { RG.selbstZurueck = false; } }
    RG.histEigen = false;
    if (wie === "skip") { try { toast("Den Rundgang mit Max findest du jederzeit in den Einstellungen."); } catch (e) { } }
    if (neuBelohnt) nachklapp();
    // Fokus zurück an einen sinnvollen Ort
    try { const m = q("#main"); (m || document.body).focus({ preventScroll: true }); } catch (e) { }
  }

  addEventListener("popstate", () => {
    if (RG.selbstZurueck) { RG.selbstZurueck = false; return; }
    if (RG.an && RG.histEigen) { RG.histEigen = false; beenden("zurueck", true); }
  });

  /* ---------- Bedienung ---------- */
  function klick(ev) {
    const b = ev.target.closest("[data-rg], .rg-huhn, .rg-muenze"); if (!b) return;
    ev.stopPropagation();
    if (b.classList.contains("rg-huhn")) { if (huhnAn()) huhnReagiert(false, b); return; }
    if (b.classList.contains("rg-muenze")) { muenzeTippen(b); return; }
    const a = b.dataset.rg;
    if (a === "weiter") { if (RG.i >= STATIONEN.length - 1) beenden("fertig"); else zeige(RG.i + 1, 1); }
    else if (a === "zurueck") { if (RG.i > 0) zeige(RG.i - 1, -1); }
    else if (a === "skip") beenden("skip");
  }
  function taste(ev) {
    if (!RG.an) return;
    if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); beenden("skip"); }
    else if (ev.key === "ArrowRight") { ev.preventDefault(); q(".rg-weiter", RG.el).click(); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); if (RG.i > 0) q(".rg-zurueck", RG.el).click(); }
    else if (ev.key === "Tab") { // Fokus bleibt in der Karte
      const f = qa(".rg-karte button:not([hidden]):not([disabled])", RG.el).filter(b => b.offsetParent); if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); }
    }
  }

  /* ---------- Eine Station zeigen ---------- */
  async function zeige(i, richtung) {
    const gen = ++RG.gen, st = STATIONEN[i], el = RG.el; if (!el) return;
    RG.i = i; RG.timer.forEach(clearTimeout); RG.timer = []; clearTimeout(RG.halt);
    el.dataset.station = st.id;
    RG.mitmach = wert(st.mitmach);
    el.classList.toggle("mitmach-huhn", RG.mitmach === "huhn");
    el.classList.remove("mitte", "geklappt"); delete el.dataset.ohneZiel;
    karteFuellen(st, i);
    RG.reiter = null;

    // Reiterwechsel sichtbar machen: Rahmen springt auf den Reiter, „tippt“, dann geht’s weiter
    if (st.tab && tabJetzt() !== st.tab) {
      const reiter = q(`nav [data-tab="${st.tab}"]`) || q(`[data-tab="${st.tab}"]`);
      if (reiter) {
        if (!ruhig() && richtung > 0) {
          kartenSeite("unten", true);
          rahmenAuf(reiter.getBoundingClientRect(), 6); el.classList.add("tippt");
          await warte(720); if (gen !== RG.gen) return;
          el.classList.remove("tippt");
        }
        reiter.click();
        RG.reiter = reiter; // bleibt auf dieser Station mit einem Ring markiert: „jetzt bist du hier“
        await warte(ruhig() ? 60 : 260); if (gen !== RG.gen) return;
      }
    }
    if (st.mitte) { el.classList.add("mitte"); rahmenZu(); nebenZu(); sprechen(st); return; }
    if (RG.reiter && !q(`nav [data-tab="${st.tab}"]`)) RG.reiter = null;
    legen(st);
    sprechen(st);
  }
  function neuLegen() { if (!RG.an) return; const st = STATIONEN[RG.i]; if (st.mitte) return; legen(st); }

  function zielFinden(st) {
    const sichtbar = s => qa(s).filter(x => x.getClientRects().length && !x.closest("#rundgang"));
    const alle = wert(st.alle);
    for (const alt of wert(st.ziel) || []) {
      const els = alt.flatMap(sichtbar);
      if (!els.length) continue;
      if (alle) return [...new Set(els)];
      return [st.bereich ? (st.bereich(els[0]) || els[0]) : els[0]];
    }
    return null;
  }
  const vereinige = els => els.map(e => e.getBoundingClientRect()).reduce((a, r) => ({ left: Math.min(a.left, r.left), top: Math.min(a.top, r.top), right: Math.max(a.right, r.right), bottom: Math.max(a.bottom, r.bottom) }), { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 });
  const istFest = e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === "fixed" || p === "sticky") return true; } return false; };

  function legen(st) {
    const el = RG.el; if (!el) return;
    const els = zielFinden(st);
    if (!els) { el.classList.add("mitte"); el.dataset.ohneZiel = st.id; rahmenZu(); nebenZu(); return; }
    const vh = innerHeight, pad = st.pad != null ? st.pad : 10;
    q(".rg-loch", el).classList.toggle("rund", !!st.rund);
    const karte = q(".rg-karte", el);
    // Erst unten versuchen, sonst oben
    for (const seite of ["unten", "oben"]) {
      kartenSeite(seite);
      const kh = karte.offsetHeight + 46; // + Max-Kopf über der Kartenkante
      const oben = seite === "unten" ? 10 : kh + 8, unten = seite === "unten" ? vh - kh - 8 : vh - 10;
      const frei = unten - oben;
      if (!els.some(istFest)) {
        let r = vereinige(els); const h = r.bottom - r.top;
        const y0 = scrollY + r.top;
        let soll = h + 2 * pad < frei ? y0 - oben - (frei - h) / 2 : y0 - oben - pad;
        soll = Math.max(0, Math.min(soll, document.documentElement.scrollHeight - vh));
        scrollTo({ top: Math.round(soll), behavior: "instant" });
      }
      const r = vereinige(els);
      if (seite === "unten" && r.bottom + pad > unten + 4 && (r.bottom - r.top) + 2 * pad <= (vh - kh - 20) && !els.some(istFest)) continue; // passt nicht → Karte nach oben
      const t = Math.max(r.top - pad, oben - 4), b = Math.min(r.bottom + pad, unten + 4);
      rahmenAuf({ left: r.left - pad, top: t, right: r.right + pad, bottom: Math.max(b, t + 24) }, 0);
      break;
    }
    // Ring um den Reiter, auf den gerade gewechselt wurde (auch ohne Bewegung)
    if (RG.reiter && RG.reiter.isConnected) nebenAuf(RG.reiter.getBoundingClientRect()); else nebenZu();
    // Mitmachen: der Papierfinger zeigt aufs echte Hühnchen, nicht auf Text
    if (RG.mitmach === "huhn") {
      const fig = els[0].querySelector("svg.huhn, svg") || els[0], fr = fig.getBoundingClientRect(), R = RG.rahmen, f = q(".rg-finger", el);
      if (R && f) { f.style.left = Math.round(fr.left + fr.width * .55 - R.left) + "px"; f.style.top = Math.round(fr.top + fr.height * .5 - R.top) + "px"; }
    }
  }

  function kartenSeite(seite, still) { const el = RG.el; if (!el) return; el.classList.toggle("karte-oben", seite === "oben"); }
  function rahmenAuf(r, extra) {
    const l = q(".rg-loch", RG.el); if (!l) return;
    const left = Math.max(12, r.left - extra), top = Math.max(12, r.top - extra), w = Math.min(innerWidth - 12, r.right + extra) - left, h = Math.max(20, Math.min(innerHeight - 12, r.bottom + extra) - top);
    l.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    l.style.width = Math.round(w) + "px"; l.style.height = Math.round(h) + "px";
    l.classList.add("offen"); RG.rahmen = { left, top, w, h };
    const f = q(".rg-finger", l); if (f) { f.style.left = ""; f.style.top = ""; }
    l.classList.remove("schnipp"); void l.offsetWidth; l.classList.add("schnipp");
  }
  function rahmenZu() {
    const l = q(".rg-loch", RG.el); if (!l) return;
    l.classList.remove("offen"); l.style.transform = `translate(${Math.round(innerWidth / 2)}px, ${Math.round(innerHeight / 2)}px)`; l.style.width = l.style.height = "0px"; RG.rahmen = null;
  }
  function nebenAuf(r) { if (!RG.el) return; const n = q(".rg-neben", RG.el); n.style.transform = `translate(${Math.round(r.left - 6)}px, ${Math.round(r.top - 6)}px)`; n.style.width = Math.round(r.width + 12) + "px"; n.style.height = Math.round(r.height + 12) + "px"; n.classList.add("offen"); }
  function nebenZu() { const n = RG.el && q(".rg-neben", RG.el); if (n) n.classList.remove("offen"); }

  /* ---------- Karte füllen und sprechen ---------- */
  function karteFuellen(st, i) {
    const el = RG.el, n = STATIONEN.length;
    q(".rg-titel", el).textContent = st.titel;
    q(".rg-zaehler", el).textContent = `${i + 1} von ${n}`;
    q(".rg-karte", el).setAttribute("aria-label", `Station ${i + 1} von ${n}: ${st.titel}`);
    const z = q(".rg-zurueck", el); z.hidden = i === 0;
    const w = q(".rg-weiter", el);
    w.textContent = i === n - 1 ? "Tschüss, Max!" : i === 0 ? "Los geht’s" : "Weiter";
    q(".rg-skip", el).hidden = i === n - 1;
    qa(".rg-spur", el).forEach((s, k) => { s.classList.toggle("fertig", k < i); s.classList.toggle("jetzt", k === i); });
    const text = wert(st.max);
    const p = q(".rg-text", el);
    p.innerHTML = text.split(/(\s+)/).map(w => /\s+/.test(w) ? w : `<span class="rg-w">${html(w)}</span>`).join("");
    const hs = huhnAn() ? wert(st.huhn) : null;
    const hz = q(".rg-huhn-satz", el); hz.classList.remove("da"); hz.hidden = !hs; q(".rg-huhn-txt", el).textContent = hs || "";
    const bel = q(".rg-belohnung", el);
    bel.innerHTML = st.mitmach !== "muenze" ? "" : belohnt() ? `<span class="rg-schild">Taler: schon abgeholt</span>${stempelHTML(zustand().rundgang.taler)}` : (`<button class="rg-muenze" type="button" data-fb="taler" aria-label="${BELOHNUNG} Taler einsammeln">${MUENZE_GROSS}<span class="rg-muenze-zahl">+${BELOHNUNG}</span><span class="rg-muenze-tipp">Tipp drauf</span></button>`);
    bel.hidden = !bel.innerHTML;
    q(".rg-rede", el).scrollTop = 0;
    try { if (typeof armHaptics === "function") armHaptics(); } catch (e) { }
    // Fokus: auf „Weiter“, damit Enter/Leertaste einfach weiterführt
    try { w.focus({ preventScroll: true }); } catch (e) { }
  }
  function stempelHTML(datum) { return `<div class="rg-stempel" role="img" aria-label="Stempel: Rundgang geschafft"><span>Rundgang</span><b>geschafft</b><small>${new Date((datum || tag()) + "T12:00").toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}</small></div>`; }

  function sprechen(st) {
    const el = RG.el, gen = RG.gen; if (!el) return;
    const max = q(".rg-max", el), worte = qa(".rg-w", el), hz = q(".rg-huhn-satz", el), huhn = q(".rg-huhn", el);
    if (ruhig()) { worte.forEach(w => w.classList.add("da")); if (!hz.hidden) hz.classList.add("da"); return; }
    max.classList.add("spricht");
    worte.forEach((w, k) => RG.timer.push(setTimeout(() => { if (gen === RG.gen) w.classList.add("da"); }, 60 + k * 45)));
    const ende = 60 + worte.length * 45;
    RG.timer.push(setTimeout(() => { if (gen === RG.gen) max.classList.remove("spricht"); }, ende + 120));
    if (!hz.hidden) {
      RG.timer.push(setTimeout(() => { if (gen !== RG.gen) return; hz.classList.add("da"); huhn.classList.add("spricht", "hops"); }, ende + 380));
      RG.timer.push(setTimeout(() => { if (gen === RG.gen) huhn.classList.remove("spricht", "hops"); }, ende + 1500));
    }
  }

  /* ---------- Mitmachen 1: Hühnchen antippen oder halten ---------- */
  function imRahmen(ev) { const r = RG.rahmen; return r && ev.clientX >= r.left && ev.clientX <= r.left + r.w && ev.clientY >= r.top && ev.clientY <= r.top + r.h; }
  function fangRunter(ev) {
    if (!RG.an || RG.mitmach !== "huhn" || !imRahmen(ev)) return;
    RG.lang = false; clearTimeout(RG.halt);
    RG.halt = setTimeout(() => { RG.lang = true; huhnReagiert(true, null, ev.clientX, ev.clientY); }, 450);
  }
  function fangHoch(ev) {
    if (!RG.an || RG.mitmach !== "huhn") return;
    clearTimeout(RG.halt);
    if (!RG.lang && imRahmen(ev)) huhnReagiert(false, null, ev.clientX, ev.clientY);
    RG.lang = false;
  }
  function huhnReagiert(lang, knopf, x, y) {
    const el = RG.el; if (!el) return;
    const huhn = q(".rg-huhn", el), hz = q(".rg-huhn-satz", el);
    const satz = lang ? HUHN_HALT : HUHN_TIPP[RG.tippN++ % HUHN_TIPP.length];
    hz.hidden = false; q(".rg-huhn-txt", el).textContent = satz; hz.classList.add("da");
    el.classList.add("geklappt");
    huhn.classList.remove("hops"); void huhn.offsetWidth; huhn.classList.add("hops", "spricht", "froh");
    RG.timer.push(setTimeout(() => huhn.classList.remove("spricht", "hops", "froh"), 1300));
    // das echte Hühnchen in der App hüpft mit (auf Station 4 ist das Kanten-Hühnchen ausgeblendet)
    const echt = q(".huhn-karte svg.huhn");
    if (echt && !ruhig()) { echt.classList.remove("rg-hopst"); void echt.getBoundingClientRect(); echt.classList.add("rg-hopst"); setTimeout(() => echt.classList.remove("rg-hopst"), 650); }
    brumm(lang ? "erfolg" : "auswahl");
    if (x == null) { const r = (knopf || huhn).getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 3; }
    if (!ruhig()) federn(x, y, lang ? 5 : 3);
    if (lang && typeof huhnFrontSVG === "function" && !ruhig()) {
      const g = document.createElement("div"); g.className = "rg-huhn-gross"; g.innerHTML = huhnFrontSVG(150);
      g.style.left = Math.max(10, Math.min(innerWidth - 170, x - 80)) + "px"; g.style.top = Math.max(10, y - 190) + "px";
      el.appendChild(g); setTimeout(() => g.remove(), 1700);
    }
  }
  function federn(x, y, n) {
    for (let k = 0; k < n; k++) {
      const f = document.createElement("div"); f.className = "rg-feder"; f.innerHTML = FEDER;
      f.style.left = x + "px"; f.style.top = y + "px"; f.style.setProperty("--dx", ((k - (n - 1) / 2) * 34 + (Math.random() * 16 - 8)) + "px"); f.style.setProperty("--dr", (Math.random() * 260 - 130) + "deg"); f.style.animationDelay = k * 60 + "ms";
      RG.el.appendChild(f); setTimeout(() => f.remove(), 1700);
    }
  }

  /* ---------- Mitmachen 2 / Belohnung: Münze ---------- */
  function gutschreiben(von) {
    const s = zustand(); if (!s || belohnt()) return false;
    s.rundgang = Object.assign({}, s.rundgang, { taler: tag() });
    try {
      if (von && typeof PLAK !== "undefined") { const r = von.getBoundingClientRect(); PLAK.quelle = { x: r.left + r.width / 2, y: r.top + r.height / 2, t: performance.now() }; }
      s.taler = (Number(s.taler) || 0) + BELOHNUNG;
    } catch (e) { }
    merken(); return true;
  }
  function muenzeTippen(b) {
    if (!gutschreiben(b)) return;
    brumm("erfolg"); RG.belohntJetzt = true;
    RG.gerade = true;
    b.classList.add("fliegt");
    const bel = q(".rg-belohnung", RG.el);
    setTimeout(() => { if (!RG.el) return; bel.innerHTML = stempelHTML(); RG.gerade = false;
      q(".rg-text", RG.el).textContent = "Bitte schön! Und wenn du was vergisst: Den Rundgang findest du jederzeit in den Einstellungen.";
      const hz = q(".rg-huhn-satz", RG.el);
      if (huhnAn()) { q(".rg-huhn-txt", RG.el).textContent = "Wikingerhelm kostet übrigens 180. Nur so."; hz.hidden = false; hz.classList.add("da"); } else hz.hidden = true;
      const h = q(".rg-huhn", RG.el); h.classList.add("hops", "froh"); setTimeout(() => h.classList.remove("hops", "froh"), 1200);
      try { q(".rg-weiter", RG.el).focus({ preventScroll: true }); } catch (e) { } }, ruhig() ? 0 : 420);
  }

  /* ---------- Nachklapp auf „Heute“: Hühnchen hüpft über der Tableiste herein ---------- */
  function nachklapp() {
    if (!huhnAn() || typeof huhnSVG !== "function") return;
    const n = document.createElement("div"); n.className = "rg-nachklapp"; n.setAttribute("role", "status");
    n.innerHTML = `${huhnSVG({ gr: 64 })}<span class="rg-nk-blase">Zehn Taler! Ich hab nachgezählt.</span>`;
    setTimeout(() => {
      document.body.appendChild(n); n.classList.add("rein");
      const h = n.querySelector(".huhn"); if (h) { h.classList.add("spricht"); setTimeout(() => h.classList.remove("spricht"), 1200); }
      setTimeout(() => { n.classList.add("raus"); setTimeout(() => n.remove(), 400); }, 3400);
    }, ruhig() ? 200 : 900);
  }

  /* ---------- Einbindung in die App ---------- */
  // Automatisch nur für echte Menschen; Testläufe (navigator.webdriver) setzen window.RUNDGANG_AUTOSTART = true, wenn sie ihn sehen wollen
  const autoErlaubt = () => !navigator.webdriver || window.RUNDGANG_AUTOSTART === true;
  // 1) Nach dem bestehenden Onboarding (aus onboardingFertig) – genau einmal
  window.rundgangNachOnboarding = function () {
    const s = zustand(); if (!s || s.rundgang || !autoErlaubt()) return;
    setTimeout(() => { if (!RG.an && !(typeof SHEETS !== "undefined" && SHEETS.length)) starten({ auto: true }); }, ruhig() ? 500 : 1300);
  };
  // 2) Wer die App schon nutzt (Rita!): einmal freundlich fragen statt überfallen
  const warSchonEingerichtet = !!(zustand() && zustand().onboard);
  setTimeout(() => {
    const s = zustand(); if (!warSchonEingerichtet || !s || !s.onboard || s.rundgang || RG.an || !autoErlaubt()) return;
    if (typeof SHEETS !== "undefined" && SHEETS.length) return;
    s.rundgang = { eingeladen: tag() }; merken();
    try { toast("Max hat einen kleinen Rundgang durch die App gebaut. Kommst du mit?", { knopf: { act: "rundgang", text: "Mitkommen" }, dauer: 12000 }); } catch (e) { }
  }, 2500);
})();
