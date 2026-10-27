# Krater · Topologie, Physik, mentale Modelle · R1 (WS0, 27.10.2026)

Golden Sample: TurboSquid „Cartoon Crater“ 820997 (ale_xey), 11 Vorschaubilder in `75_REFS/crater_golden_r1/`.
Auftrag Georg: erst studieren und Physik rückwärts verstehen, dann 1:1 nachbauen, Blind-Critic ≥ 8/10, erst dann zeigen.

## Was das Golden Sample zeigt (Befund)
- **Träger:** flache, unregelmäßige Bodenscheibe (Vieleck mit etwa 13 Ecken), Krater mittig.
- **Mulde:** runde, tiefe Schüssel, Radius etwa 0,4 der Scheibe. Steile Wände, Boden in weichen „Schlamm-Zellen“ (Voronoi, aufgewölbt). Innen am dunkelsten.
- **Rand:** ein Ring aus Krustenschollen (Radius 0,4–0,6). Kantige, abgefaste Platten, angehoben und zur Mulde hin abgekippt, mit dunklen Fugen dazwischen. Einzelne Schollen sind halb in die Mulde gerutscht.
- **Risse:** etwa 16 radiale Spalten, die am Rand beginnen. Jede ist eine V-Rinne, breit am Rand und spitz auslaufend. Die Länge reicht von 0,15 bis 0,45 Radien über den Rand hinaus. Viele gabeln sich am Ende (Y) oder haben Seitenäste und laufen leicht im Zickzack. Eine Rissflanke steht höher (Versatz), die Kante fängt Licht.
- **Außen:** ruhiger Boden. Der Stern entsteht nur aus den Rissen, nicht aus Steinen oder Farbe.

## Physik rückwärts (warum es so aussieht)
1. **Einschlag → Druckwelle → Aushub:** Material fließt nach unten und außen. Es bleibt eine Schüssel, deren Tiefe zur Mitte am größten ist.
2. **Spröde Kruste über weichem Grund:** Die oberste Schicht kann sich nicht dehnen. Um die Mulde zerbricht sie in Schollen, wird angehoben und kippt nach innen (aufgeworfener Rand).
3. **Radiale Zugrisse:** Die Ausdehnung am Rand reißt die Kruste strahlenförmig auf. Die Energie nimmt nach außen ab, deshalb wird der Riss **schmaler und flacher, bis er ausläuft**. Das ist die Verdünnung nach außen.
4. **Gabelung:** Reicht die Restenergie nicht mehr für einen geraden Riss, spaltet er sich (Y) oder knickt ab (Zickzack entlang schwacher Stellen).
5. **Abstand der Risse:** ungefähr gleichmäßig (Spannung baut sich zwischen zwei Rissen neu auf), deshalb 14–18 Risse rundum, nicht regelmäßig, aber ohne große Lücken.
6. **Auswurf** (für spätere Schichten): fliegt entlang der Risse, große Stücke nah, kleine weit, weniger nach außen.

## Mentale Modelle für den Bau
- **Drei Lagen:** Grund (weich, Schüssel) · Kruste (spröde, Schollen und Risse) · Streu (Auswurf). Zuerst die Kruste, der Stern ist eine Folge davon.
- **Riss = Energie-Pfad:** Er startet am Rand mit Energie E (Länge, Breite und Tiefe ∝ E), läuft nach außen, verliert Energie, knickt leicht und gabelt sich, wenn E unter eine Schwelle fällt. Breite und Tiefe gehen gegen null.
- **Scholle = Raum zwischen zwei Rissen am Rand:** Je zwei benachbarte Risse begrenzen eine Randscholle. Sie wird angehoben, nach innen gekippt, an den Kanten gefast und eventuell noch einmal quer geteilt.
- **WFC-Sicht (Georg):** Strahlen sind Konstruktionslinien. Sie verdichten sich zu Rissen, aus Rissen und Schollen ergibt sich der Stern. Nicht-repetitiv wird es über Saat, Energie je Riss, Gabelregel und Zickzack.

## Bauweg
1. 1:1-Nachbau des Golden Sample als Höhenfeld-Mesh (Rissverlauf aus der Draufsicht übernommen), Ansichten wie die Vorschaubilder gerendert.
2. Blind-Critic: Vorlage gegen Modell, ohne Wissen, welches welches ist. Ziel ≥ 8/10 in den relevanten Strukturen und Ansichten.
3. Erst dann zeigen. Danach Kuppel bündig in den Kraterrand, dann Farbigkeit, dann Übertrag auf Zerstörung, Kampf und Fluff-Ernte.
4. Aus dem Nachbau die prozedurale Logik ableiten (Saat → Risse mit Energie → Schollen → Mulde), nicht-repetitiv.

## Stand und Lernergebnis (27.10., Georg: „so nehmen, persistieren, parken“)
- Nachbau R1 abgenommen als Arbeitsstand (Blind-Critic 4–6/10, Grundriss, Rissanzahl und -lage stimmen). Kein Kauf des Originals. Dateien: `75_REFS/crater_golden_r1/nachbau_r1/` (golden2.py = Höhenfeld aus Draufsicht + nachgezeichnete Risse und Platten, render.py = Blender, H.npy, albedo.png). Blender-Ansicht: Sammlung `KFB_Krater_Golden`.
- **Leitbild Georg: Krater wie ein Baum, der aus dem Boden wächst.** Die aufgeworfenen Lippen und Schollen sind die Erde, die Risse sind die Wurzeln: dick am Stamm (Kraterrand), verzweigen sich und laufen spitz aus. Das ist zugleich das allgemeine Einbettungsmodell der Etheringtons: Alles, was im Gelände steht oder einschlägt (Baum, Fels, Kuppel, Haus, Goo-Gebäude), drückt die Erde zu einer Lippe auf und schickt wurzelartige Risse in den Boden.
- Lehre aus 10 Runden: Das Golden Sample ist ein Low-Poly-Modell mit gemalter Textur und Normal-Map. Für das Spiel gilt deshalb dieselbe Bauweise: wenig Geometrie (Mulde, Lippe, wenige Schollen), Risse und Feinrelief in Textur bzw. Shader, nicht als echtes Höhenfeld.

## Prozedurale Ableitung (nächster Schritt, wenn Georg es freigibt)
- Verteilungsmuster wie im Nachbau, nicht-repetitiv per Saat:
  1. Stamm: Kraterradius und Tiefe nach Wucht; Lippe als niedriger Wall.
  2. Wurzeln: 12–18 Hauptrisse in fast gleichen Abständen (Spannungsregel), Länge nach Energie, nach außen schmaler und flacher, Y-Gabel oder Knick, wenn die Energie unter eine Schwelle fällt.
  3. Schollen: je Lücke zwischen zwei Rissen 1–3 Platten am Rand, nach innen gekippt (Nachbarregel: nie zwei gleich gekippt nebeneinander).
  4. Auswurf (später): entlang der Wurzeln, groß nah, klein weit.
- Laufzeit-Budget: ein Low-Poly-Kratergitter (wenige hundert Dreiecke) plus Shader (Risse, Ruß, Farbe) im Boden. Keine großen Meshes über das CDN, die Form entsteht aus Saat und Regeln im Spiel.
- Gleiches Modul danach für Zerstörung, Kampf, Fluff-Ernte mit Bomben und für das Einbetten von Objekten ins Gelände.

## Einbettung ins Gelände – Lessons learned (Georg 27.10., geparkt bis zur Umsetzung)
- **Vereinfachte Fassung für alles Stehende:** Baum, Stein, Fragment, Kit-Prop bekommen keine Risse, nur eine kleine Erdlippe bzw. Sandverwehung am Fuß. Die Erde hat das Wachsen des Baums nach außen begleitet, der Wüstensand hat sich am Stein angehäuft. Die Lippe verdeckt Teile des 3D-Objekts. So wirkt es eingesetzt statt draufgesetzt, und Fragmente bekommen ein unruhiges Terrain.
- Größere Dioramen: dieselbe Logik als deutlichere Erhebung oder Düne.
- **Stufen:** Lippe (Stehendes) → Lippe + Wurzelrisse (Einschlag, Kuppel) → Krater mit Schollen, Rissen und Auswurf (Explosion).
- **Destruction-Slice:** Treffer, Einschlag und Implosion an Gebäuden folgen derselben Grundlogik (Zentrum, Energie nach außen abnehmend, Kruste bricht in Schollen, Risse verzweigen sich). Nicht alles modellieren, aber Effekte und Spuren nach diesem Muster ableiten.
- Umsetzung später als eine Funktion im Boden-Shader und in der Höhe (Lippe als sanfte Ringerhöhung je Objekt, Rauschkante), nicht als eigene Meshes.
