import { env } from 'cloudflare:workers';
import {validBuild} from './links';
export {validBuild} from './links';
const ROOT='https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
const API='https://api.github.com/repos/georg-doc/kayfabizarro/';
export const REV='WSA-R1-2026-10-17';
async function remote(url:string){const r=await fetch(url,{headers:{'User-Agent':'KFB-WSA-Staging-R1','Accept':'application/vnd.github+json'},signal:AbortSignal.timeout(18000),cache:'no-store'});if(!r.ok)throw Error('GitHub '+r.status);return r}
const bucket=()=>{if(!env.BUCKET)throw Error('R2-Speicher fehlt');return env.BUCKET};
export async function catalog(){return await (await bucket().get('catalog.json'))?.json<any>()||{builds:[],checkedAt:null}}
async function changeCatalog(change:(fresh:any)=>any){
 for(let attempt=0;attempt<5;attempt++){
  const object=await bucket().get('catalog.json');const fresh=object?await object.json<any>():{builds:[],checkedAt:null};
  const value=change(fresh);
  const result=await bucket().put('catalog.json',JSON.stringify(value),{onlyIf:object?{etagMatches:object.etag}:{etagDoesNotMatch:'*'}});
  if(result)return value;
 }
 throw Error('Archiv wird parallel aktualisiert; nächster Abruf wiederholt die Prüfung');
}
export async function snapshot(sha:string){
 const prior=await bucket().get(`meta/${sha}.json`);if(prior)return prior.json<any>();
 const b=validBuild(await (await remote(ROOT+sha+'/build.json')).json());
 let files=[{path:'index.html',size:0}];
 if(b.entry==='dist/index.html'){
 const tree:any=await(await remote(API+`git/trees/${sha}?recursive=1`)).json();
 if(tree.truncated)throw Error('Dateiliste unvollständig');
 files=tree.tree.filter((f:any)=>f.type==='blob'&&f.path.startsWith('dist/'));
 if(!files.some((f:any)=>f.path===b.entry)||files.length>250||files.reduce((n:number,f:any)=>n+f.size,0)>100*1024*1024)throw Error('Bündel außerhalb der R1-Grenzen');
 }
 let bytes=0;
 for(const f of files){const r=await remote(ROOT+sha+'/'+f.path);const data=await r.arrayBuffer();bytes+=data.byteLength;if(data.byteLength>25*1024*1024||bytes>100*1024*1024)throw Error('Bündel zu groß für R1');
 if(f.path.endsWith('index.html')&&!new TextDecoder().decode(data.slice(0,100)).toLowerCase().includes('<!doctype html'))throw Error('Kein HTML-Bündel');
 await bucket().put(`build/${sha}/${f.path}`,data,{httpMetadata:{contentType:mime(f.path)}});
 }
 const meta={...b,sha,bytes,files:files.map(f=>f.path),archivedAt:new Date().toISOString()};
 await bucket().put(`meta/${sha}.json`,JSON.stringify(meta));return meta;
}
let inflight:Promise<any>|null=null;
export async function sync(){
 if(inflight)return inflight;
 inflight=(async()=>{
 const previous=await catalog();if(previous.checkedAt&&Date.now()-Date.parse(previous.checkedAt)<10000)return previous;
 try{
 const advertised=validBuild(await(await remote(ROOT+'ws1/preview/build.json?t='+Date.now())).json());
 const signature=JSON.stringify(advertised);
 if(previous.signature===signature&&previous.builds.length){return changeCatalog(fresh=>({...fresh,checkedAt:new Date().toISOString(),error:null}))}
 const head:any=await(await remote(API+'commits/ws1%2Fpreview')).json();
 const headResolvedAt=new Date().toISOString();
 const latest=await snapshot(head.sha);
 const signaturePinned=JSON.stringify(validBuild(await (await remote(ROOT+head.sha+'/build.json')).json()));
 return changeCatalog(fresh=>{
 if(fresh.headResolvedAt&&fresh.headResolvedAt>headResolvedAt)return fresh;
 return {...fresh,builds:[latest,...fresh.builds.filter((b:any)=>b.sha!==head.sha)].slice(0,5),checkedAt:new Date().toISOString(),headResolvedAt,revision:REV,error:null,signature:signaturePinned};
 });
 }catch(e:any){return changeCatalog(fresh=>({...fresh,checkedAt:new Date().toISOString(),error:e.message,revision:REV}))}

 })();try{return await inflight}finally{inflight=null}
}
export async function history(){
 const c=await catalog();if(c.builds.length>=5||c.historyChecked===c.builds[0]?.sha)return c;
 const commits:any=await(await remote(API+'commits?sha=ws1%2Fpreview&path=build.json&per_page=20')).json();
 const builds=[...c.builds];
 for(const item of commits){if(builds.length>=5)break;if(builds.some(b=>b.sha===item.sha))continue;try{builds.push(await snapshot(item.sha))}catch{/* unqualified historical builds are not admitted */}}
 // Re-read to retain a newer live head that may have arrived during backfill.
 return changeCatalog(fresh=>{
 const combined=[...fresh.builds,...builds.filter(b=>!fresh.builds.some((f:any)=>f.sha===b.sha))].slice(0,5);
 return {...fresh,builds:combined,historyChecked:c.builds[0]?.sha};
 });
}
export function mime(path:string){return ({html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css',json:'application/json',glb:'model/gltf-binary',gltf:'model/gltf+json',png:'image/png',jpg:'image/jpeg',webp:'image/webp',svg:'image/svg+xml',wasm:'application/wasm',mp3:'audio/mpeg'} as any)[path.split('.').pop()!]||'application/octet-stream'}
export async function artifact(sha:string,path:string){
 if(!/^[a-f0-9]{40}$/.test(sha)||path.split('/').some(x=>x==='..'||x==='.'||!x))return new Response('Ungültiger Pfad',{status:400});
 const admitted=await bucket().head(`meta/${sha}.json`);if(!admitted)return new Response('Stand nicht im Archiv',{status:404});
 const object=await bucket().get(`build/${sha}/${path}`);if(!object)return new Response('Datei nicht im geprüften Bündel',{status:404});
 return new Response(object.body,{headers:{'Content-Type':mime(path),'Cache-Control':'private, max-age=31536000, immutable','X-KFB-Source-SHA':sha,'X-Content-Type-Options':'nosniff'}});
}
