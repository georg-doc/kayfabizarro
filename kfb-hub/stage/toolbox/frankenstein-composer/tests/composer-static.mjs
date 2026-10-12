import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const checks = [
  ['three import map', html.includes('three@0.160.0')],
  ['source/composite/motion modes', ['source','composite','motion'].every(x => html.includes(`data-mode="${x}"`))],
  ['creature panel', html.includes('id="panel-creature"')],
  ['three deterministic variants', ['1042','2718','7331'].every(x => html.includes(`data-seed="${x}"`))],
  ['negative control control', html.includes('id="badWeights"')],
  ['actual GLB export control', html.includes('id="exportCreatureGlb"')],
  ['GothGirl exact source', js.includes('GothGirl/characters/GothGirl.glb')],
  ['Black Knight exact source', js.includes('BlackKnight.glb')],
  ['pinned FB donor', js.includes('19088b142c6a7e7626f27fba8e80caf6ab2437c1')],
  ['Pencil exact source', js.includes('pencil_A_long.gltf')],
  ['Eraser remains source required', js.includes("state:'SOURCE_REQUIRED'")],
  ['EyeRig owner module', js.includes('pet-eye-rig.v6.js')],
  ['Brow owner module', js.includes('brow-rig.v2.js')],
  ['Clay lids owner module', js.includes('clay-lids.v1.js')],
  ['Rig Medium motion library', js.includes('KFB_Motion_Library_${body.rig}.glb')],
  ['one mixer path', (js.match(/new THREE\.AnimationMixer/g) || []).length === 1],
  ['SDF/isovolume mesher', js.includes('function marchCreature') && js.includes('TETS=')],
  ['weld map', js.includes('map=new Map()')],
  ['skin QA', js.includes('applyBoneTransform') && js.includes('oppositeMidlineLeakVertices')],
  ['companion creature recipe', js.includes('kfb.creature-recipe/0.1-candidate')],
  ['primary format retained', js.includes("primaryFormat:'kfb.pets/1'")],
  ['responsive mobile layout', css.includes('@media(max-width:560px)')]
];
for (const [name, ok] of checks) assert.equal(ok, true, name);
console.log(JSON.stringify({suite:'composer-static',passed:checks.length,failed:0}, null, 2));
