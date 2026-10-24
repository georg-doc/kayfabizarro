# CHANGELOG · additiv · H15 Mindscape

Nur Ergänzungen; frühere Einträge bleiben stehen. H14 unverändert.

## 2026-10-24 · M1 · Sphäre
- H15 als Kopie von H14 angelegt; `LS_KEY` → `kfb-kaleido-h15-v1`.
- Neu: Abschnitt „Mindscape“, `msInit/msRender/msDispose`, zwei Zeilen in `tick/step`.
- Wand r 10 (Engine-Fläche live), Schalen A r 6,5 und B r 4,2 mit Luma-Key und Zeitversatz.
- Kamera: Ziehen mit Nachlauf, Autopilot mit Drift, FOV-Puls; Vollbild.
- Korrektur nach Sicht: Schale B von additiv auf normal (brannte auf hellen Paletten aus).

## 2026-10-24 · M2 · Klang, Text, Pools
- Neu `KFB_H15_Mindscape/soundbed.js`: Binaural je Sektion, Drone, Schellack-Luft, Puls, Schellack-Titel von archive.org.
- Neu `KFB_H15_Mindscape/poems.js`: Wikisource-Lader mit Autorenabgleich, Gedichtband r 3,3, Zitat-Rückfall (320).
- Alte Karten (Commons, PD/CC0, ≤ 20) und WS0-Pool (481) in den Engine-Pool; Summe 672.
- Leistung: Hall auf 1,6 s / 24 kHz gekürzt (18–22 → 27–36 fps).
- Fix: Gedichte beim frischen Laden. Netz- und HTTP-Fehler werden getrennt von „kein Treffer“ behandelt, zwei Wiederholungen, höchstens 2 Abfragen gleichzeitig. Ergebnis: 7 gefunden, 15 echte Fehlanzeigen.

## 2026-10-25 · M3 · Naht
- `MS_FS`: Spiegelung (`mir`) waagrecht ersetzt durch Kachelung plus periodischen Versatz-Überblender mit gewellter Übergangszone. Randeinzug 1,2 %, Versatzprobe an der waagrechten Falte.
- Beschreibungstext im Abschnitt Mindscape angepasst.
- Neu `KFB_H15_Mindscape/RETURN_M3_NAHT.md`.

## 2026-10-25 · Export
- `export/kfb-h15-mindscape-2026-10-25/` mit Doku, Handover WS0, offenen Punkten, Top 5.
