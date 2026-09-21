# Handover · Sprechblasen für die Overworld

**Eigenständig.** Dieses Dokument reicht allein.
**Für:** Claude Design, v13 ChatterBox-Slice.
**Art:** Bauanleitung. Alle Regeln sind Setzungen, alle Zahlen sind Startwerte, die am festen Standpunkt bestätigt werden.
**Konvention (hart):** keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über also und aber.

---

## 1. Der Auftrag

Ein **Comic-Blasensystem** für die Overworld, kein generischer Textkasten.

**Die Leitregel:** die Blase ist visuelle Sprachregie. Sie sagt, **wer** spricht, **wie** gesprochen
wird, ob es hörbar oder gedacht ist und **was zuerst gelesen** werden soll, bevor der Spieler ein Wort
liest.

**Daraus folgt das wichtigste Abnahmekriterium:** kein Blasentyp darf allein an der Textfarbe
erkennbar sein. **Die Form muss die Bedeutung ankündigen, bevor gelesen wird.**

**Und die zweite Leitregel:** die Blase soll den Text lesbar machen, nicht die Szene ersetzen. Sie
verdeckt nie das Gesicht der sprechenden Figur.

---

## 2. Die eine Grundregel der Konstruktion

> **Die Blase wird aus dem Textblock abgeleitet, nie umgekehrt.**

```
Text
  → messen
  → umbrechen
  → Textblock messen
  → Innenabstand addieren
  → Form um den Block bauen
  → Tail routen
```

Wer stattdessen eine Blasengrösse setzt und Text hineinlegt, baut zwei Fehler ein, die er danach
jagen muss: die riesige leere Blase und den überlaufenden Text. **Mit dieser Reihenfolge sind beide
konstruktiv unmöglich.**

---

## 3. Fünf Arten, fünf Formen

Nicht eine Form mit fünf Beschriftungen.

| Art | Kontur | Verbindung | Schrift |
|---|---|---|---|
| **Rede** | weich gerundet, leicht asymmetrisch, etwas breiter als hoch | fester Tail zum Gesichts-Anker | normal |
| **Gedanke** | unregelmässige geschlossene Wolke | 2 bis 3 kleine Kreise zum **Kopf** | kursiv, etwas leichter |
| **Ruf** | zackig, unregelmässig | kräftiger Keil | fett, grösser |
| **Flüstern** | dünn, gepunktet oder gestrichelt, geringerer Kontrast | kurze feine Spitze | kleiner, aber lesbar |
| **Kayfabulate** | **Erzählkasten**, rechteckig oder leicht geneigt, kräftige Tuschekante | **kein Mund-Tail**, optional kleiner Bühnenzeiger | gesetzt, fester |

**Kayfabulate ist bewusst kein Ballon.** Es trennt „jemand spricht" von „jemand führt eine Version der
Wirklichkeit auf".

---

## 4. Layout

### 4.1 Masseinheit

- **Der Anker liegt in der Welt, die Schrift misst in Bildschirmpixeln.** Die Blase folgt dem Sprite, ihre Schriftgrösse hängt nicht am Zoom.
- **Lesbarkeitsboden: 11 px** effektive Schrifthöhe. Beim Herauszoomen skaliert die Blase mit, aber **nur bis zu diesem Boden**.
- Darunter zwei zulässige Auswege: Blase ausblenden und nur das Zeichen zeigen, oder in Bildschirmgrösse einfrieren. **Nicht zulässig: kleiner werden.**
- **Padding in em, nicht in Pixeln.** Feste Pixelwerte brechen bei anderem Zoom und anderer Renderskala.

### 4.2 Masse

| Grösse | Wert |
|---|---|
| Maximale Zeilenlänge | **28 Zeichen** |
| Maximale Blasenbreite | **38 % der Bildbreite** |
| Minimale Blasenbreite | **7 Zeichen** |
| Innenabstand | **0,60 em seitlich · 0,45 em oben und unten** |
| Zeilenabstand | **1,25** |
| Maximale Zeilenzahl | **3**, Kayfabulate 4 |

**Faustregel für den Innenraum:** etwa eine Buchstabenbreite Luft. Text berührt nie die Kontur. Auf
der Tail-Seite etwas mehr Raum.

**Abweichungen je Art:**

| Art | Abweichung |
|---|---|
| Gedanke | Innenabstand 0,7 em wegen der Wolkenkontur |
| Ruf | Schrift 1,35-fach, also **21 Zeichen** je Zeile, Innenabstand 0,8 em, damit Zacken den Text nicht berühren |
| Flüstern | Schrift 0,85-fach, aber nie unter dem Lesbarkeitsboden. Greift er, bleibt die Schrift normal und nur die Kontur wird dünner |
| Kayfabulate | 4 Zeilen, bis 34 Zeichen, kein Tail, sitzt höher |

### 4.3 Umbruch, und hier liegt der teuerste Fehler

**Das übliche füllende Verfahren erzeugt Ein-Wort-Restzeilen.** Es füllt jede Zeile maximal und lässt
den Rest fallen. Die Lösung ist keine Nachbesserung, sondern **ein anderes Verfahren**.

- **Ausgeglichen umbrechen:** unter allen Umbrüchen mit der kleinstmöglichen Zeilenzahl den wählen, dessen Zeilenlängen am wenigsten voneinander abweichen.
- **Nie trennen.** Keine Silbentrennung.
- **Letzte Zeile mindestens 40 %** der längsten Zeile.
- **Ein Wort allein steht nie**, ausser der ganze Satz besteht aus einem Wort.
- **Satzzeichen bleiben am Wort.** „BLÖDSINN!" bricht nie zwischen Wort und Ausrufezeichen.
- Bis 28 Zeichen wird gar nicht umbrochen.

**Gemessen an den Fixtures unten: fünf von sechs mehrzeiligen Fällen brechen füllend schlecht**, vier
davon mit Ein-Wort-Restzeile. Das ist der Unterschied zwischen brauchbar und peinlich.

### 4.4 Zu langer Text ist ein Inhaltsproblem

- Über drei Zeilen wird **nicht** verkleinert und **nicht** gescrollt.
- Der Satz wird an einer Satzgrenze **in zwei aufeinanderfolgende Blasen** geteilt. Zwei Blasen nacheinander sind Comic-Grammatik, eine überfüllte Blase ist ein Fehler.
- Gibt es keine Satzgrenze, ist der Satz zu lang und gehört gekürzt. Das ist eine Anforderung an die Erzählschicht, nicht an das Layout.

---

## 5. Geometrie

### 5.1 Der Körper der Rede

- Leicht breiter als hoch, an den Ecken weich, **minimal asymmetrisch**.
- **Keine perfekte mathematische Ellipse** für jeden Satz.
- Zwei bis vier leichte Konturabweichungen, aus einem **geseedeten** Zufall, damit dieselbe Blase immer gleich aussieht.
- Bei kurzen Sätzen kompakter. Bei langen zuerst breiter werden, bevor viele schmale Zeilen entstehen.

### 5.2 Die Gedankenwolke, ohne Kreis-Haufen

Der häufigste Fehler ist, die Wolke aus mehreren gleich grossen Kreisen zusammenzusetzen. Sie liest
sich dann als Muster.

- **Eine geschlossene unregelmässige Kontur** mit **sechs bis acht Lappen**, nicht mehrere Einzelkreise.
- Ovaler Grundrahmen um den Textblock, darauf 6 bis 8 Anker, jeder zweite leicht nach aussen oder innen versetzt, dazwischen weiche Kurven.
- **Höchstens zwei** Lappen deutlich grösser als die übrigen, sonst wird es wieder gleichmässig.
- **Eine bis zwei bewusst gebrochene Stellen** in der Kontur.

### 5.3 Der Gedankenpfad

- **Zwei bis drei** Kreise, nicht mehr. Comic-Anleitungen nennen drei bis fünf, aber bei Pixelgrösse wird das zur Perlenkette.
- Durchmesser abgestuft, etwa **0,35 · 0,55 · 0,8** bezogen auf die Wolke.
- **Der grösste liegt an der Wolke, der kleinste am Kopf.**
- Leicht versetzt, **nicht auf einer Geraden**, Abstände ungleich.
- **Der Pfad zeigt zum Kopf, nicht zum Mund.** Das ist der Unterschied zwischen Denken und Sprechen.

### 5.4 Der Tail

- **Ziel ist ein ausdrücklicher Gesichts-Anker**, niemals die Mitte der Bounding-Box. Bei Sprites ohne sichtbaren Mund wird der Anker **gesetzt**, nicht geraten.
- **Ansatz im unteren Drittel** der Blase, nicht mechanisch in der Mitte.
- **Länge:** etwa die Hälfte der Strecke zum Sprecher, **gedeckelt bei 22 px**. Wandert die Blase weiter, ändert der Tail seinen **Winkel**, nicht seine Länge. Ein langgezogener Tail sieht sofort nach Fehler aus.
- **Tail und Körper sind eine einzige gefüllte Form**, also links an der Basis, zur Spitze, rechts zurück in den Körper. Sonst entsteht eine sichtbare Naht.
- **Tails kreuzen sich nie** und laufen nicht durch ein Gesicht.
- Liegt das Ziel ausserhalb des Bildes, zeigt der Tail zur Bildkante.

### 5.5 Die Zackenblase

- **Die Kontur schreit, nicht die Schrift.** Eine Zackenblase ist keine normale Blase mit fettem Text.
- **Acht bis sechzehn unregelmässige Zacken**, verschiedene Längen und Winkel.
- **Kein gleichmässiger Sternburst.** Gleiche Winkelabstände sind das Erkennungszeichen der billigen Variante. Einzelne Zacken dürfen nach innen kippen.
- Fette Schrift, aber **nicht gleichzeitig fünf weitere Effekte**. Kein Glühen, kein Weichzeichner.

### 5.6 Flüstern

**Es soll leiser aussehen, nicht nur kleiner sein.** Dünnere, gepunktete oder gestrichelte Kontur,
geringerer Kontrast, kurze feine Spitze, kleine Form. **Nie unter den Lesbarkeitsboden.**

---

## 6. Anker und Ablage

Über einem Kopf konkurrieren vier Dinge. **Vier getrennte Anker statt einer Prioritätsschlange**,
damit nichts warten, schrumpfen oder verschwinden muss.

| Element | Anker | Verhalten |
|---|---|---|
| **Sprechblase** | mittig über dem Kopf, Anker plus 6 px | hat Vorrang, definiert den belegten Bereich |
| **Zeichen (Emanatum)** | obere rechte Ecke des Sprites, 4 px versetzt | weicht der Blase nach aussen, bleibt sichtbar |
| **Zustandsleiste** | direkt unter dem Kopf | kein Konflikt |
| **Schadenszahl** | seitlich versetzt, driftet weg | eigene Spur, kurz und flüchtig |

**Ausweichen am Bildrand** in dieser Reihenfolge: seitlich verschieben, dann unter das Sprite kippen,
dann Breite reduzieren. Erst wenn alles drei nicht reicht, wird gekürzt.

**Mehrere Blasen:** höchstens zwei im Bild. Eine dritte schliesst die älteste. **Die neuere weicht
aus**, nicht die ältere, denn wer schon spricht, behält seinen Platz. Der Held hat Vorrang vor Mobs.

**Lesereihenfolge** bleibt eindeutig, üblich von oben links nach unten rechts.

---

## 7. Zeit

| Grösse | Wert |
|---|---|
| Schreibgeschwindigkeit | **34 Zeichen je Sekunde**, Satzzeichen mit kurzer Extrapause |
| Standzeit nach dem letzten Zeichen | **800 ms + 42 ms je Zeichen**, gedeckelt bei 5000 ms |
| Untergrenze gesamt | **1200 ms** |
| Abgang | **220 ms**, Blase schrumpft leicht zum Anker hin |
| Überspringen | erste Eingabe füllt den Text sofort, zweite schliesst |

**Bewegungsmuster je Art:**

- **Rede:** kurzer Pop mit Überschwung, ruhiges Halten, abgestimmtes Ausblenden.
- **Gedanke:** zuerst die Wolke, dann die 2 bis 3 Pfadkreise Richtung Kopf.
- **Ruf:** scharfer Pop, kurzer Aufprall, halten, Abgang.
- **Flüstern:** sanft ein, kaum Bewegung, langsam aus.
- **Alle:** lösen sich vollständig auf. **Was stehenbleibt, sieht nach Fehler aus.**

**Beim Blättern oder Zustandswechsel** wird der Zoom zurückgesetzt, sonst landet man im nächsten
Zustand in einem willkürlichen Ausschnitt.

---

## 8. Fixtures mit ausgerechneter Zeilenzahl

Echtes KFB-Vokabular, kein Blindtext. **Die Zeilenzahl ist aus den Regeln oben ausgerechnet**, damit
die Abnahme eine Prüfung ist und keine Diskussion.

| id | Art | Text | Zchn | Zeilen | Umbruch |
|---|---|---|---|---|---|
| `greet` | Rede | What's up, my fluffy hero? | 26 | **1** | einzeilig |
| `stayfluffy` | Rede | Stay fluffy. | 12 | **1** | prüft die Mindestbreite |
| `twowords` | Rede | Freedom. Apparently. | 20 | **1** | einzeilig |
| `thought` | Gedanke | I should have stayed in bed. | 28 | **1** | genau an der Grenze |
| `pottymouth` | Ruf | BLÖDSINN! | 9 | **1** | einzeilig |
| `bingo` | Ruf | KAYFABINGO! | 11 | **1** | einzeilig |
| `triplet` | Kayfabulate | Freedom is ultimately the greatest virtue. | 42 | **2** | Freedom is ultimately / the greatest virtue. |
| `absurd` | Rede | Freedom accidentally invents surveillance. | 42 | **2** | Freedom accidentally / invents surveillance. |
| `historian` | Rede | Methinks, our little hero has been here before. | 47 | **2** | Methinks, our little hero / has been here before. |
| `whisper` | Flüstern | not so loud, the ditch listens | 30 | **2** | not so loud, the / ditch listens |
| `sandwich` | Gedanke | This is either a trap or an extremely confident sandwich. | 57 | **3** | This is either a / trap or an extremely / confident sandwich. |
| `overflow` | Rede | I have entered the graveyard to negotiate with a skeleton who has no interest in negotiation. | 93 | **4** | **muss sichtbar scheitern** |

### Der Gegenbeweis

Dieselben Sätze mit dem üblichen füllenden Verfahren:

| id | füllend | ausgeglichen |
|---|---|---|
| `triplet` | Freedom is ultimately the greatest / **virtue.** | Freedom is ultimately / the greatest virtue. |
| `absurd` | Freedom accidentally invents / **surveillance.** | Freedom accidentally / invents surveillance. |
| `sandwich` | This is either a trap or an / extremely confident / **sandwich.** | This is either a / trap or an extremely / confident sandwich. |
| `whisper` | not so loud, the ditch / **listens** | not so loud, the / ditch listens |
| `historian` | gleich | gleich |

**Erscheint beim Bauen eine der linken Varianten, läuft noch das füllende Verfahren.**

### Zeiten je Fixture

| id | schreiben | halten | gesamt |
|---|---|---|---|
| `pottymouth` | 265 ms | 1178 ms | 1663 ms |
| `stayfluffy` | 353 ms | 1304 ms | 1877 ms |
| `greet` | 765 ms | 1892 ms | 2877 ms |
| `thought` | 824 ms | 1976 ms | 3020 ms |
| `triplet`, `absurd` | 1235 ms | 2564 ms | 4019 ms |
| `historian` | 1382 ms | 2774 ms | 4376 ms |
| `sandwich` | 1676 ms | 3194 ms | 5090 ms |
| `overflow` | 2735 ms | 4706 ms | **7661 ms** |

**Drei Grenzfälle sitzen günstig:** `thought` hat exakt 28 Zeichen, also ein Zeichen mehr und es wären
zwei Zeilen. `sandwich` liegt mit drei Zeilen auf der Obergrenze und mit 5090 ms an der
Haltedeckelung. `overflow` hat **keine Satzgrenze**, kann also nicht in zwei Blasen geteilt werden
und ist damit schlicht zu lang. Er prüft nicht das Layout, sondern ob die Erzählschicht ihre Grenze
einhält.

---

## 9. Abnahme

**Alle zwölf Fixtures am selben Standpunkt, in derselben Reihenfolge, ein Bildschirmfoto je Fixture.**
Dazu auf Desktop und in kleiner Auflösung.

### Text
- [ ] Keine abgeschnittenen Wörter.
- [ ] Keine ungewollten Ein-Wort-Zeilen.
- [ ] Zeilenzahl stimmt mit der Tabelle in Abschnitt 8.
- [ ] Umbruchstellen stimmen mit der Spalte „ausgeglichen".
- [ ] Kurzer Text erzeugt keine riesige leere Blase.
- [ ] Langer Text erzeugt keine winzige Schrift.
- [ ] Innenabstand rundum gleichmässig, auf der Tail-Seite etwas mehr.

### Form
- [ ] Rede ist weich, aber keine perfekte Standardellipse.
- [ ] Gedanke ist eine organische geschlossene Wolke, **kein Kreis-Haufen**.
- [ ] Der Pfad hat 2 bis 3 Kreise, unterschiedlich gross, versetzt, nicht auf einer Geraden.
- [ ] Zacken sind unregelmässig, kein gleichmässiger Sternburst.
- [ ] Flüstern bleibt sichtbar und nicht dekorativ dünn.
- [ ] Kayfabulate wirkt wie Erzählkasten, nicht wie Rede.
- [ ] **Die drei Grundformen nebeneinander, ohne Text: jede ist erkennbar.**

### Tail
- [ ] Rede-Tail zeigt zum Gesichts-Anker, nicht zur Körpermitte.
- [ ] Gedankenpfad zeigt zum Kopf.
- [ ] Kein Tail kreuzt einen anderen.
- [ ] Kein Tail läuft durch ein Gesicht.
- [ ] Kein Tail ist unnötig lang.
- [ ] Ziel ausserhalb des Bildes: Tail zeigt zur Kante.
- [ ] Keine sichtbare Naht zwischen Tail und Körper.

### Integration
- [ ] Blase folgt dem Weltanker, bleibt bei Bewegung stabil.
- [ ] Zoom verändert die Blase nicht ungewollt, der Lesbarkeitsboden greift.
- [ ] Zeichen, Zustandsleiste und Blase kollidieren nicht.
- [ ] Blase löst sich vollständig auf, nichts bleibt stehen.
- [ ] `overflow` **scheitert sichtbar**, wird also gemeldet oder abgewiesen. Wird es vierzeilig gezeigt, greift die Regel nicht.
- [ ] Debug-Schalter zeigt Textrechteck, Blasenumriss, Anker, Tail-Ziel, Sprecher-Kennung, Kollisionsrechtecke.

---

## 10. Was der Slice nicht ist

- **Keine neue Card Gallery.** Der vorhandene Card-Mechanismus bleibt die Präsentation. Es soll nicht bei jedem Feature nebenbei eine neue visuelle Interpretation der Karten entstehen.
- **Kein Tail-Routing um Figuren herum.** Das ist Wegfindung und wäre ein eigener Slice. Für v13 genügt der gerade Zeiger plus die Kreuzungsregel.
- **Kein Postprocessing.** Kein Glühen, kein Weichzeichner, **keine Composite-Operation über bildschirmgrosse Flächen je Bild**. Das hat schon einmal 90 ms gekostet, und Blasen sind klein.
- **Keine zweite Tusche-Schleife.** Der Kanon-Tuschesatz wird importiert, nicht nachgebaut. Farbe `#1f1a14`.
- **Keine Verläufe als Ersatz für Geometrie.**
- **Keine Zahlenwerte im Bild.** Kanon: Karten sind Beweisstücke, keine Powers. Zustandsleisten sind erlaubt, Ziffern nicht.

---

## 11. Kanon, der gilt

- Spiel-Sprache Englisch, Eigennamen deutsch: Puste, Witz, Schneid, BLÖDSINN!, Uncle FrizzleBob, King Kayfabian, Kayfabulation, Grussformel Stay fluffy.
- **BLÖDSINN! ist der Tod-und-Revive-Zustand**, nicht irgendein Ausruf.
- JSON-Felder der Karten sind **Quellmaterial, kein Dialog zum Vorlesen**. Die Erzählschicht komprimiert: kurz, kontextreich, wenig Exposition, Closure beim Spieler.
- **Objekt-Animismus ist ein Register**, generischer Objektwitz ist Füllung. Der Prüfstein ist der Hofnarr: spezifisch, mit Aufbau und Schwenk, von einer Figur über eine Lage gesagt.
- **Regeln sind Buffets, keine Gesetze.**
- Qualitätsboden ohne Ansage: bis Mobil benutzbar, sichtbarer Tastaturfokus, `prefers-reduced-motion` respektiert.

---

## 12. Offene Punkte

1. **Zeilenlänge für Flüstern:** 28 konservativ oder 33 rechnerisch. Kleinere Schrift legt mehr Zeichen in dieselbe Breite. Beim Rechnen als Lücke gefunden.
2. **Unter dem Lesbarkeitsboden:** ausblenden oder in Bildschirmgrösse einfrieren.
3. **Zwei Blasen gleichzeitig** als Obergrenze bestätigen, oder reicht eine.
4. **Sitzt der Kayfabulate-Kasten am Sprite oder fest am Bildrand**, weil er Erzählung ist.
5. **Bekommt der Held eigene Zeichen**, oder reagiert nur die Welt.

---

*Ende. Die Messlatte ist nicht, ob die Geometrie elegant ist, sondern ob die Form die Bedeutung ankündigt, bevor jemand liest.*
