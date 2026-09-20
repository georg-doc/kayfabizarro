# KFB Kit Lab · Changelog (additiv)

Nur Zuwachs. Ältere Einträge bleiben stehen.

---

## E1 · 2026-09-20 · S21 Inline Detail Editor im Dungeon Generator

**IMPLEMENTATION:** `KayKit_Dungeon_Generator_S13_2.html` ist der zweite reale Host für die S21-Editorinteraktion. Bearbeitbar sind bewusst nur `torch` und `candle`; BSP, Böden, Wände, Ecken, Treppe und Fugen bleiben Generator-Eigentum.

**INTERACTION:** TransformControls, 0,1-Translation, 15°-Y-Rotation, objektgebundenes Mini-Menü, candle-only Bodenabsetzen, lokaler Scratch und `kfb.dungeon-detail-patch/0.1`. Die sichtbaren Transformwerte schreiben zurück in den aktuellen Placement-Record, daher enthält der bestehende Recipe-JSON-Export die Korrektur.

**TESTED RESULT:** 20/20 statische/vertragliche Checks PASS. Browser-Roundtrip ist noch offen; deshalb keine Extraktion zu `lib/edit-layer.js` und keine Resident/Stage/Platformer-Weitergabe.

**NEXT GATE:** Seed A1 → Editor → Detail verschieben/drehen → Patch → Neu bauen → identische Position wiederhergestellt.

---

## S13.3 · 2026-09-17 · Licht · und die Balkonkante ist eine Brüstung, keine Wand

Vorlage: die drei KayKit-Promobilder (`uploads/`). Neu: **`lib/dungeon-light.js`**, verdrahtet in
`KayKit_Dungeon_Generator_S13_2.html` (Auswahl **Licht: Promo / Fackeln / Nacht**).

**Aus den Bildern gelesen, nicht gestimmt.** Kein Dach, Blick von oben aussen; Hintergrund ein
dunkelvioletter **Radialverlauf**; Innenräume **hell und lesbar**, die Fackeln sind Akzent; unter
jedem Gegenstand ein weicher **Kontaktschatten**. Daraus drei Stimmungen mit Zahlen an einer Stelle
(Hemisphären-/Key-Faktor, Fackel in Candela bei decay 2, Reichweite, Flackern).

**Der Befund, den das dritte Bild erzwungen hat: `barrier`.** Per Ladeversuch gegen 37
Kandidatennamen (`railing`, `balustrade`, `handrail`, `fence`, `stairs_side`, `wall_cap` …) existiert
genau eines: **`barrier`, gemessen 4,00 × 1,10 × 0,50**, steht auf dem Boden. Damit bekommt das
Modell eine **fünfte Fugenklasse `rail`**: eine Kante der oberen Ebene über einem Boden der unteren
ist eine Balkonkante — dort gehört eine Brüstung hin, nicht vier Meter Stein. Sie trägt ein
Objekt und sperrt den Weg, bildet aber **keinen Wandzug**: das Pack hat keine Brüstungsecke und kein
halbes Stück. Deshalb zählt ein Brüstungsarm beim Eckteil nicht mit, und ein einzeln endender
Brüstungsarm ist **kein** freies Wandende — eine Brüstung darf am Treppenauge aufhören, eine Wand
nicht. Gemessene Restlücke, die das Pack nicht schliessen kann: wo eine Wand an eine Brüstung
stösst, stehen **2,90 Stirnfläche** über ihr (6 Stellen bei Saat A1) — als Auskunftszeile im Balken,
nicht weggeredet.

**Die Fackel schwebte nicht — der Schatten fehlte.** Nachgemessen an der laufenden Szene:
Fugenmitte x = −2,00, Plattenfläche −1,50, Fackelrücken **−1,48**, also 0,02 davor; Sichtstrahl
trifft Fackel bei 4,11 und Wand bei 4,79. Was fehlte, war der Kontaktschatten **an der Wand** —
jetzt eine senkrechte Scheibe in der Wandfläche, ausgerichtet nach der Einbaurichtung, Grösse aus
der gerenderten Box. Am Boden dieselbe Scheibe für alles, was in einer Zelle steht.

**Technisch gemessen statt geraten.** Flammenpunkt = Schwerpunkt der **obersten 18 %** der
Fackelgeometrie (lokal y 0,55); die Boxmitte wäre der Griff, und ein Licht darin leuchtet das
Bauteil von innen aus. · Punktlichter als **fester Pool** (10, davon 3 mit Schattenwurf), der zu den
nächsten Fackeln am Kameraziel wandert — ein Licht je Fackel lässt three.js bei jeder Änderung der
Lichtzahl alle Shader neu bauen. · Schattenkamera aus der **gemessenen Szenenbox** (Radius 21,98
statt fester 40, die bei 16×16 die Hälfte der Schatten abschnitt).

**Neue Probe: die Leseprobe.** Lichtwirkung ist messbar, also wird sie gemessen. Dieselbe
Draufsicht wie die Bauteilprobe, aber mit den **echten Materialien und dem echten Licht**; gelesen
wird die Luminanz (Rec. 709) an jeder Zellmitte. Das Gate ist bewusst nicht „alles hell", sondern
**jeder Raum hat mindestens eine lesbare Zelle** — das gilt auch nachts, wenn eine Fackel brennt.

**Und die Probe war zuerst falsch — auf genau die Art, gegen die dieses Projekt gebaut ist.** Sie
renderte **ein** Bild, und in einem Bild leuchten nur die ≤ 10 Fackeln, die der feste Pool gerade
trägt. Damit misst sie nicht den Dungeon, sondern **wo die Kamera steht**: bei 16×16 mit 25
Fackeln waren zwei Drittel der Räume unbeleuchtet, das Gate kippte beim Orbitieren und war fast
immer rot. Der Pool war nicht das Problem (ein Licht je Fackel lässt three.js alle Shader neu
bauen) — die Messung war es. Jetzt geht der Pool **in Stapeln** reihum über alle Fackeln, je Stapel
ein Bild, und je Zelle gilt das **Maximum**; danach steht der Pool wieder wie vorher.
Nachgemessen über Saaten, Feldgrössen und Stimmungen statt nur über die eine, die grün war:
8×8 A1 nachts 5/5 Räume · 8×8 TZCSA nachts 5/5 (min 0,098, 13 von 35 Zellen dunkel) · 16×16 TZCSA
nachts 9/9 in 3 Stapeln (25 Fackeln, Budget 10) · 12×12 q mit Fackellicht 7/7 (min 0,173, keine
dunkle Zelle). Dazu die Rasterzahl daneben: bei A1 liegen 33/37 Zellen im Radius einer Fackel.

**Zwei Achsen, zwei Schalter.** Ebenen- und Schrittfilter galten zuerst nur für die Bauteile:
Flammen, Kontaktschatten und Pool-Lichter blieben an einer ausgeblendeten Ebene und in den
Aufbauschritten stehen — Leuchtpunkte und warme Flecken im Leeren. Jetzt trägt jede Flamme und
jede Schattenscheibe ihr `level`, und das Rig hat `setLevelFilter` **und** `setEnabled`. Nachgezogen
wird **sofort**, nicht im nächsten Bild: dieser Rahmen drosselt `requestAnimationFrame` — dieselbe
Lehre, die als rAF-Notnagel schon in `kit-lab.js` steht und die ich in der eigenen Lichtschleife
zuerst übersehen habe.

**Und zwei Artefakte wieder ausgebaut, weil Georg sie erkannt hat.** Die erste Fassung hatte eine
orange Kugel als Flamme und eine dunkle Scheibe als Kontaktschatten an der Wand — beides
selbstgebaut, beides sah danach aus. Die Kugel ist **AI-Slop und geht nie in Produktion**; die
Scheibe war sogar die Ursache des zweiten Befunds („das Licht an der Wand ist falsch ausgerichtet"):
sie frisst genau den Lichthof, den das Punktlicht dort erzeugt, und schiebt ihn optisch nach oben.
Jetzt gilt: **das Feuer ist die Flammengeometrie des Packs**, der Schatten kommt aus der
Schattenkarte der Punktlichter, die IM Bauteil sitzen (`normalBias` gegen Streifen auf den flachen
Wandplatten). Nichts dazugemalt.

**Lichtquellen sind Bauteile.** `torch_mounted` an der Wand und **`candle`** (gemessen
0,33 × 0,87 × 0,33) auf dem Boden — gesetzt dort, wo das **Raster** sagt, dass kein Fackellicht
hinkommt (eine Aussage über den Grundriss, nicht über die Kamera), und zwar in der **Zellecke an
zwei Wänden**: Requisiten an die Ränder, Mitte frei, Wegegraph unberührt. Der Abstand kommt je
Achse aus der **gemessenen Aussenfläche der jeweiligen Wand** — gegen die Nenndicke gerechnet
steckte die Kerze bei `wall_pillar` (1,5 statt 1,0 dick) 0,12 in der Wand, und genau das hat der
Footprint-Audit gemeldet. Wirkung: 8×8 A1 nachts von 13 dunklen Zellen auf **0**, min-Luminanz von
0,098 auf 0,31.

**Noch eine Messung, die das Audit selbst korrigiert hat:** `wall_corner` ist ein **L**, seine AABB
deckt auch das leere Innenviertel — genau dort steht die Kerze. Der Audit meldete fünf
Durchdringungen von 0,33, die es nicht gibt. Ein Eckteil wird jetzt durch seine **beiden Schenkel**
geprüft (Lage aus dem Gitterpunkt im Recipe, Breite und Länge aus dem gemessenen Rahmen), nicht
durch seinen Kasten — dieselbe Klasse Ausnahme wie die Sechseck-Boxen in S11, nur aus der
Geometrie abgeleitet statt gesetzt. Danach: 0 von 93.528 Paaren bei 16×16.

**Und damit war Georgs Befund noch nicht erledigt — die Ursache hatte sich nur verschoben.** Das
Punktlicht sitzt im Flammenpunkt, also **innerhalb seines eigenen Bauteils**; bei einem kleinen
`shadow.camera.near` liegt die Fackel komplett im eigenen Schattenfrustum und wirft sich selbst auf
die Wand, an der sie hängt — die Wand wurde schwarz, und das Licht sah „falsch ausgerichtet" aus.
Gemessene Gegenprobe (Wandhelligkeit vor der Fackel, Mittelwert eines 192²-Renderings): mit
Schattenwurf **0,474**, ohne **0,479** — 1 % Unterschied, also kein Selbstschatten mehr. Erreicht
nicht mit einer flachen Zahl, sondern mit dem **gemessenen Eigenradius** je Bauteil (Flammenpunkt
→ weitester eigener Vertex: `torch_mounted` 0,95, `candle` 0,81); eine gemeinsame Zahl wäre für das
eine zu klein und für das andere zu gross. Die Prüfzeile nennt beide.

**Nachtrag aus Georgs Asset-Übergabe** (`kfb.asset-handoff.v1`, commit `10a7fdce`): das FREE-Pack
hat **„_lit“-Zwillinge** — `candle_lit` (1,05 gegen `candle` 0,87), `candle_thin_lit`
(gegen `candle_thin`), `torch_lit` (gegen `torch`), dazu `candle_melted`, `candle_triple`,
`shelf_small_candles`. Damit steht die Frage „woher kommt die Flamme“ nicht mehr: **sie ist die
Differenz zwischen dem stillen und dem brennenden Zwilling**.

**Die Flamme ist eigenleuchtend, und zwar richtig.** Erst war sie ein oranger Ball (Slop, raus),
dann Pack-Geometrie — aber von Hemisphäre und Key auf **255 ausgeblasen** (gemessenes Flammenpixel
reinweiss). Jetzt wird sie **aus dem Netz gelöst** und unbeleuchtet gerendert: Trennhöhe =
Oberkante des stillen Zwillings, Material = dieselbe Atlas-Textur, nur ohne Licht davor. Gemessenes
Flammenpixel danach **(239, 107, 49)** — die Farbe des Packs, nicht meine. Der Flammenfuss kommt aus
den **indizierten** Dreiecken: `computeBoundingBox()` ignoriert den Index und hätte den Pivot an
den Kerzenboden gelegt, wo das Flackern die Flamme auf und ab geschoben hätte (geprüft: Fuss- und
Spitzendrift 0).

**Zwei Wege verworfen, beide gemessen:** die Mengendifferenz der Dreiecke gegen den Zwilling (die
Netze sind nicht vertex-identisch — sie liefert 54 Dreiecke quer durch das ganze Teil) und der
Schwerpunkt-Schnitt (bei `torch_lit` sitzt das Feuer IN der Schale, unter der Oberkante des
Zwillings). `torch_lit` wird deshalb **nicht gesetzt**, mit Grund in der Prüfzeile — lieber ein
Teil weniger als ein weisser Klumpen.

**Und die Lichtquelle leuchtet sich nicht selbst an.** Ein Punktlicht im Flammenpunkt sitzt
innerhalb seines Bauteils: es blies die Flamme aus und verschattete das Teil mit sich selbst. Gelöst
per **Ebenen-Maske** (Leuchtkörper auf eigener Ebene, Punktlichter nicht; Hemisphäre und Key
bekommen die Ebene dazu) — eine Mechanik statt zweier halber (das vorher gesetzte
`shadow.camera.near` aus dem Eigenradius ist damit wieder weg).

**Der Schatten war falsch, und die Ursache war konzeptionell, nicht numerisch.** Georg: „weder
Schatten noch nicht stimmt hier“ — im Bild lagen dunkle Fünfecke um jede Kerze. Ein Punktlicht,
das im oder am Bauteil sitzt, projiziert dessen Silhouette **hyperbolisch** auf den Boden; keine
Near-Plane rettet das, weil die Geometrie stimmt und nur die Absicht falsch war. Die Antwort stand
die ganze Zeit in den Promobildern: **dort fallen alle Schatten in dieselbe Richtung** — es gibt
genau ein schattenwerfendes Licht von oben, Fackeln und Kerzen sind Fill. Also **Schattenwurf aus
den Punktlichtern heraus** (`shadowed: 0`), Kontaktschatten allein vom Key-Light mit gefitteter
Schattenkamera. Gemessen danach, Bodenprofil von der Kerze nach aussen: **0,76 · 0,77 · 0,54 ·
0,50 · 0,61** — glatter warmer Abfall statt Loch. Der gemessene Eigenradius bleibt als Vorhalt in
einer Prüfzeile stehen, falls ein Punktlicht doch einmal Schatten werfen soll.

**Und der letzte Befund war die Abfall-Kurve, nicht die Technik.** Georg: „der Kerzenschein
beleuchtet die Ecke nicht als eine Einheit — siehe Promobilder“. Richtig: bei mir lagen drei, vier
einzelne Lichtkegel auf den Mauersteinen, in der Vorlage ist es **ein** weicher Gradient je Fackel.
Ursache: `decay 2` ist physikalisch richtig (1/r²) und für dieses Pack falsch — eine Kerze steht
0,8 vor der Wand, die Mauersteine ragen 0,1–0,15 heraus, und bei 1/r² bekommt der vordere Stein das
Doppelte des hinteren. Mit **`decay 1`** (1/r, Intensitäten so umgerechnet, dass es bei r = 2
gleich hell bleibt) halbiert sich dieser Kontrast. Gemessen auf einer Wandzeile in Flammenhöhe:
**0,521 · 0,503 · 0,487 · 0,474 · 0,464 · 0,453 · 0,444** — glatter Verlauf, Sprünge nur noch an
Geometriekanten. Dazu Budget 18 statt 10, damit keine Quelle als dunkler Halter stehen bleibt
(gemessen: 3 von 6 Wandfackeln hatten bei 10 Plätzen und 17 Quellen kein Licht).

**Flamme jetzt über den ATLAS-TEXEL gelöst, nicht über eine Trennhöhe.** Der Zwillings-Schnitt war
ein Umweg: er löst `torch_mounted` nicht (kein stiller Zwilling) und `torch_lit` nicht (Feuer sitzt
in der Schale). Und meine Schlussfolgerung „eine Farbregel kann Flamme nicht von Holz trennen“ war
**falsch** — ich hatte auf Wärme geprüft statt auf Farbton. Die Flammendreiecke tragen am
UV-Schwerpunkt eine Texel-Familie, die sonst nirgends im Teil vorkommt (grün, 0,117,80 /
0,132,84), die Kerzenflamme eine hellwarme (246,151,117 bei r > 235 und r−b > 100), Holz
(201,141,64) und Stein (181,181,181) liegen ausserhalb beider. Damit sind **4 von 4** Leuchtbauteilen
gelöst — inklusive der Wandfackel, die zuvor als schwarzer Halter neben glühenden Kerzen stand,
und `torch_lit`, das vorher als „nicht lösbar“ ausgeschlossen war. Nebenbefund: die Flamme reicht
bei der Kerze bis y 0,81, also **unter** die Oberkante des stillen Zwillings — der Höhenschnitt
hätte sie angeschnitten.

**Selbstkritik, weil es dazugehört:** dafür hat es vier Runden gebraucht (Kugel → Scheibe →
Near-Plane → Ebenen-Maske), und drei davon waren Symptomkuren an einer Stelle, an der die
Vorlage die Antwort schon enthielt. Und danach noch zwei Runden für Abfall-Kurve und Texel-Regel, wobei die Texel-Regel eine
Fehlaussage von mir korrigiert hat, die auf meinen EIGENEN Messwerten stand.
Die Lehre ist nicht technisch: **bei Licht zuerst die Referenz lesen, dann rechnen** — eine Szene
hat ein Schattenlicht, alles andere ist Fill, und in einem stilisierten Kit ist die physikalisch
richtige Abfall-Kurve die falsche. Und die zweite: **eine eigene Schlussfolgerung gegen die eigenen
Messdaten prüfen, bevor sie in die Doku wandert.**

**Und dann hat Georg drei Dinge benannt, die alle stimmten** — Wände wie poliert, Licht scheint
durch die Bodenkanten, Lichtflecken heller als die Fackel selbst. Statt weiter zu schrauben:
recherchiert, gemessen, als **Lichtkonzept** aufgeschrieben (`docs/LIGHT_CONCEPT_S13_3.md`).

Die Praxis sagt vier Dinge, und wir hatten alle vier falsch: Fackeln sind **Akzent**, nicht
Hauptlicht (wer sie allein hell genug macht, übersteuert sie und schiebt den Abfall an die
Szenenränder); **Specular auf 0** bei Dungeon-Stein; **wenige** schattenwerfende Lichter, für feste
Innenräume lieber gebackenes Licht; und zu helles flaches Ambient plus „Aussensonne“ wäscht warme
Punktlichter aus.

Gemessen und umgesetzt: **Materialien matt** (das Pack liefert `roughness 0.45`, gesetzt auf 0.95 —
das war der Spiegelglanz) · **ACES-Tonemapping** (ohne Tonemapping clippen Lichter hart auf Weiß,
das waren die ausgeblasenen Flecken) · Fackel auf **2,4 cd** statt 9 bei Reichweite 9 (Akzent) ·
**Lichtempfänger je Etage** über Ebenen-Masken: ohne Schattenkarten gibt es keine Verdeckung, also
schien ein Licht unten durch den 0,15 dünnen Boden auf die Wände oben — gemessen **0 Leckagen**
(Lichtmasken 8/16 gegen Geometriemasken 9/17).

**Ansicht:** neuer Modus **„Nur Ansicht“** (Escape beendet) — jedes Overlay weg, damit Licht und
Material beurteilbar sind; der Prüfbalken verdeckte genau die Ecke, um die es ging. Dazu ein
responsives Layout: unter 1100 px wird die Leiste zur Schublade unter der Szene statt die Szene auf
einen Streifen zu quetschen, und die Overlays werden kleiner. (Erster Versuch war schwarz: mit
`display:none` auf dem Header rutscht `#stage` in der Auto-Platzierung in die 0-hohe erste
Zeile — jetzt explizit über beide Zeilen gelegt.)

**Offen, bewusst nicht gebastelt:** Georgs „leuchtende Sphäre“ ist in Echtzeit-3D ein **Bloom-Pass**,
keine Kugel im Netz — die Flamme bleibt Pack-Geometrie, der Schein entsteht im Bild. Ebenso wäre
**gebackenes Licht** (Lightmap/AO aus Blender) der Weg zu echtem Eckenkontrast; das lohnt erst,
wenn ein Grundriss festgehalten wird, denn ein Generator würfelt ihn neu.

**Nachtrag, zwei Regressionen aus derselben Quelle.** (1) Das Texel-Prädikat hat bei
`torch_mounted` die **falschen** Dreiecke gelöst: die grüne Familie sitzt dort am Schaft
(y −0,08–0,05), nicht in der Schale — und weil alle Leuchtkörper maskiert waren, war die echte
Flamme danach weder eigenleuchtend noch anleuchtbar: eine schwarze Schale. Jetzt werden die beiden
Feuerfamilien **getrennt** probiert und das Ergebnis gegen den **gemessenen Flammenpunkt** des Teils
geprüft (enthält die gelöste Flamme ihn nicht, wird der Split verworfen). Ergebnis: 3 von 4 Teilen
gelöst, `torch_mounted` mit Grund in der Prüfzeile verworfen und wieder von seinem Punktlicht
angeleuchtet. (2) Die Overlay-Verkleinerung im schmalen Layout war **toter Code**: der
`@media`-Block stand VOR den Basisregeln für `#gate`/`#hud` — gleiche Spezifität, spätere Regel
gewinnt, gemessen blieb `max-width` bei 66 %. Der Block steht jetzt am Ende des Stylesheets
(gemessen 62 % / 10 px). Dazu rahmt „Nur Ansicht“ die Kamera neu, statt die Szene klein im Feld zu
lassen.

Alle Gates aus S13.2 bleiben grün. Brüstung und Gitter sind in beiden Pixel-/Strahlproben
**Auskunft statt Gate**: `barrier` ist 0,50 schmal und hat Lücken zwischen den Pfosten — ein Strahl
darf dort durch, ein Körper nicht.

---

## S13.2 · 2026-09-17 · Dungeon-Generator · die Länge einer Wand folgt aus der Ecke

Neu: **`KayKit_Dungeon_Generator_S13_2.html`** + **`lib/dungeon-grid.js`** (Modell, Solver und
Audits; keine Zahl darin beschreibt ein Bauteil — Modul, Wandplatte, Schenkel, Hub, Öffnung kommen
aus `planScan`/`openingScan`). Seed + Würfeln, Dichte, Feld 8/12/16, schrittweiser Aufbau
(Räume → Gänge → Wände → alles), Ebenenfilter, Fugen-Overlay, Draufsicht-Plan je Ebene,
Recipe-JSON.

**Vier Messungen haben den Vertrag aus S13 korrigiert.** Alle vier wurden von einer Prüfung
gefunden, keine vom Hinsehen.

| Annahme aus S13 | Messung |
|---|---|
| „`wall` ist 4 lang = genau eine Fuge, also eine Wand je Fuge" | `wall_corner` hat einen **Schenkel von 2,0** — eine halbe Fugenlänge. Eine Fuge mit einer Ecke am Ende trägt **`wall_half`**, eine mit zwei Ecken **gar kein Teil** (beide Schenkel treffen sich in der Mitte). Deshalb existiert `wall_half` überhaupt. |
| „Tür als Objekt: fehlt" | `wall_doorway.gltf` enthält **zwei** Meshes: die Wand **und `wall_doorway_door`**, ein Türblatt, das die Öffnung füllt. Die Tür fehlt nur als eigene Datei. Beim Bauen wird das Blatt aus der Instanz **entfernt** — nicht versteckt: three.js raycastet auch unsichtbare Objekte, ein verstecktes Blatt hat die Strahlprobe weiter blockiert. |
| „Durchgang = Fugenmitte" | Ohne Blatt gemessen: Öffnung **1,90 breit, mittig, Sturz geschlossen**. Ein Durchgang braucht eine Fuge **ohne Eckteil**, sonst deckt der Schenkel die halbe Öffnung. |
| „Fuge an Treppenfuß und -kopf `open`" | Die Kopffuge eines 1 Zelle breiten Schachts hat an **beiden** Enden ein Eckteil; 2 + 2 = 4 deckt sie vollständig. Also endet die obere Ebene jetzt **auf** der Kopffuge: dort läuft der Zug gerade durch, kein Eckteil, volle 4 für `wall_doorway`. |

**Zwei Proben statt einer.** Die Draufsicht-Pixelprobe findet Lage und Identität (Wand um 90°
verdreht, halber Modul versetzt) — Begehbarkeit kann sie nicht sehen, weil `wall_doorway` von oben
ein Rechteck wie jede Wand ist. Dafür ein **waagerechter Strahl** quer durch jede Fuge auf 0,15 und
0,32 der Wandhöhe (unter jedem Fenster, über dem Boden). Die Strahlprobe hat zuerst **7 von 7
Türen als versperrt** gemeldet und damit das Türblatt gefunden.

**Ein Farbraum-Fehler, der jeden Boden verschwinden liess.** `readRenderTargetPixels` liefert
LINEARE Werte, solange `rt.texture.colorSpace` nicht auf `SRGBColorSpace` steht: ein sattes Grau
`0x808080` kommt als **11** zurück statt als 128 — die erste Fassung las jede Zelle als „nichts".

**Weitere Befunde.** Die Montageachse von `torch_mounted` ist **nicht** die schmalere (0,55 gegen
0,62 sind fast gleich, die Fackel stand längs an der Wand und ragte in den Eckschenkel), sondern
die **einseitige**: die Rückseite liegt in der Pivot-Ebene. · Der Abstand einer Fackel von der Fuge
ist die gemessene Aussenfläche des Wandteils, nicht die halbe Nenndicke (`wall_cracked` ist dicker
als seine Platte). · Zwei senkrecht zusammenlaufende Wände überlappen konstruktiv um die halbe
Dicke des **dickeren** Teils — bei `wall_pillar` 0,75 statt 0,5; der Footprint-Audit rechnet die
Grenze je Paar aus der Messung und verlangt einen **geteilten Gitterpunkt**, sonst wäre eine
korrekte Ecke ein Fehler (8 Scheinkollisionen in der ersten Fassung).

**Gates, alle mit Zahlen im Balken.** Jeder Raum erreichbar (BSP-Spannbaum über die Gebiete,
Treppe als erste Kante) · kein freies Wandende · ein Objekt je Fuge (Set mit Schlüssel
`min|max`) · Gänge genau ein Modul breit (2×2-Blöcke werden entzerrt, aber nur wenn der Rest
zusammenhängt) · kein Raum kleiner 2×2 (ein Gang, der einen Raum durchquert, schneidet ihn — das
abgemagerte Gebiet wird **zum Gang umgewidmet**, statt als Mangel gemeldet zu werden) · jeder Raum
≥ 1 `torch_mounted`, gerendert geprüft · keine obere Zelle ohne Boden darunter · Draufsicht und
Strahl fehlerfrei · Durchdringungen 0.

**`gate` war eine Klasse ohne Fugen.** Die Prüfung nach dem Bau: über 45 Grundrisse **2 gates bei
667 doors**, 43 von 45 Layouts ohne eines — die Klasse stand in Legende, Balken und Vertrag und
kam nie vor. Ursache strukturell, nicht Zufall: die Gebiets-Adjazenz ist fast ein Baum (629 Paare,
618 Baumkanten), also war fast jedes Paar schon eine Tür und für ein Gitter blieb nichts übrig.
Richtig ist die **zweite Fuge eines verbundenen Paares**: eine trägt die Tür, eine weitere darf
`wall_gated` sein — genau die Klassendefinition („sichtbar, nicht begehbar"), und der Wegegraph
zählt sie ohnehin als geschlossen. Danach 24 gates in 14 von 45 Layouts. Weil ein Gitter damit an
einer **messbaren** Bedingung hängt, nennt der Balken jetzt beides: gesetzt **von möglich** — ein
„0 von 0" ist eine Aussage über den Grundriss, kein stiller Ausfall.

**Serie:** 3 Feldgrößen × 3 Dichten × 12 Saaten = 108 Grundrisse, **0 Fehlschläge**, 0 freie
Wandenden, 0 Inseln, 0 Räume unter 2×2, 0 dunkle Räume, 1 verbleibender 2×2-Gangblock.
Ebenenabstand **4,05** (gemessener Hub von `stairs_wood`, nicht die Wandhöhe 4,00).

---

## S12 · 2026-09-17 · Die Kacheltabelle war in z gespiegelt · mentales Modell als eigene Seite

Georg: „die strand/ufer-seiten müssen zum wasser zeigen, nicht richtung land". Richtig — und die
Ursache lag eine Ebene tiefer als der Drehsinn-Fix aus S11.4.

**Der Achsenfehler.** Der Sampler rechnete `y = ((wz/half)*0.5+0.5)*(SIZE-1)`. Aber
`readRenderTargetPixels` liefert Zeilen von **unten**, und die Draufsichtkamera auf `(cx,10,cz)`
mit `lookAt(cx,0,cz)` bei `up = +Y` ist **degeneriert** — three.js rettet sich mit einem Nudge,
und der Bildschirm-Aufwärtsvektor landet auf **−z**. Beide Effekte treffen dieselbe Achse.
Ergebnis: jede gemessene Kantentabelle war gespiegelt (`d ↔ (6−d) mod 6`). Überlebt haben das nur
die unter dieser Spiegelung invarianten Masken — **A, D, G, H, I, K, L, M**. Genau deshalb sahen
gerade Straßen richtig aus, während jeder Knick spiegelverkehrt lag und jeder Strand landeinwärts
zeigte.

**Nicht gespiegelt, sondern gemessen.** `tools/truth-hex-axes.html` braucht keine Kamera: die
Wasserfläche einer Uferkachel ist eigene Geometrie auf y ≈ −0,20, ihr Vertex-Schwerpunkt im
Objektraum zeigt in Richtung des Wasserlaufs.

| Kachel | Tabelle sagte | Geometrie sagt | |
|---|---|---|---|
| `hex_coast_B` Wasser | 270° = {4,5} | **88,7° = {1,2}** | gespiegelt |
| `hex_coast_C` Wasser | 300° = {0,4,5} | **59,6° = {0,1,2}** | gespiegelt |
| `rotDeg(1)` = 300° | i → i+1 | 88,7° → **148,7°** = +60° | **korrekt** |

Der Drehsinn wurde also getrennt nachgewiesen und bleibt. Nach dem Achsenfix (`cam.up.set(0,0,-1)`
plus Minus in der z-Rechnung) liefert der Pixelscan **dieselben achtzehn Strings** wie die
Geometrie — zwei unabhängige Methoden, ein Ergebnis.

**Eine Tabelle statt zwei Wahrheiten.** `lib/hex-grid.js` hält jetzt nur noch `TILE_EDGES`: je
Kachel sechs Kanten in drei Klassen (g Wiese · s Sand · w Wasser). Masken, Flussvarianten,
`COAST_CORE` und `COAST_EDGES` werden **abgeleitet**. Vorher standen Masken und Kantenstrings
getrennt da und konnten auseinanderlaufen.

**Neu: `KayKit_Hex_Tile_Model_S12.html`** — das mentale Modell als Seite statt als Kommentar.
Je Kachel das Draufsicht-Rendering neben dem gelesenen Modell (Sechseck mit sechs gefärbten
Kanten), beides aus derselben Quelle, dazu je Familie die Regel:

- **Basis (2)** — volle Sechsecke, keine Anschlüsse, keine Drehung
- **Straßen (13)** — genau die 13 nichtleeren Kantenmengen bis auf Drehung, das Set ist vollständig
- **Flüsse (12)** — dieselben Muster als Rinne, aber **keine Einzelkante = keine Quellkachel**
- **Ufer (5)** — ersetzt die Landzelle und bringt eigenes Wasser mit; **Sand liegt auf genau den
  zwei Kanten, die den Wasserlauf flankieren**, deshalb ist die Strandkette von selbst durchgehend
- **Grenzen, abgeleitet statt behauptet** — baubar sind nur zusammenhängende Seeläufe von 2, 3, 4
  Kanten (18 Masken mit Drehung); es fehlen Läufe der Länge 1, 5, 6 und alle geteilten. Daraus
  folgt der Hex-Kreis als Inselform.

**Neu: Pixelprobe auf die assemblierte Szene.** `auditTileFit` vergleicht Masken — also den
Solver mit sich selbst; es konnte weder Spiegelung noch Drehfehler sehen. `makeTopDownProbe`
(`lib/kit-lab.js`) rendert die fertige Szene von oben und liest Pixel an Weltkoordinaten,
klassifiziert über **Kanalverhältnisse** (schattenrobust):

| Prüfung | Ergebnis |
|---|---|
| Kettenfugen tragen ihre Spur | **33/33** (drei Punkte je Fuge — ein überhängendes Dach soll keinen Fehlalarm geben) |
| Uferkanten seewärts ≠ Wiese, landwärts ≠ Wasser | **204/204** |
| Gegenprobe: unterscheidet die Sonde überhaupt? | Wiese (5,4) = g · Fluss (6,7) = w · Uferecke (0,6) = w |

**Nachtrag S12.1 — derselbe Achsenfehler, diesmal im Diagramm der Erklärseite.** Das SVG-Modell
rechnete `cxy − sin(a)·R`. SVG-y wächst nach unten, also landete die Weltrichtung +z (Kante 1 SO)
am oberen Rand, während das Thumbnail daneben +z per `cam.up.set(0,0,-1)` unten hat: die beiden
Hälften, die die Seite ausdrücklich zum Vergleich anbietet, widersprachen sich. Fix ist ein
Vorzeichen (`cxy + sin(a)·R`). Gegenprobe über alle Karten — Vorzeichen des Klassen-Schwerpunkts
im Rendering gegen die y-Mitte der gefärbten SVG-Linien: **32/32 gleich, 0 Abweichungen**
(`hex_coast_B` Wasser: Rendering +76, Diagramm +34,5 — beide Süd). Merke fürs Protokoll: eine
Achsenkonvention ist dreimal an verschiedenen Stellen gekippt (UV-Scan, Pixel-Scan, SVG). Jede
neue Darstellung braucht ihre eigene Gegenprobe gegen die Geometrie.

---

## S11.5 · 2026-09-17 · Dieselbe Fehlerklasse eine Schicht höher: Plateaus sind rasterfest

Der Prüfbalken war grün, während drei von sechs Massiven neben ihrer Zelle standen — genau das
Muster, das S11.4 in der Kachelschicht beheben sollte.

**Zwei Ebenen, beide Layout, keine Entzerrungs-Panne.**

1 `hills_*` und `mountain_*` sind **rasterfeste Sechseck-Plateaus** — sie liegen auf genau einer
Zelle, wie eine Kachel. Bäume und Felsen sind freie Requisiten. Beide lagen in derselben Schicht
mit `shiftFor = 0.8`, also hat `relaxOverlaps` `mountain_B` um **0,74** von Zelle (7,2) geschoben
(37 % der Kachelbreite, rotbraune Unterseite über der Kachelgrenze sichtbar). Rasterfestes trägt
jetzt `fixed: true`, bekommt `shiftFor = 0`, keine Drehung und keinen Streuradius.

2 Der Layoutfehler darunter: gemessen sind `mountain_B` 2,57 × 2,58 und `mountain_C` 2,53 × 2,39
bei einem Zellabstand von **2,0**. Zwei Massive auf Nachbarzellen *müssen* sich durchdringen —
keine Entzerrung kann das reparieren, sie kann nur verschieben. Berge und Hügel haben jetzt
mindestens **zwei Zellen Abstand** voneinander und von jedem Gebäude:
(7,1) (9,2) (10,4) (3,3) (8,5) (1,7).

**Neue Prüfung** `auditOnCell` — liest die Mitte der **gerenderten Box** und vergleicht sie mit
der Zellmitte (dieselbe Logik wie der Spurgelenk-Audit aus S3, nur für Aufbauten). Weder
`auditHexSeams` (nur Kachelschicht) noch `auditOnLand` (nur „hat Land unter sich") konnten sehen,
dass ein Plateau daneben steht.

| Prüfung | vorher | jetzt |
|---|---|---|
| Rasterfeste Aufbauten auf Zelle | ungeprüft (3 von 6 daneben, max 0,74) | **6/6 · Versatz 0** |
| Durchdringungen | 4 · max 0,066 | **0 · max 0** |
| Aufbauten auf Land / Innenzellen | 43/43 · 33/33 | 45/45 · 33/33 |
| Kantenschluss Straße / Fluss / Ufer | 0 Fehler | 0 Fehler (132 / 84 / 204 Kanten) |

---

## S11.4 · 2026-09-17 · Ufer und Straße hatten kein Modell — jetzt haben sie eins, und es ist prüfbar

**Der Befund war richtig.** Vier Fehler, die alle dieselbe Wurzel haben: der Solver prüfte, ob
eine *Wunschmaske erfüllbar* ist, nie ob die *gesetzte Kachel zum Nachbarn passt*.

**1 Der Drehsinn war umgekehrt.** `rotMask(m, n)` verschiebt Kante *i* nach *i+n*. Eine Drehung
des Objekts um **+n·60° um Y** bildet einen Punkt (x,z) auf (x·cosθ + z·sinθ, −x·sinθ + z·cosθ)
ab — ein Merkmal beim Winkel *a* landet bei *a−θ*, die Kante also bei *i−n*. Jede Kachel stand um
−2n verdreht; richtig war nur n = 0 und n = 3. Deshalb sahen gerade Straßen (A, symmetrisch unter
n = 3) korrekt aus, während **jede Kurve spiegelverkehrt lag** und der Strand landeinwärts zeigte
statt zum Meer. Neu: `rotDeg(n) = ((6−n) mod 6)·60`.

**2 Die Uferkanten waren falsch gemessen.** Der erste Scanner nahm den Median der sechs **Ecken**
als Land-Referenz. Auf Straßen- und Flusskacheln stimmt das (dort bleiben alle Ecken Wiese), auf
einer Küstenkachel liegen Ecken **im Wasser**: der Median kippte, und `hex_coast_A/D/E` kamen mit
leerer Maske zurück. Der Setz-Code überspringt `water === 0`, also blieben nur B und C — daher
„Ufer 6/12". Zweiter Scan absolut gegen `hex_grass`/`hex_water`/`hex_road_L`, dritter mit einem
**Fächer aus 4 Radien × 7 Winkeln** je Kante und der Regel *Wasser = Mehrheit, Sand = mindestens
eine Probe* (`tools/scan-hex-coast.html`). Erst damit zeigt sich die Wahrheit:

| Kachel | O SO SW W NW NO | Bedeutung |
|---|---|---|
| A | s g g g s s | Vollland, Strand über drei Kanten |
| B | s g g s **w w** | Land über vier Kanten, See auf zwei |
| C | **w** s g s **w w** | Landkeil über drei Kanten, See auf drei |
| D | **w w** s s **w w** | Landzunge über zwei Kanten, See auf vier |
| E | g g g g s s | Vollland, Strand über zwei Kanten |

Sand liegt bei B, C und D auf **genau den zwei Kanten, die den Wasserlauf flankieren** — die
Strandkette ist also von selbst durchgehend, nur die Wassermaske muss exakt stimmen.

**3 Die Form folgt aus der Kachelschicht, nicht aus dem Geschmack.** Eine Uferkachel *ersetzt*
die Landzelle und bringt ihr eigenes Wasser mit: B hat vier Landkanten, C drei, D zwei. Ein frei
gezeichneter Umriss erzeugt lauter C/D-Randzellen, und der Rand zerfällt zu Zacken. Realisierbar
sind nur **zusammenhängende Seeläufe von 2, 3 oder 4** Kanten. Deshalb jetzt ein **Hex-Kreis**
(Radius 6): sechs gerade Seiten → 29 × B, sechs Ecken → 5 × C (die sechste ist die Flussmündung).
Der Binnensee ist weg, weil seine Uferzellen fast alle eine **einzelne** Wasserkante verlangten
und es dafür keine Kachel gibt; `void` zählt jetzt als offenes Meer, deshalb hat überhaupt erst
der Außenrand Strand. Und weil eine Uferkachel halb Wasser ist, liegt alles Bebaute bei Radius ≤ 5.

**4 Netze sind Ketten, keine Zellenmengen.** `ROAD_PATH` war eine Menge, die Anschlussmaske kam
aus der Nachbarschaft *in dieser Menge*: „benachbart, aber nicht verbunden" ist so nicht
ausdrückbar, zwei Wege verschmelzen zufällig zur Kreuzung, und ein Sprung in der Liste
([7,3] → [4,3] stand wirklich drin) erzeugt lautlos zwei Sackgassen. Jetzt `ROAD_CHAINS` /
`RIVER_CHAINS` mit Adjazenzprüfung; Kreuzungen entstehen nur an absichtlich geteilten Zellen.

**Neue Prüfungen** — die Lehre endet als Gate, nicht als Vorsatz:

| Prüfung | Ergebnis |
|---|---|
| `auditTileFit` Kantenschluss der **gesetzten** Kacheln (Straße/Fluss/Ufer) | 0 Fehler |
| Kettenbrüche (Fluss / Straße) | 0 / 0 |
| Straßenenden an Gebäuden | 20/20 |
| Straße kreuzt Fluss | 0 (Pack hat keine Brücke) |
| Uferkacheln gesetzt | 34/34 · 0 unmöglich |
| Ufer normalisiert | 0 Zellen (der Hex-Kreis braucht keine Reparatur) |
| Aufbauten auf Innenzellen | 43/43 |
| `endSeaEdge` Quelle/Mündung | genau **eine** Seekante statt aller drei |

**Bewusst offen:** ein Fluss von Rand zu Rand teilt eine Insel zwangsläufig — das ist Topologie,
kein Versehen. Daher zwei getrennte Straßennetze (15 + 7 Zellen) und ein eigener Weiler im Süden,
statt eine Brücke zu erfinden, die das FREE-Pack nicht hat.

---

## S11.1 · 2026-09-17 · Hex-Kachel-Logik verstanden · Fluss/Straße/Ufer werden gelöst

**Der Auftrag war das mentale Modell, nicht nur die Szene.** Gemessen (nicht geraten) und jetzt in
`lib/hex-grid.js` als `EDGE_MASKS` hinterlegt:

| Schicht | Regel |
|---|---|
| Terrain | `hex_grass`/`hex_water` sind volle Sechsecke, Deckfläche y = 0, Körper hängt darunter |
| Anschlüsse | 6-Bit-Maske je Kachel (Bit 0 O, 1 SO, 2 SW, 3 W, 4 NW, 5 NO) |
| Straßen | **13 Kacheln A…M = genau die 13 nichtleeren Kantenmengen eines Sechsecks bis auf Drehung** (1 Einzel + 3 Paare + 4 Tripel + 3 Quadrupel + 1 Quintupel + 1 alle) → das Set ist vollständig, jedes Netz ist baubar |
| Flüsse | dieselben Muster, aber **12** — keine Einzelkante, also keine Quellkachel |
| Ufer | Strand auf einigen Kanten, Wasser auf anderen; `_waterless`-Zwillinge tragen nur den Strand (sonst zwei Wasserflächen übereinander) |
| Mündung | ein Fluss endet nicht, er trifft Wasser: Wasser zählt beim Lösen als angeschlossen |
| Höhe | `hills_*` sind erhöhte Plateaus, `mountain_*` Felsmassive — beides liegt **auf** einer Graszelle |

**Wie die Tabelle zustande kam — zweiter Versuch, erster war falsch.** Der erste Scan las die
gemalte Farbe über die **UVs** aus dem geteilten Atlas und lieferte für `hex_grass` sechs
„Wasser"-Kanten: unbrauchbar, und er ist raus statt als zweite, falsche Messung herumzuliegen. Der
zweite rendert jede Kachel **von oben** und liest den Pixel an den sechs Kantenmitten
(`tools/scan-hex-render.html`); als Land-Referenz dient der Median der sechs **Ecken** derselben
Kachel (Ecken bleiben auf jeder Kachel Land), warme Abweichung = Straße/Strand, kühle = Wasser.
Damit sind Beleuchtung und Atlas-Layout irrelevant.

**Gebaut**
- `solveHexTile(wanted, family)` + `wantedMask(col,row,has)`: Fluss-, Straßen- und Uferkacheln
  sind jetzt **gelöst, nicht gesetzt** — Wunschmaske aus der Nachbarschaft, dann Kachel + Drehung
  mit passender gemessener Maske. Gate: `Fluss 8/8 · Straße 14/14 (1 Sackgasse) · 0 ungelöst`.
- Ufer wird **gefunden statt gewählt**: jede Landzelle am Wasser bekommt ihre Wassermaske, und nur
  wo eine der 5 Küstenkacheln sie per Drehung exakt trifft, wird sie gesetzt — 6 von 12 Randzellen.
  Der Rest bleibt ehrlich Gras, statt eine falsch gedrehte Küste hinzustellen.
- Neue Karte nach `Samples/sample2.jpg`: Landmasse mit See im Südosten, Fluss vom Nordwest-Rand in
  den See, Straßennetz im Norden (Burg → Dorf), Berge im Nordosten, Wälder, Süd-Weiler.

**Drei Fehler, alle vom Gate gefunden:**
1. **Zwei Flusszellen unlösbar** (Maske mit nur einer offenen Kante) — der Pfad hatte eine Lücke:
   bei odd-r-Versatz ist „Spalte +1" **nicht** dieselbe Richtung in geraden und ungeraden Reihen.
   Eine eingefügte Zelle schließt die Kette, seitdem 8/8.
2. **Der Inselrand zählte überall als angeschlossen** — mitten im Lauf gabelte sich der Fluss
   scheinbar in die Klippe. Jetzt zählt der Rand nur an den beiden **Pfadenden**.
3. **Gebäude standen mit dem Pivot statt mit der Box-Mitte auf der Kachel** (dieselbe Klasse wie
   `roadStart`s 0,13 Spurversatz in S3.1): das 1,80 breite Marktdach schob durch den Nachbarturm.
   Die Pivot→Box-Mitte-Differenz wird jetzt gemessen, mit gedreht und abgezogen; dazu entzerrt
   `relaxOverlaps()` (neu in `lib/kit-lab.js`) verbleibende Überschneidungen automatisch, statt
   Koordinaten von Hand nachzuziehen.

**Ehrliche Lücke, per Ladeversuch gegen ~1600 Namen bestätigt:** kein Feld/Acker, keine Stadtmauer,
kein Zaun, **keine Brücke**, kein Marktstand, kein Belagerungsgerät im FREE-Tier. Die gelben
Felder, die Mauerzüge und die Steinbrücke aus `sample2.jpg` sind deshalb nicht nachgebaut — und
weil es keine Brücke gibt, **kreuzt keine Straße den Fluss**: der Süd-Weiler hängt bewusst nicht am
Hauptnetz, statt eine Brücke zu erfinden.

**Nachtrag nach Review, drei Befunde:**
1. **Die Wasserhöhe war die letzte getippte Zahl** auf einer Seite, deren ganzer Anspruch
   „gemessen, nicht angenommen" ist: die Seefläche lag auf handgeschriebenen −0,55, die
   Wasserkachel des Packs hat ihre Oberfläche aber bei **−0,20** — 0,35 daneben, sichtbar als
   Stufe am Seerand. Die Höhe kommt jetzt aus `measured.get('hex_base/hex_water').max[1]`. Die
   verbleibende 0,10-Lippe zwischen Flussrinne (−0,10) und Seefläche ist Pack-Geometrie und steht
   als solche im Panel, statt stillschweigend dazustehen.
2. **Ein Berg neben einer Burg war für den Entzerrer unlösbar** (Burg 1,98 + Berg 1,80 auf
   Nachbarzellen 2,0 auseinander, Durchdringung 0,535). Ein einziges Verschiebebudget ist dafür zu
   stumpf — `relaxOverlaps()` nimmt jetzt `shiftFor(recipe)` je Schicht: Natur darf 0,8 wandern,
   Requisiten 0,5, Gebäude nur 0,22 (das Gebäude ist das adressierte Ding, der Fels nicht).
   Ergebnis: **0 Durchdringungen** statt 6.
3. **Die Prüfzeilen galten weiter der Insel, während die Palette zu sehen war** — jetzt zeigt der
   Palette-Modus nur, was dort auch gemessen wird.

**Zweiter Nachtrag — zwei Felsen schwammen auf dem See, und das war ein fehlendes Gate:**
Die Natur-Gruppe stand auf Zelle (3,8), aber `TERRAIN`-Reihe 8 (`'....gggggg....'`) beginnt erst
bei Spalte 4 — die Zelle war **Leere**. Durchgerutscht ist das, weil keine Prüfung nach unten
schaute: `auditHexSeams` prüft nur die Kachelschicht, `auditFootprints` nimmt Kachelpaare aus,
`relaxOverlaps` fragt nicht, was darunter liegt. Neu in `lib/hex-grid.js`:
**`auditOnLand()`** — jedes Teil mit `layer !== 'tile'` braucht eine Kachel unter seiner Zelle
(und darf nicht auf Wasser stehen, sofern nicht ausdrücklich erlaubt). Steht als
„Aufbauten auf Land 44/44" im Gate und färbt es rot, sobald eine Kartenänderung wieder eine Zelle
verschiebt. Die Gruppe sitzt jetzt auf (8,8).

---

## S11 · 2026-09-17 · KayKit Medieval Hexagon Pack · Hex-Insel + Palette

**Gebaut**
- `KayKit_Hex_Realm_S11.html` — Hex-Insel (30 Kacheln, 12 Gebäude, 14 Natur-, 8 Requisiten-Teile)
  im Stil der pack-eigenen `Samples/sample1.jpg`, plus **Palette** aller 87 bestätigten Teile in
  10 Gruppen (Klick auf ein Teil zeigt Name, Pack-Ordner, Zelle und gemessene Maße).
- `lib/hex-grid.js` — Hex-Raster aus der Messung statt aus der Annahme: `hexMetrics()` leitet
  Spalten-/Zeilenschritt und Zeilenversatz aus der gemessenen Kachel ab, `hexToWorld()` rechnet
  odd-r-Offset-Koordinaten um, `DIRS`/`neighbor()` sind die sechs Kantenrichtungen, und
  `auditHexSeams()` prüft jede gesetzte Kachel gegen ihre Rasterposition.
- `scenes/hex-realm.js` — Inventar (was **geladen** wurde, nicht was der Kontaktbogen zeigt) +
  Insel-Rezept: Kachel-Karte als Zeichenraster, Gebäude/Natur/Requisiten in eigenen Listen, damit
  ein Kacheltausch kein Gebäude verschiebt.

**Gemessene Bauregeln · KayKit Medieval Hexagon Pack**

| Fakt | Wert | Konsequenz |
|---|---|---|
| Kachel | 2,0 (Fläche→Fläche, x) × 2,309 (Spitze→Spitze, z) | **pointy-top**; Deck-Ecken liegen bei ±30°/±90°/±150° (Umkreis 1,097) |
| Deckfläche | **y = 0**, Körper hängt darunter | alles, was auf einer Kachel steht, kommt auf y = 0 — kein Einrasten nötig (anders als KayKit City, 0,10 hoch) |
| Zeilenschritt | 1,732 = ¾ Kachelhöhe, Versatz halbe Breite | odd-r-Offset-Raster |
| Material | **ein** Atlas (`hexagons_medieval`) für alle Kacheln | der S3.1-Trick („Vertices des Materials `road` lesen") greift hier nicht |

**Namensprobe: 87 Teile bestätigt** (3 Runden, ~1000 Kandidaten, `tools/probe-hex.html`):
`hex_grass`, `hex_water`; `hex_coast_A…E` (+ `_waterless`); `hex_river_A…L` (+ `_waterless` A…J);
`hex_road_A…M`; Gebäude `building_{castle,church,windmill,watermill,market,blacksmith,mine,
lumbermill,barracks,well,tavern,home_A,home_B,tower_A,tower_B}_{blue,green,red,yellow}`;
Natur `tree_single_A/B`, `rock_single_A…E`, `hills_A…C`, `mountain_A…C`; Requisiten `barrel`,
`ladder`, `sack`, `target`, `tent`, `wheelbarrow`.

**Zwei Befunde, beide aus einer Prüfung, die zuerst falsch Rot meldete:**
1. **Der Footprint-Audit meldete 81 „Kollisionen" bei einer perfekten Kachelung.** Ursache ist
   Geometrie, nicht Platzierung: die **Bounding-Box eines Sechsecks ist größer als das Sechseck**,
   zwei korrekt sitzende Nachbarkacheln überlappen in der Box immer — gemessen 0,577 (Seite an
   Seite) bzw. 0,866 (diagonal). `auditFootprints()` hat jetzt `ignorePair`, S11 nimmt
   Kachel↔Kachel-Paare aus (die Kachelung prüft `auditHexSeams()`), und die Zahl misst nur noch
   echte Durchdringungen zwischen Gebäuden/Natur/Requisiten.
2. **Erste Fassung stellte Burg und Berg in dieselbe Zelle** (Durchdringung 1,34). Natur steht
   jetzt nur auf Zellen ohne Gebäude, Requisiten sitzen am Kachelrand (0,78 × Inkreis).

**Und ein Fund, der alle Seiten des Labors betrifft:** der rAF-Notnagel in `makeViewer()` hat sich
nach dem ersten echten Frame **endgültig** beendet — ein späterer rAF-Stillstand (in dieser
Einbettung Normalfall, sobald nichts interagiert) blieb damit unsichtbar: die Szene wechselte
(Palette gebaut, 87 Teile im Baum), das Bild zeigte weiter die Insel. Der Notnagel bleibt jetzt
stehen und zeichnet nur, solange rAF wirklich steht (>400 ms kein Tick) — kein Doppel-Update im
Normalbetrieb (die S7.1-Ursache für ruckelndes Panning) und keine veralteten Bilder mehr.

**Offen:** Straßen-/Fluss-/Küstenkacheln tragen ihre Anschlüsse als Atlas-Textur, nicht als
Geometrie. `scanEdges()` in `lib/hex-grid.js` liest deshalb die **gemalte Farbe** an den sechs
Kantenmitten (UV → Atlas-Pixel) — der Weg steht, die Klassifizierung ist aber noch nicht
belastbar (`hex_grass` liefert falsche Kantenarten). Solange sind die Rotationen dieser Kacheln
**gesetzt, nicht gelöst**; ein Löser analog `lib/road-solver.js` (S5) ist der nächste Schritt.
Ebenfalls offen: der Ordner `buildings/neutral` — keiner der ~50 probierten Namen traf.

---

## S3b · 2026-09-17 · Kenney Racing Setup · feste Komposition mit Höhenkreuzung

**Ausgangspunkt:** `docs/HANDOFF_racing_setup.md` (voriger Chat) — die Kenney-Racing-Kit-Promoszene
(`Sample.png`, identisch mit dem Nutzer-Referenzbild) 1:1 nachbauen, mit echter Brücke statt
flachem Loop. `github_get_tree` listet `media/3D_Assets/kenney_racing-kit/Models/` weiterhin nicht
(gleiche Lücke wie BoardGameBits: die Tree-API zeigt nur "importierbare" Dateitypen, `.glb` fällt
durch) — Namen kamen wieder per Ladeversuch, diesmal systematisch: 5 Proberunden gegen ~110
Kandidatennamen (abgeleitet aus dem Kontaktbogen `Preview.png` und Kenney-Namenskonventionen),
zusätzlich `shorepine/kenney` (ein Fremd-Repo, das Kenneys gesamte CC0-Bibliothek nach Kit
durchsucht) bestätigt **112 Modelle** für dieses Kit, aber ohne Dateinamenliste — auch dort listet
die Tree-API nur Text-/Bilddateien.

**Ergebnis der Proberunden: 33 von 112 Teilen bestätigt.**
`roadStart, roadStraight, roadStraightLong, roadStraightArrow, roadStraightLongBump, roadRamp,
roadRampLong, roadCrossing, roadPitStraight, roadCornerSmall, roadCornerLarge, roadCornerLarger,
roadSplit, roadSplitLarge, roadEnd, barrierRed, barrierWhite, fenceStraight, fenceCurved, pylon,
flagCheckers, billboard, grandStand, grandStandRound, treeLarge, treeSmall, grass, raceCarRed,
raceCarGreen, raceCarOrange, raceCarWhite, tent, ramp`. Kein `bridge`/`tunnel`-Einzelteil, kein
Boxen-/Kontrollturm-Gebäude, keine Laterne, keine Banner-Variante, keine Zelt-Farbvarianten unter
~110 probierten Kandidaten (Liste inkl. Fehlschläge in `tools/probe-racing.html`). Die Brücke ist
deshalb aus `roadRamp`/`roadRampLong` gebaut — den dafür vorgesehenen Teilen —, das Turmgebäude aus
dem Kontaktbogen fehlt in der FREE-Auswahl und wurde **nicht** durch eine geratene Ersatzgeometrie
vorgetäuscht.

**Gebaut**
- `lib/track-chain.js` erweitert: `connectors()`/`chain()` tragen jetzt eine **Höhe** (`y`) mit —
  ein Ramp-Teil ist ein normales 1-Modul-Straight, dessen Mesh selbst die Steigung trägt; ein
  Abwärts-Ramp ist dasselbe Teil rückwärts durchfahren (genau der Trick, der schon linke Kurven
  trägt), nur dass jetzt auch die Höhe statt nur die Richtung umgedreht wird. Neue Tokens
  `RU/RD/RLU/RLD`. `auditLanes()` prüft jetzt zusätzlich den Höhensprung an jedem Spurstoß.
- `lib/kit-lab.js` → `auditClearance()`: neues Prüfgatter für Höhenkreuzungen — paarweiser
  XZ-Overlap-Test zwischen "Brücke" und "Unterführung", meldet den knappsten gemessenen Freiraum
  statt nur "berührt sich nicht".
- `Kenney_Racing_Setup_S3b.html` — **fest komponierte** Strecke (keine Freitext-Kette wie S3):
  langgezogenes Rechteck, das Nord-Ende ist eine echte Brücke (`RLU` hebt 0,51 Einheiten, ein
  Decksegment, `RLD` senkt wieder), darunter kreuzt im rechten Winkel eine dreiteilige
  Boxengasse (`roadPitStraight`) — gemessener Freiraum 0,49 Einheiten. Tribüne, Fan-Tribüne,
  Zelte, Banner und vier Boliden (rot/grün/orange/weiß) stehen im **Infield**, nicht am Rand.
  Kette geschlossen (Lücke 0, Richtungsfehler 0°, Höhenfehler 0), 27 Spurstöße fluchten.

**Zwei echte Fehler beim Bauen, beide durch Messung gefunden:**
1. **Erster Streckenentwurf war ein einfaches abgerundetes Rechteck mit der Brücke als ganzer
   Seite** — technisch korrekt (Kette geschlossen, Freiraum gemessen), aber vom Nutzer nach
   Screenshot-Vergleich mit der Referenz zu Recht als "falscher Grundaufbau" zurückgewiesen: zu
   simpel, Tribüne/Zelte am Rand statt im Zentrum. Zweiter Entwurf: Brücke auf die **kurze**
   Rechteckseite verlegt (Boxengasse kreuzt darunter), Dressing ins Infield verschoben.
2. **Brücken-Unterführung lag daneben, obwohl beide Teile denselben "Spur-Ankerpunkt" benutzten.**
   Die Fahrbahn-Anker von Brücke (Rotation 90°) und Boxengasse (Rotation 0°) stimmten überein, die
   tatsächlichen Bauteil-Boxen nicht — beide Teile haben einen nicht zentrierten Pivot, der bei
   unterschiedlicher Rotation unterschiedlich stark seitlich auswandert (0,15 lokal wurde zu 1,15
   Welt-Versatz). `auditClearance()` meldete zunächst **0 Überlappungen** (falsches Grün wäre ein
   falsches Rot gewesen — hier zum Glück ehrlich "nichts gemessen", nicht "sauber"). Fix: die
   Boxengasse wird nach dem Bauen anhand der **gerenderten** Box beider Teile ausgerichtet, nicht
   anhand der Anker-Koordinate.

**Offen / bewusst nicht 1:1:** Die Streckenführung ist ein Rechteck mit Höhenkreuzung, nicht die
frei fließende S-Kurven-Silhouette der Kenney-Promo-Render — ein pixelgenauer Nachbau der
künstlerisch verzerrten Isometrie ist mit 90°-Rasterteilen nicht deckungsgleich zu erreichen.
`docs/PACK_GAPS.md` führt die vollständige Fund-/Fehl-Liste.

---

## S10.2 · 2026-09-17 · FAIL: Karten-Artwork per PDF-Render — nicht lösbar von der Seite aus

**Zweiter Anlauf nach dem `document.hidden`-Fix, verworfen.** Der `document.hidden`-Fix allein reichte nicht — `cb.pending` blieb trotzdem dauerhaft bei 13. Vermutung: `pdf.js` rendert intern über `requestAnimationFrame`, und dieses rAF bleibt in der Einbettung angehalten. Um das zu beweisen, wurde eine **komplette Ersatz-Pipeline** gebaut, die die Warteschlange des kanonischen Builders umgeht: eigener `pdf.js`-Import, eigenes `getDocument`/`getPage`/`render`, Crop nach dem dokumentierten Fallback-Raster, Kunstblatt aus denselben Kanon-Bausteinen (`cb.ink.contour`/`pathOf`, `fitCell`/`coverLoss`), Ergebnis per `card.setSurface()` eingesetzt.

**Präzise durchgemessen (Zeitstempel je Schritt), Befund:** `import()` → 100 ms, `getDocument()` → 100 ms, `getPage()` → 2 ms — alle drei zuverlässig schnell, in jedem Testlauf. **`page.render()` — die eine Operation, die den PDF-Inhalt tatsächlich auf einen Canvas zeichnet — hat in keinem einzigen Testlauf ihr Promise aufgelöst**, egal ob mit oder ohne Web-Worker, egal ob sofort beim Laden oder erst nach dem `load`-Event ausgeführt, egal ob durch einen echten oder einen synthetisch ausgelösten Klick vorher. Eine ursprünglich erfolgreiche Direktmessung (`page.render()` in 64 ms) ließ sich **nicht reproduzieren** — derselbe Aufruf, wenig später erneut versucht, hing genauso. **Entscheidender Gegenbeweis:** derselbe Hänger trat identisch in der echten Live-Vorschau des Nutzers auf (`eval_js_user_view`, nicht nur die Agent-Sandbox) — das ist kein Artefakt der Testumgebung, sondern eine reale Grenze dieser Hosting-Umgebung für `pdf.js`s Canvas-Rendering.

**Verworfen, nicht weiter gepatcht.** Die Ersatz-Pipeline ist wieder raus; S10 nutzt wieder ausschließlich den kanonischen Builder (inkl. `document.hidden`-Fix, der als Verbesserung bleibt) mit dem 7-Sekunden-Watchdog aus S10.1: Artwork wird als „in dieser Vorschau nicht verfügbar" erklärt, die Text-Karte (Titel/Lore/Tuschekante) bleibt die geltende Karte. **Offener Punkt für einen echten Fix:** eine Instanz außerhalb dieser Einbettung (ein deploytes Ergebnis, kein Live-Preview-iframe) müsste prüfen, ob `pdf.js`s Canvas-Render dort normal funktioniert — die drei hier ausgeschlossenen Erklärungen (Warteschlange, `document.hidden`, rAF-Timing) sind alle keine tragfähige Ursache mehr.

---

## S10 · 2026-09-17 · KFB-Karten + Sanduhr

**Gebaut**
- `KayKit_Cards_Hourglass_S10.html` — nutzt die **kanonischen** KFB-Module (`kfb-card-builder.js`, `kfb-ink-canon.js`, `kfb-card-format.js` via jsdelivr), nicht nachgebaut. Fünf Karten aus „Roko's Basilisk & The AI Kayfabe Takeover" (`ai_kayfabe`), fünf Szenen: **Vergleich** (Karte 1 im KFB-Sollformat `fit` vs. naiver Pack-Karte `cover`, mit `cb.formatReport()`), **Stapel**, **Fächer**, **Anschnitt** (Ink-Kante per `measureInk()` geprüft), **Sanduhr** (KayKit BoardGame Bits `hourglass.gltf`, Sandstand animiert, umkehrbar, Sandfarbe wählbar).
- Eigener Import-Map-Block mit `three@0.160.1` (statt des Projekt-Standards 0.184) — Regel aus dem KFB-Embed-Bundle: die drei Kartenmodule sind gegen genau diese Version gebaut, „EINE Herkunft je Modul-Stack".

**Drei echte Fehler beim Bauen, alle durch Messung gefunden, keiner geraten:**
1. **Datenformat-Mismatch:** Das Deck-JSON von `ai_kayfabe` benutzt die Schlüssel `num`/`name`; `cb.loadDeck()` erkennt nur `cardNumber`/`cardName` (bzw. `n`/`t`) und verwirft jede Karte, die nicht passt — `makeById()` lieferte für alle fünf Karten `null`. Der canonische Builder wird deshalb **nicht verändert** (er ist fremdes, kanonisches Modul) — die Anpassung sitzt am Aufrufpunkt: das Deck-JSON selbst laden, Karten auf `{n, title, lore, packId}` normalisieren, an `cb.make()` übergeben. `cropCard()` im Builder liest nur `packId`+`n`, die echte PDF-Crop/Ink/Sollformat-Pipeline läuft unverändert.
2. **`preserveDrawingBuffer` fehlte** im `WebGLRenderer` — dieselbe Zeile, die `lib/kit-lab.js`s Viewer schon trägt. Ohne sie zeigte jeder Screenshot dieselbe eingefrorene erste Ansicht, obwohl Kamera und Sichtbarkeit sich im Live-Zustand nachweislich änderten (per `eval` bestätigt).
3. **Reparenting-Falle:** Stapel und Fächer bauten beide auf demselben `cards`-Array; ein `Object3D` hat aber genau **einen** Parent — als der Fächer-Code `c.group` in einen Fächer-Knoten steckte, verschwanden die Karten aus dem Stapel (0 Kinder). Fix: Fächer bekommt eigene `cb.make()`-Aufrufe statt der Stapel-Instanzen wiederzuverwenden.
- Nebenbefund bestätigt dieselbe Timer-Klasse wie S9: `setInterval` friert in dieser eingebetteten Vorschau nach wenigen Ticks ein, sobald keine Interaktion läuft — kein Code-Fehler, sondern eine Eigenschaft der Vorschau-Sandbox (bestätigt durch direktes, synchrones Treiben der Sand-Physik über `tickSand()`, das den vollen Lauf 0→1 korrekt zeigt).

**Nachtrag nach Review: der Artwork-Crop lief nie an, in der eigenen Vorschau UND in der Live-Vorschau des Nutzers.** `cb.pending` blieb dauerhaft bei 13, „Vergleich"/„Anschnitt" zeigten beide nur das identische Text-Blatt — der eigentliche Vergleichspunkt (Sollformat-Rand vs. Cover-Verlust) war unsichtbar. Ursache, zweistufig gefunden:
1. `kfb-card-builder.js`s `pump()` verweigert jede PDF-Seite, solange `document.hidden === true` — und das war es, dauerhaft, in dieser Einbettung (bestätigt per `eval_js_user_view` in der echten Nutzer-Ansicht, nicht nur der Agent-Vorschau). Fix **am Aufrufpunkt**, nicht im kanonischen Modul: `document.hidden`/`visibilityState` werden einmalig per `Object.defineProperty` korrigiert, bevor die erste Karte gebaut wird.
2. Das reicht allein nicht: `pdf.js` rendert seine Seiten intern über `requestAnimationFrame`, und **dasselbe rAF bleibt in dieser Einbettung angehalten** (dieselbe Klasse wie der S9-Domino-Fund) — `cb.pending` blieb auch nach dem `hidden`-Fix bei 13 stehen, über 17 s real gemessen, in der Live-Vorschau des Nutzers. Das liegt außerhalb der Seite (Browser-Scheduling für dieses Embedding), nicht reparierbar durch weiteren JS-Code.
3. **Ehrlicher Fallback statt stillem Hängen:** ein Seiten-Watchdog gibt der Warteschlange 7 s, erklärt das Artwork danach explizit für „in dieser Vorschau nicht verfügbar" (HUD + Facts-Panel), räumt die Warteschlange (`cb.clearQueue()`) und macht klar, dass die Text-Karte (Titel/Lore/Tusche) die echte Karte ist, kein Platzhalter. Verifiziert: Fallback erscheint in der Agent-Vorschau nach 7 s und in der echten Nutzer-Vorschau nach ~17 s (Screenshot bestätigt).

---

## S10.1 · 2026-09-17 · Sanduhr FAIL verworfen · Kartenmotiv-Fix zunächst gefeiert, dann in S10.2 widerlegt

**FAIL, dokumentiert wie vom Nutzer verlangt: die Sanduhr-Sand-Simulation.** Screenshot zeigte Sandkegel, die die Glasform komplett sprengen (Kegelspitze reicht weit über den Halsansatz hinaus, viel zu dick für den Kolben). Ursache: die 40/20/40-Aufteilung der Glashöhe (oberer Kolben/Hals/unterer Kolben) war eine **Annahme**, keine Messung an der tatsächlichen Innenform — das Modell ist keine einfache Zylinder/Kegel-Hülle, die Bounding-Box allein reicht nicht, um Kegelradius und -höhe der beiden Kolben herzuleiten. **Verworfen, nicht repariert:** `topPile`/`botPile`/`stream` und die Kipp-/Lauf-Logik sind komplett raus; die Seite zeigt nur noch das echte, korrekt geladene `hourglass.gltf` (das Modell trägt bereits eigenen, im Pack modellierten Sand — kein Bedarf, welchen nachzubauen). Sandfarbwahl und Laufen/Umdrehen-Buttons sind entfernt, da funktionslos ohne echte Simulation. **Dieser Teil steht.**

**Zweiter Befund — inzwischen widerlegt, siehe S10.2 oben:** dieser Eintrag beschrieb ursprünglich eine eigene Crop-Pipeline, die die Kartenmotive per direktem `pdf.js`-Aufruf nachlädt, mit Screenshot-Beleg, dass alle fünf Szenen echte Illustrationen zeigten. **Der Beleg war nicht reproduzierbar** — ein zweiter Testlauf desselben Codes, wenig später, hing an derselben Stelle (`page.render()`) wie zuvor der kanonische Builder. Die Ersatz-Pipeline ist wieder entfernt; was tatsächlich ausgeliefert ist, steht in S10.2.

---


**Gebaut**
- `KayKit_Domino_Run_S9.html` + `lib/domino-rig.js` — 12 KayKit-BoardGame-Bits-Dominosteine (`domino_tile_0-0` … `3-4`, alle einzeln gegen die Roh-Pfade geladen bestätigt), aufgestellt und zu einer Kettenreaktion verkettet.
- Physik ist keine Animationskurve: jeder Stein ist ein fallender Stab um seine Vorderkante, `θ'' = (3g)/(2L)·sin θ`, in 4 Substeps pro Frame integriert. Der **Kontaktwinkel** — ab wann Stein *i* den nächsten berührt — kommt aus gemessenem Abstand (0,62×Höhe) und gemessener Dicke (0,277 liegend), nicht aus einer geschätzten Zahl: 29,4° für alle mittleren Stöße, 90° (flach) für den letzten Stein ohne Nachbarn.
- Beim Kontakt gibt Stein *i* einen Teil seiner Winkelgeschwindigkeit an Stein *i+1* weiter (der physische Anstoß) und geht selbst in ein kurz gedämpftes Nachwippen (`θ = θ_rest − |A·e^(−5,2t)·cos(16t)|`) bevor er in der Endlage einrastet.
- Aufstellen aus der liegenden Geometrie ist eine gemessene Transformation, kein geschätzter Dreh: Rotation (x,y,z)→(x,z,−y), danach Boden (min.y→0) und Vorderkante (max.z→0) aus der tatsächlichen Bounding-Box genullt — Pivot-Fehler wie bei `roadStart` (S3.1) fallen hier genauso auf.
- Panel zeigt gemessene Maße, Abstand, Kontaktwinkel, sowie den Live-Zustand aller 12 Steine (Winkel, Phase) und das Kettenziel „X/12 in Endlage".

**Nachtrag nach Review:** Die Steine blieben am Kontaktwinkel hängen (lehnten aneinander) statt umzufallen — `restAngle` war fälschlich der Kontaktwinkel selbst. `stepDomino()` unterscheidet jetzt **Auslösewinkel** (löst die Nachfolger aus) von **Endwinkel** (immer 90°, flach) — jeder Stein fällt ganz durch, der Kontakt ist nur noch der Trigger, kein Anschlag. Dazu: **Verzweigung** — Stamm aus 5 Steinen, an dessen Ende gabelt die Kette in zwei Zweige (−40°/+40°, 4 bzw. 3 Steine), ein Stein löst zwei Nachfolger gleichzeitig aus. Die 12 Pip-Paare sind jetzt bewusst im Zickzack niedrig/hoch gewählt (`0-0,6-6,0-3,5-6,1-1,4-5,0-1,3-6,2-2,1-6,0-2,2-6`) und ein Gate prüft „12 verschieden, keine Duplikate". Nebenbefund beim Debuggen: die Physik-Schleife lief zunächst auf `requestAnimationFrame` und fror nach dem ersten Tick ein — dieselbe Klasse Bug, die den `setInterval`-Notnagel in `lib/kit-lab.js`s Viewer nötig macht (rAF feuert in dieser eingebetteten Vorschau nicht zuverlässig). Physik läuft jetzt auf `setInterval`.

**FAIL nach Nutzer-Review, Verzweigung verworfen:** Screenshot zeigt an der Gabel drei Steine flach übereinander an einem Punkt statt sauber ausgefächert, keiner zeigt seine Augenzahl-Seite (blanke Fläche). Vom Nutzer als Fail benannt, mit dem Hinweis, dass fertige three.js-Physik-Vorlagen (echte Starrkörper-Kollision, z. B. `cannon-es` oder `@dimforge/rapier3d`) das sauber lösen. Ursache: die Kipp-Simulation ist eine **analytische Näherung ohne Kollisionserkennung** — jeder Stein fällt bis 90° entlang seiner eigenen vorab berechneten Achse, unabhängig davon, ob dort schon ein anderer Stein liegt. An einer geraden Kette verdeckt das den Fehler; an einer Gabel mit drei sich kreuzenden Fallachsen überlappen die Endlagen geometrisch, weil nichts prüft, ob dort Platz ist. Die blanke Fläche ist ein zweiter, unabhängiger Fehler (Sichtseite hängt vom Rotationsvorzeichen ab, pro Ast nicht neu geprüft). **Lehre:** ein handgerolltes Rotations-ODE-Modell trägt eine lineare Kette, aber keine Verzweigung — dafür fehlt der Baustein, der zwei Starrkörper am selben Ort auseinanderhält. **Nicht weiterverfolgt** — eine Verzweigung wäre ein neuer Anlauf mit einer echten Physik-Engine (cannon-es/Rapier), kein Patch dieser Datei.

---

## S8 · 2026-09-17 · Die Unsterbliche Partie · Schach-Schlussstellung

**Gebaut**
- `KayKit_Chess_Immortal_S8.html` + `lib/chess-set.js` — Brett und sechs Figurentypen als eigene Low-Poly-Primitiv-Geometrie (Zylinder/Kegel/Kugel/Torus, im chunky-abgerundeten KayKit-Vokabular), **kein Pack-Teil**: der FREE-Tier von KayKit BoardGame Bits enthält keinen Schachsatz — geprüft per Ladeversuch gegen die rohen Asset-Pfade (23 Namen probiert, nur Würfel D4/D8/D20, Meeples, Pawns, Münzen, Dominos, Sanduhr trafen; Brett/Tray/Schach/Karten/Chips sind laut Kontaktbogen "EXTRA ONLY" = kostenpflichtig). Ergänzt `docs/PACK_GAPS.md`-Befund.
- Stellung: **Zug 23, Be7#** aus der Unsterblichen Partie Anderssen–Kieseritzky 1851, FEN gegen zwei unabhängige Quellen verifiziert (`r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1`). Korrektur im Lauf: die ursprüngliche Fragenformulierung nannte den Schlusszug fälschlich „Bxd7+" — das eigentliche Matt ist der Läuferzug **Be7#**, gegen chess.com und chessgames.com geprüft.
- `parseFEN()` generisch (wiederverwendbar für jede Stellung), Audit prüft Feldkollisionen, Bodenkontakt, Brettgrenzen und Königszahl — alle grün, 23 Figuren.

---

## S3.1 · 2026-09-17 · Rennstrecke · Spur aus der Fahrbahn, nicht aus der Box

**Befund**
Im Screenshot sprang die Strecke am Start/Ziel-Tor seitlich um einen kleinen Betrag, und das Tor stand schief über der Fahrbahn. Die Kette meldete trotzdem grün: `auditJoints` misst den Abstand zwischen zwei **Bounding-Boxen** — zwei Kacheln, die sich berühren, melden 0, auch wenn die Fahrbahn quer dazu versetzt ist. Falsches Grün, genau die Fehlerklasse, für die das Labor da ist.

**Ursache (gemessen)**
Die Fahrbahn ist nicht die Kachelbox. `measureSurface` liest die Vertices des Materials `road`:

| Teil | Fahrbahn-Mitte vs. Box-Annahme |
|---|---|
| `roadStraight`, alle Kurven | 0 |
| `roadStart` | **+0,13** — das Tor liegt in derselben 1×2-Kachel, die Fahrbahn ist darin verschoben |
| `roadCrossing` | **+0,50** — 2×2-Kachel, Spur in der Mitte |

Die alte Kette rechnete `lane = minX + Modul/2` und legte das Start-Tor damit 0,13 neben die Strecke.

**Geändert**
- `lib/kit-lab.js` → `measureSurface(pack, name, {material})`: Fahrbahn-Bounding-Box, pro Kachelkante die Öffnung (`lo/hi/mid/w`) und `laneOffset`. Dazu `materialColor(pack, name, mat)`.
- `lib/track-chain.js` → `connectors()` nimmt den **Surface**-Datensatz: Eingang = Mitte der Öffnung in der +Z-Kante, Ausgang = Mitte der Öffnung in der +X-Kante (Kurve) bzw. −Z-Kante (Gerade). Kurven-Ausgänge werden gemessen, nicht bei n/2 angenommen.
- `lib/track-chain.js` → `auditLanes(placements)`: prüft **Spurpunkte** statt Boxen — Abstand zwischen Ausgang *i* und Eingang *i+1*, inklusive Ringschluss, plus Richtungsstetigkeit. Ergebnis: 14 Spurstöße, max 0.
- Boden: Ebene in der **gemessenen** Verge-Farbe der Kacheln (`grass`, #95c5af) statt Strecke über Hintergrundfarbe; Größe aus der Streckenbox.
- Panel zeigt „Teile mit versetzter Spur" — die Liste, die den Fehler sichtbar macht: `roadStart +0.13, roadCrossing +0.50`.

**Nachtrag nach Review:** fünf der sechs Presets schlossen die eigene Prüfung nicht — Restkette lag offen, teils mit 180° Richtungsfehler (Netto-Drehung der Kurven war nicht ±360°), teils mit Lücke (ungleiche Seitenlängen im Rechteck aus Kurve+Gerade). Alle sechs `PRESETS` in `lib/track-chain.js` neu durchgerechnet nach der Regel „gegenüberliegende Rechteck-Seiten gleich lang, Kurven-Nettodrehung ±360°" und einzeln gegen die Lücke-0-Anzeige verifiziert (auch der Slalom-Schikane-Fall: `CR CL CL CR` hebt sich zu 0° Richtung auf, muss aber auf beiden Rechteckseiten stehen, sonst bleibt ein Seitenversatz). Alle sechs zeigen jetzt „Kette geschlossen · Lücke 0". Die veraltete Sidebar-Notiz („Bounding-Box des Teils") ist ebenfalls korrigiert — sie nannte noch die vor S3.1 falsche Quelle.

---

## S7.1 · 2026-09-16 · Tools Bits · Kontaktbogen statt Stationen + Kamera-Fix

**Befund aus dem Review (Screenshots)**
Die Stationslayouts steckten ineinander, standen hochkant und sahen der Pack-Vorlage nicht ähnlich. Ursache: die Modelle sind **stehend** authored (Säge, Schraubendreher, Meißel), die Offsets waren **handgetippt** und kannten die Fußabdrücke nicht. Die Vorlage (`ref/tools_overview.png`) zeigt die Regel: alles **liegt**, sortiert in Reihen, groß hinten, nichts berührt sich.

**Geändert**
- `lib/props-lab.js` → `contactSheet(pack, rows, opts)`: Orientierung aus dem Maß (Höhe > Fußabdruck × 1,1 ⇒ `rotation.x = -90°`, Ausnahmeliste `STAND`), Position als **Differenz** zwischen gemessener Box und Zielzelle (macht Pivot-Offsets irrelevant: `box.min.x` auf den Cursor, `box.min.y` auf den Boden), Vorschub = eigene Teillänge + 0,30 Abstand. Reihen werden mittig ausgerichtet, innerhalb der Reihe nach Fußabdruck-Fläche sortiert.
- `scenes/tools-workshop.js` — **keine Offsets mehr im Rezept**, nur noch 7 Reihen (wer gehört zusammen) und `STAND` (wer bleibt stehen). Export `ROWS`, `STAND`, `SHEET`, `ROW_LIST`.
- `lib/kit-lab.js` → `auditFootprints(root)`: paarweiser AABB-Test auf gerenderter Geometrie, Kollision nur bei Überlappung in x **und** y **und** z, plus Bodenkontakt-Prüfung. Ergebnis im Panel: **0 / 1176 Paare, max 0**, 49/49 auf `y=0`, 27 liegend / 22 stehend.
- `lib/kit-lab.js` → `repairTextures(root)`: `blueprint_stacked` war schwarz, weil der geteilte Atlas unter Last einmal leer zurückkam. Materialien ohne Bild borgen jetzt die Textur des gleichnamigen Materials; Retry bis sauber, als eigenes Gate sichtbar.

**Kamera (galt für alle Seiten)**
- `dampingFactor` 0,05 → 0,14, `rotateSpeed`/`panSpeed`/`zoomSpeed` gesetzt, `screenSpacePanning`, `zoomToCursor`, `maxPolarAngle` knapp unter Horizont; `minDistance`/`maxDistance` werden in `frame()` aus dem Szenenradius gesetzt (Wheel kann nicht mehr durch die Teile fliegen), `saveState()` + neuer Button **Kamera zurück**.
- Der `setInterval(draw, 200)`-Notnagel lief **zusätzlich** zur rAF-Schleife und rief `controls.update()` außer Takt auf — genau das Ruckeln beim Panning. Er beendet sich jetzt selbst, sobald rAF läuft.
- Picking auf `pointerup` mit 4-px-Schwelle statt auf `pointerdown`: der Raycast klaute vorher die ersten Frames jedes Orbit-Drags.
- `touch-action:none` auf dem Canvas.

---

## S7 · 2026-09-16 · KayKit RPG Tools Bits 1.0 FREE · Werkstatt + Maßstab

**Gebaut**
- `KayKit_Tools_Workshop_S7.html` — drei Modi: **Werkstatt** (40 Teile in 6 Stationen: Schmiede, Schleifstein, Tischlerei, Grabung, Expedition, Licht & Seil), **Palette** (alle 49 Teile), **Maßstab** (nach Höhe sortiert, Hilfslinien im Abstand 1 Einheit, pro Gruppe filterbar).
- `scenes/tools-workshop.js` — 49 Teilenamen aus dem Repo, in Arbeitsgruppen sortiert.

**Gemessene Fakten**
| Fakt | Wert |
|---|---|
| höchstes Teil | `shovel` 1,58 |
| längstes Teil | `grindstone` 2,27 |
| kleinstes Teil | `pencil_A_short` 0,38 |
| Varianten-Logik | `screwdriver_A/B_long/short` je mit und ohne `_color`, `torch`/`torch_burnt`, `journal_open`/`_closed`, `map`/`_empty`/`_rolled` |

Korrektur im Lauf: erste Stationsabstände (0,3–0,9) stapelten alles übereinander — das Pack ist groß gebaut. Abstände laufen jetzt über einen Faktor auf die gemessenen Maße, die Tischplatte wird aus der Bounding-Box der fertigen Szene dimensioniert statt geraten.

**Lücke:** keine Werkbank, kein Boden im Pack. Tisch ist Bühne. Für echte Möbel fehlt Furniture Bits (nicht im Repo).

---

## S6 · 2026-09-16 · KayKit Forest Nature Pack 1.0 FREE · Lichtung + Familienlogik

**Gebaut**
- `KayKit_Forest_Clearing_S6.html` — **Lichtung** (305 Pflanzungen aus 8 Streu-Bändern, Seed 7 → reproduzierbar), **Palette** (alle 105 Teile), **Maßstab** pro Familie.
- `scenes/forest-clearing.js` — vollständiges Vokabular, aus dem Repo gelesen: 22 Büsche, 20 Gras (inkl. Singlesided + 4 geteilte Meshes), 43 Felsen, 20 Bäume.
- `lib/props-lab.js` — Palette, Maßstabsreihe und deterministischer Scatter für Packs ohne Raster.

**Gemessene Bauregeln**
| Fakt | Wert | Konsequenz |
|---|---|---|
| Baumhöhen | 3,51 – 10,77 | Pack ist auf ~1 Einheit = 1 m gebaut |
| Felsen | 0,22 – 4,58 | `Rock_1` sind Brocken, `Rock_3` Kiesel |
| Büsche / Gras | 0,99 – 1,79 / 0,59 – 0,94 | Bodendecker, brauchen Dichte statt Größe |
| Varianten | `A…R` je Familie, austauschbar | Scatter ohne Wiederholungsmuster |
| Gras-Sonderfall | `_Singlesided`-Variante je Grasbüschel | billigere Version für Massen, gleiche Silhouette |

Zwei Korrekturen im Lauf, beide im Screenshot aufgefallen: (1) alle Modelle **schwarz**, weil 105 gleichzeitige Ladungen dieselbe Pack-Textur angefordert haben und ein Teil davon abgewiesen wurde — Ladung läuft jetzt erst ein Teil allein (wärmt die Textur), dann in Sechserblöcken. (2) Lichtung mit Radius 15 hat 46 zehn Meter hohe Bäume zu einem Klumpen gepresst — Radien sind jetzt an den gemessenen Höhen ausgerichtet.

**Lücke:** keine Bodenplatten im Pack. Der Boden ist Bühnenfläche.

---

## S5b · 2026-09-16 · Bodenkontakt · versenkte Requisiten

Vom Prüfer gefunden, berechtigt: das Straßennetz saß, aber **jede Requisite und jedes Auto steckte im Pflaster**. Ursache: Kacheln sind 0,10 hoch, Requisiten standen auf y = 0. `trash_A` (0,052 hoch) und `trash_B` (0,040) waren komplett unsichtbar, die Autos 0,13 tief im Asphalt. Und die Prüfung konnte es nicht sehen, weil sie nur die Straßenkacheln geprüft hat.

**Regel statt Zahlenkolonne:** `lib/kit-lab.js` → `snapToSurface()` schießt pro Requisite einen Strahl nach unten, sucht die Oberkante der Kachel darunter und setzt das Teil genau darauf. Kein handgetipptes y pro Requisite mehr — die Höhe kommt aus der Geometrie, auch wenn ein Teil halb über Asphalt (0,07) und halb über Bordstein (0,10) steht. `auditGround()` prüft es anschließend nach und meldet jedes versenkte oder schwebende Teil.

**Zweiter Durchgang, zweiter berechtigter Einwand:** die Prüfung hat mehr behauptet, als sie geprüft hat. 13 von 39 Teilen hatten `surface === null` — kein Strahltreffer — und wurden trotzdem als bestanden gezählt. Genau die Klasse Fehlplatzierung (Requisite neben der Fläche) wäre durchgerutscht. Zwei Ursachen, beide behoben:
- `auditGround()` gibt **`unverified`** getrennt zurück, `clean` verlangt jetzt `bad = 0` **und** `unverified = 0`. Panel und Banner nennen nur die tatsächlich gemessene Zahl.
- Ein Strahl durch die Mitte reicht nicht: eine Laterne auf der Naht zwischen zwei Kacheln fällt hindurch. `probeSurface()` tastet jetzt Mitte **plus vier Fußpunkt-Ecken** ab, höchster Treffer gewinnt.
- Gebäude mit eigener Basisplatte sind **Standflächen**, keine Requisiten — S5 übergibt dieselbe `isSurface`-Regel wie S4. Das korrigiert die Requisitenzahl von 39 auf die echten 27.

Stand jetzt: **S5 27/27 gemessen, 0 ohne Fläche darunter** (10 eingerastet, max 0,03), **S4 25/25, 0 ungeprüft** (max 0,89 — der Wasserturm landet auf dem Dach, weil Dächer als Standfläche zählen), **S2 31/31, 0 ungeprüft** (max 0,02).

---

## S5c · 2026-09-16 · Requisiten-Slots aus der Kantenmessung

Dritter Einwand, wieder berechtigt und wieder eine Ebene höher: die Straßen saßen, die Höhen saßen — aber **8 von 13 Straßenmöbeln standen in der Fahrspur**. Hydrant, Bank und Mülleimer mitten auf dem Asphalt, und die Prüfung hat es zertifiziert, weil sie nur gefragt hat „berührt das Teil eine Fläche", nicht „ist es die *richtige* Fläche".

**Ursache in einem Satz:** die Requisiten hatten handgetippte Halbmodul-Offsets, also war es Zufall, ob ein Teil auf dem Asphaltband oder dem Bordsteinstreifen landete.

**Eine Änderung an der Ursache:** Requisiten-Positionen werden jetzt **erzeugt**, nicht getippt. `lib/road-solver.js` → `kerbSlots()` leitet aus der gemessenen Anschlusstabelle ab, welche Kachelseiten geschlossen sind — geschlossen heißt Bordstein, offen heißt Fahrbahn — und liefert deren Mittelpunkte, eingerückt in die Mitte des gemessenen Bordsteinstreifens. Die Szene fordert Möbel als Anzahl pro Typ an und bekommt Slots zugewiesen: **34 belegte von 72 gemessenen Slots**, keine einzige getippte Requisiten-Koordinate mehr.

**Und die Prüfung kann es jetzt sehen:** neue Zeilen „Requisiten auf Bordstein 34/34" und „Requisiten auf Fahrbahn 0", beide Teil der Freigabebedingung im Banner. Ein Straßenmöbel auf Asphalthöhe (0,07) statt Bordsteinhöhe (0,10) färbt das Banner rot.

Nebenbefund beim Nachmessen: `probeSurface()` nahm den höchsten aller Abtastpunkte — dadurch sprang eine Laterne am Blockrand auf ein **Gebäudedach** (Korrektur 2,35). Jetzt entscheidet der **Mittelpunkt**, die Ecken sind nur Rückfall für den Nahtfall. Größte Einrastung wieder 0,13.

---

## S5 · 2026-09-16 · KayKit City Builder Bits · Straßen gelöst statt geraten

Das war der berechtigte Einwand: Straßen, Kreuzungen und Kurven saßen falsch, weil ich die Anschlussrichtungen **geraten** habe. Sie stehen in keinem Dateinamen.

**Was jetzt passiert**
- `lib/road-solver.js` tastet jede Kachel von oben ab und liest das Höhenprofil an allen vier Kanten. **Asphalt liegt auf 0,07, der Bordstein auf 0,10** — damit ist messbar, wo eine Straße weitergehen darf. Kalibrierung: bei 0,03 Einbuchtung ist der Unterschied eindeutig, bei 0,10 liest jede Kante Asphalt und jede Kachel sieht offen aus. Dieser Fehler war in der ersten Fassung drin und ist durch die Messung selbst aufgefallen.
- `KayKit_Road_Network_S5.html` — Straßen kommen aus einer **Karte**, nicht aus einer Teileliste. Der Löser bestimmt pro Zelle die gebrauchte Anschlussmaske aus der Nachbarschaft und setzt das Teil, dessen gemessene Maske exakt passt. Marker in der Karte äußern Wünsche: `x` Zebrastreifen, `c` runde Ecke, `@` harte Ecke.

**Gemessene Anschlusstabelle** (N = −Z, E = +X, S = +Z, W = −X)

| Teil | 0° | 90° | 180° | 270° |
|---|---|---|---|---|
| `road_straight` | NS | EW | NS | EW |
| `road_straight_crossing` | NS | EW | NS | EW |
| `road_corner` | ES | NE | NW | SW |
| `road_corner_curved` | ES | NE | NW | SW |
| `road_tsplit` | NES | NEW | NSW | ESW |
| `road_junction` | NESW | NESW | NESW | NESW |

**Ergebnis der Prüfung:** 39 Kacheln, **0 Zellen ohne passendes Teil, 0 offene Enden, 39/39 Wunsch-Teile erfüllt, Kantenversatz 0**. Die Anzeige „Anschlüsse" setzt grüne Punkte auf jede Kante, die eine Gegenkante trifft, orange auf jedes offene Ende.

**Das ersetzt die Straßenlogik aus S4.** S4 bleibt als Nachbau der Pack-Sample-Szene stehen, S5 ist die Grundlage für alles Weitere (Stadt, Strecken, Raster).

---

## S4 · 2026-09-16 · KayKit City Builder Bits 1.0 FREE · Sample-Szene + Platzierungsprüfung

**Gebaut**
- `KayKit_City_Sample_S4.html` — Nachbau der pack-eigenen Sample-Szene, 87 Platzierungen, Referenz-Blende, Palette aller 41 FREE-Teile, Klick auf ein Teil zeigt Name + Modulkoordinate + Maße.
- `scenes/kaykit-city.js` — Recipe in Modulkoordinaten. Teilenamen aus dem Repo ausgelesen (41 gltf), nicht aus dem Gedächtnis.
- `docs/PACK_GAPS.md` — wo die PAID/EXTRA-Assets aus den Screenshots fehlen.

**Reaktion auf die Kritik am Streckenversatz (berechtigt):** die Prüfung ist jetzt automatisch, misst die **gerenderte Geometrie** und steht oben links im Bild.
`lib/kit-lab.js` → `auditWorld()` läuft über die Weltkoordinaten jedes gebauten Teils und prüft sie gegen das Halbmodul-Raster; `auditJoints()` misst bei Ketten den realen Abstand zwischen aufeinanderfolgenden Teilen. Beides greift dort, wo Rechnen mit den Autorenwerten blind bleibt: falscher Pivot, falsche Drehung, falsche Teilevariante. S3 meldet zusätzlich zur Schleifen-Schließung jetzt „N Stöße bündig (max x)".

**Gemessene Bauregeln · KayKit City Builder Bits**

| Fakt | Wert | Konsequenz |
|---|---|---|
| Raster-Modul | **2 × 2** (`road_straight`) | dritter Raster im Bestand: Dungeon 4, KayKit City 2, Kenney 1 |
| Fahrbahndicke | 0,10 | Straße liegt spürbar auf, Requisiten auf y = 0,1 setzen |
| Gebäude **mit** Basis | Platte 2 × 2, Haus darauf | freistehend auf leerem Boden |
| Gebäude **ohne** Basis | Grundfläche ≈ 1,21 × 1,45 | gehört auf eine `base`-Platte; sonst liegen zwei Platten übereinander |
| Straßenteile | `road_straight`, `_crossing`, `road_corner`, `road_corner_curved`, `road_junction`, `road_tsplit` | vollständiges Straßenvokabular, 6 Teile |
| Requisiten | Laterne, 3 Ampeln, Bank, Busch, Hydrant, 2 Mülleimer, Container, 2 Kisten, Wasserturm, 5 Autos | Wasserturm gehört aufs Dach (y ≈ 3,2) |

**Offen (S5)**
- Feinabgleich der Sample-Szene gegen `sample.png` über die Referenz-Blende (Straßenring und Gebäudeanordnung sind interpretiert, nicht pixelgenau abgezählt).
- Stunt Paradise 2 als Dressing-Grammatik.
- Höhenlogik für Rampen/Brücken im Streckengenerator.

---

## S3 · 2026-09-16 · Kenney Racing Kit · Streckengenerator (Kettenlogik)

**Gebaut**
- `Kenney_Racing_Track_S3.html` — Strecke als **Tokenfolge** statt Koordinatenliste. Eingabefeld + Token-Chips + Presets (Oval, Oval weit, Stadtkurs, Slalom, Haarnadel, Rampenkurs), Dressing-Schalter, Draufsicht, Raster, Recipe-Export.
- `lib/track-chain.js` — der Generator. Läuft mit einem Cursor (Anschlusspunkt + Richtung) durch die Folge und leitet jede Position/Drehung aus der gemessenen Bounding-Box des Teils ab.

**Der eine Beweis, den du wolltest:** oben links steht permanent `Kette geschlossen · Lücke 0 · Richtungsfehler 0°`. Passt eine Strecke nicht zusammen, steht dort rot die Lücke in Modulen und der Richtungsfehler in Grad. Kein Augenmaß, kein Suchen.

**Gemessene Bauregeln · Kenney Racing Kit**

| Fakt | Wert | Konsequenz |
|---|---|---|
| Spurbreite / Modul | **1** | gleiches Raster wie City Kit |
| Fahrtrichtung der Teile | lokal **−Z** | Geraden laufen in −Z, nicht in X (anders als City-Straßen!) |
| Pivot | **nicht zentriert** (`roadStraight` x −0,35…0,65, z −1,65…−0,65) | wer auf Tile-Mitte rechnet, baut jede Strecke versetzt |
| Kurven-Footprints | eng 1×1, mittel 2×2, weit 3×3 | Kurvenradius = halber Footprint |
| Kurvenanschluss | rein an der +Z-Kante, raus an der +X-Kante | Default ist eine **Rechtskurve** |
| Linkskurve | dasselbe Teil **rückwärts durchfahren** | kein Spiegeln → Normalen und Randsteine bleiben korrekt |
| `roadStart` | 1,26 × 0,67 × 2 | Torbogen, Länge 2 Module |

**Offen (S4)**
- Dressing ist eine erste Regel (Leitplanken beidseitig, Tribüne alle 6 Teile, Pylonen in Kurven) — Abstände noch nicht an der Stunt-Paradise-Referenz geeicht.
- Höhenwechsel: `roadRamp`/Brückenteile werden noch flach verkettet, y bleibt 0.
- Stunt Paradise 2 als Dressing-Grammatik (Loop, Sägeblätter, Gleise, Canyon) steht noch aus.

---

## S2 · 2026-09-16 · Kenney City Kit · Straßenraster + Blockbebauung

**Gebaut**
- `Kenney_City_Block_S2.html` — 134 Platzierungen, 26 verschiedene Bauteile. Zwei Modi: **Szene** (Straßenkreuz + Blockbebauung) und **Palette** (das komplette Teile-Vokabular eines Packs auf dem Raster ausgelegt, Teil anklicken → Name + gemessene Maße). Das ersetzt die statischen Contents-Sheets durch ein lebendes.
- `scenes/city-block.js` — Recipe in **Modulkoordinaten [i,j]**; das Modulmaß wird zur Laufzeit aus `road-straight` gemessen und eingesetzt. Kein hartverdrahtetes Weltmaß mehr.
- `lib/kit-lab.js` erweitert: sieben Packs (KayKit Dungeon/BoardGame, Kenney roads/commercial/suburban/nature/racing), `.glb` und `.gltf`, Tageslicht- und Dungeon-Stimmung, Render-Fallback für Frames ohne `requestAnimationFrame`.

**Gemessene Bauregeln · Kenney City Kit** (Laufzeitmessung)

| Fakt | Wert | Konsequenz |
|---|---|---|
| Raster-Modul | **1 × 1** (`road-straight`) | Kenney rastert auf 1; KayKit Dungeon auf 4. Nie mischen ohne Skalierung. |
| Fahrbahndicke | 0,02 | Straßen liegen praktisch flach auf y = 0 |
| Default-Achse `road-straight` | läuft entlang **X** | Nord-Süd-Straßen brauchen `r = 90`. Das war der eine Fehler im ersten Durchlauf — im Recipe dokumentiert. |
| Gebäude commercial | ~0,9 × 1,3 × 0,9 bis Hochhaus | passen ins 1er-Raster, Höhe variiert frei |
| Bodenplatte | `tile-low` | 1 Modul, als Blockfüllung unter allem außer Straße |

**Lücke im Bestand (ehrlich, nicht überspielt)**
- **KayKit City Builder Bits liegt nur als ZIP** in `media/3D_Assets/` — nicht entpackt, nicht in der Registry. Ein 1:1 des KayKit-City-Screenshots ist erst möglich, wenn das Pack entpackt im Repo liegt. Bis dahin liefert der Kenney-Straßenbaukasten die Raster-Grammatik.

**Offen (S3)**
- ~~Race Track Builder~~ → in S3 gebaut.
- Seitenleiste ist jetzt ausblendbar (S2 + S3); Pack-Wechsel schaltet direkt in den Palette-Modus.
- Stunt Paradise 2: Szenen-Dressing-Referenz (Loop-Rampe, Sägeblätter, Gleise, Herbstbäume, Canyon) → Dressing-Grammatik für Travel/Stunt.

---

## S1 · 2026-09-16 · KayKit Dungeon Pack · Key-Art 1:1

**Gebaut**
- `KayKit_Dungeon_Room_S1.html` — lauffähige 3D-Szene, 69 Platzierungen, 40 verschiedene Bauteile, Key-Art-Blick + Draufsicht + Raster + Referenz-Blende + Recipe-Export.
- `scenes/dungeon-promo.js` — Scene Recipe: jede Platzierung ist Rasterkoordinate + Rotation, replaybar.
- `lib/kit-lab.js` — Loader/Viewer: Asset-Cache (jedes Bauteil wird einmal geladen, danach geklont = instanziert), Laufzeitmessung jeder Bounding-Box.
- `tools/measure.html` — Messbank: Bauteil rein, Maße raus.
- `tools/registry-probe.html` — Registry-Abfrage (13.000 Assets, Pack-Listen, Raw-URLs).

**Gemessene Bauregeln · KayKit Dungeon 1.1** (Laufzeitmessung, keine Schätzung)

| Bauteil | Maß (x × y × z) | Regel |
|---|---|---|
| `floor_tile_large`, `floor_wood_large`, `floor_dirt_large` | 4 × 0,15 × 4 | Raster-Modul = **4 Einheiten**, Pivot zentriert, Oberkante y ≈ +0,05 |
| `floor_tile_small` | 2 × 0,15 × 2 | halbes Modul |
| `wall`, `wall_doorway`, `wall_gated`, `wall_shelves` … | 4 × 4 × 1 | Wandmitte sitzt **auf** der Modulkante; Unterkante y = 0 |
| `wall_corner` | 2,5 × 4 × 2,5 | Pivot außerhalb der Mitte (−0,75 / +0,75) → Ecken separat setzen |
| `column` | 0,7 × 1,4 × 0,7 | Dekor, nicht raumtragend |
| `table_medium` | 2 × 1 × 2 | Tischplatte y = 1 → Requisiten auf y = 1 |
| `chair` | 0,75 × 1,23 × 0,75 | |
| `barrel_large` | 1,8 × 2 × 1,8 | |

**Raumgrammatik der Key-Art** (aus dem Bild gelesen, im Recipe hinterlegt)
- 4 Räume, je 2 × 2 Module (8 × 8 Einheiten).
- Zwei Blöcke à 4 × 2 Module, gegeneinander um ein Modul versetzt → die Z-Silhouette.
- Schnittansicht: Wände nur Nord/West/Ost + Trennwände, Südseite offen.
- Mittelband = Südwand des oberen Blocks ist gleichzeitig Nordwand des unteren.

**Herkunft**
- Assets: `georg-doc/kayfabizarro` · `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/` · raw @ main · CC0 Kay Lousberg.
- Referenzbild: `uploads/Nz_zk7.png` (KayKit „Dungeon Asset Pack“ Key-Art).
- Asset Registry bleibt Quelle der Wahrheit; dieses Lab ist reiner Leser.

**Offen (S2-Kandidaten)**
- Wandmontierte Teile (`shelf_large`, `shelf_small_candles`, Banner, Fackeln): Pivot-Höhe noch nicht vermessen → aktuell per Auge auf y = 2,4.
- Höhenstufe zwischen oberem und unterem Block (Key-Art zeigt eine Stufe) fehlt.
- Requisitendichte der Key-Art (Bücher, Flaschenreihen, Geschirr) noch nicht ausgereizt.
