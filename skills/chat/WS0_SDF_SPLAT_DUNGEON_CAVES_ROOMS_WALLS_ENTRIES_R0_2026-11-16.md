# WS0 Folgepilot R0-B · Begehbare SDF-/Splat-Höhlen, Dungeon-Räume, Wände und Eingänge
**Stand:** 16.11.2026 · **Status:** KONKRETES WS0-FOLGEBRIEFING / SOURCE-CHECKED / NO BUILD / NO STAGE
**Abfolge:** nach WS0_GAUSSIAN_SPLAT_2D_SLOPS_SCENELETS_R0_2026-11-16.md (Props → Slops → kleine Scenelets). PatchWorld/patch.gg-Stile sind bewusst **später**.
**Owner:** WS0, KFB Art-/Asset-Authoring & Vergleichsauftrag. **Receiving/Runtime owner:** georg-doc/KFB-Stunt-Car-Race, game/integration-r2, vorhandener InfiniteRooms-/Terrain-/Rapier-/Portal-Besitzer. **Kein neuer Renderer, Engine-Owner, Welt-/TransitionDirector.**
**Quellstand beim Briefing:** georg-doc/KFB-Stunt-Car-Race game/integration-r2 @ 648f932e52eadaa019e141ce8e34508bd372e5e5; vor Ausführung neu fetchen.
**Georgs gewünschter Outcome:** ein wirklich begehbarer Höhlen-/Dungeon-Eingang und ein kurzer Raum-/Wandabschnitt, um **(A) bestehende Assets/Geometrie gegen (B) SDF-generierte Körper** bei gleicher Kamerafahrt zu vergleichen. Zusätzlich getrennt **(C) konventionelles Mesh-Rendering versus Gaussian-Splat-Rendering**, ohne die beiden Variablen zu vermischen.

## 1. Die drei realen Quellbereiche

**D1 · Eingang/Schwelle:** KFB-Quelle zuerst **bestehende InfiniteRooms-R3-Luke (3,2 × 3,2 m)** und deren Höhen-/Portalbezug; alternativ genau ein aus dem bestehenden Diorama-Katalog und assets/private tatsächlich gefundenes Meshy-GLB für den Höhlen-/Mineneingang. Aus Fotos/PNG-Sheets nur **Concept/2.5D** ableiten, nicht behaupten, das sei der aktuelle 3D-Dungeon-Eingang. Wenn kein echter begehbarer Eingang mit GLB existiert, bleibt der R3-Lukendonor die reale Referenz; ein neuer SDF-Höhleneingang ist ausdrücklich eine **neue Vergleichsvariante**, keine rekonstruierte Originalquelle.
**D2 · Wand/Bruch:** bestehende R3-Shell und **18 m zerstörbares Zwischenvolumen** mit dem vorhandenen, dauerhaft freien Gang. Bevorzugt ein eindeutig identifizierter kurzer, tatsächlich begehbarer Wand-/Gang-Ausschnitt aus der aktuellen R3-Geometrie als Isolationsquelle.
**D3 · Raum/Übergang:** bestehende InfiniteRooms-R3-Anordnung mit zwei Räumen und Gang (nicht die vollständige unabhängige InfiniteRooms-Site oder ein neuer Dungeon-Generator), inklusive bestehender kollisionsfähiger Wand-/Boden-/Decken- und Übergangssituation. Exakte Karten-/HyperNorm-Inhalte gehören dem bestehenden Asset-/Surface-Owner; kein fremdes Bild ersetzen.

**Aktueller Source-/Proof-Status:** 
- `src/modules/infiniteRooms/{README.md,RETURN.md,ACCEPTANCE.md,HOST_CONTRACT.md,level.mjs}` auf game/integration-r2 dokumentieren R3 3.0.0-candidate.2 und 16/16 technische Node/Rapier-Tests; kanonischer Diagnoseexport G2/G3/G5/G6 PASS, G4 WARN; **Umgebungs-Gate FAIL und reale Spiel-/Look-/Karten-/HyperNorm-/FPS-Abnahme offen**. Status NO-GO für Spiel-/Site-Aktivierung; keine eigenen Gameplay-PASS-Behauptungen.
- `src/world/infiniteRoomsHost.js` und `src/world/InfiniteRooms.jsx` verbinden vorhandene Three-, Rapier-, Clay-, Karten-, Terrain-/Portal-Owner; der Integrationsschalter ist laut Host-Kommentar derzeit AUS. `terrain.reserveOpening` wird über den Host angesprochen; **keine Annahme**, dass unser neuer SDF-Eingang bereits eine eigene Geländeöffnung hat.
- `src/world/dioramen/README.md`: echte Diorama-Meshy-Assets in `assets/private`, Katalog `src/data/worlds/kfb-dioramen.r1.json`, bekannte LOD60k und LOD15k, bestehender `diorama=r2`-Pfad. Vor einem Meshy-Donor die **tatsächliche GLB-Datei privat prüfen**, keine Annahme, welcher Titel genau Höhle ist.
- `https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/127`: Dungeon-/Room-Graph und Kartenwand-Reuse als separater konzeptueller Folgepfad. **Nicht** jetzt Spiel-Graph, KI, K15, Karte oder Zerstörungsengine umsetzen.

## 2. Entscheidungsscharfe Vier-Felder-Matrix

Zwei unabhängige Achsen: **GEOMETRIE** (vorhandenes Original versus SDF-Modell) und **DARSTELLUNG** (aktueller KFB-Mesh-Look versus Splats).

| Feld | Geometriequelle | Oberfläche | Hauptfrage |
|---|---|---|---|
| **A · ORIGINAL** | Echte vorhandene R3/Meshy-Geometrie | bisheriger KFB-Mesh-Look mit vorhandenem Material/Licht | Referenz: Was haben wir schon? |
| **B · SDF-MESH** | Aus derselben Abmessungs-/Raum-/Tür-Topologie konstruiertes SDF, als geprüftes Mesh extrahiert | möglichst gleiches KFB-Licht/Material | Ist die prozedurale Form an sich besser? |
| **C · ORIGINAL-SPLAT** | Originaloberfläche per Mesh-Sampling → Splats | Gaussian-Splat-Layer, kein neuer Stilfilter | Was ändert nur die Splat-Darstellung? |
| **D · SDF-SPLAT** | exakt dasselbe SDF wie in B, Oberfläche gesampelt | dieselben Splats-Parameter wie C | Was bringt die Kombination? |

**Wichtig:** Die physische Kollision wird als **separates Wahrheitsobjekt** mit jeder Variante geprüft (Original-Rapier collider vs aus SDF abgeleitete/validierte Collider). Für ersten visuellen A/B-Kamerapfad dürfen Varianten denselben verifizierten Referenzcollider nutzen, **müssen dann aber klar als „Rendering-only“ ausgewiesen werden**. Keine falsche Aussage, dass Splats selbst eine solide Wand oder einen Raum schließen.

## 3. Konkrete Aufbauaufgaben

### D1 Eingang – eine wirkliche Öffnung
- **Source isolation:** R3-Luke einschließlich Rahmen, vorhandener Collider-Kontakt und tatsächlicher Terrainöffnung alleine zeigen. Optionale Meshy-Höhle erst nach tatsächlicher Datei-/Hash-/Isolationsprüfung.
- SDF-Eingang als zusammenhängende Fels-/Minenhülle mit **echtem Boolean-Cut** (kein nur dunkel gefärbter Fleck): äußere Hülle, subtractives Tor und durchgehender gerader Hohlraum in den ersten Gang. Tunneleingang (vertikale Frontöffnung) und horizontale R3-Luke sind **zwei unterschiedliche Geometrie-/Portaltypen**; nicht dieselbe Öffnungsachse behaupten.
- Test: Kamerastrahl von außen sieht bis ins Innere; Spielfigur 1,81 m Referenz und bestehende Footprint-/Capsule-Maße passieren ohne unsichtbare Sperre; Loch bleibt auch in Collider-/Nav- beziehungsweise Reachability-Probe offen. Wenn für Vergleich separate Höhlentür genutzt wird: explizite adapterfreie lokale POC-Nähe statt echter Terrainveränderung.
- Nachbarboden und umliegende Wand bleiben auf allen Seiten geschlossen; kein Splat-AO-„Deckel“, keine sichtbaren Lücken beim Schritt von außen nach innen.
- KFB-intern kein zweiter `tuerPortal` oder Ankunfts-Owner; Einbau in die echte Welt erst durch bestehenden Besitzer.

### D2 Wand – Material und Durchbruch
- Identische Wandmaße, ein geschlossener Abschnitt und ein kontrollierter, **wirklich offener** Durchbruch; keine nachträglich gezeichnete Schwarzöffnung.
- SDF-Boolean-Cut erzeugt Wandrest und dreidimensionale **Schnittflächen/Jambs** (beidseitig, nicht nur Alpha-Loch der Frontseite). Samples an Innen-, Rück- und Bruchflächen inklusive Kanten, Normalen und Wandstärke.
- Kollisions- und visueller Durchbruch sind atomar: `blocked → hit/break → passable`; vorhandene Rapier-/R3-`infiniterooms.impact`-Events werden nur abgelesen/ausgelöst, nicht als zweites Damage-Modul implementiert. Path-/Ray-/Capsule-Probe vor und nach Öffnung; ein vorhandener Gang muss frei bleiben.
- Splats an Kanten testen (Sicht aus spitzem Winkel, hinter Ecke, Blend-Reihenfolge, doppelte Oberflächen). Wenn nötig am echten Bruchrand klassisches Mesh beibehalten und nur Oberfläche mit Splats anreichern, statt Löcher zu kaschieren.

### D3 Raum – begehbare Architektur statt Screenshot
- Gleiche Innenmaße wie ein isolierter realer R3-Raumausschnitt, keine improvisierte Ersatzszene. Boden, Decke, Seitenwände, Passage als vollständige Körper mit inneren Sichtflächen.
- Zwei 180°-Blicke von innen plus 360° Außenorbit, Türrahmen und Ecken; Kamera nahe an Wand und durch Passage. Unter-/Hinterseiten durch tatsächliche Geometrie belegen. Der statische Raum bleibt in seinem eigenen Host.
- SDF-Raum schneidet die Inneren Volumina, Türen und Gang aus einem oder wenigen wohl-definierten Fields. Nur die notwendigen Berührungs-/Schnittflächen backen; keine sichtbaren Splats in besetzten Innenräumen / unter dem Boden.
- Lichtvergleich: vorhandenes neutrales Prüflicht, danach Tag/Nacht nur durch **bestehenden** Licht-Besitzer. Gebackene Beleuchtung nicht mit dynamischen Schatten-PASS gleichsetzen. Keine neuen Lampen, kein zweites Licht-Rig und kein Pixel-Art-/Tusch-/Papier-Look.
- Bei begehbarem Raum: Kamera mit realer Personenhöhe und Collider-Kontakt; keine Clip-Planes oder virtuellen Kollisionen, die Innenraum nur vortäuschen.

## 4. Technische Umsetzung ohne neue Runtime

**Viewer:** ein **isolierter, lokaler, vergleichbarer Three-/WebGL-Prüfstand** im bestehenden Projektkontext (WSA baut als temporären Vergleich, nicht einen neuen World-Owner). Pinne aktuelle Three/Rapier-Version aus R3, verwende dessen Material-/Ausrichtungsreferenzen. Teste früh, ob ausgewählter Gaussian-Splat-Renderer und vorhandener React-Three-Fiber-/WebGL-Renderer kompatibel sind. Nichts in `M1World.jsx`, `M1Player.jsx`, `src/flags.js`, `src/world/endlessTerrain.js`, `src/world/tuerPortal.js` ändern.

**Feld-Rezept:** primitives `box`, `capsule`, `ellipsoid`, Fels-Noise, `union`, `smoothUnion`, `subtract`/negative SDF. Das SDF liefert eine numerische Distanz und Gradient/Normalen. Für B SDF→Mesh (z. B. Marching Cubes/DC nur als Kandidat), für D SDF→orientierte Surface Splats. Dieselbe SDF-Seed-/Parameterquelle und dieselben Maße; Sampling-Budget per Fläche/Kamera; kein eigenes zweites Raumdatenformat als Runtime-Kanon. SDF/Geometrie in Source-Lock dokumentieren.

**Splats:** C und D erhalten identische Palette/Licht/Dichte/LOD-Testfälle. Source-Mesh-Sampling vs SDF-Surface-Sampling separat nachweisen. Weiche Oberfläche nie mit defekter Alpha-/Depth-Kante verkaufen. Zugänge und Wandstärken bleiben geometrisch stabil, auch bei Dither/Pixelpass AUS.

**Optionales späteres Modell:** Bei einem schon existierenden, source-validierten Meshy-Höhleneingang statt der R3-Luke dieselbe Matrix an diesem GLB durchführen. Die R3-Räume/Wände bleiben primäre begehbare Technikreferenz.

## 5. Test- und Dokumentationsmatrix

| Test | Muss konkret gezeigt werden | Negativer Befund |
|---|---|---|
| Q1 Source | tatsächliche Original-Datei, Blob/SHA-256, Original isoliert vor Integration | Filename/URL/Screenshot statt Quellobjekt |
| Q2 Apertur | Durchgang optisch + Collider/Ray/Capsule/Reachability in Front-, Rück- und Schrägansicht | dunkle 2D-Textur oder unsichtbare Collision |
| Q3 Raum | 1,81-m-Referenz, begehbarer Boden, geschlossene Decke und Innen-/Außenseiten, keine Kamera-Clips | nur Diorama-Fassade, fake hollow |
| Q4 Wand-Bruch | `blocked`, `opened`, `passable` + alter/ neuer Collider; nicht der einzige Ausgang blockiert | Schaden ohne Collider-/Nav-Update |
| Q5 Look | A/B/C/D mit exakt gleicher Kamera/Licht/Belichtung/FOV, Thumbnail + Originalgröße; vorne/innen/rückseitig | falsche Formen, Umpaint/Redesign, neue Outline-Styles |
| Q6 Performance | Anzahl Splats, MB/Transfer, Bake-Dauer, Start-/Warm-Load, p50/p95/Max Frametimes, GPU-Pass und Overdraw, gleicher 60-s-Pfad | nur Videofps, neue GPU-Last nicht getrennt |
| Q7 Streaming | Nah/Fern-Orbit und Ein-/Austritt, deterministischer Reset, kein Rest-Splat/Capsule/Collider nach Dispose | LOD Pop, unkontrollierte Ressourcen |
| Q8 Source-limits | R3 OPEN (Umgebung FAIL) respektiert; keine private Diagnoseabbildung oder Platzhalter öffentlich | fälschliches „KFB-Spiel PASS“ |

**Kostenstaffel als Vorschlag, nicht Messwert:** 
- Eingang 10k/30k/60k Splats, Raum-Schnitt 20k/60k/120k, Wand 5k/15k/40k, jeweils als Single-View/Single-Asset-Test; bei Splat-Look ohne Nutzen kleinere Variante behalten. 
- Nicht alle Testvarianten zugleich für Full-World laden; A/B/C/D einzeln und auf gleicher Hardware messen. Keine FPS-Zielzahl als Bestand behaupten. Ein sinnvoller Engineering-Vergleich misst **zusätzliche p95 GPU-Framezeit** der Variante relativ zu A und notiert Bildqualität, statt pauschal „Splat besser“ anzunehmen.

**Tests des erhaltenen R3-Pakets (Source-Report, nicht dieser Pilot):** 16/16 technische Tests PASS laut `ACCEPTANCE.md` (16.11.2026), begrenzte Geometrie-Proofs G2/G3/G5/G6 PASS, G4 WARN, Umgebungs-Gate FAIL; realer integrierter Browser-/Gameplay-Test NICHT PASS. In **diesem** reinen Briefing: 0 neu ausgeführte Geometrie-/GPU-/Runtime-Tests, 0 Bilder erzeugt.

## 6. Rollen, Grenzen, Lieferung

**WS0** wählt genuine Quellen, prüft Original vor Konvertierung, leitet visuelle Vergleichskriterien. **WSA Builder** erstellt isolierte vier Varianten und reproduzierbare Parameter/Tests ohne Produktions-Game-Patches. **Integration Tester** prüft tatsächlichen Durchgang/Collider und FPS-Gleichheit; **Independent Critic** bewertet Source-Treue, Hohlraum, Kanten und Stil ohne am Kandidaten zu schreiben; **Production Guard** klassifiziert Fehlstellen und nach zwei erfolglosen Verbesserungen den kleinsten Blocker. **Der bestehende KFB Runtime-/Terrain-/Portal-Owner** allein dürfte nach einer belastbaren Pilot-Abnahme ein einzelnes Modul integrieren. Georg entscheidet nur bei echtem sichtbarem Art-/Product-Vergleich.

**Artefakte nach Ausführung:** Source-Manifest mit Hashes/Lizenzstatus; 3 Quell-Isolationsbilder; A/B/C/D Turntable und In-Room-Footage; Collider-/Ray-/Capsule-/Impact-Log; Performance-/LOD-Report; kurzer Return mit `KEEP/ADAPT/DEFER` für Eingang, Wand, Raum. Source-Assets bleiben an ihrer bestehenden privaten/public-safe Speicherstelle, keine Fake-Quelle oder Marken-/Stil-Substitution.

**Stage-/Hub-Regel:** Dieser Brief veröffentlicht **nichts**. Falls ein späterer menschlicher Test autorisiert ist, muss der **exakte** `https://kayfabizarro.pages.dev/…`-Link vom KFB Hub aus erreichbar sein und die Revision sichtbar geprüft werden. GitHub/raw/local sind keine Abnahmesurfaces; keine automatische Live-Promotion.

## 7. Ein nächster produktiver Gate

**Nach dem ersten Dreier-Piloten:** WS0/WSA isoliert **die tatsächlich vorhandene R3-Luke, einen R3-Wand-/Gangabschnitt und einen R3-Raumausschnitt**, bestätigt Maße/Collider/Quelle und baut **nur danach** die A/B/C/D-Matrix für diesen kleinen verbundenen Prüfkorridor. Es ist **kein** paralleler neuer Dungeon-/Splat-Runtime-Owner zu eröffnen.

**Verweise:**
- `georg-doc/KFB-Stunt-Car-Race` /`game/integration-r2`: `src/modules/infiniteRooms/ACCEPTANCE.md`, `HOST_CONTRACT.md`, `RETURN.md`, `level.mjs`, `src/world/{InfiniteRooms.jsx,infiniteRoomsHost.js,endlessTerrain.js,gelaendeOeffnung.js}`, `src/world/dioramen/README.md`, Issue #127.
- `georg-doc/kayfabizarro`: `tools/asset_registry/README.md`; `skills/chat/WS0_GAUSSIAN_SPLAT_2D_SLOPS_SCENELETS_R0_2026-11-16.md`.
- Tools nur als Source-/Experimentkandidaten: `siliconjungle/shapeshift-labs-ink-studio`, `cobanov/pixelart-gaussiansplat`, `iamvillain/SyntaxSplat`. Keine direkte Adoption vor echter Quell-/Render-Prüfung.
