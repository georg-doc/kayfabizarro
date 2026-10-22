# Insel-Anatomie · gemessen an den StreakByte-Basis-Modellen (2026-10-08)

Gemessen in `/originals.html` mit `__kfb.analyze(id)` an acht Basis-Modellen (Hafen, Fluss, Garten, Strand, Höhle, Eis, Teich, Wald). Alle auf 60 m Breite (W) normiert. Rohdaten: `tools/out/measure.json`.

## Messwerte

| Insel | Platte / W | Tiefe unter der Platte / W | Zapfenspitzen | mittlere Kantenlänge / W | Dreiecke |
| --- | --- | --- | --- | --- | --- |
| Hafen | 0,026 | 0,43 | 6 | 0,068 | 1.585 |
| Fluss | 0,013 | 0,44 | 2 | 0,068 | 1.156 |
| Garten | 0,037 | 0,51 | 22 | 0,087 | 700 |
| Strand | 0,041 | 0,51 | 3 | 0,053 | 3.001 |
| Höhle | 0,023 | 0,43 | 5 | 0,064 | 1.615 |
| Eis | 0,019 | 0,46 | 13 | 0,031 | 9.991 |
| Teich | ~0 | 0,52 | 27 | 0,050 | 2.402 |
| Wald | 0,037 | 0,51 | 34 | 0,107 | 576 |

Breite der Unterseite (Anteil des Inselradius) bei 0 / 10 / 20 / … / 100 % der Tiefe, Mittel aus Hafen, Strand, Höhle, Eis, Teich, Wald:

`1,0 · 0,9 · 0,82 · 0,74 · 0,67 · 0,59 · 0,53 · 0,44 · 0,37 · 0,27 · 0,17`

## Die Bauregel

1. **Dünne Platte.** Grasnarbe 2–4 % von W, darunter sofort Erde. Keine dicke Plattenwand.
2. **Tiefe Masse.** Die Unterseite ist fast **halb so tief wie die Insel breit** (0,43–0,52 W). Meine Versuche waren mit 0,3 W viel zu flach.
3. **Gleichmäßige Verjüngung.** Die Breite nimmt fast linear ab, etwa 7–8 % des Radius pro Zehntel Tiefe. Die Flanken sind gerade bis leicht gewölbt, nie ein Teller mit Spitze.
4. **Tropfsteinfeld statt Spitze.** Die Oberfläche der Masse bricht in viele hängende Zapfen auf: 5–35 lokale Tiefpunkte, verteilt über 10–90 % des Radius, auf Tiefen zwischen 25 und 100 % (die meisten zwischen 50 und 100 %). Der tiefste Punkt liegt außermittig (7–56 % des Radius).
5. **Große Facetten.** Mittlere Kantenlänge 3–11 % von W, 600–3.000 Dreiecke pro Insel. Flache Schattierung.
6. **Ein geschlossenes Mesh.** Keine angehängten Einzelteile, keine Lücken.

## Wie der Generator das baut

- Grundkörper: Ringe vom Umriss nach unten, Breite nach der gemessenen Kurve.
- Tropfsteinfeld: Die untere Fläche wird in Zellen geteilt (Voronoi). Jede Zelle bekommt einen eigenen Tiefpunkt in zufälliger Tiefe nach der gemessenen Verteilung. Die Fläche wird dorthin gezogen, sodass viele unterschiedlich lange Zapfen entstehen, alles in einem Mesh.
- Prüfung: dieselbe Messfunktion auf die generierten Inseln, Abweichung zu den Originalwerten als Zahl.
