/* Der EINE Bewegungs-Besitzer. Jeder Aktor-Adapter liest diesen Zustand; keiner schreibt
   eine zweite Position. Semantische Zustände, wie im Briefing §7:
   IDLE · WALK · RUN · DUCK · JUMP_START · AIRBORNE · LAND · HIT · EMOTE */
import * as THREE from 'three';

export const STATES = ['IDLE', 'WALK', 'RUN', 'DUCK', 'JUMP_START', 'AIRBORNE', 'LAND', 'HIT', 'EMOTE'];

export class Player {
  constructor(world, tuning) {
    this.world = world;
    const c = world.cell;
    this.t = {
      gravity: tuning.gravity * c, jumpSpeed: tuning.jumpSpeed * c,
      walk: tuning.walkSpeed * c, run: tuning.runSpeed * c, turn: tuning.turnSpeed,
      coyote: tuning.coyote, buffer: tuning.jumpBuffer, bounce: tuning.bouncePower * c
    };
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    /* Die Pack-Figur ist 2,06 hoch bei 2,0 Zellkante — eine Zelle IST rund eine Figurenhöhe.
       Jeder Aktor wird auf dieses Maß gebracht, damit Physik und Level actor-unabhängig sind. */
    this.radius = 0.26 * c;
    this.height = 1.05 * c;
    this.state = 'IDLE';
    this.stateTime = 0;
    this.grounded = false;
    this.ground = null;
    this.lastSafe = null;
    this.checkpoint = null;
    this.coyote = 0;
    this.bufferT = -1;
    this.assist = null;          // { target, apex, plannedT } während eines assistierten Sprungs
    this.anticipation = 0.14;
    this.landTimer = 0;
    this.hitTimer = 0;
    this.emote = null;
    this.speed = 0;
    this.events = [];            // { type, ... } — Ton/VFX lesen das und leeren es
    this.input = { fwd: 0, turn: 0, strafe: 0, run: false, duck: false };
    this.stats = { jumps: 0, assisted: 0, manual: 0, rescues: 0, falls: 0, bounces: 0 };
  }

  spawnAt(platform, offset = [0, 0]) {
    const c = this.world.cell;
    this.pos.set(platform.center.x + offset[0] * c, platform.top, platform.center.z + offset[1] * c);
    this.vel.set(0, 0, 0);
    this.grounded = true;
    this.ground = platform;
    this.lastSafe = platform;
    this.checkpoint = platform;
    this.setState('IDLE');
  }

  setState(s) {
    if (this.state === s) return;
    this.state = s;
    this.stateTime = 0;
    this.events.push({ type: 'state', state: s });
  }

  requestJump() { this.bufferT = this.t.buffer; }

  /* Ein Sprung, zwei Herkünfte: assistiert (Ziel + gerechnete Anfangsgeschwindigkeit) oder
     manuell (Sprunggeschwindigkeit nach oben, Horizontale behält der Spieler). Beide gehen
     durch dieselbe Anticipation → Takeoff-Kette; der Unterschied ist nur die Geschwindigkeit. */
  beginJump(plan) {
    this.pendingJump = plan || { kind: 'manual' };
    this.setState('JUMP_START');
    this.bufferT = -1;
  }

  takeoff() {
    const p = this.pendingJump || { kind: 'manual' };
    if (p.kind === 'assisted') {
      this.vel.copy(p.v0);
      this.assist = { target: p.target, started: performance.now(), plannedT: p.time };
      this.stats.assisted++;
      /* Der Aktor dreht sich zur Flugrichtung — sonst springt er seitwärts wie ein Brett. */
      this.yaw = Math.atan2(p.v0.x, p.v0.z);
    } else {
      this.vel.y = this.t.jumpSpeed;
      this.assist = null;
      this.stats.manual++;
    }
    this.stats.jumps++;
    this.grounded = false;
    this.ground = null;
    this.coyote = 0;
    this.pendingJump = null;
    this.setState('AIRBORNE');
    this.events.push({ type: 'jump', assisted: !!this.assist });
  }

  /* Chill rettet auf die LETZTE SICHERE Plattform (kein Fortschrittsverlust), Game Mode auf
     den letzten Checkpoint. Derselbe Fall, zwei Regeln — mehr Unterschied ist es nicht. */
  rescue(reason = 'fall') {
    const to = (this.useLastSafe ? this.lastSafe : this.checkpoint) || this.lastSafe || this.checkpoint;
    if (!to) return;
    this.pos.set(to.center.x, to.top + 0.2 * this.world.cell, to.center.z);
    this.vel.set(0, 0, 0);
    this.assist = null;
    this.grounded = true;
    this.ground = to;
    this.stats.rescues++;
    this.setState('LAND');
    this.landTimer = 0.2;
    this.events.push({ type: 'rescue', reason, to: to.id });
  }

  hit(source) {
    if (this.hitTimer > 0) return;
    this.hitTimer = 0.7;
    this.setState('HIT');
    this.vel.y = Math.max(this.vel.y, this.t.jumpSpeed * 0.35);
    this.events.push({ type: 'hit', source });
  }

  playEmote(name) { this.emote = { name, t: 0 }; this.setState('EMOTE'); }

  update(dt, ctx) {
    const w = this.world, t = this.t, c = w.cell;
    this.stateTime += dt;
    if (this.hitTimer > 0) this.hitTimer -= dt;
    if (this.bufferT >= 0) this.bufferT -= dt;

    const i = this.input;
    const wantRun = i.run && !i.duck;
    const maxSpeed = i.duck ? t.walk * 0.45 : wantRun ? t.run : t.walk;

    /* --- Ausrichtung / gewünschte Horizontalgeschwindigkeit --- */
    let wish = new THREE.Vector3();
    if (ctx.preset === 'PLATFORMER_CAMERA_RELATIVE') {
      const yawCam = ctx.cameraYaw;
      const f = new THREE.Vector3(Math.sin(yawCam), 0, Math.cos(yawCam));
      const r = new THREE.Vector3(Math.sin(yawCam + Math.PI / 2), 0, Math.cos(yawCam + Math.PI / 2));
      wish.addScaledVector(f, i.fwd).addScaledVector(r, i.strafe);
      if (wish.lengthSq() > 1e-6) {
        wish.normalize().multiplyScalar(maxSpeed);
        /* Drehung folgt der Bewegung — aber ohne 180°-Kippen: kürzester Weg, gedämpft. */
        const want = Math.atan2(wish.x, wish.z);
        this.yaw += shortAngle(this.yaw, want) * Math.min(1, dt * 12);
      }
    } else {
      this.yaw -= i.turn * t.turn * dt;                    // A/D drehen die FIGUR (KFB-Preset)
      const f = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
      const r = new THREE.Vector3(Math.sin(this.yaw + Math.PI / 2), 0, Math.cos(this.yaw + Math.PI / 2));
      wish.addScaledVector(f, i.fwd).addScaledVector(r, i.strafe);
      if (wish.lengthSq() > 1e-6) wish.normalize().multiplyScalar(maxSpeed);
    }

    /* Luftkontrolle: am Boden straff, frei in der Luft — und bei einem ASSISTIERTEN Sprung
       null. Das ist kein Geschmack, sondern Rechnung: der Bogen wird ballistisch gelöst;
       jede Dämpfung der Horizontalen während des Flugs macht die geplante Landung zur Lüge.
       (Gemessen: mit Dämpfung 0,8 blieb die Figur bei einem 11,4-Einheiten-Sprung 2 Einheiten
       vor der Plattform — sie fiel, obwohl „Landung garantiert“ versprochen war.) */
    /* Luftkontrolle: am Boden straff, in der Luft steuerbar — aber OHNE Eingabe bremst die
       Luft fast nicht. Ein Blend gegen wish=0 ist Luftreibung, und mit 4,5 frisst sie in
       0,9 s Flugzeit 98 % der Anlaufgeschwindigkeit: gemessen fielen dadurch manuelle
       Sprünge kurz, sobald der Spieler die Taste beim Absprung losließ.
       Bei einem ASSISTIERTEN Sprung ist die Kontrolle null — der Bogen ist ballistisch
       gelöst, jede Dämpfung macht die versprochene Landung zur Lüge. */
    const moving = wish.lengthSq() > 1e-6;
    const control = this.grounded ? 14 : this.assist ? 0 : moving ? 4.5 : 0.25;
    if (this.state !== 'JUMP_START') {
      this.vel.x += (wish.x - this.vel.x) * Math.min(1, dt * control);
      this.vel.z += (wish.z - this.vel.z) * Math.min(1, dt * control);
    }

    /* --- Sprungauslösung --- */
    if (this.state === 'JUMP_START') {
      if (this.stateTime >= this.anticipation) this.takeoff();
    } else if (this.bufferT > 0 && (this.grounded || this.coyote > 0) && this.hitTimer <= 0) {
      const plan = ctx.planJump ? ctx.planJump() : null;
      this.beginJump(plan);
    }

    /* --- Schwerkraft / Integration --- */
    const prevY = this.pos.y;
    if (this.state !== 'JUMP_START') {
      if (!this.grounded) this.vel.y -= t.gravity * dt;
      this.pos.x += this.vel.x * dt;
      this.pos.z += this.vel.z * dt;
      this.pos.y += this.vel.y * dt;
    }

    /* --- Boden ZUERST, Wände danach ---
       Die Reihenfolge ist der eigentliche Inhalt dieses Abschnitts. Umgekehrt herum (erst
       Wände) schob die seitliche Auflösung eine gerade landende Figur im letzten Bild aus
       der Plattform heraus, weil sie für ein Bild 0,1 unter der Oberkante stand — gemessen:
       drei von neun assistierten Sprüngen endeten so im Fall statt auf dem Ziel.
       Auch der Durchschlag ist abgedeckt: geprüft wird die STRECKE prevY → pos.y, nicht nur
       der Endpunkt; bei -20 u/s und 50 ms wäre eine 1 Einheit dünne Kante sonst durchfallen. */
    const wasGrounded = this.grounded;
    const support = w.supportAt(this.pos.x, this.pos.z, Math.max(prevY, this.pos.y) + 0.04 * c, this.radius * 0.8);
    if (this.vel.y <= 0 && support && this.pos.y <= support.top + 0.02 * c && prevY >= support.top - 0.6 * c) {
      const fell = !wasGrounded;
      this.pos.y = support.top;
      this.vel.y = 0;
      this.grounded = true;
      this.ground = support;
      this.lastSafe = support;
      if (support.checkpoint) this.checkpoint = support;
      this.coyote = t.coyote;
      if (this.assist) this.assist = null;
      if (fell) {
        this.landTimer = 0.18;
        this.setState('LAND');
        this.events.push({ type: 'land', platform: support.id });
      }
    } else if (this.grounded && (!support || this.pos.y > support.top + 0.05 * c)) {
      this.grounded = false;
      this.ground = null;
    }
    if (!this.grounded) this.coyote = Math.max(0, this.coyote - dt);

    /* Seitliche Wände: nur gegen Plattformen, deren Oberkante DEUTLICH über den Füßen liegt.
       Die Schwelle ist die Trittstufe — darunter ist es eine Landung, kein Anstoßen. */
    const stepTol = 0.3 * c;
    for (const p of w.platforms) {
      if (p === this.ground) continue;
      if (this.pos.y >= p.top - stepTol) continue;
      if (this.pos.y + this.height <= p.solid.min.y) continue;
      const dx = this.pos.x - p.center.x, dz = this.pos.z - p.center.z;
      const ox = p.half.x + this.radius - Math.abs(dx);
      const oz = p.half.y + this.radius - Math.abs(dz);
      if (ox <= 0 || oz <= 0) continue;
      if (ox < oz) { this.pos.x += Math.sign(dx || 1) * ox; this.vel.x = 0; }
      else { this.pos.z += Math.sign(dz || 1) * oz; this.vel.z = 0; }
    }

    /* --- Bouncer --- */
    for (const b of w.bouncers) {
      if (!this.grounded && this.vel.y > 0) continue;
      const d = Math.hypot(this.pos.x - b.pos.x, this.pos.z - b.pos.z);
      if (d < b.radius + this.radius && Math.abs(this.pos.y - b.base) < 0.4 * c) {
        this.vel.y = t.bounce;
        this.grounded = false;
        this.ground = null;
        this.assist = null;
        this.stats.bounces++;
        this.setState('AIRBORNE');
        this.events.push({ type: 'bounce', id: b.id });
      }
    }

    /* --- Pickups --- */
    for (const pk of w.pickups) {
      if (pk.taken) continue;
      if (this.pos.distanceTo(pk.pos) < 0.9 * c) {
        pk.taken = true;
        pk.node.visible = false;
        this.events.push({ type: 'pickup', kind: pk.kind, id: pk.id });
      }
    }

    /* --- Hazards: nur im Game Mode scharf --- */
    if (ctx.mode === 'game' && this.hitTimer <= 0) {
      for (const h of w.hazards) {
        const d = Math.hypot(this.pos.x - h.pos.x, this.pos.z - h.pos.z);
        if (d < h.radius + this.radius && this.pos.y < h.pos.y + h.height && this.pos.y > h.pos.y - 0.6 * c) this.hit(h.kind);
      }
    }

    /* --- Fall --- */
    if (this.pos.y < w.killY) { this.stats.falls++; this.rescue('fall'); }

    /* --- Zustandsableitung (Präsentation liest nur, schreibt nie) --- */
    this.speed = Math.hypot(this.vel.x, this.vel.z);
    if (this.landTimer > 0) this.landTimer -= dt;
    if (this.emote) { this.emote.t += dt; if (this.emote.t > 1.6) this.emote = null; }

    if (this.state === 'JUMP_START') { /* hält */ }
    else if (this.hitTimer > 0) this.setState('HIT');
    else if (!this.grounded) this.setState('AIRBORNE');
    else if (this.landTimer > 0) this.setState('LAND');
    else if (this.emote) this.setState('EMOTE');
    else if (this.input.duck) this.setState('DUCK');
    else if (this.speed > t.walk * 1.15) this.setState('RUN');
    else if (this.speed > 0.12 * c) this.setState('WALK');
    else this.setState('IDLE');
  }
}

export function shortAngle(from, to) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}
