// Perf HUD (?hud=1): fps, frame time p50/p95/max, worst hitch, draw calls, triangles, chunks, build ms, radius.
export class Hud {
  private el: HTMLDivElement;
  private acc = 0;

  constructor() {
    const el = document.createElement('div');
    el.id = 'kfb-perf-hud';
    Object.assign(el.style, {
      position: 'fixed',
      left: '10px',
      top: '10px',
      zIndex: '50',
      pointerEvents: 'none',
      font: '12px/1.45 ui-monospace, Menlo, monospace',
      color: '#eef3e6',
      background: 'rgba(18, 24, 20, 0.62)',
      padding: '7px 10px',
      borderRadius: '6px',
      whiteSpace: 'pre',
      textShadow: '0 1px 0 #0008',
    } as CSSStyleDeclaration);
    document.body.appendChild(el);
    this.el = el;
  }

  /** Throttled to 4 Hz. */
  update(dt: number, lines: () => string[]): void {
    this.acc += dt;
    if (this.acc < 0.25) return;
    this.acc = 0;
    this.el.textContent = lines().join('\n');
  }

  dispose(): void {
    this.el.remove();
  }
}
