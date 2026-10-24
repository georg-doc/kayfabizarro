// WS-NPC Phase D (Lead 21.10.: „Du baust das Modul band im Spiel“) · Ork-Band „The KayfaBizarros“ (Scenelet orc_band_01, kfb.scenelet/1 R2, WSB ORKBAND r1b)
// als EIN Modul nach Host-Vertrag R1.2. Kein Kampf, keine Treffer (nur nach Entscheid).
//   Assets: privat (KayKit-Kauf), nie im Repo. M1World bindet sie beim Bauen optional aus src/private (gitignored, Verweis auf ~/kfb-ws1/private-assets, flacher Klon von assets/private) ein;
//           fehlen sie, steht ein sichtbarer Platzhalter da (Kit-Figuren über npcFigure, jubeln im Takt), Status PLACEHOLDER.
//   Takt:   Clip-Zeit = reine Funktion der Weltzeit (bandClock, Formel des Scenelets) → weggehen/zurückkommen ohne Neustart, kein Pop-in.
//   Blick:  Spieler ≤ gazeR in der Blase → Kopf (Knochen „head“ nach dem Mixer, verzögert und begrenzt); die KFB-Augen sitzen im Kopf (r1b gebacken).
//   Kosten: außerhalb von Blase und Bild wird nicht animiert (das nächste Bild rechnet die Clip-Zeit ohnehin frisch aus).
// options: { scenelet, urls: { Dateiname → URL }, at: [x, z], yaw, groundAt(x, z), clock(), player(), camera()?, worldScale, classScale,
//   placeholder?: { cast(i) → Darsteller-Optionen, clipUrls } }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { beatPos, clipTimeAt, placeActor } from './bandClock.js'
import { createNpcFigure, loadClipSet } from './npcFigure.js'
import { CHATTER, songBoundary, bandSongLength, createNotice, createChatterLog, pickSpeakers } from './chatterCues.js' // Sprech-Anlässe (Georg 24.10.)
import { resolveCharacterId } from '../characters/registry.js' // Register CHARACTERS_R1 (V-682): feste Figuren-ID je Darsteller

export const BAND = Object.freeze({ visibleFar: 140, bubbleR: 60, gazeR: 14, headMaxYawDeg: 50, headLag: 0.25, placeholderClip: ['Cheering', 'Idle_A'] })
export const bandLog = { create: 0, update: 0, dispose: 0 }
const fileOf = (ref) => String(ref || '').split('/').pop()

export function createBandLife(options) {
  bandLog.create++
  const sc = options.scenelet, K = options.worldScale ?? 1, s = (options.classScale ?? 1) * K, yaw0 = options.yaw ?? 0, at = options.at || [0, 0]
  const root = new THREE.Group(); root.name = 'band'
  const S = { status: 'LOADING', mode: null, error: null, near: false, ms: null, t: 0, beat: 0, prevSongT: null, songs: 0 }
  // Sprech-Anlässe (Georg 24.10.): Liedende (16 Takte, Platzhalter) = Applaus-Moment, Bemerken des Spielers; Register-IDs über kfb_band_<rolle>,
  // vorläufig bis WS0 feste Band-IDs bestätigt (Status §155)
  const CH = createChatterLog({ group: 'orc_band' }), NOTICE = createNotice()
  const who = (m) => ({ id: m.a.id, characterId: resolveCharacterId('kfb_band_' + m.a.id), idNote: 'vorläufig (WS0 §155)', at: [+m.pl.x.toFixed(2), +m.pl.z.toFixed(2)] })
  const frustum = new THREE.Frustum(), _pv = new THREE.Matrix4(), _sphere = new THREE.Sphere(new THREE.Vector3(), 1.5 * s)
  const _qp = new THREE.Quaternion(), _q = new THREE.Quaternion(), _y = new THREE.Vector3(0, 1, 0)
  const M = (sc?.actors || []).map((a) => {
    const pl = placeActor(a, at, yaw0, s), holder = new THREE.Group(); holder.name = 'band:' + a.id; root.add(holder)
    return { a, pl, holder, gltf: null, mixer: null, action: null, head: null, headYaw: 0, fig: null, clip: a.clip, beats: a.beats || 1, dur: 1 }
  })
  function place(m) { m.holder.position.set(m.pl.x, options.groundAt(m.pl.x, m.pl.z), m.pl.z); m.holder.rotation.set(0, m.pl.yaw, 0) }
  M.forEach(place)

  async function loadPrivate() {
    const loader = new GLTFLoader()
    await Promise.all(M.map(async (m) => {
      const url = options.urls?.[fileOf(sc.assets?.[m.a.asset]?.ref)]
      if (!url) throw new Error('PRIVATE_MISSING ' + (m.a.asset || m.a.id))
      const g = await loader.loadAsync(url), clip = g.animations.find((c) => c.name === m.a.clip)
      if (!clip) throw new Error('CLIP_MISSING ' + m.a.id + ':' + m.a.clip)
      g.scene.scale.setScalar(s * (m.a.s || 1)); m.holder.add(g.scene)
      g.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false } if (!m.head && o.isBone && o.name === 'head') m.head = o })
      m.gltf = g; m.mixer = new THREE.AnimationMixer(g.scene); m.action = m.mixer.clipAction(clip); m.action.play(); m.dur = clip.duration
    }))
    S.mode = 'private'
  }
  async function loadPlaceholder(why) {
    const P = options.placeholder; S.error = why
    if (!P) { S.mode = 'none'; return }
    const clips = await loadClipSet(P.clipUrls || [])
    await Promise.all(M.map(async (m, i) => { m.fig = createNpcFigure({ cast: P.cast(i), id: 'band-' + m.a.id, worldScale: K, groundAt: options.groundAt }); root.add(m.fig.holder); await m.fig.load(clips) }))
    S.mode = 'placeholder'
  }
  const ready = (async () => {
    try { await loadPrivate() } catch (e) { M.forEach((m) => { if (m.gltf) { m.holder.remove(m.gltf.scene); m.gltf = null; m.mixer = null } }); await loadPlaceholder(String(e?.message || e)) }
    S.status = S.mode === 'private' ? 'OK' : S.mode === 'placeholder' ? 'PLACEHOLDER' : 'ERROR'
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })

  // Kopf nach dem Mixer um die Welt-Hochachse drehen (Mixer setzt die Knochen jedes Bild neu, also kein Aufsummieren)
  function turnHead(m, ang) { const H = m.head; if (!H?.parent || Math.abs(ang) < 1e-4) return; H.parent.updateWorldMatrix(true, false); H.parent.getWorldQuaternion(_qp)
    _q.setFromAxisAngle(_y, ang); H.quaternion.premultiply(_qp.clone().invert().multiply(_q).multiply(_qp)) }

  return {
    object3d: root, ready,
    update(dt, hctx) {
      bandLog.update++
      const tm0 = typeof performance !== 'undefined' ? performance.now() : 0
      const t = options.clock ? options.clock() : (S.t += dt); S.t = t
      const pl = options.player?.() || null, cam = options.camera?.() || hctx?.camera || null
      if (cam) { cam.updateMatrixWorld(); _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); frustum.setFromProjectionMatrix(_pv) }
      const d = pl ? Math.hypot(pl.x - at[0], pl.z - at[1]) : Infinity
      _sphere.center.set(at[0], options.groundAt(at[0], at[1]) + s, at[1]); _sphere.radius = 4 * s
      S.near = d < (options.bubbleR ?? BAND.bubbleR) || (!!cam && d < BAND.visibleFar && frustum.intersectsSphere(_sphere))
      S.beat = beatPos(sc.timeline.clock, t)
      if (d < (options.bubbleR ?? BAND.bubbleR) && M.length) { // nur hörbar nah; kein Text, nur Anlass für den Ton
        // Liedgrenze um einen halben Zyklus versetzt (WS-Audio 24.10.): sonst fällt sie auf die Disco-Pause (gleicher 38,4-s-Takt), und vier Figuren sprechen zugleich
        const songT = t - (sc.timeline.clock.phaseOffset_s || 0) - bandSongLength(sc.timeline.clock) / 2, k = songBoundary(S.prevSongT, songT, bandSongLength(sc.timeline.clock))
        if (k != null) { S.songs++; CH.emit(pickSpeakers(M, S.songs).map((m) => ({ ...who(m), mood: CHATTER.mood.songEnd, cause: 'songEnd' })), t) }
        const nr = NOTICE.step(d, t); if (nr) { const m = M.slice().sort((a, b) => Math.hypot(pl.x - a.pl.x, pl.z - a.pl.z) - Math.hypot(pl.x - b.pl.x, pl.z - b.pl.z))[0]; CH.emit([{ ...who(m), mood: CHATTER.mood.notice, cause: 'notice', reason: nr }], t, { force: true }) }
      } else NOTICE.step(d, t)
      S.prevSongT = t - (sc.timeline.clock.phaseOffset_s || 0) - bandSongLength(sc.timeline.clock) / 2
      // MVP-Leistung (Lead 22.10., Muster discoLife): Musiker sind Skin-Meshes ohne Frustum-Culling – je Musiker sichtbar nur im Bild (bis visibleFar)
      // oder ganz nah (12·K, Schatten ins Bild); der Takt läuft weiter (Weltzeit)
      for (const m of M) { const dm = pl ? Math.hypot(pl.x - m.pl.x, pl.z - m.pl.z) : 0; _sphere.center.set(m.pl.x, options.groundAt(m.pl.x, m.pl.z) + s, m.pl.z); _sphere.radius = 1.5 * s
        const vis = !pl || dm < 12 * K || (!!cam && dm < BAND.visibleFar && frustum.intersectsSphere(_sphere)); if (m.holder.visible !== vis) m.holder.visible = vis }
      if (!S.near) return
      for (const m of M) {
        place(m)
        const ct = clipTimeAt(S.beat, m.beats, m.dur, m.a.phase || 0); m.t = ct
        const want = pl && d < BAND.gazeR ? THREE.MathUtils.clamp(Math.atan2(Math.sin(Math.atan2(pl.x - m.pl.x, pl.z - m.pl.z) - m.pl.yaw), Math.cos(Math.atan2(pl.x - m.pl.x, pl.z - m.pl.z) - m.pl.yaw)), -BAND.headMaxYawDeg * Math.PI / 180, BAND.headMaxYawDeg * Math.PI / 180) : 0
        m.headYaw += (want - m.headYaw) * (1 - Math.exp(-dt / BAND.headLag))
        if (m.mixer) { m.action.time = ct; m.mixer.update(0); turnHead(m, m.headYaw) }
        else if (m.fig) { m.fig.present({ x: m.pl.x, z: m.pl.z, yaw: m.pl.yaw, speed: 0, clip: m._pc ? null : { name: BAND.placeholderClip, mode: 'loop' }, gaze: want ? { x: pl.x, z: pl.z, y: pl.y } : null }, dt); m._pc = true; m.fig.update(dt, hctx, m.holder.visible) }
      }
      if (tm0) { const ms = performance.now() - tm0; S.ms = S.ms == null ? ms : S.ms * 0.95 + ms * 0.05 }
    },
    status: () => ({ status: S.status, mode: S.mode, error: S.error, ms: S.ms, members: M.map((m) => ({ id: m.a.id, characterId: resolveCharacterId('kfb_band_' + m.a.id), clip: m.clip, head: !!m.head, loaded: !!(m.gltf || m.fig) })) }),
    debug: () => ({ near: S.near, beat: S.beat, at: at.slice(), yaw: yaw0, members: M.map((m) => ({ id: m.a.id, x: m.pl.x, z: m.pl.z, yaw: m.pl.yaw, clip: m.clip, t: m.t ?? null, headYaw: m.headYaw })) }),
    positions: () => M.map((m) => ({ id: 'band-' + m.a.id, x: m.pl.x, z: m.pl.z, y: options.groundAt(m.pl.x, m.pl.z) })),
    holders: () => M.map((m) => m.holder),
    events: () => CH.events(), // WS-Audio: { type: 'chatter', group: 'orc_band', mood, cause, id, characterId, at, t, seq }
    clayTargets: () => M.filter((m) => m.gltf).map((m) => (m.clayMod ||= { object3d: m.gltf.scene, status: () => ({ status: 'OK' }) })), // Knete (C5): gebackene Band-Figuren (Augen über SKIP_DEFAULT ausgenommen)
    dispose() { bandLog.dispose++; for (const m of M) { m.mixer?.stopAllAction(); m.fig?.dispose(); m.gltf?.scene.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); [].concat(o.material).forEach((x) => x?.dispose()) } }) } root.clear() },
  }
}
