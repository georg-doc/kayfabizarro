# KFB Living Illustration Engine — Exploration 01+02 · Evaluation

**Stand:** 2026-07-09 · **Artefakt:** `KFB Living Illustration Lab.dc.html` + `kfb-living.js` (v0.2.0)
**Brief:** `uploads/…/BRIEFING_KFB_Living_Illustration_Engine_Fable5.md` — ein Karten-Canvas, drei Treatments, ein Kriterium.
**Testkarte:** Deck A UTOPIA, Karte 1 „The Glossy Horizon" (Mood: *seductive, uncanny* → Preset `iridescent-slow`).
**Runde 2 (Feedback Georg + Perplexity-Notizen):** Intensitäten deutlich hochgedreht (Range bis 250 %), Deck + Karte per Tweaks umschaltbar (A/B/C — Default jetzt Deck B, weil Deck A untypisch glossy ist), zwei neue Treatments **D · Boil** und **E · Ken Burns**, und die Analyse ist jetzt **kartenadaptiv**: Quantil-Schwellen statt fixer Luminanzwerte (auf Pergament-Decks war sonst „alles hell"), und auf hellen Karten werden aus Licht-Staub **Ink-Motes/Schatten-Nebel mit multiply** — helle Partikel mit screen auf hellem Papier sind per Definition unsichtbar (der Grund, warum A in Runde 1 „zu subtil" wirkte).

## 1 · Die fünf Treatments (Deliverable 1+2)

Kriterium: *liest sich die Karte weiterhin als gedruckte Aquarell-Karte?*

**A · Atmosphere (Dust + Mist)** — ✅ besteht.
Partikel und Nebel liegen ÜBER der Malerei (screen/soft-light); die Illustration wird nie resampled — Druckqualität per Konstruktion erhalten. Risiko ist Kitsch (Schneekugel), nicht Uncanniness → sparsam halten (~26 Partikel, Alpha ≤ 0.35). Funktioniert subjekt­unabhängig auf jeder Karte.

**B · Depth (Luminanz-Pseudo-Tiefe + Parallax)** — ✅ besteht, mit Zaun.
Dunkel=nah-Heuristik, gefeatherte Maske, Auto-Orbit + Pointer. Lebendigste Variante unter dem Pointer, aber die gefährlichste: bei >~6 px Drift zeigt sich der Masken-Halo — genau der „Puppet"-Fehler, den das Briefing verbietet. Bei den verwendeten Amplituden (≤ 0.4 % der Kartenbreite) liest es sich als Karte in flacher Luft. Die Heuristik ist auf manchen Kompositionen falsch; ein echtes monokulares Depth-Modell (offline, einmal pro Deck) würde den Zaun entfernen.

**C · Shimmer (Iridescent Hue-Drift + Sheen)** — ✅ besteht, bester Mood-Fit — aber subjektabhängig.
Highlight-Maske (jetzt: hellste ~18 % der Karte, quantilbasiert) findet den Dom automatisch; der Farbverlauf landet exakt dort. Auf Karten ohne helle Fokusregion degradiert es zu fast nichts — korrektes Verhalten, aber kein Universal-Treatment.

**D · Boil (Squigglevision, neu in Runde 2)** — ✅ der KFB-native Kandidat.
Drei `feTurbulence`+`feDisplacementMap`-Filter mit verschiedenen Seeds, gestuft (~7 fps) getauscht — die Tuschelinie „kocht" wie handgezeichnete Animation. Passt zum punkig-dreckigen Register der normalen Decks deutlich besser als Shimmer. Läuft fast gratis (nur Filter-Swap pro Step, kein per-Frame-Redraw). Grenze: Displacement trifft das ganze Bild, nicht nur Outlines — Outline-only bräuchte Linien-Separation (Parking Lot).

**E · Ken Burns (neu in Runde 2)** — ⚠️ bricht bewusst die „stable frame"-Regel.
Langsamer Zoom + Pan der ganzen Karte. Falsch für Karten im Spiel, richtig für Cover, Kapitelstarts, Idle/Attract-Screens. Billig und überall zuverlässig.

## 2 · Empfehlung (Deliverable 3)

**Revidiert nach Runde 2: Default-„Living"-Mode = D (Boil) + A (Ink-Motes) geschichtet** — die kochende Linie trägt den handgezeichneten KFB-Charakter, sparsame Motes tragen die Zeit. C bleibt Mood-Akzent für glossy Subjects (Deck A), B nur als Pointer-Response (nie idle), E nur für Cover/Kapitel.

**Substrat: Canvas 2D reicht.** Drei Panels animieren simultan bei ~1400 px Backing-Breite, ein gemeinsamer rAF-Ticker, IntersectionObserver pausiert Offscreen-Panels, DPR-Cap 1.75. Kein WebGL nötig; erst wieder prüfen, wenn Flow-Maps (Wasser, Stoff) Anforderung werden. Passt zur bestehenden Realität: no-build, Shadow-DOM, mobile, kein CDN-Zusatz (kfb-living.js hat null Dependencies).

## 3 · Asset-Prep-Spec (Deliverable 4)

**Pflicht pro Karte: nichts.** Die Engine leitet alles aus dem flachen Bitmap ab:
- Luminanz-Analyse (128 px Downsample, einmalig, gecacht): Bright-Maske (Shimmer-Zone), Near-Maske (Pseudo-Tiefe), Durchschnittsfarbe (Partikel-Tint).
- `Mood` wird aus dem vorhandenen `artworkPrompt` geparst (`KFBLiving.parseMood`) → Preset-Tabelle (`iridescent-slow`, `near-still`, `ceremonial-sway`, `uneasy-flicker`, `default`).

**Optional, später, progressiv (nicht erforderlich):**
- gemalte Depth-Map pro Karte (ersetzt Luminanz-Heuristik in B)
- Flow-/Region-Maske („diese Pixel sind Wasser")
- explizites `living`-Feld im Deck-JSON (`{ preset, intensity }`) das den Mood-Parse übersteuert

## 4 · Integration Seam (Deliverable 5)

- Engine konsumiert exakt, was `getCardCanvas()` liefert — kein Eingriff in PDF-Handling, Slicing, Chrome.
- Vorschlag: `KayfabizarroViewer.mount(el, { living: true })` als dritter Render-Mode neben Cards/Pages; der Viewer reicht die gecroppte Kartenregion an `KFBLiving.attach(host, { card, mood, intensity })` und zerstört den Handle beim Slide-Wechsel (`handle.destroy()`).
- `prefers-reduced-motion` → Engine rendert selbstständig ein Still (bereits implementiert, live-reaktiv).
- Deck-JSON-Schema unverändert; EN/DE, Themes, Prefs unberührt.

## 5 · Bekannte Grenzen v0.1

- Maske via `ctx.filter='blur()'` — überall in modernen Browsern ok, Fallback wäre manueller Box-Blur.
- Compositing-Falle (gefixt): `destination-in` schneidet auf `alpha:false`-Contexts nichts aus (hinterlässt Schwarz) — maskierte Layer immer in Alpha-Offscreen-Canvas bauen, dann komponieren.
- Depth-Heuristik versagt auf hell-vorne/dunkel-hinten-Kompositionen (bekannt, siehe §1 B).

## Parking Lot (unverändert aus dem Brief)

Reading-Layer, LLM-Interpretation, Draw/Shuffle, Spreads, Sound, Deck-Generalisierung, Artifact-Packaging. Keine Entscheidung in v0.1 verbaut einen dieser Wege; einzige bewusste Weiche: Mood-Presets sind eine flache Tabelle in `kfb-living.js` und können später 1:1 ins Deck-JSON wandern.
