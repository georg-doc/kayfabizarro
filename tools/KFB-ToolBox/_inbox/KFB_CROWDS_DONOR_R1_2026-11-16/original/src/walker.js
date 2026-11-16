// Walking glue for a rigged character from any library: fades idle, walk and run by how fast a crowd member is going,
// with the clips' speed matched to it so the feet don't slide. Use one per character with its own AnimationMixer; the
// instanced figures in figures.js are for bigger crowds of rigid figures.
//
//   const walker = new Walker(new AnimationMixer(model), { idle, walk, run }, { walkSpeed: 1.4, runSpeed: 3.6 });
//   // every frame, for each member of the crowd:
//   model.position.set(m.x, m.y, m.z);
//   walker.update(m, dt);
//   model.rotation.y = walker.yaw;
export class Walker {
	constructor(mixer, { idle, walk, run }, { walkSpeed = 1.4, runSpeed = 3.6, faceOffset = 0 } = {}) {
		this.mixer = mixer;
		this.walkSpeed = walkSpeed;
		this.runSpeed = runSpeed;
		this.faceOffset = faceOffset;
		this.actions = { idle: mixer.clipAction(idle), walk: mixer.clipAction(walk), run: run ? mixer.clipAction(run) : null };
		for (const action of Object.values(this.actions)) {
			if (!action) continue;
			action.play();
			action.setEffectiveWeight(0);
		}
		this.actions.idle.setEffectiveWeight(1);
		this.speed = 0;
		this.yaw = 0;
	}

	update(member, dt) {
		this.speed += (member.speed - this.speed) * (1 - Math.exp(-dt * 7));
		const v = this.speed;
		if (member.speed > 0.2) {
			const turn = Math.atan2(member.vx, member.vz) + this.faceOffset - this.yaw;
			this.yaw += Math.atan2(Math.sin(turn), Math.cos(turn)) * (1 - Math.exp(-dt * 9));
		}
		const { idle, walk, run } = this.actions;
		const moving = Math.min(1, Math.max(0, (v - 0.12) / (this.walkSpeed * 0.55)));
		const running = run ? Math.min(1, Math.max(0, (v - this.walkSpeed) / (this.runSpeed - this.walkSpeed))) : 0;
		idle.setEffectiveWeight(1 - moving);
		walk.setEffectiveWeight(moving * (1 - running));
		walk.setEffectiveTimeScale(Math.max(0.5, v / this.walkSpeed));
		if (run) {
			run.setEffectiveWeight(moving * running);
			run.setEffectiveTimeScale(Math.max(0.5, v / this.runSpeed));
		}
		this.mixer.update(dt);
	}
}
