# Guard · begrenzter WB2-Insel-Dokument-Abschluss

Rolle: `/root/integrator_guard`, ausschließlich lesend an Produktionscode. Menschliche Steuerung laut Integrator: Georg akzeptiert den engeren Abschlussauftrag und begrenzte Insel-Dokumente mit eigenem Ursprung im bestehenden WB2. Der ältere Endloswelt-One-shot ist für diesen Abschluss ersetzt. Alle 37 vollständigen MVP-Gates bleiben unangetastet **NO MVP**. Dies ist kein Produkt-PASS und kein neuer Runtime-Owner.

Tatsächlich gelesen: `intake/KFB_ISLAND_UNIVERSE_PROPOSAL_2026-10-07.md`, `intake/HANDOVER_WSA_LAB_DONORS_2026-10-07.md`, neuer konkreter `ISLAND_TOPOLOGY_DECISION_2026-10-07.md` im receiving Owner, vorhandene WB2 Scene-/Workspace-/Sculpt-Implementierung, lokale Surface-/Track-/Physics-/Register-Seams. Akzeptierter Abschluss: Stand auf PR348 sichern/As-built; gemeinsame SurfaceTruth/WorldObjectId-/Save-freshReload-/RouteIntent→TrackCore-Seams **abschließen oder explizit exportieren**; boundedIsland-Dokument/Load/Save/Origin/Streaming tatsächlich auditieren; dann Return an Georg, kein Merge/Live. Proposal-Felder außerhalb der bestätigten Topologie bleiben Vorschläge: 130 Decks, 56 Karten pro Insel, Fluff, Unterseiten-Golden, Universum/Highway, Resident-Life und Story-Kanon sind keine hier neu eingeführten Abschluss-Gates.

Routing: **CONTINUE · begrenzte Dokument-/Replay-Lücken schließen und auditierbar übergeben**. Keine weiteren Endloswelt-Geometrie-/Performance-Reparaturen; keine Global-STOP-Klassifikation aus bisherigen Testfehlern.

## Minimal belegte bestehende Träger

- WB2 `wb2-design-01/wb2d-app.js`: `kfb-worldbuilder-scene`, version1, stabile Dokument-id, Terrain-/Source-Daten und Objekt-Records mit source.path/source.commit und position/rotation/scale. `DOC_ID` und `STORAGE_KEY` kommen vom bestehenden WORLD-Adapter. Keine neue zweite Editor-App nötig.
- Derselbe WB2-Owner hat tatsächliches `saveDoc`/`reloadDoc`/`applySceneDocument`, `mountSceneRecords`, Save-JSON und erneuten Terrain-/Objektaufbau. `reloadDoc` und `applySceneDocument` prüfen format+docId; `mountSceneRecords` verlangt echte Source-Pins. Vorhandene Mechanismen sind wiederzuverwenden, nicht bereits aktuelle receiving-Island-Abnahme.
- `wb2-mvp.v1.js`: bestehendes `kfb.authoring-workspace-bundle/1` enthält Scene-Doc und hat native Datei-Import-/Download-Pfade. Dies genügt als äußerer portabler Container eines begrenzten Insel-Dokuments.
- Vorhandenes `terrain.sculpt/version1` und WB2 `terrain-sculpt.js`: deterministische additive Strokes mit mode/radius/strength/points, smooth-C2 Kernel, Undo/Clear und ursprünglichem Save/Reload. Die lokale receiving Surface verwendet bereits den echten donor `dabDeltaAt`.
- `world-integration-01/r2d-world.js`: einzelner Seed-Adapter liefert `docId:'r2d-world-'+seed`, `storageKey:'kfb-r2d-world.'+seed`, endliche editierbare tile und Source-/Player-Ref. Das belegt einen vorhandenen Adaptermechanismus für endliche Dokumente; es belegt noch keinen unabhängig gespeicherten Ursprung pro Insel. Das ältere Archipelago verwendet dagegen ein gemeinsames `kfb-mvp-archipelago-01`-Dokument.
- Tatsächlich vorliegendes `WORLD_RECIPES.json` nennt `kfb.world-recipe-set/0.1` mit nodes/seed/position/deck/anchors. Das Proposal behauptet zusätzlich ein vorhandenes `kfb.world-recipe.v0` mit zones; dessen genaue Source wurde in diesem begrenzten Lesepaket nicht geliefert. Diese Version nicht ohne tatsächliche Source als bereits vorhandenen Vertrags-PASS ausgeben.

Minimaler Adapter: vorhandene Scene-Doc-Identität pro Insel; darin islandId, generator/source pin, seed, endliche local bounds und explizite local origin/frame semantics; vorhandene Source-/Objekt-Records, geordnete Sculpt-Daten und Track RouteRecipe-State. Universe-Anordnung kann vorläufig eine Referenz/Proposal bleiben. Keine Vollimplementierung aller vier vorgeschlagenen neuen Schemas für diesen Abschluss erforderlich.

## Outcome-kritische Lücken für Save / frischen Load / eigenen Ursprung

1. **Dokument-Identität und Isolation.** Aktuelle receiving `surfaceFor(seed)` und `objectsFor(seed)` sind globale Maps allein nach Seed. Zwei verschiedene Insel-Dokumente mit gleichem Seed teilen Dabs, Override-Records und Listener. `WorldObjects.restore` ergänzt vorhandene Records statt den alten Dokumentzustand zu ersetzen. Es fehlen ein Island-/Session-Key und explizite Load-/Unload-/Dispose-Grenzen. Insel A → Insel B (gleicher Seed) → Insel A muss unabhängig bleiben; bloße verschiedene Storage-Keys genügen nicht.

2. **Register-Override ist noch kein sichtbares Replay.** `register` erhält vorhandene authored Records. `ChunkBuilder.add` und `addInstanced` ignorieren die zurückgegebene gespeicherte Matrix und rendern weiter die eingehende procedural Matrix. Village/Nature/Prop-Collider werden separat erzeugt. Ein korrekt exportierter Override kann daher im Register stehen, während sichtbares Objekt und Rapier an der generierten Position bleiben. Vor Abschluss eines behaupteten Roundtrips muss ein tatsächlicher Move/Rotate/Scale nach Load sowohl Render als auch relevante Kollision steuern; ansonsten ausdrücklich als offene Adapterlücke übergeben und kein Save/Reload-PASS.

3. **Sculpt-Format und Replay-Reihenfolge.** Vorhandener donor speichert geordnete Strokes mit geordneten Punkten; receiving Surface speichert Map-Dabs `{id,x,z,radius,amount}`. Ein Adapter muss native Strokes verlustfrei in Dabs abbilden oder native Form übernehmen, Punkt-Rundung/IDs/Reihenfolge erhalten und dieselbe Kernel-Version pinnen. `restore` validiert derzeit kein finite x/z/radius/amount und doppelte IDs können Dabs still überschreiben. Geordnete serialisierte Daten, eindeutige IDs, Import-Validierung und nichtdestruktive Ablehnung unbekannter Versionen sind notwendig.

4. **Sculpt / Track-Reihenfolge muss eine dokumentierte Policy sein.** Aktuell: base → river/village contributions → Track cut/fill → Sculpt, danach höchster KitContact als support. `designHeightAt` schließt Track und Sculpt aus. Damit recompiled Track unverändert auf pre-sculpt design liegt; Raise kann den Track überdecken, Lower lässt ihn an seiner alten Höhe. Zulässiger begrenzter Abschluss kann eine ausdrücklich feste authored Route behalten und Terrain-Kontakt nach klarer Policy behandeln. Ein Export/Load darf diese Reihenfolge nicht ändern oder Sculpt doppelt auf Base oder Road-Fit anwenden. Proben ohne Straße, am Straßenrand und auf dem Deck müssen vor/nach Load dieselben Höhen/Contact-Werte liefern. Neue Geometriearbeit folgt daraus nur, wenn die enger zugesagte Funktion es erfordert.

5. **Eigener Ursprung muss alle Physik-/Query-Daten umfassen.** Terrain mesh buffers sind chunk-lokal, aber Rapier ColliderDesc.translation enthält weiterhin die Chunk-Weltkoordinate; Track-Collider buffers enthalten absolute Path-Koordinaten; KitContact/Surface/Objektmatrizen/Player verwenden denselben aktuellen Weltframe. Eine reine Three-Group-Verschiebung oder origin-Metadaten löst absolute Rapier-Präzision nicht. Beim Insel-Load müssen Terrain, Track, Objekte, Colliders, Player und Support-/Snap-Queries denselben begrenzten Insel-Lokalframe benutzen; externe Universe-Position bleibt getrennte Anordnungsmetadaten. Alte Collider/Jobs des vorherigen Dokuments entfernen, bevor neuer Load sichtbar/aktiv wird.

6. **Der receiving Save-/Load-Pfad ist noch nicht belegt.** Im gelesenen aktuellen Open-World `src/core` liegt kein Persistenz-/Island-Dokument-Owner; bestehende WB2 UI-Save-Methoden sind bisher donor/separates Altprodukt. Der Abschluss muss entweder den vorhandenen WB2 Document/Workspace-Pfad konkret in dieser receiving Session benutzen oder einen exakten, bewusst noch offenen Adapter-Return liefern. Ein JSON von Register/Sculpt allein ist keine Load-/Play-Abnahme.

## Auditierbarer enger Abschluss

1. Exakter Scope-Return: Menschliche Richtungsänderung, gleicher WB2-Owner/Branch, Insel-Dokument-Grenze, vorhandene Träger, Prototype-Status und unverändertes NO MVP. Proposal/Handover source-pin mit ablegen. Keine nachträgliche Reduktion der 37 MVP-Requirements.
2. Ein minimal validiertes Fixture-Dokument mit generator pin, islandId, bounded frame, einem echten source-pinned Objekt-Override, zwei überlappenden Raise/Lower-Strokes und einer existierenden Track RouteRecipe-Referenz. Zusätzlich ein zweites Dokument mit gleichem Seed für Isolation. Keine erfundenen Platzhalter-Assets.
3. Save/export → vollständige Session-/Owner-Bereinigung → fresh import/load → erneuter Export. Stabile Nutzdaten vergleichen, Zeitstempel/Sitzungsdiagnostik getrennt halten. IDs, Source-Pins, transform, Stroke-/Dab-Reihenfolge, Route-State und Player-local-frame müssen exakt übereinstimmen. Importfehler müssen last-known-good unangetastet lassen.
4. Kleine reale Browser-Proben an derselben begrenzten Session: tatsächliches Objekt/Collider an editiertem Ort, Surface-triangle/Rapier-Zuordnung im lokalen Frame, identische Ground-/Track-support an festen Punkten vor/nach Load; danach weiterhin normaler PLAY-Betrieb. Fehlende Prüfungen als NOT RUN/UNPROVEN ausweisen.
5. Genau ein verifizierter GitHub-Evidence/Return-Checkpoint und ein klarer nächster WB2-Insel-Adapter-Gate. Kein Debug-Kandidat an Georg als fertiges Spiel; kein Cloudflare/Hub-Rebuild, keine öffentliche Veröffentlichung, kein Merge/Live.

Die lokalen Source-Lücken sind zielkritisch, falls der engere Abschluss tatsächlichen Roundtrip behauptet. Sie sind kein Beweis, dass der begrenzte Auftrag unmöglich ist. Bei einem rein dokumentierten Architektur-/Handoff-Abschluss bleiben sie explizite offene Implementierungsnähte; nicht zur Endlosscope-Reparatur eskalieren.

## Gelesene lokale Source-Fingerprints (SHA-256, vor weiteren Root-Änderungen)

```
core/surface.ts 0b9e375fd39b3e1c5ef333812b4c684c2241213a988cf3d8a5b24b3e11076232
core/objects.ts d941de5d99f5dbb451b010bccd144a3e90d6961a488e04b61e924a42f5890624
core/chunks.ts b2b5f6aa79d510ab35fefaaffc5dcf2e374a1774f87c339481808fb34253fbe2
roads/track-adapter.ts 97695355b29ef872d082306f1fe02faa892b422005eae91e5be6f1f8c15640ae
roads/kit-contact.ts 65ad687d531486f662a8255bf5d35f4980f6d194cb349fd386dc1fc92276e68a
terrain/index.ts 66e7e66a1995436524d8fd1ea8c97bf8ea1a35c1f8fc7efc87e2dfbe456d0eea
```

Keine Code-Edits, keine Runtime-Abnahme, keine neuen Endloswelt-Tests durch Guard.
