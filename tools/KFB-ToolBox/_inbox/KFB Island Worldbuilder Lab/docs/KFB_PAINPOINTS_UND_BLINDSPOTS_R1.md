# KFB Pain Points, Unsicherheiten und Blindspots R1

Stand: 2026-10-09 · Für jeden Punkt steht hier, was wir sehen, was wir wissen, was unklar ist und welcher Recherche-Prompt dazu passt. Priorität A blockiert den MVP, B betrifft Qualität, C kommt später.

## A · blockiert den MVP

### A1 · Sprenkelübergang liest sich nicht überall als Sprenkel (P1)
- **Symptom:** Aus Laufhöhe verschmelzen die Knetflecken zu großen Flächen mit ausgefransten Rändern („klassische Shader-Höhenlogik“). Aus Fahr- und Spielkamera lesen sie sich als Sprenkel. Georg will den Eindruck „Farbe verkleckst, in beiden Richtungen“.
- **Wissen:** `kfbBlend` ist ein Schwellwert auf der Differenz zweier Gauß-Ball-Felder je Zelle (`F = A − B < k(w)`). `kfbLayer` stapelt vier Zellgrößen. Bei mittlerem Gewicht verschmelzen die Felder. R2D zeigt es aus Distanz, dort wirkt es gut.
- **Unklar:** Welche Technik bleibt in jeder Distanz punktförmig? Mögliche Ansätze: diskrete Scheiben je Zelle (Worley bzw. Voronoi-Disks), Mehrskalen nach Bildschirmgröße, Dithering, Stempel-Texturen. Und wie bleibt das auf dem MacBook billig?
- **Referenz-Unsicherheit:** Georg sucht noch das Beispiel heraus, das er meint. R2D ist vielleicht nicht das richtige.

### A2 · Übergänge zwischen Bauwerken wirken gebastelt (P2)
- **Symptom:** Atlas v0.15 FAIL, Bauweise-Blatt bis v5 TUNE. Wurst-Bandenköpfe, Sandbett mit harter Kante, abgeladene Rubbelhäufchen, Fahrbahn-Ausbuchtungen.
- **Wissen:** Inzwischen gibt es Regeln: zwei Randfamilien, gebaute Abfolgen, Verfallsende mit drei gestaffelten Platten, §01.
- **Unklar:** Wie bauen Profis prozedurale Straßen-Übergänge, Kreuzungen, Verziehungen und Bord-Absenkungen aus Bauteilen? Wie hält man Rubbel glaubwürdig, ohne dass es nach Streuung aussieht?

### A3 · Naht Straße ↔ Gelände auf der neuen R2D-Basis (P2, P5)
- **Wissen:** Mit cdt2d auf dem alten Gelände ist sie gelöst, gemessen. Für R2D ist ein analytisches Straßenbett mit Schürze vereinbart.
- **Unklar:** Böschungen in Kurven und an Auffahrten mit Steigung, Brückenwurzeln im neuen Viertelkreis- bzw. Schollenfels, Tunnelportale im Berg.

### A4 · Kamera und Verdeckung (P4)
- **Wissen:** Die Regeln stehen (Arm ≥ 70 %, Sicht-Loch, Kollisions-Kugel). Der Versuch im letzten MVP R4 war verbuggt: Die Kamera lief ins Mesh.
- **Unklar:** Robuste Muster für Third-Person-Kameras in three.js; ein Sicht-Loch mit Knetrand im Shader.

### A5 · Sitz-Fehler im Cabrio
- **Symptom:** FrizzleBob dreht sich um die eigene Achse.
- **Unklar:** Zuständigkeit der Sitz-Schicht und die Ursache im Elternbezug. Das ist kein Recherche-Thema, sondern Debugging.

## B · Qualität

### B1 · Komposition und Erdung (P3)
- **Symptom:** Die Natur der Environment-Sitzung wurde komplett abgelehnt; Proben 1 und 2 FAIL.
- **Wissen:** Story und Physik je Objektart, Zahlen nur als Untergrenze, Regeln in `ETHERINGTON_REGELN_IN_ZAHLEN_R1.md`.
- **Unklar:** Ob die Startwerte stimmen, und wie man Biom-Vorlagen aus den 8 Demo-Szenen ableitet, ohne zu kopieren.

### B2 · Schwebende Inseln: Kante, Unterseite, Wasser (P5)
- **Wissen:** R2D und Scholle v7 sind die Basis. Unterseite v2–v6 sind gescheitert (Drehkörper, Fächer, Symmetrie). Wasserfall F3 und Strand F4 sind noch nicht gebaut.
- **Unklar:** Wasser, das über die Kante fließt; Strand an einer schwebenden Insel; Bucht als echte Strandszene.

### B3 · Fahrgefühl, Loopings, Sprünge, Flug (P4)
- **Unklar:** Arcade-Physik auf Spline-Strecken mit Looping (Haftung, Kamera im Looping), Sprungrampen, ein Geschwindigkeitsgefühl über Rand-Rhythmus, FOV und Speedlines, ein Flugmodus mit Jetpack.

### B4 · Performance mit Knet-Look (P6)
- **Wissen:** Das Natur-Budget ist eingehalten, der Schatten-Pass verdoppelt die Kosten.
- **Unklar:** Wie skaliert das mit 4 Inseln plus Straßen, Bewohnern, Wasser und Sprenkel-Shader? Wann lohnt WebGPU bzw. TSL? Was sollte gebacken und was live gerechnet werden?

### B5 · Maßstab-Disziplin
- **Wissen:** Vertrag K2. Falsche Annahmen sind mehrfach zwischen Sitzungen gewandert (1,9 m, POC- statt Track-Core-Meter).
- **Unklar:** Ein automatischer Maßstabs-Wächter im Lab, der falsche Faktoren erkennt.

## C · später

- **C1 · Freistehende Räume und Fluff-An- bzw. -Abbau:** Zellen-Grammatik, Abschlussstücke, die zurückweichen.
- **C2 · Billboards** mit Video-Loops auf Knet-Oberflächen.
- **C3 · Wind- und Musik-Deformer** für instanzierte Natur, mit Schatten.
- **C4 · Prozess:** Mehrere KI-Sitzungen arbeiten parallel. Es gibt Reibung bei Übergaben, Regeln wandern nicht zuverlässig mit, Kritiker-Läufe sind noch nicht automatisiert.

## Blindspots (wir wissen nicht, was wir nicht wissen)

1. **Lesbarkeit auf Mobilgeräten:** HUD, Sprenkel und Rand-Rhythmus auf kleinen Bildschirmen.
2. **Licht und Himmel:** Es gibt keine KFB-Regel für Tageszeit, Schattenfarbe und Nebel je Insel.
3. **Audio-Räumlichkeit:** Klingt jede Insel anders? Wie gehen Motor und Musik zusammen?
4. **Laden und Streaming:** Wie groß wird die Welt, und was passiert beim ersten Laden im Browser?
5. **Barrierefreiheit:** Steuerung, Untertitel, Farbsehschwäche bei Paletten.
6. **Worldbuilder vs. kuratierte Welt:** Wie bleiben selbstgebaute Inseln innerhalb der Regeln (§00, §01)?
