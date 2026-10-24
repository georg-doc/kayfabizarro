# Research · Optische Täuschungen und Illusionskunst für KFB · R1 · 24.10.2026

**Tier 0**
1. Portale/Gutter Space: Für Türen in Splat-Räume `MeshPortalMaterial` (drei) nehmen. Für die „Impossible Box“ Stencil (`<Mask>`/`useMask`). Höchstens 2 Portale gleichzeitig sichtbar. Rekursion 1 Stufe, alles Tiefere über einen Droste-Fake.
2. HyperNorm: Infinite Zoom (Droste/Log-Polar), Doppelbilder (Hybrid-Images) und Op-Art-Wipes als Shader in Remotion. Flash-Gate in die QA. Das kostet wenig und wirkt stark.
3. Mindspaces: nur ruhige Illusionen. Atmende Parkettierung, langsames Morphing, Ames-Raum, endlose Gartenpfade mit Teleport-Schnitt. Escher nur als Prinzip, nie als Motiv.

Quellen am Ende. Nichts heruntergeladen. Aufwand: S = ≤1 Tag, M = 2–5 Tage, L = >1 Woche.

---

## 1 · Kunst: Prinzipien und was KFB daraus macht

| Werk / Prinzip | Was passiert im Kopf | KFB-Übersetzung | Rechte |
|---|---|---|---|
| Escher: Relativity (mehrere Schwerkraftrichtungen) | Jede Treppe ist für sich logisch, das Ganze nicht | Labyrinth-Raum mit 3 Gravitationsachsen. Gravitation wechselt pro Fläche (Spieler-Up = Flächennormale) | geschützt |
| Escher: Ascending and Descending (Penrose-Treppe) | Endloser Auf- oder Abstieg | Treppenring mit unsichtbarem Teleport-Schnitt (Dream Passage) | Form frei, Bild geschützt |
| Escher: Metamorphose / Parkettierung | Fläche kippt in Figur und zurück | Eigene Kachel-Sets (Fluff zu Wolke zu Vogel), Morph per Shader | Prinzip frei |
| Escher: Print Gallery (Droste-Spirale) | Bild enthält sich selbst, spiralförmig | Log-Polar-Shader auf Portal oder Billboard | Mathematik frei |
| Escher: Waterfall | Wasser fließt bergab und landet oben | Deko-Skulptur im Garten. Orthografisch aus einem Blickwinkel stimmig | Prinzip frei |
| Dalí: Doppelbilder (paranoisch-kritische Methode) | Ein Bild, zwei Lesarten | Hybrid-Images für HyperNorm: nah Motiv A, fern Motiv B | geschützt |
| Dalí: zerfließende Formen | Feste Dinge werden weich | Vertex-Displacement nach unten, langsam, an Uhren/Objekten im Traumraum | Prinzip frei |
| Magritte: Ceci n'est pas…, Empire of Light | Wort und Bild widersprechen sich. Tag und Nacht gleichzeitig | HyperNorm-Satire-Titel. Mindspace mit Taghimmel über Nachtstraße | geschützt bis Ende 2037 |
| Arcimboldo: Gesichter aus Obst | Teile ergeben ein Gesicht | Gesichter aus Werbe-Objekten (HyperNorm). Garten-Busch-Gesicht | PD |
| Op Art: Bridget Riley, Vasarely | Statische Muster flimmern und wölben sich | Wellenlinien und Kugel-Raster als Übergänge und Wandmuster. Nur eigene Muster | geschützt |
| Kitaoka: Rotating Snakes (Peripheral Drift) | Standbild „dreht sich“. Ursache: Helligkeitsstufen schwarz, dunkelgrau, weiß, hellgrau. Wirkt nur bei Augenbewegung | Statische Billboards und Steinmuster, die sich „bewegen“, ohne Animation | Bilder geschützt, Prinzip frei |
| Café-Wand / Fraser-Spirale | Gerade Linien wirken schief oder spiralig | Labyrinth-Boden, der Richtung „lügt“ | PD (Prinzip) |
| Anamorphose: Holbein, Die Gesandten (Schädel) | Verzerrtes Bild wird nur von einem Punkt aus richtig | Botschaften in der Welt, nur vom richtigen Standort lesbar | PD |
| Anamorphose Street Art (3D-Kreide) | Flaches Bild wird räumlich | Boden-Decals mit „Loch“ oder „Treppe“ (Gutter Space als Fake-Abgrund) | Prinzip frei |
| Penrose-Dreieck, Penrose-Treppe | Unmögliches Objekt, lokal korrekt | Kamera-fixe Skulpturen. Echochrome-artige Pfad-Puzzles | frei |
| Ames-Raum | Gleich große Figuren wirken riesig oder winzig | Mirror Chamber: Spieler wird beim Durchgehen „größer“ | frei |
| Necker-Würfel | Würfel kippt zwischen zwei Lesarten | Drahtskulptur, deren Innen und Außen per Licht kippt | frei |
| Kippfiguren (Ente-Hase, Rubin-Vase) | Figur und Grund tauschen | HyperNorm: zwei Profile bilden einen Kelch (Satire) | PD |
| Forced Perspective | Größe hängt am Abstand | Superliminal-Mechanik im Observatory | frei |
| Droste-Effekt, Infinite Zoom (Zoomquilt-Prinzip) | Endlos hinein | HyperNorm-Loops, Fractal Vision | frei |
| Piranesi: Carceri | Unmögliche Kerker-Architektur | Vorlage für Labyrinth-Stimmung, sogar direkt als Textur nutzbar | PD |

## 2 · Spiele und interaktive Werke

| Spiel | Mechanik | Technik (bekannt oder plausibel) | Übertrag auf KFB | three.js |
|---|---|---|---|---|
| Monument Valley | Unmögliche Objekte begehbar | Isometrische Ansicht. Wegknoten werden verbunden, wenn sie aus der Ansicht übereinander liegen | Labyrinth-Rätsel aus fester Kamera | gut (OrthographicCamera + Knotengraph), M |
| Echochrome | Was verbunden aussieht, ist verbunden. Was verdeckt ist, existiert nicht | Screen-Space-Test auf Pfadenden | Mini-Puzzles in Mindspace | gut, M |
| Superliminal | Objekt aufnehmen: Bildgröße bleibt, Weltgröße skaliert mit Distanz | Beim Aufnehmen Größe und Distanz speichern, dann proportional zur Distanz bis zur nächsten Wand skalieren. Dazu Trompe-l'œil per Projektion | Observatory, Atelier | gut, aber Kollision und Physik kosten, L |
| Viewfinder | Foto wird begehbarer Raum | Methode nicht veröffentlicht. Plausibel: Frustum-Kopie der Szene mit CSG-Schnitt | Später: Foto aus HyperNorm wird Raum | schwer, L |
| Antichamber | Räume größer innen als außen, Würfel mit Welten pro Seite | Stencil-Masken und Teleports | Impossible Box, Labyrinth | gut, S–M |
| Manifold Garden | Welt wiederholt sich endlos in alle Richtungen | World-Wrapping im 3D-Torus. Laut Entwickler oft >500-fache Geometrie | Endloser Korridor, Fractal Vision | gut mit InstancedMesh + Fog, S–M |
| Fez | 2D-Welt drehen, Wege tauchen auf | Orthografisch. Tiefe wird beim Drehen kollabiert | Panel-Rätsel im Comic-Look | gut, M |
| The Witness | Linie setzt sich nur aus einem Standpunkt zusammen | Anamorphe Objektplatzierung | Versteckte Lore im Terrain | sehr gut, S pro Motiv |
| Portal | Zwei verbundene Durchgänge | Stencil oder Render-Target plus Kamera-Transform zwischen Portal-Paar | Gutter Space, Schnellwege | gut, M |

**Rendering-Techniken und Kosten in three.js / R3F**

| Technik | Wie | Kosten | Wann |
|---|---|---|---|
| Stencil-Portal | Portalfläche schreibt Stencil-Wert. Zielszene zeichnet nur dort. drei `<Mask>`/`useMask` | Laut TU-Delft-Studie (2023) über 2× effizienter als Render-Texture. Jede Ansicht = ein weiterer Szenen-Durchlauf. Transparenz vor dem Portal bricht | Impossible Box, feste Türen |
| Render-to-Texture | drei `MeshPortalMaterial` (intern RenderTexture, `blend` 0–1 für Übergang, `blur` für weiche Kanten) | Ein Forum-Bericht: M1, 144 fps → ca. 70 fps mit einem kleinen Portal (Einzelfall). Beliebig viele Portale möglich, aber teuer | Portale mit Durchschreiten, Panels |
| Rekursion | Pro Stufe ein weiterer Pass. Letzte Stufe wird zum Standbild oder blendet aus | Linear bis exponentiell steigend | Nur 1 echte Stufe, Rest per Droste-Fake |
| World-Wrap | Raummodul als 3×3×3-Instanzen. Spielerposition modulo Raumgröße | Billig mit Instancing. Fog versteckt den Rand | Korridor, Garten-Loop |
| Teleport-Schnitt | Unsichtbarer Trigger, Kamera relativ versetzt. Gleiche Geometrie an beiden Enden | Fast gratis | Escher-Treppe, endloser Pfad |
| Kamera-fixe Geometrie | Unmögliches Objekt stimmt nur aus einem Winkel. Orthografisch oder Ziel-Guckpunkt | Gratis | Penrose, Waterfall, Ames |
| Raymarching (SDF) | Fullscreen-Quad, Domain Repetition | GPU-lastig, Auflösung skalieren | Fractal Vision |

**Splats im Portal:** Spark (three.js-Splat-Renderer) mischt Splats und Meshes in einer Pipeline. Spark 2.x erlaubt mehrere SparkRenderer mit eigener Blickrichtung. Ob Splats den Stencil-Test respektieren, ist nicht belegt. Jede weitere Ansicht braucht eine eigene Splat-Sortierung, und das ist teuer. Daher: Splat-Raum hinter genau einer Tür, per RTT.

## 3 · Techniken pro KFB-Scheibe

### 3a · Splats / Portale / Gutter Space

| Effekt | Umsetzung | Beispiel / Lib | Aufwand |
|---|---|---|---|
| Tür in Splat-Raum | `MeshPortalMaterial` auf Rahmen. `blend` beim Durchschreiten über Kameradistanz animieren, dann Szene tauschen | drei Docs, Codrops „Glass Portal Card“ (R3F + Splats) | M |
| Impossible Box (4–6 Welten in einem Würfel) | Jede Fläche eigener Stencil-Wert, je Fläche eine Mini-Szene | three.js Forum „Impossible Box, antichamber style“ (Repo verlinkt), Zucconi-Tutorial (Unity, Prinzip gleich) | S–M |
| Größer innen als außen | Kleine Hütte außen. Tür = Stencil-Portal in großen Innenraum, Teleport beim Durchgehen | Portal-Kamera-Transform (Standardformel) | M |
| Gegenspiegel / rekursive Portale | 1 echte RTT-Stufe. Darin dieselbe Textur noch einmal skaliert (Fake) | eigenes Setup | M |
| Droste im Portal | Portaltextur durch Log-Polar-Shader: Spirale nach innen statt echter Rekursion | Droste-GLSL (GameDev.net-Thread), Roy-Wiggins-Artikel, Jos Leys | S |
| Escher-Treppe | Treppenring, 4 Segmente, Teleport-Schnitt im verdeckten Knick. Oder Penrose-Treppe orthografisch aus festem Winkel | eigenes Setup | S–M |
| Endloser Gutter-Korridor | World-Wrap mit InstancedMesh, Ink-Fade als Fog | Manifold-Garden-Prinzip | S |
| Gutter Space = Comic-Rinne | Panels als Portale. Zwischen den Panels liegt die weiße Rinne als begehbarer Raum (McCloud). Panel-Inhalt per RTT | `MeshPortalMaterial` pro Panel, max. 2 live, Rest als Standbild | M |
| Boden-Anamorphose „Abgrund“ | Decal, das aus Spielerhöhe als Loch wirkt. Kippt beim Nähern | Projektive Textur vom Guckpunkt | S |

### 3b · HyperNorm-Videos (Remotion / @remotion/three / Shader)

| Effekt | Umsetzung | Beispiel / Lib | Aufwand |
|---|---|---|---|
| Infinite Zoom | Bildkette mit gleichem Mittelpunkt, Zoomfaktor fest, Loop über N Bilder. Oder Droste-Shader auf einem Bild | Zoomquilt-Prinzip, Droste-GLSL | S |
| Droste-Spirale | Log-Polar: Koordinaten → log, drehen und skalieren, → exp. Zeit-Uniform = endloser Zoom | Jos Leys, GameDev.net-Shader | S |
| Doppelbild (Dalí-Prinzip) | Hybrid-Image: Tiefpass von Motiv A + Hochpass von Motiv B. Nah sieht man B, fern A. Für Billboards ideal (Spieler läuft darauf zu) | Oliva/Torralba-Methode, ein paar Zeilen Python/GLSL | S–M |
| Kippfigur-Satire | Rubin-Vase aus zwei Profilen. Figur-Grund kippt per langsamem Hell-Dunkel-Tausch | Vektor + Remotion | S |
| Op-Art-Wipe | Moiré aus zwei Ringmustern, Phasenverschiebung als Übergang. Riley-Wellen per sin-Verzerrung. Bewegung über Phase, nicht über Helligkeitswechsel | eigener Fragment-Shader | S |
| Peripheral Drift | Eigenes Muster mit Stufen schwarz → dunkelgrau → weiß → hellgrau. Standbild wirkt bewegt | Michael-Bach-Seite (Erklärung, Luminanzwerte) | S |
| Metamorphose-Kette | Parkettierung morpht über 10–20 s zu Figuren (eigene Kacheln) | SDF-Morph oder Flipbook | M |
| Anamorphes Billboard | Bild nur vom Spielerweg aus lesbar. Vorbeigehen „enthüllt“ die Botschaft | Projektive Textur | M |
| Melting | Vertex-Displacement Richtung Schwerkraft, Noise-Maske | @remotion/three | S |

**Fotosensitivität (eine Zeile):** max. 3 Blitze pro Sekunde, kein gesättigtes Rot im Wechsel, große Hell-Dunkel-Flächen unter 25 % des Bilds (WCAG 2.3.1). Op-Art nur über Phase bewegen, nie im Kontrast flackern.

### 3c · Mindspaces (ruhig, langsam, < 0,2 Hz)

| Raum | Illusion | Umsetzung | Aufwand |
|---|---|---|---|
| Living Garden | Atmende Parkettierung am Boden | Hex- oder Wang-Kacheln, Kachel-Skalierung per sin(t), Periode 6–10 s | S |
| Living Garden | Unmöglicher Gartenpfad | Pfad-Loop mit Teleport-Schnitt hinter einer Hecke. Man kommt dort an, wo man losging, aber „höher“ | S–M |
| Creative Atelier | Metamorphose-Wand | Eigene Kacheln (Pinsel → Vogel → Fluff), langsam überblenden | M |
| Creative Atelier | Necker-Skulptur | Drahtwürfel. Licht wechselt langsam, Lesart kippt | S |
| Mirror Chamber | Ames-Raum | Trapezraum, schräger Boden, fester Guckpunkt (Fenster). NPC wächst beim Durchgehen | M |
| Mirror Chamber | Unendlichkeitsspiegel | 1 RTT-Stufe + Droste-Fake, Ink-Fade nach innen | M |
| Dream Passage | Endlose Treppe, endloser Korridor | Teleport-Schnitt + World-Wrap. Zerfließende Möbel per Vertex-Displacement | M |
| Fractal Vision | Fraktal-Zoom | SDF-Raymarching (Menger, Mandelbox) auf Quad, halbe Auflösung, langsame Fahrt | M |
| Threshold Observatory | Forced Perspective | Superliminal-Skalierung für 1–2 Objekte (Mond aufnehmen, auf Tisch legen) | L |
| Threshold Observatory | Sternbild-Anamorphose | Sterne im Raum verteilt, Bild nur durchs Okular stimmig (Witness-Prinzip) | S |

Regel für Mindspaces: keine kontrastreichen Bewegungsillusionen, keine Kippfiguren mit Stress. Das bestehende Licht-Rig gilt auch hinter Portalen (V-385).

## 4 · Rechte (kurz)

| Quelle | Status |
|---|---|
| Mathematische Illusionen (Penrose, Necker, Ames, Café-Wand, Droste-Prinzip, Forced Perspective) | frei. Ideen sind nicht schützbar |
| Holbein, Arcimboldo, Piranesi, alte Kippfiguren (Ente-Hase 1892) | PD |
| Escher (†1972) | geschützt, M.C. Escher Company. EU vermutlich bis Ende 2042. Prinzipien ja, keine Kopien, keine erkennbaren Kompositionen |
| Dalí (†1989), Magritte (†1967), Vasarely (†1997), Riley (lebt), Reutersvärd (†2002) | geschützt. Nur Prinzip |
| Kitaoka | Bilder geschützt, kommerziell nur gegen Gebühr. Muster selbst bauen |
| Spiele (Monument Valley usw.) | Mechanik frei. Look und Assets nicht kopieren |

## 5 · Top 10 für KFB (Wirkung gegen Aufwand)

| # | Baustein | Scheibe | Wirkung | Aufwand | Warum |
|---|---|---|---|---|---|
| 1 | Droste/Infinite-Zoom-Shader | HyperNorm + Portal-Fake | hoch | S | Ein Shader, zwei Einsätze. Ersetzt teure Rekursion |
| 2 | Impossible Box (Stencil) | Splat/Portal, Labyrinth | hoch | S–M | Antichamber-Wow, billiger als RTT |
| 3 | Endlose Treppe/Pfad mit Teleport-Schnitt | Labyrinth, Mindspace | hoch | S–M | Fast gratis, starkes Escher-Gefühl ohne Escher-Motiv |
| 4 | Splat-Raum hinter einer Tür (`MeshPortalMaterial`) | Splat/Portal | hoch | M | Kern des Gutter-Space-Versprechens |
| 5 | Anamorphe Botschaften im Terrain | Terrain/Welt, Labyrinth | hoch | S pro Motiv | Lore-Jagd, keine Laufzeitkosten |
| 6 | Atmende Parkettierung | Mindspace (Garden), Terrain-Decals | mittel | S | Ruhig, billig, passt zum Claymation-Look |
| 7 | Hybrid-Image-Doppelbilder | HyperNorm | mittel–hoch | S–M | Satire durch Distanz: der Spieler „entdeckt“ das zweite Bild |
| 8 | Ames-Raum | Mindspace (Mirror) | mittel–hoch | M | Bekannt, sofort verständlich |
| 9 | Peripheral-Drift-Muster | HyperNorm, Welt | mittel | S | Standbild wirkt bewegt, null GPU-Kosten |
| 10 | Forced-Perspective-Pickup | Mindspace (Observatory) | hoch | L | Starkes Spielgefühl, aber Physik-Aufwand. Spät |

## Empfehlung

- **Erster billiger Test (1 Tag):** Sandbox-Szene mit (a) Droste-Shader auf einem HyperNorm-Billboard und (b) Impossible Box mit 4 Stencil-Flächen. fps auf dem WS1-MacBook messen, Ink-Outline prüfen.
- Portal-Budget fest: max. 2 live sichtbar, Rekursion 1 Stufe, danach Droste-Fake oder Standbild.
- Splats nur hinter genau einer RTT-Tür. Stencil + Spark erst testen, nicht annehmen.
- Ink-Outline: Screen-Space-Outline läuft im Portal-Pass nicht automatisch mit. Für Portal-Inhalte Inverted-Hull-Outline im Material.
- Escher-Prinzipienliste (Gravitationswechsel, Endlosschleife, Metamorphose, Droste) als Baustein-Katalog. Keine Motive nachbauen.
- HyperNorm: Droste, Hybrid-Image und Op-Art-Wipe als drei Remotion-Komponenten. Flash-Check (Frame-Luminanz-Differenz zählen) in die kfb-video-QA.
- Mindspaces starten mit atmender Parkettierung (Garden) und Teleport-Treppe (Dream Passage). Ames-Raum als drittes.
- Forced Perspective und Viewfinder-artige Foto-Räume zurückstellen (L).

## Offene Punkte

- Respektiert Spark-Splat-Material den Stencil-Test? Sonst nur RTT.
- Kosten der Splat-Sortierung pro zusätzlicher Ansicht auf dem WS1-MacBook.
- Ziel-fps und Mindest-Hardware für Portal-Szenen festlegen.
- Motion Sickness bei Teleport-Schnitten und Gravitationswechsel: Kamera-Kontinuität testen, Option „sanft“ einbauen.
- Escher-Schutzfrist: EU-Datum (Ende 2042) prüfen lassen, falls je ein Original zitiert werden soll.
- Kitaoka-Originale nur mit Lizenz. Bis dahin eigene Muster.

## Quellen

- Portale three.js: https://discourse.threejs.org/t/advice-on-optimizing-portals/41589 · https://discourse.threejs.org/t/portal-rendering-with-stencil-buffer/22425 · https://drei.docs.pmnd.rs/portals/mesh-portal-material · https://discourse.threejs.org/t/impossible-box-antichamber-style/46178 · https://www.alanzucconi.com/2015/12/09/3873/ · https://repository.tudelft.nl/file/File_6caa1e43-0353-419f-b07b-2b598b224731 · https://github.com/kyle-robinson/non-euclidean-framework
- Splats: https://sparkjs.dev/docs/overview/ · https://github.com/sparkjsdev/spark · https://tympanus.net/codrops/2023/11/29/3d-glass-portal-card-effect-with-react-three-fiber-and-gaussian-splatting/
- Droste: https://gamedev.net/forums/topic/590070-glsl-droste/ · https://www.josleys.com/article_show.php?id=82 · https://derivative.ca/community-post/asset/droste-effect-and-infinite-recursion-tox/74247
- Kitaoka/Bewegung: https://michaelbach.de/ot/mot-snakes/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC5308384 · https://www.ritsumei.ac.jp/~akitaoka/index-e.html
- Spiele: https://en.wikipedia.org/wiki/Superliminal · https://blog.playstation.com/?p=332742 · https://en.wikipedia.org/wiki/Manifold_Garden · https://gamedeveloper.com/design/making-the-impossible-possible-in-i-monument-valley-i- · https://avclub.com/echochrome-1798213914 · https://giantbomb.com/wiki/Concepts/Perspective_Puzzle
- Rechte: https://mcescher.com/licensing/ · https://mcescher.com/frequently-asked-questions/ · https://salvador-dali.org/ · https://theartnewspaper.com/2024/01/04/works-entering-the-us-public-domain-in-2024-mc-escher-woodcut-and-mickey-and-minnie-mouse
- Flash: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
