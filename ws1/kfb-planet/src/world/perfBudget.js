// Slice 1 · Leistungsbudget (V-370, WS0 16.10. Slice-Plan R2 Punkt 2): Zielgerät Laptop ohne eigene GPU (Apple M1 Basis / Intel Iris Xe), 1080p,
// p95 ≥ 30 fps; Referenz M1 Max ≥ 60 fps; erstes Laden ≤ 40 MB, je Zone ≤ 15 MB; im Bild ≤ 300 Draw Calls, ≤ 600 k Dreiecke.
// Rein: ohne three, ohne DOM, Node-geprüft (test/unit/perfBudget.mjs). Eingang wie renderer.info ({ render: { calls, triangles } }) plus eine Reihe
// Bildzeiten in ms; das Performance-Overlay (Host) sammelt sie und zeigt das Ergebnis. „p95 ≥ 30 fps“ heißt: 95 % der Bilder ≤ 33,3 ms
// (p95 der Bildzeit, nächster Rang). MB = 10⁶ Byte.
export const BUDGET = Object.freeze({
  target: Object.freeze({ device: 'Laptop ohne GPU (M1 Basis / Iris Xe), 1080p', p95Fps: 30 }),
  reference: Object.freeze({ device: 'M1 Max', p95Fps: 60 }),
  drawCalls: 300, triangles: 600_000, firstLoadMB: 40, zoneMB: 15,
})
export const MB = 1_000_000

// Perzentil nach nächstem Rang (ohne Interpolation, wie in Frame-Time-Overlays üblich); leere Reihe → null
export function percentile(samples, p) {
  const a = (samples || []).filter((x) => Number.isFinite(x) && x >= 0).sort((x, y) => x - y); if (!a.length) return null
  const k = Math.min(a.length - 1, Math.max(0, Math.ceil((p / 100) * a.length) - 1)); return a[k]
}

// info: { render: { calls, triangles } } (renderer.info) oder { calls, triangles }; frameMs: Bildzeiten; bytes: { firstLoad, zone } (optional);
// device: 'target' | 'reference'. Ergebnis: { p95Ms, p95Fps, avgMs, frames, items: { fps, drawCalls, triangles, firstLoadMB, zoneMB }, pass }
// items[x] = { value, limit, pass } – pass = null, wenn nicht gemessen; gesamt pass = alle gemessenen bestanden (null, wenn nichts gemessen).
export function evaluate({ info = {}, frameMs = [], bytes = {}, device = 'target' } = {}) {
  const r = info.render || info, p95Ms = percentile(frameMs, 95), frames = frameMs.filter(Number.isFinite).length
  const avgMs = frames ? frameMs.filter(Number.isFinite).reduce((a, x) => a + x, 0) / frames : null
  const p95Fps = p95Ms ? 1000 / p95Ms : null, need = (BUDGET[device] || BUDGET.target).p95Fps
  const item = (value, limit, ok) => ({ value, limit, pass: value == null ? null : ok(value, limit) })
  const items = {
    fps: item(p95Fps == null ? null : +p95Fps.toFixed(2), need, (v, l) => v >= l - 1e-9),
    drawCalls: item(Number.isFinite(r.calls) ? r.calls : null, BUDGET.drawCalls, (v, l) => v <= l),
    triangles: item(Number.isFinite(r.triangles) ? r.triangles : null, BUDGET.triangles, (v, l) => v <= l),
    firstLoadMB: item(Number.isFinite(bytes.firstLoad) ? +(bytes.firstLoad / MB).toFixed(3) : null, BUDGET.firstLoadMB, (v, l) => v <= l),
    zoneMB: item(Number.isFinite(bytes.zone) ? +(bytes.zone / MB).toFixed(3) : null, BUDGET.zoneMB, (v, l) => v <= l),
  }
  const measured = Object.values(items).filter((x) => x.pass !== null)
  return { device, p95Ms, p95Fps, avgMs, frames, items, pass: measured.length ? measured.every((x) => x.pass) : null, failed: Object.entries(items).filter(([, x]) => x.pass === false).map(([k]) => k) }
}

// Ringpuffer für Bildzeiten (das Overlay schiebt je Bild dt·1000 hinein); fester Speicher, keine Allokation pro Bild
export function createFrameSampler(size = 600) {
  const buf = new Float64Array(size); let n = 0, i = 0
  return {
    push(ms) { if (!Number.isFinite(ms) || ms < 0) return; buf[i] = ms; i = (i + 1) % size; n = Math.min(size, n + 1) },
    samples: () => Array.from(n < size ? buf.subarray(0, n) : [...buf.subarray(i), ...buf.subarray(0, i)]),
    count: () => n,
    reset() { n = 0; i = 0 },
  }
}

// Eine Zeile für das Debug-Overlay (kein finales HUD, §44.3)
export function overlayLine(res) {
  const f = (x, d = 1) => (x == null ? '–' : x.toFixed(d)), it = res.items, mark = (x) => (x.pass === null ? '·' : x.pass ? '✓' : '✗')
  return `p95 ${f(res.p95Ms)} ms (${f(res.p95Fps, 0)} fps ${mark(it.fps)}) · Calls ${it.drawCalls.value ?? '–'}/${BUDGET.drawCalls} ${mark(it.drawCalls)} · Dreiecke ${it.triangles.value == null ? '–' : Math.round(it.triangles.value / 1000) + 'k'}/600k ${mark(it.triangles)}`
}
