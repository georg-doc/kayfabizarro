# MOUTHS_SVG_R2: KFB-Mund-Set mit Volumen (2D, SVG)

R2 baut auf R1 auf (R1 bleibt unverändert in `../MOUTHS_SVG_R1/`). Es gibt dieselben 12 ids, denselben Anker 128,64 und dieselben Proportionen wie in R1. Die Lippe ist weiter über `--kfb-lip` tintbar. Neu ist eine weiche Ton-Schattierung, die nur aus SVG-Verläufen besteht (`linearGradient`/`radialGradient`, Masken). Es gibt **keine Filter** und kein `feGaussianBlur`, damit das Set als CanvasTexture rasterisiert werden kann.

## Dateien
- `svg/<id>.svg`: Standard-Variante **lip=full, teeth=row**
- `variants/lip-<thin|full>_teeth-<row|gap|none>/<id>.svg`: alle 6 Kombinationen, jeweils 12 Formen
- `png/lip-default/<id>.png`: Standard-Variante gebacken, 512×256, transparent, Lippe in der Fallback-Farbe `#E4B53C`
- `png/lip-transparent/<id>.png`: dasselbe mit transparenter Lippe. Diese Version ist für FrizzleBob gedacht, weil seine Lippe gleich seiner Haut ist.
- `contact_sheet.png`: alle 12 Formen in der Standard-Variante. Dazu Variante A (lip=thin, teeth=gap) und Variante B (lip=full, teeth=none, rote Lippe auf Pfirsich-Haut).
- `talk_cycle.png`: rest_closed → talk_small → talk_open → round → talk_small → rest_closed
- `mockup_frizzlebob.png`: R1 und R2 nebeneinander für rest_closed, talk_open und smile_open. **2D-Bildmontage, kein 3D.**
- `_tools/`: `gen_r2.py` (Generator), `sheets_r2.cjs`, `mockup_r2.cjs`, `bake.cjs`

## Formen
`rest_closed`, `talk_small`, `talk_open` (Ah), `wide` (Ee), `round` (Oh/Oo), `mbp` (gepresst), `fv` (Zähne auf Lippe), `smile_closed`, `smile_open`, `sad`, `surprised`, `grumpy`

## Varianten-Schalter
```
python3 _tools/gen_r2.py <out_dir> --lip thin|full --teeth row|gap|none [--json shapes.json]
```
- `--lip thin` / `--lip full` ändert die Dicke von Lippenring und Unterlippe. Lichtkante, Schatten und Mundwinkel-Schatten wandern mit.
- `--teeth row` zeigt die Zahnreihe wie in R1. `gap` ergibt eine Zahnlücke in der Mitte oben. `none` lässt die Zähne weg, nur Innenraum und Zunge bleiben.
- `fv` behält bei `teeth=none` seine Zähne, sonst wäre es kein F/V mehr.

## Schattierung (was ist neu)
| Element | Umsetzung |
|---|---|
| Lippenvolumen | weiche weiße Lichtkante auf der Oberlippe und auf der Unterlippe (Radialverlauf auf 0 auslaufend) |
| Schatten unter der Unterlippe | dunkelbrauner Radialverlauf, Deckkraft 0,40 auf 0 |
| Mundwinkel | dunkle Radial-Flecken direkt in den Ecken |
| Mulde um offene Münder | sehr leichter dunkler Hof (nur bei offenen Formen) |
| Mundinneres | Radialverlauf, hinten und oben dunkler, unten zur Zunge heller |
| Zähne | oben leicht beschattet (Verlauf von `#BCAA84` nach `#F4EBD4`), untere Zahnreihe unten beschattet |
| Zunge | Radialverlauf, Mitte heller |

Alle Licht- und Schattenformen sind halbtransparent und unabhängig von der Lippenfarbe. Bei `--kfb-lip: transparent` legen sie sich direkt auf die Haut der Figur.

## Anker, Maßstab, Tinten (wie in R1)
- Die Mundmitte liegt bei **(128,64)**. Die Neutralbreite (rest_closed, Ecke zu Ecke) beträgt etwa 150 Einheiten. Daraus folgt `scale = alte Mundbreite_px / 150`.
- Tinten im Inline-SVG oder HTML: `style="--kfb-lip:#C9605E"` auf einem Elternelement. Ist die Lippe gleich der Haut, `transparent` setzen.
- Als Datei oder Textur gilt der Fallback `#E4B53C`. Zum Umfärben den String ersetzen oder den passenden PNG-Ordner nehmen.
- Gradient- und Clip-ids haben das Präfix `kfbm-<id>-`. Mehrere verschiedene Formen kollidieren im selben Dokument also nicht. Dieselbe Form in zwei Varianten auf einer Seite teilt sich die ids. Das ist harmlos, solange die Geometrie gleich ist.
