// KFB seed colour for landmarks (decision 2026-09-24). Static numeric check, no browser.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveLandmarkColours,kfbSeedZoneColours,hexToOklch,LANDMARK_ZONES} from '../styles/landmark-world-style.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const profiles=JSON.parse(readFileSync(root+'styles/landmark-style-profiles.v1.json','utf8'));
const snapshot=JSON.parse(readFileSync(root+'styles/travel-visual-snapshot.v1.json','utf8'));
const checks=[];
function ok(id,v,d=null){checks.push({id,pass:!!v,detail:d});if(!v)throw Error('FAIL '+id+' '+JSON.stringify(d));}
const hex=v=>/^#[0-9a-f]{6}$/i.test(v);
const R=profiles.worldStyleRules,K=profiles.kfbSeed;
ok('rule.mode',R.landmarkColourMode==='kfb-seed',R.landmarkColourMode);
ok('rule.grey-retired',R.preserveLandmarkSaturationAndLightness===false&&R.preserveLandmarkLightness===true);
ok('rule.decision-doc',typeof R.landmarkColourDecision==='string'&&R.landmarkColourDecision.includes('DECISION_LANDMARK_COLOUR_KFB_SEED'));
ok('seed.zones',LANDMARK_ZONES.every(z=>typeof K.zoneSource[z]==='string'));
// a second real seed (cologne-palette.v1 makePalette(7), roles used by kfbSeed.zoneSource)
const seed7={roles:{structure:'#d78664',shoulder:'#e99264',gold:'#bbe548',deep:'#045064',shoulderLo:'#704c55'},roofs:['#901063']};
// Dom default seed -> exact colours of the Blender Dom v2 (dom2_lib.palette_kfb, Tafel 01/02)
const expectDefault={structure:'#a46648',secondary:'#c6845b',upper:'#8e2a41',accent:'#dea51c',glazing:'#326573',base:'#b898a1'};
const dom=kfbSeedZoneColours('koelner-dom',profiles,null);
ok('dom.default.parity-with-blender',LANDMARK_ZONES.every(z=>dom[z]===expectDefault[z]),dom);
for(const id of Object.keys(profiles.profiles)){
  const c=kfbSeedZoneColours(id,profiles,null);
  ok(id+'.hex',LANDMARK_ZONES.every(z=>hex(c[z])),c);
  for(const z of LANDMARK_ZONES){
    const a=hexToOklch(profiles.profiles[id].identityPalette[z]),b=hexToOklch(c[z]);
    ok(id+'.'+z+'.L-from-identity',Math.abs(a[0]-b[0])<.012,[a[0],b[0]]);
  }
  ok(id+'.not-grey',hexToOklch(c.structure)[1]>.05,c.structure);
  // value structure of the identity survives (light/dark order of upper vs secondary vs structure)
  const I=profiles.profiles[id].identityPalette,sg=(a,b)=>Math.sign(hexToOklch(a)[0]-hexToOklch(b)[0]);
  ok(id+'.value-order',sg(c.upper,c.secondary)===sg(I.upper,I.secondary)&&sg(c.structure,c.secondary)===sg(I.structure,I.secondary));
  // hue comes from the seed role (the KFB world), not from the grey identity
  const hd=(a,b)=>Math.abs(((a-b+540)%360)-180);
  ok(id+'.structure.hue-from-seed',hd(hexToOklch(c.structure)[2],hexToOklch(K.defaultSeedPalette.roles.structure)[2])<1.5,c.structure);
  const alt=kfbSeedZoneColours(id,profiles,seed7);
  ok(id+'.seed-changes-colour',alt.structure!==c.structure&&alt.upper!==c.upper,[alt.structure,c.structure]);
  const w=resolveLandmarkColours(id,profiles,snapshot,{mood:'verdant',biomeIndex:0});
  ok(id+'.verdant-equals-seed',LANDMARK_ZONES.every(z=>w[z]===c[z]),[w,c]);
}
console.log(JSON.stringify({passed:checks.length,total:checks.length}));
