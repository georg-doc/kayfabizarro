// WS-NPC Sprech-Anlässe (Georg 24.10. „wie von dir vorgeschlagen“, Lead-Auftrag): wann gothgirl, Orc-Band und Disco K12 „sprechen“ – rein, ohne three,
// Node-geprüft (test/unit/chatterCues.mjs). Der Ton (WS-Audio, Chatter-Familien V-693) liest die Ereignisse; Text gibt es hier keinen.
//   Liedende   Band: 16 Takte = ein Lied (Platzhalter: das Scenelet hat keine Liedstruktur; 16 Takte bei 100 bpm = 38,4 s wie die Disco-Schleife)
//              Disco: Schleifenwechsel der K12-Uhr (clock.length) = Pause zwischen Liedern
//   Bemerken   Spieler kommt in den Radius (Hysterese rein/raus), danach Sperrzeit
//   Deckel     je Gruppe höchstens ein Anlass je minGapS (keine Dauerschleife), nur solange der Spieler in der Blase ist
export const CHATTER = Object.freeze({
  barsPerSong: 16, minGapS: 90, noticeIn: 8, noticeOut: 14, noticeCooldownS: 60, speakers: 2, ring: 40,
  mood: Object.freeze({ songEnd: 'froh', pause: 'introspektiv', notice: 'staunend' }), // WS-Audio-Vorschlag 24.10. (13 Familien-Gefühle)
})

// Ende eines Lieds zwischen zwei Zeitpunkten (Länge len s); gibt die Nummer des neuen Lieds zurück oder null
export function songBoundary(prevT, t, len) { if (!(len > 0) || prevT == null || t <= prevT) return null; const a = Math.floor(prevT / len), b = Math.floor(t / len); return b > a ? b : null }
export const bandSongLength = (clock, bars = CHATTER.barsPerSong) => (bars * (clock?.beatsPerBar || 4) * 60) / (clock?.bpm || 100)

// Bemerken mit Hysterese: rein bei d ≤ inR (wenn vorher draußen ≥ outR oder nie gesehen) und nach der Sperrzeit; 'first' beim ersten Mal, sonst 'known'
export function createNotice({ inR = CHATTER.noticeIn, outR = CHATTER.noticeOut, cooldownS = CHATTER.noticeCooldownS } = {}) {
  const S = { inside: false, until: -Infinity, seen: false }
  return { step(d, t) { if (d == null) return null
    if (S.inside) { if (d >= outR) S.inside = false; return null }
    if (d <= inR && t >= S.until) { S.inside = true; S.until = t + cooldownS; const r = S.seen ? 'known' : 'first'; S.seen = true; return r }
    return null }, state: () => ({ ...S }) }
}

// Ringpuffer mit Deckel je Gruppe: emit(e) → Ereignis mit seq oder null (gedeckelt)
export function createChatterLog({ group, minGapS = CHATTER.minGapS, ring = CHATTER.ring } = {}) {
  const S = { events: [], seq: 0, last: -Infinity }
  return {
    // force (Bemerken): überspringt den Deckel, verbraucht ihn aber nicht – sonst blockiert ein Bemerken das nächste Liedende
    emit(list, t, { force = false } = {}) { if (!force) { if (t - S.last < minGapS) return []; S.last = t }
      return list.map((e) => { const ev = { type: 'chatter', group, ...e, t: +t.toFixed(3), seq: ++S.seq }; S.events.push(ev); if (S.events.length > ring) S.events.shift(); return ev }) },
    events: () => S.events.slice(), last: () => S.last,
  }
}
// Sprecher eines Anlasses: reihum (Nummer des Anlasses), höchstens n
export const pickSpeakers = (members, k, n = CHATTER.speakers) => members.length ? Array.from({ length: Math.min(n, members.length) }, (_, i) => members[(k + i) % members.length]) : []
