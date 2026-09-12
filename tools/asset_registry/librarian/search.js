import { RESULT_LIMIT, $, state } from './state.js';
import { ensureCatalog, ensureRigFacts, ensureProblems } from './registry.js';

export function readFilters() {
  return { query:$('searchInput').value.trim(), kind:$('kindFilter').value, pack:$('packFilter').value,
    collection:$('collectionFilter').value, format:$('formatFilter').value, dependencyStatus:$('dependencyFilter').value,
    problemType:$('problemFilter').value, rigged:$('rigFilter').value, animated:$('animatedFilter').value,
    clip:$('clipFilter').value.trim(), joint:$('jointFilter').value.trim() };
}
function rank(record, query) {
  if (!query) return 9; const q=query.toLowerCase();
  const fields=[record.name,record.collectionPath,record.packId,record.path].map((v) => String(v||'').toLowerCase());
  if (fields[0]===q) return 0; if (fields[0].startsWith(q)) return 1; if (fields[0].includes(q)) return 2;
  for (let i=1;i<fields.length;i++) if (fields[i].includes(q)) return i+2; return null;
}
function tri(value,wanted) { if (!wanted) return true; if (wanted==='yes') return value===true; if (wanted==='no') return value===false; return value!==true && value!==false; }
export function applyFilters(records,f) {
  const scored=[];
  for (const r of records) {
    if (f.kind && r.kind!==f.kind || f.pack && r.packId!==f.pack || f.collection && r.collectionPath!==f.collection || f.format && r.format!==f.format || f.dependencyStatus && r.dependencyStatus!==f.dependencyStatus) continue;
    if (f.problemType) { const rows=state.problemsByAsset.get(r.assetId)||[]; if (f.problemType==='any' ? !rows.length : !rows.some((p)=>p.type===f.problemType)) continue; }
    const rig=r.rigFacts||{}, parsed=rig.parseStatus==='ok'||rig.parseStatus==='not-applicable';
    if (!tri(parsed?Boolean(rig.hasSkin):null,f.rigged) || !tri(rig.parseStatus==='ok'?(rig.animationCount||0)>0:null,f.animated)) continue;
    if (f.clip && !(rig.animationClips||[]).some((c)=>String(c.name||'').toLowerCase().includes(f.clip.toLowerCase()))) continue;
    if (f.joint && !(rig.jointNames||[]).some((n)=>String(n).toLowerCase().includes(f.joint.toLowerCase()))) continue;
    const n=rank(r,f.query); if (n==null) continue; scored.push([n,r]);
  }
  scored.sort((a,b)=>a[0]-b[0]||String(a[1].name).localeCompare(String(b[1].name))||a[1].path.localeCompare(b[1].path));
  return { total:scored.length, rows:scored.slice(0,RESULT_LIMIT).map((x)=>x[1]) };
}
export async function searchRegistry() {
  const f=readFilters(), catalog=await ensureCatalog();
  if (f.rigged||f.animated||f.clip||f.joint) await ensureRigFacts();
  if (f.problemType) await ensureProblems();
  return applyFilters(catalog,f);
}
