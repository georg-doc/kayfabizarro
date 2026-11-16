// KFB Clay v1.4 · unit test (v1.1 contract on the v1.4 module, plus the stage "Koernung"). Node, no WebGL. Run from CLAY_SSOT_R1: node tests/kfb-clay.v1.4.unit.test.mjs
// three.js: KFB_THREE=/abs/three.module.js, else the Lab copy (read only). Checks API contract, profile limits, determinism of the
// JS side (seed, per-mesh k), scale normalisation through the skin, and that the GLSL has no UV, no sin-hash, no fwidth.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const T = process.env.KFB_THREE || path.join(process.env.HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab/node_modules/three/build/three.module.js');
const THREE = await import(pathToFileURL(T).href);
const C = await import(pathToFileURL(path.join(HERE, '../kfb-clay.v1.4.js')).href);
let n = 0; const ok = (c, l) => { assert.ok(c, l); console.log('PASS', String(++n).padStart(2), l); };

// 1 · profiles
ok(JSON.stringify(Object.keys(C.CLAY_PROFILES)) === '["character","midground","background"]', 'exactly three profiles: character, midground, background');
for (const P of Object.values(C.CLAY_PROFILES)) {
  ok(Object.isFrozen(P) && Object.isFrozen(P.dent) && Object.isFrozen(P.bands), `${P.id}: frozen (tools cannot tune numbers)`);
  ok(P.roughMin >= C.ROUGH_FLOOR && P.sheen <= C.SHEEN_MAX, `${P.id}: matte (roughMin ${P.roughMin} >= 0.6, sheen ${P.sheen} <= 0.05)`);
  for (const [k, b] of Object.entries(P.bands)) ok(b[0] <= b[1], `${P.id}: band ${k} gone <= full`);
}
ok(C.CLAY_PROFILES.character.facet.slope === 0, 'character: no facets (faces stay calm, V-053)');
ok(C.CLAY_PROFILES.background.grain.slope === 0, 'background: no grain (calm far field)');
ok(C.resolveProfile('figure-fine').id === 'character' && C.resolveProfile('vehicle').id === 'midground' && C.resolveProfile('terrainBg').id === 'background', 'aliases: figure-fine/vehicle/terrainBg');
assert.throws(() => C.resolveProfile('glossy')); ok(true, 'unknown profile name throws');

// 2 · seed
ok(C.seedFrom('frizzlebob') === C.seedFrom('frizzlebob') && C.seedFrom('frizzlebob') !== C.seedFrom('gothgirl'), 'seedFrom: stable per string, different per figure');
ok(C.seedFrom(1234) === 1234, 'seedFrom: numeric claySeed used as is');
const card = { id: 'gothgirl', material: { clayProfile: 'figure-fine' } };
const co = C.clayOptionsFromCard(card);
ok(co.profile === 'character' && co.seed === 'gothgirl' && co.scaleRef === 'object', 'clayOptionsFromCard: name only on the card, seed falls back to card id');

// 3 · GLSL hygiene (determinism by construction)
const src = readFileSync(path.join(HERE, '../kfb-clay.v1.4.js'), 'utf8');
const KOERN_KEYS = ['KOERN_DECL', 'KOERN_COLOR', 'KOERN_NORMAL'];
const glsl = Object.entries(C.GLSL).filter(([k]) => !KOERN_KEYS.includes(k)).map(([, v]) => v).join('\n');   // v1.1 base GLSL
const kglsl = KOERN_KEYS.map((k) => C.GLSL[k]).join('\n');
ok(!/\b(v?[Uu]v\d?|vUv|uv)\b/.test(glsl), 'GLSL: no UV anywhere (relief is object space)');
ok(!/\bsin\s*\(/.test(glsl) && !/fract\s*\(\s*sin/.test(glsl), 'GLSL: no sin-hash (integer PCG3D hash, bit-exact across GPUs)');
ok(!/fwidth|dFdx|dFdy/.test(glsl), 'GLSL: no screen derivatives (bands use projection + depth, resolution independent)');
ok(!/texture\s*\(|texture2D|sampler2D/.test(glsl), 'GLSL: no texture lookups (nothing tiles)');
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
ok(!/Math\.random|Date\.now|performance\.now/.test(code), 'JS: no Math.random / time in code');

// 4 · applyClay on a synthetic skinned figure: k normalised to height, invariant under stage scale and skin scale
function figure(meshScale = 1) {
  const g = new THREE.CylinderGeometry(0.3, 0.3, 2, 16, 8).translate(0, 1, 0); // 2 local units tall
  const n = g.attributes.position.count; g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Array(n * 4).fill(0), 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(new Array(n).fill([1, 0, 0, 0]).flat(), 4));
  const bone = new THREE.Bone(); bone.name = 'root';
  const mesh = new THREE.SkinnedMesh(g, new THREE.MeshStandardMaterial({ color: '#f2c93c', roughness: 0.3, metalness: 0.5, name: 'skin' })); mesh.name = 'Body';
  const arm = new THREE.Group(); arm.scale.setScalar(meshScale); arm.add(bone); arm.add(mesh);
  arm.updateMatrixWorld(true); mesh.bind(new THREE.Skeleton([bone]), mesh.matrixWorld);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshStandardMaterial()); eye.name = 'FB_Eye_L'; eye.position.set(0, 1.8, 0.3); arm.add(eye);
  const root = new THREE.Group(); root.name = 'fig'; root.add(arm); root.updateMatrixWorld(true); return root;
}
const A = figure(1), hA = C.applyClay(A, THREE, { profile: 'character', seed: 'frizzlebob' });
const B = figure(0.01); B.scale.setScalar(100 * 3.7); B.updateMatrixWorld(true); // armature 0.01 (Mixamo-like) inside a stage scale x3.7
const hB = C.applyClay(B, THREE, { profile: 'character', seed: 'frizzlebob' });
const kA = hA.meshes[0].k, kB = hB.meshes[0].k;
ok(Math.abs(kA * 2 - 1) < 1e-3, `k = 1/height in local units (k ${kA}, expected 0.5)`);
ok(Math.abs(kA - kB) / kA < 1e-3, `k invariant under armature 0.01 and stage x3.7 (k ${kA} vs ${kB}) -> same relief density on the face`);
const bodyA = A.getObjectByName('Body').material, bodyB = B.getObjectByName('Body').material;
ok(bodyA.userData.kfbClay && bodyA.userData.kfbClay.seed.join() === bodyB.userData.kfbClay.seed.join(), 'same card seed -> same per-mesh lattice offset on every load');
ok(bodyA.roughness >= 0.72 && bodyA.metalness === 0 && bodyA.sheen <= 0.05, `material matte (rough ${bodyA.roughness}, metal ${bodyA.metalness}, sheen ${bodyA.sheen})`);
ok(A.getObjectByName('FB_Eye_L').material.userData.kfbClay === undefined, 'eyes are skipped');
ok(bodyA.map === null && bodyA.color.getHexString() === 'f2c93c', 'source colour kept');
const hP = C.applyClay(A, THREE, { profile: 'character', seed: 'x', palette: ['#ff0000'], pull: 0.9 });
ok(hP.uniforms.uClayPull.value === C.MAX_PULL, 'palette pull clamped to 18 %');
ok(C.removeClay(A) === 1 && A.getObjectByName('Body').material.name === 'skin', 'removeClay restores the original material');
const again = C.applyClay(A, THREE, { profile: 'midground', seed: 'frizzlebob' }); C.applyClay(A, THREE, { profile: 'midground', seed: 'frizzlebob' });
ok(A.getObjectByName('Body').material.userData.kfbClay.profile === 'midground' && again.meshes.length === 1, 'applyClay is idempotent (re-apply replaces, never stacks)');

// 5 · v1.4 stage "Koernung"
const V11 = await import(pathToFileURL(path.join(HERE, '../kfb-clay.v1.1.js')).href);
const K = C.KOERNUNG;
ok(K.tile === 1.5 && K.strength === 0.35 && K.speck.cell === 0.0105 && K.speck.cover === 0.05 && K.speck.dark === 0.3 && K.colour.hue === 0.14 && K.colour.lum === 0.05 && K.colour.big === 0.22 && K.colour.mid === 0.09, 'KOERNUNG values = handover (tile 1.5 H, 0.35; specks 5 %, 1.05 %, 30 %; OKLab +-0.14 rad / +-5 %, patches 0.22 / 0.09)');
ok(Object.isFrozen(K) && Object.isFrozen(K.speck) && JSON.stringify(K.profiles) === '["character"]', 'KOERNUNG frozen, profile character only (kit-figure = character + game override)');
ok(!/\bsin\s*\(|\bcos\s*\(|fwidth|dFdx|dFdy/.test(kglsl) && !/\b(v?[Uu]v\d?|vUv|uv)\b/.test(kglsl), 'Koernung GLSL: no sin/cos (polynomial rotation), no screen derivatives, no UV (triplanar in object space)');
ok(/texture\s*\(\s*uKoernMap/.test(kglsl) && (kglsl.match(/texture\s*\(/g) || []).length === 3, 'Koernung GLSL: exactly three lookups of the one grain map (triplanar)');
// shader text of a converted material, compiled against the real three.js chunks
const compile = (mat) => { const sh = { uniforms: {}, vertexShader: THREE.ShaderLib.physical.vertexShader, fragmentShader: THREE.ShaderLib.physical.fragmentShader }; mat.onBeforeCompile(sh); return sh; };
const F11 = figure(1), F14 = figure(1);
V11.applyClay(F11, THREE, { profile: 'character', seed: 'frizzlebob' }); C.applyClay(F14, THREE, { profile: 'character', seed: 'frizzlebob' });
const s11 = compile(F11.getObjectByName('Body').material), s14 = compile(F14.getObjectByName('Body').material);
ok(s11.vertexShader === s14.vertexShader && s11.fragmentShader === s14.fragmentShader, 'koernung off: vertex and fragment shader identical to v1.1 (same GLSL, character by character)');
ok(JSON.stringify(Object.keys(s11.uniforms).sort()) === JSON.stringify(Object.keys(s14.uniforms).sort()) && Object.keys(s14.uniforms).every((k) => JSON.stringify(s14.uniforms[k].value) === JSON.stringify(s11.uniforms[k].value)), 'koernung off: same uniforms with the same values as v1.1');
assert.throws(() => C.applyClay(figure(1), THREE, { profile: 'character', seed: 'x', koernung: true })); ok(true, 'koernung without koernungMap throws (no fixed path in the module)');
function figureParts() { const root = figure(1), arm = root.children[0];
  const add = (name, mat) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshStandardMaterial({ name: mat })); m.name = name; arm.add(m); };
  add('Carl_Brow_L', 'Carl_Brow'); add('Carl_Nose', 'Carl_Brow'); add('KFB_Shirt_FB', 'KFB_Shirt_Cloth'); add('CharacterTemplate_ArmLeft', 'FB_Yellow'); add('kfb-hair-tuft#1_L', 'Carl_Brow');
  root.updateMatrixWorld(true); return root; }
const tex = new THREE.Texture();
const FK = figureParts(), hK = C.applyClay(FK, THREE, { profile: 'character', seed: 'frizzlebob', koernung: true, koernungMap: tex });
const kOn = (n) => FK.getObjectByName(n).material.userData.kfbClay.koernung;
ok(kOn('Body') === true && kOn('CharacterTemplate_ArmLeft') === true, 'koernung on: skin meshes get the grain');
ok(kOn('Carl_Brow_L') === false && kOn('Carl_Nose') === false && kOn('KFB_Shirt_FB') === false && kOn('kfb-hair-tuft#1_L') === false, 'koernung exceptions: brows, nose, hair tufts, shirt keep v1.1 clay without grain');
ok(FK.getObjectByName('FB_Eye_L').material.userData.kfbClay === undefined, 'eyes stay without any clay (SKIP_DEFAULT, as v1.1)');
const sK = compile(FK.getObjectByName('Body').material);
ok(/kfbKoernTri/.test(sK.fragmentShader) && sK.uniforms.uKoernMap.value === tex && sK.uniforms.uKoernOn.value === 1, 'koernung on: stage code and the caller map in the shader');
ok(FK.getObjectByName('Body').material.customProgramCacheKey() !== F14.getObjectByName('Body').material.customProgramCacheKey(), 'koernung on/off compile to different programs (off keeps the v1.1 program)');
const fd = hK.koernUniforms.uKoernFade.value; ok(Math.abs(fd.x - 1 / 1080) < 1e-9 && Math.abs(fd.y - 2 / 1080) < 1e-9 && Math.abs(fd.z - 1.2 / 1080) < 1e-9 && Math.abs(fd.w - 2.4 / 1080) < 1e-9, 'distance fade: grain full at >= 2 px, gone at <= 1 px (1080p); specks 2.4 / 1.2 px');
hK.setKoernung(false); ok(hK.koernUniforms.uKoernAll.value === 0, 'handle.setKoernung(false) switches the stage off at runtime'); hK.setKoernung(true);
const FX = figureParts(), hX = C.applyClay(FX, THREE, { profile: 'character', seed: 'frizzlebob', koernung: true, koernungMap: tex, koernungSkip: /ArmLeft/ });
ok(FX.getObjectByName('CharacterTemplate_ArmLeft').material.userData.kfbClay.koernung === false, 'koernungSkip from the figure card adds exceptions');
const FM = figureParts(), hM = C.applyClay(FM, THREE, { profile: 'midground', seed: 'p', koernung: true, koernungMap: tex });
ok(!/kfbKoernTri/.test(compile(FM.getObjectByName('Body').material).fragmentShader) && /not used/.test(hM.info().koernung), 'midground / background ignore koernung (values are in figure heights)');
const FK2 = figureParts(); C.applyClay(FK2, THREE, { profile: 'character', seed: 'frizzlebob', koernung: true, koernungMap: tex });
ok(FK2.getObjectByName('Body').material.userData.kfbClay.seed.join() === FK.getObjectByName('Body').material.userData.kfbClay.seed.join(), 'same card seed -> same speckle and patch hash on every load (V-429)');
console.log(`\n${n} checks PASS`);
