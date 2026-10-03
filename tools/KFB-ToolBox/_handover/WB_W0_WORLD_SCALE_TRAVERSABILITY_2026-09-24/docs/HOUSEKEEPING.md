# HOUSEKEEPING · living (Stand 2026-09-24)

Status: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET` · **geteilt** = von mehreren Deliverables importiert

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
