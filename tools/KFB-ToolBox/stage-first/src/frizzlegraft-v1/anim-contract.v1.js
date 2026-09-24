/* anim-contract.v1 · der `anim`-Block in kfb.pets/1 — Rig-Wahl, Clip-Zuordnung, Locomotion-Regler
 * je Pet. EIN neuer Block in der bestehenden Vertragsdatei (Georgs Entscheidung, 13.09. Abend),
 * kein zweiter Vertrag, keine zweite Datei. Gebaut von KFB Animation Lab v2, gelesen von jedem
 * Werkzeug, das eine Figur bewegen will — Studio, Rigging Lab, später Cockpit/Vehicle-Rigs.
 *
 * ⚠ WAS DIESER BLOCK NICHT IST: keine zweite Kopie von `lab/locomotion.js`s `PARAMS`/`CANDIDATES`.
 * Diese Datei speichert nur, was vom LAB-DEFAULT ABWEICHT — `params`/`clipMap` sind ÜBERSCHREIBUNGEN,
 * leer heißt »die Vorgabe des Moduls gilt«. Ein Pet ohne `anim`-Block ist kein Fehler, es hat noch
 * keine getunte Bewegung — genau wie ein Pet ohne `brow`-Block Carls Regel folgt: nichts erfinden.
 */
export const SCHEMA = 'kfb.anim/1';
export const RIGS = ['Medium', 'Large'];
export const MODES = ['chain', 'full'];

export const DEFAULTS = Object.freeze({ rig: 'Medium', mode: 'chain', clipMap: {}, params: {} });

/* Regler-Beschreibung für die UI — Grenzen aus `lab/locomotion.js`s PARAMS gelesen, nicht geraten
   (Georgs Startwerte: walk 1.45, run 3.4, turn 2.4, jumpV 4.4, gravity −11.5, fade 0.16). */
export const PARAM_META = [
  ['walk', 'Walk speed', 0.3, 3, 0.05],
  ['run', 'Run speed', 1, 6, 0.05],
  ['back', 'Backpedal speed', 0.3, 2, 0.05],
  ['strafe', 'Strafe speed', 0.3, 3, 0.05],
  ['turn', 'Turn rate', 0.5, 5, 0.05],
  ['jumpV', 'Jump velocity', 1, 8, 0.1],
  ['gravity', 'Gravity', -20, -4, 0.5],
  ['fade', 'Crossfade', 0.02, 0.5, 0.01],
];

export function normalize(block) {
  const b = block || {};
  return { rig: RIGS.includes(b.rig) ? b.rig : DEFAULTS.rig, mode: MODES.includes(b.mode) ? b.mode : DEFAULTS.mode,
    clipMap: { ...(b.clipMap || {}) }, params: { ...(b.params || {}) } };
}

/* Ein State-Clip lösen: ERST die Überschreibung, wenn sie im Paket wirklich vorkommt (eine
   Überschreibung auf einen Clip, den es nicht gibt, ist ein Fehler, kein stiller Rückfall), DANN
   die Kandidatenliste aus `locomotion.js`, in Reihenfolge. `pool` = Namen, die das geladene Paket
   wirklich hat — eine Zuordnung wird gegen die WIRKLICHE Datei geprüft, nie angenommen. */
export function resolveClip(state, clipMap, CANDIDATES, pool) {
  const override = clipMap && clipMap[state];
  if (override) return pool.includes(override) ? { name: override, source: 'override', ok: true } : { name: override, source: 'override', ok: false };
  const cands = CANDIDATES[state] || [];
  const hit = cands.find((c) => pool.includes(c));
  return hit ? { name: hit, source: 'candidate', ok: true } : { name: null, source: 'none', ok: false };
}

/** Abnahme, feldweise — dieselbe Form wie Studios `selfTest` (Studio · `pet-session.v1.js`):
    eine Zeile, ein Soll/Ist, ein `ok`. Kein Regler zeigt sich selbst als Beleg. */
export function selfTest({ block, pool, CANDIDATES }) {
  const b = normalize(block);
  const rows = [];
  rows.push({ t: 'Rig ist eine bekannte Größe', ok: RIGS.includes(b.rig), got: b.rig });
  rows.push({ t: 'Sprung-Modus ist eine bekannte Größe', ok: MODES.includes(b.mode), got: b.mode });
  for (const [k, label, min, max] of PARAM_META) {
    if (!(k in b.params)) continue;
    const v = b.params[k];
    rows.push({ t: label + ' in gültigem Bereich', ok: Number.isFinite(v) && v >= min && v <= max, got: v });
  }
  for (const state of Object.keys(b.clipMap)) {
    const r = resolveClip(state, b.clipMap, CANDIDATES, pool || []);
    rows.push({ t: 'Clip-Zuordnung ' + state + ' → ' + b.clipMap[state], ok: r.ok, got: r.ok ? 'gefunden' : 'NICHT im geladenen Paket' });
  }
  return rows;
}

/** Rundweg-Probe: normalisieren → JSON → zurücklesen → muss identisch sein. Georgs eigene Regel
    aus dem Vertrag (»laden → ohne Änderung exportieren → Diff muss leer sein«), hier auf den
    `anim`-Block angewandt. */
export function roundtrip(block) {
  const a = normalize(block);
  const b = normalize(JSON.parse(JSON.stringify(a)));
  return { ok: JSON.stringify(a) === JSON.stringify(b), a, b };
}
