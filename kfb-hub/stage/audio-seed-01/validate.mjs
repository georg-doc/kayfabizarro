import fs from 'node:fs';
import path from 'node:path';
import {
  averageDeck,
  baselineDelta,
  deriveRuntime,
  identityCompatibility,
  previewStructure,
  selectIdentity,
  structureFingerprint
} from './audio-seed-core.js';

const here=path.dirname(new URL(import.meta.url).pathname);
const root=path.resolve(here,'../../..');
const source=JSON.parse(fs.readFileSync(path.join(here,'SOURCE.json'),'utf8'));
const result={status:'UNKNOWN',checks:[],decks:{}};

function check(name,ok,detail=null){
  result.checks.push({name,ok:!!ok,detail});
  if(!ok)throw new Error(name+(detail!=null?': '+JSON.stringify(detail):''));
}

try{
  check('build marker',source.build==='AUDIO-SEED-01-v0.2',source.build);
  check('external generation disabled',source.externalGenerationRequired===false);
  check('three real decks',Object.keys(source.decks).length===3,Object.keys(source.decks));

  const signatures=new Set();
  for(const [id,deck] of Object.entries(source.decks)){
    const p=path.join(root,deck.dataPath);
    check(id+' source exists',fs.existsSync(p),deck.dataPath);
    const data=JSON.parse(fs.readFileSync(p,'utf8'));
    check(id+' card count',data.cards.length===deck.cardCount,{actual:data.cards.length,expected:deck.cardCount});

    const semantic=averageDeck(data.cards,deck.role);
    const delta=baselineDelta(semantic,deck.expectedSemanticBaseline);
    check(id+' semantic baseline exact',delta<=0.0001,{delta,semantic,expected:deck.expectedSemanticBaseline});

    const a=selectIdentity(deck,semantic);
    const b=selectIdentity(deck,semantic);
    check(id+' deterministic identity',a.identitySignature===b.identitySignature,{a:a.identitySignature,b:b.identitySignature});
    check(id+' compatible secondary',identityCompatibility(a)>0,{primary:a.primary,secondary:a.secondary,compatibility:identityCompatibility(a)});
    check(id+' family budget',a.families.length>=3&&a.families.length<=4,a.families);

    const worldEvents=previewStructure(a,{mode:'world'},64);
    const fp1=structureFingerprint(a,{mode:'world'},64);
    const fp2=structureFingerprint(a,{mode:'world'},64);
    check(id+' deterministic structure',fp1===fp2,{fp1,fp2});
    check(id+' audible event plan',worldEvents.length>2);
    if(id==='EMBRACE'){
      const brightMotifEvents=worldEvents.filter(([,type])=>type==='motif'||type==='answer').length;
      check('EMBRACE motif/answer density bounded',brightMotifEvents<=14,{brightMotifEvents,total:worldEvents.length});
    }

    const world=deriveRuntime(a,{mode:'world',speed:0});
    const road=deriveRuntime(a,{mode:'road',speed:.95});
    check(id+' bounded road tempo',road.bpm-world.bpm<=7,{world:world.bpm,road:road.bpm});
    check(id+' road density/subdivision',road.subdivisionLevel===2&&road.density>world.density,{world,road});

    signatures.add(a.identitySignature);
    result.decks[id]={semantic,delta,identity:a,world,road,worldFingerprint:fp1};
  }
  check('three distinct identities',signatures.size===3,[...signatures]);
  result.status='PASS';
}catch(e){
  result.status='FAIL';
  result.failure=String(e.stack||e);
  process.exitCode=1;
}
console.log(JSON.stringify(result,null,2));
