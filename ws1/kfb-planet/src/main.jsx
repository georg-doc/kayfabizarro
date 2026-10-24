import './siteRaw' // MVP-Site: Repo-Abrufe über /raw (nur im Site-Build aktiv)
// MVP-Startseite (V-618): Vorhang mit Bühne vor dem Spiel. Georg 23.10.: Startseite raus – auf der Site landet die Adresse ohne Hash direkt im Spiel
// (neues Gelände), der Vorhang bleibt nur hinter dem Schalter 'start' (die nackte Adresse bleibt für die bestehenden Tests unverändert).
if (typeof location !== 'undefined') {
  const bare = !location.hash || location.hash === '#'
  // Neu laden statt nur umschreiben (WS0 25.10.): die Importe oben laufen vor diesem Block und lesen ihre Schalter (look, hud, calm …) schon beim Laden –
  // ohne Neuladen startete die nackte Site-Adresse mit grüner Wiese und ohne HUD.
  if (bare && import.meta.env.VITE_KFB_SITE) { history.replaceState(null, '', location.pathname + location.search + SITE_HASH); location.reload() }
  if (/(^|[#,])start(,|$)/.test(location.hash)) import('./start/startCurtain.js').then((m) => expose('Start', m.mountStartCurtain())).catch((e) => console.warn('[start]', e))
}
import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'
import { useGame } from './store'
import { adapter, TOWER } from './scene'
import { expose } from './debug'
import { cardAt, CARD_COUNT } from './cards'
import { SITE_HASH } from './siteHash.js' // ein Start-Hash für Site und Abnahmebilder
// Debug-Zugang nur mit URL-Schalter (#debug, #hosttest), Vertrag §6
expose('Store', useGame)
expose('Card', (deckId, n) => { for (let i = 0; i < CARD_COUNT; i++) { const c = cardAt(i); if (c.deck.id === deckId && c.num === n) return c } return null })
expose('Stage', () => adapter.stage().position.toArray())
expose('Tower', () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.card))
expose('TowerPos', () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.pos.toArray()))

createRoot(document.getElementById('root')).render(<App />)
