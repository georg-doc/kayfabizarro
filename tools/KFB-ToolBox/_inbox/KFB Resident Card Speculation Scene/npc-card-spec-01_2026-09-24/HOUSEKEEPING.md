# HOUSEKEEPING — Projekt (laufend aktualisiert)

Status je Artefakt: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET`

## Deliverables

- `KFB Theatre Curtain v2.html` — **AKTIV**. WebGPU-Compute-Cloth-Donor ×2 (rot), geschlossen
  lückenlos, offen geprüft, kein Streifenartefakt. Aktuelle Arbeitsversion.
- `KFB Theatre Curtain.dc.html` — **SUPERSEDED** von v2. DC-Wrapper um den v1 CPU-Verlet-Ansatz.
  Als Wiring-Referenz für eine spätere DC-Fassung von v2 brauchbar, nicht weiter pflegen.
- `game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs` — **SUPERSEDED** von v2 (gleicher
  Grund wie oben). Bleibt als Lernmaterial/Negativ-Beispiel im Postmortem referenziert.
- `Three.js Donor - webgpu_compute_cloth.html` — **ASSET**. Unveränderter 1:1-Referenzmount des
  offiziellen `mrdoob/three.js`-Beispiels. Nicht anfassen — ist der Vergleichs-/Ausgangspunkt.

## Contract-/Daten-Dateien

- `github.md` — **AKTIV**. Repo-Anbindung `georg-doc/kayfabizarro` (v1-Quelle) + sekundär
  `mrdoob/three.js` (v2-Quelle, nur lesend).

## Docs

- `docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md` — **AKTIV**. Volle Fix-Historie
  v1, Root-Cause-Vergleich. Status-Vermerk ergänzt: Empfehlung ist umgesetzt (v2).
- `docs/HANDOVER_THEATRE_CURTAIN_FRESH_START.md` — **AKTIV** (als Nachweis der ursprünglichen
  Anleitung, jetzt mit Status-Vermerk "umgesetzt").
- `docs/HANDOVER_WSA_THEATRE_CURTAIN_2026-09-24.md` — **AKTIV**. Zusammenfassendes Handover für
  den WSA-Chat, verweist auf beide obigen Docs.
- `CHANGELOG.md` — **AKTIV**, additiv. Zwei neue Einträge (v1-Abbruch, v2-Umsetzung).

## Abnahme-Captures

- `screenshots/postmortem-donor-webgpu-clean.png` — Donor, streifenfrei.
- `screenshots/postmortem-kfb-cpu-verlet-final-state.png` — v1-Port, finaler Stand vor Abbruch.
- `screenshots/v2-closed.png` — v2, geschlossener Zustand, lückenlos.

## Cleanup-Kandidaten (nur genannt, nichts ausgeführt)

- `KFB Theatre Curtain.dc.html` + `game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`
  könnten nach Georgs Freigabe gelöscht oder in ein `_archive/`-Verzeichnis verschoben werden, sobald
  v2 als endgültig bestätigt ist. Bis dahin: liegen bleiben, nicht anfassen.

## Pfad-Hygiene

Alle Asset-Pfade (HDR-Environment, three.js-Module) laufen über kanonische CDN/RAW-URLs
(`cdn.jsdelivr.net`, `threejs.org`) — keine `./assets/...`-Relativpfade in den Deliverables dieser
Session. Netzzugriff bleibt zur Laufzeit nötig (wie im gesamten Projekt üblich).

## Größen-Budget

Alle Dateien in diesem Export sind einzeln unter 2 MB (Text/HTML/MD + kleine PNGs, keine
eingebetteten Binaries).


---

# NPC-CARD-SPEC-01 · Resident Card Speculation (2026-09-24)

## Deliverables
- `NPC Card Speculation Scene.dc.html` — **AKTIV**. Review host (renderer, lights, host floor, camera, card loading, tweaks, owner panel).
- `npc-card-spec-01/resident-scene.mjs` — **AKTIV**. Thin runner `mountResidentScene()`; scene root, beat clock, gaze impulses, bubble placement, motion controller, GothGirl mouth recess flatten.
- `npc-card-spec-01/donor/**` — **ASSET** (unchanged donor copies; do not edit, re-copy from source):
  - `eye-rig-batch/{kaykit-eye-adapter,source-face-cleanup,face-color-sampler}.v1.js`, `gothgirl.seed.json` — branch `toolbox/eye-rig-batch-2026-09-18`
  - `podcast-v5/{bubble-shaper.v2,bubbles.v4,bubbles.v5}.js`, `bubble-shapes.json` — Dropbox Pet Podcast v5 — **GETEILT** (bubble-shaper imports v4/v5 + ink canon)
  - `cardbuilder/kfb-ink-canon.js` — kfb-rigs-embed-v3/petstudio-v9 — **GETEILT**
  - `profiles/kfb-pet-gothgirl.json` — ToolBox inbox (Elisa B-Day)

## Contract-/Daten-Dateien
- `npc-card-spec-01/resident-card-speculation.recipe.json` — **AKTIV**. The Resident Scene recipe (schema `kfb.resident-scene/0.1-candidate`).
- `npc-card-spec-01/motion/KFB_Motion_Library_Rig_Medium.glb` — **ASSET**, 2.6 MB, local copy from Dropbox. Upload candidate → `media/3D_Assets/Animations/KFB_Motion_Library/` + NOTICE.md; then switch `recipe.motion.library` to the RAW URL.

## Docs
- `docs/NPC-CARD-SPEC-01_RETURN.md` — **AKTIV** (sources, reused/not reused, owners, TUNE, gate).
- `docs/NPC-CARD-SPEC-01_SOURCE_RETURN.md` — **SUPERSEDED** by RETURN (first STOP report, history).
- `docs/HANDOVER_NPC-CARD-SPEC-01_WSA.md` — **AKTIV** (WSA handover).

## Abnahme-Captures
- `screenshots/01…04-npc-v6.jpg` — current state (beats 8.4 / 14.2 / 17.8 / 20.6 s).

## Cleanup-Kandidaten (nur genannt)
- 31 intermediate `screenshots/*npc*` (all except `*-npc-v6.jpg`) — recommend delete after Georg's OK.

## Clean-Run-Checkliste
1. Open `NPC Card Speculation Scene.dc.html` in a **visible** tab (hidden panes park rAF; host falls back to a timer).
2. Wait for "Mounting…" to clear (~10–20 s: pdf.js, rigs@5650b6c, GothGirl GLB, Motion Library).
3. Owners panel: EyeRig ×2 · PetMouth ×2 · mixer ×2 · motion library 33 clips · baseplate none.
4. Tweaks: view actor-a / actor-b / mouths; variant 0/1; rootX/rootYaw move the whole vignette.
5. `window.NPCCardSpecScene.seek(t)` for deterministic stills.
