/* KFB WhackMan v1 · GATE C — PlayerMotor + freier Orbit
   Baut auf Gate B auf: dieselbe Kette, dieselben Eigentümer, kein zweites Labyrinth. Neu ist nur
   der Spieler und die Kamerabindung.

   Brief §7, wörtlich eingehalten:
     · dritte Person, freier Orbit, kein Pflicht-Egoblick;
     · die Kamera dreht den Spieler NICHT — sie übersetzt nur seine Absicht (kamerarelativ);
     · gepufferte Abbiegung kurz vor der Kreuzung;
     · kein Diagonalschnitt durch Gänge;
     · A/B-Schalter auf charakterrelative Steuerung, zum Vergleichen. */

import * as THREE from 'three';
import { buildGateB } from './wm-gate-b.js';
import { petePlayer, legacyClips, pickClip } from './wm-src.js';
import { MazeMotor, makeKeys, cameraIntent, toCardinal, VEC, OPP } from './wm-motor.js';
import { mountPursuers } from './wm-pursuers.js';
import { bfs, bfsCached, clearDistCache, mazeGraph, key as nkey } from './wm-maze.js';
import { cellRolesInverted, RECIPE } from './wm-recipe.js';
import { Audio } from './wm-audio.js';
import { LullShow } from './wm-lull.js';
import { clampToMaze, Bounce, pushApart } from './wm-collide.js';

export async function buildGateC({ scene, camera, controls, onProgress = () => {}, label = () => {},
  innenDecken = 'standard', laufflaeche = 'gaenge' }) {
  const B = await buildGateB({ scene, onProgress, label, innenDecken });
  const { MOD, root } = B;
  const WALL_H = B.report.kit.WALL_H;
  const report = B.report;
  report.gate = 'C';

  /* ---------- Lauffläche ----------
     gaenge      der normale Graph: begehbar sind die Gänge.
     wandkronen  der UMGEKEHRTE Graph: begehbar sind die Wandblöcke, und die Figuren stehen
                 wirklich dort oben — kein Höhenversatz über dem Gang, sondern eine andere
                 Wegewahrheit. Georgs Nachsatz „dann aber logisch auf den Innenwänden". */
  const invRoles = laufflaeche === 'wandkronen' ? cellRolesInverted(RECIPE) : null;
  const graph = invRoles ? mazeGraph(invRoles) : B.graph;
  const FLOOR_Y = laufflaeche === 'wandkronen' ? WALL_H + 0.2 : 0;
  report.laufflaeche = laufflaeche;
  if (invRoles) {
    report.invertiert = {
      komponenten: invRoles.komponenten, groesste: invRoles.groesste, verworfen: invRoles.verworfen,
      hinweis: 'Ein Pacman-Grundriss hat einen zusammenhängenden Rand und viele einzelne Innenblöcke. Die Umkehrung ist deshalb ein Ring plus Inseln; nur die grösste Komponente wird bespielt. Ein echtes Wandlauf-Feld braucht eine eigene Rezeptur.'
    };
  }

  onProgress('C · Spieler wird montiert …');
  const clips = await legacyClips();
  const pete = await petePlayer();

  /* Maßstab: der Gang ist ein Modul breit (gemessen 4). Der Akteur bekommt 60 % davon — groß
     genug, dass Körperspiel und später Augen zählen, schmal genug für Ecklesbarkeit. */
  const raw = new THREE.Box3().setFromObject(pete.root).getSize(new THREE.Vector3());
  const targetH = MOD * 0.6;
  const k = targetH / Math.max(raw.y, 1e-4);
  pete.root.scale.setScalar(k);
  pete.root.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(pete.root);
  const c2 = b2.getCenter(new THREE.Vector3());
  pete.root.position.set(-c2.x, -b2.min.y, -c2.z);
  pete.root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  const playerH = targetH;
  const player = new THREE.Group();
  const playerBody = new THREE.Group();
  playerBody.add(pete.root);
  player.add(playerBody);
  root.add(player);

  /* ---------- Fog of War · lokale Aufhellung um den Spieler ----------
     Vorgabe default AUS: die reguläre Dämmerung (wm-boot.js) bleibt der Ausgangszustand, nichts
     ändert sich, solange niemand den Regler bewegt. `setNightVision(0..1)` skaliert ein einziges
     Punktlicht, das dem Spieler folgt — es hellt NUR seine unmittelbare Umgebung auf, nicht die
     Szene insgesamt (kein Eingriff in Hemisphere/Nebel). Stufenlos, damit später ein Sichtradius-
     Wert final abgestimmt werden kann, statt zwischen zwei festen Stufen zu raten. */
  const NIGHTVIS_MAX = 46;
  const nightLight = new THREE.PointLight(0xffe9c8, 0, MOD * 6.5, 1.6);
  root.add(nightLight);

  /* Kein gemalter Kontaktkreis. Der Akteur wirft einen echten Schatten aus der Schattenkarte —
     Georgs Ansage, und sie ist richtig: ein Kreis unter den Füssen liegt bei jeder Kamerahöhe
     falsch und verrät sich auf einer Treppe oder Kante sofort. */

  const mixer = new THREE.AnimationMixer(pete.root);
  const clipIdle = pickClip(clips, /^Idle$/i, /idle/i);
  /* Walk UND Run getrennt halten. Vorher stand hier ein Griff, der zuerst nach `Run` suchte und
     ihn dann bei jedem Tempo abspielte — bei Schrittgeschwindigkeit sah man einen Sprintzyklus,
     der nicht zur Fahrt passte, und darum nichts Lesbares. */
  const clipWalk = pickClip(clips, /^Walk$/i, /walk/i, /^Run$/i);
  const clipRun = pickClip(clips, /^Run$/i, /run/i) || clipWalk;
  const aIdle = clipIdle ? mixer.clipAction(clipIdle) : null;
  const aWalk = clipWalk ? mixer.clipAction(clipWalk) : null;
  const aRun = clipRun && clipRun !== clipWalk ? mixer.clipAction(clipRun) : null;
  aIdle && aIdle.play();
  aWalk && aWalk.play().setEffectiveWeight(0);
  aRun && aRun.play().setEffectiveWeight(0);
  /* Die ganze Enchilada: alle Clips, die das Rig liefert, kommen im Leerlauf dran. */
  const lull = new LullShow({ mixer, clips, nachSekunden: 2.6 });
  report.lull = lull.report;
  report.player = {
    quelle: 'PrototypePete · Rig_Legacy', bones: pete.bones,
    idle: clipIdle ? clipIdle.name : null, locomotion: clipWalk ? clipWalk.name : null,
    hoehe: +(raw.y * k).toFixed(3), skaliert: +k.toFixed(3), modul: MOD
  };

  /* Tempo: 2,7 Zellen/s sind bei Modul 4 rund 10,8 Einheiten/s — für eine Figur von 2,4
     Einheiten Höhe gut viereinhalb Körperlängen je Sekunde. Man sah einen Strich, keine Figur,
     und kein Gangbild hält dabei mit. 1,45 sind 5,8 Einheiten/s — zügig, aber lesbar. */
  const BASE_SPEED = 1.45;
  const SPRINT = 1.55;
  const motor = new MazeMotor(graph, { speed: BASE_SPEED });
  const LEFT = { N: 'W', W: 'S', S: 'E', E: 'N' }, RIGHT = { N: 'E', E: 'S', S: 'W', W: 'N' };
  const edge = { left: false, right: false };     // Flankenerkennung für A/D
  let face = 'E';                                 // Blickrichtung, eigener Zustand
  /* Anfangsblick auf eine LEGALE Richtung setzen. Ohne das schaut der Akteur nach Norden, und
     nördlich vom Start steht Wand — die erste Taste, die jemand drückt, tut dann nichts, und das
     sieht aus wie eine kaputte Steuerung statt wie ein Grundriss. */
  for (const d of ['N', 'E', 'S', 'W']) if (motor.legal(motor.node, d)) { motor.dir = d; break; }
  face = motor.dir || 'E';
  report.startBlick = face;
  const keys = makeKeys(window);

  /* ---------- Zwei Kameras, ein Schalter ----------
     VERFOLGER ist die Vorgabe und die Ansicht, die Georg als Ausgangspunkt benannt hat
     (butchler/Pacman-3D, gh-pages): schräg hinter dem Akteur, mitdrehend, kein Orbit. Sie macht
     die Steuerung eindeutig, weil „vorwärts" immer Bildschirm-oben ist.
     ORBIT ist die freie Inspektion aus Gate B — bleibt erhalten, weil der Brief sie fordert und
     weil die Darstellungsoptionen laut Georg später gegeneinander getestet werden sollen. */
  const spawnN = graph.nodes.get(graph.spawn);
  const follow = new THREE.Vector3(spawnN.x * MOD, MOD * 0.35, spawnN.y * MOD);
  /* Die Verfolgerkamera muss UNTER die Decke. Erste Fassung stand auf 2,2 Modulen Höhe, die
     Decke liegt auf 4 Einheiten — die Kamera sass also darüber, jede Deckenplatte lag in der
     Sichtlinie und wurde freigeblendet: ein weisser Schleier statt eines Dungeons. */
  /* ---------- Verfolgerkamera · Zahlen aus der Referenz, nicht geschätzt ----------
     butchler/Pacman-3D@gh-pages · game.js `updateCamera`, Zellmaß dort 1:

         targetPosition = pacman + UP * 1.5 + direction * (-1)
         targetLookAt   = pacman + direction * 1
         lerp(delta * 10);   PerspectiveCamera(65, …)

     In Modulen: Kamera 1,5 Zellen hoch, 1,0 Zellen hinter dem Akteur, Blickpunkt 1,0 Zellen
     davor auf Akteurshöhe, Blickwinkel 65°, Nachführung 10·dt.

     Der entscheidende Punkt, den ich vorher falsch hatte: dort ist die Wand EINE Zelle hoch und
     die Kamera sitzt eine volle Zelle ÜBER der Wandkrone. Man schaut also auf die Wandoberseiten
     hinunter — das ist die „Decken-Konstruktion" der Referenz. Es gibt dort keine Deckenplatte.
     Meine Kamera stand auf 0,78 Wandhöhen, also darunter: ein Korridorblick, kein Spielfeld. */
  const CHASE = { dist: MOD * 1.0, height: MOD * 1.5, lookAhead: MOD * 1.0, lookY: MOD * 0.3, smooth: 10, fov: 65 };
  controls.target.copy(follow);
  /* Startkamera aus der Blickrichtung, nicht stur nach Süden. Die erste Fassung setzte
     `follow.z + dist` — bei Blick nach Osten stand sie damit hinter der Südwand ausserhalb des
     Labyrinths, und bis zum ersten Tick war das Bild fast schwarz. */
  const ORBIT_FOV = camera.fov;
  {
    const fv = VEC[face] || [0, 1];
    camera.fov = CHASE.fov;
    camera.updateProjectionMatrix();
    camera.position.set(follow.x - fv[0] * CHASE.dist, CHASE.height, follow.z - fv[1] * CHASE.dist);
    camera.lookAt(follow.x + fv[0] * CHASE.lookAhead, CHASE.lookY, follow.z + fv[1] * CHASE.lookAhead);
  }
  controls.minDistance = MOD * 1.4;
  controls.maxDistance = MOD * 22;
  controls.update();
  const camWant = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  let camYawSmooth = 0;
  const camRay = new THREE.Raycaster();
  const back = new THREE.Vector3();

  /* ---------- Freier Blick in der Verfolgerkamera, mit Rückkehr ----------
     Ziehen dreht/hebt den Blick frei um den Akteur — zum Umschauen, Deko prüfen, fotografieren.
     Sobald sich der Akteur wieder bewegt, federt der Blick von selbst zurück in die normale
     Rahmung hinter ihm; kein Umschalten nötig, kein Zustand, der aktiv zurückgesetzt werden
     müsste. Nur in der Verfolger-Ansicht aktiv — Orbit/Freiflug haben ihre eigene Kamera. */
  let lookYaw = 0, lookPitch = 0, dragging = false, dragX = 0, dragY = 0, zoom = 1;
  const domEl = controls.domElement;
  domEl.addEventListener('pointerdown', (e) => {
    if (state.view !== 'verfolger') return;
    dragging = true; dragX = e.clientX; dragY = e.clientY;
  });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointermove', (e) => {
    if (!dragging || state.view !== 'verfolger') return;
    lookYaw -= (e.clientX - dragX) * 0.0055;
    lookPitch = Math.max(-0.46, Math.min(0.46, lookPitch - (e.clientY - dragY) * 0.0035));
    dragX = e.clientX; dragY = e.clientY;
  });
  /* Scroll/Touch-Zoom mit Cursor-Fokus: rein/raus über den normalen Abstand, UND der Blick
     wandert dabei ein Stück in Richtung Cursor — man zoomt zu dem hin, wohin der Zeiger zeigt,
     nicht stur zur Bildmitte. Am Canvas selbst (nicht window), damit preventDefault die Seite
     nicht mitscrollt. */
  domEl.addEventListener('wheel', (e) => {
    if (state.view !== 'verfolger') return;
    e.preventDefault();
    const r = domEl.getBoundingClientRect();
    const ndcX = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ndcY = -((e.clientY - r.top) / r.height) * 2 + 1;
    const dir = e.deltaY > 0 ? 1 : -1;
    zoom = Math.min(2.6, Math.max(0.42, zoom * (1 + dir * 0.09)));
    const pull = dir < 0 ? 0.05 : 0.018;
    lookYaw = Math.max(-1.15, Math.min(1.15, lookYaw + ndcX * pull));
    lookPitch = Math.max(-0.46, Math.min(0.46, lookPitch - ndcY * pull * 0.6));
  }, { passive: false });

  /* ---------- VFX · Interpunktion, kein Dauerfeld (Brief §13) ----------
     Ein kurzer Stoß aus wenigen Punkten am Ereignisort. Wiederverwendet statt neu erzeugt:
     ein Pool, damit ein Treffer keinen Allokationshaken in die Bildrate schlägt. */
  const SPARKS = 14;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(SPARKS * 3);
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  /* Runde, weiche Punkte statt der PointsMaterial-Standardquadrate: dieselbe Radial-Gradient-
     Textur-Technik wie die Fackelglut in wm-gate-b.js, additiv für einen kleinen Glanz statt
     harter Kanten. kfb-cartoon-animation_v2 §4.3: Kontakt-VFX bleibt klein, gefüllt, kurz. */
  const sparkTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,.75)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 32, 32);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const sparkMat = new THREE.PointsMaterial({
    size: MOD * 0.1, map: sparkTex, transparent: true, opacity: 0,
    depthWrite: false, blending: THREE.AdditiveBlending
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  root.add(sparks);
  const sparkV = [];
  for (let i = 0; i < SPARKS; i++) sparkV.push(new THREE.Vector3());
  let sparkT = 9;
  function burst(pos, color) {
    sparkMat.color.setHex(color);
    for (let i = 0; i < SPARKS; i++) {
      const a = (i / SPARKS) * Math.PI * 2 + Math.random();
      const s = MOD * (0.05 + Math.random() * 0.06);
      sparkV[i].set(Math.cos(a) * s, (0.5 + Math.random()) * s * 1.8, Math.sin(a) * s);
      sparkPos[i * 3] = pos.x; sparkPos[i * 3 + 1] = pos.y + MOD * 0.3; sparkPos[i * 3 + 2] = pos.z;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkT = 0;
  }

  /* ---------- Sprung ----------
     Ein Offset ÜBER FLOOR_Y, kein Eingriff in den Graphen: der Knoten bleibt unberührt, während
     die Figur in der Luft ist. Dieselbe Trennung wie beim Whack-Theater — Schauspiel darf
     fliegen, der kanonische Zustand nicht. Geschrieben wird NACH der Bodenposition, sonst
     überschreibt `player.position.set(wx, FLOOR_Y, wz)` den Sprung in jedem Bild. */
  const SPRUNG = { v0: MOD * 2.6, g: MOD * 9.5 };
  let jumpY = 0, jumpV = 0, jumpEdge = false;

  /* ---------- Kontakt-Feedback · Spieler ----------
     Ursache → Ausschlag → Rückkehr (kfb-cartoon-animation_v2 §1.2): ein Treffer wirbelt den
     Spieler hoch (Y-Impuls + Spin), lässt ihn fallen, staucht ihn beim Aufprall, und die
     Feder holt ihn danach selbst zurück in die Standpose — kein Einzel-Tween mit fester Dauer,
     sondern derselbe additive Bounce-Versatz wie bei Verfolgern/Sammelgut. */
  const playerBounce = new Bounce();

  let firstFrame = true;
  const state = {
    mode: 'charakter',              // A/B: 'kamera' | 'charakter' — Vorgabe wie Pacman-3D
    view: 'verfolger',              // verfolger | draufsicht | orbit | freiflug
    figurenHoehe: 'boden',          // boden | wandkrone
    collected: new Set(),
    score: 0,
    nightVision: 0,                 // 0 = reguläre Dämmerung, 1 = volle Aufhellung um den Spieler
    invuln: 0,                      // kurze Unverwundbarkeit nach einem Treffer
    /* ---------- Spielzustand · Brief §8 ---------- */
    lauf: 'chill',                  // chill = hält an, wenn niemand drückt · pacman = läuft weiter
    phase: 'READY',                 // READY · PLAYING · POWERED · HIT · CLEAR
    phaseT: 0,
    powerLeft: 0,
    lives: 3,
    whacks: 0,
    wave: 0,                        // Scatter/Chase-Wechsel
    waveT: 0
  };
  const POWER_SECONDS = 7.5;
  const WAVES = [['SCATTER', 6], ['CHASE', 18], ['SCATTER', 5], ['CHASE', 22], ['SCATTER', 4], ['CHASE', 1e9]];

  /* Sammelgut nach Knoten, damit Aufsammeln eine Graphenabfrage ist und kein Abstandstest
     gegen jedes Mesh. */
  const byNode = new Map();
  for (const g of B.pickups.pellets) byNode.set(g.userData.node, { g, kind: 'pellet' });
  for (const g of B.pickups.specials) byNode.set(g.userData.node, { g, kind: 'special' });
  for (const g of B.pickups.story) byNode.set(g.userData.node, { g, kind: 'story' });
  for (const [k, e] of byNode) {
    const bb = new THREE.Box3().setFromObject(e.g);
    const s = bb.getSize(new THREE.Vector3());
    e.r = Math.max(s.x, s.z) / 2;          // gemessen, nicht geschätzt
    /* Ruhehöhe HIER festhalten, nicht aus userData lesen: Gate B schreibt `baseY` nur auf die
       Pellets. Specials und Story-Stücke hatten keins — `ziel = undefined` hat die Feder auf NaN
       gezogen, und ein Objekt mit NaN-y verschwindet lautlos aus dem Bild. Genau das sah aus wie
       „die Figuren laufen durch die Dots": es war nichts mehr da, was hätte reagieren können. */
    e.baseY = e.g.position.y;
    e.baseX = e.g.position.x;
    e.baseZ = e.g.position.z;
    let h = 0; for (let i = 0; i < String(k).length; i++) h = (h * 31 + String(k).charCodeAt(i)) % 997;
    e.phase = (h / 997) * 6.283;
    Object.assign(e.g.userData, { st: 0, vx: 0, vy: 0, vz: 0, sq: 0, sqv: 0, spin: 0, tilt: 0, kalt: 0, weg: 0, hop: 0, hopTarget: 0, hopV: 0 });
  }
  /* Ein Tritt: Impuls nach oben, seitlich WEG vom Tretänder, Drall und eine Vorstreckung.
     `art` 1 = getreten (hüpft aus und bleibt liegen), 2 = eingesammelt (fliegt und schrumpft). */
  function werfen(e, ax, az, kraft, art) {
    const ud = e.g.userData;
    let dx = e.g.position.x - ax, dz = e.g.position.z - az;
    const d = Math.hypot(dx, dz) || 1;
    dx /= d; dz /= d;
    ud.st = art;
    ud.vy = kraft;
    ud.vx = dx * kraft * (art === 2 ? 0.08 : 0.26);
    ud.vz = dz * kraft * (art === 2 ? 0.08 : 0.26);
    ud.spin = (dx + dz > 0 ? 1 : -1) * (7 + Math.random() * 5);
    ud.tilt = 0.32;
    ud.sq = -0.45; ud.sqv = 0;                 // Vorstreckung im Absprung
    ud.kalt = 0.55;
    ud.weg = 0;
  }
  const PLAYER_R = MOD * 0.22;
  report.pickupNodes = byNode.size;

  /* ---------- Verfolger ---------- */
  if (!graph.penNodes.length) {
    /* Kein Pferch auf der umgekehrten Fläche — die Verfolger starten dann auf den Streuzielen
       und gehen sofort in CHASE. Benannt, nicht gebastelt. */
    graph.penNodes = graph.scatter.slice(0, 3);
  }
  /* ---------- Klang ----------
     Dateien aus dem Repo-Manifest `media/3D_Assets/Audio/sfx.json`, nicht aus einer eigenen
     Liste. Das Manifest ist dort ausdrücklich als Wahrheit benannt — die Ordneransicht meldet
     den Audio-Ordner fälschlich als leer. */
  const audio = new Audio();
  try { report.audio = await audio.load(); } catch (e) { report.audio = { fehler: e.message }; }
  window.addEventListener('keydown', () => audio.arm(), { once: true });
  window.addEventListener('pointerdown', () => audio.arm(), { once: true });

  B.ownPickupY = true;
  const P = await mountPursuers({ root, graph, MOD, onProgress });
  const pursuers = P.list;
  report.pursuers = P.report;

  /* Sammelnest für den Schnüffler: der Knoten mit den meisten übrigen Sammelplätzen in zwei
     Zellen Umkreis, gewichtet mit der Nähe zum Spieler. Alle 1,1 s neu — eine Suche über 123
     Knoten pro Bild wäre Verschwendung für eine Zahl, die sich langsam ändert. */
  const world = { playerNode: graph.spawn, playerDir: null, playerPos: null, mode: 'PLAYING', nest: null, nestAge: 9 };
  function findNest() {
    const remaining = [...byNode.keys()].filter((k) => !state.collected.has(k));
    if (!remaining.length) { world.nest = world.playerNode; return; }
    /* Dichte über ein Zellraster statt über ein Paarprodukt: die erste Fassung verglich jedes
       Restpellet mit jedem anderen — 113² Vergleiche, 1,1 s getaktet, und das reichte zusammen
       mit den Suchläufen der Verfolger, um die Seite stehen zu lassen. */
    const at = new Set(remaining);
    const pd = bfsCached(graph, world.playerNode);
    let best = null, bs = -Infinity;
    for (const k of remaining) {
      const n = graph.nodes.get(k);
      let dense = 0;
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          if (Math.abs(dx) + Math.abs(dy) > 2) continue;
          if (at.has(nkey(n.x + dx, n.y + dy))) dense++;
        }
      }
      const d = pd.has(k) ? pd.get(k) : 99;
      const s = dense * 2 - d;
      if (s > bs) { bs = s; best = k; }
    }
    world.nest = best;
  }

  const yawTo = (a, b, f) => {
    let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (d < -Math.PI) d += Math.PI * 2;
    return a + d * f;
  };

  /* ---------- Sichtbarkeit · Brief §7 „camera collision/readability" ----------
     Eine Wand zwischen Kamera und Akteur wird durchscheinend, statt die Kamera zu verschieben.
     Verschieben würde den freien Orbit wegnehmen; Durchscheinen nimmt nur die Wand weg.
     Material wird beim ersten Mal geklont — buildScene teilt Materialien zwischen allen Klonen,
     ein direkter Eingriff hätte das ganze Labyrinth durchsichtig gemacht. */
  const blockers = [], ceilingNodes = [];
  for (const n of root.children) {
    const rec = n.userData.recipe;
    if (!rec) continue;
    /* Blockdächer gehören NICHT in die Sichtlinie. Sie sind die Oberfläche, über die die
       Verfolgerkamera schaut — jeder Strahl streift Dutzende davon, und setFade() klont dabei
       Materialien. Das hat die Seite zum Stehen gebracht. Der Gang, in dem der Akteur steht,
       hat ohnehin kein Dach. */
    if (rec.layer === 'ceiling') { ceilingNodes.push(n); blockers.push(n); }
    else if (rec.layer === 'wall' || rec.layer === 'corner') blockers.push(n);
  }
  const ray = new THREE.Raycaster();
  let faded = [];
  const setFade = (node, on) => {
    node.traverse((o) => {
      if (!o.isMesh) return;
      if (!o.userData.ownMat) {
        o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone();
        o.userData.ownMat = true;
      }
      for (const m of [].concat(o.material)) {
        m.transparent = on;
        m.opacity = on ? 0.16 : 1;
        m.depthWrite = !on;
        /* Nur anfassen, was wirklich ein dekodiertes Bild hat — sonst meldet three für jede
           noch unterwegs befindliche Karte „Texture marked for update but no image data found".
           Derselbe Guard wie in repairTextures; das Klonen hier hatte ihn nicht. */
        if (m.map && !m.map.image) m.map.needsUpdate = false;
        m.needsUpdate = true;
      }
    });
  };
  /* EIN Strahl auf die Fuesse reicht nicht: Kopf und Rumpf werden von ANDEREN Wandteilen
     gedeckt, und die behalten dann ihren Tiefenschreiber. Gemessen war der Kopfpixel [81,80,88]
     statt [235,215,116] — der Akteur war da, aber hinter zwei Teilen, von denen nur eines
     freigeblendet wurde. Also wird die ganze Silhouette abgetastet: Fuesse, Mitte, Kopf und
     beide Schultern, und die VEREINIGUNG der Treffer wird durchscheinend. */
  const SAMPLES = [
    [0, 0.12, 0], [0, 0.32, 0], [0, 0.58, 0],
    [-0.16, 0.42, 0], [0.16, 0.42, 0], [0, 0.42, -0.16], [0, 0.42, 0.16]
  ];
  const aim = new THREE.Vector3();
  function clearSight() {
    const want = new Set();
    for (const [ox, oy, oz] of SAMPLES) {
      aim.set(player.position.x + ox * MOD, oy * MOD, player.position.z + oz * MOD).sub(camera.position);
      const dist = aim.length();
      ray.set(camera.position, aim.normalize());
      ray.far = dist - MOD * 0.22;
      for (const hit of ray.intersectObjects(blockers.filter((n) => n.visible), true)) {
        let n = hit.object;
        while (n.parent && n.parent !== root) n = n.parent;
        want.add(n);
      }
    }
    for (const n of faded) if (!want.has(n)) setFade(n, false);
    for (const n of want) if (!faded.includes(n)) setFade(n, true);
    faded = [...want];
  }

  /* ---------- Deckenloch ----------
     Georgs Vorgabe: das Spielfeld soll von oben GESCHLOSSEN lesen. Ein voll geschlossenes Dach
     zeigt aber nur ein Dach. Also bleibt die Decke stehen und bekommt ein Loch dort, wo gespielt
     wird — nah am Akteur offen, ein Ring halbdurchsichtig, weiter draussen dicht. Ein
     Abstandstest je Platte, kein Strahl. */
  const CEIL = { open: MOD * 1.9, soft: MOD * 3.4 };
  for (const n of ceilingNodes) {
    n.userData.cell = n.userData.recipe.cell;
    n.userData.op = -1;
  }
  report.blockroofs = root.children.filter((n) => n.userData.recipe && n.userData.recipe.layer === 'blockroof').length;
  function ceilingHole() {
    const px = motor.pose().x, py = motor.pose().y;
    for (const n of ceilingNodes) {
      const [cx, cy] = n.userData.cell;
      const d = Math.hypot((cx - px) * MOD, (cy - py) * MOD);
      const want = d < CEIL.open ? 0 : d < CEIL.soft ? 0.3 : 1;
      if (want === n.userData.op) continue;
      n.userData.op = want;
      n.visible = want > 0;
      n.traverse((o) => {
        if (!o.isMesh) return;
        if (!o.userData.ownMat) {
          o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone();
          o.userData.ownMat = true;
        }
        for (const m of [].concat(o.material)) {
          m.transparent = want < 1;
          m.opacity = want;
          m.depthWrite = want >= 1;
        }
      });
    }
  }

  /* Anfangsblick des Akteurs UND der Kamera aus der gewählten Startrichtung. Ohne das steht die
     Kamera auf Yaw 0, also im Norden hinter dem Spieler — und nördlich vom Start ist Wand: der
     erste Eindruck war eine blanke Steinfläche. */
  let yaw = motor.dir ? Math.atan2(VEC[motor.dir][0], VEC[motor.dir][1]) : 0;
  camYawSmooth = yaw;
  let walkW = 0, runW = 0, sightTick = 0, lichtTick = 9;
  const camDir = new THREE.Vector3();

  const api = {
    root, report, graph, MOD, motor, state, pickups: B.pickups, pursuers,
    views: [{ id: 'C', title: 'C · Spiel', group: root }],
    setMode(m) { state.mode = m; },
    setAudio(v) { audio.setOn(v); },
    setLauf(v) { state.lauf = v; },
    setNightVision(v) { state.nightVision = Math.min(1, Math.max(0, v)); nightLight.intensity = state.nightVision * NIGHTVIS_MAX; },
    lullTitel() { return lull.titel; },
    audio,
    /* Für Prüfläufe: Motor UND Blickrichtung zurücksetzen. `motor.reset()` allein lässt `face`
       stehen, und ein Test, der danach „vorwärts" drückt, misst die alte Blickrichtung. */
    resetTo(nodeKey) {
      motor.reset(nodeKey);
      for (const d of ['N', 'E', 'S', 'W']) if (motor.legal(motor.node, d)) { motor.dir = d; break; }
      face = motor.dir || 'E';
      yaw = Math.atan2(VEC[face][0], VEC[face][1]);
      camYawSmooth = yaw;
      firstFrame = true;
    },
    /* ---------- Vier Ansichten ----------
       verfolger   Referenzkamera aus Pacman-3D, hinter dem Akteur
       draufsicht  klassische Pacman-Lesart: senkrecht von oben, mitwandernd
       orbit       freie Inspektion des ganzen Grundrisses
       freiflug    God-Mode für Editorarbeit: Kamera frei mit WASD/QE, Akteur steht */
    setView(v) {
      state.view = v;
      controls.enabled = v === 'orbit' || v === 'freiflug';
      camera.fov = v === 'verfolger' ? CHASE.fov : v === 'draufsicht' ? 42 : ORBIT_FOV;
      camera.updateProjectionMatrix();
      firstFrame = true;
      if (v === 'orbit') {
        controls.target.copy(follow);
        camera.position.set(follow.x, follow.y + MOD * 6, follow.z + MOD * 4.6);
        controls.update();
      } else if (v === 'freiflug') {
        controls.target.copy(follow);
        camera.position.set(follow.x + MOD * 4, WALL_H + MOD * 5, follow.z + MOD * 8);
        controls.update();
      }
    },

    hud() {
      const ph = state.phase === 'POWERED' ? `POWERED ${state.powerLeft.toFixed(1)}s`
        : state.phase === 'AUS' ? 'AUS · Neustart …'
          : state.phase === 'CLEAR' ? 'FELD LEER · Neustart …' : state.phase;
      const n = lull.titel;
      return `${state.collected.size} / ${byNode.size} · ${ph} · ${'♥'.repeat(Math.max(0, state.lives))}` +
        (n ? ` · ${n}` : '') +
        (state.whacks ? ` · ${state.whacks} Whacks` : '') +
        ` · ${pursuers.map((g) => g.def.name[0] + ':' + g.mode[0]).join(' ')}`;
    },
    update(dt, t) {
      B.update(dt, t);

      /* ---------- Input → MovementIntent ---------- */
      let intent = null;
      if (state.view === 'freiflug') {
        intent = null;                       // God-Mode: die Tasten gehören der Kamera
      } else if (state.mode === 'kamera') {
        camera.getWorldDirection(camDir);
        const v = cameraIntent(keys, camDir.x, camDir.z);
        intent = toCardinal(v.vx, v.vz);
      } else {
        /* Charakterrelativ, Panzersteuerung wie in der Referenz: A/D DREHEN, W/S fahren.
           Die Drehung ist FLANKENGESTEUERT — eine gehaltene Taste hat den Akteur vorher einmal
           pro Bild weitergedreht und ihn damit im Kreis geschickt (gemessen: E→N→W→S→E, fünf
           Drehungen in drei Sekunden, zurück auf Ost). Blickrichtung ist ein eigener Zustand,
           damit ein zugestellter Gang wenigstens ein Hinschauen erlaubt statt gar nichts. */
        /* KFB-Standardbelegung: A/D drehen, W/S vor und zurück, Q/E seitwärts ohne die
           Blickrichtung zu ändern, Shift rennt, Space springt. Drehen bleibt flankengesteuert —
           eine gehaltene Taste hat den Akteur sonst im Kreis geschickt. */
        if (state.view === 'freiflug') { /* Tasten gehören der Kamera */ }
        else {
          if (keys.left && !edge.left) face = LEFT[face];
          if (keys.right && !edge.right) face = RIGHT[face];
          edge.left = keys.left;
          edge.right = keys.right;
          if (keys.up) intent = face;
          else if (keys.down) intent = OPP[face];
          else if (keys.strafeL) intent = LEFT[face];
          else if (keys.strafeR) intent = RIGHT[face];
          else if (!motor.to) motor.face(face);      // Drehen auf der Stelle
        }
      }

      /* ---------- MazeMotor → player transform ----------
         Im Chill&Fun-Modus hält der Akteur an, sobald niemand drückt. Dauerlauf ist der
         Pacman-Modus und ein eigener Schalter — Georgs Trennung. */
      const drive = state.view === 'freiflug' ? false
        : (keys.up || keys.down || keys.strafeL || keys.strafeR || state.lauf === 'pacman');
      motor.continuous = state.lauf === 'pacman';
      /* Shift rennt. Der Wert ist ein Faktor auf die eine Geschwindigkeit, nicht ein zweiter
         Bewegungspfad — sonst driften Sammeln und Kollision auseinander. */
      motor.speed = BASE_SPEED * (keys.run ? SPRINT : 1);
      const p = motor.step(dt, intent, drive);
      const rawX = p.x * MOD, rawZ = p.y * MOD;
      /* Sicherheitsklemme auf der begehbaren Fläche (Zelle + Nachbarn), unabhängig vom Motor.
         Der Motor liefert schon eine legale Position — das hier fängt seitliches Herausrutschen
         ab, das aus der Darstellung kommt (Root-Motion in Idle-Clips), nicht aus der Bewegung. */
      const clamped = clampToMaze(rawX, rawZ, graph, motor.node, MOD, PLAYER_R, motor.to);
      const wx = clamped.x, wz = clamped.z;

      /* ---------- Kontakt-Feedback anwenden · additiv, nie ersetzend ---------- */
      playerBounce.update(dt, { k: 90, damp: 9, gravity: MOD * 13 });
      const bounced = clampToMaze(wx + playerBounce.x, wz + playerBounce.z, graph, motor.node, MOD, PLAYER_R * 0.6, motor.to);
      player.position.set(bounced.x, FLOOR_Y + jumpY + playerBounce.y, bounced.z);
      const bsq = 1 + playerBounce.sq * 0.34;
      playerBody.scale.set(1 / Math.sqrt(Math.max(0.35, bsq)), Math.max(0.35, 1 - playerBounce.sq * 0.42), 1 / Math.sqrt(Math.max(0.35, bsq)));
      playerBody.rotation.y = playerBounce.rot;
      /* Die Blickrichtung gehört der EINGABE, nicht der Fahrt. Sie aus `p.dir` zurückzuschreiben
         war beim Rückwärtsfahren eine Rückkopplung: `intent = OPP[face]`, dann `face = p.dir`
         (die Gegenrichtung), also im nächsten Bild wieder die Umkehrung — der Motor kehrte jedes
         Bild um, `t` fiel auf ~0 zurück und S bewegte gar nichts. Nachgezogen wird `face` nur
         beim Vorwärtsfahren, wo der Gang die Richtung diktiert. */
      /* Die Blickrichtung gehört der EINGABE. Aus der Fahrt wird sie nur in EINEM Fall
         nachgezogen: wenn der Gang die Richtung erzwungen hat (`forcedTurn`) — eine Kurve, die
         man fährt, weil es nicht anders geht.

         Zwei Fassungen davor waren falsch, beide aus demselben Grund: sie liessen die Fahrt in
         `face` schreiben. Erst hing der Schutz an `keys.down`, dann kippte `face` in den sechs
         Zellen, die der Akteur nach dem Loslassen noch rückwärts rollt. Dann hing er an
         `!motor.buffer` — und überschrieb einen A-Tipp in genau dem Fenster, in dem die
         gewünschte Abbiegung am Ankunftsknoten noch nicht legal und deshalb noch nicht
         gepuffert war. Die sichtbare Drehung kommt ohnehin aus `p.yaw`; `face` ist Steuerung,
         keine Anzeige. */
      if (p.moving && motor.forcedTurn && p.dir) face = p.dir;
      if (p.moving) yaw = yawTo(yaw, p.yaw, Math.min(1, dt * 12));
      else if (state.mode === 'charakter') {
        const fv = VEC[face];
        yaw = yawTo(yaw, Math.atan2(fv[0], fv[1]), Math.min(1, dt * 10));
      }
      player.rotation.y = yaw;

      /* Gehen/Stehen überblenden statt hart schalten. */
      /* Space: Flanke, nicht Dauerdruck — sonst klebt die Figur an der Decke. */
      if (keys.jump && !jumpEdge && jumpY <= 0.001) {
        jumpV = SPRUNG.v0;
        audio.play('ui', { rate: 1.6, gain: 0.5 });
        const j = lull.actions && (lull.actions.get('Jump') || lull.actions.get('Hop'));
        if (j) { j.reset(); j.setEffectiveWeight(1); j.play(); }
      }
      jumpEdge = keys.jump;
      if (jumpV !== 0 || jumpY > 0) {
        jumpV -= SPRUNG.g * dt;
        jumpY += jumpV * dt;
        if (jumpY <= 0) { jumpY = 0; jumpV = 0; }
      }

      const nummer = lull.update(dt, p.moving || jumpY > 0);
      const want = p.moving ? 1 : 0;
      walkW += (want - walkW) * Math.min(1, dt * 9);
      /* Sprint blendet auf Run, sonst Walk — und der Zyklus läuft mit dem TEMPO, nicht mit einer
         festen Rate. Ohne das rutschen die Füsse über den Boden und die Bewegung wirkt gefahren
         statt gegangen. */
      const rW = aRun ? (keys.run ? 1 : 0) : 0;
      runW += (rW - runW) * Math.min(1, dt * 6);
      const tempo = motor.speed / BASE_SPEED;
      aWalk && aWalk.setEffectiveWeight(walkW * (1 - runW)).setEffectiveTimeScale(tempo);
      aRun && aRun.setEffectiveWeight(walkW * runW).setEffectiveTimeScale(Math.max(0.8, tempo / SPRINT));
      /* Während einer Leerlauf-Nummer tritt Idle zurück, sonst überlagern sich zwei Posen. */
      aIdle && aIdle.setEffectiveWeight(nummer ? 0 : 1 - walkW);
      mixer.update(dt);

      /* ---------- player transform → CameraFollowTarget ----------
         Das Ziel wird HART gesetzt, nicht interpoliert. Die erste Fassung hat es weichgezogen,
         während OrbitControls mit eigener Dämpfung dieselbe Kamera schrieb — zwei Schreiber auf
         einem Zustand, und das war das Ruckeln beim Einschwingen. Weich ist die Bewegung des
         Akteurs; die Kamera hängt nur dran. */
      /* ---------- Figuren auf der Wandkrone ----------
         Reine DARSTELLUNG: die Y-Lage wird gehoben, der Graphknoten bleibt unberührt. Genau die
         Trennung, die der Brief für das Whack-Theater verlangt — Schauspiel darf wild sein,
         der kanonische Zustand nicht. */
      const lift = FLOOR_Y;
      player.position.y = lift + jumpY + playerBounce.y;
      for (const g of pursuers) g.holder.position.y = lift;

      follow.set(wx, lift + MOD * 0.35, wz);
      if (state.view === 'freiflug') {
        /* God-Mode: der Akteur steht, die Kamera fliegt. WASD in der Blickebene, Q/E in der Höhe. */
        const sp = MOD * 6 * dt;
        camera.getWorldDirection(camDir);
        const f = new THREE.Vector3(camDir.x, 0, camDir.z).normalize();
        const r = new THREE.Vector3(-f.z, 0, f.x);
        const mv = new THREE.Vector3();
        if (keys.up) mv.add(f);
        if (keys.down) mv.sub(f);
        if (keys.right) mv.add(r);
        if (keys.left) mv.sub(r);
        if (keys.strafeR) mv.y += 1;
        if (keys.strafeL) mv.y -= 1;
        if (mv.lengthSq()) {
          mv.normalize().multiplyScalar(sp);
          camera.position.add(mv);
          controls.target.add(mv);
        }
        controls.update();
      } else if (state.view === 'draufsicht') {
        /* Klassische Pacman-Lesart: senkrecht von oben, mitwandernd, ohne Drehung. */
        const h = lift + WALL_H + MOD * 7.5;
        camWant.set(wx, h, wz + 0.001);
        camera.position.lerp(camWant, firstFrame ? 1 : Math.min(1, dt * 6));
        firstFrame = false;
        lookAt.set(wx, lift, wz);
        camera.lookAt(lookAt);
        controls.target.copy(lookAt);
      } else if (state.view === 'orbit') {
        const d = new THREE.Vector3().subVectors(camera.position, controls.target);
        controls.target.copy(follow);
        camera.position.copy(follow).add(d);
      } else {
        /* Bewegt sich der Akteur, federt der freie Blick zurück auf 0 — direkt hinter ihm. */
        if (p.moving) {
          lookYaw += (0 - lookYaw) * Math.min(1, dt * 3.4);
          lookPitch += (0 - lookPitch) * Math.min(1, dt * 3.4);
        }
        camYawSmooth = yawTo(camYawSmooth, yaw, Math.min(1, dt * 3.2));
        const totalYaw = camYawSmooth + lookYaw;
        const bx = Math.sin(totalYaw), bz = Math.cos(totalYaw);
        /* Kamerakollision: von der Schulterhöhe des Akteurs nach HINTEN tasten und den Abstand
           kürzen, bevor die Kamera in einer Wand steht. Der Brief verlangt genau das —
           Lesbarkeit, wenn die Dungeonwände den Akteur verdecken. */
        let dist = CHASE.dist * zoom;
        back.set(-bx, 0, -bz);
        camRay.set(new THREE.Vector3(wx, CHASE.height, wz), back);
        camRay.far = CHASE.dist;
        const wallHit = camRay.intersectObjects(blockers, true)[0];
        if (wallHit) dist = Math.max(MOD * 0.9, wallHit.distance - MOD * 0.35);
        camWant.set(wx - bx * dist, CHASE.height + lookPitch * MOD * 2.2, wz - bz * dist);
        camera.position.lerp(camWant, firstFrame ? 1 : Math.min(1, dt * CHASE.smooth));
        firstFrame = false;
        lookAt.set(wx + bx * CHASE.lookAhead, CHASE.lookY - lookPitch * MOD * 1.6, wz + bz * CHASE.lookAhead);
        camera.lookAt(lookAt);
        controls.target.copy(lookAt);
      }

      /* ---------- Weltzustand für die Verfolger ---------- */
      world.playerNode = motor.occupies();
      world.playerDir = motor.dir;
      world.playerPos = player.position;
      world.mode = state.phase;
      world.nestAge += dt;
      if (world.nestAge > 1.1) { world.nestAge = 0; findNest(); }

      /* ---------- Spielzustand · READY → PLAYING → POWERED → HIT → CLEAR ---------- */
      state.phaseT += dt;
      if (state.phase === 'READY' && state.phaseT > 1.4) { state.phase = 'PLAYING'; state.phaseT = 0; }
      /* Neustart nach Ende oder Sieg — ein Durchlauf, kein Sackgassenbildschirm (Brief §8). */
      if ((state.phase === 'AUS' || state.phase === 'CLEAR') && state.phaseT > 3.2) {
        state.lives = 3; state.whacks = 0; state.wave = 0; state.waveT = 0;
        state.collected.clear();
        for (const [, e] of byNode) {
          e.g.visible = true; e.g.scale.set(1, 1, 1);
          e.g.rotation.z = 0;
          Object.assign(e.g.userData, { st: 0, vx: 0, vy: 0, vz: 0, sq: 0, sqv: 0, spin: 0, tilt: 0, kalt: 0, weg: 0, hop: 0, hopTarget: 0, hopV: 0 });
          e.g.position.set(e.baseX, e.baseY, e.baseZ);
        }
        state.phase = 'READY'; state.phaseT = 0;
        api.resetTo(graph.spawn);
        for (const g of pursuers) { g.mode = 'PEN'; g.penTimer = 1.2 + g.slot * 1.8; g.motor.reset(graph.penNodes[Math.min(g.slot, graph.penNodes.length - 1)]); }
      }
      if (state.phase === 'POWERED') {
        state.powerLeft -= dt;
        if (state.powerLeft <= 0) {
          state.phase = 'PLAYING';
          for (const g of pursuers) if (g.mode === 'FRIGHTENED') g.setMode('CHASE');
        }
      }
      if (state.phase === 'HIT' && state.phaseT > 1.8) {
        /* CLEAR heisst „Feld leer", nicht „Leben alle". Die erste Fassung hat beides in denselben
           Zustand geschrieben, und die Anzeige meldete bei 1/113 „CLEAR" — das war ein Game Over,
           das sich als Sieg ausgab. */
        state.phase = state.lives > 0 ? 'READY' : 'AUS';
        state.phaseT = 0;
        /* KEIN resetTo(spawn) mehr hier: der Spieler bleibt an der Stelle, an der es passiert ist —
           nur ein Leben weg, kein Teleport zurück zum Start. Der volle Reset (Position + Sammelgut)
           bleibt dem echten Game-Over vorbehalten (AUS-Zweig weiter unten, 3,2s später). Dafür eine
           kurze Unverwundbarkeit, sonst schnappt der nächste Verfolger sofort wieder zu. */
        state.invuln = 1.1;
        for (const g of pursuers) { g.mode = 'PEN'; g.penTimer = 1.2 + g.slot * 1.6; g.motor.reset(graph.penNodes[Math.min(g.slot, graph.penNodes.length - 1)]); }
      }

      /* Scatter/Chase-Wechsel: die Verfolger geben periodisch Luft, sonst ist die Karte zu. */
      if (state.phase === 'PLAYING') {
        state.waveT += dt;
        const w = WAVES[Math.min(state.wave, WAVES.length - 1)];
        if (state.waveT > w[1]) { state.waveT = 0; state.wave++; }
        const want = WAVES[Math.min(state.wave, WAVES.length - 1)][0];
        for (const g of pursuers) if (g.mode === 'CHASE' || g.mode === 'SCATTER') g.setMode(want);
      }

      /* ---------- Verfolger ---------- */
      state.invuln = Math.max(0, (state.invuln || 0) - dt);
      const playing = (state.phase === 'PLAYING' || state.phase === 'POWERED') && state.invuln <= 0;
      for (const g of pursuers) {
        if (state.phase === 'PLAYING' || state.phase === 'POWERED' || state.phase === 'HIT') g.update(dt, world);
        if (!playing) continue;
        if (g.node !== world.playerNode || g.theatre) continue;
        if (state.phase === 'POWERED' && g.mode === 'FRIGHTENED') {
          g.whack();
          state.whacks++;
          state.score += 5;
          audio.play('whack', { rate: 0.9 + Math.random() * 0.25 });
          burst(g.holder.position, 0xffd9a0);
        } else if (g.mode !== 'RETURNING' && g.mode !== 'PEN') {
          state.lives--;
          state.phase = 'HIT';
          state.phaseT = 0;
          audio.play('tod');
          burst(player.position, 0xff6a5c);
          const dx = player.position.x - g.holder.position.x, dz = player.position.z - g.holder.position.z;
          const dl = Math.hypot(dx, dz) || 1;
          playerBounce.kick((dx / dl) * MOD * 3.4, MOD * 8, (dz / dl) * MOD * 3.4);
          playerBounce.spin = (Math.random() < 0.5 ? -1 : 1) * 9;
          /* Ein Treffer pro Frame: sonst könnten zwei Verfolger, die im selben Bild auf dem
             Spielerknoten stehen, beide gleichzeitig ein Leben abziehen. */
          break;
        }
      }

      /* ---------- Verfolger-Verfolger · generelle Trennung ----------
         Weicher Impuls in die Bounce-Feder statt Positions-Snap (siehe wm-collide.js) — beide
         geben sich zu gleichen Teilen nach, jeder federt in Pursuer.update() selbst zurück. */
      const SEP_R = MOD * 0.42;
      for (let i = 0; i < pursuers.length; i++) {
        for (let j = i + 1; j < pursuers.length; j++) {
          const A = pursuers[i], B = pursuers[j];
          pushApart(A.holder.position.x, A.holder.position.z, B.holder.position.x, B.holder.position.z, SEP_R, A.bounce, B.bounce);
        }
      }

      if (sparkT < 0.6) {
        sparkT += dt;
        for (let i = 0; i < SPARKS; i++) {
          sparkPos[i * 3] += sparkV[i].x * dt * 12;
          sparkPos[i * 3 + 1] += sparkV[i].y * dt * 12 - dt * MOD * 1.6 * sparkT;
          sparkPos[i * 3 + 2] += sparkV[i].z * dt * 12;
        }
        sparkGeo.attributes.position.needsUpdate = true;
        const life = Math.max(0, 1 - sparkT / 0.6);
        sparkMat.opacity = life;
        sparkMat.size = MOD * 0.1 * (0.5 + life * 0.5);
      } else if (sparkMat.opacity) sparkMat.opacity = 0;

      /* Sichtlinie alle ~5 Bilder — ein Strahl, nicht jeder Frame. */
      sightTick += dt;
      if (sightTick > 0.08) { sightTick = 0; clearSight(); if (ceilingNodes.length) ceilingHole(); }

      /* Licht und Schatten folgen dem Akteur — viermal je Sekunde, nicht je Bild. Der enge
         Schattenausschnitt spart den grössten Posten: sonst ging das ganze Labyrinth jedes Bild
         durch die Schattenkarte. */
      lichtTick += dt;
      if (lichtTick > 0.25) {
        lichtTick = 0;
        B.schatten && B.schatten.folge(player.position.x, player.position.z, MOD * 7);
        B.lampen && B.lampen.folge(player.position.x, player.position.z);
        nightLight.position.set(wx, playerH * 0.7, wz);
      }

      /* ---------- Aufsammeln · Graphenabfrage ---------- */
      /* Aufsammeln über den GEMESSENEN Abstand, nicht über gerundete Knoten. Die Knotenrundung
         hat ausgelöst, sobald der Akteur die Zellhälfte überschritt — also lange bevor er das
         Stück berührt hat. */
      /* Trefferfenster gilt über die GANZE Flugkurve, nicht nur bei Bodenkontakt: ein von einem
         Verfolger getretenes Stück (ud.st === 1) bleibt während des ganzen Bogens fangbar, mit
         etwas mehr Grosszügigkeit als im Stand — ein bewegtes Ziel exakt zu treffen ist schwerer
         als eines, das ruht. Höhe wird bewusst NICHT geprüft: das Stück fliegt in einem engen
         Gang meist kaum über Kopfhöhe hinaus, und ein Sprung soll nicht Voraussetzung sein. */
      let here = null, hit = null;
      for (const [k2, e] of byNode) {
        if (!e.g.visible || state.collected.has(k2)) continue;
        const margin = e.g.userData.st === 1 ? MOD * 0.16 : 0;
        const d = Math.hypot(player.position.x - e.g.position.x, player.position.z - e.g.position.z);
        if (d <= PLAYER_R + e.r + margin) { here = k2; hit = e; break; }
      }
      if (hit && !state.collected.has(here)) {
        state.collected.add(here);
        state.score++;
        werfen(hit, player.position.x, player.position.z, MOD * 6.4, 2);
        audio.play(hit.kind === 'pellet' ? 'pellet' : 'special', { rate: hit.kind === 'pellet' ? 0.94 + Math.random() * 0.12 : 1, gap: 0.04 });
        if (hit.kind === 'special') {
          state.phase = 'POWERED';
          state.powerLeft = POWER_SECONDS;
          for (const g of pursuers) if (g.mode === 'CHASE' || g.mode === 'SCATTER') g.setMode('FRIGHTENED');
        }
        if (state.collected.size >= byNode.size) { state.phase = 'CLEAR'; state.phaseT = 0; audio.play('clear'); }
      }
      /* ---------- Sammelgut: Ballistik, kein Federzug ----------
         Die Fassung davor zog das Stück an einem Ziel hoch, das mit dem Akteur wanderte — also
         fuhr es hoch und runter wie ein Aufzug. Ein Stoß ist kein Ziel, sondern ein EREIGNIS:
         einmal Impuls, danach nur noch Schwerkraft. Erst daraus entsteht der Bogen, der Absprung,
         der abklingende Nachschlag.
         Cartoon-Anteile, in der Reihenfolge, in der man sie sieht:
         · Stoß    — Impuls nach oben plus seitlich weg vom Akteur, Drall obendrauf.
         · Flug    — Streckung entlang der Bahn (stretch), Schwerkraft, Drall klingt ab.
         · Aufprall— Stauchung (squash) proportional zur Aufschlagwucht, dann Rückprall mit
                     halber Energie: zwei, drei kleiner werdende Hüpfer statt einem Stopp.
         · Ruhe    — zurück an den Platz, Ruhepuls.
         Eingesammelt fliegt dasselbe Stück — nur höher, ohne Bodenkontakt, und schrumpft im
         Scheitel weg. Gleiche Physik, anderes Ende. */
      const G = MOD * 20, pdt = Math.min(dt, 0.05);

      const koepfe = [{ x: player.position.x, z: player.position.z, r: PLAYER_R, jagt: false }];
      for (const g of pursuers) koepfe.push({ x: g.holder.position.x, z: g.holder.position.z, r: MOD * 0.22, jagt: true });

      for (const [k2, e] of byNode) {
        const ud = e.g.userData;

        if (ud.st) {                                   // 1 = getreten, 2 = eingesammelt
          ud.vy -= G * pdt;
          e.g.position.x += ud.vx * pdt;
          e.g.position.z += ud.vz * pdt;
          e.g.position.y += ud.vy * pdt;
          ud.spin *= 1 - pdt * 1.4;
          e.g.rotation.y += ud.spin * pdt;
          e.g.rotation.z = ud.tilt * Math.sin(t * 9 + e.phase);
          ud.tilt *= 1 - pdt * 1.1;

          if (ud.st === 2) {                           // eingesammelt: im Scheitel wegschrumpfen
            ud.weg += pdt * 2.3;
            const s = Math.max(0, 1 - ud.weg);
            e.g.scale.setScalar(s * (1 + (1 - s) * 0.8));
            if (s <= 0) { e.g.visible = false; ud.st = 0; }
            continue;
          }

          /* Auch WÄHREND des Tritt-Bogens (ud.st === 1) hart von jedem Verfolger fernhalten —
             steht der Tretende noch am selben Fleck, kann die abklingende Bahn sonst genau durch
             ihn hindurch zurückschwingen und beim Aufsetzen wieder in ihm stecken (gemessen:
             Distanz 0 während des Abklingens, nicht erst im Ruhezustand). Nur XZ, die Flughöhe
             bleibt der Ballistik. */
          if (ud.st === 1 && e.kind === 'pellet') {
            for (const a of koepfe) {
              if (!a.jagt) continue;
              const dx = e.g.position.x - a.x, dz = e.g.position.z - a.z;
              const dist = Math.hypot(dx, dz), minD = a.r + e.r;
              if (dist >= minD) continue;
              const nx = dist > 1e-4 ? dx / dist : 1, nz = dist > 1e-4 ? dz / dist : 0;
              e.g.position.x = a.x + nx * minD;
              e.g.position.z = a.z + nz * minD;
              ud.vx = nx * Math.abs(ud.vx || MOD * 0.4);
              ud.vz = nz * Math.abs(ud.vz || MOD * 0.4);
            }
          }

          if (e.g.position.y <= e.baseY && ud.vy < 0) {
            const wucht = Math.min(1, -ud.vy / (MOD * 5));
            e.g.position.y = e.baseY;
            ud.vy *= -0.5;                             // Rückprall
            ud.vx *= 0.55; ud.vz *= 0.55;
            ud.sq = wucht * 0.9; ud.sqv = 0;           // Stauchung aus der Aufschlagwucht
            if (Math.abs(ud.vy) < MOD * 0.5) { ud.vy = 0; ud.st = 0; }
          }
        } else if (e.g.visible) {
          /* Ruhe: Puls an Ort und Stelle. Der ANKERPUNKT (baseX/baseZ) ist fix — kein seitliches
             Verschieben mehr. Ein überlappender Verfolger hebt das Stück statt es wegzuschieben
             (Wegschieben hat das Spielfeld verzerrt, einzelne Stücke landeten dauerhaft
             woanders). Steigt schnell, sinkt langsamer — damit es nicht sofort wieder im Kopf
             des Verfolgers steckt, sobald der kurz stehenbleibt. */
          const w = Math.sin(t * 2.1 - e.phase);
          /* Aufstieg schnell und glatt; Abstieg über eine Feder mit Geschwindigkeit, damit sie
             beim Aufsetzen kurz auftitscht (Bodenkontakt, Cartoon-Bounce) statt geradlinig
             einzurasten. Die Stauchung nutzt dieselbe sq/sqv-Feder wie der alte Ballistik-Tritt
             (siehe unten im Loop) — hier wird nur der Ausschlag beim Aufsetzen gesetzt. */
          if (ud.hopTarget > 0.5) {
            /* Aufstieg: schnell und glatt, kein Bounce nötig. */
            ud.hop += (ud.hopTarget - ud.hop) * Math.min(1, pdt * 16);
            ud.hopV = 0;
          } else {
            /* Abstieg/Ruhe: Federbewegung gegen 0, darf leicht darunter schwingen — das ist der
               sichtbare Tick beim Aufsetzen (negative Werte werden beim Rendern auf 0 geklemmt,
               der Rücksprung danach bleibt sichtbar als abklingender Mini-Hop). Trifft
               unconditional beim ERSTEN Nulldurchgang, nicht auf einen Schwellwert VOR dem
               Frame — eine gedämpfte Feder kriecht sonst schon vorher drunter und der
               Stauch-Impuls feuert nie (das war der Bug: hop lief glatt durch, ud.sq blieb 0). */
            const before = ud.hop;
            ud.hopV = (ud.hopV || 0) + (0 - ud.hop) * 70 * pdt;
            ud.hopV *= Math.max(0, 1 - pdt * 6);
            ud.hop += ud.hopV * pdt;
            if (before > 0 && ud.hop <= 0) {
              ud.sq = Math.min(0.9, Math.max(0.4, Math.abs(ud.hopV) * 1.4));
              ud.sqv = 0;
              ud.hopV = -Math.max(Math.abs(ud.hopV), 0.55) * 0.42;
            }
            if (Math.abs(ud.hop) < 0.004 && Math.abs(ud.hopV) < 0.05) { ud.hop = 0; ud.hopV = 0; }
          }
          e.g.position.y = e.baseY + w * MOD * 0.03 + Math.max(0, ud.hop) * MOD * 0.95;
          e.g.position.x = e.baseX;
          e.g.position.z = e.baseZ;
          e.g.rotation.z *= 1 - pdt * 4;
          /* Dreht sich in der Luft (glaubwürdiger als ein flach hochgeschobenes Brett), klingt
             über die Zeit selbst ab, und wird beim Aufsetzen wieder auf eine saubere Ausrichtung
             zurückgeholt — kein dauerhaft schiefer Rest wie beim ursprünglichen Rotationsfehler. */
          if (ud.hop > 0.02) {
            ud.spin = (ud.spin || 0) * (1 - pdt * 0.7);
            e.g.rotation.y += ud.spin * pdt;
          } else {
            e.g.rotation.y *= 1 - Math.min(1, pdt * 8);
            ud.spin = 0;
          }
        }

        if (!e.g.visible) continue;

        /* Kontakt — Verfolger schieben ruhende Kekse NICHT mehr weg (das verzerrte das
           Spielfeld dauerhaft); statt dessen springt der Keks über den Kopf des Verfolgers und
           bleibt dort, solange der Verfolger auf seinem Anker steht. Reine Y-Bewegung, XZ bleibt
           exakt am Platz — grosse Belohnungen (Special/Story) sind ausgenommen, die liegen
           immer fest. */
        if (e.kind === 'pellet') {
          let covered = false;
          if (!ud.st) {
            for (const a of koepfe) {
              if (!a.jagt) continue;
              const dx = e.baseX - a.x, dz = e.baseZ - a.z;
              if (Math.hypot(dx, dz) < a.r + e.r) { covered = true; break; }
            }
          }
          if (covered && !ud.wasCovered) ud.spin = (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 3);
          ud.wasCovered = covered;
          ud.hopTarget = covered ? 1 : 0;
        }

        /* Squash & Stretch: eine gedämpfte Feder auf EINEM Wert. Sie schwingt über, deshalb
           wackelt das Stück nach dem Aufprall aus, statt hart auf 1 zu springen. */
        ud.sqv = (ud.sqv || 0) + ((0 - (ud.sq || 0)) * 190 - (ud.sqv || 0) * 13) * pdt;
        ud.sq = (ud.sq || 0) + ud.sqv * pdt;
        const str = ud.st === 1 ? Math.min(0.32, Math.abs(ud.vy) / (MOD * 9)) : 0;
        if (ud.st !== 2) {
          e.g.scale.set(
            (1 + ud.sq * 0.38) * (1 - str * 0.55),
            (1 - ud.sq * 0.48) * (1 + str),
            (1 + ud.sq * 0.38) * (1 - str * 0.55));
        }
        if (!Number.isFinite(e.g.position.y)) { e.g.position.y = e.baseY; ud.vy = 0; ud.st = 0; }
      }
    }
  };
  return api;
}
