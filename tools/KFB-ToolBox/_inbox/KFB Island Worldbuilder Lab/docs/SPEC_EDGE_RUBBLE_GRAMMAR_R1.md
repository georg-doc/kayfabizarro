# KFB Kanten-, Übergangs- und Rubbel-Grammatik R1 · ein Prinzip für alle Slices

Status: **GRUNDSATZ · Georg 2026-10-08** · noch kein Bauauftrag
Bezug:
- Zellen-Grammatik `planning/kfb-cell-metric-voxel-world-grammar-2026-10-07`: Open Stage, Edge Completion, Ruin Completion, Fluff-Bau;
- RKIT-Bauweise-Blatt v2;
- Environment-Bauweise „Wie liegt was in der Landschaft“;
- `src/clay/kfb-blend.ts`.

## Grundsatz

Überall, wo in der KFB-Welt etwas endet, wechselt oder abbricht, gilt **dieselbe Sprache**.

**Oberste Regel (Georg 2026-10-09, gilt grundsätzlich):** Es gibt keine harten Schnitte und keine sichtbaren Kanten. Jeder Übergang erscheint organisch, folgt der Cartoon-Logik und ist plausibel aus Knetgummi geformt. Nichts wirkt einfach abgeschnitten. Auch gebaute Enden wie Kantenstein, Bordsteinkopf oder Portal sind gerundete Knet-Bauteile. Verankert ist die Regel in beiden QA-Regelwerken unter §01.

1. **Organischer Oberflächen-Wechsel:** `kfbBlend`-Knetflecken in drei Größen mit hartem Knetrand. Keine Raster, keine Verläufe, keine uniformen Punkte.
2. **Abschlussstück mit Abrundung:** Jede freie Kante endet in einem gerundeten Knet-Abschluss, nie roh geschnitten.
   - **Gebaute Kante** (jemand hat bis hier gebaut, z. B. Bord, Grenze der Bauherren): Zuschnitt + Kantenstein bzw. Bordsteinkopf, beide gerundet und knetig, mit Rubbel bzw. Knetfleck zur Umgebung, nie eine rasierte Linie.
   - **Freies Ende, durch Verfall gerundet** (Georg 2026-10-09, präzisiert): kurz und einfach. Nur ganze große Platten, die letzten drei Platten treten gestaffelt zurück und bilden so einen gerundeten Abschluss. Rubbel füllt die Stufen dazwischen und schließt ab, unregelmäßig gehäuft und nie aufgereiht. Keine lange Zone mit kleinen Zwischenstücken. Das Rubbel hat dieselben Töne wie die Platten. Nie eine helle Kante ohne Rubbel davor, nie ein Spray aus Pünktchen statt eines Endstücks.
3. **Knet-Rubbel und Knetsteinchen:** gestreut an Nähten, Kanten und Füßen, dichter zur Kante hin. Sie erzählen „hier wurde gebaut, abgetragen, ist etwas zerfallen“ (Ruinen-Logik).
   - **Nach Ursache, nie gleichmäßig** (Recherche P2, 2026-10-09):
     - am Kurvenausgang außen, wo gedriftet wird;
     - vor Abläufen und an Tiefpunkten, wo Wasser Krümel sammelt;
     - Abplatzungen an Bordsteinen in engen Innenkurven;
     - am Fuß von Ruinen und Abrisskanten.
   - **Verfallsstufen für Platten an freien Rändern** (Startwert):
     - intakt ≈ 70 %;
     - gelockert ≈ 15 % (angehoben, gekippt, Gras in der Fuge);
     - gebrochen ≈ 10 % (Scherben aus derselben Platte);
     - fehlend ≈ 5 % (Erde bzw. Fugenbett in der Lücke, ohne Verlauf).
4. **Weltlogik (§00):** Jedes Ende hat eine Geschichte. Gebaut, abgebrochen, verwittert oder noch im Bau?

## Wo es gilt

| Bereich | Anwendung | Owner |
| --- | --- | --- |
| Straßen und Übergänge (RKIT) | Belagswechsel als Knetflecken, Kantenstein und Bordsteinkopf als gebaute Enden, Rubbel in Nähten | RKIT |
| Natur und Erdung (Environment) | Erdkeil, Geröllkegel, Krümel am Fuß nach Ursache | Environment + Lab (`addEmbed`) |
| **Freistehende Räume (Open Stage, SceneCell)** | Teilwände enden in Abschlussstücken mit Abrundung, davor Knet-Rubbel, Ruinen-Logik statt Schnittkante | später, Lab bzw. Bau-Owner |
| **An- und Abbau mit Fluff** (Gebäude, Requisiten, Strukturen) | Bauen = Abschluss weicht, Modul setzt an, Naht heilt, neue Kante bekommt Abschluss. Abriss = Ruinen-Abschluss + Rubbel; Rubbel wird zu Fluff bzw. Rohstoff | später (Zellen-Grammatik, NPC-Activities) |

## Ein Baukasten statt vier

Damit nicht jeder Slice seine eigene Lösung baut, gibt es später drei gemeinsame Bausteine:

1. **`kfbBlend`:** Oberflächen-Wechsel. Statisch gebacken, live nur, wo sich etwas ändert (Performance-Regel).
2. **Rubbel-Streuung:** eine instanzierte Streuung aus Knetsteinchen, Dichte nach Abstand zur Kante, feste Seeds, Farbe aus der Farb-Grammatik der Insel.
3. **Abschlussstück-Familie:** gerundete Kappen für Wand-, Boden-, Bordstein- und Mauerenden in MacroCell-Maßen (K2). Sie können zurückweichen, wenn angebaut wird.

## Nächster Schritt (nach Georgs Reset)

Ein Proof „Freistehender Raum“ auf der Testinsel:
- 2 × 1 MacroCell mit zwei Teilwänden aus Tiny-Treats- bzw. KayKit-Modulen;
- Abschlussstücke an den freien Wandenden;
- Rubbel davor, Bodenwechsel per `kfbBlend`;
- dazu ein Anbau-Schritt (+1 Zelle: Abschluss weicht, Naht heilt).

Abnahme nach den Regelwerken: Weltlogik §00, harte Regeln, blinder Kritiker.
