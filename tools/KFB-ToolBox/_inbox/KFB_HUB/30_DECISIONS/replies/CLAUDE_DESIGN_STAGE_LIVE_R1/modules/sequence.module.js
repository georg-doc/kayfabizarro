// Ablauf-Modul · Host-Vertrag R1.2. Eine Master-Uhr (seek-fähig), deterministisch, Schleife.
// Opener + Triplet: A spricht (eine Blase, drei Blöcke), B reagiert; danach Lesefolge des Kartentexts (POWER) auf der Fläche.
// Inhalt: Opener aus V-218 KEEP · Triplet-Text CONTENT REQUIRED (Platzhalter aus Kartentitel + POWER) · B-Reaktion = Auswahl-Label aus dem ChatterBox-Handover.
export const SCRIPT = {
  a: ['Have you heard of', 'The Moving Launch Date?', 'Keep the date close.'],
  b: ['KayfaBOGGLE?'],
  power: ['Let salvation slip one quarter,', 'then another.', 'Keep the faith by keeping the date close.']
};
const hold = n => Math.max(1200, Math.min(5000, 800 + 42 * n));
export function create(o) {
  const tA = 1.6, dA = (1040 + 300 + hold(SCRIPT.a.join('').length)) / 1000, tB = tA + dA + 0.25, dB = (300 + hold(SCRIPT.b.join('').length)) / 1000;
  const tR = tB + dB + 0.4, dR = 2.4, nR = SCRIPT.power.length, END = tR + nR * dR + 1.8;
  const cues = [{ t: 0, shot: 'two' }, { t: tA, shot: 'a', say: 'A' }, { t: tB, shot: 'b', say: 'B' }, { t: tR, shot: 'insert', clear: true }, { t: tR + nR * dR, shot: 'two' }];
  let T = 0, fired = -1, paused = false;
  return {
    object3d: null, cues, END,
    get t() { return T; }, get paused() { return paused; },
    seek(t) { T = ((t % END) + END) % END; fired = cues.filter(c => c.t <= T).length - 2; },
    pause(v) { paused = v; },
    update(dt, ctx) {
      if (!paused) T += dt; if (T >= END) { T -= END; fired = -1; ctx.onLoop && ctx.onLoop(); }
      while (fired + 1 < cues.length && cues[fired + 1].t <= T) { fired++; ctx.onCue && ctx.onCue(cues[fired]); }
      let ra = null; if (T >= tR && T < tR + nR * dR) { const i = Math.floor((T - tR) / dR), local = T - tR - i * dR; ra = { active: true, idx: i, k: Math.min(1, local / 0.3) }; }
      const speaking = T >= tA && T < tA + dA ? 'A' : T >= tB && T < tB + dB ? 'B' : null;
      return { readAlong: ra, speaking, phase: ra ? 'Lesefolge ' + (ra.idx + 1) + '/' + nR : speaking ? (speaking === 'A' ? 'A spricht' : 'B reagiert') : 'Karte' };
    },
    dispose() {}
  };
}
