# Insel-Baukasten: Rampenhöhen und Anschlussprüfung

Die Höhenprüfung ist implementiert und lokal getestet. Sie verhindert, dass eine passende Kantenfarbe einen falschen Höhenanschluss verdeckt. Die kleine Stufe zwischen Strand und Rampe ist **nicht repariert**, sondern jetzt ausdrücklich als Übergangsbedarf dokumentiert.

## Gewählte Größenverhältnisse

Georg wählt A: Die Miniszenen behalten den logischen Hex-Maßstab, Kachelbreite 2. Kein pauschales Vergrößern auf WC1-Meter. Nur der P0B-Baumadapter war aus der Quellhöhe abgeleitet; die übrigen nach Augenmaß bestimmten Prop-Faktoren bleiben Kandidaten.

## Technische Rückgabe (für Ausführende, nicht als Georg-Entscheidungsformular)

- Auftrag: `HEX-CATALOG-LEVEL-SLOPE-01`
- Executor: Codex / WSA · Modell: GPT-6.1 Sol · Reasoning: high.
- Repo: `georg-doc/kayfabizarro`.
- Branch: `wsa/hex-catalog-level-slope-2026-10-02`.
- Draft PR: https://github.com/georg-doc/kayfabizarro/pull/320
- Basis: `blender-mcp/hex-blender-bench-2026-10-02` @ `fe45e3fbafec9180cd41a15ae824ee55af74e084`.
- Verifizierter Implementations-Checkpoint: `26d6a5b22a4c3f32cc1ef2f14346a71ea1e74fc3`.
- Nachfolgender Dokumentations-Head: exact PR head + Production-Control RETURN; kein erfundener selbstreferentieller Commit im Dokument.
- Owner bleibt `tools/world_atlas/source/lib/hex-grid.js`; `hex-levels.mjs` ist dessen additiver Daten-/Prüfhelfer, kein Generator oder zweiter Solver.
- Status: `ADDITIVE_CONTRACT_PASS · BROWSER_EDGE_GATE_PENDING`.
- Stage: **nicht angelegt**, gemäß Auftrag kein Stage/Live. Keine neue Darstellung oder FPS-Messung behauptet.

## Was sich geändert hat

1. Das bestehende `hexTiles`-Objekt in `data/HEX_BROWSER_MEASUREMENTS.json` erhält pro Hangkachel `verticalTopology`: sechs originale gemessene Höhen, Minimal-/Maximalhöhe, Mittelpunkt, Tiefkante, Quelle, Einheit und Messumfang.
2. Alle sechs Rotationen drehen Höhen und Tiefkante wie die bestehende `rotKinds`-Konvention. Die Richtungssymmetrie beträgt sechs, auch wenn die Gras-Kantenfarben rotationssymmetrisch sind. **Nicht** anhand der alten Farbsymmetrie Rampenorientierungen zusammenfassen.
3. `auditTileFit` prüft zusätzlich Höhen, sobald gesetzte Kacheln `verticalTopology` tragen oder `requireVertical:true` gesetzt wird. Alte Aufrufe ohne Höhen bleiben unverändert.
4. `compareVerticalEdges` unterscheidet passend, expliziten Übergangsbedarf, unpassend und ungeprüft. Profilwerte an gegenüberliegenden Kanten werden in entgegengesetzter Tangentenrichtung verglichen. Ein passend gemessener Mittelpunkt allein setzt niemals `safeToPlace:true`.
5. `SEAM_REPORT.json` übernimmt die fünf echten Blender-Messpunkte der Strand-Rampen-Fuge. Mitte 0.09, maximal 0.199 native Einheiten. Empfehlung ist **ein lokaler gemessener Übergang inklusive Kollisionsfläche**. Eine rein optische Schürze würde die begehbare Stufe nicht entfernen. Keine globale Kachelverschiebung, kein bloßes Erhöhen der Fehlertoleranz.

## Bewusst noch nicht freigegeben

Die Original-Blender-Probe misst bei Radius 0.9 innerhalb der Kachel sechs Kantenmitten und den Mittelpunkt. Das ist keine lückenlose Kantenkurve. Daher bleiben die vier Hangkacheln `PREPARE`, auch nach dem bestandenen Datentest. Vollständige Profile, Eckenkontakte und der tatsächliche Übergang sind noch im bestehenden Browser-Messowner zu ergänzen. Fehlende Daten für andere Kacheln werden nicht als ebener Boden erfunden.

Die alte S1-Farb-/Kantenmessung, ihre Kalibrierung und ihre 15/15 Rückgabefakten wurden nicht geändert oder neu ausgeführt. Die Prüfung erhält ihre Tatsachen; sie ist kein neuer Browser-PASS.

## Prüfungen und Reproduktion

- **50/50** lokale Node-Daten-/Topologieprüfungen PASS, keine übersprungenen Tests.
- **6/6** Implementationsdateien nach dem GitHub-Schreibvorgang vollständig bytegleich zurückgelesen.
- Remote-Git-Tree = lokal getesteter Git-Tree: `8036a02290f7fd149440922c70e86dc6009d1905`.
- `git diff --check` PASS vor Sicherung.
- Node-Test isoliert den unbenutzten Three-Grafikimport explizit; kein Renderer/GPU/WebGL-Test darin.
- Reproduktion im Repo-Root: `node --test tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/LEVEL_SLOPE/hex-levels.test.mjs` (Node 24).
- `update-catalog.mjs` ist ein deterministischer Rebake aus den gepinnten Blender-Fakten; er schreibt keine Dateien selbst. `--patch` erzeugt einen additiven Patch für den Dateieditor. Kein zweiter gepflegter Katalog.

## Exakt geänderte Dateien

- `tools/world_atlas/source/lib/hex-grid.js`
- `tools/world_atlas/source/lib/hex-levels.mjs`
- `tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/data/HEX_BROWSER_MEASUREMENTS.json`
- `tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/LEVEL_SLOPE/SEAM_REPORT.json`
- `tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/LEVEL_SLOPE/hex-levels.test.mjs`
- `tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/LEVEL_SLOPE/update-catalog.mjs`
- `tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/LEVEL_SLOPE/RETURN.md`
- `tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/LEVEL_SLOPE/TEST_RESULT.json`
- `skills/chat/START_HERE.md`
- `skills/chat/REGISTRY.json`
- `skills/chat/CHANGELOG.md`

## Nächster Schritt ohne neue Georg-Fragerunde

Browser-Ausführender ergänzt zuerst komplette Kantenprofile mit den tatsächlichen Originalmodellen und derselben Raster-/Rotationskonvention. Alle sechs Orientierungen und die Strand-Rampen-Fuge prüfen. Keine Freigabe allein aufgrund einer Kantenmitte oder einer optischen Schürze. Anschließend die vorhandenen drei Miniszenen im **gewählten Maßstab A** für Instanzierung, Baumfamilien und leichtes Knetmaterial messen; Weltmeter-Vergleich höchstens als klar benannte Diagnose, nicht als wieder geöffnete Entscheidung. Hub-Syntaxreparatur separat weiterlaufen lassen. Kein Merge durch diesen Auftrag.
