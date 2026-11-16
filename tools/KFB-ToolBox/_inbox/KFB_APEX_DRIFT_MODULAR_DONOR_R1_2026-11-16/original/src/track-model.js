// Everything about a track as numbers, nothing drawn: the centreline with heights, the land round it, and quick questions
// ("how far from the road am I, and how far round the lap?"). Written to run in Node too, so tools can measure it.
import { fbm, smooth } from './noise.js';
import { layCentreline, STEP } from './spline.js';

export const CELL = 5; // metres between the land's heights
const MARGIN = 420; // land beyond the road's box
export const SHOULDER = 2.2; // gravel beside the road
export const SLOPE = 4.2; // the bank that takes the road's bed down to the land

export function modelTrack(def) {
	const { samples, length } = layCentreline(def.points);
	const m = samples.length;
	// Heights along the lap: whole cycles of waves, so the lap closes.
	samples.forEach((p) => {
		let y = 0;
		for (const [cycles, amp, phase] of def.elevation ?? []) y += amp * Math.sin((2 * Math.PI * cycles * p.s) / length + phase);
		p.y = y;
	});
	// The slope along the road, for the camera, the minimap and the autopilot.
	samples.forEach((p, i) => {
		const a = samples[(i + m - 3) % m];
		const b = samples[(i + 3) % m];
		p.grade = (b.y - a.y) / (6 * STEP);
	});

	// A hash of the samples, so "which part of the road is this" is a few look-ups.
	const HASH = 8;
	const buckets = new Map();
	const key = (i, j) => i * 100003 + j;
	samples.forEach((p, idx) => {
		const k = key(Math.floor(p.x / HASH), Math.floor(p.z / HASH));
		if (!buckets.has(k)) buckets.set(k, []);
		buckets.get(k).push(idx);
	});
	const near = { i: 0, t: 0, dist: 1e9, lat: 0, s: 0, y: 0, half: 0 };
	/** The nearest point on the road: fills and returns one shared object. reach: how many hash cells round to look. */
	function nearest(x, z, reach = 1) {
		const ci = Math.floor(x / HASH);
		const cj = Math.floor(z / HASH);
		near.dist = 1e9;
		for (let a = -reach; a <= reach; a++) {
			for (let b = -reach; b <= reach; b++) {
				const list = buckets.get(key(ci + a, cj + b));
				if (!list) continue;
				for (const idx of list) {
					const p = samples[idx];
					const q = samples[(idx + 1) % m];
					const ex = q.x - p.x;
					const ez = q.z - p.z;
					let t = ((x - p.x) * ex + (z - p.z) * ez) / (ex * ex + ez * ez);
					t = t < 0 ? 0 : t > 1 ? 1 : t;
					const dx = x - (p.x + ex * t);
					const dz = z - (p.z + ez * t);
					const d = Math.hypot(dx, dz);
					if (d < near.dist) {
						near.dist = d;
						near.i = idx;
						near.t = t;
						near.lat = dx * (p.sx + (q.sx - p.sx) * t) + dz * (p.sz + (q.sz - p.sz) * t);
					}
				}
			}
		}
		if (near.dist < 1e8) {
			const p = samples[near.i];
			const q = samples[(near.i + 1) % m];
			near.s = p.s + STEP * near.t;
			near.y = p.y + (q.y - p.y) * near.t;
			near.half = p.half + (q.half - p.half) * near.t;
		}
		return near;
	}

	// The land.
	let x0 = Infinity;
	let x1 = -Infinity;
	let z0 = Infinity;
	let z1 = -Infinity;
	for (const p of samples) {
		x0 = Math.min(x0, p.x);
		x1 = Math.max(x1, p.x);
		z0 = Math.min(z0, p.z);
		z1 = Math.max(z1, p.z);
	}
	const px = Math.floor((x0 - MARGIN) / CELL) * CELL;
	const pz = Math.floor((z0 - MARGIN) / CELL) * CELL;
	const nx = Math.ceil((x1 + MARGIN - px) / CELL);
	const nz = Math.ceil((z1 + MARGIN - pz) / CELL);
	const W = nx + 1;
	const H = nz + 1;
	const N = W * H;
	const dist = new Float32Array(N).fill(1e6);
	const seedY = new Float32Array(N);
	const seedHalf = new Float32Array(N);
	// Seed with exact distances close to the road.
	const REACH = SHOULDER + SLOPE + 36;
	const cells = Math.ceil(REACH / CELL);
	for (const p of samples) {
		const cx = Math.round((p.x - px) / CELL);
		const cz = Math.round((p.z - pz) / CELL);
		for (let j = Math.max(0, cz - cells); j <= Math.min(nz, cz + cells); j++) {
			for (let i = Math.max(0, cx - cells); i <= Math.min(nx, cx + cells); i++) {
				const d = Math.hypot(px + i * CELL - p.x, pz + j * CELL - p.z);
				const k = j * W + i;
				if (d < dist[k]) {
					dist[k] = d;
					seedY[k] = p.y;
					seedHalf[k] = p.half;
				}
			}
		}
	}
	// Spread it outwards (a chamfer pass each way), so every cell knows its distance and the height of the road it's nearest.
	const relax = (k, o, cost) => {
		const d = dist[o] + cost;
		if (d < dist[k]) {
			dist[k] = d;
			seedY[k] = seedY[o];
			seedHalf[k] = seedHalf[o];
		}
	};
	const D1 = CELL;
	const D2 = CELL * 1.4142;
	for (let j = 0; j < H; j++) {
		for (let i = 0; i < W; i++) {
			const k = j * W + i;
			if (i > 0) relax(k, k - 1, D1);
			if (j > 0) {
				relax(k, k - W, D1);
				if (i > 0) relax(k, k - W - 1, D2);
				if (i < nx) relax(k, k - W + 1, D2);
			}
		}
	}
	for (let j = nz; j >= 0; j--) {
		for (let i = nx; i >= 0; i--) {
			const k = j * W + i;
			if (i < nx) relax(k, k + 1, D1);
			if (j < nz) {
				relax(k, k + W, D1);
				if (i < nx) relax(k, k + W + 1, D2);
				if (i > 0) relax(k, k + W - 1, D2);
			}
		}
	}
	// The height of the land the road runs through, blurred so it doesn't step where two stretches of road face each other.
	let level = seedY.slice();
	const blur = (radius) => {
		const out = new Float32Array(N);
		const tmp = new Float32Array(N);
		for (let j = 0; j < H; j++) {
			for (let i = 0; i < W; i++) {
				let sum = 0;
				let n = 0;
				for (let a = -radius; a <= radius; a++) {
					const ii = Math.min(nx, Math.max(0, i + a));
					sum += level[j * W + ii];
					n++;
				}
				tmp[j * W + i] = sum / n;
			}
		}
		for (let j = 0; j < H; j++) {
			for (let i = 0; i < W; i++) {
				let sum = 0;
				let n = 0;
				for (let a = -radius; a <= radius; a++) {
					const jj = Math.min(nz, Math.max(0, j + a));
					sum += tmp[jj * W + i];
					n++;
				}
				out[j * W + i] = sum / n;
			}
		}
		level = out;
	};
	blur(5);
	blur(5);
	blur(4);
	const T = def.terrain ?? { amp: 0, rim: 0, scale: 400 };
	const padLevel = (cx, cz) => level[Math.round((cz - pz) / CELL) * W + Math.round((cx - px) / CELL)];
	const heights = new Float32Array(N);
	for (let j = 0; j < H; j++) {
		for (let i = 0; i < W; i++) {
			const k = j * W + i;
			const x = px + i * CELL;
			const z = pz + j * CELL;
			const d = dist[k];
			const reach = d - seedHalf[k];
			// Away from the road the land is its own: rolling, and rising into mountains.
			const rel = (fbm(x / T.scale, z / T.scale, 5) - 0.5) * T.amp * smooth(10, 220, d) + (fbm(x / (T.scale * 0.22) + 9, z / (T.scale * 0.22) - 4, 3) - 0.5) * T.amp * 0.16 * smooth(40, 200, d) + T.rim * Math.pow(smooth(50, 380, d), 1.4);
			const far = level[k] + rel;
			// A level bed under the road, shoulder and bank, then the land coming back.
			const bed = seedY[k] - 0.75;
			const t = smooth(SHOULDER + SLOPE + 1, REACH, reach);
			heights[k] = bed + (far - bed) * t;
			// Pads are flat discs of tarmac.
			for (const [cx, cz, r] of def.pads ?? []) {
				const pd = Math.hypot(x - cx, z - cz);
				if (pd < r + 30) heights[k] += (padLevel(cx, cz) - heights[k]) * (1 - smooth(r, r + 30, pd));
			}
		}
	}
	const heightAt = (x, z) => {
		const fx = Math.min(nx - 0.001, Math.max(0, (x - px) / CELL));
		const fz = Math.min(nz - 0.001, Math.max(0, (z - pz) / CELL));
		const i = Math.floor(fx);
		const j = Math.floor(fz);
		const u = fx - i;
		const v = fz - j;
		const k = j * W + i;
		return (heights[k] + (heights[k + 1] - heights[k]) * u) * (1 - v) + (heights[k + W] + (heights[k + W + 1] - heights[k + W]) * u) * v;
	};
	const slopeAt = (x, z) => Math.hypot(heightAt(x + CELL, z) - heightAt(x - CELL, z), heightAt(x, z + CELL) - heightAt(x, z - CELL)) / (2 * CELL);
	const distanceAt = (x, z) => {
		const i = Math.min(nx, Math.max(0, Math.round((x - px) / CELL)));
		const j = Math.min(nz, Math.max(0, Math.round((z - pz) / CELL)));
		return dist[j * W + i];
	};

	const pads = def.pads ?? [];
	const offroad = def.offroad ?? 'grass';
	/** The ground a wheel is on. */
	function surfaceAt(x, z) {
		for (const [cx, cz, r] of pads) if ((x - cx) * (x - cx) + (z - cz) * (z - cz) < r * r) return 'tarmac';
		const n = nearest(x, z);
		if (n.dist <= n.half) return 'tarmac';
		if (n.dist <= n.half + SHOULDER) return offroad === 'tarmac' ? 'tarmac' : 'gravel';
		return offroad;
	}
	/** Metres of the lap from a to b going forwards (0 to length). */
	const ahead = (a, b) => (((b - a) % length) + length) % length;

	let lo = Infinity;
	let hi = -Infinity;
	for (const h of heights) {
		if (h < lo) lo = h;
		if (h > hi) hi = h;
	}
	return { def, samples, length, count: m, nearest, nx, nz, W, H, px, pz, CELL, heights, heightAt, slopeAt, distanceAt, surfaceAt, pads, ahead, bounds: { x0, x1, z0, z1 }, min: lo, max: hi };
}
