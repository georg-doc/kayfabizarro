// Frame-time recorder: ring buffer (recent window) + session histogram + worst hitches with what streaming did then.

export const BINS = [8, 12, 17, 20, 25, 33, 50, 100, 200, 500, Infinity];

export interface Hitch {
  t: number; // s since start
  ms: number;
  note: string; // what the scheduler did in that frame
  frame?: number; // engine frame (to join GPU time)
}

export class FrameRecorder {
  private ring = new Float32Array(1800); // 30 s at 60 fps
  private n = 0;
  private last = 0;
  hist = new Array(BINS.length).fill(0);
  frames = 0;
  totalMs = 0;
  max = 0;
  hitches: Hitch[] = [];
  private t0 = performance.now();
  /** What the scheduler did in the previous frame (set after its work; a long frame is measured one tick later). */
  prevNote = '';

  reset(): void {
    this.n = 0;
    this.hist.fill(0);
    this.frames = 0;
    this.totalMs = 0;
    this.max = 0;
    this.hitches = [];
    this.t0 = performance.now();
    this.last = 0;
  }

  /** Call once per frame. Returns the frame time (ms) or 0 on the first call. */
  tick(now: number, frame?: number): number {
    if (!this.last) {
      this.last = now;
      return 0;
    }
    const d = now - this.last;
    this.last = now;
    this.ring[this.n++ % this.ring.length] = d;
    this.frames++;
    this.totalMs += d;
    if (d > this.max) this.max = d;
    let b = 0;
    while (d > BINS[b]) b++;
    this.hist[b]++;
    if (d > 33.4) {
      this.hitches.push({ t: +((now - this.t0) / 1000).toFixed(2), ms: +d.toFixed(1), note: this.prevNote, frame });
      this.hitches.sort((a, c) => c.ms - a.ms);
      if (this.hitches.length > 12) this.hitches.length = 12;
    }
    return d;
  }

  /** Percentiles over the recent window (last `windowFrames` frames). */
  window(windowFrames = 300): { fps: number; p50: number; p95: number; p99: number; max: number; n: number } {
    const N = Math.min(this.n, windowFrames, this.ring.length);
    if (!N) return { fps: 0, p50: 0, p95: 0, p99: 0, max: 0, n: 0 };
    const a: number[] = [];
    for (let i = 0; i < N; i++) a.push(this.ring[(this.n - 1 - i + this.ring.length * 4) % this.ring.length]);
    const sum = a.reduce((s, x) => s + x, 0);
    a.sort((x, y) => x - y);
    const q = (p: number) => +a[Math.min(N - 1, Math.floor(p * N))].toFixed(1);
    return { fps: +((N / sum) * 1000).toFixed(1), p50: q(0.5), p95: q(0.95), p99: q(0.99), max: +a[N - 1].toFixed(1), n: N };
  }

  /** Session summary (since the last reset). */
  report() {
    const h: Record<string, number> = {};
    let lo = 0;
    BINS.forEach((b, i) => {
      h[`${lo}-${b === Infinity ? 'inf' : b}`] = this.hist[i];
      lo = b;
    });
    // session percentiles from the histogram are coarse; exact ones come from the recent window
    return {
      frames: this.frames,
      seconds: +(this.totalMs / 1000).toFixed(1),
      fpsAvg: this.frames ? +((this.frames / this.totalMs) * 1000).toFixed(1) : 0,
      max: +this.max.toFixed(1),
      over33: this.hist.slice(BINS.indexOf(50)).reduce((s, x) => s + x, 0),
      over50: this.hist.slice(BINS.indexOf(100)).reduce((s, x) => s + x, 0),
      hist: h,
      worst: this.hitches.slice(),
    };
  }
}
