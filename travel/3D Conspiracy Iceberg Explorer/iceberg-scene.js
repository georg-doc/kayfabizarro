// IcebergScene — Three.js underwater iceberg world for the Conspiracy Iceberg Explorer.
// Exposes window.IcebergScene. Requires window.THREE (r128).
// Arctic-blue palette, organic (smooth-shaded) berg, round bubbles.
(function () {
  const TIER_BAND = 130;        // vertical units per tier
  const TIER_TOP = -35;         // y where tier 1 band starts
  const SURFACE_Y = 0;

  function tierCenterY(n) { return TIER_TOP - (n - 1) * TIER_BAND - TIER_BAND * 0.45; }

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function smoothstep(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  const TIP_Y = 112;                                  // top of the berg above water
  const DEPTH_TOTAL = -tierCenterY(7) + 110;          // depth of berg below water
  const BOTTOM_Y = -DEPTH_TOTAL - 150;                // lowest point

  // Smooth organic radius profile (rotationally averaged)
  function bergProfile(y) {
    if (y >= TIP_Y) return 0.5;
    if (y > 0) {
      // above water: rounded tip tapering up
      const t = y / TIP_Y; // 0 at waterline, 1 at tip
      return Math.max(0.5, 92 * Math.pow(1 - t, 0.72));
    }
    const d = clamp(-y / DEPTH_TOTAL, 0, 1.2);
    // widen to a shoulder, slow taper, melt to a point
    let r = 92 + 165 * Math.pow(Math.sin(Math.PI * clamp(d * 1.15, 0, 1)), 0.85) * (1 - d * 0.45);
    r *= 1 - smoothstep(0.82, 1.04, d);
    return Math.max(0.5, r);
  }

  // gentle angular noise for organic asymmetry
  function bergNoise(theta, y) {
    return (
      Math.sin(theta * 3 + y * 0.017) * 0.5 +
      Math.sin(theta * 5 - y * 0.011 + 2.1) * 0.3 +
      Math.sin(theta * 8 + y * 0.027 + 4.4) * 0.2
    );
  }

  class IcebergScene {
    constructor(container, data, callbacks) {
      this.container = container;
      this.cb = callbacks || {};
      this.entries = [];
      this.tierMarkers = [];
      this.depth = 90;
      this.targetDepth = 90;
      this.angle = 0.6;
      this.targetAngle = 0.6;
      this.radius = 330;
      this.targetRadius = 330;
      this.disposed = false;
      this._dragging = false;
      this._buildScene();
      this._layoutEntries(data);
      this._bindInput();
      this._clock = performance.now();
      this._tick = this._tick.bind(this);
      requestAnimationFrame(this._tick);
    }

    minDepth() { return tierCenterY(7) - 90; }
    maxDepth() { return 120; }

    _buildScene() {
      const THREE = window.THREE;
      const w = this.container.clientWidth, h = this.container.clientHeight;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(55, w / h, 1, 1600);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(w, h);
      this.container.appendChild(this.renderer.domElement);
      this.renderer.domElement.style.display = "block";

      this.scene.fog = new THREE.Fog(0xd9e8ee, 200, 900);

      // Lights — cold arctic
      this.hemi = new THREE.HemisphereLight(0xeaf4f8, 0x0e2438, 1.0);
      this.scene.add(this.hemi);
      this.sun = new THREE.DirectionalLight(0xffffff, 0.85);
      this.sun.position.set(180, 400, 120);
      this.scene.add(this.sun);
      this.camLight = new THREE.PointLight(0xbfe0f0, 0.0, 460, 1.6);
      this.scene.add(this.camLight);

      // ——— Iceberg: one smooth organic mesh, vertex-colored by depth ———
      const H = TIP_Y - BOTTOM_Y;
      const geo = new THREE.CylinderGeometry(1, 1, H, 56, 110, true);
      geo.translate(0, TIP_Y - H / 2, 0); // top at TIP_Y, bottom at BOTTOM_Y
      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      const cTip = new THREE.Color(0xf2f9fb);   // sunlit ice
      const cShallow = new THREE.Color(0xbcdae6);
      const cMid = new THREE.Color(0x6f9fb8);
      const cDeep = new THREE.Color(0x2b4a66);
      const tmp = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const theta = Math.atan2(z, x);
        let r = bergProfile(y);
        r *= 1 + 0.13 * bergNoise(theta, y);
        pos.setXYZ(i, Math.cos(theta) * r, y + Math.sin(theta * 2.3 + y * 0.02) * 4, Math.sin(theta) * r);
        // color by depth
        if (y >= 0) tmp.copy(cTip).lerp(cShallow, 1 - y / TIP_Y);
        else {
          const d = clamp(-y / DEPTH_TOTAL, 0, 1);
          if (d < 0.45) tmp.copy(cShallow).lerp(cMid, d / 0.45);
          else tmp.copy(cMid).lerp(cDeep, (d - 0.45) / 0.55);
        }
        colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
      }
      geo.computeVertexNormals();
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 30, specular: 0x88aabb });
      this.berg = new THREE.Mesh(geo, mat);
      this.scene.add(this.berg);

      // Water surface
      const waterMat = new THREE.MeshBasicMaterial({ color: 0x5b93ad, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      this.water = new THREE.Mesh(new THREE.CircleGeometry(1400, 48), waterMat);
      this.water.rotation.x = -Math.PI / 2;
      this.water.position.y = SURFACE_Y;
      this.scene.add(this.water);

      // Bubbles — round sprite texture
      const bc = document.createElement("canvas");
      bc.width = bc.height = 64;
      const bctx = bc.getContext("2d");
      const grad = bctx.createRadialGradient(32, 32, 4, 32, 32, 30);
      grad.addColorStop(0, "rgba(255,255,255,0.9)");
      grad.addColorStop(0.55, "rgba(220,240,250,0.45)");
      grad.addColorStop(1, "rgba(220,240,250,0)");
      bctx.fillStyle = grad;
      bctx.beginPath(); bctx.arc(32, 32, 30, 0, Math.PI * 2); bctx.fill();
      const bubbleTex = new THREE.CanvasTexture(bc);

      const N = 900;
      const bpos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        bpos[i * 3] = (Math.random() - 0.5) * 900;
        bpos[i * 3 + 1] = -60 - Math.random() * (DEPTH_TOTAL + 100);
        bpos[i * 3 + 2] = (Math.random() - 0.5) * 900;
      }
      const pgeo = new THREE.BufferGeometry();
      pgeo.setAttribute("position", new THREE.BufferAttribute(bpos, 3));
      this.snow = new THREE.Points(pgeo, new THREE.PointsMaterial({
        map: bubbleTex, color: 0xd8eef8, size: 5.5, transparent: true, opacity: 0.65,
        depthWrite: false, sizeAttenuation: true
      }));
      this.scene.add(this.snow);

      this._onResize = () => {
        const w2 = this.container.clientWidth, h2 = this.container.clientHeight;
        if (!w2 || !h2) return;
        this.camera.aspect = w2 / h2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w2, h2);
      };
      window.addEventListener("resize", this._onResize);
    }

    _layoutEntries(data) {
      const byTier = {};
      data.entries.forEach((e) => { (byTier[e.tier] = byTier[e.tier] || []).push(e); });
      Object.keys(byTier).forEach((tn) => {
        const list = byTier[tn];
        const n = +tn;
        const cy = tierCenterY(n);
        list.forEach((e, i) => {
          const golden = 2.399963;
          const a = i * golden + hash(e.id) * 0.9 + n * 1.7;
          const bergR = this._bergRadiusAt(cy);
          const r = bergR + 55 + hash(e.id + "r") * 90;
          const y = cy + (i / list.length - 0.5) * (TIER_BAND * 0.78) + (hash(e.id + "y") - 0.5) * 22;
          this.entries.push({ id: e.id, x: Math.cos(a) * r, y, z: Math.sin(a) * r, tier: n });
        });
      });
      data.tiers.forEach((t) => {
        this.tierMarkers.push({ id: "tier-" + t.n, n: t.n, y: TIER_TOP - (t.n - 1) * TIER_BAND });
      });
    }

    _bergRadiusAt(y) { return bergProfile(y); }

    // add entries into the live scene without a rebuild (camera preserved)
    addEntries(list) {
      list.forEach((e) => {
        const n = Math.min(7, Math.max(1, e.tier));
        const cy = tierCenterY(n);
        const bergR = this._bergRadiusAt(cy);
        const a = hash(e.id) * Math.PI * 2 + n * 1.7;
        const r = bergR + 55 + hash(e.id + "r") * 90;
        const y = cy + (hash(e.id + "i") - 0.5) * (TIER_BAND * 0.7) + (hash(e.id + "y") - 0.5) * 22;
        this.entries.push({ id: e.id, x: Math.cos(a) * r, y, z: Math.sin(a) * r, tier: n });
      });
    }

    _bindInput() {
      const el = this.renderer.domElement;
      let px = 0, py = 0;
      el.style.touchAction = "none";
      el.addEventListener("pointerdown", (ev) => {
        this._dragging = true; px = ev.clientX; py = ev.clientY;
        el.setPointerCapture(ev.pointerId);
        this._moved = 0;
      });
      el.addEventListener("pointermove", (ev) => {
        if (!this._dragging) return;
        const dx = ev.clientX - px, dy = ev.clientY - py;
        px = ev.clientX; py = ev.clientY;
        this._moved += Math.abs(dx) + Math.abs(dy);
        this.targetAngle -= dx * 0.005;
        this.targetDepth = clamp(this.targetDepth + dy * 1.1, this.minDepth(), this.maxDepth());
        if (this.cb.onUserMove) this.cb.onUserMove();
      });
      el.addEventListener("pointerup", () => { this._dragging = false; });
      el.addEventListener("wheel", (ev) => {
        ev.preventDefault();
        // wheel / pinch = zoom (dolly); drag handles dive + orbit
        this.targetRadius = clamp(this.targetRadius + ev.deltaY * (ev.ctrlKey || ev.metaKey ? 1.6 : 0.8), 170, 620);
        if (ev.deltaX) this.targetAngle += ev.deltaX * 0.0035;
        if (this.cb.onUserMove) this.cb.onUserMove();
      }, { passive: false });
    }

    diveBy(d) { this.targetDepth = clamp(this.targetDepth + d, this.minDepth(), this.maxDepth()); }
    orbitBy(a) { this.targetAngle += a; }
    zoomBy(d) { this.targetRadius = clamp(this.targetRadius + d, 170, 620); }

    // ——— View contract (docs/SCHEMA-v2.md §6) — the ONLY navigation surface
    // the feature layer may use besides flyToEntry/addEntries/dispose. ———
    goToAnchor(id) {
      if (id === "surface") { this.targetDepth = 90; return; }
      const m = /^tier-(\d+)$/.exec(id);
      if (m) this.targetDepth = TIER_TOP - (+m[1] - 1) * TIER_BAND - 60;
    }
    get anchors() {
      const a = [{ id: "surface", short: "↑", title: "Back to the surface" }];
      this.tierMarkers.forEach((t) => a.push({ id: "tier-" + t.n, short: String(t.n), title: "Tier " + t.n }));
      return a;
    }
    get dragging() { return this._dragging; }                  // hover suppression while dragging
    get suppressClick() { return (this._moved || 0) > 8; }     // click guard (click fires after pointerup)

    flyToEntry(id) {
      const e = this.entries.find((x) => x.id === id);
      if (!e) return;
      this.targetDepth = e.y + 14;
      const a = Math.atan2(e.z, e.x);
      let ta = a;
      while (ta - this.targetAngle > Math.PI) ta -= Math.PI * 2;
      while (ta - this.targetAngle < -Math.PI) ta += Math.PI * 2;
      this.targetAngle = ta;
    }

    getDepthInfo() {
      const d = this.depth;
      let tier = 0;
      if (d < TIER_TOP + 20) tier = clamp(Math.floor((TIER_TOP - d) / TIER_BAND) + 1, 1, 7);
      return { y: d, tier, meters: Math.max(0, Math.round(-d * 1.8)) };
    }

    _tick(now) {
      if (this.disposed) return;
      const dt = Math.min(50, now - this._clock) / 1000;
      this._clock = now;

      this.depth = lerp(this.depth, this.targetDepth, 1 - Math.pow(0.0018, dt));
      this.angle = lerp(this.angle, this.targetAngle, 1 - Math.pow(0.002, dt));
      this.radius = lerp(this.radius, this.targetRadius, 1 - Math.pow(0.002, dt));

      const cam = this.camera;
      cam.position.set(Math.cos(this.angle) * this.radius, this.depth + 26, Math.sin(this.angle) * this.radius);
      cam.lookAt(0, this.depth - 10, 0);
      this.camLight.position.copy(cam.position);

      // depth atmosphere: arctic sky above; teal → deep navy below
      const THREE = window.THREE;
      const d = this.depth;
      let bg;
      if (d > SURFACE_Y + 8) {
        bg = new THREE.Color(0xd9e8ee);
        this.scene.fog.near = 300; this.scene.fog.far = 1300;
        this.hemi.intensity = 1.0; this.camLight.intensity = 0;
      } else {
        const t = clamp(-d / (-this.minDepth()), 0, 1);
        const shallow = new THREE.Color(0x39718c);
        const mid = new THREE.Color(0x1c3a55);
        const deep = new THREE.Color(0x081018);
        bg = t < 0.5 ? shallow.lerp(mid, t * 2) : mid.lerp(deep, (t - 0.5) * 2);
        this.scene.fog.near = 120 - t * 40; this.scene.fog.far = 700 - t * 260;
        this.hemi.intensity = 0.85 - t * 0.6;
        this.camLight.intensity = 0.25 + t * 1.1;
      }
      this.scene.background = bg;
      this.scene.fog.color = bg;

      this.snow.position.y = (now * 0.004) % 40;

      this.renderer.render(this.scene, cam);

      if (this.cb.onFrame) {
        const w = this.container.clientWidth, h = this.container.clientHeight;
        const v = new THREE.Vector3();
        const camA = this.angle;
        const out = [];
        for (const e of this.entries) {
          const dy = Math.abs(e.y - this.depth);
          if (dy > TIER_BAND * 1.5) continue;
          const ea = Math.atan2(e.z, e.x);
          let da = Math.abs(ea - camA) % (Math.PI * 2);
          if (da > Math.PI) da = Math.PI * 2 - da;
          if (da > 2.15) continue;
          v.set(e.x, e.y, e.z).project(this.camera);
          if (v.z > 1) continue;
          const fade = clamp(1 - dy / (TIER_BAND * 1.4), 0, 1) * clamp(1 - (da - 1.4) / 0.75, 0, 1);
          if (fade <= 0.04) continue; // invisible → never emit (no ghost hitboxes)
          const sx = (v.x * 0.5 + 0.5) * w, sy = (-v.y * 0.5 + 0.5) * h;
          if (sx < -60 || sx > w + 60 || sy < -40 || sy > h + 40) continue; // viewport cull
          out.push({ id: e.id, x: sx, y: sy, o: fade, s: clamp(1.15 - da * 0.18, 0.7, 1.15) });
        }
        for (const t of this.tierMarkers) {
          const dy = Math.abs(t.y - this.depth);
          if (dy > TIER_BAND * 2) continue;
          v.set(Math.cos(camA - 0.9) * 250, t.y, Math.sin(camA - 0.9) * 250).project(this.camera);
          if (v.z > 1) continue;
          out.push({ id: t.id, x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, o: clamp(1 - dy / (TIER_BAND * 1.8), 0, 1), s: 1, tierMarker: true });
        }
        this.cb.onFrame(out, this.getDepthInfo());
      }
      requestAnimationFrame(this._tick);
    }

    dispose() {
      this.disposed = true;
      window.removeEventListener("resize", this._onResize);
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }

  window.IcebergScene = IcebergScene;
})();
