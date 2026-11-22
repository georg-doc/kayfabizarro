// Klangspieler NUR für die Testbühne (Artefakt): spielt die Ereignisse der Buchmaschine nach TON_BELEGUNG_R1 (WS0) mit WebAudio.
// Im Spiel spielt der Audio-Host (V-1957) dieselben Ereignisse; dieses Modul wird dort nicht gebraucht.
// createTon({ belegung, karte }) → { an(), aus(), melde(e), rascheln(staerke 0…1), laeuft }
export function createTon({ belegung, karte }) {
  const B = belegung.ereignisse, KAPPE = belegung.kappe || { sfx_je_s: 14, gleichzeitig: 10 }
  let ctx = null, master = null, schicht = null, schichtGain = null, laeuft = false
  const puffer = new Map(), gespielt = [], blitzAn = []
  let zahnN = 0, schubT = -9, schubN = 0
  const rnd = (a, b) => a + Math.random() * (b - a), wahl = (a) => a[Math.floor(Math.random() * a.length)]
  async function lade(id) {
    if (puffer.has(id)) return puffer.get(id)
    const p = (async () => { const pfad = karte[id]; if (!pfad) return null; try { const r = await fetch(pfad); return await ctx.decodeAudioData(await r.arrayBuffer()) } catch { return null } })()
    puffer.set(id, p); return p
  }
  async function spiele(id, pegel, tonhoehe = 1, pan = 0, maxS = null, wann = 0) {
    if (!ctx) return; const b = await lade(id); if (!b) return
    const q = ctx.createBufferSource(); q.buffer = b; q.playbackRate.value = tonhoehe
    const g = ctx.createGain(); g.gain.value = pegel; const p = ctx.createStereoPanner(); p.pan.value = pan
    q.connect(g).connect(p).connect(master); const t = ctx.currentTime + wann; q.start(t)
    if (maxS) { g.gain.setValueAtTime(pegel, t + Math.max(0, maxS - 0.08)); g.gain.linearRampToValueAtTime(0, t + maxS); q.stop(t + maxS + 0.02) }
  }
  function kappeOk() { const t = performance.now() / 1000; while (gespielt.length && gespielt[0] < t - 1) gespielt.shift(); if (gespielt.length >= KAPPE.sfx_je_s) return false; gespielt.push(t); return true }
  const panVon = (e) => Math.max(-0.8, Math.min(0.8, ((e.ort && e.ort[0]) || 0) / 7))
  function melde(e) {
    if (!laeuft) return
    const st = e.staerke ?? 1
    switch (e.typ) {
      case 'zahn': { zahnN++; if (zahnN % 2) return; const Z = B.zahn, ids = e.rueck ? [...Z.ids].reverse() : Z.ids; if (kappeOk()) spiele(ids[(zahnN / 2) % 2], Z.pegel, e.rueck ? 0.9 : rnd(...Z.tonhoehe), panVon(e) * 0.3); return }
      case 'einrasten': { const Z = B.einrasten, t = performance.now() / 1000; if (t - schubT > 1) { schubT = t; schubN = 0 } if (schubN >= Z.je_schub || Math.random() > 0.25) return; schubN++
        const [lo, hi] = Z.tonhoehe_nach_groesse; if (kappeOk()) spiele(wahl(Z.ids), Z.pegel, hi - (hi - lo) * Math.min(1, st), panVon(e)); return }
      case 'schlag': { const Z = B.schlag, id = wahl(Z.ids), g = Math.min(Z.pegel_max, st * Z.pegel_max); spiele(id, g, 1, panVon(e)); spiele(id, g * 0.6, 1.05, panVon(e), null, 0.12); return }
      case 'dampf': { const Z = B.dampf; if (st >= 0.8) spiele(Z.ids[0], Z.kraeftig.pegel, 1, 0, Z.kraeftig.dauer_s); else if (kappeOk()) spiele(Z.ids[0], Z.gelenk.pegel, rnd(...Z.gelenk.tonhoehe), panVon(e), Z.gelenk.dauer_s); return }
      case 'umbau': { const Z = B.umbau; spiele(wahl(Z.ids), Z.pegel); for (const id of (Z.unterlage?.ids || [])) spiele(id, Z.unterlage.pegel); return }
      case 'blitz': { const Z = B.blitz, t = performance.now() / 1000; while (blitzAn.length && blitzAn[0] < t) blitzAn.shift(); if (blitzAn.length >= Z.max_gleichzeitig || !kappeOk()) return
        spiele(st > 0.7 ? Z.ids[1] : wahl([Z.ids[0], Z.ids[2], Z.ids[3]]), Z.pegel * (0.7 + 0.3 * st), rnd(0.95, 1.1), panVon(e)); blitzAn.push(t + 0.4); return }
      case 'schaelen': { const Z = B.schaelen; if (kappeOk()) spiele(wahl(Z.ids), Z.pegel * (0.6 + 0.6 * st), rnd(...Z.tonhoehe), panVon(e)); return }
      default: { const Z = B[e.typ]; if (!Z?.ids?.length || !kappeOk()) return; spiele(wahl(Z.ids), (Z.pegel ?? 0.5) * Math.min(1.2, st), Z.tonhoehe ? rnd(...Z.tonhoehe) : 1, panVon(e), Z.dauer_s || null) }   // R8: Ereignisse mit ids + pegel (+ tonhoehe) aus der Belegung
    }
  }
  async function baueSchicht() {   // Rascheln: die Papierklänge hintereinander als Schleife, Pegel über rascheln()
    const bs = (await Promise.all(B.rascheln.ids.map(lade))).filter(Boolean); if (!bs.length) return
    const n = bs.reduce((s, b) => s + b.length, 0), sr = bs[0].sampleRate, buf = ctx.createBuffer(2, n, sr); let o = 0
    for (const b of bs) { for (let c = 0; c < 2; c++) buf.getChannelData(c).set(b.getChannelData(Math.min(c, b.numberOfChannels - 1)), o); o += b.length }
    schicht = ctx.createBufferSource(); schicht.buffer = buf; schicht.loop = true; schichtGain = ctx.createGain(); schichtGain.gain.value = 0; schicht.connect(schichtGain).connect(master); schicht.start()
  }
  async function baueGrund() {   // Grundton der Kammer (R8b): Schleife über die ganze Laufzeit
    const Z = B.kammer; if (!Z?.ids?.length) return; const b = await lade(Z.ids[0]); if (!b) return
    const q = ctx.createBufferSource(); q.buffer = b; q.loop = true; const g = ctx.createGain(); g.gain.value = Z.pegel ?? 0.3; q.connect(g).connect(master); q.start()
  }
  return {
    get laeuft() { return laeuft },
    async an() { if (!ctx) { ctx = new AudioContext(); master = ctx.createGain(); master.gain.value = 0.8; const k = ctx.createDynamicsCompressor(); master.connect(k).connect(ctx.destination); baueSchicht(); baueGrund() } await ctx.resume(); laeuft = true },
    aus() { laeuft = false; ctx?.suspend() },
    melde,
    rascheln(x) { if (schichtGain && ctx) schichtGain.gain.setTargetAtTime(Math.min(1, x) * (B.rascheln.pegel_max || 0.5), ctx.currentTime, 0.1) },
  }
}
