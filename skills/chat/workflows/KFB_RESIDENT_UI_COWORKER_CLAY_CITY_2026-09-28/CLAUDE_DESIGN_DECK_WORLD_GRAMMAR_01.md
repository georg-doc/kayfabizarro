# Claude Design · WORLD-R0A-TUNE-01 · Golden-Sample-Fassaden + Biome/WFC-Grammatik

## Execution Card · vorbereitet, noch nicht parallel starten

- **Start:** erst nach dem vollständigen `RESIDENT-ANIMATION-TOOLBOX-UI-01` Session Cut.
- **Owner/Tool:** bestehendes KFB World Design / KFB Knet-Strecke T4 Projekt in Claude Design Desktop.
- **Model:** Opus 5.5 High beziehungsweise stärkstes verfügbares Claude-Design-Modell.
- **Reasoning:** High.
- **Outcome:** R0A nicht weiterpolieren, sondern die akzeptierte H0-Formensprache exakt wiederherstellen und daraus eine wiederverwendbare visuelle Biome-/WFC-Grammatik für 130+ deck-generierte Welten ableiten. Keine manuell kuratierte Einzelwelt und keine neue Runtime.
- **Öffentliche Arbeitsquelle:** diese GitHub-Datei und die folgenden GitHub-Donoren; die private GPT Site ist nicht erforderlich.
- **Rückgabe:** vollständiger editierbarer Session Cut als Download mit `START_HERE`, `RETURN`, `SOURCE`, WorldGrammar-JSON, Beispielmanifesten und Screenshots.

## Binding donors

1. H0 Hirnwelt: `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
2. K2 Knet-Werkzeuge: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`
3. R0A TUNE-Evidence: `tools/KFB-ToolBox/_inbox/KFB World Core R0A · Clay World Donor/WORLD_CORE_MOBILITY_R0A_2026-09-29/`.
4. T4/M2 und Human-FAIL-Evidence: Branch `coworker/clay-city-mvp-01-2026-09-28`, Ordner `kfb-hub/stage/world/clay-city-mvp-01/` und dessen `RETURN.md`.
5. Bestehendes Designprojekt: `https://claude.ai/design/p/a2cad7dc-f24f-43e7-a3ad-47c27d704811?file=KFB+Knet-Strecke+T4.dc.html`.

Die Human-FAIL-Slice ist Fehler-Evidence, kein Gestaltungsdonor. **R0A ist `TUNE / CONCEPT SKETCH`, kein freigegebener Golden Sample und kein Runtime-Rezept.** H0 besitzt die Art Direction, K2 Material/Werkzeuge, T4 Track/Biom/Clay-VFX-Komposition.

## Sofortige Korrektur · verbindlicher Golden Sample

Der wichtigste Fehler von R0A: Die behauptete Fassaden-Deformation ist im Ergebnis nicht sichtbar. Ein Materialüberzug, globales Biegen/Twisten oder leicht schiefe Gebäudekisten erfüllen den Auftrag nicht.

**Einziger Golden Sample für Gebäude ist H0 Hirnwelt**, insbesondere:

- `KFB Hirnwelt H0.dc.html`;
- `evidence/01-h0.png` bis `evidence/04-h0.png`;
- `RETURN.md`, Abschnitt „Häuser modifiziert oder ausgedacht?“;
- `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`, Abschnitte 1–4;
- `lab-clay/clay-soften.v1.js` plus H0-Knetmaterial.

Das Verfahren ist nicht neu zu erfinden. Für KayKit-Häuser gilt zunächst exakt der H0-Standard:

```text
maxEdge 0.18 · maxLevels 3 · iters 8 · lambda 0.5 · mu -0.53
lump 0.018 der Objektdiagonale · lumpFreq 1.6 · maxTris 90000
```

Die Wirkung muss dieselbe sein wie in H0: gerundete Gebäudekanten, weich eingedrückte und gegeneinander leicht verschobene Fenster-/Türboxen, unregelmäßige Rahmen und eine klar lesbare geknetete Fassadenrhythmik. Textur und Farbpalette allein genügen nicht. Freihändige neue Cartoon-Deformationen, bloßes Objekt-Bending/Twisting und unveränderte Kit-Fassaden sind verboten.

### Fassaden-Gate vor jeder Weltkomposition

Bevor Terrain, Straßen oder WFC weitergebaut werden, zeige für mindestens je ein KayKit-, Kenney- und Tiny-Treats-Gebäude eine feste Dreieransicht bei gleicher Kamera und Beleuchtung:

1. unveränderter Quelldonor;
2. H0 Golden Sample beziehungsweise dessen Referenzansicht;
3. neue Variante mit derselben H0-Pipeline.

Zusätzlich je Gebäude eine Nahaufnahme von zwei Fenstern und einer Tür. **Wenn die neue Variante nicht sofort als dieselbe H0-Familie lesbar ist, stoppe und korrigiere die Pipeline.** Keine Weltkomposition darf eine nicht bestandene Fassade kaschieren. Das Gate ist technisch/visuell intern und verlangt keine neue Georg-Rückfrage, solange die Übereinstimmung nicht erreicht ist.

Für die spätere Runtime müssen die akzeptierten deformierten Geometrien offline gecacht/exportiert werden; die teure H0-Vorstufe darf nicht für jede Instanz beim Laden wiederholt werden.

## Georgs R0A-TUNE · was bleibt, was verworfen wird

**Behalten:** Palette/Farbwelten als Ausgangspunkt, prozedural unregelmäßig verteilte Knetspuren mit glatten Traversal-Masken, Baseplate-freies Einbetten und Bodennähte, echte Donor-Provenienz, TinySkies/Clay-Partikel-Idee, datengetriebenes Rezept.

**Neu bauen:** Gesamtkomposition, räumliche Verbindung von Track/Stadt/Landschaft, sauber im Berg endender Tunnel, Weg- und Landmarkenlogik, nichtrepetitiver Bürgersteig, aktuelle Markierungsgrammatik, Golden-Sample-Fassaden, Bäume ohne helle Fremdknubbel, gestaltete Wolken sowie Asset-Gruppen aus realen Sets statt vereinzelter Mockup-Objekte.

R0A mit circa 1,47 Mio. gerenderten Dreiecken, 313 Draw Calls und circa 6 fps ist kein Performance-Donor. Die nächste Designfassung muss Dichtevarianten und instanzierbare Cluster vorsehen statt dieses Rezept direkt zu vervielfältigen.

### Zweiter R0A-FAIL · schwebende/abgelöste Schatten und Props

Die R0A-Nahaufnahme vom 29.09. zeigt weiterhin einen schwarzen Prop am Gehweg, dessen weicher Schatten sichtbar vom Fußpunkt abgelöst ist. Damit ist der bisher behauptete globale Schatten-/Grounding-Fix **nicht nachgewiesen und für R0A FAIL**.

Für diesen Designjob gilt:

- Objektfuß, sichtbare Oberfläche und Schattenempfänger müssen aus derselben finalen Terrain-/Gehweg-/Track-Höhe abgeleitet sein;
- keine zusätzliche Bodenplatte, kein unsichtbarer höherer Empfänger und kein pauschaler Y-Offset, der nur aus einer Kamera funktioniert;
- Props werden über ihren tatsächlichen Footprint/Bodenpunkt abgesetzt, nicht über Pivot oder Bounding-Box-Mitte;
- Terrainnaht, Gehwegfuge und Trackrand dürfen Schatten nicht clippen oder versetzen;
- Clay-Seam oder eingedrückte Kontaktmulde darf die Verbindung gestalten, aber keinen schwebenden Fuß kaschieren;
- bei instanziierten Props gelten Grounding und Shadow Bias für die gesamte Familie, nicht als Einzelobjekt-Korrektur.

**Pflicht-Evidence vor Weltübersicht:** Nahaufnahmen bei flachem Seitenlicht von je einem Baum/Felsen, Straßen-Prop, Gebäude und Fahrzeug auf (a) Terrain, (b) Gehweg/Fuge, (c) Hang und (d) Trackrand. Jede Aufnahme muss Fußpunkt und Schattenkontakt zeigen. Sichtbare Lücke, versetzter Fleck, Clipping oder dunkler Doppelrand = FAIL und vor weiterer Komposition korrigieren.

Claude Design liefert die korrekten Kontaktbilder und die Grounding-/Footprint-Daten. Der spätere Runtime-Owner baut daraus einen einzigen globalen Placement-/Contact-Shadow-Vertrag; keine lokalen Schatten-Hacks in einzelnen Slices.

### Dritter R0A-FAIL · Straßen-Moiré / Texturflimmern

Die dunkle Straßenfläche zeigt bei flachem Blickwinkel ein deutliches Karo-/Moiré-Muster und bandartiges Flimmern. R0A nennt das selbst „road surface shimmers at grazing angles“ und hat das alte T2-Legacy-Stroke-Map-Profil absichtlich unangetastet gelassen. Dieses Profil ist für die nächste Fassung **gesperrt** und darf weder als Donor noch als akzeptierter Fallback verwendet werden.

Der Ersatz muss die akzeptierte Knetwirkung ohne bildschirmraumabhängige Wiederholungsmuster liefern: Weltmaßstab statt zu kleiner UV-Wiederholung, korrekte Mipmaps/Filterung/Anisotropie, begrenzte Relief-Frequenzen in der Distanz und eine stabile Lean-Variante für schwächere Geräte. Keine künstliche Glättung darf dabei die Knetoberfläche vollständig entfernen.

**Pflicht-Evidence:** dieselbe Straße bei Nah-, Walk-, Drive- und Flight-Distanz sowie bei frontaler und streifender Kamera. Keine Karos, Moiré-Bänder, wandernden Linien, pixelnden Fahrbahnränder oder flimmernden Markierungen. Das gilt gemeinsam für Fahrbahn, Gehweg, Markierung, Track und Terrainübergang.

## Auftrag

Baue nach bestandenem Fassaden-Gate einen sparsamen Claymation-Grammatikbeweis. Organisiere ihn in **sechs wiederverwendbaren Biome-Familien**, aus denen 130+ Deck-Welten über Seeds, Paletten, Assetfamilien und Landmarken entstehen können:

1. Frühling / Gartenstadt;
2. Schnee / Eis;
3. psychedelische Hirnwelt;
4. Canyon / Wüste;
5. Küste / Sumpf;
6. Herbst / Nacht / Halloween.

Die sechs Familien sind kein Auftrag für sechs handgebaute Welten. Sie sind sechs zusammenhängende Regelpakete. Zeige daraus drei klar unterschiedliche, generierte Beispiel-Seeds und eine zusammenhängende Route durch mindestens drei Biome. Große Landschaftszonen, Tunnel, Rücken, Tore oder Diorama-Kanten dürfen den Übergang tragen; nicht jeder Quadratmeter braucht einen kleinteiligen Blend.

Beweise:

1. T4-Rennstrecke und normale Stadtstraßen gehören sichtbar in dieselbe Welt.
2. Terrain, Hügel, Gehwege, eingebettete Gebäude, Bäume, Felsen und Props verwenden H0/K2.
3. Gebäude stehen ohne Bodenplatten im Terrain; **jede sichtbare Fassade besteht das H0-Golden-Sample-Gate**. Keine unveränderte Kit-Geometrie, kein bloßes globales Biegen/Twisten.
4. Die Welt bleibt bewusst sparsam: starke Prop-Gruppen, kleine Landmarken und freie Spielflächen statt eines Teppichs aus OSM-Gebäuden.
5. TinySkies/KFB-Sky, Biompalette und leichte T4-Clay-Partikel sind Teil der Grammatik.
6. Walk-, Auto- und Flugkamera haben klare Traversalflächen; Bewegung, Physik und Collision werden hier nicht neu gebaut.
7. Deck-Identität entsteht aus Daten: Palette, Mood, Biomgewichte, Topologieprofil, Assetfamilien, Hero-Card-Landmarks, Residents, Sky und VFX-Seeds.
8. WFC füllt später nur freigegebene Bereiche. Route, Track, Landmarken, Gameplay-Zonen, Interaktionsanker und Traversal-Masken bleiben harte Constraints.
9. Die Verteilung entsteht aus realen KayKit-/Kenney-/Tiny-Treats-Gruppen: nicht nur mathematische Zellen, sondern benannte Cluster-Rezepte mit Anker, Begleitobjekten, Mindestabstand, Blickrichtung, negativer Fläche und Interaktionssocket.
10. Kein sichtbares Asset schwebt oder besitzt einen abgelösten/geclippten Kontaktschatten. Alle Cluster-Rezepte tragen Grounding- und Footprint-Daten für denselben globalen Kontaktvertrag.
11. Fahrbahn, Track, Gehweg und Markierungen bleiben von Nahaufnahme bis Flugdistanz frei von Karo-Moiré, Texturflimmern und pixelnden Kanten.

## WFC-/Biome-Vertrag

Jede Biome-Familie liefert:

- Palette, Mood, Licht, TinySkies-Himmel und **gestaltete** Wolkenfamilie;
- Terrainprofil und K2-Material-/Knetspurprofil;
- Straßen-, Track-, Bordstein-, Gehweg- und aktuelle Markierungsfamilie;
- 6–12 aus realen Donoren abgeleitete Cluster-Rezepte, zum Beispiel Häuserblock, Picknickhügel, Farmzugang, Waldinsel, Friedhofsecke oder Trackside-Gruppe;
- WFC-Tags, erlaubte Nachbarschaften, Gewichte, Mindestabstände, Blickrichtungen und Ausschlussregeln;
- feste Route-/Track-/Landmark-/Traversal-/Interaktionsmasken;
- Residents/Aktivitäten, Clay-VFX-Events und leichte Card-/Billboard-Sockets;
- Dichteprofile `lean`, `standard`, `hero`, sodass schwächere Geräte dieselbe Weltidentität mit weniger Instanzen behalten.

WFC erzeugt nur den Füllraum zwischen den harten Gameplay-Strukturen. Es darf weder Straßenverlauf noch Track Core, Spawn, Landmarken, Sprungkorridore oder Interaktionsflächen umschreiben.

## Deliverables

- ein editierbares Claude-Design-Artefakt;
- Fassaden-Gate-Sheet mit Original → H0 Golden Sample → neue Variante für KayKit, Kenney und Tiny Treats samt Fenster-/Tür-Nahaufnahmen;
- Grounding-/Shadow-Gate-Sheet für Terrain, Gehwegfuge, Hang und Trackrand;
- Surface-Stability-Gate mit Nah/Walk/Drive/Flight und frontaler/streifender Kamera;
- Übersicht sowie Walk-, Drive- und Flight-Höhen-Screenshots;
- `WorldGrammar` JSON-Schema;
- sechs `BiomeFamily`-Regelpakete und mindestens 6–12 reale Cluster-Rezepte je Familie;
- drei `DeckManifest`/`WorldRecipe` Beispiele mit Assetfamilien, Materialprofilen, Biome-/Palette-Seeds, Hero-Ankern, WFC-Regeln und geschützten Traversal-Masken;
- eine zusammenhängende Demonstrationsroute durch mindestens drei Biome statt getrennter Mockup-Inseln;
- Donor-Provenienz und sichtbare isolierte Donor-Proben vor Integration;
- unresolved runtime-only list;
- `START_HERE`, `RETURN`, `SOURCE` und Checksummen.

## Grenzen

Kein neuer Hub, kein neues UI-System, kein Track Core, kein Locomotion-/Vehicle-/Collision-System, keine zweite World-Runtime und kein kosmetischer Reparaturpass auf R0A oder dem gescheiterten Clay-City-Kandidaten. Verwende reale KayKit-, Kenney- und Tiny-Treats-Donoren und zeige die gewählten Quellen zuerst isoliert. Keine frei erfundenen Placeholder-Gebäude, keine neuen Fassadenstile und kein „Clay Look“ nur über Shader/Textur.

Stoppe nach dem vollständigen visuellen Donor. Die spätere technische Integration ist ein eigener Codex GPT-6 Sol High Job für schrittsynchrone Locomotion, Walk/Auto/Flight, E-Car, Kollisionen, Kontaktschatten, Performance und Browser-Tests.
