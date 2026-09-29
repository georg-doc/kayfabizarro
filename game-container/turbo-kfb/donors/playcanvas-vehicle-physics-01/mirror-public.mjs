import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT='https://playcanv.as/apps/BfRjx709/';
const ENTRY=ROOT+'index.html';
const OUT='game-container/turbo-kfb/donors/playcanvas-vehicle-physics-01/static';

await fs.rm(OUT,{recursive:true,force:true});
await fs.mkdir(OUT,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const pending=[];
const captured=new Map();
const errors=[];

page.on('response',response=>{
  const p=(async()=>{
    const url=response.url();
    if(!url.startsWith(ROOT) || response.status()!==200) return;
    const u=new URL(url);
    let rel=decodeURIComponent(u.pathname.slice(new URL(ROOT).pathname.length));
    if(!rel || rel.endsWith('/')) rel+='index.html';
    if(rel.includes('..')) return;
    try{
      const body=await response.body();
      captured.set(rel,{url,size:body.length,body});
    }catch(e){
      errors.push({url,error:String(e)});
    }
  })();
  pending.push(p);
});

await page.goto(ENTRY,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>{
  try{return Boolean(window.pc?.Application?.getApplication?.()?.root?.findByName?.('Car Physics'));}catch{return false;}
},null,{timeout:120000});
await page.waitForTimeout(4000);
await Promise.allSettled(pending);

for(const [rel,item] of captured){
  const dest=path.join(OUT,rel);
  await fs.mkdir(path.dirname(dest),{recursive:true});
  await fs.writeFile(dest,item.body);
}

const files=[];
for(const [rel,item] of [...captured.entries()].sort((a,b)=>a[0].localeCompare(b[0]))){
  files.push({
    path:rel,
    sourceUrl:item.url,
    bytes:item.size,
    sha256:crypto.createHash('sha256').update(item.body).digest('hex')
  });
}
const manifest={
  schema:'kfb.playcanvas-donor-mirror/1',
  source:'official PlayCanvas Vehicle Physics public build',
  sourceRoot:ROOT,
  sourceEntry:ENTRY,
  capturedAt:new Date().toISOString(),
  fileCount:files.length,
  totalBytes:files.reduce((n,f)=>n+f.bytes,0),
  files,
  captureErrors:errors
};
await fs.writeFile(path.join(OUT,'KFB_DONOR_MIRROR.json'),JSON.stringify(manifest,null,2)+'\n');

console.log(JSON.stringify({fileCount:manifest.fileCount,totalBytes:manifest.totalBytes,captureErrors:errors,files:files.map(f=>({path:f.path,bytes:f.bytes}))},null,2));
if(files.length<10) throw new Error('Too few donor runtime files captured: '+files.length);
if(!files.some(f=>f.path==='index.html')) throw new Error('index.html missing');
if(!files.some(f=>/config\.json$/.test(f.path))) throw new Error('config.json missing');
if(!files.some(f=>/\.wasm$/.test(f.path))) throw new Error('Ammo/Basis wasm missing');
await browser.close();
