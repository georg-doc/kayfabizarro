// kfb-light-pool.v1 · WS1 · V-572 (Strahler-Bug global, Georg 20.10.)
// Lichtpfützen als echte Kegel-Projektion auf jeden Empfänger (Terrain, Knete, Figuren) statt flacher Scheiben auf fester Höhe,
// sichtbare Lichtkegel enden weich vor dem Kontakt (Länge per Boden-Abtastung oder Raycast, Alpha-Rampe am Ende) – keine harte Schnittlinie.
// Farben und Werte kommen 1:1 aus der Quelle; Emission nur dort, wo der Kegel trifft (kein Leuchten anderer Flächen).
//
// Benutzung (three r147 global oder r186 als Modul):
//   const LP = createLightPoolKit(THREE, { max: 16 })
//   LP.injectStandard(material)            // MeshStandard/Lambert/Toon/Physical: Pfützen auf diesem Material
//   terrainShader: '...' + LP.glsl + '...'  // eigene ShaderMaterials: Object.assign(uniforms, LP.uniforms), dann
//                                           // col += kfbLightPools(worldPos, normal, albedo);
//   LP.setPools([{ origin, dir, angle, soft, color, intensity, range }])   // jedes Bild oder bei Änderung
//   const beam = LP.makeBeam({ color, opacity, radius }); LP.aimBeam(beam, origin, dir, length)
//   const len = LP.hitDistance(origin, dir, { ground: (x, z) => y, objects: [...], maxLen })
export const VERSION = 'kfb-light-pool.v1'

export function createLightPoolKit(THREE, { max = 16 } = {}) {
  const MAX = Math.max(1, Math.min(32, max | 0))
  const v4 = () => Array.from({ length: MAX }, () => new THREE.Vector4())
  const uniforms = { uLPo: { value: v4() }, uLPd: { value: v4() }, uLPc: { value: v4() }, uLPr: { value: v4() }, uLPn: { value: 0 } }

  // o.xyz Ursprung, o.w cos(Außenwinkel) · d.xyz Richtung, d.w cos(Innenwinkel) · c.rgb Farbe (linear), c.w Stärke · r.x Reichweite
  const glsl = `
  #ifndef KFB_LP
  #define KFB_LP
  #define KFB_LP_MAX ${MAX}
  uniform vec4 uLPo[KFB_LP_MAX]; uniform vec4 uLPd[KFB_LP_MAX]; uniform vec4 uLPc[KFB_LP_MAX]; uniform vec4 uLPr[KFB_LP_MAX]; uniform int uLPn;
  vec3 kfbLightPools(vec3 wp, vec3 n, vec3 albedo){
    vec3 acc = vec3(0.0);
    for (int i = 0; i < KFB_LP_MAX; i++) {
      if (i >= uLPn) break;
      vec3 L = wp - uLPo[i].xyz; float d = length(L); vec3 l = L / max(d, 1e-4);
      float cone = smoothstep(uLPo[i].w, uLPd[i].w, dot(l, uLPd[i].xyz));          /* weicher Rand: Außen- → Innenwinkel */
      float att = 1.0 - smoothstep(uLPr[i].x * 0.75, uLPr[i].x, d);
      float lam = 0.35 + 0.65 * max(dot(n, -l), 0.0);                                /* Flächen zum Licht hin heller, Rückseiten nur wenig */
      acc += uLPc[i].rgb * uLPc[i].w * cone * att * lam;
    }
    return albedo * acc;
  }
  #endif`

  function setPools(list) {
    const n = Math.min(MAX, list.length)
    for (let i = 0; i < n; i++) {
      const p = list[i], dir = (p.dir.clone ? p.dir.clone() : new THREE.Vector3(...p.dir)).normalize()
      const outer = p.angle ?? 0.2, inner = outer * (1 - Math.min(0.95, Math.max(0.02, p.soft ?? 0.35)))
      const c = p.color && p.color.isColor ? p.color : new THREE.Color(p.color ?? '#ffffff')
      uniforms.uLPo.value[i].set(p.origin.x, p.origin.y, p.origin.z, Math.cos(outer))
      uniforms.uLPd.value[i].set(dir.x, dir.y, dir.z, Math.cos(inner))
      uniforms.uLPc.value[i].set(c.r, c.g, c.b, p.intensity ?? 1)
      uniforms.uLPr.value[i].set(p.range ?? 60, 0, 0, 0)
    }
    uniforms.uLPn.value = n
  }

  // Standard-Materialien: Weltlage + Normale selbst rechnen (auch für InstancedMesh), Beitrag vor dem Ausgang addieren
  function injectStandard(material) {
    const prev = material.onBeforeCompile, prevKey = material.customProgramCacheKey
    material.onBeforeCompile = (sh, r) => {
      if (prev) prev.call(material, sh, r)
      Object.assign(sh.uniforms, uniforms)
      sh.vertexShader = 'varying vec3 vLPw; varying vec3 vLPn;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  { vec4 lpP = vec4(transformed, 1.0); vec3 lpN = objectNormal;
  #ifdef USE_INSTANCING
    lpP = instanceMatrix * lpP; lpN = mat3(instanceMatrix) * lpN;
  #endif
    vLPw = (modelMatrix * lpP).xyz; vLPn = normalize(mat3(modelMatrix) * lpN); }`)
      const out = sh.fragmentShader.includes('#include <opaque_fragment>') ? '#include <opaque_fragment>' : '#include <output_fragment>'
      sh.fragmentShader = 'varying vec3 vLPw; varying vec3 vLPn;\n' + glsl + '\n' + sh.fragmentShader.replace(out, `outgoingLight += kfbLightPools(vLPw, normalize(vLPn), diffuseColor.rgb);\n${out}`)
    }
    material.customProgramCacheKey = () => (prevKey ? prevKey.call(material) : '') + '|kfb-lp'
    material.needsUpdate = true
    return material
  }

  // Sichtbarer Kegel: Spitze im Ursprung, Achse +Y der Geometrie (wird auf dir gedreht), Länge = Skalierung.
  // Alpha: Kern heller als Rand (Blickwinkel), letzte 30 % der Länge laufen auf 0 aus → kein harter Schnitt am Boden.
  const beamGeo = new THREE.CylinderGeometry(1, 0.0, 1, 32, 8, true).translate(0, 0.5, 0)
  function makeBeam({ color = '#ffffff', opacity = 0.35, angle = 0.12, fadeStart = 0.7 } = {}) {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uCol: { value: new THREE.Color(color) }, uOp: { value: opacity }, uFade: { value: fadeStart } },
      vertexShader: 'varying float vT; varying vec3 vNv; varying vec3 vVd; void main(){ vT = position.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vNv = normalize(normalMatrix * normal); vVd = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uCol; uniform float uOp, uFade; varying float vT; varying vec3 vNv; varying vec3 vVd; void main(){ float rim = abs(dot(normalize(vNv), normalize(vVd))); float a = uOp * pow(rim, 1.5) * (1.0 - smoothstep(uFade, 1.0, vT)) * smoothstep(0.0, 0.06, vT); gl_FragColor = vec4(uCol * a, a); }',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    })
    const m = new THREE.Mesh(beamGeo, mat); m.frustumCulled = false; m.renderOrder = 3; m.userData.angle = angle
    return m
  }
  const _up = new THREE.Vector3(0, 1, 0), _q = new THREE.Quaternion()
  function aimBeam(mesh, origin, dir, length, radiusAtEnd) {
    const d = dir.clone().normalize(), r = radiusAtEnd ?? Math.tan(mesh.userData.angle ?? 0.12) * length
    mesh.position.copy(origin); mesh.quaternion.copy(_q.setFromUnitVectors(_up, d)); mesh.scale.set(r, length, r)
  }
  // Länge bis zum Kontakt: Boden-Abtastung (Höhenfunktion) und/oder Raycast gegen Objekte; Kegel endet knapp hinter dem Treffer
  const _ray = new THREE.Raycaster()
  function hitDistance(origin, dir, { ground = null, objects = null, maxLen = 80, step = 0.5 } = {}) {
    const d = dir.clone().normalize(); let best = maxLen
    if (ground) { let prev = 0; for (let t = step; t <= maxLen; t += step) { const x = origin.x + d.x * t, y = origin.y + d.y * t, z = origin.z + d.z * t; if (y <= ground(x, z)) { let a = prev, b = t; for (let k = 0; k < 6; k++) { const m = (a + b) / 2; if (origin.y + d.y * m <= ground(origin.x + d.x * m, origin.z + d.z * m)) b = m; else a = m } best = Math.min(best, b); break } prev = t } }
    if (objects && objects.length) { _ray.set(origin, d); _ray.far = best; const hit = _ray.intersectObjects(objects, true)[0]; if (hit) best = Math.min(best, hit.distance) }
    return best
  }
  function dispose() { beamGeo.dispose() }
  return { VERSION, MAX, uniforms, glsl, setPools, injectStandard, makeBeam, aimBeam, hitDistance, dispose }
}
