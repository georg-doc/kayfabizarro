// Minimap (ein Zeichner für alle HUD-Bausteine: Kompass-Deckel im Knet-HUD, Karten-Flyout im HUD 3D): Norden oben, Gelände aus sample(x, z) als
// 64 × 64-Kachel (neu bei > ¼ Radius Versatz), Weg, Marken, Zielring (Annäherungsfarbe), Spieler-Pfeil in Fahrtrichtung, weicher Rand.
// Kein three, kein Zustand außer der Kachel; gezeichnet wird in ein übergebenes Canvas.
const hexRgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '')); if (!m) return [205, 187, 146]; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] }

// o: { radius (Welt-m), sample: (x, z) => '#rrggbb'|null, path: [[x, z]…], marks: () => [{ x, z, color, r }] }
export function createMiniMap(o = {}) {
  const R = o.radius ?? 140, T = { cx: NaN, cz: NaN, base: null }
  return {
    radius: R,
    // s: { pos: { x, z }, heading (rad, 0 = +Z), target: { x, z, color } | null, vignette = true, force }
    draw(canvas, s) {
      const p = s.pos; if (!p) return false
      const g = canvas.getContext('2d'), N = canvas.width
      if (s.force || !T.base || Math.hypot(p.x - T.cx, p.z - T.cz) > R / 4) {
        T.cx = p.x; T.cz = p.z; const n = 64, b = T.base || (T.base = document.createElement('canvas')); b.width = b.height = n; const bg = b.getContext('2d'), img = bg.createImageData(n, n)
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const x = p.x + ((i + 0.5) / n * 2 - 1) * R, z = p.z + ((j + 0.5) / n * 2 - 1) * R, [r, gg, bb] = hexRgb(o.sample?.(x, z)), k = (j * n + i) * 4
          img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = bb; img.data[k + 3] = 255 }
        bg.putImageData(img, 0, 0)
      }
      const toPx = (x, z) => [((x - T.cx) / R * 0.5 + 0.5) * N, ((z - T.cz) / R * 0.5 + 0.5) * N], u0 = N / 256
      g.save(); g.imageSmoothingEnabled = true; g.drawImage(T.base, 0, 0, N, N)
      if (o.path?.length > 1) { g.lineWidth = 7 * u0; g.lineCap = g.lineJoin = 'round'; g.strokeStyle = 'rgba(70,46,30,.55)'; g.beginPath(); o.path.forEach(([x, z], i) => { const [u, v] = toPx(x, z); i ? g.lineTo(u, v) : g.moveTo(u, v) }); g.stroke(); g.lineWidth = 3.5 * u0; g.strokeStyle = '#f6e3b8'; g.stroke() }
      for (const m of o.marks?.() || []) { const [u, v] = toPx(m.x, m.z); if (u < -8 || v < -8 || u > N + 8 || v > N + 8) continue; g.fillStyle = m.color || '#c9508f'; g.strokeStyle = '#1f1a14'; g.lineWidth = 2.5 * u0; g.beginPath(); g.arc(u, v, (m.r || 7) * u0, 0, Math.PI * 2); g.fill(); g.stroke() }
      if (s.target) { let [u, v] = toPx(s.target.x, s.target.z); const pad = 12 * u0, out = u < pad || v < pad || u > N - pad || v > N - pad; u = Math.max(pad, Math.min(N - pad, u)); v = Math.max(pad, Math.min(N - pad, v)) // außerhalb: am Rand festhalten
        g.lineWidth = 4 * u0; g.strokeStyle = '#130e16'; g.beginPath(); g.arc(u, v, 9 * u0, 0, Math.PI * 2); g.stroke(); g.lineWidth = 3 * u0; g.strokeStyle = s.target.color || '#f2c230'; g.beginPath(); g.arc(u, v, 9 * u0, 0, Math.PI * 2); g.stroke()
        if (out) { g.fillStyle = s.target.color || '#f2c230'; g.beginPath(); g.arc(u, v, 3 * u0, 0, Math.PI * 2); g.fill() } }
      const [u, v] = toPx(p.x, p.z), hh = s.heading || 0; g.translate(u, v); g.rotate(-hh + Math.PI); g.scale(u0, u0); g.fillStyle = '#fff6df'; g.strokeStyle = '#1f1a14'; g.lineWidth = 3
      g.beginPath(); g.moveTo(0, -15); g.lineTo(10, 11); g.lineTo(0, 5); g.lineTo(-10, 11); g.closePath(); g.fill(); g.stroke(); g.restore()
      if (s.vignette !== false) { const gr = g.createRadialGradient(N / 2, N / 2, N * 0.36, N / 2, N / 2, N * 0.5); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(40,24,12,.35)'); g.fillStyle = gr; g.fillRect(0, 0, N, N) }
      return true
    },
  }
}
