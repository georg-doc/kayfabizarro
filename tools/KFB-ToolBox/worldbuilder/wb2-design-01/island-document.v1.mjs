/* Bounded identity/recipe metadata inside WB2 Scene v1, not a second store. */
export const ISLAND_GENERATOR = Object.freeze({
  id:'wb2.r2d-island-core', revision:'r4-foundation-1',
  donorBlob:'ccb70f25c87d4c98a8ab53c807c7173a35be8b8f',
  trackCommit:'3232a1070686896833d6b7942fcd631b9fa8cda6'
});
export const TERRAIN_ORDER='base-village-pond/track-fit/bridge-river-cut/sculpt-outside-protected-track-v1';
export function islandIdentity(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,95}$/.test(value)) throw Error('Invalid WB2 island identity');
  return {docId:'wb2-island.'+value,storageKey:'kfb-wb2-island.'+value};
}
export function islandRecipe({id,seed,shape,biome,route}) {
  const identity=islandIdentity(id);
  if (!Number.isInteger(seed) || !['frei','hex'].includes(shape) || typeof biome!=='string') throw Error('Invalid island recipe');
  if (!route || !(route.schema==='kfb.route-recipe/0.1-draft'&&Array.isArray(route.pieces) || route.schema==='kfb.route-graph/0.1-draft'&&Array.isArray(route.routes)&&route.traversal&&route.islandLayout)) throw Error('Complete Track RouteRecipe required');
  return {id,...identity,seed,shape,biome,origin:[0,0,0],generator:{...ISLAND_GENERATOR},terrainOrder:TERRAIN_ORDER,route:structuredClone(route)};
}
export function validateIslandRecipe(value) {
  if (!value || JSON.stringify(value.generator)!==JSON.stringify(ISLAND_GENERATOR) || value.terrainOrder!==TERRAIN_ORDER) throw Error('Unsupported pinned island generator/order');
  const clean=islandRecipe(value);
  if (JSON.stringify(value.origin)!=='[0,0,0]' || value.docId!==clean.docId || value.storageKey!==clean.storageKey) throw Error('Island identity/local frame mismatch');
  return clean;
}
