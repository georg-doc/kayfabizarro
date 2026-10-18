// Slice 1 · Platzierungs-Grammatik R2 für Fluff an Pflanzen (V-400, SPEC_PLACEMENT_GRAMMAR_R2 §0–§3, WSB 17.10.; Code-Owner WS1). Rein: ohne three, ohne DOM,
// deterministisch (Seed → rngOf/mulberry32 aus fluff.js), Node-geprüft (test/unit/grammar.mjs). Portiert aus der WSB-Proof-Seite B2/R2/proof/fluff_stage.html,
// Muster „gewachsen“ (Georg 17.10.: „Verteilungsmuster jetzt auch gut“, „mehr Luft als Default“). Vektoren [x, y, z], Oberfläche abstrakt (raycast).
// Inhalt: Operatoren candidates · score · stands · ripeness · stand · embed · nest · relax · fall (§2), Zahlen-Regeln + Prüfer ruleReport (§0), Farbe (§3),
// grow (eine Pflanze über raycast) und fruitFromAnchors (ein KayKit-Baum aus den WSB-B2-Ankern), assignLeads (Leitfarben einer Zone exakt nach V-368).
// QUELLE Anker: src/data/world/kaykit-tree-fluff-anchors.v1.json = byte-gleiche Kopie aus georg-doc/kayfabizarro, Branch assets/kfb-wsb-deliverables-2026-10-17
// @db74dbfba4a5967b8cc0ab4ab1d4f46eb9dfb973, media/3D_Assets/WSB_BLENDER/B2/kaykit-tree-fluff-anchors.v1.json, Blob 0287cbe93cfefcfde68b626734c2c53e64bcea2a.
// Annahmen (einfachste Lesart, an WS0):
// A1 kahle Bäume tragen keinen Fluff (Konzept B2-R2 §3.4, Georg) → fruitFromAnchors liefert []; opts.bare = true nutzt die B2-Anker trotzdem.
// A2 B2-Anker = Kandidaten (schon gefiltert: Kanten, Durchstechen). Ohne Mesh keine Rückprojektion: Folgefrüchte liegen in der Tangentialebene des Ankers,
//    Radius ≤ maxBallR des Ankers. A3 Reicht 0,62 × Kronenradius nicht für G Stände, wird mit dem halben Abstand aufgefüllt (B2 hält eigene Abstände).
// A4 Zahlen-Regeln: „gleich groß“ = Radien < 10 % verschieden, „nebeneinander“ = nächster Nachbar; „Abstände ≥ 30 % verschieden“ = Spannweite der
//    Nächster-Nachbar-Abstände (max − min) / max ≥ 0,3; „Gerade“ = drei Nachbarn (je ≤ 4,5 r̄, B2 neighbourR), der mittlere ≤ 5 % von |ac| neben der
//    Strecke (Toleranz wie §5). Durchgesetzt: ungerade Zahl (kleinste Folgefrucht fällt weg), zu gleichmäßig → kleinstes Paar Kopf–Folgefrucht berührt sich, sonst Neuversuch mit abgeleitetem Seed (bis tries; ab dem 5. je 4 Versuche ein Stand weniger).
// A5 Kontur-Regel (≥ 15 % überlappt oder ≥ 25 % Luft) an einer Pflanze: relax hält sie ein (WS0 18.10.), Folgefrüchte ab 1,25; Fallobst darf 1,15–1,5 (nearTouch zählt nur hängende).
// A6 Fallobst liegt AUF dem Gelände (Mitte = Höhe + r, Einsinken 0 wie die Windfall-Physik); Richtung = Stamm → Stand, gemittelt mit dem Gefälle.
// A7 Comic auf grünem Laub (B2 contrastDE.Comic < 40) nimmt immer die satte V-292-Stufe, nie die dunkle (§3 „nur die hellere Stufe“).
// A8 Einheiten: Modellraum der KayKit-glTF = Weltmeter (B2 „units“); place = { pos, rotY, scale = 1 }. A9 R0 = 0,06 + 0,075 × Kronenradius (Proof-Seite).
// A10 Leitfarbe je Pflanze nach Zonen-Gewicht per Seed, Akzent nach Gewicht aus den übrigen Sorten; assignLeads verteilt viele Pflanzen exakt (countsFor).
import { FLUFF, FLUFF_KINDS, rngOf, zoneWeights, countsFor, makeBody, isKind } from './fluff.js'

// ---------------------------------------------------------------- Vektoren
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = (a) => Math.hypot(a[0], a[1], a[2]), dist = (a, b) => len(sub(a, b))
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }, cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), rad = (d) => (d * Math.PI) / 180
export const vec = Object.freeze({ add, sub, mul, dot, len, dist, norm, cross })

// ---------------------------------------------------------------- Zahlen der Spec
// Sonne J17 Tag (Elevation 48,99°, Azimut −53,13°, wie Proof-Seite und stageLight), Kamera-/Leseseite normalize(0,25, 0, 1) (§2 score)
export const SUN = Object.freeze(norm([Math.sin(rad(-53.13)) * Math.cos(rad(48.99)), Math.sin(rad(48.99)), Math.cos(rad(-53.13)) * Math.cos(rad(48.99))]))
export const CAM = Object.freeze(norm([0.25, 0, 1]))
export const GRAMMAR = Object.freeze({
  n: 220, step: 2.39996, ySpan: 1.3, minNd: 0.45, minHs: 0.18, minHsCactus: 0.55, topHs: 0.86, score: [0.6, 0.5, 0.3], minDistK: 0.62, minDistKCactus: 0.4,
  rip: { base: 0.22, hs: 0.62, sun: 0.32, jitter: 0.09, min: 0.12, max: 1 }, dark: 0.5, fruits: [0.36, 0.62], size: [0.42, 0.62], sizes: [1, 0.74, 0.56], sizeJitter: 0.08,
  gap: [1.25, 1.5], side: 0.7, sag: 0.14, emb: 0.45,
  nest: { sizes: [1, 0.62, 0.38], med: [-1.2, 0.1, 1.3], small: [-0.6, 0.7, -2.0, 2.05, 3.1], k: 0.86, spread: 1.75 },
  relaxK: 8, relaxGap: 1.25, relaxPull: 0.85, relaxSplit: 1.05,
  stands: { tree: 7, bigBush: 4, bush: 3, cactus: 2 }, fallen: { tree: 2, bigBush: 1, bush: 1, cactus: 0 }, fallOff: [0.25, 0.3],
  rules: { sizeTol: 0.1, spread: 0.3, lineTol: 0.05, neighbourR: 4.5, overlap: 0.85, air: 1.25, tries: 16 },
})
export const baseRadius = (crownR) => 0.06 + 0.075 * crownR // A9
const CARRIERS = Object.keys(GRAMMAR.stands)

// Tangentialbasis zu einer Achse und Hängerichtung (Welt-unten in die Tangentialebene projiziert) als Winkel in (t, b)
function frame(ax) { const up = Math.abs(ax[1]) < 0.95 ? [0, 1, 0] : [1, 0, 0], t = norm(cross(up, ax)); return { t, b: cross(ax, t) } }
function hangAngle(n, t, b) { let h = add([0, -1, 0], mul(n, n[1])); if (dot(h, h) < 1e-8) h = t; h = norm(h); return Math.atan2(dot(h, b), dot(h, t)) }
const offset = (p, t, b, ang, d) => add(p, add(mul(t, Math.cos(ang) * d), mul(b, Math.sin(ang) * d)))

// ---------------------------------------------------------------- Operatoren (§2)
// surface: raycast(dir) → { p, n, hs } | null (äußerste Oberfläche vom Kronenzentrum in Richtung dir; hs = Höhenanteil 0 unten … 1 oben) oder { raycast }.
// Fibonacci-Kugel (Schritt 2,39996 rad, y von 1 bis −0,3), behalten: n·d ≥ 0,45 und hs ≥ 0,18 (Kaktus ≥ 0,55). Ergebnis [{ i, d, p, n, hs, sun }]
export function candidates(surface, n = GRAMMAR.n, { carrier = 'tree', G = GRAMMAR } = {}) {
  const cast = typeof surface === 'function' ? surface : surface.raycast, minHs = carrier === 'cactus' ? G.minHsCactus : G.minHs, out = []
  for (let i = 0; i < n; i++) {
    const y = 1 - (G.ySpan * (i + 0.5)) / n, rr = Math.sqrt(Math.max(0, 1 - y * y)), d = norm([rr * Math.cos(i * G.step), y, rr * Math.sin(i * G.step)])
    const h = cast(d); if (!h) continue
    const nn = norm(h.n); if (dot(nn, d) < G.minNd || h.hs < minHs) continue
    out.push({ i, d, p: h.p.slice(), n: nn, hs: h.hs, sun: Math.max(0, dot(nn, SUN)) })
  }
  return out
}
// Rang: rng·0,6 + max(0, n·sun)·0,5 + n·cam·0,3
export function score(c, rng, { sun = SUN, cam = CAM, G = GRAMMAR } = {}) { return rng() * G.score[0] + Math.max(0, dot(c.n, sun)) * G.score[1] + dot(c.n, cam) * G.score[2] }
// G Stände: zuerst die Spitze (hs > 0,86; nicht beim kleinen Busch), dann nach c.score mit Mindestabstand; fill = schon gesetzte Stände (Auffüllen, A3)
export function stands(cands, G, minDist, { top = true, topHs = GRAMMAR.topHs, fill = [] } = {}) {
  const out = fill.slice(), ranked = cands.slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  if (top && !out.length) { const t = cands.filter((c) => c.hs > topHs).sort((a, b) => b.hs - a.hs)[0]; if (t) out.push(t) }
  for (const c of ranked) { if (out.length >= G) break; if (!out.includes(c) && out.every((q) => dist(q.p, c.p) > minDist)) out.push(c) }
  return out
}
// Reife: clamp(0,22 + 0,62·(1 − hs) + 0,32·sun ± 0,09, 0,12, 1); ohne rng ohne Streuung (unten und Sonnenseite reif, oben jung)
export function ripeness(c, rng = null, R = GRAMMAR.rip) { return clamp(R.base + R.hs * (1 - c.hs) + R.sun * (c.sun ?? 0) + (rng ? (rng() - 0.5) * 2 * R.jitter : 0), R.min, R.max) }
export const fruitCount = (rip, G = GRAMMAR) => (rip <= G.fruits[0] ? 1 : rip <= G.fruits[1] ? 2 : 3)
// Mittelpunkt 0,45 r vor der Oberfläche (gut die Hälfte steckt im Laub, „wie Äpfel“); ball = { pt, n, r }
export function embed(ball, emb = GRAMMAR.emb) { return add(ball.pt, mul(norm(ball.n), ball.r * emb)) }
// Ein Fruchtstand: 1/2/3 Früchte, Größen R0·(0,42 + 0,62·rip)·[1; 0,74; 0,56] (±8 %), Folgefrüchte im Abstand (r_prev + r)·(1,15 … 1,5), seitlich ±0,7 rad zur
// Hängerichtung, reife hängen tiefer (−0,14·r·rip). project(q) → { p, n } | null legt Folgefrüchte zurück auf die Oberfläche (sonst Tangentialebene, A2)
export function stand(c, rip, { R0 = 0.15, rng = () => 0.5, project = null, maxR = Infinity, G = GRAMMAR } = {}) {
  const k = fruitCount(rip, G), { t, b } = frame(c.n), aH = hangAngle(c.n, t, b), out = []
  let prev = 0
  for (let i = 0; i < k; i++) {
    const r = Math.min(maxR, R0 * (G.size[0] + G.size[1] * rip) * G.sizes[i] * (1 - G.sizeJitter + 2 * G.sizeJitter * rng()))
    let pt = c.p, nn = c.n
    if (i > 0) {
      const ang = aH + (i === 1 ? -G.side : G.side) + (rng() - 0.5) * 0.4, d = (prev + r) * (G.gap[0] + (G.gap[1] - G.gap[0]) * rng()), q = offset(c.p, t, b, ang, d)
      const s = project ? project(q) : { p: q, n: c.n }; if (!s) continue
      pt = s.p; nn = norm(s.n)
    }
    const ctr = embed({ pt, n: nn, r }, G.emb); ctr[1] -= G.sag * r * rip
    out.push({ c: ctr, r, pt: pt.slice(), n: nn.slice(), rip, head: i === 0 })
    if (i === 0) prev = r
  }
  return out
}
// Nest (§1/§2): 1 groß, 3 mittlere bei −1,2 / 0,1 / 1,3 rad um die Hängerichtung im Abstand (R + r)·0,86·spread, kleine außen; Größen 1 : 0,62 : 0,38.
// p = Punkt auf der Oberfläche, dir = Normale dort; einfarbig (Farbe setzt der Aufrufer)
export function nest(p, dir, count = 5, scale = 1, { R0 = 0.15, rng = () => 0.5, spread = GRAMMAR.nest.spread, project = null, G = GRAMMAR } = {}) {
  const NS = G.nest, n0 = norm(dir), { t, b } = frame(n0), aH = hangAngle(n0, t, b), R = R0 * scale, out = []
  const size = (i) => R * NS.sizes[i === 0 ? 0 : i <= 3 ? 1 : 2] * (0.9 + 0.2 * rng())
  const place = (ang, d, r, role) => { const s = project ? project(offset(p, t, b, ang, d)) : { p: offset(p, t, b, ang, d), n: n0 }; if (s) out.push({ c: embed({ pt: s.p, n: s.n, r }, G.emb), r, pt: s.p.slice(), n: norm(s.n), role }) }
  place(0, 0, size(0), 'anchor')
  for (let i = 1; i <= Math.min(3, count - 1); i++) { const r = size(i); place(aH + NS.med[i - 1] + (rng() - 0.5) * 0.5, (R + r) * NS.k * spread * (0.9 + 0.3 * rng()), r, 'support') }
  for (let i = 4; i < Math.min(count, 4 + NS.small.length); i++) { const r = size(i); place(aH + NS.small[i - 4] + (rng() - 0.5) * 0.4, (R * 1.62 + r * 0.9) * spread * (0.9 + 0.3 * rng()), r, 'pebble') }
  return out
}
// Kontur-Regel an einer Pflanze (WS0 18.10. zu §78.3a): Abstand d/(r_a + r_b) liegt nie im Band 0,85–1,25. Paare darunter bis 1,05 werden zum
// gewollten Klumpen zusammengezogen (0,85), alle übrigen im Band auf Luft geschoben (1,25). Ändert items[].c, gibt items zurück.
export function relax(items, k = GRAMMAR.relaxK, gap = GRAMMAR.relaxGap, { pull = GRAMMAR.relaxPull, split = GRAMMAR.relaxSplit } = {}) {
  for (let it = 0; it < k; it++) for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const a = items[i], b = items[j], d = dist(a.c, b.c), s = a.r + b.r, q = d / s
    if (d <= 1e-9 || q <= pull + 1e-6 || q >= gap - 1e-6) continue
    const want = (q < split ? pull : gap) * s * (1 + 1e-4), move = mul(norm(sub(b.c, a.c)), (want - d) / 2); a.c = sub(a.c, move); b.c = add(b.c, move)
  }
  return items
}
// Fallobst: der reifste Stand wirft n Früchte ab, sie liegen mit (0,25 + 0,3·i) × Kronenradius Versatz Richtung Stamm → Stand (+ Gefälle), Radius R0·(0,95 − 0,12·i) (A6)
export function fall(src, n, { crownR = 1, centre = [0, 0, 0], R0 = 0.15, downhill = null, groundAt = () => 0, G = GRAMMAR } = {}) {
  let h = [src.p[0] - centre[0], 0, src.p[2] - centre[2]]; h = dot(h, h) < 1e-8 ? [0, 0, 1] : norm(h)
  if (downhill) { const d = [downhill[0], 0, downhill[2]]; if (dot(d, d) > 1e-6) h = norm(add(h, norm(d))) }
  const out = []
  for (let i = 0; i < n; i++) { const off = crownR * (G.fallOff[0] + G.fallOff[1] * i), x = src.p[0] + h[0] * off, z = src.p[2] + h[2] * off, r = R0 * (0.95 - 0.12 * i); out.push({ c: [x, groundAt(x, z) + r, z], r, ground: true }) }
  return out
}

// ---------------------------------------------------------------- Zahlen-Regeln (§0, Lesart A4)
const centreOf = (it) => it.c || it.anchor || it.body?.p || it.p
// items: [{ c | anchor | body.p, r }]. Ergebnis { n, odd, sameSize, spread, lines, nearTouch, ok, failed[] } (nearTouch ist seit WS0 18.10. eine Regel: Band 0,85–1,25 verboten)
export function ruleReport(items, R = GRAMMAR.rules) {
  const P = items.map(centreOf), r = items.map((it) => it.r ?? 1), n = items.length, nn = [], nnd = []
  for (let i = 0; i < n; i++) { let bj = -1, bd = Infinity; for (let j = 0; j < n; j++) if (j !== i) { const d = dist(P[i], P[j]); if (d < bd) { bd = d; bj = j } } nn.push(bj); nnd.push(bd) }
  const seen = new Set(); let sameSize = 0
  for (let i = 0; i < n; i++) { const j = nn[i], key = Math.min(i, j) + ':' + Math.max(i, j); if (j < 0 || seen.has(key)) continue; seen.add(key); if (Math.abs(r[i] - r[j]) / Math.max(r[i], r[j]) < R.sizeTol) sameSize++ }
  const fin = nnd.filter(Number.isFinite), mx = fin.length ? Math.max(...fin) : 0, spread = fin.length >= 2 && mx > 0 ? (mx - Math.min(...fin)) / mx : 1
  const near = (a, b) => dist(P[a], P[b]) <= (R.neighbourR * (r[a] + r[b])) / 2
  let lines = 0
  for (let m = 0; m < n; m++) for (let a = 0; a < n; a++) {
    if (a === m || !near(a, m)) continue
    for (let c = a + 1; c < n; c++) {
      if (c === m || !near(c, m)) continue
      const ac = sub(P[c], P[a]), L = len(ac), am = sub(P[m], P[a]), t = dot(am, ac) / (L * L)
      if (t > 0 && t < 1 && len(sub(am, mul(ac, t))) <= R.lineTol * L) lines++
    }
  }
  let nearTouch = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const q = dist(P[i], P[j]) / (r[i] + r[j]); if (q > R.overlap && q < R.air) nearTouch++ }
  const odd = n % 2 === 1, failed = [!odd && 'odd', sameSize > 0 && 'sameSizeAdjacent', spread < R.spread && 'neighbourSpread', lines > 0 && 'collinear', nearTouch > 0 && 'nearTouch'].filter(Boolean)
  return { n, odd, sameSize, spread: +spread.toFixed(4), lines, nearTouch, ok: failed.length === 0, failed }
}

// ---------------------------------------------------------------- Farbe (§3)
// Reife < 0,5 → dunkle V-292-Stufe; Comic auf grünem Laub nur die satte (A7). Ergebnis { tone: 'satt' | 'dunkel', color }
export function toneOf(kind, rip, { green = false, G = GRAMMAR } = {}) { const tone = rip < G.dark && !(green && kind === 'comic') ? 'dunkel' : 'satt'; return { tone, color: tone === 'dunkel' ? FLUFF[kind].dark : FLUFF[kind].color } }
function pickWeighted(w, rng, exclude = null) { const ks = FLUFF_KINDS.filter((k) => k !== exclude), tot = ks.reduce((a, k) => a + (w[k] || 0), 0); let x = rng() * tot; for (const k of ks) { x -= w[k] || 0; if (x < 0) return k } return ks[ks.length - 1] }
// Leitfarben für viele Pflanzen einer Zone exakt nach Gewicht (größter Rest, gemischt nach Seed): { id → kind }
export function assignLeads(ids, { main = null, weights = null, seed = 0, zone = 'zone' } = {}) {
  const w = weights || zoneWeights(main), c = countsFor(w, ids.length), kinds = FLUFF_KINDS.flatMap((k) => Array(c[k]).fill(k)), rng = rngOf('leads', zone, seed)
  for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]] }
  return Object.fromEntries(ids.map((id, i) => [id, kinds[i]]))
}

// ---------------------------------------------------------------- Eine Pflanze („gewachsen“)
// cands: Kandidaten wie candidates() (+ optional maxR, green); o: { carrier, crownR, centre, R0, project, lead, accent, groundAt, downhill }
function growOnce(cands, o, rng, G = GRAMMAR, drop = 0) {
  const car = o.carrier, Gs = Math.max(Math.min(3, cands.length), Math.min(G.stands[car], cands.length) - drop), md = o.crownR * (car === 'cactus' ? G.minDistKCactus : G.minDistK)
  const sc = cands.map((c) => ({ ...c, score: score(c, rng) }))
  let st = stands(sc, Gs, md, { top: car !== 'bush' }); if (st.length < Gs) st = stands(sc, Gs, md / 2, { top: false, fill: st }) // A3
  const acc = new Set(car === 'tree' ? [1, 4] : [st.length - 1]), hanging = []
  st.forEach((c, k) => {
    const rip = ripeness(c, rng), kind = acc.has(k) && st.length > 1 ? o.accent : o.lead, { tone, color } = toneOf(kind, rip, { green: !!c.green })
    for (const f of stand(c, rip, { R0: o.R0, rng, project: o.project, maxR: c.maxR ?? Infinity })) hanging.push({ ...f, kind, tone, color, stand: k, src: c.id ?? c.i })
  })
  relax(hanging)
  if (hanging.length % 2 === 0 && hanging.length) { const tail = hanging.filter((f) => !f.head), pool = tail.length ? tail : hanging, small = pool.reduce((a, f) => (f.r < a.r ? f : a)); hanging.splice(hanging.indexOf(small), 1) }
  if (ruleReport(hanging, G.rules).spread < G.rules.spread) { // zu gleichmäßig: das kleinste Paar Kopf–Folgefrucht wird zum gewollten Klumpen (d = 0,85·(r_a + r_b), Kontur-Regel WS0 18.10.)
    let best = null
    for (const f of hanging) { if (f.head) continue; const h = hanging.find((x) => x.head && x.stand === f.stand); if (h && (!best || f.r + h.r < best.f.r + best.h.r)) best = { f, h } }
    if (best) { const { f, h } = best, d = dist(f.c, h.c), need = G.relaxPull * (f.r + h.r); if (d > need) f.c = add(h.c, mul(norm(sub(f.c, h.c)), need)) }
  }
  let fallen = []
  const nf = G.fallen[car]
  if (nf && st.length) {
    const ri = st.map((c, k) => ({ c, k, v: G.rip.hs * (1 - c.hs) + G.rip.sun * (c.sun ?? 0) })).sort((a, b) => b.v - a.v || a.k - b.k)[0], kind = acc.has(ri.k) && st.length > 1 ? o.accent : o.lead
    fallen = fall(ri.c, nf, { crownR: o.crownR, centre: o.centre, R0: o.R0, downhill: o.downhill, groundAt: o.groundAt }).map((f) => ({ ...f, kind, ...toneOf(kind, 1), stand: ri.k }))
  }
  return { hanging, fallen, stands: st, report: ruleReport(hanging) }
}
// Mehrere Versuche mit abgeleitetem Seed, erster regelkonformer gewinnt, sonst der mit den wenigsten Verstößen (A4)
function growBest(cands, o, key, G = GRAMMAR) {
  let best = null, tries = 0
  for (let k = 0; k < G.rules.tries; k++) {
    const r = growOnce(cands, o, rngOf('grammar', key, o.seed ?? 0, k), G, Math.floor(k / 4)); tries = k + 1 // ab Versuch 5 je 4 Versuche ein Stand weniger
    const bad = r.report.failed.length * 1000 + r.report.lines + r.report.sameSize
    if (!best || bad < best.bad) best = { ...r, bad }
    if (r.report.ok) break
  }
  best.tries = tries; delete best.bad
  return best
}
function leadsOf(o, key) {
  const rng = rngOf('lead', key, o.seed ?? 0), w = o.weights || zoneWeights(o.main ?? null)
  const lead = o.lead ?? pickWeighted(w, rng), accent = o.accent ?? pickWeighted(w, rng, lead)
  if (!isKind(lead) || !isKind(accent)) throw new Error('GRAMMAR_KIND_UNKNOWN')
  return { lead, accent }
}
// Eine Pflanze über eine Oberfläche: opts { id, seed, carrier ('tree' | 'bigBush' | 'bush' | 'cactus'), crownR, centre (Kronenmitte), main | weights | lead/accent,
// groundAt?(x, z), downhill? }. Ergebnis { hanging, fallen, stands, report, lead, accent, tries }
export function grow(surface, opts = {}) {
  const carrier = opts.carrier || 'tree'; if (!CARRIERS.includes(carrier)) throw new Error('GRAMMAR_CARRIER_UNKNOWN: ' + carrier)
  const cast = typeof surface === 'function' ? surface : surface.raycast, centre = opts.centre || [0, 0, 0], crownR = opts.crownR ?? 1, key = opts.id ?? 'plant'
  const project = (q) => cast(norm(sub(q, centre))), { lead, accent } = leadsOf(opts, key)
  const o = { ...opts, carrier, crownR, centre, R0: opts.R0 ?? baseRadius(crownR), project, lead, accent }
  return { ...growBest(candidates(cast, opts.n ?? GRAMMAR.n, { carrier }), o, key), lead, accent }
}

// ---------------------------------------------------------------- KayKit-Baum aus den B2-Ankern
const placeFn = ({ pos = [0, 0, 0], rotY = 0, scale = 1 } = {}) => { const c = Math.cos(rotY), s = Math.sin(rotY); return { p: (v) => [pos[0] + (v[0] * c + v[2] * s) * scale, pos[1] + v[1] * scale, pos[2] + (-v[0] * s + v[2] * c) * scale], n: (v) => [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c] } }
// anchorsJson = geparstes kfb.tree-fluff-anchors.v1, treeId z. B. 'Tree_1_A_Color1'. opts: { id (Spawn-Kennung, Vorgabe treeId), zone, place { pos, rotY, scale },
// main | weights | lead/accent, terrain { heightAt, normalAt }?, bare }. Ergebnis { balls, hanging, fallen, report, meta }; balls im Format von fluff.js
// ({ id, key, kind, spawn, anchor, center, state: 'hanging', gen }) plus r, tone, color, rip, stand, drop (Abwurf-Reihenfolge: reifste zuerst); Fallobst liegt
// schon (state 'resting', body in Ruhe). Schlüssel `${zone}:${id}:f${i}` (Zone vor dem ersten „:“ für den Ernte-Stand).
export function fruitFromAnchors(anchorsJson, treeId, seed = 0, opts = {}) {
  if (anchorsJson?.schema !== 'kfb.tree-fluff-anchors.v1') throw new Error('GRAMMAR_ANCHORS_SCHEMA')
  const m = anchorsJson.models?.[treeId]; if (!m) throw new Error('GRAMMAR_TREE_UNKNOWN: ' + treeId)
  const id = opts.id ?? treeId, zone = opts.zone ?? 'zone', key = `${zone}:${id}`, empty = { balls: [], hanging: [], fallen: [], report: ruleReport([]), meta: { treeId, id, kind: m.kind, skipped: 'bare' } }
  if (m.kind === 'bare' && !opts.bare) return empty // A1
  const T = placeFn(opts.place), sc = opts.place?.scale ?? 1, [b0, b1] = m.bbox, crownR = (Math.max(b1[0] - b0[0], b1[2] - b0[2]) / 2) * sc
  const centre = T.p([(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2, (b0[2] + b1[2]) / 2]), base = T.p([(b0[0] + b1[0]) / 2, 0, (b0[2] + b1[2]) / 2])
  const terrain = opts.terrain || null, groundAt = terrain ? terrain.heightAt : () => base[1], downhill = terrain ? terrain.normalAt(base[0], base[2]) : null
  const cands = m.anchors.map((a, i) => { const n = norm(T.n(a.surfaceNormal || a.n)); return { i, id: a.id, d: norm(sub(T.p(a.p), centre)), p: T.p(a.p), n, hs: a.heightShare, sun: Math.max(0, dot(n, SUN)), maxR: (a.maxBallR ?? Infinity) * sc, green: !!a.bgColor && (a.contrastDE?.Comic ?? 100) < 40 } })
  const { lead, accent } = leadsOf({ ...opts, seed }, key)
  const o = { seed, carrier: 'tree', crownR, centre, R0: baseRadius(crownR), project: null, lead, accent, groundAt, downhill }
  const g = growBest(cands, o, key)
  const order = g.hanging.map((f, i) => ({ i, rip: f.rip, y: f.c[1] })).sort((a, b) => b.rip - a.rip || a.y - b.y || a.i - b.i), drop = new Map(order.map((e, k) => [e.i, k]))
  const ball = (f, i, extra) => ({ id: `${key}:f${i}`, key: `${key}:f${i}`, kind: f.kind, tone: f.tone, color: f.color, r: f.r, rip: f.rip ?? 1, stand: f.stand, spawn: id, anchor: f.c.slice(), center: base.slice(), gen: 0, ...extra })
  const hanging = g.hanging.map((f, i) => ball(f, i, { state: 'hanging', drop: drop.get(i) }))
  const fallen = g.fallen.map((f, j) => { const b = ball(f, hanging.length + j, { state: 'resting', ground: true }); b.body = { ...makeBody(f.c), mode: 'rest', r: f.r }; return b })
  return { balls: [...hanging, ...fallen], hanging, fallen, report: g.report, meta: { treeId, id, kind: m.kind, crownR: +crownR.toFixed(4), R0: +o.R0.toFixed(4), lead, accent, stands: g.stands.length, tries: g.tries, anchors: m.anchors.length } }
}
