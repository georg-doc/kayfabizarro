# HANDOVER — Pet Studio v7 an WS0 (2026-08-25)

Gelesen wird das hier zuerst, dann `ABGLEICH_ws0-groundplane_v7.md`. Dieses Dokument führt die
Fallen, nicht die Erfolge — die Erfolge stehen im Changelog und haben niemandem geholfen.

---

## 1 · Die eine Regel

**Was sich nicht bewegt, wird einmal gezeichnet. Was sich bewegt, bekommt eine eigene Lage.**

Sie erklärt jeden Fehler dieser Sitzung. Die v6-Blase war ein einziger Verstoß dagegen: Größe, Form,
Tusche und Satz wurden jedes Bild neu erzeugt, weil sie *irgendwann* mit der Kamera zu tun haben.
Also sprangen sie mit jeder Kamerabewegung — und weil Lage, Form und Zipfel voneinander abhingen,
sprangen sie auch im Stillstand. Zehn Reparaturen an den Symptomen haben das nicht geheilt; ein
Neubau nach dieser Regel hat die Fehlerklasse **abgeschafft**, nicht behoben: es gibt keinen Neubau
mehr, der springen könnte.

In v7 heißt das konkret: die Blase (Fläche, Linie, Satz) wird bei Textwechsel **einmal** gezeichnet
und danach nur skaliert. Die Verbindung zum Kopf (Dreieck bzw. drei Kreise) ist Bewegung und liegt
deshalb in einer eigenen Lage, die jedes Bild neu gemalt wird. Gemessen über 150 Bilder Ruhe:
Kachelgröße ein Wert, Maßstab ein Wert, Blasenbreite ein Wert, Lage ein Wert, Zipfelrichtung ein
Wert, **null** Neuzeichnungen.

---

## 2 · Fünf Fallen

**Falle 1 · Das Nachmessen ist das Springen, nicht das Zeichnen.**
Symptom: die Blase wächst in Stufen, obwohl der Zoom stetig läuft. Ursache: die Schriftgröße wurde
je Bild aus der projizierten Höhe berechnet und gerundet — jede Rundungsstufe baute Form und Tusche
neu. Ein gefüllter und gestrichener Pfad kostet Bruchteile einer Millisekunde; teuer und sichtbar ist
das *Nachmessen*, nicht das Malen.

**Falle 2 · Zwei Systeme für Satz und Blase heißt zwei Versätze.**
Symptom: eine Messung sagt »sitzt«, im Bild steht der Satz neben der Blase. Ursache: die Blase lag
auf der Leinwand, der Text als HTML daneben — zwei Koordinatensysteme, zwei Rundungen, zwei
Skalierungen. Der Satz wird **mitgezeichnet** (`render()` malt ihn in denselben Pfadmittelpunkt), und
damit kann er nicht mehr wegdriften.

**Falle 3 · Der Anker am atmenden Körper ist ein Pendel.**
Symptom: die Blase wandert langsam zwischen zwei Positionen, ohne dass jemand etwas anfasst.
Ursache: der Kopfort kam aus dem Hüllkasten der **animierten** Hülle — der Ruhe-Clip hebt und senkt
sie, je Tier verschieden weit (gemessen: 7,0 px beim Hasen, 3,4 beim Pinguin). Genommen wird die
**stillstehende Wurzel** plus die gemessene Blickachse aus dem Vertrag.

**Falle 4 · Der Zipfel als zweites Dreieck ist eine Naht.**
Symptom: quer durch den Zipfelfuß läuft eine Linie, und bei Kantenwechsel klappt die Silhouette um.
Ursache: zwei Formen, zwei Konturen. Richtig ist eine Fläche mit einer umlaufenden Linie — der
Zipfel steckt **im Pfad**, im Fuß gibt es keine Linie, weil dort keine Kante ist; und die Leinwand
reserviert die Zipfellänge ringsum, damit der Kasten gleich groß bleibt, wenn die Richtung wechselt.

**Falle 5 · Der Rückfallwert ist eine Entscheidung, keine Restmenge.**
Symptom: eine zipfellose Form (`free`, vier Punkte) wird zu 78 × 1922 px und der Satz kreuzt die
Kontur. Ursache: »keine Lücke qualifiziert« landete auf dem Minimum, also *alles ist Zipfel* — drei
von vier Punkten wurden seitlich geschoben, während der Innenraum am ungeschobenen Mittelpunkt
zurückblieb. Wer einen Rückfall schreibt, muss ihn benennen können: hier heißt er *kein Zipfel*.

**Bonus, weil sie still ist:** die Leinwand misst ohne Murren die **Ausweichschrift**, wenn
Shantell Sans und Bangers noch nicht geladen sind. `await ready()` vor der ersten Messung, sonst sind
alle Maße dieser Sitzung um den Fontunterschied falsch — und zwar reproduzierbar falsch, also
glaubwürdig.

**Zwei Dinge, die keine Fehler sind:**

- **`SCRIPT failed to load` mit leerer URL** beim Laden. Es fehlt keine Datei — `support.js` und die
  zwei React-UMDs laden, der Stand ist vollständig hoch. Der Eintrag kommt aus einem dynamisch
  erzeugten Tag und steckt schon im Quellstand. Wer ihn für eine fehlende Datei hält, sucht eine
  Stunde.
- **Die Sonden heißen `gnd` · `kiss` · `scale` · `tilePx` · `k` · `builds`**, nicht `_gnd`/`_KISS`.
  Die Unterstrich-Felder existieren weiter, sind aber privat und wandern beim nächsten Fork; die
  Aliase in `componentDidMount` sind die Zusage. Liste im README.

---

## 3 · Was offen ist, in Reihenfolge

1. **Drei Rückläufer ins Repo** (Details in `ABGLEICH` §4): `ground-plane.v1.js` mit `screenTile`,
   `bubble-shaper.v3.js`, `kfb-pets.json` v1.2.7 + Skalierungs-Fix in `pet-library.v6.js`.
   Keine Bauarbeit, Schuldentilgung — kostet eine halbe Runde, verhindert eine ganze Nacht.
2. **WS0 beantwortet die drei Feldfragen** aus `ABGLEICH` §5: Stempel in einer Zone mit eigenem
   Untergrund · `screenTile` gegen die Zonenkachel · `letterShare` im Spielmaßstab.
3. **Eine Fassung von `pet-mouth.v1.js`.** Es gibt zwei Münder; v1.2.6 hat schon einmal Blattfelder
   gelöscht, weil unklar war, welcher gilt. Abnahme: `pig`/`beaver`/`bee` haben nach dem Laden
   wieder 40 bzw. 37 Blattfelder.
4. **Blasen-Bank freigeben** — Sätze je Pet hinterlegen, damit der Podcast sie zieht statt sie zu
   tippen. Die Grammatik steht und ist abgenommen.
5. **Würfel des Spiels abnehmen** (halbe `cubeH`-Kante, abgerundet, GLB-Export).
6. **Frankensteining Builder** und die »full enchilada«-Pets für Podcast v4 — beides braucht Mund
   und Bank als Grundlage.

---

## 4 · Was der Vertrag trägt

Feldnamen sind die Schnittstelle. Drei Zahlen, drei Aufgaben, nie zusammenlegen.

```js
pet.body = {
  cubeH:      0.748,   // MASSSTAB — Bühnengröße, Schattenversatz, Würfelkante
  radius:     0.31,    // TREFFERFLÄCHE — Silhouette inkl. Ohren/Flügel, auch der Stempel
  facePitch:  0.38,    // BLICKACHSE — Anteil der Höhe unter dem Scheitel: dort ist das Gesicht
  faceDir:    [0,0,1], // BLICKACHSE — wohin das Gesicht zeigt
  limits: { … }, hit: { … },
};
pet.token = { fill: 0.60 };            // wie viel der Kachel die GRUNDFORM füllt
pet.voice = { bubble: { pts, aspect }, speech: { category } };   // Form normiert, nie in Pixeln
```

Maßstab auf der Bühne, eine Zeile:

```js
k = (Kachelkante 2,0 × Füllung 0,60) / body.cubeH        // → pet.group.scale.setScalar(k)
```

Blasenmaßstab, eine Zeile — **Bezug ist die Kachel, nicht die Figur**:

```js
k = screenTile(cam, cvW, cvH, 2.0, footWorld) / 557       // × Regler »Balloon scale«
```

---

## 5 · Die Rechnungen, die man sonst neu erfindet

**Woher 557 kommt** (die Kachelbreite in Bildschirmpixeln, bei der `k = 1` gilt):

```
Letteringhöhe ≈ 8,5 %  der FIGURENhöhe        Comic-Konvention
Figurenhöhe   ≈ 0,71 × Kachel                 GEMESSEN: Pinguin 230 px bei Kachel 322 px
→ Letteringhöhe ≈ 0,085 × 0,71 = 0,061 × Kachel        (REF.letterShare)
→ Entwurfsschrift / Anteil = 34 / 0,061 = 557 px       (REF.tile)
```

`letterShare` ist **eine** Zahl für alle vier Arten, weil alle vier ihre Größe aus derselben
Entwurfsschrift ziehen. Wer die Blasen insgesamt größer oder kleiner will, dreht sie — nicht die
Entwurfsgröße, nicht die Feder, nicht die Zipfellänge.

**Standardblase** bei `k = 1`: 153 × 105 px, Schrift 34, Feder 3,4, Schatten [5, 6] hart.
Grenzen: `k` zwischen 0,22 und 2,60.

**Kennzahlen der Gegenprobe** (Kameraweg 21 Schritte, Kachel 325 → 150 px):

| | v6 | v7 |
|---|---|---|
| verschiedene Größen | 3 (Schrift 15 · 12 · 9) | 15, stetig |
| größter Sprung in einem Schritt | 25,0 % | 8,6 % (= die Kamerabewegung) |
| Blasenbreite im Bild | in drei Stufen | 226 → 105 px, monoton |
| Neuzeichnungen über 150 Bilder Ruhe | jede Kamerabewegung | 0 |

**Ruhehöhen:** Flug-Pets stehen in der Luft. Der Nullpunkt des Stempels ist die **Ruhehöhe**
(`setHover`), nicht der Boden — sonst ist der Schatten für immer mitten im Sprung.
