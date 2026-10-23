// kfb-groundfx.v1 · WS1 · V-632 (Georg 22.10.): ein Modul für Licht- und Ring-Effekte ohne echte Lichter.
// Prinzip: ein leuchtender Körper am Anker (makeGlow, makeBeam) plus ein Effekt, der aufs Gelände projiziert wird – im Shader des Empfängers, je Pixel
// aus der Weltlage gerechnet, folgt also jeder Geländeform (Hang, Mulde, Kante). Keine flachen Scheiben (Lehre V-572).
// Formen:
//   cone  Kegel-Projektion von einem Ursprung entlang dir (Scheinwerfer, Disco-Strahler, Laternen). Rechnung 1:1 wie kfb-light-pool.v1.
//   pool  runde Pfütze senkrecht von oben (Radius, weicher Rand), reicht vom Ursprung `range` nach unten.
//   ring  Ring senkrecht von oben (Radius, Breite) – Boombox-Ringe, Treffer, Landungen.
//   beam2 Kontaktlicht eines Scheinwerfer-Paars (Georg 22.10., Lichtbild 23.10.: Einlauf, Maximum ≈ 0,6 L, rundes weiches Ende über die letzten 30 %): Bodenpunkte, die IM Volumen zweier elliptischer Kegelstümpfe liegen (Lampen bei origin ± half·R,
//         gemeinsame Achse dir, Startradius r0, Spreizung tanH/tanV, Länge len) – derselbe Kegel wie das sichtbare Mesh, Rand weich in Metern, Längenausblendung;
//         beide Kegel addiert und weich gekappt (Überlappung heller, brennt nicht aus). 1 Platz für beide Lampen.
// Werte je Eintrag: { form, origin, dir, angle, soft, color, intensity, range, radius, width }; Kegel optional elliptisch: angleH, angleV (rad), startH (waagrechte Startbreite, Kegelstumpf), lowerOnly (senkrecht nur die Unterkante, Ende über range), flat (gleichmäßig statt Einfallswinkel). Zeitkurven laufen auf der CPU (curves, createRingEmitter).
// Mischer: mehrere Besitzer (Scheinwerfer, Disco, Boombox, Laternen) teilen sich die Plätze: fx.channel(owner, { priority }).set(list).
//   Zu viele Einträge: höhere Priorität zuerst, dann näher am Fokus (fx.setFocus, z. B. Kamera). channel.setPools = set (Format kfb-light-pool.v1).
// Empfänger: fx.injectStandard(material) für MeshStandard/Physical/Lambert/Toon (auch nach fremdem onBeforeCompile, z. B. terrain3);
//   eigene ShaderMaterials: Object.assign(uniforms, fx.uniforms), fx.glsl einfügen, col += kfbGroundFx(worldPos, normal, albedo).
// Kosten: eine Gitter-Karte (Standard 64 × 64 Zellen über 128 m um den Fokus) merkt je Zelle, welche Plätze sie treffen können. Pixel ohne Treffer lesen
//   nur ein Texel und rechnen nichts; die Schleife läuft nur über die Plätze der eigenen Zelle (Messung 22.10.: Schleife über alle 16 kostete je Pixel
//   auch ohne Effekt ≈ 3,7 ms bei 1,6 Mpx). Effekte außerhalb des Gitters werden nicht gezeichnet – Fokus (Kamera bzw. Wagen) jedes Bild setzen.
// Rahmenunabhängig: THREE wird übergeben (r147 global oder r186 als Modul), kein DOM nötig außer für die Glüh-Textur.
export const VERSION = 'kfb-groundfx.v1'
export const FORMS = Object.freeze({ cone: 0, pool: 1, ring: 2, beam2: 3 })

export function createGroundFx(THREE, { max = 16, gridSize = 128, gridCells = 64 } = {}) {
  const MAX = Math.max(1, Math.min(32, max | 0)), GN = Math.max(4, gridCells | 0), CELL = gridSize / GN
  const maskData = new Uint8Array(GN * GN * 4), maskTex = new THREE.DataTexture(maskData, GN, GN, THREE.RGBAFormat, THREE.UnsignedByteType)
  maskTex.magFilter = maskTex.minFilter = THREE.NearestFilter; maskTex.generateMipmaps = false; maskTex.needsUpdate = true
  const v4 = () => Array.from({ length: MAX }, () => new THREE.Vector4())
  // a.xyz Ursprung, a.w Form · b.xyz Richtung, b.w cos(Außenwinkel) (Pfütze/Ring: b.x = Begrenzungsradius²) · c.rgb Farbe (linear), c.w Stärke · d.x Reichweite, d.y cos(Innenwinkel) bzw. weicher Rand, d.z Radius, d.w Breite
  const uniforms = { uGFa: { value: v4() }, uGFb: { value: v4() }, uGFc: { value: v4() }, uGFd: { value: v4() }, uGFn: { value: 0 }, uGFm: { value: maskTex }, uGFg: { value: new THREE.Vector4(-gridSize / 2, -gridSize / 2, 1 / CELL, GN) } }
  const glsl = `
  #ifndef KFB_GFX
  #define KFB_GFX
  #define KFB_GF_MAX ${MAX}
  uniform vec4 uGFa[KFB_GF_MAX]; uniform vec4 uGFb[KFB_GF_MAX]; uniform vec4 uGFc[KFB_GF_MAX]; uniform vec4 uGFd[KFB_GF_MAX]; uniform int uGFn;
  uniform sampler2D uGFm; uniform vec4 uGFg;                                          /* Gitter-Karte: Bitmaske der Plätze je Zelle · g.xy Ecke, g.z 1/Zellgröße, g.w Zellen */
  vec3 kfbGroundFx(vec3 wp, vec3 n, vec3 albedo){
    vec3 acc = vec3(0.0);
    if (uGFn == 0) return acc;
    vec2 gc = (wp.xz - uGFg.xy) * uGFg.z;
    if (gc.x < 0.0 || gc.y < 0.0 || gc.x >= uGFg.w || gc.y >= uGFg.w) return acc;
    uvec4 mb = uvec4(texelFetch(uGFm, ivec2(gc), 0) * 255.0 + 0.5); uint m = mb.r | (mb.g << 8) | (mb.b << 16) | (mb.a << 24);
    for (int i = 0; i < KFB_GF_MAX; i++) {
      if (m == 0u) break;
      bool hit = (m & 1u) == 1u; m >>= 1;
      if (!hit) continue;
      vec4 A = uGFa[i], B = uGFb[i], D = uGFd[i]; float k;
      vec3 L = wp - A.xyz; float d2 = dot(L, L);
      if (A.w < 2.5 && d2 > (A.w < 0.5 ? D.x * D.x : B.x)) continue;                  /* Begrenzungskugel: Pixel außerhalb kosten nur diese Prüfung (beam2: Zellenmaske genügt) */
      if (A.w > 2.5) {                                                                /* beam2: Punkt im Volumen zweier Kegelstümpfe (Scheinwerfer-Paar) */
        vec3 ax = B.xyz, R0 = normalize(cross(ax, vec3(0.0, 1.0, 0.0))), U0 = cross(R0, ax); float rl = (A.w - 3.25) * 12.566371;   /* Rollen des Wagens (Querhang) steckt in A.w */
        vec3 R = cos(rl) * R0 + sin(rl) * U0, U = cross(R, ax); float t = dot(L, ax);
        if (t <= 0.0 || t > D.x) continue;
        float rh = D.y + t * D.z, rv = D.y + t * D.w, v = dot(L, R), y = dot(L, U);
        /* Lichtbild wie Abblendlicht (Lead 23.10., HEADLIGHTS_PHYSIK_R2): senkrecht u = 0 Unterkante … 1 Oberkante = Hell-Dunkel-Grenze. Weicher Einlauf,
           ansteigend bis zum Maximum (u 0,87 ≈ 0,6 L auf ebenem Boden), hell bis zur scharfen Grenze (Breite ≈ 0,012 u ≈ 0,06 L); rechts angedeutet länger.
           Seitlich: Kegel ±tanH, auf dem Boden weich ausgefranst bis ≈ 1,41 × (±14°). */
        float u = 0.5 * (y / rv + 1.0), yr = y / rv - 0.036 * smoothstep(0.0, 1.0, v / (B.w + rh));                     /* rechts angedeutet länger */
        float vert = smoothstep(0.0, 0.06, u) * mix(0.3, 1.0, smoothstep(0.0, 0.88, u)) * (1.0 - 0.75 * smoothstep(0.88, 1.0, u));   /* zur Grenze hin schon dunkler: Bodenwellen schneiden nicht hart */
        /* elliptischer Querschnitt (Georg 23.10.: Ende rund statt gerade Kante), seitlich weich bis ≈ 1,4 × tanH (±14°), senkrecht schmaler Saum */
        vec2 q1 = vec2((v - B.w) / (1.4 * rh), yr), q2 = vec2((v + B.w) / (1.4 * rh), yr); float e1 = length(q1), e2 = length(q2);
        float w1 = q1.x * q1.x / max(e1 * e1, 1e-4), w2 = q2.x * q2.x / max(e2 * e2, 1e-4);                             /* Anteil seitlich: seitlich breiter Saum, oben/unten schmaler */
        float s1 = 1.0 - smoothstep(mix(0.75, 0.6, w1), 1.0, e1), s2 = 1.0 - smoothstep(mix(0.75, 0.6, w2), 1.0, e2);
        float c = (s1 + s2) * vert; k = (1.0 - exp(-1.6 * c)) / (1.0 - exp(-1.6));                                 /* 1 Kegel = 1, Überlappung ≈ 1,2: heller, weich gekappt */
        k *= smoothstep(0.0, 0.3, t) * (1.0 - smoothstep(D.x * 0.65, D.x, t)) * (0.75 + 0.25 * max(dot(n, -ax), 0.0));   /* weich über die letzten 35 % aus, mit dem Lichtvolumen */
      } else if (A.w < 0.5) {                                                         /* Kegel: weicher Rand Außen- → Innenwinkel, Reichweite, Flächen zum Licht hin heller */
        float d = sqrt(d2); vec3 l = L / max(d, 1e-4); float cz = dot(l, B.xyz);
        if (D.z > 0.0) {                                                              /* elliptischer Kegelstumpf (Scheinwerfer): waagrecht Startbreite B.w + t·tan D.z, senkrecht t·tan D.w, weicher Rand D.y */
          float t = dot(L, B.xyz); if (t <= 0.0) continue;
          vec3 rx = normalize(cross(B.xyz, vec3(0.0, 1.0, 0.0))), ry = cross(rx, B.xyz);
          float yy = dot(L, ry) * sign(ry.y + 1e-6);                                  /* > 0 = über der Achse */
          float ey = D.w < 0.0 ? max(0.0, -yy) / (t * -D.w) : yy / (t * D.w);          /* D.w < 0: nur die Unterkante begrenzt, nach oben endet der Fleck über die Reichweite */
          float e = length(vec2(dot(L, rx) / (B.w + t * D.z), ey)); k = 1.0 - smoothstep(1.0 - D.y, 1.0, e);
        } else { if (cz < B.w) continue; k = smoothstep(B.w, D.y, cz); }
        k *= (1.0 - smoothstep(D.x * 0.75, D.x, d)) * (A.w > 0.1 ? 0.85 : 0.35 + 0.65 * max(dot(n, -l), 0.0));   /* flat (A.w 0,25): gleichmäßig, auch bei flachem Einfall */
      } else {                                                                        /* Pfütze / Ring senkrecht von oben: waagrechter Abstand, Höhe unter dem Ursprung */
        float dh = length(wp.xz - A.xz), dy = A.y - wp.y;
        float shape = A.w < 1.5 ? 1.0 - smoothstep(D.z * (1.0 - D.y), D.z, dh) : 1.0 - smoothstep(0.0, D.w, abs(dh - D.z));
        k = shape * step(-0.05 * D.x, dy) * (1.0 - smoothstep(D.x * 0.6, D.x, dy)) * (0.35 + 0.65 * max(n.y, 0.0));
      }
      acc += uGFc[i].rgb * uGFc[i].w * k;
    }
    return albedo * acc;
  }
  #endif`

  // ── Mischer ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  const channels = new Map(), focus = new THREE.Vector3(), tmpC = new THREE.Color(), tmpD = new THREE.Vector3()
  let hasFocus = false
  const info = { n: 0, dropped: 0, owners: {} }
  function channel(owner, { priority = 0 } = {}) {
    let c = channels.get(owner)
    if (!c) { c = { owner, priority, list: [], set(list) { c.list = list || []; flush(); return c }, setPools(list) { return c.set(list) }, clear() { return c.set([]) } }; channels.set(owner, c) }
    else c.priority = priority
    return c
  }
  // Fokus: Mitte des Gitters (auf Zellen gerastert) und Vorrang bei zu vielen Einträgen; jedes Bild setzen (Kamera bzw. Wagen)
  function setFocus(v) { if (!v) { hasFocus = false; return } focus.set(v.x, v.y, v.z); hasFocus = true
    const g = uniforms.uGFg.value, x0 = Math.floor((v.x - gridSize / 2) / CELL) * CELL, z0 = Math.floor((v.z - gridSize / 2) / CELL) * CELL
    if (x0 !== g.x || z0 !== g.y) { g.x = x0; g.y = z0; flush() } }
  // Begrenzungskreis in XZ je Eintrag (Kegel: Kugel um die Kegelmitte, Pfütze/Ring: Radius um den Ursprung) → Bits in die Zellen
  const bound = { x: 0, z: 0, r: 0 }
  function boundOf(i) {
    const A = uniforms.uGFa.value[i], B = uniforms.uGFb.value[i], D = uniforms.uGFd.value[i]
    if (A.w > 2.5) { const R = D.x, w = B.w + D.y + R * Math.max(D.z * 1.45, D.w); bound.x = A.x + B.x * R * 0.5; bound.z = A.z + B.z * R * 0.5; bound.r = R * 0.5 + w }   // beam2: Kugel um die Mitte
    else if (A.w < 0.5 && D.z > 0) { bound.x = A.x; bound.z = A.z; bound.r = D.x + B.w }   // elliptischer Kegelstumpf: Kugel um den Ursprung (Reichweite + Startbreite)
    else if (A.w < 0.5) { const R = D.x, k = Math.sqrt(Math.max(0, 1.25 - B.w))
      if (k < 1) { bound.x = A.x + B.x * R * 0.5; bound.z = A.z + B.z * R * 0.5; bound.r = R * Math.max(0.5, k) } else { bound.x = A.x; bound.z = A.z; bound.r = R } }
    else { bound.x = A.x; bound.z = A.z; bound.r = D.z + (A.w > 1.5 ? D.w : 0) }
    return bound
  }
  // beam2: Grundriss der beiden Kegelstümpfe (Trapez längs der waagrechten Achse) – nur Zellen darin bekommen das Bit (Kreis wäre ≈ 7× zu groß)
  const fpr = { hx: 0, hz: 1, len: 0, w0: 0, k: 0 }
  function footprint(i) {
    const B = uniforms.uGFb.value[i], D = uniforms.uGFd.value[i], l = Math.hypot(B.x, B.z) || 1, cp = Math.max(0.05, l)
    fpr.hx = B.x / l; fpr.hz = B.z / l; fpr.len = D.x; fpr.w0 = B.w + D.y + 0.2; fpr.k = Math.max(D.z * 1.45, D.w) / cp; return fpr   // seitlicher Saum bis 1,41 × tanH
  }
  function buildMask(n) {
    maskData.fill(0); const g = uniforms.uGFg.value
    for (let i = 0; i < n; i++) { const b = boundOf(i), r2 = b.r * b.r, byte = i >> 3, bit = 1 << (i & 7)
      const c0 = Math.max(0, Math.floor((b.x - b.r - g.x) / CELL)), c1 = Math.min(GN - 1, Math.floor((b.x + b.r - g.x) / CELL))
      const r0 = Math.max(0, Math.floor((b.z - b.r - g.y) / CELL)), r1 = Math.min(GN - 1, Math.floor((b.z + b.r - g.y) / CELL))
      const A = uniforms.uGFa.value[i], fp = A.w > 2.5 ? footprint(i) : null
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
        const cx = g.x + c * CELL, cz = g.y + r * CELL, dx = Math.max(cx - b.x, 0, b.x - cx - CELL), dz = Math.max(cz - b.z, 0, b.z - cz - CELL)
        if (dx * dx + dz * dz > r2) continue
        if (fp) { const px = cx + CELL / 2 - A.x, pz = cz + CELL / 2 - A.z, u = px * fp.hx + pz * fp.hz, w = Math.abs(px * fp.hz - pz * fp.hx), m = CELL * 0.71
          if (u < -m || u > fp.len + m || w > fp.w0 + Math.max(0, u) * fp.k + m) continue }
        maskData[(r * GN + c) * 4 + byte] |= bit } }
    maskTex.needsUpdate = true
  }
  const dist2 = (p) => { const o = p.origin; return hasFocus && o ? (o.x - focus.x) ** 2 + (o.y - focus.y) ** 2 + (o.z - focus.z) ** 2 : 0 }
  function flush() {
    let all = []
    for (const c of channels.values()) for (const p of c.list) all.push({ p, pr: c.priority, owner: c.owner })
    info.dropped = Math.max(0, all.length - MAX)
    if (all.length > MAX) { for (const e of all) e.d = dist2(e.p); all.sort((a, b) => b.pr - a.pr || a.d - b.d); all = all.slice(0, MAX) }
    info.owners = {}
    all.forEach((e, i) => { write(i, e.p); info.owners[e.owner] = (info.owners[e.owner] || 0) + 1 })
    uniforms.uGFn.value = info.n = all.length
    buildMask(all.length)
  }
  function write(i, p) {
    const form = typeof p.form === 'number' ? p.form : FORMS[p.form || 'cone'] ?? 0, o = p.origin, fw = form === 0 && p.flat ? 0.25 : form   // flat: Kegel ohne Einfallswinkel-Abschwächung
    const c = p.color && p.color.isColor ? p.color : tmpC.set(p.color ?? '#ffffff')
    uniforms.uGFa.value[i].set(o.x ?? o[0], o.y ?? o[1], o.z ?? o[2], form === 3 ? 3.25 + Math.max(-Math.PI, Math.min(Math.PI, p.roll || 0)) / (4 * Math.PI) : fw)
    uniforms.uGFc.value[i].set(c.r, c.g, c.b, p.intensity ?? 1)
    if (form === 3) {   // beam2: { origin (Mitte zwischen den Lampen), dir (Achse), half, r0, tanH, tanV, len, roll } · Lampen bei origin ± half·R, R = cross(dir, oben) um roll (rad) zur Kegel-Oberseite gedreht
      const d = p.dir.isVector3 ? tmpD.copy(p.dir).normalize() : tmpD.set(p.dir[0], p.dir[1], p.dir[2]).normalize()
      uniforms.uGFb.value[i].set(d.x, d.y, d.z, p.half ?? 0.5); uniforms.uGFd.value[i].set(p.len ?? 12, p.r0 ?? 0.1, p.tanH ?? 0.1, p.tanV ?? 0.1)
    } else if (form === 0) {
      const d = p.dir ? (p.dir.isVector3 ? tmpD.copy(p.dir) : tmpD.set(p.dir[0], p.dir[1], p.dir[2])).normalize() : tmpD.set(0, -1, 0)
      const soft = Math.min(0.95, Math.max(0.02, p.soft ?? 0.35))
      if (p.angleH != null) {   // elliptischer Kegelstumpf: angleH waagrecht, angleV senkrecht (rad), startH = waagrechte Halbbreite am Ursprung (b.w)
        const aH = Math.max(1e-3, p.angleH), aV = Math.max(1e-3, p.angleV ?? p.angle ?? aH)
        uniforms.uGFb.value[i].set(d.x, d.y, d.z, Math.max(0, p.startH || 0)); uniforms.uGFd.value[i].set(p.range ?? 60, soft, Math.tan(aH), Math.tan(aV) * (p.lowerOnly ? -1 : 1))
      } else { const outer = p.angle ?? 0.2, inner = outer * (1 - soft)
        uniforms.uGFb.value[i].set(d.x, d.y, d.z, Math.cos(outer)); uniforms.uGFd.value[i].set(p.range ?? 60, Math.cos(inner), 0, 0) }
    } else {
      const range = p.range ?? 6, R = Math.max(1e-3, p.radius ?? 2), Wd = Math.max(1e-3, p.width ?? 0.5)
      uniforms.uGFb.value[i].set((R + (form === 2 ? Wd : 0)) ** 2 + range ** 2, 0, 0, 0)
      uniforms.uGFd.value[i].set(range, Math.min(0.95, Math.max(0.02, p.soft ?? 0.4)), R, Wd)
    }
  }

  // ── Empfänger ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  // Weltlage + Normale selbst rechnen (auch für InstancedMesh), Beitrag vor dem Ausgang addieren; ein vorhandenes onBeforeCompile läuft zuerst
  function injectStandard(material) {
    if (material.userData.kfbGFX) return material
    material.userData.kfbGFX = true
    const prev = material.onBeforeCompile, prevKey = material.customProgramCacheKey
    material.onBeforeCompile = (sh, r) => {
      if (prev) prev.call(material, sh, r)
      Object.assign(sh.uniforms, uniforms)
      sh.vertexShader = 'varying vec3 vGFw; varying vec3 vGFn;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  { vec4 gfP = vec4(transformed, 1.0); vec3 gfN = objectNormal;
  #ifdef USE_INSTANCING
    gfP = instanceMatrix * gfP; gfN = mat3(instanceMatrix) * gfN;
  #endif
    vGFw = (modelMatrix * gfP).xyz; vGFn = normalize(mat3(modelMatrix) * gfN); }`)
      const out = sh.fragmentShader.includes('#include <opaque_fragment>') ? '#include <opaque_fragment>' : '#include <output_fragment>'
      sh.fragmentShader = 'varying vec3 vGFw; varying vec3 vGFn;\n' + glsl + '\n' + sh.fragmentShader.replace(out, `outgoingLight += kfbGroundFx(vGFw, normalize(vGFn), diffuseColor.rgb);\n${out}`)
    }
    material.customProgramCacheKey = () => (prevKey ? prevKey.call(material) : '') + '|kfb-gfx'
    material.needsUpdate = true
    return material
  }
  // alle Standard-Materialien unter einem Objekt anschließen (je Material einmal); liefert die Zahl neu angeschlossener
  function attach(object3d) {
    let n = 0
    object3d?.traverse?.((o) => { if (!o.isMesh) return; for (const mt of [].concat(o.material)) if (mt && (mt.isMeshStandardMaterial || mt.isMeshLambertMaterial || mt.isMeshToonMaterial) && !mt.userData.kfbGFX) { injectStandard(mt); n++ } })
    return n
  }

  // ── leuchtende Körper ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  let glowTex = null
  function glowTexture() {
    if (glowTex || typeof document === 'undefined') return glowTex
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.2, 'rgba(255,255,255,0.9)'); r.addColorStop(0.45, 'rgba(255,255,255,0.3)'); r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); glowTex = new THREE.CanvasTexture(c); return glowTex
  }
  // Glüh-Sprite am Anker (additiv, schreibt keine Tiefe)
  function makeGlow({ color = '#ffffff', size = 1, opacity = 0.9 } = {}) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity }))
    s.scale.setScalar(size); s.renderOrder = 4; return s
  }
  // Sichtbarer Kegel (wie kfb-light-pool.v1 makeBeam): Spitze im Ursprung, Achse +Y, Länge = Skalierung. Farbe als sRGB ausgegeben (linearToOutputTexel),
  // damit additive Kegel unter r186 so hell wie die Hex-Farbe wirken (r147 legte die Hex-Werte roh ab).
  const beamGeo = new THREE.CylinderGeometry(1, 0.0, 1, 24, 6, true).translate(0, 0.5, 0)
  function makeBeam({ color = '#ffffff', opacity = 0.35, angle = 0.12, fadeStart = 0.7 } = {}) {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uCol: { value: new THREE.Color(color) }, uOp: { value: opacity }, uFade: { value: fadeStart } },
      vertexShader: 'varying float vT; varying vec3 vNv; varying vec3 vVd; void main(){ vT = position.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vNv = normalize(normalMatrix * normal); vVd = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uCol; uniform float uOp, uFade; varying float vT; varying vec3 vNv; varying vec3 vVd; void main(){ float rim = abs(dot(normalize(vNv), normalize(vVd))); float a = uOp * pow(rim, 1.5) * (1.0 - smoothstep(uFade, 1.0, vT)) * smoothstep(0.0, 0.06, vT); gl_FragColor = vec4(linearToOutputTexel(vec4(uCol, 1.0)).rgb * a, a); }',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    })
    const m = new THREE.Mesh(beamGeo, mat); m.frustumCulled = false; m.renderOrder = 3; m.userData.angle = angle
    return m
  }
  const _up = new THREE.Vector3(0, 1, 0), _q = new THREE.Quaternion(), _d = new THREE.Vector3()
  function aimBeam(mesh, origin, dir, length, radiusAtEnd) {
    const r = radiusAtEnd ?? Math.tan(mesh.userData.angle ?? 0.12) * length
    mesh.position.copy(origin); mesh.quaternion.copy(_q.setFromUnitVectors(_up, _d.copy(dir).normalize())); mesh.scale.set(r, length, r)
  }

  function dispose() { for (const c of channels.values()) c.list = []; flush(); beamGeo.dispose(); maskTex.dispose(); glowTex?.dispose(); glowTex = null }
  return { VERSION, MAX, FORMS, uniforms, glsl, channel, setFocus, flush, injectStandard, attach, makeGlow, makeBeam, aimBeam, stats: () => ({ ...info, owners: { ...info.owners } }), dispose }
}

// ── Zeitkurven ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const clamp01 = (x) => Math.min(1, Math.max(0, x))
export const curves = Object.freeze({
  pulse: (t, hz = 1, lo = 0, hi = 1) => lo + (hi - lo) * (0.5 - 0.5 * Math.cos(t * hz * Math.PI * 2)),
  decay: (age, half = 0.25) => Math.pow(0.5, Math.max(0, age) / half),
  easeOut: (u) => 1 - (1 - clamp01(u)) ** 3,
  fadeOut: (u) => (1 - clamp01(u)) ** 2,
})

// Ring-Geber (Boombox, V-632): jeder Kick startet einen Ring, der von r0 auf r1 wächst und ausklingt; dazu optional eine Pfütze, die mit dem Bass atmet.
// update(dt, { center, pulse }) – pulse im Format kfb.audio-presentation-pulse/1 (WS-Audio musicPulse()): audible01, kick, bass, energy.rhythm01,
// transport.beatPulse01/confidence01. Ohne pulse: nur kick(stärke) von Hand. Schreibt in den übergebenen Kanal (fx.channel('boombox')).
export function createRingEmitter(channel, o = {}) {
  const opt = Object.assign({ color: '#ffd23a', r0: 0.4, r1: 6, width: 0.45, life: 0.9, intensity: 1.4, range: 4, height: 1.5, maxRings: 4, pool: true, poolRadius: 2.2, poolIntensity: 0.6, beatRings: true }, o)
  const rings = [], list = []
  let lastBeat = 0
  function kick(strength = 1) { if (rings.length >= opt.maxRings) rings.shift(); rings.push({ age: 0, s: clamp01(strength) }) }
  function update(dt, { center, pulse = null } = {}) {
    const P = pulse || {}, audible = P.audible01 ?? (pulse ? 0 : 1)
    if (audible > 0) {
      if (P.kick) kick(Math.max(0.5, P.energy?.rhythm01 ?? 1))
      const bp = P.transport?.beatPulse01 ?? 0, conf = P.transport?.confidence01 ?? 0
      if (opt.beatRings && !P.kick && conf > 0.5 && bp > 0.9 && lastBeat <= 0.9) kick(0.5)   /* Zwischenring auf sicherem Schlag ohne erkannten Kick */
      lastBeat = bp
    }
    for (const r of rings) r.age += dt
    while (rings.length && rings[0].age > opt.life) rings.shift()
    list.length = 0
    if (!center) { channel.set(list); return list }
    const origin = { x: center.x, y: center.y + opt.height, z: center.z }
    if (opt.pool && audible > 0) list.push({ form: 'pool', origin, radius: opt.poolRadius * (0.8 + 0.4 * (P.bass ?? 0)), soft: 0.6, color: opt.color, intensity: opt.poolIntensity * audible * (0.3 + 0.7 * (P.bass ?? 0)), range: opt.height + opt.range })
    for (const r of rings) { const u = r.age / opt.life
      list.push({ form: 'ring', origin, radius: opt.r0 + (opt.r1 - opt.r0) * curves.easeOut(u), width: opt.width * (1 + u), color: opt.color, intensity: opt.intensity * r.s * curves.fadeOut(u), range: opt.height + opt.range }) }
    channel.set(list); return list
  }
  return { kick, update, rings, list, options: opt }
}
