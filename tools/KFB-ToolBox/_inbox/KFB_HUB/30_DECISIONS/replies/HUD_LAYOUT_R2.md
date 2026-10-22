# HUD-Layout R2 · 2026-10-22 · WS0 (V-680)
**Tier 0:** Ein HUD aus freien 3D-Props (V-673/V-674), abgeglichen mit V-333–V-335 und V-652. Keine Schwundform: jedes Element behält seine Funktion aus dem bisherigen Konzept, Größe und Anordnung werden in Spielgröße gestaltet.

## Elemente
| Element | Modell | Funktion | Zustände bzw. Anzeige |
|---|---|---|---|
| **Kompass/Tacho** (unten rechts) | KayKit compass_base | Deckel zu = Tacho, Deckel auf = Minimap | Zu Fuß: Kompass. Im Fahrzeug bzw. Flug: Deckel zu, farbiger Halbkreis unten für das Tempo (grün → gelb → rot, Rot = Booster-Bereich), Tempo-Zahl in der Mitte. Klick öffnet den Deckel und zeigt die Minimap, zweiter Klick schließt. |
| **Ziel-Pfeil** (über dem Kompass) | 3D-Knet-Pfeil (V-333) | zeigt das gewählte Ziel | dreht träge, flackert nie (V-335); im Flug Neigung und ↑/↓ (V-334 K2); Farbe wird bei Annäherung grüner, nie allein Farbe. Darunter Name kurz und Entfernung kurz: „85 m“, „1,2 km“. |
| **Radio** | Kassette bzw. Car Radio mit Tape (aus HUD_PROPS_SET_R1.json, weiße Kassette), ersetzt das kleinteilige Tiny-Treats-Radio | Musik | Wenige große Bedienpunkte: Play/Pause, Nächster Titel, Ton an/aus. Auf den beiden Spulenlöchern bzw. direkt darunter. Titel nur kurz beim Wechsel als Einblendung, keine Dauer-Laufschrift. |
| **Truhe** | KayKit chest | Inventar | Deckel animiert, Pickups und Fluff fliegen hinein |
| **Zahnrad** | GEAR_ICON.glb | Einstellungen, Entwickler-Infos | |
| **Fluff-Zahl** | 3D-Ziffern (Bangers) mit Fluff-Kugel | Punktestand | Hüpfer beim Hochzählen |
| **Almanach-Kartenfächer** | Karten as-is mit Schatten | Fraktaler Almanach | Fächer öffnet sich; Karten werden nie umgefärbt |
| **Aktionsleiste** (unten Mitte) | N32 r2 (bis 6 Plätze) | Kampf und Werkzeug | Zustände nach HUD_UX_STATES_R1 |
| **Interaktion** (rechts neben der Leiste) | offen, Georg wählt | Auto, NPC, Aufnehmen | Hinweis in Reichweite |

## Layout
- Ecken: oben links Fluff-Zahl, oben rechts Radio und Zahnrad, unten links Truhe und Almanach-Fächer, unten rechts Ziel-Pfeil über Kompass bzw. Tacho, unten Mitte Aktionsleiste plus Interaktion.
- Größen in Spielgröße abstimmen (1080p und Handy quer), Daumenbereich auf dem Handy für Aktionen und Interaktion.
- Alle Props mit Kontur und Zuständen nach HUD_UX_STATES_R1.
