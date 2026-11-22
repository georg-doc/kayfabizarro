// kfb-hypernorm · Raum-Durchgang R1 (3D-Plan R1, W-009: eigenes schlankes WebGL2; WSV 07.11.2026)
// Läuft im Worker (OffscreenCanvas) und im Hauptfaden. Bekommt eine Szene der Zeitleiste (timeline.raumSzene(t)): Rezept, Fortschritt p, Texturen
// (vorig, jetzt) und Linse; legt die Bilder auf Formen (Karte mit Dicke, Kubus, Ebene), bewegt sie mit echter Perspektive und wölbt das Ergebnis (Linse).
// Kein three, keine Abhängigkeit. Ohne WebGL2: ok = false, der Wirt zeichnet den 2D-Pfad (Rückfall-Übergang des Rezepts, flache Linse).
// Determinismus: Grafikkarten rechnen nicht überall bitgleich, daher Toleranz (W-009 Punkt 4). Frontal und in Ruhe ist das Bild texelgenau gleich dem 2D-Bild.
import { spurBei } from './rezepte.mjs';

const VS = `#version 300 es
in vec3 aPos; in vec2 aUv; in vec3 aN;
uniform mat4 uP, uV, uM;
out vec2 vUv; out vec3 vN; out vec3 vPos;
void main() { vec4 w = uM * vec4(aPos, 1.0); vPos = w.xyz; vN = mat3(uM) * aN; vUv = aUv; gl_Position = uP * uV * w; }`;
const FS = `#version 300 es
precision highp float;
in vec2 vUv; in vec3 vN; in vec3 vPos;
uniform sampler2D uTex; uniform int uMitTex; uniform vec3 uFarbe, uL, uCam; uniform float uStaerke, uGlanz;
out vec4 o;
void main() {
  vec3 c = uMitTex == 1 ? texture(uTex, vUv).rgb : uFarbe;
  vec3 n = normalize(vN), L = normalize(uL);
  float lam = clamp(max(dot(n, L), 0.0) / max(L.z, 1e-3), 0.0, 1.25);   // frontal (n = +z) genau 1
  float sh = mix(1.0, lam, uStaerke);
  vec3 V = normalize(uCam - vPos), Hh = normalize(L + V);
  float sp = uGlanz * pow(max(dot(n, Hh), 0.0), 40.0) * (1.0 - pow(clamp(n.z, 0.0, 1.0), 8.0));   // Glanz nur, wenn die Fläche geneigt ist
  o = vec4(c * sh + sp, 1.0);
}`;
const VS2 = `#version 300 es
in vec2 aP; uniform float uFlipY; out vec2 vUv;
void main() { vUv = vec2(aP.x * 0.5 + 0.5, uFlipY > 0.5 ? aP.y * 0.5 + 0.5 : 0.5 - aP.y * 0.5); gl_Position = vec4(aP, 0.0, 1.0); }`;
// Linse L1: Ränder fest, Mitte gestaucht (k < 0, Hohlschale) oder vergrößert (k > 0, Fischauge); Farbsaum wächst zum Rand; k = 0 und ab = 0 ist die Identität
const FS2 = `#version 300 es
precision highp float;
in vec2 vUv; uniform sampler2D uTex; uniform float uK, uAb, uAsp, uHelle; out vec4 o;
vec2 q(vec2 uv, float s) { return 0.5 + (uv - 0.5) * s; }
void main() {
  vec2 d = (vUv - 0.5) * vec2(uAsp, 1.0); float r2 = clamp(dot(d, d) / (0.25 * (uAsp * uAsp + 1.0)), 0.0, 1.0);
  float s = 1.0 - 0.38 * uK * (1.0 - r2), a = uAb * 0.012 * r2;
  vec3 c = a > 0.0 ? vec3(texture(uTex, q(vUv, s * (1.0 + a))).r, texture(uTex, q(vUv, s)).g, texture(uTex, q(vUv, s * (1.0 - a))).b) : texture(uTex, q(vUv, s)).rgb;
  float v = 1.0 - 0.08 * max(-uK, 0.0) * r2 + 0.04 * max(uK, 0.0) * (1.0 - r2);
  o = vec4(c * v * uHelle, 1.0);
}`;

// ---------- kleine Matrix-Hilfen (spaltenweise) ----------
const mul = (a, b) => { const r = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; r[i * 4 + j] = s; } return r; };
const ident = () => { const m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; };
const trans = (x, y, z) => { const m = ident(); m[12] = x; m[13] = y; m[14] = z; return m; };
const rotX = g => { const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), m = ident(); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; };
const rotY = g => { const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), m = ident(); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; };
const rotZ = g => { const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), m = ident(); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; };
const persp = (fovy, asp, n, f) => { const t = 1 / Math.tan(fovy * Math.PI / 360), m = new Float32Array(16); m[0] = t / asp; m[5] = t; m[10] = (f + n) / (n - f); m[11] = -1; m[14] = 2 * f * n / (n - f); return m; };
const hex = s => { const h = String(s || '#000').replace('#', ''), v = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16); return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255]; };

// ---------- Formen: Liste von Flächen { pos[], uv[], n[], seite } (Bildhöhe 1, Breite a = W/H) ----------
// Viereck aus Mitte c, Achsen ex/ey (halbe Kanten), Normale n; uv: u von links nach rechts, v von oben (Canvas, ohne Y-Spiegeln hochgeladen)
const quad = (c, ex, ey, n, seite, uSpiegel = false) => {
  const P = [[-1, 1], [1, 1], [1, -1], [-1, 1], [1, -1], [-1, -1]], pos = [], uv = [], nn = [];
  for (const [sx, sy] of P) { pos.push(c[0] + sx * ex[0] + sy * ey[0], c[1] + sx * ex[1] + sy * ey[1], c[2] + sx * ex[2] + sy * ey[2]);
    const u = (sx + 1) / 2; uv.push(uSpiegel ? 1 - u : u, (1 - sy) / 2); nn.push(...n); }
  return { pos, uv, n: nn, seite };
};
function form(F, a) {
  const h = .5, w = a / 2;
  if (F.typ === 'karte') { const d = (F.dicke ?? .03) / 2;
    return { vorneZ: d, flaechen: [quad([0, 0, d], [w, 0, 0], [0, h, 0], [0, 0, 1], 'vorn'), quad([0, 0, -d], [w, 0, 0], [0, h, 0], [0, 0, -1], 'hinten', true),
      quad([w, 0, 0], [0, 0, d], [0, h, 0], [1, 0, 0], 'rand'), quad([-w, 0, 0], [0, 0, -d], [0, h, 0], [-1, 0, 0], 'rand'),
      quad([0, h, 0], [w, 0, 0], [0, 0, d], [0, 1, 0], 'rand'), quad([0, -h, 0], [w, 0, 0], [0, 0, -d], [0, -1, 0], 'rand')] }; }
  if (F.typ === 'kubus') { const t = w;   // Tiefe = Bildbreite: die rechte Seite hat dasselbe Format wie vorn
    return { vorneZ: t, flaechen: [quad([0, 0, t], [w, 0, 0], [0, h, 0], [0, 0, 1], 'vorn'), quad([w, 0, 0], [0, 0, -t], [0, h, 0], [1, 0, 0], 'rechts'),
      quad([-w, 0, 0], [0, 0, t], [0, h, 0], [-1, 0, 0], 'links'), quad([0, 0, -t], [-w, 0, 0], [0, h, 0], [0, 0, -1], 'hinten'),
      quad([0, h, 0], [w, 0, 0], [0, 0, -t], [0, 1, 0], 'oben'), quad([0, -h, 0], [w, 0, 0], [0, 0, t], [0, -1, 0], 'unten')] }; }
  return { vorneZ: 0, flaechen: [quad([0, 0, 0], [w, 0, 0], [0, h, 0], [0, 0, 1], 'vorn')] };   // 'ebene'
}

// canvas: optional (sonst OffscreenCanvas bzw. Canvas). Rückgabe { ok, grund, canvas, zeichne(szene), stats }
export function createRaum({ canvas = null } = {}) {
  const c = canvas || (typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(16, 16) : document.createElement('canvas'));
  let gl = null; try { gl = c.getContext('webgl2', { alpha: false, antialias: true, depth: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }); } catch (e) { gl = null; }
  if (!gl) return { ok: false, grund: 'kein WebGL2', canvas: c, zeichne: () => null, stats: { bilder: 0 } };
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error('Raum-Shader: ' + gl.getShaderInfoLog(x)); return x; };
  const prog = (v, f) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, v)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, f)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Raum-Programm: ' + gl.getProgramInfoLog(p));
    const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); } return { p, u }; };
  let PM, PL; try { PM = prog(VS, FS); PL = prog(VS2, FS2); } catch (e) { return { ok: false, grund: String(e.message || e), canvas: c, zeichne: () => null, stats: { bilder: 0 } }; }
  // Vollbild-Dreieck
  const vaoL = gl.createVertexArray(); gl.bindVertexArray(vaoL); const bL = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bL);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); const aP = gl.getAttribLocation(PL.p, 'aP'); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  // Texturen je Slot; Formen je (Rezept, Format) zwischengespeichert
  const TX = new Map(), FORMEN = new Map();
  const tex = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); return t; };
  const lade = (slot, bild) => { let t = TX.get(slot); if (!t) TX.set(slot, t = tex()); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, bild); return t; };
  const meshVon = (R, a) => { const key = R.id + '@' + a.toFixed(4); if (FORMEN.has(key)) return FORMEN.get(key);
    const fo = form(R.form || { typ: 'ebene' }, a), teile = [];
    for (const f of fo.flaechen) { const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
      for (const [name, data, k] of [['aPos', f.pos, 3], ['aUv', f.uv, 2], ['aN', f.n, 3]]) { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        const l = gl.getAttribLocation(PM.p, name); if (l >= 0) { gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, k, gl.FLOAT, false, 0, 0); } }
      gl.bindVertexArray(null); teile.push({ vao, n: f.pos.length / 3, seite: f.seite }); }
    const m = { vorneZ: fo.vorneZ, teile }; FORMEN.set(key, m); return m; };
  // Zwischenziel für Raum + Linse: Mehrfachabtastung, dann in eine Textur
  let FB = null;
  const fbFuer = (W, H) => { if (FB && FB.W === W && FB.H === H) return FB;
    if (FB) { gl.deleteFramebuffer(FB.ms); gl.deleteFramebuffer(FB.fb); gl.deleteRenderbuffer(FB.rc); gl.deleteRenderbuffer(FB.rd); gl.deleteTexture(FB.t); }
    const ms = gl.createFramebuffer(), rc = gl.createRenderbuffer(), rd = gl.createRenderbuffer(), sm = Math.min(4, gl.getParameter(gl.MAX_SAMPLES));
    gl.bindRenderbuffer(gl.RENDERBUFFER, rc); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, sm, gl.RGBA8, W, H);
    gl.bindRenderbuffer(gl.RENDERBUFFER, rd); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, sm, gl.DEPTH_COMPONENT24, W, H);
    gl.bindFramebuffer(gl.FRAMEBUFFER, ms); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rc); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rd);
    const t = tex(); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return FB = { W, H, ms, rc, rd, t, fb }; };
  const vollbild = (t, { k = 0, ab = 0, helle = 1, flipY = false, asp = 1 } = {}) => {
    gl.useProgram(PL.p); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(PL.u.uTex, 0);
    gl.uniform1f(PL.u.uK, k); gl.uniform1f(PL.u.uAb, ab); gl.uniform1f(PL.u.uAsp, asp); gl.uniform1f(PL.u.uHelle, helle); gl.uniform1f(PL.u.uFlipY, flipY ? 1 : 0);
    gl.bindVertexArray(vaoL); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.bindVertexArray(null); };
  const stats = { bilder: 0, raum: 0, linse: 0, msMittel: 0 };

  // szene: { W, H, rezept?, p, tex: { jetzt, vorig? }, linse?: { k, ab } } → Canvas des Durchgangs
  function zeichne(s) {
    const a0 = performance.now(), W = s.W, H = s.H, asp = W / H, R = s.rezept;
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const tJ = lade('jetzt', s.tex.jetzt), tV = s.tex.vorig ? lade('vorig', s.tex.vorig) : tJ, T = { jetzt: tJ, vorig: tV };
    const L = s.linse && (Math.abs(s.linse.k) > 1e-4 || s.linse.ab > 0) ? s.linse : null;
    let quelle = tJ, flipY = false;
    if (R) {
      const ziel = L ? fbFuer(W, H) : null; gl.bindFramebuffer(gl.FRAMEBUFFER, ziel ? ziel.ms : null); gl.viewport(0, 0, W, H);
      const hg = R.hintergrund || {}, hc = hex(hg.farbe || '#000'); gl.clearColor(hc[0], hc[1], hc[2], 1); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST); gl.depthMask(false);
      if (hg.tex) vollbild(T[hg.tex] || tJ, { helle: 1 - (hg.dunkel ?? .5), asp });
      // Kamera: die Vorderseite füllt in Ruhe genau das Bild
      const fov = (R.kamera && R.kamera.fov) || 30, mesh = meshVon(R, asp), dist = mesh.vorneZ + .5 / Math.tan(fov * Math.PI / 360);
      const P = persp(fov, asp, .05, 60), V = trans(0, 0, -dist);
      const rot = spurBei(R.spur && R.spur.rot, s.p), pos = spurBei(R.spur && R.spur.pos, s.p);
      const Mm = mul(trans(pos[0], pos[1], pos[2]), mul(rotY(rot[1]), mul(rotX(rot[0]), rotZ(rot[2]))));
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.disable(gl.CULL_FACE);
      gl.useProgram(PM.p); gl.uniformMatrix4fv(PM.u.uP, false, P); gl.uniformMatrix4fv(PM.u.uV, false, V); gl.uniformMatrix4fv(PM.u.uM, false, Mm);
      const li = R.licht || {}, ld = li.richtung || [0, 0, 1]; gl.uniform3f(PM.u.uL, ld[0], ld[1], ld[2]); gl.uniform3f(PM.u.uCam, 0, 0, dist);
      gl.uniform1f(PM.u.uStaerke, li.staerke ?? .5); gl.activeTexture(gl.TEXTURE0); gl.uniform1i(PM.u.uTex, 0);
      const F = R.form || {}, rand = hex(F.rand || F.farbe || '#e9e1cf');
      for (const tl of mesh.teile) {
        const quelleS = R.seiten && R.seiten[tl.seite];
        if (quelleS) { gl.uniform1i(PM.u.uMitTex, 1); gl.bindTexture(gl.TEXTURE_2D, T[quelleS] || tJ); } else { gl.uniform1i(PM.u.uMitTex, 0); gl.uniform3f(PM.u.uFarbe, rand[0], rand[1], rand[2]); }
        gl.uniform1f(PM.u.uGlanz, F.typ === 'karte' ? (li.glanz ?? 0) : 0);
        gl.bindVertexArray(tl.vao); gl.drawArrays(gl.TRIANGLES, 0, tl.n);
      }
      gl.bindVertexArray(null); gl.disable(gl.DEPTH_TEST);
      if (ziel) { gl.bindFramebuffer(gl.READ_FRAMEBUFFER, ziel.ms); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, ziel.fb); gl.blitFramebuffer(0, 0, W, H, 0, 0, W, H, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null); quelle = ziel.t; flipY = true; }
      stats.raum++;
    }
    if (L || !R) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); gl.disable(gl.DEPTH_TEST); vollbild(quelle, { k: L ? L.k : 0, ab: L ? L.ab || 0 : 0, flipY, asp }); if (L) stats.linse++; }
    stats.bilder++; const ms = performance.now() - a0; stats.msMittel += (ms - stats.msMittel) / Math.min(stats.bilder, 30);
    return c;
  }
  return { ok: true, grund: null, canvas: c, gl, zeichne, stats, timer: !!gl.getExtension('EXT_disjoint_timer_query_webgl2') };
}
