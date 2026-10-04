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
  /* ═══ v25.2f · DIE RÜCKKOPPLUNG IM SQUASH ═════════════════════════════════════════════
     Georgs Befund (06.09.): „Pet walk ruckelt, flackert." Gefunden, und es ist gerechnet:
     Die Kanonregel oben sagt, PetMotion schreibe `ch.inner.scale` JEDES Bild, wir LESEN seinen
     Atem (`motionSy`) und multiplizieren unseren Squash darauf. Im Bodenmodus stimmt die Prämisse
     aber nicht: der Wirt ruft dort `pet.motion.stopLoops()` (Kommentar an der Einhäng-Stelle:
     „no procedural loop in walk mode"). Damit schreibt die Bibliothek nichts mehr — und
     `ch.inner.scale.y / bs` liest **unseren eigenen Wert vom Vorbild** zurück. Jedes Bild wird
     erneut mit `wSq`, `wPhase`, `stepSq` und `floatSq` multipliziert: eine geometrische Folge.
     Weil `stepSq` beim Gehen fast immer < 1 ist, wandert die Skala nach unten in den Anschlag
     (0,66) und zittert dort gegen die Klemme — genau das Flackern, und im Lauf stärker, weil die
     Faktoren schneller wechseln.
     Behoben, ohne die Kanonregel zu brechen: wir merken, WAS WIR GESCHRIEBEN HABEN, und
     VERGLEICHEN damit. Steht der eigene Wert noch da, hat niemand geschrieben → Atem 1; steht
     etwas anderes, ist es der absolute Fremdwert. (Die erste Fassung TEILTE statt zu vergleichen
     und war damit selbst eine Rückkopplung — Fingerabdruck und Messung stehen bei `fremdAtem`.) */
  let flLast = 0, wLast = 0;
  const applySquash = (ch, bs, sY) => {
    const s = clampf(sY, 0.66, 1.40), xz = 1 / Math.sqrt(s);
    ch.inner.scale.set(bs * xz, bs * s, bs * xz);
    return s;   // der TATSÄCHLICH geschriebene Wert (geklemmt) — nur der darf zurückgeteilt werden
  };
  /* ═══ v25.2j · VERGLEICHEN, NICHT TEILEN ══════════════════════════════════════════════
     Georg (06.09.): „Zittern immer noch da" — und nach einem Sprung „wird das Zittern zum
     Flackern". In seiner laufenden Ansicht gemessen: `inner.scale.y / bs` springt jeden Frame
     zwischen **1,15542 und 0,86549**, 22 Vorzeichenwechsel in 24 Bildern. Das Produkt der beiden
     Werte ist **1,00006** — und das ist der Fingerabdruck von `xₙ = 1 / xₙ₋₁`, also genau der
     Division, die ich in v25.2f hier eingebaut habe.
     Die Absicht war richtig (nicht den eigenen Wert zurücklesen), das Mittel falsch: wenn der
     Mixer die Skala mit einem ABSOLUTEN Clip-Wert überschreibt, ist `ist / letzt` kein Atem,
     sondern eine Rückkopplung mit Periode 2. Nach einem Sprung multiplizieren `elastic` und
     `stepSq` mit, die Ausschläge werden größer — aus Zittern wird Flackern. Beides derselbe Fehler.
     Richtig ist ein VERGLEICH ohne Rückkopplung: steht dort noch genau unser eigener Wert vom
     Vorbild, hat niemand geschrieben → Atem 1. Steht etwas anderes, ist es ein absoluter Fremdwert
     → genau er ist der Atem. Kein Term hängt mehr an seinem eigenen Vorgänger. */
  const fremdAtem = (ch, bs, letzt) => {
    const ist = ch.inner.scale.y / bs;
    if (!(letzt > 0.01)) return 1;                       // erster Frame nach enterWalk
    if (Math.abs(ist - letzt) < 1e-4) return 1;          // unser eigener Wert — niemand schrieb
    return clampf(ist, 0.6, 1.6);                        // fremd geschrieben: absoluter Atem
  };
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
    const motionSy = fremdAtem(ch, bs, flLast);
    flLast = applySquash(ch, bs, motionSy * clampf(flSq.s, 0.78, 1.28) * flyPhase * (1 - turnMag * 0.06));

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
  /* ═══ v25/S7 · DAS GEMESSENE SCHRITTMASS (`schrittmass.json`, 05.09.) ════════════════════
     Die Datei hält für 23 Pets mit Beinen die Standfuß-Drift IM CLIP: `strecke` (Weltunits je
     Zyklus) und `skala` (Einpass-Maßstab, mit dem gemessen wurde). Der Quotient ist die
     MASSSTABSFREIE Wahrheit — Modelleinheiten je Zyklus —, und die ist für alle 23 auf vier
     Stellen dieselbe (ein Walk-Clip für alle: rohTempo 1,8293). In Weltunits dieses Wirts:
     `roh × _baseS`, und weil FEET auf die Referenz REF_K normiert ist, `roh × REF_K`.

     **Und deshalb wird hier NICHTS still umgestellt.** Die Rechnung ergibt rund 0,37 u je
     Gehzyklus — gegen die eingebauten 2,70. Faktor gut sieben. Eine der beiden Zahlen beschreibt
     also nicht die Wirklichkeit, und die Messung sagt nur, WELCHE: bei 2,70 rutschen die Füße um
     Faktor 7, bei 0,37 strampeln sie siebenmal schneller, weil das Lauftempo (5,4 u/s für einen
     0,82 u hohen Körper = 6,6 Körperhöhen je Sekunde) für diesen Clip zu hoch ist. Das ist eine
     Entscheidung über das FAHRGEFÜHL und gehört Georg, nicht diesem Modul.
     Also: messen, melden, und erst auf Zuruf anwenden (`setStrideQuelle('gemessen')`,
     `?stride=gemessen`). Der Vorgabewert bleibt der eingebaute — PLAN §6.7. */
  const FEET_MESS = { walk: null, run: null, quelle: null, n: 0 };
  let strideQuelle = 'gekoppelt';
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
  /* ═══ v25.2d · DER GRUPPEN-MASSSTAB GEHÖRT IN DIE SCHRITTLÄNGE ══════════════════════════
     Gefunden beim Nachrechnen von Georgs Befund „das Pet läuft zu schnell für seine Größe":
     `sizeK` kam allein aus `_baseS` (dem Einpaß-Maßstab des Modells) — der Bodenmodus skaliert die
     Pet-Gruppe aber zusätzlich (bis v25.2c fest 1,25). Die sichtbaren Füße legten also 25 % mehr
     Weg je Zyklus zurück als die Zahl, mit der der Zyklus gekoppelt wird. Ein Rutsch, den keine
     Messung zeigte, weil die Messung selbst die Gruppe nicht kannte.
     Eine Schrittlänge ist eine LÄNGE: sie skaliert mit dem ganzen Körper, also mit `_baseS × Gruppe`
     — aber GEGEN die Referenzgruppe 1,25 normiert, auf die alle eingebauten Zahlen getunt sind.
     Ohne diese Normierung wäre schon der Ruhezustand um 1,25 verschoben; mit ihr gilt bei Gruppe
     1,25 exakt das Verhalten von v14, und bei 3,90 (3,2-u-Pet) skaliert es verhältnisgleich mit.

     ── v25.2g · WARUM DER EINGEBAUTE WERT DIE BESSERE QUELLE IST ─────────────────────────────
     Georgs Urteil (06.09.): „das Boden-Movement ist in v14 besser." Nachgerechnet, und v14 geht
     auf: 5,4 u/s ÷ 2,7 u je Zyklus = **2,00 Zyklen/s** — genau der native Takt des Walk-Clips
     (0,50 s). Der eingebaute 2,7-Wert war also nie eine Schätzung, sondern **auf den Clip-Takt
     geeicht**; er ist die Zahl, bei der der Fuß nicht rutscht UND der Zyklus im Bild stimmt.
     Die Clip-Messung (0,3731 u) liegt um Faktor 7,2 darunter und kann nicht dasselbe messen —
     welchen Weg auch immer sie zählt, es ist nicht der Fußweg je Zyklus in Weltunits. Solange
     das nicht geklärt ist, ist die geeichte Zahl die belastbare: Vorgabe ab v25.2g wieder
     **eingebaut**, die Messung bleibt als `?stride=gemessen` und im Regler erreichbar. */
  let groupK = 1.25;   // Maßstab der Pet-Gruppe im Bodenmodus, vom Wirt gesetzt
  /* v25.2f · **Der Schrittfaktor.** Georg: „Schrittweite zu langsam — eher ein Trippeln als
     Laufen." Gemessen ist das kein Fehler, sondern die Eigenschaft des Clips: sein Fußweg je
     Zyklus ist 1,34 u bei einer Figur von 3,2 u — **0,42 Körperlängen je Zyklus**, während ein
     Gehzyklus etwa eine Körperlänge trägt. Distanzgekoppelt heißt das zwangsläufig hohe Kadenz,
     also Trippeln. Man kann nur zwei Dinge tun, und beide sind ein Tausch:
       · Tempo senken → die Kadenz fällt, die Schritte bleiben klein.
       · Schritt STRECKEN → größere Schritte, dafür rutscht der Fuß um genau diesen Faktor.
     Der Faktor macht den Tausch sichtbar und regelbar, statt ihn zu verstecken; die Panel-Zeile
     „Was das heißt" zeigt beides (Kadenz und Rutsch) live. 1,0 = gemessen, kein Rutsch. */
  let schrittK = 1;   // v25.2g · 1,0 = geeichter Zustand (v14). Größer = größere Schritte MIT Rutsch.
  // v25.2r · Der Gang-Bob, an einer Stelle. `hang` gilt nur im Sprint (Flugphase), siehe updateWalk.
  const BOB = { walk: 0.060, run: 0.055, hang: 0.62, sqWalk: 0.045, sqRun: 0.075 };
  const GROUP_REF = 1.25;   // der Maßstab, auf den Bob und Ducken getunt sind
  function measureSize(pet) {
    const ch = pet && pet.character;
    const sig = ch ? groupK : 0;
    if (!ch || (sizedFor === ch && sizedSig === sig)) return;
    const b = ch._baseS || 0;
    if (b > 0.02) { sizeK = clampf((b / REF_K) * (groupK / GROUP_REF), 0.35, 12); sizedFor = ch; sizedSig = sig; }
  }
  let sizedSig = 0;
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
    // v25/S7 · Welche Schrittlänge gilt: die eingebaute oder die gemessene. EINE Verzweigung,
    // damit im Bild immer klar ist, welche Zahl das Bild macht (`schrittReport().quelle`).
    const basis = (strideQuelle === 'gemessen' && FEET_MESS.walk) ? FEET_MESS : FEET;
    const stride = Math.max(0.05, (fast ? basis.run : basis.walk) * sizeK * schrittK);
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
      /* ═══ v25.2r · WARUM RENNEN GEHÜPFT HAT — und warum die Amplitude SINKT ══════════════
         Bis hier stand `fast ? 0.09 : 0.06`: beim Sprint eine halb so hohe Welle mehr. Die
         Absicht ist verständlich (rennen soll energischer aussehen), die Rechnung sagt aber,
         dass genau das der Hüpfer IST. Kadenz ist `speed / stride`:
           gehen  5,40 / (2,70 · k) = 2,00/k Zyklen/s
           rennen 9,45 / (4,70 · k) = 2,01/k Zyklen/s
         Maßstabsunabhängig dieselbe Zahl, und zwar mit Absicht: 4,70/2,70 = 1,74 ist bis auf
         ein Prozent `sprintMul` 1,75, die Distanzkopplung hält die Trittfrequenz also fest.
         Beim Sprint ändert sich damit NICHTS am Rhythmus — nur die Höhe. Gleiche Frequenz,
         50 % mehr Ausschlag, das ist die Definition eines Pogo-Sticks und nicht die eines Laufs.

         Ein Lauf unterscheidet sich vom Gehen nicht durch Bounce-Höhe bei gleicher Kadenz,
         sondern durch die FLUGPHASE: der Körper ist länger oben und kürzer unten, und der
         Boden bekommt einen kurzen harten Stoß statt einer weichen Wiege. Also zwei Änderungen
         statt einer Zahl:

         1 · `hang` als Exponent auf |sin|. Wertebereich bleibt [0,1] — Tiefpunkt beim Fußaufsatz
             (Fuß am Boden, kein Schweben) und Hochpunkt in der Mitte sind unverändert, es
             verschiebt sich nur die VERWEILDAUER: bei 0,62 steigt die Kurve schnell vom Kontakt
             weg und liegt breit oben an. Deshalb braucht es keine Mittelwertkorrektur.
         2 · Amplitude runter, nicht hoch (0,090 → 0,055, knapp unter Gehen). Die Energie, die
             vorher in Höhe ging, geht in die Stauchung: `sqRun` 0,075 gegen 0,045 beim Gehen.
             Ein Läufer komprimiert am Aufsatz, er steigt nicht höher.

         Die vier Zahlen stehen in BOB und sind einzeln stellbar (`setBob`), weil das ein
         Geschmacksurteil ist und Georg es im Bild fällt, nicht ich in der Rechnung.
         v25.2d bleibt gültig: alles davon ist eine Länge am Körper, skaliert mit groupK. */
      const amp = fast ? BOB.run : BOB.walk;
      const wave = Math.abs(Math.sin(walkT));
      bob = (fast ? Math.pow(wave, BOB.hang) : wave) * amp * (groupK / GROUP_REF);
      stepSq = 1 - Math.abs(Math.cos(walkT)) * (fast ? BOB.sqRun : BOB.sqWalk);
    } else if (!air) bob = Math.sin(idleT * 1.9) * 0.012;
    if (fl !== 0) bob += Math.sin(idleT * 5.2) * 0.03;   // Schweben wiegt, es steht nicht

    // Gummi (S79c): nach Landung/Absprung schwingt die Feder weicher aus — mehr Steifigkeit,
    // weniger Dämpfung. Das mehrfache Nachwippen entsteht HIER, nicht in einer zweiten Kurve.
    const stiff = 80 + 70 * elastic, damp = 11 - 6.2 * elastic;
    wSq.v += (1 - wSq.s) * stiff * dt - wSq.v * damp * dt; wSq.s += wSq.v * dt;
    const motionSy = fremdAtem(ch, bs, wLast);
    const floatSq = fl !== 0 ? 1 + 0.06 * Math.abs(fl) : 1;
    wLast = applySquash(ch, bs, motionSy * clampf(wSq.s, 0.72, 1.34) * wPhase * stepSq * floatSq);

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

    pet.object3D.position.set(ws.position.x, ws.position.y + bob - ws.crouch * 0.06 * (groupK / GROUP_REF), ws.position.z);
    pet.object3D.rotation.set(wPitch.x, wFacing + wYaw.x, wLean.x);
  }

  return {
    name: 'pet-kinetics', update, updateWalk, jump: trigger, rollOnce,
    setBarrelRoll(on) { br.on = !!on; if (!on) { br.active = false; br.angle = 0; } },
    get barrelRoll() { return { on: br.on, active: br.active, angle: br.angle }; },
    enterWalk() { wFacingSet = false; curClip = null; clipAct = null; wPhase = 1; wasAir = false; elastic = 0; wLast = 0; },
    // S79b · Schrittlänge in Units pro Zyklus — die Stellschraube gegen rutschende Füße.
    setStride(g, v) { if (g in FEET) FEET[g] = Math.max(0.4, v); },
    /** v25.2d · Maßstab der Pet-Gruppe im Bodenmodus. Er geht in die Schrittlänge, den Bob und das
     *  Ducken ein — alles drei sind Längen am Körper, keine Weltkonstanten. */
    setWalkScale(g) { const v = +g; if (!(v > 0.05)) return; groupK = v; sizedFor = null; },
    /** v25.2f · Schrittfaktor auf die gemessene Länge — 1,0 = kein Rutsch, größer = größere
     *  Schritte bei niedrigerer Kadenz und genau diesem Rutsch. */
    setSchrittFaktor(v) { const q = +v; if (q >= 0.5 && q <= 3) schrittK = q; },
    get schrittFaktor() { return schrittK; },
    /** v25.2r · Gang-Bob stellen. `hang` < 1 = Flugphase (länger oben), 1 = symmetrisch wie Gehen.
     *  Grenzen sind Sicherungen, keine Meinung: über 0,2 u wippt der Körper mehr als er sich bewegt. */
    setBob(k, v) {
      if (!(k in BOB)) return null;
      const q = +v; if (!isFinite(q)) return null;
      BOB[k] = k === 'hang' ? clampf(q, 0.3, 1) : clampf(q, 0, 0.2);
      return BOB[k];
    },
    /** Kadenz und Bob-Höhe beider Gangarten, in EINER Zeile — die Zahl, die den Hüpfer sichtbar
     *  gemacht hat. `zyklenGeh`/`zyklenRenn` müssen gleich sein (Distanzkopplung), die Höhen nicht. */
    bobReport() {
      const k = sizeK * schrittK || 1;
      const g = groupK / GROUP_REF;
      return {
        zyklenGeh: +(5.4 / (FEET.walk * k)).toFixed(3),
        zyklenRenn: +(9.45 / (FEET.run * k)).toFixed(3),
        hoeheGeh: +(BOB.walk * g).toFixed(4),
        hoeheRenn: +(BOB.run * g).toFixed(4),
        hang: BOB.hang, stauchGeh: BOB.sqWalk, stauchRenn: BOB.sqRun,
      };
    },
    get walkScale() { return groupK; },
    /** v25.2d · Die Schrittlänge, die AB JETZT gilt — gerechnet, nicht aus dem letzten Bild gelesen.
     *  `feetReport()` zeigt den Stand des letzten `updateWalk`, und `setWalkScale` verwirft die
     *  Größenmessung absichtlich (sie wird im nächsten Bild neu gezogen). Wer direkt nach einer
     *  Größenänderung berichtet, liest sonst den ALTEN Zustand — beim Betreten des Bodenmodus also
     *  den eingebauten 2,7-Wert und eine geschmeichelte Kadenz. Diese Zahl ist deterministisch, es
     *  gibt keinen Grund, auf ein Bild zu warten (Verifier-Fund 06.09.). */
    strideJetzt(pet, fast) {
      const ch = pet && pet.character;
      const b = (ch && ch._baseS) || REF_K;
      const kk = clampf((b / REF_K) * (groupK / GROUP_REF), 0.35, 12);
      const basis = (strideQuelle === 'gemessen' && FEET_MESS.walk) ? FEET_MESS : FEET;
      return { stride: Math.max(0.05, (fast ? basis.run : basis.walk) * kk * schrittK), sizeK: kk,
               quelle: strideQuelle, faktor: schrittK, rein: Math.max(0.05, (fast ? basis.run : basis.walk) * kk) };
    },
    get stride() { return { walk: FEET.walk, run: FEET.run, sizeK }; },
    /** v25/S7 · `schrittmass.json` einlesen (Objekt oder URL). ÄNDERT NICHTS am Bild — es legt die
     *  gemessene Zahl daneben. Anwenden ist ein zweiter, ausdrücklicher Schritt. */
    async ladeSchrittmass(quelle) {
      const j = typeof quelle === 'string' ? await (await fetch(quelle)).json() : quelle;
      const m = (j && j.modelle) || {};
      let sw = 0, nw = 0, sr = 0, nr = 0;
      for (const id in m) {
        const e = m[id]; if (!e || !e.skala || e.pack !== 'pets') continue;
        if (e.walk && e.walk.strecke) { sw += e.walk.strecke / e.skala; nw++; }
        if (e.run && e.run.strecke) { sr += e.run.strecke / e.skala; nr++; }
      }
      if (!nw) return null;
      FEET_MESS.walk = +((sw / nw) * REF_K).toFixed(4);
      FEET_MESS.run = nr ? +((sr / nr) * REF_K).toFixed(4) : FEET_MESS.walk * 2;
      FEET_MESS.quelle = (j && j.gemessen) || 'unbekannt';
      FEET_MESS.n = nw;
      return this.schrittReport();
    },
    /** Welche Zahl macht das Bild — und wie weit liegt die andere daneben. */
    schrittReport() {
      return {
        quelle: strideQuelle,
        eingebaut: { walk: FEET.walk, run: FEET.run },
        gemessen: FEET_MESS.walk ? { walk: FEET_MESS.walk, run: FEET_MESS.run, n: FEET_MESS.n, am: FEET_MESS.quelle } : null,
        faktor: FEET_MESS.walk ? +(FEET.walk / FEET_MESS.walk).toFixed(2) : null,
      };
    },
    setStrideQuelle(q) { if (q === 'gemessen' && !FEET_MESS.walk) return false; strideQuelle = (q === 'gemessen') ? 'gemessen' : 'gekoppelt'; curClip = null; clipAct = null; return true; },
    get strideQuelle() { return strideQuelle; },
    // S79d · vorgesehen für später: 'swim' ist nur eine andere Gangart, kein zweiter Modus.
    setGait(g) { if (GAITS[g]) { gait = g; curClip = null; clipAct = null; } },
    get gait() { return gait; },
    feetReport() {
      return {
        gekoppelt: feet.lock, clip: feet.clip, stride: feet.stride, dauer: feet.dur,
        tempo: feet.speed, zyklen: feet.stride > 0 ? feet.speed / feet.stride : 0, sizeK, gruppe: groupK, faktor: schrittK,
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
