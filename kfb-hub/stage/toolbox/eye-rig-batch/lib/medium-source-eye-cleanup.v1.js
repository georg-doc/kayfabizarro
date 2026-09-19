import { prepareVerifiedGothGirlCleanup, SOURCE_FACE_SCHEMA } from './source-face-cleanup.v1.js';
import { findDonorEyes, stripDonorEyes } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/donoreyes.v1.js';

export const MEDIUM_CLEANUP_SCHEMA='kfb.medium-source-eye-cleanup/0.1-candidate';

function unsupported(reason, extra={}) {
  const report={schema:SOURCE_FACE_SCHEMA,status:'HUMAN_REQUIRED',reason,...extra,componentDiagnostic:{status:'OFF',selected:null},sourceMeasuredSeed:null,components:[]};
  return {
    schema:MEDIUM_CLEANUP_SCHEMA,status:'HUMAN_REQUIRED',report,
    get active(){return false;}, get isolatedComponent(){return null;},
    apply(){return false;}, setComponentIsolation(){return null;}, clearComponentIsolation(){return false;},
    measureOnFaceHost(){return null;}, dispose(){}
  };
}

function headCandidates(figure){
  const out=[];
  figure?.traverse?.((n)=>{
    if(!n?.isSkinnedMesh || !n.geometry?.index) return;
    const name=String(n.name||'');
    if(/head|face|skull/i.test(name)) out.push({mesh:n,headNamed:true});
  });
  return out;
}

function candidateReport(found, mesh){
  return {
    schema:SOURCE_FACE_SCHEMA,
    headMesh:mesh.name||'(unnamed)',
    connectedComponents:found.islands ?? null,
    expectedConnectedComponents:null,
    eyeCandidates:found.report ? [{
      component:'AUTO_PAIR',
      triangles:found.report.tris,
      x:found.report.x,
      z:found.report.z,
      size:found.report.size
    }] : [],
    pairConfidence:found.status==='OK' ? 0.7 : 0,
    femaleOuterLashCandidate:'UNRESOLVED_GENERIC',
    removalMode:found.status==='OK' ? 'mirrored-front-pair' : 'none',
    guard:'head-named skinned mesh + mirrored equal-triangle front pair',
    status:found.status==='OK' ? 'AUTO_CANDIDATE_GENERIC' : 'HUMAN_REQUIRED',
    components:[],
    componentDiagnostic:{status:'OFF',selected:null},
    sourceMeasuredSeed:null,
    genericDetector:{
      schema:'kfb.donoreyes/0.1',
      status:found.status,
      islands:found.islands ?? null,
      report:found.report ?? null,
      candidates:found.candidates ?? []
    }
  };
}

export function prepareMediumActorCleanup({THREE,figure,actor,log=()=>{}}={}){
  if(!figure||!actor) return unsupported('missing figure or actor');

  if(actor.cleanup?.mode==='verified-components' || actor.id==='gothgirl'){
    return prepareVerifiedGothGirlCleanup({
      figure,
      preferredHeadMesh:'GothGirl_Head',
      expectedConnectedComponents:12,
      eyeComponents:[2,3],
      log
    });
  }

  const candidates=headCandidates(figure);
  if(!candidates.length){
    log('medium cleanup · no head-named indexed skinned mesh · manual review');
    return unsupported('no head-named indexed skinned mesh',{actorId:actor.id});
  }

  const matches=[];
  for(const row of candidates){
    let found;
    try{ found=findDonorEyes({THREE,mesh:row.mesh}); }catch(e){ found={status:'ERROR',reason:String(e?.message||e)}; }
    if(found?.status==='OK') matches.push({...row,found});
  }
  if(!matches.length){
    log('medium cleanup · no mirrored front eye pair on head mesh · manual review');
    return unsupported('no mirrored front eye pair on head mesh',{actorId:actor.id,headMeshes:candidates.map(x=>x.mesh.name||'(unnamed)')});
  }

  matches.sort((a,b)=>(b.found.report?.z??-Infinity)-(a.found.report?.z??-Infinity));
  const winner=matches[0];
  const mesh=winner.mesh;
  const report=candidateReport(winner.found,mesh);
  report.actorId=actor.id;
  report.alternatives=matches.slice(1).map(x=>({headMesh:x.mesh.name||'(unnamed)',report:x.found.report||null}));

  let active=false;
  let stripState=null;

  function apply(on=true){
    on=!!on;
    if(on===active) return active;
    if(on){
      stripState=stripDonorEyes({THREE,headRoot:mesh,log});
      if(stripState?.status!=='OK'){
        report.status='HUMAN_REQUIRED';
        report.reason='strip failed after detector pass';
        active=false;
        return false;
      }
      active=true;
    }else{
      stripState?.restore?.();
      stripState=null;
      active=false;
    }
    return active;
  }

  function dispose(){
    if(active) stripState?.restore?.();
    stripState=null; active=false;
  }

  log(`medium cleanup candidate · ${actor.label||actor.id} · ${mesh.name||'(unnamed)'} · ${winner.found.report?.tris||'?'} eye tris · generic mirrored-front pair`);

  return {
    schema:MEDIUM_CLEANUP_SCHEMA,
    status:'AUTO_CANDIDATE_GENERIC',
    headMesh:mesh,
    report,
    get active(){return active;},
    get isolatedComponent(){return null;},
    apply,
    setComponentIsolation(){return null;},
    clearComponentIsolation(){return false;},
    measureOnFaceHost(){return null;},
    dispose
  };
}

export default prepareMediumActorCleanup;
