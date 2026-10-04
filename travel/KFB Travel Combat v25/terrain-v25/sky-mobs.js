// ============================================================================
// sky-mobs.js — KFB Travel Combat v24 · S2 · Gegner in 3er-Mobs, Aggro erst nach Treffer
// ----------------------------------------------------------------------------
// Georgs Vorgaben (04.09.): „es fliegen in Sicht-/Schussweite im FOV zufällige enemies in 3er
// mobs herum · enemies greifen nicht an, bis der spieler eine von ihnen trifft · 3er-Mob: gleiche Art."
//
// Quelle des Verhaltens: `KFB Mech Slice v8.dc.html` — _spawnDrone (#2305), _stepEnemies (#3697:
// Slot-Anker, Chill-Kurve, Token, Windup/Headbutt-Tell), _stepFlyerDeath (#2424: hang · fall ·
// impact · settle). Die Zahlen stehen in MOB_QUELLE mit Herkunft. Was hier NEU ist: der Ruhezustand
// (Mob wandert ohne Aggro) und die Mob-Klammer (drei Körper, EIN Zustand).
//
// Eigentum: dieses Modul besitzt `e.ruhe` (die Ruhelage jedes Gegners). Die sichtbare Position
// schreibt der WIRT: `e.g.position = e.ruhe + knock` (EINBAU §3 D — der Versatz kommt aus dem
// Kampfmodul heraus, das Modul schreibt nie selbst). Hier wird nur `ruhe` bewegt.
// Zufall: GESEEDET, `rng` kommt herein. Kein Math.random in dieser Datei.
// Ton: keiner. Gegner-Spawn ist stumm (v8-Befund „Dauer-Xylophon"); der Wirt klingt beim Schuss.
// ============================================================================

import { ENEMIES } from '../modules/kfb-combat-def.js';   // v24: der ganze Roster, `READY` reicht nicht mehr (siehe `load`)
import { loadGLTF } from './mech-avatar.js';

/** Herleitung jeder Zahl, damit der Wert nicht als Meinung dasteht. */
export const MOB_QUELLE = Object.freeze({
  mobs: 2,          // gleichzeitig lebende Mobs → 6 Körper; v8 lief mit 3–5 Gegnern bei 60 fps
  groesse: 3,       // Georg: 3er-Mob
  scale: 1.05,      /* v25 · 5.9. · **Ein Drittel kleiner** (Georg: „die enemies sind im Vergleich zum
  //   mech ca 1/3 zu groß"). Bei 1,6 stand der Flieger auf 1,70 × 1,6 = 2,72 u und die Monster auf
  //   2,56 u — gegen einen 3,2-u-Mech ist das kein Größenunterschied, den man sieht, und im Anflug
  //   füllte ein Gegner mehr Bild als der Spieler. 1,05 ergibt Flieger 1,79 u, Monster 1,68 u,
  //   Winzling 0,86 u — der Mech ist damit ×1,79 so hoch wie der größte Flieger, also klar die
  //   Hauptfigur. Der Trefferradius folgt automatisch (`hr` rechnet mit `h × scale`). */
  spawnNah: 110, spawnFern: 190,   // v24 · 5.9. · Georg: „die mobs sollten nicht um mich herum
  //   schweben, sondern beim reisen/flug in der szene/am horizont auftauchen". Vorher 45–85 u — das
  //   ist bei fov 54 schon halbe Bildhöhe, sie STANDEN also im Bild, statt darin aufzutauchen. Der
  //   Horizont dieser Welt liegt bei ~520 u; 110–190 u ist die Zone, in der ein 2,7-u-Körper als
  //   Punkt am Gelände erscheint und beim Anflug wächst. Schussweite ist gedeckt (62–165 u/s × 3,2 s).
  spawnKegel: 0.55, // rad halber Kegel um die Fahrtrichtung: im FOV (horizontal ≈ 0,7 rad bei 16:9)
  hoeheMin: 4, hoeheMax: 14,     // über Grund; Reiseflug liegt bei ~6–12 u über Grund
  drift: 4,         // u/s Wandern im Ruhezustand (v8 Anker-Sinus 0,7/s × 1,4 u ≈ langsam)
  jagd: 9,          // u/s Anflug auf den Slot bei Aggro (v8 lerp 1−0,22^dt ≈ 1,5/s Zeitkonstante)
  abstand: 26,      // Slot-Abstand vor dem Spieler bei Aggro (v8: 13 m bei Mech 3,5 m; v24: 26 — bei 16 u
  //   hängen drei Körper vor der Kamera statt in der Szene; „sicht: 30" bleibt die Feuergrenze)
  sicht: 30,        // Feuern nur unter dieser Distanz (v8: 26)
  fireMin: 5.4, fireMax: 7.6,    // v8 Chill-Kurve: „eine Kugel, der man weglaufen kann"
  token: 1.5,       // Gruppen-Feuerpause (v8)
  windup: 0.5,      // Ankündigung vor dem Schuss (v8)
  weg: 300,         // Despawn hinter dem Spieler / außerhalb der Reichweite. MUSS über `spawnFern`
  //   liegen — sonst entsorgt der nächste Takt, was der Spawn gerade vorn hingesetzt hat.
  respawn: 3.5,     // s nach Mob-Ende bis der nächste Mob vorn erscheint
  wackel: 0.85, wackelAbklang: 5.0,   // Trefferwackeln (tinyskies via sky-enemies.js)
  /* ═══ v25 · 5.9. · MINDESTABSTAND ZUR KAMERA ══════════════════════════════════════
     Georg: „enemies fliegen so bzw. durch in die Kamera, dass man im Modell steckt". Ursache: KEIN
     Körper hier kannte die Kamera. Im Ruhezustand wandert ein Mob auf seinem Anker, und der Spieler
     fliegt mit 40 u/s auf ihn zu — niemand weicht aus, also durchdringen sie sich. Bei Aggro liegt
     der Slot bei 26 u vor dem SPIELER, aber die Kamera steht dahinter und schwenkt; in einer engen
     Kurve kommt ein Mob trotzdem in die Nahebene.
     Die Antwort ist eine LÄNGE, keine Kollisionsabfrage: unterschreitet ein Körper diesen Radius um
     die KAMERA, wird seine Ruhelage radial nach außen geschoben — also von der Kamera weg, nicht
     vom Spieler. Wer die Kamera meint, muss die Kamera messen (dieselbe Lehre wie „frag das Objekt
     nach seinen Maßen", v13-Regel 1).
     8 u: die Nahebene liegt bei 0,1 u, ein Gegner ist bis 1,8 u groß, und die Follow-Kamera sitzt
     rund 9 u hinter dem Mech. 8 u hält einen Körper sicher vor der Linse und noch im Bild — er
     wird geschoben, nicht weggezaubert. */
  kameraMin: 8,
  //   Und die Zahl wird GEZÄHLT: `zaehler.geschoben` sagt, wie oft es nötig war. Steigt sie in die
  //   Tausende, ist der Spawn falsch und nicht der Radius.
});

export function createSkyMobs(o) {
  const THREE = o.THREE;
  // Loader und SkeletonUtils kommen aus dynamischen Imports — deshalb LAZY gelesen (`o.loader`), nicht beim Bau kopiert.
  const loader = () => o.loader, skinClone = (root) => o.skinClone(root);
  const groundHeightAt = o.groundHeightAt || (() => 0);
  // v24/S3 · Die Gegner gehen durch DIESELBE Beleuchtungs-Registrierung wie Pet und Mech
  // (pet-lighting: Env, Tint, Rim). Vorher waren sie die einzigen Akteure ohne — deshalb standen
  // sie als dunkle Flecken vor einer hellen Welt („enemies sind kaum zu erkennen", Georg 4.9.).
  const register = o.register || (() => {});
  const rng = o.rng || (() => { throw new Error('sky-mobs: rng fehlt (gesät, nie Math.random)'); });
  const P = Object.assign({}, MOB_QUELLE, o.params || {});
  const group = new THREE.Group(); group.name = 'sky-mobs';
  const kinds = [];           // geladene Arten
  const mobs = [];            // { kind, e: [], aggro, anker, ziel, heading, token, t }
  const alle = [];            // alle Gegner (lebend + sterbend)
  const zaehler = { spawns: 0, kills: 0, mobsGespawnt: 0, mobsGeleert: 0, feuer: 0, aggro: 0, geschoben: 0, naeheMin: 999 };
  let respawnT = 0, frustum = null, fm = null;
  const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _f = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);

  async function load() {
    // v24 · 5.9. · **Der Pool ist alles, was FLIEGT und wirklich läuft** — nicht nur die drei
    // Space-Kit-Gegner. Georg: „es erscheinen immer die gleichen grünen enemy mobs … alle
    // verfügbaren in pool."
    // Warum die 17 Monster nicht drin waren: sie stehen im Roster mit `ready:false`, und
    // `kfb-combat-def` §4 sagt ausdrücklich, warum — ihre CLIPNAMEN wurden nie gemessen, der Befund
    // „teilen die Clip-Grammatik exakt" kam aus einer Tree-Abfrage. Der Weg ist also nicht, das Flag
    // umzuschreiben, sondern die Messung nachzuholen: laden, Clipnamen lesen, auf unsere vier Rollen
    // abbilden, und nur aufnehmen, wer eine Ruhe-Animation hergibt. Wer durchfällt, wird GENANNT.
    //
    // Und in ZWEI Stufen: die drei gemessenen zuerst und `await`, damit der Kampf sofort Gegner hat
    // („auch zum start"); die 17 danach EINZELN im Hintergrund — zwanzig parallele GLTF-Ladungen im
    // Startfenster würden mit dem Geländeaufbau um dieselbe Leitung streiten.
    await ladeGruppe(ENEMIES.filter((k) => k.air && k.ready && k.clipSet === 'spacekit'));
    nachladen(ENEMIES.filter((k) => k.air && !k.ready));
    return kinds.length;
  }

  /** Clipnamen → unsere vier Rollen. Reihenfolge = Vorrang: erst der exakte Space-Kit-Name, dann
   *  immer allgemeinere Muster. Ohne `idle` ist ein Flieger nicht brauchbar — ein Gegner, der in
   *  T-Pose durch die Luft rutscht, ist schlimmer als einer, der fehlt. */
  const ROLLEN = {
    idle: [/^flying_idle$/i, /idle/i, /hover|float|fly/i],
    fast: [/^fast_flying$/i, /fast|dash|run/i, /fly/i],
    tell: [/^headbutt$/i, /attack|bite|punch|cast|shoot|spit/i],
    die: [/death|die$/i],
  };
  function rolleFinden(namen, muster) {
    for (const m of muster) { const t = namen.find((n) => m.test(n)); if (t) return t; }
    return null;
  }

  async function ladeGruppe(liste) {
    const res = await Promise.allSettled(liste.map((k) => loadGLTF(loader(), k.file)));
    const v = new THREE.Vector3(), box = new THREE.Box3();
    const abgelehnt = [];
    res.forEach((r, i) => {
      const K = liste[i];
      if (r.status !== 'fulfilled') { abgelehnt.push(K.name + ' (nicht geladen)'); return; }
      const g = r.value;
      g.scene.updateMatrixWorld(true);   // v8-Befund: ohne das misst Box3 25 % zu wenig
      box.setFromObject(g.scene); box.getSize(v);
      const clips = {}; (g.animations || []).forEach((c) => { clips[c.name.split('|').pop()] = c; });
      const namen = Object.keys(clips);
      const map = {
        idle: rolleFinden(namen, ROLLEN.idle),
        fast: rolleFinden(namen, ROLLEN.fast),
        tell: rolleFinden(namen, ROLLEN.tell),
        die: rolleFinden(namen, ROLLEN.die),
      };
      if (!map.idle) { abgelehnt.push(K.name + ' (keine Ruhe-Animation in [' + namen.join(', ') + '])'); return; }
      if (!map.fast) map.fast = map.idle;
      kinds.push(Object.assign({}, K, { src: g, clips, map, anims: g.animations || [], hRaw: v.y,
        hWant: K.h * P.scale, sc: v.y > 0.01 ? (K.h * P.scale) / v.y : 1 }));
      console.info('[mobs] + ' + K.name + ' · ' + namen.length + ' Clips · '
        + (K.h * P.scale).toFixed(2) + ' u · Rollen ' + JSON.stringify(map));
    });
    if (abgelehnt.length) console.warn('[mobs] abgelehnt: ' + abgelehnt.join(' · '));
    return kinds.length;
  }

  /** Nachschub, EINER nach dem anderen. Kein `await` von außen: der Pool wächst während gespielt
   *  wird, und der Respawn (3,5 s) greift dann von selbst auf das größere Angebot. */
  async function nachladen(liste) {
    for (const K of liste) { try { await ladeGruppe([K]); } catch (e) { /* ladeGruppe meldet selbst */ } }
    console.info('[mobs] Pool vollständig: ' + kinds.length + ' Arten · ' + kinds.map((k) => k.name).join(', '));
  }

  function spawnMob(spieler, forward) {
    if (!kinds.length) return null;
    const wuerfelArt = () => kinds[Math.floor(rng() * kinds.length) % kinds.length];
    const K0 = wuerfelArt();
    // Ort: vor dem Spieler im Kegel, über Grund
    const a = (rng() * 2 - 1) * P.spawnKegel, d = P.spawnNah + rng() * (P.spawnFern - P.spawnNah);
    _f.copy(forward).setY(0).normalize().applyAxisAngle(_up, a);
    const cx = spieler.x + _f.x * d, cz = spieler.z + _f.z * d;
    const cy = Math.max(groundHeightAt(cx, cz) + P.hoeheMin + rng() * (P.hoeheMax - P.hoeheMin), spieler.y - 4 + rng() * 10);
    const mob = { kind: K0, e: [], aggro: false, anker: new THREE.Vector3(cx, cy, cz), ziel: new THREE.Vector3(cx, cy, cz),
                  heading: rng() * Math.PI * 2, token: 0, t: rng() * 6, id: zaehler.mobsGespawnt++ };
    // v24 · 5.9. · **Die Art wird JE KÖRPER gewürfelt, nicht je Mob.** Vorher zog `spawnMob` einmal
    // und klonte dreimal dasselbe Modell — bei drei Arten im Pool waren damit zwei von drei Mobs
    // uniform, und mit dem eingefrorenen Seed immer dieselben. Ein gemischter Mob ist auch
    // spielbar besser: drei HP-Werte, drei Trefferradien, drei Silhouetten.
    // Der erste Körper behält `K0` — er ist der Anführer und steht vorn in der Formation.
    for (let i = 0; i < P.groesse; i++) {
      const K = i === 0 ? K0 : wuerfelArt();
      const g = new THREE.Group();
      const vis = skinClone(K.src.scene);
      vis.traverse((n) => { if (n.isSkinnedMesh) n.frustumCulled = false; if (n.isMesh && n.material) { n.material = n.material.clone(); n.castShadow = true; } });
      register(vis);   // NACH dem Klonen der Materialien: der Haken gehört den neuen, nicht den geteilten
      vis.scale.setScalar(K.sc);
      g.add(vis);
      const mix = new THREE.AnimationMixer(vis), act = {};
      // Die Clipnamen kommen aus der MESSUNG beim Laden (`K.map`), nicht aus dieser Datei: die 17
      // Monster heißen ihre Ruhelage nicht `Flying_Idle`, und ein hart geschriebener Name wäre
      // genau der stille Fehlschlag, der sie als T-Pose durch die Luft schieben würde.
      const bind = (key, once) => { const n = K.map && K.map[key]; const c = n && K.clips[n]; if (!c) return; const ac = mix.clipAction(c); if (once) { ac.loop = THREE.LoopOnce; ac.clampWhenFinished = true; } act[key] = ac; };
      bind('idle'); bind('fast'); bind('tell', true); bind('die', true);
      if (act.idle) { act.idle.time = rng() * (act.idle.getClip() ? act.idle.getClip().duration : 1); act.idle.play(); }
      // Formation: Dreieck um den Anker, ein Körper vorn
      const fo = new THREE.Vector3([0, -3.2, 3.2][i] || 0, [1.2, -0.6, -0.6][i] || 0, [-2.4, 1.6, 1.6][i] || 0);
      const ruhe = mob.anker.clone().add(fo);
      g.position.copy(ruhe);
      // Hitbox: Körpermitte gemessen (v8: Ursprung liegt bei diesen Fliegern auf der Körpermitte)
      g.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(vis), ctr = bb.getCenter(new THREE.Vector3());
      const hr = Math.max(0.9, (K.h * P.scale) * 0.62);
      const hitbox = new THREE.Mesh(new THREE.SphereGeometry(hr, 10, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hitbox.position.y = ctr.y - g.position.y;
      g.add(hitbox);
      group.add(g);
      const e = { g, vis, hitbox, mix, act, anims: K.anims, kind: K.id, K, mob, sc: K.sc, hr, hp0: K.hp, hp: K.hp, fo, ruhe,
                  fire: P.fireMin + rng() * (P.fireMax - P.fireMin), phase: rng() * 6.28, loco: 'idle', prev: ruhe.clone(),
                  dead: false, dPhase: null, gone: false, wackel: 0, bolt: K.bolt, bs: K.bs, dmg: K.dmg, surface: K.surface,
                  cOff: new THREE.Vector3(0, bb.min.y + (bb.max.y - bb.min.y) * 0.62 - g.position.y, 0) };
      hitbox.userData.enemy = e; hitbox.userData.hr = hr;
      mob.e.push(e); alle.push(e); zaehler.spawns++;
    }
    mobs.push(mob);
    return mob;
  }

  function neuesZiel(mob, spieler, forward) {
    const a = (rng() * 2 - 1) * P.spawnKegel, d = P.spawnNah + rng() * (P.spawnFern - P.spawnNah);
    _f.copy(forward).setY(0).normalize().applyAxisAngle(_up, a);
    mob.ziel.set(spieler.x + _f.x * d, 0, spieler.z + _f.z * d);
    mob.ziel.y = Math.max(groundHeightAt(mob.ziel.x, mob.ziel.z) + P.hoeheMin + rng() * (P.hoeheMax - P.hoeheMin), spieler.y - 3 + rng() * 8);
  }

  function loco(e, want) {
    if (!e.mix || !e.act.fast || !e.act.idle || want === e.loco) return;
    e.act[want].reset().play(); e.act[e.loco].crossFadeTo(e.act[want], 0.24, false); e.loco = want;
  }

  /** Tod: Choreografie aus v8 (hang · fall · impact · settle). Rückgabe true beim Aufschlag. */
  function stepTod(e, dt, out) {
    const sc = e.sc;
    if (e.mix) e.mix.update(dt);
    e.dT += dt; e.dFuse -= dt;
    const gy = () => groundHeightAt(e.ruhe.x, e.ruhe.z);
    if (e.dPhase === 'hang') {
      const k = Math.min(1, e.dT / 0.14);
      e.ruhe.y += 2.4 * dt * (1 - k);
      const q = (1 - k) * 0.2; e.vis.scale.set(sc * (1 + q * 0.8), sc * (1 - q), sc * (1 + q * 0.8));
      if (k >= 1) { e.dPhase = 'fall'; e.dT = 0; e.fall = 0; }
    } else if (e.dPhase === 'fall') {
      e.fall += 27 * dt; e.ruhe.y -= e.fall * dt;
      e.g.rotateOnAxis(e.dAxis, e.dSpin * Math.pow(0.3, e.dT) * dt);
      const s = Math.min(0.36, e.fall * 0.021); e.vis.scale.set(sc * (1 - s * 0.5), sc * (1 + s), sc * (1 - s * 0.5));
      if (e.ruhe.y <= gy() + 0.3 || e.dFuse <= 0) {
        e.ruhe.y = gy() + 0.22; e.dPhase = 'settle'; e.dT = 0;
        out.aufschlag.push({ at: e.ruhe.clone(), e });
      }
    } else {
      const k = Math.min(1, e.dT / 0.30);
      const sq = k < 0.28 ? 1 - (1 - k / 0.28) * 0.52 : 1, gone = Math.max(0, 1 - Math.max(0, (k - 0.45) / 0.55));
      e.vis.scale.set(sc * (2 - sq) * gone, sc * sq * gone, sc * (2 - sq) * gone);
      if (k >= 1) { group.remove(e.g); e.dPhase = null; e.gone = true; }
    }
    e.g.position.copy(e.ruhe);
  }

  return {
    name: 'sky-mobs', group, params: P, quelle: MOB_QUELLE, load, zaehler,
    get kinds() { return kinds; }, get mobs() { return mobs; },
    alive() { return alle.filter((e) => !e.dead); },
    hitboxes() { return alle.filter((e) => !e.dead).map((e) => e.hitbox); },
    mitte(e, out) { return e.hitbox.getWorldPosition(out || new THREE.Vector3()); },

    /** Treffer: Schaden, Wackeln, Aggro für den ganzen Mob. Rückgabe: 'tot' | 'treffer'. */
    hurt(e, dmg, richtung) {
      if (e.dead) return 'tot';
      if (!e.mob.aggro) { e.mob.aggro = true; zaehler.aggro++; for (const x of e.mob.e) x.fire = Math.min(x.fire, 1.2 + rng() * 1.5); }
      e.hp -= dmg; e.wackel = P.wackel;
      if (e.hp > 0) return 'treffer';
      e.dead = true; e.dPhase = 'hang'; e.dT = 0; e.dFuse = 3.5; zaehler.kills++;
      e.dAxis = new THREE.Vector3(rng() - 0.5, 0.2, rng() - 0.5).normalize();
      e.dSpin = (richtung && richtung.x < 0 ? -1 : 1) * (5 + rng() * 4);
      if (e.act.die) { for (const k in e.act) if (k !== 'die') e.act[k].stop(); e.act.die.reset().play(); }
      return 'tot';
    },

    /** Zielhilfe: nächster lebender Gegner im Blick (kleinster Winkel zur Kamera-Achse). */
    naechster(camera, maxRad) {
      const cf = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      let best = null, bs = maxRad == null ? 0.6 : maxRad;
      for (const e of alle) {
        if (e.dead) continue;
        e.hitbox.getWorldPosition(_v).sub(camera.position);
        const d = _v.length(); if (d < 1e-3) continue;
        const ang = Math.acos(Math.max(-1, Math.min(1, _v.dot(cf) / d)));
        const score = ang + d * 0.002;   // nah gewinnt bei gleichem Winkel
        if (ang < bs && score < bs) { bs = score; best = e; }
      }
      return best;
    },
    /** Tab-Cycle (WoW): nächster nach Winkel sortiert, nach dem aktuellen. */
    cycle(camera, current) {
      const cf = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const list = alle.filter((e) => !e.dead).map((e) => {
        e.hitbox.getWorldPosition(_v).sub(camera.position); const d = _v.length() || 1;
        return { e, a: Math.acos(Math.max(-1, Math.min(1, _v.dot(cf) / d))) };
      }).filter((x) => x.a < 1.4).sort((a, b) => a.a - b.a).map((x) => x.e);
      if (!list.length) return null;
      const i = list.indexOf(current);
      return list[(i + 1) % list.length];
    },

    /**
     * ctx: { spieler: Vector3, forward: Vector3, camera, spielerTot: bool, knockOf(vis) → Vector3 }
     * Rückgabe: { feuer: [{ from, dir, e }], aufschlag: [{ at, e }] }
     */
    update(dt, ctx) {
      const out = { feuer: [], aufschlag: [] };
      const S = ctx.spieler, fwd = ctx.forward;
      if (!kinds.length) return out;
      // ── Aufräumen (v24/S3). `gone` heißt: die Todes-Choreografie ist durch und die Hülle ist aus
      // der Szene. Vorher blieb sie für immer in `alle` und in `mob.e` — jede Zielsuche, jede
      // Trefferprüfung und jede Zählzeile lief über eine Liste, die nur wuchs.
      for (let i = alle.length - 1; i >= 0; i--) if (alle[i].gone) alle.splice(i, 1);
      for (let i = mobs.length - 1; i >= 0; i--) {
        if (!mobs[i].e.every((e) => e.gone)) continue;
        for (const e of mobs[i].e) { group.remove(e.g); if (e.hitbox) e.hitbox.geometry.dispose(); }
        mobs.splice(i, 1); zaehler.mobsGeleert++;
      }
      // Nachschub: erst nach einer Pause, immer vorn im Kegel
      const lebend = mobs.filter((m) => m.e.some((e) => !e.dead)).length;
      if (lebend < P.mobs) { respawnT -= dt; if (respawnT <= 0) { spawnMob(S, fwd); respawnT = P.respawn; } }
      if (!frustum) { frustum = new THREE.Frustum(); fm = new THREE.Matrix4(); }
      fm.multiplyMatrices(ctx.camera.projectionMatrix, ctx.camera.matrixWorldInverse); frustum.setFromProjectionMatrix(fm);

      for (const mob of mobs) {
        mob.t += dt; mob.token = Math.max(0, mob.token - dt);
        // v24/S3 · Sterbende laufen IMMER weiter — auch wenn KEIN Gegner des Mobs mehr lebt.
        // Vorher stand der `continue` unten VOR ihrem Takt: der letzte Abschuss eines Mobs nahm
        // der Leiche die Choreografie, sie blieb in Phase `hang` mitten in der Luft stehen und
        // wurde nie entfernt. Im Bild las sich das als „fliegt seitlich langsam vorbei" (sie stand
        // still, der Spieler zog vorbei) — und anwählbar war sie nicht mehr, weil `dead`.
        for (const e of mob.e) if (e.dead && e.dPhase) stepTod(e, dt, out);
        const lebt = mob.e.filter((e) => !e.dead);
        if (!lebt.length) continue;
        // ── Ruhezustand: der Anker wandert; zu weit weg oder hinter dem Spieler → neues Ziel vorn
        if (!mob.aggro) {
          _v.copy(mob.anker).sub(S); const d = _v.length();
          const hinten = _v.dot(fwd) < -25;
          if (d > P.weg || hinten || mob.anker.distanceTo(mob.ziel) < 3) neuesZiel(mob, S, fwd);
          _w.copy(mob.ziel).sub(mob.anker); const dz = _w.length();
          if (dz > 0.01) mob.anker.addScaledVector(_w.normalize(), Math.min(dz, P.drift * dt));
          const gy = groundHeightAt(mob.anker.x, mob.anker.z) + P.hoeheMin;
          if (mob.anker.y < gy) mob.anker.y += (gy - mob.anker.y) * Math.min(1, dt * 2);
        } else {
          // ── Aggro: Slot vor dem Spieler, seitlich gestaffelt (v8 EIN ANKER, NICHT ZWEI)
          _f.copy(fwd).setY(0).normalize();
          mob.anker.copy(S).addScaledVector(_f, P.abstand + Math.sin(mob.t * 0.7) * 1.6);
          mob.anker.y = S.y + 1.5 + Math.sin(mob.t * 1.7) * 0.6;
          const gy = groundHeightAt(mob.anker.x, mob.anker.z) + 2.5;
          if (mob.anker.y < gy) mob.anker.y = gy;
        }
        for (let i = 0; i < mob.e.length; i++) {
          const e = mob.e[i];
          if (e.dead) continue;   // sein Takt lief schon oben, vor dem `lebt`-Ausstieg
          if (e.mix) e.mix.update(dt);
          e.phase += dt;
          // Wunschlage = Anker + Formation (+ Slot-Fächer bei Aggro) + Wippen
          _w.copy(mob.anker);
          if (mob.aggro) { _f.copy(fwd).setY(0).normalize().applyAxisAngle(_up, -0.34 + i * 0.34); _w.copy(S).addScaledVector(_f, P.abstand + Math.sin(e.phase * 0.5) * 1.4); _w.y = mob.anker.y + e.fo.y; }
          else _w.add(e.fo);
          _w.y += Math.sin(e.phase * 2.8) * 0.35;
          const rate = mob.aggro ? 1 - Math.pow(0.22, dt) : Math.min(1, dt * 1.6);
          e.ruhe.lerp(_w, rate);
          // Lokomotion aus der tatsächlichen Bewegung (v8, Hysterese 2,2/1,4)
          const spd = e.ruhe.distanceTo(e.prev) / Math.max(dt, 1e-4); e.prev.copy(e.ruhe);
          loco(e, spd > (e.loco === 'fast' ? 1.4 : 2.2) ? 'fast' : 'idle');
          // Blick: Aggro → Spieler; Ruhe → Flugrichtung des Ankers
          if (mob.aggro) e.g.lookAt(_v.copy(S).setY(S.y + 1.2));
          else if (spd > 0.3) { e.g.lookAt(_v.copy(e.ruhe).add(_f.copy(mob.ziel).sub(mob.anker).setY(0).normalize())); }
          if (e.wackel > 0) { e.g.rotateZ(Math.sin(e.phase * 40) * e.wackel * 0.25); e.wackel *= Math.exp(-P.wackelAbklang * dt); if (e.wackel < 0.02) e.wackel = 0; }
          // Sichtbare Position = Ruhelage + Versatz aus dem Kampfmodul (der WIRT schreibt)
          // v25 · VORHER die Kamera freihalten (Herleitung an `kameraMin`). Die Ruhelage selbst wird
          // geschoben, nicht nur die Anzeige — sonst zieht der nächste Takt den Körper zurück in die
          // Linse und es flackert.
          if (ctx.camera) {
            const cp = ctx.camera.position;
            _v.copy(e.ruhe).sub(cp);
            const d = _v.length();
            const rad = P.kameraMin + e.hr;
            if (d < zaehler.naeheMin) zaehler.naeheMin = +d.toFixed(2);
            if (d < rad) {
              if (d < 1e-3) _v.copy(fwd).setY(0.2).normalize(); else _v.divideScalar(d);
              e.ruhe.copy(cp).addScaledVector(_v, rad);
              zaehler.geschoben++;
            }
          }
          e.g.position.copy(e.ruhe);
          if (ctx.knockOf) e.g.position.add(ctx.knockOf(e.vis));
          // ── Feuer nur bei Aggro, im Frustum, in Sichtweite, nie in den toten Spieler
          if (!mob.aggro) continue;
          const dist = e.ruhe.distanceTo(S);
          const inView = frustum.containsPoint(e.g.position);
          e.fire -= dt;
          if (!inView) e.fire = Math.max(e.fire, 0.6);
          if (mob.token > 0) e.fire = Math.max(e.fire, 0.25);
          if (e.fire <= 0 && dist < P.sicht && !ctx.spielerTot && !(e.windup > 0)) {
            mob.token = P.token; e.windup = P.windup; e.tellStarted = false;
            e.fire = P.fireMin + rng() * (P.fireMax - P.fireMin);
          }
          if (e.windup > 0) {
            e.windup -= dt;
            if (!e.tellStarted && e.windup <= 0.22) { e.tellStarted = true; if (e.act.tell) { e.act.tell.reset().play(); } }
            if (e.windup <= 0) {
              const from = e.hitbox.getWorldPosition(new THREE.Vector3());
              const dir = _v.copy(S).setY(S.y + 1.2).sub(from).normalize();
              dir.x += (rng() - 0.5) * 0.14; dir.y += (rng() - 0.5) * 0.08; dir.z += (rng() - 0.5) * 0.14; dir.normalize();
              from.addScaledVector(dir, 0.55 * e.sc);
              out.feuer.push({ from, dir: dir.clone(), e }); zaehler.feuer++;
            }
          }
        }
      }
      // Leere Mobs (alle gone) entfernen — NACH der Schleife
      for (let i = mobs.length - 1; i >= 0; i--) {
        if (mobs[i].e.every((e) => e.gone)) { mobs.splice(i, 1); zaehler.mobsGeleert++; }
      }
      for (let i = alle.length - 1; i >= 0; i--) if (alle[i].gone) alle.splice(i, 1);
      return out;
    },

    abweichungen() { const out = []; for (const k in MOB_QUELLE) if (MOB_QUELLE[k] !== P[k]) out.push({ feld: k, quelle: String(MOB_QUELLE[k]), ist: String(P[k]) }); return out; },
    zeile() {
      const aggro = mobs.filter((m) => m.aggro).length;
      return 'sky-mobs · ' + kinds.length + ' Arten · ' + mobs.length + ' Mobs (' + aggro + ' aggro) · ' + alle.filter((e) => !e.dead).length + ' lebend · '
        + zaehler.kills + ' Abschüsse · ' + zaehler.feuer + ' Gegnerschüsse · nächster ' + zaehler.naeheMin + ' u zur Kamera ('
        + zaehler.geschoben + '× geschoben)';
    },
  };
}
