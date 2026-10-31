// kfb-place-collapse v1 · der eine Löser für alle Ebenen des Verteilers (V-1076, V-1007): Plätze, Zustände, Gewichte, kleinste Entropie zuerst. Rein, ohne Abhängigkeit.
// Paar-Regeln über Tabellen (links, A, D) oder über after(platz, zustand, setze), wenn eine Regel vom Ort abhängt (Stadt-Requisiten: Mindestabstände).
// w: Float64Array N × S (Vorwissen), noise und pick: je Platz fester Zufall. Zustand ground ist der Rückfall, wenn ein Platz keine Möglichkeit mehr hat.
// sparse (Kaskade, V-1117): Plätze, die nur „ground“ erlauben, werden vorab gesetzt; die Suche läuft nur noch über die offenen Plätze.
export function collapse({ N, S, w, links = null, A = null, D = null, noise, pick, ground = 0, after = null, sparse = false }) {
  const out = new Int8Array(N).fill(-1), H = new Float64Array(N); let fallback = 0, open = null
  const entropy = (k) => { let t = 0, e = 0; for (let s = 0; s < S; s++) t += w[k * S + s]; if (t <= 0) return -1; for (let s = 0; s < S; s++) { const p = w[k * S + s] / t; if (p > 0) e -= p * Math.log(p) } return e }
  if (sparse) { const zero = []; open = []; for (let k = 0; k < N; k++) { let only = w[k * S + ground] > 0; for (let s = 0; s < S && only; s++) if (s !== ground && w[k * S + s] > 0) only = false; (only ? zero : open).push(k) }
    for (const k of zero) { out[k] = ground; if (links) for (const [n, kind] of links[k]) { if (out[n] >= 0) continue; const M = kind ? D : A; for (let s = 0; s < S; s++) w[n * S + s] *= M[ground * S + s] } } }
  const list = open || Array.from({ length: N }, (_, k) => k)
  for (const k of list) H[k] = entropy(k) + noise(k) * 1e-3
  for (let done = 0; done < list.length; done++) { let b = -1, bh = Infinity; for (const k of list) if (out[k] < 0 && H[k] < bh) { bh = H[k]; b = k }
    let t = 0; for (let s = 0; s < S; s++) t += w[b * S + s]
    let st = ground; if (t > 0) { let u = pick(b) * t; for (let s = 0; s < S; s++) { u -= w[b * S + s]; if (u <= 0 && w[b * S + s] > 0) { st = s; break } } } else fallback++
    out[b] = st
    if (links) for (const [n, kind] of links[b]) { if (out[n] >= 0) continue; const M = kind ? D : A; for (let s = 0; s < S; s++) w[n * S + s] *= M[st * S + s]; H[n] = entropy(n) + noise(n) * 1e-3 }
    if (after) after(b, st, (n, s, f) => { if (out[n] < 0) { w[n * S + s] *= f; H[n] = entropy(n) + noise(n) * 1e-3 } }) }
  return { out, fallback }
}

