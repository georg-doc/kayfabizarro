import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'url'

// F1 · Die Studio-Spender (kfb-hub/stage/toolbox/eye-rig-batch/lib, cloudflare-live) importieren ihre Abhängigkeiten
// über feste jsDelivr-Adressen. Diese Adressen zeigen hier auf byte-gleiche Kopien in src/vendor/eyes/ (gleiche Pins,
// gleiche Blobs), damit kein Spender verändert wird und kein Netzzugriff zur Laufzeit nötig ist.
const V = (f) => fileURLToPath(new URL('./src/vendor/eyes/' + f, import.meta.url))
const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'
const P5650 = '5650b6c54d8789b20ea80abe857688173d506d3b', P2bfb = '2bfbe0d2d73aeb5f2fc3af5b11983dc099016792'
const EYE_ALIASES = [
  [`${CDN}${P5650}/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js`, V('facehost.v1.js')],
  [`${CDN}${P5650}/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`, V('pet-eye-rig.v6.js')],
  [`${CDN}${P2bfb}/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/eyeoval.v1.js`, V('eyeoval.v1.js')],
  [`${CDN}${P5650}/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/donoreyes.v1.js`, V('donoreyes.v1.js')],
  [`${CDN}${P5650}/media/3D_Assets/build/pet-library.v6.js`, V('pet-library.v6.js')],
].map(([find, replacement]) => ({ find, replacement }))

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  publicDir: false,
  resolve: { alias: EYE_ALIASES },
  build: { assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 100_000 },
})
