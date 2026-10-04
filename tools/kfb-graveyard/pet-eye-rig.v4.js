/* pet-eye-rig.v3.js — GETEILTES Eye-Rig (PET-EDITOR v3, 2026-07-15).
   = pet-eye-rig.v2.js (1:1 übernommen, v2-Geometrie-Kern unverändert) + EIN Fix:
   reskinLids() — die Lider gehören zur BODY-Materialzone und müssen dem Look (Kenney/Clay/Cel)
   + der Surface + dem Recolor folgen. In v2 wurden sie nur beim build() gesetzt; ein Look-Wechsel
   (der nur reskin() ruft, das die petOverlay-Rig-Meshes überspringt) ließ sie auf Clay hängen.
   Augapfel + Pupille bleiben in JEDEM Look nass (eigene MeshPhysicalMaterial) — Materialzonen-Prinzip.

   GEOMETRIE-KERN (der Fix gegen Clipping):
   - Eyeball = weiße Kugel Radius R (= U*ring).
   - Pupille = SPHÄRISCHE KAPPE, die AUF der Eyeball-Oberfläche liegt (Radius ≈ R*1.004).
     Sie ist Teil der Oberfläche, kann also NIE über die Lider stechen — egal wie groß.
     `pupilSize` = Winkel-Radius der Kappe (Slider). Blick = Rotation des Pupillen-Pivots.
   - Lider = Kugelschalen-Kappen Radius R*lidScale; `lidFit` (0..1) steuert lidScale eng↔locker
     (default eng: lidScale≈1.04). Lider umschließen den Eyeball mit kleinem Sicherheitsabstand.
   - `inset` schiebt das ganze Auge tiefer in den Körper (−Z), Augen sitzen in Höhlen.
   - Lid-Farbe = ABGEDUNKELTE Base-Color des Pets (setBaseColor), nicht generisch/schwarz.

   PUPILLEN-STILE (gleiche Geometrie, nur Material — CLAYMATION-Materialzonen):
   - Augapfel + Pupille = NASS/glänzend (MeshStandard, envMap), Lider = matter Clay-Skin.
   - matte-cute:    weicher Pupillen-Glint.
   - glossy-googly: schärferer Glint (roughness aus `gloss`) = Cute-SpongeBob. KEIN Highlight-Mesh,
     KEIN Pivot-Skalieren mehr (beides verursachte Clipping/Herausstehen). `wide` = größerer
     KAPPEN-WINKEL (bleibt auf der Kugel), nicht Skalierung nach vorn.
   - `converge` = leichtes Schielen (− aussen / + innen).

   applyEmote({lidUpper,lidLower,slant,pupil,gaze}) = persistenter Zustand (Editor + Apps).
   track = Pupillen-Blick-WANDER-Amplitude im Idle (klar gelabelt, Feedback B6).
   FX-Slot (spiral/heart) vorgesehen (this.fx) = Backlog.
   Kontrakt: ch = Character (pet-library.v6.js) — braucht ch.inner, ch.THREE, ch.o.makeMat, ch._squash. */

export const PUPIL_STYLES = ['matte-cute', 'glossy-googly'];
export const GAZES = { front: [0, 0], down: [0, -0.85], away: [0.9, 0.2] };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class EyeRig {
  constructor(ch, opts = {}) {
    this.ch = ch; this.THREE = ch.THREE;
    this.anchor = Object.assign({ dx: 0.345, dy: -0.10, ring: 0.30, track: 0.10 }, opts.anchor || {});
    this.pupilStyle = PUPIL_STYLES.includes(opts.pupilStyle) ? opts.pupilStyle : 'matte-cute';
    this.blink = Object.assign({ minGap: 2.5, maxGap: 6.5, dur: 0.12 }, opts.blink || {});
    this.pupilSize = opts.pupilSize != null ? opts.pupilSize : 0.5;   // 0..1 -> Kappen-Winkel
    this.inset = opts.inset != null ? opts.inset : 0.0;               // 0..1 -> Tiefe in den Körper
    this.lidFit = opts.lidFit != null ? opts.lidFit : 0.9;            // 0 locker .. 1 eng
    this.gloss = opts.gloss != null ? opts.gloss : 0.85;              // Glanz für glossy-googly
    this.converge = opts.converge != null ? opts.converge : 0;        // Schielen: − aussen / + innen
    this.baseColor = opts.baseColor != null ? opts.baseColor : 0xf2c93c;
    this.lidSampler = opts.lidSampler || null;   // v6 (opt-in): fn(u,v)->THREE.Color der ROHEN Body-Colormap an der Lid-Stelle. null = alte Base-Color-Naeherung (Motion-Editor auf v4 bleibt so).
    this.fx = opts.fx || 'none';
    this.emote = { lidUpper: 0, lidLower: 0, slant: 0, pupil: 'normal', gaze: 'front' };
    this._lid = { u: 0.12, l: 0.06 };
    this._rest = { u: 0.12, l: 0.06 };
    this._blinkT = 1.2 + Math.random() * 2; this._blinkK = -1;
    this._gazeT = 2 + Math.random() * 3;
    this._wide = false;
  }

  _lidColor(uv) {
    // v6: Lid = Body-Colormap AN DER STELLE des Auges (uv aus dem Fit-Raycast), abgedunkelt. Nur wenn
    // ein Sampler gesetzt ist UND der Raycast eine uv geliefert hat, sonst die alte Base-Color-Naeherung
    // (pet.color bzw. Default). Lieber ein gelbes Lid als ein schwarzes Loch.
    let c = null;
    if (this.lidSampler && uv) { try { c = this.lidSampler(uv.x, uv.y); } catch (e) { c = null; } }
    if (!c) c = new this.THREE.Color(this.baseColor);
    c.multiplyScalar(0.72);
    c.offsetHSL(0, 0.05, -0.02);
    return c;
  }
  _capAngle() { return 0.12 + clamp(this.pupilSize, 0, 1) * 0.62; }   // rad, Winkel-Radius der Pupille (klein möglich)

  build() {
    const THREE = this.THREE, ch = this.ch;
    this.dispose();
    if (!ch.inner) return;
    const meshes = [];
    ch.inner.traverse((n) => { if (n.isMesh && !n.userData.petOverlay) meshes.push(n); });
    const body = ch._body = meshes.find((m) => m.name && m.name.toLowerCase() === 'body') || meshes[0];
    if (!body) return;
    // U (Augen-Basisgröße) + lc (Augen-Zentrum) aus der GEOMETRIE-LOKALEN BBox des Body — pose-invariant.
    // NICHT aus der Welt-BBox: eine Animations-Rotation vergrößert die achsen-ausgerichtete Welt-BBox
    // -> U -> Augengröße würde bei jedem Rebuild (Pupillengröße/Lid-Fit/inset …) mitwandern (der gemeldete Bug).
    if (!body.geometry.boundingBox) body.geometry.computeBoundingBox();
    const gbb = body.geometry.boundingBox;
    const wsz = gbb.getSize(new THREE.Vector3());
    const lc = gbb.getCenter(new THREE.Vector3());
    const U = wsz.y / 2;
    const A = this.anchor;
    const ray = new THREE.Raycaster(); ray.layers.enableAll();
    const fitAt = (ex, ey) => {
      const oW = body.localToWorld(new THREE.Vector3(ex, ey, U * 3.5));
      const dW = new THREE.Vector3(0, 0, -1).transformDirection(body.matrixWorld).normalize();
      ray.set(oW, dW);
      const hit = ray.intersectObject(body, false)[0];
      // hit.uv wurde bisher verworfen; v6 nutzt sie fuer die Lid-Farbe (Colormap an der Augen-Stelle).
      return hit ? { z: body.worldToLocal(hit.point.clone()).z, uv: hit.uv ? hit.uv.clone() : null }
                 : { z: lc.z + U * 0.7, uv: null };
    };
    const R = this._R = U * A.ring;
    const lidScale = 1.006 + (1 - clamp(this.lidFit, 0, 1)) * 0.05;   // eng .. locker (eng gefasst = kein Spalt zum Eyeball)
    const googly = this.pupilStyle === 'glossy-googly';
    const mk = (o) => (ch.o && ch.o.makeMat) ? ch.o.makeMat(o) : new THREE.MeshStandardMaterial({ color: o.color, roughness: o.roughness != null ? o.roughness : 0.85 });
    // CLAYMATION-Materialzonen (Wallace & Gromit): NUR Augapfel + Pupille sind NASS (Clearcoat-Lack,
    // scharfer Glint), Lider (+ Body) sind matter handgemachter Clay-Skin — kein Plastik-Glanz.
    const matW = new THREE.MeshPhysicalMaterial({ color: 0xf3ede2, roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.0 });                    // Augapfel: feucht/lackiert
    const matP = new THREE.MeshPhysicalMaterial({ color: 0x070707, metalness: 0, roughness: googly ? 0.28 : 0.45, clearcoat: 1, clearcoatRoughness: googly ? clamp(0.13 - this.gloss * 0.11, 0.02, 0.13) : 0.11, envMapIntensity: googly ? 1.35 : 1.0 }); // Pupille: nass, googly = schärfer
    // Kappen-Geometrien
    const cap = this._puAng = this._capAngle();
    const puGeo = new THREE.SphereGeometry(R * 1.004, 30, 22, 0, Math.PI * 2, 0, cap);
    puGeo.rotateX(Math.PI / 2);                                       // Pol -> +Z (Blick nach vorn)
    const upGeo = new THREE.SphereGeometry(R * lidScale, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.56);
    const loGeo = new THREE.SphereGeometry(R * lidScale, 48, 24, 0, Math.PI * 2, Math.PI * 0.44, Math.PI * 0.56);
    const mkEye = (sx) => {
      const ex = lc.x + sx * U * A.dx, ey = lc.y + U * A.dy;
      const fit = fitAt(ex, ey);
      const matL = mk({ color: this._lidColor(fit.uv).getHex(), roughness: 0.98 });   // Lid = Colormap an der Augen-Stelle (v6), sonst Base-Color; matt, gleiche Textur-Skala wie der Body
      const e = new THREE.Group();
      const sc = new THREE.Mesh(new THREE.SphereGeometry(R, 26, 18), matW);
      const puPivot = new THREE.Group();
      const pu = new THREE.Mesh(puGeo, matP);
      puPivot.add(pu);
      // Kein Highlight-Mesh mehr (stach durch die Lider). glossy-googly = echte Spekular-
      // Highlights der 3 Studio-Lichter auf der glänzenden Pupillen-Kappe (Feedback v2→v3).
      const lids = new THREE.Group();
      const up = new THREE.Mesh(upGeo, matL);
      const lo = new THREE.Mesh(loGeo, matL);
      lids.add(up); lids.add(lo);
      e.add(sc); e.add(puPivot); e.add(lids);
      e.traverse((m) => { if (m.isMesh) { m.userData.petOverlay = true; m.raycast = () => {}; m.castShadow = false; m.frustumCulled = false; } });
      e.position.set(ex, ey, fit.z - R * (0.24 + this.inset * 1.15));
      e._uv = fit.uv;
      e._sx = sx; e._pivot = puPivot; e._puMesh = pu; e._up = up; e._lo = lo; e._lids = lids;
      e._px = 0; e._py = 0; e._pvx = 0; e._pvy = 0; e._tx = 0; e._ty = 0;
      return e;
    };
    const rig = new THREE.Group(); rig.userData.petOverlay = true;
    const L = mkEye(-1), Rt = mkEye(1);
    rig.add(L); rig.add(Rt);
    body.add(rig);
    this.rig = rig; this.eyes = [L, Rt];
    this._max = U * A.track;
  }

  setAnchor(patch) { Object.assign(this.anchor, patch || {}); this.build(); }
  setEye(patch) {   // pupilSize/inset/lidFit/gloss/converge
    const p = patch || {}; Object.assign(this, p);
    const keys = Object.keys(p);
    // converge (nur update) + gloss (nur Pupillen-Material) brauchen KEINEN Rebuild —
    // ein Rebuild würde Blick/Blinzeln zurücksetzen (ruckelt beim Reglerziehen).
    if (keys.length && keys.every((k) => k === 'converge' || k === 'gloss')) {
      if ('gloss' in p) this._applyGloss();
      return;
    }
    this.build();
  }
  _applyGloss() {
    if (!this.eyes) return;
    const googly = this.pupilStyle === 'glossy-googly';
    for (const e of this.eyes) {
      const m = e._puMesh && e._puMesh.material; if (!m) continue;
      m.roughness = googly ? 0.28 : 0.45;
      m.clearcoatRoughness = googly ? clamp(0.13 - this.gloss * 0.11, 0.02, 0.13) : 0.11;
      m.needsUpdate = true;
    }
  }
  setPupilStyle(s) { if (PUPIL_STYLES.includes(s)) { this.pupilStyle = s; this.build(); } }
  setBaseColor(hex) { this.baseColor = hex; this.build(); }
  // Lider = BODY-Materialzone -> dem aktuellen Look/Surface/Recolor nachziehen (Host-makeMat),
  // OHNE das ganze Rig neu zu bauen (Kamera/Blink/Emote bleiben). Augapfel+Pupille bleiben nass.
  reskinLids() {
    if (!this.eyes) return;
    const ch = this.ch, THREE = this.THREE;
    const mk = (o) => (ch.o && ch.o.makeMat) ? ch.o.makeMat(o) : new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.98 });
    for (const e of this.eyes) {   // v6: pro Auge aus seiner Colormap-Stelle (asymmetrisch gefaerbte Pets, Panda/Pinguin, korrekt)
      const old = e._up && e._up.material;
      const matL = mk({ color: this._lidColor(e._uv).getHex(), roughness: 0.98, lid: true });   // lid-Flag: Host-makeMat legt die Lider auf den Helligkeits-Detail-Pfad (uLidM), statt volle Triplanar-Textur -> keine Streifen-Ringe auf der gekruemmten Lid-Kappe. Andere Hosts ignorieren das Feld.
      if (e._up) e._up.material = matL; if (e._lo) e._lo.material = matL;
      if (old && old.dispose && old !== matL) old.dispose();
    }
  }
  setBlink(patch) { Object.assign(this.blink, patch || {}); }
  setGazeFollow(on) { this._follow = !!on; if (!on) this._gazeT = 0; }   // Test-Modus: Pupillen folgen dem Cursor
  pointTo(nx, ny) { this._pt = { x: clamp(nx, -1, 1), y: clamp(ny, -1, 1) }; }  // nx/ny = screen-normalisiert (-1..1)
  applyEmote(e) {
    this.emote = Object.assign({ lidUpper: 0, lidLower: 0, slant: 0, pupil: 'normal', gaze: 'front' }, e || {});
  }
  blinkNow() { if (this._blinkK < 0) this._blinkK = 0; }

  // wide/pupilSize ändern den KAPPEN-WINKEL (Pupille bleibt auf der Kugel) statt zu skalieren.
  _setCap(angle) {
    if (!this.eyes) return;
    this._puAng = angle;
    const THREE = this.THREE, R = this._R;
    const g = new THREE.SphereGeometry(R * 1.004, 30, 22, 0, Math.PI * 2, 0, angle);
    g.rotateX(Math.PI / 2);
    for (const e of this.eyes) { if (e._puMesh) { const old = e._puMesh.geometry; e._puMesh.geometry = g; if (old && old !== g) old.dispose(); } }
  }

  update(dt) {
    const eyes = this.eyes; if (!eyes) return;
    const ch = this.ch, E = this.emote;
    if (this.rig && ch._squash) {
      const sy = clamp(ch._squash.s, 0.5, 1.5);
      this.rig.scale.set(1, (1 + (1 - sy) * 0.6) / sy, 1);
    }
    if (this._follow && this._pt) {
      // Cursor-Follow: Pupillen zielen auf die (screen-normalisierte) Mausposition. x negiert,
      // weil das Pet zur Kamera schaut -> positives Yaw ginge sonst zur Betrachter-Linken.
      for (const e of eyes) { e._tx = this._pt.x * this._max; e._ty = this._pt.y * this._max; }
    } else if (E.gaze === 'front') {
      this._gazeT -= dt;
      if (this._gazeT <= 0) {
        this._gazeT = 1.6 + Math.random() * 3.2;
        const a = Math.random() * Math.PI * 2, r = this._max * (0.3 + Math.random() * 0.6);
        for (const e of eyes) { e._tx = Math.cos(a) * r; e._ty = Math.sin(a) * r; }
      }
    } else {
      const g = GAZES[E.gaze] || GAZES.front;
      for (const e of eyes) { e._tx = g[0] * this._max; e._ty = g[1] * this._max; }
    }
    const tu = clamp(this._rest.u + E.lidUpper, -0.35, 1);
    const tl = clamp(this._rest.l + E.lidLower, -0.35, 1);
    this._lid.u += (tu - this._lid.u) * Math.min(1, dt * 9);
    this._lid.l += (tl - this._lid.l) * Math.min(1, dt * 9);
    this._blinkT -= dt;
    if (this._blinkK < 0 && this._blinkT <= 0) {
      this._blinkK = 0;
      this._blinkT = this.blink.minGap + Math.random() * Math.max(0.1, this.blink.maxGap - this.blink.minGap);
    }
    let bl = 0;
    if (this._blinkK >= 0) {
      this._blinkK += dt / Math.max(0.05, this.blink.dur);
      bl = Math.sin(Math.min(this._blinkK, 1) * Math.PI);
      if (this._blinkK >= 1) this._blinkK = -1;
    }
    const cu = Math.min(1, Math.max(this._lid.u, bl));
    const cl = Math.min(1, Math.max(this._lid.l, bl));
    const wide = E.pupil === 'wide';
    if (wide !== this._wide) { this._wide = wide; this._setCap(this._capAngle() * (wide ? 1.4 : 1)); }
    const maxAng = 0.5;
    for (const e of eyes) {
      e._pvx += (e._tx - e._px) * 150 * dt - e._pvx * 13 * dt; e._px += e._pvx * dt;
      e._pvy += (e._ty - e._py) * 150 * dt - e._pvy * 13 * dt; e._py += e._pvy * dt;
      const nx = this._max ? e._px / this._max : 0, ny = this._max ? e._py / this._max : 0;
      // Blick + statisches Schielen (converge: + = innen zur Nase, − = aussen)
      e._pivot.rotation.set(-ny * maxAng, nx * maxAng - e._sx * this.converge * maxAng, 0);
      e._up.rotation.x = -(1.30 - cu * 1.18);
      e._lo.rotation.x = (1.30 - cl * 1.18);
      e._lids.rotation.z = -e._sx * (E.slant || 0) * 0.85;
    }
  }

  dispose() {
    if (this.rig && this.rig.parent) this.rig.parent.remove(this.rig);
    this.rig = null; this.eyes = null;
  }
}
