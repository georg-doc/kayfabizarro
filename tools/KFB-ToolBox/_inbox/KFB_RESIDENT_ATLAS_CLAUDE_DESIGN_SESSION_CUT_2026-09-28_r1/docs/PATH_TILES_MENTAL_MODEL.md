# Pflaster und Wege aus Kacheln · mentales Modell

Das Problem steckt in allen Sets mit Weg-Kacheln (KayKit Halloween Bits `path_A–D`, Tiny Treats, KayKit Dungeon/City) und ist dasselbe wie bei Straßen im Racing- und City-Kit. Im Friedhof S11 ist es sichtbar geworden: Vor dem Tor liegen volle Pflasterflächen neben auslaufenden Kacheln. Das liest sich wie verstreute Einzelteile, nicht wie ein Weg, der ausfranst.

## Was die Kacheln sind

Eine Pflasterkachel ist keine Bodenplatte. Sie ist ein **Stück Dichte**.
- `path_A`–`path_D` sind ungefähr 1,9 × 1,9 groß und 0,1 hoch. Sie liegen auf der Platte, nicht an ihrer Stelle.
- Die vier Varianten unterscheiden sich darin, wie viel Stein sie enthalten und wo die Lücken sind.
- Im Sample `sample.png` zeigt sich ein Weg als Verlauf: in der Mitte dicht, an den Rändern lückig, am Ende einzelne Steine.

Daraus folgt: **Eine Kachel wird nach ihrer Dichte gewählt, nicht nach ihrem Namen.**

## Das Modell · drei Schichten

1. **Achse.** Ein Weg ist eine Linie mit Anfang und Ende, etwa Tor → Gruft. Die Achse wird zuerst gesetzt, als Polylinie in Welteinheiten, mit dem Raster der Bodenplatten (4) als Maßstab.
2. **Band.** Um die Achse liegt ein Band. Die Kacheldichte nimmt mit dem Abstand zur Achse ab:
   - **Kern**, Abstand < ½ Wegbreite: die dichteste Kachel, lückenlos auf einem 1,9er-Raster.
   - **Rand**, ½ … 1 Wegbreite: mittlere Dichte, jede zweite Zelle frei oder versetzt.
   - **Saum**, 1 … 1,5 Wegbreiten: die leichteste Kachel, vereinzelt, gedreht.
3. **Enden.** An Anfang und Ende läuft auch die Achse aus. Der Kern wird schmaler, bis nur noch Saum bleibt. Ein Weg hört nicht an einer Kante auf.

Wo zwei Wege sich treffen (Platz vor der Gruft), addieren sich die Bänder. Es gilt die jeweils dichtere Stufe, nie eine doppelte Kachel.

## Was bis jetzt falsch war

- Die Kacheln im S11-Friedhof sind **von Hand gestreut** und wechseln die Variante reihum (`k % 4`). Die Variante folgt also dem Zähler, nicht der Dichte. Dadurch liegt eine dichte Kachel mitten im Saum und eine lichte mitten im Kern.
- Außen vor dem Tor sind die Kacheln gleichmäßig verteilt. Es gibt dort keinen Kern, nur Saum mit falscher Dichte. Genau das hast du gesehen.

## Was vor dem nächsten Bau zu messen ist

Die Dichte der vier Varianten ist bis jetzt nur geschätzt. Bevor der Generator gebaut wird:
- Die Draufsicht jeder Variante rendern und den Anteil der Steinfläche an 1,9 × 1,9 zählen.
- Das Ergebnis als Tabelle `path_* → Dichte` in die Pack-Beschreibung schreiben, nicht in den Code.
- Dasselbe für die Tiny-Treats- und die KayKit-Dungeon-Pflaster.
- Prüfen, ob eine Variante eine Richtung hat. Ist sie lang gezogen, muss die Drehung der Achse folgen, statt zufällig zu sein.

## Wo das hingehört

Das ist ein **zentraler Baustein** wie `lib/track-chain.js` für die Straßen. Er ist kein Teil einer Szene. Vorschlag: `lib/path-band.js` mit

```
pathBand({ axis:[[x,z],…], width, pack:{ core:'path_A', rim:['path_B','path_C'], fringe:'path_D' }, seed })
  → [{ name, x, z, ry, tier:'core'|'rim'|'fringe' }]
```

Die Szene übergibt nur Achse und Breite. Die Kachelwahl steht an einer Stelle und gilt für jedes Pack, das seine Dichtetabelle mitbringt.

## Abnahme

- Draufsicht neben `sample.png`: Der Weg vom Tor zur Gruft liest sich als EIN Weg, der zu den Rändern ausfranst.
- Keine dichte Kachel liegt außerhalb des Kerns, keine lichte Kachel im Kern.
- Kacheln überlappen sich nirgends mit mehr als 0,1.
- Dieselbe Funktion baut einen Tiny-Treats-Weg, ohne dass am Code etwas geändert wird.
