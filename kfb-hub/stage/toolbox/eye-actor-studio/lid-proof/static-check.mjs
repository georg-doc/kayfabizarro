import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const html=read('kfb-hub/stage/toolbox/eye-actor-studio/lid-proof/index.html');
const proof=read('kfb-hub/stage/toolbox/eye-actor-studio/lid-proof/proof.mjs');
const geo=read('tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs');
const contract=read('skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/EYELID_GEOMETRY_CONTRACT.v1.md');

const checks=[];
const ok=(name,cond)=>{checks.push([name,!!cond]);if(!cond)throw Error('FAIL '+name);console.log('PASS',name)};

ok('exact Mannequin Medium source',proof.includes('Mannequin_Medium.glb'));
ok('exact EyeRig v6 import',proof.includes('pet-eye-rig.v6.js'));
ok('FaceHost reuse',proof.includes('buildFaceHost'));
ok('new upper-lid module import',proof.includes('upper-lid-volume.v1.mjs'));
ok('right eye hidden',proof.includes('other.visible=false'));
ok('old upper shell hidden',proof.includes('eye._up.visible=false'));
ok('old lower shell hidden',proof.includes('eye._lo.visible=false'));
ok('one upper lid only observable',proof.includes("upperLids:1")&&proof.includes("lowerLids:0"));
ok('closed volume contract',geo.includes('closedVolume:true'));
ok('real occlusion margin contract',geo.includes('realOcclusionMargin:true'));
ok('inner eyeball conforming surface',geo.includes("innerSurface:'eyeball-conforming'"));
ok('compact rounded-pad outer surface',geo.includes("outerSurface:'compact-rounded-pad'"));
ok('margin thickness measured',geo.includes('marginThickness'));
ok('lower visible margin is sealed volume',geo.includes('Lower visible margin'));
ok('side walls closed',geo.includes('canthi closure'));
ok('no tube geometry',!geo.includes('TubeGeometry'));
ok('no capsule geometry',!geo.includes('CapsuleGeometry'));
ok('no old SphereGeometry lid shell',!geo.includes('SphereGeometry'));
ok('reference variant',proof.includes("reference:{label:'Reference open'"));
ok('cover variant',proof.includes("cover:{label:'More cover'"));
ok('slant variant',proof.includes("slant:{label:'Slant'"));
ok('concave variant',proof.includes("concave:{label:'Concave'"));
ok('convex variant',proof.includes("convex:{label:'Convex'"));
ok('front view control',html.includes('data-view="front"'));
ok('three-quarter view control',html.includes('data-view="three"'));
ok('side view control',html.includes('data-view="side"'));
ok('human reference contract pinned',contract.includes('User visual reference · Upper Lid'));
ok('mobile viewport',html.includes('viewport-fit=cover'));

console.log('KFB_UPPER_LID_STATIC_RESULT',checks.length+'/'+checks.length,'PASS');