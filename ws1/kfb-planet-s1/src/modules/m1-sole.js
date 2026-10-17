// M1 · Sohlenpunkte aus dem Netz (Prüfer M1-3, Befund 5): Die Ursprünge der Knochen foot/toes liegen auf FB v5b ≈ 8 cm über der Sohle. Ferse bzw. Ballen
// = tiefster Hautpunkt, der überwiegend am Knochen foot.* bzw. toes.* hängt, in der Bindepose bestimmt und im Raum des Knochens gespeichert. Danach
// folgt der Punkt dem Knochen: welt = bone.matrixWorld · offset. Gleicher Code im Spiel (Bodenangleich, Messung) und in Node (Referenz, Eigentempo).
// Ohne three-Instanz-Annahmen: THREE wird übergeben.
export const SOLE_BONES = ['foot.l', 'toes.l', 'foot.r', 'toes.r']

// fig: geladene Figur in Bindepose (vor jedem Clip). Liefert { 'foot.l': { bone, offset: Vector3 }, … } oder wirft, wenn ein Knochen fehlt.
export function soleOffsets(THREE, fig) {
  const san = (n) => THREE.PropertyBinding.sanitizeNodeName(n)
  const want = new Map(SOLE_BONES.map((n) => [san(n), n]))
  const bones = {}; fig.traverse((o) => { if (o.isBone && want.has(o.name)) bones[want.get(o.name)] = o })
  for (const n of SOLE_BONES) if (!bones[n]) throw new Error('Sohlenknochen fehlt: ' + n)
  fig.updateMatrixWorld(true)
  const low = Object.fromEntries(SOLE_BONES.map((n) => [n, null])), v = new THREE.Vector3()
  fig.traverse((m) => {
    if (!m.isSkinnedMesh || !m.geometry?.attributes?.skinIndex) return
    const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, arr = m.skeleton.bones
    for (let i = 0; i < g.attributes.position.count; i++) {
      let best = 0, bw = -1; for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; best = si.getComponent(i, j) } }
      const b = arr[best]; const key = b && [...want.entries()].find(([s]) => s === b.name)?.[1]; if (!key) continue
      m.getVertexPosition(i, v); m.localToWorld(v) // gehäutet in Bindepose
      if (!low[key] || v.y < low[key].y) low[key] = v.clone()
    }
  })
  const out = {}
  for (const n of SOLE_BONES) {
    if (!low[n]) throw new Error('keine Hautpunkte an ' + n)
    const inv = new THREE.Matrix4().copy(bones[n].matrixWorld).invert()
    out[n] = { bone: bones[n], offset: low[n].clone().applyMatrix4(inv) }
  }
  return out
}

// Weltlage der vier Sohlenpunkte (Ferse = foot.*, Ballen = toes.*) – Knochen-Weltmatrizen müssen aktuell sein
export function solePoints(THREE, soles, out = {}) {
  for (const n of SOLE_BONES) { const s = soles[n]; s.bone.updateWorldMatrix(true, false); (out[n] ||= new THREE.Vector3()).copy(s.offset).applyMatrix4(s.bone.matrixWorld) }
  return out
}

