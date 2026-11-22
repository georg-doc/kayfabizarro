// Bild-Voxelrelief R1 (Georg 22.11. über WS0): jedes Bildmotiv (Doppelseite, KFB-Karte, Cover) wird ein Relief aus Voxel-Säulen.
// Tiefe aus dem Bild selbst: bunte Figuren und Motive treten vor, Papier, Textflächen und helle Hintergründe bleiben flach; Konturen leicht betont.
// Zwei Zustände: aufbauen (Säulen wachsen aus der Fläche oder fliegen ein) und zerfallen (Säulen brechen in Würfel, die purzeln, aufschlagen, liegen
// bleiben und versinken). Keine Splats. Licht kommt vom Host; das Material kann der Host übergeben (Standard: matte Würfel in der Bildpunktfarbe).
// Raum: Bild in der XY-Ebene der Gruppe, Mitte im Ursprung, Relief wächst nach +Z (wie die Schälhaut).
// createBildVoxel({ THREE, bild, breite, hoehe, spalten, tiefe, material, rng }) →
//   { gruppe, lose, aufbauen(u, v, opts), zerfallen(u, v, opts), update(dt, { boden }), stand() }
export function createBildVoxel({ THREE, bild, breite = 1.6, hoehe = 1.1, spalten = 120, tiefe = 0.16, material = null, rng = Math.random, papier = [0.94, 0.92, 0.88] }) {
  const zeilen = Math.max(1, Math.round(spalten * hoehe / breite)), N = spalten * zeilen
  const vs = breite / spalten, stufe = vs   // Würfelkante = Rasterweite, Höhe in ganzen Würfeln
  // 1) Bild auf das Raster rechnen (Mittelwert je Zelle)
  const cv = document.createElement('canvas'); cv.width = spalten; cv.height = zeilen
  const g = cv.getContext('2d', { willReadFrequently: true }); g.imageSmoothingQuality = 'high'; g.drawImage(bild, 0, 0, spalten, zeilen)
  const px = g.getImageData(0, 0, spalten, zeilen).data
  const farbe = new Float32Array(N * 3), roh = new Float32Array(N)
  for (let r = 0; r < zeilen; r++) for (let c = 0; c < spalten; c++) {
    const q = (r * spalten + c) * 4, i = (zeilen - 1 - r) * spalten + c   // Zeile 0 = unten
    const R = px[q] / 255, G = px[q + 1] / 255, B = px[q + 2] / 255
    farbe.set([R, G, B], i * 3)
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B), sat = mx > 0.02 ? (mx - mn) / mx : 0
    const abstand = Math.hypot(R - papier[0], G - papier[1], B - papier[2]) / 1.2   // Abstand zum Papierton
    const text = mx > 0.82 && sat < 0.14 ? 1 : 0   // helle, unbunte Flächen = Papier/Textkasten
    const bunt = Math.max(0, Math.min(1, (sat - 0.1) / 0.45))   // Motive leben von Farbe; unbunte dunkle Striche (Schrift) bleiben flach
    roh[i] = (1 - text) * Math.min(1, 0.8 * bunt + 0.35 * abstand * bunt + 0.12 * abstand)
  }
  // 2) glätten (Motive werden zusammenhängende Körper) und Konturen leicht betonen
  const glatt = (a, rad) => { const o = new Float32Array(N); for (let r = 0; r < zeilen; r++) for (let c = 0; c < spalten; c++) { let s = 0, n = 0
    for (let dr = -rad; dr <= rad; dr++) for (let dc = -rad; dc <= rad; dc++) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= zeilen || cc >= spalten) continue; s += a[rr * spalten + cc]; n++ }
    o[r * spalten + c] = s / n } return o }
  let tief = glatt(glatt(roh, 2), 1)
  const ziel = new Float32Array(N)
  for (let i = 0; i < N; i++) { const kontur = Math.max(0, roh[i] - tief[i]) * 0.8; const h = Math.pow(Math.min(1, tief[i] * 1.25 + kontur), 0.85) * tiefe
    ziel[i] = Math.max(stufe * 0.5, Math.round(h / stufe) * stufe) }   // in Würfelstufen, mindestens halbe Stufe (die Fläche bleibt geschlossen)
  // 3) Säulen als Instanzen
  const mat = material || new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0 })
  const box = new THREE.BoxGeometry(1, 1, 1).translate(0, 0, 0.5)   // Ursprung an der Unterseite: Höhe = scale.z
  const saeulen = new THREE.InstancedMesh(box, mat, N); saeulen.name = 'bildvoxel-saeulen'; saeulen.castShadow = saeulen.receiveShadow = true; saeulen.frustumCulled = false
  const col = new THREE.Color()
  const zelle = (i) => ({ c: i % spalten, r: Math.floor(i / spalten), x: -breite / 2 + vs * (i % spalten + 0.5), y: -hoehe / 2 + vs * (Math.floor(i / spalten) + 0.5), u: (i % spalten + 0.5) / spalten, v: (Math.floor(i / spalten) + 0.5) / zeilen })
  for (let i = 0; i < N; i++) { col.setRGB(farbe[i * 3], farbe[i * 3 + 1], farbe[i * 3 + 2], THREE.SRGBColorSpace); saeulen.setColorAt(i, col) }
  const gruppe = new THREE.Group(); gruppe.name = 'bildvoxel'; gruppe.add(saeulen)
  // Zustand je Säule: h (aktuelle Höhe), hv (Höhengeschwindigkeit), start, art (0 ruht, 1 wachsen, 2 einfliegen, 3 weg), Flug-Startpunkt
  const h = new Float32Array(N), hv = new Float32Array(N), start = new Float32Array(N).fill(-1), art = new Uint8Array(N), weg = new Uint8Array(N)
  const flugVon = new Float32Array(N * 3), flugDauer = new Float32Array(N)
  // lose Würfel (nach dem Zerfall), Weltraum
  const CAP = 45000, lose = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, CAP); lose.name = 'bildvoxel-wuerfel'; lose.castShadow = true; lose.frustumCulled = false; lose.count = 0
  const wuerfel = []   // { p, v, q, w, s, liegt, alter, farbeIdx }
  let zeit = 0
  const M = new THREE.Matrix4(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), E = new THREE.Euler()
  // versteckt (Höhe ≈ 0) = Maßstab 0, sonst bliebe die Deckfläche als Pixelbild stehen
  function setzeSaeule(i, hoeheJetzt, versatz = null) {
    const z = zelle(i); P.set(z.x, z.y, 0); if (versatz) P.add(versatz)
    if (hoeheJetzt <= 2e-4) S.set(0, 0, 0); else S.set(vs, vs, hoeheJetzt);; M.compose(P, Q.identity(), S); saeulen.setMatrixAt(i, M)
  }
  for (let i = 0; i < N; i++) setzeSaeule(i, 1e-4)
  saeulen.instanceMatrix.needsUpdate = true
  // aufbauen: art 'wachsen' (aus der Fläche, mit Überschwingen) oder 'einfliegen' (von verstreuten Punkten in Bögen an den Platz)
  function aufbauen(u, v, { art: a = 'wachsen', tempo = 1.2, reichweite = Infinity, verzoegerung = 0 } = {}) {
    for (let i = 0; i < N; i++) {
      const z = zelle(i), d = Math.hypot((z.u - u) * breite, (z.v - v) * hoehe); if (d > reichweite * (0.85 + rng() * 0.3)) continue
      if (art[i] === 1 || art[i] === 2) continue
      start[i] = zeit + verzoegerung + d * tempo + rng() * 0.12; weg[i] = 0
      if (a === 'einfliegen') { art[i] = 2; flugDauer[i] = 0.7 + rng() * 0.5; const t = rng() * Math.PI * 2, rr = 1.2 + rng() * 1.6
        flugVon.set([Math.cos(t) * rr, Math.sin(t) * rr * 0.6 + 0.8, 0.6 + rng() * 1.2], i * 3); h[i] = ziel[i] }
      else { art[i] = 1; h[i] = 1e-4; hv[i] = 0 }
    }
  }
  // zerfallen: Säulen brechen in Würfel; die Würfel bekommen Schwung weg von der Fläche, Schwerkraft zieht sie zu Boden
  function zerfallen(u, v, { tempo = 1.0, reichweite = Infinity, wucht = 1 } = {}) {
    for (let i = 0; i < N; i++) {
      if (weg[i] || start[i] <= -2) continue
      const z = zelle(i), d = Math.hypot((z.u - u) * breite, (z.v - v) * hoehe); if (d > reichweite * (0.85 + rng() * 0.3)) continue
      start[i] = -2 - (zeit + d * tempo + rng() * 0.15)   // negativ kodiert: Bruchzeitpunkt
      flugDauer[i] = wucht
    }
  }
  const wl = new THREE.Vector3(), nW = new THREE.Vector3(), gq = new THREE.Quaternion()
  function brich(i) {
    weg[i] = 1; art[i] = 0; if (h[i] < stufe * 0.3) { setzeSaeule(i, 1e-4); return }
    const stufen = Math.max(1, Math.round(h[i] / stufe)), z = zelle(i), wucht = flugDauer[i] || 1
    gruppe.updateMatrixWorld(true); gruppe.getWorldQuaternion(gq); nW.set(0, 0, 1).applyQuaternion(gq)
    const sk = gruppe.matrixWorld.getMaxScaleOnAxis()
    for (let k = 0; k < stufen && wuerfel.length < CAP; k++) {
      wl.set(z.x, z.y, stufe * (k + 0.5)).applyMatrix4(gruppe.matrixWorld)
      wuerfel.push({ p: wl.clone(), v: nW.clone().multiplyScalar((0.4 + rng() * 0.8) * wucht).add(new THREE.Vector3((rng() - 0.5) * 0.6, rng() * 0.5, (rng() - 0.5) * 0.6).multiplyScalar(wucht)),
        q: gq.clone(), w: new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(8 * wucht), s: vs * 0.97 * sk, liegt: -1, alter: 0, fi: i })
      col.setRGB(farbe[i * 3], farbe[i * 3 + 1], farbe[i * 3 + 2], THREE.SRGBColorSpace); lose.setColorAt(wuerfel.length - 1, col); if (lose.instanceColor) lose.instanceColor.needsUpdate = true
    }
    setzeSaeule(i, 1e-4)
  }
  function update(dt, { boden = 0, schwere = 6.5 } = {}) {
    zeit += dt
    let neu = false
    for (let i = 0; i < N; i++) {
      const s0 = start[i]
      if (s0 <= -2) { if (zeit >= -2 - s0) { start[i] = -1; brich(i); neu = true } continue }
      if (art[i] === 1 && s0 >= 0 && zeit >= s0) {   // wachsen: Feder zur Zielhöhe, unterkritisch gedämpft (Überschwingen)
        const k = 120, c = 2 * Math.sqrt(k) * 0.35; hv[i] += ((ziel[i] - h[i]) * k - hv[i] * c) * dt; h[i] = Math.max(1e-4, h[i] + hv[i] * dt)
        if (Math.abs(ziel[i] - h[i]) < 1e-4 && Math.abs(hv[i]) < 1e-3) { h[i] = ziel[i]; art[i] = 0 }
        setzeSaeule(i, h[i]); neu = true
      } else if (art[i] === 2 && s0 >= 0 && zeit >= s0) {   // einfliegen: Bogen vom Startpunkt, kurzes Nachfedern in der Höhe
        const k = Math.min(1, (zeit - s0) / flugDauer[i]), e = 1 - Math.pow(1 - k, 3)
        P.set(flugVon[i * 3] * (1 - e), flugVon[i * 3 + 1] * (1 - e), flugVon[i * 3 + 2] * (1 - e) + Math.sin(Math.PI * k) * 0.3)
        const squash = k >= 1 ? 1 : 1 + Math.sin(k * Math.PI * 3) * 0.15 * (1 - k)
        setzeSaeule(i, ziel[i] * squash, P); if (k >= 1) { art[i] = 0; setzeSaeule(i, ziel[i]) } neu = true
      }
    }
    if (neu) saeulen.instanceMatrix.needsUpdate = true
    // Würfel: Schwerkraft, Luftwiderstand, Aufschlag mit Abprall und Reibung, Kippen in Ruhe, dann liegen und versinken
    const LIEGEN = 4
    for (let f = wuerfel.length - 1; f >= 0; f--) {
      const W = wuerfel[f]; W.alter += dt
      if (W.liegt < 0) {
        W.v.y -= schwere * dt; W.v.multiplyScalar(Math.exp(-dt * 0.4)); W.p.addScaledVector(W.v, dt)
        const wl2 = W.w.length(); if (wl2 > 1e-5) W.q.premultiply(gq.setFromAxisAngle(nW.copy(W.w).divideScalar(wl2), wl2 * dt))
        const halb = W.s * 0.5
        if (W.p.y < boden + halb) { W.p.y = boden + halb
          if (Math.abs(W.v.y) > 0.6) { W.v.y = -W.v.y * 0.32; W.v.x *= 0.6; W.v.z *= 0.6; W.w.multiplyScalar(0.55) }   // Abprall
          else { W.liegt = W.alter; W.v.set(0, 0, 0); E.setFromQuaternion(W.q); const r90 = (a) => Math.round(a / (Math.PI / 2)) * (Math.PI / 2); W.ruhe = new THREE.Quaternion().setFromEuler(new THREE.Euler(r90(E.x), E.y, r90(E.z))) } }
      } else {
        if (W.ruhe) W.q.slerp(W.ruhe, 1 - Math.exp(-dt * 12))   // kippt flach auf eine Seite
        const lie = W.alter - W.liegt; if (lie > LIEGEN) W.p.y -= dt * W.s * 0.6   // versinkt im Boden
        if (lie > LIEGEN + 2) { const L = wuerfel.length - 1; wuerfel[f] = wuerfel[L]; wuerfel.pop(); if (f < L) { const fi = wuerfel[f].fi; col.setRGB(farbe[fi * 3], farbe[fi * 3 + 1], farbe[fi * 3 + 2], THREE.SRGBColorSpace); lose.setColorAt(f, col); lose.instanceColor.needsUpdate = true } continue }
      }
    }
    for (let f = 0; f < wuerfel.length; f++) { const W = wuerfel[f]; M.compose(W.p, W.q, S.setScalar(W.s)); lose.setMatrixAt(f, M) }
    lose.count = wuerfel.length
    if (wuerfel.length) lose.instanceMatrix.needsUpdate = true
  }
  return { gruppe, lose, aufbauen, zerfallen, update, spalten, zeilen, stand: () => ({ saeulen: N, wuerfel: wuerfel.length, zeit }) }
}
