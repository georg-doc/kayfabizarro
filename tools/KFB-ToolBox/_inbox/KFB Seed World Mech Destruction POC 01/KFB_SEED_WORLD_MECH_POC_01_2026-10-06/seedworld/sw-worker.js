/* KFB Seed World · POC 01 · chunk worker (same generator source as the main thread) */
import { createGen } from './sw-gen.js';
import { compileChunk, transferables } from './sw-mesh.js';
let gen = null, seed = null;
self.onmessage = (e) => {
  const { id, seed: s, cx, cz, lod, damage, hidden } = e.data;
  if (!gen || seed !== s) { gen = createGen(s); seed = s; }
  const r = compileChunk(gen, cx, cz, lod, damage, hidden);
  r.id = id; r.seed = s;
  self.postMessage(r, transferables(r));
};
