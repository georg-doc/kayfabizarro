// Host-Vertrag R1.2 §1 · Versionen exakt gepinnt, genau eine three-Instanz.
import fs from 'fs'
import { execSync } from 'child_process'
import { report } from './_page.mjs'
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const all = { ...pkg.dependencies, ...pkg.devDependencies }
const ranged = Object.entries(all).filter(([, v]) => /[\^~*<>]|latest/.test(v)).map(([k]) => k)
const want = { three: '0.186.1', '@react-three/fiber': '9.8.1', '@react-three/drei': '10.7.9', '@react-three/rapier': '2.2.0', '@dimforge/rapier3d-compat': '0.19.2', ecctrl: '2.0.2', zustand: '5.0.15', react: '19.3.0', 'react-dom': '19.3.0' }
const wrong = Object.entries(want).filter(([k, v]) => all[k] !== v).map(([k]) => k)
const ls = execSync('npm ls three --all --parseable', { encoding: 'utf8' }).trim().split('\n').filter((l) => /node_modules\/three$/.test(l))
const inst = JSON.parse(execSync('npm ls three --all --json', { encoding: 'utf8' }))
const versions = new Set()
const walk = (o) => { for (const [k, v] of Object.entries(o.dependencies || {})) { if (k === 'three') versions.add(v.version); walk(v) } }
walk(inst)
process.exit(report('deps', {
  noRanges: ranged.length === 0,
  pinnedAsContract: wrong.length === 0,
  overrides: pkg.overrides?.three === '0.186.1' && pkg.overrides?.['@dimforge/rapier3d-compat'] === '0.19.2',
  lockfile: fs.existsSync('package-lock.json'),
  oneThreeInstall: ls.length === 1,
  oneThreeVersion: versions.size === 1 && versions.has('0.186.1'),
}, { ranged, wrong, threeVersions: [...versions] }))
