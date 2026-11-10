# Beleg-Standard R1 · wie Spielszenen für Abnahmen und Hero-Shots aufgenommen werden (WS0, 11.11.2026)

Anlass: Georg 11.11.: „Kamerapositionen und Standards definieren, in denen solche Aufnahmen präsentiert werden“, statt jedes Mal falsche Einstellungen, verdeckte Hauptsachen und stille Nachläufe. Gilt für alle Sitzungen und jedes Bild, das zu WS0 oder Georg geht.

## Werkzeug (Pflicht)

`test/lib/beleg.mjs` im Stamm (ab @… siehe Register V-1609):
```js
import { belegVorbereiten, belegKamera, belegSchritt, belegFreigeben } from './lib/beleg.mjs'
await belegVorbereiten(page)            // FB-Kanon-Wächter (beide Ohren, Schwanz), HUD aus
await belegKamera(page, 'aktion')       // Ansicht aus der Liste unten; hält die Uhr an (Standbild)
await belegSchritt(page, 1)             // Bildfolge: Kontakt, +1, +2, +4 …
await belegKamera(page, 'aktion', { halten: false })   // feste Kamera, Spiel läuft (GIF/Video)
```
Kein Skript stellt die Spielkamera mehr selbst ein. Fehlt eine Ansicht, kommt sie in `ANSICHTEN` dazu, nicht in ein Einzelskript.

## Ansichten

Alle Ansichten liegen vor der Figur, nie von hinten. Die Vorderseite ist senkrecht zur Augenlinie, zur Laufrichtung hin. Der Abstand ergibt sich aus der Figurenhöhe, damit das Wichtige im Bild ist.

| Ansicht | Wofür | Bildinhalt |
|---|---|---|
| `gesicht` | Augen, Lider, Mund, Ohransatz | Gesicht frontal, Bildhöhe aus dem Augenabstand |
| `figur_vorn` | Figur, Kleidung, Ausrüstung | ganze Figur von vorn |
| `figur_dreiviertel` | Hero-Shot, Pose, Shading | ganze Figur, 35° seitlich von vorn |
| `figur_seite` | Gang, Silhouette, Rucksack, Schwanz | ganze Figur, 80° seitlich |
| `aktion` | Treffer, VFX, Waffe | Kopf, Hand und Kontaktpunkt, 40° seitlich von vorn |
| `boden` | Landung, Bodenausbruch, Aufsitzen, Schatten | Füße, Bodenkontakt und Ring, leicht erhöht |
| `uebersicht` | Szene, Gruppe, Viertel | erhöht, mehrere Figurenhöhen |

Fahrkamera und Spielkamera nur zusätzlich, nie als einzige Ansicht.

## Bild und Zeit

- Licht: 13 Uhr als Standard; für Look- und Licht-Abnahmen zusätzlich Abendlicht und Nacht.
- Ort: offener Boden ohne Verdeckung; für Treffer der Prüfpfosten in Clip-Reichweite.
- Bewegung: Spiel mit `replay=30`, sodass jedes Bild 1/30 s Spielzeit ist. Bildfolge Kontakt, +1, +2, +4.
- GIF: feste Farbpalette über alle Bilder, damit nichts flackert; kein Rahmen zwischen den Hälften, Vergleiche als getrennte Bilder oder sauberes Links/Rechts.
- Hub: höchstens 4 Folien, je höchstens 2 Bilder, keine Beschriftung im Bild.

## Vor dem Absenden (selbst prüfen)

1. Der FB-Wächter ist bestanden; beide Ohren und der Schwanz sind sichtbar, wo die Ansicht sie zeigt.
2. Die Hauptsache ist im Bild und nicht verdeckt: Gesicht, Kontaktpunkt bzw. Bodenkontakt.
3. Nichts ist von hinten aufgenommen, nichts angeschnitten, was beurteilt werden soll.
4. Der Stand stimmt: Der Belegzweig enthält den aktuellen Stamm.
