# HOUSEKEEPING · living (Stand 2026-10-01)

## CLAY GATE FACADE-A/B-01 (Session 2026-10-01)
| Artefakt | Status |
|---|---|
| `KFB Clay Gate FACADE-AB-01 · building_A.dc.html` · `golden/facade-ab-01.js` | AKTIV · Gate-Bühne SOURCE · GOLDEN · CANDIDATE |
| `golden/k1/lab-clay/*` · `golden/k1/ref/` · `golden/k1/screenshots/` | ASSET · 1:1 aus KFB_K1_H0_CODEBASE_2026-09-29 (work/clay-style-ssot-2026-10-01) |
| `returns/FACADE-AB-01_2026-10-01/RETURN.md` | Rückgabe · R2A = TUNE, v10-Parität = MATCH (Georg 01.10.) |
| `lab-world/shadow-fit.v1.js` | AKTIV · **geteilt** (Gate, R2A/R2B) · LESSONS_SHADOWS-Rezept: fitShadow (Prop) + makeShadowFollow (Welt) |

## WORLD CORE R2C · Hex-Archipel Katalog (Session 2026-10-01)
| Artefakt | Status |
|---|---|
| `KFB World Core R2C · Hex-Archipel Katalog.dc.html` | AKTIV · CANDIDATE · Bau-Logik nach KayKit-Promo/Nature Usage Guide |
| `lab-world/hex-archipel.r2c.js` | AKTIV · neu (Basis r2a) · 28/28 KayKit-Teile, Atlas→Palette-Bake, Höhenstufen (hex_grass + bottom, sloped_high als Rampe, hill_single als Polster), Strecke Mindestradius 22 m + Streifen 4,5 m je Bordkante |
| Katalog KayKit Medieval Hexagon Pack 1.0 FREE (main) | vollständig: tiles 54 (base 5, coast 10, rivers 28, roads 15), nature 42, buildings 5 Farben + neutral, props |
| Quaternius-Berge | in R2C entfernt (brauner Saum) · Asset bleibt in `lab-world/assets/` |

## WORLD CORE R2A · Hex-Archipel (Session 2026-10-01)
| Artefakt | Status |
|---|---|
| `KFB World Core R2A · Hex-Archipel.dc.html` | AKTIV · CANDIDATE · Georg-Review offen (Tweaks: view, mode A/B, seed, fugen, shadows) |
| `KFB World Core R2A · Hex-Archipel.dc.html` | **SUPERSEDED** durch R2B (altes blau-weißes UI) · nicht im Export |
| `lab-world/hex-archipel.r2a.js` | AKTIV · **geteilt** (R2B nutzt es) |
| `lab-clay/*` · `lab-world/sky-core.r0a.js` · `bb-scene.js` | **geteilt** · unverändert konsumiert (K2-Instanzraum-Patch nur lokal im R2A-Modul) |
| `KFB World Core R1A · Tor 1 Cosmos Maquette.dc.html` | AKTIV · Konzept-Quelle (Kosmos-Layout, Ring, Unterbau-Profil) |
| `KFB World Core R2B · Hex-Archipel Atlas-UI.dc.html` | AKTIV · CANDIDATE · Resident-Atlas-Schale (S7), KayKit-Kacheln + Landmarken, GLB-Wolken + Berge |
| `lab-world/assets/clouds-jarlan-perez.glb` · `mountains-quaternius.glb` | ASSET · aus uploads/, im Modul zerlegt (Komponenten), geglättet, normiert |
| KayKit Medieval Hexagon Pack | jsDelivr @main · hex_grass, hex_water, castle_red, church_blue, mine_yellow, windmill_green · Builder Pack 1.0 hat im Repo nur PNGs |
Befund Messlauf in der Claude-Vorschau (Software-Rendering): Bildzeit hängt dort am Knet-Shader, nicht an der Geometrie (Knete aus ≈ 2× schneller, A ≈ B trotz 900 vs 55 Calls). Aussagekräftig nur auf Georgs GPU.

## STOP-REGEL · Fassaden/Baumschatten (2026-09-29 20:00)
Georg: J07–J10 nicht gefixt (Dächer, Fassadenkante, Kronennaht). Nach Brief-Stop-Regel (zwei Fehlpässe) eingefroren. Evidenz `screenshots/0?-j10-diag.jpg`, Georgs Markierungen `uploads/Bildschirmfoto 2026-09-29 um 19.57.09.png`. Nächster Schritt nur mit A/B gegen K1-Standalone.

## JOYRIDE J08–J10 (Session 2026-09-29 abends)
| Artefakt | Status |
|---|---|
| `lab-clay/clay-material.v8.js` | ASSET · K1/H0-Material, unverändert aus KFB_K1_H0_CODEBASE_2026-09-29 |
| `lab-track/transition-atlas.v1.js` | **geteilt** · Hooks houseK1 (bend) + softenHouse je Teil (geoOf), nur mit LEAN-Schalter |
| `export/JOYRIDE_J08…J10_2026-09-29/RETURN.md` | Rückgaben |

## JOYRIDE J07 (Session 2026-09-29 abends)
| Artefakt | Status |
|---|---|
| `ref/clay-joebinns/Fingerprints01_3K.png` | ASSET · aus H0 external/, von T4 erwartet |
| `lab-track/transition-atlas.v1.js` | **geteilt** · additiv softenHouse-Hook (nur mit LEAN-Schalter) |
| `export/JOYRIDE_J07_2026-09-29/RETURN.md` | Rückgabe AKTIV |

## JOYRIDE J06 (Session 2026-09-29 nachts)
| Artefakt | Status |
|---|---|
| `KFB Joyride J05 · Knet-Racer.dc.html` | AKTIV · lädt j06 (Staub, Landung, S5-Gate, Schatten-Prüfung #247) |
| `lab-drive/joyride-drive.j06.js` · `joyride.j06.json` · `kfb-drive.k2.js` (K2b) | AKTIV |
| `lab-drive/joyride-drive.j05.js` · `joyride.j05.json` | FROZEN · Vorgänger |
| `export/JOYRIDE_J06_2026-09-29/RETURN.md` | Rückgabe AKTIV |
| `screenshots/0?-j06-*` | Evidenz/Diagnose · Cleanup-Kandidat |

## JOYRIDE J05 · Knet-Racer (Session 2026-09-29 spät)
| Artefakt | Status |
|---|---|
| `KFB Joyride J05 · Knet-Racer.dc.html` | AKTIV · CANDIDATE · Georg-Review offen |
| `lab-drive/kfb-drive.k2.js` · `lean-pass.l2.js` · `joyride-drive.j05.js` · `joyride.j05.json` | AKTIV · neu |
| `KFB Joyride J04 · KFB-Fahrphysik.dc.html` + `*.j04.*`, `kfb-drive.k1.js`, `lean-pass.l1.js` | FROZEN · Vorgänger |
| `export/JOYRIDE_J05_2026-09-29/RETURN.md` | Rückgabe AKTIV |

## JOYRIDE J04 · KFB-Fahrphysik (Session 2026-09-29 spät)
| Artefakt | Status |
|---|---|
| `KFB Joyride J04 · KFB-Fahrphysik.dc.html` | AKTIV · CANDIDATE · Georg-Review offen (Tweaks: vehicle, world, assist, motorK, profile) |
| `lab-drive/kfb-drive.k1.js` · `joyride-drive.j04.js` · `joyride.j04.json` | AKTIV · neu |
| `lab-track/track-look.v5.js` · `transition-atlas.v1.js` | **geteilt** · additiv LEAN-Dichte-Schalter (aus = unverändert) |
| `KFB Joyride J03 · Knet-Strecke leicht.dc.html` + `lab-drive/*.j03.*` | FROZEN · Vorgänger (Ammo-Physik, Georg: passt nicht) |
| `lab-drive/ammo.js` · `donor-playcanvas/*` | Historie · von J04 nicht mehr geladen |
| `export/JOYRIDE_J04_2026-09-29/RETURN.md` | Rückgabe AKTIV |

## JOYRIDE J03 · Leicht-Pass (Session 2026-09-29 spät)
| Artefakt | Status |
|---|---|
| `KFB Joyride J03 · Knet-Strecke leicht.dc.html` | AKTIV · CANDIDATE · Georg-Review offen (Tweaks: vehicle, world, motorK, profile) |
| `lab-drive/joyride-drive.j03.js` · `joyride.j03.json` · `lean-pass.l1.js` | AKTIV · neu |
| `lab-clay/clay-soften.v1.js` | AKTIV · aus H0 übernommen, unverändert |
| `lab-track/track-look.v5.js` | **geteilt** · additiv `st.fast` (Render ohne Composer) |
| `KFB Joyride J02 · Knet-Strecke fahren.dc.html` + `lab-drive/*.j02.*` | FROZEN · Vorgänger (Georg: nicht fahrbar) |
| `export/JOYRIDE_J03_2026-09-29/RETURN.md` | Rückgabe AKTIV |

## JOYRIDE J02 · Knet-Strecke fahren (Session 2026-09-29 abends)
| Artefakt | Status |
|---|---|
| `KFB Joyride J02 · Knet-Strecke fahren.dc.html` | AKTIV · CANDIDATE · Georg-Review offen (Tweaks: vehicle, world, motorK) |
| `lab-drive/joyride.j02.json` · `lab-drive/joyride-drive.j02.js` | AKTIV · neu |
| `lab-drive/ammo.js` · `lab-drive/donor-playcanvas/*` | ASSET / Lesekopie aus Georgs PlayCanvas-Fork |
| `lab-track/track-look.v5.js` | AKTIV · **geteilt** (T4, J02) · additiv: Innenleben lesbar, hooks, Kamera `extern` |
| `KFB Joyride Atlas M01 · Karte als Welt.dc.html` + `lab-world/joyride-atlas.m01.*` | FROZEN · Konzept-Referenz (Georg: Konzept ok, Ausführung ersetzt durch J02) |
| `export/JOYRIDE_J02_2026-09-29/RETURN.md` | Rückgabe AKTIV |
| `screenshots/0?-j02-*` | Diagnose · Cleanup-Kandidat |

## JOYRIDE MAP / TOY WORLD 01 · Atlas M01 (Session 2026-09-29)
| Artefakt | Status |
|---|---|
| `KFB Joyride Atlas M01 · Karte als Welt.dc.html` | AKTIV · CANDIDATE · Georg-Review offen (Tweaks: lesart, view, sockets, speed) |
| `lab-world/joyride-atlas.m01.json` | AKTIV · Rezept = Wahrheit |
| `lab-world/joyride-atlas.m01.js` | AKTIV · neu |
| `lab-clay/*` · `bb-scene.js` | **geteilt** · unverändert konsumiert |
| `export/JOYRIDE_ATLAS_M01_2026-09-29/RETURN.md` | Rückgabe AKTIV |
| `screenshots/atlas-*`, `screenshots/0?-atlas-*` | Diagnose-Zwischenstände · Cleanup-Kandidat (nicht löschen ohne Freigabe) |

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
