import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(), drop=process.env.KFB_SOURCE_ROOT;
if(!drop)throw Error('Set KFB_SOURCE_ROOT to the authorized private KFB_HUB source folder');
const manifest=JSON.parse(fs.readFileSync('reference/ASSET_MANIFEST.json','utf8'));
const bySize=new Map();
for(const x of manifest.dateien){bySize.set(x.bytes,[...(bySize.get(x.bytes)||[]),x]);}
const found=new Map();
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules','.git','vendor'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.isFile()){const xs=bySize.get(fs.statSync(p).size);if(!xs)continue;const b=fs.readFileSync(p),h=crypto.createHash('sha256').update(b).digest('hex');for(const x of xs)if(x.sha256===h)found.set(x.pfad,p);}}}
walk(drop);
const missing=[];
for(const x of manifest.dateien){const p=found.get(x.pfad);if(!p){missing.push(x.pfad);continue;}const dest=path.join(root,'dist/experience/private',x.pfad);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(p,dest);}
fs.mkdirSync('dist/experience/vendor',{recursive:true});
const h13=fs.readFileSync('reference/H13.dc.html','utf8');
const script=h13.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
fs.writeFileSync('dist/experience/vendor/h13-engine.js',`// Exact H13 script body, source blob 46670cfa5c62c3aea6aa3840d301fc7a35723407.\nclass DCLogic { constructor(props={}){this.props=props;} setState(x){Object.assign(this.state,typeof x==='function'?x(this.state):x);} }\n${script}\nexport {Component as H13Engine, POOL, TEXTS, CTX, PALS, W, H};\n`);
fs.copyFileSync(path.join(drop,'30_DECISIONS/replies/MEME_POOL_R1.json'),'dist/experience/private/meme-pool.json');
fs.copyFileSync(path.join(drop,'60_VIDEO/pointcloud_probe_r1/probe_r3.html'),'dist/experience/private/relief-r3.html');
const vendor=path.join(drop,'60_VIDEO/remotion/node_modules/three');
fs.copyFileSync(path.join(vendor,'build/three.module.js'),'dist/experience/vendor/three.module.js');
if(fs.existsSync(path.join(vendor,'build/three.core.js')))fs.copyFileSync(path.join(vendor,'build/three.core.js'),'dist/experience/vendor/three.core.js');
fs.copyFileSync(path.join(vendor,'examples/jsm/misc/GPUComputationRenderer.js'),'dist/experience/vendor/GPUComputationRenderer.js');
fs.mkdirSync('dist/experience/postprocessing',{recursive:true});
fs.copyFileSync(path.join(vendor,'examples/jsm/postprocessing/Pass.js'),'dist/experience/postprocessing/Pass.js');
fs.copyFileSync(path.join(drop,'30_DECISIONS/replies/BUEHNE_R2/stage/vendor/pet-eye-rig.v6.js'),'dist/experience/vendor/pet-eye-rig.v6.js');
const probe=fs.readFileSync(path.join(drop,'60_VIDEO/pointcloud_probe_r1/probe_r3.html'),'utf8');
const data=probe.slice(probe.indexOf('const dec ='),probe.indexOf('const r = new THREE.WebGLRenderer'));
const physics=probe.slice(probe.indexOf('const gpu ='),probe.indexOf('const scene ='));
fs.writeFileSync('dist/experience/private/relief-r3.js',`import * as THREE from '../vendor/three.module.js';\nimport {GPUComputationRenderer} from '../vendor/GPUComputationRenderer.js';\nexport function createRelief(r){\n${data}\n${physics}\npts.scale.setScalar(.21);pts.rotation.x=.16;pts.position.set(0,-1.3,-4.5);\nreturn {object:pts,update(dt){SU.uDt.value=Math.min(dt,1/30);gpu.compute();SU.uKick.value=0;RU.tPos.value=gpu.getCurrentRenderTarget(posVar).texture;},kick(){SU.uKickPos.value.set(0,1,0);SU.uKick.value=10;},dispose(){g.dispose();mat.dispose();gpu.dispose();}};\n}\n`);
const report={verified:found.size,total:manifest.dateien.length,missing,source:'georg-doc/KFB-Stunt-Car-Race@assets/hypernorm-r1 (029344a)',transport:'individual local source files, SHA-256 matched against repository manifest; no archive'};
fs.writeFileSync('reference/ASSET_VERIFICATION.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
