# SPRINT — KFB Travel v16 · Landschaft (Fork 2026-08-12 aus v15)

**Auftrag (Georg, 12.8.):** wechselnde Landschaften — Farben, Terrains, Farb-Instanzierung wie in
`three.js/examples/webgl_instancing_dynamic`; **1/6-Stufung für Terrain-/Voxel-Höhen**, damit
unterschiedliche Steigungen und Senken NEBEN hohen Klippen möglich werden; später Kenney-3D-Props
mit leichtem Cartoon-Verbieger statt der grauen Platzhalter-Blöcke.

**Entschieden:** drei Slices, nacheinander — nicht gleichzeitig. Die Stufung ändert die Bodenhöhe,
die Props stehen darauf, die Farben liegen darüber; wer sie zusammen anfaßt, weiß bei jedem Fehler
nicht, welche Schicht ihn gemacht hat.

| # | Slice | Stand |
|---|---|---|
| **L1** | **Stufung.** Stufengröße als ORT-Merkmal: vier Reliefarten (Hang · Terrasse · Kiste · Klippe) aus einer langwelligen Reliefkarte | **ABGENOMMEN** (Zahlen in **L1b** richtiggestellt, Naht 115) |
| **L2a** | **Weltwürfel.** Story-Modus, Weltseed und Farbwelt-Reihenfolge aus EINER Zahl, die im Panel steht | **ABGENOMMEN** |
| **L2b** | **Farbwelt als ORT.** `regionAt(x,z)` rein aus dem Ort; Grenzübertritt schickt eine Front über Terrain, Himmel und Nebel | **ABGENOMMEN** |
| **L2c** | **Der Atem.** Dieselbe Front, kleiner, mit Farbtondrehung — eine Bewegung auf zwei Skalen | **ABGENOMMEN** |
| **L2d** | **Ringwellen (Variante A).** Farbkreise laufen über das Terrain, breiten sich aus, verlaufen — kein Gedächtnis. Acht Plätze im Uniform-Array, Ring im Fragment-Shader, Auslöser sind Ereignisse | **ABGENOMMEN** |
| **L3** | **Kenney-Props.** 9 Modelle ueber `asset-repo.json` (RAW), globale InstancedMeshes, Verbieger pro Instanz, Bodenbewegung + Bodenfarbe + Squash am Wuerfel-Bob | **ABGENOMMEN** (L3 · L3b · L3c · L3d) |
| **L3e** | **Aufbau in Scheiben.** 20–24 ms je Chunk-Wechsel sind ein spuerbarer Haenger; der Rest sind `mulberry32` und Trigonometrie je Standort. Entweder ein Cache ueber die Chunk-Kachel oder ein Aufbau ueber mehrere Bilder verteilt | offen, ohne Auftrag |
| **L4** | **Asset-Index konsolidieren** — bewusst NICHT hier: `docs/travel-v16/HANDOVER_assets_chatgpt.md` ist der standalone Auftrag dafuer (zwei Indizes, sechs verifizierte Fallen, Verifikationspflicht) | ausgelagert |

`KFB Travel v15.dc.html` + `terrain-v15/` bleiben **FROZEN als Vergleichsmaßstab**.

---

## 1. L1 — was gebaut ist, und warum so

**Der Kern:** eine feinere Stufe allein löst die Aufgabe **nicht**. Wer überall auf CELL/6 rastet,
bekommt überall sanfte Terrassen — die Klippe verschwindet mit. **Steigung und Klippe sind kein
Gegensatz von Höhe, sondern von Stufengröße:** dieselbe Höhendifferenz ist eine Treppe, wenn sie in
zwölf Stufen kommt, und eine Wand, wenn sie in einer kommt.

Also ist die Stufengröße ein **Ort-Merkmal**. Eine eigene, sehr langwellige Rauschkarte
(`reliefFreq` ≈ 220 u) teilt die Welt in vier Reliefarten:

| Reliefart | Stufe | Bedeutung im Spiel |
|---|---|---|
| Hang | `CELL/6` = **0,50 u** | Steigungen und Senken, ohne Sprung begehbar |
| Terrasse | `CELL/2` = **1,50 u** | ein Schritt hoch (`walk.stepMax` 1,5) |
| Kiste | `CELL` = **3,00 u** | das alte v15-Verhalten |
| Klippe | `CELL·2` = **6,00 u** | Wand — über `walk.autoJumpMax` (4,2), also nicht kletterbar |

**Das Höhenfeld darunter ist unverändert.** Es wird nur unterschiedlich fein gerastert — deshalb
gibt es an einer Reliefgrenze keinen Sprung in der Höhe, nur einen Wechsel der Stufengröße: aus
einer Treppe wird eine Kante, ohne daß der Berg sich bewegt.

**Eine Wahrheit, kein zweites Raster:** `stepAt(x, z)` ist eine reine Funktion des Ortes. Physik
(`groundHeightAt`) und Bild (`bakeChunk`) rufen dieselbe Funktion — eine zweite Wahrheit über die
Höhe kann hier gar nicht entstehen.

---

## 2. Die Regler (Panel → *Stufung (v16)*)

Feine Stufung an/aus · Teiler der feinen Stufe (1–12) · Reliefgröße · **Relief-Spreizung** ·
drei Schwellen (Hänge / Terrassen / Kisten, Rest = Klippe) · Klippenhöhe — und zwei Messzeilen:
*Gemessen (480 u um dich)* mit Verteilung, Sprunghöhen und Wandanteil, sowie *Unter dir* mit
Reliefart, Stufe und Bodenhöhe an der eigenen Position.

**Rückweg auf v15:** *Feine Stufung* auf **aus** — dann rastet alles wieder auf ganze Zellen.

---

## 3. Offene Entscheidungen — Georg am Regler

1. **Verteilung global 42–47 / 31–34 / 15–16 / 7–8 %** (Hang / Terrasse / Kiste / Klippe) über fünf
   Welten; die Schwellen sind seit L1b **Flächenanteile**, sagen also, was sie tun. Mehr Klippe
   heißt: Schwelle *… bis Kisten* runter. Ist 7–8 % Klippenfläche genug Drama?
   **Und der wichtigere Hebel:** außerhalb der Klippen ist die Fläche mit 0,9–2,8 % Wandanteil
   *nicht* begehbarer als v15 — weil „Kiste" unverändertes v15-Verhalten ist. Ihren Anteil den
   Terrassen zu geben (*… bis Terrassen* hoch) ist der Weg dahin.
2. **Klippenhöhe 6,0 u** ist bewußt über der Sprunggrenze des Läufers (4,2). Sollen Klippen
   überwindbar sein (dann 4,0) oder eine echte Grenze (so lassen)?
3. **Feiner Teiler 6 → 0,50 u.** 12 wäre 0,25 u; ab da ist die Stufe kleiner als die Tuschekante
   und die Treppe liest sich als Rampe. Willst du das ausprobieren?
4. **L1 ist aus der Reiseflughöhe fast unsichtbar** (Naht 105). Das ist kein Defekt, sondern eine
   Aussage über die Reihenfolge: was Landschaften **aus der Luft** unterscheidbar macht, ist L2
   (Farbe), nicht L1. Soll L2 als nächstes kommen oder L3 (Props)?

---

## 3b. Backlog — bewusst außerhalb dieses Sprints

**B · Die Welle färbt ein (`instanceColor`).** Georg, 12.8.: „später hatte ich überlegt, dass
Wasser-Farbtropfen (als Variante des geplanten Wetters) auf den Boden treffen und sich farbig
kreisförmig ausbreiten." Variante A (gebaut) zieht durch und lässt nichts zurück. Variante B
**lässt Farbe zurück** — die Welt wird über die Zeit übermalt, und nach zehn Minuten Regen sieht
eine Landschaft anders aus als vorher. Das ist der eigentliche `instanceColor`-Slice.

*Was es braucht:* ein Farbpuffer pro Säule (`InstancedBufferAttribute`, 256 Einträge je Chunk,
`DynamicDrawUsage`) und eine Einschreib-Schleife auf der CPU im Ring der Welle. Das three.js-
Beispiel `webgl_instancing_dynamic` zeigt den Upload — **nicht** aber seinen CPU-Loop über alle
Matrizen pro Frame: bei 20 736 Säulen ist das genau der Weg, den v16 vermieden hat.

*Was vorher entschieden sein muss:* (a) ⚠ **ein Deckel, wie weit eine Einfärbung von der
Grundpalette abweichen darf** — ohne ihn ist die Welt nach zwanzig Minuten Matsch; (b) was beim
Chunk-Recycling passiert (die Einfärbung ist Zustand, und Chunks werden beim Weiterfliegen neu
gebacken — entweder gehört sie einer Ortsfunktion, oder sie ist beim Zurückkommen weg);
(c) der Lesbarkeits-Riegel gilt auch für eingefärbte Flächen, nicht nur für die Palette.

*(b) ist die eigentliche Frage*, nicht der Puffer: eine Einfärbung, die beim Wegfliegen
verschwindet, ist keine Erinnerung — und eine, die bleibt, braucht einen Ort, an dem sie wohnt.
Dieselbe Entscheidung wie bei `stepAt` und `regionAt`: gerechnet oder gespeichert.

**Wetter** (Regen, Schnee, Nebel) hängt daran und ist ebenfalls außerhalb dieses Sprints.
`spawnRipple(x, z, farbe)` ist bereits die Schnittstelle dafür — der Auslöser gehört dem
Aufrufer, deshalb ruft das Wetter später nur diese Funktion.

---

## 4. Clean-Run v16

1. DC öffnen, ~8 s. Konsole zeigt **zwei** Zeilen: `[travel-v16] fc-v2.0 · …` **und**
   `[stufung] feine Stufe 0.5 u (Zelle 3) · Hang … · Sprung ⌀ … · Wand … %`.
   **Die zweite Zeile ist die Abnahme von L1** — eine Reliefkarte kann man sich ausdenken; ob
   daraus Hänge NEBEN Klippen werden, muß man zählen.
2. `__travelPOC.terrain.stepReport(0, 0, 240, 4.2)` → `verteilung` mit vier nichtleeren Werten.
3. `__travelPOC.terrain.stepAt(x, z)` an mehreren Orten → **zusammenhängende Felder** derselben
   Stufe, keine Flecken (das ist die Reliefkarte, nicht Würfeln).
4. `setStepping({on:false})` → Verteilung *Kiste 100 %*, mittlerer Sprung steigt. Zurück mit
   `{on:true}`.
5. Panel → *Stufung (v16)* → *Unter dir*: Reliefart und Stufe ändern sich, wenn du fliegst.
6. Panel → *Farbwelten (v16)* → *Hier*: Farbwelt, Farbton, Zahl der Wechsel und Atemzüge, Nachbarn.
   `__travelPOC.colors.regionAt(x, z)` an mehreren Orten → zusammenhängende Felder, keine Flecken.
7. Panel → *Ringwellen (v16)* → *Welle hier auslösen*: ein farbiger Ring läuft nach außen und
   verläuft. `__travelPOC.terrain.rippleReport()` zeigt Plätze, Radien und Gesamtzahl.
   *Wellenfarbe jetzt* nennt Wellen- und Flächenfarbe als Hex — **sie müssen verschieden sein**
   (Naht 113: eine Welle in der Farbe der Palette ist unsichtbar).
8. Alles aus v15 gilt weiter (Flug-Sprint-Clean-Run, `docs/travel-v15/SPRINT_travel-v15.md` §5).
