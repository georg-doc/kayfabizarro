Benutzeranhang  
Das finde ich sehr gut, das würde ich gern so machen. Bei den Höhenbändern würde ich noch gucken, dass sie jetzt nicht strikt an der Höhe orientiert sind, sonst sieht das schnell aus wie so ein Schnittkuchen, sondern dass wir die möglichst organisch übers Terrain laufen lassen, also ein bisschen wie bei Roadrunner tatsächlich, wo es halt auch, sage ich mal, eher die Fläche ist, die dann halt eine zusätzliche Ebene darstellt und das Ganze dann schon in den Bändern auch farbkoliert ist, wie auf dem Bild, aber halt nicht so klar von den Höhenlinien abhängig. Das fände ich gut, wenn es dann noch ein bisschen organischer wäre und wir die Farbflächen dann anders verteilen könnten und das Terrain dann quasi für sich spricht in den entsprechenden Deformierungen, die man dann an den Bandenkanten erkennen kann. Dazu würde ich noch eine spärliche Outline, wie du das bei der Option zwei, glaube ich, skizziert hattest. Ohne schwarze Tusche-Outline, sondern mit einer entsprechend farblich passenden dunklen Kantenbetonung. Was denkst du dazu?

Worked for 52s

Ja, danke, das Bild gibt das sehr gut wieder, aber ich wollte jetzt eigentlich keine Bildgenerierung von dir, sondern überlegen, wie wir diese Art von Farbigkeit, vor allem mit den Höhenbanden, ohne Höhe. Also wie wir quasi diese flächigen Farbbänder abbilden können, ohne halt die Höhenparameter zu nutzen.  
Genau. Der entscheidende Punkt ist, dass wir Geländegeometrie und Farbverteilung vollständig voneinander entkoppeln. Das Terrain kann weiterhin höhenbasiert entstehen, aber die Farbflächen folgen einer eigenständigen, organischen Logik. Damit vermeiden wir diesen geologischen Schnittkuchen-Effekt.

Ich würde das als Procedural Color Fields konzipieren: zusammenhängende, unregelmäßige Farbflächen, die über das Terrain verlaufen, ohne an bestimmte Höhenstufen gebunden zu sein.

1\. Die Farbflächen bekommen ihre eigene Geometrie  
Statt einer Regel wie „ab 20 Metern Höhe wird die Fläche orange“ erzeugen wir eine zweite, unsichtbare Karte, die ausschließlich die Farbverteilung beschreibt.

Höhenabhängige Bänder

Horizontale Grenzen erzeugen den Schichtkuchen.

Unabhängige Farbflächen

Farbgrenzen verlaufen frei durch die Geländeform.  
Vereinfachtes Prinzip: identische Geländeform, unterschiedliche Farbverteilung.  
2\. Wie erzeugen wir solche organischen Farbflächen?  
Ich würde drei Verfahren kombinieren.

A. Große, zusammenhängende Farbfelder

Ein langsam variierendes 2D-Noise-Feld auf den Weltkoordinaten X/Z erzeugt die grundlegende Farbverteilung. Anders als die Höhenfunktion hat es keine direkte Beziehung zur Geländehöhe.

Wir verwenden sehr große Strukturen mit nur drei bis vier Farbfamilien. Das erzeugt breite Flecken und Zonen statt kleinteiliger Texturstörungen.

B. Fließende Bänder mittels Domain Warping

Das ist der interessantere Teil: Wir erzeugen zunächst breite, gerichtete Farbbahnen und verbiegen deren Koordinaten durch ein zweites, niedrigfrequentes Noise-Feld.

So entstehen Farbbänder, die sich verzweigen, verbreitern, verengen und umeinanderfließen. Sie können über ein Plateau verlaufen, um eine Kuppe herumziehen und in andere Farbflächen übergehen.

Wichtig: Das Warping verändert die Grenzen der Farbflächen, nicht die Terrain-Geometrie.

C. Gezielte Farbflächen durch Splines oder Masken

Das würde ich für KFB unbedingt ergänzen. Denn vollständig zufällige Felder können schnell nach Camouflage aussehen.

Wir könnten größere Farbbahnen durch unsichtbare, prozedural erzeugte Kurven definieren. Über Kontrollpunkte ließen sie sich später auch manuell verschieben.

Das ist für unseren vorgesehenen Editor interessant: Du könntest nicht nur Hügel und Wände ziehen, sondern auch Farbflächen direkt auf dem Terrain gestalten.

3\. Was passiert an steilen Felsen und Canyonwänden?  
Hier gibt es eine Besonderheit: Eine reine X/Z-Farbkarte funktioniert hervorragend auf horizontalen und geneigten Flächen. An einer senkrechten Canyonwand würde sie aber kaum vertikale Variation zeigen.

Dafür würde ich einen zweiten Projektionsmodus verwenden:

Oberflächentyp

Farbverteilung

Ebene, Hügel, Plateau

Organisches X/Z-Farbfeld

Steile Wand, Canyon

Eigenes, entlang der Wand verlaufendes Farbfeld

Übergangsbereiche

Weiche Überblendung der beiden Projektionen

Felskanten und Terrassen

Gezielte dunklere Akzentfarbe

Technisch wäre das mit einer triplanaren Projektion oder mit lokalen Oberflächenkoordinaten möglich.

Die Farben bleiben dabei höhenunabhängig. Die Ausrichtung an der Wand bestimmt nur, wie wir die Farbmuster sinnvoll auf die Oberfläche projizieren.

4\. Die Outlines würde ich separat behandeln  
Das Referenzbild hat eine wichtige Eigenschaft: Nicht jede Farbgrenze ist automatisch eine dunkle Linie.

Ich würde deshalb zwei Dinge unterscheiden:

Farbflächengrenzen: weitgehend ohne Kontur; unterschiedliche Ocker-, Orange- oder Brauntöne grenzen unmittelbar aneinander.

Geometrische Kanten: einzelne Felsvorsprünge, Plateauabbrüche und markante Bruchstellen erhalten eine dünne, dunklere, farblich passende Kantenbetonung.

Zum Beispiel:

Illustrative Ockerpalette mit zwei dunkleren Tönen für Schatten und ausgewählte Kanten.  
Keine globale schwarze Kontur und kein dauerndes Nachzeichnen aller Mesh-Dreiecke. Das würde zu technisch und unruhig wirken.

5\. Wie teuer wäre das?  
Erfreulicherweise wäre diese Methode relativ günstig.

Für einen ersten KFB-Prototyp würde ich die Farbmasken einmal pro Terrain-Chunk generieren, beispielsweise als kleine RGBA-Textur. Der Shader wählt daraus die vier Palettenfarben. Die Farbflächen müssen dann nicht ständig neu berechnet werden.

Beim Sculpting des Geländes bleibt das Farbfeld grundsätzlich erhalten. So verändert sich die Form, während die Farbverteilung an ihrer Weltposition bleibt. Optional könnte man Farbflächen später bewusst mitziehen.

Das ist auch für unsere bereits vorhandene Surface Truth / Terrain-Editor-Architektur geeignet: Die neue Farblogik wäre ausschließlich eine Darstellungsschicht und keine neue Gelände- oder Kollisionsinstanz.

Mein favorisiertes KFB-Konzept  
Ich würde es als Organic Palette Fields formulieren:

Terrain Geometry

Bestehende Höhenfunktion, Sculpting und Kollision bleiben maßgeblich.

Organic Color Field

Vier gebrochene Farben, breite zusammenhängende Flächen, unabhängig von Höhenstufen.

Selective Edge Accents

Wenige farblich abgestimmte Linien an tatsächlichen geometrischen Brüchen.

Der wichtigste Test wäre für mich ein Terrain mit zwei unterschiedlich hohen Plateaus und einem Canyon. Wir verändern anschließend die Höhe des einen Plateaus erheblich, ohne die Farbflächen neu zu berechnen. Wenn die Farben organisch erhalten bleiben und die Landschaft trotzdem weiterhin wie ein zusammenhängendes, gestaltetes Cartoon-Relief wirkt, haben wir die richtige Trennung erreicht.

Und das Schöne daran: Wir könnten später denselben Mechanismus mit anderen Paletten für KFB Town, Protopia oder Dystopia verwenden – ohne jedes Mal ein neues Terrainsystem zu bauen.

In PDF konvertieren  
Benutzeranhang  
super, gefällt mir\!

in cartoons nutzt man eigentlich wenig gradienten; aber für den unteren/vorderen bildbereich könnten wir eine art schatten/dunklere farbe zeigen wie in dem screenshot   
… was denkst du?  
Ja — das finde ich sehr sinnvoll.  
Und ich glaube, du triffst da genau den richtigen Punkt:

Nicht viele echte Gradienten,  
aber eine größere, zusammenhängende dunklere Schatten-/Vordergrundform im unteren Bildbereich, damit das Bild Bühne, Tiefe und Ruhe bekommt.

Das ist ein wichtiger Unterschied.

Mein Kurzfazit  
Ich würde für uns sagen:

keine weich verlaufenden Airbrush-Gradienten als Standard  
stattdessen große, flächige Tonzonen  
besonders im unteren / vorderen Bildbereich  
mit einer etwas dunkleren, wärmeren oder kühleren Schattenfarbe  
eher als zusätzliche Farbfläche als als “Lichtverlauf”  
Also nicht:

“der Boden wird nach vorne hin per Gradient dunkler”

sondern eher:

“im Vordergrund liegt eine große Schatten- oder Tonform”

Das ist viel cartooniger.

Warum das gut funktioniert  
Im Cartoon- und Background-Bereich arbeitet man oft mit:

klaren Flächen  
wenigen Werten  
großen Schattenmassen  
Tiefe durch Staffelung statt durch Rendering  
Diese dunklere Zone vorne macht gleich mehrere Dinge:

sie erdet das Bild,  
sie gibt dem Vordergrund mehr Gewicht,  
sie lenkt den Blick nach innen,  
sie schafft Trennung zwischen Vordergrund und Mittelgrund,  
und sie verhindert, dass alles gleich hell und “offen” wirkt.  
Gerade bei Wüste / Canyon / offener Fläche ist das sehr hilfreich.

Was ich daran mag  
Im Screenshot ist unten/vorne die Fläche nicht einfach nur “dieselbe Bodenfarbe”.  
Sie wirkt eher wie:

eine ruhigere Vordergrundbühne  
mit etwas dunklerem Wert  
und dadurch wie eine Art Spiel- oder Aktionsfläche  
Das ist für uns super interessant, weil wir im Spiel ja oft genau so etwas brauchen:  
eine Fläche, auf der Figuren, Fahrzeuge oder Objekte gut lesbar sind.

Wie ich das für unseren Stil aufbauen würde  
1\. Keine echten Gradienten, sondern Tonflächen  
Ich würde den Vordergrund nicht mit einem weichen Verlauf abdunkeln, sondern mit einer zusätzlichen Farbmaske.

Zum Beispiel:

Grundboden: warmes Ocker  
Vordergrund-Schattenfläche: etwas dunkleres, satteres Orangebraun  
Übergang: leicht unregelmäßig, aber nicht airbrushig  
Also eher:

Shape  
nicht Gradient  
2\. Die dunklere Zone sollte aus der Palette selbst kommen  
Ganz wichtig: nicht schwarz oder grau drüberlegen.

Sondern:

bei gelb/ocker Terrain:  
Vordergrundschatten \= dunkleres Rostocker / Zimtbraun / warmes Umbra  
bei grünem Terrain:  
Vordergrundschatten \= gedecktes Oliv / Moosgrün / erdiges Grünbraun  
bei rotem Terrain:  
Vordergrundschatten \= verbranntes Siena / Rotbraun / dunkles Terracotta  
Dadurch bleibt es illustrativ und integriert.

3\. Die Form sollte grafisch ruhig sein  
Ich würde die Schattenfläche unten nicht zu fleckig machen.

Besser:

groß  
lesbar  
sanft gebrochen  
vielleicht leicht organisch geschwungen  
aber nicht chaotisch  
Also eher wie eine Bühnenfläche oder ein ruhiger Bodenkeil.

Für unser Terrain-System wäre das sehr gut  
Wir hatten ja gerade davon gesprochen, dass die Farbflächen nicht von der Höhe abhängen sollen.

Diese Vordergrundabdunklung würde ich daher als zusätzliche unabhängige Bild-/Raumlogik behandeln.

Also neben:

Terrainform  
organischen Farbflächen  
Kantenbetonung  
kommt noch:

Foreground Value Mass  
dazu.

Technisch könnten wir das auf drei Arten machen  
Option A – kamerabasierte Vordergrundmaske  
Das ist wahrscheinlich die einfachste und stärkste Lösung.

Eine Maske dunkelt den Boden im nahen Kamerabereich ab, aber nicht linear wie ein Gradient, sondern als große stilisierte Fläche.

Das heißt:

abhängig von Distanz zur Kamera  
aber mit organischer Form  
leicht durch Noise oder Warping aufgebrochen  
Vorteil:  
sehr kontrollierbar, gute Lesbarkeit für Gameplay.

Nachteil:  
kann zu “UI-artig” wirken, wenn es zu offensichtlich kameraabhängig ist.

Option B – bildkompositorische Schattenzone  
Hier definierst du pro Chunk / pro Szene / pro Raum eine Schatten- oder Tonzone im Vordergrund.

Also mehr wie ein gemalter Hintergrund:

vorne dunkler  
Mitte offener  
Ferne heller und bläulicher  
Vorteil:  
sehr schön und klassisch-cartoonig.

Nachteil:  
weniger universell, eher szenisch komponiert.

Option C – Kombination aus Vordergrundton \+ echten Schlagschatten  
Das wäre mein Favorit.

Also:

1\. großer ruhiger Vordergrundton  
für die Gesamtkomposition

2\. dazu lokale Schlagschatten  
von Felsen, Kakteen, Props, Kanten, Hügeln

Dann bekommt man:

die ruhige große Massenwirkung  
plus kleine glaubwürdige Akzente  
Was ich dabei vermeiden würde  
1\. Weiche 3D-Gradienten überall  
Sonst verliert es schnell den Cartoon-Charakter.

2\. Vordergrund einfach nur dunkler machen  
Wenn einfach alles unten dunkler wird, wirkt es wie ein billiger Vignette-Trick.

3\. Schwarz als Schattenfarbe  
Zu hart. Besser immer eine dunklere Palettenfarbe.

4\. Zu viel Kleinmuster im Schatten  
Wenn der Vordergrund gleichzeitig dunkel und stark fleckig wird, wird die Szene unruhig.

Meine stilistische Empfehlung für KFB  
Ich würde für uns mit 3 Wertebenen arbeiten:

A. Lichtfläche  
helle Hauptflächen, gut lesbar

B. Mittlere Flächen  
die eigentlichen Farbflächen / Bänder / Terrains

C. Schattenmasse  
große, ruhigere dunklere Form im Vordergrund oder an bestimmten Terrassenzonen

Das ist viel näher an klassischer Cartoon-Background-Logik als ein shaderiger Vollverlauf.

Auf unser Canyon-/Roadrunner-artiges Terrain bezogen  
Da würde ich konkret sagen:

ferne Flächen: heller, etwas luftiger, weniger Kontrast  
mittlere Flächen: die eigentlichen Ocker-/Orange-Bänder  
vorderer Boden: eine zusammenhängende dunklere Fläche  
Kanten: sparsame dunklere Linien oder dunkle Facetten  
Schlagschatten: klar, aber grafisch vereinfacht  
Dann wirkt es gleichzeitig:

stilisiert  
räumlich  
ruhig  
spielbar  
Meine Lieblingsformulierung dafür  
Nicht „Gradient“, sondern:

foreground shadow plane  
oder  
value mass in the foreground

Das trifft besser, was wir wollen.

Mein konkreter Vorschlag für uns  
Ich würde unser Terrain-Konzept jetzt so erweitern:

Terrain Look Stack  
Terrain geometry  
organische Farbflächen  
selektive Kantenbetonung  
große Vordergrund-Schattenmasse  
kleine lokale Schlagschatten  
Das ist aus meiner Sicht die beste Mischung aus:

cartoonig  
kostengünstig  
gut steuerbar  
gameplaytauglich  
Wenn du willst, kann ich dir als Nächstes daraus direkt ein konkretes Shader-/Systemkonzept machen, also z. B.:

welche Masken wir brauchen,  
wie die Vordergrund-Schattenmasse berechnet werden könnte,  
wie wir sie ohne Gradientenlook hinbekommen,  
und wie das mit den organischen Farbflächen zusammenspielt.

In PDF konvertieren  
Ja, sehr gut. Diese vordere Schattenmasse, die sollte sich wahrscheinlich dann an der entsprechenden Farbigkeit orientieren. Und auch für die Schlagschatten beziehungsweise die Schatten von Figuren und auch dem Racer würde ich halt dann auch nicht schwarz nehmen, sondern die entsprechenden Brauntöne oder wie es halt zu den jeweiligen Biomen oder Terrain-Palette passt. sodass du dann eigentlich jetzt in unserem Beispiel so eine Art dunklen Braunton für die Schatten zum Beispiel nehmen und die halt auch relativ einfach und simpel gestalten, inklusive der Überlagerung und so.  
Ja — genau so würde ich es machen.  
Das ist aus meiner Sicht der richtige Schritt, damit der Look wirklich cartoonig und geschlossen wirkt.

Kurz gesagt  
Die Schatten sollten bei uns nicht als neutrales Schwarz/Grau gedacht werden, sondern als Teil der Biom-Palette.

Also nicht:

Bodenfarbe  
plus schwarzer Schatten  
sondern eher:

Bodenfarbe  
plus dunklere Schattenvariante derselben Farbfamilie  
In eurem Canyon-/Roadrunner-Beispiel also tatsächlich:

Sand / Ocker / Orange als Grundflächen  
dunkles Braun / Rotbraun / warmes Umbra für Schatten  
eventuell noch ein zweiter, tieferer Braunton für Überlagerung oder Occlusion  
Das ergibt einen viel harmonischeren Look.

Warum das so gut funktioniert  
Wenn man in stilisierten Cartoons schwarze Schatten nimmt, passiert oft Folgendes:

der Schatten wirkt wie ein fremder Layer,  
das Bild wird härter und technischer,  
Figuren und Fahrzeuge “kleben” weniger in der Welt,  
die Farbpalette zerfällt.  
Wenn stattdessen der Schatten aus der Palette selbst abgeleitet wird, bekommt man:

mehr Zusammenhalt,  
weichere, aber trotzdem klare Stilwirkung,  
biomabhängige Atmosphäre,  
und eine bessere Integration von Figur, Racer und Terrain.  
Ich würde die Schatten in drei Klassen aufteilen  
1\. Große Vordergrund-Schattenmasse  
Das ist die große ruhige dunklere Form unten/vorne im Bild.

Eigenschaften:

große zusammenhängende Fläche  
aus der Terrain-Farbigkeit abgeleitet  
keine schwarze Vignette  
keine weichen Airbrush-Verläufe  
eher wie eine zusätzliche Farbform  
Im Canyon-Beispiel:

Grundfläche: helles Ocker / Sandgelb  
Vordergrundmasse: dunkles warmes Braunocker oder Rotbraun  
Das ist keine “Beleuchtungsphysik”, sondern Komposition.

2\. Schlagschatten von Objekten, Figuren, Racer  
Die würde ich ebenfalls sehr einfach und flächig halten.

Also:

klare Form  
wenig Binnenstruktur  
kaum oder keine Gradienten  
farblich passender Schatten-Ton  
eher grafisch stilisiert als physikalisch simuliert  
Für den Racer oder eine Figur wäre das z. B.:

flacher, leicht verzerrter Schatten auf dem Boden  
abhängig von Lichtwinkel  
aber bewusst vereinfacht  
in dunklem Braun statt Schwarz  
Gerade für Fahrzeuge ist das super, weil so der Racer sofort “sitzt”, ohne realistisch rendern zu müssen.

3\. Kontakt- und Occlusion-Schatten  
Das sind die kleineren dunklen Stellen:

unter Felsen  
an Bodenkontakten  
in Spalten  
unter dem Racer  
unter Füßen  
an Kanten, wo Formen aufeinandertreffen  
Die würde ich noch etwas dunkler ansetzen als die normalen Schlagschatten — aber immer noch innerhalb derselben Farbfamilie.

Also zum Beispiel:

Schlagschatten \= Braunton A  
Occlusion \= Braunton B, etwas tiefer und satter  
So bekommt man Tiefe, ohne ins Schwarz zu kippen.

Mein Lieblingsmodell: Schatten als Palettenfamilie  
Ich würde pro Biom nicht nur Base Colors definieren, sondern gleich eine kleine Schattenfamilie.

Beispiel Canyon / Warm Dry Hills  
Basisflächen  
Sandgelb  
Ocker  
Orangeocker  
Terracotta  
Schattenfarben  
Shadow 1: warmes Rotbraun  
Shadow 2: dunkles Umbra-Braun  
Kantenakzent  
etwas trockener, dunkler Braunton  
für Cliff-Edges, Terrassenbrüche, Kantenbetonung  
Dann können wir überall dieselbe Logik anwenden:

Terrain-Schatten  
Figurenschatten  
Racer-Schatten  
Prop-Schatten  
Occlusion  
Alles kommt aus derselben Familie.

So würde ich die Überlagerung behandeln  
Das ist wichtig, weil du es ja angesprochen hast.

Ich würde keine realistische Shadow-Multiply-Kaskade machen, wo sich fünf Schattenebenen immer weiter verdunkeln.  
Das sieht schnell technisch oder schlammig aus.

Stattdessen eher ein begrenztes Schattenstufensystem.

Vorschlag: maximal zwei Schattenstufen  
Stufe A – normaler Schlagschatten  
Standard für Figuren, Racer, Objekte  
Stufe B – tiefer Schatten / Überlagerung / Occlusion  
nur wenn zwei Dinge zusammenkommen  
oder an sehr engem Kontakt  
oder in Spalten / unter Felskanten  
Das reicht meistens völlig.

So bleibt die Lesbarkeit hoch.

Was das für Figuren und Racer bedeutet  
Für Figuren  
Schatten sehr simpel:

flache Form auf dem Boden  
leicht elliptisch oder perspektivisch verzogen  
kein schwarzer Blob  
Biom-Schattenfarbe  
Wenn die Figur springt:

Schatten etwas getrennt vom Körper  
aber gleiches Schattenvokabular  
Für den Racer  
Das ist besonders wichtig.

Ich würde beim Racer zwei Schattenformen kombinieren:

1\. Boden-Schlagschatten  
einfache stylisierte Bodenform  
relativ ruhig  
an Fahrtrichtung/Licht angepasst  
2\. Kontakt-/Unterbodenschatten  
kleine dunklere Masse direkt unterm Fahrzeug  
gibt Gewicht und Erdung  
So hat der Racer sofort mehr Präsenz.

Ich würde auch Selbstschatten vereinfachen  
Nicht nur Bodenschatten — auch auf Felsen, Figuren, Props.

Aber ebenfalls nicht mit “physically based shading”, sondern eher mit:

klaren Schattenflächen  
vereinfachten Schattenblöcken  
wenigen Tonstufen  
Gerade für unsere Terrains und Props würde ich sagen:

Lichtseite  
Schattenseite  
vielleicht noch kleiner Akzent / Kantenlicht  
fertig  
Das passt viel besser zu der flächigen Ästhetik.

Praktisch würde ich das als kleines System formulieren  
Pro Biom / Terrainprofil:  
baseColors\[\]  
shadowColor  
deepShadowColor  
edgeAccentColor  
Zum Beispiel:

baseColors \= 4 Flächenfarben  
shadowColor \= Standard-Schatten  
deepShadowColor \= Kontakt/Überlagerung  
edgeAccentColor \= sparsame Kantenbetonung  
Damit hätten wir eine einheitliche Look-Logik.

Mein wichtigster Stil-Hinweis  
Die Schatten sollten klar und einfach sein, aber nicht überall gleich dick oder gleich dominant.

Also:

große Vordergrundmasse \= ruhig und breit  
Objekt-/Figurenschatten \= klar, lesbar, simpel  
Occlusion \= gezielt und sparsam  
Kantenbetonung \= selektiv  
Nicht alles gleichzeitig überall.

Meine klare Empfehlung für unser Beispiel  
Für das warm-ockerne Canyon-Biom:

Schatten-Setup  
Große Vordergrundmasse: dunkles Ockerbraun / Rotbraun  
Schlagschatten von Figuren/Racer: etwas klareres warmes Braun  
Kontakt-/Tiefe-Schatten: dunkles Umbra  
Kantenbetonung: trockener dunkler Braunton, leicht entsättigt  
Keine schwarzen Schatten.  
Keine grauen Neutral-Schatten.  
Keine komplizierten Überlagerungen.

So wirkt alles wie aus einem Guss.

Wenn ich das in einem Satz bündeln müsste  
Die Schatten sind bei uns keine Beleuchtungsebene, sondern ein kontrollierter Teil der Farbpalette.

Das ist, glaube ich, die entscheidende Haltung.

Wenn du willst, kann ich dir als Nächstes daraus direkt ein kleines KFB-Terrain-Look-Schema machen, also z. B.:

Palette-Struktur pro Biom  
Flächenfarben \+ Schattenfarben \+ Kantenfarben  
Regeln für Figuren- und Racer-Schatten  
Regeln für Überlagerung / Deep Shadow  
einen kleinen praktischen Implementierungsplan für Shader und Rendering.

In PDF konvertieren  
Ja, sehr gut, gefällt mir, machen wir so, aber eine wichtige Ergänzung: Also diese gebastelten runden Schatten, das waren immer totale Fails, also das hat nie funktioniert. Insofern würde ich schon sagen, wir müssen da den 3D-Schatten nehmen und den entsprechend farbig und von der Schattenlogik behandeln.  
Ja — wichtige Korrektur, und ich stimme dir zu.

Diese gebastelten, ovalen „Blob Shadows“ oder runden Bodenschatten sind fast immer ein Fail, sobald:

die Figur nicht ganz simpel ist,  
das Terrain Höhenunterschiede hat,  
der Racer kippt, springt oder driftet,  
oder die Szene räumlich etwas komplexer wird.  
Dann wirken sie sofort wie ein aufgeklebter Trick.

Also: ja, wir sollten echte 3D-Schatten nehmen  
Aber mit zwei klaren Anpassungen:

echte 3D-Schattenprojektion / Shadow Mapping  
stilisierte Schattenfarbe und vereinfachte Schattenlogik  
Also nicht Fake-Blob, sondern:

echter räumlicher Schattenwurf,  
aber in unserer cartoonigen Farb- und Wertelogik interpretiert.

Was das konkret heißt  
Beibehalten:  
Schatten kommen wirklich von:  
Figuren  
Racer  
Props  
Felsen  
Kanten  
Schatten liegen korrekt auf:  
unebenem Terrain  
Wänden  
Hügeln  
Rampen  
Canyonkanten  
Das ist der große Vorteil.

Verändern:  
Schattenfarbe ist nicht schwarz  
Schatten sind nicht physikalisch weich-realistisch  
Schatten werden palettenbasiert  
Schattenintensität und Stufung werden stilisiert begrenzt  
Ich würde das System jetzt so formulieren  
1\. Echte Shadow Maps als räumliche Wahrheit  
Die Engine berechnet ganz normal den Schattenwurf.

Also:

Lichtquelle  
Shadow map  
Shadow receiver  
Schattenwurf von Racer, Figuren, Props etc.  
Damit bekommen wir:

korrekte Perspektive  
korrekten Kontakt zum Boden  
korrekte Projektion über Unebenheiten  
korrekte Veränderung bei Sprüngen, Drifts, Schräglagen  
Das ist genau der Teil, den die Blob-Shadows nie sauber leisten.

2\. Schattenfarbe wird remapped  
Der Schattenwert aus dem Rendering wird nicht einfach als Schwarz-Multiplikation benutzt, sondern auf eine biomspezifische Schattenfarbe gemappt.

Zum Beispiel im Canyon-Biom:

lit color \= Bodenpalette  
shadow tint \= dunkles Braun / Rotbraun  
deep shadow \= dunkleres Umbra  
Das heißt:  
Der Shadow-Faktor bestimmt wie stark der Schatten ist,  
aber die Farbe kommt aus unserer Palette.

3\. Schatten sollten vereinfacht werden  
Auch wenn sie technisch aus echtem 3D kommen, würde ich sie stilistisch vereinfachen.

Also nicht:

superweiche penumbra  
realistische Streuung  
viele feine Halbschatten  
sondern eher:

klarer Schatten  
begrenzte Weichheit  
vielleicht sogar leicht quantisiert  
ruhiger Gesamteindruck  
Damit bleibt der Cartoon-Look erhalten.

Mein bevorzugtes Modell  
„Real geometry, stylized shadow response“  
Das heißt:

Geometrisch echt:  
echter Shadow Caster  
echter Receiver  
echte Projektion  
Visuell stilisiert:  
farbig  
nicht schwarz  
mit nur 1–2 Schattenstufen  
eventuell leicht geglättet oder leicht gehärtet  
in Biom-Palette eingebettet  
Zwei gute Umsetzungsvarianten  
Option A – Echte Shadow Maps \+ Farb-Remap im Material  
Das wäre vermutlich unser Standard.

Ablauf:

Shadow map liefert Wert shadow  
Material/Shader mischt:  
Lichtfarbe / Base Color  
Biom-Shadow-Color  
Also ungefähr logisch:

0 \= voll beleuchtet  
1 \= voll im Schatten  
Und statt Schwarz zu mischen, mischen wir zu:

shadowColor  
Das ist wahrscheinlich die sauberste Route.

Vorteil  
robust  
einfach mit Terrain, Racer, Figuren kombinierbar  
überall konsistent  
Option B – Echte Shadow Maps \+ toonartige Stufung  
Hier wird der Shadow-Wert noch zusätzlich stilisiert.

Zum Beispiel:

beleuchtet  
normaler Schatten  
tiefer Schatten  
Also quasi 2 oder 3 klare Stufen.

Das wäre besonders schön, wenn wir einen noch grafischeren Look wollen.

Vorteil  
sehr cartoonig  
sehr kontrollierbar  
kein matschiger Halbschatten  
Nachteil  
kann bei falscher Einstellung etwas zu hart oder flackerig werden  
Ich würde das als optionale Veredelung sehen.

Für die große vordere Schattenmasse gilt dasselbe Prinzip  
Da würde ich jetzt leicht umdenken:

Vorher hatten wir sie eher als kompositorische Zusatzfläche beschrieben.  
Jetzt, mit deiner Ergänzung, würde ich sagen:

Die Vordergrund-Schattenmasse kann aus zwei Quellen kommen:  
A. Kompositorische Tonfläche  
große ruhige zusätzliche dunklere Wertmasse  
unabhängig vom direkten Schattenwurf  
B. Echte 3D-Schatten  
von Geländeformen, Felsen, Props etc.  
Und ich glaube, für uns ist die beste Lösung:

beides kombiniert, aber die echte 3D-Schattenlogik bleibt die Basis.

Das heißt:

kein runder Bodenfleck  
keine künstliche Schattenellipse  
sondern echter Schattenwurf  
plus bei Bedarf zusätzliche ruhige Vordergrund-Tonmassen als Gestaltungsschicht  
Wichtig für Racer und Figuren  
Gerade beim Racer ist das Gold wert.

Warum?

Weil der Racer:

schräg liegen kann,  
springen kann,  
über Kuppen fährt,  
an Rampen kippt,  
nahe an Felswänden fährt.  
Ein echter 3D-Schatten zeigt das alles sofort glaubwürdig.

Ein Fake-Schatten macht genau da schlapp.

Für Figuren gilt dasselbe:

Beine  
Sprung  
Kontakt zum Boden  
Staffelung mit Terrain  
Alles profitiert davon.

Wie ich die Schatten stilistisch behandeln würde  
Nicht schwarz  
sondern:

shadowColor aus Biom-Palette  
Nicht zu weich  
sondern:

moderat weich oder leicht gehärtet  
Nicht zu viele Werte  
sondern:

1 normale Schattenstufe  
optional 1 Deep-Shadow-Stufe  
Nicht neutral  
sondern:

warm/kalt passend zum Biom  
Beispiel Canyon-Biom  
Terrainfarben  
Sand  
Ocker  
Orange  
Terracotta  
Schattenfarben  
Shadow: warmes Braunocker  
Deep Shadow: dunkles Rotbraun / Umbra  
Anwendung  
Figur wirft echten Schatten auf den Boden  
Racer wirft echten Schatten auf Boden und Wand  
Felsen werfen echte Schatten auf Terrain  
Schatten werden nicht schwarz, sondern braun interpretiert  
Das ergibt genau diesen integrierten Look.

Ein wichtiger Zusatz: Schatten und Kantenbetonung trennen  
Die Schatten dürfen nicht dieselbe Funktion übernehmen wie die Kantenakzente.

Also:

Schatten  
\= Licht-/Raumlogik

Kantenbetonung  
\= grafische Struktur / Formlesbarkeit

Beide können ähnlich farblich sein, aber sie sind nicht dasselbe.

Sonst wird es schnell zu dick oder zu unruhig.

Mein technischer Favorit für uns  
Ich würde das KFB-seitig jetzt so festziehen:

Schattenmodell  
echte 3D-Schatten als Basis  
Shadow color override / palette remap pro Biom  
vereinfachte Shadow Response  
optional zweistufige Toon-Schatten  
kein Blob-Shadow-System  
Zusätzliche Gestaltung  
ruhige Vordergrund-Tonmassen optional  
aber nicht als Ersatz für echten Schattenwurf  
Klare Arbeitsregel  
Wenn ich das als Stilregel formuliere:

Keine Fake-Blob-Schatten. Schatten kommen aus echter 3D-Projektion.  
Ihre Darstellung wird jedoch farblich und wertmäßig stilisiert und an die Biom-Palette angepasst.

Das ist, glaube ich, genau die saubere Linie.

Wenn du willst, kann ich dir als Nächstes direkt das daraus ableiten:

ein kleines Shadow-System-Schema für KFB  
Palette-Regeln für Schatten / Deep Shadow / Edge Accent  
konkrete Shader-Logik für Terrain \+ Figuren \+ Racer  
eine kleine MVP-Reihenfolge: erst was bauen, dann was tunen.

In PDF konvertieren  
Ja gerne weiter und check bitte den aktuellen Stand bei GitHub ein, dass WS0 und Cloud Code das dann lesen und aufnehmen können und dann gerne weiter bitte.

8m 29s nachgedacht  
KFB Cartoon Terrain – der verbindliche Gestaltungsansatz  
Der GitHub-Abgleich zeigt: WS0 hat bereits einen Terrain-Gesamtauftrag unter Issue \#439 erfasst. Er umfasst Banden, Rampen, Geländeform, Farbflächen und echte farbige 3D-Schatten. Ich ergänze diesen bestehenden Auftrag um unsere detaillierte technische und gestalterische Ausarbeitung, statt einen konkurrierenden Plan anzulegen.

Unser gemeinsamer Ansatz besteht aus fünf zusammenwirkenden Ebenen:

Terrainform: Hügel, Plateaus, Canyons und organische Übergänge.

Organische Farbflächen: drei bis vier gebrochene Farben, deren Grenzen ausdrücklich nicht den Höhenlinien folgen.

Selektive Kantenbetonung: dunklere, zur jeweiligen Palette passende Konturen an tatsächlichen Formbrüchen.

Vordergrund-Tonmasse: eine große, ruhige dunklere Farbfläche statt eines künstlichen Verlaufs.

Echte 3D-Schatten: von Figuren, Racer, Felsen und Bauten – räumlich korrekt projiziert, aber mit der Farbigkeit und reduzierten Tonstufung des jeweiligen Bioms.

Die wichtigste feste Regel: keine runden Fake-/Blob-Shadows, auch nicht als vermeintlich günstiger Ersatz.

GitHub-Check-in abgeschlossen  
Gespeichert und rückgelesen – WS0-Register

Cartoon Terrain – vollständige Design- und Shader-Spezifikation

Technisches Konzept, Palettenrollen, Shadow-Remapping, Masken, Umsetzungsstrategie und Prüfanforderungen.

WS0-Auftrag \#439 – Gesamt-Terrainkonzept

Mit der neuen Spezifikation verknüpft. Banden und Rampen bleiben ausdrücklich im Gesamtumfang.

Quellen- und Prüfbericht

Nachweis

Ergebnis

Repository

georg-doc/kayfabizarro

Branch

docs/kfb-decisions-register-2026-10-11

Exakter Head

1af1abff4e662bc7f807fb20db9ec596c908e0df

Dateien

2 neu, 1 additiv aktualisiert

Prüfungen

12/12 Inhaltschecks, 3/3 Datei-Rücklesungen

Runtime-/Browser-Tests

0

Veröffentlichung

Keine

Wie ich die technische Umsetzung konkret angehen würde  
Der Kern sollte ein kleiner Zusatz zum vorhandenen WS1-Materialsystem sein, kein eigenständiger neuer Terrain-Renderer.

Das Material benötigt ein organisches Farbrollenfeld und einen bereits von der vorhandenen Lichtpipeline berechneten Schattenwert. Die vereinfachte Logik wäre:

// Konzept-Pseudocode – keine bestehende KFB-API

const region \= organicColorField(surfaceCoordinates, seed);  
const baseColor \= biomePalette.surfaces\[region\];

const visibility \= existing3DShadowMap.sample(surfacePoint);  
const shadowColor \= biomePalette.shadowFor(baseColor);

const result \= cartoonShadowResponse(  
  baseColor,  
  shadowColor,  
  visibility  
);

Der entscheidende Unterschied zur üblichen Beleuchtung: Der Schattenwert steuert, wo die Fläche dunkler wird. Die jeweilige Material- und Biompalette entscheidet, welche Farbe diese Fläche erhält.

Die übrige Architektur würde ich so halten:

Bestandteil

Technischer Ansatz

Organische Farbflächen

Große, verzerrte Region-Masken ohne Höhen-Cutoffs

Vordergrund-Tonmasse

Separate, räumlich verankerte Farbmaske

Figur-/Racer-Schatten

Vorhandene echte Shadow Maps

Farbige Schatten

Materialseitige Palettenzuordnung pro Empfängerfläche

Tiefere Kontaktschatten

Vorhandenes AO, begrenzt statt mehrfach multipliziert

Kantenbetonung

Seltene geometriegebundene dunklere Farbakzente

Für die endgültige Shader-Technik muss Claude Code zuerst die tatsächliche WS1-Material- und Shadow-Pipeline untersuchen. Insbesondere sollte der bestehende Licht-Owner erhalten bleiben.

Mein bevorzugter erster visueller Test  
Ich würde die bestehende Mesa-/Canyon-Welt verwenden: ein echtes Gelände, eine vorhandene Figur, ein Racer und ein Banden-/Rampenanschluss.

Darin können wir direkt beurteilen, ob das Terrain seine organische Farbigkeit behält, die Schatten über unebene Flächen korrekt wandern und Vordergrund-Tonmassen die Komposition verbessern, ohne die Fahrfläche zu verdecken.

Ein noch offener Punkt: WS0s bestehender Auftrag verweist auf einen früheren WS1-GitHub-POC für die gesamte Banden-/Rampen-/Terrainlösung. Dessen exakte Quelle ist noch nicht eindeutig gepinnt. Ich habe die fehlenden Geometriedetails deshalb nicht erfunden.

Der nächste Gate bleibt: WS0 identifiziert den vollständigen ursprünglichen Terrain-POC und lässt WS1b das zusammenhängende Konzept als reversible Variante im bestehenden MVP erproben. Claude Code kann die jetzt gesicherte Spezifikation dabei als technischen Arbeitsauftrag verwenden, sobald WS0 die Umsetzung zuweist.

In PDF konvertieren  
