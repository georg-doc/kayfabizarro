// Keyboard + mouse state. KFB ground-controls canon (2026-10-07): the camera orbits only while the RIGHT mouse button
// is dragged (no pointer lock); the left button stays free for future interaction. `?lmbOrbit=1` re-enables a left drag
// (old verification scripts).

export class Input {
  private down = new Set<string>();
  private pressedThisFrame = new Set<string>();
  private releasedThisFrame = new Set<string>();
  /** Accumulated mouse delta in px since last endFrame(). */
  mouseDX = 0;
  mouseDY = 0;
  /** Accumulated wheel delta since last endFrame(). */
  wheel = 0;
  buttons = 0;
  private lastX: number | null = null;
  private lastY: number | null = null;
  /** Mouse buttons that drag the camera: 2 = right (canon); 1|2 with ?lmbOrbit=1. */
  private orbitMask = new URLSearchParams(location.search).has('lmbOrbit') ? 3 : 2;

  constructor(private el: HTMLElement) {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (!this.down.has(e.code)) this.pressedThisFrame.add(e.code);
      this.down.add(e.code);
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.down.delete(e.code);
      this.releasedThisFrame.add(e.code);
    });
    window.addEventListener('blur', () => this.down.clear());
    el.addEventListener('mousedown', (e) => {
      this.buttons = e.buttons;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });
    window.addEventListener('mouseup', (e) => (this.buttons = e.buttons));
    window.addEventListener('mousemove', (e) => {
      if (e.buttons & this.orbitMask) {
        if (this.lastX !== null && this.lastY !== null) {
          this.mouseDX += e.clientX - this.lastX;
          this.mouseDY += e.clientY - this.lastY;
        }
      }
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });
    el.addEventListener('wheel', (e) => {
      this.wheel += e.deltaY;
      e.preventDefault();
    }, { passive: false });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** Kept for API compatibility: pointer lock is no longer used (canon: right-drag orbits). */
  get pointerLocked(): boolean {
    return document.pointerLockElement === this.el;
  }

  /** True while the camera-orbit mouse button is held. */
  get orbiting(): boolean {
    return (this.buttons & this.orbitMask) !== 0;
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  /** True only on the frame the key went down. */
  pressed(code: string): boolean {
    return this.pressedThisFrame.has(code);
  }

  released(code: string): boolean {
    return this.releasedThisFrame.has(code);
  }

  endFrame(): void {
    this.pressedThisFrame.clear();
    this.releasedThisFrame.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
  }
}
