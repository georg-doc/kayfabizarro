/* KFB Resident Atlas · übernommene Studio-Korrekturen (ab S10)
   Ein Seed ist eine Handkorrektur, die Georg BEWUSST geliefert hat. Er wird beim Bauen der
   Vignette als neuer Grundstand gesetzt — also auch das Ziel von „Auf Recipe zurück“.
   Gesammelte Korrekturen aus dem Browser liegen darüber. data/cast.js bleibt unberührt;
   Einpflegen in das Rezept ist ein eigener Schritt (hand.slotAxis/slotRoll vs. freie Lage). */
export const SEEDS = {
  'toy-soldier': {
    from: 'uploads/toy-soldier.studio-patch.json · Georg 2026-09-25 · Quelle georg-doc/kayfabizarro@891eadf0',
    nodes: {
      trumpet: { p: [-0.283, 0.032, 0.221], r: [-11.49, -59.13, -11.53], s: 1 },
      rifle: { p: [0.052, 0.014, -0.015], r: [-90, 0, 105], s: 1 }
    },
    bones: {}
  }
};
