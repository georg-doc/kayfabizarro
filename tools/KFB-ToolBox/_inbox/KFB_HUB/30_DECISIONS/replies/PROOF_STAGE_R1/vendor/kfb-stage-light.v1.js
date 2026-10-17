// KFB Stage Light v1 · kfb.stage-light/1 · ein Licht für alle Bühnen (V-392, Licht-Modell R2 = V-385/V-386, Fehlerliste V-393 Stufe 0 Zeile 2)
// Besitzer WS1 (L3). Vendorbar: nur three als Abhängigkeit, kein React, kein Store, keine Fenster-Listener. Bühnen (WS1, WSB, ToolBox, Claude-Design-Bühne)
// importieren diese Datei unverändert; kein eigenes Licht daneben bauen.
// Inhalt:
//   createStageLight(opts)  Rig als Modul nach Host-Vertrag R1.2: Sonne (einziger Schattenwerfer), Hemisphäre (Boden = edgePalette der Bühne),
//                           ein warmes, weiches, schattenloses Figurenlicht von vorn-oben auf der Kameraseite (Regel 11). Kein Rand-, kein Gegenlicht (V-392).
//                           Stimmungen Tag/Gold/Nacht sind Einstellungen dieses Rigs (MOODS), timeOfDay 0..1 stufenlos (0 Nacht, 0,5 Gold, 1 Tag).
//   fitShadow(light, fit)   Frustum auf den Inhalt (Kugel: Mitte + Radius), Mittelpunkt auf das Texelraster gerastet, enger Tiefenbereich,
//                           normalBias = 1,5 × Texel, bias aus Texel und Tiefenbereich abgeleitet (nie eine feste Zahl, Fehler F5).
//   createContactAO(opts)   Kontaktverdeckung am Boden für Figuren, Fahrzeuge und Props: weicher Fleck in Größe der Grundfläche, an der Boden-Normale
//                           ausgerichtet, Verlauf ohne dunklen Ring. Teile, die ineinander stecken (Kopf/Hals), bleiben bei makeContactAO (kfb-lib, gebacken).
//   applyTone(gl, name)     ein Tonemapping für alle Schichten (Regel 5), feste Belichtung 1; kein toneSplit.
//   selfTest(gl)            Spalt-Prüfung: Kugel und Kiste auf einer Ebene, gerendert mit fitShadow; misst die Helligkeit direkt an der Kontaktlinie
//                           gegen den Schatten daneben (Spalt = 0 heißt: kein heller Saum zwischen Teil und Schatten).
// Werte: Tag = J17 (track-look.v5 Z. 126–129, WSA_LIGHT_STUDY_C_R1: Elevation 48,99°, Azimut −53,13°). Gold und Nacht nach LIGHT_MODEL_R2-Tabelle;
// die Zahlen dafür sind WS1-Startwerte (PROPOSED), abgestimmt an der Messung L-1…L-9.
import * as THREE from 'three'

export const SCHEMA = 'kfb.stage-light/1'
// Stimmungen. sun = Hauptlicht (Tag Sonne, Nacht Mond), hemiSky = Füllung von oben, hemiI = Füllstärke, figI = Beleuchtungsstärke des Figurenlichts
// am Gesicht (lx-artig, wie die Sonne), skyL = Helligkeit des Himmels relativ zur Palette, glow = Gewicht für Leuchtköpfe/Praktische.
export const MOODS = Object.freeze({
  day: { sun: '#fff4e6', sunI: 2.9, elev: 48.99, az: -53.13, hemiSky: '#eef4fa', hemiI: 1.05, bounce: 1, figI: 0.35, figColor: '#ffd9b0', skyL: 1, glow: 0, src: 'J17' },
  // Gold: tiefe, warme Sonne, Füllung KÜHLER als am Tag (nicht wärmer, nicht dunkler: V-050), Himmel dunkler; Figurenlicht mittel
  gold: { sun: '#ffb877', sunI: 2.5, elev: 14, az: -53.13, hemiSky: '#dbe6fb', hemiI: 1.05, bounce: 1, figI: 0.8, figColor: '#ffcf9e', skyL: 0.82, glow: 0.35, src: 'R2 + PROPOSED' },
  // Nacht nach KayKit: dieselbe Szene dunkler, Mond kühl und schwach, Hemisphäre dunkelblau; Figurenlicht trägt die Gesichter, Praktische sind Inseln
  night: { sun: '#a9bcff', sunI: 0.45, elev: 38, az: -53.13, hemiSky: '#43507e', hemiI: 0.55, bounce: 1, figI: 1.5, figColor: '#ffc890', skyL: 0.3, glow: 1, src: 'R2 + PROPOSED' },
})
// Gemütlich (Georg 17.10. zum ersten L3-Bild: „viel zu hell und überstrahlt, keine gemütliche, warme Stimmung“): dieselben Regeln, aber wärmere, etwas
// schwächere und tiefere Sonne, weniger Füllung, Boden-Rückstrahlung gedunkelt (bounce), wärmere Gold-Sonne mit kühler Füllung. WS1-Vorschlag, Georg wählt.
export const MOODS_COZY = Object.freeze({
  day: { sun: '#ffe4bd', sunI: 2.3, elev: 40, az: -53.13, hemiSky: '#dfe6ef', hemiI: 0.72, bounce: 0.55, figI: 0.3, figColor: '#ffd0a0', skyL: 0.94, glow: 0, src: 'COZY' },
  gold: { sun: '#ffa25a', sunI: 2.2, elev: 12, az: -53.13, hemiSky: '#c7d4ef', hemiI: 0.75, bounce: 0.5, figI: 0.7, figColor: '#ffc690', skyL: 0.78, glow: 0.4, src: 'COZY' },
  night: { sun: '#9fb2f0', sunI: 0.35, elev: 38, az: -53.13, hemiSky: '#36416a', hemiI: 0.45, bounce: 0.4, figI: 1.3, figColor: '#ffc088', skyL: 0.28, glow: 1, src: 'COZY' },
})
// Mesa (Georg 17.10.: Grundstimmung wie die farbigen Krazy-Kat-Sonntagsseiten, New Mexico/Arizona, Mesas, warme Sommertage, laue Abende):
// warme Sonne, Füllung lavendel-violett (Schatten werden violett statt grau, wie im Painted-Desert-Licht), warme, gedämpfte Boden-Rückstrahlung;
// Gold = tiefe orange Sonne mit violetter Füllung; Nacht indigo-violett. Himmel dazu: SKY_TINT.mesa (stageLight.js). WS1-Vorschlag, Georg urteilt am Bild.
export const MOODS_MESA = Object.freeze({
  day: { sun: '#ffdcae', sunI: 2.4, elev: 38, az: -53.13, hemiSky: '#b4bdee', hemiI: 0.82, bounce: 0.5, figI: 0.3, figColor: '#ffcf9c', skyL: 1, glow: 0, src: 'MESA' },
  gold: { sun: '#ff9246', sunI: 2.3, elev: 11, az: -53.13, hemiSky: '#9c9be2', hemiI: 0.82, bounce: 0.48, figI: 0.7, figColor: '#ffc28a', skyL: 0.8, glow: 0.4, src: 'MESA' },
  night: { sun: '#93a6ee', sunI: 0.35, elev: 38, az: -53.13, hemiSky: '#3b3878', hemiI: 0.5, bounce: 0.4, figI: 1.7, figColor: '#ffbf86', skyL: 0.28, glow: 1, src: 'MESA' },
})
export const MOOD_SETS = Object.freeze({ r2: null, cozy: MOODS_COZY, mesa: MOODS_MESA }) // r2 = MOODS (J17-Tag)
export const TOD = Object.freeze({ night: 0, gold: 0.5, day: 1 })
export const TONES = Object.freeze({ aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping, agx: THREE.AgXToneMapping, none: THREE.NoToneMapping })

const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4), srgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055)
const toHex = (c) => '#' + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')
export const mixHex = (a, b, k) => toHex(hx(a).map((v, i) => srgb(lin(v) + (lin(hx(b)[i]) - lin(v)) * k)))
const ease = (u) => u * u * (3 - 2 * u)
const mixMood = (A, B, k) => { const o = {}; for (const key of Object.keys(A)) o[key] = typeof A[key] === 'number' ? A[key] + (B[key] - A[key]) * k : typeof A[key] === 'string' && A[key][0] === '#' ? mixHex(A[key], B[key], k) : k < 0.5 ? A[key] : B[key]; return o }
// timeOfDay 0..1 → Rig-Werte (stückweise, weich an den Ankern)
export function moodAt(tod = 1, set = MOODS) {
  const t = Math.min(1, Math.max(0, tod)), S = set || MOODS
  const M = t <= 0.5 ? mixMood(S.night, S.gold, ease(t / 0.5)) : mixMood(S.gold, S.day, ease((t - 0.5) / 0.5))
  return { ...M, tod: t, sunDir: sunDirection(M.elev, M.az) }
}
// Richtung ZUM Licht (Einheitsvektor), Azimut ab +Z, positiv Richtung +X
export function sunDirection(elevDeg, azDeg) { const e = (elevDeg * Math.PI) / 180, a = (azDeg * Math.PI) / 180; return [Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)] }
export function parseTod(hash) { const m = /tod=([\w.]+)/.exec(hash || ''); if (!m) return 1; return m[1] in TOD ? TOD[m[1]] : Math.min(1, Math.max(0, parseFloat(m[1]) || 1)) }
// Schattenlänge je Meter Höhe = 1 / tan(Sonnenhöhe) (V-346 Punkt 2; Richtung = Gegenrichtung des Azimuts)
export const shadowLength = (elevDeg) => 1 / Math.tan((Math.max(1, elevDeg) * Math.PI) / 180)

// Sonnenschatten auf den Inhalt einpassen. fit = { center: {x,y,z}, radius } (m). Liefert { center, texel, near, far }.
export function fitShadow(light, fit, { sunDir, margin = 1 } = {}) {
  const d = sunDir, r = Math.max(0.5, fit.radius), C = fit.center
  const f = [-d[0], -d[1], -d[2]], up = Math.abs(f[1]) > 0.99 ? [0, 0, 1] : [0, 1, 0]
  const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l) }
  const R = nrm(cr(up, f)), U = cr(f, R), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const map = light.shadow?.mapSize?.x || 2048, texel = (2 * r) / map, T = [C.x, C.y, C.z]
  const pr = dot(T, R), pu = dot(T, U), sr = Math.round(pr / texel) * texel - pr, su = Math.round(pu / texel) * texel - pu
  const c = [T[0] + R[0] * sr + U[0] * su, T[1] + R[1] * sr + U[1] * su, T[2] + R[2] * sr + U[2] * su]
  const dist = r + margin // Licht sitzt knapp außerhalb der Kugel: enger Tiefenbereich [0, 2r + 2·margin]
  light.target.position.set(c[0], c[1], c[2]); light.target.updateMatrixWorld?.()
  light.position.set(c[0] + d[0] * dist, c[1] + d[1] * dist, c[2] + d[2] * dist)
  const near = 0.05, far = 2 * dist, cam = light.shadow?.camera
  if (cam && (cam.right !== r || cam.far !== far)) { Object.assign(cam, { left: -r, right: r, top: r, bottom: -r, near, far }); cam.updateProjectionMatrix?.() }
  if (light.shadow) { light.shadow.normalBias = 1.5 * texel; light.shadow.bias = -(0.5 * texel) / (far - near) } // abgeleitet aus Texel und Tiefenbereich
  return { center: c, texel, near, far }
}

// Ein Tonemapping für alle Schichten, feste Belichtung (Regel 5)
export function applyTone(gl, name = 'aces', exposure = 1) { const prev = { tm: gl.toneMapping, ex: gl.toneMappingExposure }; gl.toneMapping = TONES[name] ?? TONES.aces; gl.toneMappingExposure = exposure; return () => { gl.toneMapping = prev.tm; gl.toneMappingExposure = prev.ex } }

// Rig als Modul. opts:
//   tod: () => 0..1 · groundColor: () => '#rrggbb' (edgePalette-Boden der Bühne; Hemi-Boden, ersetzt faceFill als Aufhellung von unten)
//   fit: () => { center, radius } (Schattenbereich, m) · figures: () => [Modul mit object3d] (Dialog-Gruppe) · figureLight = { distance, up (m), face (Anteil der Höhe), angle, penumbra }
//   mapSize = 2048
export function createStageLight({ tod = () => 1, moods = MOODS, groundColor = () => '#9a8a78', fit = () => ({ center: { x: 0, y: 0, z: 0 }, radius: 8 }), figures = () => [], figureLight = {}, mapSize = 2048 } = {}) {
  const FL = { distance: 3.4, up: 2.2, face: 0.8, angle: 1.15, penumbra: 0.7, ...figureLight } // face = Zielhöhe als Anteil der Gruppenhöhe (Gesichter)
  const root = new THREE.Group(); root.name = 'kfb-stage-light'
  const sun = new THREE.DirectionalLight('#ffffff', 1); sun.name = 'sun'; sun.castShadow = true; sun.shadow.mapSize.set(mapSize, mapSize); root.add(sun, sun.target)
  const hemi = new THREE.HemisphereLight('#ffffff', '#888888', 1); hemi.name = 'hemi'; root.add(hemi)
  // Figurenlicht: weicher Spot, schattenlos, Abfall physikalisch (decay 2) → fällt leicht auch auf den Boden um die Figur, Glanzpunkt in den Augen
  const fig = new THREE.SpotLight('#ffd9b0', 0, 0, FL.angle, FL.penumbra, 2); fig.name = 'figure-light'; fig.castShadow = false; root.add(fig, fig.target)
  const state = { mood: null, fit: null, figTarget: null }
  const box = new THREE.Box3(), cam = new THREE.Vector3(), mid = new THREE.Vector3(), dir = new THREE.Vector3()
  return {
    object3d: root,
    lights: { sun, hemi, figure: fig },
    update(dt, ctx) {
      const M = moodAt(tod(), moods); state.mood = M
      sun.color.set(M.sun); sun.intensity = M.sunI; state.fit = fitShadow(sun, fit(), { sunDir: M.sunDir })
      hemi.color.set(M.hemiSky); hemi.groundColor.set(groundColor() || '#9a8a78').multiplyScalar(M.bounce ?? 1); hemi.intensity = M.hemiI
      // Figurenlicht auf die Mitte der Dialog-Gruppe, von vorn-oben auf der Kameraseite; Stärke so, dass am Gesicht ≈ figI ankommt (E = I / d²)
      const fs = (figures() || []).filter((a) => a?.object3d && a.status?.().shown !== false)
      if (!fs.length || !ctx?.camera) { fig.intensity = 0; return }
      box.makeEmpty(); fs.forEach((a) => box.expandByObject(a.object3d)); box.getCenter(mid); const h = box.max.y - box.min.y
      ctx.camera.getWorldPosition(cam); dir.copy(cam).sub(mid).setY(0).normalize()
      const aim = new THREE.Vector3(mid.x, box.min.y + h * FL.face, mid.z)
      fig.position.copy(aim).addScaledVector(dir, FL.distance).setY(aim.y + FL.up); fig.target.position.copy(aim); fig.target.updateMatrixWorld()
      const d = fig.position.distanceTo(aim); fig.color.set(M.figColor); fig.intensity = M.figI * d * d; fig.distance = 0
      state.figTarget = aim.toArray().map((v) => +v.toFixed(3))
    },
    info: () => ({ schema: SCHEMA, mood: state.mood && { tod: +state.mood.tod.toFixed(3), sun: state.mood.sun, sunI: +state.mood.sunI.toFixed(3), elev: +state.mood.elev.toFixed(2), az: state.mood.az, hemiSky: state.mood.hemiSky, hemiI: +state.mood.hemiI.toFixed(3), figI: +state.mood.figI.toFixed(3), skyL: +state.mood.skyL.toFixed(3), glow: +state.mood.glow.toFixed(3), shadowLen: +shadowLength(state.mood.elev).toFixed(3) },
      shadow: state.fit && { texel: +state.fit.texel.toFixed(4), near: state.fit.near, far: +state.fit.far.toFixed(2), bias: sun.shadow.bias, normalBias: +sun.shadow.normalBias.toFixed(4) }, figTarget: state.figTarget, figIntensity: +fig.intensity.toFixed(2) }),
    mood: () => state.mood,
    dispose() { sun.shadow.map?.dispose(); sun.dispose(); hemi.dispose(); fig.dispose(); root.clear() },
  }
}

// Kontaktverdeckung am Boden. opts: targets: () => [{ module, scale? }] · groundAt?: (x, z) => { y, normal: [x,y,z] } · strength = 0.42 · pad = 1.08
// Größe = Grundfläche der Hüllbox × pad (je Ziel einmal gemessen, sobald es sichtbar ist). Verlauf: Gauß, ohne Rand (keine dunklen Ringe).
let AO_TEX = null
const aoTex = () => { if (AO_TEX) return AO_TEX; const n = 128, c = document.createElement('canvas'); c.width = c.height = n; const g = c.getContext('2d'), img = g.createImageData(n, n)
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const u = (x + 0.5) / n * 2 - 1, v = (y + 0.5) / n * 2 - 1, r2 = u * u + v * v, a = r2 >= 1 ? 0 : Math.exp(-3.2 * r2) * (1 - r2); const i = (y * n + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = 0; img.data[i + 3] = Math.round(255 * a) }
  g.putImageData(img, 0, 0); AO_TEX = new THREE.CanvasTexture(c); return AO_TEX }
const AO_GEO = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
export function createContactAO({ targets = () => [], groundAt = null, strength = 0.42, pad = 1.08 } = {}) {
  const root = new THREE.Group(); root.name = 'contact-ao'
  const items = new Map(), p = new THREE.Vector3(), b = new THREE.Box3(), s = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), n = new THREE.Vector3()
  return {
    object3d: root,
    update() {
      for (const t of targets() || []) {
        const a = t?.module || t, o = a?.object3d; if (!o) continue
        let it = items.get(a)
        if (!it) { if (a.status && (a.status().status !== 'OK' || a.status().shown === false)) continue
          b.setFromObject(o); b.getSize(s); const m = new THREE.Mesh(AO_GEO, new THREE.MeshBasicMaterial({ map: aoTex(), color: '#000000', transparent: true, depthWrite: false, opacity: strength, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }))
          m.name = 'contact-ao'; m.renderOrder = 2; m.castShadow = m.receiveShadow = false; m.scale.set(Math.max(0.2, s.x * pad), 1, Math.max(0.2, s.z * pad)); root.add(m); it = { m, sx: s.x, sz: s.z }; items.set(a, it) }
        const vis = !(a.status && a.status().shown === false); it.m.visible = vis; if (!vis) continue
        o.getWorldPosition(p); const g = groundAt ? groundAt(p.x, p.z) : null
        it.m.position.set(p.x, (g ? g.y : p.y) + 0.01, p.z); it.m.rotation.set(0, o.rotation.y, 0)
        if (g?.normal) { n.fromArray(g.normal).normalize(); q.setFromUnitVectors(up, n); it.m.quaternion.premultiply(q) }
      }
    },
    count: () => [...items.values()].filter((it) => it.m.visible).length,
    dispose() { items.forEach((it) => it.m.material.dispose()); items.clear(); root.clear() }, // Geometrie und Verlaufstextur geteilt
  }
}

// Selbsttest Spalt (V-392): kleine Szene (Ebene, Kugel r 0,5 m auf dem Boden, Kiste 1 m), Rig-Sonne mit fitShadow, Rendern in ein Ziel 512².
// Misst auf der Schattenseite Bodenpunkte 2–6 cm hinter der Kante (dort entsteht der Spalt bei falschem Bias) gegen den Schattenkern 0,35 m weiter.
// gap = Anteil der Kanten-Proben, die heller als Kern × 1,12 + 6 sind. PASS bei gap = 0.
export function selfTest(gl) {
  const scene = new THREE.Scene(), W = 512, rt = new THREE.WebGLRenderTarget(W, W)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#d8c8a8', roughness: 1 })); ground.receiveShadow = true; scene.add(ground)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 24), new THREE.MeshStandardMaterial({ color: '#c0503a', roughness: 0.95 })); ball.position.set(-1, 0.5, 0); ball.castShadow = ball.receiveShadow = true; scene.add(ball)
  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#4a7ac0', roughness: 0.95 })); box.position.set(1, 0.5, 0); box.castShadow = box.receiveShadow = true; scene.add(box)
  const sun = new THREE.DirectionalLight('#ffffff', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); scene.add(sun, sun.target, new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05))
  const M = MOODS.day, dir = sunDirection(M.elev, M.az); fitShadow(sun, { center: { x: 0, y: 0, z: 0 }, radius: 4 }, { sunDir: dir })
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100); cam.position.set(0, 2.2, 7); cam.lookAt(0, 0.4, 0)
  const prevSM = gl.shadowMap.enabled, prevT = gl.getRenderTarget(); gl.shadowMap.enabled = true; gl.setRenderTarget(rt); gl.render(scene, cam); gl.setRenderTarget(prevT); gl.shadowMap.enabled = prevSM
  const px = new Uint8Array(W * W * 4); gl.readRenderTargetPixels(rt, 0, 0, W, W, px)
  const lum = (x, y) => { const i = (y * W + x) * 4; return 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2] }
  const at = (v) => { const q = v.clone().project(cam); return [Math.round((q.x + 1) / 2 * W), Math.round((q.y + 1) / 2 * W)] } // Lese-Ziel: y nach oben
  // Auf der Schattenseite (vom Licht weg): Bodenpunkte 2–6 cm hinter der Kante (Spalt-Zone) gegen den Schattenkern 0,35 m weiter, je 5 Punkte quer zur Richtung
  const away = new THREE.Vector3(-dir[0], 0, -dir[2]).normalize(), side = new THREE.Vector3(-away.z, 0, away.x), res = []
  for (const [obj, half] of [[ball, 0.5], [box, 0.5]]) {
    let bright = 0, n = 0, core = 0
    for (let k = -2; k <= 2; k++) {
      const base = obj.position.clone().setY(0).addScaledVector(side, k * 0.08)
      const c = lum(...at(base.clone().addScaledVector(away, half + 0.35))); core += c / 5
      for (const e of [0.02, 0.04, 0.06]) { n++; if (lum(...at(base.clone().addScaledVector(away, half + e))) > c * 1.12 + 6) bright++ }
    }
    res.push({ part: obj === ball ? 'kugel' : 'kiste', gap: +(bright / n).toFixed(3), core: +core.toFixed(1) })
  }
  rt.dispose(); scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose() } }); sun.shadow.map?.dispose()
  return { pass: res.every((r) => r.gap === 0), res }
}

// Praktische Lichter (Regel 6/7, V-329-Pool): Laternen, Kristalle, Billboard-Lampen als Licht-Inseln. Fester Pool von POOL PointLights ohne Schatten
// (three.js kompiliert Materialien neu, wenn sich die Lichtzahl ändert: nie hinzufügen oder entfernen, nur schalten); aktiv sind die zur Kamera
// nächstgelegenen. Jedes practical bekommt einen additiven Leuchthof. Stärke = weight() (Rig-glow: nachts 1, Gold 0,35, Tag 0) × Typ × Flackern.
// Es gibt kein eigenes Figuren-Licht mehr im Pool (Regel 11: das Figurenlicht ist Teil des Rigs).
// opts: practicals: [{ id, type, pos: [x,y,z] m, color, intensity, range, flicker?, halo? }] oder () => [...] (wird neu gelesen, wenn sich die Zahl ändert)
//       weight: () => 0..1 · pool = 6
export const POOL = 6
const PTYPE = { lantern: { i: 6, flicker: { amp: 0.08, hz: 5 }, halo: 0.3 }, neon: { i: 5, flicker: null, halo: 0.45 }, crystal: { i: 7, flicker: { amp: 0.05, hz: 1.2 }, halo: 0.5 },
  torch: { i: 8, flicker: { amp: 0.2, hz: 7 }, halo: 0.4 }, monitor: { i: 4, flicker: { amp: 0.03, hz: 9 }, halo: 0.35 }, lamp: { i: 2.2, flicker: null, halo: 0.35 } } // lamp: Billboard-Lampen, nah an der Karte (L-2: Karte nie heller als ihr Licht)
let HALO = null
const haloTex = () => { if (HALO) return HALO; const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,0.45)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); HALO = new THREE.CanvasTexture(c); return HALO }
export function createPracticals({ practicals = [], weight = () => 1, pool = POOL } = {}) {
  const root = new THREE.Group(); root.name = 'practicals'
  const src = typeof practicals === 'function' ? practicals : () => practicals
  let items = [], seen = -1
  const build = (list) => { items.forEach((it) => { root.remove(it.halo); it.halo.material.dispose() })
    items = list.map((p, i) => { const T = PTYPE[p.type] || PTYPE.lantern, color = new THREE.Color(p.color || '#ffc15a')
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
      const size = p.halo?.size ?? T.halo; halo.scale.set(size, size, 1); halo.position.fromArray(p.pos); halo.name = 'halo:' + (p.id || i); root.add(halo)
      return { p, color, base: (p.intensity ?? 1) * T.i, range: p.range ?? 4, flicker: p.flicker === undefined ? T.flicker : p.flicker, phase: i * 1.7, halo } }) }
  const lights = Array.from({ length: pool }, (_, i) => { const L = new THREE.PointLight('#ffffff', 0, 4, 2); L.castShadow = false; L.name = 'pool:' + i; root.add(L); return L })
  const state = { t: 0, active: [] }, camPos = new THREE.Vector3()
  return {
    object3d: root,
    update(dt, ctx) {
      const list = src() || []; if (list.length !== seen) { build(list); seen = list.length }
      state.t += dt || 0; const w = Math.max(0, Math.min(1, weight()))
      if (ctx?.camera) ctx.camera.getWorldPosition(camPos)
      const f = (it) => (it.flicker ? 1 + it.flicker.amp * Math.sin(state.t * Math.PI * 2 * it.flicker.hz + it.phase) : 1)
      items.forEach((it) => { it.halo.material.opacity = w * f(it); it.halo.visible = w > 0.01 })
      const near = items.map((it) => ({ it, d: camPos.distanceToSquared(it.halo.position) })).sort((a, b) => a.d - b.d).slice(0, pool)
      lights.forEach((L, i) => { const n = near[i]; if (!n || w <= 0.01) { L.intensity = 0; return } L.position.copy(n.it.halo.position); L.color.copy(n.it.color); L.distance = n.it.range; L.intensity = n.it.base * w * f(n.it) })
      state.active = near.map((n) => n.it.p.id)
    },
    info: () => ({ practicals: items.length, pool: lights.length, active: state.active.slice(), lit: lights.filter((L) => L.intensity > 0).length }),
    dispose() { items.forEach((it) => it.halo.material.dispose()); lights.forEach((L) => L.dispose?.()); root.clear() },
  }
}
