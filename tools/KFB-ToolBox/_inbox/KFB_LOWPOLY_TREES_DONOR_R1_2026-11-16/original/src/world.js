// The island the tree stands on: faceted ground, rocks, grass that bends away from the tree, flat-faceted water with a
// shallow shelf to wade in, and a sky. All of it is made in this file, with no textures or models.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const hash = (x, y) => {
	const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return s - Math.floor(s);
};
function noise(x, y) {
	const i = Math.floor(x);
	const j = Math.floor(y);
	const fx = x - i;
	const fy = y - j;
	const u = fx * fx * (3 - 2 * fx);
	const v = fy * fy * (3 - 2 * fy);
	const a = hash(i, j) + (hash(i + 1, j) - hash(i, j)) * u;
	const b = hash(i, j + 1) + (hash(i + 1, j + 1) - hash(i, j + 1)) * u;
	return a + (b - a) * v;
}
const fbm = (x, y) => noise(x, y) * 0.55 + noise(x * 2.1 + 7, y * 2.1 + 3) * 0.3 + noise(x * 4.3 + 1, y * 4.3 + 9) * 0.15;
const smooth = (a, b, x) => {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

/** The shore's distance from the middle in a direction, in metres. */
function shoreAt(x, z) {
	const r = Math.hypot(x, z) || 1;
	return 11.5 + (fbm((x / r) * 1.4 + 5, (z / r) * 1.4 + 5) - 0.5) * 7;
}
/** The ground's height; the sea is at 0. */
export function heightAt(x, z) {
	const r = Math.hypot(x, z);
	const t = r / shoreAt(x, z);
	const hills = lerp(0.42, 0.34 + (fbm(x * 0.16 + 3, z * 0.16 + 9) - 0.35) * 1.5, smooth(1.5, 6, r));
	const slope = smooth(0.62, 1.08, t);
	const land = lerp(hills, -0.55, slope);
	return t > 1.08 ? Math.max(-3.4, land - (t - 1.08) * 3.2) : land;
}
export const SEA = 0;

const c = (hex) => new THREE.Color(hex);
const GRASS = [c(0x8cc65a), c(0x70b24f), c(0xaccf63), c(0x5b9e49)];
const SAND = c(0xeedca9);
const WET = c(0xc4b283);
const BED = c(0x55a59c);

/** Uniforms the ground and grass share: the tree's place darkens and pushes them; a landing's shock runs through the grass. */
export const shared = {
	uTime: { value: 0 },
	uWind: { value: 1 },
	uTree: { value: new THREE.Vector3() },
	uLift: { value: 0 },
	uShock: { value: new THREE.Vector4(0, 0, 100, 0) },
};
const CONTACT = /* glsl */ `
	uniform vec3 uTree;
	uniform float uLift;
	float treeContact(vec2 p) {
		float d = length(p - uTree.xz);
		return 1.0 - 0.42 * (1.0 - smoothstep(0.2, 2.4, d)) * (1.0 - smoothstep(0.0, 1.6, uLift));
	}
`;

function ground() {
	const step = 0.62;
	const extent = 34;
	const n = Math.round((2 * extent) / step);
	const px = (i, j) => -extent + i * step + (hash(i, j) - 0.5) * step * 0.72;
	const pz = (i, j) => -extent + j * step + (hash(j + 91, i + 17) - 0.5) * step * 0.72;
	const positions = [];
	const colors = [];
	const color = new THREE.Color();
	const tri = (a, b, d) => {
		const [ax, az] = a;
		const [bx, bz] = b;
		const [dx, dz] = d;
		const x = (ax + bx + dx) / 3;
		const z = (az + bz + dz) / 3;
		if (Math.hypot(x, z) > extent) return;
		const y = heightAt(x, z);
		if (y < -3.3) return;
		const roll = hash(x * 13.3, z * 7.7);
		if (y < -0.04) color.copy(WET).lerp(BED, smooth(-0.1, -1.3, y));
		else if (y < 0.14 + roll * 0.09) color.copy(SAND);
		else {
			const patch = fbm(x * 0.24 + 11, z * 0.24 + 2);
			const pick = patch < 0.42 ? 3 : patch < 0.52 ? 1 : patch < 0.63 ? 0 : 2;
			color.copy(GRASS[pick]).lerp(GRASS[(pick + 1) % 4], roll * 0.35);
		}
		color.multiplyScalar(0.94 + roll * 0.12);
		for (const [vx, vz] of [a, b, d]) {
			positions.push(vx, heightAt(vx, vz), vz);
			colors.push(color.r, color.g, color.b);
		}
	};
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const a = [px(i, j), pz(i, j)];
			const b = [px(i + 1, j), pz(i + 1, j)];
			const d = [px(i + 1, j + 1), pz(i + 1, j + 1)];
			const e = [px(i, j + 1), pz(i, j + 1)];
			if ((i + j) % 2) {
				tri(a, d, b);
				tri(a, e, d);
			} else {
				tri(a, e, b);
				tri(e, d, b);
			}
		}
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
	g.computeVertexNormals();
	const m = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
	m.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, { uTree: shared.uTree, uLift: shared.uLift });
		shader.vertexShader = shader.vertexShader
			.replace('#include <common>', '#include <common>\nvarying vec2 vGround;')
			.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGround = position.xz;');
		shader.fragmentShader = shader.fragmentShader
			.replace('#include <common>', `#include <common>\nvarying vec2 vGround;\n${CONTACT}`)
			.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= treeContact(vGround);');
	};
	const mesh = new THREE.Mesh(g, m);
	mesh.receiveShadow = true;
	return mesh;
}

/** A jittered faceted lump with one colour a face, from its top colour to its underside's. */
function lump(seed, sx, sy, sz, top, side, x, y, z, yaw = 0) {
	const g = new THREE.IcosahedronGeometry(1, 1);
	const p = g.getAttribute('position');
	const moved = (i) => {
		const v = new THREE.Vector3().fromBufferAttribute(p, i);
		// Jitter by direction, so faces that share a corner stay joined.
		const k = 1 + (hash(Math.round(v.x * 100) / 31 + seed, Math.round(v.y * 100) / 53 + Math.round(v.z * 100) / 77) - 0.5) * 0.42;
		return v.multiplyScalar(k);
	};
	const colors = [];
	const color = new THREE.Color();
	for (let i = 0; i < p.count; i += 3) {
		const a = moved(i);
		const b = moved(i + 1);
		const d = moved(i + 2);
		p.setXYZ(i, a.x, a.y, a.z);
		p.setXYZ(i + 1, b.x, b.y, b.z);
		p.setXYZ(i + 2, d.x, d.y, d.z);
		const up = (a.y + b.y + d.y) / 3;
		color.copy(side).lerp(top, smooth(-0.1, 0.55, up + (hash(seed, i) - 0.5) * 0.3));
		color.multiplyScalar(0.92 + hash(i, seed) * 0.16);
		for (let k = 0; k < 3; k++) colors.push(color.r, color.g, color.b);
	}
	g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
	g.deleteAttribute('uv');
	g.scale(sx, sy, sz);
	g.rotateY(yaw);
	g.translate(x, y, z);
	g.computeVertexNormals();
	return g;
}

function props() {
	const parts = [];
	const place = (angle, along) => {
		const x = Math.cos(angle);
		const z = Math.sin(angle);
		const r = shoreAt(x, z) * along;
		return [x * r, z * r];
	};
	const stone = c(0x8f939a);
	const moss = c(0x9fb86a);
	const pale = c(0xbfc3c6);
	// Rocks in groups on the shoulders of the island, a few in the shallows.
	const groups = [[0.6, 0.86], [2.05, 0.8], [2.9, 0.98], [4.15, 0.78], [5.3, 0.9], [1.25, 1.02], [3.55, 1.06]];
	for (const [gi, [angle, along]] of groups.entries()) {
		const [gx, gz] = place(angle, along);
		const count = 2 + Math.floor(hash(gi, 3) * 3);
		for (let k = 0; k < count; k++) {
			const dx = (hash(gi, k) - 0.5) * 1.8;
			const dz = (hash(k, gi + 8) - 0.5) * 1.8;
			const s = (k === 0 ? 0.62 : 0.26) + hash(gi + k, 5) * 0.32;
			const x = gx + dx * (k ? 1 : 0);
			const z = gz + dz * (k ? 1 : 0);
			parts.push(lump(gi * 10 + k, s * 1.15, s * 0.8, s, along > 0.97 ? pale : moss, stone, x, heightAt(x, z) + s * 0.22, z, hash(k, gi) * 6));
		}
	}
	// Round shrubs inland, grouped, in the greens of the ground.
	for (const [bi, [angle, along]] of [[0.2, 0.62], [1.55, 0.68], [2.5, 0.6], [3.9, 0.56], [4.8, 0.66], [5.75, 0.6]].entries()) {
		const [bx, bz] = place(angle, along);
		for (let k = 0; k < 3; k++) {
			const s = 0.55 - k * 0.12 + hash(bi, k) * 0.12;
			const x = bx + (k ? (hash(bi, k + 3) - 0.5) * 1.3 : 0);
			const z = bz + (k ? (hash(k + 3, bi) - 0.5) * 1.3 : 0);
			parts.push(lump(bi * 7 + k + 50, s, s * 0.82, s, c(0x9ccb55), c(0x3f7f3b), x, heightAt(x, z) + s * 0.5, z, k));
		}
	}
	const mesh = new THREE.Mesh(mergeGeometries(parts), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
	mesh.castShadow = mesh.receiveShadow = true;
	return mesh;
}

/** The sway, the push away from the tree and the landing's shock, shared by grass and flowers. */
function swaying(material, reach) {
	material.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, shared);
		shader.vertexShader = shader.vertexShader
			.replace('#include <common>', `#include <common>\nuniform float uTime; uniform float uWind; uniform vec4 uShock; varying float vContact;\n${CONTACT}`)
			.replace(
				'#include <project_vertex>',
				/* glsl */ `
				vec4 wp = instanceMatrix * vec4(transformed, 1.0);
				float k = position.y * position.y;
				vec2 at = instanceMatrix[3].xz;
				float gust = sin(uTime * 0.9 + at.x * 0.22 + at.y * 0.17) * 0.5 + 0.6;
				float sway = sin(uTime * 2.1 + at.x * 1.3 + at.y * 0.9) * 0.6 + sin(uTime * 3.7 + at.y * 2.1) * 0.25;
				wp.x += uWind * ${reach.toFixed(3)} * (gust * 0.8 + sway * 0.55) * k;
				wp.z += uWind * ${reach.toFixed(3)} * sway * 0.4 * k;
				vec2 away = wp.xz - uTree.xz;
				float d = max(length(away), 0.001);
				float push = (1.0 - smoothstep(0.4, 2.1, d)) * (1.0 - smoothstep(0.0, 1.2, uLift));
				wp.xz += away / d * push * k * ${(reach * 3.2).toFixed(3)};
				wp.y -= push * k * ${(reach * 0.9).toFixed(3)};
				// Under the roots it's pressed flat, so they show wherever the tree stands.
				float pressed = smoothstep(0.7, 1.9, d) + smoothstep(0.0, 0.8, uLift);
				wp.y = mix(instanceMatrix[3].y, wp.y, clamp(pressed, 0.0, 1.0));
				vec2 fromShock = wp.xz - uShock.xy;
				float sd = max(length(fromShock), 0.001);
				float ring = exp(-pow((sd - uShock.z) * 1.5, 2.0)) * uShock.w;
				wp.xz += fromShock / sd * ring * k * ${(reach * 4).toFixed(3)};
				wp.y -= ring * k * ${(reach * 1.4).toFixed(3)};
				vContact = treeContact(at);
				vec4 mvPosition = viewMatrix * modelMatrix * wp;
				gl_Position = projectionMatrix * mvPosition;
				`,
			);
		shader.fragmentShader = shader.fragmentShader
			.replace('#include <common>', '#include <common>\nvarying float vContact;')
			.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= vContact;');
	};
}

function grass() {
	// A tuft: five long pointed blades, each one triangle, dark at the root and light at the tip. Height 1 at the tip.
	const blades = 5;
	const pos = [];
	const col = [];
	for (let b = 0; b < blades; b++) {
		const a = (b / blades) * Math.PI * 2 + hash(b, 2);
		const out = b === 0 ? 0.04 : 0.17;
		const ox = Math.cos(a) * out;
		const oz = Math.sin(a) * out;
		const w = 0.09;
		const sx = -Math.sin(a) * w;
		const sz = Math.cos(a) * w;
		const tall = 1 - (b ? 0.22 * hash(b, 7) : 0);
		const lean = 0.34;
		pos.push(ox - sx, 0, oz - sz, ox + sx, 0, oz + sz, ox + Math.cos(a) * lean * tall, tall, oz + Math.sin(a) * lean * tall);
		col.push(0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 1.22, 1.22, 1.22);
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
	g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
	// Lit like the ground under them, not like little mirrors.
	const nor = new Float32Array(pos.length);
	for (let i = 1; i < nor.length; i += 3) nor[i] = 1;
	g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
	const material = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
	swaying(material, 0.12);
	const spots = [];
	for (let i = 0; spots.length < 3400 && i < 40000; i++) {
		const x = (hash(i, 1) - 0.5) * 30;
		const z = (hash(i, 2) - 0.5) * 30;
		const y = heightAt(x, z);
		if (y < 0.2) continue;
		// In patches, thick in places and thin in others, so the ground's facets still show.
		const thick = smooth(0.34, 0.62, fbm(x * 0.34 + 4, z * 0.34 + 8));
		if (hash(i, 3) > thick) continue;
		spots.push([x, y, z, hash(i, 4), hash(i, 5)]);
	}
	const mesh = new THREE.InstancedMesh(g, material, spots.length);
	const m = new THREE.Matrix4();
	const q = new THREE.Quaternion();
	const color = new THREE.Color();
	const up = new THREE.Vector3(0, 1, 0);
	for (const [i, [x, y, z, a, b]] of spots.entries()) {
		const s = 0.15 + a * 0.17;
		q.setFromAxisAngle(up, b * Math.PI * 2);
		m.compose(new THREE.Vector3(x, y - 0.02, z), q, new THREE.Vector3(s * 1.1, s * (1.25 + b * 0.5), s * 1.1));
		mesh.setMatrixAt(i, m);
		const patch = fbm(x * 0.24 + 11, z * 0.24 + 2);
		color.copy(GRASS[patch < 0.42 ? 3 : patch < 0.52 ? 1 : patch < 0.63 ? 0 : 2]).multiplyScalar(0.92 + a * 0.2);
		mesh.setColorAt(i, color);
	}
	mesh.receiveShadow = true;
	mesh.frustumCulled = false;
	return mesh;
}

function flowers() {
	// A short stem and a five-sided head, tipped toward the sun's side.
	const stem = new THREE.ConeGeometry(0.03, 1, 3, 1).toNonIndexed();
	stem.translate(0, 0.5, 0);
	const head = new THREE.ConeGeometry(0.2, 0.14, 5, 1).toNonIndexed();
	head.rotateX(Math.PI);
	head.translate(0, 1.04, 0);
	const paint = (g, r, gc, b) => {
		const n = g.getAttribute('position').count;
		g.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: n * 3 }, (_, i) => [r, gc, b][i % 3]), 3));
		g.deleteAttribute('uv');
		return g;
	};
	const g = mergeGeometries([paint(stem, 0.28, 0.5, 0.2), paint(head, 1, 1, 1)]);
	const material = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
	swaying(material, 0.07);
	const shades = [0xffffff, 0xffe066, 0xff9ec4, 0xfff1d6, 0xb9a2ff].map(c);
	const spots = [];
	for (let i = 0; spots.length < 240 && i < 9000; i++) {
		const x = (hash(i, 21) - 0.5) * 26;
		const z = (hash(i, 22) - 0.5) * 26;
		const y = heightAt(x, z);
		if (y < 0.22 || Math.hypot(x, z) < 2.2) continue;
		if (fbm(x * 0.55 + 20, z * 0.55 + 31) < 0.53) continue;
		spots.push([x, y, z, hash(i, 23), Math.floor(fbm(x * 0.2 + 3, z * 0.2) * 9 + hash(i, 25) * 2) % shades.length]);
	}
	const mesh = new THREE.InstancedMesh(g, material, spots.length);
	const m = new THREE.Matrix4();
	const q = new THREE.Quaternion();
	for (const [i, [x, y, z, a, pick]] of spots.entries()) {
		const s = 0.22 + a * 0.16;
		q.setFromEuler(new THREE.Euler((a - 0.5) * 0.5, a * 6, (0.5 - a) * 0.4));
		m.compose(new THREE.Vector3(x, y - 0.02, z), q, new THREE.Vector3(s, s * (0.85 + a * 0.5), s));
		mesh.setMatrixAt(i, m);
		mesh.setColorAt(i, shades[pick]);
	}
	mesh.receiveShadow = true;
	mesh.frustumCulled = false;
	return mesh;
}

/** The sea: rings of triangles, finer near the shore, moved in the shader and faceted by derivatives. */
function water(sunDirection, horizon) {
	const rings = [];
	for (let r = 3; r < 620; r *= 1.052) rings.push(r);
	const segments = 200;
	const positions = [];
	const depths = [];
	const point = (ring, s) => {
		const a = ((s + (ring % 2) * 0.5) / segments) * Math.PI * 2 + (hash(ring, s % segments) - 0.5) * 0.012;
		const r = rings[ring] * (1 + (hash(s % segments, ring) - 0.5) * 0.03);
		return [Math.cos(a) * r, Math.sin(a) * r];
	};
	const index = [];
	for (let i = 0; i < rings.length; i++) {
		for (let s = 0; s < segments; s++) {
			const [x, z] = point(i, s);
			positions.push(x, 0, z);
			depths.push(SEA - heightAt(x, z));
		}
	}
	for (let i = 0; i < rings.length - 1; i++) {
		for (let s = 0; s < segments; s++) {
			const a = i * segments + s;
			const b = i * segments + ((s + 1) % segments);
			const d = (i + 1) * segments + s;
			const e = (i + 1) * segments + ((s + 1) % segments);
			// Rings under dry land aren't drawn.
			if (depths[a] < -0.25 && depths[b] < -0.25 && depths[d] < -0.25 && depths[e] < -0.25) continue;
			index.push(a, b, d, b, e, d);
		}
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	g.setAttribute('aDepth', new THREE.Float32BufferAttribute(depths, 1));
	g.setIndex(index);
	const material = new THREE.ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: {
			uTime: shared.uTime,
			uSun: { value: sunDirection },
			uHorizon: { value: horizon },
			uSky: { value: c(0x8fd0f2) },
			uShallow: { value: c(0x5fe3d0) },
			uMid: { value: c(0x18a6c4) },
			uDeep: { value: c(0x0f6fb0) },
		},
		vertexShader: /* glsl */ `
			attribute float aDepth;
			uniform float uTime;
			varying vec3 vWorld;
			varying float vDepth;
			void main() {
				vec3 p = position;
				float near = 1.0 - smoothstep(60.0, 300.0, length(p.xz));
				float open = smoothstep(-0.1, 1.2, aDepth);
				p.y += (sin(p.x * 0.7 + uTime * 0.9) * 0.05 + sin(p.z * 0.9 - uTime * 1.1) * 0.05 + sin((p.x + p.z) * 0.35 + uTime * 0.6) * 0.08 + sin(p.x * 2.1 - p.z * 1.7 + uTime * 1.4) * 0.025) * mix(0.35, 1.0, open) * mix(0.4, 1.0, near);
				vWorld = (modelMatrix * vec4(p, 1.0)).xyz;
				vDepth = aDepth;
				gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
			}
		`,
		fragmentShader: /* glsl */ `
			uniform float uTime;
			uniform vec3 uSun, uHorizon, uSky, uShallow, uMid, uDeep;
			varying vec3 vWorld;
			varying float vDepth;
			void main() {
				if (vDepth < -0.04) discard;
				vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
				if (n.y < 0.0) n = -n;
				vec3 v = normalize(cameraPosition - vWorld);
				float dist = length(cameraPosition - vWorld);
				vec3 col = mix(uShallow, uMid, smoothstep(0.0, 0.8, vDepth));
				col = mix(col, uDeep, smoothstep(0.8, 3.0, vDepth));
				// Facets catch the sky and the sun: each one is a flat plate.
				float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);
				float tilt = dot(n.xz, normalize(uSun.xz)) * (1.0 - smoothstep(30.0, 150.0, dist));
				col *= 1.0 + clamp(tilt * 3.2, -0.3, 0.42);
				col = mix(col, uSky, fresnel * 0.5);
				vec3 h = normalize(uSun + v);
				col += vec3(1.0, 0.92, 0.75) * pow(max(dot(n, h), 0.0), 240.0) * 1.6;
				// Foam: a line on the shore, and a slow second one that breathes out from it.
				float edge = vDepth + sin(uTime * 0.7 + vWorld.x * 0.9 + vWorld.z * 0.7) * 0.015;
				float foam = 1.0 - smoothstep(0.0, 0.07, edge);
				float breath = sin(uTime * 0.55 + vWorld.x * 0.3) * 0.5 + 0.5;
				foam = max(foam, (1.0 - smoothstep(0.012, 0.045, abs(edge - 0.08 - breath * 0.12))) * 0.8);
				col = mix(col, vec3(1.0), foam);
				float alpha = mix(0.42, 0.97, smoothstep(0.0, 1.05, vDepth));
				alpha = max(alpha, foam);
				float far = smoothstep(130.0, 560.0, dist);
				far *= far;
				col = mix(col, uHorizon, far);
				gl_FragColor = vec4(col, mix(alpha, 1.0, smoothstep(30.0, 60.0, dist)));
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`,
	});
	const mesh = new THREE.Mesh(g, material);
	mesh.frustumCulled = false;
	mesh.renderOrder = 1;
	return mesh;
}

function sky(sunDirection, horizon) {
	const material = new THREE.ShaderMaterial({
		side: THREE.BackSide,
		depthWrite: false,
		depthTest: false,
		uniforms: {
			uSun: { value: sunDirection },
			uTop: { value: c(0x2f86d8) },
			uMid: { value: c(0x8fcdf2) },
			uHorizon: { value: horizon },
		},
		vertexShader: /* glsl */ `
			varying vec3 vDir;
			void main() {
				vDir = position;
				vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
				gl_Position = p.xyww;
			}
		`,
		fragmentShader: /* glsl */ `
			uniform vec3 uSun, uTop, uMid, uHorizon;
			varying vec3 vDir;
			void main() {
				vec3 d = normalize(vDir);
				float y = max(d.y, 0.0);
				vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.16, y));
				col = mix(col, uTop, smoothstep(0.1, 0.62, y));
				float sun = max(dot(d, uSun), 0.0);
				col += vec3(1.0, 0.78, 0.5) * (pow(sun, 8.0) * 0.14 + pow(sun, 90.0) * 0.5);
				gl_FragColor = vec4(col, 1.0);
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`,
	});
	const mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 20), material);
	mesh.frustumCulled = false;
	mesh.renderOrder = -1;
	return mesh;
}

function clouds() {
	const parts = [];
	const white = c(0xffffff);
	const under = c(0xc9d9ea);
	const place = [
		[0.5, 95, 24, 1.3], [1.35, 130, 34, 1.9], [2.2, 85, 20, 1], [3.05, 120, 30, 1.6], [3.9, 100, 26, 1.2], [4.7, 140, 36, 2.1], [5.5, 90, 22, 1.15], [6.05, 150, 42, 1.8], [3.78, 175, 17, 1.5], [4.34, 195, 21, 2],
	];
	for (const [ci, [angle, r, y, size]] of place.entries()) {
		const cx = Math.cos(angle) * r;
		const cz = Math.sin(angle) * r;
		const puffs = 5 + Math.floor(hash(ci, 2) * 3);
		for (let k = 0; k < puffs; k++) {
			const along = (k / (puffs - 1) - 0.5) * 2;
			const s = (5.2 - Math.abs(along) * 2.8 + hash(ci, k) * 1.4) * size;
			const x = cx + along * 9 * size * Math.cos(angle + 1.57) + (hash(k, ci) - 0.5) * 3;
			const z = cz + along * 9 * size * Math.sin(angle + 1.57) + (hash(k + 4, ci) - 0.5) * 3;
			parts.push(lump(ci * 13 + k + 200, s * 1.25, s * 0.68, s, white, under, x, y + (hash(ci + k, 6) - 0.2) * 2 * size, z, k));
		}
	}
	return new THREE.Mesh(mergeGeometries(parts), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, emissive: 0xffffff, emissiveIntensity: 0.34 }));
}

function distantIslands() {
	const parts = [];
	const hazy = c(0x79a79a);
	const dark = c(0x5d8d84);
	for (const [i, [angle, r, h, w]] of [[0.25, 300, 13, 46], [1.0, 360, 19, 70], [3.72, 340, 13, 52], [4.46, 300, 9, 34], [5.55, 390, 22, 84]].entries()) {
		parts.push(lump(i + 400, w, h, w * 0.6, hazy, dark, Math.cos(angle) * r, 0, Math.sin(angle) * r, angle));
	}
	return new THREE.Mesh(mergeGeometries(parts), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
}

export function createWorld(scene, sunDirection) {
	const horizon = c(0xffe2bd);
	const clouded = clouds();
	const parts = {
		sky: sky(sunDirection, horizon),
		ground: ground(),
		props: props(),
		grass: grass(),
		flowers: flowers(),
		water: water(sunDirection, horizon),
		clouds: clouded,
		islands: distantIslands(),
	};
	for (const part of Object.values(parts)) scene.add(part);
	scene.fog = new THREE.Fog(horizon, 90, 420);
	return {
		...parts,
		horizon,
		update(t) {
			shared.uTime.value = t;
			clouded.rotation.y = t * 0.0035;
		},
	};
}
