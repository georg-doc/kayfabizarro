import RAPIER from '@dimforge/rapier3d-compat';

export const GRAVITY = -24; // m/s², slightly heavier than real for snappy cartoon jumps
const FIXED_DT = 1 / 60;
const MAX_STEPS = 16;

export class Physics {
  readonly world: RAPIER.World;
  readonly R = RAPIER;
  private acc = 0;
  /** Interpolation alpha of the last step(), for render smoothing. */
  alpha = 0;
  private stepHooks: ((dt: number) => void)[] = [];

  constructor() {
    this.world = new RAPIER.World({ x: 0, y: GRAVITY, z: 0 });
    this.world.timestep = FIXED_DT;
  }

  static async create(): Promise<Physics> {
    await RAPIER.init();
    return new Physics();
  }

  /** Register a callback run before every fixed physics step (character controllers). */
  onFixedStep(fn: (dt: number) => void): () => void {
    this.stepHooks.push(fn);
    return () => {
      this.stepHooks = this.stepHooks.filter((f) => f !== fn);
    };
  }

  step(dt: number): void {
    // Keep real-time speed at low fps: up to MAX_STEPS fixed steps per frame; only a hitch > 0.25 s loses time.
    this.acc += Math.min(dt, 0.25);
    let n = 0;
    while (this.acc >= FIXED_DT && n < MAX_STEPS) {
      for (const fn of this.stepHooks) {
        try {
          fn(FIXED_DT);
        } catch (e) {
          console.warn('[physics] fixed-step hook threw', e);
        }
      }
      this.world.step();
      this.acc -= FIXED_DT;
      n++;
    }
    if (n === MAX_STEPS && this.acc >= FIXED_DT) this.acc %= FIXED_DT;
    this.alpha = this.acc / FIXED_DT;
  }

  dispose():void {this.stepHooks=[];this.acc=0;this.world.free();}

  get fixedDt(): number {
    return FIXED_DT;
  }
}
