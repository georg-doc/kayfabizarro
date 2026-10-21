// WS-NPC · Eine NPC-Figur im Spiel (gemeinsam für Bewohner, Phase A/B, und Gruppen, Phase D): Darsteller-Slot (actors/actorSlot → eyeActor, KFB-Augen aus
// Georgs Batch), Fortbewegung über den Gang-Mischer m1-gait (V-248: Abspielrate = Tempo / Eigentempo, Füße stehen), Kit-Clips as-is als Overlay (V-574),
// Blick Augen → Kopf → Körper (Kanon Gebiet 10): Augen sofort (Eye-Rig lookAt), Kopf verzögert und begrenzt (Knochen „head“ nach dem Mixer), Körper
// dreht die Logik. Aus residentLife herausgelöst (Werte unverändert).
//   createNpcFigure({ cast (Darsteller-Optionen), id, worldScale, groundAt }) → { holder, actor, load(clips), present(o, dt), soles(), status(), dispose() }
//   o = { x, z, yaw, speed, clip?: { name | [Wunschliste], mode }, gaze?: { x, z, y? } }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { createActor } from '../actors/actorSlot'
import { GaitAnimator } from '../modules/m1-gait'
import { soleOffsets, solePoints } from '../modules/m1-sole'

export const FIGURE = Object.freeze({ headDelay: 0.08, headLag: 0.16, headMaxYawDeg: 55, headMaxPitchDeg: 20, eyeMaxDeg: 32, eyeY: 1.55 })

const clipCache = new Map()
export function loadClips(url) {
  if (!clipCache.has(url)) clipCache.set(url, new GLTFLoader().loadAsync(url).then((g) => { g.scene.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); [].concat(o.material).forEach((m) => m?.dispose()) } }); return g.animations }).catch((e) => { clipCache.delete(url); throw e }))
  return clipCache.get(url)
}
// alle Pakete laden, Namen zusammenführen (erstes Vorkommen gewinnt)
export async function loadClipSet(urls = []) { const clips = {}; for (const u of urls) { const list = await loadClips(u); for (const c of list) if (!clips[c.name]) clips[c.name] = c } return clips }

export function createNpcFigure({ cast, id, worldScale = 1, groundAt, onPlay = null }) {
  const K = worldScale
  const holder = new THREE.Group(); holder.name = 'npc:' + id
  const actor = createActor({ ...cast, motion: 'bind', position: [0, 0, 0], yaw: 0, anchorId: 'npc-' + id, worldScale: K })
  holder.add(actor.object3d); holder.visible = false // erst sichtbar, wenn der Gang-Mischer steht (keine Bindepose im Bild)
  const r = { anim: null, fig: null, head: null, soles: null, scale: (cast.classScale ?? 1) * K, hist: [], clock: 0, headYaw: 0, headPitch: 0, headBase: null, headOut: null, status: 'LOADING', error: null, gazeOwn: false }
  const _m = new THREE.Matrix4(), _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _qa = new THREE.Quaternion(), _qp = new THREE.Quaternion(), _qf = new THREE.Quaternion(), _e = new THREE.Euler()

  async function load(clips) {
    try {
      await actor.ready
      if (actor.status().status !== 'OK') throw new Error('Darsteller: ' + actor.status().status + ' ' + (actor.status().error || ''))
      let fig = null; actor.object3d.traverse((o) => { if (!fig && o.children?.some((c) => c.isSkinnedMesh || c.isBone)) fig = o })
      if (!fig) throw new Error('Figur im Slot nicht gefunden')
      try { r.soles = soleOffsets(THREE, fig) } catch (e) { r.soles = null } // Ferse/Ballen in der Bindepose (Messung Bodenkontakt, wie M1)
      r.anim = new GaitAnimator(fig, clips); r.fig = fig
      fig.traverse((o) => { if (!r.head && o.isBone && o.name === 'head') r.head = o })
      r.anim.update(0, 0); r.status = 'OK'
    } catch (e) { r.status = 'ERROR'; r.error = String(e?.message || e) }
    return r.status
  }

  // Kopf-Schicht nach dem Mixer (wie m1-locoActor applyHead): Drehung im Raum der Figur → Raum des Elternknochens
  function applyHead() {
    const H = r.head; if (!H || !H.parent) return
    if (r.headOut && H.quaternion.equals(r.headOut)) H.quaternion.copy(r.headBase); else (r.headBase ||= new THREE.Quaternion()).copy(H.quaternion)
    if (Math.abs(r.headYaw) < 1e-5 && Math.abs(r.headPitch) < 1e-5) { (r.headOut ||= new THREE.Quaternion()).copy(H.quaternion); return }
    H.parent.updateWorldMatrix(true, false); H.parent.getWorldQuaternion(_qp); r.fig.getWorldQuaternion(_qf)
    _qa.copy(_qp).invert().multiply(_qf); _q.setFromEuler(_e.set(-r.headPitch, r.headYaw, 0, 'YXZ')); _q.premultiply(_qa).multiply(_qa.invert())
    H.quaternion.premultiply(_q); (r.headOut ||= new THREE.Quaternion()).copy(H.quaternion)
  }

  function present(o, dt) {
    const y = groundAt(o.x, o.z)
    holder.position.set(o.x, y, o.z); holder.rotation.set(0, o.yaw, 0)
    if (!r.anim) return
    const want = o.clip && [].concat(o.clip.name).find((n) => r.anim.has(n)) // erster vorhandener Clip der Wunschliste (Kit-Clips as-is)
    if (want) { r.anim.play(want, { mode: o.clip.mode || 'once', fade: 0.2 }); onPlay?.(id, want) }
    r.anim.update(dt, Math.max(0, o.speed) / r.scale)
    // Blick: Ziel im Raum der Figur → Gier/Nick; Kopf folgt verzögert und gedämpft, Augen den Rest
    let ty = 0, tp = 0, g = null
    if (o.gaze) {
      holder.updateWorldMatrix(true, false); _m.copy(holder.matrixWorld).invert()
      const gy = o.gaze.y ?? (groundAt(o.gaze.x, o.gaze.z) + FIGURE.eyeY * K)
      _v.set(o.gaze.x - o.x, gy - (y + FIGURE.eyeY * K), o.gaze.z - o.z).transformDirection(_m)
      g = [Math.atan2(_v.x, _v.z), Math.atan2(_v.y, Math.hypot(_v.x, _v.z))]
      const D = Math.PI / 180; ty = THREE.MathUtils.clamp(g[0], -FIGURE.headMaxYawDeg * D, FIGURE.headMaxYawDeg * D); tp = THREE.MathUtils.clamp(g[1], -FIGURE.headMaxPitchDeg * D, FIGURE.headMaxPitchDeg * D)
    }
    r.clock += dt; r.hist.push([r.clock, ty, tp]); while (r.hist.length > 2 && r.hist[1][0] <= r.clock - FIGURE.headDelay) r.hist.shift()
    const [, dy, dp] = r.hist[0][0] <= r.clock - FIGURE.headDelay ? r.hist[0] : [0, r.headYaw, r.headPitch], hk = 1 - Math.exp(-dt / FIGURE.headLag)
    r.headYaw += (dy - r.headYaw) * hk; r.headPitch += (dp - r.headPitch) * hk
    applyHead()
    if (g) { const D = Math.PI / 180; actor.lookAt(THREE.MathUtils.clamp((g[0] - r.headYaw) / (FIGURE.eyeMaxDeg * D), -1, 1), THREE.MathUtils.clamp((g[1] - r.headPitch) / (FIGURE.eyeMaxDeg * D), -1, 1)); r.gazeOwn = true }
    else if (r.gazeOwn) { actor.lookAt(null); r.gazeOwn = false }
  }

  return {
    holder, actor, load, present,
    update(dt, hctx, show = true) { holder.visible = !!r.anim && show; actor.update(dt, hctx) }, // show = false: unsichtbar (Begegnungstabelle), Plan läuft weiter
    anim: () => r.anim, head: () => r.head,
    soles: () => (r.soles ? Object.fromEntries(Object.entries(solePoints(THREE, r.soles)).map(([k, v]) => [k, v.toArray()])) : null),
    status: () => ({ status: r.status, error: r.error, actor: actor.status?.().status, visible: holder.visible, head: !!r.head }),
    dispose() { try { r.anim?.dispose() } catch (e) { /* weiter */ } actor.dispose() },
  }
}
