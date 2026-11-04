# Knetkorn auf dem Gelände · Modell R1 (WS-Himmel, 04.11.)

## Stufe 0
1. Knetkorn ist eine Antwort der Oberfläche auf das eine Licht: Daumendellen, flache Buckel und gedrückte Facetten kippen die Normale. Es ist keine Farbe, keine Geometrie und keine Textur.
2. Es kommt aus dem einen Knet-Material, das Figuren und Props schon tragen (kfb-clay v1.1, Profil „background“). Das Gelände bekommt dieselbe Rechnung, kein zweites Korn.
3. Das Korn verschwindet nach Bildanteil: Ist ein Merkmal kleiner als ein fester Bruchteil der Bildhöhe, blendet es aus. Kein Flimmern, kein Moiré.
4. Farben, Bänder und Biome des Geländes bleiben unberührt (Zug zur Palette = 0). Das Korn hängt sich an die bestehende Kette an.

## Block

**Was das Phänomen ist.** In Georgs Bögen (GOLDEN_SAMPLES_2D_R1, Regeln 2, 5 und 8) liest sich Knete über drei Dinge:
- weiche Daumendellen, oval, in Nestern, wenige große und viele kleine;
- flache Buckel;
- eine helle Oberlippe und eine kühlere Unterseite an jeder Delle.
Es ist Licht auf Form, keine Musterfarbe. Das Gelände ist heute glatt, mit Farbbändern ohne Relief. Das ist der größte Bruch zwischen 2D und 3D.

**Bewährte Lösungen, geprüft:**
- **kfb-clay v1.1** (vendor/clay, die eine Knet-SSOT, V-429). Prozedurale Normalenstörung im Shader mit analytischem Gradienten, ohne Textur und ohne fwidth. Jede Ebene (Buckel, Dellen, Facetten) hat Ausblendbänder in Anteilen der Bildhöhe.
  - Das Profil „background“ ist für Gelände gedacht: ruhig, ohne Feinkorn.
  - Bewährt an den Props des Verteilers (Profil „midground“) und an den Figuren.
  - **Gewählt.**
- Detail-Normal-Map mit Mip-Stufen und Abstandsblende, wie Detail-Texturing in großen Engines. Das bringt eine zweite Quelle für dasselbe Korn, Texturkacheln und Wiederholung. Verworfen, weil kfb-clay dasselbe ohne Textur leistet und schon die eine Antwort ist.
- Gefiltertes prozedurales Rauschen mit Frequenzbegrenzung (Quilez). Steckt in den Bildanteil-Bändern von kfb-clay schon drin.

**Wie es angedockt wird:**
- Die Gelände-Kacheln liegen mit Weltkoordinaten in einem gemeinsamen Material (endlessTerrain baut die Positionen absolut, die Matrix bleibt fest). Dadurch ist der Objektraum gleich dem Weltraum, und das Korn läuft ohne Naht über die Kachelgrenzen.
- Bedingung: ein fester Maßstab (scaleRef als Zahl in Metern) und ein fester Seed für alle Kacheln.
- `applyClay` ersetzt das Material durch ein neues. Damit fiele die Kette des Geländes weg: terrain3-Bänder, Biome, Deck-Boden, Krater-Narben, Wolkenschatten, Bodenton. Deshalb ein kleiner Adapter (look/terrainClay.js):
  - Er nimmt die exportierten Shader-Teile `GLSL` aus kfb-clay und die Werte des Profils „background“.
  - Er hängt sie per onBeforeCompile an die bestehende Kette (prev aufrufen, Cache-Schlüssel erweitern).
  - Farbteil mit Zug 0, also nur Normale, Rauheit und leichte Fleckung.
- Die Uniforms des Profils baut kfb-clay intern (profileUniforms ist nicht exportiert). Ich bitte die Besitzer von kfb-clay, profileUniforms zu exportieren, statt sie nachzubauen. Bis dahin baut der Adapter sie aus CLAY_PROFILES gleich auf.
- **Node:** endlessTerrain muss in Node laden. Der Adapter und seine Shader-Teile liegen in einer eigenen Datei unter look/. Angehängt wird er in EndlessDrive an `mods.terrain.material`, nicht in endlessTerrain.
- **Schalter:** `knetkorn=1`. Ohne Schalter bleibt alles unverändert.

**Maßstab (Startwert, wird am Bild entschieden):** scaleRef etwa 2,5 m. Dann sind die Buckel etwa 1,1 m groß, die kleinen Dellen etwa 0,45 m, die großen etwa 1,1 m, die Facetten etwa 0,75 m. Das ist auf Fahrt- und Fußdistanz sichtbar, und nach Bildanteil verschwindet es in der Ferne.

**Risiken, vorab zu prüfen:**
1. Die Reihenfolge der Kette (normal_fragment_maps im Gelände-Shader vorhanden? Die Bänder setzen diffuseColor, das Korn nur die Normale).
2. Rechengenauigkeit bei großen Weltkoordinaten (Hash je Zelle, Bruchteile bei mehreren Kilometern).
3. Kosten: Das Gelände füllt den halben Bildschirm, eine Dellenebene wertet 27 Zellen aus. Messung mit Readback-Tor (V-GPU-Regel), vorher und nachher.

**Erster Beleg:**
- Vorher/nachher je eine Folie: Fahrkamera, dazu von vorn bzw. von der Seite am Boden in der Ebene und am Hang.
- Dazu ein kurzer Fahrclip auf Flimmern und Moiré.
- Ein Kritiker auf den Endstand.
