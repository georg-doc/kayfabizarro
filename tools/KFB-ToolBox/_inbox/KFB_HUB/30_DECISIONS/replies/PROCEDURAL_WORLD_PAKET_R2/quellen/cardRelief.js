// Karten-Relief im wabernden Gelände (Georg 25.10., V-751/V-735, Probe R3 q197): eine KFB-Karte liegt als Knetkugel-Relief im Boden der endlosen Welt.
// Farben aus dem Schema des Bioms an der Stelle (dieselben sechs Bandrollen wie das Gelände), dunkle Linien und Kartenrand als KFB-Tusche #1f1a14.
// GPU-Partikel wie Probe R3 (GPUComputationRenderer, WebGL): Schwerkraft, Abprallen, Rückkehr ins Relief; die Figur stößt die Kugeln weg.
// Ort und Relief: das Karten-Gelände der endlosen Welt (terrain.stamps, endlessTerrain cardSites/stampHeight); die Kugeln liegen auf dieser Höhe, gelaufen und gefahren wird auf dem Gelände.
// Modul nach Host-Vertrag R1: create(options) → { object3d, update(dt, ctx), dispose(), info() }. options: { terrain, gl, palettes (BIOME_PALETTES, live), palState (PAL_STATE mit listeners), pick? }
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import PTS_URL from '../assets/cards/card_r3.pts.bin?url'
import HM_URL from '../assets/cards/card_r3.hm.bin?url'
import META from '../assets/cards/card_r3.meta.json' with { type: 'json' }
import { KEEPOUT } from './keepout.js'

export const CARD = Object.freeze({ side: 256, halfW: 18, amp: 3.2, ring: [70, 260], avoid: 48, ink: '#1f1a14', inkLuma: 0.2, border: 0.012 })
const BAND_ROLES = ['peak', 'sand', 'low', 'mid', 'high', 'band6']   // dieselben Rollen wie die sechs Fließbänder (biomeTerrain)
const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b

export function createCardRelief({ terrain: T, gl, palettes, palState = null, pick = null } = {}) {
  const root = new THREE.Group(); root.name = 'card-relief'
  const S = CARD.halfW, AMP = CARD.amp, W = 2 * S, D = 2 * S * META.aspect, SIDE = CARD.side, N = SIDE * SIDE
  const st = { ready: false, err: null, site: null, biome: -1, sim: false, t: 0, last: null }
  let gpu = null, velVar = null, posVar = null, mat = null, home = null, SU = null, pts = null, raw = null

  // Ort: flachste Kartenfläche im Ring um den Start (Höhen-Spannweite über 5 × 5 Proben)
  const span = (cx, cz) => { let lo = 1e9, hi = -1e9; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const h = T.height(cx - S + (i / 4) * W, cz - D / 2 + (j / 4) * D); lo = Math.min(lo, h); hi = Math.max(hi, h) } return hi - lo }
  const findSite = () => { let best = null; for (let r = CARD.ring[0]; r <= CARD.ring[1]; r += 19) for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2 + r * 0.013, x = Math.cos(t) * r, z = Math.sin(t) * r
    if (Math.hypot(x, z) < CARD.avoid + S) continue; const s = span(x, z) + r * 0.004; if (!best || s < best.s) best = { x, z, s } } return best }

  // Farben: Punkt-Helligkeit → nächste der sechs Bandrollen (nach Helligkeit sortiert); dunkle Linien und Rand als Tusche
  const col = new Float32Array(N * 3), size = new Float32Array(N), ref = new Float32Array(N * 2)
  const recolor = () => { if (!raw || !st.site) return; const P = palettes[st.biome] || palettes[0]; if (!P) return
    const ramp = BAND_ROLES.map((r) => new THREE.Color(P[r] || P.mid)).sort((a, b) => lum(a) - lum(b)), ink = new THREE.Color(CARD.ink)
    // Helligkeit über Quantile auf die sechs Rollen verteilen (die Karte ist hell; sonst landet fast alles in der hellsten Rolle)
    const L = new Float32Array(N); for (let i = 0; i < N; i++) L[i] = 0.299 * raw[i * 7 + 3] + 0.587 * raw[i * 7 + 4] + 0.114 * raw[i * 7 + 5]
    const srt = Array.from(L).filter((l) => l >= CARD.inkLuma).sort((a, b) => a - b), q = [1, 2, 3, 4, 5].map((k) => srt[Math.floor((k / 6) * (srt.length - 1))] ?? 1)
    for (let i = 0; i < N; i++) { const x = raw[i * 7], y = raw[i * 7 + 1], l = L[i]
      const edge = 1 - Math.abs(x) < CARD.border * 2 || META.aspect - Math.abs(y) < CARD.border * 2
      let k = 0; while (k < 5 && l > q[k]) k++
      const c = l < CARD.inkLuma || edge ? ink : ramp[k]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b }
    pts?.geometry.attributes.col && (pts.geometry.attributes.col.needsUpdate = true) }

  // Ort sofort (vor dem Laden), damit der Bewuchs die Kartenfläche von Anfang an frei lässt
  const stamp = T.stamps?.find((x) => x.kind === 'card'); st.site = pick ? pick() : stamp ? { x: stamp.x, z: stamp.z } : findSite(); const keep = st.site ? { x: st.site.x, z: st.site.z, hw: S, hd: D / 2, pad: 2.5 } : null; if (keep) KEEPOUT.push(keep)
  const build = (HM) => {
    const site = st.site; if (!site) { st.err = 'kein Ort'; return }
    { const w6 = new Float32Array(6); T.biomeAt?.(site.x, site.z, w6); let bi = 0; for (let k = 1; k < 6; k++) if (w6[k] > w6[bi]) bi = k; st.biome = bi }
    // Boden-Textur über der Karte: Gelände + Relief (Höhe der Kugel-Ruhelage), Rand läuft auf das Gelände aus
    const hw = META.hw, hh = META.hh, G = new Float32Array(hw * hh), x0 = site.x - S, z0 = site.z - D / 2
    for (let j = 0; j < hh; j++) for (let i = 0; i < hw; i++) { const u = (i + 0.5) / hw, v = (j + 0.5) / hh, x = x0 + u * W, z = z0 + v * D
      // mit Karten-Gelände (stamp) trägt das Gelände selbst das Relief; sonst legt das Modul es wie Probe R3 obenauf
      const fade = Math.min(1, Math.min(u, 1 - u, v, 1 - v) / 0.04); G[j * hw + i] = T.height(x, z) + (stamp ? 0 : (HM[j * hw + i] - META.edge) * AMP * fade) + 0.08 }
    const gTex = new THREE.DataTexture(G, hw, hh, THREE.RedFormat, THREE.FloatType); gTex.magFilter = gTex.minFilter = THREE.LinearFilter; gTex.needsUpdate = true
    const gAt = (x, z) => { const u = Math.min(hw - 1, Math.max(0, Math.floor(((x - x0) / W) * hw))), v = Math.min(hh - 1, Math.max(0, Math.floor(((z - z0) / D) * hh))); return G[v * hw + u] }
    gpu = new GPUComputationRenderer(SIDE, SIDE, gl)
    const pos0 = gpu.createTexture(), vel0 = gpu.createTexture(); home = gpu.createTexture()
    for (let i = 0; i < N; i++) { const x = site.x + raw[i * 7] * S, z = site.z - raw[i * 7 + 1] * S, y = gAt(x, z) + 0.05
      home.image.data.set([x, y, z, 1], i * 4); pos0.image.data.set([x, y, z, 1], i * 4); size[i] = raw[i * 7 + 6]
      ref[i * 2] = ((i % SIDE) + 0.5) / SIDE; ref[i * 2 + 1] = (Math.floor(i / SIDE) + 0.5) / SIDE }
    const common = `
  uniform sampler2D tHome, tGround; uniform float uDt, uBounce, uReturn, uKick; uniform vec4 uP; uniform vec3 uPV, uKickPos;
  float ground(vec2 xz){ vec2 uv=(xz-vec2(${x0.toFixed(3)},${z0.toFixed(3)}))/vec2(${W.toFixed(3)},${D.toFixed(3)}); return texture2D(tGround, clamp(uv, 0.0, 1.0)).r; }`
    velVar = gpu.addVariable('tVel', common + `
  void main(){ vec2 uv=gl_FragCoord.xy/resolution.xy; vec3 p=texture2D(tPos,uv).xyz, v=texture2D(tVel,uv).xyz, h=texture2D(tHome,uv).xyz;
    vec3 toH=h-p; float spd=length(v), kk=uReturn*4.0, cc=2.0*sqrt(max(kk,1e-4)), air=step(ground(p.xz)+0.02,p.y);
    v.y-=9.8*uDt*air; v+=(toH*kk - v*cc*(0.35+0.65*(1.-air)))*uDt; if(length(toH)<0.03 && spd<0.25) v*=0.5;
    { vec3 d=p-uP.xyz; float L=length(d); if(L<uP.w){ vec3 n=d/max(L,1e-3); n.y=abs(n.y)+0.35; n=normalize(n); v+=n*(uP.w-L)*14.+uPV*0.55; } }
    if(uKick>0.){ vec3 d=p-uKickPos; float L=length(d); if(L<6.) v+=normalize(d+vec3(0.,1.2,0.))*uKick*(1.-L/6.)*(0.6+fract(sin(dot(uv,vec2(12.9,78.2)))*437.)*0.8); }
    float g=ground(p.xz); if(p.y+v.y*uDt<g){ if(v.y<0.) v.y=-v.y*uBounce; v.xz*=1.-1.8*uDt; }
    gl_FragColor=vec4(v,1.); }`, vel0)
    posVar = gpu.addVariable('tPos', common + `
  void main(){ vec2 uv=gl_FragCoord.xy/resolution.xy; vec3 p=texture2D(tPos,uv).xyz, v=texture2D(tVel,uv).xyz; p+=v*uDt; float g=ground(p.xz); if(p.y<g) p.y=g; gl_FragColor=vec4(p,1.); }`, pos0)
    gpu.setVariableDependencies(velVar, [posVar, velVar]); gpu.setVariableDependencies(posVar, [posVar, velVar])
    SU = { tHome: { value: home }, tGround: { value: gTex }, uDt: { value: 0.016 }, uBounce: { value: 0.45 }, uReturn: { value: 0.6 }, uKick: { value: 0 },
      uP: { value: new THREE.Vector4(0, -999, 0, 0.9) }, uPV: { value: new THREE.Vector3() }, uKickPos: { value: new THREE.Vector3() } }
    for (const vv of [velVar, posVar]) Object.assign(vv.material.uniforms, SU)
    const e = gpu.init(); if (e) { st.err = e; return }
    recolor()
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); g.setAttribute('ref', new THREE.BufferAttribute(ref, 2)); g.setAttribute('col', new THREE.BufferAttribute(col, 3)); g.setAttribute('psize', new THREE.BufferAttribute(size, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(site.x, gAt(site.x, site.z), site.z), S * 1.3)
    // Darstellung: Knetkugel-Sprites, Licht aus der Sonnenrichtung des einen Rigs (uSun, vom Host gesetzt), weich wie Knete, kein Glanz
    mat = new THREE.ShaderMaterial({ uniforms: { tPos: { value: null }, uPix: { value: gl.getPixelRatio() }, uSun: { value: new THREE.Vector3(-0.4, 0.7, 0.6).normalize() }, uFog: { value: new THREE.Color('#cfe0ea') }, uFogR: { value: new THREE.Vector2(120, 420) } },
      vertexShader: `attribute vec2 ref; attribute vec3 col; attribute float psize; uniform sampler2D tPos; uniform float uPix; varying vec3 vC; varying float vD;
  void main(){ vec3 p=texture2D(tPos,ref).xyz; vC=col; vec4 mv=modelViewMatrix*vec4(p,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; gl_PointSize=psize*uPix*${(80 * S / 10).toFixed(1)}/-mv.z; }`,
      fragmentShader: `uniform vec3 uSun, uFog; uniform vec2 uFogR; varying vec3 vC; varying float vD;
  void main(){ vec2 c=gl_PointCoord*2.-1.; float r2=dot(c,c); if(r2>1.) discard; vec3 n=normalize(vec3(c.x,-c.y,sqrt(1.-r2)));
    vec3 l=normalize((viewMatrix*vec4(uSun,0.)).xyz); float sh=.62+.38*max(dot(n,l),0.); vec3 o=vC*sh;
    o=mix(o, uFog, smoothstep(uFogR.x, uFogR.y, vD)); gl_FragColor=vec4(o,1.); }` })
    pts = new THREE.Points(g, mat); pts.name = 'card-relief-points'; root.add(pts)
    // eine Rechnung zum Start, damit die Kugeln sofort liegen
    gpu.compute(); mat.uniforms.tPos.value = gpu.getCurrentRenderTarget(posVar).texture
    st.ready = true
  }

  Promise.all([fetch(PTS_URL).then((r) => r.arrayBuffer()), fetch(HM_URL).then((r) => r.arrayBuffer())])
    .then(([a, b]) => { raw = new Float32Array(a); build(new Float32Array(b)) }).catch((e) => { st.err = String(e) })
  const onPal = () => recolor(); palState?.listeners?.add?.(onPal)

  return {
    object3d: root,
    update(dt, ctx) {
      if (!st.ready) return
      const pl = ctx?.player, near = pl && st.site ? Math.hypot(pl.x - st.site.x, pl.z - st.site.z) < S * 3 : false
      if (pl) { if (st.last && dt > 0) SU.uPV.value.set((pl.x - st.last.x) / dt, (pl.y - st.last.y) / dt, (pl.z - st.last.z) / dt).clampLength(0, 20); st.last = { x: pl.x, y: pl.y, z: pl.z }; SU.uP.value.set(pl.x, pl.y + 0.4, pl.z, 0.9) }
      st.t += dt; if (near) st.until = st.t + 6   // nach Stoß oder Besuch 6 s weiterrechnen, bis die Kugeln wieder liegen
      st.sim = near || st.t < (st.until || 0)
      if (!st.sim) return
      SU.uDt.value = Math.min(dt, 1 / 30); gpu.compute(); mat.uniforms.tPos.value = gpu.getCurrentRenderTarget(posVar).texture
      SU.uKick.value = Math.max(0, SU.uKick.value - dt * 40)
    },
    kick(x, y, z, k = 14) { if (!SU) return; SU.uKickPos.value.set(x, y, z); SU.uKick.value = k; st.until = st.t + 6 },
    setSun(dir) { mat?.uniforms.uSun.value.copy(dir).normalize() },
    info: () => ({ ready: st.ready, err: st.err, site: st.site, biome: st.biome, sim: st.sim, n: N }),
    dispose() { palState?.listeners?.delete?.(onPal); if (keep) KEEPOUT.splice(KEEPOUT.indexOf(keep), 1); gpu?.dispose?.(); pts?.geometry.dispose(); mat?.dispose() },
  }
}
