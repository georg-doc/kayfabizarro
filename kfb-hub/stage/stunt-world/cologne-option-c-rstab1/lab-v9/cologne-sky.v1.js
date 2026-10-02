// KFB Cologne Race · Option C · Himmel
//
// Spender, gelesen und angepasst — nicht kopiert:
//   travel/travel-v16/terrain-v16/skydome-shader.js  blob f747574d4283
//     (TinySkies-Linie, portiert nach dannylimanseta/tinyskies; Variante 'S':
//      domain-verzerrtes 4-Oktaven-fbm, Stimmungsrampe, Flussbaender, Sternenfeld)
//   travel/travel-v16/terrain-v16/sky-cards.js       blob e4c2d3a03e58  (count 7)
//   travel/travel-v16/terrain-v16/sky-dice.js        blob e342997e4a5f
//     (DICE_URL media/3D_Assets/dice_ugur_lowpoly.glb)
//
// EINE Anpassung ist bewusst: die Farbstopps colA/B/C kommen NICHT aus den
// Travel-Story-Paletten, sondern aus den gemessenen Option-C-Tafeln. Die Tafeln
// sind fuer diese Slice die Farbautoritaet; der Spender liefert die Mathematik.
//
// Planeten: media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/
//   Planet_1..6.gltf (62–151 kB, je ein Knoten, Puffer und Bild eingebettet,
//   Huelle rund 3,8 Einheiten) plus Rock_1/Rock_2. Byteweise geprueft.

import { C } from './option-c-style.v1.js';
import { RAW } from './cologne-world.v1.js';

const NOISE = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C2=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C2.yyy)); vec3 x0=v-i+dot(i,C2.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C2.xxx; vec3 x2=x0-i2+C2.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float fbm(vec3 p){
    float s=snoise(p)*0.5;
    s+=snoise(p*2.03+11.7)*0.25;
    s+=snoise(p*4.11+23.3)*0.125;
    s+=snoise(p*8.07+47.1)*0.0625;
    return s;
  }`;

const VERT = 'varying vec3 vDir; void main(){ vDir=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }';

const FRAG = `
  uniform float uPhase, uEnergy, uWarp, uContrast, uFlow, uExposure;
  uniform vec3 uColA, uColB, uColC, uSun, uSunDir, uDeep;
  varying vec3 vDir;
  ${NOISE}
  void main(){
    vec3 dir = normalize(vDir);
    float ph = uPhase;
    // Spender-Mathematik, Variante 'S': Vektorverzerrung, dann Feld und Detail
    vec3 w = vec3(
      fbm(dir*0.75 + ph*0.5),
      fbm(dir*0.75 + ph*0.5 + 5.2),
      fbm(dir*0.75 - ph*0.35 + 9.1)
    ) * uWarp;
    vec3 warped = dir*0.7 + w;
    float field = fbm(warped*0.95 + ph*0.4);
    float detail = fbm(warped*2.6 - ph*0.7);
    float t1 = field*0.5*uContrast + 0.5;
    vec3 col = mix(uColA, uColB, smoothstep(0.15,0.62,t1));
    col = mix(col, uColC, smoothstep(0.55,0.96, t1 + detail*0.18));
    float ribbon = sin(ph*3.0*uFlow + field*6.283 + dir.y*3.5)*0.5+0.5;
    col += uColC*pow(ribbon,3.0)*0.09;
    // Sonnenuntergang der Tafeln bleibt der Horizont: unten warm, oben tief
    float h = dir.y*0.5+0.5;
    col = mix(col*0.9, col*1.16, h);
    float sun = max(0.0, dot(dir, normalize(uSunDir)));
    col = mix(col, uSun, pow(sun, 30.0)*0.95 + pow(sun, 6.0)*0.18);
    col = mix(uDeep, col, smoothstep(-0.14, 0.05, dir.y));
    gl_FragColor = vec4(col*uExposure, 1.0);
  }`;

const STAR_VERT = `
  attribute float aTw; attribute float aSz; attribute float aWarm;
  uniform float uTime; varying float vTw; varying float vWarm;
  void main(){
    vTw = sin(uTime*0.8 + aTw)*0.35 + 0.6;
    vWarm = aWarm;
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    gl_PointSize = aSz * (320.0 / max(-mv.z, 1.0));
    gl_Position = projectionMatrix * mv;
  }`;
const STAR_FRAG = `
  varying float vTw; varying float vWarm;
  void main(){
    float r = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.26, r);
    vec3 col = mix(vec3(0.66,0.76,1.0), vec3(1.0,0.9,0.72), vWarm);
    gl_FragColor = vec4(col*vTw, mask*vTw*0.7);
  }`;

const mulberry = a => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Toene aus option-c-style: gemessene Werte der beiden Tafeln, keine erfundenen.
// magenta b01 1,44 % · shoulder b02 5,04 % · water b01 3,31 % · gold b01 0,43 %
// skyMidDusk b02 3,87 % · bedDark b01 3,31 %
const PLANET_TINTS = [C.magenta, C.shoulder, C.water, C.gold, C.skyMidDusk, C.bedDark];
// Wuerfelkoerper: kraeftige Toene derselben Tafel, damit sie als Himmelskoerper
// lesen und nicht als graue Klumpen.
const DICE_TINTS = [C.hot, C.lineYellow || C.gold, C.water, C.magenta];

const PLANETS = ['Planet_1', 'Planet_2', 'Planet_3', 'Planet_4', 'Planet_5', 'Planet_6'];
const ROCKS = ['Rock_1', 'Rock_2'];
const ENV = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/';

export function createSky(THREE, opts = {}) {
  const R = opts.radius || 3000;
  const group = new THREE.Group();
  group.name = 'skydome';

  const sunDir = (opts.sunDir || new THREE.Vector3(-0.62, 0.17, -0.76)).clone().normalize();

  // Farbstopps aus den gemessenen Tafeln: tief -> Glut -> Sonne
  const U = {
    uPhase: { value: 0 }, uEnergy: { value: 0.4 },
    // Gemessen gegen die Tafel: mit den Spender-Werten (0,7 / 0,85) wird der Himmel
    // zur Marmorwand und nimmt der Strecke die Aufmerksamkeit. Halbiert.
    uWarp: { value: 0.46 }, uContrast: { value: 0.62 }, uFlow: { value: 0.38 },
    uExposure: { value: opts.exposure ?? 0.98 },
    uColA: { value: new THREE.Color(C.skyHighDusk) },  // #88243c  b02 4,43 %
    uColB: { value: new THREE.Color(C.skyMidDay) },    // #fb8858  b01 2,09 %
    uColC: { value: new THREE.Color(C.skyLowDay) },    // #fde892  b01 1,53 %
    uSun: { value: new THREE.Color(C.sun) },
    uDeep: { value: new THREE.Color(C.deep) },
    uSunDir: { value: sunDir }
  };
  const domeMat = new THREE.ShaderMaterial({
    uniforms: U, vertexShader: VERT, fragmentShader: FRAG,
    side: THREE.BackSide, depthWrite: false, fog: false
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 40), domeMat);
  dome.frustumCulled = false; dome.renderOrder = -3;
  group.add(dome);

  // Sternenfeld nach dem Spender: 1 800 Punkte, Funkeln ueber aTw
  const N = 1800;
  const sg = new THREE.BufferGeometry();
  const sp = new Float32Array(N * 3), tw = new Float32Array(N), sz = new Float32Array(N), wm = new Float32Array(N);
  const rng = mulberry(4242), SR = R * 0.93;
  for (let i = 0; i < N; i++) {
    const u = rng() * 2 - 1, th = rng() * Math.PI * 2, r = Math.sqrt(1 - u * u);
    sp[i * 3] = Math.cos(th) * r * SR; sp[i * 3 + 1] = Math.abs(u) * SR; sp[i * 3 + 2] = Math.sin(th) * r * SR;
    tw[i] = rng() * 6.28; sz[i] = 2.0 + rng() * rng() * 7; wm[i] = Math.sin(tw[i] * 1.7) * 0.5 + 0.5;
  }
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('aTw', new THREE.BufferAttribute(tw, 1));
  sg.setAttribute('aSz', new THREE.BufferAttribute(sz, 1));
  sg.setAttribute('aWarm', new THREE.BufferAttribute(wm, 1));
  const starU = { uTime: { value: 0 } };
  const stars = new THREE.Points(sg, new THREE.ShaderMaterial({
    uniforms: starU, vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending
  }));
  stars.frustumCulled = false; stars.renderOrder = -2;
  group.add(stars);

  const bodies = [];
  const cards = [];
  const dice = [];

  return {
    group, bodies, cards, dice,
    follow(cam) { group.position.set(cam.position.x, 0, cam.position.z); },
    update(dt, t) {
      U.uPhase.value += dt * (0.05 + U.uEnergy.value * 0.22);
      starU.uTime.value = t;
      for (const b of bodies) {
        b.holder.rotation.y += dt * b.spin;
        b.holder.position.y = b.baseY + Math.sin(t * b.bob + b.phase) * b.bobAmp;
      }
      for (const c of cards) {
        c.mesh.rotation.z = Math.sin(t * 0.22 + c.phase) * 0.09;
        c.mesh.position.y = c.baseY + Math.sin(t * 0.34 + c.phase) * 9;
      }
      for (const d of dice) {
        d.mesh.rotation.x += dt * d.sx;
        d.mesh.rotation.y += dt * d.sy;
        d.mesh.position.y = d.baseY + Math.sin(t * 0.4 + d.phase) * 7;
      }
    },

    // Organische Verteilung: goldener Winkel als Grundgeruest, dann jitter je
    // Koerper. Ein reines Raster wuerde sich sofort als Raster verraten; reiner
    // Zufall klumpt. Die Sonnenrichtung bleibt frei, damit der Sonnenuntergang
    // der Tafel nicht verdeckt wird.
    async addPlanets(GLTFLoader, count = 7) {
      const loader = new GLTFLoader();
      const r2 = mulberry(90210);
      const GOLD = Math.PI * (3 - Math.sqrt(5));
      const models = {};
      // Nur Planeten. Rock_1/Rock_2 lasen am Himmel als zerknuelltes Papier, nicht
      // als Himmelskoerper — sie gehoeren auf den Boden, nicht in die Kuppel.
      //
      // Gemessener Befund: bei count 7 ueber sechs Modellen wurde Planet_1 zweimal
      // angefordert, und die Sonnenfenster-Sperre verwarf still genau die Stelle,
      // an der Planet_3 stand. Ergebnis: ein Doppel und eine Luecke, gemeldet als
      // "6 Koerper". Eine Wiederholung ist das Gegenteil einer organischen Verteilung.
      // Jetzt: jeder Koerper genau einmal, und eine gesperrte Stelle wird auf dem
      // naechsten Azimut nachgeholt statt fallengelassen.
      const picks = PLANETS.slice(0, Math.min(count, PLANETS.length));
      for (const name of new Set(picks)) {
        try { models[name] = (await loader.loadAsync(RAW(ENV + name + '.gltf'))).scene; }
        catch (e) { console.warn('[sky] planet', name, e.message); }
      }

      let placed = 0, retries = 0;
      for (let i = 0; i < picks.length; i++) {
        const proto = models[picks[i]];
        if (!proto) continue;
        const az = i * GOLD + (r2() - 0.5) * 0.9;
        // Hoehe: nur obere Halbkugel, mit Streuung; nichts direkt im Zenit
        // Gemessen: bei 9–42 Grad Hoehe standen alle sechs Koerper ausserhalb des
        // Blickfelds der Verfolgerkamera. Ein Fahrer schaut zum Horizont, nicht ins
        // Zenit — also tiefer und naeher haengen.
        // Nachgemessen an Georgs Bild: bei 0,09 rad (5 Grad) stand ein Koerper auf
        // Augenhoehe der Verfolgerkamera und steckte hinter der Bogenbruecke — als
        // Kugel IM Bauwerk gelesen. Der Boden liegt jetzt bei 0,17 rad (10 Grad):
        // noch im Blickfeld eines Fahrers, aber ueber jeder Silhouette.
        const el = 0.17 + r2() * 0.30 + (i % 3) * 0.035;
        const dist = R * (0.52 + r2() * 0.22);
        let dirv = null;
        for (let attempt = 0; attempt < 12; attempt++) {
          const a2 = az + attempt * 0.62;
          const e2 = el + (attempt % 2 ? 0.05 : -0.03) * attempt;
          const v = new THREE.Vector3(
            Math.cos(a2) * Math.cos(e2), Math.sin(Math.max(0.15, e2)), Math.sin(a2) * Math.cos(e2)).normalize();
          if (v.dot(sunDir) <= 0.78) { dirv = v; if (attempt) retries++; break; }
        }
        if (!dirv) continue;
        // Planeten halbiert (Georg, 2026-09-22): sie fuellten mit 14,7 Grad das
        // Bild und druckten die Wuerfel weg. Rund 7 Grad ist die Zielgroesse
        // fuer BEIDE Familien.
        const scale = (46 + r2() * 74) * (0.75 + r2() * 0.6) * 0.5;
        // Ton je Koerper aus der gemessenen Tafelpalette, damit der Himmel zur Welt gehoert
        const bodyTint = new THREE.Color(PLANET_TINTS[i % PLANET_TINTS.length]);

        const holder = new THREE.Group();
        holder.name = 'sky-' + picks[i] + '-' + i;
        const m = proto.clone(true);
        m.scale.setScalar(scale);
        m.traverse(o => {
          if (!o.isMesh) return;
          o.castShadow = false; o.receiveShadow = false;
          o.material = o.material.clone();
          o.material.fog = false;
          // Die Quaternius-Atlas-Palette ist kuehl-grau und liegt neben unserer.
          // Die Textur bleibt, wird aber mit einem GEMESSENEN Tafelton multipliziert
          // und abgedunkelt — sonst stehen die Koerper als helle Flecken im Bild.
          if (o.material.color) o.material.color.copy(bodyTint).multiplyScalar(0.92);
          if (o.material.emissive) {
            o.material.emissive.copy(bodyTint);
            o.material.emissiveIntensity = 0.42;
          }
          o.material.roughness = 1.0;
          o.material.metalness = 0.0;
          // Eigenleuchten im EIGENEN gemessenen Ton — nicht in der Grundfarbe.
          // Zwei Messungen stehen hinter dieser einen Zeile:
          //   Runde 1: emissive = material.color. Die Quaternius-Grundfarbe ist WEISS
          //            (die Farbe steckt in der Atlas-Textur) -> selbstleuchtende
          //            weisse Klumpen.
          //   Runde 2: Eigenleuchten ganz entfernt. Auf 2 km Entfernung erreicht die
          //            Koerper fast kein Licht mehr; am Bildschirm gemessen 1b0b02
          //            gegen einen Himmel von df3718 — 16 % der Himmelshelligkeit,
          //            also ein schwarzes Loch im Sonnenuntergang.
          // Der Ton traegt sich jetzt selbst, die Sonne formt weiterhin.
        });
        holder.add(m);
        holder.position.copy(dirv).multiplyScalar(dist);
        holder.rotation.set(r2() * 6.28, r2() * 6.28, (r2() - 0.5) * 0.7);
        group.add(holder);
        bodies.push({
          holder, spin: (r2() - 0.5) * 0.06, baseY: holder.position.y,
          bob: 0.08 + r2() * 0.12, bobAmp: 4 + r2() * 10, phase: r2() * 6.28,
          name: picks[i], scale: +scale.toFixed(1),
          distM: +dist.toFixed(0), elevationRad: +el.toFixed(3)
        });
        placed++;
      }
      return { placed, requested: picks.length, retries, source: ENV, names: bodies.map(b => b.name) };
    },

    // Sky Cards nach dem Spender sky-cards.js (count 7 dort; hier 3, weil eine
    // Karte hier ein echtes PDF-Rendering ist und nicht sieben davon wert waere)
    addCards(cardList) {
      const r3 = mulberry(1337);
      const GOLD = Math.PI * (3 - Math.sqrt(5));
      cardList.forEach((card, i) => {
        const tex = new THREE.CanvasTexture(card.canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        const h = 170, w = h * card.ar;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true, fog: false, side: THREE.DoubleSide })
        );
        const az = (i + 0.5) * GOLD * 2.1 + r3();
        const el = 0.24 + r3() * 0.30;
        const dist = R * 0.52;
        mesh.position.set(Math.cos(az) * Math.cos(el) * dist, Math.sin(el) * dist, Math.sin(az) * Math.cos(el) * dist);
        mesh.lookAt(0, mesh.position.y * 0.3, 0);
        mesh.renderOrder = -1;
        mesh.name = 'sky-card-' + card.packId + '-' + card.cardNumber;
        group.add(mesh);
        cards.push({ mesh, baseY: mesh.position.y, phase: r3() * 6.28, meta: { packId: card.packId, n: card.cardNumber } });
      });
      return cards.length;
    },

    async addDice(GLTFLoader, count = 4) {
      const url = RAW('media/3D_Assets/dice_ugur_lowpoly.glb');
      let proto = null;
      try { proto = (await new GLTFLoader().loadAsync(url)).scene; }
      catch (e) { return { placed: 0, reason: 'dice donor not reachable: ' + e.message, url }; }
      const r4 = mulberry(777);
      const GOLD = Math.PI * (3 - Math.sqrt(5));
      const box = new THREE.Box3().setFromObject(proto);
      const sz2 = box.getSize(new THREE.Vector3());
      // GEMESSEN 2026-09-22: die Planeten fuellten 14,7 Grad Sichtwinkel, die
      // Wuerfel 2,8 — Faktor fuenf, und deshalb las der Wuerfel als Staubkorn.
      // Georgs Entscheidung: beide auf rund 7 Grad, also Planeten halbieren und
      // Wuerfel verdreifachen. 22 -> 66 Einheiten Kantenmass.
      const base = 66 / Math.max(0.001, Math.max(sz2.x, sz2.y, sz2.z));
      for (let i = 0; i < count; i++) {
        const m = proto.clone(true);
        const s = base * (0.6 + r4() * 0.9);
        m.scale.setScalar(s);
        // Farbig mit weissen Augen, wie der Wuerfel-Begleiter am Fahrzeug:
        // das hellste Material des Spenders sind die Augen, das dunkelste der
        // Koerper. Der Koerper bekommt einen Ton aus der gemessenen Tafel-
        // palette, die Augen reines Weiss — sonst verwaschen beide ineinander.
        const mats = [];
        m.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.fog = false; mats.push(o.material); } });
        if (mats.length) {
          const lum = mt => { const c = mt.color; return c.r * 0.299 + c.g * 0.587 + c.b * 0.114; };
          let hi = mats[0], lo = mats[0];
          for (const mt of mats) { if (lum(mt) > lum(hi)) hi = mt; if (lum(mt) < lum(lo)) lo = mt; }
          lo.color.set(DICE_TINTS[i % DICE_TINTS.length]);
          lo.roughness = 0.75;
          if (hi !== lo) { hi.color.set(0xffffff); hi.roughness = 0.35; }
        }
        const az = i * GOLD * 3.3 + r4() * 0.8;
        // Hoeher an den Himmel: vorher 0,20–0,54 rad, jetzt 0,38–0,80 — sie
        // standen zwischen den Bauwerken statt ueber ihnen.
        const el = 0.38 + r4() * 0.42;
        const dist = R * (0.40 + r4() * 0.14);
        m.position.set(Math.cos(az) * Math.cos(el) * dist, Math.sin(el) * dist, Math.sin(az) * Math.cos(el) * dist);
        m.rotation.set(r4() * 6.28, r4() * 6.28, r4() * 6.28);
        m.name = 'sky-die-' + i;
        group.add(m);
        dice.push({ mesh: m, baseY: m.position.y, phase: r4() * 6.28, sx: (r4() - 0.5) * 0.35, sy: (r4() - 0.5) * 0.4 });
      }
      return { placed: dice.length, url, scale: +base.toFixed(3) };
    }
  };
}
