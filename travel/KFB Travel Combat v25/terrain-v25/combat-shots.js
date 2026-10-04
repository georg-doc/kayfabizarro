// ============================================================================
// combat-shots.js — KFB Travel Combat v25 · S2 · Geschosse + kleiner Sprite-Pool
// ----------------------------------------------------------------------------
// Zwei Dinge, die v20 nicht hat und der Kampf braucht: (1) Projektile mit Treffertest gegen
// Kugel-Hitboxen, Spieler und Boden; (2) ein Sprite-Pool, damit `kfb-hit-response` seinen Ring
// zeichnen kann (`emit(zelle, pos, opts)`) und Mündung/Einschlag ein Bild haben. Der Pool ist
// bewusst klein (64 Sprites, zwei Canvas-Texturen) — KEIN Nachbau von `kfb-fx-sprites.js`
// (Instanced, Atlas). Wenn das Blatt ins Repo kommt, ist der Tausch eine Zeile in `emit`.
//
// Silhouetten (kfb-combat-def AMMO, M11 „Silhouette vor Farbe"): Spieler = Komet (Kuppe vorn,
// Schweif), Gegner = Kugel. Zufall gesät (`rng` herein). Zeit nur aus `dt`.
// ============================================================================

import { AMMO, ENERGY, SURFACES } from '../modules/kfb-combat-def.js';

export function createCombatShots(o) {
  const THREE = o.THREE, scene = o.scene, rng = o.rng;
  const QUELLE = {
    maxSchuss: 48,     // 6 Gegner × ~2 Kugeln + Spieler-Dauerfeuer 9/s × 3,2 s Lebensdauer ≈ 40
    sprites: 64,
    leben: 3.2,        // s · Flugzeit bis zum Verfall (Stinger 78 u/s → 250 u)
    grav: 22,          // u/s² für Bogenwaffen (acid, mortar) — v8 `vy`-Kurve
    /* v25 · Der Avatar ist 3,2 u hoch (mech-avatar `hoehe`, gegen den Gegner-Roster gerechnet).
       Der Trefferradius war auf 2,0 u ausgelegt (1,3 ≈ 0,65 × Höhe) und hätte den gewachsenen
       Körper zur Hälfte durchlöchert — Gegnerkugeln wären sichtbar durch die Beine gegangen.
       0,52 × 3,2 = 1,66: eine Kugel um Brust und Rumpf, nicht um die ganze Silhouette (die Beine
       sind dünn, ein Treffer dort zählt nicht). Wer `hoehe` dreht, dreht das hier mit. */
    spielerR: 1.66,
  };
  const P = Object.assign({}, QUELLE, o.params || {});
  const group = new THREE.Group(); group.name = 'combat-shots';
  const zaehler = { gefeuert: 0, treffer: 0, spieler: 0, boden: 0, verfallen: 0, emits: 0, poolVoll: 0, spur: 0, huepfer: 0, emitsMax: 0 };

  // ── Texturen: weicher Punkt und Ring, je einmal
  function tex(ring) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    if (!ring) {
      const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    } else {
      g.strokeStyle = 'rgba(255,255,255,1)'; g.lineWidth = 6; g.beginPath(); g.arc(32, 32, 24, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 12; g.beginPath(); g.arc(32, 32, 24, 0, Math.PI * 2); g.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const TEX = { punkt: tex(false), ring: tex(true) };

  // ── Sprite-Pool
  const pool = [];
  for (let i = 0; i < P.sprites; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.punkt, transparent: true, depthWrite: false, opacity: 0 }));
    s.visible = false; s.userData.live = 0; group.add(s); pool.push(s);
  }
  const _vel = new THREE.Vector3();
  /* v25 · **Zellnamen der Kit-Module.** `kfb-weapon-eyeball` und `kfb-fx-*` bestellen Zellen aus
     dem Atlas-Blatt (`burst star puff spark | splat ring streak shard smoke`). Dieser Pool hat
     zwei Texturen — also wird ABGEBILDET und nicht nachgebaut, und die Abbildung steht hier statt
     verstreut in den Aufrufern. `add` ist Teil der Zelle: ein Rauch- oder Scherbenpuff, der
     ADDITIV auf hellen Sand läuft, clippt in allen drei Kanälen und kommt als weißer Fleck heraus
     (derselbe Fund, der in der Schussbahn die Regenbogenspur gekostet hat). Wer additiv will,
     sagt `add: true` — die Zelle rät nicht. */
  const ZELLEN = {
    ring: { tex: 'ring', add: true }, splat: { tex: 'ring', add: false },
    punkt: { tex: 'punkt', add: true }, star: { tex: 'punkt', add: true },
    burst: { tex: 'punkt', add: true }, spark: { tex: 'punkt', add: true },
    streak: { tex: 'punkt', add: true },
    smoke: { tex: 'punkt', add: false }, puff: { tex: 'punkt', add: false },
    shard: { tex: 'punkt', add: false },
  };
  /** emit(zelle, pos, { color, size, size1, life, add, op, vel, grav, drag, rot, spin, pop, fade }) → Sprite | null */
  function emit(zelle, pos, op) {
    const s = pool.find((x) => !x.visible);
    if (!s) { zaehler.poolVoll++; return null; }
    op = op || {};
    const Z = ZELLEN[zelle] || ZELLEN.punkt;
    const m = s.material;
    m.map = TEX[Z.tex];
    m.blending = (op.add == null ? Z.add : op.add !== false) ? THREE.AdditiveBlending : THREE.NormalBlending;
    m.color.setHex(op.color == null ? 0xffffff : op.color);
    m.rotation = op.rot || 0;
    m.opacity = op.op == null ? 0.9 : op.op;
    s.position.copy(pos);
    const u = s.userData;
    u.life = u.life0 = Math.max(0.03, op.life || 0.2);
    u.size0 = op.size || 0.5; u.size1 = op.size1 != null ? op.size1 : (op.size || 0.5) * (op.grow || 1);
    u.op0 = m.opacity; u.vel = op.vel ? op.vel.clone() : null; u.grav = op.grav || 0; u.drag = op.drag || 0;
    // v25 · `spin` dreht die Kachel über ihr Leben, `fade` beugt die Deckungskurve (1 = linear,
    // >1 = hält länger und fällt spät), `pop` setzt die Größe im ersten Bild fast auf Ziel.
    u.spin = op.spin || 0; u.fade = op.fade || 2;
    const k0 = op.pop ? 0.85 : 0;
    s.scale.setScalar(u.size0 + (u.size1 - u.size0) * k0); s.visible = true;
    zaehler.emits++;
    const belegt = pool.reduce((n, x) => n + (x.visible ? 1 : 0), 0);
    if (belegt > zaehler.emitsMax) zaehler.emitsMax = belegt;
    return s;
  }
  function scatter(pos, n, op) {
    for (let i = 0; i < n; i++) {
      _vel.set(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize().multiplyScalar(op.spread || 1);
      if (op.dir) _vel.add(op.dir);
      _vel.normalize().multiplyScalar((op.speed || 6) * (0.6 + rng() * 0.8));
      emit(op.zelle || 'punkt', pos, Object.assign({}, op, { vel: _vel, size: (op.size || 0.2) * (0.7 + rng() * 0.6), life: (op.life || 0.3) * (0.7 + rng() * 0.6) }));
    }
  }
  function stepSprites(dt) {
    for (const s of pool) {
      if (!s.visible) continue;
      const u = s.userData; u.life -= dt;
      if (u.life <= 0) { s.visible = false; continue; }
      const k = 1 - u.life / u.life0;
      s.scale.setScalar(u.size0 + (u.size1 - u.size0) * k);
      s.material.opacity = u.op0 * (1 - Math.pow(k, u.fade || 2));
      if (u.spin) s.material.rotation += u.spin * dt;
      if (u.vel) { u.vel.y -= u.grav * dt; if (u.drag) u.vel.multiplyScalar(Math.pow(u.drag, dt)); s.position.addScaledVector(u.vel, dt); }
    }
  }

  // ── Geschosse
  const geoKugel = new THREE.SphereGeometry(1, 10, 8);
  const shots = [];
  function mat(color, op, add) {
    return new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, depthWrite: !add });
  }
  /** fire({ from, dir, w (WEAPONS-Zeile), mine, seed, splashAt, mesh, roll, spur, huepfer }) → shot | null
   *  v25 · Drei zusätzliche, ALLE optional — wer sie nicht setzt, bekommt genau das Verhalten von v24:
   *    `mesh`     eine fertige Group vom Waffenmodul (Augapfel). Dann baut dieser Pool keinen Körper.
   *    `spur`     { schritt, mal(at, i, dir) } — Puff je STRECKE, nicht je Bild (sonst hängt die
   *               Dichte am Bildtakt und Zeitlupe zeigte eine andere Spur).
   *    `huepfer`  { n, keep, fadeMs, auf(at, nrm, i) } — Fehlschuss setzt auf, statt zu verschwinden. */
  function fire(f) {
    if (shots.length >= P.maxSchuss) { zaehler.poolVoll++; return null; }
    const w = f.w, A = AMMO[w.ammo] || AMMO.streak;
    const m = f.mesh || new THREE.Group();
    if (!f.mesh) {
      if (f.mine) {
      // Komet: Kuppe vorn (Kugel), Schweif nach hinten (gestreckte Kugel, additiv, dünner)
      const kuppe = new THREE.Mesh(geoKugel, mat(w.color, 1, false)); kuppe.scale.set(A.wid * 0.5, A.wid * 0.5, A.wid * 0.55);
      const schweif = new THREE.Mesh(geoKugel, mat(w.flash || 0xffffff, 0.7, true)); schweif.scale.set(A.wid * 0.3, A.wid * 0.3, A.len * 0.5); schweif.position.z = A.len * 0.45;
      const kern = new THREE.Mesh(geoKugel, mat(0xffffff, 0.9, true)); kern.scale.setScalar(A.wid * 0.28); kern.position.z = -A.wid * 0.1;
      m.add(kuppe, schweif, kern);
      } else {
        const s = f.bs || 1;
        const shell = new THREE.Mesh(geoKugel, mat(w.color, 0.9, false)); shell.scale.setScalar(A.wid * 0.5 * s);
        const core = new THREE.Mesh(geoKugel, mat(0xf4fbff, 0.95, true)); core.scale.setScalar(A.wid * 0.3 * s);
        m.add(shell, core);
      }
    }
    m.position.copy(f.from);
    m.lookAt(_vel.copy(f.from).sub(f.dir));   // −Z zeigt in Flugrichtung → Kuppe vorn
    group.add(m);
    /* ═══ v25.2 · DAS GESCHOSS ERBT DIE FAHRT DES SCHÜTZEN ═══════════════════════════
       Georgs Befund (05.09.): „mit der Sekundärwaffe (Nest Rocket) sechsmal nacheinander am
       Ziel-Enemy vorbeigeschossen" — und derselbe Fehler war in Mech Slice v1/v2 schon einmal
       dokumentiert. Er ist gerechnet, nicht Gespür:
         Rakete 34 u/s · Reisetempo bis ~40 u/s · Aggro-Mobs hängen 26 u VOR dem Spieler und
         fliegen mit ihm.
       Ohne Erbe ist die Rakete im Weltrahmen 34 u/s schnell, das Ziel aber 40 — die
       Annäherungsrate ist **−6 u/s**. Sie fällt zurück und kann NIE treffen, egal wie gut gezielt
       ist. Der Stinger (78 u/s) netto +38 u/s trifft, deshalb fiel es nur an der Sekundärwaffe auf.
       In einem Flugzeug trägt eine abgefeuerte Rakete die Fahrt des Flugzeugs. Genau das fehlte:
       `vel = dir × speed + erbe`. Damit ist `w.speed` die Geschwindigkeit RELATIV zum Schützen —
       so, wie die Waffenzeile sie immer gemeint hat, und so, wie der Vorhalt sie rechnet. */
    const vel = f.dir.clone().multiplyScalar(w.speed);
    if (f.erbe) vel.add(f.erbe);
    const shot = { mesh: m, pos: m.position, vel, w, mine: !!f.mine, life: P.leben,
                   arc: !!w.arc, splash: w.splash || 0, seed: f.seed, e: f.e || null, bs: f.bs || 1, prev: f.from.clone(),
                   probe: !!f.probe, roll: !!f.roll, spur: f.spur || null, huepfer: f.huepfer || null,
                   frei: !!f.frei,   // v25.2c · ohne Ziel gefeuert — der Wirt macht daraus eine Welle
                   strecke: 0, spurN: 0, hops: 0, fade: 0 };
    shots.push(shot); zaehler.gefeuert++;
    return shot;
  }
  function kill(shot) { group.remove(shot.mesh); const i = shots.indexOf(shot); if (i >= 0) shots.splice(i, 1); }

  const _p0 = new THREE.Vector3(), _seg = new THREE.Vector3(), _c = new THREE.Vector3(), _q = new THREE.Vector3(), _cp = new THREE.Vector3();
  /** Segment p0→p1 gegen Kugel (c, r): Trefferpunkt oder null. `c` wird NICHT verändert (Kratzvektor `_cp`). */
  function segKugel(p0, p1, c, r) {
    _seg.copy(p1).sub(p0); const L2 = _seg.lengthSq();
    const t = L2 > 1e-9 ? Math.max(0, Math.min(1, _cp.copy(c).sub(p0).dot(_seg) / L2)) : 0;
    _q.copy(p0).addScaledVector(_seg, t);
    return _q.distanceToSquared(c) <= r * r ? _q.clone() : null;
  }

  /**
   * update(dt, { hitboxes: Mesh[], spieler: Vector3|null, groundHeightAt })
   * → { treffer: [{ shot, e, punkt, richtung }], spieler: [{ shot, punkt }], boden: [{ shot, punkt }] }
   */
  function update(dt, ctx) {
    stepSprites(dt);
    const out = { treffer: [], spieler: [], boden: [] };
    const hb = ctx.hitboxes || [];
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.life -= dt;
      if (s.life <= 0) { zaehler.verfallen++; kill(s); continue; }
      // v25 · Verblassen nach dem letzten Aufsetzer: der Augapfel liegt noch da und geht dann.
      // Er bewegt sich dabei nicht mehr und trifft nichts mehr — sonst wäre es ein zweites Leben.
      if (s.fade > 0) {
        s.fade -= dt;
        const k = Math.max(0, s.fade / (s.fade0 || 1));
        s.mesh.scale.setScalar(0.25 + 0.75 * k);
        if (s.fade <= 0) kill(s);
        continue;
      }
      s.prev.copy(s.pos);
      if (s.arc) { s.vel.y -= P.grav * dt; s.mesh.lookAt(_p0.copy(s.pos).sub(s.vel)); }
      s.pos.addScaledVector(s.vel, dt);
      if (!s.mine && s.mesh.children[0]) s.mesh.children[0].rotation.y += dt * 6;
      // v25 · Der Augapfel ROLLT um seine Flugachse — die Pupille wandert dabei durchs Bild, und
      // genau daran erkennt man, dass ein Auge fliegt und kein Ball.
      if (s.roll) s.mesh.rotateZ(dt * 7.5);
      // v25 · Spur nach STRECKE. `spurN` ist die laufende Nummer (der Regenbogen hängt daran),
      // nicht die Zeit — damit zeigt Zeitlupe denselben Verlauf wie Echtzeit.
      if (s.spur && s.spur.mal) {
        s.strecke += _p0.copy(s.pos).sub(s.prev).length();
        const schritt = Math.max(0.05, s.spur.schritt || 0.35);
        // v25 · **Deckel je Schuss, und er ist eine Sicherung, kein Geschmack.** GEMESSEN am
        // 05.09.: ohne Deckel stießen 10 Würfe 1718 Puffe aus (172 je Wurf statt der gerechneten
        // 34) — die Spur läuft die GANZE Flugzeit, und die ist hier 3,2 s statt 0,62 s wie auf der
        // Schussbahn, Aufsetzer und Ausrollen mitgerechnet. Der Pool war 905× voll.
        const deckel = s.spur.max || 0;
        let wache = 0;
        while (s.strecke >= schritt && wache++ < 6 && (!deckel || s.spurN < deckel)) {
          s.strecke -= schritt;
          _seg.copy(s.vel).normalize();
          s.spur.mal(s.pos, s.spurN++, _seg);
          zaehler.spur++;
        }
      }
      let hit = false;
      if (s.mine) {
        for (const h of hb) {
          h.getWorldPosition(_c);
          const p = segKugel(s.prev, s.pos, _c, (h.userData.hr || 1) + 0.15);
          if (p) { out.treffer.push({ shot: s, e: h.userData.enemy, punkt: p, richtung: s.vel.clone().normalize() }); zaehler.treffer++; hit = true; break; }
        }
      } else if (ctx.spieler) {
        const p = segKugel(s.prev, s.pos, ctx.spieler, P.spielerR);
        if (p) { out.spieler.push({ shot: s, punkt: p, richtung: s.vel.clone().normalize() }); zaehler.spieler++; hit = true; }
      }
      if (!hit && ctx.groundHeightAt) {
        const gy = ctx.groundHeightAt(s.pos.x, s.pos.z);
        if (s.pos.y <= gy) {
          s.pos.y = gy + 0.05;
          // v25 · **Fehlschuss setzt auf, statt zu verschwinden** (Zusage der Augapfel-Waffe).
          // Die Bodennormale ist hier bewusst (0,1,0): die Würfellandschaft hat pro Ort keine
          // Flächennormale, die billig zu haben wäre, und ein Aufsetzer braucht sie nicht — er
          // braucht ein Oben. Steht in der Zeile, damit es niemand für eine Lücke hält.
          const H = s.huepfer;
          if (H && s.hops < (H.n || 0)) {
            s.hops++; zaehler.huepfer++;
            s.vel.y = Math.abs(s.vel.y) * (H.keep == null ? 0.52 : H.keep);
            s.vel.x *= 0.72; s.vel.z *= 0.72;
            if (H.auf) H.auf(s.pos, _p0.set(0, 1, 0), s.spurN);
            continue;
          }
          if (H) {
            // Aufsetzer verbraucht: liegen bleiben und verblassen (kein Treffer-Ereignis mehr).
            s.fade = s.fade0 = (H.fadeMs || 420) / 1000; s.vel.set(0, 0, 0);
            if (H.auf) H.auf(s.pos, _p0.set(0, 1, 0), s.spurN);
            continue;
          }
          out.boden.push({ shot: s, punkt: s.pos.clone(), richtung: s.vel.clone().normalize() }); zaehler.boden++; hit = true;
        }
      }
      if (hit && !(s.w.pierce && out.treffer.length && !out.boden.length)) kill(s);
    }
    return out;
  }

  /** Mündung: Stern + Funken in Waffenfarbe, Fenster aus der Waffe (muzMs/muzSize). */
  function muendung(pos, dir, w) {
    emit('punkt', pos, { color: w.flash || 0xffffff, size: (w.muzSize || 0.8) * 0.9, size1: (w.muzSize || 0.8) * 1.6, life: (w.muzMs || 50) / 1000, op: 0.95 });
    scatter(pos, 3, { color: w.color, dir, spread: 0.45, speed: 9, size: 0.16, life: 0.12 });
  }
  /** Einschlag nach Zellenprofil (resolveImpact): ein primäres Signal + höchstens zwei sekundäre. */
  function einschlag(pos, dir, zelle, E, skala) {
    const k = skala || 1;
    emit(zelle.cell === 'ring' ? 'ring' : 'punkt', pos, { color: E ? E.hot : 0xfff3cf, size: 0.5 * zelle.size * k, size1: 1.9 * zelle.size * k, life: zelle.t * 0.5, op: 0.95 });
    const sec = zelle.sec || [];
    if (sec[0]) scatter(pos, sec[0][1] + 1, { color: zelle.tint, dir: _vel.copy(dir).negate(), spread: 0.9, speed: 7, size: 0.22 * k, life: 0.35, grav: 14, drag: 0.5 });
    if (sec[1]) scatter(pos, sec[1][1], { color: 0x6b625a, add: false, spread: 0.6, speed: 1.4, size: 0.7 * k, life: 0.8, op: 0.4, grow: 2.2, drag: 0.6 });
  }

  return { name: 'combat-shots', group, params: P, quelle: QUELLE, zaehler, emit, scatter, fire, update, muendung, einschlag, get anzahl() { return shots.length; },
    /** v25.2r · Wie viele Sprites GERADE belegt sind. `emitsMax` ist ein Zähler und lügt, sobald
     *  ihn jemand nullt; das hier ist der Zustand selbst — die Zahl, die über den Pool entscheidet. */
    get belegt() { let n = 0; for (const s of pool) if (s.visible) n++; return n; },
    abweichungen() { const out = []; for (const k in QUELLE) if (QUELLE[k] !== P[k]) out.push({ feld: k, quelle: String(QUELLE[k]), ist: String(P[k]) }); return out; },
    zeile() { return 'combat-shots · ' + zaehler.gefeuert + ' gefeuert · ' + zaehler.treffer + ' Treffer · ' + zaehler.spieler + ' am Spieler · ' + zaehler.boden + ' Boden · ' + zaehler.huepfer + ' Aufsetzer · ' + zaehler.spur + ' Spurpuffe · ' + zaehler.emits + ' Sprites (Spitze ' + zaehler.emitsMax + '/' + P.sprites + ')' + (zaehler.poolVoll ? ' · Pool voll ×' + zaehler.poolVoll : ''); } };
}
