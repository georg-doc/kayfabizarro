# UI / UX — Design-Sprache & Interaktionsmuster
Stand: 2026-07-05 · v1.3 · Begleitdoku zu `docs/ENGINE.md` (Technik) · DS: KayfaBizarro (bindend)

Wie die App sich anfühlt und warum. Zwei Welten in einem Bild: **blaue 3D-Tiefe**
(Erlebnis) trägt **cremefarbenes Papier-UI** (Instrument). Comic/Zine, aber entschlackt —
wenig Deko, wenige Größen, kein ALLCAPS, Ruhe vor Chaos.

---

## 1. Layout-Anker (Bildschirm-Geografie, fix)
```
┌─────────────────────────────────────────────────────────┐
│ Narrator-Box            [ Suche + Filter-Funnel ]        │  oben
│ (Wortmarke, Tier-Info)                                   │
│ Tier 1–7 + ↑            [ Detail-Window bei Auswahl ]    │  Mitte-oben
│ (linke Rail)                                             │
│                                                          │
│                     3D-EISBERG                           │  Erlebnis-Fläche
│                                                          │
│ Control-Hints                          [ FB-Cockpit ]    │  unten
│ (links, transparent)                   (draggable)       │
└─────────────────────────────────────────────────────────┘
```
- **Narrator-Box** links oben: Wortmarke „FrizzleBob's Kayfa[Bizarro]Iceberg", zeigt beim
  Tauchen Tier-Info + Tiefe (m). Speist sich aus `anchors` (View-Contract).
- **Tier-Rail** linksbündig darunter: Zahlen 1–7 + ↑-Surface. Klick → `goToAnchor`.
- **Detail-Window** rechts neben der Rail, bündige Oberkante. Erscheint bei Auswahl.
- **Suche + Filter** rechts oben kombiniert: Funnel-Icon togglet Chip-Reihe (Kategorie/
  Status/Guide-Mode/Absurdität). Progressive Disclosure — Chips erst auf Wunsch.
- **FB-Cockpit** rechts unten: draggable, minifybar (runder Avatar-Button + Mini-Toast).
- **Control-Hints** links unten: transparent, Hover = voll.

Prinzip: **Zentrum gehört dem Erlebnis (Berg), die Ränder halten das Instrument.**

---

## 2. Farbe
- **3D-Welt:** arktisch hell an der Oberfläche → tiefblau/dunkel im Abyss (`#0a1420`
  Body-BG). Fog + Kameralicht tragen die Tiefe.
- **UI-Papier:** `--paper-cream #f3ead3` (Fenster), `--paper-bone #ece1c0` (Sub-Panels).
- **Ink:** `--ink-black #1f1a14` (nie reines Schwarz), `--ink-charcoal #3a342a` (Body),
  `--ink-pencil #7d7364` (Meta/Credits).
- **Tier-Pastellcodierung:** Eisweiß → Gletscherblau über die 7 Tiers, für Zahlen UND
  3D-Node-Labels (visuelle Kopplung Rail ↔ Berg).
- **Kategorie-Washes:** aus `data.cats[].wash` (DS-Palette, transparent) — Kategorie-Badge
  in der Detail-Card.
- **Status-Stempel:** blood-red `#c2412c` (DEBUNKED/Danger) u. a. — als gestempelte Marke.
- Regel: Washes immer transparent über Papier, nie flach. Keine Gradient-als-UI.

---

## 3. Typografie (drei Stimmen, collagiert)
- **Fonteys PRO** (Serif) — ALLES UI: Body, Chat, Buttons, Platzhalter, Credits. 400/700/
  Italic. Rich-Text nutzt 700 (bold) + Italic (em).
- **Baby Eliot** (Hand) — NUR 3D-Node-Labels. Nirgends sonst.
- **Irish Grover** (Display, via Google Fonts) — NUR Headlines/Titel/Stempel (Fenster-Titel,
  REDACTED, „Uncle FrizzleBob").
- Wenige Größen: **12 / 13 / 15 / 20px**. „Uncle FrizzleBob" immer CamelCase. Kein ALLCAPS
  außer Ausruf-Stempeln (REDACTED, Calls).

---

## 4. Der Wobble (die Hand-Signatur)
Nichts sitzt plumb-square. Fenster/Stempel/Chips rotieren ±0.4–4° (aber siehe PAINT-REGEL!).
Ecken nutzen asymmetrische Wobble-Radien statt uniformer Rundung. Schatten sind HART und
warm (`4px 5px 0 rgba(31,26,20,0.35)`), nie Blur.

**Give-away-Falle (v1.3 teils gelöst):** derselbe Wobble-Radius auf jedem Fenster verrät
das Konstrukt — die untere-rechte Ecke ist überall gleich. Fix: jedes der 6 Fenster trägt
einen EIGENEN kuratierten Radius. Offen für Buttons/Chips: seed-basierter Radius-Pool
(`docs/TBD-irregular-outline.md`). Akzeptanz: zwei benachbarte Elemente ≠ gleiche Eck-Signatur.

---

## 5. PAINT-REGEL (bindend — dreimal erkauft, `docs/REVIEW-nodeclick.md`)
> **Scrollt ein Container, trägt weder er noch ein Vorfahr ein `transform`.**

Sonst malt Chrome/Safari rotierte Kinder (Buttons, Stempel, Chips, gerundete Bilder) beim
Scrollen nicht neu — Inhalt da, Pixel fehlen, sieht aus wie ein Maskierungs-Overlay.
- DS-Rotation → auf den äußeren, nicht-scrollenden **Rahmen**.
- Scroller innen: `overflow-y:auto` + `translateZ(0)` (eigene Composite-Ebene); seine Kinder
  dürfen rotieren.
- Bilder in Scroll-Containern: Safari clippt gerundete/transformierte eckig → festes
  Header-Bild + scrollender Text-Body (Bio-Window-Muster).
- Verifikation NUR per echtem User-View-Screenshot. DOM-Messung + html-to-image sind blind
  für Paint-Ausfälle.

---

## 6. Detail-Window (v4, das Referenz-Muster)
Rahmen außen (Wobble/Schatten, kein rotate, `overflow:hidden`) + Scroller innen (translateZ).
Inhalt in EINEM Flow, top→down:
1. Kategorie-Badge (wash) · Tier · Close-✗ (absolut am Rahmen)
2. Titel (Irish Grover)
3. **Evidence-Slot:** REDACTED-Stempel als immer gemalte Basis; verifiziertes Bild liegt
   drüber, wird imperativ auf `onload` enthüllt (opacity per ref, NIE im Template-Style).
   Credit-Link darunter (Wikimedia ↗). Kein Bild → nur REDACTED + „no verified image".
4. **Summary** (3–4 Sätze, Rich-Text) — der Kontext für Mainstream-Nutzer.
5. Quip (italic, „— FrizzleBob").
6. Dice-Face (Absurdität, `d6-N.svg`) + Status-Stempel (klickbar = FactCheck).
7. **good neighbours ☞** — max 3 Chips: echte Nachbarn (solid) → Dive; Ghosts (gestrichelt,
   halbtransparent, „+ Name") → LLM-Materialisierung. Der Köder für Tiefseetaucher.
8. Buttons: **check** / ☆ **save** / **rabbit holes…** (Stempel-Buttons, rotiert).

---

## 7. Interaktions-Vokabular (alles wobbelt, nichts snappt)
- **Hover:** leichte Rotation (±0.5°) / Mini-Scale (1.05) / Farb-Flip zu blood-red. Kein
  cleaner Opacity-Fade.
- **Press:** „stamp down" — 1–2px runter + leichte Verdunklung. Ins Papier gedrückt.
- **Entrance:** `cubic-bezier(0.34,1.4,0.64,1)` Overshoot, ~200–320ms. Card-Wiggle beim
  Landen (rotate −3°→+2°→0). **Ohne `both`**, wenn danach gescrollt wird (Transform darf
  nicht stehen bleiben → PAINT-REGEL).
- **Dice-Roll:** Face-Swap 60ms für ~600ms, dann Wobble-Rest.
- **Cockpit-Drag:** Pointer-Drag am Header; `dragging` unterdrückt Node-Hover.
- **Node-Picking:** nächstliegender sichtbarer Node gewinnt (nie DOM-Lotterie); Hover +
  Klick derselbe Pfad; Klick nach Drag geguardet (`suppressClick`).

---

## 8. Icons, Stempel, Rich-Text
- **Icons:** hand-gezeichnete Ink-SVGs auf BG (Speaker, ♪-Music, ⇩/⇧ Export/Import, Funnel).
  KEINE Icon-Fonts, KEIN Lucide/Material, KEIN Emoji.
- **♪-Music-Toggle:** rechts neben Speaker im Cockpit-Header, gleicher SVG-Stil; gefüllt =
  an, durchgestrichen = aus. Startet erst auf Klick (Autoplay-Policy).
- **Rich-Text:** `**bold**` (→ ink-black strong) + `*italic*` (→ em) in Chat/Summary/Quip.
  Sparsam (max 2–3/Reply). Storage & TTS bleiben plain.
- **Marginalia-Whitelist** (falls eingesetzt): `BLÖDSINN!`, `HUMBUG!`, `Stay fluffy!`,
  handgestempelt, rotiert. Kein Emoji, immer.

---

## 9. Voice (FrizzleBob)
Zweite Person, verschwörerisch-intim, Imperative über Erklärungen, Manifest-Kadenz. Kurze
Sätze. Er kommentiert Zustände (Atmo an/aus, Ghost-Grabung, FactCheck) in-character. Satire
mit Haltung: keine Truther-App — jede Verschwörung getaggt, gewürfelt, gestempelt. „Stay
fluffy." schließt.
