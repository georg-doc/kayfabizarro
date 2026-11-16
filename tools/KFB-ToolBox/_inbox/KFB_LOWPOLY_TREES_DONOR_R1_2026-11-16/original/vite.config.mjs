// The block demo's build: index.html at the top of dist, every path relative, nothing from other hosts.
// The generator is vendored unedited at commit 4377dd6 (vendor/lowpoly-tree-generator, MIT); three, three-bvh-csg and
// three-mesh-bvh are installed at the versions it was tested with.
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const lib = (f) => fileURLToPath(new URL(`./vendor/lowpoly-tree-generator/src/${f}`, import.meta.url));

export default {
	root: here,
	base: './',
	publicDir: false,
	resolve: {
		alias: [
			{ find: /^@rand-monster\/lowpoly-tree-generator\/(animation|archetypes|profile|vines|controller)$/, replacement: `${lib('')}$1.js` },
			{ find: /^@rand-monster\/lowpoly-tree-generator$/, replacement: lib('index.js') },
			{ find: /^patch-block$/, replacement: fileURLToPath(new URL('./lib/patch-block.js', import.meta.url)) },
		],
		dedupe: ['three'],
	},
	// Trees grow in a module worker (src/tree-worker.js), built with the same aliases.
	worker: { format: 'es' },
	build: { target: 'es2022', outDir: `${here}dist`, emptyOutDir: true, assetsInlineLimit: 0, chunkSizeWarningLimit: 4000, modulePreload: { polyfill: false } },
};
