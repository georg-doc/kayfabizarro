import fs from 'node:fs';

const here=p=>new URL(p,import.meta.url);
const read=p=>fs.readFileSync(here(p),'utf8');
let count=0;
const ok=(name,value)=>{if(!value)throw Error('FAIL '+name);console.log('ok '+(++count)+' - '+name)};

const index=read('./index.html');
const resident=read('./resident-social-memory.mjs');
const mobility=read('../../world/world-drive-interact-m2a/world-mobility-m1.mjs');
const ui=read('../../world/world-drive-interact-m2a/world-mobility-ui.mjs');
const adapter=read('../../../../tools/resident_atlas/modules/runtime/s6-resident-module.js');
const atlas=read('../../../../tools/resident_atlas_s6/lib/atlas.js');
const source=JSON.parse(read('./SOURCE.json'));

ok('Stage marker',index.includes('RESIDENT-SOCIAL-MEMORY-01'));
ok('real World M2A is reused',index.includes("const WORLD='../../world/world-drive-interact-m2a/'")&&index.includes('mountWorldMobility'));
ok('no copied World runtime under Town Stage',!index.includes('wb2d-app.js')||index.includes("WORLD+'runtime/worldbuilder/wb2-design-01/wb2d-app.js"));
ok('design contract PR/head pinned',resident.includes('contractPr:272')&&resident.includes('d48289a13fe63bab0e2226c67302210472b4c390'));
ok('World R5 owner pinned',resident.includes("pullRequest:267")&&resident.includes('4e9096681b4f563c13a0bb71c27f83e6d1df3aeb'));
ok('Resident Atlas adapter reused',resident.includes("from '../../../../tools/resident_atlas/modules/runtime/s6-resident-module.js'"));
ok('existing adapter owns source-subset projection',adapter.includes('projectConsumerRecipe')&&adapter.includes("mode: include.length ? 'source-subset' : 'full-source'"));
ok('existing Atlas builder keeps full default and accepts animation-set budget',atlas.includes('recipe.animationSets')&&atlas.includes(': ANIM_SETS'));
ok('Clown gameplay subset is actor + podium + three real pins',resident.includes("includeIds:['podium','pin_blue','pin_green','pin_red']")&&resident.includes("animationSets:['General']"));
ok('Goth Girl gameplay subset keeps seat/stage props',resident.includes("includeIds:['stool','speaker','micstand']")&&resident.includes("animationSets:['General','Simulation']"));
ok('Stage source marker is unique',source.buildMarker==='RSM01-20260928-SOURCE-SUBSET-R1'&&source.stageId==='RESIDENT-SOCIAL-MEMORY-01');
ok('Clown source module reused',resident.includes("clown-juggling-island.module.json"));
ok('two distinct source-backed residents',resident.includes("makeResident('clown'")&&resident.includes("makeResident('goth-girl'"));
ok('single semantic E literal stays in World mobility owner',(mobility.match(/KeyE/g)||[]).length===1&&!resident.includes('KeyE'));
ok('Resident adds no keydown listener',!resident.includes("addEventListener('keydown'"));
ok('shared resolver seam is the interaction owner',mobility.includes('registerInteractionResolver')&&resident.includes('mobility.registerInteractionResolver'));
ok('Resident adds no RAF owner',!resident.includes('requestAnimationFrame'));
ok('Resident adds no AnimationMixer owner',!resident.includes('AnimationMixer'));
ok('Resident adds no durable local database',!resident.includes('localStorage')&&!resident.includes('indexedDB'));
for(const state of ['attention','curiosity_interest','expectation','interaction','reaction','interpret_remember','return_resume_retarget']){
  ok('AIDA state '+state,resident.includes("'"+state+"'"));
}
ok('bounded memory cap',resident.includes('memoryPerResident:4')&&resident.includes('r.memory.length>CONFIG.memoryPerResident'));
ok('bounded social thread cap',resident.includes('threadTurns:3')&&resident.includes('Math.min(CONFIG.threadTurns'));
ok('source routine pauses and resumes',resident.includes('setActivityEnabled(false)')&&resident.includes('setActivityEnabled(true)'));
ok('ChatterBox remains semantic output owner',resident.includes("owner:'ChatterBox / semantic Triplets'")&&resident.includes("emit('kfb-chatterbox-request'"));
ok('Journey receives witnessed receipt',resident.includes("eventType:'resident.interaction.witnessed'")&&resident.includes("emit('kfb-journey-event'"));
ok('Reaction Choreography stays external owner',resident.includes("owner:'ToolBox Resident Reaction Choreography candidate PR #256'")&&resident.includes('noSecondMixer:true'));
ok('Fluff-o-lect recall requires visible + prior memory context',resident.includes("visible:juggle-cascade-v1")&&resident.includes('memory:prior witnessed interaction'));
ok('existing UI only exposes chosen target',ui.includes("r.interaction.target?.label")&&!index.includes('resident-panel'));
ok('new player-facing interaction labels are English',resident.includes("label:'talk to '+r.name"));
console.log('RESIDENT SOCIAL MEMORY PACKAGE PASS '+count+'/'+count);
