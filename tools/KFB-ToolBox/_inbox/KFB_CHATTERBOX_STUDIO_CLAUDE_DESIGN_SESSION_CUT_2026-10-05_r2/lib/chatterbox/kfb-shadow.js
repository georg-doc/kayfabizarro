/* KFB · Schatten-Vertrag für ChatterBox-Bühnen (Port von lib/shadow-contract.js, S12/S16, ohne Viewer-Abhängigkeit)
   Befund 2026-10-05 (Georg, Screenshots Bear/Witch): Streifen-Akne im Gesicht. Ursache in stage3d v0.1:
   festes 18 × 10 m Frustum auf 2048², bias −0,0004 / normalBias 0,02 fix, Standard-shadowSide (BackSide) —
   die Gesichtsschale liegt dicht vor dem Kopf, ihre Rückseite schattet die eigene Vorderseite.
   Vertrag: 1 Schattenlicht · Frustum = Bounding-Sphere der Inhalte, Radius in 1/8-Schritten, Mitte aufs Texelraster
   · bias −0,00015 · normalBias 1,5 Texel · PCF radius 2 · shadowSide FrontSide · Dünnes/Transparentes wirft nicht
   · eine sichtbare Bodenfläche = Kontakthöhe = Empfänger. */
export function makeKfbShadow(THREE, key, getRoots, opts = {}) {
  const renderer = opts.renderer;
  const smax = Math.min(opts.mapSize || 4096, (renderer && renderer.capabilities.maxTextureSize) || 4096);
  key.castShadow = true; key.shadow.mapSize.set(smax, smax);
  if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
  if (!key.target.parent && key.parent) key.parent.add(key.target);
  const dir = key.position.clone().sub(key.target.position).normalize();
  const box = new THREE.Box3(), sph = new THREE.Sphere(), c = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), X = new THREE.Vector3(1, 0, 0);
  let r = 0, texel = 0, frame = 0;
  function fit() {
    box.makeEmpty();
    for (const o of getRoots()) if (o && o.visible && o.parent) box.expandByObject(o);
    if (box.isEmpty()) return;
    box.getBoundingSphere(sph);
    r = Math.min(22, Math.ceil(Math.max(0.6, sph.radius * 1.12) * 8) / 8);
    texel = (2 * r) / key.shadow.mapSize.x;
    const fwd = dir.clone().negate();
    const right = new THREE.Vector3().crossVectors(fwd, Math.abs(fwd.y) > 0.98 ? X : Y).normalize();
    const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
    const cc = sph.center;
    c.copy(right).multiplyScalar(Math.round(cc.dot(right) / texel) * texel)
      .addScaledVector(up, Math.round(cc.dot(up) / texel) * texel)
      .addScaledVector(fwd, cc.dot(fwd));
    key.target.position.copy(c); key.position.copy(c).addScaledVector(dir, r + 30);
    const cam = key.shadow.camera;
    cam.left = -r; cam.right = r; cam.top = r; cam.bottom = -r; cam.near = 0.1; cam.far = 2 * r + 60; cam.updateProjectionMatrix();
    key.shadow.bias = -0.00015; key.shadow.normalBias = texel * 1.5; key.shadow.radius = 2; key.shadow.blurSamples = 10;
    key.target.updateMatrixWorld(); key.updateMatrixWorld();
  }
  function castRule(root) {
    root.traverse((o) => {
      if (o.isSprite || o.isLine || o.isPoints) { o.castShadow = false; o.receiveShadow = false; return; }
      if (!o.isMesh) return;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      const thin = ms.some((m) => !m || m.isShaderMaterial || m.isMeshBasicMaterial || (m.transparent && (m.opacity ?? 1) < 0.98)) || o.userData.noCast;
      o.castShadow = !thin;
      if (!thin) for (const m of ms) if (m && m.side !== THREE.DoubleSide && m.shadowSide !== THREE.FrontSide) { m.shadowSide = THREE.FrontSide; m.needsUpdate = true; }
      o.receiveShadow = !ms.some((m) => m && m.isShaderMaterial);
    });
  }
  return {
    fit, castRule,
    tick() { if ((frame++ & 3) === 0) fit(); if (frame % 30 === 1) for (const o of getRoots()) if (o) castRule(o); },
    get state() { return { radius: r, texel: +texel.toFixed(5), mapSize: key.shadow.mapSize.x, bias: key.shadow.bias, normalBias: +key.shadow.normalBias.toFixed(5), pcfRadius: key.shadow.radius }; },
    audit(scene) {
      const out = { casterLights: 0, shadowPlanes: 0, overlayCasters: [] };
      scene.traverse((o) => {
        if (o.isLight && o.castShadow && o.visible) out.casterLights++;
        if (!o.isMesh) return; const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m && m.isShadowMaterial && o.visible) out.shadowPlanes++;
        if (o.castShadow && m && (m.isShaderMaterial || m.isMeshBasicMaterial || (m.transparent && m.opacity < 0.98))) out.overlayCasters.push(o.name || o.uuid.slice(0, 8));
      });
      out.pass = out.casterLights <= 1 && out.shadowPlanes === 0 && !out.overlayCasters.length; return out;
    }
  };
}
