// WS-Audio · Chatter-Silben R1 (Lead 24.10., Georg-GO): Blasentext → Silben → Satzmelodie → Grain-Plan. Rein (ohne Web Audio/DOM), Node-geprüft
// (test/unit/audioMixer.mjs). Kein neues Material: Grains werden aus den vorhandenen Familien-Clips geschnitten (grainsFrom), nichts synthetisiert.
// Satzmelodie nach der Ruf-Skala (V-712): „?“ steigt, „.“ fällt, „!“ kurz und kräftig, „...?“ zögert (Pause vor dem letzten Teil), „?!“ hoch und
// ungläubig, „…“ allein = leises „hm“. Fett (*…*) bzw. **…** etwas betont.

export const SYL = Object.freeze({ dur: 0.14, minDur: 0.1, maxDur: 0.2, gap: 0.035, wordGap: 0.07, commaGap: 0.2, sentenceGap: 0.32, hesitate: 0.38, maxTotal: 4.5, maxSyl: 28, jitterSemi: 0.7 })
const VOWELS = /[aeiouäöüyáàâéèêíìîóòôúùû]+/gi

// mulberry32 – deterministischer Zufall je Seed
export function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
export function hashStr(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }

// Stimmlage je Figur: fester Grundton aus dem Seed der characterId (−5 … 0 Halbtöne, nie über der Lage der Familie – Georg 25.10.), bleibt gleich
export function voiceBase(characterId) { return -Math.round(((hashStr(characterId || 'x') % 1000) / 1000) * 5) }
// Satzmelodie in die Lage legen: höchste Silbe genau auf der Lage des Clips (0), Kontur bleibt; nach unten höchstens −12
export function fitRegister(semis) { const top = Math.max(...semis); const off = top > 0 ? top : 0; return semis.map((s) => Math.max(-12, +(s - off).toFixed(2))) }

// Text → Sätze → Wörter → Silben. Silbenzahl je Wort = Vokalgruppen (mind. 1, Zahlen/Kürzel je Zeichen grob). Satzende-Zeichen bestimmt die Melodie.
export function syllabify(text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (!t) return []
  if (/^(…|\.\.\.)$/.test(t)) return [{ s: 'hm', word: 0, wordStart: true, emph: false, sentence: 0, end: '…', last: true, comma: false }]
  const out = []; let sentence = 0, word = 0, emph = false
  // Satzweise: Endzeichen inkl. Kombinationen ?! ...? … ! ? .
  const re = /([^.!?…]+)((?:\.\.\.\?|\?!|!\?|\.\.\.|…\?|…|[.!?])+)?/g; let m
  while ((m = re.exec(t))) {
    const body = m[1], endRaw = (m[2] || '').trim(), end = /\.\.\.\?|…\?/.test(endRaw) ? '...?' : /\?!|!\?/.test(endRaw) ? '?!' : endRaw.includes('?') ? '?' : endRaw.includes('!') ? '!' : endRaw ? '.' : '.'
    const words = body.split(/\s+/).filter(Boolean); if (!words.length) continue
    const first = out.length
    for (const w0 of words) {
      const open = /^\*+/.test(w0), close = /\*+[,;:]?$/.test(w0); if (open) emph = true
      const comma = /[,;:–—-]$/.test(w0), w = w0.replace(/[*,;:–—"„“”'()[\]]/g, ''); if (!w) { if (close) emph = false; continue }
      const n = Math.max(1, Math.min(6, (w.match(VOWELS) || []).length || Math.ceil(w.length / 3)))
      for (let i = 0; i < n; i++) out.push({ s: w, word, wordStart: i === 0, emph, sentence, end, last: false, comma: comma && i === n - 1 })
      word++; if (close) emph = false
    }
    if (out.length > first) out[out.length - 1].last = true
    sentence++
  }
  return out
}

// Silben → Plan je Silbe { semi, dur, at (Start s), gain } nach Satzmelodie; Deckel maxTotal/maxSyl (Rest entfällt, Satzende bleibt erhalten)
export function melody(sylls, { seed = 1 } = {}) {
  const r = rng(seed), plan = []; let at = 0
  // Satz für Satz: Kontur über die letzten Silben (Phrasenende)
  const sentences = []; for (const s of sylls) (sentences[s.sentence] ||= []).push(s)
  for (const S of sentences.filter(Boolean)) {
    const n = S.length, end = S[0].end, lastWord = S[n - 1].word
    for (let i = 0; i < n; i++) {
      const s = S[i], k = n - 1 - i // k = Abstand zum Satzende
      let semi = 0.6 * Math.sin(i * 1.7 + seed % 7) // Grund-Wellen (Sprachfluss)
      if (end === '?') semi += k < 3 ? [7, 4, 2][k] : 0
      else if (end === '.') semi += k < 3 ? [-4, -2, -1][k] : 0.5
      else if (end === '!') semi += i === 0 ? 3 : k === 0 ? 1 : 1.5
      else if (end === '?!') semi += s.word === lastWord ? 6 + (k === 0 ? 3 : 0) : 2
      else if (end === '...?') semi += s.word === lastWord ? (k === 0 ? 6 : 3) : -1
      else if (end === '…') semi += -1
      if (s.emph) semi += 2
      semi += (r() * 2 - 1) * SYL.jitterSemi
      let dur = SYL.dur * (0.85 + r() * 0.3) * (end === '!' ? 0.8 : 1) * (k === 0 && end !== '!' ? 1.35 : 1) * (s.emph ? 1.15 : 1)
      if (end === '…') dur = 0.34
      dur = Math.max(SYL.minDur, Math.min(end === '…' ? 0.4 : SYL.maxDur, dur))
      if (end === '...?' && s.word === lastWord && s.wordStart && n > 1) at += SYL.hesitate // Zögern vor dem letzten Teil
      const gain = (end === '!' ? 1.25 : 1) * (s.emph ? 1.2 : 1) * (end === '…' ? 0.6 : 1) * (s.wordStart ? 1 : 0.88)
      plan.push({ semi: +semi.toFixed(2), dur: +dur.toFixed(3), at: +at.toFixed(3), gain: +gain.toFixed(2), end, emph: s.emph })
      at += dur + (s.last ? SYL.sentenceGap : s.comma ? SYL.commaGap : (S[i + 1]?.wordStart ? SYL.wordGap : SYL.gap))
    }
  }
  // Deckel: höchstens maxSyl Silben und maxTotal Sekunden; überzählige Mitte fällt weg, die letzten 3 Silben (Satzmelodie) bleiben
  let P = plan
  if (P.length > SYL.maxSyl) { const tail = P.slice(-3), head = P.slice(0, SYL.maxSyl - 3), shift = tail[0].at - (head.at(-1).at + head.at(-1).dur + SYL.wordGap); P = [...head, ...tail.map((p) => ({ ...p, at: +(p.at - shift).toFixed(3) }))] }
  const total = P.length ? P.at(-1).at + P.at(-1).dur : 0
  if (total > SYL.maxTotal) { const k = (SYL.maxTotal / total) * 0.99; P = P.map((p) => ({ ...p, at: +(p.at * k).toFixed(3), dur: +Math.max(SYL.minDur * 0.9, p.dur * k).toFixed(3) })) }
  return P
}
export const planDuration = (P) => (P.length ? +(P.at(-1).at + P.at(-1).dur).toFixed(3) : 0)

// Grains aus einem dekodierten Clip (Kanal-Daten): Hüllkurve in 10-ms-Fenstern, Spitzen über 35 % des Maximums, mind. 0,1 s Abstand;
// je Spitze ein Fenster von len s, 20 ms vor der Spitze beginnend. Liefert [{ t0, dur, level }] (höchstens max).
export function grainsFrom(data, sr, { len = 0.16, max = 12 } = {}) {
  const hop = Math.max(1, Math.round(sr * 0.01)), n = Math.floor(data.length / hop), env = new Float32Array(n)
  for (let i = 0; i < n; i++) { let q = 0; for (let j = i * hop, e = j + hop; j < e; j++) q += data[j] * data[j]; env[i] = Math.sqrt(q / hop) }
  let peak = 0; for (const v of env) if (v > peak) peak = v; if (peak <= 1e-5) return []
  const cand = []; for (let i = 1; i < n - 1; i++) if (env[i] >= 0.35 * peak && env[i] >= env[i - 1] && env[i] >= env[i + 1]) cand.push(i)
  cand.sort((a, b) => env[b] - env[a]); const pick = []
  for (const i of cand) { if (pick.every((p) => Math.abs(p - i) * 0.01 >= 0.1)) pick.push(i); if (pick.length >= max) break }
  const dur = data.length / sr
  return pick.sort((a, b) => a - b).map((i) => { const t0 = Math.max(0, Math.min(dur - len, i * 0.01 - 0.02)); return { t0: +t0.toFixed(3), dur: len, level: +(env[i] / peak).toFixed(2) } }).filter((g) => g.t0 + g.dur <= dur + 1e-6)
}
// Satzende → bevorzugte Gefühls-Clips der Familie (Grain-Quelle)
export const MOOD_FOR_END = Object.freeze({ '.': ['neutral', 'introspektiv'], '?': ['staunend', 'neutral'], '!': ['froh', 'aggressiv'], '?!': ['staunend', 'genervt'], '...?': ['introspektiv', 'staunend'], '…': ['introspektiv'] })
