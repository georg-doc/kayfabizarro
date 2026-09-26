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


// ---- KFB seed colour (decision 2026-09-24, docs/DECISION_LANDMARK_COLOUR_KFB_SEED_2026-09-24.md) ----
// Landmarks are colourful by the active KFB seed: zone hue + chroma from the seed role, zone lightness from the
// identity palette (OKLCH), out of gamut -> chroma only. The grey identity palette is no longer the look.
const s2l=c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);
const l2s=c=>{c=Math.max(0,c);return c<=.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-.055;};
export function hexToOklch(hex){
  const [r,g,b]=hexRgb(hex).map(s2l);
  let l=.4122214708*r+.5363325363*g+.0514459929*b,m=.2119034982*r+.6806995451*g+.1073969566*b,s=.0883024619*r+.2817188376*g+.6299787005*b;
  l=Math.cbrt(l);m=Math.cbrt(m);s=Math.cbrt(s);
  const L=.2104542553*l+.793617785*m-.0040720468*s,A=1.9779984951*l-2.428592205*m+.4505937099*s,B=.0259040371*l+.7827717662*m-.808675766*s;
  return [L,Math.hypot(A,B),((Math.atan2(B,A)*180/Math.PI)%360+360)%360];
}
function oklchLin(L,C,H){
  const A=C*Math.cos(H*Math.PI/180),B=C*Math.sin(H*Math.PI/180);
  const l=(L+.3963377774*A+.2158037573*B)**3,m=(L-.1055613458*A-.0638541728*B)**3,s=(L-.0894841775*A-1.291485548*B)**3;
  return [4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s];
}
export function oklchToHex(L,C,H){
  let rgb=oklchLin(L,C,H);
  for(let i=0;i<40&&!rgb.every(v=>v>=-1e-4&&v<=1.0001);i++){C*=.93;rgb=oklchLin(L,C,H);}
  return rgbHex(rgb.map(l2s));
}
function seedRole(seedPalette,path){
  const m=/^(roles|roofs)(?:\.(\w+)|\[(\d+)\])$/.exec(path);
  if(!m)throw Error('bad kfbSeed zoneSource '+path);
  return m[1]==='roofs'?seedPalette.roofs[Number(m[3])]:seedPalette.roles[m[2]];
}
export function kfbSeedZoneColours(id,profiles,seedPalette=null){
  const p=profileForLandmark(id,profiles),cfg=profiles.kfbSeed;
  const pal=seedPalette||cfg.defaultSeedPalette,out={};
  for(const zone of LANDMARK_ZONES){
    const [L]=hexToOklch(p.identityPalette[zone]);
    const [,C,H]=hexToOklch(seedRole(pal,cfg.zoneSource[zone]));
    out[zone]=oklchToHex(L,C,H);
  }
  return out;
}
function shiftHueOklch(hex,deltaDeg){const [L,C,H]=hexToOklch(hex);return oklchToHex(L,C,((H+deltaDeg)%360+360)%360);}

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
  const kfb=(profiles.worldStyleRules?.landmarkColourMode??'kfb-seed')==='kfb-seed';
  const seeded=kfb?kfbSeedZoneColours(id,profiles,ctx.seedPalette||null):null;
  const out={};
  for(const zone of LANDMARK_ZONES){
    const base=kfb?seeded[zone]:p.identityPalette[zone];
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
    const d=moodDelta*coupling+biomeDelta*coupling;
    out[zone]=kfb?(d?shiftHueOklch(base,d):base):shiftHuePreserveSL(base,d);
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
    colourMode:profiles.worldStyleRules?.landmarkColourMode??'kfb-seed',
    colours:resolveLandmarkColours(id,profiles,snapshot,ctx),
    floor:ctx.environment==='osm'?null:resolveTravelBiomeFloor(snapshot,ctx),
    mood:ctx.mood||'verdant',
    biomeIndex:Number(ctx.biomeIndex??0)|0,
    environment:ctx.environment||profiles.defaultEnvironment,
    travelSourceCommit:snapshot.sourceCommit,
    osmStyleBlob:profiles.sourcePins.osmCityStyle.blob
  };
}
