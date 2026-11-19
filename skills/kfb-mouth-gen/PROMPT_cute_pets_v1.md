# Für den ChatGPT-Bild-Chat · Mund-Bögen Cute-Pets v1 (PETS-M1) · 19.11.2026

**Anlass:** Georg, 19.11. Die R4-Cartoon-Münder passen nur bei etwa 20 % der Cube-Pets: Die Lippen sind zu farbig, der Mund ist zu klein, und bei Schnabeltieren ist er formal falsch. Gebraucht wird ein eigener, **breiter** Satz für die Würfelgesichter, mit allen Sprechformen und Extremausdrücken. Die **Lippen** sollen einfärbbar sein, während Mundinneres und Zunge rot bleiben.

**Grundlage:** R4-Brief (`KFB_HUB/30_DECISIONS/replies/MOUTHS_GPT_R4/BRIEF_CHATGPT_MOUTHS_R4.md`), Mund-Bogen-Vorgabe `MOUTH_SHEET_SPEC_R1`, Spezifikation und Erfahrungen in `README.md` (dieser Ordner).

**Rückgabe:** je Bogen ein PNG, Dateiname `mouths_pets_v1_<typ>.png`. Je Briefing höchstens zwei Bögen (Regel 04.11.), darum zwei Teile.

**Raster 5 × 5**, Zellen breit (etwa 2 : 1), feste Reihenfolge:
- **Zeile 1, Grundformen:** rest_closed, mbp, small_open, mid_open, ah.
- **Zeile 2, Laute:** ee, oh, oo, fv, l_th.
- **Zeile 3, Lächeln:** smile_closed, smile_teeth, wide_grin, laugh, smirk.
- **Zeile 4, Gefühle:** sad, angry, snarl, surprised, scared.
- **Zeile 5, Gefühle:** disgust, grimace, shout, pout, tongue_out.

**Danach:**
- Schneiden mit `MOUTHS_GPT_R1/_tools/cut_align.py`, Raster auf 5 × 5 erweitert.
- Verankern wie R4 (Leinwand, Lippenlinie, `anchors.json`).
- Lippenmaske per Farbschlüssel: wenig Sättigung bei mittlerer Helligkeit ist Lippe; Zähne sind hell, Mundinneres und Zunge gesättigt rot.
- Einpassen je Pet mit `pet_face_solve_r1m.sh` und Mundbreite am Grundwürfel `PET_MOUTH_PLANE_W`.

## Teil 1/2 · Typen `pet_soft` und `pet_lipless`

- **`pet_soft`:** kleine, weiche, runde Knete-Lippen in neutralem Grau (zum Einfärben), zwei kleine Vorderzähne, rosa Zunge.
- **`pet_lipless`:** keine Lippen, nur die Mundöffnung mit weicher, dunkelgrauer Kontur, Zähne und Zunge wie oben. Das liegt nah an Kenneys Linienmündern.

Bogen 1:
```text
One single landscape image: a 5×5 sprite sheet of 25 cartoon mouth shapes for a cute claymation-style 3D cube animal character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin, no skin around the mouth – only the mouth.
All mouths at the same scale, front view, each centered in an equal WIDE cell (about twice as wide as high) with a clear gap between cells. The mouth is WIDE and SHALLOW: the relaxed closed mouth is at least 2.5 times as wide as it is high. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh, oo and pout (narrower, not below 0.6 of the width). No open mouth taller than 1.5 × the half-open mouth (shape 4).
Style: chunky claymation / plasticine, soft rounded volumes, matte, no glossy highlights, no fine wrinkles, no realism, cute and friendly.
COLOUR RULE (important): the LIPS are plain UNCOLOURED clay in a neutral mid grey (like grey modelling clay, no red, no pink, no brown, no lipstick look), shaded only by light and dark grey. Only the INSIDE of the mouth is coloured: dark red mouth interior, soft pink tongue, off-white teeth. Never tint the lips.
This mouth: small soft rounded lips (thin, not puffy), two small rounded front teeth on top that show when the mouth opens, a small pink tongue. The teeth stay exactly the same in every cell where they show.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 very wide grin with teeth, 14 big laugh, 15 smirk (one corner up). Row 4: 16 sad (corners down), 17 angry, 18 snarl (teeth bared, upper lip pulled up), 19 surprised, 20 scared. Row 5: 21 disgusted, 22 grimace (clenched teeth), 23 shouting, 24 pout, 25 tongue sticking out.
```

Bogen 2:
```text
One single landscape image: a 5×5 sprite sheet of 25 cartoon mouth shapes for a cute claymation-style 3D cube animal character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin, no skin around the mouth – only the mouth.
All mouths at the same scale, front view, each centered in an equal WIDE cell (about twice as wide as high) with a clear gap between cells. The mouth is WIDE and SHALLOW: the relaxed closed mouth is a wide gentle line at least 3 times as wide as it is high. The top edge of the mouth opening sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh, oo and pout (narrower, not below 0.6 of the width). No open mouth taller than 1.5 × the half-open mouth (shape 4).
Style: chunky claymation / plasticine, soft rounded volumes, matte, no glossy highlights, no realism, cute and friendly, like a simple cartoon line mouth made of clay.
COLOUR RULE (important): NO LIPS at all. The mouth is only an opening with a soft rounded rim in neutral mid-to-dark grey clay (no red, no pink, no brown). Only the INSIDE is coloured: dark red mouth interior, soft pink tongue, off-white teeth. The closed mouth is just a soft dark grey clay line.
This mouth: no lips, a simple soft opening; two small rounded front teeth on top that show when open, a small pink tongue. The teeth stay exactly the same in every cell where they show.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 very wide grin with teeth, 14 big laugh, 15 smirk (one corner up). Row 4: 16 sad (corners down), 17 angry, 18 snarl (teeth bared), 19 surprised, 20 scared. Row 5: 21 disgusted, 22 grimace (clenched teeth), 23 shouting, 24 pout, 25 tongue sticking out.
```

## Teil 2/2 · Typen `pet_fang` und `pet_buck`

- **`pet_fang`:** für Raubtiere (Katze, Tiger, Löwe, Fuchs, Hund). Breites, leicht katzenhaftes W-Grinsen mit zwei kleinen spitzen Eckzähnen, graue Lippen.
- **`pet_buck`:** für Nager und Hasen (Hase, Biber, Koala). Große, ungleiche Hasenzähne oben, graue Lippen.

Bogen 1:
```text
One single landscape image: a 5×5 sprite sheet of 25 cartoon mouth shapes for a cute claymation-style 3D cube animal character (cat-like predator), transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin, no whiskers, no skin around the mouth – only the mouth.
All mouths at the same scale, front view, each centered in an equal WIDE cell (about twice as wide as high) with a clear gap between cells. WIDE and SHALLOW: the relaxed closed mouth is at least 2.5 times as wide as it is high and has a gentle cat-like "w" shape in the middle. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh, oo and pout (not below 0.6 of the width).
Style: chunky claymation / plasticine, soft rounded volumes, matte, no glossy highlights, no realism, cute and cheeky.
COLOUR RULE (important): the LIPS are plain UNCOLOURED clay in a neutral mid grey (no red, no pink, no brown), shaded only by light and dark grey. Only the INSIDE is coloured: dark red interior, pink tongue, off-white teeth.
This mouth: thin grey lips, a cheeky wide grin; two small pointed canine fangs on top, small even teeth between them. The teeth stay exactly the same in every cell where they show.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 very wide grin with fangs, 14 big laugh, 15 smirk (one corner up). Row 4: 16 sad, 17 angry, 18 snarl (fangs bared, upper lip pulled up), 19 surprised, 20 scared. Row 5: 21 disgusted, 22 grimace (clenched teeth), 23 hissing / shouting, 24 pout, 25 tongue sticking out.
```

Bogen 2:
```text
One single landscape image: a 5×5 sprite sheet of 25 cartoon mouth shapes for a cute claymation-style 3D cube animal character (rodent / rabbit), transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin, no skin around the mouth – only the mouth.
All mouths at the same scale, front view, each centered in an equal WIDE cell (about twice as wide as high) with a clear gap between cells. WIDE and SHALLOW: the relaxed closed mouth is at least 2.5 times as wide as it is high. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh, oo and pout (not below 0.6 of the width).
Style: chunky claymation / plasticine, soft rounded volumes, matte, no glossy highlights, no realism, cute and goofy.
COLOUR RULE (important): the LIPS are plain UNCOLOURED clay in a neutral mid grey (no red, no pink, no brown), shaded only by light and dark grey. Only the INSIDE is coloured: dark red interior, pink tongue, off-white teeth.
This mouth: thin grey lips; two big uneven buck teeth on top (one slightly longer) that stay visible even when the mouth is closed. The teeth stay exactly the same in every cell.
Order, left to right, top to bottom: Row 1: 1 relaxed closed (buck teeth resting on the lower lip), 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 buck teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 very wide grin, 14 big laugh, 15 smirk (one corner up). Row 4: 16 sad, 17 angry, 18 snarl (teeth bared), 19 surprised, 20 scared. Row 5: 21 disgusted, 22 grimace (clenched teeth), 23 shouting, 24 pout, 25 tongue sticking out.
```

## Nicht abgedeckt: Schnabeltiere

Pinguin, Küken und Papagei bekommen keinen Lippenmund. Der Schnabel ist der Mund: Er öffnet sich als Kiefer, also mit geteiltem Schnabel und Gelenk oder als Sprechform-Animation am Schnabel. Das ist ein eigener Auftrag und gehört nicht in diesen Bogen.
