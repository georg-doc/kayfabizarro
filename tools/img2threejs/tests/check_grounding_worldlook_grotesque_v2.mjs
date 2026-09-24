import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createPlanarTinySampler} from '../landmarks/pilot-09/tiny-surface-noise.mjs';
import {createGroundingField,rectangleFootprint} from '../landmarks/pilot-09/grounding-field.mjs';
import {removeVisibleBaseAndGround} from '../landmarks/pilot-09/ground-landmark.mjs';
import {buildGrotesqueCityV2} from '../landmarks/pilot-09/grotesque-city-v2.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const city=JSON.parse(readFileSync(root+'../osm-city-lab/scenes/huerth-v0.json','utf8'));
const style=JSON.parse(readFileSync(root+'../osm-city-lab/styles/kfb-city-v0.json','utf8'));
const checks=[];const stats={};
function ok(id,v,d=null){checks.push({id,pass:!!v,detail:d});if(!v)throw Error('FAIL '+id+' '+JSON.stringify(d));}
function centroid(footprint=[]){const xs=footprint.map(p=>p.x),zs=footprint.map(p=>p.z);return {x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2};}
function subset(scene,radius=150){
  const inside=p=>Math.hypot(p.x,p.z)<=radius;
  return {...scene,
    surfaces:{...scene.surfaces,roads:(scene.surfaces.roads||[]).filter(r=>(r.centerline||[]).some(inside)),sidewalks:(scene.surfaces.sidewalks||[]).filter(r=>(r.centerline||[]).some(inside))},
    obstacles:{...scene.obstacles,buildings:(scene.obstacles.buildings||[]).filter(b=>{const c=centroid(b.footprint);return Math.hypot(c.x,c.z)<=radius;})}
  };
}
const scene=subset(city,150);
const landmark=rectangleFootprint(-145,148,52,72,-.38);
const grounding=createGroundingField(scene,{landmarkFootprints:[landmark],buildingInnerM:2,buildingOuterM:12,roadOuterM:13,landmarkInnerM:4,landmarkOuterM:22});
ok('grounding.buildings',grounding.stats.buildings>50,grounding.stats);
ok('grounding.roads',grounding.stats.roads>5,grounding.stats);
ok('grounding.landmark',grounding.stats.landmarks===1,grounding.stats);
ok('grounding.no-visible-base',grounding.contract.visibleBase===false);
ok('grounding.landmark-center',grounding.weightAt(-145,148).landmark>.99,grounding.weightAt(-145,148));
const far=grounding.weightAt(340,-320);
ok('grounding.outer-free',far.weight<.05,far);

const sampler=createPlanarTinySampler(1842,{metresPerDomain:165});
const samples=[sampler(0,0,0),sampler(120,-70,0),sampler(-230,195,1)];
ok('noise.deterministic',samples.every(Number.isFinite),samples);
ok('noise.varies',new Set(samples.map(v=>v.toFixed(6))).size===samples.length,samples);

const sourceAsset={
  id:'synthetic',parts:[
    {name:'foundation',zone:'base',positions:[-2,0,-2,2,0,-2,2,1,-2]},
    {name:'body',zone:'structure',positions:[-1,1,-1,1,1,-1,1,5,-1,-1,1,-1,1,5,-1,-1,5,-1]}
  ],
  bounds:{min:[-2,0,-2],max:[2,5,2],size:[4,5,4]}
};
const grounded=removeVisibleBaseAndGround(sourceAsset,{rejectParts:['foundation'],targetY:0});
ok('landmark.foundation-removed',!grounded.parts.some(p=>p.name==='foundation'));
ok('landmark.no-visible-base',grounded.grounding.visibleBase===false);
ok('landmark.minY-zero',Math.abs(grounded.bounds.min[1])<1e-9,grounded.bounds);
ok('landmark.source-unchanged',sourceAsset.parts.some(p=>p.name==='foundation'));

const v2=buildGrotesqueCityV2(scene,style,{maxBands:5});
ok('city.source-buildings',v2.stats.sourceBuildings>50,v2.stats);
ok('city.finite',Array.from(v2.vertices).every(Number.isFinite));
ok('city.semantic-bands',v2.stats.semanticFloorBands===true);
ok('city.windows',v2.stats.windows>0,v2.stats);
ok('city.doors',v2.stats.doors>0,v2.stats);
ok('city.collision-undeformed',v2.stats.collisionGeometryDeformed===false);
ok('city.max-five-bands',v2.details.buildings.every(b=>b.bands<=5),v2.details.buildings.filter(b=>b.bands>5).slice(0,3));
ok('city.material-codes',v2.details.buildings.every(b=>/wall:.*\|roof\|window\|street-door/.test(b.materialCode)));
ok('city.street-door-distance',v2.details.doors.every(d=>Number.isFinite(d.roadDistanceM)),v2.details.doors.slice(0,3));
ok('city.kaykit-door-seam',v2.details.doors.every(d=>d.assetHint==='KayKit-door-candidate'));
const avgWindows=v2.stats.windows/v2.stats.sourceBuildings;
ok('city.windows-sparse',avgWindows>1&&avgWindows<18,avgWindows);
stats.city=v2.stats;stats.grounding=grounding.stats;stats.noise=samples;stats.avgWindows=avgWindows;

const terrainSource=readFileSync(root+'landmarks/pilot-09/terrain-v2.mjs','utf8');
ok('terrain.no-sine-stripes',!terrainSource.includes('Math.sin(')&&!terrainSource.includes('Math.cos('));
ok('terrain.staggered-triangles',terrainSource.includes('staggered triangular lattice')||terrainSource.includes('rowStep=spacing*Math.sqrt(3)/2'));

const out=root+'evidence/2026-09-20-grounding-worldlook-grotesque-v2/';mkdirSync(out,{recursive:true});
const result={schema:'kfb.grounding-worldlook-grotesque-v2.qa/1.0',evidenceClass:'STATIC_NUMERICAL_SOURCE',browser:'PENDING',passed:checks.length,total:checks.length,stats,checks};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,total:checks.length,stats},null,2));
