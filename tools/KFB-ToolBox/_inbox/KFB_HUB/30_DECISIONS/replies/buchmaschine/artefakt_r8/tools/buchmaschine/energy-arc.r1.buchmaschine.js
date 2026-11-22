import * as THREE from 'three'
import DATA from '../../src/data/vfx/energy-arc.r1.json' with { type: 'json' }   // Bühne ohne Vite: nur Pfad + Import-Attribut anders als src/vfx/energy-arc.r1.js

export const presets = DATA.presets
const LOD = DATA.shared.lod
const vertexShader = `
attribute float aStrand;
uniform vec3 uA, uB, uUp, uSide;
uniform vec4 uShape, uWave;
uniform vec3 uStrand, uLook;
uniform vec2 uSeed;
uniform float uTime, uStatic;
varying vec2 vStrip;
varying float vStrand;
const float PI = 3.14159265359;

float envelope(float t, float e) {
  return pow(max(0.,sin(PI*t)),e)*step(.0001,t)*step(t,.9999);
}
float wave(float x) {
  float jag = 2. * abs(2.*fract(x/6.283185 + .25)-1.) - 1.;
  return mix(sin(x),jag,uWave.w);
}
vec3 path(float t) {
  float arch = envelope(t,uShape.w);
  vec3 p = mix(uA,uB,t) + arch * (uShape.x*uUp + uShape.y*uSide);
  if (uStatic > .5) return p;
  float body = envelope(t,.88);
  float f = aStrand/max(uStrand.x-1.,1.)-.5;
  float tau = uTime*uWave.y*6.283185;
  float phase = uSeed.x + aStrand*2.39996;
  float phi = t * uStrand.y*6.283185 + phase*.31;
  vec3 fan = uUp*cos(phi)+uSide*sin(phi);
  float noise = wave(t*19.+tau+phase) + uWave.z*.48*wave(t*49.-tau*.81+phase*2.37);
  float lift = wave(t*14.7-tau*.62+phase)*.74 + uWave.z*.33*wave(t*58.+tau*.29+phase);
  return p + body*(fan * (f*uShape.z) + uWave.x*(uSide*noise + uUp*lift));
}
void main(){
  float t = uv.x;
  vec3 p = path(t);
  vec3 v = (viewMatrix*vec4(p,1.)).xyz;
  float tn = t < .993 ? t+.007 : t-.007;
  vec3 tangent = mat3(viewMatrix)*((path(tn) - p) * (t < .993 ? 1. : -1.));
  vec3 lateral = cross(tangent,-normalize(v));
  lateral = dot(lateral,lateral) > 1.e-8 ? normalize(lateral) : vec3(1.,0.,0.);
  float facing = length(cross(normalize(tangent),-normalize(v)));
  float body = max(.018,envelope(t,uStrand.z));
  float size = uStatic > .5 ? max(uLook.x,.16) : uLook.x*(1. + .24*sin(2.4*aStrand));
  size *= mix(.38,1.,smoothstep(.025,.25,facing));
  vec3 shifted = v + lateral * position.x * body * size;
  gl_Position = projectionMatrix*vec4(shifted,1.);
  vStrip = uv;
  vStrand = aStrand;
}
`
const fragmentShader = `
uniform vec3 uColors[5], uRim;
uniform vec3 uLight;
uniform vec3 uLook;
uniform vec2 uSeed;
uniform float uTime, uStatic, uNight, uFade, uFlow, uOpacity;
uniform int uColorCount;
varying vec2 vStrip;
varying float vStrand;
vec3 palette(float t){
  float f = clamp(t,0.,.9999)*float(uColorCount-1);
  int i = int(f);
  return mix(uColors[i],uColors[i+1],fract(f));
}
void main(){
  float t=vStrip.x;
  float crossT=abs(vStrip.y*2.-1.);
  float coreSpan=.72/uLook.y;
  float edgeAA=clamp(fwidth(crossT),.014,.14);
  float cover = 1.-smoothstep(coreSpan-edgeAA,coreSpan+edgeAA,crossT);
  float skirt = pow(max(0.,1.-crossT),2.2);
  float pulse = uStatic > .5 ? .35 : .5+.5*sin((t*1.35-uTime*uFlow*uSeed.y)*6.283185 + vStrand*.65);
  float ripple = uStatic > .5 ? .7 : .76+.24*sin(uTime*uLight.z*6.283185+vStrand*.63);
  float hue = clamp(t*.83 + vStrand*.043 + (vStrip.y-.5)*.24,0.,1.);
  vec3 body = palette(hue);
  vec3 color=mix(uRim*.64,body*(.83+uLook.z*(.33+.5*pulse))*(.86+.17*uNight),cover);
  float mid = 1.-smoothstep(.04,coreSpan,crossT);
  color += body * mid * (.21+.19*pulse)*uLook.z;
  float alpha = max(cover*uLight.x, skirt*uLight.y)*ripple;
  alpha *= mix(.88,1.,smoothstep(0.,uFade,min(t,1.-t)));
  if (uStatic > .5) alpha = cover * .78;
  alpha *= uOpacity;
  if (alpha < .02) discard;
  gl_FragColor=vec4(color,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

function strip(segments, strands) {
  const geometry = new THREE.InstancedBufferGeometry()
  const position = new Float32Array((segments + 1) * 6)
  const uv = new Float32Array((segments + 1) * 4)
  const indices = new Uint16Array(segments * 6)
  for (let row = 0; row <= segments; row++) {
    const vertex = row * 2
    position.set([-1, 0, 0, 1, 0, 0], row * 6)
    uv.set([row / segments, 0, row / segments, 1], row * 4)
    if (row < segments) indices.set([vertex, vertex+1, vertex+2, vertex+1, vertex+3, vertex+2], row * 6)
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geometry.setAttribute('aStrand', new THREE.InstancedBufferAttribute(Float32Array.from({ length: strands }, (_, i) => i), 1))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.instanceCount = strands
  return geometry
}

function readAnchor(anchor, target) {
  if (anchor?.isObject3D) {
    let root = anchor
    while (root.parent) root = root.parent
    if (root.isScene) return anchor.getWorldPosition(target)
  }
  if (anchor?.isVector3) return target.copy(anchor)
  if (Array.isArray(anchor) && anchor.length === 3) return target.fromArray(anchor)
  return target.set(NaN, NaN, NaN)
}

const finite = v => Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)
export function create({ a, b, preset = presets[0].id, up = new THREE.Vector3(0, 1, 0), renderStart } = {}) {
  const recipe = typeof preset === 'string' ? presets.find(p => p.id === preset) : preset
  if (!recipe) throw new RangeError('Unbekanntes Energiebogen-Preset: ' + preset)
  const { shape, motion, visual } = recipe, shared = DATA.shared
  const count = shape.strandCount
  const geometries = {
    near: strip(LOD.near.samplesPerStrand, count),
    mid: strip(LOD.mid.samplesPerStrand, Math.min(3, count)),
    far: strip(LOD.far.samplesPerStrand, 1)
  }
  const aWorld = new THREE.Vector3(), bWorld = new THREE.Vector3(), axis = new THREE.Vector3()
  const u = new THREE.Vector3(), side = new THREE.Vector3()
  const view = new THREE.Vector3(), closest = new THREE.Vector3()
  const gradient = visual.gradientStops
  const uniforms = {
    uA: { value: aWorld }, uB: { value: bWorld }, uUp: { value: u }, uSide: { value: side },
    uShape: { value: new THREE.Vector4() }, uWave: { value: new THREE.Vector4() },
    uStrand: { value: new THREE.Vector3(count, shape.twistTurns, shape.taper) },
    uLook: { value: new THREE.Vector3(shape.ribbonWidthWorld * visual.haloWidthFactor / 2, visual.haloWidthFactor, visual.emissiveGain) },
    uColors: { value: Array.from({ length: 5 }, (_, i) => new THREE.Color(gradient[Math.min(i, gradient.length - 1)])) },
    uColorCount: { value: gradient.length }, uRim: { value: new THREE.Color(visual.rim) },
    uLight: { value: new THREE.Vector3(shared.coreOpacity, shared.skirtOpacity, motion.pulseHz) },
    uTime: { value: 0 }, uStatic: { value: 0 }, uNight: { value: 0 },
    uSeed: { value: new THREE.Vector2(shared.phaseSeed % 6.283185, shared.polarity) },
    uFade: { value: shared.endpointFade }, uFlow: { value: motion.flowCyclesPerSecond }, uOpacity: { value: 1 }
  }
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader,
    depthWrite: false, transparent: true, side: THREE.DoubleSide, forceSinglePass: true })
  const object3d = new THREE.Group()
  object3d.name = 'energy-arc-r1:' + recipe.id
  const mesh = new THREE.Mesh(geometries.near, material)
  mesh.frustumCulled = false
  mesh.renderOrder = 22
  mesh.visible = false
  object3d.add(mesh)
  function align() {
    if (!finite(aWorld) || !finite(bWorld)) return 0
    axis.subVectors(bWorld, aWorld)
    const span = axis.length()
    if (span <= .001) return 0
    axis.divideScalar(span)
    u.copy(up).addScaledVector(axis, -up.dot(axis))
    if (u.lengthSq() < .0001) {
      u.set(Math.abs(axis.x) < .8 ? 1 : 0, 0, Math.abs(axis.x) < .8 ? 0 : 1)
      u.addScaledVector(axis, -u.dot(axis))
    }
    u.normalize()
    side.crossVectors(axis, u).normalize()
    uniforms.uShape.value.set(span*shape.archHeightRatio, span*shape.lateralBiasRatio, span*shape.fan, shared.curvatureExponent)
    uniforms.uWave.value.set(span*motion.displacementRatio, motion.waveFrequencyHz, motion.turbulence, motion.jagged)
    return span
  }
  // The player rig can interpolate again after the fixed simulation step.
  if (renderStart) mesh.onBeforeRender = () => { if (renderStart(aWorld)) align() }
  let lod = 'near', alive = false, disposed = false
  return { object3d,
    update(dt, { camera, tod = 1, opacity = 1 } = {}) {
      if (disposed) return
      readAnchor(a, aWorld)
      readAnchor(b, bWorld)
      const span = align()
      mesh.visible = alive = span > .001
      if (!alive) return
      let distance = 0
      if (camera) {
        camera.getWorldPosition(view)
        const t = THREE.MathUtils.clamp(closest.subVectors(view, aWorld).dot(axis), 0, span)
        distance = closest.copy(aWorld).addScaledVector(axis, t).distanceTo(view)
      }
      lod = distance > DATA.lod.farStart ? 'far' : distance > DATA.lod.nearEnd ? 'mid' : 'near'
      mesh.geometry = geometries[lod]
      uniforms.uStatic.value = lod === 'far' ? 1 : 0
      if (lod !== 'far') uniforms.uTime.value = (uniforms.uTime.value + Math.max(0, dt || 0)) % 4096
      uniforms.uNight.value = 1 - tod
      uniforms.uOpacity.value = opacity
    },
    info: () => ({ id: recipe.id, lod, alive, a: aWorld.toArray(), b: bWorld.toArray(),
      strands: geometries[lod].instanceCount, samples: LOD[lod].samplesPerStrand, time: uniforms.uTime.value }),
    dispose() {
      if (disposed) return
      disposed = true
      alive = false
      object3d.visible = false
      object3d.removeFromParent()
      for (const geometry of Object.values(geometries)) geometry.dispose()
      material.dispose()
    }
  }
}
