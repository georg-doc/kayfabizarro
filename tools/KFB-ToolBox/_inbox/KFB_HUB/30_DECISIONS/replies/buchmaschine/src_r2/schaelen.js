// Seiten schälen · WebGL-Port von Codevember 09-membrane (Adam Chernick, MIT), Fall „flache Fläche“.
// Übernommen aus tiles.tsx: Einrollen über einen Zylinder hinter der Falz und danach gerade weiter (Vertex-Rechnung), je Kachel ein eigener
// Rollradius, Falz läuft von einer Kante zur anderen, eine fertige Kachel wird zur Schicht darunter (Schicht +1), lose Kacheln fallen wie Laub.
// Anders als im Spender: die Schichten sind Buchseiten (Doppelseiten aus einem Atlas), die Vorderseite bleibt die Originalgrafik, die Rückseite ist Papier.
// Keine Knete auf den Seiten (Buch = Originalgrafik). Licht kommt vom Host.
// createSchaelen({ THREE, atlas, zellen:[spalten, zeilen], seiten, breite, hoehe, spalten, zeilen, rng }) → { gruppe, flocken, welle(u,v), update(dt, weltVon), anzahl }
export function createSchaelen({ THREE, atlas, zellen = [4, 2], seiten = 8, breite = 1.8, hoehe = 1.255, spalten = 24, zeilen = 17, rng = Math.random, papier = '#ece5d6' }) {
  const N = spalten * zeilen, tw = breite / spalten, th = hoehe / zeilen, half = Math.min(tw, th) / 2
  // Spender-Werte (SIZE 0,15) auf unsere Kachelgröße skaliert
  const k = (half * 2) / 0.15
  const FOLD_START = half + 0.005 * k, FOLD_END = -half - 0.002 * k, CURL = 0.06 * k
  const geo = new THREE.PlaneGeometry(tw, th, 8, 8)
  const U = { uSpread: { value: new THREE.Vector2(breite, hoehe) }, uCells: { value: new THREE.Vector2(zellen[0], zellen[1]) }, uLayers: { value: seiten }, uCurl: { value: CURL }, uPapier: { value: new THREE.Color(papier) } }
  function material() {
    const m = new THREE.MeshStandardMaterial({ map: atlas, roughness: 0.9, metalness: 0, side: THREE.DoubleSide })
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U)
      sh.vertexShader = `attribute vec4 aTile; attribute vec2 aCurl; uniform vec2 uSpread; uniform float uCurl; varying vec2 vPageUv; varying float vLayer;
float kfbTh = 0.0, kfbAl = 0.0, kfbUp = 0.0, kfbAcross = 0.0; vec2 kfbAx = vec2(1.0, 0.0), kfbSd = vec2(0.0, 1.0);
` + sh.vertexShader
        .replace('#include <beginnormal_vertex>', `
  kfbAx = vec2(cos(aTile.z), sin(aTile.z)); kfbSd = vec2(-kfbAx.y, kfbAx.x);
  float kfbAlong = dot(position.xy, kfbAx); kfbAcross = dot(position.xy, kfbSd);
  float kfbStretch = abs(kfbAx.x) + abs(kfbAx.y);
  float kfbFold = aCurl.x * kfbStretch, kfbLift = aCurl.y;
  float kfbLuck = fract(sin(dot(aTile.xy * 91.7 + aTile.w * 1.73, vec2(12.9898, 78.233))) * 43758.5453);
  float kfbRad = (kfbLuck * 1.25 + 0.45) * uCurl * kfbStretch;
  float kfbA = kfbAlong - kfbFold;
  kfbTh = clamp(kfbA / kfbRad, 0.0, kfbLift);
  float kfbStraight = max(kfbA - kfbLift * kfbRad, 0.0);
  bool kfbLifted = kfbA > 0.0;
  kfbAl = kfbLifted ? kfbFold + sin(kfbTh) * kfbRad + kfbStraight * cos(kfbLift) : kfbAlong;
  kfbUp = kfbLifted ? kfbRad * (1.0 - cos(kfbTh)) + kfbStraight * sin(kfbLift) : 0.0;
  if (!kfbLifted) kfbTh = 0.0;
  vec3 objectNormal = vec3(kfbAx * -sin(kfbTh), cos(kfbTh));
  #ifdef USE_TANGENT
  vec3 objectTangent = vec3(tangent.xyz);
  #endif`)
        .replace('#include <begin_vertex>', `vec3 transformed = vec3(kfbAx * kfbAl + kfbSd * kfbAcross, kfbUp);
  vPageUv = aTile.xy + position.xy / uSpread; vLayer = aTile.w;`)
      sh.fragmentShader = `uniform vec2 uCells; uniform float uLayers; uniform vec3 uPapier; varying vec2 vPageUv; varying float vLayer;
` + sh.fragmentShader.replace('#include <map_fragment>', `
  float kfbL = mod(floor(vLayer + 0.5), uLayers);
  float kfbCol = mod(kfbL, uCells.x), kfbRow = floor(kfbL / uCells.x);
  vec2 kfbUv = vec2((kfbCol + clamp(vPageUv.x, 0.001, 0.999)) / uCells.x, (uCells.y - kfbRow - 1.0 + clamp(vPageUv.y, 0.001, 0.999)) / uCells.y);
  vec4 kfbTex = texture2D(map, kfbUv);
  diffuseColor.rgb *= gl_FrontFacing ? kfbTex.rgb : uPapier * 0.92;`)
    }
    m.customProgramCacheKey = () => 'kfb-schaelen-r1'
    return m
  }
  // drei Netze wie im Spender: Haut (schält), Schicht darunter (flach, Seite +1), lose Flocken
  const mk = (n) => { const im = new THREE.InstancedMesh(geo, material(), n); im.geometry = geo.clone(); im.frustumCulled = false
    const tile = new THREE.InstancedBufferAttribute(new Float32Array(n * 4), 4), curl = new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2)
    tile.setUsage(THREE.DynamicDrawUsage); curl.setUsage(THREE.DynamicDrawUsage); im.geometry.setAttribute('aTile', tile); im.geometry.setAttribute('aCurl', curl); return { im, tile, curl } }
  const haut = mk(N), unter = mk(N), CAP = 1600, lose = mk(CAP)
  const gruppe = new THREE.Group(); gruppe.name = 'seite-schaelen'
  gruppe.add(haut.im, unter.im)
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S1 = new THREE.Vector3(1, 1, 1)
  const spot = []
  for (let r = 0; r < zeilen; r++) for (let c = 0; c < spalten; c++) {
    const i = r * spalten + c, x = -breite / 2 + tw * (c + 0.5), y = -hoehe / 2 + th * (r + 0.5)
    spot.push({ x, y, u: (c + 0.5) / spalten, v: (r + 0.5) / zeilen })
    M.makeTranslation(x, y, 0.002); haut.im.setMatrixAt(i, M)
    M.makeTranslation(x, y, 0.0); unter.im.setMatrixAt(i, M)
  }
  const st = { start: new Float32Array(N).fill(-1), dauer: new Float32Array(N), roll: new Float32Array(N), achse: new Float32Array(N), schicht: new Float32Array(N), kick: new Float32Array(N) }
  for (let i = 0; i < N; i++) { st.achse[i] = 0; setHaut(i, FOLD_START, 0.3) }
  function setHaut(i, fold, lift) { const s = spot[i]; haut.tile.setXYZW(i, s.u, s.v, st.achse[i], st.schicht[i]); haut.curl.setXY(i, fold, lift)
    unter.tile.setXYZW(i, s.u, s.v, st.achse[i], st.schicht[i] + 1); unter.curl.setXY(i, FOLD_START, 0.3) }
  haut.tile.needsUpdate = haut.curl.needsUpdate = unter.tile.needsUpdate = unter.curl.needsUpdate = true
  let zeit = 0
  // Welle wie der Klick im Spender: von (u,v) aus läuft das Schälen nach außen
  function welle(u, v, { tempo = 0.9, wucht = 1, reichweite = Infinity } = {}) {
    for (let i = 0; i < N; i++) {
      if (st.start[i] >= 0) continue
      const s = spot[i], dx = (s.u - u) * breite, dy = (s.v - v) * hoehe, d = Math.hypot(dx, dy)
      if (d > reichweite * (0.85 + rng() * 0.3)) continue
      st.start[i] = zeit + d * tempo + rng() * 0.15
      st.dauer[i] = 0.8 + rng() * 0.6; st.roll[i] = 1.4 + rng() * 1.3; st.kick[i] = wucht * (0.7 + rng() * 0.6)
      st.achse[i] = Math.atan2(-dy, -dx) + (rng() - 0.5) * 0.6   // die Kante zur Welle hin hebt zuerst
    }
  }
  const flocken = []
  const tmpQ = new THREE.Quaternion(), achseV = new THREE.Vector3(), spinQ = new THREE.Quaternion(), normale = new THREE.Vector3()
  function update(dt, { welt, boden = 0, laufen = 1 } = {}) {
    zeit += dt * laufen
    let hautNeu = false
    for (let i = 0; i < N; i++) {
      const t0 = st.start[i]; if (t0 < 0 || zeit < t0) continue
      hautNeu = true
      const kk = Math.min(1, (zeit - t0) / st.dauer[i]), e = kk * kk * (3 - 2 * kk)
      let fold = FOLD_START + (FOLD_END - FOLD_START) * e, lift = 0.3 + e * (st.roll[i] - 0.3)
      if (kk >= 1) {
        st.start[i] = -1
        if (flocken.length < CAP && welt) {
          const s = spot[i]
          P.set(s.x, s.y, 0.004); welt.localToWorld(P); welt.getWorldQuaternion(tmpQ); normale.set(0, 0, 1).applyQuaternion(tmpQ)
          const f = flocken.length
          lose.tile.setXYZW(f, s.u, s.v, st.achse[i], st.schicht[i]); lose.curl.setXY(f, FOLD_END, st.roll[i])
          flocken.push({ p: P.clone(), v: normale.clone().multiplyScalar((0.35 + rng() * 0.25) * st.kick[i]).add(new THREE.Vector3((rng() - 0.5) * 0.15, 0.12, (rng() - 0.5) * 0.15)), q: tmpQ.clone(),
            spin: new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize().multiplyScalar(0.5 + rng() * 0.9), alter: 0, liegt: -1, ruhe: null, i: f })
        }
        st.schicht[i] += 1; fold = FOLD_START; lift = 0.3   // die Kachel ist jetzt die Schicht darunter
        unter.tile.setW(i, st.schicht[i] + 1); unter.tile.needsUpdate = true
      }
      haut.tile.setZ(i, st.achse[i]); haut.tile.setW(i, st.schicht[i]); haut.curl.setXY(i, fold, lift)
    }
    if (hautNeu) { haut.tile.needsUpdate = true; haut.curl.needsUpdate = true }
    // Flocken: wie Laub, schwingen hin und her, landen flach, verschwinden
    const LIE = 5
    for (let f = flocken.length - 1; f >= 0; f--) {
      const L = flocken[f]; L.alter += dt; const t = L.alter
      let weg = t > 9, skala = 1
      if (L.liegt < 0) {
        const settle = THREE.MathUtils.smoothstep(t, 0, 0.9), swing = Math.sin(t * 3.1 + f) * 1.1 * settle
        L.v.x += swing * dt; L.v.z += Math.cos(t * 2.3 + f * 0.7) * 0.8 * settle * dt; L.v.y -= 1.1 * settle * dt
        L.v.multiplyScalar(Math.exp(-dt * 1.6)); L.p.addScaledVector(L.v, dt)
        spinQ.setFromAxisAngle(achseV.copy(L.spin).normalize(), L.spin.length() * dt * (1 + Math.abs(swing) * 0.5)); L.q.multiply(spinQ)
        if (L.p.y <= boden) { L.liegt = t; L.p.y = boden; achseV.set(0, 0, 1).applyQuaternion(L.q); L.ruhe = new THREE.Quaternion().setFromUnitVectors(achseV.clone(), new THREE.Vector3(0, 1, 0)).multiply(L.q) }
      } else {
        const lie = t - L.liegt; weg = lie > LIE; if (L.ruhe) L.q.slerp(L.ruhe, 1 - Math.exp(-dt * 10))
        skala = 1 - THREE.MathUtils.smoothstep(lie, LIE - 1.5, LIE)   // sinkt weg
      }
      if (weg) {
        const last = flocken.length - 1
        if (f !== last) { flocken[f] = flocken[last]; lose.tile.copyAt(f, lose.tile, last); lose.curl.copyAt(f, lose.curl, last); flocken[f].i = f }
        flocken.pop(); continue
      }
      M.compose(L.p, L.q, S1.setScalar(Math.max(0.001, skala))); lose.im.setMatrixAt(f, M)
    }
    lose.im.count = flocken.length
    if (flocken.length) { lose.im.instanceMatrix.needsUpdate = true; lose.tile.needsUpdate = true; lose.curl.needsUpdate = true }
  }
  return { gruppe, flocken: lose.im, welle, update, anzahl: N, get zeit() { return zeit }, get lose() { return flocken.length }, beschaeftigt: () => st.start.some((s) => s >= 0) }
}
