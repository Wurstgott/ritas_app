/* ============================================================
   Figuren für die Oberfläche (SVG): Hühnchen als Comic, Porträts von Rita und Max
   Papier-Stil: flache Flächen, keine Konturen, ein harter Versatzschatten.
   ============================================================ */

/* Hühnchen – nach der echten Tonfigur: ocker, braun gesprenkelt, roter Kamm, gelber Schnabel, grüner Sockel.
   Teile mit Klassen, damit CSS sie bewegen kann (Kopf wippt, Augen blinzeln, Schnabel spricht, Flügel winkt). */
function huhnSVG(opt = {}) {
  const nurKopf = opt.kopf, stimmung = opt.stimmung || "", gr = opt.gr || 80;
  /* Kleiderschrank (skins.js): opt.skin = undefined → was Hühnchen gerade trägt, false/null → nichts, "id" → Anprobe */
  const L = typeof skinSchichten === "function" ? skinSchichten("huhn", nurKopf ? "kopf" : "seite", opt.skin) : null;
  const vb = nurKopf ? (L && L.vb || "40 6 56 52") : "0 0 100 100";
  return `<svg class="huhn ${stimmung}${L ? " mit-skin" : ""}" viewBox="${vb}" style="width:${gr}px;height:${gr}px${L && L.hoch && !nurKopf ? ";overflow:visible" : ""}" aria-hidden="true">
  ${nurKopf ? "" : `<ellipse cx="50" cy="95" rx="26" ry="3.2" fill="rgba(20,28,24,.16)"/><rect x="26" y="83" width="46" height="10" rx="5" fill="#5B8A47"/>${L ? `<g class="skin-teil">${L.hinten}</g>` : ""}
  <g class="huhn-koerper">
    <path d="M30 60 Q16 50 19 34 Q26 44 38 50Z" fill="#C9913C"/>
    <path d="M26 66 Q24 46 44 44 Q62 42 72 56 Q80 70 68 80 Q56 88 42 86 Q28 84 26 66Z" fill="#E4B24F"/>
    <path class="huhn-fluegel" d="M34 62 Q46 52 60 60 Q58 73 46 75 Q35 73 34 62Z" fill="#CC913C"/>
  </g>${L ? `<g class="skin-teil">${L.koerper}</g>` : ""}`}
  <g class="huhn-kopf">
    <path d="M48 46 Q42 22 60 18 Q78 15 79 32 Q80 47 66 51 Q54 53 48 46Z" fill="#E4B24F"/>
    <g class="huhn-kamm" fill="#D9473A"${L && L.ohneKamm ? ' style="display:none"' : ""}><circle cx="56" cy="16" r="5"/><circle cx="63" cy="12.5" r="5.6"/><circle cx="70" cy="15.5" r="4.6"/></g>
    <path d="M73 45 Q78 51 73 56 Q68 52 69.5 46Z" fill="#D9473A"/>
    <ellipse cx="59" cy="42" rx="3.6" ry="2.3" fill="#EE8E78" opacity=".55"/>
    <g class="huhn-augen">
      <ellipse cx="65" cy="31" rx="8.5" ry="9.5" fill="#FFFDF5"/>
      <g class="pupillen"><circle cx="68" cy="32" r="5" fill="#1C2620"/><circle cx="69.8" cy="29.8" r="1.8" fill="#fff"/></g>
      <path class="froh" style="display:none" d="M58.5 33 Q65 25 71.5 33" stroke="#1C2620" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <g class="lider" fill="#E4B24F" opacity="0"><ellipse cx="65" cy="31" rx="9.2" ry="10.2"/></g>
    </g>
    <g class="huhn-schnabel"><path class="unten" d="M76 39 L88 41 L76 45Z" fill="#D9921C"/><path class="oben" d="M76 30 Q86 31 93 36 Q86 39 76 40Z" fill="#F4B92A"/></g>
    ${L ? `<g class="skin-kopf skin-teil">${L.kopf}</g>` : ""}
  </g>
</svg>`;
}

/* Porträt Rita (Logo): blond mit Silbertouch, Bob, fröhliches Lachen, kleine Creolen. Die Grundfigur bleibt ohne Hut –
   Hüte, Brillen und Kostüme kommen nur als Zusatz aus dem Kleiderschrank (skins.js), opt.skin wie bei huhnSVG. */
function ritaSVG(gr = 40, opt = {}) {
  const L = typeof skinSchichten === "function" ? skinSchichten("rita", "rita", opt.skin) : null;
  const kid = "rk" + (ritaSVG.n = (ritaSVG.n || 0) + 1); // Körper und Zusätze bleiben im runden Rahmen
  return `<svg class="portrait rita${L ? " mit-skin" : ""}" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true"><defs><clipPath id="${kid}"><circle cx="50" cy="50" r="49.2"/></clipPath></defs><g clip-path="url(#${kid})">
  <circle cx="50" cy="50" r="48" fill="#F3E3C0"/>
  <path d="M14 100 Q16 78 50 76 Q84 78 86 100Z" fill="#22304A"/>${L ? `<g class="skin-teil">${L.hinten}</g>` : ""}
  <path d="M42 70 L58 70 L57 80 Q50 84 43 80Z" fill="#EBBC9C"/>
  <path d="M22 56 Q17 20 50 15 Q83 20 78 56 Q78 68 71 72 L66 71 Q70 42 50 37 Q30 42 34 71 L29 72 Q22 68 22 56Z" fill="#AFA184"/>
  <path d="M50 28.5 C61.5 28.5 68.3 37.5 68.3 48.5 C68.3 61 64 72 50 75.4 C36 72 31.7 61 31.7 48.5 C31.7 37.5 38.5 28.5 50 28.5Z" fill="#F0C9AA"/>
  <path d="M29 44 Q31 19 54 19 Q74 22 73 45 Q66 31 50 32 Q40 33 34 40 Q31 43 29 46Z" fill="#C6B999"/>
  <path d="M33 38 Q40 27 56 26 Q46 31 41 39Z" fill="#D8CFBA"/>
  <path d="M44 23 Q55 20 66 27" stroke="#E6E2D8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M27 50 Q26 60 30 68" stroke="#DCD6C8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M39.8 42.8 Q43.5 41.6 47 43 M53 43 Q56.5 41.6 60.2 42.8" stroke="#A89274" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <g class="augen"><g class="auge-l"><ellipse cx="43.5" cy="47.6" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="43.8" cy="47.800000000000004" r="1.75" fill="#7C9DB4"/><circle cx="43.8" cy="47.800000000000004" r=".8" fill="#1C2620"/><circle cx="44.4" cy="47.2" r=".45" fill="#fff"/><path d="M39.9 47.800000000000004 Q43.5 44.4 47.1 47.800000000000004" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M40.9 50.1 Q43.5 51.2 46.1 50.1" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/></g><g class="auge-r"><ellipse cx="56.5" cy="47.6" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="56.8" cy="47.800000000000004" r="1.75" fill="#7C9DB4"/><circle cx="56.8" cy="47.800000000000004" r=".8" fill="#1C2620"/><circle cx="57.4" cy="47.2" r=".45" fill="#fff"/><path d="M52.9 47.800000000000004 Q56.5 44.4 60.1 47.800000000000004" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M53.9 50.1 Q56.5 51.2 59.1 50.1" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/></g><path class="zwinker" d="M52.8 48 Q56.5 50.6 60.2 48" stroke="#3A2A22" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0"/></g>
  <path d="M37.6 47 L35.9 46.2 M62.4 47 L64.1 46.2" stroke="#D9A588" stroke-width=".7" stroke-linecap="round"/>
  <path d="M50.4 51 Q48.4 55.8 50.9 56.8" stroke="#D49A7C" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="mund"><path d="M43 62.6 Q50 69.1 57 62.6 Q50 64.3 43 62.6Z" fill="#9A3A2E"/><path d="M44.3 63 Q50 64.8 55.7 63 L55 64.2 Q50 65.6 45 64.2Z" fill="#FFFDF5"/></g>
  <ellipse cx="38.5" cy="56.5" rx="3.4" ry="2.1" fill="#E98B6E" opacity=".4"/><ellipse cx="61.5" cy="56.5" rx="3.4" ry="2.1" fill="#E98B6E" opacity=".4"/>
  <circle cx="31" cy="60" r="2.8" fill="none" stroke="#C9C3B6" stroke-width="1.3"/><circle cx="69" cy="60" r="2.8" fill="none" stroke="#C9C3B6" stroke-width="1.3"/>
  <g class="brille" opacity="0"><rect x="37.5" y="44" width="11.5" height="7.5" rx="3" fill="#1C2620"/><rect x="51" y="44" width="11.5" height="7.5" rx="3" fill="#1C2620"/><path d="M49 46.5 Q50 45.5 51 46.5 M37.5 46 L32 44.5 M62.5 46 L68 44.5" stroke="#1C2620" stroke-width="1.2" fill="none"/><path d="M39.5 45.5 L42 45.5" stroke="#fff" stroke-width=".9" opacity=".6"/></g>${L ? `<g class="skin-vorn skin-teil">${L.vorn}</g>` : ""}</g>
</svg>`;
}

/* Kleine Haar-/Bartstriche, immer gleich verteilt (fester Startwert): machen Bart und Stoppeln lebendig statt flächig */
function figStriche(seed, n, drin, farbe, breite, deck, laenge, box = [30, 40, 40, 40]) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let d = "";
  for (let i = 0, k = 0; i < n && k < n * 30; k++) {
    const x = box[0] + r() * box[2], y = box[1] + r() * box[3]; const w = (x - 50) * .035 + (r() - .5) * .5, l = laenge * (.7 + r() * .6);
    if (!drin(x, y) || !drin(x + Math.sin(w) * l, y + Math.cos(w) * l + .6)) continue; i++;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.sin(w) * l).toFixed(2)} ${(Math.cos(w) * l).toFixed(2)}`;
  }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${breite}" stroke-linecap="round" opacity="${deck}" fill="none"/>`;
}
/* Bartfläche von Max (und Dani): unterhalb der klaren Wangenlinie, innerhalb der Kieferlinie, Mund ausgespart */
function figImBart(x, y) {
  const dx = Math.abs(x - 50), jaw = ((x - 50) / 17.2) ** 2 + ((y - 50) / 19.4) ** 2 < 1; // Kinn kürzer (Max 22.10.)
  if (!jaw) return false;
  const wange = dx >= 15.6 ? 45.6 : dx >= 9 ? 57.8 - (dx - 9) / 6.4 * 7.2 : 62.8;
  return y > wange + .8;
}
/* Strickmuster (Zickzack-Reihen) für Pullis */
function figStrick(y0, y1, farbe, deck) {
  let d = "";
  for (let y = y0; y < y1; y += 2.4) { d += `M6 ${y.toFixed(1)}`; for (let x = 6, o = 0; x < 94; x += 1.5, o ^= 1) d += `L${(x + 1.5).toFixed(1)} ${(y + (o ? -.65 : .65)).toFixed(2)}`; }
  return `<path d="${d}" stroke="${farbe}" stroke-width=".45" fill="none" opacity="${deck}"/>`;
}
/* Lach-Gesicht (für maxLacht): Augen zu Lachfältchen, Mund weit offen – liegt unsichtbar im Bild und wird per CSS eingeblendet */
function figLachSchicht(o = {}) {
  const lid = o.lid || "#3A2A22", wange = o.wange || "#E07F62";
  return `<g class="lach"><path d="M40.4 47.2 Q44 43.6 47.6 47.2 M52.4 47.2 Q56 43.6 59.6 47.2" stroke="${lid}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M38.6 45.6 L37 44.8 M38.6 47.6 L36.8 48.2 M61.4 45.6 L63 44.8 M61.4 47.6 L63.2 48.2" stroke="${o.falte || "#C98E6E"}" stroke-width=".7" stroke-linecap="round"/><ellipse cx="38.4" cy="52.4" rx="3.6" ry="2" fill="${wange}" opacity=".42"/><ellipse cx="61.6" cy="52.4" rx="3.6" ry="2" fill="${wange}" opacity=".42"/>
  <path d="M42 59.2 Q50 57.6 58 59.2 Q57 67 50 67.4 Q43 67 42 59.2Z" fill="#6A231E"/><path d="M43 59.4 Q50 58.4 57 59.4 L56.5 61 Q50 61.7 43.5 61Z" fill="#FFFDF5"/><path d="M45.4 64.8 Q50 62.7 54.6 64.8 Q52.8 66.8 50 66.9 Q47.2 66.8 45.4 64.8Z" fill="#D0665A"/><path d="M43.4 64 Q50 68.7 56.6 64" stroke="${o.lippe || "#CF8A80"}" stroke-width="1" fill="none" stroke-linecap="round"/></g>`;
}

/* Porträt Max – nach seinem Foto: wuschelige braune Locken mit Strähnen in der Stirn, blaugraue Augen, gepflegter
   rötlich-brauner 7-Tage-Bart (kurz, dicht, flach, Haut schimmert durch) mit klarer Kontur an Wange und Hals, schmaler rasierter Spalt über der Oberlippe, schmale Lippen,
   kleine Creole, enge Silberkette mit Herz, grauer Strickpulli mit Streifen. */
/* Porträt Max – Feinschliff (Fassung A). Nach seinem Foto: wuschelige braune Locken mit Strähnen in der Stirn,
   blaugraue Augen, gepflegter rötlich-brauner 7-Tage-Bart mit klarer Kontur an Wange und Hals, schmaler rasierter Spalt
   über der Oberlippe, schmale Lippen, kleine Creole, enge silberne Gliederkette mit Herz, grau-schwarzer Zickzack-Strickpulli
   mit weinroten Streifen, blauer T-Shirt-Rand. Proportionen (Kopfform, Kinn, Augen, Nase, Mund) unverändert zu maxSVG.
   Licht kommt dezent von links oben (wie im Foto): rechte Gesichtshälfte und Hals liegen leicht im Schatten. */
function maxSVG(gr = 64) {
  const id = "mxa" + (maxSVG.n = (maxSVG.n || 0) + 1);
  const T = maxSVG.t || (maxSVG.t = (() => {
    /* Gliederkette: ovale Ringe entlang der Halslinie, abwechselnd flach und hochkant */
    const q = t => { const u = 1 - t; return [u * u * 41.4 + 2 * u * t * 50 + t * t * 58.6, u * u * 76.4 + 2 * u * t * 82.8 + t * t * 76.4]; };
    let kette = "", glanz = "";
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, [x, y] = q(t), [x2, y2] = q(Math.min(1, t + .01)), [x1, y1] = q(Math.max(0, t - .01));
      const a = (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI).toFixed(1), flach = i % 2 === 0;
      kette += `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${flach ? .95 : .78}" ry="${flach ? .62 : .5}" transform="rotate(${a} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;
      glanz += `M${(x - .5).toFixed(2)} ${(y - .35).toFixed(2)}l.55 -.12`;
    }
    return {
      bart: figStriche(7, 80, figImBart, "#5E2E17", ".28", ".26", .5) + figStriche(29, 70, figImBart, "#C08058", ".26", ".3", .45),
      hals: figStriche(23, 10, (x, y) => y > 70.4 && y < 74 && Math.abs(x - 50) < 10 - (y - 70) * .9, "#7A4428", ".24", ".13", .4, [36, 68, 28, 9]),
      strick: figStrick(83, 101, "#C4C7CC", ".6") + figStrick(84.2, 101, "#3E4148", ".45"),
      kette: `<g fill="none" stroke="#8A9099" stroke-width=".72">${kette}</g><g fill="none" stroke="#C7CBD1" stroke-width=".42">${kette}</g><path d="${glanz}" stroke="#F4F6F8" stroke-width=".3" stroke-linecap="round" opacity=".8"/>`
    };
  })());
  const gesicht = "M50 27.5 C61.2 27.5 67.6 35.5 67.6 46.5 C67.6 53 66.8 57 65 60.4 C62.6 65 57 68.4 50 69 C43 68.4 37.4 65 35 60.4 C33.2 57 32.4 53 32.4 46.5 C32.4 35.5 38.8 27.5 50 27.5Z";
  const pulli = "M8 100 Q10 81 50 79 Q90 81 92 100Z";
  return `<svg class="portrait max" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true"><defs><clipPath id="${id}"><path d="${pulli}"/></clipPath><clipPath id="${id}g"><path d="${gesicht}"/></clipPath></defs>
  <circle cx="50" cy="50" r="48" fill="#E7EDE4"/>
  <!-- Pulli: Zickzack-Strick, Streifenpaare weinrot/nachtblau, dünne schwarze Streifen; rechte Schulter etwas im Schatten -->
  <path d="${pulli}" fill="#6C6F76"/>
  <g clip-path="url(#${id})">${T.strick}
   <g stroke="#232838" stroke-width="1.3"><path d="M17.6 85 L14.6 100"/><path d="M27.4 82.2 L25.6 100"/><path d="M72.6 82.2 L74.4 100"/><path d="M82.4 85 L85.4 100"/></g>
   <g stroke="#742A37" stroke-width="3.2"><path d="M35.6 80.6 L34.4 100"/><path d="M64.4 80.6 L65.6 100"/></g>
   <g stroke="#262D45" stroke-width="1.5"><path d="M38.9 80.2 L38.3 100"/><path d="M61.1 80.2 L61.7 100"/></g>
   <path d="M60 79.6 Q86 81 92 100 L60 100Z" fill="#1E2230" opacity=".13"/><path d="M8 100 Q10 85 26 82 Q16 88 14 100Z" fill="#FFFFFF" opacity=".07"/>
  </g>
  <!-- Hals mit Schatten unter dem Kinn -->
  <path d="M41.6 60 L58.4 60 L58.2 82 Q50 85 41.8 82Z" fill="#DFA886"/>
  <path d="M52.6 68 Q57.6 66 58.4 61 L58.2 82 Q55.6 83.2 53 83.6Z" fill="#A9643F" opacity=".12"/>
  <path d="M38.6 62 C41 67.6 44.6 71.2 50 71.8 C55.4 71.2 59 67.6 61.4 62Z" fill="#7A4124" opacity=".22"/>${T.hals}
  <!-- Kragen: breiter Rippbund, rechts blitzt das blaue T-Shirt -->
  <path d="M36.2 79.6 Q50 88.4 63.8 79.6 L61.7 77.2 Q50 84.6 38.3 77.2Z" fill="#252B42"/>
  <path d="M37.3 78.5 Q50 86.6 62.7 78.5" stroke="#161B2C" stroke-width="2.2" fill="none" stroke-dasharray=".28 .82" opacity=".7"/>
  <path d="M54.6 80.3 Q58.8 79 61.8 77.1 L60.9 75.9 Q58.2 77.9 54.4 79.1Z" fill="#4C83B5"/><path d="M54.6 79.5 Q58.4 78.3 61.2 76.4" stroke="#7DAAD2" stroke-width=".3" fill="none" opacity=".8"/>
  <!-- Silberkette (eng, Glieder) mit Knebelverschluss und Herzanhänger -->
  ${T.kette}
  <g fill="none" stroke="#9AA0A8" stroke-width=".55"><circle cx="56.6" cy="78.6" r="1.15"/><path d="M55.4 80.4 L58.4 79.6" stroke-width=".7" stroke-linecap="round"/></g>
  <ellipse cx="50" cy="83.7" rx=".42" ry=".62" fill="none" stroke="#9AA0A8" stroke-width=".42"/>
  <path d="M50 87.9 C48.6 86.9 47.2 85.9 47.2 84.9 C47.2 84 48 83.6 48.6 83.8 C49.2 83.9 49.7 84.3 50 84.8 C50.3 84.3 50.8 83.9 51.4 83.8 C52 83.6 52.8 84 52.8 84.9 C52.8 85.9 51.4 86.9 50 87.9Z" fill="#D9DCE1" stroke="#9AA0A8" stroke-width=".35"/><path d="M48.2 84.8 Q48.6 84.2 49.3 84.4" stroke="#FFFFFF" stroke-width=".35" fill="none" stroke-linecap="round" opacity=".9"/>
  <!-- Haar hinten: dunkle Grundmasse, Schläfen und Nacken -->
  <path d="M30 51 C28.4 44 28.2 36.6 30.4 30.6 C32.2 24.6 37 20 43.2 18.6 C47.8 17.4 53.6 17.4 58.4 18.8 C64.6 20.6 69 25 70.4 31 C71.6 37 71.4 44 70 51 Q50 44 30 51Z" fill="#3F2A1B"/>
  <!-- Ohren -->
  <path d="M33.2 45.6 C31.2 44.6 29.2 45.6 29.1 48.2 C29 50.8 30 53.2 31.8 53.9 C32.8 54.3 33.6 53.6 33.6 52.6Z" fill="#DFA684"/><path d="M32.6 47.2 C31.2 46.6 30.3 47.4 30.4 48.8 C30.5 50.4 31.2 51.8 32.4 52.2" stroke="#BF8060" stroke-width=".55" fill="none" stroke-linecap="round"/>
  <path d="M66.8 45.6 C68.8 44.6 70.8 45.6 70.9 48.2 C71 50.8 70 53.2 68.2 53.9 C67.2 54.3 66.4 53.6 66.4 52.6Z" fill="#D69E7C"/><path d="M67.4 47.2 C68.8 46.6 69.7 47.4 69.6 48.8 C69.5 50.4 68.8 51.8 67.6 52.2" stroke="#B57858" stroke-width=".55" fill="none" stroke-linecap="round"/>
  <circle cx="69" cy="54.6" r="1.2" fill="none" stroke="#B9BDC4" stroke-width=".65"/><path d="M68.1 55.4 A1.2 1.2 0 0 0 69.9 55.4" stroke="#EEF0F2" stroke-width=".35" fill="none"/>
  <!-- Gesicht, Licht von links: rechte Hälfte leicht im Schatten -->
  <path d="${gesicht}" fill="#EAB996"/>
  <g clip-path="url(#${id}g)">
   <path d="M60.6 27 C66.6 34 66.4 50 63.4 60 C61.4 65.6 57 68.4 52 70 L70 70 L70 27Z" fill="#B5704A" opacity=".13"/>
   <ellipse cx="44.6" cy="51" rx="5" ry="3.4" fill="#F6D2B6" opacity=".35"/>
   <path d="M32 33 C36 36.6 44 38 50 38 C56 38 64 36.6 68 33 L68 42 C62 40.6 56 41.6 50 41.2 C44 41.6 38 40.6 32 42Z" fill="#8C4E2E" opacity=".14"/>
  </g>
  <!-- Bart: dichte, flache Fläche mit klarer Wangen- und Halskontur, Kinn dichter, feine Haarstriche -->
  <path d="M32.6 45 L34.6 45 L34.8 50.6 C36.4 53.6 38.4 56 41 57.8 L59 57.8 C61.6 56 63.6 53.6 65.2 50.6 L65.4 45 L67.4 45 C67.6 53 66.8 57 65 60.4 C62.6 65 57 68.4 50 69.2 C43 68.4 37.4 65 35 60.4 C33.2 57 32.4 53.5 32.6 45Z" fill="#8A4626" opacity=".46"/>
  <path d="M40.4 61 C42 64.6 45.4 66.6 50 67 C54.6 66.6 58 64.6 59.6 61 C60.4 63.8 58 67.2 54 68.4 C52.6 68.8 51.2 69 50 69.1 C48.8 69 47.4 68.8 46 68.4 C42 67.2 39.6 63.8 40.4 61Z" fill="#7A3C20" opacity=".16"/>
  <path d="M33.4 56.4 C33.8 58 34.4 59.4 35 60.4 C37.4 65 43 68.4 50 69.2 C57 68.4 62.6 65 65 60.4 C65.6 59.4 66.2 58 66.6 56.4 C64.6 62.6 59.4 67.8 50 68.6 C40.6 67.8 35.4 62.6 33.4 56.4Z" fill="#5E2E17" opacity=".16"/>
  <path d="M34.8 50.6 C36.4 53.6 38.4 56 41 57.8 M59 57.8 C61.6 56 63.6 53.6 65.2 50.6" stroke="#7A4124" stroke-width=".45" fill="none" opacity=".3"/>${T.bart}
  <!-- Koteletten: Haar läuft weich in den Bart über -->
  <path d="M32.5 37.4 C33.8 39.6 35.2 41.6 35.3 44.2 L35.1 47.6 Q34.1 48.6 32.8 47.8 C32.4 44.2 32.2 40.6 32.5 37.4Z M67.5 37.4 C66.2 39.6 64.8 41.6 64.7 44.2 L64.9 47.6 Q65.9 48.6 67.2 47.8 C67.6 44.2 67.8 40.6 67.5 37.4Z" fill="#4A3020"/>
  <path d="M33 47.6 L34.9 47.6 L34.8 50 Q33.9 50.6 33 49.8Z M67 47.6 L65.1 47.6 L65.2 50 Q66.1 50.6 67 49.8Z" fill="#6E3A20" opacity=".45"/>
  <!-- rasierter Spalt zwischen Schnurrbart und Oberlippe -->
  <path d="M41.6 58.9 Q46 57.8 50 58.3 Q54 57.8 58.4 58.9 Q54 60.6 50 60.5 Q46 60.6 41.6 58.9Z" fill="#E8B391"/>
  <!-- Haar vorn: Lockenmasse mit Strähnen in die Stirn -->
  <path d="M30.4 41.2 C29 36.6 29.4 31.8 31.8 28.4 C31.2 24.4 34.2 21 38 20.6 C40.2 17.4 44.4 16.2 47.8 17.4 C50.8 14.8 55.8 14 58.8 16.6 C62.8 15.4 67.4 18 68.2 22.4 C70.8 24.8 71.8 29 70.4 32.4 C71.6 35.6 70.8 39.4 68.8 41.6 C68.2 38.8 66.8 36.8 64.8 36 C64.6 37.8 63.6 39 62 39.4 C62.4 37 61 35.4 59 34.8 C58.6 36.8 57.2 38 55.2 38.4 C55.8 36.2 54.6 34.8 52.8 34.4 C52.2 36.8 50.2 38.6 47.6 39.2 C48.8 37.4 48.6 35.8 47.2 35 C45.6 37.2 43.6 39 41 39.8 C42.2 38 42 36.4 40.6 35.8 C39.6 37.8 38.2 39.2 36.2 39.8 C37 38.4 36.8 37.2 35.6 36.8 C34 38.6 32.4 40.4 30.4 41.2Z" fill="#634329"/>
  <!-- Licht auf den Locken (oben links) -->
  <g fill="#86613F">
   <path d="M33.4 31.4 C34 26.4 38.4 22.8 43.4 22.8 C40 24.6 37.6 27.6 36.6 31.6 C35.6 31 34.4 31 33.4 31.4Z"/>
   <path d="M45.4 22 C48 18.8 53.2 18 56.8 19.8 C53.4 20 50.6 21.4 49 23.8 C48 22.6 46.8 22 45.4 22Z"/>
   <path d="M58.8 23.8 C61.6 21.8 65.6 22.6 67.4 25.6 C64.8 24.8 62.4 25.2 60.8 26.8 C60.4 25.6 59.8 24.6 58.8 23.8Z"/>
   <path d="M39.6 33.4 C41.8 30.4 45.8 29.2 49 30.4 C46 31 43.6 32.6 42.4 35 C41.6 34 40.6 33.5 39.6 33.4Z"/>
   <path d="M52.6 30 C55.2 28.2 58.8 28.6 60.6 30.8 C58.2 30.4 56 30.8 54.6 32.2 C54.2 31.2 53.4 30.4 52.6 30Z"/>
   <path d="M63.4 30.2 C65.4 29.2 67.8 30.2 68.6 32.4 C66.8 31.8 65.4 32.2 64.6 33.4 C64.4 32.2 64 31 63.4 30.2Z"/>
  </g>
  <g fill="#A27A54" opacity=".75"><path d="M52.4 25.8 C55.6 24 59.8 24.4 62 26.6 C59.4 26 56.8 26.2 54.4 27.4Z"/><path d="M36 28 C37.4 25.6 39.8 24.2 42.2 24.2 C40 25.4 38.6 26.8 37.8 28.8Z"/><path d="M48.6 20.6 C50.4 19.4 52.8 19.2 54.6 19.8 C52.6 20.2 51 21 49.8 22.2Z"/><path d="M42 32 C43.4 30.8 45.4 30.4 47 30.8 C45.4 31.4 44.2 32.2 43.4 33.4Z"/></g>
  <!-- Schatten zwischen den Locken -->
  <g fill="#3F2A1B" opacity=".85">
   <path d="M36.6 31.6 C37.8 32.4 38.6 33.6 38.8 35.2 C37.8 34 36.6 33.4 35.2 33.2 C35.8 32.8 36.2 32.2 36.6 31.6Z"/>
   <path d="M49 23.8 C50.2 25 50.6 26.6 50.2 28.4 C49.6 27 48.6 26 47.2 25.6 C48 25.2 48.6 24.6 49 23.8Z"/>
   <path d="M60.8 26.8 C61.8 28 62 29.6 61.4 31.2 C61 29.8 60.2 28.8 58.8 28.4 C59.6 28 60.4 27.4 60.8 26.8Z"/>
   <path d="M42.4 35 C43.2 36.2 43.4 37.4 43 38.6 C42.6 37.6 41.8 36.8 40.8 36.6 C41.4 36.2 42 35.6 42.4 35Z"/>
   <path d="M54.6 32.2 C55.6 33.2 55.8 34.4 55.4 35.6 C55 34.6 54.2 33.8 53.2 33.6 C53.8 33.2 54.2 32.8 54.6 32.2Z"/>
   <path d="M30.8 34 C31.6 35.6 32 37.2 31.6 39 C31 37.6 30.6 36 30.8 34Z M69.6 34 C69 35.8 68.4 37.2 67.4 38.2 C68 36.6 68.6 35.2 69.6 34Z"/>
  </g>
  <!-- Strähnen in der Stirn: einzelne Locken, die über den Haaransatz fallen -->
  <path d="M46.6 35.8 C43.6 36.8 42 39 42.8 40.8 C43.4 40 44.4 39.6 45.2 39.9 C44.4 38.8 45 37.2 47.4 36.6Z M52.8 35.4 C55.8 36 57.4 37.8 57 39.8 C56.4 39 55.4 38.8 54.6 39.2 C55.2 37.8 54.4 36.6 52.4 36.2Z" fill="#634329"/>
  <!-- abstehende Härchen oben und die Locke links -->
  <path d="M54.2 17 C54.8 13.6 57.6 11.6 60.6 12.2 C58.2 13 56.8 14.8 56.6 17.2Z M60.6 17.6 C62.6 14.8 65.8 14 68.2 15.4 C65.6 15.6 63.8 16.8 62.8 18.6Z" fill="#634329"/>
  <path d="M58 16.8 Q60.4 13 63.8 12" stroke="#634329" stroke-width=".45" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M31.4 29.8 C28.6 29.2 26.6 30.8 26.9 33.2 C27.2 34.9 28.8 35.9 30.2 35.2 C29 34.9 28.4 33.9 28.8 32.9 C29.2 31.9 30.4 31.7 31.2 32.2Z M70.2 32.6 C72.6 33 74 35.2 73.2 37.6 C72.8 38.8 71.8 39.4 70.8 39.2 C71.6 38.4 71.8 37.2 71.2 36.2 C70.8 35.6 70.2 35.4 69.6 35.6Z" fill="#634329"/><path d="M29.8 30.8 C28.6 31 27.8 32 27.9 33.2" stroke="#86613F" stroke-width=".5" fill="none" stroke-linecap="round"/>
  <g stroke="#B08A64" stroke-width=".4" fill="none" stroke-linecap="round" opacity=".7"><path d="M38.4 23.2 q3 -1.6 5.6 -.6"/><path d="M50.4 19 q2.6 -.8 4.8 .2"/><path d="M61.4 22.2 q2.4 0 3.8 1.4"/><path d="M43.4 30.2 q2 -.8 3.8 -.4"/></g>
  <g class="brauen" fill="#4A3322"><path d="M39.4 42.8 Q43.2 39.8 47.8 41 L47.6 42.6 Q43.6 41.8 39.8 43.8Z"/><path d="M60.6 42.8 Q56.8 39.8 52.2 41 L52.4 42.6 Q56.4 41.8 60.2 43.8Z"/></g>
  <g class="augen"><g class="auge-l"><ellipse cx="44" cy="46.4" rx="3.2" ry="1.85" fill="#FFFDF5"/><circle cx="44.3" cy="46.5" r="1.7" fill="#8AA4AE"/><circle cx="44.3" cy="46.5" r=".78" fill="#1C2620"/><circle cx="44.9" cy="45.9" r=".45" fill="#fff"/><path d="M40.4 46.5 Q44 43.1 47.6 46.5" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M41.4 48.8 Q44 49.9 46.6 48.8" stroke="#D29C7E" stroke-width=".7" fill="none" stroke-linecap="round"/></g><g class="auge-r"><ellipse cx="56" cy="46.4" rx="3.2" ry="1.85" fill="#FFFDF5"/><circle cx="56.3" cy="46.5" r="1.7" fill="#8AA4AE"/><circle cx="56.3" cy="46.5" r=".78" fill="#1C2620"/><circle cx="56.9" cy="45.9" r=".45" fill="#fff"/><path d="M52.4 46.5 Q56 43.1 59.6 46.5" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M53.4 48.8 Q56 49.9 58.6 48.8" stroke="#D29C7E" stroke-width=".7" fill="none" stroke-linecap="round"/></g></g>
  <path d="M49.4 45.8 Q49.8 50.6 51.7 52.9 Q51.5 54.6 49.8 54.6 M47.1 53.5 Q47.5 54.9 48.9 54.9" stroke="#C68767" stroke-width=".95" fill="none" stroke-linecap="round"/>
  <ellipse cx="38.6" cy="51.8" rx="3" ry="1.6" fill="#E58468" opacity=".22"/><ellipse cx="61.4" cy="51.8" rx="3" ry="1.6" fill="#E58468" opacity=".22"/>
  <g class="mund"><path d="M43.2 59.7 Q46.6 58.9 50 59.4 Q53.4 58.9 56.8 59.7 Q53.4 60.5 50 60.4 Q46.6 60.5 43.2 59.7Z" fill="#BE7166"/><path d="M44.6 60.5 Q50 61.3 55.4 60.5 Q53.6 62.2 50 62.3 Q46.4 62.2 44.6 60.5Z" fill="#D28C82"/><path d="M42.9 59.4 Q50 61.1 57.1 59.4" stroke="#7A3830" stroke-width=".6" fill="none" stroke-linecap="round"/></g>
  ${figLachSchicht()}
  <!-- Schnurrbart -->
  <path d="M40.8 58.7 Q42.6 55.9 46.6 55.9 Q48.8 55.9 50 56.6 Q51.2 55.9 53.4 55.9 Q57.4 55.9 59.2 58.7 Q56.6 57.6 53 57.9 Q51 57.9 50 58.3 Q49 57.9 47 57.9 Q43.4 57.6 40.8 58.7Z" fill="#7A3E22" opacity=".55"/>
  <path d="M43 57.2 l-.4 .8 M45.2 56.6 l-.3 .9 M47.4 56.4 l-.15 .9 M52.6 56.4 l.15 .9 M54.8 56.6 l.3 .9 M57 57.2 l.4 .8" stroke="#5E2E17" stroke-width=".4" stroke-linecap="round" opacity=".5"/>
  <path d="M44 56.5 l-.2 .7 M46.4 56.2 l-.1 .8 M53.6 56.2 l.1 .8 M56 56.5 l.2 .7" stroke="#B8774E" stroke-width=".35" stroke-linecap="round" opacity=".55"/>
</svg>`;
}

/* Dani (Daniel, Ritas Sohn in Schweden): sieht aus wie Max – aber wirklich schwarze, kurz geschorene Haare mit deutlichen Geheimratsecken,
   schwarze, dichte Augenbrauen, sehr heller (birkenheller) Teint, nur ein Hauch schwarzer Stoppeln, etwas größere Nase,
   immer am Lächeln (breit, mit Zähnen), grüner Pulli mit Reißverschlusskragen */
function daniSVG(gr = 64) {
  const T = daniSVG.t || (daniSVG.t = {
    kopf: figStriche(31, 160, (x, y) => { const dx = Math.abs(x - 50), k = ((x - 50) / 18.2) ** 2 + ((y - 45) / 23.8) ** 2 < 1; return k && y < 44 && y < (dx < 3.4 ? 31.4 : dx < 8 ? 31.4 - (dx - 3.4) * .5 : 29.1 + (dx - 8) * .8) - .4; }, "#4A5058", ".35", ".3", .25, [30, 20, 40, 26]),
    bart: figStriche(37, 110, (x, y) => { const dx = Math.abs(x - 50), k = ((x - 50) / 17.6) ** 2 + ((y - 47) / 25) ** 2 < 1, w = dx >= 15 ? 48.4 : dx >= 8.6 ? 57.6 - (dx - 8.6) / 6.4 * 8.6 : 56; return k && y > w + .6 && !(dx < 10.6 && y > 57.4 && y < 68.4); }, "#0E0C0B", ".24", ".18", .18, [31, 46, 38, 28])
  });
  return `<svg class="portrait dani" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#DCE6EF"/>
  <path d="M8 100 Q10 80 50 78 Q90 80 92 100Z" fill="#3E6A52"/><path d="M20 90 Q50 85 80 90" stroke="#35604A" stroke-width="1" fill="none" stroke-dasharray="2 2.4"/>
  <path d="M41.4 61 L58.6 61 L58.4 80 Q50 83 41.6 80Z" fill="#EFD8CB"/><path d="M41.6 66 Q50 71 58.4 66 L58.4 69 Q50 73 41.6 69Z" fill="#C9B6AC" opacity=".35"/>
  <path d="M36.6 79.6 Q50 85.6 63.4 79.6 L62.6 74.4 Q50 81.2 37.4 74.4Z" fill="#2E5541"/><path d="M50 82.4 L50 100" stroke="#C7C0A6" stroke-width=".8"/><rect x="49" y="82.4" width="2" height="3.2" rx=".6" fill="#C7C0A6"/>
  <ellipse cx="31.2" cy="49.4" rx="3" ry="4.8" fill="#F3DACD"/><ellipse cx="68.8" cy="49.4" rx="3" ry="4.8" fill="#F3DACD"/><path d="M30.8 47 Q29.6 49.4 31 52 M69.2 47 Q70.4 49.4 69 52" stroke="#C88A68" stroke-width=".6" fill="none"/>
  <path d="M50 21 C62.6 21 68.6 31 68.6 45 C68.6 53.6 67.6 58.6 65.4 62.6 C62.6 67.8 57 71.8 50 72.6 C43 71.8 37.4 67.8 34.6 62.6 C32.4 58.6 31.4 53.6 31.4 45 C31.4 31 37.4 21 50 21Z" fill="#FAEAE1"/>
  <path d="M38.4 31.4 Q40.8 28.6 43.6 29 Q46.6 31.6 50 32 Q53.4 31.6 56.4 29 Q59.2 28.6 61.6 31.4 Q59.6 33.6 56 33.4 Q53 33.6 50 33.8 Q47 33.6 44 33.4 Q40.4 33.6 38.4 31.4Z" fill="#B9A8A0" opacity=".2"/>
  <path d="M31.6 46.4 C31.2 30 37.4 20.6 50 20.6 C62.6 20.6 68.8 30 68.4 46.4 L66.9 46.4 Q66.9 40.6 65.6 36.6 Q64.2 32.6 62 31 Q59.6 29 57.2 29.4 Q54.6 30.6 52.8 31.4 Q51.4 31.8 50 31.8 Q48.6 31.8 47.2 31.4 Q45.4 30.6 42.8 29.4 Q40.4 29 38 31 Q35.8 32.6 34.4 36.6 Q33.1 40.6 33.1 46.4Z" fill="#0E0C0B" opacity=".9"/>
  <path d="M31.9 46.4 C31.6 31 37.6 21.4 50 21.4 C62.4 21.4 68.4 31 68.1 46.4 L67.3 46.4 Q67.2 40.4 65.9 36.4 Q64.5 32.2 62.4 30.4 Q59.8 28.2 57 28.6 Q54.4 29.8 52.6 30.6 Q51.3 31 50 31 Q48.7 31 47.4 30.6 Q45.6 29.8 43 28.6 Q40.2 28.2 37.6 30.4 Q35.5 32.2 34.1 36.4 Q32.8 40.4 32.7 46.4Z" fill="none" stroke="#0E0C0B" stroke-width="1.4" stroke-dasharray=".35 .5" opacity=".55"/>
  <path d="M41 24.2 Q45.6 22 51.4 22.6" stroke="#6E7884" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".28"/>${T.kopf}
  <path d="M32.4 48 L34.8 48 C35.6 54 38.4 57.6 41.6 57.6 Q50 55.2 58.4 57.6 C61.6 57.6 64.4 54 65.2 48 L67.6 48 C67.6 56 66.6 60 65.2 62.6 C62.4 67.8 57 71.8 50 72.6 C43 71.8 37.6 67.8 34.8 62.6 C33.4 60 32.4 56 32.4 48Z" fill="#2B2F38" opacity=".07"/>${T.bart}
  <g class="brauen" fill="#0E0C0B"><path d="M38.4 42.8 Q42.8 39 48.6 40.2 L48.4 42.9 Q43.6 41.8 39.1 44.2Z"/><path d="M61.6 42.8 Q57.2 39 51.4 40.2 L51.6 42.9 Q56.4 41.8 60.9 44.2Z"/><path d="M39.6 42.6 l.9 -1.1 M42 41.2 l.9 -1 M44.6 40.5 l.8 -.8 M47 40.3 l.7 -.7 M60.4 42.6 l-.9 -1.1 M58 41.2 l-.9 -1 M55.4 40.5 l-.8 -.8 M53 40.3 l-.7 -.7" stroke="#0E0C0B" stroke-width=".45" stroke-linecap="round"/></g>
  <g class="augen"><g class="auge-l"><ellipse cx="44" cy="46.6" rx="3.1" ry="1.6" fill="#FFFDF5"/><circle cx="44.3" cy="46.6" r="1.55" fill="#7E97A3"/><circle cx="44.3" cy="46.6" r=".72" fill="#1C2620"/><circle cx="44.8" cy="46.1" r=".4" fill="#fff"/><path d="M40.4 46.6 Q44 43.4 47.6 46.6" stroke="#2A201C" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M41 48.2 Q44 49.6 47 48.2" stroke="#E2B49C" stroke-width=".8" fill="none" stroke-linecap="round"/></g><g class="auge-r"><ellipse cx="56" cy="46.6" rx="3.1" ry="1.6" fill="#FFFDF5"/><circle cx="56.3" cy="46.6" r="1.55" fill="#7E97A3"/><circle cx="56.3" cy="46.6" r=".72" fill="#1C2620"/><circle cx="56.8" cy="46.1" r=".4" fill="#fff"/><path d="M52.4 46.6 Q56 43.4 59.6 46.6" stroke="#2A201C" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M53 48.2 Q56 49.6 59 48.2" stroke="#E2B49C" stroke-width=".8" fill="none" stroke-linecap="round"/></g></g>
  <path d="M38.6 46.4 L37 45.8 M61.4 46.4 L63 45.8" stroke="#E2B49C" stroke-width=".6" stroke-linecap="round"/>
  <path d="M46.6 55.6 Q45.8 53.2 47.8 52.4 Q50 51.4 52.2 52.4 Q54.2 53.2 53.4 55.6 Q51.8 57 50 56.8 Q48.2 57 46.6 55.6Z" fill="#E9B8A0" opacity=".55"/>
  <path d="M49.6 45 Q50.2 50.4 53 53.4 Q54 56 51 56.6 M46.4 54 Q46.2 56.4 48.8 56.6" stroke="#D39C82" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M38.2 55.4 Q36.6 59.4 38.8 63 M61.8 55.4 Q63.4 59.4 61.2 63" stroke="#DDA990" stroke-width=".8" fill="none" stroke-linecap="round"/>
  <ellipse cx="38.4" cy="52.6" rx="3.3" ry="1.8" fill="#E58468" opacity=".3"/><ellipse cx="61.6" cy="52.6" rx="3.3" ry="1.8" fill="#E58468" opacity=".3"/>
  <g class="mund"><path d="M39.8 59.4 Q50 58 60.2 59.4 Q57.8 67 50 67.4 Q42.2 67 39.8 59.4Z" fill="#7A2E28"/><path d="M40.8 59.7 Q50 58.8 59.2 59.7 L58.4 61.8 Q50 62.6 41.6 61.8Z" fill="#FFFDF5"/><path d="M45 65 Q50 63.2 55 65 Q53 66.9 50 67 Q47 66.9 45 65Z" fill="#D0665A"/><path d="M39.2 59.2 Q50 57.4 60.8 59.2" stroke="#B66A5E" stroke-width=".8" fill="none" stroke-linecap="round"/></g>
  ${figLachSchicht({ lid: "#2A201C" })}
</svg>`;
}
/* Linus (Ritas Enkel): Wuschelkopf mit Wirbel, Sommersprossen, fröhliches Lächeln, geringeltes Shirt */
function linusSVG(gr = 64) {
  const id = "ln" + (linusSVG.n = (linusSVG.n || 0) + 1);
  return `<svg class="portrait linus" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true"><defs><clipPath id="${id}"><path d="M14 100 Q16 78 50 76 Q84 78 86 100Z"/></clipPath></defs>
  <circle cx="50" cy="50" r="48" fill="#F5E6C8"/>
  <path d="M14 100 Q16 78 50 76 Q84 78 86 100Z" fill="#C8473B"/><g clip-path="url(#${id})" stroke="#F4E6CC" stroke-width="2.6"><path d="M10 84 H90"/><path d="M10 90.4 H90"/><path d="M10 96.8 H90"/></g>
  <path d="M40 76.6 Q50 82 60 76.6" stroke="#A8362C" stroke-width="2" fill="none"/>
  <path d="M44 64 L56 64 L55.6 76.6 Q50 79 44.4 76.6Z" fill="#F0C6A8"/>
  <ellipse cx="33.2" cy="51" rx="3" ry="4" fill="#F0C2A4"/><ellipse cx="66.8" cy="51" rx="3" ry="4" fill="#F0C2A4"/>
  <path d="M50 30 C61 30 66.6 38.6 66.6 49 C66.6 61 60 69.6 50 70.4 C40 69.6 33.4 61 33.4 49 C33.4 38.6 39 30 50 30Z" fill="#F5D0B4"/>
  <path d="M32.4 47 Q30 31 42 26 Q50 22.4 58.6 25.4 Q69.6 30 67.6 47 Q66.4 40 62.6 37.6 Q61.6 41.6 57.4 41.8 Q58.6 38 56 36.6 Q53 40.8 47.6 41 Q49.4 37.8 47.2 36.4 Q42.6 39.6 40.6 42.6 Q39.6 38.8 37.6 38.8 Q34.4 41.4 32.4 47Z" fill="#B98A4E"/>
  <path d="M49.4 25 Q50.4 18.6 55.6 18.8 Q52.4 20.8 52.6 24.8Z M41 27.6 Q38 24.4 39.6 21.6 Q40.6 24.6 43.6 26Z" fill="#B98A4E"/><path d="M42 30 q3 -2.4 6 -.6 M54 29.4 q3 -1.6 5.6 .6" stroke="#D6AE70" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M40.6 43.4 Q43.6 42.2 46.6 43.2 M53.4 43.2 Q56.4 42.2 59.4 43.4" stroke="#A4793F" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="augen"><g class="auge-l"><ellipse cx="43.8" cy="48" rx="3.3" ry="2.5" fill="#FFFDF5"/><circle cx="44" cy="48.2" r="2.1" fill="#7D93A6"/><circle cx="44" cy="48.2" r=".95" fill="#1C2620"/><circle cx="44.7" cy="47.4" r=".6" fill="#fff"/></g><g class="auge-r"><ellipse cx="56.2" cy="48" rx="3.3" ry="2.5" fill="#FFFDF5"/><circle cx="56" cy="48.2" r="2.1" fill="#7D93A6"/><circle cx="56" cy="48.2" r=".95" fill="#1C2620"/><circle cx="56.7" cy="47.4" r=".6" fill="#fff"/></g></g>
  <path d="M50.4 51.4 Q49 54.4 50.8 55" stroke="#D69878" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g fill="#C98A5E" opacity=".55"><circle cx="40" cy="54" r=".55"/><circle cx="42" cy="55.2" r=".5"/><circle cx="41.4" cy="53" r=".45"/><circle cx="46" cy="53.4" r=".45"/><circle cx="60" cy="54" r=".55"/><circle cx="58" cy="55.2" r=".5"/><circle cx="58.6" cy="53" r=".45"/><circle cx="54" cy="53.4" r=".45"/></g>
  <ellipse cx="39.4" cy="57" rx="3.2" ry="1.9" fill="#EE8A74" opacity=".38"/><ellipse cx="60.6" cy="57" rx="3.2" ry="1.9" fill="#EE8A74" opacity=".38"/>
  <g class="mund"><path d="M44 59.6 Q50 59 56 59.6 Q54.6 63.8 50 64 Q45.4 63.8 44 59.6Z" fill="#9A3A33"/><path d="M44.9 59.8 Q50 59.3 55.1 59.8 Q54.8 61.2 50 61.5 Q45.2 61.2 44.9 59.8Z" fill="#FFFDF5"/><path d="M43.4 59.3 Q50 60.2 56.6 59.3" stroke="#B5524A" stroke-width=".7" fill="none" stroke-linecap="round"/><path d="M46.6 64.6 Q50 65.6 53.4 64.6" stroke="#E2A08C" stroke-width=".7" fill="none" stroke-linecap="round"/></g>
</svg>`;
}

/* Hühnchen von vorn (nur Kopf) – für das „Kopf zum Betrachter drehen“ */
function huhnFrontSVG(gr = 150, opt = {}) {
  const L = typeof skinSchichten === "function" ? skinSchichten("huhn", "front", opt.skin) : null;
  return `<svg class="huhn huhn-front${L ? " mit-skin" : ""}" viewBox="${L && L.vb || "40 6 56 52"}" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <g class="huhn-kopf">
    <path class="hg-kopfform" d="M68 17 C79 17 86 25 86 35 C86 45 78 52 68 52 C58 52 50 45 50 35 C50 25 57 17 68 17Z" fill="#E4B24F"/>
    <g class="huhn-kamm" fill="#D9473A"${L && L.ohneKamm ? ' style="display:none"' : ""}><circle cx="62.5" cy="16" r="4.6"/><circle cx="68" cy="12.6" r="5.4"/><circle cx="73.5" cy="16" r="4.6"/></g>
    <path class="hg-rotkopf" d="M68 17 C79 17 86 25 86 35 C86 45 78 52 68 52 C58 52 50 45 50 35 C50 25 57 17 68 17Z" fill="#E2584A"/>
    <ellipse cx="56.5" cy="41" rx="3.6" ry="2.3" fill="#EE8E78" opacity=".55"/><ellipse cx="79.5" cy="41" rx="3.6" ry="2.3" fill="#EE8E78" opacity=".55"/>
    <g class="hg-striche" stroke="#B8382C" stroke-width="1.3" stroke-linecap="round"><path d="M54 39 L53 42.5"/><path d="M57 39 L56 42.5"/><path d="M80 39 L79 42.5"/><path d="M83 39 L82 42.5"/></g>
    <g class="huhn-augen">
      <ellipse cx="61" cy="31" rx="6.4" ry="7.4" fill="#FFFDF5"/><ellipse cx="75" cy="31" rx="6.4" ry="7.4" fill="#FFFDF5"/>
      <g class="pupillen"><circle cx="62.2" cy="32" r="3.9" fill="#1C2620"/><circle cx="73.8" cy="32" r="3.9" fill="#1C2620"/><circle cx="63.6" cy="30.2" r="1.4" fill="#fff"/><circle cx="75.2" cy="30.2" r="1.4" fill="#fff"/></g>
      <path class="froh" style="display:none" d="M56 33 Q61 26.5 66 33 M70 33 Q75 26.5 80 33" stroke="#1C2620" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <g class="lider" fill="#E4B24F" opacity="0"><ellipse cx="61" cy="31" rx="7" ry="8"/><ellipse cx="75" cy="31" rx="7" ry="8"/></g>
    </g>
    <ellipse class="hg-lid-r" cx="75" cy="31" rx="7" ry="8" fill="#E4B24F" opacity="0"/>
    <g class="hg-brille" opacity="0"><path d="M53.5 26.5 H66 Q66.6 26.5 66.4 27.2 L65 34.5 Q64.5 36.6 62 36.6 H57.6 Q55 36.6 54.4 34.4 L53 27.4 Q52.9 26.5 53.5 26.5Z M70 26.5 H82.5 Q83.1 26.5 83 27.4 L81.6 34.4 Q81 36.6 78.4 36.6 H74 Q71.5 36.6 71 34.5 L69.6 27.2 Q69.4 26.5 70 26.5Z" fill="#1C2620"/><path d="M66 28.4 H70" stroke="#1C2620" stroke-width="1.6"/><path d="M55.6 28.6 L58.6 28.6 M72.2 28.6 L75.2 28.6" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".7"/></g>
    <g class="hg-brauen" stroke="#8A5A1E" stroke-width="1.9" stroke-linecap="round" fill="none"><path class="braue-l" d="M56.5 21.8 Q61 19.6 65 21.4"/><path class="braue-r" d="M71 21.4 Q75 19.6 79.5 21.8"/></g>
    <path d="M66 46.5 Q68 53 70 46.5 Q68 47.6 66 46.5Z" fill="#D9473A"/>
    <g class="huhn-schnabel"><path class="unten" d="M65.6 41.6 L70.4 41.6 L68 46Z" fill="#D9921C"/><path class="oben" d="M63.6 37.8 Q68 36.2 72.4 37.8 L68 43.6Z" fill="#F4B92A"/></g>
    ${L ? `<g class="skin-kopf">${L.kopf}</g>` : ""}
  </g>
</svg>`;
}

/* Christiane: blonder Bob, rote runde Brille, pinke Jacke, blauer Schal */
function janeSVG(gr = 64) {
  return `<svg class="portrait jane" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#F6E4E6"/>
  <path d="M29.5 44 Q27.5 21.5 50 21.5 Q72.5 21.5 70.5 44 L71.5 64 Q69 71 62 69.5 L38 69.5 Q31 71 28.5 64Z" fill="#D7B970"/>
  <path d="M12 100 Q14 77 50 75 Q86 77 88 100Z" fill="#A8336A"/>
  <path d="M42 68 L58 68 L57 77 Q50 81 43 77Z" fill="#E9B998"/>
  <path d="M36 76 Q50 86 64 76 L60 84 Q50 90 40 84Z" fill="#2E3A66"/><path d="M47 82 L44 94 L50 90 L56 95 L53 82Z" fill="#3A4778"/>
  <path d="M50 28.5 C61 28.5 67.5 37.5 67.5 48.5 C67.5 60.5 62.5 70.5 50 74 C37.5 70.5 32.5 60.5 32.5 48.5 C32.5 37.5 39 28.5 50 28.5Z" fill="#F1C7A8"/>
  <path d="M31 47 Q29 25 50 24.5 Q69.5 25 69.5 41 Q62 31 50 32.5 Q40 34 33.5 41 Q32 44 31 47Z" fill="#E8D08F"/>
  <path d="M69.5 41 Q71 52 69 64 L66.6 62 Q68 52 67.4 42Z M31 47 Q30 56 32 64 L34 62 Q32.6 54 33.4 44Z" fill="#E1C47F"/>
  <path d="M39 30 Q47 27.5 58 30.5" stroke="#F4E4B0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <g class="augen"><ellipse cx="43.5" cy="47.8" rx="3" ry="1.8" fill="#FFFDF5"/><circle cx="43.8" cy="48" r="1.6" fill="#6E8C86"/><circle cx="43.8" cy="48" r=".75" fill="#1C2620"/></g>
  <g class="augen"><ellipse cx="56.5" cy="47.8" rx="3" ry="1.8" fill="#FFFDF5"/><circle cx="56.2" cy="48" r="1.6" fill="#6E8C86"/><circle cx="56.2" cy="48" r=".75" fill="#1C2620"/></g>
  <g class="jane-brille"><path d="M38 44 Q38.5 41 43.5 41.2 Q48.3 41.4 48 45.4 Q47.5 51.6 43 51.6 Q38.4 51.4 38 47Z M52 45.4 Q51.7 41.4 56.5 41.2 Q61.5 41 62 44 L62 47 Q61.6 51.4 57 51.6 Q52.5 51.6 52 45.4Z" stroke="#D2342C" stroke-width="1.6" fill="none"/><path d="M48 45 Q50 43.8 52 45" stroke="#D2342C" stroke-width="1.3" fill="none"/></g>
  <path d="M39.5 40 Q43.5 38.6 47 39.8 M53 39.8 Q56.5 38.6 60.5 40" stroke="#B89A5E" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M50.4 50.5 Q48.6 55 50.8 56" stroke="#D29A7A" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="mund"><path d="M43.5 61.5 Q50 66.4 56.5 61.5 Q50 63 43.5 61.5Z" fill="#B0505A"/></g>
  <rect x="31.2" y="55.5" width="3" height="3" rx=".6" fill="#2F7A8E"/><rect x="65.8" y="55.5" width="3" height="3" rx=".6" fill="#E2A93B"/>
  <ellipse cx="38.5" cy="56" rx="3.2" ry="1.9" fill="#E07F72" opacity=".35"/><ellipse cx="61.5" cy="56" rx="3.2" ry="1.9" fill="#E07F72" opacity=".35"/>
</svg>`;
}
/* Micha: Glatze mit kurzem Haarkranz, blaues Polo, freundlich-verschmitzt */
function michaSVG(gr = 64) {
  return `<svg class="portrait micha" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#E5ECE2"/>
  <path d="M12 100 Q14 76 50 74 Q86 76 88 100Z" fill="#26345A"/>
  <path d="M41 74 L50 84 L59 74 L62 77 L50 90 L38 77Z" fill="#1E2A4A"/><circle cx="50" cy="86" r=".9" fill="#0E1426"/>
  <path d="M42 66 L58 66 L57.5 76 Q50 80 42.5 76Z" fill="#DDA582"/>
  <path d="M50 22 C62.5 22 69 32 69 46 C69 59 62.5 69.5 50 72.5 C37.5 69.5 31 59 31 46 C31 32 37.5 22 50 22Z" fill="#E8B391"/>
  <path d="M31.5 42 Q30.5 50 33 55 L34.6 54 Q33 48 33.6 42Z M68.5 42 Q69.5 50 67 55 L65.4 54 Q67 48 66.4 42Z" fill="#B49C86"/>
  <ellipse cx="30.8" cy="50" rx="2.6" ry="4.4" fill="#E0A886"/><ellipse cx="69.2" cy="50" rx="2.6" ry="4.4" fill="#E0A886"/>
  <path d="M42 27 Q50 24.5 58 27" stroke="#F6D4BC" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M39.6 42.4 Q43.5 41 47 42.2 M53 42.2 Q56.5 41 60.4 42.4" stroke="#8C7660" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <g class="augen"><ellipse cx="43.5" cy="46.6" rx="3" ry="1.6" fill="#FFFDF5"/><circle cx="43.8" cy="46.7" r="1.5" fill="#6F8A7E"/><circle cx="43.8" cy="46.7" r=".7" fill="#1C2620"/></g>
  <g class="augen"><ellipse cx="56.5" cy="46.6" rx="3" ry="1.6" fill="#FFFDF5"/><circle cx="56.2" cy="46.7" r="1.5" fill="#6F8A7E"/><circle cx="56.2" cy="46.7" r=".7" fill="#1C2620"/></g>
  <path d="M39.6 48.6 Q41.5 49.8 43.2 49.4 M60.4 48.6 Q58.5 49.8 56.8 49.4" stroke="#C88C6C" stroke-width=".7" fill="none" stroke-linecap="round"/>
  <path d="M50.3 49.5 Q48.2 55.6 51 56.6" stroke="#C88C6C" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <g class="mund"><path d="M43.6 61 Q50 64.6 56.4 61" stroke="#9A4E3E" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>
  <ellipse cx="39" cy="55" rx="3.2" ry="1.9" fill="#E07F62" opacity=".3"/><ellipse cx="61" cy="55" rx="3.2" ry="1.9" fill="#E07F62" opacity=".3"/>
</svg>`;
}
/* Karin (Brieffreundin in Vimmerby, ausgedacht): weißblonder Zopfkranz, roter Strickpulli mit Muster, Dala-Pferd-Anhänger */
function karinKopfSVG(gr = 64) {
  return `<svg class="portrait karin" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#DCE8F2"/>
  <path d="M12 100 Q14 76 50 74 Q86 76 88 100Z" fill="#B8352C"/>
  <path d="M14 92 Q50 86 86 92" stroke="#F3E6CF" stroke-width="2.4" fill="none" stroke-dasharray="3 3"/>
  <path d="M42 67 L58 67 L57.5 76 Q50 80 42.5 76Z" fill="#F0C6AA"/>
  <path d="M46.5 82 Q48 80.5 50.5 81 L53 79.6 L53.6 81.6 L55 82.4 L54 85 L53.4 88 L52.2 88 L52 85.4 L48.6 85.4 L48.4 88 L47.2 88 Z" fill="#2F5E8E"/><path d="M50 78 L50 81" stroke="#C9A24A" stroke-width=".8"/>
  <path d="M50 27.5 C61.5 27.5 68 37 68 48 C68 60 62 70.5 50 73.6 C38 70.5 32 60 32 48 C32 37 38.5 27.5 50 27.5Z" fill="#F4D0B5"/>
  <path d="M31 46 Q28.5 24 50 23 Q71.5 24 69 46 Q66 33 50 32 Q34 33 31 46Z" fill="#EDE0BC"/>
  <path d="M37 33 Q44 30.5 50 32 Q56 30.5 63 33" stroke="#F8F0DA" stroke-width="1" fill="none" opacity=".8"/>
  <path d="M30 37 Q31 19 50 17.5 Q69 19 70 37" stroke="#E2CF9C" stroke-width="7.5" fill="none" stroke-linecap="round"/>
  <path d="M30 37 Q31 19 50 17.5 Q69 19 70 37" stroke="#C9B27A" stroke-width="7.5" fill="none" stroke-dasharray="1.2 3.6" opacity=".7"/>
  <path d="M30 37 Q31 19 50 17.5 Q69 19 70 37" stroke="#F6ECD0" stroke-width="2" fill="none" stroke-dasharray="2.4 2.4" opacity=".8"/>
  <path d="M39.8 41.4 Q43.5 40 47 41.2 M53 41.2 Q56.5 40 60.2 41.4" stroke="#C9B282" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <g class="augen"><ellipse cx="43.5" cy="46.4" rx="3.1" ry="1.9" fill="#FFFDF5"/><circle cx="43.8" cy="46.6" r="1.65" fill="#4F86B8"/><circle cx="43.8" cy="46.6" r=".75" fill="#1C2620"/><circle cx="44.3" cy="46" r=".4" fill="#fff"/></g>
  <g class="augen"><ellipse cx="56.5" cy="46.4" rx="3.1" ry="1.9" fill="#FFFDF5"/><circle cx="56.2" cy="46.6" r="1.65" fill="#4F86B8"/><circle cx="56.2" cy="46.6" r=".75" fill="#1C2620"/><circle cx="56.7" cy="46" r=".4" fill="#fff"/></g>
  <path d="M38.6 48.8 Q40 50 42 49.8 M61.4 48.8 Q60 50 58 49.8" stroke="#D6A288" stroke-width=".7" fill="none" stroke-linecap="round"/>
  <path d="M50.3 49.6 Q48.6 54 50.8 55" stroke="#D29A7A" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="mund"><path d="M43 60 Q50 66.6 57 60 Q50 61.8 43 60Z" fill="#B0505A"/><path d="M44.4 60.4 Q50 62.2 55.6 60.4 L55 61.4 Q50 62.8 45 61.4Z" fill="#FFFDF5"/></g>
  <circle cx="32.6" cy="55" r="1.5" fill="#D2382E"/><circle cx="67.4" cy="55" r="1.5" fill="#D2382E"/>
  <ellipse cx="38.6" cy="54.6" rx="3.4" ry="2" fill="#E77F70" opacity=".4"/><ellipse cx="61.4" cy="54.6" rx="3.4" ry="2" fill="#E77F70" opacity=".4"/>
</svg>`;
}

/* Greta (Max’ Freundin): lange kupferrote Haare mit Mittelscheitel, blaugraue Augen, kleiner Nasenring, grüne Ohrringe, türkises Top */
function gretaSVG(gr = 64) {
  return `<svg class="portrait greta" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#E6F0E8"/>
  <path d="M28 42 Q26 24 50 22 Q74 24 72 42 L75 88 Q66 94 60 86 L40 86 Q34 94 25 88Z" fill="#A8442A"/>
  <path d="M14 100 Q16 78 50 76 Q84 78 86 100Z" fill="#3E9A8E"/><path d="M30 86 Q50 94 70 86" stroke="#2C6F66" stroke-width="1.4" fill="none" stroke-dasharray="2 3"/>
  <path d="M43 68 L57 68 L56.5 77 Q50 81 43.5 77Z" fill="#F3CDB4"/><path d="M47 80 L50 86 L53 80" stroke="#C9C2B0" stroke-width=".7" fill="none"/><path d="M48.6 85 L51.4 85 L50 88.4Z" fill="#5BA35A"/>
  <path d="M50 28 C61 28 67.5 37 67.5 48 C67.5 60 62 70 50 73 C38 70 32.5 60 32.5 48 C32.5 37 39 28 50 28Z" fill="#F6D6C2"/>
  <path d="M50 24.5 Q38 25 33 36 Q31 46 32.5 58 L35 56 Q34.5 44 38 36 Q43 30 50 29.5Z M50 24.5 Q62 25 67 36 Q69 46 67.5 58 L65 56 Q65.5 44 62 36 Q57 30 50 29.5Z" fill="#B84E30"/>
  <path d="M41 27.5 Q46 25.5 50 26 M54 26.5 Q60 27 63 31" stroke="#D2734E" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M39.8 41.8 Q43.5 40.6 47 41.8 M53 41.8 Q56.5 40.6 60.2 41.8" stroke="#A65A3E" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="augen"><ellipse cx="43.5" cy="46.6" rx="3.1" ry="1.9" fill="#FFFDF5"/><circle cx="43.8" cy="46.8" r="1.65" fill="#7F9DAE"/><circle cx="43.8" cy="46.8" r=".75" fill="#1C2620"/><circle cx="44.3" cy="46.2" r=".4" fill="#fff"/></g>
  <g class="augen auge-r"><ellipse cx="56.5" cy="46.6" rx="3.1" ry="1.9" fill="#FFFDF5"/><circle cx="56.2" cy="46.8" r="1.65" fill="#7F9DAE"/><circle cx="56.2" cy="46.8" r=".75" fill="#1C2620"/><circle cx="56.7" cy="46.2" r=".4" fill="#fff"/></g><path class="zwinker" d="M53.2 46.8 Q56.5 49.2 59.8 46.8" stroke="#5A3A2E" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0"/>
  <path d="M50.3 49.6 Q48.6 54 50.8 55" stroke="#D6A08A" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M48.9 55.6 Q50 56.8 51.1 55.6" stroke="#B9B4A8" stroke-width=".7" fill="none"/>
  <g fill="#D99A80" opacity=".5"><circle cx="40" cy="52" r=".5"/><circle cx="42" cy="53.4" r=".45"/><circle cx="58" cy="52" r=".5"/><circle cx="60" cy="53.4" r=".45"/><circle cx="46" cy="52.6" r=".4"/><circle cx="54" cy="52.6" r=".4"/></g>
  <g class="mund"><path d="M42.6 59.6 Q50 67 57.4 59.6 Q50 61.4 42.6 59.6Z" fill="#A9454A"/><path d="M44 60 Q50 61.9 56 60 L55.3 61.2 Q50 62.8 44.7 61.2Z" fill="#FFFDF5"/></g>
  <circle cx="47" cy="66.4" r=".6" fill="#C9C2B0"/>
  <path d="M33 56 L32 61 L33.6 62.4 L34.6 57.4Z" fill="#3F8F4E"/><path d="M67 56 L68 61 L66.4 62.4 L65.4 57.4Z" fill="#3F8F4E"/>
  <ellipse cx="38.6" cy="55" rx="3.2" ry="1.9" fill="#E88A78" opacity=".35"/><ellipse cx="61.4" cy="55" rx="3.2" ry="1.9" fill="#E88A78" opacity=".35"/>
</svg>`;
}
/* Pauli (Paulina, Max’ Schwester): kurze, verwuschelte aschblonde Haare mit Pony, blauer Pulli, kleine Ohrstecker */
function pauliSVG(gr = 64) {
  return `<svg class="portrait pauli" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#E9E4F2"/>
  <path d="M12 100 Q14 76 50 74 Q86 76 88 100Z" fill="#6D86C8"/><path d="M40 75 Q50 80 60 75 L60 79 Q50 84 40 79Z" fill="#5E76B8"/>
  <path d="M42.5 67 L57.5 67 L57 76 Q50 79.6 43 76Z" fill="#F2CDB4"/>
  <path d="M50 27 C61.5 27 68 36.5 68 48 C68 60.5 62 70.4 50 73.4 C38 70.4 32 60.5 32 48 C32 36.5 38.5 27 50 27Z" fill="#F7D8C4"/>
  <path d="M31 49 Q27 30 40 23 Q46 18 54 20 Q66 20 69 32 Q71 40 68.5 49 Q67 38 61 35 Q63 40 58 41 Q59 36 54 34.5 Q52 39 46 40 Q48 36 45 34 Q40 37 39.5 41 Q37 37 35 39 Q32.5 43 31 49Z" fill="#A98B62"/>
  <g fill="#C0A276"><path d="M38 26 Q42 21 47 22 Q43 24 41 28Z"/><path d="M52 21.5 Q58 21 62 25 Q57 24 54 25Z"/><path d="M44 33 Q47 30 50 31 Q47 32.5 46 35Z"/></g>
  <path d="M33.5 44 Q32 50 33.4 54 L35 53 Q34 49 35 45Z M66.5 44 Q68 50 66.6 54 L65 53 Q66 49 65 45Z" fill="#A98B62"/>
  <path d="M40 43.4 Q43.5 42.4 47 43.4 M53 43.4 Q56.5 42.4 60 43.4" stroke="#8C7050" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="augen"><ellipse cx="43.5" cy="47.8" rx="3" ry="1.8" fill="#FFFDF5"/><circle cx="43.8" cy="48" r="1.6" fill="#7790A6"/><circle cx="43.8" cy="48" r=".72" fill="#1C2620"/><circle cx="44.3" cy="47.4" r=".38" fill="#fff"/></g>
  <g class="augen"><ellipse cx="56.5" cy="47.8" rx="3" ry="1.8" fill="#FFFDF5"/><circle cx="56.2" cy="48" r="1.6" fill="#7790A6"/><circle cx="56.2" cy="48" r=".72" fill="#1C2620"/><circle cx="56.7" cy="47.4" r=".38" fill="#fff"/></g>
  <path d="M50.3 50.6 Q48.6 55 50.8 56" stroke="#D6A08A" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="mund"><path d="M44.6 61.6 Q50 64.6 55.4 61.6 Q50 62.6 44.6 61.6Z" fill="#B25A5A"/></g>
  <circle cx="32.6" cy="54" r=".9" fill="#E4C76A"/><circle cx="67.4" cy="54" r=".9" fill="#E4C76A"/>
  <ellipse cx="38.8" cy="56" rx="3.1" ry="1.8" fill="#E88A78" opacity=".3"/><ellipse cx="61.2" cy="56" rx="3.1" ry="1.8" fill="#E88A78" opacity=".3"/>
</svg>`;
}

/* ============================================================
   Kleine Lebenszeichen der Figuren
   ============================================================ */
/* Max (oder Dani) lacht herzhaft: Augen zu Lachfältchen, Mund weit offen im Bart, Kopf wippt, „Ha ha ha!“ fliegt.
   el = das Porträt-SVG oder irgendein Element, in dem es steckt. Gibt true zurück, wenn gelacht wurde.
   Für andere Teams (z. B. Rundgang): einfach maxLacht(element) aufrufen – mehr braucht es nicht. */
function maxLacht(el, opt = {}) {
  try {
    if (!el) return false;
    const svg = el.matches && el.matches("svg.portrait") ? el : el.querySelector && el.querySelector("svg.portrait.max, svg.portrait.dani");
    if (!svg || !svg.querySelector(".lach")) return false;
    const dauer = opt.dauer || 2300;
    if (svg._lachBis && Date.now() < svg._lachBis - 600) return true;
    svg._lachBis = Date.now() + dauer;
    svg.classList.remove("lacht"); void svg.getBoundingClientRect(); svg.classList.add("lacht");
    clearTimeout(svg._lachT); svg._lachT = setTimeout(() => svg.classList.remove("lacht"), dauer);
    const ruhig = typeof REDUCED === "function" && REDUCED();
    if (!ruhig && opt.ha !== false) {
      const r = svg.getBoundingClientRect();
      if (r.width && r.bottom > 0 && r.top < innerHeight) {
        const g = Math.round(Math.max(15, Math.min(22, r.width * .2))), rechts = r.right + 3 * g < innerWidth;
        ["Ha", "ha", "ha!"].forEach((t, i) => {
          const h = document.createElement("span"); h.className = "fig-ha"; h.textContent = t; h.setAttribute("aria-hidden", "true");
          h.style.fontSize = g + "px";
          h.style.left = Math.round(rechts ? r.right - g * .3 + i * g * 1.3 : r.left - g * 1.6 - i * g * 1.3) + "px";
          h.style.top = Math.round(r.top + r.height * .32 - i * g * .7) + "px";
          h.style.animationDelay = (120 + i * 240) + "ms"; h.style.setProperty("--dx", (rechts ? 1 : -1) * (8 + i * 6) + "px");
          document.body.appendChild(h); setTimeout(() => h.remove(), 1700 + i * 240);
        });
      }
    }
    return true;
  } catch (e) { return false; }
}

/* Ab und zu macht eine sichtbare Figur etwas Kleines: lächeln – und je nach Person:
   Christiane rückt die Brille zurecht, Micha nickt, Greta zwinkert, Max und Dani ziehen kurz die Brauen hoch.
   Selten (alle 8–16 s eine Figur, Eigenheiten je höchstens alle 40 s), nie bei „ruhiger Bewegung“. */
(function figSchelm() {
  const EIGEN = { jane: "fig-brille", micha: "fig-nickt", greta: "fig-zwinkert", max: "fig-braue", dani: "fig-braue" }, zuletzt = {};
  const tick = () => {
    setTimeout(tick, 8000 + Math.random() * 8000);
    try {
      if (document.hidden || (typeof REDUCED === "function" && REDUCED())) return;
      const alle = [...document.querySelectorAll("svg.portrait")].filter(s => {
        if (s.classList.contains("lacht") || s.closest(".portrait-gross, .logo-knopf, .av-wahl, .avatar-editor")) return false;
        const r = s.getBoundingClientRect(); return r.width >= 26 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
      });
      if (!alle.length) return;
      const s = alle[Math.floor(Math.random() * alle.length)];
      const wer = Object.keys(EIGEN).find(k => s.classList.contains(k));
      let k = "fig-grinst";
      if (wer && Date.now() - (zuletzt[wer] || 0) > 40000 && Math.random() < .6) { k = EIGEN[wer]; zuletzt[wer] = Date.now(); }
      s.classList.add(k); setTimeout(() => s.classList.remove(k), 1700);
    } catch (e) { }
  };
  setTimeout(tick, 5000);
})();

/* Hühnchen plustert sich auf, wenn Taler fliegen */
function huhnPlustern() {
  if (typeof REDUCED === "function" && REDUCED()) return;
  if (Date.now() - (huhnPlustern.t || 0) < 1500) return; huhnPlustern.t = Date.now();
  document.querySelectorAll("svg.huhn").forEach(h => {
    const r = h.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
    h.classList.remove("fig-plustert"); void r; h.classList.add("fig-plustert"); setTimeout(() => h.classList.remove("fig-plustert"), 1100);
  });
}
(function () {
  const an = () => { if (typeof MutationObserver !== "function" || !document.body) return;
    new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.classList && (n.classList.contains("taler-flug") || n.classList.contains("taler-plus"))) { setTimeout(huhnPlustern, 250); return; } }).observe(document.body, { childList: true }); };
  if (document.body) an(); else document.addEventListener("DOMContentLoaded", an);
})();

/* ---------- V4 (8.11.): Figuren-Leerlauf per sparsamem Timer statt Endlos-CSS-Animation ----------
   Blinzeln und Wippen laufen je einmal, wenn hier kurz fig-blink bzw. fig-wipp gesetzt wird (CSS in app.css,
   figuren.css, skins.css). Max’ Vorgabe bleibt: Die Figuren bewegen sich weiter leicht, nur nicht dauernd.
   Der Timer ruht bei document.hidden und bei „ruhig“/REDUCED(); Figuren außerhalb des Bildschirms (IntersectionObserver) bleiben still. */
const FIG_IDLE = { t: 0, io: null, sicht: new WeakMap(), plan: new WeakMap(), beob: [] };
const FIG_BLINK = "svg.huhn, svg.portrait";
const FIG_WIPP = "svg.huhn, svg.portrait, .fig-idle, .er-figur, .tel-kontakt .tel-rund";
const FIG_DAUER = { blink: 450, wipp: 3700 };
function figIdleRnd(a, b) { return a + Math.random() * (b - a); }
function figIdleTick() {
  FIG_IDLE.t = 0;
  if (document.hidden) return;
  if (!REDUCED()) try {
    const jetzt = performance.now(), el = [...document.querySelectorAll(FIG_WIPP)].filter(e => !e.closest(".huhn-gross, .portrait-gross"));
    if (FIG_IDLE.io) {
      FIG_IDLE.beob = FIG_IDLE.beob.filter(e => { if (e.isConnected) return true; FIG_IDLE.io.unobserve(e); return false; });
      for (const e of el) if (!FIG_IDLE.sicht.has(e)) { FIG_IDLE.sicht.set(e, false); FIG_IDLE.io.observe(e); FIG_IDLE.beob.push(e); }
    }
    let blinks = 0, wipps = 0;
    for (const e of el.sort(() => Math.random() - .5)) {
      if (FIG_IDLE.io && !FIG_IDLE.sicht.get(e)) continue;
      let p = FIG_IDLE.plan.get(e);
      if (!p) { p = { blink: jetzt + figIdleRnd(800, 4500), wipp: jetzt + figIdleRnd(1500, 9000) }; FIG_IDLE.plan.set(e, p); }
      // höchstens 3 Blinzler und 2 Wipper pro Takt, damit eine volle Ansicht (Kleiderschrank) nicht dauernd zappelt
      if (jetzt >= p.blink && blinks < 3 && e.matches(FIG_BLINK)) { blinks++; p.blink = jetzt + figIdleRnd(3500, 7500); figIdleKlasse(e, "fig-blink", FIG_DAUER.blink); }
      if (jetzt >= p.wipp && wipps < 2) { wipps++; p.wipp = jetzt + FIG_DAUER.wipp + figIdleRnd(5000, 11000); figIdleKlasse(e, "fig-wipp", FIG_DAUER.wipp); }
    }
  } catch (x) { }
  figIdleLos();
}
function figIdleKlasse(e, k, ms) {
  setTimeout(() => { if (!e.isConnected) return; e.classList.add(k); setTimeout(() => e.classList.remove(k), ms); }, figIdleRnd(0, 900));
}
function figIdleLos() {
  if (FIG_IDLE.t || document.hidden) return;
  FIG_IDLE.t = setTimeout(figIdleTick, figIdleRnd(1200, 1800));
}
(function () {
  if (typeof IntersectionObserver === "function") FIG_IDLE.io = new IntersectionObserver(es => { for (const x of es) FIG_IDLE.sicht.set(x.target, x.isIntersecting); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { clearTimeout(FIG_IDLE.t); FIG_IDLE.t = 0; } else figIdleLos(); });
  figIdleLos();
})();
