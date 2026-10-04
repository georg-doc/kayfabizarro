const {chromium}=await import(process.env.KFB_PLAYWRIGHT_MODULE||'playwright');
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/PROCEDURAL_TEST_WORLD_01_SOURCE.html';
const outDir='procedural-test-world-r2d-evidence';
await fs.mkdir(outDir,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.KFB_CHROME?{executablePath:process.env.KFB_CHROME}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const consoleErrors=[],pageErrors=[],problems=[],playerChecks=[];
async function check(name,fn){try{const detail=await fn();playerChecks.push({name,pass:true,detail});}catch(e){playerChecks.push({name,pass:false,error:String(e)});problems.push(name+': '+String(e));}}
const requireTrue=(value,message)=>{if(!value)throw Error(message);};
const readPlayer=()=>page.evaluate(()=>window.__wb2d.play.evidence());
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(String(e)));
let state=null;const sourceInspection=[];
try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>{const A=window.__wb2d,W=A?.world;return !!(A&&W&&W.id==='r2d4'&&A.terrain&&W.worldGraph?.nodes?.length===4&&A.play?.on);},null,{timeout:240000});
  state=await page.evaluate(()=>{
    const A=window.__wb2d,W=A.world,resources=performance.getEntriesByType('resource').map(r=>r.name);
    const nodeIds=W.worldGraph.nodes.map(n=>n.id),connectionIds=W.worldGraph.connections.map(c=>c.id);
    const islandGroups=nodeIds.map(id=>!!A.scene.getObjectByName('R2D island · '+id));
    const bridges=connectionIds.map(id=>!!A.scene.getObjectByName('R2D ROAD_BRIDGE · '+id));
    const anchorIds=W.worldGraph.nodes.flatMap(n=>n.anchors.map(a=>a.id));
    const buildingReport=W.buildingReport||{},presentation=W.presentationReport||{};
    return{
      world:{id:W.id,zoneId:W.zone.id,status:W.zone.status,tile:W.tile,spawn:W.spawn},
      graph:W.worldGraph,
      doc:{format:A.doc?.format,version:A.doc?.version,id:A.doc?.id,world:A.doc?.world},
      terrain:{name:A.terrain?.name,vertices:A.terrain?.geometry?.attributes?.position?.count||0},
      visible:{islandGroups,bridges},
      anchorIds,
      presentations:Object.keys(presentation),
      buildings:Object.fromEntries(Object.entries(buildingReport).map(([k,v])=>[k,{facadeRule:v.facadeRule,placed:v.placed?.length||0,windows:v.stats?.windows||0,doors:v.stats?.doors||0}])),
      player:A.play?.evidence(),
      rendererCanvasCount:document.querySelectorAll('#wb2d canvas').length,
      loadedLegacy:{wi1Play:resources.some(x=>x.includes('/wi1-play.js')),travelGlobe:resources.some(x=>x.includes('travel')&&x.includes('globe')),cardStart:resources.some(x=>x.includes('card-start'))}
    };
  });
  if(state.world.id!=='r2d4')problems.push('world id '+state.world.id);
  if(state.graph.nodes.length!==4)problems.push('node count '+state.graph.nodes.length);
  if(state.graph.connections.length!==3)problems.push('connection count '+state.graph.connections.length);
  if(!state.graph.connections.every(c=>c.kind==='ROAD_BRIDGE'&&c.owner==='Track Core'&&c.sampleCount>2))problems.push('invalid Track Core connection');
  const decks=Object.fromEntries(state.graph.nodes.map(n=>[n.id,n.deckId]));
  if(decks['world.dystopia']!=='ignore_dystopia'||decks['world.utopia']!=='forget_utopia'||decks['world.protopia']!=='embrace_protopia')problems.push('deck routing');
  for(const id of ['town.spawn.market','town.resident.clown.onboarding','town.resident.driver.taxi','town.vehicle.taxi.01','dystopia.party.pentagram','dystopia.party.orc-singer','utopia.monstrosity.throne','utopia.robot.works','protopia.farm.social-core','protopia.lorekeeper.plateau'])if(!state.anchorIds.includes(id))problems.push('anchor '+id);
  if(state.visible.islandGroups.some(x=>!x))problems.push('island group missing');
  if(state.visible.bridges.some(x=>!x))problems.push('bridge missing');
  if(state.presentations.length!==4)problems.push('presentation count '+state.presentations.length);
  if(Object.keys(state.buildings).length!==4)problems.push('building owner count '+Object.keys(state.buildings).length);
  if(!Object.values(state.buildings).every(x=>x.facadeRule==='kfb-facade-rule-v1'))problems.push('facade owner mismatch');
  if(!Object.values(state.buildings).some(x=>x.placed>0&&x.windows>0&&x.doors>0))problems.push('no source-proven building family');
  if(state.doc.format!=='kfb-worldbuilder-scene'||state.doc.version!==1)problems.push('scene owner changed');
  if(state.doc.world?.provider!=='kfb.r2d-worldbuilder-adapter/2')problems.push('provider '+state.doc.world?.provider);
  if(state.player?.actorProfileId!=='Mannequin_Medium'||state.player.mixerCount!==1)problems.push('native player missing');
  if(state.loadedLegacy.wi1Play)problems.push('wi1-play loaded');
  if(state.loadedLegacy.travelGlobe)problems.push('Travel Globe loaded');
  if(state.loadedLegacy.cardStart)problems.push('card-start loaded');
  if(state.rendererCanvasCount!==1)problems.push('canvas count '+state.rendererCanvasCount);
  if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
  const unexpected=consoleErrors.filter(x=>!x.includes('favicon')&&!x.includes('404'));
  if(unexpected.length)problems.push('consoleErrors='+unexpected.length);
  // Fresh QA context has no open drawer; preserve the actual owner UI state.
  for(const worldId of ['world.kfb-town','world.dystopia','world.utopia','world.protopia']){
    for(const variant of ['original','adapted','detail']){
      const result=await page.evaluate(async ({worldId,variant})=>await window.__wb2d.candidateEvidence.inspect(worldId,variant),{worldId,variant});
      await page.waitForTimeout(750);
      await page.screenshot({path:outDir+'/'+worldId+'.'+variant+'.png'});
      sourceInspection.push({...result,audit:await page.evaluate(()=>window.__wb2d.candidateEvidence.sourceAudit())});
    }
  }
  await page.evaluate(()=>window.__wb2d.candidateEvidence.release());
  await fs.writeFile(outDir+'/source-inspection.json',JSON.stringify(sourceInspection,null,2));
  await page.screenshot({path:outDir+'/player-town-idle.png'});
  await check('native bindings and one mixer',async()=>{
    const p=await readPlayer();requireTrue(Object.keys(p.bindings).length===4,'four clips');
    requireTrue(Object.values(p.bindings).every(b=>b.boundTracks>=60&&b.sourceTracks-b.boundTracks===6),'only absent hand slots omitted');
    requireTrue(p.mixerCount===1&&p.actorProfileId==='Mannequin_Medium','owner');return p;
  });
  await check('Town spawn and ground contact',async()=>{const p=await readPlayer();requireTrue(Math.hypot(p.position[0]-state.world.spawn.x,p.position[2]-state.world.spawn.z)<.01,'Town anchor');requireTrue(Math.abs(p.position[1]-p.groundY)<1e-6,'support');return p.position;});
  await check('W moves through Walk to Run',async()=>{
    const before=await readPlayer();await page.keyboard.down('w');await page.waitForTimeout(700);const walk=await readPlayer();
    await page.waitForFunction(()=>Math.abs(window.__wb2d.play.speed-3.303)<.001,null,{timeout:60000});const run=await readPlayer();await page.screenshot({path:outDir+'/player-town-run.png'});await page.keyboard.up('w');
    requireTrue(Math.hypot(run.position[0]-before.position[0],run.position[2]-before.position[2])>1,'movement');
    requireTrue(walk.rows.some(r=>r.role==='walk'),'Walking_B active');requireTrue(Math.abs(run.speed-3.303)<.001,'Running_A anchor');
    requireTrue(run.rows.length===1&&run.rows[0].clip==='Running_A','run');return {before,walk,run};
  });
  await page.waitForFunction(()=>window.__wb2d.play.speed===0,null,{timeout:30000});
  await check('A turns left and D turns right',async()=>{const b=await readPlayer();await page.keyboard.down('a');await page.waitForTimeout(350);await page.keyboard.up('a');const l=await readPlayer();await page.keyboard.down('d');await page.waitForTimeout(350);await page.keyboard.up('d');const r=await readPlayer();requireTrue(l.heading<b.heading&&r.heading>l.heading,'turn semantics');return [b.heading,l.heading,r.heading];});
  await check('S moves backward and returns to idle',async()=>{const b=await readPlayer();await page.keyboard.down('s');await page.waitForFunction(()=>window.__wb2d.play.speed<-.5,null,{timeout:30000});await page.waitForFunction(p=>{const a=window.__wb2d.play.position;return Math.hypot(a.x-p[0],a.z-p[2])>.12},b.position,{timeout:30000});const back=await readPlayer();await page.keyboard.up('s');await page.waitForFunction(()=>window.__wb2d.play.speed===0,null,{timeout:30000});const idle=await readPlayer();requireTrue(back.speed<0&&Math.hypot(back.position[0]-b.position[0],back.position[2]-b.position[2])>.1,'backward');requireTrue(idle.speed===0&&idle.rows[0].clip==='Idle_A','idle');return {back,idle};});
  await check('Shift reaches Running_B sprint',async()=>{await page.keyboard.down('w');await page.keyboard.down('Shift');await page.waitForFunction(()=>Math.abs(window.__wb2d.play.speed-5.255)<.001,null,{timeout:60000});const p=await readPlayer();await page.screenshot({path:outDir+'/player-town-sprint.png'});await page.keyboard.up('Shift');await page.keyboard.up('w');requireTrue(Math.abs(p.speed-5.255)<.001&&p.rows.length===1&&p.rows[0].clip==='Running_B','sprint anchor');return p;});
  await page.waitForFunction(()=>window.__wb2d.play.speed===0,null,{timeout:30000});
  await check('Ground camera owns orbit, zoom and follow',async()=>{
    const b=await page.evaluate(()=>({camera:window.__wb2d.camera.position.toArray(),position:window.__wb2d.play.position.toArray(),distance:window.__wb2d.play.params.cameraDistance,orbitEnabled:window.__wb2d.controls.enabled}));
    requireTrue(b.orbitEnabled===false,'WB2 edit orbit must release camera');
    await page.mouse.move(800,450);await page.mouse.down({button:'right'});await page.mouse.move(1000,450,{steps:6});await page.mouse.up({button:'right'});await page.mouse.wheel(0,-250);
    await page.waitForFunction(b=>window.__wb2d.camera.position.distanceTo({x:b[0],y:b[1],z:b[2]})>.2,b.camera,{timeout:30000});
    const a=await page.evaluate(()=>({camera:window.__wb2d.camera.position.toArray(),position:window.__wb2d.play.position.toArray(),distance:window.__wb2d.play.params.cameraDistance}));
    requireTrue(a.distance<b.distance&&a.position.every((v,i)=>Math.abs(v-b.position[i])<.001),'orbit/zoom changes camera, not player');return {before:b,after:a};
  });
  await check('save and reload resumes safely at idle',async()=>{await page.locator('#save').click();const before=await readPlayer();await page.reload();await page.waitForFunction(()=>window.__wb2d?.play?.on,null,{timeout:240000});const p=await readPlayer();requireTrue(p.position.every((v,i)=>Math.abs(v-before.position[i])<.001),'saved position');requireTrue(Math.abs(p.heading-before.heading)<.001&&p.speed===0,'safe idle resume');return p;});
  await check('three Track Core bridge walks use WB2 support',async()=>{
    const probes=await page.evaluate(()=>window.__wb2d.world.bridgeSupportSamples),results=[];
    for(const q of probes){
      await page.evaluate(q=>{const A=window.__wb2d,P=A.play;A.setPlay(false);const d=structuredClone(A.doc);d.world.player={actorProfileId:'Mannequin_Medium',worldId:d.id,position:q.point,heading:Math.atan2(q.next[0]-q.point[0],q.next[2]-q.point[2])};P.readDoc(d);A.setPlay(true);},q);
      const before=await readPlayer();await page.keyboard.down('w');await page.waitForFunction(p=>{const a=window.__wb2d.play.position;return Math.hypot(a.x-p[0],a.z-p[2])>.3},before.position,{timeout:30000});const after=await readPlayer();await page.keyboard.up('w');
      requireTrue(Math.abs(before.position[1]-q.point[1])<.01,'bridge spawn '+q.id);
      requireTrue(Math.hypot(after.position[0]-before.position[0],after.position[2]-before.position[2])>.3,'bridge movement '+q.id);
      requireTrue(Math.abs(after.position[1]-after.groundY)<1e-6,'bridge support '+q.id);results.push({id:q.id,before,after});
    }
    return results;
  });
  await check('native source isolate in the same WB2 renderer',async()=>{
    await page.evaluate(()=>{const A=window.__wb2d;A.setPlay(false);A.play.readDoc(A.doc);A.setPlay(true);for(const o of A.scene.children){o.userData.qaWasVisible=o.visible;if(!o.isLight&&o!==A.play.actor.holder)o.visible=false;}});
    await page.screenshot({path:outDir+'/source-mannequin-isolate.png'});
    await page.evaluate(()=>{for(const o of window.__wb2d.scene.children){o.visible=o.userData.qaWasVisible;delete o.userData.qaWasVisible;}});return 'Native unscaled source; other geometry hidden only for capture';
  });
  await page.evaluate(()=>{const A=window.__wb2d;A.setPlay(false);A.world.frameEdit(A.camera,A.controls)});
  await page.screenshot({path:outDir+'/r2d-wb2-four-island.png',fullPage:true,timeout:30000}).catch(e=>consoleErrors.push('nonblocking screenshot '+String(e)));
}catch(err){problems.push('qa-exception: '+String(err?.stack||err));}
if(pageErrors.length&&!problems.some(x=>x.startsWith('pageErrors=')))problems.push('pageErrors='+pageErrors.length);
const evidence={url,state,playerChecks,consoleErrors,pageErrors,problems};
await fs.writeFile(outDir+'/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
await browser.close();
if(problems.length)process.exit(1);
