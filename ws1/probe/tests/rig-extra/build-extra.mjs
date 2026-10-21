// Baut racers-extra.r1.json (Probe-RACERS-Format) und vehicle-rig-extra.r1.json (Spiel-Rig-Format) für die 8 neuen Racer.
// Zuordnung wie bei den 6 aus r1 (geprüft gegen deren v3-JSON): box = collision_hints.body_box (center/half_extents), hover = hover.FL/FR/RL/RR.pos,
// driver = anchors.kfb_driver_hidden.pos, cam.pos = anchors.kfb_camera_follow.pos, cam.target = [0, 1.59, 0] (bei allen 6 fest, nicht aus dem JSON),
// locomotion aus dem JSON, path = Asset-Pfad. Düsen: Auswahl aus survey-browser.raw.json (≤ 4 je Wagen), Rest als anchorsOptional; Farben aus colors-extra.json.
import fs from 'node:fs'
const HERE = new URL('.', import.meta.url).pathname, PORT = HERE + '../../port/'
const RAW = JSON.parse(fs.readFileSync(HERE + 'survey-browser.raw.json', 'utf8')), COL = JSON.parse(fs.readFileSync(HERE + 'colors-extra.json', 'utf8')).vehicles
const EIGHT = ['brasswing_roadster', 'iron_phantom_hovercar', 'ironclad_wrecker', 'jetbound_roadster', 'rust_runner', 'rustfire_interceptor', 'rustwing_hauler', 'wasteland_beetle']
// n = Kandidat nahe dieser Stelle (Heckansicht), m = Spiegel von, x = von Hand (pos/dir/r/conf)
const N = (id, near, note) => ({ id, near, note }), M = (id, of, note) => ({ id, mirrorOf: of, note }), X = (id, a) => ({ id, ...a })
const SEL = {
  brasswing_roadster: { use: [N('pod_L', [1.191, 0.438, -4.051]), N('pod_R', [-1.197, 0.436, -4.052])], opt: [] },
  iron_phantom_hovercar: {
    use: [N('pipe_upper_L', [0.661, 0.779, -4.195]), N('pipe_upper_R', [-0.661, 0.778, -4.197]), N('pipe_lower_L', [0.665, 0.428, -3.924]), N('pipe_lower_R', [-0.664, 0.427, -3.924])],
    opt: [X('quad_L', { pos: [1.227, 0.567, -3.906], dir: [0, 0, -1], r: 0.17, conf: 0.6, note: 'Vierer-Bündel außen als ein Strahler' }), X('quad_R', { pos: [-1.227, 0.567, -3.906], dir: [0, 0, -1], r: 0.17, conf: 0.5, note: 'Vierer-Bündel außen als ein Strahler (gespiegelt)' })] },
  ironclad_wrecker: {
    use: [N('jet_upper_L', [0.758, 1.668, -6.197]), N('jet_upper_R', [-0.764, 1.667, -6.196]), N('jet_lower_L', [0.827, 0.72, -6.258]), N('jet_lower_R', [-0.799, 0.689, -6.243])],
    opt: [N('turbine_center', [-0.002, 1.195, -5.487], 'zentrale Turbine, 0,7 vertieft')] },
  jetbound_roadster: {
    use: [N('jet_big_L', [1.027, 1.287, -4.387], 'Mittelkegel, nur Ringspalt vertieft'), M('jet_big_R', 'jet_big_L', 'gespiegelt (rechts nur als Ringspalt erkannt)'), N('jet_outer_L', [1.758, 1.346, -4.116]), N('jet_outer_R', [-1.768, 1.346, -4.116])],
    opt: [N('jet_upper_L', [1.012, 2.082, -4.404]), N('jet_upper_R', [-0.915, 2.099, -4.403])] },
  rust_runner: {
    use: [N('pipe_side_L', [1.558, 1.589, -4.025]), N('pipe_side_R', [-1.56, 1.589, -4.026]), N('pipe_low_L', [1.638, 1.081, -4.072]), N('pipe_low_R', [-1.643, 1.079, -4.075])],
    opt: [N('turret_main', [-0.005, 2.412, -4.025], 'Dachturm-Rohr, evtl. Kanone'), N('turret_pipe_L', [0.309, 2.008, -4.102]), N('turret_pipe_R', [-0.315, 2.009, -4.101])] },
  rustfire_interceptor: {
    use: [N('pipe_under_L', [0.903, 0.524, -3.837]), N('pipe_under_R', [-0.902, 0.528, -3.864]),
      X('stack_L', { pos: [1.15, 2.76, -4.1], dir: [0, 0.75, -0.661], r: 0.085, conf: 0.8, note: 'Kamin schräg nach oben-hinten, Schrägschnitt; Öffnung aus der Draufsicht (conf dort), Mitte/Achse von Hand aus den Eckpunkten' }),
      X('stack_R', { pos: [-1.15, 2.76, -4.1], dir: [0, 0.75, -0.661], r: 0.085, conf: 0.7, note: 'wie stack_L' })],
    opt: [] },
  rustwing_hauler: {
    use: [N('jet_pod_L_upper', [1.819, 3.234, -5.306]), N('jet_pod_R_upper', [-1.835, 3.237, -5.306]), N('jet_pod_L_lower', [1.715, 2.516, -5.301]), N('jet_pod_R_lower', [-1.728, 2.512, -5.296])],
    opt: [N('roof_stack_L', [0.937, 4.903, -1.408], 'Dach-Kamin, Mitte des Wagens'), N('roof_stack_R', [-0.945, 4.903, -1.405], 'Dach-Kamin, Mitte des Wagens')] },
  wasteland_beetle: {
    use: [X('exhaust_puff', { pos: [0, 1.3, -4.06], dir: [0, 0, -1], r: 0.1, conf: 0.1, note: 'keine Düse am Modell; Ersatz-Puff hinten am Auspufftopf (Platzhalter)' })], opt: [] },
}
const r3 = (v) => +(+v).toFixed(3), nrm = (d) => { const l = Math.hypot(...d) || 1; return d.map((v) => r3(v / l)) }
function resolve(vid, s, W) {
  if (s.pos) return { id: s.id, type: 'thrust', pos: s.pos.map(r3), dir: nrm(s.dir), radius: s.r, outerRadius: r3(s.r * 1.35), confidence: s.conf, note: s.note }
  const c = RAW[vid].candidates.filter((c) => c.confidence > 0).map((c) => ({ c, d: Math.hypot(c.pos[0] - s.near[0], c.pos[1] - s.near[1], c.pos[2] - s.near[2]) })).sort((a, b) => a.d - b.d)[0]
  if (!c || c.d > 0.1) throw new Error(vid + ' ' + s.id + ': kein Kandidat nahe ' + s.near)
  const k = c.c
  return { id: s.id, type: 'thrust', pos: k.pos, dir: k.dir, radius: k.radius, outerRadius: k.outerRadius ?? r3(k.radius * 1.35), confidence: k.confidence, note: s.note }
}
const size = (a, W) => { const d = 2 * Math.max(a.radius, a.outerRadius) / W; return d < 0.08 ? 's' : d < 0.17 ? 'm' : 'l' }
// Paare symmetrisch: Radius gemittelt, Richtung gespiegelt gemittelt (PCA-Rauschen), kleine Neigung (< 6°) → [0,0,-1]
function pairUp(list) {
  for (const a of list) {
    if (!/_L(_|$)|_L\d?$/.test(a.id)) continue
    const b = list.find((o) => o.id === a.id.replace(/_L(?=_|$|\d)/, '_R')); if (!b) continue
    const r = r3((a.radius + b.radius) / 2), o = r3((a.outerRadius + b.outerRadius) / 2)
    let d = nrm([(a.dir[0] - b.dir[0]) / 2, (a.dir[1] + b.dir[1]) / 2, (a.dir[2] + b.dir[2]) / 2])
    if (Math.acos(Math.min(1, -d[2])) < 6 * Math.PI / 180) d = [0, 0, -1]
    a.radius = b.radius = r; a.outerRadius = b.outerRadius = o; a.dir = d; b.dir = [r3(-d[0]), d[1], d[2]]
  }
}
const racers = [], rig = {}
for (const vid of EIGHT) {
  const j = JSON.parse(fs.readFileSync(HERE + 'json/' + vid + '.json', 'utf8')), A = j.anchors, W = j.dimensions.width[0]
  const build = (arr) => { const out = []; for (const s of arr) { if (s.mirrorOf) { const p = out.find((o) => o.id === s.mirrorOf); out.push({ ...p, id: s.id, pos: [r3(-p.pos[0]), p.pos[1], p.pos[2]], dir: [r3(-p.dir[0]), p.dir[1], p.dir[2]], confidence: r3(Math.max(0.1, p.confidence - 0.2)), note: s.note }) } else out.push(resolve(vid, s, W)) } pairUp(out); return out }
  const use = build(SEL[vid].use), opt = build(SEL[vid].opt)
  // Sichtprüfung Seitenansicht: Eisen-Phantom-Rohre liegen waagerecht, die Randebene ist nur schräg angeschnitten (PCA zeigte 20–35° nach oben)
  if (vid === 'iron_phantom_hovercar') for (const a of [...use, ...opt]) { a.dir = [0, 0, -1]; a.note = 'Richtung aus der Seitenansicht (Rohr waagerecht), Rand schräg angeschnitten' }
  const fin = (a) => { const o = { id: a.id, type: a.type, pos: a.pos, dir: a.dir, radius: a.radius, outerRadius: a.outerRadius, size: size(a, W), confidence: a.confidence }; if (a.note) o.note = a.note; return o }
  const bb = j.collision_hints.body_box
  // Räder-Fahrzeuge haben keine kfb_hover_*: Ersatz = Radaufstandspunkt (Nabe x/z, y = Nabe − Radius), damit Staub/Bodenpunkte an derselben Stelle sitzen
  const hover = ['FL', 'FR', 'RL', 'RR'].map((k) => j.hover?.[k]?.pos ?? (j.wheels?.[k] ? [j.wheels[k].hub_glTF[0], r3(Math.max(0, j.wheels[k].hub_glTF[1] - j.wheels[k].radius) + 0), j.wheels[k].hub_glTF[2]] : null))
  const hoverFrom = j.hover ? 'hover' : 'wheels'
  const glow = COL[vid].glow
  rig[vid] = { name_de: j.name_de, path: `media/3D_Assets/MeshyModels/vehicles/${vid}/${vid}_browser.v3.glb`, locomotion: j.locomotion, box: { c: bb.center, h: bb.half_extents }, hover,
    cam: { pos: A.kfb_camera_follow.pos, target: [0, 1.59, 0] }, driver: A.kfb_driver_hidden.pos, glow, anchors: use.map(fin) }
  if (hoverFrom === 'wheels') rig[vid].hoverNote = 'Räder: hover = Radaufstandspunkte (kfb_wheel_* Nabe, y = Nabe − Radius)'
  if (opt.length) rig[vid].anchorsOptional = opt.map(fin)
  racers.push({ id: vid, name: j.name_de, box: { c: bb.center, h: bb.half_extents }, hover, glow, anchors: use.map((a) => ({ type: a.type, pos: a.pos, dir: a.dir, r: a.radius })) })
  console.log(vid.padEnd(24), j.class, j.locomotion, 'hover', hoverFrom, JSON.stringify(hover), '| Anker', use.map((a) => `${a.id}:${a.confidence}`).join(' '), opt.length ? '| opt ' + opt.length : '')
}
fs.mkdirSync(PORT, { recursive: true })
fs.writeFileSync(PORT + 'racers-extra.r1.json', JSON.stringify(racers))
fs.writeFileSync(PORT + 'vehicle-rig-extra.r1.json', JSON.stringify({ schema: 'kfb.vehicle-rig/1',
  note: 'WS1 21.10. · 8 weitere Racer (rig-extra r1). Düsen-Anker heuristisch (Browser-Umfrage: GPU-Heckansicht + Erkennung aus thrust-survey r1, Sichtprüfung über Prüfbilder probe/tests/out/vehicles/<id>-anchors.png), höchstens 4 je Wagen, weitere unter anchorsOptional. Farben aus der Basisfarb-Textur (Regel r1, bei Rost/Messing ohne Akzent r1b, siehe colors-extra.json). cam.target fest wie bei den 6. GLB-Raum: +Z vorn, +X links, +Y oben, Rig-Einheiten.',
  source: { branch: 'assets/meshy-arcade3-marble-vehicles3-2026-10-16', commit: '9bd8e0376105b29375377ea3052e33528d50fbb6' }, vehicles: rig }, null, 1))
fs.writeFileSync(HERE + 'picks-final.json', JSON.stringify(Object.fromEntries(EIGHT.map((v) => [v, rig[v].anchors.map((a) => ({ ...a, r: a.radius }))]))))
fs.writeFileSync(HERE + 'picks-optional.json', JSON.stringify(Object.fromEntries(EIGHT.map((v) => [v, [...rig[v].anchors, ...(rig[v].anchorsOptional || []).map((a) => ({ ...a, type: 'fan' }))].map((a) => ({ ...a, r: a.radius }))]))))
