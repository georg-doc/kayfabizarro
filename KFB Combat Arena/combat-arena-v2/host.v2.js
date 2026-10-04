/**
 * combat-arena-v2/host.v2.js — der WIRT der Combat Arena v2 (MASTERPLAN §2, Slice S0).
 *
 * Erbt `combat-arena-v1/host.v1.js` (three-Instanz, Renderer, Licht, fester Schritt, rng, assets,
 * pointer, register) und legt genau die fünf Fähigkeiten dazu, die das Spiel braucht:
 *
 *   input   WASD · Space · Maus (Blick, Feuer) · Tab · Esc — ZUSTAND je Schritt, keine Events in Module
 *   field   die Karte als Spielfeld: bounds · inside · edgeNormal · floorY · contain
 *   fx      die FX-Foundation v13, eingebaut nach docs/EINBAU_fx-foundation_v13.md §3 (sechs Schritte)
 *   time    Simulationszeit + Phasen (travel · land · countdown · play · cleared · showcase)
 *   save    Session-JSON schreiben/lesen, mit Roundtrip-Diff (Boden C5)
 *
 * WAS DIESER WIRT NICHT TUT (S0 ist ohne Feature): kein Kartenbau, kein Spieler, keine Mobs, keine
 * Waffe. `field` steht auf der Wirt-Vorgabe (Rechteck 9 × 6,44 u = Kartenmaß); die Tusche-Kontur
 * hängt M1 in S1 über `field.attach(poly)` ein. Das ist die benannte Naht, kein Nachbau.
 *
 * Kalibrierung: Linear 0,8 / env 0,3 kommt aus host.v1 (gemessen 06.09., CONTRACT §0). Nachgemessen
 * wird sie hier mit `studio-v12/light.v1.js` (Referenzkugel) — importiert, nicht nachgebaut.
 *
 * KEIN OrbitControls: der Cursor-Fokus-Zoom war ein Werkzeug fürs Ansehen. Im Spiel hängt die Kamera
 * als Schulter-Kamera an FrizzleBob (Georgs Entscheidung, MASTERPLAN §2), Maus dreht.
 * KEIN Math.random in dieser Datei (Boden C10) — jeder Zufall kommt aus `rng` (Seed 20260906).
 */

import { createHost, CAPABILITIES as CAPS_V1, RAW, rawUrl } from '../combat-arena-v1/host.v1.js';

export { RAW, rawUrl };
export const SEED = 20260906;                       // Fixture-Seed für ALLE Messungen (MASTERPLAN §7.4)
export const CARD = { w: 9, h: 6.44 };              // Kartenmaß in Welt-u, bleibt das Maß (§2)
export const SCALE = { fb: 1.05, mobMin: 0.7, mobMax: 1.1 };
export const CAPABILITIES = CAPS_V1.concat(['input', 'field', 'fx', 'time', 'save']);
export const BUDGET = { calls: 110, frameMs: 8, bootMs: 5000 };

/* Ladeweg nach EINBAU §2: Projekt zuerst, jsDelivr als Rückfall. Nie RAW für ES-Module (text/plain). */
const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/';
const _mod = async (rel, cdn) => { try { return await import(rel); } catch (e) { return await import(cdn); } };

/* ─── input ─────────────────────────────────────────────────────────────────────
   Ein Zustandsobjekt, das der Wirt je Schritt fortschreibt. Module lesen `state`,
   niemals einen Event. Flanken (`firePressed` …) werden am Ende des Schritts geleert. */
function makeInput(canvas) {
  const keys = new Set();
  const st = {
    x: 0, z: 0, turn: 0, jump: false, sprint: false, fire: false, aim: false,
    firePressed: false, jumpPressed: false, tabPressed: false, escPressed: false,
    look: { dx: 0, dy: 0 }, wheel: 0, dragging: false, locked: false, any: false
  };
  const KEY = { KeyW: 'f', ArrowUp: 'f', KeyS: 'b', ArrowDown: 'b', KeyQ: 'l', ArrowLeft: 'l', KeyE: 'r', ArrowRight: 'r' };
  const onKey = (e, down) => {
    if (e.code === 'Space') { if (down && !keys.has('Space')) st.jumpPressed = true; st.jump = down; }
    if (e.code === 'Tab') { if (down) st.tabPressed = true; e.preventDefault(); }
    if (e.code === 'Escape' && down) st.escPressed = true;
    if (down) keys.add(e.code); else keys.delete(e.code);
    /* GEORGS BELEGUNG (06.09.): A/D DREHEN, Q/E gehen SEITLICH. Vorher lagen A/D auf dem Versatz und
       Drehen ging nur mit der Maus — auf einem Trackpad ist das eine Hand zu viel. `x` ist jetzt
       reiner Seitschritt, `turn` die Drehachse; wer die Pfeiltasten nimmt, bekommt beides wie zuvor. */
    st.x = (keys.has('KeyE') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyQ') || keys.has('ArrowLeft') ? 1 : 0);
    st.z = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
    st.turn = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0);
    st.sprint = keys.has('ShiftLeft') || keys.has('ShiftRight');   // Georg 06.09.: Rennen gehört auf Shift, nicht auf »bewegt sich«
    st.any = true;
    if (KEY[e.code] || e.code === 'Space' || e.code === 'KeyA' || e.code === 'KeyD') e.preventDefault();
  };
  addEventListener('keydown', (e) => onKey(e, true));
  addEventListener('keyup', (e) => onKey(e, false));
  canvas.addEventListener('pointerdown', (e) => {
    st.dragging = true; st.any = true;
    if (e.button === 0) { st.fire = true; st.firePressed = true; }
    if (e.button === 2) st.aim = true;
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointerup', (e) => { st.dragging = false; if (e.button === 0) st.fire = false; if (e.button === 2) st.aim = false; });
  canvas.addEventListener('pointermove', (e) => {
    if (!st.dragging && !st.locked) return;
    st.look.dx += e.movementX != null && st.locked ? e.movementX : e.movementX || 0;
    st.look.dy += e.movementY || 0;
  });
  canvas.addEventListener('wheel', (e) => { st.wheel += e.deltaY; st.any = true; }, { passive: true });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('pointerlockchange', () => { st.locked = document.pointerLockElement === canvas; });
  return {
    state: st,
    lock() { canvas.requestPointerLock && canvas.requestPointerLock(); },
    unlock() { document.exitPointerLock && document.exitPointerLock(); },
    /* Nach den Modulen: Flanken und Deltas leeren. Ein Modul, das zweimal liest, liest zweimal denselben Schritt. */
    consume() { st.firePressed = false; st.jumpPressed = false; st.tabPressed = false; st.escPressed = false; st.look.dx = 0; st.look.dy = 0; st.wheel = 0; },
    zeile() { return '[input] seitlich ' + st.x + ' vor ' + st.z + ' drehen ' + st.turn + (st.sprint ? ' · SPRINT' : '') + (st.fire ? ' · feuer' : '') + (st.jump ? ' · sprung' : '') + (st.locked ? ' · pointerlock' : ' · drag') + ' · W/S vor · A/D drehen · Q/E seitlich · Shift rennen'; }
  };
}

/* ─── field ─────────────────────────────────────────────────────────────────────
   Das Spielfeld ist ein 2D-Polygon in der XZ-Ebene plus eine Bodenhöhe. S0 setzt das
   Kartenrechteck (9 × 6,44 u); M1 hängt in S1 die Tusche-Kontur ein — dieselbe Form,
   nur mehr Punkte. `contain()` gibt den Rückstoß als Vektor, der Körper entscheidet
   (M2 bounct, M3 fällt) — der Rand gehört dem Feld, die Reaktion dem Körper (§4). */
function makeField(THREE) {
  const rect = (w, h) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
  let poly = rect(CARD.w, CARD.h);
  let y = 0, quelle = 'Wirt-Vorgabe · Rechteck ' + CARD.w + ' × ' + CARD.h + ' u (Kontur kommt in S1 von M1)';
  const _n = new THREE.Vector2(), _p = new THREE.Vector2();
  const inside = (x, z) => {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > z) !== (b[1] > z) && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit;
    }
    return hit;
  };
  /* Nächste Kante: Lot auf jedes Segment, kleinster Abstand. Normale zeigt nach INNEN. */
  function nearest(x, z) {
    let best = null;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      const ex = b[0] - a[0], ez = b[1] - a[1], len2 = ex * ex + ez * ez || 1e-6;
      let t = ((x - a[0]) * ex + (z - a[1]) * ez) / len2; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = a[0] + ex * t, pz = a[1] + ez * t, d = Math.hypot(x - px, z - pz);
      if (!best || d < best.d) best = { d, px, pz, ex, ez };
    }
    _n.set(-best.ez, best.ex).normalize();
    if (!inside(best.px + _n.x * 0.01, best.pz + _n.y * 0.01)) _n.negate();
    return { dist: best.d, x: best.px, z: best.pz, nx: _n.x, nz: _n.y };
  }
  return {
    attach(p, floorY, name) { poly = p.map((q) => [q[0], q[1]]); if (floorY != null) y = floorY; quelle = name || 'M1'; },
    poly: () => poly, quelle: () => quelle, floorY: () => y,
    corners: () => poly.slice(),
    bounds() { let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const p of poly) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); z0 = Math.min(z0, p[1]); z1 = Math.max(z1, p[1]); } return { x0, x1, z0, z1, w: x1 - x0, h: z1 - z0 }; },
    inside, edgeNormal(x, z) { const e = nearest(x, z); return { x: e.nx, z: e.nz, dist: e.dist }; },
    /* r = Körperradius. push = Versatz, der den Körper wieder ganz auf die Karte legt. */
    contain(pos, r) {
      const drin = inside(pos.x, pos.z), e = nearest(pos.x, pos.z);
      _p.set(0, 0);
      if (!drin) _p.set(e.x - pos.x + e.nx * (r || 0), e.z - pos.z + e.nz * (r || 0));
      else if (e.dist < (r || 0)) _p.set(e.nx * ((r || 0) - e.dist), e.nz * ((r || 0) - e.dist));
      return { inside: drin, push: { x: _p.x, z: _p.y }, normal: { x: e.nx, z: e.nz }, rand: e.dist, gefallen: pos.y < y - 1.5 };
    },
    zeile() { const b = this.bounds(); return '[field] ' + poly.length + ' Punkte · ' + b.w.toFixed(2) + ' × ' + b.h.toFixed(2) + ' u · y ' + y.toFixed(2) + ' · ' + quelle; }
  };
}

/* ─── time ──────────────────────────────────────────────────────────────────────
   Phasen sind Zustände, keine Timer-Ketten. M7 schaltet sie, alle anderen lesen. */
const PHASES = ['travel', 'land', 'countdown', 'play', 'cleared', 'showcase'];
function makeTime() {
  const st = { phase: 'play', t: 0, sim: 0, kampfzeit: 0, countdown: 0, frames: 0 };
  const hoerer = new Set();
  return {
    state: st, PHASES: PHASES.slice(),
    set(p, o) {
      if (!PHASES.includes(p)) throw new Error('unbekannte Phase: ' + p);
      st.phase = p; st.t = 0;
      if (p === 'countdown') st.countdown = (o && o.sek) != null ? o.sek : 3;
      hoerer.forEach((f) => f(p, st));
    },
    on(fn) { hoerer.add(fn); return () => hoerer.delete(fn); },
    tick(dt) {
      st.sim += dt; st.t += dt; st.frames++;
      if (st.phase === 'play') st.kampfzeit += dt;
      if (st.phase === 'countdown') { st.countdown = Math.max(0, st.countdown - dt); if (st.countdown === 0) this.set('play'); }
    },
    zeile() { return '[time] ' + st.phase + ' · t ' + st.t.toFixed(1) + ' s · sim ' + st.sim.toFixed(1) + ' s · Kampf ' + st.kampfzeit.toFixed(1) + ' s'; }
  };
}

/* ─── save ──────────────────────────────────────────────────────────────────────
   Georg: »alles« — Level · Score · Kills · Karten-IDs (Deck/Seite/Viertel) · Kampfzeit ·
   FB-Gesicht (Studio-JSON eingebettet) · Seed. Der Wirt kennt keinen dieser Werte; er
   sammelt sie bei den Modulen ein (`provide`) und gibt sie beim Import zurück (`restore`).
   Boden C5 ist der Roundtrip-Diff über ALLE Felder, nicht über die, die gerade da sind. */
function makeSave(host) {
  const geber = new Map(), nehmer = new Map();
  const PFLICHT = ['level', 'score', 'kills', 'karten', 'kampfzeit', 'gesicht'];
  const snapshot = () => {
    const o = { version: 'ca2-save-1', seed: SEED, sim: +host.time.state.sim.toFixed(3), kampfzeit: +host.time.state.kampfzeit.toFixed(3), phase: host.time.state.phase };
    for (const [k, fn] of geber) { try { o[k] = fn(); } catch (e) { o[k] = null; } }
    for (const k of PFLICHT) if (!(k in o)) o[k] = null;
    return o;
  };
  const flat = (o, pre, out) => { out = out || {}; for (const k in o) { const v = o[k], p = pre ? pre + '.' + k : k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, p, out); else out[p] = Array.isArray(v) ? JSON.stringify(v) : v; } return out; };
  return {
    provide(name, get, set) { geber.set(name, get); if (set) nehmer.set(name, set); },
    fehlend: () => PFLICHT.filter((k) => !geber.has(k)),
    snapshot, toJSON: () => JSON.stringify(snapshot(), null, 2),
    load(objOrText) {
      const o = typeof objOrText === 'string' ? JSON.parse(objOrText) : objOrText;
      if (!o || o.version !== 'ca2-save-1') throw new Error('fremdes Save (version ' + (o && o.version) + ')');
      for (const [k, fn] of nehmer) if (k in o) fn(o[k]);
      return o;
    },
    /* Roundtrip-Diff: gleiche Felder, gleiche Werte? Gibt die abweichenden Pfade zurück. */
    diff(a, b) {
      const A = flat(a), B = flat(b), keys = new Set(Object.keys(A).concat(Object.keys(B))), ab = [];
      for (const k of keys) if (A[k] !== B[k]) ab.push(k + ': ' + A[k] + ' ≠ ' + B[k]);
      return ab;
    },
    zeile() { const f = this.fehlend(); return '[save] ' + geber.size + ' Geber · ' + nehmer.size + ' Nehmer' + (f.length ? ' · offen bis M7: ' + f.join(', ') : ' · vollständig'); }
  };
}

/* ─── fx ────────────────────────────────────────────────────────────────────────
   Einbau der Foundation v13 nach EINBAU §3, Schritt 1–6. Der Wirt hält EINEN
   Draw-Call-Haushalt; jeder Effekt emittiert in diesen Pool. Nichts wird nachgebaut.
   Falle 1 (Ohr an der Kamera) ist hier schon vermieden: der Listener sitzt in der
   Bühnenmitte, `distMax` = Bühnenspanne 26 u, nicht die Kameradistanz. */
function makeFx(host) {
  const THREE = host.THREE;
  const S = { state: 'nicht gebootet', grund: null, sprites: null, trails: null, cues: null, bank: null, D: null, R: null, atlas: null, ac: null, ton: false };
  const api = {
    get state() { return S.state; },
    get bereit() { return !!S.sprites; },
    async boot(o) {
      if (S.sprites) return api;
      try {
        const D = await _mod('../modules/kfb-combat-def.js', CDN + 'modules/kfb-combat-def.js');
        const R = await _mod('../modules/kfb-vfx-recipes.js', CDN + 'modules/kfb-vfx-recipes.js');
        const A = await _mod('../modules/kfb-combat-atlas.js', CDN + 'modules/kfb-combat-atlas.js');
        const P = await _mod('../modules/kfb-fx-sprites.js', CDN + 'modules/kfb-fx-sprites.js');
        const T = await _mod('../modules/kfb-fx-trails.js', CDN + 'modules/kfb-fx-trails.js');
        const C = await _mod('../modules/kfb-combat-cues.js', CDN + 'modules/kfb-combat-cues.js');
        /* ATLAS: 256 px KACHELKANTE — das ist der Modulkanon, und `size` ist die Kante EINER Zelle,
           nicht die Atlasgröße. Mein 1024 machte daraus 4096×5120 px (Kritiker 06.09.: ~84 MB je
           Upload) und kaufte keine einzige Linie. Die Zeichnung im Atlas IST die kanonische aus
           Mech Slice v8; `ink` liefert nur den geseedeten Zufall (`mulberry`) für den Zacken-Jitter.
           Deshalb wird die Tusche-Quelle jetzt übergeben, statt `null` — und `inked` steht im Log. */
        let ink = null;
        try { ink = await import('../cardbuilder/kfb-ink-canon.js'); } catch (e) { ink = null; }
        const at = A.buildAtlas(THREE, ink, 256);
        S.D = D; S.R = R; S.atlas = at;
        S.sprites = new P.SpriteFx(THREE, host.scene, { atlas: { tex: at.texture, cols: at.cols, rows: at.rows, cells: at.cells }, cap: 220 });
        S.trails = new T.TrailFx(THREE, host.scene, { seg: 16, breit: 28 });
        S.cues = C.createCombatCues({ play: (n, opt) => (S.bank ? S.bank.play(n, opt) : false), audible: () => !!S.bank });
        S.state = 'VFX bereit · Atlas ' + at.cols + '×' + at.rows + ' · Zelle 256 px · Tusche ' + (at.inked ? 'ja' : 'nein (Kanon-Zeichnung)') + ' · Pool 220 · Ton ' + (S.ton ? 'an' : 'aus');
      } catch (e) {
        S.grund = (e && e.message) || String(e); S.state = 'AUSFALL: ' + S.grund;
        host.log('[fx] AUSFALL: ' + S.grund);
      }
      if (o && o.ton) await api.tonAn();
      return api;
    },
    /* Ton erst nach der ersten Geste (ONBOARDING v14 P1, Georg: Ton AN beim Start). */
    async tonAn() {
      if (S.ton) return true;
      try {
        const L = await _mod('../modules/kfb-sfx-layers.js', CDN + 'modules/kfb-sfx-layers.js');
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        await ac.resume();
        const master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination);
        /* 0,55 statt 0,9: Georg 06.09. »die SFX sind nicht gut ausgesteuert«. Die Bank mischt ihre
           Ebenen selbst, aber der Wirt gibt den Pegel — und der war für eine Kartenbühne zu hoch. */
        S.bank = new L.LayerBank(ac, master, { distMax: 26, distFloor: 0.15 });   // Bühnenspanne, NICHT Kameradistanz (EINBAU Falle 1)
        await S.bank.load('./modules/kfb-combat-sfx.v2.json');
        S.ac = ac; S.ton = true;
        S.state = S.state.replace(/Ton (an|aus)/, 'Ton an');
        host.log('[fx] ' + (S.bank.line ? S.bank.line() : 'Bank geladen'));
        return true;
      } catch (e) { host.log('[fx] Ton AUSFALL: ' + ((e && e.message) || e)); return false; }
    },
    emit(cell, pos, o) { return S.sprites ? S.sprites.emit(api.zelle(cell), pos, api.opt(o)) : null; },
    /* ZWEI ÜBERSETZER, an EINER Stelle — beide aus Kritiker-Funden vom 06.09.:

       (1) DER FARBSCHLÜSSEL HEISST `color`. `SpriteFx.emit` liest `o.color`; das ganze Projekt hat
           `col:` übergeben, und damit war JEDES Sprite weiß — gemessen: `{col:0xff0000}` → ffffff,
           `{color:0x00ff00}` → 00ff00. Die gesamte Farbsemantik der Werkbank (Bolzenfarbe je Roster-
           Eintrag, Blitzfarbe, Tint je Oberfläche) kam nie an, während das LIVING sie als »aus dem
           Rezept« auswies. Hier wird `col` weiter angenommen und übersetzt, statt an vier Aufrufstellen
           dasselbe zu reparieren.

       (2) DIE REZEPT-VOKABEL IST NICHT DIE ATLAS-VOKABEL. `enemyShot()` nennt die Mündung `charge`;
           der Atlas hat dafür `muzzle`. `SpriteFx` mappt Unbekanntes über `Math.max(0, indexOf)` auf
           Index 0 = `burst` — also zeigte jedes Mündungsfeuer den Explosions-Glyph, und ein Tippfehler
           in einem Zellnamen wäre NIE sichtbar geworden. Jetzt: Tabelle für die bekannten
           Abweichungen, und wer eine Zelle nennt, die es nicht gibt, steht EINMAL im Log. */
    opt(o) {
      if (!o) return o;
      if (o.color == null && o.col != null) { const k = Object.assign({}, o); k.color = o.col; return k; }
      return o;
    },
    zelle(name) {
      const T = { charge: 'muzzle', orb: 'plasma', flash: 'muzzle', rail: 'muzzle', blast: 'burst', spread: 'puff' };
      const z = T[name] || name;
      const liste = (S.atlas && S.atlas.cells) || [];
      if (liste.length && liste.indexOf(z) < 0) {
        S.unbekannt = S.unbekannt || new Set();
        if (!S.unbekannt.has(z)) { S.unbekannt.add(z); host.log('[fx] Zelle »' + z + '« steht nicht im Atlas — fällt auf burst (Atlas: ' + liste.join(' ') + ')'); }
        return 'burst';
      }
      return z;
    },
    /* Semantik VOR Darstellung (EINBAU §3 Schritt 4): erst auflösen, dann zeichnen. */
    impact(energie, oberflaeche, at, schwer) {
      if (!S.sprites) return null;
      const z = S.D.resolveImpact(energie, oberflaeche, !!schwer);
      S.sprites.emit(api.zelle(z.cell), at, { size: z.size, color: z.tint, life: 0.32 });
      if (z.sec) for (const [name, n] of z.sec) S.sprites.scatter ? S.sprites.scatter(name, at, n, { seed: SEED }) : 0;
      api.cue('treffer', { energy: energie, surface: oberflaeche, heavy: !!schwer, at });
      return z;
    },
    cue(anker, o) {
      if (!S.cues) return null;
      const c = S.cues;
      if (anker === 'abzug' || anker === 'mündung' || anker === 'muendung') return c.launch(o || {});
      if (anker === 'treffer') return c.impact(o || {});
      if (anker === 'aufsetzer' && c.hop) return c.hop(o || {});
      if (typeof c[anker] === 'function') return c[anker](o || {});
      return null;
    },
    step(dt, cam) {
      /* JEDER TEIL EINZELN GEKAPSELT. Der Takt darf nicht an einem Effekt sterben, und ein Ausfall
         muss sagen, WELCHER Teil es war: bis 06.09. stand in der Konsole nur eine anonyme Zeile
         »Cannot read properties of undefined (reading 'length')«, die niemand zuordnen konnte. */
      if (S.sprites) { try { S.sprites.step(dt, cam); } catch (e) { api._ausfall('sprites.step', e); } }
      if (S.trails && S.trails.update) { try { S.trails.update(dt); } catch (e) { api._ausfall('trails.update', e); } }
      if (S.cues) { try { S.cues.update(dt); } catch (e) { api._ausfall('cues.update', e); } }
    },
    _ausfall(wo, e) {
      S.ausfaelle = S.ausfaelle || {};
      if (S.ausfaelle[wo]) { S.ausfaelle[wo]++; return; }
      S.ausfaelle[wo] = 1;
      host.log('[fx] ' + wo + ' fällt aus: ' + ((e && e.message) || e) + ' — Teil abgeschaltet, Takt läuft weiter');
      if (wo === 'cues.update') S.cues = null;
      if (wo === 'trails.update') S.trails = null;
    },
    get ausfaelle() { return S.ausfaelle || null; },
    /* Boden C4: nach `aufraeumen + 100 ms` steht der Pool auf Ausgangswert. */
    /* `calls` liest der Sprite-Pool nicht — die Zahl kommt vom Renderer, sonst stand »calls undefined«
       im Prüfblatt (Kritiker 06.09.). Ein Feld, das nie einen Wert hat, ist ein leeres Versprechen. */
    stats() {
      const s = S.sprites ? S.sprites.stats() : null;
      return { bereit: !!S.sprites, live: s ? (s.live != null ? s.live : s.sprites) : null, calls: host.renderer ? host.renderer.info.render.calls : null, ton: S.ton, roh: s };
    },
    aufraeumen() { if (S.sprites) S.sprites.clear(); if (S.cues && S.cues.reset) S.cues.reset(); },
    zeile() { const st = api.stats(); return '[fx] ' + S.state + (st.live != null ? ' · lebend ' + st.live + ' · calls ' + st.calls : ''); }
  };
  return api;
}

/* ─── Schulter-Kamera ───────────────────────────────────────────────────────────
   Georgs Entscheidung: TPS hinter FB, Maus dreht (Yaw frei, Pitch 10–60°), Rad = Abstand 3–9 u.
   Der Auto-Target-Kegel (M4) liegt in DIESER Blickrichtung — gezielt wird durch Drehen.

   STANDARD-ABSTAND 7,6 u, GEMESSEN, nicht gewählt (Boden C8, 13 × 13-Raster, Seitenverhältnis 1,19
   = Georgs Split-Screen): 6,4 u → 87 % · 7,2 u → 89 % · 8,0 u → 97 %. 7,6 u hält die 85 % auch im
   schmalen Fenster. OFFENER PUNKT für S1: bei 7,6 u ist FB (1,05 u) sieben Körperhöhen entfernt —
   Schulter-Kamera und »Karte ≥ 85 % im Bild« ziehen gegeneinander. Entscheidung mit FB im Bild. */
function makeCam(THREE, camera, input) {
  const DREH = 2.4;   // rad/s bei gehaltener Taste — eine halbe Drehung in gut 1,3 s
  const st = { yaw: Math.PI * 0.5, pitch: 0.65, dist: 7.6, minDist: 3, maxDist: 9, ziel: new THREE.Vector3(0, 0.6, 0), folgt: null, hoehe: 0.75, weich: 0.14 };
  /* Standard-Neigung 37° (0,65 rad), gemessen bei 7,6 u / Seitenverhältnis 1,19: 23° → 92 % ·
     32° → 91 % · 37° → 91 % · 43° → 90 %. C8 ist dabei fast gleich — aber bei 23° liegt die Karte so
     flach im Bild, dass die ferne Hälfte in den oberen Rand gestaucht wird (Georg 06.09.: »ich sehe
     nichts«). Die Zahl entscheidet hier nicht, die Lesbarkeit der Karte tut es. */
  const tmp = new THREE.Vector3();
  return {
    state: st,
    folge(obj, hoehe) { st.folgt = obj; if (hoehe != null) st.hoehe = hoehe; },
    setze(o) { Object.assign(st, o || {}); },
    /* Blickrichtung auf der Bodenebene — M4 und M2 lesen sie, statt die Kamera zu befragen. */
    blick() { return { x: -Math.sin(st.yaw), z: -Math.cos(st.yaw) }; },
    step(dt) {
      const s = input.state;
      st.yaw -= s.look.dx * 0.0042;
      st.yaw -= (s.turn || 0) * DREH * dt;                       // A/D: Tastatur-Drehung, gleiche Achse wie die Maus
      st.pitch = Math.min(1.047, Math.max(0.175, st.pitch + s.look.dy * 0.0032));   // 10°–60°
      if (s.wheel) st.dist = Math.min(st.maxDist, Math.max(st.minDist, st.dist + s.wheel * 0.0025));
      if (st.folgt) { st.folgt.getWorldPosition(tmp); tmp.y += st.hoehe; st.ziel.lerp(tmp, Math.min(1, st.weich * dt * 60)); }
      const r = Math.cos(st.pitch) * st.dist;
      camera.position.set(st.ziel.x + Math.sin(st.yaw) * r, st.ziel.y + Math.sin(st.pitch) * st.dist, st.ziel.z + Math.cos(st.yaw) * r);
      camera.lookAt(st.ziel);
    },
    zeile() { return '[kamera] yaw ' + (st.yaw * 57.3).toFixed(0) + '° · pitch ' + (st.pitch * 57.3).toFixed(0) + '° · Abstand ' + st.dist.toFixed(1) + ' u'; }
  };
}

/* ─── der Wirt ──────────────────────────────────────────────────────────────────── */
export function createHostV2(o) {
  const zeilen = [];
  const log = (s) => { zeilen.push(s); if (zeilen.length > 60) zeilen.shift(); (o.log || ((x) => console.info('[arena2] ' + x)))(s); };
  /* OrbitControls wird ABSICHTLICH nicht hereingegeben (MASTERPLAN §2): im Spiel ist die Kamera an FB gebunden. */
  const deps = Object.assign({}, o.deps || {}); delete deps.OrbitControls;
  const h = createHost({ THREE: o.THREE, canvas: o.canvas, deps, log, seed: SEED, bg: o.bg || '#b9c6bd', background: o.background || 'halftone', backgroundUrl: o.backgroundUrl });

  const input = makeInput(o.canvas);
  /* KALIBRIERPOSE, eigene Kamera — die Messung darf nicht an der Spielkamera hängen.
     Gemessen 06.09. (Kritiker-Fund): bei yaw 90° / 7,6 u schaut die Spielkamera aus +X auf die
     Referenzkugel, der Key sitzt bei (−1,9 / 7,2 / 3,0) — die 7×7-Probe liest die SCHATTENSEITE,
     die Exposure-Suche läuft in ihre Decke (ΔE 10,84 · exposure 1,50 · 220,185,66 ✗), während
     dieselbe Szene aus der v1-Startpose ΔE 4,42 liest. Damit hängen B1 und C8 aneinander — genau die
     Kopplung, die der Katalog verbietet. Also messen wir aus einer FESTEN Pose auf der Lichtseite. */
  const kalibKamera = new h.THREE.PerspectiveCamera(34, 16 / 9, 0.05, 120);
  kalibKamera.position.set(-1.1, 1.25, 2.9);
  kalibKamera.lookAt(0, 0.6, 0);
  /* SPIELKAMERA ≠ STUDIOKAMERA. host.v1 trägt 34° — ein Porträtobjektiv, das eine Figur schmeichelt.
     Gemessen 06.09. im S0-Prüfblatt: bei 34° und Abstand 6,4 u liegen nur ~46 % der Karte im Bild,
     und selbst am Anschlag 9 u reicht es nicht — Boden C8 (≥ 85 %) wäre mit Georgs Schulter-Kamera
     nie erfüllbar. 50° vertikal ergibt bei 16:9 ~77° horizontal, also 5,1 u Halbbreite auf 6,4 u
     Abstand > 4,5 u Kartenhalbbreite. Die Zahl steht hier, nicht im Gefühl. */
  h.camera.fov = 50; h.camera.updateProjectionMatrix();
  const field = makeField(h.THREE);
  const time = makeTime();
  const cam = makeCam(h.THREE, h.camera, input);
  h.time = time;
  const save = makeSave({ THREE: h.THREE, time });
  const fx = makeFx({ THREE: h.THREE, scene: h.scene, renderer: h.renderer, log });

  /* Frame-Kosten: Ringpuffer über 120 Bilder, Median. Kein Adjektiv, eine Zahl (Boden C7). */
  const ring = []; let bootT0 = performance.now(), bootMs = null, erstesBild = null;
  const messung = { calls: 0, tris: 0, frameMs: null, schritte: 0, bootMs: null, bootHinweis: null };

  /* Kopf- und Schlussglied im Modul-Takt von host.v1: der Wirt fährt zuerst Eingabe/Zeit/Kamera,
     dann laufen die Module, danach räumt der Wirt die Flanken und taktet den FX-Pool.
     So bleibt EIN fester Schritt (host.v1 Akkumulator) — keine zweite Uhr. */
  const kopf = { update: (dt) => { time.tick(dt); cam.step(dt); } };
  const fuss = { update: (dt) => { fx.step(dt, h.camera); input.consume(); messung.schritte++; } };
  h.modules.push(kopf, fuss);
  const ordne = () => { const i = h.modules.indexOf(fuss); if (i >= 0 && i !== h.modules.length - 1) { h.modules.splice(i, 1); h.modules.push(fuss); } };

  const bootzeilen = [];
  /* register wie host.v1, aber gegen den erweiterten Katalog und mit ehrlichem Ausfall (v1-Regel B4). */
  async function register(mod, extra = {}) {
    const d = (mod.constructor && mod.constructor.describe && mod.constructor.describe()) || (mod.describe && mod.describe()) || {};
    const name = d.name || (mod.constructor && mod.constructor.name) || 'modul';
    const caps = d.capabilities || [];
    const fehlt = caps.filter((c) => !CAPABILITIES.includes(c.split(' ')[0]));
    if (fehlt.length) { bootzeilen.push('[' + name + '] AUSFALL: verlangt Unbekanntes — ' + fehlt.join(', ')); log(bootzeilen[bootzeilen.length - 1]); return null; }
    const has = (c) => caps.some((x) => x.startsWith(c));
    const ctx = { camera: h.camera, prepare: h.prepare, log, scene: h.scene, seed: SEED };
    if (has('three')) ctx.three = h.THREE;
    if (has('renderer')) ctx.renderer = h.renderer;
    if (has('clock')) ctx.clock = { step: h.clock.step, now: () => h.clock.t };
    if (has('rng')) ctx.rng = h.rng;
    if (has('assets')) { ctx.assets = h.assets; ctx.gltfLoader = h.gltfLoader; }
    if (has('pointer')) ctx.pointer = h.pointer;
    if (has('pets')) { ctx.eyeRigModule = extra.eyeRigModule || null; ctx.mouthModule = extra.mouthModule || null; }
    if (has('input')) ctx.input = input;
    if (has('field')) ctx.field = field;
    if (has('fx')) ctx.fx = fx;
    if (has('time')) ctx.time = time;
    if (has('save')) ctx.save = save;
    ctx.cam = cam;
    try {
      await mod.init(ctx);
      /* Der Wirt montiert NICHT. `mount(parent)` erwartet den Elternknoten, und ein blindes
         `mod.mount()` hat dem Ring `undefined` gegeben — »Cannot read properties of undefined
         (reading 'add')«, gemessen 06.09. Wer montiert, kennt den Ort: der Integrator. */
      h.modules.push(mod); ordne();
      const t = mod.tor && mod.tor();
      bootzeilen.push('[' + name + '] ' + (t ? 'Tor ' + t.bestanden + '/' + t.von : 'geladen') + ' · ' + caps.join(' '));
    } catch (e) {
      bootzeilen.push('[' + name + '] AUSFALL: ' + ((e && e.message) || e));
    }
    log(bootzeilen[bootzeilen.length - 1]);
    return mod;
  }

  /* Der Takt von host.v1, EINMAL festgehalten. (Erster Wurf rief `h.frameTick` — nach dem
     Object.assign unten war das diese Funktion selbst: Endlosrekursion, kein Bild, keine Zahl.
     Gemessen 06.09. im S0-Prüfblatt: »calls 0 · Frame —« bei sichtbarem Hintergrund.) */
  const v1Tick = h.frameTick;
  /* Ein entsorgter Wirt sieht aus wie ein gesunder: `modules` leer, `render.calls` 0, Kalibrierung
     fällt auf ΔE 21,5. Gemessen 06.09. nach einem Hot-Reload. Also markiert er sich. */
  const v1Dispose = h.dispose;
  function frameTick(now) {
    const t0 = performance.now();
    v1Tick(now);
    const d = performance.now() - t0;
    ring.push(d); if (ring.length > 120) ring.shift();
    const s = ring.slice().sort((a, b) => a - b);
    messung.frameMs = s.length ? +s[Math.floor(s.length / 2)].toFixed(2) : null;
    messung.calls = h.renderer.info.render.calls;
    messung.tris = h.renderer.info.render.triangles;
    /* BOOTZEIT NUR AUS LAUFENDER UHR. Steht der Takt (Fenster verdeckt, rAF gedrosselt — CA-4), dann
       zählt die Wanduhr die Pause mit: gemessen 06.09. »Boot 40 382 ms« nach 40 s im Hintergrund,
       bei einem Budget von 5000. Eine Zahl aus gestoppter Uhr ist keine Zahl, also bleibt sie leer
       und sagt, warum. */
    if (erstesBild == null) erstesBild = performance.now();
    if (bootMs == null && h.clock.frames > 2) {
      const spanne = performance.now() - erstesBild;
      const anlauf = erstesBild - bootT0;
      /* ZWEI Pausen können die Zahl verderben, und die erste Fassung prüfte nur die zweite:
           `anlauf`  Wirt erzeugt → erstes Bild  (hier liegt die gedrosselte Pause im Hintergrund)
           `spanne`  erstes Bild → drittes Bild  (hier liegt eine Drosselung MITTEN im Anlauf)
         Gemessen 06.09. (Kritiker): drei Bilder kamen als Block nach 14 s Hintergrund — `spanne`
         war winzig, die Zahl trotzdem 14 723 ms bei einem Budget von 5000. */
      if (spanne < 2000 && anlauf < 2000) { bootMs = Math.round(performance.now() - bootT0); messung.bootMs = bootMs; messung.bootHinweis = null; }
      else messung.bootHinweis = 'Takt war gedrosselt (CA-4) — keine Boot-Zahl';
    }
  }

  /* Boden C10: Zähler statt Versprechen. Quelltext-Scan über fetch, nur eigene Dateien. */
  /* Kommentare werden ABGEZOGEN, und `(` ist Pflicht: die erste Fassung zählte die Sätze mit,
     in denen dieser Boden erklärt wird (3 Treffer, 0 Aufrufe) — ein Instrument, das sich selbst
     anzeigt. Gemessen und behoben 06.09. */
  const ohneKommentar = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"])\/\/.*$/gm, '$1');
  async function lint(dateien) {
    const liste = dateien || ['./combat-arena-v2/host.v2.js', './combat-arena-v2/floors.v2.js'];
    let treffer = 0; const details = [];
    for (const f of liste) {
      try {
        const r = await fetch(f); const t = await r.text();
        const n = (ohneKommentar(t).match(/Math\s*\.\s*random\s*\(/g) || []).length;
        treffer += n; details.push(f.split('/').pop() + ': ' + n);
      } catch (e) { details.push(f.split('/').pop() + ': nicht lesbar'); }
    }
    return { treffer, details, zeile: '[lint] Math.random-Aufrufe in combat-arena-v2/ (ohne Kommentare): ' + treffer + ' (' + details.join(' · ') + ')' };
  }

  /* Anteil der Karte im Bild (Boden C8): 11 × 11 Punkte über die Bounding-Box, projiziert, gezählt.
     Vier Ecken allein lügen bei Weitwinkel — ein Raster nicht. */
  function karteImBild(n) {
    const b = field.bounds(), N = n || 11, v = new h.THREE.Vector3();
    let drin = 0, ges = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const x = b.x0 + (b.w * i) / (N - 1), z = b.z0 + (b.h * j) / (N - 1);
      if (!field.inside(x, z)) continue;
      ges++;
      v.set(x, field.floorY(), z).project(h.camera);
      if (v.x >= -1 && v.x <= 1 && v.y >= -1 && v.y <= 1 && v.z <= 1) drin++;
    }
    return { anteil: ges ? drin / ges : 0, drin, ges };
  }

  /** Wie GROSS die Figur im Bild ist — in Prozent der Bildhöhe. Das ist die Zahl, die »man erkennt
      die Figur« überhaupt messbar macht: eine Flächenquote der Karte sagt dafür nichts. */
  function figurImBild(obj) {
    if (!obj) return null;
    const T = h.THREE, box = new T.Box3().setFromObject(obj);
    if (!isFinite(box.min.y) || box.isEmpty()) return null;
    const unten = new T.Vector3(box.min.x + (box.max.x - box.min.x) / 2, box.min.y, box.min.z + (box.max.z - box.min.z) / 2);
    const oben = unten.clone(); oben.y = box.max.y;
    const pu = unten.clone().project(h.camera), po = oben.clone().project(h.camera);
    const cv = h.renderer.domElement;
    const px = Math.abs((po.y - pu.y) / 2) * cv.height;
    return { px: Math.round(px), anteil: cv.height ? px / cv.height : 0, hoehe: +(box.max.y - box.min.y).toFixed(2), bildH: cv.height };
  }

  /** Die Kalibrierkamera mit dem Seitenverhältnis des Bildpuffers — sonst liegt die Pixelprobe daneben. */
  function kalibrierPose() {
    const c = h.renderer.domElement;
    kalibKamera.aspect = Math.max(0.1, c.width / Math.max(1, c.height));
    kalibKamera.updateProjectionMatrix();
    return kalibKamera;
  }

  function zeile() {
    return 'arena v2 · Seed ' + SEED + ' · ' + (bootMs != null ? 'Boot ' + bootMs + ' ms' : (messung.bootHinweis || 'bootet')) + ' · calls ' + messung.calls
      + ' · Frame ' + (messung.frameMs != null ? messung.frameMs + ' ms' : '–') + ' · ' + field.zeile();
  }

  Object.assign(h, {
    input, field, time, save, fx, cam, register, frameTick, lint, karteImBild, figurImBild, messung, kalibrierPose,
    tot: false,
    dispose() { h.tot = true; v1Dispose(); },
    zeile, bootzeilen, logzeilen: zeilen, SEED, CARD, BUDGET, CAPABILITIES: CAPABILITIES.slice()
  });
  /* `bootMs` per defineProperty NACH dem Object.assign. Als Getter im Literal wurde er von
     `Object.assign` AUSGEWERTET und sein damaliger Wert (null) als feste Eigenschaft kopiert — der
     Getter kam nie an. `zeile()` las die Closure direkt und zeigte 505 ms, während jeder externe
     Leser `null` bekam: die einzige maschinenlesbare Boot-Zahl war still falsch (Kritiker 06.09.). */
  Object.defineProperty(h, 'bootMs', { get: () => bootMs, configurable: true });
  return h;
}
