import fs from 'node:fs';
import { defaultWorld } from '../../src/island/spec.ts';
const w = defaultWorld(); w.added.push('scale-k1');
fs.writeFileSync('docs/backup/world_2026-10-10_default-preK2.json', JSON.stringify({ note: 'Standardwelt des Labs vor der K2-Migration (Stand K1). Georgs gespeicherte Welt liegt in SEINEM Browser (localStorage kfb.worldbuilder.v1); die Migration legt sie vorher unverändert unter kfb.worldbuilder.v1.pre-k2 ab. Abrufbar mit __kfb.preK2(), Rückweg __kfb.undoScaleK2().', world: w }, null, 1));
console.log('ok', w.islands.length);
