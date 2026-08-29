# POST-MORTEM · Rolli in Pet Studio v10 (29.08.2026)

**Anlass.** Georg, nach sechs Korrekturrunden an einem hängenden Klopapier-Pet: *»das wird mir echt
zu albern hier«*. Er hat recht, und der Screenshot vom 21:20 beweist es: ein Achtkant-Rohr, zwei
Kugelaugen davor, rote Lippen auf einer Seitenfacette, kein Papier im Bild. Sechs Runden, in denen
**jede einzelne Messung stimmte und das Bild trotzdem falsch war.**

Diese Datei ist nicht die Entschuldigung, sondern die Ausbeute. Wer Rolli in WS1 neu baut, liest
sie **zuerst** — sie sagt, was man nicht wieder tun muss.

---

## 1 · Der Fehler in einem Satz

**Ich habe Zahlen an einer Konstruktion korrigiert, statt die Konstruktion in Frage zu stellen.**

Das Projekt hat eine Regel dagegen — *messen → verstehen → Grenzfälle prüfen → bauen*, und die
ersten drei ändern nichts. Ich habe gemessen und gebaut und den Schritt »verstehen« bei jeder Runde
übersprungen, weil eine Messung so aussieht wie Verstehen. Sie ist es nicht: eine Messung
beantwortet die Frage, die man stellt. Ich habe sechsmal gefragt *»ist diese Zahl richtig?«* und
nie *»ist das die richtige Vorrichtung?«*.

**Der Prüfstein, den ich mir für das nächste Mal aufschreibe:** wenn dieselbe Stelle **dreimal**
einen Befund bekommt, ist die dritte Antwort keine Zahl mehr. Dann wird die Konstruktion gewechselt
oder die Baustelle geschlossen. Drei war hier bei Runde drei erreicht; ich habe bis sechs
weitergemacht.

---

## 2 · Die zwei falschen Voraussetzungen

### (a) Fremde Teile auf ein Fremdmodell kleben

Rolli entstand als »Cube-Pet-Gesicht auf einer GLB aus dem Repo«. Das klang billig — Augen und Mund
sind vorhanden, die Rolle auch. Es ist aber keine Figur, sondern eine **Montage**: Kugelaugen sitzen
vor einem Zylinder statt in einem Kopf, und ein Mund, der auf 52 Punkten die Fläche abtastet, findet
auf einem Achtkant die **Facette** statt einer Wölbung. Beides ist genau so gebaut worden, wie es
gedacht war, und liest trotzdem als Unfall.

**Lehre:** Gesichtsteile sind für eine **Kopfform** gemacht, nicht für eine beliebige Oberfläche.
Wer sie auf einen Zylinder legt, baut nicht ein Pet, sondern ein Rohr mit Augen. Ein Ersatzkörper
war in diesem Projekt schon einmal die Ursache eines Fehlversuchs (Card Viewer v1, Post-Mortem
dort) — es ist derselbe Fehler in neuer Verkleidung.

### (b) Eine Verlet-Tuchsimulation für einen Comic-Papierstreifen

Das Blatt war ein 9 × 15-Massepunkt-Tuch mit Zwängen, Boden, Wind und Dämpfung. Was das gekostet
hat, in der Reihenfolge, in der es aufgetreten ist:

| Runde | Befund am Bild | Ursache, gemessen | »Fix« |
|---|---|---|---|
| 1 | Blatt sticht durch die Platte | Blatt 15 % zu lang, weil das Tuch sich **dehnt** | Zwang-Durchläufe 3 → 25 |
| 2 | Knick nach innen | obere Reihe saß auf dem **Bogen** der Rolle | Tangente statt Bogen |
| 3 | Flackern am unteren Rand | Restreihen **stapeln** sich, Reihenabstand 0,0295 → 0,0050, entartete Dreiecke | Ausweichen nach vorn |
| 4 | »lazy vorgeklebt« | Blatt hing **0,4262 zu tief** (zwei Höhen-Konventionen im selben Bezugssystem) | Rechenfehler behoben |
| 5 | graue Platte + Linien über dem Papier | GLB-Material trägt **Metall 0,400** → flache Bahn spiegelt dunkel, Normalen je Reihe werden zu Linien | eigenes weißes Material |
| 6 | Biegung wirkt wie Blech | Tuch hat **keine Biegesteifigkeit** | *nicht gelöst* |

Sechs Befunde, sechs verschiedene Ursachen, **keine davon dieselbe** — das ist die Signatur einer zu
komplexen Vorrichtung. Ein System, das an sechs unabhängigen Stellen falsch aussehen kann, wird
nicht durch sechs Korrekturen richtig; es hat zu viele Freiheitsgrade für die Aufgabe.

**Die Aufgabe war:** ein weißes Blatt hängt gerade nach unten. Freiheitsgrade dafür: **einer**
(die Länge). Das Tuch hatte 135 Massepunkte × 3 Achsen.

**Lehre, wörtlich für WS1:** *Simulation nur, wo die Bewegung die Aussage ist.* Ein Blatt, das
gerade herunterhängt, ist Geometrie. Papier, das jemand aus der Hand fallen lässt, wäre Simulation —
und selbst dann eine, die man nach dem Bild aussucht, nicht nach der Physik.

---

## 3 · Was die KISS-Fassung kostet (zum Vergleich)

`SPEC.paper.mode = 'flat'`: ein Rechteck, Oberkante **0,0094 innen** an der vorderen unteren
Rollenfläche, dann senkrecht nach unten.

| Kriterium | Tuch (6 Runden) | flach (eine Stunde) |
|---|---|---|
| Abweichung aus der Senkrechten | 0,0005 | **0,000000** |
| Zittern (300 Bilder) | 0,00006 | **0,00000000** |
| Länge gegen Soll | 7,9 % Dehnung | **exakt** (0,0384 / 0,1074 / 0,1918 / 0,3837) |
| Rechenzeit je Bild | 0,158 ms | ~0 |
| Möglichkeiten, falsch auszusehen | sechs gefundene | Länge und Einstichtiefe |

Der Tuch-Code bleibt in der Datei stehen, unbenutzt und mit den Messwerten im Kommentar. Nicht aus
Sentimentalität: die Zahlen (Wickelgeometrie, Rissrate, Bodenverhalten) sind **richtig gemessen** und
für ein späteres, absichtliches Fall-Blatt brauchbar. Als Vorrichtung für das Ruhebild ist er tot.

---

## 4 · Fünf Fallen, die in jeden künftigen Chat gehören

1. **`document.hidden` ist im Vorschaufenster true** → `requestAnimationFrame` steht → jede Ablesung
   zeigt das letzte gerenderte Bild, nicht den berechneten Zustand. Von Hand ticken.
2. **Modul-Adressen brauchen `?vN`**, und die *ganze Kette* zählt hoch. Sonst misst man drei Runden
   lang dasselbe gecachte Modul und wundert sich über identische Zahlen.
3. **Zwei Höhen-Konventionen im selben Bezugssystem** — `hang` und Rolle sind beide Kinder von
   `swing`, aber die Zeile kam aus einer Fassung, in der `hang` am Nagel hing. Ein Abzug, der einmal
   richtig war, ist nach einem Umbau ein Fehler.
4. **Eine Rate darf nicht an der Ereignisdichte hängen.** Zugrate = Weg / Abstand zweier
   Zeigerbewegungen ergibt bei einer 1000-Hz-Maus das Vierfache derselben Handbewegung (gemessen:
   Rate 31 statt 3,4). Über ein Zeitfenster sammeln.
5. **Eine Bodenklemmung nach den Zwängen ist Kleber**, in der Zwang-Schleife ist sie ein Boden.
   Reihenfolge ist hier Bedeutung, nicht Geschmack.

Dazu zwei, die schon in `HOUSEKEEPING.md` stehen und sich wieder bestätigt haben: *ein Kriterium muss
die Einheit kennen, in der es im Bild ankommt* (ein Winkel ist kein Weg — die erste Blick-Fassung
erfüllte das rad-Kriterium und war unsichtbar), und *eine Fläche ist keine Form*.

---

## 5 · Was ich dem nächsten Chat schulde

- **Nicht** weiter an Rollis Montage bauen. Wenn Rolli in WS1 kommt, dann als **eigenes Modell** mit
  Augen und Mund als Teil der Form — oder als 2D-Figur. Nicht als Gesichtsteile auf einem Rohr.
- Das Ruhebild bleibt **flach**. Ein Fall-Blatt ist ein eigener, absichtlicher Schnitt mit eigenem
  Abnahmekriterium — nicht die Rückkehr des Tuchs durch die Hintertür.
- Die offene Look-Zahl, die niemand entschieden hat: das GLB-Papier der **Rolle** trägt Metall 0,400
  und liest halbglänzend. Das Blatt ist jetzt weiß und matt, die Rolle nicht. Das ist eine
  Entscheidung, keine Korrektur — darum habe ich sie nicht getroffen.
