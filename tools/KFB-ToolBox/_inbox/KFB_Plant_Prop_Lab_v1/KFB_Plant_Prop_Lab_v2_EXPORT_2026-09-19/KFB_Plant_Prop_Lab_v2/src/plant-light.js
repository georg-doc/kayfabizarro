/* KFB Plant Prop Lab · Lichtkalibrierung
   Vier Stimmungen aus dem Briefing: TinySkies-Tag · Sonnenuntergang · warmes Interieur ·
   kühle Nacht. Eine Stimmung ist kein Filter über dem Bild, sondern ein Satz Messwerte:
   Himmel/Boden der Hemisphäre, Richtung und Farbe des Keys, Füllung, Hintergrund, Exposure.

   `makeViewer()` aus kit-lab.js bringt eigene Lichter mit. Zwei Lichtsätze auf einer Szene
   addieren sich zu „alles flach hell" — deshalb räumt `installLight()` die Lichter des
   Viewers EINMAL ab und übernimmt danach die Verantwortung. */
import * as THREE from 'three';

export const MOODS = {
  day: {
    label: 'TinySkies · Tag',
    sky: 0xdff1ff, ground: 0x9fb08a, hemi: 1.45,
    keyColor: 0xfff6e2, keyInt: 2.5, keyPos: [-16, 26, 14],
    fillColor: 0xbfd9ff, fillInt: 0.55, fillPos: [18, 10, -16],
    bg: [0x9fd4ef, 0xe8f6ff], exposure: 1, tone: 'aces', shadow: 0.34
  },
  sunset: {
    label: 'TinySkies · Abend',
    sky: 0xffd2a8, ground: 0x5a3f55, hemi: 1.05,
    keyColor: 0xff9d4d, keyInt: 2.9, keyPos: [-26, 7, 9],
    fillColor: 0x7d6bd6, fillInt: 0.8, fillPos: [16, 12, -14],
    bg: [0xe4703f, 0xffc98a], exposure: 1.05, tone: 'aces', shadow: 0.42
  },
  interior: {
    label: 'Interieur · warm',
    sky: 0xffe0b4, ground: 0x2a1c16, hemi: 0.62,
    keyColor: 0xffc07a, keyInt: 2.1, keyPos: [-7, 12, 8],
    fillColor: 0xff8e5a, fillInt: 0.42, fillPos: [9, 4, -7],
    bg: [0x3a241c, 0x18100d], exposure: 1.02, tone: 'aces', shadow: 0.5,
    lamp: { color: 0xffb066, int: 26, pos: [2.4, 3.2, 2.4], decay: 1, dist: 16 }
  },
  night: {
    label: 'Nacht · kühl',
    sky: 0x9db4ff, ground: 0x141428, hemi: 0.5,
    keyColor: 0xbfd0ff, keyInt: 1.15, keyPos: [12, 20, -10],
    fillColor: 0x5a4fa8, fillInt: 0.34, fillPos: [-14, 6, 12],
    bg: [0x141a33, 0x070a16], exposure: 1.1, tone: 'aces', shadow: 0.55,
    lamp: { color: 0x8fd8ff, int: 12, pos: [-2.2, 2.4, 2.2], decay: 1, dist: 14 }
  }
};
export const MOOD_NAMES = Object.keys(MOODS);

/* Hintergrund als vertikaler Verlauf über eine kleine Canvas-Textur: eine Volltonfläche
   liest bei Tageslicht wie ein Studio-Prospekt, und ein Verlauf kostet 2 KB. */
function bgTexture(topHex, botHex) {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 256;
  const g = c.getContext('2d').createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#' + topHex.toString(16).padStart(6, '0'));
  g.addColorStop(1, '#' + botHex.toString(16).padStart(6, '0'));
  const ctx = c.getContext('2d');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function installLight(viewer, opts = {}) {
  const { scene, renderer } = viewer;
  /* Lichter des Viewers abräumen — siehe Kopfkommentar. Einmal, beim Einbau. */
  const stray = [];
  scene.traverse((o) => { if (o.isLight) stray.push(o); });
  for (const l of stray) l.parent && l.parent.remove(l);

  const grp = new THREE.Group();
  grp.name = 'kfb-plant-light';
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.normalBias = 0.03;
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  const lamp = new THREE.PointLight(0xffffff, 0, 10, 1);
  lamp.visible = false;
  grp.add(hemi, key, fill, lamp);
  scene.add(grp);

  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  let current = null, radius = opts.radius || 6;
  const api = {
    get mood() { return current; },
    /* Schattenkamera aus der GEMESSENEN Szenengrösse — eine feste Ausdehnung schneidet bei
       einer LANDMARK-Komposition (Faktor 12) die halbe Pflanze aus der Schattenkarte. */
    setRadius(r) {
      radius = Math.max(2, r);
      const d = radius * 1.8;
      Object.assign(key.shadow.camera, { left: -d, right: d, top: d, bottom: -d, near: 0.2, far: radius * 12 });
      key.shadow.camera.updateProjectionMatrix();
      if (current) api.set(current);
      return radius;
    },
    set(name) {
      const m = MOODS[name] || MOODS.day;
      current = MOODS[name] ? name : 'day';
      hemi.color.setHex(m.sky); hemi.groundColor.setHex(m.ground); hemi.intensity = m.hemi;
      key.color.setHex(m.keyColor); key.intensity = m.keyInt;
      key.position.set(...m.keyPos).normalize().multiplyScalar(radius * 2.6);
      fill.color.setHex(m.fillColor); fill.intensity = m.fillInt;
      fill.position.set(...m.fillPos).normalize().multiplyScalar(radius * 2.2);
      if (m.lamp) {
        lamp.visible = true;
        lamp.color.setHex(m.lamp.color); lamp.intensity = m.lamp.int * (radius / 6);
        lamp.distance = m.lamp.dist * (radius / 6); lamp.decay = m.lamp.decay;
        lamp.position.set(...m.lamp.pos).multiplyScalar(radius / 6);
      } else lamp.visible = false;
      renderer.toneMappingExposure = m.exposure;
      if (scene.background && scene.background.dispose) scene.background.dispose();
      scene.background = bgTexture(m.bg[0], m.bg[1]);
      return { mood: current, label: m.label, shadow: m.shadow, radius: +radius.toFixed(2) };
    },
    report: () => ({ mood: current, label: MOODS[current]?.label, radius: +radius.toFixed(2), lamp: lamp.visible })
  };
  api.setRadius(radius);
  api.set(opts.mood || 'day');
  return api;
}

/* Bodenscheibe, die zur Stimmung passt. Sie ist Bühne, kein Terrain — der Konsument
   (Travel/TinySkies, Dungeon, Project Island) bringt seinen eigenen Untergrund mit. */
export function makeStage(radius = 6, mood = 'day') {
  const col = { day: 0x9ec27a, sunset: 0xa87159, interior: 0x4a3226, night: 0x2c3352 };
  const g = new THREE.CircleGeometry(radius, 64);
  g.rotateX(-Math.PI / 2);
  const m = new THREE.MeshStandardMaterial({ color: col[mood] ?? col.day, roughness: 0.95 });
  const mesh = new THREE.Mesh(g, m);
  mesh.receiveShadow = true;
  mesh.position.y = -0.002;
  mesh.name = 'kfb-stage-ground';
  mesh.userData.setMood = (mo) => m.color.setHex(col[mo] ?? col.day);
  return mesh;
}
