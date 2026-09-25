/* KFB WB-W0 · Globus als Übersicht (eigener Darstellungsmassstab) + Fernfläche der Region
   Geteilt werden SEMANTISCHE Daten (WGS84, Zone-/Route-ID, Seed, Tageszeit) und die Landmaske
   (Natural Earth land-50m). NICHT geteilt wird Rendergeometrie:
   · Globus: Radius 1 (Anzeigeeinheit), Küste per Maske im Fragment-Shader, weich über fwidth —
     keine Vertex-Treppen, keine Zacken in keiner Entfernung.
   · Region: ENU in Metern. Um die Region liegt eine Fernfläche (bis 120 km), deren Höhe der
     Erdkrümmung folgt (−r²/2R) und deren Farbe aus DERSELBEN Maske kommt → beim Handoff decken
     sich beide Bilder, und der Globus blendet über ihr aus. */

import * as THREE from 'three';

export const EARTH_R = 6371008.8;                         // WGS84 mittlerer Erdradius (IUGG)
export const URL_LAND = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json';
export const URL_TOPO = 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm';
/* LAND = Grundfarbe der Regionswiese (w0-region grass/meadow-Mitte) — derselbe Ton auf Globus, Fernfläche und Regionsrand */
export const LAND = new THREE.Color(0x6fa446), SEA = new THREE.Color(0x1f6fa8);

export async function loadMask(log = () => {}) {
  const W = 4096, Hh = 2048;
  const [topo, TJ] = await Promise.all([fetch(URL_LAND).then((r) => { if (!r.ok) throw new Error('land ' + r.status); return r.json(); }), import(URL_TOPO)]);
  const land = TJ.feature(topo, topo.objects.land);
  const c = document.createElement('canvas'); c.width = W; c.height = Hh;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, W, Hh); g.fillStyle = '#fff';
  const X = (lo) => (lo + 180) / 360 * W, Y = (la) => (90 - la) / 180 * Hh;
  const geoms = land.type === 'FeatureCollection' ? land.features.map((f) => f.geometry) : [land.geometry];
  for (const geo of geoms) for (const poly of (geo.type === 'Polygon' ? [geo.coordinates] : geo.coordinates)) {
    g.beginPath();
    for (const ring of poly) { ring.forEach(([lo, la], i) => (i ? g.lineTo(X(lo), Y(la)) : g.moveTo(X(lo), Y(la)))); g.closePath(); }
    g.fill('evenodd');
  }
  const b = document.createElement('canvas'); b.width = W; b.height = Hh;
  const gb = b.getContext('2d'); gb.filter = 'blur(2px)'; gb.drawImage(c, 0, 0);
  const data = gb.getImageData(0, 0, W, Hh).data;
  const tex = new THREE.CanvasTexture(b);
  tex.wrapS = THREE.RepeatWrapping; tex.colorSpace = THREE.NoColorSpace; tex.anisotropy = 8;
  log('globe · Natural Earth land-50m (world-atlas@2.0.2) rasterised ' + W + '×' + Hh + ' · blur 2 px · coast smoothed in the shader (fwidth)');
  return {
    tex, W, H: Hh,
    at(lat, lon) {
      const u = ((lon + 180) / 360 * W) % W, v = Math.max(0, Math.min(Hh - 1, (90 - lat) / 180 * Hh));
      const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, i2 = (i + 1) % W, j2 = Math.min(Hh - 1, j + 1);
      const s = (a, bb) => data[(bb * W + a) * 4] / 255;
      return (s(i, j) * (1 - fu) + s(i2, j) * fu) * (1 - fv) + (s(i, j2) * (1 - fu) + s(i2, j2) * fu) * fv;
    }
  };
}

export const llToDir = (lat, lon, out = new THREE.Vector3()) => {
  const a = lat * Math.PI / 180, o = lon * Math.PI / 180;
  return out.set(Math.cos(a) * Math.sin(o), Math.sin(a), Math.cos(a) * Math.cos(o));
};
/* Ost/Nord-Rahmen an der Zone, passend zur ENU-Abbildung der Region (X Ost · Y oben · Z −Nord) */
export function zoneFrame(lat, lon) {
  const up = llToDir(lat, lon);
  const o = lon * Math.PI / 180, a = lat * Math.PI / 180;
  const east = new THREE.Vector3(Math.cos(o), 0, -Math.sin(o));
  const north = new THREE.Vector3(-Math.sin(a) * Math.sin(o), Math.cos(a), -Math.sin(a) * Math.cos(o));
  return { up, east, north };
}

export function makeGlobe(mask, zone) {
  const scene = new THREE.Scene();
  const F0 = zoneFrame(zone.lat, zone.lon);
  /* Sonne so, dass die Zone voll im Licht liegt; uLit = Einstrahlung des TinySkies-Rigs auf eine
     waagrechte Fläche (vom Host gerechnet) — damit trägt der Globus an der Zone exakt die Farbe,
     die Fernfläche und Regionsrand im Licht haben (kein Farbsprung beim Handoff). */
  const U = { uMask: { value: mask.tex }, uLand: { value: LAND.clone() }, uSea: { value: SEA.clone() }, uSun: { value: F0.up.clone().addScaledVector(F0.east, -0.55).addScaledVector(F0.north, 0.35).normalize() }, uLit: { value: new THREE.Color(1, 1, 1) }, uA: { value: 1 } };
  const mat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: true,
    vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(position); vP = (modelMatrix*vec4(position,1.0)).xyz; gl_Position = projectionMatrix*viewMatrix*vec4(vP,1.0); }',
    fragmentShader: [
      'uniform sampler2D uMask; uniform vec3 uLand, uSea, uSun, uLit; uniform float uA; varying vec3 vN; varying vec3 vP;',
      'void main(){',
      '  vec3 n = normalize(vN);',
      '  float lat = asin(clamp(n.y,-1.0,1.0)); float lon = atan(n.x, n.z);',
      '  vec2 uv = vec2(lon/6.2831853+0.5, 0.5+lat/3.1415927);',
      '  float m = texture2D(uMask, uv).r; float w = fwidth(m)*1.5+0.002;',
      '  float land = smoothstep(0.5-w, 0.5+w, m);',
      '  float pole = smoothstep(0.95, 0.975, abs(n.y));',
      '  vec3 base = mix(uSea, mix(uLand, vec3(0.93,0.95,0.97), pole), land);',
      '  float shade = 0.35 + 0.65 * smoothstep(-0.15, 0.35, dot(n, uSun));',
      '  vec3 col = base * uLit * shade;',
      '  vec3 V = normalize(cameraPosition - vP); float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0);',
      '  col += vec3(0.55,0.75,0.95) * rim * 0.35;',
      '  vec3 c = max(col, 0.0); vec3 s = mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c));',
      '  gl_FragColor = vec4(s, uA);',
      '}'
    ].join('\n')
  });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 512, 256), mat);
  globe.name = 'globe:earth';
  scene.add(globe);
  const haloMat = new THREE.ShaderMaterial({
    uniforms: { uA: U.uA }, transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix*viewMatrix*wp; }',
    fragmentShader: 'uniform float uA; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.6); gl_FragColor = vec4(vec3(0.45,0.7,1.0)*f*uA, f*uA); }'
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.035, 128, 64), haloMat));
  const spaceMat = new THREE.MeshBasicMaterial({ color: 0x05070f, side: THREE.BackSide, transparent: true, depthWrite: false });
  const space = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), spaceMat);
  space.renderOrder = -1;
  scene.add(space);
  /* Zonenmarke: Ring um die WGS84-Koordinate, feste Bildschirmgrösse wird im Host gesetzt */
  const F = zoneFrame(zone.lat, zone.lon);
  const mark = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.0, 48), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, side: THREE.DoubleSide, depthTest: false }));
  mark.position.copy(F.up).multiplyScalar(1.0005);
  mark.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), F.up);
  mark.renderOrder = 5;
  scene.add(mark);
  const camera = new THREE.PerspectiveCamera(48, 1, 1e-6, 100);
  return {
    scene, camera, globe, mark, F, U,
    setAlpha(a) { U.uA.value = a; spaceMat.opacity = a; mark.material.opacity = a; },
    /* Kamera aus der lokalen ENU-Kamera abbilden: Offset(m) → Globus-Einheiten (k = 1/R) */
    sync(localCam, localTarget, altM) {
      const k = 1 / EARTH_R;
      const map = (v, out) => out.copy(F.up).addScaledVector(F.east, v.x * k).addScaledVector(F.up, v.y * k).addScaledVector(F.north, -v.z * k);
      map(localCam.position, camera.position);
      const tg = map(localTarget, new THREE.Vector3());
      const up = new THREE.Vector3().addScaledVector(F.east, localCam.up.x).addScaledVector(F.up, localCam.up.y).addScaledVector(F.north, -localCam.up.z).normalize();
      camera.up.copy(up);
      camera.lookAt(tg);
      camera.fov = localCam.fov; camera.aspect = localCam.aspect;
      const d = camera.position.length() - 1;
      camera.near = Math.max(1e-7, d * 0.2); camera.far = camera.position.length() + 2;
      camera.updateProjectionMatrix();
      mark.scale.setScalar(Math.max(altM * k * 0.04, 3e-5));
    }
  };
}

/* Fernfläche: Ringe logarithmisch von der Regionskante bis 120 km, Höhe = Erdkrümmung */
export function makeFarDisc(mask, zone, inner = 250, outer = 120000) {
  const RINGS = 64, SEG = 160, pos = [], col = [], idx = [];
  const c = new THREE.Color();
  const mPerLat = 111320, mPerLon = 111320 * Math.cos(zone.lat * Math.PI / 180);
  for (let r = 0; r <= RINGS; r++) {
    const rad = inner * Math.pow(outer / inner, r / RINGS);
    for (let s = 0; s < SEG; s++) {
      const a = s / SEG * Math.PI * 2, x = Math.cos(a) * rad, z = Math.sin(a) * rad;
      pos.push(x, -(rad * rad) / (2 * EARTH_R) - 0.25, z);
      const m = mask.at(zone.lat + (-z) / mPerLat, zone.lon + x / mPerLon);
      c.copy(SEA).lerp(LAND, Math.max(0, Math.min(1, (m - 0.4) / 0.2)));
      col.push(c.r, c.g, c.b);
      if (r) { const a0 = (r - 1) * SEG + s, a1 = (r - 1) * SEG + (s + 1) % SEG, b0 = r * SEG + s, b1 = r * SEG + (s + 1) % SEG; idx.push(a0, b0, a1, a1, b0, b1); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  if (g.attributes.normal.getY(0) < 0) { g.index.array.reverse(); g.computeVertexNormals(); }
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
  m.name = 'w0:far-disc';
  m.receiveShadow = false;
  return m;
}
