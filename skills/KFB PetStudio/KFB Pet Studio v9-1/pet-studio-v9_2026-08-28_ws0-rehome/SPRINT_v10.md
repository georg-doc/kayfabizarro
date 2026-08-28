# SPRINT v10 — KFB Pet Studio

**Ausgangspunkt:** `export/pet-studio-v9_2026-08-27/` · Fork zu `KFB Pet Studio v10.dc.html`,
**v9 einfrieren** als Vergleichsmaßstab. Lies vorher `HANDOVER_WS0_v9.md`, dann das Living Document.

Jede Scheibe hat **eine Abnahmezahl**. Ohne Zahl ist sie nicht fertig, sondern nur gebaut.

---

## V10-S1 · Zacken für Scream (die kürzeste Strecke zu sichtbarem Fortschritt)

Der Code existiert: `studio-v7/edge-treatment.v1.js` baut Zacken und den langen schmalen Zipfel
(»lang heißt schmal«). Er hängt nur nicht am Bild. **Verkabelung, kein Neubau.**

Der Weg: die Randbehandlung liefert die **Silhouette** der Grundform; `bubble-tail.splice()` hängt
den Zipfel ein; `paintBubble` malt beides als **einen** Pfad. Reihenfolge zwingend — erst Rand, dann
Zipfel, sonst sitzt der Ansatz auf einer Kante, die es nachher nicht mehr gibt.

**Falle:** Zacken erzeugen viele scharfe Ecken, und `paintBubble` nimmt an jeder Ecke die Feder auf
30 % zurück. Auf einer Zackenkette kann die Linie damit durchgehend dünn werden. Vorher messen, wie
viele Ecken pro 100 px Bogenlänge entstehen, und die Eckenerkennung notfalls über einen Winkel
schwellen lassen statt über den Knick allein.

**Abnahme:** Zackenzahl und mittlere Zackentiefe als Anteil der Blasenhöhe, plus Federbreite an
einer Zacke gegen die Federbreite an einer glatten Kante desselben Bildes. Sichtprobe im
**Spielmaßstab**, nicht in der Werkbank — dort ist die Blase groß, und eine Zacke, die groß
funktioniert, verschwindet klein.

---

## V10-S2 · Thought: Lappen und Spur

Georgs Festlegung: **Lappen rundum, Grundform bleibt klar lesbar** (Rechteck bleibt Rechteck), und
statt Ansatz/Spitze eine **Spur** aus 2–3 kleiner werdenden Kreisen zum Kopf.

Zwei getrennte Bauteile, nicht eins: die **Lappen** sind Randbehandlung (dasselbe Modul wie die
Zacken), die **Spur** ist ein eigener Zeichner mit eigener Lage — sie liegt über der ganzen Bühne,
nicht in der Blase. In v8 gibt es dafür schon `K.connector()`; prüfen, ob er taugt, statt einen
zweiten zu bauen.

**Abnahme:** Lappenzahl und Lappentiefe als Anteil der Grundform-Kante; für die Spur die drei Radien
und die drei Abstände, alle als Anteil der Blasenhöhe. Dazu die Gegenprobe, dass ein Rechteck nach
der Lappenbehandlung **noch als Rechteck erkennbar** ist — das ist Georgs eigentliche Bedingung, und
sie ist messbar: Seitenverhältnis vor und nach der Behandlung, Abweichung unter 10 %.

---

## V10-S3 · Verpuffen, ohne Fade

Die Regel steht schon: **kein Fade, Papier wird nicht durchsichtig.** Drei Zahlen:

1. **Lückenwachstum** — die geschnittenen Lücken in der Tuschelinie wachsen auf Bogenlänge, bis die
   Linie aufgehört hat zu sein. Der Mechanismus existiert (`VOICE_INK.whisper.dash`), er wird nur
   über die Zeit gefahren.
2. **Fallzeit** — das Papier fällt kippend nach, wie ein losgelassenes Blatt.
3. **Einzugszeit** — die Spitze zieht sich **vorher** ein. Sie hat kein Ziel mehr; das ist Logik,
   keine Deko.

**Abnahme:** die drei Zeiten in ms, plus die Aussage, dass zwischen Beginn und Ende **kein
Deckkraft-Wert** angefasst wird. Das ist prüfbar: `material.opacity` bzw. `globalAlpha` bleibt
konstant.

---

## V10-S4 · Die Bühnen-Blase auf den Kanon-Zeichner

Heute malt die Bühne ihre eigene glatte Outline (`dead: 44`) — Georgs Verlegenheitslösung. Der
Kanon-Zeichner (`paintBubble`: Papier, Saum, moduliertes Band, Kantenfase, geschnittene Lücken)
liegt daneben und wird nicht benutzt. **Zwei Zeichner heißt zwei Federn, und der falsche ist der
sichtbarere.**

Georgs Entscheidung: **Kanon ist Standard, die glatte Fassung bleibt als Umschalter stehen** — falls
die Feder im kleinen Maßstab zu laut wird.

**Falle:** die Bühnen-Blase wird **einmal gezeichnet und nur skaliert** (die v7-Regel, die v6
gekostet hat). Der Umbau darf diese Regel nicht brechen. Abnahme deshalb über den vorhandenen
Neuzeichnungs-Zähler: 150 Bilder Ruhe, **null** Neuzeichnungen — dieselbe Zahl wie in v7.

---

## V10-S5 · Der Zipfel auf der Bühne

Dieselbe Ersetzung wie in der Werkbank, aber am echten Bild — **dort** sitzt Georgs Sprung. Die
Bühne benutzt heute `shapeForBox`, und darin wird der Zipfel gesucht statt gesetzt.

Dazu kommen die drei Verhaltensregeln, die in der Werkbank noch nicht stehen:
**Ruhezone** (die Blase reagiert erst, wenn der Besitzer einen Radius verlässt) · **Trägheit**
(Luftballon an unsichtbarer Schnur, mit Überschwingen) · **Katapult** (das Modell fliegt, die Blase
bleibt stehen und verpufft — S3 liefert das Verpuffen).

Die Ruhezone und der Nachlauf existieren in v8 als `dead` und `lazy` und sind bedienbar. Sie müssen
auf den **Zipfel als Bauteil** umgehängt werden, nicht auf die Zipfel*richtung* — das ist der
Unterschied, der den Sprung erzeugt hat.

**Abnahme:** Zipfel-Geometrieänderungen über 150 Bilder Ruhe bei atmendem Pet — Ziel **0**. Bei
einer echten Bewegung: die Zahl der Änderungen gegen die Zahl der Bilder, plus die Aussage, dass die
Ansätze dabei stehen bleiben.

---

## V10-S6 · Import und Export gegen den Pad-Block nachprüfen

Der Wächter meldet die Pad-Felder korrekt (gemessen: 15 Pad-Felder im Sitzungs-Entwurf). Der Weg
über **Datei** ist noch nicht gemessen: einzeln, als Auswahl, als voller Satz, und der Import mit
Entscheidung je Pet.

**Abnahme:** ein Pad-Block raus, Datei wieder rein, Feld-für-Feld-Vergleich mit **0 Abweichungen**;
dazu der Ausdünnungs-Test — eine Datei mit weniger Feldern muss **gemeldet** und nicht übernommen
werden (die Regel, die v1.2.6 gekostet hat).

---

## V10-S7 · Anker mit Blickachse, und dann Gear

`body.faceDir` wird gemessen, aber die Anker stehen ohne Drehung (`+z` = vorn). Eine Achse zu
drehen, ohne sie abzunehmen, ist die Falle aus dem Travel-Cut (»Gesicht ist −Z«).

Danach der eigentliche Zweck der Anker: **ein Gegenstand an einer Hand-Entsprechung.** Ein einziger
Prop, ein einziger Anker, als Beweis, dass die Felder tragen — nicht zehn.

**Abnahme:** Pet um 90° gedreht, Prop bleibt an der Hand (Abweichung in Grundform-Einheiten), und
der Prop steckt nicht im Körper (Abstand zur Silhouette > 0).

---

## V10-S8 · Die Altschulden, endlich

1. **Rückläufer ins Repo** — vier aus V8-A plus die drei v9-Module.
2. **16 Schriftschnitte** hoch, `@font-face` auf RAW-URL. Solange das nicht steht, zeigt **jedes**
   Standalone Ersatzschriften — auch das aus dieser Sitzung.
3. **`cubeH` aus `byCube` schreiben** statt lesen. v9 macht die Abweichung sichtbar (Schwelle 2 %),
   löst sie aber nicht. Eine gemessene Kante schlägt ein gepflegtes Feld.

---

## Reihenfolge, kurz begründet

**S1 → S2 → S3** sind die Sprechblase und bauen aufeinander: Rand, dann Rand plus eigener Zeichner,
dann die Zeit. **S4 → S5** bringen das Ergebnis auf die Bühne, und erst dort sieht Georg, was er
gemeldet hat. **S6** ist Pflicht vor jeder weiteren Vertragsarbeit. **S7** öffnet das nächste Feld
(Gear). **S8** ist überfällig und wird mit jeder Runde teurer.

Wenn die Zeit für alles nicht reicht: **S1, S5 und S8.2** sind die drei mit der größten Wirkung pro
Zeile — Zacken sieht man sofort, der Bühnen-Zipfel ist der gemeldete Fehler, und die Schriften sind
der Grund, warum jedes Standalone falsch aussieht.
