// Seeded value noise from a table: the same land every time, in the browser and in Node.
const TABLE = new Float32Array(65536);
{
	let s = 271828;
	for (let i = 0; i < 65536; i++) {
		s = (s * 1664525 + 1013904223) >>> 0;
		TABLE[i] = s / 4294967296;
	}
}
export const smooth = (a, b, x) => {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};
export function noise(x, z) {
	const ix = Math.floor(x);
	const iz = Math.floor(z);
	const fx = x - ix;
	const fz = z - iz;
	const u = fx * fx * (3 - 2 * fx);
	const v = fz * fz * (3 - 2 * fz);
	const at = (a, b) => TABLE[(a * 251 + b * 65423) & 65535];
	const low = at(ix, iz) + (at(ix + 1, iz) - at(ix, iz)) * u;
	const high = at(ix, iz + 1) + (at(ix + 1, iz + 1) - at(ix, iz + 1)) * u;
	return low + (high - low) * v;
}
export function fbm(x, z, octaves = 4) {
	let sum = 0;
	let amp = 0.5;
	let f = 1;
	for (let i = 0; i < octaves; i++) {
		sum += amp * noise(x * f + i * 37.1, z * f - i * 11.3);
		amp *= 0.5;
		f *= 2.03;
	}
	return sum;
}
/** A small seeded random, for placing things the same way every time. */
export function rng(seed) {
	let s = seed >>> 0 || 1;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 4294967296;
	};
}
