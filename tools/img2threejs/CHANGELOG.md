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


## 2026-09-19 · 08 · Landmark Group Rig v1 / living-toy preview

**USER EVIDENCE:** Georg's Pilot-03 screenshot showed Spasskaya/Kremlin clock assemblies visually separating from the grotesquely deformed tower body. Georg asked for object groups, grouped cubist/Nickelodeon-style deformation, living-toy beat/vibe/impact reactions and additive GitHub persistence for WSA review.

**BOUND SCOPE:** [Slice contract](landmarks/pilot-04/SLICE.md). One implementation slice only: Spasskaya + Kremlin wall semantic rig and presentation reactor. Area 51 / JFK / Atlantis / Acropolis remain separately documented PROPOSAL ideation.

**IMPLEMENTATION:** [Pilot 04](landmarks/pilot-04/index.html).
- `towerCore`
- four `clock:0..3` `rigidAttached` groups
- `wall:left/right`
- `secondarySoft`
- explicit clock anchors and sampled local deformation bases
- Legacy vs Grouped A/B
- Base / City Grotesque / Soft Cubist
- Idle breathing / synthetic Disco beat / Impact L/R preview
- optional rig-anchor helpers
- GLB export of the currently selected rigged geometry

The clock groups no longer receive independent point deformation. Their host anchor is transformed through the same City/Soft-Cubist field, then the clock geometry follows a rigid orthonormal local basis.

**TESTED RESULT:** 212/212 current-source evaluation checks PASS. Grouped clocks preserve anchor-relative vertex distances to floating-point noise (~4e-15 m). The same legacy pointwise deformation changes those distances by about 0.24–0.44 m in the four tested grotesque/soft cases. Triangle counts remain 3,496 (Spasskaya) / 5,008 (Kremlin study), ground remains anchored, reactor math remains bounded, and viewer source / required controls parse. [Evidence](evidence/2026-09-19-landmark-rig-v1/summary.json).

**BOUNDARY:** `bumperProfile` is metadata only. No collision/bounce force, movement, camera, terrain, persistence or audio runtime was created. Disco preview is a synthetic signal source. City S2 physics/export geometry and OSM landmark manifest remain unchanged.

**IDEATION / DEFERRED:** The North Star and future scenic candidates are persisted in [Living Toy World ideation](docs/IDEATION_LIVING_TOY_WORLD_2026-09-19.md): Acropolis, Area 51 + crashed UFO, JFK/Dealey-style source-backed scenario, underwater Atlantis / general impossible-geometry architecture. `kfb-box-material` + `edge3.jpg` remain the next surface-layer donor, not silently folded into this rig slice.

**OPEN:** successful browser/WebGL evidence for Pilot 04; Georg visual choice between Grouped City Grotesque and Grouped Soft Cubist; later receiver-side Audio and Race/Travel contact seams.


## 2026-09-19 · 09 · Standalone v1.1 packaging regression fix

**USER EVIDENCE:** Georg opened the downloadable single-file Rig v1 viewer and got: `Viewer could not start: mulberry32 is not defined`.

**ROOT CAUSE:** The chat-generated standalone embedded the City helpers under prefixed names (`cityMulberry32`, `cityStableHash`, `cityDeformPoint`) but the newly injected Rig block still called the module-source names. The modular GitHub Pilot-04 source imported those helpers correctly, so this was a standalone packaging seam rather than a grouped-rig math failure.

**FIX:** `pilot-04/rig.mjs` now uses explicit City helper aliases in its actual source import:
- `deformPoint as cityDeformPoint`
- `stableHash as cityStableHash`
- `mulberry32 as cityMulberry32`

All internal Rig calls use the aliased names, making the source itself safer for future standalone bundling.

**TESTED RESULT:** The repaired downloadable artifact `KFB_Landmark_Group_Rig_v1_1.html` passes Node module syntax plus six packaging guards: no unprefixed helper calls remain and all three embedded prefixed helpers are defined. Core Rig geometry was re-evaluated for Spasskaya/Kremlin × Base/Grotesque/Soft-Cubist; triangle counts, four attachments, ground anchor and ~4e-15 m maximum rigid-clock error remain unchanged. [Regression evidence](evidence/2026-09-19-landmark-rig-v1-1/standalone-regression.json).

**BOUNDARY:** This fixes the reported startup ReferenceError. Successful WebGL visual rendering remains a separate browser/human gate.


## 2026-09-19 · 10 · v1.2 rejected by screenshot · Semantic Band Rig v2 rebuild

**USER EVIDENCE / REJECTION:** Georg opened the v1.2 surface-socket standalone and supplied another screenshot. The clocks still floated / separated from the deformed tower. Georg explicitly required detailed analysis, a new concept, a clean rebuild and screenshot evidence before claiming success.

**ROOT CAUSE — measured against the rendered host, not the socket itself:** The v1.2 QA proved that each clock remained rigid around its own sampled socket. It did **not** prove that the socket remained on the actually rendered coarse `clock-stage`. Re-evaluation against the true transformed host triangles reproduced the failure: the four v1.2 sockets sat approximately **2.162 m / 3.784 m / 2.436 m / 3.457 m** from their intended rendered faces in City Grotesque.

The mismatch is structural: v1.2 sampled a continuous deformation field at a free socket point while the visible host is a coarse eight-corner box with discrete grotesque stack offsets. A better socket cannot repair two different deformation representations.

**DECISION / NEW CONCEPT:** Replace socket-driven attachment with **Semantic Affine Bands**. [Pilot 05 slice](landmarks/pilot-05/SLICE.md).

Bands:
- `lower` — lower tower / gate / walls;
- `clock` — lower hip roof, clock-stage, four clock assemblies, gables and pinnacles;
- `belfry` — belfry;
- `tent` — tent / ribs / star.

Each band receives one fitted affine transform derived from the City/Soft-Cubist field. The visible `clock-stage` **and every `clock-*` part use exactly the same clock-band transform**. The lower band's X/Z basis stays horizontal so its authored Y=0 ground plane remains terrain-anchored.

**IMPLEMENTATION:** [Pilot 05 · Band Rig v2](landmarks/pilot-05/index.html), with:
- Band Rig v2 vs legacy point-deform A/B;
- Base / City Grotesque / Soft Cubist;
- semantic-band diagnostic colours;
- real Three groups/pivots per band;
- idle / synthetic disco / impact presentation reactor;
- host-standoff diagnostics in the viewer;
- GLB export of current generated geometry.

**TESTED RESULT — current GitHub source:** **159/159 PASS** in the latest source evaluation. Spasskaya remains 3,496 triangles and Kremlin wall 5,008; min Y stays exactly 0. Source clock back-plane standoff is 0.080 m. Spasskaya City Grotesque transforms it to ~0.071586 m on all four sides with max mount error ~2.13e-15 m; Soft Cubist gives ~0.084910 m with max error ~1.31e-15 m. [Evidence summary](evidence/2026-09-19-landmark-band-rig-v2/summary.json).

**VISUAL TESTED RESULT — exact generated vertices:** A deterministic CPU z-buffer/triangle renderer was used on the production vertices. Same-camera before/after, plus front/right/oblique views, were visually inspected. The old v1.2 render reproduces detached clocks; Band Rig v2 keeps the front and side clocks on the clock-stage assembly. The compact before/after proof is checked into GitHub: [Visual Evidence](evidence/2026-09-19-landmark-band-rig-v2/VISUAL_EVIDENCE.md).

**BROWSER LIMIT:** A real Chromium/WebGL probe was attempted in the agent container, but EGL/ANGLE initialization failed before a valid WebGL frame. No WebGL/browser PASS is claimed from that environment.

**PROTECTED BOUNDARIES:** City S2 collision/export geometry, OSM landmark manifest, Race/Travel contact/movement/physics, Audio runtime and Registry ownership remain unchanged. The living-toy/bump response is still a presentation donor / proposal seam, not a physics implementation.

**OPEN:** Georg visual review of the new Band Rig v2 standalone, then exactly one style choice: City Grotesque vs Soft Cubist as the landmark deformation baseline.


## 2026-09-19 · 11 · Band Rig v2 accepted · consolidated WSA review package / backlog

**GEORG ACCEPTANCE:** Georg opened the final Band Rig v2 standalone in a real browser and confirmed that the rebuilt attachment logic works and the result looks right. This supersedes the earlier Pilot-04/v1.2 rejection for the clock-attachment seam.

**ACCEPTANCE BOUNDARY:** accepted: Band Rig v2 attachment behaviour and current visible direction. Still OPEN: City Grotesque vs Soft Cubist as one default profile; OSM placement; Race/Travel contact; Audio beat integration; automated browser/WebGL regression; public Stage deployment.

**HANDOFF:** Added [WSA Review Package · Landmarks](docs/WSA_REVIEW_PACKAGE_LANDMARKS_2026-09-19.md) as the single consolidated review entry. It includes exact source pins, owner boundaries, status matrix, current tests/evidence, rejected history, known exporter limitation, WSA review checklist, recovery order and prioritized backlog.

**IMPORTANT OPEN TECHNICAL LIMIT:** the current GLB exporter still merges geometry by material zone through the Pilot-01 `mergeZones(asset)` path; semantic `lower / clock / belfry / tent` hierarchy is not yet preserved as GLTF nodes. This is explicitly P1 backlog rather than a completed export contract.

**BACKLOG PERSISTED:** OSM Dom golden sample; declarative landmark rig manifest; semantic GLB export; surface/material pass with existing KFB box material + edge3; Audio beat seam; Race/Travel bumper/contact receiver; instance-friendly living-toy environment reactions; Giza voxel/boxel material proof; Acropolis / Area 51 / JFK route / Atlantis future scenery; Stage deployment only after an accepted consumer exists.

**WSA REVIEW QUESTION:** For the first integrated OSM landmark baseline, choose City Grotesque or Soft Cubist deformation.
