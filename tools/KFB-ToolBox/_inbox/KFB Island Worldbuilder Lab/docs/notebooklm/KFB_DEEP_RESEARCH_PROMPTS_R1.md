# KFB Deep-Dive-Recherche-Prompts R1 (NotebookLM)

Stand: 2026-10-09 · Sechs Prompts, nach Priorität gestaffelt (P1 zuerst). Jeder Prompt ist eigenständig, du kannst ihn so wie er ist in NotebookLM einfügen. Er verweist auf die Quellen im Notebook über ihren Dateinamen (im Upload mit Nummer davor). „Bilder 01–04“ meint die Bilddateien `Bild_01_…` bis `Bild_04_…`.

**So verwenden:**
- Je Prompt einen Deep-Research-Lauf starten.
- Den fertigen Bericht als neue Quelle in den Ordner „Recherche-Ergebnisse“ speichern.
- Danach gern einen interaktiven Report oder eine Audio-Übersicht daraus erzeugen.

**Gemeinsame Vorgaben für alle Prompts:**
- **Englischsprachige Quellen bevorzugen** (GitHub, GDC-Vaults, Shadertoy, three.js-Forum und -Examples, Blender-Docs, Entwickler-Blogs, Postmortems, Bücher). Die Zusammenfassung bitte auf Deutsch.
- **Zu jeder Fundstelle:** Link, Lizenz (bei Code), Aktualität, und ob es zu **three.js r186 im Browser** passt.
- **Rahmen:** Browser, MacBook mit 30–60 fps, Claymation-Cartoon-Look. Keine Farbverläufe oder Alpha-Übergänge, keine harten Schnittkanten (KFB §01). Jedes Element braucht eine innerweltliche Geschichte (§00).
- **Ergebnisform:**
  1. Kurzfazit in 5 Sätzen;
  2. Tabelle der Techniken bzw. Beispiele mit Vor- und Nachteilen;
  3. konkrete Zahlen und Parameter;
  4. Empfehlung für KFB mit Begründung;
  5. Risiken und offene Fragen;
  6. Liste der Quellen.

---

## P1 · Organische Sprenkelübergänge, die in jeder Distanz funktionieren (höchste Priorität)

> Lies zuerst `KFB_TECHNIK_UND_SCHNITTSTELLEN_R1.md` §2, `R2D_ISLAND_KIT_R2_BAUANLEITUNG.md` §4, `SPEC_EDGE_RUBBLE_GRAMMAR_R1.md` und `KFB_PAINPOINTS_UND_BLINDSPOTS_R1.md` A1. Schau dir die Bilder 01–04 an.
>
> KFB braucht Materialübergänge im Gelände (Gras ↔ Sand, Erde, Pflaster, Fels, Schnee), die aussehen, als hätte jemand Knetfarbe verkleckst: Punkte und Flecken in drei Größen, die in beide Richtungen ineinander tropfen, mit hartem Knetrand. Ohne Verlauf, ohne Alpha, ohne gerade Linie. Unsere heutige Lösung (`kfbBlend`/`kfbLayer`: Schwellwert auf der Differenz zweier Gauß-Ball-Felder je Zelle, vier Zellgrößen) wirkt aus Spielkamera-Distanz gut. Aus Laufhöhe verschmelzen die Flecken aber zu großen Flächen („Shader-Höhenlogik“).
>
> Recherchiere:
> 1. Techniken für stilisierte, handgemalt bzw. gesprenkelt wirkende Terrain-Übergänge in Spielen und Shadern: Splatmaps mit Höhen- bzw. Masken-Blending, stochastische Punkt- und Scheibenmuster (Worley/Voronoi-Disks, Poisson-Disk-Stempel), Dithering und Bayer-Muster, Stempel- bzw. Decal-Textur-Atlanten, hand-painted Brushes, Toon- bzw. Stop-Motion-Shader.
> 2. Wie bleibt ein Muster in jeder Distanz punktförmig? Gesucht sind maßstabsinvariante bzw. bildschirmraum-bewusste Ansätze: Mehrskalen nach Ableitung bzw. `fwidth`, LOD-abhängige Zellgröße, „infinite zoom“-Texturen, Anti-Aliasing harter Masken.
> 3. Beispiele aus Spielen und Demos mit ähnlicher Anmutung, etwa A Short Hike, Tunic, Sable, Townscaper, Tiny Glade, Zelda Wind Waker, Kirby, Clay-Optiken; dazu Shadertoy-Shader und three.js- bzw. TSL-Beispiele mit Code.
> 4. Kosten im Fragment-Shader und was man backen kann: Farbkarte bzw. Vertexfarbe statisch, live nur dort, wo gebaut oder zerstört wird.
>
> Ziel: zwei bis drei konkrete Shader-Ansätze für three.js r186 mit Parametern, die sich aus Lauf-, Fahr- und Übersichtshöhe als Sprenkel lesen. Dazu je ein Codebeispiel bzw. Repo.

## P2 · Straßen- und Rennstrecken-Konstruktion aus Bauteilen, Nähte zum Gelände

> Lies zuerst `KFB_TECHNIK_UND_SCHNITTSTELLEN_R1.md` §3–4, `QA_RULEBOOK_TRANSITIONS_R1.md`, `SPEC_EDGE_RUBBLE_GRAMMAR_R1.md` und die Bilder 05–06.
>
> KFB baut Straßen und Rennstrecken mit einem eigenen Compiler (Track Core: Profile bzw. Querschnitte, Stationen, Familien) und Körpern aus Blender. Gesucht ist, wie man Straßen **als Bauwerk aus Bauteilen** erzeugt, so wie ein Pflasterer oder Straßenbauer es tun würde, statt Formen zu überblenden.
>
> Recherchiere:
> 1. Prozedurale Straßen- und Strecken-Generatoren und ihre Datenmodelle: Spline bzw. Bézier, Clothoiden bzw. Übergangsbögen, Querschnitts-Sweeps, Banking bzw. Querneigung, Loopings, Sprungrampen, Steilkurven, Tunnel. Konzepte von Unity-Road-Tools, Houdini-Road-Tools, Blender Geometry Nodes, Trackmania- und Track-Editoren; three.js- bzw. Open-Source-Repos.
> 2. Kreuzungen und Übergänge zwischen Profilfamilien: Bordstein-Absenkung, Übergangsstein, Verziehung bzw. Verjüngung, Rinnen und Abläufe, Bordsteinkopf, Leitplanken- bzw. Bandenenden, Gehweg-Verlegepläne mit Zuschnitt (Tiling entlang Kurven).
> 3. Naht Straße ↔ Gelände: Terrain-Konforming, Böschung bzw. Embankment, Schürzen unter dem Gelände, Constrained Delaunay mit fester Kante, analytische Straßenbetten, Brückenwurzeln und Tunnelportale im Fels.
> 4. Glaubwürdiges „Rubbel“ bzw. Schutt an Kanten und Enden: Platzierung nach Ursache statt Streuung, Verfallsenden von Pflasterflächen.
>
> Ziel: Liste empfehlenswerter Datenmodelle und Algorithmen für Track Core, Muster für gebaute Übergänge (als Bauteil-Abfolgen mit Station) und zwei bis drei Repos bzw. Talks als Vorbild.

## P3 · Komposition, Erdung und Environmental Storytelling in Zahlen

> Lies zuerst `ETHERINGTON_REGELN_IN_ZAHLEN_R1.md`, `QA_RULEBOOK_ENVIRONMENT_R1.md`, `SPEC_PLACEMENT_GRAMMAR_R1.md`, `ENV_ERZAEHLRASTER_R1.md` und die Bilder 08–14.
>
> KFB setzt Natur und Requisiten aus Kits (KayKit, Kenney, Tiny Treats) auf schwebende Inseln. Bisherige Versuche sind gescheitert: Felsen lagen auf statt im Boden, Blümchenkränze, Streuung ohne Geschichte. Wir haben die Etherington-Brothers-Prinzipien in eine Arbeitsfassung mit Startwerten übersetzt.
>
> Recherchiere:
> 1. Die Etherington-Brothers-Tutorials („How to Think When You Draw“, Environment-, Rock-, Tree- und Water-Tafeln): Welche Regeln gibt es genau? Prüfe unsere Startwerte (Größen 1 : 0,6 : 0,35, Einsinken je Objektart, Tangenten, Gruppen 3/5/7, Abstandsvarianz) und ergänze fehlende Regeln.
> 2. Environment-Art- und Level-Design-Prinzipien mit Zahlen: Rule of Thirds bzw. Three, Big-Medium-Small, Negativraum, Silhouette, Wertkontrast, Wegführung, Sichtachsen, Landmarken; dazu GDC-Talks zu Environmental Storytelling („What happened here?“).
> 3. Erdung je Objektart in stilisierten 3D-Spielen: Felsen eingegraben, Wurzelanlauf, Büsche, Gebäudesockel, Uferzonen.
> 4. Prozedurale Platzierung, die nicht nach Streuung aussieht: Platzierung nach Ursache (Fallobst bergab, Schnee in Mulden), Gruppenregeln, Hand-Authoring mit Vorlagen bzw. Stamps, Wave Function Collapse vs. kuratierte Vorlagen.
>
> Ziel: eine bestätigte bzw. korrigierte Fassung unserer Regeltabelle (Objektart × Regel × Zahl), dazu Prüfungen, die man automatisch messen kann (z. B. Tangenten im Bildraum).

## P4 · Kamera, Fahrgefühl, Loopings und Flug

> Lies zuerst `KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` §3, §3b und §3c sowie `BRIEF_CLAUDE_DESIGN_HUD_FLIGHT_R1.md`.
>
> KFB braucht:
> - eine Third-Person-Kamera für Gehen und Fahren (frei drehbar, ohne dass die Figur sich mitdreht; umschaltbar auf „gesperrt“);
> - einen God Mode mit Zoom zum Cursor;
> - eine robuste Verdeckungslösung: Arm verkürzt sich bis 70 %, Rest als Sicht-Loch mit weichem Knetrand, die Kamera nie im Mesh.
>
> Dazu kommen Arcade-Fahren auf Inselstrecken mit Looping, Sprung und Tunnel sowie ein Flugmodus mit Jetpack.
>
> Recherchiere:
> 1. Third-Person-Kameras: Spring Arm, Kollision (Sphere Casts), Occlusion-Cutout bzw. Dither-Fade bzw. Screen-Space-Kreis, Kamera in Loopings und Tunneln, Nachlauf vs. Dämpfung; dazu three.js-Implementierungen.
> 2. Arcade-Fahrphysik auf Spline-Strecken: Haftung im Looping, Sprungrampen, Landung, Mario-Kart-Antigrav- und Trackmania-Prinzipien; browserfähige Physik (Rapier, cannon-es) gegen kinematische Spline-Fahrt.
> 3. Geschwindigkeitsgefühl: FOV-Änderung, Speedlines, Rand-Rhythmus (Pfosten-Takt in Hz bei Tempo X), Kamera-Shake, Audio.
> 4. Flugsteuerung für Cartoon-Jetpacks: Steuerschema, Höhe, Landung, VFX im Cartoon- bzw. Knet-Stil.
>
> Ziel: Kamera-Architektur mit Parametern, Empfehlung „Physik-Engine oder kinematisch“ für Loopings, eine Formel für den Rand-Rhythmus und Beispiel-Repos.

## P5 · Schwebende Inseln: Gelände, Kante, Unterseite, Wasser

> Lies zuerst `R2D_ISLAND_KIT_R2_BAUANLEITUNG.md`, `R2D_KONZEPT_SCHOLLE_v7.md`, `R2D_WATER_CONCEPT.md`, `R2D_v0_RETURN_VERLAUF.md` und `ISLAND_ANATOMY_RULES.md`.
>
> KFB-Inseln haben eine flache Oberseite aus Abstandsfeld und analytischer Höhe, eine Viertelkreis-Rundung über die Kante und eine Scholle mit zentraler Spitze und senkrechten Ausläufern (SDF + Marching Cubes). Unterseiten v2–v6 sind gescheitert (Drehkörper, Fächer, Symmetrie). Offen sind Wasserfälle über die Kante, Strände bzw. Lagunen an schwebenden Inseln und ein Berg mit Schlucht und Tunnel (Protopia).
>
> Recherchiere:
> 1. Stilisierte schwebende Inseln in Spielen und Demos (Zelda TotK und Skyward Sword, Tiny Glade, Townscaper, Kirby, Diorama-Spiele): Formprinzipien, Anteil Oberseite zu Körper, Spitzen und Ausläufer.
> 2. SDF-Modellierung in three.js: Smooth-Union, Marching Cubes bzw. Surface Nets, Normalen aus dem Feld, Kosten, Baking.
> 3. Wasser an schwebenden Inseln: Wasserfall über die Kante, Strand bzw. Lagune, Schaum am Ufer, stilisierte Wasser-Shader.
> 4. Berge mit Schlucht, Lichtung und Tunnel als Heightfield bzw. SDF-Mischung; Höhlenportal.
>
> Ziel: Parameter-Empfehlungen und Referenzbilder bzw. Demos für Kante, Unterseite und Wasser, passend zu unseren Bauanleitungen.

## P6 · Performance, Knet-Rendering, Architektur und QA-Pipeline

> Lies zuerst `KFB_TECHNIK_UND_SCHNITTSTELLEN_R1.md` §1, §5–7 und `KFB_PROJEKTKONTEXT.md` §5–8.
>
> KFB rendert eine Claymation-Welt mit 4 Inseln, Straßen, instanzierter Natur mit Wind und Musik, Bewohnern, Wasser und Sprenkel-Shadern im Browser, auf einem MacBook mit 30–60 fps. Mehrere KI-Sitzungen bauen parallel, Abnahme über harte Regeln und blinde Kritiker.
>
> Recherchiere:
> 1. Performance in three.js r186: `BatchedMesh` und Instancing, Vertex-Deformer für Wind mit Schatten (`customDepthMaterial`), Schattenbudget, LOD, Frustum Culling, Baking von Übergängen und AO, Textur-Atlanten; WebGL2 vs. WebGPU bzw. TSL, Stand 2026.
> 2. Claymation- bzw. Stop-Motion-Look in Echtzeit: Fingerabdruck-Relief, Subsurface-Anmutung, „boiling“ Animation mit Frame-Hold, Beispiele und Shader.
> 3. Architektur einer modularen Browser-Spielwelt: ein Besitzer je Baustein, Datenformate für Inseln, Straßen und Platzierung (Rezept-JSON), Worldbuilder-Editor im Spiel.
> 4. Automatisierte visuelle QA: Screenshot-Tests aus festen Kameras, Bildvergleich, automatische Kritiker mit Bild-KI, Metriken (z. B. Tangenten, Verläufe, schwebende Objekte).
>
> Ziel: Performance-Checkliste mit Zahlen für unser Budget, Empfehlung zu WebGPU bzw. TSL ja oder nein bzw. wann, Bausteine für eine automatische Bild-Prüfstrecke.
