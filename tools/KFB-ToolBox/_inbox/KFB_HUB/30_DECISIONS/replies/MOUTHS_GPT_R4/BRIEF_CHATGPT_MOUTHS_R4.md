# Für den ChatGPT-Bild-Chat · Mund-Bögen R4: sechs Cartoon-Münder mit unregelmäßigen Zähnen, alle Sprech-Viseme und Hauptgefühle · 14.11. (Georg, V-1765)

**Anlass (Georg 14.11., Hub q679, wörtlich):** „wir müssen die münder nochmal mit einen gpt web chat nach einem viseme template/prompt umsetzen lassen -> neues briefing im hub für 6 unterschiedliche cartoon münder mit unregelmäßigen zähnen, allen lipsync-notwengien viseme & main expressions/emotions als sprite sheet / transparentes PNG“.

**Grundlage:** die Mund-Bogen-Vorgabe `replies/MOUTH_SHEET_SPEC_R1.md` (gleiche Oberlippen-Höhe, gleiche Breite, höchstens 1,7-fache Höhe, Knete-Stil), erweitert von 4 × 4 auf 5 × 4: alle 13 Sprech-Formen des Spiels (`src/modules/mundSaetze.js` FORM: neutral, smile, m, d, s, ee, uh, ah, oh, r, f, woo, l) plus Lachen und Hauptgefühle. Je Briefing genau zwei Bögen (Regel 04.11.), darum drei Teile.

**Danach (WS0):** Bögen ablegen unter `media/3D_Assets/Textures/Mouths/<typ>/sheet.png` (Spec R1), `replies/MOUTHS_GPT_R1/_tools/cut_align.py` auf das Raster 5 × 4 erweitern, dann schneiden, verankern und freistellen, Zuordnung zu den 13 Spiel-Schlüsseln, Hub-Frage mit Sprech-Clip auf einer Figur; danach Einbau als Mund-Sätze und Neu-Backen der Web-Dateien (WSB).

## Teil 1/3 · Mund-Typen 1 und 2

**Für den ChatGPT-Bild-Chat · Mund-Bögen R4 Teil 1/3 · 14.11. (Georg, V-1765)** – zwei Bögen, einer je Mund-Typ, in einem Lauf nacheinander:
- Typ 1 `round_clay`: runde, volle Knete-Lippen in Rosé, kleine schiefe Zähne mit einer Lücke vorn.
- Typ 2 `buck_grin`: schmale dunkelbraune Lippen, breites Grinsen, große ungleiche Hasenzähne oben.

Raster 5 × 4, feste Reihenfolge (Zeile 1 Grundformen: rest_closed, mbp, small_open, mid_open, ah · Zeile 2 Laute: ee, oh, oo, fv, l_th · Zeile 3 Lächeln und Lachen: smile_closed, smile_teeth, laugh, smirk, grimace · Zeile 4 Gefühle: sad, angry, surprised, scared, disgust). Rückgabe: beide Bilder als PNG, Dateiname `mouths_r4_<typ>.png`.

Bogen 1:
```text
One single image: a 5×4 sprite sheet of 20 cartoon mouth shapes for a claymation-style 3D game character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin – only the mouth.
All mouths at the same scale, front view, each centered in an equal cell with a clear gap between cells. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh and oo (narrower, not below 0.6 of the width). No mouth taller than 1.7 × the relaxed closed mouth.
Style: chunky claymation / plasticine, soft rounded volumes, matte, no fine wrinkles, no glossy highlights, no realism. The teeth are deliberately irregular and stay exactly the same teeth in every cell where they show.
This mouth: round full plasticine lips in dusty rose; small crooked teeth with one gap at the front.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 big laugh, 14 smirk (one corner up), 15 grimace (clenched teeth). Row 4: 16 sad, 17 angry, 18 surprised, 19 scared, 20 disgusted.
```

Bogen 2:
```text
One single image: a 5×4 sprite sheet of 20 cartoon mouth shapes for a claymation-style 3D game character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin – only the mouth.
All mouths at the same scale, front view, each centered in an equal cell with a clear gap between cells. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh and oo (narrower, not below 0.6 of the width). No mouth taller than 1.7 × the relaxed closed mouth.
Style: chunky claymation / plasticine, soft rounded volumes, matte, no fine wrinkles, no glossy highlights, no realism. The teeth are deliberately irregular and stay exactly the same teeth in every cell where they show.
This mouth: thin dark brown lips, wide grin; big uneven buck teeth on top, one slightly longer.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 big laugh, 14 smirk (one corner up), 15 grimace (clenched teeth). Row 4: 16 sad, 17 angry, 18 surprised, 19 scared, 20 disgusted.
```

## Teil 2/3 · Mund-Typen 3 und 4

**Für den ChatGPT-Bild-Chat · Mund-Bögen R4 Teil 2/3 · 14.11. (Georg, V-1765)** – zwei Bögen, einer je Mund-Typ, in einem Lauf nacheinander:
- Typ 3 `full_soft`: volle weiche Lippen in Altrosa-Braun, Zahnlücke vorn, ein Zahn schief.
- Typ 4 `sausage`: dicke Knete-Wurst-Lippe in Rot, wenige große Zähne mit Abständen.

Raster 5 × 4, feste Reihenfolge (Zeile 1 Grundformen: rest_closed, mbp, small_open, mid_open, ah · Zeile 2 Laute: ee, oh, oo, fv, l_th · Zeile 3 Lächeln und Lachen: smile_closed, smile_teeth, laugh, smirk, grimace · Zeile 4 Gefühle: sad, angry, surprised, scared, disgust). Rückgabe: beide Bilder als PNG, Dateiname `mouths_r4_<typ>.png`.

Bogen 1:
```text
One single image: a 5×4 sprite sheet of 20 cartoon mouth shapes for a claymation-style 3D game character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin – only the mouth.
All mouths at the same scale, front view, each centered in an equal cell with a clear gap between cells. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh and oo (narrower, not below 0.6 of the width). No mouth taller than 1.7 × the relaxed closed mouth.
Style: chunky claymation / plasticine, soft rounded volumes, matte, no fine wrinkles, no glossy highlights, no realism. The teeth are deliberately irregular and stay exactly the same teeth in every cell where they show.
This mouth: full soft lips in mauve brown; front tooth gap, one tooth slightly turned.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 big laugh, 14 smirk (one corner up), 15 grimace (clenched teeth). Row 4: 16 sad, 17 angry, 18 surprised, 19 scared, 20 disgusted.
```

Bogen 2:
```text
One single image: a 5×4 sprite sheet of 20 cartoon mouth shapes for a claymation-style 3D game character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin – only the mouth.
All mouths at the same scale, front view, each centered in an equal cell with a clear gap between cells. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh and oo (narrower, not below 0.6 of the width). No mouth taller than 1.7 × the relaxed closed mouth.
Style: chunky claymation / plasticine, soft rounded volumes, matte, no fine wrinkles, no glossy highlights, no realism. The teeth are deliberately irregular and stay exactly the same teeth in every cell where they show.
This mouth: thick plasticine sausage lip in tomato red; few big teeth with wide spaces between them.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 big laugh, 14 smirk (one corner up), 15 grimace (clenched teeth). Row 4: 16 sad, 17 angry, 18 surprised, 19 scared, 20 disgusted.
```

## Teil 3/3 · Mund-Typen 5 und 6

**Für den ChatGPT-Bild-Chat · Mund-Bögen R4 Teil 3/3 · 14.11. (Georg, V-1765)** – zwei Bögen, einer je Mund-Typ, in einem Lauf nacheinander:
- Typ 5 `crooked_rogue`: schiefer Gauner-Mund, eine Seite höher, schmale Lippen in Braunrot, ein spitzer Eckzahn.
- Typ 6 `monster_maw`: breites Monster-Maul, dunkle violette Lippe, ungleiche spitze Zähne oben und unten.

Raster 5 × 4, feste Reihenfolge (Zeile 1 Grundformen: rest_closed, mbp, small_open, mid_open, ah · Zeile 2 Laute: ee, oh, oo, fv, l_th · Zeile 3 Lächeln und Lachen: smile_closed, smile_teeth, laugh, smirk, grimace · Zeile 4 Gefühle: sad, angry, surprised, scared, disgust). Rückgabe: beide Bilder als PNG, Dateiname `mouths_r4_<typ>.png`.

Bogen 1:
```text
One single image: a 5×4 sprite sheet of 20 cartoon mouth shapes for a claymation-style 3D game character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin – only the mouth.
All mouths at the same scale, front view, each centered in an equal cell with a clear gap between cells. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh and oo (narrower, not below 0.6 of the width). No mouth taller than 1.7 × the relaxed closed mouth.
Style: chunky claymation / plasticine, soft rounded volumes, matte, no fine wrinkles, no glossy highlights, no realism. The teeth are deliberately irregular and stay exactly the same teeth in every cell where they show.
This mouth: crooked rogue mouth, one corner higher; thin reddish-brown lips; one pointed canine.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 big laugh, 14 smirk (one corner up), 15 grimace (clenched teeth). Row 4: 16 sad, 17 angry, 18 surprised, 19 scared, 20 disgusted.
```

Bogen 2:
```text
One single image: a 5×4 sprite sheet of 20 cartoon mouth shapes for a claymation-style 3D game character, transparent background (if transparency is not possible: flat pure green #00FF00). No shadows, no text, no face, no nose, no chin – only the mouth.
All mouths at the same scale, front view, each centered in an equal cell with a clear gap between cells. The top edge of the upper lip sits at the same height in every cell; mouths open downward. Same mouth width for all shapes except oh and oo (narrower, not below 0.6 of the width). No mouth taller than 1.7 × the relaxed closed mouth.
Style: chunky claymation / plasticine, soft rounded volumes, matte, no fine wrinkles, no glossy highlights, no realism. The teeth are deliberately irregular and stay exactly the same teeth in every cell where they show.
This mouth: wide monster maw, dark violet lip; uneven pointed teeth top and bottom.
Order, left to right, top to bottom: Row 1: 1 relaxed closed, 2 pressed lips (m/b/p), 3 slightly open (e), 4 half open, 5 open (ah). Row 2: 6 wide with teeth (ee), 7 round (oh), 8 small round (oo), 9 upper teeth on lower lip (f/v), 10 tongue tip behind upper teeth (l/th). Row 3: 11 closed smile, 12 open smile with teeth, 13 big laugh, 14 smirk (one corner up), 15 grimace (clenched teeth). Row 4: 16 sad, 17 angry, 18 surprised, 19 scared, 20 disgusted.
```
