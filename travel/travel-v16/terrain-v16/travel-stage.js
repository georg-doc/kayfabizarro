// ============================================================================
// travel-stage.js — KFB Travel · Slice S44d (V9-C, Teil 4) · Bühne & Welt
// ----------------------------------------------------------------------------
// Renderer, Szene, Kamera, Licht, Nebel, Himmel, Voxel-Terrain — und die zwei
// Gelände-Sonden, die die Kamera aus den Säulen halten (`pullIn`, `escapeTerrain`).
// Das ist Aufbau, keine Verdrahtung: es passiert einmal und ändert sich nie.
//
// **Was hier NICHT hingehört:** Fahrzeug, Pet, Karten, HUD, Panel. Die baut der
// Runner, weil er sie verbindet. Die Grenze ist: was der Renderer zum Zeichnen
// braucht (Bühne) gegen was die Reise ausmacht (Systeme).
//
// Der WorldContext wird hier ERZEUGT, aber nicht besessen: `applyWorld` im Runner
// baut ihn beim Story-Wechsel neu. Deshalb gibt die Bühne ihn zurück, statt ihn
// zu behalten — ein Rückgabewert, kein Zustand.
//
//   const st = createTravelStage({ THREE, stage, makeWorldContext, createSkydome,
//                                 createVoxelTerrain });
//   st.renderer · st.scene · st.camera · st.sun · st.sky · st.terrain
//   st.groundHeightAt · st.pullIn · st.escapeTerrain · st.wc · st.pal · st.fogCol
// ============================================================================

export function createTravelStage(o) {
  const THREE = o.THREE, stage = o.stage;
  const makeWorldContext = o.makeWorldContext, createSkydome = o.createSkydome,
        createVoxelTerrain = o.createVoxelTerrain;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.localClippingEnabled = true;   // for the card-carrier feet clip plane
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, stage.clientWidth / stage.clientHeight, 0.3, 5000);

// --- WORLD (slice 3): deterministic v3 world from a fixed seed + one story mode.
// Card-driven terrain (CardTriplet → setWorldContext) is a later slice; the hook is already here.
const WORLD_SEED = 'kfb-travel-v4-slice3';
const STORY = 'heroic';
let worldSeed = WORLD_SEED, story = STORY;
let wc = makeWorldContext({ storyMode: STORY, seeds: [WORLD_SEED] });
let pal = wc.palette;
const fogCol = new THREE.Color(pal[0][0] * 0.6 + 0.02, pal[0][1] * 0.6 + 0.03, pal[0][2] * 0.6 + 0.05);
scene.background = fogCol.clone();
scene.fog = new THREE.Fog(fogCol.getHex(), 90, 520);

// --- lights: warm sun (shadow) + cool hemi so the pet reads from all sides ---
const sun = new THREE.DirectionalLight(0xfff2e0, 2.6); sun.position.set(30, 60, 20); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.near = 1; sun.shadow.camera.far = 200;
sun.shadow.camera.left = -40; sun.shadow.camera.right = 40; sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.6;
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xe6f0ff, 0x6a6250, 1.0));

// --- skydome (v3), coupled to the same story mode/palette ---
const sky = createSkydome({ THREE, mode: wc.storyModeIndex, variant: 'S', worldMix: 0.4 });
sky.setPalette(pal);
scene.add(sky.group);

// --- voxel terrain (v3), replacing the flat ground. groundHeightAt drives the flight clamp. ---
const terrain = createVoxelTerrain({ THREE });
terrain.setWorldContext(wc);
terrain.setPalette(pal);
terrain.build(scene);
const groundHeightAt = (x, z) => terrain.groundHeightAt(x, z);

// WoW-style camera collision: march from the look-target outward and stop before the camera
// would enter terrain, so the pet is never hidden behind a cube wall.
const _probe = new THREE.Vector3();
function pullIn(from, dir, dist, margin) {
  const N = 14, m = margin != null ? margin : 1.0 + terrain.maxLift(true) * 0.5;
  for (let i = 1; i <= N; i++) {
    const t = (i / N) * dist;
    _probe.copy(from).addScaledVector(dir, t);
    if (_probe.y < groundHeightAt(_probe.x, _probe.z) + m) return Math.max(1.4, t - dist / N);
  }
  return dist;
}
// Letzte Instanz gegen „Kamera steckt im Cube": unsere Welt ist ein Höhenfeld aus VOLLEN
// Säulen — wer über der Säulenoberkante ist, ist garantiert draußen. Also notfalls Richtung
// Blickziel kriechen, bis das gilt. Lieber sehr nah dran als in einer Wand (Georgs Screen 1:
// an Eck-Positionen zog die Auto-Zentrierung die Kamera in die Nachbarsäule).
function escapeTerrain(pos, look, margin, steps) {
  const m = margin != null ? margin : 0.75, N = steps || 6;
  for (let i = 0; i < N; i++) {
    const gh = groundHeightAt(pos.x, pos.z) + m;
    if (pos.y >= gh) return i;
    pos.x += (look.x - pos.x) * 0.3;
    pos.z += (look.z - pos.z) * 0.3;
    if (pos.y < gh) pos.y = gh;
  }
  return N;
}


  return { renderer, scene, camera, sun, sky, terrain, groundHeightAt, pullIn, escapeTerrain,
           wc, pal, fogCol, WORLD_SEED, STORY };
}
