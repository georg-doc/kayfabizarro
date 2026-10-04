# Handover · Audio-Slice ↔ Flight Deformer v4

Adressat: der Audio-Chat (Suno-Instrumentals, Shepard-Logik).
Absender: Vehicle Lab v4 / Flight Deformer.
Stand: 19.09.2026. Mitgeliefert: `KFB_Vehicle_Lab_v4.zip` (voller Code-Stand, lauffähig).

---

## 1. Worum es geht

Verformung, Clip und Klang sollen von **einer** Ereignis-Deklaration ausgelöst werden, nicht von
drei Systemen, die sich zufällig zur selben Zeit melden. Travel hat dafür bereits den Ort:
`fx-bus.js` ist der Ereigniseingang, `fx-script.js` führt die Kaskaden als Daten.

Der Deformer hängt schon so, dass er nur lesen muss. Was fehlt, ist die gemeinsame Zeile: ein
Ereignis, das Stärke, Clip und Klang zusammen trägt.

---

## 2. Was auf unserer Seite steht (und was ihr davon anfassen könnt)

### Die Naht — 12 Felder, ein Aufruf je Bild

`lab-v8/travel-flight-seam.v1.js`. Ein `sample(dt, ctrl)` **nach** `carpet.update`, danach liegt
ein Block bereit. Für Audio sind das die brauchbaren Dauergrößen:

| Feld | Herkunft | Bereich | Audio-Lesart |
|---|---|---|---|
| `speed` | TRAVEL | Weltmaß/s | absolutes Tempo |
| `speedNorm` | TRAVEL | 0…1 | `speed/maxSpeed` — **die Anzeige-Größe**, nicht `speedRatio` |
| `longAccel` | DERIVED | −1…1 | Gas/Bremse, geglättet 12/s |
| `bank` | TRAVEL | −1…1 | Schräglage inkl. Driftanteil |
| `pitch` | TRAVEL | −1…1 | Nickwinkel aus der Steigrate |
| `yawRate` | DERIVED | rad/s | echte Kursänderung |
| `turnRate` | DERIVED | −1…1 | dieselbe Messung, normiert |
| `drifting` | TRAVEL | 0…1 | Driftintensität |
| `boosting` | TRAVEL | bool | Schub an/aus |
| `climbIn` | TRAVEL | 0/1 | Steigeingabe |
| `dt` | Wirt | s | keine zweite Uhr, nirgends |

Ereignisfelder (einmalig, je Bild zurückgesetzt): `touchdown`, `impact` (+ `impactSide`), `gust`.

**Zwei Felder sind ausdrücklich UNAVAILABLE**: `gust` hat in Travel keinen Eigentümer, `impact`
gehört dem fx-Bus. Die Naht nimmt beide entgegen (`seam.inject(name, ctx)`), erfindet sie aber
nicht. Im Labor sind sie von Hand gefeuert und dann als LABOR markiert. Wenn ihr für Audio eine
Quelle für `gust` braucht, ist das eine Travel-Entscheidung, keine Deformer-Entscheidung.

### Der Eingang

```js
seam.inject('impact',       { strength: 0…1, side: -1|+1 });
seam.inject('ground.touch', { strength: 0…1 });
seam.inject('gust',         { strength: 0…1, side: -1|+1 });
```

Die Namen folgen absichtlich der Travel-Schreibweise, damit der Empfänger später nur den Bus
anhängt: `fx.on('ground.touch', () => seam.inject('ground.touch'))`. Genau diese Zeile ist der
Kopplungspunkt — wenn Audio am selben Bus hängt, teilen sich Klang und Form dieselbe Deklaration.

---

## 3. Der Vorschlag: ein Ereignis, drei Wirkungen

Ein Eintrag in `fx-script.js` deklariert das Ereignis einmal und trägt alle drei Nutzlasten:

```
{ id: 'landmark.hit',
  deform: { strength: 0.8, side: 'auto' },   → seam.inject → Flight Deformer
  clip:   { … },                              → bestehende Clip-Kaskade
  sound:  { … } }                             → Audio-Slice
```

Der Deformer braucht davon nur `strength` und `side`. Alles Weitere ist eure Spalte. Wichtig ist
nur, dass es **dieselbe Zeile** ist: ein Ereignis, das in zwei Dateien steht, driftet.

---

## 4. Die eigentliche Frage: Taktmaß

Musiksynchronität braucht ein Taktmaß. Das ist nicht trivial, und der Grund ist einfach:

> **Ein Einschlag kann nicht warten, bis der Takt passt.**

Damit zerfallen die Ereignisse in zwei Klassen, und die Trennung sollte **im Ereignis stehen**,
nicht in der Abspiellogik:

- **Hart (sofort).** `impact`, `ground.touch`. Physisch verursacht, sichtbar auf dem Bild.
  Verzögerung um bis zu einen halben Takt wäre ein Fehler, kein Stilmittel. Klang folgt dem Bild.
- **Weich (quantisierbar).** Boost-Einsatz, Driftbeginn, Höhenwechsel, Biomwechsel, Anticipation.
  Diese dürfen auf den nächsten Schlag rutschen — sie haben keinen harten Kontaktmoment.

Vorschlag für das Feld: `sync: 'now' | 'beat' | 'bar'`. Default `'now'`, weil eine falsch
quantisierte Kollision teurer ist als ein unquantisierter Auftakt.

**Offene Punkte, die ihr entscheiden müsst:**

1. **Wer hält das Taktmaß?** Vorschlag: der Audio-Slice, als einziger. Der Deformer hält keine
   eigene Uhr (Vertrag, PM-50) und wird auch keine anfangen. Wenn ihr einen Beat-Zeiger
   veröffentlicht (`nextBeatIn(t)` in Sekunden), können wir Anticipation daran hängen — das ist
   der einzige Ort, wo das für uns Sinn ergibt.
2. **Shepard-Logik und `speedNorm`.** Die Shepard-Steigung braucht eine monotone Größe. `speedNorm`
   ist 0…1 und geglättet, aber sie sättigt bei Reisetempo. Für ein endloses Steigen bräuchtet ihr
   entweder `longAccel` (Ableitung, wechselt Vorzeichen) oder eine eigene Akkumulation. Sagt uns,
   welche Größe ihr wollt — wenn sie aus Travel ableitbar ist, kommt sie **einmal** in die Naht,
   nicht bei euch nochmal.
3. **Boost als Kante, nicht als Pegel.** `boosting` ist bool; der Deformer nimmt die Kante
   (`fd.boost(+1/-1)`). Wenn Audio einen Pegel braucht, sagt es — der ist aus `longAccel` da.

---

## 5. Was der Deformer NICHT tut

Damit keine doppelte Arbeit entsteht:

- keine Weltposition, kein Kurs, kein Tempo, keine Höhe, keine Kamera (gehört Travel)
- keine eigene Uhr, kein eigener Scheduler
- keine zweite Physics Engine — `carpet.js` und `flight-controls.js` liegen byteweise unverändert
  unter `lab-v8/vendor-travel/` und rechnen; wir lesen nur

Wenn Audio etwas davon braucht, kommt es aus derselben Naht, nicht aus einer Parallelmessung.

---

## 6. Was im ZIP liegt

```
KFB Vehicle Lab v4.dc.html      Werkbank, öffnet direkt im Browser
support.js                      Laufzeit
lab-v8/
  travel-flight-seam.v1.js      ← die Naht. Hier hängt Audio an.
  flight-deformer.v1.js         Lage-/Rollgruppe, liest die Naht
  flight-frame.v1.js            gemessener Rahmen (Rollachse, Schwerpunkt)
  cartoon-deform-segmented.v1.js  segmentierte Verformung, 8 Ringe
  spring.v1.js                  Nachlauf je Band
  flight-profiles.json          defaults + Flight-Variante
  FLIGHT_SEQUENCES.json         Testläufe inkl. „Einschlag" (Labor-Eingang)
  vendor-travel/                carpet.js, flight-controls.js u. a. — UNBERÜHRT
lab-v7/                         Fahrzeug-Deformer, Rigs, Fixtures, Adapter
HANDOVER_audio_slice_v1.md      dieses Dokument
RETURN_flight_deformer_v1.md    Stand und Messwerte der Flug-Linie
PLAN_vehicle_vfx_flightmode.md  VFX-Planung, angrenzend
```

Zum Laufen genügt ein lokaler Server im Wurzelverzeichnis des entpackten Ordners
(Module werden per `import()` geladen, `file://` reicht nicht).

Die Sequenz **„Einschlag"** in `FLIGHT_SEQUENCES.json` feuert `impact` bei 900 ms. Das ist der
kürzeste Weg, das Zusammenspiel zu prüfen: ein Ereignis, das schon existiert und dem nur der
Klang fehlt.

---

## 7. Was wir von euch brauchen

1. Ob das Taktmaß beim Audio-Slice liegt, und ob es einen Beat-Zeiger nach außen gibt.
2. Welche Größe die Shepard-Logik will (siehe 4.2).
3. Ob `sync: 'now' | 'beat' | 'bar'` als Feld im Ereignis in Ordnung geht, oder ob ihr die
   Trennung anders schneidet.
4. Ob ihr eine `gust`-Quelle braucht — dann gehen wir damit zu Travel, nicht zum Deformer.
