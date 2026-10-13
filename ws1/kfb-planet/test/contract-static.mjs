// Host-Vertrag R1.2 · statische Prüfung ohne Browser (§2 Modulvertrag, §3 Fallen, §4 Eingabe, §6 Debug).
import fs from 'fs'
import path from 'path'
import { report } from './_page.mjs'
const SRC = 'src'
const files = []
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (f !== 'vendor' && f !== 'data' && f !== 'assets') walk(p) } else if (/\.(js|jsx|mjs)$/.test(f)) files.push(p) } }
walk(SRC)
const read = (p) => fs.readFileSync(p, 'utf8')
// Module = Dateien, die create…(options) -> { object3d, update, dispose } liefern
const modules = files.filter((p) => /object3d/.test(read(p)) && /dispose\s*\(/.test(read(p)) && !/ModuleHost/.test(p))
const bad = { react: [], store: [], globalState: [], windowListener: [] }
for (const p of modules) {
  const s = read(p)
  if (/from ['"]react['"]|@react-three/.test(s)) bad.react.push(p)
  if (/from ['"]\.\/store['"]|useGame/.test(s)) bad.store.push(p)
  if (/scene\.(fog|background)\s*=|renderer\.\w+\s*=|camera\.(position|quaternion|rotation|fov)\.?\w*\s*=/.test(s)) bad.globalState.push(p)
  if (/window\.addEventListener/.test(s)) bad.windowListener.push(p)
}
const keyListeners = files.filter((p) => /addEventListener\(\s*['"]key(down|up)['"]/.test(read(p)))
const globals = new Set()
for (const p of files) for (const m of read(p).matchAll(/window\.(__\w+)/g)) globals.add(m[1])
const nonKfb = [...globals].filter((g) => !g.startsWith('__kfb'))
const app = read('src/App.jsx')
process.exit(report('contract-static', {
  modulesFound: modules.length >= 1,
  modulesNoReact: bad.react.length === 0,
  modulesNoStore: bad.store.length === 0,
  modulesNoGlobalState: bad.globalState.length === 0,
  modulesNoWindowListener: bad.windowListener.length === 0,
  oneKeyListener: keyListeners.length === 1 && keyListeners[0].endsWith('hostKeys.js'),
  debugOnlyKfbGlobals: nonKfb.length === 0,
  fixedTimeStep: /timeStep=\{1 \/ 60\}/.test(app) && !/vary/.test(app),
  oneCanvas: (app.match(/<Canvas/g) || []).length === 1,
}, { modules, bad, keyListeners, nonKfb }))
