# PLAN · WS-Design · Günstigerer Bodenmaler (deckGround) · R1 · 04.11. · an WS0

Gebaut wird später; WS0 gibt den Zeitpunkt vor.
Heute malt `paintSheet` (src/look/hnGround.js) das Bodenblatt einer Zone auf dem Hauptfaden: 2048 px, Feld für Feld, je Feld ein Bild Pause.
Das hat zwei Folgen:
- Dichte Raster sind zu teuer. 24 Bänder brachten den Tab beim Malen zum Absturz.
- Die Schrift ist darum so groß, wie sie heute ist.

## Ziel
- Das Blatt malt abseits des Hauptfadens, ohne Ruckler.
- Dichtere Raster sind möglich, also Schrift in Straßengröße.
- Eine besuchte Zone wird nie zweimal gemalt.

## Bau
1. **Worker mit OffscreenCanvas:** Neue Datei `src/look/hnGroundWorker.js`; sie ruft dieselbe `paintSheet` auf, in einer Fassung ohne DOM.
   - Die Schriften lädt der Worker über `self.fonts` mit FontFace; die Dateien sind dieselben wie heute (src/vendor/h15-fonts).
   - Kartenbilder und Himmelskörper gehen als ImageBitmap hinein, übertragen statt kopiert.
   - Zurück kommt das fertige Blatt als ImageBitmap (`transferToImageBitmap`). Das Hochladen in Streifen (sheetUpload) bleibt wie heute.
   - Ohne Worker-Unterstützung oder bei einem Fehler im Worker malt der heutige Weg auf dem Hauptfaden, mit dem heutigen Raster.
2. **Speicher:** Je Feld wird dieselbe Arbeitsfläche wiederverwendet, statt je Feld eine neue anzulegen (heute `mk(W, H)` je Feld). Der Bild-Cache wird kleiner (16 statt 48). Das war die wahrscheinliche Ursache des Absturzes bei 24 Bändern.
3. **Schrift nur ohne Bebauung:** `schrift` folgt der Zonenart.
   - Schrift gibt es auf freiem Gelände, Feldern und Plätzen.
   - Kein Text in Viertel, Gefängnis-Labyrinth und Zonen mit dichten Props; dort nur Muster und Farbe (Schalter seit @1b778e9e).
   - Wo Schrift steht, ist das Raster dichter (Datenwert `baender_mit_schrift`, Vorschlag 16) und die Schrift in Straßengröße.
4. **Cache je Deck und Zone:**
   - Das fertige Blatt kommt als WebP-Blob in die IndexedDB, Schlüssel `deck|zone|Version der Zeichenregeln`.
   - Beim Wiederkommen wird nur dekodiert, nicht neu gemalt. Im Speicher bleiben wie heute höchstens `keep` = 3 Blätter.
   - Steigt die Version der Zeichenregeln, wird neu gemalt.
5. **Kopfüber-Schrift:** Das Blatt bleibt zur Anfahrt vom Start hin ausgerichtet (559383af). Schrift steht nur noch, wo kein Haus die Blickrichtung vorgibt; so kommt kopfüber stehende Schrift seltener ins Bild.

## Prüfung
- **Node:** Gleiche Saat ergibt das gleiche Raster und die gleiche Liste der Felder. Die Cache-Schlüssel sind eindeutig, die Version greift.
- **Im Slot:**
  - Messen: Hauptfaden je Bild beim Betreten einer neuen Zone (Ziel: kein Bild über 8 ms durch den Maler); Speicher vor und nach 10 Zonen.
  - Ein Blatt mit 16 Bändern aus der Spielkamera, von vorn.
