// G0 M1 (Briefing BRIEF_WS1_M1_BEWEGUNG_R1): node scripts/m1/<datei> <FB.glb> <Clip-Paket.glb …> [Maßstab]. Clip-Pakete: KayKit Character Animations 1.1 @378b2093 (git show), lokal ~/kfb-ws1/intake/loco/
// Fußtest G0 M1: LOCO-Clips (Rig_Medium, in-place) auf dem v5b-Skelett.
// Je Clip: Fußspitzen-Weltposition über einen Zyklus; Standphase = Fuß nahe Boden; dort horizontale Fußgeschwindigkeit
// (in-place: Fuß gleitet rückwärts). Rutschfrei, wenn Controller-Tempo = Standgeschwindigkeit des Fußes.
// Skelett aus FB_TEMPLATE_LOOK_v5b.glb (nicht aus dem Clip-Paket), Clips aus dem Paket per Knochenname.
import fs from 'fs'
const T = new URL('../../node_modules/three/', import.meta.url).href // three dieses Arbeitsbaums (gepinnt)
const THREE = await import(T + 'build/three.module.js')
const { GLTFLoader } = await import(T + 'examples/jsm/loaders/GLTFLoader.js')
globalThis.self = globalThis
const load = (f) => new Promise((res, rej) => { const b = fs.readFileSync(f); new GLTFLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length), '', res, rej) })
const [fbFile, packFile, scaleArg] = process.argv.slice(2), S = +(scaleArg || 1)
const fb = await load(fbFile), pack = await load(packFile)
const root = fb.scene; root.scale.setScalar(S); root.updateMatrixWorld(true)
const bone = (n) => { let r = null; root.traverse((o) => { if (!r && o.name === THREE.PropertyBinding.sanitizeNodeName(n)) r = o }); return r }
const LOCO = [['Walking_B', 0.98], ['Running_A', 3.303], ['Running_B', 5.255], ['Walking_A', null], ['Walking_C', null]]
const mixer = new THREE.AnimationMixer(root), v = new THREE.Vector3(), out = {}
for (const [name, locoSpeed] of LOCO) {
  const clip = pack.animations.find((a) => a.name === name); if (!clip) continue
  mixer.stopAllAction(); const a = mixer.clipAction(clip); a.reset().play(); a.setEffectiveWeight(1)
  const N = 240, dt = clip.duration / N, tr = { 'toes.l': [], 'toes.r': [], 'foot.l': [], 'foot.r': [] }
  for (let i = 0; i <= N; i++) { mixer.setTime(i * dt); root.updateMatrixWorld(true); for (const k in tr) { bone(k).getWorldPosition(v); tr[k].push([v.x, v.y, v.z]) } }
  // Kriechen wie Handover §3: Wurzel läuft mit Tempo s vorwärts (+z), Kontaktpunkt = tiefster von foot/toes; je Kontakt max. horizontale Spanne
  const creep = (s) => { let worst = 0; for (const side of ['l', 'r']) { const F = tr['foot.' + side], Tt = tr['toes.' + side]
      const pts = F.map((p, i) => { const q = Tt[i][1] < p[1] ? Tt[i] : p; return [q[0], q[1], q[2] + s * i * dt] })
      const yMin = Math.min(...pts.map((p) => p[1])); let seg = []
      const flush = () => { if (seg.length > 1) { const xs = seg.map((p) => p[0]), zs = seg.map((p) => p[2]); worst = Math.max(worst, Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs))) } seg = [] }
      for (const p of pts) { if (p[1] <= yMin + 0.02 * S) seg.push(p); else flush() } flush() } return worst }
  let best = [1e9, 0]; for (let s = 0.2; s <= 7; s += 0.005) { const c = creep(s); if (c < best[0]) best = [c, s] }
  out[name] = { T: +clip.duration.toFixed(3), locoSpeed: locoSpeed && +(locoSpeed * S).toFixed(3), creepAtLocoCm: locoSpeed ? +(100 * creep(locoSpeed * S)).toFixed(1) : null, bestSpeed: +best[1].toFixed(3), creepAtBestCm: +(100 * best[0]).toFixed(1) }
}
console.log(JSON.stringify({ scale: S, clips: out }, null, 1))
