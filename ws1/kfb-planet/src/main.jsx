import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'
import { useGame } from './store'
import { adapter, TOWER } from './scene'
window.__kfbStore = useGame
window.__kfbStage = () => adapter.stage().position.toArray()
window.__kfbTower = () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.card)
window.__kfbTowerPos = () => TOWER && TOWER.pieces.filter((p) => p.kind === 'card').map((p) => p.pos.toArray())

createRoot(document.getElementById('root')).render(<App />)
