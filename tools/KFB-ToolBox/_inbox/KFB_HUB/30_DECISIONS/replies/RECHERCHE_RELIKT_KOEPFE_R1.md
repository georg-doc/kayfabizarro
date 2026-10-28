# RECHERCHE: Relikt-Köpfe & versunkene Kolosse – Quellen + Platzierungsregeln (R1)

Stand: 28.10.2026 · Zweck: prozedurale Relikt-Landmarks (Köpfe, Büsten, umgestürzte Statuen halb im Terrain) für KFB (three.js, Clay-Look, Terrain-Farbbänder per Shader → **nur Geometrie zählt**). Nichts heruntergeladen. Polygonzahlen = Sketchfab-API `faceCount` bzw. Angabe der Quelle.

---

## 1. Kurzfazit

- **Beste Kombination:** (a) Sketchfab-Museumskonten mit CC0 (Cleveland Museum of Art, Minneapolis Institute of Art, Musée Saint-Raymond) für den Grundstock, (b) **SMK Open API** (373 Objekte mit STL, u. a. Sphinx-Kopf, Gigantenkopf, viele antike Köpfe), (c) gezielte CC-BY-Scans auf Sketchfab für die Motive, die es in CC0 nicht gibt (Olmeken-Kopf, Moai, Ramesseum-Kopf, Konstantin).
- **Ozymandias wörtlich verfügbar:** der liegende Ramses-II.-Koloss von Mit Rahina (CC0), der Ramesseum-Kolossalkopf und die „Younger Memnon“-Büste (das Objekt, das Shelleys Gedicht zugeschrieben wird) – alle drei als Scan.
- **Stylized-Kits mit echten Statuenköpfen gibt es kaum.** Quaternius/Kenney/KayKit haben keine Statuenköpfe; Poly Haven hat eine Büste. Am nächsten am Look: polyfork-Rapa-Nui-Kit (Low-Poly-Moai „aus Sediment ragend“, 728 Tris) und einzelne Low-Poly-Moai auf Sketchfab.
- **Decimation ist bei allen Scans realistisch:** Köpfe haben große, ruhige Formen; auf 3–8k Dreiecke reduziert bleibt die Silhouette lesbar, und der Clay-Look verlangt ohnehin geglättete Oberflächen. Offene Unterseiten von Scans sind egal, weil sie im Boden stecken.

---

## 2. Quellen-Tabelle

| Quelle | Was da ist (relevant) | Lizenz | Formate / Polys | Low-Poly realistisch? | Fit Clay/Cartoon |
|---|---|---|---|---|---|
| **Sketchfab – Cleveland Museum of Art** (`clevelandart`) | Colossal Head of a Deva (Khmer), Head of Amenhotep III, Statue of Gudea, Head of Apollo, Vespasian, Alexander | CC0 (einzelne Objekte CC BY) | Download: Original + glTF/GLB/USDZ (Sketchfab-Konvertierung, Login nötig); 17k–620k Faces | Ja, sehr gut | **Hoch** – ruhige, monumentale Formen |
| **Sketchfab – Minneapolis Institute of Art** (`artsmia`) | Khmer-Buddha-Köpfe, Avalokiteshvara, Deva, Vishnu, Sekhmet, Thoth, Assyrian Winged Genius | CC0 (wenige CC BY-SA) | glTF/GLB; meist **~64k Faces** (bereits optimiert) | Ja, am einfachsten | **Hoch** – Buddha-Köpfe = ideale Relikt-Silhouette |
| **Sketchfab – Musée Saint-Raymond** (`museesaintraymond`) | Tête de Maximien Hercule („quasi colossale“), Büsten Augustus, Trajan, Septimius Severus, Marc Aurel, Satyrkopf | CC0 (Tête de Bacchus CC BY) | glTF/GLB; 50k–350k | Ja | Mittel-hoch – römische Porträts, Locken/Bart detailreich |
| **SMK – Statens Museum for Kunst** (open.smk.dk / `api.smk.dk`, Filter `has_3d_file:true`) | 373 Objekte mit STL (Gipsabgüsse): Hoved og forkrop af sfinx (Amenemhet, KAS38), Hoved af gigant (KAS19/10), Head of David (KAS2232), Hera-Barberini-Kopf, Athena-Hope-Kopf, Rampin-Kopf; auf Sketchfab 9 Ganzfiguren (Apollo Belvedere, Zeus/Poseidon vom Artemision, Memnon of Ethiopia) | Public Domain Mark 1.0 (Sketchfab: CC0) | STL; je Objekt **voll** (z. B. 486 MB) + **„small“** (~20 MB ≈ 400k Tris) | Ja (von „small“ ausgehen) | **Hoch** – Gips = keine Textur nötig, saubere Oberflächen |
| **Sketchfab – danielpett** (Privatscans, viele British-Museum-/Kairo-Objekte) | Colossal Sculpture of Ramesses II (Mit Rahina, liegend), Buddha, Terme Boxer (CC0); Lamassu, Head of Hadrian, Sphinx of Hatshepsut, Female head Halikarnassos (CC BY) | gemischt: CC0 / CC BY / CC BY-NC | glTF; 60k–1,2 Mio | Ja | **Hoch** – liegender Ramses ist der Kern-Use-Case |
| **Sketchfab – Einzelscans CC BY** (diverse Nutzer) | Olmeken-Köpfe (San Lorenzo 6; Xalapa-Serie), Moai (MNHN Chile, Louvre-Kopf, „Broken Moai“, Quarry Moai), Ramesseum-Kolossalkopf, Younger Memnon, Head of Constantine, Foot of the Colossus of Constantine, Juno-Kolossalkopf | CC BY | glTF; 25k–6 Mio | Ja | **Hoch** für Motivlücken |
| **Sketchfab – British Museum** (`britishmuseum`, 263 Modelle) | Amenemhat III, Vespasian, Ptolemäer, Julius Caesar, Kouros-Kopf | CC BY-NC-SA | glTF; 40k–1,4 Mio | Ja | – (Lizenzspalte) |
| **Smithsonian 3D / Open Access** (3d.si.edu, `3d-api.si.edu`) | Präsidentenbüsten/Lifemasks (Lincoln, Washington, Garfield), Greek Slave, Kneeling winged monster, Gathering of Buddhas; Datensatz „Cast of San Lorenzo Head No. 1“ (Olmeke) ohne gefundenen 3D-Download | CC0 (pro Objekt markiert) | GLB low-res + ZIP full-res (OBJ/PLY), USDZ | Ja | Niedrig – kaum antike Kolosse |
| **Scan the World** (MyMiniFactory, >18.000 Objekte; Spiegel auf Wikimedia Commons) | sehr breit: British Museum „Head of a Colossal Statue of a Woman“, „Face of a Colossal Figure“ (Sphinx), Antoninus Pius colossal (MSR), Juno Ludovisi, Belvedere-Torso | pro Objekt verschieden (Beispiele: CC BY-SA 4.0, CC BY, CC BY-NC-SA) | STL/OBJ, oft 1–40 MB | Ja | Mittel – Druckmodelle, oft wasserdicht, gut zum Remeshen |
| **Three D Scans** (threedscans.com, Oliver Laric) | ~134 Meshes (HF-Spiegel): Louvre, Albertina, Florenz etc., Büsten, Hermen, Köpfe | keine Lizenzangabe auf der Seite („without copyright restrictions“ laut Projekt) | STL/OBJ, roh, teils non-manifold, sehr dicht | Ja, aber Aufräumen nötig | Mittel |
| **Poly Haven** | Marble Bust 01 (Renaissance-Mann), Gothic Statue, Lion/Bull/Horse Head | CC0 | glTF/FBX/Blend/USD; 12k–47k | Ja | Mittel – nur 1 Menschenbüste |
| **ambientCG** | keine Modelle (nur Materialien) | CC0 | – | – | – |
| **Quaternius** – Ultimate Modular Ruins Pack | 90 Modelle: modulare Ruinen/Dungeon + Props, **keine Statuenköpfe** | CC0 | FBX/OBJ/Blend, low-poly | – (schon low) | Mittel – Mauerreste/Säulen als Beiwerk |
| **Kenney / KayKit** | keine Statuen-/Kopf-Assets gefunden | CC0 | – | – | – (Felsen/Natur-Kits als Beiwerk) |
| **polyfork.dev** – Easter-Island-/Rapa-Nui-Kit | 44 Teile, u. a. „Rano Raraku Quarry Head“ (Moai-Kopf+Schultern aus Sediment mit Gras-Kragen) | „Royalty Free“ (kommerziell erlaubt, keine Attribution, kein Weiterverkauf) | GLB/FBX/OBJ/USDZ + .mjs; **728 Tris**, flat-shaded | bereits low | **Hoch (Look)** – zeigt genau das Diorama-Prinzip; code-generiert |
| **3dassets.dev** (KI-generierte Kits) | Medusa Bust (2,5k Tris), Sphinx/Griffin/Chimera Statue (1–3k), Angel Statue (420) | CC0 | GLB, texturlos | bereits low | Mittel – stilisiert, aber KI-generiert, Qualität schwankt |
| **Sketchfab – Low-Poly/Stylized (CC BY)** | Stylized Moai (duz_vr, 12,7k), Moai Stylized Hard Surface (pavel.cl0103, 2,7k), Moai Low Poly (BONOMISTUDIO, 3k), Low poly bust statue (433) | CC BY | glTF | bereits low | Mittel-hoch – fast nur Moai |
| **Fab – VertexLab4D** Greek Statue Heads Pack | 13 griechische Köpfe, low-poly | nicht geprüft (Marktplatz) | FBX/UE | bereits low | Mittel |
| **The Met** | keine 3D-Modelle auf Sketchfab (Konto mit 0 Modellen), kein 3D-Open-Access gefunden | – | – | – | – |

---

## 3. Top-10-Kandidaten

| # | Modell | Motiv / warum | Quelle & Link | Lizenz | Faces |
|---|---|---|---|---|---|
| 1 | **Colossal Sculpture of Ramesses II** (Mit Rahina/Memphis, ~10 m, liegt auf dem Rücken) | Der liegende Koloss schlechthin – Ozymandias-Bild 1:1 | danielpett · https://sketchfab.com/3d-models/colossal-sculpture-of-ramesses-ii-4fdb2b2cb9e14f12ac7c11f385ce0104 | CC0 | 500k |
| 2 | **Colossal Bust Ramesses II** („Younger Memnon“, British Museum) | Kopf+Schulter, Nemes-Tuch = starke Silhouette; Shelley-Bezug | nebulousflynn · https://sketchfab.com/3d-models/colossal-bust-ramesses-ii-livestream-tutorial-62ffe231f1664b84ae8c263a77b83e15 | CC BY | **25k** |
| 3 | **A head of colossal Statue at the Ramesseum** | Gestürzter Kolossalkopf am Original-Ozymandias-Ort | yam11 · https://sketchfab.com/3d-models/a-head-of-colossal-statue-at-the-ramesseum-028e859fd18d42608e5856d1343ab043 | CC BY | 435k |
| 4 | **Hoved og forkrop af sfinx med Amenemhets ansigtstræk** (KAS38) | Sphinx-Kopf mit Vorderkörper – perfekt halb versunken | SMK · https://open.smk.dk/artwork/image/KAS38 | Public Domain Mark | STL small 20 MB |
| 5 | **2011.147 Colossal Head of a Deva** (Khmer, um 1200) | Kolossalkopf mit Krone, Angkor-Thema | Cleveland Museum of Art · https://sketchfab.com/3d-models/2011147-colossal-head-of-a-deva-2413aa3cdb504a368b58b47e5fbefe08 | CC0 | 150k |
| 6 | **Head of the Buddha, 12th–13th C** (Khmer, Jayavarman VII.) | Klassisches „Buddha-Kopf im Baum/Sand“-Bild | Minneapolis Institute of Art · https://sketchfab.com/3d-models/head-of-the-buddha-12th-13th-c-ce-d1963b3475e24071b338b1ca782f4d82 | CC0 | **64k** |
| 7 | **Olmec Head** (San Lorenzo Colossal Head 6, 1,67 m) | Olmeken-Kolossalkopf, Helm-Silhouette, sehr clay-tauglich | michael_carroll · https://sketchfab.com/3d-models/olmec-head-a9ec7d1b19374447869b97a3362e4ee1 | CC BY | 819k |
| 8 | **Moai** (MNHN Chile, 1870 nach Santiago gebracht) | Echter Museums-Moai; Alternative liegend: „Broken Moai“ (Kopf abgetrennt, auf dem Rücken) https://sketchfab.com/3d-models/broken-moai-from-easter-island-0d4efc6ca62a4c62909ec9b735db40c3 | MNHNcl · https://sketchfab.com/3d-models/moai-7099390468214c2dbcf283454e7b5c8a | CC BY (beide) | 171k / 160k |
| 9 | **Head of Constantine** + **Foot of the Colossus of Constantine** | Fragment-Set eines Kolosses (Kopf + Fuß als Trümmerfeld-Bausteine) | jrh91 · https://sketchfab.com/3d-models/head-of-constantine-891ee0708ce945eabaffeacd5c901a04 · Marleyc · https://sketchfab.com/3d-models/foot-of-the-colossus-of-constantine-e541550a2bcf408593687ac89aa2025b | CC BY | 159k / 474k |
| 10 | **Tête de Maximien Hercule** (Chiragan, „quasi colossale“) | Bärtiger Römer – griechisch-römische Variante | Musée Saint-Raymond · https://sketchfab.com/3d-models/tete-de-maximien-hercule-fcc8b76187144603925295d06e41744e | CC0 | 152k |

**Ergänzungen (Reserve pro Kultur):**
- Mesopotamien: Lamassu (British Museum) Optimised, 100k – https://sketchfab.com/3d-models/lamassu-british-museum-optimised-cc-by-40-d3672ddd0d904e8eac1ed7468a37e212 (CC BY) · Statue of Gudea, 67k – https://sketchfab.com/3d-models/1963154-statue-of-gudea-d7493b2c823f43bfa1cfc778f68d3ba4 (CC0)
- Griechisch: Hoved af gigant (Pergamon-Typ) – https://open.smk.dk/artwork/image/KAS19/10 (PDM) · Fragmentary colossal marble head of youth – https://sketchfab.com/3d-models/fragmentary-colossal-marble-head-of-youth-acc071ea2c3b4938b9460510037a50eb (CC BY)
- Römisch: Photogrammetry Female colossal head Juno – https://sketchfab.com/3d-models/photogrammetry-female-colossal-head-junon-1be27eeae21d43a1a6ee0b4bbcc73a15 (CC BY)
- Ägypten: Head of Amenhotep III – https://sketchfab.com/3d-models/1952513-head-of-amenhotep-iii-ff3dd192a81944a0a93a54beb8a7a27f (CC0)
- Mittelalter: Kilconnell Carved Head, 15. Jh. – https://sketchfab.com/3d-models/kilconnell-carved-head-15th-c-madonna-eb3f5d005e6b4b74823127abeac01840 (CC0)
- Renaissance: Poly Haven Marble Bust 01, 17k – https://polyhaven.com/a/marble_bust_01 (CC0)
- Stylized-Referenz: polyfork Rano Raraku Quarry Head, 728 Tris – https://polyfork.dev/asset/rano-raraku-quarry-head-2a6eea
- Hinweis: „Toppled Colossal Statue Fragment“ (Pigcraft, 1,9 Mio, CC BY) passt motivisch exakt (Kopf + Unterarm liegend), wirkt aber nach Beschreibung KI-generiert – nur als Referenz.

---

## 4. Empfehlung: die 2–3 besten Quellen

1. **Sketchfab-Museumskonten mit CC0 (Cleveland, Minneapolis, Saint-Raymond) + danielpett.** Größte Menge echter Kolossalköpfe in moderater Dichte (64k–150k), glTF direkt, per API nach Lizenz filterbar (`license=cc0`). Deckt Ägypten, Khmer/Buddha, Rom, Mesopotamien ab.
2. **SMK Open (api.smk.dk).** 373 STL-Gipsabgüsse, jeweils mit „small“-Variante; texturfreie Gipsoberflächen passen direkt zum Clay-Shading. Stark für Griechenland/Rom + Sphinx.
3. **Sketchfab CC BY für Motivlücken:** Olmeken (Nr. 7), Moai (Nr. 8), Ramesseum/Younger Memnon (Nr. 2–3), Konstantin-Fragmente (Nr. 9).

**Pipeline-Vorschlag (geometry only):** Voxel-Remesh (schließt Löcher, gleichmäßige Topologie) → Decimate/meshoptimizer auf 3–8k Tris (Hero-Landmark) bzw. 1–2k (Fernsicht) → Laplacian-Smooth gegen Scan-Rauschen (Clay-Look) → GLB. Kleinteile unter „Fingerbreite“ im Spielmaßstab (Locken, Inschriften) gehen dabei bewusst verloren; Nase, Ohren, Krone, Nemes-Tuch, Bruchkanten bleiben. Für Stylized-Charakter optional: Proportionen leicht überzeichnen (Kinn/Nase/Krone +10–20 %) statt Detail zu behalten.

---

## 5. Platzierungs- und Kompositionsregeln für versunkene Kolosse

Formuliert als Generator-Regeln. Zahlen sind Startwerte für den Generator, keine Vorgaben für Georg.

### R1 – Eingrabtiefe nach Lage
- **Aufrechter Kopf/Büste (Moai-Typ):** Boden bis Kinn oder Schulter; sichtbar 40–70 % der Kopfhöhe. Vorbild Rano Raraku: rund 150 aufrechte Moai stecken unterschiedlich tief im Sediment, oft schaut nur der Kopf heraus; die Körper liegen darunter (EISP).
- **Liegender Kopf (auf Wange oder Hinterkopf):** 25–40 % des Kopfdurchmessers unter Terrain – genug, dass er „schwer“ wirkt, wenig genug, dass Gesicht und Bruchfläche lesbar bleiben.
- **Liegende Ganzfigur/Torso:** 30–50 % der Dicke eingesunken; tiefere Partien zur Hangseite hin.
- Nie exakt auf Terrainhöhe aufsetzen; der Mesh-Schnitt mit dem Terrain muss immer eine geschlossene, unregelmäßige Kontaktlinie ergeben.

### R2 – Neigung und Ausrichtung
- Keine achsparallelen Lagen: aufrecht 5–20° Schiefstand (in Hangrichtung), liegend 70–110° Roll (Kopf auf der Wange) plus 10–30° Pitch.
- Gesicht/Nase als Lesepunkt zur Hauptanflugrichtung oder Strecke drehen; Bruchfläche zur Seite, nicht zur Kamera.
- Moai-Sonderfall: umgestürzte Moai liegen überwiegend mit dem Gesicht nach unten, viele mit abgebrochenem Kopf – für Moai „Gesicht unten, Kopf separat“ als häufige Variante.
- Schwerpunkt unten: die massigste Seite (Hinterkopf, Krone, Schulter) liegt tiefer im Boden.

### R3 – Was sichtbar bleibt: Bruchstellen
- Statuen brechen typischerweise am **Hals** (natürliche Schwachstelle; bei Hatshepsuts Statuen zusätzlich gezielt an Hals, Taille und Knien). Daher: Kopf und Körper als getrennte Teile, Bruchfläche zackig (keine glatten Schnitte).
- **Nase und abstehende Teile** (Ohren, Uräus, Kronenzacken, Bart) fehlen häufig oder sind abgeschlagen – Generator entfernt 0–2 solcher Features und legt sie als Fragment in den Trümmerfächer.
- Sichtbar halten: Gesichtsebene + markante Silhouette (Krone, Nemes, Helm); vergraben: Hinterkopf/Unterseite (verdeckt zugleich offene Scan-Unterseiten).

### R4 – Trümmerfächer und Übergangszone
- **Trümmerfächer** in Fallrichtung: Kegel 30–60°, 3–7 Fragmente im Abstand 0,5–2 × Kopfgröße, Größe nimmt mit Distanz ab; Fragmente selbst 20–50 % eingesunken. Ein großes Stück (Fuß, Hand, Schulter) als Zweitanker in 2–4 × Kopfgröße (Konstantin-Prinzip).
- **Übergangsring** am Kontakt: kleinere Steine/Brocken an der Kante (wenige, nicht gleichmäßig), dann Gras/Büsche in den Mulden und auf der Leeseite; harte Linie zwischen Modell und Boden immer mit Kleinteilen brechen (Polycount-Praxis; CRYENGINE „Terrain Layer Blending“ als Shader-Pendant).
- Gras wächst auf flachen Oberseiten liegender Teile (Moos-/Grasbüschel in Augenhöhlen, Ohrmulden), nie auf steilen Gesichtsflächen.

### R5 – Wind, Sand und Erosion (Korrektur zur Brief-Annahme)
- **Luvseite (windzugewandt):** Am Fuß des Hindernisses bildet ein Hufeisenwirbel eine **Auskolkung/Mulde** (Scour); Sand lagert sich *vor* dem Hindernis erst mit Abstand als „Echo-Düne“ ab – zwischen Düne und Objekt bleibt ein Graben.
- **Leeseite (windabgewandt):** Hier sammelt sich der meiste Sand als **Sandschatten/Leedüne** – ein spitz auslaufender Schweif in Windrichtung, Breite ≈ Objektbreite, Länge mehrere Objektbreiten.
- **Erosion:** Sandschliff wirkt am stärksten in den untersten Dezimetern bis ca. 2 m über Grund (Saltationszone). Folge: Unterschneidung knapp über der Bodenlinie, Kanten unten stärker gerundet als oben; exponierte Spitzen (Nase, Kinn, Kronenrand) abgerundet; Oberseiten glatt poliert.
- Für den Generator: eine globale Windrichtung pro Biom → Luv-Mulde + Echo-Düne, Lee-Schweif, Abrundungsstärke als Funktion der Höhe über Grund. In Gras-Biomen dieselbe Logik mit Erde/Gras statt Sand (Leeseite = dichterer Bewuchs).

---

## 6. Quellen (Regeln & Hintergrund)

- EISP – Easter Island Statue Project (Rano Raraku, eingegrabene Moai): https://www.eisp.org/4230/ · https://legacy.geog.ucsb.edu/easter-island-heads-have-great-bodies/
- Moai mit Gesicht nach unten gestürzt: https://www.responsibletravel.com/holidays/easter-island/travel-guide/moai · https://dipsy.pbs.org/wgbh/nova/easter/dispatches/19980426.html
- Hals als Bruchstelle / kopflose Statuen: https://livescience.com/archaeology/romans/why-are-so-many-roman-statues-headless
- Hatshepsut-Statuen, gezielte Brüche an Hals/Taille/Knien: https://the-past.com/news/hatshepsuts-statues/
- Younger Memnon / Ozymandias: https://en.wikipedia.org/wiki/Younger_Memnon · https://livescience.com/archaeology/ancient-egyptians/the-3-300-year-old-ancient-egyptian-statue-of-ramesses-ii-said-to-have-inspired-percy-shelleys-ozymandias
- Hindernis-Düne, Hufeisenwirbel-Scour, Echo-/Leedüne: https://arxiv.org/pdf/2506.12630 · https://arxiv.org/pdf/2411.12066 · https://cris.bgu.ac.il/en/publications/wind-tunnel-modeling-of-echo-and-climbing-dunes-3/ · https://digfir-published.macmillanusa.com/understandingearth7e/asset/img_ch19/c19_fig10.html
- Sandschatten hinter Felsblöcken (Mars/HiRISE): https://cosmicdiary.org/lfenton/category/hirise_images/page/10/
- Sandschliff in Bodennähe / Pilzfelsen: https://geo.libretexts.org/Bookshelves/Geology/Geology_of_California/13%3A_Mojave_and_Colorado_Deserts/13.04%3A_Wind_Driven_Sediment_Transport · https://www.savemyexams.co.uk/a-level/geography/aqa/18/revision-notes/2-hot-desert-systems-and-landscapes/2-3-arid-landscape-development/
- Asset-Terrain-Übergänge (Environment-Art-Praxis): https://polycount.com/discussion/223808/src · https://www.cryengine.com/docs/static/engines/cryengine-5/categories/23756816/pages/36340007
- Quellen-Seiten: Sketchfab Public-Domain-Programm https://sketchfab.com/blogs/community/sketchfab-launches-public-domain-dedication-for-3d-cultural-heritage · SMK 3D https://blog.smk.dk/ghost-in-the-scan-3d-scans-of-casts-in-the-smks-collections · Scan the World FAQ https://www.myminifactory.com/scantheworld/faq/ · Three D Scans (HF-Spiegel mit Metadaten) https://huggingface.co/datasets/alecjacobson/threedscans · Smithsonian 3D https://3d.si.edu · Quaternius Ruins https://quaternius.com/packs/ultimatemodularruins.html · Poly Haven https://polyhaven.com/a/marble_bust_01
