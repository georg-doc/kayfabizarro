import { useGame } from './store'
import CardArt from './CardArt'
import { deckColor } from './cards'
import { SCENE } from './scene'

const TOOLS = [['wall', 'Wand'], ['block', 'Block'], ['pillar', 'Säule']]
const GIZMOS = [['translate', 'Verschieben', '1'], ['rotate', 'Drehen', '2'], ['scale', 'Größe', '3']]

export default function Hud() {
  const s = useGame()
  const exportJson = async () => {
    const txt = JSON.stringify(s.objects, null, 1)
    try { await navigator.clipboard.writeText(txt); s.showToast('Weltdaten in die Zwischenablage kopiert') }
    catch (e) {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' }))
      a.download = 'kfb-welt-objekte.json'; a.click(); s.showToast('Weltdaten als Datei gespeichert')
    }
  }
  return (
    <div className="hud">
      <div className="panel top-left">
        <div className="title">KFB · Spike R4</div>
        <div className="where">{s.planetName}{s.flying ? ' · fliegt' : ''}</div>
        {s.mode === 'play' && (
          <div className="actor" style={{ '--deck': s.actor ? deckColor(s.actor.deck.id) : '#888' }}>
            <div className="actor-k">Figur: {s.character} · spielt</div>
            <div className="actor-name">{s.actor ? s.actor.name : '…'}</div>
            {s.actor && <div className="actor-lore">„{s.actor.lore}“</div>}
            {s.actor && <div className="actor-deck">{s.actor.deck.title}</div>}
            {s.episode && <div className="actor-deck">Quest: <b>{s.episode.quest.name}</b> · Würfel {s.episode.die}/6</div>}
          </div>
        )}
        <div className="modes">
          <button className={s.mode === 'play' ? 'on' : ''} onClick={() => s.setMode('play')}>Spielen</button>
          {SCENE === 'planets' && <button className={s.mode === 'build' ? 'on' : ''} onClick={() => s.setMode('build')}>Bauen</button>}
        </div>
      </div>

      {s.mode === 'play' ? (s.dialog ? null :
        <div className="panel bottom-left help">
          <b>WASD</b> laufen · <b>Shift</b> rennen · <b>Leertaste</b> springen<br />
          <b>F</b> abheben / landen · im Flug: <b>Leertaste</b> steigen, <b>Shift</b> Turbo<br />
          <b>Maus ziehen</b> Kamera · <b>Mausrad</b> Zoom · <b>R</b> zurück zum Start · <b>E</b> ansprechen<br />
          <span className="hint">{SCENE === 'hex' ? 'Am Deck-Turm: Leertaste springt geführt zur nächsten Plattform in Blickrichtung. Landen schaltet die Karte frei. Kayfabuliert wird auf der gelben Bühne beim Start.' : 'Sammle Karten (einige liegen im Labyrinth des lila Planeten) und kayfabuliere auf der gelben Bühne. Gespielte Karten landen auf dem Ablagestapel.'}</span>
        </div>
      ) : (
        <div className="panel bottom-left help">
          <div className="row">Planet:{[['home', 'Heimat'], ['prison', 'Gefängnis']].map(([k, l]) => <button key={k} className={s.buildFocus === k ? 'on' : ''} onClick={() => s.setBuildFocus(k)}>{l}</button>)}</div>
          <div className="row">Setzen:{TOOLS.map(([k, l]) => <button key={k} className={s.tool === k ? 'on' : ''} onClick={() => s.setTool(k)}>{l}</button>)}</div>
          <div className="row">Gizmo:{GIZMOS.map(([k, l, n]) => <button key={k} className={s.gizmo === k ? 'on' : ''} onClick={() => s.setGizmo(k)}>{n} {l}</button>)}</div>
          <div className="row">
            <button onClick={s.newMaze}>Neues Labyrinth</button>
            <button onClick={s.removeSelected} disabled={!s.selected}>Löschen</button>
            <button onClick={exportJson}>Export</button>
            <button onClick={() => confirmClear(s)}>Alles leeren</button>
          </div>
          <span className="hint">Klick auf Planet = setzen · Klick auf Objekt = auswählen · Entf = löschen · Esc = abwählen. Objekte schnappen nach dem Ziehen auf die Oberfläche.</span>
        </div>
      )}
      {s.mode === 'play' && (
        <div className="panel hand">
          <div className="actor-k">Sammlung {s.collection.length}</div>
          {s.collection.length === 0 ? <div className="hint">leer: Karten finden</div> : s.collection.slice(0, 10).map((c) => <div key={c.idx} className="chip" style={{ '--deck': deckColor(c.deck.id) }}><CardArt card={c} width={56} />{c.name}</div>)}
          {s.collection.length > 10 && <div className="hint">+{s.collection.length - 10} weitere</div>}
          <div className="actor-k" style={{ marginTop: 6 }}>Ablagestapel {s.discard.length}</div>
          {s.memories.length > 0 && <div className="actor-k">Erinnerungen {s.memories.length}</div>}
        </div>
      )}
      {s.toast && <div className="toast">{s.toast}</div>}
    </div>
  )
}

function confirmClear(s) {
  if (s.objects.length && !s._clearArmed) { useGame.setState({ _clearArmed: true }); s.showToast('Nochmal klicken zum Leeren'); setTimeout(() => useGame.setState({ _clearArmed: false }), 2500); return }
  s.clearAll(); useGame.setState({ _clearArmed: false })
}
