/* anim-audit.v1.js — DAS ZÄHLWERK (P33 Phase 0 + 1)
 *
 * Ein Auftrag, eine Regel: **kein Clipname, der nicht aus der Datei kommt.** Keine Liste aus
 * Dokumentation, keine Liste aus Erinnerung, keine Liste aus dem Netz. Was hier steht, steht in
 * `gltf.animations[]` der Datei, die geladen wurde — sonst steht es nicht hier.
 *
 * Was gemessen wird, und woran:
 *   name       `clip.name` unverändert (auch wenn er hässlich ist — er ist der Schlüssel)
 *   duration   `clip.duration`, auf 3 Stellen
 *   tracks     Zahl der Spuren · `bones` die Zahl verschiedener Zielknoten
 *   loop       ⚠ GEMESSEN, nicht geraten: erster und letzter Schlüsselwert JEDER Drehspur werden
 *              verglichen. Bleibt der größte Unterschied unter `LOOP_EPS`, schließt sich die
 *              Bewegung — sonst springt sie. Eine Wurzelverschiebung über `ROOT_EPS` schließt
 *              Schleife aus, auch wenn die Drehungen passen (sie läuft dann weg).
 *   root       Wurzelbewegung: größter Abstand in der Bodenebene (XZ) vom ersten Schlüssel.
 *              In Metern der Datei. `0` heißt: die Figur bleibt auf der Stelle.
 *
 * Die Lücke, die dieses Werk NICHT füllt: ob ein Clip zum FrizzleBob-Graft paßt, ist eine andere
 * Frage (Spurfilter in `frizzlebob.v4a._filterClips`). Hier wird gezählt, was der Spender hat.
 */

export const RIGS = {
  Rig_Medium: ['General', 'MovementBasic', 'MovementAdvanced', 'Simulation', 'CombatMelee', 'CombatRanged', 'Special', 'Tools'],
  Rig_Large:  ['General', 'MovementBasic', 'MovementAdvanced', 'Simulation', 'CombatMelee', 'CombatRanged', 'Special', 'Tools'],
};
export const DIR = 'KayKit_Character_Animations_1.1/Animations/gltf/';
export const SCHEMA = 'kfb.animation-inventory.v0';

const LOOP_EPS = 0.02;    // Quaternionen-Abstand, ab dem der Sprung sichtbar wird
const ROOT_EPS = 0.01;    // Meter Wurzelversatz, ab dem eine Schleife wegläuft
const ROOT_RE = /^(root|hips)$/i;

export const pathFor = (rig, set) => DIR + rig + '/' + rig + '_' + set + '.glb';

/* Eine Spur, erster gegen letzten Schlüssel. `values` ist flach: n Werte je Schlüssel. */
function endGap(track) {
  const v = track.values, n = track.getValueSize();
  if (!v || v.length < n * 2) return 0;
  let m = 0;
  for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(v[i] - v[v.length - n + i]));
  return m;
}
/* Größter Abstand in der Bodenebene vom ersten Schlüssel. Nur Positionsspuren der Wurzel. */
function rootTravel(track) {
  const v = track.values, n = track.getValueSize();
  if (n !== 3 || v.length < 6) return 0;
  const x0 = v[0], z0 = v[2];
  let m = 0;
  for (let i = 0; i < v.length; i += 3) {
    const dx = v[i] - x0, dz = v[i + 2] - z0;
    m = Math.max(m, Math.sqrt(dx * dx + dz * dz));
  }
  return m;
}

export function auditClip(THREE, clip) {
  const bones = new Set();
  let rotGap = 0, root = 0, rootEnd = 0, rotTracks = 0;
  clip.tracks.forEach((tr) => {
    const p = THREE.PropertyBinding.parseTrackName(tr.name);
    bones.add(p.nodeName);
    if (p.propertyName === 'quaternion') { rotGap = Math.max(rotGap, endGap(tr)); rotTracks++; }
    if (p.propertyName === 'position' && ROOT_RE.test(p.nodeName)) {
      root = Math.max(root, rootTravel(tr));
      rootEnd = Math.max(rootEnd, endGap(tr));
    }
  });
  const rootMotion = root > ROOT_EPS;
  /* ⚠ GEMESSEN und korrigiert: die `*_Pose`-Clips haben **Dauer 0**. Erster und letzter Schlüssel
     sind derselbe, der Abstand also null — und die reine Formel gab »Schleife: ja« aus. Ein
     Standbild ist keine Schleife. Dauer > 0 ist Bedingung, und das Standbild wird benannt. */
  const still = clip.duration <= 0;
  return {
    name: clip.name,
    duration: +clip.duration.toFixed(3),
    tracks: clip.tracks.length,
    bones: bones.size,
    loopCandidate: !still && rotTracks > 0 && rotGap <= LOOP_EPS && rootEnd <= ROOT_EPS,
    loopGap: +rotGap.toFixed(4),
    rootMotion,
    rootTravel: +root.toFixed(3),
    still,
    notes: still ? 'Standbild (Dauer 0) — eine Haltung, keine Bewegung' : '',
  };
}

/** Lädt EINE Satzdatei und liest sie aus. `io = { loader, raw }`. */
export async function auditSet(THREE, io, rig, set) {
  const path = pathFor(rig, set);
  const t0 = performance.now();
  let gltf;
  try { gltf = await io.loader.loadAsync(io.raw(path)); }
  catch (e) { return { rig, set, file: path.split('/').pop(), path, error: String(e && e.message || e), clips: [], ms: Math.round(performance.now() - t0) }; }
  const clips = (gltf.animations || []).map((c) => auditClip(THREE, c));
  return { rig, set, file: path.split('/').pop(), path, clips, ms: Math.round(performance.now() - t0), gltf };
}

/** Alle Sätze eines Rigs, der Reihe nach. `onStep(set, i, n)` meldet den Fortschritt. */
export async function auditRig(THREE, io, rig, onStep) {
  const sets = RIGS[rig] || [];
  const out = [];
  for (let i = 0; i < sets.length; i++) {
    if (onStep) onStep(sets[i], i, sets.length);
    out.push(await auditSet(THREE, io, rig, sets[i]));
  }
  return out;
}

const strip = (e) => ({ rig: e.rig, set: e.set, file: e.file, path: e.path, ms: e.ms, error: e.error || null, clips: e.clips });

export function inventoryJSON(rig, entries, meta) {
  return {
    schema: SCHEMA,
    rigFamily: rig,
    measuredAt: new Date().toISOString(),
    donorRepo: (meta && meta.donorRepo) || null,
    donorBranch: (meta && meta.donorBranch) || null,
    assetRoot: (meta && meta.assetRoot) || null,
    method: {
      names: 'gltf.animations[].name, unverändert',
      loopCandidate: 'Dauer > 0, größter Abstand zwischen erstem und letztem Schlüssel aller Drehspuren ≤ ' + LOOP_EPS + ', und Wurzelversatz Anfang/Ende ≤ ' + ROOT_EPS,
      still: 'Dauer 0 — eine Haltung, keine Bewegung (die `*_Pose`-Clips)',
      rootMotion: 'größter XZ-Abstand der Wurzel-Positionsspur vom ersten Schlüssel > ' + ROOT_EPS + ' m',
    },
    totals: { sets: entries.length, clips: entries.reduce((a, e) => a + e.clips.length, 0), still: entries.reduce((a, e) => a + e.clips.filter((c) => c.still).length, 0) },
    sets: entries.map(strip),
  };
}

export function inventoryMD(rig, entries, meta) {
  const total = entries.reduce((a, e) => a + e.clips.length, 0);
  const L = [];
  L.push('# AnimationInventory · ' + rig);
  L.push('');
  L.push('Gemessen am ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' aus den GLB-Dateien selbst.');
  L.push('Kein Name in dieser Datei stammt aus Dokumentation oder Erinnerung.');
  L.push('');
  L.push('**' + entries.length + ' Sätze · ' + total + ' Clips**' + (meta && meta.donorRepo ? ' · Spender `' + meta.donorRepo + '`' : ''));
  L.push('');
  L.push('Schleife = erster und letzter Schlüssel aller Drehspuren liegen unter ' + LOOP_EPS + ' auseinander und die Wurzel steht still.');
  L.push('Wurzelweg = größter Abstand der Wurzel in der Bodenebene, in Metern der Datei.');
  L.push('');
  entries.forEach((e) => {
    L.push('## ' + e.set + ' · `' + e.file + '`');
    L.push('');
    if (e.error) { L.push('**nicht geladen:** ' + e.error); L.push(''); return; }
    L.push(e.clips.length + ' Clips · geladen in ' + e.ms + ' ms');
    L.push('');
    L.push('| Clip | Dauer s | Spuren | Knochen | Schleife | Wurzelweg m | Anmerkung |');
    L.push('|---|---:|---:|---:|:--:|---:|---|');
    e.clips.forEach((c) => L.push('| `' + c.name + '` | ' + c.duration.toFixed(3) + ' | ' + c.tracks + ' | ' + c.bones
      + ' | ' + (c.loopCandidate ? 'ja' : '—') + ' | ' + (c.rootMotion ? c.rootTravel.toFixed(3) : '—') + ' | ' + (c.notes || '') + ' |'));
    L.push('');
  });
  return L.join('\n');
}

export function sourcePathsMD(meta, entries) {
  const L = [];
  L.push('# SOURCE_PATHS');
  L.push('');
  L.push('Festgehalten am ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + '.');
  L.push('Alles wird zur LAUFZEIT vom Spender geladen; dieses Projekt hält keine Kopien.');
  L.push('');
  L.push('```text');
  L.push('donorRepo       ' + ((meta && meta.donorRepo) || '—'));
  L.push('donorBranch     ' + ((meta && meta.donorBranch) || '—'));
  L.push('donorCommit     ' + ((meta && meta.donorCommit) || 'unbekannt — der Ladeweg zieht `' + ((meta && meta.donorBranch) || 'main') + '`, keinen Stand'));
  L.push('assetRoot       ' + ((meta && meta.assetRoot) || '—'));
  L.push('bodyAsset       ' + ((meta && meta.bodyAsset) || '—'));
  L.push('headAsset       ' + ((meta && meta.headAsset) || '—'));
  L.push('studioRevision  ' + ((meta && meta.studioRevision) || '—'));
  L.push('```');
  L.push('');
  L.push('## Animationssätze, so wie sie geladen wurden');
  L.push('');
  (entries || []).forEach((e) => L.push('- `' + e.path + '` — ' + (e.error ? 'FEHLER: ' + e.error : e.clips.length + ' Clips')));
  L.push('');
  L.push('## Was hier NICHT steht');
  L.push('');
  L.push('Ein Commit-Hash. Der Ladeweg zeigt auf einen Zweig, nicht auf einen Stand — wer eine');
  L.push('reproduzierbare Fassung braucht, muß den Zweig vorher anpinnen. Ein geratener Hash wäre');
  L.push('schlimmer als keiner.');
  return L.join('\n');
}

export function download(name, text, type) {
  const blob = new Blob([text], { type: type || 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  return blob.size;
}
