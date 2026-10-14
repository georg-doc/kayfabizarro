# KFB Mund-Bogen · Vorgabe R1 (für ChatGPT-Bild-Generierung und ein späteres Plugin)

**Zweck:** Jeder neue Mund-Typ kommt als **ein** Bild mit festem Raster, damit Stil, Strich und Größe in allen Formen gleich sind. Unser Skript schneidet ihn automatisch, verankert und säubert ihn (`replies/MOUTHS_GPT_R1/_tools/cut_align.py`).

**Priorität:** Zuerst kommen die Sprech-Viseme, danach wenige Reaktionen. Keine Spaßformen wie herausgestreckte Zunge oder Lippenbiss; sie schränken die Nutzung ein.

## Raster 4 × 4, feste Reihenfolge
| Zeile | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| 1 · Grundformen | rest_closed (entspannt zu) | mbp (Lippen gepresst, M/B/P) | small_open (leicht offen, E) | mid_open (halb offen, Zwischenstufe) |
| 2 · Vokale | ah (offen, A) | ee (breit, Zähne, E/I) | oh (rund, O) | oo (klein rund, U) |
| 3 · Konsonanten und Lächeln | fv (obere Zähne auf Unterlippe, F/V) | l_th (Zungenspitze hinter oberen Zähnen, L/TH) | smile_closed | smile_open (Lächeln, Zähne) |
| 4 · Reaktionen | sad | surprised | grumpy (Zähne zusammen) | signature (eine freie Charakterform) |

## Regeln für alle Bögen
- **Ansicht:** frontal, alle Münder gleich groß gezeichnet, je Zelle zentriert.
- **Gemeinsame Oberlippe:** Die Oberkante der Oberlippe liegt in jeder Zelle auf derselben Höhe; der Mund öffnet nach unten.
- **Breite:** Alle Formen außer oh/oo haben dieselbe Mundbreite; oh und oo sind schmaler, aber nicht unter 0,6 der Breite.
- **Höhe:** höchstens 1,7 × rest_closed (ah, surprised eingeschlossen).
- **Hintergrund:** einfarbig reines Grün `#00FF00`. Keine Schatten, keine Spiegelung, kein Text, kein Gesicht, keine Nase, kein Kinn.
- **Stil (Standard):** Claymation/Knete, weich gerundet, matte Oberfläche, keine feinen Falten, keine Glanzlichter, kein Realismus.

## Varianten (Parameter je Bogen)
- **Lippe:** voll / schmal / Wurst-Linie (sausage)
- **Zähne:** Reihe / Lücke / Hasenzähne / keine
- **Lippenfarbe:** z. B. rosé, rot, dunkelbraun, Hautton der Figur
- **Rand:** ohne / weiche dunkle Kontur

## Ablauf
1. Bogen in ChatGPT erzeugen (Prompt unten).
2. Ablegen auf GitHub unter `media/3D_Assets/Textures/Mouths/<typ>/sheet.png`.
3. WS0 lässt `cut_align.py` laufen. Dabei wird geschnitten, gesäubert und am Grün freigestellt, die Formen werden verankert (Oberlippe, `upperLift`) und, wo nötig, auf höchstens 1,7× gestaucht.
4. Abnahme im Hub als Bildfolge mit Sprech-Clip auf einer Figur.
5. Im Mund-Labor in 3D testen.

## Prompt (ChatGPT, Bildgenerierung)
```text
One single image: a 4×4 sprite sheet of 16 cartoon mouth shapes for a claymation-style 3D game character, on a flat pure green background (#00FF00), no shadows, no text, no face, no nose, no chin – only the mouth.
All mouths drawn at the same scale, front view, each centered in an equal cell. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except "oh" and "oo" (narrower). No mouth taller than 1.7× the closed mouth.
Style: chunky claymation / plasticine, soft rounded volumes, matte, no fine wrinkles, no glossy highlights, no realism.
Lip style: {full | thin | sausage line}. Teeth: {row | gap | buck | none}. Lip colour: {colour}.
Order, left to right, top to bottom:
1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open,
5 open (ah), 6 wide with teeth (ee), 7 round (oh), 8 small round (oo),
9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th), 11 closed smile, 12 open smile with teeth,
13 sad, 14 surprised, 15 grumpy with clenched teeth, 16 one signature expression of your choice (no tongue out).
```
