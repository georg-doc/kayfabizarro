/* kfb-fx-trails.js · Ribbon-Trails fuer den KFB-Mech-Slice (S2b, v6)
 *
 * Das PDF (KFB Cartoon Combat VFX, Rakete): „eine dominierende Rauch-/Farbspur; keine
 * zehn Nebenpartikel". v5 zog Puff-Ketten — je Takt ein Sprite. Das liest sich als
 * Perlenschnur, nicht als Spur. Ein Ribbon ist EIN Streifen-Mesh, dem der Kopf folgt:
 * Punkte werden vorn angehaengt, hinten verfallen sie; Breite und Deckkraft laufen
 * ueber die Laenge aus. Die Flaeche dreht sich zur Kamera (wie die Speedline).
 *
 * Ein Mesh je Trail, gepoolt (cap), ein Material je Blend-Art. Kein Textur-Ladeweg:
 * die Kante ist weich ueber Vertex-Alpha, die Farbe kommt vom Schuss (Waffenfarbe
 * oder Tusche).
 */
export class TrailFx {
  constructor(THREE, scene, o) {
    this.THREE = THREE; this.scene = scene;
    this.cap = (o && o.cap) || 16; this.maxPts = (o && o.maxPts) || 28;
    this.trails = [];
    for (let i = 0; i < this.cap; i++) this.trails.push(this._make());
    this._tmp = new THREE.Vector3(); this._side = new THREE.Vector3(); this._toCam = new THREE.Vector3();
  }
  _make() {
    const THREE = this.THREE, N = this.maxPts;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 2 * 3), col = new Float32Array(N * 2 * 4);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 4).setUsage(THREE.DynamicDrawUsage));
    const idx = [];
    for (let i = 0; i < N - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    geo.setIndex(idx); geo.setDrawRange(0, 0);
    const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    /* Vertex-Alpha: three liest bei vertexColors nur RGB — der vierte Kanal wird per
       Patch in die Deckkraft geschrieben. Zwei Zeilen, kein eigenes Material. */
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace('#include <color_vertex>', '#include <color_vertex>\nvA = color.a;').replace('#include <common>', '#include <common>\nvarying float vA;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vA;').replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= vA;');
    };
    mat.customProgramCacheKey = () => 'kfb-trail';
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false; mesh.renderOrder = 2; mesh.visible = false;
    this.scene.add(mesh);
    return { mesh, live: false, pts: [], head: null };
  }
  /* Einen Trail an einen Kopf binden. o: color, width, life (Verfall je Punkt, s), add, op, every (s je Punkt) */
  start(o) {
    const t = this.trails.find((x) => !x.live); if (!t) return null;
    const THREE = this.THREE;
    t.live = true; t.pts = []; t.acc = 0; t.dying = 0;
    t.color = new THREE.Color(o.color == null ? 0xffffff : o.color);
    t.width = o.width || 0.35; t.life = o.life || 0.6; t.op = o.op == null ? 0.7 : o.op; t.every = o.every || 0.028;
    const want = o.add ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (t.mesh.material.blending !== want) { t.mesh.material.blending = want; t.mesh.material.needsUpdate = true; }
    t.mesh.visible = true;
    return t;
  }
  /* Vom Wirt je Schritt fuer jeden lebenden Kopf: Position anhaengen (getaktet, nicht je Bild). */
  feed(t, pos, dt) {
    if (!t || !t.live) return;
    t.acc += dt;
    if (t.acc >= t.every || !t.pts.length) { t.acc = 0; t.pts.unshift({ p: pos.clone(), age: 0 }); if (t.pts.length > this.maxPts) t.pts.pop(); }
    else t.pts[0].p.copy(pos);   // der Kopf klebt am Geschoss, auch zwischen zwei Takten
  }
  /* Kopf weg: der Trail lebt, bis der letzte Punkt verfallen ist. */
  release(t) { if (t) t.dying = 1; }
  step(dt, cam) {
    const THREE = this.THREE;
    for (const t of this.trails) {
      if (!t.live) continue;
      for (const q of t.pts) q.age += dt;
      while (t.pts.length && t.pts[t.pts.length - 1].age > t.life) t.pts.pop();
      if (t.pts.length < 2) { if (t.dying || !t.pts.length) { t.live = false; t.mesh.visible = false; t.mesh.geometry.setDrawRange(0, 0); } continue; }
      const P = t.mesh.geometry.attributes.position, C = t.mesh.geometry.attributes.color;
      const n = t.pts.length;
      for (let i = 0; i < n; i++) {
        const a = t.pts[i].p, b = t.pts[Math.min(n - 1, i + 1)].p, b0 = t.pts[Math.max(0, i - 1)].p;
        this._tmp.subVectors(i === n - 1 ? a : b, i === n - 1 ? b0 : a).normalize();
        this._toCam.subVectors(cam.position, a).normalize();
        this._side.crossVectors(this._tmp, this._toCam).normalize();
        const k = t.pts[i].age / t.life;                       // 0 am Kopf … 1 am Ende
        const w = t.width * (0.35 + 0.65 * Math.min(1, i / 3)) * (1 + k * 0.9);   // vorn schmal (Duese), hinten breit (Rauch loest sich)
        const alpha = t.op * (1 - k) * (1 - k);
        P.setXYZ(i * 2, a.x + this._side.x * w, a.y + this._side.y * w, a.z + this._side.z * w);
        P.setXYZ(i * 2 + 1, a.x - this._side.x * w, a.y - this._side.y * w, a.z - this._side.z * w);
        C.setXYZW(i * 2, t.color.r, t.color.g, t.color.b, alpha); C.setXYZW(i * 2 + 1, t.color.r, t.color.g, t.color.b, alpha);
      }
      P.needsUpdate = true; C.needsUpdate = true;
      t.mesh.geometry.setDrawRange(0, (n - 1) * 6);
    }
  }
  stats() { return { live: this.trails.filter((t) => t.live).length, cap: this.cap }; }
  dispose() { for (const t of this.trails) { this.scene.remove(t.mesh); t.mesh.geometry.dispose(); t.mesh.material.dispose(); } }
}
