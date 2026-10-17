# Vorschlag an WS0 · Arbeitsteilung WSB ↔ WS1 · Dioramen ins Gelände · 2026-10-17

Georg, 17.10. (Chat WSB): „Was könnte WS1 übernehmen, weil es dort kein Blender gibt? Dann können wir uns hier auf die reinen Blender-Jobs konzentrieren.“
WS1 hat gerade einen Browser-Test laufen (ca. 40 Min). Danach soll das eingereiht werden. **WS0 entscheidet und routet**, WSB schreibt nicht direkt an WS1.

## Faustregel
- **WSB:** alles, was am Original-Mesh (Millionen Dreiecke) oder in Blender passiert. Das ist Geometrie, die im GLB landet: Dezimieren, Backen, Umfärben, neue Bauteile modellieren, Unterseiten säubern.
- **WS1:** alles, was zur Laufzeit im Spiel passiert: Gelände um die Bühne, Platzieren, Licht und Schatten, Abnahme-Bilder im Spiel. Dazu Messungen, die per Strahl im Browser gehen.
- **Ein Ort für die Mathematik:** Die Streu- und Gruppenregeln (Fluff `grounding.ts nest()` 1 : 3 : Rest, Größen 1 : 0,62 : 0,38, R2-Regeln) gelten auch für Übergangssteine. Kein zweites Regelwerk.

## An WS1 (kein Blender nötig)
1. **Gelände-Schürze je Bühne** (V-341 Schritt 4, V-396):
   - Höhenfeld trifft die Bühne ohne Stufe auf `groundY_u` (B7: 0,0238 u = 0,10 m, gemessen);
   - flache Dünen und Verwehungen nach außen;
   - Farbübergang 3–8 m aus der `edgePalette` in die Zonen-Bodenfarbe;
   - Georg schiebt nur nach, er modelliert nicht.
2. **Übergangssteine platzieren** (nicht bauen):
   - Steine aus dem WSB-Steinkit (siehe unten);
   - Gruppen statt Reihen, die größten Steine nahe an der Bühne, nach außen kleiner und seltener;
   - 30–60 % im Boden versenkt, jeder Stein berührt den Boden;
   - Drehung und Größe zufällig;
   - Gruppenregel aus dem Fluff (`nest()`), keine Eier-Optik.
3. **Schwebe-Messung im Browser für alle Bühnen:**
   - Strahlenraster von unten, mit three-mesh-bvh wie die WSB-Proof-Seite; Ergebnis `groundY_u` je Bühne;
   - Methode: `50_BLENDER/B7/scripts/b7_ground_gap.py` (98 % der Unterseite statt tiefstem Punkt).
   - Das spart WSB-Läufe, weil die Browser-GLBs reichen.
4. **Abnahme im Spiel:**
   - Bilder mit echter Sonne, Schatten nach V-392, gleiche Kamera-Marken;
   - Vorher/nachher je Bühne mit Gelände.
   - Die WSB-Proof-Bühne bleibt flach und ist nur für Modell-Vergleiche da.

## Bei WSB (Blender)
1. **Steinkit „Geröll und Ruinenbrocken“ in Knete** (WS0_TO_WS1: „Steine-Kit folgt mit dem Blender-Lauf“, bisher nicht gebaut):
   - etwa 12–16 Formen: flache Platten, Kantenbrocken mit abgerundeten Schnitten, halb verschüttete Mauerstücke, Kiesel-Nester; **keine Eier oder Kugeln**;
   - Unterseite flach bzw. mit Einsink-Zone, damit sie im Boden stecken;
   - Farbe pro Bühne aus der `edgePalette` (Vertex-Farbe oder Tönung zur Laufzeit), Relief über K1;
   - Anker-Daten je Stein: Einsinktiefe, Ausrichtung, Größenklasse.
   - Proof: Bilder auf der Knete-Bühne, ein Satz pro Bühnen-Palette.
2. **B8 Detail-Schutz beim Dezimieren** für die übrigen Meshy-Bühnen:
   - Detailstellen automatisch finden;
   - gleiche Dreieckszahl, Normal-Bake vom Original;
   - Reihenfolge nach STAGES_BATCH_R1-Schäden.
   - Siehe STATUS 17.10.
3. **Unterseiten säubern** (bei B8 mit): einzelne Spitzen, die tiefer ragen als der Sockel, wegschneiden oder anheben, damit `groundY` sauber ist und nichts durch die Schürze sticht.
4. **Wie bisher:** Rahmen-Tuning B7 (später), Augen-Anker, Backen, de-lit Texturen.

## Warum das Tokens spart
- WSB rendert keine Spielszenen mehr nach, das ist WS1-Abnahme.
- Messungen, die per Strahl gehen, laufen bei WS1 im Batch über alle Bühnen statt einzeln im WSB-Chat.
- WSB liefert nur noch GLB + Daten + Vergleichsbilder. Georg sieht das Gesamtbild einmal im Spiel statt doppelt.

## Bitte WS0
- Freigabe ja/nein und Reihenfolge: Steinkit vor B8?
- WS1 die Punkte 1–4 nach dem laufenden Browser-Test einreihen.
- Format der Steinkit-Anker-Daten mit WS1 abstimmen. Vorschlag: `kfb.stone-kit/1` mit `sinkMin/Max`, `sizeClass`, `upAxis`.
