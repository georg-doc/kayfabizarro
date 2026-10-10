Systematische Regel- und Metrikdefinition für die 3D-Prozeduralisierung stylisierter Inselumgebungen  
Die visuelle Glaubwürdigkeit stylisierter 3D-Umgebungen – insbesondere auf schwebenden Inseln mit Asset-Kiting-Systemen wie KayKit, Kenney oder Tiny Treats – hängt primär von der Disziplin ihrer räumlichen Anordnung, Skalierung und Verankerung ab. Prozedurale Platzierungsversuche scheitern in der Praxis häufig an zwei Extremen: Entweder wirken die Objekte wie rein statistisches Rauschen („Müsli-Effekt“), oder sie erzeugen starre, mechanische Muster („Blümchenkränze“). Ausgehend von den künstlerischen Gestaltungsprinzipien der Etherington Brothers sowie etablierten Level-Design-Doktrinen wird im Folgenden ein quantifizierbares, automatisiert prüfbares Regelwerk hergeleitet, das diese Ästhetik in mathematische Parameter übersetzt.  
\--------------------------------------------------------------------------------  
1\. Analyse und Erweiterung der Etherington-Brothers-Prinzipien  
Die Zeichnungs- und Kompositionstutorials der Etherington Brothers („How to Think When You Draw“) übersetzen komplexe organische Phänomene in klare, logische Konstruktionsregeln \[cite: 1, 2\]. Um diese Regeln in prozeduralen Generierungs-Algorithmen nutzbar zu machen, müssen die zeichnerischen Maximen mathematisch formuliert und bezüglich der vorgegebenen Startwerte evaluiert werden \[cite: 1, 2\].  
Evaluierung und Korrektur der initialen Startwerte  
Die ursprünglichen Annahmen zur Größen- und Abstandsstruktur bedürfen einer fundierten Präzisierung:

* **Größenverhältnis** $1:0,6:0,35$ **(Big, Medium, Small)**: Diese Dreistufung entspricht der klassischen bildnerischen Hierarchie, ist jedoch unvollständig \[cite: 3, 4\]. Für stylisierte 3D-Assets muss diese Hierarchie um eine vierte Ebene erweitert werden: die *Mikro-Details* ($0,15$), welche als Akzentstreuung (z. B. einzelne Kiesel, herabgefallene Früchte, abgeplatzte Rindenstücke) die harten Geometriekanten zwischen Objekt und Boden brechen \[cite: 3, 4\].  
* **Einsinken je Objektart**: Das bloße Aufsetzen von Polygon-Meshes auf das Terrain führt zum Eindruck des Schwebens. Das Einsinken darf jedoch keinesfalls als fixer absoluter Meterwert definiert werden, sondern muss dynamisch als relativer Prozentsatz der vertikalen Mesh-Ausdehnung ($H$) in Abhängigkeit vom lokalen Terrain-Neigungswinkel ($\alpha$) berechnet werden \[cite: 3\].  
* **Tangenten-Vermeidung**: Im zweidimensionalen Bildraum (Kameraprojektion) dürfen sich die Silhouetten benachbarter Objekte weder exakt berühren noch knapp schneiden \[cite: 5, 6\]. Berührungstangenten heben die Tiefenwahrnehmung auf, indem sie Vorder- und Hintergrund visuell verschmelzen lassen \[cite: 5\].  
* **Ungerade Gruppenbildung (**$3/5/7$**)**: Das menschliche Wahrnehmungssystem sucht unwillkürlich nach Symmetrien \[cite: 7\]. Ungerade Objektgruppen verhindern visuelle Achsensymmetrien und erzeugen eine dynamische, asymmetrische Balance, die vom Auge als natürlich empfunden wird \[cite: 7\].  
* **Abstandsvarianz**: Gleichmäßige Abstände erzeugen stereotype Gitterstrukturen \[cite: 8, 9\]. Die Abstandsvarianz muss durch stochastische Prozesse gesteuert werden, die minimale Abstände garantieren, aber maximale Abstände stochastisch streuen \[cite: 8, 9\].

Ergänzung fehlender Etherington-Regeln  
Über die grundlegenden Parameter hinaus enthalten die Etherington-Tafeln spezifische Konstruktionsprinzipien, die zwingend in das prozedurale Regelsystem integriert werden müssen:

| Etherington-Kategorie | Etherington-Prinzip (Qualitativ) | Prozedurale / Mathematische Übersetzung | Visuelle Funktion |
| ----- | ----- | ----- | ----- |
| **Baumstamm & Rinde** | Gestische Führungslinien; Verdrehung des Stammes („Twisted Towel“) \[cite: 1\]. | Das Stamm-Mesh bzw. die Instanz muss entlang der Z-Achse eine Torsionsrotation ${\theta }_{twist}\in [1{5}^{\circ },4{5}^{\circ }]$ aufweisen; der Textur-Sweep verläuft entlang eines Richtungsvektors \[cite: 1\]. | Bündelt das Auge des Betrachters und leitet den Blick diagonal durch die Szene \[cite: 1\]. |
| **Wurzelwerk („Root Run“)** | Röhrenförmiges Übergreifen über Hindernisse; Freilegen von Wurzelsystemen durch Terrainerosion \[cite: 1\]. | Wurzel-Meshes schmiegen sich über Raycasts an Fels-Kollisionshüllen an; die Terrain-Höhe unter dem Hauptstamm wird lokal abgesenkt ($-\Delta Z$) \[cite: 1\]. | Erzeugt Erdung, suggeriert Alter und dynamische Bodenveränderung \[cite: 1\]. |
| **Gras-Mechanik** | Abnehmende Steifigkeit mit Zunahme der Länge; $36{0}^{\circ }$\-Radialfächerung; Miniatur-Landschaften durch Samengruppen \[cite: 2\]. | Biegungskurve $B(h)\propto {h}^{2}$; Rotationsstreuung um Z-Achse $U(0,2\pi )$; Ausrichtung der Halme weg vom Clustermittelpunkt \[cite: 2\]. | Verhindert Kamm-Effekte; schafft dicht wirkende Vegetationsteppiche \[cite: 2\]. |
| **Wald-Komposition** | Heterogener Waldkontakt („Patchwork“); Baumkronenwerfender Schatten außerhalb des Bildausschnitts; Wegsperrung \[cite: 2\]. | Bodentextur-Blending (Moos/Erde/Nadeln); Platzierung von "Offscreen-Occludern" für Schattenwurf; Erzeugung von Navigationsbarrieren \[cite: 2\]. | Etabliert Tiefenschichtung (Vorder-, Mittel-, Hintergrund) und raumgreifendes Lichteinfallsgefühl \[cite: 2\]. |
| **Felsformationen** | Wechselspiel aus Massen und Einbuchtungen; Schichtung entlang geologischer Bruchlinien; Ausrichtung am Hang \[cite: 10, 11\]. | Ausrichtung der Hauptachse ${V}_{rock}$ parallel zum Höhenschichten-Tangentenvektor ${\vec{t}}_{slope}$; Skalierung entlang der Erosionsachse \[cite: 10, 11\]. | Vermeidet den Eindruck einzeln geworfener Steine; erzeugt geologischen Verband \[cite: 10, 11\]. |

\--------------------------------------------------------------------------------  
2\. Environment-Art- und Level-Design-Prinzipien mit mathematischen Metriken  
Für die automatische Generierung von Landschaften reichen rein ästhetische Beschreibungen nicht aus. Sie müssen in geometrische Metriken, Mischungsverhältnisse und Kontrastwerte übersetzt werden.  
Form-Hierarchie: Big-Medium-Small (BMS)  
Das BMS-Prinzip steuert die visuelle Komplexität und verhindert visuelles Rauschen („Visual Soup“) \[cite: 4\]. Die Gesamtmenge der sichtbaren Oberflächengeometrie auf einer schwebenden Insel muss nach folgendem Flächen- bzw. Volumenverhältnis aufgeteilt werden:

$Volumenverhältnis{V}_{Big}:{V}_{Medium}:{V}_{Small}=1,0:0,6:0,35$  
\$\$\\text{Prozentuale Flächenabdeckung } A\_{Big} \\approx 70\\%, \\quad A\_{Medium} \\approx 20\\%, \\quad A\_{Small} \\approx 10\\%\$\$

* **Big (Hauptformen)**: Insel-Basismesh, massive Felsmassive, solitäre Hauptbäume \[cite: 4\]. Sie definieren die primäre Silhouette gegen die Skybox \[cite: 4\].  
* **Medium (Sekundärformen)**: Mittlere Boulders, Sekundärbäume, Gebäudestrukturen, kleine Felsgruppen \[cite: 4\]. Sie durchbrechen die großen Flächen und schaffen funktionale Zonen \[cite: 4\].  
* **Small (Tertiärformen/Details)**: Büsche, einzelne kleine Steine, Zaunelemente, Blumenkränze \[cite: 4\]. Sie dienen ausschließlich der Verankerung und Detailanreicherung der Sekundärformen \[cite: 4\].

Negativraum und Silhouette  
Auf schwebenden Inseln ist der Raum außerhalb der Inselkante (der Leerraum) eine dominierende Gestaltungskomponente.

* **Negativraum-Quote**: Mindestens \$30\\%\$ bis \$45\\%\$ der horizontalen Projektionsfläche einer Insel müssen frei von vertikalen Bounding-Boxen (über $0,5m$ Höhe) bleiben. Dies sichert Leseabstände („Breathing Room“) für das Auge.  
* **Silhouetten-Kontrast**: Der Außenrand der Insel muss in der Orthogonal- und Perspektivansicht markante Einkerbungen und Vorsprünge aufweisen. Der Längenindex der tatsächlichen Silhouettenkontur ${L}_{real}$ im Vergleich zum konvexen Hüllpolygon ${L}_{hull}$ muss die Bedingung ${L}_{real}/{L}_{hull}\geq 1,35$ erfüllen.

Wertkontrast und Sichtachsen  
Die Helligkeits- und Farbtonverteilung leitet die Aufmerksamkeit des Spielers:

* **Wertkontrast (Value Contrast)**: Points of Interest (POIs) wie Eingänge, Schatztruhen oder Aufstiege müssen einen Leuchtdichte-Abstand $\Delta {L}^{*}$ von mindestens $30$ Einheiten (im CIELAB-Farbraum) gegenüber ihrer unmittelbaren Umgebung aufweisen \[cite: 3, 4\].  
* **Sichtachsen-Korridor**: Hauptsichtachsen zwischen Zugangspunkten und Landmarks müssen in einem Korridor von mindestens $2,0m$ Breite frei von sichtblockierenden Assets ($H>1,2m$) gehalten werden.

Environmental Storytelling: „What Happened Here?“  
Nach den wegweisenden Prinzipien von Harvey Smith und Matthias Worch (GDC 2010\) ist Environmental Storytelling das inszenierte Anordnen von Spielelementen im Raum, sodass der Spieler aus den physischen Spuren auf vergangene Ereignisse schließen kann („Player-derived Narrative“) \[cite: 12, 13\].  
Der Kausalkette-Prozess erstreckt sich von einer primären Ursache über eine physikalische Einwirkung hin zu einer Materialveränderung und Prop-Spur, die schließlich vom Spieler dekodiert wird \[cite: 12, 13\].

1. **Räumlicher Kontext und Kausalität**: Jedes Story-Element benötigt eine physikalische Ursache \[cite: 12, 13\]. Ein umgestürzter Karren liegt nicht isoliert auf der Wiese; er hinterlässt Fahrspuren im Boden (Terrain-Deformation/Textur-Decal), verstreut Ladung in Bewegungsrichtung (vektorielle Abweichung) und weist eventuell verrottetes Holz an der Bruchstelle auf \[cite: 12, 13\].  
2. **Telegraphing**: Die Platzierung von Props dient der Signalisierung von Gefahren oder Zielen \[cite: 13\]. Eine Zunahme von Skelettteilen, abgebrannten Büschen und Versengungstexturen kündigt geometrisch gerichtet den Hort eines Drachen an \[cite: 13\].  
3. **Spurensicherung über Vektor-Felder**: Das Verstreuen von Kleinteilen (z. B. Fallobst, Trümmer) folgt Richtungsvektoren ${\vec{v}}_{impact}$, die mit einer exponentiellen Abfallfunktion bezüglich der Distanz $d$ zum Einschlagspunkt skaliert werden:

$P(d)\propto {e}^{-\lambda d}$  
\--------------------------------------------------------------------------------  
3\. Erdung (Grounding) je Objektart in stilisierten 3D-Spielen  
Das Phänomen scheinbar „schwebender“ oder hart abgeschnittener Objekte an der Terrainoberfläche ist die Hauptursache für ein unnatürliches Erscheinungsbild \[cite: 4\]. Stylisierte Spiele lösen dieses Problem durch geometrische Versenkung und funktionale Übergangselemente \[cite: 3, 4\].  
Grounding-Spezifikationen nach Asset-Kategorie  
Felsen und Boulders  
Felsen liegen in der Natur selten flach auf der Oberfläche, sondern sind Teil unterirdischer Massive \[cite: 1, 10\].

* **Einsinktiefe**: Solitäre Felsen müssen zu \$20\\%\$ bis \$35\\%\$ ihrer vertikalen Ausdehnung unter die Terrainoberfläche abgesenkt werden.  
* **Terrain-Blending**: Der Übergang zwischen Terrain und Felsmesh muss bei stylisierten Engines über Vertex-Farben-Alpha-Blending, Screen-Space-Decals (Dreck-/Moos-Ansammlung) oder Height-Blend-Shader geglättet werden \[cite: 3, 4\].  
* **Neigungsausrichtung**: Felsen an Hanglagen richten ihre Flachseite am Hangneigungsvektor aus, nicht an der globalen Z-Achse.

Bäume und Wurzelanlauf

* **Einsinktiefe**: \$10\\%\$ bis \$20\\%\$ des Stammfußes versinken im Boden.  
* **Wurzelanlauf**: Der Stamm muss am Boden über eine sichtbare Verbreiterung verfügen \[cite: 1\]. Bei steilen Hängen ist der bergseitige Wurzelbereich stärker zu versenken, während der talseitige Bereich freigelegt wird \[cite: 1\].  
* **Wurzel-Fels-Interaktion**: Wenn ein Baum innerhalb des Einflussradius ${R}_{rock}$ eines Felsens platziert wird, müssen dezidierte Wurzel-Addon-Meshes geladen werden, die die Hülle des Felsens umschließen \[cite: 1\].

Büsche und Sträucher

* **Einsinktiefe**: \$10\\%\$ bis \$15\\%\$ der Unterseite müssen unter der Terrain-Oberfläche liegen, um Löcher in der Geometrie bei schrägen Blickwinkeln zu vermeiden.  
* **Gras-Verankerungsring**: Um den Fuß jedes Busches wird prozedural ein dichter Ring aus langem Gras oder Bodendeckern platziert. Dies verdeckt die harte Schnittkante der Polygon-Schnittmenge \[cite: 4\].

Gebäudesockel und Requisiten (Kits wie KayKit / Kenney)

* **Fundament-Sockel**: Gebäudegrundrisse benötigen ein Sockelmesh (Plinthe) mit einer Höhe von mindestens $0,3m-0,5m$, das unebenes Terrain ausgleicht. Das Sockelmesh sinkt variabel zwischen $0,1m$ und $0,4m$ ein.  
* **Trümmer- und Schutt-Schürze**: Entlang der Fundamentkante wird ein Aufwurf-Decal (Kiesel, plattgetretene Erde) mit einer Breite von $0,5m-1,2m$ generiert.

Uferzonen und Wasser-Übergänge auf schwebenden Inseln

* **Graduierung der Kante**: Der Übergang vom Festland zum freien Wasser bzw. Abgrund einer schwebenden Insel erfolgt in vier Zonen:  
  1. *Hinterland*: Dichte Vegetation, tiefer Boden.  
  2. *Uferbereich*: Ausgedünnte Vegetation, Freilegung von Kieseln ($Small$\-Assets) und feuchter Erde.  
  3. *Wasserlinie*: Verankerung von Schilf/Röhricht, Steinen mit leichtem Wasser-Einsunken.  
  4. *Insel-Kante (Cliff Edge)*: Abrisskante mit freiliegenden Wurzeln und herabhängenden Foliage-Assets.

\--------------------------------------------------------------------------------  
4\. Algorithmus zur prozeduralen Platzierung ohne Streuungs-Look  
Rein zufallsbasierte Verteilungen (wie weißes Rauschen oder einfache Uniform-Random-Generatoren) erzeugen ein chaos-basiertes Erscheinungsbild. Natürliche Umgebungen sind das Ergebnis physikalischer Kräfte und biologischen Wettbewerbs.  
Physikalisch begründete Platzierung (Ursache-Wirkung)  
Die Platzierung von Sekundär-Assets basiert auf Skalar- und Vektorfeldern des Terrains, wobei das Terrain-Höhenfeld $Z(x,y)$ über seinen Gradienten $-\nabla Z(x,y)$ Hangabtriebskräfte und Akkumulationskarten für die Asset-Dichte speist:

1. **Gravitativer Abdrift-Algorithmus (z. B. Fallobst, Geröll)**: Die Positionierungswahrscheinlichkeiten für abgefallene Objekte orientieren sich am negativen Gradienten des Höhenfeldes $\nabla Z(x,y)$:

${\vec{F}}_{drift}=-g\cdot \nabla Z(x,y)$  
Objekte bewegen sich virtuell vom Mutterobjekt (z. B. Baum) entlang ${\vec{F}}_{drift}$ hangabwärts. Die Halte-Wahrscheinlichkeit steigt in flachen Bereichen, in denen $|\nabla Z(x,y)|\approx 0$.

1. **Senken-Akkumulation (z. B. Schnee, Wasser, Ansammlung von Laub)**: Die lokale Geländekrümmung (Mean Curvature) ${H}_{curv}$ steuert die Ansammlung. In Geländemulden (${H}_{curv}>0$) wird die Dichte von Kleinteilen, Laub-Decals und Wasserpflanzen dynamisch skaliert.

Poisson-Disk-Sampling mit variablen Radien und Parent-Child-Clustering  
Um gleichmäßige Verteilungen bei gleichzeitiger Vermeidung von Überschneidungen zu garantieren, wird ein modifiziertes Bridson-Poisson-Disk-Sampling eingesetzt \[cite: 8, 9\]. Der Mindestabstand ${r}_{min}$ ist keine Konstante, sondern eine Funktion des Ortsvektors und der Objektkategorie \[cite: 8, 9\]:

${r}_{min}(x,y)={r}_{base}\cdot {f}_{density}(x,y)$  
Parent-Child-Clustering-Verfahren  
Das Clustering-System erzeugt hierarchische Verteilungen über drei Stufen:

* Anfangs wird eine **Parent-Instanz (Big)** platziert.  
* In einem variablen Radius ${R}_{child}$ um diesen Ankerpunkt herum werden **Child-Instanzen (Medium/Small)** generiert.  
* Durch einen abschließenden **Poisson-Disk-Check** entstehen gezielte Ansammlungen von **Mikro-Details (Small)**.

Der Ablauf gliedert sich im Detail wie folgt:

* *Schritt 1*: Platzierung der *Parent-Instanzen* (z. B. großer Fels) unter Einhaltung eines großen Ausschlussradius ${R}_{parent}$ \[cite: 9, 14\].  
* *Schritt 2*: Generierung von *Child-Spawnpunkten* innerhalb eines Ringsegments $[{R}_{in},{R}_{out}]$ um den Parent-Ursprung \[cite: 9, 14\].  
* *Schritt 3*: Ausdünnung der Child-Punkte über eine Gaußsche Dichteverteilung $P(r)\propto {e}^{-{r}^{2}/2{\sigma }^{2}}$, wobei $\sigma$ die Cluster-Kompaktheit bestimmt.  
* *Schritt 4*: Ausrichtung der Child-Objekte tangential oder radial zum Parent-Objekt.

Synthese: Wave Function Collapse (WFC) vs. Kuratierte Vorlagen (Stamps)  
Für den Aufbau strukturierter Szenen konkurrieren zwei Ansätze, deren Kombination die beste Qualität liefert \[cite: 15, 16\]: Das WFC-Raster stellt zunächst die topologische Regeltreue sicher \[cite: 15\]. An definierten Anchor-Points werden anschließend kuratierte Story-Stamps eingefügt, woraufhin ein nachgelagerter Poisson-Scatter die organischen Umgebungsdetails ergänzt \[cite: 8, 9\].

| Parameter / Eigenschaft | Wave Function Collapse (WFC) \[cite: 15, 16\] | Kuratierte Vorlagen (Stamps / Prefabs) | Synthetisierter Hybrid-Ansatz |
| ----- | ----- | ----- | ----- |
| **Eignungsbereich** | Rastergebundene Strukturen (Pfade, Zäune, Klippenkanten, Gebäude) \[cite: 15\]. | Komplexe Erzählinformationen (Lagerfeuer, Bausatz-Ruinen, Story-Vignetten). | WFC stellt logische Pfad- und Geländeführung sicher; Stamps setzen narrative Ankerpunkte. |
| **Determinismus** | Stochastisch unter Einhaltung von Nachbarschafts-Monaden \[cite: 15, 16\]. | \$100\\%\$ determiniert bezüglich relativer Offsets der Einzelteile. | Ankerpunkte werden via WFC gewählt; Stamp-Inhalt wird variabel angepasst. |
| **Organischer Eindruck** | Gering bis mittel (Neigung zu Kachelmustern bei kleinen Tile-Sets). | Sehr hoch (sofern vom Artist professionell geformt). | Hoch: Stamp erzeugt die Komposition, prozeduraler Scatter bricht die harten Außenkanten. |
| **Prozeduraler Aufwand** | Hoch (Zustandsraum-Kollaps, Backtracking-Algorithmen) \[cite: 15\]. | Niedrig (Instanziierung fester Baumstrukturen). | Ausgewogen: WFC läuft auf Makro-Ebene, Stamps injizieren Hand-Authoring. |

\--------------------------------------------------------------------------------  
5\. Korrigierte Regeltabelle (`Objektart × Regel × Zahl`)  
Die folgende Regeltabelle bildet die finale Arbeitsfassung zur Implementierung in die Generierungs-Engine. Sie ersetzt bisherige Faustregeln durch mathematisch definierte Sollwerte, Toleranzbereiche und logische Bedingungen.

| Objektart | Regelkategorie | Spezifische Regel | Startwert (Soll) | Toleranz / Bereich | Mathematischer / Algorithmatischer Ausdruck |
| ----- | ----- | ----- | ----- | ----- | ----- |
| **Felsen (Groß / Big)** | Erdung & Skalierung | Einsinktiefe relativ zur Gesamthöhe $H$ | \$25\\%\$ | \$20\\% \- 35\\%\$ | ${Z}_{pos}={Z}_{terrain}-(0,25\cdot H)$ |
| **Felsen (Groß / Big)** | Ausrichtung | Neigung zur Hangnormale $\vec{n}$ | $1{5}^{\circ }$ | ${0}^{\circ }-3{0}^{\circ }$ | $\angle ({\vec{v}}_{up},\vec{n})\leq 3{0}^{\circ }$ |
| **Felsen (Mittel / Medium)** | Gruppierung | Parent-Child-Kopplung an Großfels | $2$ bis $4$ Stk. | Ungerade Gesamtzahl ($3,5$) | ${N}_{cluster}\in \{3,5\}$ |
| **Felsen (Mittel / Medium)** | Erdung | Einsinktiefe | \$20\\%\$ | \$15\\% \- 25\\%\$ | ${Z}_{pos}={Z}_{terrain}-(0,20\cdot H)$ |
| **Felsen (Klein / Small)** | Streuung | Poisson-Disk Minimum-Radius ${r}_{min}$ | $0,4m$ | $0,3m-0,6m$ | $d({p}_{1},{p}_{2})\geq {r}_{min}$ \[cite: 8, 9\] |
| **Baum (Solitär / Primary)** | Komposition | Abstand zu Inselkanten / Abgründen | $3,0m$ | $\geq 2,0m$ | $d({p}_{tree},Edge)\geq 2,0m$ |
| **Baum (Solitär / Primary)** | Skalierung | Relativer Maßstab zu Standard-Pawn | $2,8\times$ | $2,5\times -3,5\times$ | ${S}_{tree}={S}_{pawn}\cdot 2,8$ |
| **Baum (Gruppe / Forest)** | Varianz | Stamm-Durchmesser-Varianz | \$30\\%\$ | \$15\\% \- 45\\%\$ | ${S}_{xy}={S}_{base}\cdot U(0,7,1,3)$ \[cite: 2\] |
| **Baum (Gruppe / Forest)** | Erdung | Stammversenkung | \$12\\%\$ | \$10\\% \- 18\\%\$ | ${Z}_{pos}={Z}_{terrain}-(0,12\cdot H)$ |
| **Büsche / Sträucher** | Verankerung | Ausrichtung zur Hangnormale | \$50\\%\$ Blend | \$30\\% \- 70\\%\$ | ${\vec{v}}_{up}=slerp({\vec{z}}_{global},\vec{n},0,5)$ |
| **Büsche / Sträucher** | Erdung | Versenkung \+ Gras-Kranz-Kopplung | \$15\\%\$ | \$10\\% \- 20\\%\$ | Spawn Gras-Ring bei $R={R}_{bush}$ \[cite: 4\] |
| **Gräser & Bodendecker** | Dichte | Halm-Cluster-Radialstreuung | $36{0}^{\circ }$ | Vollkreis | Yaw $\theta =U(0,2\pi )$ \[cite: 2\] |
| **Gräser & Bodendecker** | Ausdünnung | Negativraum-Sperrzone um Pfade | $0,8m$ | $0,5m-1,2m$ | Density \= $0$ wenn $d(p,Path)<0,8m$ |
| **Gebäudesockel** | Fundierung | Absolutes Sockel-Einsinken | $0,3m$ | $0,15m-0,45m$ | ${Z}_{building}={Z}_{terrain}-0,3m$ |
| **Gebäudesockel** | Dekoration | Schutt-/Trümmer-Apron Radius | $1,0m$ | $0,6m-1,5m$ | Decal-Radius $R={R}_{footprint}+1,0m$ |
| **Pfade / Wege** | Sichtachsen | Korridor-Freihaltung (Höhe) | $2,5m$ | $2,0m-3,5m$ | Keine Collider im Lichtraumprofil |
| **Uferzonen / Kanten** | Ausdünnung | Vegetations-Skalierung an Kante | $0,4\times$ | $0,2\times -0,6\times$ | ${S}_{foliage}={S}_{base}\cdot ({d}_{edge}/{d}_{max})$ |

\--------------------------------------------------------------------------------  
6\. Automatisch messbare Quality-Assurance-Prüfungen (Automated QA)  
Um den Designer-Build-Prozess zu automatisieren und Fehlschläge im Level-Layout ohne manuelles Review abzufangen, müssen die gestalterischen Regeln in automatische Testskripte (QA-Pipeline) überführt werden.  
Test 1: Screen-Space Tangenten-Detektor  
Szenen wirken flach, wenn sich die Grenzkanten zweier separater Objekte in der 2D-Kameraprojektion berühren oder nahezu berühren, ohne dass eine Überlappung stattfindet \[cite: 5\].  
Die Datenverarbeitung verläuft von den 3D-Weltkoordinaten $(A,B)$ über die Transformationsmatrix ${M}_{VP}$ zu den 2D-Bildraum-Konturen, woraus die Distanzprüfsumme ${d}_{screen}$ berechnet wird \[cite: 5\].

1. Transformiere die 3D-Bounding-Volumes der Objekte $A$ und $B$ mittels View-Projection-Matrix ${M}_{VP}$ in das Viewport-Koordinatensystem \[cite: 5\].  
2. Extrahiere die 2D-Silhouetten-Konturen ${C}_{A}$ und ${C}_{B}$ im Pixelraum \[cite: 5\].  
3. Berechne den minimalen Pixelabstand ${d}_{screen}({C}_{A},{C}_{B})$ zwischen den Konturbegrenzungen \[cite: 5\].  
4. Evaluierung der Zustände:  
   * **Fehlerzustand (Tangente)**: $0<{d}_{screen}({C}_{A},{C}_{B})<{\epsilon }_{pixels}$ (wobei ${\epsilon }_{pixels}\approx 5Pixel$) \[cite: 5\].  
   * **Gültig (Klarer Abstand)**: ${d}_{screen}({C}_{A},{C}_{B})\geq {\epsilon }_{pixels}$ \[cite: 5\].  
   * **Gültig (Echte Überlappung/Staffelung)**: ${C}_{A}\cap {C}_{B}>{A}_{min\_overlap}$ (echte Tiefenschichtung) \[cite: 5\].

Test 2: Bounding-Box Grounding- und Schwebe-Check  
Dieser Check stellt sicher, dass kein Objekt in der Luft schwebt oder exzessiv tief im Boden vergraben ist.

1. Schieße von den untersten Eckpunkten ${P}_{i}$ der 3D-Bounding-Box des Assets einen Vertikal-Raycast nach unten auf das Terrain-Mesh.  
2. Ermittle die Höhendifferenz $\Delta {z}_{i}=Z({P}_{i})-{Z}_{terrain}({X}_{i},{Y}_{i})$.  
3. Berechne das durchschnittliche Versenkungsverhältnis:

${D}_{actual}=\frac{{\bar{Z}}_{terrain}-{Z}_{min\_mesh}}{{H}_{mesh}}$

1. Evaluierung anhand der Regeltabelle:  
   * **Assertion Failure (Floating)**: Wenn $\min\limits_{}(\Delta {z}_{i})>0,01m$ (Objekt berührt den Boden nicht).  
   * **Assertion Failure (Over-Buried)**: Wenn ${D}_{actual}>{D}_{max\_rule}$ (Objekt sinkt tiefer ein als erlaubt).

Test 3: BMS-Verhältnismäßigkeits-Auditor  
Der Auditor berechnet die globale Volumen- und Flächenverteilung auf der Insel, um den visuellen Rauschpegel zu messen \[cite: 4\].

1. Iteriere über alle platzierten Mesh-Instanzen der Insel und ordne sie anhand ihres Bounding-Volumens den Klassen $Big$, $Medium$ oder $Small$ zu \[cite: 4\].  
2. Summiere die Volumina ${V}_{total\_big}$, ${V}_{total\_medium}$, ${V}_{total\_small}$ \[cite: 4\].  
3. Berechne den Abweichungsindex ${I}_{BMS}$ gegenüber dem Zielverhältnis $1,0:0,6:0,35$:

${I}_{BMS}=\left|{\frac{{V}_{medium}}{{V}_{big}}-0,6}\right|+\left|{\frac{{V}_{small}}{{V}_{big}}-0,35}\right|$

1. **Assertion Warning**: Wenn ${I}_{BMS}>0,15$, wird ein QA-Flag ausgelöst („Insel ist visuell überladen“ oder „Insel fehlen Sekundärformen“) \[cite: 4\].

Test 4: Cluster-Größen und Symmetrie-Scanner  
Dieser Test identifiziert mechanisch wirkende, gerade Objektgruppierungen \[cite: 7\].

1. Führe einen spatiotemporal gekoppelten Clustering-Algorithmus (z. B. DBSCAN mit Radius ${R}_{cluster}=1,5m$) auf der Objektkategorie *Felsen* oder *Bäume* aus.  
2. Für jedes identifizierte Cluster ${C}_{k}$ ermittle die Objektanzahl ${N}_{k}=|{C}_{k}|$.  
3. Berechne die bilaterale Symmetrie-Varianz ${S}_{var}$ der Objektpositionen innerhalb des Clusters bezüglich der Schwerpunktsachse \[cite: 7\].  
4. Evaluierung:  
   * **Fehlerzustand (Gerade Gruppe)**: ${N}_{k}\in \{2,4,6\}$ (sofern ${N}_{k}>1$) \[cite: 7\].  
   * **Fehlerzustand (Künstliche Symmetrie)**: ${S}_{var}<{\epsilon }_{symm}$ (Objekte stehen in gleichmäßigem Raster oder perfekter Linie) \[cite: 7\].  
   * **Gültiges Cluster**: ${N}_{k}\in \{3,5,7\}$ mit asymmetrischer Anordnung (${S}_{var}\geq {\epsilon }_{symm}$) \[cite: 7\].

\--------------------------------------------------------------------------------  
7\. Fazit und technische Synthese  
Die Ursache bisheriger fehlgeschlagener Platzierungsversuche lag in der ungefilterten Anwendung von Rauschfunktionen und der Vernachlässigung der bildräumlichen Wirkung stylisierter Geometrien \[cite: 4\]. Durch die Überführung der zeichnerischen Regeln der Etherington Brothers \[cite: 1, 2\] in mathematische Schwellenwerte, die strikte Durchsetzung der Big-Medium-Small-Hierarchie \[cite: 4\] und die rechnerische Erdung über objektspezifische Einsinktiefen wird die prozedurale Erzeugung mathematisch determinierbar und ästhetisch verlässlich. Die automatisierten QA-Metriken stellen sicher, dass Regelverletzungen (wie Tangentenbildung \[cite: 5\], schwebende Assets oder unnatürliche Symmetrien \[cite: 7\]) bereits während des Generierungsprozesses vollautomatisch korrigiert werden.  
\--------------------------------------------------------------------------------

1. How To Draw A Tree | Art Rocket \- CLIP STUDIO PAINT（クリスタ）, [https\://www\.clipstudio.net/how-to-draw/archives/163485](https://www.clipstudio.net/how-to-draw/archives/163485)  
2. How to Draw GRASS & FORESTS | Etherington Brothers | Art Rocket, [https\://www\.clipstudio.net/how-to-draw/archives/167907](https://www.clipstudio.net/how-to-draw/archives/167907)  
3. Environment Artist Fundamentals \- Experience Points, [https\://www\.exp-points.com/environment-artist-fundamentals](https://www.exp-points.com/environment-artist-fundamentals)  
4. Stylized 3D Environments Made EASY – Full Course for Beginners & Artists \- YouTube, [https\://www\.youtube.com/watch?v=zzBx94M3ErE](https://www.youtube.com/watch?v=zzBx94M3ErE)  
5. How to THINK when you draw TANGENTS and INTERSECTING LINES \- BRAND NEW TUTORIAL\! \- The Etherington Brothers, [http\://theetheringtonbrothers.blogspot.com/2020/03/how-to-think-when-you-draw-tangents-and.html](http://theetheringtonbrothers.blogspot.com/2020/03/how-to-think-when-you-draw-tangents-and.html)  
6. How to THINK When You Draw TANGENTS\! by EtheringtonBrothers on DeviantArt, [https\://www\.deviantart.com/etheringtonbrothers/art/How-to-THINK-When-You-Draw-TANGENTS%21-1292660147](https://www.deviantart.com/etheringtonbrothers/art/How-to-THINK-When-You-Draw-TANGENTS%21-1292660147)  
7. Help with stylized ground video game assets \- Modeling \- Blender Artists Community, [https\://blenderartists.org/t/help-with-stylized-ground-video-game-assets/1473390](https://blenderartists.org/t/help-with-stylized-ground-video-game-assets/1473390)  
8. \[Unity\] Procedural Object Placement (E01: poisson disc sampling) \- YouTube, [https\://www\.youtube.com/watch?v=7WcmyxyFO7o](https://www.youtube.com/watch?v=7WcmyxyFO7o)  
9. Procedural Tools — Hakeem Adam, [https\://hakeemadam.info/procedural-tools](https://hakeemadam.info/procedural-tools)  
10. How to draw ROCK FORMATIONS BOULDERS ENVIRONMENTS by EtheringtonBrothers on DeviantArt, [https\://www\.deviantart.com/etheringtonbrothers/art/How-to-draw-ROCK-FORMATIONS-BOULDERS-ENVIRONMENTS-660919912](https://www.deviantart.com/etheringtonbrothers/art/How-to-draw-ROCK-FORMATIONS-BOULDERS-ENVIRONMENTS-660919912)  
11. How to THINK when you draw ROCK FORMATIONS TIP\! by EtheringtonBrothers on DeviantArt, [https\://www\.deviantart.com/etheringtonbrothers/art/How-to-THINK-when-you-draw-ROCK-FORMATIONS-TIP%21-827696173](https://www.deviantart.com/etheringtonbrothers/art/How-to-THINK-when-you-draw-ROCK-FORMATIONS-TIP%21-827696173)  
12. What Happened Here? Environmental Storytelling \- GDC Vault, [https\://www\.gdcvault.com/play/1012647/what-happened-here-environmental](https://www.gdcvault.com/play/1012647/what-happened-here-environmental)  
13. You can find the latest version of these slides on our webpages: http\://www\.worch.com and http\://www\.witchboy.net 1, [https\://www\.worch.com/files/gdc/What\_Happened\_Here\_Web\_Notes.pdf](https://www.worch.com/files/gdc/What_Happened_Here_Web_Notes.pdf)  
14. RRT\*-APF Path Planning and MA-AADRC-SMC Control for Cooperative 3-D Obstacle Avoidance in Multi-UAV Formations \- MDPI, [https\://www\.mdpi.com/2504-446X/9/9/611](https://www.mdpi.com/2504-446X/9/9/611)  
15. Procedurally Generating Voxel Worlds using Wave Function Collapse \- Joris Rijsdijk, [https\://jorisar.nl/blog/VoxelWaveFunctionCollapse/](https://jorisar.nl/blog/VoxelWaveFunctionCollapse/)  
16. Using the Wave Function Collapse Algorithm for Infinite Procedural Cities \- 80 Level, [https\://80.lv/articles/using-the-wave-function-collapse-algorithm-for-infinite-procedural-cities](https://80.lv/articles/using-the-wave-function-collapse-algorithm-for-infinite-procedural-cities)

