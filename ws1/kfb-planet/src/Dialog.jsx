// Monkey-Island-artige Dialoge nach den KFB Freestyle Rules v18-4:
// Start (3 Karten, Actor wählen) · Quest-Reveal · Zug: würfeln → Karte ausspielen → Intro-Ritual (SHOW/SPIN/SELL) → erzählen → Quest-Würfel setzen
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from './store'
import { randomCard, pickFragments, CONNECTORS, STORY_MODES, deckColor } from './cards'

const SELL_MOVES = [['Hit_A', 'Treffer verkaufen'], ['Death_A', 'Dramatisch umfallen'], ['Cheer', 'Triumph posen'], ['Spellcast_Long', 'Beschwören']]
const ACTS = { 1: 'Akt I · Intro', 2: 'Akt I · Intro', 3: 'Akt II · Konflikt', 4: 'Akt II · Konflikt', 5: 'Ordeal', 6: 'Finale' }

export function CardFace({ card, small, label }) {
  return (
    <div className={'card' + (small ? ' small' : '')} style={{ '--deck': deckColor(card.deck.id) }}>
      {label && <div className="card-label">{label}</div>}
      <div className="card-name">{card.name}</div>
      {!small && <>
        <div className="card-power">{card.power}</div>
        <div className="card-lore">{card.lore}</div>
      </>}
      <div className="card-deck">{card.deck.title} · #{card.num}</div>
    </div>
  )
}

function Choices({ options, onPick }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      const n = parseInt(e.key, 10)
      if (n >= 1 && n <= Math.min(9, options.length) && !options[n - 1].disabled) { e.preventDefault(); onPick(options[n - 1], n - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [options, onPick])
  return (
    <ol className="choices">
      {options.map((o, i) => (
        <li key={i}><button disabled={o.disabled} onClick={() => onPick(o, i)}><span className="num">{i < 9 ? i + 1 : '·'}</span>{o.label}</button></li>
      ))}
    </ol>
  )
}

function ModeBadge({ mode }) {
  if (mode == null) return null
  const m = STORY_MODES[mode]
  return <span className="mode-badge" style={{ '--mode': m.color }}>{m.n} · {m.name}</span>
}

// ---------- Intro-Ritual: SHOW IT · SPIN IT · SELL IT ----------
function Ritual({ card, role, onDone }) {
  const { playEmote, flashStage, storyMode } = useGame()
  const [step, setStep] = useState('show')
  const [res, setRes] = useState({})
  const claims = useMemo(() => pickFragments(card, 3, Math.random, 'lore'), [card])
  const powers = useMemo(() => pickFragments(card, 3, Math.random, 'power'), [card])
  useEffect(() => { flashStage(); playEmote('Interact') }, [card])
  const head = <div className="dialog-head">Intro-Ritual · {role} <ModeBadge mode={storyMode} /></div>
  if (step === 'show') return (
    <>{head}
      <div className="dialog-body"><CardFace card={card} /><div className="ask big">SHOW IT<br /><span className="hint">„{card.name}“ betritt die Bühne. Name it, loud.</span></div></div>
      <Choices options={[{ label: `„${card.name}!“ ausrufen` }]} onPick={() => setStep('spin')} />
    </>)
  if (step === 'spin') return (
    <>{head}
      <div className="ask"><b>SPIN IT</b> · Was will diese Karte? Ihre Wahrheit, in einem Satz von der Karte:</div>
      <Choices options={claims.map((f) => ({ label: `„${f.text}“`, f }))} onPick={(o) => { setRes({ ...res, claim: o.f.text }); setStep('sell'); playEmote('Spellcast_Raise') }} />
    </>)
  if (step === 'sell') return (
    <>{head}
      <div className="ask"><b>SELL IT</b> · Nicht erklären, vorführen. Welche Power zeigst du?</div>
      <Choices options={powers.map((f) => ({ label: `„${f.text}“`, f }))} onPick={(o) => { setRes({ ...res, power: o.f.text }); setStep('move') }} />
    </>)
  if (step === 'move') return (
    <>{head}
      <div className="ask"><b>SELL IT</b> · Wie verkaufst du es körperlich?</div>
      <Choices options={SELL_MOVES.map(([anim, label]) => ({ label, anim }))} onPick={(o) => {
        playEmote(o.anim, 1900)
        const r = { ...res, move: o.label }
        if (role === 'Scene') { setRes(r); setStep('perform') } else onDone(r)
      }} />
    </>)
  if (step === 'perform') return (
    <>{head}
      <div className="ask">Webst du die Power in die Geschichte ein? (Regel §9)</div>
      <Choices options={[
        { label: 'Ja, Power ausgespielt: Karte geht nach der Geschichte auf den Ablagestapel', v: true },
        { label: 'Nur angedeutet: Karte bleibt auf der Bühne, bis sie überschrieben wird', v: false },
      ]} onPick={(o) => onDone({ ...res, performed: o.v })} />
    </>)
  return null
}

// ---------- Eine Erzählzeile: Stück aus Karte A · Fuge · Stück aus Karte B ----------
function LineBuilder({ from, targets, label, onDone }) {
  const [step, setStep] = useState('a')
  const [cur, setCur] = useState({})
  const [own, setOwn] = useState('')
  const aOpts = useMemo(() => pickFragments(from), [from])
  const target = cur.target || (targets.length === 1 ? targets[0] : null)
  const bOpts = useMemo(() => (target ? pickFragments(target.card) : []), [target?.card?.idx])
  const preview = <div className="tline pending"><span className="tbeat">{label}</span><span>{cur.a ? <span className="frag">{cur.a}</span> : <i>…</i>} {cur.c && <b>{cur.c}</b>}</span></div>
  if (step === 'a') return (
    <>{preview}
      <div className="ask">Als <b>{from.name}</b> beginnst du mit:</div>
      <Choices options={[...aOpts.map((f) => ({ label: `„${f.text}“`, f })), { label: '… (Schnitt, keine Verbindung)', cut: true }]}
        onPick={(o) => o.cut ? onDone({ kind: 'line', beat: label, cut: true }) : (setCur({ a: o.f.text }), setStep('c'))} />
    </>)
  if (step === 'c') {
    const pick = (c, custom) => { setCur({ ...cur, c, custom }); setStep(targets.length > 1 ? 't' : 'b') }
    return (
      <>{preview}
        <div className="ask">Die Fuge:</div>
        <Choices options={CONNECTORS.map((c) => ({ label: c.toUpperCase(), c }))} onPick={(o) => pick(o.c, false)} />
        <form className="own" onSubmit={(e) => { e.preventDefault(); const t = own.trim(); if (t) pick(t.split(/\s+/).slice(0, 8).join(' '), true) }}>
          <label htmlFor="own-conn">oder eigene Fuge (max. 8 Wörter):</label>
          <input id="own-conn" value={own} maxLength={60} onChange={(e) => setOwn(e.target.value)} placeholder="z. B. and nobody noticed" />
          <button type="submit">Enter</button>
        </form>
      </>)
  }
  if (step === 't') return (
    <>{preview}
      <div className="ask">…hinüber zu welcher Karte?</div>
      <Choices options={targets.map((t) => ({ label: `${t.label}: ${t.card.name}`, t }))} onPick={(o) => { setCur({ ...cur, target: o.t }); setStep('b') }} />
    </>)
  if (step === 'b') return (
    <>{preview}
      <div className="ask">…und landet bei <b>{target.card.name}</b>:</div>
      <Choices options={bOpts.map((f) => ({ label: `„${f.text}“`, f }))}
        onPick={(o) => onDone({ kind: 'line', beat: label, a: cur.a, c: cur.c, custom: cur.custom, b: o.f.text, to: target.card.name })} />
    </>)
  return null
}

function Transcript({ entries }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight }, [entries])
  if (!entries?.length) return null
  return (
    <div className="transcript" ref={ref}>
      {entries.map((e, i) => {
        if (e.kind === 'ritual') return <div key={i} className="tline ritual"><span className="tbeat">{e.role}</span><span><b className="name">{e.name}</b>{e.claim && <> · <span className="frag">{e.claim}</span></>}{e.power && <> · <span className="frag">{e.power}</span></>}{e.move && <em> ({e.move})</em>}</span></div>
        if (e.kind === 'mode') return <div key={i} className="tline"><span className="tbeat">Zug {e.turn}</span><ModeBadge mode={e.mode} /></div>
        if (e.kind === 'die') return <div key={i} className="tline"><span className="tbeat">Quest</span><span>Würfel {e.from} → <b>{e.to}</b> ({e.delta > 0 ? '+' : ''}{e.delta}) · {ACTS[e.to]}</span></div>
        if (e.kind === 'note') return <div key={i} className="tline note"><span className="tbeat">·</span><span>{e.text}</span></div>
        return <div key={i} className={'tline' + (e.cut ? ' cut' : '')}><span className="tbeat">{e.beat}</span>{e.cut ? <span>…</span> : <span><span className="frag">{e.a}</span> <b className={e.custom ? 'custom' : ''}>{e.c}</b> <span className="frag">{e.b}</span>.</span>}</div>
      })}
    </div>
  )
}

// ---------- Spielstart: 3 Karten, eine wird Actor ----------
function Start() {
  const { setActor, addToCollection, closeDialog, character } = useGame()
  const deal = useMemo(() => [randomCard(), randomCard(), randomCard()], [])
  const [actor, setA] = useState(null)
  if (!actor) return (
    <div className="dialog wide">
      <div className="dialog-head">Deal · drei Karten</div>
      <div className="ask">Du steuerst die Figur <b>{character}</b>. Welche Karte spielt sie? Die anderen zwei kommen in deine Sammlung.</div>
      <div className="row-cards">{deal.map((c, i) => <CardFace key={i} card={c} label={`${i + 1}`} />)}</div>
      <Choices options={deal.map((c) => ({ label: `Actor: ${c.name}`, c }))} onPick={(o) => setA(o.c)} />
    </div>)
  return (
    <div className="dialog wide">
      <Ritual card={actor} role="Actor" onDone={() => { setActor(actor); addToCollection(deal.filter((c) => c !== actor)); closeDialog(); useGame.getState().showToast('Sammle Karten und kayfabuliere auf der Bühne') }} />
    </div>)
}

// ---------- Auf der Bühne ----------
function StageTurn() {
  const g = useGame()
  const ep = g.episode
  const [phase, setPhase] = useState(ep ? 'roll' : 'quest')
  const questCard = useMemo(() => randomCard(), [])
  const [play, setPlay] = useState(null) // { card, target: 'actor' | slotIndex }
  const [ritual, setRitual] = useState(null)
  const [lines, setLines] = useState([])
  const leave = () => { g.setStoryMode(null); g.closeDialog() }
  const log = (entries) => g.patchEpisode({ transcript: [...useGame.getState().episode.transcript, ...entries] })

  if (phase === 'quest') return (
    <div className="dialog wide">
      <div className="dialog-head">Quest Reveal · King Kayfabian zieht eine Quest</div>
      <Ritual card={questCard} role="Quest" onDone={(r) => {
        g.setEpisode({ quest: questCard, die: 1, stage: [null, null, null], finale: false, turn: 0, transcript: [{ kind: 'ritual', role: 'Quest', name: questCard.name, ...r }] })
        setPhase(g.collection.length ? 'roll' : 'empty')
      }} />
    </div>)

  const episode = useGame.getState().episode
  if (phase === 'empty' || (phase === 'roll' && !g.collection.length)) return (
    <div className="dialog">
      <div className="dialog-head">Bühne</div>
      <Transcript entries={episode?.transcript} />
      <div className="ask">Du hast keine Karten mehr. Sammle neue, dann geht die Geschichte weiter. Die Bühne bleibt stehen.</div>
      <Choices options={[{ label: 'Bühne verlassen' }]} onPick={leave} />
    </div>)

  if (phase === 'roll') return (
    <div className="dialog wide">
      <div className="dialog-head">Zug {episode.turn + 1}{episode.finale ? ' · FINALE: die Quest muss sich auflösen' : ''} · Quest: {episode.quest.name} · Würfel {episode.die} ({ACTS[episode.die]})</div>
      <Transcript entries={episode.transcript} />
      <Choices options={[{ label: 'Story-Mode würfeln' }, { label: 'Bühne verlassen' }]} onPick={(o, i) => {
        if (i === 1) return leave()
        const m = Math.floor(Math.random() * 6)
        g.setStoryMode(m); g.playEmote('Cheer', 900)
        g.patchEpisode({ turn: episode.turn + 1 }); log([{ kind: 'mode', mode: m, turn: episode.turn + 1 }])
        setPhase('play')
      }} />
    </div>)

  const mode = STORY_MODES[g.storyMode ?? 0]
  const modeHead = <div className="mode-banner" style={{ '--mode': mode.color }}><b>{mode.n} · {mode.name}</b> <span>{mode.hint}</span></div>

  if (phase === 'play') {
    const slotOpts = episode.stage.map((c, k) => c ? { label: `Szene ${k + 1} überschreiben (yes-and): ${c.name}`, target: k } : { label: `Szene ${k + 1} (frei)`, target: k })
    return (
      <div className="dialog wide">{modeHead}
        {!play ? <>
          <div className="ask">Welche Karte aus deiner Sammlung spielst du?</div>
          <div className="row-cards scroll">{g.collection.map((c) => <button key={c.idx} className="slot-pick" onClick={() => setPlay({ card: c })}><CardFace card={c} small /></button>)}</div>
          <Choices options={[{ label: 'Abbrechen (Bühne verlassen)' }]} onPick={leave} />
        </> : <>
          <div className="dialog-body"><CardFace card={play.card} small label="ausgespielt" /><div className="ask">Wohin?</div></div>
          <Choices options={[...slotOpts.filter((o) => !episode.stage[o.target]), ...slotOpts.filter((o) => episode.stage[o.target]), { label: `Als neue Actor-Karte (Character Switch, ${g.actor.name} geht ab)`, target: 'actor' }, { label: 'Andere Karte wählen', back: true }]}
            onPick={(o) => { if (o.back) return setPlay(null); setPlay({ ...play, target: o.target }); setPhase('ritual') }} />
        </>}
      </div>)
  }

  if (phase === 'ritual') return (
    <div className="dialog wide">{modeHead}
      <Ritual card={play.card} role={play.target === 'actor' ? 'Actor' : 'Scene'} onDone={(r) => {
        const s = useGame.getState()
        s.removeFromCollection(play.card.idx)
        if (play.target === 'actor') { s.toDiscard([s.actor]); s.setActor(play.card) }
        else { const stage = [...s.episode.stage]; if (stage[play.target]) s.toDiscard([stage[play.target]]); stage[play.target] = play.card; s.patchEpisode({ stage }) }
        s.flashStage()
        log([{ kind: 'ritual', role: play.target === 'actor' ? 'Actor' : `Szene ${play.target + 1}`, name: play.card.name, ...r }])
        setRitual(r); setPhase('tell')
      }} />
    </div>)

  if (phase === 'tell') {
    const ep2 = useGame.getState().episode
    const actor = useGame.getState().actor
    const others = ep2.stage.map((c, k) => c && c !== play.card ? { card: c, label: `Szene ${k + 1}` } : null).filter(Boolean)
    const questT = { card: ep2.quest, label: 'Quest' }
    // Zeile 1: Actor-Sicht → gespielte Karte · Zeile 2: gespielte Karte → andere Szene oder Quest
    const plan = play.target === 'actor'
      ? [{ from: actor, targets: [...others, questT], label: 'TELL' }]
      : [{ from: actor, targets: [{ card: play.card, label: 'neu' }], label: 'TELL 1' }, { from: play.card, targets: [...others, questT], label: 'TELL 2' }]
    const k = lines.length
    if (k < plan.length) return (
      <div className="dialog wide">{modeHead}
        <div className="dialog-head">Erzähl in der Ich-Form als {actor.name}. Die Quest muss spürbar sein.</div>
        <Transcript entries={[...ep2.transcript.slice(-4), ...lines]} />
        <LineBuilder key={k} {...plan[k]} onDone={(l) => { const nl = [...lines, l]; setLines(nl); if (nl.length === plan.length) { log(nl); setPhase('move') } }} />
      </div>)
  }

  if (phase === 'move') {
    const ep3 = useGame.getState().episode
    const opts = [[2, 'Harter Push'], [1, 'Vorwärts'], [0, 'Halten'], [-1, 'Zurück (Twist)']]
    return (
      <div className="dialog wide">{modeHead}
        <Transcript entries={ep3.transcript.slice(-5)} />
        <div className="ask">Quest-Würfel steht auf <b>{ep3.die}</b>. Deine dramaturgische Entscheidung:</div>
        <Choices options={opts.map(([d, l]) => ({ label: `${d > 0 ? '+' : ''}${d} · ${l} → ${Math.max(1, Math.min(6, ep3.die + d))} (${ACTS[Math.max(1, Math.min(6, ep3.die + d))]})`, d }))}
          onPick={(o) => {
            const s = useGame.getState(); const e = s.episode
            const to = Math.max(1, Math.min(6, e.die + o.d))
            const entries = [{ kind: 'die', from: e.die, to, delta: o.d }]
            let stage = e.stage
            if (play.target !== 'actor' && ritual?.performed) { stage = e.stage.map((c) => (c === play.card ? null : c)); s.toDiscard([play.card]); entries.push({ kind: 'note', text: `${play.card.name}: Power ausgespielt, Karte auf den Ablagestapel` }) }
            if (e.finale) {
              s.toDiscard(stage); s.patchEpisode({ transcript: [...e.transcript, ...entries] })
              useGame.setState({ memories: [...s.memories, { quest: e.quest, transcript: [...e.transcript, ...entries] }], episode: null })
              setPhase('finished'); return
            }
            s.patchEpisode({ die: to, stage, finale: to >= 6, transcript: [...e.transcript, ...entries] })
            setPhase('done')
          }} />
      </div>)
  }

  if (phase === 'done' || phase === 'finished') {
    const s = useGame.getState()
    const mem = s.memories[s.memories.length - 1]
    const tr = phase === 'finished' ? mem.transcript : s.episode.transcript
    const text = tr.map((e) => e.kind === 'line' ? (e.cut ? '…' : `${e.a} ${e.c} ${e.b}.`) : e.kind === 'ritual' ? `[${e.role}] ${e.name}: ${e.claim || ''} / ${e.power || ''}` : e.kind === 'die' ? `[Quest ${e.from}→${e.to}]` : e.kind === 'mode' ? `[${STORY_MODES[e.mode].name}]` : e.text).join('\n')
    return (
      <div className="dialog wide">
        <div className="dialog-head">{phase === 'finished' ? `Finale · Quest „${mem.quest.name}“ bleibt als Erinnerung` : s.episode.finale ? 'Würfel auf 6: im nächsten Zug kommt das Finale' : 'Zug beendet'}</div>
        <Transcript entries={tr} />
        <div className="hint">Solo-Regel: Sag dir einen Satz, was sich verschoben hat. Das ist dein BINGO und dein Blödsinn in einem.</div>
        <Choices options={[
          { label: phase === 'finished' ? 'Neue Episode (King zieht eine neue Quest)' : 'Nächster Zug', disabled: !s.collection.length && phase !== 'finished' },
          { label: 'Geschichte kopieren', copy: true },
          { label: 'Bühne verlassen', leave: true },
        ]} onPick={async (o) => {
          if (o.copy) { try { await navigator.clipboard.writeText(text); s.showToast('Geschichte kopiert') } catch (e) { s.showToast('Kopieren nicht erlaubt') } return }
          if (o.leave) return leave()
          setPlay(null); setRitual(null); setLines([])
          if (phase === 'finished') { g.setStoryMode(null); g.openDialog({ kind: 'stage', id: Date.now() }) } else setPhase('roll')
        }} />
      </div>)
  }
  return null
}

export default function Dialog() {
  const dialog = useGame((s) => s.dialog)
  const near = useGame((s) => s.near)
  const mode = useGame((s) => s.mode)
  const collection = useGame((s) => s.collection)
  const episode = useGame((s) => s.episode)

  useEffect(() => {
    const onKey = (e) => {
      const s = useGame.getState()
      if (s.mode !== 'play') return
      if (e.code === 'Escape' && s.dialog && s.dialog.kind !== 'start') { s.setStoryMode(null); s.closeDialog(); return }
      if (e.code !== 'KeyE' || s.dialog || !s.near) return
      if (s.near.type === 'card') s.openDialog({ kind: 'card', card: s.near.card })
      if (s.near.type === 'stage') {
        if (!s.collection.length && !s.episode) s.showToast('Sammle zuerst Karten für die Bühne')
        else s.openDialog({ kind: 'stage', id: Date.now() })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (mode !== 'play') return null
  return (
    <>
      {!dialog && near && (
        <div className="prompt">
          <b>E</b> {near.type === 'card' ? `${near.card.name} ansprechen` : episode ? `Weiter kayfabulieren (Quest-Würfel ${episode.die})` : collection.length ? 'Auf die Bühne: Quest ziehen' : 'Bühne (erst Karten sammeln)'}
        </div>
      )}
      {dialog?.kind === 'start' && <Start />}
      {dialog?.kind === 'card' && <CardEncounter card={dialog.card} />}
      {dialog?.kind === 'stage' && <StageTurn key={dialog.id} />}
    </>
  )
}

function CardEncounter({ card }) {
  const { collect, closeDialog } = useGame()
  return (
    <div className="dialog">
      <div className="dialog-head">Eine Karte · {card.deck.title}</div>
      <div className="dialog-body"><CardFace card={card} /><div className="bubble thought">…</div></div>
      <Choices options={[{ label: 'In die Sammlung nehmen', a: () => collect(card) }, { label: 'Weitergehen', a: closeDialog }]} onPick={(o) => o.a()} />
    </div>
  )
}
