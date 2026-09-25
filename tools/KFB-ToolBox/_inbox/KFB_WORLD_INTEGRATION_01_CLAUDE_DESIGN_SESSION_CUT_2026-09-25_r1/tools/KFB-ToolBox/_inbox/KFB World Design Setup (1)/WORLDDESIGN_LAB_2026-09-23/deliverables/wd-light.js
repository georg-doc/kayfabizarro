/* KFB WorldDesign Lab v1 · Lichtprofile (unabhängige Vergleichsschicht)
   Material und Licht bleiben orthogonal — jeder Materialkandidat muss unter beiden Profilen
   prüfbar sein. Licht ist deshalb ein eigenes Rig je Szene, gesteuert von EINEM Zustand.

   BASELINE = Prüfstandwerte aus `kit-lab.js makeViewer()` (Hemisphere 0xdcd6ff/0x2a2140,
   Key 0xfff3e0 mit Schatten, Fill 0x9f8cff). Neutral, KayKit-nah — Vorgabe für die Bank.

   WHACKMAN = gemessen übernommen aus dem Quellstand dieses Projekts:
     `wm-boot.js`   ACES · Hintergrund/Nebel 0x151322 · FogExp2 0.019 · Hemisphere
                    0x3f4a66/0x1f1917 @0.48 · Directional 0x9db4e8 @0.68 + 0x6478a8 @0.12 · 0.98
     `wm-gate-b.js` Fackelpool: PointLight(0xff8c3a, 30, MOD*4.5 = 18, decay 2), HÖCHSTENS SECHS
                    gleichzeitig, Phasen i*1.7, 30*(0.84 + 0.10*sin(11.3t+ph) + 0.06*sin(6.7t+2.3ph))
     `wm-gate-c.js` stufenlose lokale Sicht, Vorgabe AUS
   WhackMan ist absichtlich dunkel: das Weltlicht ist kalt und schwach, die STIMMUNG kommt aus den
   Fackeln. Eine Szene ohne Fackeln in Reichweite ist deshalb schwarz — das war der Fehler der
   ersten Weltszene (zwei Fackeln am Rand eines 16-m-Feldes). Jetzt verteilt die Szene den vollen
   Pool von sechs über ihre Fläche. Die Positionen bleiben LABORpositionen: gemessene
   Flammenpunkte gehören zum Dungeon-Bauteil. */

import * as THREE from 'three';

export const DEF = {
  profile: 'baseline',
  ambient: 0.5, world: 0.7, fog: 0, torch: 30, torchRange: 18,
  flicker: 1, local: 0, exposure: 1,
  /* Die Glut ist ein ORTSZEICHEN, kein Materialbefund: additiv und ohne Tiefenschreiben malt sie
     immer über die Silhouette. Am Einzelasset sässe sie auf genau der Fläche, um die es geht, in
     allen Feldern identisch. Deshalb: Fackel-LICHT immer, Glut-SPRITE nur in der Weltszene. */
  glow: false
};
export const WHACKMAN = { ambient: 0.48, world: 0.68, fog: 0.019, exposure: 0.98 };
export const BASELINE = { ambient: 0.5, world: 0.7, fog: 0, exposure: 1 };

export const PARAMS = [
  ['ambient', 'Ambient', 0, 2.5, 0.01],
  ['world', 'World Light', 0, 3, 0.01],
  ['fog', 'Fog', 0, 0.09, 0.001],
  ['torch', 'Torch Intensity', 0, 120, 1],
  ['torchRange', 'Torch Range', 2, 60, 0.5],
  ['flicker', 'Flicker', 0, 2, 0.01],
  ['local', 'Local Visibility', 0, 1, 0.01],
  ['exposure', 'Exposure', 0.3, 2, 0.01]
];

export const BLOOM_LAYER = 1;
const POOL = 6;

function glowTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d').createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,214,150,0.85)');
  g.addColorStop(0.3, 'rgba(255,150,54,0.30)');
  g.addColorStop(1, 'rgba(255,120,40,0)');
  const ctx = c.getContext('2d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const GLOW = glowTex();

export function makeRig(scene, state) {
  const g = new THREE.Group();
  g.name = 'kfb:light';
  scene.add(g);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  const local = new THREE.PointLight(0xffd9a0, 0, 26, 2);
  g.add(hemi, key, fill, local, key.target);

  const torches = [];
  for (let i = 0; i < POOL; i++) {
    const L = new THREE.PointLight(0xff8c3a, 30, 18, 2);
    L.userData.ph = i * 1.7;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: GLOW, color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false
    }));
    s.layers.enable(BLOOM_LAYER);
    L.add(s);
    g.add(L);
    torches.push(L);
  }
  let active = 2, radius = 3, glowSize = 0.3;
  const centre = new THREE.Vector3();

  function refresh() {
    const wm = state.profile === 'whackman';
    const bg = wm ? 0x151322 : 0x1b1030;
    scene.background = scene.userData.skyBg !== undefined ? scene.userData.skyBg : new THREE.Color(bg);
    scene.fog = state.fog > 0.0005 ? new THREE.FogExp2(bg, state.fog) : null;
    if (wm) {
      hemi.color.set(0x3f4a66); hemi.groundColor.set(0x1f1917); hemi.intensity = state.ambient;
      key.color.set(0x9db4e8); key.intensity = state.world;
      fill.color.set(0x6478a8); fill.intensity = state.world * 0.18;
    } else {
      hemi.color.set(0xdcd6ff); hemi.groundColor.set(0x2a2140); hemi.intensity = state.ambient * 3.8;
      key.color.set(0xfff3e0); key.intensity = state.world * 3;
      fill.color.set(0x9f8cff); fill.intensity = state.world * 0.86;
    }
    torches.forEach((L, i) => {
      L.visible = wm && state.torch > 0.5 && i < active;
      L.distance = state.torchRange;
      L.intensity = state.torch;
      L.children[0].visible = L.visible && !!state.glow;
      L.children[0].scale.setScalar(glowSize);
    });
    local.intensity = state.local * 14;
    local.distance = Math.max(8, radius * 6);
  }

  function keyTo(box) {
    box.getCenter(centre);
    const s = box.getSize(new THREE.Vector3());
    radius = Math.max(0.6, Math.max(s.x, s.y, s.z) * 0.5);
    const d = Math.max(2.2, radius * 2.2);
    key.position.set(centre.x - d * 0.8, centre.y + d * 1.6, centre.z + d);
    key.target.position.copy(centre);
    const r = radius * 1.4;
    Object.assign(key.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 0.2, far: d * 6 });
    key.shadow.camera.updateProjectionMatrix();
    fill.position.set(centre.x + d, centre.y + d * 0.6, centre.z - d);
    local.position.set(centre.x, centre.y + radius * 1.1, centre.z + radius * 1.4);
  }

  /* Bank: zwei Fackeln hoch und VORNE-seitlich statt flach streifend — flaches Streiflicht hat den
     modellierten V-Ausschnitt von GothGirl zum „Dreieck" gemacht. */
  function place(box) {
    keyTo(box);
    active = 2;
    glowSize = Math.min(0.5, Math.max(0.1, radius * 0.18));
    torches[0].position.set(centre.x - radius * 1.8, centre.y + radius * 1.6, centre.z + radius * 2.2);
    torches[1].position.set(centre.x + radius * 2.2, centre.y + radius * 1.2, centre.z + radius * 1.4);
    refresh();
  }

  /* Weltszene: den ganzen Pool über die Fläche verteilen (Positionen kommen vom Host). */
  function placeWorld(box, points) {
    keyTo(box);
    active = Math.min(POOL, points.length);
    glowSize = 0.35;
    for (let i = 0; i < active; i++) torches[i].position.copy(points[i]);
    refresh();
  }

  function update(t) {
    if (state.profile !== 'whackman' || state.torch <= 0.5) return;
    const f = state.flicker;
    for (let i = 0; i < active; i++) {
      const L = torches[i], ph = L.userData.ph;
      L.intensity = state.torch * (1 - f * 0.16 + f * (0.10 * Math.sin(t * 11.3 + ph) + 0.06 * Math.sin(t * 6.7 + ph * 2.3)));
    }
  }

  refresh();
  return { group: g, refresh, place, placeWorld, update, torches, local, key };
}

export function applyRenderer(renderer, state) {
  renderer.toneMapping = state.profile === 'whackman' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
  renderer.toneMappingExposure = state.exposure;
}
