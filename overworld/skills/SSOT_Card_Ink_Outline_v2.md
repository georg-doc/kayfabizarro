# SSOT — Card Ink-Outline · **Kanon-Version 2**

> **Additiv zu Version 1** (`SSOT_Card_Ink_Outline.md`). Nichts aus v1 ist zurückgenommen. Neu ist,
> was v1 offen ließ: eine **vierte Kennzahl**, die **Presets als benannte Varianten**, und eine
> **Referenz-Implementierung**, auf die dieses Dokument zeigt, statt Code in Prosa zu beschreiben.
>
> **Stand:** 2026-07-25 · **Anlass:** gemessen in `KFB Tusche-Messung.dc.html`, Befund „Bend statt
> ink" · **Status:** Vorschlag zur Abstimmung mit dem Coworker (§9)

---

## 0 · Was v2 ändert, in drei Sätzen

1. **`bow` ist eine Pflicht-Kennzahl geworden**, nicht nur ein Wert im Fließtext. v1 dokumentierte
   die Signatur `brushLoop(…, wob = 1.4, bow = 1.4)`; v11 ruft aber überall `1.4 * 0.14` = **0,196**.
   Ein Port, der die Signatur liest statt der Aufrufstelle, baucht die Kante siebenfach.
2. **Die Varianten heißen jetzt.** Statt „für Karten nimm die andere Familie" gibt es vier benannte
   Presets mit Fundort, Geltungsbereich und `deprecated`-Flag (§4).
3. **Der Kanon ist Code, nicht Prosa.** `cardbuilder/kfb-ink-canon.js` ist die
   Referenz-Implementierung; dieses Dokument erklärt sie und nennt die Abnahmezahlen.

---

## 1 · Die EINE Regel (unverändert aus v1)

**Die Tusche liegt auf der BILDEBENE, nicht in der Welt.** Eine gezeichnete Linie auf Papier hat
überall dieselbe Feder — unabhängig von Tiefe, Winkel und Licht.

---

## 2 · Zwei Familien, und sie sind nicht austauschbar

| | **BAND** — `brushLoop` + `inkRibbon2D` | **STRICH** — `chipLoop` + `chipStroke` |
|---|---|---|
| Wobble | zwei langwellige Sinus über den Umfang (3–5 und 6–9 Perioden), an den Ecken ausgefadet | per-Punkt-Zufallsversatz, x und y **unabhängig** |
| Zeichnung | gefülltes Band zwischen zwei Offsetkurven, **ein `fill()`** | gestrichene Polylinie |
| Breite | `hb = 0.0069 · min(W,H)`, Taper 0,85, diagonaler Gradient `edge` 1,05 | `baseW`, moduliert von `wob` |
| **Gilt für** | **Karten · Comic-Panels** | **Post-its · Buttons · HUD-Chips · DOM-Chips** |

**Eine gestrichene Polylinie mit Punktrauschen kann nie wie ein Pinselband aussehen** — egal, wie
man `jit` und `baseW` dreht. Wer an einer Kartenkante Parameter dreht und sie bleibt zackig, hat
die falsche Familie erwischt.

---

## 3 · Die vier Kennzahlen (die Prüfliste)

Alle vier werden **aus der Punktliste gerechnet**, nicht am Parameter abgelesen — `bow` und `jit`
wirken absolut in Pixeln des Baurahmens und sind erst nach der Normalisierung vergleichbar.
`measureInk(pts, W, H, preset, seed)` liefert sie.

> **Die Schwellen hängen daran, WAS gezeichnet wird, nicht WIE.** Jedes Preset trägt dafür ein
> `for: 'card' | 'chip'` neben seiner `family`. Ein Satz Schwellen für alles war der erste Anlauf
> — und damit fiel das Preset `chip` durch die eigene Prüfung: 0,5 % Bauchung ist eine
> **Karten**-Zahl, und bei einem Post-it IST der Punkt-Jitter der Wobble. Dieselbe Klasse, die
> dieses Dokument anprangert: eine Kennzahl mit einem Namen und zwei Bedeutungen.

### Für `for: 'card'` (Karten, Comic-Panels)

| # | Kennzahl | Definition | Kanon |
|---|---|---|---|
| 1 | **Familie** | Band oder Strich | **Band** — sonst ist alles Weitere gegenstandslos |
| 2 | **Stützpunkte / lange Kante** | Punkte, die der langen Sollkante am nächsten liegen | *formneutral* — die Wobble-Form hängt am Umfang, nicht an der Punktzahl |
| 3 | **Federbreite** | mittlere Bandbreite in **% von `min(W,H)`** · auflösungs­invariant (`hb` ist relativ) | **1,2 – 1,8 %** (v11: 1,40 %) |
| 4 | **Bauchung** | Spannweite der Kontur **quer zur Kante**, gegen den **Extrempunkt-Rahmen** der Punktliste, in % der Breite | **≤ 0,5 %** (v11: 0,44 %) |

### Für `for: 'chip'` (Post-its, Buttons, HUD-Chips)

| # | Kennzahl | Definition | Kanon |
|---|---|---|---|
| 1 | **Familie** | Band oder Strich | **Strich** |
| 2 | **Stützpunkte / lange Kante** | wie oben | **≤ 12** — mehr liest als „torn" (SSOT v1, §Auflösungs-Invariante) |
| 3 | Federbreite | `baseW · W/refW` — **nicht auflösungsinvariant** | **wird nicht gegen eine Schwelle geprüft.** Die Zahl hängt an der Messauflösung des Aufrufers, nicht an der gezeichneten Kante. `measureInk` markiert sie mit `featherResolutionBound` |
| 4 | Bauchung | wie oben | **wird nicht geprüft.** Bei der Strich-Familie IST der Versatz der Wobble — Spannweite ist dort erwartet, kein Fehler |

`measureInk` liefert `checked: [...]` — die Liste dessen, was für diese Absicht tatsächlich geprüft
wurde. Ein „ok" behauptet damit nicht mehr, als gemessen wurde.

**Warum der Extrempunkt-Rahmen und nicht die Sollkante:** die Kennzahl muss allein aus der Kontur
prüfbar sein. Wer eine fremde Kartenkante nachmisst, kennt weder den Inset `m` noch den Baurahmen.
Gegen die Sollkante gerechnet ist dieselbe Kontur systematisch kleiner (v11 0,29 % statt 0,44 %) —
**beide Lesarten sind richtig, aber nur eine darf in der Prüfliste stehen.**

**Warum `min(W,H)` und nicht die Breite:** die 1,6 % aus v1 gehören der **Chip**-Familie und
beziehen sich auf die Breite. `inkTail` bemisst sich an der kleineren Seite. Gegen den falschen
Nenner geprüft fällt v11 selbst durch.

**Streuung über die Seeds** (40 Seeds, Preset `card`): Bauchung 0,23 – 0,39 %, Median 0,32 %,
**0 von 40 über der Schwelle**. Zum Vergleich `academy-2026-07`: 0,85 – 1,75 %, **40 von 40 drüber**.
Die Schwelle 0,5 % trennt also sauber und hat Luft.

**Und `sky-2026-07` fällt nicht über eine Zahl, sondern über die Familie:** `for: 'card'` bei
`family: 'stroke'`. Die Prüfung meldet deshalb „falsche Familie — Strich statt Band", nicht eine
Bauchung über der Schwelle. Der Befund muss den Fehler nennen, den man beheben soll.

---

## 4 · Die Presets — Varianten, benannt und abgegrenzt

Definiert in `cardbuilder/kfb-ink-canon.js` als `INK_PRESETS`. Jedes Preset trägt `use` (wofür es
gilt) und `from` (woher seine Zahlen stammen). **Ein Preset ohne Fundort gibt es nicht.**

| Preset | Familie | `for` | gilt für | Kernzahlen | Status |
|---|---|---|---|---|---|
| **`card`** | Band | card | Spielkarten · Lektionskarten · Comic-Panels | `wob 1.4` · **`bow 0.196`** · Schritt 22 · `hb 0.0069` · Taper 0,85 · Edge 1,05 · Ref 1024 · `m 14` | **Kanon** |
| **`chip`** | Strich | chip | Post-its · Buttons · HUD-Chips | `jit 1.6` · `baseW 4` · `wob 0.5` · Schritt 34 · Ref 256 · `m 10` | **Kanon** |
| `academy-2026-07` | Band | card | — | wie `card`, aber `bow 1.4` | **deprecated** · fällt über die **Bauchung** |
| `sky-2026-07` | Strich | card | — | `jit 4` · `baseW 7` · **Jitter diagonal** | **deprecated** · fällt über die **Familie** |

`family` sagt, WIE gezeichnet wird, `for` sagt, WAS gezeichnet wird — und `for` wählt die
Schwellen (§3). Bei `sky-2026-07` gehen die beiden auseinander, und genau das ist der Befund.

Die beiden `deprecated`-Presets sind der **gemessene Ist-Stand** von KFB Travel v10 (Stand
2026-07-25). Sie stehen im Code, damit man den Fehler im Vergleich SEHEN kann — nicht, um ihn zu
bauen. Wer sie in einer Szene benutzt, tut es gegen eine ausdrückliche Warnung.

---

## 5 · Der Befund, der zu v2 geführt hat

Gemessen mit `KFB Tusche-Messung.dc.html` (rechnet aus den echten Punktlisten, v11 als Maßstab):

| | v11 (Maßstab) | Akademie v10 | Sky v10 | `card` nach Korrektur |
|---|---|---|---|---|
| Stützpunkte / lange Kante | 31 | 44 | 20 | 44 |
| Federbreite (% von min(B,H)) | 1,40 % | 1,40 % | 1,74 % | 1,40 % |
| Familie | Band | Band | **Strich** | Band |
| **Bauchung** | **0,44 %** | **1,70 % (×3,9)** | 1,00 % | **0,38 %** |

**Die drei Kennzahlen aus v1 sagten dreimal „gleich" — und der Unterschied war trotzdem sofort
sichtbar.** Also messen sie ihn nicht. Er steckt in `bow`: die Akademie setzt `INK_BOW = 1.4` mit
dem Kommentar „Kanon aus v11: wobble 1.4". Das stimmt für `wob` und ist für `bow` falsch — **v11
hat nie 1,4 gebaucht.** Das ist „Bend statt ink": nicht die falsche Feder, sondern eine gerade
Linie, die sich krümmt.

Sky ist der andere Fall und der gröbere: falsche Familie, Feder ×1,2, und der Jitter wird auf x
**und** y mit **derselben** Zahl addiert — die Kante zittert diagonal statt in zwei Achsen.

### Zwei Fehlerklassen fürs Register

1. **Eine Kennzahlenliste, die den sichtbaren Unterschied nicht enthält, bestätigt den Fehler.**
   `bow` stand in v1 als **Wert**, aber nicht als **Prüfzahl** — und was nicht in der Prüfliste
   steht, wird beim Portieren zum Default.
2. **Zwei Kennzahlen mit demselben Namen und verschiedenem Nenner.** Die 1,6 % Federbreite (Chip,
   auf Breite) gegen 1,38 % (Band, auf `min(W,H)`). Der erste Anlauf des Messblatts flaggte damit
   **v11 selbst** als „ab" — *ein Maßstab, der durchfällt, ist keiner.* Dieselbe Klasse hat danach
   die neue Bauchungs-Kennzahl erwischt (Definition „Sollkante" gegen Messung „Extrempunkt-Rahmen").

---

## 6 · Referenz-Implementierung

```
cardbuilder/kfb-ink-canon.js     die Feder. Kein three.js, kein DOM außer <canvas>.
                                 INK_PRESETS · contour · drawInk · maskGrow · measureInk
cardbuilder/kfb-card-builder.js  die ganze Karte: Repo-Registry → PDF-Seite → 2×2-Quadrant →
                                 Blatt → Silhouette → Decal → THREE.Group
```

Minimale Kante:

```js
import { contour, drawInk, measureInk } from './kfb-ink-canon.js';
const pts = contour('card', seed, W, H);      // normalisiert gebaut, dann skaliert
drawInk('card', g, pts, W, H, seed);          // das Band, ein fill()
measureInk(pts, W, H, 'card', seed);          // → { kind, points, featherPct, bowPct, ok, why }
```

Ganze Karte in einer Szene:

```js
import { createCardBuilder } from './kfb-card-builder.js';
const cb = createCardBuilder({ THREE });
const pool = await cb.pool();                 // alle Decks aus dem Repo, gemischt
const c = cb.make(pool[0], { width: 11 });    // Textblatt sofort, Artwork schiebt sich nach
scene.add(c.group);
```

Schaufenster und Abnahme: `KFB CardBuilder.dc.html` (echte Karten, Preset-Umschalter, Live-Messung).

---

## 7 · Was der Builder mitbringt (und was mit Absicht nicht)

**Mitbringen:** Deck-Registry (`kfb-deck-registry/v2`, RAW-first mit lokalem Fallback), PDF-Rendern
über pdf.js mit **einem** Job zur Zeit und Tab-Watchdog, 2×2-Quadranten-Crop nach `cardMapping`,
Textblatt als Sofortzustand, Silhouette als `alphaMap` + `alphaTest`, Tusche als eigenes Quad
davor, geteilte Kanten-Texturen (vier Seeds für beliebig viele Karten), `setSurface()` für
Live-Render/Video/Foto, `measure()` pro Karte.

**Nicht mitbringen:** Layout, Animation, Physik, Kamera, Interaktion. Der Builder liefert eine
`THREE.Group` mit stabilem Aufbau (`group → sheet, decal`) und hört danach auf.

---

## 8 · Weiter gültig aus v1 (nicht kopiert, nur benannt)

- **§Auflösungs-Invariante** — Kontur einmal im Referenzrahmen bauen, normalisieren, nur skalieren.
  Für die Band-Familie erledigt sich das Frequenz-Problem von selbst; für Chips gilt es unverändert.
- **§Tusche über Render-Texturen** — Silhouette als `alphaMap` + `alphaTest ~0.5`, Tusche als
  eigenes Quad, **eine gemeinsame Kontur**, Maske höchstens um die kleinste Halbbreite aufweiten.
- **§Beobachtete Fehler** — doppelte Outlines, lichtabhängige Dicke (v6-Erbe), `inked` mit
  `topW`/`botW` gemischt, Kontur pro Auflösung neu gerechnet.

---

## 9 · Zur Abstimmung mit dem Coworker

**Zustimmung erbeten zu:**

1. **`bow = 0,196` als Kanon** und als vierte Pflicht-Kennzahl (Schwelle 0,5 %, Definition
   Extrempunkt-Rahmen). — *Rückfrage: ist 0,5 % die Schwelle, die du auch für die Panels im
   Card-Viewer setzen würdest, oder brauchen große Panels mehr Luft?*
2. **Federbreite auf `min(W,H)` beziehen** und die 1,6 % aus v1 ausdrücklich der Chip-Familie
   zuschlagen. — *Rückfrage: gibt es einen Ort, an dem 1,6 % auf die Breite gemeint war und
   stimmt?*
3. **Presets statt Parameter** in neuen Aufrufstellen (`contour('card', …)` statt
   `brushLoop(…, 1.4, 0.196)`). Die alten Signaturen bleiben, aber ohne Defaults.
4. **`cardbuilder/` als gemeinsame Quelle** für Zone-Builder, Tisch, Diorama und Travel — statt
   drei Kopien der Crop- und Kanten-Logik.

**Offen, noch nicht entschieden:**

- **`cardGrid` ins Deck-Manifest** (neu, mit Befund). Der Crop von v11 und `card-registry.js`
  schneidet die PDF-Seite blind in Viertel — das setzt voraus, dass die **Seite das Raster IST.**
  Gemessen ist sie das nicht: `forget_utopia` S. 3 hat das Raster bei x 30…569 von 600 und die
  Zeilentrennung bei **0,466·H statt 0,5·H**; `ignore_dystopia` hat zusätzlich ein **Kopfband**
  über dem Raster — der TL-Schnitt fängt dort die Seitenüberschrift und schneidet die Karte unten
  ab (reproduzierbar bei Karte 45, „The Surrendered Wheel"; Beleg
  `screenshots/probe-page13.png`). **Das betrifft KFB Travel heute**, nicht nur den Builder.
  Vorschlag: `index.json` bekommt pro Deck ein `cardGrid: { x, y, w, h }` in Seitenbruchteilen —
  Deck-Geometrie gehört ins Manifest, nicht in vier Kopien der Crop-Logik. Der Builder liest es
  bereits (`deck.cardGrid`, sonst Parameter, sonst ganze Seite = heutiger Stand).
  *Braucht dich: die Zahlen pro Deck. Automatisch messen scheitert an der handgezeichneten
  Tuschekante — die Rasterlinien sind keine geraden dunklen Zeilen.*
- Ob `terrain-v10` sofort auf `cardbuilder/` umzieht oder erst nach der v10-Journey. Der Eingriff
  selbst ist klein (`INK_BOW` → 0,196; Sky-Karten auf `contour('card', …)`), der Umzug der ganzen
  Karten-Pipeline ist es nicht.
- Ob das Textblatt (§7) Kanon wird oder eine Builder-Eigenheit bleibt. Es ist heute die einzige
  Stelle, an der eine Karte ohne Artwork trotzdem spielbar aussieht.
- Rückseiten: der Builder malt heute nur die Vorderseite. `media/kfb/` hat eine Rückseite —
  gehört sie ins Preset oder in die Szene?

---

## 10 · Wo v2 gilt

Karten-Panels im Card-Viewer · die Tuschekante des Flug-Card-Carriers · die Academy-/Lektionskarten
in KFB Travel · die Sky-Karten (nach dem Umzug) · der Zone-Builder · jede Karten-Optik.
**Die Karte ist ein Comic-Panel, kein Brett.**


---

## §10 Die Schattenseite: Bedeutung, dann Streuung (Nachtrag 2026-08-08)

`edge` (Kanon 1,05) beschwert die Feder **unten rechts** — oben links 0,475, unten rechts 1,525.
**Das ist ein Code, kein Nebeneffekt:** dick = Schattenseite, dünn = Lichtseite. So bildet die Linie
den comic-typischen Übergang von Strich zu Form ab (Georg, 8.8.). Dieselbe Logik trägt die
Terrain-Kontur: Licht dünn oder farbig, Schatten dick. **Die Richtung wird nicht gedreht.**

Der Fehler war die **Gleichförmigkeit**. Der Gradient ist ungesät, also lag die dickste Stelle an 13
gemessenen HUD-Flächen auf **12 von 13** an derselben Stelle, mit demselben Verhältnis — oben links
durchweg ~2,5 px, unten rechts 2,5–6,5 px. Ein Stapel von Hand getuschter Blätter hat dieselbe
Lichtquelle, aber nicht dieselbe Winkelmessung.

    drawInk('card', g, pts, W, H, seed, gain, { edgeJitter: 0.70, edgeGain: 0.62 })

- **`edgeJitter`** (Radiant) streut die Achse **um** die Kanon-Richtung (54,1°) — dieselbe Seite,
  anderer Winkel. 0,70 rad ≈ ±40°.
- **`edgeGain`** nimmt die Ausprägung zurück, ohne sie aufzugeben.

Beides normiert die Gewichte weiter auf |cx|+|cy| = 1 (der Kanon hat 0,42+0,58 = 1) und zentriert um
die eigene Mitte statt um die feste 0,5 — die Spanne der Modulation bleibt rechnerisch dieselbe.

**Wann was gilt:**
- **Ohne beides** — jede Karte, jedes Comic-Panel, jede Lektionskarte. Zeile für Zeile wie vorher.
- **Mit beidem** — Flächen, die zu **vielen** gleichzeitig auftreten: HUD-Panels, Fenster, Chips,
  Kartenrücken im Stapel.

**Gemessen, bei Kartengröße** (900×560, groß genug dass `minHalf` nicht klemmt) — Halbbreiten an den
Ecken:

    ohne opt   ol 2,54 · or 4,23 · ul 5,27 · ur 7,05   Achse 54,1°   ur/ol = 2,78×
    mit  opt   ol 3,42 · or 4,66 · ul 4,84 · ur 6,17   Achse 45,0°   ur/ol = 1,80×

**Grenze der Wirkung, ehrlich:** bei kleiner absoluter Federbreite (HUD mit `penPx 2,1`) liegt die
Halbbreite nahe `minHalf: 1,2`. Die Untergrenze schneidet die dünne Seite ab, und die Streuung
verschwindet im Rauschen — an 12 HUD-Flächen war das Ergebnis mit und ohne Optionen **identisch**
(Schattenseite dicker auf 11 von 12, Verhältnis 1,00–1,71). `edgeJitter` ist dort eine Vorsichtsmaßnahme
für später, kein sichtbarer Unterschied heute. Wer sie sehen will, muss `minHalf` senken — ungemessen,
ob die Kante das trägt.

### Zwei Fallen, die beim Einbau bezahlt wurden (8.8.)

1. **Der Kanon wird über `OW_SRC` von pages.dev geladen, nicht aus `cardbuilder/`.** Eine lokale
   Änderung wirkt also **nicht**, und `drawInk` ohne 8. Argument verwirft `opt` **stillschweigend** —
   kein Fehler, keine Warnung, nur die alte Kante. Wer hier etwas ändert, muss die Ladekette prüfen
   und **auf Fähigkeit gaten**: `drawInk.length >= 8`.
2. **Der Merker gehört nicht ans Modul.** `INK.__canOpt = …` wirft `read-only` (ein
   ES-Modul-Namensraum ist eingefroren) — der Versuch, die Fähigkeit zu merken, schaltete sie aus.

**Verworfen: `edgeSpin`** (freie Rotation aus dem Seed, 8.8. eingebaut und am selben Tag zurückgebaut).
Es entfernte die Gleichförmigkeit, indem es die Bedeutung entfernte — aus einem Beleuchtungsmodell
wurde Rauschen.

**Zweite Zahl, die dazugehört:** `hb` ist relativ zu `min(W,H)`. Auf einer großen Fläche wird die
Feder deshalb absolut fett — bei einem 720-px-Fenster 5,0 px Halbbreite, unten rechts 7,6 px, also ein
15-px-Band. **Ein Fenster ist keine Karte.** Wer eine absolute Federbreite braucht, rechnet den Gain
zurück: `gain = penPx / (min(W,H) · hb)` (in `hud-v7.js` als `penPx` implementiert, Fenster 2,1 px).

### Offen: zwei Beleuchtungen in einem Bild
Die UI-Feder beschwert rechts/unten, die **Terrain-Schattenlogik läuft oben/unten**. Georg hat das am
8.8. benannt; ungemessen, welche näher am Kanon liegt. Gehört entschieden, bevor die nächste
Bodenschicht darauf aufbaut.


---

## 10 · Nachtrag 2026-08-09 — die gestrichelte Feder (`card-dash`)

Neue Familie **`band-dash`**, neues Preset **`card-dash`**. Sie ist **kein** eigener Zug: Kontur,
Halbbreitenfunktion, Bauchung und Schattenachse sind unverändert die von `card`. Unterbrochen wird
erst beim Zeichnen, **entlang der Lauflänge** — nicht durch Filtern der Stützpunkte (das gäbe
Stummel dort, wo zufällig ein Punkt liegt).

**Die vier Kennzahlen** (zusätzlich zu denen von `card`):

| Zahl | Bedeutung | Kanon |
|---|---|---|
| `dash` | Strichlänge, relativ zu min(W,H) | 0,075 |
| `gap` | Lückenlänge, relativ zu min(W,H) | 0,045 |
| `shoulder` | Anteil des Strichs, über den die Feder zu null ausläuft (0 = Stummel) | 0,34 |
| `phase` | seed-gestreuter Startversatz im Muster | 0,5 |

Dazu `dashLight` (0,18): die Lichtlogik moduliert die **Farbe** an der Sonnenseite, nie die Breite.

**Abnahme:** Bauchung und Feder müssen **identisch zur vollen Kante** sein (gemessen 0,28 % und
1,4 %) — sonst ist es nicht dieselbe Feder. Dazu `dutyPct` 50–75 (Tintenanteil; darunter zerfällt
die Kante, darüber liest sie als durchgezogen) und zehn bis fünfzehn Striche **je Kante**.

**Zwei Fallen, beide bezahlt:**
1. `dash`/`gap` in Pixeln statt relativ — dann hängt das Muster an der Auflösung des Zeichnenden.
2. `INK_CHECK` wird über `preset.for` nachgeschlagen; ein eigener Eintrag unter dem **Presetnamen**
   wird ohne Vorrang nie erreicht. *Ein Prüfsatz, den niemand nachschlägt, prüft nichts.*
