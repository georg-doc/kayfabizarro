// A crowd on a navmesh: spawn people, give them somewhere to go, and read where they are every frame. Steering and
// avoidance are Detour's crowd (Mikko Mononen, zlib); the groups, the arrivals and the milling about are Patch's, MIT.
// Nothing here draws anything: each member has a position, a speed and a heading for whatever you draw them with.
import { Crowd } from 'recast-navigation';

const TURN_ANTICIPATION = 1;
const OBSTACLE_AVOIDANCE = 2;
const SEPARATION = 4;
const OPTIMIZE_VISIBILITY = 8;
const OPTIMIZE_TOPOLOGY = 16;
const FLAGS = TURN_ANTICIPATION | OBSTACLE_AVOIDANCE | SEPARATION | OPTIMIZE_VISIBILITY | OPTIMIZE_TOPOLOGY;

/** What a member is up to: on its way somewhere, or standing. */
export const MOVING = 1;
export const STANDING = 0;

const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2;

export class CrowdSystem {
	/**
	 * `navigation` is a Navigation (navigation.js). `home` is any walkable point: spawns and wandering stay connected
	 * to it. Options: `maxAgents` (fixed when the crowd is made), `radius`, `height`, `speed` (m/s when sent somewhere),
	 * `stroll` (m/s when nobody sent them), `spacing` (how hard they keep apart, 0 to 4), `wander` (mill about between
	 * orders) and `range` (how far a scatter or a spawn reaches).
	 */
	constructor(navigation, { home, maxAgents = 200, radius = 0.36, height = 1.8, speed = 3, stroll = 1.05, spacing = 2, wander = true, range = 40 } = {}) {
		this.navigation = navigation;
		this.crowd = new Crowd(navigation.navMesh, { maxAgents, maxAgentRadius: Math.max(radius, 0.6) });
		this.home = home;
		this.radius = radius;
		this.height = height;
		this.speed = speed;
		this.stroll = stroll;
		this.spacing = spacing;
		this.wander = wander;
		this.range = range;
		this.maxAgents = maxAgents;
		/** { agent, x, y, z, vx, vz, speed, state, goal, hurry, wait }: read these every frame. */
		this.members = [];
		this.navigationChanged = false;
		this.following = null;
		this.followAt = 0;
		navigation.onChange = () => {
			this.navigationChanged = true;
		};
	}

	/** Adds or removes people until there are `count`. New ones appear anywhere connected to `home`, or around `at`. */
	resize(count, at) {
		count = Math.min(count, this.maxAgents);
		while (this.members.length > count) this.crowd.removeAgent(this.members.pop().agent);
		while (this.members.length < count) {
			const p = this.navigation.randomAround(at ?? this.home, at ? 6 : this.range) ?? this.home;
			const agent = this.crowd.addAgent(p, {
				radius: this.radius,
				height: this.height,
				maxSpeed: this.stroll,
				maxAcceleration: 10,
				collisionQueryRange: this.radius * 12,
				pathOptimizationRange: this.radius * 30,
				separationWeight: this.spacing,
				updateFlags: FLAGS,
				obstacleAvoidanceType: 0,
			});
			this.members.push({ agent, x: p.x, y: p.y, z: p.z, vx: 0, vz: 0, speed: 0, state: STANDING, goal: null, hurry: 0, wait: Math.random() * 1.5, stuck: 0 });
		}
	}

	/** Sends one member to a point. `hurry` scales the crowd's speed; 0 means a stroll. */
	send(member, point, hurry = 1) {
		member.goal = point;
		member.state = MOVING;
		member.hurry = hurry;
		member.stuck = 0;
		member.agent.maxSpeed = hurry ? this.speed * hurry : this.stroll * (0.85 + Math.random() * 0.3);
		member.agent.requestMoveTarget(point);
	}

	/**
	 * Sends members (everyone, by default) to a point. Each gets a place of their own around it, the nearest the middle,
	 * so they arrive and stand instead of pushing for one spot. `spread` is the distance between places.
	 */
	goTo(point, { spread = 1.05, members = this.members, hurry = 1 } = {}) {
		const ordered = [...members].sort((a, b) => dist2(a, point) - dist2(b, point));
		ordered.forEach((member, n) => {
			const angle = n * 2.39996;
			const r = spread * Math.sqrt(n);
			const place = n ? { x: point.x + Math.cos(angle) * r, y: point.y, z: point.z + Math.sin(angle) * r } : point;
			const near = this.navigation.closest(place, { x: spread * 1.5, y: 1.5, z: spread * 1.5 }) ?? point;
			this.send(member, near, hurry * (0.92 + Math.random() * 0.16));
		});
	}

	/**
	 * Keeps everyone heading for a point that moves, a player or a pointer: call it whenever the point changes (a walkable
	 * point, from Navigation.closest), and with null to let them go. A few people a frame take up the new point, so paths
	 * are asked for steadily and the crowd turns like a crowd. Those already there stand.
	 */
	follow(point, { spread = 1 } = {}) {
		this.following = point;
		this.followSpread = spread;
	}

	followStep() {
		const point = this.following;
		const count = this.members.length;
		if (!point || !count) return;
		// Detour plans 8 paths a step, so about that many a frame stay in step with it.
		for (let k = Math.min(count, Math.max(8, Math.ceil(count / 14))); k > 0; k--) {
			this.followAt = (this.followAt + 1) % count;
			const m = this.members[this.followAt];
			m.pace ??= 0.92 + Math.random() * 0.16;
			const angle = this.followAt * 2.39996;
			const r = this.followSpread * Math.sqrt(this.followAt);
			const place = this.navigation.closest({ x: point.x + Math.cos(angle) * r, y: point.y, z: point.z + Math.sin(angle) * r }, { x: this.followSpread * 1.5, y: 1.5, z: this.followSpread * 1.5 }) ?? point;
			const from = m.state === MOVING ? m.goal : m;
			if (dist2(from, place) > 0.5) this.send(m, place, m.pace);
		}
	}

	/** Everyone runs somewhere of their own, anywhere connected to where they stand. */
	scatter() {
		this.following = null;
		for (const member of this.members) {
			const p = this.navigation.randomAround(member, this.range);
			if (p) this.send(member, p, 1.15 + Math.random() * 0.35);
		}
	}

	/** Changes how fast those sent somewhere go, on the way. */
	setSpeed(speed) {
		this.speed = speed;
		for (const m of this.members) if (m.state === MOVING && m.hurry) m.agent.maxSpeed = speed * m.hurry;
	}

	setSpacing(spacing) {
		this.spacing = spacing;
		for (const m of this.members) m.agent.separationWeight = spacing;
	}

	/** Moves anyone standing inside a box out onto the floor around it (call it as the box lands). */
	shove(position, halfWidth, halfDepth, margin = 0.5) {
		for (const m of this.members) {
			const dx = m.x - position.x;
			const dz = m.z - position.z;
			if (Math.abs(dx) > halfWidth + margin || Math.abs(dz) > halfDepth + margin) continue;
			const sideways = Math.abs(dx) / halfWidth > Math.abs(dz) / halfDepth;
			const to = sideways
				? { x: position.x + Math.sign(dx || 1) * (halfWidth + 0.7), y: m.y, z: m.z }
				: { x: m.x, y: m.y, z: position.z + Math.sign(dz || 1) * (halfDepth + 0.7) };
			const p = this.navigation.closest(to);
			if (p) m.agent.teleport(p);
		}
	}

	/** Once a frame, after Navigation.update(): steps everyone and fills in where they are. */
	update(dt) {
		this.followStep();
		// The frame's own time, and the agents' real positions. Not the library's fixed steps and interpolatedPosition:
		// that only moves by how far the frame is through a step, and on a steady 60 Hz screen it's near 0 for long
		// stretches, so people play their run on the spot and then catch up.
		this.crowd.update(Math.min(dt, 1 / 20));
		const replan = this.navigationChanged;
		this.navigationChanged = false;
		for (const m of this.members) {
			const p = m.agent.position();
			const v = m.agent.velocity();
			m.x = p.x;
			m.y = p.y;
			m.z = p.z;
			m.vx = v.x;
			m.vz = v.z;
			m.speed = Math.hypot(v.x, v.z);
			if (m.state === MOVING) {
				// A goal an obstacle landed on moves to its nearest free point, and everyone asks for the way again.
				if (replan) {
					m.goal = this.navigation.closest(m.goal) ?? m.goal;
					m.agent.requestMoveTarget(m.goal);
				}
				const left = dist2(m, m.goal);
				m.stuck = m.speed < 0.25 ? m.stuck + dt : 0;
				// In a press someone may never reach their exact spot: near it and barely moving counts as there.
				if (left < 0.12 || (m.stuck > 1 && left < 9) || m.stuck > 6) this.stand(m);
			} else if (this.wander && !this.following) {
				m.wait -= dt;
				if (m.wait <= 0) {
					const next = this.navigation.randomAround(m, 5 + Math.random() * 14);
					if (next) this.send(m, next, 0);
					m.wait = 1;
				}
			}
		}
	}

	stand(member) {
		member.state = STANDING;
		member.hurry = 0;
		member.stuck = 0;
		member.goal = null;
		member.wait = 1 + Math.random() * 5;
		member.agent.resetMoveTarget();
		member.agent.maxSpeed = this.stroll;
	}

	destroy() {
		this.crowd.destroy();
	}
}
