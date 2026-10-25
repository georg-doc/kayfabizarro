// WS-NPC · S3 Regie R0 (Konzept Prozedurale Welt R1.5 §5.1, mit WS1b): der Dramaturg aus dem Tratsch, übertragen auf Fahrstrecke. Rein, ohne three.
//   Takt     eine Begegnung je Strecke D (Konzept 35–75 s Fahrt bei 26,7 m/s), Mindestabstand 20 s, höchstens 120 s Leere (nur wenn man sich bewegt hat)
//   Phasen   Aufbau → Konflikt → Ruhe, 3/5/4 Begegnungen, Zielspannung 0,4/0,8/0,1; τ gleitend (α 0,5) aus dem Potenzial der gewählten Szene
//   Stapel   je Phase die freigegebenen Typen dieser Phase (sonst alle des Pools); unter dem Ziel wählt die Regie den Typ mit höherem Potenzial, darüber
//            den ruhigeren; kein Typ zweimal hintereinander; keine Besetzung (mit Gimmick) zweimal innerhalb von 10 Szenen
//   Platz    der nächste freie Rasterplatz im Vorwärtskegel ±35°, im Abstand `ahead` voraus; Ausrichtung zur Linie des Spielers
//   Kontext  request(typ, grund) stellt einen kontextuellen Auslöser vorn an (z. B. ein Welt-Ereignis); er umgeht den Takt, nicht den Pool
//   T1       Seed + Folge der Eingaben (Strecke, Zeit, Lage) ergeben dieselbe Szenenfolge
import { poolTypes, makeScene, PHASE_ZIEL } from './sceneTypes.js'

export const REGIE = Object.freeze({
  phasen: Object.freeze([{ id: 'aufbau', n: 3 }, { id: 'konflikt', n: 5 }, { id: 'ruhe', n: 4 }]), alpha: 0.5,
  taktS: [35, 75], vRef: 26.7, minGapS: 20, maxEmptyS: 120, coneDeg: 35, ahead: [250, 600], noRepeatCast: 10,
})

// options: { seed, grid (spotsAround), includeDraft, types?, taktM? ([d0, d1] Strecke; Standard taktS × vRef), ahead?, minGapS?, maxEmptyS?, coneDeg?,
//   spotSources? { typ: (x, z, r) → Plätze }, cardFor?(besetzung, n) → 'deck:num' | null }
export function createSceneDirector(options) {
  const R = { ...REGIE, ...options }, seed = options.seed ?? 1
  const taktM = options.taktM || [R.taktS[0] * R.vRef, R.taktS[1] * R.vRef]
  const pool = poolTypes({ includeDraft: !!options.includeDraft, types: options.types })
  const S = { n: 0, phase: 0, inPhase: 0, tau: 0, lastT: -Infinity, sinceM: 0, need: null, lastTyp: null, casts: [], used: new Set(), kontext: [], log: [], rnd: (seed >>> 0) || 1 }
  const rnd = () => { S.rnd = (Math.imul(S.rnd, 1664525) + 1013904223) >>> 0; return S.rnd / 4294967296 }
  const draw = () => taktM[0] + (taktM[1] - taktM[0]) * rnd()
  S.need = draw()
  const castKey = (b) => b.map((x) => x.characterId + ':' + (x.gimmick ?? '')).sort().join('|')

  function pickType(phaseId, ziel, want = null) {
    if (want) return pool.find((t) => t.typ === want) || null
    let cands = pool.filter((t) => t.phasen.includes(phaseId) && t.typ !== S.lastTyp)
    if (!cands.length) cands = pool.filter((t) => t.typ !== S.lastTyp)
    if (!cands.length) cands = pool.slice()
    if (!cands.length) return null
    // unter dem Ziel: höheres Potenzial zuerst, darüber: ruhiger zuerst; Gleichstand per Seed
    const up = S.tau < ziel, sorted = cands.map((t) => ({ t, k: (up ? -t.pot : t.pot) + rnd() * 1e-3 })).sort((a, b) => a.k - b.k)
    return sorted[0].t
  }
  function pickCast(T) {
    const free = T.besetzungen.filter((b) => !S.casts.slice(-R.noRepeatCast).includes(castKey(b)))
    const list = free.length ? free : T.besetzungen
    return list[Math.floor(rnd() * list.length)]
  }
  // Platz: Neigungsbedarf des Typs (z. B. Band < 1,1°) muss passen – sonst wartet der Typ auf ebene Plätze (Auftrags-Hügel des echten Rasters, V-716)
  // Platzquelle je Typ (z. B. Fluffer: Obstbäume) statt Raster, wenn der Wirt eine liefert: spotSources[typ](x, z, r) → Plätze wie spotsAround
  function pickSpot(pos, heading, occupied, T) {
    const src = options.spotSources?.[T.typ]
    if (!src && T.platz?.quelle) return null   // Typ braucht eine eigene Platzquelle (Fluffer: Baum) – ohne sie nie auf einen Rasterplatz
    const cone = (R.coneDeg * Math.PI) / 180, spots = src ? src(pos.x, pos.z, R.ahead[1]) : options.grid.spotsAround(pos.x, pos.z, R.ahead[1])
    const ok = spots.filter((s) => s.d >= R.ahead[0] && (T.platz?.maxSlope == null || s.slope <= T.platz.maxSlope) && !occupied.has(s.cell.join(',')) && !S.used.has(s.cell.join(',')) && Math.abs(Math.atan2(Math.sin(Math.atan2(s.x - pos.x, s.z - pos.z) - heading), Math.cos(Math.atan2(s.x - pos.x, s.z - pos.z) - heading))) <= cone)
    return ok[0] || null
  }

  return {
    // eine Prüfung je Takt des Wirts. in: { t (s), movedM (Strecke seit dem letzten Aufruf), pos: { x, z }, heading (rad, 0 = +z), occupied?: Set('cx,cz') }
    step({ t, movedM = 0, pos, heading, occupied = new Set() }) {
      S.sinceM += Math.max(0, movedM)
      const ph = R.phasen[S.phase], ziel = PHASE_ZIEL[ph.id]
      const k = S.kontext[0]
      const due = k ? t - S.lastT >= 0 : (S.sinceM >= S.need && t - S.lastT >= R.minGapS) || (t - S.lastT >= R.maxEmptyS && S.sinceM > 0 && t - S.lastT >= R.minGapS)
      if (!due) return null
      const T0 = pickType(ph.id, ziel, k?.typ)
      if (!T0) { if (k) S.kontext.shift(); return null }
      // der gewählte Typ zuerst; findet er keinen passenden Platz, die übrigen Typen des Stapels in derselben Reihenfolge (nicht der vorige Typ)
      let T = T0, spot = pickSpot(pos, heading, occupied, T0)
      if (!spot && !k) for (const t of pool.filter((x) => x !== T0 && x.typ !== S.lastTyp)) { const sp = pickSpot(pos, heading, occupied, t); if (sp) { T = t; spot = sp; break } }
      if (!spot) return null   // kein passender Platz voraus: nächster Takt versucht es wieder (Takt bleibt fällig)
      if (k) S.kontext.shift()
      const cast = pickCast(T)
      S.tau = R.alpha * T.pot + (1 - R.alpha) * S.tau
      const yaw = Math.atan2(pos.x - spot.x, pos.z - spot.z)   // Szene schaut zur Linie des Spielers
      // Karte: Signatur-Deck der Besetzung (Wirt liefert cardFor(besetzung, n) → 'deck:num' | null), Thema für Wechselrede und Tratsch
      const karte = options.cardFor?.(cast, S.n + 1) ?? null
      const sc = makeScene({ seed, n: ++S.n, typ: T.typ, spot, yaw, besetzung: cast, phase: ph.id, tau: S.tau, ausloeser: k ? 'kontext' : 'zufall', grund: k?.grund ?? null, karte })
      S.lastTyp = T.typ; S.casts.push(castKey(cast)); S.used.add(spot.cell.join(',')); S.lastT = t; S.sinceM = 0; S.need = draw()
      if (++S.inPhase >= ph.n) { S.inPhase = 0; S.phase = (S.phase + 1) % R.phasen.length }
      S.log.push({ t: +t.toFixed(2), id: sc.id, typ: sc.typ, phase: sc.phase, tau: sc.tau, ausloeser: sc.ausloeser, zelle: sc.zelle, karte: sc.karte })
      return sc
    },
    request(typ, grund = null) { S.kontext.push({ typ, grund }) },
    release(cell) { S.used.delete(cell.join(',')) },   // Platz wieder frei, wenn die Szene abgebaut ist (Variante A: Inhalt weich, Platz fest)
    state: () => ({ n: S.n, phase: R.phasen[S.phase].id, inPhase: S.inPhase, tau: +S.tau.toFixed(3), sinceM: +S.sinceM.toFixed(1), need: +S.need.toFixed(1), pool: pool.map((t) => t.typ) }),
    log: () => S.log.slice(),
  }
}
