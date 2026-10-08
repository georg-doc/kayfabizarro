'use strict';
const path=require('path');
global.window=global;
require(path.join(__dirname,'../../../../../overworld/overworld/chatter-phrases.js'));
const A=require('../runtime/real-pool-adapter.js');

let ok=0,bad=0;
function t(name,pass){if(pass){ok++;console.log('PASS',name);}else{bad++;console.error('FAIL',name);}}

const sourceRevision='72f0bd5333cdadc2b1dcdbb1d8b782ead1e70ac4';
const P=global.OW_PHRASES;
const records=A.listPhraseRecords(P,sourceRevision);

t('version phrases-v1',P.version==='phrases-v1');
t('8 factions',Object.keys(P.F).length===8);
t('166 current source records',records.length===166);
t('source ids unique',new Set(records.map(x=>x.sourceId)).size===records.length);

const k=records.find(x=>x.sourceId==='phrases-v1:F:kingCourt:ueber:0');
t('exact canonical template',k&&k.textTemplate==='We have a file on »{X}«.');
const inst=A.instantiate(k,{X:'The Doomsday Clock'});
t('template binding exact',inst&&inst.text==='We have a file on »The Doomsday Clock«.');

const ph=records.find(x=>x.sourceId==='phrases-v1:F:kingCourt:philo:0');
t('philo is silent thought',ph&&ph.register==='thought'&&ph.playbackPolicy==='silent');
const syn=records.find(x=>x.sourceId==='phrases-v1:S:camp:0');
t('synthesis source present',syn&&syn.textTemplate==='Then we take the other road.');
const act=records.find(x=>x.sourceId==='phrases-v1:T:arbeit:0');
t('activity thought silent',act&&act.register==='thought'&&act.playbackPolicy==='silent');

const req=A.buildVoiceRequest({record:k,residentId:'demon-lord',voicePreset:'demon_lord',emotion:'annoyed',bindings:{X:'The Doomsday Clock'}});
t('voice request preserves source id',req&&req.sourceRefs[0].sourceId===k.sourceId&&req.voicePreset==='demon_lord');

const segs=A.tripletToSegments({tripletId:'test.01',subject:'A',connector:'B',reframe:'C'},
  {sourceNamespace:'candidate.pool',sourceStatus:'AUTHORING_CANDIDATE',sourceRevision:'abc'});
t('triplet adapter has three roles',segs.length===3&&segs.map(x=>x.role).join(',')==='subject,connector,reframe');
t('candidate status is preserved not promoted',segs.every(x=>x.sourceStatus==='AUTHORING_CANDIDATE'));

const req2=A.buildVoiceRequest({record:k,residentId:'demon-lord',voicePreset:'demon_lord',emotion:'angry',bindings:{X:'The Doomsday Clock'}});
t('emotion changes asset key',req.voiceAssetKey!==req2.voiceAssetKey);

console.log('\n'+ok+' passed, '+bad+' failed');
process.exit(bad?1:0);
