/* Der Spieler und die zwei Spielweisen.

   CHILL & FUN heißt hier nicht »leichter«, sondern: der Turm darf dich nicht verlieren.
   Drei Regeln, und jede beantwortet einen konkreten Verlustfall —

     1 Kein Schritt über die Kante.  Ein Schritt, dessen Zielzelle keine Fläche hat, wird
       zerlegt (erst x, dann z) und sonst verworfen. Man rutscht an der Kante entlang,
       statt herunterzufallen.
     2 Ein Sprung, der ein Ziel hat, bekommt seinen Bogen GERECHNET. Nicht »etwas mehr
       Schub«, sondern die Horizontalgeschwindigkeit, die in der Flugzeit genau auf der
       Landezelle ankommt — dieselbe Flugzeit, die der Generator geprüft hat.
     3 Ein Sprung ohne Ziel landet wieder auf demselben Band. Wer im Leeren hängt, wird
       zurückgeholt, nicht bestraft.

   PLAY nimmt alle drei weg. Gleiche Werte, gleiche Physik, keine Hand. Fällt man unter das
   Rettungsmaß, setzt der Turm einen an der letzten belegten Zelle wieder ab — ein
   Fehlversuch, kein Neustart. */
import * as THREE from 'three';
import { worldToHex } from '../../hexrealm/lib/hex-grid.js';
import { K, cellWorld } from './tower.js';

const EMBED = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/';

export class Player {
  constructor(scene, cfg, model) {
    this.cfg = cfg; this.model = model;
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.grounded = false; this.airJumps = 0; this.mode = 'chill';
    this.state = 'IDLE'; this.speed = 0; this.yaw = 0;
    this.arc = null; this.rescues = 0; this.last = new THREE.Vector3();
    this.height = 2.0;
    this.root = new THREE.Group();
    this.root.name = 'player';
    scene.add(this.root);
    this.body = placeholderBody(this.height);
    this.root.add(this.body);
    this.actor = 'placeholder capsule — CapsuleCarl not mounted yet';
    this.keys = new Set();
  }

  /* CapsuleCarl über den öffentlichen Leser. Schlägt er fehl, bleibt die Kapsel stehen UND
     sagt es in der Leiste — es wird kein Ersatzrig gebaut (Projektregel 4). */
  async mountCarl(loader) {
    try {
      const carlMod = await import(EMBED + 'lab-v6/carlrig-mount.v1.js');
      const graftMod = await import(EMBED + 'frizzlegraft-v1/graft-mount.v1.js');
      const contractMod = await import(EMBED + 'lab-v6/carl-contract.v1.js');
      const rig6 = await (await fetch(EMBED + 'contracts/kfb-carl-rig-v6.json')).json();
      const pet = contractMod.toPets1(rig6).pets[0];
      const holder = new THREE.Group();
      const carl = await carlMod.mountCarl({ THREE, loader, scene: holder, mods: await graftMod.faceMods(), pet });
      const node = carl.group || carl.root || holder;
      const box = new THREE.Box3().setFromObject(node);
      const h = Math.max(0.001, box.getSize(new THREE.Vector3()).y);
      holder.scale.setScalar(this.height / h);
      holder.position.y = -box.min.y * (this.height / h);
      this.root.remove(this.body);
      this.root.add(holder);
      this.body = holder; this.carl = carl;
      this.actor = `CapsuleCarl · mountCarl() · 0 bones · fit ×${(this.height / h).toFixed(3)}`;
    } catch (e) {
      this.actor = `placeholder capsule — mountCarl() failed: ${e.message}`;
    }
    return this.actor;
  }

  bind(el) {
    const down = (e) => {
      if (e.target && /input|select|textarea/i.test(e.target.tagName)) return;
      this.keys.add(e.code);
      if (e.code === 'Space') { this.jump(); e.preventDefault(); }
    };
    const up = (e) => this.keys.delete(e.code);
    addEventListener('keydown', down); addEventListener('keyup', up);
    this._unbind = () => { removeEventListener('keydown', down); removeEventListener('keyup', up); };
    void el;
  }

  place(tower) {
    this.tower = tower;
    const b = tower.bands[0];
    const [x, y, z] = cellWorld(b, b.cells[0], tower);
    this.pos.set(x, y, z);
    this.last.copy(this.pos);
    this.vel.set(0, 0, 0);
    this.grounded = true; this.airJumps = 0; this.arc = null;
    this.band = b;
    this.root.position.copy(this.pos);
  }

  /* Welche Fläche liegt unter (x,z)? Die Umrechnung Welt→Zelle ist die exakte Umkehrung aus
     hex-grid.js — ein Kreis um den Zellmittelpunkt kachelt nicht, das kostete im Hex-Hub
     34 % der Landfläche. */
  surfaceAt(x, z, maxY = Infinity) {
    const t = this.tower;
    if (!t) return null;
    let best = null;
    for (const band of t.bands) {
      const [c, r] = worldToHex(x - band.cx, z - band.cz, t.m);
      if (!band.set.has(K(c, r))) continue;
      const y = band.level * t.step;
      if (y > maxY + 0.001) continue;
      if (!best || y > best.y) best = { y, band, cell: [c, r] };
    }
    return best;
  }

  jump() {
    if (!this.tower || this.frozen) return;
    const j = this.cfg.jump, d = this.cfg.doubleJump;
    if (this.grounded) {
      if (this.mode === 'chill' && this.planArc()) return;
      this.vel.y = j.impulse; this.grounded = false; this.airJumps = 0; this.state = 'JUMP';
    } else if (this.airJumps < (d.maxInAir ?? 1)) {
      this.vel.y = d.impulse; this.airJumps++; this.state = 'JUMP2';
      if (this.arc) this.arc.doubled = true;
    }
  }

  /* Der gerechnete Bogen. Ziel ist die Landezelle, die der Generator geprüft hat — die des
     nächsten Bandes nach oben oder die Absprungzelle des eigenen Bandes nach unten. Welche,
     entscheidet die Blickrichtung, nicht die Nähe: sonst springt man beim Umdrehen zurück. */
  planArc() {
    const t = this.tower;
    const here = this.surfaceAt(this.pos.x, this.pos.z, this.pos.y + 0.4);
    if (!here) return false;
    const i = here.band.i;
    const cands = [];
    const next = t.bands[i + 1];
    if (next && next.link) cands.push({ band: next, cell: next.link.to, link: next.link, dir: +1 });
    const cur = t.bands[i];
    if (cur && cur.link) cands.push({ band: t.bands[i - 1], cell: cur.link.from, link: cur.link, dir: -1 });
    if (!cands.length) return false;

    const facing = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    let best = null;
    for (const c of cands) {
      const [tx, ty, tz] = cellWorld(c.band, c.cell, t);
      const to = new THREE.Vector3(tx - this.pos.x, 0, tz - this.pos.z);
      const dist = to.length();
      if (dist < 0.01) continue;
      const dot = to.clone().normalize().dot(facing);
      const cone = Math.cos(THREE.MathUtils.degToRad(this.cfg.assist.facingConeDeg));
      if (dot < cone) continue;
      if (!best || dot > best.dot) best = { dot, dist, target: new THREE.Vector3(tx, ty, tz), ...c };
    }
    if (!best) return false;

    const dh = best.target.y - this.pos.y;
    const one = this.model.single(dh), two = this.model.double(dh);
    const use = (one.dist > 0 && one.t * this.model.run >= best.dist) ? one : two;
    if (!use || use.t <= 0) return false;
    this.vel.y = this.cfg.jump.impulse;
    this.vel.x = (best.target.x - this.pos.x) / use.t;
    this.vel.z = (best.target.z - this.pos.z) / use.t;
    this.grounded = false; this.airJumps = 0; this.state = 'JUMP';
    this.arc = { target: best.target.clone(), t: 0, dur: use.t, needDouble: use === two, doubled: false };
    return true;
  }

  update(dt, camera) {
    if (!this.tower || this.frozen) { this.root.visible = !this.frozen; return; }
    this.root.visible = true;
    const g = this.cfg.ground, air = this.cfg.air;
    const k = this.keys;
    let ix = 0, iz = 0;
    if (k.has('KeyW') || k.has('ArrowUp')) iz -= 1;
    if (k.has('KeyS') || k.has('ArrowDown')) iz += 1;
    if (k.has('KeyA') || k.has('ArrowLeft')) ix -= 1;
    if (k.has('KeyD') || k.has('ArrowRight')) ix += 1;
    const run = k.has('ShiftLeft') || k.has('ShiftRight');

    /* Eingabe ist kamerarelativ: vorwärts ist, wohin man sieht. */
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    const wish = new THREE.Vector3().addScaledVector(fwd, -iz).addScaledVector(right, ix);
    const moving = wish.lengthSq() > 0.0001;
    if (moving) { wish.normalize(); this.yaw = Math.atan2(wish.x, wish.z); }

    const target = run ? g.runSpeed : g.walkSpeed;
    /* Während eines gerechneten Bogens gibt es KEINE Luftsteuerung. Der erste Lauf hatte
       0,15 × airControl stehen gelassen: ohne gedrückte Taste zieht `approach` die
       Horizontalgeschwindigkeit gegen null, und der Sprung, den der Generator als erreichbar
       ausgewiesen hat, kam gemessen zu kurz — Rettung statt Landung. Wer den Bogen rechnet,
       muss ihn auch fliegen lassen. */
    const ctrl = this.grounded ? 1 : (this.arc ? 0 : air.airControl);
    const acc = (moving ? g.acceleration : g.deceleration) * ctrl;
    const desired = wish.multiplyScalar(moving ? target : 0);
    this.vel.x = approach(this.vel.x, desired.x, acc * dt);
    this.vel.z = approach(this.vel.z, desired.z, acc * dt);

    if (!this.grounded) {
      this.vel.y = Math.max(-air.maxFallSpeed, this.vel.y - air.gravity * dt);
      /* Chill: der zweite Impuls des geplanten Doppelsprungs feuert im Scheitel von selbst.
         Der Bogen war mit ihm gerechnet — ihn dem Spieler zu überlassen, hieße, eine
         geprüfte Strecke wieder zur Glückssache zu machen. */
      if (this.arc && this.arc.needDouble && !this.arc.doubled && this.vel.y <= 0) {
        this.vel.y = this.cfg.doubleJump.impulse; this.arc.doubled = true; this.airJumps = 1;
      }
    }

    const nx = this.pos.x + this.vel.x * dt, nz = this.pos.z + this.vel.z * dt;

    if (this.grounded) {
      const here = this.surfaceAt(nx, nz, this.pos.y + 0.6);
      if (here) { this.pos.x = nx; this.pos.z = nz; this.pos.y = here.y; this.band = here.band; this.last.copy(this.pos); }
      else if (this.mode === 'chill') {
        /* Regel 1 — der Schritt wird zerlegt statt verweigert: an einer Kante entlang läuft
           man weiter, man bleibt nicht kleben. */
        const ax = this.surfaceAt(nx, this.pos.z, this.pos.y + 0.6);
        const az = this.surfaceAt(this.pos.x, nz, this.pos.y + 0.6);
        if (ax) { this.pos.x = nx; this.pos.y = ax.y; this.vel.z = 0; }
        else if (az) { this.pos.z = nz; this.pos.y = az.y; this.vel.x = 0; }
        else { this.vel.x = 0; this.vel.z = 0; }
      } else {
        this.pos.x = nx; this.pos.z = nz; this.grounded = false; this.state = 'FALL';
      }
    } else {
      this.pos.x = nx; this.pos.z = nz;
      const prevY = this.pos.y;
      this.pos.y += this.vel.y * dt;
      const under = this.surfaceAt(this.pos.x, this.pos.z, Math.max(prevY, this.pos.y) + 0.05);
      if (under && this.vel.y <= 0 && this.pos.y <= under.y + this.cfg.landing.contactEpsilon) {
        /* Landemagnet, und zwar so eng wie in der Bewegungsdatei beschrieben: er greift nur
           NAHE am echten Landepunkt. Kein Schnappen über die Lücke. */
        if (this.arc) {
          const d = Math.hypot(this.arc.target.x - this.pos.x, this.arc.target.z - this.pos.z);
          const a = this.cfg.assist;
          if (a.enabled && d > 0.001 && d <= a.landingMagnetOnlyWithin) {
            const s = Math.min(d, a.landingMagnetRadius) / d;
            this.pos.x += (this.arc.target.x - this.pos.x) * s;
            this.pos.z += (this.arc.target.z - this.pos.z) * s;
          }
        }
        const land = this.surfaceAt(this.pos.x, this.pos.z, prevY + 0.05) || under;
        this.pos.y = land.y; this.vel.y = 0; this.vel.x = 0; this.vel.z = 0;
        this.grounded = true; this.airJumps = 0;
        this.band = land.band; this.arc = null; this.last.copy(this.pos);
        this.state = 'LAND';
      } else if (this.mode === 'chill' && !this.arc) {
        /* Regel 3 — ein Sprung ohne Ziel landet wieder zu Hause. Sanft: der Zug zur
           Bandmitte greift erst, wenn unter dem Spieler wirklich nichts ist. */
        const below = this.surfaceAt(this.pos.x, this.pos.z);
        if (!below && this.band) {
          const to = new THREE.Vector3(this.band.cx - this.pos.x, 0, this.band.cz - this.pos.z);
          if (to.lengthSq() > 0.0001) {
            to.normalize().multiplyScalar(this.cfg.ground.runSpeed * 0.9);
            this.vel.x = approach(this.vel.x, to.x, 26 * dt);
            this.vel.z = approach(this.vel.z, to.z, 26 * dt);
          }
        }
      }
    }

    /* Rettung. In Chill sofort und nah (man merkt sie kaum), in Play erst unter dem
       Rettungsmaß aus der Bewegungsdatei. */
    const floor = this.band ? this.band.level * this.tower.step : 0;
    const limit = this.mode === 'chill' ? floor - 4.5 : floor + this.cfg.rescue.fallThresholdY;
    if (this.pos.y < limit) {
      this.pos.copy(this.last); this.vel.set(0, 0, 0);
      this.grounded = true; this.arc = null; this.rescues++;
      this.state = 'RESCUE';
    }

    this.speed = Math.hypot(this.vel.x, this.vel.z);
    if (this.grounded) this.state = this.speed > g.runThreshold ? 'RUN' : (this.speed > 0.2 ? 'WALK' : 'IDLE');
    this.root.position.copy(this.pos);
    this.root.rotation.y = this.yaw;
    /* Präsentation ohne Knochen: Squash beim Absprung, Neigung in der Luft. */
    const t = performance.now() / 1000;
    const squash = this.grounded ? 1 + Math.sin(t * 6) * 0.012 : 1.06;
    this.body.scale.set(2 - squash, squash, 2 - squash);
    this.carl?.update?.(dt);
  }

  info() {
    return { mode: this.mode, state: this.state, band: this.band ? this.band.i : '—',
             speed: this.speed.toFixed(1), rescues: this.rescues, actor: this.actor };
  }
}

function approach(v, target, maxDelta) {
  const d = target - v;
  return Math.abs(d) <= maxDelta ? target : v + Math.sign(d) * maxDelta;
}

/* Sichtbar als das, was sie ist: eine Kapsel mit Blickrichtung, kein Charakter. */
function placeholderBody(h) {
  const g = new THREE.Group();
  const r = h * 0.22;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(r, h - 2 * r, 6, 14),
    new THREE.MeshStandardMaterial({ color: 0xd9cbf0, roughness: 0.75 }));
  body.position.y = h / 2; body.castShadow = true;
  const nose = new THREE.Mesh(new THREE.ConeGeometry(r * 0.42, r * 0.9, 10),
    new THREE.MeshStandardMaterial({ color: 0x7a5ea8, roughness: 0.6 }));
  nose.rotation.x = Math.PI / 2; nose.position.set(0, h * 0.72, r * 0.95);
  g.add(body, nose);
  return g;
}
