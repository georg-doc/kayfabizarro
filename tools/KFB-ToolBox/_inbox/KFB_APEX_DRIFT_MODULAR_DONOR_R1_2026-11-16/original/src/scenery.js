// What stands round each track: containers, cranes, lamps and neon at the harbour; rocks and corner signs on the mountain;
// cones, hangars and a painted pad on the airfield. Everything is instanced, so a whole port is a handful of draws.
import {
	AdditiveBlending,
	BoxGeometry,
	CanvasTexture,
	Color,
	CylinderGeometry,
	DoubleSide,
	Group,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PlaneGeometry,
	Quaternion,
	RepeatWrapping,
	SRGBColorSpace,
	Vector3,
	ConeGeometry,
	RingGeometry,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng, smooth } from './noise.js';
import { SHOULDER, SLOPE } from './track-model.js';
import { STEP } from './spline.js';
import * as pictures from './textures.js';

const UP = new Vector3(0, 1, 0);
const m4 = new Matrix4();
const qt = new Quaternion();
const v3 = new Vector3();
const sc = new Vector3(1, 1, 1);

function place(mesh, i, x, y, z, yaw, scale = 1) {
	qt.setFromAxisAngle(UP, yaw);
	sc.set(scale, scale, scale);
	m4.compose(v3.set(x, y, z), qt, sc);
	mesh.setMatrixAt(i, m4);
}

function made(geometry, material, items, { cast = false, receive = true } = {}) {
	const group = new Group();
	const RUN = 36;
	for (let from = 0; from < Math.max(1, items.length); from += RUN) {
		const part = items.slice(from, from + RUN);
		const mesh = new InstancedMesh(geometry, material, Math.max(1, part.length));
		part.forEach((it, i) => {
			place(mesh, i, it.x, it.y, it.z, it.yaw, it.scale ?? 1);
			if (it.color) mesh.setColorAt(i, it.color);
		});
		mesh.count = part.length;
		mesh.castShadow = cast;
		mesh.receiveShadow = receive;
		mesh.computeBoundingSphere();
		group.add(mesh);
	}
	return group;
}

function neonSign(text, colour) {
	const c = document.createElement('canvas');
	c.width = 512;
	c.height = 192;
	const g = c.getContext('2d');
	g.fillStyle = '#05060a';
	g.fillRect(0, 0, 512, 192);
	g.strokeStyle = colour;
	g.lineWidth = 8;
	g.shadowColor = colour;
	g.shadowBlur = 26;
	g.strokeRect(14, 14, 484, 164);
	g.fillStyle = colour;
	g.font = '900 86px "Segoe UI", Arial, sans-serif';
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillText(text, 256, 98);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	return t;
}

const chevronTexture = () => {
	const c = document.createElement('canvas');
	c.width = c.height = 128;
	const g = c.getContext('2d');
	g.fillStyle = '#111';
	g.fillRect(0, 0, 128, 128);
	g.fillStyle = '#ffd21f';
	g.fillRect(6, 6, 116, 116);
	g.strokeStyle = '#111';
	g.lineWidth = 16;
	g.lineCap = 'round';
	g.lineJoin = 'round';
	g.beginPath();
	g.moveTo(40, 26);
	g.lineTo(88, 64);
	g.lineTo(40, 102);
	g.stroke();
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	return t;
};

export async function buildScenery({ RAPIER, physics, track, env, quality, world }) {
	const group = new Group();
	const style = track.def.kind;
	const solid = [];
	const props = track.def.props ?? {};
	const random = rng(77);
	const glow = pictures.glow();
	const { samples } = track;
	const wall = (x, y, z, hx, hy, hz, yaw) => {
		const q = new Quaternion().setFromAxisAngle(UP, yaw);
		solid.push(physics.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz).setTranslation(x, y, z).setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }).setFriction(0.5)));
	};
	const free = (x, z, margin) => {
		const n = track.nearest(x, z, 2);
		return n.dist > n.half + margin;
	};
	let flicker = [];

	if (style === 'harbor') {
		// Containers in stacks beside the road, on whichever side has room.
		const palette = ['#a9322c', '#2c5d9c', '#2f7c4c', '#d17a2a', '#d4b13a', '#c9cdd2', '#5d6670', '#7a3b8f'].map((c) => new Color(c));
		const side = pictures.containerSide();
		const boxGeometry = new BoxGeometry(12.2, 2.6, 2.44);
		const boxMaterial = new MeshStandardMaterial({ map: side, roughness: 0.62, metalness: 0.45 });
		const items = [];
		for (let i = 8; i < samples.length; i += 8) {
			const p = samples[i];
			const sideSign = random() < 0.5 ? 1 : -1;
			for (const s of [sideSign, -sideSign]) {
				if (random() < 0.35) continue;
				const gap = p.half + SHOULDER + 3.6 + random() * 3.5;
				const x = p.x + p.sx * s * (gap + 1.3);
				const z = p.z + p.sz * s * (gap + 1.3);
				if (!free(x, z, 9)) continue;
				const yaw = Math.atan2(-p.dz, p.dx);
				const rows = 1 + Math.floor(random() * 3);
				const stackH = 1 + Math.floor(random() * 3);
				for (let r = 0; r < rows; r++) {
					const ox = p.sx * s * r * 2.7;
					const oz = p.sz * s * r * 2.7;
					if (!free(x + ox, z + oz, 7)) break;
					for (let h = 0; h < stackH - (r % 2); h++) items.push({ x: x + ox, y: p.y + 1.3 + h * 2.6, z: z + oz, yaw, color: palette[Math.floor(random() * palette.length)] });
					wall(x + ox, p.y + (stackH * 2.6) / 2, z + oz, 6.1, (stackH * 2.6) / 2, 1.22, yaw);
				}
			}
		}
		const boxes = made(boxGeometry, boxMaterial, items, { cast: true });
		group.add(boxes);

		// Lamp posts: pole and arm, a bright head, and a pool of light on the road under each.
		const lampItems = [];
		const poolItems = [];
		for (let i = 6; i < samples.length; i += 17) {
			const p = samples[i];
			const s = (i / 17) % 2 === 0 ? 1 : -1;
			const o = p.half + SHOULDER + 1.2;
			const x = p.x + p.sx * s * o;
			const z = p.z + p.sz * s * o;
			if (!free(x, z, 1.6)) continue;
			lampItems.push({ x, y: p.y, z, yaw: Math.atan2(-p.sz * s, p.sx * s) });
			poolItems.push({ x: x - p.sx * s * 4.5, y: p.y + 0.05, z: z - p.sz * s * 4.5, yaw: 0 });
			wall(x, p.y + 4.5, z, 0.2, 4.5, 0.2, 0);
		}
		const pole = mergeGeometries([new CylinderGeometry(0.14, 0.2, 9, 8).translate(0, 4.5, 0), new BoxGeometry(4.6, 0.14, 0.14).translate(-2.3, 9.0, 0)]);
		group.add(made(pole, new MeshStandardMaterial({ color: '#2b2e36', metalness: 0.5, roughness: 0.5 }), lampItems, { cast: true }));
		const head = new BoxGeometry(1.1, 0.12, 0.5).translate(-4.4, 8.9, 0);
		group.add(made(head, new MeshBasicMaterial({ color: new Color('#ffd9a0').multiplyScalar(5) }), lampItems, { receive: false }));
		const poolGeo = new PlaneGeometry(15, 15).rotateX(-Math.PI / 2);
		const poolMat = new MeshBasicMaterial({ map: glow, color: new Color('#ffb55e').multiplyScalar(0.5), transparent: true, blending: AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
		group.add(made(poolGeo, poolMat, poolItems, { receive: false }));

		// Neon signs on tall frames.
		const signs = [];
		const colours = ['#ff2d95', '#22e6ff', '#ffb02e', '#8c5cff'];
		const names = ['APEX', 'DRIFT', 'HARBOR', 'TURBO', 'NEON', 'SLIDE', 'KING', 'NIGHT'];
		for (let k = 0; k < 12; k++) {
			const i = Math.floor(((k + 0.4) / 12) * samples.length);
			const p = samples[i];
			const s = k % 2 ? 1 : -1;
			const o = p.half + SHOULDER + 14 + random() * 6;
			const x = p.x + p.sx * s * o;
			const z = p.z + p.sz * s * o;
			if (!free(x, z, 10)) continue;
			const colour = colours[k % colours.length];
			const mat = new MeshBasicMaterial({ map: neonSign(names[k % names.length], colour), toneMapped: false, side: DoubleSide });
			mat.color.setScalar(1.7);
			const mesh = new Mesh(new PlaneGeometry(14, 5.25), mat);
			const yaw = Math.atan2(p.sx * s * -1, p.sz * s * -1);
			mesh.position.set(x, p.y + 12, z);
			mesh.rotation.y = yaw;
			group.add(mesh);
			const frame = new Mesh(new BoxGeometry(0.4, 12, 0.4), new MeshStandardMaterial({ color: '#1b1d24', metalness: 0.6, roughness: 0.5 }));
			frame.position.set(x, p.y + 6, z);
			group.add(frame);
			const glowMat = new MeshBasicMaterial({ map: glow, color: new Color(colour).multiplyScalar(1.2), transparent: true, blending: AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
			const pool = new Mesh(new PlaneGeometry(36, 36).rotateX(-Math.PI / 2), glowMat);
			pool.position.set(x - p.sx * s * 12, p.y + 0.06, z - p.sz * s * 12);
			group.add(pool);
			signs.push({ mesh, mat });
		}
		// Quay cranes standing off in the dark, with red lights on top.
		const steel = new MeshStandardMaterial({ color: '#2f3a4c', metalness: 0.5, roughness: 0.55 });
		const crane = mergeGeometries([
			new BoxGeometry(2, 46, 2).translate(-18, 23, -9),
			new BoxGeometry(2, 46, 2).translate(-18, 23, 9),
			new BoxGeometry(2, 46, 2).translate(18, 23, -9),
			new BoxGeometry(2, 46, 2).translate(18, 23, 9),
			new BoxGeometry(40, 3, 22).translate(0, 46, 0),
			new BoxGeometry(90, 3, 4).translate(30, 50, 0),
			new BoxGeometry(2, 22, 2).translate(70, 40, 0),
		]);
		const lights = [];
		const cranes = [];
		const cx = (track.bounds.x0 + track.bounds.x1) / 2;
		const cz = (track.bounds.z0 + track.bounds.z1) / 2;
		for (let k = 0; k < 6; k++) {
			const i = Math.floor(((k + 0.15) / 6) * samples.length);
			const p = samples[i];
			const out = new Vector3(p.x - cx, 0, p.z - cz).normalize();
			const x = p.x + out.x * (p.half + 70);
			const z = p.z + out.z * (p.half + 70);
			cranes.push({ x, y: p.y, z, yaw: Math.atan2(out.x, out.z) });
			lights.push({ x, y: p.y + 53, z, yaw: 0, scale: 1 });
		}
		group.add(made(crane, steel, cranes, { cast: false }));
		const beacon = new Mesh(new BoxGeometry(1.2, 1.2, 1.2), new MeshBasicMaterial({ color: new Color('#ff2020').multiplyScalar(4) }));
		const beacons = made(beacon.geometry, beacon.material, lights, { receive: false });
		group.add(beacons);
		flicker.push((time) => {
			beacon.material.color.set('#ff2020').multiplyScalar(time % 1.6 < 0.8 ? 4.5 : 0.4);
		});
		// A warehouse row, windows lit.
		const windowsTex = pictures.windows();
		const hall = new BoxGeometry(46, 12, 22);
		const hallMat = new MeshStandardMaterial({ map: windowsTex, roughness: 0.8, emissiveMap: windowsTex, emissive: new Color('#ffffff'), emissiveIntensity: 0.9 });
		const halls = [];
		for (let k = 0; k < 8; k++) {
			const i = Math.floor(((k + 0.5) / 8) * samples.length);
			const p = samples[i];
			const out = new Vector3(p.x - cx, 0, p.z - cz).normalize();
			const x = p.x - out.x * (p.half + 48);
			const z = p.z - out.z * (p.half + 48);
			if (!free(x, z, 34)) continue;
			halls.push({ x, y: p.y + 6, z, yaw: Math.atan2(out.x, out.z) });
			wall(x, p.y + 6, z, 23, 6, 11, Math.atan2(out.x, out.z));
		}
		group.add(made(hall, hallMat, halls, { cast: true }));
		// The sea.
		const sea = new Mesh(new PlaneGeometry(9000, 9000).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: '#0a1830', roughness: 0.12, metalness: 0.7 }));
		sea.position.set(cx, -1.3, cz);
		group.add(sea);
		void signs;
	}

	if (style === 'mountain') {
		// Corner signs on the outside of the tight bends, facing the traffic.
		const tex = chevronTexture();
		const signMat = new MeshStandardMaterial({ map: tex, roughness: 0.5, emissive: new Color('#332600'), emissiveMap: tex, emissiveIntensity: 0.35, side: DoubleSide });
		const flipped = tex.clone();
		flipped.wrapS = RepeatWrapping;
		flipped.repeat.x = -1;
		flipped.offset.x = 1;
		flipped.needsUpdate = true;
		const signMatLeft = signMat.clone();
		signMatLeft.map = flipped;
		signMatLeft.emissiveMap = flipped;
		const posts = [];
		for (let i = 20; i < samples.length - 20; i += 7) {
			const p = samples[i];
			if (Math.abs(p.bend) < 0.014) continue;
			const outer = p.bend > 0 ? 1 : -1;
			const o = p.half + SHOULDER + 1.4;
			posts.push({ x: p.x + p.sx * outer * o, y: p.y, z: p.z + p.sz * outer * o, yaw: Math.atan2(p.dx, p.dz) + Math.PI, right: p.bend > 0 });
		}
		const board = new PlaneGeometry(1.1, 1.1).translate(0, 2.0, 0);
		const stick = new CylinderGeometry(0.05, 0.05, 2.0, 6).translate(0, 1.0, 0);
		group.add(made(board, signMat, posts.filter((p) => p.right), { cast: true }));
		group.add(made(board, signMatLeft, posts.filter((p) => !p.right), { cast: true }));
		group.add(made(stick, new MeshStandardMaterial({ color: '#888', metalness: 0.6, roughness: 0.4 }), posts, { cast: true }));
		// Rocks along the cuttings.
		try {
			const gltf = await new GLTFLoader().loadAsync('stage/rocks.glb');
			const rocks = [];
			gltf.scene.traverse((o) => {
				if (o.isMesh) rocks.push(o);
			});
			if (rocks.length) {
				const items = [];
				for (let n = 0; n < 420 * (props.rocks ?? 0.5); n++) {
					const p = samples[Math.floor(random() * samples.length)];
					const s = random() < 0.5 ? 1 : -1;
					const o = p.half + SHOULDER + SLOPE + 3 + random() * 28;
					const x = p.x + p.sx * s * o;
					const z = p.z + p.sz * s * o;
					if (!free(x, z, SHOULDER + SLOPE + 2)) continue;
					items.push({ x, y: track.heightAt(x, z) - 0.2, z, yaw: random() * 6.28, scale: 1.5 + random() * 3.2 });
				}
				const buckets = rocks.map(() => []);
				items.forEach((it, i) => buckets[i % rocks.length].push(it));
				rocks.forEach((r, i) => {
					const mat = r.material.clone();
					mat.color.setScalar(1.9);
					mat.envMapIntensity = 0.6;
					group.add(made(r.geometry, mat, buckets[i], { cast: true }));
				});
			}
		} catch {
			// No rocks is fine: the land has its own.
		}
	}

	if (style === 'airfield') {
		// Cones along the start of every drift zone, hangars at the edge, and rings painted on the pad.
		const cone = mergeGeometries([new CylinderGeometry(0.2, 0.22, 0.04, 8).translate(0, 0.02, 0), new ConeGeometry(0.17, 0.62, 10).translate(0, 0.35, 0)]);
		const coneMat = new MeshStandardMaterial({ color: '#ff6a1a', roughness: 0.55, emissive: new Color('#ff3a00'), emissiveIntensity: 0.12 });
		const items = [];
		for (const [a, b] of track.def.zones ?? []) {
			for (const s of [a, b]) {
				const p = samples[Math.round((s * track.length) / STEP) % samples.length];
				for (const side of [-1, 1]) for (let k = 0; k < 6; k++) {
					const o = side * (p.half + 0.8 + k * 0.01);
					items.push({ x: p.x + p.sx * o + p.dx * k * 1.4, y: p.y, z: p.z + p.sz * o + p.dz * k * 1.4, yaw: 0 });
				}
			}
		}
		group.add(made(cone, coneMat, items, { cast: true }));
		const hangar = new BoxGeometry(60, 14, 34);
		const hmat = new MeshStandardMaterial({ color: '#a9b0b6', metalness: 0.4, roughness: 0.6 });
		const hangars = [];
		for (let k = 0; k < 3; k++) {
			const x = track.bounds.x0 + 60 + k * 90;
			const z = track.bounds.z1 + 130;
			const y = track.heightAt(x, z) + 7;
			hangars.push({ x, y, z, yaw: 0 });
			wall(x, y, z, 30, 7, 17, 0);
		}
		group.add(made(hangar, hmat, hangars, { cast: true }));
		for (const [cx, cz, r] of track.pads) {
			const y = track.heightAt(cx, cz) + 0.04;
			const c = document.createElement('canvas');
			c.width = c.height = 1024;
			const g = c.getContext('2d');
			g.clearRect(0, 0, 1024, 1024);
			g.strokeStyle = 'rgba(245,245,245,0.92)';
			g.lineWidth = 8;
			for (const f of [0.95, 0.62, 0.3]) {
				g.beginPath();
				g.arc(512, 512, f * 504, 0, Math.PI * 2);
				g.stroke();
			}
			g.fillStyle = 'rgba(245,200,60,0.9)';
			for (let a = 0; a < 8; a++) {
				g.save();
				g.translate(512, 512);
				g.rotate((a * Math.PI) / 4);
				g.fillRect(-6, -496, 12, 150);
				g.restore();
			}
			const tex = new CanvasTexture(c);
			tex.colorSpace = SRGBColorSpace;
			tex.anisotropy = 8;
			const ring = new Mesh(new PlaneGeometry(r * 2, r * 2).rotateX(-Math.PI / 2), new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, color: new Color().setScalar(0.85) }));
			ring.position.set(cx, y, cz);
			group.add(ring);
		}
		// A wind sock.
		const sockPole = new Mesh(new CylinderGeometry(0.1, 0.12, 9, 8), new MeshStandardMaterial({ color: '#ddd' }));
		const x = track.bounds.x1 + 40;
		const z = (track.bounds.z0 + track.bounds.z1) / 2;
		sockPole.position.set(x, track.heightAt(x, z) + 4.5, z);
		group.add(sockPole);
		const sock = new Mesh(new ConeGeometry(0.7, 3.2, 12, 1, true).rotateZ(Math.PI / 2).translate(1.7, 0, 0), new MeshStandardMaterial({ color: '#ff7a1a', side: DoubleSide, emissive: '#ff4a00', emissiveIntensity: 0.15 }));
		sock.position.set(x, track.heightAt(x, z) + 8.7, z);
		group.add(sock);
		flicker.push((time) => {
			sock.rotation.y = 0.9 + Math.sin(time * 0.7) * 0.15;
			sock.rotation.z = Math.sin(time * 2.1) * 0.05;
		});
	}

	return {
		group,
		solid,
		update(time) {
			for (const f of flicker) f(time);
		},
		dispose() {
			for (const c of solid) physics.removeCollider(c, false);
			group.traverse((o) => {
				o.geometry?.dispose?.();
			});
		},
	};
}
