// Hex-Welt: prozedurale Insel aus Hex-Säulen + Deck-Turm (Karten als Plattformen, Hex-Säulen als Plattformer-Übergänge)
import * as THREE from 'three'
import { isCardSafe } from './cardMapping'
import { createNoise2D } from 'simplex-noise'
import { rng } from './world'
import { DECKS, cardsOfDeck, cardAt } from './cards'

export const S = 2.2 // Hex-Umkreisradius (m)
const SQ3 = Math.sqrt(3)
export const RINGS = 28
const STEP = 0.5 // Höhenstufen
const SEED = 4242

const noise = createNoise2D(rng(SEED))
const axialToXZ = (q, r) => [S * SQ3 * (q + r / 2), S * 1.5 * r]
function xzToAxial(x, z) {
  const q = (SQ3 / 3 * x - 1 / 3 * z) / S, r = (2 / 3 * z) / S
  // Würfel-Rundung
  let rx = Math.round(q), rz = Math.round(r), ry = Math.round(-q - r)
  const dx = Math.abs(rx - q), dz = Math.abs(rz - r), dy = Math.abs(ry - (-q - r))
  if (dx > dy && dx > dz) rx = -ry - rz; else if (dy <= dz) rz = -rx - ry
  return [rx, rz]
}

// Ebene Flächen: Start/Bühne und Turmfuß
export const SPAWN = new THREE.Vector3(0, 0, 0)
export const TOWER_C = new THREE.Vector3(36, 0, -30)
const FLATS = [{ x: 0, z: 0, r: 13, h: 2.5 }, { x: TOWER_C.x, z: TOWER_C.z, r: 16, h: 3.0 }]
const RMAX = RINGS * S * SQ3

function rawHeight(x, z) {
  const d = Math.hypot(x, z) / RMAX
  const island = 1 - THREE.MathUtils.smoothstep(d, 0.55, 1.0)
  const n = noise(x * 0.012, z * 0.012) * 0.65 + noise(x * 0.035, z * 0.035) * 0.3 + noise(x * 0.09, z * 0.09) * 0.08
  let h = (n * 0.55 + 0.55) * island * 11 - 1.5
  for (const f of FLATS) {
    const k = THREE.MathUtils.smoothstep(Math.hypot(x - f.x, z - f.z), f.r * 0.7, f.r * 1.4)
    h = f.h + (h - f.h) * k
  }
  return Math.round(h / STEP) * STEP
}

const tiles = new Map()
for (let q = -RINGS; q <= RINGS; q++) for (let r = Math.max(-RINGS, -q - RINGS); r <= Math.min(RINGS, -q + RINGS); r++) {
  const [x, z] = axialToXZ(q, r)
  tiles.set(q + ',' + r, { q, r, x, z, h: rawHeight(x, z) })
}
SPAWN.y = 2.5; TOWER_C.y = 3.0

export function groundHeight(x, z) {
  const [q, r] = xzToAxial(x, z)
  const t = tiles.get(q + ',' + r)
  return t ? Math.max(t.h, -0.6) : -0.6
}

const PALETTE = {
  sand: new THREE.Color('#ecd9a0'), grass1: new THREE.Color('#9fd06e'), grass2: new THREE.Color('#7dbb5c'),
  grass3: new THREE.Color('#5f9e4f'), rock: new THREE.Color('#a8998c'), snow: new THREE.Color('#f6f0e6'), seabed: new THREE.Color('#d9c48e'),
}
function tileColor(h, jitter) {
  let c
  if (h < 0) c = PALETTE.seabed
  else if (h < 1) c = PALETTE.sand
  else if (h < 3.5) c = jitter > 0.5 ? PALETTE.grass1 : PALETTE.grass2
  else if (h < 6) c = PALETTE.grass3
  else if (h < 8) c = PALETTE.rock
  else c = PALETTE.snow
  return c.clone().offsetHSL(0, 0, (jitter - 0.5) * 0.05)
}

// Hex-Prisma in ein Positions-/Farb-Array schreiben (flach schattiert, nicht indiziert)
function pushPrism(pos, col, cx, cz, top, bottom, rad, cTop, cSide) {
  const corners = []
  for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; corners.push([cx + Math.cos(a) * rad, cz + Math.sin(a) * rad]) }
  const tri = (a, b, c, color) => { pos.push(...a, ...b, ...c); for (let k = 0; k < 3; k++) col.push(color.r, color.g, color.b) }
  for (let i = 0; i < 6; i++) {
    const [x1, z1] = corners[i], [x2, z2] = corners[(i + 1) % 6]
    tri([cx, top, cz], [x2, top, z2], [x1, top, z1], cTop)
    tri([x1, top, z1], [x2, top, z2], [x2, bottom, z2], cSide)
    tri([x1, top, z1], [x2, bottom, z2], [x1, bottom, z1], cSide)
  }
}
function geometryFrom(pos, col) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.computeVertexNormals()
  return g
}

export function buildGround() {
  const pos = [], col = [], r = rng(SEED + 1)
  for (const t of tiles.values()) {
    const top = t.h < 0 ? Math.max(t.h, -1.5) : t.h
    const c = tileColor(t.h, r())
    pushPrism(pos, col, t.x, t.z, top, -4, S * 0.985, c, c.clone().multiplyScalar(0.78))
  }
  return geometryFrom(pos, col)
}

// ---------- Deck-Turm ----------
// Eine Seite = 4 Karten = eine Etage. Zwischen den Karten Hex-Säulen als Plattformer-Übergänge.
const PAGES = 3, PER_PAGE = 4
function pickDeck(r) {
  // nur Karten mit geprüftem Bild (cardMapping); ein Turm braucht 12 davon (Karte Nr. 1 = meist Cover, ausgenommen)
  const safeCount = (i) => cardsOfDeck(i).map(cardAt).filter((c) => c.num > 1 && isCardSafe(DECKS[i].id, c.num)).length
  const ok = DECKS.map((d, i) => i).filter((i) => !DECKS[i].med && safeCount(i) >= PAGES * PER_PAGE)
  return ok[Math.floor(r() * ok.length)]
}
export function buildTower(seed = Date.now() % 100000) {
  const r = rng(seed)
  const di = pickDeck(r)
  const cards = cardsOfDeck(di).map(cardAt).sort((a, b) => a.num - b.num)
  const playable = cards.filter((c) => c.num > 1 && isCardSafe(c.deck.id, c.num)).slice(0, PAGES * PER_PAGE) // Nr. 1 ist meist das Deck-Cover
  const cover = cards.find((c) => c.num === 1) || cards[0]
  const RAD = 14, RISE = 2.6, ANG = 0.95
  const targets = [], pieces = []
  let prev = { pos: new THREE.Vector3(TOWER_C.x + RAD, TOWER_C.y, TOWER_C.z), r: 3 }
  playable.forEach((card, k) => {
    const a = (k + 1) * ANG
    const top = TOWER_C.y + (k + 1) * RISE + Math.floor(k / PER_PAGE) * 1.2 // kleine Stufe zwischen Seiten
    const p = new THREE.Vector3(TOWER_C.x + Math.cos(a) * RAD, top, TOWER_C.z + Math.sin(a) * RAD)
    // Übergangssäulen
    const n = 2
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1)
      const aa = THREE.MathUtils.lerp(k * ANG, a, t) + (r() - 0.5) * 0.06
      const rr = RAD + (r() - 0.5) * 3
      const y = THREE.MathUtils.lerp(prev.pos.y, top, t) + (r() - 0.5) * 0.6
      const pp = new THREE.Vector3(TOWER_C.x + Math.cos(aa) * rr, y, TOWER_C.z + Math.sin(aa) * rr)
      const pillar = { kind: 'pillar', pos: pp, r: 1.15, thick: 0.9, page: Math.floor(k / PER_PAGE) }
      pieces.push(pillar); targets.push(pillar)
    }
    const plat = { kind: 'card', pos: p, r: 2.8, thick: 1.1, card, k, page: Math.floor(k / PER_PAGE) }
    pieces.push(plat); targets.push(plat)
    prev = plat
  })
  // Portal oben (Übergang zu einer anderen Welt, noch ohne Ziel)
  const aTop = (playable.length + 1) * ANG
  const roofY = prev.pos.y + RISE
  const roof = { kind: 'pillar', pos: new THREE.Vector3(TOWER_C.x + Math.cos(aTop) * RAD, roofY, TOWER_C.z + Math.sin(aTop) * RAD), r: 3.0, thick: 1, page: PAGES }
  for (let i = 1; i <= 2; i++) {
    const t = i / 3
    const aa = THREE.MathUtils.lerp(playable.length * ANG, aTop, t)
    const pp = new THREE.Vector3(TOWER_C.x + Math.cos(aa) * RAD, THREE.MathUtils.lerp(prev.pos.y, roofY, t), TOWER_C.z + Math.sin(aa) * RAD)
    const pillar = { kind: 'pillar', pos: pp, r: 1.15, thick: 0.9, page: PAGES }
    pieces.push(pillar); targets.push(pillar)
  }
  const portal = roof.pos.clone().add(new THREE.Vector3(0, 2.4, 0))
  pieces.push(roof); targets.push(roof)
  return { deck: DECKS[di], cover, cards: playable, pieces, targets, portal, base: TOWER_C.clone(), radius: RAD }
}

export function buildPiecesGeometry(pieces, deckColor) {
  const pos = [], col = []
  const base = new THREE.Color(deckColor)
  pieces.forEach((p, i) => {
    const c = p.kind === 'card' ? base.clone().offsetHSL(0, -0.05, 0.12) : new THREE.Color('#e9dcc4').offsetHSL(0, 0, ((i * 37) % 10) / 200)
    pushPrism(pos, col, p.pos.x, p.pos.z, p.pos.y, p.pos.y - p.thick, p.r, c, c.clone().multiplyScalar(0.72))
  })
  return geometryFrom(pos, col)
}

export const STAGE_POS = new THREE.Vector3(7, 2.5, -5)
