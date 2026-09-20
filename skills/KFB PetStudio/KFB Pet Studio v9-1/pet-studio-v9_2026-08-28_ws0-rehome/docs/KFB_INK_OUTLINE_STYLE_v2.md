# KFB Ink Outline Style — v2

**Status: KANONISCH** · Stand 2026-07-15 · KayfaBizarro
*(v2 = v1 + dritter Stil `bend`. Ersetzt `uploads/KFB_INK_OUTLINE_STYLE_v1.md`.)*

Der hand-geinkte Comic-Kanten-Look von KFB, als wiederverwendbares System für Cards, Buttons, Boxen,
UI-Chips, HUD, 3D-Raum-Panels und (abgeleitet) 3D-Pets. Deterministisch, keine Bilder.

- **Interaktive Doku / QA / Playground:** `KFB Ink Outline Spec.dc.html` (standalone: `uploads/KFB-Ink-Outline-Spec-v1-standalone.html`) — *deckt aktuell inked/torn; bend nachziehen (TODO §11).*
- **Kanonisches 2D-Modul (inked/torn):** `kfb-ink.js` — Single Source of Truth.
- **Referenz-Implementierung inked-in-3D:** `comic-cube.v2.js` (`KFB Diorama Box.dc.html`).
- **Referenz-Implementierung `bend` (screen-space 3D):** `infinite-journey.v2.js` + `KFB InfiniteJourney v2.dc.html` — EINGEFROREN als bend-Referenz (2026-07-15).

---

## 1 · Die Idee

Tusche liegt **auf der Bildebene, nicht am Objekt**. Eine geschlossene, unregelmäßige Outline wird
entlang eines Rechtecks (oder Quads) gelaufen und mit einer wobbly Tusche-Linie nachgezogen. Zwei
Grund-Eigenschaften:

1. **Deterministisch** — seeded-zufällig: gleicher `seed` → exakt gleiche Kante. Nie `Math.random()`.
2. **Größen-ehrlich** — bei echter Zielgröße gezeichnet (× `devicePixelRatio`), nie ein skaliertes SVG/Bild.

---

## 2 · Die drei Stile

Ein Perimeter-Generator, drei Umsetzungen.

| Stil | Rolle | Rendering | Strichbreite | Ecken |
|---|---|---|---|---|
| **`inked`** | Default für UI + Raum-Panels | 2D-Canvas-Stroke (in Textur gebacken) | gleichmäßige Grundbreite `baseW` + organischer Wobble; gegenüberliegende Kanten gleich dick → konsistentes Gutter | fixe Ecken, `lineJoin:round` |
| **`torn`** | Effekt (ausgerissenes Papier) | 2D-Canvas-Stroke | Licht-Logik: oben dünn (`topW`) → unten dick (`botW`) | fix, hoher Jitter (≈9) |
| **`bend`** | Gekippte 3D-Panels der gebogenen Box | **screen-space 3D-Mesh** (nicht gebacken) | **konstante Pixel-Feder** unabhängig von Tiefe/Kippung → alle Flächen der Box gleich dick | echter **Miter + Limit**; **wobble-freie Eck-Zone** |

> `inked` **nie** mit `topW`/`botW` mischen — Licht-Logik gehört nur zu `torn`.
> `inked` vs. `bend` sind zwei Antworten auf dieselbe 3D-Frage — siehe §4.

---

## 3 · Mathematik & Logik

### 2D-Stile (inked/torn) — vier Bausteine
1. **`mulberry(seed)`** — seeded PRNG. Gleicher Seed → dieselbe `[0,1)`-Folge. Non-repetitive, stabil.
2. **`inkPerimeter(x0,y0,x1,y1,seed,jit)`** — läuft die 4 Kanten ab, Segmente ~34 px (`n = max(3, round(len/34))`); Zwischenpunkte um `±jit` px verschoben, **Ecken fix** (kein Jitter am Segment-Start).
3. **`drawInkOutline(g,pts,y0,hgt,opts)`** — der Strich:
   - `inked` (`uniform:true`): `lineWidth = baseW · (1 + wob·(smooth(i)−0.5)·2)` — geglätteter Low-Freq-Wobble über zweite Seed-Folge `wseed`.
   - `torn`: `lineWidth = topW + (botW−topW)·my` — linear nach vertikaler Position.
4. **`inkChip(g,…,opts)`** — Fill + Outline in einem, für UI-Boxen (bei Ist-Größe × dpr zeichnen).

### `bend` (screen-space 3D) — Referenz `infinite-journey.v2.js`
Kein Textur-Backen, kein 2D-Canvas. Die Tusche ist ein **Mesh in Screen-Space-Breite**:

1. **Perimeter = `brushLoop(...)`** — dieselbe Idee wie `inkPerimeter`, ABER mit **wobble-freier Eck-Zone**: pro Kante wird der Wobble in den letzten `margin = min(0.16·Kantenlänge, 64px)` an jedem Ende per **smoothstep** auf 0 gedämpft. Die Linie läuft dadurch **gerade in jede Ecke** → exakte Ecke bei JEDEM Wobble-Level. (Comiczeichner-Prinzip: erst die Ecke setzen, dann zittern.)
2. **Ein geschlossener Loop** — jeder Vertex kennt seinen `prev`/`next`. Der Vertex-Shader (`INK_VERT`) projiziert prev/cur/next in Screen-Space und offset­et entlang der **Miter-Winkelhalbierenden**: `ext = aHalf / max(dot(miter,n1), 0.5)`.
   - Frontale 90°-Ecke (Held) → `dot = cos45 = 0.707 > 0.5` → **echte scharfe Spitze**, ungedeckelt.
   - Steile Nachbar-Ecke (stumpfer Screen-Winkel) → `dot` klein → auf 0.5 gedeckelt (`ext ≤ 2·h`) → **sauber gefast** statt Spike (ungedeckelter Miter) oder Tab (Square-Cap).
3. **Konstante Pixel-Feder** — Breite lebt in Screen-Space (`uResolution`), NICHT in Weltmaßen. Dadurch sind Hero und Nachbarn immer gleich dick. `taper` moduliert subtil (thick-thin) über den Perimeter; `edge` verdickt die auslaufenden Ränder Richtung Bildrand (Framing).

> ⚠ **Nicht** die Breite in Weltmaßen setzen (lokale Geometrie). Das war der v1-Fehler: nahes/frontales Panel wurde ~2× dicker als die fernen — Screen-Space-Feder behebt es.

---

## 4 · 3D-Invariante — `inked` (Perspektive) vs. `bend` (Bildebene)

Zwei legitime, rotationssichere Wege, denselben Look auf die gekippten Panels der Box zu bringen:

- **`inked`-in-3D (Default, §Referenz `comic-cube.v2`):** die 2D-inked-Outline in die Panel-Textur backen und die **echte Perspektive** verjüngen lassen — ferne Kanten werden dünner, die Naht zum Held bleibt dick, gibt eine **räumliche Tiefen-Lesart**. Rotationssicher, weil die Textur uniform ist (keine eingebackene Richtung); Naht-Ausgleich über Faktor **`nbInk`** (1.0 = max. Flucht/Held-Fokus · höher = konsistentere Naht). Einfacher (statische Textur).
- **`bend` (Alternative, §Referenz `infinite-journey.v2`):** Screen-Space-Mesh mit **konstanter Pixel-Feder** — die Tusche liegt buchstäblich flach auf der Bildebene, ALLE Flächen gleich dick, auch die gekippten; Ecken über echten Miter. Kein perspektivischer Tiefen-Cue, dafür maximal „gezeichnete Linie auf dem Bild". Braucht einen Per-Frame-Shader (`uResolution`).

**Wahl:** Comic-Cube / Journey Default = **inked**. `bend` und `torn` als Tweaks on demand.
Eingebackene Richtungs-Verjüngung ist in BEIDEN Fällen verboten (überlebt keine Rotation).

---

## 4b · „Nie zweimal gleich" — Seed pro Raum

Alle drei Stile sind **seeded** (`mulberry(seed)`): gleicher Seed → identische Kante, anderer Seed →
andere Kante bei gleichem Stil. Damit jeder neue Raum sich handgezeichnet-anders anfühlt (frische
Gatter/Ink-Outlines, ohne je „falsch" auszusehen):

- **Seed aus der Raum-ID ableiten**, pro Panel eindeutig: z. B. `seed = raumIndex·131 + panelId`.
  Neuer Raum → neue Wobble-Kurve, andere Ausreißer, andere Eck-Mikroformen; Komposition + Stil bleiben konstant.
- Optional pro Panel leicht variierende Grundbreite/Wobble für zusätzliches Leben.
- **Kosten gering, weil einmal beim Raum-Aufbau** (nicht pro Frame): inked/torn = Panel-Texturen einmal
  neu zeichnen + hochladen · bend = `brushLoop` mit neuem Seed einmal neu bauen (kleines Mesh).
- Determinismus bleibt erhalten: derselbe Raum liefert bei Reload dieselbe Kante (QA/Caching/Snapshots).

---

## 5 · Parameter-Referenz

| Param | Gilt für | Einheit | Bedeutung |
|---|---|---|---|
| `seed` | alle | int | Zufallsfolge. Gleicher Seed = gleiche Kante. Pro Element eindeutig. |
| `jit` | inked/torn | px | Positions-Jitter. ≈4 ruhig (inked) · ≈9 ausgerissen (torn). |
| `baseW` | inked | px | Grundstärke des Strichs. |
| `wob` | inked | 0–1 | Wobble-Amplitude der Strichbreite. |
| `topW`/`botW` | torn | px | Breite oben/unten (Licht-Verlauf). |
| `nbInk` | inked-3D | × | Grundbreiten-Faktor Nachbar-Panels (Naht-Ausgleich gegen Perspektive). |
| `ink` | bend | px | Screen-Space-Feder-Breite (voll). Überall gleich. |
| `wobble` | bend | 0–2.5 | Wobble-Amplitude des Perimeters (Eck-Zone bleibt gerade). |
| `taper` | bend | 0–1 | subtiles thick-thin entlang des Perimeters (0 = konstant). |
| `edge` | bend | × | Verdickung der auslaufenden Ränder Richtung Bildrand (Framing). |
| Miter-Limit | bend | — | `dot`-Deckel (0.5 → max 2× Breite). Höher = spitzer, Risiko Spike am steilsten Winkel. |
| Eck-Zone `margin` | bend | px | wobble-freie Länge je Kantenende (`min(0.16·len, 64)`). |
| `color` | alle | hex | Tusche. Kanonisch `#191410` / `#1f1a14`. |
| `m` (Rand) | inked/torn | px | Sicherheitsrand ≥ halbe max. Strichbreite + jit. |

---

## 6 · Anwendungsrezepte

```js
// BUTTON (2D) — Akzent-Fill, mittlere Breite
inkChip(g, m, m, w-m, h-m, 41, { fill:'#b8361f', uniform:true, baseW:6, wob:.5, jit:1.6 });

// CARD / PANEL (2D inked) — geclippt, dann Outline
const pts = inkPerimeter(m, m, w-m, h-m, seed, 4);
drawInkOutline(g, pts, m, h-2*m, { uniform:true, baseW:11, wob:.5, wseed:seed });

// 3D-BOX-PANEL, bend — screen-space Ribbon-Mesh (siehe infinite-journey.v2 _inkRibbonMesh)
// V = brushLoop(...).map(toLocal); _inkRibbonMesh(V, corners, seedTaper, ink)
// Feder in Pixeln (ink), Miter+Limit im INK_VERT-Shader, Eck-Zone in brushLoop.
```

---

## 7 · Goldene Regeln — Do & Don't

**✓ Immer**
- Bei echter Zielgröße zeichnen (× dpr) — 2D; bzw. Feder in Pixeln halten — bend.
- Pro Element einen eigenen, stabilen `seed`.
- `lineCap`/`lineJoin='round'` (2D-Modul); echter Miter + Limit (bend).
- UI nach `document.fonts.ready` neu malen.
- Ecken sauber halten: keine Zipfelchen (Square-Cap-Tabs), keine Rundung. Ein Comiczeichner zeichnet keins von beidem.

**✕ Nie**
- `Math.random()` für die Kante.
- Outline als kleines SVG rendern und per CSS strecken.
- Richtungs-Verjüngung in eine rotierende Textur backen (§4).
- `inked` mit `topW`/`botW` mischen.
- **bend:** Feder in Weltmaßen statt Pixeln (→ Hero 2× dick, v1-Fehler).
- **bend:** Wobble bis in die Ecke laufen lassen (→ Zipfelchen); und Miter ungedeckelt (→ Spike am steilen Nachbarn).

---

## 8 · Ableitung — 3D Cel-Ink für Cube-Pets  *(PROPOSAL · nicht implementiert)*

Der 2D-Look lässt sich nicht 1:1 auf ein Mesh übertragen. Entsprechung = **Inverted-Hull-Silhouette**
mit variabler Breite (Schattenseite dicker, Distanz-Fade, `N·V`-Silhouette), Ink `#1f1a14`, an `LOOK=cel`
gekoppelt. Grenze (v6-Post-Mortem): „unten dicker" als reiner Vertex-Offset erzeugt Boden-Blobs; für
exakte licht-variable Breite bleibt Screen-Space-Depth/Normal-Sobel der Kandidat. Kontakt-Schatten
separat als harte, posterisierte Ink-Blobs (kein Blur).

---

## 9 · Caveats

- **Eingebackene Verjüngung × Rotation** — Taper in der Textur überlebt keine Panel-Rotation. Lösung: Perspektive + `nbInk` (inked) ODER Screen-Space-Feder (bend).
- **CSS-Skalierung der Outline** — immer Ist-Größe × dpr (2D).
- **Font-Timing bei UI-Chips** — nach `document.fonts.ready` neu malen.
- **Marge zu klein** — `m ≥ halbe max. Strichbreite + jit`.
- **bend Weltmaß-Falle** — Feder muss in Pixeln (Screen-Space) leben, sonst Tiefen-abhängige Dicke.
- **bend Miter-Spike** — ungedeckelter Miter explodiert an steilen Screen-Winkeln (`1/cos`); Deckel bei `dot ≥ 0.5`.

---

## 10 · QA-Checkliste

- [ ] Reload → identische Kante (Seed-Stabilität)?
- [ ] Gegenüberliegende Kanten optisch gleich dick? (inked: gleicher `baseW` · bend: gleiche Pixel-Feder auf allen Flächen)
- [ ] Gutter zwischen Panels konsistent?
- [ ] Keine abgeschnittene Tusche am Element-Rand?
- [ ] HiDPI (dpr 2): Linie scharf, nicht doppelt?
- [ ] Ecken: keine Zipfelchen, keine Rundung — auch bei hohem Wobble (bend: Eck-Zone)?
- [ ] Nach Rotation (3D): dieselbe Komposition, Naht dick (inked) / Feder gleich (bend)?

---

## 11 · Next Steps / TODO

- [x] `bend` als dritter Stil dokumentiert (dieser Doc, Referenz `infinite-journey.v2`).
- [ ] `bend`-Demo in die interaktive Spec-DC nachziehen (aktuell nur inked/torn).
- [ ] Optional: exakter Screen-Space-Taper als Shader-Pass für inked (falls Flucht > Perspektive gewünscht).
- [ ] 3D-Pet-Hull (§8) als POC gegen den v6-Hull testen.
- [ ] Farb-Token `#1f1a14` + Papier-Töne in ein KFB-Palette-Modul.

---

*Layer Zero gilt · kein Papier-Chrome · wonky bleibt.*
