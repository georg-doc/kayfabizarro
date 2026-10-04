// Consumes the existing WS1 donor without editing its files or creating a second deformer.
export const PIN='f510a35f027148b7d6238fcb0ffec18848aecd25';
export const ROOT='tools/KFB-ToolBox/_inbox/KFB Cartoon Vehicle + Deformer Lab v1/WS1_Vehicles_Review_2026-09-18/';
export const raw=(path,pin=PIN)=>`https://raw.githubusercontent.com/georg-doc/kayfabizarro/${pin}/`+path.split('/').map(encodeURIComponent).join('/');
export async function readExact(url,expected){
  const r=await fetch(url);if(!r.ok)throw Error(`Source HTTP ${r.status}: ${url}`);
  const bytes=new Uint8Array(await r.arrayBuffer());
  if(expected){const header=new TextEncoder().encode(`blob ${bytes.length}\0`),joined=new Uint8Array(header.length+bytes.length);joined.set(header);joined.set(bytes,header.length);
    const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1',joined)),n=>n.toString(16).padStart(2,'0')).join('');
    if(actual!==expected)throw Error('Source identity mismatch: '+url);
  }return new TextDecoder().decode(bytes);
}
async function moduleAt(name,sha){
  const code=await readExact(raw(ROOT+'lab-v7/'+name),sha);
  const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
  try{return await import(url)}finally{URL.revokeObjectURL(url)}
}
export async function loadSources(){
  const [fixtures,parts,deformer,profiles]=await Promise.all([
    moduleAt('fixture-adapters.v2.js','06f7c86efd7a725b67bcf417dc8ecead5d50bb89'),
    moduleAt('carrig.v1.js','0f3838fb53afdd1cf4fb8412d3a6d7ad7edfdca1'),
    moduleAt('vehicle-cartoon-deformer.v2.js','ce82a6265abb501f90ee841f8f7e522bc5862299'),
    readExact(raw(ROOT+'lab-v7/deformer-profiles.json'),'2bb3615230e665462c5042a93fb6cbaeae4c2f75').then(JSON.parse)
  ]);
  if(fixtures.ALL.length!==43)throw Error('Unexpected WS1 fixture set');
  return {fixtures,parts,deformer,profiles:profiles.profiles};
}
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,Number.isFinite(x)?x:0));
export function readSaved(){try{return JSON.parse(localStorage.getItem('kfb-race-box-stop/1'))||{}}catch{return {}}}
export function writeSaved(data){try{localStorage.setItem('kfb-race-box-stop/1',JSON.stringify(data));return true}catch{return false}}
