/**
 * combat-arena-v2/player.v2.js — M2 PLAYER-CONTROLLER (MASTERPLAN §2, Slice S1).
 *
 * Der Körper von FrizzleBob auf dem Spielfeld. Die FIGUR baut dieses Modul NICHT — sie kommt aus
 * `combat-arena-v1/frizzlebob.v1.js` (importiert, nicht nachgebaut) und wird hier per `bind()`
 * übernommen. Dieses Modul besitzt genau vier Dinge:
 *
 *   1. Tempo   Beschleunigung, Reibung, Höchsttempo — in Welt-Einheiten je Sekunde, nicht in Gefühl
 *   2. Rand    `field.contain()` fragen, Versatz anwenden, Geschwindigkeit an der Normalen spiegeln
 *   3. Blick   Bewegungsrichtung relativ zur Kamera (`cam.blick()`), Figur dreht sich hinterher
 *   4. Clips   Idle · Walk · Run nach Tempo, Zeitraffung vorläufig aus dem Tempo (M9 vermisst sie)
 *
 * ── DIE NAHT ZUM FELD (CONTRACT §4) ────────────────────────────────────────────
 * Der RAND gehört dem Feld, die REAKTION dem Körper. `field.contain(pos, r)` gibt Versatz und
 * Normale; was daraus folgt, entscheidet dieses Modul: Spieler prallt ab (Restitution 0,25),
 * Mobs werden das später anders halten. Keine Kantenlogik in diesem Modul, keine Bounce-Logik im Feld.
 *
 * ── BODEN C1 (BLOCK) ───────────────────────────────────────────────────────────
 * »FB-Position nach 60 s zufälliger WASD-Eingabe (Seed) immer inside — 0 Kantenüberschreitungen.«
 * `probe()` fährt genau das: fester Schritt, Eingaben aus dem Seed-RNG des Wirts, und zählt die
 * Bilder, in denen die Position NACH der Korrektur außerhalb liegt. Kein Warten auf echte Zeit —
 * die Uhr ist im verdeckten Vorschaufenster gedrosselt (ENVIRONMENT CA-4), der Beweis darf nicht
 * daran hängen. Die Probe läuft auf einer KOPIE des Zustands und stellt den Spielzustand danach
 * wieder her; ein Beweis, der die Welt verändert, ist ein Eingriff, kein Beweis.
 *
 * KEIN Math.random (Boden C10): jeder Zufall kommt aus `rng` des Wirts (Seed 20260906).
 */

export const SPEC = {
  /* RÜCKFALL, keine Wahl: bis M9 gemessen hat, gelten diese Zahlen — und sie hießen von Anfang an
     Annahme. Gemessen (05./06.09., Standfuß-Drift) trägt FBs Walk 0,63 u/s und der Run 1,71 u/s bei
     Figurhöhe 1,2 u. Mit den alten 1,9/3,4 hätte der Walk-Clip dreifach laufen müssen — die Füße
     hätten sichtbar gerutscht. Das Tempo folgt jetzt dem Schrittmaß (`setRef`), nicht umgekehrt. */
  tempo: { gehen: 1.0, laufen: 2.7, beschl: 16, reibung: 9 },
  /* Clip-Rate, die wir höchstens fahren: 1,6 × Schrittmaß. Darüber wirkt der Zyklus gehetzt —
     das ist eine Gestaltungsgrenze, und sie steht hier als Zahl, damit sie prüfbar ist. */
  rateZiel: 1.6,
  sprung: { kraft: 4.4, schwere: 16, abdruck: 0.18, landen: 0.28 },   // Abdruck/Aufsetzer: Clip-Längen Jump 0,46 s · Jump_Land 0,46 s, hier die sichtbaren Anteile
  restitution: 0.25,                     // Georgs Zahl aus dem MASTERPLAN: Rand federt, er klebt nicht
  radiusAnteil: 0.28,                    // Körperradius = Anteil der Figurhöhe (1,2 u → 0,34 u)
  drehTempo: 9,                          // rad/s, mit dem sich die Figur in die Laufrichtung dreht
  clipTempo: { walk: 1.9, run: 3.4 }     // Bezugstempo der Clips — Rückfall, falls M9 nichts messen kann
};

export default class PlayerController {
  static describe() {
    return { name: 'PlayerController', capabilities: ['three@0.160', 'input', 'field', 'time', 'clock', 'rng'], view: '3d', determinism: 'seeded', spec: SPEC };
  }

  async init(ctx) {
    this.THREE = ctx.three; this.input = ctx.input; this.field = ctx.field; this.time = ctx.time;
    this.cam = ctx.cam; this.rng = ctx.rng;
    this.log = (s) => (ctx.log || console.info)('[player] ' + s);
    const T = this.THREE;
    this.pos = new T.Vector3(0, 0, 0);
    this.vel = new T.Vector3(0, 0, 0);
    this.hoehe = 1.2; this.radius = SPEC.radiusAnteil * this.hoehe;
    this.amBoden = true; this.bounces = 0; this.stuerze = 0; this.tempo = 0;
    this._abdruck = 0; this._landen = 0; this.zielt = 0; this.zielRichtung = null;
    this.fussOffset = this.fussOffset || 0;
    this.clipName = null; this._blick = 0;
    this.aktiv = false;   // erst wenn ein Körper gebunden ist
  }

  /** Die Figur übernehmen (FrizzleBob-Instanz aus v1). Höhe wird gemessen, nicht angenommen. */
  bind(fb, hoehe) {
    this.fb = fb;
    this.root = fb && fb.root;
    if (hoehe) this.hoehe = hoehe;
    this.radius = SPEC.radiusAnteil * this.hoehe;
    if (this.root) { this.pos.copy(this.root.position); this.pos.y = this.field.floorY(); }
    this.aktiv = !!this.root;
    this.log('gebunden · Höhe ' + this.hoehe.toFixed(2) + ' u · Radius ' + this.radius.toFixed(2) + ' u · Tempo ' + SPEC.tempo.gehen + '/' + SPEC.tempo.laufen + ' u/s');
    this._clip(0);
    return this;
  }

  /** Auf die Feldmitte setzen (Feldwechsel, Sturz, Neustart). */
  reset(x, z) {
    this.pos.set(x || 0, this.field.floorY(), z || 0);
    this.vel.set(0, 0, 0); this.amBoden = true;
    if (this.root) this.root.position.set(this.pos.x, this.pos.y + (this.fussOffset || 0), this.pos.z);
  }

  /* Eingabe → Wunschrichtung auf der Bodenebene, RELATIV ZUR KAMERA. W ist »weg von der Kamera«,
     nicht »+Z« — sonst läuft die Figur bei gedrehter Kamera seitwärts. */
  _wunsch(ix, iz) {
    const b = this.cam ? this.cam.blick() : { x: 0, z: -1 };
    const rx = -b.z, rz = b.x;                       // rechts = Blick um 90° gedreht
    let x = b.x * iz + rx * ix, z = b.z * iz + rz * ix;
    const l = Math.hypot(x, z);
    return l > 1e-6 ? { x: x / l, z: z / l, stark: Math.min(1, l) } : { x: 0, z: 0, stark: 0 };
  }

  /**
   * EIN Schritt Körperphysik. Getrennt von `update`, damit die Probe (C1) denselben Weg fährt wie
   * das Spiel — ein Beweis, der einen zweiten Rechenweg nimmt, beweist den zweiten Rechenweg.
   */
  schritt(dt, ix, iz, springen, laufen) {
    const w = this._wunsch(ix, iz);
    const T = this.tempoMax || SPEC.tempo;
    const max = laufen ? (T.laufen || SPEC.tempo.laufen) : (T.gehen || SPEC.tempo.gehen);
    if (w.stark > 0) {
      this.vel.x += w.x * SPEC.tempo.beschl * dt;
      this.vel.z += w.z * SPEC.tempo.beschl * dt;
      const t = Math.hypot(this.vel.x, this.vel.z);
      if (t > max) { this.vel.x *= max / t; this.vel.z *= max / t; }
    } else {
      /* Reibung als Tempo-Abzug, nicht als Faktor: ein Faktor hängt am Schritt (bei kleinem dt bremst
         er zu wenig, bei großem zu viel), ein Abzug in u/s² nicht. */
      const d = SPEC.tempo.reibung * dt, t = Math.hypot(this.vel.x, this.vel.z);
      const k = t > 1e-6 ? Math.max(0, t - d) / t : 0;
      this.vel.x *= k; this.vel.z *= k;
    }
    if (springen && this.amBoden) { this.vel.y = SPEC.sprung.kraft; this.amBoden = false; this._abdruck = SPEC.sprung.abdruck; }
    if (this._abdruck > 0) this._abdruck -= dt;
    if (this._landen > 0) this._landen -= dt;
    this.vel.y -= SPEC.sprung.schwere * dt;

    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;
    this.pos.y += this.vel.y * dt;

    const boden = this.field.floorY();
    if (this.pos.y <= boden) {
      const kam = !this.amBoden;
      this.pos.y = boden; this.vel.y = 0; this.amBoden = true;
      if (kam) this._landen = SPEC.sprung.landen;   // Aufsetzer einmal spielen, dann Bodenkette
    }

    /* Rand: Feld fragen, Versatz anwenden, Geschwindigkeit spiegeln. */
    const c = this.field.contain(this.pos, this.radius);
    if (c.push.x || c.push.z) {
      this.pos.x += c.push.x; this.pos.z += c.push.z;
      const n = c.normal, vn = this.vel.x * n.x + this.vel.z * n.z;
      if (vn < 0) {                                   // nur wenn er in die Kante hineinfährt
        this.vel.x -= (1 + SPEC.restitution) * vn * n.x;
        this.vel.z -= (1 + SPEC.restitution) * vn * n.z;
        this.bounces++;
      }
    }
    if (c.gefallen) { this.stuerze++; this.reset(0, 0); }
    this.tempo = Math.hypot(this.vel.x, this.vel.z);
    return c;
  }

  /** Gemessene Referenztempi aus M9 übernehmen (S1½). Das Bodentempo folgt der Messung. */
  setRef(r) {
    this.ref = { walk: (r && r.walk) || null, run: (r && r.run) || null };
    /* HÖCHSTTEMPO AUS DEM SCHRITTMASS: Tempo = Schrittmaß × höchste zumutbare Clip-Rate. So ist der
       Rutschfaktor 1,000 ohne Klemme — die Figur läuft genau so schnell, wie ihre Füße es tragen. */
    this.tempoMax = {
      gehen: this.ref.walk ? +(this.ref.walk * SPEC.rateZiel).toFixed(3) : SPEC.tempo.gehen,
      laufen: this.ref.run ? +(this.ref.run * SPEC.rateZiel).toFixed(3) : SPEC.tempo.laufen
    };
    this._soll = null;   // Clip neu wählen, damit die neue Rate sofort greift
    this.log('Schrittmaß übernommen · walk ' + (this.ref.walk || '–') + ' → Tempo ' + this.tempoMax.gehen
      + ' u/s · run ' + (this.ref.run || '–') + ' → ' + this.tempoMax.laufen + ' u/s');
  }

  /** Fuß-Offset: um so viel liegt die Wurzel ÜBER dem Boden, damit die Füße darauf stehen.
      Wird gemessen übergeben (M9/Integrator), nicht hier geraten — und JEDES Bild angewandt. */
  setFussOffset(v) { this.fussOffset = isFinite(v) ? v : 0; return this.fussOffset; }

  /** Schussclip einmal spielen (M5 ruft es beim Feuern) — `Idle_Shoot` / `Run_Shoot`, dann zurück.
      Georg 06.09.: »Schuss, Mündung und Animation sind noch falsch getimed« — der Clip startet jetzt
      VOR dem Abgang, damit das Ausholen zu sehen ist, statt gleichzeitig mit dem Geschoss. */
  schuss(ant) {
    if (!this.fb || !this.fb.play) return null;
    const re = this.tempo > (this.tempoMax || SPEC.tempo).gehen * 1.05 ? /^run_shoot$/i : /^idle_shoot$/i;
    const e = this.fb.findClip(re) || this.fb.findClip(/^idle_gun$/i);
    if (!e) return null;
    this.fb.play(e.name, { loop: false });
    this.clipName = e.name;
    /* HALTEN, NICHT NUR STARTEN. `_clip()` läuft in JEDEM Bild und hat den Schussclip im nächsten
       Bild wieder auf `Idle_Gun` zurückgeschaltet — sichtbar war ein Zucken, kein Schuss (Georg
       06.09.: »Timing Sound/Schuss/Animation ist noch nicht sauber getimed«). Der Clip besitzt die
       Figur jetzt für seine eigene Länge; erst danach entscheidet das Tempo wieder. */
    this._schussHalt = (e.dur || 0.7) * 0.85;
    this._soll = 'schuss';
    this.zielt = Math.max(this.zielt || 0, (e.dur || 0.7) + (ant || 0));
    return e.name;
  }

  /** In eine Richtung schauen und dort bleiben (Zielen). `halten` in Sekunden. */
  blickAuf(dir, halten) {
    if (!dir) return;
    this.zielRichtung = { x: dir.x, z: dir.z };
    this.zielt = Math.max(this.zielt || 0, halten || 0.5);
  }

  /* Clipwahl nach Zustand und Tempo. Namen werden GESUCHT, nicht angenommen: das Rig bringt eigene
     Namen mit (FB: Idle · Walk · Run · Jump · Jump_Idle · Jump_Land · Run_Gun …).

     DER SPRUNG IST EINE KETTE, KEIN ZUSTAND (Georg 06.09.: »Sprunganimationen und so weiter die gibt
     es halt noch nicht« — richtig, die erste Fassung kannte nur idle/walk/run):
       Abdruck   `Jump`       einmal, nicht wiederholend
       Flug      `Jump_Idle`  solange er in der Luft ist
       Aufsetzer `Jump_Land`  einmal, danach zurück in die Bodenkette
     Bodenkette bleibt tempoabhängig: Idle unter 0,12 u/s, Walk bis Gehtempo, Run darüber. */
  _clip(t) {
    if (!this.fb || !this.fb.play) return;
    /* Der Schussclip gehört sich selbst, solange er läuft. */
    if (this._schussHalt > 0) { this._schussHalt -= 1 / 60; if (this._schussHalt > 0) return; this._soll = null; }
    const gehTempo = (this.tempoMax || SPEC.tempo).gehen;
    let soll;
    if (!this.amBoden) soll = this._abdruck > 0 ? 'jump' : 'air';
    else if (this._landen > 0) soll = 'land';
    else soll = t > gehTempo * 1.05 ? 'run' : (t > 0.12 ? 'walk' : 'idle');
    if (soll !== this._soll) {
      /* MIT WAFFE ANDERE HALTUNG. Solange gezielt/gefeuert wird, gilt die `*_Gun`-Reihe — FB hält
         die Arme vorn, und der Schuss kommt sichtbar aus der Hand statt aus der Mitte des Körpers. */
      const bewaffnet = (this.zielt || 0) > 0;
      const RE = bewaffnet ? {
        jump: /^jump$/i, air: /^jump_idle$/i, land: /^jump_land$/i,
        run: /^run_gun$/i, walk: /^walk_gun$/i, idle: /^idle_gun$/i
      } : {
        jump: /^jump$|^jump_start$/i, air: /^jump_idle$/i, land: /^jump_land$/i,
        run: /^run$/i, walk: /^walk$/i, idle: /^idle$/i
      };
      const e = this.fb.findClip(RE[soll]) || this.fb.findClip(/^idle$/i);
      if (e) {
        const einmal = soll === 'jump' || soll === 'land';
        this.fb.play(e.name, einmal ? { loop: false } : {});
        this.clipName = e.name;
      }
      this._soll = soll;
      this._bewaffnet = (this.zielt || 0) > 0;
    } else if (((this.zielt || 0) > 0) !== !!this._bewaffnet) {
      this._soll = null;   // Haltung wechselt, Zustand bleibt: beim nächsten Ruf neu wählen
    }
    /* Zeitraffung nur für die Bodenkette: ein Sprung hat kein Bodentempo, er hat eine Wurfhöhe.
       Sein Clip mit dem Lauftempo zu strecken wäre eine Zahl an der falschen Stelle. */
    if (this.fb.action && (this._soll === 'walk' || this._soll === 'run')) {
      const gemessen = this.ref && (this._soll === 'run' ? this.ref.run : this.ref.walk);
      const bezug = gemessen || (this._soll === 'run' ? SPEC.clipTempo.run : SPEC.clipTempo.walk);
      this.bezug = { wert: bezug, gemessen: !!gemessen };
      this.fb.action.timeScale = Math.max(0.35, Math.min(2.2, t / bezug));
      this.rate = +this.fb.action.timeScale.toFixed(3);
    } else if (this.fb.action) {
      this.fb.action.timeScale = 1;
      this.rate = 1;
    }
  }

  update(dt) {
    if (!this.aktiv || !this.root) return;
    if (this.time && this.time.state.phase !== 'play') return;
    const s = this.input.state;
    /* RENNEN GEHÖRT AUF SHIFT. Vorher rannte er, sobald er sich bewegte — damit war der Walk-Clip
       tot und Georgs Frage berechtigt: »für walk und (shift) run gibt es offenbar keine
       Differenzierung«. Jetzt: gehen ist der Normalfall, Shift ist die Entscheidung. */
    const laufen = !!s.sprint && !s.aim;
    this.schritt(dt, s.x, s.z, s.jumpPressed || s.jump, laufen);
    /* WURZEL = BODEN + FUSSVERSATZ, jedes Bild. Vorher stand hier `copy(this.pos)` — damit war der in
       `fbGroesse()` gemessene Versatz nach einem Bild wieder weg, FB stand 4,9 cm IN der Karte, und
       weil das Blatt atmet (±0,035 u), sank er zusätzlich ein und aus. Dieselbe Fehlerklasse wie beim
       gelben Kreis: eine feste Höhe über bewegtem Grund. */
    this.root.position.set(this.pos.x, this.pos.y + (this.fussOffset || 0), this.pos.z);
    /* NACHFÜHREN, NICHT EINMAL MESSEN. Der Fußversatz ist keine Konstante: die Animation hebt und
       senkt den Körper (Idle-Atmung, Schusspose), und das Blatt atmet zusätzlich ±0,035 u. Ein
       einmalig gemessener Wert war deshalb nach vier Atemzügen zwischen −0,067 und +0,053 u daneben
       (Kritiker 06.09.). Also ein kleiner Regelkreis: viermal je Sekunde die geskinnte Unterkante
       gegen den Boden messen und den Versatz ein Stück nachziehen — Totzone 5 mm, damit es nicht
       zappelt. *Wer auf bewegtem Grund steht, braucht keine Zahl, sondern eine Regelung.* */
    this._fussT = (this._fussT || 0) + dt;
    if (this._fussT >= 0.25) {
      this._fussT = 0;
      const T = this.THREE, box = new T.Box3();
      this.root.updateMatrixWorld(true);
      this.root.traverse((o) => { if (o.isSkinnedMesh) box.expandByObject(o); });
      if (!box.isEmpty()) {
        const d = this.field.floorY() - box.min.y;
        if (Math.abs(d) > 0.005) this.fussOffset = (this.fussOffset || 0) + d * 0.6;
      }
    }
    /* Drehung: ZIELEN hat Vorrang, dann Laufrichtung — und weich, eine Figur, die auf der Stelle
       schnappt, wirkt kaputt. Vorher drehte sie sich nur nach der Laufrichtung, deshalb schoss FB
       seitlich oder nach hinten (Georg 06.09.). */
    if (this.zielt > 0) this.zielt -= dt;
    let ziel = null;
    if (this.zielt > 0 && this.zielRichtung) ziel = Math.atan2(this.zielRichtung.x, this.zielRichtung.z);
    else if (this.tempo > 0.15) ziel = Math.atan2(this.vel.x, this.vel.z);
    if (ziel != null) {
      let d = ziel - this._blick;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      const tempo = this.zielt > 0 ? SPEC.drehTempo * 2 : SPEC.drehTempo;   // beim Zielen schneller herumkommen
      this._blick += Math.max(-tempo * dt, Math.min(tempo * dt, d));
      this.root.rotation.y = this._blick;
    }
    this._clip(this.tempo);
  }
  /**
   * BODEN C1: geseedeter Lauf über `sek` Sekunden bei festem Schritt. Zählt Bilder, in denen die
   * Position NACH der Korrektur außerhalb des Feldes liegt. Zustand wird gesichert und zurückgelegt.
   */
  probe(sek, dt) {
    const S = sek || 60, h = dt || 1 / 60;
    const vorher = { pos: this.pos.clone(), vel: this.vel.clone(), amBoden: this.amBoden, bounces: this.bounces, stuerze: this.stuerze, blick: this._blick, tempo: this.tempo, soll: this._soll, rate: this.rate };
    const b = this.field.bounds();
    this.reset(0, 0);
    let verstoesse = 0, schritte = 0, bounces0 = this.bounces, maxRaus = 0, ix = 0, iz = 0, spring = false, tempoSumme = 0;
    for (let t = 0; t < S; t += h) {
      /* Eingabe wechselt im Schnitt alle 0,4 s — lange genug, um in die Kante zu laufen. */
      if (schritte % 24 === 0) {
        ix = Math.round(this.rng() * 2) - 1;
        iz = Math.round(this.rng() * 2) - 1;
        spring = this.rng() < 0.08;
      }
      this.schritt(h, ix, iz, spring && schritte % 24 === 0, true);
      schritte++;
      tempoSumme += this.tempo;
      if (!this.field.inside(this.pos.x, this.pos.z)) {
        verstoesse++;
        const e = this.field.edgeNormal(this.pos.x, this.pos.z);
        maxRaus = Math.max(maxRaus, e.dist);
      }
    }
    const erg = { sek: S, schritte, verstoesse, bounces: this.bounces - bounces0, maxRaus: +maxRaus.toFixed(4), feld: +b.w.toFixed(2) + ' × ' + b.h.toFixed(2) + ' u', radius: +this.radius.toFixed(2), tempoMittel: +(tempoSumme / Math.max(1, schritte)).toFixed(3) };
    this.pos.copy(vorher.pos); this.vel.copy(vorher.vel); this.amBoden = vorher.amBoden;
    this.bounces = vorher.bounces; this.stuerze = vorher.stuerze; this._blick = vorher.blick;
    /* `tempo` GEHÖRT DAZU. Es stand nach der Probe auf dem letzten simulierten Lauftempo, während die
       Figur ruhte — und M9 las diesen Wert als lebendes Tempo: Walk-Referenz gepaart mit Run-Tempo,
       Rate in der Klemme, gemeldete 0,54. Der Kopf dieser Methode verspricht, die Welt nicht zu
       verändern; das gilt für JEDES Feld, das sie anfasst (Kritiker 06.09.). */
    this.tempo = vorher.tempo; this._soll = vorher.soll; this.rate = vorher.rate;
    if (this.root) this.root.position.copy(this.pos);
    this.log('Lauftest ' + S + ' s · ' + schritte + ' Schritte · ' + erg.bounces + ' Rand-Kontakte · Verstöße ' + verstoesse);
    return erg;
  }

  tor() { return { bestanden: this.aktiv ? 1 : 0, von: 1 }; }

  zeile() {
    if (!this.aktiv) return '[player] kein Körper gebunden';
    return '[player] ' + this.pos.x.toFixed(2) + ' / ' + this.pos.z.toFixed(2) + ' u · Tempo ' + this.tempo.toFixed(2) + ' u/s · '
      + (this.clipName || '–') + (this.rate ? ' ×' + this.rate + (this.bezug && this.bezug.gemessen ? ' (gemessen)' : ' (Annahme)') : '')
      + ' · Rand ' + this.bounces + ' · Stürze ' + this.stuerze + (this.amBoden ? '' : ' · in der Luft');
  }
}
