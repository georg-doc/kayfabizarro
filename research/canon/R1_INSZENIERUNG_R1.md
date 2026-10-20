# R1 · Inszenierung von 3D-Dioramen aus festen Spielkameras · R1 · 2026-10-20

**Backlog:** `CANON_3D/RESEARCH_BACKLOG_R1.md` Zeile R1 (Priorität 1). **Ziel:** Kanon Gebiet 12 (Kamera und Inszenierung) und Gebiet 15 (Einpassung ins Terrain), Gates „Fokus-Kontrast“ und „Freiraum um den Fokus“, Kritiker K1/K3.
**Stand:** Recherche-Ergebnis, noch kein Kanon. WS0 entscheidet, was übernommen wird.

## Lesehilfe

Diese Datei übersetzt Staging- und Kompositionspraxis aus Comic-Tafeln, Animation, Theme-Park-Design, Stop-Motion und stilisierten Spielen in Regeln für Bilder aus festen Kameras (Spielkamera plus die 4 Kritiker-Kameras aus `QA_RULEBOOK_ENVIRONMENT_R1.md` §4). Alle Quellen sind sinngemäß und in eigenen Worten wiedergegeben.

**Herkunft jeder Zahl:**
- **[Q]** Die Zahl oder Aussage steht so in der genannten Quelle.
- **[V]** Mein Vorschlag als Startwert. Das ist eine Heuristik, keine Quelle, und muss an KFB-Bildern geeicht werden.
- **[KFB]** Die Regel gibt es schon (Kanon, Etherington R2, QA-Regelwerk). Hier steht nur der Verweis, damit nichts doppelt entsteht.

**Einheiten:** Bildanteile beziehen sich auf das gerenderte Kamerabild (16:9). Weltmaße in H (Figurenhöhe, K2: H = 3,64) und MacroCell (MC = 6,4); keine Meter.

**Nicht doppelt aufgenommen** (steht schon in `ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` bzw. `QA_RULEBOOK_ENVIRONMENT_R1.md`): Tangenten 0–5 px (E3), Überlappen ≥ 15 % / Luft ≥ 25 %, Gruppen 3/5/7, Größen 1 : 0,6 : 0,35, Negativraum ≥ 30 % der Insel (H3), Landmarke höchstes Element und Bäume davor ≤ 60 % (H5), Formwiederholung ≤ 3, keine Klone (H11).

---

## Teil A · Inszenierung aus festen Kameras

### R1-01 · Ein Bild, eine Aussage
- **Regel:** Jedes Kamerabild hat genau **1 Primärfokus** [V] und höchstens **2 Sekundärakzente** [V]. Alles andere ist Füllung und ordnet sich unter.
- **Quelle:** Thomas & Johnston, *The Illusion of Life* (1981), Kap. 3 „The Principles of Animation“, Abschnitt Staging: eine Idee je Einstellung, unmissverständlich präsentiert. Don Carson, „Environmental Storytelling …“ (Gamasutra 2000), Abschnitt zu Fokus und „less is more“: wichtige Story-Elemente über Platzierung und Licht hervorheben, keine konkurrierenden Details. https://www.gamedeveloper.com/design/environmental-storytelling-creating-immersive-3d-worlds-using-lessons-learned-from-the-theme-park-industry
- **Urteil:** gilt für KFB.

### R1-02 · Kompositionstyp je Kamera vorab wählen
- **Regel:** Im Konzeptblatt steht für jede feste Kamera **ein** benannter Kompositionstyp aus einer festen Liste (z. B. Mittelgrund-Fokus, Vordergrund-Rahmen, Drittel-Teilung, Negativraum, Weg zum Horizont). Wählt eine Kamera „übertriebenen Vordergrund“, nimmt der Vordergrund **≥ 60 % des Bildes** ein [Q]; sonst gilt R1-08.
- **Quelle:** The Etherington Brothers, „Creating a Dynamic Landscape Composition with Silhouette“ (Clip Studio Tips), Abschnitt „Dynamic Compositions with Foregrounds, Midgrounds, and Backgrounds“: rund 30 benannte Varianten, darunter „Exaggerated Foreground“ mit mindestens 60 % der Fläche, „Midground Focus“ mit knappem Vordergrund, „Split Into Thirds“, „Negative Space“, „Foreground Frame“, „Three Spotlights“. https://www.clipstudio.net/how-to-draw/archives/163026
- **Urteil:** gilt für KFB. Die 60-%-Zahl gilt nur für diesen einen Typ. Für die Spielkamera ist sie ungeeignet, weil die Figur frei bleiben muss; dort Typ „Mittelgrund-Fokus“ als Standard [V].

### R1-03 · Größe des Fokus im Bild
- **Regel:** Der Primärfokus (Bounding-Box der Silhouette im Bild) nimmt in der Übersichtskamera **4–15 %** und in der Spielkamera **2–10 %** der Bildfläche ein [V]. Unter 2 % ist er nicht mehr lesbar, über 25 % ist er kein Fokus mehr, sondern Kulisse [V].
- **Quelle:** keine Zahl in den Quellen. Abgeleitet aus R1-01 und aus dem Weenie-Prinzip (R1-13): ein Fokus muss einzigartig und gegen seine Umgebung abgesetzt sein, nicht das Bild füllen.
- **Urteil:** gilt für KFB als Startwert [V]; an 10 PASS-Bildern eichen.

### R1-04 · Ort des Fokus im Bild
- **Regel:** Der Schwerpunkt des Primärfokus liegt **innerhalb der Action-Safe-Zone** (je Seite **3,5 %** Rand [Q]) und mindestens **10 %** der Bildbreite vom Rand [V]. Bevorzugt liegt er in einem Band von **±5 %** um eine Drittellinie [V]. Zentriert ist erlaubt, wenn die Landmarke selbst symmetrisch ist.
- **Quelle:** EBU R 95 „Safe areas for 16:9 television production“: Action-Safe 3,5 %, Graphics-Safe 5 % je Rand. https://tech.ebu.ch/publications/r095 — Drittelregel als Konvention; Eye-Tracking-Befunde zeigen aber, dass Platzierung auf Drittel- oder Fluchtpunkten den Blick nicht deterministisch steuert. Gurney, „What does eyetracking tell us about the rules of composition?“ (2018). http://gurneyjourney.blogspot.com/2018/07/what-does-eyetracking-tell-us-about.html
- **Urteil:** gilt für KFB. Safe-Zone als harte Regel, Drittel nur als weiche Regel (Kritiker), weil die Eye-Tracking-Lage sie nicht trägt. HUD-Flächen der Spielkamera zählen zusätzlich als Sperrzone [V].

### R1-05 · Kontrast sammelt sich am Fokus
- **Regel:** Der stärkste Hell-Dunkel-Kontrast, die härteste Kante und das feinste Detail liegen am Fokus. Messung: Der lokale Luminanzkontrast (Std.-Abw. von L* im Fokus-Rechteck) ist **≥ 1,5 ×** der Median aller übrigen Bildkacheln gleicher Größe [V]. Höchstens **1** andere Kachel erreicht **≥ 1,2 ×** des Fokuswerts [V].
- **Quelle:** Gurney, „Tonal Focus“ (2009): Kontrast am Ziel bündeln, Peripherie zurücknehmen. http://gurneyjourney.blogspot.com/2009/05/tonal-focus.html — Gurney-Eye-Tracking (s. o.): Kontrastflächen ziehen Blicke, Gesichter am stärksten. Mitchell, Francke, Eng, „Illustrative Rendering in Team Fortress 2“ (NPAR 2007), §4.3: Umgebung überwiegend gedämpft, kleine Sättigungsinseln; wichtige Elemente heben sich über Farbton und Sättigung ab. https://steamcdn-a.akamaihd.net/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf
- **Urteil:** gilt für KFB. Umsetzung nur über Material, Form und Palette (Kanon 6: Harmonie über das Material), **nicht** über Extra-Licht auf den Fokus (Kanon 7: ein Rig, keine privaten Lichter). Ausnahme: echtes Praktikal mit Story (Laterne, Feuer).

### R1-06 · Drei Wertmassen, eine dominiert
- **Regel:** Das Graustufenbild jeder festen Kamera lässt sich auf **3 Wertgruppen** (hell, mittel, dunkel) reduzieren [Q: 2–4]. Eine Gruppe nimmt **> 50 %** der Bildfläche ein [Q]. Die beiden anderen sind ungleich groß: Differenz **≥ 10 Prozentpunkte** [V], keine unter **8 %** [V]. Der Fokus liegt an der Grenze zwischen der kleinsten und einer anderen Gruppe [V].
- **Quelle:** Virtual Art Academy, „Notan: Top 10 Tips“: auf zwei bis vier Werte reduzieren; ein Wert muss mehr als die Hälfte der Komposition einnehmen; Nebenwerte ungleich verteilen; weniger Werte ergeben stärkeres Design. https://www.virtualartacademy.com/notan/ — Mitchell Albala, „Composition Before Color“: wenige große Formen wirken stärker als viele Teile; zwei bis vier Wertgruppen; ungleiche Hell-Dunkel-Anteile. https://mitchalbala.com/composition-before-color-considerations-in-the-first-phases-of-plein-air-painting/
- **Urteil:** gilt für KFB. Passt zu 60/30/10 (Kanon 6), ist aber eine eigene Prüfung auf Helligkeit statt Farbton.

### R1-07 · Wertordnung nach Flächenneigung
- **Regel:** Unter dem einen Key gilt im Mittel: Himmel bzw. Hintergrund am hellsten, dann waagrechte Flächen (Deckel, Plateau, Boden), dann geneigte Flächen (Hänge, Dächer), dann senkrechte Flächen (Wände, Stämme, Felswände) am dunkelsten. Messung im Normalen-Puffer: mittlere L* je Neigungsklasse fällt monoton, Abstand **≥ 6 L*** zwischen benachbarten Klassen [V].
- **Quelle:** John F. Carlson, *Carlson's Guide to Landscape Painting* (1929/1958), Kapitel zur „Theory of Angles“ (Helligkeit nach Neigung der Fläche zum Himmelslicht). Albala (s. o.) ordnet Landschaftsflächen ebenfalls nach ihrem Winkel zum Licht.
- **Urteil:** gilt für KFB. Das eine Rig plus Knet-Material liefert das von selbst; die Prüfung fängt Meshy-Texturen mit eingebackenem Licht oder falsch getönte Rollen ab (Kanon 15 M2/M3).

### R1-08 · Tiefenstaffel aus fester Kamera
- **Regel:** Jedes Bild hat Vorder-, Mittel- und Hintergrund. Der Primärfokus liegt im **Mittelgrund** [Q als Standardfall]. Der Vordergrund nimmt **≤ 15 %** der Bildfläche ein (außer Typ R1-02 „übertriebener Vordergrund“) [V], liegt an **höchstens 2** Bildrändern [V] und deckt die Fokus-Box zu **≤ 10 %** ab [V]. Zwischen jedem Ebenenpaar gibt es **≥ 1** sichtbare Überdeckung [KFB-Prinzip, hier pro Kamera gezählt].
- **Quelle:** Filmmakers Academy, „Creating Depth with Foreground, Middleground, Background“: Vordergrund rahmt, Mittelgrund trägt meist das Hauptmotiv, Hintergrund gibt Kontext und Maßstab. https://www.filmmakersacademy.com/blog-depth-foreground-background/ — Etherington Brothers (Clip Studio, s. R1-02): Formen der drei Ebenen bewusst ergänzen oder kontrastieren. Bruce Block, *The Visual Story* (2. Aufl. 2008), Kapitel „Space“: Überdeckung, Größenunterschied, Texturgradient und Luftperspektive als Tiefenhinweise.
- **Urteil:** gilt für KFB. Überdeckung je Szene steht schon in Etherington R2 §4; neu ist die Zählung je Kamera und die Sperre „Vordergrund verdeckt den Fokus nicht“.

### R1-09 · Kontrast und Detail nehmen mit der Tiefe ab
- **Regel:** Der Hintergrund hat **≤ 60 %** des Luminanzkontrasts und **≤ 50 %** der Kantendichte des Mittelgrunds [V]. Ferne Kulissen (außerhalb der Spielfläche) sind bewusst einfacher modelliert.
- **Quelle:** Team Fortress 2 (s. R1-05), §6 „Abstraction“: Abstraktion mit der Entfernung; die ferne 3D-Skybox ist eigenes Modell mit Parallaxe, bewusst detailärmer und malerischer, damit sie kein hochfrequentes Rauschen erzeugt. Block (s. R1-08): Luftperspektive als Tiefenhinweis.
- **Urteil:** gilt für KFB, mit Einschränkung: Abschwächung über Detaildichte und Palette (hellere, kühlere Rollentöne aus derselben Palette), **nicht** über zusätzliches Licht oder Farbverlauf (Kanon 4: kein Verlauf; Kanon 7: ein Rig).

### R1-10 · Führungslinien laufen zum Fokus
- **Regel:** Mindestens **1** Weg, Ufer, Kante oder Zaunlinie läuft im Bild auf den Fokus zu: ihre Verlängerung verfehlt den Fokus-Schwerpunkt um **≤ 10 %** der Bildbreite [V]. Der Weg ist im Bild frei, nicht verdeckt [Q, qualitativ]. Er verbindet Höhenebenen bzw. Bildebenen [Q, qualitativ].
- **Quelle:** The Etherington Brothers, „How to Draw Train Tracks and Pathways“ (Clip Studio Tips): Pfad frei halten, zum Fokus führen, Ebenen verbinden; ein Weg gibt jeder Gestaltung sofort Struktur. https://www.clipstudio.net/how-to-draw/archives/167464 — Gegenbefund: Gurney-Eye-Tracking (s. R1-04): Blicke folgen Linien nicht wie Schienen.
- **Urteil:** gilt für KFB als weiche Regel (Kritiker K3, kein FAIL), weil der Effekt nach Eye-Tracking schwächer ist als gelehrt. Die geometrische Messung bleibt als Befund-Hinweis.

### R1-11 · Leserichtung
- **Regel:** Für die Spielkamera ohne eigene Fahrtrichtung: Hauptweg tritt **links unten** ins Bild und läuft nach **rechts oben** [V]; Fokus-Schwerpunkt bei **x ≥ 0,5** der Bildbreite [V]. Figuren, die ins Bild blicken oder gehen, haben **≥ 1/3** der Bildbreite Raum in Blick- bzw. Laufrichtung [V, Film-Konvention „Lead Room“].
- **Quelle:** Chokron & De Agostini (2000), *Cognitive Brain Research*, „Reading habits influence aesthetic preference“ (81 französische und 81 israelische Rechtshänder [Q]): Links-nach-rechts-Leser bevorzugen nach rechts gerichtete Bilder, Rechts-nach-links-Leser nach links gerichtete; Landschaften mit Masse rechts wurden in beiden Gruppen bevorzugt, signifikant nur in einer. https://www.researchgate.net/publication/12342946_Reading_habits_influence_aesthetic_preference
- **Urteil:** gilt für KFB als weiche Regel (Kritiker). Gilt **nicht** für die Fahrkamera (P4/V-025 ff. regeln Blick nach vorn) und nicht, wenn die Spielrichtung einer Insel anders läuft.

### R1-12 · Silhouette des Fokus
- **Regel:** Fokus und Landmarke sind als reine Schwarzweiß-Maske (ohne Innenschattierung) erkennbar. Messung: **≥ 30 %** des Fokus-Umrisses grenzen an eine Fläche mit **ΔL* ≥ 20** [V]. Der Kritiker benennt das Objekt aus der Maske allein [V].
- **Quelle:** Team Fortress 2 (s. R1-05), §4.1: die Figuren wurden in der Konzeptphase daran geprüft, ob sie als Silhouette ohne Innenschattierung erkennbar sind; Innendetails greifen die Silhouettenform auf. Etherington Brothers (Clip Studio, s. R1-02), Abschnitt „Silhouette Thumbnails“: Silhouetten-Skizzen prüfen, ob eine Form liest.
- **Urteil:** gilt für KFB. Figuren-Silhouetten gehören zu Gebiet 9; hier gilt die Regel für Fokus und Landmarke der Umgebung.

### R1-13 · Landmarke als „Weenie“
- **Regel:** Die Landmarke einer Insel ist aus **≥ 3 der 4** Kritiker-Kameras sichtbar [V] und in Form **oder** Farbe einzigartig auf der Insel (kein zweites Objekt gleicher Rolle und ähnlicher Silhouette) [V]. Sie zieht als Fernziel; kleinere Ziele innerhalb der Insel konkurrieren nicht mit ihr.
- **Quelle:** Theory of Theme Parks, „Wayfinding in Themed Design: The Weenie“ (2015): hoch sichtbar, einzigartig, Kontrast zur Umgebung; Hierarchie aus einem Hauptmagneten und untergeordneten Zielen; schrittweise Enthüllung beim Annähern. http://theoryofthemeparks.blogspot.com/2015/08/wayfinding-in-themed-design-weenie.html — Naughty Dog nutzt Fernmarken (Riesenrad, vom Mond beleuchtetes Wrack) als Wegweiser, 80.lv zu *The Last of Us Part II*. https://80.lv/articles/how-naughty-dog-created-the-immersive-world-of-the-last-of-us-part-ii
- **Urteil:** gilt für KFB. „Landmarke höchstes Element“ steht schon in H5; neu sind Sichtbarkeit je Kamera und Einzigartigkeit.

### R1-14 · Freiraum um den Fokus
- **Regel:** In einem Ring um die Fokus-Box (Breite **0,25 ×** ihrer Diagonale) liegt kein Element, dessen lokaler Kontrast **> 50 %** des Fokuskontrasts erreicht [V]. Der Ring ist das Gate „Freiraum um den Fokus“ aus dem Backlog.
- **Quelle:** keine Zahl in den Quellen. Prinzip aus Gurney „Tonal Focus“ (Kontrast nur am Ziel), Weenie (Kontrast zur Umgebung) und TLOU2 (freie „Möglichkeitsräume“ ohne Ablenkung um Interaktionsstellen, 80.lv s. R1-13).
- **Urteil:** gilt für KFB als Startwert [V].

### R1-15 · Rahmung
- **Regel:** Rahmung durch Vordergrund an **≤ 2** Bildrändern, Tiefe des Rahmens **≤ 12 %** der Bildbreite bzw. -höhe [V]. Der Rahmen ist im Mittel **dunkler** oder **ruhiger** (weniger Kanten) als der Mittelgrund [V].
- **Quelle:** Etherington Brothers (Clip Studio, s. R1-02), Typ „Foreground Frame“; Filmmakers Academy (s. R1-08) zu „frame within a frame“ durch Tore, Fenster, Bögen.
- **Urteil:** gilt für KFB. Abdunkeln nur über Material und echten Schatten des einen Keys, **keine** Vignette als Bildeffekt (Kanon 7).

### R1-16 · Blickwinkel der Übersichtskamera
- **Regel:** Die Übersichtskamera (Kritiker-Kamera 1) blickt mit **30–40°** Neigung von oben [V], also zwischen klassischer 2:1-Dimetrie (**≈ 26,57°** [Q]) und Isometrie (**35,26°** [Q]). Flacher als 25° verliert das Bild die Miniatur-Wirkung [Q, qualitativ].
- **Quelle:** Wikipedia „Isometric video game graphics“ (Winkel 35,264° bzw. arctan ½ ≈ 26,565°; feste Schrägansicht zeigt Seiten, die von oben oder von der Seite verborgen wären). https://en.wikipedia.org/wiki/Isometric_video_game_graphics — Wikipedia „Miniature faking“: der Miniatur-Eindruck braucht einen hohen Blickwinkel; niedrige Winkel mit hohen Objekten schwächen ihn. https://en.wikipedia.org/wiki/Miniature_faking
- **Urteil:** gilt für KFB für die Übersichtskamera. Spielkamera bleibt bei V-025–V-027 und V-088.

### R1-17 · Miniatur-Look per Bildeffekt
- **Regel (geprüft):** Tilt-Shift-Unschärfe, Kontrast- und Sättigungsanhebung als Nachbearbeitung, um „Diorama“ zu signalisieren.
- **Quelle:** Wikipedia „Miniature faking“ (s. R1-16): Unschärfe ober- und unterhalb der Bildmitte, mehr Kontrast, mehr Sättigung.
- **Urteil:** **nicht übernommen, weil** Farbe und Kontrast aus Material und dem einen Tonweg kommen (Kanon 6/7) und Unschärfe die Erdung in Abnahmebildern verdeckt (Kanon 15 (6), K4). Ein Fotomodus könnte es später optional bekommen; für Abnahme verboten.

### R1-18 · Kulissenbau nur für eine Kamera
- **Regel (geprüft):** Stop-Motion baut und dekoriert je Einstellung: wenige Bäume werden pro Shot neu gruppiert, eine gebaute Wand wird digital zur ganzen Halle vervielfältigt, ferne Teile entstehen als Set-Erweiterung.
- **Quelle:** Screen Rant, Set-Besuch *Kubo and the Two Strings*: Puppen im Schnitt 9½ Zoll hoch, Sets rund 43½ Zoll hoch; dieselben wenigen Bäume werden von Shot zu Shot neu gesetzt; die „Hall of Bones“ hat 1 gebaute Wand und 7 digitale Kopien [Q]. https://screenrant.com/kubo-two-strings-set-visit-report/ — VFX Voice zu Aardmans *Early Man*: rund 40 Sets parallel, Blue-/Greenscreen mit digitaler Set-Erweiterung und Matte-Painting für Himmel [Q]. https://vfxvoice.com/aardman-goes-back-to-stop-motion-basics-with-early-man/
- **Urteil:** **nicht übernommen, weil** QA §00 verlangt, dass jede Insel aus mehreren Winkeln trägt; Umgruppieren je Kamera wäre die verbotene „Kulisse ohne Welt“. **Übernommen** wird nur der Teil „Ferne darf Kulisse sein“ (s. R1-09): was außerhalb der Spielfläche liegt, darf vereinfacht und kamerabezogen gebaut sein.

---

## Teil B · Einpassung ins Terrain (Kanon Gebiet 15)

Frage aus dem Brief: Wie verschmelzen stilisierte Spiele handgebaute Sets mit prozeduralem Gelände? Befund in einem Satz: Die guten Beispiele legen nichts auf das Gelände, sondern **wählen oder erzeugen das Übergangsstück aus dem Zustand der Nachbarschaft** (Ecken, Terrain-Typ, Höhe, Nähe zu Bauten). Der Übergang ist ein gebautes Teil mit Regeln, keine Überblendung.

### R1-19 · Übergänge an den Ecken wählen (Dual Grid)
- **Regel:** Der Rand jeder Szene ist ein Ring aus Übergangsbausteinen (Steinband, Schürze, Erdkeil, Rubbel). Welcher Baustein liegt, folgt aus dem Zustand der **4 Ecken** einer Randzelle (z. B. Szene/Terrain, Gras/Fels/Weg, Höhenstufe). Bei 2 Zuständen sind das **16 Fälle, 6 mit Drehung** [Q]. Für KFB je Biom mindestens **6** Knet-Übergangsbausteine [V], gestaltet als Rubbel bzw. Sprenkel nach V-403.
- **Quelle:** Oskar Stålberg (Bad North, Townscaper): Kacheln entlang des dualen Gitters schneiden und über Marching Squares nach den Eckzuständen wählen; Zusammenfassung mit Zählung bei Boris the Brave, „Quarter-Tile Autotiling“ (2023): 6 Kacheln mit, 16 ohne Rotation; Marching Squares erlauben weite Kurven und mehrere Terrains. https://www.boristhebrave.com/2023/05/31/quarter-tile-autotiling/ — Game Developer, „How Townscaper Works“: Marching Cubes erzeugt den Möglichkeitsraum, WFC wählt; erst grobe Form, dann Detail; Übergänge und Ecken bekommen eigene künstlerische Aufmerksamkeit. https://www.gamedeveloper.com/game-platforms/how-townscaper-works-a-story-four-games-in-the-making
- **Urteil:** gilt für KFB als Bauprinzip für Steinband und Schürze (Grammatik R2 §4). Die Kacheln selbst sind Knet-Bauteile mit Sprenkel-Auslauf in beide Richtungen, keine Alpha-Kanten.

### R1-20 · Das Gelände reagiert auf den Bau
- **Regel:** Nicht nur die Szene passt sich an, auch das Terrain reagiert: Streuung (Gras, Büsche, Kiesel) nimmt den Szenen-Footprint als Maske. Innerhalb eines Rings von **0,5–1,5 H** um den Sockel ändert sich die Dichte stufenweise über Sprenkel in **3 Größen** [V; drei Größen = KFB V-403]. Vor Türen und an Wegen **0** hohe Vegetation in **≥ 0,3 H** Breite [V].
- **Quelle:** Tiny Glade (Pounce Light): Vegetation wächst prozedural und passt sich der Nähe gebauter Strukturen an (80.lv). https://80.lv/articles/this-upcoming-game-lets-you-procedurally-glue-buildings-together — Steam-Seite: Weg durch ein Haus erzeugt eine Tür, angehobene Bauten bekommen Stützen, Efeu überzieht die Gebäude. https://store.steampowered.com/app/2198150/Tiny_Glade/ — Guerrilla, „GPU-Based Run-Time Procedural Placement in Horizon Zero Dawn“ (GDC 2017): regelbasierte, von Artists steuerbare Platzierung, die mit handgesetzten Assets und Straßen arbeitet. https://www.guerrilla-games.com/read/gpu-based-procedural-placement-in-horizon-zero-dawn
- **Urteil:** gilt für KFB. Kein Grasring als Kranz (Etherington R2 §5c), sondern Dichteänderung mit Ursache (Tritt, Schatten, Tropfkante).

### R1-21 · Erst die große Form, dann das Detail
- **Regel:** Reihenfolge beim Einpassen: (1) Terrain formt Sockel bzw. Erdkeil, (2) Szene sinkt ein, (3) Übergangsbausteine, (4) Streuung und Sprenkel, (5) Story-Requisiten. Kein Schritt darf einen früheren überschreiben [V].
- **Quelle:** Townscaper (Game Developer, s. R1-19): die schwere Arbeit zuerst (Blöcke), Dekoration danach; Spieler kontrolliert große Formen, das System spielt mit kleinen. Tiny Glade (80.lv-Interview): eigene Generatoren je Element, jede Regel handgemacht und kuratiert. https://80.lv/articles/exclusive-tiny-glade-developers-discuss-bevy-proceduralism-publishers-cozy-games
- **Urteil:** gilt für KFB. Passt zu Etherington R2 §5b (Anker zuerst, Mikro zuletzt).

### R1-22 · Ein Detail-Takt für Szene und Terrain
- **Regel:** Szene und umgebendes Terrain haben dieselbe Detailfrequenz: Die Kantendichte im Graustufenbild der Szene liegt beim **0,7–1,5-Fachen** des Terrains im Ring um sie [V]. Wiederholte Kleinstrukturen (Latten, Pfosten, Schwellen) werden angedeutet statt vollzählig modelliert [Q, qualitativ].
- **Quelle:** Team Fortress 2 (s. R1-05), §4.2/§4.3: Welt bewusst ohne überkomplexe Geometrie; repetitive Strukturen minimal, der Eindruck der Wiederholung zählt mehr als jedes Einzelteil; malerische Texturen wie Miyazaki-Hintergründe, mit wenig visuellem Rauschen; hochfrequentes Detail überdeckt die Gestaltungsabsicht.
- **Urteil:** gilt für KFB. Das ist der messbare Teil von Georgs „andere Texturen, andere Geometrien“ (Kanon 15 (3)/(5)).

### R1-23 · Wenige Töne für das ganze Bild
- **Regel:** Ein Kamerabild (Szene plus Terrain) enthält nach Farb-Clustering höchstens **18** unterscheidbare Töne (6 Rollen × 3 Töne) [V, aus Kanon 6 abgeleitet]. Kein Ton der Szene liegt außerhalb der Biom-Palette des umgebenden Terrains [KFB, Kanon 15 (2)].
- **Quelle:** Animation Obsessive, „What Kazuo Oga Thinks About When He Thinks About Backgrounds“: Oga arbeitete mit rund **21** Plakatfarben [Q]; der Reichtum kam aus Mischung und Kontrast, nicht aus der Zahl der Farben; er wählt Wesentliches aus und verstärkt es. https://animationobsessive.substack.com/p/what-kazuo-oga-thinks-about-when — Gurney, „Kazuo Oga“ (Gurney Journey, Feb. 2011): Ogas Hintergründe sind trotz Detailfülle tonal und farblich einfach angelegt, weil Animationshintergründe schnell erfasst werden müssen; Demo-Post 2017: erst große weiche Flächen, Details zuletzt. http://gurneyjourney.blogspot.com/2011/02/kazuo-oga.html · http://gurneyjourney.blogspot.com/2017/03/demo-by-kazuo-oga.html
- **Urteil:** gilt für KFB. Die 21 sind ein Werkstatt-Befund (Pigmente, nicht Bildtöne) und nur Größenordnung; die 18 folgen aus der KFB-Palette.

### R1-24 · Gleiche Informationsmenge je Kamerawinkel (Rolling Log)
- **Regel (geprüft):** Animal Crossing biegt die Welt per Shader wie einen rollenden Baumstamm, damit bei jedem Kamerawinkel etwa gleich viel Gelände und etwas Himmel zu sehen ist.
- **Quelle:** Zusammenfassung u. a. bei Alastair Aitchison, „Animal Crossing Curved World Shader“ (2013), und in der Bevy-Diskussion #10062; der Produzent von *Wild World* begründete den Effekt damit, im oberen DS-Bildschirm Himmel zu zeigen. https://alastaira.wordpress.com/2013/10/25/animal-crossing-curved-world-shader/ · https://github.com/bevyengine/bevy/discussions/10062
- **Urteil:** **nicht übernommen als Shader, weil** schwebende Inseln ihre Unterseite und Silhouette zeigen (Gebiet 5) und die Krümmung den K2-Maßstab im Bild verfälscht. **Übernommen** wird das Prinzip als Prüfung: Himmel bzw. Hintergrund-Fläche in jeder festen Kamera **10–35 %** [V], damit Landmarke und Silhouette Luft haben.

### R1-25 · Abnahme nur im echten Terrain
- **Regel:** Alle Zahlen aus R1-03 bis R1-23 werden im echten Spielterrain aus Spielkamera und den 4 Kritiker-Kameras gemessen. Ein Bild auf neutralem Boden zählt nicht.
- **Quelle:** [KFB] Kanon Gebiet 15 (6). Gestützt durch Tiny Glade und Townscaper (s. o.): dort entsteht der Look erst im Zusammenspiel mit Gelände und Nachbarn.
- **Urteil:** gilt für KFB (Bestand, hier nur zur Vollständigkeit).

---

## Vorschlag Prüfung

**G** = mechanisches Gate (Code, Geometrie oder Graustufenbild); **K** = Kriterium für den blinden Kritiker. Alle Bildmessungen auf dem Render der festen Kameras, Graustufen als L* (CIELAB). Fokus-Box und Landmarke kommen aus dem Konzeptblatt (Objekt-ID), nicht aus der Bildanalyse.

| Regel | Art | Prüfung | Grenze | Kanon-Bezug |
|---|---|---|---|---|
| R1-01 | K | „Was ist das Hauptmotiv?“ Kritiker nennt ohne Text genau 1 Motiv; nennt er 2 gleichwertige, Befund | 1 Motiv, ≤ 2 Akzente | K3 |
| R1-02 | G + K | Konzeptblatt-Feld `composition_type` je Kamera aus fester Liste; bei „exaggerated_foreground“ Masken-Anteil Vordergrund messen | Feld gesetzt; VG ≥ 60 % bei diesem Typ | K0, K3 |
| R1-03 | G | ID-Maske des Fokus-Objekts, Anteil der Bounding-Box an der Bildfläche | Übersicht 4–15 %, Spiel 2–10 % | neu |
| R1-04 | G | Schwerpunkt der Fokus-Maske gegen Safe-Zone und HUD-Rechtecke; Drittel-Abstand nur protokollieren | in Action-Safe (3,5 %), ≥ 10 % vom Rand | neu |
| R1-05 | G | Bild in 8×8 Kacheln; Std.-Abw. L* je Kachel; Verhältnis Fokus-Rechteck zu Median | ≥ 1,5 ×; höchstens 1 Kachel ≥ 1,2 × Fokus | Backlog-Gate „Fokus-Kontrast“ |
| R1-06 | G | Graustufenbild per k-means (k = 3) quantisieren; Flächenanteile | größte > 50 %, Differenz ≥ 10 pp, keine < 8 % | K2 (Wert) |
| R1-07 | G | Normalen-Puffer in 4 Klassen (Himmel, < 15°, 15–60°, > 60°); mittlere L* je Klasse | monoton fallend, Abstand ≥ 6 L* | M2/M3 |
| R1-08 | G + K | Tiefenpuffer in 3 Bänder (Schwellen aus Konzeptblatt); VG-Anteil, Ränder, Überdeckung der Fokus-Box; Überdeckung je Ebenenpaar zählen | VG ≤ 15 %, ≤ 2 Ränder, Fokus ≤ 10 % verdeckt, je Paar ≥ 1 | K3 |
| R1-09 | G | wie R1-05 und Sobel-Kantendichte, getrennt nach Tiefenband | HG ≤ 60 % Kontrast, ≤ 50 % Kanten von MG | K6 |
| R1-10 | K (+ G-Hinweis) | Wegachse aus Geometrie ins Bild projizieren, Abstand der Verlängerung zum Fokus; Kritiker: „Führt etwas zum Motiv?“ | Hinweis bei > 10 % Bildbreite | K3 |
| R1-11 | K | Kritiker: Eintritt des Wegs, Lage des Fokus, Raum vor Figuren | weich, kein FAIL | K3 |
| R1-12 | G + K | Fokus-Maske dilatieren, Ring-Pixel mit ΔL* ≥ 20 zählen; Kritiker benennt Objekt aus Maske | ≥ 30 % des Umrisses; Objekt benannt | K3 |
| R1-13 | G | Sichttest Landmarke (Raycast oder ID-Pixel ≥ 0,5 % Bild) in den 4 Kritiker-Kameras; Einzigartigkeit über Rolle und Silhouetten-Ähnlichkeit (IoU der Masken < 0,6) | ≥ 3 von 4 Kameras; keine Doppelung | H5, K1 |
| R1-14 | G | Ring 0,25 × Diagonale um Fokus-Box; Kachel-Kontrast im Ring gegen Fokus | keine Kachel > 50 % | Backlog-Gate „Freiraum um den Fokus“ |
| R1-15 | G | VG-Maske je Rand; Tiefe in % der Bildkante; mittlere L* und Kantendichte VG gegen MG | ≤ 2 Ränder, ≤ 12 %, dunkler oder ruhiger | K3 |
| R1-16 | G | Kamera-Pitch der Kritiker-Kamera 1 aus Preset | 30–40° | Kamera-Presets §4 |
| R1-17 | G | Postprozess-Liste der Abnahme-Renderpipeline | keine DOF/Tilt-Shift/Sättigungs-Pässe | Kanon 7 |
| R1-18 | K | Kritiker vergleicht 4 Kameras: wirkt etwas nur aus einem Winkel? | Befund = FAIL nach QA §00 | K9 |
| R1-19 | G | Für jede Randzelle Eckzustände berechnen und prüfen, ob ein passender Übergangsbaustein sitzt; keine nackte Kante | 0 Randzellen ohne Baustein; je Biom ≥ 6 Bausteine | B1, Kanon 4 |
| R1-20 | G | Streudichte in Ringen 0–0,5 / 0,5–1,5 / > 1,5 H um den Footprint; Korridor vor Türen | Dichteänderung in Stufen, 0 hohe Vegetation im Türkorridor | E1/E2, K4 |
| R1-21 | G | Reihenfolge im Bau-Log von `kfb_env` (Phasen-Stempel je Instanz) | Reihenfolge 1–5 eingehalten | K0 |
| R1-22 | G | Sobel-Kantendichte im Szenen-Footprint gegen Terrain-Ring, gleiche Kamera | 0,7–1,5 × | M1, K6 |
| R1-23 | G | k-means in Lab auf Szene plus Ring; Töne außerhalb der Biom-Palette (ΔE > 6) zählen | ≤ 18 Cluster; 0 Töne außerhalb | M3, K2 |
| R1-24 | G | Anteil Himmel/Hintergrund-Pixel (Tiefe = fern oder Sky-ID) je Kamera | 10–35 % | K3 |
| R1-25 | G | Export-Metadaten: Terrain-ID ≠ „neutral“ | Pflicht | Kanon 15 (6) |

**Eichung:** Alle [V]-Grenzen zuerst an 10 Bildern messen, die Georg bereits als PASS abgenommen hat, und an 10 FAIL-Bildern. Liegt eine Grenze so, dass PASS-Bilder durchfallen, wird die Grenze korrigiert, nicht das Bild.

## Quellen

- Thomas, F. & Johnston, O.: *The Illusion of Life: Disney Animation* (1981), Kap. 3, Staging.
- Block, B.: *The Visual Story* (2. Aufl. 2008), Kap. „Space“.
- Carlson, J. F.: *Carlson's Guide to Landscape Painting* (1929/1958), Kapitel „Theory of Angles“.
- The Etherington Brothers (Clip Studio Tips): https://www.clipstudio.net/how-to-draw/archives/163026 · https://www.clipstudio.net/how-to-draw/archives/167464 — weitere Tafeln (Bildtafeln, Inhalt hier nicht textlich geprüft; Gegenlesen ist Backlog R2): https://theetheringtonbrothers.blogspot.com/p/every-how-to-think-when-you-draw.html
- Carson, D.: „Environmental Storytelling …“ (Gamasutra 2000): https://www.gamedeveloper.com/design/environmental-storytelling-creating-immersive-3d-worlds-using-lessons-learned-from-the-theme-park-industry
- Mitchell, Francke, Eng: „Illustrative Rendering in Team Fortress 2“ (NPAR 2007): https://steamcdn-a.akamaihd.net/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf
- Gurney, J.: Tonal Focus https://gurneyjourney.blogspot.com/2009/05/tonal-focus.html · Eye-Tracking https://gurneyjourney.blogspot.com/2018/07/what-does-eyetracking-tell-us-about.html · Kazuo Oga http://gurneyjourney.blogspot.com/2011/02/kazuo-oga.html · Oga-Demo http://gurneyjourney.blogspot.com/2017/03/demo-by-kazuo-oga.html
- Virtual Art Academy, Notan: https://www.virtualartacademy.com/notan/
- Albala, M.: Composition Before Color: https://mitchalbala.com/composition-before-color-considerations-in-the-first-phases-of-plein-air-painting/
- Filmmakers Academy, Foreground/Middleground/Background: https://www.filmmakersacademy.com/blog-depth-foreground-background/
- EBU R 95, Safe areas for 16:9: https://tech.ebu.ch/publications/r095
- Chokron, S. & De Agostini, M. (2000): https://www.researchgate.net/publication/12342946_Reading_habits_influence_aesthetic_preference
- Theory of Theme Parks, The Weenie: http://theoryofthemeparks.blogspot.com/2015/08/wayfinding-in-themed-design-weenie.html
- 80.lv, Naughty Dog TLOU2: https://80.lv/articles/how-naughty-dog-created-the-immersive-world-of-the-last-of-us-part-ii
- Wikipedia: Isometric video game graphics https://en.wikipedia.org/wiki/Isometric_video_game_graphics · Miniature faking https://en.wikipedia.org/wiki/Miniature_faking
- Screen Rant, Kubo-Set-Besuch: https://screenrant.com/kubo-two-strings-set-visit-report/ · VFX Voice, Early Man: https://vfxvoice.com/aardman-goes-back-to-stop-motion-basics-with-early-man/
- Townscaper: https://www.gamedeveloper.com/game-platforms/how-townscaper-works-a-story-four-games-in-the-making · Boris the Brave: https://www.boristhebrave.com/2023/05/31/quarter-tile-autotiling/
- Tiny Glade: https://store.steampowered.com/app/2198150/Tiny_Glade/ · https://80.lv/articles/this-upcoming-game-lets-you-procedurally-glue-buildings-together · https://80.lv/articles/exclusive-tiny-glade-developers-discuss-bevy-proceduralism-publishers-cozy-games
- Guerrilla, HZD-Platzierung: https://www.guerrilla-games.com/read/gpu-based-procedural-placement-in-horizon-zero-dawn
- Animation Obsessive, Kazuo Oga: https://animationobsessive.substack.com/p/what-kazuo-oga-thinks-about-when
- Rolling Log: https://alastaira.wordpress.com/2013/10/25/animal-crossing-curved-world-shader/ · https://github.com/bevyengine/bevy/discussions/10062

**Nicht gefunden bzw. offen:** Kein öffentlicher Vortrag von Pounce Light mit Regeln für Wandfuß, Rubbel oder Moos in Tiny Glade gefunden; die Aussagen oben stützen sich auf Steam-Text und Interviews. Keine öffentliche Quelle zu Nintendos Gelände-Regeln in *New Horizons* (CEDEC 2020 nur als Screenshot-Notiz bei TCRF). Pixar-Layout-Interna mit Zahlen: keine belastbare öffentliche Quelle gefunden; deshalb hier nur allgemeine Tiefenstaffel.
