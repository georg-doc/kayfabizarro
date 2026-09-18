# Changelog · KFB img2threejs

Additive Historie. Neue Ereignisse ergänzen; alte Bewertungen nicht rückwirkend in Erfolge umschreiben. Einstieg: [README](README.md) · Aktueller Arbeitsstand: [Living Doc](docs/LIVING_IMG2THREEJS.md).

## 2026-09-18 · 01 · Externe Idee und KFB-Einordnung

**PROPOSAL / SOURCE REVIEW:** Georg brachte `img2threejs/img2threejs` als Tool-Idee ein. Im Chat wurden prozeduraler Nachbau aus Referenzen, stufenweise Spezifikation und Renderprüfung diskutiert. Mögliche KFB-Anwendungen: eigene Props, bewegliche Hindernisse, kontrollierte Varianten und referenzgestützte Montage vorhandener Repo-Assets.

**Abgrenzung:** Keine Installation, kein Fork, kein eigener erfolgreicher img2threejs-Lauf und keine ToolBox-Integration. Vorhandene GitHub-Assets sollen nicht automatisch neu modelliert werden.

## 2026-09-18 · 02 · Erster Dom-Entwurf im Chat

**DECISION:** Georg fragte nach einem einfachen Low-Poly-Modell des Kölner Doms und nach einer Umsetzung hier im Webchat.

**IMPLEMENTATION / danach ARCHIVED HISTORY:** `koelner_dom_lowpoly_threejs.html` wurde als einzelner handgeschriebener Three.js-Prototyp erstellt. Keine Bildmessung und kein eigener img2threejs-Generierungslauf. Die ursprüngliche Antwort enthielt nur einen Dateipfad statt eines anklickbaren Downloads.

**UNVERIFIED:** Die damalige Aussage zur Browserfähigkeit war nicht durch einen Browserlauf belegt. Die erneute Quellprüfung fand die fehlende Import-Map für den Bare-Specifier `three` in OrbitControls. Die Geometrie ist ein grober Entwurf, keine vermessene Dom-Rekonstruktion.

## 2026-09-18 · 03 · GitHub-Arbeitsbereich angelegt

**DECISION — ausdrücklicher Benutzerauftrag:** Ablage unter `georg-doc/kayfabizarro/tools/img2threejs/`, passende Unterordner, additive Fortführung und Berücksichtigung von `skills/chat/`.

**IMPLEMENTATION:** README mit Recovery-Einstieg, Living Doc, Browser-Einstieg, versionierter Prototyp, Originalarchiv, Quellprüfungen und Prüfnachweise angelegt. Ausschließlich neue Dateien in diesem Arbeitsbereich; keine Änderung an zentralem Router, Hub, Deployment, Librarian oder ToolBox-Owner. Die Race-Implementierungs-SSOT bleibt unverändert.

**ARCHIVED HISTORY:** Das ursprüngliche HTML wurde bytegetreu gesichert. Archiv-Commit: `95eafc4fdd3e9f4d1edc15fccc10eae317aa7426`; Original-SHA-256: `7df3afec91969eaed56b42f28b7b9f04acebfad4e04dab54d165389874c70e49`.

**IMPLEMENTATION — Viewer v0.1.0:** Neue separate HTML-Fassung mit gemeinsamer Three.js-/Addon-Import-Map auf 0.161.0, dynamischen Imports, sichtbarem Fehlerzustand, englischer Oberfläche, Reset-View, Wireframe-Schalter, modellbasierter Kameradistanz samt Nebelabständen und Diagnoseobjekt. Quell-Commit: `8cc32094e3575b266a77a90d8df9663766675471`.

Die Geometrie und Materialien bleiben gegenüber dem Original unverändert. v0.1 ist eine Viewer-Korrektur und kein neuer Geometrie- oder Genauigkeits-PASS.

**TESTED RESULT — Quellprüfungen:** 10/10 statische Checks bestanden, einschließlich Archiv-Identität, identischem Modellbau-Block, Import-Zuordnung und JavaScript-Syntax. [JSON-Ergebnis](evidence/2026-09-18/static-checks.json).

**UNRESOLVED — Browserprüfung:** CDN-Zugriff aus dem Arbeitscontainer scheiterte; der anschließende lokale Browser-Dateiaufruf wurde durch die Browserrichtlinie blockiert. Kein erfolgreicher Render, keine echte Screenshot-Evidenz und kein bestandener Fehlerpfadtest. [Vollständiger Prüfbericht](evidence/2026-09-18/TEST_REPORT.md).

**SOURCE CHECK — Dropbox:** Exakte Suche nach `img2threejs` ohne Treffer. Keine Dropbox-Dateien verändert und keine zweite Arbeitsablage angelegt.

**DEFERRED / OPEN:** Erfolgreicher Browserlauf; Referenzvergleich und geometrische Überarbeitung; tatsächlicher GLB-Export; ToolBox-/World-/Race-Roundtrip; öffentliches Deployment; Georgs visuelle Abnahme. Diese offenen Schritte werden nicht durch die Repo-Ablage oder einen Syntax-PASS als erledigt behandelt.

## 2026-09-18 · 04 · Sichtbarer Dachfehler / Low-Poly-Stil erhalten / v0.2

**USER EVIDENCE:** Georgs Screenshot zeigt den laufenden vorherigen Viewer mit herausragenden Dachpyramiden. Meldung: Modell mit den Dreiecken broken; die einfache ursprüngliche Stilrichtung könnte nach Geometriekorrektur für KFB passen. Kein GEORG PASS für die fehlerhafte Geometrie und keine finale Stilabnahme.

**DECISION / Arbeitsrichtung:** Den vorhandenen reduzierten Stil erhalten und die Grundgeometrie reparieren, nicht durch ein detailliertes Modell ersetzen. Beide früheren HTML-Fassungen bleiben unverändert.

**IMPLEMENTATION:** Separater [v0.2-Kandidat](prototypes/koelner-dom/v0.2/index.html), Quell-Commit `3df61d811e2bbb51af80ff8cb38d3a79b627ffe4`: geschlossene Dachprismen, angeschlossenes Kreuzdach, korrigierte Wand-/Dachhöhen, aufliegende kleine Spitzen, Endpunkt-Streben und passend dimensioniertes Fundament. Unbegründete horizontale Stangen entfernt. Hauptturm-Dimensionen, achtseitige Hauptspitzen, Materialien und Licht bleiben erhalten. Bedienfeld außerhalb der Modellfläche; Ansichtsbuttons ergänzt.

**TESTED RESULT — statisch / numerisch:** 53/53 Prüfungen an den echten Dach-Datenfunktionen und der vollständigen Modulsyntax bestanden. Zehn Dachkörper mit zusammen 86 Dreiecken; geschlossene konsistent orientierte Einzelkörper und vier übereinstimmende Dachanschlüsse. [Ergebnis](evidence/2026-09-18-v0.2/geometry-checks.json) · [Prüfbericht](evidence/2026-09-18-v0.2/TEST_REPORT.md).

**SOURCE INVENTORY — keine Browsermessung:** Berechnetes Modell-Indexbudget von 1499 auf 1142 Dreiecke reduziert, ohne Boden/Platz/Kontextwürfel. Der ursprüngliche Entwurf war bereits polygonarm. Vollständige Herleitung im Prüfbericht; daraus folgt kein Performance-PASS.

**UNRESOLVED:** Neue Browser-Umgebungsprobe wurde vor Seiteneinstieg durch `ERR_BLOCKED_BY_ADMINISTRATOR` blockiert. Kein eigener v0.2-WebGL-Frame, kein Mobile-/Interaktions-PASS, keine visuelle oder Consumer-Abnahme. Die erfolgreiche mathematische Dachprüfung wird nicht zum Gesamtmodell-PASS erklärt.

**CURRENT NEXT:** v0.2 öffnen und Ansichten / Dachanschlüsse / Spitzen prüfen. Weitere Details erst nach Beurteilung dieser Grundgeometrie. README und Browser-Einstieg verweisen auf den neuen Kandidaten; v0.1 bleibt Vergleichs-/Fehlerhistorie. Keine Änderungen an fremden Modul-Ownern, zentraler Registry, Deployment oder Race-Implementierung.

## 2026-09-18 · 05 · Dom-Look akzeptiert / OSM-Abgleich / Landmark Pilot 01

**GEORG VISUAL ACCEPTANCE:** Georg akzeptierte anschließend ausdrücklich die cartoonige Abstraktion, Glaubwürdigkeit und Materialwirkung des reparierten Dom-v0.2-Modells. Seine Einschränkung zur noch fehlenden Dom-Detailtreue bleibt bestehen. Das ist eine Stil-/Formabnahme, kein vermessener Metermaßstab oder OSM-/Consumer-PASS. Die akzeptierte HTML-Datei wurde nicht verändert.

**DECISION — Nutzerauftrag:** Landmark-Varianten und Materialzonen mit dem vorhandenen Hürth-/Ehrenfeld-OSM-Strang abstimmen; Geometrie zuerst, Weathering/Repo-Texturen später. Genannte weitere Bauten: Eiffel, Gizeh, Stonehenge, Pentagon, Kreml. Die frühere Framework-/Build-Order-Empfehlung des Assistenten war PROPOSAL, kein neuer Owner-Vertrag.

**SOURCE REVIEW:** City Lab, reale Meterprojektion, gemeinsame Palette, LANDMARK_OVERRIDES, leeres Manifest, S2-Consumer-Vertrag und Desktop Work Lead Handoff gelesen. Ehrenfeld–Hürth-Korridor im gelesenen Stand SOURCE BLOCKED / RETRYABLE; kein erfundener Lückenschluss. Dropbox-Hürth-Konzept als Input gelesen, nicht über GitHub-Implementierung gestellt. Keine Fremd-Owner- oder Dropbox-Dateien verändert.

**IMPLEMENTATION:** [Landmark Pilot 01](landmarks/pilot-01/index.html) mit Eiffelturm, drei Gizeh-Pyramiden und schematischem Stonehenge. Gemeinsame Metergeometrie, maximal sechs Materialmeshes, Farb-/Zonendiagnose, Same-scale lineup, GLB-Export und eine ausdrücklich nur vorbereitende OSM-Platzierungsprüfung. City-Palette und Projektion werden direkt vom bestehenden Owner importiert. Keine Kopie in eine zweite Registry, kein City-/Travel-Loader-Mount und kein Movement-Owner.

**TESTED RESULT:** 111/111 ausführbare Geometrie-/Export-/Placement-Guard-Prüfungen PASS; 6.060 / 342 / 1.596 tatsächliche Modelldreiecke. Drei erzeugte GLBs unabhängig mit trimesh wieder eingelesen, Geometriezahlen und Bounds erhalten. Acht Pilot-Quelldateien per Git-Blob mit GitHub-main-Readback identisch zum geprüften lokalen Stand.

**VISUAL EVIDENCE — CPU, nicht Browser:** Drei Vorschauen aus denselben erzeugten Vertices gerastert und angesehen. Kein KI-Mockup, kein WebGL-PASS. Ein herunterladbarer Einzeldatei-Viewer sowie GLBs und Vorschauen wurden erzeugt. Die Binärdateien sind abgeleitete Downloadartefakte, keine hier behaupteten neuen GitHub-Modellpfade.

**UNRESOLVED:** Browseraufruf in dieser Umgebung vor Einstieg mit ERR_BLOCKED_BY_ADMINISTRATOR verweigert. Kein neuer WebGL-/Mobile-/Interaktions-PASS, keine Human-Abnahme dieser drei Kandidaten, keine City-Integration und kein bestätigtes öffentliches Deployment. OSM-Bindungen bleiben null; keine echten IDs oder Ausrichtungen erfunden.

**CURRENT RETURN / Living Addendum:** [Landmark ↔ OSM ↔ Desktop Work Lead](docs/LANDMARK_OSM_RETURN_2026-09-18.md). [Messwerte und Hashes](evidence/2026-09-18-landmark-pilot/summary.json). Nächster Schritt: Browseransicht / menschliche Beurteilung, anschließend Dom-Maßstab und realen OSM-Footprint separat kalibrieren; Fallback unter bestehendem City-Vertrag prüfen. Pentagon, Kreml und Dom-Detailtreue bleiben im Auftrag, Weathering bleibt nachgeordnet.

## 2026-09-18 · 06 · Pentagon / Spasskaja / Kreml-Mauerstudie · WSA-Check-in

**DECISION — Nutzerauftrag:** Weitere ikonische Landmarks erstellen und für den bestehenden WSA Lead auf GitHub einchecken. Aus dem erhaltenen Auftrag werden Pentagon und Kreml als zwei neue Objektfamilien bearbeitet.

**IMPLEMENTATION:** Separater [Pilot 02](landmarks/pilot-02/index.html) mit Pentagon, einzelnem Spasskaja-Turm und derselben Turmgeometrie mit zwei modularen Mauerflügeln. Der Viewer zeigt außerdem unverändert die drei Pilot-01-Modelle; die akzeptierte Dom-v0.2-Datei bleibt unberührt. Gemeinsame Metergeometrie, vorhandene City-Palette, einzeln färbbare Zonen, Größenvergleich und bestehender GLB-Exporter. Kein neues Registry-/Movement-/Style-System.

**SOURCE REVIEW:** Bestehender WSA-Recovery-Einstieg und OSM-Landmark-Override-Vertrag gelesen. Dropbox-Travel-Landmark-Export als historische Referenz geprüft, nicht zum neuen Owner erklärt. Referenzmaße versus Modellannahmen in `landmarks/pilot-02/sources.json` getrennt. Die Kreml-Mauern sind schematisch; kein vollständiger Kreml, keine Basilius-Kathedrale und keine behauptete OSM-Verortung.

**TESTED RESULT:** 176/176 ausführbare Prüfungen bestanden: reale Produktionsgeometrie, geschlossene konsistent orientierte Einzelbauteile, keine entarteten Dreiecke, offene Pentagon-Mitte und Toröffnung, vier Zifferblätter, Meter-/Bodenbezug, Paletten und GLB-Struktur, unveränderte Pilot-01-Geometrien. Neue Modellbudgets: Pentagon 11.384 Dreiecke / 4 Materialmeshes; Turm 3.496 / 5; Mauerstudie 5.008 / 6. Drei neue GLBs unabhängig wieder eingelesen; größte BBox-Abweichung unter 0,000008 m. Sechs neue Pilot-Quelldateien per Git-Blob nach GitHub zurückgelesen und byteidentisch zum lokalen Stand bestätigt.

**VISUAL EVIDENCE / OPEN:** CPU-Vorschauen aus denselben Koordinaten gerendert und angesehen. Browserprobe vor Einstieg durch `ERR_BLOCKED_BY_ADMINISTRATOR` blockiert; kein neuer WebGL-, Interaktions-, Mobile- oder Consumer-PASS. Keine automatische Human-Abnahme aus dem allgemeinen „gerne weiter“ abgeleitet. Dateiexport und Repo-Ablage sind keine City-Integration.

**CURRENT RETURN / WSA:** [Pilot 02 · WSA Lead Return](docs/LANDMARK_PILOT_02_WSA_RETURN_2026-09-18.md). [Messwerte und Grenzen](evidence/2026-09-18-landmark-pilot-02/summary.json). Quellen und Tests bleiben hier; ein separater Quellenzeiger wird im bestehenden Race-`_handover` abgelegt. Kein WSA-Status und keine Runtime-Zuständigkeit werden ersetzt. Verwitterung und Texturen bleiben DEFERRED; nächster Gate ist die sichtbare Beurteilung, danach gezielte Detail-/LOD-Arbeit und echter Dom-OSM-Fit.


## 2026-09-18 · 07 · OSM grotesque source audit / Landmark Pilot 03 / Giza voxel study

**USER DIRECTION:** Georg asked to inspect the grotesque/cartoon deformers used by the Hürth + Ehrenfeld OSM terrain slice, test that visual language as a landmark view/mode, push it toward a surreal cubist / rounded cartoon read, and assess stepped voxel / LEGO-like pyramids.

**SOURCE REVIEW:** Current City Lab source confirms that `grotesque` is not just a palette. It combines object-normalized geometry deformation with a separate wide camera treatment. Current City preset: verticalSteps 8, bend .105, lean .09, taper .22, twist 11°, stackSteps 7, stackShift .065. The older shared `kfb-cartoon-deform.js` was also read: one shared bounding frame per multi-mesh prop and a <4-Y-ring fallback are load-bearing rules. Existing `skills/kfb-box-material.js` and the real `media/3D_Assets/KFB/edge3.jpg` donor were verified for later voxel/material work.

**IMPLEMENTATION:** Additive [Pilot 03](landmarks/pilot-03/index.html), leaving Pilots 01/02 and accepted Dom v0.2 untouched.
- `BASE`
- `CITY GROTESQUE · exact` — reuses current City `cityCartoonParams/deformPoint` and its grotesque preset; viewer uses the grotesque wide lens.
- `SOFT CUBIST · rounded` — same normalized grammar plus a reversible mid-body bulge.
- `GIZA VOXEL STEPS` — existing authored Giza course bounds become square slabs.
- `GIZA BOXEL` — macro-block study with actual gaps; intentionally LEGO-like massing without toy studs.

**TESTED RESULT — source/numerical only:** 57 exact source-evaluation checks + 3 syntax/reference checks PASS. All six normal landmarks keep triangle count and ground anchor under City Grotesque / Soft Cubist. Giza Voxel Steps = 360 triangles and preserves the full base envelope. Giza Boxel = 15,552 triangles and remains ground anchored. Non-Giza voxel requests fail safe to Base. [Evidence](evidence/2026-09-18-landmark-pilot-03/summary.json).

**OPEN:** No new WebGL/browser/mobile or consumer PASS. No City S2 geometry, landmark manifest, OSM identity, collision, Travel/Race runtime or Registry owner was changed. Coarse solids can still shear instead of curve; vertical subdivision remains a later quality lever. edge3 / KFB box-material integration, studs and weathering stay after the geometry/look gate.

**CURRENT ANALYSIS:** [Deformer modes source analysis](docs/DEFORMER_MODES_ANALYSIS_2026-09-18.md).
