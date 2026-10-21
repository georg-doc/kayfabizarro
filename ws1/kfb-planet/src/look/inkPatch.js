// WS-NPC Phase C P1 (V-583 Dark Fluffer, Lead-OK 21.10. Punkt a) · Tusche-Patch im Gelände: höchstens 4 begrenzte Flecken Zensur-Tinte #1f1a14
// auf dem Boden-Material, mit organischer Kante über das vorhandene NOISE_GLSL (terrain3). Kein Flood-Shader, keine Änderung an Kollision, Höhen,
// Bäumen oder Licht: nur die Grundfarbe (diffuseColor) wird in den Flecken zur Tinte gemischt; Schatten und Palettenton rechnet der Look danach
// wie überall. Die Schicht hängt nur, solange es Patches gibt: beim ersten Patch angehängt, beim letzten wieder abgenommen (dann gilt wieder das
// ursprüngliche Shader-Programm, Bild byte-gleich; mit angehängter Schicht weichen außerhalb der Flecken höchstens Einzelpixel um ±1 ab, Übersetzung).
//   Patch = { x, z, r, amount (0…1), seed? } in Welt-Metern. uInk[i] = vec4(x, z, r, amount), uInkSeed[i] = seed.
import * as THREE from 'three'
import { NOISE_GLSL } from './terrain3.js'

export const INK = Object.freeze({ max: 4, color: '#1f1a14', edgeNoise: 0.28, edgeScale: 1.6, soft: 0.12 })

// Stärke eines Patches am Punkt (x, z) wie im Shader, ohne Rauschen (für Tests und Spiel-Logik, z. B. „steht im Fleck“)
export const inkAt = (patches, x, z) => Math.max(0, ...patches.map((p) => { const d = Math.hypot(x - p.x, z - p.z) / Math.max(1e-6, p.r); return d >= 1 ? 0 : (p.amount ?? 1) * Math.min(1, (1 - d) / INK.soft) }))

export function applyInkPatches(mat) {
  const U = { uInk: { value: Array.from({ length: INK.max }, () => new THREE.Vector4(0, 0, 1, 0)) }, uInkSeed: { value: new Array(INK.max).fill(0) }, uInkColor: { value: new THREE.Color(INK.color) } }
  // Der Hook bleibt nach dem ersten Patch dauerhaft in der Kette (später angehängte Erweiterungen anderer Module, z. B. Lichtpfützen, bleiben
  // erhalten); er schreibt aber nur, solange `active` ist. Ohne Patch sind Programmtext und Cache-Schlüssel wieder exakt die ursprünglichen.
  let hooked = false, active = false
  const uninstall = () => { if (!active) return; active = false; mat.needsUpdate = true }
  const install = () => {
    if (active) return; active = true; mat.needsUpdate = true
    if (hooked) return; hooked = true
    const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
    mat.onBeforeCompile = (sh, r) => {
      prev?.call(mat, sh, r); if (!active) return; Object.assign(sh.uniforms, U)
      const hasW = /varying vec3 vInkW;/.test(sh.vertexShader)
      if (!hasW) sh.vertexShader = 'varying vec3 vInkW;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vInkW = (modelMatrix * vec4(transformed, 1.0)).xyz;')
      const noise = /float snoise\(vec2/.test(sh.fragmentShader) ? '' : NOISE_GLSL
      sh.fragmentShader = `varying vec3 vInkW;\nuniform vec4 uInk[${INK.max}]; uniform float uInkSeed[${INK.max}]; uniform vec3 uInkColor;\n` + noise + '\n' + sh.fragmentShader
        .replace('#include <roughnessmap_fragment>', `{ float ink = 0.0;
  for (int i = 0; i < ${INK.max}; i++) { vec4 P = uInk[i]; if (P.w <= 0.0) continue;
    vec2 q = vInkW.xz - P.xy; float d = length(q) / max(1e-3, P.z);
    if (d > ${(1 + INK.edgeNoise + 0.01).toFixed(3)}) continue; // außerhalb der größtmöglichen Rauschkante: kein Rauschen rechnen
    float e = 1.0 + ${INK.edgeNoise.toFixed(3)} * snoise(q * ${INK.edgeScale.toFixed(3)} / max(0.3, P.z) + vec2(uInkSeed[i] * 13.17, uInkSeed[i] * 7.31));
    ink = max(ink, P.w * (1.0 - smoothstep(e - ${INK.soft.toFixed(3)}, e, d))); }
  diffuseColor.rgb = mix(diffuseColor.rgb, uInkColor, clamp(ink, 0.0, 1.0)); }
  #include <roughnessmap_fragment>`)
    }
    mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + (active ? '|ink' : '')
  }
  return {
    uniforms: U,
    installed: () => active,
    // patches: [{ x, z, r, amount, seed }] (höchstens INK.max; Rest wird verworfen und gezählt)
    set(patches = []) {
      const list = patches.filter((p) => p && p.r > 0 && (p.amount ?? 1) > 0).slice(0, INK.max)
      if (list.length) install(); else uninstall()
      U.uInk.value.forEach((v, i) => { const p = list[i]; v.set(p ? p.x : 0, p ? p.z : 0, p ? p.r : 1, p ? Math.min(1, p.amount ?? 1) : 0); U.uInkSeed.value[i] = p ? (p.seed ?? i) : 0 })
      return { used: list.length, dropped: Math.max(0, patches.length - INK.max) }
    },
  }
}
