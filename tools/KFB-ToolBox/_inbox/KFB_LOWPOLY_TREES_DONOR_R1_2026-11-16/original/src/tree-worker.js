// Grows trees off the page's thread: welding the wood takes 100 to 600 ms, which would freeze a frame.
// Takes { id, params, budget, preview }, answers with plain buffers, one set for the tree and one for each vine, and the
// recipe (plain JSON), which the page needs for the rig. A preview skips the welding: its wood overlaps inside, which
// doesn't show, and it takes a few milliseconds, so it can follow a slider while it's dragged.
import { buildLowpolyTreeGeometry, buildLowpolyTreePreviewGeometry, buildLowpolyTreeVineGeometry, createLowpolyTreeRecipe } from '@rand-monster/lowpoly-tree-generator';

const pack = (geometry) => ({
	position: geometry.getAttribute('position').array,
	normal: geometry.getAttribute('normal').array,
	color: geometry.getAttribute('color').array,
	index: geometry.index.array,
});

self.onmessage = ({ data: { id, params, budget, preview } }) => {
	try {
		const started = performance.now();
		const recipe = createLowpolyTreeRecipe(params);
		const { geometry, stats } = preview ? buildLowpolyTreePreviewGeometry(recipe) : buildLowpolyTreeGeometry(recipe, { triangleBudget: budget });
		// One geometry a vine, so each can be hung and swung on its own (the generator merges them otherwise).
		const vines = (recipe.vines?.vines ?? []).map((vine) => ({
			vine,
			geometry: pack(buildLowpolyTreeVineGeometry({ ...recipe.vines, vines: [vine] }).geometry),
		}));
		self.postMessage({ id, preview, recipe, tree: pack(geometry), vines, stats, ms: performance.now() - started });
	} catch (error) {
		self.postMessage({ id, error: String(error?.message ?? error) });
	}
};
