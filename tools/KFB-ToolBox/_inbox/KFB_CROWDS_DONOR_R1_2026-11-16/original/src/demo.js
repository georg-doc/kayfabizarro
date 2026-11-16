// The crowds block's demo: a crowd of Patch's mannequins on a small diorama. A left click sends them there, around the
// buildings and each other; a right click drops a stone block in the way and they find another way. The navigation
// is Recast and Detour through recast-navigation-js (navigation.js, crowd.js); the levels are Kenney's kits (levels.js);
// Patch's block page steers it through Patch's block demo helper (lib/patch-block.js), with its controls in recipe.json.
import { NeutralToneMapping, CanvasTexture, Color, DirectionalLight, DoubleSide, Group, HalfFloatType, HemisphereLight, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, PCFShadowMap, PerspectiveCamera, PMREMGenerator, Raycaster, RingGeometry, Scene, SphereGeometry, SpriteMaterial, Sprite, SRGBColorSpace, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget, BackSide, ShaderMaterial } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { N8AOPass } from 'n8ao';
import { NavMeshHelper } from '@recast-navigation/three';
import { patchBlock } from 'patch-block';
import { block as recipeBlock } from '../recipe.json';
import { initNavigation, Navigation } from './navigation.js';
import { CrowdSystem, MOVING } from './crowd.js';
import { CrowdFigures } from './figures.js';
import { castle, Kit, market, maze } from './levels.js';

const MAX_PEOPLE = 200;
const MAX_BLOCKS = 12;
/** How fast they walk the level before anyone's sent them, m/s. */
const TOUR_SPEED = 1.4;
const canvas = document.getElementById('view');
const label = document.getElementById('label');

/** The orbit camera: a target, a turn, a tilt and a distance, each easing to where it's asked. */
class Orbit {
	constructor(camera) {
		this.camera = camera;
		this.target = new Vector3();
		this.yaw = 0;
		this.pitch = 0.7;
		this.distance = 50;
		this.want = { target: new Vector3(), yaw: 0, pitch: 0.7, distance: 50 };
	}

	frame(f, snap) {
		this.want.target.set(...f.target);
		this.want.yaw = f.yaw;
		this.want.pitch = f.pitch;
		this.want.distance = f.distance;
		this.min = f.distance * 0.3;
		this.max = f.distance * 1.3;
		if (snap) {
			this.target.copy(this.want.target);
			this.yaw = f.yaw;
			this.pitch = f.pitch;
			this.distance = f.distance;
		}
	}

	update(dt) {
		const k = 1 - Math.exp(-dt * 8);
		this.target.lerp(this.want.target, k);
		this.yaw += (this.want.yaw - this.yaw) * k;
		this.pitch += (this.want.pitch - this.pitch) * k;
		this.distance += (this.want.distance - this.distance) * k;
		const c = this.camera;
		const cp = Math.cos(this.pitch);
		c.position.set(this.target.x + Math.sin(this.yaw) * cp * this.distance, this.target.y + Math.sin(this.pitch) * this.distance, this.target.z + Math.cos(this.yaw) * cp * this.distance);
		c.lookAt(this.target);
	}
}

/** A level with its navmesh, crowd and blocks, all made before ready so a switch is instant. */
class Stage {
	constructor(level) {
		this.level = level;
		this.navigation = new Navigation([level.walk], { agentRadius: 0.36, agentHeight: 1.9, stepHeight: 0.55, cellSize: 0.2, cellHeight: 0.1, maxObstacles: 48 });
		const home = this.navigation.closest(level.home, { x: 8, y: 6, z: 8 });
		this.crowd = new CrowdSystem(this.navigation, { home, maxAgents: MAX_PEOPLE, speed: 3, range: 70 });
		this.overlay = new NavMeshHelper(this.navigation.navMesh, { navMeshMaterial: overlayMaterial() });
		this.overlay.visible = false;
		this.overlay.position.y = 0.06;
		this.overlay.traverse((node) => {
			node.renderOrder = 2;
			node.castShadow = false;
			node.receiveShadow = false;
		});
		level.group.add(this.overlay);
		this.blocks = [];
		// Until someone sends them, the crowd walks the level from one good spot to the next.
		this.taken = false;
		this.leg = -1;
		this.legTime = 0;
	}
}

function overlayMaterial() {
	return new MeshBasicMaterial({ color: '#7df2ff', transparent: true, opacity: 0.38, depthWrite: false, side: DoubleSide });
}

class App {
	constructor(v) {
		this.v = v;
		this.visible = true;
		this.renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.toneMapping = NeutralToneMapping;
		this.renderer.toneMappingExposure = 0.94;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = PCFShadowMap;
		this.pixelRatio = Math.min(devicePixelRatio || 1, 2);
		this.renderer.setPixelRatio(this.pixelRatio);
		this.scene = new Scene();
		this.camera = new PerspectiveCamera(30, 16 / 9, 2, 300);
		this.orbit = new Orbit(this.camera);
		this.ray = new Raycaster();
		this.pointer = new Vector2();
		this.frameTimes = [];
		this.sky();
		this.lights();
		this.post();
	}

	sky() {
		// A soft evening: the glow low in the west, deep blue above. It's the picture's backdrop and its reflections.
		const dome = new Mesh(
			new SphereGeometry(200, 32, 16),
			new ShaderMaterial({
				side: BackSide,
				depthWrite: false,
				fog: false,
				uniforms: {},
				vertexShader: 'varying vec3 d; void main(){ d = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; }',
				fragmentShader: `varying vec3 d;
					void main(){
						// Seen from above it's mostly the haze below the horizon: deep blue under the island, warm far off.
						float h = normalize(d).y;
						vec3 deep = vec3(0.17, 0.25, 0.5);
						vec3 haze = vec3(0.56, 0.5, 0.68);
						vec3 glow = vec3(0.98, 0.7, 0.52);
						vec3 high = vec3(0.45, 0.58, 0.86);
						vec3 c = mix(deep, haze, smoothstep(-0.95, -0.42, h));
						c = mix(c, glow, smoothstep(-0.42, -0.02, h));
						c = mix(c, high, smoothstep(0.0, 0.55, h));
						gl_FragColor = vec4(c, 1.0);
					}`,
			}),
		);
		dome.frustumCulled = false;
		const envScene = new Scene();
		envScene.add(dome.clone());
		const pmrem = new PMREMGenerator(this.renderer);
		this.scene.environment = pmrem.fromScene(envScene, 0.04).texture;
		this.scene.environmentIntensity = 0.55;
		pmrem.dispose();
		this.scene.add(dome);
	}

	lights() {
		const sun = new DirectionalLight('#ffe0ba', 3.2);
		sun.position.set(-36, 34, 24);
		sun.castShadow = true;
		sun.shadow.mapSize.set(2048, 2048);
		const r = 30;
		Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 5, far: 110 });
		sun.shadow.bias = -0.0004;
		sun.shadow.normalBias = 0.035;
		sun.shadow.radius = 2.2;
		this.sun = sun;
		this.scene.add(sun, sun.target);
		// Light from the sky and off the ground: the shadows come out violet and warm, not black.
		this.scene.add(new HemisphereLight('#cfd0ff', '#e6bd94', 1.45));
	}

	post() {
		const target = new WebGLRenderTarget(4, 4, { type: HalfFloatType, samples: 0 });
		this.composer = new EffectComposer(this.renderer, target);
		this.composer.setPixelRatio(this.pixelRatio);
		this.ao = new N8AOPass(this.scene, this.camera, 4, 4);
		Object.assign(this.ao.configuration, { aoRadius: 1.7, distanceFalloff: 1, intensity: 1.9, aoSamples: 12, denoiseSamples: 4, denoiseRadius: 8, halfRes: true, depthAwareUpsampling: true, gammaCorrection: false, screenSpaceRadius: false });
		this.ao.configuration.color = new Color('#2b1f52');
		// Smooth edges: the beauty pass draws with four samples.
		this.ao.beautyRenderTarget.samples = 4;
		this.composer.addPass(this.ao);
		this.composer.addPass(new OutputPass());
		// The same picture without ambient occlusion, for a weak graphics card: warmed up with the rest, so turning to it
		// compiles nothing.
		this.plain = new EffectComposer(this.renderer, new WebGLRenderTarget(4, 4, { type: HalfFloatType, samples: 2 }));
		this.plain.setPixelRatio(this.pixelRatio);
		this.plain.addPass(new RenderPass(this.scene, this.camera));
		this.plain.addPass(new OutputPass());
		this.usePlain = false;
		this.shadowHalf = false;
		this.tick = 0;
	}

	resize() {
		const w = canvas.clientWidth || innerWidth;
		const h = canvas.clientHeight || innerHeight;
		if (w === this.w && h === this.h) return;
		this.w = w;
		this.h = h;
		this.renderer.setSize(w, h, false);
		this.composer.setSize(w, h);
		this.plain.setSize(w, h);
		this.camera.aspect = w / h;
		// Keep the whole level in a tall frame.
		this.camera.fov = w / h < 1.1 ? 30 * (1.1 / (w / h)) : 30;
		this.camera.updateProjectionMatrix();
	}

	async load() {
		const loader = new GLTFLoader();
		const [town, keep, figure] = await Promise.all([loader.loadAsync('./models/kit-town.glb'), loader.loadAsync('./models/kit-castle.glb'), loader.loadAsync('./models/mannequin.glb'), initNavigation()]);
		const townKit = new Kit(town);
		const keepKit = new Kit(keep);
		this.stages = {
			market: new Stage(market(townKit)),
			castle: new Stage(castle(keepKit, townKit)),
			maze: new Stage(maze(townKit)),
		};
		this.figures = new CrowdFigures(figure, MAX_PEOPLE);
		this.people = new Group();
		this.people.add(...this.figures.meshes);
		this.scene.add(this.people);
		this.makeBlocks();
		this.makeMarkers();
	}

	/** The pool of stone blocks and their dust, so a block never costs a thing the first time. */
	makeBlocks() {
		const geometry = new RoundedBoxGeometry(2.8, 2, 2.8, 3, 0.16);
		geometry.translate(0, 1, 0);
		const material = new MeshStandardMaterial({ color: '#d4cede', roughness: 0.82 });
		this.blockPool = [];
		for (let i = 0; i < MAX_BLOCKS; i++) {
			const mesh = new Mesh(geometry, material);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.visible = false;
			this.scene.add(mesh);
			this.blockPool.push(mesh);
		}
		const c = document.createElement('canvas');
		c.width = c.height = 64;
		const x = c.getContext('2d');
		const g = x.createRadialGradient(32, 32, 2, 32, 32, 32);
		g.addColorStop(0, 'rgba(255,248,235,0.75)');
		g.addColorStop(0.5, 'rgba(240,226,206,0.28)');
		g.addColorStop(1, 'rgba(240,226,206,0)');
		x.fillStyle = g;
		x.fillRect(0, 0, 64, 64);
		const map = new CanvasTexture(c);
		map.colorSpace = SRGBColorSpace;
		this.dust = [];
		for (let i = 0; i < 28; i++) {
			const s = new Sprite(new SpriteMaterial({ map, transparent: true, depthWrite: false, opacity: 0 }));
			s.visible = false;
			this.scene.add(s);
			this.dust.push({ s, age: 1, life: 1, vx: 0, vz: 0, vy: 0 });
		}
	}

	makeMarkers() {
		const ring = new Mesh(new RingGeometry(0.72, 0.86, 48).rotateX(-Math.PI / 2), new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
		ring.renderOrder = 3;
		ring.visible = false;
		this.scene.add(ring);
		this.ring = { mesh: ring, age: 9 };
	}

	useStage(id, snap) {
		const stage = this.stages[id];
		if (this.stage) {
			this.scene.remove(this.stage.level.group);
			// Whoever was on the old one stays there, unseen, without moving.
		}
		this.stage = stage;
		this.scene.add(stage.level.group);
		for (const s of Object.values(this.stages)) {
			if (s !== stage) for (const b of s.blocks) b.mesh.visible = false;
		}
		for (const b of stage.blocks) b.mesh.visible = true;
		if (this.v.walkable) stage.overlay.update();
		stage.overlay.visible = this.v.walkable;
		this.applyPeople();
		this.figures.place(stage.crowd.members);
		this.orbit.frame(stage.level.framing, snap);
		const size = stage.level.size * 1.45;
				Object.assign(this.sun.shadow.camera, { left: -size, right: size, top: size, bottom: -size });
		this.sun.shadow.camera.updateProjectionMatrix();
		this.showLabel();
	}

	applyPeople() {
		const crowd = this.stage.crowd;
		crowd.speed = this.v.speed;
		crowd.wander = this.v.wander && this.stage.taken;
		crowd.setSpacing(this.v.spacing);
		const had = crowd.members.length;
		crowd.resize(this.v.crowd);
		// Anyone new sets off straight away, with the others if they're on their way.
		for (let i = had; i < crowd.members.length; i++) crowd.members[i].wait = Math.random() * 0.6;
		if (this.touring(this.stage) && this.stage.spot && crowd.members.length > had) {
			crowd.goTo(this.stage.spot, { members: crowd.members.slice(had), spread: 1.25, hurry: TOUR_SPEED / crowd.speed });
		}
		this.showLabel();
	}

	showLabel() {
		if (!this.started) return;
		label.querySelector('.name').textContent = this.stage.level.name;
		label.querySelector('.k').textContent = `${this.stage.crowd.members.length} people`;
		label.hidden = false;
	}

	set(id, value) {
		this.v[id] = value;
		switch (id) {
			case 'level':
				this.useStage(value, false);
				return;
			case 'crowd':
				this.applyPeople();
				return;
			case 'speed':
				this.stage.crowd.setSpeed(value);
				return;
			case 'walkable':
				if (value) this.stage.overlay.update();
				this.stage.overlay.visible = value;
				return;
			case 'spacing':
				this.stage.crowd.setSpacing(value);
				return;
			case 'wander':
				this.stage.crowd.wander = value && this.stage.taken;
				return;
			default:
		}
	}

	trigger(id) {
		if (id === 'scatter') {
			this.take();
			this.stage.crowd.scatter();
		}
		if (id === 'clear') this.clearBlocks();
	}

	/** Where a pointer position lands on the level, if anywhere. */
	pick(clientX, clientY) {
		const rect = canvas.getBoundingClientRect();
		this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
		this.ray.setFromCamera(this.pointer, this.camera);
		const hits = this.ray.intersectObject(this.stage.level.group, true);
		const hit = hits.find((h) => h.object !== this.stage.overlay.mesh && !h.object.isSprite);
		return hit ? hit.point : null;
	}

	/**
	 * The walkable point for a picked point: straight down from it onto whatever's nearest, but only somewhere the crowd
	 * can get to (a tower's roof is walkable and cut off, so the ground beside it is used instead).
	 */
	walkableAt(point) {
		const nav = this.stage.navigation;
		const near = nav.closest(point, { x: 2.5, y: 3, z: 2.5 }) ?? nav.closest({ x: point.x, y: 0, z: point.z }, { x: 8, y: 6, z: 8 });
		if (!near) return null;
		const route = nav.path(this.stage.crowd.home, near);
		const last = route?.[route.length - 1];
		if (last && (last.x - near.x) ** 2 + (last.z - near.z) ** 2 < 1) return near;
		return nav.closest({ x: point.x, y: 0, z: point.z }, { x: 8, y: 2, z: 8 });
	}

	/** From the first order on, this level's crowd goes where it's told and mills about once it's there. */
	take() {
		this.stage.taken = true;
		this.stage.crowd.wander = this.v.wander;
	}

	sendTo(point) {
		const at = this.walkableAt(point);
		if (!at) return;
		this.take();
		this.stage.crowd.goTo(at);
		this.ring.mesh.position.set(at.x, at.y + 0.04, at.z);
		this.ring.age = 0;
		this.ring.mesh.visible = true;
	}

	touring(stage) {
		return !stage.taken && this.v.wander;
	}

	/** Before the first order: the whole crowd walks to the level's next good spot, each to a place of their own. */
	tour(stage, dt) {
		if (!this.touring(stage)) return;
		const crowd = stage.crowd;
		stage.legTime -= dt;
		const standing = crowd.members.reduce((n, m) => n + (m.state === MOVING ? 0 : 1), 0);
		// On to the next spot as the first of them get there: the crowd is always on its way somewhere.
		if (stage.legTime > 0 && standing < crowd.members.length * 0.35) return;
		const spots = stage.level.tour;
		stage.leg = (stage.leg + 1) % spots.length;
		const [x, y, z] = spots[stage.leg];
		stage.spot = stage.navigation.closest({ x, y, z }, { x: 3, y: 2, z: 3 });
		if (!stage.spot) return;
		stage.legTime = 9;
		crowd.goTo(stage.spot, { spread: 1.25, hurry: TOUR_SPEED / crowd.speed });
	}

	/** A block drops at a point: it blocks the floor as it lands, and the crowd asks for new ways. */
	dropBlock(point) {
		const at = this.stage.navigation.closest(point, { x: 3, y: 3, z: 3 });
		if (!at) return;
		const stage = this.stage;
		// Clicking an old block takes it away instead.
		const old = stage.blocks.find((b) => Math.hypot(b.at.x - point.x, b.at.z - point.z) < 1.9 && b.state !== 'gone');
		if (old) return this.liftBlock(old);
		const all = Object.values(this.stages).flatMap((s) => s.blocks);
		if (all.length >= MAX_BLOCKS) this.liftBlock(stage.blocks[0] ?? all[0], true);
		const mesh = this.blockPool.find((m) => !m.userData.used);
		if (!mesh) return;
		mesh.userData.used = true;
		const yaw = Math.round(this.orbit.yaw / (Math.PI / 2)) * (Math.PI / 2) + (Math.random() - 0.5) * 0.24;
		const block = { mesh, at, yaw, state: 'falling', y: 16, vy: -6, obstacle: null };
		mesh.rotation.y = yaw;
		mesh.position.set(at.x, at.y + block.y, at.z);
		mesh.visible = true;
		stage.blocks.push(block);
	}

	liftBlock(block, now) {
		const stage = Object.values(this.stages).find((s) => s.blocks.includes(block));
		if (block.obstacle) stage.navigation.unblock(block.obstacle);
		block.obstacle = null;
		block.state = 'gone';
		if (now) this.finishBlock(stage, block);
		else this.puff(block.at, 8);
	}

	finishBlock(stage, block) {
		block.mesh.visible = false;
		block.mesh.userData.used = false;
		stage.blocks.splice(stage.blocks.indexOf(block), 1);
	}

	clearBlocks() {
		for (const block of [...this.stage.blocks]) this.liftBlock(block);
	}

	puff(at, count = 16) {
		let n = 0;
		for (const d of this.dust) {
			if (d.age < d.life) continue;
			const t = Math.random() * Math.PI * 2;
			const r = 1.2 + Math.random() * 0.9;
			d.s.position.set(at.x + Math.cos(t) * r, at.y + 0.2 + Math.random() * 0.4, at.z + Math.sin(t) * r);
			const speed = 1.8 + Math.random() * 2.6;
			d.vx = Math.cos(t) * speed;
			d.vz = Math.sin(t) * speed;
			d.vy = 0.3 + Math.random() * 0.8;
			d.age = 0;
			d.life = 0.55 + Math.random() * 0.55;
			d.size = 1.2 + Math.random() * 1.2;
			d.s.visible = true;
			if (++n >= count) break;
		}
	}

	stepBlocks(dt) {
		const stage = this.stage;
		for (const block of [...stage.blocks]) {
			if (block.state === 'falling') {
				block.vy -= 34 * dt;
				block.y += block.vy * dt;
				// The floor's blocked just before it lands, so people are already clearing out from under its shadow.
				if (!block.obstacle && block.y < 3.5) {
					block.obstacle = stage.navigation.block(block.at, 1.45, 1.45, 2.4, block.yaw);
					stage.crowd.shove(block.at, 1.45, 1.45);
				}
				if (block.y <= 0) {
					block.y = 0;
					block.state = 'land';
					block.squash = 0;
					this.puff(block.at, 18);
					this.kick = 1;
				}
				block.mesh.position.y = block.at.y + block.y;
			} else if (block.state === 'land') {
				block.squash += dt * 6;
				const k = Math.max(0, 1 - block.squash) * 0.1;
				block.mesh.scale.set(1 + k * 0.6, 1 - k, 1 + k * 0.6);
				if (block.squash >= 1) {
					block.state = 'still';
					block.mesh.scale.set(1, 1, 1);
				}
			} else if (block.state === 'gone') {
				block.mesh.position.y -= dt * 11;
				if (block.mesh.position.y < block.at.y - 2.2) this.finishBlock(stage, block);
			}
		}
		for (const d of this.dust) {
			if (d.age >= d.life) {
				if (d.s.visible) d.s.visible = false;
				continue;
			}
			d.age += dt;
			const k = d.age / d.life;
			d.s.position.x += d.vx * dt * (1 - k);
			d.s.position.z += d.vz * dt * (1 - k);
			d.s.position.y += d.vy * dt;
			const size = d.size * (0.6 + k * 1.4);
			d.s.scale.set(size, size, size);
			d.s.material.opacity = (1 - k) * 0.7;
		}
	}

	step(dt) {
		const stage = this.stage;
		stage.navigation.update();
		if (stage.overlay.visible && stage.crowd.navigationChanged) stage.overlay.update();
		stage.crowd.update(dt);
		this.tour(stage, dt);
		this.stepBlocks(dt);
		this.figures.update(stage.crowd.members, dt);
		this.orbit.update(dt);
		this.markers(dt);
	}

	/** A ring that spreads out where they've been sent. */
	markers(dt) {
		const r = this.ring;
		if (!r.mesh.visible) return;
		r.age += dt;
		const k = Math.min(1, r.age / 1.1);
		const s = 1 + (1 - (1 - k) ** 3) * 2.6;
		r.mesh.scale.set(s, 1, s);
		r.mesh.material.opacity = (1 - k) * 0.9;
		if (k >= 1) r.mesh.visible = false;
	}

	draw() {
		if (this.shadowHalf) this.sun.shadow.needsUpdate = this.tick++ % 2 === 0;
		(this.usePlain ? this.plain : this.composer).render();
	}

	/** Everything first-use, unseen: each level drawn, with its overlay, a block, dust and the marker. */
	async warmUp() {
		canvas.style.visibility = 'hidden';
		this.resize();
		const first = this.v.level;
		// A frame of every level, so nothing compiles on a switch.
		for (const id of Object.keys(this.stages)) {
			this.useStage(id, true);
			this.stage.overlay.visible = true;
			this.step(1 / 60);
			this.draw();
			this.stage.overlay.visible = this.v.walkable;
			await new Promise((r) => requestAnimationFrame(r));
		}
		this.plain.render();
		// A block, dust and the marker, once each.
		this.useStage(first, true);
		const home = this.stage.crowd.home;
		this.ring.mesh.position.set(home.x, home.y + 0.1, home.z);
		this.ring.mesh.visible = true;
		this.ring.mesh.material.opacity = 0.5;
		for (const b of this.blockPool.slice(0, 1)) {
			b.position.set(home.x, 0.1, home.z);
			b.visible = true;
		}
		for (const d of this.dust.slice(0, 2)) {
			d.s.visible = true;
			d.s.position.set(home.x, 1, home.z);
			d.s.material.opacity = 0.1;
		}
		this.step(1 / 60);
		this.draw();
		await new Promise((r) => requestAnimationFrame(r));
		this.blockPool[0].visible = false;
		for (const d of this.dust) d.s.visible = false;
		this.ring.mesh.visible = false;
		// Real obstacles, in and out, so the first drop doesn't pay for anything either.
		const o = this.stage.navigation.block(home, 1.4, 1.4, 2.4);
		this.stage.navigation.update();
		if (o) this.stage.navigation.unblock(o);
		this.stage.navigation.update();
		// Some seconds of crowd, ahead of time, on every level: everyone is already on their way when it's seen, and paths
		// have been found. Then the first level's figures start exactly where its people are.
		for (const s of Object.values(this.stages)) {
			s.crowd.resize(this.v.crowd);
			const run = (steps) => {
				for (let k = 0; k < steps; k++) {
					this.tour(s, 1 / 30);
					s.crowd.update(1 / 30);
				}
			};
			run(150);
			// A fresh leg just before it's seen, so everyone is in full stride, none of them just arriving.
			s.legTime = 0;
			run(45);
		}
		this.figures.place(this.stage.crowd.members);
		await this.settleQuality();
		// Still unseen, until the graphics card has caught up: a few quick frames in a row, or two seconds at the most.
		// On a first visit the shaders finish linking about now, and none of that may spill past ready.
		const started = performance.now();
		let last = started;
		for (let calm = 0; calm < 6 && performance.now() - started < 2000; ) {
			this.step(1 / 60);
			this.draw();
			await new Promise((r) => requestAnimationFrame(r));
			const now = performance.now();
			calm = now - last < 40 ? calm + 1 : 0;
			last = now;
		}
		canvas.style.visibility = '';
		this.started = true;
		this.showLabel();
	}

	input() {
		let down = null;
		// A right click places a block: it never opens the browser's menu, anywhere in the frame.
		addEventListener('contextmenu', (e) => e.preventDefault());
		canvas.addEventListener('pointerdown', (e) => {
			canvas.setPointerCapture(e.pointerId);
			down = { x: e.clientX, y: e.clientY, button: e.button, moved: 0, yaw: this.orbit.want.yaw, pitch: this.orbit.want.pitch };
		});
		canvas.addEventListener('pointermove', (e) => {
			if (!down) return;
			const dx = e.clientX - down.x;
			const dy = e.clientY - down.y;
			down.moved = Math.max(down.moved, Math.hypot(dx, dy));
			if (down.moved > 5) {
				canvas.classList.add('drag');
				this.orbit.want.yaw = down.yaw - dx * 0.006;
				this.orbit.want.pitch = MathUtils.clamp(down.pitch + dy * 0.005, 0.28, 1.32);
			}
		});
		const up = (e) => {
			canvas.classList.remove('drag');
			if (!down) return;
			const was = down;
			down = null;
			if (was.moved > 5) return;
			const point = this.pick(e.clientX, e.clientY);
			if (!point) return;
			if (was.button === 2) this.dropBlock(point);
			else if (was.button === 0) this.sendTo(point);
		};
		canvas.addEventListener('pointerup', up);
		canvas.addEventListener('pointercancel', () => {
			down = null;
			canvas.classList.remove('drag');
		});
		canvas.addEventListener(
			'wheel',
			(e) => {
				e.preventDefault();
				const o = this.orbit;
				o.want.distance = MathUtils.clamp(o.want.distance * Math.exp(e.deltaY * 0.001), o.min, o.max);
			},
			{ passive: false },
		);
	}

	/**
	 * One step down in what's drawn, if there's one left. Nothing here compiles a shader, which would be a freeze of its
	 * own: extra pixels first, then the shadows every other frame, the picture without ambient occlusion, fewer pixels.
	 */
	lower() {
		const scale = (ratio) => {
			this.pixelRatio = ratio;
			this.renderer.setPixelRatio(ratio);
			this.composer.setPixelRatio(ratio);
			this.plain.setPixelRatio(ratio);
			this.w = 0;
			this.resize();
		};
		if (this.pixelRatio > 1) scale(Math.max(1, this.pixelRatio - 0.5));
		else if (!this.shadowHalf) {
			this.shadowHalf = true;
			this.sun.shadow.autoUpdate = false;
		} else if (!this.usePlain) this.usePlain = true;
		else if (this.pixelRatio > 0.75) scale(0.75);
		else return false;
		this.lowered = (this.lowered ?? 0) + 1;
		return true;
	}

	/** Measures what the graphics card really takes, unseen, and settles on what it can draw before anyone sees it. */
	async settleQuality() {
		const gl = this.renderer.getContext();
		const pixel = new Uint8Array(4);
		for (let round = 0; round < 3; round++) {
			const times = [];
			for (let k = 0; k < 3; k++) {
				const t = performance.now();
				this.step(1 / 60);
				this.draw();
				gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel); // waits for the card to finish
				times.push(performance.now() - t);
				await new Promise((r) => requestAnimationFrame(r));
			}
			times.sort((a, c) => a - c);
			this.measured = times[1];
			// As many steps down as it looks like it needs, not one at a time: on a slow card a round takes a while.
			const steps = this.measured < 22 ? 0 : this.measured < 45 ? 1 : this.measured < 90 ? 2 : 3;
			if (!steps) return;
			for (let k = 0; k < steps; k++) if (!this.lower()) return;
		}
	}

	/** After that, the same steps if the frame can't keep up: judged every second and a half, never asking anyone. */
	govern(ms) {
		this.frameTimes.push(ms);
		this.frameSpan = (this.frameSpan ?? 0) + ms;
		if (this.frameSpan < 1500 || this.frameTimes.length < 4) return;
		const sorted = [...this.frameTimes].sort((a, b) => a - b);
		this.frameTimes.length = 0;
		this.frameSpan = 0;
		if (sorted[sorted.length >> 1] >= 30) this.lower();
	}

	/** For pictures (make-thumbs.mjs, make-cover.mjs): no label or tips. */
	still(on) {
		for (const id of ['label', 'tip', 'credit']) document.getElementById(id).style.visibility = on ? 'hidden' : '';
	}

	frame() {
		const now = performance.now();
		const raw = now - this.last;
		this.last = now;
		if (!this.visible) return;
		this.govern(raw);
		this.resize();
		this.step(Math.min(0.05, raw / 1000));
		this.draw();
	}
}

async function main() {
	const defaults = {};
	for (const control of recipeBlock.controls) defaults[control.id] = control.default;
	const v = { ...defaults };
	const boot = [];
	const mark = (s) => boot.push(`${s} ${(performance.now() / 1000).toFixed(2)}`);
	const app = new App(v);
	mark('renderer');
	await app.load();
	mark('levels');
	await app.warmUp();
	mark('warm');
	app.input();
	const fit = () => app.resize();
	addEventListener('resize', fit);
	new ResizeObserver(fit).observe(canvas);
	app.last = performance.now();
	app.renderer.setAnimationLoop(() => app.frame());
	const block = patchBlock({
		...recipeBlock,
		onSet(id, value) {
			app.set(id, value);
		},
		onTrigger(id) {
			app.trigger(id);
		},
		onVisible(visible) {
			app.visible = visible;
			app.last = performance.now();
		},
	});
	block.ready();
	mark('ready');
	window.__block = { app, values: v, block, boot };
}

void main();
