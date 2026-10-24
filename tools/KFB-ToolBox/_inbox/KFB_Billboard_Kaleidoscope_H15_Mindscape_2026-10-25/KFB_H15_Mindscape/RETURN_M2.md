# H15 Mindscape · Slice M2 · Rückgabe (24.10.2026)

Gleiche Datei wie M1: `KFB Billboard Kaleidoscope H15 Mindscape.dc.html`. Neue Module: `KFB_H15_Mindscape/soundbed.js`, `KFB_H15_Mindscape/poems.js`.

## IMPLEMENTATION
- **Soundbed** (ein AudioContext, derselbe wie die Jukebox; alles läuft durch den Engine-Analyser):
  - Binaural: Träger 140–240 Hz (Seed), rechts + Δ; Δ je Sektion: INTRO 4, VERSE 6, BUILD 7,83, DROP 10, BREAK 3, OUTRO 2,5 Hz.
  - Drone auf dem halben Träger (Grundton, Quinte, Oktave), Tiefpass nach Sektionsenergie.
  - Schellack-Luft (Rauschen mit Knistern).
  - Puls auf jedem Engine-Schlag (Takt 1 betont, ab Energie 0,6 Hi-Hat auf den Zwischenschlägen, in BREAK still).
  - Schellack-Aufnahmen aus `pd_audio/manifest.json`: Datei über `archive.org/metadata/<id>` ermittelt, gestreamt, Tempo 0,88–1,06, Hall, Wechsel alle 45–95 s oder am Titelende. Keine Tondatei im Projekt.
- **Audio → alle Ebenen:** Ist das Soundbed an, laufen die H13-Merkmale (Bass, Mitten, Höhen, Kick) wie mit der Jukebox. Sie treiben Kamera, Schrift, Hypno, Fraktalfarbe, Korn und Blitze. In 3D zusätzlich:
  - Blickweite auf den Kick;
  - Schalen: Deckkraft auf den Kick, Drehung auf den Bass;
  - Gierrate auf die Mitten;
  - Gedichtband: Kick und Höhen.
- **Gedichte:** Band in der Kugel (r 3,3, ±20°).
  - Quelle: Wortlaut live von Wikisource (en, dann de) zu Werken aus `poetic_occult_archive_seed.json`, nur Rechtestatus H oder E, ohne Auszugs-Titel mit „:“ (22 Werke). Der Autor auf der Seite muss zum Werk passen. Dazu 320 Zitate aus `quote_index_full.json` (PUBLIC_DOMAIN_CONFIRMED, unter 140 Zeichen).
  - Satz: Zeile für Zeile im Engine-Takt, Haltedauer nach Wortzahl (2,6 Wörter/s), in BREAK doppelt, in DROP 0,6-fach. Schrift nach Engine-Gewicht `poem`. Behandlungen TYPE, HARD, SPREAD, SCATTER. Farbe aus der Palette der laufenden Einstellung.
  - Nach jedem Werk eine Herkunftszeile mit der Seiten-URL. Bis zu 3 Nachbilder vorheriger Zeilen.
- **Alte Karten:** Commons-Suche mit 12 festen Begriffen (Tabula Peutingeriana, Hereford, Catalan Atlas, Ptolemäus, Ortelius, Cellarius u. a.), nur Lizenz PD/CC0, höchstens 20. Sie kommen als `engraving` in den Engine-Pool.
- **WS0-Pool:** alle 481 Bilder aus `hypernorm_r3/pd_pool/` in den Engine-Pool. Art und Kontext werden aus `gruppe` abgeleitet.
- Bake unverändert: `BAKE_SRC` lässt nur loc/pd/kfb zu, die neuen Quellen (map, ws0) bleiben draußen.

## TESTED RESULT (Claude-Design-Preview, 24.10.)
- Status im UI:
  - Karten 20/20, WS0 481/481, Pool gesamt 672;
  - Soundbed läuft mit Schellack-Titel, Analyse aktiv (kein „ohne Analyse“);
  - 7 Gedichte gefunden und 320 Zitate geladen.
- Sichtprüfung: Gedichtzeilen lesen sich richtig herum und vor der Blickrichtung; alte Himmelskarte auf der Wand sichtbar.
- Wikisource-Prüfung im Skript, korrekt gefunden: Blake (Tyger, Sick Rose), Ball (Karawane), Coleridge (Kubla Khan), McKay, Hughes.
- Verworfene Fehlzuordnungen: Buchanfänge, Werbeseiten, Epigraphe. Deshalb gibt es den Autorenabgleich und den Ausschluss der Auszugs-Titel.
- Leistung im Preview-Fenster:
  - ohne Soundbed 42 fps;
  - mit Soundbed zuerst 18–22 fps; nach Verkürzung des Halls (1,6 s, 24 kHz) 27–36 fps.

- Nachtrag Verifier (24.10.): Beim frischen Laden kamen einmal 0 Gedichte (alle „nicht gefunden“), obwohl die API erreichbar war. Behoben in `poems.js`: Netz- und HTTP-Fehler getrennt von „kein Treffer“, zwei Wiederholungen (8 s, 20 s), höchstens zwei Abfragen gleichzeitig, Statuszeile nennt den echten Grund. Danach frisch geladen: 7 Gedichte, 15 echte Fehlanzeigen.

## NOT_TESTED
- Kopfhörer-Wirkung der Binaural-Schwebung (nicht hörbar im Preview).
- Lautstärke-Mischung durch Georg.
- Mobil.
- Leistung auf echter Hardware.
- CORS je Archive-Titel: nur ein Titel wurde als „läuft“ gesehen.

## OPEN
- Vom Gate offen: Boden, schwebende Dinge, Betreten, Rabbit-Hole, Clip-Schnipsel.
- Nur 22 von 89 Werken sind zugelassen. T- und U-Werke brauchen eine Freigabe für eine konkrete Übersetzung.
- Leistung mit Soundbed.

GEORG ACCEPTANCE: offen.
