// KFB Farbharmonie R1 · Nachweis-Lauf (node kfb-harmony-run.mjs)
//   (a) baut canyon / bucht / otown aus ihrem eigenen Boden-Farbton nach und misst ΔE (OKLab) je Rolle gegen J17
//   (b) erzeugt die sechs Story-Mode-Paletten (V-292-Farbton, Spiel-Helligkeit aus der J17-Leiter)
//   (c) erzeugt 12 Zufallspaletten (feste Seeds → reproduzierbar)
// Schreibt results.json neben dieses Skript. Keine Abhängigkeiten.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromHue, fromStoryMode, random, fromColors, analyse, hexToOklch, deltaE, MODEL, STORY_MODES } from './kfb-cartoon-palette.js';
import { J17 } from './j17-reference.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const r3 = x => +x.toFixed(3);
const byL = (a, b) => (hexToOklch(a).L >= hexToOklch(b).L ? [a, b] : [b, a]);

// Rollen-Zuordnung J17 → Modell. hill[] und leaf[0..1] sind in J17 nicht einheitlich sortiert (otown hill[0] ist der dunkle),
// deshalb nach Helligkeit gepaart: hell ↔ hell, dunkel ↔ dunkel.
function mapJ17(o) {
  const [hl, hd] = byL(...o.hill), [ll, ld] = byL(o.leaf[0], o.leaf[1]);
  return { sky: o.sky, top: o.top, top2: o.top2, hillLight: hl, hillDark: hd, sand: o.sand, rim: o.rim, under0: o.under[0], earth1: o.under[1], earth2: o.under[2], earth3: o.under[3],
    rock: o.rock, tower0: o.tower[0], tower1: o.tower[1], leafLight: ll, leafDark: ld, bloom: o.leaf[2], trunk: o.trunk, cloud: o.cloud, water: o.water, path: o.path,
    roadStreet: o.roadStreet, roadTrack: o.roadTrack, strang: o.strang, pad: o.pad };
}

const out = { schema: 'kfb.color-harmony-results/1', date: '2026-10-15', model: MODEL, j17: {}, storyModes: {}, random: [], fromColorsDemo: null };

// (a) J17-Nachbau
console.log('(a) J17-Nachbau aus dem Boden-Farbton (seed 0 = reine Regel)');
for (const [id, o] of Object.entries(J17)) {
  const g = hexToOklch(o.top).h;
  const p = fromHue(g, 0, 'joyride');
  const orig = mapJ17(o);
  const perRole = {};
  for (const [k, v] of Object.entries(orig)) perRole[k] = { original: v, regel: p.flat[k], dE: r3(deltaE(v, p.flat[k])) };
  const ds = Object.values(perRole).map(r => r.dE);
  const noRoad = Object.entries(perRole).filter(([k]) => !k.startsWith('road')).map(([, r]) => r.dE);
  const res = { label: o.label, anchorHue: r3(g), hues: p.hues, mode: p.mode, meanDE: r3(ds.reduce((a, b) => a + b, 0) / ds.length), maxDE: r3(Math.max(...ds)),
    meanDE_ohneFahrbahn: r3(noRoad.reduce((a, b) => a + b, 0) / noRoad.length), under005: ds.filter(d => d < 0.05).length, roles: ds.length, perRole, palette: p, analyseOriginal: analyse(o) };
  out.j17[id] = res;
  const worst = Object.entries(perRole).sort((a, b) => b[1].dE - a[1].dE).slice(0, 3).map(([k, r]) => `${k} ${r.dE}`).join(', ');
  console.log(`  ${id.padEnd(7)} Boden ${g.toFixed(0)}°  mittel ΔE ${res.meanDE}  max ${res.maxDE}  (${res.under005}/${res.roles} Rollen < 0,05)  größte: ${worst}`);
}

// (b) Story-Modes
console.log('(b) Story-Mode-Paletten (Spiel-Helligkeit)');
for (const id of Object.keys(STORY_MODES)) {
  const p = fromStoryMode(id, 0);
  const lw = hexToOklch(STORY_MODES[id].dunkel).L, lg = hexToOklch(p.flat.top).L;
  out.storyModes[id] = { ...p, lightness: { websiteDunkelL: r3(lw), websiteSattL: r3(hexToOklch(STORY_MODES[id].satt).L), spielBodenL: r3(lg), spielStrangL: r3(hexToOklch(p.flat.strang).L) } };
  console.log(`  ${id.padEnd(9)} Farbton ${p.source.hue}°  Website L ${lw.toFixed(2)} → Spiel-Boden L ${lg.toFixed(2)}  ${JSON.stringify(p.mode)}  Boden ${p.flat.top} Strang ${p.flat.strang} Wahrzeichen ${p.flat.tower0}`);
}

// (c) Zufall
console.log('(c) 12 Zufallspaletten');
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];   // ungeschönt: die ersten zwölf Seeds
for (const s of SEEDS) { const p = random(s); out.random.push(p); console.log(`  seed ${String(s).padEnd(5)} ${p.scheme.padEnd(13)} Boden ${p.hues.ground}°  ${JSON.stringify(p.mode)}`); }

// Vorgabe-Demo: O-Town aus zwei Farben (Boden + Strang) → Rest nach Regel
out.fromColorsDemo = fromColors(['#3aa596', '#e9b53b']);

fs.writeFileSync(path.join(HERE, 'results.json'), JSON.stringify(out, null, 1));
console.log('→ results.json');
