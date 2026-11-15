# Clay-Look, Psychedelik, Gilliam, 2.5D · Recherche R1 · 15.11.2026

Frage: Wie bringen wir den Claybound- und Wallace-&-Gromit-Look in KFB, performant und prozedural, zu einem immersiven, psychedelischen Cartoon? Gilliam-Collage und 2.5D sind Zusatzebenen.
Status: Recherche, keine Entscheidung, kein Brief. Vor jedem Bau gilt V-740: erst Stilbilder.

## 0 · Bestand zuerst

- **Vorhanden:** kfb-clay v1.1, prozedurales Knet-Relief mit drei Profilen (CLAY_SSOT_R1). Knete in Texturen gebacken für FB, wieder flüssig (V-899, V-902). Claybound ist der Bild-Benchmark seit 26.09. (CANON_3D/sources/KLAYBOUND_…). Drei Ebenen nach V-1171. Mesa „ruhig psychedelisch“ (V-402). Gilliam-Pappen ohne Kante (V-1089). Pop-up-Dioramen (V-1085, V-1087). HyperNorm-Collage mit Gilliam- und 60er/70er-Psychedelik-Ebene (V-1273, V-1274).
- **Geparkt:** Knetkorn auf dem Gelände nach R4 FAIL (V-1451): die Dellen waren nur dunkle Flecken, ohne Lichtkante.
- **Gescheitert:** Gilliam-Stilbilder R1, AI-Slop (V-1268). Lehre: Gilliam ist eine Arbeitsweise, keine Textur.

## 1 · Was die Quellen belegen

| # | Befund | Quelle | Zugriff |
|---|---|---|---|
| F1 | Bei Aardman (Vengeance Most Fowl) wird möglichst alles praktisch gedreht. VFX „never there to replace puppets, but to support them“. Digitales Wasser und Feuer werden absichtlich unperfekt gehalten: „too perfect, and the VFX would betray the aesthetic“, „restraint was key“. Schärfeverlagerungen an Miniatursets entstehen in der Kamera. | fxguide, 09.04.2025, VFX Supervisor Howard Jones | gelesen |
| F2 | Harold Halibut: Sets und Puppen sind handgebaut und fotogrammetrisch gescannt. Gescannt wird bei möglichst flachem Licht, Lichtreste werden entfernt, das Spiel beleuchtet neu. Motion Capture wird absichtlich verschlechtert, mit weniger Bildern pro Sekunde und steiferen Gelenken. | Creative Bloq, 3DMag, Unity-Fallstudie (Suchauszüge) | nur Auszüge |
| F3 | Hylics 2 mischt Stop-Motion, 3D-gescannte Knetmodelle und Pixel Art. Die Texturen bestehen aus Halbtonrastern und posterisierten Fotos, der Look wirkt „like it's run through a Risograph“. Gegner ziehen „'shroom-like after images“ hinter sich her. | Retroware, 13.10.2020 | gelesen |
| F4 | In Engines entsteht Stop-Motion durch gedrosselte Animation ohne Zwischenbilder. Ein Unreal-Paket nutzt standardmäßig 8 Bilder pro Sekunde und hat eine Rauschoption für unregelmäßiges Ruckeln. Bekannte Falle: Partikel laufen in voller Rate weiter und landen neben der ruckelnden Figur. | Fab „Stepped Animation Primer“, realtimevfx.com | nur Auszüge |
| F5 | HD-2D setzt 2D-Figuren in 3D-Welten, die vom selben Licht beleuchtet werden. Tilt-Shift, Tiefenunschärfe und Bloom lassen die Welt wie ein Diorama wirken. | Wikipedia HD-2D, Unreal-Spotlight Octopath | nur Auszüge |
| F6 | Gilliam: „Whatever works is the thing to use.“ Laut Open Culture ist anmutige Disney-Bewegung mit Ausschnitten kaum machbar, plötzliche Bewegung dagegen einfach. Der Unterkiefer ist ein eigenes Teil, damit die Figur sprechen kann. Er arbeitet mit alten Fotos und Illustrationen, „Max Ernst meets Mad Magazine“. | Open Culture 06.11.2020 (Do It Yourself Film Animation Show, 1974), Pixartprinting | gelesen bzw. Auszüge |
| F7 | Psychedelische Vorbilder, die mit Knete und Ausschnitten arbeiten: Bickfords „Tree“ (1969) war sein erstes freies Morphing. Bei Švankmajer (Dimensions of Dialogue, 1983) verschmelzen Knetköpfe und tauschen Dinge aus. Fantastic Planet nutzt Papierausschnitte ohne Gelenke mit Kreuzschraffur nach Topor. | Bickford-Nachlass (Filmografie), Wikipedia, TCM | nur Auszüge |
| F8 | Plucky Squire: Die 2D-Grafik wird auf das 3D-Mesh des Buchs projiziert, deshalb spiegeln sich beide Welten nahtlos. | GamesHub-Vorschau. Das Unreal-Interview war gesperrt (403). | nur Auszug |
| F9 | Domain Warping verzerrt eine Funktion mit einer anderen, f(g(p)). Eine Cosinus-Palette a + b·cos(2π(c·t+d)) ist auf der GPU billig, und eine Phasenverschiebung erzeugt Farbzyklen. | iquilezles.org/articles/warp und /palettes | nur Auszüge |

**Nicht belegt:** Wie Claybound gebaut ist, wer es entwickelt und welche Engine es nutzt. Die Seite nennt nur WebGL und eine Steam-Seite. Ob W&G auf Einern oder Zweiern animiert wird, steht in keiner gelesenen Quelle. Gilliams Buch „Animations of Mortality“ war nicht einsehbar, ebenso Airbrush-Himmel und Geräusch-Timing.

## 2 · Verbindungen (konzeptuell, keine Kausalität)

- W1 Aardman „restraint“ ~ V-566 „eine Szene liest sich als ein handgemachtes Objekt“: dieselbe Frage, wann Perfektion den Look verrät.
- W2 Harold Halibut „flach scannen, neu beleuchten“ ~ V-385 „ein Licht-Rig“: jedes Asset schluckt das Szenenlicht, keines bringt eigenes mit.
- W3 Bickford-Morphing ~ V-403 Sprenkel-Übergänge: dieselbe bleibende Form, Stoff fließt in Stoff, kein Schnitt.
- W4 Hylics-Druckraster ~ HyperNorm-Ebenen (V-1274): Psychedelik entsteht hier aus Druck- und Fotofehlern, nicht aus Neonfarbe.
- W5 Plucky-Squire-Projektion ~ Karte als Comic-Panel (Card = panel): das Panel wird zur Bühne, aus der eine Figur heraustritt.
- W6 Gilliams plötzliche Bewegung ~ Avery-Mimik „extreme takes“ (Mimik-Regel 14.11.): beide leben von Pose zu Pose statt vom Zwischenbild.

## 3 · Optionen für KFB, geordnet nach Hebel

**1 · Stop-Motion-Zeit statt mehr Textur (Vorder- und Mittelgrund).** *Billig.*
- Figuren und Fundsachen spielen ihre vorhandenen Clips auf Zweiern ab, mit leichtem Zufall im Takt. Kamera, Physik und Fahren bleiben flüssig.
- Das Knet-Relief bekommt einen „Boil“: Der Seed von kfb-clay springt alle zwei bis drei Bilder. Die Daumendellen zittern dann wie bei echter Knete, ohne neue Geometrie.
- Effekte, die an einer Figur hängen, ruckeln im selben Takt mit (F4).
- Das ist ein Wiedergabeschalter, kein neuer Clip, also im Rahmen der Regel „vorhandene Clips nutzen“.
- Wichtigster Einzelhebel: Bei Aardman, Harold Halibut und Hylics macht die Zeit den Stop-Motion-Eindruck, nicht die Oberfläche (F2, F3, F4).

**2 · Knete mit Lichtkante, gebacken (W&G-Haptik).** *Mittel, zahlt sich bei Leistung aus.*
- Das R4-Problem war fehlende Lichtkante (V-1451). Die Aardman-Lehre lautet: Licht auf Form, zurückhaltend (F1).
- Deshalb kfb-clay v1.1 je Kit-Asset in Normalen backen, wie bei FB (V-902). Das ist eine Quelle für alle Assets, und der Laufzeit-Shader entfällt.
- Für das Gelände Knetkorn erst wieder aufnehmen, wenn eine gebackene Stichprobe die Lichtkante zeigt.

**3 · Psychedelik über Farbe und Fluss, nicht über Rauschen (Mesa-Ton).** *Billig im Shader.*
- Domain Warping mit Cosinus-Palette (F9) nur dort, wo Bewegung Sinn trägt: Himmelskuppel, Wasser, Emanata, Mindscapes und Übergänge.
- Morph-Übergänge nach Bickford und Švankmajer laufen über das bestehende Sprenkel-Modul (W3).
- Druckraster nach Hylics (Halbton, Posterisierung) nur in HyperNorm und Mindscapes, nie in der normalen Welt (passt zu V-772 Punkt 4).

**4 · Gilliam als Ereignisebene (Add-on).** *Mittel; Konzept zuerst.*
- Keine Dekoschnipsel (Lehre aus V-1268). Ausschnittfiguren erscheinen als Pop-up-Ereignis: ganze Figur, Gelenke als Scharniere, eigener Unterkiefer, plötzliche Bewegung (F6).
- Das Geräusch trägt das Timing. Danach klappt die Figur wieder ein (V-1085, V-1087, ohne Kante V-1089).
- Bauen nur nach einem Gag-Storyboard an echten Karten, wie bei V-1273.

**5 · 2.5D: Karte wird Bühne (Add-on).** *Mittel.*
- Das Kartenbild als Panel im Raum, eine Figur tritt heraus, nach dem Projektionsprinzip von Plucky Squire (F8, W5).
- Gemalte 2D-Teile hängen am selben Licht-Rig wie bei HD-2D (F5, V-385) und nur dort, wo es einen Grund gibt (V-1103).
- Diorama-Unschärfe (Tilt-Shift) nur in Karten-, Foto- und Bühnenansicht, nie in der Fahrkamera.

## 4 · Was wir lassen

- Eine Knet-Textur oder ein Rauschen über alles legen: der R4-Fehler, nur dunkle Flecken.
- Die ganze Szene mit wenig Bildern pro Sekunde laufen lassen: Die Kamera würde ruckeln, und das macht beim Fahren übel.
- Effekte in voller Rate an Figuren hängen, die auf Zweiern laufen (F4).
- Gilliam- oder Planeten-Schnipsel als Unruhe ohne Gag (V-1268).
- Eigene Licht-Tricks für 2D-Teile (V-385).
- Claybook-artige Knet-Physik auf der GPU als Spielmechanik: für den Browser zu schwer, kein Benchmark verlangt sie.

## 5 · Nächster Schritt (nach V-740)

Ein Stilbild-Paket, kein Brief:
- Moodboard aus den Quellen oben;
- vier Stilbilder: Zweier mit Boil, Lichtkante gebacken, Psychedelik-Himmel, Karte wird Bühne;
- zu den Zweiern ein kurzes Video, weil Bewegung nur im Video beurteilt werden kann (q711).

Georg wählt, welche Option zuerst ins Stilbild geht.

## 6 · Gelesen und gelistet

- **Gelesen:** fxguide (W&G), Retroware (Hylics 2), Open Culture (Gilliam 1974), Make (Gilliam, nur Intro), die Claybound-Seite (nur Text).
- **Gesperrt (403):** British Cinematographer (Riddett, W&G-Licht), Unreal „Max & the Midknights“, Unreal „Plucky Squire“.
- **Nur Suchauszüge:** alle anderen Quellen in der Tabelle.
- **Nicht erreicht:** „Animations of Mortality“, ein technischer Bericht über Claybound.
