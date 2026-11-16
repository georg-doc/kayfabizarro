// What a tree throws around: leaves in its own colours, puffs of dust, drops of water and rings on the sea. Everything
// shrinks away rather than fades, which keeps it faceted and needs no sorting.
import * as THREE from 'three';
import { SEA, heightAt } from './world.js';

const dummy = new THREE.Object3D();
const color = new THREE.Color();

function pool(geometry, material, size) {
	const mesh = new THREE.InstancedMesh(geometry, material, size);
	mesh.frustumCulled = false;
	mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
	for (let i = 0; i < size; i++) mesh.setColorAt(i, color.set(0xffffff));
	mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
	dummy.scale.setScalar(0);
	dummy.updateMatrix();
	for (let i = 0; i < size; i++) mesh.setMatrixAt(i, dummy.matrix);
	const items = Array.from({ length: size }, () => ({ life: 0, max: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s: 1, rx: 0, ry: 0, rz: 0, wx: 0, wy: 0, wz: 0, kind: 0, phase: 0 }));
	let next = 0;
	return {
		mesh,
		items,
		take(r, g, b) {
			const it = items[next];
			mesh.setColorAt(next, color.setRGB(r, g, b));
			mesh.instanceColor.needsUpdate = true;
			next = (next + 1) % size;
			return it;
		},
	};
}

export function createFx(scene) {
	const leafShape = new THREE.BufferGeometry();
	leafShape.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, -0.32, 0.5, 0, -0.32, 0, 0, 0.8], 3));
	leafShape.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
	const leaves = pool(leafShape, new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), 260);
	const bits = pool(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial({ flatShading: true }), 200);
	scene.add(leaves.mesh, bits.mesh);
	leaves.mesh.castShadow = true;
	bits.mesh.castShadow = true;

	const ringShape = new THREE.RingGeometry(0.86, 1, 28, 1);
	ringShape.rotateX(-Math.PI / 2);
	const rings = Array.from({ length: 14 }, () => {
		const mesh = new THREE.Mesh(ringShape, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
		mesh.visible = false;
		mesh.renderOrder = 2;
		scene.add(mesh);
		return { mesh, life: 0, max: 1, grow: 1, size: 1 };
	});
	let nextRing = 0;

	function ring(x, y, z, size, grow, max) {
		const r = rings[nextRing];
		nextRing = (nextRing + 1) % rings.length;
		Object.assign(r, { life: max, max, grow, size });
		r.mesh.position.set(x, y, z);
		r.mesh.scale.set(size, 1, size);
		r.mesh.visible = true;
	}

	function leaf(x, y, z, r, g, b, vx = 0, vy = 0, vz = 0) {
		const it = leaves.take(r, g, b);
		Object.assign(it, {
			life: 5 + Math.random() * 3,
			max: 8,
			x, y, z,
			vx: vx + (Math.random() - 0.5) * 0.3,
			vy,
			vz: vz + (Math.random() - 0.5) * 0.3,
			s: 0.05 + Math.random() * 0.05,
			rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
			wx: (Math.random() - 0.5) * 5, wy: (Math.random() - 0.5) * 3, wz: (Math.random() - 0.5) * 5,
			phase: Math.random() * 6,
		});
	}

	/** Dust where a foot lands (kind 0), or a drop of water (kind 1). */
	function bit(kind, x, y, z, vx, vy, vz, s, life) {
		const shade = kind ? 0.92 + Math.random() * 0.1 : 0.78 + Math.random() * 0.2;
		const it = bits.take(...(kind ? [shade * 0.82, shade * 0.97, shade] : [shade * 0.74, shade * 0.62, shade * 0.42]));
		Object.assign(it, {
			kind, life, max: life, x, y, z, vx, vy, vz, s,
			rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
			wx: (Math.random() - 0.5) * 3, wy: (Math.random() - 0.5) * 3, wz: (Math.random() - 0.5) * 3,
		});
	}

	function puff(x, y, z, count, spread, size) {
		for (let i = 0; i < count; i++) {
			const a = Math.random() * Math.PI * 2;
			const v = spread * (0.5 + Math.random() * 0.8);
			bit(0, x + Math.cos(a) * 0.1, y + 0.05, z + Math.sin(a) * 0.1, Math.cos(a) * v, 0.5 + Math.random() * 0.9 * spread, Math.sin(a) * v, size * (0.6 + Math.random() * 0.8), 0.55 + Math.random() * 0.5);
		}
	}

	function splash(x, z, count, power) {
		for (let i = 0; i < count; i++) {
			const a = Math.random() * Math.PI * 2;
			const v = power * (0.5 + Math.random() * 1.5);
			bit(1, x + Math.cos(a) * 0.25, SEA + 0.04, z + Math.sin(a) * 0.25, Math.cos(a) * v, power * (1.2 + Math.random() * 1.7), Math.sin(a) * v, 0.03 + Math.random() * 0.075, 0.6 + Math.random() * 0.8);
		}
	}

	function update(dt, t, wind) {
		let live = 0;
		for (let i = 0; i < leaves.items.length; i++) {
			const it = leaves.items[i];
			if (it.life <= 0) {
				dummy.scale.setScalar(0);
			} else {
				it.life -= dt;
				const ground = Math.max(heightAt(it.x, it.z), SEA) + 0.03;
				if (it.y > ground) {
					// A leaf falls slowly and side to side.
					const flutter = Math.sin(t * 2.4 + it.phase);
					it.vx += (wind * 0.38 + flutter * 0.7 - it.vx * 1.6) * dt;
					it.vz += (wind * 0.14 + Math.cos(t * 1.9 + it.phase) * 0.6 - it.vz * 1.6) * dt;
					it.vy += (-1.0 - it.vy * 1.9) * dt;
					it.x += it.vx * dt;
					it.y += it.vy * dt;
					it.z += it.vz * dt;
					it.rx += it.wx * dt;
					it.ry += it.wy * dt;
					it.rz += it.wz * dt;
				} else {
					// Down: lies flat, then goes.
					it.y = ground;
					it.rx = it.rz = 0;
					it.life = Math.min(it.life, 1.8);
				}
				dummy.position.set(it.x, it.y, it.z);
				dummy.rotation.set(it.rx, it.ry, it.rz);
				dummy.scale.setScalar(it.s * Math.min(1, it.life / 0.6) * 2.2);
				live++;
			}
			dummy.updateMatrix();
			leaves.mesh.setMatrixAt(i, dummy.matrix);
		}
		leaves.mesh.visible = live > 0;
		if (live || leaves.wasLive) leaves.mesh.instanceMatrix.needsUpdate = true;
		leaves.wasLive = live > 0;

		live = 0;
		for (let i = 0; i < bits.items.length; i++) {
			const it = bits.items[i];
			if (it.life <= 0) {
				dummy.scale.setScalar(0);
			} else {
				it.life -= dt;
				const u = 1 - it.life / it.max;
				if (it.kind) {
					it.vy -= 9 * dt;
				} else {
					const drag = Math.exp(-3.4 * dt);
					it.vx *= drag;
					it.vz *= drag;
					it.vy = it.vy * drag + 0.25 * dt;
				}
				it.x += it.vx * dt;
				it.y += it.vy * dt;
				it.z += it.vz * dt;
				if (it.kind && it.y < SEA && it.vy < 0) it.life = 0;
				dummy.position.set(it.x, it.y, it.z);
				dummy.rotation.set(it.rx + it.wx * u, it.ry + it.wy * u, it.rz + it.wz * u);
				dummy.scale.setScalar(it.kind ? it.s * Math.min(1, it.life * 5) : it.s * Math.min(1, u * 7) * (1 - u) ** 0.7 * 1.5);
				live++;
			}
			dummy.updateMatrix();
			bits.mesh.setMatrixAt(i, dummy.matrix);
		}
		bits.mesh.visible = live > 0;
		if (live || bits.wasLive) bits.mesh.instanceMatrix.needsUpdate = true;
		bits.wasLive = live > 0;

		for (const r of rings) {
			if (r.life <= 0) continue;
			r.life -= dt;
			const u = 1 - r.life / r.max;
			const s = r.size + r.grow * (1 - (1 - u) ** 2);
			r.mesh.scale.set(s, 1, s);
			r.mesh.material.opacity = 0.75 * (1 - u) ** 1.4;
			if (r.life <= 0) r.mesh.visible = false;
		}
	}

	/** Puts one of everything in view, so the warm-up compiles and uploads it all; clear() takes it away again. */
	function warm(x, y, z) {
		leaf(x, y + 2, z, 0.8, 0.8, 0.3);
		puff(x + 1, y, z, 2, 1, 0.2);
		splash(x + 1, z, 2, 1);
		ring(x, y + 0.1, z, 0.5, 1, 1);
		update(0.001, 0, 0);
	}
	function clear() {
		for (const it of leaves.items) it.life = 0;
		for (const it of bits.items) it.life = 0;
		for (const r of rings) {
			r.life = 0;
			r.mesh.visible = false;
		}
		update(0, 0, 0);
	}

	return { leaf, puff, splash, ring, update, warm, clear };
}
