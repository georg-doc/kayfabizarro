export const RECIPE_SCHEMA='kfb.surface-adapter-proof-recipe/1';
export const RECIPE_ID='wb1-p2-seven-hex-route-target-ripple-v1';
export const SOURCE_MAIN_SHA='64b06628402c14d52a3bf976473214b7e86d697e';
export const P1_ACCEPTED_RUNTIME='a48729460c28edc2ae95abbfcdef66fe52a84f50';
export const TRAVEL_HEAD='8614282aab2ced43bb5dda9fcf7abadf9768100a';
export const ENVIRONMENT_PROFILE_REF=`kfb.environment-profile/1@${P1_ACCEPTED_RUNTIME}:WHACKMAN_DUSK_CANDIDATE`;
export const HEX_SOURCE_ROOT='media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/';
export const PROP_IDENTITY='kaykit-medieval-hexagon-pack-1-0-free|target';

export const CELL_FIXTURE=Object.freeze([
  Object.freeze({id:'west',col:-1,row:0,tile:'hex_road_M',rotation:180,source:'tiles/roads/hex_road_M.gltf'}),
  Object.freeze({id:'center',col:0,row:0,tile:'hex_road_A',rotation:0,source:'tiles/roads/hex_road_A.gltf'}),
  Object.freeze({id:'east',col:1,row:0,tile:'hex_road_M',rotation:0,source:'tiles/roads/hex_road_M.gltf'}),
  Object.freeze({id:'se',col:0,row:1,tile:'hex_grass',rotation:0,source:'tiles/base/hex_grass.gltf'}),
  Object.freeze({id:'sw',col:-1,row:1,tile:'hex_grass',rotation:0,source:'tiles/base/hex_grass.gltf'}),
  Object.freeze({id:'nw',col:-1,row:-1,tile:'hex_grass',rotation:0,source:'tiles/base/hex_grass.gltf'}),
  Object.freeze({id:'ne',col:0,row:-1,tile:'hex_grass',rotation:0,source:'tiles/base/hex_grass.gltf'})
]);

export const ROUTE_POINTS=Object.freeze([
  Object.freeze([-2,0]), Object.freeze([-1,0]), Object.freeze([0,0]), Object.freeze([1,0]), Object.freeze([2,0])
]);

export const SURFACE_FX_EVENT=Object.freeze({
  type:'KFB_RADIAL_RIPPLE', donor:'StoryMap/Travel carpet-waver', center:Object.freeze([0,0]), life:2.2, phaseRate:2.6, radialK:0.55
});

export const RECIPE=Object.freeze({
  schema:RECIPE_SCHEMA,
  id:RECIPE_ID,
  logicalSpace:'hex-local-xz-metres',
  measuredHexSize:Object.freeze([2,2.309]),
  cells:CELL_FIXTURE,
  route:Object.freeze({id:'route-01',points:ROUTE_POINTS}),
  prop:Object.freeze({id:'prop-01',identity:PROP_IDENTITY,source:'decoration/props/target.gltf',logical:Object.freeze([0,1.1]),yawDeg:18}),
  environmentProfileRef:ENVIRONMENT_PROFILE_REF,
  surfaceFx:SURFACE_FX_EVENT
});

export function stableRecipeFingerprint(recipe=RECIPE){
  return JSON.stringify({
    schema:recipe.schema,id:recipe.id,
    cells:recipe.cells.map(c=>[c.id,c.col,c.row,c.tile,c.rotation,c.source]),
    route:recipe.route.points,
    prop:[recipe.prop.identity,recipe.prop.source,recipe.prop.logical,recipe.prop.yawDeg],
    environmentProfileRef:recipe.environmentProfileRef,
    surfaceFx:[recipe.surfaceFx.type,recipe.surfaceFx.center,recipe.surfaceFx.life,recipe.surfaceFx.phaseRate,recipe.surfaceFx.radialK]
  });
}
