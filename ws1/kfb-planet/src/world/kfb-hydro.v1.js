// kfb-hydro.v1 · Flüsse, Bergseen, Wasserfälle (Netz zuerst) · ERZEUGT von probe/port/gen_hydro.py aus probe/gelaende-probe.html (HYDRO_BEGIN…END, sha 10ad3347c753).
// Nicht von Hand ändern: Quelle ist die Gelände-Probe. Rein (ohne three.js): Eingang = Höhenraster + Höhenfunktion, Ausgang = Läufe, Seen, Fälle,
// Talprofil-Feld (512² · R = Sohle·Gewicht, G = Gewicht, B = Maske, A = Pegel) und Mesh-Arrays für Wasserband, Seen, Fall und Gischt.
// env: { H (Float32Array HN², Grundhöhe ohne Rinnen), HN, HG (m), ox, oz (Rasterursprung), cx, cz (Feldmitte), wl (Meeresspiegel), hgt(x,z) (Grundhöhe fein),
//        N = 512, size = 1024 (Feld), over() (true = Bild-Budget aufgebraucht → yield), riverArea (m², optional) }
export function* hydroGen(env) {
  const { H, HN, HG, ox, oz, cx, cz, wl, hgt, N = 512, size = 1024, over = () => false, riverArea } = env
  const RIV = { size, on: false, data: { length: N * N * 4 } }, ROX = cx - size / 2, ROZ = cz - size / 2, BG = { over }, ST = {}
  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
      const NC = HN * HN, F = new Float32Array(NC), dir = new Int32Array(NC).fill(-1), seen = new Uint8Array(NC), sea = new Uint8Array(NC), order = new Int32Array(NC); let no = 0
      // Priority-Flood (Barnes) mit kleinem Gefälle auf Flächen: Rand und Meer sind Abflüsse
      const hk = new Float64Array(NC + 8), hv = new Int32Array(NC + 8); let hn = 0
      const push = (key, v) => { let i = hn++; while (i > 0) { const pa = (i - 1) >> 1; if (hk[pa] <= key) break; hk[i] = hk[pa]; hv[i] = hv[pa]; i = pa } hk[i] = key; hv[i] = v }
      const pop = () => { const v = hv[0], key = hk[--hn], last = hv[hn]; let i = 0; for (;;) { let c = 2 * i + 1; if (c >= hn) break; if (c + 1 < hn && hk[c + 1] < hk[c]) c++; if (hk[c] >= key) break; hk[i] = hk[c]; hv[i] = hv[c]; i = c } hk[i] = key; hv[i] = last; return v }
      for (let j = 0; j < HN; j++) for (let i = 0; i < HN; i++) { const k = j * HN + i; if (H[k] < wl) sea[k] = 1; if (sea[k] || i === 0 || j === 0 || i === HN - 1 || j === HN - 1) { F[k] = sea[k] ? wl : H[k]; seen[k] = 1; push(F[k], k) } }
      const NB = [1, -1, HN, -HN, HN + 1, HN - 1, -HN + 1, -HN - 1]
      while (hn) { if ((no & 2047) === 0 && BG.over()) yield 2; const c = pop(); order[no++] = c; const ci = c % HN; for (const d of NB) { const n = c + d; if (n < 0 || n >= NC || seen[n]) continue; const ni = n % HN; if (Math.abs(ni - ci) > 1) continue
        seen[n] = 1; F[n] = Math.max(H[n], F[c] + 1e-3); dir[n] = c; push(F[n], n) } }
      const A = new Float32Array(NC).fill(1); for (let k = no - 1; k >= 0; k--) { const c = order[k]; if (dir[c] >= 0 && !sea[c]) A[dir[c]] += A[c] }
      // Bergseen: gefüllte Senken über dem Meer, ≥ 40 Zellen (640 m²), ≥ 1,2 m tief, die 10 größten, Pegel = höchster Füllstand der Senke
      if (BG.over()) yield 3
      const lakeId = new Int32Array(NC).fill(-1), lakes = []
      for (let k = 0; k < NC; k++) { if ((k & 4095) === 0 && BG.over()) yield 4; if (sea[k] || lakeId[k] >= 0 || F[k] - H[k] < 0.4) continue; const st = [k], cells = []; lakeId[k] = lakes.length; let lv = 0
        while (st.length) { const c = st.pop(); cells.push(c); lv = Math.max(lv, F[c]); const ci = c % HN; for (const d of [1, -1, HN, -HN]) { const n = c + d; if (n < 0 || n >= NC || lakeId[n] >= 0 || sea[n] || Math.abs(n % HN - ci) > 1 || F[n] - H[n] < 0.4) continue; lakeId[n] = lakes.length; st.push(n) } }
        let dmax = 0; for (const c of cells) dmax = Math.max(dmax, F[c] - H[c]); if (cells.length < 40 || dmax < 1.2) { for (const c of cells) lakeId[c] = -2; continue } lakes.push({ cells, lv, lv0: lv, id: lakes.length })   /* ≥ 640 m² und ≥ 1,2 m tief, sonst nur Pfütze im Abfluss */ }
      if (lakes.length > 10) { const keep = new Set([...lakes].sort((a, b) => b.cells.length - a.cells.length).slice(0, 10)); for (const Lk of lakes) if (!keep.has(Lk)) for (const c of Lk.cells) lakeId[c] = -2
        const kept = lakes.filter((Lk) => keep.has(Lk)); kept.forEach((Lk, i) => { for (const c of Lk.cells) lakeId[c] = i }); lakes.length = 0; lakes.push(...kept) }   /* höchstens 10 Bergseen (die größten) */
      let maxA = 0; for (let k = 0; k < NC; k++) if (!sea[k] && lakeId[k] < 0 && A[k] > maxA) maxA = A[k]; ST.maxA = maxA * HG * HG; ST.thr = 0; ST.seaFrac = +(sea.reduce((a, v) => a + v, 0) / NC).toFixed(2)
      const thr = (riverArea || Math.min(60000, Math.max(5000, 0.2 * maxA * HG * HG))) / (HG * HG), isR   /* Schwelle relativ zum größten Einzugsgebiet: jede Landschaft bekommt ihre Hauptläufe (zerklüftete Inseln: Bäche, große Täler: Flüsse) */ = (k) => A[k] >= thr && !sea[k] && lakeId[k] < 0
      ST.thr = thr * HG * HG; const ups = new Uint16Array(NC); for (let k = 0; k < NC; k++) if (isR(k) && dir[k] >= 0) ups[dir[k]]++
      /* Zusammenflüsse: Quellen von oben nach unten verfolgen (der höchste Lauf wird zum Hauptstrang). Jeder Lauf markiert sich mit 2 Zellen (8 m) Saum;
         ein anderer Lauf endet als Mündung, sobald er diesen Saum erreicht – sonst laufen zwei Rinnen eng nebeneinander her und lassen dazwischen einen Rücken stehen */
      const used = new Int32Array(NC).fill(-1), near = new Int32Array(NC).fill(-1), lines = [], srcs = []
      for (let k = 0; k < NC; k++) if (isR(k) && ups[k] === 0) srcs.push(k)
      srcs.sort((p2, q2) => H[q2] - H[p2])
      for (const k of srcs) { if (BG.over()) yield 5; const id = lines.length + srcs.length * 0
        let c = k, fromLake = false; for (const d of NB) { const n = k + d; if (n >= 0 && n < NC && lakeId[n] >= 0 && dir[n] === k) fromLake = true }   /* Seeabfluss: Quelle liegt am Seerand */
        const pts = [], mine = []; let end = 'rand'
        const tag = lines.length + 1
        for (;;) { const ci = c % HN, cj = Math.floor(c / HN)
          if (near[c] > 0 && near[c] !== tag) { let bd = 1e9, bc = -1; for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const n = c + dj * HN + di; if (n >= 0 && n < NC && used[n] > 0 && used[n] !== tag && di * di + dj * dj < bd) { bd = di * di + dj * dj; bc = n } }
            pts.push([ox + ci * HG, oz + cj * HG, A[c]]); if (bc >= 0) pts.push([ox + (bc % HN) * HG, oz + Math.floor(bc / HN) * HG, A[c]]); end = 'mündung'; break }
          pts.push([ox + ci * HG, oz + cj * HG, A[c]]); used[c] = tag; mine.push(c); const n = dir[c]; if (n < 0) break
          if (sea[n]) { pts.push([ox + (n % HN) * HG, oz + Math.floor(n / HN) * HG, A[c]]); end = 'meer'; break } if (lakeId[n] >= 0) { pts.push([ox + (n % HN) * HG, oz + Math.floor(n / HN) * HG, A[c]]); end = 'see'; break } c = n }
        if (pts.length >= 4) { for (const m of mine) { const mi = m % HN; for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const n = m + dj * HN + di; if (n >= 0 && n < NC && Math.abs(n % HN - mi) <= 2 && near[n] < 0) near[n] = tag } } lines.push({ pts, end, fromLake }) }
        else for (const m of mine) used[m] = -1 }
      // glätten (Chaikin ×3), gleichmäßig 2 m, Pegel monoton fallend, Breite/Tiefe aus dem Einzugsgebiet
      const hb = (x, z) => { const fx = (x - ox) / HG, fz = (z - oz) / HG, i = Math.max(0, Math.min(HN - 2, Math.floor(fx))), j = Math.max(0, Math.min(HN - 2, Math.floor(fz))), tx = Math.min(1, Math.max(0, fx - i)), tz = Math.min(1, Math.max(0, fz - j)), k = j * HN + i
        return (H[k] * (1 - tx) + H[k + 1] * tx) * (1 - tz) + (H[k + HN] * (1 - tx) + H[k + HN + 1] * tx) * tz }
      const lakeLv = (x, z) => { const i = Math.round((x - ox) / HG), j = Math.round((z - oz) / HG); if (i < 0 || j < 0 || i >= HN || j >= HN) return null; const id = lakeId[j * HN + i]; return id >= 0 ? lakes[id].lv : null }
      const hT = (x, z) => { const o = RIV.on; RIV.on = false; const h = hgt(x, z); RIV.on = o; return h }   /* Höhe ohne Rinne, je Aufruf umgeschaltet (zwischen den Bildern sieht die Physik immer den alten, vollständigen Stand) */
      for (const L of lines) { if (BG.over()) yield 6; let P = L.pts; for (let it = 0; it < 3; it++) { const Q = [P[0]]; for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1]; Q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25, a[2] * 0.75 + b[2] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75, a[2] * 0.25 + b[2] * 0.75]) } Q.push(P[P.length - 1]); P = Q }
        const R = [P[0]]; let acc = 0; for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]); acc += d; while (acc >= 2) { acc -= 2; const t = 1 - acc / d; R.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]) } } if (R.length < 3) { L.pts = []; continue }
        let lv = Infinity; const endLv = L.end === 'meer' ? wl + 0.08 : L.end === 'see' ? (lakeLv(R[R.length - 1][0], R[R.length - 1][1]) ?? wl) : -Infinity
        L.pts = R.map((q, i) => { const hw = Math.min(6.5, Math.max(2.4, 2.4 + 1.1 * Math.log2(q[2] / thr))), a = R[Math.max(0, i - 1)], b = R[Math.min(R.length - 1, i + 1)], tl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / tl, nz = (b[0] - a[0]) / tl
          void nx; void nz; lv = Math.min(lv, hT(q[0], q[1]) - 0.3); lv = Math.max(lv, endLv);   /* Netz zuerst: Pegel nur aus der Mitte, streng fallend; Ufer baut das Talprofil selbst (hebt notfalls an) */   /* Anschluss an See/Meer nur, soweit die Ufer ihn halten (Seepegel kann über dem Zulauf liegen) */ return { x: q[0], z: q[1], s: i * 2, lv, hw, dp: 0.9 + 0.22 * hw } })
        L.len = (L.pts.length - 1) * 2 }
      /* nur im Rinnen-Gebiet (innere 1024 m, 8 m Rand): außerhalb gäbe es Wasser ohne Bett */
      const inner = (q) => Math.abs(q.x - cx) < RIV.size / 2 - 8 && Math.abs(q.z - cz) < RIV.size / 2 - 8, live = []
      for (const L of lines) { let cur = []; for (const q of L.pts) { if (inner(q)) cur.push(q); else { if (cur.length >= 3) live.push({ ...L, pts: cur, len: (cur.length - 1) * 2, fromLake: L.fromLake && cur[0] === L.pts[0] }); cur = [] } } if (cur.length >= 3) live.push({ ...L, pts: cur, len: (cur.length - 1) * 2, fromLake: L.fromLake && cur[0] === L.pts[0] }) }
      /* Wasserfälle F3 (Kit KONZEPT_R2 §1.2): steile Abschnitte (> 1,5 m auf 6 m) werden zur Stufe – Pegel springt an der Lippe auf das untere Niveau (immer ≤ natürlicher Pegel,
         also nie über den Ufern), darunter ein flaches Becken; je Fall höchstens 6 m, längere Abstiege werden zur Kaskade */
      /* Zusammenfluss: der Nebenfluss endet auf dem Pegel des Hauptflusses (nächster Punkt eines anderen Laufs); davor höchstens 25 % Gefälle – nur absenken (bleibt unter den Ufern),
         große Unterschiede werden unten zum Fall */
      for (const L of live) { if (L.end !== 'mündung') continue; const e = L.pts[L.pts.length - 1]; let best = null
        for (const M of live) { if (M === L) continue; for (const q of M.pts) { const d = Math.hypot(q.x - e.x, q.z - e.z); if (d < 12 && (!best || d < best.d)) best = { d, lv: q.lv } } }
        if (!best) continue; L.joinLv = best.lv; const sE = L.pts[L.pts.length - 1].s; for (const q of L.pts) q.lv = Math.min(q.lv, best.lv + (sE - q.s) * 0.25) }
      const falls = []
      for (const L of live) { const Pp = L.pts, n = Pp.length, nat = Pp.map((q) => q.lv); let i = 0
        while (i < n - 2) { if (nat[i] - nat[Math.min(n - 1, i + 3)] > 1.5) { let j = i + 1; while (j < n - 1 && nat[i] - nat[j + 1] <= 6 && (nat[j] - nat[Math.min(n - 1, j + 3)] > 0.6 || nat[i] - nat[j] < 1.2)) j++
            if (nat[i] - nat[j] >= 1.2 && falls.length < 32) { for (let k = i + 1; k <= j; k++) Pp[k].lv = nat[j]; const A0 = Pp[Math.max(0, i - 1)], B0 = Pp[i + 1], tl = Math.hypot(B0.x - A0.x, B0.z - A0.z) || 1, nx = -(B0.z - A0.z) / tl, nz = (B0.x - A0.x) / tl, wet = () => Pp[i].hw * 1.05   /* Netz zuerst: das Bett ist genau hw breit */
              falls.push({ a: Pp[i], b: Pp[i + 1], top: nat[i], bot: nat[j], hw: Pp[i].hw, wl: wet(1), wr: wet(-1) }); i = j; continue }   /* nasse Breite an der Lippe je Seite: der Vorhang ist so breit wie das Wasser oben */ } i++ } }
      /* Mündung ins Meer: Band um die Bettbreite verlängern (gleicher Pegel), sonst bleibt am Ende Bett ohne Wasser und ohne Meer (dunkles Loch) */
      for (const L of live) { if (L.end !== 'meer') continue; const Pp = L.pts, e = Pp[Pp.length - 1], f = Pp[Pp.length - 2], l = Math.hypot(e.x - f.x, e.z - f.z) || 1, ux = (e.x - f.x) / l, uz = (e.z - f.z) / l
        for (let d = 2; d <= e.hw * 3.4 + 2; d += 2) Pp.push({ x: e.x + ux * d, z: e.z + uz * d, s: e.s + d, lv: e.lv, hw: e.hw, dp: e.dp * Math.max(0, 1 - d / (e.hw * 3.4)) }) }
      // Rinne ins Feld: 512² über die inneren 1024 m; je Texel stärkstes Gewicht (Sohle·Gewicht vormultipliziert → bilinear ohne Sprünge am Rand)
      const D = new Float32Array(RIV.data.length);   /* eigener Puffer: eingesetzt wird erst am Ende */ for (let k = 3; k < D.length; k += 4) D[k] = -999   /* A = örtlicher Wasserpegel (Fluss/See), -999 = keiner */; const ts = RIV.size / N
      const own = new Int16Array(N * N).fill(-1), dist = new Float32Array(N * N).fill(1e9), wetT = new Uint8Array(N * N); let li = 0
      for (const L of live) { const Pp = L.pts, id = li++; for (let i = 0; i < Pp.length - 1; i++) { if ((i & 7) === 0 && BG.over()) yield 7; const a = Pp[i], b = Pp[i + 1], r = Math.max(a.hw, b.hw) * 3.4 + 6
        const i0 = Math.max(0, Math.floor((Math.min(a.x, b.x) - r - ROX) / ts)), i1 = Math.min(N - 1, Math.ceil((Math.max(a.x, b.x) + r - ROX) / ts)), j0 = Math.max(0, Math.floor((Math.min(a.z, b.z) - r - ROZ) / ts)), j1 = Math.min(N - 1, Math.ceil((Math.max(a.z, b.z) + r - ROZ) / ts))
        const dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz || 1
        for (let j = j0; j <= j1; j++) for (let ii = i0; ii <= i1; ii++) { const tr = ((ROX + (ii + 0.5) * ts - a.x) * dx + (ROZ + (j + 0.5) * ts - a.z) * dz) / l2; if (i === 0 && tr < -0.25) continue   /* keine runde Kappe hinter der Quelle (grub sonst in tieferes Gelände ohne Wasser) */
          const x = ROX + (ii + 0.5) * ts, z = ROZ + (j + 0.5) * ts, t = Math.max(0, Math.min(1, tr)), d = Math.hypot(x - a.x - t * dx, z - a.z - t * dz)
          /* Netz zuerst (Génevaux 2013, Kit-Regel „Gelände an der Fließlinie formen“): Talprofil = Bett (Parabel bis zum Pegel bei hw) · Ufer (+0,6 m bis 1,35 hw) · ebene Aue bis 1,6 hw,
             danach weich zurück ins Grundgelände bis 3,4 hw. Das Profil ERSETZT das Gelände (hebt und senkt) → Ufer liegen immer über dem Wasser */
          const hw = a.hw + (b.hw - a.hw) * t, w = 1 - ss(hw + Math.max(3.2, hw * 0.6) + 1.5, hw * 3.4 + 6, d); if (w <= 0) continue
          const k = (j * N + ii) * 4, lvH = a.lv + (b.lv - a.lv) * t, dp = a.dp + (b.dp - a.dp) * t, q2 = Math.min(1, d / hw)
          const bw = Math.max(3.2, hw * 0.6), tgt = d < hw ? lvH - 0.5 - (dp - 0.5) * (1 - q2 * q2) : lvH - 0.5 + 1.5 * ss(hw, hw + bw, d)   /* Bett bis zum Bandrand 0,5 m unter Wasser (das Band zeichnet die Kante, nicht die Dreiecke), Böschung über ≥ 3,2 m auf +1 m */, oW = D[k + 1], wet = d < hw + 0.3
          const kk = j * N + ii, dn = d / hw, both = wet && wetT[kk]   /* nächstes Flussstück bestimmt das Profil (relativer Abstand); wo beide Wasser führen, gewinnt das tiefere */
          const oT = oW > 0 ? D[k] / oW : 0, win = oW === 0 || (both ? tgt < oT : wet ? true : wetT[kk] ? false : (w > 0.95 && oW > 0.95 ? tgt > oT : dn < dist[kk]))   /* Wasser schneidet durch Ufer; zwei Ufer: das höhere bleibt (Damm), in der Auslaufzone das nähere */
          if (win) { D[k] = tgt * w; D[k + 1] = Math.max(w, both ? oW : 0) === w ? w : oW; if (D[k + 1] !== w) D[k] = tgt * D[k + 1]; dist[kk] = dn; own[kk] = id; wetT[kk] = wet ? 1 : 0; D[k + 3] = wet ? lvH : -999 }
          else if (w > oW) { D[k] = (D[k] / oW) * w; D[k + 1] = w } }   /* Gewicht darf wachsen, Profil bleibt beim näheren Stück */ } }
      for (let j = 1; j < N - 1; j++) { if ((j & 31) === 0 && BG.over()) yield 8; for (let i = 1; i < N - 1; i++) { let m = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) m = Math.max(m, D[((j + b) * N + i + a) * 4 + 1]); D[(j * N + i) * 4 + 2] = m } }   /* Maske für den frühen Ausstieg */
      // Wasser: Band je Fluss (5 Spuren quer, Pegel konstant quer), Seen als flaches Raster; Fließanteil am Seeabfluss von 0 hochgeblendet (Kit: keine Naht)
      const pos = [], fl = [], sn = [], lvA = [], idx = []
      for (const L of live) { const Pp = L.pts, n0 = pos.length / 3, lanes = [-1, -0.8, -0.55, -0.28, 0, 0.28, 0.55, 0.8, 1], NL = lanes.length   /* Bandkante = Flusskante (glatte Linie) */   /* breiter als die Mulde: die Wasserkante entsteht am Ufer (Gelände über Pegel), nie am Bandrand */
        for (let i = 0; i < Pp.length; i++) { const a = Pp[Math.max(0, i - 1)], b = Pp[Math.min(Pp.length - 1, i + 1)], tx = b.x - a.x, tz = b.z - a.z, tl = Math.hypot(tx, tz) || 1, ux = tx / tl, uz = tz / tl, q = Pp[i]
          const f = (L.fromLake ? ss(0, 8, q.s) : 1) * Math.min(1, ss(0, 4, q.s) + 0.4)
          for (const ln of lanes) { pos.push(q.x - uz * ln * q.hw, q.lv, q.z + ux * ln * q.hw); fl.push(ux * f, uz * f); sn.push(q.s, ln * q.hw); lvA.push(q.lv) } }
        for (let i = 0; i < Pp.length - 1; i++) for (let k = 0; k < NL - 1; k++) { const a = n0 + i * NL + k, b = a + 1, c = a + NL, d = c + 1; idx.push(a, c, b, b, c, d) } }
      for (const Lk of lakes) { if (BG.over()) yield 9; let i0 = 1e9, i1 = -1, j0 = 1e9, j1 = -1; for (const c of Lk.cells) { const i = c % HN, j = Math.floor(c / HN); i0 = Math.min(i0, i); i1 = Math.max(i1, i); j0 = Math.min(j0, j); j1 = Math.max(j1, j) }
        i0 = Math.max(0, i0 - 1); j0 = Math.max(0, j0 - 1); i1 = Math.min(HN - 1, i1 + 1); j1 = Math.min(HN - 1, j1 + 1); const n0 = pos.length / 3, W = i1 - i0 + 1
        for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const x = ox + i * HG, z = oz + j * HG; pos.push(x, Lk.lv, z); fl.push(0, 0); sn.push(x, z); lvA.push(Lk.lv) }
        { const sD = (x, z) => { const tx = (x - ROX) / RIV.size * N - 0.5, tz = (z - ROZ) / RIV.size * N - 0.5, c0 = Math.floor(tx + 0.5), c1 = Math.floor(tz + 0.5); if (c0 < 1 || c1 < 1 || c0 > N - 2 || c1 > N - 2) return null   /* = rivSampleJS am neuen Puffer */
            const fx = tx - c0, fz = tz - c1, wx = [0.5 * (0.5 - fx) ** 2, 0.75 - fx * fx, 0.5 * (0.5 + fx) ** 2], wz = [0.5 * (0.5 - fz) ** 2, 0.75 - fz * fz, 0.5 * (0.5 + fz) ** 2]; let r = 0, g = 0
            for (let jj = 0; jj < 3; jj++) for (let i3 = 0; i3 < 3; i3++) { const k = ((c1 + jj - 1) * N + c0 + i3 - 1) * 4, w = wx[i3] * wz[jj]; r += w * D[k]; g += w * D[k + 1] } return [r, g] }
          let rim = Infinity, nC = 0;   /* Rand am NEUEN Feld: Grundhöhe (ohne Rinne) mit dem neuen Talprofil gemischt */ const inL = new Set(Lk.cells)   /* Pegel = tiefster ECHTER Randpunkt (feines Gelände, 1 m Abtastung entlang der Zellgrenzen): das 4-m-Raster sah den Rand höher → Wasser hing über der Schlucht */
          for (const c of Lk.cells) { if ((++nC & 63) === 0 && BG.over()) yield 10; const ci = c % HN, cj = Math.floor(c / HN); for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = c + dj * HN + di; if (inL.has(n)) continue
            for (let f = 0; f <= 4; f++) { const x = ox + (ci + di * 0.75) * HG + (dj ? (f / 4 - 0.5) * HG : 0), z = oz + (cj + dj * 0.75) * HG + (di ? (f / 4 - 0.5) * HG : 0), rv = sD(x, z); if (rv && rv[1] > 0.3) continue; const h0 = hT(x, z); rim = Math.min(rim, rv && rv[1] > 1e-4 ? h0 * (1 - rv[1]) + rv[0] : h0) } } }   /* am geformten Gelände (Netz zuerst), Abflussrinne ausgenommen */
          let flo = Infinity; for (const c of Lk.cells) flo = Math.min(flo, H[c]); Lk.lv = Math.min(Lk.lv, rim - 0.12, flo + 3.5);   /* höchstens 3,5 m tief: Teich am Grund statt randvoll gefüllter Grube (Georg 21.10.: man fuhr unter der Seefläche) */ for (let k = n0; k < pos.length / 3; k++) { pos[k * 3 + 1] = Lk.lv; lvA[k] = Lk.lv } }
        const own = new Uint8Array(NC), fl2 = [...Lk.cells]; for (const c of fl2) own[c] = 2   /* Flutfüllung vom Seegrund bis knapp über den Pegel, dann genau eine Randzelle: nie über den Uferkamm auf tieferes Gelände (Georg 21.10.) */
        while (fl2.length) { const c = fl2.pop(), ci = c % HN; for (const d of [1, -1, HN, -HN]) { const n = c + d; if (n < 0 || n >= NC || own[n] || Math.abs(n % HN - ci) > 1) continue; if (H[n] < Lk.lv + 0.3 && F[n] >= Lk.lv0 - 0.01) { own[n] = 2; fl2.push(n) } } }   /* nur Beckenzellen (bis zum Überlauf gefüllt): unterhalb des Abflusses ist F = H < Überlauf */
        if (BG.over()) yield 11
        for (let c = 0; c < NC; c++) if (own[c] === 2) { const ci = c % HN; for (const d of [1, -1, HN, -HN, HN + 1, HN - 1, -HN + 1, -HN - 1]) { const n = c + d; if (n >= 0 && n < NC && !own[n] && Math.abs(n % HN - ci) <= 1 && H[n] >= Lk.lv) own[n] = 1 } }
        Lk.own = own
        for (let j = 0; j < j1 - j0; j++) for (let i = 0; i < W - 1; i++) { const cc = (j0 + j) * HN + i0 + i; if (!(own[cc] && own[cc + 1] && own[cc + HN] && own[cc + HN + 1])) continue; const a = n0 + j * W + i, b = a + 1, c = a + W, d = c + 1; idx.push(a, c, b, b, c, d) } }
      for (const Lk of lakes) for (let c = 0; c < NC; c++) { if (!Lk.own || Lk.own[c] !== 2) continue; const x = ox + (c % HN) * HG, z = oz + Math.floor(c / HN) * HG, ts2 = RIV.size / N   /* Seepegel ins Feld (ohne Rinne): Volumen-Färbung und Unterwasser-Ansicht kennen ihn */
        for (let dz2 = -HG * 0.5; dz2 < HG * 0.5; dz2 += ts2) for (let dx2 = -HG * 0.5; dx2 < HG * 0.5; dx2 += ts2) { const ii = Math.floor((x + dx2 - ROX) / ts2), jj = Math.floor((z + dz2 - ROZ) / ts2); if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const k = (jj * N + ii) * 4; if (D[k + 1] < 0.35) D[k + 3] = Math.max(D[k + 3], Lk.lv) } }
      const FA = { fp: [], fa: [], fi: [], cp: [], ca: [], ci: [] }; { const { fp, fa, fi, cp, ca, ci } = FA, R = 10, C = 7
        for (const F of falls) { const dx = F.b.x - F.a.x, dz = F.b.z - F.a.z, Ld = Math.hypot(dx, dz) || 1, ux = dx / Ld, uz = dz / Ld, H = F.top - F.bot, W0 = (F.wl + F.wr) / 2, n0 = fp.length / 3
          for (let r = 0; r < R; r++) { const u = r / (R - 1), along = Ld * u, y = F.top - (H + 0.35) * u * u, w = W0 * (1 + 0.25 * u)   /* Wurfparabel: oben langsam, unten schnell, schießt über die Lippe */
            for (let c = 0; c < C; c++) { const v = -1 + 2 * c / (C - 1), o = (v < 0 ? -v * F.wr * -1 : v * F.wl) * (1 + 0.2 * u); fp.push(F.a.x + ux * along - uz * o, y, F.a.z + uz * along + ux * o); fa.push(u, v, H, w) } }
          for (let r = 0; r < R - 1; r++) for (let c = 0; c < C - 1; c++) { const a = n0 + r * C + c, b = a + 1, cc = a + C, d = cc + 1; fi.push(a, cc, b, b, cc, d) }
          const m0 = cp.length / 3, Rf = Math.min(F.hw * 1.3, (F.wl + F.wr) * 0.65), ox2 = F.b.x + ux * 0.8, oz2 = F.b.z + uz * 0.8, G = 9   /* Gischt-Scheibe im Becken */
          for (let j = 0; j < G; j++) for (let i2 = 0; i2 < G; i2++) { cp.push(ox2 + (i2 / (G - 1) * 2 - 1) * Rf, F.bot + 0.04, oz2 + (j / (G - 1) * 2 - 1) * Rf); ca.push(ox2, oz2, Rf, F.bot) }
          for (let j = 0; j < G - 1; j++) for (let i2 = 0; i2 < G - 1; i2++) { const a = m0 + j * G + i2, b = a + 1, cc = a + G, d = cc + 1; ci.push(a, cc, b, b, cc, d) } } }

  return { lines: live, lakes, falls, field: { data: D, N, size, ox: ROX, oz: ROZ }, ribbon: { pos, fl, sn, lvA, idx }, fallMesh: FA, stats: ST }
}
export function hydro(env) { const g = hydroGen(env); let r; do { r = g.next() } while (!r.done); return r.value }
// Feld lesen wie rivSampleJS der Probe (quadratischer B-Spline über 3×3 Texel) → [R, G] oder null
export function sampleField(f, px, pz) {
  const N = f.N, tx = (px - f.ox) / f.size * N - 0.5, tz = (pz - f.oz) / f.size * N - 0.5, cx = Math.floor(tx + 0.5), cz = Math.floor(tz + 0.5)
  if (cx < 1 || cz < 1 || cx > N - 2 || cz > N - 2) return null; const D = f.data; if (D[(cz * N + cx) * 4 + 2] < 1e-4) return null
  const fx = tx - cx, fz = tz - cz, wx = [0.5 * (0.5 - fx) ** 2, 0.75 - fx * fx, 0.5 * (0.5 + fx) ** 2], wz = [0.5 * (0.5 - fz) ** 2, 0.75 - fz * fz, 0.5 * (0.5 + fz) ** 2]; let r = 0, g = 0
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) { const k = ((cz + j - 1) * N + cx + i - 1) * 4, w = wx[i] * wz[j]; r += w * D[k]; g += w * D[k + 1] } return [r, g]
}
// Talprofil auf eine Grundhöhe anwenden (= rivModJS: Profil ersetzt das Gelände)
export function carve(f, px, pz, h) { const v = sampleField(f, px, pz); if (!v || v[1] < 1e-4) return h; return h * (1 - v[1]) + v[0] }
export const HYDRO_SOURCE_SHA = '10ad3347c753'
