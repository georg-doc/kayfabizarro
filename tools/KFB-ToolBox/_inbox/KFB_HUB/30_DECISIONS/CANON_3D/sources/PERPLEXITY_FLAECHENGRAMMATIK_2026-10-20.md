Ja — und am Screenshot lässt sich ziemlich gut erkennen, was wir vermeiden müssen: **Das Terrain braucht eine komponierte Flächengrammatik statt mehr Zufallsflecken.** Aktuell konkurrieren große Farbflächen, kleine Sprenkel, kantige Formen und weiche Ufersäume miteinander. Dadurch liest sich die Oberfläche eher als Tarnmuster mit Airbrush-Rändern als als zusammenhängende, handgeformte Cartoon-Landschaft.

Für die Umsetzung gibt es passende Techniken: getrennte Makro- und Detailmasken, verzerrte Flächenkonturen, materialabhängige Übergänge, kontrolliertes Texture Bombing und räumlich gesteuerte Verteilung. Epic zeigt beispielsweise in seinem stilisierten Landscape-Material ausdrücklich getrennte Funktionen für Gestein/Gras-Übergänge und zufällige Farbflecken; Frostbite beschreibt, wie grobe Materialmasken gezielt durch feinere Masken ergänzt werden. Der entscheidende Punkt ist jeweils die Trennung der Aufgaben — nicht ein einziges Noise-Feld für alles.\[[dev.epicgames](https://dev.epicgames.com/documentation/en-us/unreal-engine/stylized-rendering-landscape?application_version=4.27)\]\[[media.contentapi.ea](https://media.contentapi.ea.com/content/dam/eacom/frostbite/files/chapter5-andersson-terrain-rendering-in-frostbite.pdf)\]

## **1\. Was am Screenshot konkret auseinanderfällt**

Meine Bilddiagnose — die Ursachen im Shader müsste man anschließend überprüfen:

| Sichtbarer Befund | Wirkung | Was ich zuerst ändern würde |
| ----- | ----- | ----- |
| Viele ähnlich große Hügel und wiederkehrende Grün-Beige-Wechsel | Alles besitzt ungefähr dieselbe Wichtigkeit | Wenige größere Landschaftsbereiche mit eigener Flächenkomposition |
| Sehr große dunkle Fläche im Vordergrund | Dominiert das Bild, ist aber semantisch unklar | Albedo, Beleuchtung und Materialmasken getrennt ansehen |
| Kleine beige Tupfer vor allem links unten | Wirken wie aufgespritzte Farbe | Sprenkel an konkrete Übergänge binden |
| Teilweise scharfkantige dunkle Flecken | Andere Formensprache als die runden Hügel | Maskenkonturen und Geometrie getrennt prüfen |
| Helle, weiche Säume um Wasserflächen | Airbrush-/Halo-Eindruck | Ufer als eigenständige Materialzone gestalten |
| Kantige Steine auf weichem Terrain | Low-Poly und Knete sprechen unterschiedliche Sprachen | Gemeinsames Kanten-, Größen- und Materialprofil |

Wichtig: Die dunklen Stellen könnten Materialfarbe, Schatten oder eine Kombination sein. Aus dem Screenshot allein lässt sich das nicht zuverlässig unterscheiden. Deshalb wäre mein erster Arbeitsschritt kein neuer Effekt, sondern eine diagnostische Ansicht.

## **2\. Erst vier Ansichten, dann am Shader drehen**

Lasst Claude dieselbe Kamera in vier Varianten ausgeben:

1. Unbeleuchtete Grundfarben: nur Albedo, keine Schatten, kein AO.  
2. Einheitliches graues Material: nur Form und Beleuchtung.  
3. Material-ID-Ansicht: jede Terrainklasse in einer eindeutigen Diagnosefarbe.  
4. Finales Bild.

Damit trennt ihr drei mögliche Probleme:

* Sind die Flecken schon in der Albedo störend? Dann liegt es an Flächenmasken und Palette.  
* Entstehen sie erst mit Licht? Dann liegt es an Beleuchtung, Normalen oder Schatten.  
* Sind sie nur aus der Spielkamera störend? Dann stimmen Maßstab und räumliche Frequenz der Muster nicht.

Das sollte als Debug-SOP vor jede Terrain-Überarbeitung. Sonst korrigiert man womöglich einen Schattenfehler mit einer anderen Bodenfarbe.

## **3\. Drei Maßstabsebenen — mit verschiedenen Aufgaben**

Ich würde euer Terrainmaterial in drei ausdrücklich getrennte Ebenen zerlegen:

| Ebene | Aufgabe | KFB-Beispiel |
| ----- | ----- | ----- |
| Makro | Ort und große Flächen organisieren | Wiese, trockene Kuppe, Ufer, Fahrkorridor |
| Meso | Flächen charakterisieren und Übergänge formen | Erdinseln, Mooszungen, eingedrückte Knetflächen |
| Mikro | Haptik vermitteln | sehr schwache Dellen, Körnung, Fingerabdruck-Andeutung |

Makrovariation und Detailvariation getrennt zu behandeln ist eine etablierte Terrain-Technik. Frostbite ergänzt beispielsweise niedrig aufgelöste Materialmasken mit materialabhängigen Detailmasken; Terrain-Workflows nutzen außerdem Makrovariation und entfernungsabhängige Darstellung gegen sichtbare Wiederholung.\[[media.contentapi.ea](https://media.contentapi.ea.com/content/dam/eacom/frostbite/files/chapter5-andersson-terrain-rendering-in-frostbite.pdf)\]\[[beyondextent](https://www.beyondextent.com/academy/course/terrain-material-creation)\]

Für KFB würde ich daraus folgende Regel ableiten:

> Makro entscheidet, wo ein Material vorkommt. Meso gestaltet seine Kontur und innere Gliederung. Mikro darf die Lesbarkeit der beiden anderen Ebenen nicht verändern.

Das bedeutet insbesondere: Keine kleinen Flecken mehr, die aus der Übersicht plötzlich wie zusätzliche Biome wirken.

### **Konkrete Konsequenz für das Beispiel**

Nicht jeden Hügel individuell grün-beige-dunkel einfärben. Zuerst drei oder vier größere zusammenhängende Landschaftsbereiche entwerfen, beispielsweise:

* eine ruhige grüne Talfläche,  
* eine warme, trockene Hügelgruppe,  
* eine zusammenhängende feuchte Uferlandschaft,  
* einen bewusst freigehaltenen Fahrbereich.

Die genaue Anzahl ist ein Testvorschlag für dieses Bild, keine allgemeine Studioregel.

## **4\. Organische Konturen: erst die Form entwerfen, dann verzerren**

„Organisch“ sollte bei euch nicht bedeuten: beliebiges Noise überschreitet einen Schwellenwert.

Mein Vorschlag ist ein zweistufiges Verfahren.

### **Schritt A: gerichtete Grundformen**

Baut Materialflächen zunächst aus wenigen nachvollziehbaren Formen:

* breite, asymmetrische Ovale,  
* weiche Keile,  
* zusammenfließende Lappen,  
* längliche Bänder entlang eines Weges,  
* Uferzungen entlang einer Wasserlinie.

Dafür eignen sich beispielsweise Distanzfelder oder überblendete elliptische Einflussfelder.

### **Schritt B: schwache Konturverzerrung**

Erst danach werden die Abfragekoordinaten durch ein niederfrequentes Vektorfeld verschoben:

p' \= p \+ a\\,W(p)

Die Materialmaske wird an `p'` statt an `p` ausgewertet. Das ist das Grundprinzip einer Koordinatenverzerrung beziehungsweise Domain Warping. Prozedurale Noise-Funktionen liefern dafür die räumlich zusammenhängenden Signale; sie sollten als Formwerkzeug eingesetzt werden, nicht als Ersatz für die gestalterische Absicht.\[[cs.umd](https://www.cs.umd.edu/~zwicker/publications/SurveyProceduralNoise-CGF10.pdf)\]

Für euren Stil würde ich testen:

* eine große Verzerrung für die Hauptkontur,  
* eine deutlich schwächere für Randunregelmäßigkeit,  
* keine starke hochfrequente „Zackenbildung“.

Das gewünschte Ergebnis ist ein zusammengedrückter Knetlappen — kein Wolkenfoto und keine zerfranste Küstenkarte.

## **5\. Übergänge als eigene Zone behandeln**

Ein Materialübergang sollte nicht bloß die Stelle sein, an der zwei Farben interpolieren. Er bekommt eine eigene Gestaltung.

Technisch kann man um eine Grenzkurve ein Band definieren. Ist `d` der vorzeichenbehaftete Abstand zur Grenze, liegt die Übergangszone beispielsweise dort, wo:

|d| \< w

Innerhalb dieses Bandes steuert ihr:

* Ausläufer des Materials,  
* Gegeninseln des Nachbarmaterials,  
* Sprenkel,  
* kleine Kontaktformen,  
* gegebenenfalls Materialhöhe und Rauheit.

Das passt zu einem bewährten Grundgedanken aus Terrain-Renderern: Eine grobe Maske legt die Region fest; eine weitere materialabhängige Maske verfeinert den Übergang.\[[media.contentapi.ea](https://media.contentapi.ea.com/content/dam/eacom/frostbite/files/chapter5-andersson-terrain-rendering-in-frostbite.pdf)\]

### **Für KFB: drei Bestandteile pro Übergang**

1. Hauptkontur: eine ruhige, lesbare Grenzform.  
2. Ausläufer: wenige größere Zungen oder Buchten.  
3. Satelliten: wenige kleinere Inseln unmittelbar daneben.

Nicht alle drei müssen überall gleich stark auftreten. Gerade das würde wieder ein Tapetenmuster erzeugen.

### **Keine symmetrische Standardkante**

Gras → Erde und Erde → Gras müssen nicht spiegelbildlich aussehen:

* Gras wächst in Büscheln in die Erde hinein.  
* Erde erscheint als freigelegte Fläche zwischen Grasgruppen.  
* Feuchtigkeit bildet flache Lappen oder zusammenhängende Ränder.  
* Sand kann sich als längliche Ablagerung ausbreiten.

Diese gerichtete Logik wäre eure gestalterische Ergänzung zur technischen Maskierung.

## **6\. Sprenkel: Texture Bombing, aber mit Verteilungsregie**

Für eure Dots und Sprenkel ist Texture Bombing relevant. Dabei werden kleine Motive mit variierter Position in einem räumlichen Raster platziert und zu einer Oberfläche zusammengesetzt. NVIDIA beschreibt das Verfahren einschließlich prozedural erzeugter Kreisformen.\[[developer.nvidia](https://developer.nvidia.com/gpugems/gpugems/part-iii-materials/chapter-20-texture-bombing)\]

Für KFB sollten die Motive aber keine reinen Kreise sein, sondern ein kleines Formenalphabet:

* gedrückter Klecks,  
* kurzes Oval,  
* kleiner Keil,  
* Doppelklecks,  
* abgerundetes Bruchstück.

Der wichtigste Unterschied zum Screenshot liegt nicht in der Form allein, sondern in ihrer Verteilung.

### **Verteilungsregel**

Die Wahrscheinlichkeit für einen Sprenkel sollte aus mehreren Faktoren entstehen:

P(p)=P\_\\text{Basis}\\,  
M\_\\text{Übergang}(p)\\,  
M\_\\text{Ursache}(p)\\,  
M\_\\text{Ruhe}(p)

Dabei bedeutet:

* Übergangsmaske: Sprenkel entstehen überwiegend in der Nähe einer Materialgrenze.  
* Ursachenmaske: beispielsweise Nutzung, Ufernähe oder Objektkontakt.  
* Ruhemaske: wichtige Fahr- und Lesebereiche bleiben frei.

Das ist ein vorgeschlagenes KFB-Modell, keine feste Formel aus einer bestimmten Produktion.

### **Gruppen statt Konfetti**

Mein Pattern dafür:

* wenige Clusterzentren,  
* um jedes Zentrum einige unterschiedlich große Kleckse,  
* zwischen den Clustern deutlich leere Bereiche,  
* Größen und Abstände nicht identisch,  
* einzelne Motive leicht entlang der lokalen Grenze ausrichten.

Poisson-Disk-/Blue-Noise-Verteilungen können Mindestabstände sichern. Ihre relativ gleichmäßige Verteilung ist aber gerade kein Ersatz für die gewünschten Cluster. Verwendet sie gegebenenfalls innerhalb einer bereits komponierten Verteilungsmaske.\[[brashandplucky](https://brashandplucky.com/2025/09/07/procedural-island-generation-i.html)\]

## **7\. Height Blending: sinnvoll, aber nicht mit Geländehöhe verwechseln**

Hier lohnt sich eine wichtige Unterscheidung:

| Verfahren | Welche „Höhe“? | Aufgabe |
| ----- | ----- | ----- |
| Höhenabhängige Terrainverteilung | Höhe der Landschaft | etwa Schnee oberhalb einer Zone |
| Slope Masking | Neigung der Oberfläche | etwa Fels an steilen Flächen |
| Material Height Blending | lokale Höhenstruktur der Materialien | etwa Erde zwischen erhöhten Graspolstern |

Unity dokumentiert sowohl höhen- und neigungsabhängige automatische Materialverteilung als auch Height Blending zwischen Materialschichten. Epic verwendet beim stilisierten Landscape ebenfalls die Oberflächenneigung zur Gras-/Felszuordnung.\[[dev.epicgames](https://dev.epicgames.com/documentation/en-us/unreal-engine/stylized-rendering-landscape?application_version=4.27)\]\[[docs.unity3d](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.4/manual/Shader-Graph-Sample-Terrain-Shaders.html)\]

Für KFB heißt das:

> Neigung darf ein Material plausibler machen, aber nicht jeden Hügel nach demselben Schema bemalen.

Material Height Blending könnte dagegen helfen, dass Erde zwischen weichen Moospolstern erscheint, statt beide Materialien zu einem braungrünen Verlauf zu vermischen. Die verwendete Höhenstruktur sollte stilisiert und groß genug bleiben — nicht fotorealistisch krümelig.

## **8\. Ufer brauchen eine eigene Grammatik**

Die Wasserflächen im Screenshot würde ich nicht durch einen breiteren oder schmaleren Farbverlauf reparieren.

Ich würde vier getrennte Rollen definieren:

Wasser  
→ unmittelbare Kontaktkante  
→ feuchtes Ufermaterial  
→ trockenes Gelände

Die Zonen müssen nicht alle als sichtbare Bänder auftreten. Entscheidend ist, dass sie unabhängig steuerbar sind.

Für den Cartoon-Look:

* keine überall gleich breite helle Umrandung,  
* feuchte Flächen nur an passenden Abschnitten,  
* wenige größere Uferbuchten statt gleichmäßigem Randrauschen,  
* einzelne Steine oder Büschel mit tatsächlichem Kontakt zur Wasserlinie,  
* Helligkeit des Ufers aus Material und Licht ableiten, nicht pauschal aufhellen.

Das ist ein konkreter KFB-Entwurfsvorschlag. Eine universelle „richtige“ Cartoon-Ufertechnik gibt es daraus nicht abzuleiten.

## **9\. Die Farblogik vereinfachen**

Ich würde zunächst mit einer kleinen Terrainpalette arbeiten:

* dominanter Bodenton,  
* nah verwandter Variationsfarbton,  
* ein klar unterscheidbares zweites Material,  
* gegebenenfalls ein eigener Feuchtigkeits-/Uferton.

Dabei zwei Dinge trennen:

* Farbvariation innerhalb desselben Materials: geringer Kontrast.  
* Wechsel zwischen Materialien: deutlicher Unterschied, aber begrenzte Flächenanzahl.

So verhindert ihr, dass jede Variation wie eine andere Substanz aussieht. Epics stilisiertes Terrain trennt ebenfalls Materialwechsel und zusätzliche Farbflecken als verschiedene Shaderfunktionen.\[[dev.epicgames](https://dev.epicgames.com/documentation/en-us/unreal-engine/stylized-rendering-landscape?application_version=4.27)\]

Und: Die dunkle Schattierung nicht zusätzlich in die Albedo malen. Das würde eure bestehende Vorgabe gegen eingebackenes Licht unterlaufen.

## **10\. Konkreter Umbauplan für Claude**

Ich würde keinen kompletten Terrain-Neubau beauftragen, sondern einen kontrollierten Vergleich aus derselben Kamera:

### **Pass 1 — Entstören**

* Kleine Flecken und Sprenkel abschalten.  
* Terrain auf wenige zusammenhängende Materialflächen reduzieren.  
* Albedo und Schatten getrennt prüfen.  
* Uferhalo entfernen oder separat deaktivierbar machen.

### **Pass 2 — Hauptformen**

* Eine größere Testregion manuell komponieren.  
* Flächen aus weichen Grundformen aufbauen.  
* Nur schwaches Domain Warping ergänzen.  
* Fahrkorridor und Landmark-Sichtflächen ruhig halten.

### **Pass 3 — Übergänge**

* Übergangsbänder erzeugen.  
* Wenige größere Ausläufer setzen.  
* Gegeninseln materialabhängig verteilen.  
* Erst danach sparsame Sprenkel ergänzen.

### **Pass 4 — Haptik und Distanz**

* Knetstruktur zurückbringen.  
* Aus Übersicht und Fahrkamera prüfen.  
* Kleine Details in der Entfernung reduzieren oder ausfiltern.  
* Kamerabewegung prüfen: keine flimmernden Punkte, kein wanderndes Muster.

### **Pass 5 — Vergleich**

Vier Bilder nebeneinander:

A: aktueller Stand  
B: nur große Flächen  
C: große Flächen \+ gestaltete Übergänge  
D: C \+ sparsame Haptik

Wenn D nicht klar besser lesbar ist als C, ist die Detailstufe zu stark.

## **11\. Was ich im Kanon ausdrücklich ändern würde**

Meine vorherigen Vorschläge waren stellenweise zu absolut. Insbesondere sind feste Prozentzahlen, Prop-Anzahlen und jedes Detail als automatisches FAIL keine universellen Branchenstandards. Für dieses Terrain würde ich stattdessen wenige Invarianten und visuell kalibrierte Parameter verwenden.

Die wichtigsten Regeln wären:

> 1. Jede größere Materialfläche besitzt eine Ursache oder eine kompositorische Aufgabe.  
> 2. Makroflächen, Übergänge und Mikrostruktur werden unabhängig gesteuert.  
> 3. Sprenkel unterstützen überwiegend Übergänge und Kontaktzonen; sie dekorieren nicht gleichmäßig die gesamte Landschaft.  
> 4. Innerhalb eines Materials bleibt Farbvariation schwächer als zwischen unterschiedlichen Materialien.  
> 5. Die Kontur besitzt große und mittlere Formen, bevor kleine Unregelmäßigkeiten hinzukommen.  
> 6. Abnahme erfolgt in Albedo-, Masken- und Finalansicht aus derselben Spielkamera.  
> 7. Prozedurale Regeln werden an einer freigegebenen Musterregion kalibriert, bevor sie auf die ganze Welt ausgerollt werden.

Der Kern ist: Nicht „alles organischer machen“, sondern zuerst festlegen, welche Flächen zusammengehören, wo sie sich berühren und warum dort etwas ausfranst. Noise, Sprenkel und Knetstruktur kommen erst danach als Werkzeuge hinzu.

