# KFB World Core R2D · Session-Cut 2026-10-03 · START HERE

Claude-Design-Session vom 02.–03.10.2026. Lieferung als ZIP, kein Push. Die Integration ins Repo übernimmt der Web Lead (siehe `HANDOVER_WSA.md`).

## Lesereihenfolge für einen frischen Chat
1. `00_START_HERE.md`: diese Datei
2. `STATUS.md`: was steht, was FAIL ist, was offen ist (Ehrlichkeitsformat)
3. `INSEL_BAUSTEIN.md`: das modulare Inselmodell als Design-Pattern für die MVP-Slice
4. `SPRINTPLAN.md`: nächste Schritte S1–S5 mit Abnahmekriterien
5. `HANDOVER_WSA.md`: Check-in-Pfad, Pins, Aufträge an WSA
6. Details: `KFB_R2D_v0/RETURN.md` (Nachträge 1–15), `KFB_R2D_v0/KONZEPT_SCHOLLE_v7.md`, `KFB_R2D_v0/FAIL_UNTERSEITE_v2-v6_2026-10-03.md`, `KFB_R2D_v0/WATER_CONCEPT.md`

## Was im Paket liegt
| Pfad | Was |
|---|---|
| `KFB World Core R2D v0 Insel.dc.html` | Insel-Viewer: eine Knet-Insel, Straße aus dem Track Core, 5 Biome, Ansichten, Masken |
| `KFB_R2D_v0/island.js` | Inselbau: Plan, Masken, Gelände, Unterseite (v6, FAIL), Dekoration, BIOMES-Tabelle, Bühne |
| `KFB Scholle Bench v7.dc.html` + `KFB_R2D_v0/scholle-bench.js` | **Neuer Inselkörper v7 „Scholle“**, isoliert. 8 Benchmarks nachgestellt, ein Mesh je Insel, 5–10 ms |
| `KFB_R2D_v0/benchmark-silhouetten.json` | aus den Benchmark-Bildern gemessene Silhouetten (Oberseite, Körper, Profil, Unterkontur) |
| `KFB World Core R2D S0 Quellen.dc.html` + `KFB_R2D_S0/bench.js` | Source Board: alle Quellen mit Pin, `importPinned()`, `RAW()`, `JSD()` |
| `KFB_R2D_v0/evidence/` | Screenshots der Vorschau (Belege zu RETURN) |
| `KFB_R2D_v0/BRIEF_WSA_*.md` | Aufträge an WSA: Fluid-Shader (Card Lab v2), Knetstrang-Baustein (Joyride) |
| `ASSET_MANIFEST.json` | alle Modelle und Texturen als SourceRef mit Commit-Pin, **keine Binärdateien** |
| `support.js` | Laufzeit der .dc.html-Seiten (gehört neben die Seiten) |

## Starten
Den Ordner über einen lokalen Webserver ausliefern (`npx serve .`) und die .dc.html öffnen. Modelle kommen per raw-URL mit Pin, Module über jsDelivr/unpkg (three@0.160.0). Ohne Netz bleibt die Seite schwarz.

**Nicht im Paket:** die 8 Benchmark-Bilder (`uploads/DioramaScenes A–I*.webp`, Georgs Referenzmaterial). Die Bank zeigt deshalb im Export kein Vergleichsbild in der Kachelecke, die Messwerte stehen in `benchmark-silhouetten.json`.

## Regeln, die hier gelten (CLAUDE.md, Kurzfassung)
Keine Asset-Kopien, nur Pins. Module über jsDelivr, Daten über raw. Messen und hinsehen: Zahlen allein sind kein Beweis, Georg entscheidet am Bild. Kein zweiter Renderer und kein zweites Register. Veröffentlichtes wird nicht überschrieben, Neues kommt als eigener Kandidat daneben. Nicht Gelaufenes heißt NOT_TESTED.
