/* kfb-headlights.v1 · WS1 · Georg 22.10.: Front-Scheinwerfer für die Racer
   Billiger Cartoon-Weg ohne echte three.js-Lichter (jedes SpotLight/PointLight verteuert jedes Material und erzwingt Shader-Neukompilierung).
   Drei Schichten je Wagen:
     1 Lampengläser: additiver Glüh-Sprite je Lampe + Blendstern je Seite, von vorn gesehen stärker (auch tagsüber sichtbar)
     2 Lichtkegel: weicher additiver Kegel vor dem Wagen je Seite (Art wie LP.makeBeam der Disco-Strahler), Stärke nach Tageslicht
     3 Lichtfleck am Boden: über die Lichtpfützen (kfb-light-pool.v1, Uniform-Array im Gelände-Shader), folgt jeder Geländeform
   Farbe aus der Antriebsfarbe des Racers (RACERS.glow.plume / .core), Weißanteil regelbar.
   Rahmenunabhängig: THREE wird übergeben (r147 global oder r186 als Modul), kein Import, kein DOM nötig außer für die erzeugten Texturen
   (Canvas; im Spiel ggf. eigene Texturen über glowTexture/starTexture übergeben).
   Kosten: 3 Materialien je Wagen (2 SpriteMaterial, 1 ShaderMaterial), kein neues Licht, keine Neukompilierung fremder Materialien.

   Benutzung:
     const hl = KFBHeadlights.createHeadlights({ THREE, car, anchors, color, core, scene, lightPools, ground })
       car       Object3D, an dem die Lampen hängen (Modell-Einheiten, +Z = vorn), z. B. der skalierte Modell-Halter
       anchors   [{ pos:[x,y,z], dir:[x,y,z], r }]  Lampen in car-Koordinaten (headlight-anchors.r1.json: lamps + dir + r)
       color     Antriebsfarbe (Hex oder THREE.Color), core = Kernfarbe (optional)
       scene     Gruppe für die Lichtkegel (Weltmaße in Metern); Pfützen und Kegel werden in deren Koordinaten gerechnet
       lightPools { setPools(list) }  optional; Liste im Format von LP.setPools (origin, dir, angle, soft, color, intensity, range)
       ground    (x, z) => y in scene-Koordinaten, optional: Kegel und Lichtfleck zielen auf den Boden vor dem Wagen (sonst Anker-Richtung)
     hl.update(dt, { daylight, camera })   jedes Bild; daylight 0 = Nacht … 1 = Mittag
     hl.setColor(color, core) · hl.setWhite(0..1) · hl.setOn(bool) · hl.getPools() · hl.dispose()
*/
(function (root) {
  'use strict';
  var VERSION = 'kfb-headlights.v1';

  function canvasTex(THREE, size, draw) {
    if (typeof document === 'undefined') return null;
    var c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    var t = new THREE.CanvasTexture(c); return t;
  }
  /* weiches Glühen mit hellem Kern (ein Sprite statt Glühen + Kern: halbe Zeichenaufrufe) */
  function makeGlowTex(THREE) {
    return canvasTex(THREE, 64, function (g, s) {
      var h = s / 2, r = g.createRadialGradient(h, h, 0, h, h, h);
      r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(255,255,255,0.95)'); r.addColorStop(0.32, 'rgba(255,255,255,0.45)');
      r.addColorStop(0.62, 'rgba(255,255,255,0.12)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, s, s);
    });
  }
  /* Blendstern: zwei lange waagerechte Strahlen, vier kurze schräge, weicher Kern */
  function makeStarTex(THREE) {
    return canvasTex(THREE, 128, function (g, s) {
      var h = s / 2; g.globalCompositeOperation = 'lighter';
      function ray(ang, len, wid, a) {
        g.save(); g.translate(h, h); g.rotate(ang);
        var lg = g.createLinearGradient(-len, 0, len, 0);
        lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,255,255,' + a + ')'); lg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = lg; g.beginPath(); g.moveTo(-len, 0); g.lineTo(0, -wid); g.lineTo(len, 0); g.lineTo(0, wid); g.closePath(); g.fill(); g.restore();
      }
      ray(0, h, 2.6, 0.95); ray(Math.PI / 2, h * 0.42, 1.8, 0.55); ray(Math.PI / 4, h * 0.34, 1.4, 0.4); ray(-Math.PI / 4, h * 0.34, 1.4, 0.4);
      var r = g.createRadialGradient(h, h, 0, h, h, h * 0.3); r.addColorStop(0, 'rgba(255,255,255,0.9)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = r; g.fillRect(0, 0, s, s);
    });
  }

  function createHeadlights(o) {
    var THREE = o.THREE, car = o.car, scene = o.scene, pools = o.lightPools || null, ground = o.ground || null;
    if (!THREE || !car || !scene) throw new Error(VERSION + ': THREE, car und scene sind Pflicht');
    var opt = Object.assign({
      white: 0.35,        /* Weißanteil der Lampenfarbe (0 = reine Antriebsfarbe) */
      beamAngle: 0.2,     /* halber Öffnungswinkel des Kegels (rad) */
      beamLen: 22,        /* Kegel-Länge ohne Boden (m) */
      beamPitch: 0.06,    /* Kegel nach unten geneigt (rad), zusätzlich zur Anker-Richtung */
      poolDist: 11,       /* Lichtfleck zielt auf den Boden so weit vor der Lampe (m) */
      beamDist: 15,       /* Kegel endet am Boden so weit vor der Lampe (m) */
      poolAngle: 0.36,    /* halber Öffnungswinkel des Lichtflecks (rad) */
      poolRange: 19,      /* Reichweite des Lichtflecks (m), blendet ab 75 % aus */
      glowSize: 4.2,      /* Glas-Glühen: Vielfaches des Lampenradius */
      starSize: 9,        /* Blendstern: Vielfaches des Lampenradius */
      groundEvery: 2,     /* Boden-Abtastung (4 Höhenabfragen) nur jedes n-te Bild, dazwischen weich nachgeführt */
    }, o.options || {});
    var glowTex = o.glowTexture || makeGlowTex(THREE), starTex = o.starTexture || makeStarTex(THREE), ownTex = !o.glowTexture;
    var col = new THREE.Color(), core = new THREE.Color(), base = new THREE.Color(o.color || '#ffffff'), baseCore = new THREE.Color(o.core || o.color || '#ffffff'), WHITE = new THREE.Color(1, 1, 1);
    var on = true, white = opt.white;

    /* Lampen-Anker (car-Koordinaten) */
    var lamps = (o.anchors || []).map(function (a) {
      var p = a.pos && a.pos.isVector3 ? a.pos.clone() : new THREE.Vector3(a.pos[0], a.pos[1], a.pos[2]);
      var d = a.dir ? (a.dir.isVector3 ? a.dir.clone() : new THREE.Vector3(a.dir[0], a.dir[1], a.dir[2])) : new THREE.Vector3(0, 0, 1);
      return { pos: p, dir: d.normalize(), r: a.r || 0.12 };
    });
    /* Seiten: Lampen mit x ≥ 0 links, x < 0 rechts (Mitte = links); je Seite ein Kegel, ein Pfützenlicht und ein Blendstern */
    var sides = [{ lamps: [] }, { lamps: [] }];
    lamps.forEach(function (l) { sides[l.pos.x >= 0 ? 0 : 1].lamps.push(l) });
    sides = sides.filter(function (s) { return s.lamps.length });
    sides.forEach(function (s) {
      s.pos = new THREE.Vector3(); s.dir = new THREE.Vector3(); s.r = 0;
      s.lamps.forEach(function (l) { s.pos.add(l.pos); s.dir.add(l.dir); s.r = Math.max(s.r, l.r) });
      s.pos.multiplyScalar(1 / s.lamps.length); s.dir.normalize();
      s.wp = new THREE.Vector3(); s.wd = new THREE.Vector3(); s.len = opt.beamLen; s.lenT = opt.beamLen;
    });

    /* Schicht 1: Gläser (Sprites hängen am Wagen, Größe in Modell-Einheiten) */
    var glowMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.9 });
    var starMat = new THREE.SpriteMaterial({ map: starTex, color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.0 });
    var group = new THREE.Group(); group.name = 'kfb-headlights'; car.add(group);
    lamps.forEach(function (l) {
      l.glow = new THREE.Sprite(glowMat); l.glow.position.copy(l.pos); l.glow.scale.setScalar(l.r * opt.glowSize); l.glow.renderOrder = 4; group.add(l.glow);
    });
    sides.forEach(function (s) {
      s.star = new THREE.Sprite(starMat); s.star.position.copy(s.pos); s.star.scale.setScalar(s.r * opt.starSize); s.star.renderOrder = 5; group.add(s.star);
    });

    /* Schicht 2: Kegel (in scene, Weltmaße). Geometrie: Spitze im Ursprung, Achse +Y, Länge = Skalierung (wie LP.makeBeam) */
    var beamGeo = new THREE.CylinderGeometry(1, 0.0, 1, 24, 6, true).translate(0, 0.5, 0);
    var beamMat = new THREE.ShaderMaterial({
      uniforms: { uCol: { value: new THREE.Color() }, uOp: { value: 0.1 }, uFade: { value: 0.55 } },
      vertexShader: 'varying float vT; varying vec3 vNv; varying vec3 vVd; void main(){ vT = position.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vNv = normalize(normalMatrix * normal); vVd = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uCol; uniform float uOp, uFade; varying float vT; varying vec3 vNv; varying vec3 vVd; void main(){ float rim = abs(dot(normalize(vNv), normalize(vVd))); float a = uOp * (0.3 + 0.7 * pow(rim, 2.0)) * (1.0 - smoothstep(uFade, 1.0, vT)) * smoothstep(0.0, 0.08, vT) * (1.0 - 0.55 * vT); gl_FragColor = vec4(uCol * a, a); }',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    sides.forEach(function (s) { s.beam = new THREE.Mesh(beamGeo, beamMat); s.beam.frustumCulled = false; s.beam.renderOrder = 3; s.beam.name = 'kfb-headlight-beam'; scene.add(s.beam) });

    var UP = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), v = new THREE.Vector3(), cv = new THREE.Vector3(), wq = new THREE.Quaternion(), pitchQ = new THREE.Quaternion(), axis = new THREE.Vector3();
    var frame = 0, poolList = [], lastDay = 1, s0ok = false, hz = new THREE.Vector3(), bd = new THREE.Vector3(), pd = new THREE.Vector3();
    function applyColor() {
      col.copy(base).lerp(WHITE, white); core.copy(baseCore).lerp(WHITE, Math.min(1, white + 0.45));
      glowMat.color.copy(core); starMat.color.copy(col).lerp(WHITE, 0.3); beamMat.uniforms.uCol.value.copy(col);
    }
    applyColor();

    function update(dt, st) {
      st = st || {}; frame++;
      var day = Math.min(1, Math.max(0, st.daylight == null ? 1 : st.daylight)), night = 1 - day, cam = st.camera;
      lastDay = day;
      if (!on) return;
      car.updateWorldMatrix(true, false); scene.updateWorldMatrix(true, false);
      car.getWorldQuaternion(wq);
      /* Blickwinkel: wie weit schaut die Kamera in die Lampen (1 = genau von vorn) */
      var facing = 0;
      sides.forEach(function (s) {
        s.wp.copy(s.pos); car.localToWorld(s.wp);
        s.wd.copy(s.dir).applyQuaternion(wq);
        axis.set(-s.wd.z, 0, s.wd.x); if (axis.lengthSq() > 1e-8) { axis.normalize(); pitchQ.setFromAxisAngle(axis, -opt.beamPitch); s.wd.applyQuaternion(pitchQ) }   /* nach unten neigen, Achse quer zur Fahrtrichtung */
        if (cam) { cv.copy(cam.position); cam.parent && cam.parent.localToWorld(cv); cv.sub(s.wp).normalize(); s.facing = Math.max(0, s.wd.x * cv.x + s.wd.y * cv.y + s.wd.z * cv.z); facing += s.facing / sides.length }
        else s.facing = 0.5;
      });
      /* Gläser: tagsüber deutlich, nachts voll; von vorn größer und heller (Glas „zündet“), von der Seite schwächer, von hinten aus */
      var f2 = facing * facing, side = Math.min(1, facing * 3);
      glowMat.opacity = side * (0.55 + 0.35 * night + 0.25 * f2);
      /* Sprites ein Stück zur Kamera ziehen (in car-Koordinaten): die Quads schneiden sonst die Lampenfassung und werden abgeschnitten */
      var camL = null; if (cam) { camL = cv.copy(cam.position); cam.parent && cam.parent.localToWorld(camL); car.worldToLocal(camL) }
      lamps.forEach(function (l) { var sz = l.r * opt.glowSize * (0.75 + 0.45 * f2 + 0.25 * night); l.glow.scale.setScalar(sz)
        l.glow.position.copy(l.pos); if (camL) l.glow.position.addScaledVector(v.copy(camL).sub(l.pos).normalize(), l.r * 1.6) });
      starMat.opacity = Math.pow(facing, 4) * (0.5 + 0.5 * night);
      sides.forEach(function (s) { var k = s.r * opt.starSize * (0.6 + 0.6 * f2) * (1 + 0.3 * night); s.star.scale.set(k, k, 1); s.star.visible = starMat.opacity > 0.01
        s.star.position.copy(s.pos); if (camL) s.star.position.addScaledVector(v.copy(camL).sub(s.pos).normalize(), s.r * 2.5) });
      /* Kegel: tags dezent, Dämmerung/Nacht kräftig */
      beamMat.uniforms.uOp.value = (0.06 + 0.42 * Math.pow(night, 1.3)) * (1 - 0.8 * f2);   /* Blick in den Kegel (von vorn): Kegel zurück, die Blendung zeigt der Stern */
      var doGround = ground && (frame % opt.groundEvery === 1 || opt.groundEvery <= 1 || !s0ok);
      poolList.length = 0;
      sides.forEach(function (s) {
        var o2 = v.copy(s.wp); scene.worldToLocal(o2);
        /* Zielpunkte am Boden vor dem Wagen (Fahrtrichtung waagerecht): Pfütze bei poolDist, Kegelende bei beamDist. So trifft das Licht auch hinter
           einer Kuppe oder am Hang den Boden; ohne Bodenfunktion gilt die Anker-Richtung mit Neigung. Im Flug begrenzt die Neigung, die Reichweite blendet aus. */
        hz.set(s.wd.x, 0, s.wd.z); if (hz.lengthSq() < 1e-6) hz.set(0, 0, 1); hz.normalize();
        if (doGround) {
          var gy1 = ground(o2.x + hz.x * opt.poolDist, o2.z + hz.z * opt.poolDist), gy2 = ground(o2.x + hz.x * opt.beamDist, o2.z + hz.z * opt.beamDist);
          s.pT = Math.max(-0.75, Math.min(-0.06, Math.atan2(gy1 - o2.y, opt.poolDist)));
          s.bT = Math.max(-0.5, Math.min(-0.03, Math.atan2(gy2 + 0.3 - o2.y, opt.beamDist)));
          s.lenT = Math.min(opt.beamLen, Math.hypot(opt.beamDist, gy2 - o2.y) + 2.5);
        }
        if (ground) { var k = s.pP == null ? 1 : Math.min(1, (dt || 0.016) * 8); s.pP = s.pP == null ? s.pT : s.pP + (s.pT - s.pP) * k; s.bP = s.bP == null ? s.bT : s.bP + (s.bT - s.bP) * k
          bd.copy(hz).multiplyScalar(Math.cos(s.bP)).setY(Math.sin(s.bP)); pd.copy(hz).multiplyScalar(Math.cos(s.pP)).setY(Math.sin(s.pP)) }
        else { bd.copy(s.wd); pd.copy(s.wd); s.lenT = opt.beamLen }
        s.len += (s.lenT - s.len) * Math.min(1, (dt || 0.016) * 10);
        var r = Math.tan(opt.beamAngle) * s.len;
        s.beam.position.copy(o2); s.beam.quaternion.copy(q.setFromUnitVectors(UP, bd)); s.beam.scale.set(r, s.len, r);
        poolList.push({ origin: o2.clone(), dir: pd.clone(), angle: opt.poolAngle, soft: 0.6, color: col, intensity: 0.22 + 0.85 * Math.pow(night, 1.2), range: opt.poolRange });
      });
      s0ok = true;
      beamMat.uniforms.uFade.value = 0.55;
      if (pools && pools.setPools) pools.setPools(poolList);
    }

    function setOn(b) {
      on = !!b; group.visible = on; sides.forEach(function (s) { s.beam.visible = on });
      if (!on) { poolList.length = 0; if (pools && pools.setPools) pools.setPools([]) }
    }
    function setColor(c, cc) { if (c != null) base.set(c); baseCore.set(cc != null ? cc : c != null ? c : baseCore); applyColor() }
    function setWhite(w) { white = Math.min(1, Math.max(0, +w || 0)); applyColor() }
    function getPools() { return on ? poolList.slice() : [] }
    function dispose() {
      if (pools && pools.setPools) pools.setPools([]);
      car.remove(group); sides.forEach(function (s) { scene.remove(s.beam) });
      glowMat.dispose(); starMat.dispose(); beamMat.dispose(); beamGeo.dispose();
      if (ownTex) { glowTex && glowTex.dispose(); starTex && starTex.dispose() }
    }
    return { VERSION: VERSION, update: update, setOn: setOn, setColor: setColor, setWhite: setWhite, getPools: getPools, dispose: dispose,
      get on() { return on }, lamps: lamps, sides: sides, group: group, materials: { glow: glowMat, star: starMat, beam: beamMat } };
  }

  var api = { VERSION: VERSION, createHeadlights: createHeadlights };
  root.KFBHeadlights = api;
  if (typeof module === 'object' && module && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
