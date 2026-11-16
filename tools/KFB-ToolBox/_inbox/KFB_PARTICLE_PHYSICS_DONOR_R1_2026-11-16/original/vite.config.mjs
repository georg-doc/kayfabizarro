// The block demo's build: index.html at the top of dist, every path relative, nothing from other hosts.
// No `vite` import: the config is a plain object. The library is vendored (vendor/threejs-particle-fluids: its source at
// 26ebfd2, MIT, three fixes: VENDOR.md); three is the repo's one copy.
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));

export default {
  root: here,
  base: './',
  publicDir: 'public',
  resolve: {
    alias: [
      { find: /^threejs-particle-fluids$/, replacement: fileURLToPath(new URL('./vendor/threejs-particle-fluids/src/index.ts', import.meta.url)) },
      { find: /^patch-block$/, replacement: fileURLToPath(new URL('./lib/patch-block.js', import.meta.url)) },
    ],
    dedupe: ['three'],
  },
  worker: { format: 'es' },
  build: { target: 'es2022', outDir: `${here}dist`, emptyOutDir: true, assetsInlineLimit: 0, chunkSizeWarningLimit: 4000, modulePreload: { polyfill: false } },
};
