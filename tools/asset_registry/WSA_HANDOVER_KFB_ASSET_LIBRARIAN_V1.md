# WSA HANDOVER · KFB Asset Librarian v1

**Stand:** 2026-09-12  
**Status:** IMPLEMENTATION CANDIDATE · integration prepared, not merged  
**Asset source repo / canonical asset truth:** `georg-doc/kayfabizarro`  
**KFB Stunt Car Race implementation SSOT:** `georg-doc/KFB-Stunt-Car-Race`  
**Integration branch:** `asset-librarian/integration-v1-2026-09-12`  
**Main baseline at integration preparation:** `133d9451c81d3e50bd38f5f8de752b1834192739`

---

## 0 · Worum es geht

`KFB Asset Librarian v1` ersetzt die bisherige manuelle, mehrere MB große Asset-Library-Exportdatei als Arbeitsgrundlage durch einen reproduzierbaren Registry-/Discovery-Layer direkt aus dem Git-Repo.

Hausregel:

> **Der Index wird aus dem Repo erzeugt. Der Index ist nicht die Quelle der Assets.**

Der Librarian ist ein gemeinsamer Zulieferer für mehrere KFB-Consumer, nicht Eigentümer ihrer Implementationsverträge.

Aktuell explizit berücksichtigt:

- Animation Lab
- Frankenstein Studio / Frankensteining Workflow
- Combat Arena
- KFB Stunt Car Race
- generische Runtime-Consumer

---

# 1 · DECISIONS

## D1 · Repo Truth statt manueller Asset-Export

Asset-Identität und mechanische Metadaten werden aus dem Git-Tree erzeugt. Die bisherige Datei `kfb-asset-library (8).json` wurde nur als Kalibrierungsreferenz verwendet.

## D2 · Bestehende Owner bleiben bestehen

Nicht ersetzt werden:

- `media/3D_Assets/CATALOG/**` — historischer/legacy Katalog
- `media/kfb/kfb-index.json` — bestehender expliziter Deck-Owner
- `skills/kfb-frankensteining_v1.md` — Frankensteining-Workflow
- Combat-Arena-Roster und gemessene Gameplay-Verträge
- `georg-doc/KFB-Stunt-Car-Race` — Implementations-SSOT für Stunt Car Race

## D3 · Mechanik automatisch, Semantik nur kuratiert

Automatisch zulässig:

- Pfad / Format / Größe / Blob SHA
- latest + commit-pinned RAW URL
- struktureller Pack / Collection Path
- explizite glTF/GLB/OBJ-Abhängigkeiten
- Rig-/Animations-Fakten aus glTF/GLB
- Deck-Projektion nur aus dem existierenden `kfb-index.json`

Nicht automatisch als Fakt behauptet:

- Gameplay-Rolle
- Donor-Qualität
- Retarget-Kompatibilität
- Combat-Eignung
- Lizenz, falls nicht explizit vorhanden
- semantische Deck-Gruppierung aus Dateinamen

## D4 · Consumer-Handoff ist `candidate-only`

Der Librarian darf Kandidaten finden, filtern und begründen. Die finale Eignungsentscheidung gehört immer dem empfangenden Consumer.

## D5 · Automatisierung per GitHub Action + Review-PR

Generated Registry wird nicht direkt nach `main` geschrieben. Der Workflow aktualisiert den Branch:

`bot/asset-registry-update`

und erzeugt/aktualisiert daraus einen reviewbaren PR.

---

# 2 · IMPLEMENTATION

## AR1 · Flat Inventory

Owner: `tools/asset_registry/build.py`

Erzeugt stabile Records mit:

- path-derived `assetId`
- Name / Pfad / Ordner / Root
- Kind / Format
- Größe
- Blob SHA
- Source Commit
- RAW latest
- RAW commit-pinned

Source roots:

- `media/2D_Assets`
- `media/3D_Assets`

Explizit ausgeschlossen:

- `media/3D_Assets/CATALOG/**`
- generated Registry output

## AR2 · Packs + Dependencies

Zusätzlich:

- struktureller Pack = erster Ordner unter Asset-Root
- `collectionPath` = erster Ordner innerhalb des Packs
- Pack-Shards
- `.gltf`: Buffer-/Image-URIs
- `.glb`: externe und embedded Dependencies
- `.obj`: MTL + Textur-Maps
- FBX/BLEND/DAE/3DS bewusst `unresolved`
- `problems.json`
- kleine reviewed Override-Layer

Beispiel:

`media/3D_Assets/KayKit_Mystery_Series6/...`

wird Pack `kaykit-mystery-series6`; Monats-/Animationsordner bleiben strukturelle Collections.

## AR3 · Deck Adapter

`media/kfb/kfb-index.json` bleibt Deck-Owner.

Registry erzeugt nur:

- `decks/index.json`
- `decks/<deck-id>.json`

und validiert explizit referenzierte PDF-/Card-JSON-Dateien.

Aktuell vier explizite Decks:

- `forget_utopia`
- `ignore_dystopia`
- `embrace_protopia`
- `sonic_slaughterhouse`

## AR4 · Delta + Validation + GitHub Action

Zusätzlich:

- `delta.json`
- added / removed / unambiguous moved
- changed dependencies
- new/resolved problems
- stale generated shard cleanup
- `validate.py`
- `.github/workflows/asset-registry.yml`

Workflow:

1. Tests
2. Registry bauen
3. Registry validieren
4. Rigfacts bauen/validieren
5. Librarian Query/Handoff Smoke
6. nur bei echtem Diff Bot-Branch aktualisieren
7. reviewbaren PR gegen `main` öffnen/aktualisieren

Kein Direkt-Write nach `main`.

## AR5 · Consumer Handoff + Rig Facts

Neue Sidecars:

- `registry/assets/v1/rigfacts.jsonl`
- `registry/assets/v1/rigfacts-summary.json`

File-explicit Rig-Fakten für GLTF/GLB:

- `hasSkin`
- Skin-/Joint-Anzahlen
- Joint-Namen
- Skinned-Mesh-Node-Anzahl
- Animation Clips
- Channels / Target Paths
- strukturelle Skeleton-Signaturen

Skeleton-Signatur-Gleichheit ist strukturelle Evidenz, **keine** Retarget-/Gameplay-Garantie.

Query-/Handoff-CLI:

`tools/asset_registry/query.py`

Filter u.a. nach:

- Name / Path
- Pack / Collection
- Kind / Format
- Dependency Status
- rigged
- animated
- Clip
- Joint

Handoff-Schema:

`kfb.asset-handoff.v1`

mit:

- `selectionStatus: candidate-only`
- `suitabilityDecision: owned-by-receiving-consumer`
- Consumer-Profil
- ausgewählte Asset-Fakten

## Browser Slice · KFB Asset Librarian v1

Pfad:

`tools/asset_registry/librarian/`

Implementiert:

- Registry Summary
- Lazy Catalog Loading
- Suche / Filter
- Rig-/Animationsfilter
- Asset Detail
- pinned RAW Copy
- Dependencies
- Rig-/Animations-Metadaten
- GLB/GLTF Three.js Preview
- erste Animation abspielen, falls vorhanden
- Multi-Selection
- `Send to…` über Consumer Profiles
- Copy/Download `kfb.asset-handoff.v1`
- `Ask Librarian` als read-only Request Bridge

Noch **kein** echter LLM-Endpunkt und keine eingebetteten OpenAI Credentials.

---

# 3 · CONSUMER BOUNDARIES

## Animation Lab

Librarian liefert Kandidaten + Rig-/Clip-Fakten. Animation Lab besitzt visuelle Playback-, Pose-, Orientation- und Retarget-Abnahme.

## Frankenstein Studio

Bestehender Owner-Vertrag: `skills/kfb-frankensteining_v1.md`.

Librarian ersetzt dort nur die alte Library-Suche und liefert Kandidaten mit gepinntem Pfad/RAW sowie Repo-Fakten.

Downstream bleiben zwingend:

- mindestens drei Donor-Kandidaten je Bauteil
- Parts-/Donor-Lab-Messung
- Inselzahl / Inselbounds
- Achse / Montage-Rahmen
- visuelle Abnahme

## Combat Arena

Bestehende Combat-Arena-Owner bleiben authoritative.

Insbesondere kein automatisches Ersetzen/Erweitern von `kfb-monster-roster.js`.

Downstream bleiben:

- Roster-Entscheidung
- gemessene Körperdimensionen
- Clip-/Locomotion-Mapping
- Blick-/Orientierungsprüfung
- Arena-spezifischer Playtest

## KFB Stunt Car Race

`georg-doc/KFB-Stunt-Car-Race` bleibt Implementations-SSOT.

Der Librarian liefert nur Assets/Handoffs für z.B.:

- Fahrzeuge / Karosserieteile
- Fahrer / NPCs
- Props / Obstacles
- Track-/Stunt-Bauteile
- Garage / Hub
- Animation-/Rig-Kandidaten

Physik, Fahrzeugkontrakt, Track-Breite, Gameplay und Runtime-Integration gehören weiterhin dem Stunt-Car-Race-Repo.

---

# 4 · TESTED RESULTS

## Registry · echter GitHub Actions Lauf

Aktueller voller Bestand:

| Fakt | Wert |
|---|---:|
| Assets gesamt | 12,767 |
| Packs | 99 |
| explizite Decks | 4 |
| Audio | 1,683 |
| Images | 6,442 |
| Modelle | 4,642 |

Dependency Status:

| Status | Modelle |
|---|---:|
| complete | 2,603 |
| embedded | 1,353 |
| missing | 374 |
| unresolved | 312 |

Aktuelle Review-Befunde in `problems.json`:

| Problem | Anzahl |
|---|---:|
| `DUPLICATE_NAME` | 641 |
| `MISSING_REFERENCED_FILE` | 382 |
| `UNRESOLVED_FBX_DEPENDENCY` | 239 |
| `UNRESOLVED_MODEL_DEPENDENCY` | 73 |

Diese Befunde machen die Registry nicht ungültig; der Registry-Validator ist grün.

## Rig Facts · echter Repo-Lauf

| Fakt | Wert |
|---|---:|
| Modelle | 4,642 |
| GLTF/GLB parsebar | 4,215 |
| Rigged (`hasSkin`) | 372 |
| mit Animationen | 415 |
| OBJ `not-applicable` | 115 |
| unresolved | 312 |
| Rig-Parse-Fehler | 0 |

## Tests

Letzter Browser-Slice GitHub Actions Gate:

- **23 / 23 Python Tests PASS**
- JS `node --check` PASS
- Registry build PASS
- Registry validator PASS
- Rigfacts build PASS
- Rigfacts validator PASS
- real Librarian query/handoff smoke PASS

Echte Smoke-Beispiele aus CI:

- `KayKit_Mystery_Series6/7 - January 2026 - 4GTN/4GTN.glb` wird als rigged erkannt (`23` Joints).
- ein animiertes `MonsterPack_Quaternius/.../Alien.gltf` wird als Combat-Arena-Kandidat exportiert.
- Export bleibt technisch `candidate-only`.

---

# 5 · NOT YET TESTED / OPEN GATES

## G1 · Main-Integration

Noch nicht gemerged. Aktueller Integrationsstand basiert ohne Divergenz auf `kayfabizarro/main`.

## G2 · Bot-PR auf echtem `main`

Der Workflow wurde auf Pull Requests real getestet. Noch nicht real getestet ist der Publish-Schritt nach einem `main`-Push:

`main` → Registry Build → `bot/asset-registry-update` → Review PR.

## G3 · Visueller WebGL Browser Smoke

CI testet keinen echten Browser-Render.

Noch visuell zu prüfen:

1. embedded GLB
2. externes GLTF + BIN + Texture
3. animiertes rigged Modell
4. Camera fit / Orbit
5. Material-/Texture-Look
6. Clip playback
7. RAW Copy
8. Multi-Selection
9. Download/Copy Handoff für alle Consumer-Profile

## G4 · LLM / ChatGPT App

Noch nicht implementiert.

Vorgesehene read-only Tool-Oberfläche:

- `search_assets`
- `get_asset`
- `get_dependencies`
- `get_rig_facts`
- `find_same_skeleton`
- `export_handoff`

LLM darf Kandidaten shortlist/enrich/explain, aber keine mechanischen Registry-Fakten oder Consumer-Abnahmen erfinden.

---

# 6 · DEVELOPMENT PR HISTORY

Die gestapelten Draft-PRs bleiben als nachvollziehbare Entwicklungshistorie bestehen:

| PR | Inhalt | Status |
|---|---|---|
| #2 | AR1 Flat Inventory | Draft · historical development slice |
| #3 | AR2 Packs + Dependencies | Draft · historical development slice |
| #4 | AR3 Deck Adapter | Draft · historical development slice |
| #5 | AR4 GitHub Action | Draft · historical development slice |
| #6 | AR5 Consumer Handoff + Rig Facts | Draft · historical development slice |
| #7 | Browser Slice | Draft · historical development slice |

**Integration rule:** Sobald der konsolidierte Integrations-PR akzeptiert wird, diese gestapelten PRs nicht zusätzlich einzeln mergen. Danach können sie als superseded/archived development history geschlossen werden.

---

# 7 · INTEGRATION PLAN

## Schritt A · Integration PR

Ein einziger PR von:

`asset-librarian/integration-v1-2026-09-12`

gegen:

`main`

Der Integrations-PR enthält den vollständigen AR1–AR5 + Browser-Stand sowie dieses Handover.

## Schritt B · nach Merge auf main

GitHub Action muss real feuern.

Erwartetes Verhalten:

1. 23+ Tests grün
2. Registry + Rigfacts erzeugen
3. Diff erkennen
4. `bot/asset-registry-update` erstellen/aktualisieren
5. Registry Refresh PR gegen `main` öffnen

## Schritt C · Generated Registry PR prüfen

Mindestens prüfen:

- `manifest.json`
- `summary.md`
- `delta.json`
- `problems.json`
- `rigfacts-summary.json`

Dann Registry-PR mergen.

## Schritt D · visueller Librarian Smoke

Lokal/über statischen Server:

```bash
python3 -m http.server 8000
```

öffnen:

`http://localhost:8000/tools/asset_registry/librarian/`

Erst nach visueller GLTF/GLB-Abnahme Browser als **tested** markieren.

## Schritt E · v1.1 / LLM

Danach optional ChatGPT App / private Site mit demselben Read-only Asset Service.

---

# 8 · WSA PICKUP

Für WSA gilt:

1. Asset-Quelle bleibt `georg-doc/kayfabizarro`.
2. Stunt-Car-Race-Implementationsentscheidungen bleiben `georg-doc/KFB-Stunt-Car-Race`.
3. WSA konsumiert Assets über Registry/Handoff, nicht über Chat-Erinnerung oder manuelle Voll-JSON-Exports.
4. Bei Konflikt zwischen Chat und Repo gilt GitHub.
5. `candidate-only` bedeutet: Asset gefunden, nicht automatisch gameplay-validiert.
6. Keine bestehenden Roster-/Deck-/Frankenstein-/Vehicle-/Track-Owner still ersetzen.

---

# 9 · CURRENT NEXT ACTION

**NEXT:** konsolidierten Integrations-PR gegen `kayfabizarro/main` reviewen/mergen. Danach echten Main→Bot-Registry-PR beobachten und erst anschließend den visuellen Browser-Smoke durchführen.

Nicht vorher in LLM-/MCP-/Custom-App-Architektur verzweigen.
