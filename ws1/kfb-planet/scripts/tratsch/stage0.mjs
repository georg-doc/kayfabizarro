// WS-NPC Karten-Tratsch · Stufe 0 (Georg-Freigabe 23.10.): vier Läufe über 10 Spieltage, Protokolle + Kennzahlen T1–T13 nach docs/ws-npc/tratsch/.
//   haupt     Dramaturg an · Rückfall roh (Titel + Lore, Georg 23.10.) · ohne MiB
//   ohne-dramaturg · ohne-roh (Schweigen ohne Triplet, Vergleich) · mit-mib
// Aufruf: node scripts/tratsch/stage0.mjs [seed] [tage]
import fs from 'fs'
import crypto from 'crypto'
import { createTratschSim, buildLibrary, bubbles, rawText, loreText, loreRest, composeLine, TRATSCH } from '../../src/npc/tratschSim.js'
import { resolveCharacterId } from '../../src/characters/registry.js'

const SEED = +(process.argv[2] ?? 7), DAYS = +(process.argv[3] ?? 10), OUT = 'docs/ws-npc/tratsch'
const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8')), data = JSON.parse(fs.readFileSync('src/data/npc/tratsch/tratsch-data.r1.json', 'utf8'))
const lib = buildLibrary(cards, data)
// SIM-Aufstellung: die Figuren, die heute im Spiel stehen (Register-IDs aus 4251479), Gruppe = Spiel-Gruppe; Deck aus der Signatur-Liste (Georg 20.10.)
const GAME = [['lorekeeper', 'bewohner'], ['farmer_b', 'bewohner'], ['skeleton_warrior', 'skelette'], ['skeleton_rogue', 'skelette'], ['skeleton_mage', 'skelette'], ['toy_soldier', 'soldaten'],
  ['kayfabrick_bot', 'bots'], ['orc_legacy_b', 'band'], ['orc_raider', 'band'], ['orc_brute', 'band'], ['orc_legacy_a', 'band']]
const sigOf = (id) => data.signature.figures.find((x) => [...x.models, x.figure.replace(/\s+/g, '_')].some((m) => resolveCharacterId(m) === id)) || null
const castBase = GAME.map(([id, group]) => { const s = sigOf(id); return { id, group, deck: s?.deck ?? null, deckBasis: s ? s.basis : null } })

const fmtT = (slot) => `${String(TRATSCH.firstHour + slot).padStart(2, '0')}:${String((slot * 17) % 60).padStart(2, '0')}`
const n2 = (x) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(2)
const factors = (st) => st.f ? `rel ${n2(st.f.rel)} · Status ${n2(st.f.sta)} · gehört ${n2(st.f.rep)} · Nähe ${n2(st.f.bub)}${st.f.raw ? ' · roh ' + n2(st.f.raw) : ''} · Art ${n2(st.f.art)}${st.f.sat ? ' · satt ' + n2(st.f.sat) : ''}${st.f.ident ? ' · Identität ' + n2(st.f.ident) : ''} · Zufall ${n2(st.f.rnd)} = ${st.s.toFixed(2)}` : `= ${st.s.toFixed(2)}`
// Satzbild V-699 (Georg 24.10., TRIPLET_SSOT_R1 §2b): Rufe fett in genau dieser Schreibweise; Kartentitel fett; kursiv höchstens eine Stelle je Blase
// (die SIM setzt keine – die Pointe einer Zeile kann sie nicht erkennen)
const CALL = { BINGO: '**Bingo!**', BOGGLE: '**Boggle...?**', BONGO: '**Bongo.**', 'Blödsinn': '**Blödsinn!**' }, HUMBUG = '**Humbug?!**'
const baseTitle = (n) => String(n).replace(/^(lvl|mode)\s*\d+\s*:\s*/i, '').split(/ – | - |\(/)[0].trim()
const TITLE = { found: 0, all: 0 }
function boldTitle(text, name) { if (text == null) return text; TITLE.all++; const b = baseTitle(name), cands = [b, b.replace(/^the /i, '')].filter((x) => x.length >= 3)
  for (const c of cands) { const i = text.toLowerCase().indexOf(c.toLowerCase()); if (i >= 0) { TITLE.found++; return text.slice(0, i) + '**' + text.slice(i, i + c.length) + '**' + text.slice(i + c.length) } } return text }

function run(label, opts) {
  TITLE.found = 0; TITLE.all = 0
  const sim = createTratschSim({ lib, cast: castBase.map((c) => ({ ...c })), seed: SEED, ...opts }); sim.runDays(DAYS)
  const { S, F, K, ids, byId } = sim, L = []
  const deckTitle = (k) => lib.title.get(lib.deckOf(k)) ?? lib.deckOf(k)
  L.push(`# Tratsch-Protokoll · ${label}`, '', `Seed ${SEED} · ${DAYS} Spieltage · ${TRATSCH.slotsPerDay} Begegnungen je Tag · Dramaturg ${opts.drama ? 'an' : 'aus'} · Rückfall ${opts.fallback === 'roh' ? 'roh (Titel + gedruckte Lore, Georg 23.10.)' : 'stumm (ohne Triplet schweigen, Vergleich)'} · MiB ${opts.mib ? 'an' : 'aus'}`, '',
    `**SIM-Aufstellung, keine Kanon-Zuordnung.** Triplets ${data.source.revision ?? 't1'} @${String(data.source.commit).slice(0, 8)} = Entwurf (nicht abgenommen); Opener nur Pool-Status POOL (${lib.openers.length}). Kartentext und Lore wörtlich aus \`cards.json\` (Druckfassung, mvp 2d236e2).`, '',
    '| Figur | Gruppe | Deck | Grundlage | Art | Haltung |', '|---|---|---|---|---|---|', ...F.map((f) => `| ${f.id} | ${f.group} | ${f.deck} | ${f.deckBasis ?? '–'}${f.deckNote ? ' (' + f.deckNote + ')' : ''} | ${f.art} | ${f.loyal} |`), '')
  let day = 0
  const dayStats = []
  for (const e of S.log) {
    if (e.day !== day) { if (day) L.push(...daySummary(day)); day = e.day; L.push('', `## Tag ${day}`, '') }
    if (e.kind === 'still') { L.push(`- ${fmtT(e.slot)} ${e.E} trifft ${e.H} · [${e.phase}] · nichts zu erzählen (alles schon erzählt bzw. ohne Triplet)`); continue }
    if (e.kind === 'mib') { L.push(`- ${fmtT(e.slot)} **MiB-Einsatz** (Auslöser: [${e.card}] ≥ ${(opts.R || TRATSCH).mib.perDay} Übernahmen an einem Tag) · ${HUMBUG} → ${e.victims.join(', ')} · gelöscht: ${e.card}`, ...e.by.map(([i, h, w]) => `  - Umstehend ${i} (${h}) → ${w}`)); continue }
    const c = lib.card(e.card)
    L.push(`- ${fmtT(e.slot)} ${e.tag ? '↳ ' + e.tag + ' · ' : ''}**${e.E} → ${e.H}** · [${e.phase}]${e.cross ? ' · über Blasengrenze' : ''} · ${deckTitle(e.card)} #${e.card.split('#')[1]} „${c.name}“ (${e.raw ? 'roh' : 'Triplet'}${e.opener ? ' · Opener „' + e.opener + '“' : ''})`)
    L.push(`  > ${boldTitle(e.text, c.name)}`)
    for (const st of e.steps) { if (st.add) { const cc = lib.card(st.card ?? e.card); L.push(st.add === 'nichts anderes' ? '  → hat nichts anderes zu erzählen' : st.add === 'ohne Antwort' ? '  → Nachfrage bleibt offen (kein Lore-Satz passt in die Blase): „…“' : st.add === 'andere Karte' ? `  → erzählt etwas anderes: ${deckTitle(st.card)} #${st.card.split('#')[1]} „${cc.name}“ (${st.raw ? 'roh' : 'Triplet'}${st.opener ? ' · Opener „' + st.opener + '“' : ''})\n    „${boldTitle(st.text, cc.name)}“` : `  → legt nach (${st.add}): „${st.add === 'Lore' ? st.text : boldTitle(st.text, cc.name)}“`); continue } L.push(`  ${CALL[st.call] ?? st.call}  (${factors(st)})`) }
    const k = K[e.H].get(e.card2 ?? e.card)
    L.push(`  → **${e.out}**${e.out === 'übernommen' && k ? ` · Kette: ${k.chain.join(' ← ')} · Überzeugung ${k.k}` : ''}${e.out === 'später' ? ' (Bongo.: weiches Nein, Tür bleibt offen)' : ''}`)
  }
  if (day) L.push(...daySummary(day))
  function daySummary(d) {
    const ev = S.log.filter((e) => e.day === d && e.kind === 'tell'), cnt = (c) => ev.filter((e) => e.steps.some((s) => s.call === c)).length
    const mibN = S.log.filter((e) => e.day === d && e.kind === 'mib').length, adopted = ev.filter((e) => e.out === 'übernommen').length
    const conflictCross = ev.filter((e) => e.cross && e.steps.some((s) => s.call === 'Blödsinn' || s.call === 'BOGGLE')).length + ev.filter((e) => e.tag && e.cross).length
    const ser = S.series.filter((x) => x.day === d).map((x) => x.tension), bar = ser.map((t) => ' ▁▂▃▄▅▆▇█'[Math.min(8, Math.round(t * 8))]).join('')
    dayStats.push({ day: d, ex: ev.length, bingo: cnt('BINGO'), boggle: cnt('BOGGLE'), bongo: cnt('BONGO'), bloedsinn: cnt('Blödsinn'), debates: ev.filter((e) => e.tag).length, mib: mibN, adopted, conflictCross, tension: ser })
    return ['', `**Tagesbilanz ${d}:** ${ev.length} Erzählungen (davon ${ev.filter((e) => e.tag).length} in Debatten) · Bingo! ${cnt('BINGO')} · Boggle...? ${cnt('BOGGLE')} · Bongo. ${cnt('BONGO')} · Blödsinn! ${cnt('Blödsinn')}${opts.mib ? ' · Humbug?! ' + mibN : ''} · ${adopted} Karten gewandert · Konflikt über Blasengrenzen ${conflictCross} · Spannung ${bar}`]
  }
  // Abschluss: Weltbilder, Blasen, Überzeuger
  const edges = S.log.filter((e) => e.kind === 'tell' && e.out === 'übernommen').map((e) => [e.E, e.H]), B = bubbles(ids, edges)
  L.push('', '## Stand nach ' + DAYS + ' Tagen', '', `Blasen (BINGO-Graph, Modularität lokal optimiert): ${B.groups.map((g) => '{' + g.join(', ') + '}').join(' · ') || '–'} · Modularität Q = ${B.Q.toFixed(2)}`, '',
    '| Figur | Karten | fremde Decks | übernommen | gelöscht | überzeugt (verschiedene) |', '|---|---|---|---|---|---|',
    ...F.map((f) => { const ks = [...K[f.id].keys()]; return `| ${f.id} | ${ks.length} | ${new Set(ks.map(lib.deckOf).filter((d) => d !== f.deck)).size} | ${ks.filter((k) => K[f.id].get(k).from !== 'start').length} | ${sim.wiped[f.id].size} | ${sim.status(f.id) >= 0 ? S.log.filter((e) => e.kind === 'tell' && e.E === f.id && e.out === 'übernommen').map((e) => e.H).filter((v, i, a) => a.indexOf(v) === i).length : 0} |` }))
  const md = L.join('\n') + '\n'
  return { sim, md, dayStats, B, edges, titleBold: { gefunden: TITLE.found, von: TITLE.all } }
}

function metrics(r, label, opts) {
  const { sim, dayStats, B, edges } = r, { S, F, K, ids } = sim, tells = S.log.filter((e) => e.kind === 'tell')
  const steps = tells.flatMap((e) => e.steps.filter((s) => s.call)), first = tells.map((e) => e.steps[0])
  const texts = tells.flatMap((e) => [e.text, ...e.steps.filter((s) => s.text).map((s) => s.text)])
  // Kartentreue: Text = (Opener aus dem POOL +) Triplet aus dem Set bzw. Kartentext roh; Nachlegen = Lore-Sätze wörtlich (nur weggelassen)
  const opOf = (t) => sim.lib.openers.find((o) => o.opener === t) || null
  const fidelity = tells.every((e) => { const c = sim.lib.card(e.card), src = (b) => b === sim.lib.trip.get(e.card) || b === rawText(c, TRATSCH.bubbleMax)
    const lineOk = (t, b, o, st) => src(b) && t === composeLine(o ? opOf(o) : null, b, st, b === sim.lib.trip.get(e.card) ? null : c.name) && (!o || !!opOf(o))
    const loreOk = (t) => t != null && (t === loreRest(c, null, TRATSCH.bubbleMax) || t === loreRest(c, sim.lib.trip.get(e.card), TRATSCH.bubbleMax))
    const lineOkK = (k, t, b, o, st) => { const ck = sim.lib.card(k); return (b === sim.lib.trip.get(k) || b === rawText(ck, TRATSCH.bubbleMax)) && t === composeLine(o ? opOf(o) : null, b, st, b === sim.lib.trip.get(k) ? null : ck.name) }
    return lineOk(e.text, e.base, e.opener, e.start) && e.steps.filter((x) => x.text).every((x) => (x.add === 'Lore' ? loreOk(x.text) : lineOkK(x.card ?? e.card, x.text, x.base, x.opener, x.start))) })
  const adopted = ids.flatMap((i) => [...K[i].entries()].filter(([, v]) => v.from !== 'start').map(([k, v]) => ({ i, k, v })))
  const cross = edges.filter(([a, b]) => B.label[a] !== B.label[b]).length
  const perEnc = {}; for (const e of tells) { const key = e.day + '|' + e.slot + '|' + [e.E, e.H].sort().join('|'); perEnc[key] = (perEnc[key] ?? 0) + (e.tag ? 0 : 1) }
  const perCardDay = {}; for (const e of tells) { const k = e.E + '|' + e.card + '|' + e.day; perCardDay[k] = (perCardDay[k] ?? 0) + 1 }
  const afterReject = tells.filter((e, i) => tells.slice(0, i).some((p) => p.E === e.E && p.H === e.H && p.card === e.card && p.out === 'abgelehnt')).length
  const callCount = (c) => steps.filter((s) => s.call === c).length, nCalls = steps.length || 1
  const tension = S.series.map((x) => x.tension), mean = tension.reduce((a, b) => a + b, 0) / (tension.length || 1)
  let crossings = 0; for (let i = 1; i < tension.length; i++) if ((tension[i - 1] - mean) * (tension[i] - mean) < 0) crossings++
  const phaseMean = (name) => { const x = S.series.filter((v) => v.phase === name).map((v) => v.tension); return x.length ? x.reduce((a, b) => a + b, 0) / x.length : 0 }
  const sorted = tension.slice().sort((a, b) => a - b), amp = sorted.length ? sorted[Math.floor(0.9 * (sorted.length - 1))] - sorted[Math.floor(0.1 * (sorted.length - 1))] : 0
  const save = JSON.stringify({ known: adopted.map(({ i, k, v }) => ({ f: i, c: k, from: v.from, chain: v.chain, day: v.day, via: v.via, k: v.k })), rejected: ids.flatMap((i) => [...sim.rejected[i]].map((x) => ({ f: i, x }))), wiped: ids.flatMap((i) => [...sim.wiped[i].keys()].map((c) => ({ f: i, c }))), heard: ids.flatMap((i) => [...sim.heard[i]].map(([c, s]) => ({ f: i, c, n: s.size }))) })
  const T = {
    T1_determinismus: null,
    T2_tempo: { kartenJeFigurUndTag: +(adopted.length / F.length / DAYS).toFixed(2), ziel: '0,5–2' },
    T3_blasen: { Q: +B.Q.toFixed(3), quer: +(edges.length ? cross / edges.length : 0).toFixed(3), blasen: B.groups, ziel: 'Q ≥ 0,3 und quer ≥ 0,05' },
    T4_spam: { maxJeBegegnung: Math.max(0, ...Object.values(perEnc)), nachAblehnungWiederholt: afterReject, maxGleicheKarteJeErzaehlerTag: Math.max(0, ...Object.values(perCardDay)), ziel: '≤ 1 (+ Nachlegen/Debatte) · 0 · ≤ 2' },
    T5b_satzbild: { titelFettGefunden: r.titleBold, rufe: 'Bingo! · Boggle...? · Bongo. · Blödsinn! · Humbug?! (fett, V-699)', kursiv: 'nicht gesetzt (Pointe nicht maschinell erkennbar)' },
    T5_lesbarkeit: { maxZeichen: Math.max(...texts.map((t) => t.length)), maxWoerter: Math.max(...texts.map((t) => t.split(/\s+/).length)), anteilBis140: +(texts.filter((t) => t.length <= 140).length / texts.length).toFixed(3), ziel: '≤ 140 Zeichen bzw. ≤ 24 Wörter' },
    T6_kartentreue: { alleTexteAusQuelle: fidelity, ziel: '100 %' },
    T7_herkunft: { vollstaendig: adopted.every(({ v }) => v.from && v.chain.length >= 1 && v.chain.length <= TRATSCH.chainMax && v.day >= 1), ziel: '100 %' },
    T8_muster: { ohneZufallGleich: +(steps.filter((s) => s.noRnd ? s.noRnd === s.call : true).length / nCalls).toFixed(3), ziel: '≥ 0,7' },
    T9_callMischung: { BINGO: +(callCount('BINGO') / nCalls).toFixed(3), BOGGLE: +(callCount('BOGGLE') / nCalls).toFixed(3), BONGO: +(callCount('BONGO') / nCalls).toFixed(3), Bloedsinn: +(callCount('Blödsinn') / nCalls).toFixed(3), ziel: 'jeder Call kommt vor, keiner > 0,6' },
    T10_kosten: { usJeAustausch: +((S.stats.ms * 1000) / Math.max(1, S.stats.ex)).toFixed(2), spielstandBytes: Buffer.byteLength(save), ziel: '≤ 200 µs; ≤ 64 KB' },
    T11_georg: 'Georgs Urteil nach dem Lesen',
    T12_konflikt: { jeTag: dayStats.map((d) => d.conflictCross), mittel: +(dayStats.reduce((a, d) => a + d.conflictCross, 0) / dayStats.length).toFixed(2), debatten: dayStats.reduce((a, d) => a + d.debates, 0) },
    T14_bingoSpaet: { jeTag: dayStats.map((d) => +(d.bingo / Math.max(1, d.ex)).toFixed(2)), tag8bis10max: +Math.max(...dayStats.filter((d) => d.day >= 8).map((d) => d.bingo / Math.max(1, d.ex))).toFixed(3), blödsinnUndBoggleTag8bis10: dayStats.filter((d) => d.day >= 8).map((d) => d.bloedsinn + d.boggle), ziel: 'BINGO-Anteil je Tag 8–10 ≤ 0,6; Blödsinn!/BOGGLE bleiben im Mix' },
    T15_identitaet: (() => { const v = ids.map((i) => sim.ownShare(i)); return { mittel: +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(3), min: +Math.min(...v).toFixed(3), je: Object.fromEntries(ids.map((i, k) => [i, +v[k].toFixed(2)])) } })(),
    T13_spannung: { kontrastKonfliktMinusRuhe: +(phaseMean('Konflikt') - phaseMean('Ruhe')).toFixed(3), mittel: { Aufbau: +phaseMean('Aufbau').toFixed(3), Konflikt: +phaseMean('Konflikt').toFixed(3), Ruhe: +phaseMean('Ruhe').toFixed(3) }, amplitudeP90P10: +amp.toFixed(3), ziel: 'Kontrast Konflikt − Ruhe ≥ 0,2 (ohne Dramaturg: dieselben Uhrzeiten, Erwartung ≈ 0)' },
  }
  return { label, opts, seed: SEED, days: DAYS, aufstellung: F.map((f) => ({ id: f.id, group: f.group, deck: f.deck, basis: f.deckBasis, note: f.deckNote ?? null, art: f.art, haltung: f.loyal })), tage: dayStats.map(({ tension, ...d }) => d), kriterien: T }
}

fs.mkdirSync(OUT, { recursive: true })
const RUNS = [['haupt', { drama: true, fallback: 'roh', mib: false }], ['ohne-dramaturg', { drama: false, fallback: 'roh', mib: false }], ['ohne-roh', { drama: true, fallback: 'stumm', mib: false }], ['mit-mib', { drama: true, fallback: 'roh', mib: true, R: { ...TRATSCH, mib: { perDay: 2 } } }]] // MiB-Auslöser N = 2 (Georg: „≥ N Übernahmen an einem Tag“; N = 3 löst bei wählerischen Figuren kaum aus)
const summary = { schema: 'kfb.tratsch-stage0/1', seed: SEED, days: DAYS, quelle: { daten: data.source, kartenJson: cards.source ?? null }, tripletDatenbefund: lib.misfit, laeufe: {} }
for (const [label, opts] of RUNS) {
  const r = run(label, opts), r2 = run(label, opts), h = (s) => crypto.createHash('sha256').update(s).digest('hex')
  const m = metrics(r, label, opts); m.kriterien.T1_determinismus = { gleich: h(r.md) === h(r2.md), sha256: h(r.md) }
  fs.writeFileSync(`${OUT}/protokoll_${label}_s${SEED}.md`, r.md); fs.writeFileSync(`${OUT}/kennzahlen_${label}_s${SEED}.json`, JSON.stringify(m, null, 1) + '\n')
  summary.laeufe[label] = m.kriterien
  console.log(label.padEnd(15), JSON.stringify({ T2: m.kriterien.T2_tempo.kartenJeFigurUndTag, Q: m.kriterien.T3_blasen.Q, quer: m.kriterien.T3_blasen.quer, T8: m.kriterien.T8_muster.ohneZufallGleich, T9: m.kriterien.T9_callMischung, T12: m.kriterien.T12_konflikt.mittel, T13: m.kriterien.T13_spannung, T1: m.kriterien.T1_determinismus.gleich, T6: m.kriterien.T6_kartentreue.alleTexteAusQuelle }))
}
fs.writeFileSync(`${OUT}/kennzahlen_uebersicht_s${SEED}.json`, JSON.stringify(summary, null, 1) + '\n')

// Mehr-Seed-Prüfung (Seeds 1–10): Einzel-Seeds streuen; Kriterien als Mittel und Spanne, Dramaturg an gegen aus
const multi = {}
for (const [label, opts] of RUNS) {
  const rows = []
  for (let sd = 1; sd <= 10; sd++) {
    const sim = createTratschSim({ lib, cast: castBase.map((c) => ({ ...c })), seed: sd, ...opts }); sim.runDays(DAYS)
    const { S, F, K, ids } = sim, tells = S.log.filter((e) => e.kind === 'tell'), steps = tells.flatMap((e) => e.steps.filter((s) => s.call))
    const edges = tells.filter((e) => e.out === 'übernommen').map((e) => [e.E, e.H]), B = bubbles(ids, edges)
    const pm = (n) => { const x = S.series.filter((v) => v.phase === n).map((v) => v.tension); return x.reduce((a, b) => a + b, 0) / (x.length || 1) }
    const conflictCross = tells.filter((e) => e.cross && e.steps.some((s) => s.call === 'Blödsinn' || s.call === 'BOGGLE')).length + tells.filter((e) => e.tag && e.cross).length
    const share = (c) => steps.filter((s) => s.call === c).length / (steps.length || 1)
    rows.push({ seed: sd, T2: ids.reduce((a, i) => a + [...K[i].values()].filter((v) => v.from !== 'start').length, 0) / F.length / DAYS, Q: B.Q, T8: steps.filter((s) => (s.noRnd ? s.noRnd === s.call : true)).length / (steps.length || 1),
      maxCall: Math.max(share('BINGO'), share('BOGGLE'), share('BONGO'), share('Blödsinn')), T12: conflictCross / DAYS, T13: pm('Konflikt') - pm('Ruhe'), mib: S.log.filter((e) => e.kind === 'mib').length,
      T14: Math.max(...[8, 9, 10].map((d) => { const t = tells.filter((e) => e.day === d); return t.filter((e) => e.steps.some((x) => x.call === 'BINGO')).length / Math.max(1, t.length) })),
      T15: ids.reduce((a, i) => a + sim.ownShare(i), 0) / ids.length, T15min: Math.min(...ids.map((i) => sim.ownShare(i))) })
  }
  const st = (k) => { const v = rows.map((r) => r[k]), m = v.reduce((a, b) => a + b, 0) / v.length; return { mittel: +m.toFixed(3), min: +Math.min(...v).toFixed(3), max: +Math.max(...v).toFixed(3) } }
  multi[label] = { T2: st('T2'), Q: st('Q'), T8: st('T8'), maxCallAnteil: st('maxCall'), T12: st('T12'), T13: st('T13'), T14: st('T14'), T15: st('T15'), T15min: st('T15min'), mib: st('mib') }
  console.log('seeds 1–10'.padEnd(11), label.padEnd(15), JSON.stringify(Object.fromEntries(Object.entries(multi[label]).map(([k, v]) => [k, v.mittel]))))
}
fs.writeFileSync(`${OUT}/kennzahlen_seeds_1-10.json`, JSON.stringify({ schema: 'kfb.tratsch-stage0-seeds/1', days: DAYS, seeds: [1, 10], laeufe: multi }, null, 1) + '\n')
