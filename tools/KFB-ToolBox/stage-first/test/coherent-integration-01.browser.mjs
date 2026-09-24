import { chromium } from 'playwright';

let pass=0;
function ok(name,cond){
  if(!cond) throw new Error('FAIL '+name);
  pass++;console.log('ok '+pass+' - '+name);
}
const near=(a,b,eps=1e-5)=>Math.abs(a-b)<=eps;
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:980}});
page.on('console',(m)=>{if(['error','warning'].includes(m.type()))console.log('browser '+m.type()+': '+m.text());});
page.on('pageerror',(e)=>console.log('browser pageerror: '+e.message));
try{
  const url='http://127.0.0.1:8765/tools/KFB-ToolBox/stage-first/src/TOOLBOX_COHERENT_INTEGRATION_01.html';
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>window.__KFB_COHERENT&&window.__KFB_COHERENT.ready===true,null,{timeout:180000});
  let p=await page.evaluate(()=>window.__KFB_COHERENT.probe());
  ok('coherent runtime reaches ready',p.ready===true);
  ok('accepted real roster remains populated',p.rosterCount>=35);
  ok('startup actor is graft-driver',p.actorId==='graft-driver');
  ok('visible Driver is current graft-mount owner',p.actorOwnerSchema==='kfb.graft-mount/1');
  ok('source starts isolated before Resident load',p.residentId===null&&p.viewMode==='source');

  await page.evaluate(()=>window.__KFB_COHERENT.loadResident('goth-girl',{applySaved:false}));
  p=await page.evaluate(()=>window.__KFB_COHERENT.probe());
  ok('real Goth Girl Resident loads',p.residentId==='goth-girl'&&p.residentNodeCount>=4);
  ok('Resident recipe actor is present',typeof p.residentActorId==='string'&&p.residentActorId.length>0);

  const changed=await page.evaluate(()=>{
    const api=window.__KFB_COHERENT;
    api.edit.setOn(true);
    const id=api.resident.recipe.actor.id;
    const n=api.selectResidentNode(id);
    api.edit.setMode('translate');
    n.position.y+=0.45;n.updateMatrixWorld(true);
    const drop=api.edit.drop();
    api.edit.setMode('scale');
    n.position.x+=0.237;
    n.rotation.y+=0.173;
    n.scale.set(n.scale.x*1.07,n.scale.y*0.93,n.scale.z*1.11);
    n.updateMatrixWorld(true);
    return {id,dropCount:drop.length,p:[n.position.x,n.position.y,n.position.z],r:[n.rotation.x,n.rotation.y,n.rotation.z],s:[n.scale.x,n.scale.y,n.scale.z],mode:api.edit.mode};
  });
  ok('Drop executes through shared edit-layer',changed.dropCount===1);
  ok('free Scale mode is active',changed.mode==='scale');
  ok('non-uniform scale is permitted',!(near(changed.s[0],changed.s[1])&&near(changed.s[1],changed.s[2])));

  const patch=await page.evaluate(()=>window.__KFB_COHERENT.save());
  ok('Save emits kfb.scene-patch.v1',patch.schema==='kfb.scene-patch.v1');
  ok('Save keeps exact Resident source identity',patch.source.assetId==='goth-girl'&&patch.source.sourceRef.includes('10f661a542e2553b4d3433bfc5b45dfc1401e660'));
  ok('Save contains actor transform op',patch.ops.some((x)=>x.id==='goth-girl:'+changed.id));

  await page.evaluate(()=>window.__KFB_COHERENT.reload());
  const round=await page.evaluate((id)=>{
    const api=window.__KFB_COHERENT,n=api.resident.v.nodes.get(id);
    return {probe:api.probe(),p:[n.position.x,n.position.y,n.position.z],r:[n.rotation.x,n.rotation.y,n.rotation.z],s:[n.scale.x,n.scale.y,n.scale.z]};
  },changed.id);
  ok('Reload rebuilds same real Resident scene',round.probe.residentId==='goth-girl');
  ok('Move round-trips through scene patch',round.p.every((v,i)=>near(v,changed.p[i],1e-5)));
  ok('Rotate round-trips through scene patch',round.r.every((v,i)=>near(v,changed.r[i],1e-5)));
  ok('free Scale round-trips through scene patch',round.s.every((v,i)=>near(v,changed.s[i],1e-5)));
  ok('editing continues after Reload',round.probe.editorOn===true);

  await page.evaluate(()=>window.__KFB_COHERENT.loadResident('orc-warband',{applySaved:false}));
  p=await page.evaluate(()=>window.__KFB_COHERENT.probe());
  ok('real Orc Warband Resident loads',p.residentId==='orc-warband'&&p.residentNodeCount>=3);

  await page.evaluate(()=>window.__KFB_COHERENT.loadResident('animatronic',{applySaved:false}));
  p=await page.evaluate(()=>window.__KFB_COHERENT.probe());
  ok('real Animatronic Resident loads',p.residentId==='animatronic'&&p.residentNodeCount>=3);

  console.log('BROWSER PASS '+pass+'/'+pass);
} finally {
  await browser.close();
}
