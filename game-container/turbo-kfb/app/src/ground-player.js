import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWalkController } from './walk-controller.js';

const PIN = '29c7500b39d20945f4f8e73fb02fef91a055b02c';
const ROOT = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/';
const ACTOR = 'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb';
const GENERAL = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb';
const MOVEMENT = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb';
const CLIP = Object.freeze({
  idle: 'Idle_A',
  walk: 'Walking_A',
  run: 'Running_A',
  jumpStart: 'Jump_Start',
  jumpAir: 'Jump_Idle',
  jumpLand: 'Jump_Land',
});
const REF_SPEED = Object.freeze({
  Walking_A: 0.610950956910957,
  Running_A: 2.4802741670129,
});
const WALK_SPEED = 1.08;
const RUN_SPEED = REF_SPEED.Running_A;
const RATE_MIN = 0.45;
const RATE_MAX = 1.8;
const FADE = 0.12;
const ROOT_MOTION = /^(root|hips)$/i;
const FOOT_RE = /foot/i;
const FOOT_EXCLUDE = /target|pole|ik/i;
const wrap01 = (v) => { v %= 1; return v < 0 ? v + 1 : v; };
const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
const raw = (p) => ROOT + p.split('/').map(encodeURIComponent).join('/');

function trackInfo(track) {
  try { return THREE.PropertyBinding.parseTrackName(track.name); } catch { return null; }
}
function nodeNames(root) {
  const out = new Set();
  root.traverse((n) => { if (n.name) out.add(n.name); });
  return out;
}
function controllerOwnedClip(root, clip) {
  const names = nodeNames(root), tracks = [];
  for (const source of clip.tracks || []) {
    const p = trackInfo(source);
    if (!p || !p.nodeName || !names.has(p.nodeName)) continue;
    if (p.propertyName === 'position' && ROOT_MOTION.test(p.nodeName)) continue;
    tracks.push(source.clone());
  }
  return new THREE.AnimationClip(clip.name, clip.duration, tracks, clip.blendMode);
}
function findFeet(root) {
  const found = [];
  root.traverse((n) => {
    if (n.name && FOOT_RE.test(n.name) && !FOOT_EXCLUDE.test(n.name)) found.push(n);
  });
  const left = found.find((n) => /\.l$|left/i.test(n.name)) || found.slice().sort((a,b)=>a.position.x-b.position.x)[0] || null;
  const right = found.find((n) => /\.r$|right/i.test(n.name)) || found.find((n)=>n!==left) || null;
  return { left, right };
}
function snapshotTransforms(root) {
  const rows = [];
  root.traverse((n) => rows.push({ n, p:n.position.clone(), q:n.quaternion.clone(), s:n.scale.clone() }));
  return () => {
    for (const r of rows) { r.n.position.copy(r.p); r.n.quaternion.copy(r.q); r.n.scale.copy(r.s); }
    root.updateMatrixWorld(true);
  };
}
function intervals(mask) {
  const out=[]; let start=-1;
  for (let i=0;i<mask.length;i++) {
    if (mask[i] && start < 0) start=i;
    if ((!mask[i] || i===mask.length-1) && start>=0) {
      const end=mask[i]?i:i-1;
      if (end-start>=2) out.push([start,end]);
      start=-1;
    }
  }
  return out;
}
function phaseDistance(a,b) {
  const d=Math.abs(wrap01(a)-wrap01(b));
  return Math.min(d,1-d);
}
function measurePrimaryContact(root, clip, foot, actorHeight) {
  if (!foot) return 0;
  const restore=snapshotTransforms(root);
  const mixer=new THREE.AnimationMixer(root);
  const action=mixer.clipAction(clip,root);
  const N=120, points=[], inv=new THREE.Matrix4(), world=new THREE.Vector3(), local=new THREE.Vector3();
  try {
    action.reset().play();
    for (let i=0;i<=N;i++) {
      const phase=i/N;
      mixer.setTime(clip.duration*phase);
      root.updateMatrixWorld(true);
      inv.copy(root.matrixWorld).invert();
      foot.getWorldPosition(world);
      local.copy(world).applyMatrix4(inv);
      points.push({phase,y:local.y});
    }
  } finally {
    mixer.stopAllAction();
    try { mixer.uncacheClip(clip); } catch {}
    restore();
  }
  const ys=points.map((p)=>p.y), minY=Math.min(...ys), maxY=Math.max(...ys);
  const threshold=minY+Math.max(actorHeight*0.012,(maxY-minY)*0.22);
  const spans=intervals(points.map((p)=>p.y<=threshold));
  const contacts=spans.map(([a,b])=>{
    let best=a;
    for(let i=a+1;i<=b;i++) if(points[i].y<points[best].y) best=i;
    return points[best].phase;
  });
  if (!contacts.length) return 0;
  return contacts.slice().sort((a,b)=>phaseDistance(a,0.25)-phaseDistance(b,0.25))[0];
}

class GroundInput {
  constructor() {
    this.keys=new Set();
    this.jumpQueued=false;
    this.active=true;
    this.down=(e)=>{
      if(!this.active) return;
      if(['KeyW','KeyS','KeyA','KeyD','KeyQ','KeyE','ShiftLeft','ShiftRight','Space'].includes(e.code)) {
        if(e.code==='Space' && !e.repeat) this.jumpQueued=true;
        this.keys.add(e.code);
        if(e.code==='Space') e.preventDefault();
      }
    };
    this.up=(e)=>this.keys.delete(e.code);
    this.blur=()=>this.keys.clear();
    addEventListener('keydown',this.down);
    addEventListener('keyup',this.up);
    addEventListener('blur',this.blur);
  }
  sample() {
    const k=this.keys;
    return {
      forward:Number(k.has('KeyW'))-Number(k.has('KeyS')),
      turn:Number(k.has('KeyA'))-Number(k.has('KeyD')),
      strafe:Number(k.has('KeyE'))-Number(k.has('KeyQ')),
      sprint:k.has('ShiftLeft')||k.has('ShiftRight'),
      jump:this.consumeJump(),
    };
  }
  consumeJump(){const v=this.jumpQueued;this.jumpQueued=false;return v;}
  dispose(){removeEventListener('keydown',this.down);removeEventListener('keyup',this.up);removeEventListener('blur',this.blur);this.keys.clear();}
}

export async function createGroundPlayer({ scene, track } = {}) {
  if (!scene || !track) throw new Error('GroundPlayer requires scene + track');
  const loader=new GLTFLoader();
  const [actorGltf,generalGltf,movementGltf]=await Promise.all([
    loader.loadAsync(raw(ACTOR)),
    loader.loadAsync(raw(GENERAL)),
    loader.loadAsync(raw(MOVEMENT)),
  ]);

  const object3D=new THREE.Group();
  object3D.name='KFB Ground Player';
  const visual=new THREE.Group();
  visual.name='KFB Ground Player Visual';
  object3D.add(visual);
  scene.add(object3D);

  const figure=actorGltf.scene;
  visual.add(figure);
  figure.traverse((n)=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});
  object3D.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(figure);
  const actorHeight=box.getSize(new THREE.Vector3()).y;
  if(Number.isFinite(box.min.y)) figure.position.y-=box.min.y;
  object3D.updateMatrixWorld(true);

  const sources=new Map();
  for(const c of [...(generalGltf.animations||[]),...(movementGltf.animations||[])]) if(!sources.has(c.name)) sources.set(c.name,c);
  const clips={};
  for(const name of Object.values(CLIP)) {
    const src=sources.get(name);
    if(!src) throw new Error('Required Rig_Medium clip missing: '+name);
    clips[name]=controllerOwnedClip(figure,src);
  }

  const feet=findFeet(figure);
  const contacts={
    [CLIP.walk]:measurePrimaryContact(figure,clips[CLIP.walk],feet.left,actorHeight),
    [CLIP.run]:measurePrimaryContact(figure,clips[CLIP.run],feet.left,actorHeight),
  };

  const mixer=new THREE.AnimationMixer(figure);
  let current=null,currentName=null,currentSemantic='idle',landTimer=0,jumpStartTimer=0;
  function rateFor(name,speed) {
    const ref=REF_SPEED[name];
    return ref ? clamp(Math.max(0.001,speed)/ref,RATE_MIN,RATE_MAX) : 1;
  }
  function transition(name, semantic, { sync=false, speed=0, fade=FADE }={}) {
    if(currentName===name) {
      if(REF_SPEED[name]) current.setEffectiveTimeScale(rateFor(name,speed));
      currentSemantic=semantic;
      return;
    }
    const target=mixer.clipAction(clips[name],figure);
    target.enabled=true;
    target.setLoop(name===CLIP.jumpStart||name===CLIP.jumpLand?THREE.LoopOnce:THREE.LoopRepeat, name===CLIP.jumpStart||name===CLIP.jumpLand?1:Infinity);
    target.clampWhenFinished=name===CLIP.jumpStart||name===CLIP.jumpLand;
    target.setEffectiveWeight(1);
    target.setEffectiveTimeScale(REF_SPEED[name]?rateFor(name,speed):1);
    target.reset();
    if(sync && current && (currentName===CLIP.walk||currentName===CLIP.run) && (name===CLIP.walk||name===CLIP.run)) {
      const srcClip=clips[currentName], dstClip=clips[name];
      const srcPhase=wrap01(current.time/Math.max(0.001,srcClip.duration));
      const srcContact=contacts[currentName]||0;
      const dstContact=contacts[name]||0;
      target.time=dstClip.duration*wrap01(dstContact+(srcPhase-srcContact));
    }
    target.play();
    if(current) current.crossFadeTo(target,fade,true);
    current=target;currentName=name;currentSemantic=semantic;
  }

  const walk=createWalkController({THREE});
  walk.setParams({speed:WALK_SPEED,sprintMul:RUN_SPEED/WALK_SPEED});
  const start=track.startPositions?.[0] || {position:new THREE.Vector3(),heading:0};
  const samplePos=new THREE.Vector3();
  const groundHeightAt=(x,z)=>{
    samplePos.set(x,0,z);
    return track.getSurfaceInfo(samplePos).height;
  };
  const startY=groundHeightAt(start.position.x,start.position.z);
  walk.reset(start.position.x,start.position.z,startY,start.heading||0);

  const input=new GroundInput();
  const velocity=new THREE.Vector3(), prev=new THREE.Vector3();
  const groundNormal=new THREE.Vector3(0,1,0);
  let previousOnGround=true;
  transition(CLIP.idle,'idle',{fade:0});

  const api={
    object3D,
    position:object3D.position,
    velocity,
    groundNormal,
    speed:0,
    heading:start.heading||0,
    airborne:false,
    drifting:false,
    driftDir:0,
    boostTimer:0,
    starTimer:0,
    spinTimer:0,
    steerSmoothed:0,
    input:{steer:0},
    currentAnimation:'Idle_A',
    currentSemantic:'idle',
    ready:true,
    update(dt) {
      dt=clamp(Number(dt)||1/60,0.001,0.1);
      const cmd=input.sample();
      if(cmd.jump && walk.state.onGround) {
        walk.jump();
        jumpStartTimer=0.24;
        transition(CLIP.jumpStart,'jumpStart',{fade:0.08});
      }
      walk.setInput(cmd.strafe,cmd.forward);
      walk.update(dt,{turn:cmd.turn,sprint:cmd.sprint},groundHeightAt);
      let st=walk.state;

      if(st.onGround) {
        const hit=track.resolveWall(st.position,0.55);
        if(hit) {
          st.position.addScaledVector(hit.normal,hit.depth+0.01);
          walk.lift(groundHeightAt(st.position.x,st.position.z));
          st=walk.state;
        }
      }
      samplePos.set(st.position.x,st.position.y,st.position.z);
      const surface=track.getSurfaceInfo(samplePos);
      groundNormal.copy(surface.normal||groundNormal);

      prev.copy(object3D.position);
      object3D.position.copy(st.position);
      object3D.rotation.y=st.heading;
      velocity.copy(object3D.position).sub(prev).multiplyScalar(1/dt);
      api.speed=st.speed;
      api.heading=st.heading;
      api.airborne=!st.onGround;
      api.steerSmoothed=cmd.turn;
      api.input.steer=cmd.turn;

      if(previousOnGround && !st.onGround && jumpStartTimer<=0.02) {
        transition(CLIP.jumpAir,'jumpAir',{fade:0.08});
      }
      if(!previousOnGround && st.onGround) {
        landTimer=0.26;
        transition(CLIP.jumpLand,'jumpLand',{fade:0.08});
      }

      if(jumpStartTimer>0) {
        jumpStartTimer=Math.max(0,jumpStartTimer-dt);
        if(!st.onGround && jumpStartTimer<=0) transition(CLIP.jumpAir,'jumpAir',{fade:0.08});
      } else if(!st.onGround) {
        transition(CLIP.jumpAir,'jumpAir',{fade:0.08});
      } else if(landTimer>0) {
        landTimer=Math.max(0,landTimer-dt);
      } else if(st.moving) {
        const run=st.sprinting;
        transition(run?CLIP.run:CLIP.walk,run?'run':'walk',{sync:true,speed:st.speed});
      } else {
        transition(CLIP.idle,'idle',{fade:0.12});
      }

      if(current && REF_SPEED[currentName]) current.setEffectiveTimeScale(rateFor(currentName,st.speed));
      mixer.update(dt);
      previousOnGround=st.onGround;
      api.currentAnimation=currentName;
      api.currentSemantic=currentSemantic;
    },
    dispose() {
      input.dispose();
      mixer.stopAllAction();
      scene.remove(object3D);
    },
    report() {
      const st=walk.state;
      return {
        sourcePin:PIN,
        actor:'ActionFigure · Rig_Medium',
        actorHeight,
        clips:Object.values(CLIP),
        contacts,
        walkSpeed:WALK_SPEED,
        runSpeed:RUN_SPEED,
        currentAnimation:currentName,
        semantic:currentSemantic,
        position:{x:st.position.x,y:st.position.y,z:st.position.z},
        speed:st.speed,
        onGround:st.onGround,
        sprinting:st.sprinting,
        rootMotionWorldTranslation:false,
      };
    },
  };
  object3D.position.copy(walk.state.position);
  object3D.rotation.y=walk.state.heading;
  samplePos.copy(object3D.position);
  groundNormal.copy(track.getSurfaceInfo(samplePos).normal);
  return api;
}
