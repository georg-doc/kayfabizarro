/* KFB · DISCO-BALL-CORE-01 · wiederverwendbares Welt-Objekt
   Produktrolle wie Theatre Curtain Core: ein Kern-Objekt mit kleiner Verbrauchernaht, eigenen
   Zuständen und Parametern, frei in jede Host-Szene einhängbar. Die Resident-Disco BESITZT die
   Kugel nicht, sie hängt sie nur ein.

   Naht:  mountDiscoBall(def, { parent, anchor, renderer, budget })
          → { root, frame, spinner, faceHost, update(beatState), setMode, setSpin, setIntensity,
              setPalette, impulse, place, state, dispose }

   Aufbau (Elternkette):  root (Platzierung, frei dreh-/skalierbar)
                            └ frame (dreht NICHT: Aufhängung, faceHost für den späteren EyeRig)
                                └ spinner (dreht: Spiegelkacheln, Strahlkegel, Lichtprojektion)

   Licht-Grenze: die Kugel bringt ihr EIGENES, begrenztes Rezept mit — höchstens 1 Projektor mit
   Schatten (Lichtpunkte-Muster) + 3 schattenlose Spots für SPOT_SWEEP + Emissiv/Additiv-Kegel.
   Sie ersetzt keine Szenenbeleuchtung, färbt die Szene nicht um und hat keinen Post-Prozess.
   Zeit kommt vom Host (Szenenuhr über update), nie aus der Bildrate der Oberfläche.

   Geometrie ist ATLAS-EIGEN (`atlas://generated/disco-ball-core-01`) — kein Pack liefert eine
   Discokugel, und ein früherer WorldDesign/Birthday-Spender ist in diesem Durchgang nicht
   isoliert worden. Dieses Objekt behauptet deshalb nicht, jener Spender zu sein. */
import * as THREE from 'three';

export const BALL_SCHEMA = 'kfb.disco-ball-core/1';
export const MODES = ['OFF', 'AMBIENT', 'DISCO', 'BEAT_PULSE', 'SPOT_SWEEP'];
export const DEFAULTS = {
  radius: 0.7, tile: 0.085, hang: 1.6,
  spin: 0.45,            // rad/s im Grundzustand
  intensity: 1,          // Gesamtregler 0…2
  beams: 10, beamMax: 16, beamSpread: 0.075, beamLights: 3,
  projAngle: 1.05, projRange: 14, dots: 70,
  sweepCount: 3, sweepAngle: 0.1, sweepRadius: 3.2,
  beatResponse: 0.6,     // 0…1, wie stark Schläge die Effekte pulsen
  palette: ['#ff5fa8', '#4fd6ff', '#ffd24f', '#9a6bff', '#5cff9a'],
  /* Schweben wie in Sirup: langsame, schwere Drift + gedämpfte Feder für Impulse */
  float: true, floatAmp: 0.16, floatDrift: 0.12, floatTilt: 3.5, floatRate: 0.11, spring: 2.6, damping: 1.5,
  floorCatch: true, floorY: 0,
  /* Cartoon-Puls auf dem Schlag: Stoß in eine schnelle, unterdämpfte Feder → aufblähen, überschwingen, stauchen */
  bop: 0.11, bopSpring: 95, bopDamping: 8.5
};
const MODE_MIX = {       // was jeder Modus einschaltet (0…1)
  /* S40c (Georg): Strahlen sind die Hauptsache, sie treffen den Boden und beleuchten Figuren und
     Requisiten. Die Lichtpunkte des Projektors sind Beiwerk. beamLight = reale Spots entlang der Strahlen. */
  OFF:        { spin: 0,   proj: 0,    beams: 0,    beamLight: 0,    sweep: 0, glint: 0.15, pulse: 0,    bop: 0 },
  AMBIENT:    { spin: 0.5, proj: 0.3,  beams: 0.3,  beamLight: 0.35, sweep: 0, glint: 0.6,  pulse: 0,    bop: 0.35 },
  DISCO:      { spin: 1,   proj: 0.55, beams: 1,    beamLight: 1,    sweep: 0, glint: 1,    pulse: 0.35, bop: 1 },
  BEAT_PULSE: { spin: 1,   proj: 0.6,  beams: 1.15, beamLight: 1.1,  sweep: 0, glint: 1,    pulse: 1,    bop: 1.35 },
  SPOT_SWEEP: { spin: 0.8, proj: 0.2,  beams: 0.45, beamLight: 0,    sweep: 1, glint: 0.8,  pulse: 0.5,  bop: 0.7 }
};
const D2R = Math.PI / 180;
const mod = (a, n) => ((a % n) + n) % n;

function beamMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uAlpha: { value: 0 }, uLen: { value: 1 }, uFlick: { value: 1 } },
    vertexShader: `varying float vD; varying vec3 vN; varying vec3 vV; uniform float uLen;
      void main(){ vD = clamp(length(position)/uLen,0.,1.); vec4 mv = modelViewMatrix*vec4(position,1.);
      vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying float vD; varying vec3 vN; varying vec3 vV; uniform vec3 uColor; uniform float uAlpha; uniform float uFlick;
      void main(){ float edge = pow(abs(dot(vN,vV)),1.7); float along = smoothstep(0.,0.03,vD)*(1.-0.5*vD)*(1.-smoothstep(0.94,1.,vD)); float a = uAlpha*uFlick*along*edge;
      vec3 c = mix(uColor, vec3(1.), 0.35*edge*edge); gl_FragColor = vec4(c*a, a); }`
  });
}
/* Kegel mit der Spitze im Ursprung, entlang −y */
function beamGeometry(len, spread) {
  const g = new THREE.ConeGeometry(len * spread, len, 18, 1, true);
  g.translate(0, -len / 2, 0);
  return g;
}

export function mountDiscoBall(def = {}, { parent, anchor = {}, renderer = null, budget = { lights: 4, shadowLights: 1 } } = {}) {
  const P = Object.assign({}, DEFAULTS, def.params || {});
  const id = def.id || 'disco-ball-core-01';
  const root = new THREE.Group();
  root.name = 'disco-ball-core:' + id;
  root.userData.entry = { id: 'discoball', scope: 'modul', kind: 'module', role: 'DISCO-BALL-CORE-01 · Welt-Objekt, frei platzierbar', a: 'atlas://generated/' + id };
  const frame = new THREE.Group(); frame.name = 'ball.frame'; root.add(frame);
  const spinner = new THREE.Group(); spinner.name = 'ball.spinner'; frame.add(spinner);
  const disposables = [];
  const own = (x) => { disposables.push(x); return x; };

  /* ---- Aufhängung ---- */
  const metal = own(new THREE.MeshStandardMaterial({ color: 0x2c2c30, metalness: 0.7, roughness: 0.45 }));
  const chain = new THREE.Mesh(own(new THREE.CylinderGeometry(0.018, 0.018, P.hang, 6)), metal);
  chain.position.y = P.radius + P.hang / 2; chain.name = 'ball.hanger';
  const cap = new THREE.Mesh(own(new THREE.CylinderGeometry(0.09, 0.13, 0.12, 12)), metal);
  cap.position.y = P.radius + 0.03; cap.name = 'ball.cap';
  frame.add(chain, cap);

  /* ---- Spiegelkacheln · Breitenbänder, je Band so viele Kacheln wie in den Umfang passen ---- */
  const tiles = [];
  const bands = Math.max(6, Math.round(Math.PI * P.radius / P.tile));
  for (let i = 0; i < bands; i++) {
    const lat = -Math.PI / 2 + (i + 0.5) * Math.PI / bands;
    const n = Math.max(1, Math.round(2 * Math.PI * Math.cos(lat) * P.radius / P.tile));
    for (let k = 0; k < n; k++) tiles.push([lat, (k + (i % 2) * 0.5) * 2 * Math.PI / n]);
  }
  /* eigene kleine Umgebung, damit Metall ohne Szenen-Environment nicht schwarz wird. Fehlt der
     Renderer, fällt die Kugel auf hohe Rauheit zurück — sichtbar statt schwarz (Rückfall). */
  let env = null, fallback = [];
  if (renderer) {
    try {
      const es = new THREE.Scene();
      const sky = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 8), new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true }));
      const pa = sky.geometry.attributes.position, col = [];
      for (let i = 0; i < pa.count; i++) { const y = pa.getY(i) / 10; const c = new THREE.Color().setHSL(0.62, 0.25, 0.08 + 0.35 * Math.max(0, y)); col.push(c.r, c.g, c.b); }
      sky.geometry.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      es.add(sky);
      P.palette.forEach((c, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); const a = i / P.palette.length * Math.PI * 2; m.position.set(Math.cos(a) * 8, 2 + (i % 2) * 3, Math.sin(a) * 8); m.lookAt(0, 0, 0); es.add(m); });
      const pm = new THREE.PMREMGenerator(renderer);
      env = own(pm.fromScene(es, 0.02).texture);
      pm.dispose();
    } catch (e) { env = null; fallback.push('Umgebung: ' + e.message); }
  } else fallback.push('kein Renderer übergeben — Kacheln matt statt verspiegelt');
  const tileMat = own(new THREE.MeshStandardMaterial({ color: 0xd4dae2, metalness: env ? 1 : 0.2, roughness: env ? 0.12 : 0.5, envMap: env, envMapIntensity: 1.2 }));
  const tileGeo = own(new THREE.BoxGeometry(P.tile * 0.9, P.tile * 0.9, P.tile * 0.12));
  const tileMesh = new THREE.InstancedMesh(tileGeo, tileMat, tiles.length);
  tileMesh.name = 'ball.tiles'; tileMesh.castShadow = false; tileMesh.receiveShadow = false;
  const glintMat = own(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  const glintGeo = own(new THREE.PlaneGeometry(P.tile * 0.8, P.tile * 0.8));
  const glint = new THREE.InstancedMesh(glintGeo, glintMat, tiles.length);
  glint.name = 'ball.glints';
  const normals = [];
  const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(1, 1, 1);
  const _o = new THREE.Object3D();
  tiles.forEach(([lat, lon], i) => {
    const nrm = new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
    normals.push(nrm);
    _o.position.copy(nrm).multiplyScalar(P.radius); _o.lookAt(nrm.clone().multiplyScalar(P.radius * 2)); _o.updateMatrix();
    tileMesh.setMatrixAt(i, _o.matrix);
    _o.position.copy(nrm).multiplyScalar(P.radius + P.tile * 0.07); _o.updateMatrix();
    glint.setMatrixAt(i, _o.matrix);
    glint.setColorAt(i, new THREE.Color(0, 0, 0));
  });
  const core = new THREE.Mesh(own(new THREE.SphereGeometry(P.radius * 0.97, 24, 16)), own(new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.9 })));
  core.name = 'ball.core';
  const body = new THREE.Group(); body.name = 'ball.body';
  body.add(core, tileMesh, glint);
  spinner.add(body);

  /* ---- Strahlkegel (additiv, drehen mit) ---- */
  const beams = [];
  const beamGeo = own(beamGeometry(1, P.beamSpread));   // Einheitslänge, pro Bild bis zum Boden skaliert
  for (let i = 0; i < P.beams; i++) {
    const mat = own(beamMaterial(P.palette[i % P.palette.length]));
    mat.uniforms.uLen.value = 1;
    const m = new THREE.Mesh(beamGeo, mat);
    m.name = 'ball.beam.' + i; m.renderOrder = 3; m.frustumCulled = false;
    const el = -(34 + (i * 29) % 44) * D2R;               // steil genug, dass jeder Strahl den Boden in der Szene trifft
    const az = i * 2.399963;                              // goldener Winkel
    const dir = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
    m.position.copy(dir).multiplyScalar(P.radius * 0.95);
    spinner.add(m); beams.push(m);
    m.userData.pool = null;
  }
  /* Bodenfleck je Strahl: additiver, weicher Kreis am Auftreffpunkt — verbindet Strahl und Fläche */
  const pcv = document.createElement('canvas'); pcv.width = pcv.height = 128;
  { const px = pcv.getContext('2d'), g = px.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    px.fillStyle = g; px.fillRect(0, 0, 128, 128); }
  const poolTex = own(new THREE.CanvasTexture(pcv));
  const poolGeo = own(new THREE.CircleGeometry(1, 32));
  for (const [i, m] of beams.entries()) {
    const pm = own(new THREE.MeshBasicMaterial({ map: poolTex, color: new THREE.Color(P.palette[i % P.palette.length]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    const pool = new THREE.Mesh(poolGeo, pm);
    pool.name = 'ball.beamPool.' + i; pool.rotation.x = -Math.PI / 2; pool.renderOrder = 2; pool.frustumCulled = false;
    root.add(pool); m.userData.pool = pool;
  }

  /* ---- Projektor · EIN Schattenlicht mit Punkte-Maske = die klassischen Lichtflecken ---- */
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const cx = cv.getContext('2d');
  const dots = Array.from({ length: P.dots }, (_, i) => {
    const r = Math.sqrt((i + 0.5) / P.dots) * 0.47, a = i * 2.399963;
    return { r, a, c: P.palette[i % P.palette.length], s: 2.6 + ((i * 7) % 5) * 0.9, k: 0.55 + ((i * 13) % 7) / 14 };
  });
  let drawnAt = null;
  function drawDots(angle) {
    if (drawnAt != null && Math.abs(angle - drawnAt) < 0.006) return;
    drawnAt = angle;
    cx.fillStyle = '#000'; cx.fillRect(0, 0, 256, 256);
    for (const d of dots) {
      const x = 128 + Math.cos(d.a + angle) * d.r * 256, y = 128 + Math.sin(d.a + angle) * d.r * 256;
      /* weiche Flecken statt harter Scheiben: Kern hell, Rand läuft aus */
      const g = cx.createRadialGradient(x, y, 0, x, y, d.s * 1.8);
      const c = new THREE.Color(d.c), rgb = (a) => `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;
      g.addColorStop(0, rgb(d.k)); g.addColorStop(0.35, rgb(d.k * 0.7)); g.addColorStop(1, rgb(0));
      cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, d.s * 1.8, 0, Math.PI * 2); cx.fill();
    }
    projMap.needsUpdate = true;
  }
  const projMap = own(new THREE.CanvasTexture(cv));
  projMap.colorSpace = THREE.SRGBColorSpace;
  const proj = new THREE.SpotLight(0xffffff, 0, P.projRange, P.projAngle, 0.35, 0);
  proj.name = 'ball.projector';
  proj.castShadow = budget.shadowLights > 0;
  proj.shadow.mapSize.set(512, 512);
  proj.shadow.bias = -0.0005;
  if (proj.castShadow) proj.map = projMap; else fallback.push('kein Schattenlicht im Budget — Projektor ohne Punkte-Maske');
  const projT = new THREE.Object3D(); projT.position.set(0, -10, 0);
  proj.target = projT;
  frame.add(proj, projT);
  drawDots(0);

  /* ---- Bodenfänger · ohne Grundplatte trifft das Projektorlicht keine Fläche (die Schattenebene
     des Hosts zeigt nur Schatten). Die Kugel legt ihre Lichtflecken deshalb selbst als additive
     Projektion auf die Bodenhöhe des Hosts — eigener, begrenzter Effekt, keine Host-Fläche. */
  const catchMat = own(new THREE.MeshBasicMaterial({ map: projMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  const catcher = new THREE.Mesh(own(new THREE.CircleGeometry(1, 48)), catchMat);
  catcher.name = 'ball.floorCatch'; catcher.rotation.x = -Math.PI / 2; catcher.renderOrder = 2; catcher.frustumCulled = false;
  root.add(catcher);

  /* ---- SPOT_SWEEP · drei schattenlose Spots + sichtbare Kegel, Ziele kreisen am Boden ---- */
  const sweeps = [];
  /* Dieselben drei schattenlosen Spots dienen zwei Rollen: in DISCO/BEAT_PULSE folgen sie drei
     Strahlen (Figuren im Strahl werden farbig beleuchtet), in SPOT_SWEEP kreisen sie. Budget bleibt 4. */
  const sweepN = Math.max(0, Math.min(Math.max(P.sweepCount, P.beamLights), budget.lights - 1));
  const litBeams = Array.from({ length: sweepN }, (_, i) => Math.round(i * P.beams / Math.max(1, sweepN)));
  for (let i = 0; i < sweepN; i++) {
    const c = P.palette[(i * 2) % P.palette.length];
    const L = new THREE.SpotLight(c, 0, 20, P.sweepAngle, 0.4, 0);
    L.castShadow = false; L.name = 'ball.sweep.' + i;
    const T = new THREE.Object3D();
    L.target = T;
    const mat = own(beamMaterial(c)); mat.uniforms.uLen.value = 1;
    const cone = new THREE.Mesh(own(beamGeometry(1, Math.tan(P.sweepAngle))), mat);
    cone.name = 'ball.sweepCone.' + i; cone.renderOrder = 3; cone.frustumCulled = false;
    frame.add(L, T, cone);
    sweeps.push({ L, T, cone, mat, ph: i * 2.1 });
  }

  /* ---- EyeRig-Naht: stabiler Anker, dreht NICHT mit, sitzt vorn auf der Kugeloberfläche.
     Heute leer. Ein späterer EyeRig hängt sich hier ein; die Kugel funktioniert mit und ohne. */
  const faceHost = new THREE.Group();
  faceHost.name = 'ball.faceHost';
  faceHost.position.set(0, 0, P.radius * 1.02);
  faceHost.userData.eyeRigHost = { schema: 'kfb.eyerig-host/1?', follows: 'frame', radius: P.radius, note: 'reserviert · kein Auge eingebacken' };
  frame.add(faceHost);

  /* ---- Zustand ---- */
  const S = { mode: def.mode || 'DISCO', spin: P.spin, intensity: P.intensity, angle: 0, kick: 0, lastBar: null, lastT: null, flash: 0, t: 0, float: !!P.float, fy: 0, fv: 0, floorCatch: !!P.floorCatch, bs: 0, bv: 0, lastBeat: null };
  const syncHanger = () => { chain.visible = cap.visible = !S.float; };
  syncHanger();
  const _wp = new THREE.Vector3();
  const _d = new THREE.Vector3(), _bo = new THREE.Vector3(), _h = new THREE.Vector3();
  const _cam = new THREE.Vector3(), _n = new THREE.Vector3(), _L = new THREE.Vector3(0.35, 0.9, 0.6).normalize(), _r = new THREE.Vector3(), _c = new THREE.Color();

  function place({ position = [0, 0, 0], rotationYDeg = 0, scale = 1 } = {}) {
    root.position.fromArray(position);
    root.rotation.set(0, rotationYDeg * D2R, 0);
    root.scale.setScalar(scale);
    root.updateMatrixWorld(true);
  }

  const B = {
    id, root, frame, spinner, faceHost, params: P, MODES,
    setMode(m) { if (MODE_MIX[m]) S.mode = m; return S.mode; },
    setSpin(v) { S.spin = Math.max(0, +v); },
    setIntensity(v) { S.intensity = Math.max(0, Math.min(2, +v)); },
    setPalette(list) { if (!Array.isArray(list) || !list.length) return; P.palette = list; beams.forEach((b, i) => b.material.uniforms.uColor.value.set(list[i % list.length])); dots.forEach((d, i) => { d.c = list[i % list.length]; }); drawnAt = null; sweeps.forEach((s, i) => { const c = list[(i * 2) % list.length]; s.L.color.set(c); s.mat.uniforms.uColor.value.set(c); }); },
    impulse(a = 1) { S.kick += a * 2.2; S.flash = Math.max(S.flash, Math.min(1, a)); S.fv -= 0.32 * a; },
    setFloat(on) { S.float = !!on; syncHanger(); if (!on) { frame.position.set(0, 0, 0); frame.rotation.set(0, 0, 0); S.fy = S.fv = 0; } },
    setFloorCatch(on) { S.floorCatch = !!on; },
    reset() { S.mode = def.mode || 'DISCO'; S.spin = P.spin; S.intensity = P.intensity; S.kick = 0; S.flash = 0; },
    place,
    /* beatState: { time, dt?, beatPos?, level? } — time ist die SZENENUHR des Hosts. Zurückspulen
       dreht zurück; keine eigene Uhr, keine Bildraten-Abhängigkeit. */
    update(bs = {}) {
      const mx = MODE_MIX[S.mode];
      const t = bs.time ?? S.t;
      const dt = S.lastT == null ? 0 : Math.max(-1, Math.min(1, t - S.lastT));
      S.lastT = t; S.t = t;
      const bp = bs.beatPos;
      let pulse = 0;
      if (bp != null) {
        const ph = mod(bp, 1);
        pulse = Math.exp(-ph * 6);
        /* Schlag-Einsatz → Stoß in die Puls-Feder, mit der Lautstärke skaliert */
        const bt = Math.floor(bp);
        if (S.lastBeat != null && bt !== S.lastBeat && dt > 0) S.bv += P.bop * mx.bop * (bs.level != null ? 0.6 + 0.8 * bs.level : 1) * (bt % 4 === 0 ? 1.5 : 1) * 14;
        S.lastBeat = bt;
        const bar = Math.floor(bp / 4);
        if (S.lastBar != null && bar !== S.lastBar && dt > 0 && mx.pulse > 0.6) B.impulse(0.5);
        S.lastBar = bar;
      }
      S.kick *= Math.exp(-Math.abs(dt) * 2.5);
      S.flash *= Math.exp(-Math.abs(dt) * 5);
      S.angle += (S.spin * mx.spin + S.kick) * dt;
      spinner.rotation.y = S.angle;
      /* Puls-Feder (fest in Teilschritten, damit ein grober Bildtakt sie nicht explodieren lässt) */
      { const n = 6, h = Math.max(-0.05, Math.min(0.05, dt)) / n;
        for (let s = 0; s < n; s++) { const a = -P.bopSpring * S.bs - P.bopDamping * S.bv; S.bv += a * h; S.bs += S.bv * h; } }
      const e = Math.max(-0.12, Math.min(0.25, S.bs));
      body.scale.set(1 + e, 1 + e * 0.35 - Math.max(0, -e) * 0.9, 1 + e);   // aufblähen breit, beim Überschwingen gestaucht
      faceHost.position.z = P.radius * 1.02 * (1 + e);
      /* Schweben: Summe langsamer Sinus (inkommensurable Frequenzen, kein sichtbares Muster) +
         gedämpfte Feder, die Impulse schwer und verzögert ausschwingen lässt */
      if (S.float) {
        const h = Math.max(-0.05, Math.min(0.05, dt));
        for (let s = 0; s < 2; s++) { const a = -P.spring * S.fy - P.damping * S.fv; S.fv += a * h / 2; S.fy += S.fv * h / 2; }
        const w = 2 * Math.PI * P.floatRate;
        const y = P.floatAmp * (0.62 * Math.sin(w * t) + 0.38 * Math.sin(w * 1.618 * t + 1.3)) + S.fy;
        const x = P.floatDrift * Math.sin(w * 0.71 * t + 0.4), z = P.floatDrift * 0.8 * Math.sin(w * 0.53 * t + 2.1);
        frame.position.set(x, y, z);
        frame.rotation.set(P.floatTilt * D2R * Math.sin(w * 0.83 * t + 0.7) - S.fy * 0.35, 0, P.floatTilt * D2R * Math.sin(w * 0.61 * t + 1.9));
      }
      const k = S.intensity, pr = P.beatResponse * mx.pulse;
      const pulseK = (1 - pr) + pr * (0.35 + 0.65 * pulse) + S.flash * 0.8;
      const lvl = bs.level != null ? 0.75 + 0.5 * bs.level : 1;
      /* Projektor */
      proj.intensity = 9 * k * mx.proj * pulseK * lvl;
      if (proj.map) drawDots(S.angle);
      /* Bodenfänger unter der Kugel, auf Host-Bodenhöhe, Radius aus Projektorwinkel und Höhe */
      root.updateMatrixWorld(true);
      frame.getWorldPosition(_wp);
      const hgt = Math.max(0.5, _wp.y - P.floorY);
      const rad = hgt * Math.tan(P.projAngle) * 0.92;
      catcher.visible = S.floorCatch && proj.intensity > 0.01;
      if (catcher.visible) {
        const loc = root.worldToLocal(new THREE.Vector3(_wp.x, P.floorY + 0.004, _wp.z));
        catcher.position.copy(loc);
        catcher.scale.setScalar(rad / Math.max(1e-3, root.scale.x));
        catchMat.opacity = Math.min(0.8, 0.075 * proj.intensity);
      }
      /* Kegel */
      root.updateMatrixWorld(true);
      const rs = Math.max(1e-3, root.scale.x);
      const hits = [];
      beams.forEach((b, i) => {
        const u = b.material.uniforms;
        const fl = 0.85 + 0.15 * Math.sin(t * (2.3 + i * 0.37) + i * 1.7);
        u.uAlpha.value = 0.62 * k * mx.beams * pulseK; u.uFlick.value = fl;
        b.getWorldQuaternion(_q); _d.set(0, -1, 0).applyQuaternion(_q); b.getWorldPosition(_bo);
        let L = P.beamMax, hit = false;
        if (_d.y < -0.05) { const l = (_bo.y - P.floorY) / -_d.y; if (l < P.beamMax) { L = l; hit = true; } }
        b.scale.setScalar(L / rs);
        const pool = b.userData.pool;
        pool.visible = hit && mx.beams > 0;
        if (pool.visible) {
          _h.copy(_bo).addScaledVector(_d, L); _h.y = P.floorY + 0.006;
          pool.position.copy(root.worldToLocal(_h.clone()));
          pool.scale.setScalar((L * P.beamSpread * 1.45 / Math.max(0.35, -_d.y)) / rs);
          pool.material.opacity = Math.min(1, 0.55 * k * mx.beams * pulseK * fl);
        }
        hits[i] = { hit, L, point: _h.clone(), dir: _d.clone(), origin: _bo.clone() };
      });
      /* Sweeps */
      sweeps.forEach((s, i) => {
        /* Rolle 1 · Strahl-Licht: der Spot sitzt in der Kugel und zielt auf den Auftreffpunkt seines Strahls */
        if (mx.beamLight > 0 && mx.sweep === 0) {
          const bi = litBeams[i], hb = hits[bi], bm = beams[bi];
          s.L.color.copy(bm.material.uniforms.uColor.value);
          s.L.angle = Math.atan(P.beamSpread) * 1.5; s.L.penumbra = 0.55; s.L.distance = hb.L + 3;
          s.L.intensity = 70 * k * mx.beamLight * pulseK;
          s.L.position.copy(frame.worldToLocal(hb.origin.clone()));
          s.T.position.copy(frame.worldToLocal(hb.origin.clone().addScaledVector(hb.dir, hb.L)));
          s.cone.visible = false;
          return;
        }
        s.L.color.set(P.palette[(i * 2) % P.palette.length]);
        s.L.angle = P.sweepAngle; s.L.penumbra = 0.4; s.L.distance = 20; s.L.position.set(0, 0, 0);
        const on = mx.sweep * k;
        s.L.intensity = 60 * on * (0.6 + 0.4 * pulseK);
        const a = t * (0.55 + 0.17 * i) + s.ph;
        s.T.position.set(Math.cos(a) * P.sweepRadius, -(P.hang * 0 + 6.5), Math.sin(a * 1.3) * P.sweepRadius * 0.7);
        const dir = s.T.position.clone(), len = dir.length();
        s.cone.scale.set(len, len, len);
        s.cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.normalize());
        s.mat.uniforms.uAlpha.value = 0.28 * on;
        s.cone.visible = on > 0.001;
      });
      /* Glanzpunkte: Kachelnormale spiegelt eine feste Lichtrichtung zur Kamera */
      const cam = bs.camera;
      if (cam) {
        root.updateMatrixWorld(true);
        spinner.getWorldQuaternion(_q);
        const c = spinner.getWorldPosition(_p);
        _cam.copy(cam.position).sub(c).normalize();
        const g = mx.glint * k;
        for (let i = 0; i < normals.length; i++) {
          _n.copy(normals[i]).applyQuaternion(_q);
          _r.copy(_L).negate().reflect(_n);
          const v = Math.max(0, _r.dot(_cam));
          const f = Math.pow(v, 90) * 1.6 * g * (0.6 + 0.4 * pulseK);
          glint.setColorAt(i, _c.setRGB(f, f, f));
        }
        glint.instanceColor.needsUpdate = true;
      }
    },
    state() {
      const mx = MODE_MIX[S.mode];
      return { schema: BALL_SCHEMA, id, mode: S.mode, spin: +S.spin.toFixed(3), intensity: +S.intensity.toFixed(2), angleDeg: +(S.angle / D2R % 360).toFixed(1),
        tiles: tiles.length, beams: beams.length, float: S.float, floorCatch: S.floorCatch, bop: +S.bs.toFixed(3), lights: { projector: proj.castShadow ? 'Schattenlicht · Punkte-Maske' : 'ohne Maske', sweeps: sweeps.length, role: mx.sweep > 0 ? 'Sweep' : mx.beamLight > 0 ? 'Strahl-Licht (Strahlen ' + litBeams.join(', ') + ')' : 'aus', total: 1 + sweeps.length, budget },
        active: { projector: mx.proj > 0, beams: mx.beams > 0, sweeps: mx.sweep > 0 }, faceHost: 'ball.faceHost · frei', fallback, palette: P.palette };
    },
    dispose() {
      if (root.parent) root.parent.remove(root);
      for (const d of disposables) d.dispose && d.dispose();
      tileMesh.dispose(); glint.dispose();
      proj.shadow.map && proj.shadow.map.dispose();
    }
  };
  place({ position: anchor.position, rotationYDeg: anchor.rotationYDeg, scale: anchor.scale });
  if (parent) parent.add(root);
  B.update({ time: 0 });
  return B;
}
