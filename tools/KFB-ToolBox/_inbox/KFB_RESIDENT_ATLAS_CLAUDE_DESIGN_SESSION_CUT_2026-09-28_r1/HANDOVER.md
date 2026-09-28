# HANDOVER

## Stand
Der Friedhof steht als Nachbau von `sample.png` und ist tanzbar. Die Komposition ist nach Bild abgelesen und per Screenshot verglichen. Feintuning steht noch aus.

## Wissen
- Pack: `media/3D_Assets/KayKit_HalloweenBits/Assets/gltf/` @ main `43d39ef99a9e` (Kurzform). `Assets/glb/` aus PR #279 ist defekt, jede Datei ist ~195 Bytes groß und enthält eine base64-Fehlermeldung. Nicht lesen.
- `gravemarker_A.bin` fehlt auf main. Ein Kreuz fehlt deshalb, das Panel meldet es.
- Raster: floor_dirt 4 × 4 = ein Zaunfeld. Einfriedung: Ecke (0,0), Läufe z 0…−12, x 0…20 (Bogentor 8…12), x = 20 z 0…−8. Gruft bei (10, −16,2).
- Scharnierknoten: `arch_gate_left/right`, `fence_gate_left/right` (links −, rechts + um y = nach innen). Ebenfalls beweglich: `coffin_lid`, `post_lantern_lantern`, `post_skull_skull`.
- Pflaster ist von Hand gestreut, die Variante folgt einem Zähler statt der Dichte. Der Konzeptfehler ist in `docs/PATH_TILES_MENTAL_MODEL.md` beschrieben.
- BPM und Phase der Titel sind gesetzt, nicht gemessen. Es gibt kein Audio.

## Next Gate
Die Pflasterdichte von `path_A–D` per Draufsicht-Render messen, als Tabelle ablegen und `lib/path-band.js` nach `docs/PATH_TILES_MENTAL_MODEL.md` bauen. Dann den Weg Tor → Gruft damit neu setzen. Abnahme: Die Draufsicht liest sich neben `sample.png` als EIN Weg, der zu den Rändern ausfranst.
