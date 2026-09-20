repo: georg-doc/kayfabizarro
branch: main
path: media/3D_Assets

## Last sync

date: 2026-09-17T13:10:00Z
commit: 10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0

### Updated in this project

- **S13.3 · neu: `lib/dungeon-light.js`** — Licht für den Dungeon-Generator, drei Stimmungen (Promo / Fackeln / Nacht) aus den drei KayKit-Promobildern gelesen: kein Dach, dunkelvioletter Radialhintergrund, helle lesbare Innenräume, Fackeln als Akzent, Kontaktschatten unter jedem Gegenstand.
- **`barrier` gefunden → fünfte Fugenklasse `rail`.** 37 Kandidatennamen für Brüstung/Geländer probiert, genau eines existiert: `barrier`, gemessen **4,00 × 1,10 × 0,50**. Eine Kante der oberen Ebene über einem Boden der unteren ist damit eine Balkonkante mit Brüstung statt vier Meter Wand (so auch im dritten Promobild). `rail` trägt ein Objekt und sperrt den Weg, bildet aber keinen Wandzug — das Pack hat keine Brüstungsecke und kein halbes Stück; ein Brüstungsarm zählt beim Eckteil nicht mit, und ein endender Brüstungsarm ist kein freies Wandende. Restlücke gemessen und als Auskunft im Balken: wo eine Wand an eine Brüstung stösst, stehen 2,90 Stirnfläche über ihr.
- **Die Fackel schwebte nicht — der Schatten fehlte.** Fugenmitte −2,00, Plattenfläche −1,50, Fackelrücken −1,48 (0,02 Luft); Sichtstrahl trifft Fackel bei 4,11 und Wand bei 4,79. Neu: Kontaktschatten als senkrechte Scheibe in der Wandfläche (Grösse aus der gerenderten Box), am Boden dieselbe Scheibe für alles, was in einer Zelle steht.
- **Licht gemessen statt gestimmt:** Flammenpunkt = Schwerpunkt der obersten 18 % der Fackelgeometrie (lokal y 0,55; die Boxmitte wäre der Griff) · Punktlichter als fester Pool (10, davon 3 mit Schattenwurf), der zu den nächsten Fackeln wandert — ein Licht je Fackel lässt three.js bei jeder Änderung der Lichtzahl alle Shader neu bauen · Schattenkamera aus der gemessenen Szenenbox (Radius 21,98 statt fester 40, die bei 16×16 die Hälfte abschnitt).
- **Neue Probe: Leseprobe — und sie war zuerst falsch.** Draufsicht mit den echten Materialien und dem echten Licht, Luminanz (Rec. 709) je Zellmitte; Gate ist nicht „alles hell", sondern: jeder Raum hat mindestens eine lesbare Zelle. Die erste Fassung renderte EIN Bild — darin leuchten nur die ≤10 Fackeln, die der feste Pool gerade trägt, also misst sie die Kamera und nicht den Dungeon (16×16 mit 25 Fackeln: zwei Drittel der Räume unbeleuchtet, Gate kippt beim Orbitieren). Jetzt geht der Pool in STAPELN reihum über alle Fackeln, je Zelle gilt das Maximum. Nachgemessen über mehrere Saaten und Feldgrössen: 8×8 A1 nachts 5/5, 8×8 TZCSA nachts 5/5 (min 0,098), 16×16 TZCSA nachts 9/9 in 3 Stapeln, 12×12 q 7/7 (min 0,173).
- **Zwei Achsen, zwei Schalter:** Ebenen- und Schrittfilter galten zuerst nur für Bauteile — Flammen, Kontaktschatten und Pool-Lichter blieben an ausgeblendeten Ebenen und in den Aufbauschritten stehen. Jede Flamme/Scheibe trägt jetzt ihr `level`, das Rig hat `setLevelFilter` und `setEnabled`, und nachgezogen wird sofort statt im nächsten Bild (dieser Rahmen drosselt rAF — dieselbe Lehre wie der rAF-Notnagel in `kit-lab.js`).
- **Zwei Artefakte wieder ausgebaut** (von Georg am Bild erkannt): orange Kugel als Flamme = AI-Slop, und die dunkle Scheibe als Wand-Kontaktschatten war sogar die Ursache für „Licht falsch ausgerichtet" — sie frisst den Lichthof des Punktlichts. Jetzt ist das Feuer die Flammengeometrie des Packs und der Schatten kommt aus der Schattenkarte der Punktlichter, die IM Bauteil sitzen (`normalBias` gegen Streifen). Nichts dazugemalt.
- **Lichtquellen sind Bauteile:** `torch_mounted` an der Wand + `candle` (0,33 × 0,87 × 0,33) auf dem Boden, gesetzt wo das RASTER kein Fackellicht sieht, in der Zellecke an zwei Wänden (Requisiten an die Ränder, Mitte frei). Abstand je Achse aus der gemessenen Aussenfläche der jeweiligen Wand — gegen die Nenndicke gerechnet steckte die Kerze bei `wall_pillar` (1,5 dick) 0,12 in der Wand. Wirkung 8×8 A1 nachts: 13 dunkle Zellen → 0, min-Luminanz 0,098 → 0,31.
- **Lichtquelle leuchtet sich nicht selbst an:** ein Punktlicht im Flammenpunkt sitzt innerhalb seines Bauteils — es blies die Flamme auf 255 aus und verschattete das Teil mit sich selbst. Gelöst per Ebenen-Maske (Leuchtkörper auf eigener Ebene, Punktlichter nicht; Hemisphäre/Key bekommen sie dazu) statt per `shadow.camera.near` — eine Mechanik statt zweier halber.
- **Aus Georgs Asset-Übergabe** (`kfb.asset-handoff.v1`, commit `10a7fdce`): das FREE-Pack hat „_lit"-Zwillinge — `candle_lit` (1,05 gegen `candle` 0,87), `candle_thin_lit`, `torch_lit`, dazu `candle_melted`, `candle_triple`, `shelf_small_candles`; HalloweenBits `skull_candle`/`shrine_candles`/`plaque_candles`, RPGTools `torch`/`torch_burnt`, GLB_graveyard `fire-basket` (Feuerkorb), FX-Sprites `fire_01/02` mit Alpha.
- **Flamme eigenleuchtend aus dem Netz gelöst:** Trennhöhe = Oberkante des stillen Zwillings, Material = dieselbe Atlas-Textur ohne Licht davor. Gemessenes Flammenpixel (239, 107, 49) statt reinweiss. Flammenfuss aus den INDIZIERTEN Dreiecken — `computeBoundingBox()` ignoriert den Index und hätte den Pivot an den Kerzenboden gelegt (Drift danach 0). Verworfen, beide gemessen: Mengendifferenz gegen den Zwilling (Netze nicht vertex-identisch) und Schwerpunkt-Schnitt (`torch_lit` hat sein Feuer IN der Schale) — `torch_lit` wird daher nicht gesetzt, mit Grund in der Prüfzeile.
- **Punktlichter werfen keine Schatten mehr** (`shadowed: 0`). Ein Punktlicht im Bauteil projiziert dessen Silhouette hyperbolisch auf den Boden — das waren die dunklen Fünfecke um die Kerzen. Die Promobilder zeigen genau ein schattenwerfendes Licht von oben; Fackeln/Kerzen sind Fill. Bodenprofil danach von der Kerze nach aussen: 0,76 · 0,77 · 0,54 · 0,50 · 0,61 (glatter Abfall, kein Loch). Vier Runden bis dahin — Lehre: bei Licht zuerst die Referenz lesen, dann rechnen.
- **Abfall 1/r statt 1/r² (`decay 1`).** Physikalisch richtig ist 1/r² und für dieses Pack falsch: eine Kerze steht 0,8 vor der Wand, die Mauersteine ragen 0,1–0,15 heraus, der vordere Stein bekommt das Doppelte des hinteren — das war der „Spiegel-Kabinett"-Effekt mit einzelnen Lichtkegeln. Mit 1/r (Intensitäten auf gleiche Helligkeit bei r=2 umgerechnet) ein zusammenhängender Gradient wie in den Promobildern; gemessene Wandzeile: 0,521 · 0,503 · 0,487 · 0,474 · 0,464 · 0,453 · 0,444. Budget 18 statt 10, damit keine Quelle als dunkler Halter stehenbleibt (3 von 6 Wandfackeln waren ohne Licht).
- **Lichtkonzept statt Basteln** (`docs/LIGHT_CONCEPT_S13_3.md`, recherchiert): Fackeln sind Akzent statt Hauptlicht (2,4 cd in Promo, Reichweite 9), Materialien matt (Pack liefert `roughness 0.45` → 0.95; das war der Spiegelglanz), ACES-Tonemapping statt hartem Clipping auf Weiss, Schattenwurf nur vom Key-Light.
- **Lichtempfänger je Etage** über Ebenen-Masken: ohne Schattenkarten gibt es keine Verdeckung, also schien ein Licht der unteren Etage durch den 0,15 dünnen Boden auf die Wände der oberen. Gemessen 0 Leckagen (Lichtmasken 8/16 gegen Geometriemasken 9/17).
- **Ansicht:** Modus „Nur Ansicht" (Escape beendet) blendet alle Overlays aus, damit Licht und Material beurteilbar sind; responsives Layout unter 1100 px (Leiste als Schublade unter der Szene, kleinere Overlays).
- **Flamme über den ATLAS-TEXEL gelöst** statt über eine Trennhöhe: die Flammendreiecke tragen am UV-Schwerpunkt eine Texel-Familie, die sonst nirgends im Teil vorkommt — grün (0,117,80) an der Wandfackel, hellwarm (246,151,117 bei r>235, r−b>100) an der Kerze; Holz (201,141,64) und Stein (181,181,181) liegen ausserhalb. 4 von 4 Leuchtbauteilen gelöst, inklusive `torch_mounted` (kein stiller Zwilling) und `torch_lit` (Feuer sitzt in der Schale). Meine vorherige Aussage „eine Farbregel kann Flamme nicht von Holz trennen" war falsch — auf Wärme geprüft statt auf Farbton, gegen die eigenen Messdaten.
- **Footprint-Audit korrigiert:** `wall_corner` ist ein L, seine AABB deckt das leere Innenviertel mit — fünf Scheindurchdringungen à 0,33 gegen die Kerze. Ein Eckteil wird jetzt über seine beiden SCHENKEL geprüft (Gitterpunkt aus dem Recipe, Maße aus dem gemessenen Rahmen), nicht über den Kasten. Danach 0 von 93.528 Paaren bei 16×16.
- Brüstung und Gitter sind in allen Pixel-/Strahlproben Auskunft statt Gate: `barrier` ist 0,50 schmal mit Lücken zwischen den Pfosten — ein Strahl darf dort durch, ein Körper nicht.
- **`docs/HANDOFF_dungeon_props_S13_3.md`** hält die gemessenen Zahlen für den Requisiten-Durchgang: welche sieben Wandrequisiten es gibt, ihre Asymmetrie als Ankerregel (Rücken im Pivot / Standoff im Bauteil / freistehend), freier Radius je Zelle, was Überstand und Eckschenkel wegnehmen.

### Vorherige Synchronisation

date: 2026-09-17T11:20:00Z

### Updated in this project

- **S13.2 · neu: `KayKit_Dungeon_Generator_S13_2.html` + `lib/dungeon-grid.js`** — Zufallsgenerator für konsistente Dungeons: BSP, zwei Ebenen, keine Requisiten, Seed/Dichte/Feldgröße, schrittweiser Aufbau, Draufsicht-Plan je Ebene, Recipe-JSON. Modell = Graph: Zellen Knoten, Fugen Kanten, Fugenliste als Set mit Schlüssel `min|max`.
- **Die Länge einer Wand folgt aus der Ecke.** `wall_corner` hat einen gemessenen Schenkel von **2,0** = halbe Fugenlänge. Also: Fuge ohne Ecke → volles Teil, Fuge mit einer Ecke → `wall_half`, Fuge mit zwei Ecken → **kein Teil** (die Schenkel treffen sich in der Mitte). Das erklärt, wofür `wall_half` im Pack ist, und korrigiert die S13-Annahme „eine Wand je Fuge".
- **`wall_doorway` enthält ein Türblatt.** Die Datei hat zwei Meshes: `wall_doorway` + `wall_doorway_door`. S13 notierte „Tür als Objekt: fehlt" — sie fehlt nur als eigene Datei. Beim Bauen wird das Blatt aus der Instanz entfernt (nicht versteckt: three.js raycastet auch unsichtbare Objekte). Ohne Blatt gemessen: Öffnung 1,90 breit, mittig, Sturz geschlossen.
- **Zwei unabhängige Proben auf die assemblierte Szene.** Draufsicht-Pixelprobe (Lage + Identität) kann Begehbarkeit nicht sehen — von oben ist ein Durchgang ein Rechteck wie jede Wand. Dazu ein waagerechter Strahl quer durch jede Fuge auf 0,15/0,32 Wandhöhe. Die Strahlprobe meldete 7/7 Türen versperrt und hat damit das Türblatt gefunden.
- **Farbraum-Falle:** `readRenderTargetPixels` liefert lineare Werte, solange `rt.texture.colorSpace` nicht `SRGBColorSpace` ist — `0x808080` kommt als 11 statt 128 zurück, die erste Fassung las jeden Boden als „nichts".
- **Treppe:** Kopffuge eines 1 Zelle breiten Schachts ist von zwei Eckschenkeln vollständig gedeckt und damit unbegehbar — die obere Ebene endet jetzt AUF der Kopffuge (gerader Zug, kein Eckteil, volle 4 für `wall_doorway`). Ebenenabstand 4,05 = gemessener Hub von `stairs_wood`.
- **Kleinteiliges, gemessen statt geraten:** Montageachse von `torch_mounted` ist die einseitige, nicht die schmalere (0,55 gegen 0,62) · Fackelabstand = gemessene Aussenfläche des Wandteils (`wall_cracked` ist dicker als seine Platte) · konstruktive Eckverschneidung = halbe Dicke des dickeren Teils (`wall_pillar` 0,75) und nur bei geteiltem Gitterpunkt — sonst meldet der Audit korrekte Ecken als Kollision (8 Scheinkollisionen in der ersten Fassung).
- **`gate` war eine Klasse ohne Fugen.** Gemessen: 2 gates bei 667 doors über 45 Grundrisse, 43 davon ganz ohne. Ursache strukturell — die Gebiets-Adjazenz ist fast ein Baum (629 Paare, 618 Baumkanten), jedes Paar wurde zur Tür. Ein Gitter gehört auf die **zweite Fuge eines schon verbundenen Paares** (eine trägt die Tür, eine weitere `wall_gated`): danach 24 gates in 14 von 45 Layouts. Der Balken nennt jetzt „gesetzt von möglich", damit ein 0 eine Aussage über den Grundriss ist und kein stiller Ausfall.
- **Serie über 108 Grundrisse** (3 Feldgrößen × 3 Dichten × 12 Saaten): 0 Fehlschläge, 0 freie Wandenden, 0 Inseln, 0 Räume unter 2×2, 0 dunkle Räume.

### Vorherige Synchronisation

date: 2026-09-17T09:40:00Z

### Updated in this project

- **S12 · Kacheltabelle war in z gespiegelt.** `readRenderTargetPixels` liefert Zeilen von unten, und die Draufsichtkamera mit `up = +Y` ist bei Blick nach −Y degeneriert — Bildschirm-oben landet auf −z. Beide Effekte treffen dieselbe Achse, also war jede gemessene Kantentabelle gespiegelt (`d ↔ (6−d)`). Überlebt haben das nur die spiegelsymmetrischen Masken (A, D, G, H, I, K, L, M): gerade Straßen sahen richtig aus, jeder Knick lag spiegelverkehrt, jeder Strand zeigte landeinwärts.
- **Bodenwahrheit ohne Kamera** (`tools/truth-hex-axes.html`): die Wasserfläche einer Uferkachel ist eigene Geometrie auf y ≈ −0,20, ihr Vertex-Schwerpunkt zeigt in Richtung des Wasserlaufs. `hex_coast_B` gemessen 88,7° (Kanten 1,2) statt 270°; `hex_coast_C` 59,6° statt 300°. Drehsinn getrennt nachgewiesen und korrekt (+60° je `rotDeg(1)`). Nach dem Achsenfix liefert der Pixelscan dieselben 18 Strings wie die Geometrie.
- **Eine Tabelle statt zwei Wahrheiten:** `lib/hex-grid.js` hält nur noch `TILE_EDGES` (je Kachel sechs Kanten, Klassen g/s/w); Masken, Flussvarianten, `COAST_CORE` und `COAST_EDGES` werden abgeleitet. Uferprinzip erkannt: Sand liegt auf genau den zwei Kanten, die den Wasserlauf flankieren — deshalb ist die Strandkette von selbst durchgehend und nur die Wassermaske muss exakt stimmen.
- **Pixelprobe auf die assemblierte Szene** (`makeTopDownProbe` in `lib/kit-lab.js`): Masken-Audits prüfen den Solver gegen sich selbst und blieben grün, während alles spiegelverkehrt stand. Die Sonde rendert von oben und klassifiziert über Kanalverhältnisse: 33/33 Kettenfugen tragen ihre Spur, 204/204 Uferkanten seewärts/landwärts korrekt.
- **Neu: `KayKit_Hex_Tile_Model_S12.html`** — mentales Modell als Seite statt als Kommentar: je Kachel Rendering neben gelesenem Modell aus derselben Quelle, Regel je Familie, abgeleitete Grenzen (nur Seeläufe von 2/3/4 Kanten baubar → daraus folgt der Hex-Kreis als Inselform).
- **S13 · Dungeon-Pack-Inventar gemessen** (`tools/probe-dungeon-parts.html`, 46 von 86 Kandidaten bestätigt) und **neu: `KayKit_Dungeon_Model_S13.html`**. Strukturunterschied zum Hex-Pack: dort trägt die Kachel das Merkmal, hier die **Fuge** — Boden ist Zelle, Wand ist eigenes Objekt auf der Kante. Vier Fugenklassen (solid/door/gate/open), `wall_doorway` ist die einzige begehbare. Kein `wall_end`, kein T, kein Kreuz → Wandzüge müssen geschlossen sein und in `wall_corner` (Gitterpunkt-Teil) einlaufen; daraus folgt BSP als einziges passendes Verfahren. Treppe per Hub-Vergleich gewählt statt genommen. Vertrag für den Generator (S13.2) steht auf der Seite.
- **Lehre, dreimal belegt:** dieselbe Achsenkonvention ist in UV-Scan, Pixel-Scan und SVG-Diagramm gekippt. Jede neue Darstellung braucht ihre eigene Gegenprobe gegen die Geometrie, nicht gegen die vorige Darstellung — in S13 als Achsen-Gegenprobe auf der Seite selbst (12/12).

### Vorherige Synchronisation

date: 2026-09-17T01:45:00Z

### Updated in this project

- S11.1: Kachel-Logik des Hexagon-Packs gemessen und als `EDGE_MASKS` in `lib/hex-grid.js` hinterlegt — die 13 Straßenkacheln sind genau die 13 Kantenmengen eines Sechsecks bis auf Drehung (Set vollständig), Flüsse haben 12 (keine Quellkachel). Fluss, Straße und Ufer werden jetzt **gelöst** (`solveHexTile`/`wantedMask`): 8/8 Fluss, 14/14 Straße, 6 von 12 Randzellen exakt als Küste belegbar.
- Masken kommen aus einem **Draufsicht-Rendering** je Kachel (`tools/scan-hex-render.html`), nicht aus dem Atlas-UV-Scan — der erste Versuch lieferte für `hex_grass` sechs Wasserkanten und ist entfernt.
- `relaxOverlaps()` (neu, `lib/kit-lab.js`) entzerrt Aufbauten automatisch; Gebäude sitzen auf der gemessenen Box-Mitte statt auf dem Pivot.
- FREE-Tier-Lücke bestätigt (~1600 Namen probiert): kein Feld, keine Mauer, kein Zaun, keine Brücke, kein Marktstand — deshalb kreuzt keine Straße den Fluss.

### Vorherige Synchronisation

date: 2026-09-17T01:20:00Z

### Updated in this project

- S11: `KayKit_Hex_Realm_S11.html` + `lib/hex-grid.js` + `scenes/hex-realm.js` — KayKit Medieval Hexagon Pack, Hex-Insel im Stil von `Samples/sample1.jpg` plus Palette aller 87 per Ladeversuch bestätigten Teile. Raster gemessen: pointy-top, 2,0 × 2,309, Deckfläche y = 0, Zeilenschritt ¾ Höhe.
- `auditFootprints()` bekommt `ignorePair`: Sechseck-Boxen überlappen bei korrekter Kachelung immer (0,577 seitlich / 0,866 diagonal, gemessen) — ohne die Ausnahme meldete der Audit 81 Scheinkollisionen.
- `makeViewer()`: rAF-Notnagel beendet sich nicht mehr endgültig, sondern zeichnet weiter, solange rAF steht — behebt veraltete Bilder nach Szenenwechsel (betrifft alle Sprint-Seiten).
- S3b: Racing-Setup mit Höhenkreuzung (Brücke `roadRamp`/`roadRampLong` über eine Boxengasse), `lib/track-chain.js` trägt Höhe durch die Kette, `lib/kit-lab.js` bekommt `auditClearance()`.
- Racing-Kit-Namensprobe: 33 von 112 Teilen bestätigt; kein Brücken-/Tunnel-/Gebäude-/Laternen-Teil im FREE-Kit (docs/PACK_GAPS.md §5).

### Vorherige Synchronisation

date: 2026-09-17T00:15:00Z

### Updated in this project

- S3b: `Kenney_Racing_Setup_S3b.html` — fest komponierte Racing-Kit-Strecke mit echter Höhenkreuzung (Brücke `roadRamp`/`roadRampLong` über eine Boxengasse `roadPitStraight`), Tribüne/Zelte/Boliden im Infield statt am Rand. `lib/track-chain.js` trägt jetzt Höhe (`y`) durch die Kette, `lib/kit-lab.js` bekommt `auditClearance()` für Brücke-über-Unterführung-Freiraum.
- Racing-Kit-Namensprobe abgeschlossen: 33 von 112 Teilen per Ladeversuch bestätigt (5 Runden, ~110 Kandidaten, plus Abgleich mit dem Fremd-Repo `shorepine/kenney`). Kein Brücken-/Tunnel-/Gebäude-/Laternen-Teil im Kit gefunden — Lücke in `docs/PACK_GAPS.md` §5 dokumentiert, nicht mit Ersatzgeometrie überspielt.
- `docs/HANDOFF_racing_setup.md` gelöscht (Sprint abgeschlossen, Inhalt in CHANGELOG.md S3b und PACK_GAPS.md §5 übernommen).

### Vorherige Synchronisation

date: 2026-09-16T22:39:49Z

### Updated in this project

- S8: Schach-Schlussstellung der Unsterblichen Partie (Anderssen–Kieseritzky 1851, 23.Be7#) — Brett und Figuren als eigene Low-Poly-Geometrie (`lib/chess-set.js`), da der FREE-Tier von KayKit BoardGame Bits keinen Schachsatz enthält (Chess/Cards/Chips/Trays sind laut Kontaktbogen "EXTRA ONLY" = kostenpflichtig, per Ladeversuch gegen 30+ Namen bestimmt).
- S9: Domino-Kette, 12 `domino_tile_*`-Steine, echte Kipp-Physik (`lib/domino-rig.js`) — Kontaktwinkel und Nachwippen aus gemessenem Abstand/Dicke, nicht animiert.
- `docs/HANDOFF_racing_setup.md` angelegt: Vorbereitung für einen Folge-Chat, der die Kenney-Racing-Promoszene (Brücke, Tribünen, Boxengebäude, Zelte) 1:1 nachbaut. Bild ist identisch mit dem `Sample.png` des Packs selbst (lokal kopiert, mit `Preview.png`-Kontaktbogen).
- **Gap bestätigt (gleiches Muster wie BoardGameBits):** `kenney_racing-kit` wird von der Tree-API NICHT gelistet (nur die zwei Promo-PNGs), obwohl S3 zuvor erfolgreich .glb-Teile per Roh-URL geladen hat — Namen müssen weiter per Ladeversuch geprüft werden, nicht per Verzeichnis-Listing.

### Vorherige Synchronisation

date: 2026-09-16T22:12:45Z

### Updated in this project

- S7.1: Tools Bits als **gemessener Kontaktbogen** neu gebaut (Vorlage `RPG_Tools_Bits_Overview.png`) — `contactSheet()` legt stehend authorte Modelle hin und packt sie aus den gerenderten Boxen; `auditFootprints()` belegt 0 von 1176 Paaren durchdrungen, `repairTextures()` schließt den leeren Atlas (`blueprint_stacked`).
- S3.1: Rennstrecken-Kette nimmt die **Fahrbahn** statt der Kachelbox — `measureSurface()` liest die `road`-Vertices je Kachelkante, `roadStart` ist darin +0,13 versetzt (Ursache des Sprungs am Tor), `roadCrossing` +0,50. `auditLanes()` prüft Spurpunkte statt Boxen (die Boxprüfung meldete falsches Grün), Boden in der gemessenen Verge-Farbe der Kacheln.
- Kamera global: Damping 0,14, geklemmte Zoom-Distanzen, Picking auf `pointerup`, rAF-Notnagel beendet sich selbst.
- **Gap gefunden:** `KayKit_BoardGameBits_1.0_FREE` liegt im Repo nur als Texturen (25 PNG) — die Tree-API listet keine Modelle; Geometrie muss über die Roh-URLs geprüft werden (`D20_red`, `coin_gold`, `domino_tile_3-4` liefen in `tools/measure.html`, also existieren gltf-Dateien, sind aber nicht auflistbar).

### Vorherige Synchronisation

date: 2026-09-16T16:58:00Z

### Updated in this project

- S1 Dungeon key art, S2 Kenney street grid, S3 racing track chain generator, S4 KayKit City Builder sample scene.
- KayKit City Builder Bits 1.0 FREE is IN the repo after all (41 gltf under Assets/gltf) — earlier "ZIP only" note corrected.
- Audits now measure RENDERED geometry: `auditWorld()` (world bbox vs. half-module raster, building overhang per cell) and `auditJoints()` (real gap between consecutive chain parts, wired into S3 next to loop closure).
- S5: road connectors are now MEASURED (raycast height profile per tile edge: asphalt 0.07, kerb 0.10) and a map solver places the fitting part+rotation — 39 tiles, 0 dangling ends. Supersedes S4's road logic.
- S6: KayKit Forest Nature Pack (105 parts) — clearing scatter (seeded), palette, per-family scale view.
- S7: KayKit RPG Tools Bits (49 parts) — workshop stations, palette, scale view.
- S5b: props were sunk into the 0.10-high tiles; `snapToSurface()` raycasts each prop onto the tile below it and `auditGround()` verifies contact. The gate now reports `unverified` separately (no-hit never counts as pass), samples footprint corners as well as the centre (seam case), and treats self-based buildings as surfaces: S2 31/31, S4 25/25, S5 39/39, 0 unverified each.
- S5c: furniture coordinates are gone — `kerbSlots()` derives legal pavement positions from the measured connector table (closed side = kerb, open side = roadway); 34 of 72 slots used. The gate now also checks LATERAL correctness ("Requisiten auf Fahrbahn: 0") and `probeSurface()` lets the centre sample decide (corners are seam fallback only), so props no longer jump onto neighbouring roofs.
- `docs/PACK_GAPS.md` records which promo/demo assets are missing (Space Base, Resource, Holiday, Mixed Bag, EXTRA tiers, forest ground/props, tools furniture).

## Screen map

| Screen | Repo files |
|---|---|
| KayKit_Dungeon_Room_S1.html | media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/*.gltf |
| Kenney_City_Block_S2.html | media/3D_Assets/kenney_city-kit-roads/Models/GLB format/*.glb, kenney_city-kit-commercial_2.1/…, kenney_city-kit-suburban_20/… |
| lib/kit-lab.js | tools/asset_registry/librarian/preview3d.js, framing3d.js (pattern reference) |
| tools/registry-probe.html | registry/assets/v1/catalog.jsonl @ branch bot/asset-registry-update |
| scenes/dungeon-promo.js | media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2 (pack root, CC0) |
| scenes/city-block.js | media/3D_Assets/kenney_city-kit-* (pack roots, CC0 Kenney) |
| Kenney_Racing_Track_S3.html, lib/track-chain.js | media/3D_Assets/kenney_racing-kit/Models/GLTF format/*.glb |
| Kenney_Racing_Setup_S3b.html, lib/track-chain.js, lib/kit-lab.js (auditClearance) | media/3D_Assets/kenney_racing-kit/Models/GLTF format/*.glb (33 von 112 bestätigt, s. docs/PACK_GAPS.md §5) |
| KayKit_Hex_Realm_S11.html, lib/hex-grid.js, scenes/hex-realm.js | media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/{tiles,buildings,decoration}/**.gltf (87 bestätigt), Samples/sample1.jpg, contents_*.jpg |
| KayKit_City_Sample_S4.html, scenes/kaykit-city.js | media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/*.gltf (41 Teile), sample.png, contents.png |
| KayKit_Road_Network_S5.html, lib/road-solver.js, scenes/road-network.js | media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/road_*.gltf |
| KayKit_Forest_Clearing_S6.html, scenes/forest-clearing.js | media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/*.gltf (105) |
| KayKit_Tools_Workshop_S7.html, scenes/tools-workshop.js | media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/*.gltf (49) |
| KayKit_Chess_Immortal_S8.html, lib/chess-set.js | kein Pack-Asset (FREE-Tier hat keinen Schachsatz) — eigene Geometrie |
| KayKit_Domino_Run_S9.html, lib/domino-rig.js | media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/domino_tile_*.gltf (12 von ≈28) |
| KayKit_Cards_Hourglass_S10.html | media/kfb/index.json + AI_Kayfabe_-_ADD_web.pdf.json + AI_Kayfabe PDF (Karten) · media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/hourglass.gltf · kfb-card-builder.js/kfb-ink-canon.js/kfb-card-format.js (skills/, via jsdelivr) |
| KayKit_Hex_Tile_Model_S12.html, lib/hex-grid.js (TILE_EDGES), tools/truth-hex-axes.html | media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/tiles/**.gltf (18 Kacheln gemessen: 2 Basis, 13 Straße, 12 Fluss, 5 Ufer) |
| KayKit_Dungeon_Model_S13.html, tools/probe-dungeon-parts.html | media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/*.gltf (46 von 86 Kandidaten per Ladeversuch bestätigt) |
| KayKit_Dungeon_Generator_S13_2.html, lib/dungeon-grid.js, lib/dungeon-light.js | media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/{floor_*_large, wall, wall_half, wall_cracked, wall_broken, wall_doorway, wall_gated, wall_shelves, wall_scaffold, wall_window_*, wall_pillar, wall_corner, barrier, stairs, stairs_wood, torch_mounted}.gltf (19/19 bestätigt) · uploads/ KayKit-Promobilder als Lichtvorlage |
| lib/kit-lab.js (makeTopDownProbe) | Pixelprobe auf assemblierte Szenen — kein Pack-Asset |
| lib/props-lab.js | Palette/Maßstab/Scatter für Packs ohne Raster |
| docs/PACK_GAPS.md | media/3D_Assets/ (Ordnerbestand), registry/assets/v1/catalog.jsonl |

## Notes

- Asset Registry stays the source of truth; this project is a read-only consumer.
- `_inbox/KayKit_PACKS_References_Scenes_Demos/*.gif` in georg-doc/KFB-Stunt-Car-Race is >5 MB and cannot be pulled through the connector; reference images come from the local `reference` folder / uploads instead.
