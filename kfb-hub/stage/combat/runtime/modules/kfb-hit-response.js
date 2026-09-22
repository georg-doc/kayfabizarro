/* kfb-hit-response.js · Was mit einem Koerper passiert, der getroffen wird (v1)
 *
 * HERKUNFT
 * Herausgeschnitten aus `KFB Mech Slice v10 Schussbahn.dc.html` (Runden 4 und 5,
 * 04.09.2026), wo es als `_hitReact` / `_stepReact` / `_endReact` / `_oneShot` /
 * `_stepClips` / `_clearClips` im Wirt klebte. Der Code ist derselbe; neu ist der
 * VERTRAG, denn ohne ihn laesst sich das Ding in keinen zweiten Wirt haengen.
 *
 * WAS ES TUT — vier Schichten auf EINEN Treffer
 *   Clip      der Einmalclip des Modells (HitReact o. ae.) und die Rueckblende ins Idle
 *   Blitz     das getroffene Material leuchtet kurz in der Energiefarbe
 *   Ring      eine Trefferscheibe am Einschlag, aus dem Sprite-Pool des Wirts
 *   Deformer  Squash & Stretch entlang der Trefferachse, Hitstop, Knockback
 *
 * ARBEITSTEILUNG, die den Bau bestimmt: der CLIP ist die Absicht des Modells (die
 * Pose, die der Rigger wollte), der DEFORMER ist die Wucht des Geschosses (aus dem
 * Zellenprofil). Beides zusammen, nicht statt einander. Fehlt der Clip, tragen die
 * anderen drei Schichten den Treffer allein — kein Rueckschritt, nur weniger.
 *
 * ═══ DREI REGELN, JEDE AUS EINEM FEHLER DIESER SITZUNG ═════════════════════════
 *
 * 1 · DAS MODUL SCHREIBT KEINE POSITION.
 *     Der Knockback lag als Feld im Wirt und wurde an genau einer Stelle gelesen —
 *     innerhalb von `if (this._kick)`. Schoss der Gegner, war `_kick` null, der
 *     Block lief nicht, und der Knockback erreichte das Mesh NIE. Eine Groesse mit
 *     zwei Zustaendigkeiten hat keine. Deshalb schreibt dieses Modul nur, was ihm
 *     allein gehoert: `vis.scale` und die Emissive der getroffenen Materialien. Den
 *     Versatz GIBT es heraus (`knockOf`), anwenden muss der Wirt, der die Ruhelage
 *     der Position kennt.
 *
 * 2 · ALLES LAEUFT IM SIMULATIONSTAKT, den der Wirt vorgibt (`step(dt)`).
 *     Keine Wanduhr, kein `performance.now`. Sonst zeigt Zuruecklaufen eine andere
 *     Reaktion als der Hinlauf, und der Determinismus-Vergleich luegt.
 *
 * 3 · KONTAKTSCHATTEN, OBERFLAECHE UND MARKEN GEHOEREN NICHT HIERHER.
 *     Zweimal falsch gebaut, weil im Schussstand eine Bodenebene Schatten empfaengt
 *     und in der Voxel-Welt nichts (dort tanzen die Wuerfel und das Terrain hat
 *     keine Shadowmap). Das ist eine WIRT-Faehigkeit, keine Modulentscheidung, also
 *     steht sie hier nicht drin — auch nicht "vorsichtshalber".
 *
 * ═══ VERTRAG ══════════════════════════════════════════════════════════════════
 *   const R = createHitResponse({
 *     THREE,                       // Pflicht
 *     emit,                        // (zelle, pos, opts) → Sprite | null · fuer den Ring
 *     rng,                         // () → 0..1, GESEEDET. Ohne: Math.random (nicht deterministisch)
 *     params                       // optional, siehe P unten
 *   });
 *
 *   R.hit({
 *     vis,      Object3D, wird verformt (Pflicht)
 *     mix,      AnimationMixer des Koerpers | null
 *     anims,    AnimationClip[] | null
 *     point,    Vector3 · Einschlagpunkt
 *     normal,   Vector3 · Flaechennormale am Treffer (zeigt zum Schuetzen)
 *     tint,     Hex · Energiefarbe
 *     size,     Zahl · Groesse des Primaersignals, skaliert den Ring
 *     stop,     s · Hitstop aus dem Zellenprofil
 *     knock     0..1 · Wucht aus dem Zellenprofil
 *   })  →  { clip: string|null, dir: Vector3 }
 *
 *   R.step(dt)            je Simulationsschritt
 *   R.knockOf(vis)        → Vector3 (Nullvektor, wenn keine Reaktion laeuft)
 *   R.frozen(vis)         → true, solange der Hitstop haelt (Wirt friert den Mixer)
 *   R.reset()             Zuruecksetzen: Posen, Skalen, Materialien, Clips
 *   R.stats()             { live, clips }
 */

export function createHitResponse(o) {
  const THREE = (o && o.THREE) || null;
  if (!THREE) throw new Error('kfb-hit-response: THREE fehlt');
  const emit = (o && o.emit) || (() => null);
  const rng = (o && o.rng) || Math.random;

  /* KEINE KONSTANTE OHNE HERLEITUNG (Workspace-Regel). Die Werte sind die im
     Schussstand GEMESSENEN; wer sie aendert, aendert das Anschlagsgefuehl.
     `QUELLE` bleibt als Vorbildwert stehen, damit `abweichungen()` sagen kann, was
     ein Wirt verstellt hat — Slice-D-Regel des Travel-Wirts: ein Modul ohne
     Bericht erscheint dort als „no report", und Fehlen soll sichtbar sein. */
  const QUELLE = {
    dur: 0.4,        // s · Ausschwingen nach dem Hitstop. Kuerzer wirkt zappelig, laenger gummiartig
    /* HOLD IST NICHT HITSTOP — zwei Uhren, die v1 zu einer gemacht hat, und daran
       ist die Trefferreaktion sichtbar gescheitert (Georgs Befund „falsch getimed
       und unsauber konzipiert", 04.09.). Der HITSTOP kommt aus dem Zellenprofil und
       friert die ANIMATION: das ist Bildbudget, deshalb kurz (`metal` liefert 20 ms
       = 1,2 Bilder bei 60). Der HOLD ist die ZEICHNUNG: die gestauchte Pose muss
       STEHEN, damit das Auge sie als Anschlag liest. 20 ms stehen nicht, sie
       flackern — die Verformung fing sofort an auszuschwingen und las sich als
       Zittern statt als Schlag. 0,07 s = gut vier Bilder, die klassische Haltedauer
       eines Cartoon-Extrems. Genommen wird der LAENGERE der beiden Werte, damit ein
       Profil mit schwerem Hitstop den Hold nicht verkuerzt. */
    hold: 0.07,
    /* EIN Ueberschwinger, kein Summen. v1 rang mit exp(-4,6k)·cos(2,4πk) — 1,2 volle
       Perioden auf 0,4 s, also Stauchung → Streckung → Stauchung → Streckung. Vier
       Extreme auf einen Treffer sind Gummi, nicht Masse; im Bild war es ein Wabern.
       1,2π ist EIN Nulldurchgang: Stauchung, ein Durchschwingen zur anderen Seite
       mit rund 40 % Amplitude, aus. Das ist Follow-Through, nicht Vibration. */
    abkling: 3.4,
    schwingung: 1.2,
    squash: 0.3,     // Stauchung entlang der Trefferachse bei voller Wucht
    stretch: 0.24,   // Ausgleich nach oben (Volumen bleibt gefuehlt erhalten)
    side: 0.12,      // Ausgleich zur Seite, bewusst kleiner als nach oben
    amtBase: 0.4,    // Bodenwert: auch ein Streifschuss muss sichtbar sein
    amtGain: 1.1,    // wie stark `knock` darueber hinaus wirkt
    knockScale: 0.9, // Welteinheiten je Wucht-Einheit. 0,55 war gegen den Flugzyklus (1,9 u
                     // quer) nicht zu sehen — der Stoss MUSS die groesste Bewegung im Bild sein,
                     // solange er laeuft, sonst liest das Auge den Zyklus als Reaktion.
    flashMs: 160,    // Blitz ist KUERZER als die Verformung: Licht zuerst, Masse danach
    flashGain: 1.8,  // Zuschlag auf die Emissive-Intensitaet des Materials
    ring: true,
    ringCell: 'ring',
    ringLife: 0.24,
    ringFrom: 0.8,   // × size
    ringTo: 2.5,     // × size
    clipRx: /hit|react|damage|hurt/i,
    clipRate: 1.2,
    fadeMs: 50,
    idleFadeMs: 140
  };
  const P = Object.assign({}, QUELLE, (o && o.params) || {});

  /* EIN Szenenknoten, wie der Vertrag es verlangt — und er ist ABSICHTLICH leer.
     Dieses Modul besitzt nichts in der Szene: es verformt fremde Koerper, blitzt
     auf fremden Materialien und laesst den Ring vom Sprite-Pool des Wirts zeichnen.
     Der leere Knoten ist die ehrliche Antwort auf eine Pflichtangabe; `tor()` nennt
     seine Kinderzahl, damit niemand ihn fuer vergessen haelt. */
  const group = new THREE.Group();
  group.name = 'kfb-hit-response';

  const live = new Map();    // vis → Reaktionsdatensatz
  const held = new Map();    // mix → { shot, idle }
  const ZERO = new THREE.Vector3();
  /* Zwei Kratzwerte fuer die Achsendrehung je Schritt — neu anzulegen waere je
     Reaktion und Bild ein Objekt, und das im Takt. */
  const QW = new THREE.Quaternion();
  const LD = new THREE.Vector3();

  /* ---------- Clips ------------------------------------------------------- */
  /* Gesucht wird nach BEDEUTUNG, nicht nach exaktem Namen: die Modelle kommen aus
     verschiedenen Exporten, und ein Name ist kein Vertrag. */
  function oneShot(mix, anims, rx, rate) {
    if (!mix || !anims || !anims.length) return null;
    const clip = anims.find((c) => rx.test(String(c.name).split('|').pop()));
    if (!clip) return null;
    const a = mix.clipAction(clip);
    a.stop(); a.reset();
    a.setLoop(THREE.LoopOnce, 1);
    a.clampWhenFinished = true;
    a.timeScale = rate || 1;
    a.setEffectiveWeight(1);
    a.fadeIn(P.fadeMs / 1000);
    a.play();
    return { a: a, name: String(clip.name).split('|').pop(), dur: clip.duration / (rate || 1), t: 0 };
  }

  /* Ohne diesen Schritt friert `clampWhenFinished` das Modell in der letzten Pose
     ein — der Getroffene haette nach einem Treffer fuer immer gezuckt. */
  function stepClips(dt) {
    for (const [mix, rec] of held) {
      if (!rec.shot) continue;
      rec.shot.t += dt;
      if (rec.shot.t < rec.shot.dur) continue;
      if (rec.idle) { rec.idle.reset(); rec.idle.setEffectiveWeight(1); rec.idle.fadeIn(P.idleFadeMs / 1000); rec.idle.play(); }
      rec.shot.a.fadeOut(P.idleFadeMs / 1000);
      rec.shot = null;
    }
  }

  /* ---------- Der Treffer ------------------------------------------------- */
  function hit(t) {
    if (!t || !t.vis) return { clip: null, dir: ZERO.clone() };
    const vis = t.vis;
    end(vis);                                  // eine Reaktion je Koerper, nicht zwei uebereinander

    const nrm = t.normal || new THREE.Vector3(-1, 0, 0);
    /* DIE STOSSACHSE KOMMT VOM IMPULS, nicht von der Oberflaeche. Erste Fassung
       leitete sie aus der Flaechennormale ab — auf einem gekrummten Koerper zeigt
       die irgendwohin, und gemessen stauchte der Gegner dann quer zur Bahn (sx ging
       auf 1,09 statt auf 0,80). Der Wirt gibt deshalb `dir` mit: Schuetze → Treffer.
       Ohne `dir` bleibt die Normale der Rueckfall, damit ein Nahkampf-Wirt, der
       keine Flugbahn hat, nicht leer ausgeht. */
    const dir = (t.dir ? t.dir.clone() : nrm.clone().negate());
    if (dir.lengthSq() < 1e-9) dir.set(1, 0, 0);
    dir.normalize();

    if (P.ring && t.point) {
      emit(P.ringCell, t.point.clone().addScaledVector(nrm, 0.06), {
        color: t.tint, size: (t.size || 1) * P.ringFrom, size1: (t.size || 1) * P.ringTo,
        life: P.ringLife, add: true, op: 0.95, pop: true, rot: rng() * 6.283
      });
    }

    /* Materialien und ihre RUHEWERTE. Gesichert wird am Material selbst, damit ein
       Modellwechsel mitten in der Reaktion nichts Fremdes zuruecksetzt. */
    const mats = [];
    vis.traverse((n) => {
      if (!n.isMesh && !n.isSkinnedMesh) return;
      const list = Array.isArray(n.material) ? n.material : [n.material];
      for (const m of list) {
        if (!m || !m.emissive) continue;
        if (!m.userData.__kfbE0) m.userData.__kfbE0 = { c: m.emissive.getHex(), i: m.emissiveIntensity == null ? 1 : m.emissiveIntensity };
        mats.push(m);
      }
    });

    let clipName = null;
    if (t.mix) {
      const rec = held.get(t.mix) || { shot: null, idle: null };
      const s = oneShot(t.mix, t.anims, P.clipRx, P.clipRate);
      if (s) { rec.shot = s; clipName = s.name; }
      held.set(t.mix, rec);
    }

    live.set(vis, {
      vis: vis, mats: mats, tint: t.tint == null ? 0xffffff : t.tint,
      t: 0, stop: Math.max(0, t.stop || 0),
      /* Der Hold ist mindestens vier Bilder lang, auch wenn das Profil weniger
         Hitstop bestellt — Herleitung an `P.hold`. `frozen()` liest weiter NUR
         `stop`: die Animation friert nach Budget, nicht nach Zeichnung. */
      halt: Math.max(Math.max(0, t.stop || 0), P.hold), dur: P.dur,
      amt: Math.min(1, P.amtBase + (t.knock || 0) * P.amtGain),
      knock: (t.knock || 0) * P.knockScale,
      dir: dir, s0: vis.scale.clone(), off: new THREE.Vector3()
    });
    step(0);
    return { clip: clipName, dir: dir.clone() };
  }

  /* ---------- Der Takt ---------------------------------------------------- */
  /* `dt` KOMMT HEREIN. Keine Uhr im Modul: in einem verdeckten Tab wird der
     Bildtakt gedrosselt, und ein Modul mit eigener Uhr misst dann die
     Aufmerksamkeit des Zuschauers mit (PM-50 des Travel-Wirts). */
  function step(dt) {
    stepClips(dt);
    for (const [vis, R] of live) {
      if (!vis.parent) { live.delete(vis); continue; }   // Koerper wurde getauscht
      R.t += dt;
      /* HITSTOP: waehrend `stop` HAELT die Pose auf dem Anschlag — das ist der Schlag,
         den man spuert. Danach federt die Masse aus: abklingende Schwingung, kein
         linearer Rueckweg (eine Masse gleitet nicht zurueck, sie schwingt). */
      const k = R.t <= R.halt ? 0 : (R.t - R.halt) / R.dur;
      if (k >= 1) { end(vis); continue; }
      const env = k <= 0 ? 1 : Math.exp(-P.abkling * k) * Math.cos(P.schwingung * Math.PI * k);
      const a = R.amt * env;

      /* DIE STOSSRICHTUNG IST WELTWEIT, `vis.scale` IST ES NICHT — und daran ist v1
         gescheitert. Der Wirt dreht beide Koerper um −90° auf die Bahn (sie sehen
         sich an), also zeigt die LOKALE x-Achse des Modells nach dem Yaw entlang der
         WELT-z. Das Modul schrieb `scale.x` fuer einen Stoss in Welt-x — gestaucht
         wurde damit QUER zur Flugbahn. Genau Georgs Befund: „nach dem impact wird
         das ziel zur seite bewegt, statt impact-richtung".
         Gedreht wird JE SCHRITT, nicht einmalig beim Treffer: die Fluglage rollt
         waehrend der Reaktion weiter, und eine Achse, die auf die Lage von vor
         0,4 s zeigt, ist wieder die falsche.
         Der KNOCKBACK bleibt in WELTkoordinaten — der Wirt addiert ihn auf eine
         Weltposition. Zwei Raeume, zwei Groessen, sauber getrennt. */
      vis.getWorldQuaternion(QW);
      LD.copy(R.dir).applyQuaternion(QW.invert());
      const ax = Math.abs(LD.x) >= Math.abs(LD.z) ? 'x' : 'z';
      R.ax = ax;                       // fuer `tor()` — die Achse wird GEMESSEN, nicht zugesagt
      const other = ax === 'x' ? 'z' : 'x';
      vis.scale[ax] = R.s0[ax] * (1 - a * P.squash);
      vis.scale.y = R.s0.y * (1 + a * P.stretch);
      vis.scale[other] = R.s0[other] * (1 + a * P.side);

      R.off.copy(R.dir).multiplyScalar(R.knock * env);

      /* Der Blitz ist kuerzer als die Verformung. */
      const f = Math.max(0, 1 - R.t / (P.flashMs / 1000));
      for (const m of R.mats) {
        const e0 = m.userData.__kfbE0;
        if (!e0) continue;
        if (f > 0) { m.emissive.setHex(R.tint); m.emissiveIntensity = e0.i + f * P.flashGain; }
        else { m.emissive.setHex(e0.c); m.emissiveIntensity = e0.i; }
      }
    }
  }

  function end(vis) {
    const R = live.get(vis);
    if (!R) return;
    live.delete(vis);
    if (R.vis && R.vis.parent) R.vis.scale.copy(R.s0);
    for (const m of R.mats) {
      const e0 = m.userData.__kfbE0;
      if (!e0) continue;
      m.emissive.setHex(e0.c);
      m.emissiveIntensity = e0.i;
    }
  }

  return {
    name: 'kfb-hit-response',
    group: group,
    params: P,
    quelle: QUELLE,
    hit: hit,
    /* Der Vertragsname ist `update`. `step` bleibt als Zweitname, weil der
       Schussstand ihn ruft und ein Umbenennen dort keine Verbesserung waere. */
    update: step,
    step: step,
    /* Der Wirt addiert das auf die RUHELAGE, die er selbst kennt. Das Modul kennt
       sie absichtlich nicht — siehe Regel 1 im Kopf. */
    knockOf(vis) { const R = live.get(vis); return R ? R.off : ZERO; },
    frozen(vis) { const R = live.get(vis); return !!(R && R.t <= R.stop); },
    /* WIE STARK DIE BEWEGUNG DES GETROFFENEN GEBREMST IST, 0 = steht, 1 = frei.
       Der Treffer besitzt den Koerper fuer die Dauer des Halts, danach nimmt er die
       Fahrt wieder auf — nicht als Sprung, sondern als Rampe ueber das Ausschwingen.
       Warum das hier liegt und nicht im Wirt: die Reaktion weiss, wie lange sie
       noch dauert. Warum es der WIRT anwenden muss: nur er weiss, welcher der
       beiden Koerper das ist. Rueckgabe 1, wenn keine Reaktion laeuft — fehlende
       Reaktion ist keine Bremse. */
    gate(vis) {
      const R = live.get(vis);
      if (!R) return 1;
      if (R.t <= R.halt) return 0;
      const k = (R.t - R.halt) / R.dur;
      return k >= 1 ? 1 : k * k;      // langsam anfahren: eine Masse springt nicht auf Reisegeschwindigkeit
    },
    reset() {
      for (const vis of Array.from(live.keys())) end(vis);
      for (const [, rec] of held) {
        if (rec.shot) { try { rec.shot.a.stop(); } catch (e) { /* weg */ } rec.shot = null; }
        if (rec.idle) { try { rec.idle.reset(); rec.idle.setEffectiveWeight(1); rec.idle.play(); } catch (e) { /* weg */ } }
      }
    },
    /* Das Idle je Mixer muss der Wirt anmelden — er hat es beim Laden gewaehlt, und
       eine zweite Idle-Suche hier waere eine zweite Wahrheit. */
    setIdle(mix, action) { if (!mix) return; const rec = held.get(mix) || { shot: null, idle: null }; rec.idle = action; held.set(mix, rec); },
    /* Derselbe Mechanismus, aber fuer einen Clip, der KEIN Treffer ist — der
       Abschussclip des Schuetzen zum Beispiel. Er gehoert hierher, weil sonst zwei
       Stellen Einmalclips verwalten und die Rueckblende ins Idle zweimal existiert. */
    playClip(mix, anims, rx, opts) {
      if (!mix) return null;
      const rec = held.get(mix) || { shot: null, idle: null };
      const s = oneShot(mix, anims, rx, (opts && opts.rate) || 1);
      if (s) { rec.shot = s; held.set(mix, rec); }
      return s ? s.name : null;
    },
    stats() { let c = 0; for (const [, r] of held) if (r.shot) c++; return { live: live.size, clips: c }; },

    /* ---------- Bericht und Tor ------------------------------------------- */
    abweichungen() {
      const out = [];
      for (const k in QUELLE) {
        const a = QUELLE[k], b = P[k];
        const gleich = (a instanceof RegExp || b instanceof RegExp) ? String(a) === String(b) : a === b;
        if (!gleich) out.push({ feld: k, quelle: String(a), ist: String(b) });
      }
      return out;
    },
    zeile() {
      const ab = this.abweichungen();
      const s = this.stats();
      return 'hit-response · ' + s.live + ' Reaktion(en) · ' + s.clips + ' Clip(s) · '
        + (ab.length ? ab.length + ' Wert(e) von der Quelle abweichend' : 'Werte wie gemessen');
    },

    /* EIN TOR IST KEIN SELBSTBERICHT (PM-41 des Travel-Wirts: ein Pruefwerkzeug
       ohne Kontrollprobe ist eine Meinung). Also werden Zusagen gegen LIVE
       gelesene Werte gestellt, mit drei Urteilen — und „nicht messbar" ist eines
       davon, weil „falsch" an der Stelle keines waere. Bei `✗` stehen beide Zahlen. */
    tor() {
      const z = [];
      let ok = 0, von = 0, nm = 0;
      const pruef = (bed, gut, schlecht) => { von++; if (bed) { ok++; z.push('✓ ' + gut); } else z.push('✗ ' + schlecht); };
      const offen = (t) => { nm++; z.push('– ' + t + ' (nicht messbar)'); };
      /* INFORMATION, KEIN URTEIL (§5 des Wirt-Vertrags: `kind: 'info'`). Eine Zeile,
         die nicht fallen KANN, darf nicht als bestandene Pruefung zaehlen — sonst
         schoent das Instrument sein eigenes Verhaeltnis. Verifier-Fund 04.09.: das
         Tor meldete 5/5, gemessen waren vier. */
      const info = (s) => { z.push('· ' + s); };

      pruef(group.children.length === 0,
        'besitzt keinen Szenenknoten (' + group.children.length + ' Kinder) — wie vorgesehen',
        'Szenenknoten hat ' + group.children.length + ' Kinder, erwartet 0');

      /* Der teuerste Fehlerfall dieses Moduls: ein Einmalclip OHNE Idle-Rueckblende
         friert das Modell in der letzten Pose ein. Das ist messbar, also wird es
         gemessen und nicht zugesagt. */
      let ohneIdle = 0, mitShot = 0;
      for (const [, r] of held) { if (r.shot) { mitShot++; if (!r.idle) ohneIdle++; } }
      if (mitShot) {
        pruef(ohneIdle === 0,
          mitShot + ' laufende(r) Clip(s), alle mit Idle-Rueckblende',
          ohneIdle + ' von ' + mitShot + ' laufenden Clips ohne Idle — die Pose friert ein');
      } else offen('Clip-Rueckblende: kein Clip laeuft gerade');

      /* Jedes angefasste Material muss seinen Ruhewert bei sich tragen, sonst
         bleibt ein Koerper nach dem Blitz zu hell. */
      let mats = 0, ohneRuhe = 0;
      for (const [, R] of live) for (const m of R.mats) { mats++; if (!m.userData.__kfbE0) ohneRuhe++; }
      if (mats) {
        pruef(ohneRuhe === 0,
          mats + ' Material(ien) im Blitz, alle mit gesichertem Ruhewert',
          ohneRuhe + ' von ' + mats + ' Materialien ohne Ruhewert — bleiben zu hell');
      } else offen('Blitz-Ruhewerte: keine Reaktion laeuft gerade');

      /* Verlassene Eintraege: ein Koerper, der aus der Szene genommen wurde, darf
         keine Reaktion mehr halten. */
      let verwaist = 0;
      for (const [vis] of live) if (!vis.parent) verwaist++;
      pruef(verwaist === 0,
        'keine verwaisten Reaktionen (' + live.size + ' aktiv)',
        verwaist + ' von ' + live.size + ' Reaktionen haengen an einem abgehaengten Koerper');

      /* DER FEHLER, DER EINE RUNDE GEKOSTET HAT, wird jetzt gemessen: die gewaehlte
         Stauchachse muss in der WELT entlang der Stossrichtung zeigen. Gedreht ist
         der Koerper um −90°, also faellt eine Verwechslung von lokal und weltweit
         auf genau 0 im Skalarprodukt — keine Meinung, eine Zahl. */
      let quer = 0, gepr = 0, minDot = 1;
      for (const [vis, R] of live) {
        if (!R.ax) continue;
        gepr++;
        vis.getWorldQuaternion(QW);
        LD.set(R.ax === 'x' ? 1 : 0, 0, R.ax === 'z' ? 1 : 0).applyQuaternion(QW);
        const d = Math.abs(LD.dot(R.dir));
        minDot = Math.min(minDot, d);
        if (d < 0.7) quer++;
      }
      if (gepr) {
        pruef(quer === 0,
          gepr + ' Stauchachse(n) entlang der Stossrichtung (min |cos| ' + minDot.toFixed(2) + ')',
          quer + ' von ' + gepr + ' Stauchachsen stehen quer zur Bahn (min |cos| ' + minDot.toFixed(2) + ') — lokal gegen weltweit verwechselt');
      } else offen('Stauchachse: keine Reaktion laeuft gerade');

      const ab = this.abweichungen();
      info('Regler: ' + ab.length + ' von ' + Object.keys(QUELLE).length + ' Werten von der Quelle abweichend');

      return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
               text: 'hit-response: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    }
  };
}
