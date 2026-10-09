# KFB HUD + Flug-VFX · Changelog

Neu oben. Je Runde: was, warum, Georgs Urteil, Dateien.

## R3 · 2026-10-09 · Radio-Umbau, Rucksack-Feinschliff, Handover

Georg (R2-Review, Inline-Kommentare):
- Radio: äußere Drehknöpfe (Quelle, Lautstärke) unklar → raus. Stattdessen Noten-Knopf als Musik an/aus (aus = minifiziert) und Mini-Menü für die Playlist.
- Mobil: obere Reihe einzeilig, Display sparen.
- Rucksack: Clips/Riemen oben stören → weg. Items in den Fächern besser drehen (Radio, Schlüssel lasen als Schraube).
- Kassette: selbst gebaut, soll mehr nach Kassette aussehen. Spulen weiter auseinander, Typo harmonisch.
- Look: »noch sehr rund und glatt«, darf so bleiben; Knet-Textur der aktuellen Joyride-Slices folgt.

Umgesetzt:
- `kfb-hud.js` Radio R3: Noten-Knopf · Display · Zurück · Play · Weiter · Playlist-Menü. Events `music`, `play`, `prev`, `next`, `playlist`. `setPlaylists()`, `setMusic()`. Quelle- und Lautstärke-Knopf entfernt.
- `kfb-hud.js` Layout: schmal (< 620 px oder Kollision unten) → Radio ohne Display in der oberen Reihe neben dem Rucksack. Menü klappt dann nach unten.
- `kfb-backpack.js`: Riemen entfernt; Kassette neu (Kompaktkassette 100 × 64, Spulen bei 30 % / 70 %, Bandfenster, Etikett mit Seite A und Schriftzeile, Trapez-Steg); Item-Ansicht je Item (`view`, `spin`), Vorschau pendelt statt zu rotieren.
- `kfb-jukebox-data.js`: Lesepose je Item (Schlüssel schräg mit Bart zur Kamera, Karte quer, Radio frontal, Donut von oben).
- Tafel A: Streifen »Radio · Zustände« (aus, an, kompakt, mobil, Menü offen).
- Handover-Paket R3 (`export/KFB_HUD_FLIGHT_R3_HANDOVER/`).

## R2.5 · 2026-10-08 · Rucksack, Biom-Radio, Biome

Georg: Rucksack-Slot (KayKit Mystery S6 · Hoarder_Backpack), Overlay mit 20 Fächern, Kassettendeck, Playlist je Biom + eigene Tapes, Artist-Anzeige als Pixel-Mono, langsam laufend. Antworten im Formular: Knet-Look, Live-3D-Miniatur, Rucksack klappt auf (5 × 4 Mulden), Items Schlüssel/Süßigkeit/Radio/Karte aus KayKit/Tiny Treats, Biom-Radio + eigene Tapes, Lauftext 1 Zeichen je 0,25 s.

Umgesetzt:
- Neu `kfb-backpack.js` (Prop-Bibliothek, ein WebGL-Kontext für alle kleinen Ansichten, Miniatur, Overlay, Kassettendeck).
- Neu `kfb-jukebox-data.js` (vier Hex-Inseln mit Palette vom Referenzblatt, HUD-Farben je Insel, Titel aus Rotation 01 + jukebox.json, Sender-Vorschlag je Biom, Kassetten, Items mit Commit-gepinnten URLs).
- `kfb-hud.js` R2: Rucksack-Slot oben links, Radio mit Zurück/Weiter, VT323-Lauftext.
- Tafel F: vier Inseln mit HUD, bedienbares Rucksack-Overlay, Paletten-/Sender-Tabelle. Live-Szene mit Insel-Knöpfen.

## R2 · 2026-10-08 · Speedlines richtig, Schweben, Überflug

Georg: Die radialen Linien sind keine Speedlines, sondern Beschleunigungs-/Manöver-Linien und müssten hell sein. Speedlines = durchgehende, kurvige Bänder an den Außenkanten (wie Car Racing), die Bewegung und Banking ohne Abriss mitmachen. Überflug-Partikel über Boden/Wasser optional. Flug-Idle mit Minimalschub.

Umgesetzt:
- `createSpeedTrails()` aus TinySkies Contrails.ts über Travel Globe v13 `contrails.js` (72 Punkte, Querachse zur Kamera, Breite × fade, Alpha × fade², additiv). Anker im Träger.
- Manöver-Linien additiv hell, nur auf `maneuver()`.
- Überflug Staub/Gischt aus `carpet-wake.js`.
- `hoverPose()` + `FLIGHT_IDLE = 0.14`.

## R1 · 2026-10-08 · Erste Fassung nach Briefing

Briefing `BRIEF_CLAUDE_DESIGN_HUD_FLIGHT_R1.md`. HUD je Modus, Moduswechsel (Roll/Plopp/Steig), Fluff-Kugel, Flug-VFX (radiale Linien, Jetpack-Wülste, Puff). Tafeln A–E. Georg: »sieht schon alles ganz gut aus«.
Fixes danach: Ausfahr-Animation warf bei jedem Moduswechsel (Keyframe-Offsets rückwärts), Mobil-Kollision Radio/Höhe.
