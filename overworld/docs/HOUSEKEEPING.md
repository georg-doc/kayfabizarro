# HOUSEKEEPING — Georg's Infinite Canvas

Living-Statusliste je Artefakt. Stand: 2026-07-24 (v3 ausgeliefert; **v4 Travel-Modi in Arbeit**).

Status: `AKTIV` · `FROZEN` · `SUPERSEDED` · `ASSET` · `SHARED` · `IN ARBEIT`

## v4 — Travel-Modi (in Arbeit)
Reference-Docs: `docs/reference/travel/` (Brief + 001/002/003/004/005 + README).
Geplante Module (Brief §2, noch nicht gebaut): `flight-controller.js`, `ground-controller.js`,
`card-carrier.js` → gehostet in `KFB Terrain + Skydome v4.dc.html` (Kopie von v3).
Slice-Reihenfolge (Brief §7): Flug zuerst (flacher Boden) → Boden/Walk → auf Terrain v3 → 24 Pets +
Umschalter → Karten-Kinetik. **Blocker:** Reuse-Quellen (PetFlight v2, PolyGarden v2, kfb-pets-Stack,
Karten-Assets) müssen vorliegen — sonst Neubau statt Extraktion (verstößt gegen Brief §1).

## Deliverables

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Terrain + Skydome v3.dc.html` | **AKTIV** | Aktueller Entrypoint. WebGL, three 0.160. |
| `terrain-v3/terrain-poc.js` | **AKTIV** | Runner: WebGLRenderer, Panel, Horizont-Depth-Blur (+Cutoff), Grid 11, Dice-Overlay-Pass. |
| `terrain-v3/voxel-terrain.js` | **AKTIV** | GLSL-ShaderMaterial (v2-TSL-Port). Farbmodell erhalten, vec4-packing, Wasser = Farbzone (kein Pegel). |
| `terrain-v3/skydome-shader.js` | **AKTIV** | Animierter Sky S/A/space + RC-exakter Bild-Dome (Watercolor A/B + 5 Kenney) + Spirale + Sternfeld. |
| `terrain-v3/dice-sky.js` | **AKTIV** | 6 farb-codierte Lambert-Würfel (glowOf), glb per RAW + prozeduraler D6-Fallback. |
| `terrain-v3/world-context.js` | **SHARED** | 1:1 aus v2, unverändert. |
| `terrain-v3/palettes.json` | **SHARED** | 1:1 aus v2 (6 Story + 8 Cartoony + derived/rainbow). |
| `terrain-v3/jukebox-audio.js` | **SHARED** | 1:1 aus v2, RAW-first + Fallback. |
| `terrain-v3/decks/*.json` | **SHARED** | 3 Decks, 1:1 aus v2. |
| `KFB Terrain + Skydome v2.dc.html` + `terrain-v2/` | **SUPERSEDED** | Durch v3 abgelöst (WebGPU-Zweig). Bewusst behalten (Rollback, WebGPU-Referenz). |
| `Voxel Glyphs PoC.dc.html` + `terrain-v2/voxel-glyphs.js` | **FROZEN** | Eigenständiges PoC, unangetastet. |
| `KFB Terrain + Skydome v1.dc.html` + `terrain-v1/` | **FROZEN** | Ur-Version. |

## Assets

| Datei | Status | Notiz |
|---|---|---|
| `terrain-v3/edge3.jpg` | **ASSET** | Cube-Kachel (2 KB). Lokal via `import.meta.url`. Upload-Kandidat für Standalone (RAW-URL); diese Session belassen. |
| Dice-glb, Skydome-WebP, Kenney-PNG, Musik | **SHARED/RAW** | Über `raw.githubusercontent.com/georg-doc/kayfabizarro`. Nicht im Projekt. |

## Clean-Run-Checkliste (WebGL)
1. Beliebiger WebGL-Browser (rendert direkt in der DC-Vorschau, kein WebGPU nötig).
2. `KFB Terrain + Skydome v3.dc.html` öffnen → Flug über die Voxel-Landschaft.
3. Paletten-Dropdown (Story ①–⑥, Cartoony, Aus-Karten, Regenbogen) → radiale Ausbreitung.
4. Skydome-Dropdown: Nebel / Waber / Space / Watercolor A·B / 5× Kenney.
5. „Dice im Himmel" an → 6 farbige Würfel, Leader (aktueller Modus) loomt; Größen-Slider.
6. Konsole: `SCRIPT failed to load` (leere URL) ist gutartig.

## Bekannte gutartige Artefakte / Grenzen
- **`SCRIPT failed to load` (leere URL):** gutartig, App bootet.
- **Schwarzer Screenshot im Chat-Werkzeug bei totem Loop:** WebGL ohne `preserveDrawingBuffer` clemt den Puffer bei manuellem Einzel-Render; Live-Loop rendert normal.
- **Firefox: Space-Sternfeld unsichtbar** — bekanntes RC-`gl_PointSize`/Points-Problem. Backlog.
- **Watercolor ×2-Naht:** inhärent (Halb-Panorama zweimal gewickelt), identisch zu RC-v11; per 90°-Dome-Drehung aus der Blickmitte gelegt.
