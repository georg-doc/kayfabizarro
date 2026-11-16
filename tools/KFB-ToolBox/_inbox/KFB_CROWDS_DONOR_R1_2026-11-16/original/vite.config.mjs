// The block demo's build: index.html at the top of dist, every path relative, nothing from other hosts.
// No `vite` import: the config is a plain object. Recast's WebAssembly comes embedded in its compat build, so there's
// no file to fetch and no special hosting.
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));

export default {
	root: here,
	base: './',
	publicDir: 'public',
	resolve: {
		alias: [{ find: /^patch-block$/, replacement: fileURLToPath(new URL('./lib/patch-block.js', import.meta.url)) }],
		dedupe: ['three'],
	},
	build: { target: 'es2022', outDir: `${here}dist`, emptyOutDir: true, assetsInlineLimit: 0, chunkSizeWarningLimit: 4000, modulePreload: { polyfill: false } },
};
