// Rost-Look R1 für die Buchmaschine (Georg 22.11.): der Rost der Aqua-Seemine (rost_diff / rost_arm aus sea_mine.rost.glb) auf allen Maschinenteilen,
// Lack nur als Farbcode nach Funktion, abgeplatzt dort, wo die Textur Rost zeigt; blanke, abgegriffene Kanten wie altes Chrom.
// Projektion dreiachsig im Objektraum (Flecken kleben am Teil, keine UV nötig). Hängt sich hinter vorhandene Patches (Knete) und setzt Farbe,
// Rauheit und Metall erst kurz vor der Beleuchtung, damit die Knete die Normalen behält, aber Rost und Chrom ihr Metall bekommen.
// rostLook(material, { tex: { diff, arm }, lack: '#hex' | null, lackAnteil 0…1, kante 0…1, skala }) → uniforms
import * as THREE from 'three'

export function rostLook(material, { tex, lack = null, lackAnteil = 0.6, kante = 0.6, skala = 1.2, rostGrund = 1 } = {}) {
  const U = {
    uRostDiff: { value: tex.diff }, uRostArm: { value: tex.arm }, uRostSkala: { value: skala },
    uLack: { value: new THREE.Color(lack || '#808080') }, uLackAnteil: { value: lack ? lackAnteil : 0 }, uKante: { value: kante }, uRostGrund: { value: rostGrund },
  }
  const vorher = material.onBeforeCompile, schluessel = material.customProgramCacheKey?.bind(material)
  material.onBeforeCompile = (sh, r) => {
    vorher?.call(material, sh, r)
    Object.assign(sh.uniforms, U)
    sh.vertexShader = 'varying vec3 vRostP; varying vec3 vRostN;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvRostP = position; vRostN = normal;')
    sh.fragmentShader = `uniform sampler2D uRostDiff, uRostArm; uniform float uRostSkala, uLackAnteil, uKante, uRostGrund; uniform vec3 uLack; varying vec3 vRostP; varying vec3 vRostN;
vec4 rostTri(sampler2D t, vec3 p, vec3 w) { return texture2D(t, p.yz) * w.x + texture2D(t, p.xz) * w.y + texture2D(t, p.xy) * w.z; }
` + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  vec3 w = pow(abs(normalize(vRostN)), vec3(4.0)); w /= (w.x + w.y + w.z);
  vec3 p = vRostP * uRostSkala;
  vec3 rost = rostTri(uRostDiff, p, w).rgb;                 // sRGB-Textur, three dekodiert
  vec3 arm = rostTri(uRostArm, p, w).rgb;                   // ao, rauheit, metall
  float lum = dot(rost, vec3(0.299, 0.587, 0.114));
  float rostig = smoothstep(0.13, 0.33, rost.r - rost.b * 0.9);   // nur kräftiger Rost frisst den Lack, sonst bleibt er (abgeplatzt, verschmutzt)
  float lack = (1.0 - rostig) * uLackAnteil;
  vec3 farbe = mix(rost * uRostGrund, uLack * (0.45 + 0.8 * lum) * mix(vec3(1.0), rost * 2.2, 0.25), lack);
  float kante = clamp(length(fwidth(normalize(vNormal))) * 3.0 - 0.15, 0.0, 1.0) * uKante;
  farbe = mix(farbe, vec3(0.42, 0.41, 0.39), kante);
  diffuseColor.rgb = farbe * mix(1.0, arm.r, 0.6);
  roughnessFactor = mix(mix(max(arm.g, 0.6), 0.5, lack), 0.32, kante);
  metalnessFactor = mix(mix(arm.b * 0.6, 0.0, lack), 0.85, kante);
}`)
  }
  material.customProgramCacheKey = () => (schluessel ? schluessel() : '') + '|kfb-rost-r1'
  material.needsUpdate = true
  return U
}

// Spiegelumgebung wie im Fahrzeug-Look (Himmel/Boden-Verlauf), damit blankes Metall nicht schwarz wird; die Probebühne stellt sie, im Spiel der Host
export function verlaufUmgebung(renderer, { sky = '#cfe6ef', ground = '#8a7a62' } = {}) {
  const W = 64, H = 32, d = new Uint8Array(W * H * 4), top = new THREE.Color(sky), hor = top.clone().lerp(new THREE.Color('#ffffff'), 0.35), bot = new THREE.Color(ground)
  for (let y = 0; y < H; y++) { const v = 1 - (y + 0.5) / H, c = v > 0.5 ? hor.clone().lerp(top, (v - 0.5) * 2) : bot.clone().lerp(hor, Math.pow(v * 2, 3))
    for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; d[k] = c.r * 255; d[k + 1] = c.g * 255; d[k + 2] = c.b * 255; d[k + 3] = 255 } }
  const t = new THREE.DataTexture(d, W, H); t.mapping = THREE.EquirectangularReflectionMapping; t.flipY = true; t.needsUpdate = true
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(t).texture; t.dispose(); pm.dispose(); return env
}
