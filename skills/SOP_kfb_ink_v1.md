# SOP — KFB Ink Line / Outline: Fallen, Regeln, Abnahme
### Additiv geführt. Neuer Eintrag oben. Stand v1.0 · 2026-08-25 (WS1, Pet Studio v5)

Dieses Blatt ist die Sammelstelle für alles, was an der **Tusche** und an den **Blasen** bezahlt
wurde. Es ist so geschrieben, dass es in zwei Repo-Dateien nachgezogen werden kann:

- `skills/SSOT_Card_Ink_Outline_v2.md` → **§11 neu** (Kleinformate und Blasen), §5 ergänzt
- `skills/kfb-embed-bundle v3/` → die Regeln als Code-Kommentar am Kanon-Modul und im Embed-Text

**Grundsatz, aus dem alles andere folgt:**
> Eine gezeichnete Linie ist nirgends gleich dick — und ihre Dicke hängt an der **Lage**, nicht an
> der Bedeutung. Wo ringsum dieselbe Breite steht, sieht man kein Comic, sondern einen Termin.

---

## CHANGELOG

### v1.0 — 2026-08-25 (Pet Studio v5, WS1)
Erste Fassung. Enthält 12 Fallen, 7 SOPs und 3 Abnahmeblätter aus dem Blasen-, Boden- und
Tipp-Punkte-Slice. Alle Zahlen gemessen, keine geschätzt.

---

## 1 Die zwölf Fallen

### F1 · Zwei Punkte, die aufeinander liegen, machen aus einer Ecke eine Rundung
`bubble-shapes.json` trug in `rect` an **jeder** Ecke zwei Stützpunkte im Abstand von **0,0296 der
halben Breite** (eine Fase). Die Kantenfasung fast dort ein zweites Mal — Ergebnis: weiche oder
kaputte Ecke, je nach Zoom.
**Regel:** zwei Anfasser näher als `mergePx` (Standard **14 px**) werden zu **einem**, und der neue
Punkt ist eine **Ecke**. Beim Laden *und* beim Ziehen. Ein Kurvenpunkt wäre die Rundung zurück.
**Gemessen:** `rect` 11 → 7 Punkte (4 zusammengelegt), `round` unverändert 11 — dessen Fase ist
~40 px weit, die Regel beißt dort zu Recht nicht.

### F2 · `bevelCorners()` fast jeden Knick über 34°
Nach F1 sind die `rect`-Ecken echte 90°-Knicke — also werden sie gefast und sehen angeschrägt aus.
**Nicht behoben (Georgs Entscheidung 25.8.):** ein Eingriff dort ändert die Feder **aller** Karten
und Interfaces, die den Kanon lesen. Dokumentiert statt riskiert. Wer es angeht, braucht ein
Abnahmeblatt über Karte · Comic · Chip · Blase gleichzeitig.

### F3 · `stroke()` ist keine KFB-Tusche
Ein Canvas- oder SVG-Rand hat ringsum dieselbe Breite. Der Kanon moduliert über die Lage:
**Licht oben links, Linie unten und rechts satter** — `LX 0,62 · LY 0,78 · ORIENT 0,34`.
**Regel:** nie `stroke()`, sondern ein **BAND** zwischen zwei Offsetkurven füllen (`inkRibbon2D`).
Georgs Befund dazu wörtlich: *»das ist deadline, nicht KFB ink«.*

### F4 · Das Band des Kanons deckt kleine Formen zu
Bei einer Scheibe von ~20 px Durchmesser ist die Band-Halbbreite größer als der Radius — die Form
wird schwarz. **Regel:** unter etwa **40 px** die Bandbreite direkt rechnen (dieselbe Lichtformel,
`half = pen/2 × (1 + ORIENT × (nx·LX + ny·LY))`), statt `inkHalfWidth` mit hohem `gain` zu quälen.

### F5 · `alphaMap` liest den GRÜNKANAL, nicht den Alphakanal
Eine schwarze Maske heißt Grün 0 heißt Alpha 0 — das Decal ist unsichtbar, obwohl alles stimmt.
**Regel:** Masken **weiß** rendern, Freistellung über `setClearAlpha(0)`.

### F6 · Farb-Helfer, die nur Hex lesen, geben stillschweigend NaN
`_mix('rgb(250,244,230)', …)` ergibt `rgb(NaN,NaN,NaN)`; die Leinwand behält daraufhin die **letzte**
Farbe — im Zweifel den Schatten. So wurden aus papierfarbenen Tipp-Punkten schwarze Klötze.
**Regel:** ein Farbformat im Modul, an der Grenze konvertieren, nie mischen.

### F7 · Uniforme Catmull-Rom überschießt bei ungleichen Abständen
Einen Punkt einfügen und die Kontur schlägt nach außen aus. **Regel:** zentripetal (alpha 0,5) —
kann per Konstruktion keine Schlaufe bilden. Nicht der Punkt war falsch, sondern die Kurve zwischen
den Punkten.

### F8 · Der Satz sitzt im gemessenen Innenraum, nicht in der Mitte des Rahmens
Ein Zipfel zieht die Rahmenmitte zu sich; der Text stand oben zu weit, unten zu eng.
**Regel:** größtes Rechteck im Satzverhältnis im Innenraum suchen, bei Gleichstand den mittigsten
Ort nehmen. Rand = Tuschebreite + eine Kapitälchenhöhe.

### F9 · Padding ist Geometrie, keine Zahl nach Gefühl
Block × √2 × 1,12; der Schrei rechnet gegen den Innenring 0,84. Wer Padding als Pixelwert setzt,
bekommt bei jeder Schriftgröße ein anderes Bild.

### F10 · Zwei Schreiber auf einer Zahl
Gemessen in dieser Sitzung zweimal: die Schlaf-Animation setzte `rotation.x` absolut und löschte die
Kopfneigung; im Podcast schreibt etwas nach dem Augen-Rig und der Blick steht (0,0026 rad gegen
0,699 rad im Studio, also das 269-fache).
**Regel:** **eine Zahl hat einen Eigentümer, alle anderen ADDIEREN.** Wer absolut schreibt, gewinnt
zufällig — nach Aufrufreihenfolge.

### F11 · Canvas misst still die Ausweichschrift
`document.fonts.ready` genügt nicht: eine nicht angeforderte Webfont ist auch dann nicht geladen.
**Regel:** `await document.fonts.load('<Größe> <Familie>')` für **jede** benutzte Schrift, dann
zeichnen. Sonst sitzt der Satz zweimal falsch — in Größe und Breite.

### F12 · Eine Bühne von 0 px ist keine Bühne
Im versteckten Tab hat die Leinwand keine Größe; die Form fällt auf einen Punkt und F1 legt sie zu
einem einzigen Anfasser zusammen. **Regel:** Form vormerken und beim ersten Bild mit Größe laden.

---

## 2 Die sieben SOPs

1. **Eine Feder, eine Lichtrichtung.** `LX 0,62 · LY 0,78 · ORIENT 0,34` gelten in Karte, Comic,
   Chip, Blase, Tipp-Punkt und Bodenschatten identisch. Zwei Lichtrichtungen sind zwei Sonnen.
2. **Der Saum sitzt unten rechts**, immer, mit demselben Verhältnis zur Federbreite. Auch der
   Bodenschatten folgt ihm (Versatz vorne/rechts).
3. **Der Vertrag trägt Punkte, nicht Namen.** `voice.bubble.pts` statt `"rect"` — ein Name ist eine
   Bitte, Punkte sind eine Ansage. An genau dieser Naht sind drei Fassungen von `pet-mouth.v1.js`
   entstanden.
4. **Die Form besitzt die Silhouette, die Feder besitzt die Linie.** Ein Federwechsel ändert Breite
   und Textur, nie die Silhouette. Punkte tragen `struct`, Formen tragen `deform`.
5. **Ein Ausdünnen wird gemeldet, nicht übernommen.** Beim Vereinigen zweier Stände gewinnt der
   reichere Feld für Feld; `leafCounts` ist die Gegenprobe (v1.2.6 hatte höhere Version und drei
   ärmere Pets).
6. **Messen statt behaupten**, und die Zahl in den Changelog. Kein „sieht besser aus" ohne Zahl.
7. **Über den echten Bedienweg testen**, nicht über die API. Ein Slice kann über `start()` grün und
   über den Schalter tot sein.

---

## 3 Abnahmeblätter

### 3.1 Blase
- [ ] `rect` hat nach dem Laden **7** Punkte, alle Ecken sind Knicke, keine Rundung an den Ecken.
- [ ] Ein Punkt eingefügt → die Kontur schlägt **nicht** nach außen aus.
- [ ] Zwei Anfasser aufeinandergezogen → **ein** Punkt, als Ecke, Meldung im Fuß.
- [ ] Federbreite folgt der Schriftgröße; unten/rechts messbar satter als oben/links.
- [ ] Satz sitzt im Innenraum, Rand ≥ Tuschebreite + Kapitälchenhöhe, auch mit Zipfel.
- [ ] Schrift geladen, bevor gezeichnet wird (kein Serifen-Fallback).

### 3.2 Tipp-Punkte
- [ ] Füllung ist **Papier** (max. ein Hauch Pet-Grundfarbe), **kein** Vollton, **kein** Schwarz.
- [ ] Linie unten/rechts satter — kein gleichmäßiger Ring.
- [ ] Saum unten rechts vorhanden.
- [ ] Bewegung: Absprung, kurzes Halten oben, Landung mit Quetschen; Versatz je Punkt.
- [ ] Nur sichtbar, wenn **keine** Blase offen ist (Fokus-Regel `voice.focus.mode = 'one'`).

### 3.3 Bodenschatten (aus demselben Kanon)
- [ ] Stempel der **echten Form**, auf dem Boden, nicht auf einer Rückwand.
- [ ] Versatz vorne/rechts wie der Saum.
- [ ] Hüpfen: Stempel wird weicher und größer, verschwindet nicht, wird nicht beschnitten.
- [ ] Gekippte Platte: Stempel liegt auf der Fläche, Höhe ist der Abstand **zur Platte**.
- [ ] Sohle liegt auf der Platte, jedes Bild (Fußanker als letzter Schreiber).

---

## 4 Was in die Repo-Dateien nachgezogen werden muss

### `skills/SSOT_Card_Ink_Outline_v2.md`
- **§11 neu — Kleinformate und Blasen:** F3, F4 (die 40-px-Grenze mit der direkten Bandformel),
  F1/F2 (Mindestabstand und der offene Fasen-Befund), plus die Blasen-Kennzahlen
  (`hb 0,0110` zwischen Karte 0,0069 und Figur 0,0155 · `taper 0,50` · `edge 1,70` · `step 26`).
- **§5 ergänzen:** `LX/LY/ORIENT` explizit als Kanon benennen — sie stehen heute nur im Code.
- **§9/§10 querverweisen** auf F10 (ein Eigentümer je Zahl).

### `skills/kfb-embed-bundle v3/`
- Die Regeln F1, F3, F4, F5, F11 als Kommentarblock an der Stelle, wo das Bundle Tusche zeichnet.
- Den Vertragsblock `voice.bubble` (mit `pts`) und `voice.typing` in den Embed-Text aufnehmen —
  sonst muss jede Zone die Blase erraten.
- Den Verweis auf dieses Blatt, damit die Sammelstelle **eine** bleibt.
