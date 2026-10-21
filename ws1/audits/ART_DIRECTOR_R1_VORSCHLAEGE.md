# Art Director R1 · Top 10 Vorschläge: Design-Tricks und Gameplay

Stand 21.10.2026 · Ergänzung zu `ART_DIRECTOR_R1.md` (Befunde) · Fokus: Look und Spielgefühl

Gesucht waren Ideen, an die bisher noch niemand gedacht hat, und Konzepte, die heute nicht optimal gelöst sind. Grundlage sind die Bildserien aus dem Audit (Probe mit Standardwerten und mit Georgs Werten, Spiel `#m1,harvest,look=terrain3`) und eine Stichprobe im Code von Probe und Spiel. Was der Code schon kann, ist jeweils vermerkt.

Die Rangfolge richtet sich danach, wie stark eine Idee KFB unverwechselbar macht und wie viel Spielgefühl sie pro Aufwand bringt.

---

## Top 10

### 1 · Die Fahrspur malt die Welt (Signatur-Effekt)
- **Idee:** Die Fließfarben-Bänder weichen um den Racer aus wie Wasser um einen Stein. Hinter dem Wagen bleibt eine geschwungene Bugwelle in den Bändern stehen, die sich über 3–6 s langsam wieder schließt. So „malt“ man beim Fahren in die Landschaft.
- **Warum:** Kein anderes Spiel hat das. Es verbindet den Kern-Look (Fließfarben) direkt mit dem Kern-Verb (Fahren). Für Clips ist es sofort lesbar.
- **Umsetzung:**
  - In `flowBands` gibt es schon Domain Warping. Dazu kommt eine lokale Verschiebung aus einer Spur von 16–24 Punkten (Uniform-Array, Ringpuffer, Alter je Punkt). Die Verschiebung zeigt quer zur Fahrtrichtung und fällt mit Abstand und Alter ab.
  - Das Wasser hat mit `uCarW` schon einen Wagenbezug, die Mechanik ist also vertraut.
  - Bandkanten bleiben hart, nur ihre Lage biegt sich.
- **Aufwand und Risiko:** Aufwand M, Risiko niedrig. Es kostet eine Schleife im Fragment-Shader, bei Leistungsstufe „niedrig“ kürzer.

### 2 · Notan-Prüfansicht und Drei-Werte-Regel je Tiefe
- **Idee:** Eine neue Prüfansicht „Notan“ unter `dbg` zeigt das Bild als Zwei- bzw. Dreiton-Schwelle (Luminanz < 0,33 / < 0,66 / darüber). Daraus folgt eine feste Regel:
  - Vordergrund: dunkel und gesättigt
  - Mittelgrund: Mittelton
  - Ferne und Himmel: hell und entsättigt
  - Figur und Racer: immer im Kontrast zum Grund dahinter
- **Warum:** Hanna-Barbera- und Lozzi-Hintergründe funktionieren über klare Wertgruppen, nicht über Farbe. Heute konkurrieren nahe und ferne Bänder auf gleicher Helligkeit (Musterwand im Spiel, weiße Steine in der Probe). Die Prüfansicht macht das in einer Sekunde sichtbar und lässt sich als Prüfskript automatisieren (Anteil je Tonstufe je Bilddrittel).
- **Umsetzung:** Ein Nachbearbeitungs-Pass oder ein Zweig im Endshader, plus ein Prüfskript im Stil von `probe/tests/*.mjs`.
- **Aufwand und Risiko:** Aufwand S, Risiko keines.

### 3 · Kamera komponiert das Bild
- **Idee:** Die Fahrkamera hält den Horizont auf dem oberen Drittel und den Racer im unteren Drittel. Sie schaut dem Tempo voraus (Look-ahead 0,3–0,6 s in Fahrtrichtung, in Kurven zur Innenseite). Verdecker zwischen Kamera und Wagen werden per Dither durchscheinend.
- **Warum:**
  - In den Audit-Bildern liegt der Horizont oft in der Mitte oder ganz oben. Der Himmel, in den viel Arbeit geflossen ist, ist dann kaum zu sehen.
  - In der Probe klemmt die Kamera hinter den Säulen des Amphitheaters (`std-06`, `std-07`).
  - Das Spiel hat schon eine Kamerafeder für FOV und Abstand (`M1Player.jsx:304`), aber keine Bildkomposition.
- **Umsetzung:** Nickwinkel aus der Horizonthöhe im Bild regeln statt fester Polarwinkel. Look-ahead als Versatz des Kameraziels. Verdecker per Raycast erkennen, Dither-Alpha im Material.
- **Aufwand und Risiko:** Aufwand S–M, Risiko mittel (Kameragefühl). An Georgs Komfortwerten messen.

### 4 · Leitlinien und Landmarken
- **Idee:**
  - **Leitlinien:** Die Bänder laufen in Richtung des nächsten Ziels zusammen, so wie Lozzi Linien auf den Fluchtpunkt führt. Ein schwaches Vektorfeld, das die Bandphase zum Ziel dreht, genügt.
  - **Landmarken:** Alle ca. 300 m eine Silhouette, die man schon vom Horizont aus erkennt, etwa Bogen, Turm, Riesenpilz oder Knet-Statue. Jede hat eine eigene Form und eine Kulissenfarbe.
- **Warum:** Das Gelände ist heute überall gleich interessant und damit gleich beliebig. Ohne Ziel am Horizont gibt es keinen Grund, irgendwohin zu fahren. Die Kulissenringe (K1–K3) zeigen, dass ruhige Silhouetten gut wirken. Landmarken sind die spielbare Fortsetzung davon.
- **Umsetzung:** Landmarken als Props mit eigener Fernstufe (ohne Fließfarbe, eine Silhouette, Kulissenton). Leitlinien als Zusatzterm in `flowBands`.
- **Aufwand und Risiko:** Aufwand M, Risiko niedrig.

### 5 · Cartoon-Physik am Racer: Antizipation, Squash, Stretch, Smear
- **Idee:**
  - 80–120 ms vor dem Sprung duckt sich der Wagen (Federn ein, Nase runter).
  - Bei der Landung staucht er sich 1–2 Frames lang (Squash 0,85 / 1,1).
  - Beim Boost streckt er sich (Stretch 1,08 längs) und zieht 2–3 Smear-Streifen in Karosseriefarbe.
  - Am Höhepunkt eines Sprungs schwebt er kurz (Hang-Time).
- **Warum:** Diese Grundregeln der Looney-Tunes-Animation machen ein 3D-Fahrzeug erst zur Cartoon-Figur. Im Code taucht Squash bei Figuren auf, am Racer habe ich es in den Bildern nicht gesehen.
- **Umsetzung:** Nur visuell, als Skalierung und Versatz des Modell-Knotens über der Physik. Der Rapier-Körper bleibt unverändert. Werte als Kurven in der Racer-Konfiguration.
- **Aufwand und Risiko:** Aufwand S–M, Risiko niedrig, weil die Physik unberührt bleibt.

### 6 · Hit-Stop und Kamera-Punch
- **Idee:**
  - Bei harter Landung, Kollision mit einem Stein und jeder Ernte bzw. jedem Einsaugen friert das Bild 40–70 ms ein (Physik-Pause).
  - Dazu kommt ein FOV-Punch (+4°, 0,15 s zurück) und eine Kamera-Erschütterung entlang einer einzigen Achse.
- **Warum:** Damit fühlen sich Treffer wie Treffer an. Im Code gibt es keinen Hit-Stop, und Kamera-Erschütterung kommt nur vereinzelt vor. Das M1-Konzept mit eigenem Takt (`m1Clock`) macht einen Hit-Stop besonders billig: einfach einige Schritte aussetzen.
- **Aufwand und Risiko:** Aufwand S, Risiko niedrig. Für Komfort abschaltbar.

### 7 · Coyote-Time und Sprungpuffer
- **Idee:**
  - Sprung noch 100–150 ms nach Verlassen einer Kante erlauben (Coyote-Time).
  - Ein Tastendruck bis 150 ms vor der Landung wird gespeichert und bei Bodenkontakt ausgelöst (Sprungpuffer).
- **Warum:** Seit `eac5cb0` hängt der Sprung an der Bewegung (Hochsprung im Stand, Weitsprung mit Schub nur beim Drücken). Dadurch zählt das Timing mehr, und ohne Puffer fühlt sich ein knapp verpasster Sprung wie ein Fehler des Spiels an. Im Code habe ich beides nicht gefunden.
- **Umsetzung:** Zwei Zeitstempel in `k2t.js` bzw. `M1Player`.
- **Aufwand und Risiko:** Aufwand S, Risiko keines.

### 8 · Wasser als Spielfläche
- **Idee:**
  - **Steinhüpfen:** Ab ca. 70 % Tempo hüpft der Racer flach übers Wasser wie ein geworfener Stein. Jeder Kontakt erzeugt einen harten Spritzring und einen Hüpfer, der immer kürzer wird, bis der Wagen einsinkt.
  - **Ufer als Rampe:** Ufer werden zur Sprungkante, wenn man Tempo hat.
  - **Bubblegum-See als Trampolin**, Giftsumpf bremst.
- **Warum:** Das Wasser ist bisher Kulisse. Mit Georgs Wasserstand 0,06 ist aber ein großer Teil der Welt Wasser, und dieser Raum bleibt spielerisch leer. Island-Kit-F2 („morpht langsamer, sehr KFB“) passt gut zu einem Wasser, das auf den Wagen reagiert.
- **Umsetzung:** Kontaktregel in der Fahrphysik (Wasserlinie ist bekannt). Ring- und Spritz-VFX aus Brief D.
- **Aufwand und Risiko:** Aufwand M, Risiko mittel (Fahrphysik-Abstimmung).

### 9 · Tageszeit als Fortschritt
- **Idee:** Ernte und gefahrene Strecke treiben die Sonne von 50° auf 12°. Der Abschluss einer Runde ist die goldene Stunde (Rezept S2 aus dem Befundbericht). Die Nacht (Rezept S3) ist der Bonus-Abschnitt mit Polarlicht und Ringplanet.
- **Warum:** Die Stimmungen existieren schon (`MOODS tag/gold/nacht`), werden aber nur per Regler gewechselt. Als Fortschrittsuhr werden sie zur Belohnung, die man sieht, ohne dass es eine Zahl im HUD braucht.
- **Umsetzung:** Sonnenstand und `tod`-Mischung an einen Fortschrittswert koppeln. Voraussetzung ist Befund 12 aus dem Audit (Stimmung folgt dem Sonnenstand, Wasser übernimmt die Stimmung).
- **Aufwand und Risiko:** Aufwand M, Risiko niedrig.

### 10 · Silhouetten-Schutz auf bunten Böden
- **Idee:** Figuren und Racer bekommen eine dunkle Kontur im Palettenschatten des Bodens (Inverted Hull, 1,5–2 px bildschirmfest) und auf der Sonnenseite einen schmalen hellen Rand (Rim).
- **Warum:** Fließfarben sind ein unruhiger Grund. Der gelbe Hase verschwindet im Sandband, der Racer im Grau-Petrol-Band. Eine Kontur ist das klassische Mittel der Zeichentrickfolie: Die Figur liegt sichtbar über dem gemalten Hintergrund.
- **Umsetzung:** Zweiter Pass mit Rückseiten-Hülle, Farbe aus der Bodenpalette am Fußpunkt, nur für Figuren und Fahrzeuge (nie für Gelände oder Props).
- **Aufwand und Risiko:** Aufwand S, Risiko niedrig. Gegen Georgs „kein Fake-Look“ an zwei Bildern vorher und nachher abnehmen.

---

## Drei Konzepte, die ich anders lösen würde

### A · Wabern an Fahrtempo koppeln (`flowspeed`, `tempoCoupling`)
- **Heute:** Je schneller man fährt, desto schneller fließen die Bänder.
- **Problem:** Bei hohem Tempo schwimmt der Boden zusätzlich zur echten Bewegung. Das ergibt Bildunruhe genau dann, wenn man am meisten lesen muss.
- **Anders:** Den Zeichentrick-Weg gehen. Bei Tempo **beruhigen** sich die Bänder, frieren ein und ziehen sich in Fahrtrichtung lang (Bewegungsunschärfe als Form). Gefühlt wird Tempo über Speedlines und Kamera, nicht über den Boden. Im Stand darf es wabern.

### B · Speedlines hinter dem Wagen
- **Heute:** Zwei durchgehende Linien von den Heckkanten (`gelaende-probe.html:2957`).
- **Problem:** Aus der Verfolgerkamera laufen sie senkrecht ins Bild und wirken wie Schienen oder Seile.
- **Anders:** Speedlines gehören an den **Bildrand**: kurze, gebogene Striche, die vom Fluchtpunkt weg nach außen schießen. Am Wagen selbst nur Smear (siehe 5).

### C · Fließfarbe auf Props
- **Heute:** Steine und Bäume übernehmen die Bandfarbe (`addFlow`).
- **Problem:** Die Objekte verlieren Volumen und Wert. Die Felsbrocken werden creme-weiß (Befund 8).
- **Anders:** Props behalten ihren eigenen Wert (Steine dunkler als der Hang, Kronen in Licht und Schatten). Die Fließfarbe kommt nur als **ein Band** quer über das Objekt dazu, wie ein Lichtreflex vom Boden. „Was zum Boden gehört, fließt mit“ bleibt erhalten, ohne dass die Form verschwindet.

---

## Reihenfolge (Empfehlung)

1. **Sofort, jeweils Aufwand S:** 2 (Notan), 6 (Hit-Stop), 7 (Coyote-Time), 10 (Kontur). Das bringt viel Gefühl pro Stunde, und alles ist einzeln prüfbar.
2. **Danach:** 1 (Fahrspur malt die Welt) als Signatur, zusammen mit A (Wabern beruhigen), weil beides in `flowBands` liegt.
3. **Dann:** 3 (Kamera), 5 (Cartoon-Physik), B (Speedlines am Bildrand).
4. **Ausbau:** 4 (Leitlinien und Landmarken), 8 (Wasser als Spielfläche), 9 (Tageszeit als Fortschritt), C (Props).
