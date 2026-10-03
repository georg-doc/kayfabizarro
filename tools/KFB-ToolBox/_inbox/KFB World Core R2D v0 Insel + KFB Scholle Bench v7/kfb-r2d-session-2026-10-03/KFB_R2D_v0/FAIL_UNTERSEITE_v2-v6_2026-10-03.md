# FAIL · Inselunterseite v2–v6 · 2026-10-03

Status: **FAILED**, Georg 03.10. Der Code bleibt nur als Spender in `island.js` (`buildBody`, Unterseiten-Schleife). Die Unterseite wird nicht weiter getunt.

## Was gebaut wurde
| Stand | Bauweise | Georgs Befund |
|---|---|---|
| v2 | Drehkörper „Rübe“ um den Mittelpunkt | unnatürlich, Spitzen-Bug, Nähte |
| v3/v4 | Drehkörper + Kegel als Höhenfeld | Sack ohne Tiefe, Sandkasten-Förmchen, symmetrisch, Fächer |
| v5 | Abstandsfeld + Marching Cubes, Kegel schräg | Ausläufer seitlich angeklebt |
| v6 | Abstandsfeld, Scholle verjüngt, Kegel senkrecht | noch schlechter: Knubbel an der Spitze, Zapfen wie Würste, grauer Kantenring, Körper stößt an der Straße durch |

## Ursachen
1. **Kein Modell vor dem Bau.** Jede Runde hat eine neue Technik ausprobiert und dann an Parametern gedreht. Die Benchmarks waren angesehen, aber nicht vermessen.
2. **Drei getrennte Teile, die sich nur ungefähr treffen.** Oberseite (Höhenfeld), Kantenring (eigene Ringe) und Felskörper (Volumen) wurden getrennt gebaut und überlappen. Daraus kommen Nähte, der graue Ring, die Stufe am Wasserfall und Körper, die durchstoßen.
3. **Falsche Proportion.** Die Unterseite war 0,6 × Inseldurchmesser tief, die Benchmarks liegen bei 0,2–0,35 (siehe Konzept v7).
4. **Falsche Bauart der Spitzen.** Die Benchmarks haben keine angesetzten Zapfen. Ihre Spitzen sind Ecken EINES facettierten Körpers, die nach unten gezogen sind. Angesetzte Kegel, Kugeln und weiche Vereinigung ergeben Würste und Knubbel.
5. **Teuer.** Marching Cubes 96³ brauchte 3–4 s je Insel, weit über jedem Budget.

## Regel daraus
Erst Geometrie vermessen und ein Modell aufschreiben, dann isoliert bauen und von der Seite ansehen (CLAUDE.md Regel 7). Erst danach in die Insel einbauen.
