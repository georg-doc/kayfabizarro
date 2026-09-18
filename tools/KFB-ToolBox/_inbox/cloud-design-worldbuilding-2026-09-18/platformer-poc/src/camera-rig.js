/* Third-Person-Follow mit freiem Orbit.

   Die harte Regel aus dem Briefing §9: die Kamera dreht sich NIE von selbst. Kein Nachziehen
   hinter die Figur, kein 180°-Kippen bei Richtungswechsel oder Landung. Der Orbit gehört dem
   Spieler; automatisch bewegt sich nur der Zielpunkt, und der auch nur gedämpft.
   Recenter (F) ist der einzige Moment, in dem die Kamera von allein dreht — auf Zuruf. */
import * as THREE from 'three';

export class CameraRig {
  constructor(camera, dom, cell) {
    this.camera = camera;
    this.cell = cell;
    this.yaw = Math.PI;              // Blickrichtung des Kamerastandorts
    this.pitch = 0.42;
    this.dist = 9 * cell;
    this.minDist = 3 * cell;
    this.maxDist = 26 * cell;
    this.target = new THREE.Vector3();
    this.smooth = new THREE.Vector3();
    this.first = true;
    this.dragging = false;
    this._recenter = 0;

    const down = (e) => {
      if (e.button !== 0 && e.button !== 2) return;
      this.dragging = true; this.lx = e.clientX; this.ly = e.clientY;
      dom.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      if (!this.dragging) return;
      this.yaw -= (e.clientX - this.lx) * 0.006;
      this.pitch = THREE.MathUtils.clamp(this.pitch + (e.clientY - this.ly) * 0.005, -0.25, 1.25);
      this.lx = e.clientX; this.ly = e.clientY;
      this._recenter = 0;
    };
    const up = (e) => { this.dragging = false; dom.releasePointerCapture?.(e.pointerId); };
    dom.addEventListener('pointerdown', down);
    dom.addEventListener('pointermove', move);
    dom.addEventListener('pointerup', up);
    dom.addEventListener('pointercancel', up);
    dom.addEventListener('contextmenu', (e) => e.preventDefault());
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.dist = THREE.MathUtils.clamp(this.dist * (1 + Math.sign(e.deltaY) * 0.12), this.minDist, this.maxDist);
    }, { passive: false });
  }

  /* Ausdrücklich angefordert, nicht automatisch: über 0,35 s hinter die Figur. */
  recenter(player) { this._recenter = 0.35; this._recenterTo = player.yaw + Math.PI; }

  get forwardYaw() { return this.yaw + Math.PI; }

  update(dt, player) {
    const c = this.cell;
    this.target.set(player.pos.x, player.pos.y + player.height * 0.62, player.pos.z);
    if (this.first) { this.smooth.copy(this.target); this.first = false; }
    /* Vertikal träger als horizontal: sonst wird jeder Sprung zur Achterbahn. */
    const kx = 1 - Math.pow(0.0009, dt), ky = 1 - Math.pow(0.02, dt);
    this.smooth.x += (this.target.x - this.smooth.x) * kx;
    this.smooth.z += (this.target.z - this.smooth.z) * kx;
    this.smooth.y += (this.target.y - this.smooth.y) * ky;

    if (this._recenter > 0) {
      this._recenter -= dt;
      let d = (this._recenterTo - this.yaw) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      this.yaw += d * Math.min(1, dt * 8);
    }

    const cp = Math.cos(this.pitch);
    const dir = new THREE.Vector3(Math.sin(this.yaw) * cp, Math.sin(this.pitch), Math.cos(this.yaw) * cp);
    this.camera.position.copy(this.smooth).addScaledVector(dir, this.dist);
    /* Nicht unter den Horizont der Plattform tauchen — Sprünge müssen lesbar bleiben. */
    const floor = player.pos.y - 2.5 * c;
    if (this.camera.position.y < floor) this.camera.position.y = floor;
    this.camera.lookAt(this.smooth);
  }
}
