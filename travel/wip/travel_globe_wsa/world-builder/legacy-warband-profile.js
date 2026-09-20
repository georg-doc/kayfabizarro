// Legacy KayKit Warband visual adapter for WB0 Movement Lab.
// The Orc Warband character is an early four-part mesh (Body + Head + ArmLeft + ArmRight), not a
// modern skinned rig. We therefore never replace it with the yellow Legacy animation test figure.
// Instead we retarget semantically compatible rotation/bounce tracks from the Legacy 1.2 donor onto
// those four visible Orc parts. When the donor exposes no useful semantic tracks, a bounded proxy
// keeps the Orc visible and preserves donor clip names/durations instead of showing another model.

function clean(name = '') { return String(name).toLowerCase().replace(/[^a-z0-9]/g, ''); }

function semantic(name) {
  const s = clean(name);
  if (!s) return null;
  if (/armleft|leftarm|upperarmleft|upperarml|arml$/.test(s)) return 'armLeft';
  if (/armright|rightarm|upperarmright|upperarmr|armr$/.test(s)) return 'armRight';
  if (/head/.test(s)) return 'head';
  if (/body|torso|root|hips/.test(s)) return 'body';
  return null;
}

function targetParts(root) {
  const out = {};
  root.traverse((node) => {
    const key = semantic(node.name);
    if (key && !out[key]) out[key] = node;
  });
  return out;
}

function quaternionTrack(THREE, source, target, rest) {
  const stride = typeof source.getValueSize === 'function' ? source.getValueSize() : 4;
  if (stride !== 4 || !source.values || source.values.length < 4) return null;
  const q0 = new THREE.Quaternion().fromArray(source.values, 0).normalize();
  const inv0 = q0.clone().invert();
  const qi = new THREE.Quaternion(), delta = new THREE.Quaternion(), out = new THREE.Quaternion();
  const values = new Float32Array(source.values.length);
  for (let i = 0; i < source.values.length; i += 4) {
    qi.fromArray(source.values, i).normalize();
    delta.copy(inv0).multiply(qi);
    out.copy(rest).multiply(delta).normalize().toArray(values, i);
  }
  return new THREE.QuaternionKeyframeTrack(`${target.name}.quaternion`, Array.from(source.times), Array.from(values));
}

function bodyPositionTrack(THREE, source, target, rest) {
  const stride = typeof source.getValueSize === 'function' ? source.getValueSize() : 3;
  if (stride !== 3 || !source.values || source.values.length < 3) return null;
  const p0 = new THREE.Vector3().fromArray(source.values, 0);
  const p = new THREE.Vector3(), values = new Float32Array(source.values.length);
  for (let i = 0; i < source.values.length; i += 3) {
    p.fromArray(source.values, i).sub(p0).multiplyScalar(0.45).add(rest).toArray(values, i);
  }
  return new THREE.VectorKeyframeTrack(`${target.name}.position`, Array.from(source.times), Array.from(values));
}

function retargetClip(THREE, clip, targetRoot) {
  const targets = targetParts(targetRoot);
  const tracks = [];
  const seen = new Set();
  for (const source of clip.tracks || []) {
    let parsed = null;
    try { parsed = THREE.PropertyBinding.parseTrackName(source.name); } catch (_) {}
    if (!parsed?.nodeName) continue;
    const key = semantic(parsed.nodeName), target = key && targets[key];
    if (!target) continue;
    const token = `${key}:${parsed.propertyName}`;
    if (seen.has(token)) continue;
    let track = null;
    if (parsed.propertyName === 'quaternion') track = quaternionTrack(THREE, source, target, target.quaternion.clone());
    else if (key === 'body' && parsed.propertyName === 'position') track = bodyPositionTrack(THREE, source, target, target.position.clone());
    if (track) { tracks.push(track); seen.add(token); }
  }
  // makeEntry deliberately rejects tiny/accidental bindings; require a similarly meaningful set here.
  if (tracks.length < 3) return null;
  return new THREE.AnimationClip(clip.name, clip.duration, tracks, clip.blendMode);
}

function proxyClip(THREE, clip, targetRoot) {
  const parts = targetParts(targetRoot), duration = Math.max(0.25, clip.duration || 1);
  const N = 12, times = [], bodyValues = [], leftValues = [], rightValues = [], headValues = [];
  const body = parts.body, left = parts.armLeft, right = parts.armRight, head = parts.head;
  if (!body) return null;
  const walk = /walk/i.test(clip.name), run = /run/i.test(clip.name), jump = /jump/i.test(clip.name), idle = /idle/i.test(clip.name);
  const amp = run ? 0.62 : walk ? 0.42 : idle ? 0.08 : 0.25;
  const q = new THREE.Quaternion(), e = new THREE.Euler(), bodyRest = body.position.clone();
  for (let i = 0; i <= N; i++) {
    const t = i / N, phase = t * Math.PI * 2;
    times.push(t * duration);
    // Legacy proxy jump is one clean arch. It deliberately avoids the previous donor's visible
    // second platformer-like bounce while preserving the original clip duration/name.
    const bounce = jump ? Math.sin(Math.PI * t) * 0.08 : Math.abs(Math.sin(phase)) * (run ? 0.045 : walk ? 0.026 : 0.008);
    bodyValues.push(bodyRest.x, bodyRest.y + bounce, bodyRest.z);
    if (left) { q.setFromEuler(e.set(amp * Math.sin(phase), 0, 0)).premultiply(left.quaternion); leftValues.push(q.x, q.y, q.z, q.w); }
    if (right) { q.setFromEuler(e.set(-amp * Math.sin(phase), 0, 0)).premultiply(right.quaternion); rightValues.push(q.x, q.y, q.z, q.w); }
    if (head) { q.setFromEuler(e.set(0, 0, 0.08 * Math.sin(phase * 0.5))).premultiply(head.quaternion); headValues.push(q.x, q.y, q.z, q.w); }
  }
  const tracks = [new THREE.VectorKeyframeTrack(`${body.name}.position`, times, bodyValues)];
  if (left && leftValues.length) tracks.push(new THREE.QuaternionKeyframeTrack(`${left.name}.quaternion`, times, leftValues));
  if (right && rightValues.length) tracks.push(new THREE.QuaternionKeyframeTrack(`${right.name}.quaternion`, times, rightValues));
  if (head && headValues.length) tracks.push(new THREE.QuaternionKeyframeTrack(`${head.name}.quaternion`, times, headValues));
  return new THREE.AnimationClip(clip.name, duration, tracks);
}

export async function buildLegacyWarbandMovementRuntime({
  THREE, loader, raw, def, bodyHeight, targetHeight = bodyHeight, scaleClass = null,
  worldLambert, normalizeHeight, makeEntry, autoMap,
}) {
  const warbandGltf = await loader.loadAsync(raw(def.body));
  const warband = warbandGltf.scene;
  warband.name = 'Legacy Orc A · visible Warband movement target';
  worldLambert(warband);
  const measure = normalizeHeight(warband, targetHeight);

  const legacy = await loader.loadAsync(raw(def.animation));
  const entries = [];
  let retargeted = 0, proxied = 0;
  for (const sourceClip of legacy.animations || []) {
    let clip = retargetClip(THREE, sourceClip, warband);
    if (clip) retargeted++;
    else { clip = proxyClip(THREE, sourceClip, warband); if (clip) proxied++; }
    if (!clip) continue;
    const entry = makeEntry(warband, clip, 'LegacyWarbandRetarget', measure.worldScale);
    if (entry) entries.push(entry);
  }
  if (!entries.length) throw new Error('Legacy Warband Orc: no usable retarget/proxy clips');
  const auto = autoMap(entries);
  if (!auto.idle || !auto.walk || !auto.run || !auto.jump) {
    throw new Error(`Legacy Warband Orc missing locomotion clips: ${['idle','walk','run','jump'].filter((k) => !auto[k]).join(', ')}`);
  }

  return {
    def,
    model: warband,
    actionRoot: warband,
    mixer: new THREE.AnimationMixer(warband),
    entries,
    auto,
    measure,
    fallback: proxied > 0,
    legacyVisibleOrc: true,
    scaleClass,
    speedMul: targetHeight / bodyHeight,
    locomotionHeight: targetHeight,
    status: `VISIBLE Orc A · ${retargeted} semantic donor clips · ${proxied} timing-proxy clips · yellow Legacy test figure disabled`,
    donorReport: {
      donor: 'KayKit Legacy Character Animations 1.2',
      visibleTarget: def.body,
      animationSource: def.animation,
      retargeted,
      proxied,
      visibleFallback: 'never yellow donor; Orc remains visible',
      scaleClass: scaleClass?.id || def.scaleClass || null,
      targetHeight,
    },
  };
}
