# RETURN · CLAY_LICHTKANTE_R1 · Stilbild „Lichtkante gebacken“ · 15.11.2026

Auftrag: Georg wählt Option 2 aus RECHERCHE_R1 (CLAY_PSYCHE_LOOK_R1): Knete mit Lichtkante, gebacken.

## Ursache (warum die Dellen nur dunkle Flecken waren, V-1451)
- kfb-clay v1.1 kippt nur Normalen.
- Eine Delle ist eine weiche Gauß-Schüssel mit einem sehr flachen Wulst (rim 0,04 bis 0,1 der Tiefe), und der Wulst liegt nur am Schubende.
- Bei Licht von oben werden deshalb beide Schüsselwände etwas dunkler. Es bleibt ein dunkler Fleck, und eine helle Lippe entsteht nicht.
- GOLDEN_SAMPLES_2D_R1, Regeln 2 und 8, verlangen eine helle Oberlippe, einen Mittelton und eine kühlere Unterseite.

## Kandidat (Stilbild, nicht Kanon)
- Gleiche Dellen-Rechnung wie v1.1, mit vier Änderungen:
  - die Schüssel hat einen flacheren Boden und eine steilere Wand;
  - der Wulst ist etwa viermal so hoch;
  - der Wulst bleibt überwiegend ein Halbmond, mit einem kleinen Ring-Anteil von 0,1;
  - die Delle ist etwas tiefer, die Neigungsgrenze mal 1,5.
- Nur die großen Daumendrücke (dent2) ändern sich, die kleinen Dellen bleiben wie im Kanon.
- Licht, Bühne und Kamera sind die des Clay-Golden (proof-kit v1.1, MESA Tag, ACES 1).
- A und B sind dasselbe Programm, umgeschaltet per Uniform. A rechnet den Kanon-Pfad.
- Kanon-Dateien sind unberührt.

## Runden (eigener Blick, kein Kritiker gelaufen)
- **r1:** zu stark, mit Ring-Anteil 0,25 und Lichtkante auch auf den kleinen Dellen. Gesicht wie Mondkrater bzw. Käse: der bekannte v1.1-Fehler. Verworfen.
- **r2:** zu schwach, kaum ein Unterschied zu sehen (Suchbild). Verworfen.
- **r3:** wird gezeigt. Am Gesicht sind große Daumendrücke mit heller Oberkante zu sehen, ohne Kraterpunkte. Am Boden ist die Lichtkante auch in der Fahrtsicht sichtbar, genau dort, wo Knetkorn R4 keinen Unterschied zeigte.
- **Rest-Risiko:** In mittlerer Entfernung lesen sich einzelne Bodendellen noch leicht als kleine Krater.
- Auf der Meshy-Bühne ist kaum ein Unterschied zu sehen, deshalb wird sie nicht gezeigt.

## Leistung
- **Figuren und Props:** Der Kandidat wird mit clayBake.js (kfb-clay-bake.r1) gebacken wie heute. Im Spiel kostet er dann nichts zusätzlich.
- **Gelände:** läuft live über den Knetkorn-Adapter. Gleiche Schleife, dazu ein pow je Delle. Nicht gemessen.

## Dateien
- `lichtkante.html`: Harness;
- `tests/render.mjs`: Render-Lauf (eigener Server, KFB_CHROME = Playwright-Headless-Shell 1248);
- `evidence/*_r1|r2|r3.png`: die Bildpaare der drei Runden.

## Bei PASS
- kfb-clay v1.2 mit diesem Dellenprofil als neue Datei; v1.1 bleibt.
- Golden-Gates G0 bis G5 laufen erneut, plus ein Krater-Check.
- Dann wird gebacken und am Spiel gegengeprüft, in der Fahrkamera und von vorn.
