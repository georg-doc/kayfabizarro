/* KFB · Schatten- und Grounding-Vertrag (S12, CD-RES-01)
   Umsetzung von tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md (Production-05) plus Georgs Vertrag vom 29.09.:
   1. Sichtbare Oberfläche = Kontakthöhe = Schattenempfänger. Dieselbe Geometrie, keine zweite Ebene.
   2. Keine versteckte universelle Schattenebene. Die ShadowMaterial-Ebene des Viewers (y −0,002) wird
      stillgelegt; das war mit dem Host-Boden (y −0,01) und den Kacheloberseiten (y 0) die Quelle
      für doppelte Empfänger auf drei Höhen.
   3. Genau EIN Schatten werfendes Licht (der Key des Viewers). Das Diorama stellt dessen Richtung,
      bringt aber kein zweites mit.
   4. Frustum auf die Vereinigung der Inhaltswurzeln, Radius in 1/8-Schritten, Mitte auf das
      Texelraster eingerastet, bias −0,00015, normalBias = 1,5 Texel. Kein VSM.
   5. Dünnes und Unsichtbares wirft nicht (Sprites, Linien, ShaderMaterial, transparent < 0,98,
      Reservierungs-Boxen). DoubleSide ist KEIN Ausschlussgrund.
   Bias und Blur kaschieren hier nichts: Kontakt wird im Grounding-Gate gemessen, nicht gestellt. */
import * as THREE from 'three';

const _b = new THREE.Box3(), _s = new THREE.Sphere(), _c = new THREE.Vector3();

export function makeShadowContract(V, { getRoots = () => [] } = {}) {
  let key = null;
  const retired = [];
  V.scene.traverse((o) => {
    if (o.isDirectionalLight && o.castShadow && !key) key = o;
    if (o.isMesh && o.material && o.material.isShadowMaterial) retired.push(o);
  });
  for (const p of retired) { p.visible = false; p.userData.retiredBy = 'shadow-contract §2'; }
  const smax = Math.min(4096, V.renderer.capabilities.maxTextureSize || 4096);
  key.shadow.mapSize.set(smax, smax);
  if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
  if (!key.target.parent) V.scene.add(key.target);

  /* Studio-Boden: hell, ruhig, Production-05-Ton. Sichtbar UND Empfänger UND Kontakt auf y 0.
     polygonOffset schiebt nur die Tiefe, nicht die Höhe — Kacheloberseiten auf y 0 gewinnen. */
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xb3ab9c, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 4 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(120, 120), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0; floor.receiveShadow = true; floor.castShadow = false;
  floor.name = 'Studio · Boden y 0'; floor.userData.surface = 'studio';
  V.scene.add(floor);

  const S = { on: true, dir: key.position.clone().normalize(), lastPos: new THREE.Vector3(), frame: 0, r: 0, texel: 0, cap: 22, focus: null };
  const base = new THREE.Vector3(0, 1, 0);

  function contentBox() {
    _b.makeEmpty();
    for (const r of getRoots()) if (r && r.visible && r.parent) _b.expandByObject(r);
    if (S.focus) { _b.makeEmpty(); _b.expandByObject(S.focus); }
    return _b;
  }
  function fit() {
    if (!key.castShadow) return;
    if (!key.position.equals(S.lastPos)) S.dir.copy(key.position).sub(key.target.position).normalize();
    const box = contentBox();
    if (box.isEmpty()) return;
    box.getBoundingSphere(_s);
    const r = Math.min(S.cap, Math.ceil(Math.max(0.6, _s.radius * 1.12) * 8) / 8);
    const texel = (2 * r) / key.shadow.mapSize.x;
    const fwd = S.dir.clone().negate();
    const right = new THREE.Vector3().crossVectors(fwd, Math.abs(fwd.y) > 0.98 ? new THREE.Vector3(1, 0, 0) : base).normalize();
    const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
    const c = _s.center;
    _c.copy(right).multiplyScalar(Math.round(c.dot(right) / texel) * texel)
      .addScaledVector(up, Math.round(c.dot(up) / texel) * texel)
      .addScaledVector(fwd, c.dot(fwd));
    key.target.position.copy(_c);
    key.position.copy(_c).addScaledVector(S.dir, r + 30);
    S.lastPos.copy(key.position);
    const cam = key.shadow.camera;
    cam.left = -r; cam.right = r; cam.top = r; cam.bottom = -r; cam.near = 0.1; cam.far = 2 * r + 60;
    cam.updateProjectionMatrix();
    key.shadow.bias = -0.00015;
    key.shadow.normalBias = texel * 1.5;
    key.target.updateMatrixWorld(); key.updateMatrixWorld();
    S.r = r; S.texel = texel;
  }
  function castRule(root) {
    let n = 0;
    root.traverse((o) => {
      if (o.isSprite || o.isLine || o.isPoints) { o.castShadow = false; o.receiveShadow = false; return; }
      if (!o.isMesh) return;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      const thin = ms.some((m) => !m || m.isShaderMaterial || m.isMeshBasicMaterial || (m.transparent && (m.opacity ?? 1) < 0.98)) || o.userData.noCast || o.isInstancedMesh && /^vfx-/.test(o.name);
      const want = !thin;
      if (o.castShadow !== want) { o.castShadow = want; n++; }
      o.receiveShadow = !ms.some((m) => m && m.isShaderMaterial);
    });
    return n;
  }
  V.post.add(() => {
    if (!S.on) return;
    if ((S.frame++ & 3) === 0) fit();
    if ((S.frame % 90) === 1) for (const r of getRoots()) if (r) castRule(r);
  });

  const C = {
    key, floor, retired,
    get state() { return { on: S.on, radius: S.r, texel: +S.texel.toFixed(5), mapSize: key.shadow.mapSize.x, bias: key.shadow.bias, normalBias: +key.shadow.normalBias.toFixed(5), dir: S.dir.toArray().map((x) => +x.toFixed(3)) }; },
    fit, castRule,
    setOn(on) { S.on = !!on; key.castShadow = !!on; V.scene.traverse((o) => { if (o.material && !Array.isArray(o.material)) o.material.needsUpdate = true; }); },
    setLightDir(v) { S.dir.copy(v).normalize(); S.lastPos.set(NaN, NaN, NaN); key.position.copy(key.target.position).addScaledVector(S.dir, 30); S.lastPos.copy(key.position); fit(); },
    setMapSize(n) { const m = Math.min(n, smax); if (key.shadow.mapSize.x === m) return; key.shadow.mapSize.set(m, m); if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; } S.mapN = m; fit(); },
    setFocus(obj) { S.focus = obj || null; fit(); },
    setStudioFloor(on) { floor.visible = !!on; },
    /* Prüfung §2/§3/§5 — Zahlen, keine Behauptung */
    audit() {
      const out = { casterLights: 0, hiddenReceivers: [], shadowPlanes: 0, overlayCasters: [], receivers: [] };
      V.scene.traverse((o) => {
        if (o.isLight && o.castShadow && o.visible) out.casterLights++;
        if (!o.isMesh) return;
        let vis = true; for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; }
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m && m.isShadowMaterial && vis) out.shadowPlanes++;
        if (o.receiveShadow && vis && m && (m.visible === false || m.colorWrite === false || m.opacity === 0)) out.hiddenReceivers.push(o.name || o.uuid.slice(0, 8));
        if (o.castShadow && vis && m && (m.isShaderMaterial || m.isMeshBasicMaterial || (m.transparent && m.opacity < 0.98))) out.overlayCasters.push(o.name || o.uuid.slice(0, 8));
        if (o.receiveShadow && vis && o.userData.surface) out.receivers.push(o.userData.surface + ' · y ' + o.getWorldPosition(_c).y.toFixed(3));
      });
      out.pass = out.casterLights <= 1 && out.shadowPlanes === 0 && !out.hiddenReceivers.length && !out.overlayCasters.length;
      return out;
    }
  };
  return C;
}
