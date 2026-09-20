// ============================================================================
// travel-poc.js — KFB Travel v12 · Runner (Flug + Boden + Academy)
// ----------------------------------------------------------------------------
// Fork von terrain-v9/travel-poc.js (Freeze 2026-07-25, nach S51). v9 bleibt unangetastet und ist
// der Vergleichsmaßstab: v10 darf sich nur da anders VERHALTEN, wo eine Abnahmezahl es verlangt.
//
// **Auftrag v10, erster Slice (S56):** Anflug und Abflug sind EINE Regie. Vorher waren es vier
// Bewegungen mit vier Uhren — Dock-Mix, POV/Zoom, Verdeckung der Flug-Karte, Pet-Facing. Jede
// für sich weich, zusammen Georgs „dreht sich durch die Karte weg, wird dann transparent".
// `arrival.js` besitzt jetzt EINEN Fortschritt 0→1; die vier Anteile sind Fenster darauf, und
// der Abflug ist derselbe Fortschritt rückwärts. Danach: Tusche messen, Tacho-Würfel, Journey.
//
// Aus v9 übernommen (Architektur A–D, fertig, keine Schulden offen):
//   A · CameraRig      — genau EIN Modul schreibt `camera.*` (heute vier)
//   B · Modus-Eigentum — `switchMode` wird ein Antrag mit Begründung, plus Vertragsprüfung
//   C · Panel als Daten, dann TravelManager — diese Datei < 400 Zeilen (heute 1327)
//   D · Ereignisse an einem Ort — die acht Callbacks in einer Tabelle, kein Bus
//
// Aus v8 übernommen: **S22d Auto-Pilot** (`autopilot.js` — eine Eingabequelle, kein
// zweiter Flug-Controller) und **S31 Academy** (`academy-*.js` — 31 Lektions-
// karten in fünf Farbzonen, Live-Demo per Render-to-Texture auf dem Blatt).
// Sprintplan: docs/SPRINT_travel-v7.md (S22d/S31). Changelog: docs/CHANGELOG_travel.md.
// **Die Versionsnummer gehört dem Runner**, nicht einem Modul.
// ----------------------------------------------------------------------------
// RENDER-REIHENFOLGE (seit S2 unverhandelbar):
//   Szene → post-radial (Fullscreen-Blur) → speed-lines → hud.render()
// Sobald die Szene in einen Puffer geht, muss alles Scharfe DAHINTER kommen.
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Brief §7.1 — smallest bootable slice: flat WebGL ground + card + default pet
// (bunny) + flight controller. Flies. WebGL three 0.160. Later slices swap the
// flat ground for terrain-v3, add the ground/walk controller, 24-pet select,
// mode switch, and richer card kinetics.
//
// Runtime layers (001): Input → Vehicle(flight) → Camera → Pet → CardRig → Render.
// ----------------------------------------------------------------------------
// **FORK-STEMPEL v16 (2026-08-12).** Kopie von `terrain-v15/` (Travel v15, Flug-Sprint F0/F1).
// Sprint-Auftrag Georg: **Landschaft** — L1 Stufung, L2 Instanz-Farben/Biome, L3 Kenney-Props.
// Geändert in DIESER Datei: nur die Abnahmezeile unten. Die Stufung steht vollständig in
// `voxel-terrain.js`, die Regler in `settings-schema.js`. v15 bleibt unangetastet.
//
// **FORK-STEMPEL v15 (2026-08-12).** Kopie von `terrain-v14/` (Travel v14, Stand
// S94a). Sprint-Auftrag Georg: Steuerung, Gameplay, Flug- und Manöverdynamik.
// Blueprint und Benchmark: `github.com/dannylimanseta/tinyskies`
// (Zweig `cursor/globefly-multiplayer-globe-flight-game`).
// Geändert in DIESER Datei: (1) `autoMode` steht auf **aus** — Bodenkontakt ist
// ein Fahrzustand, kein Landebefehl (F0); (2) `input.noDrift`, solange eine
// Regie fährt (F1). Alles andere an der Fahrdynamik steht in
// `flight-controller.js` (fc-v2.0). v14 bleibt unangetastet.
// ============================================================================

import * as THREE from 'three';
// Hinweis (v15): der Standalone-Bundler verliert bei jedem Einstiegs-Modul die ERSTE relative
// Abhaengigkeit — hier also 'world-context.js'. Fuenf Umgehungen sind gemessen und alle
// gescheitert; die Befundliste steht als Naht 101 im CHANGELOG_v15. Im Vorschaufenster und
// beim normalen Laden ist nichts betroffen. Wer die Reihenfolge hier aendert, aendert nur,
// WELCHE Datei der Bundler verliert.
import { makeWorldContext, MODES, paletteFromVector, mulberry32, joinSeeds } from './world-context.js';
import { createCardCarrier } from './card-carrier.js';
import { createFlightController } from './flight-controller.js';
import { createPetKinetics } from './pet-kinetics.js';
import { createVoxelTerrain } from './voxel-terrain.js';
import { createSkydome } from './skydome-shader.js';
import { resolvePalette } from './world-palettes.js';
import { createColorWorlds, rotateStops, guardStops, contrastStop } from './color-worlds.js';
import { createWalkController } from './walk-controller.js';
import { createTravelHeat } from './travel-heat.js';
import { createHudCube } from './hud-cube.js';
import { createSettingsOverlay } from './settings-overlay.js';
import { createSpeedLines } from './speed-lines.js';
import { createRadialPost } from './post-radial.js';
import { createCardContrails } from './card-contrails.js';
import { createPetLighting } from './pet-lighting.js';
import { createBlobShadow } from './ground-shadow.js';
import { createTravelAudio } from './travel-audio.js';
import { createSkyCards } from './sky-cards.js';
import { createSkyDice } from './sky-dice.js';
import { createNarrator } from './narrator.js';
import { createPromptRegistry } from './narrator-prompts.js';
import { createNarratorLLM } from './narrator-llm.js';
import { createCardRegistry } from './card-registry.js';
import { createAutopilot } from './autopilot.js';
import { createAcademyCards } from './academy-cards.js';
import { videoEmbed } from './academy-deck.js';   // S71 · die Video-Karte (klein & sicher)
import { createJourneyRoute, FORMS } from './journey-route.js';   // S72 · linear oder gemischt
import { createZoneRing } from './zone-ring.js';                  // S84 · Hex-Ring aus der Registry
import { createWarpJump } from './warp-jump.js';                  // S77 · der Sprung
import { createAcademyLive } from './academy-live.js';
import { createCardDock } from './card-dock.js';
import { createArrival } from './arrival.js';
import { createVoxelGlyphs } from './voxel-glyphs.js';
import { createCardTitle } from './card-title.js';
import { createJourney } from './journey.js';
import { createNoteField } from './note-field.js';
import { createLessonSearch } from './lesson-search.js';
import { createPetFacing } from './pet-facing.js';
import { createCameraRig } from './camera-rig.js';
import { createModeOwner, assertController } from './mode-owner.js';
import { createTravelManager } from './travel-manager.js';
import { buildSections } from './settings-schema.js';
import { createTravelInput } from './travel-input.js';
import { createTravelStage } from './travel-stage.js';
import { createPropScatter } from './prop-scatter.js';

// **Die Meta-Zeile der Bühne, EINMAL.** Sie stand als Markup in index.html UND im DC und war eine
// Runde später uneinig (das DC nannte noch L2d als letzten Slice). Jetzt schreibt der Runner sie:
// er ist die einzige Stelle, die weiß, welche Slices wirklich laufen.
const SHELL_META = {
  title: 'Travel v16 · Landschaft',
  sub: 'L1 Stufung · L2 Farbwelten als Ort · L2d Ringwellen · L3 Props',
};
import { createEventTable } from './travel-events.js';

const ASSET = (p) => new URL(p, import.meta.url).href;
// Pfad-Hygiene: der Pet-Stack kommt kanonisch über jsdelivr (Module brauchen application/javascript);
// der lokale Spiegel ist nur Fallback, nie Quelle.
const PETS_CANON = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/kfb-pets.js';
// **S94 · Der Oberflächen-Look ist ein EIGENES Modul und muss bestellt werden.** Bauanleitung §10,
// wörtlich: „ohne ihn ist das Pet flach." Genau das war der Befund — die Reise hat den kanonischen
// Pet-Stack schon immer geladen (oben), aber nie `surface` übergeben, also griff der bewusst
// zurückhaltende Default-`makeMat` (die Colormap steckt im GLB, wer sie übertönt bekommt gelbe Pets).
// Es gibt hier KEINEN lokalen Spiegel: fällt der Import aus, bleibt es beim flachen Default — das ist
// der Rückweg, und er ist derselbe Zustand wie vor diesem Slice.
const SURF_CANON = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/pet-surface.v1.js';
async function petsModule() {
  try { return await import(/* @vite-ignore */ PETS_CANON); }
  catch (e) { console.warn('[travel-poc] kanonischer Pet-Stack nicht ladbar → lokaler Spiegel', e); return await import('./kfb-pets.js'); }
}

// Die Bühne finden — und zwar IMMER WIEDER. Der Wirt (Design-Component-Runtime) baut das Template
// neu, wenn er will: dann ist der alte `#tv-stage` abgehängt und der neue kann in einem SHADOW ROOT
// liegen. `document.getElementById` sieht dort nicht hinein und liefert `null` — der Runner hielt
// daraufhin sein Canvas an einem Knoten fest, der nicht mehr im Dokument steht: schwarzes Bild,
// kein Fehler in der Konsole, Schleife läuft weiter. (Gemessen 26.7.: Canvas 2×2, `contains` false,
// `parentElement.id` trotzdem 'tv-stage' — zwei Knoten mit demselben Namen, einer davon Vergangenheit.)
// Deshalb wird zusätzlich durch die Shadow Roots gesucht. Reine Erweiterung: der normale Weg zuerst.
function findStage() {
  const direct = document.getElementById('tv-stage');
  if (direct) return direct;
  const seen = new Set();
  const walk = (root, depth) => {
    if (!root || depth > 6 || seen.has(root)) return null;
    seen.add(root);
    const hit = root.getElementById ? root.getElementById('tv-stage') : root.querySelector('#tv-stage');
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) { const r = walk(el.shadowRoot, depth + 1); if (r) return r; }
    }
    return null;
  };
  return walk(document, 0);
}

(function boot() {
  const stage = findStage();
  if (!stage) { requestAnimationFrame(boot); return; }
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) {
    stage.innerHTML = '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#cdd4e6;font-family:monospace;">This needs a WebGL browser.</div>';
    return;
  }
  start(stage).catch((e) => console.error('[travel-poc] start failed', (e && (e.stack || e.message)) || e));
})();

async function start(stage) {
  // ---------------------------------------------------------------- BÜHNE (S44d)
  // Renderer, Szene, Kamera, Licht, Himmel, Terrain und die Gelände-Sonden stehen in
  // `travel-stage.js`. Aufbau ist keine Verdrahtung — er passiert einmal und ändert sich nie.
  const stageOut = createTravelStage({ THREE, stage, makeWorldContext, createSkydome, createVoxelTerrain });
  const { renderer, scene, camera, sun, sky, terrain, groundHeightAt, pullIn, escapeTerrain,
          WORLD_SEED, STORY } = stageOut;
  // ---------------------------------------------------------------- v16/L3 · KENNEY-PROPS
  // Die Streuung gehört dem RUNNER, nicht der Bühne: sie verbindet drei Dinge (Terrain-Standorte,
  // Asset-Index, Farbwelt) und wird beim Chunk-Wechsel neu geschrieben — das ist Verdrahtung.
  // Die Bühne baut nur, was einmal passiert.
  //
  // Sie lädt ASYNCHRON und die Welt läuft ohne sie: bis die Modelle da sind, streuen die grauen
  // Blöcke weiter. Erst wenn wirklich Modelle im Speicher sind, gibt das Terrain die Streuung ab
  // (`setPropsOwn`). Ein 404 macht damit die Landschaft nicht leer, nur ärmer.
  const props = createPropScatter({ THREE, motion: terrain.motionUniforms, palette: terrain.paletteUniforms });
  scene.add(props.group);
  let propsWanted = true;
  async function loadProps() {
    if (!propsWanted || props.ready) return;
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const ok = await props.load(new GLTFLoader(), wc && wc.biome);
    if (!ok) { console.warn('[props] keine Modelle geladen — graue Blöcke bleiben'); return; }
    terrain.setPropsOwn(true);          // rebaked die Chunks OHNE graue Blöcke
    props.rebuild(terrain, wc && wc.biome);
    console.info('[props] ' + JSON.stringify(props.report()));
  }

  // `wc`, `pal`, `story` und `worldSeed` bleiben Runner-Zustand: `applyWorld` baut sie beim
  // Story-Wechsel neu. Die Bühne LIEFERT sie, sie BESITZT sie nicht.
  let wc = stageOut.wc, pal = stageOut.pal, worldSeed = WORLD_SEED, story = STORY;

  // S58 · Die Farbwelt. `pal` bleibt die STORY-Palette — Himmel, Nebel, Speedlines und der
  // Würfel hängen daran, und die Erzählung soll die Tinte bestimmen, nicht eine Farblaune.
  // Das TERRAIN darf davon abweichen: `paletteId` wählt, was die Würfel tragen.
  // Alle Werte sind die v3-Defaults, damit „Story-Modus (folgt)" genau dem heutigen Bild entspricht.
  let paletteId = 'story', paletteSpread = true;
  let rainbowSpeed = 0.055, rainbowSpread = 0.55;
  const colorP = { brightMin: 0.52, brightRange: 0.62, satBase: 0.72, satRange: 0.34, topoMix: 0.6 };

  // ---------------------------------------------------------------- v16/L2 · FARBWELTEN
  // Der Shader kann seit v3 zwei Paletten gleichzeitig und eine radiale Front dazwischen; benutzt
  // wurde das für genau eine Sache (Palettenwechsel im Panel). `color-worlds.js` liefert die zwei
  // fehlenden Entscheidungen: WANN eine Front läuft und WELCHE Palette sie bringt. Begründung,
  // Regeln und die Naht zum Story-Modus stehen im Kopf dieses Moduls.
  let colorGuard = true, colorMaxLum = 0.8;
  // v16/L2d · **Die Auslöser der Ringwellen.** Der Shader zeichnet sie, `spawnRipple` setzt sie —
  // hier steht nur, WAS eine Welle verdient. Und das ist die eigentliche Entscheidung:
  // **Ereignisse, kein Metronom.** Eine Welle beim Aufsetzen, beim Grenzübertritt, beim Atemzug
  // liest sich als URSACHE; eine Welle im Takt liest sich als Deko — und wäre die Konfetti-Falle
  // aus §4v/82 in dritter Auflage. Der Beat treibt hier ausdrücklich nichts.
  let rippleOn = true, rippleTouch = true, rippleRegion = true, rippleZone = true;
  let varyStart = true;
  // Der Sitzungs-Seed ist EINE Zahl und wird gezeigt: dieselbe Zahl gibt dieselbe Welt. Ein
  // Befund ohne Reproduktion ist eine Anekdote — deshalb würfelt der Start nicht heimlich.
  let sessionSeed = String(Math.floor(Math.random() * 1e9));
  try { const s = localStorage.getItem('kfb-travel-v16-seed'); if (s) sessionSeed = s; } catch (e) {}
  const colors = createColorWorlds({ seed: sessionSeed });

  // Ein Weg für beides: Story-Wechsel und Handauswahl rufen dieselbe Funktion. `spread` breitet die
  // neue Palette radial vom Spieler aus — aber nur bei einer BEDIENTEN Änderung; beim Aufbau und
  // beim Rebake wäre die Welle ein Fehler (man hätte sie nicht ausgelöst).
  //
  // **v16/L2 · `front` ist der dritte Anlass.** Eine Region oder ein Atemzug bringt seine eigene
  // Front mit (Mitte = der Spieler, eigene Weite und Dauer). Damit gibt es weiterhin **einen** Weg
  // zur Farbe: Hand, Story und Ort laufen durch dieselbe Funktion. `hue` dreht den Farbton (der
  // Atem), `guardStops` hält die Palette lesbar — beides in `color-worlds.js` begründet.
  // Die aktive Palette an EINER Stelle: gedreht (Atem) und geriegelt (Lesbarkeit). Panel-Proben,
  // Wellenfarbe und Prop-Tönung lesen sie hier — sonst zeigt der Panel-Knopf eine Farbe, die im
  // Bild nirgends vorkommt (der Fehler, den Naht 118 auf der Text-Ebene gemacht hat).
  function paletteStopsNow() {
    const r = resolvePalette(paletteId, { wc, paletteFromVector });
    const s = rotateStops(r.stops, colors.hue);
    return colorGuard ? guardStops(s, colorMaxLum) : s;
  }
  function applyPalette(animate, front) {
    const r = resolvePalette(paletteId, { wc, paletteFromVector });
    let stops = rotateStops(r.stops, colors.hue);
    if (colorGuard) stops = guardStops(stops, colorMaxLum);
    // v16/L3c · Die Props brauchen hier NICHTS: ihre Farbe kommt aus dem Würfel, auf dem sie
    // stehen, über dieselben Paletten-Uniforms und dieselbe radiale Front. Sie färben deshalb
    // mit der Welle um, ohne dass jemand sie benachrichtigt.
    if (front) {
      const p = (isWalk() ? walk.state.position : flight.state.position);
      terrain.setPalette(stops, { spread: 1, cx: front.cx != null ? front.cx : p.x,
                                  cz: front.cz != null ? front.cz : p.z,
                                  maxDist: front.dist || 900, dur: front.dur || 9 });
    } else if (animate && paletteSpread) {
      terrain.setPalette(stops, { spread: 1, cx: camera.position.x, cz: camera.position.z,
                                  maxDist: 260, dur: 1.4 });
    } else {
      terrain.setPalette(stops);
    }
    terrain.setRainbow(r.rainbow, rainbowSpeed, rainbowSpread);
    // Georgs Entscheidung (26.7.): **der Himmel geht mit.** Eine Farbwelt, die am Horizont aufhört,
    // ist zwei Welten. Also tragen Himmel UND Nebel dieselben Stops — der Nebel ist die Naht
    // zwischen beiden, er darf nicht in der alten Farbe stehen bleiben.
    // Die TINTE bleibt beim Story-Modus: Würfel, Speedlines und Pet-Karte sind die Erzählung,
    // nicht die Landschaft.
    // **v16/L2:** Himmel und Nebel bekommen die GEDREHTEN und GERIEGELTEN Stops, nicht die rohen.
    // Sonst atmet der Boden und der Himmel steht — zwei Welten, genau das, was die Regel von 26.7.
    // („der Himmel geht mit") verhindern soll.
    sky.setPalette(stops);
    fogCol.setRGB(stops[0][0] * 0.6 + 0.02, stops[0][1] * 0.6 + 0.03, stops[0][2] * 0.6 + 0.05);
    scene.background = fogCol.clone();
    if (scene.fog) scene.fog.color.copy(fogCol);
    lighting.bakeEnvironment(sky.group);   // neuer Himmel → neues Umgebungslicht
  }
  const fogCol = stageOut.fogCol;
  // --- vehicle + rig ---
  const flight = createFlightController({ THREE });
  flight.reset(0, 0);
  const rig = createCardCarrier({ THREE });   // assetBase: kanonische RAW-URL (card-carrier default)
  scene.add(rig.group);
  const petKin = createPetKinetics({ THREE });
  // S33b · Facing als dünne Schicht NACH der Kinetik: sie schreibt nur die Gier, nie das
  // ganze Quaternion — der Lean aus `pet-kinetics` bleibt damit unangetastet.
  const petFace = createPetFacing({ THREE });
  const walk = createWalkController({ THREE });
  const heat = createTravelHeat({});   // S1: der eine Regie-Skalar
  // S42 (V9-B): Der Modus gehört `modeOwner` (unten definiert, sobald die Modi es können).
  // Diese Kurzform bleibt, weil sie 40-mal gelesen wird — sie ist ein LESEZUGRIFF, kein Zustand.
  let modeOwner = null;
  const isWalk = () => modeOwner && modeOwner.mode === 'walk';
  const curMode = () => (modeOwner ? modeOwner.mode : 'fly');

  // --- S7: HUD-Würfel unten rechts — Ruhezustand Tacho, angefasst Menü.
  // Oberfläche und Farben kommen aus derselben Welt (Kanten-Textur + Story-Palette).
  let storyMode = MODES.find((m) => m.key === STORY) || MODES[3];
  let settings = null;   // wird nach dem Pet-Mount gebaut; Handler greifen lazy darauf zu
  const hud = createHudCube({
    THREE, dom: renderer.domElement,
    ink: storyMode.ink, panel: storyMode.panel,
    // S57 · Der Würfel trägt die Oberfläche der Welt: DASSELBE Textur-Objekt, das die Terrain-Würfel
    // multiplizieren — ein Fetch, eine Materialsprache.
    edgeTex: terrain.edgeTex,
    // S33 · Die Tacho-Seite (+Z, HOME) ist der Navi-Knopf: sie öffnet die Lektions-Suche.
    // Die Reise-Regler bleiben über Tab erreichbar — ein Knopf, eine Bedeutung.
    onSelect: (id) => { if (id === 'travel' && academyOn) search.toggle(); else settings.toggle(id); },
  });
  hud.preWarm(renderer);   // Shader vorwärmen (Academy-Muster): kein Ruckler im ersten Frame

  // --- S2: Boost-Regie ------------------------------------------------------
  // Zwei Pässe, ein Regler-Satz. Beide hängen an `heat` (+ Boost-Impuls), beide sind
  // in Ruhe komplett aus. `fxBlur` steht HIER, weil das Overlay es beim Bauen liest
  // (später deklariert = TDZ-Boot-Abbruch, S8-Falle 1).
  let fxBlur = 1;
  const lines = createSpeedLines({ THREE, ink: storyMode.ink });
  lines.setInk(storyMode.ink, storyMode.panel);
  // Kondensstreifen an den hinteren Kartenecken: ab 20 km/h die einzige Tempo-Auskunft,
  // und sie zeichnen Bank, Barrel-Roll und Steigflug als Kurve in die Luft (TinySkies-Muster).
  const trails = createCardContrails({ THREE });
  trails.setAnchors(rig.halfW, rig.halfD);
  trails.setTint(storyMode.panel);
  scene.add(trails.group);

  // --- S14: Pet-Beleuchtung (Sky-Environment + Fill + Story-Tint) --------------
  const lighting = createPetLighting({ THREE, renderer, scene });
  lighting.setTint(storyMode.ink, 0.18);
  lighting.register(rig.group);
  lighting.bakeEnvironment(sky.group);

  // --- S15 · Schatten. Zwei verschiedene Probleme, zwei verschiedene Lösungen:
  // (1) auf dem TERRAIN projiziert der Terrain-Shader selbst (`terrain.setCasters`). Ein
  //     Schatten-Quad kann auf einem Voxel-Boden nicht funktionieren: es liegt auf EINER Höhe,
  //     schwebt also an Kanten über dem Abgrund, steckt in Wänden und flackert, sobald die
  //     Probenhöhe zwischen Nachbarsäulen springt (Georgs Befund).
  // (2) auf der KARTE bleibt es ein Quad im Karten-Rig — dort IST die Fläche durchgehend,
  //     und der Schatten soll mit Bank und Wellung mitgehen.
  let shadowGain = 1;
  const petShadow = createBlobShadow({ THREE, color: 0x1f1a14, params: { core: 0.3 } });
  rig.lean.add(petShadow.mesh);
  const post = createRadialPost({ THREE, renderer });
  lines.preWarm(renderer);

  // ---------------------------------------------------------------- WELT NEU BAUEN
  // Story-Mode und Seed ändern denselben Weg: neuer WorldContext → Terrain rebaked,
  // Himmel und HUD-Würfel bekommen dieselbe Palette. (Vorgriff auf S5.)
  function applyWorld(rebuildCtx) {
    if (rebuildCtx) {
      wc = makeWorldContext({ storyMode: story, seeds: [worldSeed] });
      pal = wc.palette;
    }
    terrain.setWorldContext(wc);
    sky.setMode(wc.storyModeIndex);
    storyMode = MODES.find((m) => m.key === story) || storyMode;
    hud.setPalette({ ink: storyMode.ink, panel: storyMode.panel });
    lines.setInk(storyMode.ink, storyMode.panel);   // Speedlines tragen die Story-Tinte, nie Weiß
    trails.setTint(storyMode.panel);
    lighting.setTint(storyMode.ink);
    dice.setPalette({ ink: storyMode.ink, panel: storyMode.panel });
    audio.setMood(wc.storyModeIndex);      // ein Mood = eine spektrale Identität
    if (settings) settings.setAccent('#' + new THREE.Color(storyMode.ink).getHexString());
    // ZULETZT, und nur hier: Terrain, Himmel, Nebel und Umgebungslicht bekommen die Farbwelt.
    // Vorher standen `sky.setPalette(pal)` und die Nebelfarbe weiter unten in dieser Funktion —
    // sie hätten eine gewählte Palette wieder auf die Story-Palette zurückgesetzt. **Eine Farbe,
    // eine Stelle, und die Stelle ist die letzte.**
    applyPalette(false);
  }

  // ---------------------------------------------------------------- CARD FLOOR
  // Das Fahrzeug ist keine Kugel, sondern eine 3.0 × 1.68 große Karte, die BANKT — und die
  // Cubes hüpfen nach oben. Eine einzige Höhenprobe in der Mitte lässt genau das passieren,
  // was Georg sieht: die Ecken schneiden in einen steigenden Würfel. Statt einer Physik-Engine
  // tastet diese Funktion die ganze Grundfläche ab (Mitte + 4 Ecken), einmal an der aktuellen
  // und einmal an der VORAUS liegenden Position, nimmt den schlechtesten Fall und rechnet die
  // Bob-Reserve (`terrain.maxLift()`) plus den Tiefgang der untersten Ecke drauf.
  // Steigen schnell, Sinken langsam — dieselbe Disziplin wie beim Kamera-Pull-in.
  let cardFloor = 0;
  // Höchste Oberfläche im Umkreis eines Körperradius — EINE Mittenprobe reicht nicht: das
  // Pet steckt sonst in der Nachbarsäule (Georgs Screen 1 beim Wechsel in den Walk-Mode).
  function safeGroundAt(x, z, r) {
    const rad = r != null ? r : 0.7;
    let top = groundHeightAt(x, z);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const t = groundHeightAt(x + Math.cos(a) * rad, z + Math.sin(a) * rad);
      if (t > top) top = t;
    }
    return top;
  }
  function cardClearance(st, dt) {
    const hw = rig.halfW + 0.25, hd = rig.halfD + 0.25;   // + Haut-Marge
    const fx = st.forward.x, fz = st.forward.z;
    const rx = -fz, rz = fx;                              // right = forward × up (horizontal)
    const ahead = 1.2 + st.speed * 0.22;                  // dorthin, wo wir gleich sind
    let top = -1e9;
    for (let s = 0; s <= 1; s++) {
      const ox = st.position.x + fx * ahead * s, oz = st.position.z + fz * ahead * s;
      for (let i = 0; i < 5; i++) {
        const sx = i === 0 ? 0 : (i <= 2 ? 1 : -1);
        const sz = i === 0 ? 0 : (i === 1 || i === 3 ? 1 : -1);
        const t = groundHeightAt(ox + rx * hw * sx + fx * hd * sz, oz + rz * hw * sx + fz * hd * sz);
        if (t > top) top = t;
      }
    }
    const tilt = Math.abs(Math.sin(st.bank)) * hw + Math.abs(Math.sin(st.pitchTilt || 0)) * hd;
    // Bob-Reserve nur dort, wo die Cubes wirklich tanzen: in der Ruhezone braucht die Karte
    // keine Höhe für Hübe, die nicht stattfinden — dafür immer ein fester Sicherheitsabstand.
    const lift = terrain.maxLift(true) * (1 - terrain.calmAt(st.position.x, st.position.z));
    const want = top + lift + tilt + 0.3;
    cardFloor += (want - cardFloor) * Math.min(1, dt * (want > cardFloor ? 14 : 2.2));
    return cardFloor;
  }

  // S11 · Die Modus-Anzeige ist WEG — kein Badge mehr. Sie darf fallen, weil S10 die Auskunft
  // durch Mechanik ersetzt: man sieht an der Höhe, in welchem Modus man ist. Was bleibt, ist der
  // Rahmen im DC (Wortmarke links, Meta rechts) und der Tacho im Würfel.
  // EINE Hinweiszeile statt zweier Legenden-Blöcke: blendet nach 8 s aus und in späteren
  // Sitzungen gar nicht mehr auf. Die vollständige Steuerung steht im Overlay (S8).
  const hint = document.createElement('div');
  hint.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:20px;text-align:center;"
    + "font-family:'Special Elite',monospace;font-size:12px;color:#fff;opacity:.9;"
    + 'text-shadow:0 2px 6px rgba(0,0,0,.7);transition:opacity 1.4s ease;pointer-events:none;';
  hint.textContent = 'W/S Schub · A/D lenken (bei Tempo rutscht das Pad) · X bremst · F landet · Doppelklick auf eine Karte = Anflug · Tab = Einstellungen';
  (document.getElementById('tv-hud') || stage).appendChild(hint);
  try {
    if (localStorage.getItem('kfb-travel-v9-hint') === 'seen') hint.style.display = 'none';
    else setTimeout(() => { hint.style.opacity = '0'; try { localStorage.setItem('kfb-travel-v9-hint', 'seen'); } catch (e) {} }, 8000);
  } catch (e) { setTimeout(() => { hint.style.opacity = '0'; }, 8000); }
  // S10 · MODUS OHNE SCHALTER. Der Modus war eine Folge der Höhe: Leertaste zweimal am Boden =
  // abheben · X oder Pfeil-runter = sinken · Bodenkontakt mit kleiner Sinkrate = zurück in Walk.
  //
  // **v15/F0 · Bodenkontakt ist kein Landebefehl mehr.** Georgs Auftrag zum Fork: „boden-kontakt
  // sollte nicht in den walk mode wechseln". Der Grund steht im Vorbild (tinyskies `Carpet.ts`):
  // dort ist Bodennähe ein FAHRZUSTAND — der Teppich schwebt über der Oberfläche und folgt ihr —
  // und kein Zustandswechsel. Bei uns war sie beides, und die Hälfte der Regeln in `mode-owner`
  // existiert nur, um die Fälle abzufangen, in denen sie es nicht sein sollte (`anflug-läuft`,
  // `detailansicht`, `sperrfrist`). Eine Regel, die man dreimal ausnehmen muss, ist keine Regel.
  //
  // Die Mechanik selbst ist NICHT gelöscht: `autoMode` steht auf **aus**, der Schalter bleibt im
  // Panel („Modus folgt der Höhe"), und `flight.state.landed` wird weiter veröffentlicht — nur
  // stellt niemand mehr einen Antrag daraus. Landen und Starten gehören ab v15 der Hand: **F**
  // (direkt) und **Leertaste ×2** am Boden. Rückweg: diese Zeile auf `true`.
  let autoMode = false;
  // **Die Modi tragen ihren Lebenszyklus selbst** (`enter`/`exit`), der Eigentümer entscheidet nur
  // über den Wechsel. Vorher war beides ein `if` in einer Funktion, und jede neue Bedingung wuchs
  // an der Aufrufstelle statt an einer Regel.
  const MODES_LIFECYCLE = {
    walk: { enter() {
      const p = flight.state.position; const gy = safeGroundAt(p.x, p.z) + terrain.maxLift(true) + 0.25;
      walk.reset(p.x, p.z, gy, Math.atan2(flight.state.forward.x, flight.state.forward.z));
      camRig.setWalkLookY(gy + walk.eyeUp);
      rig.setVisible(false); rig.setClipEnabled(false);
      petKin.enterWalk();
      if (pet) {
        scene.add(pet.object3D); pet.object3D.scale.setScalar(1.25);
        // no procedural loop in walk mode: those tweens move group.position, which
        // IS the walker's world position here — the clip layer carries the cycle.
        if (pet.motion) { pet.motion.stopLoops(); }
      }
    } },
    fly: { enter(opt) {
      const wp = walk.state.position;
      // Vom Boden kommend setzt die Karte DORT ein, wo das Pet stand, und in seiner Blickrichtung.
      // Sonst hüpft das Fahrzeug beim Abheben auf Reisehöhe — das war der Sprung in v5.
      const startAlt = opt && opt.alt != null ? opt.alt : null;
      flight.reset(wp.x, wp.z, startAlt, opt && opt.heading != null ? opt.heading : walk.state.heading);
      if (opt && opt.climb) flight.climbTo((startAlt != null ? startAlt : flight.state.alt) + opt.climb);
      cardFloor = terrain.groundHeightAt(wp.x, wp.z) + terrain.maxLift(true);   // kein Kriechstart
      rig.setVisible(true); rig.setClipEnabled(true);
      trails.reset();   // sonst spannt ein altes Band quer über die Karte
      petKin.leaveWalk(pet);
      petFace.reset(Math.PI);   // neuer Eltern-Raum (Sitz statt Szene): Gier nicht mitschleppen
      if (pet) { rig.seat.add(pet.object3D); pet.object3D.visible = true; pet.object3D.scale.setScalar(PET_SEAT_SCALE); pet.object3D.position.set(0, 0, 0); }
    } },
  };
  modeOwner = createModeOwner({
    initial: 'fly', modes: MODES_LIFECYCLE,
    onChange: (to) => {
      heat.setMode(to);   // Skala behalten, kein Sprung beim Wechsel
      camRig.snap();
      modeOwner.lock(0.9, 'gerade gewechselt');   // sonst pendelt es am Boden
    },
  });
  // **Die Bedingungen leben jetzt hier — benannt, an einer Stelle, zählbar.** Jede war einmal ein
  // Fehler: der Anflug, der im Boden-Modus endete; die Detailansicht, die vom Terrain zerrissen
  // wurde; das Pendeln direkt nach einem Wechsel. Und jede gilt nur für Anträge, die die HÖHE
  // stellt — was die Hand will, wird nicht abgelehnt.
  modeOwner
    .addRule('höhe-abgeschaltet', (c) => c.reason === 'altitude' && !autoMode)
    .addRule('anflug-läuft', (c) => c.reason === 'altitude' && auto.active)
    .addRule('detailansicht', (c) => c.reason === 'altitude' && dock.owns)
    .addRule('sperrfrist', (c) => c.reason === 'altitude' && modeOwner.locked);
  // Ein Antrag ist die EINZIGE Art, den Modus zu ändern. Diese Hülle existiert nur, damit die
  // Aufrufstellen kurz bleiben — sie enthält keine Bedingung.
  const requestMode = (to, reason, opt) => modeOwner.request(to, reason, opt);
  // Verträge werden GEPRÜFT, nicht zugesichert (Audit-Punkt 3b). Ein TS-Interface gibt es hier
  // nicht — diese Prüfung läuft und würde eine Abweichung melden, statt sie zu behaupten.
  const contracts = [assertController('flight-controller', flight), assertController('walk-controller', walk)];

  // Abheben = der Sprung, der nicht landet. Kein neuer Zustand in der Sprung-Grammatik:
  // walk.jump() ist beim ersten Tastendruck schon gelaufen, der zweite verlängert ihn.
  function takeOff() {
    if (!isWalk()) return;
    const ws = walk.state;
    if (!ws.onGround && ws.vy < -0.5) return;   // im Fallen nicht abheben (sonst Rettungs-Flug)
    requestMode('fly', 'takeoff', { alt: ws.position.y + 0.8, heading: ws.heading, climb: 12 });
  }

  // --- pet (canonical stack, default bunny) ---
  // **S93f · Zurück auf 1,15 — Originalgröße** (Georg, nach dem Bild: „doch besser ungefähr in
  // Originalgröße"). S93d hatte auf 1,45 erhöht, um das Gesicht lesbar zu machen; die Lesbarkeit
  // kommt jetzt aus dem Winkel (Lehne + Lesepult), nicht aus der Größe. EINE Zahl, zwei
  // Einhäng-Stellen (Mount und Rückkehr aus dem Boden-Modus).
  const PET_SEAT_SCALE = 1.15;
  let pet = null, petLib = null, petId = 'bunny', petBusy = false;
  // S93c · Wann wurde der Cursor zuletzt bewegt? Zwei Schreiber auf denselben Pupillen wären sonst
  // wieder der Fehler aus S89g: der Blick-Impuls der Erzählerposition (`pet-facing`) würde den
  // Cursor-Blick alle 0,3 s auf 0 zurückziehen. Jetzt hält er sich zurück, solange die Hand führt.
  let cursorAt = 0;
  // Die Oberfläche gehört der SZENE, nicht dem Pet: sie trägt Textur, Shader und Programm-Cache.
  // Einmal bauen, über jeden Pet-Wechsel behalten — pro Pet neu zu bauen hieße, den Shader jedes Mal
  // neu zu kompilieren (und §12.7 „Zombie-Renderer" einzuladen).
  let petSurf = null, petSurfTried = false;
  async function petSurface() {
    if (petSurf || petSurfTried) return petSurf;
    petSurfTried = true;
    try {
      const m = await import(/* @vite-ignore */ SURF_CANON);
      petSurf = await m.createPetSurface({ THREE, renderer, material: petLib && petLib.koerper && petLib.koerper.material });
    } catch (e) { console.warn('[travel-poc] Pet-Oberflaeche nicht ladbar → flacher Default', e); petSurf = null; }
    return petSurf;
  }
  // Pet-Wechsel läuft über DIESELBE Funktion wie der erste Mount (ein Pfad, kein Sonderfall).
  // Vertrag §12.6: altes Pet disposen, sonst stapeln sich Augen-Rigs.
  async function mountPet(id) {
    if (petBusy) return;
    petBusy = true;
    try {
      const { loadPets, makePet } = await petsModule();
      if (!petLib) petLib = await loadPets();
      const surface = await petSurface();   // nach loadPets: der Look kommt aus `koerper.material.live`
      // **Der Vertrag verspricht mehr als das Repo liefert — gemessen, nicht vermutet.** Die
      // Bauanleitung v2 (§10, 22.7.) sagt „`makePet(lib, id, { surface })`, kfb-pets.js verdrahtet
      // reskin + lidSampler selbst". Die kanonische `kfb-pets.js` auf @main ist aber **VERSION 1 vom
      // 20.7.** und enthält das Wort `surface` nicht ein einziges Mal (gemessen am geladenen Modul);
      // sie liest ausschließlich `opts.makeMat`. `surface` allein wäre also stumm — genau darum war
      // das Pet flach, obwohl der kanonische Stack längst geladen wird.
      // Deshalb beides: `surface` mitgeben (greift automatisch, sobald das Repo nachzieht) UND die
      // zwei Schritte hier selbst tun, die der neue `kfb-pets.js` tun WIRD.
      const p = await makePet(petLib, id, { THREE, motion: 'idle', surface, makeMat: surface ? surface.makeMat : undefined });
      // Körper: native Colormap behalten, Clay/Papier darüber (Triplanar, object-space — kein
      // Modell-UV, also keine Terrassen). Muss VOR `lighting.register` laufen: das hängt seinen
      // Tönungs-Haken an die Materialien, die dann da sind.
      if (surface && p.character) {
        const hex = typeof p.cfg?.color === 'string' ? new THREE.Color(p.cfg.color).getHex() : p.cfg?.color;
        try {
          surface.reskin(p.character, hex);
          // Lider tragen dieselbe Oberfläche statt glattem Plastik. Ob sie ihre Farbe aus der
          // Colormap holen, entscheidet das Modul selbst (v9-Regel: `kenneyBase` ODER kein
          // `pet.color`) — FrizzleBob hat eine Farbe, behält also seine dunkle Base.
          if (p.rig) {
            if (surface.usesLidSampler && surface.usesLidSampler(hex)) p.rig.lidSampler = surface.lidSampler;
            if (p.rig.reskinLids) p.rig.reskinLids();
          }
        } catch (e) { console.warn('[travel-poc] Oberflaeche nicht angewandt', e); }
      }
      p.object3D.rotation.y = Math.PI;   // face travel direction (-Z)
      p.object3D.traverse((n) => { if (n.isMesh) { n.castShadow = true; } });
      if (pet) { try { pet.object3D.removeFromParent(); pet.dispose && pet.dispose(); } catch (e2) {} }
      pet = p; petId = id; window.__pet = p;
      if (p.motion && p.motion.initParts) p.motion.initParts();
      // S93b · Der „wache" Zustand aus §7e: wandernder Ausdruck + unregelmäßiges Blinzeln. Beides ist
      // schon im Motor, es wird nur eingeschaltet — und beides ist Ruhe, kein Zappeln.
      try { if (p.face && p.face.setDrift) p.face.setDrift(true); } catch (e2) {}
      try { if (p.rig && p.rig.setBlink) p.rig.setBlink({ minGap: 2.2, maxGap: 6.5, dur: 0.13 }); } catch (e2) {}
      lighting.register(p.object3D);   // S14: Tint-Uniforms + envMapIntensity auf das neue Pet
      if (isWalk()) {
        petKin.enterWalk();
        scene.add(p.object3D); p.object3D.scale.setScalar(1.25);
        if (p.motion) p.motion.stopLoops();
      } else {
        p.object3D.scale.setScalar(PET_SEAT_SCALE); p.object3D.position.set(0, 0, 0);
        rig.seat.add(p.object3D);
        rig.applyClip(p.object3D);   // clip feet at the card surface
      }
      // **PFLICHT nach dem `add`** (Bauanleitung §10): ohne das baut three die Programme erst beim
      // ersten Zeichnen — mit ungebundenen Uniforms. Das ist genau das „flach/gold", das wir in
      // Pet-Editor v3 und v7 schon zweimal hatten. Ein Aufruf, hier, wo das Pet im Graph hängt.
      try { renderer.compile(scene, camera); } catch (e) {}
    } catch (e) { console.warn('[travel-poc] pet mount failed', e); }
    petBusy = false;
  }
  mountPet('bunny');
  // **S93b · Cursor-Eyetracking — der einzige DAUERZUSTAND, den die Prime Directive erlaubt.**
  // Bauanleitung §7e: der Blick folgt dem Cursor und **löst sich nach 2,4 s von selbst** in den Drift
  // zurück — kein Aufräumen, kein Dauer-Zappeln. (Die Anleitung sagt „`x` negieren"; das ist seit S94a
  // widerlegt — die Bildrichtung wird gemessen, siehe unten.) Ein Zuhörer, kein Verfolger.
  // Der Listener hängt an der Leinwand, nicht am Pet: er überlebt jeden Pet-Wechsel und liest immer
  // das aktuelle `pet`.
  // **S93f · Der Cursor-Blick braucht einen BEZUGSPUNKT, und der ist das Pet — nicht die Bildmitte.**
  //
  // Georg: „die Pupillen machen nur ungefähr die Cursor-Bewegung mit, folgen ihm aber nicht wirklich
  // überzeugend." Der Grund stand in meiner eigenen Zeile: ich habe die rohe Bild-Koordinate des
  // Cursors durchgegeben. Das Pet sitzt aber in der unteren linken Ecke (gemessen ndc −0,64 · −0,40),
  // also hieß „Cursor genau auf dem Pet" für die Augen **(−0,64 · −0,40) = schau nach unten links
  // weg**, und alles rechts der Bildmitte lag jenseits der Klemme bei 1,0 — der Blick klebte am
  // Anschlag und machte nur einen Teil der Bewegung mit. Genau Georgs Beschreibung.
  //
  // Richtig ist die RELATIVE Lage: Blickrichtung = (Cursor − Pet) im Bild, geteilt durch einen
  // Radius. Cursor auf dem Pet = ruhige Mitte, eine halbe Bildhöhe daneben = voller Ausschlag.
  //
  // Und `x` wird doch negiert — die Anleitung hatte recht, mein S93c-Befund war die FOLGE des
  // falschen Bezugspunkts: das Pet schaut uns an, sein Modell-Rechts liegt im Bild also links.
  //
  // **S94a · Ein festes Vorzeichen ist die falsche Antwort auf eine Frage, die sich dreht.**
  // Gemessen am laufenden Bild: `face.setCursor(+x)` dreht die Pupille um `+y` zum Modell-**Rechts**
  // (Rig: `_pivot.rotation.y = nx · 0,5`), und Modell-Rechts liegt im Lesebild bei ndc **+0,043**,
  // also im Bild RECHTS. Die Spiegelung schickte den Blick damit garantiert in die falsche Richtung —
  // genau Georgs Befund. Und mit `CURSOR_FLIP_X = false` wäre es nur so lange richtig, wie das Pet
  // uns ansieht: dreht es in die Fahrtrichtung, kippt das Vorzeichen wieder.
  // Also wird die Richtung nicht behauptet, sondern GEMESSEN: die Modell-Rechts-Achse wird ins Bild
  // projiziert, und der Cursor-Abstand auf diese Achse gelegt. Kein Vorzeichen mehr zu pflegen.
  const CURSOR_R = 0.55;        // ndc-Abstand für vollen Ausschlag
  const CURSOR_AXIS = true;     // Rückweg: false = rohes ndc-dx (Verhalten vor S94a)
  // **Und das Vorzeichen ist AM BILD gemessen — einmal, und es gehört `pet-facing`.** Die Blick-Achse
  // des Rigs zeigt zu Modell-−X (Standbilder: scraps/gaze-plus-face.png · gaze-minus-face.png). Derselbe
  // Wert steuert dort den Blick-Impuls zur Kamera, der bis S94a in die Gegenrichtung zog; er hier zu
  // duplizieren wäre die Fehlerklasse, die diese Reihe schon dreimal aufgegeräumt hat. Also gelesen,
  // nicht kopiert — der Fallback greift nur, falls ein älteres `pet-facing` daneben liegt.
  const gazeSign = () => (petFace && petFace.gazeSign != null ? petFace.gazeSign : -1);
  window.__gazeBuild = 's94b';   // Kontrolle, welcher Stand wirklich läuft (Vorschau-Cache)
  let curNdc = null;
  renderer.domElement.addEventListener('pointermove', (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    if (!r.width || !r.height) return;
    cursorAt = performance.now();   // auch ohne Pet mitschreiben: die Ruhezeit gehört der Eingabe
    curNdc = [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
  }, { passive: true });
  // Jeden Frame neu, solange die Hand führt: das Pet BEWEGT sich im Bild (Wind, Lesepult, Anflug) —
  // ein einmal gesetzter Blick wäre zwei Sekunden später falsch. Nach 2,2 s ohne Bewegung hört das
  // Auffrischen auf, und `setCursor` löst sich von selbst in den Drift auf (§7e): kein Dauerstarren.
  const _cg = new THREE.Vector3(), _cax = new THREE.Vector3();
  function refreshCursorGaze() {
    if (!curNdc || !pet || !pet.face || !pet.face.setCursor) return;
    if ((performance.now() - cursorAt) / 1000 >= 2.2) return;
    pet.object3D.getWorldPosition(_cg);
    _cg.y += (petFace.eyeLocalY || 0.6) * pet.object3D.scale.y;   // Augenhöhe, nicht Fußpunkt
    // Modell-Rechts als Bildrichtung: einmal die Achse mitprojizieren, daraus ein Einheitsvektor im ndc.
    _cax.set(1, 0, 0).transformDirection(pet.object3D.matrixWorld).multiplyScalar(0.25).add(_cg);
    _cg.project(camera); _cax.project(camera);
    const cl = (v) => Math.max(-1, Math.min(1, v));
    const dx = curNdc[0] - _cg.x, dy = curNdc[1] - _cg.y;
    let gx = dx;
    if (CURSOR_AXIS) {
      let ux = _cax.x - _cg.x, uy = _cax.y - _cg.y;
      const ul = Math.hypot(ux, uy);
      if (ul > 1e-4) { ux /= ul; uy /= ul; gx = dx * ux + dy * uy; }
    }
    try { pet.face.setCursor(cl(gazeSign() * gx / CURSOR_R), cl(dy / CURSOR_R)); } catch (e) {}
  }

  // ---------------------------------------------------------------- S8: EINSTELLUNGEN
  // Cluster nach Häufigkeit. Es stehen nur Regler drin, die ECHT etwas tun — lieber eine
  // Sektion mit drei ehrlichen Reglern als sechs, die Zukunft versprechen.
  let bpm = 104, beatGain = 1;                       // Rhythmus-Fallback ohne Ton
  // S20 · Klang. Der Takt kommt ab jetzt aus dem Track, den man hört; ohne Ton fällt der Runner
  // auf seinen synthetischen Takt zurück. EIN Ausgang, kein zweites System (Regel aus S1).
  const audio = createTravelAudio({ storyIndex: wc.storyModeIndex });
  let soundOn = false;   // erst eine Nutzergeste darf den AudioContext bauen (Autoplay-Policy)
  const armAudio = () => { if (!soundOn) return; if (!audio.ready) audio.start(); else audio.resume(); };

  // S22 · Sky-Karten als Flugziele. Durchflug → Portal-Auflösung + Einsatz + Zähler.
  // S23 · Die Blätter tragen echte Karten: Titel/Lore aus der Deck-JSON sofort, das Artwork als
  // 2×2-Quadrant aus dem Deck-PDF gedrosselt nach (Kanon aus v11, cardMapping im Repo-Manifest).
  const cardReg = createCardRegistry();
  const skyCards = createSkyCards({ THREE, count: 7, registry: cardReg });
  scene.add(skyCards.group);
  let artT = 0, artOn = true;
  // Deck-JSON erst nach vier Sekunden holen — die ersten Sekunden gehören dem Terrain-Aufbau.
  setTimeout(() => {
    cardReg.pool().then((list) => {
      if (list && list.length) {
        skyCards.setDeck(list, true);
        console.info('[travel] Kartenpool:', list.length, 'Karten aus', cardReg.decks.length, 'Decks');
      }
    }).catch(() => { /* Textkarten bleiben stehen — nie ein leeres Blatt */ });
  }, 4000);
  // S70 · **Der Erzähler.** Ebene 0 (Reflexe) + Ebene 1 (der Text der Karte), keine LLM — der Mund
  // darf nicht am Netz hängen. Er dreht die Musik NICHT selbst; er sagt „ich rede", und wer den Klang
  // besitzt, macht Platz (`audio.duck`). Standard: aus. Eine Stimme, die man nicht bestellt hat, ist
  // ein Radio.
  const narrator = createNarrator({
    onVoice: (on) => audio.duck(on),
    onLine: (t) => { apNote = '🐰 ' + t; apNoteT = 4; if (narrLLM) narrLLM.noteSpoken(t); },
    // S80 · Die LLM-Ebene liegt DARÜBER: `onCue` stellt die Frage für einen späteren Beat,
    // `lineSource` schaut synchron ins Fach. Leeres Fach = die Karte spricht ihren eigenen Text.
    onCue: (card, kind) => { if (narrLLM) narrLLM.cue(card, kind, llmLive()); },
    lineSource: (card, kind) => (narrLLM ? narrLLM.take(card, kind) : null),
  });
  let narratorOn = false;
  // S80 · Prompts aus dem Repo (`media/prompts/narrator/*.md`, zwölf Blätter), Code als Netz.
  // Standard: aus — dieselbe Regel wie beim Mund, und hier kostet jede Zeile zusätzlich eine Anfrage.
  const promptReg = createPromptRegistry();
  const llmLive = () => ({ v: heat.value, mode: story, card: auto.target || null });
  const narrLLM = createNarratorLLM({
    prompts: promptReg,
    onLine: (t) => narrator.line(t, 1),      // Tutor/QA sprechen durch denselben Mund
  });
  let llmOn = false;
  promptReg.loadIndex().then(() => narrLLM.setPersona(null));   // still: ohne index.json gilt die Liste im Code

  // S72 · Die Reihenfolge der Reise: linear (Deck für Deck) oder gemischt (gesät, wiederholbar).
  const jRoute = createJourneyRoute();

  // ---------------------------------------------------------------- EREIGNISSE (V9-D)
  // Acht Ereignisse, je EIN Zuhörer — deshalb kein Bus (Intermission §4a), aber eine TABELLE:
  // `EV.on(besitzer, name, was, fn)` an einer Stelle, mit Klartext, Zähler und Fehler-Isolation.
  // Eine werfende Rückmeldung darf den Sender nicht mitnehmen (der Auto-Pilot stirbt sonst an
  // einer HUD-Zeile). Ein Verteiler kommt, wenn ein Ereignis drei Zuhörer hat — die Tabelle sagt es.
  // S50 · Das Gedächtnis der Reise. Reiner Beobachter: es hört über die Ereignis-Tabelle zu und
  // ruft nie Physik, Kamera oder Modus — genau das fordert der v9-Audit („Academy als Observer").
  // Die Zahl der Lektionen pro Zone kommt von der Akademie, damit sie nicht an zwei Orten steht.
  const journey = createJourney({ chapterTotal: (ch) => academy.chapterTotal(ch) });
  journey.load();

  // S51 · Das Notizfeld. Es speichert nicht selbst: es liefert Text, die Journey merkt sich ihn,
  // die Akademie zeichnet ihn aufs Blatt. Drei Zuständigkeiten, eine Richtung.
  const noteField = createNoteField({
    mount: document.getElementById('tv-hud') || stage,
    onSave: (card, text) => {
      if (!card) return;
      journey.note(card, text);
      academy.setNote(card, text);
      note(text ? 'Notiz gesichert: ' + card.data.title : 'Notiz gelöscht: ' + card.data.title, 3);
    },
  });

  const EV = createEventTable();
  EV.on(skyCards, 'onPass', 'Sky-Karte durchflogen → Klang, HUD-Blitz, Merker',
      (data, n) => {
    audio.sfx('card');
    hud.flash && hud.flash();
    lastPass = { title: data.title, deck: data.deck, n };
  });
  let lastPass = null;

  // ---------------------------------------------------------------- S22d + S31
  // Der Auto-Pilot ist eine EINGABEQUELLE (siehe autopilot.js): er liefert dieselben
  // vier Werte wie die Tastatur. `flight-controller.js` bleibt unangetastet.
  // S73 · Zwei Nachträge aus Georgs Befunden: die Route hält an, solange die Detailansicht die Kamera
  // besitzt (`holdWhile`), und die Pause an der Karte ist lang genug für die drei Erzähler-Beats
  // (1,8 s reichte für einen halben Satz).
  // S92 · `holdWhile` hält die Reise, solange die Detailansicht GELESEN wird — nicht, solange das Dock
  // noch hinausfährt. Vorher `dock.owns`, und das ist in der `leave`-Phase noch true: der Wagen stand
  // dann die ganzen 3,9 s des Abflugs still, bevor er losfuhr. Beim Doppelklick auf eine andere Karte
  // war das die Hälfte von „er fährt nicht weiter" — die andere Hälfte war der Deadlock in `arrival`.
  // Jetzt fährt das Pad los, während die Kamera ausdockt: zwei Bewegungen, die sich nicht ausschließen.
  const auto = createAutopilot({ THREE, flight, params: { dwell: 3.4, holdWhile: () => dock.docked } });
  // S32c · Landung in die Karten-Detailansicht. Kein Overlay: das Dock mischt nur die
  // Kamera ein (ein Faktor, kein zweiter Zustand) — die Karte selbst ist der Viewport.
  const dock = createCardDock({ THREE });
  // S56 (v10) · **Die Ankunfts-Regie besitzt den Fortschritt der Ankunft.** Zoom, Dock-Gewicht,
  // Deckkraft von Pet und Flug-Karte und das Facing sind ab hier ABLEITUNGEN aus EINER Zahl —
  // vorher vier Bewegungen mit vier Uhren (Georgs Befund: „dreht sich durch die Karte weg,
  // wird dann transparent"). Der Abflug ist derselbe Fortschritt rückwärts.
  const arrival = createArrival({ params: {
    // S93 · Der Zoom endet dort, wo das Lesebild die Kamera hinstellt — nicht 0,75 u vor dem
    // Blatt. Begründung in `arrival.js` an `zoomNear` und in `card-dock.js` an `seatOn`.
    // Die Grenzen sind ein Rückweg, kein Geschmack: unter 1,6 u beginnt das POV-Mischband des
    // Rigs (`povNear` 1,0 / `povFar` 3,6) und mit ihm die Pet-Verdeckung — genau das, was dieser
    // Slice abschafft.
    zoomNearOf: () => {
      const c = (auto && auto.target) || dock.card;
      if (!c || !c.holder || isWalk()) return 0.75;
      const d = dock.followFor(view(), c, flight.state.position, camera.position);
      return d > 0.05 ? Math.max(1.6, Math.min(14, d)) : 0.75;
    },
  } });
  // S88 · Die Karte, die nach dem Abflug wieder schweben darf — siehe `onUndock`.
  let unpinAfter = null;
  let dockOnArrive = true;
  let flyTime = 9;   // S74 · 6 s waren bei den Abständen aus S73 (≈380 u) physikalisch nie erfüllbar
  // S73 · Lesezeit an der Karte auf einer Reise: so lange bleibt die Detailansicht stehen, dann löst
  // sie sich selbst und die Route fliegt weiter. Von Hand angedockt gilt das nicht (dann bist du dran).
  let routeRead = 5.5, routeDocked = false, routeDockT = 0;
  // S85 · **Die Reise fährt nicht von selbst weiter.** Georgs Befund: „Weiterfahrt startet automatisch
  // bei manueller Reise". Die Lesezeit war ein TIMER — nach `routeRead` Sekunden löste die Detailansicht
  // sich selbst und der Pilot flog zur nächsten Karte, auch mitten im Lesen. Eine Karte ist ein
  // Beweisstück, kein Dia: wann sie gelesen ist, entscheidet der Leser. Jetzt wartet die Reise an der
  // Karte, bis du löst (Esc / Steuern / Klick in den Himmel) — der Halt in `holdWhile` ist dann kein
  // Hinderniss, sondern der Zustand. Wer den alten Ablauf will, schaltet die Lesezeit im Panel wieder
  // ein; sie steht dann als Zahl daneben und läuft wie vorher.
  let routeAuto = false;
  // S74 · Post-its: Standard aus (Georg, 26.7.) — das Design ist unfertig, für die Reise braucht es sie nicht.
  let postitsOn = false;
  // Die Akademie ist ein ORT, kein Strom: 31 Karten in fünf Farbzonen, fest um den
  // Anker. Deck-Karten (S22/S23) und Academy schließen sich aus — zwei Kartenströme
  // im selben Himmel wären nur Krach.
  // `canRun` wird als Funktion übergeben, nicht als Liste: `live` entsteht erst weiter unten, und
  // eine Lektion kann sich zur Laufzeit als kaputt herausstellen (dann fällt sie aus `canRun`).
  const academy = createAcademyCards({ THREE, params: { canRun: (ex) => !!(live && live.canRun(ex)) } });
  scene.add(academy.group);
  // S71 · **Die Zonen sind Decks.** Der Ort holt seine Karten nicht selbst — er wüsste sonst von
  // PDFs. Der Runner lädt die drei Deck-Listen und legt sie ab; kommt ein Deck nicht an, bleibt
  // seine Zone bei ihrer Farbe (kein leeres Blatt, keine Ausrede).
  let deckFill = { geladen: 0, gefüllt: 0, fehler: [] };
  // S84 · **Die Lage der Zonen kommt aus den Daten.** Der Ring liest `zone-index.json` (Struktur)
  // und `zone-registry.json` (Ableitung) und wird erst eingehängt, wenn er WIRKLICH geladen hat —
  // fällt eine Datei aus, bleibt das v12-Sternraster stehen (auf „läuft" gaten, nicht auf
  // „existiert"). Abgeleitet wird nach dem Füllen der Decks, weil die Ableitung Titel/Power/Lore
  // braucht; vorher stünde in jedem Steckplatz nur „…" und alles würde derselbe Modus.
  const ring = createZoneRing({ THREE });
  // S85 · Der Boden als Frage, nicht als Import. `safeGroundAt` nimmt den HÖCHSTEN Würfel im Umkreis
  // (nicht den Punktwert) — eine Karte, die neben einer Säule schwebt, sieht sonst genauso falsch aus
  // wie eine, die darin steckt.
  ring.setGround((x, z) => safeGroundAt(x, z, 8));
  let ringOn = false;
  function ringDerive(tag) {
    if (!ring.ok) return;
    const n = ring.derive(academy.cards);
    if (!n) return;
    ring.recenter(flight.state.position, null, true, camera.position);
    // `setRing` schreibt die Lage SOFORT auf alle Karten (kein Warten auf den Blickwechsel) —
    // beim Laden ist das richtig, denn es gibt noch keinen Blick, der springen könnte.
    ringOn = academy.setRing(ring);
    console.info('[zone-ring]', tag, ring.report());
  }
  ring.load().then((okay) => { if (okay) ringDerive('geladen'); });
  for (const packId of academy.deckZones) {
    cardReg.loadDeck(packId).then((list) => {
      const n = academy.fillDeck(packId, list);
      deckFill.geladen++; deckFill.gefüllt += n;
      if (!n) deckFill.fehler.push(packId + ': keine Karten');
      ringDerive('deck ' + packId);
    }).catch((e) => { deckFill.fehler.push(packId + ': ' + (e && e.message || e)); });
  }
  // Kartenbilder: EINS zur Zeit, nächstgelegen zuerst (Pacer-Regel aus S23). `artBusy` verhindert,
  // dass dieselbe Karte doppelt in der Schlange steht.
  let deckArtT = 0;
  function pumpDeckArt(pos) {
    const c = academy.wantsArt(pos);
    if (!c || cardReg.pending > 0) return false;
    c.artBusy = true;
    cardReg.requestArt({ packId: c.data.packId, n: c.data.n },
      (crop) => { c.artBusy = false; academy.setArt(c, crop); },
      () => { c.artBusy = false; c.artDone = true; });   // endgültig: Zonenfeld bleibt, kein Retry-Sturm
    return true;
  }
  let academyOn = true;
  academy.setVisible(true);
  // S50 · **Was die Journey weiß, gehört zurück an die Karten.** Ohne diese Schleife erinnert sich
  // der Speicher und die Welt nicht — gespeicherter und sichtbarer Stand widersprechen sich, und
  // DREI Verbraucher lesen `card.data.visited`: das Post-it, die Strip-Meldung und die
  // Fortschrittsflaggen der Live-Demos. Der erste Anlauf hing an einem Anker, den es nicht gab
  // (`setVisible(academyOn)`), und eine Textersetzung ohne Treffer meldet nichts: **stiller
  // No-Match** — dieselbe Fehlerklasse, die das Projekt seit v8 führt.
  for (const c of academy.cards) {
    if (!journey.seen(c)) continue;
    const n = journey.noteOf(c);
    if (n) academy.setNote(c, n); else academy.markVisited(c);
  }
  skyCards.setVisible(false);

  // S60 (v11) · Die drei borromäischen Würfel. Sie sind das Gesetz als Gegenstand, nicht Deko —
  // also stehen sie immer am Himmel, unabhängig davon, ob die Akademie oder die Deck-Karten laufen.
  // Der Klang geht durch denselben Ausgang wie alles andere (`audio.sfx`), lazy verdrahtet: `audio`
  // existiert schon, der Kontext entsteht aber erst nach einer Nutzergeste.
  let beatNow = 0;          // Takt für die Würfel im Himmel, gesetzt im Frame-Pfad (ein Ausgang)
  const dice = createSkyDice({
    THREE, edgeTex: terrain.edgeTex,
    ink: storyMode.ink, panel: storyMode.panel,
    beat: () => beatNow,
    sfx: (k, s) => { if (soundOn) audio.sfx(k, s); },
  });
  scene.add(dice.group);
  let diceJudges = false;   // Wurf setzt den Story-Modus? Standard: nein — ein Wurf baut sonst die Welt neu.
  dice.onJudge = (pips) => {
    apNote = '⚀ King Kayfabian: ' + pips;
    apNoteT = 4;
    narrator.judge(MODES[(pips - 1) % MODES.length] && MODES[(pips - 1) % MODES.length].key);
    if (!diceJudges) return;
    const m = MODES[(pips - 1) % MODES.length];
    if (m && m.key !== story) { story = m.key; applyWorld(true); }
  };
  const live = createAcademyLive({ THREE, renderer,
    progress: () => { const f = []; for (const c of academy.cards) f[c.data.route] = c.data.visited; return { flags: f }; } });
  let shownLive = null, sheetT = 0, focusCard = null, lastLesson = null, apNote = '', apNoteT = 0, stripT = 0;
  // S32b · Voxel-Glyph-Titel: dieselben Würfel wie das Terrain, nur klein — EIN Satz für die
  // fokussierte Karte, nie 31. Der lange Titel bleibt in der DOM-Zeile; hier steht das Kurzwort.
  const glyphs = createVoxelGlyphs({ THREE });
  // **Standardmäßig AUS** (Georgs Befund): die Würfel-Glyphen überlagern die Karten, sind auf
  // Entfernung nicht lesbar und stören die Detailansicht. Der Port bleibt samt Regler erhalten —
  // der Ersatz ist eine lesbare, farbkodierte Headline-Schrift (eigener Slice), nicht dieser Titel.
  let glyphCard = null, glyphsOn = false, glyphCube = 0.23;
  // S46 · Der lesbare Titel: Irish Grover, extrudiert, papierfarben nach Zone getönt, schwebend
  // mit Tuschesteg zur Karte. EINER für die fokussierte Karte — dieselbe Regel wie beim Live-Pacer.
  const cardTitle = createCardTitle({ THREE });
  // **Standardmäßig AUS ab 2026-07-25 (Georg):** der Titel flackert beim Ein-/Ausblenden mit der
  // Kachel und stört die Anflug-Regie. Der Port bleibt samt Reglern erhalten — die Entscheidung,
  // ob Kartentitel überhaupt in der Welt stehen, fällt neu (siehe docs/HANDOVER_next-session.md).
  let titleOn = false, titleSubOn = true;
  // S33 · Navi: Eingabe = Live-Suche über alle 31 Lektionen, Doppelklick/Enter = Anflug.
  const search = createLessonSearch({
    mount: stage,
    cards: () => academy.cards,
    cubeSize: () => hud.sizePx,
    onSelect: (card) => { hud.flash && hud.flash(); },
    onFly: (card) => { search.close(); flyToCard(card); },
  });
  const note = (s, secs) => { apNote = s; apNoteT = secs || 4.5; };

  // EINE Zeile Auskunft, unten mittig: welche Lektion im Zugriff ist, was der Pilot
  // gerade tut. Text gehört ins DOM, nicht auf eine Textur — hier ist er scharf.
  const strip = document.createElement('div');
  // Georgs Befund: die Meta-Zeilen stören und brechen um. Also ganz nach unten, EINE Zeile,
  // kein Umbruch — was nicht passt, wird abgeschnitten statt die Bildmitte zu belegen.
  strip.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);bottom:10px;max-width:94vw;'
    + 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
    + "text-align:center;font-family:'Special Elite',monospace;font-size:12px;line-height:1.45;color:#fff;"
    + 'text-shadow:0 2px 6px rgba(0,0,0,.75);pointer-events:none;opacity:0;transition:opacity .35s ease;';
  (document.getElementById('tv-hud') || stage).appendChild(strip);

  // S59 · Der Ausweg aus der Foto-Karte: ein echter Link auf das laufende Beispiel bei threejs.org.
  // **Ein eigenes Element, kein Link in der Zeile** — die Zeile wird laufend neu geschrieben, ein
  // Anker darin wäre zwischen Drücken und Loslassen weg. Der Streifen ist `pointer-events:none`
  // (er darf das Ziehen nicht abfangen), also holt sich der Knopf die Zeigerereignisse einzeln zurück.
  const openBtn = document.createElement('a');
  openBtn.target = '_blank'; openBtn.rel = 'noopener';
  openBtn.textContent = 'Original öffnen ↗';
  openBtn.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);bottom:34px;'
    + "font-family:'Special Elite',monospace;font-size:12px;letter-spacing:.04em;text-decoration:none;"
    + 'color:#f7f0dd;background:rgba(25,20,16,.72);border:1px solid rgba(247,240,221,.45);'
    + 'padding:5px 12px;border-radius:2px;pointer-events:auto;display:none;'
    + 'text-shadow:0 1px 3px rgba(0,0,0,.6);';
  let shownOffer = null;
  (document.getElementById('tv-hud') || stage).appendChild(openBtn);

  // S71 · **Die Video-Karte, klein & sicher.** Ein fremder Player lässt sich nicht auf eine 3D-Fläche
  // malen — eine Sicherheitsgrenze des Browsers, kein Aufwand. Also: das Blatt trägt das Vorschaubild,
  // und in der Detailansicht liegt der echte Player als Fenster darüber. Er entsteht erst beim ersten
  // Andocken und wird beim Lösen ENTLADEN (`src` leer) — ein YouTube-Rahmen, der im Hintergrund
  // weiterläuft, ist ein Geräusch, das niemand bestellt hat.
  // S77 · **Der Sprung.** Eine Regie über vier Zahlen (Strudel · Striche · Blende · Tempo) — der Effekt
  // selbst kommt aus Systemen, die es schon gibt. Kein Teleport: gesprungen wird, indem die Welt kurz
  // mehr Tempo erlaubt (eine Zahl), nicht indem jemand die Kamera setzt (das war der Fehler aus S73).
  const jump = createWarpJump({ maxSpeed: flight.params.SPD_MAX });
  let jumpOn = true;
  // S78 · Ab welcher Entfernung eine unbesuchte Zielkarte heranwächst, und wie nah sie dann liegt.
  // 190 u sind ~4,5 s Flug bei 42 u/s — weit genug, dass der Anflug eine Regie hat (S56), nah genug,
  // dass niemand wartet.
  let growOn = true, growFrom = 320, growDist = 190;
  // S84 · Reise-Quelle: Ring (Registry-Kanten) oder die v12-Formen. Der Rückweg, den jeder Auftrag
  // braucht — sichtbar im Panel, nicht als Kommentar.
  let ringRoute = true;
  // Der Zustand des Sprungs lebt EINEN Frame und wird von mehreren Pipeline-Schritten gelesen
  // (Fahrtwind, Post-Pass). Deshalb hier oben, nicht als lokale Konstante in einem Schritt.
  let jst = { j: 0, swirl: 0, streak: 1, veil: 0, speedFactor: 1 };
  // S77b · Der Sockel wird nur gelesen, solange der Sprung RUHT — dann ist er, was der Regler sagt.
  // Erste Fassung schrieb jeden Frame in `SPD_MAX` und machte den Regler damit wirkungslos: der
  // Sprung war der zweite Eigentümer der Höchstgeschwindigkeit (dieselbe Fehlerklasse wie S73).
  let spdBase = flight.params.SPD_MAX, spdHeld = false;
  // Die Blende: Tusche, die sich von außen schließt. Ein Div mit radialem Verlauf — die Kontur einer
  // Karte als Maske wäre schöner und kommt, wenn der Sprung sonst sitzt (Konzept §3).
  const veil = document.createElement('div');
  veil.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;z-index:6;'
    + 'background:radial-gradient(ellipse at 50% 52%, rgba(25,20,16,0) 26%, rgba(25,20,16,.55) 52%, rgba(25,20,16,.97) 82%);';
  (document.getElementById('tv-hud') || stage).appendChild(veil);

  let videoBox = null;
  function videoShow(on) {
    if (!on) {
      if (videoBox) { videoBox.querySelector('iframe').src = 'about:blank'; videoBox.style.display = 'none'; }
      return;
    }
    if (!videoBox) {
      videoBox = document.createElement('div');
      videoBox.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);'
        + 'width:min(62vw,880px);aspect-ratio:16/9;background:#191410;'
        + 'border:2px solid rgba(247,240,221,.5);box-shadow:0 18px 60px rgba(0,0,0,.55);z-index:9;';
      const f = document.createElement('iframe');
      f.style.cssText = 'width:100%;height:100%;border:0;display:block;';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      videoBox.appendChild(f);
      (document.getElementById('tv-hud') || stage).appendChild(videoBox);
    }
    videoBox.querySelector('iframe').src = videoEmbed();
    videoBox.style.display = 'block';
  }

  EV.on(academy, 'onFocus', 'Lektionskarte im Zugriff → Glyph-Titel anhängen',
      (c) => { focusCard = c; attachGlyphs(c); attachTitle(c); });
  EV.on(academy, 'onPass', 'Lektionskarte durchflogen → besucht, Klang, Meldung',
      (card, n) => {
    audio.sfx('card');
    hud.flash && hud.flash();
    lastLesson = card.data;
    lastPass = { title: card.data.title, deck: card.data.deck, n };
    auto.arrived(card);                      // Durchflug IST die Ankunft
    journey.visit(card);
    narrator.cardPass(card);   // S73 · die KARTE, nicht ein Literal — `_beat` muss auf ihr liegen
    // v16/L2d · Der Durchflug schickt eine Welle vom Ort der KARTE aus, nicht vom Fahrzeug: sie
    // markiert, wo etwas war, und läuft dem Spieler hinterher, während er weiterfliegt.
    // Die Farbe ist die KONTRASTFARBE der Farbwelt (siehe `rippleColor`), nicht das Papier der
    // Karte und nicht die helle Spitze der Palette — beide wären auf dieser Fläche unsichtbar.
    if (rippleOn && rippleZone) {
      const p = card.object3D ? card.object3D.position : null;
      if (p) terrain.spawnRipple(p.x, p.z, rippleColor(), { life: 3.8, alpha: 0.85 });
    }
    note('Durchflogen: ' + card.data.title);
  });
  EV.on(auto, 'onArrive', 'Anflug angekommen → besucht, Karte pinnen, Dock anfordern',
      (card) => {
    // Ankommen IST besuchen. Der Durchflug ist die schönere Ankunft, aber nicht die einzige:
    // gemessen kam der Anflug zweimal von drei Malen neben der Kartenebene heraus (Abstand
    // 5,8 u, kein Vorzeichenwechsel) — ohne diese Zeile bliebe der Stempel dann aus und die
    // Route würde dieselbe Karte ewig erneut anfliegen.
    if (!card || !card.data) return;
    const fresh = !card.data.visited;
    academy.markVisited(card);
    journey.visit(card);
    lastLesson = card.data;
    note(fresh ? 'Angekommen: ' + card.data.title + '  ·  ' + academy.visited + ' von ' + academy.total
               : 'Wieder da: ' + card.data.title);
    // Karte SOFORT still stellen, nicht erst bei „gelandet“: das Pinnen ist ein Verlauf (2,2/s),
    // also ist die Ausrichtung fertig, wenn die Kamera ankommt. Vorher setzte es bei k ≥ 0,9 ein
    // und die Karte richtete sich neu aus, während die Kamera schon stand — das letzte Ruckeln.
    // S73 · **Ein Eigentümer der Kamera — und ein Rückweg für ihn.** Georgs Befund: nach ein bis zwei
    // Karten zeigte das Bild eine andere Karte als die, an der die Reise stand. Die Detailansicht hielt
    // die Kamera fest, während die Route weiterflog — zwei Eigentümer, dasselbe Muster wie bei den Modi
    // (V9-B). Sie ganz abzuschalten war die falsche Antwort (gemessen: 0 Karten im Bild bei der Ankunft
    // — ohne Dock richtet niemand die Kamera auf das Blatt). Also: die Ankunft dockt WEITERHIN, die
    // Route **hält an**, solange gedockt ist (`holdWhile`), und auf einer Reise löst sich das Dock nach
    // der Lesezeit von selbst wieder. Von Hand angedockt bleibt es, bis du Esc drückst.
    if (dockOnArrive && academyOn) {
      academy.pin(card, true);
      dock.request(card, camera);
      if (auto.queued > 0 && routeAuto) { routeDocked = true; routeDockT = routeRead; }
    }
    narrator.arrival(card);    // S73 · dito: sonst spricht die Ankunft den Nachsatz zweimal
  });
  EV.on(journey, 'onChapter', 'Zone vollständig besucht → Meldung (Erzählung folgt in S53)',
      (ch, rec) => note('Kapitel geschafft: ' + (rec.title || ('Zone ' + ch)), 6));
  EV.on(auto, 'onRoute', 'Route rückt vor → weit entferntes Ziel heranwachsen lassen, dann melden',
      (card, left) => {
    if (ringOn) { ring.unlockAll(); ring.lock(card); }   // S85 · auch der Route ihr Ziel einfrieren
    // S88 · und auch auf der Route steht das Ziel still, bevor man ankommt (siehe `flyToCard`).
    for (const other of academy.cards) if (other !== card && other.pinWant) academy.pin(other, false);
    academy.pin(card, true);
    // S78 · **Die Reise wächst mit, der Ort bleibt liegen.** Liegt die nächste Karte weiter als
    // `growFrom`, wird sie VOR den Spieler gesetzt — einmal, dann ist ihr Platz fest. Kein Nachladen,
    // kein Erzeugen: eine Positionszuweisung. Der Autopilot liest die Zielposition jeden Frame, also
    // greift es sofort (dieser Zuhörer läuft direkt nach `begin()`).
    let gewachsen = false;
    // S84 · Mit Ring KEIN Heranwachsen: `growAhead` setzt die Karte 190 u vor den Spieler und
    // schreibt sie fest — das wäre eine zweite Platzierungs-Wahrheit neben dem Hex-Gitter (genau die
    // Anti-Bedingung aus BRIEF B1). Das Einfrieren des Ziels macht `flyToCard` (S85, eine Stelle).
    if (growOn && !isWalk() && !ringOn) {
      const d = card.holder.position.distanceTo(flight.state.position);
      if (d > growFrom) gewachsen = academy.growAhead(card, flight.state.position, flight.state.forward, { dist: growDist });
    }
    note('Route: ' + card.data.title + '  ·  ' + left + ' danach' + (gewachsen ? '  ·  herangewachsen' : ''));
  });
  EV.on(dock, 'onDock', 'Detailansicht gelandet → pinnen, Meldung',
      (card) => {
    if (card.data.example === 'css3d_youtube') videoShow(true);   // S71 · Player als Fenster
    academy.pin(card, true);   // Sicherheitsnetz: auch bei Handstart gilt „Bild, kein Mobile“
    // Die Interaktions-Auskunft steht in der Strip-Zeile und ist dort live-abhängig — hier nur
    // die Ankunft melden. Vorher versprach diese Meldung „ziehen bedient die Demo" auch auf
    // Karten ohne Live-Lektion (28 von 31).
    note('Gelandet: ' + card.data.title, 3.5);
  });
  EV.on(dock, 'onLeave', 'Detailansicht gelöst → entpinnen, Zoom zurück, Notiz sichern',
      (card) => {
    videoShow(false);          // S71 · Rahmen entladen: kein Video, das im Hintergrund weiterläuft
    if (noteField.isOpen()) noteField.close(true);
    // **S88 · Die Karte bleibt still, solange die Kamera noch auf ihr liegt.** Hier stand
    // `academy.pin(card, false)` — und `onUndock` feuert am ANFANG des Abflugs. Die Karte fing also
    // wieder an zu schweben, während das Dock sie noch anschaute. Gemessen: ein Frame mit 2,85–4,28°
    // Blicksprung genau beim Übergabe-Ende (dockK 0,18 → 0,01), gegen 0,6° p95 sonst — der letzte
    // Ruck des Abflugs. Freigegeben wird jetzt erst, wenn die Regie fertig ist (`arrival.a` = 0),
    // unten in der Schleife. Dieselbe Regel wie beim Anflug: erst still stellen, dann bewegen.
    unpinAfter = card;
    // S61 · Jeder Auftrag braucht einen Rückweg: was in der Detailansicht aufgeklappt wurde, klappt
    // beim Verlassen wieder zu. Sonst hängen 31 offene Zettel in der Welt.
    academy.setFold(card, false);
    // **Kein harter Zoom-Rücksprung mehr.** `camRig.setZoom(9)` hier war der Abflug-Fehler:
    // die Kamera fuhr mit 2,4/s hinaus, das Dock löste sich mit 1/0,55 s, die Verdeckung mit
    // 2,4/s und das Facing mit 2,4/s — vier Rückwege für eine Bewegung. Jetzt läuft der eine
    // Fortschritt rückwärts, und der Zoom fällt mit ihm auf `zoomFar` zurück.
    arrival.release();
  });
  EV.on(auto, 'onWarn', 'Anflug meldet ein Problem (Zeit, Tempo, Ziel entkommen)',
      (w) => {
    // Nicht stillschweigend verfehlen: die Höchstgeschwindigkeit ist eine physikalische
    // Grenze, und S28/S30 rechnen später mit dieser Zahl.
    // S76 · Das ist kein Fehler, sondern eine weite Strecke: der Pilot hebt die Zielzeit selbst auf das
    // Erreichbare. „Nicht erfüllbar" klang wie ein Abbruch (Georg: „dann Abbruch") — geflogen wurde
    // trotzdem. Also sagt die Meldung, was wirklich passiert.
    if (w.reason === 'too-fast') note('Weite Strecke: ' + Math.round(w.dist) + ' u → ' + w.min.toFixed(0)
      + ' s bei Höchsttempo', 4);
    else if (w.reason === 'escaped') note('Ziel entkommen — Steuerung zurück bei dir.', 5);
    else note('Zeit verloren: nötig ' + Math.round(w.need) + ' u/s, Grenze ' + Math.round(w.max) + ' u/s', 6);
    console.info('[autopilot]', w);
  });

  const _ray = new THREE.Raycaster(), _ndc = new THREE.Vector2();
  function pickAcademy(clientX, clientY) {
    if (!academyOn) return null;
    const r = renderer.domElement.getBoundingClientRect();
    _ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    _ray.setFromCamera(_ndc, camera);
    // **S89g · Die angedockte Karte ist der Bildschirm, kein Ziel.** Georgs Befund: „wenn ich aus
    // einer Detailansicht eine andere Karte am Himmel doppelt anklicke, wird nur die Abflug-Animation
    // gespielt — man fliegt nicht hin; einmal bin ich zur falschen Karte geflogen." Beides ist EIN
    // Mechanismus: in der Detailansicht füllt das angedockte Blatt das Bild, also traf der Strahl es
    // selbst. `flyToCard` auf die Karte, vor der man schon steht, löst das Dock (= Abflug-Animation)
    // und hat danach nichts zu fliegen. Und wenn der Zeiger über ihrem Rand lag, war der Treffer die
    // Nachbarkarte — die „falsche Karte". Wer eine Karte anschaut, meint immer eine ANDERE.
    const hit = academy.pick(_ray, dock.owns ? dock.card : null);
    return hit;
  }
  // S92 · **Der Gegentest zu `pickAcademy`: liegt der Zeiger AUF der angedockten Karte?**
  // Er fehlte, und das war ein stiller Fehler in der Eingabe-Schicht: dort fragte der Zweig
  // „gedockt und ohne Demo → Zeiger schlucken" mit `pickAcademy` nach `hit.card === dock.card` —
  // eine Bedingung, die seit S89g **nie** wahr werden kann, weil genau diese Karte aus dem
  // Treffertest genommen wird. Der Zweig war also toter Code, und JEDER Klick in der Detailansicht
  // fiel in den Steuerzweig und löste das Dock — das Gegenteil dessen, was der Kommentar dort
  // versprach („Sonst ist die Detailansicht mit der Maus nicht berührbar, ohne sie zu verlassen").
  // Zwei Fragen, zwei Funktionen: `pickAcademy` sucht ein ZIEL (ohne die angedockte Karte),
  // `pickDocked` fragt die BEDIENFLÄCHE (nur die angedockte Karte). Das ist auch der Haken, den
  // S90b braucht: innen ziehen = Blatt schieben, außen ziehen = weiterreisen.
  function pickDocked(clientX, clientY) {
    if (!academyOn || !dock.owns || !dock.card) return null;
    const r = renderer.domElement.getBoundingClientRect();
    _ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    _ray.setFromCamera(_ndc, camera);
    const hits = _ray.intersectObject(dock.card.mesh, false);
    if (!hits.length) return null;
    return { card: dock.card, onScreen: true, uv: hits[0].uv, distance: hits[0].distance, point: hits[0].point };
  }
  function flyToCard(card, seconds) {
    if (!card) return;
    // Ein neuer Anflug verlässt die Detailansicht — IMMER, und zwar hier an der Wurzel statt in
    // jedem Auslöser. Gemessen: `R` startete die Route, während die Kamera vor der ALTEN Karte
    // klebte; 5 s später war der Spieler 28 u weg, die Demo tot, und die ganze Anflug-Regie
    // (Bremsweg, POV-Zoom, Landung) unsichtbar.
    if (dock.owns) dock.release();
    // S92 · **Und die Ankunfts-Regie bekommt gesagt, dass ein NEUER Auftrag läuft.** Ohne das lief der
    // Abflug (3,9 s) über dem neuen Anflug und man sah nur die Abflug-Animation — genau Georgs Satz
    // „ich verlasse zwar die Detailansicht, aber ich fliege noch nicht weiter." `dock.release()` oben
    // hat über `onLeave` schon `arrival.release()` ausgelöst; `reorder()` nimmt das zurück und stellt
    // die Uhr stattdessen EINMAL auf den Wert dieses Auftrags (S92b — der Weg auf 0 war ein Jo-Jo:
    // Kamera aus dem POV heraus, Pet und Karte zurück, dann wieder weg).
    arrival.reorder();
    // S85 · **Ein Ziel, das man anfliegt, zieht nicht um.** Der Ring versetzt Zonen laufend gegen
    // Überlagerung; auf dem Anflug ist das genau falsch (die Karte läuft davon, der Anflug wird länger
    // als die Regie denkt). Das Einfrieren stand bisher nur im Route-Zuhauer — hier ist die Wurzel, an
    // der JEDER Anflug vorbeikommt, also gehört es hierher. Rückweg: `unlockAll` beim nächsten Ziel.
    if (ringOn) { ring.unlockAll(); ring.lock(card); }
    // **S88 · Das Ziel steht still, BEVOR man ankommt — nicht erst, wenn man da ist.**
    // Georgs Befund „das Pet fliegt unter der Karte durch": die Karten-Eigendrift (±2 u Schweben)
    // wurde bisher erst im `onArrive` abgebaut, also während die Kamera schon landete. Gemessen
    // sackte die Karte dabei um 1,6 u weg, während das Pet stand — genau der Versatz, den man sieht.
    // Die Pin-Rampe läuft über ~0,45 s; sie gehört an den ANFANG des Anflugs, dann ist die Karte
    // längst ruhig, wenn das Pet eintrifft. Alle anderen entpinnen (ein voriges Ziel bliebe sonst
    // als Standbild hängen).
    for (const other of academy.cards) if (other !== card && other.pinWant) academy.pin(other, false);
    academy.pin(card, true);
    if (isWalk()) requestMode('fly', 'anflug', { climb: 16 });
    if (narrLLM) narrLLM.cancel();   // neues Ziel: alte Fragen sind ungültig (Rückweg, keine Altlast)
    auto.flyTo(card, { seconds: seconds != null ? seconds : flyTime });
    note('Anflug: ' + card.data.title + '  ·  ' + card.data.deck);
  }
  function flyRoute() {
    // S72 · Die Reihenfolge kommt aus EINEM Modul, nicht aus dieser Funktion. Vorher stand hier
    // „Kartenordnung, offene zuerst" als Code — jetzt ist es eine von zwei benannten Formen, und
    // welche gilt, sagt eine Einstellung. Werkstatt und Meta sind nicht Teil der Reise (sie sind
    // Orte, die man selbst besucht) — wer sie doch abfliegen will, nimmt weiter die ganze Liste.
    // S84 · **Die Reise läuft über den Ring, nicht über die Deck-Liste.** Läuft der Ring, ist er die
    // Reise-Quelle: gelaufen wird über `edges.flow` / `edges.river` aus der Registry (ring.walk).
    // `jRoute` bleibt als Rückweg stehen — abschaltbar über `ringRoute` im Panel, und automatisch,
    // wenn der Ring nicht geladen hat.
    const rlist = (ringOn && ringRoute) ? ring.walk(flight.state.position) : [];
    const list = rlist.length ? rlist : jRoute.build(academy.cards);
    const all = list.length ? list : academy.route();
    // S74 · **Erst zurückgeben, dann losfliegen.** Georgs Befund: aus der Detailansicht gestartet flog
    // die Reise ohne Pet los und landete ruckelig. Ursache: das Dock hielt die Kamera noch (es löste
    // erst, wenn man „zu weit weg" war — ein harter Schnitt mitten im Anflug). Also gibt der Reisestart
    // die Kamera EXPLIZIT zurück: Dock lösen, Karte entpinnen, Ankunfts-Regie zurückfahren.
    if (dock.owns) { dock.release(); routeDocked = false; }
    // S92b · Ein Reisestart ist ein neuer Auftrag, kein Rückzug — dieselbe Begründung wie in
    // `flyToCard` (vorher `arrival.release()`, das ergab das Jo-Jo aus dem POV heraus und wieder hinein).
    arrival.reorder();
    if (isWalk()) requestMode('fly', 'anflug', { climb: 16 });
    auto.routeTo(all, { seconds: flyTime });
    if (rlist.length) {
      const w = ring.walkReport();
      note('Ring-Reise: ' + all.length + ' Zonen · ' + w.zonenwechsel + ' Zonenwechsel · '
           + w.kanten + ' % über Registry-Kanten (' + w.flow + ' flow / ' + w.river + ' river)', 5);
      console.info('[zone-ring] walk', w, ring.sweep(camera));
      return;
    }
    const r = jRoute.report();
    note((r.form === 'mixed' ? 'Gemischte Reise (Wurf ' + r.seed + ')' : 'Lineare Reise')
         + ': ' + all.length + ' Karten · ' + jRoute.zoneWechsel(all) + ' Zonenwechsel', 5);
  }
  // Der Titel hängt AN der Karte (Kind des Halters), also billboardet und pinnt er mit ihr.
  // Größe: das Wort soll ungefähr die Kartenbreite einnehmen, aber ein Würfel nie größer als
  // `glyphCube` werden — sonst werden kurze Wörter wie DRAG zu Klotz-Buchstaben. Terrain-Cubes
  // sind 1,0; bei 0,23 liest man „dieselben Würfel, nur kleiner“.
  // Der Titel hängt am Kartenhalter (billboardet und pinnt also mit), reserviert sein Band EINMAL
  // und animiert nur darin — sonst rahmt das Dock je nach Schwebe-Frame etwas anderes.
  function attachTitle(card) {
    if (!titleOn || !card) { cardTitle.detach(); return; }
    const d = card.data || {};
    // Subline aus dem, was die Karte WIRKLICH weiß: Kapitel und Herkunft. Zwei Zeilen sind das
    // Maximum (Georgs Vorgabe), der Ticker für längere Texte kommt später auf denselben Platz.
    const sub = titleSubOn
      ? String(d.nr || '') + ' · ' + String(d.chapterTitle || '').toUpperCase()
        + (d.tag ? '\n[' + d.tag + '] ' + String(d.chapterSub || '') : '')
      : '';
    cardTitle.attach(card, { text: d.title, sub, tint: d.ink });
  }

  function attachGlyphs(card) {
    if (!glyphsOn || !card) {
      if (glyphCard) glyphCard.padTop = 0;
      glyphCard = null; glyphs.group.visible = false;
      return;
    }
    if (card === glyphCard) return;
    if (glyphCard) glyphCard.padTop = 0;
    glyphCard = card;
    const d = card.data;
    const m = glyphs.measure(d.glyph);
    const scale = Math.min((academy.params.width * 0.94) / Math.max(m.w, 1), glyphCube);
    const gh = m.h * scale;
    glyphs.group.scale.setScalar(scale);
    glyphs.group.position.set(0, card.half.h + gh * 0.5 + 0.55, 0.1);
    glyphs.group.visible = true;
    card.holder.add(glyphs.group);
    // Zonen-Palette: dunkle Tinte → Tinte → Panel. Die Zone ist damit auch am Titel lesbar.
    const ink = new THREE.Color(d.ink), panel = new THREE.Color(d.panel), dark = ink.clone().multiplyScalar(0.42);
    glyphs.setPalette([[dark.r, dark.g, dark.b], [ink.r, ink.g, ink.b], [panel.r, panel.g, panel.b]]);
    glyphs.setText(d.glyph);
    card.padTop = gh + 0.9;   // damit die Detailansicht den Titel mitrahmt
  }

  function updateStrip(dt) {
    apNoteT = Math.max(0, apNoteT - dt);
    if (!academyOn) { strip.style.opacity = '0'; openBtn.style.display = 'none'; shownOffer = null; return; }
    const parts = [];
    const s = auto.status;
    // S73 · Die Route hält an, solange die Detailansicht die Kamera besitzt. Ein Halt, den niemand
    // ankündigt, sieht wie ein Hänger aus (genau Georgs Befund) — also sagt die Zeile es.
    if (s.queued > 0 && dock.owns && !routeDocked) parts.push('Reise wartet · Esc löst · ' + s.queued + ' Zonen offen');
    // Der Knopf gehört genau einem Zustand: Detailansicht auf einer Karte, die NICHT spielbar ist.
    let offer = null;
    if (s.mode === 'fly' && auto.target) {
      parts.push('▶ Anflug: ' + auto.target.data.title + '  ·  ETA ' + s.eta.toFixed(1) + ' s'
        + (s.feasible ? '' : '  ·  weite Strecke, Warp'));
    } else if (dock.docked && dock.card) {
      // Auf „läuft" gaten, nie auf „existiert": nur 3 der 31 Lektionen sind live. Vorher lud die
      // Zeile unbedingt zum Ziehen ein — auf einer Vorschau-Karte war genau diese Geste der
      // Auswurf aus der Detailansicht.
      const liveHere = live.live && live.card === dock.card;
      const d0 = dock.card.data;
      const ex = d0.example;
      // S82 · Meta-Texte sagen jetzt, was WIRKLICH auf dem Blatt liegt. Der three.js-Ausweg gilt nur
      // für die alten Lektionskarten — auf einer KFB-Karte ist er eine falsche Auskunft.
      const lesson = !!(ex && ex.indexOf('kfb_') !== 0 && d0.kind !== 'kfb');
      if (!liveHere && lesson) offer = ex;
      parts.push('■ ' + d0.title + (d0.deck ? '  ·  ' + d0.deck : '')
        + (liveHere ? '  ·  läuft auf dem Blatt — ziehen bedient es'
          : (lesson ? '  ·  Vorschau, keine Demo' : '  ·  Beweisstück, kein Punktestand'))
        + '  ·  Esc = raus');
    } else if (s.mode === 'loiter' || s.mode === 'dwell') {
      parts.push('↻ kreist um ' + (auto.target ? auto.target.data.title : 'die Karte')
        + '  ·  W/S/A/D oder ziehen übernimmt');
    } else if (focusCard) {
      const d = focusCard.data;
      parts.push(d.deck + '  —  ' + d.title + (d.tag ? '  [' + d.tag + ']' : '')
        + (live.card === focusCard ? '  ·  läuft auf dem Blatt — ziehen'
          : (live.enabled && live.canRun(d.example) ? '  ·  startet …' : '  ·  Doppelklick = anfliegen')));    }
    if (apNoteT > 0 && apNote) parts.push(apNote);
    strip.innerHTML = parts.join('<span style="opacity:.45"> &nbsp;|&nbsp; </span>');
    strip.style.opacity = parts.length ? '1' : '0';
    // Nur schreiben, wenn sich etwas ändert — sonst setzt der Frame-Pfad jedes Bild Attribute neu.
    if (offer !== shownOffer) {
      shownOffer = offer;
      if (offer) {
        openBtn.href = 'https://threejs.org/examples/#' + offer;
        openBtn.style.display = 'inline-block';
      } else {
        openBtn.style.display = 'none';
        openBtn.removeAttribute('href');
      }
    }
  }
  // Tanz und Blinken sind ZWEI Kanäle (Georgs Befund: bei Tanz aus blinkten die Cubes weiter).
  // 'off' · 'beat' (an der Musik) · 'speed' (am Reisetempo) · 'both'
  let danceMode = 'both', blinkMode = 'both', blinkGain = 1;
  // Ruhezone am Boden (Georgs Befund: idealerweise hüpft nur der Boden, nicht die Kamera).
  // Je näher die Karte dem Boden kommt, desto ruhiger tanzen die Cubes unter ihr — dieselbe
  // Mechanik, die im Walk-Modus schon den Läufer schützt, nur mit weichem Übergang.
  let groundCalm = 0.9, calmAmt = 0;
  const CALM_LO = 3.5, CALM_HI = 15;   // voll ruhig unter 3,5 units über Grund, ab 15 voller Tanz
  let skyWorldMix = 0.4, skyExposure = 1, skySpiral = false;
  let quality = Math.min(devicePixelRatio || 1, 2);
  // Kamera-Zustand steht HIER, nicht in der Input-Schicht: das Overlay liest ihn beim Bauen
  // (die Regler zeigen ihren Wert sofort) — später deklariert wäre es ein TDZ-Fehler.
  // **S41 (V9-A):** Zoom, Gier, POV-Mischung und Dock-Einmischung leben im Rig, nicht mehr hier.
  // `pullIn`, `escapeTerrain` und `groundHeightAt` sind Funktions-Deklarationen (gehoistet), also
  // darf das Rig sie schon jetzt geliefert bekommen.
  const camRig = createCameraRig({ THREE, camera, pullIn, escapeTerrain, groundAt: groundHeightAt });
  let rebakeT = 0;
  const scheduleRebake = () => { clearTimeout(rebakeT); rebakeT = setTimeout(() => applyWorld(false), 130); };
  // v16/L2d · **Die Farbe einer Ringwelle ist ein Kontrast, keine Mitgliedschaft.** Der erste
  // Anlauf nahm `pal.stops[2]` (die helle Spitze der aktiven Palette) — gemessen und im Bild
  // bestätigt: unsichtbar, weil die Welle eine Farbe über eine Fläche mischt, die schon fast
  // diese Farbe hat. `contrastStop` dreht den Farbton um 155° und geht mit der Helligkeit auf
  // die Gegenseite; der Lesbarkeits-Riegel greift danach unverändert (in `spawnRipple`).
  // Eine Funktion, kein zwischengespeicherter Wert: die Farbwelt kann sich zwischen zwei Wellen
  // geändert haben, und eine Welle in der Farbe der VORIGEN Welt wäre wieder unsichtbar.
  function rippleColor() {
    const r = resolvePalette(paletteId, { wc, paletteFromVector });
    return contrastStop(rotateStops(r.stops, colors.hue));
  }

  // ---------------------------------------------------------------- v17/T1 · PARAMETERSATZ
  // **Ein Testergebnis ohne den Parametersatz, der es erzeugt hat, ist eine Anekdote.** Das ist
  // die Lehre aus Naht 115 in Reinform: L1 wurde auf einem festen Weltseed gemessen, L2a hat den
  // Seed gewürfelt, und die Abnahme war still ungültig. Damit das nicht wieder passiert, kann der
  // Zustand als EIN Objekt heraus — Seed, Story, Biom und alles, was an Reglern hängt.
  //
  // Er liegt in `localStorage['kfb-travel-params']`, weil die Testliste (eigene Datei, gleiche
  // Adresse) ihn dort abholt. Kein Server, keine Kopplung, kein Format-Vertrag zwischen zwei
  // Dateien außer diesem einen Schlüssel.
  function collectParams() {
    const fs = flight.params, st = terrain.stepping, cw = colors.params;
    const rp = terrain.rippleParams, pp = props.params;
    return {
      version: 'v16', at: new Date().toISOString(),
      seed: sessionSeed, story, worldSeed, biome: (wc && wc.biome) || null,
      paletteId, colorGuard, colorMaxLum,
      flight: { version: flight.version, driftOn: fs.driftOn, gripNormal: fs.gripNormal,
        gripDrift: fs.gripDrift, driftTurn: fs.driftTurn, driftMaxGap: fs.driftMaxGap,
        turnSmooth: fs.turnSmooth, turnDrag: fs.turnDrag, altRise: fs.altRise, altFall: fs.altFall,
        hugRise: fs.hugRise, hugBand: fs.hugBand, SPD_MAX: fs.SPD_MAX, boostYawGain: fs.boostYawGain },
      autoMode,
      stufung: { on: st.on, div: st.div, reliefFreq: st.reliefFreq, tFein: st.tFein,
        tMittel: st.tMittel, tGrob: st.tGrob, klippeMul: st.klippeMul },
      farbwelten: { on: cw.on, cellSize: cw.cellSize, crossDur: cw.crossDur, crossDist: cw.crossDist,
        atemOn: cw.atemOn, atemGap: cw.atemGap, atemHue: cw.atemHue, atemSwing: cw.atemSwing,
        hue: colors.hue, hier: colors.id },
      wellen: { on: rippleOn, touch: rippleTouch, zone: rippleZone, region: rippleRegion,
        speed: rp.speed, width: rp.width, gain: rp.gain },
      props: { ready: props.ready, own: terrain.propsOwn, density: terrain.propDensity,
        budget: pp.budget, biomeLogic: pp.biomeLogic, bend: pp.bend, lean: pp.lean, taper: pp.taper,
        twist: pp.twist, mix: pp.mix, round: pp.round, inflate: pp.inflate, tint: pp.tint,
        squash: pp.squash, squashLag: pp.squashLag, squashLagJitter: pp.squashLagJitter,
        sizeJitter: pp.sizeJitter },
      wuerfel: { spreadAz: dice.params.spreadAz, radius: dice.params.radius, size: dice.params.size },
      messwerte: {
        stufung: (() => { try { return terrain.stepReport(0, 0, 240, walk.params.autoJumpMax); } catch (e) { return null; } })(),
        props: (() => { try { return props.report(); } catch (e) { return null; } })(),
        farbwelten: (() => { try { return colors.report(); } catch (e) { return null; } })(),
      },
    };
  }
  function saveParams() {
    const p = collectParams();
    try { localStorage.setItem('kfb-travel-params', JSON.stringify(p)); } catch (e) {}
    console.info('[params] gesichert', p);
    note('Parametersatz gesichert — die Testliste kann ihn holen.', 4);
    return p;
  }
  // **Würfeln innerhalb der Regler-Grenzen.** Kein neuer Zufall, sondern die vorhandenen Grenzen
  // einmal durchgeschüttelt: so findet man Kombinationen, auf die niemand käme, und kann sie über
  // den Parametersatz zurückholen. Der Seed bleibt, damit die WELT dieselbe ist — sonst ändert man
  // zwei Dinge und weiß nicht, welches gewirkt hat.
  function rollParams() {
    const r = (a, b) => a + Math.random() * (b - a);
    terrain.setStepping({ div: Math.round(r(3, 10)), tFein: +r(0.3, 0.6).toFixed(2),
      tMittel: +r(0.65, 0.85).toFixed(2), tGrob: +r(0.88, 0.97).toFixed(2) });
    colors.setParams({ cellSize: Math.round(r(900, 3000) / 100) * 100, crossDur: +r(4, 16).toFixed(1),
      atemGap: Math.round(r(20, 90)), atemHue: +r(0.01, 0.07).toFixed(3) });
    terrain.setRippleParams({ speed: Math.round(r(20, 90)), width: Math.round(r(10, 50)), gain: +r(0.5, 1.3).toFixed(2) });
    props.setParams({ bend: +r(0.03, 0.22).toFixed(3), lean: +r(0.02, 0.14).toFixed(3),
      taper: +r(0.05, 0.3).toFixed(2), twist: Math.round(r(4, 32)), round: +r(0, 1).toFixed(2),
      inflate: +r(0, 0.035).toFixed(3), tint: +r(0.05, 0.6).toFixed(2),
      squash: +r(0.02, 0.14).toFixed(3), squashLag: +r(0, 0.25).toFixed(2) });
    flight.setParams({ gripNormal: +r(3, 9).toFixed(1), gripDrift: +r(0.8, 3).toFixed(1),
      turnDrag: +r(0, 0.25).toFixed(2), turnSmooth: +r(4, 14).toFixed(1) });
    if (props.ready) props.rebuild(terrain);
    note('Regler gewürfelt — Welt bleibt (Seed ' + sessionSeed + ').', 5);
    return saveParams();
  }

  // ---------------------------------------------------------------- v16/L2a · DER WELTWÜRFEL
  // Georgs Befund: „nicht immer mit dem gleichen Story-Mode und Terrain-/Skydome-Farben starten".
  // Der Grund stand in `travel-stage.js`: `WORLD_SEED` und `STORY` sind dort **Konstanten**
  // (`'kfb-travel-v4-slice3'`, `'heroic'`) — jede Sitzung dieselbe Welt.
  //
  // **Der Würfel zieht DREI Dinge unabhängig** (Story-Modus, Weltseed, Reihenfolge der
  // Farbwelten), aber alle aus EINER Zahl. Deshalb ist das kein Zufall, sondern eine Adresse:
  // dieselbe Zahl gibt dieselbe Welt, und der Seed steht im Panel. Ohne das ist „ich hatte gerade
  // eine schöne Welt" nicht wiederholbar — und ein Befund ohne Reproduktion ist eine Anekdote.
  //
  // Der Story-Modus gehört hier ausdrücklich dazu (er trägt die TINTE), weil er den START färbt.
  // Was er NICHT tut: sich beim Fliegen ändern — das ist die Region, und die fäßt nur die Farbwelt an.
  function rollWorld(seedIn) {
    sessionSeed = colors.reroll(seedIn);
    try { localStorage.setItem('kfb-travel-v16-seed', sessionSeed); } catch (e) {}
    const rng = mulberry32(joinSeeds('kfb-v16-start', sessionSeed));
    story = MODES[Math.floor(rng() * MODES.length) % MODES.length].key;
    worldSeed = 'kfb-v16-' + sessionSeed;
    applyWorld(true);   // neuer WorldContext + Rebake (gemessen 7 ms) + Palette
    note('Weltwürfel ' + sessionSeed + '  ·  ' + story, 5);
    return sessionSeed;
  }
  const wp = () => (wc.params || {});
  const tp = (k, d) => (wp()[k] != null ? wp()[k] : d);
  const setTp = (k, v) => { if (wc.params) { wc.params[k] = v; scheduleRebake(); } };

  // ---------------------------------------------------------------- PANEL-KONTEXT (S44b)
  // Die Regler leben in `settings-schema.js`. Damit sie die veränderlichen Runner-Zustände sehen,
  // werden diese an EIN Objekt gebunden — keine Kopie, ein Fenster auf dieselbe Variable.
  // So bleibt der Frame-Pfad unangetastet (er ist gemessen und läuft).
  const S = {};
  const bindS = (name, get, set) => Object.defineProperty(S, name, { get, set, enumerable: true });
  bindS('academyOn', () => academyOn, (v) => { academyOn = v; });
  bindS('artOn', () => artOn, (v) => { artOn = v; });
  bindS('autoMode', () => autoMode, (v) => { autoMode = v; });
  bindS('beatGain', () => beatGain, (v) => { beatGain = v; });
  bindS('blinkGain', () => blinkGain, (v) => { blinkGain = v; });
  bindS('blinkMode', () => blinkMode, (v) => { blinkMode = v; });
  bindS('bpm', () => bpm, (v) => { bpm = v; });
  bindS('calmAmt', () => calmAmt, (v) => { calmAmt = v; });
  bindS('danceMode', () => danceMode, (v) => { danceMode = v; });
  bindS('diceJudges', () => diceJudges, (v) => { diceJudges = v; });
  bindS('dockOnArrive', () => dockOnArrive, (v) => { dockOnArrive = v; });
  bindS('flyTime', () => flyTime, (v) => { flyTime = v; });
  bindS('routeRead', () => routeRead, (v) => { routeRead = v; });
  bindS('routeAuto', () => routeAuto, (v) => { routeAuto = v; });
  bindS('postitsOn', () => postitsOn, (v) => { postitsOn = v; academy.setPostits(v); });
  bindS('growOn', () => growOn, (v) => { growOn = v; });
  bindS('ringRoute', () => ringRoute, (v) => { ringRoute = v; });
  bindS('growFrom', () => growFrom, (v) => { growFrom = v; });
  bindS('growDist', () => growDist, (v) => { growDist = v; });
  bindS('jumpOn', () => jumpOn, (v) => { jumpOn = v; if (!v && spdHeld) { flight.setParams({ SPD_MAX: spdBase }); spdHeld = false; } });
  bindS('fxBlur', () => fxBlur, (v) => { fxBlur = v; });
  bindS('glyphCard', () => glyphCard, (v) => { glyphCard = v; });
  bindS('glyphCube', () => glyphCube, (v) => { glyphCube = v; });
  bindS('glyphsOn', () => glyphsOn, (v) => { glyphsOn = v; });
  bindS('titleOn', () => titleOn, (v) => { titleOn = v; });
  bindS('titleSubOn', () => titleSubOn, (v) => { titleSubOn = v; });
  bindS('groundCalm', () => groundCalm, (v) => { groundCalm = v; });
  bindS('lastLesson', () => lastLesson, (v) => { lastLesson = v; });
  bindS('lastPass', () => lastPass, (v) => { lastPass = v; });
  bindS('pet', () => pet, (v) => { pet = v; });
  bindS('petId', () => petId, (v) => { petId = v; });
  // **Die Hand gewinnt, aber sie sagt es.** Wer im Panel eine Palette wählt, während die
  // Farbwelten laufen, hätte sie beim nächsten Grenzübertritt wieder verloren — eine Auswahl,
  // die sich von selbst zurücknimmt, ist die Fehlerklasse „zwei Wahrheiten über eine Farbe".
  // Also schalten Farbwelten sich ab und melden das, statt still zu überstimmen.
  bindS('paletteId', () => paletteId, (v) => {
    paletteId = v;
    if (colors.params.on) { colors.setParams({ on: false }); note('Farbwelten aus — Handauswahl gewinnt.', 4); }
  });
  bindS('paletteSpread', () => paletteSpread, (v) => { paletteSpread = v; });
  bindS('colorGuard', () => colorGuard, (v) => { colorGuard = v; });
  bindS('colorMaxLum', () => colorMaxLum, (v) => { colorMaxLum = v; terrain.setRippleParams({ maxLum: v }); });
  bindS('rippleOn', () => rippleOn, (v) => { rippleOn = v; });
  bindS('rippleTouch', () => rippleTouch, (v) => { rippleTouch = v; });
  bindS('rippleRegion', () => rippleRegion, (v) => { rippleRegion = v; });
  bindS('rippleZone', () => rippleZone, (v) => { rippleZone = v; });
  bindS('varyStart', () => varyStart, (v) => { varyStart = v; });
  bindS('sessionSeed', () => sessionSeed, (v) => { sessionSeed = v; });
  bindS('rainbowSpeed', () => rainbowSpeed, (v) => { rainbowSpeed = v; });
  bindS('rainbowSpread', () => rainbowSpread, (v) => { rainbowSpread = v; });
  bindS('petLib', () => petLib, (v) => { petLib = v; });
  bindS('quality', () => quality, (v) => { quality = v; });
  bindS('shadowGain', () => shadowGain, (v) => { shadowGain = v; });
  bindS('shownLive', () => shownLive, (v) => { shownLive = v; });
  bindS('skyExposure', () => skyExposure, (v) => { skyExposure = v; });
  bindS('skySpiral', () => skySpiral, (v) => { skySpiral = v; });
  bindS('skyWorldMix', () => skyWorldMix, (v) => { skyWorldMix = v; });
  bindS('narratorOn', () => narratorOn, (v) => { narratorOn = v; narrator.setEnabled(v); });
  bindS('llmOn', () => llmOn, (v) => { llmOn = narrLLM.setEnabled(v); });
  bindS('soundOn', () => soundOn, (v) => { soundOn = v; });
  bindS('story', () => story, (v) => { story = v; });
  bindS('storyMode', () => storyMode, (v) => { storyMode = v; });
  bindS('worldSeed', () => worldSeed, (v) => { worldSeed = v; });
  // **Getter statt Werte.** Das Panel wird gebaut, bevor die Eingabe-Schicht und `resize`
  // deklariert sind — ein Objektliteral hätte sie EAGER gelesen und beim Start einen
  // TDZ-Fehler geworfen (genau so gemessen: „Cannot access 'keys' before initialization“).
  const schemaCtx = { S, get colors() { return colors; }, get rollWorld() { return rollWorld; }, get applyPalette() { return applyPalette; }, get props() { return props; }, get saveParams() { return saveParams; }, get rollParams() { return rollParams; }, get collectParams() { return collectParams; },
    // v16/L2d · Die Panel-Probe braucht die AKTIVE Palette (gedreht + geriegelt), nicht die rohe —
    // sonst zeigt der Probeknopf eine Farbe, die im Bild nirgends vorkommt.
    paletteStops: paletteStopsNow,
    get rippleColor() { return rippleColor; },
    get ring() { return ring; }, get ringOn() { return ringOn; }, get camera() { return camera; }, get spdBase() { return spdBase; }, get jump() { return jump; }, get jRoute() { return jRoute; }, get FORMS() { return FORMS; }, get flyRoute() { return flyRoute; }, get narrator() { return narrator; }, get narrLLM() { return narrLLM; }, get promptReg() { return promptReg; }, get llmLive() { return llmLive; }, get cardTitle() { return cardTitle; }, get attachTitle() { return attachTitle; }, get THREE() { return THREE; }, get MODES() { return MODES; }, get STORY() { return STORY; }, get hud() { return hud; }, get applyPalette() { return applyPalette; }, get colorP() { return colorP; }, get dice() { return dice; }, get WORLD_SEED() { return WORLD_SEED; }, get academy() { return academy; }, get applyWorld() { return applyWorld; }, get arrival() { return arrival; }, get attachGlyphs() { return attachGlyphs; }, get audio() { return audio; }, get auto() { return auto; }, get camRig() { return camRig; }, get cardReg() { return cardReg; }, get curMode() { return curMode; }, get dock() { return dock; }, get flight() { return flight; }, get flyRoute() { return flyRoute; }, get glyphs() { return glyphs; }, get heat() { return heat; }, get hud() { return hud; }, get isWalk() { return isWalk; }, get keys() { return keys; }, get lighting() { return lighting; }, get lines() { return lines; }, get live() { return live; }, get mountPet() { return mountPet; }, get note() { return note; }, get petFace() { return petFace; }, get petKin() { return petKin; }, get post() { return post; }, get renderer() { return renderer; }, get requestMode() { return requestMode; }, get resize() { return resize; }, get rig() { return rig; }, get search() { return search; }, get noteField() { return noteField; }, get journey() { return journey; }, get setTp() { return setTp; }, get sky() { return sky; }, get skyCards() { return skyCards; }, get terrain() { return terrain; }, get tp() { return tp; }, get trails() { return trails; }, get walk() { return walk; } };

  settings = createSettingsOverlay({
    mount: stage,
    eyebrow: 'KFB Travel v13',   // der Runner kennt seine Version, das Overlay nicht

    accent: '#' + new THREE.Color(storyMode.ink).getHexString(),
    onOpen: () => { hud.setEnabled(false); keys.clear(); },
    onClose: () => hud.setEnabled(true),
    sections: buildSections(schemaCtx),
  });

  // ---------------------------------------------------------------- EINGABE (S44c)
  // Tasten, Zeiger, Rad und die Umrechnung in Fahrzeugwerte liegen in `travel-input.js`.
  // Getter statt Werte, weil die Schicht gebaut wird, bevor alles deklariert ist.
  // `camera` MUSS hier stehen: der Post-it-Treffer und das Notizfeld brauchen sie, und ein
  // fehlender Getter fällt nicht auf — `ctx.camera` ist dann `undefined`, `hitsPostit` liefert
  // stumm `false`, und der Klick rutscht in den Steuerzweig, der die Detailansicht löst.
  const inputCtx = { get academy() { return academy; }, get camera() { return camera; }, get armAudio() { return armAudio; }, get auto() { return auto; }, get camRig() { return camRig; }, get dock() { return dock; }, get flyRoute() { return flyRoute; }, get flyToCard() { return flyToCard; }, get isWalk() { return isWalk; }, get live() { return live; }, get note() { return note; }, get petKin() { return petKin; }, get pickAcademy() { return pickAcademy; }, get pickDocked() { return pickDocked; }, get renderer() { return renderer; }, get requestMode() { return requestMode; }, get resize() { return resize; }, get search() { return search; }, get noteField() { return noteField; }, get journey() { return journey; }, get settings() { return settings; }, get takeOff() { return takeOff; }, get walk() { return walk; }, get academyOn() { return academyOn; }, get autoMode() { return autoMode; }, get shownLive() { return shownLive; } };
  const travelInput = createTravelInput(inputCtx);
  const keys = travelInput.keys;
  const readInput = (dt) => travelInput.read(dt);
  // Der `resize`-Listener wohnt im Eingabe-Modul (Fenstergröße ist eine Eingabe wie das Rad).
  // Beim Extrahieren stand er kurz an BEIDEN Stellen — gemessen: 2 × `renderer.setSize` für ein
  // Ereignis, 2,2 ms, doppelt neu angelegte Render-Targets. Ein Ereignis, ein Zuhörer.

  // --- RE-ATTACH-WACHE ---------------------------------------------------------
  // Der DC-Runtime kann `#tv-stage` bei einem Template-Re-Render durch einen NEUEN
  // Knoten ersetzen. Unsere Knoten hängen dann an einem Waisen-Stage: `parentElement`
  // stimmt noch, `document.contains()` ist false — Ergebnis war ein leerer blauer Screen,
  // den nur ein Reload heilte (Boot-Reihenfolge-Glück). Statt Glück: jede halbe Sekunde
  // prüfen und alles Eigene ins aktuelle Stage hängen.
  const owned = () => [renderer.domElement, settings.root].filter(Boolean);
  let liveStage = stage, attachT = 0;
  function resize() {
    const w = liveStage.clientWidth || 1, h2 = liveStage.clientHeight || 1;
    renderer.setSize(w, h2);
    camera.aspect = w / h2; camera.updateProjectionMatrix();
    post.setSize(w, h2, renderer.getPixelRatio());
    lines.setAspect(w / h2);
  }
  function keepAttached(dt) {
    attachT += dt;
    if (attachT < 0.5) return;
    attachT = 0;
    // `document.contains` l\u00fcgt bei Shadow DOM (dort ist der Knoten verbunden, aber nicht im
    // Dokumentbaum) \u2014 `isConnected` ist die Frage, die wir wirklich stellen.
    if (renderer.domElement.isConnected) return;
    const s = findStage();
    if (!s || !s.isConnected) return;
    liveStage = s;
    for (const n of owned()) s.appendChild(n);
    const hudBox = s.querySelector('#tv-hud') || document.getElementById('tv-hud');
    if (hint && !document.contains(hint)) (hudBox || s).appendChild(hint);
    if (strip && !document.contains(strip)) (hudBox || s).appendChild(strip);
    if (openBtn && !document.contains(openBtn)) (hudBox || s).appendChild(openBtn);
    if (videoBox && !document.contains(videoBox)) (hudBox || s).appendChild(videoBox);
    if (veil && !document.contains(veil)) (hudBox || s).appendChild(veil);
    if (search.root && !document.contains(search.root)) s.appendChild(search.root);
    if (noteField.root && !document.contains(noteField.root)) (hudBox || s).appendChild(noteField.root);
    resize();
    camRig.snap();
  }

  // **Anhängen darf nicht am Bild hängen.** `keepAttached` läuft als erster Schritt der
  // Frame-Schleife — und genau die pausiert, wenn der Browser die Seite für verborgen hält (rAF wird
  // gedrosselt oder gestoppt). Baut der Wirt in dieser Zeit sein Template neu, ist das Canvas an einem
  // abgehängten Knoten und die Schleife, die es reparieren würde, läuft nicht: schwarzes Bild, kein
  // Fehler, kein Ausweg. Gemessen am 26.7.: Bildzähler friert bei 41–47, alle Schritte melden „ok".
  // Deshalb zwei Wege, die ohne Bild funktionieren: ein Takt jede halbe Sekunde und ein Blick, sobald
  // sich am DOM oder an der Sichtbarkeit etwas ändert. `keepAttached` ist idempotent (es prüft
  // `isConnected` zuerst), also kostet der zweite Weg nichts, wenn alles schon hängt.
  const attachNow = () => { try { keepAttached(0.6); } catch (e) { console.warn('[travel-poc] attach', e); } };
  setInterval(attachNow, 500);
  document.addEventListener('visibilitychange', attachNow);
  try {
    new MutationObserver(() => { if (!renderer.domElement.isConnected) attachNow(); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) { /* ohne Observer bleibt der Takt — ein Weg genügt */ }


  // ---------------------------------------------------------------- LOOP
  const _sunOff = new THREE.Vector3(30, 60, 20);
  // Das Dock darf die Kamera nicht mehr SEHEN, nur ihr Bildfeld lesen — was man nicht hat, kann man
  // nicht schreiben. Ein Objekt, wiederverwendet: der Frame-Pfad bleibt allokationsfrei.
  const _view = { fov: 54, aspect: 1 };
  const view = () => { _view.fov = camera.fov; _view.aspect = camera.aspect; return _view; };
  // S41 · Die Kamera-Zwischenvektoren sind in `camera-rig.js` gewandert — mit ihnen die
  // Follow-/POV-/Pull-in-Zustände. Hier bleibt nur, was die Welt betrifft.
  // Deckkraft-Verlauf des Pets: die Materialliste wird EINMAL gesammelt (kein Traverse pro Frame).
  // **Fremde Materialien werden geliehen, nicht umgeschrieben.** Erster Versuch setzte
  // `transparent`/`depthWrite` auf allen Pet-Materialien und "stellte" danach ERFUNDENE Werte her
  // (transparent=false, depthWrite=true). Der Mund lebt aber von seinem eigenen Alpha — Ergebnis war
  // ein weißer Kasten im Gesicht (Georgs Screenshot). Der Pet-Stack besitzt diese Materialien.
  // Also: Originalzustand EINMAL merken, beim Ausblenden nur die Deckkraft fahren, am Ende **exakt**
  // den gemerkten Zustand zurückgeben.
  // Ein Verlauf pro Wurzel, Zustand daran gemerkt. **Die Materialliste wird neu gesammelt, wenn
  // die Zahl der Meshes sich ändert** — der Pet-Stack baut Teile nachträglich (`initParts`), und
  // genau deshalb blieben die OHREN beim Ausblenden kurz stehen und poppten dann weg (Georgs
  // Befund): sie waren im Schnappschuss nicht enthalten.
  const _fades = new WeakMap();
  // S89n · Baumlauf, der einen Unterbaum AUSLÄSST. `THREE.traverse` kann nicht beschnitten werden, und
  // genau daran hängt die Vollständigkeit: eine handgeschriebene Mesh-Liste (S89i: `padParts`) lässt
  // jeden später eingehängten Mesh verwaisen — so ist der Kontaktschatten durchgefallen. Aus der WURZEL
  // MINUS Pet abgeleitet kann das nicht passieren, auch nicht bei künftigen Kindern.
  function walkSkip(o, skip, cb) {
    if (!o || o === skip) return;
    if (o.material) cb(o);
    const ch = o.children;
    for (let i = 0; i < ch.length; i++) walkSkip(ch[i], skip, cb);
  }
  let vehicleOut = 0;
  // S93 · Rückweg für das Verdecken des Fahrzeugs im Lesebild (Begründung an der Zuweisung unten).
  const vehicleHide = false;
  // S89o · „Wie weit ist das PET verdeckt" — zweite Zahl derselben Bauart, und aus demselben Grund
  // modulweit: der Kontaktschatten wird in `stepFly` platziert, gesetzt wird der Wert in `stepFade`.
  // In S89n stand sie als `const` INNERHALB von `stepFade` und wurde in der Geschwisterfunktion
  // gelesen — ein `ReferenceError` pro Frame, den der Manager isoliert und nur EINMAL meldet. Der
  // Schatten wurde deshalb nie mehr platziert (die Geometrie fror ein), während sein Fade weiterlief:
  // es sah richtig aus und war es nicht.
  let petOut = 0;
  function fadeApply(root, f, skip) {
    if (!root) return;
    let st = _fades.get(root);
    let meshes = 0; walkSkip(root, skip, () => { meshes++; });
    if (!st || st.meshes !== meshes) {
      st = { mats: [], last: -1, meshes };
      const seen = [];
      walkSkip(root, skip, (o) => {
        for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          if (seen.indexOf(m) >= 0) continue; seen.push(m);
          st.mats.push({ m, tr: m.transparent, op: m.opacity, dw: m.depthWrite });
        } });
      _fades.set(root, st);
    }
    const a = Math.max(0, Math.min(1, 1 - f));
    root.visible = a > 0.012;
    if (Math.abs(a - st.last) < 0.004) return;   // nur bei echter Änderung anfassen
    st.last = a;
    for (const e of st.mats) {
      if (a > 0.995) { e.m.transparent = e.tr; e.m.opacity = e.op; e.m.depthWrite = e.dw; }
      // **S89d · `depthWrite` bleibt AN, solange überhaupt etwas zu sehen ist.** Hier stand
      // `e.dw && a > 0.6` — die übliche Regel für transparente Flächen, und für einen ausblendenden
      // MASSIVEN Körper genau falsch: ohne Tiefenschreiben verliert das Modell seine
      // Selbstverdeckung, und die inneren Teile (Schnauze, Lidschalen, Augen) sortieren sich frei vor
      // und hinter den Kopf. Das ist Georgs „3D-Modell-Fehler, sieht aus wie ein Umdrehen, Artefakt
      // zwischen den Ohren, und dann wird es ausgeblendet" — der Zustand tritt NUR zwischen Deckkraft
      // 0,6 und 0,01 auf, also genau im Ausblenden, und deshalb sah er wie ein Timing-Fehler aus.
      // Für ein Objekt, das als Ganzes verschwindet, ist Selbstverdeckung wichtiger als korrektes
      // Blenden seiner eigenen Innenflächen gegeneinander.
      else { e.m.transparent = true; e.m.opacity = e.op * a; e.m.depthWrite = e.dw; }
    }
  }
  // S56 · `dockHide` ist ERSETZT. Es war ein eigener Tiefpass (2,4/s) auf einer Schwelle
  // (`dock.progress > 0,28`) — also eine dritte Uhr auf derselben Bewegung. Die Verdeckung ist
  // jetzt `arrival.hide`, ein Fenster auf demselben Fortschritt wie alles andere.
  let apBrakeV0 = 0;   // (v9-Rest, unbenutzt — fällt beim nächsten Aufräumen)
  // Die Schwelle `DOCK_TAKES_OVER` ist ERSATZLOS weg. Sie war der letzte Ort, an dem eine ZAHL
  // entschied, wann das Bild der Karte gehört — jetzt entscheidet das Fenster `hideWin` auf dem
  // Fortschritt der Regie, und Verdeckung und Bänder lesen denselben Faktor.
  let last = performance.now(), synthPhase = 0, synthBeat = 0, lastChunkX = 1e9, lastChunkZ = 1e9, walkBobT = 0, boostPulse = 0, wasGrounded = true, lastStep = 0, rollWasActive = false, aglNow = 30;
  window.__travelPOC = { renderer, scene, camera, flight, walk, rig, petKin, petFace, terrain, sky, heat, hud, dice, lines, post, trails, lighting, petShadow, audio, skyCards, cardReg, auto, academy, colors, rollWorld, applyPalette, rippleColor, props, loadProps, saveParams, rollParams, collectParams, colors, rollWorld, applyPalette, ring, narrator, narrLLM, promptReg, jRoute, jump, live, dock, arrival, glyphs, cardTitle, journey, noteField, search, camRig, flyToCard, flyRoute, get focusCard() { return focusCard; }, get lastPass() { return lastPass; }, get wc() { return wc; }, get settings() { return settings; }, get story() { return story; }, get mode() { return curMode(); }, setMode: (m) => requestMode(m, 'debug'), get modeOwner() { return modeOwner; }, get contracts() { return contracts; }, get events() { return EV; }, get mgr() { return mgr; }, get pet() { return pet; }, get boostPulse() { return boostPulse; } };
  // Bühnen-Beschriftung aus EINER Quelle (siehe SHELL_META). Beide Fassungen — index.html und das
  // DC — liefern nur das leere Element; der Text kommt von hier.
  {
    const el = document.getElementById('tv-meta');
    if (el && !el.children.length) {
      const t1 = document.createElement('div'); t1.className = 't'; t1.textContent = SHELL_META.title;
      const t2 = document.createElement('div'); t2.className = 's'; t2.textContent = SHELL_META.sub;
      el.appendChild(t1); el.appendChild(t2);
    }
  }
  resize();   // Rendertarget + Speedline-Aspekt einmal auf die echte Stage-Größe setzen
  // v15 · **Die Abnahme des Flug-Sprints ist DIESE Zeile**, nicht das Boot-Log: sie nennt die
  // Controller-Fassung und die drei Schalter, die das Fahrgefühl bestimmen. Fehlt sie, läuft ein
  // anderer Stand als der dokumentierte (die Lehre aus HOUSEKEEPING §4v, Naht 78).
  console.info('[travel-v16] ' + flight.version + '  ·  Drift ' + (flight.params.driftOn ? 'an' : 'aus')
    + '  ·  Kufe ' + flight.params.hugRise
    + '  ·  Modus folgt der Höhe: ' + (autoMode ? 'JA (v14)' : 'nein — Bodenkontakt landet nicht'));
  // v16/L1 · **Die Abnahme der Stufung ist eine ZAHL, keine Behauptung.** Eine Reliefkarte kann
  // man sich ausdenken; ob daraus Hänge NEBEN Klippen werden, muß man zählen.
  // v16/L2a · **Der Start ist ab jetzt gewürfelt — aber benannt.** Erst hier, weil `applyWorld`
  // das halbe Bild anfäßt (HUD, Würfel, Speedlines, Ton) und alles davon stehen muß.
  if (varyStart) rollWorld(sessionSeed);
  console.info('[farbwelten] ' + JSON.stringify(colors.report()));
  // Nach dem Weltwürfel, damit das Biom feststeht (es entscheidet über `_dark`/`_fall`).
  // Nicht awaited: die Reise startet sofort, die Props kommen nach.
  loadProps();
  // ⚠ v16/L1b · **Diese Messung steht HINTER dem Weltwürfel, und die Reihenfolge ist der Fehler
  // aus Naht 115 in Reinform.** Vorher stand sie davor: sie meldete die Zahlen der Welt, die vor
  // dem Würfeln geladen war — also einer Welt, die niemand spielt. Eine Messung, die vor der
  // Entscheidung läuft, die sie beschreibt, ist eine Messung von gar nichts.
  try {
    const sr = terrain.stepReport(0, 0, 240, walk.params.autoJumpMax), v = sr.verteilung;
    // v16/L1b · **Der Seed steht in der Abnahmezeile**, und das ist die Lehre aus Naht 115: L1s
    // erste Abnahme galt einem festen Weltseed, L2a hat ihn gewürfelt, und die Zahlen beschrieben
    // danach eine Welt, die es nicht mehr gab. Eine Messung ohne ihren Seed ist nicht nachprüfbar.
    // Ebenso die Fläche: „480 u" ist ein ORT, die Schwellen gelten global (7–8 % Klippe).
    console.info('[stufung] Seed ' + sessionSeed + '  ·  480 u um (0,0)  ·  feine Stufe ' + sr.feineStufe
      + ' u (Zelle ' + sr.zelle + ')  ·  Hang ' + v.fein + ' % · Terrasse ' + v.mittel + ' % · Kiste '
      + v.grob + ' % · Klippe ' + v.klippe + ' %  ·  Sprung ⌀ ' + sr.mittlererSprung + ' u, max '
      + sr.maxSprung + ' u  ·  Wände: Klippe ' + sr.wandInKlippe + ' % gegen sonst ' + sr.wandSonst + ' %');
  } catch (e) { console.warn('[stufung] Messung fehlgeschlagen', e); }

  // ---------------------------------------------------------------- PIPELINE (S44)
  // Die Frame-Reihenfolge ist eine LISTE, kein Kommentar über einer Schleife. Die Schritte selbst
  // bleiben hier als Closures — sie ins Modul zu ziehen hätte 50 Abhängigkeiten durch ein
  // ctx-Objekt geschleift, also dieselbe Kopplung mit mehr Zeilen. Der Manager besitzt die
  // ORDNUNG, nicht die Arbeit.
  const F = { pos: null, speed: 0, bank: 0, pov: false };   // was mehrere Schritte teilen

  function stepFade(dt) {
    // Uhr und Frame-Werte gehören jetzt dem Manager bzw. `F` — hier bleibt nur das Ausblenden.
    F.pos = null; F.speed = 0; F.bank = 0; F.pov = false;
    // **v16/L2 · Die Farbwelt wird HIER gefragt**, weil dieser Schritt in JEDEM Modus läuft (siehe
    // Kommentar darunter). Sie im Flug-Schritt zu fragen hätte bedeutet: im Boden-Modus atmet die
    // Welt nicht und Regionsgrenzen fallen aus — ein Unterschied, den niemand ausgelöst hätte.
    {
      const cp = isWalk() ? walk.state.position : flight.state.position;
      const ev = colors.update(dt, cp.x, cp.z);
      if (ev) {
        if (ev.id !== paletteId) paletteId = ev.id;
        if (ev.kind === 'start') applyPalette(false);
        else {
          applyPalette(false, { cx: cp.x, cz: cp.z, dur: ev.dur, dist: ev.dist });
          if (ev.kind === 'region') note('Neue Farbwelt: ' + ev.id, 4);
          // v16/L2d · Die Front bringt eine Welle mit. **Nicht als Zierrat, sondern als
          // Ankündigung:** die Front läuft über 900 u in 9 s und ist deshalb kaum als Bewegung
          // zu sehen — die Welle sagt „JETZT", die Front trägt die Farbe. Ein Atemzug bekommt
          // eine schwächere (er ist ein Atemzug, kein Ereignis).
          if (rippleOn && rippleRegion) {
            const stark = ev.kind === 'region';
            terrain.spawnRipple(cp.x, cp.z, rippleColor(),
                                { life: stark ? 4.6 : 3.2, alpha: stark ? 0.95 : 0.55 });
          }
        }
      }
    }
    // **S56 · EINE Ankunfts-Regie, und sie läuft in JEDEM Modus.** Sie steht hier vorn, weil
    // alle vier Anteile aus ihrem Fortschritt kommen und der Rest des Frames sie liest.
    // Die Quellen sind der Pilot (Beats) und das Dock (Landung) — die Regie schreibt nichts
    // zurück, sie leitet nur ab.
    arrival.update(dt, {
      armed: dockOnArrive && academyOn,
      flying: auto.flying, braking: auto.braking, settling: auto.settling, docked: dock.owns,
      // S92 · Die Abflug-Phase des Docks als eigene Tatsache — der Deadlock-Bruch (Begründung in
      // `arrival.js` an `releasing`). `docked: dock.owns` allein war zirkulär: es ist in `leave` noch
      // true, und die Regie ist genau die, die `leave` beenden muss.
      leaving: dock.phase === 'leave',
      speed: flight.state.speed, dist: auto.dist, brakeStart: auto.brakeStart,
    });
    // Der Zoom ist ein Anteil der Regie, kein eigener Beat — aber die HAND behält ihn,
    // sobald die Regie nichts mehr will (`owns` gilt einen Frame länger, damit der letzte
    // Wert `zoomFar` noch ankommt und die Hand keinen fremden Startpunkt findet).
    if (arrival.owns && !isWalk()) camRig.setZoom(arrival.zoom, arrival.zoomRate);
    // S88 · Erst wenn die Regie ganz aus ist, darf die Karte wieder schweben (siehe `onUndock`).
    if (unpinAfter && !arrival.owns) { academy.pin(unpinAfter, false); unpinAfter = null; }
    arrival.sample(camRig.lastAimDeg);
    // S41 · Das Pet wird beim Zoom in den POV AUSGEBLENDET, nicht geschaltet. Ein Boolean an der
    // Schwelle 0,62 war der sichtbare Ruck (Georgs Befund) — jetzt trägt derselbe POV-Faktor,
    // der die Kamera mischt, auch die Deckkraft. `petFadeApply` kennt die Materialien EINMAL.
    // Pet und Flug-Karte gehen denselben Weg: der größere der beiden Verläufe gewinnt
    // (POV-Zoom von Hand oder Ankunfts-Regie), und beide sind stetig.
    const hide = arrival.hide;
    // EIN Eigentümer für `visible`: das macht `fadeApply` (Schwelle 0,988) — hier stand eine zweite,
    // fast gleiche Schwelle, also zwei Schreiber für dasselbe Flag. Was das Problem wirklich löst, ist
    // die Lage des Verdeckungs-Fensters (S83c in `arrival.js`), nicht ein zweiter Boolean.
    // **S89g · EIN Wurzelknoten für das Ausblenden, nicht zwei überlappende.** Georg, dreimal in
    // Folge: „erst verschwindet das Pet und dann die Karte." S89f hat beiden dieselbe ZAHL gegeben
    // und es war trotzdem noch da — weil es nicht die Zahl war: **das Pet hängt IM Rig** (`rig.seat`
    // ist sein Elternteil im Flug). Seine Materialien liefen also durch ZWEI `fadeApply`-Durchgänge
    // mit je eigenem Schnappschuss und je eigener Änderungsschwelle (`st.last`, 0,004). Zwei
    // Verwalter derselben Materialien treten sich unweigerlich auf die Füße: einer überspringt einen
    // Frame, der andere nicht — und wenn der Pet-Stack Teile nachbaut (`initParts`), sammelt der
    // zweite Durchgang eine bereits abgedunkelte Deckkraft als „Original" ein und blendet ab dann
    // früher aus. Genau das sah man.
    // Im Flug wird deshalb NUR das Rig ausgeblendet — es enthält das Pet, also gehen beide zwangsläufig
    // gemeinsam, nicht nur rechnerisch gleich. Am Boden sitzt das Pet in der Szene, dann gehört es ihm
    // selbst.
    // **S89i · Zwei DISJUNKTE Mengen, nicht eine gemeinsame Wurzel.** S89g hat den Doppel-Fade richtig
    // erkannt (das Pet hängt in `rig.seat`, alle 10 Pet-Materialien liegen auch in der Rig-Menge), aber
    // falsch gelöst: mit EINER Wurzel erbte der Teppich den POV-Fade des Pets — und beim Zoomen von
    // Hand bis `zoomMin` = 0 erreicht `camRig.petFade` die 1, also verschwand das ganze FAHRZEUG. In der
    // Ego-Perspektive auf einem fliegenden Teppich ist der Teppich unter dir das Fahrzeug; er darf nicht
    // weg. Das Pet dagegen soll weg — genau dafür ist `petFade` da.
    // Also: das Pet über `pet.object3D`, der Teppich über seine drei eigenen Meshes (`rig.padParts`,
    // ohne den Sitz). Kein Material liegt in beiden Mengen, also kann es keine zwei Verwalter mehr
    // geben — und während einer Ankunft lesen beide dieselbe Zahl (`hide`), verschwinden also gemeinsam.
    // **S89k · Die POV-Verdeckung des Pets gehört dem Kamera-Rig — immer, nicht nur von Hand.**
    // S89j hat das Ankunfts-FENSTER richtig gestrichen (Georgs Frage: warum blenden wir überhaupt aus),
    // dabei aber zu viel mitgenommen: die Ankunft übersprang auch `camRig.petFade`. Und der Kommentar
    // dazu war in sich unlogisch — er behauptete, im POV liege der Körper hinter der Kamera, verließ
    // sich für den Handbetrieb aber ausdrücklich auf genau diese Verdeckung. Gleiche Kamerageometrie,
    // zwei entgegengesetzte Schlüsse; einer davon musste falsch sein.
    // Gerechnet aus dem Rig (`povFar` 3,6 / `povNear` 1,0): `petFade` ist bei 2,03 u noch 0, bei 1,44 u
    // fertig, und an der Endposition der Ankunft (0,75 u) verlangt das Rig **volle** Verdeckung — die
    // Kamera steht dort ~0,3 u von der Oberfläche des Pets (BBox 0,94 u hoch). Genau der Zustand, den
    // Georg als „Artefakt zwischen den Ohren" gemeldet hat.
    // Jetzt gilt EIN Weg für beide Fälle. Georgs Befund kommt dadurch nicht zurück: beim Stillstand
    // (a = 0,84) steht der Zoom noch bei 2,94 u, dort ist `petFade` = 0 — das Pet ist also sichtbar,
    // solange es ankommt, und verschwindet erst, während die Kamera in es eintaucht. Der Teppich
    // liest weiter nur `hide` (= 0) und bleibt sichtbar: er ist das Fahrzeug.
    // **S89l · Im Dock verlässt die Kamera das Fahrzeug — dann muss es aus dem Bild.** Diese
    // Anforderung stand schon als Kommentar an der Dock-Behandlung („das Fahrzeug kreist unsichtbar
    // weiter, also muss es aus dem Bild"), erfüllt wurde sie aber vom Anflug-Fenster mit. Mit
    // `hideOn: false` (S89j) fiel sie mit dem Fenster weg, und S89k hat nur das PET wieder versorgt.
    // Nachgemessen an der rekonstruierten Endlage: die Dock-Kamera steht **2,19 u** vor dem Fahrzeug
    // und schaut auf die 8 u entfernte Karte — der Teppich lag damit voll deckend über der oberen
    // Bildhälfte des Lesebilds, und `camRig.petFade` ist bei 2,19 u **0**, also war auch das Pet dort
    // sichtbar. In der Detailansicht sitzt die Kamera eben NICHT am Auge des Pets; die POV-Begründung
    // aus S89j trägt diesen Fall nicht.
    // `arrival.dockK` ist der richtige Auslöser, weil er genau das bedeutet: die Kamera hat das
    // Fahrzeug verlassen. Sein Fenster ist [0,94 · 1,00] — also greift er erst, NACHDEM das Pad vor der
    // Karte gehalten hat (Stillstand bei a = 0,84). Georgs „verschwindet, bevor ich angekommen bin"
    // kommt dadurch nicht zurück.
    const away = Math.max(arrival.dockK, dock.progress || 0);
    // **S89m · EIN benanntes Signal, alle Verbraucher lesen es.** Das ist die Wurzel der letzten drei
    // Runden: `arrival.hide` war das gemeinsame Signal „das Fahrzeug ist aus dem Bild" für DREI
    // Verbraucher — Pet, Teppich und Kondensstreifen. S89j hat das Signal abgeschaltet (`hideOn: false`)
    // und danach wurden die Verbraucher EINZELN nachgezogen: S89k das Pet, S89l den Teppich, und die
    // Streifen blieben übrig (`trails.setActive(arrival.hide < 0.5)` war damit immer wahr — Bänder ohne
    // Fahrzeug direkt vor dem Lesebild, genau was der Kommentar dort ausschließen soll).
    // Ein Signal abschalten und seine Verbraucher einzeln nachpflegen ist eine Fehlerquelle pro
    // Verbraucher. Also gibt es das Signal wieder — als EINE Zahl mit Namen, aus der neuen Quelle.
    // Wer „Fahrzeug weg?" wissen will, liest `vehicleOut`; eine zweite Herleitung gibt es nicht.
    // **S93 · Das Fahrzeug hat einen SITZ im Lesebild — also gibt es nichts zu verstecken.**
    // `away` (S89l) war die Antwort auf ein Bild, das es nicht mehr gibt: die Dock-Kamera stand
    // 2,19 u hinter dem Fahrzeug, der Teppich lag deckend über der oberen Bildhälfte. Das kam vom
    // RÜCKWEG des letzten Beats (zwei Endzustände, siehe `arrival.zoomNear`). Mit einem Endzustand
    // steht die Kamera `seatDepth` (4,2 u) hinter dem Sitz und das Fahrzeug unten links im Bild —
    // dort, wo Georgs Regie es haben will. Es wegzublenden wäre jetzt der Fehler.
    // Rückweg: `vehicleHide` auf true, dann gilt wieder S89l/S89m.
    vehicleOut = vehicleHide ? Math.max(hide, away) : hide;
    const petHide = Math.max(camRig.petFade, vehicleOut);
    petOut = petHide;   // S89o · für `stepFly` (Kontaktschatten) — eine Quelle, kein Nachrechnen
    if (pet) fadeApply(pet.object3D, petHide);
    // S89n · Das Fahrzeug = die WURZEL minus Pet, nicht eine Liste. Deckt Teppich, Kontaktschatten und
    // alles, was dort künftig eingehängt wird; disjunkt zum Pet, also kein Material mit zwei Verwaltern.
    if (!isWalk() && rig.group) fadeApply(rig.group, vehicleOut, pet ? pet.object3D : null);

  }

  function stepFly(dt) {
      // 1) input → 2) vehicle (ground height at the current pet/vehicle world x,z)
      // S22d: läuft der Auto-Pilot, kommt die Eingabe von ihm — dieselben vier Werte,
      // derselbe Controller. Fällt er aus, greift sofort wieder die Hand.
      const apIn = auto.active ? auto.update(dt) : null;
      const input = apIn || readInput(dt);
      // **v15/F1 · Der Drift gehört der HAND, nicht der Regie.** Der Controller lässt die
      // Fahrtrichtung hinter dem Facing zurückbleiben (tinyskies `Carpet.ts` §Drift). Ein Regler,
      // der auf eine Karte zusteuert, rechnet aber mit dem Facing — er würde um seinen eigenen
      // Rutschwinkel pendeln und den Anflug in eine Schlangenlinie verwandeln. Also: solange eine
      // Regie fährt (Autopilot, Ankunft, Detailansicht), haftet das Pad vollständig.
      // Das ist dieselbe Trennung wie beim Tempo-Boden (`hold`) — die Regie bekommt ein
      // vorhersagbares Fahrzeug, die Hand bekommt das lebendige.
      input.noDrift = auto.active || arrival.owns || dock.owns;
      // S83 · **Ab dem Ausrichten dreht das Fahrzeug nicht mehr.** Georgs Befund „das Pet dreht sich
      // sichtbar zur Seite weg" war NICHT das Facing (gemessen: lokale Gier-Spanne 0,0°) — es war die
      // KARTE: der Pilot lenkte weiter, und die Weltgier des Pets lief über 357°, die Rig-Gier über 179°.
      // Der Beat heißt „ausrichten, das Pet steht" — dann muss auch die Lenkung stehen.
      // **Als Faktor, nicht als Schalter** (S83b): ein harter Schnitt lässt die Lenkung beim Lösen
      // zurückschnappen — genau das war Georgs „glitcht nach rechts weg". Also fährt sie mit demselben
      // Fortschritt aus und wieder ein.
      if (apIn) {
        const g = arrival.params.seg, lo = g[1].to, hi = g[2].to;
        const frei = 1 - Math.max(0, Math.min(1, (arrival.a - lo) / Math.max(1e-4, hi - lo)));
        input.yawIn = (input.yawIn || 0) * frei;
        input.pivot = (input.pivot || 0) * frei;
      }
      // **S89 · Das Pad BLEIBT STEHEN, sobald es vor der Karte ist — und bleibt es auch.**
      // Georgs Regie: „in dem Moment, wo das Pad vor der Karte ist, bleibt es einfach stehen, ganz
      // normal, als wenn ich davor navigiert hätte." Bisher tat es das NICHT: gemessen flog es die
      // ganze Detailansicht über mit **3,6 u/s** weiter (der Grundschub), nach 27 s war es **82 u**
      // an der Karte vorbei, und dann löste die Selbstheilung („zu weit weg", Grenze 82,8 u) das
      // Dock von selbst. Das war zugleich sein „Pad verschwindet unter oder hinter ihr" (es flog
      // wörtlich darunter hindurch und weiter) UND sein „Abflug startet ohne Eingabe".
      //
      // Der Halt hängt an der REGIE, nicht am Piloten — das war der erste Anlauf und er reichte
      // nicht: er stand im `apIn`-Zweig, also verschwand er in dem Moment, in dem der Autopilot
      // fertig war (gemessen: v 0,09 → 0,33 → 1,06 → 1,96 → 3,6 innerhalb einer Sekunde nach der
      // Übergabe). Jetzt gilt er, solange die Ankunft läuft, für BEIDE Eingabewege.
      //
      // `releasing` nimmt ihn sofort ganz zurück: wer wegfliegen will, gewinnt im selben Frame —
      // die Kamera federt danach in Ruhe zurück, aber die Hand ist frei.
      // **S92b · Dasselbe gilt beim Umlenken** (`reordering`): dort übergibt die Regie gerade von einem
      // Auftrag an den nächsten. Sie besitzt die Kamera noch, aber nicht mehr das Fahrzeug — sonst steht
      // das Pad noch die Fahrzeit der Übergabe still, und das war die Hälfte von „ich fliege nicht weiter".
      if (arrival.owns && !arrival.releasing && !arrival.reordering) {
        const g = arrival.params.seg, lo = g[1].to, hi = g[2].to;
        const frei = 1 - Math.max(0, Math.min(1, (arrival.a - lo) / Math.max(1e-4, hi - lo)));
        input.thrust = (input.thrust || 0) * frei;
        input.climbIn = (input.climbIn || 0) * frei;
        input.brake = Math.max(input.brake || 0, 1 - frei);
        // Und der Tempo-Boden (`SPD_MIN` = 2 u/s) fällt mit: ohne das bremst man gegen einen Sockel.
        input.hold = 1 - frei;
        rig.setCalm(1 - frei);   // der Teppich hört auf zu wellen — „steht einfach da"
      } else if (rig.calm) {
        rig.setCalm(Math.max(0, rig.calm - dt * 1.6));   // Welle kommt weich zurück, nicht mit einem Schlag
      }
      const st0 = flight.state;
      // Ruhezone unter der Karte, bevor die Physik rechnet: näher am Boden = ruhigere Cubes.
      const gTop = safeGroundAt(st0.position.x, st0.position.z, 1.4);
      const agl = st0.position.y - gTop;
      const wantCalm = groundCalm * (1 - Math.max(0, Math.min(1, (agl - CALM_LO) / (CALM_HI - CALM_LO))));
      calmAmt += (wantCalm - calmAmt) * Math.min(1, dt * 3);
      aglNow = agl;   // S21: Bodennähe färbt den Fahrtwind (Rumpeln + dunklerer Bandpass)
      terrain.setCalm(st0.position.x, st0.position.z, 22, calmAmt);
      flight.update(dt, input, cardClearance(st0, dt));
      const st = flight.state; F.pos = st.position; F.speed = st.speed;
      // S56 · Die Anflug-Regie steht nicht mehr hier. Der Zoom war eine von vier Bewegungen mit
      // eigener Uhr (`slow = 1 − v/v₀` → `setZoom`), und sie kannte weder das Dock noch das
      // Facing noch die Verdeckung. Jetzt ist sie ein FENSTER auf dem Fortschritt der Regie
      // (`arrival.zoom`, gesetzt in `stepFade`) — der Schwung bleibt die Kurve, aber es ist
      // derselbe Schwung wie für alle anderen Anteile.
      // S10: Landung. Der Flight-Controller entscheidet (Bodenkontakt + kleine Sinkrate +
      // Sinkwille, gehalten), der Runner führt nur aus — und erst nach der Sperrzeit.
      // **Nicht während eines Anflugs oder in der Detailansicht:** ein Auto-Pilot, der eine
      // tief hängende Karte über steigendem Terrain anfliegt, streift den Boden — und landete
      // dann mitten im Anflug im Walk-Modus vor einem Cube (Georgs Befund). Der Modus folgt der
      // Höhe nur, solange die HAND fliegt.
      // Der Antrag steht hier ohne jede Bedingung: die Höhe SCHLÄGT VOR, der Eigentümer
      // entscheidet. Alles, was früher in dieser Zeile stand, ist jetzt eine benannte Regel.
      modeOwner.tick(dt);
      if (st.landed && modeOwner.request('walk', 'altitude').ok) return false;   // Frame endet hier
      heat.update(dt, { mode: 'fly', speed: st.speed, boosting: st.boosting });
      // S2: der Boost-Impuls — schneller Einsatz (9/s), langsames Auslaufen (2,2/s).
      // Er addiert auf die heat-Kopplung: die Welt weitet sich beim Drücken, nicht erst,
      // wenn das Tempo angekommen ist.
      const bp = st.boosting ? 1 : 0;
      if (bp && boostPulse < 0.2) audio.sfx('boost');   // Einsatz, nicht Dauerton
      boostPulse += (bp - boostPulse) * Math.min(1, dt * (bp ? 9 : 2.2));
      const h = heat.value;
      F.bank = st.bank;
      // 3) **S41 · Kamera.** Der Runner rechnet hier nichts mehr: das Dock liefert seinen
      // Beitrag (Ziel + Gewicht), das Rig mischt Follow, POV und Dock und schreibt EINMAL.
      // Die Reihenfolge ist der Punkt — vorher lief das Dock NACH der Kamera und überschrieb
      // das Blickziel hart, während die Position gemischt wurde.
      dock.setK(arrival.dockK);   // S56: das Dock rechnet die Ansicht, die Regie sagt WANN
      // S93 · Das Lesebild braucht den Platz des Fahrzeugs — es hat darin einen Sitz.
      dock.update(dt, view(), flight.state.position);
      camRig.updateFly(dt, st, { heat: h, boostPulse, dock: dock.mix });
      F.pov = camRig.pov;
      // S32c · NACH dem Kamera-Block: das Dock mischt die ideale Karten-Ansicht ein.
      // Distanz kommt jeden Frame aus FOV und Seitenverhältnis — damit sitzt die Karte
      // beim Fenster-Resize von selbst richtig, ohne Resize-Handler.
      if (dock.owns) {
        // Selbstheilung: eine gedockte Kamera auf einer Karte, deren Demo gar nicht mehr laufen
        // kann (zu weit weg), behauptet etwas Falsches. Also löst sich das Dock selbst.
        if (dock.card && dock.card.holder.position.distanceTo(st.position) > academy.params.focusDist * 1.8) {
          dock.release(); note('Zu weit weg — Detailansicht gelöst.', 3);
        }
        // Die Pet-Karte flog durch das Bild: in der Detailansicht sitzt die Kamera vor der
        // Lektionskarte, das Fahrzeug kreist unsichtbar weiter — also muss es aus dem Bild.
        // Erst wenn das Dock deutlich übernommen hat, verschwindet die Flug-Karte. Bei 0,25 war
        // das Pet weg, während die Kamera noch unterwegs war — „das Pet verschwindet vor mir".
        F.pov = true;
      }
      // 4) pet on the card → 5) CardRig transform+clip, then pet-kinetics reacts
      if (pet && pet.update) pet.update(dt);
      if (pet) petKin.update(pet, st, dt);
      // Facing zuletzt: im Stand schaut das Pet zu dir, mit Tempo in die Fahrtrichtung.
      if (pet && pet.object3D.visible) {
        petFace.update(dt, { pet, camera, arrive: arrival.face, owns: arrival.owns,
          cursorIdle: (performance.now() - cursorAt) / 1000,
          speed01: Math.min(1, st.speed / Math.max(1, flight.params.SPD_MAX)) });
        // **S94a · NACH dem Gesicht, nicht davor — sonst rechnet der Blick mit der falschen Pose.**
        // Gemessen im Aufruf: davor stand die Gier noch auf `base` (Fahrtrichtung, Pet zeigt WEG), die
        // Modell-Rechts-Achse lag also bei ndc −1 — obwohl das Pet im Bild uns ansieht. Der Blick bekam
        // damit systematisch das Gegenvorzeichen: Georgs „falsche Richtung". Die Kinetik schreibt die
        // Drehung jeden Frame neu, also ist die einzige verlässliche Pose die FERTIGE. Der Kosten:
        // `PetFace` liest den Wert einen Frame später (16 ms) — unsichtbar, und `pet.update` lief
        // sowieso schon vorher, der „im selben Frame"-Grund von S93f war also ohnehin keiner.
        refreshCursorGaze();
      }
      // Der Barrel-Roll-Winkel entsteht in der Pet-Kinetik, gehört aber der KARTE:
      // rig.sync rollt Karte + Sitz gemeinsam, also dreht das Pet um die Karten-Mitte.
      rig.setBarrelRoll(petKin.barrelRoll.angle);
      // Die Rolle wird hörbar: ein Swish, der über die Stereobreite wandert (S21)
      const rollNow = petKin.barrelRoll.active;
      if (rollNow && !rollWasActive) audio.sfx('roll', 0.9);
      rollWasActive = rollNow;
      rig.sync(st, dt, pet && pet.character);
      // Streifen NACH rig.sync: die Anker sitzen in der Weltmatrix von rig.lean, also
      // tragen sie Bank, Kippung, Kantencurl und Barrel-Roll ohne eigene Kinematik.
      trails.setActive(vehicleOut < 0.5);   // S89m · derselbe Eigentümer wie Pet und Teppich
      trails.update(dt, rig.lean, camera, { kmh: heat.kmh });
      // S15 · Schatten: der Terrain-Shader projiziert den Werfer entlang des Lichtstrahls auf
      // die Fläche, die wirklich da ist — kein Quad, also kein Schweben an Kanten und kein
      // Flackern bei tanzenden Cubes. Werfer im Flug = die Karte.
      terrain.setCasterGain(shadowGain);
      terrain.setCasters({ x: st.position.x, y: st.position.y, z: st.position.z, r: 1.9 }, null);
      if (pet) {
        const po = pet.object3D.position, ph = Math.max(0, po.y);
        const ps = 0.62 * (1 + ph * 0.55);
        // **S89n · Der Schatten liest das Signal an seiner QUELLE.** Er ist der vierte Verbraucher, den
        // die Aufzählung in S89m übersehen hat — und der einzige, dem `fadeApply` gar nicht helfen kann:
        // `place()` schreibt seine Deckkraft jeden Frame selbst, also gewinnt sie gegen jeden Fade.
        // Wirkung vorher: in der Detailansicht blieb ein dunkler Fleck stehen, wo das Fahrzeug war, und
        // beim Zoomen ins POV ein Fleck ohne Pet. Er gehört dem PET (nicht dem Teppich), also liest er
        // `petHide` — damit deckt er Handbetrieb und Ankunft mit derselben Zahl ab.
        petShadow.place(rig.seat.position.x + po.x, 0.085, rig.seat.position.z + po.z,
          ps, ps * 0.92, 0, shadowGain * 0.5 * Math.max(0, 1 - ph * 0.6) * (1 - petOut));
      } else petShadow.hide();
  }

  function stepWalk(dt) {
      // WALK: same control scheme as flight — W/S move, A/D turn, Q/E strafe, Shift sprint
      const iy = (keys.has('KeyW') ? 1 : 0) - (keys.has('KeyS') ? 1 : 0);
      const ix = (keys.has('KeyE') ? 1 : 0) - (keys.has('KeyQ') ? 1 : 0);
      walk.setInput(ix, iy);
      const turn = (keys.has('KeyA') ? 1 : 0) - (keys.has('KeyD') ? 1 : 0);
      walk.update(dt, { turn, sprint: keys.has('ShiftLeft') || keys.has('ShiftRight') }, groundHeightAt);
      const ws = walk.state; F.pos = ws.position; F.speed = ws.moving ? 6 : 0;
      aglNow = Math.max(0, ws.position.y - groundHeightAt(ws.position.x, ws.position.z));
      // Rettung: steckt das Pet trotz allem in einer Säule (hüpfender Cube, harter Modus-Wechsel),
      // heben wir es auf die höchste Oberfläche im Körperumkreis — nie stumm darin stehen lassen.
      const safeY = safeGroundAt(ws.position.x, ws.position.z, 0.62);
      // S79e: der Rückweg ist ein Steigen, kein Schnitt — `floatTo` trägt das Pet mit begrenzter
      // Rate nach oben (früher: `lift`, ein Teleport, und genau das sah man als harten Sprung).
      if (ws.position.y < safeY - 0.06) walk.floatTo(safeY);
      heat.update(dt, { mode: 'walk', speed: ws.speed, sprinting: ws.sprinting, airborne: !ws.onGround });
      boostPulse += (0 - boostPulse) * Math.min(1, dt * 2.2);   // kein Boost am Boden
      if (trails.active) trails.setActive(false);                // keine Karte, keine Streifen
      // Am Boden wirft das PET — Körpermitte als Werfer, damit der Schatten am Fuß ansetzt
      // und nicht als runder Fleck daneben liegt.
      terrain.setCasterGain(shadowGain);
      terrain.setCasters({ x: ws.position.x, y: ws.position.y + 0.85, z: ws.position.z, r: 0.95 }, null);
      petShadow.hide();
      const h = heat.value;
      F.bank = ws.turnRate * 0.22;
      // cubes hold still around the walker so they can't swallow or punch through the pet
      terrain.setCalm(ws.position.x, ws.position.z, 26, 1);
      // third-person orbit cam — Zoom bis 0 = POV. **S41:** derselbe Rig, dieselbe eine
      // Schreibstelle; der Orbit-Zustand (Abstand, Pitch, Yaw-Offset) bleibt beim Walk-Controller.
      dock.setK(arrival.dockK);
      // Am Boden gibt es kein Fahrzeug — dann rahmt das Dock wie vor S93 nur die Karte.
      dock.update(dt, view(), null);
      camRig.updateWalk(dt, ws, { heat: h, eyeUp: walk.eyeUp, recenter: (d) => walk.recenterView(d), dock: dock.mix });
      F.pov = camRig.pov;
      // pet walks on the ground: walk cycle, lean, jump/land squash, facing
      // ORDER IS CANON: motor first (mixer/face/rig), our kinetics last so the
      // lean + world position win over PetMotion's rotation.z damping.
      if (pet) {
        if (pet.update) pet.update(dt);
        petKin.updateWalk(pet, ws, dt);
      }
      // S21 · Schritte, Sprung, Landung als Hörereignisse. Die Schrittzählung kommt aus der
      // Pet-Kinetik (dort läuft der Gehzyklus) — sonst sitzen die Tritte auf einem zweiten Takt.
      if (!ws.onGround && wasGrounded) audio.sfx('jump', 0.9);
      if (ws.onGround && !wasGrounded) {
        audio.sfx('land', Math.min(1.4, 0.5 + (ws.impact || 0) * 0.05));
        // v16/L2d · **Aufsetzen ist der beste Wellen-Anlaß, den das Spiel hat:** der Ort ist
        // eindeutig, der Zeitpunkt ist eindeutig, und der Spieler hat ihn selbst gemacht. Die
        // Wucht bestimmt die Größe (`impact`), damit ein Schritt von einer Kiste nicht dasselbe
        // ist wie ein Sturz von einer Klippe (6 u, seit L1). Ton und Bild teilen denselben Anlaß
        // — in derselben Zeile, damit sie nicht auseinanderlaufen können.
        if (rippleOn && rippleTouch) {
          const w = Math.min(1, (ws.impact || 0) / 26);
          terrain.spawnRipple(ws.position.x, ws.position.z, rippleColor(),
                              { life: 1.5 + w * 2.4, alpha: 0.5 + w * 0.45 });
        }
      }
      wasGrounded = ws.onGround;
      if (petKin.stepCount !== lastStep) {
        lastStep = petKin.stepCount;
        if (ws.onGround) audio.sfx('step', ws.sprinting ? 1.1 : 0.8);
      }
  }

  function stepWorld(dt) {
    // S60 · Die Würfel wandern mit dem Spieler und drehen immer — vor jeder Verzweigung, weil sie
    // zu beiden Betriebsarten gehören.
    dice.setCenter(F.pos.x, F.pos.y, F.pos.z);
    dice.update(dt, camera);
    // shared: terrain streaming (only on chunk crossing) + colour/beat + sky + sun
    const cx = Math.round(F.pos.x / terrain.CHUNK), cz = Math.round(F.pos.z / terrain.CHUNK);
    if (cx !== lastChunkX || cz !== lastChunkZ) {
      terrain.recenter(F.pos.x, F.pos.z); lastChunkX = cx; lastChunkZ = cz;
      // v16/L3 · Die Props folgen dem Terrain im SELBEN Schritt. Getrennt gerufen wären sie einen
      // Frame lang an den alten Orten — sichtbar als Wald, der hinter dem Gelände hertrudelt.
      if (props.ready) props.rebuild(terrain, wc && wc.biome);
    }
    props.update(dt);
    synthPhase += dt * (bpm / 60);
    if (synthPhase >= 1) { synthPhase -= 1; synthBeat = 1; }
    synthBeat *= Math.exp(-dt * 5.5);
    // S20: EIN Takt-Ausgang. Läuft Ton, kommt die Eins aus dem Track (plus dessen Bassband);
    // ohne Ton bleibt der synthetische Takt — kein zweites System, nur eine andere Quelle.
    audio.update(dt, { heat: heat.value, rate: heat.rate, mode: curMode(), agl: aglNow, camera });
    // S70 · Reflexe des Erzählers auf DENSELBEN Größen, die auch Klang und Bild treiben: Tempo,
    // Bodenabstand, Drehrate. Keine eigene Uhr — wer eine zweite Uhr aufzieht, hat zwei Wahrheiten.
    // S73 · Der Rückweg der Lesezeit: auf einer Reise löst die Detailansicht sich selbst, sonst stünde
    // die Route für immer (der Halt in `holdWhile` wäre ohne diesen Timer eine Falle).
    if (routeDocked) {
      if (!dock.owns) routeDocked = false;
      else if ((routeDockT -= dt) <= 0) { routeDocked = false; dock.release(); }
    }
    narrator.update(dt, { v: heat.value, agl: aglNow, turn: flight.state.bank || 0, warp: !!flight.state.warp });
    // S73 · Drei Beats pro Karte, an der ENTFERNUNG (Ki weit · Shō mittel · Ten nah). Die Zahl kommt
    // aus dem Autopiloten, der sie ohnehin misst — keine zweite Rechnung, keine zweite Wahrheit.
    if (auto.active && auto.target) narrator.approach(auto.target, auto.status.dist);
    // S22: Karten wandern mit der Welt mit und weichen nach vorn, wenn man sie hinter sich lässt
    if (!academyOn) {
      skyCards.setCenter(F.pos.x, F.pos.z);
      skyCards.setForward(!isWalk() ? flight.state.forward.x : Math.sin(walk.state.facing || 0),
                          !isWalk() ? flight.state.forward.z : Math.cos(walk.state.facing || 0));
      skyCards.update(dt, camera, F.pos);
      // Artwork gepaced: ein PDF-Render alle 2,5 s, nur wenn das Bild flott läuft (dt < 40 ms) und
      // die Welt steht. Ein Seitenrender kostet Hunderte Millisekunden auf demselben Thread —
      // ungepaced kostet er die Bildrate.
      if (artOn && (artT += dt) > 2.5 && dt < 0.04) { artT = 0; skyCards.pumpArt(F.pos, 520); }
      skyCards.recycle(F.pos);
    } else {
      // S31 · Die Akademie. Blätter werden gepacet gemalt (zwei pro Auftrag, nächstgelegen
      // zuerst, nur bei flottem Bild) — dieselbe Regel wie der Artwork-Pacer.
      // Die Welt hält still, solange ein Anflug läuft oder die Detailansicht steht — sonst
      // flieht das Ziel mit der eigenen Bewegung mit.
      academy.setFollowEnabled(!auto.active && !dock.owns);
      academy.update(dt, camera, F.pos);
      if (glyphsOn) glyphs.update(dt);
      if (titleOn) cardTitle.update(dt);
      if (noteField.isOpen()) noteField.follow(camera, renderer);
      if ((sheetT += dt) > 0.35 && dt < 0.04) { sheetT = 0; if (!academy.pumpSheets(F.pos, 2)) academy.pumpPreviews(F.pos); }
      // S71 · Kartenbilder der Deck-Zonen, langsamer getaktet als die Blätter: ein PDF-Rendern ist
      // teuer, und der Flug darf davon nichts merken.
      if ((deckArtT += dt) > 1.2 && dt < 0.04) { deckArtT = 0; pumpDeckArt(F.pos); }
      // Live-Wunsch mit Hysterese: eine laufende Demo darf nicht sterben, weil man einen
      // Meter zu weit driftet — sonst startet und stirbt sie beim Vorbeiflug dreimal.
      const keep = shownLive && shownLive.holder.position.distanceTo(F.pos) < academy.params.focusDist * 1.8;
      const wantCard = academy.focused || (keep ? shownLive : null);
      if (live.enabled && wantCard && live.canRun(wantCard.data.example)) live.want(wantCard);
      else if (!keep) live.want(null);
    }
    // Gate ist „Uhr läuft", nicht „Graph gebaut": sonst ist der synthetische Takt ab dem ersten
    // Ton-Einschalten dauerhaft weg, auch wenn der Context suspendiert oder stumm ist.
    const rawBeat = (audio.running ? Math.max(audio.beat, audio.pulse) : synthBeat) * beatGain;
    beatNow = rawBeat;   // S60c: die Würfel im Himmel hängen am SELBEN Takt — kein zweiter Ausgang
    const rawEnergy = 0.28 + heat.value * 0.4;
    const chanB = (m) => (m === 'beat' || m === 'both' ? rawBeat : 0);
    // 'steady' ist die Stellung für den reinen Flow: eine KONSTANTE Amplitude, die weder am
    // Takt noch am Reisetempo hängt — das Boden-Animationsmuster für sich, wie in der
    // three.js-Demo. Ohne diese Stellung war Flow ohne Musik nicht einstellbar (Georgs Notiz).
    const chanE = (m) => (m === 'steady' ? 0.55 : (m === 'speed' || m === 'both' ? rawEnergy : 0));
    const drive = {
      beat: chanB(danceMode), energy: chanE(danceMode),
      glowBeat: chanB(blinkMode), glowEnergy: chanE(blinkMode), glowGain: blinkGain,
    };
    terrain.update(dt, drive);
    sky.follow(camera);
    sky.update(dt, { beat: rawBeat, energy: rawEnergy });   // der Himmel hört weiter den ganzen Takt
    sun.position.copy(F.pos).add(_sunOff); sun.target.position.copy(F.pos);
    lighting.follow(F.pos);

    // S31 · Der RTT-Pass läuft VOR dem Post-Pass. Sobald die Szene in einen Puffer geht,
    // ist es zu spät, in einen anderen zu zeichnen — und `renderer.info` wäre danach der
    // Bildschirm-Quad, nicht die Lektion.
    if (academyOn) {
      live.render(dt);
      if (live.card !== shownLive) {
        if (shownLive) academy.clearLive(shownLive);
        shownLive = live.card;
        if (shownLive) academy.setLive(shownLive, live.texture);
      }
    }
    if ((stripT += dt) > 0.2) { updateStrip(stripT); stripT = 0; }

  }

  function stepRender(dt) {
    // S2 · REIHENFOLGE: Szene → Radial-Blur → Speedlines → Würfel.
    // Der Blur ist quadratisch an `heat` gekoppelt (Reisetempo bleibt scharf) plus
    // einem Anteil aus dem Boost-Impuls; bei 0 rendert `post` direkt auf den Schirm.
    const hi = Math.max(0, (heat.value - 0.30) / 0.70);
    post.setStrength(fxBlur * (hi * hi * 0.075 + boostPulse * 0.035) + jst.swirl, dt);
    post.render(scene, camera);
    // S74 · **Fahrtwind-Striche laufen nicht über ein Blatt, das man liest.** In der Detailansicht lagen
    // sie im Vordergrund über der Karte (Georgs Screenshot: dünne weiße Linien quer über die Zeichnung).
    // Der Fahrtwind gehört zur Fahrt; in der Detailansicht fährt niemand.
    // S77 · Der Sprung liest die Restdistanz des Piloten (keine zweite Rechnung) und gibt vier Zahlen
    // zurück. Ist er aus, sind alle vier neutral — dann verhält sich alles wie vor S77.
    jst = jump.update(dt, { dist: jumpOn ? auto.status.dist : 0, flying: auto.active && !isWalk(), docked: dock.owns });
    if (!jump.active) {
      // Ruht der Sprung, gehört die Zahl dem Regler. Einmal zurückgeben, dann nicht mehr anfassen.
      if (spdHeld) { flight.setParams({ SPD_MAX: spdBase }); spdHeld = false; }
      spdBase = flight.params.SPD_MAX;
    } else if (jumpOn) {
      flight.setParams({ SPD_MAX: spdBase * jst.speedFactor });
      spdHeld = true;
    }
    veil.style.opacity = String(jst.veil.toFixed(3));
    lines.update(dt, { heat: dock.owns ? 0 : Math.min(1, heat.value * jst.streak), rate: heat.rate, pulse: dock.owns ? 0 : boostPulse });
    if (!dock.owns) lines.render(renderer);
    // S7: HUD-Würfel als LETZTER Pass in einem Scissor-Viewport — nie verdeckt, nie geblurrt
    const warpNow = !isWalk() ? (flight.state.warp || 0) : 0;
    hud.update(dt, { kmh: heat.kmh, heat: heat.value, rate: heat.rate, bank: F.bank,
                     mode: warpNow > 0.35 ? 'WARP' : (F.pov ? 'POV' : '') });
    hud.render(renderer);
  }

  const mgr = createTravelManager({
    renderer,
    steps: [
      ['attach', (dt) => keepAttached(dt)],
      ['fade', stepFade],
      // Ein Schritt, zwei Modi — der Eigentümer sagt, welcher gilt. Die Kamera steckt noch im
      // Fahrzeug-Schritt: sie zu lösen heißt, `st`/`h` als Frame-Werte zu führen — eigener Slice.
      ['vehicle', (dt) => (isWalk() ? stepWalk(dt) : stepFly(dt))],
      ['world', stepWorld],
      ['render', stepRender],
    ],
  });
  mgr.start();
}
