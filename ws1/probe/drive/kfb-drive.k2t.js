var KFBDrive = (function(exports, three) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	three = __toESM(three, 1);
	//#region src/worldScale.js
	var M_PER_RIG = .616381042;
	var CLASS_K = .947;
	+(2.94 * M_PER_RIG).toFixed(3);
	var WORLD_K = M_PER_RIG / CLASS_K;
	var worldKFor = (hash = "") => /(^|[#,])wscale=legacy(,|$)/.test(hash) ? 1 : WORLD_K;
	//#endregion
	//#region src/m1/m1Scale.js
	var K = worldKFor(typeof location !== "undefined" ? location.hash : "");
	var G = K === 1 ? 14 : 9.81;
	var JUMP_K = Math.sqrt(G * K / 14);
	K ** 3;
	K ** 5;
	//#endregion
	//#region src/m2/k2t.js
	var GK = G / 14;
	var FLOW = {
		accel: 18.5 * K,
		brake: 28 * K,
		reverseAccel: 10.5 * K,
		drag: .95,
		maxForward: 41 * K,
		maxReverse: 9 * K,
		steerBase: -13.8,
		lateralDamping: 3.05,
		centrifugalGain: .085,
		bounceBase: 4.6 * K,
		bounceSpeed: .085,
		retention: .985
	};
	var FEEL = {
		driftMinSpeed: 7.5 * K,
		driftSteerScale: 1.28,
		driftDampingScale: .28,
		driftYawGain: 1.32,
		regripSeconds: .34,
		regripDampingScale: 1.85,
		boostAccelScale: 1.55,
		boostMaxForward: 48.5 * K,
		boostPitchBias: .035,
		accelPitchGain: .0075 / K,
		lateralRollGain: .0028 / K,
		hoverBase: .045 * K,
		jumpImpulse: 7.8 * JUMP_K,
		jumpGravity: 19 * GK
	};
	var ASSIST = {
		wallReflect: .4,
		wallKeep: .995,
		flyGravity: 13.3 * GK,
		squash: 1,
		soft: {
			back: .08,
			keep: .6,
			lat: .25,
			squash: .5
		}
	};
	var SQUASH_LOOK = Object.freeze({
		x: .12,
		y: -.18,
		z: .06
	});
	var SLOPE = {
		g: G,
		lateral: .5,
		stopBelow: .4 * K,
		flatNy: .99,
		takeoffGap: .08 * K
	};
	var TURN = {
		below: 10 * K,
		yaw: .3,
		ramp: 3
	};
	var ASSIST_M3 = { on: true };
	var LAND = {
		flySteer: .35,
		grip: .3,
		gripDamp: 14,
		align: 12,
		bounceVN: 16 * K,
		bounce: .1,
		boostT: .45,
		boostOn: true
	};
	var JUMP = {
		up: 1.12,
		long: .92,
		push: 1.12,
		longFrom: 6 * K,
		coyote: .12,
		buffer: .12
	};
	var DRIFTBOOST = {
		minSpeed: 9 * K,
		stages: [
			.6,
			1.2,
			2
		],
		boostT: [
			.35,
			.6,
			.9
		],
		fill: [
			.2,
			.4,
			.7
		],
		drain: .35,
		regen: .05
	};
	var driftStage = (c) => DRIFTBOOST.stages.reduce((n, s) => c >= s ? n + 1 : n, 0);
	var STUCK = {
		window: .7,
		minProgress: 1 * K,
		nudge: 5 * K,
		nudgeS: [.6, 1],
		yawNudge: .9,
		tries: 3,
		windowS: 4,
		safeAge: 1.2,
		safeEvery: .25,
		dropH: 1.2 * K,
		flyMax: 8
	};
	var PUSH = {
		capture: {
			lateralK: .65,
			yawK: .75,
			maxForce: .95,
			maxYaw: .72,
			speedMin: 7 * K,
			speedMax: 27 * K
		},
		commit: {
			lateralK: 1.05,
			yawK: 1.15,
			maxForce: 1.35,
			maxYaw: 1.05,
			speedMin: 10 * K,
			speedMax: 26 * K
		},
		abortHold: .32,
		FS: 4,
		launchVy: 2.2 * K,
		alignMax: .8
	};
	var RIDE = {
		speedMin: 8 * K,
		maxInto: .55,
		holdS: 1.4,
		leanRad: 1.2,
		rise: .25,
		fall: .8,
		minRate: 1.2,
		contactLoss: .25,
		grace: .5,
		abortHold: .32,
		pull: 1.5 * K,
		pullIn: 4 * K
	};
	var TRICK = {
		minSpeed: 6 * K,
		lockS: 2.2,
		holdS: 1.4,
		freeLeanRad: .8,
		airMin: .15
	};
	var ATT = {
		ground: 14,
		air: 2.5,
		follow: .5,
		maxPitch: 25 * Math.PI / 180
	};
	var clamp$1 = (x, a, b) => Math.min(b, Math.max(a, x));
	var fx0 = (d) => Math.sin(d.yaw);
	var fz0 = (d) => Math.cos(d.yaw);
	function createK2t(x, y, z, yaw) {
		return {
			x,
			y,
			z,
			yaw,
			speed: 0,
			latV: 0,
			drift: 0,
			driftDir: 0,
			regrip: 0,
			vy: 0,
			vyG: 0,
			squash: 0,
			squashV: 0,
			events: [],
			signals: {
				speed: 0,
				longAccel: 0,
				lateral: 0,
				bank: 0,
				drift: 0
			},
			air: false,
			pitch: 0,
			roll: 0,
			up: [
				0,
				1,
				0
			],
			hits: 0,
			boostMeter: 1,
			boostLatch: false,
			driftCharge: 0,
			driftStage: 0,
			driftBoostT: 0,
			coyoteT: 0,
			jumpBufT: 0,
			jumped: false
		};
	}
	function stepK2t(d, inp, dt, env) {
		d.events.length = 0;
		const v0 = d.speed, yaw0 = d.yaw;
		const steerIn = (inp.left ? 1 : 0) - (inp.right ? 1 : 0), slow = !d.air && steerIn ? Math.max(0, 1 - Math.abs(d.speed) / TURN.below) : 0;
		d.landBoostT = Math.max(0, (d.landBoostT || 0) - dt);
		d.driftBoostT = Math.max(0, (d.driftBoostT || 0) - dt);
		d.gripT = Math.max(0, (d.gripT || 0) - dt);
		const A3 = ASSIST_M3.on;
		if (!inp.boost) d.boostLatch = false;
		const freeBoost = d.landBoostT > 0 || d.driftBoostT > 0;
		d.boosting = (!!inp.boost && (!A3 || d.boostMeter > 0 && !d.boostLatch) || freeBoost) && d.speed > 4 * K;
		if (A3) {
			if (d.boosting && !freeBoost) {
				d.boostMeter = Math.max(0, d.boostMeter - DRIFTBOOST.drain * dt);
				if (d.boostMeter <= 0) d.boostLatch = true;
			} else d.boostMeter = Math.min(1, d.boostMeter + DRIFTBOOST.regen * dt);
		}
		const maxF = d.boosting ? FEEL.boostMaxForward : FLOW.maxForward, acc = FLOW.accel * (d.boosting ? FEEL.boostAccelScale : 1);
		if (d.speed > maxF && !inp.brake) d.speed = Math.max(maxF, d.speed - FLOW.accel * dt);
		else if (inp.gas) d.speed = Math.min(maxF, d.speed + acc * (slow ? Math.min(1, slow * TURN.ramp) : 1) * dt);
		else if (inp.brake) d.speed -= (d.speed > 0 ? FLOW.brake : FLOW.reverseAccel) * dt;
		else d.speed *= Math.pow(FLOW.drag, dt * 4);
		d.speed = Math.max(-FLOW.maxReverse, d.speed);
		const speedFactor = 1 / (1 + Math.abs(d.speed) * .048 / K);
		let yawRate = d.air ? A3 ? steerIn * LAND.flySteer : 0 : -steerIn * FLOW.steerBase * Math.PI / 180 * speedFactor * 8.2 * (1 + TURN.yaw * slow);
		const wantDrift = (inp.driftL ? -1 : 0) + (inp.driftR ? 1 : 0);
		if (wantDrift && !d.air && Math.abs(d.speed) > FEEL.driftMinSpeed) {
			if (!d.drift) d.driftDir = wantDrift;
			d.drift = Math.min(1, d.drift + dt * 3.4);
			d.regrip = FEEL.regripSeconds;
			yawRate *= FEEL.driftSteerScale;
			yawRate += -d.driftDir * FEEL.driftYawGain * .42 * Math.min(1, Math.abs(d.speed) / (22 * K)) * d.drift;
			const target = -d.driftDir * 7.5 * K * d.drift;
			d.latV += (target - d.latV) * Math.min(1, 9 * dt / 7.5);
			if (A3 && d.speed > DRIFTBOOST.minSpeed) {
				const s0 = driftStage(d.driftCharge);
				d.driftCharge += dt;
				const s1 = driftStage(d.driftCharge);
				if (s1 > s0) d.events.push({
					type: "driftCharge",
					stage: s1
				});
			}
		} else {
			d.drift = Math.max(0, d.drift - dt * 2.6);
			d.regrip = Math.max(0, d.regrip - dt);
			if (d.driftCharge > 0) {
				const st = driftStage(d.driftCharge);
				if (st && !wantDrift && !d.air) {
					d.driftBoostT = DRIFTBOOST.boostT[st - 1];
					d.boostMeter = Math.min(1, d.boostMeter + DRIFTBOOST.fill[st - 1]);
					d.events.push({
						type: "driftBoost",
						stage: st
					});
				}
				d.driftCharge = 0;
			}
		}
		d.driftStage = driftStage(d.driftCharge);
		d.yaw += yawRate * dt * (d.speed >= 0 ? 1 : -1);
		{
			const z = A3 && !d.air && env.zone ? env.zone(d.x, d.z) : null, Zs = d.zone || (d.zone = {
				id: null,
				abortT: 0,
				aborted: false,
				seg: null
			});
			if (!z || z.id !== Zs.id) {
				Zs.id = z?.id ?? null;
				Zs.abortT = 0;
				Zs.aborted = false;
				Zs.engaged = false;
			}
			if (z && !Zs.engaged && Math.abs(Math.atan2(Math.sin(d.yaw - z.dir), Math.cos(d.yaw - z.dir))) < PUSH.alignMax) Zs.engaged = true;
			Zs.seg = z && Zs.engaged && !Zs.aborted ? z.seg : null;
			if (z && !Zs.aborted) {
				Zs.abortT = steerIn && z.seg === "capture" ? Zs.abortT + dt : Math.max(0, Zs.abortT - 2 * dt);
				if (Zs.abortT >= PUSH.abortHold) {
					Zs.aborted = true;
					d.events.push({
						type: "zone",
						phase: "abort",
						id: z.id
					});
				}
			}
			if (Zs.seg) {
				const P = PUSH[Zs.seg], err = Math.atan2(Math.sin(d.yaw - z.dir), Math.cos(d.yaw - z.dir)), want = clamp$1(-(z.e / K) * .24, -.7, .7);
				d.yaw += clamp$1(P.yawK * (want - err), -P.maxYaw, P.maxYaw) * dt;
				d.latV += clamp$1(-P.lateralK * (z.e / K) * PUSH.FS, -P.maxForce * PUSH.FS, P.maxForce * PUSH.FS) * K * dt;
				if (d.speed < P.speedMin && inp.gas) d.speed += clamp$1((P.speedMin - d.speed) * 1.5, 0, 4.2 * K) * dt;
				else if (d.speed > P.speedMax && !d.boosting) d.speed -= clamp$1((d.speed - P.speedMax) * 1.25, 0, 5.5 * K) * dt;
			}
		}
		if (d.ride) {
			const R = d.ride, n = R.n;
			let tx = -n[2], tz = n[0];
			if (tx * fx0(d) + tz * fz0(d) < 0) {
				tx = -tx;
				tz = -tz;
			}
			const want = Math.atan2(tx, tz), e = Math.atan2(Math.sin(want - d.yaw), Math.cos(want - d.yaw));
			d.yaw += e * Math.min(1, 10 * dt);
			R.aligned = Math.abs(e) < .08;
			d.latV = -R.side * (R.touched ? RIDE.pull : RIDE.pullIn);
			R.t += dt;
			R.contactT += dt;
			R.abortT = steerIn === R.side ? R.abortT + dt : 0;
			const why = R.t >= RIDE.holdS ? "hold" : R.contactT > RIDE.contactLoss ? "end" : R.abortT >= RIDE.abortHold ? "abort" : d.air ? "air" : null;
			if (why) {
				d.events.push({
					type: "twoWheel",
					phase: "release",
					why,
					t: +R.t.toFixed(2)
				});
				d.rideLast = {
					why,
					t: R.t
				};
				d.ride = null;
			}
		}
		if (d.freeTip) {
			d.freeTip.t += dt;
			if (d.freeTip.t >= TRICK.holdS || d.air || d.ride) {
				d.events.push({
					type: "trick",
					kind: "recover",
					side: d.freeTip.side
				});
				d.freeTip = null;
			}
		}
		{
			const tgt = d.ride ? -d.ride.side * RIDE.leanRad : d.freeTip ? -d.freeTip.side * TRICK.freeLeanRad : 0, rate = Math.abs(tgt) > Math.abs(d.lean || 0) ? 1 / RIDE.rise : 1 / RIDE.fall, l0 = d.lean || 0, gap = tgt - l0;
			let stp = gap * Math.min(1, rate * dt);
			if (Math.abs(stp) < RIDE.minRate * dt) stp = Math.sign(gap) * Math.min(Math.abs(gap), RIDE.minRate * dt);
			d.lean = l0 + stp;
		}
		const damp = FLOW.lateralDamping * (d.drift > .05 ? FEEL.driftDampingScale : d.regrip > 0 ? FEEL.regripDampingScale : 1);
		if (!d.air) {
			d.latV += -yawRate * d.speed * FLOW.centrifugalGain * dt;
			d.latV -= d.latV * Math.min(1, damp * dt);
			d.latV = clamp$1(d.latV, -11 * K, 11 * K);
		}
		if (!d.air && d.gripT > 0 && Math.abs(d.speed) > 1 * K) {
			const err = Math.atan2(d.latV, Math.abs(d.speed)), k = Math.min(1, LAND.align * dt);
			d.yaw += err * k * Math.sign(d.speed);
			d.latV -= Math.abs(d.speed) * Math.tan(err * k);
			d.latV *= Math.max(0, 1 - LAND.gripDamp * dt);
		}
		const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), lx = fz, lz = -fx;
		let delta = [
			(fx * d.speed + lx * d.latV) * dt,
			0,
			(fz * d.speed + lz * d.latV) * dt
		];
		d.trickT = Math.max(0, (d.trickT || 0) - dt);
		const trickSide = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
		const jumpEdge = !!inp.jump && !d.jumpHeld;
		d.jumpHeld = !!inp.jump;
		d.airT = d.air ? (d.airT || 0) + dt : 0;
		d.coyoteT = d.air ? Math.max(0, (d.coyoteT || 0) - dt) : 0;
		d.jumpBufT = Math.max(0, (d.jumpBufT || 0) - dt);
		let tricked = false;
		if (A3 && !d.ride && !d.trickT && trickSide && Math.abs(d.speed) >= TRICK.minSpeed && (d.air && jumpEdge && d.airT >= TRICK.airMin || !d.air && inp.tip)) {
			d.trickT = TRICK.lockS;
			d.tricks = (d.tricks || 0) + 1;
			tricked = d.air;
			if (d.air) d.events.push({
				type: "trick",
				kind: "tumble",
				side: trickSide,
				speed: clamp$1(Math.abs(d.speed) / FLOW.maxForward, 0, 1)
			});
			else {
				d.freeTip = {
					side: trickSide,
					t: 0
				};
				d.events.push({
					type: "trick",
					kind: "twoWheel",
					side: trickSide
				});
			}
		}
		const jump = (via) => {
			const lj = Math.abs(d.speed) >= JUMP.longFrom;
			d.vy = Math.max(d.air ? d.vy : 0, FEEL.jumpImpulse * (lj ? JUMP.long : JUMP.up));
			if (lj) d.speed *= JUMP.push;
			d.air = true;
			d.jumped = true;
			d.coyoteT = 0;
			d.jumpBufT = 0;
			d.events.push({
				type: "takeoff",
				vy: d.vy,
				speed: Math.abs(d.speed),
				jump: true,
				kind: lj ? "long" : "up",
				...via ? { via } : {}
			});
		};
		if (jumpEdge && !d.air) jump();
		else if (jumpEdge && A3 && d.coyoteT > 0 && !d.jumped && !tricked) jump("coyote");
		else if (jumpEdge && A3 && d.air && !tricked) d.jumpBufT = JUMP.buffer;
		if (d.air) {
			d.vy -= ASSIST.flyGravity * dt;
			delta[1] = d.vy * dt;
		}
		if (d.yaw !== yaw0 && env.blocked && env.blocked(d.x, d.y, d.z, d.yaw) && !env.blocked(d.x, d.y, d.z, yaw0)) {
			d.yaw = yaw0;
			d.turnBlocked = (d.turnBlocked || 0) + 1;
		}
		const sw = env.sweep([
			d.x,
			d.y,
			d.z
		], delta);
		const wallN = sw.hit ? sw.n : null;
		if (sw.hit && sw.n && Math.abs(sw.n[1]) < .7 && sw.ride && d.ride) {
			d.ride.contactT = Math.min(d.ride.contactT, 0);
			if (d.ride.aligned) d.ride.touched = true;
		} else if (sw.hit && sw.n && Math.abs(sw.n[1]) < .7 && sw.ride && A3 && !d.air && Math.abs(d.speed) >= RIDE.speedMin && Math.abs(fx * sw.n[0] + fz * sw.n[2]) < RIDE.maxInto) {
			const side = lx * sw.n[0] + lz * sw.n[2] > 0 ? 1 : -1;
			d.ride = {
				side,
				n: [
					sw.n[0],
					sw.n[1],
					sw.n[2]
				],
				t: 0,
				contactT: -RIDE.grace,
				abortT: 0,
				touched: false
			};
			d.rides = (d.rides || 0) + 1;
			d.events.push({
				type: "twoWheel",
				phase: "capture",
				side
			});
		} else if (sw.hit && sw.n && Math.abs(sw.n[1]) < .7) {
			const into = fx * sw.n[0] + fz * sw.n[2];
			const SOFT = sw.soft ? ASSIST.soft : null;
			if (into < -.2) {
				const e = clamp$1(Math.abs(d.speed) / (30 * K), .3, 1.2);
				d.squashV += ASSIST.squash * e * (SOFT ? SOFT.squash : 1);
				d.events.push({
					type: "railImpact",
					side: lx * sw.n[0] + lz * sw.n[2] > 0 ? 1 : -1,
					strength: clamp$1(Math.abs(d.speed) * -into / (30 * K), 0, 1) * (SOFT ? .5 : 1),
					contact: true,
					frontal: into < -.7,
					soft: !!SOFT,
					speed: Math.abs(d.speed),
					normal: [
						sw.n[0],
						sw.n[1],
						sw.n[2]
					]
				});
				d.speed = into < -.7 ? -Math.abs(d.speed) * (SOFT ? SOFT.back : A3 ? ASSIST.wallReflect : .35) : d.speed * (SOFT ? SOFT.keep : ASSIST.wallKeep);
				d.latV += Math.sign(lx * sw.n[0] + lz * sw.n[2]) * (FLOW.bounceBase + Math.abs(d.speed) * FLOW.bounceSpeed) * (SOFT ? SOFT.lat : 1);
				d.yaw += Math.sign(fx * sw.n[2] - fz * sw.n[0]) * .02;
				d.hits++;
			}
		}
		d.x += sw.delta[0];
		d.z += sw.delta[2];
		d.y += sw.delta[1];
		const g = env.ground(d.x, d.z, d.y + 1.5 * K);
		const want = g ? g.y + FEEL.hoverBase : -Infinity;
		if (d.air) {
			if (d.y <= want && d.vy <= 0) {
				const vN = -d.vy;
				d.events.push({
					type: "landing",
					strength: clamp$1(vN / (12 * K), 0, 1)
				});
				d.squashV += .9 * clamp$1(vN / (12 * K), .3, 1.4);
				d.y = want;
				d.vyG = 0;
				if (A3 && vN > LAND.bounceVN) d.vy = vN * LAND.bounce;
				else {
					d.vy = 0;
					d.air = false;
					d.jumped = false;
					if (A3) {
						d.gripT = LAND.grip;
						if (LAND.boostOn) d.landBoostT = LAND.boostT;
						if (d.jumpBufT > 0) jump("buffer");
					}
				}
			}
		} else if (!g || want < d.y + (d.vyG - ASSIST.flyGravity * dt) * dt - SLOPE.takeoffGap) {
			d.air = true;
			d.jumped = false;
			d.coyoteT = A3 ? JUMP.coyote : 0;
			d.vy = d.vyG + (d.zone?.seg === "commit" ? PUSH.launchVy : 0);
			if (d.zone?.seg === "commit") {
				d.events.push({
					type: "launch",
					id: d.zone.id
				});
				d.launches = (d.launches || 0) + 1;
			}
			d.events.push({
				type: "takeoff",
				vy: d.vy,
				speed: Math.abs(d.speed)
			});
		} else {
			d.vyG = Math.min(12 * K, Math.abs(d.speed) * .7 + 1 * K, Math.max(-15 * K, (want - d.y) / dt));
			d.y = want;
		}
		if (g?.floor != null && d.y < g.floor - .05 * K) {
			d.y = g.floor;
			if (d.vy < 0) d.vy = 0;
			d.vyG = 0;
			d.air = false;
			d.jumped = false;
			d.rescues = (d.rescues || 0) + 1;
		}
		{
			let t = g && !d.air ? g.n : null, rate = ATT.ground;
			if (!A3) {
				if (t) rate = 1e6;
				else t = d.up;
			}
			if (!t) {
				const vh = Math.max(Math.abs(d.speed), 1 * K), p = clamp$1(Math.atan2(d.vy, vh) * ATT.follow, -ATT.maxPitch, ATT.maxPitch), c = Math.cos(p), s = Math.sin(p);
				t = [
					-fx * s,
					c,
					-fz * s
				];
				rate = ATT.air;
			}
			const k = Math.min(1, rate * dt), u = [
				d.up[0] + (t[0] - d.up[0]) * k,
				d.up[1] + (t[1] - d.up[1]) * k,
				d.up[2] + (t[2] - d.up[2]) * k
			], l = Math.hypot(...u) || 1;
			d.up = [
				u[0] / l,
				u[1] / l,
				u[2] / l
			];
		}
		if (g && !d.air) {
			d.speed += SLOPE.g * (fx * g.n[0] + fz * g.n[2]) * dt;
			d.latV += SLOPE.g * SLOPE.lateral * (lx * g.n[0] + lz * g.n[2]) * dt;
			if (!inp.gas && !inp.brake && Math.abs(d.speed) < SLOPE.stopBelow && g.n[1] > SLOPE.flatNy) {
				d.speed = 0;
				d.latV *= .5;
			}
		}
		{
			const U = STUCK, St = d.stuck || (d.stuck = {
				tries: [],
				safe: [],
				safeT: 0,
				clock: 0,
				airT: 0,
				hist: [],
				nudge: null
			});
			St.clock += dt;
			const pushing = !d.air && (inp.gas || inp.brake && d.speed <= .5 * K), win = Math.round(U.window / dt);
			St.airT = d.air ? St.airT + dt : 0;
			if (!d.air && !St.nudge && Math.abs(d.speed) > 3 * K && (St.safeT += dt) >= U.safeEvery) {
				St.safeT = 0;
				St.safe.push({
					x: d.x,
					y: d.y,
					z: d.z,
					yaw: d.yaw,
					t: St.clock
				});
				if (St.safe.length > 40) St.safe.shift();
			}
			St.tries = St.tries.filter((t) => St.clock - t < U.windowS);
			if (pushing && !St.nudge) {
				St.hist.push([d.x, d.z]);
				if (St.hist.length > win) St.hist.shift();
			} else if (!St.nudge) St.hist.length = 0;
			const respawn = () => {
				const p = [...St.safe].reverse().find((q) => St.clock - q.t >= U.safeAge) || St.safe[0] || env.home?.();
				if (!p) return;
				d.events.push({
					type: "respawn",
					from: [
						d.x,
						d.y,
						d.z
					],
					to: [
						p.x,
						p.y,
						p.z
					]
				});
				d.x = p.x;
				d.z = p.z;
				d.y = p.y + U.dropH;
				d.vy = 0;
				d.air = true;
				d.yaw = p.yaw;
				d.speed = 0;
				d.latV = 0;
				d.squashV += .6;
				St.tries = [];
				St.hist = [];
				St.nudge = null;
				St.safe = St.safe.filter((q) => q !== p);
				d.rescues = (d.rescues || 0) + 1;
				d.t3 = (d.t3 || 0) + 1;
			};
			if (!A3) {
				St.hist.length = 0;
				St.nudge = null;
			} else if (St.airT > U.flyMax) respawn();
			else if (St.nudge) {
				const N = St.nudge;
				N.t -= dt;
				d.speed = -N.dir * U.nudge;
				d.latV *= .5;
				d.yaw += N.turn / N.T * dt;
				if (N.t <= 0) {
					St.nudge = null;
					St.hist = [];
				}
			} else if (St.hist.length >= win && Math.hypot(d.x - St.hist[0][0], d.z - St.hist[0][1]) < U.minProgress) {
				St.tries.push(St.clock);
				d.t1 = (d.t1 || 0) + 1;
				St.hist = [];
				if (St.tries.length >= U.tries) respawn();
				else {
					const dir = inp.gas ? 1 : -1, side = wallN ? Math.sign(lx * wallN[0] + lz * wallN[2]) || (St.tries.length % 2 ? 1 : -1) : St.tries.length % 2 ? 1 : -1, T = U.nudgeS[Math.min(U.nudgeS.length - 1, St.tries.length - 1)];
					St.nudge = {
						t: T,
						T,
						dir,
						turn: side * U.yawNudge * dir
					};
					d.events.push({
						type: "nudge",
						tier: 1
					});
				}
			}
		}
		{
			const S = d.signals, up = d.up;
			S.speed = clamp$1(Math.abs(d.speed) / FLOW.maxForward, 0, 1);
			S.longAccel = clamp$1((d.speed - v0) / dt / FLOW.accel, -1, 1);
			S.lateral = clamp$1(-d.latV / (11 * K), -1, 1);
			S.bank = clamp$1(-(lx * up[0] + lz * up[2]), -1, 1);
			S.drift = d.driftDir * d.drift;
		}
		d.squashV += (-d.squash * 180 - d.squashV * 9) * dt;
		d.squash += d.squashV * dt;
		d.pitch += ((inp.gas ? -1 : inp.brake ? 1 : 0) * Math.abs(d.speed) * FEEL.accelPitchGain * .55 + (d.boosting ? -FEEL.boostPitchBias : 0) - d.pitch) * Math.min(1, dt * 6);
		d.roll += (-d.latV * FEEL.lateralRollGain * 6 - d.roll) * Math.min(1, dt * 5);
		return d;
	}
	function attitude(d) {
		const u = d.up, l = Math.hypot(u[0], u[1], u[2]) || 1, ux = u[0] / l, uy = u[1] / l, uz = u[2] / l;
		const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), fd = fx * ux + fz * uz, nx = fx - fd * ux, ny = -fd * uy, nz = fz - fd * uz, nl = Math.hypot(nx, ny, nz) || 1;
		uy * nz / nl - uz * ny / nl;
		const ry = uz * nx / nl - ux * nz / nl;
		ux * ny / nl - uy * nx / nl;
		const D = 180 / Math.PI;
		return {
			pitchDeg: Math.asin(clamp$1(ny / nl, -1, 1)) * D - d.pitch * D,
			rollDeg: Math.asin(clamp$1(ry, -1, 1)) * D + d.roll * D,
			upY: uy
		};
	}
	//#endregion
	//#region src/m1/elan.js
	var ELAN = Object.freeze({
		sStall: 12,
		sThrill: 40,
		sDive: 60,
		sBoostMax: 85,
		thetaDive: 40 * Math.PI / 180,
		kDive: 1.25,
		c1: .06,
		c2: .02,
		kAlign: 4,
		wLow: 2.2,
		wHigh: 1,
		vSinkMax: 8,
		pitchRate: 1.6,
		pitchMax: 80 * Math.PI / 180,
		autoLevel: .35,
		cruise: -7 * Math.PI / 180,
		stallNose: -10 * Math.PI / 180,
		bankMax: Math.PI / 3,
		charges: 6,
		ascentUp: 12,
		ascentFwd: 3,
		surge: 10,
		lockS: .6,
		rollS: .55,
		rollFwd: 12,
		rollSide: 4,
		rollCd: 6,
		rollWindow: .15,
		regenGround: 3,
		regenAir: 8,
		regenThrill: 4,
		thrillAfter: .5,
		skimH: 4,
		skimS: 20,
		regenSkim: 6
	});
	var RACER = Object.freeze({
		kAlignK: .5,
		sinkK: 1.5,
		thrust: 3,
		airBrake: 10,
		boostAcc: 8,
		drain: .25,
		fill: .08,
		fillThrill: .15,
		fillSkim: .2,
		boilS: 1.5,
		h0: .45,
		hoverW: 6,
		hoverZeta: .7,
		groundDrag: .7,
		cruise: -12 * Math.PI / 180,
		landK: 1.2
	});
	var clamp = (x, a, b) => Math.min(b, Math.max(a, x));
	var lerp = (a, b, t) => a + (b - a) * t;
	var smoothstep = (a, b, x) => {
		const t = clamp((x - a) / (b - a), 0, 1);
		return t * t * (3 - 2 * t);
	};
	var len = (v) => Math.hypot(v[0], v[1], v[2]);
	function createElan({ pos, yaw = 0, speed = 22, J = 1, g = 9.81, profile = "figure", h0 = RACER.h0 } = {}) {
		const s = speed * J;
		return {
			J,
			g,
			pos: [...pos],
			v: [
				Math.sin(yaw) * s,
				0,
				Math.cos(yaw) * s
			],
			pitch: 0,
			yaw,
			bank: 0,
			charges: ELAN.charges,
			regen: 0,
			skimT: 0,
			thrillT: 0,
			lock: 0,
			rollT: 0,
			rollDir: 0,
			rollCd: 0,
			spaceT: -1,
			prevSteer: 0,
			kick: 0,
			kickV: 0,
			mode: "GLIDE",
			grounded: false,
			events: [],
			hit: null,
			profile,
			h0: h0 * J,
			P: 1,
			boilT: 0,
			boosting: false,
			landed: false
		};
	}
	var elanSpeed = (st) => len(st.v);
	function elanStep(st, inp, dt, env, opt = {}) {
		const E = ELAN, J = st.J, g = st.g, ab = opt.abilities !== false, R = st.profile === "racer";
		st.events.length = 0;
		st.hit = null;
		const hNow = env?.ground ? st.pos[1] - env.ground(st.pos[0], st.pos[2]) : Infinity;
		let s = len(st.v);
		const pitchIn = ((inp.noseUp ? 1 : 0) - (inp.noseDown ? 1 : 0)) * (inp.invert ? -1 : 1);
		if (inp.mousePitch != null) st.pitch = clamp(inp.mousePitch, -E.pitchMax, E.pitchMax);
		else if (pitchIn) st.pitch = clamp(st.pitch + pitchIn * E.pitchRate * dt, -E.pitchMax, E.pitchMax);
		else st.pitch += ((R && !inp.thrust ? RACER.cruise : E.cruise) - st.pitch) * Math.min(1, E.autoLevel * dt);
		const steer = (inp.left ? 1 : 0) - (inp.right ? 1 : 0), w = lerp(E.wLow, E.wHigh, clamp(s / (E.sDive * J), 0, 1)) * steer;
		st.yaw += w * dt;
		st.bank += (clamp(Math.atan2(s * w, g), -E.bankMax, E.bankMax) - st.bank) * Math.min(1, 6 * dt);
		const L = clamp(s / (E.sStall * J), 0, 1);
		if (L < 1 && !pitchIn) st.pitch += (E.stallNose - st.pitch) * Math.min(1, (1 - L) * 2 * dt);
		const cp = Math.cos(st.pitch), nose = [
			Math.sin(st.yaw) * cp,
			Math.sin(st.pitch),
			Math.cos(st.yaw) * cp
		];
		const dir = s > 1e-6 ? [
			st.v[0] / s,
			st.v[1] / s,
			st.v[2] / s
		] : nose, theta = Math.asin(clamp(dir[1], -1, 1));
		let grav = -g * Math.sin(theta) * (theta < -E.thetaDive ? E.kDive : 1);
		if (theta < 0) grav *= 1 - smoothstep(.95 * E.sDive * J, E.sDive * J, s);
		const c1 = opt.noDrag ? 0 : E.c1 * (R && hNow < 1.5 * st.h0 ? RACER.groundDrag : 1), c2 = opt.noDrag ? 0 : E.c2 / J;
		s = Math.max(0, s + (grav - c1 * s - c2 * Math.max(0, s - E.sDive * J) ** 2) * dt);
		if (R) {
			st.boilT = Math.max(0, st.boilT - dt);
			s += ((inp.thrust ? RACER.thrust : 0) - (inp.airBrake ? RACER.airBrake : 0)) * J * dt;
			s = Math.max(0, s);
			if (!inp.boost) st.boilLatch = false;
			if (!!inp.boost && st.boilT <= 0 && !st.boilLatch && st.P > 0) {
				if (!st.boosting) {
					st.events.push({ type: "surge" });
					st.kick += 4;
				}
				st.boosting = true;
				s += RACER.boostAcc * J * dt;
				st.P = Math.max(0, st.P - RACER.drain * dt);
				if (st.P <= 0) {
					st.boilT = RACER.boilS;
					st.boosting = false;
					st.boilLatch = true;
					st.events.push({ type: "boil" });
				}
			} else st.boosting = false;
		}
		const k = 1 - Math.exp(-E.kAlign * (R ? RACER.kAlignK : 1) * L * dt);
		const nd = [
			dir[0] + (nose[0] - dir[0]) * k,
			dir[1] + (nose[1] - dir[1]) * k,
			dir[2] + (nose[2] - dir[2]) * k
		], nl = len(nd) || 1;
		st.v = [
			nd[0] / nl * s,
			nd[1] / nl * s,
			nd[2] / nl * s
		];
		if (L < 1 && st.pitch > -E.thetaDive * .5) st.v[1] = Math.max(-E.vSinkMax * (R ? RACER.sinkK : 1) * J, st.v[1] - g * (1 - L) * dt);
		if (R && hNow < 3 * st.h0) {
			const w = RACER.hoverW;
			st.v[1] += (w * w * (st.h0 - hNow) - 2 * RACER.hoverZeta * w * st.v[1]) * dt;
		}
		st.lock = Math.max(0, st.lock - dt);
		st.rollCd = Math.max(0, st.rollCd - dt);
		const spaceEdge = !!inp.space && !st.spaceHeld, shiftEdge = !!inp.shift && !st.shiftHeld;
		st.spaceHeld = !!inp.space;
		st.shiftHeld = !!inp.shift;
		const steerEdge = steer !== 0 && st.prevSteer === 0;
		st.prevSteer = steer;
		if (ab) {
			if (spaceEdge && st.spaceT < 0) st.spaceT = 0;
			if (st.spaceT >= 0) {
				if (steerEdge && st.rollCd <= 0) {
					st.rollT = E.rollS;
					st.rollDir = -steer;
					st.rollCd = E.rollCd;
					st.spaceT = -1;
					const f = E.rollFwd * J;
					st.v = st.v.map((x, i) => x + nose[i] * f);
					st.kick += 6;
					st.events.push({
						type: "roll",
						dir: st.rollDir
					});
				} else if ((st.spaceT += dt) >= E.rollWindow) {
					st.spaceT = -1;
					if (st.charges >= 1 && st.lock <= 0) {
						st.charges -= 1;
						st.lock = E.lockS;
						st.v[1] += E.ascentUp * J;
						const f = E.ascentFwd * J;
						st.v[0] += Math.sin(st.yaw) * f;
						st.v[2] += Math.cos(st.yaw) * f;
						st.events.push({ type: "ascent" });
					}
				}
			}
			if (!R && shiftEdge && st.charges >= 1 && st.lock <= 0) {
				st.charges -= 1;
				st.lock = E.lockS;
				st.v = st.v.map((x, i) => x + nose[i] * E.surge * J);
				st.kick += 4;
				st.events.push({ type: "surge" });
			}
		}
		let side = [
			0,
			0,
			0
		];
		if (st.rollT > 0) {
			const a = Math.min(dt, st.rollT);
			st.rollT -= dt;
			const r = [
				Math.cos(st.yaw),
				0,
				-Math.sin(st.yaw)
			], m = E.rollSide * J * a / E.rollS * st.rollDir;
			side = r.map((x) => x * m);
		}
		s = len(st.v);
		if (s > E.sBoostMax * J) st.v = st.v.map((x) => x * E.sBoostMax * J / s);
		const want = [
			st.v[0] * dt + side[0],
			st.v[1] * dt,
			st.v[2] * dt + side[2]
		];
		const sw = env?.sweep ? env.sweep(st.pos, want) : {
			delta: want,
			hit: false
		};
		if (sw.hit) {
			st.hit = sw.n;
			const n = sw.n, into = st.v[0] * n[0] + st.v[1] * n[1] + st.v[2] * n[2];
			if (into < 0) st.v = st.v.map((x, i) => x - into * n[i]);
		}
		st.pos = [
			st.pos[0] + sw.delta[0],
			st.pos[1] + sw.delta[1],
			st.pos[2] + sw.delta[2]
		];
		const gy = env?.ground ? env.ground(st.pos[0], st.pos[2]) : -Infinity, h = st.pos[1] - gy;
		st.grounded = h <= .02 * J;
		if (st.grounded) {
			st.pos[1] = gy;
			if (st.v[1] < 0) st.v[1] = 0;
		}
		s = len(st.v);
		st.thrillT = s >= E.sThrill * J ? st.thrillT + dt : 0;
		const thrill = st.thrillT >= E.thrillAfter, every = st.grounded ? E.regenGround : thrill ? E.regenThrill : E.regenAir;
		if (st.charges < E.charges) {
			st.regen += dt;
			if (st.regen >= every) {
				st.regen -= every;
				st.charges += 1;
				st.events.push({
					type: "charge",
					why: st.grounded ? "ground" : thrill ? "thrill" : "air"
				});
			}
		} else st.regen = 0;
		const skim = !st.grounded && h < E.skimH * J && s >= E.skimS * J;
		if (skim && st.charges < E.charges) {
			st.skimT += dt;
			if (st.skimT >= E.regenSkim) {
				st.skimT -= E.regenSkim;
				st.charges += 1;
				st.events.push({
					type: "charge",
					why: "skim"
				});
			}
		} else if (!skim) st.skimT = 0;
		st.kickV += (-64 * st.kick - 16 * st.kickV) * dt;
		st.kick += st.kickV * dt;
		if (st.profile === "racer") {
			if (!st.boosting && st.boilT <= 0) st.P = Math.min(1, st.P + (skim ? RACER.fillSkim : thrill ? RACER.fillThrill : RACER.fill) * dt);
			if (!st.landed && h < RACER.landK * st.h0 && st.v[1] <= 0) {
				st.landed = true;
				st.events.push({ type: "land" });
			}
		}
		st.mode = st.grounded ? "GROUND" : st.rollT > 0 ? "ROLL" : s < E.sStall * J ? "STALL" : theta < -E.thetaDive ? "DIVE" : "GLIDE";
		st.h = h;
		st.thrill = thrill;
		st.skim = skim;
		return st;
	}
	//#endregion
	//#region src/m2/racerFlight.js
	var RFLY = Object.freeze({
		climbMin: 8 * Math.PI / 180,
		speedK: .5,
		vyMin: 4,
		doubleS: .4,
		boilPulseS: .25
	});
	var createRacerFlight = (J = 1, g = 9.81) => ({
		J,
		g,
		st: null,
		charges: ELAN.charges,
		lastJump: -1e9,
		t: 0,
		jumpHeld: false,
		boilPulse: 0,
		surgeN: 0,
		ascentN: 0,
		flights: 0,
		lands: 0,
		events: []
	});
	function racerTakeoff(F, d, why) {
		const J = F.J, st = createElan({
			pos: [
				d.x,
				d.y,
				d.z
			],
			yaw: d.yaw,
			speed: 0,
			J,
			g: F.g,
			profile: "racer"
		}), s = d.speed, l = d.latV || 0;
		st.v = [
			Math.sin(d.yaw) * s + Math.cos(d.yaw) * l,
			d.vy || 0,
			Math.cos(d.yaw) * s - Math.sin(d.yaw) * l
		];
		if (why === "double") st.v[1] = Math.max(st.v[1], 0) + ELAN.ascentUp * J;
		st.pitch = Math.atan2(st.v[1], Math.max(.001, Math.hypot(st.v[0], st.v[2])));
		st.charges = F.charges;
		F.st = st;
		F.flights++;
		F.events.push({
			type: "fly",
			why
		});
		return st;
	}
	function racerLand(F, d) {
		const st = F.st;
		if (!st) return;
		d.x = st.pos[0];
		d.y = st.pos[1];
		d.z = st.pos[2];
		d.yaw = st.yaw;
		d.speed = st.v[0] * Math.sin(st.yaw) + st.v[2] * Math.cos(st.yaw);
		d.latV = st.v[0] * Math.cos(st.yaw) - st.v[2] * Math.sin(st.yaw);
		d.vy = st.v[1];
		d.vyG = 0;
		d.air = true;
		d.pitch = 0;
		d.roll = 0;
		F.charges = st.charges;
		F.st = null;
		F.lands++;
		F.events.push({ type: "land" });
	}
	function racerFlightStep(F, d, k, dt, env) {
		F.t += dt;
		F.events.length = 0;
		F.boilPulse = Math.max(0, F.boilPulse - dt);
		const jumpEdge = !!k.jump && !F.jumpHeld;
		F.jumpHeld = !!k.jump;
		if (!F.st) {
			if (jumpEdge) {
				if (d.air && !k.left && !k.right && F.t - F.lastJump <= RFLY.doubleS) {
					F.lastJump = -1e9;
					racerTakeoff(F, d, "double");
				} else F.lastJump = F.t;
			}
			if (!F.st) return false;
		}
		const st = F.st;
		d.events.length = 0;
		elanStep(st, {
			thrust: !!k.gas && !k.noseUp,
			airBrake: !!k.brake && !k.noseDown,
			noseUp: !!k.noseUp,
			noseDown: !!k.noseDown,
			left: !!k.left,
			right: !!k.right,
			space: !!k.jump,
			boost: !!k.boost,
			mousePitch: k.mousePitch ?? null
		}, dt, env);
		for (const e of st.events) {
			if (e.type === "surge") F.surgeN++;
			if (e.type === "ascent") F.ascentN++;
			if (e.type === "boil") F.boilPulse = RFLY.boilPulseS;
		}
		d.x = st.pos[0];
		d.y = st.pos[1];
		d.z = st.pos[2];
		d.yaw = st.yaw;
		d.air = true;
		d.pitch = -st.pitch;
		d.roll = -st.bank;
		d.up = [
			0,
			1,
			0
		];
		d.speed = Math.hypot(st.v[0], st.v[2]);
		d.vy = st.v[1];
		d.latV = 0;
		F.charges = st.charges;
		if (st.events.some((e) => e.type === "land")) racerLand(F, d);
		return true;
	}
	function racerAfterK2t(F, d) {
		if (F.st) return;
		if (!d.events.find((x) => x.type === "takeoff" && !x.jump)) return;
		const s = Math.abs(d.speed), climb = Math.atan2(d.vy || 0, Math.max(.001, s));
		const zone = d.events.some((x) => x.type === "launch");
		if (d.speed > 0 && s >= RFLY.speedK * ELAN.sThrill * F.J && climb > RFLY.climbMin && ((d.vy || 0) >= RFLY.vyMin * F.J || zone)) racerTakeoff(F, d, zone ? "zone" : "ramp");
	}
	var racerDrive = (F, k) => {
		const st = F.st;
		return st ? {
			gas: !!k.gas && !k.noseUp,
			brake: !!k.brake && !k.noseDown || F.boilPulse > 0,
			boost: st.boosting,
			jump: false,
			air: true,
			fly: true,
			boil: st.boilT > 0,
			surgeN: F.surgeN,
			ascentN: F.ascentN,
			P: st.P,
			speed01: Math.min(1, elanSpeed(st) / (ELAN.sDive * F.J))
		} : null;
	};
	//#endregion
	//#region src/camera/followCam.js
	function smoothDamp(cur, target, st, key, smoothTime, dt, maxSpeed = Infinity) {
		const T = Math.max(1e-4, smoothTime), w = 2 / T, x = w * dt, e = 1 / (1 + x + .48 * x * x + .235 * x * x * x);
		let change = cur - target;
		const maxC = maxSpeed * T;
		change = Math.max(-maxC, Math.min(maxC, change));
		const tgt = cur - change, v = st[key] || 0, temp = (v + w * change) * dt;
		st[key] = (v - w * temp) * e;
		let out = tgt + (change + temp) * e;
		if (target - cur > 0 === out > target) {
			out = target;
			st[key] = (out - target) / Math.max(dt, 1e-6);
		}
		return out;
	}
	var wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
	var FOLLOW = Object.freeze({
		omega: 7.5,
		armIn: 8,
		armOut: 3,
		recenter: 1.6,
		idleS: 1,
		zoomStep: .0012,
		zoomMin: .55,
		zoomMax: 2.8,
		zoomPov: .12,
		rotate: .005,
		pitchMin: -.15,
		pitchMax: 1.25,
		pad: .3
	});
	function createFollowCam(opts) {
		const O = {
			pitch0: .32,
			maxArm: 7.5,
			minClear: .4,
			...opts
		};
		const st = {
			yaw: null,
			pitch: O.pitch0,
			wantYaw: 0,
			wantPitch: O.pitch0,
			zoom: 1,
			wantZoom: 1,
			arm: O.base,
			lastInput: -1e9,
			t: 0,
			v: {},
			tgt: null,
			init: false
		};
		const tmp = {
			off: new three.Vector3(),
			dir: new three.Vector3(),
			p: new three.Vector3(),
			look: new three.Vector3()
		};
		let drag = null;
		const down = (e) => {
			drag = {
				x: e.clientX,
				y: e.clientY
			};
		}, up = () => {
			drag = null;
		};
		const move = (e) => {
			if (!drag || !e.buttons) return;
			api.orbit((e.clientX - drag.x) * -FOLLOW.rotate, (e.clientY - drag.y) * FOLLOW.rotate);
			drag = {
				x: e.clientX,
				y: e.clientY
			};
		};
		const wheel = (e) => {
			const d = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * 800 : e.deltaY;
			api.zoomBy(Math.max(-360, Math.min(360, d)));
			e.preventDefault();
		};
		if (O.dom) {
			O.dom.addEventListener("pointerdown", down);
			window.addEventListener("pointerup", up);
			O.dom.addEventListener("pointermove", move);
			O.dom.addEventListener("wheel", wheel, { passive: false });
		}
		const api = {
			state: st,
			orbit(dYaw, dPitch) {
				st.wantYaw = wrap(st.wantYaw + dYaw);
				st.wantPitch = Math.max(FOLLOW.pitchMin, Math.min(FOLLOW.pitchMax, st.wantPitch + dPitch));
				st.lastInput = st.t;
			},
			zoomBy(delta) {
				if (st.wantZoom <= FOLLOW.zoomPov) {
					if (delta > 0) st.wantZoom = FOLLOW.zoomMin;
					return;
				}
				const z = st.wantZoom * Math.exp(delta * FOLLOW.zoomStep);
				st.wantZoom = z < FOLLOW.zoomMin && st.wantZoom <= FOLLOW.zoomMin + 1e-6 ? FOLLOW.zoomPov : Math.max(FOLLOW.zoomMin, Math.min(FOLLOW.zoomMax, z));
			},
			pov: () => st.zoom <= FOLLOW.zoomPov + 1e-6,
			reset() {
				st.init = false;
				st.v = {};
			},
			update(dt, camera, { target, heading, moving }) {
				if (dt <= 0) return;
				st.t += dt;
				const T = 2 / FOLLOW.omega;
				if (!st.init) {
					st.tgt = target.clone();
					st.yaw = st.wantYaw = wrap(heading + Math.PI);
					st.pitch = st.wantPitch = O.pitch0;
					st.zoom = st.wantZoom;
					st.arm = O.base * st.zoom;
					st.init = true;
				}
				if (moving && st.t - st.lastInput > FOLLOW.idleS) st.wantYaw = wrap(st.wantYaw + wrap(heading + Math.PI - st.wantYaw) * (1 - Math.exp(-FOLLOW.recenter * dt)));
				st.yaw = wrap(st.yaw + smoothDamp(0, wrap(st.wantYaw - st.yaw), st.v, "yaw", T, dt));
				st.pitch = smoothDamp(st.pitch, st.wantPitch, st.v, "pitch", T, dt);
				if (st.wantZoom <= FOLLOW.zoomPov) {
					st.zoom = FOLLOW.zoomPov;
					st.v.zoom = 0;
				} else {
					if (st.zoom <= FOLLOW.zoomPov) {
						st.zoom = FOLLOW.zoomMin;
						st.arm = O.base * st.zoom;
					}
					st.zoom = smoothDamp(st.zoom, st.wantZoom, st.v, "zoom", T, dt);
				}
				const pov = api.pov();
				if (pov !== st.povShown) {
					st.povShown = pov;
					O.onPov?.(pov);
				}
				for (const a of [
					"x",
					"y",
					"z"
				]) st.tgt[a] = smoothDamp(st.tgt[a], target[a], st.v, "t" + a, T * .35, dt);
				const look = tmp.look.copy(st.tgt);
				look.y += O.height;
				if (pov) {
					const yaw = st.yaw + Math.PI, c = Math.cos(st.pitch * .5), a = O.eyeAhead || 0, ex = st.tgt.x + Math.sin(heading) * a, ez = st.tgt.z + Math.cos(heading) * a;
					camera.position.set(ex, st.tgt.y + O.eye, ez);
					camera.lookAt(ex + Math.sin(yaw) * c, st.tgt.y + O.eye - Math.sin(st.pitch * .5) * .3, ez + Math.cos(yaw) * c);
					return;
				}
				const want = O.base * st.zoom, cp = Math.cos(st.pitch);
				tmp.dir.set(Math.sin(st.yaw) * cp, Math.sin(st.pitch), Math.cos(st.yaw) * cp).normalize();
				const hit = O.collide ? O.collide(look, tmp.dir, want + FOLLOW.pad) : null, lim = hit != null ? Math.max(.6, Math.min(want, hit - FOLLOW.pad)) : want;
				const rate = lim < st.arm ? FOLLOW.armIn : FOLLOW.armOut, step = (lim - st.arm) * (1 - Math.exp(-rate * dt));
				st.arm += Math.sign(step) * Math.min(Math.abs(step), O.maxArm * dt);
				const p = tmp.p.copy(look).addScaledVector(tmp.dir, st.arm);
				const gy = O.ground ? O.ground(p.x, p.z) : -Infinity;
				if (p.y < gy + O.minClear) p.y = gy + O.minClear;
				camera.position.copy(p);
				camera.lookAt(look);
			},
			detach() {
				if (O.dom) {
					O.dom.removeEventListener("pointerdown", down);
					window.removeEventListener("pointerup", up);
					O.dom.removeEventListener("pointermove", move);
					O.dom.removeEventListener("wheel", wheel);
				}
			}
		};
		return api;
	}
	//#endregion
	exports.ASSIST = ASSIST;
	exports.ASSIST_M3 = ASSIST_M3;
	exports.ATT = ATT;
	exports.CLASS_K = CLASS_K;
	exports.DRIFTBOOST = DRIFTBOOST;
	exports.FEEL = FEEL;
	exports.FLOW = FLOW;
	exports.FOLLOW = FOLLOW;
	exports.G = G;
	exports.JUMP = JUMP;
	exports.JUMP_K = JUMP_K;
	exports.K = K;
	exports.LAND = LAND;
	exports.M_PER_RIG = M_PER_RIG;
	exports.PUSH = PUSH;
	exports.RFLY = RFLY;
	exports.RIDE = RIDE;
	exports.SLOPE = SLOPE;
	exports.SQUASH_LOOK = SQUASH_LOOK;
	exports.STUCK = STUCK;
	exports.TRICK = TRICK;
	exports.TURN = TURN;
	exports.WORLD_K = WORLD_K;
	exports.attitude = attitude;
	exports.createFollowCam = createFollowCam;
	exports.createK2t = createK2t;
	exports.createRacerFlight = createRacerFlight;
	exports.racerAfterK2t = racerAfterK2t;
	exports.racerDrive = racerDrive;
	exports.racerFlightStep = racerFlightStep;
	exports.racerLand = racerLand;
	exports.racerTakeoff = racerTakeoff;
	exports.smoothDamp = smoothDamp;
	exports.stepK2t = stepK2t;
	return exports;
})({}, THREE);
