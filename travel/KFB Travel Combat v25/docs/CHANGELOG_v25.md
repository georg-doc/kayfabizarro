# Changelog · Travel Combat v25 (additiv nach oben, jede Änderung mit Zahl)

## Naht 179 · Der Renn-Bob, ein eingefrorener Pool und zwei Proben (2026-09-08 · v25.2r)

Drei Punkte aus SPRINT §6 abgearbeitet. Der zweite hat unterwegs einen Fehler freigelegt, der
größer ist als die Frage, die ihn gefunden hat.

**Rennen war Hüpfen — und der Sprint-Eintrag benannte die Ursache falsch.** Dort stand, der Bob
sei „auf Gehen getunt". Gemessen ist er auf Rennen getunt, und genau das ist der Fehler. Die
Kadenz ist `speed / stride`:

| Gangart | Rechnung | Zyklen/s |
|---|---|---|
| Gehen | 5,40 / (2,70 · k) | **2,00/k** |
| Rennen | 9,45 / (4,70 · k) | **2,01/k** |

Maßstabsunabhängig dieselbe Zahl, und mit Absicht: 4,70/2,70 = 1,74 ist bis auf ein Prozent
`sprintMul` 1,75 — die Distanzkopplung hält die Trittfrequenz fest. Beim Sprint änderte sich also
gar nichts am Rhythmus, nur die Höhe: `fast ? 0.09 : 0.06`, **+50 % Ausschlag bei gleicher
Frequenz.** Das ist die Definition eines Pogo-Sticks.

Ein Lauf unterscheidet sich vom Gehen nicht durch Bounce-Höhe bei gleicher Kadenz, sondern durch
die **Flugphase**. Also zwei Änderungen statt einer Zahl: `hang` = 0,62 als Exponent auf `|sin|`
(Wertebereich bleibt [0,1] — Tiefpunkt beim Fußaufsatz und Hochpunkt in der Mitte unverändert, nur
die Verweildauer verschiebt sich nach oben, deshalb keine Mittelwertkorrektur), und die Amplitude
**runter** statt hoch: 0,090 → **0,055**, knapp unter Gehen. Die Energie geht in die Stauchung,
`sqRun` 0,045 → **0,075**. Vier Zahlen in `BOB`, einzeln stellbar über `petKin.setBob(k, v)`,
Kontrollzeile `petKin.bobReport()` — das Urteil ist ein Geschmacksurteil und gehört Georg.

**Der Bodenmodus fror alle Geschosse ein.** Gefunden beim Versuch, die Pool-Zahl zu messen:
`combat.update` steigt bei `isWalk()` aus, und der `return` stand **vor** dem einzigen Aufruf von
`shots.update`. Am Boden nicht zu kämpfen ist Absicht (`kannJetzt` prüft `!isWalk()`) — Geschosse
einzufrieren war keine. Wer mitten im Gefecht landet, nimmt seine fliegenden Schüsse mit hinüber,
und dort bleiben sie stehen: sie belegen den Schuss-Pool (48) und den Sprite-Pool (64) auch nach
dem Zurückwechseln in den Flug, und ab da fällt **jeder** Puff aus. Jetzt wird immer getaktet, am
Boden aber ohne Trefferwelt (keine Hitboxen, kein Spielerziel): die Geschosse fliegen ihre Bahn
aus und verfallen, treffen kann nichts — was der Absicht entspricht. `shots.update` räumt selbst
auf, der Rückgabewert wird deshalb bewusst verworfen.
Dazu: **die Kapselprobe verweigert am Boden.** Sie ruft `feuern()` direkt und umgeht `kannJetzt`,
lieferte also zehnmal 0/10 mit dem Befund „die Hitbox greift nicht" — eine Aussage über einen
Ausstieg, nicht über eine Kapsel.

**Zwei Proben, weil die Messung von außen nicht geht.** Beide offenen Zahlen (Pool-Spitze,
fps @1080p) brauchen ein laufendes Bild, und im Vorschaurahmen ohne Fokus liefert
`requestAnimationFrame` **keine Bilder** — mein erster Sampler zählte über 6 s exakt 0. Ein
Standbild sieht dabei genauso aus wie ein Leck; die erste Fassung dieses Changelog-Eintrags hätte
deshalb eine Zahl behauptet, die nicht gemessen war. Also gehört die Messung in die Seite:

* `combat.poolprobe(n)` — feuert n Augäpfel im Waffentakt und liest **den Zustand** (`shots.belegt`,
  neu in `combat-shots`) je Bild, nicht den Zähler `emitsMax`: ein Zähler überlebt ein Nullen
  nicht, der Pool schon. Nennt Spitze/64, Ausfälle, Kreise je Wurf gegen die gerechneten
  `0,28 × 34 / 0,9 = 10,6` und den Deckel 48.
* `__travelPOC.fpsprobe(sek)` — stellt für die Dauer auf 1920×1080 bei Pixelverhältnis 1, setzt
  danach Größe, Pixelverhältnis und Kamera-Seitenverhältnis zurück, und nennt Median vor Mittel
  (ein Nachlade-Ruckler zieht das Mittel, nicht den Median) plus p95, `drawCalls` und Dreiecke.

**Beide zählen ihre Bilder mit und verweigern das Ergebnis, wenn es zu wenige waren** — dieselbe
Lehre wie bei der Kapselprobe (§2): eine Null, die zwei Ursachen haben kann, ist keine Messung.

## Naht 178 · Kollision und Sprung (2026-09-06 · v25.2q)

Der Verdacht in SPRINT_v25.md war halb richtig — die Einzelpunkt-Probe war Fehler 1, aber sie
erklärt das Steckenbleiben nicht.

**Kollision.** `free()` fragte „ist das Ziel begehbar", geprüft an EINEM Punkt 0,55 u voraus. Eine
Säulenecke, die 40° schräg vor der Mitte steht, liegt im Körper, aber nicht auf der Probe: das Pet
fährt mit der Schulter hinein. Und dann kam es nicht mehr heraus, und **das** war der eigentliche
Fehler: steht die Mitte in der Säule, ist die Umgebung in *jeder* Richtung unbegehbar — auch nach
hinten. Es gab keinen Satz für „bereits drin", und ein Zustand ohne Ausweg ist kein
Kollisionsfehler mehr, sondern eine fehlende Regel.
Zwei Änderungen: (1) geprobt wird eine **Führungskante** aus drei Punkten (geradeaus ± 55°,
`bodyArc`) — zwei Bodenabfragen mehr je Bild, dafür blockt eine Ecke, bevor sie im Körper liegt.
(2) Steht die Mitte in etwas, gilt: **jeder Schritt erlaubt, der die Bodenhöhe nicht erhöht.**
Monoton — der Weg hinaus geht garantiert bergab — und nicht zum Klettern brauchbar, weil aufwärts
gerade das Verbotene ist.

**Sprung.** Ein Zahlenfehler: `jumpV: 14.5` bei `gravity: 30` ergibt einen Gipfel von 14,5²/60 =
**3,5 u**. Der Auto-Hop nimmt Stufen bis `autoJumpMax` = **4,2 u** und rechnet seine
Absprunggeschwindigkeit dafür aus (16,88 u/s). Wer eine 4,2-u-Stufe ansprang, kam nicht hoch —
während Hineinlaufen *ohne Taste* sie genommen hätte. **Die Taste war schwächer als Nichtstun.**
Jetzt wird `jumpV` aus derselben Formel abgeleitet, die der Auto-Hop benutzt: 16,88 u/s, Gipfel
4,75 u = `autoJumpMax + hopClear`. Nachgemessen im laufenden Stand. Ein übergebenes `jumpV`
gewinnt weiter.

**Dritter Fund am Rand.** `stepMax` (1,5) ist zahlengleich mit der Terrassenstufe des Geländes
(CELL/2 = 1,5 u) — eine Terrasse landete exakt auf der Grenze, und Rundungsrest entschied je Bild
neu, ob sie begehbar ist oder einen Hop auslöst. Dieselbe Toleranz (0,01) in **beiden** Vergleichen
legt sie eindeutig auf die begehbare Seite; das war das Zappeln an Terrassenkanten.

## Naht 177b · Die Treppe war das Texelraster (2026-09-06 · v25.2q)

Georg (07.26): „die Kanten der Voxel flackern und haben Pixel-Fehler an den Rändern." Es sind
nicht die Voxel: der Renderer läuft mit `antialias: true` und der Post-Pass zeichnet direkt auf den
Schirm — echte Silhouetten sind geglättet. Was treppt, ist die im Shader berechnete Schattengrenze.

**Die Stufen.** Die vorige Fassung summierte 3×3 `step()`-Vergleiche. Ein `step` ist eine
Entscheidung je Texel: das Ergebnis kann nur zehn Werte annehmen und springt an jeder Texelgrenze.
Bei 0,0234 u/Texel und Kamera 9 u davor ist ein Texel ~6 Bildpunkte — genau die Stufenhöhe im Bild.
Mehr Taps machen die Treppe breiter, nicht weicher. Jetzt wird **zwischen** den Texeln gelesen:
vier bilinear gemischte Blöcke im Abstand von je einem Texel (16 Lesevorgänge statt 9) ergeben
einen stetigen Verlauf über ein Texel statt einer Stufe.

**Das Flackern.** Zweite Hälfte, und sie gehört dem Wirt: die Sonne wurde stufenlos auf `F.pos`
gesetzt, das Texelraster der Ortho-Schattenkamera rutschte damit jedes Bild um einen Bruchteil
eines Texels unter der Welt durch, und jede Kante quantisierte in jedem Bild anders. Jetzt rastet
der Mittelpunkt in den **Achsen der Lichtkamera** auf ganze Texel ein (Tiefenachse stufenlos, sie
geht nicht ins Raster ein). Der Sprung von bis zu einem Texel gegen die Bewegung ist unsichtbar —
ein Texel ist genau die Auflösung, in der der Schatten überhaupt existiert.

## Naht 177 · Der Versatz gehörte an die Normale, und das Gelb war ein Lichtfaktor (2026-09-06 · v25.2p)

Zwei Befunde Georgs, beide vier Runden alt, beide an einer Stelle repariert, die vorher nicht
angesehen wurde. Die Boxgröße aus Naht 176 bleibt unverändert — sie war nicht das Problem.

**Schatten-Clipping an Pet und Props.** Drei Zahlen, gemessen in der laufenden Sitzung:
Sonnenabstand 70 u, Tiefenbereich der Schattenkamera 20…150 u, Terrain-Bias 0,0016. Der Bias ist
ein **Anteil des Tiefenbereichs** — 0,0016 × 130 = **0,208 u Weltmaß**. Das Pet ist 1 u hoch: sein
Kontaktpunkt lag um ein Fünftel der Körperhöhe neben seinem Schatten, und weil der Versatz in der
Tiefe liegt, kippt er an jeder Stufe auf einmal. Das ist die harte Kante in seinem Bild.
Ersetzt durch einen **Normalenversatz in Weltmaß**, bemessen an der Texelgröße der aktuellen Box
(1,6 Texel: 0,0375 u bei ±24 u, 0,0625 u bei ±40 u) — er verschiebt den Abfragepunkt von der
Fläche weg, nicht den Körper von seinem Schatten. Der Resttiefenbias sind 0,03 u, ausgedrückt im
Tiefenbereich der jeweiligen Kamera (0,00023 am Boden, 0,00015 im Flug), und **mit der Neigung
skaliert** (×1…4): Luft nur, wo die Sonne streift.

**Und der eigentliche Prop-Fehler:** `sun.shadow.normalBias` stand auf **0,6 Weltmeter**. Ein
Baumstamm hat rund 0,2 u Durchmesser — die Schattenabfrage landete vollständig neben dem Stamm,
und an jeder Kante sprang sie mit der Normalen. Die Props sind seit v24 Empfänger
(`prop-scatter.js`), also traf es sie voll: das sind die Masken, die der Geometrie folgen statt
dem Licht. Jetzt **0,04** — knapp über einem Texel der Bodenbox (0,0234 u), weit unter jeder
Prop-Dicke. `shadow.bias` von −0,0006 auf **0**: ein negativer Tiefenbias zieht Richtung Akne und
arbeitete gegen den Normalversatz.

**Würfelfarbe.** Der Hexwert war die ganze Zeit richtig — gemessen: Pet-Körpermaterial `#d3a244`,
`cfg.color` `#d3a244`, `slotDice.farbeIst()` `#d3a244`. Drei gleiche Zahlen, zwei verschiedene
Gelbs im Bild. Also war die Suche an der falschen Stelle: nicht der Wert, sondern was die
Würfel-Leinwand daraus macht. Jetzt gemessen statt gerechnet — ein 1×1-Probebild einer weißen,
kamerazugewandten Fläche unter genau diesen Lampen ergibt **0,580**: die Würfel rendern den
Albedowert bei 58 % seiner Helligkeit. Der Kehrwert (**Skala 1,723**) geht auf alle drei Lampen,
und das vom Wirt übernommene Tonemapping (v25.2f) fällt weg — Tonemapping ist für
Szenenleuchtdichten, hier wird eine Farbprobe gezeigt. Danach trägt die kamerazugewandte
Würfelseite **exakt** den Avatar-Hexwert, die schrägen Seiten dunkler. `slotDice.lichtprobe` nennt
Probe und Skala; Skala 1 heißt: Probe fehlgeschlagen, Farbe wieder Verhandlungssache.

## Naht 176 · Die Frage war falsch gestellt (2026-09-06 · v25.2n)

Vierte Runde an der Schattenbox — und die drei davor scheiterten an derselben unausgesprochenen
Annahme: daß die Box den sichtbaren Boden decken KÖNNE, wenn man nur den richtigen Abstand
einsetzt. Gemessen ist das ausgeschlossen: Kamera-Pitch 0,42 rad, halber Öffnungswinkel 0,506 rad
→ die obere Frustumkante liegt bei **−0,086 rad**, also über dem Horizont. Der sichtbare Boden
reicht von 3,8 u bis zum Horizont; eine 2048er Karte deckt ihn nie. **Es gibt immer einen
Verlauf** — die einzige echte Frage ist, wo er am wenigsten weh tut, und die beantwortet die Welt,
nicht die Kamera.

Gemessen: **3162 Props**, Bäume 3,4–8,8 u hoch; im Ring 12,3–24 u um einen Punkt stehen **17**, im
Ring 24–45 u **87**. Ein Verlauf bei 12,3 u (v25.2m) schneidet mitten durch das Nahfeld, in dem
Georgs Bilder Bäume zeigen — genau sein Befund. Bei 21,1 u liegt er hinter diesen 17 und dort, wo
ein Schatten im Bild schon klein ist. Also: **Boden 24 u aus der Prop-Dichte**, darüber skaliert der
Kameraabstand weiter (kein Deckel, das bleibt aus Naht 175 richtig).

Zweiter Fehler derselben Naht: die 2-u-Stufung benutzte `Math.round` und rundete damit UNTER die eben
berechnete Anforderung — aus 14,77 wurden 14, die 4 u Nahfeld-Zugabe schrumpfte still auf 3,32.
Jetzt `Math.ceil`: eine Stufung darf ein Ergebnis nie unterschreiten.

Nachgemessen über alle Fälle: POV 0,5 → ±24 / 0,0234 / ab 21,1 · Vorgabe 9 → ±24 / 0,0234 / ab 21,1
· ausgezoomt 20 → ±28 / 0,0273 / ab 24,6 · Pet 3,2 u bei 28,1 → ±38 / 0,0371 / ab 33,4 · extrem 62
→ ±76 / 0,0742 / ab 66,9. **Alle gedeckt, keiner unterschreitet die Anforderung**, und bei der
Vorgabe ist es 1,67-fach feiner als der Flugwert 0,0391. Berichtigt auch die Behauptung aus Naht
175, das Texel/Abstand-Verhältnis sei konstant: das gilt nur ÜBER dem Boden — im POV bindet der
Boden, und dort ist es 20-fach grober (richtig so, im POV sieht man den eigenen Schatten kaum).

## Naht 175 · Der Deckel widersprach seiner eigenen Ableitung (2026-09-06 · v25.2m)

Dritte Runde an derselben Stelle, und diesmal war der Fehler struktureller Art: die Obergrenze
`Math.min(24, …)` aus Naht 174 deckelte genau die Rechnung, deren Zweck es war, die Kamera zu
decken. Im Modus „Pet-Größe messen" (Maßstab 3,12) setzt `petBodenMass` den Kameraabstand auf
**28,1 u** — der gedeckelte Verlauf begann bei 21,1 u, also **7 u vor der Kamera**, und die Logzeile
meldete trotzdem Erfolg. Ein Deckel, der eine Bedingung verletzt, statt sie zu erfüllen, ist keine
Sicherung, sondern ein stiller Widerspruch.

**Eine Entscheidung statt einer weiteren Zahl:** die Box kommt aus dem TATSÄCHLICHEN Kameraabstand
(`walk.state.cam.dist`), nicht aus dem theoretischen Zoomweg, und sie hat keine Obergrenze. Der
Zoomweg ist eine Möglichkeit, der Abstand eine Tatsache — und weil die Box bei Änderung neu gesetzt
wird, folgt sie dem Zoom, statt für ihn vorzuhalten (2-u-Stufen, damit ein Zoomzug keine
Projektionsmatrix je Bild baut).

Gemessen über alle Fälle: POV 0,5 u → ±14 u / 0,0137 · Vorgabe 9 u → ±14 u / 0,0137 · voll
ausgezoomt 20 u → ±28 u / 0,0273 · Pet 3,2 u bei 28,1 u → ±36 u / 0,0352 · extrem 62 u → ±76 u /
0,0742. **Jeder Fall deckt seine Kamera.** Der letzte ist grober als der Flugwert 0,0391 — und das
ist richtig so: weil die Box proportional zum Abstand wächst, bleibt das Verhältnis
Texel/Betrachtungsabstand konstant (0,0015 · 0,0013 · 0,0012), der Schatten sieht also in jeder
Zoomstufe gleich scharf aus. Das ist der eigentliche Grund für diese Quelle: eine feste Box kann nur
für einen Abstand stimmen. Logzeile und Panel-Zeile sagen jetzt ausdrücklich „gedeckt" oder „NICHT
GEDECKT", damit eine Box nie wieder stillschweigend behaupten kann, sie trage die Kamera.

## Naht 174 · Die Schattenbox kommt aus dem Kameraabstand (2026-09-06 · v25.2l)

Korrektur an Naht 172, vom Verifier ausgerechnet. Die Schärfe-Rechnung stimmte, der Preis war
ungeprüft: bei **±12 u** beginnt der Randverlauf bei 0,88 × 12 = **10,6 u** — und die Kamera steht
**9 u** hinter dem Pet, bei voller Zoomweite 20 u. Alles, worauf der Spieler schaut, hätte damit
keinen Sonnenschatten mehr; Bäume und Props behalten ihr `castShadow`, aber es empfängt sie nichts.
Derselbe Fehler wie der stehende Farbkreis aus Naht 170 — nur wandert dieser mit.

Zwei Zahlen statt einer, weil es zwei Anforderungen sind:
· **Die Box wird abgeleitet, nicht geraten:** sie muß den vollen Zoomweg (`walk.params.maxD` = 20 u)
  plus 4 u Nahfeld tragen, bevor der Verlauf einsetzt → `(20 + 4) / 0,88 = 27,3`, gedeckelt auf **24**
  (darüber fällt die Schärfe unter den Gewinn: 24 u → 0,0234 u/Texel, 28 u → 0,0273, also nur noch
  1,4-fach besser als der Flugwert). Ändert sich der Zoomweg, geht die Box mit.
· **Der Randverlauf rückt nach außen** (0,80 → 0,88 der Box): nutzbar sind 88 % statt 80 %. Er wird
  dadurch steiler (2,8 u statt 4,7 u bei dieser Box), liegt aber jenseits des Nahfeldes — und ein
  Verlauf im Nahfeld ist ein wandernder Ring.

Gemessen am geladenen Stand: Box **±24 u**, **0,0234 u/Texel** (1,67-fach feiner als 0,0391),
Pet-Schatten **44 statt 25 Texel**, Verlauf **21,1…23,9 u** — also hinter dem letzten Punkt, den die
Kamera einnehmen kann (20 u). Nicht die 85 Texel des ersten Versuchs, aber 85 Texel auf einem
Körper, dessen Umgebung schattenlos ist, sind kein Gewinn. Panel-Zeile „Schattenschärfe" nennt jetzt
auch den Verlaufsbeginn und den Kameraabstand.

Nebenbei entfernt: `sun.shadow.needsUpdate` (existiert an `LightShadow` nicht — der Schalter heißt
`renderer.shadowMap.needsUpdate`) und ein `setSunShadow`-Aufruf, den die Bildschleife zehn Zeilen
weiter unten ohnehin je Bild macht.

## Naht 173 · Rot war ein Mech (2026-09-06 · v25.2k)

Nachtrag zu Naht 172, vom Verifier gefangen: der Tint war nie die Ursache von Georgs Bild. Seine
Würfel waren **rot** — und rot ist weder die Pet-Basis (#d3a244) noch die getönte Fassung
(#c28b3c), sondern eine **Mech-Signaturfarbe** aus dem Roster.

Die Kette: Standard-Avatar ist `random`, der beim Start einen Mech lädt; nur `avatar('pet')` entsorgt
ihn. Der Wechsel in den Bodenmodus tut das nicht, `mech` bleibt also liegen — und `avatarFarbe()`
gewann, sobald er nur EXISTIERT (`mech && mech.grundfarbe != null`). Auf dem Bild läuft das Pet, in
der Leiste liegt der Mech. Laufzeitprobe: `{mode: "fly", mechActive: true, petCfg: "#d3a244"}`.

Die Regel, welcher Körper zu sehen ist, stand schon eine Zeile weiter unten
(`pet.object3D.visible = isWalk() || !mech`). Sie steht jetzt EINMAL als `petSichtbar()` und wird von
beiden gelesen. Genau die doppelte Fassung derselben Regel ist der Grund, warum dieser Fehler
zweimal auftrat: v25.2e über den Pet-Zweig, jetzt über den Mech-Zweig. Die Tint-Entfernung aus
Naht 172 bleibt — sie war unabhängig davon richtig.


## Naht 172 · Drei Messungen in Georgs laufender Sitzung (2026-09-06 · v25.2j)

Alle drei Befunde wurden am laufenden Bild GEMESSEN, nicht erschlossen — der Prüf-Frame rendert
nicht, die Sitzung des Nutzers schon.

**Das Zittern war mein eigener Fehler aus v25.2f.** Gemessen: `inner.scale.y / bs` springt jeden
Frame zwischen **1,15542** und **0,86549**, 22 Vorzeichenwechsel in 24 Bildern. Das Produkt beider
Werte ist **1,00006** — der Fingerabdruck von `xₙ = 1 / xₙ₋₁`, also genau der Division in
`fremdAtem`. Die Absicht (nicht den eigenen Wert zurücklesen) war richtig, das Mittel falsch: wenn
der Mixer die Skala mit einem ABSOLUTEN Clip-Wert überschreibt, ist `ist / letzt` kein Atem, sondern
eine Rückkopplung mit Periode 2. Nach einem Sprung multiplizieren `elastic` und `stepSq` mit — aus
Zittern wird Flackern, dasselbe Vorzeichen, größerer Ausschlag. Jetzt ein VERGLEICH ohne
Rückkopplung: steht unser eigener Wert noch da, hat niemand geschrieben → Atem 1; steht etwas
anderes, ist es der absolute Fremdwert. Nachgerechnet läuft die neue Folge auf konstant 1, die alte
auf 1,335 → 1,155 → 0,865 → 0,749 → 0,865 → …

**Das Verpixeln ist eine Bemessung, keine Fehlfunktion.** Gemessen: Ortho-Box **±40 u** (80 u) auf
**2048 px** = **0,0391 u je Texel**. Ein Pet von 1 u Höhe wirft damit **25 Texel**, und die
Walk-Kamera steht 9 u davor — ein Texel wird zu etwa 6 Bildpunkten. 80 u Box sind für den Flug über
Reisehöhe bemessen, wo derselbe Schatten 40 Bildpunkte groß ist. Am Boden jetzt **±12 u** = **0,0117
u/Texel** (3,3-fach feiner, 85 statt 25 Texel); die Reichweite von 12 u trägt der Randverlauf aus
v25.1d, es entsteht also keine Kante. Dazu die Tiefe: near 1 / far 200 sind 199 u Bereich, während
zwischen Sonne und Boden höchstens 120 u liegen — der ungenutzte Bereich kostet
Vergleichsgenauigkeit, und ein marginaler Tiefenvergleich kippt ganze Flächen auf einmal (das sah
wie Clipping an Würfelkanten aus). Am Boden 20…150 u. Neue Panel-Zeile „Schattenschärfe" nennt Box,
Texelmaß und Texel je Pet.

**Die Würfelfarbe zeigt die BASISFARBE.** Gemessen: Pet-Basis **#d3a244**, Story-Tint **#8f3a5f** bei
0,18 → die Mischung aus v25.2f ergibt **#c28b3c**, ein dunkleres, rötlicheres Gelb als das Tier.
Georgs Satz „ist nicht Pet/Avatar BASE color" ist wörtlich der Vertrag. Es ist auch die richtige
Regel: die Würfel-Leinwand hat eigene Lampen, ausdrücklich damit „3D sichtbar" nicht von der
Weltbeleuchtung abhängt — ein Weltlicht-Effekt auf einem Körper außerhalb des Weltlichts ist eine
halbe Kopie. `slotDice.farbeIst()` gibt die liegende Farbe als Hexwort heraus: „falsche Farbe" ist
damit ein Vergleich zweier Zahlen.


## Naht 171 · Die Frage war falsch, nicht die Zahl (2026-09-06 · v25.2i)

Korrektur an Naht 170, vom Verifier gefangen, bevor Georg es getroffen hätte. Die Diagnose des
Zitterns stimmte, der Hebel war falsch — **zweimal**:

· **Dem Walker die Scheibenprobe zu geben** war falsch, weil er diese eine Funktion für VIER Dinge
  benutzt. `walkable()` prüft mit ihr die neue MITTE gegen `stepMax` 1,5: steht eine 4,2-u-Säule
  irgendwo im 0,62-Radius, lautet der Test `y >= y + 2,7` und ist immer falsch. Bei Körperradius
  0,55 parkt die Kollision die Mitte 0,55–0,6 u vor der Wand, also innerhalb der Scheibe — das Pet
  wäre an der ersten Wand in **jeder** Richtung festgefroren, auch rückwärts. Zusätzlich hätte
  `rise = 4,2 >= stepMax` es die Wand hochgetragen statt daneben stehen zu lassen.
· **Nur die Schwelle anzuheben** (0,06 → 0,35) hätte es auch nicht behoben: an einer Kante ist der
  Unterschied eine ganze Stufe, 4,2 u. Die Rettung hätte weiter gependelt, nur mit größerem
  Ausschlag.

Richtig ist, die **Frage zu trennen**, weil es zwei sind: *Wann* retten heißt „steckt das Pet in
Geometrie?" — eine Frage über seine MITTE, denn nur dort kann es in einer Säule stehen (Punktprobe,
Schwelle 0,35 u gegen Rauschen). *Wohin* retten heißt „wo kann es sicher stehen?" — eine Frage über
den KÖRPER, also `safeGroundAt`. An einer Kante ist die Mitte auf ihrer eigenen Fläche, die
Bedingung damit falsch, und das Pendeln kann dort nicht mehr entstehen. Der Walker behält die
Punktprobe für Kollision, Stufe und Auto-Hop: niemand rechnet mit einer fremden Zahl.

## Naht 170 · Ein Schatten, eine Höhe (2026-09-06 · v25.2h)

**Zwei Schatten-Befunde, ein Objekt.** Georgs „runder Fake-Blur-Schatten" und „wieder der
Clipping-Bug beim 3D-Schatten" sind dieselbe Sache: `uCast0`, die Werfer-Scheibe aus S15. Sie ist
rund und weich (Befund 1), und weil der Terrain-Shader sie auf „die Fläche, die wirklich da ist"
projiziert, bricht sie an jeder Höhenkante hart ab (Befund 2) — genau die Kante, an der das Pet in
beiden Bildern steht. Ihr Existenzgrund steht im Kopf von `ground-shadow.js`: „das Pet wirft
längst, aber **nichts empfängt**". Seit v24/S4 ist das falsch — das Terrain liest die Schattenkarte
der Sonne, und der eckige Schatten im zweiten Bild IST dieser echte Wurf. Es lagen also **zwei
Schatten auf einem Körper**, einer davon falsch. Am Boden ist die Scheibe jetzt aus, sobald eine
Schattenkarte vorliegt; ohne Karte (erster Frame, Schatten aus) bleibt sie als Näherung. Der Flug
behält sie: dort wirft die Karte, sie liegt flach und hoch, und ihre Kante ist der Fleck selbst.
Neue Panel-Zeile „Schattenquelle" sagt, welches System gerade liegt — die Verwechslung war der Fund.

**Das Idle-Zittern: zwei Höhenzahlen im Zweikampf.** Der Walker bekam `groundHeightAt` — EINE Probe
in der Mitte —, danach richten sich Schwerkraft und Bodenkontakt. Der Wirt prüfte danach mit
`safeGroundAt(…, 0.62)`, dem HÖCHSTEN Punkt im Körperumkreis, und hob per `floatTo`, sobald das Pet
0,06 u darunter lag. An einer Kante ist die zweite Zahl größer als die erste: der Wirt hebt auf die
hohe Nachbarsäule, die Schwerkraft zieht zur tiefen Mitte, nach 0,06 u hebt der Wirt wieder — bei
Float-Rate 5 u/s **rund 12 ms je Hub**, also ein Zittern in jedem Bild, und zwar genau am Rand, wo
das Pet in Georgs Bildern steht. Ein Körper mit Radius steht auf der höchsten Fläche unter diesem
Radius (das nimmt die Auto-Hop-Probe längst an). Der Walker bekommt jetzt diese Funktion, die
Rettung prüft nur noch echtes Steckenbleiben (Schwelle **0,35** statt 0,06). Die zwei Zahlen können
nicht mehr auseinandergehen — statt daß eine Dämpfung den Streit verdeckt.


## Naht 169 · v14 hatte recht (2026-09-06 · v25.2g)

**Das Boden-Movement geht zurück auf den geeichten Zustand.** Georgs Urteil: „in v14 besser."
Der Diff sagt, warum das kein Gefühl ist: `walk-controller.js` ist in v14 und v25 **zeichengleich**
(bis auf mein `setCamDist`) — der Unterschied lag allein in meinen Zahlen. Und v14 geht auf:
**5,4 u/s ÷ 2,7 u je Zyklus = 2,00 Zyklen/s**, genau der native Takt des Walk-Clips (0,50 s). Der
eingebaute 2,7-Wert war nie eine Schätzung, sondern auf den Clip-Takt geeicht. Meine Clip-Messung
(0,3731 u) liegt um **Faktor 7,2** darunter und kann nicht denselben Weg zählen — was sie auch
misst, es ist nicht Fußweg je Zyklus in Weltunits. Solange das unklar ist, gilt die geeichte Zahl.

Zurückgestellt: Schrittquelle **eingebaut**, Schrittfaktor **1,0**, Gangart-Eichung **aus**,
Bodenmaßstab **1,25 fest**. Nicht zurückgenommen, weil richtig: die `groupK`-Kopplung der
Schrittlänge (jetzt gegen die Referenzgruppe 1,25 normiert, damit sie bei der Vorgabe **exakt v14**
ergibt und bei 3,2 u verhältnisgleich mitwächst), die Squash-Rückkopplung und die Läufer-Ruhezone.
Die 3,2-u-Rechnung bleibt als Schalter „Pet-Größe messen" erreichbar.

**Würfel & Gear sitzen wieder tief.** v25.2f hatte `#tv-meta` in den Bodenstapel gerechnet — das ist
aber die **Hover-Aufschrift** (`opacity: 0`, unten links, 48 px Zweizeiler), nie die Zeile über den
Würfeln. Sie hob die Leiste um ihre ganze Höhe: gemessen ~88 px Sockel statt 12. Jetzt trägt der
Stapel nur den einzeiligen Zonen-Streifen: 8 px Rand + gemessene Höhe + 4 px Luft ≈ **30 px**. Das
ist das Minimum, das die Zeile freihält — der Preis dafür, daß sie unter der Leiste steht, ist eine
Zeilenhöhe, nicht mehr. Die rAF-Füllung der Aufschrift bleibt (sie war durch den Boot-Wettlauf
leer, also zeigte der Hover nichts).


## Naht 168 · Vier Befunde, drei echte Fehler (2026-09-06 · v25.2f)

**Der Farbkreis nach der Landung.** Das ist die Ruhezone 0 (`terrain.setCalm`), ein Kreis um das
Fahrzeug, in dem die Cubes stillstehen. Der Kommentar in `voxel-terrain` sagt seit v16, wie es
gemeint war — „Zone 0 folgt dem Fahrzeug (Walk: der Läufer)" —, gesetzt wurde sie aber nur in
`stepFly`. Live nachgemessen: nach der Landung stand sie mit **Radius 26 u, Betrag 1,0** auf der
Landekoordinate. Weil der Bob in die Helligkeit eingeht, ist eine stehende Ruhezone ein sichtbarer
Farbkreis, dessen weicher Rand am Bob der Nachbarcubes flimmert. Jetzt folgt sie dem Läufer.

**Das Flackern des Pets im Bodenmodus.** Eine Rückkopplung: die Kanonregel von `pet-kinetics` liest
den Atem der Bibliothek aus `ch.inner.scale.y` zurück und multipliziert den eigenen Squash darauf —
aber im Bodenmodus ruft der Wirt `motion.stopLoops()`, die Bibliothek schreibt nichts, und die
Funktion las **ihren eigenen Wert vom Vorbild**. Jedes Bild erneut mit `wSq · wPhase · stepSq ·`
`floatSq` multipliziert: eine geometrische Folge, die (weil `stepSq` beim Gehen fast immer < 1 ist)
in den Anschlag 0,66 wandert und dort gegen die Klemme zittert. Behoben, ohne die Kanonregel zu
brechen: der geschriebene Wert wird gemerkt und herausgeteilt — schreibt die Bibliothek doch, ist
das Verhältnis genau ihr Atem.

**Trippeln statt Gehen.** Kein Fehler, sondern die Eigenschaft des Clips, jetzt mit Zahl: sein
Fußweg je Zyklus ist **1,34 u** bei einer Figur von 3,2 u — **0,42 Körperlängen je Zyklus**, wo ein
Gehzyklus etwa eine trägt. Distanzgekoppelt heißt das zwangsläufig hohe Kadenz (5,4 u/s → 4,0
Zyklen/s). Es gibt nur zwei Hebel, und beide sind ein Tausch — deshalb sind beide jetzt sichtbar:
ein **Schrittfaktor** (1,35 voreingestellt: größere Schritte, dafür 35 % Rutsch) und eine
**Gangart-Eichung**, die das Tempo aus Schritt × Clip-Takt rechnet (2 Hz gehen, 4 Hz rennen) statt
es zu setzen. Der Sprint hat einen Deckel von ×2,6: der Renn-Clip trüge 14,5 u/s, und das ist in
einer Welt mit 4,2-u-Stufen kein Rennen mehr.

**Das Gelb.** Zwei Ursachen. Der Story-Tint: `pet-lighting` mischt mix(base, base × tint, 0,18) in
die Diffuse des Pets — die Würfel zeigten die REINE Grundfarbe (#d3a244), also ein anderes Gelb als
das Tier daneben. Jetzt dieselbe Formel aus derselben Uniform. Und die Farbpipeline: die
Würfel-Leinwand ist ein eigener Renderer und hatte eigene Voreinstellungen für Tonemapping,
Belichtung und Farbraum; jetzt übernimmt sie die des Wirt-Renderers. Der Mech bleibt ungetintet —
seine Signaturfarbe ist in jeder Welt dieselbe (v24).

**Und die Zeile über den Würfeln.** v25.2e hatte das falsche Element gesenkt: `#tv-meta` hat live
**0 Kinder und 0 × 0 px** — der Füll-Block lief einmalig, während im DC das Markup noch nicht im
Strom war (in index.html steht es vorher, deshalb fiel es dort nie auf). Jetzt wartet er per rAF,
wie es `findStage` längst tut. Danach stehen beide Textzeilen UNTER der Leiste, Höhen gemessen —
eine leere Zeile ist 0 px hoch, und dann steigt die Leiste auch nicht für sie.


## Naht 167 · Vier Handgriffe am Rand (2026-09-06 · v25.2e)

**Würfelfarbe folgt dem Avatar — auch dem Pet.** Georg: „gelbes Bunny mit rosa Würfeln." Zwei
Fehler in einer Zeile: `avatarFarbe()` gab ohne Mech das Kartenpapier zurück (die Begründung, das
Cube-Pet habe „keine Farbe, die für es steht", war falsch — jedes Pet trägt seine in `cfg.color`),
und der Pet-Zweig von `avatar()` rief `faerben` überhaupt nicht: die Würfel behielten die Farbe des
vorigen MECHS, daher Rosa. Jetzt kommt die Farbe vom Pet, und ein Zahlenvergleich im Bildtakt
fängt auch den Pet-Tausch ohne Avatar-Wechsel.

**Meta-Zeile unter die Leiste.** Die Reihenfolge kippt: Streifen, Leiste, Zeile am Bildrand. Der
Sockel der Leiste ist dafür eine Variable geworden (`setSockel`) — die Zeile bekommt 10 px vom Rand,
ihre Höhe wird gemessen, die Leiste steigt um Höhe + 16. Das HUD entscheidet das nicht selbst: es
kennt die Zeile nicht, und ein HUD, das fremde Elemente umsetzt, wäre ein zweiter Schreiber auf
deren Lage (dieselbe Regel wie Naht 162).

**X landet wirklich.** Der Befund war echt: `travel-input` macht X seit S86 zum Landebefehl („sinken
UND bremsen"), aber der Modus-Wechsel lief über den Antragsgrund `altitude` — und den lehnt seit v15
die Regel `höhe-abgeschaltet` ab (`autoMode` aus). X sank, bremste, setzte auf, und nichts geschah.
Aufgelöst nach der Doktrin des Modus-Eigentümers („die Höhe schlägt vor, die Hand will"): eine
gehaltene X-Taste bekommt den eigenen Grund `x-landung`, den nur die Sperrfrist ablehnt.
`autoMode` bleibt aus — wer ohne X aufsetzt, fliegt weiter.

**Kein Tab-Rahmen auf den eigenen Bedienteilen.** Eine Regel, die NUR innerhalb HUD, Zahnrad und
Panel gilt (das Overlay hat dafür eine id bekommen), nicht global. Vertretbar, weil jede Aktion
dieser Leiste einen Tastenweg hat (1/2/3, F, X, Esc): es geht nur das Rechteck verloren, kein
Bedienweg.

**Sky-Dice abgenommen** (Georg: „sehen okay aus") — Naht 164 bleibt, wie sie ist.


## Naht 166 · Der Würfel fragt das Zahnrad, wie groß es ist (2026-09-05 · v25.2d)
`gear-icon.js` + `slot-dice.js` + `travel-poc.js`. Naht 164 setzte die Würfelfüllung auf 0,79 —
richtig, aber als KONSTANTE, und sie gilt nur mit geladenem GLB. Fällt das entfernte GEAR_ICON.glb
aus, steht dort das gebaute Zahnrad mit 1,74 Spannweite: der Glyph füllt dann 0,918 der Zelle, und
die Würfel wären **14 % zu klein** statt vorher 20 % zu groß — derselbe Fehler, nur andersherum,
und still. Jetzt meldet das Zahnrad seinen Glyph-Anteil (`glyphAnteil`, aus fov und Abstand
gerechnet statt abgeschrieben) und die Leiste übernimmt ihn — einmal beim Anhängen und noch einmal,
wenn das GLB nachträglich gewinnt.


## Naht 165 · Das Pet war zu klein für seinen eigenen Gang (2026-09-05 · v25.2d)
`travel-poc.js` + `pet-kinetics.js` + `walk-controller.js` + `settings-schema.js`. Georgs offener
Punkt „das Pet läuft zu schnell für seine Größe" — nachgerechnet zeigt die Rechnung auf die
GRÖSSE, nicht auf das Tempo.

**Die Zahlen** (am laufenden Modul abgelesen, `schrittReport()`). Gemessen sind **0,3731 u je
Zyklus** (auf REF_K normiert; 0,9146 Modelleinheiten). Beim Referenz-Pet und dem alten Bodenmaßstab
1,25 sind das **0,466 u je Zyklus** bei einer Figur von **1,0 u** Höhe. Bei 5,4 u/s müßten die Beine
also **11,6 Zyklen/s** laufen — fast das Sechsfache der Taktzahl, für die der Clip gebaut ist
(0,5 s = 2 Hz). Anders gesagt: 5,4 Körperlängen je Sekunde. Kein Tempo-Problem — eine Figur dieser
Größe kann das nicht gehen.

*Korrektur derselben Naht:* die erste Fassung dieses Eintrags rechnete mit 1,8293 u — das ist die
Zahl VOR der REF_K-Normierung, also doppelt. Der Fehler stand im Text und in zwei Kommentaren, nie
im Code. Nachgemessen und richtiggestellt.

**Zweiter Fund im selben Zug:** `sizeK` kam allein aus `_baseS` und kannte den Gruppen-Maßstab des
Bodenmodus nicht. Die sichtbaren Füße legten 25 % mehr Weg je Zyklus zurück als die Zahl, mit der
der Zyklus gekoppelt wird — ein Rutsch, den keine Messung zeigte, weil die Messung die Gruppe nicht
kannte. Eine Schrittlänge ist eine Länge: sie skaliert jetzt mit `_baseS × Gruppe`. Bob und Ducken
ebenso (beides Längen am Körper), die Weltmaße `stepMax`/`autoJumpMax` nicht — die beschreiben einen
Würfel von 4,2 u.

**Die Entscheidung.** Zielhöhe am Boden = **3,2 u**, die gemessene Mech-Höhe. Der Maßstab wird
daraus gemessen (Bounding-Box bei Maßstab 1), nicht gesetzt: **3,90**; Radius 1,72, Augenhöhe 4,37,
Kameraabstand 28,1 gehen verhältnisgleich mit. Schrittlänge damit **1,456 u je Zyklus**, Kadenz bei
unverändertem Lauftempo **3,7 Zyklen/s** — im lesbaren Band (1,2–4,5), aber an seinem oberen Rand,
nicht in der bequemen Mitte. Das ist die Zahl, die aus dem Clip folgt; **kein Gefühlswert wurde
geraten**. Liest es sich in Bewegung als Strampeln, gehört die Korrektur ans Lauftempo (Regler
daneben), nicht an die gemessene Schrittlänge. Ein Regler „Pet-Höhe am Boden" (0,8–4,5 u)
zeigt neben dem Wert die Körperlängen je Sekunde; die bestehende Zeile „Was das heißt" nennt Kadenz
und Rutsch live.

**Vorgabe umgestellt:** die gemessene Schrittlänge ist jetzt der Standard. Sie ist eine echte Länge
je Zyklus und skaliert mit dem Körper; der eingebaute 2,7-u-Wert war auf Maßstab 1,25 getunt und
würde bei 3,2 u Figur (Maßstab 3,90) **10,5 u je Zyklus** behaupten — rund siebenfacher Rutsch. `?stride=eingebaut` geht zurück.


## Naht 164 · Maße und Tiefe (2026-09-05 · v25.2c)
Vier Befunde von Georg.

**„Würfel ca 20 % zu groß gegenüber dem 2D-Gear."** Nachgemessen am Zahnrad: sein Bild ist bei
fov 34 und z = 3,1 **1,895 Einheiten** hoch, das eingepasste GEAR_ICON.glb spannt **1,5** — der
Glyph füllt also 0,79 seiner Zelle. Der Würfel füllte 0,94; 0,94 / 0,79 = **1,19**, genau Georgs
Schätzung. Füllung jetzt 0,79, beide Zeichen teilen dieselbe Zahl.

**„Sky-Dice zu groß und wirken näher als die Sky-Cards."** Zwei Ursachen. Größe: 32 u auf 360 u
Abstand = **5,1°**, eine Himmelskarte 11 u auf 150 u = **4,2°** — das fernere Objekt war das
größere im Bild, damit ist Entfernung nicht lesbar. Jetzt 26 u = 4,1°. Tiefe: die Würfelmaterialien
standen auf `fog: false`, die Karten auf `fog: true` — es fehlte die Luftperspektive, das eine
Merkmal, an dem man ohne Bewegung Tiefe liest. Nicht mit threes Nebelschalter behoben (bei Fern 520
frisst er auf 360 u rund 63 % der Farbe, der Kanon rot/gelb/blau wäre weg), sondern mit einem
eigenen Anteil `nebel` = 0,34: die Grundfarbe wandert zur Horizontfarbe, das Leuchten wird um 0,7
davon gedämpft. Die Horizontfarbe kommt vom Wirt (`setNebel`), wo sie entsteht.

**„Schüsse ohne Target könnten eine Farbwelle auslösen."** Eingebaut als **vierter Auslöser** neben
Aufsetzen, Karte durchflogen und Farbwelt-Wechsel — dieselbe Regel: Ereignisse, kein Metronom. Nur
eigene Schüsse ohne angewähltes Ziel (`frei`), am Einschlagpunkt (nicht unter dem Spieler, das wäre
über den Ort gelogen), Farbe = Kontrastfarbe der Farbwelt (nicht die Waffenfarbe: rote Rakete auf
rotem Sand war Naht 133). Sperre **0,45 s**, weil Dauerfeuer 9 Schuss/s macht und es acht
Wellenplätze gibt — ohne Sperre überschriebe eine Salve alle acht. Schalter in den Einstellungen,
Zähler in der Statuszeile.

**Reichweiten-Anzeige am Slot-Würfel** — von Georg für später vorgemerkt, steht in SPRINT_v25.md.


## Naht 163 · Schräge Würfel, kurzer Vorhalt (2026-09-05 · v25.2c)
`slot-dice.js` + `combat-host.js`. Zwei Befunde von Georg, beide dieselbe Fehlerart: eine
Annahme, wo eine Messung hingehört.

**„Die Würfel sind noch unterschiedlich ausgerichtet."** Naht 162 baute eine volle Basis und war
damit auf dem richtigen Weg — legte die sechs Seiten aber auf die WELTACHSEN des GLB. Der
Ugur-Würfel steht in seiner Datei schräg; damit war jede der sechs Richtungen nur die nächste
Achse, nicht die Flächennormale, und der Restwinkel war je Seite ein anderer. Schlimmer noch: die
achsenweise Normierung (1/sx, 1/sy, 1/sz), die die nicht-würfelige Box korrigieren sollte, ist bei
einem schräg stehenden Körper eine **Scherung** — die Seiten waren nicht mehr quadratisch, und
keine Pose kann sie dann gleich aussehen lassen. Jetzt werden die Würfelachsen aus den Dreiecken
gemessen (Normalen nach Fläche gewichtet gruppiert, größte Gruppe = Flächennormale, erste
senkrechte = zweite Achse, Kreuzprodukt = dritte), die Augen gegen diese sechs Seiten gezählt und
die Normierung nur dann achsenweise gemacht, wenn die Achsen weltparallel liegen — sonst EIN
Faktor. Die Bootzeile sagt jetzt beides: Achsenlage (weltparallel oder Winkel) und die drei
gemessenen Kantenlängen.

**„In der Distanz verfehlen alle Nest-Rocket-Schüsse das Ziel."** Zwei entfernungsabhängige
Fehler, deshalb saß es nah und verfehlte fern:
1. **Der Deckel.** Der Vorhalt war bei `Math.min(1.2, t)` abgeschnitten. Bei 34 u/s Relativtempo
   reicht das für 41 u; bei 80 u dauert der Flug 2,35 s, vorgehalten wurde die Hälfte — der
   Einschlag lag rund **30 u hinter dem Ziel**, und der Fehler wächst linear mit der Entfernung.
2. **Die Flugzeit war Anfangsdistanz durch Tempo.** Das gilt nur für ein stehendes Ziel.

Jetzt wird die Abfangaufgabe im Schützenrahmen gelöst: |Δp + Δv·t| = v·t, quadratisch in t,
kleinste positive Wurzel. Gedeckelt wird nur bei der Lebensdauer des Geschosses (3,2 s → Rakete
109 u Reichweite); Schüsse darüber zählt `zaehler.zuWeit`, und die Statuszeile zeigt den letzten
Vorhalt in Sekunden. Weil der Vorhalt jetzt bis 3,2 s statt 1,2 s multipliziert, ist die Glättung
der Zielgeschwindigkeit von 0,3 auf **0,15** gegangen — sonst wandert der Zielpunkt bei 40 u/s
Zielfahrt je Bild um Meter.


## Naht 162 · Das Zahnrad sprang in der ersten halben Sekunde (2026-09-05 · v25.2b)
`combat-hud.js` + `travel-poc.js`. Naht 161 setzte die Flucht im Bildtakt — richtig, aber der
Startwert war der Sockel (12 px), und der Abgleich kommt erst 0,5 s später: das Zahnrad stand kurz
13 px zu tief und **sprang** dann. Ein sichtbarer Fehler in der ersten halben Sekunde jeder Sitzung.
Zwei Zeilen: `reiheUnten` fällt jetzt auf die Unterkante der Reihe zurück, wie sie sich aus den drei
Zahlen des HUD ergibt (12 + 6 + 7 = 25), und das Zahnrad liest sie EINMAL beim Anhängen statt erst
im Takt. Die Messung korrigiert weiter, wenn die Lage anders ausfällt — der Rückfall ist nur der
richtige Startwert. Gemessen direkt nach dem Laden: **Zahnrad 25 px, Reihe 25 px**.


`slot-dice.js` + `combat-hud.js` + `travel-poc.js`. Georgs vier Befunde, alle vier gemessen behoben:

**„Würfel viel zu klein (kleiner als Buttons, kleiner als Gear)."** Beides war wahr: Zelle 40 px
gegen 44 px Zahnrad, und der Würfel füllte nur 0,62 seiner Zelle — rund 25 px. Jetzt Zelle **44 px**
(dieselbe Zahl wie das Zahnrad, eine Maßfamilie) und Füllung **0,94**, also ~41 px. Damit die
geneigten Ecken nicht abgeschnitten werden, ist die Leinwand um 6 px je Seite größer und liegt um
denselben Betrag versetzt — der Rand wird in EINHEITEN umgerechnet, damit px/Einheit waagerecht und
senkrecht gleich bleiben. Gemessen: **44 px je Einheit auf beiden Achsen**, Würfelmitten 437/487
exakt auf den Knopfmitten.

**„Gear & Würfel haben keine gemeinsame Flucht."** Das Zahnrad stand auf 12 px, die Würfelreihe
durch die HP-Leiste darunter auf 25. Das HUD gibt jetzt `reiheUnten` heraus, das Zahnrad liest es.
Erfragt statt addiert: die HP-Leiste ändert ihre Höhe, wenn jemand am Rand dreht, und eine
ausgerechnete Konstante wäre dann still falsch. Gemessen: **beide auf 25 px**.

**„Würfelaugen besser weiß/paper."** Umgesetzt. Der Grund ist nicht Kontrast auf dem Papier,
sondern wo die Augen liegen: in einer eigengeschatteten Vertiefung, in der dunkle Augen mit dem
Schatten verschmelzen und bei 44 px verschwinden.

**„Würfel sollten die gleiche Ausrichtung zur Kamera zeigen."** Der eigentliche Fund: erste Fassung
nahm `setFromUnitVectors` — die bringt die gewünschte Seite nach vorn, wählt die **Rolle um die
Blickachse aber beliebig** (kürzeste Drehung). Im Bild stand deshalb einer auf der Fläche und der
Nachbar auf der Ecke: beide „richtig", zusammen schlampig. Jetzt wird eine VOLLE Basis gebaut — die
gewählte Seite nach +Z, eine deterministisch gewählte Würfelachse nach +Y. Die Lage ist damit
vollständig bestimmt, und der Unterschied zwischen zwei Slots ist NUR die Augenzahl. Was der ganze
Sinn der Idee war.

## Naht 160 · Das Geschoss erbt die Fahrt des Schützen (2026-09-05 · v25.2)
`combat-shots.js` + `combat-host.js`. Georgs Befund: „mit der Sekundärwaffe (Nest Rocket) sechsmal
nacheinander am Ziel-Enemy vorbeigeschossen" — und derselbe Fehler war in Mech Slice v1/v2 schon
dokumentiert. Er ist **gerechnet, nicht Gespür**:

| | |
|---|---|
| Rakete | 34 u/s |
| Reisetempo | bis ~40 u/s |
| Aggro-Mob | hängt 26 u VOR dem Spieler und fliegt **mit** ihm |

Ohne Erbe war die Rakete im Weltrahmen 34 u/s schnell, das Ziel aber 40 — Annäherungsrate
**−6 u/s**. Sie fiel zurück und konnte NIE treffen, egal wie gut gezielt war. Der Stinger (78 u/s)
netto +38 u/s trifft, deshalb fiel es nur an der Sekundärwaffe auf.
In einem Flugzeug trägt eine abgefeuerte Rakete die Fahrt des Flugzeugs. Genau das fehlte:
`vel = dir × speed + erbe`. Damit ist `w.speed` die Geschwindigkeit RELATIV zum Schützen — so, wie
die Waffenzeile sie immer gemeint hat.
**Zweiter Fehler, der sich mit dem ersten verstärkt hat:** der Vorhalt nahm die WELT-Geschwindigkeit
des Mobs. Weil Aggro-Mobs mit dem Spieler fliegen, war das fast seine eigene Fahrt — der Vorhalt
zeigte rund 30 u VOR den Mob, während die Rakete ihn ohnehin nicht einholte. Er rechnet jetzt im
Schützen-Rahmen (`__vel − spielerVel`), aus derselben Quelle wie das Erbe, damit die beiden nicht
auseinanderlaufen können.
Gemessen nach dem Fix: Spieler 9 u/s, Geschoss im Weltrahmen **43 u/s** (= 34 + 9),
Annäherung gegen ein mitfliegendes Ziel **34 u/s** — genau die Zahl der Waffe.
Gilt für alle eigenen Geschosse, also auch für Würfel (30 u/s) und Augapfel (34 u/s), die dasselbe
Problem hatten.

## Naht 159 · Eine Lücke zu viel im Ortho-Frustum (2026-09-05 · v25.2)
`slot-dice.js`. Verifier-Fund: `halbB` rechnete `breiteN × (1 + gap/slot)` — also **N Lücken statt
N−1**. Die Leinwand war korrekt bemessen, das Frustum nicht, und damit passten Pixel und Einheiten
nicht zusammen. Zwei Folgen, und beide treffen genau das, worauf das Konzept steht:
**der Würfel war 4,5 % schmaler als hoch** (bei einer Form, deren ganze Pointe eine quadratische
Fläche mit zählbaren Augen ist), und die äußeren Würfel saßen neben ihrer eigenen Trefferfläche.
Der Fehler wuchs mit der Slot-Zahl — bei 6 Slots rund 4–5 px Drift.
Gemessen nach dem Fix, bei 2 · 3 · 6 Slots: **40 px je Einheit waagerecht wie senkrecht** (der
Würfel ist wieder würfelig), und jede Würfelmitte liegt exakt auf ihrer Knopfmitte
(2: 439/485 · 3: 416/462/508 · 6: 347…577).


`mech-avatar.js`. Erste Fassung von `grundfarbe` wählte das gesättigteste Material und bekam
**#ffffff** — richtig gerechnet, falsche Quelle: die Space-Kit-Mechs tragen ihre Farbe in einem
Textur-Atlas, ihre Material-Farbe ist weiß. `MECHS` führt jetzt eine **deklarierte** `farbe` je
Mech (Fernando pink `#ef5a9c`, Barbara Bienengelb, Rae Rotbraun, Finn Froschgrün), am Modell
abgelesen. Ein Pixel-Abgriff auf dem Atlas wäre möglich, hängt aber an CORS und an einem Bild, das
im ersten Bild noch nicht dekodiert ist — vier Zahlen mit ihrer Herkunft sind ehrlicher als eine
Sonde, die manchmal antwortet. **Findet die Messung doch ein gesättigtes Material, gewinnt sie**
(Schwelle 0,12): die Deklaration ist der Rückweg, nicht die Wahrheit. Gemessen: `#ef5a9c`.

## Naht 157 · Die Action-Slots SIND Würfel (2026-09-05 · v25.2)
`slot-dice.js` (neu) + `combat-hud.js` + `combat-host.js` + `travel-poc.js`.
Georgs Idee: Ugur-3D-Dice in Button-Größe, Farbe = Base Color des Avatars, Augenzahl = Slot,
Cartoon-Deformer für Hover/Klick/Cooldown. Umgesetzt mit seinen vier Festlegungen:
**Ruhelage** langsames Atmen als WELLE (Phasenversatz 0,7 rad je Slot ≈ 0,1 s Nachlauf — man liest
eine Welle, kein Metronom), Floating, frontal aber 3D sichtbar (Neigung 10°/11°: darüber überlagern
sich die Augen bei 40 px und die Beschriftung geht verloren).
**Abklingzeit** = Deckkraft des ganzen Würfels, Boden 0,18 (ganz weg hieße „gibt es nicht" statt
„lädt noch").
**Ohne GLB: nichts** — keine Ersatzform, keine Zifferntaste. Ein Ersatzwürfel ohne Augen würde eine
Zahl behaupten, die er nicht zeigt.
**Zahnrad unten rechts**, 44 px, auf derselben 12-px-Grundlinie wie die Reihe.
Drei Bauentscheidungen mit Begründung:
1. **Ein Renderer für die ganze Reihe.** Sechs Würfel als sechs Kontexte wären sechs WebGL-Kontexte
   (Browser deckeln bei ~16). Eine Leinwand, eine Ortho-Kamera, eine rAF — und ein Pickup-Würfel
   kann später IN seinen Slot fliegen, weil alle in derselben Szene stehen.
2. **Die Leinwand zeichnet nur.** Geklickt wird weiter auf die DOM-Knöpfe (Trefferfläche 40 px,
   Tastatur, Titel, Fokusring); ein Canvas, das Klicks selbst verteilt, wäre ein zweiter Eingabepfad.
   Der Knopf ist dafür unsichtbar geworden: kein Rahmen, keine Füllung, kein Zeichen — der Würfel
   IST der Knopf.
3. **Welche Seite wieviel Augen hat, wird GEMESSEN.** Das Ugur-GLB sagt es nicht, und Raten wäre
   hier besonders dumm, weil es die Beschriftung ist: die Pupillen-Vertices werden nach dominanter
   Achse auf die sechs Seiten verteilt, die Vertex-Zahl ist der Augenzahl proportional, die
   Rangfolge gibt 1…6. **Die Messung prüft sich selbst** — Gegenseiten müssen sich auf 7 summieren,
   und `zeile()` sagt „SCHIEF", wenn nicht. Gemessen: plausibel.
Der 2D-Silhouetten-Maler aus Naht 152 ist damit **entfernt** (3 588 Zeichen) — zwei Zeichensysteme
für dasselbe wären eine Wahrheit zu viel.

## Naht 156 · Selbstheilung als TEST-Modus, Vorgabe an (2026-09-05 · v25.1d)
`combat-host.js` + `settings-schema.js`. Georgs Auftrag: „HP recovery/self-heal als (default für
testing) Modus ergänzen." **12 HP/s, erst nach 1,6 s ohne Treffer.**
Die Vorgabe steht bewusst auf AN, und die Begründung steht im Code, damit sie nicht eines Tages als
Spielbalance gelesen wird: wer eine Waffe, eine Trefferreaktion oder ein Größenverhältnis ansehen
will, darf nicht alle zwei Minuten im Burnout stehen — ein Prototyp, der den Prüfer tötet, wird
seltener geprüft. Die Verzögerung ist der Teil, der es trotzdem zu einem Spielwert macht: **niemand
heilt im Feuer**, jeder Treffer setzt die Ruhephase zurück. Dieselbe Grammatik wie die HP-Leiste,
die mit dem Kampf erscheint und nach ihm geht.
Gerechnet: 100 HP in 8,3 s zurück; ein Gegnerschuss macht 4–11 Schaden bei ~6 s Feuerrate je
Körper, drei aggro Körper liegen also knapp über der Heilung — der Kampf bleibt verlierbar.
Kein zweiter Schreiber auf `hp`: die Heilung läuft nur, wenn Burnout und Erholung nicht laufen.
Gemessen: 100 → 60 nach `schaden(40)`, nach 3 s Ruhe 78 (18 HP geheilt).

## Naht 155 · Der Mech drehte im Idle-Flug — ein Fahrzeug schaut nicht zurück (2026-09-05 · v25.1d)
`pet-facing.js` + `travel-poc.js`. Georgs Befund, und er war ein Fehler von Naht 150: der Mech
pendelte im langsamen Flug rechts/links.
Ursache: die Zuwendung hat ZWEI Quellen — `blend` (Neugier, an das Tempo gekoppelt und im langsamen
Flug voll offen) und `arrive` (die Ankunftsregie an einer Karte). Die Kamera schwebt und wippt, also
wandert `yawToCam` dauernd; ein Körper, der der Neugier folgt, pendelt mit.
**Für das Pet ist genau das gewollt** — es schaut zurück, es hat einen Mund. Ein Fahrzeug nicht.
Neu `zuwendungRegie`: derselbe Winkel, skaliert mit dem Regie-Anteil an der Mischung — im freien
Flug 0, an der Karte ganz. Weiter EINE Zahl, kein zweiter Apparat, keine Anpassung je Avatar.
Gemessen im Reiseflug: `zuwendungRegie === 0`.

## Naht 154 · Der HUD besitzt den unteren Bildrand, der Text weicht (2026-09-05 · v25.1d)
`combat-hud.js` + `travel-poc.js`. Georg: „action buttons & HP weiter nach unten."
Naht 149 hatte die Leiste über ihre Nachbarn GEHOBEN — richtig gegen die Überschneidung, falsch
gegen den Wunsch. Also die andere Richtung, und sie ist die ehrlichere: die Leiste bleibt unten
(12 px), **Meta-Zeile und Zonen-Streifen legen sich darüber**. Begründung über Geschmack hinaus:
beide sind Auskunft für den AUTOR (Seed, Welt, Palette, Lektion), Slots und HP sind Auskunft für den
SPIELER — streiten zwei Dinge um dieselbe Kante, gewinnt das, was man im Spiel braucht.
Das HUD gibt nur seine Höhe heraus (`hoehe`); verschoben wird von deren Eigentümer, dem Runner. Ein
HUD, das fremde Elemente umsetzt, wäre ein zweiter Schreiber auf ihrer Lage.
Gemessen: Dock 12 px vom Rand, HUD-Höhe 65 px, Streifen auf 71 px, Meta auf 91 px — keine
Überschneidung, und die Leiste sitzt so tief wie möglich.

## Naht 153 · Die Kante der Schattenkarte war eine Linie im Bild (2026-09-05 · v25.1d)
`voxel-terrain.js`. Georgs Befund („Clipping beim Asset-Schatten"), Ursache **gemessen**: die
Schattenkamera ist ein Ortho-Kasten von **80 × 80 u** (±40), die Kamera sieht bis ~520 u. Wo der
Kasten endet, sprang `sonnenSchatten()` von voller Deckung auf null — eine gerade Kante quer über
den Boden, die keiner Geometrie entspricht.
**Nicht ein größerer Kasten:** 2048 px auf 80 u sind 25,6 px/u, auf 160 u nur 12,8 — der Preis wäre
ein grober Schatten ÜBERALL, um eine Kante am Rand zu verstecken. Stattdessen läuft der Schatten in
den letzten 20 % des Kastens aus (`smoothstep(0.80, 0.995)`). Dann gibt es keine Kante mehr, sondern
einen Verlauf — und ein Schatten, der in der Ferne verschwindet, ist ohnehin das, was Dunst und
Nebel dort tun.

## Naht 152 · Slot-Zeichen: das Zeichen IST das Geschoss (2026-09-05 · v25.1c)
`combat-hud.js` + `combat-host.js`. Georgs Frage nach „gestalteten Icons aus einem Guss".
**Die Library geprüft, nicht vermutet:** 400 RPG-Icons liegen dort (`media/2D_Assets/RPG Icons`),
am Kontaktblatt angesehen — Schwerter, Äxte, Bogen, Helme, Rüstungen, Ringe, Runen, Tränke,
Edelsteine. **Kein Gewehr, keine Rakete, kein Augapfel, kein Würfel.** Ein Mittelalter-Set neben
einem Sci-Fi-Mech ist aus einem Guss, aber aus dem falschen.
Der Weg, der wirklich aus einem Guss ist: jede Waffe hat im Spiel schon eine Silhouette und eine
Farbe (`kfb-combat-def` AMMO, M11 „Silhouette vor Farbe"), und `combat-shots` zeichnet sie so. Der
Slot malt **dieselbe Form in derselben Farbe mit derselben Tuschekante** — der Knopf ist nicht die
Illustration von etwas, er ist dasselbe Ding kleiner, und ein neues Geschoss bringt sein Zeichen von
selbst mit. Nur Primitive (Kreis, Rechteck, Dreieck, Ring), nichts Gezeichnetes.
Abbildung je MUNITION, nicht je Waffe: `streak→komet · dart→salve · slug/bolt→strahl ·
glob→klumpen · scrap→streu · rocket/shell→rakete · eye→auge · die→würfel`. Gemessen im Bild:
`w1/komet/#ffe89a · w2/rakete/#b8361f · karte/karte/#f3ead3`, drei Canvas in der Reihe.
Der Buchstabe bleibt als Rückweg, wenn eine Form fehlt — ein sichtbarer Rückweg ist besser als ein
leerer Knopf.

## Naht 151 · HP-Leiste bündig bei drei Slots (2026-09-05 · v25.1c)
`combat-hud.js`. Georg: schmaler, bündig bei 3 Buttons. 270 → **132 px** (3 × 40 + 2 × 6), und die
Breite bleibt FEST — das war seine erste Vorgabe und gilt weiter. Der Sockel trägt damit die Mitte,
die äußeren Slots stehen über: das liest als Aufbau statt als Rahmen.

## Naht 150 · Der Mech folgt der Zuwendung — eine Zahl, kein zweiter Apparat (2026-09-05 · v25.1c)
`pet-facing.js` + `mech-avatar.js` + `travel-poc.js` + `combat-host.js`.
Georg: „der Mech macht die Drehung des Pet zur Kamera nicht mit; zudem verdeckt er die Karte zu
stark, könnte tiefer floaten, die Beine müssen nicht sichtbar sein." Und die Frage dahinter: wie
geht das KISS, ohne alles umzubauen oder je Avatar zu finetunen?
**Ursache:** die Drehung wohnt in `pet-facing` und schreibt `pet.object3D.rotation.y` — sie gehört
dem PET, nicht dem Sitz. Der Mech sitzt daneben und hat davon nie erfahren.
**Der KISS-Weg:** `pet-facing` gibt seine Zuwendung als **Delta von der Ruhelage** heraus
(`zuwendung`), und jeder Körper im Sitz addiert sie auf seine eigene Ruheausrichtung. Ein Eigentümer
der Zahl, keine zweite Kurve, und ein dritter Avatar-Typ bräuchte nichts als diese eine Zeile.
`yaw` absolut zu übernehmen wäre falsch: darin steckt die Ruhelage des Pets (`base`), der Mech hat
seine eigene (`vorne`) — genau dieser Versatz wäre der Fehler, den man je Modell „nachstellen" müßte.
**Tiefe:** neu `sitz: −0.55` (dauerhaft, das untere Sechstel verschwindet unter der Kartenkante — die
Beine tragen keine Aussage) und `tauchDock: 1.1` (zusätzlich während der Ankunftsregie, multipliziert
mit `arrival.dockK`, dem Fortschritt, den der Wirt schon führt — keine zweite Uhr).
Der Mech wird dadurch NICHT kleiner: seine Silhouette im Kampf bleibt die gerechnete 3,2 u.


`combat-hud.js` + `travel-poc.js`. Verifier-Fund, und dieser Slice hat ihn erzeugt: die neue
HP-Leiste (y 516–522) schnitt sich mit der Meta-Unterzeile (`#tv-meta`, bis y 526) auf **116 von
270 px — 43 % der Leiste lagen unter fremdem Text**, und der Zonen-Streifen (`bottom:10px`, ganze
Bildbreite) läuft durch dieselbe Zeile. Vor dem Slice lag die HP-Leiste oben; die Kollision ist neu.
**Keine feste Zahl, sondern eine Messung.** `#tv-meta` steht in `themes/kfb-shell.css` (geteilt mit
`index.html`), der Streifen wird vom Runner ein- und ausgeblendet — eine geschriebene Konstante wäre
in einer der Fassungen falsch und beim nächsten Umbau in beiden. Der Sockel legt sich stattdessen
über den höchsten SICHTBAREN Anlieger (`#tv-meta`, `#kfb-strip`), zweimal pro Sekunde nachgerechnet,
mit 10 px Luft und niemals tiefer als der Vorgabewert. Der Streifen hat dafür eine ID bekommen.
Gemessen nach dem Fix, mit beiden Anliegern auf Deckung 1: Sockel **18 → 57 px**, HP endet bei
y 483, Meta beginnt bei 493, Streifen bei 513 — **keine Überschneidung**. Ohne Anlieger bleibt der
Sockel bei 18 px, das Bild wird also nicht dauerhaft teurer.


`travel-poc.js`. Verifier-Fund, und es war ein echter Ausfall: `keepAttached` (WIRT_v13 §8) adoptiert
nach einem Template-Neubau alles Eigene zurück — `gear.el` stand nicht in der Liste. Nach dem ersten
Neubau fiel das Zahnrad heraus und kam nie zurück; weil im selben Slice der Tacho-Würfel
abgeschaltet wurde, gab es danach **keinen Zeiger-Weg mehr in die Einstellungen**, nur noch Tab.
Genau die Funktion, die der Slice liefern sollte, war nach ein paar Sekunden weg.
Zweiter Punkt derselben Ursache: `gear-icon.js` setzt keine Größe auf seinen Knopf (in der
Globe-Linie kam `width`/`height` aus `settings-panel.js`, das es hier nicht gibt). Ohne sie hing die
Trefferfläche an der Canvas-Größe. Jetzt `44 × 44` gesetzt statt abgeleitet — es ist die
Mindest-Trefferfläche, die dieses Projekt selbst zitiert. Gemessen nach dem Fix: 44 × 44 px,
16/16 von oben rechts, zwei Canvas im Dokument, `isConnected` true.
**Die Lehre ist die Regel selbst:** wer ein eigenes DOM-Element an die Bühne hängt, muß es in die
Rückadoption eintragen. `combat-hud` löst dasselbe mit einem eigenen `attach()` je Bild.


`settings-overlay.js`. Georgs Befund: „eine komplette Website mit Scrollen und extrem vielen
Parametern — ich komme da überhaupt nicht mehr durch." Gemessen: **rund 200 Regler in 20
Sektionen.** Das ist keine Gestaltungsfrage an einer Stelle, sondern eine Menge, die man durch
Scrollen nicht erreicht.
Der eigentliche Umbau ist nicht das Eingabefeld: **jeder Regler bekommt eine eigene ZEILE.** Vorher
hingen Beschriftung und Eingabe als Geschwister direkt in der Karte — es gab kein Element, das „ein
Regler" bedeutet, und ohne das kann man nichts filtern. Darauf sitzt die Suche: alle Begriffe müssen
vorkommen (UND, nicht ODER), Sektionen ohne Treffer verschwinden ganz, die Trefferzahl steht
darunter. Gemessen am laufenden Panel: `kaykit` → 1 Regler · `gegner größe` → 3 Regler in 1
Abschnitt · Unsinn → `KEIN TREFFER`. Escape leert erst die Suche, dann schließt es.

## Naht 146 · Zahnrad statt Tacho-Würfel (2026-09-05 · v25.1)
`gear-icon.js` (zeichengleich aus `globe-v13/`) + `hud-stub.js` + `travel-poc.js`.
Der Würfel ist aus: er lief nie sauber und stört nach Georgs Befund Immersion und Flug-/Kampfgefühl.
Die Begründung über „gefällt nicht" hinaus: **Tempo soll man an der WELT fühlen** — Speedlines,
Kondensstreifen, Kamera — nicht an einem Zeiger ablesen; eine Anzeige lädt dazu ein, von dem
wegzuschauen, was man steuert. Seine zweite Aufgabe (sechs Seiten = sechs Panel-Sektionen) hat jetzt
das Zahnrad oben rechts, und die ist dort besser aufgehoben: ein Menü muß kein Instrument sein.
**Warum ein Stub und nicht zwanzig Löschungen:** `hud-cube` hängt an 14 Aufrufstellen im Runner.
Der Adapter mit derselben Oberfläche ist EINE Änderung und vollständig zurücknehmbar — `?tacho=1`
baut den echten Würfel wieder, `hud-cube.js` bleibt unangetastet als Vergleichsmaßstab.

## Naht 145 · Das HUD neu: Action-Leiste, HP als Sockel, kein Kopfbereich (2026-09-05 · v25.1)
`combat-hud.js` (Neubau) + `combat-host.js` + DC.
**Raus:** Wortmarke (aus dem Spielbild, nicht aus dem Produkt — sie gehört aufs Einstellungs-Blatt),
Dauer-Pop-Score, HP-Leiste im Reiseflug, Namenszeile an der Zielmarke.
**Neu unten mittig:** Slot-Reihe, darunter die HP-Leiste — **feste Breite 270 px** (Georg
ausdrücklich: sie darf sich nicht ändern, wenn 2–6 Slots sichtbar sind). Damit ist die Leiste der
SOCKEL und die Slots wachsen darauf; eine Leiste, die mit der Slot-Zahl atmet, wäre ein zweites
bewegliches Ding an derselben Kante.
**Die Outline ist repariert:** der alte Rahmen lag als 2 px auf einem Element, dessen Füllung 100 %
Höhe hatte — die Füllung lief unter den Rand, und genau das war Georgs „falsche Outline, da ist
irgendwie eine Lücke". Jetzt `box-sizing:border-box`, 1,5 px, kein Schlagschatten (auf 6 px Höhe ist
ein Schatten ein zweiter Strich).
**HP erscheint mit dem KAMPF, nicht mit dem Schaden** (Georgs Wahl): erster Aggro oder eigener
Schuss, 4,5 s Nachklang, und dauerhaft sichtbar solange HP fehlt. Sonst lernt man, dass es eine
Leiste gibt, in dem Moment, in dem sie schon zählt.
Pop ist nur noch der Steiger am Abschussort: eine Zahl, die sich alle zwei Minuten um eins ändert,
ist kein Instrument, sie ist Möblierung.

## Naht 144 · Zwei Eingaberäume: Slots 1–6 statt nur Maus (2026-09-05 · v25.1)
`combat-host.js`. Slot 1 = Primär, Slot 2 = Sekundär, **vollwertige Eingabe** (Georgs Wahl): Klick
auf den Slot und Taste 1/2 feuern genauso wie die Maus. Der Wert liegt nicht in „mehr Knöpfen",
sondern in der TRENNUNG — der Eingaberaum der Welt (Maus: zielen, feuern, Karten anklicken) und der
der Fähigkeiten (Leiste) sind nicht mehr derselbe Pixel.
**Keine leeren Slots:** die Liste ist gerechnet, nicht geschrieben. Der Kontext-Slot „Karte
ansprechen" (Taste 3) erscheint erst, wenn der Anflug angekommen ist — gelesen aus `dock.docked`
je Bild, nicht über zwei Ereignis-Zuhörer, die auseinanderlaufen können.
Zifferntasten leben im Kampf-Wirt und nicht in `travel-input`: die Leiste gehört dem Kampf, und ein
Tastendruck in einem Eingabefeld ist keine Waffe (INPUT/TEXTAREA/editierbar ausgenommen).

## Naht 143 · Die Karte schluckt den Schuss (2026-09-05 · v25.1)
`combat-host.js` + `travel-poc.js`. Georgs Konflikt: Doppelklick auf eine Sky-Karte gegen
Linksklick = Feuer. Seine Entscheidung: liegt der Cursor über einer Karte, gehört der Klick der
Karte. Warum diese Richtung stimmt: eine Karte ist ein kleines, bewusst angesteuertes Ziel, ein
Gegner ein großes bewegliches — wer auf eine Karte zeigt, meint die Karte, wer feuern will, hat
99 % des Bildes dafür. Und die Waffe hat seit Naht 144 einen zweiten Weg, der Karten nicht kennt.
Geprüft werden Sky-Karten UND Academy-Blätter: eine Regel für die Hälfte ist keine Regel. Die
Prüfung liefert der WIRT (`kartePick`) — der Kampf kennt keine Karten.

## Naht 142 · Warum KayKit die Weltfarbe anders annimmt (2026-09-05)
`prop-scatter.js` + `settings-schema.js`. Georgs Frage: „im Gegensatz zu den Kenney-Assets zeigen
die KayKit-Assets keine oder eine andere Färbung — oder liegt das an den Assets selbst?"
**An den Assets.** Gemessen an den 57 Prop-Materialien im laufenden Stand:

| | Anzahl | Grundfarbe | Textur |
|---|---|---|---|
| Kenney | 44 | im Material (z. B. `#73eddd`) | keine |
| KayKit | 13 | **`#ffffff`** | geteilter 1024²-Atlas |

Der Weltton multipliziert bei **beiden** (die Zeile sitzt vor dem Tonemapping und trifft jedes
Fragment) — nur was er multipliziert, ist verschieden. Eine flache, gesättigte Kenney-Farbe ×
Weltfarbe liest als **Umfärbung**; ein Atlas-Pixel × Weltfarbe liest als leichte Verschiebung, weil
die Textur ihre eigene Palette und ihre eigene gebackene Schattierung mitbringt. Man liest die
Textur zuerst und den Ton danach.
Neuer Hebel, falls sie mitfärben sollen: `texFlat` zieht **nur die texturierten** Teile auf ihren
Helligkeitswert, damit die Weltfarbe bei ihnen dasselbe tun kann. Liegt per Uniform nur auf
Materialien mit Map (`part.hatTex`), sonst dauerhaft 0 — ein Regler darf die Kenney-Farben nicht
heimlich auswaschen. **Vorgabe 0**: die Assets bleiben, wie geliefert.

**Und der Fehler dabei, zum dritten Mal in diesem Projekt:** die erste Fassung schrieb `uTexFlat`
mit Backticks in einen Kommentar INNERHALB des GLSL-Template-Literals. Der Backtick beendet das
Literal, die Datei war ein Syntaxfehler, und das Spiel startete nicht. Die Regel steht im
HANDOVER v25 und gilt weiter: **keine Backticks in GLSL-Blöcken.**


`modules/kfb-combat-def.js`. 21 Körper aus `MonsterPack_Quaternius/MonsterCuteCubes` (Pfad aus
`kfb-asset-library.json` gelesen, nicht geraten). **Alle 21 laden und bestehen die
Rollen-Zuordnung** — Pool jetzt 3 Space-Kit + 17 Monster + 21 Cubes = **41 Arten**.
`air: true` ist keine Notlösung: es sind dieselben Körper, die `schrittmass.json` als „beinlose
Cube-Monster" führt — sie haben **keinen Gehzyklus** (walkHub statt walk), also ist Schweben die
Bewegung, die ihre Clips hergeben. `ready: false` wie bei den 17: das Flag steuert WANN geladen
wird, nicht OB; die Abnahme macht `sky-mobs.ladeGruppe` an echten Clipnamen.
Maße: `h: 1.3` → bei scale 1,05 stehen sie auf 1,37 u, unter dem 1,78-u-Flieger. HP 34, Schaden 6.

## Naht 140 · Gruppen kosten nichts — GEMESSEN (2026-09-05)
`prop-scatter.js`. Georgs Frage: „wenn wir damit Performanz gewinnen, können wir die Gruppen
erstmal rauslassen?" Antwort: **es gibt nichts zu gewinnen.** Drei Läufe, gleiches Fenster, 2,5 s je
Messung:

| Gruppen | Props | Standorte | Draw-Calls | fps |
|---|---|---|---|---|
| 100 % | 2275 | 1417 | 57 | **240,3** |
| aus | 1417 | 1417 | 57 | **235,1** |
| 100 % (Gegenprobe) | 2275 | 1417 | 57 | **231,7** |

Der Unterschied liegt im Rauschen, und der Lauf OHNE Gruppen war nicht der schnellste. Grund:
Gruppen kosten keine Draw-Calls (dieselben InstancedMeshes, nur mehr Matrizen), und 858
zusätzliche Kleinteile sind gegen 2 Mio. Terrain-Dreiecke nichts. Sie bleiben also drin.
Als Regler `P.cluster` (0–1) im Panel — damit ist die Frage jederzeit neu messbar statt neu
diskutierbar.

## Naht 139 · Zielmarke zurückgenommen (2026-09-05)
`combat-hud.js`. Georg: „target-quadrat ist zu dominant → dünnere Linien, kleinere Ecken, keine
Namen/Meta darunter". Feld 44 → **36 px**, Ecken 12 → **7 px**, Strich 3 → **1,5 px**, Textzeile
**entfernt**. Der Rahmen liest als Fadenkreuz statt als Fenster. `setTarget(ndc, label, w, h)`
nimmt `label` weiter an und ignoriert es — das Argument bleibt, damit der Aufrufer nicht bricht,
und eine Zeile im Code sagt, warum nichts passiert.

## Naht 138 · Gegner halten die Kamera frei (2026-09-05)
`sky-mobs.js`. Georg: „enemies fliegen so bzw. durch in die Kamera, dass man im Modell steckt".
Ursache: **kein Körper hier kannte die Kamera.** Im Ruhezustand wandert ein Mob auf seinem Anker,
und der Spieler fliegt mit 40 u/s auf ihn zu — niemand weicht aus. Bei Aggro liegt der Slot 26 u vor
dem SPIELER, aber die Kamera steht dahinter und schwenkt.
Neu `kameraMin: 8` (u): unterschreitet ein Körper diesen Radius um die **Kamera**, wird seine
Ruhelage radial nach außen geschoben — nicht die Anzeige, sonst zieht der nächste Takt ihn zurück
und es flackert. Gezählt wird beides: `zaehler.geschoben` und der kleinste je gemessene Abstand,
beide in der Standzeile. Steigt die Schiebezahl in die Tausende, ist der Spawn falsch, nicht der Radius.

## Naht 137 · Gegner ein Drittel kleiner: scale 1,6 → 1,05 (2026-09-05)
`sky-mobs.js`. Georg: „die enemies sind im Vergleich zum mech ca 1/3 zu groß". Gemessen: Flieger
stand auf 1,70 × 1,6 = **2,72 u** gegen einen 3,2-u-Mech — Verhältnis ×1,18, also kein sichtbarer
Größenunterschied, und im Anflug füllte ein Gegner mehr Bild als der Spieler. Jetzt Flieger
**1,78 u**, Monster 1,68 u, Cubes 1,37 u, Winzling 0,86 u → **Verhältnis ×1,79**. Der Trefferradius
folgt automatisch (`hr` rechnet mit `h × scale`).

## Naht 136 · Der KayKit-Rest + die Felsstufe + das Gras-Kombo (2026-09-05)
`prop-scatter.js`. Set 26 → **38 Modelle**, Draw-Calls 45 → **57**. Kriterium unverändert: jeder
Neuzugang bringt eine Silhouette, die es noch nicht gab.
Neu aus KayKit: `Tree_2_A` (runde Krone) · `Tree_3_B` (hoch, schmal) · `Tree_Bare_1_A` (zweite
Ast-Silhouette) · `Bush_1_C` · `Bush_4_B` · `Rock_1_H` · `Grass_1_A`.
Neu aus dem Platformer-Kit: `RockPlatforms_Medium` · `RockPlatform_Tall` — **die Felsstufe mit
Grasplateau war im Set gar nicht drin**; was Georg eingekreist hat, war ein normaler Fels am
unteren Rand seines Bandes. Die Stufe bringt etwas, das keine andere Form hat: eine Fläche, auf die
etwas steigen könnte.
Gras als **Kombo** (Georgs „rule of three"): `grass_leafs` · `plant_flatTall` · `plant_bushSmall`
dazu. `grass_leafsLarge` ist EIN Halm — allein gesetzt ein Fremdkörper. Weil die Neuzugänge
`small` sind, greift der CLUSTER-Mechanismus von selbst: ein Halm mit zwei kleineren Blättern am
Fuß statt drei gleich großer Halme.

## Naht 135 · Palmen bekommen eine eigene Höhe (2026-09-05)
`prop-scatter.js`. `PROP_SET` versteht ein optionales `h`. Palmen: **3,10 → 5,50 u** (Detailed
Tall) und **3,07 → 5,00 u** (Bend). Das Band der Bäume hätte sie nur auf 3,4 u gehoben — also
gerade auf Mech-Höhe und damit weiter wie eine Topfpflanze neben 8-u-Kiefern. Eine Palme fächert
ihre Krone auf, ihr Band ist deshalb nicht das ihrer Art. Die Ausnahme steht je Modell, nicht im
Band: das Band beschreibt eine Art.

## Naht 134 · Das Höhen-Band fängt nur Ausreißer (2026-09-05)
`prop-scatter.js`. Erste Fassung deckelte `tree` bei 7,0 u und kürzte damit die hohen Kiefern
(8,78 u) und `tree_tall` (8,23 u) — Modelle, die im Bild richtig standen und über die niemand
geklagt hat. Bänder geweitet (tree bis 9,0 · rock bis 3,4 · bush bis 2,6 · small bis 0,95).
Ergebnis: **11 von 38 Modellen korrigiert**, und jede Korrektur ist ein echter Ausreißer statt
Rauschen von 3 %.

## Naht 133 · Die Höhe ist die zweite Bedingung (2026-09-05)
`prop-scatter.js`. Georgs zwei Befunde („Palme ist zu klein", „Blatt ist zu groß") sind **EIN
Fehler**: eingepasst wurde nur die GRUNDFLÄCHE (`TARGET_FP`). Das geht gut, solange ein Modell etwa
so breit ist wie hoch — und schiefgeht garantiert bei allem, was das nicht ist. Gemessen:

| Modell | war | Ursache |
|---|---|---|
| `Grass_2_A_Color1` | **3,44 u** | Halm, Grundfläche 0,23 u → riesiger Faktor |
| `Grass_1_A_Color1` | 1,57 u | dasselbe |
| `tree_palmDetailedTall` | 3,10 u | breite Krone → kleiner Faktor |
| `RockPlatforms_Medium` | 1,15 u | breit und niedrig |

Reparatur ist EINE Regel, kein Modell-Sonderfall: nach der Grundflächen-Einpassung wird die dabei
herauskommende Höhe gegen ein Band je `kind` geprüft und der Faktor nur nachkorrigiert, wenn sie
herausfällt. Die Bänder kommen aus den Maßen, die feststehen (Zelle 3 u · Klippen 6 u · Mech 3,2 u ·
Gegner 2,7 u · Pet 0,82 u). Die Maßtabelle steht in der Bootzeile UND in `props.report().masse` —
beim nächsten „das wirkt zu klein" ist es Zahl gegen Band, nicht Meinung gegen Meinung.

## Naht 132b · Würfelwurf als dritte Waffe (2026-09-05)
`modules/kfb-weapon-dice.js` (von Georg geliefert) + `combat-host.js`. Dieselbe Naht wie der
Augapfel, weniger Last: ein Geschoss, kein Spurenwerk. GLB geladen (`kind: 'glb'`), Ersatzwürfel
greift nur bei 404. Tempo als **Wirt-Wert 22 → 30 u/s**: 22 u/s bei g = 22 tragen `v²/g` = 22 u,
die Feuergrenze liegt bei 30 u — dieselbe Rechnung wie beim Augapfel. Sein `tor()` redet in
`combat.tor()` mit. Sekundär-Auswahl im Panel jetzt dreifach: Rakete | Augapfel | Würfel.

## Naht 132 · Augapfel-Pupille: zwei Konventionen, eine Hülle (2026-09-05)
`combat-host.js`. Gemessen am gebauten Geschoss: Pupillenachse (−1,0,0), Flugrichtung (0,0,−1) —
**90° daneben**, und weil der Wirt um die Flugachse rollt, kreiste sie seitlich um die Bahn statt
vorn zu liegen. Ursache: das Modul baut für einen Wirt, der `−X` nach vorn dreht (`_poseAmmo`),
`combat-shots.fire` dreht `−Z`. Umgerechnet im Wirt (das Modul hat für seinen Wirt recht) und in
einer **Hülle**, weil `fire()` das Quaternion der übergebenen Group per `lookAt` überschreibt.
Dazu: der Körper wird erst gebaut, wenn im Geschosspool Platz ist — `eye.mesh()` klont je Geschoss
zwei Materialien, und ein von `maxSchuss` verworfener Wurf hätte sie nie freigegeben.


`pet-kinetics.js` + `travel-poc.js` + `settings-schema.js`. `ladeSchrittmass()` liest
`schrittmass.json` (23 Pets mit Beinen), rechnet maßstabsfrei um und meldet:
**gemessen 0,3731 u/Zyklus gehen · 0,7488 rennen · eingebaut 2,70/4,70 · Faktor ×7,24.**
Angewandt wird nichts: `setStrideQuelle('gemessen')`, Panel-Schalter oder `?stride=gemessen`.
Begründung in `SPRINT_v25.md` §3 — die Alternative ist rutschen ODER strampeln, und das ist eine
Entscheidung über das Laufgefühl.

## Naht 130 · Augapfel-Spur: Lebensdauer statt Abstand (2026-09-05)
`kreisLeben` 0,36 → **0,28 s** (Wirt-Wert). Nach der Tempo-Erhöhung stieg die Pool-Spitze auf 64/64
und ein Ereignis fiel aus. Gleichzeitig lebende Kreise = `Leben × Tempo / Abstand`; der Abstand ist
der falsche Hebel (0,42 u Geschoß, größere Lücken lesen als Punkte), die Lebensdauer der richtige:
0,28 × 34 / 0,9 = 11 Kreise + 4 Begleiter. Kapselprobe feuert jetzt im Takt der Waffe (1,1 s) statt
in 0,7 s — eine Probe, die dichter feuert als die Waffe kann, mißt einen Fall, den es nicht gibt.

## Naht 129 · Augapfel-Tempo als WIRT-Wert: 24 → 34 u/s (2026-09-05)
`combat-host.js`. Gemessen: Kapselprobe 1/10 auf 24 u → **5/10**. Ein Bogenwurf trägt `v²/g`;
24 u/s bei g = 22 sind 26,2 u, der Aggro-Slot liegt bei 26 u und die Feuergrenze bei 30 u — der Wurf
stand dauerhaft am 45°-Scheitel und damit am empfindlichsten Punkt seiner Bahn. 34 u/s → 52,5 u.
Der Wert steht im Wirt, nicht im Modul: die Schussbahn (Ziel bei 22 u) hat mit 24 u/s recht.

## Naht 128 · Spur-Deckel + Zellabbildung im Sprite-Pool (2026-09-05)
`combat-shots.js`. `fire()` nimmt `mesh` · `spur {schritt, max, mal}` · `huepfer {n, keep, fadeMs, auf}`,
alle optional. Deckel 48 Kreise je Wurf. Gemessen ohne Deckel und mit Plan-Abstand 0,35 u:
**1718 Spurpuffe bei 10 Würfen (172 statt der gerechneten 34), Pool 905× voll.** Ursache: die Spur
läuft die ganze Flugzeit (hier 3,2 s statt 0,62 s auf der Schussbahn), Aufsetzer und Ausrollen mit.
Mit 0,9 u: 472 Puffe, 0 Ausfälle, Spitze 53/64. Dazu Zellnamen der Kit-Module (`smoke`, `shard`,
`splat`, `star`, `burst`, `spark`, `streak`, `puff`) auf die zwei Texturen abgebildet — und `add`
gehört zur Zelle, damit Rauch und Scherben nicht additiv auf hellem Sand clippen.
`emit()` versteht jetzt `spin`, `fade`, `pop`. Zähler neu: `spur`, `huepfer`, `emitsMax`.

## Naht 127 · Kapselprobe nennt Reichweite und Distanz (2026-09-05)
`combat-host.js`. Erster Lauf: **0/10** — und die naheliegende Lesart („Kugel-Hitbox greift bei
Bogenbahnen nicht", der Schussbahn-Befund) war falsch: das Ziel stand auf 148 u, die Wurfbahn trägt
26,2 u. Eine Null mit zwei möglichen Ursachen ist keine Messung. Die Probe wirft mit Schaden null
(sonst fällt der Mob nach dem dritten Wurf) und gibt `{ wuerfe, treffer, distanz, reichweite,
inReichweite, befund }` heraus. `tor()` zählt „außer Reichweite" als NICHT MESSBAR, nicht als Fehler.

## Naht 126 · Der Maßstab: Mech 2,00 → 3,20 u (2026-09-05)
`mech-avatar.js` + `combat-shots.js` + `settings-schema.js`. Georgs Befund („wirkt zu klein
verglichen mit enemy units") in Zahlen: Flieger 1,70 × 1,6 = **2,72 u**, Monster 2,56 u, Mech
**2,00 u** — der Spieler war 26 % kleiner als der größte Flieger. Neu ×1,18 über dem größten
geladenen Gegner. `spielerR` 1,3 → **1,66** (0,52 × Höhe: Brust und Rumpf, nicht die dünnen Beine).
`combat.groessen()` + Panel-Zeile + `tor()`-Grenze ×1,05 — die Zahl kann jetzt falsch werden und
sagt es dann.

## Naht 125 · Mündungsversatz vor die Silhouette (2026-09-05)
`mech-avatar.js` + `combat-host.js`. `muendung(out, dir)`: mit Richtung `rad × 0,9 + 0,18` vor den
Körper, `rad` = halbe größere Grundfläche × Einpass-Maßstab (**gemessen 1,23 u → Versatz +1,29 u**
bei Fernando/Flamingo). Ohne Richtung bleibt es der Brust-Bone — der Burnout-Rauch soll aus dem
Körper kommen. Behebt Georgs „weiße Kreise auf der Rückseite beim Abschuss": additive Sprites mit
`depthWrite: false` an einem Knoten IM Körper sind von hinten sichtbar. Der Wirt addiert den Versatz
dort, wo `dir` vorliegt — nach Vorhalt und ballistischer Lösung, nicht davor.

## Naht 124 · Fork v24 → v25, v11-Slice eingezogen (2026-09-05)
`terrain-v25/` (66 Dateien, 1:1 aus `terrain-v24/`) + `KFB Travel Combat v25.dc.html`.
Aktualisiert (geteilt, v24 liest mit): `modules/kfb-hit-response.js` (Stauchachse in
Körperkoordinaten · HOLD ≥ 0,07 s getrennt vom Hitstop · ein Überschwinger · `gate(vis)` neu ·
`knockScale` 0,55 → **0,9**) und `modules/kfb-combat-cues.js` (Anker `hop`, eigener Debounce für
Folgen). Neu: `modules/kfb-weapon-eyeball.js` · `studio-v3/pet-eye-rig.v5.js` (harte Abhängigkeit) ·
`schrittmass.json` · `modules/kfb-stride-measure.js`.
Nicht eingezogen (PLAN §4): `kfb-fx-sprites.js` · `kfb-mob-locomotion.js` · `kfb-fx-flame.js` ·
Schussbahn-UI. `kfb-weapon-dice.js` ist im v11-Export **nicht enthalten** — offen, nicht abgelehnt.
