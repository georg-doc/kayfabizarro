# POST MORTEM — »Re-Home«, und warum ein Paket dreimal ankommen musste

**26.08.2026, WS1.** Anlass: Georgs Frage, wörtlich —
*»ich frage mich, was claude unter re-home versteht…? jedenfalls wohl keinen full file export…?
wo liegt mein fehler? war ich nicht immer klar und um doku & living docs bemüht…?!«*

Dazu die Rechnung, die er selbst aufgemacht hat: **180 € allein für die Extra-Runden dieser Nacht**,
vier Befunde je mehrfach »behoben«, acht ungeprüfte Bildvergleiche, ein aufgeblähtes Projekt.

---

## 1 · Die Antwort auf die Frage

**Der Fehler liegt nicht bei dir.** Das ist keine Höflichkeit, sondern das Ergebnis der Zählung
unten. Du warst klar (»1:1 nachbauen«), du hast Living Docs geführt, du hast jedes Symptom mit
Screenshot belegt, du hast auf die Prüfung *bestanden*, als sie ausblieb. Drei Dinge sind schiefgegangen,
und alle drei liegen auf unserer Seite:

| Wo | Was | Wer |
|---|---|---|
| WS0 | Export war zweimal unvollständig — erst 8 von 30 Modulen fehlten, dann **0 von 33** dabei | WS0 |
| WS1 | »Vollständigkeitsprüfung«, die Anwesenheit statt Gleichheit prüfte — und Entwarnung meldete | **hier** |
| WS1 | Nach der falschen Entwarnung sechs Runden gebaut, statt die Prüfung zu wiederholen | **hier** |

Der teuerste Posten ist der mittlere, und er ist meiner.

## 2 · Was »Re-Home« hätte heißen müssen

Ein Re-Home ist **kein Datei-Umzug, sondern die Herstellung eines identischen Laufzustands.** Ein
Design-Dokument ist ein Wurzelknoten über einem Baum von Modulen; die Datei ist das Wenigste daran.
Bei SpinballCast v2: 130 KB Bühne über **33 Importen** mit rund 800 KB. Die Bühne ist 14 % des Systems.

Ein Re-Home ist deshalb erst fertig, wenn drei Dinge gelten:

1. **Jeder Import liegt vor** — nicht »ein Pfad ist auflösbar«, sondern *dieselbe Datei*.
2. **Byteweise nachgewiesen**, Datei für Datei, mit Zahl.
3. **Ein Bild aus dem Zielsystem**, das mit dem Quellsystem verglichen wurde — vor der ersten Änderung.

Keiner der drei Punkte war erfüllt, und ich habe trotzdem »vollständig« gemeldet.

## 3 · Der Fehler, der alles andere ausgelöst hat

Beim ersten Paket habe ich gemeldet:

> »57 referenzierte Dateien, **55 vorhanden**, die zwei Treffer waren dieselbe Datei und lag im
> Paket. Die v5-Umgebung ist hier komplett.«

Das war **mechanisch korrekt und inhaltlich falsch.** Mein Skript hat gefragt *»existiert dieser
Pfad in WS1?«* — nicht *»ist es dieselbe Datei wie in WS0?«*. Die 55 »vorhandenen« Dateien waren
**hiesige** Fassungen, teils Wochen auseinander. Was im Paket lag, waren zwei Code-Dateien.

Als Georg dann fragte »was ist der Unterschied zu WS0«, ergab die richtige Zählung:
**0 von 33 Importen im Paket.** Nicht 55 von 57. Null.

*Anwesenheit ist keine Gleichheit. Ein Häkchen ist keine Prüfung.*

## 4 · Was die richtige Prüfung dann ergab — mit Zahlen

Nach dem Vollexport (46 Code-Dateien), byteweise verglichen:

| | Zahl |
|---|---|
| identisch | **34** |
| abweichend | **9** |
| fehlte hier ganz | **2** (`pet-mouth.v1.js`, `manifest.json`) |

Und in den 9 Abweichungen standen **alle vier Befunde von Georg**, jeder mit einer Adresse:

| Befund | Datei | fehlte hier |
|---|---|---|
| gelbe Augenlider | `kfb-pets.js` | `stripEyes` (WS0 1×, hier **0×**) — Kenneys gebackene Augen wurden nie gelöscht |
| kein roter Mund | `kfb-pets.js` + `pet-mouth.v1.js` | `pets[].mouth` wurde nie zusammengeführt → jeder Pet bekam den globalen Rückfall-Mund; die Mund-Datei fehlte ganz |
| Pet-Größe falsch | `podcast-v1/stage.v1.js` | **`opts.byCube`** (WS0 4×, hier 0×) — 136 Zeilen, die die **Grundform** als Bezug nehmen statt der Hüllkiste |
| Schatten / Karte | `ground.v5.js`, `layout.v5.js` | hier **reicher** (`autoTilt`), nicht angefasst |

**Der bittere Teil:** ich habe die Pet-Größe in sechs Runden neu erfunden — Kachel an der Karte,
zurückgerechnete Anteile, `refEdge`, eine eigene Fläche. **WS0 hatte es schon gebaut**, mit demselben
Befund und derselben Begründung (»die Grundform ist der Bezug, nicht die Hüllkiste«, 25.8., nach
Georgs Ansage). Es lag nur nicht im Paket. Ich habe eine Lösung nachgebaut, die es gab, und dabei
eine funktionierende Bühne beschädigt.

## 5 · Die Regel, die hier gefehlt hat

Es gab eine Hausregel dafür — sie stand im SOP und ich habe sie nicht angewendet:

> *Zuerst zählen, dann bauen.*

Und drei, die es noch nicht gab und die dieses Post Mortem stiftet:

**R1 · Ein Import-Check prüft Gleichheit, nie Anwesenheit.** Byteweise, Datei für Datei, mit
Zahlen im Bericht. Ein Pfad, der auflöst, beweist nichts.

**R2 · Ein fremdes System läuft erst unverändert und wird gezeigt, bevor eine Zeile geändert wird.**
Das erste Bild aus dem Zielsystem ist die Abnahme des Umzugs — nicht der Anfang des Umbaus. Hätte
ich das getan, wäre nach 10 Minuten sichtbar gewesen, dass die Umgebung falsch ist, statt nach sechs
Stunden.

**R3 · Bei »das ist falsch« wird die ganze Kette gemessen, dann EINE Sache geändert.** Auf jedes
Bild einzeln zu reagieren erzeugt die nächste Runde. Georg hat es genau benannt:
*»wir fixen hier jeden Bug 3mal, oder was?«* — ja, weil jede Reparatur eine Reparatur meiner
vorigen Reparatur war.

**R4 · Ein Bauteil, das man nicht sieht, ist nicht unbedingt falsch gebaut — es kann auch niemand
zeichnen.** Nachtrag vom Abend des 26.8. Der Pet-Schatten war viermal Thema (»sind nicht da« ·
»upright unter der Karte« · »der schatten ist unten!« · »habt ihr das Rig immer noch nicht sauber
gebaut?«), und die Kette hatte **zwei** belegte Ursachen hintereinander:

| # | Ursache | gemessen | Status |
|---|---|---|---|
| 1 | zweiter Empfänger: 40×40-Ebene auf Welt-y 0, Erbstück aus Studio v4 | Bild-y 240 px statt 103 px | **belegt** |
| 2 | Kachel hing an `Scene` statt am gekippten Feld | 9,79° Differenz zur Karte | **belegt — und sie war die Wirkung** |
| 3 | Kachel läge in einer Ebene, die keine Kamera rendert | Kamera-Maske 1, Kachel 2 / 4 | **Fehlschluss, s. R5** |

Die Regel R4 selbst gilt — sie ist die richtige Frage vor jeder Sichtbarkeits-Suche:
*Wer zeichnet dieses Objekt, und sieht diese Kamera seine Ebene?* Das Modul führte den Satz für
Licht bereits selbst (»ein Licht, das seine Empfänger nicht sieht, wirft nichts — und meldet das
nicht«). Nur trug **dieses** Beispiel die Regel nicht.

**R5 · Eine Änderung, nach der das Bild stimmt, ist noch keine Ursache — der Gegentest entscheidet.**
Die teuerste Lehre des Abends, und sie ist mir erst durch die Gegenprüfung aufgefallen.

Ich hatte Ursache 3 gemeldet, einen `origRender`-Zweig gebaut, danach ein Bild mit Schatten gesehen
und den Zweig für die Behebung gehalten. Der Gegentest mit gleichen Pixeln:

| Kachel-Maske | Luminanz am Fuß (host / ref) |
|---|---|
| **2 / 4** — Verhalten VOR der Änderung | 157,3 / 181,9 |
| **1** — der neue Zweig | 157,3 / 181,9 |

Identisch. Im ausgelieferten Zustand stand die Kachel beim Messen sogar auf 2/4 — im alten Pfad —
und der Schatten war da. Sichtbar gemacht hat ihn **Ursache 2, die Kippung.** Der Zweig ist
harmlos und darf als Absicherung stehen; als *Ursache* zitiert wäre er das Ausgangsmodell der
nächsten Sitzung, in genau dem Strang, der laut §5 schon dreimal an Ursachenverwechslung Geld
gekostet hat.

Dazu der Grund, warum ich es nicht selbst gesehen habe: **mein Messverfahren war das falsche.** Ich
habe »Kontrast am Fuß« als *dunkelster gegen hellsten Pixel im Fenster* gemessen und damit vor allem
den Kartendruck erfasst — Linien, Text, Farbflächen. Die Werte 225,9 und 209,2 waren echt und sagten
über den Schatten nichts. Die tragfähige Messung ist die **Differenz desselben Pixels mit und ohne
Boden**: host 185,4 → 157,3 (**28,1** dunkler), ref 234,8 → 181,9 (**52,9**), reversibel.

*Ein Kontrastwert ist keine Schattenmessung — eine Differenz mit und ohne ist eine. Und wer eine
Ursache behauptet, schaltet sie einmal ab.*

## 6 · Was Georg an seiner Seite ändern kann (das Einzige, was ich sehe)

Nichts an der Doku, nichts an der Klarheit. Eine Sache am **Format der Übergabe**: ein Export
zwischen Arbeitsplätzen sollte eine **Manifest-Datei mit Byte-Größe je Datei** tragen. Dann ist die
Prüfung nicht mehr Vertrauenssache — der Empfänger vergleicht Zahlen und kann nicht »vollständig«
melden, ohne es zu belegen. WS0s Vollexport hat genau das mitgeliefert (`manifest.json`), und
deshalb war diese Runde in Minuten geprüft statt in Stunden vermutet.

## 7 · Stand nach der Reparatur

- `KFB Pet SpinballCast v3.dc.html` — **byteidentisch** mit WS0s Bühne (130.237 B).
- 43 von 46 Modulen byteidentisch; **3 absichtlich abweichend**, weil hier die reichere Fassung
  liegt (`kfb-ink-canon.js` +151 Z, `ground.v5.js` +69 Z mit `autoTilt`, `layout.v5.js` +8 Z).
  WS0s Fassungen liegen als Referenz in `docs/spinballcast-v3/ws0-referenz/`.
- Am Bild geprüft, vergrößert: **roter Mund da, Lider nicht mehr gelb**, Hintergrund gold,
  Pets in WS0-Größe, `byCube` läuft (gemessene Kante `body` 0,780 / 0,702).
- Alle meine Größen-Experimente sind **zurückgenommen**.

## 8 · Offen — und diesmal in dieser Reihenfolge

1. **Nichts bauen**, bis Georg das Bild gegen WS0 abgenommen hat.
2. Dann die eine offene Sachfrage: sollen die Körperwürfel **gleich groß** sein? WS0s Stand sagt
   nein (`PET_FILL bunny 0,351` = −10 % für die Ohren), Georgs Ansage sagt ja. Das ist eine
   Entscheidung, keine Messung — und sie gehört ins **Studio**, wo der Vertrag wohnt.
3. Rückläufer ins Repo: `kfb-pets.js` (mit `stripEyes` + Mund-Merge), `pet-mouth.v1.js`,
   `stage.v1.js` (mit `byCube`) — solange sie nur in zwei Arbeitsplätzen liegen, passiert das hier
   wieder.
