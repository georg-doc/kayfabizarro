import { buildFaceHost } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js';
import { EyeRig } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';
import { attach as attachEyeOval, applyOval as applyEyeOval, detach as detachEyeOval, DEFAULTS as EYE_OVAL_DEFAULTS } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@ed59390ce105e0e47a5ecdcc2b87bc91222f54cb/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/eyeoval.v1.js';

export const ADAPTER_SCHEMA = 'kfb.kaykit-eye-adapter/0.1-candidate';

function clone(v) { return JSON.parse(JSON.stringify(v)); }
function colorHex(THREE, value) {
  try { return '#' + new THREE.Color(value).getHexString(); } catch { return null; }
}
const finite = (v) => Number.isFinite(+v);
const SEAT_BASE = 0.24, SEAT_GAIN = 1.15;

export function compensateInsetForRing(oldRing, oldInset, newRing) {
  oldRing=+oldRing; oldInset=+oldInset; newRing=+newRing;
  if(!finite(oldRing)||!finite(oldInset)||!finite(newRing)||oldRing<=0||newRing<=0) return oldInset;
  const oldSeat=oldRing*(SEAT_BASE+oldInset*SEAT_GAIN);
  return (oldSeat/newRing-SEAT_BASE)/SEAT_GAIN;
}

export function deriveSourceAnchorSeed({ THREE, figure, faceHost, anchors } = {}) {
  const body=faceHost?.box;
  if(!THREE||!figure||!body||!anchors?.l?.pos||!anchors?.r?.pos) return {status:'UNSUPPORTED',reason:'source anchors / FaceHost missing'};
  figure.updateMatrixWorld(true); faceHost.inner?.updateMatrixWorld?.(true); body.updateMatrixWorld(true);
  if(!body.geometry.boundingBox) body.geometry.computeBoundingBox();
  const size=body.geometry.boundingBox.getSize(new THREE.Vector3());
  const U=size.y/2;
  if(!(U>1e-6)) return {status:'UNSUPPORTED',reason:'FaceHost unit invalid'};

  const rootToBody=(pos)=>{
    const p=new THREE.Vector3(...pos);
    figure.localToWorld(p);
    return body.worldToLocal(p);
  };
  const radiusToBody=(a)=>{
    if(!finite(a?.r)) return null;
    const p0=new THREE.Vector3(...a.pos), p1=new THREE.Vector3(a.pos[0]+(+a.r),a.pos[1],a.pos[2]);
    figure.localToWorld(p0); figure.localToWorld(p1);
    body.worldToLocal(p0); body.worldToLocal(p1);
    return p0.distanceTo(p1);
  };
  const L=rootToBody(anchors.l.pos), R=rootToBody(anchors.r.pos);
  const lr=radiusToBody(anchors.l), rr=radiusToBody(anchors.r);
  if(!(lr>0)||!(rr>0)) return {status:'UNSUPPORTED',reason:'source eye radius invalid'};

  const dx=(Math.abs(L.x)+Math.abs(R.x))/(2*U);
  const dy=(L.y+R.y)/(2*U);
  const ring=(lr+rr)/(2*U);
  if(![dx,dy,ring].every(finite)||!(ring>1e-6)) return {status:'UNSUPPORTED',reason:'derived anchor invalid'};

  const ray=new THREE.Raycaster(); ray.layers.enableAll();
  const fitAt=(x,y)=>{
    const oW=body.localToWorld(new THREE.Vector3(x,y,U*3.5));
    const dW=new THREE.Vector3(0,0,-1).transformDirection(body.matrixWorld).normalize();
    ray.set(oW,dW);
    const hit=ray.intersectObject(body,false)[0];
    return hit?body.worldToLocal(hit.point.clone()).z:null;
  };
  const zL=fitAt(L.x,L.y), zR=fitAt(R.x,R.y);
  if(!finite(zL)||!finite(zR)) return {status:'UNSUPPORTED',reason:'source eye xy falls outside FaceHost surface'};
  const eyeR=U*ring;
  const inset=((((zL-L.z)+(zR-R.z))/2)/eyeR-0.24)/1.15;
  if(!finite(inset)) return {status:'UNSUPPORTED',reason:'derived inset invalid'};

  const round=(v)=>+v.toFixed(6);
  return {
    status:'OK',
    source:'cleanup02-root-eye-anchors',
    anchor:{dx:round(dx),dy:round(dy),ring:round(ring)},
    eye:{inset:round(inset)},
    faceHostUnit:round(U),
    targets:{left:[L.x,L.y,L.z].map(round),right:[R.x,R.y,R.z].map(round)},
    surfaceZ:[round(zL),round(zR)],
    sourceRadius:[round(lr),round(rr)],
    asymmetry:{
      x:round(Math.abs(Math.abs(L.x)-Math.abs(R.x))/U),
      y:round(Math.abs(L.y-R.y)/U),
      z:round(Math.abs(L.z-R.z)/U)
    }
  };
}

export async function mountKayKitEyes({
  THREE,
  figure,
  sourceRef,
  profile,
  expressionContract,
  camera,
  log = () => {}
}) {
  if (!THREE || !figure) throw new Error('mountKayKitEyes requires THREE + figure');

  const faceHost = buildFaceHost({ THREE, figure, shape: 'ellipsoid', log });
  if (!faceHost || faceHost.status !== 'OK') {
    const reason = faceHost?.reason || faceHost?.report?.reason || 'FaceHost unsupported';
    throw new Error(reason);
  }

  const eye = profile?.eye || {};
  const baseColor = eye.baseColor ?? profile?.sourceFace?.faceColor ?? '#b58f83';
  const rig = new EyeRig(faceHost.faceCtx(), {
    anchor: clone(eye.anchor || {}),
    pupilStyle: eye.pupilStyle || 'matte-cute',
    pupilSize: eye.pupilSize ?? 0.5,
    gloss: eye.gloss ?? 0.1,
    inset: eye.inset ?? 0,
    lidFit: eye.lidFit ?? 0.9,
    converge: eye.converge ?? 0,
    splay: eye.splay ?? 0,
    baseColor,
    blink: clone(profile?.blink || {}),
    life: clone(profile?.life || {}),
    kinetics: clone(profile?.kinetics || {}),
    lashes: { length: 0, density: 0, width: 1 }
  });

  rig.build();
  rig.setLashes({ length: 0, density: 0, width: 1 });
  const ovalState = Object.assign({}, EYE_OVAL_DEFAULTS, clone(eye.oval || {}));
  attachEyeOval(rig, () => ovalState);
  const emotes = expressionContract?.face?.emotes || expressionContract?.emotes || {};

  const api = {
    schema: ADAPTER_SCHEMA,
    sourceRef,
    profile,
    faceHost,
    rig,
    expressionContract,
    camera,
    visible: true,
    applyExpression(id = 'neutral') {
      const e = emotes[id];
      if (!e) throw new Error(`unknown expression: ${id}`);
      rig.applyEmote(clone(e));
      api.expression = id;
      return id;
    },
    setPointer(nx, ny) { rig.pointTo(nx, ny); },
    setVisible(on) { api.visible = !!on; if (rig.rig) rig.rig.visible = api.visible; },
    setAnchor(patch) { rig.setAnchor(patch); api.setVisible(api.visible); },
    setRingPreserveCenter(newRing) {
      const oldRing=+rig.anchor.ring, oldInset=+rig.inset, ring=+newRing;
      if(!finite(ring)||ring<=0) return {status:'UNSUPPORTED',reason:'ring must be > 0'};
      const inset=compensateInsetForRing(oldRing,oldInset,ring);
      rig.inset=inset;
      rig.setAnchor({ring});
      api.setVisible(api.visible);
      return {status:'OK',ring,inset,seatInvariant:oldRing*(SEAT_BASE+oldInset*SEAT_GAIN)};
    },
    setTrack(track) {
      track=+track; if(!finite(track)) return {status:'UNSUPPORTED',reason:'track must be finite'};
      rig.anchor.track=track;
      const frame=rig.eyeFrame(), U=frame?.unit || (rig._R/(rig.anchor.ring||1));
      rig._max=U*track;
      return {status:'OK',track,max:rig._max};
    },
    setEye(patch) { rig.setEye(patch); api.setVisible(api.visible); },
    setPupilStyle(style) { rig.setPupilStyle(style); api.setVisible(api.visible); },
    setBaseColor(hex) { rig.setBaseColor(hex); api.setVisible(api.visible); },
    setOval(patch) { Object.assign(ovalState, patch || {}); applyEyeOval(rig, ovalState); api.setVisible(api.visible); },
    setGazeFollow(on) { rig.setGazeFollow(on); },
    setLife(patch) { rig.setLife(patch); },
    setKinetics(patch) { rig.setKinetics(patch); },
    blinkNow() { rig.blinkNow(); },
    update(dt, activeCamera = camera) {
      if (activeCamera) api.camera = activeCamera;
      rig.update(dt);
    },
    eyeFrame() { return rig.eyeFrame(); },
    report() {
      const f = rig.eyeFrame();
      const vec = (p) => p ? [p.x, p.y, p.z].map((n) => +n.toFixed(4)) : null;
      return {
        schema: ADAPTER_SCHEMA,
        sourceRef,
        faceHost: clone(faceHost.report),
        expression: api.expression || 'neutral',
        eyeFrame: f ? { left: vec(f.left), right: vec(f.right), radius: +f.radius.toFixed(4), unit: +f.unit.toFixed(4), gen: f.gen } : null,
        controls: {
          anchor: clone(rig.anchor), pupilStyle: rig.pupilStyle, pupilSize: rig.pupilSize,
          gloss: rig.gloss, inset: rig.inset, lidFit: rig.lidFit, converge: rig.converge, splay: rig.splay,
          baseColor: colorHex(THREE, rig.baseColor), lidColorMode: eye.lidColorMode || 'face-base-darkened',
          oval: clone(ovalState),
          blink: clone(rig.blink), life: clone(rig.life), kinetics: clone(rig.kinetics)
        }
      };
    },
    dispose() {
      detachEyeOval(rig);
      rig.dispose();
      faceHost.dispose();
    }
  };

  api.applyExpression('neutral');
  rig.setGazeFollow(false);
  for (let i = 0; i < 16; i++) rig.update(1 / 60);
  api.setVisible(true);
  log(`EyeRig v6 mounted · neutral applied · 16 settle ticks · lids ${colorHex(THREE, rig.baseColor)} base-darkened · update(dt) required every rendered frame`);
  return api;
}

export default mountKayKitEyes;
