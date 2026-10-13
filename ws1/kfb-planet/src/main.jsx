import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'
import { useGame } from './store'
import { adapter } from './scene'
window.__kfbStore = useGame
window.__kfbStage = () => adapter.stage().position.toArray()

createRoot(document.getElementById('root')).render(<App />)
