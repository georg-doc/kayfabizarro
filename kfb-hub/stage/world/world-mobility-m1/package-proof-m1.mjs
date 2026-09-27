import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const source=path.resolve('kfb-hub/stage/world/world-r2');
const candidate=path.resolve('kfb-hub/stage/world/world-mobility-m1');
let count=0;
function ok(name,condition){if(!condition)throw new Error('FAIL '+name);console.log('ok '+(++count)+' - '+name)}
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}

const changedRuntime='runtime/worldbuilder/world-integration-01/wi1-play.js';
for(const file of walk(path.join(source,'runtime'))){
  const rel=path.relative(source,file);
  if(rel===changedRuntime)continue;
  ok('accepted World r2 runtime unchanged: '+rel,digest(file)===digest(path.join(candidate,rel)));
}
const play=fs.readFileSync(path.join(candidate,changedRuntime),'utf8');
const index=fs.readFileSync(path.join(candidate,'index.html'),'utf8');
const mobility=fs.readFileSync(path.join(candidate,'world-mobility-m1.mjs'),'utf8');
const ui=fs.readFileSync(path.join(candidate,'world-mobility-ui.mjs'),'utf8');
const clay=fs.readFileSync(path.join(candidate,'clay-world-m1.mjs'),'utf8');
const router=fs.readFileSync(path.join(candidate,'travel-mode-router.js'),'utf8');
const intent=fs.readFileSync(path.join(candidate,'mode-intent.js'),'utf8');
const carrier=fs.readFileSync(path.join(candidate,'card-carrier.js'),'utf8');
const joined=[mobility,ui,clay,router,intent,carrier].join('\n');

ok('M1 entry marker',index.includes('WORLD-MOBILITY-M1'));
ok('one WorldBuilder runtime import',(index.match(/wb2d-app\.js/g)||[]).length===1);
ok('no track proxy loaded',!index.includes('track-module')&&!fs.existsSync(path.join(candidate,'track-module-c0.mjs'))&&!fs.existsSync(path.join(candidate,'TRACK_MODULE_SOURCE.json')));
ok('C0 custom flight adapter not shipped',!fs.existsSync(path.join(candidate,'flight-mode-c0.mjs')));
ok('Travel router exact schema',router.includes("TRAVEL_MODE_ROUTER_SCHEMA = 'kfb.travel-mode-router/1'")&&router.includes("TRAVEL_MODE_SOURCE_REQUIRED = 'SOURCE_REQUIRED'"));
ok('Travel 400ms intent exact default',intent.includes('DEFAULT_DOUBLE_SPACE_WINDOW_MS = 400')&&intent.includes("source: 'GROUND_DOUBLE_SPACE'"));
ok('Travel Card Carrier exact identity',carrier.includes("name: 'card-carrier'")&&carrier.includes('Canonical VISUAL embodiment of the vehicle'));
ok('World input seam delegates jump once',play.includes('setJumpHandler(fn)')&&play.includes('jumpHandler({ event:e, jump:() => walker.jump()'));
ok('M1 consumes router and intent',mobility.includes('createTravelModeRouter')&&mobility.includes('createGroundFlightIntent'));
ok('M1 explicitly excludes proxy track',mobility.includes('trackProxy:false'));
ok('flight actor no longer uses jump.air',!mobility.includes("play.actor.play('jump.air'")&&mobility.includes("play.actor.play('idle'"));
ok('ground return uses existing World placement owner',mobility.includes('play.place(p.x,p.z,heading)'));
ok('Drive and Water remain source-required',router.includes("id: 'DRIVE'")&&router.includes("id: 'WATER'")&&(router.match(/TRAVEL_MODE_SOURCE_REQUIRED/g)||[]).length>=3);
ok('H0 Hirnwelt material and relief are real source modules',clay.includes("from './h0-clay/clay-relief.v2.js'")&&clay.includes("from './h0-clay/clay-material.v4.js'")&&fs.existsSync(path.join(candidate,'h0-clay/clay-soften.v1.js')));
ok('H0 uses three material scales',clay.includes("facades/roofs 2.45/2.05")&&clay.includes("terrain/road/sidewalk 1.35")&&clay.includes("props .62"));
ok('H0 runtime leaves geometry and skinned actors with their owners',clay.includes('geometryRuntimePreprocess:false')&&clay.includes('skinnedMeshesUntouched:true')&&!clay.includes('softenGeometry('));
ok('Clay stays reversible',clay.includes('r.mesh.material=on?r.clay:r.original'));
ok('no second renderer or camera constructor',!/new THREE\.(WebGLRenderer|PerspectiveCamera|OrthographicCamera)/.test(joined));
ok('compact integrated controls',ui.includes('1× Leertaste springen')&&ui.includes('2× innerhalb 400 ms abheben'));
ok('documentation hidden by default',ui.includes('id="m1-help" hidden'));
ok('no placeholder branding',!/(Lorem|placeholder|helvetiker|TextGeometry)/i.test(joined));
console.log('WORLD MOBILITY M1 PACKAGE PASS '+count+'/'+count);
