import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=dirname(fileURLToPath(import.meta.url)),read=p=>readFileSync(join(root,p),'utf8');
const ctx={window:{},document:{baseURI:'http://localhost/'},URL,setTimeout,clearTimeout};vm.createContext(ctx);vm.runInContext(read('fluffolect-r101.js'),ctx);vm.runInContext(read('kfb-bubbles.classic.js'),ctx);
const R=ctx.window.KFB_Fluffolect_R101,B=ctx.window.KFB_BUBBLES;let count=0;
function check(name,run){run();count++;console.log('PASS '+name);}
check('source blocks are verbatim, hash pinned',()=>{
 const s=read('fluffolect-r101.js'),receipt=JSON.parse(read('R101_SOURCE.json'));
 const ranges={helpers:['const h32=','\nconst FUNC2='],roles_and_morphology:['const FUNC2=','\nfunction createDecoder('],unlock_and_keys:['function unlockStage(','\nfunction stageAt('],stageAt:['function stageAt(','\n setState(input.state)'],fitCoded:['function fitCoded(','\n return fitCoded;']};
 for(const [k,[a,b]] of Object.entries(ranges)){const i=s.indexOf(a),part=s.slice(i,s.indexOf(b,i)).trimEnd();assert.equal(createHash('sha256').update(part).digest('hex'),receipt.parts[k].sha256,k);}
});
check('exact morphology and fixed compounds',()=>{
 for(const [word,expected] of Object.entries({told:'fluffed','Told!':'Fluffed!',dirty:'fluffy',hungry:'fluffy',angry:'fluffy',family:'fluffily',company:'fluff',revolution:'fluffery',carefully:'fluffily',running:'fluffing',engines:'fluffs',bloodbath:'fluffbath',bloodbaths:'fluffbaths','Bloodbath\'s!':"Fluffbath's!",firestorm:'fluffstorm',mastermind:'fluffmind',heartbreak:'fluffbreak',flowerpot:'fluff'}))assert.equal(R.fluffify(word),expected,word);
});
check('protected title, names, numbers, contractions',()=>{
 const t=R.analyze("The Ordinary World: FrizzleBob doesn't give us twenty 42 engines because Lady Dory is hungry.");
 for(let i=0;i<3;i++)assert.equal(t[i].role,'title');
 for(const w of ['FrizzleBob','Lady','Dory'])assert.equal(t.find(t=>t.w===w).role,'name');
 for(const w of ["doesn't",'us','because'])assert.equal(t.find(t=>t.w===w).role,'func');
 for(const w of ['twenty','42'])assert.equal(t.find(t=>t.w===w).role,'num');
 assert.equal(R.analyze('Hungry engines fail.')[0].role,'content');
 assert.equal(R.analyze("BlackRock's Aladdin AI: owns the companies.")[0].role,'title');
});
const cards=[{id:'a',text:'hidden engines ignite bloodbath.'},{id:'b',text:'different engine failed.'},{id:'c',text:'another person arrived.'},{id:'d',text:'people returned yesterday.'},{id:'x',text:'unrelated telescope.'}];
const decks=[{id:'d',cardIds:['a','b','c','d']},{id:'e',cardIds:['x']}];
check('two longest unique lemmas and two encounters',()=>{
 const d=R.createDecoder({cards,decks});const toks=R.analyze(cards[0].text);d.setKeys(toks);assert.equal(d.keys().join(','),'bloodbath,engines');
 assert.equal(d.unlockStage('hidden'),1);assert.equal(d.unlockStage('bloodbath'),0);
 d.setState({encounters:{bloodbath:1}});assert.equal(d.unlockStage('bloodbath'),0);
 d.setState({encounters:{bloodbath:2}});assert.equal(d.unlockStage('bloodbath'),1);
 d.setKeys(R.analyze('engine engine engine short.'));assert.equal(d.keys().join(','),'engine,short');
});
check('ownership unlocks actual card lemmas globally',()=>{
 const d=R.createDecoder({cards,decks,state:{owned:{a:true}}});d.setKeys(R.analyze('bloodbath engines unrelated.'));
 assert.equal(d.unlockStage('bloodbath'),2);assert.equal(d.unlockStage('engines'),2);assert.notEqual(d.unlockStage('unrelated'),2);
});
check('three-card bundle, not two or another deck',()=>{
 const d=R.createDecoder({cards,decks});d.setKeys(R.analyze(cards[0].text));
 d.setState({owned:{b:true,c:true}});assert.equal(d.unlockStage('bloodbath'),0);
 d.setState({owned:{b:true,c:true,x:true}});assert.equal(d.unlockStage('bloodbath'),0);
 d.setState({owned:{b:true,c:true,d:true}});assert.equal(d.unlockStage('bloodbath'),2);
});
check('assist is a view and does not mutate host progression',()=>{
 const state={encounters:{bloodbath:1},owned:{}},before=JSON.stringify(state),d=R.createDecoder({cards,decks,state});const t=R.analyze('bloodbath.')[0];d.setKeys([t]);assert.equal(d.stageAt(t,{assist:true}),2);assert.equal(d.stageAt(t,{}),0);assert.equal(JSON.stringify(state),before);
});
check('protected roles stay plain in preview, empty line safe',()=>{
 const d=R.createDecoder();for(const t of R.analyze("Dory doesn't give us 42."))if(t.role!=='content')assert.equal(d.stageAt(t,{ovr:true,d:0}),2);assert.equal(R.analyze('').length,0);d.setKeys([]);assert.equal(d.keys().length,0);
});
check('reject duplicate cards and single-glyph infinite-loop hazard',()=>{assert.throws(()=>R.createDecoder({cards:[cards[0],cards[0]]}));assert.throws(()=>R.createFitter(['◆','◆']));});
check('V-519 white default and bounded pastel/daylight contrast',()=>{
 assert.equal(B.PAPER,'#fffdf8');assert.equal(B.paperColor(),B.PAPER);
 for(const tint of ['#000000','#1f1a14','#ff0000','#0000ff','#ffffff','bad'])for(const light of [0,.5,1])for(const timeOfDay of [0,.25,.5,.75,1])for(const storyMode of [false,true])assert.ok(B.contrast(B.paperColor({tint,light,timeOfDay,storyMode}))>=7);
 assert.notEqual(B.paperColor({storyMode:true,tint:'#0000ff'}),B.PAPER);assert.notEqual(B.paperColor({light:0,timeOfDay:0}),B.PAPER);
});
check('single-file has no external resource dependencies or private font',()=>{
 const s=read('demo.single.html');assert.ok(!/<script[^>]+src=|<link[^>]+stylesheet/i.test(s));for(const block of s.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g))for(const m of block[1].matchAll(/url\("([^"]+)"\)/g))assert.ok(m[1].startsWith('data:')||m[1].startsWith('#'),'non-inline CSS URL');assert.ok(s.includes('data:font/ttf;base64,'));assert.ok(!s.includes('data:font/otf'));assert.ok(s.includes('Copyright 2022 The Shantell Sans Project Authors'));assert.ok(s.includes('Copyright 2010 The Bangers Project Authors'));
});
check('font assets and licenses match official-source receipts',()=>{for(const f of JSON.parse(read('FONT_SOURCES.json')).files){const b=readFileSync(join(root,'fonts',f.file));assert.equal(b.length,f.bytes);assert.equal(createHash('sha256').update(b).digest('hex'),f.sha256);}});
console.log(JSON.stringify({groups:count,status:'PASS'}));
