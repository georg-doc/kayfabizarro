// Draws a crowd of Patch's mannequins, a couple of hundred at a time, in under 40 draw calls with shadows. The
// mannequin has a rigid shell on each bone and no skin, so each bone is one InstancedMesh and a figure's pose is a
// matrix per bone: its clips are baked into tables when it loads, then blended by how fast each person is going, with
// the footfalls matched to their speed so the feet don't slide.
//
// For a skinned character, use walker.js instead: one AnimationMixer a person, which is fine for a few dozen.
import { AnimationMixer, BufferAttribute, BufferGeometry, DynamicDrawUsage, InstancedBufferAttribute, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const FPS = 30;
const BONE = 7; // position, quaternion

export class CrowdFigures {
	/** `gltf` is the mannequin; `max` how many can be drawn. */
	constructor(gltf, max = 200) {
		this.max = max;
		this.material = new MeshStandardMaterial({ vertexColors: true, roughness: 0.46, metalness: 0 });
		const root = gltf.scene;
		root.updateMatrixWorld(true);
		// One geometry per bone: everything hanging from it, in its space, with its colour in the vertices. Blender
		// splits a shell with two materials into a group of meshes.
		const groups = new Map();
		const names = new Set(gltf.animations.flatMap((clip) => clip.tracks.map((track) => track.name.split('.')[0])));
		root.traverse((node) => {
			if (!node.isMesh) return;
			let bone = node.parent;
			while (bone && !names.has(bone.name)) bone = bone.parent;
			const list = groups.get(bone) ?? [];
			list.push(node);
			groups.set(bone, list);
		});
		this.bones = [...groups.keys()];
		const inverse = new Matrix4();
		this.meshes = this.bones.map((bone) => {
			inverse.copy(bone.matrixWorld).invert();
			const parts = groups.get(bone).map((mesh) => {
				const g = new BufferGeometry();
				g.setAttribute('position', mesh.geometry.attributes.position.clone());
				g.setAttribute('normal', mesh.geometry.attributes.normal.clone());
				g.setIndex(mesh.geometry.index.clone());
				g.applyMatrix4(new Matrix4().multiplyMatrices(inverse, mesh.matrixWorld));
				const n = g.attributes.position.count;
				const colours = new Float32Array(n * 3);
				for (let i = 0; i < n; i++) mesh.material.color.toArray(colours, i * 3);
				g.setAttribute('color', new BufferAttribute(colours, 3));
				return g;
			});
			const mesh = new InstancedMesh(mergeGeometries(parts), this.material, max);
			mesh.instanceMatrix.setUsage(DynamicDrawUsage);
			mesh.instanceColor = new InstancedBufferAttribute(new Float32Array(max * 3).fill(1), 3);
			mesh.frustumCulled = false;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.count = 0;
			return mesh;
		});
		this.clips = {};
		this.bake(gltf);
		this.gaits = [this.clips.walk, this.clips.jog, this.clips.sprint];
		for (const clip of this.gaits) clip.speed = this.measureSpeed(clip);
		this.idles = [this.clips.idle, this.clips.talk, this.clips.fold];
		this.pose = new Float32Array(this.bones.length * BONE);
		this.poseB = new Float32Array(this.bones.length * BONE);
		this.poseC = new Float32Array(this.bones.length * BONE);
		/** Added to each person's height: a navmesh sits up to a cell above the real floor. */
		this.lift = -0.1;
	}

	/** Samples every clip at 30 fps into a table of each bone's place in the figure. */
	bake(gltf) {
		const root = gltf.scene;
		const q = new Quaternion();
		const p = new Vector3();
		const s = new Vector3();
		const n = this.bones.length;
		for (const source of gltf.animations) {
			const mixer = new AnimationMixer(root);
			mixer.clipAction(source).play();
			const count = Math.max(2, Math.round(source.duration * FPS));
			const table = new Float32Array(count * n * BONE);
			for (let f = 0; f < count; f++) {
				mixer.setTime((f / count) * source.duration);
				root.updateMatrixWorld(true);
				for (let b = 0; b < n; b++) {
					this.bones[b].matrixWorld.decompose(p, q, s);
					table.set([p.x, p.y, p.z, q.x, q.y, q.z, q.w], (f * n + b) * BONE);
				}
			}
			mixer.stopAllAction();
			mixer.uncacheRoot(root);
			this.clips[source.name] = { count, duration: source.duration, table, speed: 0 };
		}
	}

	/** How fast a walking clip carries someone: how far a foot travels on the ground in half a cycle. */
	measureSpeed(clip) {
		const n = this.bones.length;
		const b = this.bones.findIndex((bone) => bone.name === 'LeftFoot');
		let lo = Number.POSITIVE_INFINITY;
		let hi = Number.NEGATIVE_INFINITY;
		for (let f = 0; f < clip.count; f++) {
			const z = clip.table[(f * n + b) * BONE + 2];
			lo = Math.min(lo, z);
			hi = Math.max(hi, z);
		}
		return ((hi - lo) * 2) / clip.duration;
	}

	/** Writes a clip's pose at time 0..1 into `out`. */
	sample(clip, at, out) {
		const n = this.bones.length;
		const f = at * clip.count;
		const a = Math.floor(f) % clip.count;
		const c = (a + 1) % clip.count;
		const k = f - Math.floor(f);
		const t = clip.table;
		for (let b = 0, i = 0; b < n; b++, i += BONE) {
			const A = (a * n + b) * BONE;
			const C = (c * n + b) * BONE;
			out[i] = t[A] + (t[C] - t[A]) * k;
			out[i + 1] = t[A + 1] + (t[C + 1] - t[A + 1]) * k;
			out[i + 2] = t[A + 2] + (t[C + 2] - t[A + 2]) * k;
			const sign = t[A + 3] * t[C + 3] + t[A + 4] * t[C + 4] + t[A + 5] * t[C + 5] + t[A + 6] * t[C + 6] < 0 ? -1 : 1;
			out[i + 3] = t[A + 3] + (sign * t[C + 3] - t[A + 3]) * k;
			out[i + 4] = t[A + 4] + (sign * t[C + 4] - t[A + 4]) * k;
			out[i + 5] = t[A + 5] + (sign * t[C + 5] - t[A + 5]) * k;
			out[i + 6] = t[A + 6] + (sign * t[C + 6] - t[A + 6]) * k;
		}
	}

	/** Blends `other` into `into` by k. The quaternions are normalised when the figure is written. */
	blend(into, other, k) {
		const n = this.bones.length;
		for (let b = 0, i = 0; b < n; b++, i += BONE) {
			into[i] += (other[i] - into[i]) * k;
			into[i + 1] += (other[i + 1] - into[i + 1]) * k;
			into[i + 2] += (other[i + 2] - into[i + 2]) * k;
			const sign = into[i + 3] * other[i + 3] + into[i + 4] * other[i + 4] + into[i + 5] * other[i + 5] + into[i + 6] * other[i + 6] < 0 ? -1 : 1;
			into[i + 3] += (sign * other[i + 3] - into[i + 3]) * k;
			into[i + 4] += (sign * other[i + 4] - into[i + 4]) * k;
			into[i + 5] += (sign * other[i + 5] - into[i + 5]) * k;
			into[i + 6] += (sign * other[i + 6] - into[i + 6]) * k;
		}
	}

	/** Writes the current walking pose for this speed into `out`. */
	gait(v, phase, out, spare) {
		const [walk, jog, sprint] = this.gaits;
		if (v <= walk.speed) return this.sample(walk, phase, out);
		if (v >= sprint.speed) return this.sample(sprint, phase, out);
		const low = v < jog.speed ? walk : jog;
		const high = v < jog.speed ? jog : sprint;
		this.sample(low, phase, out);
		this.sample(high, phase, spare);
		this.blend(out, spare, (v - low.speed) / (high.speed - low.speed));
	}

	/** How far someone goes in one walking cycle at this speed. */
	stride(v) {
		const [walk, jog, sprint] = this.gaits;
		if (v <= walk.speed) return walk.speed * walk.duration;
		if (v >= sprint.speed) return sprint.speed * sprint.duration;
		const low = v < jog.speed ? walk : jog;
		const high = v < jog.speed ? jog : sprint;
		const k = (v - low.speed) / (high.speed - low.speed);
		return low.speed * low.duration * (1 - k) + high.speed * high.duration * k;
	}

	/** Puts everyone where they really are, at full size, with nothing to ease from: for a level coming into view. */
	place(members) {
		for (const m of members) m.show = undefined;
		this.update(members, 0);
		for (const m of members) m.show.grow = 1;
		this.update(members, 0);
	}

	/**
	 * Once a frame: `members` come from CrowdSystem. Each gets its own smoothed place and turn, so a push from a
	 * neighbour never shows as a twitch, its own height and shade, and the pose its speed asks for.
	 */
	update(members, dt) {
		const count = Math.min(members.length, this.max);
		const pose = this.pose;
		const nb = this.bones.length;
		const follow = 1 - Math.exp(-dt * 12);
		const followY = 1 - Math.exp(-dt * 16);
		const walkSpeed = this.gaits[0].speed;
		let recolour = false;
		for (let m = 0; m < count; m++) {
			const a = members[m];
			if (a.show === undefined) {
				a.show = { x: a.x, y: a.y, z: a.z, yaw: Math.random() * Math.PI * 2, speed: 0, grow: 0, phase: Math.random(), idleAt: Math.random(), idle: Math.floor(Math.random() * 3), size: 0.93 + Math.random() * 0.13, rate: 0.9 + Math.random() * 0.2 };
				// A little over 1: the shell's own colour is a mid grey, and among bright houses it should read as white.
				const shade = 1.28 + Math.random() * 0.2;
				const warm = (Math.random() - 0.5) * 0.08;
				for (const mesh of this.meshes) mesh.instanceColor.setXYZ(m, shade * (1 + warm), shade, shade * (1 - warm));
				recolour = true;
			}
			const s = a.show;
			s.x += (a.x - s.x) * follow;
			s.y += (a.y - s.y) * followY;
			s.z += (a.z - s.z) * follow;
			s.speed += (a.speed - s.speed) * (1 - Math.exp(-dt * 7));
			s.grow = Math.min(1, s.grow + dt * 3.5);
			if (a.speed > 0.2) {
				const turn = Math.atan2(a.vx, a.vz) - s.yaw;
				s.yaw += Math.atan2(Math.sin(turn), Math.cos(turn)) * (1 - Math.exp(-dt * 9));
			}
			const v = s.speed;
			s.phase = (s.phase + (dt * Math.max(v, 0.6)) / this.stride(v)) % 1;
			const move = Math.min(1, Math.max(0, (v - 0.12) / (walkSpeed * 0.55)));
			if (move < 1) {
				const clip = this.idles[s.idle];
				const before = s.idleAt;
				s.idleAt = (s.idleAt + (dt / clip.duration) * s.rate) % 1;
				// At the end of a loop, someone standing may shift to another way of standing.
				if (s.idleAt < before && move === 0 && Math.random() < 0.3) s.idle = Math.floor(Math.random() * 3);
				this.sample(this.idles[s.idle], s.idleAt, pose);
				if (move > 0) {
					this.gait(v, s.phase, this.poseB, this.poseC);
					this.blend(pose, this.poseB, move * move * (3 - 2 * move));
				}
			} else {
				this.gait(v, s.phase, pose, this.poseC);
			}
			// Into each bone's instance: figure, then the turn and build, then the world.
			const cy = Math.cos(s.yaw / 2);
			const sy = Math.sin(s.yaw / 2);
			const cos = Math.cos(s.yaw);
			const sin = Math.sin(s.yaw);
			const size = s.size * (s.grow * s.grow * (3 - 2 * s.grow));
			const o = m * 16;
			for (let b = 0, i = 0; b < nb; b++, i += BONE) {
				let qx = pose[i + 3];
				let qy = pose[i + 4];
				let qz = pose[i + 5];
				let qw = pose[i + 6];
				const l = 1 / Math.hypot(qx, qy, qz, qw);
				qx *= l;
				qy *= l;
				qz *= l;
				qw *= l;
				const x = cy * qx + sy * qz;
				const y = cy * qy + sy * qw;
				const z = cy * qz - sy * qx;
				const w = cy * qw - sy * qy;
				const px = pose[i];
				const py = pose[i + 1];
				const pz = pose[i + 2];
				const arr = this.meshes[b].instanceMatrix.array;
				const xx = x * x * 2;
				const xy = x * y * 2;
				const xz = x * z * 2;
				const yy = y * y * 2;
				const yz = y * z * 2;
				const zz = z * z * 2;
				const wx = w * x * 2;
				const wy = w * y * 2;
				const wz = w * z * 2;
				arr[o] = (1 - (yy + zz)) * size;
				arr[o + 1] = (xy + wz) * size;
				arr[o + 2] = (xz - wy) * size;
				arr[o + 3] = 0;
				arr[o + 4] = (xy - wz) * size;
				arr[o + 5] = (1 - (xx + zz)) * size;
				arr[o + 6] = (yz + wx) * size;
				arr[o + 7] = 0;
				arr[o + 8] = (xz + wy) * size;
				arr[o + 9] = (yz - wx) * size;
				arr[o + 10] = (1 - (xx + yy)) * size;
				arr[o + 11] = 0;
				arr[o + 12] = s.x + (cos * px + sin * pz) * size;
				arr[o + 13] = s.y + this.lift + py * size;
				arr[o + 14] = s.z + (-sin * px + cos * pz) * size;
				arr[o + 15] = 1;
			}
		}
		for (const mesh of this.meshes) {
			mesh.count = count;
			mesh.instanceMatrix.clearUpdateRanges();
			mesh.instanceMatrix.addUpdateRange(0, count * 16);
			mesh.instanceMatrix.needsUpdate = true;
			if (recolour) mesh.instanceColor.needsUpdate = true;
		}
	}
}
