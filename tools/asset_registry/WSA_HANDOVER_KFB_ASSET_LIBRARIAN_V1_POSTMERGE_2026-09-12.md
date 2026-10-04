# WSA HANDOVER · KFB Asset Librarian v1 · POST-MERGE STATUS

**Stand:** 2026-09-12  
**Status:** IMPLEMENTATION MERGED · GENERATED REGISTRY PR REVIEWED · VISUAL BROWSER GATE OPEN  
**Asset source / Registry implementation:** `georg-doc/kayfabizarro`  
**KFB Stunt Car Race implementation SSOT:** `georg-doc/KFB-Stunt-Car-Race`

Dieses Dokument ist ein additiver Status-Nachtrag zu:

`tools/asset_registry/WSA_HANDOVER_KFB_ASSET_LIBRARIAN_V1.md`

Der ursprüngliche Handover bleibt als Pre-Merge-/Entwicklungsverlauf erhalten.

---

## 1 · IMPLEMENTATION STATUS

Der konsolidierte Asset Registry + Asset Librarian v1 Stack wurde über PR #8 in `main` gemerged.

Merge-Commit:

`cb52cc2b3d89f0c45471d8ebc5bfa0b42477b13b`

Enthalten:

- AR1 Flat Inventory
- AR2 Packs + Dependencies
- AR3 Deck Adapter
- AR4 Delta + Validator + GitHub Action
- AR5 Rigfacts + neutraler Multi-Consumer-Handoff
- Asset Librarian Browser Slice
- WSA Handover / Manifest

Die Entwicklungs-PRs #2–#7 sind abgeschlossen und bleiben nur als Review-/Entwicklungshistorie bestehen.

---

## 2 · TESTED RESULT · REAL MAIN

Der erste echte `main`-Workflow gegen den Merge-Commit bestätigte:

- 23/23 Tests PASS
- JS module syntax PASS
- Registry build PASS
- Registry validator PASS
- Rigfacts build PASS
- Rigfacts validator PASS
- real Librarian query / Combat Arena handoff smoke PASS

Registry-Bestand:

| Fakt | Wert |
|---|---:|
| Assets gesamt | 12,767 |
| Packs | 99 |
| explizite Decks | 4 |
| Audio | 1,683 |
| Images | 6,442 |
| Modelle | 4,642 |

Dependencies:

| Status | Modelle |
|---|---:|
| complete | 2,603 |
| embedded | 1,353 |
| missing | 374 |
| unresolved | 312 |

Rigfacts:

| Fakt | Wert |
|---|---:|
| GLTF/GLB parsebar | 4,215 |
| rigged | 372 |
| animated | 415 |
| OBJ not-applicable | 115 |
| unresolved | 312 |
| Rig-Parse-Fehler | 0 |

---

## 3 · GENERATED REGISTRY PR

Der Workflow hat den workflow-eigenen Branch erfolgreich erzeugt und gepusht:

`bot/asset-registry-update`

Commit:

`390055d8aaeac85e3ec5c046513a401764d35c8a`

Review-PR:

`georg-doc/kayfabizarro#9` · `chore: refresh KFB Asset Registry`

Diff-Vertrag:

- 1 Commit vor `main`
- 0 Commits zurück
- ausschließlich `registry/assets/v1/**`
- keine Code-, Asset-Source- oder Consumer-Owner-Dateien

Geprüfte Kernartefakte:

- `manifest.json`
- `summary.md`
- `delta.json`
- `problems.json`
- `rigfacts-summary.json`

`manifest.json` verweist exakt auf Source Commit:

`cb52cc2b3d89f0c45471d8ebc5bfa0b42477b13b`

Da dies die erste kanonische Registry ist, ist das Initial-Delta erwartungsgemäß:

- added: 12,767
- removed: 0
- moved: 0
- changedDependencies: 0
- newProblems: 1,335
- resolvedProblems: 0

Bekannte Problemklassen:

- `DUPLICATE_NAME`: 641
- `MISSING_REFERENCED_FILE`: 382
- `UNRESOLVED_FBX_DEPENDENCY`: 239
- `UNRESOLVED_MODEL_DEPENDENCY`: 73

Keine zusätzliche unerwartete Problemklasse im Initial-Manifest.

---

## 4 · AUTOMATION GATE

### TESTED

Der Workflow kann:

1. auf `main` triggern
2. Tests ausführen
3. Registry bauen
4. Registry validieren
5. Rigfacts bauen/validieren
6. Consumer-Handoff smoke-testen
7. Registry-Diff erkennen
8. `bot/asset-registry-update` erzeugen
9. Generated Registry Commit pushen

### OFFEN · REPO-EINSTELLUNG

Nur der letzte Schritt `createPullRequest` wird aktuell von einer GitHub-Repository-Einstellung blockiert:

`GitHub Actions is not permitted to create or approve pull requests`

Der Workflow fällt dabei sichtbar rot und schreibt niemals direkt nach `main`.

Für vollständige Automatisierung muss in den GitHub Actions Repository Settings das Erstellen von Pull Requests durch GitHub Actions erlaubt werden.

Bis dahin kann der bereits vom Workflow erzeugte Bot-Branch manuell als PR geöffnet werden; PR #9 demonstriert diesen Fallback ohne Owner-Vertrag zu verändern.

---

## 5 · CONSUMER STATUS

Der Librarian bleibt consumer-neutral.

Explizite Profile:

- Animation Lab
- Frankenstein Studio
- Combat Arena
- KFB Stunt Car Race
- generic runtime

Handoff bleibt:

`kfb.asset-handoff.v1`

mit:

`selectionStatus: candidate-only`

Die finale Eignung, Messung, Physik, Runtime-Integration oder Roster-Aufnahme bleibt beim jeweiligen Consumer-Owner.

---

## 6 · NEXT GATES

1. Generated Registry PR #9 mergen.
2. Danach Browser gegen die kanonische Registry auf `main` visuell prüfen.
3. Pflicht-Smokes:
   - embedded GLB
   - externes GLTF + BIN + Texture
   - animiertes rigged Modell
   - Camera Fit / Orbit
   - Material-/Texture-Look
   - Clip Playback
   - RAW Copy
   - Multi-Selection
   - Handoff an Animation Lab
   - Handoff an Frankenstein Studio
   - Handoff an Combat Arena
   - Handoff an KFB Stunt Car Race
4. Erst nach visueller Abnahme Browser Rendering als TESTED markieren.
5. Danach optional Librarian v1.1 mit LLM/MCP Read-only Tools.

---

## 7 · WSA PICKUP RULE

GitHub-State schlägt Chat-Erinnerung.

Für WSA gilt weiterhin:

- Assets/Registry kommen aus `georg-doc/kayfabizarro`.
- Stunt-Car-Race-Implementationsentscheidungen bleiben in `georg-doc/KFB-Stunt-Car-Race`.
- Librarian-Handoffs sind Kandidatenlisten, keine Implementationsentscheidungen.
- Bestehende Vehicle-, Track-, Garage-, Combat-, Frankenstein-, Deck- oder Roster-Owner werden nicht still ersetzt.
