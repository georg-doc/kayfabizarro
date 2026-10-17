export const ROOT='tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/';
export const AUTHORING_ROOT=ROOT+'WEBCHAT_AUTHORING_R1/';
export const STATES=new Set(['GEORG','SOURCE','DESIGN','PREFILL','todo']);
export const ID=/^[a-z0-9][a-z0-9_]{0,79}$/;
export const SHA=/^[a-f0-9]{40}$/;
export function proposalRef(ref){return typeof ref==='string'&&/^(characters|scenes)\/edit-[a-z0-9][a-z0-9_-]{0,140}-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{12,32}$/.test(ref);}
export function safePath(path){return typeof path==='string'&&path.length<600&&!path.startsWith('/')&&!path.includes('\\')&&!path.split('/').some(x=>x==='..'||x==='.'||!x)&&!/[?#\u0000-\u001f]/.test(path);}
export function targetPath(path){return safePath(path)&&new RegExp('^'+ROOT+'(?:FIGURES_R1/characters/[a-z0-9][a-z0-9_]{0,79}\\.character\\.json|WEBCHAT_AUTHORING_R1/(?:scenelets/[a-z0-9][a-z0-9_]{0,79}\\.scenelet\\.json|dioramas/[a-z0-9][a-z0-9_]{0,79}\\.diorama\\.json))$').test(path);}
export function leaf(x){return x&&typeof x==='object'&&Object.hasOwn(x,'v')&&STATES.has(x.status)&&(x.status==='todo'?x.v===null:typeof x.src==='string'&&x.src.trim().length>0);}
export function validateScene(x){
 const errors=[];if(!x||x.schema!=='kfb.authoring-scene/1')return ['Unbekanntes Szenenkonzept-Schema'];
 if(!ID.test(x.id)||!['scenelet','diorama'].includes(x.kind)||x.status!=='DESIGN')errors.push('ID, Typ oder Konzeptstatus ungültig');
 for(const k of ['title','premise','playerRole','composition'])if(!leaf(x[k]))errors.push('Quellenstatus fehlt: '+k);
 if(!Array.isArray(x.characterIds)||x.characterIds.some(id=>!ID.test(id)))errors.push('Figurenreferenzen ungültig');
 if(!Array.isArray(x.beats)||x.beats.some(b=>!leaf(b)))errors.push('Beats ohne Quellenstatus');
 if(!Array.isArray(x.assetRefs)||x.assetRefs.some(a=>!a||a.repo!=='georg-doc/kayfabizarro'||!SHA.test(a.commit)||!safePath(a.path)||typeof a.role!=='string'||!a.licenseEvidence||!a.visualEvidence))errors.push('Assetreferenz ungeprüft');
 if(x.runtimeRef!==null&&(!x.runtimeRef||x.runtimeRef.repo!=='georg-doc/kayfabizarro'||!SHA.test(x.runtimeRef.commit)||!safePath(x.runtimeRef.path)))errors.push('Runtime-Referenz ungültig');
 for(const k of ['provenance','conflicts','todo'])if(!Array.isArray(x[k]))errors.push('Liste fehlt: '+k);
 if(!Array.isArray(x.beats)||!x.beats.length&&!x.todo?.length)errors.push('Leere Szene ohne offene Punkte');
 return errors;
}
export function validateReceipt(x){
 if(!x||x.schema!=='kfb.webchat-proposal/1')return ['Unbekannter Vorschlag'];
 const errors=[];if(!ID.test(x.id)||!ID.test(x.subjectId)||!['character','scenelet','diorama'].includes(x.kind)||x.state!=='PROPOSAL'||!SHA.test(x.baseCommit))errors.push('Vorschlagsidentität ungültig');
 if(typeof x.intent!=='string'||!x.intent.trim()||!Number.isFinite(Date.parse(x.createdAt)))errors.push('Auftrag oder Datum fehlt');
 const targets=Array.isArray(x.targets)?x.targets:[];
 if(!targets.length||targets.some(p=>!targetPath(p))||new Set(targets).size!==targets.length)errors.push('Zielpfade ungültig');
 const expected=ROOT+(x.kind==='character'?'FIGURES_R1/characters/'+x.subjectId+'.character.json':'WEBCHAT_AUTHORING_R1/'+(x.kind==='scenelet'?'scenelets/':'dioramas/')+x.subjectId+'.'+x.kind+'.json');
 if(!targets.includes(expected))errors.push('Ziel und Gegenstand passen nicht zusammen');
 if(!x.baseBlobs||targets.some(p=>!Object.hasOwn(x.baseBlobs,p)||(x.baseBlobs[p]!==null&&!SHA.test(x.baseBlobs[p]))))errors.push('Basiskarten-Prüfsumme fehlt');
 for(const k of ['changes','conflicts','provenance'])if(!Array.isArray(x[k]))errors.push('Vorschlagsliste fehlt: '+k);
 if(Array.isArray(x.changes)&&x.changes.some(c=>!c||!targets.includes(c.path)||typeof c.pointer!=='string'||!c.pointer.startsWith('/')||!Object.hasOwn(c,'before')||!Object.hasOwn(c,'after')||typeof c.reason!=='string'))errors.push('Änderungsliste ungültig');
 if(Array.isArray(x.changes)&&!x.changes.length&&x.testOnly!==true)errors.push('Vorschlag enthält keine Änderung');
 return errors;
}

