# WB2-Grundlagen für begrenzte Insel-Dokumente — Source-Befund

Evidence Tester, read-only. Richtung laut aktuellem Integratorauftrag: begrenzte Insel-Dokumente in WB2. Keine weiteren Endloswelt-/GPU-Prüfungen, keine Runtime-Änderung, keine erneute Prüfung der neuen Implementierung. **Voller MVP: NO MVP.**

Die folgende Bestandsaufnahme beschreibt vorhandene Schnittstellen und fehlende Beweise. Sie erklärt bestehende Funktionen nicht für integriert oder akzeptiert. Empfangs-HEAD beim Lesen: `98b82377abf60b1404ff06cfff21ed1acc863f1a`; Surface/Track-Adapter enthalten noch uncommittierte Integratoränderungen. Gelesene Dateihashes stehen in `bounded-foundations-source-hashes.json`.

## Vorhandener WB2 Store und Editor

- `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/WORLD_STUDIO_MVP_SOURCE.html:28` lädt den vorhandenen Editor `../wb2-design-01/wb2d-app.js`.
- `worldbuilder/wb2-design-01/wb2d-app.js:283–284`: `STORAGE_KEY` und `DOC_ID` werden aus dem vorhandenen World-Provider übernommen.
- `wb2d-app.js:1002`: `saveDoc()` übernimmt die sichtbaren Objekttransforms über `updateAllRecords()`, ruft `PLAY.writeDoc(sceneDoc)` auf und speichert die gesamte Szene als JSON in genau diesem LocalStorage-Key.
- `wb2d-app.js:1008`: `reloadDoc()` prüft Format/Doc-ID, übernimmt die gespeicherte Szene, normalisiert Sculpt, baut Terrain/Objekte neu und übergibt sie an `PLAY.readDoc()`.
- `wb2d-app.js:1266–1267`: bereits öffentlich sind `mountSceneRecords(records)` und `applySceneDocument(doc)`; ersteres fordert Objekt-ID und Source-Pfad/Commit, zweiteres klont ein passendes Szenendokument und rekonstruiert dieselbe Szene. Der vorhandene `window.__wb2d`-Adapter stellt außerdem `doc`, `STORAGE_KEY`, `DOC_ID`, `EDIT`, `saveDoc`, `reloadDoc`, `terrainHeightAt`, `buildTerrain` und `setPlay` bereit.
- `wb2d-app.js:1281`: der World-Bootpfad liest den LocalStorage-Key frisch. `reloadDoc()` allein ist daher kein frischer Browserstart-Beweis.
- `procedural-test-world-01/wb2-mvp.v1.js:65–81`: die vorhandenen Buttons `Studio speichern`/`Studio laden` exportieren/importieren `kfb.authoring-workspace-bundle/1` mit `scene`. Ein `kfb.player-journey-bundle/1` enthält dagegen nur Player/Memory/World-Referenz und ist kein vollständiger Authoring-Export.
- `procedural-test-world-01/wb2-journey.v1.mjs`: `memoryOf`, `createJourney`, `exportBundle`, `applyBundle` behalten die bestehende Journey-/Card-Referenzstruktur im Szenendokument. Kein Grund für einen zweiten Persistenzowner.
- `tools/KFB-ToolBox/lib/edit-layer.js:29`: `makeEditLayer(viewer,canvas,opts)` besitzt bestehende Auswahl/MRS/Drop/World-Local/Snap-Mechanik. `drop()` ist aktuell ein Raycast gegen andere sichtbare Objekte mit `y=0` bei fehlendem Treffer; die neue Surface-Snap-Anbindung ist dadurch noch nicht bewiesen.

## Vorhandene begrenzte Insel-/Recipe-Schnittstellen

- `procedural-test-world-01/r2d-island-core.v1.js:133`: `makeIslandCore(seed,trackCore,shape='frei')` liefert reines `{schema,source,plan,field}`. `field` bietet `heightAt`, `maskAt`, `weightsAt`; `plan` enthält Insel-SDF/Rand, Pads/Plazas/Wege/Teich/Bach und die Track-RouteRecipe samt kompiliertem Stream. Keine neue Szene/Kamera/Inputschleife.
- `procedural-test-world-01/r2d-archipelago.v1.js:131`: `makeArchipelago(recipeSet,TC)` nimmt `kfb.world-recipe-set/0.1`; Nodes tragen IDs/Seeds/Shape/Position/Anchors, Connections IDs/Endpoints. Rückgabe: Nodes, NodeMap, AnchorMap, Bounds, WorldGraph und Connections mit originaler RouteRecipe und Stream. Jede Insel und jeder CONNECT-Brückenzug benutzt `TC.compileRecipe()`.
- `worldbuilder/world-integration-01/r2d-world.js:171`: öffentliches `prepare(id)` kennt aktuell `r2d3` und `r2d4`. Der zurückgegebene bestehende World-Adapter besitzt `patchDoc`, `baseHeightAt`, `maskAt`, `groundAt`, `mount`, `dressTerrain`, `onTerrain`, `solidAt`; Archipelago zusätzlich `buildingSceneRecords`, `reconcileDoc`, `adoptBuildingObjects` und `archipelago`.
- `r2d-world.js:60`: Einzelinsel-Dokument `r2d-world-<seed>`, Store `kfb-r2d-world.<seed>`. `r2d-world.js:104`: aktuelle Archipelago-Fixture hat festen Doc-ID/Key `kfb-mvp-archipelago-01`/`kfb-mvp-archipelago.01`. Dies sind konkrete wiederverwendbare Adapter, noch keine beliebige Liste benannter Insel-Dokumente.
- `procedural-test-world-01/recovery-document.v1.mjs:4`: `reconcileRecoveryDocument(doc,canonical,recipes)` migriert nur erkannte unberührte generierte Transforms, erhält abweichende Autorenpositionen und dokumentiert Konflikte. Bestehende Migration verwendet eine `.002`-Näheentscheidung; sie ist kein exakter Persistenzvergleich.
- `procedural-test-world-01/r2d-presentation.v1.js:159`: `mountR2DPresentation(...).refreshSurface(heightReader)` projiziert den vorhandenen Höhenleser auf den sichtbaren radialen Inselmesh und passt Nature-Instanzen an. Der WB2 Support-Plane wird ausgeblendet. Unterschiedliche Mesh-Tessellation plus analytischer Support bedeutet: gleiche Höhenquelle ist noch kein Beweis für gleiche Dreiecksinterpolation im Inneren.

## Gemeinsame Surface-/Objekt-/Track-Grundlagen

- `open-world/src/core/surface.ts`: bereits vorhanden sind `surfaceFor`, `heightAt`, `mesh` mit lokalem Vertexbuffer/Origin, Sculpt/Contributions und Invalidierungsmechanik. Der frühere unendliche Lattice-Test wird nicht als Insel-Beweis übernommen; der begrenzte Inseladapter muss dieselbe sichtbare/contact/support Wahrheit belegen.
- `open-world/src/core/objects.ts`: `WorldObjects.register`, `streamOut`, `snapshot`, `restore`, `instanceId` sind vorhandene semantische Mechanismen. `snapshot()` klont Matrizen und sortiert nach ID. `objectsFor` wird aktuell nur nach Seed adressiert; unabhängige Dokumente mit gleichem Seed sind dadurch noch nicht getrennt. `restore()` ergänzt vorhandene Records, leert sie nicht. `register()` behält einen bereits als authored markierten Record auch bei einer späteren authored-Registrierung. Die Authoring-Anbindung muss aktualisierte Transforms ausdrücklich erhalten.
- `open-world/src/owners/track-core/track-core.mjs`: bestehender `CORE_VERSION='kfb.track-core/0.12'`, `compileRecipe`, `compileGraph`, `runChecks`, `runGraphChecks`, `fingerprint`, `slotWorld`. CPU-prüfbar ohne neuen Road-Kern.
- `open-world/src/modules/roads/track-adapter.ts`: aktuelle generierte Road-Intent wird in `kfb.track-core.graph/0.3` mit stabilen Piece-IDs/CONNECT umgesetzt; `compileGraph()` und vorhandene `stream-to-three.mjs`-Baukörper bauen Kontakt/Geometrie. Maps halten Recipe/Stream/Contact und WorldObjectRecords verbinden Segment-ID mit Recipe. Ein Export-/Restore-Vertrag dieser Maps in WB2 Authoring-Dokumenten ist derzeit nicht vorhanden.

## Aktuelle konkrete Lücken und fehlende Beweise

1. Noch kein neuer begrenzter Insel-Dokument-Vertrag erhalten. Vorhandene Rezept-/Store-APIs oben sind Bestandsfunktionen, kein neuer Abschlussnachweis.
2. Im aktuellen Archipelago-Doc wird `world.recipeSet` nur als ID gespeichert und `world.graph` als Zusammenfassung. Der Boot lädt `WORLD_RECIPES.json` erneut; die vollständigen Insel-Recipes/RouteRecipes/Autoren-Overrides sind nicht als rekonstruierbare Dokumentwahrheit bewiesen. `WorldGraph.connections` enthält nur IDs/Owner/Counts/Length, keine vollständige RouteRecipe.
3. Keine dokumentisolierte Persistenz-/WorldObjectId-Prüfung für zwei Insel-Dokumente mit gleichem Seed. Aktuelle Keys sind seedbasiert bzw. feste Fixture-Keys.
4. Kein unabhängiger Save→Tab schließen→frischer Boot→Export-Vergleich der neuen gemeinsamen Grundlagen. Bestehende `updateRecordFromRoot()` rundet Position/Scale auf 4, Rotation auf 5 Dezimalstellen; Sculpt-Normalisierung rundet Punkte auf 4. Vergleich muss die tatsächlich gespeicherte kanonische Präzision vor dem frischen Boot sichern und danach exakt vergleichen, nicht beliebige Toleranz einführen.
5. Sichtbare Inselmesh-Dreiecke gegen Surface Truth/Contact im Inneren, Rand, Road-/Bridge-Seam und nach Raise/Lower wurden in der neuen Richtung noch nicht getestet.
6. Route-Intent→vorhandener Track-Core-Owner ist source-seitig vorhanden, aber ein neues Authoring-Dokument mit stabilen Route-/Piece-IDs und exaktem frischen Reload ist nicht getestet. Bestehende lokale Road-Maps sind kein Persistenzbeweis.
7. Wiederverwendbare Grundfunktionen sind keine Gesamtproduktfreigabe. Historische Tests, Original-Screenshots und frühere große-Koordinatenbefunde bleiben getrennt archiviert.

## Vorbereiteter nächster CPU-/Persistenznachweis

Warten auf Integrators neue Implementierung und exakt benanntes HEAD/Schema. Danach nur:

- Snapshot/Hashes des tatsächlichen Insel-Dokument-/Surface-/WorldObjects-/Track-Adapters sichern.
- Zwei benannte Dokumente mit identischem Seed unabhängig rekonstruieren; Source-/WorldObject-/Route-/Piece-IDs, Overrides und Store-Namespace vergleichen.
- Dreiecksinterior-Punkte aus dem tatsächlich zurückgegebenen begrenzten Mesh erzeugen und gegen denselben Surface-/Contact-Reader messen; Original/Änderung/Rücknahme eines Sculpt-Strokes protokollieren.
- Tatsächliche Route-Intent an `compileRecipe`/`compileGraph` geben, IDs und Owner/Pins erhalten, vorhandene Core-Checks und Stream-Fingerprint protokollieren. Keine CPU-Geometrie-Neuerfindung.
- Tatsächlichen gespeicherten Authoring-Export samt ausdrücklich erforderlichen Schema-Pointern sichern, frischen Reload/Import aus derselben neuen Implementierung getrennt belegen und mit `compare_saved_state.py` exakt vergleichen. Reine CPU-JSON-Roundtrip wird als solcher gekennzeichnet; er ersetzt keinen frischen Browserstart.

Neue Prüfungen wurden noch nicht ausgeführt. Es wurden ausschließlich Tester-Dateien geschrieben.
