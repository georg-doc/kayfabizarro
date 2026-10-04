import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildLandmark} from '../landmarks/pilot-02/geometry.mjs';
import {shapeAsset} from '../landmarks/pilot-03/deform.mjs';
import {bandRigLandmark} from '../landmarks/pilot-05/band-rig.mjs';
import {resolveLandmarkColours,resolveTravelBiomeFloor,worldStyleReport} from '../styles/landmark-world-style.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const profiles=JSON.parse(readFileSync(root+'styles/landmark-style-profiles.v1.json','utf8'));
const snapshot=JSON.parse(readFileSync(root+'styles/travel-visual-snapshot.v1.json','utf8'));
const cityStyle=JSON.parse(readFileSync(new URL('../../osm-city-lab/styles/kfb-city-v0.json',import.meta.url),'utf8'));
const checks=[];const stats={};
function ok(id,value,detail=null){checks.push({id,pass:!!value,detail});if(!value)throw Error('FAIL '+id+' '+JSON.stringify(detail));}
const hex=v=>/^#[0-9a-f]{6}$/i.test(v);
function tri(a){return a.parts.reduce((s,p)=>s+p.positions.length/9,0);}
function finite(a){return a.parts.every(p=>p.positions.every(Number.isFinite));}
function rgb(hexv){const h=hexv.slice(1);return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255);}
function hsl([r,g,b]){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,l=(mx+mn)/2;if(d===0)return[0,0,l];const s=d/(1-Math.abs(2*l-1));let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h=((h/6)%1+1)%1;return[h,s,l];}
const current=['eiffel','giza','stonehenge','pentagon','spasskaya','kremlin-wall'];

ok('default.grotesque',profiles.defaultShapeMode==='city-grotesque',profiles.defaultShapeMode);
ok('osm.default.unchanged',cityStyle.cartoonMassing.defaultMode==='cartoon',cityStyle.cartoonMassing.defaultMode);
ok('travel.pin',snapshot.sourceCommit==='8614282aab2ced43bb5dda9fcf7abadf9768100a',snapshot.sourceCommit);
ok('osm.style.pin',profiles.sourcePins.osmCityStyle.blob==='f129cca3041b55b84de26048dad7aef8fac8b292');
ok('travel.sky.pin',snapshot.sources.skyPresets.blob==='04dd730ee735f064888e8472eff79583f17bebb0');
ok('travel.mood.pin',snapshot.sources.moods.blob==='2747a526e2aa38989c9c4052304da8733662b61c');
ok('travel.biome.pin',snapshot.sources.biomes.blob==='db3acf6ae6b7ebbc6cb4a7113a0d0fe782429d74');

for(const id of current){
  ok(id+'.profile',!!profiles.profiles[id]);
  for(const mood of Object.keys(snapshot.moods)){
    for(let biomeIndex=0;biomeIndex<4;biomeIndex++){
      const col=resolveLandmarkColours(id,profiles,snapshot,{environment:'travel',mood,biomeIndex,timeOfDay:'day'});
      ok(id+'.'+mood+'.'+biomeIndex+'.hex',Object.values(col).every(hex),col);
      for(const zone of Object.keys(col)){
        const a=hsl(rgb(profiles.profiles[id].identityPalette[zone])),b=hsl(rgb(col[zone]));
        ok(id+'.'+mood+'.'+biomeIndex+'.'+zone+'.sat-preserved',Math.abs(a[1]-b[1])<.015,[a[1],b[1]]);
        ok(id+'.'+mood+'.'+biomeIndex+'.'+zone+'.light-preserved',Math.abs(a[2]-b[2])<.006,[a[2],b[2]]);
      }
    }
  }
  const base=buildLandmark(id);
  const styled=(id==='spasskaya'||id==='kremlin-wall')
    ?bandRigLandmark(base,cityStyle,'city-grotesque')
    :shapeAsset(base,cityStyle,'city-grotesque');
  ok(id+'.grotesque.finite',finite(styled));
  ok(id+'.grotesque.triangles',tri(styled)===tri(base),[tri(styled),tri(base)]);
  ok(id+'.grotesque.ground',Math.abs(styled.bounds.min[1]-base.bounds.min[1])<1e-8,[styled.bounds.min[1],base.bounds.min[1]]);
  stats[id]={triangles:tri(styled),bounds:styled.bounds};
  const report=worldStyleReport(id,profiles,snapshot,{environment:'travel',mood:'verdant',biomeIndex:0,timeOfDay:'day'});
  ok(id+'.report.grotesque',report.defaultShapeMode==='city-grotesque');
}

for(const mood of Object.keys(snapshot.moods))for(let i=0;i<4;i++){
  const c=resolveTravelBiomeFloor(snapshot,{mood,biomeIndex:i});
  ok('floor.'+mood+'.'+i+'.hex',hex(c),c);
  const a=hsl(rgb(snapshot.biomes[i].col)),b=hsl(rgb(c));
  ok('floor.'+mood+'.'+i+'.sat-preserved',Math.abs(a[1]-b[1])<.015,[a[1],b[1]]);
  ok('floor.'+mood+'.'+i+'.light-preserved',Math.abs(a[2]-b[2])<.006,[a[2],b[2]]);
}

for(const time of ['day','evening','night']){
  const p=snapshot.skyPresets[time];
  ok('sky.'+time+'.gradient',Array.isArray(p.skyGradient)&&p.skyGradient.length>=9);
  ok('sky.'+time+'.lights',[p.hemiIntensity,p.ambientIntensity,p.sunIntensity,p.sun2Intensity,p.fillIntensity,p.fill2Intensity,p.backIntensity,p.petFillIntensity].every(Number.isFinite));
}
ok('sky.day.exact.sun',snapshot.skyPresets.day.sun==='#fff0d0'&&snapshot.skyPresets.day.sunIntensity===5);
ok('sky.day.exact.hemi',snapshot.skyPresets.day.hemiSky==='#80ccdd'&&snapshot.skyPresets.day.hemiGround==='#66aa44'&&snapshot.skyPresets.day.hemiIntensity===1.75);

const viewer=readFileSync(root+'landmarks/pilot-06/viewer.mjs','utf8').replace(/^import .*?;\s*$/gm,'').replace(/\bexport\s+(?=(const|function|async function))/g,'');
try{new Function(viewer);ok('viewer.syntax',true);}catch(e){ok('viewer.syntax',false,String(e));}
const html=readFileSync(root+'landmarks/pilot-06/index.html','utf8');
ok('index.grotesque-selected',html.includes('<option value="city-grotesque" selected>'));
ok('index.world-controls',['environment','mood','biome','time'].every(id=>html.includes('id="'+id+'"')));

const sourceFiles=[
 'styles/travel-visual-snapshot.v1.json','styles/landmark-style-profiles.v1.json','styles/landmark-world-style.mjs',
 'landmarks/pilot-06/SLICE.md','landmarks/pilot-06/viewer.mjs','landmarks/pilot-06/index.html',
 'docs/GENIUS_LOCI_CANDIDATES_V1.json','docs/GENIUS_LOCI_CANDIDATES_2026-09-19.md'
];
const hashes=Object.fromEntries(sourceFiles.map(f=>[f,createHash('sha256').update(readFileSync(root+f)).digest('hex')]));
const out=root+'evidence/2026-09-19-landmark-world-style-v1/';mkdirSync(out,{recursive:true});
const result={schema:'kfb.landmark-world-style-v1.qa/1.0',evidenceClass:'STATIC_NUMERICAL_SOURCE',browserWebGL:'NOT_RUN',humanAcceptance:'PENDING',passed:checks.length,total:checks.length,stats,sha256:hashes,checks};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,stats},null,2));
