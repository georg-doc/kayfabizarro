import {chromium} from 'playwright';import fs from 'node:fs/promises';
const BASE=process.env.CA203_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/combat/ca2-enemy-adapters/';
const EXPECTED=process.env.CA203_SOURCE_HEAD||'';
const OUT=process.env.CA203_PROOF_DIR||'ca203-playback-evidence';
const checks=[];
const check=(n,c,e='')=>{checks.push({name:n,pass:!!c,extra:e});if(!c)throw Error('FAIL '+n+' '+e);console.log('PASS',n,e)};
const expectedMap={
 'skeleton-warrior':{idle:'Idle_A',move:'Running_A',attack:'Melee_1H_Attack_Chop',hit:'Hit_A',defeat:'Death_A'},
 'orc-brute':{idle:'Idle_A',move:'Walking_A',attack:'Melee_Unarmed_Smash',hit:'Hit_A',defeat:'Death_A'},
 'avian-swordsman':{idle:'Idle_A',move:'Running_A',attack:'Melee_1H_Attack_Jump_Chop',hit:'Hit_A',defeat:'Death_A'}
};
const states=['idle','move','attack','hit','defeat'], ids=Object.keys(expectedMap);
await fs.mkdir(OUT,{recursive:true});
const marker=await fetch(BASE+'SOURCE.json?x='+Date.now(),{cache:'no-store'}).then(async r=>({ok:r.ok,status:r.status,json:await r.json()}));
check('source marker HTTP',marker.ok,'status='+marker.status);check('source marker head',marker.json.implementationHead===EXPECTED,marker.json.implementationHead);
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:920}});const errors=[],failed=[];
 page.on('pageerror',e=>errors.push('pageerror '+String(e)));page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
 const r=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});check('stage HTTP',r?.ok()===true,'status='+r?.status());
 await page.waitForFunction(()=>window.__KFB_CA203_PLAYBACK__?.ready||window.__KFB_CA203_PLAYBACK__?.error,null,{timeout:120000});
 let snap=await page.evaluate(()=>window.__KFB_CA203_PLAYBACK__.snapshot());
 check('playback ready',snap.ready===true,JSON.stringify(snap.error));check('three actors',snap.actors.length===3,String(snap.actors.length));
 check('exact model pin',snap.source.modelPin==='891eadf01e218f5fc21387e64cea1fec8332c5b6',snap.source.modelPin);check('exact animation pin',snap.source.animationPin==='11d7df978c63b9e375707bd8d9431b4c8358cda8',snap.source.animationPin);
 for(const a of snap.actors)check(a.id+' exactly one mixer',a.oneMixer===true,JSON.stringify(a));
 check('state map frozen',JSON.stringify(snap.stateMap)===JSON.stringify(expectedMap),JSON.stringify(snap.stateMap));
 check('no Arena ownership',Object.values(snap.scope).every(v=>v===false),JSON.stringify(snap.scope));
 const anchors={};
 const evidence={states:{}};
 for(const state of states){
   snap=await page.evaluate(({state})=>window.__KFB_CA203_PLAYBACK__.freeze(state,.35),{state});
   check(state+' current',snap.current===state,snap.current);
   evidence.states[state]=snap.measurements;
   for(const id of ids){
     const m=snap.measurements[id],exp=expectedMap[id][state];
     check(id+' '+state+' exact clip',m.clip===exp,m.clip);
     check(id+' '+state+' frozen phase',Math.abs((m.phase??0)-.35)<1e-9,String(m.phase));
     check(id+' '+state+' finite bounds',Number.isFinite(m.bounds.diag)&&Number.isFinite(m.bounds.height)&&Number.isFinite(m.groundMinY),JSON.stringify(m.bounds));
     const ratio=m.bounds.diag/m.restDiag;check(id+' '+state+' no collapse',ratio>.5&&ratio<2.1,'diagRatio='+ratio.toFixed(3));
     if(!anchors[id]) anchors[id]={...m.anchor};
     const a=anchors[id];check(id+' '+state+' anchor stable',Math.abs(m.anchor.x-a.x)<1e-6&&Math.abs(m.anchor.y-a.y)<1e-6&&Math.abs(m.anchor.z-a.z)<1e-6,JSON.stringify(m.anchor));
     if(state!=='attack')check(id+' '+state+' ground residual',m.groundMinY>=-.45&&m.groundMinY<=.55,'minY='+m.groundMinY);
     else check(id+' '+state+' no floor penetration',m.groundMinY>=-.45,'minY='+m.groundMinY);
   }
   await page.screenshot({path:OUT+'/'+state+'.png',fullPage:true});
 }
 check('no failed resources',failed.length===0,JSON.stringify(failed));check('no page errors',errors.length===0,JSON.stringify(errors));
 await fs.writeFile(OUT+'/playback.json',JSON.stringify({checks,anchors,evidence,failed,errors},null,2)+'\n');
 console.log('CA203_PLAYBACK_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
 console.log('CA203_PLAYBACK_JSON',JSON.stringify({anchors,evidence}));
}finally{if(browser)await browser.close()}
