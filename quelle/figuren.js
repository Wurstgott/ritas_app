/* ============================================================
   Figuren für die Oberfläche (SVG): Hühnchen als Comic, Porträts von Rita und Max
   Papier-Stil: flache Flächen, keine Konturen, ein harter Versatzschatten.
   ============================================================ */

/* Hühnchen – nach der echten Tonfigur: ocker, braun gesprenkelt, roter Kamm, gelber Schnabel, grüner Sockel.
   Teile mit Klassen, damit CSS sie bewegen kann (Kopf wippt, Augen blinzeln, Schnabel spricht, Flügel winkt). */
function huhnSVG(opt = {}) {
  const nurKopf = opt.kopf, stimmung = opt.stimmung || "", gr = opt.gr || 80;
  const vb = nurKopf ? "40 6 56 52" : "0 0 100 100";
  return `<svg class="huhn ${stimmung}" viewBox="${vb}" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  ${nurKopf ? "" : `<ellipse cx="50" cy="95" rx="26" ry="3.2" fill="rgba(20,28,24,.16)"/><rect x="26" y="83" width="46" height="10" rx="5" fill="#5B8A47"/>
  <g class="huhn-koerper">
    <path d="M30 60 Q16 50 19 34 Q26 44 38 50Z" fill="#C9913C"/>
    <path d="M26 66 Q24 46 44 44 Q62 42 72 56 Q80 70 68 80 Q56 88 42 86 Q28 84 26 66Z" fill="#E4B24F"/>
    <path class="huhn-fluegel" d="M34 62 Q46 52 60 60 Q58 73 46 75 Q35 73 34 62Z" fill="#CC913C"/>
  </g>`}
  <g class="huhn-kopf">
    <path d="M48 46 Q42 22 60 18 Q78 15 79 32 Q80 47 66 51 Q54 53 48 46Z" fill="#E4B24F"/>
    <g class="huhn-kamm" fill="#D9473A"><circle cx="56" cy="16" r="5"/><circle cx="63" cy="12.5" r="5.6"/><circle cx="70" cy="15.5" r="4.6"/></g>
    <path d="M73 45 Q78 51 73 56 Q68 52 69.5 46Z" fill="#D9473A"/>
    <ellipse cx="59" cy="42" rx="3.6" ry="2.3" fill="#EE8E78" opacity=".55"/>
    <g class="huhn-augen">
      <ellipse cx="65" cy="31" rx="8.5" ry="9.5" fill="#FFFDF5"/>
      <g class="pupillen"><circle cx="68" cy="32" r="5" fill="#1C2620"/><circle cx="69.8" cy="29.8" r="1.8" fill="#fff"/></g>
      <path class="froh" style="display:none" d="M58.5 33 Q65 25 71.5 33" stroke="#1C2620" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <g class="lider" fill="#E4B24F" opacity="0"><ellipse cx="65" cy="31" rx="9.2" ry="10.2"/></g>
    </g>
    <g class="huhn-schnabel"><path class="unten" d="M76 39 L88 41 L76 45Z" fill="#D9921C"/><path class="oben" d="M76 30 Q86 31 93 36 Q86 39 76 40Z" fill="#F4B92A"/></g>
  </g>
</svg>`;
}

/* Porträt Rita (Logo): blond mit Silbertouch, Bob, fröhliches Lachen, kleine Creolen. Kein Hut. */
function ritaSVG(gr = 40) {
  return `<svg class="portrait rita" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#F3E3C0"/>
  <path d="M14 100 Q16 78 50 76 Q84 78 86 100Z" fill="#22304A"/>
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
  <g class="brille" opacity="0"><rect x="37.5" y="44" width="11.5" height="7.5" rx="3" fill="#1C2620"/><rect x="51" y="44" width="11.5" height="7.5" rx="3" fill="#1C2620"/><path d="M49 46.5 Q50 45.5 51 46.5 M37.5 46 L32 44.5 M62.5 46 L68 44.5" stroke="#1C2620" stroke-width="1.2" fill="none"/><path d="M39.5 45.5 L42 45.5" stroke="#fff" stroke-width=".9" opacity=".6"/></g>
</svg>`;
}

/* Porträt Max: dunkle Locken oben, kurze Seiten (leichter Undercut), etwas länger im Nacken, breites Lachen. */
function maxSVG(gr = 64) {
  return `<svg class="portrait max" viewBox="0 0 100 100" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <circle cx="50" cy="50" r="48" fill="#E7EDE4"/>
  <path d="M12 100 Q14 76 50 74 Q86 76 88 100Z" fill="#1E1E22"/>
  <path d="M42 68 L58 68 L57 78 Q50 82 43 78Z" fill="#E2AE8A"/>
  <ellipse cx="50" cy="50" rx="18" ry="22" fill="#E6B593"/>
  <path d="M31 50 Q29 36 35 29 L37 52Z" fill="#7A5A40"/><path d="M69 50 Q71 36 65 29 L63 52Z" fill="#7A5A40"/>
  <g fill="#6B4A30"><circle cx="36" cy="33" r="6.5"/><circle cx="64" cy="33" r="6.5"/><circle cx="38" cy="28" r="7"/><circle cx="46" cy="23" r="8"/><circle cx="55" cy="22" r="8"/><circle cx="63" cy="27" r="7"/><circle cx="43" cy="32" r="6"/><circle cx="57" cy="31" r="6"/><circle cx="50" cy="28" r="7"/></g>
  <g fill="#5A3C26"><circle cx="41" cy="34" r="4"/><circle cx="59" cy="34" r="4"/><circle cx="33" cy="38" r="3.4"/><circle cx="67" cy="38" r="3.4"/><circle cx="48" cy="33.5" r="3.2"/><circle cx="53" cy="17" r="4"/></g><g fill="#80603F"><circle cx="45" cy="22" r="2.2"/><circle cx="57" cy="21" r="2"/><circle cx="51" cy="27" r="1.8"/></g>
  <path d="M40.5 41.8 Q44 40.4 47.2 41.6 M52.8 41.6 Q56 40.4 59.5 41.8" stroke="#6B4A30" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <g class="augen"><ellipse cx="44" cy="46.2" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="44.3" cy="46.400000000000006" r="1.75" fill="#4A86AE"/><circle cx="44.3" cy="46.400000000000006" r=".8" fill="#1C2620"/><circle cx="44.9" cy="45.800000000000004" r=".45" fill="#fff"/><path d="M40.4 46.400000000000006 Q44 43.0 47.6 46.400000000000006" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M41.4 48.7 Q44 49.800000000000004 46.6 48.7" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/><ellipse cx="56" cy="46.2" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="56.3" cy="46.400000000000006" r="1.75" fill="#4A86AE"/><circle cx="56.3" cy="46.400000000000006" r=".8" fill="#1C2620"/><circle cx="56.9" cy="45.800000000000004" r=".45" fill="#fff"/><path d="M52.4 46.400000000000006 Q56 43.0 59.6 46.400000000000006" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M53.4 48.7 Q56 49.800000000000004 58.6 48.7" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/></g>
  <path d="M50.2 48.5 Q48.4 53.2 50.8 54" stroke="#C98E6E" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M35 56 Q36 70 50 72 Q64 70 65 56 Q60 66 50 66.5 Q40 66 35 56Z" fill="#8A6A55" opacity=".09"/>
  <g class="mund"><path d="M42 57.5 Q50 65.5 58 57.5 Q50 59.4 42 57.5Z" fill="#8A2E26"/><path d="M43.4 57.9 Q50 60 56.6 57.9 L55.8 59.3 Q50 61 44.2 59.3Z" fill="#FFFDF5"/></g>
  <ellipse cx="38" cy="54" rx="3.4" ry="2" fill="#E07F62" opacity=".35"/><ellipse cx="62" cy="54" rx="3.4" ry="2" fill="#E07F62" opacity=".35"/>
</svg>`;
}

/* Hühnchen von vorn (nur Kopf) – für das „Kopf zum Betrachter drehen“ */
function huhnFrontSVG(gr = 150) {
  return `<svg class="huhn huhn-front" viewBox="40 6 56 52" style="width:${gr}px;height:${gr}px" aria-hidden="true">
  <g class="huhn-kopf">
    <path class="hg-kopfform" d="M68 17 C79 17 86 25 86 35 C86 45 78 52 68 52 C58 52 50 45 50 35 C50 25 57 17 68 17Z" fill="#E4B24F"/>
    <g class="huhn-kamm" fill="#D9473A"><circle cx="62.5" cy="16" r="4.6"/><circle cx="68" cy="12.6" r="5.4"/><circle cx="73.5" cy="16" r="4.6"/></g>
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
  </g>
</svg>`;
}

/* Christiane („Jane“): blonder Bob, rote runde Brille, pinke Jacke, blauer Schal */
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
  <path d="M38 44 Q38.5 41 43.5 41.2 Q48.3 41.4 48 45.4 Q47.5 51.6 43 51.6 Q38.4 51.4 38 47Z M52 45.4 Q51.7 41.4 56.5 41.2 Q61.5 41 62 44 L62 47 Q61.6 51.4 57 51.6 Q52.5 51.6 52 45.4Z" stroke="#D2342C" stroke-width="1.6" fill="none"/><path d="M48 45 Q50 43.8 52 45" stroke="#D2342C" stroke-width="1.3" fill="none"/>
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
  <g class="augen"><ellipse cx="56.5" cy="46.6" rx="3.1" ry="1.9" fill="#FFFDF5"/><circle cx="56.2" cy="46.8" r="1.65" fill="#7F9DAE"/><circle cx="56.2" cy="46.8" r=".75" fill="#1C2620"/><circle cx="56.7" cy="46.2" r=".4" fill="#fff"/></g>
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
