// WS-NPC K15 (Lead 22.10.: „je Obstgarten-Zone ein Dark Fluffer an eigenem Baum“) · Modul nach Host-Vertrag R1.2 für alle Dark Fluffer.
// Je Zone (residents.r1.json fluffers[]) höchstens ein createDarkFluffer gleichzeitig; Erscheinen und Sorte nach flufferKinds (feste Spawns mit
// Tages-Seed, bis der Welt-Ereignis-Host übernimmt). Die Schnittstelle folgt E3 (giftReveal): spawnAt(id, x?, z?, kind?) und events().
//   Laden    Modell erst kurz vor dem Erscheinen (leadS) über urlOf(kind) → Promise<URL> (import.meta.glob ohne eager, Lead 22.10.)
//   Wechsel  ein neues Erscheinen ersetzt das alte nur, solange es nicht zu sehen ist (kein Pop-out im Bild)
//   Culling  Muster groupLife: sichtbar nur im Bild (bis visibleFar) oder ganz nah (12·K); verdeckt ruht der Mixer
//   Waffe    trägt nur der erste Fluffer der Liste (goblin), sonst hinge sie mehrfach am Hand-Slot
//   Fleck    jeder Fluffer meldet seinen Fleck einzeln, das Gelände bekommt die Summe (inkPatch ≤ 4)
// Verträglich mit dem früheren mods.fluffer (ein Ghost): status(), debug(), mouthWorld() zeigen den ersten Fluffer; hops() und events() sammeln alle;
// threat(at?) → nächster feindlicher Fluffer zu at { x, z } (ohne at: der erste feindliche).
// options: { defs, kinds: [Sorte…], urlOf(kind), T0, dayS, dayOf(t), maxNear, clock(), groundAt, terrain(), orchard(), player() (Loco),
//   playerPos() → { x, z } | null, camera?(), track?(holder) → off (Interpolation), onEvent?(e) (healed an die Bewohner), worldScale, schedule? (false = nur spawnAt) }
import * as THREE from 'three'
import { createDarkFluffer } from './darkFluffer.js'
import { appearanceAt, kindsForDay } from './flufferKinds.js'
import { resolveCharacterId } from '../characters/registry.js' // Register CHARACTERS_R1 (V-682): feste Figuren-ID je Darsteller

export const FLUFFER_SET = Object.freeze({ leadS: 8, visibleFar: 140, nearK: 12, events: 60 })

export function createFlufferSet(options) {
  const { defs } = options, K = options.worldScale ?? 1, R = FLUFFER_SET
  const root = new THREE.Group(); root.name = 'dark-fluffers'
  const S = { events: [], seq: 0, ink: {}, frustum: new THREE.Frustum(), pv: new THREE.Matrix4(), cam: null, sphere: new THREE.Sphere(new THREE.Vector3(), 0.8) }
  const Z = Object.fromEntries(defs.map((d) => [d.id, { def: d, inst: null, t0: null, kind: null, n: null, off: null, token: 0, manual: false }]))
  const emit = (e) => { S.events.push({ ...e, seq: ++S.seq }); if (S.events.length > R.events) S.events.shift() }
  const terrainFor = (id) => ({ setInkPatches: (p) => { S.ink[id] = p; options.terrain?.()?.setInkPatches?.(Object.values(S.ink).flat()) } })
  const show = (x, z) => {
    const pl = options.playerPos?.(); if (!pl) return true
    const d = Math.hypot(x - pl.x, z - pl.z); if (d < R.nearK * K) return true
    if (!S.cam || d > R.visibleFar) return false
    S.sphere.center.set(x, options.groundAt(x, z) + 0.4, z); return S.frustum.intersectsSphere(S.sphere)
  }

  function drop(z) {
    if (!z.inst) return
    emit({ type: 'fluffer_gone', id: z.def.id, kind: z.kind, t: options.clock() })
    z.off?.(); root.remove(z.inst.object3d); z.inst.dispose(); z.inst = null; z.off = null; delete S.ink[z.def.id]
  }
  async function make(z, { t0, n, kind, start, manual = false }) {
    const token = ++z.token
    drop(z); z.t0 = t0; z.n = n; z.kind = kind; z.manual = manual
    const url = await options.urlOf(kind)
    if (token !== z.token) return // inzwischen ersetzt
    if (!url) { emit({ type: 'fluffer_error', id: z.def.id, kind, t: options.clock() }); return }
    const def = start ? { ...z.def, start, via: [] } : z.def
    z.inst = createDarkFluffer({ def, t0, modelUrl: url, kind, gun: z.def === defs[0], show,
      clock: options.clock, groundAt: options.groundAt, terrain: () => terrainFor(z.def.id), orchard: options.orchard, player: options.player,
      onEvent: options.onEvent, onWorld: (e) => emit({ ...e, characterId: resolveCharacterId(kind), zone: z.def.tree.zone }) })
    root.add(z.inst.object3d); z.off = options.track?.(z.inst.holder()) ?? null
    emit({ type: 'fluffer_spawn', id: z.def.id, kind, characterId: resolveCharacterId(kind), zone: z.def.tree.zone, at: def.start.slice(), n, t0, t: options.clock() })
  }
  // feste Spawns: Sorten eines Durchgangs n gemeinsam (verschiedene Sorten am selben Tag), Tages-Seed = Welttag zu Beginn des Durchgangs
  const kindFor = (d, n) => kindsForDay(defs, options.kinds, options.dayOf(options.T0 + n * options.dayS), () => n)[d.id]
  const active = () => Object.values(Z).filter((z) => z.inst && z.inst.debug().phase !== 'gone').length

  return {
    object3d: root,
    get ready() { return Z[defs[0].id].inst?.ready ?? Promise.resolve() },
    update(dt, hctx) {
      const t = options.clock(), cam = options.camera?.() || hctx?.camera || null
      S.cam = cam; if (cam) { cam.updateMatrixWorld(); S.pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); S.frustum.setFromProjectionMatrix(S.pv) }
      for (const z of Object.values(Z)) {
        const ap = appearanceAt(z.def, options.T0, options.dayS, t + R.leadS)
        // fester Plan (schedule false = Welt-Ereignis-Host spawnt selbst); ein spawnAt deckt das laufende Erscheinen ab, erst der nächste Durchgang ersetzt es
        const due = options.schedule !== false && ap.t0 <= t + R.leadS && (z.t0 === null || (z.manual ? ap.n > z.n : ap.t0 > z.t0)), hidden = !z.inst || !z.inst.status().shown
        if (due && hidden && (z.inst || active() < (options.maxNear ?? 3))) make(z, { t0: ap.t0, n: ap.n, kind: kindFor(z.def, ap.n) })
        z.inst?.update(dt, hctx)
      }
    },
    // E3-Schnittstelle für den Welt-Ereignis-Host: Erscheinen jetzt (t0 = Weltzeit), wahlweise mit eigenem Startpunkt und eigener Sorte
    spawnAt(id, x, z, kind) {
      const zz = Z[id]; if (!zz) return false
      make(zz, { t0: options.clock(), n: zz.n ?? 0, kind: kind || zz.kind || kindFor(zz.def, zz.n ?? 0), start: Number.isFinite(x) && Number.isFinite(z) ? [x, z] : null, manual: true }); return true
    },
    events: () => S.events.slice(),
    threat(at) {
      let best = null, bd = Infinity
      for (const z of Object.values(Z)) { const th = z.inst?.threat(); if (!th) continue; const d = at ? Math.hypot(th.x - at.x, th.z - at.z) : 0; if (d < bd) { bd = d; best = th } }
      return best
    },
    status: () => { const p = Z[defs[0].id].inst; return { ...(p ? p.status() : { status: 'LOADING' }), fluffers: Object.values(Z).map((z) => ({ id: z.def.id, kind: z.kind, characterId: z.kind ? resolveCharacterId(z.kind) : null, n: z.n, t0: z.t0, status: z.inst?.status().status ?? null, shown: !!z.inst?.status().shown })) } },
    debug: () => Z[defs[0].id].inst?.debug() ?? { events: [], phase: null }, // AudioHost liest debug().events ohne Prüfung
    debugOf: (id) => Z[id]?.inst?.debug() ?? null,
    statusOf: (id) => Z[id]?.inst?.status() ?? null,
    mouthWorld: () => Z[defs[0].id].inst?.mouthWorld() ?? null,
    hops: () => Object.values(Z).flatMap((z) => (z.inst?.hops() ?? []).map((h) => ({ ...h, characterId: resolveCharacterId(h.kind ?? z.kind) }))).sort((a, b) => a.t - b.t),
    holder: () => Z[defs[0].id].inst?.holder() ?? null,
    dispose() { for (const z of Object.values(Z)) { z.token++; drop(z) } options.terrain?.()?.setInkPatches?.([]); root.clear() },
  }
}
