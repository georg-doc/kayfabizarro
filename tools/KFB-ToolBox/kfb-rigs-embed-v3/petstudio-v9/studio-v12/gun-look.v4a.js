// Visual language for the active ammunition. Future entries are references, not playable weapons.
export const GUN_PALETTES={
  dice:{label:'Dice',implemented:true,shell:0xe96049,grip:0xb8361f,accent:0x286d70,light:0xe96049},
  portal:{label:'Portal',implemented:false,shell:0xe7f5ff,grip:0x335a81,accent:0x8edfff,light:0xd9f7ff},
  fire:{label:'Fireball',implemented:false,shell:0xffda8a,grip:0x76372b,accent:0xff7236,light:0xffe298},
  ink:{label:'Ink recycler',implemented:false,shell:0xe9ddbf,grip:0x342e45,accent:0x967ac2,light:0xbaa1e1}
};
export function matchBellyZone(figure){
  let light;const belly=[];
  figure.traverse(o=>{if(o.isMesh)for(const m of [].concat(o.material)){if(m.name==='Main_Light')light=m;if(m.name==='Main2')belly.push(m);}});
  if(light)for(const m of belly){m.color.copy(light.color);m.needsUpdate=true;}
  return belly.length;
}
export function applyGunPalette(figure,mode='dice'){
  const palette=GUN_PALETTES[mode];
  // Never indicate a loaded Portal/Fire/Ink round while gameplay still fires ordinary dice.
  if(!palette?.implemented)return [];
  const gun=figure.getObjectByName('Gun'),glow=[];if(!gun)return glow;
  gun.traverse(o=>{if(!o.isMesh)return;
    const paint=m=>{
      if(!m.userData.kfbGun)m=m.clone();m.userData.kfbGun=true;
      const name=m.name;
      m.color.setHex(name==='Black'?palette.grip:name==='Main'?palette.accent:name==='White'?palette.light:palette.shell);
      m.userData.origColor=m.color.getHex();m.roughness=.58;m.metalness=.04;
      if(m.emissive){m.emissive.setHex(name==='White'||name==='Main'?palette.light:0x000000);m.emissiveIntensity=.035;glow.push(m);}
      return m;
    };
    o.material=Array.isArray(o.material)?o.material.map(paint):paint(o.material);
  });
  return [...new Set(glow)];
}
export function stepGunGlow(materials,remaining,dt){
  const t=Math.max(0,remaining-dt),gain=.035+.65*Math.min(1,t/.10);
  for(const m of materials||[])m.emissiveIntensity=gain;
  return t;
}
