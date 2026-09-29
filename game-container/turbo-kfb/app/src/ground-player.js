import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWalkController } from './walk-controller.js';

const PIN = '29c7500b39d20945f4f8e73fb02fef91a055b02c';
const ROOT = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/';
const ACTOR = 'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb';
const GENERAL = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb';
const MOVEMENT = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb';
const ADVANCED = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementAdvanced.glb';
const CLIP = Object.freeze({
  idle: 'Idle_A',
  walk: 'Walking_A',
  run: 'Running_A',
  sprint: 'Running_B',
  backward: 'Walking_Backwards',
  strafeLeft: 'Running_Strafe_Left',
  strafeRight: 'Running_Strafe_Right',
  jumpStart: 'Jump_Start',
  jumpAir: 'Jump_Idle',
  jumpLand: 'Jump_Land',
});
const REF_SPEED = Object.freeze({
  Walking_A: 0.610950956910957,
  Running_A: 2.4802741670129,
  // ToolBox semantic profile measured Running_B at +22.1% vs Running_A on the same Rig_Medium family.
  Running_B: 2.4802741670129 * 1.221,
  // Directional ratios come from the verified Rig_Medium semantic consumer profile; exact Turbo
  // freeplay remains the acceptance gate because these clips were not part of the older six-state B2.
  Walking_Backwards: 0.610950956910957 * 1.104,
  Running_Strafe_Left: 2.4802741670129 * 1.0405,
  Running_Strafe_Right: 2.4802741670129 * 1.0555,
});
const LEGACY_WALK_SPEED = 1.08;
const WALK_SPEED = REF_SPEED.Walking_A;
// Georg TUNE 2026-09-29: normal free-travel W must feel materially faster than source cadence.
// This is the existing measured technical handoff ceiling: Walking_A at the 1.8x playback cap.
const TRAVEL_WALK_SPEED = REF_SPEED.Walking_A * 1.8;
const RUN_SPEED = REF_SPEED.Running_A;
const SPRINT_SPEED = REF_SPEED.Running_B;
const HANDOFF_SPEED = 1.108;
const SPRINT_HANDOFF = RUN_SPEED * 1.08;
const RATE_MIN = 0.30;
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
  const query = new URLSearchParams(location.search);
  const feelMode = query.get('groundFeel') === 'velocity' ? 'velocity' : 'direct';
  const enhanced = feelMode === 'velocity';
  const walkPace = enhanced && query.get('walkPace') === 'travel' ? 'travel' : 'measured';
  const baseWalkSpeed = walkPace === 'travel' ? TRAVEL_WALK_SPEED : WALK_SPEED;
  const loads=[
    loader.loadAsync(raw(ACTOR)),
    loader.loadAsync(raw(GENERAL)),
    loader.loadAsync(raw(MOVEMENT)),
  ];
  if (enhanced) loads.push(loader.loadAsync(raw(ADVANCED)));
  const loaded=await Promise.all(loads);
  const [actorGltf,generalGltf,movementGltf]=loaded;
  const advancedGltf=loaded[3]||null;

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
  for(const c of [...(generalGltf.animations||[]),...(movementGltf.animations||[]),...((advancedGltf&&advancedGltf.animations)||[])]) if(!sources.has(c.name)) sources.set(c.name,c);
  const clips={};
  const requiredNames = enhanced ? Object.values(CLIP) : [CLIP.idle,CLIP.walk,CLIP.run,CLIP.jumpStart,CLIP.jumpAir,CLIP.jumpLand];
  for(const name of requiredNames) {
    const src=sources.get(name);
    if(!src) throw new Error('Required Rig_Medium clip missing: '+name);
    clips[name]=controllerOwnedClip(figure,src);
  }

  const feet=findFeet(figure);
  const contacts={};
  const cyclicNames = enhanced
    ? [CLIP.walk,CLIP.run,CLIP.sprint,CLIP.backward,CLIP.strafeLeft,CLIP.strafeRight]
    : [CLIP.walk,CLIP.run];
  for (const name of cyclicNames) contacts[name]=measurePrimaryContact(figure,clips[name],feet.left,actorHeight);

  const mixer=new THREE.AnimationMixer(figure);
  let current=null,currentName=null,currentSemantic='idle',landTimer=0,jumpStartTimer=0;
  function rateFor(name,speed) {
    const ref=REF_SPEED[name];
    const min=enhanced?RATE_MIN:.45;
    return ref ? clamp(Math.max(0.001,speed)/ref,min,RATE_MAX) : 1;
  }
  function transition(name, semantic, { sync=false, speed=0, fade=FADE }={}) {
    if(currentName===name) {
      if(REF_SPEED[name]) current.setEffectiveTimeScale(rateFor(name,speed));
      currentSemantic=semantic;
      return;
    }
    const target=mixer.clipAction(clips[name],figure);
    target.enabled=true;
    const oneShot=name===CLIP.jumpStart||name===CLIP.jumpLand;
    target.setLoop(oneShot?THREE.LoopOnce:THREE.LoopRepeat,oneShot?1:Infinity);
    target.clampWhenFinished=oneShot;
    target.setEffectiveWeight(1);
    target.setEffectiveTimeScale(REF_SPEED[name]?rateFor(name,speed):1);
    target.reset();
    if(sync && current && cyclicNames.includes(currentName) && cyclicNames.includes(name)) {
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
  if (enhanced) {
    const jumpApex=actorHeight*.52;
    const jumpAirTime=.78;
    const gravity=8*jumpApex/(jumpAirTime*jumpAirTime);
    const jumpV=4*jumpApex/jumpAirTime;
    walk.setParams({
      feelMode:'velocity',
      speed:baseWalkSpeed,
      sprintMul:SPRINT_SPEED/baseWalkSpeed,
      acceleration:7.5,
      deceleration:11,
      directionResponse:13,
      gravity,
      jumpV,
      stepMax:actorHeight*.22,
      autoJumpMax:actorHeight*.48,
      hopClear:actorHeight*.08,
      bounceMax:0,
      bounce:0,
    });
  } else {
    walk.setParams({speed:LEGACY_WALK_SPEED,sprintMul:RUN_SPEED/LEGACY_WALK_SPEED,feelMode:'direct'});
  }
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

  function configureEnhancedSpeed(cmd) {
    if (!enhanced) return;
    const side=Math.abs(cmd.strafe), fwd=Math.abs(cmd.forward);
    if (cmd.forward < -.2 && fwd >= side) {
      walk.setParams({speed:REF_SPEED[CLIP.backward],sprintMul:1});
    } else if (side > .2 && side > fwd) {
      const base=1.25;
      walk.setParams({speed:base,sprintMul:cmd.sprint?SPRINT_SPEED/base:1});
    } else {
      walk.setParams({speed:baseWalkSpeed,sprintMul:SPRINT_SPEED/baseWalkSpeed});
    }
  }

  function enhancedLocomotion(cmd,st) {
    const side=Math.abs(cmd.strafe), fwd=Math.abs(cmd.forward);
    if (cmd.forward < -.2 && fwd >= side) return {name:CLIP.backward,semantic:'backward'};
    if (side > .2 && side > fwd) return {
      name:cmd.strafe < 0 ? CLIP.strafeLeft : CLIP.strafeRight,
      semantic:cmd.strafe < 0 ? 'strafe.left' : 'strafe.right',
    };
    if (cmd.sprint) {
      if (st.speed < HANDOFF_SPEED) return {name:CLIP.walk,semantic:'walk.fast'};
      if (st.speed < SPRINT_HANDOFF) return {name:CLIP.run,semantic:'run'};
      return {name:CLIP.sprint,semantic:'sprint'};
    }
    return {name:CLIP.walk,semantic:'walk'};
  }

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
      configureEnhancedSpeed(cmd);
      if(cmd.jump && walk.state.onGround) {
        walk.jump();
        jumpStartTimer=enhanced?0.30:0.24;
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
        landTimer=enhanced?(st.moving?0.12:0.22):0.26;
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
        if (enhanced) {
          const role=enhancedLocomotion(cmd,st);
          transition(role.name,role.semantic,{sync:true,speed:st.speed});
        } else {
          const run=st.sprinting;
          transition(run?CLIP.run:CLIP.walk,run?'run':'walk',{sync:true,speed:st.speed});
        }
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
        clips:requiredNames,
        contacts,
        feelMode,
        enhanced,
        walkPace,
        walkSpeed:enhanced?baseWalkSpeed:LEGACY_WALK_SPEED,
        walkPlaybackRate:enhanced?rateFor(CLIP.walk,baseWalkSpeed):null,
        runSpeed:RUN_SPEED,
        sprintSpeed:enhanced?SPRINT_SPEED:null,
        jump:enhanced?{
          gravity:walk.params.gravity,
          jumpV:walk.params.jumpV,
          apex:(walk.params.jumpV*walk.params.jumpV)/(2*walk.params.gravity),
          nominalAirTime:2*walk.params.jumpV/walk.params.gravity,
        }:null,
        currentAnimation:currentName,
        semantic:currentSemantic,
        position:{x:st.position.x,y:st.position.y,z:st.position.z},
        speed:st.speed,
        onGround:st.onGround,
        sprinting:st.sprinting,
        desiredSpeed:st.desiredSpeed,
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
