# BACKLOG · Comic/Cartoon-Look für KFB World Design
Stand: 2026-09-23 · Referenzen aus Georgs Formular eingearbeitet (Looney Tunes/Roadrunner-Himmel,
gemalte Scenic-Art à la Maurice Noble/Hanna-Barbera/UPA, Aardman-Claymation, Mario-Kart-Stilisierung,
Cel-Shading-SOPs aus 3D-Games/Indie). Nichts hier ist gebaut — das ist die Ideenliste, aus der du
Punkte für den Lab ziehst.

Legende je Punkt: **[Owner]** = existierender KFB-Owner nutzbar · **[Neu]** = müsste neu gebaut werden.

## 1 · Himmel & Hintergrund (Background-Ebene, McCloud)

- **Looney-Tunes-/Roadrunner-Skydome** — glatter Farbverlauf (2–3 Bänder, keine Wolkendetails),
  darauf EIN gemaltes Wolken-Motiv als flaches Sprite, das mit der Kamera mitwandert statt sich
  zu drehen (Parallax 0). Unterscheidet sich von deinem jetzigen „Aquarell"-Himmel dadurch, dass
  er FLACH bleibt — keine Kuppel-Textur, sondern 2–3 Ebenen aus Sprites vor Vollton. **[Neu]**
- **Gemalte, collagenartige Scenic-Art** (Maurice Noble/Chuck Jones-Layout-Schule, UPA,
  Hanna-Barbera-Establishing-Shots) — Hintergrund als EIN gemaltes Bild (Textur-Ebene) statt 3D-
  Geometrie; Vordergrund-Requisiten bleiben 3D und stehen davor. Für die Hintergrund-Ebene deiner
  Welt-Ebenen ein Umschalter „Matte Painting statt Geometrie". Bräuchte entweder ein KI-generiertes
  oder ein von dir hochgeladenes Gemälde als Textur, keine prozedurale Lösung. **[Neu, + Content]**
- **Handgezeichnete Wolkenbänke / Sonnenstrahlen** als Sprite-Layer (additiv, leicht transparent,
  feste Bildschirmposition mit leichtem Parallax) — Ergänzung zu jedem Himmel-Modus. **[Neu]**
- **Tageszeit als harte Schnitte statt Übergang** — dein Zyklus faded gerade weich; ein
  „Comic-Modus" könnte stattdessen in EINEM Frame umschalten (wie ein Panelwechsel). **[Neu, klein]**

## 2 · Farbe & Palette

- **Limited-Palette-Regel** — eine feste Palette von 6–12 Farben je Story-Modus (statt Verlauf),
  jede Fläche wird auf die NÄCHSTE Palettenfarbe gerastert (kein Mischen). Deine Story-Palette
  interpoliert aktuell weich; ein „Hard Quantize"-Regler (0 = weich wie jetzt, 1 = harte Sprünge)
  wäre eine kleine Ergänzung zum bestehenden Uniform-Satz. **[Owner-nah, Neu]**
- **Ambient Occlusion als Halbton statt Schatten** — statt AO abzudunkeln, in eine Screentone-
  Textur (Punktraster) einblenden; klassischer Manga-/Comic-Kniff. Braucht eine Halbton-Textur
  (kann der Makro-Generator liefern) und einen zusätzlichen Mix-Kanal im Look-Shader. **[Neu]**
- **Warm/Kalt-Splitting verstärken** — dein Grade-Pass hat das schon (Warm/Kalt-Vektoren); als
  eigener „Comic Grade"-Preset mit stärkerem Split + härterem Kontrast direkt nutzbar. **[Owner]**
- **Rim-Light als Stilmittel** — ein zusätzlicher, IMMER sichtbarer Kantenglanz unabhängig vom
  echten Licht (klassischer Cartoon-Trick, nicht physikalisch). Eigener Shader-Term im Look.
  **[Neu, klein]**

## 3 · Linie & Tusche

- **Speedlines / Motion-Streaks** — radiale oder parallele Linien hinter bewegten Objekten, nur
  bei Bewegung über einer Schwelle. Bräuchte eine Bewegungs-Erkennung (Differenz zum Vorframe)
  und einen eigenen Compositing-Layer; deine Tusche kennt nur Kanten, keine Zeit. **[Neu]**
- **Impact-Frames** — 1–2 Einzelbilder mit Sternenexplosion/Kontrastblitz bei Kollision oder
  Aktion; für den Lab am ehesten als Demo-Trigger-Knopf sinnvoll, nicht als Dauerzustand. **[Neu]**
- **Variable Linienstärke nach Handlung statt nur nach Licht** — deine Tusche hat schon
  „Licht dünn/Schatten dick"; zusätzlich eine Stärke nach BILDEBENE (Vordergrund dicker,
  Hintergrund dünner) wie im letzten Beleg schon als Idee genannt. **[Owner-nah]**
- **Geschlossene vs. offene Linien** — Comic-Tinte lässt an Highlights bewusst Lücken
  („broken line"); dein Aussetzer-Regler ist technisch schon da, aber zufällig statt
  helligkeitsgesteuert. Aussetzer an die Bildhelligkeit koppeln (viel Licht → mehr Lücken).
  **[Owner-nah, klein]**

## 4 · Material-Sprache

- **Halftone/Screentone-Overlay** — Punktraster in Grössen-/Dichte-Stufen je Helligkeit,
  klassischer Print-Comic-Look. Eigene Ebene im Look-Shader (Bildschirmraum, nicht triplanar).
  **[Neu]**
- **Papier-Textur-Overlay** — feines Papiergrain über dem ganzen Bild (Post-Effekt, nicht
  Material), macht 3D wie gedrucktes Comic-Papier aussehen. Passt an denselben Ort wie dein
  Grade-Pass. **[Neu, klein]**
- **Cross-Hatching statt Schattenfläche** — im Schattenbereich (Cel-Stufe 0) ein Schraffur-Muster
  statt Volltonfarbe. Erweiterung deines Cel-Shadings um eine Musterstufe. **[Neu]**
- **Wallace-&-Gromit-Claymation-Look** — sichtbare Fingerabdrücke/Knet-Unebenheiten als
  Normalen-Störung (dein Flächen-Wobble ist die Bewegung dazu, fehlt aber die STATISCHE
  Oberflächen-Unruhe). Feinkörniges, tiefes Bump-Rauschen + Stop-Motion-Ruckeln (Frame-Halten
  statt weicher Interpolation) als Bewegungsmodus. **[Neu, zwei Teile]**
- **Mario-Kart-Stilisierung** — sehr glatte, grossflächige Farbflächen mit fast keiner Textur,
  starker Sättigung, dickem, gleichmässigem Umriss, kaum Rauheit-Variation. Als LOOK-Preset aus
  bereits vorhandenen Reglern zusammensetzbar (macro niedrig, cel hoch, sat hoch, roughVar 0).
  **[Owner-nah — reiner Preset, kein neuer Code]**

## 5 · Kamera & Framing

- **Weitwinkel-Verzug** — leichte Fisheye-Verzerrung an den Bildrändern, klassischer
  Cartoon-Kameratrick für Übertreibung. Eigener Post-Pass. **[Neu]**
- **Erzwungene Perspektive** — zwei Brennweiten gleichzeitig simulieren (Vordergrund near-fov,
  Hintergrund far-fov) für überzogene Tiefe. Aufwendig, eher Experiment als Feature. **[Neu, groß]**
- **Panel-artige Einzelbilder** — die Bank als Storyboard-Panel-Raster nutzen (mehrere Kamera-
  Winkel eines Moments nebeneinander), nicht nur Look-Vergleich. Wäre ein dritter Modus neben
  BANK/WELT. **[Neu, mittel]**

## 6 · Bewegung & FX

- **Squash & Stretch auf Requisiten** — beim Auftreffen/Abheben kurz strecken/quetschen; dein
  Flächen-Wobble ist Textur-Bewegung, kein Squash. Bräuchte einen Trigger und eine Zeitkurve pro
  Objekt. **[Neu]**
- **Partikel-Sprache** (Staubwolke bei Landung, „?"/Ausrufezeichen über dem Kopf) — klassische
  Cartoon-Icons als Sprite-Emitter. **[Neu, groß — eigenes Thema]**
- **Zeitlupen-Pose / Hold-Frame** — kurzes Einfrieren auf einer übertriebenen Pose (Comic-Beat).
  Braucht Animationssteuerung, die der Lab aktuell nicht hat (er zeigt Standbilder/Loops).
  **[Neu, groß]**

## 7 · Cel-Shading- & Cartoon-Rendering-SOPs aus 3D-Games/Indie (branchenüblich, referenzierbar)

- **Zwei-Stufen-Toon statt kontinuierlichem Licht** — dein `celBands` deckt das schon ab
  (2–6 Stufen einstellbar). **[Owner — schon da]**
- **Inverted-Hull-Outline** als ALTERNATIVE zur Bildschirmraum-Tusche (Mesh entlang der Normalen
  nach aussen verdoppelt, Rückseite als Tinte) — robuster bei sehr dünnen Teilen (Waffen, Haare),
  kostet aber einen zweiten Materialdurchgang pro Objekt statt einem globalen Post-Pass. Wäre eine
  Alternative, kein Ersatz — für Requisiten mit dünnen Kanten evaluieren. **[Neu]**
- **Spezialgesteuerte Speculare (Anime-Kick)** — ein hartes, kleines Glanzlicht mit fester Form
  statt physikalischem Speculare; dein Cel-Shading macht das teilweise (`smoothstep` auf
  Specular), könnte als eigener Regler „Kick-Grösse" geschärft werden. **[Owner-nah]**
- **Farb-Ramp-Texturen statt Formel** — viele Indie-Toon-Shader nehmen eine 1D-Gradient-Textur
  statt einer berechneten Stufenfunktion, weil Artists sie direkt malen können. Wäre ein
  alternativer Eingang für dein Cel-Shading (Textur statt `celBands`/`celSoft`). **[Neu, mittel]**
- **Distance-based Line Width** — Konturbreite nimmt mit der Entfernung zur Kamera ab, damit
  Linien in der Ferne nicht zu dick wirken (dein Tusche-System bezieht sich aktuell nur auf die
  Feldhöhe, nicht auf die Objektdistanz). **[Owner-nah, klein]**

## Reihenfolge-Vorschlag (klein → groß, nach Georgs vier gewählten Feldern)

1. Mario-Kart-Preset (reiner Preset, kein Code) · Distance-based Line Width · Aussetzer an Helligkeit koppeln
2. Halftone/Screentone-Overlay · Papier-Grain-Overlay · Rim-Light-Term
3. Looney-Tunes-Skydome (flache Sprite-Ebene) · Hard-Quantize-Palette
4. Claymation-Bump + Stop-Motion-Hold · Cross-Hatching-Schatten
5. Speedlines/Impact-Frames · Panel-Modus (grösser, eigenes Konzept nötig)
