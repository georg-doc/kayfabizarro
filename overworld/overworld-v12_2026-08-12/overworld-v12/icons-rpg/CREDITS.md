# RPG-Symbole — Herkunft und Lizenz

11 Symbole aus **game-icons.net** (Repo `game-icons/icons`, master @82d948812bfe, geholt 2026-08-09).

| Datei | Original | Urheber |
|---|---|---|
| `freeze.svg` | frozen-orb | Lorc |
| `distract.svg` | shouting | Lorc |
| `mark.svg` | target-arrows | Lorc |
| `strike.svg` | sword-wound | Lorc |
| `ranged.svg` | high-shot | Lorc |
| `diary.svg` | book-cover | Lorc |
| `locked.svg` | padlock | Lorc |
| `heal.svg` | health-potion | Delapouite |
| `bridge.svg` | stone-bridge | Delapouite |
| `meta.svg` | theater-curtains | Delapouite |
| `island.svg` | island | Delapouite |

**Lizenz: CC BY 3.0** — Nutzung erlaubt, **Namensnennung Pflicht**. Der Nennsatz gehört in den
Abspann des Spiels, nicht nur in diese Datei:

> Icons von Lorc und Delapouite · game-icons.net · CC BY 3.0

## Was geändert wurde
Die Originale sind 512×512 mit **schwarzem Hintergrundquadrat** und weißer Figur. Für ein HUD auf
Papier ist beides falsch herum. Also wurde je Blatt der Hintergrundpfad (`M0 0h512v512H0z`)
entfernt und `fill="#fff"` auf `currentColor` gesetzt — sonst nichts. Das Symbol wird als
INLINE-SVG in die Karte gelegt und erbt damit die Farbe ihres Bandes.

## Mapping
Wirkung → Symbol steht in `overworld/card-rail-v9b.js` (Abschnitt »Symbole auf den Handkarten«),
nicht hier — eine Zuordnung an zwei Orten ist eine zu viel. Kurzform:
`freeze · distract · heal · bridge · meta · mark` kommen aus `ability.effect.type`;
die Signatur zeigt `strike` (Nahkampf) oder `ranged` (wer ein `projectile` führt);
die Fensterkarten `island` und `diary`; ein versiegelter Platz `locked`.

## Einkaufsliste (falls mehr gebraucht wird)
game-icons.net hat 4246 Blätter derselben Machart — weitere Wirkungen kosten nichts außer der
Namensnennung. Kandidaten, die im Katalog schon liegen und noch kein Symbol haben:
`burst` (striking-arrows), `volley` (arrow-flights), `ammo` (quiver), `map` (treasure-map).
