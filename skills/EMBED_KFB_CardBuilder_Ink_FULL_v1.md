# EMBED — KFB CardBuilder · PDF-Viewer · Ink-Outline (Full, stand-alone)

**Version 1 · Stand 2026-08-06 · konsolidiert aus `SSOT_KFB_CardBuilder_PDF.md` + `SSOT_Card_Ink_Outline_v2.md` + den drei Referenz-Modulen.**

> **Zweck:** Wer eine KFB-Cut-&-Play-Karte in 3D bauen, eine PDF-Karte schneiden oder die KFB-Tuschekante zeichnen will, liest **dieses eine Dokument** und muss **nichts nachfragen**. Für jeden frischen Chat / jedes LLM / jeden Use-Case gedacht.
>
> **Die Grundregel über allem:** **Fork/reuse die drei Referenz-Module — baue nichts nach.** Es gibt eine Messvorschrift (`measureInk`), mit der sich „richtig" beweisen lässt, statt darüber zu diskutieren.

---

## 0 · Der Kanon-Code (das hier ist die Wahrheit, nicht dieses Doc)

GitHub `georg-doc/kayfabizarro`, Ordner `skills/`:

| Datei | Rolle |
|---|---|
| `skills/kfb-card-builder.js` | die ganze Karte: Repo-Registry → PDF-Seite → Crop → Blatt → Silhouette → Decal → `THREE.Group` |
| `skills/kfb-ink-canon.js` | die Feder: `INK_PRESETS`, `contour`, `drawInk`, `maskGrow`, `measureInk`. Kein three.js, kein DOM außer `<canvas>` |
| `skills/kfb-card-format.js` | das Sollformat: `CARD_AR`, `fitCell`, `coverLoss` |

RAW-Basis: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/`
Deck-Manifest (Wahrheit über Decks): `media/kfb/index.json`
PDF-Engine: pdf.js `4.7.76` via jsdelivr (im Builder verdrahtet).

**Regel:** Wer eine Karte oder Kante anders baut, baut sie falsch. `measureInk` weist es nach.

---

## 1 · 30-Sekunden-Anleitung (der Normalfall)

```js
import { createCardBuilder } from './kfb-card-builder.js';
const cb   = createCardBuilder({ THREE });
const pool = await cb.pool();                  // alle Karten aller Decks, gemischt
const card = cb.make(pool[0], { width: 11 });  // SOFORT: Textblatt; Artwork schiebt sich selbst nach
scene.add(card.group);                         // fertig
```

**Pipeline:** Deck-Registry (Repo) → PDF-Seite rendern → Quadrant nach `cardGrid` schneiden → Blatt malen → Silhouette stanzen → kanonische Tusche als Decal davor.

Der Builder liefert eine `THREE.Group` und **hört auf** — kein Layout, keine Animation, keine Kamera, keine Physik. Das gehört der Szene.

**Stabiler Gruppen-Aufbau (darauf ist Verlass):**
```
group
 ├─ sheet   Mesh(PlaneGeometry(w,h)) · map = Blatt · alphaMap = Silhouette · alphaTest 0.5
 └─ decal   Mesh(PlaneGeometry(w,h)) · map = nur Tusche · z = +0.02·w/11 · renderOrder 1
```

---

## 2 · Die INK-Outline — der volle Kanon (Version 2)

### 2.1 · Die EINE Regel
**Die Tusche liegt auf der BILDEBENE, nicht in der Welt.** Eine gezeichnete Linie auf Papier hat überall dieselbe Feder — unabhängig von Tiefe, Winkel und Licht. (Tusche entsteht in 2D-Canvas, wird als Textur/Decal hochgeladen.)

### 2.2 · Zwei Familien, NICHT austauschbar

| | **BAND** — `brushLoop` + `inkRibbon2D` | **STRICH** — `chipLoop` + `chipStroke` |
|---|---|---|
| Wobble | zwei langwellige Sinus über den Umfang, an den Ecken ausgefadet | per-Punkt-Zufallsversatz, x und y **unabhängig** |
| Zeichnung | gefülltes Band zwischen zwei Offsetkurven, **ein `fill()`** (keine AA-Risse, keine Fugen) | gestrichene Polylinie |
| **Gilt für** | **KARTEN · Comic-Panels** | Post-its · Buttons · HUD-Chips · DOM-Chips |

**Eine gestrichene Polylinie mit Punktrauschen kann nie wie ein Pinselband aussehen.** Wer an einer Kartenkante Parameter dreht und sie bleibt zackig, hat die **falsche Familie** erwischt — nicht den falschen Wert.

### 2.3 · `bow` ist eine Kennzahl (der Kern-Befund von v2)
v11 zeichnet die Kartenkante mit **`bow ≈ 0,196`** (`1.4 * 0.14`). Die alte Signatur `brushLoop(…, wob=1.4, bow=1.4)` verführt dazu, `1.4` zu lesen — das **baucht die Kante ~7×** (1,70 % statt 0,44 % Spannweite). Das ist **„Bend statt ink"**: nicht die falsche Feder, sondern eine gerade Linie, die sich krümmt. Deshalb: **keine Default-Werte in der Signatur — die Feder kommt aus einem benannten Preset.**

### 2.4 · Die Presets (aus `kfb-ink-canon.js` · `INK_PRESETS`)

| Preset | Familie | `for` | Kernzahlen | Status |
|---|---|---|---|---|
| **`card`** | Band | card | step 22 · wob 1.4 · **bow 0.196** · hb 0.0069 · taper 0.85 · edge 1.05 · refW 1024 · margin 14 · Farbe `#1f1a14` | **KANON** (Karten, Lektionskarten, Comic-Panels) |
| **`chip`** | Strich | chip | step 34 · jit 1.6 · baseW 4 · wobW 0.5 · refW 256 · margin 10 · Farbe `#191410` | **KANON** (Post-its, Buttons, HUD) |
| `academy-2026-07` | Band | card | wie `card`, aber **bow 1.4** | **DEPRECATED** — „bent", fällt über die Bauchung |
| `sky-2026-07` | Strich | card | jit 4 · baseW 7 · **diagonalJitter** | **DEPRECATED** — „torn/zackig", fällt über die Familie |

> Die zwei `deprecated`-Presets sind der **gemessene Fehlstand** (KFB Travel v10). Sie stehen im Code, damit man „bent" und „torn" im Vergleich **sieht** — **nie zum Bauen.** `diagonalJitter` ist ausdrücklich ein **Fehler, kein Stil** (dieselbe Zahl auf x und y → die Kante zittert diagonal).

### 2.5 · Die Abnahme (`measureInk`, Schwellen aus `INK_CHECK`)
`measureInk(pts, W, H, 'card', seed)` → `{ kind, points, featherPct, bowPct, checked, ok, why }`. Geprüft wird gegen den Satz zu `preset.for` — **was** gezeichnet wird, wählt die Schwellen, nicht **wie**:

- **`for:'card'`:** Familie = **Band** · Bauchung **≤ 0,5 %** (quer zur Kante, gegen den Extrempunkt-Rahmen; v11 = 0,44 %) · Federbreite **1,2–1,8 %** von **`min(W,H)`** (v11 = 1,40 %).
- **`for:'chip'`:** Familie = **Strich** · Stützpunkte **≤ 12** auf der langen Kante (mehr liest als „torn") · Feder/Bauchung werden **nicht** geprüft (bei Strich IST der Versatz der Wobble; die Feder skaliert mit der Messauflösung).

Reihenfolge der Befunde: **erst die Familie** (ein Strich auf einer Karte ist kein Zahlenproblem), dann die Zahlen. Ein „ok" behauptet nie mehr, als in `checked` steht.

### 2.6 · Minimal-Nutzung der Feder (ohne den ganzen Builder)
```js
import { contour, drawInk, measureInk } from './kfb-ink-canon.js';
const pts = contour('card', seed, W, H);   // normalisiert gebaut, dann skaliert
drawInk('card', g, pts, W, H, seed);        // das Band, ein fill()
measureInk(pts, W, H, 'card', seed);        // → { featherPct, bowPct, kind, ok, why }
```
**Auflösungs-Invariante:** Kontur EINMAL im Referenzrahmen bauen, normalisieren, nur skalieren. Maske, Decal und Flächen-Clip teilen **dieselbe** Punktliste — zwei getrennt gerechnete Konturen ergeben zwei Kanten mit einer Lücke.

---

## 3 · Das Sollformat (aus `kfb-card-format.js`)

**Eine Zahl, ein Ort:** jede KFB-Karte hat dasselbe Blattformat. `CARD_AR = 1.74` (Breite/Höhe, Landscape), Anker = `ignore_dystopia` (Zelle 294,0 × 168,9 pt = 1,740). Georgs Entscheidung 26.7.2026: ausschneidbare Karten müssen gleich groß sein.

**`fit`, nicht `cover`:** die unterschiedlich hohe Zelle wird **mittig** ins Sollformat gelegt (`fitCell` → cremefarbener Rand innerhalb der Tuschekante), statt ~18 % von Titel/LORE abzuschneiden. `coverLoss` protokolliert, was `cover` gekostet hätte.

---

## 4 · Der Crop-Vertrag `cardGrid` (das Herz des PDF-Schnitts)

- PDF-Seite **745,091 × 415,636 pt**, trägt ein **2×2**-Kartenraster (`gridCols=2, gridRows=2`).
- **Seite** = `coverOffset + 1 + floor((cardNumber − 1) / 4)`
- **Quadrant** = `(cardNumber − 1) % 4` → Reihenfolge **TL · TR · BL · BR**.

`deck.cardGrid = { x, y, w, h, gapX, gapY }` in **0..1**: `x,y,w,h` = Außenrahmen des 2×2; `gapX,gapY` = Zwischenraum **zwischen** den Zellen (Default 0). `null` = ganze Seite (**falsch** für eingerückte Raster). **Zahlen NUR in `index.json`, nie in JS.**

```js
cw = pg.width * (w - gapX)/gridCols;   chh = pg.height * (h - gapY)/gridRows;
sx = x*W + col*(cw + gapX*W);          sy = y*H + row*(chh + gapY*H);
```

**Gemessene Werte (Beweis: `CARDGRID_MESSUNG_2026-07-26.md`):**

| Deck | `cardGrid` | Kopfband? |
|---|---|---|
| `forget_utopia`   | `{ "x":0.050, "y":0.037, "w":0.899, "h":0.947, "gapX":0.135, "gapY":0.010 }` | nein |
| `ignore_dystopia` | `{ "x":0.060, "y":0.117, "w":0.879, "h":0.823, "gapX":0.090, "gapY":0.010 }` | **ja** |
| `embrace_protopia`| `{ "x":0.048, "y":0.093, "w":0.903, "h":0.822, "gapX":0.022, "gapY":0.020 }` | ja (dünner) |

**Edge cases (damit Fallbacks sauber gebaut werden):**
- **Blind-Viertel-Crop ist falsch:** das Raster ist eingerückt (x≈0,05, w≈0,90), nicht volle Breite.
- **Kopfband = y-Offset:** hat ein Deck einen Seitentitel oben, ist `y` größer (0,09–0,12) und `h` kleiner — sonst kappt der obere Crop die Karte unten.
- **Die Naht liegt bei ≈ 0,51·H**, NICHT bei 0,466·H (tote Zahl aus anderem Kontext).
- **Zwischen den Spalten steht oft Fremdinhalt** (bei `forget_utopia` die BLÖDSINN-Illustrationsspalte, gapX 0,135) → ohne `gap` nimmt der Crop den halben Nachbarn mit.

**Fallback für un-gemessene Decks:** `{ x:0.05, y:0.05, w:0.90, h:0.90 }` + Vermerk `"cardGrid_status":"geschätzt"`, bis pro Deck gemessen (rendern → Rahmen ziehen mit `tools/cardgrid-pick.html` → Overlay gegenprüfen, ~20 s/Deck).

---

## 5 · Die vier Builder-Regeln (im Modul verankert)

1. **Text zuerst, Bild später.** Titel + Lore als Blatt sofort, echtes Artwork nachschieben. Nie ein leeres Blatt, nie ein Ladebalken.
2. **Ein PDF-Render zur Zeit.** Warteschlange mit einem Platz, Seiten gecacht, Tab-Watchdog (20 s) gegen hängende Renders bei Tab-Wechsel.
3. **RAW-first → lokaler Fallback → Textkarte.** Das Repo-Manifest ist die Wahrheit.
4. **Fläche und Tusche teilen EINE Kontur.** `alphaMap` + `alphaTest` stanzt (harte Kante), das Decal trägt die Linie 2 cm davor. Die Maske darf nur um die **kleinste** vorkommende Halbbreite aufweiten (`maskGrow`), sonst blitzt die Fläche an den dünnen Stellen durch.

**Nützliche API:** `cb.makeById(packId, n)` · `card.measure()` (was die Kante WIRKLICH ist) · `card.setSurface(tex)` (Live-Render/Video/Foto in denselben Steckplatz) · `cb.formatReport()` (Rand jetzt vs. Verlust mit `cover`) · `cb.ink` (die Feder zum Selbermalen, z. B. Rückseiten) · `cb.setParams({preset, aspect, …})` (räumt geteilte Texturen mit).

---

## 6 · Harte Regeln (nicht verhandeln)

- **WebGL, three 0.160.** Kein WebGPU/TSL. Tusche in 2D-Canvas → Textur/Decal (kein DOM außer `<canvas>`).
- **Assets/Manifest über RAW-URL** (`raw.githubusercontent.com/georg-doc/kayfabizarro`), lokale Kopie nur Fallback.
- **`cardGrid`-Zahlen NUR in `index.json`** — taucht dieselbe Zahl in JS auf, ist die Aufgabe nicht fertig.
- **Nie eine eigene Jitter-Schleife oder Ink-Familie erfinden** — `kfb-ink-canon.js` importieren.
- **Textur-Farbraum:** `SRGBColorSpace` fürs Sichtbare, `NoColorSpace` für Masken/Alpha (im Builder verdrahtet).
- **Kann der Builder etwas nicht, das eine Szene braucht:** sagen → es kommt in den Builder. Kein „ähnlich wie", kein Nachbau.

---

## 7 · 30-Sekunden-Fehlersuche

1. **Kante zackig/„torn"** → falsche Familie (Strich auf Karte). `measureInk` meldet „falsche Familie". → Preset `card`.
2. **Kante gebaucht/„bent"** → `bow` zu groß (1,4 statt 0,196). `measureInk` meldet „Bend statt ink". → `contour('card', …)`, keine eigene Signatur.
3. **Deck falsch geschnitten** (Nachbar im Bild / Karte unten gekappt) → `cardGrid` in `index.json` messen (§4), **nicht** im Code fummeln.
4. **Nie:** eigene PDF-Halbierung, eigene Tusche-Schleife, Zahlen in JS, `cover` als Default.

---

## 8 · Status & offene Punkte (ehrlich, Stand 2026-08-06)

Die drei Module liegen in `skills/` und greifen konsistent ineinander (geprüft am Baum). **Was noch nicht „ratifiziert / vollständig" ist:**

- Die Ink-SSOT v2 trug zuletzt Kopf-Status **„Vorschlag zur Abstimmung §9"** — messbare Punkte (bow 0,196 · Feder auf `min(W,H)` · Presets statt Parameter · `skills/` als gemeinsame Quelle) sind belegt; **noch Georgs Entscheidung:** bow-Schwelle für große Panels (0,5 %?) und Rückseiten (der Builder malt heute nur die Vorderseite).
- **`cardGrid` nur für 3 Decks gemessen** (`forget/ignore/embrace`). **Offen:** `sonic_slaughterhouse`, `epistemic_sabotage` (Fallback + `"geschätzt"`).
- **Zu verifizieren:** dass `media/kfb/index.json` die drei gemessenen Grids wirklich deployt trägt — sonst fällt der Builder auf „ganze Seite" zurück (= Fehlschnitt).
- **Pfad-Hygiene:** ältere Doku nannte die Module unter `cardbuilder/`; Kanon ist **`skills/`**.

---

## 9 · Was NICHT gewollt

Eigener Kartenrenderer statt `kfb-card-builder.js` · eigene Tusche-/Jitter-Familie · `bow` aus der alten Signatur (1,4) · Strich-Familie auf Karten · `cover` als Default · `cardGrid`-Zahlen in JS · Blind-Viertel-Crop · WebGPU/TSL · zwei getrennt gerechnete Konturen für Maske und Decal. **Die Karte ist ein Comic-Panel, kein Brett.**
