# Landmark Pilot 01 · OSM / Desktop Work Lead Return

**Datum:** 2026-09-18  
**Owner dieser Arbeit:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Status:** DREI NEUE DONOR-KANDIDATEN · GEOMETRIE/EXPORT GEPRÜFT · BROWSER/OSM-INTEGRATION OFFEN

## 1 · Georgs Abnahme und Auftrag

**GEORG VISUAL ACCEPTANCE — Dom v0.2:** Nach dem reparierten v0.2-HTML bestätigte Georg ausdrücklich die cartoonige Abstraktion, Glaubwürdigkeit, Kontur und einfache Materialwirkung. Gleichzeitig stellte er fest, dass die Architektur noch nicht detailgetreu der Kölner Dom ist. Daher: **stilistische Referenz akzeptiert**, nicht architektonisch vermessen, nicht meter-/OSM-kalibriert, nicht als City-Override integriert.

Die akzeptierte Quelle bleibt unverändert: `prototypes/koelner-dom/v0.2/index.html`, Blob `c0a3fd9d01b137f7819b3c90e5247a88686599aa`, SHA-256 `122960a8870f79c6c78d8b87fe01aedc73c2b469e4306e1900936528bf25c5c6`.

**DECISION — Nutzerauftrag:** Zusätzliche berühmte Bauten und Orte, gemeinsame Größenlogik und Materialzonen untersuchen. Genannt: Eiffelturm, Gizeh, Kreml, Pentagon, Stonehenge. OSM Hürth/Ehrenfeld und vorhandene Styles berücksichtigen. Verwitterung, Papier/Stoff und vorhandene Repo-Texturen ausdrücklich später.

Die frühere Chat-Antwort mit der Überschrift DECISION war teilweise nur ein Vorschlag des Assistenten: Sie begründet insbesondere keinen neuen Framework-/Registry-/Movement-Owner. Der jetzige Slice liefert drei konkrete Modelle, keinen Architekturumbau.

## 2 · Gelesener aktueller OSM-Anschluss

Owner: [`tools/osm-city-lab/`](../../osm-city-lab/README.md). Bestehende Desktop-Einweisung: [`WORK_LEAD_HANDOFF.md`](../../../skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/WORK_LEAD_HANDOFF.md).

- Ehrenfeld v0: Ursprung `50.949425, 6.917500`; ca. 659 × 596 m; 372 Road-Parts, 1.808 Gebäude.
- Hürth v0: Ursprung `50.865900, 6.877000`; ca. 700 × 700 m; 164 Road-Parts, 700 Gebäude.
- Der Consumer benutzt Meter und **+X east / +Y up / +Z north**. Die vorhandene `makeLocalENU`-Implementierung wird direkt importiert, nicht nachgeschrieben.
- `clean`, `cartoon`, `grotesque` sind bestehende Massing-/Präsentationsmodi. Das ist keine Freigabe, Landmark-Geometrie automatisch zu verbiegen. S2 bleibt undeformiert.
- Farben kommen aus `tools/osm-city-lab/styles/kfb-city-v0.json`; Zugriff über vorhandene `materialPalette` / `pickStable`.
- Der bestehende [`LANDMARK_OVERRIDES.md`](../../osm-city-lab/docs/LANDMARK_OVERRIDES.md)-Vertrag ist der Zielanschluss. Dessen Manifest war beim Lesen leer. Keine Einträge wurden von diesem Slice hineingeschrieben.
- Die Verbindung Ehrenfeld–Hürth ist im gelesenen Stand **SOURCE BLOCKED / RETRYABLE**, öffentliche Overpass-Ausfälle. Kein erfolgreiches Routen-JSON oder fahrbarer Korridor wird hier behauptet. Keine erneute Overpass-Abfrageserie gestartet.

Konkrete gelesene Blob-Pins stehen in [`sources.json`](../landmarks/pilot-01/sources.json). Das sind Audit-Pins. Der Repo-Viewer importiert die gemeinsame Quelle relativ und folgt damit dem ausgecheckten Stand; ein Produktionsconsumer muss seinen vollständigen Quellstand pinnen.

Dropbox wurde gelesen: `/Mac/Downloads/KFB_Huerth_Stunt_Concept.md`, geändert 2026-09-18 15:05:38 UTC. Dieses Konzept nennt u.a. 1.500-m-Abfrage, Blender und BOX1/Ground-8-Begriffe. Es ist **Konzeptinput**, kein Ersatz für den neueren City-/Travel-/Race-Vertrag. Keine Dropbox-Datei verändert oder in eine zweite SSOT kopiert.

## 3 · Tatsächlich implementierter Slice

Einstieg: [`landmarks/pilot-01/index.html`](../landmarks/pilot-01/index.html). Browserquelle über einen statischen Host öffnen; GitHub selbst zeigt HTML als Quelltext.

| Modell | Dreiecke | Materialmeshes | Einordnung |
| --- | ---: | ---: | --- |
| Eiffel Tower | 6.060 | 6 | 330 m Höhe / 125 m Basis / Deckhöhen 57, 115, 276 m nach Betreiberquelle; Gitterdichte, Bogen- und Zwischenformen vereinfacht |
| Giza pyramids | 342 | 4 | Drei Hauptpyramiden als Originalhöhen-Studie; heutige Ruinenhöhe, Terrain und exakte Anordnung nicht rekonstruiert |
| Stonehenge | 1.596 | 4 | Schematische Ruinenformation; gebrochener Außenring und innere Trilithen; keine archäologische Stein-ID-/Lagevermessung |

Referenzen und Modellannahmen sind pro Objekt getrennt in `sources.json` dokumentiert. Keine Sketchfab-Meshes übernommen; kein img2threejs-Forge-Lauf. Die Zeichensprache wird durch handgeschriebene parametrische Geometrie erzeugt.

**Viewer:** drei Einzelmodelle, Same-scale lineup, Orbit/Ansichten, Wireframe, Grid, Farbmodi, einzelne Zonen-Farbwähler, Reset Colours, GLB-Export. UI liegt außerhalb der Modellfläche. Licht und Schatten sind im WebGL-Viewer implementiert, aber hier nicht browserbestätigt.

**Gleicher Maßstab:** 1 Einheit = 1 m. Die Kamera passt ihren Ausschnitt an, nicht die Modellskalierung. Die Vergleichsreihe verschiebt nur Modelle; sie ist keine Landkarte. Deshalb wirkt Stonehenge neben dem 330-m-Turm tatsächlich sehr klein. Viewer-Boden und Kamera gehen nicht in GLB ein.

**Fabrik:** `createLandmarkGroup(THREE, asset, colours)` nimmt die THREE-Instanz des Hosts entgegen. Kein zweiter Renderer oder Versions-Owner im Consumer. Viewer allein verwendet Three.js 0.160.0 wie City Lab; akzeptierter Dom v0.2 mit seiner bisherigen Abhängigkeit bleibt unberührt.

## 4 · Zonen und Styles

Schema des Donors: `structure`, `secondary`, `upper`, `accent`, `glazing`, `base`. Nicht jedes Objekt benötigt alle sechs Zonen. Unterteile bleiben in der Baubeschreibung benannt; für die Laufzeit werden sie pro Zone zu höchstens sechs Meshes zusammengefasst.

| Donorzone | Bezug auf vorhandene City-Palette |
| --- | --- |
| structure | buildingPale; beim Eiffelturm buildingIndustrial |
| secondary | buildingWarm |
| upper | roof |
| accent | accent |
| glazing | window |
| base | sidewalk |

Modi: **OSM City palette** (gemeinsame Originalquelle), **Natural materials** (lokale neutrale Alternative), **KFB colour study** (lokale bunte Alternative), **Material zone IDs** (Diagnose).

Palette ist von der Form getrennt. `massingDeformationSupported=false`: clean/cartoon/grotesque dürfen nicht ungeprüft alle Turmstreben oder Monolithen verformen. Verwitterung, Papiere, Stoffe, Edge-03-Textur und Decals bleiben DEFERRED; nichts davon ist als gefunden/integriert behauptet.

## 5 · OSM-Bridge: vorbereitet, nicht eingebaut

`osm-bridge.mjs` konsumiert die vorhandene Override-Entry-Form. Es prüft passende OSM-ID, Commit-Form, Maßstab, Achsen, Fallback-Policy, übergebenen Footprint-Schwerpunkt und Receiver-BBox; es berechnet eine **Platzierungsvorschau** im bestehenden lokalen Meterraum.

Es lädt noch kein Override, prüft nicht die Existenz des angegebenen Assets und versteckt niemals das Basisgebäude. Rückgabe bleibt `keepBaseBuilding=true`. Eine korrekte Commit-Zeichenfolge ist kein Provenienzbeweis.

Alle drei realen Muster haben bewusst `osmBinding:null`. Keine erfundenen OSM-IDs, keine als echt deklarierte Eiffel-/Gizeh-Platzierung in Hürth. Die Test-ID 123 und Null-Commit sind ausdrücklich synthetische Fixtures, keine Produktdaten.

Für den tatsächlichen Dom-Einbau braucht der empfangende OSM-/Desktop-Lead einen Kartenausschnitt, der den verifizierten Dom-Footprint enthält. Dann: Quell-ID → Schwerpunkt/Orientierung → Maße/Kalibrierung → gepinntes Asset → Fit- und Ladeprüfung → erst dann Basisdarstellung ausblenden. Eine bewusste surreale Miniaturenplatzierung wäre ein gesonderter Dekorationsauftrag, keine Georeferenzierung.

## 6 · Teststand und Grenzen

**TESTED RESULT:** `node tests/check_landmarks_p01.mjs` lief mit **111/111 PASS**. Geprüft: deterministische erzeugte Positionen, endliche Werte, positive Volumina, geschlossene konsistent orientierte Einzelkörper, keine entarteten Dreiecke, Meter-/Bodenbezug, Zonenzahl, GLB-Header/Geometrieanzahl/Materialzonen, Guard-Fälle für beide vorhandenen Stadtkoordinaten.

Die Geschlossenheit einzelner Bauteile beweist kein global verschweißtes oder kollisionsfreies Gebäudemesh. Überlappende tragende Teile und gemeinsame Pyramidenschicht-Grenzen sind nicht weggebooleant.

**TESTED RESULT:** Alle drei tatsächlichen GLB-Dateien mit `trimesh` unabhängig wieder eingelesen. Dreieckszahlen und 6/4/4 Materialmeshes bleiben erhalten; maximale BBox-Abweichung durch Float32 unter 0,000007 m. Das ist kein vollständiger Khronos-Validatorlauf oder ToolBox-/City-Importtest.

**VISUAL REVIEW — CPU:** Drei Vorschaubilder wurden aus exakt denselben Vertices mit einem unabhängigen CPU-Rasterizer erzeugt und angesehen. Kein KI-Mockup, aber auch kein Three.js-/Browser-Screenshot. Diese Bilder und die erzeugten GLBs liegen im Downloadpaket; keine entsprechenden Binärpfade auf GitHub werden behauptet.

**BROWSER UNVERIFIED:** System-Chromium/Playwright verweigerte den lokalen Seitenaufruf vor Einstieg mit `ERR_BLOCKED_BY_ADMINISTRATOR`; der Netzabruf scheiterte an DNS. Keine Umgehung und kein WebGL-/Interaktions-/Mobile-PASS. Syntaxcheck des gebündelten JS bestanden.

[Messwerte, Hashes, Roundtrip-Zusammenfassung](../evidence/2026-09-18-landmark-pilot/summary.json). Vollständige Checkliste wird durch das Testskript reproduziert und ist im Downloadpaket enthalten.

Standalone-Build: `python tests/build_landmark_standalone.py <output.html>` durch ausführenden Agenten. Paket enthält die zur Buildzeit gelesene gemeinsame Palette als markierten Snapshot, nicht als neue kanonische Styles-Datei. Gemessener Einzeldatei-Build: 30.548 Bytes, SHA-256 `9de64a58dcbcfdaee40f88b697523712f962353547f85c0920b2aa4be2d3ffb2`. Laufzeit benötigt Zugriff auf die gepinnten Three.js-CDN-Module.

## 7 · Nächster ausführbarer Schritt / Zuständigkeiten

1. Diese drei Kandidaten im echten Browser ansehen: Silhouette, Farbwechsel, Größenvergleich und GLB-Rückimport in einem vorhandenen Viewer. Georgs Abnahme gilt bisher nur für die frühere Dom-Stilprobe.
2. Dom als erstes **reales** OSM-Override vorbereiten; seine bestehenden Kunstmaße nicht stillschweigend zu Metern erklären. Footprint-/Höhenkalibrierung in separater Fassung, akzeptierte Datei bewahren.
3. Bestehenden OSM-Override-Loader/Fallback im empfangenden Strang fertig prüfen. Erst danach Travel-/Free-Roam-Interaktion. Keine parallele Kamerabewegung, Kollision oder Save-Architektur aus diesem Lab.

Pentagon und Kreml bleiben angeforderte weitere Beispiele, nicht gestrichen. Dom-Detailtreue ist der nächste Hero-/Golden-Sample-Schritt; Weathering bleibt dahinter. Ein vollständiges Golden Sample erfordert zusätzlich Source-/Scale-/Placement-/Reimport-Nachweise.

Nur `tools/img2threejs/` wurde verändert. Der zentrale Router, City-Lab-Quellen/Styles/Manifest, Free-Roam-/Travel-/Race-Implementierungen, Registry und Deployment-Konfiguration bleiben unverändert. Dieser Return ist der GitHub-lesbare Übergabepunkt für den lokalen Desktop-KFB-Chat; es wird keine direkte Chat-zu-Chat-Nachricht behauptet.
