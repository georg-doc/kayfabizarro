# Steuerungs-Test R1 · 09.11.2026 (WS0, Georgs Wunsch)

Release-Build (Stamm @a56fbba8) mit dem Testfahrt-Schalter-Satz. Jede Taste bzw. Maustaste wird im Spiel wirklich gedrückt, gemessen werden der Weg, die Kameradrehung, der Zoom, die Schüsse und jeder Aufruf der Waffen-Slots mit seinem Ergebnis. Zwei Läufe: frisch (nur Fluff-Trichter freigeschaltet) und mit allen Robo-Arm-Aufsätzen als gefunden.
Werkzeug: `test/controls-matrix.mjs` (ALLE=1 für den zweiten Lauf). Rohdaten: `matrix.json`, `matrix-alle.json`.

Maßstab: HUD_BELEGUNG_R1 (freigegeben 29.10.) und V-1474 (I = Interaktion, Q/E = Seitschritt bzw. Drift), Georg 09.11.: zwei Slots Primär/Sekundär (z. B. Blaster + Handgranate oder Robo-Arm mit zwei Aufsätzen, konfigurierbar), ausgelöst über die zwei Aktionsknöpfe und linke/rechte Maustaste, keine Extra-Tasten wie B oder C.

## Was passt
- Gehen: W/S vor/zurück, A/D drehen, Q/E Seitschritt, Shift schneller, Mausrad zoomt, I ist die Interaktion.
- Fliegen: F hebt ab und landet, W/S/A/D/Q/E fliegen, Leertaste = Boost.
- Fahren: Wagen über den Reise-Knopf, W/S/A/D/Q/E fahren und driften, Shift = Tempo, Mausrad zoomt, Ziehen mit der Maus dreht die Kamera, I steigt aus.
- Linksklick und Rechtsklick lösen beim Gehen Primär bzw. Sekundär des Robo-Arms aus.

## Was nicht passt
1. **Slots nicht konfiguriert.** Auch mit allen Aufsätzen liegt auf Primär und Sekundär nur der Fluff-Trichter. Die Waffenwahl mit 1–6 wechselt die Handwaffe, aber Klick und Aktionsknöpfe gehen immer an den Robo-Arm. Pistole, Blaster und Gatling feuern darum nie; nur die Granate fliegt (Linksklick).
2. **Sekundär ohne Wurfwaffe.** Rechtsklick mit Granate tut nichts; die Wahl „Wurfwaffe auf Sekundär“ fehlt.
3. **Fliegen: kein Schuss.** Jeder Slot-Aufruf in der Luft wird abgelehnt (AIRBORNE). Laut Belegung ist Fliegen wie Gehen.
4. **Fahren: Maus feuert nicht.** Im Wagen sind Linksklick und Rechtsklick abgeschaltet. Dafür feuert die alte Taste B die Pistole. Laut Belegung schießt die Figur vom Dach.
5. **Alte Extra-Tasten.** B/C (Robo-Arm-Slots), V/B/N (Faust, Schuss, Bombe aus Kampf R1) und T (Ernte) lösen Aktionen aus, zusätzlich zu Maus und Knöpfen.
6. **Tasten-Kollisionen im Wagen.** C schaltet die Fahrphysik um (Kamera springt 121°), M schaltet die Fahrhilfe statt Radio, V wechselt den Wagen. N ist „Bombe“, laut Belegung „nächster Titel“.
7. **Kleinigkeiten.** X (sinken) wirkte im Flug nicht, Mausrad zoomt im Flug nicht.

## Offen für Georg
- Plan zum Umbau (q577), Q-Taste Seitschritt oder Reise-Fächer (q578).
- Startbelegung entschieden (q579, V-1571): Faust-Modus. Primär Faustschlag, Sekundär Wrestling- oder Faustkampf-Move ohne Waffe, bis die erste Waffe gesammelt ist. Im Kit liegen Faustschlag und Tritt; ein Wrestling-Griff fehlt als Clip.
