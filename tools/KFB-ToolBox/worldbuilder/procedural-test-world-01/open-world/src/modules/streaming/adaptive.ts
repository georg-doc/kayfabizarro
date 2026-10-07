// Optional adaptive quality (?adaptive=1): when the GPU is the bottleneck, drop the environment's GTAO pass first
// (≈ 2 ms GPU at 1080p), then the whole post pipeline (≈ 3 ms); restore when there is headroom again.
// Uses only the environment service's public setters (`postPipeline.aoEnabled`, `setPost`).
type Env = { setPost?(on: boolean): void; readonly post?: boolean; readonly postPipeline?: { aoEnabled: boolean } | null };

export class AdaptiveQuality {
  level = 0; // 0 full · 1 AO off · 2 post off
  private hot = 0;
  private cool = 0;
  private acc = 0;
  changes: { t: number; level: number; gpuP95: number; frameP95: number }[] = [];
  private postWasOn = true;

  constructor(private env: () => Env | undefined) {}

  /** Call per frame with the recent GPU p95 and frame-time p95 (ms). */
  update(dt: number, gpuP95: number, frameP95: number): void {
    this.acc += dt;
    if (this.acc < 0.5) return;
    const step = this.acc;
    this.acc = 0;
    if (!gpuP95) return;
    // over budget only when frames are actually late AND the GPU is the long pole
    if (gpuP95 > 16 && frameP95 > 20) {
      this.hot += step;
      this.cool = 0;
    } else if (gpuP95 < 9 && frameP95 < 18) {
      this.cool += step;
      this.hot = 0;
    } else {
      this.hot = this.cool = 0;
    }
    if (this.hot >= 3 && this.level < 2) this.set(this.level + 1, gpuP95, frameP95);
    else if (this.cool >= 6 && this.level > 0) this.set(this.level - 1, gpuP95, frameP95);
  }

  private set(level: number, gpuP95: number, frameP95: number): void {
    const env = this.env();
    if (!env) return;
    if (this.level === 0 && level > 0) this.postWasOn = env.post !== false;
    const pipe = env.postPipeline;
    if (pipe) pipe.aoEnabled = level < 1;
    if (env.setPost && this.postWasOn) env.setPost(level < 2);
    this.level = level;
    this.hot = this.cool = 0;
    this.changes.push({ t: +(performance.now() / 1000).toFixed(1), level, gpuP95, frameP95 });
    if (this.changes.length > 20) this.changes.shift();
  }
}
