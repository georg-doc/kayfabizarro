// Small, unobtrusive controls hint at the start of the game; fades out after a few seconds or once the player has
// walked off. Hidden while a verification camera override is active (preset shots stay clean).
const KEYS: [string, string][] = [
  ['W/S', 'move'],
  ['A/D', 'turn'],
  ['Q/E', 'strafe'],
  ['Shift', 'run'],
  ['Space', 'jump'],
  ['Right-drag', 'camera'],
  ['Wheel', 'zoom'],
  ['1–6', 'characters'],
];

const SHOW_S = 9; // seconds on screen before fading
const FADE_S = 1.2;

export class ControlsHint {
  private el: HTMLDivElement;
  private t = 0;
  private fading = false;

  constructor() {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Controls');
    el.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:22px', 'transform:translateX(-50%)', 'z-index:5',
      'display:flex', 'gap:14px', 'align-items:center', 'padding:7px 14px', 'border-radius:999px',
      'background:rgba(28,34,44,0.42)', 'backdrop-filter:blur(4px)', '-webkit-backdrop-filter:blur(4px)',
      'font:500 12.5px/1 ui-rounded, system-ui, -apple-system, sans-serif', 'color:#f4f1e8', 'letter-spacing:0.01em',
      'text-shadow:0 1px 1px rgba(0,0,0,0.35)', 'pointer-events:none', 'user-select:none', 'white-space:nowrap',
      `transition:opacity ${FADE_S}s ease`, 'opacity:0',
    ].join(';');
    el.innerHTML = KEYS.map(
      ([k, v]) =>
        `<span style="display:inline-flex;gap:5px;align-items:center"><b style="display:inline-block;padding:3px 6px;border-radius:5px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.25);font-weight:600;font-size:11.5px">${k}</b>${v}</span>`,
    ).join('');
    document.body.appendChild(el);
    this.el = el;
    requestAnimationFrame(() => requestAnimationFrame(() => (el.style.opacity = '1')));
  }

  private done = false;

  /** Returns false once faded out (the element stays, hidden). */
  update(dt: number, movedMetres: number, overridden: boolean): boolean {
    this.t += dt;
    if (!this.fading) {
      this.el.style.visibility = overridden ? 'hidden' : 'visible';
      if (this.t > SHOW_S || movedMetres > 25) {
        this.fading = true;
        this.el.style.opacity = '0';
        // hide, never remove: removing an element over the WebGL canvas forces a recomposite (96–276 ms frame, streaming r2)
        setTimeout(() => {
          this.el.style.visibility = 'hidden';
          this.done = true;
        }, FADE_S * 1000 + 50);
      }
      return true;
    }
    return !this.done;
  }
}
