# STATUS · Session-Cut R2D · 2026-10-03

Format: SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN

## Insel-Viewer R2D v0 (`KFB World Core R2D v0 Insel.dc.html`, `island.js`)
| Teil | IMPLEMENTATION | TESTED RESULT (Claude-Vorschau) | GEORG ACCEPTANCE | OPEN |
|---|---|---|---|---|
| Oberseite, ein Mesh, Farb- und Maskenkarte 1024² | ja | PASS Seeds 1–4 | Richtung gut | Facettengrad |
| Straße aus Track Core 0.8.1, Straßenbett, Bordkante, Brüstung | ja | PASS | gut | Joyride-Knetstrang-Look (WSA-Auftrag) |
| Masken (Fahrbahn, Gehweg, Plätze, Gebäude, Vegetation, Rand) | ja | PASS | – | – |
| 5 Biome (Burg, Utopia, Dystopia, Protopia, Schnee): Palette, Pflanzen, Gelände, Landmarke, Himmel | ja | Burg, Utopia, Dystopia, Schnee im Bild | Biome-Logik gut | Protopia NOT_TESTED im Bild |
| Schnee bis zur Kante, kein Rand-Wall | ja | im Bild geprüft | offen | – |
| Landmarken (Hexagon Pack) ohne Verformung | ja | ganz, Fahne sitzt | „cool, aber zu eckig, passt nicht zum Knet-Look“ | rundere Knete ohne Zerreißen (S3) |
| Platzierung Bäume (nicht auf Straße, nicht im Bach) | ja, RETURN (9) | im Bild geprüft | offen | – |
| **Unterseite v2–v6** | ja | – | **FAIL** | ersetzt durch Scholle v7 (S2) |
| Wasser, Bach, Wasserfall | Platzhalter | – | zurückgestellt | WATER_CONCEPT + Fluid-Shader von WSA (S4) |

## Scholle v7 (`KFB Scholle Bench v7.dc.html`, `scholle-bench.js`)
| Teil | Stand |
|---|---|
| SOURCE | 8 Benchmark-Bilder (Georg), vermessen: `benchmark-silhouetten.json`, `evidence/benchmark-masken.png`, `evidence/benchmark-kanten.png` |
| DECISION (Georg) | weich über den Facetten (Knete bevorzugt, wenn performant) · kein Steinband · keine Bodenplatte als eigenes Teil · zuerst die 8 Benchmarks nachstellen |
| IMPLEMENTATION | ein Mesh: Oberseite mit Farbbändern → senkrechter Rand → Ringe 32 → 4 Ecken → Hauptspitze. Zacken = gezogene Ecken. Knete = Unterteilung + Taubin, Oberseite bleibt eben |
| TESTED RESULT | 8 Inseln, 5–10 ms je Insel (statt 3–4 s Marching Cubes). Automatische Nachführung an die Benchmark-Silhouetten: **FAIL, abgeschaltet** (RETURN 15) |
| GEORG ACCEPTANCE | 03.10.: „sieht schon jetzt nicht schlecht aus, können wir noch optimieren“. Richtung angenommen, Form nicht final |
| OPEN | Knete-Material v10 fehlt in der Bank · Oberseite ohne Gelände · Einbau in die Insel (S1/S2) |

## EXPORT
Dieses ZIP. **PUBLIC DEPLOYMENT:** keines. **NOT_TESTED:** GPU auf Georgs Gerät, Mobil, Langzeit-Fahrt-Kamera, Export lokal außerhalb der Claude-Vorschau.
