import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const idx=read('kfb-hub/stage/toolbox/eye-actor-studio/index.html');
const app=read('kfb-hub/stage/toolbox/eye-actor-studio/app.mjs');
const cluster=read('tools/KFB-ToolBox/eye-actor-studio-v1/eye-cluster.v1.mjs');
const clay=read('tools/KFB-ToolBox/eye-actor-studio-v1/clay-lid.v1.mjs');
const hosts=read('tools/KFB-ToolBox/eye-actor-studio-v1/host-catalog.v1.mjs');
const runtime=read('tools/KFB-ToolBox/eye-actor-studio-v1/host-runtime.v1.mjs');
const staticHost=read('tools/KFB-ToolBox/eye-actor-studio-v1/static-facehost.v1.mjs');
const ears=read('tools/KFB-ToolBox/eye-actor-studio-v1/rabbit-ears-style.v1.mjs');
const style=read('skills/KFB_3D_CartoonStyle_v1.html');
const checks=[];const ok=(n,c)=>{checks.push([n,!!c]);if(!c)throw Error('FAIL '+n);console.log('PASS',n)};

ok('imports exact EyeRig v6',app.includes('pet-eye-rig.v6.js'));
ok('imports exact BrowRig v2',app.includes('brow-rig.v2.js'));
ok('imports exact EyeOval v1',app.includes('eyeoval.v1.js'));
ok('imports GLTFLoader',app.includes('GLTFLoader'));
ok('imports source host catalog',app.includes('loadHostCatalog'));
ok('imports source host runtime',app.includes('HostRuntime'));
ok('source mode default',idx.includes('<option value="source" selected>'));

ok('Eye Cluster schema',cluster.includes('kfb.eye-cluster/0.1-candidate'));
ok('count clamps 1-4',cluster.includes('clamp(Math.round(n),1,4)'));
ok('pair asymmetric preset',cluster.includes("'pair-asymmetric'"));
ok('frog side preset',cluster.includes("'pair-frog-side'"));
ok('single eye preset',cluster.includes("'single-eye'"));
ok('three eye preset',cluster.includes("'three-eye'"));
ok('four eye preset',cluster.includes("'four-eye'"));
ok('per-eye euler',cluster.includes('eulerDeg'));
ok('per-eye quaternion export',cluster.includes('quaternion'));
ok('per-eye size',cluster.includes('size'));
ok('per-eye W/H/D',cluster.includes('shape'));
ok('Clay lid hard rim',clay.includes('hardInnerRim:true'));
ok('scope selected',cluster.includes("scope==='selected'"));
ok('scope primary',cluster.includes("scope==='primary'"));

ok('PrototypePete default host',hosts.includes("id:'legacy-prototype-pete'")&&hosts.includes('default:true'));
ok('placeholder retained',hosts.includes("id:'lab-placeholder'"));
ok('Mannequin Medium host',hosts.includes('Mannequin_Medium.glb'));
ok('Mannequin Large host',hosts.includes('Mannequin_Large.glb'));
ok('Legacy skeleton host',hosts.includes('character_skeleton_warrior.gltf'));
ok('Legacy pumpkin Jack host',hosts.includes('character_jack.gltf'));
ok('Legacy Orc host',hosts.includes('character_orcA.gltf'));
ok('Pencil host',hosts.includes('pencil_B_short.gltf'));
ok('Eraser host',hosts.includes('Eraser by Poly by Google'));
ok('Medium owner catalog reused',hosts.includes('rig-medium-actors.v0.json'));
ok('Large owner catalog reused',hosts.includes('rig-large-reviewed.v1.json'));
ok('Legacy Dungeon owner catalog reused',hosts.includes('legacy-rpg-rigging/data/catalog.v1.json'));

ok('modern FaceHost owner reused',runtime.includes('buildFaceHost'));
ok('Legacy assembly owner reused',runtime.includes('assembleLegacy'));
ok('Legacy FaceHost owner reused',runtime.includes('buildLegacyFaceHost'));
ok('Legacy head replacement owner reused',runtime.includes('replaceHead'));
ok('static prop FaceHost isolated adapter',staticHost.includes('kfb.static-facehost/0.1-candidate'));
ok('Rabbit ears reuse ears.v2 owner',ears.includes("from '../kfb-rigs-embed-v3/frizzlegraft-v1/ears.v2.js'"));
ok('Rabbit ears smooth donor geometry',ears.includes('mergeVertices')&&ears.includes('smoothGeometry'));
ok('Rabbit ears use Main and Main_Light donor zones',ears.includes("m.name==='Main'||m.name==='Main_Light'"));
ok('Rabbit ears separate inner zone',ears.includes("kfb-inner-ear-zone"));
ok('Rabbit ears preserve dangle update',ears.includes('update:dt=>base.update(dt)'));
ok('Studio exposes ear donor A/B',idx.includes('id="earsMode"')&&app.includes('buildCartoonEars'));

ok('mobile viewport',idx.includes('viewport-fit=cover'));
ok('mobile CSS',idx.includes('@media(max-width:820px)'));
ok('published debug object',app.includes('__KFB_EYE_ACTOR_STUDIO_V1__'));

ok('CartoonStyle hidden LLM brief',style.includes('id="kfb-llm-briefing"'));
ok('CartoonStyle exact toaster donor',style.includes('Tiny_Treats_Charming_Kitchen_1.1_FREE/Assets/gltf/toaster.gltf'));
ok('CartoonStyle DO DONT samples',style.includes('DO · rounded panel')&&style.includes("DON'T · hard panel"));
ok('CartoonStyle WSA instruction',style.includes('WSA'));

console.log('KFB_EAS1_STATIC_RESULT',checks.length+'/'+checks.length,'PASS');
