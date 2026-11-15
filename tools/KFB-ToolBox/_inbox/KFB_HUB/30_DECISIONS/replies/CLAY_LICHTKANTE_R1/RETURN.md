# RETURN · CLAY_LICHTKANTE_R1 · Stilbild „Lichtkante gebacken“ · 15.11.2026

## Korrektur 15.11. (Georg über WS0, V-1832): FB nur aus der SSOT
- **Fehler:** Das erste FB-Bild (`fb_face_r1..r3`) kam vom alten Clay-Golden. Dessen proof-kit lädt `FB_TEMPLATE_LOOK_v5b.glb` und blendet `FB_Eye_[LR]` aus. Deshalb fehlten die Augen. Die Bilder sind ungültig und gehen nicht mehr raus.
- **Neu:** `fb_ssot_face_r3.png` und `fb_ssot_full_r3.png`. FB kommt aus `appearance.export.v.web` = `FB_WEB_KANON.r1i.glb` (Stamm @c3789d36, assets/private), geladen mit GLTFLoader und MeshoptDecoder. Der Mund steht über `fb_mund.v2.js` auf Ruhe („neutral“, Satz yellow_buck). Vergleich „Datei | Look: Lichtkante“.
- **Look nur auf der Haut** (Materialien FB_Yellow und KFB_Tail_Clay, 9 Netze). Augen, Lider, Brauen, Nase, Mund und Shirt behalten ihr Material aus der Datei. Ein Licht-Rig, kein Randlicht, kein Fresnel.
- **Wie der Look entsteht:** Auf der Look-Seite wird die gebackene Knet-Normale der Datei durch Live-kfb-clay v1.1 mit Lichtkante ersetzt, damit das Relief nicht doppelt liegt. Die Marmorierung ist aus, denn sie steckt schon in der Textur. Der Unterschied ist also gebackener Kanon gegen Live-Kanon mit Lichtkante. Laut WSB weicht die Datei 1,6 bis 3,2 von 255 vom Spiel ab, also ist der sichtbare Unterschied im Wesentlichen die Lichtkante.
- **Kanon-Wache** im Code vor jedem Bild, auf beiden Seiten PASS: beide Lederhäute, beide Pupillen, beide Lidhäute, beide Brauen, Nase, beide Ohren, Schwanz, Mund in Ruhe; kein Teil hat sein Material getauscht. Ich habe die Bilder selbst angesehen.
- **Befund für WS0:** In r1i tragen `KFB_Tail_Bunny` und `KFB_Shirt_FB` noch `userData.kfbClayOrig` aus dem Spiel (glTF-Extras). `applyClay` und `removeClay` setzen dann ein JSON-Objekt statt eines Materials ein: Absturz bzw. falsches Material bei jedem, der auf die Datei Knete anwendet. Im Harness wird der Eintrag nur im Speicher entfernt; die Datei ist unverändert. Fix gehört in den Web-Export (Extras säubern).

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
