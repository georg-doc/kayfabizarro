import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { ARTIFACT_DIR } from './asset-librarian-v1.2-env.mjs';

export async function waitHttp(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs; let last;
  while (Date.now() < deadline) {
    try { const r = await fetch(url, { cache: 'no-store' }); if (r.ok) return r; last = `${r.status} ${r.statusText}`; }
    catch (e) { last = e.message; }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}: ${last}`);
}
class CDP {
  constructor(ws) {
    this.ws=ws; this.nextId=1; this.pending=new Map(); this.consoleErrors=[]; this.exceptions=[];
    ws.addEventListener('message',(event)=>{
      const m=JSON.parse(String(event.data));
      if(m.id){const q=this.pending.get(m.id);if(!q)return;this.pending.delete(m.id);if(m.error)q.reject(new Error(`${q.method}: ${m.error.message}`));else q.resolve(m.result||{});return;}
      if(m.method==='Runtime.consoleAPICalled'&&m.params?.type==='error')this.consoleErrors.push(m.params.args?.map((a)=>a.value??a.description??'').join(' ')||'console.error');
      if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception');
    });
  }
  send(method,params={}){const id=this.nextId++;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject,method});this.ws.send(JSON.stringify({id,method,params}));});}
  async evaluate(expression){const r=await this.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'Evaluation failed');return r.result?.value;}
}
export async function connectCDP(url){
  const ws=new WebSocket(url);
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('CDP websocket timeout')),10000);ws.addEventListener('open',()=>{clearTimeout(timer);resolve();},{once:true});ws.addEventListener('error',()=>{clearTimeout(timer);reject(new Error('CDP websocket error'));},{once:true});});
  return new CDP(ws);
}
export async function waitFor(cdp,expression,label,timeoutMs=60000){
  const deadline=Date.now()+timeoutMs;let last;while(Date.now()<deadline){try{last=await cdp.evaluate(expression);if(last)return last;}catch(e){last=e.message;}await sleep(250);}throw new Error(`Timed out: ${label}; last=${JSON.stringify(last)}`);
}
export async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});const file=path.join(ARTIFACT_DIR,`${name}.png`);writeFileSync(file,Buffer.from(r.data,'base64'));return file;}
