/* ============================================================
   Dankbar-Daten: weitere schöne Einträge eines Tages (der erste steht in S.momente).
   Anzeige und Eingabe: rueckblick.js („Was war heute schön?“), Archiv „Schöne Momente“.
   Zustand: S.dank = { tage: { "JJJJ-MM-TT": ["…", "…"] }, taler: { "JJJJ-MM-TT": 1 }, dreh: 0 }
   ============================================================ */
const DANK_MAX = 3, DANK_LAENGE = 160; // Wechselfragen: RB_UNTER in rueckblick.js
const DANK_TAG = /^\d{4}-\d{2}-\d{2}$/;

/* robust: alles, was nicht passt, wird repariert statt verworfen */
function dankMigrieren() {
  const o = S.dank && typeof S.dank === "object" && !Array.isArray(S.dank) ? S.dank : {};
  const tage = {}, roh = o.tage && typeof o.tage === "object" && !Array.isArray(o.tage) ? o.tage : {};
  for (const k of Object.keys(roh)) {
    if (!DANK_TAG.test(k)) continue;
    let v = roh[k]; if (typeof v === "string" || typeof v === "number") v = [v]; if (!Array.isArray(v)) continue;
    const l = v.filter(x => typeof x === "string" || typeof x === "number").map(x => String(x).replace(/\s+/g, " ").trim().slice(0, DANK_LAENGE)).filter(Boolean).slice(0, DANK_MAX);
    if (l.length) tage[k] = l;
  }
  const taler = {}, t0 = o.taler && typeof o.taler === "object" && !Array.isArray(o.taler) ? o.taler : {};
  for (const k of Object.keys(t0)) if (DANK_TAG.test(k) && t0[k]) taler[k] = 1;
  for (const k of Object.keys(tage)) taler[k] = taler[k] || 0; // ältere Einträge ohne Vermerk: keine Nachzahlung, aber auch kein zweites Mal
  for (const k of Object.keys(taler)) if (!taler[k] && !tage[k]) delete taler[k];
  S.dank = { tage, taler, dreh: Number.isFinite(o.dreh) ? Math.max(0, Math.floor(o.dreh)) % 1000 : 0 };
  return S.dank;
}
function dankS() { const d = S.dank; return d && typeof d === "object" && d.tage && typeof d.tage === "object" && d.taler && typeof d.taler === "object" ? d : dankMigrieren(); }
/* Oberfläche: „Was war heute schön?“ in rueckblick.js (Blindvergleich 22.10.). Hier bleiben nur Daten und Reparatur. */
