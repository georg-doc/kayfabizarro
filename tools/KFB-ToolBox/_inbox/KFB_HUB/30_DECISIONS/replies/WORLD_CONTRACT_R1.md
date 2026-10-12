# Welt-Vertrag `kfb.world/1` · R1 (God, Maker, Player)

Stand: 13.10.2026 · Agent Spiel-Werkzeug-Architektur für die Steuerung · Bezug V-188, V-194, V-140, V-141.
Maßgeblich bleiben DECISIONS.md, Plan R1 und PROJECT_STATE (V-117). Hier steht **kein neuer Beschluss**.
Alles, was nicht wörtlich aus V-194 oder aus vorhandenem Code kommt, ist **Vorschlag**.

**Dateien:**
- JSON-Schemas: `replies/WORLD_CONTRACT_R1/` (`kfb.world`, `kfb.world-layout`, `kfb.op`, `kfb.mode-profile`, `kfb.catalog-entry`, `kfb.publish-request`, `kfb.world-save`) + `mode-profiles.sample.json`
- Delta Ist → Vertrag: `replies/WORLD_CONTRACT_R1/DELTA.md`
- Prototyp: `~/Developer/kfb-world-ops` (Node, 34 Tests grün)

---

## 0 · Kurz

1. Eine Hülle `kfb.world/1` für alle Modi. Sie verweist auf Rezepte, Layout, Strecken-Graph, scene-study /2 und Thema. Meshes sind nur Cache.
2. Jede Änderung ist ein Op. `applyOp` liefert den Gegen-Befehl. Speichern = Schnappschuss + Op-Log. Undo/Redo kommt daraus.
3. Rechte je Modus: God (Georg) darf alles. Maker nur in der eigenen Parzelle, mit Snap und Budget. Player ändert nichts.
4. Veröffentlichen = Antrag des Makers + Freigabe durch Georg.
5. Snap nur an Strecken-Anker, Mauer-Raster und Gelände. Hex ist Legacy und wird abgelehnt.

---

## 1 · Grundsätze (aus V-194 und Bestand)

- **Ein Dokument.** God-Mode, Maker und Spiel lesen dieselbe Welt. Kein Modus hat eigene Geometrie-Daten (V-188).
- **Rezept statt Mesh.** Gespeichert werden Rezepte, Striche, Graphen. Meshes, Felder und Streams baut das Lab neu (SPEC_GODMODE §6).
- **Ein Schreiber.** Nur `applyOp` ändert das Dokument. Editor, Maker-Werkzeug und Importer erzeugen Ops.
- **Nie Spielstand in der Welt.** Die Sperrliste aus `recipe.ts:8` gilt für die ganze Hülle. Besitz, Fluff, Karten gehören später in `PLAYER_SAVE`.
- **Hex ist Legacy.** Das Hex-Raster des Organ-Hubs bleibt Geometrie. Es ist keine Grundlage für Snap oder Platzieren. Assets aus dem KayKit-Hexagon-Pack bleiben normal nutzbar; nur das Raster fällt weg.
- **Maker nach dem MVP.** Heute werden nur Profile, Ops und Prüfungen vorbereitet.

---

## 2 · Hülle `kfb.world/1`

Schema: `WORLD_CONTRACT_R1/kfb.world.schema.json`.

```json
{
  "schema": "kfb.world/1",
  "worldId": "main",
  "rev": 3,
  "islands":    [ { "id": "kfb_town", "ref": "islands/kfb_town.island.json" } ],
  "layout":     { "ref": "layout.json" },
  "tracks":     [ { "id": "ring", "ref": "tracks/ring.graph.json" },
                  { "id": "maker_spieler1", "ref": "tracks/maker_spieler1.graph.json", "plot": "plot-spieler1-insel" } ],
  "sceneStudy": { "ref": "scene-study.json" },
  "theme":      { "ref": "themes/island-themes.json" },
  "plots": [
    { "id": "plot-spieler1-ms", "island": "maker_space", "owner": "spieler1", "kind": "maker-space", "bounds": [[40,0],[80,0],[80,40],[40,40]] },
    { "id": "plot-spieler1-insel", "island": "insel_spieler1", "owner": "spieler1", "kind": "own-island" }
  ],
  "provenance": {
    "createdBy": "georg", "createdIn": "god",
    "edits": [ { "actor": "georg", "mode": "god", "fromSeq": 1, "toSeq": 3, "ops": 3,
                 "families": ["island-field", "terrain", "track"], "targets": ["island:kfb_town", "track:ring"], "at": "2026-10-13T12:00:00Z" } ]
  }
}
```

**Verweise auf bestehende Formate (1:1):**

| Feld | Format | Quelle |
|---|---|---|
| `islands[].ref` | `kfb.island-config/1` | Lab `src/island/recipe.ts:7` |
| `layout.ref` | `kfb.world-layout/1` (**Vorschlag**, nur `poses`) | Plan R1 Phase D |
| `tracks[].ref` | Track-Core-Graph-Eingabe `{ id, ds, defaults, routes[], nodes? }` | `track-core.mjs:1127`, `compileGraph :1386` |
| `sceneStudy.ref` | `kfb.scene-study/2` | V-141, `STEERING_REPLY_WSA_SCHEMA_R1.md` |
| `theme.ref` | `kfb.island-theme/1` | `public/themes/island-themes.json`, V-051 |

**Regeln:**
- `layout` besitzt die Lage der Inseln. `recipe.pos` wird nur bei der Migration gelesen.
- `plots` ist leer bis Maker. `bounds` fehlt = ganze Insel (eigene Insel des Spielers). Mit `bounds` = Teilfläche (Maker-Space-Insel).
- `tracks[].plot` nennt die Parzelle, wenn ein Maker die Strecke besitzt. Ohne `plot` gehört die Strecke Georg.
- `provenance` schreibt die Sitzung beim Speichern: je Block aus gleichem Akteur und Modus eine Zeile. `rev` zählt Speicherstände.
- `kfb.road-bed/1` bleibt RKIT-Ausgabe und ist kein Feld der Hülle.

**Im Speicher** ist die Hülle aufgelöst: `{ envelope, islands, layout, tracks, sceneStudy }`. Auf Platte liegt eine `world.json` plus Teil-Dateien (Prototyp `writeWorldFolder`).

---

## 3 · Ops (Befehle)

Schema: `WORLD_CONTRACT_R1/kfb.op.schema.json`.

```ts
applyOp(doc, op) → { doc, inverse, dirty }      // rein: das alte doc bleibt unverändert
applyOp(result.doc, result.inverse).doc  ≡  doc // geprüft für jeden Op-Typ
```

| Op | Gruppe | Gegen-Befehl | ersetzt im Editor heute |
|---|---|---|---|
| `island.add` / `island.remove` | island | einander | `newIsland` (`editor.ts:312`), Löschen |
| `island.pose` | layout | `island.pose` (alte Lage) | Shift-Ziehen (`editor.ts:146`), Höhe (`:467`) |
| `island.field` | island-field | alter Wert | Felder im Panel (`editor.ts:458–490`) |
| `outline.move` / `.insert` / `.remove` | outline | einander | Griffe, Doppelklick, Rechtsklick (`editor.ts:142`, `:178`, `:189`) |
| `place.put` / `.move` / `.remove` | place | einander | Bauen (`editor.ts:129`, `:242`, `:257`) |
| `terrain.stroke` | terrain | `edit.remove` | neu: WB2-Pinsel, Strich in `edits[]` |
| `edit.add` / `edit.remove` | terrain | einander | – (Gegen-Befehle) |
| `track.piece.insert` / `.remove` / `.set` | track | einander | neu: Strecken-Editor (Phase E) |
| `relation.link` / `.unlink` | relation | einander | `linkPlaces` (`scene-study.ts:30`) |
| `batch` | je Teil | Bündel der Gegen-Befehle rückwärts | `scaleOutline` (`editor.ts:301`) |

**Regeln:**
- **Ein Op je Geste.** Beim Ziehen gibt es nur Vorschau. Der Op entsteht beim Loslassen (heute `editor.ts:155–160`).
- **Striche, nicht Ergebnisse.** `terrain.stroke` speichert den WB2-Strich (`mode, radius, strength, falloff, points`). Eintrag in `edits[]`: `{ kind: 'terrain.stroke', id, stroke }`.
- **`dirty`** nennt, was neu gebaut wird (`island:<id>`, `track:<id>`, `layout`). Das braucht der Zieh-Editor (Audit Nr. 10: < 100 ms).
- **Gesperrt für `island.field`:** `schema`, `worldId`, `edits`, `nodes`, `buildings`, `outline`, `pos`. Dafür gibt es eigene Ops.
- **Umriss** behält mindestens 5 Punkte (Regel aus `editor.ts:188`).
- **Später (nicht im Prototyp):** `track.attach` (Anschluss an Anker, V-099), `track.skin`, `track.tunnel`, `paint.stroke` (Sprenkel S1), `pattern.stroke`, `theme.set`, `relation.place.*`.

**Undo, Redo, Speichern** (Schema `kfb.world-save/1`):
- Sitzung hält einen Undo- und einen Redo-Stapel. Grenze 80, wie `makeHistory` im Resident Atlas (`lib/pose-tool.js:564`).
- Neuer Op nach Undo leert den Redo-Stapel.
- Das Log ist nur anhängend: `do`, `undo`, `redo`, je mit `seq`, `actor`, `mode`, `at`.
- Speichern = `{ snapshot, log, head }`. `replay(snapshot, log)` ergibt `head` (ohne `rev` und `provenance`). Danach beginnt ein neuer Abschnitt.
- Abgelehnte Ops ändern nichts und kommen nicht ins Log.

---

## 4 · Rechte je Modus `kfb.mode-profile/1`

Schema: `WORLD_CONTRACT_R1/kfb.mode-profile.schema.json` · Beispiel: `mode-profiles.sample.json`.

| | god | maker | player |
|---|---|---|---|
| Wer | Georg | Spieler mit Maker-Schalter im Spiel | Spieler (gehen, fahren) |
| Op-Gruppen | alle | `place`, `terrain`, `track` | keine |
| Bereich | ganze Welt | nur eigene Parzelle (`plots[].owner`) | – |
| Katalog | alles | nur `maker.allowed = true`, nie `local` | – |
| Snap | frei, Snap optional | Pflicht beim Setzen und Verschieben | – |
| Maßstab | frei | K2-Faktor aus dem Katalog, kein Skalieren (**Vorschlag**, V-060) | – |
| Budget | Warnung | hart | – |
| Prüfung vor Speichern | Warnung | Pflicht | – |
| Veröffentlichen | gibt frei | stellt Antrag | – |

**Maker-Grenzen (Vorschlag):**
- **Parzelle:** Jede berührte Lage muss in einer eigenen Parzelle liegen. Das gilt für Vorher und Nachher, für Gebäude, Pinsel-Punkte und Strecken (`tracks[].plot`).
- **Georgs Teile sind tabu.** Ein Maker kann auf der Maker-Space-Insel nichts außerhalb seiner Parzelle verschieben oder löschen.
- **Sanfter Pinsel:** Stärke ≤ 0,12 (WB2-Standard), Radius ≤ 6,4. Kein Formen des Inselkörpers (Körper modelliert Blender, V-167).
- **Budget:** Teile, Striche und Streckenteile je Parzelle. Die Zahlen im Beispiel (60 / 200 / 40) sind **Platzhalter**. Die Steuerung setzt sie nach Messung (KFB_TECHNIK §5, V-115).
- **Gesperrt bis Georgs Antwort:** Inseln anlegen, Umriss, Lage, Insel-Felder, Beziehungen (Frage 1).
- **Undo:** Ein Maker darf seine Ops zurücknehmen. Parzelle und Budget gelten auch dann; die Snap-Pflicht nicht, weil die Lage schon geprüft war.
- **Strecke:** Track-Core-Teile hängen aneinander. Sie sind damit schon „gesnappt“. Der Anschluss an Anker (`track.attach`, V-099) kommt mit dem Strecken-Editor.

**Veröffentlichen** (Schema `kfb.publish-request/1`):
1. Maker stellt einen Antrag für seine Parzelle. Vorher läuft `validate()`. Ein `fail` blockiert den Antrag.
2. Status `pending`. Der Antrag nennt die noch offenen Lab-Host-Prüfungen.
3. Nur Georg (Profil god und in `approvers`) setzt `approved` oder `rejected`. Vor `approved` müssen die Lab-Host-Prüfungen gelaufen sein.
4. Was „veröffentlicht“ für andere Spieler bedeutet, ist offen (Frage 4).

---

## 5 · Katalog-Eintrag `kfb.catalog-entry/1`

Schema: `WORLD_CONTRACT_R1/kfb.catalog-entry.schema.json`.

```json
{
  "schema": "kfb.catalog-entry/1",
  "librarianId": "media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/green/building_windmill_green.gltf",
  "packId": "kaykit-medieval-hexagon-pack-1-0-free",
  "labAsset": "hex/green/building_windmill_green.gltf",
  "kind": "building", "source": "KayKit",
  "k2": 17.3, "k2Source": "catalog-k2.ts:11 E(6, 0.4)",
  "snap": [ { "kind": "terrain" }, { "kind": "track-anchor", "anchorKinds": ["road", "stair"] } ],
  "skins": [], "local": false,
  "maker": { "allowed": true }
}
```

- `librarianId` = `assetId` aus `registry/assets/v1/catalog.jsonl` (echt, origin/main). Lab-eigene Teile: `lab:<pfad>`.
- `k2` nach der Türregel (`catalog-k2.ts:7`, SCALE_CONTRACT_K2). Figuren nie skalieren (V-060).
- `snap[].kind` nur `track-anchor`, `wall-grid`, `terrain`. Hex ist kein gültiger Wert.
- `skins`: Strecken-Skins (V-145) bzw. Mauer-Skins A Stein, B Sci-Fi (V-105).
- `maker.allowed` setzt Georg bzw. der Librarian. `local = true` (gekauft, privat) ist für Maker nie sichtbar.
- Der Librarian besitzt die Einträge. Das Lab liest nur. Erst den Pack-Index laden, Zeilen später (BACKBONE §4).

---

## 6 · `validate()` ruft nur vorhandene Prüfungen

| Prüfung | Quelle (gibt es heute) | läuft wo |
|---|---|---|
| Rezept-Wächter (Schema, ein Primär-Deck, Sperrliste, `nodes[]` leer) | `recipe.ts:45–49` | Node (Prototyp spiegelt die 4 Zeilen) |
| Sperrliste auf der ganzen Hülle | `recipe.ts:8` | Node |
| Strecke: `compileGraph` + `runGraphChecks` (ruft `runChecks`) | `track-core.mjs:1386`, `:2454`, `:2319` | Node (Prototyp ruft 0.16.9 echt auf) |
| Fußwege `trailChecks` | `track-core.mjs:2747` | Node, sobald Wege im Dokument stehen |
| Orts-Beziehungen `checkStudy` | `scene-study.ts:11` (/1) | Lab-Host, nach Umstellung auf /2 |
| Offene und nicht-mannigfaltige Kanten | `world/organ/mesh-check.ts:6`, `tools/track/open-edges-lib.mjs:2` (V-112, V-136, V-168) | Lab-Host |
| Insel-QA (Straßenbett, harte Regeln, Kontakte, scharfe Kanten) | `island/r2d/qa.ts:19`, `:46`, `:88`, `:138` | Lab-Host |
| K2-Türen | `catalog-k2.ts:37` `k2DoorCheck` (V-060) | Lab-Host |
| Gleichstand | `tools/parity/parity.mjs` | Lab-Host (Playwright) |
| Leistung ≥ 30 fps | V-115, V-159, `tools/parity/fps-stage.mjs` | Lab-Host |

- Ergebnis: `{ pass, hostPending, results[] }`. Lab-Host-Prüfungen stehen als `skipped` mit Quelle. Nichts wird erfunden.
- God: Ergebnis als Warnung. Maker: Pflicht vor Speichern und vor dem Antrag.

---

## 7 · Snap ohne Hex

| Snap-Art | gibt es heute | fehlt |
|---|---|---|
| `track-anchor` | Insel-Anker `spec.ts:125` (road, dock, portal, threshold, stair, bridge); Track-Core-Sockets (`track-core.mjs:1393` `targets`) | Snap-Werkzeug im Editor |
| `wall-grid` | Mauer-Baukasten als Plan (V-105, Plan R1 §2d „festes Rastermaß“) | Rastermaß (Frage 3), Baukasten selbst |
| `terrain` | Erdung `environment/grounding.ts:77` `rollToRest`; Resident Atlas `lib/snap.js`, `lib/grounding.js` | Einbau in den Editor |

---

## 8 · Prototyp `~/Developer/kfb-world-ops`

- Reines Node, keine Abhängigkeiten, kein Browser, kein Server. Lokales Git, kein Push.
- Echtes Rezept `kfb_town` aus dem Lab (Kopie aus `docs/critic/lab-stage1/2026-10-10_04/qcheck.json`).
- **34 Tests, alle grün** (`node --test`). Darunter:
  - 13 Ops quer durch alle Gruppen vor, dann alle Gegen-Befehle rückwärts: Datei Byte-gleich.
  - Undo × n = Ausgang, Redo × n = Endstand; Undo-Grenze; Redo-Stapel leert sich.
  - Schnappschuss + Log abspielen = gespeicherter Stand, auch über JSON-Text.
  - Provenienz je Block (georg/god, dann spieler1/maker), kein Doppelzählen.
  - Rechte: Player nichts; God alles; Maker nur Parzelle, Snap-Pflicht, Katalog-Flag, `local`, K2, sanfter Pinsel, Budget; Hex für alle abgelehnt.
  - Antrag und Freigabe: nur Georg gibt frei; kein Antrag bei `fail`.
  - Track Core 0.16.9 `runGraphChecks` echt; WB2-Strich-Spiegel = WB2 `normalizeStroke`.

---

## 9 · Offene Fragen an Georg (je ein Klick)

1. **Maker-Inseln:** Darf ein Spieler eine eigene Insel neu anlegen und ihren Umriss ändern? — *Ja* / *Nein, nur zugeteilte Inseln*
2. **Maker-Space-Insel:** Bekommt dort jeder Spieler eine feste Parzelle? — *Ja, feste Parzellen* / *Nein, eine gemeinsame Fläche*
3. **Mauer-Raster:** Welches Rastermaß hat der Mauer-Baukasten? — *1 MacroCell (6,4)* / *½ MacroCell (3,2)*
4. **Veröffentlicht heißt:** — *in der Hauptwelt für alle sichtbar* / *nur als Datei zum Teilen*
5. **Welt-Dateien:** Sollen God-Mode-Welten zusätzlich als Dateien im KFB_HUB liegen (neben localStorage und Export)? — *Ja* / *Nein*

---

## 10 · Nächste Schritte (Vorschlag)

- Ohne Lab-Dev-Server: Katalog-Adapter auf den echten Librarian-Pack-Index (Modulkarte §9a Nr. 4); WB2-Strich → `IslandField`-Delta als Node-Test (Nr. 5).
- Mit der Bau-Sitzung (nach V-171 Punkt 1–3): DELTA Top 5 in dieser Reihenfolge: `kfb.world/1` laden und speichern mit Migration → `applyOp` als einziger Schreiber in `editor.ts` + Undo → scene-study /2 → `edits[]` im Gelände → Strecken-Graph als Datei.
- Parity um „Speichern → Neuladen → gleiche Welt“ und „Undo × n = Ausgang“ erweitern.
- Höchstens zwei Baustellen gleichzeitig (V-005). Vorlage-zuerst-Zeile je Schritt (V-001).

---

### Such-Protokoll (V-140)

Gelesen: `WORLDBUILDER_MODULE_MAP_R1.md`; DECISIONS.md (V-140, V-141, V-184, V-188, V-192, V-194 und Bezüge V-015, V-051, V-060, V-070, V-099, V-105, V-110, V-112, V-115, V-120, V-136); Lab `CLAUDE.md`, `src/island/recipe.ts`, `spec.ts`, `src/editor.ts`, `src/scene-study.ts`, `src/main.ts` (Speichern, Laden, Migration, Rezept-API), `src/catalog-k2.ts`, `vendor/private/track-core-0.16.9/track-core.mjs` (Graph-Format, Prüfungen), `track-core-alias.js`, `organ-world.lab.js` (Graph-Aufruf), `docs/KFB_WORLDBUILDER_PLAN_R1.md` §2d, `docs/BACKBONE_EDITOR_DONORS_R1.md`, `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` §6; `replies/STEERING_REPLY_WSA_SCHEMA_R1.md`; Resident Atlas Cut 2026-10-04 r2 (`lib/edit-layer.js`, `lib/pose-tool.js`, `docs/SNAP_EDITOR_CONTRACT_01.md`, `KFB_Resident_Atlas_S17.html`); WB2 `terrain-sculpt.js`; Librarian `registry/assets/v1/catalog.jsonl` (origin/main).
**Nicht gefunden in** Dropbox (ohne KFB Open World) und per Spotlight: das WSA-Paket `WSA_PLACE_RELATIONS_SCHEMA_R1` mit dem /2-Schema. Die /2-Felder stammen deshalb aus der bestätigten Feldliste in `STEERING_REPLY_WSA_SCHEMA_R1.md`.
**Korrektur zur Modulkarte:** Undo im Resident Atlas liegt in `lib/pose-tool.js:564` (`makeHistory`), nicht in `lib/edit-layer.js` (siehe DELTA).


## Nachtrag Steuerung 13.10. · Georg V-197
Maker so offen wie möglich: jeder Spieler eine eigene Welt bzw. Heimatinsel (auch neu anlegen), für andere sichtbar, gemeinsames Bauen erwünscht. Für R2 des Vertrags: Welt je Spieler als eigene `kfb.world/1`, Sichtbarkeit und Mitbau-Rechte im Rechte-Profil, Op-Log mit Autor je Op als Grundlage für gemeinsames Bauen. Die Parzellen- und Budget-Grenzen aus R1 werden zu Voreinstellungen statt festen Grenzen. Bau erst nach dem spielbaren MVP.
