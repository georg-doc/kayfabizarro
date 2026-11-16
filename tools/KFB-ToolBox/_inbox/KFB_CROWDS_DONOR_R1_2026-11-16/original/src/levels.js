// The demo's three levels, small floating dioramas put together in code from Kenney's Fantasy Town Kit and Castle Kit
// (CC0). Each gives back what it draws and, kept apart, what the navmesh is built from: `walk` holds the ground with
// holes cut under whatever stands on it, plus the walls of those things (or, in the castle, the real walls and stairs).
// That's the one thing to copy to your own level: a mesh of what people walk on and bump into, without roofs or treetops.
import { BoxGeometry, BufferGeometry, CanvasTexture, Color, DoubleSide, ExtrudeGeometry, Float32BufferAttribute, Group, IcosahedronGeometry, Matrix4, Mesh, MeshStandardMaterial, Path, Quaternion, RepeatWrapping, Shape, ShapeGeometry, SRGBColorSpace, Vector3 } from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** A small seeded random, so each level is the same every time. */
function seeded(seed) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const up = new Vector3(0, 1, 0);

/** Pieces of a kit GLB, by name, each a list of { geometry, material }. */
export class Kit {
	constructor(gltf) {
		this.pieces = new Map();
		this.material = null;
		this.water = null;
		const root = gltf.scene;
		root.updateMatrixWorld(true);
		const inverse = new Matrix4();
		for (const piece of root.children) {
			inverse.copy(piece.matrixWorld).invert();
			const parts = [];
			piece.traverse((node) => {
				if (!node.isMesh) return;
				const g = new BufferGeometry();
				// Plain arrays: a kit's attributes may be interleaved, and those won't merge with anything else.
				const from = node.geometry.attributes;
				const plain = (attribute, size) => {
					const out = new Float32Array(from.position.count * size);
					if (attribute) {
						for (let i = 0; i < attribute.count; i++) {
							out[i * size] = attribute.getX(i);
							out[i * size + 1] = attribute.getY(i);
							if (size > 2) out[i * size + 2] = attribute.getZ(i);
						}
					}
					return new Float32BufferAttribute(out, size);
				};
				g.setAttribute('position', plain(from.position, 3));
				g.setAttribute('normal', plain(from.normal, 3));
				g.setAttribute('uv', plain(from.uv, 2));
				g.setIndex(node.geometry.index);
				const water = /water/i.test(node.material.name);
				if (water) this.water ??= node.material;
				else this.material ??= node.material;
				parts.push({ geometry: g.clone().applyMatrix4(new Matrix4().multiplyMatrices(inverse, node.matrixWorld)), water });
			});
			this.pieces.set(piece.name, parts);
		}
		const map = this.material.map;
		map.generateMipmaps = false;
		map.minFilter = map.magFilter = 1006; // linear: the map is colour swatches, and mips would bleed them together
		this.material.roughness = 0.82;
		this.material.metalness = 0;
		this.material.side = DoubleSide;
	}
}

const colourOf = (hex) => new Color(hex);

/** Collects a level's geometry. */
class Builder {
	constructor() {
		this.parts = new Map();
		this.walk = [];
		this.holes = [];
		this.rng = seeded(7);
		this.plain = new MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 });
	}

	add(material, geometry) {
		const list = this.parts.get(material) ?? [];
		list.push(geometry);
		this.parts.set(material, list);
	}

	/** A kit piece: `s` is its scale (a number, or [x, y, z]), `ry` its turn, `walk` whether it goes in the navmesh as it is. */
	put(kit, name, x, y, z, { ry = 0, s = 1, walk = false } = {}) {
		const parts = kit.pieces.get(name);
		if (!parts) throw new Error(`No kit piece ${name}`);
		const scale = Array.isArray(s) ? new Vector3(...s) : new Vector3(s, s, s);
		const m = new Matrix4().compose(new Vector3(x, y, z), new Quaternion().setFromAxisAngle(up, ry), scale);
		for (const part of parts) {
			const g = part.geometry.clone().applyMatrix4(m);
			this.add(part.water ? kit.water : kit.material, g);
			if (walk && !part.water) this.walk.push(strip(g));
		}
	}

	/** A plain coloured box, drawn. */
	box(x, y, z, w, h, d, colour, { ry = 0, walk = false } = {}) {
		const g = new BoxGeometry(w, h, d);
		g.rotateY(ry);
		g.translate(x, y + h / 2, z);
		this.tint(g, colour);
		this.add(this.plain, withoutUv(g));
		if (walk) this.walk.push(strip(g));
	}

	tint(g, colour, top) {
		const c = colourOf(colour);
		const t = top ? colourOf(top) : c;
		const pos = g.attributes.position;
		g.computeBoundingBox();
		const { min, max } = g.boundingBox;
		const colours = new Float32Array(pos.count * 3);
		const out = new Color();
		for (let i = 0; i < pos.count; i++) {
			out.copy(c).lerp(t, (pos.getY(i) - min.y) / (max.y - min.y || 1));
			out.toArray(colours, i * 3);
		}
		g.setAttribute('color', new Float32BufferAttribute(colours, 3));
	}

	/** Something people go around: its outline is cut from the floor and walled, so there's no island inside or on top. */
	solidRect(x0, z0, x1, z1) {
		this.solidOutline([
			[x0, z0],
			[x1, z0],
			[x1, z1],
			[x0, z1],
		]);
	}

	solidCircle(x, z, r, n = 10) {
		const points = [];
		for (let i = 0; i < n; i++) points.push([x + Math.cos((i / n) * Math.PI * 2) * r, z + Math.sin((i / n) * Math.PI * 2) * r]);
		this.solidOutline(points);
	}

	solidOutline(points) {
		this.holes.push(points);
		const pos = [];
		const H = 3;
		points.forEach(([x, z], i) => {
			const [x2, z2] = points[(i + 1) % points.length];
			pos.push(x, 0, z, x2, 0, z2, x2, H, z2, x, 0, z, x2, H, z2, x, H, z);
		});
		const g = new BufferGeometry();
		g.setAttribute('position', new Float32BufferAttribute(pos, 3));
		this.walk.push(g);
	}

	/** Puts it together: the drawn group, and the one mesh the navmesh is built from. */
	finish(extra) {
		const group = new Group();
		for (const [material, list] of this.parts) {
			const mesh = new Mesh(mergeGeometries(list.some((g) => !g.index) ? list.map(indexless) : list), material);
			mesh.castShadow = material.transparent !== true;
			mesh.receiveShadow = true;
			group.add(mesh);
		}
		if (extra) group.add(...extra);
		group.traverse((node) => {
			if (node.isMesh) node.matrixAutoUpdate = false;
		});
		const walk = new Mesh(mergeGeometries(this.walk.map(indexless)));
		walk.updateMatrixWorld(true);
		return { group, walk };
	}
}

/** Position only, for the navmesh. */
function strip(g) {
	const out = new BufferGeometry();
	out.setAttribute('position', g.attributes.position.clone());
	if (g.index) out.setIndex(g.index.clone());
	return out;
}

function indexless(g) {
	return g.index ? g.toNonIndexed() : g;
}

function withoutUv(g) {
	g.deleteAttribute('uv');
	return g;
}

function roundedRect(path, w, d, r, cx = 0, cz = 0) {
	// In the shape's plane y is -z, so the level's outlines read the same as its coordinates.
	const X0 = cx - w;
	const X1 = cx + w;
	const Y0 = -cz - d;
	const Y1 = -cz + d;
	path.moveTo(X0 + r, Y0);
	path.lineTo(X1 - r, Y0);
	path.absarc(X1 - r, Y0 + r, r, -Math.PI / 2, 0, false);
	path.lineTo(X1, Y1 - r);
	path.absarc(X1 - r, Y1 - r, r, 0, Math.PI / 2, false);
	path.lineTo(X0 + r, Y1);
	path.absarc(X0 + r, Y1 - r, r, Math.PI / 2, Math.PI, false);
	path.lineTo(X0, Y0 + r);
	path.absarc(X0 + r, Y0 + r, r, Math.PI, Math.PI * 1.5, false);
	return path;
}

function outlineHole(points) {
	const hole = new Path();
	points.forEach(([x, z], i) => {
		if (i) hole.lineTo(x, -z);
		else hole.moveTo(x, -z);
	});
	hole.closePath();
	return hole;
}

/**
 * The floating ground: a rounded slab whose top is `painted`, on a rough underside. `W` and `D` are half sizes.
 * `cuts` are { outer: [hw, hd, r], inner: [hw, hd, r] } rings cut right through (the castle's moat).
 */
function island(b, { W, D, r = 4, paint, rimColour = '#7c6f9b', rock = ['#8c82ad', '#463c66'], moat, seed = 3 }) {
	const S = 1536;
	const canvas = document.createElement('canvas');
	canvas.width = S;
	canvas.height = S;
	const ctx = canvas.getContext('2d');
	ctx.scale(S / (W * 2), S / (D * 2));
	ctx.translate(W, D);
	paint(ctx, seeded(seed));
	const map = new CanvasTexture(canvas);
	map.colorSpace = SRGBColorSpace;
	map.wrapS = map.wrapT = RepeatWrapping;
	map.repeat.set(1 / (W * 2), 1 / (D * 2));
	map.offset.set(0.5, 0.5);
	map.anisotropy = 8;
	const top = new MeshStandardMaterial({ map, roughness: 0.92, metalness: 0 });
	const side = new MeshStandardMaterial({ color: rimColour, roughness: 0.9 });

	const shape = roundedRect(new Shape(), W, D, r);
	const parts = [shape];
	if (moat) {
		shape.holes.push(roundedRect(new Path(), moat.outer[0], moat.outer[1], moat.outer[2]));
		parts.push(roundedRect(new Shape(), moat.inner[0], moat.inner[1], moat.inner[2]));
	}
	const depth = 0.9;
	const g = new ExtrudeGeometry(parts, { depth, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.14, bevelSegments: 2, steps: 1, curveSegments: 10 });
	g.translate(0, 0, -depth - 0.14);
	g.rotateX(-Math.PI / 2);
	const ground = new Mesh(g, [top, side]);
	ground.receiveShadow = true;
	ground.castShadow = false;

	// The rough underside: rings of points, each lower ring smaller and more broken.
	const rand = seeded(seed + 11);
	const rings = 6;
	const around = 56;
	const pos = [];
	const col = [];
	const a = new Color(rock[0]);
	const c = new Color(rock[1]);
	const ringAt = (k) => {
		const f = k / (rings - 1);
		const shrink = 1 - f ** 1.4 * 0.86;
		const y = -0.75 - f ** 0.8 * Math.min(W, D) * 0.62;
		const list = [];
		for (let i = 0; i < around; i++) {
			const t = (i / around) * Math.PI * 2;
			const cs = Math.cos(t);
			const sn = Math.sin(t);
			// a rounded square outline
			const p = 7;
			const q = (Math.abs(cs) ** p + Math.abs(sn) ** p) ** (-1 / p);
			const wob = k ? 1 + (rand() - 0.5) * 0.14 * (0.4 + f) : 1;
			list.push([cs * q * W * shrink * wob, y + (k ? (rand() - 0.5) * 1.4 : 0), sn * q * D * shrink * wob]);
		}
		return list;
	};
	let prev = ringAt(0);
	for (let k = 1; k < rings; k++) {
		const ring = ringAt(k);
		const cf = (k - 1) / (rings - 1);
		const cf2 = k / (rings - 1);
		for (let i = 0; i < around; i++) {
			const j = (i + 1) % around;
			const tri = [prev[i], ring[i], ring[j], prev[i], ring[j], prev[j]];
			tri.forEach((p, n) => {
				pos.push(...p);
				const low = n === 1 || n === 2 || n === 4 ? cf2 : cf;
				const t = new Color().copy(a).lerp(c, low);
				col.push(t.r, t.g, t.b);
			});
		}
		prev = ring;
	}
	const under = new BufferGeometry();
	under.setAttribute('position', new Float32BufferAttribute(pos, 3));
	under.setAttribute('color', new Float32BufferAttribute(col, 3));
	under.computeVertexNormals();
	const rockMesh = new Mesh(under, new MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
	rockMesh.receiveShadow = true;
	return [ground, rockMesh];
}

/** What's walked on: the slab's outline, in from the edge, with every hole. */
function walkFloor(b, W, D, r, { inset = 0.15, moat } = {}) {
	const shape = roundedRect(new Shape(), W - inset, D - inset, Math.max(0.2, r - inset));
	const shapes = [shape];
	const put = (outer, inner) => {
		outer.holes.push(inner);
	};
	if (moat) {
		put(shape, roundedRect(new Path(), moat.outer[0] + inset, moat.outer[1] + inset, moat.outer[2]));
		shapes.push(roundedRect(new Shape(), moat.inner[0] - inset, moat.inner[1] - inset, Math.max(0.2, moat.inner[2] - inset)));
	}
	for (const points of b.holes) {
		const [x, z] = points[0];
		const owner = moat && Math.abs(x) < moat.inner[0] && Math.abs(z) < moat.inner[1] ? shapes[1] : shape;
		owner.holes.push(outlineHole(points));
	}
	const g = new ShapeGeometry(shapes, 8);
	g.rotateX(-Math.PI / 2);
	b.walk.push(strip(g));
}

// ---- Paint: the ground's colours, loose and hand-placed, never in rows

function paintGrass(ctx, rand, W, D, base = '#8fc27a') {
	ctx.fillStyle = base;
	ctx.fillRect(-W, -D, W * 2, D * 2);
	const blots = ['#7fb670', '#a2cd83', '#88bc78', '#b0d48b', '#74ad6b'];
	for (let i = 0; i < 260; i++) {
		const x = (rand() - 0.5) * W * 2;
		const z = (rand() - 0.5) * D * 2;
		const r = 0.6 + rand() * rand() * 5;
		const g = ctx.createRadialGradient(x, z, 0, x, z, r);
		const colour = blots[Math.floor(rand() * blots.length)];
		g.addColorStop(0, `${colour}80`);
		g.addColorStop(1, `${colour}00`);
		ctx.fillStyle = g;
		ctx.fillRect(x - r, z - r, r * 2, r * 2);
	}
	// Short strokes of lighter and darker grass, and a few flowers.
	ctx.lineCap = 'round';
	for (let i = 0; i < 2600; i++) {
		const x = (rand() - 0.5) * W * 2;
		const z = (rand() - 0.5) * D * 2;
		ctx.strokeStyle = rand() < 0.5 ? 'rgba(70,130,70,0.28)' : 'rgba(200,226,140,0.3)';
		ctx.lineWidth = 0.035 + rand() * 0.03;
		ctx.beginPath();
		ctx.moveTo(x, z);
		ctx.lineTo(x + (rand() - 0.5) * 0.28, z - 0.08 - rand() * 0.22);
		ctx.stroke();
	}
	const flowers = ['#fff6e0', '#ffe07a', '#f7a8c4', '#d9c4ff'];
	for (let i = 0; i < 90; i++) {
		const cx = (rand() - 0.5) * W * 2;
		const cz = (rand() - 0.5) * D * 2;
		const colour = flowers[Math.floor(rand() * flowers.length)];
		const n = 3 + Math.floor(rand() * 7);
		ctx.fillStyle = colour;
		for (let k = 0; k < n; k++) {
			ctx.beginPath();
			ctx.arc(cx + (rand() - 0.5) * 1.1, cz + (rand() - 0.5) * 1.1, 0.04 + rand() * 0.035, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

/** Flagstones across a rounded area: uneven stones, each its own shade, with soft edges to the grass. */
function paintStones(ctx, rand, x0, z0, x1, z1, { size = 1.15, r = 1.8, base = '#a9a3c9', shades = ['#b9b4d6', '#b0aace', '#c2bddc', '#a6a0c6', '#bab1d0'] } = {}) {
	ctx.save();
	ctx.beginPath();
	ctx.roundRect(x0, z0, x1 - x0, z1 - z0, r);
	ctx.shadowColor = 'rgba(60,70,60,0.55)';
	ctx.shadowBlur = 40;
	ctx.fillStyle = base;
	ctx.fill();
	ctx.shadowBlur = 0;
	ctx.clip();
	let z = z0;
	let row = 0;
	while (z < z1) {
		const h = size * (0.78 + rand() * 0.42);
		let x = x0 - rand() * size * (row % 2 ? 0.9 : 0.4);
		while (x < x1) {
			const w = size * (0.8 + rand() * 0.8);
			const g = 0.05;
			const j = () => (rand() - 0.5) * 0.09;
			ctx.fillStyle = shades[Math.floor(rand() * shades.length)];
			ctx.beginPath();
			ctx.moveTo(x + g + j(), z + g + j());
			ctx.lineTo(x + w - g + j(), z + g + j());
			ctx.lineTo(x + w - g + j(), z + h - g + j());
			ctx.lineTo(x + g + j(), z + h - g + j());
			ctx.closePath();
			ctx.fill();
			x += w;
		}
		z += h;
		row++;
	}
	ctx.restore();
}

function paintPath(ctx, points, width, colour = '#c9bfa6') {
	ctx.save();
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.strokeStyle = colour;
	ctx.lineWidth = width;
	ctx.shadowColor = 'rgba(70,80,60,0.5)';
	ctx.shadowBlur = 26;
	ctx.beginPath();
	points.forEach(([x, z], i) => {
		if (i) ctx.lineTo(x, z);
		else ctx.moveTo(x, z);
	});
	ctx.stroke();
	ctx.restore();
}

// ---- The market square

const T = 2.5; // a storey and a wall's width, in metres: the town kit's unit

/** Turn that puts a wall piece (made for a cell's +x edge) on each edge of a cell. */
const EDGE = { e: 0, n: Math.PI / 2, w: Math.PI, s: -Math.PI / 2 };

function house(b, kit, tx, tz, w, d, floors, { door = 's', steep = false, timber = true, doorAt = 0, chimney = true, seed = 1 } = {}) {
	const rand = seeded(seed * 991);
	const x0 = tx * T;
	const z0 = tz * T;
	const windows = ['wall-window-shutters', 'wall-window-glass', 'wall-window-small'];
	const upper = ['wall-wood-window-shutters', 'wall-wood-window-glass', 'wall-wood-detail-cross', 'wall-wood-detail-diagonal', 'wall-wood'];
	for (let f = 0; f < floors; f++) {
		const y = f * T;
		for (let i = 0; i < w; i++) {
			for (let j = 0; j < d; j++) {
				const cx = x0 + (i + 0.5) * T;
				const cz = z0 + (j + 0.5) * T;
				const edges = [];
				if (i === 0) edges.push('w');
				if (i === w - 1) edges.push('e');
				if (j === 0) edges.push('n');
				if (j === d - 1) edges.push('s');
				for (const e of edges) {
					let piece;
					const along = e === 'n' || e === 's' ? i : j;
					if (f === 0) {
						if (e === door && along === doorAt) piece = 'wall-door';
						else piece = rand() < 0.55 ? windows[Math.floor(rand() * windows.length)] : 'wall';
					} else if (timber) {
						piece = upper[Math.floor(rand() * upper.length)];
					} else {
						piece = rand() < 0.6 ? windows[Math.floor(rand() * windows.length)] : 'wall';
					}
					b.put(kit, piece, cx, y, cz, { ry: EDGE[e], s: T });
				}
			}
		}
	}
	// One long roof piece over the whole house, its ridge along the longer side.
	const top = floors * T;
	const along = w >= d;
	const long = (along ? w : d) * T;
	const short = (along ? d : w) * T;
	const name = steep ? 'roof-high-gable' : 'roof-gable';
	const rise = steep ? short * 0.72 : short * 0.62;
	const height = steep ? 1.11 : 0.57;
	b.put(kit, name, x0 + (w * T) / 2, top - 0.02, z0 + (d * T) / 2, { ry: along ? 0 : Math.PI / 2, s: [long, rise / height, short] });
	if (chimney) {
		const cx = x0 + (w * T) * (0.25 + rand() * 0.5);
		const cz = z0 + (d * T) * (along ? 0.3 : 0.5);
		b.put(kit, 'chimney', cx - 0.8, top + rise * 0.34, cz, { s: [T, T * 1.3, T] });
	}
	b.solidRect(x0, z0, x0 + w * T, z0 + d * T);
}

function tree(b, kit, name, x, z, s = T, r = 0.45) {
	b.put(kit, name, x, 0, z, { ry: b.rng() * Math.PI * 2, s: s * (0.88 + b.rng() * 0.26) });
	b.solidCircle(x, z, r, 7);
}

function rock(b, kit, name, x, z, s, r) {
	b.put(kit, name, x, -0.02, z, { ry: b.rng() * Math.PI * 2, s });
	b.solidCircle(x, z, r, 8);
}

export function market(town) {
	const b = new Builder();
	const W = 19;
	const D = 19;
	const R = 5;
	const plazaW = 8.2;
	// The houses: x, z, width and depth in tiles.
	house(b, town, -7, -7, 3, 2, 2, { door: 's', doorAt: 1, seed: 1 });
	house(b, town, -3, -7, 2, 2, 2, { door: 's', steep: true, seed: 2 });
	house(b, town, 0, -7, 3, 2, 2, { door: 's', doorAt: 2, seed: 3, timber: false });
	house(b, town, 4, -6.6, 2, 2, 2, { door: 's', steep: true, seed: 4 });
	house(b, town, -7, -3.6, 2, 3, 2, { door: 'e', doorAt: 1, seed: 5 });
	house(b, town, 5, -3, 2, 2, 2, { door: 'w', steep: true, seed: 6 });
	house(b, town, -7, 0.6, 2, 2, 1, { door: 'e', seed: 7, chimney: false });
	house(b, town, 5, 0.4, 2, 2, 1, { door: 'w', doorAt: 1, seed: 8 });

	// The square: a fountain, stalls and carts to flow around.
	b.put(town, 'fountain-round-detail', 0, 0, 0, { s: T * 1.05 });
	b.solidCircle(0, 0, 2.7, 12);
	const stalls = [
		['stall-red', -5.6, -4.8, 0.5],
		['stall-green', -2.2, -5.1, 0.1],
		['stall-red', 5.2, -5.3, -0.3],
		['stall-green', 5.9, 2.7, -1.5],
		['stall-red', -5.6, 4, 1.4],
	];
	for (const [name, x, z, ry] of stalls) {
		b.put(town, name, x, 0, z, { ry, s: T * 1.05 });
		const c = Math.cos(ry);
		const n = Math.sin(ry);
		const hx = 1.5;
		const hz = 1.1;
		b.solidOutline([
			[x - c * hx - n * hz, z + n * hx - c * hz],
			[x + c * hx - n * hz, z - n * hx - c * hz],
			[x + c * hx + n * hz, z - n * hx + c * hz],
			[x - c * hx + n * hz, z + n * hx + c * hz],
		]);
	}
	b.put(town, 'cart', 4.2, 0, 5.2, { ry: 0.7, s: T * 1.1 });
	b.solidCircle(4.2, 5.2, 1.5, 8);
	b.put(town, 'cart-high', -8.7, 0, -1.2, { ry: 2.2, s: T * 1.1 });
	b.solidCircle(-8.7, -1.2, 1.3, 8);
	for (const [x, z] of [[-3.6, 7.4], [3.8, -7.4 + 15.2], [8.3, -5.6], [-8.2, 3.9]]) {
		b.put(town, 'lantern', x, 0, z, { s: T });
		b.solidCircle(x, z, 0.3, 6);
	}
	// Round the edge: trees and rocks, in loose clumps.
	const trees = [
		['tree-high-round', -15.8, -10.9], ['tree-high', -16.4, -14.4], ['tree-high-crooked', -11.5, -15.9], ['tree', -5.5, -16.5], ['tree-high', 1.8, -16.1], ['tree-high-round', 7.8, -16.5],
		['tree-high-crooked', 12.4, -15.2], ['tree-high', 15.9, -11.7], ['tree-crooked', 14.1, -14.8], ['tree-high-round', 16.4, -2.9], ['tree', 16, 2.1], ['tree-high', 16.5, 9.4],
		['tree-crooked', 14.4, 13.4], ['tree-high-round', -16.5, 8.9], ['tree', -15.4, 13.6], ['tree-high-crooked', -11.1, 15.8], ['tree-crooked', 8.4, 16.1], ['tree', -16.3, -2.6], ['tree-high-round', 11.3, 11.7],
		['tree', 9.3, -10.9], ['tree-high', -11.7, 10.6],
	];
	for (const [name, x, z] of trees) tree(b, town, name, x, z);
	const rocks = [['rock-large', 13, 16.1, 1.5, 1.1], ['rock-small', 15.8, 15.2, 1.4, 0.4], ['rock-wide', -16.2, 15.8, 1.5, 0.8], ['rock-small', -13.2, 16.6, 1.3, 0.4], ['rock-small', 17, -7.3, 1.5, 0.4], ['rock-small', -8, 15.9, 1.2, 0.35]];
	for (const [name, x, z, s, r] of rocks) rock(b, town, name, x, z, s, r);

	const paint = (ctx, rand) => {
		paintGrass(ctx, rand, W, D);
		paintPath(ctx, [[0, 8], [1.2, 12], [-0.6, 19.5]], 4.2);
		paintPath(ctx, [[-8, -4], [-10.5, -8.5], [-16, -8.2]], 2.6);
		paintPath(ctx, [[8, -4], [10.8, -9], [17, -7.5]], 2.6);
		paintPath(ctx, [[-1.5, -8], [-1.9, -17.5]], 2.2);
		paintStones(ctx, rand, -plazaW - 2, -plazaW - 1.5, plazaW + 2, plazaW + 0.4, { base: '#b8afc4', shades: ['#d4cdd9', '#cbc3d2', '#dcd5de', '#c5bdcd', '#d1c8cf'] });
		// The fountain's ring
		ctx.strokeStyle = 'rgba(120,112,160,0.55)';
		ctx.lineWidth = 0.1;
		ctx.beginPath();
		ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
		ctx.stroke();
	};
	const pieces = island(b, { W, D, r: R, paint, seed: 5 });
	walkFloor(b, W, D, R);
	const { group, walk } = b.finish(pieces);
	return {
		id: 'market', name: 'Market square', group, walk, home: { x: 0, y: 0, z: 6 }, size: Math.max(W, D),
		// Round the fountain, through the alleys, out along the path.
		tour: [[-5, 0, 1.5], [1, 0, -5.8], [11, 0, -9], [6, 0, 3.5], [0, 0, 13], [-11, 0, -8.5]],
		framing: { target: [0, -0.5, 0.6], yaw: 0.46, pitch: 0.7, distance: 66 },
	};
}

// ---- The castle

const C = 3; // the castle kit's unit, in metres

export function castle(keep, town) {
	const b = new Builder();
	const W = 20;
	const D = 20;
	const R = 5;
	const half = 4; // tiles from the middle to the wall's centre line
	const ring = half * C + C / 2;
	const moat = { outer: [ring + 3.8, ring + 3.8, 1.8], inner: [ring + 0.7, ring + 0.7, 0.8] };
	const gapAt = 0;
	const put = (name, i, j, opts = {}) => b.put(keep, name, i * C, opts.y ?? 0, j * C, { s: C, walk: true, ...opts });
	// The walls: a walkway all the way round on top, with a gap in the south wall for the gate.
	for (let n = -half + 1; n < half; n++) {
		// wall-half has its battlements on one side: here always the outer one, so the walkway opens onto the ramps.
		put('wall-half', -half, n);
		put('wall-half', half, n, { ry: Math.PI });
		put('wall-half', n, -half, { ry: -Math.PI / 2 });
		if (n !== gapAt) put('wall-half', n, half, { ry: Math.PI / 2 });
	}
	for (const [i, j, ry] of [[-half, -half, Math.PI / 2], [half, -half, 0], [half, half, -Math.PI / 2], [-half, half, Math.PI]]) put('wall-corner', i, j, { ry });
	// The gate: two towers beside the gap, their roofs well above the walkway.
	for (const s of [-1, 1]) {
		b.put(keep, 'tower-base', s * C, 0, half * C, { s: C * 1.14 });
		b.put(keep, 'tower-top', s * C, 1.31 * C * 1.14, half * C, { s: C * 1.14 });
		b.solidRect(s * C - C * 0.57, half * C - C * 0.57, s * C + C * 0.57, half * C + C * 0.57);
		b.put(keep, 'flag', s * C, 1.31 * C * 1.14 + 0.1, half * C, { s: C * 0.8, ry: 0.2 });
	}
	// The ramps up to the walkway: each climbs along an inside wall.
	const walkway = 1.135 * C;
	const rampLong = 7;
	const rampWidth = 2.1;
	const ramp = (x, z, ry) => {
		b.put(keep, 'stairs-stone-square', x, 0, z, { ry, s: [rampWidth / 0.25, walkway / 0.67, rampLong / 0.82], walk: true });
	};
	ramp(-half * C + C / 2 + rampWidth / 2, 3, Math.PI);
	ramp(half * C - C / 2 - rampWidth / 2, 3, Math.PI);

	// The keep, in the north of the courtyard.
	const towerAt = (name, i, j, y, ry = 0) => b.put(keep, name, i * C, y, j * C, { s: C, ry });
	for (const [i, j] of [[-0.5, -2.2], [0.5, -2.2]]) {
		towerAt('tower-square-base', i, j, 0);
		towerAt('tower-square-mid-windows', i, j, C);
		towerAt('tower-square-mid', i, j, C * 2);
		towerAt(i < 0 ? 'tower-square-top-roof-high' : 'tower-square-top-roof', i, j, C * 3);
	}
	b.solidRect(-C, -2.7 * C, C, -1.7 * C);
	b.put(keep, 'flag-wide', -0.5 * C, C * 4.35, -2.2 * C, { s: C * 0.9, ry: 0.4 });
	// In the courtyard: siege engines, a well and trees to go around.
	b.put(keep, 'siege-catapult', -3.6, 0.55, -3, { s: C * 0.92, ry: 2.5 });
	b.solidCircle(-3.6, -3, 2.2, 8);
	b.put(keep, 'siege-ballista', 6.8, 0.4, 3.6, { s: C * 0.82, ry: -2.4 });
	b.solidCircle(6.8, 3.6, 1.4, 8);
	for (const [name, x, z] of [['tree-large', -5.4, -2.4], ['tree-small', 6, -1.5], ['tree-large', 7, -4.6]]) {
		b.put(keep, name, x, 0, z, { s: C * 0.9, ry: b.rng() * 6 });
		b.solidCircle(x, z, 0.45, 7);
	}
	b.put(town, 'fountain-round', 0, 0, 2.2, { s: T * 0.8 });
	b.solidCircle(0, 2.2, 2, 12);

	// The bridge: a plank deck over the moat, with rails.
	const deckZ0 = ring + 0.4;
	const deckZ1 = ring + 4.2;
	const deckLength = deckZ1 - deckZ0;
	const zc = (deckZ0 + deckZ1) / 2;
	for (let i = 0; i < 13; i++) {
		const z = deckZ0 + ((i + 0.5) / 13) * deckLength;
		b.box(0, -0.08, z, 2.9 + (i % 3) * 0.05, 0.1, deckLength / 13 - 0.03, i % 2 ? '#a87150' : '#b57c58');
	}
	b.box(0, -0.16, zc, 2.8, 0.14, deckLength, '#7d5339', { walk: true });
	for (const s of [-1, 1]) {
		b.box(s * 1.45, 0.02, zc, 0.12, 1, deckLength, '#8f5f42');
		for (const t of [0, 0.5, 1]) b.box(s * 1.45, -0.3, deckZ0 + t * deckLength, 0.2, 1.4, 0.2, '#6f4a33');
	}
	b.solidRect(1.5, deckZ0, 1.62, deckZ1);
	b.solidRect(-1.62, deckZ0, -1.5, deckZ1);

	// Outside: trees and rocks along the bank.
	for (const [name, x, z] of [['tree-large', -18, -15], ['tree-small', -14, -18], ['tree-large', 18, -13], ['tree-small', 15.5, -18.2], ['tree-large', -18.2, 10], ['tree-large', 18.2, 11], ['tree-small', 8, 18.2], ['tree-large', -7.4, 18.1], ['tree-small', -18.6, -4], ['tree-small', 18.7, -3]]) {
		b.put(keep, name, x, 0, z, { s: C * (0.8 + b.rng() * 0.3), ry: b.rng() * 6 });
		b.solidCircle(x, z, 0.5, 7);
	}
	for (const [name, x, z, s] of [['rocks-large', -13, 18.2, 2.4], ['rocks-small', 13.2, 18.4, 2.6], ['rocks-small', 18.6, 4, 2.2], ['rocks-large', -18.4, 2, 2]]) {
		b.put(keep, name, x, -0.02, z, { s, ry: b.rng() * 6 });
		b.solidCircle(x, z, s * 0.42, 7);
	}

	const paint = (ctx, rand) => {
		paintGrass(ctx, rand, W, D, '#92bf78');
		paintPath(ctx, [[0, ring + 3], [0.6, 22]], 4);
		paintStones(ctx, rand, -ring, -ring, ring, ring, { size: 1.5, r: 1, base: '#c6b6a7', shades: ['#d1c1b1', '#c9b9a9', '#d9cab9', '#bfaf9f', '#cfbfa7'] });
	};
	const pieces = island(b, { W, D, r: R, paint, moat, rimColour: '#7c6a8c', seed: 9 });
	const water = new Mesh(
		new BoxGeometry(moat.outer[0] * 2, 0.1, moat.outer[1] * 2).translate(0, -0.72, 0),
		new MeshStandardMaterial({ color: '#7cc7dd', roughness: 0.2, metalness: 0 }),
	);
	water.receiveShadow = true;
	walkFloor(b, W, D, R, { moat });
	const { group, walk } = b.finish([...pieces, water]);
	return {
		id: 'castle', name: 'Castle walls', group, walk, home: { x: 0, y: 0, z: 0 }, size: Math.max(W, D),
		// Across the courtyard, up onto the wall, back down and out over the bridge.
		tour: [[6.5, 0, -1], [12, 3.4, -6], [-12, 3.4, 2], [-1, 0, 6.5], [0, 0, 18.5], [1, 0, -1]],
		framing: { target: [0, -0.5, 0.8], yaw: 0.42, pitch: 0.76, distance: 70 },
	};
}

// ---- The hedge maze

export function maze(town) {
	const b = new Builder();
	const n = 7; // cells across
	const lane = 3.3;
	const thick = 1;
	const pitch = lane + thick;
	const span = n * pitch + thick;
	const W = span / 2 + 2.6;
	const D = W;
	const R = 4.5;
	const rand = seeded(23);
	// The grid: walls between cells, carved by a random walk, then a few more opened so there are other ways round.
	const right = Array.from({ length: n }, () => new Array(n).fill(true));
	const below = Array.from({ length: n }, () => new Array(n).fill(true));
	const seen = Array.from({ length: n }, () => new Array(n).fill(false));
	const stack = [[3, 3]];
	seen[3][3] = true;
	while (stack.length) {
		const [i, j] = stack[stack.length - 1];
		const next = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, c]) => [i + a, j + c]).filter(([a, c]) => a >= 0 && c >= 0 && a < n && c < n && !seen[a][c]);
		if (!next.length) {
			stack.pop();
			continue;
		}
		const [a, c] = next[Math.floor(rand() * next.length)];
		if (a !== i) right[Math.min(a, i)][j] = false;
		else below[i][Math.min(c, j)] = false;
		seen[a][c] = true;
		stack.push([a, c]);
	}
	for (let k = 0; k < 13; k++) {
		const i = Math.floor(rand() * (n - 1));
		const j = Math.floor(rand() * (n - 1));
		if (rand() < 0.5) right[i][j] = false;
		else below[i][j] = false;
	}
	// The garden in the middle: three cells square, open.
	for (let i = 2; i <= 4; i++) {
		for (let j = 2; j <= 4; j++) {
			if (i < 4) right[i][j] = false;
			if (j < 4) below[i][j] = false;
		}
	}
	// In blocks: an odd row or column is a lane, an even one a wall. Runs of wall blocks become hedges that never overlap.
	const size = 2 * n + 1;
	const wall = (r, c) => {
		if (r % 2 === 0 && c % 2 === 0) return !(r > 4 && r < 10 && c > 4 && c < 10); // posts, except in the garden
		if (r === 0) return !(c === 7); // the north gap
		if (r === size - 1) return !(c === 7); // the south gap
		if (c === 0 || c === size - 1) return !(r === 7); // east and west gaps
		if (r % 2 === 1 && c % 2 === 0) return right[c / 2 - 1][(r - 1) / 2];
		if (r % 2 === 0 && c % 2 === 1) return below[(c - 1) / 2][r / 2 - 1];
		return false;
	};
	const edge = (k) => -span / 2 + Math.floor(k / 2) * pitch + (k % 2 ? thick : 0);
	const width = (k) => (k % 2 ? lane : thick);
	const used = Array.from({ length: size }, () => new Array(size).fill(false));
	const hedges = [];
	const stone = [];
	const leaves = [];
	const H = 1.5;
	const hedge = (x0, z0, x1, z1) => {
		const w = x1 - x0;
		const d = z1 - z0;
		const body = new RoundedBoxGeometry(w, H - 0.26, d, 2, Math.min(0.2, Math.min(w, d) * 0.4));
		body.translate(x0 + w / 2, 0.26 + (H - 0.26) / 2, z0 + d / 2);
		hedges.push(withoutUv(body));
		const base = new BoxGeometry(w + 0.08, 0.28, d + 0.08);
		base.translate(x0 + w / 2, 0.14, z0 + d / 2);
		stone.push(withoutUv(base));
		b.solidRect(x0, z0, x1, z1);
		// Loose clumps of leaves, so no hedge top is a ruler's edge.
		const count = Math.ceil((w * d) / 0.3);
		for (let i = 0; i < count; i++) {
			const r = 0.16 + rand() * 0.2;
			const clump = new IcosahedronGeometry(r, 1);
			clump.scale(1, 0.5 + rand() * 0.3, 1);
			clump.rotateY(rand() * 6);
			clump.translate(x0 + rand() * w, H - 0.06 + (rand() - 0.5) * 0.06, z0 + rand() * d);
			leaves.push(withoutUv(clump));
		}
	};
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			if (!wall(r, c) || used[r][c]) continue;
			// A run east, or if it's a single block, a run south.
			let c2 = c;
			while (c2 + 1 < size && wall(r, c2 + 1) && !used[r][c2 + 1]) c2++;
			let r2 = r;
			if (c2 === c) while (r2 + 1 < size && wall(r2 + 1, c) && !used[r2 + 1][c]) r2++;
			for (let a = r; a <= r2; a++) for (let e = c; e <= c2; e++) used[a][e] = true;
			hedge(edge(c), edge(r), edge(c2) + width(c2), edge(r2) + width(r2));
		}
	}
	const green = new MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
	const hedgeGeometry = mergeGeometries(hedges);
	b.tint(hedgeGeometry, '#3f9068', '#62bd82');
	b.add(green, hedgeGeometry);
	const stoneGeometry = mergeGeometries(stone);
	b.tint(stoneGeometry, '#8e88b4', '#b6b1d6');
	b.add(green, stoneGeometry);
	const leafGeometry = mergeGeometries(leaves);
	const shades = new Float32Array(leafGeometry.attributes.position.count * 3);
	const leafColours = ['#6ec78c', '#62bd82', '#7dd096', '#5ab27a', '#8bd79f'].map(colourOf);
	const perClump = leaves[0].attributes.position.count;
	for (let i = 0; i < leafGeometry.attributes.position.count; i += perClump) {
		const col = leafColours[Math.floor(rand() * leafColours.length)];
		for (let k = 0; k < perClump; k++) col.toArray(shades, (i + k) * 3);
	}
	leafGeometry.setAttribute('color', new Float32BufferAttribute(shades, 3));
	leafGeometry.computeVertexNormals();
	b.add(new MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }), leafGeometry);

	// The middle: a fountain and two trees.
	b.put(town, 'fountain-round-detail', 0, 0, 0, { s: T * 0.92 });
	b.solidCircle(0, 0, 2.4, 12);
	for (const [name, x, z] of [['tree-high-round', -4.4, -4.3], ['tree-high-round', 4.5, 4.4]]) tree(b, town, name, x, z, T * 0.85);
	for (const [x, z] of [[-4.4, 4.3], [4.4, -4.4]]) {
		b.put(town, 'lantern', x, 0, z, { s: T * 0.9 });
		b.solidCircle(x, z, 0.3, 6);
	}
	// Round the outside: a few trees.
	const out = span / 2 + 1.3;
	for (const [name, x, z] of [['tree-crooked', -out, -9], ['tree', -out, 8.4], ['tree-crooked', out, -7.4], ['tree', out, 10.2], ['tree', -6.2, -out], ['tree-crooked', 8.8, -out], ['tree', 6.4, out], ['tree-crooked', -9, out]]) tree(b, town, name, x, z, T * 0.8);

	const paint = (ctx, r) => {
		paintGrass(ctx, r, W, D, '#94c47c');
		// Pale gravel in the lanes
		ctx.fillStyle = '#d9cfb7';
		ctx.shadowColor = 'rgba(60,70,60,0.35)';
		ctx.shadowBlur = 14;
		ctx.beginPath();
		ctx.roundRect(-span / 2 + 0.3, -span / 2 + 0.3, span - 0.6, span - 0.6, 0.5);
		ctx.fill();
		ctx.shadowBlur = 0;
		for (let i = 0; i < 6400; i++) {
			const x = (r() - 0.5) * span;
			const z = (r() - 0.5) * span;
			ctx.fillStyle = r() < 0.5 ? 'rgba(160,145,120,0.28)' : 'rgba(250,244,226,0.36)';
			ctx.beginPath();
			ctx.arc(x, z, 0.02 + r() * 0.05, 0, Math.PI * 2);
			ctx.fill();
		}
		paintStones(ctx, r, -6.7, -6.7, 6.7, 6.7, { size: 1, r: 1.4, base: '#b8afc4', shades: ['#d4cdd9', '#cbc3d2', '#dcd5de', '#c5bdcd'] });
	};
	const pieces = island(b, { W, D, r: R, paint, seed: 14 });
	walkFloor(b, W, D, R);
	const { group, walk } = b.finish(pieces);
	return {
		id: 'maze', name: 'Hedge maze', group, walk, home: { x: 6, y: 0, z: 0 }, size: W,
		// Into the garden, out to the far corners, and back.
		tour: [[2, 0, 4], [-13, 0, -13], [0, 0, -4.5], [13, 0, 13], [-4, 0, 1]],
		framing: { target: [0, -0.5, 0.4], yaw: 0.36, pitch: 0.92, distance: 68 },
	};
}
