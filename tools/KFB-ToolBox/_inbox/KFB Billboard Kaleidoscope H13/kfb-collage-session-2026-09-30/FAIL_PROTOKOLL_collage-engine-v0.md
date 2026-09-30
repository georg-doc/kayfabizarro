# FAIL · Collage-Engine v0 · Bildqualität

Datum 30.09.2026 · Urteil Georg: „FAIL“, „vorher um Klassen besser und viel weniger AI-Slop-Design“.
Befund am Bildschirmfoto im Leitstand (Seed-Lauf, Einstellung 10, 1280×720).

## Was im Bild falsch ist

- Die Plakatschrift (Bungee-Familie, Versalien) ist die Standardschrift jeder Generator-Demo. Sie trägt keine Haltung.
- Werbezeile „CELESTIAL LOYALTY · ONLY 101“: zufällig zusammengesteckte Wörter. Da ist keine Pointe, nur Kombinatorik. Bedeutung entsteht so nicht im Kopf, es entsteht Rauschen.
- Held: gelb-oranges Raster auf einem Motiv, das man nicht erkennt. Der Effekt ersetzt das Bild, statt es zu zeigen.
- Grund: ein weichgezeichneter Zwischentitel („Principal Cast“) als Tapete. Drei Ebenen konkurrieren, keine führt.
- Farbe: Orange auf Sepia ist Paletten-Zufall, keine Entscheidung.

## Ursache (Grundlage, nicht Pixel)

0. **Die Engine wurde neben H4 gebaut statt auf H4.** H4 (`KFB Billboard Kaleidoscope H4.dc.html`) ist seit 26.09. PASS: Ebenen mit Kamera, Songform, Muster, Typo-Behandlungen, Unähnlichkeits-Auswahl. `docs/BRIEFING_fresh-chat_billboard-H5.md` schreibt vor: H5 ist eine Kopie von H4, ein Slice je Lauf. Die Collage-Engine v0 hat dieses Briefing ignoriert und den Collage-Charakter durch einen eigenen Würfel ersetzt. Kreise und Rechtecke als Masken, Geflacker und fehlende Design-Linien sind die Folge (Georg, 30.09.).
1. Die Regelwerke würfeln Schrift, Effekt, Palette, Textmodus und Mischmodus unabhängig voneinander. Jede Kombination ist erlaubt, also sieht jede nach Generator aus.
2. Die Leitplanken G1–G6 messen Lesbarkeit und Wiederholung, nicht Qualität. Die Zahlen vom 27.09. (289 von 300 Kombinationen einmalig, Kontrast 9,2:1) wurden als Erfolg berichtet. Das verstößt gegen Projektregel 7: Einmaligkeit von Slop ist kein Beweis.
3. Der Textgenerator setzt Werbevokabeln kombinatorisch zusammen, statt aus einem geschriebenen Satzbestand zu ziehen.
4. Der Manifest-Pfad hat am 30.09. zusätzlich ein 4-KB-Vorschaubild als Held zugelassen (behoben: `minEdge` 640 px). Das hat das Bild verschlechtert, ist aber nicht die Ursache.

## Status

Collage-Engine v0: **FAILED CANDIDATE**. Nicht weiterbauen, nicht an Billboards anschließen.
Weiter geht es auf H4: `KFB Billboard Kaleidoscope H5.dc.html` (30.09.) ist eine Kopie von H4, geändert ist nur der Materialzugang (LoC-Platten + PD-Manifest am Pin). H4 und die Engine-Dateien bleiben liegen; verloren ist nichts.
Der Pool-Code (Manifest 0.2, Pin, `minEdge`) und das Briefing R2/R3 bleiben davon unabhängig gültig.

## OPEN · Grundlage klären, bevor gebaut wird

- Welche Referenz war „um Klassen besser“? (Effekt-Labor, Hypernormalisation H1, B2b-Kandidat oder ein früherer Stand der Engine)
- Vorschlag zur Prüfung: wenige, geschriebene Kompositionsregeln (eine Schrift, ein Bild, ein Satz, höchstens ein Effekt) statt eines Würfels über alle Parameter. Texte aus einem von Georg freigegebenen Satzbestand.
