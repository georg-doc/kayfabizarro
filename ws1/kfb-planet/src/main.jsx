import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'
import { useGame } from './store'
import { adapter, TOWER } from './scene'
import { expose } from './debug'
// Debug-Zugang nur mit URL-Schalter (#debug, #hosttest), Vertrag §6
expose('Store', useGame)
expose('Stage', () => adapter.stage().position.toArray())
expose('Tower', () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.card))
expose('TowerPos', () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.pos.toArray()))

createRoot(document.getElementById('root')).render(<App />)
