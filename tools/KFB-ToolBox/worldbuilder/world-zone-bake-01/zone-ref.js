// KFB WorldBuilder · World Zone reference seam.
// Mirrors the accepted WB1 scene document rule: source references + transforms only.
export const WORLD_ZONE_KIND='world-zone';
export function makeWorldZoneObject({id='zone-cologne-dom-zentrum-v0',manifestPath,revision='2026-09-24.1',position=[0,0,0],rotation=[0,0,0],scale=[1,1,1]}={}){
  if(!manifestPath)throw new Error('manifestPath required');
  return {
    id,kind:WORLD_ZONE_KIND,name:'Cologne · Dom/Zentrum World Zone',
    source:{type:'world-zone-manifest',path:manifestPath,revision},
    transform:{position:[...position],rotation:[...rotation],scale:[...scale]}
  };
}
export function validateWorldZoneObject(o){
  return !!(o&&o.kind===WORLD_ZONE_KIND&&o.source?.type==='world-zone-manifest'&&o.source?.path&&o.source?.revision&&Array.isArray(o.transform?.position)&&Array.isArray(o.transform?.rotation)&&Array.isArray(o.transform?.scale)&&!('geometry' in o)&&!('vertices' in o));
}
export function serializeWorldBuilderScene(scene){
  if(scene?.format!=='kfb-worldbuilder-scene'||scene?.version!==1)throw new Error('Expected kfb-worldbuilder-scene v1');
  for(const o of scene.objects||[])if(o.kind===WORLD_ZONE_KIND&&!validateWorldZoneObject(o))throw new Error('Invalid world-zone object');
  return JSON.stringify(scene);
}
export function reloadWorldBuilderScene(text){
  const scene=JSON.parse(text);serializeWorldBuilderScene(scene);return scene;
}
