# SSOT — Card Ink-Outline (Karten-Tusche)

Die eine kanonische Definition der getuschten Karten-Kante. Vorher verstreut (Code + Commission), hier
zusammengezogen. **Gemessen am echten Code, nicht behauptet.**

## Quelle der Wahrheit — zwei Implementierungen, EIN Kanon
Es gibt zwei Umsetzungen desselben Looks. Sie stimmen im **Kanon** überein, haben aber **eigene Zahlen**:

- **AKTUELL / für neue Arbeit → Ride v11 `rc-ink` (`KFB_INK_OUTLINE_STYLE_v1`).** In
  `rollercoaster-ride.v11.js`: `import 'rc-ink'` → `window.KFBInk` (`inkPerimeter`, `drawInkOutline`),
  Stil `inked` mit **`uniform: true`** (gleichmäßige Feder — genau die Kanon-Regel), Farbe `#1f1a14`/
  `#191410`, hergeleitet aus „Infinite Journey v4 master tusche". **Auf einem 2D-Canvas gezeichnet
  (CanvasTexture) → renderer-unabhängig → direkt in der WebGL-v4-Welt wiederverwendbar.** Für die
  **Fly-through-Karten und den v4-Card-Carrier ist DAS die Referenz.**
- **Vorfahr / historisch → `kfb-table.v6.js` `inkPathD()`** (+ `blobTexture()`, Ink `#1f1a14`). Der
  Card-Viewer und `COMMISSION_die_reise.md` §„Der Strich" beziehen sich darauf. Wichtig: v6 hatte die
  **lichtabhängige Strichdicke** (der Fehler, den die Commission ausdrücklich NICHT übernehmen wollte);
  v11 `rc-ink` hat genau das mit `uniform:true` schon richtig. → **Für Neues v11 nehmen, nicht v6.**

Antwort auf „sind die gleichen?": **gleicher Look und gleicher Kanon, unterschiedlicher Code.** v11 ist
die richtige, gepflegte Fassung.

## Die EINE Regel (Kanon)
**Die Tusche liegt auf der BILDEBENE, nicht in der Welt.** Eine gezeichnete Linie auf Papier hat überall
dieselbe Feder — unabhängig von Tiefe, Winkel und Licht.
→ Aus v6 den **Strich-Charakter** (`inkPathD`) übernehmen, **NICHT** die **lichtabhängige Strichdicke**
(die war für 3D-Objekte auf einem Tisch gedacht und ist für Karten konzeptionell falsch).

## Prüfbare Werte (1:1 aus `inkPathD`)
- **Jitter ±1.2 px** auf x **und** y — `(rnd()-0.5)*2.4`.
- **Ein Stützpunkt alle ~46 px** — `n = max(2, round(len/46))`.
- **`inset = 2`** (Kante liegt 2 px innen).
- **Reine `L`-Segmente, keine Kurven.** Gerade Läufe ohne Jitter (Flag `straight`).
- **Deterministisch pro Objekt** — `mulberry32(seed)`, ein Seed je Karte.
- **Ein durchgehender Pfad** inkl. Comic-Tail — **keine Stufe, keine Naht**.
- **Ink-Farbe `#1f1a14`** (= `--ink-deep`). Verwandt: `--ink #2a241a`, `--ink-faint #6b5e44`.
- **Strich:** `stroke: currentColor`, Referenz-Breite ~1.6 — entscheidend ist aber die **einheitliche
  wahrgenommene Dicke**, nicht der exakte px-Wert (der skaliert mit der Render-Auflösung).

## Prüfbar richtig
- **Alle** Panel-/Karten-Kanten haben **dieselbe wahrgenommene Strichstärke**: Held (nah, frontal) wie
  Boden/Decke (fern, schräg).

## Beobachtete Fehler, die das ausschließt
- **Doppelte Outlines.**
- **Zackiger Strich** (Jitter zu groß / Frequenz zu hoch).
- **Lichtabhängige Dicke** (dünne Boden-Panel-Linien treffen die dicke Held-Unterkante).

## Wo es gilt
Karten-Panels im Card-Viewer, die **Tuschekante des Flug-Card-Carriers** (Pet-auf-Karte) und jede
Karten-Optik. Beim Card-Carrier v4 dieselbe Kante — die Karte ist ein Comic-Panel, kein Brett.
