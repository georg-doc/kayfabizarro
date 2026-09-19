import { buildFaceHost } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js';
import { EyeRig } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';

export const ADAPTER_SCHEMA = 'kfb.kaykit-eye-adapter/0.1-candidate';

function clone(v) { return JSON.parse(JSON.stringify(v)); }
function colorHex(THREE, value) {
  try { return '#' + new THREE.Color(value).getHexString(); } catch { return null; }
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
    setEye(patch) { rig.setEye(patch); api.setVisible(api.visible); },
    setPupilStyle(style) { rig.setPupilStyle(style); api.setVisible(api.visible); },
    setBaseColor(hex) { rig.setBaseColor(hex); api.setVisible(api.visible); },
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
          blink: clone(rig.blink), life: clone(rig.life), kinetics: clone(rig.kinetics)
        }
      };
    },
    dispose() {
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
