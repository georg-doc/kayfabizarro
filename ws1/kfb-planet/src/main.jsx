import './siteRaw' // MVP-Site: Repo-Abrufe über /raw (nur im Site-Build aktiv)
// MVP-Startseite (V-618): Vorhang mit Bühne vor dem Spiel. Auf der Site landet die Adresse ohne Hash im Spiel (neues Gelände) mit Vorhang;
// überall sonst nur mit dem Schalter 'start' (die nackte Adresse bleibt für die bestehenden Tests unverändert).
if (typeof location !== 'undefined') {
  const bare = !location.hash || location.hash === '#'
  if (bare && import.meta.env.VITE_KFB_SITE) history.replaceState(null, '', location.pathname + location.search + '#m1,harvest,look=terrain3,world=probe,start')
  if (/(^|[#,])start(,|$)/.test(location.hash)) import('./start/startCurtain.js').then((m) => expose('Start', m.mountStartCurtain())).catch((e) => console.warn('[start]', e))
}
import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'
import { useGame } from './store'
import { adapter, TOWER } from './scene'
import { expose } from './debug'
import { cardAt, CARD_COUNT } from './cards'
// Debug-Zugang nur mit URL-Schalter (#debug, #hosttest), Vertrag §6
expose('Store', useGame)
expose('Card', (deckId, n) => { for (let i = 0; i < CARD_COUNT; i++) { const c = cardAt(i); if (c.deck.id === deckId && c.num === n) return c } return null })
expose('Stage', () => adapter.stage().position.toArray())
expose('Tower', () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.card))
expose('TowerPos', () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.pos.toArray()))

createRoot(document.getElementById('root')).render(<App />)
