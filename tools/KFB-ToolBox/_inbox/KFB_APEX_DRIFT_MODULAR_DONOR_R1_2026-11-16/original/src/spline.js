// A closed track from a handful of control points: a centripetal Catmull-Rom curve (it never loops or overshoots at a tight
// hairpin), resampled so every point is STEP metres from the next. Plain numbers, no three.js, so tools can measure it in Node.
export const STEP = 2;

function catmull(p0, p1, p2, p3, t) {
	const d = (a, b) => Math.max(1e-4, Math.pow(Math.hypot(a[0] - b[0], a[1] - b[1]), 0.5));
	const t0 = 0;
	const t1 = t0 + d(p0, p1);
	const t2 = t1 + d(p1, p2);
	const t3 = t2 + d(p2, p3);
	const u = t1 + (t2 - t1) * t;
	const lerp = (a, b, ta, tb) => [a[0] + ((b[0] - a[0]) * (u - ta)) / (tb - ta), a[1] + ((b[1] - a[1]) * (u - ta)) / (tb - ta), a[2] + ((b[2] - a[2]) * (u - ta)) / (tb - ta)];
	const a1 = lerp(p0, p1, t0, t1);
	const a2 = lerp(p1, p2, t1, t2);
	const a3 = lerp(p2, p3, t2, t3);
	const b1 = lerp(a1, a2, t0, t2);
	const b2 = lerp(a2, a3, t1, t3);
	return lerp(b1, b2, t1, t2);
}

/** points: [[x, z, halfWidth], ...] closed. Returns { samples, length } with x, z, half, s, and the heading and sideways unit vectors. */
export function layCentreline(points) {
	const n = points.length;
	const fine = [];
	for (let i = 0; i < n; i++) {
		const [a, b, c, d] = [points[(i + n - 1) % n], points[i], points[(i + 1) % n], points[(i + 2) % n]];
		for (let k = 0; k < 48; k++) fine.push(catmull(a, b, c, d, k / 48));
	}
	fine.push(fine[0]);
	const samples = [];
	let carried = 0;
	let s = 0;
	for (let i = 0; i < fine.length - 1; i++) {
		const a = fine[i];
		const b = fine[i + 1];
		const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
		while (carried <= len) {
			const t = carried / (len || 1);
			samples.push({ x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, half: a[2] + (b[2] - a[2]) * t, s: s + carried });
			carried += STEP;
		}
		carried -= len;
		s += len;
	}
	// Drop a last point that lands on the first.
	const first = samples[0];
	const last = samples[samples.length - 1];
	if (Math.hypot(first.x - last.x, first.z - last.z) < STEP * 0.5) samples.pop();
	const length = samples.length * STEP;
	const m = samples.length;
	samples.forEach((p, i) => {
		p.s = i * STEP;
		const a = samples[(i + m - 2) % m];
		const b = samples[(i + 2) % m];
		const len = Math.hypot(b.x - a.x, b.z - a.z) || 1;
		p.dx = (b.x - a.x) / len;
		p.dz = (b.z - a.z) / len;
		// Sideways: to the left of the way of travel, seen from above with +z towards the viewer.
		p.sx = p.dz;
		p.sz = -p.dx;
	});
	// Signed bend, 1 / radius, smoothed: positive curves towards the +side.
	const raw = samples.map((p, i) => {
		const a = samples[(i + m - 4) % m];
		const b = samples[(i + 4) % m];
		return (a.dx * b.dz - a.dz * b.dx) / (8 * STEP);
	});
	samples.forEach((p, i) => {
		let sum = 0;
		for (let j = -3; j <= 3; j++) sum += raw[(i + j + m) % m];
		p.bend = sum / 7;
	});
	return { samples, length };
}
