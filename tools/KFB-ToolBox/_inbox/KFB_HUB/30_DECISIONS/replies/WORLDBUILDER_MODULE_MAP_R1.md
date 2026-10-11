# Worldbuilder · Modul-Karte R1 (Editor, Spieler, Maker)

Stand: 12.10.2026 · Agent Spiel-Werkzeug-Architektur für die Steuerung · nur Inventur und Plan, kein Bau, keine Änderung im Lab.
Maßgeblich bleiben DECISIONS.md, Plan R1 und PROJECT_STATE (V-117). Hier steht **kein neuer Beschluss**.

**Belegarten:** `code` = Datei:Zeile im Lab bzw. Repo · `doc` = Dokument · `site` = URL (gelesen am 12.10.) · **Vorschlag** = neu, nicht entschieden.
**Modi:** E = Insel-Editor („God-Mode“, Georg baut) · P = Spieler (gehen, fahren) · M = Maker-Insel (Spieler baut, später).

---

## 1 · Kurzantwort

- Es gibt schon viel. Im Lab-`src` zähle ich **38 Module**. Außerhalb liegen **24 Spender** (ToolBox, Dropbox, Repos). **16 Seiten** sind öffentlich live.
- Die Spielseite (P) ist am weitesten: Gehen, Fahren, Kamera, Licht, Himmel, Klang, HUD, Strecke und Tunnel haben PASS-Einträge.
- Die Editor-Seite (E) ist dünn: `editor.ts` kann Umriss und Gebäude, aber keinen Terrain-Pinsel, kein Snap, kein Undo. Die Spender dafür existieren (WB2-Sculpt, Resident-Atlas-Edit-Layer, Librarian).
- Für Maker (M) gibt es nur Konzepte. Laut Register und Review ist das nach dem MVP.
- Der Kern für alle drei Modi existiert halb: das Insel-Rezept `kfb.island-config/1`. Es fehlen eine Welt-Hülle, ein Änderungs-Protokoll (Undo), Rechte je Modus und ein Katalog-Adapter.

---

## 2 · Such-Protokoll (V-004, V-140)

| Ort | Wie | Ergebnis |
|---|---|---|
| `KFB_HUB/30_DECISIONS/DECISIONS.md` | ganz gelesen (V-001 … V-187) | Status je Modul unten |
| Lab `CLAUDE.md`, `docs/KFB_WORLDBUILDER_PLAN_R1.md`, `PHASE_C_DONORS_R1.md`, `MVP1_DONOR_AND_MODEL_MAP_R1.md`, `ACCEPTANCE_INDEX.md`, `MODULES.md`, `BACKBONE_EDITOR_DONORS_R1.md`, `SPEC_WORLDBUILDER_GODMODE_VISION_R1.md`, `REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md`, `KFB_TECHNIK_UND_SCHNITTSTELLEN_R1.md`, `PROJECT_STATE.md` (Kopf) | gelesen | Spender und Lücken |
| Lab `src/**` | Dateiliste, Kopfzeilen, gezielte grep | 38 Module (§3) |
| `replies/AUDIT_ARCH_R1.md`, `STEERING_REPLY_WSA_*`, `WSO_CLIP_CATALOG_R1` | gelesen bzw. überflogen | Grenzen, Schemas |
| `~/Developer/kayfabizarro-publish` `origin/main` (dccf75ca, Fetch am 12.10. ohne Änderung) | `git ls-tree`, `git show` | ToolBox-Inhalt (§4) |
| `~/Dropbox/CLAUDE/*` (ohne KFB Open World) | Ordnernamen, `find` nach RollerCoaster, Acting, dungeon-grid, wb2-sculpt | Spender (§4) |
| https://kayfabizarro.pages.dev + Unterseiten | WebFetch Startseite, `curl` Status und Titel | §5 |

**Nicht gefunden in** Lab, KFB_HUB und `origin/main`: `scene-rules.json` (`kfb.scene-rules/1`), `light-presets.json`, `rhythm-props.json`. Sie liegen laut Steuer-Antworten auf WSA-Branches (Heads `2a08a4c`, `2b0fc44`), die lokal nicht gezogen sind [doc `replies/STEERING_REPLY_WSA_C_R1.md`, `STEERING_REPLY_WSA_RHYTHM_R1.md`]. `kfb.world-layout/1` ist nur geplant [doc Plan R1 Phase D], im Code nicht gefunden.
**Nicht gefunden in** `origin/main`: RollerCoaster v11, Acting Lab. Beide liegen lokal [`KFB VoxelWorld/KFB RollerCoaster v11/`, `KFB Pet Studio/Studies/Acting-Lab-v0.4-Ad-Astra/`].

---

## 3 · Inventur Lab `src` (nur gelesen)

Status aus dem Register (V-Nummer) bzw. aus PROJECT_STATE. „–“ = kein Georg-Urteil gefunden.

### 3a · Welt-Daten und Regeln

| # | Modul | Pfad | Zweck | Status | Modi |
|---|---|---|---|---|---|
| 1 | Welt-Dokument | `src/island/spec.ts:134` (`WorldSpec`), gespeichert in localStorage `kfb.worldbuilder.v1` [`main.ts:58`, `:232`] | Inseln, Umrisse, Seeds, Gebäude, Bewohner, Anker, Form, Layout | – (Autoren-Zustand, Review §4) | E, P, M |
| 2 | Insel-Rezept | `src/island/recipe.ts:7` `kfb.island-config/1`; Sperrliste Spielstand `:8`; `edits: []` immer leer `:38`; `nodes[]` muss leer sein `:49` | Insel als Rezept statt Mesh | Spec bestätigt (Review §6, Georg 09.10.) | E, P, M |
| 3 | Orts-Beziehungen | `src/scene-study.ts:5` (Schema **/1**) | Handlungsorte und Verbindungen | V-141 bestätigt **/2**; Code ist noch /1 | E, M |
| 4 | Insel-Thema | `src/theme/island-theme.ts:1`, `public/themes/island-themes.json` (`kfb.island-theme/1`) | Biom, Klang, Licht, Himmel je Insel | V-051 RULE (Generator in F) | E, P, M |
| 5 | Paletten | `src/palettes.ts:1` (J17 WORLDS 1:1) | Farbrollen | V-102 PASS, V-174 | E, P, M |
| 6 | Maßstab | `src/scale.ts`, `src/catalog-k2.ts:1` | K2, H = 3,64, Türregel | V-060 RULE, `SCALE_CONTRACT_K2.md` verbindlich | E, P, M |

### 3b · Inseln, Gelände, Umgebung

| # | Modul | Pfad | Zweck | Status | Modi |
|---|---|---|---|---|---|
| 7 | Umriss | `src/island/shape.ts` | Catmull-Rom-Umriss mit Punkten | – | E, M |
| 8 | R2D-Gelände | `src/island/r2d/*` (fields, plan, form, fragments, terrain-mesh, ground, top-material, maps, ao, relics) | Oberseite, Form-Modifikatoren | Oberseite „Richtung gut“; prozedural 5–6/10 (V-162) | E, P |
| 9 | Scholle v7 | `src/island/r2d/scholle.ts` | Inselkörper | Unterseite v2–v6 FAIL; Körper modelliert jetzt Blender (V-167) | E, P |
| 10 | Altes Gelände | `src/island/terrain.ts`, `island.ts`, `composition.ts`, `nature.ts` | Höhenfeld, Einbettung `addEmbed` | – | E, P |
| 11 | Straßenbett-Naht | `src/island/roadbed.ts:44` (`kfb.road-bed/1`), `rkit-parts.ts` | RKIT-Straße schneidet Gelände | gemessen 0 Dreiecke über Fahrbahn [doc KFB_TECHNIK §3] | E, P |
| 12 | Demo-Inseln | `src/island/demo-stage.ts`, `src/demo-scenes.ts` | 8 StreakByte-Szenen unverändert | V-080 RULE | P (E: anordnen in D) |
| 13 | Environment Kit | `src/environment/*` (kits, place `:45`, grounding, biomes, material) | Natur, Rule-of-Three, Erdung | E1+E2 PASS mit offenen Punkten [doc PROJECT_STATE l.375] | E, P, M |
| 14 | Fels-Bausatz, Moos | `src/environment/rock-kit.ts`, `moss-cap.ts` | Felsformationen | auf Eis [doc Plan R1 §4] | – |
| 15 | Knete | `src/clay/*` + Kopien in `sky/vendor`, `world/organ/vendor` | Clay v10 / K2 / Nahband | V-053 RULE; Audit: drei Knete-Familien doppelt [doc AUDIT §5] | E, P, M |
| 16 | Wasser | `src/water/water.ts`, `vendor/fluid.js` | See, Fluss, Ufer | V-052 PASS | E, P |

### 3c · Strecke und Tunnel

| # | Modul | Pfad | Zweck | Status | Modi |
|---|---|---|---|---|---|
| 17 | Track Core 0.16.9 | `vendor/private/track-core-0.16.9/track-core.mjs`: `SLOTS :76`, `SKINS :226`, `compileRecipe :413`, `compileGraph :1386`, `runChecks :2319`, `trailChecks :2747` | Geometrie, Graph, Skins, Prüfungen | V-118, V-134, V-143, V-145–V-147; RKIT pausiert | E, P, M |
| 18 | Strecken-Welt + J17-Look | `src/world/organ/organ-world.ts`, `vendor/j17/lab-track/j17-track.lab.js`, `track-look.v5.js` | Ring, Fahrbahn, Strang, Pfeiler | V-109 RULE, V-102 PASS, V-133 PASS | P (E in Phase E) |
| 19 | Aus-/Auffahrt-Möbel | `src/world/organ/c4c-furniture.ts` | Gore, Pfeile, Banden-Enden | V-183 PASS (Banden-Enden v2) | P |
| 20 | Tunnel | `src/world/tunnel/*`, `tunnel-join.ts`, `src/bench/*` | TC1-Portal + Innenausbau, Boolean | V-130 PASS; Wirt-Berg TUNE (V-156, V-162) | E, P |
| 21 | Mesh-Prüfungen | `src/world/organ/mesh-check.ts`, `tunnel-qcheck.ts`, `src/island/r2d/qa.ts` | offene Kanten, Durchsicht, Q-Werte | Pflicht V-112, V-136 | E, M |

### 3d · Spielen (gehen, fahren, sehen, hören)

| # | Modul | Pfad | Zweck | Status | Modi |
|---|---|---|---|---|---|
| 22 | Fahren | `src/play/drive.ts:217` (`createStreamDrive`), `vendor/kfb-drive.k2b.js` | k2b auf Track-Stream | V-032 RULE (bytegleich), V-030 PASS, V-126, V-161 | P, M (Probefahrt) |
| 23 | Gehen + Travel | `src/play/travel.ts:43`, `figure.ts`, `vendor/travel-core.j17.js`, `walk-controller.js`, `locomotion-profiles.v1.js` | ein Gangschema, Sprünge | V-020 PASS, V-021–V-023, V-157 | P, M |
| 24 | Ein-/Aussteigen | `src/play/car-hop.ts`, `seat.ts`, `cabrio*.ts` | Hop am Retro-Auto | V-031 TUNE; Cabrio nach MVP | P |
| 25 | Lauf-Oberfläche | `src/play/surface.ts` | Höhe aus Meshes per Raster | V-159 (≥ 50 fps) | P, M |
| 26 | Spielkamera | `src/play/camera.ts:53` | Federarm, Zoom, Recenter | V-088 PASS, V-025 | P, M |
| 27 | God-Kamera | `main.ts:430–441` (OrbitControls, Zoom zum Cursor) | Orbit im Editor | V-026 RULE | E, M |
| 28 | Licht | `src/world/light.ts:61` | ein Rig, ein Zustand, Lichtkreis | V-050 TUNE (Abend), V-097 | E, P, M |
| 29 | Himmel | `src/sky/sky.ts:29` + `sky/vendor` (SKY3, globe-v13) | Dome, Tageslauf, Regen, Aurora | V-092, V-101 RULE | E, P |
| 30 | Klang | `src/audio/audio-owner.ts:27`, `race-audio.ts` | ein AudioContext, Bett, Radio, Racer-SFX | V-137 PASS, V-042, V-128/V-129 | P (E: Vorschau) |
| 31 | Fahr-FX | `src/play/race-fx.ts`, `vendor/clay-vfx.v1.js` | Knet-Partikel, Banden-Wackeln | V-128 | P |

### 3e · Oberfläche, Figuren, Editor, Prüfung

| # | Modul | Pfad | Zweck | Status | Modi |
|---|---|---|---|---|---|
| 32 | HUD R3 + Rucksack | `src/hud/game-hud.ts:37`, `vendor/kfb-hud.js`, `kfb-backpack.js` | Plaketten, Radio, Rucksack, Spiel↔God-Schalter | V-040 PASS, V-041 | P, E (Schalter), M |
| 33 | Almanach | `src/hud/almanac.ts` | Fächer + Overlay | V-043, V-089 | P |
| 34 | Figuren-Wähler | `src/hud/figure-picker.ts`, `src/residents/figure-b2.ts` | 67 Figuren spielbar | B2 erledigt [doc PROJECT_STATE l.117]; V-090 PASS | P, E |
| 35 | Bewohner + Augen | `src/residents/*` (resident.ts, pet-eye-rig.v6.js) | NPC mit Eye-Rig, Clip, Sitz | V-090 PASS, V-062 (Studio 1:1 in H) | E, P, M |
| 36 | Editor | `src/editor.ts:49` (Modi view/form/build, `:401`) | Umriss, Insel bewegen, KayKit-Gebäude, JSON | V-081 RULE (Plan F); **kein Undo** (grep ohne Treffer), kein Snap, kein Pinsel | E |
| 37 | Inspector | `src/inspect.ts` | three-inspect + Kosten je Material | PASS mit Patch [doc PROJECT_STATE l.494] | E |
| 38 | Prüfungen | `tools/parity/parity.mjs`, `tools/track/drive-test.mjs`, `c4a-foot-test.mjs`, `body-closed.mjs`, `src/play/drive-test.ts` | Gleichstand, Fahr-/Fußtest | V-003, V-107, V-125, V-159 | E, P, M |

**Querbefund aus dem Audit:** `main.ts` ist ein Block von rund 520 Zeilen mit allen Modi; rund 124 Query-Parameter werden in 19 Dateien selbst gelesen [doc AUDIT_ARCH_R1 §1.2, §5]. Für drei Modi ist das die größte Bremse. Das Audit plant `flags.ts` und Hosts nach V-171 Punkt 1–3 [doc AUDIT §7 Nr. 9].

---

## 4 · KFB ToolBox und weitere Spender

**Befund zum Ordner `tools/KFB-ToolBox` auf `origin/main`:** 3 226 Dateien. Der Kern ist ein WSA-Export mit drei Standalone-HTMLs (FrankenStein Studio v17, Rigging Lab v1, Animation Lab v2), alle „NOT_TESTED“ [code `TOOLBOX_MANIFEST.json`]. Der Rest ist `_inbox` (Session-Cuts als Kopie) und `_handover` (Doku). `START_HERE.md` verlangt seit 04.10. genau **eine** ToolBox-Eingangstür, die nur weiterleitet. Die Fach-Werkzeuge sind GPT-Sites [doc `tools/KFB-ToolBox/START_HERE.md`]. `skills/` enthält Doku und kleine JS-Helfer (Karten, Tusche), keine Welt-Module.

„Läuft“ = startbare HTML-Seite vorhanden. „Doku“ = nur Text.

### 4a · Welt, Inseln, Editor

| Spender | Ort | Art | Nutzen für | Stand |
|---|---|---|---|---|
| WB2 Terrain-Sculpt | `KFB_WORLD_INTEGRATION_01_…_2026-09-25_r2/tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js` | läuft (0.160) | Terrain-Pinsel E, M; Striche passen in `edits[]` | Georg abgenommen [doc BACKBONE §4] |
| Resident-Atlas Edit-Layer, Snap, Grounding | `KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/lib/edit-layer.js`, `snap.js`, `grounding.js` | läuft (0.184) | Picking, Gizmo, **Undo/Redo**, Snap, Erdung | Teil der R2-Abnahme nicht einzeln belegt [doc BACKBONE §4] |
| Streckenbauer S13 | `KFB Racetrack Blender Kit/TRACK-CORE/S13_V012_2026-09-28/builder/` | läuft (0.160, Worker) | Start für Strecken-Editor E | nur Stückliste, kein Ziehen [doc BACKBONE §1] |
| R2D v0 + Scholle Bench v7 | `KFB World Core R2D v0 Insel + KFB Scholle Bench v7/` (auch ToolBox `_inbox`) | läuft | im Lab portiert (#8, #9) | Biome gut, Unterseite FAIL [doc ACCEPTANCE_INDEX] |
| Hex-Archipel R2C, Hex Assets WS1 | `KFB World Core R2C · Hex-Archipel Katalog/`, `KFB Hex Assets Worldbuilding (WIP Exporte WS1)/` | läuft | Hex-Raster für Maker-Snap; `hex-grid.js` schon im Lab vendored [code `src/world/organ/vendor/vendor-hex/hex-grid.js`] | – |
| Dungeon-Grid S21 | `KayKit_Room_Study_S21/S22_RoomStudy_Handover/lib/dungeon-grid.js` | läuft (0.184) | Raster-Räume, Dungeon-Strecke V-182 | V-182 TBD |
| KayKit Environment Atlas + Dungeon Generator + 3D scene editor | `KayKit Environment Atlas + Dungeon Generator + 3D scene editor TOOL (5)/`; live `tools/world_atlas/` | läuft | Kit-Katalog, Szenen-Editor-Vorlage | – |
| WB0 Ground Movement | live `travel/wip/travel_globe_wsa/world-builder/` | läuft | alter Editor-Versuch | Recovery-Strang [site kfb-hub] |
| WB-D1 Cologne Shell, WB-W0 | `KFB WB-D1 · Cologne World Shell/`, `KFB WB-W0 · World Scale + Traversability/` | Session-Ordner | Maßstab, Begehbarkeit | WB2 R4 gestoppt [doc Review §2 Nr. 6] |
| WorldBuilder Claude Design | `KFB WorldBuilder Claude Design/` | Doku | Briefings | Claude Design baut kein 3D (V-084) |
| Organ-Inseln O1 v4–v7 | `KFB Organ-Inseln + race track v4+/` | läuft (0.184) | im Lab als Ring (#18) | V-098, V-127 Platzhalter |

### 4b · Strecke, Fahren, Spielgefühl

| Spender | Ort | Art | Nutzen | Stand |
|---|---|---|---|---|
| Joyride J14–J17 | `KFB_JOYRIDE_J14…`, `…J15….zip`, `…J16…_r2.zip`, `KFB Joyride J17 · FB Cabrio/` (Kopien in ToolBox `_inbox`) | läuft (0.160) | Look, k2b, Kamera, Tunnel-Looks | V-010/V-102 Goldstandard |
| Stunt Car Race | `KFB Stunt Car Race/ChatGPT_web/` (track-lab, track-environment-lab, race-audio-*, free-roam, osm-town-mvp); Repo `georg-doc/KFB-Stunt-Car-Race` | läuft | Strecken-Umgebung, Rennklang | Pflicht-Suchort V-140 |
| RollerCoaster v11 | `KFB VoxelWorld/KFB RollerCoaster v11/…/Rollercoaster Ride v11.dc.html` | läuft | Kamera-Slider (V-025), Drone-Bett (V-131) | V-131 später |
| WhackMan v1-1 | `KFB WhackMan/KFB WhackMan v1-1/` (auch `_inbox`) | läuft | Lichtkreis 1:1 (V-097), Draufsicht für Dungeon (V-182) | V-097 übernommen |
| Vehicle Deformer v2 | `KFB Vehicle + Rigging + Animation Lab(3)/lab-v7/`; live `kfb-hub/stage/vehicle-deformer-v2/` | läuft | Auto-Cartoon | keine Abnahme; V-103 „bleibt draußen“ |
| Track Core 0.16.9 (Quelle) | `~/Developer/rkit-r3/trackcore/` | Node | Geometrie | RKIT pausiert [MEMORY] |

### 4c · Figuren, Bewegung, Sprache, Inhalte

| Spender | Ort | Art | Nutzen | Stand |
|---|---|---|---|---|
| Asset Librarian | Repo `tools/asset_registry/librarian/` (`search.js`, `thumb3d.js`), `registry/assets/v1/` (16 726 Zeilen) | läuft (live v1.8) | Katalog für E und M | GPT-Site v10 kanonisch [MEMORY]; Zeilen ohne Lizenzfeld [doc BACKBONE §4] |
| Animation Lab v1–v4, Clip-Schau | `KFB Animation Lab/` | läuft | Clip-Prüfung | Production-Auftrag 24 Zustände [doc LAB_RETURN] |
| Acting Lab v0.2–v0.4 | `KFB Pet Studio/Studies/Acting-Lab-v0.4-Ad-Astra/` | läuft | Acting-Anlässe (V-177, V-181) | – |
| Clip-Katalog | `replies/WSO_CLIP_CATALOG_R1/clip-catalog.json` (`kfb.clip-catalog.v1`, 290 Clips) | Daten | Clip-Auswahl je NPC | Vorschläge bis Georgs Ja; Motion Library V-186 PASS |
| Stage-First Face-Rigs | `KFB ToolBox Studio Rig Anim/…/stage-first/` | läuft | Gesicht, Viseme (Phase H) | „ACCEPTED FOR WORKING BASELINE“ 16.09. [doc ACCEPTANCE_INDEX] |
| FrankenStein Studio v17/v18, Rigging Lab v1 | ToolBox WSA-Export, `_inbox/*.zip` | läuft (Standalone) | Figuren-Bau | NOT_TESTED [code TOOLBOX_MANIFEST] |
| ChatterBox Studio v2 | `KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/` | läuft | Triplet-Dialoge [MEMORY] | v2 TUNE [doc CURRENT_STATE] |
| Billboard / Hypernormalisation | `KFB Clay Stage + Curtain R2 - KFB Billboards Hypernormalisation+Quotes/` | läuft | Billboards an der Strecke (V-173) | R2 „passt so mit TUNE“ 09.10. |
| HUD Flight + Flug-VFX | `KFB HUD Flight Board - Flight VFX/` | läuft | HUD (#32), Flug später | V-040 PASS |
| Combat Arena | Repo `georg-doc/KFB-Combat-Arena`, live `kfb-combat-arena.pages.dev` | läuft | Tab-Ziel, Action-Bar (V-083) | V-083 TBD |

---

## 5 · Veröffentlichte Seiten

**Befund:** Die Startseite https://kayfabizarro.pages.dev verlinkt **keine** Werkzeuge. Sie zeigt Regeln, Essays, Downloads [site]. Werkzeuge erreicht man über https://kayfabizarro.pages.dev/kfb-hub/ („KFB Production Hub“). Nicht gelistete Pfade liefern die Startseite als Rückfall (gleiche Größe 333 293 Byte); das werte ich als „nicht live“.

| Seite (live, HTTP 200) | Titel / Zweck | Repo-Ordner |
|---|---|---|
| `/kfb-hub/` | Production Hub, Router mit Links | `kfb-hub/` |
| `/kfb-hub/stage/toolbox/` | ToolBox-Übersicht (Eye-Rig-Batch, KayKit Motion Lab, Card Zone Lab, Seam Lab) | `kfb-hub/stage/toolbox/` |
| `/kfb-hub/stage/` | KFB Stage, Spielwiese | `kfb-hub/stage/` |
| `/kfb-hub/stage/stunt-world/` | Stunt World (Stadt-Bühne) | `kfb-hub/stage/stunt-world/` |
| `/kfb-hub/stunt-race/track-environment-lab/` | „KFB Race · Box Stop“ | `kfb-hub/…`; Quelle Stunt Car Race |
| `/kfb-hub/stage/vehicle-deformer-v2/` | Fahrzeug-Deformer | ToolBox `_inbox` Deformer v2 |
| `/asset-librarian/` → `/tools/asset_registry/librarian/` | Asset Librarian v1.8 · Deck Library | `tools/asset_registry/librarian/` |
| `/world-atlas/` → `/tools/world_atlas/` | World Atlas · Kit Lab | `tools/world_atlas/` |
| `/resident-atlas/`, `/resident-atlas-s6/` | Resident Atlas | `tools/resident_atlas*/` |
| `/kfb-hub/free-roam/game-dev-studio/` | Game Dev Studio | `kfb-hub/free-roam/` |
| `/travel/wip/travel_globe_wsa/` + `/world-builder/` | Travel Globe v13, World Builder WB0 | `travel/wip/` |
| `/tools/osm-city-lab/` | OSM City Lab | `tools/osm-city-lab/` |
| `/tools/img2threejs/` | img2threejs-Prototypen | `tools/img2threejs/` |
| `/tools/kfb-cartoon-map-board/` | Cartoon Map Board Europa | `tools/kfb-cartoon-map-board/` |
| `/overworld/` | „Bundled Page“ (Overworld) | `overworld/` |
| `kfb-combat-arena.pages.dev` | Combat Arena v5a | Repo KFB-Combat-Arena |

**Nicht live** (Rückfall auf Startseite): `/travel/`, `/tools/KFB-ToolBox/` (per `.assetsignore` ist `_inbox` ausgeschlossen), `/KFB Stunt Car Race/`, `/KFB Combat Arena/`, `/Nexus Castle/`, `/game-ready/`, `/micro-learning/`, `/kfb-hub/stage/combat/card-hex-ascent-coworker/` (im Hub verlinkt, aber Rückfall).

**GPT-Sites** (im Hub verlinkt, HTTP 401 „Sign in required“, Inhalt nicht prüfbar): Asset Librarian, Audio, Production Control, FrankenStein Composer, Hypernormalisation Curator, EyeRig Workbench, **KFB World Studio MVP1** (`kfb-world-studio-mvp1.frizzlebob.chatgpt.site`). Letztere klingt nach Welt-Editor; den Inhalt konnte ich nicht sehen. Frage dazu in §10.

**Kein Lab-Stand ist öffentlich.** Der Worldbuilder läuft nur lokal (Port 5192).

---

## 6 · Modul-Karte (Plan)

Spalten: **Wie** = so nutzen / anpassen / fehlt · **Besitzer** = Sitzung · Modi E/P/M.

| Modul | Heute | Wie | E | P | M | Besitzer | V |
|---|---|---|---|---|---|---|---|
| Welt-Hülle (Inseln + Layout + Strecken + Beziehungen) | `WorldSpec` (#1) | anpassen → Vorschlag `kfb.world/1` §7a | ✓ | ✓ | ✓ | Lab | V-141, Review §4 |
| Insel-Rezept | `recipe.ts` (#2) | so nutzen; `edits[]` füllen | ✓ | lesen | ✓ | Lab | Review §6 |
| Welt-Layout (Inseln im Raum) | – | fehlt (Plan D `kfb.world-layout/1`) | ✓ | lesen | – | Lab | Plan R1 D |
| Strecken-Graph | Track Core `compileGraph` (#17) | so nutzen (Graph als Daten) | ✓ | lesen | ✓ (Teilmenge) | RKIT Geometrie, Lab Look | V-118, V-134, V-145 |
| Strecken-Editor (Ziehen) | Streckenbauer S13 (nur Stückliste) | fehlt (Phase E) | ✓ | – | ✓ (Snap) | Lab | Plan R1 E |
| Strecken-Look + Tunnel | #18–#20 | so nutzen | ✓ | ✓ | ✓ | Lab | V-102, V-130 |
| Orts-Beziehungen | `scene-study.ts` /1 | anpassen auf /2 + Importer | ✓ | – | ✓ | Lab + WSA | V-141 |
| Insel-Thema + Paletten | #4, #5 | anpassen (Generator, storyTint) | ✓ | lesen | ✓ (Preset-Wahl) | Lab | V-051 |
| Gelände-Oberseite + Form | #8, #10 | so nutzen | ✓ | ✓ | ✓ (eingeschränkt) | Lab | V-162 |
| Inselkörper | #9 + Blender-Körper | anpassen (Mesh→Feld-Adapter) | ✓ | ✓ | Vorlagen | Blender + Lab | V-136, V-167 |
| Terrain-Pinsel | WB2 `terrain-sculpt.js` | anpassen (in IslandField, r186) | ✓ | – | ✓ | Lab | V-081 |
| Terrain-Maler (Sprenkel S1) | `kfb-speckle.ts` | fehlt als Pinsel | ✓ | – | ✓ | Lab | Plan R1 F |
| Platzieren + Gizmo + Undo | `editor.ts` + RA `edit-layer.js` | anpassen | ✓ | – | ✓ | Lab | V-081 |
| Snap + Erdung | RA `snap.js`, `grounding.js`, Lab `environment/grounding.ts` | anpassen (Insel-, Strecken-, Hex-Snap) | ✓ | – | ✓ | Lab | V-060 |
| Muster-Pinsel | – (Bausteine `nest`, `fan`, `put`) | fehlt | ✓ | – | ✓ | Lab | Plan R1 F |
| Natur-Platzierung | `environment/place.ts` (#13) | so nutzen | ✓ | ✓ | ✓ | Lab | E1/E2 |
| Asset-Katalog | Librarian-Registry + `catalog-k2.ts` | anpassen → Katalog-Adapter §7c | ✓ | – | ✓ (Filter) | Lab liest, Librarian besitzt | V-070 |
| Mauer-Baukasten | Referenzblatt | fehlt (Bestand prüfen) | ✓ | – | ✓ | Lab | V-105 |
| Rhythmus-Props, Billboards | `rhythm-props.json` (WSA), Billboard-Kit | anpassen | ✓ | ✓ | ✓ | Lab | V-172, V-173 |
| Bewohner + Augen | #35 | so nutzen | ✓ | ✓ | ✓ (Auswahl) | Lab | V-090 |
| Clips / Acting | Clip-Katalog, Motion Library | anpassen | ✓ | ✓ | – | Motion | V-177, V-186 |
| Gehen / Fahren | #22–#25 | so nutzen | Probe | ✓ | ✓ (Probe) | Lab | V-020, V-032 |
| Kamera Spiel / God | #26, #27 | so nutzen | ✓ | ✓ | ✓ | Lab | V-025, V-026, V-088 |
| Licht, Himmel, Wasser | #16, #28, #29 | so nutzen | ✓ | ✓ | Preset | Lab | V-050, V-052, V-092 |
| Klang + FX | #30, #31 | so nutzen | Vorschau | ✓ | – | Lab | V-137 |
| HUD + Modus-Schalter | #32 | anpassen (Maker-Plakette) | ✓ | ✓ | ✓ | Lab (+ Claude Design 2D) | V-040 |
| Rechte je Modus | – | fehlt → §7e | ✓ | ✓ | ✓ | Lab | – |
| Spielstand `PLAYER_SAVE` | – | fehlt (P0 nach MVP-2) | – | ✓ | ✓ | Lab | Review §5 |
| Validierung | #21, #38, `recipe.ts:8` | anpassen → ein `validate()` | ✓ | – | ✓ (Pflicht) | Lab | V-112, V-136, V-115 |
| Modus-Hosts statt `main.ts` | `main.ts` | anpassen (Audit #9) | ✓ | ✓ | ✓ | Lab | V-171 |

---

## 7 · Modularer Vertrag (alles hier ist **Vorschlag**)

Ziel: Editor, Spieler und Maker lesen **ein** Welt-Modell. Kein Modus hat eigene Geometrie-Daten. Nur der Editor-Pfad schreibt. Gebaut wird auf dem, was es schon gibt.

### 7a · Welt-Hülle `kfb.world/1` (Vorschlag)

Eine Datei verweist auf bestehende Schemas. Neu ist nur die Hülle.

```json
{
  "schema": "kfb.world/1",
  "worldId": "main",
  "rev": 42,
  "islands":   [ { "$schema": "kfb.island-config/1", "worldId": "protopia", "…": "…" } ],
  "layout":    { "schema": "kfb.world-layout/1", "poses": { "protopia": { "pos": [0,0,0], "rotY": 0 } } },
  "tracks":    [ { "schema": "kfb.track-core.graph/0.3-input", "id": "ring", "routes": [] } ],
  "relations": { "schema": "kfb.scene-study/2", "binding": "receiver-selected-world", "places": [], "connections": [] },
  "theme":     { "ref": "themes/island-themes.json" },
  "light":     { "preset": "kfb-day" },
  "plots":     [],
  "meta":      { "createdIn": "god", "profile": "god" }
}
```

Regeln:
- **Rezept statt Mesh.** Meshes, Felder, Streams sind Cache. Sie werden nie gespeichert [doc SPEC_GODMODE §6].
- **Bestehende Teile 1:1:** Insel = `kfb.island-config/1` [code `recipe.ts:7`]. Strecke = Graph-Eingabe für `compileGraph` [code `track-core.mjs:1386`, Kommentar `:1127`]. Beziehungen = `kfb.scene-study/2` (V-141). Thema = `kfb.island-theme/1`. Straßenbett = `kfb.road-bed/1` bleibt RKIT-Ausgabe, kein Welt-Feld.
- **Nie in der Welt:** Spielerzustand. Die Sperrliste existiert schon [code `recipe.ts:8`]. Sie gilt für die ganze Hülle.
- **`plots`** sind leer bis Maker (§8).
- **Speicherort heute:** localStorage [code `main.ts:58`]. Zusätzlich Export als Datei. Frage 6.

### 7b · Änderungen als Befehle (Platzieren, Pinsel, Undo)

Jede Änderung ist ein Befehl. Ein einziger Schreiber wendet ihn an.

```ts
type Op =
  | { op: 'island.add' | 'island.remove'; island: IslandRecipe | string }
  | { op: 'island.pose'; id: string; pos: V3; rotY: number }
  | { op: 'outline.set'; id: string; outline: P2[] }
  | { op: 'terrain.stroke'; id: string; stroke: WB2Stroke }      // landet in edits[]
  | { op: 'paint.stroke'; id: string; stroke: PaintStroke }       // Sprenkel S1, Rolle aus ENV_ROLES
  | { op: 'place.put' | 'place.move' | 'place.remove'; id: string; item: Placed }
  | { op: 'pattern.stroke'; id: string; seed: number; path: P2[]; recipe: string }
  | { op: 'track.point' | 'track.attach' | 'track.skin' | 'track.tunnel'; graph: string; args: unknown }
  | { op: 'theme.set'; id: string; theme: Partial<IslandTheme> }
  | { op: 'relation.link'; from: string; to: string; reason: string };

applyOp(world, op, profile) → { world, inverse, rebuild: Dirty[] }
```

- **Undo/Redo:** Jeder Befehl liefert seinen Gegen-Befehl. Stapel im Speicher. Vorbild: Undo im Resident-Atlas-Edit-Layer [doc BACKBONE §4].
- **Speichern:** Schnappschuss plus Befehls-Log seit dem Schnappschuss. Das Log ist auch der Weg für Maker-Teilen und für Prüfungen.
- **Pinsel speichern Striche, nicht Ergebnisse.** WB2-Sculpt ist schon so gebaut („serialisierbar → passt in `edits[]`“) [doc BACKBONE §4]. Heute bleibt `edits[]` leer [code `recipe.ts:38`].
- **Muster-Pinsel** speichert Pfad + Seed + Regel. Die Instanzen entstehen beim Bau, wie `placeEnvironment` mit `overrides` [code `environment/place.ts:33`, `:45`].
- **`rebuild`** meldet, welche Teile neu gebaut werden müssen (Insel X, Strecken-Chunk Y). Das braucht der Zieh-Editor (< 100 ms je Punkt) [doc AUDIT §7 Nr. 10].

### 7c · Katalog-Schnittstelle (Librarian)

```ts
interface CatalogEntry {
  assetId: string; packId: string; path: string; rawPinned?: string;   // aus registry/assets/v1/catalog.jsonl
  kind: 'building' | 'prop' | 'nature' | 'figure' | 'vehicle' | 'module';
  k2: number;                     // Faktor aus catalog-k2.ts / SCALE_CONTRACT_K2
  footprint?: P2[]; sockets?: Socket[];   // Snap-Punkte
  skins?: string[];               // race | town | country | dirt | trail | cosmic | stone
  source: 'KayKit' | 'TinyTreats' | 'Quaternius' | 'Kenney' | 'RKIT' | 'KFB';
  local?: boolean;                // gekaufte Assets nur lokal
  maker?: { allowed: boolean; cost: number };
}
catalog.query({ kind, skin, biome, text, profile }) → CatalogEntry[]
```

- Der Librarian besitzt die Einträge. Das Lab liest nur. Reihenfolge der Quellen nach V-070.
- Erst Pack-Index laden, Zeilen später (20 MB JSONL ist zu schwer) [doc BACKBONE §4].
- Weitere Quellen hängen sich ein: `rhythm-props.json` (V-172), Clip-Katalog `kfb.clip-catalog.v1` für Bewohner, RKIT-Teile `kfb.rkit-parts/1`.

### 7d · Spiel-Adapter

```ts
interface PlayMode {
  id: 'walk' | 'drive' | 'god' | 'maker';
  enter(world: World, scene: BuiltScene, spawn: Spawn): void;
  step(dt: number): void;     // fester Schritt, Audit §3
  exit(): void;
}
```

- `walk` = vorhandener Travel-Core J17 [code `play/travel.ts:43`].
- `drive` = k2b auf dem Stream aus `compileGraph` [code `play/drive.ts:217`].
- `god` = Orbit-Kamera + Editor [code `main.ts:430`].
- `maker` = `god` mit Maker-Profil und Spielkamera-Grenzen.
- Adapter lesen Welt und gebaute Szene. Sie schreiben nie ins Rezept. Spielzustand geht in `PLAYER_SAVE` (später).
- Kamera, Licht, Himmel bleiben einzelne Besitzer (V-042, V-132).

### 7e · Rechte je Modus `kfb.mode-profile/1` (Vorschlag)

| Feld | god | maker | player |
|---|---|---|---|
| erlaubte Befehle | alle | `place.*`, `pattern.stroke`, `paint.stroke`, `terrain.stroke` (sanft), `track.point/attach` nur mit Snap | keine |
| Katalog | alles | `maker.allowed = true`, keine lokalen gekauften Assets | – |
| Bereich | Welt | eigener `plot` | – |
| Budget | Warnung | hart: Dreiecke, Draw Calls, Teile, Streckenlänge | – |
| Prüfung vor Speichern | Warnung | Pflicht | – |

Zahlen für Budgets gibt es schon: Natur ≤ 16 Calls und ≤ 120 k Dreiecke je Pass [doc KFB_TECHNIK §5]; Lieferschranke ≥ 30 fps (V-115).

### 7f · Eine Validierung

`validate(world, profile)` ruft vorhandene Prüfungen, keine neuen:
- Rezept-Sperrliste und ein Primär-Deck [code `recipe.ts:45–49`];
- Track Core `runChecks` und `trailChecks` [code `track-core.mjs:2319`, `:2747`];
- offene und nicht-mannigfaltige Kanten [code `world/organ/mesh-check.ts`] (V-112, V-136);
- Maßstab K2, Figuren nie skaliert (V-060);
- Orts-Beziehungen [code `scene-study.ts` `checkStudy`];
- Leistung (V-115).

---

## 8 · Maker-Insel (spätere Phase)

**Einordnung:** Nach dem MVP. Das Register stellt Maker nicht in den MVP. Spieler-Inseln stehen bei Phase G [doc Plan R1 §1 G] und bei V-051 („ein Generierungsschritt … Spieler“). Die Review ordnet „Holographic World Foundry, private Inseln“ als P4 nach dem Gott-Modus ein [doc REVIEW §3, §5]. **Achtung Begriff:** V-110 und V-120 (b) meinen eine Protopia-Farm- bzw. eine Maker-Space-**Insel** in der Welt. Ob dort Spieler bauen, ist nicht entschieden (Frage 1).

Was Maker über den Editor hinaus braucht (alles **Vorschlag**):
1. **Spieler-sichere Teilmenge:** Maker-Profil (§7e). Kein freies Terrain-Formen der Inselbasis (V-136, V-167: Körper modelliert Blender). Nur sanfte Pinsel auf der Oberseite.
2. **Snap statt frei:**
   - an Strecken-Sockel aus Track Core (Anschluss-Arten V-099, Skins V-145/V-152);
   - an ein Raster: Hex (vorhanden: `hex-grid.js`, Hex-Hub) oder Mauer-Rastermaß (V-105);
   - Erdung aus `grounding.ts`.
3. **Budgets** hart (Dreiecke, Calls, Teile, Streckenlänge), angezeigt im HUD-Stil (V-040).
4. **Validierung** Pflicht vor Speichern und Teilen (§7f), plus Fahr- und Fußtest-Autopilot für Strecken (V-125, V-159), damit keine Löcher entstehen.
5. **Parzellen:** `plots` in der Welt-Hülle. Ein Spieler schreibt nur in seine Parzelle.
6. **Teilen:** Befehls-Log oder Rezept als Datei. Ob und wo öffentlich, ist offen (Frage 4). Gekaufte Assets nie (V-071).
7. **Spielstand getrennt:** Was ein Spieler baut, ist Rezept. Was er besitzt (Fluff, Karten), ist `PLAYER_SAVE` [doc REVIEW §2].
8. **Weltlogik:** Jedes Maker-Teil braucht eine In-World-Geschichte (V-015). Kandidat: die Maker-Space-Insel als Werkstatt (V-110). Nur mit Georgs Ja.

---

## 9 · Reihenfolge

### 9a · Ohne geteilten Lab-Dev-Server (Doku, Verträge, kleine Prototypen auf eigenem Port)

1. **Vertrags-Dokument R1** (`WORLD_CONTRACT_R1.md` + JSON-Schemas): `kfb.world/1`, `Op`, `kfb.mode-profile/1`, `CatalogEntry`. Nur Text. Steuerung prüft gegen V-141, Review §4.
2. **Delta-Liste Ist → Vertrag:** `WorldSpec` vs. `kfb.island-config/1` vs. `kfb.world/1`; `scene-study` /1 → /2; `edits[]` nie gefüllt; `nodes`; `layout`. Reines Code-Lesen.
3. **Befehls-Log + Undo als Node-Prototyp** auf Rezept-JSON (ohne three), mit Tests: zehn Befehle vor und zurück ergeben dieselbe Datei. Eigener Ordner außerhalb des Labs.
4. **Katalog-Adapter-Prototyp** (Node oder Seite auf eigenem Port, z. B. 5196): Librarian-Pack-Index + K2-Faktoren → `CatalogEntry[]`, Filter je Profil. Nur lesen.
5. **WB2-Strich → `edits[]`:** Adapter-Test in Node gegen `terrain-sculpt.js` (rein, ohne Szene). Ergebnis: Format für `terrain.stroke`.
6. **Strecken-Neubau-Messung** (eigener Port, Worker): einen Kontrollpunkt im Graph verschieben → `compileGraph` → Zeit. Quelle: Kopie aus `~/Developer/rkit-r3/trackcore`, nicht aus dem Lab-Vendor. Abnahme wie Audit Nr. 10 (< 100 ms).
7. **Flag- und Host-Karte:** alle ~124 Query-Parameter mit Datei, Modus, WIP ja/nein, aus dem Code gelesen. Grundlage für `flags.ts` (Audit Nr. 9).
8. **Maker-Profil-Entwurf** mit Budget-Zahlen aus KFB_TECHNIK §5 und V-115. Nur Text, wartet auf Georgs Antworten (§10).

### 9b · Braucht die Lab-Bau-Sitzung (nach V-171 Punkt 1–3)

1. `flags.ts` und Aufteilung `main.ts` in Hosts (walk, drive, god), hinter Parity (Audit Nr. 9).
2. `kfb.world/1` laden und speichern; Migration aus `kfb.worldbuilder.v1`; `scene-study` /2.
3. `applyOp` als einziger Schreiber in `editor.ts`; Undo-Stapel.
4. Welt-Layout und Anordnungs-Gizmo (Phase D).
5. Terrain-Pinsel und Terrain-Maler in `IslandField` (Phase F).
6. Katalog-Overlay mit Snap und Erdung (Phase F).
7. Strecken-Editor mit Chunk-Neubau (Phase E).
8. Parity um „Speichern → Neuladen → gleiche Welt“ und „Undo × n = Ausgang“ erweitern.

Höchstens zwei Baustellen gleichzeitig (V-005). Vorlage-zuerst-Zeile je Schritt (V-001).

---

## 10 · Offene Fragen an Georg (über die Steuerung)

1. **Maker-Insel:** Meinst du die Maker-Space-Insel aus V-110/V-120 als Ort, an dem Spieler bauen? Oder einen allgemeinen Bau-Modus auf eigenen Inseln?
2. **Maker-Umfang:** Dürfen Spieler Gelände und Strecke ändern? Oder nur Teile auf ein Raster setzen?
3. **Maker-Raster:** Hex (wie der Hex-Hub) oder frei mit Snap an Strecke und Mauer-Raster?
4. **Teilen:** Bleiben Maker-Bauten lokal? Oder werden sie veröffentlicht, mit deiner Freigabe?
5. **Eine Welt-Datei:** Ist eine Hülle `kfb.world/1` mit allen Teilen ok? Oder lieber eine Datei je Insel plus Layout?
6. **Speichern:** Reicht localStorage plus Export für den God-Mode? Oder sollen Welten als Dateien im Repo bzw. Hub liegen?
7. **KFB World Studio MVP1** (GPT-Site, 401): Was ist das, und ist es ein Spender für den Editor?
8. **Maker im Spiel:** Soll der Maker-Modus wie der God-Mode per Schalter im Spiel laufen? Oder als eigene Seite?

---

### Anhang · Zählung

- Lab-Module: 38 (§3, Nr. 1–38).
- Spender außerhalb: 24 (§4a 11, §4b 6, §4c 10, minus 3 Doppelnennungen mit dem Lab: R2D, Organ-Inseln, HUD).
- Live-Seiten: 16 Zeilen in §5 (inkl. Combat Arena auf eigener Domain); GPT-Sites nicht mitgezählt.
