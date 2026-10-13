const D = process.argv[2];
const THREE = await import(D + '/node_modules/three/build/three.module.js');
const G = await import(D + '/sw-gen.js'); const M = await import(D + '/sw-mesh.js');
const gen = G.createGen(7);
console.log('gen', gen.seed, 'type', gen.type.id ?? gen.type.name, 'CHUNK', G.CHUNK);
const rec = gen.chunkRecipe(0, 0);
console.log('chunk 0,0 buildings', rec.buildings.length, 'trees', rec.trees.length);
const t0 = Date.now(); const r = M.compileChunk(gen, 0, 0, 0, null, null);
console.log('compileChunk lod0 verts', r.pos.length / 3, 'tris', r.idx.length / 3, 'inst', Object.fromEntries(Object.entries(r.inst).map(([k, v]) => [k, v.m.length / 16])), (Date.now() - t0) + 'ms');
const W = await import(D + '/sw-world.js'); const X = await import(D + '/sw-destruct.js'); const F = await import(D + '/sw-fx.js');
console.log('three', THREE.REVISION, 'sw-world', Object.keys(W).join(','), '| sw-destruct', Object.keys(X).join(','), '| sw-fx', Object.keys(F).join(','));
const scene = new THREE.Scene(); const mat = new THREE.MeshStandardMaterial({ vertexColors: true });
try { const w = W.createWorld({ scene, seed: 7, material: mat, useWorker: false }); console.log('createWorld ok, root', w.root.name, 'groundAt(0,0)', w.groundAt(0, 0).toFixed?.(2) ?? w.groundAt(0, 0));
  try { const d = X.createDestruct({ scene, world: w, material: mat, winGeo: w.protos.win, doorGeo: w.protos.door }); console.log('createDestruct ok, api', Object.keys(d).slice(0, 12).join(',')); } catch (e) { console.log('createDestruct ERR', e.message); }
  try { const cam = new THREE.PerspectiveCamera(); const fx = F.createWeaponFX({ scene, camera: cam, groundAt: w.groundAt }); console.log('createWeaponFX ok, meshes', fx.meshes.length); } catch (e) { console.log('createWeaponFX ERR', e.message); }
} catch (e) { console.log('createWorld ERR', e.message); }
