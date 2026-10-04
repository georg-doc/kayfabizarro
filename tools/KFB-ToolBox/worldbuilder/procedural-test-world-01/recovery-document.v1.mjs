export const PLACEMENT_REVISION='four-island-recovery-1';
const same=(a,b)=>a&&b&&['position','rotation','scale'].every(k=>a[k]?.length===b[k]?.length&&a[k].every((v,i)=>Math.abs(v-b[k][i])<.002));
// Migrate only untouched generated objects. Preserve authored transforms and expose conflicts.
export function reconcileRecoveryDocument(doc,canonical,recipes){
 doc.world??={};const previous=doc.world.placementRevision;
 if(previous===PLACEMENT_REVISION)return doc;
 const replacements=new Map(canonical.map(x=>[x.id,x])),migrated=[],preserved=[];
 for(const r of doc.objects||[]){const c=replacements.get(r.id);if(!c)continue;
  if(same(r.transform,c.legacyTransform)||same(r.transform,c.transform)){r.transform=structuredClone(c.transform);migrated.push(r.id)}else preserved.push(r.id);
 }
 doc.world.signatureLifeTrees=structuredClone(recipes);doc.world.placementRevision=PLACEMENT_REVISION;
 doc.world.recoveryMigration={from:previous||'legacy',migrated,preservedAuthoredTransforms:preserved,requiresClearanceReview:preserved.length>0};
 return doc;
}
