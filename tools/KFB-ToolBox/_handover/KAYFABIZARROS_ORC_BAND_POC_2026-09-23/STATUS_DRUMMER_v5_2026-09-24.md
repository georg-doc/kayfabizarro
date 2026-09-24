# STATUS · Orc-Band / Trommler · 2026-09-24 (Stand zum Einchecken)

**Kurz:** Leader, Gitarrist und Gitarre A auf dem Raider sind abgenommen. Der Trommler v5c (stehend) ist Georgs **Arbeitshypothese**. Die Grundidee stimmt, die Bewegung wirkt aber noch hölzern und roboterhaft und braucht einen Feinschliff. Er ist noch nicht ins Band-Modul eingebaut.

## Band
| Figur | Stand |
|---|---|
| Leader (Legacy Orc B, Hüpfen) | Georg OK |
| Gitarrist (ORB-P1 v4 hold) | Georg OK |
| Gitarre A auf dem Orc Raider (Mixamo, tief gehängt) | Georg OK („passt so“) |
| Trommler (Orc Brute) | **v5c = Arbeitshypothese**, Feinschliff offen |

## Trommler: wie es dazu kam
- v1–v4 prozedural, Mixamo v1/v2 und v3 (8°-Griff): gescheitert, dokumentiert in `mixamo/`.
- v4: Griff korrigiert, die Keule läuft quer durch die Faust. Beim Ausholen gestoppt, weil die Keulen mit dem sitzenden Mixamo-Körper kreuzten oder durch den Kopf gingen.
- v5 (Georgs Entscheidung): stehender Körper aus „Breathing Idle“, Körpereinsatz beim Ausholen und Schlagen.
- v5c (nach Georgs Skizze):
  - beim Schlag +20° Unterarmdrehung, damit der Keulenkopf auf das Fell kippt
  - beim Ausholen höher, die Innenseite der Faust zeigt nach vorn
  - Unterarm-Grenzen im Rig auf den genutzten Bereich gesetzt

## Messwerte v5c (48 Frames, im fertigen Rig gemessen)
- Keulenkopf beim Treffer 1–2 cm über der Fellmitte, beim Aufsetzen höchstens 8 mm eingetaucht.
- 0 Kollisionen: Keule gegen Kopf, Körper oder andere Keule, Arme gegen Trommel.
- Ellbogen 67–104°, Unterarmdrehung −55° beim Treffer bis +100° beim Ausholen.
- Loop über 2 Schläge mit 24 Frames pro Schlag, passend zum `beatClock` in `module.json`.

## Offen (Feinschliff, ohne das Gesamtbild umzubauen)
- **„Hölzern“:** Die Bewegung braucht mehr Nachschwingen und Überlappung. Keule, Handgelenk und Schulter dürfen nicht gleichzeitig ankommen, der Körper soll nachfedern, und nach dem Treffer braucht es einen kurzen Rückprall.
- Ausfallschritt als Akzent-Clip.
- Einzelschläge rechts und links als eigene Clips, für Musik ohne festen Takt.
- Einbau ins Band-Modul (`module.json`, GLB).

## Dateien
- **Repo (dieser Branch):** `mixamo/v5/` mit RETURN, Skripten, Videos, GLB und Messdaten.
- **Dropbox `BLENDER MCP/ORB/`:** `DRUMMER_v5_STEHEND.blend`, `drummer_v5_stehend_loop2.glb`. Zwischenstände: `DRUMMER_v3_DAUMEN_INNEN.blend`, `DRUMMER_v4_WIP_HAMMERGRIFF.blend`.
- **Review-Seite:** Artifact „Trommler v5“.
