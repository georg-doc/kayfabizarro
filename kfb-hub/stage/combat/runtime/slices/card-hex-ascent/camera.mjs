// Card-Hex Ascent · the only active camera owner + input.
import * as THREE from 'three';

export class FollowCamera {
  constructor(camera, dom) {
    this.camera = camera; this.dom = dom; this.yaw = Math.PI; this.pitch = 0.46; this.dist = 10.5; this.target = new THREE.Vector3();
    this.override = null; this.smoothed = new THREE.Vector3(); this.first = true;
    dom.addEventListener('mousemove', e => {
      const locked = document.pointerLockElement === dom;
      if (!locked && !(e.buttons & 4) && !this.dragging) return;
      this.yaw -= e.movementX * 0.0035; this.pitch = Math.max(-0.25, Math.min(1.15, this.pitch + e.movementY * 0.0028));
    });
    dom.addEventListener('wheel', e => { this.dist = Math.max(5, Math.min(18, this.dist * (1 + Math.sign(e.deltaY) * 0.08))); e.preventDefault(); }, { passive: false });
  }
  // Camera-relative intent: forward = away from camera on the ground plane.
  forward() { return { x: -Math.sin(this.yaw), z: -Math.cos(this.yaw) }; }
  intent(ix, iz) { // ix: right(+)/left(-), iz: forward(+)
    const f = this.forward(), r = { x: -f.z, z: f.x };
    return { x: r.x * ix + f.x * iz, z: r.z * ix + f.z * iz };
  }
  update(dt, focus) {
    if (this.override) { const o = this.override; this.camera.position.copy(o.pos); this.camera.lookAt(o.look); return; }
    this.target.set(focus.x, focus.y + 1.6, focus.z);
    if (this.first) { this.smoothed.copy(this.target); this.first = false; }
    this.smoothed.lerp(this.target, 1 - Math.exp(-dt * 10));
    const cp = Math.cos(this.pitch);
    this.camera.position.set(this.smoothed.x + Math.sin(this.yaw) * cp * this.dist, this.smoothed.y + Math.sin(this.pitch) * this.dist, this.smoothed.z + Math.cos(this.yaw) * cp * this.dist);
    this.camera.lookAt(this.smoothed);
  }
  snap() { this.first = true; }
}

export class Input {
  constructor(dom) {
    this.keys = new Set(); this.edges = new Set(); this.mouse = { fire: false, fireEdge: false, aim: false };
    this.synthetic = null; // harness-provided human-equivalent input
    addEventListener('keydown', e => { if (e.repeat) return; this.keys.add(e.code); this.edges.add(e.code); if (['Space', 'Tab', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault(); });
    addEventListener('keyup', e => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());
    dom.addEventListener('mousedown', e => { if (e.button === 0) { this.mouse.fire = true; this.mouse.fireEdge = true; } if (e.button === 2) this.mouse.aim = true; });
    addEventListener('mouseup', e => { if (e.button === 0) this.mouse.fire = false; if (e.button === 2) this.mouse.aim = false; });
    dom.addEventListener('contextmenu', e => e.preventDefault());
  }
  edge(code) { return this.edges.has(code); }
  read() {
    const k = this.keys, s = this.synthetic;
    let x = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    let z = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    const out = { x, z, sprint: k.has('ShiftLeft') || k.has('ShiftRight'), walk: k.has('AltLeft'), jump: this.edge('Space'), dodge: this.edge('KeyQ') || this.edge('ControlLeft'),
      fire: this.mouse.fire || k.has('KeyF'), fireEdge: this.mouse.fireEdge || this.edge('KeyF'), aim: this.mouse.aim || k.has('KeyE'),
      weapon1: this.edge('Digit1'), weapon2: this.edge('Digit2'), restart: this.edge('KeyR'), music: this.edge('KeyM'), mode: this.edge('Tab') };
    if (s) Object.assign(out, s, { jump: !!s.jump, fireEdge: !!s.fireEdge, dodge: !!s.dodge });
    return out;
  }
  endFrame() { this.edges.clear(); this.mouse.fireEdge = false; if (this.synthetic) { this.synthetic.jump = false; this.synthetic.fireEdge = false; this.synthetic.dodge = false; } }
}
