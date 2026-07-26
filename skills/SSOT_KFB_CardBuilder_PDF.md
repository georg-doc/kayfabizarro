# SSOT — KFB CardBuilder & PDF-Karten (für jeden Chat / jedes LLM)

**Zweck:** Wer eine KFB-Cut-&-Play-Karte in 3D bauen oder eine PDF-Karte schneiden will, liest **dieses
Dokument + die Ink-SSOT** und muss **nichts nachfragen**. Fork/reuse die Referenz-Module — baue nichts nach.

**GitHub-Ziel (Kanon):** `skills/` — dieses Doc + `SSOT_Card_Ink_Outline_v2.md` + die zwei Module
`kfb-card-builder.js` und `kfb-ink-canon.js`. Zusammen sind das „Karten & Outlines, komplett".

---

## 1 · Die zwei Wahrheiten + der Code, auf den sie zeigen
- **Karten-Bau:** dieses Doc → Referenz-Implementierung **`kfb-card-builder.js`**.
- **Kante/Tusche:** **`SSOT_Card_Ink_Outline_v2.md`** (Kanon-Version 2) → Referenz **`kfb-ink-canon.js`**.
- **Regel:** Wer eine Karte oder Kante anders baut, baut sie falsch. Es gibt eine **Messvorschrift**
  (`measureInk`), mit der sich das nachweisen lässt, statt darüber zu diskutieren.

## 2 · Der CardBuilder ist die EINZIGE Quelle für Karten
Für jede Szene (Zone-Builder, Tisch, Diorama, Travel). Aufrufer liefert `THREE` + welche Karte; alles
andere macht der Builder.

```js
import { createCardBuilder } from './kfb-card-builder.js';
const cb   = createCardBuilder({ THREE });
const pool = await cb.pool();                 // alle Karten aller Decks, gemischt
const card = cb.make(pool[0], { width: 11 }); // sofort: Textblatt; Artwork schiebt sich selbst nach
scene.add(card.group);
```
**Pipeline:** Deck-Registry (Repo) → PDF-Seite rendern → Quadrant nach `cardGrid` schneiden → Blatt malen
→ Silhouette stanzen → kanonische Tusche als Decal davor.

**Vier Regeln (im Modul verankert):**
1. **Text zuerst, Bild später.** Titel+Lore als Blatt sofort, echtes Artwork nachschieben. Nie ein
   leeres Blatt, nie ein Ladebalken.
2. **Ein PDF-Render zur Zeit** (Warteschlange, Seiten gecacht).
3. **RAW-first → lokaler Fallback → Textkarte.** Das Repo-Manifest ist die Wahrheit.
4. **Fläche und Tusche teilen EINE Kontur** (`alphaMap`+`alphaTest` stanzt, Decal trägt die Linie 2 cm
   davor). Zwei getrennt gerechnete Konturen = zwei Kanten mit Lücke.

**Stabiler Gruppen-Aufbau (darauf ist Verlass):**
```
group
 ├─ sheet  Mesh(PlaneGeometry(w,h)) · map = Blatt · alphaMap = Silhouette
 └─ decal  Mesh(PlaneGeometry(w,h)) · map = nur Tusche · z = +0,02·w/11
```
Der Builder liefert diese `THREE.Group` und **hört auf** — kein Layout, keine Animation, keine Kamera.
Das gehört der Szene.

## 3 · Kartenformat & Adressierung (fix)
- PDF-Seite **745,091 × 415,636 pt**, trägt ein **2×2**-Kartenraster (`gridCols=2, gridRows=2`).
- **Seite** = `coverOffset + 1 + floor((cardNumber − 1) / 4)`
- **Quadrant** = `(cardNumber − 1) % 4` → Reihenfolge **TL · TR · BL · BR** (`cardMapping`).

## 4 · `cardGrid` — der Crop-Vertrag (das Herz)
`deck.cardGrid = { x, y, w, h }` in **0..1** = wo das 2×2-Raster auf der Seite **beginnt** und wie **groß**
es ist. `null` = ganze Seite (v11-Default, **falsch** für eingerückte Raster). Der CardBuilder liest
`deck.cardGrid` bereits; die Zahlen stehen **nur in `index.json`**, nie in JS.

**Gemessene Werte (Exhibition, 2026-07-26, Messweg + Beweisbilder: `CARDGRID_MESSUNG_2026-07-26.md`):**

| Deck | `cardGrid` | Kopfband? |
|---|---|---|
| `forget_utopia`   | `{ "x":0.050, "y":0.037, "w":0.899, "h":0.947 }` | nein |
| `ignore_dystopia` | `{ "x":0.060, "y":0.117, "w":0.879, "h":0.833 }` | **ja** |
| `embrace_protopia`| `{ "x":0.048, "y":0.093, "w":0.903, "h":0.822 }` | ja (dünner) |

**Edge cases (dokumentiert, damit Fallbacks sauber gebaut werden können):**
- **Blind-Viertel-Crop ist falsch:** das Raster ist eingerückt (x≈0,05, w≈0,90), nicht die volle Breite.
  Der Vertikal-Split (Gutter) liegt mittig.
- **Kopfband = y-Offset, kein Sonderfall:** hat ein Deck ein Kopfband (Seitentitel), ist `y` größer
  (0,09–0,12) und `h` kleiner. Sonst schneidet der obere Crop den Seitentitel und kappt die Karte unten.
  Per Deck konstant (bei `ignore_dystopia` auf Seite 3 UND 13 gleich).
- **Die Naht liegt NICHT bei 0,466·H** (eine oft zitierte Zahl aus anderem Kontext). Gemessen ≈ 0,51·H.
  Der symmetrische 2×2-Split muss in die echte Zeilenlücke fallen; bei Kopfband-Decks ist die obere
  Karte höher → `h` so wählen, dass die Naht in der Lücke sitzt (nicht in der oberen Lore).

**Fallback-Strategie (für un-gemessene Decks):**
1. **Empfohlener Default statt `null`/ganze Seite:** `{ x:0.05, y:0.05, w:0.90, h:0.90 }` — trifft
   header-lose Decks gut, header-Decks nur leicht daneben (besser als voller Blind-Viertel-Crop).
2. **Später sauber:** Kopfband per Pixel-Profil auto-erkennen (dichte Textzeile oben → `y` anheben).
3. **Un-gemessene Decks** bekommen den Fallback + einen `"cardGrid_status": "geschätzt"`-Vermerk, bis pro
   Deck gemessen (gleicher Messweg: rendern → Rahmen per Profil → Overlay gegenprüfen).

## 5 · Kante/Tusche — Kurzfassung (Vollkanon: `SSOT_Card_Ink_Outline_v2.md`, `kfb-ink-canon.js`)
- **DIE EINE REGEL:** Tusche liegt auf der **Bildebene**, nicht in der Welt — überall dieselbe Feder,
  unabhängig von Tiefe/Winkel/Licht.
- **ZWEI FAMILIEN, nicht austauschbar:** **BAND** (`brushLoop`+`inkRibbon2D`, EIN `fill()`) → **Karten &
  Comic-Panels**. **STRICH** (`chipLoop`+`chipStroke`, Polylinie) → Buttons/HUD/Post-its. Eine gestrichene
  Polylinie kann nie wie ein Pinselband aussehen — wer an einer Kartenkante Parameter dreht und sie bleibt
  zackig, hat die falsche Familie.
- **`bow` ist eine Kennzahl (Kanon-2):** die Bauchung. v11 nutzt **bow ≈ 0,196** (nicht 1,4 aus der alten
  Signatur). Wer die Signatur statt der Aufrufstelle liest, baucht die Kante ~7× → das ist der „Bend statt
  Ink"-Effekt (eine gerade Linie, die sich krümmt). **Kein dritter Style**, sondern ein Parameterfehler.
- **Keine Default-Werte mehr:** die Feder kommt aus einem **benannten Preset** (`INK_PRESETS`), nicht aus
  einer Signatur. **Prüfbar:** `measureInk(pts,W,H,'card') → { points, featherPct, bowPct, kind, ok }`.
- **API:** `import { INK_PRESETS, contour, drawInk, measureInk } from './kfb-ink-canon.js'`;
  `contour('card',seed,W,H)` · `drawInk('card',g,pts,W,H,seed)`. Farbe Karte `#1f1a14`, Chip `#191410`.
- (Ältere `SSOT_Card_Ink_Outline.md` v1 ist **superseded** durch v2.)

## 6 · Harte Regeln (nicht verhandeln)
- **WebGL, three 0.160.** Tusche entsteht in **2D-Canvas**, wird als Textur/Decal hochgeladen (kein DOM
  außer `<canvas>`).
- **Assets/Manifest über RAW-URL** (`raw.githubusercontent.com/georg-doc/kayfabizarro`), lokale Kopie nur
  Fallback.
- **`cardGrid`-Zahlen NUR in `index.json`** — taucht dieselbe Zahl in JS auf, ist die Aufgabe nicht fertig.
- **Nie eine eigene Jitter-Schleife oder Ink-Familie erfinden** — `kfb-ink-canon.js` importieren.
- **Kann der Builder etwas nicht, das eine Szene braucht:** sagen, dann kommt es in den Builder — kein
  „ähnlich wie", kein Nachbau.

## 7 · Für einen frischen Chat — die 30-Sekunden-Anleitung
1. `import { createCardBuilder }` aus `kfb-card-builder.js`, `THREE` übergeben, `make(card)`, `group` in
   die Szene. Fertig — Text sofort, Artwork schiebt nach.
2. Neues Deck sieht falsch geschnitten aus? → `cardGrid` in `index.json` messen (§4), nicht im Code fummeln.
3. Kante sieht zackig/gebaucht aus? → falsche Familie oder falscher `bow`; `measureInk` sagt's dir. §5.
4. Nie: eigene PDF-Halbierung, eigene Tusche-Schleife, Zahlen in JS.
