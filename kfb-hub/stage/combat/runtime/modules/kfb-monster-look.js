// The v3 export omitted this optional skin adapter. Keep each original atlas and material identity.
// A modest emissive contribution lifts the shaded bodies without whitening eyes or recolouring skin.
export function skin(THREE, root, id, params={}) {
  let materials=0;
  root.traverse(o=>{
    if(!o.isMesh || !o.material)return;
    const wasArray=Array.isArray(o.material);
    const changed=(wasArray?o.material:[o.material]).map(source=>{
      const m=source.clone();
      if(m.isMeshStandardMaterial || m.isMeshPhysicalMaterial){
        m.roughness=params.rough??.72;m.envMapIntensity=.5;
        m.emissive.copy(m.color);m.emissiveMap=m.map;m.emissiveIntensity=.22;
      }
      materials++;return m;
    });o.material=wasArray?changed:changed[0];
  });return {id,materials,originalAtlas:true};
}
export function zeile(r){return `[look v4] ${r.id}: ${r.materials} original materials, soft fill`;}
