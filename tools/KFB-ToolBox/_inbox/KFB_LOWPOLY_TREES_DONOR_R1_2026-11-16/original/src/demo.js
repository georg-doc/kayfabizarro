// The low-poly trees block demo: the Lowpoly Tree Generator (Pajama Studio, MIT) growing one tree on a small island, and
// the generator's rig walking it around. Steered by Patch's block page through Patch's block demo helper. Every control
// is declared in recipe.json (written by make-recipe.mjs).
//
// The tree moves by direct control, shown in one line in the frame. Hold WASD or the arrows to walk and let go to stop,
// Shift runs, Space jumps, F swings, R resets. Clicking the ground sends it there; clicking the tree stops it, or makes
// it jump if it's standing. Drag looks around and scroll zooms.
//
// No frame after ready may take over 100 ms (Patch's demo check): trees grow in tree-worker.js, never on the page's
// thread. While a slider moves, a second worker keeps up with a fast unwelded preview, and the welded tree replaces it
// once the slider rests. The canvas stays hidden until the first tree is up and everything it can draw is compiled.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { patchBlock } from 'patch-block';
import { block as recipeBlock } from '../recipe.json';
import { createFx } from './fx.js';
import { ARCHETYPES, FIRST_ARCHETYPE, PARAM_BY_ID, PARAM_CONTROLS, shaped, varied } from './params.js';
import { DEEPEST, createWalker } from './walker.js';
import { SEA, createWorld, heightAt, shared } from './world.js';

const canvas = document.getElementById('view');
const keysLine = document.getElementById('keys');
const defaultOf = (id) => recipeBlock.controls.find((control) => control.id === id).default;
const toHex = (hex) => `#${(Number(hex) >>> 0).toString(16).padStart(6, '0').slice(-6)}`;
// Where the view starts, from the tree, for a tree about 4 m tall.
const HOME = new THREE.Vector3(7.1, 2.1, 9.3);
const SETTLE_MS = 160;

function noGraphics(error) {
	const box = document.getElementById('nogl');
	box.querySelector('.why').textContent = error?.message ?? String(error ?? '');
	box.classList.add('on');
	canvas.style.display = 'none';
}

let renderer;
try {
	renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (error) {
	console.warn(error);
}

let visible = true;
let app = null;
const block = patchBlock({
	...recipeBlock,
	onSet(id, value) {
		app?.set(id, value);
	},
	onTrigger(id) {
		app?.trigger(id);
	},
	onVisible(on) {
		visible = on;
		if (!on) app?.held.clear();
	},
});

class App {
	values = block.values;
	overrides = {};
	shownKey = '';
	latestKey = '';
	reportNext = false;
	popNext = false;
	cache = new Map();
	queue = [];
	job = null;
	wanted = null;
	previewBusy = false;
	previewWanted = null;
	settleTimer = 0;
	waiting = [];
	last = performance.now();
	elapsed = 0;
	kick = 0;
	kickVelocity = 0;
	held = new Set();
	steering = false;
	frameHeight = 0;
	userMoved = false;
	homing = null;
	worstSwapMs = 0;

	constructor() {
		const scene = new THREE.Scene();
		this.scene = scene;
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
		renderer.toneMapping = THREE.NeutralToneMapping;
		renderer.toneMappingExposure = 1;

		this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1200);
		this.camera.position.set(7.1, 4, 9.3);
		this.controls = new OrbitControls(this.camera, canvas);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.08;
		this.controls.enablePan = false;
		this.controls.minDistance = 3.5;
		this.controls.maxDistance = 34;
		this.controls.minPolarAngle = 0.28;
		this.controls.maxPolarAngle = 1.5;
		this.controls.target.set(0, 2, 0);
		this.controls.autoRotateSpeed = 0.5;
		// Once someone has moved the view it's theirs, until Reset.
		this.controls.addEventListener('start', () => {
			this.userMoved = true;
			this.homing = null;
		});

		this.sunDirection = new THREE.Vector3();
		this.sun = new THREE.DirectionalLight(0xfff0d6, 3.1);
		this.sun.castShadow = true;
		this.sun.shadow.mapSize.set(3072, 3072);
		const box = this.sun.shadow.camera;
		box.left = box.bottom = -17;
		box.right = box.top = 17;
		box.near = 1;
		box.far = 90;
		this.sun.shadow.bias = -0.0006;
		this.sun.shadow.normalBias = 0.03;
		this.sun.shadow.radius = 2.5;
		scene.add(this.sun, this.sun.target);
		scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x9ab56a, 1.55));
		this.setSun(this.values.sun);

		this.world = createWorld(scene, this.sunDirection);
		this.fx = createFx(scene);
		this.walker = createWalker(scene, this.fx, {
			onHit: (power) => {
				this.kickVelocity -= 1.1 * power;
			},
		});
		shared.uWind.value = this.values.wind;
		this.controls.autoRotate = this.values.turn;

		// Written out in this exact form, inside one function, or the build doesn't bundle the worker.
		const worker = () => new Worker(new URL('./tree-worker.js', import.meta.url), { type: 'module' });
		this.grower = worker();
		this.grower.onmessage = ({ data }) => this.grown(data);
		this.previewer = worker();
		this.previewer.onmessage = ({ data }) => this.previewed(data);

		addEventListener('resize', () => this.resize());
		this.resize();
		this.listen();
	}

	setSun(degrees) {
		const up = THREE.MathUtils.degToRad(degrees);
		const around = THREE.MathUtils.degToRad(208);
		this.sunDirection.set(-Math.cos(up) * Math.sin(around), Math.sin(up), -Math.cos(up) * Math.cos(around)).normalize();
		this.sun.position.copy(this.sunDirection).multiplyScalar(44);
	}

	// Trees: every change becomes a set of parameters. A preview follows at once while the welded tree waits for the
	// slider to rest; both workers take the newest and do one at a time.
	baseParams() {
		const archetype = ARCHETYPES[this.values.archetype] ?? ARCHETYPES[FIRST_ARCHETYPE];
		return { ...varied(archetype.params, Math.round(this.values.seed)), ...this.overrides };
	}

	grow({ pop = false } = {}) {
		const base = this.baseParams();
		const params = shaped(base, this.values);
		const budget = Math.round(this.values.budget);
		const key = JSON.stringify([params, budget]);
		this.latestKey = key;
		this.latestBase = base;
		this.popNext ||= pop;
		clearTimeout(this.settleTimer);
		if (this.cache.has(key)) {
			this.show(this.cache.get(key), key);
			return;
		}
		const job = { key, params, budget };
		if (this.settling) {
			this.wanted = job;
			this.pump();
			return;
		}
		this.previewWanted = job;
		this.pumpPreview();
		this.settleTimer = setTimeout(() => {
			this.wanted = job;
			this.pump();
		}, SETTLE_MS);
	}

	pump() {
		if (this.job) return;
		const next = this.wanted ?? this.queue.shift();
		if (!next) return;
		if (next === this.wanted) this.wanted = null;
		if (this.cache.has(next.key)) {
			this.pump();
			return;
		}
		this.job = next;
		this.grower.postMessage({ id: next.key, params: next.params, budget: next.budget });
	}

	grown(data) {
		const { key } = this.job;
		this.job = null;
		if (data.error) {
			// Stays on the tree it has; the controls still say what was asked for.
			console.warn('The tree could not be grown:', data.error);
		} else {
			this.lastGrowMs = data.ms;
			this.cache.set(key, data);
			if (this.cache.size > 48) this.cache.delete(this.cache.keys().next().value);
			if (key === this.latestKey) this.show(data, key);
		}
		this.pump();
		if (!this.job && !this.queue.length) this.whenGrown?.();
	}

	pumpPreview() {
		if (this.previewBusy || !this.previewWanted) return;
		const job = this.previewWanted;
		this.previewWanted = null;
		this.previewBusy = true;
		this.previewer.postMessage({ id: job.key, params: job.params, preview: true });
	}

	previewed(data) {
		// (The warm-up's preview has no id: it only gets the worker going.)
		if (!data.id) return;
		this.previewBusy = false;
		if (data.error) console.warn('The preview could not be grown:', data.error);
		else if (data.id === this.latestKey && !this.cache.has(data.id)) {
			this.lastPreviewMs = data.ms;
			this.show(data, data.id, true);
		}
		this.pumpPreview();
	}

	show(result, key, preview = false) {
		const shown = preview ? `${key}#preview` : key;
		if (shown === this.shownKey) return;
		const first = !this.shownKey;
		this.shownKey = shown;
		this.worstSwapMs = Math.max(this.worstSwapMs, this.walker.setTree(result, { pop: this.popNext && !first && !this.settling }));
		this.popNext = false;
		if (first || this.settling) this.frameHeight = this.walker.height;
		this.stats = result.stats;
		this.report(result);
		for (const resolve of this.waiting.splice(0)) resolve();
	}

	/** After a new archetype or seed: tells the page what every control now says about this tree. */
	report(result) {
		if (!this.reportNext) return;
		this.reportNext = false;
		const changes = {};
		const made = result.recipe.params ?? {};
		for (const control of PARAM_CONTROLS) {
			const value = this.latestBase[control.param] ?? made[control.param];
			if (value === undefined) continue;
			changes[control.id] = control.type === 'color' ? toHex(value) : control.type === 'toggle' ? Boolean(value) : value;
		}
		block.state(changes);
		Object.assign(this.values, block.values);
	}

	set(id, value) {
		this.values[id] = value;
		if (id === 'archetype') {
			// A new archetype starts as drawn: every slider goes back to it.
			const fresh = { seed: 0, crown: defaultOf('crown'), gnarl: defaultOf('gnarl'), hue: defaultOf('hue') };
			block.state(fresh);
			Object.assign(this.values, fresh);
			this.overrides = {};
			this.reportNext = true;
			this.grow({ pop: true });
		} else if (id === 'seed') {
			this.reportNext = true;
			this.grow({ pop: true });
		} else if (id === 'crown' || id === 'gnarl' || id === 'hue' || id === 'budget') {
			this.grow();
		} else if (PARAM_BY_ID.has(id)) {
			const control = PARAM_BY_ID.get(id);
			this.overrides[control.param] = control.type === 'color' ? Number.parseInt(value.slice(1), 16) : value;
			this.grow();
		} else if (id === 'wind') {
			shared.uWind.value = value;
		} else if (id === 'sun') {
			this.setSun(value);
		} else if (id === 'turn') {
			this.controls.autoRotate = value;
		} else if (id === 'pose') {
			this.walker.setPose(value);
		}
	}

	trigger(id) {
		if (id === 'new') {
			// The sliders you've moved stay, on a new seed: only what they don't hold changes.
			const seed = 1 + Math.floor(Math.random() * 9998);
			block.state({ seed });
			this.values.seed = seed;
			this.reportNext = true;
			this.grow({ pop: true });
		} else if (id === 'reset') {
			this.reset();
		}
	}

	/**
	 * Everything as it was when the demo opened: the archetype and every control at its default, which the page's
	 * controls are told, the tree where it began, facing the same way and standing still, and the view back where it started.
	 */
	reset() {
		this.walker.reset();
		this.fx.clear();
		this.held.clear();
		this.showKeys();
		const defaults = Object.fromEntries(recipeBlock.controls.map((control) => [control.id, control.default]));
		block.state(defaults);
		Object.assign(this.values, block.values);
		this.overrides = {};
		this.reportNext = false;
		shared.uWind.value = this.values.wind;
		this.setSun(this.values.sun);
		this.controls.autoRotate = this.values.turn;
		this.grow();
		this.frameHeight = this.walker.height;
		this.userMoved = false;
		const { position, target } = this.homeView();
		this.homing = { t: 0, fromPosition: this.camera.position.clone(), fromTarget: this.controls.target.clone(), position, target };
	}

	/** Far enough back for this tree's height and reach. */
	homeView() {
		const { body, height, reach } = this.walker;
		const fit = Math.max(0.8, height / 4, reach / 2.7);
		const target = new THREE.Vector3(body.x, Math.max(body.y, SEA - 0.2) + height * 0.47, body.z);
		return { target, position: target.clone().addScaledVector(HOME, fit) };
	}

	/** As far as it can wade, along the way there. */
	send(x, z) {
		const { body } = this.walker;
		let tx = x;
		let tz = z;
		for (let k = 0; k < 12 && heightAt(tx, tz) < SEA - DEEPEST * 0.92; k++) {
			tx = body.x + (tx - body.x) * 0.85;
			tz = body.z + (tz - body.z) * 0.85;
		}
		this.walker.walkTo(tx, tz);
		this.fx.ring(tx, Math.max(heightAt(tx, tz), SEA) + 0.05, tz, 0.08, 0.5, 0.65);
	}

	listen() {
		let down = null;
		canvas.addEventListener('pointerdown', (e) => {
			// In a frame the first click only takes the keyboard: it mustn't also send the tree off.
			const focused = document.hasFocus();
			canvas.focus({ preventScroll: true });
			canvas.classList.add('drag');
			down = { x: e.clientX, y: e.clientY, at: performance.now(), button: e.button, focused };
		});
		addEventListener('pointerup', (e) => {
			canvas.classList.remove('drag');
			if (!down) return;
			const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
			const click = down.button === 0 && down.focused && moved < 7 && performance.now() - down.at < 450;
			down = null;
			if (click && e.target === canvas) this.clicked(e);
		});
		canvas.addEventListener('pointermove', (e) => {
			if (!down) canvas.classList.toggle('over-tree', this.onTree(this.rayAt(e)));
		});
		const moves = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight']);
		addEventListener('keydown', (e) => {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			if (e.code === 'Space') {
				e.preventDefault();
				if (!e.repeat) this.walker.act('jump');
				this.flash('Space');
			} else if (e.code === 'KeyF') {
				if (!e.repeat) this.walker.act('attack');
				this.flash('KeyF');
			} else if (e.code === 'KeyR') {
				if (!e.repeat) this.reset();
				this.flash('KeyR');
			} else if (e.code === 'Escape') {
				this.walker.stop();
			} else if (moves.has(e.code)) {
				e.preventDefault();
				this.held.add(e.code);
				this.showKeys();
			}
		});
		addEventListener('keyup', (e) => {
			this.held.delete(e.code);
			this.showKeys();
		});
		// A click outside the frame takes the keyboard away: nothing stays held, and the line says so.
		const focusChanged = () => {
			if (!document.hasFocus()) this.held.clear();
			keysLine.classList.toggle('asleep', !document.hasFocus());
			this.showKeys();
		};
		addEventListener('blur', focusChanged);
		addEventListener('focus', focusChanged);
		focusChanged();
	}

	/** Lights the keys that are down, so pressing one answers at once. */
	showKeys() {
		const down = new Set(this.held);
		if (down.has('ArrowUp')) down.add('KeyW');
		if (down.has('ArrowLeft')) down.add('KeyA');
		if (down.has('ArrowDown')) down.add('KeyS');
		if (down.has('ArrowRight')) down.add('KeyD');
		if (down.has('ShiftRight')) down.add('ShiftLeft');
		for (const key of keysLine.querySelectorAll('kbd')) key.classList.toggle('down', down.has(key.dataset.key));
	}

	flash(code) {
		const key = keysLine.querySelector(`kbd[data-key="${code}"]`);
		key?.classList.add('down');
		setTimeout(() => key?.classList.remove('down'), 160);
	}

	rayAt(e) {
		const rect = canvas.getBoundingClientRect();
		const ray = new THREE.Raycaster();
		ray.setFromCamera(new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1), this.camera);
		return ray.ray;
	}

	/** Whether a ray hits the tree: its trunk near the ground, and its crown higher up, near enough. */
	onTree(ray) {
		const { body, height, reach } = this.walker;
		const base = new THREE.Vector3(body.x, body.y, body.z);
		const middle = new THREE.Vector3(body.x, body.y + height * 0.5, body.z);
		const top = new THREE.Vector3(body.x, body.y + height, body.z);
		if (ray.distanceSqToSegment(base, middle) < 0.55 ** 2) return true;
		return ray.distanceSqToSegment(middle, top) < (reach * 0.72) ** 2;
	}

	clicked(e) {
		const ray = this.rayAt(e);
		if (this.onTree(ray)) {
			if (this.walker.moving) this.walker.stop();
			else this.walker.act('jump');
			return;
		}
		const { origin, direction } = ray;
		if (direction.y >= -0.005) return;
		// Marches along the ray until it's under the ground or the sea.
		for (let s = 0; s < 90; s += 0.2) {
			const x = origin.x + direction.x * s;
			const y = origin.y + direction.y * s;
			const z = origin.z + direction.z * s;
			if (y <= Math.max(heightAt(x, z), SEA)) {
				this.send(x, z);
				return;
			}
		}
	}

	/** Keys held walk the tree relative to the view, for as long as they're down, and letting go stops it. */
	steer() {
		let f = 0;
		let s = 0;
		for (const key of this.held) {
			if (key === 'KeyW' || key === 'ArrowUp') f += 1;
			if (key === 'KeyS' || key === 'ArrowDown') f -= 1;
			if (key === 'KeyD' || key === 'ArrowRight') s += 1;
			if (key === 'KeyA' || key === 'ArrowLeft') s -= 1;
		}
		if (!f && !s) {
			if (this.steering) this.walker.letGo();
			this.steering = false;
			return;
		}
		const forward = new THREE.Vector3();
		this.camera.getWorldDirection(forward);
		forward.y = 0;
		forward.normalize();
		const length = Math.hypot(f, s);
		const run = this.held.has('ShiftLeft') || this.held.has('ShiftRight');
		this.walker.steer((forward.x * f - forward.z * s) / length, (forward.z * f + forward.x * s) / length, run);
		this.steering = true;
	}

	resize() {
		const w = Math.max(1, innerWidth);
		const h = Math.max(1, innerHeight);
		renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		// A tall frame is further off, so the crown still fits across it.
		this.camera.fov = w / h < 1 ? 36 + (1 - w / h) * 30 : 36;
		this.camera.updateProjectionMatrix();
	}

	moveView(dt) {
		const { controls, camera, walker } = this;
		if (this.homing) {
			const home = this.homing;
			home.t = Math.min(1, home.t + dt / 0.55);
			const k = home.t * home.t * (3 - 2 * home.t);
			controls.target.lerpVectors(home.fromTarget, home.target, k);
			camera.position.lerpVectors(home.fromPosition, home.position, k);
			if (home.t >= 1) this.homing = null;
			controls.update();
			return;
		}
		// The view follows the tree: the target and the camera move together, so a drag stays where it was.
		const { body } = walker;
		const follow = 1 - Math.exp(-2.6 * dt);
		const height = this.frameHeight || walker.height;
		this.frameHeight = height + (walker.height - height) * (1 - Math.exp(-3.2 * dt));
		const ty = Math.max(body.y, SEA - 0.2) + this.frameHeight * 0.47;
		const dx = (body.x - controls.target.x) * follow;
		const dy = (ty - controls.target.y) * follow;
		const dz = (body.z - controls.target.z) * follow;
		controls.target.x += dx;
		controls.target.y += dy;
		controls.target.z += dz;
		camera.position.x += dx;
		camera.position.y += dy;
		camera.position.z += dz;
		// Until someone moves the view, it backs off and closes in to keep the whole tree in frame as sliders change it.
		if (!this.userMoved) {
			const fit = Math.max(0.8, walker.height / 4, walker.reach / 2.7);
			const offset = camera.position.clone().sub(controls.target);
			const distance = offset.length();
			offset.multiplyScalar((distance + (HOME.length() * fit - distance) * (1 - Math.exp(-3.2 * dt))) / distance);
			camera.position.copy(controls.target).add(offset);
		}
		controls.update();
	}

	frame(dt) {
		this.elapsed += dt;
		const t = this.elapsed;
		this.steer();
		this.world.update(t);
		const { walker, values } = this;
		walker.update(dt, t, { wind: values.wind, speed: values.speed });
		if (values.pose === 'stomp' || values.pose === 'attack' || values.pose === 'jump') {
			if (!walker.busy) walker.act(values.pose);
		}
		this.fx.update(dt, t, values.wind);
		this.moveView(dt);

		// The bump of a landing.
		this.kickVelocity += (-this.kick * 150 - this.kickVelocity * 14) * dt;
		this.kick += this.kickVelocity * dt;
		this.camera.position.y += this.kick * 0.1;
		renderer.render(this.scene, this.camera);
		this.camera.position.y -= this.kick * 0.1;
	}

	/** Grows the first tree and compiles everything the demo can draw; only then is the canvas shown. */
	async warmUp() {
		const treeUp = new Promise((resolve) => this.waiting.push(resolve));
		this.settling = true;
		block.progress(0.4, 'Growing a tree');
		this.grow();
		await treeUp;
		// Grow the other archetypes now, so choosing one is instant and nothing is left to do once the demo says ready.
		// A slow machine doesn't wait for all of them: the rest finish behind it.
		block.progress(0.55, 'Growing the other trees');
		const budget = Math.round(this.values.budget);
		for (const id of Object.keys(ARCHETYPES)) {
			if (id === this.values.archetype) continue;
			const params = shaped(varied(ARCHETYPES[id].params, 0), { crown: defaultOf('crown') });
			this.queue.push({ key: JSON.stringify([params, budget]), params, budget });
		}
		this.pump();
		this.previewer.postMessage({ id: '', params: ARCHETYPES[FIRST_ARCHETYPE].params, preview: true });
		const grownAll = new Promise((resolve) => {
			this.whenGrown = resolve;
		});
		await Promise.race([grownAll, new Promise((resolve) => setTimeout(resolve, 3000))]);
		block.progress(0.8, 'Preparing the view');
		this.fx.warm(0, heightAt(0, 0), 2);
		this.walker.update(1 / 60, 0, { wind: this.values.wind, speed: 1 });
		await renderer.compileAsync(this.scene, this.camera);
		renderer.render(this.scene, this.camera);
		this.fx.clear();
		renderer.render(this.scene, this.camera);
		this.settling = false;
		// The view starts where it will rest.
		const { position, target } = this.homeView();
		this.controls.target.copy(target);
		this.camera.position.copy(position);
		this.frameHeight = this.walker.height;
		this.controls.update();
		this.frame(1 / 60);
		await new Promise((resolve) => requestAnimationFrame(resolve));
		this.frame(1 / 60);
		await new Promise((resolve) => requestAnimationFrame(resolve));
		canvas.classList.add('on');
		for (const hud of document.querySelectorAll('.hud')) hud.classList.add('on');
		this.last = performance.now();
		renderer.setAnimationLoop(() => {
			if (!visible) {
				this.last = performance.now();
				return;
			}
			const now = performance.now();
			const dt = Math.min(0.05, (now - this.last) / 1000);
			this.last = now;
			this.frame(dt);
		});
		// Says ready only once frames are arriving steadily, so the first ones to count aren't the page settling down.
		await this.steady();
		block.ready();
	}

	/** Eight frames in a row without a long one, or a second and a half, whichever is first. */
	steady() {
		return new Promise((resolve) => {
			const started = performance.now();
			let last = started;
			let calm = 0;
			const tick = (now) => {
				calm = now - last < 40 ? calm + 1 : 0;
				last = now;
				if (calm >= 8 || now - started > 1500) resolve();
				else requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		});
	}
}

if (renderer?.capabilities.isWebGL2) {
	block.progress(0.1, 'Building the island');
	app = new App();
	app.warmUp().catch((error) => {
		console.warn(error);
		noGraphics(error);
		block.ready();
	});
	window.__block = { app, block };
} else {
	noGraphics(new Error('No WebGL 2 in this browser.'));
	block.ready();
}
