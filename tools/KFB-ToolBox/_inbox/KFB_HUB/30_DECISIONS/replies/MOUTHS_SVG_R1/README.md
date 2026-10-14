# MOUTHS_SVG_R1 · KFB-Mund-Set (2D, SVG)

12 Mundformen als einzelne SVGs, flach, mit einer Outline-Farbe. Gedacht als austauschbare Mund-Decals bzw. 2D-Sprites für KFB-Figuren.

## Dateien
- `svg/<id>.svg`: eine Datei pro Form, `viewBox="0 0 256 128"`, transparenter Hintergrund
- `contact_sheet.png`: alle 12 Formen mit Beschriftung, darunter eine Tint-Probe (andere Haut, rote Lippe)
- `talk_cycle.png`: 6 Frames: rest_closed → talk_small → talk_open → round → talk_small → rest_closed
- `mockup_frizzlebob.png`: 5 Formen auf FrizzleBob vorn (**2D-Bildmontage, kein 3D**)
- `mockup_kaykit.png`: dieselben 5 Formen auf einem beschrifteten **Platzhalter-Kopf**. Einen Render eines unmaskierten KayKit-Kopfs gibt es noch nicht.
- `_tools/`: Generator (`gen_mouths.py`) und Render-Skripte (Playwright und Chromium headless shell), damit sich alles reproduzieren lässt

## Formen (ids)
| id | Bedeutung |
|---|---|
| `rest_closed` | Ruhe, zu |
| `talk_small` | Sprechen klein |
| `talk_open` | Sprechen offen (Ah) |
| `wide` | breit (Ee) |
| `round` | rund (Oh/Oo) |
| `mbp` | M/B/P, Lippen gepresst |
| `fv` | F/V, obere Zähne auf Unterlippe |
| `smile_closed` | Lächeln, zu |
| `smile_open` | Lächeln offen |
| `sad` | traurig |
| `surprised` | überrascht |
| `grumpy` | grummelig |

Jede Datei enthält `<g class="kfb-mouth" id="<id>" data-anchor="128,64">`.

## Anker und Maßstab
- Die Mundmitte liegt bei **(128,64)**. Alle Formen teilen denselben Anker, deshalb wird beim Tausch nur die Datei gewechselt und nichts verschoben.
- Die Neutralbreite (rest_closed, Ecke zu Ecke) beträgt etwa **150 Einheiten**. Zum Platzieren auf einer Figur: `scale = alte Mundbreite_px / 150`, dann die SVG-Mitte auf die alte Mundmitte setzen. Bei FrizzleBob vorn sind das 91 px Mundbreite im Panel mit 452 px.
- Strichstärken sind im ganzen Set gleich: Outline 8, Falten 5,5, Zahnfugen 3,4 (in viewBox-Einheiten). Die Unterkante der Öffnung ist bis etwa 11 verdickt, das gibt mehr Gewicht nach unten.

## Farben
| Rolle | Wert |
|---|---|
| Outline (dunkelbraun) | `#3A2318` |
| Mundinneres | `#4E1A20` |
| Zunge | `#E3828C` |
| Zähne | `#F4EBD4` |
| **Lippe (tintbar)** | `var(--kfb-lip, #E4B53C)` |

## Lippe tinten
Die Lippe ist eine eigene Fläche ohne Outline: ein Ring um die Öffnung, die Unterlippe ist voller. Bei geschlossenen Mündern ist es eine spitz zulaufende Linse mit dünner Ober- und vollerer Unterlippe.
- **Inline-SVG oder HTML:** `--kfb-lip` auf ein Elternelement setzen, z. B. `style="--kfb-lip:#C9605E"`. Ist die Lippe gleich der Haut, `--kfb-lip: transparent` verwenden. So ist es in beiden Mock-ups gemacht.
- **Als Datei oder `<img>` / Textur:** CSS-Variablen von außen greifen dort nicht, es gilt der Fallback `#E4B53C` (FrizzleBob-Gelb). Zum Umfärben den String `#E4B53C` in der Datei ersetzen. Er steht nur im Style-Block (`.lip`, `.lipf`).

## Hinweise
- Die Mock-ups sind reine 2D-Montagen über dem vorhandenen Render (`ws1/r3f-frame` → `ws1/proofs/2026-10-14-fb-v240/fb_georg_pair_front_q_side.png`, Panel „ToolBox P08 vorn“). Der alte Mund wurde per Retusche entfernt (spaltenweise Interpolation plus Weichzeichnung). Es gibt kein Licht und keine Krümmung auf dem Mund.
- Stilbasis sind die gemalten Decals in `media/3D_Assets/Textures/FrizzelBob-Mouth_01` und `FrizzleBob-FemaleMouth_01` mit dunklem, rotbraunem Inneren, cremefarbenen Zahnblöcken und rosa Zunge. Deren plastische Lippen sind hier zu flacher Fläche plus Outline vereinfacht.
