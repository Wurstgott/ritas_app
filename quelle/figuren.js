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
  <ellipse cx="50" cy="51" rx="18.5" ry="22.5" fill="#F0C9AA"/>
  <path d="M29 44 Q31 19 54 19 Q74 22 73 45 Q66 31 50 32 Q40 33 34 40 Q31 43 29 46Z" fill="#C6B999"/>
  <path d="M33 38 Q40 27 56 26 Q46 31 41 39Z" fill="#D8CFBA"/>
  <path d="M44 23 Q55 20 66 27" stroke="#E6E2D8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M27 50 Q26 60 30 68" stroke="#DCD6C8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M39.8 42.8 Q43.5 41.6 47 43 M53 43 Q56.5 41.6 60.2 42.8" stroke="#A89274" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <g class="auge-l"><ellipse cx="43.5" cy="47.6" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="43.8" cy="47.800000000000004" r="1.75" fill="#7C9DB4"/><circle cx="43.8" cy="47.800000000000004" r=".8" fill="#1C2620"/><circle cx="44.4" cy="47.2" r=".45" fill="#fff"/><path d="M39.9 47.800000000000004 Q43.5 44.4 47.1 47.800000000000004" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M40.9 50.1 Q43.5 51.2 46.1 50.1" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/></g><g class="auge-r"><ellipse cx="56.5" cy="47.6" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="56.8" cy="47.800000000000004" r="1.75" fill="#7C9DB4"/><circle cx="56.8" cy="47.800000000000004" r=".8" fill="#1C2620"/><circle cx="57.4" cy="47.2" r=".45" fill="#fff"/><path d="M52.9 47.800000000000004 Q56.5 44.4 60.1 47.800000000000004" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M53.9 50.1 Q56.5 51.2 59.1 50.1" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/></g><path class="zwinker" d="M52.8 48 Q56.5 50.6 60.2 48" stroke="#3A2A22" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0"/>
  <path d="M37.6 47 L35.9 46.2 M62.4 47 L64.1 46.2" stroke="#D9A588" stroke-width=".7" stroke-linecap="round"/>
  <path d="M50.3 50 Q48.6 54.2 50.8 55" stroke="#D49A7C" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M42.5 59 Q50 66 57.5 59 Q50 60.8 42.5 59Z" fill="#9A3A2E"/><path d="M43.9 59.4 Q50 61.3 56.1 59.4 L55.3 60.7 Q50 62.2 44.7 60.7Z" fill="#FFFDF5"/>
  <ellipse cx="38" cy="56" rx="3.6" ry="2.2" fill="#E98B6E" opacity=".4"/><ellipse cx="62" cy="56" rx="3.6" ry="2.2" fill="#E98B6E" opacity=".4"/>
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
  <ellipse cx="44" cy="46.2" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="44.3" cy="46.400000000000006" r="1.75" fill="#4A86AE"/><circle cx="44.3" cy="46.400000000000006" r=".8" fill="#1C2620"/><circle cx="44.9" cy="45.800000000000004" r=".45" fill="#fff"/><path d="M40.4 46.400000000000006 Q44 43.0 47.6 46.400000000000006" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M41.4 48.7 Q44 49.800000000000004 46.6 48.7" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/><ellipse cx="56" cy="46.2" rx="3.2" ry="1.9" fill="#FFFDF5"/><circle cx="56.3" cy="46.400000000000006" r="1.75" fill="#4A86AE"/><circle cx="56.3" cy="46.400000000000006" r=".8" fill="#1C2620"/><circle cx="56.9" cy="45.800000000000004" r=".45" fill="#fff"/><path d="M52.4 46.400000000000006 Q56 43.0 59.6 46.400000000000006" stroke="#3A2A22" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M53.4 48.7 Q56 49.800000000000004 58.6 48.7" stroke="#D59F82" stroke-width=".7" fill="none" stroke-linecap="round"/>
  <path d="M50.2 48.5 Q48.4 53.2 50.8 54" stroke="#C98E6E" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M35 56 Q36 70 50 72 Q64 70 65 56 Q60 66 50 66.5 Q40 66 35 56Z" fill="#8A6A55" opacity=".09"/>
  <path d="M42 57.5 Q50 65.5 58 57.5 Q50 59.4 42 57.5Z" fill="#8A2E26"/><path d="M43.4 57.9 Q50 60 56.6 57.9 L55.8 59.3 Q50 61 44.2 59.3Z" fill="#FFFDF5"/>
  <ellipse cx="38" cy="54" rx="3.4" ry="2" fill="#E07F62" opacity=".35"/><ellipse cx="62" cy="54" rx="3.4" ry="2" fill="#E07F62" opacity=".35"/>
</svg>`;
}
