// KFB Cologne Race · Option C · Buehne
// Setzt die Schichten zusammen und liefert eine schmale Naht an die Oberflaeche.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { C, COLOR_MAP_STATE } from './option-c-style.v1.js';
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

export async function boot(canvas, report) {
  const log = [];
  const say = (k, v) => { log.push({ k, v, t: Date.now() }); report && report({ type: 'log', k, v }); };
  say('palette', `${COLOR_MAP_STATE.paletteLabel} · Seed ${COLOR_MAP_STATE.seed}`);

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
  // Direkter Review-Einstieg fuer kleine Web-Chat-/Human-Gates. Kein Teleport-
  // Gameplay: nur ein reproduzierbarer Startpunkt beim Laden der Stage.
  const reviewStart = new URLSearchParams(location.search).get('start');
  if (reviewStart === 'tunnel') {
    const i = route.points.findIndex(p => p.kind === 'TUNNEL');
    const p = route.points[Math.max(0, i + 4)];
    Object.assign(driver, {
      x: p.x, y: p.y, z: p.z,
      yaw: Math.atan2(p.tx, p.tz),
      s: p.s, lastIndex: Math.max(0, i + 4), progress: p.s / route.length
    });
    say('review-start', 'Tunnel · reproduzierbarer Kamera-Gate-Einstieg');
  }
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

  // --- Kamera-Kollision ----------------------------------------------------
  // Die Verfolgerkamera haengt hinter dem Fahrzeug und geriet in Kurven in
  // Fassaden — dann sah man Innenseiten statt der Strecke. Ein Strahl vom
  // Fahrzeug zur Wunschlage sagt, ob der Weg frei ist; ist er es nicht, rueckt
  // die Kamera bis kurz vor das Hindernis nach. Uebliche Verdeckungsvermeidung.
  const ray = new THREE.Raycaster();
  ray.far = 200;
  let blockers = [];
  let blockersStale = 0;
  const camDir = new THREE.Vector3();
  const camTo = new THREE.Vector3();
  const camFrom = new THREE.Vector3();
  const cameraSafety = { routeClamps: 0, tunnelFrames: 0, occlusionPulls: 0, lastReason: 'clear' };
  // Die Strecke selbst ist nie ein Hindernis fuer die Kamera — auch nicht ihre
  // Unterseite und ihre Pfeiler. Gemessener Befund: `structure-soffit` war nicht in
  // der Liste, also klemmte die Kamera unter dem Rheindeck fest und zeigte die
  // Unterseite statt der Strecke. Und wie beim Streckenscan wurde nur der ERSTE
  // benannte Vorfahre geprueft — die ganze Kette gehoert geprueft.
  const camSkip = /(skydome|sky-|rhine|ground-plate|trail-|kfb-drive|kfb-dice|kfb-gates|gate-|finish-checker|vehicle:|countdown|cctv-|track-|TrackFlow|structure-|tunnel-|cascade-|start-finish)/;

  function refreshBlockers() {
    blockers = [];
    scene.traverse(o => {
      if (!o.isMesh || !o.visible) return;
      const chain = [];
      for (let p = o; p; p = p.parent) if (p.name) chain.push(p.name);
      if (camSkip.test(chain.join('|') + '|' + (o.name || ''))) return;
      blockers.push(o);
    });
  }

  function keepCameraClear() {
    if (--blockersStale <= 0) { refreshBlockers(); blockersStale = 120; }
    if (!blockers.length) return;
    camFrom.set(driver.x, driver.y + 1.5, driver.z);
    camTo.copy(camera.position);
    camDir.copy(camTo).sub(camFrom);
    const dist = camDir.length();
    if (dist < 0.5) return;
    camDir.multiplyScalar(1 / dist);
    ray.set(camFrom, camDir);
    ray.far = dist;
    const hits = ray.intersectObjects(blockers, false);
    if (!hits.length) return;
    // 1,2 m vor dem Treffer stehenbleiben, aber nie naeher als 3,5 m ans Fahrzeug
    const d = Math.max(3.5, hits[0].distance - 1.2);
    camera.position.copy(camFrom).addScaledVector(camDir, d);
    cameraSafety.occlusionPulls++;
    cameraSafety.lastReason = 'occlusion:' + (hits[0].object.name || 'mesh');
  }

  // Clean-room Prinzip aus dem SP13KTRA-Benchmark: nicht die ganze Stadt zur
  // Kamera-Physik machen, sondern den Kameraboom an die eigene Streckenflaeche
  // binden. Dadurch bleibt CHASE in Kurven und im Tunnel innerhalb des
  // Fahrkorridors; OSM-Fassaden sind danach nur noch ein zweites Sicherungsnetz.
  function keepCameraOnRoute() {
    const near = route.nearest(camera.position.x, camera.position.z, driver.lastIndex);
    const p = near.point;
    const dx = camera.position.x - p.x, dz = camera.position.z - p.z;
    const lateral = dx * p.nx + dz * p.nz;
    const maxLateral = p.w * (p.kind === 'TUNNEL' ? 0.28 : 0.40);
    const clamped = Math.max(-maxLateral, Math.min(maxLateral, lateral));
    const floorY = p.y + 1.75;
    const ceilingY = p.kind === 'TUNNEL' ? p.y + 5.4 : Infinity;
    const nextY = Math.max(floorY, Math.min(ceilingY, camera.position.y));
    if (Math.abs(clamped - lateral) > 0.01 || Math.abs(nextY - camera.position.y) > 0.01) {
      camera.position.set(p.x + p.nx * clamped, nextY, p.z + p.nz * clamped);
      camera.lookAt(driver.x + Math.sin(driver.yaw) * 11, driver.y + 1.2, driver.z + Math.cos(driver.yaw) * 11);
      cameraSafety.routeClamps++;
      cameraSafety.lastReason = p.kind === 'TUNNEL' ? 'tunnel-corridor' : 'route-corridor';
    }
    if (p.kind === 'TUNNEL') cameraSafety.tunnelFrames++;
  }

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

    veh.holder.position.set(driver.x, driver.y, driver.z);
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
    if (mode === 'CHASE') keepCameraOnRoute();
    if (mode === 'CHASE' || mode === 'CLOSE ORBIT') keepCameraClear();
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
      cameraSafety: { ...cameraSafety },
      fps
    });
  }
  requestAnimationFrame(frame);

  const api = {
    THREE,
    route, scene, renderer, camera, driver, drive, trails, dice,
    routePoints: route.points.map(p => ({ x: p.x, z: p.z, kind: p.kind })),
    colorMap() { return JSON.parse(JSON.stringify(COLOR_MAP_STATE)); },
    cameraSafety() { return { ...cameraSafety }; },
    setMode(m) { mode = m; },
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
        colorMap: COLOR_MAP_STATE,
        cameraSafety: { ...cameraSafety },
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
