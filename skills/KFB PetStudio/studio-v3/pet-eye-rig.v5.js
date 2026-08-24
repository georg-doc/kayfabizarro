/* pet-eye-rig.v5.js — Fork von pet-eye-rig.v4.js (2026-07-17, Brief „die Augen als Actor").
   Geometrie-Kern, Materialzonen, Blink, lidSampler (v6-Editor), reskinLids: UNVERÄNDERT aus v4.
   Motion-Editor + Infinite Journey bleiben auf v4 — v5 ist die Actor-Erprobung (Pet-Editor v8).

   DREI EINGRIFFE (alle additiv/rückwärtskompatibel):
   1) ASYMMETRIE — lidUpper/lidLower/slant akzeptieren Zahl ODER [links, rechts].
      Eine Zahl heißt beide Augen (v4-Verhalten, die 6 Contract-Emotes bleiben wie sie sind),
      ein Array heißt links/rechts. Der Loop hatte den Index schon — jetzt benutzt er ihn.
      Lid-Glättung dafür pro Auge (this._pe), Blink bleibt global (beide Augen zusammen).
   2) KINETIK-KANAL — setKinetics({a,c,j}): das Gesicht liest die KINETIK, nicht die Geschichte.
      a = Beschleunigung (− Bremse), c = Kurve (−L/+R), j = Fall (+ Drop). Intern geglättet.
      Bremse → Sorge (Oberlid leicht zu, Slant up-out) · Kurve → Blick nach außen + das
      kurvenäußere Auge weiter offen (Asymmetrie!) · Drop → Schreck (Lider weit auf, Blick runter).
      Die Text-Bild-Schere entsteht beim Aufrufer: Stimme erzählt Karte/Mode, Gesicht liest a/c/j.
   3) LEBEN (Wandern + Zittern) — setLife({on,wander,tremor}): kein Auswählen aus 6 Emotes,
      sondern langsames Driften der stufenlosen Lid-/Slant-Werte (Richtung neutral↔thinking,
      leicht dekorreliert pro Auge) + feines Zittern, das nie ganz zur Ruhe kommt. Layered-Sines,
      pro Instanz phasenversetzt — deterministisch ruhig, kein Würfeln. Skaliert runter, wenn
      Kinetik aktiv ist (die Physik hat Vorrang, das Leben füllt die Stille). */

export const PUPIL_STYLES = ['matte-cute', 'glossy-googly'];
export const GAZES = { front: [0, 0], down: [0, -0.85], away: [0.9, 0.2] };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = (v, i) => Array.isArray(v) ? (v[i] != null ? v[i] : (v[0] || 0)) : (v || 0);   // Eingriff 1: Zahl = beide, Array = [L,R]

export class EyeRig {
  constructor(ch, opts = {}) {
    this.ch = ch; this.THREE = ch.THREE;
    this.anchor = Object.assign({ dx: 0.345, dy: -0.10, ring: 0.30, track: 0.10 }, opts.anchor || {});
    this.pupilStyle = PUPIL_STYLES.includes(opts.pupilStyle) ? opts.pupilStyle : 'matte-cute';
    this.blink = Object.assign({ minGap: 2.5, maxGap: 6.5, dur: 0.12 }, opts.blink || {});
    this.pupilSize = opts.pupilSize != null ? opts.pupilSize : 0.5;
    this.inset = opts.inset != null ? opts.inset : 0.0;
    this.lidFit = opts.lidFit != null ? opts.lidFit : 0.9;
    this.gloss = opts.gloss != null ? opts.gloss : 0.85;
    this.converge = opts.converge != null ? opts.converge : 0;
    this.baseColor = opts.baseColor != null ? opts.baseColor : 0xf2c93c;
    this.lidSampler = opts.lidSampler || null;
    this.fx = opts.fx || 'none';
    this.lashes = opts.lashes || null;   // Wimpern: {length,density} pro Pet (Overlay auf der oberen Lidschale)
    this.emote = { lidUpper: 0, lidLower: 0, slant: 0, pupil: 'normal', gaze: 'front' };
    this._lid = { u: 0.12, l: 0.06 };                                   // v4-Feld, ungenutzt (Kompat)
    this._rest = { u: 0.12, l: 0.06 };
    this._pe = [{ u: 0.12, l: 0.06 }, { u: 0.12, l: 0.06 }];            // v5: Lid-Glättung PRO Auge
    this._blinkT = 1.2 + Math.random() * 2; this._blinkK = -1;
    this._gazeT = 2 + Math.random() * 3;
    this._wide = false;
    // v5 Eingriff 2: Kinetik (Ziel + geglättet)
    this.kinetics = Object.assign({ enabled: true, gain: 1 }, opts.kinetics || {});
    this._kinT = { a: 0, c: 0, j: 0 }; this._kin = { a: 0, c: 0, j: 0 };
    // v5 Eingriff 3: Leben
    this.life = Object.assign({ on: true, wander: 0.45, tremor: 0.35 }, opts.life || {});
    this._t = Math.random() * 50; this._phase = Math.random() * 100;
  }

  _lidColor(uv) {
    let c = null;
    if (this.lidSampler && uv) { try { c = this.lidSampler(uv.x, uv.y); } catch (e) { c = null; } }
    if (!c) c = new this.THREE.Color(this.baseColor);
    c.multiplyScalar(0.72);
    c.offsetHSL(0, 0.05, -0.02);
    return c;
  }
  _capAngle() { return 0.12 + clamp(this.pupilSize, 0, 1) * 0.62; }

  build() {
    const THREE = this.THREE, ch = this.ch;
    this.dispose();
    if (!ch.inner) return;
    const meshes = [];
    ch.inner.traverse((n) => { if (n.isMesh && !n.userData.petOverlay) meshes.push(n); });
    const body = ch._body = meshes.find((m) => m.name && m.name.toLowerCase() === 'body') || meshes[0];
    if (!body) return;
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
      return hit ? { z: body.worldToLocal(hit.point.clone()).z, uv: hit.uv ? hit.uv.clone() : null }
                 : { z: lc.z + U * 0.7, uv: null };
    };
    const R = this._R = U * A.ring;
    const lidScale = 1.006 + (1 - clamp(this.lidFit, 0, 1)) * 0.05;
    const googly = this.pupilStyle === 'glossy-googly';
    const mk = (o) => (ch.o && ch.o.makeMat) ? ch.o.makeMat(o) : new THREE.MeshStandardMaterial({ color: o.color, roughness: o.roughness != null ? o.roughness : 0.85 });
    const matW = new THREE.MeshPhysicalMaterial({ color: 0xf3ede2, roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.0 });
    const matP = new THREE.MeshPhysicalMaterial({ color: 0x070707, metalness: 0, roughness: googly ? 0.28 : 0.45, clearcoat: 1, clearcoatRoughness: googly ? clamp(0.13 - this.gloss * 0.11, 0.02, 0.13) : 0.11, envMapIntensity: googly ? 1.35 : 1.0 });
    const cap = this._puAng = this._capAngle();
    const puGeo = new THREE.SphereGeometry(R * 1.004, 30, 22, 0, Math.PI * 2, 0, cap);
    puGeo.rotateX(Math.PI / 2);
    const upGeo = new THREE.SphereGeometry(R * lidScale, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.56);
    const loGeo = new THREE.SphereGeometry(R * lidScale, 48, 24, 0, Math.PI * 2, Math.PI * 0.44, Math.PI * 0.56);
    const mkEye = (sx) => {
      const ex = lc.x + sx * U * A.dx, ey = lc.y + U * A.dy;
      const fit = fitAt(ex, ey);
      const matL = mk({ color: this._lidColor(fit.uv).getHex(), roughness: 0.98, lid: true });   // lid-Flag: Host-Shader lässt die dunkle Base stehen (keine paperGold-Bleiche)
      const e = new THREE.Group();
      const sc = new THREE.Mesh(new THREE.SphereGeometry(R, 26, 18), matW);
      const puPivot = new THREE.Group();
      const pu = new THREE.Mesh(puGeo, matP);
      puPivot.add(pu);
      const lids = new THREE.Group();
      const up = new THREE.Mesh(upGeo, matL);
      const lo = new THREE.Mesh(loGeo, matL);
      lids.add(up); lids.add(lo);
      const lashCol = this._lidColor(fit.uv).multiplyScalar(0.5).getHex();   // dunkler Base-Color-Ton des Pets (wie die Lider, noch dunkler)
      this._addLashes(up, R, lashCol);
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
    this.rig = rig; this.eyes = [L, Rt];                                // Index 0 = links, 1 = rechts (Eingriff 1 adressiert sie einzeln)
    this._max = U * A.track;
  }

  // Wimpern: dunkle Kegel entlang der vorderen Oberlid-Kante, radial nach aussen + nach oben gekippt.
  // Kind des Oberlid-Mesh -> folgt Blink/Oeffnen. length/density aus dem Contract (pro Pet).
  _addLashes(up, R, colorHex) {
    const lash = this.lashes; if (!lash) return;
    const n = Math.max(0, Math.round(lash.density || 0)), len = lash.length || 0, w = lash.width != null ? lash.width : 1;
    if (n < 1 || len <= 0) return;
    const T = this.THREE;
    const grp = new T.Group();
    const mat = new T.MeshBasicMaterial({ color: (colorHex != null ? colorHex : 0x160f0b), toneMapped: false });
    const rimPhi = Math.PI * 0.55, half = Math.PI * 0.40, L = R * len * 0.9, rad = R * 1.02, br = R * 0.06 * Math.max(0.15, w);
    for (let i = 0; i < n; i++) {
      const th = n === 1 ? 0 : (-half + 2 * half * (i / (n - 1)));
      const sinP = Math.sin(rimPhi), cosP = Math.cos(rimPhi);
      const px = rad * sinP * Math.sin(th), py = rad * cosP, pz = rad * sinP * Math.cos(th);
      const geo = new T.ConeGeometry(br, L, 6); geo.translate(0, L / 2, 0);
      const m = new T.Mesh(geo, mat);
      m.position.set(px, py, pz);
      const outward = new T.Vector3(px, py, pz).normalize();
      const dir = outward.clone().lerp(new T.Vector3(0, 1, 0), 0.55).normalize();
      m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
      grp.add(m);
    }
    grp.traverse((x) => { if (x.isMesh) { x.userData.petOverlay = true; x.raycast = () => {}; x.castShadow = false; x.frustumCulled = false; } });
    up.add(grp);
  }
  setLashes(patch) { this.lashes = Object.assign({ length: 0, density: 6, width: 1 }, this.lashes || {}, patch || {}); this.build(); }
  setAnchor(patch) { Object.assign(this.anchor, patch || {}); this.build(); }
  setEye(patch) {
    const p = patch || {}; Object.assign(this, p);
    const keys = Object.keys(p);
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
  reskinLids() {
    if (!this.eyes) return;
    const ch = this.ch, THREE = this.THREE;
    const mk = (o) => (ch.o && ch.o.makeMat) ? ch.o.makeMat(o) : new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.98 });
    for (const e of this.eyes) {
      const old = e._up && e._up.material;
      const matL = mk({ color: this._lidColor(e._uv).getHex(), roughness: 0.98, lid: true });
      if (e._up) e._up.material = matL; if (e._lo) e._lo.material = matL;
      if (old && old.dispose && old !== matL) old.dispose();
    }
  }
  setBlink(patch) { Object.assign(this.blink, patch || {}); }
  setGazeFollow(on) { this._follow = !!on; if (!on) this._gazeT = 0; }
  pointTo(nx, ny) { this._pt = { x: clamp(nx, -1, 1), y: clamp(ny, -1, 1) }; }
  applyEmote(e) {
    this.emote = Object.assign({ lidUpper: 0, lidLower: 0, slant: 0, pupil: 'normal', gaze: 'front' }, e || {});
  }
  blinkNow() { if (this._blinkK < 0) this._blinkK = 0; }
  // v5 Eingriff 2: der Kinetik-Eingang. Werte bleiben stehen, bis neue kommen; intern geglättet.
  setKinetics(k) {
    k = k || {};
    if (k.a != null) this._kinT.a = clamp(k.a, -1.5, 1.5);
    if (k.c != null) this._kinT.c = clamp(k.c, -1.5, 1.5);
    if (k.j != null) this._kinT.j = clamp(k.j, -1.5, 1.5);
    if (k.enabled != null) this.kinetics.enabled = !!k.enabled;
    if (k.gain != null) this.kinetics.gain = k.gain;
  }
  // v5 Eingriff 3: Leben an/aus + Stärken (wander 0..1, tremor 0..1)
  setLife(patch) { Object.assign(this.life, patch || {}); }

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
    this._t += dt;
    if (this.rig && ch._squash) {
      const sy = clamp(ch._squash.s, 0.5, 1.5);
      this.rig.scale.set(1, (1 + (1 - sy) * 0.6) / sy, 1);
    }
    // Kinetik glätten — das Gesicht liest a/c/j, nicht die Geschichte (Eingriff 2)
    const K = this._kin, KT = this._kinT, kr = Math.min(1, dt * 7);
    K.a += (KT.a - K.a) * kr; K.c += (KT.c - K.c) * kr; K.j += (KT.j - K.j) * kr;
    const kg = this.kinetics.enabled ? this.kinetics.gain : 0;
    const brake = Math.max(0, -K.a) * kg, drop = Math.max(0, K.j) * kg;
    const kinAct = clamp((Math.abs(K.a) + Math.abs(K.c) + Math.abs(K.j)) * kg, 0, 1);
    // Blick: Follow > Kinetik (Kurve → außen, Drop → runter) > Idle-Wander > feste Gaze
    if (this._follow && this._pt) {
      for (const e of eyes) { e._tx = this._pt.x * this._max; e._ty = this._pt.y * this._max; }
    } else if (kinAct > 0.2 && kg > 0) {
      const gx = clamp(-K.c * 1.1, -1, 1) * kg;
      const gy = clamp(-K.j * 0.7 + K.a * 0.25, -1, 1) * kg;
      for (const e of eyes) { e._tx = gx * this._max; e._ty = gy * this._max; }
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
    // Kinetik → Lider: Bremse = Sorge, Drop = Schreck, Kurve = kurvenäußeres Auge weiter offen
    const kinU = brake * 0.28 - drop * 0.50;
    const kinL = brake * 0.12 - drop * 0.30;
    const kinS = brake * 0.40 - drop * 0.10;
    const kinUA = K.c * 0.14 * kg;                                     // per _sx eingemischt → Asymmetrie aus der Kurve
    // Leben: langsames Driften (neutral↔thinking, pro Auge dekorreliert) + feines Zittern.
    // Layered Sines statt Würfeln; skaliert runter, wenn Kinetik spricht (Eingriff 3).
    const L = this.life, la = (L.on ? 1 : 0) * (1 - kinAct * 0.85);
    const t = this._t, ph = this._phase;
    const dr = (s) => Math.sin(t * 0.23 + s) * 0.5 + Math.sin(t * 0.61 + s * 2.7) * 0.33 + Math.sin(t * 1.31 + s * 5.1) * 0.17;
    const tr = (s) => Math.sin(t * 8.7 + s) * 0.6 + Math.sin(t * 14.3 + s * 3.3) * 0.4;
    const lifeU = (i) => la * (L.wander * 0.22 * (0.5 + 0.5 * dr(ph + i * 3.7)) + L.tremor * 0.020 * tr(ph + i * 9.1));
    const lifeL = (i) => la * (L.wander * 0.10 * (0.5 + 0.5 * dr(ph + 11 + i * 2.9)) + L.tremor * 0.015 * tr(ph + 4 + i * 7.7));
    const lifeS = (i) => la * (L.wander * 0.12 * dr(ph + 23 + i * 4.3) + L.tremor * 0.012 * tr(ph + 8 + i * 5.3));
    // Blink global (beide Augen zusammen — Asymmetrie kommt aus Lid/Slant, nicht aus dem Blinzeln)
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
    const wide = E.pupil === 'wide';
    if (wide !== this._wide) { this._wide = wide; this._setCap(this._capAngle() * (wide ? 1.4 : 1)); }
    const maxAng = 0.5;
    for (let i = 0; i < eyes.length; i++) {
      const e = eyes[i], P = this._pe[i] || (this._pe[i] = { u: 0.12, l: 0.06 });
      // Eingriff 1: pick() — eine Zahl heißt beide Augen, ein Array heißt [links, rechts]
      const tu = clamp(this._rest.u + pick(E.lidUpper, i) + kinU + e._sx * kinUA + lifeU(i), -0.35, 1);
      const tl = clamp(this._rest.l + pick(E.lidLower, i) + kinL + lifeL(i), -0.35, 1);
      P.u += (tu - P.u) * Math.min(1, dt * 9);
      P.l += (tl - P.l) * Math.min(1, dt * 9);
      const cu = Math.min(1, Math.max(P.u, bl));
      const cl = Math.min(1, Math.max(P.l, bl));
      e._pvx += (e._tx - e._px) * 150 * dt - e._pvx * 13 * dt; e._px += e._pvx * dt;
      e._pvy += (e._ty - e._py) * 150 * dt - e._pvy * 13 * dt; e._py += e._pvy * dt;
      const nx = this._max ? e._px / this._max : 0, ny = this._max ? e._py / this._max : 0;
      e._pivot.rotation.set(-ny * maxAng, nx * maxAng - e._sx * this.converge * maxAng, 0);
      e._up.rotation.x = -(1.30 - cu * 1.18);
      e._lo.rotation.x = (1.30 - cl * 1.18);
      e._lids.rotation.z = -e._sx * (pick(E.slant, i) + kinS + lifeS(i)) * 0.85;
    }
  }

  dispose() {
    if (this.rig && this.rig.parent) this.rig.parent.remove(this.rig);
    this.rig = null; this.eyes = null;
  }
}
