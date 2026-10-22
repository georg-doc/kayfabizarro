// Kampf R1 (Georg 22.10., V-618 MVP-Kampf) · FrizzleBob kämpft mit den echten K10-Waffen (WSB-Waffenkarten src/data/combat/k10): Pistole (KayKit
// Prototype Bits, kfb_kit_gun_pistol_prototype) und HeroMan-Blaster (kfb_kit_heroman_blaster). Modul nach Host-Vertrag R1.2 für den Spieler.
// Regeln aus dem K10-Handover (combat-av/arena f712f0d _handover/K10_RUNTIME_2026-10-21): der Controller besitzt Wurzel und Blickrichtung (Wirt dreht über
// options.face), EIN Mixer (der Gang-Mischer der Figur, Einmal-Clip über player.playAction), feste Halterung je Waffe (mount.slotOffset exakt, keine eigene
// Drehung, kein Nachführen je Bild), Marker-Uhr = Clip-Zeit ab 0, ein Abgang je Aktion (release.oncePerAction), Geschoss entlang der Mündung (+Z von
// KFB_Muzzle, readMuzzlePose), kein Zielrichtungs-Bypass. Hit-Stop (V-567): EINE createHitStop-Instanz, nur Beteiligte; der Spieler bekommt
// frame.for('player') als Animationszeit, Welt, Kamera, Geschosse und NPC-Fahrplan laufen weiter.
// Ziele: nur die vorhandenen aus dem Obstgarten (orchard.aimTarget / sweep / hitTarget / shotTree: WS-NPC-Gruppen, Dark Fluffer, Bäume) – kein zweites
// Zielsystem. Kein Schaden am Spieler, kein HP (Georg 22.10.): Treffer laufen über onHit der Ziele (Warnung → Aggro → K.o. mit Fluff; Fluffer heilt).
// Wirkung: Mündungsblitz (muzzle-fx, KayKit Mystery S4 Muzzleflash/_Long privat, sha256 aus der Karte), Geschoss aus einem Pool mit Band (knet-fx
// createTrails), Knet-Treffer am Auftreffpunkt (knet-fx hit), „PLOPP!“ am Ort eines K.o. (groups.events type 'ko' → knet-fx pop).
// K10-Ereignisse als Ringpuffer events() (Schema wie audio/cueMap k10Plan: fire | contact | kill, weapon, side, target, energy, material, confirmed,
// position, id) – der Ton liest sie (AudioHost → kfbAudio.k10).
// Private Dateien: über src/private (gitignored, Verweis auf ~/kfb-ws1/private-assets) beim Bauen eingebunden; fehlen sie, meldet status() „keine Waffen“
// (NO_WEAPONS) ohne Fehler, der alte Schuss des Obstgartens bleibt.
// options: { player(): Loco-Modul (figureBones, playAction, actionTime, setAnimTimeScale, hasClip), orchard(), groups()?, groundAt(x, z), face(yaw)?,
//            worldScale? }
// api: object3d, ready, update(dt, ctx), dispose(), status(), events(), equip(id|null), fire(aim), active(), weapons(), debug(), holdFlash(s), thumbnail(id, renderer)
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { auditWeaponProfile } from '../vendor/combat/weapon-profile.v1.mjs'
import { create as createMuzzleFx, readMuzzlePose } from '../vendor/combat/muzzle-fx.v1.mjs'
import { createHitStop } from '../vendor/combat/hit-stop.v1.mjs'
import { createKnetFx, createTrails } from '../vendor/combat/knet-fx.v1.mjs'
import PISTOL from '../data/combat/k10/kfb_kit_gun_pistol_prototype.weapon.json'
import BLASTER from '../data/combat/k10/kfb_kit_heroman_blaster.weapon.json'

// Waffen-GLBs (Pfade der Karten relativ zu 50_BLENDER, wie combat-arena-v5/kit-ranged/private-sources.json) und Original-Mündungsblitze (gltf + bin + Textur)
const GLB = import.meta.glob('../private/50_BLENDER/K10/{out,_privat_kauf_asset}/*.k10.glb', { query: '?url', import: 'default', eager: true })
const FLASH = import.meta.glob('../private/kaykit/Mystery_S4_Action_Figure/gltf/*.{gltf,bin,png}', { query: '?url', import: 'default', eager: true })
const flashUrl = (name) => Object.entries(FLASH).find(([k]) => k.endsWith('/' + name))?.[1] || null
const glbUrl = (card) => GLB['../private/' + String(card.source?.path || '').replace(/^dropbox:KFB_HUB\//, '')] || null

// Waffen im Spiel: Karte + Spielwerte (Name, HUD-Familie, Ton-Waffe, Knet-Ton). Blitz: Pistole kurz (primary), Blaster lang (secondary) – beide aus der Karte.
export const K10_WEAPONS = Object.freeze([
  Object.freeze({ id: 'pistol', card: PISTOL, name: 'Pistole', hud: 'blaster', audio: 'pistol', energy: 'kinetic', flash: 'primary', color: '#f4d35e', note: 'K10-Kitwaffe (Prototype Bits) · Einzelschuss.' }),
  Object.freeze({ id: 'blaster', card: BLASTER, name: 'HeroMan-Blaster', hud: 'blaster', audio: 'blaster', energy: 'electric', flash: 'secondary', color: '#9fe3ff', note: 'K10-Kitwaffe (Ultra Turbo Hero Man) · Einzelschuss.' }),
])
// range/cone = Schuss des Obstgartens (ORCHARD.shotRange 26 m, Kegel 0,75); speed wie dessen Projektil (34 m/s, Ton-Laufzeit in kfbAudio). Größen in Welt-Metern (J17):
// Geschoss 4 cm Radius × 2,4 lang, Knet-Treffer 0,16 m, Puff 0,2 m mit Wort 1,2 m über dem Boden (Skelett ≈ 1,2 m hoch)
export const COMBAT = Object.freeze({ range: 26, cone: 0.75, speed: 34, projR: 0.04, projLen: 2.4, cap: 12, fade: 0.08, hitStrength: 0.7, knetSize: 0.16, popSize: 0.2, popTop: 1.1, popY: 0.1, maxEvents: 64 })
export const combatLog = { create: 0, update: 0, dispose: 0 }

const sha256 = async (buf) => (globalThis.crypto?.subtle ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buf)), (n) => n.toString(16).padStart(2, '0')).join('') : null)

export function createCombatPlayer(options = {}) {
  combatLog.create++
  const root = new THREE.Group(); root.name = 'combat-player'
  const S = { status: 'LOADING', error: null, flash: 'LOADING', cur: null, want: null, slot: null, slotOf: null, shot: null, shots: 0, releases: 0, contacts: 0, kills: 0, seq: 0,
    events: [], koSeen: new Set(), koInit: false, koAt: 0, t: 0, ms: null, frozenMs: 0, holdFlash: 0, lastRelease: null, lastContact: null, hidden: [] }
  const W = new Map(K10_WEAPONS.map((w) => [w.id, { ...w, status: 'LOADING', sha: null, audit: null, mount: null, muzzle: null, fx: null, url: glbUrl(w.card) }]))
  const hs = createHitStop() // V-567: genau eine Instanz im Kampfmodul
  const knet = createKnetFx(THREE, root, { cap: 24 }), trails = createTrails(THREE, root, { cap: COMBAT.cap })
  const stats = { knetHits: 0, pops: 0, hitStops: 0 }

  // Geschoss-Pool: längliche Knet-Kugel in der Farbe der Waffe (unbeleuchtet: Leuchten nur am Effekt selbst, V-499)
  const projGeo = new THREE.IcosahedronGeometry(1, 1), projMats = new Map(K10_WEAPONS.map((w) => [w.id, new THREE.MeshBasicMaterial({ color: w.color, toneMapped: false })]))
  const pool = Array.from({ length: COMBAT.cap }, (_, i) => { const m = new THREE.Mesh(projGeo, projMats.get('pistol')); m.visible = false; m.frustumCulled = false; m.name = 'k10-projectile'; root.add(m)
    return { m, live: false, id: 'p' + i, pos: new THREE.Vector3(), dir: new THREE.Vector3(), travel: 0, w: null, shot: 0, start: new THREE.Vector3() } })
  const trailItems = []
  const _p = new THREE.Vector3(), _d = new THREE.Vector3(), _a = [0, 0, 0], _b = [0, 0, 0], _v = new THREE.Vector3(), _z = new THREE.Vector3(0, 0, 1)

  const emit = (type, o = {}) => { const e = { seq: ++S.seq, type, side: 'player', explosive: false, t: +S.t.toFixed(3), ...o }; S.events.push(e); if (S.events.length > COMBAT.maxEvents) S.events.shift(); return e }
  const xyz = (v) => ({ x: +v.x.toFixed(4), y: +v.y.toFixed(4), z: +v.z.toFixed(4) })

  // Laden: Karten zulassen (auditWeaponProfile), Bytes gegen die sha256 der Karte prüfen, Original unverändert parsen, Halterung + Blitz bauen
  const ready = (async () => {
    const loader = new GLTFLoader()
    if (![...W.values()].some((w) => w.url)) { S.status = 'NO_WEAPONS'; S.flash = 'MISSING'; for (const w of W.values()) w.status = 'MISSING'; return }
    const assets = S.assets = {}
    try {
      for (const slot of ['primary', 'secondary']) {
        const ref = PISTOL.muzzle[slot], name = ref.ref.split('/').pop(), url = flashUrl(name), bin = flashUrl(name.replace('.gltf', '.bin')), tex = flashUrl('actionfigure_texture.png')
        if (!url || !bin) throw new Error('MUZZLE_SOURCE_MISSING:' + name)
        const buf = await (await fetch(url)).arrayBuffer(), h = await sha256(buf); if (h && h !== ref.sha256) throw new Error('MUZZLE_SHA_MISMATCH:' + name)
        const man = new THREE.LoadingManager(); man.setURLModifier((u) => (u.endsWith('.bin') ? bin : u.endsWith('.png') ? tex || u : u))
        assets[ref.ref] = await new Promise((res, rej) => new GLTFLoader(man).parse(new TextDecoder().decode(buf), '', (g) => res(g.scene), rej))
      }
      S.flash = 'OK'
    } catch (e) { S.flash = 'ERROR: ' + String(e?.message || e) }
    for (const w of W.values()) {
      try {
        if (!w.url) { w.status = 'MISSING'; continue }
        w.audit = auditWeaponProfile(w.card); if (w.audit.status !== 'CONTRACT_PASS') throw new Error('PROFILE ' + w.audit.issues.join(','))
        const buf = await (await fetch(w.url)).arrayBuffer(); w.sha = await sha256(buf)
        if (w.sha && w.sha !== w.card.source.sha256) throw new Error('SOURCE_SHA_MISMATCH')
        const g = await loader.parseAsync(buf, ''), o = g.scene; o.name = 'k10-weapon:' + w.card.id
        o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } })
        w.muzzle = o.getObjectByName(w.card.muzzle.node); if (!w.muzzle) throw new Error('KFB_MUZZLE_MISSING')
        // V-574/V-581: EINE feste Halterung am Kit-Slot (Drehung und, falls die Karte es nennt, Versatz exakt aus mount.slotOffset); update() ändert sie nie
        const mount = new THREE.Group(); mount.name = 'KFB_fixed_kit_mount:' + w.id; const so = w.card.mount.slotOffset || {}
        if (so.rotation) mount.quaternion.fromArray(so.rotation).normalize(); if (so.position) mount.position.fromArray(so.position); mount.add(o); w.mount = mount; w.root = o
        if (S.flash === 'OK') w.fx = createMuzzleFx({ anchor: w.muzzle, assets, muzzle: w.card.muzzle })
        w.status = 'OK'
      } catch (e) { w.status = 'ERROR'; w.error = String(e?.message || e) }
    }
    const ok = [...W.values()].filter((w) => w.status === 'OK').length
    S.status = ok ? 'OK' : [...W.values()].every((w) => w.status === 'MISSING') ? 'NO_WEAPONS' : 'ERROR'
    S.error = [...W.values()].filter((w) => w.error).map((w) => w.id + ': ' + w.error).join('; ') || null
  })().catch((e) => { S.status = 'ERROR'; S.error = String(e?.message || e) })

  const player = () => options.player?.() || null
  const handSlot = () => { const pl = player(); if (!pl?.figureBones || pl.status?.().status !== 'OK') return null
    if (S.slotOf !== pl) { S.slot = pl.figureBones([PISTOL.mount.slot])[PISTOL.mount.slot] || null; S.slotOf = pl } return S.slot }
  // Heil-Pistole des Dark Fluffers (heal-weapon:*) am selben Slot: mit aktiver K10-Waffe ausgeblendet (nie zwei Waffen in der Hand), danach wieder sichtbar
  const syncHand = (slot) => { const on = !!S.cur
    for (const c of slot.children) if (/^heal-weapon:/.test(c.name || '')) { if (on && c.visible) { c.visible = false; S.hidden.push(c) } }
    if (!on && S.hidden.length) { for (const c of S.hidden) c.visible = true; S.hidden = [] } }
  function mountWant(slot) {
    const w = S.want ? W.get(S.want) : null
    if (S.cur && S.cur !== w) { S.cur.mount.removeFromParent(); S.cur = null }
    if (w && w.status === 'OK' && S.cur !== w) { slot.add(w.mount); S.cur = w }
  }

  const clipOf = (w) => w.card.release.clip, markerOf = (w) => w.card.release.seconds
  function release(w) {
    readMuzzlePose(w.muzzle, _p, _d); _d.normalize()
    const p = pool.find((x) => !x.live) || pool.reduce((m, x) => (x.travel > m.travel ? x : m)); p.live = true; p.w = w; p.shot = S.shot.id; p.travel = 0
    p.pos.copy(_p); p.start.copy(_p); p.dir.copy(_d); p.m.material = projMats.get(w.id); p.m.visible = true
    p.m.scale.set(COMBAT.projR, COMBAT.projR, COMBAT.projR * COMBAT.projLen); p.m.position.copy(_p); p.m.quaternion.setFromUnitVectors(_z, _d)
    w.fx?.fire({ slot: w.flash })
    S.releases++; S.shot.released = true
    S.lastRelease = { shot: S.shot.id, weapon: w.id, clipTime: +S.shot.clock.toFixed(4), muzzle: _p.toArray().map((n) => +n.toFixed(4)), dir: _d.toArray().map((n) => +n.toFixed(4)), proj: p.pos.toArray().map((n) => +n.toFixed(4)),
      flashOn: w.fx ? w.muzzle.children.filter((c) => c.visible).length : 0, target: S.shot.target }
    emit('fire', { weapon: w.audio, energy: 0.7, position: xyz(_p), id: 'k10:' + S.shot.id })
  }
  function contact(p, hit) {
    const w = p.w, at = _v.fromArray(hit.at), O = options.orchard?.(); p.live = false; p.m.visible = false
    knet.hit(at, { energy: w.energy, size: COMBAT.knetSize }); stats.knetHits++
    if (hit.kind === 'target') {
      O?.hitTarget?.(hit.id)
      const r = hs.trigger({ eventId: 'k10:' + p.shot + ':' + hit.id, participants: ['player', String(hit.id)], hitStop: { strength: COMBAT.hitStrength } }); if (r.accepted) stats.hitStops++
      S.lastContact = { kind: 'target', id: hit.id, at: hit.at.map((n) => +n.toFixed(3)), hitStop: r }
      emit('contact', { weapon: w.audio, target: String(hit.id), confirmed: true, energy: 0.7, material: 'clay', position: xyz(at), id: 'k10:' + p.shot + ':c' })
    } else if (hit.kind === 'tree') {
      O?.shotTree?.(hit.zone, hit.id); S.lastContact = { kind: 'tree', zone: hit.zone, id: hit.id, at: hit.at.map((n) => +n.toFixed(3)) }
      emit('contact', { weapon: w.audio, target: 'tree:' + hit.zone + ':' + hit.id, confirmed: false, energy: 0.6, position: xyz(at), id: 'k10:' + p.shot + ':c' })
    } else { S.lastContact = { kind: 'ground', at: hit.at.map((n) => +n.toFixed(3)) }; emit('contact', { weapon: w.audio, target: 'ground', confirmed: false, energy: 0.4, material: 'clay', position: xyz(at), id: 'k10:' + p.shot + ':c' }) }
    S.contacts++
  }
  function stepProjectiles(dt) {
    const O = options.orchard?.(), gh = options.groundAt
    for (const p of pool) { if (!p.live) continue
      const s = COMBAT.speed * dt; p.pos.toArray(_a); _b[0] = _a[0] + p.dir.x * s; _b[1] = _a[1] + p.dir.y * s; _b[2] = _a[2] + p.dir.z * s
      let hit = O?.sweep ? O.sweep(_a, _b, COMBAT.projR) : null
      if (!hit && gh) { const g = gh(_b[0], _b[2]); if (_b[1] < g) hit = { kind: 'ground', at: [_b[0], g, _b[2]] } }
      if (hit) { contact(p, hit); continue }
      p.pos.fromArray(_b); p.travel += s; p.m.position.copy(p.pos)
      if (p.travel >= COMBAT.range) { p.live = false; p.m.visible = false } }
  }
  // K.o. eines Gruppenmitglieds (groups.events type 'ko'): Knet-Puff + „PLOPP!“ am Ort, K10 kill (je Ereignis einmal; beim ersten Lesen nur merken)
  function watchKo() {
    const G = options.groups?.(); if (!G?.events || S.t - S.koAt < 0.1) return; S.koAt = S.t
    for (const e of G.events() || []) { if (e.type !== 'ko') continue; const key = (e.group || '') + '|' + e.id + '|' + e.t; if (S.koSeen.has(key)) continue; S.koSeen.add(key); if (S.koSeen.size > 200) S.koSeen.delete(S.koSeen.values().next().value)
      if (!S.koInit || !Array.isArray(e.at)) continue
      const y = (options.groundAt ? options.groundAt(e.at[0], e.at[1]) : 0) + COMBAT.popY
      knet.pop({ x: e.at[0], y, z: e.at[1] }, { size: COMBAT.popSize, word: 'PLOPP!', top: COMBAT.popTop }); stats.pops++; S.kills++
      emit('kill', { weapon: S.cur?.audio || 'pistol', target: 'group:' + e.id, position: { x: e.at[0], y, z: e.at[1] }, id: 'k10:ko:' + key }) }
    S.koInit = true
  }

  return {
    object3d: root, ready,
    update(dt, ctx) {
      combatLog.update++
      const tm0 = typeof performance !== 'undefined' ? performance.now() : 0
      S.t += dt
      // Hit-Stop: Weltzeit läuft, der Spieler bekommt seinen Anteil als Animationszeit (Faktor am Gang-Mischer, wirkt ab dem nächsten Mischer-Schritt)
      const fr = hs.step(dt), pdt = fr.for('player'), pl = player(); pl?.setAnimTimeScale?.(dt > 0 ? pdt / dt : 1); S.frozenMs += (dt - pdt) * 1000
      const slot = handSlot(); if (slot) { mountWant(slot); syncHand(slot) }
      // Marker-Uhr: Clip-Zeit des Einmal-Clips (ab 0); läuft der Clip nicht (mehr), zählt die Uhr mit der Spielerzeit weiter (ein Abgang je Aktion)
      const sh = S.shot
      if (sh && !sh.released) { const at = pl?.actionTime?.(sh.clip); sh.clock = at != null ? Math.max(sh.clock, at) : sh.clock + pdt
        if (S.cur && sh.weapon === S.cur.id && sh.clock >= sh.marker) release(S.cur); else if (!S.cur || sh.weapon !== S.cur.id) S.shot = null }
      stepProjectiles(dt)
      for (const w of W.values()) if (w.fx) w.fx.update(S.holdFlash > 0 ? 0 : dt)
      S.holdFlash = Math.max(0, S.holdFlash - dt)
      knet.step(dt)
      trailItems.length = 0; for (const p of pool) if (p.live) trailItems.push({ id: p.id + ':' + p.shot, pos: p.pos, energy: p.w.energy })
      const cam = ctx?.camera; if (cam) trails.step(dt, cam, trailItems)
      watchKo()
      if (tm0) { const ms = performance.now() - tm0; S.ms = S.ms == null ? ms : S.ms * 0.95 + ms * 0.05 }
    },
    // Waffe aktiv setzen: 'pistol' | 'blaster' | null (Faust/keine). Wird angehängt, sobald die Figur steht; ein laufender Schuss ohne Abgang verfällt
    equip(id) { if (id != null && !W.has(id)) return false; if (id != null && W.get(id).status !== 'OK' && S.status !== 'LOADING') return false
      S.want = id ?? null; if (S.shot && !S.shot.released && S.shot.weapon !== id) S.shot = null; const slot = handSlot(); if (slot) { mountWant(slot); syncHand(slot) } return true },
    // Schuss mit der aktiven Waffe. aim = { from: [x, y, z], dir: [x, 0, z] } (Blick des Wirts): Zielwahl wie der Obstgarten-Schuss, Figur dreht zum Ziel
    // (bzw. in Blickrichtung), Clip der Karte (release.clip) startet auf dem Mixer der Figur; der Abgang folgt am Marker. Vor dem Abgang keine zweite Aktion,
    // in der Luft (Sprung, Fall, Flug) kein Schuss.
    fire(aim = null) {
      const w = S.cur; if (!w) return { ok: false, reason: 'NO_WEAPON' }
      if (S.shot && !S.shot.released) return { ok: false, reason: 'PENDING' }
      // MVP: nur am Boden – der Schuss-Clip ist ein Ganzkörper-Overlay und würde Sprung-/Flug-Haltung ersetzen (Luftschuss braucht eine eigene Clip-Familie)
      const air = player()?.status?.().air; if (air && air !== 'ground') return { ok: false, reason: 'AIRBORNE' }
      const O = options.orchard?.(); let tgt = null
      if (aim?.from && aim?.dir && O?.aimTarget) tgt = O.aimTarget(aim.from, aim.dir, COMBAT.range, COMBAT.cone)
      if (aim?.from) { const yaw = tgt ? Math.atan2(tgt.pos[0] - aim.from[0], tgt.pos[2] - aim.from[2]) : aim.dir ? Math.atan2(aim.dir[0], aim.dir[2]) : null; if (yaw != null) options.face?.(yaw) }
      const pl = player(), clip = clipOf(w), played = !!pl?.playAction?.(clip, { fade: COMBAT.fade })
      S.shot = { id: ++S.shots, weapon: w.id, clip, marker: markerOf(w), clock: 0, released: false, played, target: tgt ? (tgt.kind === 'target' ? String(tgt.id) : 'tree:' + tgt.zone + ':' + tgt.id) : null }
      return { ok: true, shot: S.shot.id, clip, played, target: S.shot.target }
    },
    active: () => S.cur?.id ?? (S.want && W.get(S.want)?.status === 'OK' ? S.want : null),
    weapons: () => [...W.values()].map((w) => ({ id: w.id, cardId: w.card.id, name: w.name, hud: w.hud, note: w.note, status: w.status, error: w.error || null })),
    events: () => S.events.slice(),
    holdFlash: (s = 0.5) => { S.holdFlash = s }, // Prüfbilder: Blitz für s Sekunden stehen lassen (Weltzeit), danach wie gehabt
    // Bild für den Rucksack (einmal je Waffe): Kopie des Originals in einer eigenen kleinen Szene, Renderer vom Wirt, Rückgabe data:-URL (PNG) oder null
    thumbnail(id, renderer, size = 256) {
      const w = W.get(id); if (!w || w.status !== 'OK' || !renderer?.setRenderTarget || typeof document === 'undefined') return null
      const sc = new THREE.Scene(), o = w.root.clone(true); o.traverse((m) => { if (m.name === w.card.muzzle.node) m.clear() }) // ohne Blitz-Kinder
      o.rotation.set(0, Math.PI / 2, 0); o.updateMatrixWorld(true); sc.add(o) // Lauf (+Z) nach rechts, Seitenansicht
      const box = new THREE.Box3().setFromObject(o), c = box.getCenter(new THREE.Vector3()), r = box.getSize(new THREE.Vector3()).length() / 2 || 1
      sc.add(new THREE.HemisphereLight(0xfff4e0, 0x6a5440, 2.2)); const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(0.4, 1, 0.8); sc.add(sun)
      const cam = new THREE.PerspectiveCamera(30, 1, r * 0.1, r * 10); cam.position.copy(c).add(new THREE.Vector3(0, r * 0.35, r * 3.6)); cam.lookAt(c)
      const rt = new THREE.WebGLRenderTarget(size, size, { colorSpace: THREE.SRGBColorSpace, samples: 4 }), b = new Uint8Array(size * size * 4), prev = renderer.getRenderTarget(), cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha()
      renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(sc, cam); renderer.readRenderTargetPixels(rt, 0, 0, size, size, b); renderer.setRenderTarget(prev); renderer.setClearColor(cc, ca); rt.dispose()
      const cv = document.createElement('canvas'); cv.width = cv.height = size; const g = cv.getContext('2d'), im = g.createImageData(size, size)
      for (let y = 0; y < size; y++) im.data.set(b.subarray((size - 1 - y) * size * 4, (size - y) * size * 4), y * size * 4); g.putImageData(im, 0, 0)
      return cv.toDataURL('image/png') },
    status: () => ({ status: S.status, label: S.status === 'NO_WEAPONS' ? 'keine Waffen' : null, error: S.error, flash: S.flash, active: S.cur?.id ?? null, want: S.want, shots: S.shots, releases: S.releases,
      contacts: S.contacts, kills: S.kills, ms: S.ms, frozenMs: +S.frozenMs.toFixed(2), hitStop: hs.report(), ...stats, live: pool.filter((p) => p.live).length,
      weapons: [...W.values()].map((w) => ({ id: w.id, status: w.status, sha: w.sha, audit: w.audit?.status ?? null, error: w.error || null })) }),
    debug() {
      const w = S.cur, slot = S.slot, out = { lastRelease: S.lastRelease, lastContact: S.lastContact, shot: S.shot ? { ...S.shot } : null, projectiles: pool.filter((p) => p.live).map((p) => ({ id: p.id, pos: p.pos.toArray(), dir: p.dir.toArray(), travel: p.travel })) }
      if (w && slot) { const hand = slot.parent, q = new THREE.Vector3(), r = new THREE.Vector3(), m = new THREE.Vector3()
        slot.getWorldPosition(q); w.root.getWorldPosition(r); readMuzzlePose(w.muzzle, m, _d)
        out.mount = { slotParent: hand?.name ?? null, slotToWeapon: +q.distanceTo(r).toFixed(4), handToWeapon: hand ? +hand.getWorldPosition(_v).distanceTo(r).toFixed(4) : null, weaponWorld: r.toArray(), muzzle: m.toArray(), muzzleDir: _d.toArray(),
          mountQuat: w.mount.quaternion.toArray().map((n) => +n.toFixed(6)), mountPos: w.mount.position.toArray(), flashVisible: w.muzzle.children.filter((c) => c.visible).length } }
      return out
    },
    dispose() { combatLog.dispose++
      for (const c of S.hidden) c.visible = true; S.hidden = []
      for (const w of W.values()) { w.fx?.dispose(); w.mount?.removeFromParent(); w.root?.traverse((m) => { if (m.isMesh) { m.geometry?.dispose(); [].concat(m.material).forEach((mt) => mt?.dispose()) } }) }
      for (const a of Object.values(S.assets || {})) a.traverse((m) => { if (m.isMesh) { m.geometry?.dispose(); [].concat(m.material).forEach((mt) => { mt?.map?.dispose(); mt?.dispose() }) } })
      player()?.setAnimTimeScale?.(1); knet.dispose(); trails.dispose(); projGeo.dispose(); for (const m of projMats.values()) m.dispose(); root.clear() },
  }
}
