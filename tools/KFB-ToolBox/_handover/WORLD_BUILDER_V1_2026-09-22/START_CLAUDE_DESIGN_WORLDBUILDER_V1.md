# KFB WorldBuilder v1 · Claude Design brief · 2026-09-24

Paste this whole file as the first message of a fresh Claude Design project. It is self-contained: you need no prior chat history. Where a file is named, load it from the exact URL given; do not search the repository for alternatives.

---

## 1 · What this is

**Kayfabizarro (KFB)** is Georg's satirical card-game universe: printed card decks (PDF pages with 4 cards each), a cartoon cast (Uncle FrizzleBob, a rabbit MC; KayKit characters such as GothGirl, Orc Raider, Black Knight), and a growing set of browser toys built with Three.js: a racer, a combat arena, an animation lab, an asset library. Everything lives in the public GitHub repo `georg-doc/kayfabizarro`; review pages are served from `https://kayfabizarro.pages.dev/`.

**WorldBuilder v1** is the tool that gives this universe a place: a small round cartoon planet Georg can shape, dress with real KFB/KayKit objects, light with changing sky and weather, and walk a character across. Later the racetrack, the Orc band, landmarks and OSM city zones get placed on it. v1 is the foundation, so correctness and the look matter more than feature count.

The look target in one sentence: **a clean, smooth, hand-made-looking cartoon planet — clay/toy surfaces, soft cel light, ink outlines, wonky 90s-cartoon buildings, warm moody skies — never a faceted low-poly globe.**

## 2 · What Georg must be able to do (done when)

1. See the planet **from outside**: smooth round silhouette, no visible triangles or facets, cartoon surface.
2. Fly the camera **in one continuous move** from the orbit view down to the ground and back (no cuts, no three-stage transition).
3. Shape terrain on the planet: Raise / Lower brush, radius on the mouse wheel, strength slider, Undo, Clear.
4. Pick a real object from a small list (a house, a tree, a rock, a lamp), place it, move / rotate / scale it, drop it onto the ground.
5. Switch the sky: DAY, EVENING, NIGHT, RAIN; switch world mood.
6. Switch the building view: **Elastic Grotesque Clay (default)**, Clean, Cartoon, Grotesque.
7. Walk one character (e.g. GothGirl) over his hill with WASD, camera following; eyes visible (eye rig on).
8. Save, reload the page, load the save, keep editing.

Stop when all eight work. No extra features.

## 3 · The donors — what each is, what to take, what not

Rule for all donors: **copy the working code, do not re-derive it.** After loading each donor, print one line on screen (e.g. `WB2 sculpt @8922d4b1 loaded`) so Georg can see it was really used.

### 3.1 Terrain editor + object editor (our own, accepted by Georg)

What it is: a browser editor built for KFB on a flat continuous heightfield terrain. Georg accepted it in two steps: **R2** (object editing: select, move, rotate, free scale, drop to ground, save/reload — PASS) and **WB2** (terrain sculpt: Raise/Lower brush, radius, strength, smooth falloff, undo, clear, save/reload — ACCEPT; his only wish: brush radius on the mouse wheel).
Height rule: `finalHeight = baseHeight(seed) + sculptDelta` — the procedural base stays reversible.
Selection and transforms are owned by **one** shared module, `edit-layer.js`. Never add a second picker or second transform gizmo.

- Editor source: `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e/tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html`
- Sculpt module: same folder, `terrain-sculpt.js`
- Shared editor: `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e/tools/KFB-ToolBox/lib/edit-layer.js`
- Live review of the accepted state: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/gelaende-formen/`

Take: all of it. Your job is to move this editor from a flat patch onto the planet surface (height along the sphere normal).

### 3.2 The planet: ZyFou/ProceduralTerrains (MIT, external)

What it is: an open-source Three.js terrain engine (`https://github.com/ZyFou/ProceduralTerrains` @`f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070`, MIT licence) found via Reddit r/proceduralgeneration. Engine and editor UI are separate; seeded parameters; chunk/LOD; it has a real **Planet mode** (`planetBundle.js`, `PlanetWorld` cube-sphere).
Take: the cube-sphere planet approach, LOD and seeded noise; MIT code where it fits.
Not: its React UI shell; do not replace our editor with its editor.

### 3.3 TinySkies — sky, weather, light (partly rejected, read carefully)

What it is: TinySkies is the look of an earlier KFB prototype, the **Travel Globe** (a flying-carpet game around a small low-poly planet). Georg loved its **light mood, skies, clouds, weather and day/night**, and tolerated its geometry. For WorldBuilder the geometry is **rejected**:
- its faceted, flat-shaded polygon globe looks bad from outside and cannot carry the racetrack;
- its camera flight into the world is cut into three separate stages; Georg wants one continuous move.

Take only these modules (public mirror in kayfabizarro):
`https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/travel/wip/travel_globe_wsa/globe-v13/` → `sky-presets.js`, `sky-atmosphere.js`, `day-night.js`, `weltstimmungen.js` (world moods), `rain-overlay.js`, `starfield.js`, `sun-shadow.js`, `light-budget.js`. Optional skydome shader: `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js`.
Rule: a world mood shifts **hue** only, never saturation or lightness.
Trap: these files are not standalone modules. Most expect a global `THREE` from the host page; `day-night.js` and `light-budget.js` import a relative `sky-presets.js`. Keep **one** Three.js instance and wrap them explicitly.
Not: Travel terrain, flat shading, `to-phong.js`, flight controls, carpet, anything else from Travel.

### 3.4 WorldDesign Lab — the procedural cartoon surface (why it exists)

What it is: a KFB lab built specifically to replace the polygon look with a clean procedural cartoon surface. It compares the same asset as SOURCE / TRIPLANAR / CLAY / COMBINED.
- `wd-look.js`: triplanar mapping with an **RGB palette tile** ("Derek" method from r/TechnicalArtist: one RGB tile, each channel picks between three colours derived from the source colour); injected into existing materials, so SOURCE stays lossless.
- `wd-macro.js`: seamless macro texture generator (breaks up repetition).
- `wd-ink.js`: KFB ink outline (thin in light, thick in shadow, soft wobble).
- `wd-light.js`: light profiles BASELINE / WHACKMAN (material and light stay independent).
Folder: `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB%20World%20Design%20Setup%20(1)/WORLDDESIGN_LAB_2026-09-23/deliverables/` (+ `textures/`).
Cel shading formula and story palettes: `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB%20Voxel%20Zone%20S2/voxel-zone-s2-full_2026-09-22/` → `kfb-box-material.js`, `terrain/world-context.js` (STORY_PALETTES).
Take: all four layers on the planet ground (triplanar RGB palette + macro texture + cel + ink). Not: material replacement, per-asset hand recolouring, voxel ground.

### 3.5 Buildings: Elastic Grotesque Clay + view switch

What it is: KFB's building form language on real OSM data (Hürth, Germany): bowed, leaning, rounded clay volumes, non-parallel roofs, sparse irregular windows, varied doors, continuous curved road ribbons, 90s-cartoon suburb feel. Live: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`.
Status (Georg, 24.09): the **V2 geometry** @`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc` is the basis. The follow-up tune "R2" **failed**: roofs still sit on top like lids (need a small overhang), road/curb seams still show wedges, shadow banding remains, and the R2 road rework added new artifacts and gaps. **Only its colour palette part works** (story mode, card seeds, random harmonic palettes).
- Geometry: `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs` @`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- Palette only: same file @`b7f28824299b15e5d8a61c4bd9d847cfbe8f18ea` (take the colour functions, not the R2 road/curb changes)
Take: Elastic as default view; keep Clean / Cartoon / Grotesque switchable — none of them may be dropped. The three bugs stay open; do not try to fix them in this slice.

### 3.6 Characters and eyes

Characters: KayKit Rig_Medium (e.g. GothGirl, Orc Raider) with the existing KayKit animation clips (idle / walk / run) for v1. A Mixamo motion library (incl. a climb-over-ledge) is being prepared separately and will be swapped in later by clip id.
Eyes: KFB characters get cartoon eyes as a runtime layer (EyeRig v6). Approved profiles: `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@cloudflare-live/kfb-hub/stage/toolbox/eye-rig-batch/data/rig-medium-default.v0.json` (Medium) and `rig-large-reviewed.v1.json` (Large). Tool for reference: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`. Mount the approved profile by default.

### 3.7 Objects

Exact asset paths come from the registry, one JSON per pack: `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/registry/assets/v1/packs/<slug>.json` (e.g. `kaykit-forest-nature-pack-1-0-free`, `tiny-treats-homely-house-1-0-free`, `rocks-pebbles-path-tiles-by-quaternius`). Use those paths; never guess file names.

## 4 · Georg's decisions (do not reopen)

- The world base is our continuous terrain on a sphere. **Travel Globe is out** as a base (its polygon anatomy cannot take the racetrack).
- **No polygon look** on the planet. The procedural cartoon surface (3.4) is the reason it was built.
- Hex tiles, voxels, OSM zones and landmarks are **content placed on the ground**, never the ground.
- One transform owner (`edit-layer.js`), one picker, one height truth.
- Views stay switchable; Elastic Grotesque Clay is only the default.
- GitHub is the only source of truth.

## 5 · Working rules

- **Take what works, show the picture, say what changed.** A copied donor is proven when its own output/log line appears again.
- Every "fixed" names what is different in the picture, in one checkable sentence.
- No single-file bundle, no simplified look-alike copy for preview convenience (these caused shrunken, wrong versions before).

## 6 · Delivery — you cannot push to GitHub

Claude Design has no GitHub write access and no browser. Do not try to commit or push. At the end of **every** slice, without being asked, deliver:

1. a **full codebase export** of the project (all files, unchanged multi-file);
2. `CHANGELOG.md`, additive, newest on top (new / unchanged / removed);
3. `RETURN.md`: first a file tree, then what is different in the picture, then open points;
4. `SOURCE.json`: every donor with exact repo path + commit.

Georg downloads it; it is then uploaded to GitHub and published as a review page under `https://kayfabizarro.pages.dev/kfb-hub/pruefen/worldbuilder-v1/`.
