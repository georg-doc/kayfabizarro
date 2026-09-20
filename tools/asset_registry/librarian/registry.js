import { registryBase, $, state, fetchJSON, fetchJSONL, option, setBusy } from './state.js';
import { ASSET_TYPES } from './asset-types.js';

function checkboxOption(value,label) {
  const row=document.createElement('label'); row.className='multi-check';
  const input=document.createElement('input'); input.type='checkbox'; input.value=value;
  const span=document.createElement('span'); span.textContent=label;
  row.append(input,span); return row;
}
export function refreshMultiFilterSummaries() {
  for (const [optionsId,summaryId,emptyLabel] of [['typeFilterOptions','typeFilterSummary','All types'],['formatFilterOptions','formatFilterSummary','All formats']]) {
    const host=$(optionsId), summary=$(summaryId); if(!host||!summary)continue;
    const selected=[...host.querySelectorAll('input:checked')].map((input)=>input.nextElementSibling?.textContent||input.value);
    summary.textContent=selected.length ? (selected.length<=2?selected.join(', '):`${selected.length} selected`) : emptyLabel;
  }
}
function populateMultiFilters(formats) {
  const typeHost=$('typeFilterOptions'), formatHost=$('formatFilterOptions');
  if(typeHost&&!typeHost.children.length) typeHost.replaceChildren(...ASSET_TYPES.map(([value,label])=>checkboxOption(value,label)));
  if(formatHost) formatHost.replaceChildren(...formats.map((value)=>checkboxOption(value,value.toUpperCase())));
  refreshMultiFilterSummaries();
}

export async function ensureCatalog() {
  if (state.catalog) return state.catalog;
  setBusy(true, 'Loading catalog…');
  try {
    state.catalog = await fetchJSONL(`${registryBase()}/catalog.jsonl`);
    state.catalogById = new Map(state.catalog.map((r) => [r.assetId, r]));
    const formats = [...new Set(state.catalog.map((r) => r.format).filter(Boolean))].sort();
    const collections = [...new Set(state.catalog.map((r) => r.collectionPath).filter(Boolean))].sort((a,b) => a.localeCompare(b));
    populateMultiFilters(formats);
    $('collectionFilter').replaceChildren(option('', 'All collections'), ...collections.map((v) => option(v,v)));
    return state.catalog;
  } finally { setBusy(false); }
}

export async function ensureRigFacts() {
  if (state.rigById) return state.rigById;
  setBusy(true, 'Loading rig facts…');
  try {
    const rows = await fetchJSONL(`${registryBase()}/rigfacts.jsonl`);
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
    const doc = await fetchJSON(`${registryBase()}/problems.json`); state.problems = doc.problems || []; state.problemsByAsset = new Map();
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
