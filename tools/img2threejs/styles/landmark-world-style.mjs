export const LANDMARK_ZONES=['structure','secondary','upper','accent','glazing','base'];

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mod1=v=>((v%1)+1)%1;
function hexRgb(hex){
  const h=String(hex).replace('#','');
  return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255];
}
function rgbHex([r,g,b]){
  const q=v=>Math.round(clamp(v)*255).toString(16).padStart(2,'0');
  return '#'+q(r)+q(g)+q(b);
}
function rgbHsl([r,g,b]){
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,l=(mx+mn)/2;
  if(d===0)return [0,0,l];
  const s=d/(1-Math.abs(2*l-1));
  let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;
  h=mod1(h/6);
  return [h,s,l];
}
function hue2rgb(p,q,t){
  t=mod1(t);if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;
}
function hslRgb([h,s,l]){
  h=mod1(h);s=clamp(s);l=clamp(l);
  if(s===0)return [l,l,l];
  const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;
  return [hue2rgb(p,q,h+1/3),hue2rgb(p,q,h),hue2rgb(p,q,h-1/3)];
}
function shortestHueDeltaDeg(fromDeg,toDeg){
  let d=((toDeg-fromDeg+540)%360)-180;
  return d;
}
function shiftHuePreserveSL(hex,deltaDeg){
  const hsl=rgbHsl(hexRgb(hex));hsl[0]=mod1(hsl[0]+deltaDeg/360);return rgbHex(hslRgb(hsl));
}
function setHuePreserveSL(hex,hueDeg){
  const hsl=rgbHsl(hexRgb(hex));hsl[0]=mod1(hueDeg/360);return rgbHex(hslRgb(hsl));
}

export function profileForLandmark(id,profiles){
  const p=profiles?.profiles?.[id];
  if(!p)throw Error('No landmark style profile for '+id);
  return p;
}

const SLOT_BY_ZONE={
  structure:'land',
  secondary:'zonen',
  upper:'berg',
  accent:'spur',
  glazing:'wasser',
  base:'zonen'
};

export function resolveLandmarkColours(id,profiles,snapshot,ctx={}){
  const p=profileForLandmark(id,profiles),moods=snapshot.moods;
  const mood=moods[ctx.mood]||moods.verdant,baseMood=moods.verdant;
  const biomeIndex=Math.max(0,Math.min(3,Number(ctx.biomeIndex??0)|0));
  const out={};
  for(const zone of LANDMARK_ZONES){
    const base=p.identityPalette[zone];
    const slot=SLOT_BY_ZONE[zone];
    const coupling=Number(p.worldCoupling?.[zone]??.25);
    let moodDelta=0,biomeDelta=0;
    if(slot==='zonen'){
      moodDelta=shortestHueDeltaDeg(baseMood.zonen[biomeIndex],mood.zonen[biomeIndex]);
      // The selected Travel biome is already represented by its own Verdant zone hue.
      // Keep that identity as a bounded relative shift, not a second saturation/lightness writer.
      biomeDelta=shortestHueDeltaDeg(baseMood.zonen[0],baseMood.zonen[biomeIndex])*.18;
    }else{
      moodDelta=shortestHueDeltaDeg(baseMood[slot],mood[slot]);
    }
    out[zone]=shiftHuePreserveSL(base,moodDelta*coupling+biomeDelta*coupling);
  }
  return out;
}

export function resolveTravelBiomeFloor(snapshot,ctx={}){
  const biomeIndex=Math.max(0,Math.min(snapshot.biomes.length-1,Number(ctx.biomeIndex??0)|0));
  const mood=snapshot.moods[ctx.mood]||snapshot.moods.verdant;
  const biome=snapshot.biomes[biomeIndex];
  return setHuePreserveSL(biome.col,mood.zonen[biomeIndex]);
}

export function resolveOsmFloor(cityStyle){
  return cityStyle?.palette?.green||'#5f8f5b';
}

export function createRadialSkyTexture(THREE,preset,size=512){
  const cv=document.createElement('canvas');cv.width=cv.height=size;
  const g=cv.getContext('2d'),cx=size/2,cy=size/2,outer=Math.sqrt(cx*cx+cy*cy);
  const grad=g.createRadialGradient(cx,cy,0,cx,cy,outer);
  for(const [stop,color] of preset.skyGradient)grad.addColorStop(stop,color);
  g.fillStyle=grad;g.fillRect(0,0,size,size);
  const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
  return tex;
}

function namedLight(light,name){light.name='landmark-style:'+name;return light;}
function clearStyleLights(scene){
  const gone=[];scene.traverse(o=>{if(o.isLight&&String(o.name||'').startsWith('landmark-style:'))gone.push(o);});
  for(const o of gone){o.target?.removeFromParent?.();o.removeFromParent();}
}

export function applyWorldEnvironment(THREE,scene,renderer,opts={}){
  clearStyleLights(scene);
  if(scene.background?.dispose&&scene.background.userData?.kfbDerivedSky)scene.background.dispose();
  const environment=opts.environment||'travel';
  if(environment==='osm'){
    scene.background=new THREE.Color('#c6d7dc');
    scene.fog=new THREE.Fog('#c6d7dc',450,1200);
    const hemi=namedLight(new THREE.HemisphereLight(0xffffff,0x58605b,2.2),'osm-hemi');
    const sun=namedLight(new THREE.DirectionalLight(0xfff2d6,2.7),'osm-sun');sun.position.set(-240,360,180);sun.castShadow=true;
    scene.add(hemi,sun);
    return {environment:'osm',lights:[hemi,sun],source:'tools/osm-city-lab/src/viewer/app.js'};
  }
  const snapshot=opts.snapshot,time=opts.timeOfDay||'day',preset=snapshot.skyPresets[time]||snapshot.skyPresets.day;
  const scale=Math.max(1,Number(opts.fogScale||1));
  const sky=createRadialSkyTexture(THREE,preset,512);sky.userData.kfbDerivedSky=true;scene.background=sky;
  scene.fog=new THREE.Fog(preset.fogColor,preset.fogNear*scale,preset.fogFar*scale);
  const dirs=[
    ['sun',preset.sun,preset.sunIntensity,[-1.6,1.1,.9]],
    ['sun2',preset.sun2,preset.sun2Intensity,[1.2,.8,-1.4]],
    ['fill',preset.fill,preset.fillIntensity,[1.4,-.3,1.1]],
    ['fill2',preset.fill2,preset.fill2Intensity,[-1.1,-.6,-1.2]],
    ['back',preset.back,preset.backIntensity,[.2,-1.5,.4]],
    ['petFill',preset.petFill,preset.petFillIntensity,[.35,.2,-1]]
  ];
  const lights=[];
  for(const [name,color,intensity,pos] of dirs){
    const l=namedLight(new THREE.DirectionalLight(color,intensity),name);
    l.position.set(...pos).normalize().multiplyScalar(60);l.castShadow=name==='sun';
    scene.add(l);lights.push(l);
  }
  const hemi=namedLight(new THREE.HemisphereLight(preset.hemiSky,preset.hemiGround,preset.hemiIntensity),'hemi');
  const amb=namedLight(new THREE.AmbientLight(preset.ambient,preset.ambientIntensity),'ambient');
  scene.add(hemi,amb);lights.push(hemi,amb);
  return {environment:'travel',timeOfDay:time,lights,preset,source:snapshot.sources.skyPresets};
}

export function worldStyleReport(id,profiles,snapshot,ctx={}){
  return {
    id,
    defaultShapeMode:profiles.defaultShapeMode,
    colours:resolveLandmarkColours(id,profiles,snapshot,ctx),
    floor:ctx.environment==='osm'?null:resolveTravelBiomeFloor(snapshot,ctx),
    mood:ctx.mood||'verdant',
    biomeIndex:Number(ctx.biomeIndex??0)|0,
    environment:ctx.environment||profiles.defaultEnvironment,
    travelSourceCommit:snapshot.sourceCommit,
    osmStyleBlob:profiles.sourcePins.osmCityStyle.blob
  };
}
