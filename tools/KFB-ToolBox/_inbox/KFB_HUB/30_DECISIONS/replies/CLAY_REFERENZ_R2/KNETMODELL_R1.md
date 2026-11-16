# Knetmodell R1 · Wie Knete-Oberfläche entsteht · 16.11.2026 (zur Prüfung durch Georg, vor neuen Werten)

Anlass: Georg findet meine Versuche heuristisch („wie von Bienen gestochen“, „pickelartige Dellen entstehen beim Kneten nicht“). Erst kommt das Modell, dann Werte.

## A. Das Material
- **Plastisch:** Knete bleibt, wie man sie formt, und federt nicht zurück.
- **Volumen bleibt gleich:** Was an einer Stelle weggedrückt wird, wandert zur Seite. Es gibt kein Loch ohne Wulst daneben und keine Mulde aus dem Nichts.
- **Weich und leicht klebrig:** In der warmen Hand wird sie weicher. Glatt wird sie durch Reiben, Fingerabdrücke entstehen bei leichtem Druck.
- **Licht dringt ein wenig ein:** Dünne Stellen wie Ohren, Finger und Kanten wirken warm und weich. Der Glanz ist leicht, wie von Fingerfett.

## B. Was die Hände tun, und welche Spur das hinterlässt
1. **Rollen** (zwischen den Handflächen oder auf dem Tisch): glatte Walzen und Kugeln, die Dicke schwankt leicht über die Länge. Lange, sanfte Wellen, keine kleinen Merkmale.
2. **Mit dem Daumen glätten und drücken:**
   - breite, flache, ovale Stellen in Daumenballengröße;
   - die verdrängte Masse bildet am Rand einen weichen, niedrigen Übergang;
   - mehrere solche Stellen ergeben ein Flickwerk aus flachen Flächen mit weichen, nach außen gewölbten Kanten (die Knete-Kugeln).
   - Auf einer runden Form wird also etwas abgeflacht, aber nichts ausgehöhlt.
3. **Verstreichen** (Teile verbinden, Nähte zuschmieren): gerichtete Striche quer über die Naht, länglich und an den Enden ausgefranst. Darin feine parallele Fingerrillen entlang des Strichs und eine kleine Lippe, wo der Strich endet.
4. **Kneifen und Modellieren:** Grate und scharfe Knicke nur dort, wo eine Form gewollt ist (Ohrspitze, Braue, Lid).
5. **Biegen und Stauchen** (Arm, Knie, Hals): dünne Stauchfalten auf der Innenseite der Biegung, quer zur Biegeachse.
6. **Anfassen beim Animieren** (jedes Bild): frische, leichte Abdrücke und Wischer dort, wo die Finger greifen (Kopf oben, Arme, Hände). Diese Spuren wechseln alle paar Bilder; das ist das „Boiling“.

## C. Regeln, die daraus folgen
- **R1 Volumen:** keine einzelnen Mulden. Jede Vertiefung ist flach, mit sanfter Erhöhung daneben. Auf runden Formen heißt Druck „abflachen“.
- **R2 Ursache statt Rauschen:** Lage, Richtung und Größe jeder Spur folgen einer Handlung an der Form:
  - runde Flächen bekommen Daumenflächen;
  - Nähte bekommen Striche;
  - Gelenke bekommen Stauchfalten;
  - Griffzonen bekommen Abdrücke.
  - Kein gleichmäßig verteiltes Muster.
- **R3 Richtung:** Striche und Rillen folgen der Form, also längs am Arm und rund um den Kopf, nie wirr gemischt.
- **R4 Maßstab der Knetpuppe:** Spuren haben Fingergröße, gemessen an einer Puppe und nicht an 1,74 m. Die Werte werden an den Referenzbildern gemessen:
  - Daumenflächen auf den Kugeln: Radius 0,15–0,23 des Kugelradius;
  - Fingerrillen: Abstand ≈ 0,005 der Form;
  - Knickfalten: ≈ 1 % breit, 10–50 % der Fläche lang.
- **R5 Silhouette:** Sie wird durch Abflachen leicht kantig-weich und bekommt lange, sanfte Wellen. Sie wird nie perlig, und es entstehen keine kleinen Buckel.
- **R6 Figuren sind ruhiger als Requisiten:** Gesichter werden am meisten geglättet (Claybound-Junge, Tutorial-Frosch). Mehr Spuren an Händen, Gelenken und Rücken als im Gesicht.
- **R7 Licht:** weiche Eindringtiefe in dünnen Teilen, leichter Fettglanz, ein Rig.
- **R8 Boiling:** Abdrücke und Wischer springen alle 2–4 Bilder. Das kommt in einer eigenen Runde mit Video.

## D. Warum meine bisherigen Versuche falsch waren
- **v1.1 und v1.2 (Dellen):** gleichmäßig verteilte runde Mulden. Verstößt gegen R1 und R2, deshalb die Löcher.
- **v1.3 (Daumenflächen, Falten, Rillen):** Die Bausteine waren richtig gedacht, aber zufällig verteilt und in alle Richtungen (R2, R3), dazu zu schwach und nur über die Schattierung, ohne Silhouette (R5).
- **Texturen:** eine einzige Struktur in einem Maßstab, im Figurenmaß statt im Puppenmaß (R4), ohne Ursache (R2), ohne Silhouette.
- **Verformungs-Prototyp:** Das Zellenfeld hatte zufällige Höhen je Zelle. Tiefe Zellen lesen sich als Einstiche, deshalb „Bienenstiche“ (R1); dazu richtungslos (R3) und ohne Bezug zur Form (R2).

## E. Was daraus für die Umsetzung folgt (nur Richtung, noch keine Werte)
- **Spuren aus der Form ableiten, nicht aus Rauschen:**
  - Ein Teil wird nach Art erkannt (Kopf, Arm, Ohr, Gelenk, Naht);
  - dann werden Handlungen gesetzt (Daumen glätten, verstreichen, stauchen, anfassen);
  - jede Handlung hat ein Profil, das dem Material folgt: abflachen mit weichem Rand, Strich mit Lippe und Rillen, Stauchfalte.
- **Große Spuren in die Geometrie backen** (Silhouette, einmal, WSB in Blender). **Feine Spuren** (Rillen, Abdrücke) in die Oberfläche.
- **Werte nur aus Messungen an Referenzbildern.** Erst eine Figur und ein Teil kalibrieren, dann ausrollen; Abnahme im Spiel.
- Offene Frage an Georg: Fehlt am Modell etwas, oder ist etwas falsch?

## Quellen
- Greyscalegorilla-Tutorial: Transkript und Standbilder gelesen und angesehen, 16.11.;
- Claybound-Stills und Knete-Kugeln aus CLAY_REFERENZ_R2;
- GOLDEN_SAMPLES_2D_R1 (helle Oberlippe, kühlere Unterseite);
- eigenes Wissen zur Knetarbeit im Stop-Motion: Daumenabdrücke bleiben sichtbar und wechseln von Bild zu Bild.
