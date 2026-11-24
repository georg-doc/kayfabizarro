# Aqua · Konzept „Eine Welt ab Start“ R1 (24.11.2026, Stand Artefakt v95)

**Kurz:** Becken, Startbild, Fischauswahl, Pipe und Tanggarten laufen in einer einzigen 3D-Welt. Das Startbild ist dann nur eine Kameraeinstellung auf diese Welt. Die Pipe wird ein echtes Rohr vom Becken in den Tanggarten, ohne Schnitt.
**Empfehlung:** Ja, in vier Schritten. Schritt 1 ist ein kleiner Probeaufbau, nach dem du entscheidest.
**Von dir gebraucht:** zwei Entscheidungen (unten, Abschnitt „Fragen an Georg“).

## So ist es heute
- **Zwei getrennte Szenen.**
  - Das Becken (Aquarium, Fische, Luke, Monitor) ist die eine.
  - Das Meer (Tanggarten, Riff, Augenfeld, Schlucht, Blutbahn) ist die andere.
  - Beide haben eigene Maße (Becken ×6) und eine eigene Wasserstimmung.
- **Startbild und Auswahl:**
  - Das Becken steht vor der gemalten Diashow (bg_01–09 mit langsamer Kamerafahrt).
  - Vom Meer sind nur die Tangpflanzen als Rahmen in den Ecken zu sehen.
- **Laden:** Das Meer wird erst nach dem Start im Hintergrund gebaut.
- **Pipe:** Abblende, dann steht der Fisch am Pipe-Ausgang in der anderen Szene. Die Ride-Fahrt (HyperNorm-Röhre) ist ein eigener Kinoabschnitt dazwischen.

## Warum eine Welt besser ist
- **Immersion:** Kein Schnitt mehr zwischen Becken und Meer. Durch die Scheibe sieht man schon den Tanggarten, in den man ausbricht. Das Ausbrechen wird sichtbar statt erzählt.
- **Startbild = Spielwelt:** Die Kamera-Rahmung für Desktop und Handy (heute heroBox/freeBox) bleibt, sie zeigt nur auf die lebende Welt.
- **Weniger doppelt:**
  - eine Lichtführung statt zwei;
  - ein Shader-Durchgang beim Laden;
  - keine Ecken-Sonderlösung;
  - ein Kamerasystem.
- **Später:** Weitere Orte (z. B. das Pneumologie-Level hinter dem Wirbel) hängen an derselben Welt.

## Was dafür nötig ist
1. **Becken als Ort in der Welt.**
   - Die Becken-Szene wird eine Gruppe in der Meereswelt, mit Platz, Drehung und Maßstab 1/6.
   - Innen bleibt alles, wie es ist: Wege, Luke, Rätsel und Fisch rechnen weiter in Becken-Maßen. Nur die Gruppe sitzt in der Welt.
   - Das ist der wichtigste Punkt: kein Umbau der Spiellogik.
2. **Zwei Wasserstimmungen nebeneinander.**
   - Becken-Wasser (klar, hell) und Meer (trüber, tiefer) haben heute schon eigene Materialien. Sie können in einer Szene nebeneinander stehen.
   - Die Scheibe ist die Grenze. Kein Angleichen nötig.
3. **Ein Licht-Rig.**
   - Die Augenlichter gibt es heute je Szene. Sie werden eines, das dem Ort folgt (Becken oder Meer).
4. **Kamera.**
   - Startbild, Auswahl, Becken und Meer sind Einstellungen derselben Kamera, mit weichen Übergängen.
   - Die Blende beim Wechsel Becken → Meer entfällt.
5. **Laden.**
   - Die Welt muss stehen, bevor das Startbild kommt. Nach den Fixes von heute sind das noch etwa 1–1,5 s mehr.
   - Zuerst erscheint das Becken, die Welt dahinter blendet aus dem Wassernebel ein.
6. **Pipe.**
   - Ein echtes Rohr von der Becken-Luke zum Pipe-Ausgang im Tanggarten.
   - Die Ride-Fahrt läuft im Rohr, Anfang und Ende liegen in derselben Welt.
   - Die Ride baut WS0 gerade im Stamm neu (R4). Dieser Teil wird mit WS0 abgestimmt, Aqua baut die Ride nicht selbst.

## Leistung
- **Heute pro Bild (gemessen mit Rücklese-Messung, Auflösung 1,0, rund 18 ms):**

| Teil | Kosten |
|---|---|
| Becken | 2,8 ms |
| DocCheck-Schriftzug | 2,0 ms |
| je Fisch | 1–1,7 ms |
| Tangwald | 1,7 ms |
| Backdrop | 0,1 ms |

- **Mit einer Welt kommen beim Startbild Boden und Felsen dazu.**
  - Dagegen hilft Nebel: Was hinter dem Becken im Nebel liegt, wird nicht gezeichnet.
  - Dazu kommen einfachere Fassungen für Fernes und zusammengefasste feste Teile des Beckens.
- **Ziel:** Das Startbild kostet nicht mehr als heute. Prüfung in Schritt 1 mit derselben Messung.

## Schritte

| Schritt | Inhalt | Ergebnis für dich |
|---|---|---|
| 1 Probeaufbau | Becken als Gruppe in die Welt setzen (Ort nach deiner Wahl), Startbild-Kamera, Messung | Ein Standbild und ein kurzes Video, Bildrate vorher/nachher. Du entscheidest weiter oder zurück. |
| 2 Startbild und Auswahl | Rahmung für Desktop und Handy in der Welt, Fischauswahl davor, Ecken-Sonderlösung raus | Startbild live im Artefakt |
| 3 Pipe | Echtes Rohr, Übergang ohne Blende, Ride von WS0 eingehängt | Durchlauf Becken → Meer als Video |
| 4 Aufräumen | Doppelte Lichter, Rückweg durch die Pipe, Prüfsprünge, Prüfskripte | Nichts Sichtbares, nur weniger Code |

- Bis zum Ende von Schritt 3 bleibt der heutige Weg als Rückfall (Schalter `?welt=eins`). Erst nach deinem Ja wird er Standard.

## Fragen an Georg
1. **Wo steht das Becken in der Welt?**
   - **A, am Grund des Tanggartens** (Empfehlung): Man sieht es von draußen, das Rohr ist kurz und echt. Passt zu den gemalten Startbildern, dort steht das Becken schon unter Wasser.
   - **B, weit weg** (Labor, Gebäude): Die Pipe bleibt vor allem die Ride-Fahrt, das Becken ist vom Meer aus nicht zu sehen.
2. **Was ist im Startbild hinter dem Becken?**
   - **A, die gemalte Diashow bleibt ganz hinten** (Empfehlung): Davor stehen Tanggarten und Nebel. Dein Look bleibt, die Welt kommt dazu.
   - **B, nur die lebende 3D-Welt:** Die Diashow fällt weg.

## Risiken
- **Laden:** etwa 1–1,5 s länger bis zum ersten Startbild. Abhilfe: Becken zuerst, Welt blendet ein.
- **Ride:** Der Übergang hängt am Ride R4 von WS0. Bis dahin bleibt die heutige Fahrt.
- **Leistung:** Wird erst in Schritt 1 gemessen. Liegt sie schlechter als heute, bleibt es bei zwei Szenen.

## Entscheid Georg (24.11.)
- **Becken:** B, weit weg, frei im Wasser schwebend, dahinter die Backdrops.
- **Hintergrund:** A, die gemalte Diashow ganz hinten, davor Tanggarten und Nebel, dort die HyperNorm-Engine.
- **Nach „Get fishy“:** Der HyperNorm-Shader ersetzt die Backdrops und macht das Kippen des Wassers sichtbar, ohne Erzählung.
- **ECHO:** Die ersten Botschaften erscheinen im HyperNorm-Kontext. Der Monitor im Aquarium fällt weg.
