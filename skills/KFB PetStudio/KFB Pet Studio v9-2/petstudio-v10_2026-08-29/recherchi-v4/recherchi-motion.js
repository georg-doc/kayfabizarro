/* recherchi-motion.js — Cartoon-Motion-Schicht für Recherchi (D2 aus BRIEFING-03)
   =============================================================================
   Arbeitet auf der STAGE (ein DOM-Element, dessen transform diese Schicht allein besitzt)
   und auf dem PIVOT des Würfels (setSquash / spinFlick / active). Nie auf der Würfel-
   Quaternion für Reise oder Idle — die Flächenlogik hängt daran.

   Die Formeln stehen hier explizit (BRIEFING-03 §1), weil der Design-Canvas die
   cartoon-motion-Skill nicht lädt:
   · Volumen erhalten:  Sx = Sz = 1/√Sy   — nie einachsig skalieren
   · Snappiness:        Frame 1–2 Cue, Frame 3–8 komprimierte Anticipation, dann Release
   · Kaskade:           Augen → Kopf → Körper → Root, Sekundärteile 0,1–0,15 s versetzt
   · Arcs:              Translation ballistisch (Parabel), Rotation per SLERP im Würfel
   · Layer-3-Physik:    Feder-Dämpfer, keine gebackenen Keyframes
   · Prime Directive:   jede Bewegung ist Interpunktion und settlet in Ruhe

   const m = RecherchiMotion.create({
     stage,              // DOM-Element für den Transform (Motion besitzt es exklusiv)
     shadow,             // optional: Kontaktschatten, bleibt am Boden und reagiert auf Flughöhe
     cube: () => el,     // Getter auf <recherchi-cube>; darf beim Start noch null sein
     front: 'scan',      // Fläche, auf die front-facing eingependelt wird
     onImpulse: fn       // pro Frame {x,y,vx,vy,air,sy,land,phase}
   });

   Abrufbar nach NAMEN (die Bibliothek, um die es hier geht):
     m.play('hop' | 'hopSmall' | 'celebrate' | 'startle' | 'nudge' | 'wobble')
     m.hop(opt) · m.hopTo(dx,dy,opt) · m.spin(force) · m.settleFront() · m.settle()
     m.loadLoop(on) · m.slingFling(vx,vy) · m.idle(on) · m.lull() · m.spit(n)
   MOVES ist die Parametertabelle — Werte, keine Adjektive (Doku: DOCS/MOTION_Recherchi-v3.md).
*/
(function () {
  if (window.RecherchiMotion) return;

  const G = 2600;                                   // px/s² — Cartoon fällt schwerer als echt
  const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* Parametertabelle. apex/dx sind Bruchteile der Würfelkante S, damit dieselbe Bewegung
     auf Phone und Desktop gleich liest. turns = Umdrehungen, die der Würfel dabei nimmt. */
  const MOVES = {
    idleHop:   { apex: 0.085, dx: 0,     anticip: 0.14, crouch: 0.91, stretch: 1.05, land: 0.88, turns: 0 },
    hopSmall:  { apex: 0.16,  dx: 0,     anticip: 0.12, crouch: 0.88, stretch: 1.09, land: 0.84, turns: 0 },
    hop:       { apex: 0.30,  dx: 0,     anticip: 0.11, crouch: 0.84, stretch: 1.16, land: 0.79, turns: 0 },
    hopSide:   { apex: 0.26,  dx: 0.42,  anticip: 0.12, crouch: 0.85, stretch: 1.14, land: 0.80, turns: 0 },
    celebrate: { apex: 0.52,  dx: 0,     anticip: 0.17, crouch: 0.78, stretch: 1.22, land: 0.74, turns: 0 },
    nudge:     { apex: 0.06,  dx: 0,     anticip: 0.05, crouch: 0.94, stretch: 1.03, land: 0.92, turns: 0 },
    startle:   { apex: 0.13,  dx: 0,     anticip: 0.02, crouch: 1.14, stretch: 1.00, land: 0.90, turns: 0 },
    wobble:    { apex: 0,     dx: 0,     anticip: 0.06, crouch: 0.90, stretch: 1.00, land: 1.00, turns: 0 }
  };

  function create(opt) {
    const o = opt || {};
    const stage = o.stage;
    if (!stage) throw new Error('[recherchi-motion] stage fehlt');
    const shadow = o.shadow || null;
    const getCube = typeof o.cube === 'function' ? o.cube : () => o.cube || null;
    const front = o.front || 'scan';
    const emit = typeof o.onImpulse === 'function' ? o.onImpulse : null;
    let reduced = false;
    try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

    const P = { squash: 1, tempo: 1, settleDamp: 0.62, shadow: 0.2, idleHops: 0, lean: 1, rebound: 1 };

    /* Referenz-Aufprallgeschwindigkeit: die eines `hop` (apex 0.30). Die Landung wird daran
       gemessen, nicht an einer Tabellenzahl — wer aus 6 % Kantenhöhe fällt, darf nicht so hart
       aufschlagen wie einer aus 52 %. */
    const vRef = () => Math.sqrt(2 * G * 0.30 * S());

    /* Zustand. y negativ = oben, Boden liegt bei gy. */
    const st = {
      x: 0, y: 0, vx: 0, vy: 0, gy: 0, gx: 0,
      sy: 1, syV: 0, syT: 1,                        // Feder-Dämpfer auf der Squash-Achse
      phase: 'rest', t: 0, dur: 0, move: null,
      land: 0, idleOn: false, nextIdle: 0, loop: false, breath: 0, bounces: 0,
      /* Anlauf: die Gegenbewegung. ax/ay ist der Punkt, auf den sich die Figur ZURÜCK schiebt,
         bevor sie losspringt — ohne ihn teleportiert jeder Sprung (Skill-Prinzip 2). */
      ax: 0, ay: 0, x0: 0, y0: 0,
      /* Zeiger: Ziel und gedämpfte Lage. nx/ny in Figurbreiten vom Mittelpunkt, d in Kanten. */
      pnx: 0, pny: 0, pd: 9, lx: 0, ly: 0, lvx: 0, lvy: 0, pSeen: 0, flinch: 0
    };

    const S = () => stage.offsetWidth || 260;
    const cube = () => { const c = getCube(); return c && typeof c.setSquash === 'function' ? c : null; };

    /* ---- Primitive ---------------------------------------------------------- */

    function launch(m) {
      const s = S();
      const apex = Math.max(2, (m.apex || 0) * s);
      st.vy = -Math.sqrt(2 * G * apex);
      // Aus der Hocke heraus starten, nicht aus der Ruhelage: die Anticipation hat die Figur
      // zurückgeschoben, und genau von dort geht es los.
      st.x = st.x0 + st.ax; st.y = st.y0 + st.ay;
      // Flugzeit bis zur Bodenlinie: Wurzel der Wurfparabel, damit dx exakt landet.
      const dy = st.gy - st.y;
      const T = (-st.vy + Math.sqrt(Math.max(0, st.vy * st.vy + 2 * G * dy))) / G;
      st.vx = T > 0 ? (st.gx - st.x) / T : 0;
      st.syT = m.stretch || 1.1;                    // Release: Stretch in Flugrichtung
      st.phase = 'air'; st.t = 0;
      const c = cube();
      if (c && m.turns) {
        c.spinFlick(6, 0, m.turns);
        clearTimeout(st._front);
        st._front = setTimeout(settleFront, (T + 0.35) * 1000);
      }
    }

    /* LANDUNG (v4c). Vorher: ein fester Squash aus der Tabelle und 75 ms später war Ruhe —
       ein Sprung aus 6 % Kantenhöhe schlug so hart auf wie einer aus 52 %, und nichts federte
       nach. Jetzt liest die Landung die Aufprallgeschwindigkeit:
         härte  = |vy| / vRef            (1 = ein normaler `hop`)
         Squash  skaliert mit der Härte, Dauer auch
         Nachfedern: ab härte 0,55 ein echter kleiner Sprung mit ~14 % der Energie, max zwei —
         darunter wird die Figur zum Flummi, und ein Flummi hat kein Gewicht. */
    function land(m) {
      const hard = cl(Math.abs(st.vy) / Math.max(1, vRef()), 0, 1.5);
      st.y = st.gy; st.x = st.gx; st.vy = 0; st.vx = 0;
      const base = m ? (m.land || 0.82) : 0.82;
      st.syT = 1 - (1 - base) * cl(hard, 0.25, 1.35);
      st.phase = 'land'; st.t = 0; st.dur = 0.055 + hard * 0.05;
      st.land = hard;                               // Impact-STÄRKE, nicht mehr nur ein Flag
      st._hard = hard;
      st._reb = (m && m.reb != null) ? m.reb : (st._reb | 0);
    }

    /* Nachfedern als echter Sprung, nicht als Feder-Überschwinger: Federn schwingen symmetrisch,
       ein Körper fällt. Der Unterschied ist der, an dem man Physik erkennt. */
    function rebound(){
      const hard = st._hard || 0;
      if (!P.rebound || reduced || hard < 0.55 || (st._reb | 0) >= 2) return false;
      st._reb = (st._reb | 0) + 1;
      const e = 0.14 * hard / (st._reb);            // zweiter Federer deutlich kleiner
      st.vy = -Math.sqrt(2 * G * Math.max(1.5, e * 0.30 * S()));
      st.vx = 0; st.syT = 1.04 + hard * 0.04;
      st.phase = 'air'; st.t = 0;
      return true;
    }

    function start(name, over) {
      const base = MOVES[name] || MOVES.hop;
      const m = Object.assign({}, base, over || {});
      if (P.squash !== 1) {
        m.crouch = 1 - (1 - m.crouch) * P.squash;
        m.land = 1 - (1 - m.land) * P.squash;
        m.stretch = 1 + (m.stretch - 1) * P.squash;
      }
      st.move = m;
      st.gx = st.x + (m.dx || 0) * S() * (m.dir == null ? 1 : m.dir);
      if (reduced) {                                 // Reduced Motion: Zustandswechsel als Schnitt
        st.x = st.gx; st.y = st.gy; st.syT = 1; st.phase = 'rest';
        return;
      }
      st._reb = 0;
      /* ANLAUF (v4c). Zwei Dinge, die vorher fehlten:
         (1) Die GEGENBEWEGUNG. Die Figur schiebt sich entgegen der Sprungrichtung zurück und
             sackt dabei ab — Weg proportional zur Sprungweite, gedeckelt. Ohne sie duckt sie
             sich nur und ist im nächsten Frame weg (Skill: "no anticipation = teleporting").
         (2) Der FRAME-1-CUE. Die Squash-Feder braucht ~60 ms bis zur sichtbaren Hocke; bei einem
             Klick ist das gefühlte Verzögerung. Deshalb wird `sy` sofort ein Stück angestoßen,
             die Feder übernimmt von dort (Skill: Cue auf Frame 1, Anticipation danach). */
      st.x0 = st.x; st.y0 = st.y;
      const back = cl(Math.abs(st.gx - st.x) * 0.16, 0, S() * 0.055);
      st.ax = st.gx === st.x ? 0 : -Math.sign(st.gx - st.x) * back;
      st.ay = cl((m.apex || 0) * S() * 0.045, 0, S() * 0.02);
      st.syT = m.crouch;                             // Anticipation: erst laden
      st.sy += (m.crouch - st.sy) * 0.42;            // Cue: sofort sichtbar, Feder übernimmt
      st.phase = 'anticip'; st.t = 0; st.dur = (m.anticip || 0.11) / (P.tempo || 1);
    }

    /* Front-Facing-Einpendeln. Zweimal behaupten: die Ausroll-Logik der Engine rastet nach dem
       Spin selbst auf die nächste Fläche ein und würde ein einzelnes settleFront überstimmen. */
    function settleFront() {
      const c = cube();
      if (!c) return;
      if (c.setSpin) c.setSpin(0);
      const go = () => { try { if (c.active !== front) c.active = front; } catch (_) {} };
      go();
      clearTimeout(st._front2);
      st._front2 = setTimeout(go, 720);
    }

    /* ---- Fling: Gummizwille quer durchs Bild, prallt an den Rändern ab ------ */
    function slingFling(vx, vy) {
      if (reduced) return;
      const r = stage.getBoundingClientRect();
      st.bounds = {
        l: st.x - r.left + 8, r: st.x + (innerWidth - r.right) - 8,
        t: st.y - r.top + 8, b: st.y + (innerHeight - r.bottom) - 8
      };
      st.vx = vx || 0; st.vy = vy || 0; st.bounces = 0;
      st.phase = 'fling'; st.syT = 1.12;
      const c = cube();
      if (c) c.spinFlick(vx || 6, vy || 0, 1.5 + Math.min(3, Math.hypot(vx || 0, vy || 0) / 900));
    }

    /* ---- Frame ------------------------------------------------------------- */
    let raf = 0, last = performance.now();
    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const m = st.move || MOVES.hop;

      if (st.phase === 'anticip') {
        st.t += dt;
        // Zurücklehnen mit ease-out: schnell weg von der Ruhelage, dann halten — das Halten ist
        // die geladene Feder, und sie ist der Grund, warum der Absprung später Wucht hat.
        const u = cl(st.t / Math.max(0.001, st.dur), 0, 1), e = 1 - (1 - u) * (1 - u);
        st.x = st.x0 + st.ax * e; st.y = st.y0 + st.ay * e;
        if (st.t >= st.dur) launch(m);
      } else if (st.phase === 'air') {
        st.vy += G * dt;
        st.x += st.vx * dt; st.y += st.vy * dt;
        if (st.y >= st.gy && st.vy > 0) land(m);
      } else if (st.phase === 'land') {
        st.t += dt;
        if (st.t >= st.dur) { if (!rebound()){ st.phase = 'rest'; st.syT = 1; } }
      } else if (st.phase === 'fling') {
        const b = st.bounds || { l: -400, r: 400, t: -300, b: 300 };
        st.vy += G * 0.55 * dt;
        st.x += st.vx * dt; st.y += st.vy * dt;
        let hit = 0;
        if (st.x < b.l) { st.x = b.l; st.vx = -st.vx * 0.62; hit = 1; }
        if (st.x > b.r) { st.x = b.r; st.vx = -st.vx * 0.62; hit = 1; }
        if (st.y < b.t) { st.y = b.t; st.vy = -st.vy * 0.62; hit = 1; }
        if (st.y > b.b) { st.y = b.b; st.vy = -st.vy * 0.54; hit = 1; }
        if (hit) { st.syT = 0.8; st.land = 1; st.bounces++; }
        st.vx *= (1 - 0.42 * dt); st.vy *= (1 - 0.18 * dt);
        if (Math.hypot(st.vx, st.vy) < 42 && Math.abs(st.y - st.gy) < 26) {
          st.gx = st.x; st.phase = 'rest'; st.syT = 1; settleFront();
        }
      } else {
      /* Ruhe: Atem statt Zappeln. Der Idle-Huepfer ist seit v4b AUS im Default (P.idleHops):
           er las neben dem langsamen Wabern des Wuerfels als Schluckauf. Gehuepft wird, wenn
           etwas passiert — nicht, weil Zeit vergeht. Wieder einschalten: setParams({idleHops:1}). */
        if (st.idleOn && !reduced) {
          st.breath += dt;
          if (P.idleHops) {
            st.nextIdle -= dt;
            if (st.nextIdle <= 0) { st.nextIdle = rnd(1.6, 3.4) / (P.tempo || 1); start('idleHop'); }
          }
        }
      }

      /* ZEIGER-REAKTION (v4c). Der Körper reagiert, nicht nur die Augen — aber NACH ihnen:
         die Kaskade ist Augen → Kopf → Körper, und die weiche Feder hier IST die Verzögerung.
         Zwei Stufen, beide mit Grund:
           nah (< 1,6 Kanten)   Zuwenden. Er merkt, dass da jemand ist.
           sehr nah + schnell   Zurücklehnen (flinch). Er weiß nicht, was gleich passiert.
         Kein Ausschlag im Flug: wer springt, hat Wichtigeres zu tun. */
      const stale = now - st.pSeen > 2600;
      const near = stale ? 0 : cl((1.6 - st.pd) / 1.2, 0, 1);
      const rest = st.phase === 'rest' ? 1 : 0.18;
      const tlx = st.pnx * near * rest * (1 - st.flinch * 1.7);
      const tly = st.pny * near * rest * (1 - st.flinch * 1.7);
      const lk = 58, ld = 2 * Math.sqrt(lk) * 0.85;
      st.lvx += ((tlx - st.lx) * lk - st.lvx * ld) * dt; st.lx += st.lvx * dt;
      st.lvy += ((tly - st.ly) * lk - st.lvy * ld) * dt; st.ly += st.lvy * dt;
      st.flinch = Math.max(0, st.flinch - dt * 2.4);

      /* Feder-Dämpfer auf Sy. Kritisch gedämpft heißt hier: einpendeln, nicht überschwingen —
         der gewollte Extremakzent liegt im Ziel, nicht im Nachschwingen. */
      const k = 210 * (P.tempo || 1), d = 2 * Math.sqrt(k) * cl(P.settleDamp, 0.35, 1.1);
      st.syV += ((st.syT - st.sy) * k - st.syV * d) * dt;
      st.sy += st.syV * dt;
      const breath = st.phase === 'rest' && st.idleOn && !reduced ? Math.sin(st.breath * 1.5) * 0.012 : 0;
      const sy = cl(st.sy + breath, 0.55, 1.6);
      const sx = 1 / Math.sqrt(sy);                  // Volumen erhalten

      stage.style.transform = 'translate3d(' + st.x.toFixed(2) + 'px,' + st.y.toFixed(2) + 'px,0)';
      stage.style.setProperty('--rc-sy', sy.toFixed(4));
      stage.style.setProperty('--rc-sx', sx.toFixed(4));
      const c = cube();
      if (c) {
        c.setSquash(sy);
        // Neigung an den Würfel: er lehnt zum Zeiger, nicht die Bühne. Eine geneigte Bühne
        // würde die Flächen-Trefferflächen mitkippen — der Pivot tut das nicht.
        // Amplitude v4d: 0.10/0.13 rad ergaben bei nahem Zeiger unter 0,1° — unsichtbar.
        // Jetzt ~5° im Vollausschlag; das liest sich als Zuwendung, ohne die Front zu verlassen.
        if (c.setLean) c.setLean(st.lx * 0.30 * P.lean, -st.ly * 0.36 * P.lean);
      }

      if (shadow) {
        const a = cl(-(st.y - st.gy) / (S() * 0.46), 0, 1);
        shadow.style.transform = 'translateX(' + (st.x * 0.86).toFixed(1) + 'px) scale(' +
          (1 - a * 0.34).toFixed(3) + ',' + (1 - a * 0.22).toFixed(3) + ')';
        shadow.style.opacity = (P.shadow * (1 - a * 0.72)).toFixed(3);
      }

      if (emit) emit({ x: st.x, y: st.y - st.gy, vx: st.vx, vy: st.vy, air: -(st.y - st.gy),
                       sy: sy, land: st.land, phase: st.phase,
                       lean: { x: st.lx, y: st.ly }, near: near });
      st.land = 0;
    }
    raf = requestAnimationFrame(frame);

    const api = {
      MOVES: MOVES,
      get phase(){ return st.phase; },
      get busy(){ return st.phase !== 'rest'; },
      play(name, over){ if (MOVES[name]) start(name, over); return api; },
      hop(over){ start('hop', over); return api; },
      hopTo(dx, dy, over){
        st.gy = st.y + (dy || 0);
        start('hopSide', Object.assign({ dx: (dx || 0) / S(), dir: 1 }, over || {}));
        return api;
      },
      spin(force){
        const f = cl(force == null ? 0.5 : force, 0, 1);
        const c = cube();
        if (c && !reduced) c.spinFlick(6, 0, 1 + f * 3);
        st.syT = 0.92; st.phase = 'land'; st.t = 0; st.dur = 0.07;
        clearTimeout(st._front);
        st._front = setTimeout(settleFront, (0.5 + f * 1.4) * 1000);
        return api;
      },
      settleFront: settleFront,
      settle(){ st.phase = 'rest'; st.syT = 1; st.gx = st.x; settleFront(); return api; },
      startle(){ start('startle'); return api; },
      celebrate(){ start('celebrate'); return api; },
      nudge(){ start('nudge'); return api; },
      /* Wartetakt: eine langsame Achsdrehung, die sich als Warten liest — kein Dauerzappeln. */
      loadLoop(on){
        st.loop = !!on;
        const c = cube();
        if (c && c.setSpin) c.setSpin(on && !reduced ? 0.42 : 0);
        if (!on) settleFront();
        return api;
      },
      spit(n){ start('nudge', { apex: 0.05 + Math.min(0.06, (n || 1) * 0.01) }); return api; },
      slingFling: slingFling,
      idle(on){ st.idleOn = !!on; if (on && st.nextIdle <= 0) st.nextIdle = rnd(0.9, 1.8); return api; },
      /* Lull: eine Nummer aus dem Repertoire, nie zweimal die gleiche hintereinander. */
      lull(){
        const pool = ['hop', 'hopSide', 'celebrate', 'wobble', 'hopSmall'];
        let n = pool[Math.floor(Math.random() * pool.length)];
        if (n === st._lastLull) n = pool[(pool.indexOf(n) + 1) % pool.length];
        st._lastLull = n;
        start(n, n === 'hopSide' ? { dir: Math.random() < 0.5 ? -1 : 1 } : null);
        return n;
      },
      /* Der Zeiger, in Figurmaßen: nx/ny ∈ [−1,1] vom Mittelpunkt aus, d in Kantenlängen.
         Der Host rechnet um — er weiß, wo die Figur steht; diese Schicht weiß nur, wie sie fällt.
         `speed` in Kanten/s: schnelle Annäherung aus der Nähe löst das Zurücklehnen aus. */
      setPointer(nx, ny, d, speed){
        st.pnx = cl(nx || 0, -1.6, 1.6); st.pny = cl(ny || 0, -1.6, 1.6);
        st.pd = d == null ? 9 : d; st.pSeen = performance.now();
        if (!reduced && st.pd < 0.72 && (speed || 0) > 3.4 && st.phase === 'rest' && st.flinch < 0.2){
          st.flinch = 1;
          if (Math.random() < 0.22) start('startle');
        }
        return api;
      },
      setParams(p){ Object.assign(P, p || {}); return api; },
      params: P,
      dispose(){
        cancelAnimationFrame(raf); clearTimeout(st._front); clearTimeout(st._front2);
        stage.style.transform = ''; stage.style.removeProperty('--rc-sy'); stage.style.removeProperty('--rc-sx');
      }
    };
    return api;
  }

  window.RecherchiMotion = { create: create, MOVES: MOVES };
})();
