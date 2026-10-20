# R11 · Farbe und Licht aus 3D- und 2,5D-Animation für ein stilisiertes Echtzeitspiel · R1 · 2026-10-20

**Backlog:** neue Zeile R11 (Vorschlag für `CANON_3D/RESEARCH_BACKLOG_R1.md`).
**Ziel:**
- Kanon Gebiete 6 (Farbe), 7 (Licht und Schatten), 8 (Materialantwort) und 16 (Bildanatomie);
- Design #439 (`WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md`): Rollen `castShadowTint`, `contactDepthTint`, `edgeAccentTint`.

**Stand:** Recherche-Ergebnis, noch kein Kanon. WS0 entscheidet. Kein Repo wurde verändert.

## Lesehilfe

**Herkunft jeder Zahl:**
- **[Q]** Die Zahl bzw. Aussage steht so in der genannten Quelle.
- **[V]** Mein Vorschlag bzw. meine Heuristik. Muss an KFB-Bildern geeicht werden.
- **[KFB]** besteht schon im Kanon, im Register oder in `LIGHT_MODEL_R2`.

**Maße** (wie R4):
- **L\*** = CIE-Helligkeit 0–100.
- **C** = OKLCH-Buntheit.
- **h** = OKLCH-Farbton in Grad.
- **px@1080** = Pixel bei 1080 Bildzeilen. 1 px@1080 entspricht 0,093 % der Bildhöhe. Bei anderen Auflösungen wird proportional skaliert.

**Abgrenzung zu R4:** R4 regelt bereits:
- Wertgruppen, Tiefenstaffel in Wertbändern, Fokus-Kontrast;
- Sättigungshierarchie, Gamut-Maske, Colour-Script;
- „Schatten nie schwarz“ (R4-11).

R11 wiederholt nichts davon. Es verweist nur dorthin, wo eine Regel darauf aufbaut.

**Zitate:** keine längeren als 15 Wörter, alles in eigenen Worten.

**KFB-Randbedingungen, die jede Regel bestehen muss:**
- Ein Rig: Sonne + Hemi, Hemi-Boden = `edgePalette` (Regel 4), dazu das Figurenlicht (Regel 11) [KFB `LIGHT_MODEL_R2`].
- Kein Rand- oder Gegenlicht (V-392).
- Echte Shadow-Map-Schatten, getönt nach der Palette des Empfängers (V-564).
- Kein Blob-Schatten.
- Knet-Material `kfb-clay.v1.1` mit einer Materialantwort, ohne CGI-Glanz und ohne eingebackenes Licht oder AO (Kanon 8 und 15).
- Keine Linie, kein Verlauf und kein Alpha als Übergang (Kanon 4).
- Keine schwarze Gesamt-Outline (Design #439 §0).

---

## Teil A · Was die Quellen hergeben (Kurzbild)

| Werk | Belastbarkeit | Was übertragbar ist |
|---|---|---|
| *Guilty Gear Xrd* (Arc System Works, GDC 2015, Motomura) | **hoch**: Vortragsmanuskript vollständig gelesen | Schattenfarbe je Material als Paar; Schwelle per Vertexfarbe; Normalen von Hand; Inverted-Hull-Outline mit variabler Breite |
| *Hi-Fi Rush* (Tango, GDC 2024, Tanaka/Komada) | **hoch**: Foliensatz mit Sprechertext gelesen | Schattenfarbe ortsabhängig gemalt; Toon-Stilisierung **je Lichtschicht**; AO/GI zu Grafik statt Verlauf; gestufter Lichtabfall; harte Schwelle mit AA nur am Grenzpixel |
| X-Toon (Barla, Thollot, Markosian, NPAR 2006) | **hoch**: Paper gelesen | Toon-Rampe mit Tiefe als zweiter Achse; Formel für den Detailverlust; abstrahierte Normalen |
| Isophote Distance (Goodwin, Vollick, Hertzmann, NPAR 2007) | mittel: Abstract und Sekundärangaben | Linienbreite ∝ 1/Tiefe und ∝ 1/Krümmung, geklemmt |
| Where Do People Draw Lines? (Cole u. a., SIGGRAPH 2008) | mittel: Abstract | Linien sitzen vor allem am Umriss |
| Pencil+ 4 (PSOFT, Anime-CG-Standardwerkzeug) | hoch: Handbuch | Kantenklassen mit eigener Farbe und Breite; Breite und Deckkraft fallen mit der Distanz |
| *Spider-Verse* (Sony Imageworks) | mittel: Interviews (fxguide, Foundry) | kürzere Übergänge zwischen Tonflächen; Raster und Schraffur vom Licht gesteuert; dieselbe Rasterung auf Haut wie auf Umgebung |
| *Puss in Boots: The Last Wish*, *The Bad Guys* (DreamWorks) | mittel: Interviews (befores & afters, VFX Voice) | Detail nur im Übergangsband; Fell als Akzentlinien; grafische Rims (nicht übernommen) |
| *Klaus* (SPA Studios, KLaS-Werkzeug) | mittel: Interviews (CGW, SIGGRAPH-Blog) | Licht auf wenige Komponenten reduziert; Figuren sparsamer beleuchtet als Hintergründe |
| *Arcane* (Fortiche) | **niedrig**: nur Sekundärartikel | Licht in die Textur gemalt (nicht übernommen); Glanz reduziert |
| *Rick and Morty* | **niedrig**: Fan-Tutorial, keine Produktionsquelle | flache Farben, ein Schattenton per Multiply; keine verwertbaren Zahlen |
| *Sable* (Shedworks, GDC 2022) | mittel: Game-Developer-Bericht über den Vortrag | Schatten zur Verortung so oft wie möglich; Nebel je Biom; Outlines verblassen mit Distanz |
| Pixar (Kalache zu *Toy Story 4*; Pixar in a Box) | mittel | Bounce stilisiert umfärben; Lichtrollen Key/Fill/Bounce/Rim |
| Gurney (*Gurney Journey*), Gooch 1998, Slynyrd | hoch für Malerei- bzw. Formelaussagen | Okklusionsschatten als dunkelste Stelle; Buntheit im Schatten; Warm-kalt-Formel; Farbtonverschiebung je Stufe |
| *Genshin*, *Breath of the Wild*, *Tunic* | **niedrig**: keine Primärquelle zur Schattierung gefunden | nur als Hinweis, keine Regel darauf gestützt |

---

## Teil B · Regeln

### (a) Farbige Schatten und ihre Ableitung vom Empfänger

#### R11-01 · Schattenfarbe ist eine Materialentscheidung, kein Licht-Multiply
- **Regel:**
  - Jede Palettenrolle bzw. Materialklasse führt ein **Paar aus Licht- und Schattenton** als Daten [Q GG].
  - Der Schatten entsteht durch die Wahl dieses Paars, nicht durch Abdunkeln mit einer Umgebungsfarbe [Q GG].
  - Schwarze oder graue Standardschatten sind nur der Rohzustand [Q Hi-Fi Rush, Folien 31–32].
  - Pflicht: Jede Rolle in `kfb-cartoon-palette` bzw. `ENV_ROLES` hat `castShadowTint` als eigenen Wert [V], kein globaler Schattenton.
- **Quelle:**
  - Motomura, „Guilty Gear Xrd's Art Style: The X Factor Between 2D and 3D“, GDC 2015, Manuskript S. 22–23: Lichtfarbe und Tönungstextur werden multipliziert; die Farbwahl liegt beim Künstler bzw. Colour Designer, wie im Anime. https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf
  - Tanaka/Komada, „3D Toon Rendering in Hi-Fi RUSH“, GDC 2024, Folien 31–32 („Environmental Shadow Color“): Ausgangspunkt einheitlich schwarz, danach von Künstlern gefärbt. https://media.gdcvault.com/gdc2024/Slides/GDC+slide+presentations/Tanaka_Kosuke_3D_Toon_Rendering.pdf
- **Urteil:** **gilt für KFB.** Deckt sich mit V-564 und konkretisiert ihn: Das Paar liegt in den Palettendaten je Rolle.

#### R11-02 · Ableitung des Schattentons aus dem Empfänger (Formel)
- **Regel:** Der Schattenton wird aus dem beleuchteten Empfängerton in OKLCH abgeleitet:
  - **L\*:** −18 bis −28 gegenüber dem Lichtton bei Tag [V]. Untergrenze bleibt R4-11 bzw. L-6.
  - **h:** Verschiebung zum Farbton der Schattenrolle der Zone, **≤ 20°** [Q Slynyrd: 20° je Rampenstufe als Obergrenze]. Richtung laut Palette, **nicht** pauschal kühl (V-564).
  - **C:** Zielband 0,8–1,15 × C des Empfängers [V]. Buntheit darf im Schatten steigen [Q Gurney]. Die harte Untergrenze 0,3 × aus R4-11 bleibt.
  - **Formelgestalt:** Schatten = Mischung aus Rollen-Schattenton und α × Empfängerfarbe. Gooch rechnet ebenso: kalter bzw. warmer Ton + α bzw. β × Objektfarbe, Beispielwerte b = 0,55, y = 0,3, α = 0,25, β = 0,5 [Q]. Für KFB liegt α im Band 0,5–0,8, damit die Empfängerfarbe dominiert [V].
- **Quelle:**
  - Schlitter (Slynyrd), „Pixelblog 1 – Color Palettes“: 9 Stufen je Rampe, je Stufe +20° Farbton, mehr setzt er nicht an. https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes
  - Gurney, „Chroma in the Shadows“: Auf nach unten gewandten Schattenflächen mit warmem Bodenreflex war die Buntheit höher als auf der Lichtseite. http://gurneyjourney.blogspot.com/2012/03/chroma-in-shadows.html
  - Gooch, Gooch, Shirley, Cohen, „A Non-Photorealistic Lighting Model for Automatic Technical Illustration“, SIGGRAPH 1998. Werte nach der Zusammenfassung https://en.wikipedia.org/wiki/Gooch_shading
- **Urteil:** **gilt für KFB** als Rechenvorschrift für `paletteDerivedShadow()` (Design #439 §3). Die Warm-kalt-Richtung von Gooch ist **nicht übernommen**, weil V-564 die Richtung aus der Palette des Empfängers nimmt.

#### R11-03 · Weiches Material bekommt einen helleren, getönten Schatten
- **Regel:**
  - Je weniger fest ein Material wirkt, desto heller und stärker durchgefärbt ist sein Schatten; Haut z. B. rötlich [Q GG].
  - Zahlen für KFB [V]:
    - Figuren-Knete und Haut: ΔL\* −12 bis −18, h Richtung Rot bzw. Wärme ≤ 15°;
    - Terrain-Knete: −18 bis −24;
    - Stein und Fels: −22 bis −28.
- **Quelle:** Motomura, GDC 2015, Manuskript S. 23 (Festigkeit des Materials, Tönung durch Lichtdurchgang).
- **Urteil:** **gilt für KFB.** Gehört in die Materialantwort je `kfb-clay`-Profil (Kanon 8, V-566 „Schattentönung“). Sichert nebenbei die Gesichtslesbarkeit (L-9), ohne eigene Gesichtsausnahme.

#### R11-04 · Ortsabhängige Schattenfarbe: über die Zonenpalette, nicht über gemalte Volumen
- **Regel:**
  - Hi-Fi Rush färbt Schatten über Volumen, die eine 3D-Textur auf Weltpositionen legen. Künstler malen darin Verläufe, z. B. nach oben dunkler werdend [Q].
  - Für KFB kommt die Ortsabhängigkeit **nur** aus der Biom- bzw. Zonenpalette des Empfängers.
- **Quelle:** Tanaka/Komada, GDC 2024, Folien 33–35 („Shadow Color Volume“).
- **Urteil:**
  - **Prinzip gilt:** Schattenfarbe darf je Zone verschieden sein.
  - **Nicht übernommen** ist das gemalte Volumen. Es wäre eine zweite Farbquelle neben der Palette (Kanon 6: Harmonie über das Material, nie über das Licht) und brächte einen vertikalen Verlauf, den Design #439 §0 ausschließt.

#### R11-05 · Schatten multiplizieren sich nicht
- **Regel:**
  - Es gibt genau eine Wurfschattenstufe und höchstens eine Kontaktstufe darunter.
  - Überlappende Schatten, Wurf- und Eigenschatten werden mit `max` zusammengeführt, nicht multipliziert [KFB Design #439 §3].
  - Messwert: L\* in Überlappungszonen = L\* des Einzelschattens ± 3 [V].
- **Quelle:**
  - KFB Design #439 §3, Punkt „kein additiver dunkler Mehrfach-Multiply“.
  - Hi-Fi Rush, Folien 44–46: Die Comic-Stufe entfernt Verläufe aus GI und SSAO und macht das Bild „sauberer“.
- **Urteil:** **gilt für KFB.**

### (b) Farbige Linien: wo, welche Farbe, wie breit

#### R11-06 · Kantenklassen trennen, nur wenige zeichnen
- **Regel:**
  - Linienwerkzeuge der Anime-CG unterscheiden Kantenklassen mit je eigener Farbe und Breite [Q Pencil+]:
    - Umriss (Silhouette);
    - innere Objektlinien;
    - Durchdringung;
    - Glättungsgrenze;
    - Materialgrenze;
    - markierte Kanten;
    - Normalenwinkel.
  - Menschen zeichnen vor allem am **Umriss**. 75 % der Striche verschiedener Zeichner liegen innerhalb 1 mm voneinander, 14 % erklärt keine lokale Formgröße [Q Cole].
  - **Für KFB:**
    - **Terrain:** nur echte Formbrüche (Grat, Kliffkante, Bandenkopf) als Akzent [KFB Design §5]. Knickschwelle Diederwinkel ≥ 35° [V].
    - **Farbfeldgrenzen:** nie eine Linie [KFB Design §5].
    - **Durchdringung bzw. Bodenkontakt:** nie eine Linie (Kanon 4; Kontakt läuft über Geometrie, siehe R11-14).
    - **Figuren und Requisiten aus Knete:** standardmäßig keine Umrisslinie [V]. Knete trägt ihre Form über Licht und Kontakt; eine Linie würde den Knet-Look in Richtung Cel-Look verschieben.
- **Quelle:**
  - PSOFT, Pencil+ 4 Line, Referenz „Line Set“: https://docs.psoft.co.jp/plb400w/en/latest/reference/Line_LineSet.html
  - Cole, Golovinskiy, Limpaecher u. a., „Where Do People Draw Lines?“, ACM TOG 27(3), SIGGRAPH 2008, Abstract: https://gfx.cs.princeton.edu/pubs/Cole_2008_WDP/
  - Bénard, Hertzmann, „Line Drawings from 3D Models: A Tutorial“, 2019, Kapitel zu Konturen, Knicken (Diederwinkel-Schwelle) und Grenzen: https://arxiv.org/abs/1810.01175
- **Urteil:** **gilt für KFB**, eingeschränkt auf Terrain-Akzente. Ob Figuren je eine Umrisslinie bekommen, entscheidet Georg/WS0 (Frage F3).

#### R11-07 · Linienfarbe = Farbe der Fläche, zu der die Linie gehört (Color Hold)
- **Regel:**
  - In der 2D-Animation heißt eine Linie in der Farbe ihrer Fläche statt in Schwarz **Color Hold** [Q]. GG zeichnet den Umriss mit einer dunkleren Hülle derselben Figur [Q].
  - Zahlen für KFB [V]:
    - L\* 25–35 unter dem Lichtton der Trägerfläche, aber nie unter L\* 15;
    - C ≥ 0,9 × C der Trägerfläche;
    - h innerhalb ±10° der Trägerfläche bzw. von `edgeAccentTint`.
  - Grenze zwischen zwei Empfängern: Die Linie nimmt die Farbe der **dunkleren** Seite [V].
- **Quelle:**
  - Petersen, „Color Tutorial: Color Hold“ (Begriffsdefinition aus der Comic- und Animationsfarbe): http://davidpetersen.blogspot.com/2009/12/color-tutorial-color-hold-color-hold-is.html
  - Motomura, GDC 2015, Manuskript S. 24: zweite, dunklere Polygonhülle entlang der Normalen.
- **Urteil:** **gilt für KFB.** Die Rolle `edgeAccentTint` (Design #439 §3) wird damit rechenbar, statt frei gewählt zu werden.

#### R11-08 · Breite: nach Tiefe abnehmend, geklemmt, mit Ausblendung in der Ferne
- **Regel:**
  - Strichbreite ∝ 1/Tiefe und ∝ 1/Krümmung, auf ein festes Band geklemmt [Q Isophote Distance].
  - Breite und Deckkraft fallen zwischen einem Start- und einem Endabstand [Q Pencil+]. Sable blendet Outlines mit der Distanz aus, damit nichts aufpoppt [Q].
  - Künstler setzen die Breite stellenweise bis auf null [Q GG].
  - Zahlen für KFB [V]:
    - Akzentlinie nah höchstens 3 px@1080 (0,28 % der Bildhöhe), Mindestbreite 1 px@1080;
    - Deckkraft 1 bis z₁, 0 ab z₂ = 3 × z₁, wobei z₁ = Abstand der Spielkamera zum Fokus;
    - Enden laufen über ≥ 4 × Breite spitz aus, keine stumpfen Enden.
- **Quelle:**
  - Goodwin, Vollick, Hertzmann, „Isophote Distance: A Shading Approach to Artistic Stroke Thickness“, NPAR 2007 (Abstract, Index der NPAR-2007-Papers): https://kesen.realtimerendering.com/npar2007Papers.htm
  - PSOFT, Pencil+ 4 „Reduction Settings“ (Start, End, Kurve; Bezug Kamera oder Objekt): https://docs.psoft.co.jp/plb400w/en/latest/reference/Line_ReductionSetting.html
  - Game Developer über Kythreotis' Vortrag „The Art of Sable“ (GDC 2022): https://www.gamedeveloper.com/marketing/how-shedworks-refined-the-art-of-sable-in-pursuit-of-readability
  - Motomura, GDC 2015, Manuskript S. 24.
- **Urteil:** **gilt für KFB.** Abgrenzung: Der **helle** Saum bleibt nach L-3 auf ≤ 2 px begrenzt bzw. verboten. Diese Regel betrifft nur dunkle Akzente.

#### R11-09 · Linien sparsam
- **Regel:**
  - Akzentlinien sind selten [KFB Design §5].
  - Linienpixel ≤ 1,5 % der Bildfläche [V].
  - Höchstens 1 zusammenhängender Akzent je Landform-Bruch im Bild [V].
  - Keine Linie im 70-%-Ruhebereich, also nicht mitten auf großen Terrainflächen [KFB 70/20/10].
- **Quelle:** KFB Design #439 §5; Kanon Gebiet 2 (70/20/10).
- **Urteil:** **gilt für KFB.**

#### R11-10 · Linien greifen am Profil und flackern nicht
- **Regel:**
  - Linien sollen am wechselnden Profil sitzen, z. B. an Nasenrücken oder Kinn, und nicht wie aufgeklebt wirken [Q Spider-Verse: maschinelles Lernen setzte Gesichtslinien je Pose].
  - Für KFB: Ein Akzent behält bei einer Kamerafahrt über 10 Frames seine sichtbare Länge innerhalb ±20 %. Kein Aufblitzen beim LOD-Wechsel [V; KFB Design §5 nennt LOD-Brüche und Flimmern als Fehler].
- **Quelle:**
  - SideFX-Fallbericht zu *Spider-Verse* (Farnsworth, Grochola): https://www.sidefx.com/community/spider-man-into-the-spider-verse/
  - Whited u. a., „Computer-Assisted Animation of Line and Paint in Disney's Paperman“, SIGGRAPH Talks 2012: gezeichnete Linien werden über Bewegungsfelder des CG-Modells mitgeführt. https://media.disneyanimation.com/uploads/production/publication_asset/122/asset/pman.pdf (nur Titel und Zusammenfassung genutzt)
- **Urteil:** **gilt für KFB.** Das ML-Verfahren selbst ist nicht übernommen, weil es Offline-Produktion ist.

### (c) Kontakt und Erdung

#### R11-11 · Die dunkelste Stelle ist die Kontaktfuge
- **Regel:**
  - Wertordnung im Schatten [Q Gurney]: Halbton > Reflexlicht > Kernschatten > Okklusionsschatten.
  - Die dunkelste Stelle ist der Spalt, wo Form und Boden sich berühren [Q].
  - Zahlen für KFB [V]:
    - `contactDepthTint` liegt 8–12 L\* unter dem Wurfschatten desselben Empfängers;
    - Ausdehnung ≤ 0,15 × Radius der Aufstandsfläche;
    - eine harte Stufe mit AA nur am Grenzpixel (R11-16), kein weicher Ring („ohne dunkle Ringe“ [KFB `LIGHT_MODEL_R2`, contactAO]);
    - Untergrenze L\* ≥ 15 bei Tag (R4-11) bzw. L ≥ 8 bei Nacht (L-6).
- **Quelle:**
  - Gurney, „Light and Form, Part 2“: http://gurneyjourney.blogspot.com/2010/02/light-and-form-part-2.html
  - Gurney, „Albino Frogs & Occlusion Shadows“ (CG-Lichtsetzer nennen das Okklusionsschatten; dunkle Linie zwischen gedrückten Fingern): http://gurneyjourney.blogspot.com/2007/12/albino-frogs-occlusion-shadows.html
- **Urteil:** **gilt für KFB.** Setzt `contactDepthTint` in Zahlen. Widerspruch zur Klärung: R4-11 (L\* ≥ 15) gegen L-6 (nachts L ≥ 8), siehe Frage F4.

#### R11-12 · Okklusion verschiebt die Schwelle, statt weich abzudunkeln
- **Regel:**
  - GG legt einen Vertexfarbkanal als Versatz auf die Licht-Schatten-Schwelle. Verdeckte Stellen kippen dadurch früher in den Schatten; Wert 0 heißt immer Schatten [Q].
  - Hi-Fi Rush wandelt SSAO und GI in Schraffur und Raster um, weil die weichen Verläufe „schmutzig“ und zu 3D wirken [Q].
  - Für KFB: Der vorhandene `contactAO`-Term wirkt als **Schwellenversatz** im Toon-Schritt bzw. als Auswahl der Kontaktstufe, nicht als weicher Multiplikator [V].
- **Quelle:**
  - Motomura, GDC 2015, Manuskript S. 19.
  - Tanaka/Komada, GDC 2024, Folien 43–46.
- **Urteil:** **gilt für KFB**, mit Vorbehalt Clay-Golden: Die Umstellung muss gegen K1/H0 gleichwertig sein (Frage F1).

#### R11-13 · Echter Wurfschatten für jeden Akteur in jeder Stimmung
- **Regel:**
  - Schatten zeigen, wo eine Figur auf der Fläche steht. Sable ergänzte dafür Mondlicht, damit der Spieler möglichst immer einen Schatten wirft [Q].
  - Für KFB: Jede Figur, jeder Racer und jedes Requisit wirft in Tag, Gold **und** Nacht einen echten Shadow-Map-Schatten [V; Nacht trägt der Mond nach LIGHT_MODEL_R2 Regel 6].
- **Quelle:** Game Developer über Kythreotis, GDC 2022 (URL wie R11-08).
- **Urteil:**
  - **Gilt für KFB.**
  - **Nicht übernommen:** Hi-Fi Rush nutzt für Nebenfiguren Kapselschatten und für Gegner in der Luft Decal-Schatten per Raycast [Q, Folien 86 ff.]. Das sind Blob- bzw. Ersatzschatten, die Design #439 §0 ausdrücklich verbietet.

#### R11-14 · Erdung über Geometrie, keine gezeichnete Bodenlinie
- **Regel:**
  - Am Bodenkontakt wird keine Linie gezeichnet.
  - Die Fuge wird physisch gebrochen (Steinchen, Moos, Erdkeil) [KFB V-565]. Das Dunkel kommt aus R11-11.
- **Quelle:** Kanon Gebiet 4. Die 2D-Konvention „Strich am Kontakt“ (Pencil+ Durchdringungsklasse, R11-06) dient nur zur Abgrenzung.
- **Urteil:** **gilt für KFB.** Die Kontaktlinie aus Anime-CG ist **nicht übernommen**, weil Kanon 4 Linien als Übergang verbietet.

### (d) Gestufte Lichtrampen

#### R11-15 · Zwei Töne je Material, höchstens drei mit Kontaktstufe
- **Regel:**
  - Cel-Shading kennt Licht oder Schatten ohne Zwischenwert. GG nutzt eine einfache Stufenfunktion [Q].
  - Klassische Toon-Rampen bestehen meist aus 2 oder 3 konstanten Farbbereichen [Q X-Toon].
  - Für KFB:
    - **2 Töne** (Licht, Schatten) je Material plus höchstens 1 Kontaktstufe = **≤ 3** Werte je Material im Bild [V];
    - kein Glanzband (Kanon 8: kein CGI-Glanz).
- **Quelle:**
  - Motomura, GDC 2015, Manuskript S. 17–18.
  - Barla, Thollot, Markosian, „X-Toon: An Extended Toon Shader“, NPAR 2006, Abschnitt 1: https://maverick.inria.fr/Publications/2006/BTM06a/
  - Lake, Marshall, Harris, Blackstein, „Stylized Rendering Techniques for Scalable Real-Time 3D Animation“, NPAR 2000 (erste veröffentlichte Beschreibung laut X-Toon §2): https://dl.acm.org/doi/10.1145/340916.340918
- **Urteil:** **gilt für KFB.** Ob die Knete überhaupt hart stuft oder weich bleibt, entscheidet das Clay-Golden. Diese Regel begrenzt nur die **Zahl** der Stufen.

#### R11-16 · Harte Stufe, Glättung nur am Grenzpixel
- **Regel:**
  - Hi-Fi Rush glättet die harte Schwelle mit `smoothstep`, aber nur über die Breite des Grenzpixels, nicht als Verlauf [Q]. Statische Schattenkarten bekommen 4 × 4 PCF [Q].
  - Für KFB [V; Design #439: „gezähmte schmale Softness“]:
    - Terminator-Übergang ≤ 2 px@1080 in Nahsicht;
    - Wurfschattenkante ≤ 3 px@1080;
    - keine breite PCF-Halbschattenzone.
- **Quelle:**
  - Tanaka/Komada, GDC 2024, Folien zu „Implementing Halftone (Anti-Aliasing)“ und „Smoothstep Width“.
  - Zusammenfassung des Vortrags (4 × 4 PCF für Static Shadow Maps): https://www.foth.top/article/gdc-2024-hifirush-toonrendering-notes/
- **Urteil:** **gilt für KFB.** Bezug: Proof Stage G6 (Schattensaum).

#### R11-17 · Normalen beruhigen, sonst Flecken
- **Regel:**
  - Unter harter Schwelle wird jede kleine Normalenstörung zum großen Fleck [Q GG].
  - GG bearbeitet die Normalen an jedem wichtigen Formmerkmal von Hand [Q].
  - X-Toon mischt die Normalen stufenlos zu einer abstrahierten Hülle (geglättet, Ellipse, Zylinder, Kugel); die Silhouette bleibt dabei erhalten [Q].
  - Hi-Fi Rush nutzt für Gesichter eine „Threshold Map“ statt der Normalen [Q].
  - Für KFB: keine Schatteninseln kleiner als 0,5 % der Bildfläche des Objekts auf Knetflächen [V]. Gesichter immer mit abstrahierten bzw. geglätteten Normalen [V].
- **Quelle:**
  - Motomura, GDC 2015, Manuskript S. 17 und 21.
  - X-Toon §4 (Shape detail).
  - Tanaka/Komada, GDC 2024, Folien 117 ff. (Toon Face Shadow).
- **Urteil:** **gilt für KFB.** Ergänzt Kanon 9 (Augen und Gesicht lesbar) und L-9.

#### R11-18 · Detail sitzt im Übergangsband, Flächen bleiben ruhig
- **Regel:**
  - *The Bad Guys* setzte Texturdetail gezielt dorthin, wo Licht in Mittelton und Mittelton in Schatten übergeht [Q].
  - *Spider-Verse* zerlegte Verläufe in Flächen mit kurzen Übergängen [Q].
  - Für KFB: Knet-Fingerabdrücke und Oberflächendetail zeigen sich vor allem im Terminator-Band. Hochfrequenz-Energie auf beleuchteten Großflächen ≤ 0,5 × der Energie im Terminator-Band [V].
- **Quelle:**
  - VFX Voice, „DreamWorks Animation Hangs Out with The Bad Guys“ (Matt Baer, VFX Supervisor): https://vfxvoice.com/dreamworks-animation-hangs-out-with-the-bad-guys/
  - fxguide, „Why Spider-Verse has the most inventive visuals…“ (Dean Gordon, Art Director): https://www.fxguide.com/fxfeatured/why-spider-verse-has-the-most-inventive-visuals-youll-see-this-year/
- **Urteil:** **gilt für KFB.** Passt zu 70/20/10 („Ruhe darf Textur haben, aber keine Konkurrenz“).

#### R11-19 · Lichtabfall von Praktikals in Stufen
- **Regel:**
  - Hi-Fi Rush verbietet Verläufe beim Distanzabfall lokaler Lichter. Stattdessen dunkelt es in ausgeschnittenen Stufen ab; der Art Director lieferte **7** Ausschnittmuster [Q].
  - Für KFB-Praktikals (Nacht-Inseln, LIGHT_MODEL_R2 Regel 6): 2–3 Ringstufen je Lichtinsel [V].
- **Quelle:** Tanaka/Komada, GDC 2024, Folien 69–71 („Toon Light (Cutouts)“).
- **Urteil:** **gilt für KFB** für echte Praktikals (V-385).
  - **Nicht übernommen:** Decal-Lichter, die Figuren nicht beleuchten (Folie 77). Sie widersprechen „alles empfängt vom einen Rig“.

### (e) Werthierarchie über die Tiefe

#### R11-20 · Ton-Detail nimmt mit der Tiefe ab (X-Toon-Formel)
- **Regel:**
  - Die Toon-Rampe bekommt eine zweite Achse „Detail“ D ∈ [0, 1] [Q]:
    - D = 1 − log(z / z_min) / log(r), mit z_max = r × z_min;
    - Tiefe gemessen entlang der Blickachse für Abstraktion und Luftperspektive [Q].
  - Mit sinkendem D konvergieren die Töne, z. B. in Kontrast, zu einem Farbton oder in Deckkraft [Q].
  - Für KFB [V]:
    - Schatten-ΔL\* skaliert mit D, von voll bei z_min bis höchstens 40 % bei z_max;
    - z_min = Abstand Spielkamera–Fokus, r = 4.
  - Das erfüllt R4-03 (Kontrastspanne hinten ≤ 0,6 × vorn) über die Materialantwort statt über eigenes Licht.
- **Quelle:** X-Toon, Abschnitt 3.1 (Formel, Abb. 7d „receding shadows“, Abb. 9 Luftperspektive).
- **Urteil:** **gilt für KFB unter Vorbehalt.** Ob eine tiefenabhängige Materialantwort als „privater Lichttrick“ gilt, entscheidet WS0 (Frage F2).

#### R11-21 · Linien blenden in der Ferne aus
- **Regel:** Akzentlinien verlieren mit der Distanz Deckkraft, damit nichts aufpoppt [Q Sable, Pencil+]. Zahlen siehe R11-08 (z₂ = 3 × z₁) [V].
- **Quelle:** wie R11-08.
- **Urteil:** **gilt für KFB.**

#### R11-22 · Luftperspektive je Biom
- **Regel:**
  - Sable nennt Nebel entscheidend für die Lesbarkeit auf mittlere und große Distanz. Er ist je Biom eingestellt und trägt Stimmung und Tageszeit [Q].
  - X-Toon lässt ferne Töne zu einem Farbton konvergieren [Q].
  - Für KFB: Nebelfarbe = `sky`-Rolle der Zonenpalette, keine eigene Nebelfarbe [V].
- **Quelle:** Game Developer über Kythreotis, GDC 2022 (URL wie R11-08); X-Toon Abb. 9.
- **Urteil:** **gilt für KFB unter Vorbehalt.** R4-03 hat dieselbe offene Frage (Tiefennebel im einen Rig); sie geht einmal an WS0, nicht zweimal.

#### R11-23 · Farbversatz statt Tiefenunschärfe (Spider-Verse)
- **Regel:** *Spider-Verse* ersetzte Defokus durch versetzte Farbauszüge wie bei einem verrutschten Comicdruck [Q].
- **Quelle:** fxguide (Danny Dimian), URL wie R11-18; Foundry Insights (ChromaShifter): https://www.foundry.com/insights/film-tv/graphic-look-in-comp-spiderman
- **Urteil:** **nicht übernommen.** Das ist eine Druckmetapher und gehört nicht zur Knet- bzw. Diorama-Welt (Kanon: ein handgemachtes Objekt). Außerdem wäre es Copy einer fremden Marke (Design #439 §0).

### (f) Gemischte Materialien unter einem Licht zusammenhalten

#### R11-24 · Eine Stilisierung für jeden Lichtterm und jede Materialklasse
- **Regel:**
  - Hi-Fi Rush stilisiert **jede Lichtschicht einzeln**, darunter SSAO, SSR und GI, statt nur das Endbild zu filtern. Ziel war, dass Figuren und Umgebung gleichermaßen „toon“ wirken [Q].
  - *Spider-Verse* legte dieselben Raster und Schraffuren auf Haut wie auf die Umgebung [Q].
  - Für KFB: Schattenstufe (R11-15/16), Kontaktstufe (R11-11/12) und Hemi-Füllung laufen für **alle** Klassen durch dieselbe Toon-Antwort: Clay, Karte, Meshy, Fahrzeug [KFB `LIGHT_MODEL_R2` Regel 9].
- **Quelle:**
  - Tanaka/Komada, GDC 2024, Folien 17 und 44.
  - fxguide (Spider-Verse), URL wie R11-18.
- **Urteil:** **gilt für KFB.**

#### R11-25 · Gleiche Albedo-Helligkeit ergibt gleichen Schattensprung
- **Regel:**
  - GG behandelt Licht- und Schattenfarbe als bewusste Farbgestaltung je Material, wie ein Colour Designer im Anime [Q].
  - Für KFB: Jede Klasse dokumentiert ihr Quartett (Licht, Schatten, Kontakt, Kante) in OKLCH [V; V-566 verlangt schon „Schattentönung“ je Profil]. Zwei Klassen mit gleichem Licht-L\* (±5) haben unter demselben Rig einen Schattensprung ΔL\*, der höchstens 5 auseinanderliegt [V]. Ausnahme: der Festigkeitsunterschied nach R11-03.
- **Quelle:** Motomura, GDC 2015, Manuskript S. 22.
- **Urteil:** **gilt für KFB.** Macht „Figuren aufgeklebt“ (LIGHT_MODEL_R2, Befund) messbar.

#### R11-26 · Figuren sparsamer beleuchtet als die Umgebung
- **Regel:**
  - *Klaus* zerlegt Figurenlicht in wenige Bausteine: direktes Licht mit Schatten, Ambient, Bounce, Rim [Q].
  - Die Hintergründe nutzen das Licht voll, Figuren nur begrenzt [Q Biernacki].
  - Für KFB: Figuren bekommen nur Sonne, Hemi und das Figurenlicht nach Regel 11 [KFB]. Keine weiteren Figurenterme [V].
- **Quelle:** CGW, „Stamp Act“ (Winter 2019), Aussagen von Jakubowski und Biernacki: https://www.cgw.com/Publications/CGW/2019/Winter-2019/Stamp-Act.aspx
- **Urteil:** **gilt für KFB** ohne den Rim (R11-28).

#### R11-27 · Kein CG-Glanz, kein eingemaltes Licht
- **Regel:**
  - Fortiche dämpft Glanzlichter per eigenem Shader [Q, Sekundärquelle].
  - Licht und Schatten sind in Arcane in die Textur gemalt [Q, Sekundärquelle].
- **Quelle:** RedShark News, „Why Netflix's Arcane looks so good“ (D. Winter, 2024, Sekundärquelle): https://www.redsharknews.com/why-netflixs-arcane-looks-so-good-how-fortiche-ramped-up-the-animation-pipeline
- **Urteil:**
  - **Glanz dämpfen gilt** (deckt sich mit Kanon 8).
  - **Gemaltes Licht nicht übernommen**, weil Kanon 15 (3) eingebackenes Licht und AO verbietet und es mit der Tageszeit (Tag/Gold/Nacht) brechen würde.

### Rand- und Gegenlicht, Bounce, Lichtvektor je Figur

#### R11-28 · Randlicht
- **Regel:** Fast alle untersuchten Filme nutzen Rim:
  - *Puss in Boots* setzt grafische Rims als Stilmittel [Q Edwards];
  - *Klaus* führt Rim als eigenen Baustein [Q];
  - Pixar lehrt Rim als Standardrolle [Q Pixar in a Box];
  - X-Toon simuliert Gegenlicht über die Orientierung [Q].
- **Quelle:**
  - befores & afters zu *Puss in Boots: The Last Wish* (Mark Edwards): https://beforesandafters.com/2023/01/11/heres-how-dreamworks-lent-a-whole-new-brand-of-stylized-look-and-feel-to-puss-in-boots-the-last-wish/
  - CGW (Klaus), URL wie R11-26.
  - Khan Academy, Pixar in a Box, „Light roles“: https://www.khanacademy.org/computing/pixar/art-of-lighting/introduction-to-virtual-lighting/v/lighting-roles
  - X-Toon §3.2.
- **Urteil:** **nicht übernommen**, weil V-392 / LIGHT_MODEL_R2 Rand- und Gegenlicht standardmäßig verbietet; der Saum wurde gemessen (L-3). **Ersatz:**
  - Silhouette-Rescue (Kanon 16): Boden hinter dem Objekt heller, Hintergrund dunkler, Formänderung;
  - Wertabstand Figur–Grund nach R4-12;
  - an Terrain-Kanten ein dunkler Color-Hold-Akzent (R11-07) statt eines hellen Saums.

#### R11-29 · Bounce steckt im Schattenton, nicht in einer Zusatzlampe
- **Regel:**
  - *Klaus* führt Bounce als Baustein [Q].
  - Pixar bringt die Beleuchtung physikalisch schnell auf etwa 80 % und färbt den Rest gezielt um, z. B. den Rückstrahl eines Tisches grün [Q Kalache].
  - Gurney: Ein farbiger Bodenreflex in passender Eigenfarbe hebt die Buntheit im Schatten [Q].
  - Für KFB: Nach unten gewandte Schattenflächen ziehen ihren Schattenton um ≤ 15° h Richtung Boden-Rolle (`edgePalette`), mit C bis 1,15 × Empfänger [V]. Technisch ist das Hemi-Boden = `edgePalette` [KFB Regel 4]; eine zusätzliche Bounce-Lampe gibt es nicht.
- **Quelle:**
  - blackfilm.com, Interview mit Jean-Claude Kalache (Director of Photography – Lighting, *Toy Story 4*): https://www.blackfilm.com/read/exclusive-toy-story-4-lighting-and-animation-team-talk-pushing-the-boundaries-of-technology/
  - Gurney, „Chroma in the Shadows“ (URL wie R11-02).
  - CGW (Klaus), URL wie R11-26.
- **Urteil:** **gilt für KFB** über das bestehende Rig.

#### R11-30 · Eigener Lichtvektor je Figur bzw. eigenes Figurenlichtsystem
- **Regel:**
  - GG gibt jeder Figur einen eigenen Lichtvektor, der ihre Grundpose am besten ausleuchtet. In Zwischensequenzen wird er pro Frame mitanimiert [Q].
  - Hi-Fi Rush trennt Figurenlicht von Umgebungslicht und gibt dem Spieler ein eigenes Licht nur für Schatten [Q].
- **Quelle:** Motomura, GDC 2015, Manuskript S. 20; Tanaka/Komada, GDC 2024, Folien 77 und 82–83.
- **Urteil:** **nicht übernommen.** Schatten von Figur und Welt müssen aus derselben Sonne fallen (V-564, „alles wirft und empfängt vom einen Key“). Das Figurenlicht nach Regel 11 bleibt die einzige, schattenlose Ausnahme.

---

## Teil C · Übernommen und nicht übernommen, Kurzbilanz

| Technik | Quelle | KFB |
|---|---|---|
| Licht/Schatten-Paar je Material | GG | **gilt** (R11-01, -03, -25) |
| Schatten aus Empfänger mit h ≤ 20°, C hoch | Slynyrd, Gurney, Gooch | **gilt** (R11-02), ohne die Warm-kalt-Richtung |
| gemalte Schattenfarb-Volumen | Hi-Fi Rush | nicht übernommen, weil zweite Farbquelle neben der Palette |
| AO als Schwellenversatz, Verläufe weg | GG, Hi-Fi Rush | **gilt** (R11-12), Clay-Golden prüfen |
| Kapsel- bzw. Decal-Schatten | Hi-Fi Rush | nicht übernommen, weil Blob-Verbot |
| 2 (+1) Stufen, AA nur am Grenzpixel | GG, X-Toon, Hi-Fi Rush | **gilt** (R11-15, -16) |
| Color Hold statt schwarzer Linie | 2D-Praxis, GG | **gilt** für Terrain-Akzente (R11-07) |
| Linienbreite ∝ 1/Tiefe, Ausblenden | Isophote, Pencil+, Sable | **gilt** (R11-08, -21) |
| Umrisslinie um Figuren | GG, Anime-CG | offen (F3), Standard nein |
| Kontakt- bzw. Durchdringungslinie | Pencil+ | nicht übernommen, weil Kanon 4 Linien als Übergang verbietet |
| Tiefe als zweite Rampenachse | X-Toon | gilt unter Vorbehalt (F2) |
| Nebel je Biom | Sable | gilt unter Vorbehalt (wie R4-03) |
| Farbversatz statt Defokus | Spider-Verse | nicht übernommen, weil Fremdmarke und Druckmetapher |
| Rim- bzw. Gegenlicht | Puss, Klaus, Pixar, Arcane | **nicht übernommen** (V-392) |
| Bounce umfärben | Pixar, Klaus | **gilt** über Hemi-Boden = `edgePalette` (R11-29) |
| gemaltes, eingebackenes Licht | Arcane | nicht übernommen (Kanon 15) |
| Lichtvektor je Figur, Figuren-Lichtsystem | GG, Hi-Fi Rush | nicht übernommen, weil eine Sonne |

---

## Vorschlag Prüfung

**Gate `kfb_toon_gate`.** Python, neben dem in R4 vorgeschlagenen `kfb_color_gate`, dieselben Kameras und dieselbe Ausgabe `{ok, fail[], findings[]}`.

**Voraussetzung:** WS1 liefert je Abnahmebild drei Debug-Masken aus dem bestehenden Renderer, ohne neuen Renderpfad:
1. Schattensichtbarkeit V (0/1 nach Schwelle);
2. Kontaktmaske (`contactAO` > Schwelle);
3. Linienmaske.

Fehlen sie, laufen T2–T5 nur als TUNE mit Näherung über die L\*-Segmentierung.

**Stufe 1 · Daten** (Palette und `kfb-clay`-Profile):
- **T1 (R11-01/02/03):**
  - Jede Rolle hat `castShadowTint`, `contactDepthTint`, `edgeAccentTint`.
  - Je Rolle gilt: ΔL\* Licht→Schatten im Klassenband nach R11-03, |Δh| ≤ 20°, C-Verhältnis 0,8–1,15.
  - Kontakt 8–12 L\* unter Schatten; Kante 25–35 L\* unter Licht; alle Werte ≥ L\* 15.
- **T7 (R11-25):** Klassenpaare mit Licht-L\* ±5 haben ΔL\* ±5, Festigkeitsausnahme laut Profil.

**Stufe 2 · Bild** (Spielkamera und 4 Kritiker-Kameras, Tag/Gold/Nacht, mit Clay):
- **T2 Schattenfarbe (R11-02, -05):**
  - Je Empfängerrolle die Medianfarbe in V = 0 gegen V = 1 im 8-px-Nachbarring vergleichen.
  - Erwartet ist ΔL\*, h und C im Band von T1, mit Toleranz ±5 L\* bzw. ±8° bzw. ±0,15 im Verhältnis.
  - In Überlappungen von zwei Schatten bleibt L\* innerhalb ±3 des Einzelschattens.
  - Kein Schattenpixel mit C < 0,02 und L\* < 20 (also schwarzgrau).
- **T3 Stufen (R11-15, -16, -17):**
  - Im Lichtbereich jeder Materialregion hat das L\*-Histogramm ≤ 3 Spitzen.
  - Querprofile über den Terminator an 20 Stellen: Übergangsbreite (10 → 90 %) ≤ 2 px@1080; Wurfschattenkante ≤ 3 px@1080.
  - Schatteninseln < 0,5 % der Objektfläche: 0 Stück.
- **T4 Linien (R11-06…-09, -21):**
  - Linienpixel ≤ 1,5 % des Bildes; Breite ≤ 3 px@1080.
  - Linien-L\* 25–35 unter der Trägerfläche; |Δh| ≤ 10°; kein Linienpixel schwarzgrau.
  - Überlappung der Linienmaske mit der Farbfeld-Grenzmaske und mit Bodenkontakten < 5 %.
  - Deckkraft hinter z₂ = 0.
  - Flimmertest: über 10 Frames Kamerafahrt schwankt die Akzentlänge um ≤ ±20 %.
- **T5 Kontakt und Erdung (R11-11, -13):**
  - Je Akteur bzw. Requisit liegen die dunkelsten 5 % der Pixel im Ring um die Aufstandsfläche innerhalb 0,15 × Aufstandsradius.
  - Kontakt-L\* liegt 8–12 unter dem Wurfschatten, aber ≥ 15 bei Tag bzw. ≥ 8 bei Nacht.
  - Jeder Akteur hat in **jeder** Stimmung einen Schatten. Dessen Form deckt sich mit der Silhouetten-Projektion aus der Shadow-Map: IoU ≥ 0,8 gegen Referenzrender ohne Toon-Antwort.
  - 0 Blob-, Decal- oder Kapselschatten-Objekte in der Szene (Szenengraph-Prüfung).
- **T6 Tiefe (R11-20):** Schattenkontrast ΔL\* im hinteren Tiefenterzil ≤ 0,6 × vorderes Terzil (dieselbe Messung wie R4-03; einmal implementieren).
- **T8 Saum (R11-28):** heller Saum ≤ 2 px@1080 an allen Figuren und Stimmungen (Wiederverwendung von L-3).

**FAIL-Kriterien zuerst:**
- T1 fehlende Rolle;
- T2 schwarzgraue Schatten bzw. Multiply in Überlappungen;
- T5 fehlender Schatten bzw. Blob-Objekt;
- T8.

Alles andere ist TUNE, bis es an 5–10 abgenommenen KFB-Szenen geeicht ist [V].

**Blinder Kritiker** (Fragen für `CRITIC_3D_R1.md`, Gebiete K4 und K6):
- **K6-R11a (R11-01/02):** „Haben Schatten auf verschiedenen Böden verschiedene, zum Boden passende Farben, oder liegt überall dasselbe Grau bzw. Braun?“
- **K6-R11b (R11-05/11):** „Wo ist es am dunkelsten? Liegt das Dunkelste in den Kontaktfugen und nicht dort, wo sich Schatten überlagern?“
- **K4-R11c (R11-13/14):** „Steht jede Figur und jedes Fahrzeug sichtbar **auf** dem Boden, auch nachts? Gibt es Schatten, die wie runde Aufkleber aussehen?“
- **K6-R11d (R11-06…-09):** „Gibt es Linien, die eine Farbfeld-Grenze oder einen Bodenkontakt nachzeichnen, die schwarz wirken oder flimmern?“
- **K6-R11e (R11-24/25):** „Sieht irgendein Objekt aus, als käme sein Licht aus einer anderen Welt: anderer Schattensprung, Glanz, weicherer Verlauf?“
- **K6-R11f (R11-28):** „Gibt es einen hellen Rand um Figuren, der nicht von der Sonne kommt?“

---

## Offene Fragen an WS0

- **F1 (R11-12):** Darf `contactAO` als Schwellenversatz in den Toon-Schritt gehen statt als Multiplikator? Gleichwertigkeitsbeweis gegen das Clay-Golden K1/H0 nötig.
- **F2 (R11-20):** Ist eine tiefenabhängige Materialantwort (X-Toon) mit „ein Rig, ein Tonweg“ vereinbar, oder gilt sie als Lichttrick?
- **F3 (R11-06):** Bekommen Knet-Figuren je eine Umrisslinie (Color Hold), z. B. nur in bestimmten Story-Modes, oder nie?
- **F4 (R11-11):** Untergrenze Schatten/Kontakt bei Nacht: R4-11 (L\* ≥ 15) oder L-6 (L ≥ 8)? Beide Maße vereinheitlichen.
- **F5 (R11-22 = R4-03):** Tiefennebel in Biomfarbe im einen Rig: ja oder nein.
- **F6 (zu R4-11):** Ein schmales, bunteres Band am Terminator (TF2 laut R4; ähnlich in Fan-Rekonstruktionen von *Genshin*) ist **nicht** belegt genug für eine Regel. Wenn gewünscht, als eigener A/B-Test im #439-Fixture.

---

## Quellen

**Primär, gelesen:**
- Motomura, Junya C.: „Guilty Gear Xrd's Art Style: The X Factor Between 2D and 3D“, GDC 2015, Vortragsmanuskript (34 S.), Seiten wie oben zitiert: https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf · Begleitseite: https://www.arcsystemworks.com/guilty-gear-xrds-art-style-the-x-factor-between-2d-and-3d-talk-from-gdc-2015-is-now-available-online/
- Tanaka, Kosuke; Komada, Takashi: „3D Toon Rendering in Hi-Fi RUSH“, GDC 2024, Folien mit Sprechertext (191 S.), Foliennummern wie oben: https://media.gdcvault.com/gdc2024/Slides/GDC+slide+presentations/Tanaka_Kosuke_3D_Toon_Rendering.pdf · Vault: https://gdcvault.com/play/1034330/3D-Toon-Rendering-in-Hi
- Barla, Pascal; Thollot, Joëlle; Markosian, Lee: „X-Toon: An Extended Toon Shader“, NPAR 2006, §1, §3.1, §3.2, §4: https://maverick.inria.fr/Publications/2006/BTM06a/
- PSOFT: Pencil+ 4 Line, Referenz „Line Set“ und „Reduction Settings“: https://docs.psoft.co.jp/plb400w/en/latest/reference/Line_LineSet.html · https://docs.psoft.co.jp/plb400w/en/latest/reference/Line_ReductionSetting.html
- Gurney, James: „Light and Form, Part 2“; „Albino Frogs & Occlusion Shadows“; „Chroma in the Shadows“ (URLs oben).
- Schlitter, Raymond (Slynyrd): „Pixelblog 1 – Color Palettes“ (URL oben).

**Primär, nur Abstract bzw. Zusammenfassung:**
- Cole, Forrester u. a.: „Where Do People Draw Lines?“, SIGGRAPH 2008.
- Goodwin, Todd; Vollick, Ian; Hertzmann, Aaron: „Isophote Distance“, NPAR 2007.
- Bénard, Pierre; Hertzmann, Aaron: „Line Drawings from 3D Models: A Tutorial“, 2019.
- Lake, Adam u. a.: NPAR 2000.
- Gooch, Amy u. a.: SIGGRAPH 1998 (Werte über Wikipedia).
- Whited, Brian u. a.: *Paperman*, SIGGRAPH Talks 2012.

**Interviews und Berichte (Sekundär, Aussagen namentlich zugeordnet):**
- fxguide zu *Spider-Verse* (Dimian, Gordon); Foundry Insights (Basantani, Recuay); SideFX-Fallbericht (Farnsworth, Grochola).
- befores & afters zu *Puss in Boots: The Last Wish* (Edwards).
- VFX Voice zu *The Bad Guys* (Perifel, Baer).
- CGW „Stamp Act“ zu *Klaus* (Pablos, Biernacki, Jakubowski); ACM SIGGRAPH Blog: https://blog.siggraph.org/2019/12/behind-the-magic-of-netflixs-klaus.html/
- Game Developer zu *Sable* (Kythreotis, GDC 2022).
- blackfilm.com zu *Toy Story 4* (Kalache).
- Khan Academy, Pixar in a Box „Light roles“ (Inhalt nur über die Kursbeschreibung erschlossen).
- RedShark News und VFX Voice zu *Arcane* (schwach, keine Fortiche-Aussage zur Lichttechnik).
- Petersen, „Color Hold“ (Begriffsdefinition).
- foth.top, Mitschrift zum Hi-Fi-RUSH-Vortrag (nur für 4 × 4 PCF).

**Nicht belastbar gefunden, deshalb keine Regel darauf gestützt:**
- *Rick and Morty*: nur ein Fan-Tutorial, keine Produktionsquelle zu Linienfarbe oder Schatten.
- *Genshin Impact*: nur Fan-Rekonstruktionen; keine offizielle Quelle zu Rampen oder Outline-Breite.
- *Breath of the Wild*: GDC-2017-Berichte enthalten keine Schattierungsdetails.
- *Tunic*: nur Hinweise auf vorberechnete GI und Tilt-Shift.
- Sharon Calahan (SIGGRAPH 1996) bleibt unzugänglich (wie R4).

**Zugangsweg:** Keine PDF wurde in einem Browser-Panel geöffnet.
- Die GG-PDF kam über WebFetch.
- Die PDFs von Hi-Fi Rush und X-Toon waren für WebFetch zu groß bzw. gesperrt. Sie wurden per `curl` ins Scratchpad geladen.
- Den Text aller drei habe ich lokal mit `pypdf` extrahiert.
