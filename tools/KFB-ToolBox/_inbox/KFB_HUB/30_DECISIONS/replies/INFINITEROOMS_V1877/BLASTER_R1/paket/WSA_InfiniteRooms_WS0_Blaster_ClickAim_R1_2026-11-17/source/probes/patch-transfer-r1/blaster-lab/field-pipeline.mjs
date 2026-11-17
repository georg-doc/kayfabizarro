export function createFieldPipeline(worker){
 let generation=0,sequence=0,error=null,disposed=false;const pending=new Map(),waiters=[],trace=[];let readyResolve,readyReject;
 const ready=new Promise((resolve,reject)=>{readyResolve=resolve;readyReject=reject;});
 function settle(){if(!pending.size)while(waiters.length)waiters.shift()();}
 function fail(e){error=String(e?.message||e);pending.clear();readyReject(Error(error));settle();}
 worker.onerror=fail;worker.onmessage=({data:m})=>{if(disposed)return;if(m.type==='ready'){readyResolve(m);return;}if(m.type==='error'){fail(m.error);return;}if(m.type!=='field'||m.generation!==generation)return;const p=pending.get(m.id);if(!p)return;pending.delete(m.id);trace.push({metrics:m.metrics,computeMs:m.computeMs,latencyMs:performance.now()-p.start});if(trace.length>64)trace.shift();p.commit(m.field);settle();};
 return {ready,canSubmit:()=>!disposed&&!error&&pending.size<8,submit(surface,impacts,commit){if(!this.canSubmit())return false;const id=++sequence;pending.set(id,{commit,start:performance.now()});worker.postMessage({type:'field',generation,id,surface:{id:surface.id,width:surface.width,height:surface.height,seed:surface.field.seedBase??surface.seed},impacts});return true;},reset(){generation++;pending.clear();worker.postMessage({type:'reset',generation});settle();},idle:()=>pending.size?new Promise(r=>waiters.push(r)):Promise.resolve(),status:()=>({pending:pending.size,generation,error,trace}),dispose(){disposed=true;pending.clear();worker.terminate();settle();}};
}
