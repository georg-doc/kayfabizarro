// KFB Cologne Race · Option C · Buehne
// Setzt die Schichten zusammen und liefert eine schmale Naht an die Oberflaeche.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { C } from './option-c-style.v1.js';
import { buildRoute, heroCameras, ANCHORS, TRACK_WIDTH } from './cologne-route.v1.js';
import { buildTrack } from './cologne-track.v1.js';
import { buildCity, buildRhine, buildDom, buildGround, RAW, PIN } from './cologne-world.v1.js';
import {
  loadVehicle, createDriver, stepDriver,
  applyCamera, VEHICLES, FLOW, REVIEW_MODES
} from './cologne-play.v1.js';
import { createDrive, createTrails, createDice } from './cologne-drive.v1.js';
import { buildBillboard, buildCCTV, renderCardQuarter, CARD_POOL } from './cologne-props.v1.js';
import { buildGates, createJingles, JINGLE_PIN } from './cologne-gates.v1.js';
import { createSky } from './cologne-sky.v1.js';
import { buildGeniusLoci } from './cologne-landmarks.v1.js';
import { createEngineBed, ENGINE_POOL, AUDIO_PIN } from './cologne-audio.v1.js';
import {
  makePalette, measuredPalette, applyPalette, exportPalette, importPalette, randomSeed
} from './cologne-palette.v1.js';

export async function boot(canvas, report, opts = {}) {
  const log = [];
  const say = (k, v) => { log.push({ k, v, t: Date.now() }); report && report({ type: 'log', k, v }); };

  // --- Palette ZUERST -----------------------------------------------------
  // Die Welt liest ihre Farben beim Bauen aus C. Eine Palette muss deshalb vor
  // jeder Geometrie stehen. Standard ist WUERFELN bei jedem Start; ein Seed oder
  // ein importiertes JSON macht dasselbe Bild reproduzierbar (spaeter: Karten-
  // und Zonen-Seeds).
  let palette;
  try {
    if (opts.paletteJSON) palette = importPalette(opts.paletteJSON);
    else if (opts.paletteMode === 'measured') palette = measuredPalette();
    else palette = makePalette(opts.paletteSeed || randomSeed(), { scheme: opts.paletteScheme });
  } catch (e) {
    palette = measuredPalette();
    say('palette-FAIL', e.message + ' — gemessene Palette aktiv');
  }
  applyPalette(palette);
  say('palette', `${palette.label} · Schema ${palette.scheme} · Grundton ${palette.baseHueDeg}° · ${Object.keys(palette.zones).length} Zonen`);
  report && report({ type: 'palette', palette });

  // preserveDrawingBuffer: die Almanach-Karten sind echte Bildaufnahmen aus
  // genau dem Bild, das beim Ausloesen auf dem Schirm stand.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.6, 6500);

  // --- Himmel: TinySkies-/Travel-Spender mit gemessener Option-C-Palette ---
  const sky = createSky(THREE, { radius: 3000, sunDir: new THREE.Vector3(-0.62, 0.17, -0.76) });
  scene.add(sky.group);
  scene.fog = new THREE.Fog(new THREE.Color(C.skyMidDay).lerp(new THREE.Color(C.deep), 0.35), 620, 2900);

  // --- Licht ---------------------------------------------------------------
  scene.add(new THREE.HemisphereLight(C.skyLowDay, C.deep, 0.62));
  // Gemessen: eine gesaettigte Sonnenfarbe (#fed95a, B-Kanal 0,35) multipliziert das
  // teale Band (#279797) nach GRUEN. Die Tafel zeigt die Fahrbahn aber teal im
  // Sonnenuntergang. Deshalb traegt das Licht warmes Weiss, die Farbe bleibt beim Material.
  const sun = new THREE.DirectionalLight(0xffe4b0, 2.4);
  sun.position.set(-520, 300, -640);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const S = 420;
  sun.shadow.camera.left = -S; sun.shadow.camera.right = S;
  sun.shadow.camera.top = S; sun.shadow.camera.bottom = -S;
  sun.shadow.camera.far = 1800;
  sun.shadow.bias = -0.0012;
  scene.add(sun, sun.target);
  const rim = new THREE.DirectionalLight(C.bedLight, 0.55);
  rim.position.set(420, 160, 520);
  scene.add(rim);

  // --- Strecke -------------------------------------------------------------
  const route = buildRoute({ samplesPerSpan: 26, baseWidth: TRACK_WIDTH.STANDARD });
  say('route', `${route.points.length} Punkte · ${route.length.toFixed(0)} m · Basisbreite ${TRACK_WIDTH.STANDARD} m`);
  const track = buildTrack(THREE, route);
  scene.add(track.group);
  if (track.parts.centerDashes) say('center-line', `${track.parts.centerDashes.count} Striche · ${track.parts.centerDashes.dashM} m Strich / ${track.parts.centerDashes.gapM} m Luecke`);
  if (track.parts.cascade) say('cascade', `${track.parts.cascade.posts} Randstaebe · alle ${track.parts.cascade.spacingM} m · Welle ${track.parts.cascade.waveM} m · ${track.parts.cascade.minH}–${track.parts.cascade.maxH} m hoch`);

  // --- OSM-Kontext ---------------------------------------------------------
  // Lokale Kopie zuerst, sonst die gepinnte RAW-Adresse. Damit laeuft auch der
  // Einzeldatei-Build, der keinen Projektpfad mehr kennt.
  const CTX_PATH = 'tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json';
  let ctx;
  try {
    const r = await fetch(CTX_PATH);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    ctx = await r.json();
  } catch (e) {
    ctx = await (await fetch(RAW(CTX_PATH))).json();
    say('osm-context-source', 'lokale Kopie nicht erreichbar, gepinnte RAW-Adresse verwendet');
  }
  say('osm-context', `${ctx.counts.rawElements.toLocaleString('de-DE')} Rohelemente · Rahmen ${ctx.bounds.sizeM.x.toFixed(0)} x ${ctx.bounds.sizeM.z.toFixed(0)} m`);
  scene.add(buildGround(THREE, ctx));

  const rhine = buildRhine(THREE, ctx);
  if (rhine) { scene.add(rhine.mesh); say('rhine', `relation/11280522:0 · ${rhine.points} Punkte · TinySkies-Wasserlesart`); }

  // Kölner Genius Loci auf den gemessenen OSM-Ankern
  let loci = null;
  try {
    loci = buildGeniusLoci(THREE, ANCHORS, route);
    scene.add(loci.group);
    say('genius-loci', `${loci.count} Kölner Landmarken · Versatz zum Freihalten der Strecke: ${loci.built.map(b => b.id + ' ' + b.offsetM + ' m').join(', ')}`);
  } catch (e) { say('genius-loci-FAIL', e.message); }

  const dom = buildDom(THREE, ANCHORS.dom);
  scene.add(dom.group);
  say('dom', `way/4532022 · Hoehe 157,38 m · Massstab ${dom.measured.scale} · Spender v0.2`);

  // --- Fahrzeug ------------------------------------------------------------
  let veh = await loadVehicle(THREE, GLTFLoader, VEHICLES[0]);
  scene.add(veh.holder);
  say('vehicle', `${veh.spec.id} · ${veh.measured.sizeM.x} x ${veh.measured.sizeM.y} x ${veh.measured.sizeM.z} m · ${veh.measured.wheelCount} Raeder · Massstab ${veh.measured.scale}`);

  const driver = createDriver(route);
  // Der Antrieb ist die Quelle: Spur und Speedlines wachsen aus seinen Ansatzpunkten.
  const drive = await createDrive(THREE, GLTFLoader, scene, { skin: 'donut' });
  const trails = createTrails(THREE, scene, drive);
  say('drive', drive.measured
    ? `Power Donut · Modell ${drive.measured.modelU.join(' × ')} u · Faktor ${drive.measured.scale} · 1,6 m Aussendurchmesser`
    : 'Donut-Spender nicht erreichbar, Kugel-Skin aktiv');
  // Der mitfliegende Wuerfel war ein Missverstaendnis — er bleibt gebaut, aber
  // standardmaessig AUS. Der Wuerfel als Antrieb ist jetzt ein Skin (siehe drive).
  const dice = await createDice(THREE, GLTFLoader, scene);
  if (dice) dice.setVisible(false);
  if (dice) say('dice-companion', `Ugur-Wuerfel · Modell ${dice.measured.modelU.join(' × ')} u · Faktor ${dice.measured.scale} · leuchtende Augen ${dice.measured.pipMaterial ? 'ja' : 'nein'}`);

  // --- Requisiten ----------------------------------------------------------
  const cctvMeta = heroCameras(route);
  let cctv = null, billboard = null;
  try {
    cctv = await buildCCTV(THREE, GLTFLoader, cctvMeta);
    scene.add(cctv.group);
    say('cctv', `${cctvMeta.length} Heldenkameras · camera_exclusive.glb 11 560 B`);
  } catch (e) { say('cctv-FAIL', e.message); }
  try {
    billboard = await buildBillboard(THREE, GLTFLoader, route);
    scene.add(billboard.group);
    say('billboard', `billboard.glb 14 520 B · ${billboard.measuredM.x} x ${billboard.measuredM.y} m`);
  } catch (e) { say('billboard-FAIL', e.message); }

  // --- Klang: drei Schichten, ein Mischer ---------------------------------
  // BED Motor · MUSIC Jukebox (Oberflaeche) · SFX Jingles an den Toren
  const engine = createEngineBed({ id: 'v8-seamless', level: 0.5 });
  say('engine-bed', `${engine.spec.label} · ${engine.spec.bytes} B · eigener Pin ${AUDIO_PIN.slice(0, 8)} · Pool ${ENGINE_POOL.length}`);
  // Der Motor braucht eine Geste. Statt darauf zu warten, dass jemand den
  // Schalter findet, startet er beim ersten Tastendruck oder Klick.
  const firstGesture = () => {
    engine.start();
    window.removeEventListener('keydown', firstGesture);
    window.removeEventListener('pointerdown', firstGesture);
  };
  window.addEventListener('keydown', firstGesture);
  window.addEventListener('pointerdown', firstGesture);

  // --- Tore: eigene Streckenkomponenten -----------------------------------
  // Die Kenney-Torbauten sind raus. Sie sind auf ihre eigene Spurbreite
  // modelliert; auf 18 m hochskaliert wurde aus einem schlanken Bogen eine
  // Flaeche quer ueber der Fahrbahn. Ein Modell zu verzerren, damit es passt,
  // ist der falsche Weg herum.
  let startInfo = null, gateInfo = null;
  const jingles = createJingles({ level: 0.5 });
  try {
    const gt = buildGates(THREE, route, { spacingM: 240 });
    scene.add(gt.group);
    gateInfo = gt;
    startInfo = { checker: '2 x 12 Karo', gate: 'Portal in Zielfarben' };
    say('gates', `${gt.placed} Tore parametrisch · alle ${gt.spacingM} m · Lichte ${gt.clearanceM} m · Spannweite folgt der Bandbreite`);
    say('jingles', `${jingles.poolSize} Jingles · ${jingles.families.join('/')} · Pin ${JINGLE_PIN.slice(0, 8)}`);
  } catch (e) { say('gates-FAIL', e.message); }

  // Die 3D-Ziffern sind raus. Aus der Verfolgerkamera lasen sie unsauber —
  // Low-Poly-Zahlen aus einem Platformer-Kit, die nie fuer diese Entfernung
  // gedacht waren. Der Countdown gehoert ins HUD, in derselben Bangers-Schrift
  // wie der Tacho und in denselben Farben.
  say('countdown', 'im HUD, Bangers, farbig animiert — keine 3D-Ziffern mehr');

  // --- Stadt (gross, deshalb zuletzt) --------------------------------------
  let cityStats = null;
  try {
    const city = await buildCity(THREE, route, {
      corridorM: 340, maxBuildings: 850,
      keepClear: cctvMeta.map(c => ({ x: c.position.x, z: c.position.z, r: 46 }))
        .concat([{ x: route.sampleAt(0).x, z: route.sampleAt(0).z, r: 40 }])
        .concat(loci ? loci.built.map(b => ({ x: b.local.x, z: b.local.z, r: Math.max(60, b.extentM[0] * 0.55) })) : [])
    });
    scene.add(city.group);
    cityStats = city.stats;
    say('oms', `${city.stats.built} von ${city.stats.inCorridor} Gebaeuden im ${city.stats.corridorM}-m-Korridor · ${city.stats.triangles.toLocaleString('de-DE')} Dreiecke`);
  } catch (e) { say('oms-FAIL', e.message); }

  // --- Himmelskoerper ------------------------------------------------------
  let skyStats = null, skyDiceStats = null;
  try {
    skyStats = await sky.addPlanets(GLTFLoader, 7);
    say('planets', `${skyStats.placed} Himmelskoerper organisch verteilt (goldener Winkel + Streuung, Sonnenfenster frei)`);
  } catch (e) { say('planets-FAIL', e.message); }
  sky.addDice(GLTFLoader, 4).then(d => {
    skyDiceStats = d;
    say('sky-dice', d.placed ? `${d.placed} Wuerfel · Massstab ${d.scale}` : 'kein Wuerfel-Spender: ' + d.reason);
  });

  // --- Kartenbild (langsamster Spender, im Hintergrund) --------------------
  let cardInfo = null;
  const pick = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
  renderCardQuarter(pick).then(card => {
    cardInfo = {
      packId: card.packId, cardNumber: card.cardNumber, title: card.title,
      page: card.page, quadrant: card.quadrant, pdf: card.pdf, method: card.method
    };
    if (billboard) billboard.setCard(card);
    sky.addCards([card]);
    say('card', `${card.title} · Karte ${card.cardNumber} · Seite ${card.page} Quadrant ${card.quadrant}`);
    report && report({ type: 'card', card: cardInfo });
  }).catch(e => {
    say('card-FAIL', e.message);
    report && report({ type: 'card', card: null, error: e.message });
  });

  // --- Eingabe -------------------------------------------------------------
  const keys = new Set();
  const kd = e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    keys.add(e.code);
  };
  const ku = e => keys.delete(e.code);
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);

  // --- Schleife ------------------------------------------------------------
  let mode = 'CHASE';
  let running = true;
  let t = 0, last = performance.now() / 1000, raceStart = 0.6;
  let frames = 0, fpsT = 0, fps = 0;
  const shots = [];

  // Kamera SETZEN, bevor das erste Bild kommt — dasselbe tut FILAMENT #02 in
  // gameStart(): "run the camera's easing to rest so the first frame is seated".
  // Ohne das steht die Kamera im Ursprung, die Streckenschiene klemmt sie auf den
  // naechstliegenden Punkt DORT (die Verengung), und man blickt aus dem Inneren
  // der Fahrbahn, bis der Nachlauf 300 m hinterhergezogen ist.
  const seatCamera = () => {
    for (let i = 0; i < 60; i++) applyCamera(THREE, camera, mode, driver, route, ANCHORS.dom, 0, cctvMeta);
  };
  seatCamera();

  // --- Kamera --------------------------------------------------------------
  // Der Hindernis-Strahl ist RAUS. Er war die Ursache des Ruckens: die Kamera
  // durfte frei haengen und wurde nachtraeglich vor Fassaden gezogen — bis auf
  // 3,5 m, mitten in den Wagen. Stattdessen faehrt die Kamera auf der
  // Streckenschiene (cologne-play.v1.js railClamp, Verfahren aus FILAMENT #02).
  // Sie verlaesst den Fahrkorridor nicht, also kann sie nicht in ein Bauwerk
  // geraten — auch nicht in Tunneln.

  // --- Korridor-Schrubben --------------------------------------------------
  // Letzte Instanz gegen „steckt im Track“: was trotz Freistellung im Fahrraum
  // steht, wird ausgeblendet und GEMELDET. Kleine Teile (< 60 m) verschwinden,
  // grosse werden nur gemeldet — eine halbe Landmarke stillschweigend zu loeschen
  // waere schlimmer als der Befund. Verschmolzene Stadtnetze bleiben ausgenommen:
  // ihre Huelle umspannt die halbe Karte, fuer Gebaeude gilt der Punkt-in-Polygon-
  // Test beim Bauen (city.portals / city.skipped / city.pierSkipped).
  function scrubCorridor(o = {}) {
    const clearance = o.clearanceM ?? 8.5;
    const step = o.step ?? 4;
    // ZUERST die Weltmatrizen. GEMESSENER BEFUND: ohne das lieferte
    // Box3.setFromObject fuer alles, was noch nie gezeichnet wurde, die LOKALE
    // Lage \u2014 der ganze Dom lag damit rechnerisch im Ursprung, also mitten auf der
    // Startgeraden, und der Schrubber hat Kirchenschiff und Tuerme ausgeblendet.
    scene.updateMatrixWorld(true);
    const skip = /(TrackFlow|track-|structure-|tunnel-|cascade-|start-finish|kfb-gates|gate-|finish-checker|rhine|ground-plate|skydome|sky-|vehicle:|kfb-|trail-|oms-|cctv-|billboard)/;
    const cand = [];
    scene.traverse(m => {
      if (!m.isMesh || !m.visible) return;
      const chain = [];
      for (let p = m; p; p = p.parent) if (p.name) chain.push(p.name);
      if (skip.test(chain.join('|') + '|' + (m.name || ''))) return;
      const bb = new THREE.Box3().setFromObject(m);
      if (!isFinite(bb.min.x)) return;
      cand.push({ m, bb, tag: (chain[chain.length - 1] || m.type) + (m.name ? ' / ' + m.name : '') });
    });
    const hidden = [], flagged = [];
    const lo = new THREE.Vector3(), hi = new THREE.Vector3();
    for (let i = 0; i < route.points.length; i += step) {
      const p = route.points[i];
      const half = p.w * 0.5 + 1.5;
      lo.set(p.x - half, p.y - 1.2, p.z - half);
      hi.set(p.x + half, p.y + clearance, p.z + half);
      const probe = new THREE.Box3(lo.clone(), hi.clone());
      for (const c of cand) {
        if (c.done || !c.bb.intersectsBox(probe)) continue;
        c.done = true;
        const sz = c.bb.getSize(new THREE.Vector3());
        const rec = {
          name: c.tag, atS: +p.s.toFixed(0), seg: p.name,
          extentM: [+sz.x.toFixed(1), +sz.y.toFixed(1), +sz.z.toFixed(1)]
        };
        if (Math.max(sz.x, sz.y, sz.z) > 60) flagged.push(rec);
        else { c.m.visible = false; hidden.push(rec); }
      }
    }
    return { considered: cand.length, clearanceM: clearance, hidden, flagged };
  }
  let scrub = null;
  try {
    scrub = scrubCorridor();
    say('korridor', `${scrub.hidden.length} Teile aus dem Fahrraum entfernt${scrub.flagged.length ? ' · ' + scrub.flagged.length + ' grosse nur gemeldet' : ''} · ${scrub.considered} Netze geprueft`);
  } catch (e) { say('korridor-FAIL', e.message); }

  function resize() {
    const w = canvas.clientWidth || 960, h = canvas.clientHeight || 540;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    const now = performance.now() / 1000;
    const dt = Math.min(0.05, now - last);
    last = now; t += dt;

    stepDriver(driver, route, keys, dt, t);

    // Aufbauhoehe traegt die Drehung mit. GEMESSENER BEFUND: Nick und Waenken
    // drehen den Wagen um seinen Ursprung, und der liegt auf der Radunterkante.
    // Bei Vollgas sind das 0,17 rad — das Heck sinkt dabei 2,08 m · 0,17 = 0,35 m
    // unter die Fahrbahn, genau das „mit den Reifen im Track steckend“.
    const lift = 0.04 + 2.08 * Math.abs(driver.pitch) + 1.08 * Math.abs(driver.roll);
    veh.holder.position.set(driver.x, driver.y + lift, driver.z);
    veh.holder.rotation.set(driver.pitch, driver.yaw, driver.roll, 'YXZ');
    for (const w of veh.front) w.rotation.y = driver.steerAngle;
    for (const w of veh.wheels) w.rotation.x = -driver.wheelSpin;

    drive.update(driver, t);
    trails.update(driver);
    if (dice) dice.update(driver, t, drive.color);
    dom.update(t, 1);
    if (rhine) rhine.mat.uniforms.uTime.value = t;
    engine.update(Math.min(1, Math.abs(driver.speed) / FLOW.maxForward), keys.has('KeyW') || keys.has('ArrowUp'), driver.boosting);
    if (gateInfo && gateInfo.check) gateInfo.check(driver, (g) => {
      if (g.role === 'start-finish') jingles.finish(); else jingles.checkpoint();
    });
    if (cctv) cctv.check(driver, t, shot => {
      try { shot.thumb = renderer.domElement.toDataURL('image/jpeg', 0.55); } catch (e) { shot.thumb = null; }
      shots.unshift(shot);
      if (shots.length > 6) shots.length = 6;
      report && report({ type: 'shot', shots: shots.slice() });
    });

    sun.target.position.set(driver.x, 0, driver.z);
    sun.position.set(driver.x - 520, 300, driver.z - 640);
    sky.follow(camera);
    sky.update(dt, t);

    applyCamera(THREE, camera, mode, driver, route, ANCHORS.dom, t, cctvMeta);
    renderer.render(scene, camera);

    frames++; fpsT += dt;
    if (fpsT >= 0.5) { fps = frames / fpsT; frames = 0; fpsT = 0; }

    report && report({
      type: 'tick',
      speedKmh: Math.abs(driver.speed) * 3.6,
      speedNorm: Math.abs(driver.speed) / FLOW.maxForward,
      lap: driver.lap, lapTime: t - driver.lapStart, bestLap: driver.bestLap,
      progress: driver.progress || 0, boosting: driver.boosting,
      drift: driver.drift, offTrack: driver.offTrack, atWall: driver.atWall,
      surface: route.sampleAt((driver.progress || 0) * route.length).kind,
      segment: route.points[driver.lastIndex].name,
      countdown: Math.max(0, 3 - (t - raceStart)),
      fps
    });
  }
  requestAnimationFrame(frame);

  const api = {
    THREE,
    route, scene, renderer, camera, driver, drive, trails, dice,
    palette,
    paletteJSON() { return exportPalette(palette); },
    scrubCorridor,
    corridorScrub: scrub,
    routePoints: route.points.map(p => ({ x: p.x, z: p.z, kind: p.kind })),
    setMode(m) { mode = m; seatCamera(); },
    getMode() { return mode; },
    modes: REVIEW_MODES.concat(cctvMeta.map((c, i) => 'CCTV' + (i + 1))),
    cctvMeta,
    setOrb(v) { drive.setEnabled(v); },
    setOrbColor(h) { drive.setColor(h); },
    setDriveSkin(v) { drive.setSkin(v); },
    getDriveSkin() { return drive.skin; },
    setDice(v) { if (dice) dice.setVisible(v); },
    engine,
    startEngine() { return engine.start(); },
    setEngineMuted(v) { engine.setMuted(v); },
    setEngineLevel(v) { engine.setLevel(v); },
    setJingleLevel(v) { jingles.setLevel(v); },
    jingles,
    setTrails(v) { trails.setVisible(v); },
    async setVehicle(id) {
      const spec = VEHICLES.find(v => v.id === id);
      if (!spec || spec.id === veh.spec.id) return veh.measured;
      scene.remove(veh.holder);
      veh = await loadVehicle(THREE, GLTFLoader, spec);
      scene.add(veh.holder);
      say('vehicle', `${veh.spec.id} · ${veh.measured.sizeM.x} x ${veh.measured.sizeM.y} x ${veh.measured.sizeM.z} m`);
      return veh.measured;
    },
    reset() {
      const s = route.sampleAt(0);
      Object.assign(driver, createDriver(route), { lapStart: t, lap: 1 });
      raceStart = t;
      seatCamera();
      if (gateInfo && gateInfo.gates) gateInfo.gates.forEach(g => (g.armed = true));
    },
    // Streckenscan: jeder Stuetzpunkt gegen jedes Netz, das in den Fahrraum ragt.
    // Der Fahrraum ist das Band plus die Lichte darueber — was da hineinreicht,
    // faehrt man hindurch. Gibt eine Liste, keine Zusicherung.
    auditRoute(opts) {
      const clearance = (opts && opts.clearanceM) || 9;
      const step = (opts && opts.step) || 3;
      // Die Stadtnetze sind nach Farbton VERSCHMOLZEN; ihre Huelle umspannt die
      // halbe Karte und sagt ueber einzelne Haeuser nichts aus. Der belastbare Test
      // fuer Gebaeude ist der Punkt-in-Polygon-Test beim Bauen (buildCity meldet
      // portals und skipped) — nicht dieser Scan. Deshalb hier ausgenommen und
      // getrennt gemeldet, statt eine wertlose Zahl zu liefern.
      // Was ABSICHTLICH im Fahrraum steht, ist kein Befund: das Band selbst, die
      // Startlinie, die Tore (die spannen ja darueber), der eigene Antrieb.
      const skip = /^(TrackFlow|track-|structure-|tunnel-|cascade-|start-finish|gate-|countdown|rhine|ground-plate|skydome|sky-|vehicle:|kfb-|trail-|cctv-|oms-)/;
      const byDesign = /(kfb-gates|gate-|finish-checker|Dice-Mesh|drive-|dice|car_hatchback|car_sedan|car_stationwagon|donut_pink)/i;
      const boxes = [];
      scene.traverse(o => {
        if (!o.isMesh || !o.visible) return;
        // Die GANZE Ahnenkette sammeln. Die alte Fassung hielt beim ersten
        // benannten Knoten an — die Zielflaggen tragen aber eigene glTF-Namen
        // (Mesh_Group_391), also wurde 'flagCheckers' nie geprueft und drei
        // Fehlalarme verdeckten den einen echten Befund.
        const chain = [];
        for (let p = o; p; p = p.parent) if (p.name) chain.push(p.name);
        const all = chain.join('|');
        const tagged = chain[chain.length - 1] || o.name || o.type;
        if (skip.test(all)) return;
        if (byDesign.test(all)) return;
        const bb = new THREE.Box3().setFromObject(o);
        if (!isFinite(bb.min.x)) return;
        boxes.push({ bb, name: (chain[chain.length - 1] || o.name || o.type) + (o.name && o.name !== tagged ? ' / ' + o.name : '') });
      });
      const hits = new Map();
      for (let i = 0; i < route.points.length; i += step) {
        const p = route.points[i];
        const half = p.w * 0.5;
        const lo = new THREE.Vector3(Math.min(p.x - half, p.x + half) - 1, p.y - 1.5, Math.min(p.z - half, p.z + half) - 1);
        const hi = new THREE.Vector3(Math.max(p.x - half, p.x + half) + 1, p.y + clearance, Math.max(p.z - half, p.z + half) + 1);
        const probe = new THREE.Box3(lo, hi);
        for (const b of boxes) {
          if (!b.bb.intersectsBox(probe)) continue;
          const e = hits.get(b.name) || { name: b.name, samples: 0, firstS: p.s, seg: p.name };
          e.samples++; hits.set(b.name, e);
        }
      }
      const list = [...hits.values()].sort((a, b) => b.samples - a.samples);
      return {
        checkedSamples: Math.ceil(route.points.length / step),
        meshesConsidered: boxes.length,
        clearanceM: clearance,
        intrusions: list.length,
        note: 'oms-* ausgenommen (verschmolzene Netze, siehe city.portals/skipped); Startlinie, Tore und der eigene Antrieb stehen absichtlich im Fahrraum und zaehlen nicht',
        worst: list.slice(0, 12)
      };
    },
    // Alle Durchfahrten vermessen: Tunnel und Tore, mit ihrer Lichte.
    measurePassages() {
      const pts = route.points;
      const runs = [];
      let cur = null;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (p.kind === 'TUNNEL') {
          if (!cur) cur = { fromS: p.s, len: 0, wMin: p.w, wMax: p.w, yMin: p.y, yMax: p.y };
          cur.len += p.ds; cur.toS = p.s;
          cur.wMin = Math.min(cur.wMin, p.w); cur.wMax = Math.max(cur.wMax, p.w);
          cur.yMin = Math.min(cur.yMin, p.y); cur.yMax = Math.max(cur.yMax, p.y);
        } else if (cur) { runs.push(cur); cur = null; }
      }
      if (cur) runs.push(cur);
      return {
        tunnels: runs.map(r => ({
          fromS: +r.fromS.toFixed(1), toS: +r.toS.toFixed(1), lengthM: +r.len.toFixed(1),
          widthM: [+r.wMin.toFixed(1), +r.wMax.toFixed(1)],
          // Die Roehre wird mit Scheitel 11,5 m ueber dem Band gebaut (cologne-track)
          clearanceM: 11.5
        })),
        gates: gateInfo ? gateInfo.gates.map(g => ({
          index: g.index, role: g.role, shape: g.shape,
          routeS: g.routeS, spanM: g.spanM, clearanceM: g.clearanceM
        })) : [],
        vehicleHeightM: 1.9
      };
    },
    evidence() {
      return {
        pin: PIN,
        palette: {
          label: palette.label, seed: palette.seed, scheme: palette.scheme,
          baseHueDeg: palette.baseHueDeg, zones: Object.keys(palette.zones).length,
          roles: Object.keys(palette.roles).length
        },
        corridor: scrub ? {
          considered: scrub.considered, clearanceM: scrub.clearanceM,
          hidden: scrub.hidden.length, flagged: scrub.flagged.length,
          worst: scrub.hidden.slice(0, 6).concat(scrub.flagged.slice(0, 4))
        } : null,
        route: { points: route.points.length, lengthM: +route.length.toFixed(1), baseWidthM: TRACK_WIDTH.STANDARD },
        osm: {
          dataset: ctx.id, osmBaseTimestamp: ctx.generatedFrom.osmBaseTimestamp,
          rawSha256: ctx.generatedFrom.rawSourceSha256, counts: ctx.counts,
          attribution: ctx.attribution
        },
        city: cityStats,
        dom: dom.measured,
        geniusLoci: loci ? { count: loci.count, built: loci.built, sourceStrategy: loci.sourceStrategy, finding: loci.finding } : null,
        vehicle: veh.measured,
        rhine: rhine ? { osm: 'relation/11280522:0', points: rhine.points } : null,
        billboard: billboard ? { measuredM: billboard.measuredM, scale: billboard.scale } : null,
        cctv: cctvMeta,
        startGate: startInfo,
        gates: gateInfo ? { placed: gateInfo.placed, spacingM: gateInfo.spacingM, clearanceM: gateInfo.clearanceM, build: gateInfo.build, shapes: gateInfo.gates.map(g => g.shape + ' ' + g.spanM + 'm') } : null,
        jingles: { pin: JINGLE_PIN, pool: jingles.poolSize, families: jingles.families, recent: jingles.recent() },
        countdown: { mode: 'HUD · Bangers · farbig animiert' },
        sky: skyStats,
        skyDice: skyDiceStats,
        cascade: track.parts.cascade || null,
        centerDashes: track.parts.centerDashes || null,
        audio: { bed: engine.spec, pin: AUDIO_PIN, poolSize: ENGINE_POOL.length, running: engine.started, rate: engine.playbackRate(), layers: ['BED Motor', 'MUSIC Jukebox', 'SFX Tordurchfahrt'] },
        drive: { skin: drive.skin, donut: drive.measured || null, dice: drive.diceMeasured || null },
        dice: dice ? dice.measured : null,
        card: cardInfo,
        shots: shots.map(s => ({ cameraId: s.cameraId, atSeconds: s.atSeconds, speedMs: s.speedMs })),
        log
      };
    },
    _keys: keys,
    dispose() {
      running = false; ro.disconnect();
      window.removeEventListener('keydown', kd);
      engine.stop();
      window.removeEventListener('keyup', ku);
    }
  };
  // Offen fuer Messungen: die Steuerung wurde dreimal nach Herleitung repariert
  // und war dreimal falsch. Jetzt ist sie messbar.
  window.__KFB_COLOGNE_STAGE = api;
  return api;
}
