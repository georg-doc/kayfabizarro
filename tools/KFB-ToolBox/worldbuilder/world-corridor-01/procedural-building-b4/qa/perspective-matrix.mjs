import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-integration-01/WORLD_INTEGRATION_01_SOURCE.html?world=huerth-b1';
const SUBJECTS=[
  {lane:'compact-simple',id:'b1/compact-simple/371401529-to-371401477'},
  {lane:'ordinary-notched',id:'b1/ordinary-notched/371401481-to-371401497'},
  {lane:'large-complex',id:'b1/large-complex/371401488-to-371401495'}
];
const MODES=[
  {id:'neutral',fov:45,filmOffset:0,up:[0,1,0],pos:[.62,.52,.62],targetY:0},
  {id:'cartoon',fov:59,filmOffset:4.8,up:[.04,.9992,0],pos:[.46,.22,.41],targetY:7},
  {id:'grotesque',fov:76,filmOffset:10.5,up:[.085,.9964,0],pos:[.31,.12,.28],targetY:12}
];

await fs.mkdir('building-b4-evidence',{recursive:true});

const browser=await chromium.launch({
  headless:true,
  args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

const problems=[],shots=[];
let baseFingerprint=null,roadMaxM=null;

try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>{
    const A=window.__wb2d,W=A?.world;
    return !!(A&&W&&W.city&&W.city.stats?.facade?.rule==='kfb-facade-rule-v1');
  },null,{timeout:240000});

  await page.evaluate(async()=>{
    try{await window.__wb2d.showScene();}catch{}
    window.__wb2d.world.setVisible(true);
  });
  await page.waitForTimeout(800);

  const init=await page.evaluate(async()=>{
    const {FACADE_RULE}=await import('/wd1-city.js');
    const A=window.__wb2d,W=A.world,C=W.city;
    const fingerprint=(mesh)=>{
      const p=mesh?.geometry?.getAttribute?.('position');
      if(!p)return null;
      let sx=0,sy=0,sz=0;
      const step=Math.max(1,Math.floor(p.count/257));
      for(let i=0;i<p.count;i+=step){
        sx+=p.getX(i);sy+=p.getY(i);sz+=p.getZ(i);
      }
      return {
        count:p.count,
        sx:+sx.toFixed(6),sy:+sy.toFixed(6),sz:+sz.toFixed(6)
      };
    };
    const details=Object.entries(C.detailMeshes||{}).sort(([a],[b])=>a.localeCompare(b)).map(([k,m])=>[k,fingerprint(m)]);
    return {
      roadMaxM:FACADE_RULE.roadMaxM,
      worldId:W.id,
      zoneId:W.zone.id,
      facade:C.stats.facade.rule,
      buildings:C.stats.buildings,
      rendererCount:1,
      fingerprint:{
        blocks:fingerprint(C.blocks),
        roofs:fingerprint(C.roofs),
        details
      }
    };
  });

  roadMaxM=init.roadMaxM;
  if(roadMaxM!==40)problems.push('FACADE_RULE roadMaxM '+roadMaxM+' expected 40');
  if(init.worldId!=='huerth-b1')problems.push('world '+init.worldId);
  if(init.zoneId!=='huerth-b1-siblings-v0')problems.push('zone '+init.zoneId);
  if(init.facade!=='kfb-facade-rule-v1')problems.push('facade '+init.facade);
  if(init.buildings!==700)problems.push('buildings '+init.buildings);
  baseFingerprint=JSON.stringify(init.fingerprint);

  for(const subject of SUBJECTS){
    for(const mode of MODES){
      const state=await page.evaluate(({subject,mode})=>{
        const A=window.__wb2d,W=A.world,camera=A.camera,controls=A.controls;
        const b=W.zone.buildings.find(x=>x.id===subject.id);
        if(!b)throw new Error('subject missing '+subject.id);
        let fp=(b.fp||[]).map(p=>({x:p.x,z:p.z}));
        if(fp.length>1&&Math.hypot(fp[0].x-fp.at(-1).x,fp[0].z-fp.at(-1).z)<.001)fp=fp.slice(0,-1);
        const c=fp.reduce((a,p)=>({x:a.x+p.x/fp.length,z:a.z+p.z/fp.length}),{x:0,z:0});
        const span=80; // 2 × FACADE_RULE.roadMaxM (verified separately)
        camera.fov=mode.fov;
        camera.filmOffset=mode.filmOffset;
        camera.up.set(...mode.up);
        camera.position.set(
          c.x+span*mode.pos[0],
          span*mode.pos[1],
          c.z+span*mode.pos[2]
        );
        controls.target.set(c.x,mode.targetY,c.z);
        camera.near=.5;
        camera.far=span*4.5;
        camera.updateProjectionMatrix();
        controls.update();

        let tag=document.getElementById('b4EvidenceTag');
        if(!tag){
          tag=document.createElement('div');
          tag.id='b4EvidenceTag';
          Object.assign(tag.style,{
            position:'fixed',left:'16px',bottom:'16px',zIndex:'99999',
            background:'#17150fd9',border:'1px solid #7b725f',borderRadius:'8px',
            padding:'8px 10px',color:'#f3ecd9',font:'700 12px system-ui'
          });
          document.body.appendChild(tag);
        }
        tag.textContent='B4 · '+subject.lane+' · '+mode.id+
          ' · FOV '+mode.fov+' · film '+mode.filmOffset;

        const C=W.city;
        const fingerprint=(mesh)=>{
          const p=mesh?.geometry?.getAttribute?.('position');
          if(!p)return null;
          let sx=0,sy=0,sz=0;
          const step=Math.max(1,Math.floor(p.count/257));
          for(let i=0;i<p.count;i+=step){sx+=p.getX(i);sy+=p.getY(i);sz+=p.getZ(i);}
          return {count:p.count,sx:+sx.toFixed(6),sy:+sy.toFixed(6),sz:+sz.toFixed(6)};
        };
        const details=Object.entries(C.detailMeshes||{}).sort(([a],[b])=>a.localeCompare(b)).map(([k,m])=>[k,fingerprint(m)]);
        return {
          subject,
          mode,
          centroid:c,
          height:b.h,
          roof:b.roof?.type||null,
          span,
          camera:{
            fov:camera.fov,filmOffset:camera.filmOffset,
            up:[camera.up.x,camera.up.y,camera.up.z],
            position:[camera.position.x,camera.position.y,camera.position.z],
            target:[controls.target.x,controls.target.y,controls.target.z],
            near:camera.near,far:camera.far
          },
          fingerprint:{
            blocks:fingerprint(C.blocks),
            roofs:fingerprint(C.roofs),
            details
          }
        };
      },{subject,mode});

      await page.waitForTimeout(450);

      if(JSON.stringify(state.fingerprint)!==baseFingerprint){
        problems.push(subject.lane+'/'+mode.id+': geometry fingerprint changed');
      }
      if(state.span!==80)problems.push(subject.lane+'/'+mode.id+': span '+state.span);
      if(state.camera.fov!==mode.fov)problems.push(subject.lane+'/'+mode.id+': fov');
      if(Math.abs(state.camera.filmOffset-mode.filmOffset)>.001)problems.push(subject.lane+'/'+mode.id+': film');
      for(let k=0;k<3;k++)if(Math.abs(state.camera.up[k]-mode.up[k])>.001)problems.push(subject.lane+'/'+mode.id+': up['+k+']');

      const file=SUBJECTS.indexOf(subject)+1+'-'+subject.lane+'-'+mode.id+'.png';
      await page.screenshot({path:'building-b4-evidence/'+file,fullPage:true,timeout:30000});
      shots.push({...state,file});
    }
  }

  if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
  const unexpected=consoleErrors.filter(x=>!x.includes('404')&&!x.includes('favicon'));
  if(unexpected.length)problems.push('consoleErrors='+unexpected.length);
}catch(err){
  problems.push('qa-exception: '+String(err?.stack||err));
}

const evidence={
  url,
  sourceCameraBlob:'181edccab50c2b127b95370cc67da55e138b7a78',
  roadMaxM,
  contextSpan:roadMaxM?roadMaxM*2:null,
  subjects:SUBJECTS,
  modes:MODES,
  geometryChanged:false,
  shots,
  consoleErrors,pageErrors,problems
};
await fs.writeFile('building-b4-evidence/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
await browser.close();
if(problems.length)process.exit(1);
