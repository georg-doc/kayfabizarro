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
import { createHud3d, hasHud3dAssets, INK as INK3 } from './hud/hud3d' // HUD 3D R1 (hud=3d, Spike-Paket 1): gleiche Hülle, andere Bausteine
import { HUD_PASS } from './hud/hudPass'
import { DEVUI, setDevUi, onDevUi, devUiLocked, expose } from './debug'
import { useHostKeys, ACTION_KEYS, PRIO } from './hostKeys'
import { M2EVENTS } from './m2/M2Car'
import * as A from './audio/kfbAudio'

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
    const hud = K3 ? createHud3d({ reducedMotion }) : createClayHud({
      palette: () => host.palette?.(), speed: () => S.kmh, heading: () => S.heading, mapPos: () => S.prev,
      mapSample: (x, z) => mapColor(host, x, z), mapMarks: () => host.marks?.() || [], path: host.path || [],
      nowPlaying: () => (A.musicPaused?.() ? { title: 'Pause' } : A.nowPlaying()), audioOn: () => !A.volumes().muted, reducedMotion,
    })
    clay.current = hud; HUD_PASS.draw = (gl) => hud.draw(gl);
    document.fonts?.load?.('104px Bangers').then(() => hud.refreshTicker?.(), () => {})
    if (!K3) host.cards?.().then((cv) => { if (cv?.length) hud.setCards(cv) }, () => {})
    const offs = ['landing', 'railImpact', 'takeoff', 'boost'].map((t) => M2EVENTS.on(t, (e) => hud.event(e)))
    dom.current = K3 ? buildDom3d(hud, inner) : buildDom(hud, inner, () => clay.current)
    expose('ClayHud', { kit, status: () => hud.status(), rects: () => hud.rects(), radioButtons: () => hud.radioButtons?.() || {}, goal: (g) => { GOAL.dbg = g === undefined ? GOAL.dbg : g; return GOAL.dbg },
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
    hud.update(dt, { yawRate: S.yawRate, accel: S.accel })
    dom.current?.sync()
    const I = inner.current; if (I) { const open = I.bagOpen(); if (open !== dom.current?.bagWas) { dom.current.bagWas = open; hud.setChestOpen(open) } }
  })

  // Esc schließt die Settings-Tafel (Tastatur nur über hostKeys)
  useHostKeys((e) => { if (e.code === ACTION_KEYS.close && dom.current?.settingsOpen()) { dom.current.settings(false); e.preventDefault() } }, PRIO.choice + 1)

  const wrap = (a) => {
    inner.current = a
    if (!a) { onApi?.(null); return }
    const fam = { w: a.weapon?.() || 'fist' }
    const flash = (txt) => dom.current?.flash(txt)
    onApi?.({ ...a,
      land: (i, n = 1) => { a.land(i, n); const hud = clay.current; if (hud) { hud.land(i, n); if (K3) hud.setCounts(a.counts()); else hud.setScore(a.counts().reduce((s, x) => s + x, 0)) } },
      setWeapon: (w) => { a.setWeapon(w); if (w !== fam.w) { fam.w = w; if (!a.activeWeapon?.()) flash(FAM_NAME[w] || w) } },
      setActiveWeapon: (wid) => { const was = a.activeWeapon?.(); a.setActiveWeapon(wid); if (wid !== was) flash(wid ? (a.weapons?.().find((x) => x.wid === wid)?.n || wid) : 'Faust') },
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
    gear: btn('Einstellungen', () => { hud.tapGear(); settings(!panelOpen) }, 'gear'),
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
  // Settings-Tafel (Papier, Knet-Akzent über die Palette des HUD)
  const panel = document.createElement('div'); panel.id = 'kfb-hud-settings'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Einstellungen')
  panel.style.cssText = `position:absolute;display:none;pointer-events:auto;min-width:300px;padding:16px 18px 14px;border-radius:20px;background:${PAPER};color:${INK};box-shadow:0 5px 0 rgba(31,26,20,.28),0 12px 28px rgba(31,26,20,.22);font:500 18px/1.3 Fredoka,sans-serif`
  root.append(panel)
  let panelOpen = false
  const row = (label, ctl) => { const r = document.createElement('label'); r.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:18px;padding:8px 0;cursor:pointer'; const s = document.createElement('span'); s.textContent = label; r.append(s, ctl); return r }
  const toggle = (get, set, name) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.setting = name; b.setAttribute('role', 'switch')
    const paint = () => { const on = get(); b.setAttribute('aria-checked', on ? 'true' : 'false'); const acc = getHud()?.status().zones?.accent || '#c9508f'; b.style.cssText = `width:54px;height:30px;border-radius:15px;border:0;cursor:pointer;position:relative;background:${on ? acc : '#cbbfa6'};box-shadow:inset 0 -3px 0 rgba(0,0,0,.18);transition:background .2s`; b.innerHTML = `<span style="position:absolute;top:3px;left:${on ? 27 : 3}px;width:24px;height:24px;border-radius:50%;background:#fff8e8;box-shadow:0 2px 0 rgba(0,0,0,.2);transition:left .2s"></span>` }
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
  panel.append(title, row('Entwickler-Infos', dev), row('Ton', snd), ...VOLS.map(([, l], i) => row(l, sliders[i])), row('Bewegung reduzieren', rm), skin)
  const refreshPanel = () => { dev.paint(); snd.paint(); rm.paint(); const v = A.volumes(); VOLS.forEach(([k], i) => { if (v[k] != null) sliders[i].value = v[k] }) }
  const offDev = onDevUi(() => dev.paint())
  const settings = (v) => { panelOpen = !!v; panel.style.display = panelOpen ? '' : 'none'; hud.setUiFlag('gear', 'on', panelOpen); if (panelOpen) refreshPanel() }
  let last = ''
  document.body.appendChild(root)
  return {
    bagWas: false,
    flash, settings, settingsOpen: () => panelOpen,
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
function buildDom3d(hud, inner) {
  const root = document.createElement('div'); root.id = 'kfb-hud-clay'; root.dataset.kit = '3d'
  root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:8991;font-family:Fredoka,system-ui,sans-serif'
  const css = document.createElement('style'); css.textContent = '#kfb-audio-panel{display:none!important}'; document.head.appendChild(css) // ♪-Panel lag unter der Truhe; Kassette folgt im nächsten Paket
  const btn = (label, onClick, key) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', label); b.title = label; b.dataset.ui = key
    b.style.cssText = 'position:absolute;pointer-events:auto;background:transparent;border:0;border-radius:50%;cursor:pointer;padding:0;outline-offset:2px'
    b.addEventListener('click', (e) => { e.stopPropagation(); onClick(); b.blur() }); const F = (f, v) => () => hud.setUiFlag(key, f, v)
    b.addEventListener('pointerenter', F('hover', true)); b.addEventListener('pointerleave', () => { hud.setUiFlag(key, 'hover', false); hud.setUiFlag(key, 'pressed', false) })
    b.addEventListener('pointerdown', F('pressed', true)); b.addEventListener('pointerup', F('pressed', false)); b.addEventListener('pointercancel', F('pressed', false))
    b.addEventListener('focus', () => hud.setUiFlag(key, 'focus', b.matches(':focus-visible'))); b.addEventListener('blur', F('focus', false))
    root.append(b); return b }
  const hits = {
    chest: btn('Truhe öffnen', () => { const I = inner.current; if (!I) return; if (I.bagOpen()) I.closeBag(); else { I.openBag(); if (!I.bagOpen()) hud.event({ type: 'landing', strength: 0.25 }) } hud.setChestOpen(I.bagOpen()) }, 'chest'),
    arrow: btn('Ziel', () => {}, 'arrow'), // Karte und Zielwahl (Flyout L2) folgen im nächsten Paket
  }
  const lab = document.createElement('div'); lab.id = 'kfb-hud3d-label'; lab.style.cssText = 'position:absolute;transform:translateX(50%);display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none'
  const nm = document.createElement('div'), row = document.createElement('div'), dv = document.createElement('span'), ds = document.createElement('span')
  row.style.cssText = 'display:flex;gap:8px;align-items:baseline'; row.append(dv, ds); lab.append(nm, row); root.append(lab)
  const fl = document.createElement('div'); fl.id = 'kfb-hud-clay-flash'
  fl.style.cssText = `position:absolute;padding:6px 14px;border-radius:14px;background:${PAPER};color:${INK};font:600 20px/1.1 Fredoka,sans-serif;box-shadow:0 3px 0 rgba(31,26,20,.25),0 6px 14px rgba(31,26,20,.18);opacity:0;transform:translate(-50%,6px);transition:opacity .2s,transform .2s;white-space:nowrap`
  root.append(fl); let flT = 0
  const flash = (txt) => { fl.textContent = txt; fl.style.opacity = '1'; fl.style.transform = 'translate(-50%,0)'; clearTimeout(flT); flT = setTimeout(() => { fl.style.opacity = '0'; fl.style.transform = 'translate(-50%,6px)' }, 1500) }
  document.body.appendChild(root)
  let last = '', lastLab = ''
  return {
    bagWas: false, flash, settings() {}, settingsOpen: () => false,
    sync() {
      hud.setUiFlag('chest', 'on', hud.opened().chest)
      const R = hud.rects(), v = hud.view(), L = hud.labelLayout(), t = hud.label(), key = JSON.stringify([R, v.W, v.H]) 
      if (key !== last) { last = key
        for (const [k, b] of Object.entries(hits)) { const r = R[k]; if (!r) continue; const ins = 0.14; Object.assign(b.style, { left: r.x + r.w * ins + 'px', top: r.y + r.h * ins + 'px', width: r.w * (1 - 2 * ins) + 'px', height: r.h * (1 - 2 * ins) + 'px' }) }
        Object.assign(lab.style, { right: L.right * v.k + 'px', top: L.top * v.k + 'px' })
        const c = R.chest; if (c) Object.assign(fl.style, { left: c.x + c.w / 2 + 'px', top: Math.max(8, c.y - 40) + 'px' }) }
      const lk = t ? [t.name, t.dist, t.dv, v.k].join('|') : ''
      if (lk !== lastLab) { lastLab = lk; lab.style.display = t ? 'flex' : 'none'; hits.arrow.style.display = t ? '' : 'none'
        if (t) { nm.style.cssText = inkText(Math.round(L.fs * v.k)); nm.textContent = (t.name || '').toUpperCase(); dv.style.cssText = inkText(Math.round(L.fs * v.k), '#bfe8ff'); dv.textContent = t.dv || ''
          ds.style.cssText = inkText(Math.round(L.fd * v.k)); ds.textContent = t.dist || ''; hits.arrow.setAttribute('aria-label', 'Ziel ' + t.name + ', ' + (t.dist || 'angekommen')) } }
    },
    remove() { clearTimeout(flT); root.remove(); css.remove() },
    el: root,
  }
}
