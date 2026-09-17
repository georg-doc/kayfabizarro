export const KFB_ASSEMBLY_A0_CONTRACT = 'georg-doc/kayfabizarro/skills/chat/masterplan/KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md';
export const TRAVEL_SUPPORT_ROLES = Object.freeze(['support', 'walkable']);
function recipeBody(envelope) { if (envelope && typeof envelope.recipe === 'object') return envelope.recipe; return envelope && typeof envelope === 'object' ? envelope : null; }
function rolesOf(surface) { return Array.isArray(surface?.roles) ? [...new Set(surface.roles.map((r) => String(r).trim()).filter(Boolean))] : []; }
function isTravelSupport(surface) { const roles = rolesOf(surface); return TRAVEL_SUPPORT_ROLES.some((role) => roles.includes(role)); }
function kindFromRoles(roles) { for (const kind of ['road','bridge','deck','landing','stunt','drivable']) if (roles.includes(kind)) return kind; return 'support'; }
function finitePriority(value) { const n = Number(value); return Number.isFinite(n) ? n : 0; }
export function createAssemblyA0SurfaceAdapter({ registerSupport, resolveGeometryRef } = {}) {
  if (typeof registerSupport !== 'function') throw new Error('A0 Travel adapter requires registerSupport(id, object, options)');
  if (typeof resolveGeometryRef !== 'function') throw new Error('A0 Travel adapter requires resolveGeometryRef(geometryRef, surface, recipe)');
  const active = new Map(); const stats = { applied:0, removed:0, surfacesAccepted:0, surfacesRejected:0, unresolved:0, last:null };
  function removeRecipe(recipeId) { const key=String(recipeId||''); const previous=active.get(key); if(!previous)return false; for(const off of previous.disposers){try{off();}catch(_){}} active.delete(key); stats.removed++; return true; }
  function applyRecipe(envelope) {
    const recipe=recipeBody(envelope); if(!recipe) throw new Error('A0 Travel adapter received no RecipeEnvelope object');
    const recipeId=String(recipe.id||'anonymous-a0-recipe'), surfaces=Array.isArray(recipe.surfaces)?recipe.surfaces:[]; removeRecipe(recipeId);
    const disposers=[], accepted=[], rejected=[], unresolved=[];
    for(const surface of surfaces){
      const surfaceId=String(surface?.id||`surface-${accepted.length+rejected.length+unresolved.length+1}`), roles=rolesOf(surface);
      if(!isTravelSupport(surface)){rejected.push({id:surfaceId,reason:'no support/walkable role',roles});stats.surfacesRejected++;continue;}
      const resolved=resolveGeometryRef(surface.geometryRef,surface,recipe), object=resolved&&resolved.object?resolved.object:resolved;
      if(!object){unresolved.push({id:surfaceId,geometryRef:surface.geometryRef??null,roles});stats.unresolved++;continue;}
      const local=resolved&&resolved.object?(resolved.options||{}):{}, registrationId=`a0:${recipeId}:${surfaceId}`;
      const options={...local,kind:local.kind||kindFromRoles(roles),priority:finitePriority(surface.priority),roles,normalPolicy:surface.normalPolicy??null,surfaceId,recipeId};
      const off=registerSupport(registrationId,object,options); if(typeof off==='function')disposers.push(off);
      accepted.push({id:surfaceId,registrationId,roles,priority:options.priority,kind:options.kind});stats.surfacesAccepted++;
    }
    const record={recipeId,revision:recipe.revision??null,schemaVersion:recipe.schemaVersion??envelope?.schemaVersion??null,status:recipe.status??null,maturity:recipe.maturity??null,accepted,rejected,unresolved,disposers};
    active.set(recipeId,record);stats.applied++;stats.last={recipeId,accepted:accepted.length,rejected:rejected.length,unresolved:unresolved.length};return {...record,disposers:undefined};
  }
  function clear(){for(const id of [...active.keys()])removeRecipe(id);}
  return {name:'kfb-assembly-a0-travel-surface-adapter',contract:KFB_ASSEMBLY_A0_CONTRACT,supportRoles:[...TRAVEL_SUPPORT_ROLES],applyRecipe,removeRecipe,clear,report(){return{contract:KFB_ASSEMBLY_A0_CONTRACT,supportRoles:[...TRAVEL_SUPPORT_ROLES],activeRecipes:[...active.values()].map((r)=>({recipeId:r.recipeId,revision:r.revision,accepted:r.accepted,rejected:r.rejected,unresolved:r.unresolved})),...stats};}};
}
