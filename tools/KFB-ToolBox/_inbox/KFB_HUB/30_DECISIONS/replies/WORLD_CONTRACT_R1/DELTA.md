# Delta Ist → Vertrag kfb.world/1 · R1

Stand: 13.10.2026 · Bezug: `WORLD_CONTRACT_R1.md`, V-188, V-194 · nur Code gelesen, keine Änderung im Lab.
Pfade relativ zum Lab (`~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`), sonst voll.
**Größe:** S = bis ½ Tag · M = 1–2 Tage · L = mehr als 2 Tage (eine Bau-Sitzung, mit Parity).
Alles unter „Soll“ ist **Vorschlag**.

---

## Top 5

| # | Ist | Soll | Größe |
|---|---|---|---|
| 1 | `src/editor.ts` schreibt an rund 20 Stellen direkt in `spec`; kein Undo, kein Modus-Recht (D1–D10) | `applyOp` als einziger Schreiber, Sitzung mit Undo/Redo, Profil aus dem HUD-Schalter | L |
| 2 | `WorldSpec` (`src/island/spec.ts:134`) als ein JSON in localStorage (`src/main.ts:58–59`, `:146`, `:232`) | Hülle `kfb.world/1` mit Verweisen + einmalige Migration | M |
| 3 | `edits[]` immer leer (`src/island/recipe.ts:38`); `recipeToSpec` verliert Felder (`:50–55`) | Striche als `edits[]`-Einträge; Rundweg Rezept ↔ Spec ohne Verlust | M |
| 4 | Strecken-Graph steht im Code (`organ-world.lab.js:1017`, `:1032`) | Graph als Datei, Verweis in der Hülle, `runGraphChecks` in `validate()` | M–L |
| 5 | `scene-study` Schema /1 (`src/scene-study.ts:4–7`) | /2 nach V-141 | S |

---

## A · Welt-Dokument

| # | Ist (Datei:Zeile) | Soll | Größe |
|---|---|---|---|
| A1 | `src/island/spec.ts:134–141` `WorldSpec { version: 1, islands: IslandSpec[], added?, sceneStudy? }`; Inseln als volle Specs inline | `kfb.world/1`: Verweise auf Rezepte, Layout, Strecken, scene-study /2, Thema; `plots`, `provenance`, `rev` | M |
| A2 | `src/main.ts:58–59` zwei Speicher-Schlüssel (`kfb.worldbuilder.v1`, `…mvp1.v1`); `:146` laden; `:228–234` speichern (ganze Welt, 300 ms entprellt) | Speicherstand `kfb.world-save/1` (Schnappschuss + Op-Log). Migration einmal: WorldSpec → Rezepte (`specToRecipe`) + Layout aus `pos` | M |
| A3 | `src/main.ts:150–197` Migrationen über Marker in `added` (`lauf03`, `pyramide-v2`, `scale-k1`, `scale-k2`) | Marker bleiben nur in der Migration. Neue Änderungen laufen als Ops, nicht als Marker | S |
| A4 | `src/editor.ts:441–449` Export/Import `kfb-world.json` (WorldSpec) | Export Hülle + Teile (Ordner) bzw. Speicherstand; Import liest `kfb.world/1`, alte WorldSpec über Migration | S |
| A5 | `src/main.ts:691–698` `exportRecipe` / `importRecipe` (ersetzt Insel direkt) | `importRecipe` = Op `island.remove` + `island.add` (ein `batch`, ein Undo-Schritt) | S |

## B · Insel-Rezept `kfb.island-config/1`

| # | Ist | Soll | Größe |
|---|---|---|---|
| B1 | `src/island/recipe.ts:22` `edits: unknown[]`; `:38` immer `[]` | Eintrag `{ kind: 'terrain.stroke', id, stroke }`, Strich = WB2 `makeStroke` (Prototyp `src/ops.js`) | S |
| B2 | `src/island/recipe.ts:50–55` `recipeToSpec` übernimmt `edits` nicht, setzt `nature` auf 0 und `residents: []` | `edits` durchreichen. Ob `nature`, platzierte `residents` (ResidentSpec), `outlineExact`, `noComposition` ins Rezept gehören, klärt die Steuerung mit der Bau-Sitzung (heute gehen sie beim Rundweg verloren) | S–M |
| B3 | `src/island/recipe.ts:18` `pos` im Rezept; `src/island/spec.ts:96` | Lage besitzt `kfb.world-layout/1`. `recipe.pos` nur noch bei der Migration lesen | S |
| B4 | `src/island/recipe.ts:24`, `:49` `nodes[]` muss leer sein | bleibt (MVP-Regel; laut SPEC §6 Z. 95 später Interaktions-Punkte, keine Strecken-Knoten) | – |
| B5 | Gelände liest keine Striche: `src/island/terrain.ts:53` `IslandField`, `:91` `addEmbed` | Endhöhe = Basis + WB2-Delta (`sculptDeltaAt`), wie in BACKBONE_EDITOR_DONORS_R1 Z. 103 beschrieben | M |
| B6 | Rezept-Wächter läuft nur beim Import (`recipe.ts:45–49`) | `validate()` ruft ihn für alle Inseln (Prototyp `recipeGuard`) | S |

## C · Orts-Beziehungen

| # | Ist | Soll (V-141) | Größe |
|---|---|---|---|
| C1 | `src/scene-study.ts:4` `'kfb.scene-study/1'`; `:5` `places.focus`; `:6` `connections { from, to, reason }` | `/2`: `binding: 'receiver-selected-world'`; `places.sourceObjectId`; `connections.id` + `desiredAttachment.from/to { type, anchorId }` | S |
| C2 | `src/scene-study.ts:30–36` `linkPlaces` ändert direkt | Op `relation.link` / `relation.unlink` | S |
| C3 | `src/editor.ts:352–389` `bindStudy` ändert `sceneStudy` direkt | Ops; Orts-Ops `relation.place.*` folgen (nicht im Prototyp) | S |
| C4 | `src/scene-study.ts:11` `checkStudy` liest WorldSpec | liest `doc.sceneStudy` + Rezepte; Hook in `validate()` | S |

## D · Editor `src/editor.ts`

| # | Ist (direkter Schreibzugriff) | Soll-Op | Größe |
|---|---|---|---|
| D1 | `:129` `buildings.push(b)` | `place.put` (mit `snap`) | S |
| D2 | `:141–148` Ziehen schreibt live in `outline` bzw. `pos` | Vorschau ohne Op; beim Loslassen (`:155–160`) genau ein `outline.move` bzw. `island.pose` | M |
| D3 | `:178` `outline.splice` (einfügen), `:189` (löschen, Grenze 5) | `outline.insert` / `outline.remove` (Grenze bleibt 5) | S |
| D4 | `:242–251` `commitBuilding` | `place.move` | S |
| D5 | `:257` Gebäude löschen | `place.remove` | S |
| D6 | `:301–310` `scaleOutline` ändert Umriss, Gebäude, Teich, Berg | ein `batch` | S |
| D7 | `:312–326` `newIsland` | `island.add` | S |
| D8 | `:458–490` Felder (Name, Palette, Seed, Gelände, Natur); `:467` Höhe | `island.field`; Höhe → `island.pose` | M |
| D9 | kein Undo (grep `undo` ohne Treffer); Tasten `:212–225` | Strg/Cmd+Z, Shift+Strg/Cmd+Z → Sitzung; Knöpfe ↶ ↷ wie Resident Atlas | S |
| D10 | einziger Modus-Schalter `enabled` (`:51`) | Profil god / maker / player aus dem HUD-Schalter (V-040); Maker = Schalter im Spiel (V-194) | M |
| D11 | Katalog fest im Code `:18–40` (`ASSETS`) + `src/catalog-k2.ts:10` | Katalog-Adapter `kfb.catalog-entry/1` aus dem Librarian | M |

## E · Strecke

| # | Ist | Soll | Größe |
|---|---|---|---|
| E1 | Route und Graph entstehen im Code: `src/world/organ/vendor/lab-organ/organ-world.lab.js:1017` (Rezept), `:1032` (Graph `O1_RING_C4C`) | Graph-Eingabe als Datei `tracks/<id>.graph.json`; Lab liest sie. Geometrie bleibt RKIT, Look Lab | M–L |
| E2 | `runGraphChecks` nur im Alias exportiert (`…/lab-organ/track-core-alias.js:13`) | Hook in `validate()`; Prototyp ruft 0.16.9 schon echt auf | S |
| E3 | Strecken-Editor fehlt (Plan R1 Phase E) | Ops `track.piece.*` heute; `track.attach` (V-099), `track.skin`, `track.tunnel` später | L |

## F · Snap und Hex

| # | Ist | Soll (V-194) | Größe |
|---|---|---|---|
| F1 | `src/world/organ/organ-world.ts:28` nutzt `hex-grid.js` für die Hub-Kacheln | bleibt als Geometrie des Organ-Hubs (Legacy). Keine Snap- oder Platzier-Grundlage | – |
| F2 | Modulkarte R1 §6 Zeile „Snap + Erdung … Hex-Snap“, §8 Nr. 2 und Frage 3 nennen Hex | überholt durch V-194 | S (Doku) |
| F3 | Snap-Ziele heute: Anker `src/island/spec.ts:125`; Track-Core-Sockets (`track-core.mjs:1393` `targets`); Erdung `src/environment/grounding.ts:77` `rollToRest`; Resident Atlas `lib/snap.js` (grid, connector, mount) | Snap-Arten `track-anchor`, `wall-grid`, `terrain`. Mauer-Raster fehlt: der Mauer-Baukasten (V-105) steht in der Modulkarte §6 als „fehlt (Bestand prüfen)“; das Rastermaß ist nicht festgelegt (Plan R1 §2d) | M |

## G · Prüfungen

| # | Ist | Soll | Größe |
|---|---|---|---|
| G1 | `tools/parity/parity.mjs` prüft Gehen, Kamera, Kanten | zwei Fälle dazu: „Speichern → Neuladen → gleiche Welt“, „Undo × n = Ausgang“ (Modulkarte §9b Nr. 8) | M |
| G2 | Host-Prüfungen verstreut (`qa.ts`, `mesh-check.ts`, `open-edges-lib.mjs`, `k2DoorCheck`) | ein Host-Aufruf `validateHost(doc)` im Lab, gleiche Liste wie Prototyp `CHECKS` | M |

---

## Korrektur zur Modulkarte R1

- Undo liegt im Resident Atlas **nicht** in `lib/edit-layer.js` (grep ohne Treffer). Es liegt in `lib/pose-tool.js:564` `makeHistory` (Schnappschuss vor jedem Griff, Grenze 80) und wird in `KFB_Resident_Atlas_S17.html:600` (`recordNodes`) und `:3219` (`doUndo`) benutzt. Der Prototyp übernimmt die Stapel-Logik, aber mit Ops statt Voll-Schnappschüssen.
- Frage 7 der Modulkarte (KFB World Studio MVP1) ist durch V-192 (6) erledigt: nicht relevant.
