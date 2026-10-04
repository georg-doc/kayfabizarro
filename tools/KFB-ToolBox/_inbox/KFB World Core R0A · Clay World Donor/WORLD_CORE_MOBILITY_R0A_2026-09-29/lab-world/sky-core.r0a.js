/* KFB sky-core r0a (29.09.) — Himmel für den World-Core-Spender R0A.
 * Verläufe 1:1 aus TinySkies SkyPresets.ts (über travel/wip/travel_globe_wsa/globe-v13/sky-presets.js, DAY / EVENING),
 * als vertikale Kuppel statt Bildschirm-Backdrop (in der Welt schaut die Kamera auf den Horizont, nicht auf eine Kugel).
 * Licht bleibt nach H0-How-to §4 warmweiß (Knete färbt sonst um); der Himmel tönt nur Hemisphäre und Nebel.
 * Nicht der TinySkies-Runtime (Tag/Nacht-Zyklus, 7-Licht-Rig): das bleibt Laufzeitarbeit (R0B). */
export const SKY_PRESETS = {
  'tiny-tag': {
    label: 'Tiny Tag', source: 'TinySkies DAY_PRESET.skyGradient',
    gradient: [[0.0, '#1a4a82'], [0.12, '#1e5c90'], [0.26, '#2a8cb4'], [0.4, '#40c8dc'], [0.52, '#60d8e8'], [0.62, '#80e8f4'], [0.72, '#b8f4f0'], [0.78, '#e0f0d0'], [0.84, '#f2eca8'], [0.91, '#fff078'], [1.0, '#fff050']],
    fog: '#9fdde2', fogNear: 520, fogFar: 1700, sun: ['#fff4e6', 2.9], hemi: ['#e4f2f4', '#9a9a70', 1.05], back: ['#ffe6d6', 0.6], expo: 1.0
  },
  'tiny-abend': {
    label: 'Tiny Abend', source: 'TinySkies EVENING_PRESET.skyGradient',
    gradient: [[0.0, '#0e0a2a'], [0.15, '#1a1050'], [0.3, '#4a2078'], [0.45, '#a03060'], [0.55, '#cc4840'], [0.65, '#e07828'], [0.75, '#f0a030'], [0.85, '#f8c858'], [1.0, '#fce0a0']],
    fog: '#d69a68', fogNear: 420, fogFar: 1500, sun: ['#ffd2a0', 2.5], hemi: ['#f0c49a', '#6a5040', 0.85], back: ['#b09adc', 0.55], expo: 0.95
  },
  claybound: {
    label: 'Claybound flach', source: 'H0 / T4 scene.background #96bede',
    gradient: [[0, '#96bede'], [1, '#96bede']],
    fog: '#96bede', fogNear: 700, fogFar: 1900, sun: ['#fff4e6', 2.9], hemi: ['#eef4fa', '#9a8a78', 1.05], back: ['#ffe6d6', 0.6], expo: 1.0
  }
};

export function makeSkyDome(THREE, radius = 4200) {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uGrad: { value: tex } }, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D uGrad; varying vec3 vD; void main(){ float y = max(vD.y, 0.0); float t = 1.0 - pow(y, 0.55); gl_FragColor = vec4(texture2D(uGrad, vec2(0.5, t)).rgb, 1.0); }'
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), mat); mesh.name = 'sky-dome'; mesh.frustumCulled = false; mesh.renderOrder = -10;
  const paint = preset => { const ctx = cv.getContext('2d'), g = ctx.createLinearGradient(0, 256, 0, 0);
    for (const [s, c] of preset.gradient) g.addColorStop(s, c); ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 256); tex.needsUpdate = true; };
  return { mesh, paint };
}
