import * as THREE from 'https://unpkg.com/three@0.181.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.181.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#app');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#9fc2bd');
scene.fog = new THREE.Fog('#9fc2bd', 12, 32);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, .1, 100);
camera.position.set(8.2, 6.1, 9.5);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1.2, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 18;
controls.maxPolarAngle = Math.PI * .46;

const hemi = new THREE.HemisphereLight('#fff0cf', '#59676e', 2.1);
scene.add(hemi);
const key = new THREE.DirectionalLight('#ffe2b3', 3.25);
key.position.set(-5, 8, 5); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -10; key.shadow.camera.right = 10; key.shadow.camera.top = 10; key.shadow.camera.bottom = -10;
scene.add(key);
const rim = new THREE.DirectionalLight('#b9c8ff', 1.4); rim.position.set(5, 4, -7); scene.add(rim);

const palette = ['#ee8a73','#eca86f','#f3cf68','#87b996','#75a5bd','#9c84c7','#d58bad','#b56f55'];
let activeColor = palette[0];
let relief = .035;
let micro = .55;
const clayMeshes = [];

function hash3(p) { return `
float hash31(vec3 p){ p=fract(p*.1031); p+=dot(p,p.yzx+33.33); return fract((p.x+p.y)*p.z); }
float valueNoise(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(mix(hash31(i+vec3(0,0,0)),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z); }
`}

function clayMaterial(color, seed = Math.random() * 30) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: .91, metalness: 0, flatShading: false });
  mat.userData.clay = { seed, relief: () => relief, micro: () => micro };
  mat.onBeforeCompile = shader => {
    shader.uniforms.uClaySeed = { value: seed };
    shader.uniforms.uClayRelief = { value: relief };
    shader.uniforms.uClayMicro = { value: micro };
    mat.userData.shader = shader;
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\nuniform float uClaySeed; uniform float uClayRelief; varying vec3 vClayWorld;\n${hash3()}`);
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\nvec3 clayP = position * 1.35 + vec3(uClaySeed);\nfloat broad = valueNoise(clayP * 0.72) - .5;\nfloat medium = valueNoise(clayP * 2.7 + 4.1) - .5;\ntransformed += normal * (broad * uClayRelief + medium * uClayRelief * .38);\nvClayWorld = (modelMatrix * vec4(transformed,1.0)).xyz;`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\nuniform float uClaySeed; uniform float uClayMicro; varying vec3 vClayWorld;\n${hash3()}`);
    shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', `vec4 diffuseColor = vec4( diffuse, opacity );\nvec3 p = vClayWorld * 1.2 + vec3(uClaySeed);\nfloat charge = valueNoise(p * .42) - .5;\nfloat grain = valueNoise(p * 11.0) - .5;\ndiffuseColor.rgb *= 1.0 + charge * .13 + grain * .035 * uClayMicro;`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + (valueNoise(vClayWorld*15.0+uClaySeed)-.5)*.13*uClayMicro, .58, 1.0);`);
  };
  return mat;
}

function addClay(geometry, color, pos, rot = [0,0,0], scale = [1,1,1], seed) {
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, clayMaterial(color, seed));
  mesh.position.fromArray(pos); mesh.rotation.set(...rot); mesh.scale.fromArray(scale);
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh); clayMeshes.push(mesh); return mesh;
}

// Boden: breite, weiche Knetplatte
const ground = addClay(new THREE.CylinderGeometry(7.2, 7.45, .55, 64, 6, false), '#a67d63', [0,-.38,0], [0,.06,0], [1,1,1], 2.1);
// Hügel
addClay(new THREE.SphereGeometry(1.75, 42, 28), '#75a5bd', [-3.4, .63, -1.7], [0,.2,0], [1.35,.62,1], 9.2);
addClay(new THREE.SphereGeometry(1.45, 42, 28), '#87b996', [3.2, .46, -2.1], [.1,-.2,0], [1.6,.52,1.1], 12.8);
// Hauskörper / Fenster / Dach
addClay(new THREE.BoxGeometry(2.1, 1.8, 1.85, 7, 7, 7), '#ee8a73', [0,1.0,-.3], [0,.1,0], [1,1,1], 5.1);
addClay(new THREE.SphereGeometry(1.45, 42, 24), '#f3cf68', [0,2.03,-.3], [0,0,0], [1.0,.35,.82], 16.3);
addClay(new THREE.SphereGeometry(.39, 28, 20), '#49394e', [0,1.02,.68], [0,0,0], [1,.92,.24], 21.1);
addClay(new THREE.SphereGeometry(.28, 24, 18), '#fff0cb', [-.66,1.35,.63], [0,0,0], [1,.8,.18], 25.7);
addClay(new THREE.SphereGeometry(.28, 24, 18), '#fff0cb', [.66,1.35,.63], [0,0,0], [1,.8,.18], 26.7);
// Baum: Stamm + gestapelte Kronen
addClay(new THREE.CylinderGeometry(.24,.34,2.15,22,5), '#b56f55', [-2.75,1.0,1.5], [.05,0,.08], [1,1,1], 4.2);
addClay(new THREE.SphereGeometry(.95,32,24), '#87b996', [-2.75,2.2,1.5], [0,0,0], [1.15,.88,.98], 7.9);
addClay(new THREE.SphereGeometry(.7,32,22), '#87b996', [-2.34,2.72,1.38], [0,0,0], [1.1,.83,.95], 8.5);
// kleine Knet-Kugeln / Steine
for (let i=0;i<8;i++) { const a=i/8*Math.PI*2+.22; const r=4.8+(i%2)*.45; addClay(new THREE.IcosahedronGeometry(.23+(i%3)*.05, 3), palette[(i+2)%palette.length], [Math.cos(a)*r,.02,Math.sin(a)*r], [Math.random(),Math.random(),Math.random()], [1.3,.68,1], 31+i); }

function updateClayUniforms(){ for(const mesh of clayMeshes){ const shader=mesh.material.userData.shader; if(shader){ shader.uniforms.uClayRelief.value=relief; shader.uniforms.uClayMicro.value=micro; } } }
function recolor(){ for (const mesh of clayMeshes) { if (mesh === ground) continue; const hsl = {}; new THREE.Color(activeColor).getHSL(hsl); const jitter = (Math.random()-.5)*.12; mesh.material.color.setHSL((hsl.h+jitter+1)%1, Math.min(1,hsl.s*(.86+Math.random()*.18)), Math.min(1,hsl.l*(.84+Math.random()*.2))); } }

const swatches = document.querySelector('#swatches');
palette.forEach((hex, i) => { const b=document.createElement('button'); b.className='swatch'+(!i?' active':''); b.style.background=hex; b.title=hex; b.onclick=()=>{ activeColor=hex; document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('active')); b.classList.add('active'); recolor(); }; swatches.append(b); });
const reliefInput=document.querySelector('#relief'), microInput=document.querySelector('#micro');
reliefInput.oninput=e=>{ relief=+e.target.value; document.querySelector('#reliefOut').textContent=relief.toFixed(3); updateClayUniforms(); };
microInput.oninput=e=>{ micro=+e.target.value; document.querySelector('#microOut').textContent=micro.toFixed(2); updateClayUniforms(); };
document.querySelector('#randomize').onclick=()=>{ clayMeshes.forEach(m=>{ if(m.material.userData.shader){ const s=m.material.userData.shader.uniforms.uClaySeed; s.value=Math.random()*100; } }); recolor(); };
function toggle(id, button){ const el=document.querySelector(id); const open=el.classList.toggle('visible'); button.setAttribute('aria-expanded',open); }
document.querySelector('#paletteButton').onclick=e=>toggle('#palette', e.currentTarget);
document.querySelector('#infoButton').onclick=e=>toggle('#info', e.currentTarget);

addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });
const clock=new THREE.Clock();
function tick(){ const t=clock.getElapsedTime(); clayMeshes.forEach((m,i)=>{ if(i>0 && i<10) m.rotation.z += Math.sin(t*.65+i)*.00025; }); controls.update(); renderer.render(scene,camera); requestAnimationFrame(tick); }
requestAnimationFrame(tick);
setTimeout(()=>document.querySelector('#loading').classList.add('done'), 450);
