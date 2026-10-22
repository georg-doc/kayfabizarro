// Knet-HUD (V-656) · Overlay-Pass nach dem Weltbild, mit demselben Renderer (kein zweiter WebGL-Kontext). M1Loop ruft HUD_PASS.run(gl) direkt nach
// gl.render(scene, camera). Der Pass sichert den Renderer-Zustand, den das HUD braucht (autoClear aus, Löschfarbe durchsichtig für die gecachten
// Prop-Ansichten, Render-Ziel), und stellt ihn danach wieder her – die Welt sieht im nächsten Bild denselben Renderer wie vorher.
import * as THREE from 'three'

const _c = new THREE.Color()
export const HUD_PASS = { draw: null, runs: 0 }

export function runHudPass(gl) {
  const draw = HUD_PASS.draw; if (!draw || !gl) return
  const autoClear = gl.autoClear, alpha = gl.getClearAlpha(), target = gl.getRenderTarget(); gl.getClearColor(_c)
  try { gl.autoClear = false; gl.setClearColor(0x000000, 0); draw(gl); HUD_PASS.runs++ }
  finally { gl.setRenderTarget(target); gl.setClearColor(_c, alpha); gl.autoClear = autoClear }
}
