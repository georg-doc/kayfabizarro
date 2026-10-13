import fs from 'node:fs';
const A = process.env.HOME + '/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/public/assets/';
function glbJson(p) { const b = fs.readFileSync(p); const len = b.readUInt32LE(12); return JSON.parse(b.subarray(20, 20 + len).toString('utf8')); }
const want = ['Idle_A', 'Walking_B', 'Running_A', 'Running_B', 'Jump_Start', 'Jump_Idle', 'Jump_Land', 'Walking_A', 'Walking_C'];
const have = new Map();
for (const f of ['Rig_Medium_General.glb', 'Rig_Medium_MovementBasic.glb', 'Rig_Medium_MovementAdvanced.glb']) {
  const j = glbJson(A + 'kaykit/anims/' + f); const names = (j.animations || []).map(a => a.name);
  console.log(f, names.length, 'clips'); for (const n of names) if (!have.has(n)) have.set(n, f);
}
for (const w of want) console.log('  ', w.padEnd(11), have.get(w) ?? 'FEHLT');
const jumps = [...have.keys()].filter(n => /jump/i.test(n)); console.log('jump clips:', jumps.join(','));
const m = glbJson(A + 'figures-b2/mannequin_medium/Mannequin_Medium.glb');
console.log('Mannequin_Medium nodes', m.nodes.length, 'skins', (m.skins || []).length, 'joints', m.skins?.[0]?.joints.length, 'handslot?', m.nodes.some(n => /handslot/i.test(n.name)));
const anim = await import(process.argv[2]);
for (const s of [0, 0.5, 2.0, 4.0, 6]) console.log('locoWeights', s, JSON.stringify(anim.locoWeights(s)));
