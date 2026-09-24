# HOUSEKEEPING — KFB Theatre Curtain (laufend aktualisiert)

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
