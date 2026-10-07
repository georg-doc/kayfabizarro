/* Validation/transaction seam for the existing WB2 Scene v1 owner.
 * No store, renderer, input, terrain or object owner is created here. */
const copy = value => structuredClone(value);
const fail = message => { throw new Error('WB2 document: ' + message); };
const finite = value => typeof value === 'number' && Number.isFinite(value);
function vector(value, label, nullableY = false) {
  if (!Array.isArray(value) || value.length !== 3 || !value.every((v,i) => finite(v) || (nullableY && i === 1 && v === null))) fail(label);
}
function jsonValue(value, path = 'root', seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') { if (!finite(value)) fail('non-finite '+path); return; }
  if (typeof value !== 'object' || seen.has(value)) fail('non-JSON '+path);
  seen.add(value);
  for (const [key, child] of Object.entries(value)) jsonValue(child, path+'.'+key, seen);
  seen.delete(value);
}
export function validateSceneDocument(input, expectedId) {
  jsonValue(input);
  const d = copy(input);
  if (d?.format !== 'kfb-worldbuilder-scene' || d.version !== 1) fail('unsupported Scene version');
  if (typeof d.id !== 'string' || !d.id.trim() || (expectedId && d.id !== expectedId)) fail('unexpected document identity');
  const t = d.terrain;
  if (!t || !['seed','height','macroScale','detail'].every(k => finite(t[k]))) fail('invalid terrain');
  if (t.tile && (!['cx','cz','size','seg'].every(k=>finite(t.tile[k])) || t.tile.size <= 0 || !Number.isInteger(t.tile.seg) || t.tile.seg < 1 || t.tile.seg > 1024)) fail('invalid terrain tile');
  if (t.sculpt) {
    if (t.sculpt.version !== 1 || !Array.isArray(t.sculpt.strokes)) fail('invalid sculpt version');
    for (const s of t.sculpt.strokes) {
      if (!['raise','lower'].includes(s.mode) || !finite(s.radius) || s.radius < 0.05 || !finite(s.strength) || s.strength < 0.001 || s.falloff !== 'smooth-c2' || !Array.isArray(s.points)) fail('invalid sculpt stroke');
      for (const p of s.points) if (!Array.isArray(p) || p.length !== 2 || !p.every(finite)) fail('invalid sculpt point');
    }
  }
  if (!Array.isArray(d.objects)) fail('objects missing');
  const ids = new Set();
  for (const r of d.objects) {
    if (!r || typeof r.id !== 'string' || !r.id || ids.has(r.id)) fail('missing/duplicate object ID');
    ids.add(r.id);
    if (typeof r.name !== 'string' || !['prop','resident'].includes(r.kind)) fail('invalid object kind/name');
    if (typeof r.source?.path !== 'string' || !r.source.path || !/^[a-f0-9]{40}$/i.test(r.source.commit || '')) fail('immutable source required: '+r.id);
    vector(r.transform?.position, 'position: '+r.id, true);
    vector(r.transform?.rotation, 'rotation: '+r.id);
    vector(r.transform?.scale, 'scale: '+r.id);
    if (r.transform.scale.some(v => v <= 0)) fail('non-positive scale: '+r.id);
  }
  return d;
}

/** Serializes replacements; validation happens before any owner mutation.
 * Owner rebuild must restore its runtime from the supplied document on rollback. */
export function sceneReplacementQueue({read, rebuild, validate = validateSceneDocument, begin = () => {}, end = () => {}}) {
  let tail = Promise.resolve();
  return input => {
    let candidate;
    try { candidate = validate(input); } catch (error) { return Promise.reject(error); }
    const run = async () => {
      const previous = copy(read());
      const state = begin();
      try { await rebuild(candidate); }
      catch (error) {
        try { await rebuild(previous); }
        catch (rollback) { throw new AggregateError([error, rollback], 'WB2 reconstruction and rollback failed'); }
        throw error;
      }
      finally { end(state); }
      return read();
    };
    const result = tail.then(run);
    tail = result.catch(() => {});
    return result;
  };
}
