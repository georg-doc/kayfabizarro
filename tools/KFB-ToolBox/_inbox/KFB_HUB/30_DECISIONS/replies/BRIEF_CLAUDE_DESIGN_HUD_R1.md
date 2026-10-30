# Auftrag an Claude Design · KFB-HUD R1 · klickbarer HTML-Prototyp aus gelieferten Bildern (V-1035, V-1038) · 29.10.2026

**Was du baust:** nur Code – ein klickbarer HTML-Prototyp des neuen Spiel-HUD, zusammengesetzt aus den gelieferten Bildern in diesem Ordner. Du generierst keine Bilder und suchst keine Referenzen im Netz. Fehlt ein Bild, setzt du einen beschrifteten Platzhalter (Kreis oder Rechteck in der Slot-Form, Name als Text) und listest ihn in der Rückgabe.

**Warum:** Das bisherige HUD ist ein Sammelsurium ohne Logik (V-1035). Neu gilt eine feste Belegung, von Georg am 29.10. freigegeben (V-1039): `HUD_BELEGUNG_R1.md` in diesem Ordner. Sie ist die Vorgabe; Plätze, Knöpfe und Modi kommen von dort, du erfindest keine zusätzlichen.

## Material in diesem Ordner
- `HUD_BELEGUNG_R1.md` – Plätze, Belegung je Modus, Waffen-Logik, Tasten.
- `slots/` – freigestellte Knet-Slots (Grund, leer, gesteppt, gefüllt, Hover gold, gesperrt, Abklingzeit, bereit, gewählt, Warnung; dazu kleine Varianten).
- `icons/` – freigestellte Knet-Icons nach Gruppen: `core` (Hand, Faust, Blaster, Schwert, Donut), `movement` (gehen, laufen, springen), `travel` (Stiefel, Flügel, Auto), `menu` (Zahnrad, Karte, Almanach, Rucksack, Zeigefinger, Sprechblase), `radio` (Play, Pause, Weiter, Ton an/aus), `fluff` (Fluff-Kugeln mit Zahl), `vehicles` (sechs Dieselpunk-Fahrzeuge für den Reise-Fächer).
- `almanach/` – der Almanach, wie er heute im Spiel ist und bleibt: Kartenstapel oben links und offener Fächer „Letzte Karten“. Nachbauen wie im Bild.
- `sprechblasen/` – SSOT der Sprechblasen mit dem Code aus dem Spiel, siehe `sprechblasen/LIESMICH.md`. Nicht neu entwerfen.
- `szene/spiel_gehen_ohne_hud.jpg` – Spielbild ohne HUD als Hintergrund.

## Auftrag
1. **Bildschirm 16:10** mit dem Spielbild als Hintergrund und den sechs Plätzen aus der Belegung: Almanach oben links, Zielhinweis oben Mitte (Richtung, Name und Entfernung in Metern wie „Existentialist Café 260 m“), Status mit kleinem geradem Zahnrad oben rechts, Reise-Knopf und Radio unten links, vier Aktionsknöpfe unten rechts. Die Figur in der Mitte bleibt frei.
2. **Modus-Umschalter** (nur für den Prototyp, am Rand außerhalb des Spielbilds): Gehen, Fliegen, Fahren, Gespräch. Je Modus zeigen die vier Aktionsknöpfe die Belegung aus der Tabelle; im Gespräch sind Primär, Sekundär und Bewegung ausgeblendet, geantwortet wird über Sprechblasen.
3. **Klickbar:** Primär und Sekundär lang drücken öffnet den jeweiligen Fächer (Waffen bzw. Wurfwaffen; Icons als Platzhalter, wo keine da sind); Reise-Knopf öffnet den Fächer Gehen (Stiefel), Jetpack (Platzhalter) und die sechs Fahrzeuge aus `icons/vehicles`; Radio Play/Pause, Weiter, Ton an/aus, Tippen auf den Titel öffnet eine kleine Playlist; Almanach öffnet den Fächer wie im Bild, darin ein Fach „Rucksack“ (Inventar, Icon `menu/backpack`); Kontext-Knopf erscheint per Schalter „etwas in der Nähe“.
4. **Zustände der Aktionsknöpfe** mit den Slot-Bildern: bereit, gesperrt, Hover; Abklingzeit so, dass die Farbe den Knopf von unten wieder auffüllt (V-673), nicht als Kreis-Uhr.
5. **Tasten** wie in der Belegung (Maus, Leertaste, E, Q, M, N, Esc, 1–6) lösen dieselben Zustände aus.
6. **Stil:** nur die gelieferten Knet-Slots und -Icons, gleiche Größe je Platzart, gerade ausgerichtet, nichts schräg; Schrift lesbar über dem bunten Gelände.

## Rückgabe
- Eine HTML-Datei `hud_r1_prototyp.html` in diesem Ordner (alle Bilder relativ aus diesem Ordner geladen).
- Wenn du Bildschirmfotos erzeugen kannst: je Modus eins in `rueckgabe/`; sonst genügt der Modus-Umschalter im Prototyp.
- Liste der Platzhalter, für die ein Icon fehlt (z. B. Gatling, Rakete, Granate, Cartoon-Bombe, Jetpack, Rakete-Jetpack, Cape, Leben), damit WS0 sie mit dem Icon-Aufbau nachliefert.

## Abnahme
Georg klickt den Prototyp über eine Hub-Karte durch und gibt KEEP, TUNE oder FAIL; erst danach baut WS0 das HUD ins Spiel ein (V-934).
