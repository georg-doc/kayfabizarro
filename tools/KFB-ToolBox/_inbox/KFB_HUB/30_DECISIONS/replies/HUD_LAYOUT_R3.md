# HUD-Layout R3 · 2026-10-22 · WS0 (V-681, ersetzt HUD_LAYOUT_R2)
**Tier 0:** Grundlage ist der Plan aus `HUD_R4_DESIGN/BRIEF_CLAUDE_DESIGN_HUD_R4.md` §3.1, §3.4 und §3.4b (Georg 16.10., J17 als Vorbild, V-043, V-333/V-334, V-340). Darauf kommen die freien 3D-Props und die Zustände (V-652, V-673/V-674) sowie Georgs Korrekturen zu N34. Nichts neu erfinden.

## Anordnung (16:9)
| Ort | Element | Regel |
|---|---|---|
| oben rechts | **Kompass** (KayKit compass_base) | Zu Fuß Kompass. Im Fahrzeug bzw. Flug ist der Deckel geschlossen und undurchsichtig, ohne Nadel; auf dem Deckel liegt der Tacho-Ring wie bei J17/HUD R3: ein weit herumlaufender, farbig kodierter Ring (grün → gelb → rot, Booster-Bereich) mit einem Punkt am aktuellen Tempo, dazu die Tempo-Zahl. Klick öffnet den Deckel: Minimap im J17-Knetstil mit dem aktiven Ziel-Marker. |
| direkt unter dem Kompass | **Almanach-Fächer** | fächert gerade nach unten, nicht ins Bild (V-043); letzte 7 Karten plus „+N“, Karten im Querformat, **echte Karten**, nie umgefärbt. Klick öffnet das Overlay mit Deck- und Welt-Tabs. |
| oben Mitte | Modus-Plakette | Gehen, Fahren, Fliegen; Spiel ↔ God-Modus |
| oben links | Insel- und Ziel-Plakette | Zielname plus kurze Entfernung (Stufen aus R4 §3.1: „85 m“, „350 m“, „1,2 km“, „12 km“, nahe am Ziel keine Zahl) |
| unten links | **Truhe** (KayKit chest) und **sechs Fluff-Pips** | Pips in den sechs Story-Farben (V-340), je eine kleine 3D-Zahl; beim Aufsammeln fliegt die Knet-Kugel zu ihrer Pip und landet mit kurzem Squash. Pickups fliegen in die Truhe. |
| unten Mitte | **Aktionsleiste** (N32 r2, bis 6 Plätze) | Zustände nach HUD_UX_STATES_R1 |
| rechts neben der Leiste | **Interaktion** | runde Sprechblase aus dem Blasen-SSOT (V-501: chatterbox-core + bubbles.module + SVG-Defs), 2D und ohne Outline (V-212, V-204); das 3D-Prop sitzt darin und darf überstehen. Kontext-Prop wechselt (Auto, Hand, Reden). |
| unten rechts | **Radio** (weiße Kassette) und Zahnrad | Play/Pause ist ein Wechsel-Knopf mit einem Symbol je Zustand; dazu Nächster Titel und Ton an/aus; Titel nur beim Wechsel. |

## Ziel-Pfeil (offen für Georg)
- **Plan (V-334, R4 §3.1):** 3D-Knet-Pfeil in der Welt über der Figur bzw. dem Fahrzeug, Ziel-Ring am Ziel; im HUD nur Name und Entfernung (oben links) und der Marker auf der Minimap.
- **Georg 22.10. im Chat:** 3D-Pfeil über dem Kompass.
- Bis Georg entscheidet, zeigt N34 r2 beide Varianten.

## Handy (9:16 bzw. quer)
- Aktionen 2×3 und Interaktion im rechten Daumenbereich; das Radio rückt dann neben die Modus-Plakette.
- Kompass mit Fächer bleibt oben rechts.

## Gilt weiter
Kontur, Lichthof und Cartoon-Deformation nach HUD_UX_STATES_R1; Originalfarben der Props (V-670); Karten as-is.
