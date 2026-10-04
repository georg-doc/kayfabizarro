# HANDOVER · KFB WorldDesign Lab v1 → WSA Lead Chat

Stand: 2026-09-23 · Provider: Claude Design · Repo: `georg-doc/kayfabizarro` (main)
Status: **Laborstand, nicht live-promotet.** Branch/PR/Stage aus Claude Design nicht erzeugbar.
Branch-Vorschlag: `claude-design/kfb-worlddesign-lab-v1-2026-09-23`

## 1 · Was das ist

Eine **Look-Vergleichsbank** für echte KFB-Spender (KayKit, Tiny Treats, Kenney, Plant Lab,
Graft, CapsuleCarl, Cube-Pets), kein Asset-Browser.

- **BANK** · dasselbe Asset in 1er- oder 4er-Ansicht, eine Kamera, ein Orbit, je Feld ein Look.
  Standard: `SOURCE | DEREK | NORMALEN-LOOK | RAUHEITS-LOOK`. SOURCE bleibt IMMER unverändert
  (keine Tusche, kein Look).
- **WELT** · gemischte Testszene (31 Spender), McCloud-Bildebenen VORDERGRUND (Figuren) ·
  MITTELGRUND (Props) · HINTERGRUND (Gebäude, grosse Natur) · GELÄNDE, je Ebene ein Look.
  Gelände: natürlich · Voxel (Voxel-Zone-S2-Owner) · aus. **Keine Weltrezeptur.**

Einstieg: `KFB WorldDesign Lab v1.dc.html`. Palette rechts (breit) / unten (schmal), Burger oben
rechts, Anfasser zieht Breite/Höhe (localStorage `wd-railW` / `wd-sheetH`).

## 2 · Module

| Datei | Rolle |
|---|---|
| `wd-boot.js` | Host: Bedienung, Layout, Bank/Welt, Ebenen-Stapel, Story-Palette, Tageszyklus, Beleg |
| `wd-view.js` | Felder (Scissor), eine Kamera, Solo/4er, Tusche je Feld, Himmel je Feld, Bloom/Grade |
| `wd-look.js` | Oberflächen-Shader-Einschub (`onBeforeCompile`), Presets, Derek-Defaults |
| `wd-ink.js` | Tusche (abgeleitet von `kfb-ink-outline.js`) |
| `wd-macro.js` | toroidaler Makro-Texturgenerator (grau + RGB-Maske) |
| `wd-light.js` | Licht BASELINE ↔ WHACKMAN |
| `wd-sky.js` | Himmel: three Sky · skydome-shader S/A · Aquarell · tinyskies |
| `wd-terrain.js` | Laborgelände mit Standflächen |
| `wd-voxel.js` | Voxel-Gelände über Voxel-Zone-S2-Owner |
| `wd-donors.js` | Spendertafel + Owner-Lader (`ownerImport`, `ownerImportWith`) |
| `wd-registry.js` | Lazy-Leser der Registry-Shards `registry/assets/v1/packs/*.json` |
| `textures/derek-rgb-ref.png` | Referenzkachel (aus Georgs Screenshot, nahtlos gemacht) |

Lokale Owner-Kopien (NICHT geändert): `tools/resident_atlas_s6/lib/atlas.js`,
`tools/world_atlas/source/lib/kit-lab.js`.

## 3 · Owner, die aufgerufen werden (nicht nachgebaut)

- Laden/Messen/Legacy/Rig-Bindung · `tools/resident_atlas_s6/lib/atlas.js`
- Texturreparatur, Viewer-Werte · `tools/world_atlas/source/lib/kit-lab.js`
- Graft · `kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`
- CapsuleCarl · `kfb-rigs-embed-v3/lab-v6/carlrig-mount.v1.js` + `texclean.js`
- Cube-Pet mit EyeRig · `media/3D_Assets/kfb-pets.js` (`loadPets`/`makePet`)
- Voxel-Material, Story-Paletten, Tusche-Basis · `_inbox/KFB Voxel Zone S2/voxel-zone-s2-full_2026-09-22/`
- Himmel · `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js`, `travel/wip/travel_globe_wsa/globe-v13/sky-presets.js`
- Pflanzen · `_inbox/KFB_Plant_Prop_Lab_v1/.../KFB_Plant_Prop_Lab_v2/src/plant-recipe.js`

## 4 · MISSING_DELTA — gehört bei Annahme zum jeweiligen Owner

1. **Tusche** (`wd-ink.js` → `kfb-ink-outline.js`): KFB-Schattenlogik (Licht dünn / Schatten dick,
   Breite aus Bildhelligkeit, bezogen auf 1000 px Feldhöhe) · Silhouette aus **zweiter** Tiefenableitung
   (erste feuerte auf jeder schrägen Fläche) · weicher Wobble statt 8-fps-Stufen · Stift-Druck als
   weiches Rauschen statt 11-px-Zellen (Ursache des „Pixel-Mosaiks") · Aussetzer · Tuschefarbe aus der
   Fläche · läuft je Feld im Scissor-Raster · 24-bit-Tiefe.
2. **Mehrfeld-Scissor + Composer** (`wd-view.js` → kit-lab `makeViewer`).
3. **CapsuleCarl rot**: `mountCarl()` hat `player.gltf` fest verdrahtet → wörtlich mit genau einer
   Ersetzung auf `enemy.gltf` geladen. Der rote trägt einen breiteren aufgemalten Mund; zweiter Aufruf
   von `texclean.paintOverRegion` mit gemessener Box. **Owner-Fix-Wunsch:** `mountCarl({ variant })`
   und die Heilregion je Variante; `paintOverRegion` sollte auf der geheilten Tafel weitermalen können
   (liest sonst `userData.origMap` und verliert frühere Heilungen — gemessen: Augen gelb).
4. **Makro-Generator** · Kandidat, nicht die KFB-Textur.
5. **Grade-Pass statt LUT** · echtes `.cube` ist SOURCE_REQUIRED.

## 5 · Befunde für andere Konsumenten

- Registry-Shards umgehen die `.gltf`-Blindheit des Tree-Lesers. `KayKit_Mystery_Series6` hat **keinen**
  Shard → Mystery-Spender laufen auf gepinnter Revision `fd52a9c4…` (Monstrosity, Driver-Auto) bzw. `main`.
- `Monstrosity.glb` liegt im Paket-**Wurzelordner**, nicht in `gltf/` (dort nur Waffen).
- jsDelivr: einzelne Modul-URLs antworten per `fetch` 200, per `import()` dauerhaft mit Ladefehler
  (gemessen `lab-v2/audit.js`). Zweistufiger Lader: Cache-Brecher, sonst wörtliches Blob-Modul.
- Eigenschatten auf Figuren erzeugt Schattenkarten-Artefakte (GothGirl-Brust/Hals) → Vorgabe aus.
- Grade-Pass muss NACH `OutputPass` sitzen (linear 0,5 ≠ Mittelgrau).

## 6 · Offen
- **Standalone-HTML / Produktiv-Live-URL (Georg 23.09., noch offen):** NICHT aus Claude Design machbar.
  Der Lab ist 11 wechselseitig importierende ES-Module + Owner-Module, die zur Laufzeit von GitHub
  geladen werden; `super_inline_html` bündelt nur HTML-Attribut-Ressourcen, keinen JS-Modulgraphen
  (Test endete mit „Failed to resolve module specifier"). Für eine produktive, dauerhaft erreichbare
  Fassung braucht es einen echten JS-Build (Vite/Rollup/esbuild) und ein Hosting-Ziel — vermutlich
  Web-Chat-Pipeline → GitHub-Push → Cloudflare-Deploy, analog zum WSA-Stage-Weg der anderen Tools.
  Das ist eine Aufgabe für den nächsten Konsumenten mit Build-Zugriff, nicht für diese Umgebung.

- C7 Prop/Standee-Akteur: SOURCE_REQUIRED · Landmark: SOURCE_REQUIRED (lebt im Race-/OSM-Code)
- Rollercoaster-v13-Himmel nicht im Repo → Aquarell über v11-Rezept im skydome-shader
- Tusche: eine Einstellung für alle Bildebenen (Vordergrund dicker wäre nächster Schritt)
- Relative Pfade (siehe HOUSEKEEPING § Pfad-Hygiene) vor Standalone-Export auf RAW-URLs heben
- 832-px-Beleg nicht erhoben

## 7 · Genau ein nächstes Gate

Georgs Urteil: welche Kombination je Bildebene wird der KFB-Look-Kandidat → ein gespeichertes
Look-JSON (`Look · JSON`) auf **einen** echten Konsumenten (OSM **oder** RaceTrack), nicht beides.
