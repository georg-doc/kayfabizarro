// Navigation for any three.js level: build a navmesh from its meshes, query it, and drop obstacles into it while
// the game runs. It's Recast and Detour (Mikko Mononen, zlib) through recast-navigation-js (Isaac Mason, MIT), in the
// single-threaded build, so it needs no special hosting. Everything here is in metres.
import { init, NavMeshQuery } from 'recast-navigation';
import { threeToTileCache } from '@recast-navigation/three';

let started;
/** Loads Recast's WebAssembly, once. Wait for it before anything else in here. */
export function initNavigation() {
	started ??= init();
	return started;
}

/**
 * The walkable surface of a level, as a tile cache so obstacles can come and go.
 *
 * `meshes` are what people walk on or bump into: floors, stairs, walls, big props. Leave out roofs and treetops, or
 * they become walkable islands nobody can reach, and cut the floor away under solid buildings for the same reason. The
 * meshes don't have to be drawn.
 *
 * Building is Recast rasterising every triangle: under 100 ms for a small level, more for bigger ones. Do it behind a
 * loading screen, once.
 */
export class Navigation {
	constructor(meshes, { agentRadius = 0.35, agentHeight = 1.9, stepHeight = 0.5, maxSlope = 46, cellSize = 0.2, cellHeight = 0.1, tileSize = 32, maxObstacles = 48 } = {}) {
		const built = threeToTileCache(meshes, {
			cs: cellSize,
			ch: cellHeight,
			tileSize,
			walkableRadius: Math.ceil(agentRadius / cellSize),
			walkableHeight: Math.ceil(agentHeight / cellHeight),
			walkableClimb: Math.floor(stepHeight / cellHeight),
			walkableSlopeAngle: maxSlope,
			maxSimplificationError: 1.1,
			expectedLayersPerTile: 4,
			maxObstacles,
		});
		if (!built.success) throw new Error(`The navmesh didn't build: ${built.error}`);
		this.navMesh = built.navMesh;
		this.tileCache = built.tileCache;
		this.query = new NavMeshQuery(this.navMesh);
		this.pending = false;
		/** Called after the walkable area changed. */
		this.onChange = null;
	}

	/** The walkable point nearest `point` (within `reach` metres each way), or null. */
	closest(point, reach = { x: 3, y: 4, z: 3 }) {
		const found = this.query.findClosestPoint(point, { halfExtents: reach });
		return found.success && found.polyRef ? found.point : null;
	}

	/** A random point connected to `from`, within `radius`, or null. Never one on an island you can't walk to. */
	randomAround(from, radius) {
		const found = this.query.findRandomPointAroundCircle(from, radius, { halfExtents: { x: 3, y: 4, z: 3 } });
		return found.success && found.randomPolyRef ? found.randomPoint : null;
	}

	/** The path from one point to another, as corners, or null when there's none. */
	path(from, to) {
		const found = this.query.computePath(from, to);
		return found.success ? found.path : null;
	}

	/** Blocks a box of the floor, standing on `position` (its base), turned by `yaw`. Returns it, for unblock(). */
	block(position, halfWidth, halfDepth, height, yaw = 0) {
		const centre = { x: position.x, y: position.y + height / 2, z: position.z };
		const added = this.tileCache.addBoxObstacle(centre, { x: halfWidth, y: height / 2, z: halfDepth }, yaw);
		if (!added.success) return null;
		this.pending = true;
		return added.obstacle;
	}

	unblock(obstacle) {
		this.tileCache.removeObstacle(obstacle);
		this.pending = true;
	}

	/** Once a frame, before the crowd: rebuilds what obstacles touched, a few milliseconds a tile. */
	update() {
		if (!this.pending) return;
		for (let k = 0; k < 4; k++) {
			const { upToDate } = this.tileCache.update(this.navMesh);
			if (upToDate) {
				this.pending = false;
				this.onChange?.();
				break;
			}
		}
	}

	destroy() {
		this.query.destroy();
		this.tileCache.destroy();
		this.navMesh.destroy();
	}
}
