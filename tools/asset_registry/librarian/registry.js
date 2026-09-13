import { REGISTRY_BASE, $, state, fetchJSON, fetchJSONL, option, setBusy } from './state.js';

export async function ensureCatalog() {
  if (state.catalog) return state.catalog;
  setBusy(true, 'Loading catalog…');
  try {
    state.catalog = await fetchJSONL(`${REGISTRY_BASE}/catalog.jsonl`);
    state.catalogById = new Map(state.catalog.map((r) => [r.assetId, r]));
    const formats = [...new Set(state.catalog.map((r) => r.format).filter(Boolean))].sort();
    const collections = [...new Set(state.catalog.map((r) => r.collectionPath).filter(Boolean))].sort((a,b) => a.localeCompare(b));
    $('formatFilter').replaceChildren(option('', 'All formats'), ...formats.map((v) => option(v,v)));
    $('collectionFilter').replaceChildren(option('', 'All collections'), ...collections.map((v) => option(v,v)));
    return state.catalog;
  } finally { setBusy(false); }
}

export async function ensureRigFacts() {
  if (state.rigById) return state.rigById;
  setBusy(true, 'Loading rig facts…');
  try {
    const rows = await fetchJSONL(`${REGISTRY_BASE}/rigfacts.jsonl`);
    state.rigById = new Map(rows.map((r) => [r.assetId, r.rigFacts]));
    if (state.catalog) for (const record of state.catalog) {
      const rig = state.rigById.get(record.assetId); if (rig) record.rigFacts = rig;
    }
    return state.rigById;
  } finally { setBusy(false); }
}

function mapProblem(path, problem) {
  if (!path) return; const rows = state.problemsByAsset.get(path) || []; rows.push(problem); state.problemsByAsset.set(path, rows);
}
export async function ensureProblems() {
  if (state.problems) return state.problems;
  setBusy(true, 'Loading review queue…');
  try {
    const doc = await fetchJSON(`${REGISTRY_BASE}/problems.json`); state.problems = doc.problems || []; state.problemsByAsset = new Map();
    for (const problem of state.problems) {
      mapProblem(problem.assetPath, problem); mapProblem(problem.path, problem);
      for (const path of problem.paths || []) mapProblem(path, problem);
    }
    return state.problems;
  } finally { setBusy(false); }
}

export function renderMetrics() {
  const counts = state.manifest?.counts || {}, byKind = counts.byKind || {};
  const review = Object.values(counts.problems || {}).reduce((sum,v) => sum + Number(v || 0), 0);
  const rows = [['assets',counts.total],['3D models',byKind['model-3d']],['images',byKind['image-2d']],['audio',byKind.audio],['packs',counts.packs],['rigged',state.rigSummary?.riggedModelCount || 0],['review items',review]];
  $('metrics').replaceChildren(...rows.map(([label,value]) => {
    const div=document.createElement('div'); div.className='metric'; const b=document.createElement('b'); b.textContent=Number(value||0).toLocaleString(); const s=document.createElement('span'); s.textContent=label; div.append(b,s); return div;
  }));
}
