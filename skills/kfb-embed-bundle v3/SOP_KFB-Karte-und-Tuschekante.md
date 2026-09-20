# SOP · KFB-Karte im 3D-Raum und die Tuschekante

**Für Kolleg:innen, die eine KFB-Karte bauen oder eine bestehende reparieren.**
Stand 08.09.2026 · geschrieben aus den Fehlern von `KFB Combat Arena v3` (S11/S11b) heraus.
Zuständige Dateien und ihre Rollen stehen unten in *§1 Wer besitzt was*.

---

## 0 · Die vier Sätze, die alles tragen

1. **Die Tusche liegt auf der Bildebene, nicht in der Welt.** Eine gezeichnete Linie auf Papier hat
   überall dieselbe Feder — unabhängig von Tiefe, Winkel und Licht. Deshalb entsteht sie in 2D auf
   einem `<canvas>` und wird als Textur hochgeladen, nie als 3D-Geometrie extrudiert.
2. **Fläche und Tusche teilen EINE Kontur.** Ein Aufruf von `contour(preset, seed, W, H)`, ein
   Ergebnis, drei Verbraucher (Maske, Tuschedecal, jede zusätzliche Auflage). Zwei getrennt
   gerechnete Konturen sind zwei Kanten mit einer Lücke dazwischen — und die Lücke ist das, was man
   im Bild als hellen Faden oder als Loch sieht.
3. **Die Füllung zieht sich zurück, der Strich bleibt mittig.** Photoshop-Regel, und sie gilt in 3D
   genauso: das Papier endet ein Stück INNERHALB der Tusche, damit die Tusche seine Kante immer
   überdeckt. Wird beides an derselben Kurve abgeschnitten, entscheidet die Kantenglättung, welche
   Fläche in einem Randpixel gewinnt — mal Papier ohne Tusche (heller Faden), mal keine von beiden
   (Loch, durch das der Hintergrund scheint).
4. **Was auf der Karte liegen soll, gehört IN den Kartenknoten.** Nicht daneben mit Nachführung. Und
   was je Karte gilt, muss je Karte laufen — nicht einmal beim Boot (siehe §6, drei Fälle).

---

## 1 · Wer besitzt was

| Datei | Rolle | Anfassen? |
|---|---|---|
| `kfb-ink-canon.js` | **SSOT der Kante.** Presets, Kontur, Feder, Band-/Strich-Familie, Messung. | Nur mit Messung und Fundort |
| `cardbuilder/kfb-card-builder.js` | baut aus einer Karte (Titel/Deck/Lore/Artwork) die **Gruppe mit zwei Blättern** | ja, mit Bedacht |
| `cardbuilder/kfb-card-format.js` | Seitenverhältnis, Ränder, Typo-Maße der gedruckten Karte | selten |
| `combat-arena-v1/arena-ring.v1.js` | **Verbraucher**: setzt die Karte als Spielfeld in die Szene, verstärkt die Kante, baut die Träger | ja |
| `combat-arena-v3/zensur.v3.js` | die schwarze Zensurschicht **auf** der Karte (eigene Textur, eigene Maske) | ja |
| `combat-arena-v3/flood.v3.js` | die Darstellung dieser Schicht als fließende Tusche (GPU) | ja |

Die Gruppe, die der Builder liefert, ist stabil — darauf darf man sich verlassen:

```
group
 ├─ sheet   Mesh(PlaneGeometry(w,h))  map = Blatt (Papier + Text + Artwork) · alphaMap = Silhouette
 └─ decal   Mesh(PlaneGeometry(w,h))  map = NUR die Tusche · z = +0,02 · w/11
```

---

## 2 · Eine Karte bauen — die Reihenfolge

```js
import { createCardBuilder } from './cardbuilder/kfb-card-builder.js';
import { contour, drawInk, maskGrow, measureInk, INK_COLOR } from './kfb-ink-canon.js';

const cb = createCardBuilder({ THREE, preset: 'card', aspect: 1.79 /* aus kfb-card-format */ });
const rec = cb.newCard(index);        // liefert { group, seed, dmat, … }
scene.add(rec.group);
```

1. **Preset wählen, nicht Parameter erfinden.** `card` für alles, was eine Karte oder ein
   Comic-Panel ist. `chip` für Post-its, Buttons, HUD. Ein Preset trägt seinen Fundort im Feld
   `from` — wer ein neues braucht, schreibt den Fundort dazu oder baut kein neues.
2. **Seed festhalten.** Die Kontur ist eine Funktion von `(preset, seed, W/H)`. Derselbe Seed =
   dieselbe Kante in Maske, Decal, Zensurmaske und in jedem späteren Nachzeichnen. Ein Modul, das
   sich den Seed nicht merkt, zeichnet beim nächsten Bild eine andere Karte.
3. **Zielgröße VOR dem ersten `newCard`.** Der Builder baut sofort mit dem Vorgabewert; ein zweiter
   Aufruf danach ist eine zweite Karte, nicht eine korrigierte.
4. **Kontur EINMAL holen, mehrfach verbrauchen** (Regel 2 oben).
5. **Messen, nicht hoffen:** `measureInk(pts, W, H, 'card', seed)` → `{ featherPct, bowPct, kind, ok }`.
   Ins Protokoll damit. Eine Kante ohne Messzeile ist eine Behauptung.

---

## 3 · Die zwei Familien — und die Falle, die 3,9-fach danebenliegt

| | **BAND** (`brushLoop` + `inkRibbon2D`) | **STRICH** (`chipLoop` + `chipStroke`) |
|---|---|---|
| für | Karten, Comic-Panels | Buttons, HUD-Chips, Post-its |
| Wobble | zwei langwellige Sinus über den Umfang, an den Ecken ausgefadet | Zufallsversatz je Punkt |
| gezeichnet als | **gefülltes Band** zwischen zwei Offsetkurven, EIN `fill()` | Polylinie mit `stroke()` |
| Kante | keine AA-Risse, keine Fugen | sichtbar zackig (gewollt) |

**Eine gestrichene Polylinie mit Punktrauschen kann nie wie ein Pinselband aussehen** — egal, wie man
`jit` und `baseW` dreht. Wer an einer Kartenkante Parameter dreht und sie bleibt zackig, hat die
falsche Familie erwischt.

> ⚠ **`bow` ist eine Kennzahl, kein Nebenwert.** Kanon-Version 1 dokumentierte
> `brushLoop(…, wob = 1.4, bow = 1.4)` — die echten Aufrufstellen rufen aber `1.4 * 0.14`, also
> **bow = 0,196**. Ein Port, der die Signatur liest statt der Aufrufstelle, baucht die Kante
> siebenfach: gemessen 1,70 % statt 0,44 % Spannweite, **Faktor 3,9**. Das ist das, was als
> „Bend statt Ink" auffällt — nicht die falsche Feder, sondern eine gerade Linie, die sich krümmt.
> Deshalb hat `brushLoop` im Kanon **keine Default-Werte mehr**: die Feder kommt aus einem benannten
> Preset. **Nie eine Zahl aus einer Signatur übernehmen.**

---

## 4 · Der Kantenstapel — und wie er dicht wird

So sieht die Karte in der Arena von unten nach oben aus (alle Blätter liegen bei y = 0, die
Reihenfolge macht `renderOrder` + `polygonOffset`, **nicht** ein Höhenversatz):

| # | Blatt | Material | Wert |
|---|---|---|---|
| 1 | Rückseite | `alphaMap`, `BackSide` | `alphaTest` **0,72** |
| 2 | Papier + Artwork | `map` + `alphaMap` | `alphaTest` **0,72** |
| 3 | **Tusche** (Decal) | `alphaMap`, schwarz, keine `map` | `alphaTest` **0,28** |
| 4 | Zensurschatten | `map` (Zensurtextur), schwarz, 16 % | `polygonOffset` −2 |
| 5 | **Zensurschicht** | `map` (Zensur- oder Flood-Textur) | `polygonOffset` −4 |

**Die zwei Zahlen, die 08.09. den hellen Faden geschlossen haben:** ab Werk stehen ALLE Blätter auf
`alphaTest: 0.5` — Papier und Tusche werden also an derselben Kurve abgeschnitten (Verstoß gegen
Satz 3). Die Reparatur ist die Photoshop-Regel als Zahl: **Füllung 0,72** (die weichen Randpixel des
Papiers fallen weg, die Fläche zieht sich zurück) und **Tusche 0,28** (die Tusche reicht ein Stück
weiter nach außen). Erkannt wird die Rolle an den Materialien selbst — die Meshes tragen keine
Namen: *Tusche = schwarz und ohne `map`*.

```js
cur.traverse((o) => { if (!o.isMesh) return;
  for (const m of [].concat(o.material)) {
    if (!m || !m.alphaMap) continue;
    const istTusche = !m.map && m.color && m.color.getHex() === 0x000000;
    m.alphaTest = istTusche ? 0.28 : 0.72; m.needsUpdate = true;
  }
});
```

**Warum kein Höhenversatz für Auflagen.** Eine Schicht 0,02 u über dem Papier verschiebt sich bei
37° Kameraneigung um 0,02 × tan 53° ≈ **0,027 u** gegen das Blatt — an der abgewandten Kante schaut
Papier hervor. Das ist Parallaxe, keine Rechenlücke. Auflagen liegen deshalb **auf y = 0** und
bekommen ihren Vortritt aus `polygonOffset` (Tiefenprüfung statt Raumversatz): kein Versatz, kein
Z-Fighting.

**Und `maskGrow`.** Der Builder wächst die Maske um `maskGrow(...) * 1.6` nach außen. Der Kanon sagt
„höchstens die KLEINSTE vorkommende Halbbreite" — 1,6 ist mehr als das, also kann die Fläche an den
dünnen Stellen der Feder über die Linie blitzen. Solange der Faktor drinsteht, ist `alphaTest` 0,72
die Gegenrechnung. Wer den Faktor auf 1,0 zieht, prüft danach beide Kanten **am Bild bei flachem
Blickwinkel** — dort tritt es auf, nicht in der Draufsicht.

---

## 5 · Eine Schicht AUF die Karte legen (Zensur, Heilung, Blumenweg, Decals)

Fünf Regeln, alle aus Fehlern:

1. **Kind des Kartenknotens**, nicht der Szene. Die Karte atmet (Hub 0,035 u); eine Schicht, die
   ihre Höhe je Bild nachführt, zählt den Hub doppelt und liegt die halbe Periode unter dem Papier.
2. **Denselben Kartenknoten prüfen, jedes Bild.** Der Ring ersetzt seinen Knoten auch von sich aus
   (Artwork-Timeout → nächste Karte). Ein `parent !== ring.current` heißt: umhängen, Kontur neu
   bauen, Blatt wischen.
3. **Dieselbe Kontur als Maske.** `cb.ink.contour(preset, rec.seed, W, H)` in ein `Path2D`, damit
   `clip()`. Ohne Maske hängen Kleckse am Rand über das Blatt hinaus in die Luft.
4. **Für GPU-Schichten die Maske als Textur** (ein Shader kennt kein `clip()`) — und sie eine
   Haarbreite größer als die Kontur, sonst frisst ihre eigene Kantenglättung an der Blattkante ein
   paar Prozent Deckung: der helle Faden ist zurück.
5. **`toneMapped: false`, `depthWrite: false`, `anisotropy` aus dem Ring.** Tusche ist Druck, kein
   Licht: sie darf nicht mit dem Tone-Mapping der Szene aufhellen.

---

## 6 · Die drei Fälle derselben Lehre — bitte lesen, bevor du etwas „einmal" setzt

> **Eine Regel, die je Karte gilt, darf nicht einmal beim Boot laufen.**

| Fall | Symptom | Ursache |
|---|---|---|
| Größenachse der Gegner | „nach Reload wieder brauner zu klein…?" | Achse lief nur einmal nach dem Boot, jeder Respawn setzte Rohgrößen |
| Zensurschicht | Deckung 100 %, Karte im Bild blitzsauber | Schicht hing am ersetzten (weggeworfenen) Kartenknoten |
| Kante (`alphaTest`) | heller Faden und Löcher an der Outline | Fix lief beim Boot auf einer Karte, die der Ring danach ersetzt hat |

Reparaturmuster in allen drei Fällen: **Identität prüfen, nicht Ereignis abwarten.** Ein
uuid-Vergleich je Bild kostet nichts.

---

## 7 · Abnahme-Checkliste (SOP)

Am Bild, bei **flachem** Blickwinkel (nicht in der Draufsicht — der Fehler versteckt sich dort):

- [ ] `measureInk(...)` läuft und meldet `ok: true`, `kind` = erwartete Familie, `bowPct` ≈ 0,4 %
      für `card` (nicht 1,7 % — das ist der bow-Portierfehler).
- [ ] **Kein heller Faden** zwischen Karte und Hintergrund, an allen vier Kanten und in den Ecken.
- [ ] **Keine Löcher**, durch die der Hintergrund scheint (Diagonalen zuerst prüfen).
- [ ] Maske, Decal und alle Auflagen tragen **dieselbe** `seed`-Kontur (ein Protokolleintrag mit
      Seed und Punktzahl je Verbraucher).
- [ ] Auflagen liegen auf y = 0 mit `polygonOffset`, **nicht** auf einem Höhenversatz.
- [ ] `alphaTest`: Füllung 0,72 · Tusche 0,28 — und es läuft **je Karte**, nachweisbar über einen
      Kartenwechsel hinweg.
- [ ] Nach einem Kartenwechsel: Auflagen hängen am neuen Knoten (`parent === ring.current`) und
      sind gewischt.
- [ ] Kante bei 390 px Fensterbreite und bei 2× Pixeldichte angesehen (Mip-Stufen ändern die
      Kantenglättung — dort kommt der Faden zurück, wenn `alphaTest` zu niedrig ist).

## 8 · Rückwege

| Änderung | Rückweg |
|---|---|
| `alphaTest` 0,72/0,28 | `kanteSchliessen()` nicht rufen → überall 0,5 |
| `polygonOffset` an den Auflagen | `hoehe` zurück auf 0,02 und die drei Zeilen löschen |
| verstärkte Kante | `ring.inkGain = 1` (1 = die Karte, wie der Builder sie zeichnet) |
| Zensur/Flood | `zensurAn = false` bzw. `floodAn = false` — die Karte bleibt, die Schicht schweigt |

## 9 · Wo die Zahlen herkommen

Alle Werte in diesem Dokument sind gemessen, nicht gewählt: Kartenknoten-Materialien und ihre
`alphaTest`-Werte (08.09.2026, drei alphaMap-Materialien je Karte), Parallaxe 0,02 u × tan 53°,
bow-Spannweite 1,70 % gegen 0,44 % (`KFB Tusche-Messung.dc.html`, 25.07.2026), `maskGrow`-Faktor 1,6
(`kfb-card-builder.js`, `maskTexture`). Wer einen Wert ändert, ersetzt die Messung — nicht den Satz
darüber.
