// Knet-HUD R1 · Wirt im Spiel (V-656, Schalter hud=clay; Standard bleibt das Holz-HUD R5f, bis Georg im Spiel abnimmt). Gleiche api wie HudR5f, damit
// M1World nur den Wirt tauscht. Das Holz-HUD läuft unsichtbar mit (hide): es hält Zähler, Rucksack-Ansicht mit 20 Fächern, Waffen und Wegwerfen –
// kein zweites Inventar. Sichtbar ist das Knet-Modul (src/hud/clayHud.js) im Overlay-Pass; hier nur, was DOM sein muss:
//   · Trefferflächen über den Props (Buttons mit aria-label, Tab-Fokus; die Feder-Bewegung der Props verschiebt sie nicht)
//   · Settings-Tafel am Zahnrad: Entwickler-Infos (V-655, setzt DEVUI zur Laufzeit), Ton, Musik, Bewegung reduzieren, HUD Knete/Holz (Abnahme)
//   · kurze Waffen-Anzeige über der Truhe beim Wechsel (Lead 22.10.: Aktionsleiste im Knet-Modus aus, V/B/N bleiben)
// Fehlt src/private (öffentliche Vorschau), zeigt der Wirt das Holz-HUD wie bisher.
// host: { palette: () => Palette, target: () => {x,y,z}|null, terrain: () => Modul|null, path: [[x,z]…], marks: () => [{x,z,color}], cards: () => Promise<canvas[]> }
import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import HudR5f from './HudR5f'
import { createClayHud, hasClayHudAssets } from './hud/clayHud'
import { createHud3d, hasHud3dAssets, INK as INK3, fmtDist, arrowColor } from './hud/hud3d'
import { createMiniMap } from './hud/miniMap' // HUD 3D R1 (hud=3d, Spike-Paket 1): gleiche Hülle, andere Bausteine
import { HUD_PASS } from './hud/hudPass'
import { DEVUI, setDevUi, onDevUi, devUiLocked, expose } from './debug'
import { useHostKeys, ACTION_KEYS, PRIO } from './hostKeys'
import { M2EVENTS } from './m2/M2Car'
import * as A from './audio/kfbAudio'
import { cardImage } from './cardImage'

// Tastenfarben der Kassette (V-707): N33 controlTheme, sobald vorhanden (privates JSON, Schlüssel controlTheme.day/night mit hi/mid/lo/symbol/outline/gloss);
// bis dahin vorläufig: Tag Orange, Nacht Türkis.
const N33 = Object.values(import.meta.glob('./private/50_BLENDER/N33/data/kfb_hud_readability.r1.json', { eager: true, import: 'default' }))[0] || null
const CTL_FALLBACK = { day: { hi: '#ffc07a', mid: '#f08a4b', lo: '#b4582c', symbol: '#fff4dc', outline: '#130e16', gloss: 'rgba(255,248,232,.55)' },
  night: { hi: '#8de6dc', mid: '#2fa8a1', lo: '#1b6a67', symbol: '#fff4dc', outline: '#130e16', gloss: 'rgba(235,255,252,.5)' } }
export const CTL_THEME = { day: { ...CTL_FALLBACK.day, ...(N33?.controlTheme?.day || {}) }, night: { ...CTL_FALLBACK.night, ...(N33?.controlTheme?.night || {}) }, source: N33?.controlTheme ? 'N33 controlTheme' : 'vorläufig' }
const BANGERS_HREF = 'https://fonts.googleapis.com/css2?family=Bangers&display=swap'
const RM_KEY = 'kfb.hud.reducedMotion.v1'
const lsGet = (k) => { try { return localStorage.getItem(k) } catch { return null } }
const lsSet = (k, v) => { try { localStorage.setItem(k, v) } catch { /* privates Fenster */ } }
const reducedMotion = () => lsGet(RM_KEY) === '1' || (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
const FAM_NAME = { fist: 'Faust', blaster: 'Blaster', bomb: 'Bombe' }
const INK = '#1f1a14', PAPER = '#f3ead3'
const DEG = Math.PI / 180
const GOAL = { dbg: undefined } // Debug-Ziel für Abnahmebilder (expose ClayHud.goal): undefined = Wirt-Ziel, null = kein Ziel, { name, pos }

export const clayHudAvailable = hasClayHudAssets
export const hud3dAvailable = hasHud3dAssets
const _f = new THREE.Vector3(), _r = new THREE.Vector3(), _v = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0)

export default function HudClay(props) {
  const { counts = [0, 0, 0, 0, 0, 0], onApi = null, host = {}, kit = 'clay' } = props // kit: 'clay' = Knet-HUD R1, '3d' = HUD 3D R1 (Layout A)
  const K3 = kit === '3d', { camera } = useThree()
  const inner = useRef(null), clay = useRef(null), dom = useRef(null), sig = useRef({ prev: null, v: 0, yaw: null, yawRate: 0, accel: 0, kmh: 0, heading: 0 })
  const [ok, setOk] = useState(K3 ? hasHud3dAssets() : hasClayHudAssets())

  // Knet-Modul + Overlay-Pass + DOM-Ebene
  useEffect(() => {
    if (!ok) return undefined
    if (!document.querySelector('link[data-kfb-bangers]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = BANGERS_HREF; l.dataset.kfbBangers = '1'; document.head.appendChild(l) }
    const S = sig.current
    const hud = K3 ? createHud3d({ reducedMotion, cassette: (/(^|[#,])cas=(old|new)(,|$)/.exec(location.hash) || [])[2] || 'new' }) : /* cas=old = Kassette und Größen vor Georgs 24.10.-Wunsch (A/B) */ createClayHud({
      palette: () => host.palette?.(), speed: () => S.kmh, heading: () => S.heading, mapPos: () => S.prev,
      mapSample: (x, z) => mapColor(host, x, z), mapMarks: () => host.marks?.() || [], path: host.path || [],
      nowPlaying: () => (A.musicPaused?.() ? { title: 'Pause' } : A.nowPlaying()), audioOn: () => !A.volumes().muted, reducedMotion,
    })
    clay.current = hud; HUD_PASS.draw = (gl) => hud.draw(gl);
    document.fonts?.load?.('104px Bangers').then(() => hud.refreshTicker?.(), () => {})
    if (!K3) host.cards?.().then((cv) => { if (cv?.length) hud.setCards(cv) }, () => {})
    // HUD 3D Almanac: Karten vom Haken host.almanac() (Owner vorerst M1-Wirt, später Karten-Journal), Bilder über cardImage, Original nie umgefärbt
    if (K3) { const al = host.almanac?.(); if (al?.cards?.length) Promise.all(al.cards.slice(-7).map((c) => cardImage(c.deckId, c.num, 560).then((r) => r?.canvas?.toDataURL('image/jpeg', 0.9) || null, () => null)))
      .then((srcs) => { const ok = srcs.filter(Boolean); if (ok.length) dom.current?.setFan?.({ srcs: ok, total: al.total ?? al.cards.length, decks: al.decks ?? 1 }) }) }
    const offs = ['landing', 'railImpact', 'takeoff', 'boost'].map((t) => M2EVENTS.on(t, (e) => hud.event(e)))
    dom.current = K3 ? buildDom3d(hud, inner, { host, onInteract: props.onInteract, pos: () => sig.current.prev, heading: () => sig.current.heading }) : buildDom(hud, inner, () => clay.current)
    expose('ClayHud', { kit, speed: () => hud.speedState?.() || null, layout: () => hud.layout?.() || null, cassetteButtons: () => hud.cassetteButtons?.() || {}, cassette: () => hud.cassetteKind?.() || null, mode: () => host.mode?.() || null, fluffTotal: () => host.fluffTotal?.() ?? null, fxState: (k) => hud.fxState?.(k) || null, status: () => hud.status(), rects: () => hud.rects(), radioButtons: () => hud.radioButtons?.() || {}, goal: (g) => { GOAL.dbg = g === undefined ? GOAL.dbg : g; return GOAL.dbg },
      goalRel: (bDeg, pDeg = 0, dist = 300, name = 'Testziel') => { const pp = host.target?.(); if (!pp) return null; camera.getWorldDirection(_f); _f.y = 0; _f.normalize(); _r.crossVectors(_f, _up).normalize()
        const b = bDeg * DEG, p = pDeg * DEG, hz = Math.cos(p) * dist; GOAL.dbg = { name, pos: { x: pp.x + (_f.x * Math.cos(b) + _r.x * Math.sin(b)) * hz, y: (pp.y ?? 0) + Math.sin(p) * dist, z: pp.z + (_f.z * Math.cos(b) + _r.z * Math.sin(b)) * hz } }; return GOAL.dbg }, toggleCompass: (v) => hud.toggleCompass(v), uiState: (k) => hud.uiState(k), setAnimator: (k, fn) => hud.setAnimator(k, fn), kick: (e) => hud.event(e), event: (e) => hud.event(e), dom: () => dom.current, resetStats: () => hud.resetStats(), settings: (v) => dom.current?.settings(v), muted: () => !!A.volumes().muted, musicPaused: () => !!A.musicPaused?.() })
    return () => { offs.forEach((f) => f()); if (HUD_PASS.draw) HUD_PASS.draw = null; dom.current?.remove(); dom.current = null; hud.dispose(); clay.current = null }
  }, [ok])

  // Rückfall: Modul meldet fehlende/kaputte Props → Holz-HUD sichtbar
  useFrame((_, dt) => {
    const hud = clay.current; if (!hud) return
    const ph = hud.phase(); if (ph === 'MISSING' || ph === 'ERROR') { console.warn('[HudClay] Rückfall auf Holz-HUD:', ph, hud.status().error || ''); setOk(false); return }
    // Fahrt-/Laufsignal: Tempo (km/h), Gierrate, Längsbeschleunigung aus der Lage – gefiltert im Modul
    const S = sig.current, p = host.target?.()
    if (p && dt > 0) {
      if (S.prev) { const dx = p.x - S.prev.x, dz = p.z - S.prev.z, v = Math.hypot(dx, dz) / dt
        if (v < 200) { const a = (v - S.v) / dt; S.accel += (a - S.accel) * Math.min(1, dt * 6); S.v += (v - S.v) * Math.min(1, dt * 8) }
        if (Math.hypot(dx, dz) > 0.02 * dt * 60) { const yaw = Math.atan2(dx, dz); if (S.yaw != null) { let d = yaw - S.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); S.yawRate += (d / dt - S.yawRate) * Math.min(1, dt * 6) } S.yaw = yaw; S.heading = yaw } else S.yawRate *= 0.9 }
      S.prev = { x: p.x, z: p.z }; S.kmh = S.v * 3.6
    }
    // HUD 3D: Ziel (M1-Wirt besitzt den Haken host.goal, Debug-Ziel geht vor) → Peilung zur Kamera (rechts positiv, 180 = hinter mir), Neigung, Luftlinie
    if (K3) { const g = GOAL.dbg !== undefined ? GOAL.dbg : host.goal?.(), pp = host.target?.()
      if (g && pp) { camera.getWorldDirection(_f); _f.y = 0; if (_f.lengthSq() < 1e-6) _f.set(0, 0, -1); _f.normalize(); _r.crossVectors(_f, _up).normalize()
        _v.set(g.pos.x - pp.x, (g.pos.y ?? pp.y) - (pp.y ?? 0), g.pos.z - pp.z); const hz = Math.hypot(_v.x, _v.z)
        hud.setTarget({ name: g.name, b: Math.atan2(_v.x * _r.x + _v.z * _r.z, _v.x * _f.x + _v.z * _f.z) / DEG, p: Math.atan2(_v.y, Math.max(hz, 1e-3)) / DEG, d: Math.hypot(hz, _v.y), dv: _v.y }) }
      else hud.setTarget(null) }
    // HUD 3D Tempo-Leiste: nur Fahren/Fliegen; Tempo und Boost vom Fahrzeug (M2STATE.telemetry, nur lesend), zu Fuß im Flug Tempo aus der Lage
    if (K3) { const md = host.mode?.() || 'walk', tel = host.telemetry?.(), fly = md === 'fly' || !!tel?.fly, kmh = tel ? tel.speed * 3.6 : S.kmh
      hud.setSpeed({ visible: md !== 'walk' || fly, kmh, frac: tel?.fly && tel.speed01 != null ? tel.speed01 : kmh / 160, boost: tel ? !!(tel.boosting || tel.freeBoost) : false }) } // Board: 160 km/h = voll
    hud.update(dt, { yawRate: S.yawRate, accel: S.accel })
    dom.current?.sync()
    const I = inner.current; if (I) { const open = I.bagOpen(); if (open !== dom.current?.bagWas) { dom.current.bagWas = open; hud.setChestOpen(open) } }
  })

  // Esc schließt die Settings-Tafel (Tastatur nur über hostKeys)
  useHostKeys((e) => { if (e.code !== ACTION_KEYS.close) return; if (dom.current?.closeFly?.()) { e.preventDefault(); return } if (dom.current?.settingsOpen()) { dom.current.settings(false); e.preventDefault() } }, PRIO.choice + 1)

  const wrap = (a) => {
    inner.current = a
    if (!a) { onApi?.(null); return }
    const fam = { w: a.weapon?.() || 'fist' }
    const flash = (txt) => dom.current?.flash(txt)
    onApi?.({ ...a,
      land: (i, n = 1) => { a.land(i, n); const hud = clay.current; if (hud) { hud.land(i, n); if (K3) hud.setCounts(a.counts()); else hud.setScore(a.counts().reduce((s, x) => s + x, 0)) } },
      setWeapon: (w) => { a.setWeapon(w); if (K3) clay.current?.setWeapon(w); if (w !== fam.w) { fam.w = w; if (!a.activeWeapon?.()) flash(FAM_NAME[w] || w) } },
      setCtx: (c) => { a.setCtx(c); if (K3 && c === 'bomb') clay.current?.pulse('act2') },
      setTarget: (b) => { a.setTarget(b); a.__target = !!b }, // Interaktion in Reichweite (HUD 3D: Hinweis-Lichthof an der Blase)
      setActiveWeapon: (wid) => { const was = a.activeWeapon?.(); a.setActiveWeapon(wid); if (K3) clay.current?.setWeapon(wid ? 'blaster' : 'fist'); if (wid !== was) flash(wid ? (a.weapons?.().find((x) => x.wid === wid)?.n || wid) : 'Faust') },
      openBag: (...x) => { a.openBag(...x); clay.current?.setChestOpen(a.bagOpen()) },
      closeBag: () => { a.closeBag(); clay.current?.setChestOpen(false) },
      skin: 'clay', clay: () => clay.current })
    if (K3) clay.current?.setCounts(a.counts()); else clay.current?.setScore(a.counts().reduce((s, x) => s + x, 0))
  }
  // Startstand des Scores, sobald Modul und Holz-api da sind
  useEffect(() => { const t = setInterval(() => { if (clay.current && inner.current) { if (K3) clay.current.setCounts(inner.current.counts()); else clay.current.setScore(inner.current.counts().reduce((s, x) => s + x, 0)); clearInterval(t) } }, 200); return () => clearInterval(t) }, [ok])

  return <HudR5f key={ok ? 'clay' : 'wood'} {...props} counts={counts} hide={ok} onApi={wrap} /> // Rückfall baut das Holz-HUD sichtbar neu auf
}

// Minimap-Farbe: Höhe über dem Meer → Rollen der Insel-Palette (Wasser, Sand, tief, mittel, hoch, Gipfel)
function mapColor(host, x, z) {
  const T = host.terrain?.(), P = host.palette?.() || {}; const h = T?.height?.(x, z); if (h == null || !isFinite(h)) return null
  const sea = T.hydro?.()?.seaY ?? 0, k = host.k || 1, r = (h - sea) / (24 * k)
  if (h < sea) return P.water || '#3fa7a0'
  return r < 0.04 ? P.sand || '#f0c58a' : r < 0.3 ? P.low || '#e6a061' : r < 0.6 ? P.mid || '#cc6c42' : r < 0.85 ? P.high || '#a54d38' : P.peak || '#f3d9b0'
}

// ── DOM: Trefferflächen, Settings-Tafel, Waffen-Anzeige ──────────────────────────────────────────────────────────────
function buildDom(hud, inner, getHud) {
  const root = document.createElement('div'); root.id = 'kfb-hud-clay'
  const css = document.createElement('style'); css.textContent = '#kfb-audio-panel{display:none!important}'; document.head.appendChild(css) // ♪-Panel (WS-Audio) im Knet-Modus aus; Regler in der Zahnrad-Tafel
  root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:8991;font-family:Fredoka,system-ui,sans-serif'
  // Trefferflächen bleiben unsichtbar (Georg 22.10.); sie melden nur Zustände an das Modul (hover/pressed/focus), für spätere Micro-Interactions
  const btn = (label, onClick, key = null) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', label); b.title = label
    b.style.cssText = 'position:absolute;pointer-events:auto;background:transparent;border:0;border-radius:18px;cursor:pointer;padding:0;outline-offset:2px'
    b.addEventListener('click', (e) => { e.stopPropagation(); onClick(); b.blur() })
    if (key) { b.dataset.ui = key; const F = (f, v) => () => hud.setUiFlag(key, f, v)
      b.addEventListener('pointerenter', F('hover', true)); b.addEventListener('pointerleave', () => { hud.setUiFlag(key, 'hover', false); hud.setUiFlag(key, 'pressed', false) })
      b.addEventListener('pointerdown', F('pressed', true)); b.addEventListener('pointerup', F('pressed', false)); b.addEventListener('pointercancel', F('pressed', false))
      b.addEventListener('focus', () => hud.setUiFlag(key, 'focus', b.matches(':focus-visible'))); b.addEventListener('blur', F('focus', false)) } // nur Tastatur-Fokus zählt als active, Mausklick nicht
    root.append(b); return b }
  const hits = {
    gear: btn('Einstellungen', () => { hud.tapGear(); SP.settings(!SP.isOpen()) }, 'gear'),
    compass: btn('Kompass: Karte auf/zu', () => hud.toggleCompass(), 'compass'),
    chest: btn('Truhe öffnen', () => { const I = inner.current; if (!I) return; if (I.bagOpen()) I.closeBag(); else { I.openBag(); if (!I.bagOpen()) hud.event({ type: 'landing', strength: 0.25 }) } hud.setChestOpen(I.bagOpen()) }, 'chest'),
  }
  const radio = {
    prev: btn('Titel von vorn', () => { hud.press('prev'); A.musicSkip?.(-1) }, 'radio.prev'),
    play: btn('Musik Pause/Weiter', () => { hud.press('play'); A.musicPause?.(!A.musicPaused?.()) }, 'radio.play'),
    next: btn('Nächster Titel', () => { hud.press('next'); A.musicSkip?.(1) }, 'radio.next'),
    mute: btn('Ton an/aus', () => { hud.press('mute'); A.setVolume('muted', !A.volumes().muted); refreshPanel() }, 'radio.mute'),
  }
  for (const b of Object.values(radio)) b.style.borderRadius = '50%'
  // Waffen-Anzeige (1,5 s über der Truhe)
  const fl = document.createElement('div'); fl.id = 'kfb-hud-clay-flash'
  fl.style.cssText = `position:absolute;padding:6px 14px;border-radius:14px;background:${PAPER};color:${INK};font:600 20px/1.1 Fredoka,sans-serif;box-shadow:0 3px 0 rgba(31,26,20,.25),0 6px 14px rgba(31,26,20,.18);opacity:0;transform:translate(-50%,6px);transition:opacity .2s,transform .2s;white-space:nowrap`
  root.append(fl); let flT = 0
  const flash = (txt) => { fl.textContent = txt; fl.style.opacity = '1'; fl.style.transform = 'translate(-50%,0)'; clearTimeout(flT); flT = setTimeout(() => { fl.style.opacity = '0'; fl.style.transform = 'translate(-50%,6px)' }, 1500) }
  const SP = settingsPanel(root, hud, getHud), settings = SP.settings, refreshPanel = SP.refresh, offDev = SP.off, panel = SP.panel
  let last = ''
  document.body.appendChild(root)
  return {
    bagWas: false,
    flash, settings, settingsOpen: () => SP.isOpen(),
    sync() { // Trefferflächen auf die Rechtecke legen (nur bei Änderung)
      { const o = hud.opened(); hud.setUiFlag('compass', 'on', o.compass); hud.setUiFlag('chest', 'on', o.chest); hud.setUiFlag('radio.mute', 'on', !!A.volumes().muted); hud.setUiFlag('radio.play', 'on', !!A.musicPaused?.()) } // dauerhafte Zustände (auf/zu, stumm, Pause)
      const R = hud.rects(), B = hud.radioButtons(), key = JSON.stringify([R, B]); if (key === last) return; last = key
      for (const [k, b] of Object.entries(hits)) { const r = R[k]; if (!r) continue; const inset = k === 'compass' ? 0.12 : 0.08; Object.assign(b.style, { left: r.x + r.w * inset + 'px', top: r.y + r.h * inset + 'px', width: r.w * (1 - 2 * inset) + 'px', height: r.h * (1 - 2 * inset) + 'px' }) }
      for (const [k, b] of Object.entries(radio)) { const c = B[k]; if (!c) { b.style.display = 'none'; continue } b.style.display = ''; Object.assign(b.style, { left: c.x - c.r + 'px', top: c.y - c.r + 'px', width: 2 * c.r + 'px', height: 2 * c.r + 'px' }) }
      const g = R.gear, cp = R.compass; if (g) Object.assign(panel.style, { right: Math.max(8, innerWidth - (g.x + g.w)) + 'px', top: Math.max(g.y + g.h, cp ? cp.y + cp.h : 0) + 8 + 'px' }) // unter Zahnrad und Kompass (Karte bleibt frei)
      const c = R.chest; if (c) Object.assign(fl.style, { left: c.x + c.w / 2 + 'px', top: Math.max(8, c.y - 40) + 'px' })
    },
    remove() { offDev(); clearTimeout(flT); root.remove(); css.remove() },
    el: root,
  }
}

// ── DOM für HUD 3D (Spike-Paket 1): Trefferflächen Truhe und Pfeil, Name und Entfernung unter dem Pfeil (Bangers mit Kontur, ohne Schild), Waffen-Anzeige ──
const inkText = (size, color = '#fff6e0') => { const o = Math.max(1, Math.round(size / 13)), o2 = o + Math.max(1, Math.round(size / 18)), I = INK3
  const sh = [`${o2}px ${o2}px 0 ${I}`, `${o}px ${o2}px 0 ${I}`, `${o2}px ${o}px 0 ${I}`, `-${o}px -${o}px 0 ${I}`, `${o}px -${o}px 0 ${I}`, `-${o}px ${o}px 0 ${I}`, `0 ${o}px 0 ${I}`, `${o}px 0 0 ${I}`, `-${o}px 0 0 ${I}`, `0 -${o}px 0 ${I}`].join(',')
  return `font:400 ${size}px/1 Bangers,Fredoka,system-ui,sans-serif;letter-spacing:.04em;color:${color};text-shadow:${sh};white-space:nowrap` } // Werte aus h3d-hud inkText
function buildDom3d(hud, inner, P = {}) {
  const host = P.host || {}, L = hud.layout(), F = 1
  const root = document.createElement('div'); root.id = 'kfb-hud-clay'; root.dataset.kit = '3d'
  root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:8991;font-family:Fredoka,system-ui,sans-serif'
  const css = document.createElement('style'); css.textContent = '#kfb-audio-panel{display:none!important}#m1-keys-info{display:none!important}'; document.head.appendChild(css) // ♪-Panel aus (Lautstärken in der Zahnrad-Tafel, Ton an der Kassette); freies „i“ aus (Tastenliste über das Zahnrad, Georg 24.10.)
  const btn = (label, onClick, key, round = true) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', label); b.title = label; b.dataset.ui = key
    b.style.cssText = `position:absolute;pointer-events:auto;background:transparent;border:0;border-radius:${round ? '50%' : '18px'};cursor:pointer;padding:0;outline-offset:2px`
    b.addEventListener('click', (e) => { e.stopPropagation(); onClick(); b.blur() }); const Fl = (f, v) => () => hud.setUiFlag(key, f, v)
    b.addEventListener('pointerenter', Fl('hover', true)); b.addEventListener('pointerleave', () => { hud.setUiFlag(key, 'hover', false); hud.setUiFlag(key, 'pressed', false) })
    b.addEventListener('pointerdown', Fl('pressed', true)); b.addEventListener('pointerup', Fl('pressed', false)); b.addEventListener('pointercancel', Fl('pressed', false))
    b.addEventListener('focus', () => hud.setUiFlag(key, 'focus', b.matches(':focus-visible'))); b.addEventListener('blur', Fl('focus', false))
    root.append(b); return b }
  // Klick = gleiche Wirkung wie die Spieltaste (Lead 24.10.): Taste über den einen Tastatur-Weg (hostKeys) auslösen, keine zweite Logik
  const key = (code) => window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }))
  const hits = {
    chest: btn('Truhe öffnen', () => { const I = inner.current; if (!I) return; if (I.bagOpen()) I.closeBag(); else { I.openBag(); if (!I.bagOpen()) hud.event({ type: 'landing', strength: 0.25 }) } hud.setChestOpen(I.bagOpen()) }, 'chest'),
    arrow: btn('Ziel', () => openFly(fly === 'map' ? null : 'map'), 'arrow'), // Paket 4: Karte und Zielwahl (Flyout L2)
    gear: btn('Einstellungen', () => { hud.tapGear(); openFly(null); SP.settings(!SP.isOpen()) }, 'gear'),
    act0: btn('Faust (V)', () => key('KeyV'), 'act0'), act1: btn('Blaster (B)', () => key('KeyB'), 'act1'), act2: btn('Clown-Bombe (N)', () => key('KeyN'), 'act2'),
  }
  // Knöpfe der N34-Kassette nach „Kassette als Player“ r5 (V-707): plastische Taste (Sockel, Kuppe, Schatten; beim Drücken eingesunken), Glanz nur als dünner
  // Rand, Symbol cremeweiß mit dunkler Kontur, kein Umriss um die Taste. Farbe nach Tageszeit (Tag Orange, Nacht Türkis), Schalter ctl=auto|day|night.
  // Werte aus N33 controlTheme, sobald es im privaten JSON steht; bis dahin CTL_FALLBACK (vorläufig, Lead 24.10.). Symbole wie n34r2_page icon().
  const j17 = {}; for (const k of ['play', 'next', 'mute']) { const d = document.createElement('div'); d.style.cssText = 'position:absolute;pointer-events:none;display:none'; d.dataset.j17 = k; j17[k] = d; root.append(d) }
  const ctlMode = (/(^|[#,])ctl=(auto|day|night)(,|$)/.exec(location.hash) || [])[2] || 'auto'
  const theme = () => { const night = ctlMode === 'night' || (ctlMode === 'auto' && !!host.isNight?.()); return { ...CTL_THEME[night ? 'night' : 'day'], id: night ? 'night' : 'day' } }
  const j17svg = (kind, T, pressed = false) => { const s = 0.4, C = T.symbol, K = T.outline, sw = 0.1
    const ico = kind === 'play' ? `<path d="M${-0.55 * s} ${-s} L${0.9 * s} 0 L${-0.55 * s} ${s} Z"/>` : kind === 'pause' ? `<rect x="${-0.6 * s}" y="${-s}" width="${0.42 * s}" height="${2 * s}" rx="0.03"/><rect x="${0.18 * s}" y="${-s}" width="${0.42 * s}" height="${2 * s}" rx="0.03"/>`
      : kind === 'next' ? [-0.85, -0.05].map((o) => `<path d="M${s * o} ${-0.8 * s} L${s * (o + 0.75)} 0 L${s * o} ${0.8 * s} Z"/>`).join('') + `<rect x="${0.72 * s}" y="${-0.8 * s}" width="${0.2 * s}" height="${1.6 * s}"/>`
      : `<path d="M${-s} ${-0.35 * s} L${-0.45 * s} ${-0.35 * s} L0 ${-0.85 * s} L0 ${0.85 * s} L${-0.45 * s} ${0.35 * s} L${-s} ${0.35 * s} Z"/>`
    const waves = kind === 'sound' ? `<path d="M${0.15 * s + 0.55 * s * Math.cos(-0.9)} ${0.55 * s * Math.sin(-0.9)} A${0.55 * s} ${0.55 * s} 0 0 1 ${0.15 * s + 0.55 * s * Math.cos(0.9)} ${0.55 * s * Math.sin(0.9)} M${0.15 * s + 0.95 * s * Math.cos(-0.8)} ${0.95 * s * Math.sin(-0.8)} A${0.95 * s} ${0.95 * s} 0 0 1 ${0.15 * s + 0.95 * s * Math.cos(0.8)} ${0.95 * s * Math.sin(0.8)}" fill="none" stroke-linecap="round"/>`
      : kind === 'mute' ? `<path d="M${0.3 * s} ${-0.45 * s} L${s} ${0.45 * s} M${s} ${-0.45 * s} L${0.3 * s} ${0.45 * s}" fill="none" stroke-linecap="round"/>` : ''
    const sym = (stroke, w, fill) => `<g fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round">${ico}</g><g stroke="${stroke}" stroke-width="${w + 0.11}">${waves}</g>`
    const dy = pressed ? 0.12 : 0, id = 'k' + kind + T.id
    return `<svg data-kind="${kind}" data-theme="${T.id}" viewBox="-1.2 -1.2 2.4 2.5" width="100%" height="100%" style="overflow:visible"><defs><radialGradient id="${id}" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="${T.hi}"/><stop offset=".55" stop-color="${T.mid}"/><stop offset="1" stop-color="${T.lo}"/></radialGradient></defs>`
      + `<ellipse cx="0.06" cy="0.3" rx="${pressed ? 0.95 : 1.02}" ry="${pressed ? 0.86 : 0.92}" fill="rgba(19,14,22,${pressed ? 0.28 : 0.38})"/>`  // Schatten
      + `<circle cx="0" cy="0.16" r="1" fill="${T.lo}"/>`  // Sockel
      + `<g transform="translate(0 ${dy})"><circle r="0.92" fill="url(#${id})"/><path d="M${-0.72} ${-0.3} A0.8 0.8 0 0 1 ${0.18} ${-0.8}" fill="none" stroke="${T.gloss}" stroke-width="0.07" stroke-linecap="round"/>`  // Kuppe + Glanzrand
      + sym(K, sw * 2.2, K) + sym(C, 0.06, C) + `</g></svg>` }
  let j17Key = ''
  const cas = {
    play: btn('Musik Pause/Weiter', () => { A.musicPause?.(!A.musicPaused?.()) }, 'cassette.play'),
    next: btn('Nächster Titel', () => { A.musicSkip?.(1) }, 'cassette.next'),
    mute: btn('Ton an/aus', () => { A.setVolume('muted', !A.volumes().muted); SP.refresh() }, 'cassette.mute'),
  }
  // Tastenbeschriftung (V/B/N) und leere Plätze 4–6 (gestrichelter Ring, 50 %), Board buildFrame
  const keyEls = [], ring = []
  L.slots.forEach((sl, i) => { const k = document.createElement('div'); keyEls.push(k); root.append(k)
    if (i >= 3) { const r = document.createElement('div'); ring.push([r, sl]); root.append(r) } })
  // Interaktion: ovale Blase (h3d-hud bubble), Taste I, Hinweis-Lichthof B in Reichweite
  const bub = document.createElement('div'); bub.style.cssText = 'position:absolute;pointer-events:auto;cursor:pointer'; bub.setAttribute('role', 'button'); bub.tabIndex = 0; bub.dataset.ui = 'inter'
  bub.addEventListener('click', (e) => { e.stopPropagation(); P.onInteract?.() }); root.append(bub)
  const bubKey = document.createElement('div'); root.append(bubKey)
  const BPATH = 'M62 6 C96 6 118 22 118 44 C118 62 104 75 84 80 C88 88 95 94 104 97 C90 98 76 93 68 83 C65 83 64 83 62 83 C28 83 6 67 6 44 C6 22 28 6 62 6 Z'
  let bubHint = null, glowAnim = null
  const drawBubble = (w, hh, hint) => { const dot = `<span style="width:${hh * 0.15}px;height:${hh * 0.15}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#5a4a5e 0%,#2b2236 55%,${INK3} 100%)"></span>`
    bub.innerHTML = `<div data-glow style="position:absolute;left:${-hh * 0.25}px;top:${-hh * 0.25}px;width:${w + hh * 0.5}px;height:${hh * 1.5}px;border-radius:50%;background:radial-gradient(closest-side,#7fe3ffdd 0%,#7fe3ff66 50%,transparent 100%);opacity:${hint ? 1 : 0}"></div>`
      + `<svg viewBox="0 0 124 100" width="${w}" height="${hh}" style="position:absolute;inset:0;overflow:visible"><defs><radialGradient id="kb3d" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fffdf6"/><stop offset=".5" stop-color="#f8eedb"/><stop offset="1" stop-color="#e4d4b6"/></radialGradient></defs><path d="${BPATH}" fill="${INK3}" transform="translate(2.6 3)"/><path d="${BPATH}" fill="url(#kb3d)" stroke="${INK3}" stroke-width="3.2"/></svg>`
      + `<div style="position:absolute;left:0;top:0;width:${w}px;height:${hh * 0.86}px;display:flex;align-items:center;justify-content:center;gap:${hh * 0.07}px;opacity:${hint ? 1 : 0.35}">${dot}${dot}${dot}</div>`
    bub.title = hint ? 'Interagieren (I, in Reichweite)' : 'Interagieren (I, nichts in Reichweite)'; bub.setAttribute('aria-label', bub.title)
    glowAnim?.cancel(); glowAnim = null; const g = bub.querySelector('[data-glow]'); if (hint && !reducedMotion() && g.animate) glowAnim = g.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0.4, transform: 'scale(.9)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 1300, iterations: Infinity }) }
  // Almanac: letzte 7 Karten als Fächer (Original-Kartenbilder, nie umgefärbt), „N CARDS | M DECKS“ (h3d-hud fanEl)
  const fan = document.createElement('div'); fan.style.cssText = 'position:absolute;pointer-events:auto;cursor:pointer'; fan.setAttribute('role', 'button'); fan.tabIndex = 0; fan.dataset.ui = 'fan'; root.append(fan)
  const cap = document.createElement('div'); root.append(cap)
  let fanImgs = [], fanData = { srcs: [], total: 0, decks: 0 }
  fan.addEventListener('click', (e) => { e.stopPropagation(); openFly(fly === 'fan' ? null : 'fan') })
  fan.addEventListener('mouseenter', () => { if (!reducedMotion()) fanImgs.forEach((im, i) => (im.style.transform = `translateY(${i * 1.5}px)`)) })
  fan.addEventListener('mouseleave', () => fanImgs.forEach((im) => (im.style.transform = '')))
  const ROT = [-2.2, 1.6, -0.8, 2.4, -1.7, 1.1, -0.5], DX = [3, -4, 5, -2, 4, -3, 0]
  const setFan = (d) => { fanData = d; last = ''; hud.setAlmanacCount(d.srcs.length) }
  // Gesamt-Fluff-Zähler (Georg 24.10.): Schrift wie die Entfernung am Pfeil, etwas größer; links vor den Kugeln, beide mittig; Hüpfer beim Hochzählen
  // Als Canvas gezeichnet, damit die Glyphenmitte exakt auf der Mittellinie der Kugeln liegt (Georg 24.10.: „97“ hing zu tief); Ziffernhöhe = 0,6 × Kugel
  const tot = document.createElement('canvas'); tot.id = 'kfb-hud3d-total'; tot.style.cssText = 'position:absolute;pointer-events:none;display:none'; root.append(tot); let totShown = null, totW = 0, totK = 0
  const drawTotal = (T, k, orbPx) => { const dpr = window.devicePixelRatio || 1, str = String(T), g = tot.getContext('2d'), F0 = 100
    g.font = `400 ${F0}px Bangers, Fredoka, sans-serif`; const m0 = g.measureText('0123456789'), gh0 = m0.actualBoundingBoxAscent + m0.actualBoundingBoxDescent
    const fs = F0 * (orbPx * 0.6) / gh0; g.font = `400 ${fs}px Bangers, Fredoka, sans-serif`; const m = g.measureText(str), asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent, ow = Math.max(2, fs * 0.09), pad = ow * 2.2
    const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight + 2 * pad, h = asc + desc + 2 * pad
    tot.width = Math.ceil(w * dpr); tot.height = Math.ceil(h * dpr); tot.style.width = w + 'px'; tot.style.height = h + 'px'
    const c = tot.getContext('2d'); c.scale(dpr, dpr); c.font = `400 ${fs}px Bangers, Fredoka, sans-serif`; c.textBaseline = 'alphabetic'; c.lineJoin = 'round'
    const x = pad + m.actualBoundingBoxLeft, y = pad + asc
    c.fillStyle = INK3; c.fillText(str, x + ow * 0.9, y + ow * 1.1) // Schatten unten rechts (Kontur wie inkText: unten rechts schwerer)
    c.strokeStyle = INK3; c.lineWidth = ow * 2; c.strokeText(str, x, y); c.fillStyle = '#fff6e0'; c.fillText(str, x, y)
    return w }
  // Titel der Kassette nur beim Wechsel, 2,4 s, über der Kassette
  const ttl = document.createElement('div'); ttl.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity .25s'; root.append(ttl); let ttlT = 0, lastTitle = null
  // Tempo-Zahl und „KM/H“ links neben der Leiste (h3d-hud: rechtsbündig 8 px vor der Leiste, Zahl fs + 4, Einheit 0,7 fs)
  const spd = document.createElement('div'); spd.id = 'kfb-hud3d-speed'; spd.style.cssText = 'position:absolute;display:none;flex-direction:column;align-items:flex-end;gap:2px;pointer-events:none'
  const spN = document.createElement('div'), spU = document.createElement('div'); spU.textContent = 'KM/H'; spd.append(spN, spU); root.append(spd); let spKey = ''
  // Name und Entfernung unter dem Pfeil
  const lab = document.createElement('div'); lab.id = 'kfb-hud3d-label'; lab.style.cssText = 'position:absolute;transform:translateX(50%);display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none'
  const nm = document.createElement('div'), row = document.createElement('div'), dv = document.createElement('span'), ds = document.createElement('span')
  row.style.cssText = 'display:flex;gap:8px;align-items:baseline'; row.append(dv, ds); lab.append(nm, row); root.append(lab)
  const fl = document.createElement('div'); fl.id = 'kfb-hud-clay-flash'
  fl.style.cssText = `position:absolute;padding:6px 14px;border-radius:14px;background:${PAPER};color:${INK};font:600 20px/1.1 Fredoka,sans-serif;box-shadow:0 3px 0 rgba(31,26,20,.25),0 6px 14px rgba(31,26,20,.18);opacity:0;transform:translate(-50%,6px);transition:opacity .2s,transform .2s;white-space:nowrap`
  root.append(fl); let flT = 0
  const flash = (txt) => { fl.textContent = txt; fl.style.opacity = '1'; fl.style.transform = 'translate(-50%,0)'; clearTimeout(flT); flT = setTimeout(() => { fl.style.opacity = '0'; fl.style.transform = 'translate(-50%,6px)' }, 1500) }
  // ── Flyouts L2 (HUD 3D Paket 4, h3d-hud mapFlyout/fanFlyout): eine Hülle, öffnet nach innen, immer nur eines; Esc oder erneuter Klick schließt ─────
  // Karte + Zielwahl links neben dem Pfeil (Board 390 × 206 an x = Pfeil − 22 − w, y = unter den Kugeln); Fächer: „RECENT CARDS“ unter dem Fächer (452 breit, 4 Spalten).
  const PANEL = (k) => `position:absolute;box-sizing:border-box;pointer-events:auto;background:#f4ecdc;border:${Math.max(1, 4 * k)}px solid ${INK3};border-radius:${28 * k}px;box-shadow:${4 * k}px ${6 * k}px 0 ${INK3},0 ${24 * k}px ${52 * k}px rgba(20,12,24,.28),inset 0 ${-8 * k}px 0 rgba(80,60,40,.08),inset 0 ${6 * k}px 0 rgba(255,255,255,.6);color:#2a2024;font-family:Fredoka,system-ui,sans-serif`
  const mapFly = document.createElement('div'); mapFly.id = 'kfb-hud3d-map'; mapFly.setAttribute('role', 'dialog'); mapFly.setAttribute('aria-label', 'Karte und Ziele'); mapFly.style.display = 'none'; root.append(mapFly)
  const fanFly = document.createElement('div'); fanFly.id = 'kfb-hud3d-fan'; fanFly.setAttribute('role', 'dialog'); fanFly.setAttribute('aria-label', 'Letzte Karten'); fanFly.style.display = 'none'; root.append(fanFly)
  ;[mapFly, fanFly].forEach((el) => el.addEventListener('click', (e) => e.stopPropagation()))
  const mm = createMiniMap({ radius: 140, sample: (x, z) => mapColor(host, x, z), path: host.path || [], marks: () => host.marks?.() || [] })
  const mapCv = document.createElement('canvas'); let fly = null, flyT = 0
  const openFly = (which) => { fly = which; mapFly.style.display = fly === 'map' ? '' : 'none'; fanFly.style.display = fly === 'fan' ? '' : 'none'; hud.setUiFlag('arrow', 'on', fly === 'map'); if (fly) { SP.settings(false); buildFly(true) } }
  const buildFly = (force) => {
    const v = hud.view(), k = v.k, me = P.pos?.()
    if (fly === 'map') {
      const goals = host.goals?.() || [], cur = host.goal?.()?.id, ms = 340 * k
      if (force) { mapFly.style.cssText = PANEL(k) + `;right:${244 * k}px;top:${124 * k}px;width:${780 * k}px;min-height:${412 * k}px;padding:${24 * k}px;display:flex;align-items:stretch;gap:${24 * k}px` // Höhe wächst mit dem Inhalt (sonst ragte „Return to start“ heraus)
        mapCv.width = mapCv.height = Math.round(ms * (window.devicePixelRatio || 1)); mapCv.style.cssText = `flex:none;width:${ms}px;height:${ms}px;border-radius:${ms * 0.16}px;box-shadow:inset 0 0 0 ${2 * k}px rgba(0,0,0,.15),0 0 0 ${3 * k}px ${INK3}`
        const list = document.createElement('div'); list.style.cssText = `flex:1;min-width:0;display:flex;flex-direction:column;gap:${4 * k}px`
        const head = document.createElement('div'); head.textContent = 'ZIELE'; head.style.cssText = `font:400 ${30 * k}px/1 Bangers,Fredoka,sans-serif;letter-spacing:.05em;margin:0 0 ${8 * k}px ${4 * k}px`; list.append(head)
        goals.slice(0, 4).forEach((g) => { const on = g.id === cur, d = me ? Math.hypot(g.pos.x - me.x, g.pos.z - me.z) : null, r = document.createElement('button'); r.type = 'button'; r.dataset.goal = g.id
          r.style.cssText = `display:flex;align-items:center;gap:${16 * k}px;padding:${12 * k}px ${16 * k}px;border-radius:${18 * k}px;border:0;text-align:left;cursor:pointer;color:inherit;font:inherit;background:${on ? '#fff6e0' : 'transparent'};box-shadow:${on ? `0 0 0 ${3 * k}px ${INK3}` : 'none'}`
          r.innerHTML = `<span style="width:${16 * k}px;height:${16 * k}px;border-radius:50%;flex:none;background:${on ? arrowColor(d) : '#b9ad99'};box-shadow:0 0 0 ${2 * k}px ${INK3}"></span><span style="flex:1;min-width:0"><span style="display:block;font:600 ${26 * k}px/1.1 Fredoka,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g.name}</span><span style="display:block;font:500 ${20 * k}px/1.2 Fredoka,sans-serif;color:#7a6d5e">${g.world || ''}</span></span><span style="font:400 ${28 * k}px/1 Bangers,Fredoka,sans-serif;letter-spacing:.04em">${fmtDist(d) || ''}</span>`
          r.addEventListener('click', (e) => { e.stopPropagation(); host.setGoal?.(g.id); buildFly(true) }); list.append(r) })
        const back = document.createElement('button'); back.type = 'button'; back.dataset.goal = 'return'; back.textContent = 'Return to start' // ehrlich (Lead 24.10.): Ruhestein V-623 gibt es noch nicht; Klick = Taste R
        back.style.cssText = `margin-top:auto;display:flex;align-items:center;gap:${16 * k}px;padding:${14 * k}px ${16 * k}px;border-radius:${18 * k}px;border:0;background:#2b2236;color:#fff6e0;font:600 ${24 * k}px/1 Fredoka,sans-serif;cursor:pointer`
        back.addEventListener('click', (e) => { e.stopPropagation(); window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR', bubbles: true })); openFly(null) }); list.append(back)
        mapFly.replaceChildren(mapCv, list) }
      const g0 = host.goal?.(); mm.draw(mapCv, { pos: me, heading: P.heading?.() || 0, target: g0 ? { x: g0.pos.x, z: g0.pos.z, color: arrowColor(me ? Math.hypot(g0.pos.x - me.x, g0.pos.z - me.z) : null) } : null, force })
    }
    if (fly === 'fan' && force) {
      const A2 = L.almanac, w = 904 * k, cols = 4, gap = 16 * k, cw = (w - 48 * k - (cols - 1) * gap) / cols, chh = cw / 1.79
      fanFly.style.cssText = PANEL(k) + `;left:${36 * k}px;top:${(A2.y + A2.ch + 6 * A2.step + A2.cap + 48) * k}px;width:${w}px;padding:${24 * k}px;display:flex;flex-direction:column;gap:${20 * k}px`
      const head = document.createElement('div'); head.textContent = 'LETZTE KARTEN'; head.style.cssText = `font:400 ${30 * k}px/1 Bangers,Fredoka,sans-serif;letter-spacing:.05em`
      const grid = document.createElement('div'); grid.style.cssText = `display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:${gap}px`
      fanData.srcs.slice(-7).reverse().forEach((src) => { const im = document.createElement('img'); im.src = src; im.alt = 'Karte'; im.style.cssText = `width:${cw}px;height:${chh}px;border-radius:${8 * k}px;box-shadow:0 0 0 ${2 * k}px ${INK3},${2 * k}px ${4 * k}px 0 ${2 * k}px ${INK3};display:block`; grid.append(im) })
      const all = document.createElement('button'); all.type = 'button'; all.disabled = true; all.title = 'Almanac-Overlay folgt (L3)'; all.textContent = `Alle Karten · ${fanData.total} · folgt`
      all.style.cssText = `align-self:flex-start;padding:${12 * k}px ${24 * k}px;border-radius:${28 * k}px;border:0;background:#2b2236;color:#fff6e0;opacity:.55;font:600 ${24 * k}px/1 Fredoka,sans-serif`
      fanFly.replaceChildren(head, grid, all)
    }
  }
  // Zahnrad-Tafel: Mode (Walk/Drive/Fly) und Game/God (God folgt, kein Owner) vor den bestehenden Zeilen
  const seg = (items, cur, onPick) => { const w = document.createElement('div'); w.style.cssText = `display:flex;gap:2px;padding:3px;border-radius:16px;background:#2b2236;border:1.5px solid ${INK3}`
    items.forEach(([id, t, dis]) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.mode = id; b.textContent = t; b.disabled = !!dis; b.title = dis ? 'folgt' : t
      b.style.cssText = `padding:3px 10px;border:0;border-radius:12px;font:400 16px/1.2 Bangers,Fredoka,sans-serif;letter-spacing:.06em;cursor:${dis ? 'default' : 'pointer'};color:${id === cur() ? '#fff6e0' : dis ? '#6e6478' : '#bfb3c7'};background:${id === cur() ? '#d97c3a' : 'transparent'}`
      b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (!dis) onPick(id) }); w.append(b) }); return w }
  let modeBox = null, godBox = null
  const modeRow = ({ row: r }) => { const box = document.createElement('div'); modeBox = box; const paint = () => box.replaceChildren(seg([['walk', 'WALK'], ['drive', 'DRIVE'], ['fly', 'FLY']], () => host.mode?.() || 'walk', (m) => { host.setMode?.(m); paint() })); paint(); box.paint = paint; return r('Mode', box) }
  const godRow = ({ row: r }) => { const box = document.createElement('div'); godBox = box; box.append(seg([['game', 'GAME'], ['god', 'GOD · FOLGT', true]], () => 'game', () => {})); return r('Spiel', box) }
  const keysRow = ({ row: r }) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.setting = 'keys'; b.textContent = 'zeigen'
    b.style.cssText = `padding:4px 14px;border-radius:12px;border:0;background:#2b2236;color:#fff6e0;font:600 15px/1.2 Fredoka,sans-serif;cursor:pointer`
    b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); document.getElementById('m1-keys-info')?.click() }); return r('Tastenliste', b) } // ersetzt das freie „i“ (m1Host keyList)
  const SP = settingsPanel(root, hud, () => null, { top: [modeRow, godRow, keysRow], accent: '#d97c3a', refresh: () => modeBox?.paint?.() })
  document.body.appendChild(root)
  let last = '', lastLab = '', lastMusic = ''
  return {
    bagWas: false, flash, settings: (v) => SP.settings(v), settingsOpen: () => SP.isOpen(), setFan,
    closeFly: () => { if (!fly) return false; openFly(null); return true }, flyOpen: () => fly,
    sync() {
      hud.setUiFlag('chest', 'on', hud.opened().chest)
      if ((P.deadT = (P.deadT || 0) + 1) % 30 === 0) P.dead = !!A.stats?.()?.music?.dead // WS-Audio: Jukebox aufgegeben (kein Netz) → Kassette nicht als „läuft“
      const np = A.musicPaused?.() ? null : A.nowPlaying?.(), mu = !!A.volumes().muted, pl = !A.musicPaused?.() && !P.dead; hud.setMusic({ playing: pl, muted: mu })
      const mk = (pl ? 1 : 0) + '|' + (mu ? 1 : 0); if (mk !== lastMusic) { lastMusic = mk; hud.setUiFlag('cassette.play', 'on', !pl); hud.setUiFlag('cassette.mute', 'on', mu) }
      { const T = theme(), pr = (k) => hud.uiState('cassette.' + k) === 'pressed', jk = [mk, T.id, pr('play'), pr('next'), pr('mute')].join('|') // ein Wechsel-Knopf: läuft Musik → Pause, sonst Play; Ton aus = durchgestrichen
        if (jk !== j17Key) { j17Key = jk; j17.play.innerHTML = j17svg(pl ? 'pause' : 'play', T, pr('play')); j17.next.innerHTML = j17svg('next', T, pr('next')); j17.mute.innerHTML = j17svg(mu ? 'mute' : 'sound', T, pr('mute')) } }
      for (const k of ['play', 'next', 'mute']) { const st = hud.uiState('cassette.' + k), t = reducedMotion() ? '' : st === 'hover' ? 'scale(1.06)' : ''; if (j17[k].style.transform !== t) j17[k].style.transform = t }
      const R = hud.rects(), v = hud.view(), k = v.k, t = hud.label(), CB = hud.cassetteButtons(), key2 = JSON.stringify([R, v.W, v.H, CB, fanData.srcs.length, fanData.total])
      if (key2 !== last) { last = key2
        const core = (r, fill) => { const ins = (1 - fill) / 2; return { left: r.x + r.w * ins + 'px', top: r.y + r.h * ins + 'px', width: r.w * fill + 'px', height: r.h * fill + 'px' } }
        for (const [nk, b] of Object.entries(hits)) { const r = R[nk]; if (!r) continue; Object.assign(b.style, core(r, (hud.layout()[nk]?.fill ?? 0.8) * 0.94)) }
        for (const [nk, b] of Object.entries(cas)) { const c = CB[nk]; if (!c) { b.style.display = 'none'; continue } b.style.display = ''; Object.assign(b.style, { left: c.x - c.r + 'px', top: c.y - c.r + 'px', width: 2 * c.r + 'px', height: 2 * c.r + 'px' })
          const d = j17[nk]; if (c.j17) Object.assign(d.style, { display: 'block', left: c.x - c.r * 1.15 + 'px', top: c.y - c.r * 1.15 + 'px', width: 2.3 * c.r + 'px', height: 2.3 * c.r + 'px' }); else d.style.display = 'none' }
        Object.assign(lab.style, { right: L.label.right * k + 'px', top: L.label.top * k + 'px' })
        // Aktions-Tasten und leere Plätze
        const ks = Math.round(L.keys * k), BX = (x) => v.W / 2 + (x - 960) * k, BY = (y) => v.H - (1080 - y) * k // unten Mitte verankert wie die Hülle (Fenster ≠ 16:9)
        L.slots.forEach((sl, i) => { const el = keyEls[i]; el.style.cssText = inkText(ks, i < 3 ? '#fff6e0' : '#bdb6ab') + `;position:absolute;left:${BX(sl.x + sl.s + 6)}px;top:${BY(sl.y + sl.s - 26)}px;pointer-events:none;opacity:${i < 3 ? 1 : 0.7}`; /* gleiche Regel wie das „I“ an der Blase: rechts unten, mit Abstand, ohne Tangente */ el.textContent = i < 3 ? ['V', 'B', 'N'][i] : '' })
        ring.forEach(([r, sl]) => { r.style.cssText = `position:absolute;left:${BX(sl.x + sl.s * 0.14)}px;top:${BY(sl.y + sl.s * 0.14)}px;width:${sl.s * 0.72 * k}px;height:${sl.s * 0.72 * k}px;border-radius:50%;border:${Math.max(1, 3 * k)}px dashed rgba(255,246,224,.5);box-shadow:0 0 0 1px rgba(19,14,22,.14),inset 0 0 0 1px rgba(19,14,22,.14);box-sizing:border-box;pointer-events:none` })
        const I = L.inter; Object.assign(bub.style, { left: BX(I.x) + 'px', top: BY(I.y) + 'px', width: I.w * k + 'px', height: I.h * k + 'px' }); bubHint = null
        bubKey.style.cssText = inkText(ks) + `;position:absolute;left:${BX(I.x + I.w + 6)}px;top:${BY(I.y + I.h - 26)}px;pointer-events:none`; bubKey.textContent = 'I'
        // Fächer
        const A2 = L.almanac, cw = A2.cw * k, chh = A2.ch * k, n = fanData.srcs.length
        Object.assign(fan.style, { left: A2.x * k + 'px', top: A2.y * k + 'px', width: cw + 'px', height: (n ? chh + (n - 1) * A2.step * k : 0) + 'px' })
        fan.replaceChildren(); fanImgs = fanData.srcs.map((src, i) => { const j = ROT.length - n + i, im = document.createElement('img'); im.src = src; im.alt = 'Karte'; im.draggable = false
          im.style.cssText = `position:absolute;left:${Math.round(DX[j] * cw / 256)}px;top:${i * A2.step * k}px;width:${cw}px;height:${chh}px;border-radius:${Math.max(3, cw * 0.03)}px;box-shadow:0 ${1.5 * k * 2}px 0 0 #e8ddc6,0 0 0 ${k * 2}px ${INK3},${k * 2}px ${2 * k * 2}px 0 ${k * 2}px ${INK3};z-index:${i + 1};transform-origin:50% 0;rotate:${ROT[j]}deg;transition:transform .18s`; fan.append(im); return im })
        fan.setAttribute('aria-label', `Almanac: ${fanData.total} Karten`)
        const cs = Math.round(A2.cap * k); cap.style.cssText = inkText(cs) + `;position:absolute;left:${A2.x * k + cw / 2}px;top:${A2.y * k + (n - 1) * A2.step * k + chh + 16 * k}px;transform:translateX(-50%);pointer-events:none;display:${n ? 'flex' : 'none'};align-items:center;gap:${5 * k * 2}px`
        cap.innerHTML = `<span>${fanData.total} CARDS</span><span style="width:${Math.max(2, cs * 0.16)}px;height:${cs * 0.95}px;border-radius:2px;background:#fff6e0;box-shadow:0 0 0 1px ${INK3}"></span><span>${fanData.decks} ${fanData.decks === 1 ? 'DECK' : 'DECKS'}</span>`
        const c = R.chest; if (c) Object.assign(fl.style, { left: c.x + c.w / 2 + 'px', top: Math.max(8, c.y - 40) + 'px' })
        // „i“ der Tastenliste (m1Host, rechts unten) lag über der Kassette: im 3D-Modus über die Kassette setzen (Lead 24.10.; hud=clay unverändert)
        { const ib = document.getElementById('m1-keys-box'), cr = R.cassette; if (ib && cr) { ib.dataset.kfbHud3d ??= ib.style.bottom; ib.style.bottom = Math.round(v.H - cr.y + 4 * k) + 'px' } } // Liste über der Kassette; das „i“ selbst blendet die CSS-Regel aus
        const g = R.gear, cp = R.cassette; if (g) Object.assign(SP.panel.style, { right: Math.max(8, innerWidth - (g.x + g.w)) + 'px', top: g.y + g.h + 8 + 'px' })
        if (cp) ttl.style.cssText = inkText(Math.round(32 * k)) + `;position:absolute;right:${innerWidth - cp.x - cp.w * 0.9}px;top:${cp.y - 30 * k}px;pointer-events:none;opacity:${ttl.style.opacity || 0};transition:opacity .25s` }
      // Gesamt-Fluff: Wert vom Owner, angezeigt erst wenn keine Kugel mehr fliegt (zählt mit dem Kontakt hoch)
      { const T = host.fluffTotal?.(); if (T == null) tot.style.display = 'none'
        else if ((T !== totShown || k !== totK) && hud.inFlight() === 0) { const up = totShown != null && T > totShown; totShown = T; totK = k; tot.dataset.value = String(T) // auch bei Maßstabswechsel neu (erstes Bild kennt die Fenstergröße noch nicht)
          const o0 = R.orb0, orbPx = o0 ? o0.h * hud.layout().orb0.fill : 68 * k, wPx = drawTotal(T, k, orbPx); tot.style.display = 'block'; tot.style.transformOrigin = '50% 100%'
          const wRef = (wPx + 18 * k) / k; if (Math.abs(wRef - totW) > 1) { totW = wRef; hud.setOrbShift(wRef / 2) } // Gruppe Zahl + Kugeln mittig; Abstand Zahl–Kugel = Kugelabstand (18 Bezugs-px)
          if (up && !reducedMotion() && tot.animate) tot.animate([{ transform: 'translateY(0) scale(1,1)' }, { transform: `translateY(${-10 * k}px) scale(1.14,0.86)` }, { transform: 'translateY(0) scale(0.94,1.06)' }, { transform: 'none' }], { duration: 320, easing: 'ease-out' }) }
        const o = R.orb0; if (o && T != null) { const fill = hud.layout().orb0.fill, coreL = o.x + o.w * (1 - fill) / 2; Object.assign(tot.style, { left: (coreL - 18 * k - parseFloat(tot.style.width || 0)) + 'px', top: (o.y + o.h / 2 - parseFloat(tot.style.height || 0) / 2) + 'px', right: '' }) } }
      { const sp = hud.speedState(), key3 = sp.visible ? sp.kmh + '|' + k : '' // Zahl nur bei Wechsel neu
        if (key3 !== spKey) { spKey = key3; spd.style.display = sp.visible ? 'flex' : 'none'; if (sp.visible) { const T = L.speedText; spN.style.cssText = inkText(Math.round((T.fs + 8) * k)); spN.textContent = String(sp.kmh); spU.style.cssText = inkText(Math.round(T.fs * 0.7 * k))
          Object.assign(spd.style, { right: T.right * k + 'px', top: T.top * k + 'px' }) } } }
      if (fly === 'map' && (flyT = (flyT + 1) % 6) === 0) buildFly(false) // Minimap ~10 Hz, solange offen
      // Interaktions-Hinweis (in Reichweite: Hinweis-Lichthof B)
      const hint = !!inner.current?.__target; if (hint !== bubHint) { bubHint = hint; const I = L.inter; drawBubble(I.w * k, I.h * k, hint) }
      // Titel nur beim Wechsel
      const title = np?.title || null; if (title !== lastTitle) { const show = lastTitle !== null && title; lastTitle = title; if (show) { ttl.textContent = title.replace(/[_-]+/g, ' ').toUpperCase(); ttl.style.opacity = '1'; clearTimeout(ttlT); ttlT = setTimeout(() => { ttl.style.opacity = '0' }, 2400) } }
      const lk = t ? [t.name, t.dist, t.dv, k].join('|') : ''
      if (lk !== lastLab) { lastLab = lk; lab.style.display = t ? 'flex' : 'none'; hits.arrow.style.display = t ? '' : 'none'
        if (t) { nm.style.cssText = inkText(Math.round(L.label.fs * k)); nm.textContent = (t.name || '').toUpperCase(); dv.style.cssText = inkText(Math.round(L.label.fs * k), '#bfe8ff'); dv.textContent = t.dv || ''
          ds.style.cssText = inkText(Math.round(L.label.fd * k)); ds.textContent = t.dist || ''; hits.arrow.setAttribute('aria-label', 'Ziel ' + t.name + ', ' + (t.dist || 'angekommen')) } }
    },
    remove() { clearTimeout(flT); clearTimeout(ttlT); glowAnim?.cancel(); SP.off(); root.remove(); css.remove(); const ib = document.getElementById('m1-keys-box'); if (ib && ib.dataset.kfbHud3d != null) { ib.style.bottom = ib.dataset.kfbHud3d; delete ib.dataset.kfbHud3d } },
    el: root,
  }
}

// Zahnrad-Tafel (eine für beide Kits): Entwickler-Infos (V-655), Ton, Lautstärken, Bewegung reduzieren, Holz-HUD zum Vergleich; extra.top = Zeilen davor (HUD 3D: Mode, Game/God)
function settingsPanel(root, hud, getHud, extra = {}) {
  const panel = document.createElement('div'); panel.id = 'kfb-hud-settings'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Einstellungen')
  panel.style.cssText = `position:absolute;display:none;pointer-events:auto;min-width:300px;padding:16px 18px 14px;border-radius:20px;background:${PAPER};color:${INK};box-shadow:0 5px 0 rgba(31,26,20,.28),0 12px 28px rgba(31,26,20,.22);font:500 18px/1.3 Fredoka,sans-serif`
  root.append(panel)
  let panelOpen = false
  const row = (label, ctl) => { const r = document.createElement('label'); r.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:18px;padding:8px 0;cursor:pointer'; const s = document.createElement('span'); s.textContent = label; r.append(s, ctl); return r }
  const toggle = (get, set, name) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.setting = name; b.setAttribute('role', 'switch')
    const paint = () => { const on = get(); b.setAttribute('aria-checked', on ? 'true' : 'false'); const acc = getHud()?.status().zones?.accent || extra.accent || '#c9508f'; b.style.cssText = `width:54px;height:30px;border-radius:15px;border:0;cursor:pointer;position:relative;background:${on ? acc : '#cbbfa6'};box-shadow:inset 0 -3px 0 rgba(0,0,0,.18);transition:background .2s`; b.innerHTML = `<span style="position:absolute;top:3px;left:${on ? 27 : 3}px;width:24px;height:24px;border-radius:50%;background:#fff8e8;box-shadow:0 2px 0 rgba(0,0,0,.2);transition:left .2s"></span>` }
    b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); set(!get()); paint() }); b.paint = paint; paint(); return b }
  const dev = toggle(() => DEVUI, (v) => setDevUi(v), 'devui'); if (devUiLocked()) { dev.disabled = true; dev.title = 'aus (clean)' }
  const snd = toggle(() => !A.volumes().muted, (v) => A.setVolume('muted', !v), 'sound')
  const rm = toggle(() => lsGet(RM_KEY) === '1', (v) => lsSet(RM_KEY, v ? '1' : '0'), 'reducedMotion')
  // Lautstärken wie das ♪-Panel von WS-Audio (audioPanel.js LABELS); das Panel selbst ist im Knet-Modus ausgeblendet (lag unter der Truhe), kein Doppel
  const VOLS = [['master', 'Gesamt'], ['music', 'Musik'], ['sfx', 'Effekte'], ['atmo', 'Atmo']]
  const sliders = VOLS.map(([k]) => { const r = document.createElement('input'); r.type = 'range'; r.min = 0; r.max = 1; r.step = 0.05; r.dataset.setting = k; r.style.cssText = 'width:130px;accent-color:#8c3f2f'
    r.value = A.volumes()[k] ?? 0.7; r.addEventListener('input', () => A.setVolume(k, +r.value)); r.addEventListener('change', () => r.blur()); return r })
  const title = document.createElement('div'); title.textContent = 'Einstellungen'; title.style.cssText = 'font:400 30px/1 Bangers,Fredoka,sans-serif;letter-spacing:1px;margin-bottom:6px'
  const skin = document.createElement('button'); skin.type = 'button'; skin.dataset.setting = 'hudWood'; skin.textContent = 'Holz-HUD zum Vergleich'
  skin.style.cssText = `margin-top:8px;width:100%;padding:8px 10px;border-radius:12px;border:0;background:#e8d9b8;color:${INK};font:600 16px Fredoka,sans-serif;cursor:pointer;box-shadow:inset 0 -3px 0 rgba(0,0,0,.12)`
  skin.addEventListener('click', () => { const h = location.hash.replace(/(^#|,)hud=\w+/g, '$1').replace(/,,+/g, ',').replace(/^#,/, '#'); location.hash = (h.length > 1 ? h + ',' : '#') + 'hud=wood'; location.reload() })
  panel.append(title, ...(extra.top || []).map((r) => r({ row, INK, PAPER })), row('Entwickler-Infos', dev), row('Ton', snd), ...VOLS.map(([, l], i) => row(l, sliders[i])), row('Bewegung reduzieren', rm), skin)
  const refreshPanel = () => { extra.refresh?.(); dev.paint(); snd.paint(); rm.paint(); const v = A.volumes(); VOLS.forEach(([k], i) => { if (v[k] != null) sliders[i].value = v[k] }) }
  const offDev = onDevUi(() => dev.paint())
  const settings = (v) => { panelOpen = !!v; panel.style.display = panelOpen ? '' : 'none'; hud.setUiFlag('gear', 'on', panelOpen); if (panelOpen) refreshPanel() }
  return { panel, settings, refresh: refreshPanel, off: offDev, isOpen: () => panelOpen }
}
