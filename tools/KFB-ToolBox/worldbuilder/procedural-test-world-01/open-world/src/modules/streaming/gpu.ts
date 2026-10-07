// GPU frame time via EXT_disjoint_timer_query_webgl2: one TIME_ELAPSED query per frame, spanning from this
// module's update to the next (= the GPU work of one rendered frame). Results arrive a few frames late.
export class GpuTimer {
  private gl: WebGL2RenderingContext;
  private ext: { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null;
  private pending: { q: WebGLQuery; frame: number }[] = [];
  private cur: { q: WebGLQuery; frame: number } | null = null;
  private ring = new Float32Array(600);
  private n = 0;
  /** engine frame → GPU ms (recent frames, for joining with CPU-side frame records). */
  readonly byFrame = new Map<number, number>();
  max = 0;

  constructor(gl: WebGL2RenderingContext | WebGLRenderingContext) {
    this.gl = gl as WebGL2RenderingContext;
    this.ext = typeof (gl as WebGL2RenderingContext).createQuery === 'function' ? (gl.getExtension('EXT_disjoint_timer_query_webgl2') as never) : null;
  }

  get available(): boolean {
    return !!this.ext;
  }

  frame(frameNo: number): void {
    const gl = this.gl, ext = this.ext;
    if (!ext) return;
    if (this.cur) {
      gl.endQuery(ext.TIME_ELAPSED_EXT);
      this.pending.push(this.cur);
      this.cur = null;
    }
    this.poll();
    if (this.pending.length > 8) return; // driver is far behind: skip a frame rather than pile up queries
    const q = gl.createQuery();
    if (!q) return;
    gl.beginQuery(ext.TIME_ELAPSED_EXT, q);
    this.cur = { q, frame: frameNo };
  }

  private poll(): void {
    const gl = this.gl, ext = this.ext!;
    const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
    while (this.pending.length) {
      const x = this.pending[0];
      if (!gl.getQueryParameter(x.q, gl.QUERY_RESULT_AVAILABLE)) break;
      const ns = gl.getQueryParameter(x.q, gl.QUERY_RESULT) as number;
      gl.deleteQuery(x.q);
      this.pending.shift();
      if (disjoint) continue;
      const ms = ns / 1e6;
      this.ring[this.n++ % this.ring.length] = ms;
      if (ms > this.max) this.max = ms;
      this.byFrame.set(x.frame, ms);
      if (this.byFrame.size > 4000) this.byFrame.delete(this.byFrame.keys().next().value as number);
    }
  }

  window(frames = 300): { p50: number; p95: number; max: number; n: number } {
    const N = Math.min(this.n, frames, this.ring.length);
    if (!N) return { p50: 0, p95: 0, max: 0, n: 0 };
    const a: number[] = [];
    for (let i = 0; i < N; i++) a.push(this.ring[(this.n - 1 - i + this.ring.length * 4) % this.ring.length]);
    a.sort((x, y) => x - y);
    return { p50: +a[Math.floor(0.5 * N)].toFixed(1), p95: +a[Math.min(N - 1, Math.floor(0.95 * N))].toFixed(1), max: +a[N - 1].toFixed(1), n: N };
  }

  reset(): void {
    this.max = 0;
    this.n = 0;
  }
}
