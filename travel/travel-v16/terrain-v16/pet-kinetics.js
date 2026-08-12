// ============================================================================
// pet-kinetics.js — KFB Travel · Pet response: flight, walk, jump
// ----------------------------------------------------------------------------
// The pet's KINETIC reaction to the vehicle / to the ground, ported from
// PetFlight v2's flight-kinetics and extended with a full cartoon jump grammar.
//
// Canon rules (must hold):
//  · Applied AFTER pet.update(dt) — PetMotion writes ch.inner.scale (and damps
//    group.rotation.z) every frame, so we READ its idle-breath (motionSy),
//    MULTIPLY our squash on top and set lean/position LAST so they win.
//  · Volume-preserving squash (cartoon-motion principle 1): Sxz = 1/√Sy.
//  · Jump grammar for BOTH modes, identical timing vocabulary
//    (cartoon-motion §12 principles + §real-time snappiness):
//      anticipation (duck, ~90 ms, cue on frame 1)
//        → launch (stretch pop)
//        → rise (stretch ∝ vy)
//        → apex (hang, brief neutral)
//        → fall (stretch again)
//        → land (squash ∝ impact)
//        → rebound overshoot → settle in Ruhe (Prime Directive).
//  · WALK mode also drives the GLB CLIP LAYER (EMBED_CUBE_PET_FULL_v2 §5):
//    idle · walk · run, timeScale matched to the real ground speed so the feet
//    don't slide; airborne uses `static` and our procedural aerial phases.
//    Ear/tail follow-through comes from PetMotion.initParts() (runner calls it).
//
//   const pk = createPetKinetics({ THREE });
//   pk.update(pet, vehicleState, dt);        // fly:  once/frame, AFTER pet.update(dt)
//   pk.updateWalk(pet, walkState, dt);       // walk: once/frame, AFTER pet.update(dt)
//   pk.jump();                               // fly hop (with anticipation)
//   pk.enterWalk() / pk.leaveWalk(pet)       // mode switch bookkeeping
// ============================================================================

export function createPetKinetics(opts = {}) {
  const clampf = (v, a, b) => Math.max(a, Math.min(b, v));
  const flSq = { s: 1, v: 0 };                 // squash spring (independent of PetMotion)
  // second-order inertia springs (value + velocity) → overshoot & settle, so motion feels weighty
  const roll = { x: 0, v: 0 }, pitch = { x: 0, v: 0 }, swayX = { x: 0, v: 0 }, yaw = { x: 0, v: 0 };
  let bobT = 0, prevBoost = false, prevClimb = 0;
  let bankRate = 0, prevBank = 0;              // d(bank)/dt → the whip of ENTERING a turn
  const jump = { active: false, y: 0, vy: 0, wind: 0 };
  const G = 26, J0 = 5.0;                       // gravity / launch velocity (card-local units)
  let flyCrouch = 0, flyPhase = 1;
  // S2 · Barrel-Roll: GENAU eine 360°-Drehung um die Flugachse pro Boost-Einsatz,
  // danach zurück auf 0. Der Winkel wird HIER erzeugt, aber NICHT hier angewandt:
  // die Rolle gehört der Karte (`rig.setBarrelRoll`), damit Karte und Pet gemeinsam
  // um die Karten-Mitte drehen statt jedes für sich.
  const br = { active: false, t: 0, dur: 0.85, angle: 0, on: true };
  function rollOnce(dur) {
    if (!br.on || br.active) return false;
    br.active = true; br.t = 0; br.dur = dur || 0.85;
    return true;
  }
  const kick = (a) => { flSq.v += a * 10; };    // + stretch, − duck
  // critically-ish damped spring step toward target
  function sp(s, target, stiff, damp, dt) { s.v += (target - s.x) * stiff * dt; s.v *= Math.pow(damp, dt * 60); s.x += s.v * dt; }
  // volume-preserving squash: one axis up → the other two down
  const applySquash = (ch, bs, sY) => { const s = clampf(sY, 0.66, 1.40), xz = 1 / Math.sqrt(s); ch.inner.scale.set(bs * xz, bs * s, bs * xz); };
  // aerial phase target: rise stretches, apex hangs, fall stretches again.
  // `gain` überzeichnet die Streckung für den Boden-Sprung (S79c) — der Flug bleibt bei 1.
  function aerial(vy, scale, gain) {
    const v = vy * scale, g = gain || 1;
    if (v > 1.2) return 1 + clampf(v * 0.020 * g, 0, 0.22 * g);
    if (v < -1.2) return 1 + clampf(-v * 0.014 * g, 0, 0.18 * g);
    return 0.98;                                // hang: a beat of neutral at the top
  }
  // asymmetric follow: ducking/loading is fast (frame-1 cue), releasing is softer
  const chase = (cur, tgt, dt) => cur + (tgt - cur) * Math.min(1, dt * (tgt < cur ? 40 : 20));

  function trigger() {
    if (jump.active || jump.wind > 0) return;
    jump.wind = 0.10;                           // anticipation window; the duck IS the cue
  }

  function update(pet, st, dt) {
    if (!pet || !pet.character || !pet.character.inner) return;
    const ch = pet.character, bs = ch._baseS || 1;
    bobT += dt; const bob = Math.sin(bobT * 2.4) * 0.035;

    // --- squash impulse kicks (SOFTENED so climb/dive no longer flattens the pet) ---
    if (st.boosting && !prevBoost) { kick(-0.18); rollOnce(); }
    if (!st.boosting && prevBoost) kick(0.08);
    prevBoost = st.boosting;
    const cs = st.climbIn > 0.10 ? 1 : st.climbIn < -0.10 ? -1 : 0;
    if (cs !== prevClimb) { if (cs > 0) kick(0.09); else if (cs < 0) kick(-0.09); }
    prevClimb = cs;

    // --- turn dynamics: bank + its RATE drive lateral weight ---
    bankRate += (((st.bank - prevBank) / Math.max(dt, 1e-3)) - bankRate) * Math.min(1, dt * 8);
    prevBank = st.bank;
    const turnMag = Math.min(1, Math.abs(st.bank) * 1.6 + Math.abs(bankRate) * 0.25);

    // --- jump: anticipation → ballistic hop → land squash (same grammar as walk) ---
    if (jump.wind > 0) {
      jump.wind -= dt;
      flyCrouch = Math.min(1, flyCrouch + dt * 12);
      if (jump.wind <= 0) {
        jump.wind = 0; flyCrouch = 0; jump.active = true; jump.vy = J0; kick(0.16);
        if (pet.rig && pet.rig.blinkNow) pet.rig.blinkNow();
      }
    } else if (flyCrouch > 0) flyCrouch = Math.max(0, flyCrouch - dt * 8);
    if (jump.active) {
      jump.y += jump.vy * dt; jump.vy -= G * dt;
      if (jump.y <= 0) {
        const hit = Math.abs(jump.vy);
        jump.y = 0; jump.vy = 0; jump.active = false;
        kick(-clampf(0.14 + hit * 0.030, 0.14, 0.38));
        if (pet.face && pet.face.eyePop) pet.face.eyePop(clampf(hit * 0.05, 0.12, 0.45));
      }
    }
    const phaseT = flyCrouch > 0.01 ? 1 - 0.22 * flyCrouch : (jump.active ? aerial(jump.vy, 0.9) : 1);
    flyPhase = chase(flyPhase, phaseT, dt);

    // --- Barrel-Roll: eased einmal herum, dann exakt 0 (kein Rest-Offset) ---
    if (br.active) {
      br.t += dt;
      const e = Math.min(1, br.t / br.dur), k = e * e * (3 - 2 * e);
      br.angle = k * Math.PI * 2;
      if (e >= 1) { br.active = false; br.angle = 0; }
    }

    // --- squash spring settles to 1; keep PetMotion idle-breath, multiply ours on top ---
    flSq.v += (1 - flSq.s) * 80 * dt - flSq.v * 11 * dt; flSq.s += flSq.v * dt;
    const motionSy = ch.inner.scale.y / bs;
    applySquash(ch, bs, motionSy * clampf(flSq.s, 0.78, 1.28) * flyPhase * (1 - turnMag * 0.06));

    // --- multi-axis inertia lean (set LAST so it wins over PetMotion) ---
    sp(roll, clampf(st.bank * 1.1 + bankRate * 0.18, -0.5, 0.5), 120, 0.72, dt);
    sp(pitch, clampf((st.boosting ? 0.10 : 0) + st.climbIn * 1.3 + (jump.active ? -jump.vy * 0.012 : 0) - flyCrouch * 0.06, -0.26, 0.26), 90, 0.80, dt);
    sp(swayX, clampf(-st.bank * 0.5 - bankRate * 0.10, -0.42, 0.42), 70, 0.78, dt);
    sp(yaw, clampf(st.bank * 0.28, -0.28, 0.28), 60, 0.80, dt);

    pet.object3D.rotation.set(pitch.x, Math.PI + yaw.x, roll.x);   // Math.PI: pet faces travel (−Z)
    pet.object3D.position.set(swayX.x, bob + jump.y - flyCrouch * 0.05, 0);
  }

  // ---- WALK mode: the pet is on the ground, not on the card ----
  const wSq = { s: 1, v: 0 };
  const wLean = { x: 0, v: 0 }, wPitch = { x: 0, v: 0 }, wYaw = { x: 0, v: 0 };
  let walkT = 0, idleT = 0, wFacing = 0, wFacingSet = false, wasAir = false, wPhase = 1;
  let stepCount = 0, stepSide = 1;   // S21: Fußaufsätze zählen — der Runner hängt die Schritt-SFX dran
  let curClip = null, clipAct = null;
  let elastic = 0;                   // S79c: Gummi-Nachschwingen (0..1) nach Absprung und Landung
  let gait = 'ground';
  // S79b · **Schrittlänge = Strecke pro Clip-Zyklus, in Weltunits.** Das ist die eine Zahl, mit der
  // die Füße zum Boden passen: der Zyklus wird von der GEFAHRENEN STRECKE getrieben (`ws.travel`),
  // nicht von der Uhr — also kann ein Standbein nicht rutschen, egal wie schnell gelaufen wird.
  // Voreinstellung = die Trittfrequenz von vorher (Clip 0,50 s bei 5,4 u/s → 2,7 u pro Zyklus),
  // damit sich nur die KOPPLUNG ändert und nicht heimlich auch das Tempo.
  const FEET = { walk: 2.7, run: 4.7 };
  // **Eine Zahl für alle 24 Pets** (Georg, 26.7. — geprüft): die Kenney-Cube-Pets teilen EINEN Rig,
  // jedes GLB bringt dieselben acht Clips mit derselben Länge (gemessen: walk 0,500 s · run 0,250 s).
  // Was sich unterscheidet, ist die GRÖSSE — und eine Schrittlänge ist eine Länge, also skaliert sie
  // mit dem Körper, sonst rudert ein kleines Pet und ein großes schlittert. Der Faktor kommt aus dem
  // Einpass-Maßstab des Modells (`_baseS`, beim Laden gesetzt und danach konstant) — NICHT aus einer
  // Bounding-Box und nicht aus der Gruppen-Skala: beide tragen die aktuelle Pose bzw. laufende
  // Motion mit (gemessen ±8 % zwischen zwei Frames desselben Pets) und wären eine Zahl, die bei
  // jedem Moduswechsel anders lügt. Referenz ist Uncle FrizzleBob (0,40795).
  const REF_K = 0.40795;
  let sizeK = 1, sizedFor = null, bindT = 0;
  function measureSize(pet) {
    const ch = pet && pet.character;
    if (!ch || sizedFor === ch) return;
    const k = ch._baseS || 0;
    if (k > 0.02) { sizeK = clampf(k / REF_K, 0.35, 3); sizedFor = ch; }
  }
  // Gangarten sind eine TABELLE, kein Sonderfall: 'swim' ist schon vorgesehen (S79d), sie wartet
  // nur auf Clips. Fehlt ein Clip im GLB, fällt `setClip` still auf prozedural zurück.
  const GAITS = {
    ground: { move: 'walk', fast: 'run', air: 'static' },
    swim: { move: 'swim', fast: 'swim-fast', air: 'swim' },
  };
  const feet = { lock: false, clip: 'idle', stride: FEET.walk, speed: 0, dur: 0 };
  const kickW = (a) => { wSq.v += a * 10; };
  const clipDur = (a) => { const c = a && a.getClip ? a.getClip() : null; return c && c.duration ? c.duration : 0; };

  function setClip(pet, name, speed) {
    if (!pet.motion || !pet.motion.playClip) return;
    if (name !== curClip) {
      const a = pet.motion.playClip(name, { speed });
      if (a) { clipAct = a; curClip = name; }
      else { curClip = name; clipAct = null; }    // clip missing in this GLB: stay procedural
    } else if (clipAct && Math.abs(clipAct.timeScale - speed) > 0.06) {
      clipAct.timeScale = speed;                  // retime WITHOUT restarting the cycle
    }
  }

  function updateWalk(pet, ws, dt) {
    if (!pet || !pet.character || !pet.character.inner) return;
    const ch = pet.character, bs = ch._baseS || 1;
    const G = GAITS[gait] || GAITS.ground;
    idleT += dt;

    // ---- CLIP LAYER: idle · walk · run, an die STRECKE gekoppelt (S79b) ----
    const air = !ws.onGround;
    const fast = !!ws.sprinting;
    const fl = ws.float || 0;                       // +1 = steigt, −1 = sinkt (fließender Höhenwechsel)
    const rolling = !air && ws.moving && (ws.speed || 0) > 0.4;
    const wantClip = air ? G.air : (rolling ? (fast ? G.fast : G.move) : 'idle');
    const ref = fast ? (ws.runRef || 9.4) : (ws.walkRef || 5.4);
    const rate = rolling ? clampf((ws.speed || 0) / ref, 0.55, 1.9) : 1;
    setClip(pet, wantClip, rate);
    // Der Zyklus hängt an der Strecke: `time` setzen wir selbst, `timeScale` bleibt 0. Der Mixer
    // läuft in derselben Frame-Ordnung (Motor zuerst, Kinetik danach) — ein Frame Nachlauf, aber
    // KEIN Driften: die Phase ist eine Funktion der Position, nicht der vergangenen Zeit.
    measureSize(pet);
    const stride = Math.max(0.4, (fast ? FEET.run : FEET.walk) * sizeK);
    let locked = false;
    if (clipAct && rolling) {
      const dur = clipDur(clipAct);
      if (dur > 0) {
        clipAct.timeScale = 0;
        const t = ((ws.travel || 0) / stride) * dur;
        clipAct.time = ((t % dur) + dur) % dur;
        locked = true; feet.dur = dur;
      }
    }
    feet.lock = locked; feet.clip = wantClip; feet.stride = stride; feet.speed = ws.speed || 0;
    // Auf „läuft" gaten, nie auf „existiert": scheitert die Bindung an den Clip EINMAL (der Motor gibt
    // in dem Frame keine Action zurück), bliebe der Zyklus für immer ungekoppelt, weil der Name schon
    // gesetzt ist. Also alle 0,4 s ein neuer Versuch — und bis dahin läuft es prozedural weiter.
    if (!clipAct && rolling) { bindT += dt; if (bindT > 0.4) { curClip = null; bindT = 0; } } else bindT = 0;

    // ---- Sprung-Grammatik, cartoonig: tiefes Ausholen → Streck-Pop → Landung mit Gummi ----
    if (air && !wasAir) {
      kickW(ws.bouncing ? 0.11 : 0.30);             // ein Prellsprung holt nicht neu aus
      elastic = 1;
      if (!ws.bouncing && pet.rig && pet.rig.blinkNow) pet.rig.blinkNow();
    }
    if (!air && wasAir) {
      const hit = ws.impact || 0;
      kickW(-clampf(0.20 + hit * 0.030, 0.20, 0.52));
      elastic = 1;
      if (hit > 9 && pet.face && pet.face.eyePop) pet.face.eyePop(clampf(hit * 0.030, 0.15, 0.55));
    }
    wasAir = air;
    elastic = Math.max(0, elastic - dt * 1.15);

    // phase target: anticipation duck (from the controller's windup) → überzeichneter Flugbogen
    const phaseT = ws.crouch > 0.01 ? 1 - 0.30 * ws.crouch : (air ? aerial(ws.vy, 0.72, 1.35) : 1);
    wPhase = chase(wPhase, phaseT, dt);

    // walk cycle: Bob und Fußaufsatz kommen aus DERSELBEN Phase wie der Clip — aus der Strecke.
    let bob = 0, stepSq = 1;
    if (rolling) {
      const prevT = walkT;
      walkT = ((ws.travel || 0) / stride) * Math.PI * 2;
      // Fußaufsatz = Halbzyklus-Grenze. Ein Sprung über mehr als einen Schritt (Teleport, Reset)
      // zählt NICHT mit — sonst prasseln zehn Tritte auf einmal.
      const dStep = Math.floor(walkT / Math.PI) - Math.floor(prevT / Math.PI);
      if (dStep === 1 || dStep === -1) { stepCount++; stepSide = -stepSide; }
      bob = Math.abs(Math.sin(walkT)) * (fast ? 0.09 : 0.06);
      stepSq = 1 - Math.abs(Math.cos(walkT)) * 0.045;
    } else if (!air) bob = Math.sin(idleT * 1.9) * 0.012;
    if (fl !== 0) bob += Math.sin(idleT * 5.2) * 0.03;   // Schweben wiegt, es steht nicht

    // Gummi (S79c): nach Landung/Absprung schwingt die Feder weicher aus — mehr Steifigkeit,
    // weniger Dämpfung. Das mehrfache Nachwippen entsteht HIER, nicht in einer zweiten Kurve.
    const stiff = 80 + 70 * elastic, damp = 11 - 6.2 * elastic;
    wSq.v += (1 - wSq.s) * stiff * dt - wSq.v * damp * dt; wSq.s += wSq.v * dt;
    const motionSy = ch.inner.scale.y / bs;
    const floatSq = fl !== 0 ? 1 + 0.06 * Math.abs(fl) : 1;
    applySquash(ch, bs, motionSy * clampf(wSq.s, 0.72, 1.34) * wPhase * stepSq * floatSq);

    // facing: turn smoothly toward the heading (shortest arc)
    if (!wFacingSet) { wFacing = ws.facing; wFacingSet = true; }
    const d = ((ws.facing - wFacing + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    wFacing += d * Math.min(1, dt * 10);

    // S79d · Kurven-Kinetik: die Neigung wächst mit dem TEMPO (Zentripetal), nicht nur mit der
    // Drehrate — im Lauf legt sich das Pet sichtbar in die Kurve, im Schritt geht es nur an.
    const vNorm = clampf((ws.speed || 0) / Math.max(1, ws.runRef || 9.4), 0, 1.2);
    sp(wLean, clampf(-(ws.turnRate || 0) * (0.07 + 0.10 * vNorm), -0.38, 0.38), 95, 0.76, dt);
    sp(wYaw, clampf(-(ws.turnRate || 0) * 0.05, -0.14, 0.14), 60, 0.80, dt);   // Nase voraus

    // Nase: beim Schweben trägt sie den Höhenwechsel (fly up/down), sonst Bogen, Ducken, Lauflage
    const pitchT = fl !== 0 ? clampf(-fl * 0.20, -0.20, 0.20)
      : (air ? clampf(-ws.vy * 0.013, -0.24, 0.24)
        : (ws.crouch > 0.01 ? -0.13 * ws.crouch
          : (rolling ? (fast ? 0.14 : 0.07) : 0)));
    sp(wPitch, pitchT, 70, 0.82, dt);

    pet.object3D.position.set(ws.position.x, ws.position.y + bob - ws.crouch * 0.06, ws.position.z);
    pet.object3D.rotation.set(wPitch.x, wFacing + wYaw.x, wLean.x);
  }

  return {
    name: 'pet-kinetics', update, updateWalk, jump: trigger, rollOnce,
    setBarrelRoll(on) { br.on = !!on; if (!on) { br.active = false; br.angle = 0; } },
    get barrelRoll() { return { on: br.on, active: br.active, angle: br.angle }; },
    enterWalk() { wFacingSet = false; curClip = null; clipAct = null; wPhase = 1; wasAir = false; elastic = 0; },
    // S79b · Schrittlänge in Units pro Zyklus — die Stellschraube gegen rutschende Füße.
    setStride(g, v) { if (g in FEET) FEET[g] = Math.max(0.4, v); },
    get stride() { return { walk: FEET.walk, run: FEET.run, sizeK }; },
    // S79d · vorgesehen für später: 'swim' ist nur eine andere Gangart, kein zweiter Modus.
    setGait(g) { if (GAITS[g]) { gait = g; curClip = null; clipAct = null; } },
    get gait() { return gait; },
    feetReport() {
      return {
        gekoppelt: feet.lock, clip: feet.clip, stride: feet.stride, dauer: feet.dur,
        tempo: feet.speed, zyklen: feet.stride > 0 ? feet.speed / feet.stride : 0, sizeK,
      };
    },
    leaveWalk(pet) {
      curClip = null; clipAct = null;
      if (pet && pet.motion && pet.motion.stopClip) pet.motion.stopClip();
    },
    get airborne() { return jump.active; },
    get stepCount() { return stepCount; },
    get stepSide() { return stepSide; },
  };
}
