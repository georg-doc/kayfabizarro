// ============================================================================
// starfield.js — Sternenhimmel mit Milchstraße, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/Starfield.ts (gelesen 27.8.2026).
// Alle Zahlen unverändert: 6000 normale + 240 helle Sterne, 8000 Bandsterne, 1200 Nebelwolken,
// Bandneigung 0.35π, Radius 80, Seed 9999, NEBULA_PALETTE mit zehn Einträgen.
//
// **Warum das mehr ist als „Punkte im Hintergrund" — und warum mein Eigenbau vorher falsch war:**
// meine Fassung hatte 1400 gleich große Punkte in einer `PointsMaterial`-Wolke. Hier sind es drei
// Ebenen mit eigenen Shadern: Kern-plus-Glut je Stern (`core`/`glow` im Fragment), zwei
// Größenklassen, eine geneigte Milchstraßen-Bahn und darüber große, sehr transparente Nebelflecken.
// Das ergibt Tiefe hinter der Kugel — und ohne diese Tiefe liest sich deren facettierte Silhouette
// als Polygonkante statt als Planetenrand.
// ============================================================================

const STAR_COUNT = 6000;
const BRIGHT_STAR_COUNT = 240;
const SPHERE_RADIUS = 80;
const MILKY_STAR_COUNT = 8000;
const MILKY_CLOUD_COUNT = 1200;
const BAND_TILT = Math.PI * 0.35;

const starVert = `
attribute float aSize;
attribute float aBrightness;
varying float vBrightness;
void main() {
  vBrightness = aBrightness;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`;

const starFrag = `
uniform float uOpacity;
varying float vBrightness;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;
  float core = 1.0 - smoothstep(0.0, 0.4, d);
  float glow = 1.0 - smoothstep(0.2, 1.0, d);
  float a = (core * 0.8 + glow * 0.3) * vBrightness * uOpacity;
  vec3 col = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 1.0, 1.0), core);
  gl_FragColor = vec4(col, a);
}
`;

const nebulaVert = `
attribute float aSize;
attribute vec3 aColor;
attribute float aAlpha;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vColor = aColor;
  vAlpha = aAlpha;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`;

const nebulaFrag = `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;
  float a = 1.0 - smoothstep(0.0, 1.0, d);
  a = a * a * vAlpha * uOpacity;
  gl_FragColor = vec4(vColor, a);
}
`;

const NEBULA_PALETTE = [
  [0.35, 0.20, 0.60], [0.50, 0.25, 0.70], [0.20, 0.25, 0.65], [0.65, 0.20, 0.50],
  [0.80, 0.35, 0.55], [0.25, 0.40, 0.75], [0.40, 0.55, 0.80], [0.70, 0.50, 0.35],
  [0.55, 0.30, 0.65], [0.30, 0.35, 0.80],
];

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

export function createStarfield(THREE) {
  const group = new THREE.Group();
  group.name = 'starfield';
  const materials = [];
  const opacityUniform = { value: 1.0 };
  const rand = seededRandom(9999);

  function bandPoint(tiltQuat) {
    const phi = rand() * Math.PI * 2;
    const spread = (rand() - 0.5) * 0.45;
    const theta = Math.PI * 0.5 + spread;
    const v = new THREE.Vector3(
      SPHERE_RADIUS * Math.sin(theta) * Math.cos(phi),
      SPHERE_RADIUS * Math.cos(theta),
      SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi));
    v.applyQuaternion(tiltQuat);
    return v;
  }

  function starMaterial(vs, fs) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: vs, fragmentShader: fs,
      uniforms: { uOpacity: opacityUniform },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    materials.push(mat);
    return mat;
  }

  {   // buildStars
    const total = STAR_COUNT + BRIGHT_STAR_COUNT;
    const positions = new Float32Array(total * 3);
    const sizes = new Float32Array(total);
    const brightnesses = new Float32Array(total);
    for (let i = 0; i < total; i++) {
      const theta = Math.acos(2 * rand() - 1), phi = 2 * Math.PI * rand();
      positions[i * 3] = SPHERE_RADIUS * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = SPHERE_RADIUS * Math.cos(theta);
      if (i >= STAR_COUNT) { sizes[i] = 1.5 + rand() * 3.0; brightnesses[i] = 0.7 + rand() * 0.3; }
      else { sizes[i] = 0.3 + rand() * 1.2; brightnesses[i] = 0.15 + rand() * 0.45; }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
    geo.setAttribute('aBrightness', new THREE.Float32BufferAttribute(brightnesses, 1));
    const pts = new THREE.Points(geo, starMaterial(starVert, starFrag));
    pts.frustumCulled = false;
    group.add(pts);
  }

  const tiltQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0.3).normalize(), BAND_TILT);

  {   // buildMilkyStars
    const positions = new Float32Array(MILKY_STAR_COUNT * 3);
    const sizes = new Float32Array(MILKY_STAR_COUNT);
    const brightnesses = new Float32Array(MILKY_STAR_COUNT);
    for (let i = 0; i < MILKY_STAR_COUNT; i++) {
      const v = bandPoint(tiltQuat);
      positions[i * 3] = v.x; positions[i * 3 + 1] = v.y; positions[i * 3 + 2] = v.z;
      sizes[i] = 0.2 + rand() * 0.8;
      brightnesses[i] = 0.2 + rand() * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
    geo.setAttribute('aBrightness', new THREE.Float32BufferAttribute(brightnesses, 1));
    const pts = new THREE.Points(geo, starMaterial(starVert, starFrag));
    pts.frustumCulled = false;
    group.add(pts);
  }

  {   // buildNebulaClouds
    const positions = new Float32Array(MILKY_CLOUD_COUNT * 3);
    const sizes = new Float32Array(MILKY_CLOUD_COUNT);
    const colors = new Float32Array(MILKY_CLOUD_COUNT * 3);
    const alphas = new Float32Array(MILKY_CLOUD_COUNT);
    for (let i = 0; i < MILKY_CLOUD_COUNT; i++) {
      const v = bandPoint(tiltQuat);
      positions[i * 3] = v.x; positions[i * 3 + 1] = v.y; positions[i * 3 + 2] = v.z;
      const roll = rand();
      sizes[i] = roll < 0.4 ? 3 + rand() * 8 : (roll < 0.75 ? 12 + rand() * 20 : 30 + rand() * 45);
      const pal = NEBULA_PALETTE[Math.floor(rand() * NEBULA_PALETTE.length)];
      const brighten = 0.8 + rand() * 0.4;
      colors[i * 3] = pal[0] * brighten;
      colors[i * 3 + 1] = pal[1] * brighten;
      colors[i * 3 + 2] = pal[2] * brighten;
      alphas[i] = 0.04 + rand() * 0.10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3));
    geo.setAttribute('aAlpha', new THREE.Float32BufferAttribute(alphas, 1));
    const pts = new THREE.Points(geo, starMaterial(nebulaVert, nebulaFrag));
    pts.frustumCulled = false;
    group.add(pts);
  }

  return {
    name: 'starfield', group,
    setOpacity(weight) { opacityUniform.value = weight; },
    dispose() {
      group.traverse((c) => { if (c.geometry) c.geometry.dispose(); });
      for (const m of materials) m.dispose();
    },
  };
}
