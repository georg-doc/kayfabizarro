/* kfb-fx-sprites.js · Instanced-Sprite-Renderer fuer den KFB-Mech-Slice (S0, v6)
 *
 * WAS ES ERSETZT
 * v5 hielt 220 Tusche-Sprites und 12 Flipbook-Sprites als je EIGENES Mesh mit je
 * EIGENEM Material. Jeder lebende Sprite war ein Draw-Call und ein Uniform-Upload;
 * bei Dauerfeuer auf drei Ziele 60–120 Draw-Calls nur fuer Tusche.
 *
 * WAS ES TUT
 * Vier InstancedMeshes — Atlas×{additiv, normal}, Flipbook×{additiv, normal} — also
 * hoechstens VIER Draw-Calls fuer alle Sprites zusammen. Pro Instanz: Matrix
 * (Billboard zur Kamera, Drehung um Z, Groesse × Seitenverhaeltnis, Spiegelung),
 * Farbe, Deckkraft und UV-Fenster (welche Kachel / welches Frame).
 *
 * VERHALTEN = v5. S0 ist ein Modulschnitt OHNE Verhaltensaenderung: dieselben Felder
 * (life, size, grow, ar, op, fade, rot, spin, vel, grav, drag, mirror), dieselben
 * Formeln (lineares Wachstum, Deckkraft (1-k)^fade, Entfernungs-Boden 1+min(.55,d/150)).
 * S2 (2.9.2026): Kurven, Seeds, Farbrampe — HIER, nicht im Wirt. Vorlage ist der
 * hit_burst.gdshader aus FreeHitVfx (Godot, als SOP gelesen): Einblenden in 7 % der
 * Lebenszeit, Weissglut → Hauptfarbe bei 3–26 %, Noise-Dissolve statt Alpha-Fade ab
 * 55 %, Groesse springt (Pop) statt linear zu wachsen. Gilt fuer Sprites mit `pop: true`;
 * alles andere (Rauch, Staub, Marken-Sprites) behaelt die v5-Formeln.
 * Flipbooks: MEHRERE Blaetter auf einer Textur (`sheets`), `emitFlip({ sheet })`.
 *
 * EINE bekannte Abweichung: innerhalb eines InstancedMesh zeichnet WebGL die
 * Instanzen in Index-Reihenfolge, nicht nach Tiefe. Fuer additive Sprites ist das
 * folgenlos (Addition kommutiert). Fuer normal geblendeten Rauch kann sich die
 * Ueberlappung zweier Wolken minimal anders schichten als in v5. Gemessen wird
 * das in der S0-Abnahme; wenn es stoert, sortiert `step()` die Normal-Gruppe nach
 * Kameraabstand (eine Zeile, kostet O(n log n) bei n ≤ 60).
 *
 * SHADER-PATCH statt eigenem Material: MeshBasicMaterial bleibt (Farbe, Map, Fog,
 * Tone-Mapping wie in v5), nur zwei Attribute kommen dazu — `iUv` (Fenster) und
 * `iOp` (Deckkraft). `onBeforeCompile` ersetzt genau zwei Includes. Damit gilt fuer
 * die Tusche weiterhin alles, was fuer jedes andere Material der Szene gilt.
 */

export class SpriteFx {
  /* THREE  · die three-Instanz des Wirts (KEIN eigener Import — eine Instanz pro Seite)
     scene  · wohin die vier Meshes kommen
     o.atlas  { tex, cols, rows, cells: ['burst', …] }  Tusche-Atlas, Kachelnamen = UV-Index
     o.flip   { tex, cols, rows, frames } | null        Flipbook
     o.cap, o.flipCap · Plaetze (v5: 220 / 12) */
  constructor(THREE, scene, o) {
    this.THREE = THREE; this.scene = scene;
    this.enabled = true;
    this.cells = (o.atlas && o.atlas.cells) || [];
    this.atlas = o.atlas ? { cols: o.atlas.cols || 4, rows: o.atlas.rows || 3 } : null;
    this.flip = o.flip ? { cols: o.flip.cols, rows: o.flip.rows, frames: o.flip.frames } : null;
    this.cap = o.cap || 220; this.flipCap = o.flipCap || 12;
    this.sprites = []; this.flips = []; this._cur = 0;
    for (let i = 0; i < this.cap; i++) this.sprites.push({ live: false, kind: 'atlas', pos: new THREE.Vector3(), col: new THREE.Color() });
    for (let i = 0; i < this.flipCap; i++) this.flips.push({ live: false, kind: 'flip', frame: -1, pos: new THREE.Vector3(), col: new THREE.Color() });
    this.live = 0; this.liveFlips = 0;
    this.groups = {
      atlasAdd: this._group(o.atlas && o.atlas.tex, this.cap, true, 3),
      atlasNorm: this._group(o.atlas && o.atlas.tex, this.cap, false, 3),
      flipAdd: this._group(o.flip && o.flip.tex, this.flipCap, true, 4),
      flipNorm: this._group(o.flip && o.flip.tex, this.flipCap, false, 4)
    };
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._qz = new THREE.Quaternion();
    this._s = new THREE.Vector3(); this._z = new THREE.Vector3(0, 0, 1);
  }

  _group(tex, n, add, order) {
    const THREE = this.THREE;
    const geo = new THREE.PlaneGeometry(1, 1);
    const iUv = new THREE.InstancedBufferAttribute(new Float32Array(n * 4), 4);
    const iOp = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
    const iK = new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2);   // x = Fortschritt 0..1, y = pop-Flag + Seed
    iUv.setUsage(THREE.DynamicDrawUsage); iOp.setUsage(THREE.DynamicDrawUsage); iK.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('iUv', iUv); geo.setAttribute('iOp', iOp); geo.setAttribute('iK', iK);
    const mat = new THREE.MeshBasicMaterial({
      map: tex || null, transparent: true, depthWrite: false,
      blending: add ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec4 iUv; attribute float iOp; attribute vec2 iK; varying float vOp; varying vec2 vK; varying vec2 vUvRaw;')
        .replace('#include <uv_vertex>', 'vMapUv = uv * iUv.zw + iUv.xy; vOp = iOp; vK = iK; vUvRaw = uv;');
      /* Die Kurve (FreeHitVfx hit_burst, portiert): nur wenn iK.y >= 1 (pop).
         env_in  · smoothstep(0, .07, k)  — ein Bild spaeter ist der Burst voll da
         Rampe   · weiss → Instanzfarbe ueber smoothstep(.03, .26, k) — die heisse Phase ist kurz
         Dissolve· Value-Noise (Hash aus uv + Seed) frisst die Form ab k = .55; Kante bleibt hell.
         Ohne pop: Verhalten wie v5 (nur iOp). */
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vOp; varying vec2 vK; varying vec2 vUvRaw;\n'
          + 'float kfbHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n'
          + 'float kfbNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(kfbHash(i), kfbHash(i+vec2(1,0)), f.x), mix(kfbHash(i+vec2(0,1)), kfbHash(i+vec2(1,1)), f.x), f.y); }')
        .replace('#include <color_fragment>', '#include <color_fragment>\n'
          + 'diffuseColor.a *= vOp;\n'
          + 'if (vK.y >= 1.0) {\n'
          + '  float k = vK.x, seed = vK.y - 1.0;\n'
          + '  diffuseColor.rgb = mix(vec3(1.0), diffuseColor.rgb, smoothstep(0.03, 0.26, k));\n'
          + '  float n = kfbNoise(vUvRaw * 5.0 + seed * 17.0);\n'
          + '  float thr = smoothstep(0.55, 1.0, k) * 1.12 - 0.06;\n'
          + '  float vis = smoothstep(thr, thr + 0.06, n);\n'
          + '  float edge = (1.0 - smoothstep(thr + 0.06, thr + 0.14, n)) * vis * step(0.02, thr);\n'
          + '  diffuseColor.rgb += vec3(1.0, 0.85, 0.55) * edge * 0.7;\n'
          + '  diffuseColor.a *= smoothstep(0.0, 0.07, k) * vis;\n'
          + '}');
    };
    mat.customProgramCacheKey = () => 'kfb-sprite-' + (add ? 'add' : 'norm');
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    mesh.count = 0; mesh.frustumCulled = false; mesh.renderOrder = order;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.visible = !!tex;
    this.scene.add(mesh);
    return { mesh, iUv, iOp, iK, n };
  }

  /* Loader-Hook aus v5: ein PNG mit demselben Raster ersetzt die Zeichnung. */
  setAtlasTexture(tex) {
    for (const k of ['atlasAdd', 'atlasNorm']) { const g = this.groups[k]; g.mesh.material.map = tex; g.mesh.material.needsUpdate = true; g.mesh.visible = true; }
  }
  setFlipbook(tex, cols, rows, frames, sheets) {
    this.flip = { cols, rows, frames, sheets: sheets || 1 };
    for (const k of ['flipAdd', 'flipNorm']) { const g = this.groups[k]; g.mesh.material.map = tex; g.mesh.material.needsUpdate = true; g.mesh.visible = true; }
  }
  get hasFlip() { return !!(this.flip && this.groups.flipAdd.mesh.material.map); }

  /* Gleiche Signatur wie v5 `_emitSprite(cell, pos, o)`. Rueckgabe: das Sprite-Objekt. */
  emit(cell, pos, o) {
    if (!this.enabled || !this.atlas) return null;
    let s = null;
    for (let i = 0; i < this.sprites.length; i++) {
      const k = (this._cur + i) % this.sprites.length;
      if (!this.sprites[k].live) { s = this.sprites[k]; this._cur = (k + 1) % this.sprites.length; break; }
    }
    if (!s) return null;   // Pool voll: das Ereignis faellt aus, statt die Szene wachsen zu lassen
    s.cell = Math.max(0, this.cells.indexOf(cell));
    s.col.setHex(o.color == null ? 0xffffff : o.color);
    /* ADDITIV ADDIERT LICHT, und Schwarz addiert nichts. Gemessen am Ink Mortar:
       fuenf Muendungsfunken je Schuss, additiv in 0x1f1a14 — fuenf belegte
       Poolplaetze ohne ein einziges Pixel. Eine zu dunkle Farbe wird deshalb
       normal geblendet, statt unsichtbar zu sein. Die Entscheidung gehoert HIER
       hin und nicht an die 20 Aufrufstellen. */
    s.add = !!o.add && Math.max(s.col.r, s.col.g, s.col.b) > 0.35;
    s.pos.copy(pos);
    s.live = true;
    s.life = s.life0 = o.life || 0.16;
    s.size = o.size || 1; s.ar = o.ar || 1;
    s.grow = o.grow == null ? 0.6 : o.grow;
    s.rot = o.rot || 0; s.spin = o.spin || 0;
    s.op = o.op == null ? 1 : o.op;
    s.fade = o.fade || 1;
    s.vel = o.vel || null; s.grav = o.grav || 0; s.drag = o.drag || 0;
    s.mirror = 1;
    s.pop = !!o.pop; s.seed = o.seed == null ? 0 : (o.seed % 97) / 97;
    return s;
  }

  /* Gleiche Signatur wie v5 `_emitFlip(pos, o)`. */
  emitFlip(pos, o) {
    if (!this.enabled || !this.hasFlip) return null;
    const s = this.flips.find((x) => !x.live);
    if (!s) return null;
    s.live = true; s.frame = -1;
    s.add = !!o.add;
    s.col.setHex(o.color == null ? 0xffffff : o.color);
    s.pos.copy(pos);
    s.life = s.life0 = o.life || 0.6;
    s.size = o.size || 2; s.grow = o.grow == null ? 0.4 : o.grow;
    s.op = o.op == null ? 1 : o.op; s.fade = o.fade || 1.4;
    s.rot = o.rot || 0; s.mirror = o.mirror || 1; s.ar = 1; s.spin = 0;
    s.vel = o.vel || null; s.grav = o.grav || 0; s.drag = o.drag || 0;
    s.sheet = o.sheet || 0; s.pop = false; s.seed = 0;
    return s;
  }

  /* Streuung. S2: mit `o.seed` deterministisch (mulberry32) — derselbe Schuss streut
     gleich, zwei Schuesse verschieden. Ohne Seed wie v5 (Math.random). */
  scatter(cell, pos, n, o) {
    const THREE = this.THREE;
    const rnd = o.seed == null ? Math.random : SpriteFx.rng(o.seed);
    for (let i = 0; i < n; i++) {
      const d = (o.dir ? o.dir.clone() : new THREE.Vector3(0, 1, 0))
        .add(new THREE.Vector3((rnd() - 0.5) * 2, (rnd() - 0.3) * 2, (rnd() - 0.5) * 2).multiplyScalar(o.spread == null ? 1 : o.spread))
        .normalize().multiplyScalar((o.speed || 5) * (0.5 + rnd()));
      this.emit(cell, pos.clone().addScaledVector(d, 0.02), {
        color: o.color, add: o.add, size: (o.size || 0.4) * (0.7 + rnd() * 0.7),
        life: (o.life || 0.3) * (0.7 + rnd() * 0.6), grow: o.grow == null ? 0.3 : o.grow,
        rot: rnd() * 6.2832, spin: (rnd() - 0.5) * 6, vel: d, grav: o.grav == null ? 14 : o.grav,
        drag: o.drag == null ? 1.6 : o.drag, op: o.op, seed: o.seed == null ? undefined : o.seed + i
      });
    }
  }
  static rng(seed) { let a = (seed | 0) + 0x6d2b79f5; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* Ein Schritt: Lebenszeit, Bewegung, dann alle lebenden Instanzen in die vier
     Gruppen schreiben. `cam` liefert Blickrichtung (Billboard) und Abstand (Boden). */
  step(dt, cam) {
    const G = this.groups;
    let nA = 0, nN = 0, nFA = 0, nFN = 0, live = 0, liveF = 0;
    const q = cam.quaternion, cp = cam.position;
    for (const s of this.sprites) {
      if (!s.live) continue;
      s.life -= dt;
      if (s.life <= 0) { s.live = false; continue; }
      live++;
      const k = 1 - s.life / s.life0;
      if (s.vel) {
        s.pos.addScaledVector(s.vel, dt);
        if (s.grav) s.vel.y -= s.grav * dt;
        if (s.drag) s.vel.multiplyScalar(Math.max(0, 1 - s.drag * dt));
      }
      /* M5: die Feder liegt auf der Bildebene — Entfernungs-Boden wie in v5 */
      const dist = cp.distanceTo(s.pos);
      const ek = s.pop ? 1 - Math.pow(1 - k, 3.2) : k;   // pop: 85 % der Groesse im ersten Bild, dann Rest
      const sc = s.size * (1 + s.grow * ek) * (1 + Math.min(0.55, dist / 150));
      const op = s.pop ? s.op : s.op * Math.pow(1 - k, s.fade);   // pop: Ausblenden macht der Dissolve im Shader
      const g = s.add ? G.atlasAdd : G.atlasNorm;
      const i = s.add ? nA++ : nN++;
      this._write(g, i, s, q, sc * s.ar, sc, s.rot + s.spin * k, op, this._atlasUV(s.cell, 1), k);
    }
    if (this.flip) {
      const F = this.flip;
      for (const s of this.flips) {
        if (!s.live) continue;
        s.life -= dt;
        if (s.life <= 0) { s.live = false; continue; }
        liveF++;
        const k = 1 - s.life / s.life0;
        s.frame = Math.min(F.frames - 1, Math.floor(k * F.frames));
        const sc = s.size * (1 + s.grow * k);
        const op = s.op * Math.pow(1 - k, s.fade);
        const g = s.add ? G.flipAdd : G.flipNorm;
        const i = s.add ? nFA++ : nFN++;
        /* negatives X = gespiegelt, oben bleibt oben (Georgs Einwand aus v5) */
        if (s.vel) { s.pos.addScaledVector(s.vel, dt); if (s.drag) s.vel.multiplyScalar(Math.max(0, 1 - s.drag * dt)); }
        this._write(g, i, s, q, sc * (s.mirror || 1), sc, s.rot, op, this._flipUV(s.frame, s.sheet), k);
      }
    }
    this._flush(G.atlasAdd, nA); this._flush(G.atlasNorm, nN);
    this._flush(G.flipAdd, nFA); this._flush(G.flipNorm, nFN);
    this.live = live; this.liveFlips = liveF;
  }

  _atlasUV(idx, _) {
    const A = this.atlas, du = 1 / A.cols, dv = 1 / A.rows;
    return [(idx % A.cols) * du, 1 - (Math.floor(idx / A.cols) + 1) * dv, du, dv];
  }
  _flipUV(n, sheet) {
    const F = this.flip, S = F.sheets || 1, du = 1 / (F.cols * S), dv = 1 / F.rows;
    return [((sheet || 0) * F.cols + (n % F.cols)) * du, 1 - (Math.floor(n / F.cols) + 1) * dv, du, dv];
  }

  _write(g, i, s, camQ, sx, sy, rotZ, op, uv, k) {
    if (i >= g.n) return;
    g.iK.setXY(i, k || 0, s.pop ? 1 + (s.seed || 0) : 0);
    this._q.copy(camQ);
    if (rotZ) { this._qz.setFromAxisAngle(this._z, rotZ); this._q.multiply(this._qz); }
    this._s.set(sx, sy, 1);
    this._m.compose(s.pos, this._q, this._s);
    g.mesh.setMatrixAt(i, this._m);
    g.mesh.setColorAt(i, s.col);
    g.iUv.setXYZW(i, uv[0], uv[1], uv[2], uv[3]);
    g.iOp.setX(i, op);
  }

  _flush(g, n) {
    g.mesh.count = Math.min(n, g.n);
    if (n === 0) return;
    g.mesh.instanceMatrix.needsUpdate = true;
    if (g.mesh.instanceColor) g.mesh.instanceColor.needsUpdate = true;
    g.iUv.needsUpdate = true; g.iOp.needsUpdate = true; g.iK.needsUpdate = true;
  }

  /* Alles aus (Schussbahn v10: Zurueckspulen heisst zuruecksetzen). Additiv, v8 ruft es nicht. */
  clear() {
    for (const s of this.sprites) s.live = false;
    for (const s of this.flips) s.live = false;
    this._cur = 0; this.live = 0; this.liveFlips = 0;
    for (const k in this.groups) this.groups[k].mesh.count = 0;
  }

  /* Fuer die F1-Diagnose des Wirts: eine Zeile, keine Interpretation. */
  stats() {
    const G = this.groups;
    const calls = [G.atlasAdd, G.atlasNorm, G.flipAdd, G.flipNorm].filter((g) => g.mesh.visible && g.mesh.count > 0).length;
    return { live: this.live, cap: this.cap, liveFlips: this.liveFlips, flipCap: this.flipCap, drawCalls: calls };
  }

  dispose() {
    for (const k in this.groups) {
      const g = this.groups[k];
      this.scene.remove(g.mesh); g.mesh.geometry.dispose(); g.mesh.material.dispose();
    }
  }
}
