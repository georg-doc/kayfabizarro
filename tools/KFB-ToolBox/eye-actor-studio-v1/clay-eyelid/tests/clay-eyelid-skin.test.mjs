// KFB Clay-Lid E2 · Node-Netzprüfung ohne Browser und ohne three.js.
// Run (repo root): node tools/KFB-ToolBox/eye-actor-studio-v1/clay-eyelid/tests/clay-eyelid-skin.test.mjs
// Needs Node >= 22.12: clay-eyelid.v*.js / mesh-qa.v1.js are ES modules with a .js suffix and no package.json
// (Node detects the module syntax). Pixel occlusion stays browser work (index.html / eyelid-bench.v3.js).
// Zustände wie die Werkbank (STATES in eyelid-bench.v3.js): weit / Ruhe / 25 / 50 / 75 / zu, EyeRig-v6-Signal.
// Sollwerte aus CURRENT_STATE.md (Session-Schnitt 2026-10-16 r1), gemessen im Browser, nicht gerundet:
//   Randkanten 0 roh/verschweißt · nicht-mannigfaltig 0 · Windung 0 · Volumen > 0 · χ = 2 · 1 Körper ·
//   Selbstdurchdringung 0 Treffer (442 367 Paare) · entartet/doppelt 0/0 · Dreiecksgüte min 0,026 · Abstand 1,20 % R ·
//   31 360 Dreiecke, gleiche Topologie in jedem Zustand.
import assert from 'node:assert/strict';
import { clayEyelidSkinData, apertureV6, DEFAULTS2, CLAY_SKIN_SCHEMA, V6 } from '../clay-eyelid.v2.js';
import { DEFAULTS } from '../clay-eyelid.v1.js';
import { meshQA } from '../mesh-qa.v1.js';

const [maj, min] = process.versions.node.split('.').map(Number);
if (maj < 22 || (maj === 22 && min < 12)) console.warn(`WARN Node ${process.versions.node}: ESM syntax detection for .js needs Node >= 22.12`);

let pass = 0;
const ok = (cond, label) => { assert.ok(cond, label); console.log('PASS', String(++pass).padStart(3), label); };

// Gleiche Ableitung wie eyelid-bench.v3.js: lidC(), clrEff() mit v6-Pupille, e2Opts() mit den Werkbank-Vorgaben.
const STATES = [
  { k: -1, label: 'weit' }, { k: 0, label: 'Ruhe' }, { k: 0.25, label: '25 %' },
  { k: 0.5, label: '50 %' }, { k: 0.75, label: '75 %' }, { k: 1, label: 'zu' },
];
const lidC = (k, upper) => k < 0 ? V6.lidMin : Math.max(upper ? V6.restU : V6.restL, k);
const clearance = Math.max(DEFAULTS.clearance, V6.pupilShell - 1 + 0.004);
const e2Opts = (k) => {
  const o = Object.assign({}, DEFAULTS2, { clearance });
  o.aperture = apertureV6(lidC(k, true), lidC(k, false), o);
  return o;
};

const T_EXPECT = 31360;
const runs = [];
for (const s of STATES) {
  const d = clayEyelidSkinData(e2Opts(s.k));
  const q = meshQA(d.positions, d.indices, { eyeRadius: 1 });
  runs.push({ s, d, q });
  const t = `[${s.label}]`;
  ok(d.schema === CLAY_SKIN_SCHEMA, `${t} schema ${d.schema}`);
  ok([...d.positions].every(Number.isFinite), `${t} alle Positionen endlich`);
  ok(q.raw.boundary === 0, `${t} Randkanten roh 0`);
  ok(q.welded.boundary === 0, `${t} Randkanten verschweißt 0`);
  ok(q.raw.nonManifold === 0 && q.welded.nonManifold === 0, `${t} nicht-mannigfaltige Kanten 0 (roh/verschweißt)`);
  ok(q.raw.winding === 0 && q.welded.winding === 0, `${t} Windungskonflikte 0 (roh/verschweißt)`);
  ok(q.closed && q.euler === 2, `${t} χ = 2 (gemessen ${q.euler})`);
  ok(q.components === 1, `${t} 1 Körper`);
  ok(q.volume > 0 && q.outward === true, `${t} Volumen > 0, Normalen nach außen (V = ${q.volume.toFixed(6)} R³)`);
  ok(q.self && q.self.hits === 0, `${t} Selbstdurchdringung 0 Treffer (${q.self.tests} Paare)`);
  ok(q.degenerate === 0, `${t} entartete Dreiecke 0`);
  ok(q.duplicates === 0, `${t} doppelte Dreiecke 0`);
  ok(q.spikes === 0, `${t} Dreiecksgüte ≥ 0,02 überall (min ${q.minQuality.toFixed(4)})`);
  ok(q.clearance > 0, `${t} Abstand Haut–Augapfel > 0 (${(q.clearance * 100).toFixed(2)} % R)`);
  ok(q.F === T_EXPECT, `${t} Dreiecke ${q.F} = ${T_EXPECT}`);
}

// Gleiche Topologie: Vertexzahl gleich, Indexpuffer byte-gleich über alle sechs Zustände.
const ref = runs[0].d;
const refBytes = Buffer.from(ref.indices.buffer, ref.indices.byteOffset, ref.indices.byteLength);
for (const r of runs.slice(1)) {
  const b = Buffer.from(r.d.indices.buffer, r.d.indices.byteOffset, r.d.indices.byteLength);
  ok(r.d.positions.length === ref.positions.length, `[${r.s.label}] Vertexzahl gleich wie [weit] (${r.d.positions.length / 3})`);
  ok(Buffer.compare(b, refBytes) === 0, `[${r.s.label}] Indexpuffer byte-gleich wie [weit] (${b.length} B)`);
}
// Gegenprobe, dass die Zustände wirklich verschieden sind (sonst prüft der Byte-Vergleich nichts).
ok(Buffer.compare(Buffer.from(runs[0].d.positions.buffer), Buffer.from(runs[5].d.positions.buffer)) !== 0, 'Positionen [weit] ≠ [zu] (Lidschluss bewegt die Haut)');

// Summen gegen die Browser-Messung (CURRENT_STATE.md).
const pairs = runs.reduce((a, r) => a + r.q.self.tests, 0);
const qMin = Math.min(...runs.map((r) => r.q.minQuality));
const cMin = Math.min(...runs.map((r) => r.q.clearance));
// Paarzahl ist Breitphasen-Statistik (Gitterzellen), kein Prüfkriterium: nur ausgeben, nicht festschreiben.
console.log(`INFO      Durchdringungs-Paare gesamt ${pairs} (CURRENT_STATE.md, Browser: 442 367)`);
ok(qMin.toFixed(3) === '0.026', `Dreiecksgüte min ${qMin.toFixed(5)} (Browser: 0,026)`);
ok((cMin * 100).toFixed(2) === '1.20', `Abstand min ${(cMin * 100).toFixed(4)} % R (Browser: 1,20 % R)`);

// Lidspalt je Zustand, zur Ablage.
console.log('\nLidspalt (Grad) je Zustand: U oben · L unten · A Lidwinkel');
for (const r of runs) { const a = r.d.meta.aperture; console.log(`  ${r.s.label.padEnd(5)} U ${a.U.toFixed(3)} · L ${a.L.toFixed(3)} · A ${a.A.toFixed(3)}`); }

// Negativ-Gegenprobe: dieselbe Prüfung muss thin-clay-lid.v1 (FAIL 14.10.) als kaputt melden.
let thin = null;
try { thin = await import('../../thin-clay-lid.v1.mjs'); }
catch (e) { if (e && e.code === 'ERR_MODULE_NOT_FOUND') console.log('\nSKIP Negativ-Gegenprobe: ../../thin-clay-lid.v1.mjs fehlt neben dieser Ablage'); else throw e; }
if (thin) {
  console.log('');
  for (const upper of [true, false]) {
    const d = thin.thinClayLidMeshData({ upper, blink: 0 });
    const q = meshQA(d.positions, d.indices, { eyeRadius: 1, selfIntersection: false });
    const bad = !q.closed || q.welded.nonManifold > 0 || q.euler !== 2 || q.degenerate > 0 || q.duplicates > 0;
    ok(bad, `Negativ thin-clay ${upper ? 'Oberlid' : 'Unterlid'} Ruhe wird erkannt: nicht-mannigfaltig ${q.welded.nonManifold}, χ ${q.euler}, entartet ${q.degenerate}, doppelt ${q.duplicates}`);
  }
}

console.log(`\nTOTAL ${pass}/${pass} PASS`);
