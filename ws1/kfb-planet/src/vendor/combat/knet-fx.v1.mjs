/* WS1 combat-av-r1 · knet-fx.v1 (Prototyp, nicht mergen) · Top-10 Nr. 4 + 8
 * Treffer als Knet-Masse (V-499: eine Masse mit Ausbuchtungen, 2 Töne + dunkler Saum, Emission nur am Effekt selbst)
 * und Kill am Ort (Knet-Puff + „PLOPP!“ als Weltwort über dem Gegner statt Toast im HUD).
 *   const kx = createKnetFx(THREE, parent, { cap: 24 })
 *   kx.hit(pos, { energy: 'kinetic'|'electric'|'melee', size })   // Pop 0→1,15→1 in 3 Bildern, hält, platzt als Ring
 *   kx.pop(pos, { size, word: 'PLOPP!', top })                    // Kill: 5 Kuppeln wachsen + sinken, Wort springt über dem Gegner
 *   kx.step(dt)                                                    // feste Pools, keine Allokation im Bild
 * Eigener Code (keine Fremdquelle). Farben je Energie, Licht von oben-vorn wie das Arena-Rig (keine eigene Lampe). */
const TONES = {
  kinetic: { lit: 0xf4d35e, shade: 0xe89b3c, saum: 0x7a3e1a },
  electric: { lit: 0xd6f6ff, shade: 0x7cc8e8, saum: 0x1f5a7a },
  melee: { lit: 0xfff4e2, shade: 0xd9c6a8, saum: 0x6a5440 },
  ink: { lit: 0xefe6f5, shade: 0xb9a6c9, saum: 0x4a3a5a },
  hurt: { lit: 0xf26b4f, shade: 0xb83a2a, saum: 0x4a1410 }   // r9: Spieler getroffen
};
const VERT = `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;
const FRAG = `uniform vec3 uLit, uShade, uSaum; uniform float uOp; varying vec3 vN; varying vec3 vV;
void main(){ vec3 L = normalize(vec3(0.35, 0.85, 0.4)); float d = dot(normalize(vN), L);
  vec3 c = d > -0.1 ? uLit : uShade;                       // zwei harte Töne (r8 T2: Schwelle −0,1, von oben mehr heller Ton)
  float rim = 1.0 - max(0.0, dot(normalize(vN), vV)); if (rim > 0.72) c = uSaum;   // dunkler Saum
  gl_FragColor = vec4(c, uOp); }`;

function lumpGeo(THREE, seed) {
  const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position, v = new THREE.Vector3()
  // 5 Ausbuchtungen je Variante: Masse mit Beulen statt Stern-Zacken
  const bumps = [...Array(5)].map((_, i) => { const a = seed * 1.7 + i * 2.39996, z = Math.cos(i * 1.3 + seed) * 0.8
    return { d: new THREE.Vector3(Math.cos(a) * Math.sqrt(1 - z * z), z, Math.sin(a) * Math.sqrt(1 - z * z)), k: 0.22 + 0.12 * ((i * 7 + seed * 3) % 5) / 5 } })
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); let r = 1
    for (const b of bumps) { const t = Math.max(0, v.dot(b.d)); r += b.k * Math.pow(t, 6) }
    if (v.y < -0.35) r *= 0.82 + 0.18 * (1 + v.y) / 0.65            // flachere Unterseite
    p.setXYZ(i, v.x * r, v.y * r, v.z * r) }
  g.computeVertexNormals(); return g
}
function ringTex(THREE) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')
  g.strokeStyle = '#ffffff'; g.lineWidth = 14; g.beginPath(); g.arc(64, 64, 50, 0, Math.PI * 2); g.stroke()
  const t = new THREE.CanvasTexture(c); return t }
function wordTex(THREE, word) { const c = document.createElement('canvas'); c.width = 512; c.height = 160; const g = c.getContext('2d')
  g.font = '900 104px "Bangers","Luckiest Guy","Impact",system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'
  g.lineWidth = 18; g.strokeStyle = '#4a2410'; g.strokeText(word, 256, 84); g.fillStyle = '#f2b33a'; g.fillText(word, 256, 84)
  g.fillStyle = 'rgba(255,248,226,.9)'; g.fillText(word, 252, 78); g.fillStyle = '#f2b33a'; g.save(); g.beginPath(); g.rect(0, 84, 512, 80); g.clip(); g.fillText(word, 256, 84); g.restore()   // zwei Töne: oben hell, unten Gold
  const t = new THREE.CanvasTexture(c); return t }

export function createKnetFx(THREE, parent, { cap = 24 } = {}) {
  const root = new THREE.Group(); root.name = 'ws1-knet-fx'; parent.add(root)
  const geos = [1, 2, 3, 4].map((s) => lumpGeo(THREE, s)), rt = ringTex(THREE), words = new Map()
  const mk = () => { const m = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: true,
      uniforms: { uLit: { value: new THREE.Color() }, uShade: { value: new THREE.Color() }, uSaum: { value: new THREE.Color() }, uOp: { value: 1 } } })
    const mesh = new THREE.Mesh(geos[0], m); mesh.visible = false; mesh.renderOrder = 6; root.add(mesh)
    const rm = new THREE.SpriteMaterial({ map: rt, transparent: true, depthWrite: false, depthTest: true }); const ring = new THREE.Sprite(rm); ring.visible = false; ring.renderOrder = 7; root.add(ring)
    return { mesh, ring, t: 0, life: 0, live: false, kind: 'hit', size: 1, sink: 0, rise: 0 } }
  const pool = [...Array(cap)].map(mk); let next = 0
  const wpool = [...Array(4)].map(() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 9; root.add(s); return { s, t: 0, live: false, y0: 0 } }); let wnext = 0
  const take = () => { const e = pool[next]; next = (next + 1) % cap; return e }
  const tone = (e, k) => { const T = TONES[k] || TONES.kinetic, u = e.mesh.material.uniforms; u.uLit.value.setHex(T.lit); u.uShade.value.setHex(T.shade); u.uSaum.value.setHex(T.saum); e.ring.material.color.setHex(T.lit) }
  const spawn = (pos, size, kind, k, i = 0) => { const e = take(); e.mesh.geometry = geos[(i + next) % geos.length]; tone(e, k)
    e.mesh.position.set(pos.x, pos.y, pos.z); { const h = (k) => (Math.abs(Math.sin(pos.x * 12.9898 + pos.z * 78.233 + k) * 43758.5453) % 1) * 6.28; e.mesh.rotation.set(h(1), h(2), 0) }   /* r10-Fix: deterministisch (Boden C10) */  e.ring.position.copy(e.mesh.position)
    e.mesh.scale.setScalar(1e-3); e.ring.scale.setScalar(1e-3)   // r7-Fix: ohne das zeichnete das erste Bild einen Körper mit 1 u Radius
    e.size = size; e.kind = kind; e.t = 0; e.life = kind === 'hit' ? 0.32 : 0.62; e.live = true; e.mesh.visible = true; e.ring.visible = false; e.mesh.material.uniforms.uOp.value = 1; return e }
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3)
  return {
    root,
    hit(pos, { energy = 'kinetic', size = 0.24, quick = false } = {}) { const e = spawn(pos, size, 'hit', energy); if (quick) { e.life = 0.18; e.ts = 0.32 / 0.18 } else e.ts = 1 },   // quick: Cast/Sehne (r7)
    pop(pos, { size = 0.3, word = 'PLOPP!', top = 1.2, energy = 'ink' } = {}) {
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2 + 0.5, r = size * 1.6   // r8 T3: 3 Kuppeln mit Abstand statt 5 im Klumpen
        const e = spawn({ x: pos.x + Math.cos(a) * r, y: pos.y + size * 0.4, z: pos.z + Math.sin(a) * r }, size * (i ? 0.8 : 1.05), 'puff', energy, i); e.t = -i * 0.04 }
      if (word) { const w = wpool[wnext]; wnext = (wnext + 1) % wpool.length
        if (!words.has(word)) words.set(word, wordTex(THREE, word)); w.s.material.map = words.get(word); w.s.material.needsUpdate = true
        w.s.position.set(pos.x, pos.y + top, pos.z); w.s.scale.setScalar(1e-3); w.y0 = pos.y + top; w.t = 0; w.live = true; w.s.visible = true } },   // r7-Fix: Startmaßstab
    step(dt) {
      for (const e of pool) { if (!e.live) continue; e.t += dt; if (e.t < 0) { e.mesh.visible = false; continue } e.mesh.visible = true
        const t = e.kind === 'hit' ? e.t * (e.ts || 1) : e.t, s = e.size
        if (e.kind === 'hit') {
          // Pop in 3 Bildern (0,05 s) auf 1,15, zurück auf 1, halten, dann platzen: Masse schrumpft, Ring läuft aus
          const k = t < 0.05 ? 1.15 * ease(t / 0.05) : t < 0.09 ? 1.15 - 0.15 * (t - 0.05) / 0.04 : t < 0.2 ? 1 + 0.03 * Math.sin(t * 60) : Math.max(0, 1 - (t - 0.2) / 0.08)
          e.mesh.scale.setScalar(s * k)
          if (t >= 0.2) { const r = ease((t - 0.2) / 0.12); e.ring.visible = true; e.ring.scale.setScalar(s * (1.4 + 2.2 * r)); e.ring.material.opacity = 1 - r }
        } else {
          // Kill-Puff: Kuppeln wachsen mit Überschwingen, sinken und flachen ab
          const g = t < 0.12 ? 1.12 * ease(t / 0.12) : t < 0.2 ? 1.12 - 0.12 * (t - 0.12) / 0.08 : 1, f = Math.max(0, (t - 0.3) / 0.32)
          e.mesh.scale.set(s * g * (1 + 0.3 * f), s * g * (1 - 0.85 * f), s * g * (1 + 0.3 * f)); e.mesh.position.y -= dt * s * 0.6 * (t > 0.3 ? 1 : 0)
          e.mesh.material.uniforms.uOp.value = 1 - Math.max(0, (t - 0.5) / 0.12)
        }
        if (e.t >= e.life) { e.live = false; e.mesh.visible = false; e.ring.visible = false } }
      for (const w of wpool) { if (!w.live) continue; w.t += dt; const t = w.t
        const k = t < 0.12 ? 1.2 * ease(t / 0.12) : t < 0.22 ? 1.2 - 0.2 * (t - 0.12) / 0.1 : 1
        w.s.scale.set(1.95 * k, 0.61 * k, 1);   // r8 T1: Wort ×1,3 w.s.position.y = w.y0 + 0.45 * ease(t / 0.6); w.s.material.opacity = 1 - Math.max(0, (t - 0.5) / 0.2)
        if (t >= 0.7) { w.live = false; w.s.visible = false } }
    },
    dispose() { root.parent?.remove(root); geos.forEach((g) => g.dispose()); rt.dispose(); for (const t of words.values()) t.dispose(); for (const e of pool) { e.mesh.material.dispose(); e.ring.material.dispose() } for (const w of wpool) w.s.material.dispose() }
  }
}

/* WS1 combat-av-r1 r4 · Top-10 Nr. 3 „Gegner kündigt an“: macht das vorhandene Ausholen (m._windup = 0,42 s, gunfight) sichtbar.
 *   const tg = createTelegraph(THREE, parent)
 *   tg.start(key, pos, r) · tg.set(key, pos, p 0..1) · tg.end(key, fired)
 * Ring zieht sich um den Gegner zusammen (2,4 r → 1,0 r) und wird kräftiger; beim Abwurf platzt er kurz auf. Zwei Töne + Saum. */
function teleTex(THREE) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')
  g.lineWidth = 16; g.strokeStyle = '#7a3e1a'; g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.stroke()   // Saum
  g.lineWidth = 10; g.strokeStyle = '#f0a24a'; g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.stroke()   // Ton 1
  g.lineWidth = 4; g.strokeStyle = '#ffd88a'; g.beginPath(); g.arc(64, 64, 49, -2.6, -0.6); g.stroke()       // Ton 2 (Lichtkante oben)
  return new THREE.CanvasTexture(c) }
export function createTelegraph(THREE, parent, { cap = 8 } = {}) {
  const root = new THREE.Group(); root.name = 'ws1-telegraph'; parent.add(root); const tex = teleTex(THREE)
  const pool = [...Array(cap)].map(() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 8; root.add(s); return { s, key: null, r: 1, pop: 0 } })
  const find = (k) => pool.find((e) => e.key === k)
  return {
    start(key, pos, r = 0.5) { const e = find(key) || pool.find((x) => !x.key && x.pop <= 0) || pool[0]; e.key = key; e.r = r; e.pop = 0; e.s.visible = true; e.s.position.set(pos.x, pos.y, pos.z); e.s.scale.setScalar(r * 4.8); e.s.material.opacity = 0.25 },
    set(key, pos, p) { const e = find(key); if (!e) return; const q = 1 - Math.pow(1 - Math.min(1, p), 2)
      e.s.position.set(pos.x, pos.y, pos.z); e.s.scale.setScalar(e.r * 2 * (2.4 - 1.4 * q)); e.s.material.opacity = 0.25 + 0.75 * Math.min(1, p * 1.4) },
    end(key, fired = false) { const e = find(key); if (!e) return; e.key = null; if (fired) { e.pop = 0.12 } else e.s.visible = false },
    step(dt) { for (const e of pool) if (!e.key && e.pop > 0) { e.pop -= dt; const k = 1 - e.pop / 0.12; e.s.scale.setScalar(e.r * 2 * (1 + 0.8 * k)); e.s.material.opacity = 1 - k; if (e.pop <= 0) e.s.visible = false } },
    dispose() { root.parent?.remove(root); tex.dispose(); pool.forEach((e) => e.s.material.dispose()) }
  }
}

/* WS1 combat-av-r1 r7 · Top-10 Nr. 7 „Abgang sichtbar“: kurzes Band hinter eigenen Geschossen (0,22 s, Breite 0,06 u, dünn auslaufend).
 * Mitte heller Ton, Rand dunkler Saum (zwei Töne), zur Kamera gedreht; eigener Code nach dem Speedline-Prinzip der Gelände-Probe.
 *   const tr = createTrails(THREE, parent); tr.step(dt, camera, [{ id, pos: Vector3, energy }]) */
const TRAIL_TONES = { kinetic: [0xf4d35e, 0x7a3e1a], electric: [0xd6f6ff, 0x1f5a7a], melee: [0xfff4e2, 0x6a5440] }
export function createTrails(THREE, parent, { cap = 16, n = 12, life = 0.22, width = 0.06 } = {}) {
  const root = new THREE.Group(); root.name = 'ws1-trails'; parent.add(root)
  const VS = 'attribute float aS; attribute float aT; varying float vS; varying float vT; void main(){ vS=aS; vT=aT; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }'
  const FS = 'uniform vec3 uLit, uSaum; varying float vS; varying float vT; void main(){ float a = pow(1.0-clamp(vT,0.0,1.0),1.3); if(a<0.03) discard; vec3 c = abs(vS)>0.62 ? uSaum : uLit; gl_FragColor=vec4(c,a); }'
  const slots = [...Array(cap)].map(() => { const g = new THREE.BufferGeometry(), pos = new Float32Array(n * 6), as = new Float32Array(n * 2), at = new Float32Array(n * 2), idx = []
    for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) } for (let i = 0; i < n; i++) { as[i * 2] = -1; as[i * 2 + 1] = 1 }
    g.setIndex(idx); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.BufferAttribute(as, 1)); g.setAttribute('aT', new THREE.BufferAttribute(at, 1))
    const m = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uLit: { value: new THREE.Color() }, uSaum: { value: new THREE.Color() } } })
    const mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; mesh.visible = false; mesh.renderOrder = 5; root.add(mesh); return { mesh, g, pos, at, pts: [], id: null, t: 0 } })
  const byId = new Map(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  return {
    root,
    step(dt, camera, items) {
      const seen = new Set(); let now = 0
      for (const sl of slots) { sl.t += dt; now = Math.max(now, sl.t) }
      for (const it of items) { seen.add(it.id); let sl = byId.get(it.id)
        if (!sl) { sl = slots.find((x) => !x.id && !x.pts.length) || slots.reduce((m, x) => (x.t < m.t ? x : m)); if (sl.id) byId.delete(sl.id); sl.id = it.id; sl.pts = []; sl.t = 0; byId.set(it.id, sl)
          const T = TRAIL_TONES[it.energy] || TRAIL_TONES.kinetic; sl.mesh.material.uniforms.uLit.value.setHex(T[0]); sl.mesh.material.uniforms.uSaum.value.setHex(T[1]) }
        const h = sl.pts[0]; if (!h || h.p.distanceTo(it.pos) > 0.05) sl.pts.unshift({ p: it.pos.clone(), t: sl.t }) }
      for (const sl of slots) { if (sl.id && !seen.has(sl.id)) { byId.delete(sl.id); sl.id = null }   // Geschoss weg: Band läuft aus
        while (sl.pts.length > n || (sl.pts.length && sl.t - sl.pts[sl.pts.length - 1].t > life)) sl.pts.pop()
        const k = sl.pts.length; sl.mesh.visible = k >= 2; if (k < 2) continue
        for (let i = 0; i < n; i++) { const q = sl.pts[Math.min(i, k - 1)], qa = sl.pts[Math.max(0, Math.min(i, k - 1) - 1)], qb = sl.pts[Math.min(k - 1, Math.min(i, k - 1) + 1)]
          a.subVectors(qa.p, qb.p); b.subVectors(camera.position, q.p); c.crossVectors(a, b); const age = Math.min(1, (sl.t - q.t) / life), w = width * (1 - age) * (i >= k ? 0 : 1)
          c.multiplyScalar(w / (c.length() || 1)); sl.pos.set([q.p.x - c.x, q.p.y - c.y, q.p.z - c.z, q.p.x + c.x, q.p.y + c.y, q.p.z + c.z], i * 6); sl.at[i * 2] = sl.at[i * 2 + 1] = i >= k ? 1 : age }
        sl.g.attributes.position.needsUpdate = true; sl.g.attributes.aT.needsUpdate = true }
    },
    dispose() { root.parent?.remove(root); slots.forEach((s) => { s.g.dispose(); s.mesh.material.dispose() }) }
  }
}
