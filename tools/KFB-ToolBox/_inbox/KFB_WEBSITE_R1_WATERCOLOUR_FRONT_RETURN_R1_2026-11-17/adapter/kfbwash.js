// KFB wash look: prepared props are a pencil underdrawing until the website's colour front reaches them, then they take their colour as a
// watercolour wash, from the foot up. The paint is Patch's "Watercolour" by blendi, used unchanged (vendor/patch-watercolour/src/wash.js,
// code MIT, art CC0, source head 71390866, blob 135f864e). This file is only the adapter:
//   - the front has ONE owner, the website's own step list ({ at, t0, speed }, the same list the style pass reads). follow() writes each
//     step once into the wash's arrival map with the owner's own arrival times; the wash's walking-character defaults are not used;
//   - the clock is the host's: tick(t) sets uNow and uploads the map when it changed;
//   - instanced props: the source reads world position and root without the instance matrix. The adapter corrects those two lines in the
//     compiled shader (the source file stays untouched), so every instance asks the map at its own foot;
//   - the host's vertex steps (bend) are composed in, as with the pencil look. The heavy brush-touch trees (createDabs) are left out.
import { createWash } from './vendor/patch-watercolour/src/wash.js'
import { lookSwitch } from './kfbpencil.js'

const FROM = 'vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz; vRoot = root;'
const TO = `vec4 kfbWI = vec4(transformed, 1.0); vec4 kfbRI = vec4(root.xyz, 1.0); float kfbRS = 1.0;
#ifdef USE_INSTANCING
  kfbWI = instanceMatrix * kfbWI; kfbRI = instanceMatrix * kfbRI; kfbRS = length(instanceMatrix[1].xyz);
#endif
  vWorld = (modelMatrix * kfbWI).xyz; vRoot = vec4((modelMatrix * kfbRI).xyz, root.w / max(kfbRS, 1e-4) / max(length(modelMatrix[1].xyz), 1e-4));`   // climb stays seconds per metre of the piece as modelled, whatever its scale in the scene
const instanced = (m) => { const prev = m.onBeforeCompile, key = m.customProgramCacheKey
  m.onBeforeCompile = (s, r) => { prev.call(m, s, r); if (!s.vertexShader.includes(FROM)) throw new Error('[kfbwash] the source line for world position and root was not found: check the source pin'); s.vertexShader = s.vertexShader.replace(FROM, TO) }
  m.customProgramCacheKey = () => key.call(m) + '|kfbInst'; return m }

// rect: where the arrival map lies on the ground { x0, z0, size, cells }. FRONT: metres per second of the website's front for speed 1 (post2.js: 2.6).
export function createWashLook(THREE, { renderer, pixels = 5, compose = null, rect = {}, frontSpeed = 2.6 } = {}) {
  const wash = createWash(rect), size = new THREE.Vector2(), fed = new Set()
  const fit = () => { wash.uniforms.uPx.value = pixels * renderer.getDrawingBufferSize(size).y / 1080; return wash.uniforms.uPx.value }
  // the source hands out finished materials, not its maker: each original material gets a copy that carries the source's own two hooks
  fit(); const sw = lookSwitch(THREE, { make: (orig) => { const src = orig.side === THREE.DoubleSide ? wash.both : wash.solid, m = src.clone(); m.onBeforeCompile = src.onBeforeCompile; m.customProgramCacheKey = src.customProgramCacheKey; return instanced(m) }, compose, needs: ['hatch', 'color', 'root'], label: 'wash' })
  // a step of the website's front: it starts at step.at (x, z) at time step.t0 and runs out at frontSpeed * step.speed metres per second, without end.
  // Written once per step. arrival(d) = t0 + d / v, which is what the style pass shows for the same step.
  const follow = (step) => { if (fed.has(step)) return false; fed.add(step); const v = frontSpeed * (step.speed || 1); wash.paint.touch(step.at.x, step.at.z, step.t0 + 0.9, 1e5, v); return true }
  const arrival = (step, x, z) => step.t0 + Math.hypot(x - step.at.x, z - step.at.z) / (frontSpeed * (step.speed || 1))
  const tick = (t) => { wash.uniforms.uNow.value = t; wash.paint.sync() }
  const reset = () => { wash.paint.none(); fed.clear() }
  const dispose = () => { sw.dispose(); wash.uniforms.uMap.value.dispose() }
  return { wash, add: sw.add, set: sw.set, toggle: sw.toggle, fit, follow, arrival, tick, reset, dispose, get on() { return sw.on }, report: () => ({ ...sw.report(), px: +wash.uniforms.uPx.value.toFixed(3), now: wash.uniforms.uNow.value, steps: fed.size }) }
}
