# RETURN · Three.js LOD / Procedural World · WS0 intake R1 · 2026-10-30

## Was jetzt nutzbar ist
Ein quellengeprüftes und auf **das laufende WS0/WS1-Procedural-World-MVP** bezogenes LOD-/Instancing-/Clay-/Schatten-Dossier liegt im bestehenden WS0-Register:
[RESEARCH_THREEJS_LOD_PROC_WORLD_WS0_R1_2026-10-30.md](RESEARCH_THREEJS_LOD_PROC_WORLD_WS0_R1_2026-10-30.md).
Gegenüber der vorangegangenen Chat-Antwort korrigiert: Der `WB2 R4 FAIL/STOP` in `kayfabizarro#348` ist eine **separate historische Lane**, nicht der aktuelle Entwicklungsstopp. WS0/WS1 arbeiten weiter am privaten prozeduralen Spiel.

## Exakte Owner-/GitHub-Quellen (read-only, Stand dieser Recherche)
- WS0-Steuerregister: `georg-doc/kayfabizarro` · `docs/kfb-decisions-register-2026-10-11` · Research-Writer für diese dokumentarische Lieferung.
- Aktives privates Spiel: `georg-doc/KFB-Stunt-Car-Race` · WS0 `game/proc-world-ws0@72fbb25d08aad1e7d669203c7b0e85ce9f69934c`, WS1 Lead `game/integration-r2@072cf3d05de4eb63f5dfb58559a8ece02e0c88a9`. **Bei Arbeitsaufnahme Heads erneut lesen**, nicht die Snapshot-Hashes zurückschreiben.
- WS1-Status: `georg-doc/kayfabizarro` · `ws1/status@cf04b5042a00dee83da7b6378cd3bbf87cb38ad6`, `WS1_STATUS.md` §185 (29.10.) und `ws1/r3f-frame` §121 als vorhandene LOD-Messung.
- WS0-Arbeitsstand: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/WS0_STATE.md` §0 · **V-1041** Integration vor neuen Arbeiten bis Sonntag 01.11. 20:00; **V-1042/V-1043** Architektur-/Performance-Spike schon geplant.
- Bekannte private Runtime-Quell-Dateien direkt gelesen: `src/world/endlessVeg.js` (BatchedMesh + Culling-Konfiguration), `src/world/EndlessDrive.jsx`, `src/start/quality.js`, `src/start/QualityDpr.jsx`, `src/m1/M1Loop.jsx`, `src/hud/hudPass.js`, `test/perfMvp.mjs`.
- WS0/WSA-FPS-Befund vom 27.10. im Register: `replies/WSA_TO_WS0_SINGLE_INSTANCE_FPS_DIAGNOSIS_2026-10-27.md`. Dort war `renderer.info` ein HUD-Pass-Zähler; vor jeder Behauptung zur Polygonzahl die ganze Welt + Schatten + HUD zuverlässig erheben.

## Geliefert
1. Reddit-Checkliste und offizielle THREE.LOD-/BatchedMesh-/GLTF-Transform-Referenzen samt Hysterese-/autoUpdate-Korrektur.
2. Detaillierte Source-Landkarte des tatsächlich aktiven Spielowners plus bereits genutzte Donoren (WS1-Amphitheater 349k→59k, B7 80k/25k, Travel Global Instancing, Seed-World LOD0–3, K2 Clay).
3. Per Asset-Klasse sinnvolle Near/Mid/Far-Strategie und No-Second-Owner-Vertrag.
4. Stufenplan: vollständige Frame-Telemetrie, dann kontrollierte Geometry-/Culling-/Material-/Shadow-LOD A/B, erst danach bedingte Integration.
5. Prüfkatalog inkl. Seed/Kameras/Ground+Drive+Flight, Grenzen der Tri-/Drawcall-Werte, Sicht- und Gameplay-Goldens, Negative Goldens.
6. Ein einzelner Anschluss an den ohnehin geplanten WS0-Mess-Spike; keine zusätzliche Baustelle.

## Evidenz / ausdrücklich NICHT nachgewiesen
- GitHub-Quell- und API-/Dokument-Lektüre: durchgeführt; einzelne Sourcen oben genannt.
- Neue Unit-Tests: **0**.
- Neue Runtime-/FPS-/GPU-Messungen: **0**.
- Neue Browser-/Site-/Stage-Checks: **0**.
- Source-Objekte als 3D-isolierte Visual Proofs: **0**.
- Keine Änderungen an privater Game-Runtime, WS1-Gameplay, `DECISIONS.md`, `decisions.json`, Hub-UI, Site oder Public Cloudflare.
- Kein PR, kein Merge, keine Live-Promotion; Research ist **PROPOSAL/HANDOFF**, kein neues V-Urteil und kein LOD-Performance-PASS.

## Unresolved / Deferred
- Welt-/Schatten-/HUD-Pass-Messung auf *aktuellem* Head und kontrolliertem Zielgerät fehlt.
- Unbekannt, ob auf aktiven Branches bereits zusätzliche LOD-Branches/Culling-Patches existieren; bei WS0-Recovery gezielt auf aktuellen Spiel-Head prüfen.
- Per-Instance-Culling und globale vs. regionale Batches müssen gegen bewegte Bounds und konkrete Frame-Performance gemessen werden.
- Material-/Shadow-LOD und Pixel-Schwellen sind Kandidaten, **keine akzeptierten Konstanten**.
- Kein eigenständiges Publikations- oder Georg-Design-Gate erforderlich.

**Ein nächstes Gate:** `WS0_LOD_TRIAGE_IN_V1042_V1043`. WS0 prüft nach dem laufenden Integrationsblock das Dossier mit dem aktuellen Game-Head und integriert einen kleinen Baseline+LOD/Culling-Messversuch in den bereits geplanten Architektur-/Performance-Spike. Nicht vorzeitig in das Spiel übernehmen.
