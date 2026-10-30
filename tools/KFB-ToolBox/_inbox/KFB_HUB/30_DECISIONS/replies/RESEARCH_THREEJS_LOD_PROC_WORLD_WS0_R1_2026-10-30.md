# KFB · Three.js / R3F LOD × Instancing × Clay × Shadows · Research/WS0 Intake R1
Stand: 2026-10-30 · Status: SOURCE-AUDITED RESEARCH / INTEGRATION CANDIDATE · **kein Implementierungsauftrag, kein neues V-Urteil**
Empfänger: **WS0** (Steuerung). Produktive Owner bleiben **WS0 `game/proc-world-ws0`** und **WS1 Lead `game/integration-r2`** im privaten Repo `georg-doc/KFB-Stunt-Car-Race`; weitere WS1-Bausteine nur nach WS0 Routing. Existing 3D/Clay/WSB/Asset owner bleibt unverändert.
**WICHTIGE KORREKTUR:** Das laufende prozedurale MVP ist **NICHT gestoppt**. Die historische R4-STOP/NO-MVP-Aussage auf `georg-doc/kayfabizarro#348` betrifft einen separaten alten WB2-Kandidaten und darf nicht als aktueller Spielstatus ausgegeben werden. Aktuelle Wahrheit nach `30_DECISIONS/WS0_STATE.md` §0 und `ws1/status:WS1_STATUS.md` §185.

## 1. Konkreter Anlass / Donor
Georg übergab einen r/threejs Reddit-Text „Big Three.js maps full of trees, rocks, and buildings: a THREE.LOD checklist (and where AI-written LOD code goes wrong)“; Kurzlink: https://www.reddit.com/r/threejs/s/KQ4UUMbO8u
Sechs konkrete Ratschläge: (1) wirklich reduzierte Meshes, grob 100/30/10 % oder Impostor; (2) Distanz nach Screen-Pixeln, nicht blind; (3) `LOD.addLevel(mesh,distance,hysteresis)`; (4) korrekte Update-/Matrix-Pfade; (5) Instancing/Chunks statt Tausenden Object3Ds; (6) separate Schattenbudgets. Erfolg anhand echter `renderer.info.render.triangles` messen. Dies sind **Donor-Heuristiken**, keine KFB-Freigabe oder universal gültige Schwellen.
Offizielle, 30.10. geprüfte API-Quellen:
- https://threejs.org/docs/pages/LOD.html — `autoUpdate` default true; `addLevel` hysteresis = Bruchteil der Schaltentfernung; `update(camera)` wenn AutoUpdate false.
- https://threejs.org/docs/pages/BatchedMesh.html — `perObjectFrustumCulled`, `setVisibleAt`, Instanz-/Geometrie-IDs.
- https://threejs.org/manual/pages/how-to-update-things.html — `matrixAutoUpdate=false` verlangt Matrixpflege, deaktiviert nicht per se LOD.
- https://gltf-transform.dev/modules/functions/functions/simplify — `weld` + `simplify`, ratio nur Ziel; Error-Grenze kann früh stoppen.
- Reddit-Beitrag: nur von Georg gelieferter Text, keine unabhängig getestete Implementierung.

## 2. IST-Bestand aus aktuellen GitHub-Sourcen — nicht neu bauen
**Aktives Spiel, private Quellen gelesen am 30.10.**
- `georg-doc/KFB-Stunt-Car-Race`, WS0-Branch `game/proc-world-ws0@72fbb25d08aad1e7d669203c7b0e85ce9f69934c`; WS1-Integration `game/integration-r2@072cf3d05de4eb63f5dfb58559a8ece02e0c88a9`; zukünftige Umsetzung jeweils auf *neu gelesenen* Heads.
- `src/world/endlessVeg.js` auf WS0-Branch: **globaler `THREE.BatchedMesh` je Kategorie**, feste 64-m-Weltzellen, `perObjectFrustumCulled = !!options.cull`, `frustumCulled=false` wegen sich bewegender Batch-Objekte; dynamische `addInstance`/`deleteInstance`, Instanzfarben. **Nicht** pauschal als `THREE.InstancedMesh` oder als per-Chunk-LOD behaupten. Culling-Befund ist kandidatenspezifisch, Schatten/Bounds/CPU prüfen.
- `src/start/quality.js` und `src/start/QualityDpr.jsx`: existierende `fast`/ `standard`/ `sharp` DPR-Stufen, automatische Standard-Regel nach 2-s-Fenstern (2× >22ms herunter; 10× <14ms hoch); ausdrückliche Wahl respektiert. **Nicht** noch einen Auto-Quality-Controller bauen.
- `src/m1/M1Loop.jsx` + `src/hud/hudPass.js`: ein M1-Renderpfad mit separatem HUD-Pass, nicht zwei Renderer. `test/perfMvp.mjs` liest `renderer.info`; **Achtung**: letzter HUD-Pass kann den Weltzähler überschreiben. WSA-Bericht 27.10. maß 14 Calls / 28 Tris nur für HUD statt Welt. Die vollständigen Welt+Schatten+HUD-Zahlen sind noch nicht kausal belegt.
- `WSA_TO_WS0_SINGLE_INSTANCE_FPS_DIAGNOSIS_2026-10-27.md`: im kontrollierteren Einzelinstanz-Test Standard ~15,5–21,5 FPS, Fast ~38,5–44,3 FPS, norender-Teilmenge ~73,8–88,1 FPS. Render-/Auflösungsengpass begründet; **kein identifizierter Shader/GPU-Bottleneck als bewiesene Ursache** und kein p95-60-FPS-PASS. Vergleich auf aktuellem Branch nötig.
**Schon verifizierte Teil-Donoren, aber keine automatische Laufzeitintegration:**
- WS1 `ws1/r3f-frame:WS1_STATUS.md` §121: Amphitheater 349k → 59k Tris (gltf-transform weld + simplify 0.17), 11,7 → 2,8 MB; gleiches Bild 16–75 m, Szenen-Tris 1,82 → 1,21 Mio. Dieser assetseitige Erfolg ist kein Nachweis eines generischen `THREE.LOD`-Switchers.
- `kayfabizarro:media/3D_Assets/WSB_BLENDER/B7/RETURN.md`: Meshy-Source 7 Mio Tris → Browser 80k und LOD1 25k; detailgeschützte Decimation + Normals-Bake (Gitter/Linse/Tastatur). LOD1 rund 31,25 % von 80k, Qualität bei festgelegter Ansicht prüfen.
- `kayfabizarro:travel/travel-v16/terrain-v16/prop-scatter.js`: globales Instancing pro Modellteil statt pro Chunk; vorhandenen Draw-Call-Benefit gegen neue Regional-Batches **messen**, nicht blind ersetzen.
- `kayfabizarro:tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/docs/ARCHITECTURE.md`: LOD0–3 aus einer BuildingRecipe, merged chunk shells, Instanzen, 64-m-Ringe. **POC-DONOR, nicht Runtime-Owner**; keine Übernahme eines zweiten Welt-/Straßen-/Clay-Systems.
- `kayfabizarro:skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`: K2/v10 triplanar/rest-space relief reduziert Mikrodetails bereits über Pixel-Footprint; K1/H0 Golden gilt. Bestehenden Material-Owner verwenden, keine parallel erfundene Clay-LOD-Pipeline.
- Visual Terrain Lab: Terrain-Clay-Fragment-Shader war dort teurer als die Geometrie. **Nicht unkritisch** auf den heutigen WS0-Spielstand übertragen; dort erneut profilen.

## 3. Technische Einordnung: welche LOD-Methode wo?
| Family | Near | Mid | Far | geschützte KFB-Wahrheit |
|---|---|---|---|---|
| Bäume/Büsche | source treu + Clay | echte Simplify-Variante | Impostor/vereinfacht/Cull A/B | deterministische Platzierung, Farbe, Fluff-Nester und Shadow/Contact |
| Steine/Felsen | source Mesh | Low-Poly, Detail-gewichtete Decimation | Chunk-/Silhouette-Mesh oder Cull | Bodenkontakt, Kontur, Palette |
| Häuser/City Blocks | Originalfamilie mit Türen/Fassade | Shell / HLOD | zusammengefasste Skyline | stabile WorldObject-ID, Interaktion, Story-Anker, Save, keine Fassade als Platzhalter für kanonische Quelle |
| Landmark/Story Prop | freigegebenes Original | erkennbare Silhouette | silhouette-sicheres LOD | Bild/Schrift/Karten-Slot/Anker, Golden |
| Residents/Characters | Originalrig + Augen/Mund | nur source-geprüfte niedrigere Darstellung | Impostor/Cull *nur wenn sozial nicht relevant* | aktive Begegnung, Animation, Gaze, EyeRig, PetMouth, Interaktion |
| Kleinkram | Original | vereinfachte Instanz | Cull nach Erkennbarkeit | Fluff- und Sammelstatus; keine verschwundenen Interaktionsobjekte |

Wichtige Arbeitshypothesen:
A. **Geometrie-LOD** ist nicht dasselbe wie **Material-LOD** (K2 Near-Detail/texture fetch, shader variants), **Shadow-LOD** (caster-relevant only; eigene Schattenfrustum und Kontakt) oder **Streaming/Culling**. Profiling muss jedes Budget getrennt ausweisen.
B. `THREE.LOD` pro Hero-/Landmark-Objekt sinnvoll, **aber** tausende individuelle LOD-Object3Ds kosten Traversal. Für bereits batched Vegetation zunächst globale `BatchedMesh`-Instanzen mit räumlichem Level-/Visibility-Management vs. regionale Batches benchmarken. Kein Wechsel zu `InstancedMesh` aus Routine.
C. Hysterese bei `THREE.LOD.addLevel(mesh, distance, hysteresis)` ist **Anteil** der Schaltentfernung (z. B. 0.10 = 10 %), nicht „10 m“. Für `BatchedMesh` muss die Hysterese in bestehender Chunk-/Instance-Zustandslogik selbst geführt werden.
D. Für wahrgenommene Pixelgröße: projected bounding sphere / AABB, tatsächlicher vertikaler FOV, Viewport-Höhe (CSS-Pixel vs. DPR-Backbuffer *explizit wählen*), Objektklasse. 100/30/10 %-Tris und Pixelband-Grenzen sind **Startwerte für A/B**, keine verbindlichen Schwellen. 1440×900 + DPR1/1.25 + Hoch-DPI/Phone, Kamera FOV/Zoom, Ground/Drive/Flight testen.
E. `LOD.autoUpdate=true` ist der Default, falls klassisches `THREE.LOD` wirklich verwendet wird; bei `false` explizites `lod.update(camera)` vor Render. `matrixAutoUpdate=false` allein deaktiviert es nicht, falsch/stale MatrixWorld bei bewegtem Root/Origin aber verfälscht die Distanz.
F. Schatten dürfen in fernen Levels reduzierte Caster oder gar keine Caster verwenden **sofern** keine harte Kontakt-/Schattenkante oder visuelle Goldens verletzt werden. Szenenlicht bleibt ein Owner.
G. Sicht/Rendering von Weltobjekten ändern **nie** authoritative Kollision, World-Recipe IDs, Schadenszustand, Karten/Almanach oder Simulation. Kein zweiter Terrain-/World-Lifecycle-Owner.

## 4. WS0 → WS1 / WSA Integrationsreihenfolge (NICHT jetzt neu beauftragen)
**WS0_STATE §0: V-1041 priorisiert laufenden WS1-Integrationsblock bis So 01.11. 20:00.** Dieses Research-Dokument soll diese Reihenfolge nicht überholen. Nach dem Block ist Architektur-Seite + Mess-Spike Stadt/Gelände/Zerstörung/Fluff/Rauch (V-1042/V-1043) bereits vorgesehen. **Dort einhängen**, statt eigener großer LOD-Welle.
1. **Owner-/API-Audit auf aktuellstem privaten Spiel-Head**. WS0: `game/proc-world-ws0` vs `game/integration-r2` und WS1 Sync prüfen. Quelle `endlessVeg.js`, `EndlessDrive.jsx`, `QualityDpr.jsx`, `M1Loop.jsx`, HUD, `test/perfMvp.mjs`. Je Family `KEEP / ADAPT / HOLD`, mit realer Quelle, Tri-Budget, Materialpfad, Schattenpfad, Instancing, Colliders, Kosten.
2. **Messgrundlage reparieren, bevor LOD als „wirkt“ gilt.** Einmal pro Gesamtframe oder ausdrücklich per Pass `renderer.info` ohne HUD-Reset-Verfälschung; Baseline je Render-/Shadow-/HUD-Pass und Gesamt, Calls, Tris, sichtbare Instances, CPU frame, GPU (nur falls messbar), p50/p95 ms, FPS, Speicher, Loader/Compile-Spikes; gleiche Kamera/Seed und Quality.
3. **Billiger Vergleichs-Slice**: (a) ein vorhandenes B7/Amphitheater-Asset mit zwei echten GLBs, (b) eine Baumfamilie aus `endlessVeg` oder `kfb-place`, (c) eine Gebäudefamilie aus akzeptiertem Donor. Vorher zeigen: Original in Isolation bei fixen Kameras, danach Varianten. Kein generisches Ersatzobjekt.
4. **Für die bestehende Vegetation** erst A/B: aktuelles globales `BatchedMesh` mit Culling OFF vs. explizit korrekt begrenztem perObject-Frustum Culling, ggf. Distanz-/Region-Groups. Aus 27.10.-Report bekannte `EndlessDrive`-Optionen erneut verifizieren; bewegte Bounds, Kamera-Rand, Schattenkamera und Chunk-Recycling testen. Wenn keine messbare Verbesserung, KEEP.
5. **Material-/Shadow-LOD nur nach Profiling**: kontrollierter Near/Mid/Far-K2-Mikrodetail-Pfad und shadow caster policy gegen identische Golden-Kameras, kein eigenständiges neues Knete-/Licht-Rig.
6. **Nicht-invasive Runtime-Integration** nur auf von WS0 bestätigtem aktuellen Produktbranch, reversibel hinter Schalter, ohne neue Site oder WB2-R4. Bestehendes QualityDpr respektieren; erste Integration erst nach dokumentiertem KEEP/ADAPT- und Baseline-Gate.

## 5. Messmatrix und ACCEPTANCE (Vorschlag, keine neuen V-Nummern)
- Fixtures: `world=endless,veg=cartoon,look=terrain3,seed=4711` **nur sofern auf aktuellem Build gültig**, plus Gegenprobe `veg=core`/`theme=1` nach belegtem neuesten Stand. Gleiche Biome, Kamera, Sicht, Asset-Familien.
- Bewegungen: Ground/Walk, Racer/Drive, Jetpack/Flight, stehende Kamera ± Schwelle, schnelle Wende, Biome-Übergang, Rückkehr zum selben Ort, Save/Reload/Seed-Replay.
- Ansichten: Nah, Mid, Fern, Horizont/Skyline; Default+Fast+Sharp, 1440×900 und Phone-Auflösung soweit verfügbar; **ein** fokussierter Render-Tab, keine parallele relevante GPU-Last.
- Automatisiert: Tri/Call wirklich sinken, Stufen tatsächlich verschieden, LOD wechselt in beiden Richtungen, Hysterese verhindert Flip-Flop, korrekte Kamera-/Root-/Origin-Matrix, Batch-Instanz-/Visible-Zahl, keine stale Draws, kein Ressourcen-Leak bei 10× hin/zurück, Schatten/Contact ohne deutliche Popping-Artefakte; Ausgangs-/Endstatus und deterministische IDs unverändert.
- Visuell: KayKit/KFB Quellform + K1/H0-Knete-Standard, Kontur und Farbhierarchie, echte Landmark-/Karten-/Prop-Anker, keine springenden Fluff-Nester, keine sichtbar flatternden Bäume, kein Shadow-Discontinuity. 3 feste Screens je Asset (+ optional 15-s Flugclip), Original isoliert und integriert.
- Vergleich als gleiche Route/Seed/FOV/Qualität: Baseline vs. Culling vs. Geometry LOD vs. Shadow LOD vs. Material LOD; Einzelmaßnahmen und zusammen, jeweils Tris/Calls/CPU/GPU falls vorhanden/p95 Bildzeit. `<16.67ms p95` nur dann als 60-Hz-Ziel, wenn auf Zielgerät unter korrekten Messbedingungen tatsächlich bewiesen. „Weniger Tris“ allein = **kein FPS-PASS**.
- Negativproben: 3 identische „LOD“-Meshes, `LOD.autoUpdate=false` ohne Update, stale transforms, HUD-only renderer.info, hohe LOD-Mesh-Tri trotz Shift, LOD-Ausschluss aus Caster-Pass, Batch-Objekt sichtbar außerhalb Kamera, Flicker 0°/90° Rand, verschwundene interaktive Props.

## 6. Owner-Vertrag, Aufwand und Entscheidung
**P0 jetziger Integrationsblock:** nicht stören; keine neue Baustelle V-1041.
**P1 im ohnehin geplanten V-1042/V-1043 Performance/Arch-Spike:** belastbares Gesamtframe-Telemetrie- und Asset/Vegetation-A/B. Falls GPU/FPS erweist, dass Geometrie kein Engpass ist: **HOLD LOD**, priorisiere aktuelle Qualität/Shader/Fillrate.
**P2 bedingt:** HLOD/Impostor/LOD-Streaming nur bei messbarem Nutzen und sichtbarer Quellparität.
WS0 allein plant Priorität/Brief-Gate und setzt eine neue V-Nummer, wenn Georgs Entscheidung oder neuer verpflichtender Produktvertrag nötig wird. WS1/WS1b als produktive Consumer, WSB/Asset-Librarian für genuine GLB-Level, bestehende Clay- und Lichtowner für Materialien/Schatten. Kein zweiter Runtime-Writer; keine neuen Clips, Shader-Owner, geschützten Branch-Merges, Public-Site- oder Live-Claims.

**Ein nächstes Gate:** `WS0_LOD_TRIAGE_IN_V1042_V1043` — WS0 nimmt den Research-Input nach dem aktiven Integrationsblock in den vorhandenen Mess-Spike auf, prüft den dann aktuellen Spielstand und entscheidet `KEEP / ADAPT / HOLD` pro Asset-/Renderer-Naht. Dies ist keine zusätzliche Georg-Frage.
