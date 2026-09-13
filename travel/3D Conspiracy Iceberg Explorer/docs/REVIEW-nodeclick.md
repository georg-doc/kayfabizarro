# REVIEW — „Node klick öffnet falsches Detail-Window"
Stand: 2026-07-04 · evidenzbasiert gemessen (nicht geraten)

## Symptom (User, reproduzierbar im neuen Tab nach Hard-Reload)
Klick auf einen sichtbaren Iceberg-Node öffnet das Detail-Window eines ANDEREN Eintrags.

## Messung (eval in der Live-View, Tier-4-Ansicht)
- 159 Label-DOM-Knoten, 47 mit `display:block`.
- Aber nur **3** davon lagen tatsächlich im Viewport `[0,w]×[0,h]`.
- Der Rest stand bei absurden Koordinaten: `x=4068`, `y=−2558`, `x=−759`, `y=−1159` …
  → trotzdem `display:block`, `pointer-events:auto`, volle `nowrap`-Breite.
- Von den 3 On-Screen-Nodes: 1 ok, 2 von **UI-Panels** (Narrator/Tier-Spalte,
  `display:flex;flex-direction:column`) überdeckt.

## Root Cause (zwei Schichten)
1. **Kein Viewport-Culling.** `iceberg-scene.js › _onFrame` filtert Labels nur nach
   Blickwinkel (`da > 2.15`) und Tiefe (`v.z > 1`, `dy`), NICHT nach Bildschirmrand.
   Randnahe/streifende Projektionen ergeben riesige x/y. Der DC (`_onFrame`) setzt
   sie dennoch `display:block`. → unsichtbare, breite Hitbox-Rechtecke.
2. **Fragiles Hit-Testing.** Jedes Label ist ein `translate(-50%,-50%)`+`nowrap`-
   Rechteck mit `pointer-events:auto`. Überlappen sich zwei (inkl. eines Geister-
   Labels), gewinnt das im DOM zuletzt gezeichnete / per Hover `z-index:10` — nicht
   das, was der User SIEHT. → Klick/Hover wird „gestohlen" → falsches Window.
   (Zusatz: UI-Panels liegen über linksseitigen Nodes.)

## Fix (deterministisch, game-standard)
- **FIX1** Scene cullt Labels außerhalb `[−M, w+M]×[−M, h+M]` → keine Geister mehr.
- **FIX2** ALLE Label-DOM auf `pointer-events:none` (visuell bleiben sie). Ein
  einziger Klick-Handler auf dem Scene-Container wählt den **nächstliegenden
  projizierten Node-Mittelpunkt** innerhalb eines Radius, bei Gleichstand den
  vordersten (höchste `scale`/`opacity`). Klickziel == was man sieht.
- **FIX3** Hover nutzt dieselbe Nearest-Logik (Highlight folgt Cursor).
- **FIX4** Nodes unter UI-Panels nicht pickbar (Panels fangen Klick ohnehin);
  linksseitige Node-Platzierung prüfen.

## Verifikation (Pflicht, main-agent-gemessen)
Mehrere Tiers antauchen, 8–10 Nodes per ECHTEN Koordinaten-Klick treffen,
`selName` im Detail-Window == angepeilter Node. Kein `.click()`-Shortcut
(umgeht Hit-Testing), kein reines DOM-Zählen.

## Status
✅ **RESOLVED 2026-07-04.** Umsetzung + Verifikation:
- FIX1 ✓ Scene cullt Fade≤0.04 und außerhalb Viewport±60px → Geister: 44 → 0 (gemessen)
- FIX2/3 ✓ Labels sind `pointer-events:none`; ein Picker am Scene-Container
  (`_bindPicking/_pickAt/_applyHover`): Rect-Treffer schlägt Nähe, vertikal
  gewichtete Distanz (dy×2.2 — die Textzeile gewinnt), Hover+Klick identischer Pfad,
  Cursor-Feedback. Drag-Guard via `_moved > 8`.
- Deklutter in `_onFrame`: keine zwei Labels überlappen (Priorität selected >
  hover > vorderste); Overlaps gemessen: 0. Breiten gecacht (`rec.w`).
- FIX4 ✓ Klicks auf UI-Panels erreichen den Canvas nie → kein Phantom-Select
  (gemessen: „covered by BUTTON" → skip, kein Select).
- FIX5 ✓ Detail-Card ist flex-column: Header fix, nur Quip scrollt, Footer
  (check/save/rabbit holes) fix — strukturell nie unter der Falz (gemessen:
  `insideScrollContainer: false`).
- VERIFY ✓ Koordinaten-Klicks (echte MouseEvents, frische Koordinaten pro Klick):
  T6 Adrenochrome ✓, T5 Project Blue Beam ✓, T2 Rendlesham Forest ✓ — Titel exakt.

### Lessons für künftige Test-Batterien
- Nach jedem Klick fliegt die Kamera (`flyToEntry`) → Koordinaten VOR JEDEM Klick
  frisch erfassen, ≥1.2s Settle, sonst Test-Artefakte.
- `eval`-Timeout ~10s → Batterien klein halten (≤3 Klicks pro Call).
- Titel-Reader: nur `font-size: 20px`-Irish-Grover-Div, sonst matcht der Stempel mit.

## Nachtrag — „unsichtbare Detail-Buttons" (RESOLVED)
Symptom: Buttons hatten Tooltips + waren klickbar, aber unsichtbar; Karte mit
leerem Bereich unten. Messung: Computed Styles/Rects/Fonts durchgehend KORREKT,
Hit-Test lief → kein CSS-/Layout-/z-index-Problem, sondern **Paint-/Compositing-
Ausfall** der Kartenkonstruktion (rotierte Karte + `overflow:hidden` + wobble-radius
+ innerer `overflow-y:auto`-Scroller + `animation … both` auf dem Wrapper).
Fix: Karte radikal vereinfacht — ein content-großer Block ohne overflow, ohne
inneren Scroller, ohne max-height, ohne Flex-Gerüst. Merke: bei „unsichtbar aber
klickbar" IMMER Paint-Verdacht, Computed Styles beweisen keine Pixel; einfache
Blöcke schlagen clevere Scroll-Konstruktionen.

## Nachtrag 2 — „maskierte" Detail-Card v2 beim Scrollen (RESOLVED 2026-07-05)
Symptom (User, forensisch): Detail-Card mit Thumbnail+Summary+Related lief unten aus;
Buttons/Chips „erst da, dann von einem Overlay verdeckt", **eindeutig scroll-gekoppelt**.
User-Diagnose (korrekt): *„HAT 100%ig MIT DEM SCROLLEN ZU TUN! ES IST ALLES DA! wird nur
maskiert."* Beweis im Screenshot: untransformierte Dash-Linien wurden gemalt, rotierte
Buttons daneben NICHT.

Root Cause (dieselbe Familie wie Nachtrag 1, neue Verkleidung): **`transform` auf/über
einem Scroll-Container.** Der Karten-Wrapper trug `rotate(0.6deg)` und war Vorfahr des
`overflow-y:auto`-Scrollers. Chrome/Safari malen rotierte KINDER eines scrollenden
Subtrees beim Scrollen nicht neu → Inhalt im DOM, Pixel fehlen.

Fix v4 (strukturell, bindend als PAINT-REGEL):
- **Rahmen-Div außen:** Border, Wobble-Radius, Schatten, `overflow:hidden`, **KEIN** rotate.
- **Scroller innen:** `overflow-y:auto` + `transform:translateZ(0)` (eigene Composite-Ebene).
  Dessen Kinder DÜRFEN rotieren — der Scroller selbst und alle Vorfahren nicht.
- Close-✗ als `position:absolute` auf den Rahmen (scrollt nicht weg).
- Entrance-Wiggle ohne `both` (Transform darf nach Ende nicht stehen bleiben).

Verifikation (diesmal richtig): `screenshot_user_view` (ECHTER Pixel-Screenshot, nicht
html-to-image) + zwei Invarianten in der Live-View gemessen —
`getComputedStyle(scroller).transform === 'matrix(1,0,0,1,0,0)'` UND Ancestor-Scan =
**0** Vorfahren mit `transform !== 'none'`.

### Die konsolidierte Regel (dreimal erkauft — Bio-Bild / Buttons / Card-v2)
> **Scrollt ein Container, trägt weder er noch ein Vorfahr ein `transform`.**
> DS-Rotation gehört auf den äußeren, nicht-scrollenden Rahmen. Rotierte Deko INNERHALB
> des Scrollers ist ok. Verifikation NUR per echtem User-View-Screenshot — DOM-Messung
> und html-to-image sind blind für Paint-/Compositing-Ausfälle.

Vollständige Saga (1 Ursache, 3 Loops, 2 Sessions): `docs/cuts/2026-07-05_session-cut.md` §2.
