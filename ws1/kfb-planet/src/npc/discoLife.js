// Disco K12 (Lead, Dioramen-Test Schritt 3) · Straßendisco „resident-disco-01 / disco_street_01“ als EIN Modul nach Host-Vertrag R1.2, Muster bandLife.
//   Besetzung: WSB K12 (disco_cast_k12.json, kfb.set-cast/1): 7 Tänzer (privat, src/private) + MC FrizzleBob (fb_game, Georgs Export) hinter der Drum Machine.
//   Takt:      Fahrplan statt Simulation (wie die Band): songT = mod(Weltzeit, clock.length); je Platz gilt der letzte Cue mit t ≤ songT (Schleife über 38,4 s,
//              bei gleichem t gewinnt der spätere Eintrag); Clip-Zeit = mod(songT − cue.t, Clip-Länge) (Clips as-is, Schleife). Weggehen/zurückkommen ohne Neustart.
//   Boden:     floorLift nach V-596 (c): Wurzel.y += lerp(values[i], values[i+1], f), i = floor(t·fps) mod n (GLB-lokal, skaliert mit der Figur).
//   Minion:    zwischen den Hits Laufzeit-Hüpfen (grooves.legacy-bounce-v1, K12-Entscheid) auf dem Takt, sonst Clip.
//   Kulisse:   Radio, zwei Boxen, Drum Machine (1,9 u eingesunken), Spiegelkugel – Lagen wie in der Gelände-Probe (RA S17), öffentliche Teile von GitHub.
//   Fehlen die privaten Dateien: Kulisse + MC, Status PLACEHOLDER.
// options: { k12 (discoK12() oder null), cast(slot) → Darsteller-Optionen, mc() → FB-Optionen, createActor, at?: [x, z], yawDeg?, near?: [x, z] (Suchmitte ohne at),
//   groundAt(x, z), clock(), player(), worldScale, classScale, motionLibraryUrl, propsBase }
import * as THREE from 'three'
import { CHATTER, songBoundary, createNotice, createChatterLog, pickSpeakers } from './chatterCues.js' // Sprech-Anlässe (Georg 24.10.)
import { resolveCharacterId } from '../characters/registry.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { placeActor } from './bandClock.js'
import { GFX, gfxChannel } from '../look/groundFx.js' // V-632: Disco-Licht über das gemeinsame Bodenlicht-Modul (Kanal 'disco'), keine eigene Lösung

export const DISCO = Object.freeze({ visibleFar: 160, bubbleR: 70, fade: 0.25, bounceU: 0.07, ballU: [0.95, 7.6, -0.4], length: 38.4, bpm: 100,
  // Licht wie die Gelände-Probe (updateDisco, O-Town): 8 Strahlen von der Kugel, drehen mit 0,5 rad/s, Neigung 0,36 ± 0,28 – Pfützen bleiben auf dem Tanzkreis
  pal: ['#ff4fa3', '#4fd8ff', '#ffe14f', '#8a5bff', '#5bff9a', '#ff8a3d', '#ff4fa3', '#4fd8ff'], beamAngle: 0.11, beamOpacity: 0.42, poolIntensity: 2.2, rangeU: 12 })
export const discoLog = { create: 0, update: 0, dispose: 0 }
// Kulisse in Scenelet-Einheiten (u, +z = Publikum), wie die Gelände-Probe (placeOT): Radio, Boxen, Drum Machine (V-571 prop_buried)
export const DISCO_PROPS = Object.freeze([
  { key: 'radio', p: [-7.56, 0, 2.03], ry: 48, h: 1.0 },
  { key: 'speaker', p: [-8.91, 0, -1.22], ry: 42, h: 1.5 }, { key: 'speaker', p: [8.37, 0, 0.27], ry: -48, h: 1.5 },
  { key: 'drum', p: [0.95, -1.9, -2.9], ry: 0, w: 2.1 },
])
export const DISCO_PROP_FILES = Object.freeze({ radio: 'Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf', speaker: 'KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Speaker.gltf', drum: 'KFB/Drum Machine 2 by Peter Simcoe - eflBcV4gcIl.glb' })

// Rein (Node-geprüft): aktiver Cue und Zeit seit Cue-Beginn bei Liedzeit songT (Schleife über len)
export function discoCueAt(cues, songT, len) {
  if (!cues?.length) return null
  const L = len > 0 ? len : 1, t = ((songT % L) + L) % L
  let k = -1; for (let i = 0; i < cues.length; i++) if (cues[i].t <= t) k = i
  if (k < 0) { k = cues.length - 1; return { i: k, cue: cues[k], local: t + L - cues[k].t } }
  return { i: k, cue: cues[k], local: t - cues[k].t }
}
// Rein: floorLift-Wert (GLB-lokal) zur Clip-Zeit ct
export function floorLiftAt(fl, ct) {
  if (!fl?.values?.length) return 0
  const n = fl.values.length, x = Math.max(0, ct) * (fl.fps || 48), i = Math.floor(x) % n, f = x - Math.floor(x)
  return fl.values[i] + (fl.values[(i + 1) % n] - fl.values[i]) * f
}
// Rein: flachste freie Stelle (Scheibe r) im Ring rMin…rMax um c, abseits von avoid (Liste { at, r }) und über minY; feste Reihenfolge (kein Zufall)
export function discoSite(groundAt, c, { r = 9, rMin = 22, rMax = 70, avoid = [], minY = -Infinity } = {}) {
  let best = null
  for (let ri = rMin; ri <= rMax; ri += 6) for (let a = 0; a < 24; a++) {
    const an = (a / 24) * Math.PI * 2, x = c[0] + Math.cos(an) * ri, z = c[1] + Math.sin(an) * ri
    if (avoid.some((o) => Math.hypot(x - o.at[0], z - o.at[1]) < o.r)) continue
    const h0 = groundAt(x, z); if (!(h0 > minY)) continue
    let dev = 0; for (let k = 0; k < 12; k++) { const b = (k / 12) * Math.PI * 2; for (const rr of [r * 0.5, r]) dev = Math.max(dev, Math.abs(groundAt(x + Math.cos(b) * rr, z + Math.sin(b) * rr) - h0)) }
    const score = dev + ri * 0.004
    if (!best || score < best.score) best = { at: [+x.toFixed(2), +z.toFixed(2)], dev: +dev.toFixed(3), score }
  }
  return best
}

export function createDiscoLife(options) {
  discoLog.create++
  const K = options.worldScale ?? 1, s = (options.classScale ?? 1) * K, k12 = options.k12 || null
  const len = k12?.clock?.length || DISCO.length, bpm = k12?.clock?.bpm || DISCO.bpm
  const site = options.at ? { at: options.at, dev: null } : discoSite(options.groundAt, options.near || [0, 0], { r: 9 * s / 0.616, avoid: options.avoid || [], minY: options.minY ?? -Infinity }) || { at: [0, 0], dev: null }
  const at = site.at, yaw0 = options.yawDeg != null ? (options.yawDeg * Math.PI) / 180 : Math.atan2(-at[0], -at[1]) // Publikum (+z) zur Platzmitte
  const root = new THREE.Group(); root.name = 'disco'
  const S = { status: 'LOADING', mode: k12 ? 'private' : 'placeholder', error: null, near: false, ms: null, t: 0, songT: 0, beat: 0, prevT: null, songs: 0 }
  // Sprech-Anlässe (Georg 24.10.): Pause zwischen Liedern (Schleifenwechsel der K12-Uhr), Bemerken des Spielers; Register-ID aus dem cast des Platzes
  // (MC = FrizzleBob), vorläufig bis WS0 feste Disco-IDs bestätigt (Status §155)
  const CHL = createChatterLog({ group: 'disco_k12' }), NOTICE = createNotice()
  const who = (m) => ({ id: m.sl.slot, characterId: resolveCharacterId(m.sl.mc ? 'frizzlebob' : m.sl.cast || m.sl.actor || ''), idNote: 'vorläufig (WS0 §155)', at: [+m.pl.x.toFixed(2), +m.pl.z.toFixed(2)] })
  const frustum = new THREE.Frustum(), _pv = new THREE.Matrix4(), _sphere = new THREE.Sphere(new THREE.Vector3(), 12 * s)
  const loader = new GLTFLoader()
  const groundY = () => options.groundAt(at[0], at[1])
  const holderAt = (p, ry, name) => { const pl = placeActor({ p, ry }, at, yaw0, s), h = new THREE.Group(); h.name = name; h.position.set(pl.x, groundY(), pl.z); h.rotation.y = pl.yaw; root.add(h); return { h, pl } }

  // Darsteller: 7 Tänzer (falls privat vorhanden) + MC
  const isMC = (sl) => sl.slot === 'mc' || sl.actor === 'fb_game' || sl.cast === 'fb_game', mcSl = (k12?.slots || []).find(isMC)
  const slots = [...(k12?.slots || []).filter((sl) => !isMC(sl)), { slot: 'mc', cast: 'fb_game', mc: true, p_u: mcSl?.p_u || [0.95, 0, -4.4], ry_deg: mcSl?.ry_deg ?? 0,
    cues: mcSl?.cues || [{ t: 3.0, clip: 'kfb_dance_hip_hop_a' }, { t: 14.4, clip: 'kfb_dance_wave_hip_hop_a' }, { t: 19.2, clip: 'kfb_dance_chicken_a' }, { t: 29.4, clip: 'kfb_dance_locking_hip_hop_a' }, { t: 30.6, clip: 'kfb_dance_hip_hop_a' }, { t: 33.6, clip: 'kfb_idle_happy_a' }] }]
  const M = slots.map((sl) => {
    const { h, pl } = holderAt(sl.p_u || [0, 0, 0], sl.ry_deg || 0, 'disco:' + sl.slot)
    const cues = [...(sl.cues || [])].map((c, i) => ({ ...c, _i: i })).sort((a, b) => a.t - b.t || a._i - b._i)
    return { sl, h, pl, cues, actor: null, fig: null, mixer: null, clips: {}, act: null, clip: null, base: 0, scale: 1, lift: 0, status: 'LOADING', eyes: null, proof: false }
  })

  async function loadMember(m) {
    const opts = m.sl.mc ? options.mc() : options.cast(m.sl)
    if (!opts) { m.status = 'MISSING'; return }
    m.proof = !!opts.proof; m.eyes = opts.eyeSource || (m.sl.mc ? 'FrizzleBob (Georgs Export, P08)' : null)
    const actor = options.createActor({ ...opts, worldScale: K }); m.actor = actor; m.h.add(actor.object3d)
    await actor.ready
    let fig = null
    if (m.sl.mc) actor.object3d.traverse((o) => { if (!fig && /^figure · /.test(o.name)) fig = o })
    else fig = actor.object3d.children.find((c) => c.name !== 'bubbleAnchor' && (c.isGroup || c.type === 'Group' || c.type === 'Object3D')) || null
    if (!fig) throw new Error('FIGURE_MISSING ' + m.sl.slot)
    m.fig = fig; m.base = fig.position.y; m.scale = fig.scale.y
    const src = await loader.loadAsync(m.sl.mc ? options.motionLibraryUrl : m.sl.url) // Tänzer: Clips in der eigenen Datei; MC: Motion Library Rig_Medium
    for (const c of src.animations) m.clips[c.name] = c
    src.scene.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); [].concat(o.material).forEach((x) => x?.dispose()) } })
    m.mixer = new THREE.AnimationMixer(fig); m.status = 'OK'
    if (m.sl.mc) measureLift(m) // FB hat keine WSB-Tabelle (K12 §4: „hängt an der Spielfigur“) → selbe Regel wie WSB, beim Laden gemessen
  }
  // floorLift nach der WSB-Regel (K12 §3): je Bild (48 fps) der tiefste Punkt der gehäuteten Figur; Hebung = max(0, −zmin) + 0,005 u, nur wenn sie einsinkt.
  // In Scheiben zu ≤ 4 ms (kein Ruck); bis fertig gilt Hebung 0. Nur die Clips der Zeitleiste.
  async function measureLift(m) {
    const fps = 48, out = {}, body = []; m.fig.traverse((o) => { if (o.isSkinnedMesh && o.visible && !o.userData.petOverlay) body.push(o) })
    const mx = new THREE.AnimationMixer(m.fig), names = [...new Set(m.cues.map((c) => c.clip))].filter((n) => m.clips[n]), hw = new THREE.Vector3(), box = new THREE.Box3()
    const minRel = () => { m.fig.updateMatrixWorld(true); m.h.getWorldPosition(hw); let lo = Infinity; for (const o of body) { o.computeBoundingBox(); box.copy(o.boundingBox).applyMatrix4(o.matrixWorld); lo = Math.min(lo, box.min.y) } return lo - hw.y }
    const y0 = m.fig.position.y; m.fig.position.y = m.base
    for (const n of names) {
      const clip = m.clips[n], a = mx.clipAction(clip); a.play(); const N = Math.max(1, Math.ceil(clip.duration * fps)), vals = new Array(N)
      let t0 = performance.now()
      for (let i = 0; i < N; i++) {
        if (m.mixer) m.mixer.stopAllAction() // Disco-Mixer ruht während der Messung (eigener Mixer auf derselben Figur)
        a.time = i / fps; mx.update(0); const z = minRel() / m.scale; vals[i] = z < 0 ? +(-z + 0.005).toFixed(4) : 0
        if (performance.now() - t0 > 4) { await new Promise((r) => setTimeout(r, 0)); t0 = performance.now(); m.fig.position.y = m.base }
      }
      a.stop(); out[n] = { fps, values: vals, maxLift: Math.max(...vals), measured: 'Laufzeit (WSB-Regel K12 §3)' }
    }
    mx.stopAllAction(); mx.uncacheRoot(m.fig); m.fig.position.y = y0; m.act = null; m.clip = null; m.liftTable = out
  }
  async function loadProps() {
    const tpl = {}
    await Promise.all(Object.entries(DISCO_PROP_FILES).map(async ([k, p]) => { try { tpl[k] = (await loader.loadAsync(options.propsBase + p.split('/').map(encodeURIComponent).join('/'))).scene } catch (e) { S.propErr = String(e?.message || e) } }))
    for (const d of DISCO_PROPS) {
      const T = tpl[d.key]; if (!T) continue
      const o = T.clone(true), b = new THREE.Box3().setFromObject(T), sz = b.getSize(new THREE.Vector3()), kk = (d.h ? d.h / Math.max(sz.y, 1e-3) : d.w / Math.max(sz.x, sz.z, 1e-3)) * s
      const { h } = holderAt([d.p[0], 0, d.p[2]], d.ry, 'disco-prop:' + d.key); o.scale.multiplyScalar(kk); o.position.y = d.p[1] * s - b.min.y * kk
      o.traverse((x) => { if (x.isMesh) { x.castShadow = x.receiveShadow = true } }); h.add(o)
    }
    // Spiegelkugel über dem Tanzkreis (wie die Probe: 7,6 u hoch, flach facettiert, dreht langsam)
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3 * s, 1), new THREE.MeshStandardMaterial({ color: '#d9dde8', metalness: 0.35, roughness: 0.3, flatShading: true, emissive: '#5a6070' }))
    const { h } = holderAt([DISCO.ballU[0], 0, DISCO.ballU[2]], 0, 'disco-ball'); ball.position.y = DISCO.ballU[1] * s; h.add(ball); S.ball = ball
    S.beams = DISCO.pal.map((c) => { const b = GFX.makeBeam({ color: c, opacity: DISCO.beamOpacity, angle: DISCO.beamAngle }); b.visible = false; root.add(b); return b })
  }
  const ready = (async () => {
    await Promise.all([loadProps(), ...M.map((m) => loadMember(m).catch((e) => { m.status = 'ERROR'; m.error = String(e?.message || e); S.error = S.error || m.error }))])
    const dancers = M.filter((m) => !m.sl.mc), okD = dancers.filter((m) => m.status === 'OK').length
    S.status = !k12 ? 'PLACEHOLDER' : okD === dancers.length && M.find((m) => m.sl.mc)?.status === 'OK' ? 'OK' : okD ? 'PARTIAL' : 'ERROR'
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })

  // Disco-Licht: 8 Kegel von der Kugel bis zum Boden (sichtbarer Strahl) + 8 Pfützen auf dem Tanzkreis, je Bild über den Kanal 'disco' (Vorrang unter den Scheinwerfern)
  const CH = gfxChannel('disco'), _o = new THREE.Vector3(), _d = new THREE.Vector3(), _bw = new THREE.Vector3()
  function lights(t) {
    if (!S.ball || !S.beams) return
    if (!S.near) { if (S.lightsOn) { CH.set([]); S.beams.forEach((b) => { b.visible = false }); S.lightsOn = false } return }
    S.ball.getWorldPosition(_bw); const floorY = groundY(), list = []
    for (let i = 0; i < 8; i++) {
      const a = t * 0.5 + (i * Math.PI) / 4, tilt = 0.36 + 0.28 * Math.sin(t * 0.7 + i * 1.3)
      _d.set(Math.cos(a) * Math.sin(tilt), -Math.cos(tilt), Math.sin(a) * Math.sin(tilt)).normalize(); _o.copy(_bw).addScaledVector(_d, 1.2 * s)
      const len = Math.max(0.5, (_o.y - floorY) / Math.max(0.05, -_d.y)) + 0.6 * s, b = S.beams[i]
      GFX.aimBeam(b, _o, _d, len); b.material.uniforms.uFade.value = Math.max(0.6, 1 - (2.2 * s) / len); b.visible = true
      list.push({ form: 'cone', origin: _o.clone(), dir: _d.clone(), angle: DISCO.beamAngle, soft: 0.85, /* Kritiker MVP R1 C8: Flecken wirkten wie aufgemalte Ellipsen – weicher Rand, Licht statt Scheibe */ color: DISCO.pal[i], intensity: DISCO.poolIntensity, range: DISCO.rangeU * s })
    }
    CH.set(list); S.lightsOn = true
  }

  function drive(m, dt) {
    // WS-NPC chat=syl (Lead 24.10., additiv): der MC bleibt ruhig, bis er ruft (Georg: Hochspringen beim Bemerken wirkt ohne Kontext irritierend); dann tanzt er
    const quiet = m.sl.mc && options.mcWaitsForCall && !S.mcCalled
    const hit = S.hold || quiet ? { cue: { clip: m.clips.Idle_A ? 'Idle_A' : 'kfb_idle_happy_a' }, local: 0.4 } : discoCueAt(m.cues, S.songT, len)   /* hold: Prüfhilfe (Augen-Bogen), alle in Ruhe */
    let name = hit?.cue?.clip || null, bounce = false
    if (name === 'bounce' || hit?.cue?.runtime) { bounce = true; name = m.clips.Idle_A ? 'Idle_A' : Object.keys(m.clips)[0] }
    const clip = name && m.clips[name]
    if (clip && name !== m.clip) { const a = m.mixer.clipAction(clip); a.reset().setLoop(THREE.LoopRepeat, Infinity).play(); if (m.act) m.act.crossFadeTo(a, DISCO.fade, false); m.act = a; m.clip = name }
    let ct = 0
    if (m.act && clip) { ct = ((hit.local % clip.duration) + clip.duration) % clip.duration; m.act.time = Math.max(0, ct - dt); m.mixer.update(dt) }
    m.ct = ct
    const fl = m.sl.floorLift?.[m.clip] || m.sl.cardData?.clips?.floorLift?.[m.clip] || m.liftTable?.[m.clip]
    m.lift = bounce ? 0 : floorLiftAt(fl, ct)
    const hop = bounce ? DISCO.bounceU * Math.abs(Math.sin(Math.PI * S.beat)) : 0
    m.fig.position.y = m.base + (m.lift + hop) * m.scale
  }

  return {
    object3d: root, ready,
    update(dt, hctx) {
      discoLog.update++
      const tm0 = typeof performance !== 'undefined' ? performance.now() : 0
      const t = options.clock ? options.clock() : (S.t += dt); S.t = t
      S.songT = ((t % len) + len) % len; S.beat = (S.songT * bpm) / 60
      const pl = options.player?.() || null, cam = hctx?.camera || null
      if (cam) { cam.updateMatrixWorld(); _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); frustum.setFromProjectionMatrix(_pv) }
      const d = pl ? Math.hypot(pl.x - at[0], pl.z - at[1]) : Infinity
      _sphere.center.set(at[0], groundY() + 2 * s, at[1])
      S.near = d < DISCO.bubbleR || (!!cam && d < DISCO.visibleFar && frustum.intersectsSphere(_sphere)) || !pl
      if (pl && d < DISCO.bubbleR) { const live = M.filter((m) => !m.sl.mc), k = songBoundary(S.prevT, t, len) // nur hörbar nah; Tänzer sprechen, der MC bemerkt
        if (k != null && live.length) { S.songs++; CHL.emit(pickSpeakers(live, S.songs).map((m) => ({ ...who(m), mood: CHATTER.mood.pause, cause: 'pause' })), t) }
        const nr = NOTICE.step(d, t), mc = M.find((m) => m.sl.mc); if (nr && mc) CHL.emit([{ ...who(mc), mood: CHATTER.mood.notice, cause: 'notice', reason: nr }], t, { force: true })
      } else NOTICE.step(pl ? d : null, t)
      if (options.mcWaitsForCall && (!pl || d >= DISCO.bubbleR) && t >= NOTICE.state().until) S.mcCalled = false   // außer Hörweite und Bemerken wieder möglich: beim nächsten Kommen erst rufen
      S.prevT = t
      /* MVP-Leistung (Lead 22.10.): Tänzer sind Skin-Meshes ohne Frustum-Culling (83 Zeichenaufrufe, ≈ 170 k Dreiecke plus Schattenbild) –
         sichtbar nur im Bild (bis visibleFar) oder ganz nah (Schatten ins Bild), sonst ausgeblendet; die Uhr läuft weiter (Weltzeit) */
      const show = !pl || d < 12 * s || (!!cam && d < DISCO.visibleFar && frustum.intersectsSphere(_sphere))
      for (const m of M) if (m.h && m.h.visible !== show) m.h.visible = show
      if (S.ball) S.ball.rotation.y += dt * 0.35
      lights(t)
      if (!S.near) return
      for (const m of M) { if (m.status !== 'OK') continue; m.h.position.y = options.groundAt(m.pl.x, m.pl.z); drive(m, dt); m.actor.update?.(dt, hctx) }
      if (tm0) { const ms = performance.now() - tm0; S.ms = S.ms == null ? ms : S.ms * 0.95 + ms * 0.05 }
    },
    status: () => ({ status: S.status, mode: S.mode, error: S.error, propErr: S.propErr || null, ms: S.ms, members: M.map((m) => ({ slot: m.sl.slot, status: m.status, error: m.error || null, eyes: m.eyes, proof: m.proof })) }),
    debug: () => ({ near: S.near, lights: S.lightsOn ? CH.list.length : 0, gfx: GFX.stats().owners, songT: +S.songT.toFixed(3), beat: +S.beat.toFixed(3), at: at.slice(), yawDeg: +((yaw0 * 180) / Math.PI).toFixed(1), siteDev: site.dev,
      liftMeasured: M.filter((m) => m.liftTable).map((m) => ({ slot: m.sl.slot, clips: Object.fromEntries(Object.entries(m.liftTable).map(([k, v]) => [k, v.maxLift])) })),
      members: M.map((m) => ({ slot: m.sl.slot, x: +m.pl.x.toFixed(2), z: +m.pl.z.toFixed(2), clip: m.clip, t: m.ct ?? null, lift: +(m.lift || 0).toFixed(4), clips: Object.keys(m.clips).length })) }),
    actors: () => M.map((m) => ({ slot: m.sl.slot, actor: m.actor, figure: m.fig })),
    events: () => CHL.events(), // WS-Audio: { type: 'chatter', group: 'disco_k12', mood, cause, id, characterId, at, t, seq }
    anchors: () => M.filter((m) => m.status === 'OK' && m.h).map((m) => ({ id: 'disco-' + m.sl.slot, object3d: m.h })), // chat=syl: Blasen-Anker (talkDirector misst die Kopfhöhe)
    mcCall: () => { S.mcCalled = true }, // chat=syl: der MC hat gerufen → er tanzt
    hold: (on) => { S.hold = !!on },
    // Prüfhilfe (Test C): tiefster Punkt der gehäuteten Figur über dem Boden je Platz (nur sichtbare Netze, ohne Augen-Rig)
    feet: () => M.filter((m) => m.fig).map((m) => { let lo = Infinity; m.fig.updateMatrixWorld(true)
      m.fig.traverse((o) => { if (!o.isSkinnedMesh || !o.visible || o.userData.petOverlay) return; o.computeBoundingBox(); const bb = o.boundingBox.clone().applyMatrix4(o.matrixWorld); lo = Math.min(lo, bb.min.y) })
      const w = new THREE.Vector3(); m.fig.getWorldPosition(w); return { slot: m.sl.slot, clip: m.clip, minY: lo === Infinity ? null : +(lo - options.groundAt(w.x, w.z)).toFixed(4) } }),
    dispose() {
      discoLog.dispose++
      for (const m of M) { m.mixer?.stopAllAction(); m.actor?.dispose?.() }
      root.traverse((o) => { if (o.isMesh && o.parent?.name?.startsWith('disco-')) { o.geometry?.dispose() } })
      CH.set([]); S.beams?.forEach((b) => b.material.dispose())
      S.ball?.geometry.dispose(); S.ball?.material.dispose(); root.clear()
    },
  }
}
