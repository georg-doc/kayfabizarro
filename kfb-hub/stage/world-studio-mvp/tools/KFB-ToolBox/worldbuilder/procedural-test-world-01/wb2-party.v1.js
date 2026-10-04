/* Native S16 Band/Disco receiving seam. WB2 owns the frame; SongTransport owns time. */
import * as THREE from 'three';
import {mountBandModule} from '../../_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/lib/band-module.js';
import {mountDiscoEnsemble} from '../../_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/lib/disco-ensemble.js';
const PIN='b6afb431c25e48767bf875c8b2eb74866f6946e5',DIR='tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/';
const raw=p=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+PIN+'/'+p;
const json=async p=>{const r=await fetch(raw(p));if(!r.ok)throw Error('Required party source '+r.status+' '+p);return r.json()};
export async function createPartySet(kind,{renderer,onProgress,original=false}={}){
  const band=kind==='band',path=DIR+(band?'resident-band-module-01.json':'resident-disco-01.json');
  const def=await json(path),parent=new THREE.Group();
  const native=band?await mountBandModule(def,{parent,onProgress}):await mountDiscoEnsemble(def,{parent,renderer,ballDef:await json(DIR+'disco-ball-core-01.json'),onProgress});
  native.root.userData.sourceRecord={assetId:'resident-performance/'+kind,packId:'Resident Atlas S16',source:{commit:PIN,path,blobSha:null}};
  if(!band&&!original)native.layout('ensemble');
  let elapsed=0;
  return{root:native.root,native,update(dt,clock){elapsed+=dt;const c=clock||{time:elapsed,beatPos:elapsed*100/60,spb:.6,level:0,bass:0,playing:false,dt,camera:null};if(band)native.update(c.beatPos);else native.update(c,'ensemble')},
    evidence(){return{kind,source:{commit:PIN,path},performers:Object.keys(native.perf),open:native.open||[],clock:'injected SongTransport; no audio/player/render loop'}},dispose:()=>native.dispose()};
}
