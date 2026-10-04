/* KFB WhackMan v1 · Verfolger
   Brief §8. Drei Verfolger, drei VERSCHIEDENE Zielpolitiken — keine vier umgefärbten Gehirne.
   Vier Zustände: CHASE · SCATTER · FRIGHTENED · RETURNING (plus PEN als Startzelle).

   Zwei Regeln, die alles andere tragen:
   1. Gesucht wird auf dem MazeGraph, nie auf einem Mesh. Eine Fackel kann keinen Weg sperren.
   2. Die Kanonik ist der Knoten. Das Whack-Theater (Stauchen, Drehen, Hüpfer) ist ein reiner
      Darstellungsversatz auf dem Holder — die Figur bleibt auf ihrem Graphknoten, auch während
      sie durch die Luft fliegt. Trennung von Zustand und Schauspiel, wie im Storytelling-Maps-
      Vergleich beschrieben. */

import * as THREE from 'three';
import { legacyActor, legacyClips, pickClip, LEGACY_PIN } from './wm-src.js';
import { MazeMotor, VEC, OPP } from './wm-motor.js';
import { bfsCached, key } from './wm-maze.js';

const LEG = 'media/3D_Assets/KayKit Legacy/';
const W = LEG + 'Orc Warband - legacy/characters/gltf/';
const SK = LEG + 'KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/';
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
const REVLEG = LEGACY_PIN;
/* Namen KFB-eigen und änderbar; das Verhalten muss man am Spiel ablesen können, nicht am Namen. */
export const ROSTER = [
  { id: 'abfaenger', name: 'Abfänger', policy: 'intercept', scatter: 1, speed: 1.3,
    src: [W + 'character_orcA.gltf'] },
  { id: 'druck', name: 'Druck', policy: 'pressure', scatter: 3, speed: 1.38,
    src: [W + 'character_orcB.gltf'] },
  { id: 'schnueffler', name: 'Schnüffler', policy: 'forage', scatter: 0, speed: 1.2,
    /* Exakte Dateinamen über die GitHub-Contents-API geholt — der Tree-Leser blendet .gltf aus,
       und geraten hatte ich sie ohne das `character_`-Präfix, also 404. */
    src: [SK + 'character_skeleton_minion.gltf', SK + 'character_skeleton_warrior.gltf'] }
];

const MODE_COLOR = { CHASE: 0xff8a5c, SCATTER: 0x7fd0ff, FRIGHTENED: 0x9b8cff, RETURNING: 0xdedede, PEN: 0xbbbbbb };

export class Pursuer {
  constructor({ def, root, graph, MOD, clips, startNode, slot }) {
    this.def = def;
    this.graph = graph;
    this.MOD = MOD;
    this.slot = slot;
    this.mode = 'PEN';
    this.penTimer = 1.2 + slot * 2.4;
    this.motor = new MazeMotor(graph, { speed: def.speed, start: startNode });
    this.motor.chooser = (node, dir) => this.choose(node, dir);
    this.holder = new THREE.Group();
    this.body = new THREE.Group();
    this.holder.add(this.body);
    root.add(this.holder);
    this.clips = clips;
    this.theatre = null;
    this.yaw = 0;
    this.tellTarget = null;
  }

  mount(actorRoot) {
    const b = new THREE.Box3().setFromObject(actorRoot);
    const s = b.getSize(new THREE.Vector3());
    const k = (this.MOD * 0.58) / Math.max(s.y, 1e-4);
    actorRoot.scale.setScalar(k);
    actorRoot.updateMatrixWorld(true);
    const b2 = new THREE.Box3().setFromObject(actorRoot);
    const c2 = b2.getCenter(new THREE.Vector3());
    actorRoot.position.set(-c2.x, -b2.min.y, -c2.z);
    actorRoot.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.body.add(actorRoot);
    this.actor = actorRoot;
    this.height = s.y * k;
    this.mixer = new THREE.AnimationMixer(actorRoot);
    const pick = (...p) => pickClip(this.clips, ...p);
    this.a = {
      idle: this.act(pick(/^Idle$/i, /idle/i)),
      walk: this.act(pick(/^Walk$/i, /walk/i)),
      run: this.act(pick(/^Run$/i, /run/i)),
      hit: this.act(pick(/^Defeat$/i, /^Roll$/i, /defeat/i))
    };
    this.play('idle');
    return this;
  }

  act(clip) { return clip ? this.mixer.clipAction(clip) : null; }

  play(name) {
    if (this.current === name) return;
    this.current = name;
    for (const [k2, a] of Object.entries(this.a)) {
      if (!a) continue;
      if (k2 === name) { a.reset().play(); a.setEffectiveWeight(1); }
      else a.setEffectiveWeight(0);
    }
  }

  /* ---------- Zielpolitik · aus dem Graph, nicht aus der Kamera ---------- */
  target(world) {
    const P = world.playerNode;
    const g = this.graph;
    if (this.mode === 'SCATTER') return g.scatter[this.def.scatter % g.scatter.length];
    if (this.mode === 'RETURNING') return g.penDoor || g.penNodes[0];
    if (this.mode === 'FRIGHTENED') return null;

    if (this.def.policy === 'pressure') return P;

    if (this.def.policy === 'intercept') {
      /* Ein paar Knoten VOR dem Spieler, entlang seines aktuellen Gangs. So weit, wie der Gang
         wirklich trägt — nicht eine getippte Zahl, die in einer Wand landet. */
      let n = g.nodes.get(P), d = world.playerDir;
      if (!d) return P;
      for (let i = 0; i < 4; i++) {
        const nx = n.nbr[d];
        if (!nx) break;
        n = g.nodes.get(nx);
      }
      return key(n.x, n.y);
    }

    /* forage: das dichteste verbliebene Sammelnest in der Nähe des Spielers. Nicht das nächste
       Pellet — ein Nest. Deshalb wird die Nachbarschaft gezählt, nicht nur der Abstand. */
    if (!world.nest || world.nestAge > 1.1) return world.nest || P;
    return world.nest;
  }

  choose(node, dir) {
    const g = this.graph;
    const n = g.nodes.get(node);
    if (!n) return null;
    const opts = Object.entries(n.nbr);
    if (!opts.length) return null;
    const back = dir ? OPP[dir] : null;
    /* Klassische Regel: an einer Kreuzung wird nicht umgekehrt. Nur wenn es keinen anderen Weg
       gibt (Sackgasse), ist die Umkehr erlaubt. */
    let usable = opts.filter(([d]) => d !== back);
    if (!usable.length) usable = opts;

    if (this.mode === 'FRIGHTENED') {
      return usable[Math.floor(Math.random() * usable.length)][0];
    }
    const t = this._target;
    if (!t) return usable[0][0];
    const dist = bfsCached(g, t);
    let best = null, bd = Infinity;
    for (const [d, k2] of usable) {
      const v = dist.has(k2) ? dist.get(k2) : Infinity;
      if (v < bd) { bd = v; best = d; }
    }
    return best || usable[0][0];
  }

  setMode(m) {
    if (this.mode === m) return;
    this.mode = m;
    if (m === 'FRIGHTENED' && this.motor.dir && this.motor.to) {
      /* Erschrocken: einmal umkehren. Das ist die einzige Stelle, an der ein Verfolger
         mitten auf der Kante dreht — und sie ist sichtbar gewollt. */
      const a = this.motor.from;
      this.motor.from = this.motor.to; this.motor.to = a;
      this.motor.t = 1 - this.motor.t;
      this.motor.dir = OPP[this.motor.dir];
      this.motor.node = this.motor.from;
    }
  }

  whack() {
    this.setMode('RETURNING');
    this.theatre = { t: 0, spin: (Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 5) };
    this.play('hit');
  }

  update(dt, world) {
    /* Pferch: warten, dann durch die Tür raus. */
    if (this.mode === 'PEN') {
      this.penTimer -= dt;
      this.play('idle');
      if (this.penTimer <= 0) this.setMode(world.mode === 'POWERED' ? 'FRIGHTENED' : 'CHASE');
    }

    this._target = this.target(world);
    this.motor.speed = this.def.speed * (this.mode === 'FRIGHTENED' ? 0.62 : this.mode === 'RETURNING' ? 1.9 : 1);

    if (this.mode !== 'PEN') {
      if (!this.motor.to) {
        const d = this.choose(this.motor.node, this.motor.dir);
        if (d) this.motor.start(d);
      }
      this.motor.step(dt, null);
    }

    const p = this.motor.pose();
    const MOD = this.MOD;
    const wx = p.x * MOD, wz = p.y * MOD;
    this.holder.position.set(wx, 0, wz);
    this.node = this.motor.occupies();

    /* Blickrichtung: normalerweise die Fahrtrichtung. G1-Vorstufe — im FRIGHTENED-Zustand
       neigt sich der ganze Körper zum Spieler, weil der EyeRig noch gesperrt ist. */
    let wantYaw = p.yaw;
    if (this.mode === 'FRIGHTENED' && world.playerPos) {
      wantYaw = Math.atan2(world.playerPos.x - wx, world.playerPos.z - wz);
    }
    let d2 = ((wantYaw - this.yaw + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (d2 < -Math.PI) d2 += Math.PI * 2;
    this.yaw += d2 * Math.min(1, dt * 9);
    this.body.rotation.y = this.yaw;

    /* ---------- Whack-Theater · reine Darstellung ----------
       Anschlag, Stauchen, kleiner Abflug, Erholung. Der Knoten darunter bleibt unberührt:
       kein Impuls darf den logischen Zustand verbiegen (Brief §G2). */
    if (this.theatre) {
      const T = this.theatre;
      T.t += dt;
      const u = Math.min(1, T.t / 0.85);
      const arc = Math.sin(u * Math.PI);
      this.body.position.y = arc * this.MOD * 0.55;
      this.body.rotation.z = arc * T.spin * 0.14;
      const sq = 1 + Math.sin(u * Math.PI * 2) * 0.28;
      this.body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
      if (u >= 1) {
        this.theatre = null;
        this.body.position.y = 0;
        this.body.rotation.z = 0;
        this.body.scale.set(1, 1, 1);
      }
    } else if (this.mode !== 'PEN') {
      this.play(this.mode === 'RETURNING' ? 'run' : this.mode === 'FRIGHTENED' ? 'walk' : 'run');
    }

    if (this.mixer) this.mixer.update(dt);

    /* Heimkehr abgeschlossen? */
    if (this.mode === 'RETURNING' && this.graph.penNodes.includes(this.node)) {
      this.mode = 'PEN';
      this.penTimer = 2.2;
    }
  }
}

/* ---------- Aufstellung ----------
   Jeder Akteur muss seine Teile/Bindung BEWEISEN (Brief §3). Ein Modell, das nur rendert, zählt
   nicht — gemeldet wird, wie viele der vier Teile an Bones gebunden wurden. */
export async function mountPursuers({ root, graph, MOD, onProgress = () => {} }) {
  const clips = await legacyClips();
  const pen = graph.penNodes;
  const list = [], report = [];

  for (let i = 0; i < ROSTER.length; i++) {
    const def = ROSTER[i];
    let bound = null, usedPath = null, usedRev = null, lastErr = null;
    for (const path of def.src) {
      for (const rev of [REVLEG, 'main']) {
      /* Erst mit nacktem fetch prüfen, DANN laden. Der Lader in atlas.js cached nach Pfad, nicht
         nach Pfad+Commit — ein Fehlversuch legt dort eine abgelehnte Zusage ab und vergiftet
         jeden weiteren Versuch derselben Datei. Derselbe Befund wie bei Tiny Treats. */
        try {
          const url = RAW + rev + '/' + path.split('/').map(encodeURIComponent).join('/');
          const probe = await fetch(url);
          if (!probe.ok) { lastErr = 'HTTP ' + probe.status + ' @ ' + rev.slice(0, 7) + ' · ' + path.split('/').pop(); continue; }
        } catch (e) { lastErr = 'fetch ' + e.message; continue; }
        try {
          onProgress(`C · ${def.name} wird zusammengesetzt …`);
          const a = await legacyActor(path, rev);
          if (a.report.placed.length < 4) { lastErr = `nur ${a.report.placed.length}/4 Teile gebunden`; continue; }
          bound = a; usedPath = path; usedRev = rev; break;
        } catch (e) { lastErr = e.message; }
      }
      if (bound) break;
    }
    if (!bound) {
      report.push({ id: def.id, name: def.name, status: 'SOURCE_REQUIRED', geprueft: def.src, grund: lastErr });
      continue;
    }
    const p = new Pursuer({
      def, root, graph, MOD, clips,
      startNode: pen[Math.min(i, pen.length - 1)], slot: i
    }).mount(bound.root);
    list.push(p);
    report.push({
      id: def.id, name: def.name, politik: def.policy, status: 'GEBUNDEN',
      quelle: usedPath, revision: usedRev === REVLEG ? 'Legacy-Pin' : usedRev,
      teile: bound.report.placed, fehlend: bound.report.missing,
      hoehe: +p.height.toFixed(3), tempo: def.speed
    });
  }
  return { list, report, clips };
}

export { MODE_COLOR };
