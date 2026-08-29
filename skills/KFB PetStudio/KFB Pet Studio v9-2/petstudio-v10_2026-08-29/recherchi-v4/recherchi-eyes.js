/* recherchi-eyes.js — D1, Googly-Eye-Rig für Recherchi (DocCheck)
   DOM/CSS, KEIN three.js. Bewusst so: die Würfelflächen sind gerastertes HTML, ein
   3D-Rig gehört dort nicht hin und pro Frame wandernde Pupillen IN der Textur würden
   den Würfel 60× je Sekunde neu rastern. Dieses Modul läuft deshalb im L2-Overlay
   (`cube.overlay('scan')`) über dem Canvas — dort kostet Bewegung keine Rasterung.

   Vokabular und Regeln sind vom KFB-EyeRig übernommen, nicht der Code:
   Lid 0 = offen · 1 = geschlossen · negativ = weiter offen als normal (Schreck).
   Blick als (nx, ny) in −1..1. Der Blick FÜHRT, die Lider LAGEN.

   Verwendung:
     <script src="./recherchi-eyes.js"></script>
     const eyes = RecherchiEyes.createEyes(hostEl, { size: 120, gap: 1 });
     eyes.look(nx, ny);  eyes.emote('denkt');  eyes.cross(true);
     // eine Frame-Schleife: eyes.update(dt)

   API
     look(nx, ny)              Blickziel −1..1 (Fläche oder Bildschirm, egal — nur normalisiert)
     lids({ul,ur,ll,lr,slant})  harter Lid-Override (Prüfstand); null hebt ihn auf
     slant(v [,right])         Neigung der Lidkante −1..1 (positiv = Innenkante hoch)
     blink()                   sofort blinzeln
     setBlink({minGap,maxGap,dur,double})
     emote(name, {hold})       wach · neugierig · denkt · freut · skeptisch · schlaeft · schreck
     wink(side)                zwinkern ('l' | 'r')
     cross(on)                 Schielen auf den eigenen Knopf (Cross-Eye, §5a)
     react(kind, {x,y})        Mikrofeedback auf einen App-Event (Klick, Chip, Send)
     pop(k) / oval(k)          Schreck-Pop / Kneifen, volumenerhaltend
     setLife(on)               Drift und Sakkaden an/aus
     setFollow(k)              Amplitude der Augen-Sekundärbewegung (Default 0.28)
     update(dt)                einmal pro Frame
     dispose()                 abräumen
     el                        das Wrapper-Element
*/
(function () {
  const CLAMP = (v, a, b) => v < a ? a : v > b ? b : v;
  const RND = (a, b) => a + Math.random() * (b - a);

  /* Emote-Vokabular. Werte 0..1, negativ = weiter offen. `sn` = Slant der Lidkante in
     KFB-Skala −1..1: **positiv = Innenkante hoch** (traurig), **negativ = Innenkante runter /
     Außenkante hoch** (ärgerlich, freundlich-squint). Wird je Auge gespiegelt.
     `pu` = Pupillengröße relativ, `gz` = Blick-Vorgabe (null = Blick bleibt frei). */
  const SLANT_DEG = 22;                 // Skala −1..1 → Grad der Lidkante
  const EMOTES = {
    wach:      { ul:[-0.04,-0.04], ll:[0.00,0.00], sn:[0,0],          pu:1.00, gz:null },
    neugierig: { ul:[-0.22,-0.22], ll:[-0.08,-0.08], sn:[0,0],        pu:1.08, gz:null },
    denkt:     { ul:[0.34,0.28],   ll:[0.04,0.04], sn:[0.05,0.05],    pu:0.96, gz:[0.78,-0.34] },
    /* freut: die halbe Miene ist das ANGEHOBENE Unterlid (Wangen-Squint), dazu sanfter
       Slant nach außen. Slant allein wäre nur „traurig umgedreht". */
    freut:     { ul:[0.06,0.06],   ll:[0.40,0.40], sn:[-0.14,-0.14],  pu:1.04, gz:null },
    traurig:   { ul:[0.24,0.24],   ll:[0.06,0.06], sn:[0.35,0.35],    pu:1.00, gz:[0,0.42] },
    aergerlich:{ ul:[0.30,0.30],   ll:[0.12,0.12], sn:[-0.40,-0.40],  pu:0.96, gz:null },
    skeptisch: { ul:[0.38,0.06],   ll:[0.14,0.02], sn:[-0.30,0.10],   pu:0.98, gz:[0.30,0.10] },
    schlaeft:  { ul:[1.00,1.00],   ll:[1.00,1.00], sn:[0,0],          pu:0.92, gz:[0,0.35] },
    schreck:   { ul:[-0.40,-0.40], ll:[-0.12,-0.12], sn:[0,0],        pu:1.20, gz:null }
  };

  function createEyes(host, opts){
    if (!host) throw new Error('[recherchi-eyes] host fehlt');
    const o = opts || {};
    const E    = o.size || 120;                 // Augendurchmesser
    const GAP  = (o.gap == null ? 1 : o.gap) * E;
    const INK  = o.ink || '#141618';
    const LID  = o.lidColor || '#FFFFFF';
    const PUP  = o.pupilColor || '#17191B';
    const BW   = Math.max(2, Math.round(E * (o.outline == null ? 0.075 : o.outline)));
    const PR   = (o.pupil || 0.40) * E;         // Pupillendurchmesser
    const MAXR = (E / 2) - (PR / 2) - BW * 1.35; // Blickradius: Pupille verlässt die Sklera nie
    // Sekundärbewegung: das ganze Auge folgt dem Blick mit kleiner Amplitude und hartem Deckel,
    // damit es den Gesichtsrahmen nie verlässt (Feedback-02 B4).
    let FOLLOW = o.follow == null ? 0.28 : o.follow;
    const MAXSHIFT = (o.maxShift == null ? 0.15 : o.maxShift) * E;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wrap = document.createElement('div');
    wrap.className = 're-wrap';
    wrap.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:' + GAP +
      'px;pointer-events:none;user-select:none';

    const eyes = [0, 1].map(() => {
      const eye = document.createElement('div');
      eye.className = 're-eye';
      eye.style.cssText = 'position:relative;width:' + E + 'px;height:' + E + 'px;flex:0 0 auto';
      const ball = document.createElement('div');
      ball.style.cssText = 'position:absolute;inset:0;border-radius:50%;background:#FFFFFF;' +
        'border:' + BW + 'px solid ' + INK + ';overflow:hidden;box-sizing:border-box;' +
        'box-shadow:inset 0 ' + (E * 0.07) + 'px ' + (E * 0.14) + 'px rgba(20,24,28,.13)';
      const pupil = document.createElement('div');
      pupil.style.cssText = 'position:absolute;left:50%;top:50%;width:' + PR + 'px;height:' + PR +
        'px;margin-left:' + (-PR / 2) + 'px;margin-top:' + (-PR / 2) + 'px;border-radius:50%;' +
        'background:' + PUP + ';will-change:transform';
      const gloss = document.createElement('div');
      gloss.style.cssText = 'position:absolute;left:' + (PR * 0.16) + 'px;top:' + (PR * 0.14) +
        'px;width:' + (PR * 0.30) + 'px;height:' + (PR * 0.30) + 'px;border-radius:50%;' +
        'background:rgba(255,255,255,.92)';
      pupil.appendChild(gloss);
      const mk = (up) => {
        const d = document.createElement('div');
        // Das Lid ist eine FLÄCHE über der Sklera, kein Konturbalken: dünnere Kante als die
        // Augenkontur plus weicher Schatten nach innen, damit es als Lid liest (Feedback A2).
        d.style.cssText = 'position:absolute;left:-24%;width:148%;height:200%;background:' + LID + ';' +
          (up ? 'top:0;border-bottom:' : 'bottom:0;border-top:') + Math.max(2, Math.round(BW * 0.62)) +
          'px solid ' + INK + ';box-shadow:0 ' + (up ? '' : '-') + (E * 0.03) + 'px ' + (E * 0.05) +
          'px rgba(20,24,28,.16);will-change:transform';
        return d;
      };
      const lidU = mk(true), lidL = mk(false);
      ball.appendChild(pupil); ball.appendChild(lidU); ball.appendChild(lidL);
      eye.appendChild(ball); wrap.appendChild(eye);
      return { eye, ball, pupil, lidU, lidL };
    });
    host.appendChild(wrap);

    /* ---- Zustand ---- */
    const s = {
      tx: 0, ty: 0,                    // Blickziel
      gx: 0, gy: 0, vx: 0, vy: 0,      // Blick (Feder)
      lu: [0, 0], ll: [0, 0],          // Lid-Ist
      luT: [0, 0], llT: [0, 0],        // Lid-Ziel
      luV: [0, 0], llV: [0, 0],
      slT: [0, 0], sl: [0, 0],
      pu: 1, puT: 1,
      pop: 1, popV: 0, oval: 1, ovalV: 0,
      emote: 'wach', hold: 0,
      blinkK: 0, blinkPhase: 0, blinkAt: RND(2.6, 5.4), blinkDur: 0.17, blinkQueue: 0,
      winkSide: null, winkT: 0,
      cross: false, life: !reduced, override: null,
      idle: 0, driftAt: 2.4, driftX: 0, driftY: 0,
      react: 0, reactX: 0, reactY: 0,
      blinkGap: [2.6, 7.5], dbl: 0.16,
      t: 0
    };

    function applyEmote(name){
      const e = EMOTES[name] || EMOTES.wach;
      s.emote = name;
      s.luT = e.ul.slice(); s.llT = e.ll.slice(); s.slT = e.sn.slice();
      s.puT = e.pu;
      if (e.gz){ s.tx = e.gz[0]; s.ty = e.gz[1]; s.idle = 0; }
    }
    applyEmote('wach');

    /* ---- öffentliche Naht ---- */
    const api = {
      el: wrap,
      get emoteName(){ return s.emote; },

      look(nx, ny){
        s.tx = CLAMP(nx || 0, -1.6, 1.6);
        s.ty = CLAMP(ny || 0, -1.6, 1.6);
        s.idle = 0;                                  // Cursor gewinnt gegen Drift
      },

      lids(v){
        if (!v){ s.override = null; return; }
        if (v.slant != null) s.slT = [v.slant, v.slant];
        s.override = {
          ul: [v.ul == null ? s.luT[0] : v.ul, v.ur == null ? s.luT[1] : v.ur],
          ll: [v.ll == null ? s.llT[0] : v.ll, v.lr == null ? s.llT[1] : v.lr]
        };
      },

      /* Slant der Lidkante, KFB-Skala −1..1. Gerade gedrehte Kante, kein Bogen. */
      slant(v, right){
        const a = v == null ? 0 : CLAMP(v, -1, 1);
        s.slT = [a, right == null ? a : CLAMP(right, -1, 1)];
      },

      setBlink(v){
        v = v || {};
        if (v.minGap != null) s.blinkGap[0] = v.minGap;
        if (v.maxGap != null) s.blinkGap[1] = v.maxGap;
        if (v.dur != null) s.blinkDur = v.dur;
        if (v.double != null) s.dbl = v.double;
      },

      blink(){ if (s.blinkPhase <= 0) s.blinkPhase = 0.0001; },

      emote(name, opt){
        applyEmote(name);
        s.hold = (opt && opt.hold != null) ? opt.hold : (name === 'wach' ? 0 : 1.6);
        if (name === 'schreck'){ api.pop(1.16); }
        if (name === 'skeptisch'){ api.oval(0.88); }
      },

      wink(side){ s.winkSide = side === 'r' ? 1 : 0; s.winkT = 0.62; },

      /* §5a: Schielen auf den eigenen Knopf. Konvergenz plus leichter Blick nach unten. */
      cross(on){ s.cross = !!on; if (on) s.idle = 0; },

      /* §5a: die Augen kommentieren Klicks. Kurzer Blick zum Element, Mikro-Blinzler. */
      react(kind, at){
        s.react = 0.55;
        s.reactX = at && at.x != null ? CLAMP(at.x, -1, 1) : 0;
        s.reactY = at && at.y != null ? CLAMP(at.y, -1, 1) : 0.25;
        if (kind === 'send' || kind === 'scan'){ api.emote('neugierig', { hold: 0.9 }); api.pop(1.08); }
        else if (kind === 'off'){ api.wink(Math.random() < 0.5 ? 'l' : 'r'); }
        else { s.blinkQueue = 1; }
      },

      pop(k){ if (reduced) return; s.pop = Math.max(s.pop, k || 1.14); },
      oval(k){ if (reduced) return; s.oval = k || 0.9; },
      setLife(on){ s.life = !!on && !reduced; },
      /* Amplitude der Augen-Sekundärbewegung, 0 = starr, 1 = so weit wie die Pupille. */
      setFollow(k){ FOLLOW = Math.max(0, Math.min(1, k == null ? 0.28 : k)); },

      update(dt){
        dt = Math.min(0.05, Math.max(0.001, dt || 0.016));
        s.t += dt;

        /* Emote-Halten: läuft aus, dann zurück in den wachen Grundzustand (Prime Directive). */
        if (s.hold > 0){ s.hold -= dt; if (s.hold <= 0 && s.emote !== 'wach' && s.emote !== 'schlaeft') applyEmote('wach'); }

        /* Blickziel: React > Cross > Cursor/Drift */
        let tx = s.tx, ty = s.ty;
        if (s.react > 0){ s.react -= dt; tx = s.reactX; ty = s.reactY; }
        s.idle += dt;
        if (s.life && s.idle > 2.4 && s.react <= 0){
          s.driftAt -= dt;
          if (s.driftAt <= 0){
            // Sakkaden: seltener und kleiner als in Runde 1 — das Idle-Wandern soll nicht ablenken.
            s.driftAt = RND(2.0, 5.0);
            s.driftX = RND(-0.20, 0.20); s.driftY = RND(-0.14, 0.12);
          }
          const tr = 0;                          // kein Tremor: er war als Flackern sichtbar
          tx = s.driftX + tr; ty = s.driftY + tr * 0.6;
        }

        /* Blick-Feder: KRITISCH gedämpft (dp = 2.2·√st). Unterdämpft klingelt sie nach jedem
           Ziel-Wechsel nach — genau das las sich als Flackern der Pupillen. */
        const st = reduced ? 900 : 190, dp = reduced ? 60 : 2.2 * Math.sqrt(190);
        s.vx += (tx - s.gx) * st * dt; s.vy += (ty - s.gy) * st * dt;
        const damp = Math.exp(-dp * dt);
        s.vx *= damp; s.vy *= damp;
        s.gx += s.vx * dt; s.gy += s.vy * dt;
        s.gx = CLAMP(s.gx, -1.15, 1.15); s.gy = CLAMP(s.gy, -1.15, 1.15);

        /* Blinzeln: unregelmäßig, mit kurzem Halt in der geschlossenen Lage — ohne den Halt
           erreicht der Diskretschritt die 1 nie und das Auge bleibt einen Spalt offen. */
        if (s.blinkPhase > 0){
          s.blinkPhase += dt;
          const h = s.blinkDur, hold = s.blinkDur * 0.35, p = s.blinkPhase;
          s.blinkK = p < h ? p / h : (p < h + hold ? 1 : 1 - (p - h - hold) / h);
          s.blinkK = CLAMP(s.blinkK, 0, 1);
          if (p >= h * 2 + hold){
            s.blinkPhase = 0; s.blinkK = 0;
            if (s.blinkQueue > 0){ s.blinkQueue--; s.blinkAt = 0.16; }
            else if (Math.random() < s.dbl) s.blinkAt = RND(0.28, 0.44);   // Doppelblinzler
            else s.blinkAt = RND(s.blinkGap[0], s.blinkGap[1]);
          }
        } else {
          s.blinkAt -= dt;
          if (s.blinkAt <= 0) s.blinkPhase = 0.0001;
        }

        /* Lider: eigene, langsamere Feder — sie LAGEN hinter dem Blick. */
        const lidT = s.override || { ul: s.luT, ll: s.llT };
        for (let i = 0; i < 2; i++){
          let ut = lidT.ul[i], lt = lidT.ll[i];
          if (s.winkT > 0 && s.winkSide === i){ ut = 1; lt = 1; }   // Zwinkern trifft sich mittig
          const lst = reduced ? 900 : 120, ldp = reduced ? 60 : 2.2 * Math.sqrt(120);
          s.luV[i] += (ut - s.lu[i]) * lst * dt; s.luV[i] *= Math.exp(-ldp * dt);
          s.lu[i] += s.luV[i] * dt;
          s.llV[i] += (lt - s.ll[i]) * lst * dt; s.llV[i] *= Math.exp(-ldp * dt);
          s.ll[i] += s.llV[i] * dt;
          s.sl[i] += (s.slT[i] - s.sl[i]) * Math.min(1, dt * 4.5);
        }
        if (s.winkT > 0) s.winkT -= dt;

        /* Pop und Kneifen federn zurück, volumenerhaltend (Sx = 1/Sy in der Fläche). */
        s.popV += (1 - s.pop) * 260 * dt; s.popV *= Math.exp(-2.1 * Math.sqrt(260) * dt); s.pop += s.popV * dt;
        s.ovalV += (1 - s.oval) * 240 * dt; s.ovalV *= Math.exp(-2.1 * Math.sqrt(240) * dt); s.oval += s.ovalV * dt;
        s.pu += (s.puT - s.pu) * Math.min(1, dt * 8);

        /* ---- schreiben ---- */
        for (let i = 0; i < 2; i++){
          const e = eyes[i];
          let gx = s.gx, gy = s.gy;
          if (s.cross){                            // Konvergenz auf den Nasenknopf
            gx = (i === 0 ? 0.62 : -0.62) + s.gx * 0.25;
            gy = 0.34 + s.gy * 0.25;
          }
          const px = CLAMP(gx, -1, 1) * MAXR, py = CLAMP(gy, -1, 1) * MAXR;
          // Totzone: unter 0,2 px wird nichts geschrieben. Subpixel-Zappeln auf einem Kreis
          // mit dicker Kontur liest sonst als Flackern.
          if (!e.last || Math.abs(px - e.last.x) > 0.2 || Math.abs(py - e.last.y) > 0.2 ||
              Math.abs(s.pu - e.last.pu) > 0.004){
            e.last = { x: px, y: py, pu: s.pu };
            e.pupil.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) +
              'px) scale(' + s.pu.toFixed(3) + ')';
          }
          const sy = s.pop * s.oval, sx = s.pop / s.oval;
          // Auge folgt sekundär: kleiner Weg als die Pupille, hart gedeckelt.
          const ex = CLAMP(CLAMP(gx, -1, 1) * MAXR * FOLLOW, -MAXSHIFT, MAXSHIFT);
          const ey = CLAMP(CLAMP(gy, -1, 1) * MAXR * FOLLOW, -MAXSHIFT, MAXSHIFT);
          if (!e.lastE || Math.abs(ex - e.lastE.x) > 0.2 || Math.abs(ey - e.lastE.y) > 0.2){
            e.lastE = { x: ex, y: ey };
            e.eye.style.transform = 'translate(' + ex.toFixed(1) + 'px,' + ey.toFixed(1) + 'px)';
          }
          if (Math.abs(sx - 1) > 0.002 || Math.abs(sy - 1) > 0.002 || e.scaled)
            { e.ball.style.transform = 'scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')'; e.scaled = Math.abs(sx - 1) > 0.002 || Math.abs(sy - 1) > 0.002; }
          // Blinzeln interpoliert Richtung geschlossen, NICHT Math.max: ein Maximum schluckt jeden
          // negativen Lidwert — und negativ heißt „weiter offen als normal" (neugierig, schreck).
          const u = CLAMP(s.lu[i] + (1 - s.lu[i]) * s.blinkK, -0.5, 1.05);
          const l = CLAMP(s.ll[i] + (1 - s.ll[i]) * s.blinkK, -0.5, 1.05);
          /* Geschlossen wird zur MITTE: Oberlid deckt maximal 58 %, Unterlid 44 % (2 % Überlappung,
             damit kein Spalt bleibt). Lider sind 200 % hoch — so legt die Slant-Drehung keine Ecke
             frei; positioniert wird die KANTE (translate ist relativ zur EIGENEN Höhe). */
          const uc = Math.min(u, 0.58), lc = Math.min(l, 0.44);
          const ang = s.sl[i] * SLANT_DEG * (i === 0 ? -1 : 1);   // positiv = Innenkante hoch
          e.lidU.style.transform = 'translateY(' + (50 * uc - 100).toFixed(2) + '%) rotate(' + ang.toFixed(2) + 'deg)';
          e.lidL.style.transform = 'translateY(' + (100 - 50 * lc).toFixed(2) + '%) rotate(' + (ang * 0.5).toFixed(2) + 'deg)';
        }
      },

      dispose(){ try { wrap.remove(); } catch(_){} }
    };

    return api;
  }

  window.RecherchiEyes = { createEyes, EMOTES };
})();
