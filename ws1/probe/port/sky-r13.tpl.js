// #439 · look=terrain3 · Himmel v2 aus der Gelände-Probe (R13 H1–H6/H19, Georg 21.10.) als Modul nach Host-Vertrag R1.2 §2:
// create(options) -> { object3d, update(dt, ctx), horizonColor(), dispose() }. Eine Himmelsfunktion (skyColor: Verlauf, Horizont-Glow, Sonnenhof,
// warm zur Sonne / kühl gegenüber), Sonnenscheibe, gemalte Kuppelwolken exakt wie in der Probe (Malweise „wie vorher“, Georg 21.10.).
// Shader-Bausteine 1:1 aus der Probe (erzeugt von probe/port/gen_sky.py). Licht, Nebel und Hintergrund besitzt der Host; die Kuppel schreibt kein Licht.
import * as THREE from 'three'
import CFG from '../data/looks/kfb-terrain3.r1.json' with { type: 'json' }
import { NOISE_GLSL } from '../look/terrain3.js'

const SKY_GLSL = `/*@SKY@*/`

export const skyR13Log = { create: 0, update: 0, dispose: 0 }

// options: { palette, mood = 'tag', sunDir: () => [x,y,z], cover = 0.45, sgrad = 0.6, radius = 1400 }
export function createSkyR13(options = {}) {
  skyR13Log.create++
  const { palette = CFG.palette, mood = 'tag', sunDir = null, cover = 0.45, sgrad = 0.6, radius = 1400 } = options
  const A = CFG.palettes[palette] || CFG.palettes.mesa, M = CFG.moods[mood] || CFG.moods.tag
  const hz = new THREE.Color(M.k ? M.horizon : A.sky), ze = new THREE.Color(M.zenith)
  const U = { uHorizon: { value: hz.clone() }, uZenith: { value: ze.clone() }, uSkyMid: { value: hz.clone().lerp(ze, 0.45) }, uSkyGround: { value: hz.clone().multiplyScalar(0.9).lerp(new THREE.Color(A.low), 0.15) },
    uSunDir: { value: new THREE.Vector3(-0.55, 0.75, 0.35).normalize() }, uSunCol: { value: new THREE.Color(M.sun[0]) }, uAntiTint: { value: new THREE.Color(0.92, 0.95, 1.0) }, uAirTint: { value: hz.clone().lerp(ze, 0.5) },
    uHzGlow: { value: 0.06 }, uSunHalo: { value: 0.35 }, uSky2: { value: 1 }, uFogB: { value: 0.003 }, uFogHa: { value: 0.004 }, uFogHb: { value: 0.06 }, uEdgeR: { value: 300 }, uSGrad: { value: sgrad },
    uKul: { value: 0 }, uEdgeSun: { value: new THREE.Color() }, uEdgeAnti: { value: new THREE.Color() }, uAirOff: { value: new THREE.Vector2() },
    uLit: { value: new THREE.Color(M.lit) }, uShade: { value: new THREE.Color(M.shade) }, uTime: { value: 0 }, uCover: { value: cover }, uCamXZ: { value: new THREE.Vector2() } }
  const mat = new THREE.ShaderMaterial({ uniforms: U, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vDir; void main(){ vDir=position; vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position=p.xyww; }',
    fragmentShader: `${NOISE_GLSL}
    uniform vec3 uHorizon, uLit, uShade; uniform float uTime, uCover; uniform vec2 uCamXZ; varying vec3 vDir;
    ${SKY_GLSL}
    float fbm4(vec2 q){ float s=0.0, a=0.5; for(int i=0;i<4;i++){ s+=a*snoise(q); q=mat2(1.6,1.2,-1.2,1.6)*q+vec2(1.7,9.2); a*=0.5; } return s; }
    void main(){
      vec3 d=normalize(vDir);
      vec3 col=skyColor(d); col=mix(col, uSunCol*1.15, smoothstep(0.9970,0.9978,dot(d,uSunDir)));   /* Sonnenscheibe (H19) */
      if(d.y>0.0){   /* gemalte Kuppelwolken wie in der Probe: Rauschen hart geschnitten, Licht-/Schattenton, dunklere Kante */
        vec2 p=d.xz/(d.y+0.12)*0.9+vec2(uTime*0.006,uTime*0.002)+uCamXZ*0.00022;
        float n=fbm4(p*1.4)+0.5, n2=fbm4(p*1.4+vec2(0.07,0.05))+0.5;
        float th=0.9-uCover*0.55, m=smoothstep(th,th+0.012,n);
        vec3 cc=mix(uShade,uLit,step(n2+0.012,n)); cc=mix(cc,uShade*0.82,(m-smoothstep(th+0.012,th+0.03,n))*0.85);
        col=mix(col,cc,m*smoothstep(0.0,0.1,d.y)); }
      gl_FragColor=vec4(col,1.0);
      #include <colorspace_fragment>
    }` })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), mat); mesh.renderOrder = -1; mesh.frustumCulled = false
  const group = new THREE.Group(); group.name = 'sky-r13'; group.add(mesh)
  const sd = new THREE.Vector3()
  return {
    object3d: group,
    uniforms: U,
    update(dt, ctx) { skyR13Log.update++; U.uTime.value += dt
      if (sunDir) { const s = sunDir(); if (s) U.uSunDir.value.copy(sd.set(s[0], s[1], s[2]).normalize()) }
      if (ctx?.camera) { group.position.copy(ctx.camera.position); U.uCamXZ.value.set(ctx.camera.position.x, ctx.camera.position.z) } },
    horizonColor: () => U.uHorizon.value.clone(),
    info: () => ({ palette, mood, radius }),
    dispose() { skyR13Log.dispose++; mesh.geometry.dispose(); mat.dispose() },
  }
}
