# KFB World Core R2D · R2C-Kurskorrektur: kontinuierliche Knet-Inseln und Tracknetz

## Zweck

Dieses Briefing ist die verbindliche Fortsetzung des GitHub-Stands **KFB World Core R2C · Hex-Archipel Katalog**. Es ersetzt nicht den Projektstand durch eine Kopie aus diesem Claude-Design-Projekt.

Arbeite ausschließlich von den unten verlinkten GitHub-Quellen und den dort genannten Ständen. Falls eine Quelle nicht erreichbar ist, halte an und melde genau ihren Namen. Suche nicht nach einer vermeintlich neueren Kopie im Claude-Design-Projekt und rekonstruiere keine fehlenden Dateien aus Screenshots oder Chattext.

## Ausführung

- Projekt in Claude Design: **KFB World Core**
- Auftrag: **R2D · R2C-Kurskorrektur**
- Ausführung: **Claude Design**
- Modell: **Claude Opus 5.5**
- Reasoning: **High**
- Quelle für den aktuellen World-Core-Ausgangspunkt: GitHub, Commit `927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f`
- Quelle für Clay-SSOT und Golden Matrix: GitHub, Commit `589fa4fe6a3d5a950cf8a82bcf480b8e6326e711`
- Der Arbeitsstand soll als R2D in den bestehenden R2C-Atlas eingebaut werden. Keine getrennte Demo-Anwendung und kein neuer Laufzeit-Eigentümer.

## Festgelegte Richtung

Die sichtbaren Hex-Kacheln aus R2C werden nicht zur Hauptoberfläche der Open World ausgebaut. Das Hexraster bleibt als unsichtbare Logik für Inselgröße, Nachbarschaft, Weltgraph, Seed, Biome, Paletten, Anschlüsse, Belegungsmasken und Export. Eine Insel aus neun logischen Zellen soll als **eine zusammenhängende, frei modellierte Geländeform** erscheinen.

Die vorhandene R2C-Karte, Atlas-Bedienung, Weltgraph, Katalog, Seed-/Biom-/Palettenlogik, Landmarken und Inselanschlüsse bleiben der Ausgangspunkt. R2C bleibt im UI als direkter Vergleich erhalten.

## GitHub-Quellen: verbindlich lesen

### 1. World Core R2C · exakt gepinnter Ausgang

[Ordner mit dem vollständigen R2C-Cut, gepinnt auf Commit 927a1b4](https://github.com/georg-doc/kayfabizarro/tree/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/tools/KFB-ToolBox/_inbox/KFB%20World%20Core%20R2C%20%C2%B7%20Hex-Archipel%20Katalog/WORLD_CORE_R2C_2026-10-01)

Lies in dieser Reihenfolge:

1. [START_HERE.md](https://github.com/georg-doc/kayfabizarro/blob/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/tools/KFB-ToolBox/_inbox/KFB%20World%20Core%20R2C%20%C2%B7%20Hex-Archipel%20Katalog/WORLD_CORE_R2C_2026-10-01/START_HERE.md)
2. [docs/RETURN.md](https://github.com/georg-doc/kayfabizarro/blob/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/tools/KFB-ToolBox/_inbox/KFB%20World%20Core%20R2C%20%C2%B7%20Hex-Archipel%20Katalog/WORLD_CORE_R2C_2026-10-01/docs/RETURN.md)
3. [docs/HANDOVER_WSA.md](https://github.com/georg-doc/kayfabizarro/blob/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/tools/KFB-ToolBox/_inbox/KFB%20World%20Core%20R2C%20%C2%B7%20Hex-Archipel%20Katalog/WORLD_CORE_R2C_2026-10-01/docs/HANDOVER_WSA.md)
4. Aktive Datei: [KFB World Core R2C · Hex-Archipel Katalog.dc.html](https://github.com/georg-doc/kayfabizarro/blob/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/tools/KFB-ToolBox/_inbox/KFB%20World%20Core%20R2C%20%C2%B7%20Hex-Archipel%20Katalog/WORLD_CORE_R2C_2026-10-01/KFB%20World%20Core%20R2C%20%C2%B7%20Hex-Archipel%20Katalog.dc.html)

Der RETURN bestätigt: R2C ist ein Kandidat; seine stabilen Logik- und Interface-Teile bleiben wertvoll. Die bisherige Geometrie ist ein KayKit-Hex-Kachelaufbau. Der GPU-Test für R2C ist offen; Claude-Vorschauwerte gelten nicht als belastbare Nutzergerät-Messung.

### 2. KFB Claymation Style SSOT · exakt gepinnter Stand

- [KFB_CLAYMATION_STYLE_SSOT.md](https://github.com/georg-doc/kayfabizarro/blob/589fa4fe6a3d5a950cf8a82bcf480b8e6326e711/tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md)
- [KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md](https://github.com/georg-doc/kayfabizarro/blob/589fa4fe6a3d5a950cf8a82bcf480b8e6326e711/tools/KFB-ToolBox/docs/KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md)
- [Pull Request #301 mit vollständigem Review-Kontext](https://github.com/georg-doc/kayfabizarro/pull/301)

Lies beide Dateien direkt aus GitHub. Sie legen K1/H0 v8 als visuelle Wahrheit, K2/v10 als neue technische Basis unter Paritätsbedingung sowie Material-, Fassaden-, Schatten-, Natur-, Figuren- und Performance-Regeln fest. Erfinde keinen eigenen Knet-Look.

### 3. H0/K1 · Golden-Terrain und Hirnwelt

[K1/H0-Code, Hirnwelt und Bilder](https://github.com/georg-doc/kayfabizarro/tree/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/tools/KFB-ToolBox/_inbox/KFB%20Knet-Katalog%20K1%20%2B%20Hirnwelt%20Claymation%20Reference/KFB_K1_H0_CODEBASE_2026-09-29)

Zeige die unveränderten H0-Bilder und Geländequelle zuerst allein. H0 ist die visuelle Golden-Terrain-Referenz. Es ist kein Freibrief, beliebige Deformationen hinzuzufügen.

### 4. Track Core · einziger Fahrbahn-Owner

[Track Core Pull Request #219](https://github.com/georg-doc/kayfabizarro/pull/219)  
[Geprüfter Track-Core-Stand 64d8597](https://github.com/georg-doc/kayfabizarro/commit/64d8597c3dad1dc9814c794d4a566d589e1e1a25)

Der Track Core besitzt Fahrbahn, Breitenprofile, Übergänge, Anschlüsse und Track-Bauteile. Nutze seinen vorhandenen Generator und seine Datenrezepte. KayKit ist hier für Gebäude, Landmarken und Straßenrandprops geeignet, nicht als Ersatz für KFB-Straßengeometrie.

### 5. WorldBuilder und echte Fassaden-Integration

[Procedural Building B2 · PR #323](https://github.com/georg-doc/kayfabizarro/pull/323)  
[Recovery-/Router-Stand nach B2, Commit 69c9c7f](https://github.com/georg-doc/kayfabizarro/tree/69c9c7f54cb1c048105f5aa822593c8976727959/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-building-b2)

B2 ist als bestehender-Fassaden-Owner-Pass abgeschlossen. Seine geprüfte Build-Evidence stammt von Head `99a390d3b828fc132528a65e3cff52d165299990`; der spätere Recovery-/Router-Head ist `69c9c7f54cb1c048105f5aa822593c8976727959`. Gebäude müssen über den echten Fassaden-Owner laufen. Keine Fassadenkopie bauen.

### 6. Prozedurale Props · nur Formhinweis

[Environment P2 · PR #316](https://github.com/georg-doc/kayfabizarro/pull/316)

Diese Arbeit zeigt technisch aus echten Spendern abgeleitete Geometrie. Die visuellen Formen der Stümpfe und Pilze sind aber weiterhin **TUNE** und nicht als fertige Designs freigegeben. In R2D dürfen sie nicht als fertige Produktionsfamilie eingesetzt werden.

### 7. clay_floor_001 · vorhandene Texturdateien und R2C-Material getrennt prüfen

[R2C-RETURN mit der Materialnennung](https://github.com/georg-doc/kayfabizarro/blob/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/tools/KFB-ToolBox/_inbox/KFB%20World%20Core%20R2C%20%C2%B7%20Hex-Archipel%20Katalog/WORLD_CORE_R2C_2026-10-01/docs/RETURN.md) benennt `clay_floor_001` als gemeinsames Modellmaterial des Hexagon-Packs. Das ist nicht automatisch dasselbe wie die eigenständigen Texturdateien gleichen Namens.

Der Texturkatalog auf dem geprüften GitHub-Stand führt den Satz separat: [Texture registry shard, gepinnt auf 927a1b4](https://github.com/georg-doc/kayfabizarro/blob/927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f/registry/assets/v1/packs/textures.json). Die vier Originalbilder stammen aus Asset-Commit `378b209355b13304e3cff656ec0806ca5b89df28):

- [Diffuse / Grundfarbe · 115.628 B](https://github.com/georg-doc/kayfabizarro/blob/378b209355b13304e3cff656ec0806ca5b89df28/media/3D_Assets/Textures/clay_floor_001/clay_floor_001_diffuse.jpg)
- [Normalen · 72.654 B](https://github.com/georg-doc/kayfabizarro/blob/378b209355b13304e3cff656ec0806ca5b89df28/media/3D_Assets/Textures/clay_floor_001/clay_floor_001_normal.jpg)
- [Rauheit · 121.553 B](https://github.com/georg-doc/kayfabizarro/blob/378b209355b13304e3cff656ec0806ca5b89df28/media/3D_Assets/Textures/clay_floor_001/clay_floor_001_roughness.jpg)
- [Umgebungslicht / AO · 66.066 B](https://github.com/georg-doc/kayfabizarro/blob/378b209355b13304e3cff656ec0806ca5b89df28/media/3D_Assets/Textures/clay_floor_001/clay_floor_001_ao.jpg)

Diese Dateien sind klein genug zum direkten Test, müssen aber nicht in den Handoff kopiert werden. Lade sie anhand der festen GitHub-URLs.

Vergleiche am selben echten KayKit-Quellmodell, derselben Kamera, demselben Maßstab und Licht:

1. unverändertes R2C-Quellmodell samt ursprünglichem Modellmaterial;
2. H0/K1-Golden-Material;
3. R2C/K2-Materialweg;
4. den registrierten clay_floor_001-Textursatz als eigene Alternative;
5. falls R2C sein Material aus genau diesem Textursatz erzeugt: diese Provenienz anhand des Modell-/Material-URIs belegen, nicht vermuten.

Zeige die Map-Kanäle getrennt und den zusammengesetzten Look. Ältere Terrain-Messungen zu clay_floor_001 deuteten auf wenig Relief-Detail hin; behandle das nur als Hinweis aus einem anderen Einsatz, nicht als vorweggenommenes Urteil über die R2C-Inseloberfläche. Der Textursatz ist ein expliziter Vergleichskandidat, kein bereits freigegebener Golden-Look. Georg entscheidet nach den direkten Bildern.
    
## Arbeitsfolge

### Schritt 1 · Quellen verifizieren, noch nichts gestalten

Erstelle eine kompakte Source Board mit den sieben Quellen oben. Zeige Dateiname, gepinnte GitHub-Version und Rolle in Alltagssprache. Öffne nachweislich die R2C-HTML und die Originaldonoren. Bestätige, dass alle benötigten Dateien erreichbar sind.

Kein Nachfragen nach Golden Samples. Ihre Pfade stehen hier.

### Schritt 2 · Material und Form isolieren

Zeige nebeneinander:

- R2C-Ansicht
- H0/K1 Terrain-Golden
- Original-`clay_floor_001` an echtem Donormodell
- Track-Core-Teil
- Fassaden-Golden `building_A`

Dies ist ein Quellennachweis, keine neue Interpretation.

### Schritt 3 · Plan für eine Insel mit neun logischen Zellen

Das Raster steuert nur Planung und Export. Sichtbar ist eine einzige Inseloberfläche mit gestalteter Ober- und Unterseite. Vor Dekoration zeige getrennte Farbmasks für:

- Fahrbahn und Sicherheitsrand
- Geh-/Aufenthaltsflächen
- Bewohner- und Interaktionsplätze
- Gebäude/Landmarken
- Vegetation/Props
- Inselrand und Absturzsicherheit

Interaktionsplätze müssen Platz für den Spieler und mindestens zwei Figuren lassen, plus größere Variante für gemeinsames Tanzen, Geschenke oder Raufereien. Diese Flächen werden geplant und bleiben ohne Aushöhlen begehbar.

### Schritt 4 · Streckennetz mit dem Track Core einpassen

Das Streckennetz ist Teil der Geländeplanung. Zeige mindestens:

- Gerade und weite Kurve
- engere Kurve und S-Kurve
- T-Kreuzung und Vierwegekreuzung
- Kreisverkehr
- Abzweig/Auf- oder Abfahrt
- Verbindung zwischen Inseln
- Brücke oder Tunnelmund
- Halte-/Parkfläche

Jedes vorhandene Stück kommt aus dem gepinnten Track Core. Fehlendes Stück wird als **MISSING TRACK PIECE** benannt und als Rezept für denselben Core beschrieben. Baue keine zweite Strecke-Engine.

Gelände und Strecke brauchen gezeichnete Lösungen für Straßenbett, sanfte Böschung, Einschnitt, Brückenkopf, Tunnelmund, Inselkante und Biomübergang. Die Straße darf nicht schweben, durch das Terrain stechen oder als loses Band obenauf liegen.

### Schritt 5 · Die Spielwelt gestalten

Erzeuge eine Musterinsel sowie eine kleine Dreiergruppe. Verwende echte KayKit-/KFB-Gebäude, Figuren und Props, wo solche Spender vorhanden sind. Prozedurale Pflanzen sind nur kleine, konsistente Variantenfamilien nach Claude-Design-Abnahme. Signature-Orte, insbesondere die Hirnwelt, bleiben authored.

Zeige dieselbe Insel aus Draufsicht, Fahrhöhe, Laufhöhe und mittlerer sowie ferner Entfernung. Vergleiche R2C und R2D mit derselben Kamera.

## Farbe und Übergänge

Biom und Deck liefern Farbrollen; der bestehende Joyride/T4-Übergangsatlas liefert unregelmäßige Knetflecken zwischen ihnen. Verwende den bestehenden Seed- und Palettenvertrag aus den GitHub-Quellen. Keine linear glatten Verläufe und keine neu erfundenen Universalpaletten.

Zeige drei Biome mit demselben Masken- und Terrain-Vertrag. Fingerprints und Werkzeugspuren müssen nahe lesbar sein, mittel reduziert und aus der Ferne günstig oder aus.

## Figuren, Audio und Spielinteraktion

- Figuren kommen aus dem zentralen Asset-/Character-Register des gepinnten Projekts. Keine lokale Figurenliste oder eigene Rig-Änderung in R2D. Wenn ein benötigter Charakter dort fehlt, dokumentiere den fehlenden Registereintrag als separates To-do.
- R2D plant Lauf-, Fahr- und Interaktionsflächen; es ändert keine Locomotion-, Combat- oder Resident-Animations-Owner.
- Prozedurales Audio bleibt beim bestehenden Audio-Owner. Die Welt darf Seed, Biom, Oberfläche, Wetter und Bewegung als Signale liefern; sie baut keinen zweiten Musik- oder Sound-Generator.

## Performance und Paketgröße

Der frühere R2C-Messstand auf der Claude-Vorschau ist kein Nutzergerät-Benchmark. Vergleiche R2C und R2D auf demselben Browser und Gerät mit denselben Ansichten. Berichte Bildrate, Framezeit, sichtbare Qualität, Dreiecke, Draw Calls und Texturkosten zusammen. Die früheren WorldBuilder-Messungen zeigen, dass Clay-/Pixelkosten wichtig sein können; minimiere nicht blind nur Dreiecke.

Baue Terrain in wenigen zusammenhängenden Bereichen, wiederhole Vegetation über Instancing und verwende LOD nach Entfernung. Schatten und Clay-Detail werden nach Pixelbedarf gestaffelt.

Keine vorhandenen GitHub-Assets in den Export kopieren. Session-Cut enthält nur Design, Code, Rezepte und notwendige kleine Belege und bleibt unter 10 MB.

## Abnahme

**PASS**, wenn:

- normale Spielansicht keine sichtbaren Hexkacheln oder Säulen zeigt;
- das versteckte Raster dieselbe deterministische Welt- und Anschlussplanung bewahrt;
- Oberseite und Unterseite als zusammenhängende Insel gestaltet sind;
- Track Core echte Straßenstücke inklusive Kreuzung/Kreisverkehr integriert;
- Fahrbahn, Gebäude, Bewohner und Interaktionen ohne sichtbare Nähte und Platzkonflikte funktionieren;
- Gebäude-Golden und H0/K1-Look im direkten Vergleich getroffen werden;
- `clay_floor_001` korrekt als tatsächlicher Materialspender gezeigt und mit Golden/R2C verglichen wird;
- vorhandene Figuren/Assets aus den kanonischen GitHub-Registern stammen;
- die Abgabe aus denselben Kameras bessere oder mindestens gleich gute Lesbarkeit bei dokumentierter Laufzeit zeigt;
- kein Großasset dupliziert und kein neuer Runtime-Owner erzeugt wird.

**TUNE** bedeutet, dass Plan und System funktionieren, aber Form, Übergang, Farbe oder Material noch eine gezielte Bildentscheidung brauchen. TUNE ist keine Freigabe.

**FAIL**, wenn sichtbare Hexsäulen Hauptterrain bleiben, eine flache Platte Inseln ersetzt, Strecke frei improvisiert wird, Gebäudefassaden neu geklont werden, generische Testformen als fertiges Design ausgegeben werden oder Quellen aus dem Claude-Projekt statt der gepinnten GitHub-Stände verwendet werden.

## Übergabe

Liefere in demselben GitHub-Arbeitszweig:

- den geänderten R2D-Prototyp;
- eine knappe Source Map mit den tatsächlich verwendeten GitHub-URLs und Commit-Pins;
- Inselrezept mit Seed, Masken, Trackgraph, Asset-IDs, Biom, Palette und LOD;
- Bilder aus allen Pflichtansichten;
- Liste fehlender Track-Core-Stücke und global fehlender Charakter-Registereinträge;
- Status PASS/TUNE/FAIL;
- einen kurzen, nicht-technischen nächsten Schritt.

Keine Datei darf nur als Screenshot beschrieben sein; jede verwendete Quelle muss auf GitHub verlinkt werden.

## Startsatz für Claude Design

Arbeite im bestehenden Projekt KFB World Core am GitHub-gepinnten Stand R2C, Commit 927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f. Lies zuerst alle GitHub-Quellen in diesem Briefing und bestätige ihre Erreichbarkeit anhand der Source Board. Für Clay verwende den gepinnten Style-SSOT und die Golden Matrix aus Commit 589fa4fe6a3d5a950cf8a82bcf480b8e6326e711. Zeige zuerst R2C, H0/K1, clay_floor_001, building_A und ein unverändertes Track-Core-Stück jeweils allein und im geforderten A/B-Vergleich. Danach erstelle R2D als zusammenhängende prozedurale Knet-Insel mit verstecktem Hexraster, geplantem Bewohner-/Interaktionsraum und integriertem Track-Core-Netz. Keine Suche im Claude-Projekt nach alternativen Arbeitskopien.
