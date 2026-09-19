import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {buildCologneCathedral} from '../landmarks/pilot-08/dom-geometry.mjs';
import {rigCologneCathedralGrotesque,groupAttachmentReport} from '../landmarks/pilot-08/dom-rig.mjs';
import {terrainHeightAt,INTEGRATED_DOM_POSITION} from '../landmarks/pilot-08/terrain-host.mjs';
import {buildStyledBuildingMesh} from '../../../kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/src/city-style.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const style=JSON.parse(readFileSync(root+'../osm-city-lab/styles/kfb-city-v0.json','utf8'));
const city=JSON.parse(readFileSync(root+'../osm-city-lab/scenes/huerth-v0.json','utf8'));
const checks=[];
function ok(id,v,d=null){checks.push({id,pass:!!v,detail:d});if(!v)throw Error('FAIL '+id+' '+JSON.stringify(d));}
function tri(asset){return asset.parts.reduce((s,p)=>s+p.positions.length/9,0);}
function finite(asset){return asset.parts.every(p=>p.positions.every(Number.isFinite));}

const base=buildCologneCathedral();
const rigged=rigCologneCathedralGrotesque(base,style);
ok('dom.id',base.id==='koelner-dom');
ok('dom.source.accepted-direction',base.sourceAcceptance==='GEORG_ACCEPTED_V0_2_DIRECTION');
ok('dom.geo.unbound',base.geographicBinding===null);
ok('dom.groups',JSON.stringify(base.rigGroups)===JSON.stringify(['foundation','west','nave','transept','choir']),base.rigGroups);
ok('dom.source.finite',finite(base));
ok('dom.rig.finite',finite(rigged));
ok('dom.triangles.preserved',tri(base)===tri(rigged),[tri(base),tri(rigged)]);
ok('dom.height.source',base.bounds.max[1]>=84&&base.bounds.max[1]<=85,base.bounds);
ok('dom.foundation.ground',Math.abs(base.bounds.min[1])<1e-9&&Math.abs(rigged.bounds.min[1])<1e-9,[base.bounds.min[1],rigged.bounds.min[1]]);
ok('dom.rig.schema',rigged.rig.schema==='kfb.cologne-cathedral-group-rig/0.1');
ok('dom.rig.transforms',Object.keys(rigged.rig.transforms).length===5,Object.keys(rigged.rig.transforms));
const report=groupAttachmentReport(base,rigged);
ok('dom.group.report',report.length===5,report.map(x=>x.id));

ok('terrain.urban.pad',Math.abs(terrainHeightAt(0,0))<1e-9,terrainHeightAt(0,0));
ok('terrain.dom.pad',Math.abs(terrainHeightAt(INTEGRATED_DOM_POSITION.x,INTEGRATED_DOM_POSITION.z))<1e-9,terrainHeightAt(INTEGRATED_DOM_POSITION.x,INTEGRATED_DOM_POSITION.z));
ok('terrain.outer.relief',Math.abs(terrainHeightAt(390,330))>1,terrainHeightAt(390,330));

const cityMesh=buildStyledBuildingMesh(city,style,'grotesque');
ok('osm.schema',city.schema==='kfb.osm-city.consumer-scene.v0');
ok('osm.real.source',city.source?.provenance?.attribution?.data==='© OpenStreetMap contributors');
ok('osm.grotesque.buildings',cityMesh.stats.sourceBuildings>100,cityMesh.stats);
ok('osm.grotesque.finite',Array.from(cityMesh.vertices).every(Number.isFinite));
ok('osm.collision.undeformed',cityMesh.stats.collisionGeometryDeformed===false);

const html=readFileSync(root+'landmarks/pilot-08/index.html','utf8');
const viewer=readFileSync(root+'landmarks/pilot-08/viewer.mjs','utf8');
ok('ui.build.marker',html.includes('KFB-TS-OSM-INTEGRATED-V1-20260919'));
ok('ui.donor.isolation',html.includes('Source reference · Lighthouse')&&html.includes('Source reference · Observatory'));
ok('ui.osm.default',html.includes('<option value="osm" selected>'));
ok('ui.rain',html.includes('id="rain"'));
ok('viewer.no.geo.claim',viewer.includes("placement:'STYLE_INTEGRATION_ONLY_NOT_GEO'"));
ok('viewer.no.wetness.claim',viewer.includes('materialWetness:false')&&viewer.includes('materialAlbedoShift:false'));
ok('viewer.absolute.stage.donors',viewer.includes("from '/kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/src/city-style.mjs'"));

const out=root+'evidence/2026-09-19-tinyskies-osm-integrated-v1/';mkdirSync(out,{recursive:true});
const result={
  schema:'kfb.tinyskies-osm-integrated-proof.qa/1.0',
  evidenceClass:'STATIC_NUMERICAL_SOURCE',
  browser:'SEPARATE_PLAYWRIGHT_GATE',
  passed:checks.length,total:checks.length,
  stats:{domTriangles:tri(rigged),domBounds:rigged.bounds,osm:cityMesh.stats,groupReport:report},
  checks
};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,total:checks.length,domTriangles:tri(rigged),osmBuildings:cityMesh.stats.sourceBuildings,osmTriangles:cityMesh.stats.triangles},null,2));
