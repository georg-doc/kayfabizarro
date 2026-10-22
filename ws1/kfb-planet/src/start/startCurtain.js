// MVP-Startseite (V-618 „Einstieg: Startseite mit Ladebalken, Steuerungshilfe, Ton- und Qualitätsregler“) · Georg 22.10.: KFB-Vorhang mit Bühne dafür nutzen.
// Bühne + Vorhang = KFB Clay Stage R2 (Georg 09.10.: „passt so mit TUNE für später“): Kern kfb-curtain-core.js (Issue #372, byte-gleich gepinnt in
// src/vendor/curtain, nur importiert) + Einkleidung clay-look.js (R2) + Farbrollen palette-roles.js. Host nach Vorlage R2 curtain/host.js, ohne Kamerasteuerung.
// Eigene Ebene VOR dem Spiel (eigener WebGPU-Renderer, three/webgpu 0.186 wie das Spiel): Das Spiel lädt dahinter; „Vorhang auf“ (auch der Ton-Freischalt-Klick)
// öffnet, danach blendet die Ebene aus und gibt Renderer und Speicher frei. Ohne WebGPU: Ersatz-Vorhang des Kerns (createFallbackCurtain) bzw. CSS-Vorhang.
// Bereit = Ereignis 'kfb:ready' aus M1World (Spielfigur und Gelände stehen) und Lader leer. Fortschritt aus THREE.DefaultLoadingManager.
import { DefaultLoadingManager } from 'three'
import { roles } from '../vendor/palette/palette-roles.js'
import { QUALITY, qualityKey, setQuality } from './quality.js'
import * as audio from '../audio/kfbAudio.js'
import { addHostKeyHandler } from '../hostKeys.js'
import VEHICLE_RIG from '../data/vehicles/kfb-vehicle-rig.r1.json'
import { heroEnabled, setHeroEnabled } from '../look/vehicleLook.js'

const HELP = [
  ['W A S D', 'laufen'], ['Shift', 'rennen'], ['Leertaste', 'springen'], ['F', 'fliegen'], ['Maus', 'umsehen'], ['V', 'im Auto: nächster Racer'],
]

// V-631 · Fahrzeug-Wahl: zu Fuß oder einer der 14 Racer. Im Auto wechselt der Racer hinter dem Vorhang an Ort und Stelle (Ereignis 'kfb:racer'),
// sonst setzt die Wahl car,racer=<id> in die Adresse und lädt neu (der Vorhang bleibt, 'start' steht weiter in der Adresse).
const RACERS = Object.entries(VEHICLE_RIG.vehicles).sort((a, b) => a[1].name_de.localeCompare(b[1].name_de, 'de', { numeric: true }))
const hashParts = () => location.hash.replace(/^#/, '').split(',').filter(Boolean)
const inCar = () => hashParts().includes('car')
const curRacer = () => (inCar() ? (/(^|[#,])racer=(\w+)/.exec(location.hash)?.[2] || 'crimson_flame_dragster') : '')
const CAR_OPTS = ['<option value="">zu Fuß</option>', ...RACERS.map(([id, v]) => `<option value="${id}">${v.name_de.replace(/^\d+\s/, '')}${v.class === 'hauler' ? ' (Laster)' : v.wheels ? ' (Räder)' : ''}</option>`)].join('')
function chooseCar(id) {
  const was = inCar(), parts = hashParts().filter((p) => p !== 'car' && !p.startsWith('racer='))
  if (id && was) { window.dispatchEvent(new CustomEvent('kfb:racer', { detail: { id } })); return }
  const next = id ? [...parts, 'car', 'racer=' + id] : parts
  history.replaceState(null, '', location.pathname + location.search + '#' + next.join(',')); location.reload()
}

export function mountStartCurtain({ parent = document.body, title = 'Kayfabizarro', onOpen = () => {} } = {}) {
  const pal = roles()
  const root = document.createElement('div'); root.className = 'kfb-start'
  Object.assign(root.style, { position: 'fixed', inset: '0', zIndex: '2147483000', background: `linear-gradient(180deg, ${pal.skyTop} 0%, ${pal.skyBottom} 58%, ${pal.skyBottom} 100%)`, /* gemalter Himmel statt Flachfarbe (Georg/Kritiker 22.10.: harte Horizontlinie) */ transition: 'opacity .7s ease', fontFamily: "'Shantell Sans', system-ui, sans-serif", color: '#fff8ec' })
  const stageEl = document.createElement('div'); Object.assign(stageEl.style, { position: 'absolute', inset: '0' }); root.appendChild(stageEl)
  const ui = document.createElement('div'); root.appendChild(ui)
  ui.innerHTML = `
    <style>
      @media (min-aspect-ratio: 23/20) and (min-width: 900px){ .kfb-start .panel{left:auto!important;right:24px;top:50%;bottom:auto!important;transform:translateY(-50%)!important;width:380px!important;max-height:calc(100% - 48px);overflow:auto} } /* Georg 22.10.: Tafel neben der Bühne, nicht darüber */
      .kfb-start .panel{position:absolute;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(560px,calc(100% - 32px));
        background:rgba(28,18,30,.78);border-radius:18px;padding:16px 20px;box-shadow:0 10px 40px rgba(0,0,0,.35);backdrop-filter:blur(6px)}
      .kfb-start h1{margin:0 0 6px;font-size:30px;letter-spacing:.02em;text-align:center;font-weight:800;color:${pal.bulbOn}}
      .kfb-start .bar{height:10px;border-radius:6px;background:rgba(255,255,255,.15);overflow:hidden;margin:8px 0 4px}
      .kfb-start .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,${pal.accent},${pal.bulbOn});transition:width .3s}
      .kfb-start .row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:10px;font-size:14px}
      .kfb-start .help{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;font-size:13px;opacity:.9;margin-top:8px}
      .kfb-start .help b{font-family:ui-monospace,Menlo,monospace;font-weight:600}
      .kfb-start .q button{border:0;border-radius:10px;padding:6px 10px;margin-right:4px;background:rgba(255,255,255,.14);color:inherit;font:inherit;cursor:pointer}
      .kfb-start .q button[aria-pressed=true]{background:${pal.accent};color:#fff}
      .kfb-start .go{display:block;width:100%;margin-top:14px;border:0;border-radius:14px;padding:12px;font:inherit;font-size:20px;font-weight:800;cursor:pointer;
        background:${pal.bulbOn};color:#2a1a20}
      .kfb-start .go[disabled]{opacity:.55;cursor:wait}
      .kfb-start input[type=range]{width:160px}
      .kfb-start select{border:0;border-radius:10px;padding:6px 10px;background:rgba(255,255,255,.14);color:inherit;font:inherit}
      .kfb-start select option{color:#2a1a20}
      .kfb-start .note{font-size:12px;opacity:.7;text-align:center;margin-top:6px}
    </style>
    <div class="panel" role="dialog" aria-label="${title} starten">
      <h1>${title}</h1>
      <div class="bar" aria-hidden="true"><i></i></div>
      <div class="note" data-k="msg">Die Welt lädt …</div>
      <div class="help">${HELP.map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('')}</div>
      <div class="row"><label for="kfb-vol">Ton</label><input id="kfb-vol" type="range" min="0" max="100" step="1"><span data-k="vol"></span></div>
      <div class="row"><label for="kfb-car">Fahrzeug</label><select id="kfb-car">${CAR_OPTS}</select></div>
      <div class="row q" role="group" aria-label="Fahrzeugfarbe"><span>Fahrzeugfarbe</span><button data-hero="0">Original</button><button data-hero="1">Heldenfarbe</button></div>
      <div class="row q" role="group" aria-label="Qualität"><span>Qualität</span>${Object.entries(QUALITY).map(([k, q]) => `<button data-q="${k}">${q.label}</button>`).join('')}</div>
      <button class="go" disabled>Lädt …</button>
    </div>`
  parent.appendChild(root)
  const $ = (s) => ui.querySelector(s), bar = $('.bar i'), msg = $('[data-k=msg]'), go = $('.go'), vol = $('#kfb-vol'), volOut = $('[data-k=vol]')

  // Ton und Qualität
  const v0 = Math.round((audio.volumes?.().master ?? 0.9) * 100); vol.value = String(v0); volOut.textContent = v0 + ' %'
  vol.addEventListener('input', () => { audio.setVolume?.('master', +vol.value / 100); volOut.textContent = vol.value + ' %' })
  const markQ = (k) => ui.querySelectorAll('[data-q]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.q === k)))
  markQ(qualityKey()); ui.querySelectorAll('[data-q]').forEach((b) => b.addEventListener('click', () => { setQuality(b.dataset.q); markQ(b.dataset.q) }))

  // Heldenfarbe (Georg 22.10.: Standard Original, Heldenfarbe als Einstellung): gemerkt je Browser, schaltet geladene Racer sofort um (Ereignis kfb:hero)
  const markHero = (on) => ui.querySelectorAll('[data-hero]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.hero === '1') === on)))
  markHero(heroEnabled()); ui.querySelectorAll('[data-hero]').forEach((b) => b.addEventListener('click', () => { const on = b.dataset.hero === '1'; setHeroEnabled(on); markHero(on) }))
  const car = $('#kfb-car'); car.value = curRacer(); car.addEventListener('change', () => chooseCar(car.value))

  // Fortschritt: Lader-Zähler + Bereitschaft des Spiels
  const S = { loaded: 0, total: 0, ready: false, want: false, opened: false, stage: null, mode: 'loading' }
  const prev = { onProgress: DefaultLoadingManager.onProgress, onStart: DefaultLoadingManager.onStart }
  DefaultLoadingManager.onStart = (u, l, t) => { S.loaded = l; S.total = Math.max(S.total, t); prev.onStart?.(u, l, t); paint() }
  DefaultLoadingManager.onProgress = (u, l, t) => { S.loaded = l; S.total = Math.max(S.total, t); prev.onProgress?.(u, l, t); paint() }
  const onReady = () => { S.ready = true; paint(); if (S.want) open() }
  window.addEventListener('kfb:ready', onReady)
  function paint() {
    const f = S.ready ? 1 : S.total ? Math.min(0.95, S.loaded / S.total) : 0.05
    bar.style.width = Math.round(f * 100) + '%'
    msg.textContent = S.ready ? 'Bereit.' : `Die Welt lädt … ${Math.round(f * 100)} %`
    go.disabled = !S.ready && !S.want ? false : S.want && !S.ready
    go.textContent = S.ready ? 'Vorhang auf!' : S.want ? 'Gleich geht’s los …' : 'Vorhang auf (lädt noch)'
  }
  paint()

  // Bühne + Vorhang (WebGPU) oder Ersatz
  ;(async () => {
    try {
      const core = await import('../vendor/curtain/kfb-curtain-core.js')
      if (!core.isSupported()) throw new Error('kein WebGPU')
      const THREE = await import('three/webgpu')
      const { dressClay } = await import('../vendor/curtain/clay-look.js')
      const renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true, requiredLimits: { maxStorageBuffersInVertexStage: 1 } }); await renderer.init()
      renderer.setPixelRatio(Math.min(1.5, devicePixelRatio)); renderer.toneMapping = THREE.NeutralToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap
      const cv = renderer.domElement; Object.assign(cv.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }); stageEl.appendChild(cv)
      const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, 0.05, 60); scene.background = null; renderer.setClearColor(0x000000, 0) /* Himmel kommt aus dem CSS-Verlauf */
      const curtain = core.createTheatreCurtain({ material: 'P', hardware: 'none', proscenium: false, floor: false, footlights: true }); scene.add(curtain.group)
      const look = dressClay(curtain, pal); look.setFootlights(1)
      /* WS0 V-683 (Georg 22.10.): graue Säulen vorerst weglassen. clay-look ist byte-gleich (WS0) → hier nach dem Aufbau: Teilstücke, deren Mitte links/rechts
         vor den Portalbeinen liegt (Säulen x ≈ ±1,88, z ≈ −0,86: Sockel, Schaft, Kapitell, Deckplatte), auf einen Punkt zusammenfallen lassen */
      curtain.group.traverse((o) => { const R = o.isMesh && o.userData?.ranges, P = R && o.geometry.attributes.position; if (!P) return; let hit = false
        for (const r of R) { let cx = 0, cz = 0; for (let i = r.start; i < r.start + r.n; i++) { cx += P.getX(i); cz += P.getZ(i) } cx /= r.n; cz /= r.n
          if (Math.abs(cx) > 1.5 && Math.abs(cx) < 2.4 && cz > -1.25 && cz < -0.5) { for (let i = r.start; i < r.start + r.n; i++) P.setXYZ(i, 0, -50, 0); hit = true } }
        if (hit) { P.needsUpdate = true; o.geometry.computeBoundingSphere() } })
      // Licht wie die Vorlage R2 (warmes Führungslicht, kühle Kante, Himmel/Tisch-Fülle)
      const hemi = new THREE.HemisphereLight('#fff3e2', pal.table, 0.75); scene.add(hemi)
      const key = new THREE.SpotLight('#ffe6c8', 60, 16, 0.5, 0.6, 1.5); key.position.set(1.2, 3.6, -4.6); key.target.position.set(0, -0.3, -0.2); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; scene.add(key, key.target)
      const rim = new THREE.SpotLight('#cfe0ff', 12, 10, 0.6, 0.8, 1.5); rim.position.set(-2.8, 2.6, -2.0); scene.add(rim, rim.target)
      // Prospekt hinter dem Vorhang wie die Vorlage R2 (gemalter Himmel in der Palette) + Innenlicht – beim Öffnen sieht man eine Bühne, nicht Leere
      const TSL = await import('three/tsl'), skyM = new THREE.MeshBasicNodeMaterial(); skyM.colorNode = TSL.mix(TSL.uniform(new THREE.Color(pal.skyBottom)), TSL.uniform(new THREE.Color(pal.skyTop)), TSL.smoothstep(0.05, 0.95, TSL.uv().y))
      const back = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.7), skyM); back.position.set(0, 0.2, 1.95); back.rotation.y = Math.PI; scene.add(back)
      const inner = new THREE.SpotLight('#fff1dc', 30, 8, 0.55, 0.7, 1.6); inner.position.set(0, 2.4, 0.3); inner.target.position.set(0, curtain.DIM.floorY, 0.8); scene.add(inner, inner.target)
      const table = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: pal.table, roughness: 0.95 })); table.rotation.x = -Math.PI / 2; table.position.y = curtain.DIM.floorY - 0.39; table.receiveShadow = true; scene.add(table)
      // Ansicht nach Vorlage „frame“ (6,6 × 4,8 m), etwas weiter und tiefer gezielt: die Bühne sitzt oben, die Start-Tafel unten frei
      const fit = () => { const w = root.clientWidth || 2, h = root.clientHeight || 2; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
        const dock = w / h >= 1.15 && w >= 900, P = dock ? 380 + 48 : 0, effA = (w - P) / h   /* Tafel rechts angedockt: Bühne mittig im freien Teil links */
        const f = camera.fov * Math.PI / 180, d = Math.max(dock ? 6.4 : 7.2, (dock ? 7.4 : 8.6) / Math.min(effA, camera.aspect)) / (2 * Math.tan(f / 2)), dir = new THREE.Vector3(0, 0.08, -1).normalize(), at = new THREE.Vector3(0, 0.45, -0.45)
        scene.fog = new THREE.Fog(pal.skyBottom, d + 2.5, d + 16)   /* Boden läuft weich in den Horizont-Ton aus (keine harte Kante) */   /* Ansicht „frame“ der Vorlage, Bühne im oberen Teil, Tafel darunter */
        camera.position.copy(at).addScaledVector(dir, d); camera.lookAt(at); if (dock) camera.setViewOffset(w + P, h, P, 0, w, h); else camera.setViewOffset(w, h, 0, Math.round(h * 0.15), w, h) }   /* Bild um 20 % nach oben geschoben (gleiche Perspektive): die Tafel unten verdeckt die Bühne nicht */   /* wie Vorlage: pos = at + dir·d (Publikum auf −z) */
      const ro = new ResizeObserver(fit); ro.observe(root); fit()
      curtain.warmup(renderer, 900)
      curtain.onState((s) => { if (s === 'open_rest' && S.want) finish() })
      let last = performance.now()
      renderer.setAnimationLoop(() => { const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; curtain.update(renderer, dt); renderer.render(scene, camera) })
      S.stage = { reveal: () => curtain.requestReveal(), dispose: () => { renderer.setAnimationLoop(null); ro.disconnect(); look.dispose?.(); renderer.dispose(); cv.remove() } }
      S.mode = 'webgpu'
    } catch (e) {
      // Ersatz ohne WebGPU: zwei Stoffbahnen in der Vorhangfarbe, die zur Seite gleiten
      const mk = (side) => { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', top: '0', bottom: '0', width: '51%', [side]: '0', transition: 'transform 1.1s cubic-bezier(.6,.05,.3,1)',
        background: `repeating-linear-gradient(90deg, ${pal.cloth} 0 34px, ${pal.clothFade} 34px 46px, ${pal.cloth} 46px 80px)`, boxShadow: 'inset 0 -40px 60px rgba(0,0,0,.35)' }); stageEl.appendChild(d); return d }
      const L = mk('left'), R = mk('right')
      S.stage = { reveal: () => { L.style.transform = 'translateX(-100%)'; R.style.transform = 'translateX(100%)'; setTimeout(finish, 1150) }, dispose: () => { L.remove(); R.remove() } }
      S.mode = 'css'; S.fallbackWhy = String(e?.message || e)
    }
  })()

  function open() { if (S.opened) return; S.opened = true; S.stage ? S.stage.reveal() : finish() }
  function finish() {
    if (S.finished) return; S.finished = true
    root.style.opacity = '0'; root.style.pointerEvents = 'none'
    setTimeout(() => { S.stage?.dispose(); offKey(); window.removeEventListener('kfb:ready', onReady); DefaultLoadingManager.onStart = prev.onStart; DefaultLoadingManager.onProgress = prev.onProgress; root.remove(); onOpen() }, 750)
  }
  const panel = ui.querySelector('.panel'); panel.style.transition = 'opacity .45s ease'
  go.addEventListener('click', () => { audio.unlock?.(); S.want = true; paint(); if (S.ready) { panel.style.opacity = '0'; open() } })
  window.addEventListener('kfb:ready', () => { if (S.want) panel.style.opacity = '0' })
  const offKey = addHostKeyHandler({ current: (e) => { if (S.finished) return; if (e.key === 'Enter') { e.preventDefault(); if (!S.want) go.click() } } }, 50)   /* Enter = Vorhang auf; nur über hostKeys (Vertrag: ein Tasten-Listener) */
  return { state: () => ({ ...S, stage: !!S.stage }), open: () => go.click() }
}
