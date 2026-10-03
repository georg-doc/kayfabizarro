# RETURN · World Core R2D v0 · eine Insel · 2026-10-03

Seite: `KFB World Core R2D v0 Insel.dc.html` · Code: `KFB_R2D_v0/island.js` · Bilder: `evidence/`
Brief: R2D @ 14a1c55 (PR #328), Schritte 3–5, erster sichtbarer Schnitt. Kein Push.

## Was es ist
Eine schwebende Knet-Insel aus neun unsichtbaren Hexzellen. Sichtbar ist ein einziger Geländekörper mit Oberseite, gerundetem Rand und Unterseite. Darüber läuft eine Straße aus dem Track Core, dazu zwei Häuser, Bäume, Felsen und geplante Plätze für Figuren. Seed 1–4 und vier R2C-Biome sind umschaltbar.

## Status
- **PASS** · Keine sichtbaren Kacheln oder Säulen. Oberseite, Rand und Unterseite sind ein Mesh.
- **PASS** · Straße aus dem Track Core 0.8.1, Prüfungen bestanden. Gelände mit Straßenbett, Damm oder Einschnitt. Auf der Insel niedrige Bordkante, an den Brückenköpfen hohe Brüstung, beides über Parameterkurven des Kerns.
- **TUNE** · Inselform, Farbflecken, Unterseite, Größenverhältnis Straße zu Insel.
- **TUNE** · Haus = KayKit building_A (Golden-Weg v8, auf 9 m skaliert). B2-Fassaden-Owner noch nicht angeschlossen.
- **OPEN** · Figuren fehlen (Register-To-do). Kreuzung, Kreisverkehr, Tunnel, Dreiergruppe, R2C-Vergleich mit gleicher Kamera folgen.

## DECISION
- Insel-Straßen ohne Querneigung (`bankDeg: 0`). Mit der Standard-Neigung (≈ 17°) lag die tiefere Fahrbahnseite unter dem Gelände.
- Fahrbahnmitte und -breite aus den Track-Core-Slots gelesen, nicht geschätzt.
- Masken (Fahrbahn, Gehwege, Plätze, Gebäude, Vegetation, Rand) werden vor der Dekoration berechnet. Bäume stehen nur in »Vegetation«, Felsen nur im Randstreifen.
- Ein Plan aus Höhen- und Maskenfunktion speist Gelände, Raster, Bäume und Häuser.

## TESTED RESULT (Claude-Vorschau)
Seeds 1–3, Biome Burg/Utopia/Dystopia, Ansichten Draufsicht, Mittel, Fahrhöhe, Laufhöhe und Unterseite im Bild geprüft. Drei Fehler im Bild gefunden und behoben: Straßenbett neben der Fahrbahn, Gelände über der geneigten Fahrbahn, zu hohe Leitplanken auf der Insel. fps-Werte in der Seite stammen aus der Vorschau.

## NOT_TESTED
GPU auf Georgs Gerät · Fahrt-Kamera über längere Zeit · Mobil.

## Nachtrag 2026-10-03 · Georgs vier Punkte
1. **Häuser ohne Bodenplatte · erledigt.** Bei building_A fallen alle Dreiecke weg, die ganz auf oder unter der Plattenoberkante y = 0,1 liegen. Das Haus steht mit seiner Unterkante im Gelände (`evidence/v1_lauf_haus_ohne_platte.jpg`).
2. **Joyride-Straßenlook · OPEN.** Quelle gefunden: `KFB_JOYRIDE_J14_…/lab-track/track-look.v5.js` (Knetstrang: Hohlkehle, Randwulst, Bauch, runde Bandenköpfe) auf Track Core v0.12 + `stream-to-three.v5.mjs` @ 927a1b4. Der Strang wird aber innerhalb von `boot()` als ganze Bühne gebaut und ist kein einzeln aufrufbarer Baustein. Ohne Kopie geht es nur auf zwei Wegen: (A) Joyride-Owner stellt den Strang als Funktion bereit (WSA-Aufgabe), oder (B) die Insel wird in die T4-Bühne gesetzt. Entscheidung offen.
3. **Textur-Artefakte und Pixelecken · behoben.** Die Oberseite bekommt jetzt eine 1024²-Farbkarte in Draufsicht (Knetflecken je Pixel, Wege und Plätze als gezeichnete Formen) statt harter Eckfarben. Masken laufen über dieselbe Karte; die Flächen werden in m² ausgezählt.
4. **Hexform · Standard ist jetzt der freie Umriss** aus 6–8 weichen Knetballen. Der Hex-Plan bleibt als Umschalter erhalten, weil R2C-Weltgraph und Brief das Raster als Planungsgrundlage führen. Sichtbar ist es nirgends mehr.

Dazu: Inselstraßen jetzt NARROW (10,8 m) statt STANDARD, und der Brückenkopf endet 6 m hinter dem letzten Inselpunkt (zweiter compileRecipe-Lauf mit gekürztem Endstück).

## Nachtrag 2026-10-03 (2) · Übergänge, Wasser, eine Naturfamilie
- **Übergänge** mit dem Joyride-Patchmuster `kfbBlend` (`road-markings.m1.js` @ 927a1b4, importiert): drei Lagen über den Grasflecken, Fels am Inselrand, Sand an Bankett und Ufer, Pflaster an Plätzen und Wegen. Der harte hellgrüne Randstreifen ist weg; Gras läuft in Punkten in den Fels der Unterseite aus.
- **Teich** am offensten freien Platz, eingesenkt, Wasserfläche in Knete, rund 260 instanzierte Knet-Tröpfchen, zum Ufer hin kleiner und seltener. Maske »Wasser + Ufer«.
- **Natur als eine Familie:** KayKit Forest Nature Pack (Baumform Tree_1 A/B/C, Büsche, Felsen, Gras) und Quaternius-Trittsteine auf den Gehwegen, alle @ 378b209. Die KayKit-Hexagon-Bäume und -Steine sind raus. Bäume stehen in drei Gruppen (Rule of Three), Büsche um die Gruppen, Felsen am Rand, Gras auf den Übergängen.
- Brief an WSA für den Knetstrang als Baustein: `BRIEF_WSA_KNETSTRANG_BAUSTEIN.md`.

## Nachtrag 2026-10-03 (3) · Bach, Schlucht, Wasserfall, Übergänge in drei Größen
- **Übergänge** jetzt in drei Größen aus derselben `kfbBlend`-Funktion: große Flecken, mittlere und kleine Tropfen nach außen, Tropfen der Grundfarbe zurück in die Fläche. Kein Verlauf.
- **Bach** vom Teich zur Inselkante, mäandernd. Er wird so geführt, dass er die Straße kreuzt; dort entsteht eine **Schlucht**, die Straße wird zur Brücke. Häuser und Plätze sind vor dem Ausschneiden geschützt.
- **Wasserfall** über die Inselkante: Knet-Wasserband plus 120 animierte Knet-Tropfen.
- **Stützen** unter der Schluchtbrücke nach dem J14-Rezept (Elefantenfuß, Taille, Bauch, Kapitell). PLATZHALTER: die Form ist aus `track-look.v5.js` übernommen, weil der Strang dort nicht als Baustein abrufbar ist. Wird durch `buildClayStrand` ersetzt (Brief an WSA).
- **Zwischen Inseln** fährt die Straße frei durch die Luft (Georg). Stützen nur, wo das Design sie verlangt: Schlucht, Brücke auf der Insel.
- **Keine Einzelhalme oder Einzelblätter** mehr (Georg). Felsen am Rand jetzt in drei Dreiergruppen, Büsche in Dreiergruppen um die Baumgruppen.
- Quaternius-Trittsteine größer (2,2 m Gruppe, 2,4 m Abstand).

TUNE: Schluchtwände, Wasserfallform, Kameraführung »Bach/Brücke«. Auf manchen Seeds liegt die Kreuzung nahe der Kante; dann sitzt der Wasserfall direkt unter der Brücke (Seed 6).

## Nachtrag 2026-10-03 (4)
- Start jetzt auf Insel #3 (Teich, Bach, Schlucht, Wasserfall). Insel #1 hat keinen Teich, deshalb zeigten »Bach/Brücke« und »Wasserfall« dort nichts.
- Post Mortem Quaternius-Pfadsteine: `POSTMORTEM_QUATERNIUS_PFADSTEINE_2026-10-03.md`.
- Session-ZIP für WSA: `export/kfb-r2d-session-2026-10-03/`.

## Nachtrag 2026-10-03 (5) · Wasserfall und Bachführung neu
- **Wasserfall ohne Band:** Das Bachwasser quillt als kurze runde Zunge über die Kante. An ihrem Saum schwellen Perlen an, hängen noch am Wasser, reißen ab, fallen beschleunigt, strecken sich und blenden aus (Logik fließender Farbe). Später gegen den Wasser-Shader aus Card Zone Lab v2 prüfen.
- **Bach quer unter der Straße:** Kreuzung an der Straßenstelle mit größtem Abstand zur Inselkante, senkrecht zur Fahrtrichtung. Schlucht 6,5 m tief, 16 m Einflussradius, zum Rand hin flacher, damit sie den Inselkörper nicht durchstößt. Kleine Knetperlen treiben sichtbar mit der Strömung unter der Brücke hindurch.
- Kamera »Bach/Brücke« steht jetzt im Bachbett und schaut unter die Brücke.
- TUNE: Durchfahrtshöhe unter der Brücke ist knapp (die Track-Core-Platte ist 2,25 m tief); Schluchtwände ohne eigene Form.

## Nachtrag 2026-10-03 (6) · Wasser zurückgestellt
- Bach und Fall sind jetzt eine durchgehende Fläche. Weg sind: Saumstreifen, halbrunde Zunge, Strömungsperlen, Ufer-Knetperlen, Quaternius-Trittsteine und KayKit-Felsen.
- Georg: Es fließt sichtbar nicht. Das Bett ist flach statt U-förmig, die Zunge wirkt wie eine Stofffahne, und eine Mulde ist keine Flusslogik.
- DECISION (Georg): Wasser wird als eigener Slice gelöst, nach `WATER_CONCEPT.md` und mit dem Fluid-Shader aus Card Lab v2 (`BRIEF_WSA_FLUID_SHADER.md`). Bis dahin ist das Wasser Platzhalter und bleibt unverändert. Nächster Bau-Slice: die anderen Biome.

## Nachtrag 2026-10-03 (7) · Biome
- DECISION (Georg, Formular): Es gibt alle vier R2C-Biome. Jedes hat eine eigene Palette, einen eigenen Pflanzen-Satz aus dem Forest Pack, eigenes Gelände, eigene Unterseite, eine Landmarke nach R2C LMK und einen eigenen Himmel. Darstellung: Umschalter und Vergleich. Das Wasser bleibt in allen Biomen Platzhalter.
- Neu ist das fünfte Biom Schnee, aus dem KayKit Medieval Snow Biome @ `ab65e8c`. Daraus kommen detail_forestA/B_snow, castle_snow und house_snow. Hexagon Pack @ `34cde3f`.
- IMPLEMENTATION: `BIOMES` in `island.js` ist die einzige Biom-Tabelle. Gelände (amp, fq, terrace, roll), Unterseite (depth, zap, zapK, bulge), Baumhöhe relativ zur Burg-Referenz, Landmarke mit Zielhöhe. Himmel aus `sky-core.r0a.js` @ R2C-Pin.
- Landmarke steht auf dem Gebäudeplatz, der am weitesten von der Straße weg ist; weitere Plätze bekommen Häuser. Seed 3 hat nur einen Platz, deshalb dort kein Haus.
- TESTED RESULT (Vorschau, Seed 3, Kamera Mittel): Alle fünf Biome bauen ohne Fehler. Burg, Utopia, Dystopia, Protopia und Schnee sind sichtbar verschieden. Der Vergleich (Standbilder) ist NOT_TESTED.
- OPEN: Schnee-Palette und Winterhimmel sind lokale Kandidaten. Landmarken sind ungeschnitten, also nicht auf Sockel geprüft. Schnee hat keine Büsche. Die Zapfen der Unterseite sind am Bild zu entscheiden.

## Nachtrag 2026-10-03 (8) · Burg, Unterseite, Leiste
- Georg: Er sah nur Burg, weil die Biom-Knöpfe in der eingeklappten Leiste lagen. Die Burg war entstellt, die Fahne schwebte. Die Unterseite war unnatürlich, mit Spitzen-Bug und Nähten.
- IMPLEMENTATION: Biom-Knöpfe und „Alle vergleichen“ stehen jetzt in der Kopfzeile. Leiste und Vergleich beginnen unter der Kopfzeile, auch wenn sie umbricht.
- Landmarken und Schnee-Haus: `soft:false`, also keine Glättung und keine Knet-Verformung, nur Knet-Oberfläche wie bei den Bäumen. building_A bleibt im Golden-Weg.
- Unterseite v2 hat ein Rübenprofil y = −D·(1 − ρ^1,6)^q. Der Rand ist senkrecht, die Spitze rund. Randhöhe, Rauschen und Keulen laufen zur Spitze auf null aus. Rauschen ist nur periodisch, also ohne Naht bei 0/2π. Statt Zapfen gibt es runde Keulen. q ist je Biom unterschiedlich: Utopia bauchig, Dystopia kegelig.
- TESTED RESULT (Vorschau, Standbilder über snapshot): Die Unterseite ist in Burg, Dystopia, Schnee und Utopia ohne Spitze und ohne sichtbare Naht. Die Burg ist ganz, die Fahne sitzt auf dem Turm (Kamera Landmarke). Nahaufnahme der Zinnen: NOT_TESTED.

## Nachtrag 2026-10-03 (9) · Unterseite v3, Platzierung, Gebäude
- Georg: Die Gebäude waren zu eckig. Die Unterseite war schlampig, ohne Cartoon-Felsen-Konzept. Bäume standen auf der Straße, im Hang und im Bach. Der Schnee reichte nicht bis zur Kante. Als Benchmark kamen die Floating-Islands-Referenzen.
- Unterseite v3, von oben nach unten: Kappe (Oberflächenfarbe und Material laufen über die Kante, mit Überhang `ov`), Kerbe, Felsband (`band`), Körper. Der Körper ist ein Höhenfeld im Grundriss: Schale, schmaler Hauptkegel und Nebenkegel (`cones`) an Planpunkten, weich vereinigt. Die Kegelform `p` ist je Biom gesetzt. Keine Fächer, keine Naht, runde Spitzen. Die Unterseite ist heller als vorher.
- Den Fels-Patch am Rand der Oberseite gibt es nicht mehr. Die Oberflächenfarbe läuft bis über die Kante.
- Platzierung: Für jedes Modell wird der Kronenradius gemessen. Die Krone muss frei sein von Straße, Plätzen, Wegen, Bach, Teich und Rand. Unter der Krone darf der Hang höchstens 0,8 m + 0,2·r Höhenunterschied haben. Abgelehnte Versuche stehen in `info.vegRejected`.
- Schnee: Statt der Baumgruppen aus dem Snow-Pack gibt es jetzt Einzelbäume aus dem KayKit Festive Mini-Pack @ `7600fa9` (tree_snow_low/medium/tall).
- Landmarken und Schnee-Haus werden mit `soft:'gentle'` sanft geglättet (clay-soften, 4 Durchgänge, Beulen 0,003). Die starke Verformung von vorher kommt nicht mehr vor.
- Neue Ansicht „Seite“ (Benchmark-Blick).
- TESTED RESULT (Vorschau, Seed 3, Standbilder): Burg, Schnee, Dystopia und Utopia haben jeweils eine Unterseite mit mehreren Spitzen und eine Kappe in der Oberflächenfarbe. Die Burg ist ganz. Dass keine Krone mehr über der Straße steht, ist NOT_TESTED als Zahl, nur im Bild geprüft. Protopia: NOT_TESTED.

## Nachtrag 2026-10-03 (10) · Felskörper v5 (Volumen statt Drehkörper)
- Georg: Der Schnee lag nicht bis zur Kante, stattdessen gab es einen falschen Wulst. Die Unterseite v3/v4 sah aus wie ein Sandkasten-Förmchen: symmetrisch, mit Fächer in der Mitte, ohne Tiefe und ohne Struktur.
- Ursache, Grundlage statt Pixel: (a) Die Rundung über die Kante hatte Felsfarbe als Eckfarbe, das ergab einen braunen Wulst. Außerdem wurde das Gelände zum Rand hin auf 0 geblendet, dadurch entstand ein Ring, wo das Innere tiefer lag. (b) Jede Unterseite bis v4 war ein Drehkörper um einen Mittelpunkt. Das gibt zwangsläufig Symmetrie und einen Fächer.
- IMPLEMENTATION: (a) Das Gelände behält bis zur Kante seine eigene Höhe. Die Oberfläche rundet sich als Viertelkreis über die Kante, mit Eckfarbe weiß, also der Farbkarte der Oberseite, und taucht dann in den Fels. (b) `buildBody()`: Abstandsfeld → Marching Cubes (three/addons, 96³) → ein Mesh mit weichen Normalen aus dem Feld. Das Feld ist eine Felsplatte im Grundriss der Insel, dazu abgerundete Kegel (sdRoundCone) an zufälligen Grundrisspunkten, schräg gestellt. Große Kegel tragen kleine an der Flanke, die Länge ist höchstens 3,2 × Breite. Dazu kommen unregelmäßige Schichtrippen und Beulen in zwei Größen. Je Biom: drips, tilt, soft, strata, slab, depth.
- TESTED RESULT (Vorschau, Seed 3, Standbilder Seite/Unten/Mittel): Burg, Schnee, Dystopia und Utopia haben jeweils eine unsymmetrische Tropfstein-Unterseite mit mehreren Spitzen. Der Schnee liegt bis zur Kante. Der Felskörper braucht 1,4–2,1 s, der Inselaufbau insgesamt etwa 8–9,5 s. Protopia: NOT_TESTED.
- OPEN: Die Bauzeit ist zu lang für den Biom-Wechsel live. Die Platte nach innen könnte dicker sein. Die Schichtrippen sind am Bild zu entscheiden. Sichtbarkeit der Naht zwischen Kantenrundung und Fels aus der Nähe: NOT_TESTED.

## Nachtrag 2026-10-03 (11) · Scholle v6 nach Benchmark-Studium
- Georg: Die Unterseite braucht einen zentralen Schwerpunkt und soll wie eine schwebende Erd-/Felsscholle im Cartoon-Stil wirken. Ausläufer hängen senkrecht nach unten, nicht seitlich. Auf der Oberseite gab es Artefakte, weil das Gelände wie ein Aufsatz gebaut war. Die harte Kante passte nicht.
- Studium der 8 Benchmarks, gemeinsame Regel: flache Oberseite, dünnes Band in Oberflächenfarbe unter der Kante, darunter EIN Körper, der sich vom Inselumriss zu einer Hauptspitze unter dem Schwerpunkt verjüngt. 2–6 kleinere Spitzen sitzen im unteren Drittel und zeigen senkrecht nach unten.
- IMPLEMENTATION `buildBody()` v6:
  - Der Querschnitt in Tiefe h ist der Inselumriss, um den Flächenschwerpunkt auf k = (1 − h/D)^pw geschrumpft. Er folgt dem Umriss, ist also kein Drehkörper.
  - Die Spitze ist ein runder Kegel. Die Ausläufer sind runde Kegel mit exakt senkrechter Achse, ihr Fuß sitzt bei 40–75 % Tiefe.
  - Die Scholle endet 1,6 m unter dem tiefsten Gelände der Umgebung (Minimumfilter 4 m). Am Rand sitzt sie bündig unter der Kantenrundung.
  - Punkte außerhalb des Rasters gelten als weit draußen; vorher entstanden dort Splitter.
  - Je Biom: depth, pw, drips, soft, strata, cap, ov.
- TESTED RESULT (Vorschau, Seed 3, Standbilder): Burg, Schnee, Dystopia und Utopia haben je eine Scholle mit zentraler Spitze und senkrechten Ausläufern. Draufsicht ohne braune Bögen und ohne Ränder, die durchstoßen. Abstand der Spitze zum Schwerpunkt: 1,26 m. Felskörper 3,1–4,2 s. Protopia: NOT_TESTED.
- OPEN: Die Bauzeit ist zu lang, der Felskörper sollte je Seed und Biom zwischengespeichert werden. Am Rand ist links noch ein dünner heller Streifen zu sehen. Der Facettengrad (Benchmarks sind Low-Poly, wir sind rund) ist Georgs Entscheidung.

## Nachtrag 2026-10-03 (12) · FAIL Unterseite v2–v6, Neukonzept v7
- GEORG ACCEPTANCE: **FAIL**. v6 ist schlechter als vorher: Knubbel an der Spitze, Würste, grauer Kantenring, Körper stößt an der Straße durch. Die Geometrie wurde geraten statt erarbeitet.
- `FAIL_UNTERSEITE_v2-v6_2026-10-03.md`: Bauweisen, Befunde, Ursachen. Ursachen: drei Teile statt einem, Tiefe 0,6 statt 0,2–0,35 × Ø, angesetzte Zapfen statt gezogener Ecken, 3–4 s Bauzeit.
- `KONZEPT_SCHOLLE_v7.md`: Benchmarks vermessen, Modell M1–M6, Vorgehen (Bank isoliert → Abnahme → Einbau). Kein Code, bis Georg abnimmt.
- Insel im Viewer: unverändert auf v6, Status FAIL.

## Nachtrag 2026-10-03 (13) · Scholle v7 · Bank
- DECISION (Georg): weich über den Facetten (runde Knete bevorzugt, wenn performant), kein Steinband, keine Bodenplatte als eigenes Teil. Die Bank stellt zuerst die 8 Benchmarks nach.
- IMPLEMENTATION: `KFB Scholle Bench v7.dc.html` + `KFB_R2D_v0/scholle-bench.js`. EIN Mesh je Insel: Oberseite (Farbbänder) → senkrechter Rand in Oberflächenfarbe → Ringe des Umrisses mit 32 → 14 → 11 → 8 → 5 Ecken (verzahnt) → Hauptspitze. Zacken = gezogene Ecken, nie tiefer als die Hauptspitze. Knete = Unterteilung + Taubin-Glättung, die Oberseite bleibt eben, Zacken werden schwächer geglättet. Umschalter: Facetten / weich 1–3. Jede Kachel nutzt den Blickwinkel ihres Benchmarks, das Benchmark-Bild steht in der Ecke.
- Korrektur der Messung: Die vordere Kante verdeckt einen Teil des Körpers. Die wahre Tiefe ist 0,36–0,50 × Ø, nicht 0,18–0,35 (KONZEPT §1 ergänzt).
- TESTED RESULT (Vorschau): 8 Inseln, je 396–652 Facetten → 6–10 Tsd. △ (weich 2), 5–10 ms je Insel. Statt 3–4 s beim Marching-Cubes-Körper.
- OPEN: GEORG ACCEPTANCE der Form. Noch nicht in der Insel. Oberseite ohne Gelände. Knete-Material (v10) fehlt noch in der Bank.

## Nachtrag 2026-10-03 (14) · Bank v7: keine Variante stimmt
- GEORG ACCEPTANCE: FAIL („da stimmt keine einzige Variante“).
- Befund 1: Mein abgelesenes Profil war falsch (breite Schulter). Gemessen sind alle Körper V-förmig, fast linear. Jetzt freigestellt aus den Benchmark-Bildern: `benchmark-silhouetten.json`, Kontrollbild `evidence/benchmark-masken.png`.
- Befund 2: Die Bank misst die eigene Silhouette mit Benchmark-Kamera und führt Tiefe und Profil nach. Zahlen passen (sichtbare Tiefe/Breite ±0,05), das Bild trotzdem nicht: Die Oberseite erscheint zu dick, also ist der Blickwinkel zu steil. Die Nachführung hat deshalb den Körper flach gedrückt. Die Blickwinkel (`elev`) sind geschätzt, nicht gemessen.
- OPEN, nächster Schritt: Blickwinkel je Benchmark messen (Verhältnis von Höhe zu Breite der Oberseite: Farbwechsel am Rand oder Hinterkante) und Kamera samt Körper nachführen. Dazu die Unterkontur, also die Zackenfolge, als zweites Maß. Die Zahl allein ist kein Beweis, Georg entscheidet am Bild.

## Nachtrag 2026-10-03 (15) · Blickwinkel gemessen, Nachführung FAIL
- IMPLEMENTATION: Die Vorderkante wird in den Benchmark-Bildern gemessen (`evidence/benchmark-kanten.png`, Linien: magenta = breiteste Zeile, cyan = Vorderkante, gelb = Spitze). Damit gibt es zwei Maße je Benchmark: Oberseite (yF−yW)/W = 0,12–0,16 und Körper (yB−yF)/W = 0,21–0,31. Bei I und G ließ sich die Kante nicht trennen, dort ist das Ziel geschätzt. In der Bank misst ein Masken-Material (Oberseite weiß, Körper rot) die eigene Insel genauso.
- TESTED RESULT: Die gemeinsame Nachführung von Blickwinkel, Tiefe und Profil läuft nicht zusammen. Es entstehen Scheiben mit Absätzen, die Zahlen kommen nicht ans Ziel. Ich habe sie abgeschaltet. Die Bank zeigt die Vorlagen ungeregelt, mit Messwert und Zielwert.
- Befund: Mit Messen und Nachregeln acht Varianten gleichzeitig zu treffen, war der falsche Hebel. Vorschlag: EIN Benchmark (A Leuchtturm oder E Strand, die klarste V-Form) von Hand, isoliert, mit Seitenansicht, von Georg abgenommen. Danach die anderen als Abwandlung.

## Nächster Schritt
Georg schaut die Insel an und sagt, ob Form und Maßstab die richtige Richtung sind. Danach: drei Inseln mit Verbindungsbrücke, Kreuzung und Kreisverkehr aus dem Track Core, Figuren aus dem Register.
