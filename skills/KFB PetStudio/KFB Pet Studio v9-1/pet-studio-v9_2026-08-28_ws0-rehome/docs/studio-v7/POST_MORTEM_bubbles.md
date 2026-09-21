# POST-MORTEM — die Sprechblase, v5 bis v6
### 2026-08-25 · geschrieben, weil v6 als kaputt eingefroren wird

Dieses Blatt hält fest, **warum** an der Blase drei Fassungen und rund zwanzig Reparaturen
gescheitert sind. Es ist kein Schuldregister, sondern die Liste der Denkfehler, damit v7 sie nicht
wiederholt.

---

## 1 Der eine Satz

> **Die Blase sprang, weil sie ständig neu gemessen und neu gezeichnet wurde — nicht, weil das
> Zeichnen falsch war.**

Alles andere folgt daraus.

---

## 2 Was v5/v6 taten

1. Die Schriftgröße wurde **aus dem Bild** bestimmt: projizierte Kachel × Faktor, dann auf ein
   **3-Pixel-Raster** gerundet.
2. Aus der Schriftgröße wurde der Satz gemessen, daraus die Grundform, daraus die Silhouette,
   daraus die Federbreite, daraus die Leinwand.
3. Jede dieser Größen hing von der vorigen ab — und die **Lage** hing von der Silhouette, während
   der **Zipfel** von der Lage hing.

Ergebnis, gemessen: bei einem Kameraweg von 21 Schritten nahm die Schrift **drei** verschiedene Werte
an (15 → 12 → 9 px). Ein Übergang von 12 auf 9 ist ein Sprung von **25 %** in einem einzigen Bild.
Dazu kam: der Zufallswert für die handgezeichnete Linie hing an Breite und Höhe — jede Größenstufe
war also **eine andere gezeichnete Hand**.

---

## 3 Die vier Denkfehler

**3.1 Eine Zahl aus dem Bild ableiten, die das Bild bestimmt.**
Die Schriftgröße kam aus der Projektion; die Projektion änderte sich beim Atmen der Ruhe-Animation.
Jede Glättung, jede Totzone und jede Stufung war ein Pflaster auf diesem Kreis. Es gab am Ende
**fünf** Ruhezonen (Anker, Kopfhöhe, Größe, Zipfel, Position) — fünf Pflaster auf einem Bruch.

**3.2 Rundung als Ruhe verkaufen.**
Stufen machen ein Zittern unsichtbar und einen Übergang **sichtbar**. Wer 3-px-Stufen einführt, tauscht
ein Zittern von einem Pixel gegen einen Sprung von 25 %.

**3.3 Eine Kette statt einer Reihenfolge.**
Silhouette → Lage → Zipfel → Silhouette. Ein geschlossener Kreis hat keinen Eigentümer; er hat einen
Grenzzyklus. Er *kann* nicht zur Ruhe kommen, egal wie sauber die einzelnen Glieder sind.

**3.4 Die Feder retten wollen, die für etwas anderes gebaut ist.**
Die Kanon-Tusche moduliert die Breite nach Lichtrichtung — richtig für eine Karte von 1800 px, tödlich
für eine Blase von 60 px: dort ist die halbe Bandbreite größer als der Radius, und die Form läuft zu.
Die Reparaturen dagegen (`tipFade`, direkte Bandformel unter 40 px, Mindestbreiten) sind alle
Sonderfälle **einer** falschen Annahme: dass eine Feder für alle Größen dieselbe sein muss.

---

## 4 Was eingefroren wird

- **`KFB Pet Studio v6.dc.html` ist kaputt eingecheckt.** Lauffähig, aber die Blase springt und die
  Skalierung ist nicht verlässlich. Er bleibt liegen, weil in ihm die *Randbehandlung* entstanden ist
  (Grundform + Kreise/Zacken), die in v7 weiterlebt.
- **Die Kanon-Tusche wird für Blasen ausgesetzt** (Georgs Freigabe 25.8.: »von mir aus auch deadlines
  mit shadow«). Für Karten, Figuren, Bodenschatten und Tipp-Punkte gilt sie unverändert weiter — dort
  ist die Fläche groß genug, dass die Modulation trägt.
- Die Dateien `studio-v6/*` bleiben unverändert liegen. v7 hat eigene Kopien.

---

## 5 Was v7 anders macht

| | v6 | v7 |
|---|---|---|
| Größe | aus dem Bild gemessen, 3-px-Raster | **eine feste Entwurfsgröße**, Bühne skaliert stetig |
| Neuzeichnen | bei jeder Größenstufe, bis 121 ×/s | nur bei neuem Text, neuer Art, neuer Zipfelrichtung |
| Zipfel | eigene Silhouette-Gruppe, verschob die Form | **im Pfad**: eine Fläche, eine umlaufende Linie |
| Feder | Kanon-Band, moduliert | gleichmäßige Linie + harter Schatten unten rechts |
| Sprung beim Zoom | **25 %** in einem Schritt | stetig, folgt der Kamera |

**Die Regel in einem Satz:** *Was sich nicht bewegt, wird einmal gezeichnet. Was sich bewegt, bekommt
eine eigene Lage.* Deshalb liegen die drei Kreise der Denkblase in einer zweiten Leinwand — sie atmen
und folgen dem Kopf, ohne die Blase anzufassen.

---

## 6 Die Regeln, die trotzdem gelten

Sie sind in v5/v6 teuer bezahlt und in v7 übernommen:

1. Eine Zahl hat einen Eigentümer, alle anderen addieren.
2. Ein Maß, eine Formel, an einer Stelle.
3. Eine Formregel gehört in den normierten Raum der Form, nicht in Bildschirmpixel.
4. Der Standardzustand ist ein Prüffall — frisch laden, nichts anklicken, messen.
5. Bewegung aus einer Bahn, Verformung aus ihrer Ableitung.
6. Ein Rückfallwert ist eine Entscheidung, keine Restmenge.
7. Anteile am Bild abzählen, nicht schätzen.
8. Messen statt behaupten, und die Zahl in den Changelog.
