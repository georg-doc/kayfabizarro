/* Actor state hydration only. Uses the existing face-mount reader; no geometry/rig owner. */
export const ACTOR_ID = 'frizzlebob-earrig-v5';
export const PROFILE_SHA256 = '604449e169dcf522bf6d3d78eb59023ed8ba2de9985fa73141f3ffee79a3873e';
export const PROFILE_PATH = './data/actors/frizzlebob-earrig-v5.georg-2026-10-14.kfb-pets.json';
const copy = v => JSON.parse(JSON.stringify(v));
export function validateActorDocument(doc) {
 const p=doc?.pets?.find(p=>p.id===ACTOR_ID);
 if(doc?.schema!=='kfb.pets/1'||doc.pets.length!==1||!p)throw Error('Exact Georg actor entry missing');
 if(p.source?.glb!=='tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb'||p.source.commit!=='23615cffb515d03d2b6a0164b896dd08e3bc1bed')throw Error('Georg actor model source mismatch');
 for(const k of ['eye','brow','nose','mouth','moustache','parts','original','hair','body','ears','lids','clayLids'])if(!p[k])throw Error('Georg actor field missing: '+k);
 if(p.parts.eyes!=='rig'||p.clayLids.on!==false)throw Error('Georg EyeRig shell configuration mismatch');
 return p;
}
export async function loadActorDocument(fetcher=fetch) {
 const r=await fetcher(PROFILE_PATH,{cache:'no-store'});if(!r.ok)throw Error('Georg actor JSON HTTP '+r.status);
 const bytes=await r.arrayBuffer();const h=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
 if(h!==PROFILE_SHA256)throw Error('Georg actor JSON checksum mismatch');
 const doc=JSON.parse(new TextDecoder().decode(bytes));validateActorDocument(doc);return doc;
}
export function prepareActorWorkspace(tb,doc) {
 const p=validateActorDocument(doc);
 if(tb.ws.actorImportReceipt?.sha256===PROFILE_SHA256)return false;
 const record=tb._actorRecord(ACTOR_ID,tb.doc.stage.preset);
 // Replace only this actor's state. Other actors/scene objects remain recoverable and intact.
 const i=tb.doc.objects.findIndex(o=>o.id==='actor');if(i<0)tb.doc.objects.push(record);else tb.doc.objects[i]=record;
 tb.ws.rigs=tb.ws.rigs||{};tb.ws.rigs[ACTOR_ID]=copy(p);
 tb.ws.actors=tb.ws.actors||{};
 const profile={schema:'kfb.actor-profile/0.1',id:ACTOR_ID,label:record.name,rigFamily:record.rigFamily,face:{},legacy:null};
 for(const k of ['hair','body','ears','lids','emotes','surface','partColors'])if(p[k])profile[k]=copy(p[k]);
 profile.clay=copy(p.clayLids);tb.ws.actors[ACTOR_ID]=profile;
 tb.drafts={};tb.anim.ref=null;return true;
}
export function fieldMismatches(expected,actual,path='') {
 const out=[];
 if(expected&&typeof expected==='object'){
  for(const k of Object.keys(expected))out.push(...fieldMismatches(expected[k],actual?.[k],path?path+'.'+k:k));
 }else if(typeof expected==='number'&&typeof actual==='number'?Math.abs(expected-actual)>1e-7:expected!==actual)out.push(path);
 return out;
}
export async function verifyActorWorkspace(tb,doc) {
 const p=validateActorDocument(doc),rt=tb.runtime;
 if(tb._rid()!==ACTOR_ID||rt?.kind!=='earfb'||rt.face?.status!=='OK'||!rt.face.rig)throw Error('Complete Georg FaceHost/EyeRig actor did not mount');
 await rt.hairReady;
 if(p.hair.on&&!rt.hair)throw Error('Georg hair rig did not mount');
 if(!rt.ears?.L?.bones?.length||!rt.ears?.R?.bones?.length)throw Error('Georg ear chains did not mount');
 const actual=tb._rigExportDoc().pets.find(x=>x.id===ACTOR_ID);
 const mismatches=[];
 for(const k of ['color','eye','brow','nose','mouth','moustache','parts','original','hair','body','ears','lids','clayLids']) {
  const wanted=copy(p[k]);const got=actual?.[k];
  // Transport-only metadata does not describe an applied rig value.
  if(wanted&&typeof wanted==='object'){delete wanted.schema;delete wanted.reader;delete wanted.donor;delete wanted.source;}
  mismatches.push(...fieldMismatches(wanted,got,k));
 }
 if(mismatches.length)throw Error('Georg actor import mismatch: '+mismatches.join(', '));
 const receipt={actor:ACTOR_ID,sha256:PROFILE_SHA256,source:copy(p.source),fieldMatch:true,importedAt:new Date().toISOString()};
 tb.ws.actorImportReceipt=receipt;globalThis.__kfbActorImportReceipt=receipt;return receipt;
}
