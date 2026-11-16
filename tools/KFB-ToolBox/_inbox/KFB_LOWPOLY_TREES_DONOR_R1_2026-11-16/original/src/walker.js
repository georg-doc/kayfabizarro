// A tree that gets up and walks: the generator's rig and motion presets (walk, stomp, attack, wind), plus what a scene
// has to add around them: moving over the ground, turning to face the way it goes, jumping, wading, swinging its vines.
// Copy this into a game as it is; it only needs heightAt, SEA and the effects it's given.
import * as THREE from 'three';
import { createLowpolyTreeRig, updateLowpolyTreePresetRig, updateLowpolyTreeWalkRig } from '@rand-monster/lowpoly-tree-generator/animation';
import { SEA, heightAt, shared } from './world.js';

// The strengths and speeds the generator's own live profile starts from (src/profile.js).
const WALK = { duration: 1.12, strength: 1.48, speed: 1.15 };
const RUN = { duration: 0.62, strength: 2.18, speed: 2.7 };
const ACTIONS = {
	attack: { duration: 0.85, strength: 2.05, hit: 0.46, length: 1.0 },
	stomp: { duration: 0.9, strength: 2.2, hit: 0.66, length: 1.05 },
};
const GRAVITY = 15;
const JUMP = 6.3;
const CROUCH = 0.13;
/** The deepest it wades, in metres under the sea. */
export const DEEPEST = 1.15;

const damp = (a, b, rate, dt) => b + (a - b) * Math.exp(-rate * dt);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const v = new THREE.Vector3();
const spot = new THREE.Vector3();
const paint = new THREE.Color();

const unpack = ({ position, normal, color, index }) => {
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.BufferAttribute(position, 3));
	g.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
	g.setAttribute('color', new THREE.BufferAttribute(color, 3));
	g.setIndex(new THREE.BufferAttribute(index, 1));
	return g;
};

/**
 * The generator's vines are a still mesh, and the rig doesn't know about them. Here each is skinned onto the rig: a vine
 * tied at both ends is shared between those branches, and a free one hangs from a chain of three bones of its own, tied
 * to its branch, which the walker swings.
 */
function hangVines(root, rig, vines, material) {
	if (!vines.length) return { mesh: null, swings: [], skeleton: null };
	const boneOf = ({ level, index }) => {
		if (level === 'secondary') return rig.secondaryBoneChains[index]?.at(-1);
		if (level === 'primary') return rig.primaryBoneChains[index]?.at(-1);
		return rig.trunkBones.at(-1);
	};
	const anchorPoint = (recipeAnchor) => new THREE.Vector3().fromArray(recipeAnchor.position);
	const bones = [];
	const add = (bone) => {
		const at = bones.indexOf(bone);
		if (at >= 0) return at;
		bones.push(bone);
		return bones.length - 1;
	};
	const swings = [];
	const parts = [];
	for (const { vine, geometry } of vines) {
		const g = unpack(geometry);
		const count = g.getAttribute('position').count;
		const skinIndex = new Uint16Array(count * 4);
		const skinWeight = new Float32Array(count * 4);
		const position = g.getAttribute('position');
		const start = anchorPoint(vine.start);
		const startBone = boneOf(vine.start) ?? rig.trunkBones.at(-1);
		if (vine.end) {
			const end = anchorPoint(vine.end);
			const a = add(startBone);
			const b = add(boneOf(vine.end) ?? startBone);
			const along = end.clone().sub(start);
			const span = Math.max(along.lengthSq(), 1e-4);
			for (let i = 0; i < count; i++) {
				const u = THREE.MathUtils.clamp(v.fromBufferAttribute(position, i).sub(start).dot(along) / span, 0, 1);
				skinIndex[i * 4] = a;
				skinIndex[i * 4 + 1] = b;
				skinWeight[i * 4] = 1 - u;
				skinWeight[i * 4 + 1] = u;
			}
		} else {
			// Three joints down the vine; each vertex follows the two nearest.
			const joints = [];
			let parent = startBone;
			root.updateMatrixWorld(true);
			let parentAt = parent.getWorldPosition(new THREE.Vector3());
			for (let j = 0; j < 3; j++) {
				const at = start.clone();
				at.y -= (vine.length * j) / 3;
				const bone = new THREE.Bone();
				bone.position.copy(at).sub(parentAt);
				parent.add(bone);
				parent = bone;
				parentAt = at;
				joints.push(bone);
			}
			const ids = joints.map(add);
			for (let i = 0; i < count; i++) {
				const u = THREE.MathUtils.clamp((start.y - position.getY(i)) / Math.max(vine.length, 0.01), 0, 1) * 3;
				const j = Math.min(2, Math.floor(u));
				const f = j === 2 ? 0 : u - j;
				skinIndex[i * 4] = ids[j];
				skinIndex[i * 4 + 1] = ids[Math.min(2, j + 1)];
				skinWeight[i * 4] = 1 - f;
				skinWeight[i * 4 + 1] = f;
			}
			swings.push({ joints, phase: vine.phase, x: [0, 0, 0], z: [0, 0, 0], vx: [0, 0, 0], vz: [0, 0, 0], dirX: Math.cos(vine.phase), dirZ: Math.sin(vine.phase) });
		}
		g.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndex, 4));
		g.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeight, 4));
		parts.push(g);
	}
	let vertexCount = 0;
	let indexCount = 0;
	for (const g of parts) {
		vertexCount += g.getAttribute('position').count;
		indexCount += g.index.count;
	}
	const merged = new THREE.BufferGeometry();
	const buffers = { position: new Float32Array(vertexCount * 3), normal: new Float32Array(vertexCount * 3), color: new Float32Array(vertexCount * 3), skinIndex: new Uint16Array(vertexCount * 4), skinWeight: new Float32Array(vertexCount * 4) };
	const indices = new Uint32Array(indexCount);
	let vertexAt = 0;
	let indexAt = 0;
	for (const g of parts) {
		for (const [name, buffer] of Object.entries(buffers)) buffer.set(g.getAttribute(name).array, vertexAt * g.getAttribute(name).itemSize);
		for (let i = 0; i < g.index.count; i++) indices[indexAt + i] = g.index.getX(i) + vertexAt;
		vertexAt += g.getAttribute('position').count;
		indexAt += g.index.count;
	}
	for (const [name, buffer] of Object.entries(buffers)) merged.setAttribute(name, new THREE.BufferAttribute(buffer, name.startsWith('skin') ? 4 : 3));
	merged.setIndex(new THREE.BufferAttribute(indices, 1));
	const mesh = new THREE.SkinnedMesh(merged, material);
	mesh.castShadow = mesh.receiveShadow = true;
	mesh.frustumCulled = false;
	root.add(mesh);
	root.updateMatrixWorld(true);
	const skeleton = new THREE.Skeleton(bones);
	mesh.bind(skeleton);
	return { mesh, swings, skeleton };
}

const HOME_YAW = 0.5;

export function createWalker(scene, fx, { onHit } = {}) {
	const holder = new THREE.Group();
	holder.rotation.order = 'YXZ';
	scene.add(holder);
	const material = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });

	let shown = null; // { root, rig, geometry, vines, recipe, crownSpots, tips, height }
	const body = { x: 0, z: 0, y: heightAt(0, 0), yaw: HOME_YAW, speed: 0, blend: 0, run: 0, phase: 0, lastStep: 0, vx: 0, vz: 0 };
	const size = { value: 1, velocity: 0 };
	const squash = { value: 1, velocity: 0 };
	const sink = { value: 0, velocity: 0 };
	const shock = { age: 99 };
	let target = null;
	// Keys held: a direction on the ground and whether to run, for as long as they're down.
	let steering = null;
	let air = null; // { crouch, y, vy }
	let action = null; // { kind, t, done }
	let queued = null;
	let pose = 'none';
	let leafTimer = 0;

	const inWater = (x, z) => heightAt(x, z) < SEA - 0.05;

	function setTree(result, { pop = true } = {}) {
		const started = performance.now();
		const geometry = unpack(result.tree);
		const root = new THREE.Group();
		const mesh = new THREE.Mesh(geometry, material);
		mesh.name = 'csg-union-wood-and-lowpoly-canopy';
		mesh.castShadow = mesh.receiveShadow = true;
		mesh.frustumCulled = false;
		root.add(mesh);
		const rig = createLowpolyTreeRig(root, result.recipe);
		rig.mesh.frustumCulled = false;
		const vines = hangVines(root, rig, result.vines, material);
		// Where leaves can fall from: the crown's corners, with their colours.
		const bark = paint.set(result.recipe.params?.barkColor ?? 0x000000).clone();
		const position = geometry.getAttribute('position');
		const colors = geometry.getAttribute('color');
		const crownSpots = [];
		let height = 0;
		for (let i = 0; i < position.count; i++) {
			height = Math.max(height, position.getY(i));
			if (Math.abs(colors.getX(i) - bark.r) + Math.abs(colors.getY(i) - bark.g) + Math.abs(colors.getZ(i) - bark.b) > 0.04) crownSpots.push(i);
		}
		// Leaves take the crown's lit colours, not its dark undersides.
		const light = (i) => colors.getX(i) + colors.getY(i) + colors.getZ(i);
		crownSpots.sort((a, b) => light(b) - light(a));
		crownSpots.length = Math.ceil(crownSpots.length * 0.45);
		let reach = 0;
		for (const i of crownSpots) reach = Math.max(reach, Math.hypot(position.getX(i), position.getZ(i)));
		const tips = (result.recipe.roots ?? []).map((root) => new THREE.Vector3().fromArray(root.points.at(-1)));
		const old = shown;
		shown = { root, rig, geometry, position, colors, vines, recipe: result.recipe, crownSpots, tips, height, reach };
		holder.add(root);
		if (old) {
			holder.remove(old.root);
			old.geometry.dispose();
			old.rig.skeleton.dispose();
			old.vines.mesh?.geometry.dispose();
			old.vines.skeleton?.dispose();
		}
		if (pop) {
			size.value = 0.62;
			size.velocity = 0;
			shed(10, 0.6);
		}
		return performance.now() - started;
	}

	const inWorld = (out, local) => out.copy(local).applyMatrix4(holder.matrixWorld);

	function shed(count, kick) {
		if (!shown?.crownSpots.length) return;
		for (let k = 0; k < count; k++) {
			const i = shown.crownSpots[Math.floor(Math.random() * shown.crownSpots.length)];
			inWorld(v, spot.fromBufferAttribute(shown.position, i));
			fx.leaf(v.x, v.y, v.z, shown.colors.getX(i), shown.colors.getY(i), shown.colors.getZ(i), (Math.random() - 0.5) * kick, Math.random() * kick, (Math.random() - 0.5) * kick);
		}
	}

	function footfall(parity, strength) {
		if (!shown) return;
		for (let i = 0; i < shown.tips.length; i++) {
			if (i % 2 !== parity) continue;
			inWorld(v, shown.tips[i]);
			const y = heightAt(v.x, v.z);
			if (y < SEA - 0.03) {
				fx.splash(v.x, v.z, 3, 0.55 + strength * 0.2);
				fx.ring(v.x, SEA + 0.02, v.z, 0.12, 0.9, 0.9);
			} else {
				fx.puff(v.x, y, v.z, 2, 0.55 + strength * 0.3, 0.06 + strength * 0.03);
			}
		}
	}

	function landed(power) {
		const wet = inWater(body.x, body.z);
		squash.value = Math.min(squash.value, 0.74);
		squash.velocity = -1.6;
		shed(26 + Math.round(power * 10), 1.2);
		onHit?.(power);
		if (wet) {
			sink.velocity = -2.6;
			fx.splash(body.x, body.z, 70, 2 * power);
			fx.ring(body.x, SEA + 0.02, body.z, 0.5, 3.4, 1.3);
			fx.ring(body.x, SEA + 0.02, body.z, 0.3, 2.2, 1);
		} else {
			for (let k = 0; k < 9; k++) {
				const a = (k / 9) * Math.PI * 2 + Math.random();
				fx.puff(body.x + Math.cos(a) * 0.9, heightAt(body.x, body.z), body.z + Math.sin(a) * 0.9, 2, 1.25 * power, 0.13);
			}
			fx.ring(body.x, body.y + 0.06, body.z, 0.5, 3, 0.55);
			shared.uShock.value.set(body.x, body.z, 0, 1);
			shock.age = 0;
		}
	}

	function act(kind) {
		if (kind === 'jump') {
			if (!air) air = { crouch: CROUCH, y: 0, vy: 0 };
			return;
		}
		if (air || action) return;
		queued = kind;
		target = null;
	}

	/** Stands still where it is, at once. */
	function stop() {
		target = null;
		steering = null;
	}

	/** Back to where it began: the first place, facing the first way, standing still, with nothing left in the air. */
	function reset() {
		stop();
		air = null;
		action = null;
		queued = null;
		pose = 'none';
		Object.assign(body, { x: 0, z: 0, y: heightAt(0, 0), yaw: HOME_YAW, speed: 0, blend: 0, run: 0, phase: 0, vx: 0, vz: 0 });
		Object.assign(squash, { value: 1, velocity: 0 });
		Object.assign(sink, { value: 0, velocity: 0 });
		Object.assign(size, { value: 1, velocity: 0 });
		shock.age = 99;
		for (const swing of shown?.vines.swings ?? []) {
			for (const axis of [swing.x, swing.z, swing.vx, swing.vz]) axis.fill(0);
		}
	}

	function update(dt, t, { wind = 1, speed = 1 } = {}) {
		if (!shown) return;
		const { rig } = shown;

		if (queued && body.blend < 0.06) {
			action = { kind: queued, t: 0, done: false };
			queued = null;
		}

		// Going somewhere.
		let want = 0;
		let wantRun = 0;
		const free = !action && !queued;
		if (steering && free) {
			const off = wrap(Math.atan2(steering.x, steering.z) - body.yaw);
			body.yaw = wrap(body.yaw + off * (1 - Math.exp(-7 * dt)));
			const facing = Math.max(0, Math.cos(off));
			wantRun = steering.run ? 1 : 0;
			want = THREE.MathUtils.lerp(WALK.speed, RUN.speed, wantRun) * speed * facing * facing;
		} else if (target && free) {
			const dx = target.x - body.x;
			const dz = target.z - body.z;
			const dist = Math.hypot(dx, dz);
			if (dist < 0.14 + body.speed * 0.1) {
				target = null;
				footfall(0, 1);
				footfall(1, 1);
			} else {
				const yaw = Math.atan2(dx, dz);
				const off = wrap(yaw - body.yaw);
				body.yaw = wrap(body.yaw + off * (1 - Math.exp(-4.2 * dt)));
				const facing = Math.max(0, Math.cos(off));
				wantRun = dist > 4.6 ? 1 : dist < 2.6 ? 0 : body.run > 0.5 ? 1 : 0;
				want = THREE.MathUtils.lerp(WALK.speed, RUN.speed, wantRun) * speed * facing * facing;
			}
		}
		if (inWater(body.x, body.z)) {
			want *= 0.62;
			wantRun = 0;
		}
		if (pose === 'run') wantRun = 1;
		body.run = damp(body.run, wantRun, 4, dt);
		// It stops faster than it starts, so letting go of a key feels like letting go.
		body.speed = air && !air.crouch ? body.speed : damp(body.speed, want, want < body.speed ? 12 : 5.5, dt);
		const moving = Boolean((steering || target) && free) || air?.crouch === 0;
		body.blend = damp(body.blend, moving || pose === 'walk' || pose === 'run' ? 1 : 0, 6.5, dt);

		const px = body.x;
		const pz = body.z;
		body.x += Math.sin(body.yaw) * body.speed * dt;
		body.z += Math.cos(body.yaw) * body.speed * dt;
		const low = heightAt(body.x, body.z);
		if (low < SEA - DEEPEST) {
			// Too deep to wade: stops at the edge of the shelf.
			body.x = px;
			body.z = pz;
			body.speed = 0;
			body.blend = damp(body.blend, 0, 12, dt);
			target = null;
		}
		const nvx = (body.x - px) / Math.max(dt, 1e-4);
		const nvz = (body.z - pz) / Math.max(dt, 1e-4);
		const ax = (nvx - body.vx) / Math.max(dt, 0.008);
		const az = (nvz - body.vz) / Math.max(dt, 0.008);
		body.vx = nvx;
		body.vz = nvz;

		// Jumping: a crouch, then up.
		let vertical = 0;
		if (air) {
			if (air.crouch > 0) {
				air.crouch -= dt;
				squash.value = damp(squash.value, 0.76, 22, dt);
				squash.velocity = 0;
				if (air.crouch <= 0) {
					air.crouch = 0;
					air.vy = JUMP;
					squash.value = 1.1;
					squash.velocity = 1.2;
					footfall(0, 1);
					footfall(1, 1);
				}
			} else {
				air.vy -= GRAVITY * dt;
				air.y += air.vy * dt;
				vertical = air.vy;
				if (air.y <= 0 && air.vy < 0) {
					air = null;
					landed(1);
					action = { kind: 'stomp', t: ACTIONS.stomp.duration * 0.55, done: true };
				}
			}
		}

		// Springs: the squash of a landing, the pop of a new tree, the bob of a splash.
		for (const [spring, rest, k, c] of [[squash, 1, 190, 13], [size, 1, 170, 15], [sink, 0, 60, 9]]) {
			if (spring === squash && air?.crouch > 0) continue;
			spring.velocity += (-(spring.value - rest) * k - spring.velocity * c) * dt;
			spring.value += spring.velocity * dt;
		}

		// On the ground, following it smoothly.
		body.y = damp(body.y, low, 11, dt);
		const lift = air ? air.y : 0;
		const stride = THREE.MathUtils.lerp(WALK.duration, RUN.duration, body.run) / Math.max(0.5, speed);
		const previous = body.phase;
		if (body.blend > 0.02 || pose === 'walk' || pose === 'run') body.phase += dt / stride;
		const strength = body.blend * THREE.MathUtils.lerp(WALK.strength, RUN.strength, body.run);
		// A waddle on top of the preset's own step: it has no legs, so it rocks.
		const cycle = body.phase * Math.PI * 2;
		const rock = Math.sin(cycle) * 0.035 * body.blend * (1 + body.run * 0.6);
		const hop = Math.abs(Math.sin(cycle)) * 0.1 * body.blend * (1 + body.run);
		holder.position.set(body.x, body.y + lift + sink.value + hop, body.z);
		let lean = body.speed * 0.028 + THREE.MathUtils.clamp(vertical * 0.012, -0.08, 0.08);

		// Motion: a preset action, or the walk preset with the wind on top. Both start from the rest pose.
		const windDuration = 4.2;
		if (action) {
			const a = ACTIONS[action.kind];
			action.t += dt;
			const u = action.t / a.duration;
			if (action.kind === 'attack') lean += 0.46 * Math.sin(Math.PI * Math.min(1, u)) ** 2 - 0.2 * Math.sin(Math.PI * Math.min(1, u * 2.4)) * (u < 0.42 ? 1 : 0);
			updateLowpolyTreePresetRig(rig, action.kind, Math.min(action.t, a.duration), { duration: a.duration, strength: a.strength, windStrength: wind, windTimeSeconds: t, windDuration });
			if (!action.done && u >= a.hit) {
				action.done = true;
				if (action.kind === 'stomp') landed(0.8);
				else shed(18, 1.5);
			}
			if (action.t >= a.length) action = null;
		} else {
			updateLowpolyTreeWalkRig(rig, body.phase * stride, strength, stride, { windStrength: wind, windTimeSeconds: t, windDuration });
		}
		// A foot comes down twice a stride.
		if (body.blend > 0.35 && !air && Math.floor(previous * 2) !== Math.floor(body.phase * 2)) {
			footfall(Math.floor(body.phase * 2) % 2 === 0 ? 1 : 0, body.run);
			if (Math.random() < 0.5) shed(1, 0.3);
		}
		holder.rotation.set(lean, body.yaw, rock);
		const s = Math.max(0.5, squash.value);
		holder.scale.set(size.value / Math.sqrt(s), size.value * s, size.value / Math.sqrt(s));
		holder.updateMatrixWorld(true);

		// Vines: a chain of springs, pushed back by the way the tree speeds up, and by the wind.
		const cos = Math.cos(body.yaw);
		const sin = Math.sin(body.yaw);
		const localX = ax * cos - az * sin;
		const localZ = ax * sin + az * cos;
		const bump = air ? Math.abs(vertical) * 0.01 : Math.abs(squash.velocity) * 0.05;
		for (const swing of shown.vines.swings) {
			for (let j = 0; j < 3; j++) {
				const gust = Math.sin(t * (1.3 + j * 0.3) + swing.phase * (1 + j)) * 0.05 * wind;
				const toX = THREE.MathUtils.clamp(localZ * 0.03 + rock * 2 + swing.dirZ * bump + gust, -0.8, 0.8);
				const toZ = THREE.MathUtils.clamp(-localX * 0.03 - swing.dirX * bump + gust * 0.7, -0.8, 0.8);
				const k = [22, 15, 10][j];
				swing.vx[j] += (-(swing.x[j] - toX) * k - swing.vx[j] * 2.2) * dt;
				swing.vz[j] += (-(swing.z[j] - toZ) * k - swing.vz[j] * 2.2) * dt;
				swing.x[j] += swing.vx[j] * dt;
				swing.z[j] += swing.vz[j] * dt;
				swing.joints[j].rotation.set(swing.x[j], 0, swing.z[j]);
			}
		}

		// A few leaves always let go, more in a wind.
		leafTimer -= dt * wind;
		if (leafTimer <= 0) {
			leafTimer = 0.7 + Math.random() * 1.6;
			shed(1, 0.1);
		}

		shared.uTree.value.set(body.x, body.y, body.z);
		shared.uLift.value = lift;
		shock.age += dt;
		const u = shock.age / 0.75;
		shared.uShock.value.z = u * 6.5;
		shared.uShock.value.w = Math.max(0, 1 - u);
	}

	return {
		holder,
		body,
		size,
		setTree,
		update,
		act,
		shed,
		stop,
		reset,
		walkTo(x, z) {
			steering = null;
			target = { x, z };
		},
		steer(x, z, run) {
			target = null;
			steering = { x, z, run };
		},
		letGo() {
			steering = null;
		},
		setPose(next) {
			pose = next;
			if (next === 'stomp' || next === 'attack' || next === 'jump') act(next);
		},
		get pose() {
			return pose;
		},
		get moving() {
			return Boolean(target || steering || body.speed > 0.05);
		},
		get reach() {
			return shown?.reach ?? 2.4;
		},
		get busy() {
			return Boolean(air || action || queued);
		},
		get height() {
			return shown?.height ?? 4;
		},
	};
}
