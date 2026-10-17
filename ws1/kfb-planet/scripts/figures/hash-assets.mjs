// V-391 · Körper-Prüfsummen der Figuren, die die Bühne lädt (Datei → sha256). Wird bei jedem Tausch eines Körper-GLB neu erzeugt; die Bühne
// vergleicht zur Laufzeit card.body.glb.sha256 mit diesem Wert (synchron, ohne das GLB zu laden). Prüfung: node test/unit/figures.mjs.
// node scripts/figures/hash-assets.mjs
import fs from 'fs'
import crypto from 'crypto'
import { FIGURE_FILES } from '../../src/actors/figureFiles.js'
const out = Object.fromEntries(Object.entries(FIGURE_FILES).map(([id, f]) => [id, { file: f, sha256: crypto.createHash('sha256').update(fs.readFileSync('src/assets/actors/' + f)).digest('hex') }]))
fs.writeFileSync('src/data/figures/assets.sha.json', JSON.stringify(out, null, 1) + '\n'); console.log(out)
