// Which of the generator's parameters the block's controls set, and how a seed turns an archetype into a new tree.
// Each control's id is the generator's parameter name in snake case (recipe ids are lowercase): `base_radius` is
// `baseRadius` in createLowpolyTreeRecipe. make-recipe.mjs writes these into recipe.json; demo.js uses them.
import { LOWPOLY_TREE_ARCHETYPES } from '../vendor/lowpoly-tree-generator/src/archetypes.js';

// The generator's archetypes, with leaner, longer roots. Its own are wide and flow together into a skirt round the trunk,
// and here they are the feet a tree walks on, so each has to read on its own. Everything else is as it drew them.
const legs = (params) => ({
	...params,
	rootWidth: round((params.rootWidth ?? 0.28) * 0.6),
	rootLength: round((params.rootLength ?? 0.82) * 1.22),
	rootSpread: Math.max(params.rootSpread ?? 0.24, 0.46),
});
const round = (x) => Math.round(x * 100) / 100;
export const ARCHETYPES = Object.fromEntries(
	Object.entries(LOWPOLY_TREE_ARCHETYPES).map(([id, archetype]) => [id, { ...archetype, params: legs(archetype.params) }]),
);
export const FIRST_ARCHETYPE = 'ancientGuardian';

const snake = (param) => param.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const number = (param, label, hint, min, max, step, essential) => ({ id: snake(param), param, label, hint, type: 'number', min, max, step, ...(essential ? { essential } : {}) });
const color = (param, label, hint) => ({ id: snake(param), param, label, hint, type: 'color' });

/** Controls that map one to one onto a generator parameter. For agents, not shown on the block's page. */
export const PARAM_CONTROLS = [
	number('height', 'Height', 'How tall the trunk is, in metres.', 1.8, 5.5, 0.01, true),
	number('baseRadius', 'Trunk width', 'The trunk\'s radius at the base, in metres.', 0.15, 0.9, 0.01),
	number('bendX', 'Bend sideways', 'How far the trunk bends along X at its middle.', -1.2, 1.2, 0.01),
	number('bendZ', 'Bend forward', 'How far the trunk bends along Z at its middle.', -1.2, 1.2, 0.01),
	number('upperBendX', 'Upper bend', 'A second bend higher up, which makes S shapes against the first.', -1.2, 1.2, 0.01),
	number('profileTwistTurns', 'Trunk twist', 'Turns of real faceted twist along the trunk. Adds no triangles.', -1.5, 1.5, 0.01),
	number('rootCount', 'Roots', 'How many roots: these are the feet it walks on.', 0, 12, 1),
	number('rootLength', 'Root length', 'How far the roots reach, in metres.', 0.3, 2.2, 0.01),
	number('rootWidth', 'Root width', 'How wide each root is: wide ones flow together into a skirt.', 0.08, 0.5, 0.01),
	number('branchCount', 'Branches', 'How many main branches leave the trunk.', 0, 8, 1),
	number('branchLength', 'Branch reach', 'How far the main branches reach, in metres: a tight ball of a tree, or a wide spreading one.', 0.4, 2.4, 0.01, true),
	number('branchLift', 'Branch lift', 'How much the main branches rise: negative droops.', -0.6, 1.6, 0.01),
	number('secondaryBranchCount', 'Forks', 'How many smaller branches fork off the main ones.', 0, 16, 1),
	number('secondaryBranchLength', 'Fork length', 'How long the forks are, in metres.', 0.2, 1.6, 0.01),
	number('canopyClusterCount', 'Leaf clusters', 'How many clusters of leaves the crown has.', 1, 24, 1),
	number('canopyRadius', 'Cluster size', 'The radius of a cluster of leaves, in metres.', 0.2, 1.2, 0.01),
	number('canopyHeightScale', 'Cluster shape', 'Flat clusters below 1, tall above.', 0.4, 1.4, 0.01),
	number('canopyIrregularity', 'Cluster roughness', 'How uneven each cluster\'s facets are.', 0, 0.5, 0.01),
	color('barkColor', 'Bark', 'The colour of the wood.'),
	color('canopyColorTop', 'Crown top', 'The colour of the leaves\' sunlit faces.'),
	color('canopyColorSide', 'Crown side', 'The colour of the leaves\' side faces.'),
	color('canopyColorBottom', 'Crown underside', 'The colour of the leaves\' under faces.'),
	{ id: 'vine_enabled', param: 'vineEnabled', label: 'Vines', hint: 'Hang vines from the branch tips. They swing when the tree moves.', type: 'toggle' },
	number('vineCount', 'Vine count', 'How many vines hang, when vines are on.', 0, 16, 1),
	number('vineBaseLength', 'Vine length', 'How long the vines are, in metres.', 0.35, 4, 0.01),
];
export const PARAM_BY_ID = new Map(PARAM_CONTROLS.map((control) => [control.id, control]));

// A little generator of its own, so a seed always grows the same tree.
const random = (seed) => {
	let s = (seed * 2654435761) >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

/**
 * The archetype's tree grown differently. An archetype is only one set of parameters, and the generator's seeds only
 * move the leaves and vines, so a new tree also turns its roots and branches and changes its bends and lengths a little.
 * Seed 0 is the archetype as it was drawn.
 */
export function varied(params, seed) {
	if (!seed) return { ...params };
	const r = random(seed);
	const within = (x, by) => round(x + (r() - 0.5) * 2 * by);
	const out = { ...params };
	out.canopySeed = seed % 9999;
	out.vineSeed = (seed * 7) % 9999;
	out.branchPhase = round(r() * 6.28);
	out.rootPhase = round(r() * 6.28);
	out.secondaryBranchPhase = round(r() * 6.28);
	out.wavePhase = round(r() * 6.28);
	out.canopyRotation = round(r() * 6.28);
	out.height = round(params.height * (0.88 + r() * 0.24));
	for (const key of ['bendX', 'bendZ', 'upperBendX', 'upperBendZ']) out[key] = within(params[key] ?? 0, 0.16);
	for (const key of ['branchLength', 'secondaryBranchLength']) out[key] = round((params[key] ?? 1) * (0.88 + r() * 0.26));
	return out;
}

const BENDS = ['leanX', 'leanZ', 'bendX', 'bendZ', 'upperBendX', 'upperBendZ', 'sCurveX', 'sCurveZ', 'tipCurlX', 'tipCurlZ', 'waveX', 'waveZ', 'twistRadius', 'profileTwistTurns'];
const HUES = ['canopyColorTop', 'canopyColorSide', 'canopyColorBottom'];

/** A colour turned round the colour wheel by degrees, its lightness and saturation kept. */
function turned(hex, degrees) {
	const r = ((hex >> 16) & 255) / 255;
	const g = ((hex >> 8) & 255) / 255;
	const b = (hex & 255) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;
	const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
	let h = !d ? 0 : max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	h = (((h * 60 + degrees) % 360) + 360) % 360;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	const [ro, go, bo] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h / 60) % 6];
	return (Math.round((ro + m) * 255) << 16) | (Math.round((go + m) * 255) << 8) | Math.round((bo + m) * 255);
}

/**
 * The sliders that work the same on every archetype, on top of its parameters.
 * crown: fuller or sparser, more clusters and bigger ones. gnarl: below 1 straightens the trunk toward a pole, above 1
 * adds bend on top of what it has, so a straight archetype can gnarl too. hue: turns the leaves round the colour wheel.
 */
export function shaped(params, { crown = 1, gnarl = 1, hue = 0 } = {}) {
	const out = { ...params };
	if (crown !== 1) {
		out.canopyClusterCount = Math.max(1, Math.round((params.canopyClusterCount ?? 3) * crown));
		out.canopyRadius = round((params.canopyRadius ?? 0.62) * Math.sqrt(crown));
	}
	if (gnarl !== 1) {
		for (const key of BENDS) {
			const x = params[key] ?? 0;
			out[key] = round(gnarl <= 1 ? x * gnarl : x + (x < 0 ? -1 : 1) * (gnarl - 1) * 0.22);
		}
	}
	if (hue) for (const key of HUES) if (params[key] !== undefined) out[key] = turned(params[key], hue);
	return out;
}
