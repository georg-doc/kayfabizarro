/* CLAYBOUND-WORLD-C1 · reversible presentation adapter for the accepted Hürth World r2 scene.
   It owns materials, light and the two-button comparison only. WorldBuilder geometry, collisions,
   terrain, editor, persistence, camera, route and actor remain with their existing owners. */
import * as THREE from 'three';

export const SCHEMA = 'claybound-presentation.v1';
const SEED = 43129;
const clamp01 = x => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
function hash(s) {
  let h = (2166136261 ^ SEED) >>> 0;
  for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return (h >>> 0) / 4294967295;
}
function wave(x, y, z, seed) {
  const broad = Math.sin(x * .44 + seed * 6.28) * Math.sin(y * .49 + seed * 2.1) * Math.sin(z * .38 - seed * 3.7);
  const medium = Math.sin(x * 1.31 - seed * 4.1) * Math.sin(y * 1.43 + seed * 5.2) * Math.sin(z * 1.17 + seed * 2.9);
  return .28 * broad + .085 * medium;
}
function geometrySignature(geometry) {
  const p = geometry.attributes.position;
  let sum = 0;
  for (let i = 0; i < p.count; i += 17) sum += p.getX(i) * .13 + p.getY(i) * .73 + p.getZ(i) * .31;
  return [p.count, +sum.toFixed(5)];
}
function clayMaterial(source, deform) {
  const material = source.clone();
  material.roughness = deform ? .94 : .96;
  material.metalness = 0;
  material.color.set(deform ? 0xead8c8 : 0xf0dfd1);
  material.name = (source.name || 'world') + ':ClayBound-C1';
  if (deform) {
    material.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        '#include <common>\nattribute float aClayMask;\nattribute float aClaySeed;\nvarying float vClayCharge;'
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nfloat cb = sin(position.x * .44 + aClaySeed * 6.28) * sin(position.y * .49 + aClaySeed * 2.1) * sin(position.z * .38 - aClaySeed * 3.7);\nfloat cm = sin(position.x * 1.31 - aClaySeed * 4.1) * sin(position.y * 1.43 + aClaySeed * 5.2) * sin(position.z * 1.17 + aClaySeed * 2.9);\ntransformed += normal * aClayMask * (.28 * cb + .085 * cm);\nvClayCharge = aClayMask * (.035 * cb + .015 * cm);'
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        '#include <common>\nvarying float vClayCharge;'
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        '#include <color_fragment>\ndiffuseColor.rgb *= 1.0 + vClayCharge;'
      );
    };
    material.customProgramCacheKey = () => 'claybound-world-c1-form-v1';
  }
  material.needsUpdate = true;
  return material;
}
function collisionSamples(app, records) {
  const W = app.world, T = app.terrainHeightAt;
  const pts = [[W.spawn.x, W.spawn.z], [W.spawn.x + 3, W.spawn.z], [W.spawn.x, W.spawn.z + 3]];
  for (const r of records.slice(0, 4)) pts.push([r.samples[0][0], r.samples[0][1]]);
  return pts.map(([x, z]) => [x, z, W.solidAt(x, z), W.groundAt(x, z, T(x, z))]);
}

export function mountClayBound(app) {
  if (!app || !app.world || app.world.id !== 'huerth' || !app.world.city) throw Error('ClayBound C1 needs the ready Hürth World r2 scene');
  const city = app.world.city, walls = city.blocks, roofs = city.roofs;
  const records = city.support && city.support.records;
  if (!walls || !roofs || !records || !walls.geometry.attributes.position) throw Error('ClayBound C1 wall/support seam unavailable');
  const p = walls.geometry.attributes.position;
  const mask = new Float32Array(p.count), seeds = new Float32Array(p.count);
  let eligible = 0, vertices = 0, maxFormM = 0;
  const excluded = { spawn: 0, sparse: 0, short: 0, elevated: 0 };
  for (const r of records) {
    const [start, count] = r.walls;
    if (!count) continue;
    const cx = r.samples[0][0], cz = r.samples[0][1];
    const nearSpawn = Math.hypot(cx - app.world.spawn.x, cz - app.world.spawn.z) < 18;
    const category = nearSpawn ? 'spawn' : !r.grounded ? 'elevated' : count < 180 ? 'sparse' : null;
    if (category) { excluded[category]++; continue; }
    let lo = Infinity, hi = -Infinity;
    for (let i = start; i < start + count; i++) { const y = p.getY(i); lo = Math.min(lo, y); hi = Math.max(hi, y); }
    if (hi - lo < 5.6) { excluded.short++; continue; }
    eligible++;
    const seed = hash(r.id);
    for (let i = start; i < start + count; i++) {
      const rel = p.getY(i) - lo;
      const keepFeet = smooth(2.35, 3.4, rel);
      const keepRoofContact = 1 - smooth(hi - lo - 1.45, hi - lo - .3, rel);
      const m = keepFeet * keepRoofContact;
      mask[i] = m; seeds[i] = seed;
      if (m > .01) { vertices++; maxFormM = Math.max(maxFormM, Math.abs(wave(p.getX(i), p.getY(i), p.getZ(i), seed) * m)); }
    }
  }
  if (eligible < 1 || vertices < 40 || maxFormM < .04) throw Error('ClayBound C1 has no usable form vertices');
  walls.geometry.setAttribute('aClayMask', new THREE.BufferAttribute(mask, 1));
  walls.geometry.setAttribute('aClaySeed', new THREE.BufferAttribute(seeds, 1));
  const original = { walls: walls.material, roofs: roofs.material };
  const clay = { walls: clayMaterial(original.walls, true), roofs: clayMaterial(original.roofs, false) };
  const sun = app.scene.children.find(o => o.isDirectionalLight && o.castShadow);
  const hemi = app.scene.children.find(o => o.isHemisphereLight);
  if (!sun || !hemi) throw Error('ClayBound C1 needs the accepted WB2 lights');
  const light0 = { sunColor: sun.color.clone(), sunIntensity: sun.intensity, hemiColor: hemi.color.clone(), ground: hemi.groundColor.clone(), hemiIntensity: hemi.intensity, mapping: app.renderer.toneMapping, exposure: app.renderer.toneMappingExposure };
  const rim = new THREE.DirectionalLight(0xa9bedc, .48);
  rim.position.set(-12, 18, -8); rim.castShadow = false; rim.visible = false; rim.name = 'ClayBound C1 cool fill';
  app.scene.add(rim);
  const camera0 = app.camera.position.toArray(), target0 = app.controls.target.toArray();
  const collision0 = collisionSamples(app, records);
  const geometry0 = [geometrySignature(walls.geometry), geometrySignature(roofs.geometry)];
  const top = document.querySelector('#top > .col:last-child');
  if (!top) throw Error('WorldBuilder comparison controls unavailable');
  const bar = document.createElement('div');
  bar.className = 'cl'; bar.setAttribute('aria-label', 'Presentation');
  bar.style.cssText = 'align-self:flex-end;pointer-events:auto;white-space:nowrap';
  const originalButton = document.createElement('button'), clayButton = document.createElement('button');
  originalButton.id = 'c1Original'; clayButton.id = 'c1ClayBound';
  originalButton.textContent = 'Original'; clayButton.textContent = 'ClayBound';
  originalButton.title = 'Accepted World r2 presentation'; clayButton.title = 'ClayBound C1 presentation proof';
  bar.append(originalButton, clayButton); top.append(bar);
  let mode = 'original';
  function setMode(next) {
    mode = next === 'claybound' ? 'claybound' : 'original';
    const on = mode === 'claybound';
    walls.material = on ? clay.walls : original.walls;
    roofs.material = on ? clay.roofs : original.roofs;
    sun.color.copy(on ? new THREE.Color(0xffd8a8) : light0.sunColor);
    sun.intensity = on ? 2.45 : light0.sunIntensity;
    hemi.color.copy(on ? new THREE.Color(0xffead2) : light0.hemiColor);
    hemi.groundColor.copy(on ? new THREE.Color(0x526578) : light0.ground);
    hemi.intensity = on ? 2.15 : light0.hemiIntensity;
    rim.visible = on;
    app.renderer.toneMapping = on ? THREE.ACESFilmicToneMapping : light0.mapping;
    app.renderer.toneMappingExposure = on ? 1.1 : light0.exposure;
    originalButton.className = on ? 'quiet' : 'active';
    clayButton.className = on ? 'active' : 'quiet';
    originalButton.setAttribute('aria-pressed', String(!on));
    clayButton.setAttribute('aria-pressed', String(on));
    document.body.dataset.clayboundMode = mode;
    return report();
  }
  function report() {
    const collisions = collisionSamples(app, records), geometry = [geometrySignature(walls.geometry), geometrySignature(roofs.geometry)];
    return {
      schema: SCHEMA, seed: SEED, mode, eligibleBuildings: eligible, formVertices: vertices,
      sampledMaxFormM: +maxFormM.toFixed(4), excluded,
      masks: ['roads', 'spawn', 'contact terrain', 'roof contact', 'facade attachments', 'landmarks', 'water', 'rails', 'actors', 'low-poly props'],
      cameraUnchanged: JSON.stringify(camera0) === JSON.stringify(app.camera.position.toArray()) && JSON.stringify(target0) === JSON.stringify(app.controls.target.toArray()),
      collisionUnchanged: JSON.stringify(collision0) === JSON.stringify(collisions),
      geometryUnchanged: JSON.stringify(geometry0) === JSON.stringify(geometry)
    };
  }
  originalButton.onclick = () => setMode('original');
  clayButton.onclick = () => setMode('claybound');
  window.__clayboundC1 = { setMode, report, originalButton, clayButton };
  setMode(new URLSearchParams(location.search).get('clay') === 'on' ? 'claybound' : 'original');
  return window.__clayboundC1;
}
