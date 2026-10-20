# HANDOVER · Resident Atlas S16 → WSA · MVP-Slice „Residents in der Welt" · 2026-10-04 r1

Für den WSA-Lead-Chat. Additiv zu `docs/HANDOVER_WSA_S40.md` (Disco), `docs/NPC_SETTINGS_01/ONBOARDING.md`
und `docs/RESIDENT_FIGHT_SANDBOX_02/RESUME_LATER.md`. Der Workspace ist die Wahrheit. Dieses Paket ist ein
lauffähiger Schnitt, kein Merge.

## A · Georgs Absicht (aus der Sprachnachricht, sinngemäß)

Eine **spielbare Welt**, modular erweiterbar. In der prozeduralen Welt des WorldBuilders sollen sich
**Resident-Atlas-Szenen** platzieren lassen. Feinarbeit im Platz mit dem **3D-Inline-Editor**, Gelände mit dem
**Terrain-Transform-Gizmo** aus der anderen Seite (WB2). Die **ToolBox** stellt die Resident-Ebene bereit, die
**Asset Librarian** liefert Live-Suche und Filter, um **Resident-Sets** zu finden und abzusetzen. Neue Residents
sollen im Walker (Spielmodus) und im Gottmodus (Edit) ohne Umbau nutzbar sein. Dazu zählen die WIP-Scenelets
Orc-Band, Disco und später Friedhof.

Unsicher aus der Sprache: „fahrversion" → gelesen als **Varianten (Farb-/Pose-/Modus-Fassungen)** eines Sets.
`VOICE_INPUT_UNCERTAIN`, bitte bestätigen.

## B · Stand dieses Pakets

- **Entry:** `KFB_Resident_Atlas_S16.html` (Hash = residentId, z. B. `#combat-mech`, `#mummy`, `#__disco`, `#__band`).
- **29 Residents** in `data/cast.js` (27 + Mummy + Combat Mech weiß/oliv; Combat Mech zählt als zwei Einträge).
- **Batch-EyeRig** für jede Figur mit Profil (`lib/frizzlegraft/batch-eyes.v1.js`, Profile in `data/eye-rig/`).
  NoEyes-Dateien aus EYE-CLEANUP-01 (Witch, Orc Brute, Mummy A/B) haben Vorrang. Schalter „Augen" im Kopf.
- **Neue Rezeptfelder** in `lib/atlas.js`: `hover` (Schweben), `spin` (drehendes Kind-Teil), `noBatchEyes`;
  Rückgabe `tickers[]`, die Seite ruft sie je Bild.
- **Scenelets im selben Host:** Band (`#__band`), Disco (`#__disco`), Friedhof (Graveyard-Modul), Fight 02 (geparkt).
- Editor-Schicht im Atlas ist noch **v1** (`lib/edit-layer.js`, S12-Stand). Die ToolBox P07 trägt `edit-layer.v2` +
  `snap.v1` + `grounding.v1` als Ports derselben Atlas-Dateien (siehe D).

## C · GitHub-Lage (gelesen 2026-10-03, main @ 71394636)

| Strang | Stand | Bedeutung für den Slice |
|---|---|---|
| WorldBuilder v1 | **Terrain-First-Reset** (23.09.): kontinuierliches Gelände + Scene Editor, Donor `ZyFou/ProceduralTerrains@f58a8ddb` (MIT). Hex nur lokal. | Residents sind dort „Scene objects · authored content" (§4 B). Genau unser Andockpunkt. |
| WB2 / WORLD-INTEGRATION-01 r2 (25.09.) | Hürth/Köln, Szenendokument `kfb-worldbuilder-scene` v1, Play↔Edit (Tab), Raise/Lower, Object Move/Rotate/Scale/Drop, Save/Reload, KayKit-Lokomotion 12 Zustände. Offen: „Resident folgt dem Support nicht". | Das ist das Terrain-Gizmo und der Walker. Resident-Sets müssen als Objektart in dieses Dokument. |
| Travel Globe CONVERGENCE-01 (29.09.) | Ground → Drive → Flight auf dem Globus. **Residents ausdrücklich out of scope.** | Nicht parallel in denselben Host drücken. Residents docken an das Szenendokument, nicht an den Mobility-Stack. |
| ToolBox P06/P07 (30.09.–01.10.) | `edit-layer.v2`, `snap.v1`, `grounding.v1`, B1-Menü, Abnahme E1–E9 PASS; K2-Knete für Figuren, `contact-ao.v1`. | Eine Editor-Wahrheit existiert schon. Atlas und WorldBuilder sollen sie **konsumieren**, nicht ein drittes Mal bauen. |
| Asset Librarian (Entscheidung 15.09.) | Ein kontextabhängiger Resource Picker, **kein zweiter Index**; Registry entdeckt, Konsument entscheidet Eignung. | Resident-Set wird eine neue indizierte Art in derselben Registry. |
| Eye-Rig-Batch | Large 4/4 approved; Medium 2/33 approved, 30 adjusted. | Augen sind im Slice an, Status je Figur sichtbar. |

## D · Vorschlag Integrationsleiste (meine Sicht, zur Entscheidung)

**Grundsatz:** Der Atlas wird **Autorenwerkzeug und Lieferant** für Resident-Sets, nicht zweite Welt. Die Welt
(WB2-Szenendokument) besitzt Gelände, Platzierung, Spielmodus. Ein Set kommt als Daten, nicht als Seite.

1. **Vertrag `kfb.resident-set/0.1` (Export aus dem Atlas).** Ein JSON je Resident:
   `id, display, pack, variants[], figures[], props[], scenelet?, footprint, anchor, eyes, sources`.
   - `figures[]`: Asset + Commit, Rig-Klasse, Pose als **Rolle** (`idle`, `hold.rifle`, `fly`) plus Clipname als Beleg,
     lokale Transform relativ zum Set-Anker, `hover`/`spin`, `skin`, `eyes` (Profil-ID + Review-Stand).
   - `props[]`: Mount (`of`, `bone`, `slotAxis`) oder lokale Transform, `parts`.
   - `footprint`: gemessener Radius + Box aus dem Aufbau (posierte Haut, nicht Box3 der Bind-Pose).
   - `variants[]`: Parameter, keine Kopien (z. B. `color: A|alt`, `mode: ground|flight`, `props: on|off`).
   - Atlas-Korrekturen (Studio-Bündel `ST`) werden **eingebacken** oder als `overrides` mitgegeben.
   - Quelle bleibt `data/cast.js`; der Export ist eine Ableitung, keine zweite Rezeptwahrheit.
2. **Platzierung in der Welt.** Szenendokument bekommt `residentSets[]: { setId, variant, transform, overrides }`.
   Absetzen: Set-Anker auf Gelände, dann **jede Figur einzeln** mit `grounding.v1` auf die posierte Haut.
   Optional eine Flatten-Zone unter dem Footprint (Travel `terrain-surface` kennt build/flatten-Zonen).
   Kein Plattensockel.
3. **Ein Editor.** WorldBuilder-Objektmodus nutzt `edit-layer.v2` aus der ToolBox. Das Terrain-Gizmo (Raise/Lower)
   bleibt ein eigener Modus desselben Editors (Tasten 1/2/3 wie in WB2). Im Atlas wird v1 erst nach dem
   Slice auf v2 umgestellt, damit hier nichts parallel bricht.
4. **Librarian.** Neue Art `resident-set` im bestehenden Registry-Shard. Karte = Keyart-Thumbnail (Kamera steht
   je Rezept schon in `keyArt`), Varianten als Chips. Filter für den ersten Schnitt: Pack/Jahrgang, Rig-Klasse,
   Modus (Boden/Flug), Augen (approved/adjusted/keine), Scenelet ja/nein, Footprint-Größe.
   Ablauf wie entschieden: `Browse → Preview → Accept/Revert`, dann Klick in die Welt.
5. **Scenelets als Module mit Lebenszyklus.** Band, Disco, Friedhof bekommen dieselbe Naht:
   `mount(host, anchor, opts) · update(dt, clock) · bounds() · snapshot() · dispose()`.
   Start per Annäherung (Radius), eine geteilte Uhr (`song-transport`), Licht/Kugel nur im Radius.
   Disco ist am weitesten (S40); Band hat eigenen Transport; Friedhof ist Messbasis S14.
6. **Spielmodus.** Residents bekommen im Walker: Blick zum Spieler (EyeRig `setGazeFollow`), weiche Kollision
   (`resident-collide.makeWalker`, bereit, ohne Szene), Idle-Schleife. Encounter-Bus NPC-LIFE-01 (PR #210) als
   spätere Anbindung.
7. **Budget vor Schönheit.** Ein Set kostet: Figuren × (Mixer + EyeRig + Knete). Vor dem Slice je Set messen:
   Drawcalls, Dreiecke, ms. Regeln: Mixer schlafen außerhalb der Sicht, Eye-Rigs nur nah (Disco hat
   „EyeRig-Nah" schon), K1-Knete nur im Studio/nah, statische Props instanzieren.

## E · Offene Punkte (priorisiert, mit Ursprung)

1. **Medium-Augen nicht approved** (30/33 nur ADJUSTED). Entweder Georg approved im Batch-Tool, oder `BATCH.accept`
   auf `ADJUSTED_APPROVED` setzen (eine Zeile in `batch-eyes.v1.js`).
2. **Ungepinnte Ladewege:** NoEyes-GLBs @ Branch `georg-doc-patch-3`; Graft-Leser holt Driver/Kopf/Texturen von
   raw@main; Mixed-Bag-Gitarren @ main; Motion Library zwei Pins (`032c9d50` Disco, `f91c4e0f` Band). Vor dem MVP pinnen.
3. **Kein Schieß-/Zielclip** in der Bibliothek (Hero Man, Combat Mech). Gewehrhaltung ist ein geschichteter
   Laufclip, gefroren. Frage an die Animation Lab.
4. **Combat Mech:** keine Schubgeometrie im Pack; Flug = Pose + Schweben + ausgeklappte Flügel.
5. **Skelette:** Batch-Augen sitzen ohne Ausblenden (wie bei der Abnahme); visuell nach der letzten Änderung nicht nachgesehen.
6. **18 Mystery-Figuren fehlen** als Resident (`data/npc-gap-list-01.json`, mit Augenprofil-Spalte). Series-7-Widerspruch offen.
7. **Atlas-Editor v1 ≠ ToolBox v2.** Umstellung nach dem Slice.
8. **Fight 02 geparkt** (`docs/RESIDENT_FIGHT_SANDBOX_02/RESUME_LATER.md`).
9. **Disco:** Taktanfang gesetzt statt gemessen, HIT 2 Platzhalter-Clip, Band eigener Transport (HANDOVER_WSA_S40 §4).
10. **Graveyard:** Knetform offen (`docs/RESIDENT_CLAY_AR_01/OPEN_LATER.md`); `makeWalker` ohne Einbau.
11. **WB2-Befund:** „Resident folgt dem Support nicht" (WORLD-INTEGRATION-01 r2, H) — direkt relevant für D2.
12. **Referenzbilder** aus `uploads/` und `ref/atlas/` fehlen im schlanken Export (nur Überblendung betroffen).

## F · Was nicht passieren soll

Kein dritter Editor, kein zweiter Registry-Index, keine zweite Rezeptwahrheit neben `data/cast.js`, keine
Residents im CONVERGENCE-01-Host, keine Physik/Ragdoll für Residents, keine neuen Clips aus dem Atlas.

## G · Next Gate

**WSA-RES-SET-01 · Resident-Set-Vertrag v0.1 festlegen und mit drei Sets beweisen (Mummy, Combat Mech, Clown):
Export aus S16 → Platzierung im WB2-Szenendokument auf Gelände → Edit (Objektmodus) → Save → Reload → gleiches Bild.**
