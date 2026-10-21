// kfbWater · Flüsse, Bergseen, Wasserfälle und Gischt im Spiel · ERZEUGT von probe/port/gen_water_game.py aus probe/gelaende-probe.html (sha /*@SHA@*/).
// Nicht von Hand ändern: Shader-Körper (Band/See, Fall, Gischt), Kit-Fluid, rivSample und die Gischt-Bällchen kommen 1:1 aus der Gelände-Probe.
// Spiel statt Probe: hgt() liest die Höhentextur des Gelände-Netzes (gleiche Dreiecke wie PlaneGeometry a-b-d / b-c-d), Weltkoordinaten ohne
// schwebenden Ursprung (uCarW = 0), Probe-Schatten und Luftperspektive vorerst neutral, kein Meer (uWater tief).
// Shader: die drei Fragment-Shader der Probe wörtlich, nur ihre Einschübe ${…} sind durch Spiel-Bausteine ersetzt (Höhentextur statt hgt-Formel, Stubs für Schatten/Luft).
// createWater({ hyd, ground: { data, seg, ox, oz, cell }, seed }) → { object3d, update(dt), dispose(), info }   hyd = Ergebnis von kfb-hydro.v1 hydro()
import * as THREE from 'three'
import FLUID from '../data/looks/kfb-fluid.r1.json' with { type: 'json' }

export const WATER_SOURCE_SHA = '/*@SHA@*/'
const F_RIBBON = `/*@F_RIBBON@*/`
const F_FALL = `/*@F_FALL@*/`
const F_FOAM = `/*@F_FOAM@*/`
const F_SEA = `/*@F_SEA@*/`
const V_SEA = `/*@V_SEA@*/`
const V_RIBBON = `/*@V_RIBBON@*/`
const V_FALL = `/*@V_FALL@*/`
const V_FOAM = `/*@V_FOAM@*/`

export function createWater({ hyd, ground, seed = [0, 0], seaY = null, size = 0 }) {
  const root = new THREE.Group(); root.name = 'kfb-water'; const group = root
  const L = new THREE.TextureLoader(), T = (url, srgb) => { const t = L.load(url); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t }
  const D = FLUID.defaults, F = hyd.field
  const gT = new THREE.DataTexture(ground.data, ground.seg + 1, ground.seg + 1, THREE.RedFormat, THREE.FloatType); gT.minFilter = gT.magFilter = THREE.NearestFilter; gT.needsUpdate = true
  const fT = new THREE.DataTexture(F.data, F.N, F.N, THREE.RGBAFormat, THREE.FloatType); fT.minFilter = fT.magFilter = THREE.NearestFilter; fT.needsUpdate = true
  const U = { uTimeR: { value: 0 }, uRivDbg: { value: -1 }, uWater: { value: seaY == null ? -1000 : seaY - 0.15 }, uAmp: { value: 1 }, uWNE: { value: 0.6 }, uWKit: { value: 1 }, uFlKind: { value: 0 }, uFlClar: { value: 1 }, uMoodK: { value: 0 },
    uFlShal: { value: new THREE.Color('#5fc4c9') }, uFlDeep: { value: new THREE.Color('#1f6f86') }, uFlGlow: { value: new THREE.Color('#000000') }, uHorizon: { value: new THREE.Color('#cfe6ef') }, uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.3).normalize() }, uSunCol: { value: new THREE.Color('#fff4e0') }, uShadowOn: { value: 0 }, uShadowMap: { value: null }, uShadowM: { value: new THREE.Matrix4() },   /* Meer = Probe-Wasser (Kit-Zweig) */ uSky2: { value: 0 }, uCarW: { value: new THREE.Vector2() }, uSeed: { value: new THREE.Vector2(...seed) },
    uContact: { value: new THREE.Color('#3a3a34') }, uGround: { value: gT }, uGroundO: { value: new THREE.Vector4(ground.ox, ground.oz, ground.cell, ground.seg) },
    uRiv: { value: fT }, uRivO: { value: new THREE.Vector4(F.ox, F.oz, F.size, 1) },
    uKFCol: { value: new THREE.Color(...D.col) }, uKFShallow: { value: new THREE.Color(...D.shallow) }, uKFMoat: { value: D.moat }, uKFBand: { value: D.band }, uKFShoreFoam: { value: D.shoreFoam },
    uKFV: { value: D.v }, uKFWind: { value: new THREE.Vector2(...D.wind) }, uKFZ: { value: new THREE.Vector2(...D.z) }, uKFDudv: { value: T(FLUID.dudv, false) }, uKFMap: { value: T(FLUID.map, true) }, uKFHasMap: { value: 1 } }
  const mk = (v, f, extra = {}) => new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, vertexShader: v, fragmentShader: f, ...extra })
  const seaMat = mk(V_SEA, F_SEA), mat = mk(V_RIBBON, F_RIBBON, { side: THREE.DoubleSide }), fallMat = mk(V_FALL, F_FALL, { side: THREE.DoubleSide }), foamMat = mk(V_FOAM, F_FOAM)
  const R = hyd.ribbon, geos = [], mats = [seaMat, mat, fallMat, foamMat]
  const add = (g, m, order) => { const o = new THREE.Mesh(g, m); o.frustumCulled = false; o.renderOrder = order; root.add(o); geos.push(g); return o }
  if (R.idx.length) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(R.pos, 3)); g.setAttribute('aFlow', new THREE.Float32BufferAttribute(R.fl, 2)); g.setAttribute('aSN', new THREE.Float32BufferAttribute(R.sn, 2)); g.setAttribute('aLvl', new THREE.Float32BufferAttribute(R.lvA, 1)); g.setIndex(R.idx); add(g, mat, 3) }
  if (seaY != null) add(new THREE.PlaneGeometry(size, size, 128, 128).rotateX(-Math.PI / 2), seaMat, 3)   /* Meer: Höhe setzt der Vertex-Shader (Pegel) */
  const FA = hyd.fallMesh
  if (FA.fi.length) { const g1 = new THREE.BufferGeometry(); g1.setAttribute('position', new THREE.Float32BufferAttribute(FA.fp, 3)); g1.setAttribute('aF', new THREE.Float32BufferAttribute(FA.fa, 4)); g1.setIndex(FA.fi); add(g1, fallMat, 4)
    const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.Float32BufferAttribute(FA.cp, 3)); g2.setAttribute('aC', new THREE.Float32BufferAttribute(FA.ca, 4)); g2.setIndex(FA.ci); add(g2, foamMat, 4) }
  /* Gischt-Bällchen (Knete): 5 je Fall am Fuß – Logik puffs() aus der Probe */
  const pGeo = new THREE.IcosahedronGeometry(1, 1), pMat = new THREE.MeshStandardMaterial({ color: '#cfe3df', roughness: 0.9, metalness: 0 })
  const PUFF = { falls: hyd.falls, mesh: new THREE.InstancedMesh(pGeo, pMat, Math.max(1, hyd.falls.length * 5)), m4: new THREE.Matrix4(), q: new THREE.Quaternion(), v: new THREE.Vector3(), sc: new THREE.Vector3() }
  PUFF.mesh.count = 0; PUFF.mesh.frustumCulled = false; root.add(PUFF.mesh)
/*@PUFFS@*/
  let t = 0
  return {
    object3d: root,
    update(dt = 1 / 60) { t += dt; U.uTimeR.value = t; puffs(t) },
    dispose() { for (const g of geos) g.dispose(); for (const m of mats) m.dispose(); pGeo.dispose(); pMat.dispose(); gT.dispose(); fT.dispose(); U.uKFDudv.value.dispose(); U.uKFMap.value.dispose(); root.clear() },
    info: () => ({ lines: hyd.lines.length, lakes: hyd.lakes.length, falls: hyd.falls.length, ribbonVerts: R.pos.length / 3, sha: WATER_SOURCE_SHA }),
    uniforms: U,
  }
}
