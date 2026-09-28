# HOUSEKEEPING · living (Stand 2026-09-28)

## T4 · Markierung M2 (Session 2026-09-28 abends)
| Artefakt | Status |
|---|---|
| `KFB Markierungen M2.dc.html` · `lab-track/road-markings.m2.json` (v2.2.0) | AKTIV · CANDIDATE · Georg: für jetzt ok, Tune-Pass offen |
| `lab-track/road-markings.m2.js` | AKTIV · neu (T4-Markierungsbau) |
| `lab-track/transition-atlas.v1.js` · `track-look.v5.js` · `KFB Knet-Strecke T4.dc.html` | AKTIV · additiv auf M2 umgestellt, M1-Fallback |
| `KFB Markierungen M1.dc.html` · `lab-track/road-markings.m1.json` · `.m1.js` | FROZEN · Verlauf, m1.js weiter **geteilt** (runoutY, KFB_BLEND_GLSL) |
| `export/KFB_T4_M2_CUT/` + `export/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1.zip` | Rückgabepaket AKTIV |
| `screenshots/0?-m2-*`, `0?-m1*`, `t4-m2-*`, `0?-t4-m2-check` | Diagnose-Zwischenstände · Cleanup-Kandidat (nicht löschen ohne Freigabe) |

## T4 · Knet-Strecke Übergangsatlas + Clay-VFX (Session 2026-09-28)
| Artefakt | Status |
|---|---|
| `KFB Knet-Strecke T4.dc.html` | AKTIV · CANDIDATE · Georg-Review offen (Tweaks: world, vfx) |
| `lab-track/track-look.v5.js` · `transition-atlas.v1.js` · `transition-profiles.v1.json` | AKTIV · neu, additiv |
| `lab-vfx/clay-vfx.v1.js` · `clay-particle-profiles.v1.json` | AKTIV · neu |
| `KFB Knet-Strecke T3 v2.dc.html` · `lab-track/track-look.v4.js` · `lab-clay/*` | AKTIV · **geteilt** (T3 v2, T4) · unverändert |
| `export/KFB_TRACK_T4_TRANSITIONS_VFX_2026-09-28/` | Rückgabepaket AKTIV (START_HERE, RETURN, DESIGN_SPEC_T4, SOURCE, CHANGELOG, evidence/, Code-Kopien) |
| `screenshots/t4-*`, `screenshots/0?-t4-*` | Diagnose-Zwischenstände · Cleanup-Kandidat (nicht löschen ohne Freigabe) |

## WORLD-INTEGRATION-01 · r2 Continuation (Session 2026-09-25 Abend)
| Artefakt | Status |
|---|---|
| `KFB WORLD-INTEGRATION-01 · Hürth.dc.html` | AKTIV · CANDIDATE r2 · Georg-Review offen (Tweaks: world, motionSet, walkCadence, paceUp, sprint) |
| `tools/KFB-ToolBox/worldbuilder/world-integration-01/wi1-actor.js` · `wi1-play.js` · `wi1-world.js` · `wi1-selftest.js` | AKTIV · r2 (Lokomotion-Consumer, Gait Governor, Zonen, Support, Ink-Probe, 55 Assertions) |
| `wd1-city.js` | AKTIV · **geteilt** (WB-D1/WB-D2 Shell + WORLD-INTEGRATION) · r2 additiv: FACE_NORMALS (Wände ohne Deckel), HOST SUPPORT (`out.support`), `out.detailMeshes` |
| `tools/KFB-ToolBox/worldbuilder/wb2-design-01/wb2d-app.js` | AKTIV · **geteilt** · r2: Zonenwahl, `WORLD.groundAt`, `WORLD.onTerrain()` nach Stroke, Fakten |
| `wd1-landmark.js` · `fixtures/cologne-dom-crop-v0.json` · `fixtures/huerth-alstaedten-v0.json` | AKTIV · jetzt auch im WorldBuilder-Weltprofil gelesen (unverändert) |
| `returns/WORLD-INTEGRATION-01_2026-09-25_r2/` | Rückgabepaket AKTIV (Session Cut r2) |
| `returns/WORLD-INTEGRATION-01_2026-09-25/` | FROZEN · r1-Rückgabe (Referenz) |
| `screenshots/wi2-*`, `screenshots/0?-wi2-*` | Evidence r2 · Auswahl im ZIP unter `evidence/` · Rest Cleanup-Kandidat |
| `screenshots/wi2-diag*.jpg` | Diagnose-Zwischenstände · Cleanup-Kandidat (nicht löschen ohne Freigabe) |

## WORLD-INTEGRATION-01 (Session 2026-09-25)
| Artefakt | Status |
|---|---|
| `KFB WORLD-INTEGRATION-01 · Hürth.dc.html` | AKTIV · Human Gate offen |
| `tools/KFB-ToolBox/worldbuilder/world-integration-01/*` | AKTIV |
| `tools/KFB-ToolBox/worldbuilder/wb2-design-01/wb2d-app.js` | AKTIV · **geteilt** (WB2 Terrain Editor Design + WORLD-INTEGRATION-01), Welt-Profil nur mit `world=` |
| `returns/WORLD-INTEGRATION-01_2026-09-25/` | Rückgabepaket AKTIV (RETURN, base/) |

Status: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET` · **geteilt** = von mehreren Deliverables importiert

## Cologne World Shell · WB-DESIGN-PARALLEL-01 (Session 2026-09-24, Abend)
| Artefakt | Status |
|---|---|
| `KFB WB-D1 · Cologne World Shell.dc.html` | AKTIV · Kandidat, Georg: „sieht toll aus“ |
| `wd1-boot.js` · `wd1-seam.js` · `wd1-city.js` · `wd1-landmark.js` · `wd1-water.js` | AKTIV |
| `fixtures/cologne-dom-crop-v0.json` | AKTIV · eingefrorene Fixture (dom-zentrum-v0 @2ff8b350, Crop + Hbf-Block + Schienen) · 0,4 MB |
| `fixtures/huerth-crop-v0.json` | AKTIV · eingefrorene Fixture (huerth-v0 @c049cae386e1, voller Clip ±350 m) · 0,25 MB · S1.1 |
| `tools/osm-city-lab/data/huerth-v0/{PROVENANCE,SOURCE_SPEC}.json` | Quellbeleg (Lesekopie) |
| `w0-region.js` · `w0-ink.js` | AKTIV · **geteilt** (WB-W0, WB-D1) — unverändert |
| `returns/WB-DESIGN-PARALLEL-01_2026-09-24/` | Rückgabepaket AKTIV (RETURN, SOURCE, CHANGELOG, HANDOVER_WSA, BACKLOG_SPRINTS, START_NEXT_CHAT, evidence/) |
| `export/SESSION_2026-09-24_WB-D1/` | Export-Staging (nur Manifest-Dateien) |

### Clean-Run-Checkliste WB-D1
- [ ] 03 SHELL lädt, Dom (Move) ausgewählt, Log ohne ✗
- [ ] details → Water · settings: „wasser-texturen · dudv+map geladen“, Preset-Wechsel river CZ2 scaled/source/OC
- [ ] details → Landmark override: Dom und Hbf VALID, Basis „hidden (validated)“
- [ ] Hbf ohne Stirnwände/Plinthe, Gleise unter der Halle scharf
- [ ] 01 FIXTURE neutral, 02 LANDMARK Donor ⇄ KFB, Beschriftungen vollständig
- [ ] Socket-Tag bleibt im Bild, Ghosts standardmäßig aus

## WorldBuilder (Session 2026-09-24)
| Artefakt | Status |
|---|---|
| `KFB WB-W0 · World Scale + Traversability.dc.html` | AKTIV · Kandidat, Georg: Konzept/Anmutung gut |
| `w0-boot.js` · `w0-region.js` · `w0-globe.js` · `w0-actor.js` · `w0-ink.js` | AKTIV |
| `returns/WB-W0_2026-09-24/` | Rückgabepaket AKTIV |
| `KFB WorldBuilder v1.dc.html` · `wb1-boot.js` · `wb1-planet.js` · `wb1-sky.js` · `wb1-buildings.js` · `wb1-actor.js` | FROZEN · `HUMAN_REJECTED_FOUNDATION` — Failure-Evidence |
| `returns/WORLDBUILDER_V1_2026-09-24/` (POST_MORTEM, NEXT_GATE, evidence, code) | FROZEN |
| `SESSION_CUT_2026-09-24_WB-W0.md` | AKTIV |
| `wd-registry.js` · `wd-donors.js` | AKTIV · **geteilt** (WorldDesign Lab, Billboard, WB v1, WB-W0) |
| `bb-scene.js` | AKTIV · **geteilt** (B0 Source Proof, GATE-1-Build, WB-W0) |
| `wd-ink.js` | AKTIV · **geteilt** (WorldDesign Lab; Vorlage von `w0-ink.js`) |

## Clean-Run-Checkliste WB-W0
- [ ] Start: Flug Orbit → Boden, Zonenring Köln, Überblendung 60 → 6 km ohne Farbsprung
- [ ] Gate-Panel: 10/10 PASS, Rampentabelle 0–25° stabil, 30/35° FAIL
- [ ] WALK: WASD/Shift, GothGirl mit Augen, keine Kollision mit Props
- [ ] REPLAY ROUTE RUN / REPLAY DOOR RUN
- [ ] Billboard mit Karte, kein Flackern
- [ ] Konsole ohne seitenseitige Fehler

## Billboard / Media Residency
| Artefakt | Status |
|---|---|
| `KFB Billboard Media Szene · B0 Source Proof.dc.html` | AKTIV · abgenommen 2026-09-24 |
| `bb0-boot.js` | AKTIV |
| `bb-scene.js` | AKTIV · **geteilt** (B0 Source Proof, GATE-1-Build) |
| `KFB Billboard Media Szene.dc.html` · `bb-boot.js` | AKTIV (GATE-1-Build, unverändert in diesem Pass) |
| `returns/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/` | Handover-Paket, WSA Lead Chat |

## WorldDesign Lab
| Artefakt | Status |
|---|---|
| `KFB WorldDesign Lab v1.dc.html` | AKTIV |
| `wd-boot.js` · `wd-view.js` · `wd-look.js` · `wd-ink.js` · `wd-macro.js` · `wd-light.js` · `wd-sky.js` · `wd-terrain.js` · `wd-voxel.js` · `wd-donors.js` · `wd-registry.js` | AKTIV |
| `textures/derek-rgb-ref.png` | ASSET |
| `tools/resident_atlas_s6/lib/atlas.js` | AKTIV · **geteilt** (WhackMan, WorldDesign) · lokale Owner-Kopie |
| `tools/world_atlas/source/lib/kit-lab.js` | AKTIV · **geteilt** (WhackMan, WorldDesign) · lokale Owner-Kopie |
| `wd-material.js` | DEAD (bereits gelöscht, ersetzt durch `wd-look.js`) |
| `returns/WORLDDESIGN_WD0_2026-09-22/RETURN.md` · `SOURCE.json` | SUPERSEDED durch `docs/WORLDDESIGN_LAB_HANDOVER.md` |
| `docs/WORLDDESIGN_LAB_HANDOVER.md` · `docs/CHANGELOG_WORLDDESIGN.md` | AKTIV |

## Cleanup — erledigt 2026-09-23
- `screens/` auf 5 Abnahme-Captures reduziert: `01-v18.png`, `02-v18.png`, `01-v19w.png`, `02-v19w.png`, `v14.png`. ~150 Arbeits-Captures gelöscht.
- `returns/WORLDDESIGN_WD0_2026-09-22/` gelöscht (superseded durch `docs/WORLDDESIGN_LAB_HANDOVER.md`).
- `refs/CapsuleCarl.png`, `tools/KFB-ToolBox/_inbox/KFB Style References/` gelöscht (lagen bereits im Repo).

## Pfad-Hygiene — erledigt 2026-09-23
- `wd-donors.js`: `atlas.js`/`kit-lab.js`-Imports auf jsDelivr-RAW-URLs des Repos umgestellt; lokale Kopien `tools/resident_atlas_s6/`, `tools/world_atlas/` gelöscht.
- WhackMan (`wm-boot.js`, `wm-src.js`, `wm-kit.js`, `wm-recipe.js`, `wm-gate-b.js`) nutzte dieselben lokalen Kopien — beim Löschen mit umgestellt, sonst wäre WhackMan zerbrochen. Geprüft: `KFB WhackMan v1.dc.html` lädt weiter ohne Konsolenfehler.
- **Standalone-HTML: NICHT möglich in dieser Umgebung.** Der Lab hat 11 wechselseitig importierende ES-Module (`wd-*.js`) plus zur Laufzeit geladene externe Owner-Module von GitHub. `super_inline_html` inlined nur HTML-Attribut-Ressourcen; sobald ein Modul selbst wieder `./wd-x.js` importiert, bricht die Auflösung (Blob-URLs haben keine relative Basis) — probiert, Konsole zeigt `Failed to resolve module specifier`. **Produktiv-Anforderung von Georg (23.09.), noch offen:** eine dauerhaft erreichbare Live-Fassung braucht einen echten JS-Build (Vite/Rollup/esbuild) + Hosting — vermutlich Web-Chat → GitHub → Cloudflare, wie bei den anderen WSA-Tools. Nächster Schritt für einen Konsumenten mit Build-Zugriff, siehe Handover §6.

## Backlog (dokumentiert, nicht gebaut)
- `docs/COMIC_CARTOON_BACKLOG.md` — Comic/Cartoon-Ideenliste (Himmel, Farbe, Linie, Material, Kamera, Bewegung, Cel-Shading-SOPs), Georgs Vier-Punkte-Fokus zuerst.
- **UI-Rework „Toolbox-Integration"**: Ziel laut Georg (23.09.) ist BEIDES — der Lab optisch/bedienungsseitig an die anderen KFB-Toolbox-Tools anpassen UND ihn als Eintrag in einer Toolbox-Übersicht (Navigation rein/raus) verankerbar machen. Referenzen für den Look: Roadrunner-Skydome, Hanna-Barbera/UPA-Scenic-Art, Aardman-Claymation, Mario-Kart-Stilisierung — siehe Backlog-Datei §1/§4. Noch nicht begonnen: braucht zuerst eine bestehende Toolbox-Übersichtsseite als Ziel, die aktuell nicht im Repo identifiziert ist.

## Clean-Run-Checkliste
- [ ] Bank startet: 4 Felder, SOURCE ohne Tusche, 1/1 sichtbar
- [ ] CapsuleCarl rot, Augen weiss, kein Geistermund
- [ ] Welt: 31/31 sichtbar, Monstrosity + Auto vorhanden
- [ ] Tusche an/aus, Himmel-Wechsel, Story-Palette, Tageszyklus
- [ ] Konsole ohne seitenseitige Fehler
