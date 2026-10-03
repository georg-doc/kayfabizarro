/* KFB · motion-measurement-reconcile.v1
 *
 * Compares independent motion measurements without silently preferring one source.
 * This module is evidence reconciliation, not motion authoring and not a runtime state owner.
 */

export const SCHEMA = 'kfb.motion-measurement-reconcile/1';

const numeric = (v) => Number.isFinite(v);
const relDelta = (a,b) => {
  if (!numeric(a) || !numeric(b)) return null;
  const denom = Math.max(Math.abs(a), Math.abs(b), Number.EPSILON);
  return Math.abs(a-b)/denom;
};

function fact(source, field) {
  const value = source?.[field];
  return numeric(value) ? value : null;
}

export function compareNumeric(existing, blender, field) {
  const a=fact(existing,field), b=fact(blender,field);
  if (a==null && b==null) return {field,status:'UNMEASURED_BOTH',existing:null,blender:null,deltaAbs:null,deltaRel:null,resolution:'UNRESOLVED'};
  if (a!=null && b==null) return {field,status:'EXISTING_ONLY',existing:a,blender:null,deltaAbs:null,deltaRel:null,resolution:'UNRESOLVED'};
  if (a==null && b!=null) return {field,status:'BLENDER_ONLY',existing:null,blender:b,deltaAbs:null,deltaRel:null,resolution:'UNRESOLVED'};
  const deltaAbs=Math.abs(a-b), deltaRel=relDelta(a,b);
  return {
    field,
    status:deltaAbs===0?'EXACT_MATCH':'BOTH_MEASURED_DELTA',
    existing:a,
    blender:b,
    deltaAbs,
    deltaRel,
    resolution:deltaAbs===0?'MATCHED':'UNRESOLVED',
  };
}

export function reconcileClip(existingClip, blenderClip, clipName) {
  const statusExisting=existingClip?.autoStatus || existingClip?.status || null;
  const statusBlender=blenderClip?.status || null;
  const numericFields=['duration','referenceSpeed','slipBody'];
  const comparisons=Object.fromEntries(numericFields.map(f=>[f,compareNumeric(existingClip,blenderClip,f)]));
  return {
    clip:clipName,
    statusExisting,
    statusBlender,
    existing:existingClip || null,
    blender:blenderClip || null,
    comparisons,
    semanticWarnings:[
      ...(statusExisting && /HOLD|AMBIGUOUS|PENDING/.test(statusExisting)?['EXISTING_SEMANTIC_STATUS_REQUIRES_REVIEW']:[]),
      ...(statusBlender && statusBlender!=='MEASURED'?['BLENDER_NOT_MEASURED']:[]),
    ],
    resolution:'UNRESOLVED',
    candidate:null,
  };
}

function normalizeExisting(existing) {
  if (existing?.clips) return existing.clips;
  if (existing?.actors?.frizzlebob) {
    const a=existing.actors.frizzlebob, out={};
    for (const [k,v] of Object.entries(a)) if (v && typeof v==='object' && /Walking|Running|Jump|Strafe|Backward/.test(k)) out[k]=v;
    return out;
  }
  return {};
}

function normalizeBlender(blender) {
  const out={};
  for (const row of blender?.clips || []) if (row?.clip) out[row.clip]=row;
  return out;
}

export function reconcileMeasurements(existing, blender, requiredClips=[]) {
  const a=normalizeExisting(existing), b=normalizeBlender(blender);
  const names=[...new Set([...Object.keys(a),...Object.keys(b),...requiredClips])].sort();
  const clips=Object.fromEntries(names.map(n=>[n,reconcileClip(a[n]||null,b[n]||null,n)]));
  const unresolved=names.filter(n=>clips[n].resolution!=='MATCHED');
  return {
    schema:SCHEMA,
    sourceExisting:{
      schema:existing?.schema||null,
      status:existing?.status||null,
      source:existing?.source||null,
    },
    sourceBlender:{
      schema:blender?.schema||null,
      source:blender?.source||null,
      rigFamily:blender?.rigFamily||null,
      actor:blender?.actor||null,
    },
    clips,
    requiredClips:[...requiredClips],
    unresolved,
    readyForProfile:unresolved.length===0,
    rule:'No source wins silently. Delta fields remain unresolved until an explicit measurement/visual acceptance policy resolves them.',
  };
}

export function applyExplicitResolution(report, resolutions={}) {
  const copy=structuredClone(report);
  for (const [clipName, fields] of Object.entries(resolutions)) {
    const row=copy.clips?.[clipName];
    if (!row) continue;
    const candidate={};
    for (const [field, decision] of Object.entries(fields||{})) {
      const cmp=row.comparisons?.[field];
      if (!cmp) continue;
      if (decision==='existing' && cmp.existing!=null) candidate[field]=cmp.existing;
      else if (decision==='blender' && cmp.blender!=null) candidate[field]=cmp.blender;
      else if (numeric(decision)) candidate[field]=decision;
    }
    row.candidate=Object.keys(candidate).length?candidate:null;
    row.resolution=row.candidate?'EXPLICIT_PARTIAL_RESOLUTION':'UNRESOLVED';
  }
  copy.unresolved=Object.keys(copy.clips).filter(n=>copy.clips[n].resolution==='UNRESOLVED');
  copy.readyForProfile=copy.unresolved.length===0;
  return copy;
}
