/* KFB Scene Patch · host-neutral session layer
   Schema: kfb.scene-patch.v1
   Owner: ToolBox patch/session mechanics only. Host retains scene, loader, camera, generator,
   physics, asset truth and permanent recipe/save ownership.

   The S21 rule still applies: the recipe remains the source. This module exports/imports a
   reversible patch and may keep a local draft; it never rewrites a host recipe automatically. */

export const SCENE_PATCH_SCHEMA = 'kfb.scene-patch.v1';
const EPS = 1e-6;

const finite3 = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);
const round = (n) => Math.abs(n) < 1e-12 ? 0 : +n.toFixed(6);
const vec3 = (v) => [round(v.x), round(v.y), round(v.z)];
const cloneState = (s) => ({
  position: s.position.slice(),
  rotation: s.rotation.slice(),
  scale: s.scale.slice(),
  rotationOrder: s.rotationOrder || 'XYZ'
});
const same3 = (a,b) => a.every((v,i)=>Math.abs(v-b[i]) <= EPS);
const sameState = (a,b) => same3(a.position,b.position) && same3(a.rotation,b.rotation) && same3(a.scale,b.scale) && (a.rotationOrder||'XYZ') === (b.rotationOrder||'XYZ');

export function readTransform(node) {
  return {
    position: vec3(node.position),
    rotation: [round(node.rotation.x), round(node.rotation.y), round(node.rotation.z)],
    scale: vec3(node.scale),
    rotationOrder: node.rotation.order || 'XYZ'
  };
}

export function applyTransform(node, state) {
  if (!finite3(state?.position) || !finite3(state?.rotation) || !finite3(state?.scale)) {
    throw new Error('INVALID_TRANSFORM');
  }
  node.position.fromArray(state.position);
  node.rotation.set(state.rotation[0], state.rotation[1], state.rotation[2], state.rotationOrder || node.rotation.order || 'XYZ');
  node.scale.fromArray(state.scale);
  node.updateMatrixWorld(true);
}

function validRecord(rec) {
  return !!(rec && typeof rec.id === 'string' && rec.id && typeof rec.assetId === 'string' && rec.assetId && typeof rec.sourceRef === 'string' && rec.sourceRef);
}

export function makeScenePatchSession(opts = {}) {
  const host = opts.host;
  const source = opts.source;
  const resolve = opts.resolve;
  const recordOf = opts.recordOf || ((node) => node?.userData?.scenePatchRecord);
  const storageKey = opts.storageKey || null;
  if (!host || !source?.assetId || !source?.sourceRef || typeof resolve !== 'function') throw new Error('SCENE_PATCH_BAD_HOST_CONTRACT');

  const baseline = new Map();
  const records = new Map();
  const listeners = new Set();
  const undoStack = [];
  const redoStack = [];
  let pending = null;

  const notify = () => {
    const s = api.stats();
    opts.onChange?.(s);
    for (const f of listeners) f(s);
  };
  const safeStore = (kind, value) => {
    if (!storageKey || typeof localStorage === 'undefined') return false;
    try {
      if (kind === 'set') localStorage.setItem(storageKey, value);
      else if (kind === 'remove') localStorage.removeItem(storageKey);
      return true;
    } catch { return false; }
  };

  function register(nodes, { reset = true } = {}) {
    if (reset) { baseline.clear(); records.clear(); undoStack.length = 0; redoStack.length = 0; pending = null; }
    for (const node of nodes || []) {
      const rec = recordOf(node);
      if (!validRecord(rec)) continue;
      if (records.has(rec.id)) throw new Error('DUPLICATE_OBJECT_ID:' + rec.id);
      records.set(rec.id, { id:rec.id, assetId:rec.assetId, sourceRef:rec.sourceRef, group:rec.group || null });
      baseline.set(rec.id, readTransform(node));
    }
    notify();
    return records.size;
  }

  function snapshot(nodes) {
    const out = [];
    for (const node of nodes || []) {
      const rec = recordOf(node);
      if (!validRecord(rec) || !baseline.has(rec.id)) continue;
      out.push({ id: rec.id, state: readTransform(node) });
    }
    return out;
  }

  function begin(nodes, label='transform') {
    pending = { label, before: snapshot(nodes) };
    return pending.before.length;
  }

  function commit(nodes, label) {
    if (!pending) return false;
    const before = pending.before;
    const after = snapshot(nodes);
    const beforeById = new Map(before.map(x=>[x.id,x.state]));
    const changed = after.filter(x => beforeById.has(x.id) && !sameState(beforeById.get(x.id),x.state));
    if (!changed.length) { pending = null; notify(); return false; }
    const ids = new Set(changed.map(x=>x.id));
    undoStack.push({
      label: label || pending.label || 'transform',
      before: before.filter(x=>ids.has(x.id)).map(x=>({id:x.id,state:cloneState(x.state)})),
      after: changed.map(x=>({id:x.id,state:cloneState(x.state)}))
    });
    redoStack.length = 0;
    pending = null;
    api.saveDraft();
    notify();
    return true;
  }

  function restoreStates(rows) {
    const touched = [];
    for (const row of rows || []) {
      const node = resolve(row.id);
      if (!node) throw new Error('MISSING_OBJECT:' + row.id);
      applyTransform(node,row.state);
      touched.push(node);
    }
    opts.onApplied?.(touched);
    return touched;
  }

  function makePatch() {
    const ops = [];
    for (const [id, base] of baseline) {
      const node = resolve(id);
      if (!node) continue;
      const now = readTransform(node);
      if (sameState(base,now)) continue;
      const rec = records.get(id);
      ops.push({
        id,
        source: { assetId: rec.assetId, sourceRef: rec.sourceRef },
        position: now.position,
        rotation: now.rotation,
        scale: now.scale,
        rotationOrder: now.rotationOrder
      });
    }
    return {
      schema: SCENE_PATCH_SCHEMA,
      host,
      source: { ...source },
      ops
    };
  }

  function validatePatch(doc) {
    const errors = [];
    const plan = [];
    if (!doc || doc.schema !== SCENE_PATCH_SCHEMA) errors.push('SCHEMA_MISMATCH');
    if (doc?.host !== host) errors.push('HOST_MISMATCH');
    if (doc?.source?.assetId !== source.assetId || doc?.source?.sourceRef !== source.sourceRef) errors.push('HOST_SOURCE_MISMATCH');
    if (source.revision && doc?.source?.revision !== source.revision) errors.push('HOST_REVISION_MISMATCH');
    if (!Array.isArray(doc?.ops)) errors.push('OPS_NOT_ARRAY');
    const seen = new Set();
    for (const op of Array.isArray(doc?.ops) ? doc.ops : []) {
      if (!op?.id || seen.has(op.id)) { errors.push('BAD_OR_DUPLICATE_ID:' + String(op?.id)); continue; }
      seen.add(op.id);
      const node = resolve(op.id);
      const rec = node && recordOf(node);
      if (!node || !validRecord(rec)) { errors.push('MISSING_OBJECT:' + op.id); continue; }
      if (op?.source?.assetId !== rec.assetId || op?.source?.sourceRef !== rec.sourceRef) { errors.push('OBJECT_SOURCE_MISMATCH:' + op.id); continue; }
      if (!finite3(op.position) || !finite3(op.rotation) || !finite3(op.scale)) { errors.push('INVALID_TRANSFORM:' + op.id); continue; }
      plan.push({ node, id:op.id, state:{ position:op.position.slice(), rotation:op.rotation.slice(), scale:op.scale.slice(), rotationOrder:op.rotationOrder || node.rotation.order || 'XYZ' } });
    }
    return { ok: errors.length === 0, errors, plan };
  }

  function applyPatch(doc, label='import') {
    const v = validatePatch(doc);
    if (!v.ok) return v;
    const before = v.plan.map(x=>({id:x.id,state:readTransform(x.node)}));
    try {
      for (const x of v.plan) applyTransform(x.node,x.state);
      opts.onApplied?.(v.plan.map(x=>x.node));
    } catch (e) {
      try { restoreStates(before); } catch {}
      return { ok:false, errors:['APPLY_ROLLED_BACK:'+(e?.message||e)], plan:[] };
    }
    const after = v.plan.map(x=>({id:x.id,state:readTransform(x.node)}));
    if (after.some((x,i)=>!sameState(before[i].state,x.state))) {
      undoStack.push({label,before,after});
      redoStack.length=0;
    }
    api.saveDraft();
    notify();
    return { ok:true, errors:[], applied:after.length };
  }

  function undo() {
    const h = undoStack.pop();
    if (!h) return false;
    restoreStates(h.before);
    redoStack.push(h);
    api.saveDraft(); notify(); return true;
  }
  function redo() {
    const h = redoStack.pop();
    if (!h) return false;
    restoreStates(h.after);
    undoStack.push(h);
    api.saveDraft(); notify(); return true;
  }
  function reset() {
    const before = [];
    const after = [];
    for (const [id, base] of baseline) {
      const node=resolve(id); if(!node) continue;
      const now=readTransform(node);
      if(sameState(now,base)) continue;
      before.push({id,state:now}); applyTransform(node,base); after.push({id,state:cloneState(base)});
    }
    if(before.length){ undoStack.push({label:'reset',before,after}); redoStack.length=0; opts.onApplied?.(before.map(x=>resolve(x.id)).filter(Boolean)); }
    api.saveDraft(); notify(); return before.length;
  }

  const api = {
    schema: SCENE_PATCH_SCHEMA,
    host, source,
    register, begin, commit,
    makePatch, validatePatch, applyPatch,
    undo, redo, reset,
    onChange(f){listeners.add(f); return ()=>listeners.delete(f);},
    saveDraft(){
      const doc=makePatch();
      if(!doc.ops.length){safeStore('remove');return false;}
      return safeStore('set',JSON.stringify(doc));
    },
    readDraft(){
      if(!storageKey || typeof localStorage==='undefined') return null;
      try { const s=localStorage.getItem(storageKey); return s ? JSON.parse(s) : null; } catch { return null; }
    },
    restoreDraft(){
      const doc=api.readDraft();
      return doc ? applyPatch(doc,'restore-draft') : {ok:false,errors:['NO_DRAFT'],plan:[]};
    },
    clearDraft(){return safeStore('remove');},
    stats(){
      const patch=makePatch();
      return {registered:records.size,changed:patch.ops.length,undo:undoStack.length,redo:redoStack.length,draft:!!api.readDraft()};
    }
  };
  return api;
}
