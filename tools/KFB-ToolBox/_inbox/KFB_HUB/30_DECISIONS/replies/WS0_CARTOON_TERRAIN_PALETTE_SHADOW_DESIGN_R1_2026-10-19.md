# WS0 → WS1b / Claude Code · KFB Cartoon Relief: Organic Color Fields + real palette shadows · DESIGN R1

**Datum:** 19.10.2026 · **Quelle:** Georgs laufende Terrain-/Cartoon-Look-Diskussion mit Roadrunner/Canyon-Referenzbildern und expliziten Korrekturen bis „echte 3D-Schatten, keine runden gebastelten Schatten“.  
**Status:** GEORG DESIGN DIRECTION / ausführliche PLANUNG. **Nicht implementiert, nicht gerendert, kein humaner Screenshot-/Runtime-PASS.**  
**Einzelner bestehender Steuerungsowner:** WS0 / `KFB_HUB/30_DECISIONS` auf Register-Branch `docs/kfb-decisions-register-2026-10-11`. **Einziger produktiver Spiel-Owner:** WS1b / bestehender `kfb-planet`-R3F-Runtime, kein zweiter Renderer, Terrain- oder Material-Owner. Claude Code ist ein möglicher ausführender Agent **im vom Owner vergebenen Slice**, kein zweiter Runtime-Owner.  
**Bestehender Parent-Auftrag:** [Issue #439](https://github.com/georg-doc/kayfabizarro/issues/439), [WS0 Gesamtterrain Intake R1.2](WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md). Dieses Dokument präzisiert **Farbflächen/Schatten/Outlines innerhalb dieses Gesamtauftrags**, nicht nur einen Shadow-only-Prototyp. Seine noch nicht eindeutig gepinnten ursprünglichen Banden-/Rampen-POC-Details werden NICHT erfunden.

## 0 · Was Georg festgelegt und was er verworfen hat

### Beibehalten
1. Geländeform darf weiter durch ein vorhandenes Heightfield / WS1-Terrain entstehen, aber **Farbflächen folgen NICHT den Höhenstufen**. Grobe, zusammenhängende Flächen / geschwungene und lokal verformte Farbbahnen wie in klassischen Cartoon-Backgrounds.
2. **3–4 gebrochene Farben** einer Zone, breit und klar lesbar statt texturiertem Kleinteil-Rauschen. Organic Color Fields, nicht geologische Schnittkuchen-Horizontallagen.
3. Sparsame **farblich passende dunklere Kantenbetonung** an ausgewählten echten Landform-Brüchen/Kämmen/Terrassenkanten, **keine schwarze Gesamt-Tuscheoutline**.
4. Vorderer/unterer Bildbereich kann eine **große ruhige dunklere Farb-/Tonmasse** tragen – als grafische Kompositionsebene, nicht als pauschaler vertikaler Shader-Gradient, schwarze Vignette oder Fake-Schlagschatten.
5. **Alle Figuren, Racer, Props und Gelände werfen echte aus 3D-Geometrie/Beleuchtung berechnete Shadow-Map-Schatten**. Sie bewegen sich mit Animation, Fahr- und Flugzustand und folgen realen Empfängerflächen, auch bei Hang, Böschung, Rampe oder Felswand.
6. Der Schatten wird **auf die Palette des tatsächlichen empfangenden Materials/Bioms** abgebildet: im Canyon warmes Ocker-/Rost-/Umbra-Braun; andere Biome bekommen ihre eigenen Schatten-/Kontakt-/Kantenrollen. Lesbare, einfache, überwiegend harte flächige Cartoon-Schatten statt komplexer weich-verlaufender PBR-Penumbra.
7. Überlagerung/AO/Kontakt **gedeckelt und vereinfacht**; Schatten-Vervielfachung darf nicht zum schwarzen Schlamm werden. Bewahre Quellenasset-Knetform, Material Golden, Fahrgefühl und Lesbarkeit.

### Explizit ausgeschlossen
- Stufen-/Contour-Height-Banding wie ein Schichtkuchen als dominantes Farbschema.
- Gebastelte runde Ellipsen, Blob Shadows, transparente Shadow Discs, Bodenkleckse, projected circle decals und ähnliche Ersatzschatten **für Racer/Residents**, auch dann nicht, wenn sie günstig wären.
- Schwarze/graue Standardmultiply-Schatten als fertiger Stil, schwarze Toon-Outlines um jede Kante, globales Kantendetektieren aller Mesh-Dreiecke, Airbrush-/Vignette-Gradienten, Kameraklebe-Schattentexturen.
- Neue zweite World-/Camera-/Shadow-/Lighting-Engine, Copy/Paste einer fremden Cartoon-Marke oder Austausch von Joyride-/Clay-Golden ohne Gleichwertigkeitsbeweis.
- Umdeutung des gesamten #439-Auftrags zu einer Schatten-Einzelprobe. **Banden, nicht-höhenstufige Rampen, Terrainkörper und Fahrkontakt bleiben Teil des Parent-Gates.**

## 1 · Rendering-Schichten / Autoritätsgrenzen

| Schicht | Autoritative Quelle | Was neu hinzukäme |
|---|---|---|
| Geländehöhe, Kollisionssupport, Wege, nicht-stufige Rampen, Banden | bestehender WS1-World/Terrain/Track-Owner; Road/Track Core gemäß `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md` für deren Streckengeometrie | **keine neue Mesh-/Support-Wahrheit** |
| Grobe Oberflächen-Farbfelder | KFB Bühnen-/Biome-Palettenrollen, vorhandener V-305-Farbharmonie-Generator und WS1 Stage/World-Material-Schnitt | reine *Color Field*-Auswahlmasken, ohne neue Palette-Datenbank |
| vorhandener Clay-Materialaufbau | K1/H0 visual Golden; K2/v10 nur bei Parität; `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` | zusätzlicher Oberflächen-Farbrollen-Input nur in legaler Material-Naht |
| Licht/Shadowmap & echte Sender/Empfänger | vorhandener WS1 L3/L1 `createStageLight` / Schattenkugel/Sun, Shadow Bias, AO aus gleicher Stage; siehe aktuelle WS1-Quellen | Farbinterpretation/optionale Toon-Schwelle der **bestehenden** Shadow Visibility, kein weiterer Shadow-Caster oder Licht-Loop |
| Selektive Formkanten | bestehende Terrain-/Track-Geometrie + visueller Material-Owner | seltene Ridge-/Ledge-Akzente aus lokal tatsächlich sichtbaren Formbrüchen |
| Vordergrund-Tonmasse | szenen-/kamerakontrollierte **grafische Kompositionsrolle** (nicht physikalischer Schatten) | organische Farbmaske, deren Position bewusst vom Level/Art-Design kontrolliert wird, keine an Kamera festgeklebte Ovalmaske |
| Avatar, Racer, Props, Animation | WS1 Actor/Racer, ToolBox/Resident source donor | echte Shadow-Caster-Geometrie mit Pose und Drive-State; nicht zweite Pose/Physics |

**Wichtige Quellenregeln:** 
- WS0 `STYLE_GUIDE_3D_R1.md` fordert ruhige große Knetformen und untersagt generische Farbverläufe, Alpha-Überblendungen und Rausch-Sprenkel als Oberflächenübergang; `kfbBlend`/S1 bzw. akzeptierte gestalterische Unregelmäßigkeiten bleiben Quelle für endgültige Look-Entscheidungen.
- `BRIEF_WS1_LOOK_RUN_L2.md` nennt einen vorhandenen Bühnenpaletten-Generator, `edgePalette`, L1/L3 und echten Übergang zwischen Bühne/Boden. **Das neue Farbfeld darf bestehende Donor-Farbbindung nicht ersetzen.**
- `WS1_STATUS.md` §§72–75 nennt Mesa-Look, `stageGround.js`, `kfb-stage-light.v1`, Kontaktschatten/AO und Vorbereitungen für Rampen; §94 ff. hat spätere Fahr-/Flug-Integration. Diese Quellen sind **bereits vorhandene Arbeit**, nicht unsere neu getesteten Resultate.
- `BRIEF_WS1_LOOK_RUN_L2.md`: ein Licht-/Schattenautor, Sun = einziger Shadow-Caster, charakterabhängige Rim-/Fill-Identität datengetrieben; **Gesichter lesbar** (historisch „faces never receive shadows“), nicht durch neue Shadow-Tint verdunkeln. `WS1_STATUS` V-429 Figurenwurf/-empfang als neuerer Owner-Entscheid – WS0 muss Gesichts-Ausnahme und aktuelle Materialschnittstelle präzise abgleichen.

## 2 · Organic Color Fields: breite Flächen ohne Höhen-Cutoff

### A. Grundidee
Terrain-Geometrie `H(x,z)` wird **nur für Form/Support** ausgewertet. Ein unabhängiges, deterministisches Feld `F(u,v,seed,biomeId)` bestimmt den **Farbrollenindex**, niemals direkt `step(height)`:

```text
worldXZ / authored UV chart
  → low-frequency coherent field + low-frequency domain warp
  → broad stripe/region masks, optional curated spline guides
  → discrete region/material-role ID (3–4 harmonised colour roles)
  → terrain clay surface response
```

**Nicht:** vier starre Farbbänder von y=0–25–50–75.  
**Nicht:** sichtbares per-pixel Noise- oder Zellmuster.  
**Sondern:** wenige breite, lesbare organische *Flächen*; das Noise ist ausschließlich ein unsichtbares **Formgebungsmittel der Maskengrenzen**.

### B. Vorschlag zur parametrischen Ableitung (DESIGN Pseudocode, keine bestehende KFB-API)

```text
p = stable world XZ or zone-local UV, scaled to large landscape wavelength
warp = (lowFreqNoise2(p + seedA), lowFreqNoise2(p + seedB))
q = p + warpStrength * warp
flow = largeScaleDirectionalField(q, authoredPaths?)
region = chooseRegion(flow, warpedPatchMasks(q), sparseControlSplines)
baseRole = biomePalette.getSurfaceRole(region)
```

`warpedPatchMasks` müssen **niedrige Ortsfrequenz** haben und als große geschlossene Flächen ausgegeben werden. Noisy dithering zur Darstellung verboten. Domain Warp nur am Grenzverlauf, nicht am eigentlichen Terrainmesh. Auf Strecke und Bühnenfußpunkten Material-/Palette-Override der bestehenden Owner respektieren.

### C. Steile Wände und Canyons
Eine XZ-Abbildung sieht auf vertikalen Wänden entlang Y langweilig/gestrichen aus. Statt `height` als Farbindikator zu verwenden, wird eine **orientierungsabhängige Projektion** gewählt:

- Flache/leicht geneigte Oberflächen: stabiler XZ-Farbfeld-Chart.
- Steile Wand: lokale Tangentialkoordinaten entlang der **Wandfläche** (z. B. Cliff-Surface-UV oder bereits vorhandenes geometrisches Mapping) – organische Muster können vertikal und diagonal laufen, **nicht** als globale Höhe kodiert.
- Übergänge an Kliff-Schultern: projektionstechnisch stabiler Übergang bzw. robuste lokale Surface-ID, keine sichtbaren Nahtsprünge/ungewollte alpha-blended Gradient-Kacheln. Nicht automatisch 3 vollständige Materialmaps pro Pixel erzwingen.
- Cliff-/Boden-Flächen dürfen verschiedene Pattern-Rollen haben, bleiben aber an **dieselbe Biome-Palette** gebunden.
- Weltposition/surface-local Chart bleibt beim Sculpting stabil; **bewusster** „Paint moves with terrain“-Modus ist ein späterer Editor-Vorschlag, kein zusätzlicher Position-Owner.

### D. Günstiger Produktionsweg
- Für erste Probe: **per-Chunk deterministisch erzeugte kleine ID-/RGBA-Maske** oder bestehende Material-Uniform/Vertex-Color-Naht, je nach tatsächlichem WS1 Shader. Farbfeld bei Änderung der Terrainform **nicht** neu auf Höhe anwenden.
- ID-/Palettenrollen über nearest/analytische Schwellen; ein Pixel Anti-Aliasing an Graphikkanten ist zulässig, kein großflächiger unscharfer Verlauf. Kuratierte handwerkliche Knetflecken/Versatz statt sichtbarer noise/dither-Textur.
- Bei mehreren Flächen/Überlappungen stabile Prioritäten: `authoredOverride > sourcePalette/stageFootprint > broadRegion > fallbackRegion`. Fallback bleibt sichtbarer KFB-Wert, keine neue generische Außenwelt.
- Farbwelt hängt an akzeptierter `edgePalette` / V-305-Stammpalette. **Keine fest verdrahteten 4 biomweiten Hexwerte** außerhalb vorhandener Rollen-Quelle. Die folgenden Ocker-Töne sind reine Konzeptbeispiele.

## 3 · Palette Shadow Roles – echter Schattenwurf, stylisierte Antwort

### Rollen (Vorschlag, bewusst keine neue globale Palette-SSOT)

| Rolle | Bedeutung | Canyon-Beispiel, illustrativ |
|---|---|---|
| `surface0..3` | 3–4 unabhängige, organische Flächen | Sandgelb, Ocker, Terrakotta, gedämpftes Orange |
| `foregroundValue` | große dunklere **grafische** Vordergrundfläche | braunocker / rostocker |
| `castShadowTint` | normaler echter 3D-Schlagschatten auf dieser Receiver-Fläche | mittleres warmes Rot-/Ockerbraun |
| `contactDepthTint` | lokale optische Tiefe an echtem Kontakt/Enge, **kein Fake-Schatten** | gesättigtes dunkleres Umbra |
| `edgeAccentTint` | seltene markante Cliff-/Ridge-Kante | entsättigtes Dunkelbraun |

**Palette liest der Receiver**, nicht das werfende Objekt. Ein Racer-Schatten auf Canyon-Ocker wird braun, derselbe Racer auf grünem Boden erhält ein dunkles Oliv; bei der Kante verschiedener Empfängerfarben gilt der jeweilige Material-/Biome-Kontext. Die Schattenfärbung ist **kein per-Actor Highlight** und darf nicht mit dessen Body-/Face-Farben verwechselt werden.

### Shader-/Render-Pipeline (technisch präzisieren; keine ungeprüfte Three.js-API versprechen)

```text
authoritative sun/light + actual posed 3D caster geometry
  → EXISTING shadow map: per receiver fragment visibility V∈[0..1]
  → optional compact toon response T(V) with filtered threshold / bounded edge softness
  → material-stage shadow colour response:
       lit = receiver's authored clay/albedo surface colour
       shaded = paletteDerivedShadow(lit, receiverPalette.castShadowTint)
       output = mix(shaded, lit, T(V))          // conceptual, not code drop-in
  → combine with EXISTING bounded local AO/contact, preserve highlight/detail readability
```

Wichtig: Three.js Standard-Lighting kann Schatten typischerweise über den Lichtbeitrag dimmen. Für **wirklich farbiges Shadow-Remapping ohne schwarzen Multiply** muss der *bereits vorhandene* Material-/Lighting-Shader an der legalen Shadow-Sampling-Naht beteiligt sein. Eine beliebige neue `THREE.ShadowMaterial`-Ellipse oder globales `scene.background`-Tönungs-Overlay erfüllt den Auftrag nicht. Die konkrete Shader-API ist **SOURCE_REQUIRED** beim WS1-Material-Owner.

- Eine Hauptschattenstufe plus nur bei bestätigtem Kontakt eine tiefere Stufe, **kein additiver dunkler Mehrfach-Multiply pro Überlappung**.
- **Occlusion and contact:** lieber den bereits vorhandenen L3-`createContactAO`-Term/berechnete Geometrie nutzen, semantisch saturieren/`max` statt unbeschränkt aufsummieren. Kein neues generisches AO-System; realer Felsspalt kann dunkler sein, aber nicht weil drei Schatten-Quads übereinanderliegen.
- Look: klare Shape, gezähmte schmale Softness. Harte abrupt zitternde PCF-Schwellen sind unerwünscht; bestehende Shadowmap-Auflösung, Bias/Frustum (V-440/V-447) und zeitliche Stabilität bleiben Prüfpflicht. Keine unbegründete FPS-Aussage.
- Spielerfigur/Racer in Bewegung: jede Shadowmap verwendet tatsächliche aktuelle Meshpose/Transform. Keine gelockte Default-Ellipse unter Sprung oder Auto. Boden, schräge Rampe, Streckenbande und Canyonwand müssen als echte Receiver evaluiert werden, soweit der vorhandene Renderer sie rechtmäßig schattenempfangen lässt.
- Schatten von Gesichtern dürfen keine Gesichtsinformation eliminieren; bestehende Face-/Mouth-/EyeRig-Beleuchtungsregeln prüfen, nicht pauschal überschreiben.

## 4 · Vordergrund-Tonmasse: grafische Komposition ≠ Shadow Map

Georgs Roadrunner-Referenz besitzt vorne eine große ruhigere/dunklere Ebene. Sie ist **eine aus der Biompalette gewählte zusammenhängende Surface-Farbfläche**, kein geworfener Schatten, kein per-pixel-screen Vignette-Gradient und **kein runder Bodenklecks**.

Empfohlene Priorität:
1. **World-/Region-local authored tone field** im Geländematerial als grobe, unregelmäßig geschlossene Grafikfläche. Kamerawinkel kann bei Levelkomposition berücksichtigt werden, soll aber bei Bewegung nicht ständig sichtbar mitwandern.
2. **Viewer-/Camera-orientierte Komposition** nur für gesonderte, bewusst kuratierte filmische Bildmodi; ansonsten würde die Dunkelzone am unteren Bildschirmrand „mitkleben“. Sie darf nicht als universaler Car-/Avatar-Schatten missbraucht werden.
3. Echte Sun-Cast-Schatten werden **zusätzlich** über dieselbe farbharmonische Palette gerechnet. Auf der bereits abgedunkelten Tonfläche werden Shadow-Strength und Deep/AO-Tint gedeckelt, damit keine schwarze Senke entsteht.

Daher zwei logisch unabhängige Maskentypen: `graphicToneField` vs `shadowVisibility`. Nie versuchen, das eine durch das andere zu ersetzen.

## 5 · Sparse Edge Accents (ohne Ink-Volloutline)

- Herkunft: **echte** markante Profiländerung, gebrochene geometrische Kante, kuratierter Canyon-Grat/Ridge, Bandenkopf. Nicht automatisch aus allen Farbpatch-Grenzen, nicht nach Dreiecks-Tessellation, nicht globaler Post-Process-Comic-Rand.
- Grafik: an die Receiver-Palette gebundener trockener dunkler Braun-/Biom-Ton, kurze zusammenhängende lokale Akzente, selten; keine schwarze Silhouette.
- Technische Kandidaten: lokales Facetten-/Krümmungs-Signal aus vorhandener Terrain-Geometrie; wenige marker-/splinegeführte Linien mit fester Oberflächenbindung; materialbasierte Kantenmaske, falls die Engine das bereits unterstützt. **Kein** ohne Kontrolle über die Szene gelegtes LineSegments-Drahtgitter.
- Vermeide Z-Fighting, gebrochene Linien auf LOD-Wechsel, sichtbare UV-/Chunk-Nähte und breites Pixel-Flimmern. Nur source-isolierte, tatsächlich sichtbare Vergleiche legitimieren Adoption.

## 6 · Banden/Rampen und Style-Goldens bleiben integraler Teil

Der Parent-R1.2-Auftrag spricht ausdrücklich von **Banden** und einer **nicht höhenstufenartig auszuführenden Rampenform**. Deren konkrete ursprüngliche Geometrie/Maße sind in diesem jetzigen Detailgespräch nicht vollständig rekonstruierbar und müssen von WS0 gegen echten WS1-GitHub-POC und Ursprungsentwurf gepinnt werden. Bis dahin:
- keine generischen regelmäßigen Terrassen/Rampenreihen erfinden;
- Track Core / Joyride J17 (Look V-010, Fahrbahn V-102) und akzeptierte Kamera/Fahrbasis erhalten;
- neue Farbflächen sollen sich harmonisch über vorhandene Terrain-/Track-/Bandenanschlüsse legen, aber keine Straßen-/Streifen-/Kurbrollen „umfärben“, die eine separate Präsentationsquelle haben;
- Übergänge echte unregelmäßige Knet-/Speckle-Donors, keine abgelösten Höhenlinien/Übergangsgradienten.

**Bezug zur World-Recovery:** gestoppter WB2 Island R4 `NO MVP / F-R39 FAIL` bleibt gestoppt; keine implizite R5-Umsetzung. Dies ist eine WS0→WS1b-Designinstruktion innerhalb des bereits bestehenden #439-Vorhabens, nicht ein WORLD R4 Neustart.

## 7 · Bounded Integration Experiment – Vorschlag an WS0, nicht selbständig starten

### Fixture (eine reale existierende Produktstelle)
Ein **echter** vorhandener WS1b-Szenenausschnitt mit normaler befahrbarer Fläche, kleinem Terrainhang/Plateau, wirklichem Banden-/Rampenanschluss und einer vorhandenen Figur sowie einem vorhandenen Racer. Szene und vorhandene Module **in Isolation zeigen**, bevor die neue Material/Shadow Response den Vergleich beeinflusst. Gleiche Uhrzeit, Licht, Kamera und Ausgangsassets für A/B.

### Probe 1: Farbfeld unabhängig von Höhe
- Geometry/Height identisch, Vergleich **alte Oberfläche** vs **3–4 unabhängige organische Farbfelder**. Sicherstellen, dass sie nicht um die Welt als horizontale y-Ringe gehen, keine Camouflage-Noise-Sprenkel, keine sichtbaren gerade gleichförmigen Kanten.
- Heightfield ändern (Hügel/Plateau erhöhen), ColorField-Seed/Chart beibehalten: Farbflächengrenzen bleiben bei ihrer unabhängigen Raum-/Oberflächenparametrisierung statt auf neuen absoluten y-Cutoffs neu ausgerichtet zu werden.
- Eine Cliff-Wand aus schrägem Blick: Farbe verläuft auch vertikal diagonal organisch, ohne XZ-Kompressionsflecken oder horizontale Kuchenbänder.
- Kontrollieren, dass Bühne/Track/Actor-Materialrollen unberührt bleiben.

### Probe 2: reale Shadowmap im gleichen Fixture
- Sonne schräg, Original vs palettengefärbte Shadow Visibility; Stand, Jog, Jump, Racer idle/Drift/Jump/Banking (wo im aktuellen Fixture vorhanden). Schatten bewegt sich real mit; in einer perspektivisch schrägen Bewegung prüfbar; 0 erstellte runde Proxy-Blobs.
- Licht bewegt sich (Tag/Gold), die Form und Projektion verändern sich entsprechend; Farbton bleibt rollen-/biomgesteuert, keine schwarze Patch-Überlagerung. Empfänger überhang/hügel, Banden/Wände wenn Renderer supports.
- Selbst-/Kontaktschatten nicht doppeln, Face-Augen/Expressions lesbar; kein shadow acne, flying gaps, harsh zitternde Schattenränder.

### Probe 3: vordere Tonmasse und Kanten
- Großer, stiller, palettengebundener Farbwertbereich vorne, nicht Screen-Vignette. Kamera vor/zurück bewegen: Feld klebt im Weltraum/Authoring-Profil, nicht am Bildschirmrand.
- An denselben echten Cliff-/Banden-Silhouetten wenige entsprechend getönte Kanten, bewusst keine Volloutline.
- Nichts aus bestehenden Jo​​yride/K1/H0/Stage-Paletten verlieren.

### Mindestbeweise / reale Gate-Kriterien
- A/B gleiche Source-/Kamera-/Sun-Time/Seed/Surface + Vorher/Nachher Standbilder; erster Quell-Golden einzeln; dann ein kleines **wirklich durchgehendes** gemeinsames Banden-/Rampen-/Terrain-/Farb-/Schatten-Produktstück.
- Automatische Regression: Identity/Selected Asset/1 movement- & camera-writer/Save-Fresh-Reload/terrain support not broken; gleiche Strecke sprunghaft/rollend, kein Shadow-Blob und keine doppelte Shadowmap/AudioContext.
- Gezielt Screenshots nah, traversal, fern, Cliff-Unterseite, Bandenkante, Räder/Füße/Shadow-Kontakt; kurzer Fahrt-/Sprungclip wenn zur Beweisführung nötig. FPS/Shadowmap-Resolution/GPU-Metriken **am echten Zielgerät**, nicht aus headless SwiftShader ableiten; bestehende Leistungsgrenzen bleiben.
- Wenn die bestehende Shader-Pipeline keinen sicheren Shadow Visibility-Remap zulässt: **nur diese kleine Seam als SOURCE_REQUIRED/QUARANTINE** markieren, nicht neue Material-Runtime bauen und nicht eine Blob-Scheinalternative erzeugen.

## 8 · Aufgabenreihenfolge und exakter next gate

**WS0** (Steuerung/Source) liest zuerst Register V-Nummern, #439, aktuellen `WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md`, die vorliegende Ergänzung, WS1 `WS1_STATUS.md`, `WS1_HANDOVER.md`, aktuellen R3F-Branch und `ws1/combo-r2`. Dann identifiziert und pinnt WS1s tatsächlichen Terrain/Banden/Rampen-POC und vollständigen ursprünglichen Terrain-Quellstand. Die aktuelle Palette-, Licht-, Shadow-, Track- und Clay-Kanons behalten ihre Owners. **Claude Code** darf danach nur auf einem von WS0 zugewiesenen **bestehenden** Game-/Material-Build-Slice als Builder arbeiten; WS1b bleibt der einzige produktive Writer/Integrator, Reviewer und Guard bleiben unabhängig nach Produktionscontract.

**GENAU EIN NÄCHSTER GATE:** **WS0 vervollständigt die Quellpins für den Gesamt-Terrainauftrag #439 (besonders Banden-/Rampen-POC) und führt dieses dokumentierte Farb-/Schatten-Design in den einen reversiblen WS1b-MVP-A/B-Auftrag über.** Kein eigener Shadow-Demo-, Render- oder Deployment-Slice. WS1b führt erst nach genehmigtem Workload aus.

### Quellen / Provenienz
- Parent: [Issue #439](https://github.com/georg-doc/kayfabizarro/issues/439), `replies/WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md` R1.2.
- Register: `30_DECISIONS/DECISIONS.md` (V-010/102/305/403/429/440/447), `ARCHITECTURE_R1.md`, `STYLE_GUIDE_3D_R1.md`, `replies/BRIEF_WS1_LOOK_RUN_L2.md`, `replies/BRIEF_WS1B_TAKEOVER_R1.md`.
- KFB Clay: `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`, K1/H0 Golden, K2/v10 material in actual owning packages.
- WS1 `ws1/r3f-frame`: `WS1_STATUS.md` and `WS1_HANDOVER.md`. **No live Browser acceptance reproduced in this planning pass.**
- User's own Roadrunner reference images in current discussion are **visual intentions**, not an external asset licence or an exact pixel/mesh target. No images generated or imported by this spec.
