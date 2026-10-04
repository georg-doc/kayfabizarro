# KayfaBizarro Deck Viewer — v1 Dokumentation (Check-in)

**Stand:** Session-Cut v1 · Modul `kfb-viewer.js` v1.1.0 · Juli 2026
**Basis:** `uploads/KAYFABIZARRO_VIEWER_HANDOVER.md` (Georg, v1.3) — alle „Nicht verhandelbar"-Punkte (§0) eingehalten.

---

## 1. Dateikarte

| Pfad | Rolle |
|---|---|
| `kfb-viewer.js` | **Das Modul.** Single-file, vanilla JS, kein Build-Step, Shadow-DOM-gescoped. Alles andere ist Host. |
| `KFB Deck Viewer.dc.html` | Page 1: Deck-Picker (Testmatrix, GitHub-Discovery, Upload) + Vollbild-Viewer |
| `KFB Gameplay Stage.dc.html` | Page 2: Story Table — Gameplay-Sim-Prototyp (Quest / 3 Scenes / Actor) |
| `pdfs/*.pdf` | 8 Test-Deck-PDFs, **kanonische saubere Pfade** (keine Leerzeichen/Klammern) |
| `decks/*.json` | Zugehörige Content-+-QA-JSONs (Georgs echtes Schema, unverändert) |
| `assets/d6-*.svg` | D6-Faces 1–6 (Georgs Originale; in der Stage zusätzlich als Data-URI inline generiert) |
| `uploads/` | Original-Uploads (Namen mit Leerzeichen) — nur Archiv, nicht referenziert |
| `exports/KFB_*_standalone.html` | Single-File-Builds (je ~18 MB, 4 Decks eingebettet) |
| `docs/` | Diese Doku, Backlog, Handover |

---

## 2. Modul `kfb-viewer.js`

### 2.1 Public API

```js
const viewer = KayfabizarroViewer.mount(targetEl, {
  source:   File | ArrayBuffer | Uint8Array | { url },  // PDF (URL wird per fetch geladen, mit Progress)
  deckData: DeckJson | { url } | null,                   // Content-JSON, optional
  mode:  'page' | 'card',            // default 'card'
  theme: 'paper' | 'dark' | 'light', // default 'paper'; sonst letzte User-Wahl (localStorage)
  grid:  { rows:2, cols:2, margin:{x,y}, gap:{x,y}, offset:{x,y} }, // Fraktionen 0..1
  cover: 'auto' | true | false,      // 'auto' = coverScore/coverQA-Signal aus deckData
  readingOrder: 'row' | 'col',       // default 'row' (an Deck B visuell verifiziert, DoD §15.9 ✓)
  showCardInfo: true,
  startIndex: 0,
  lang: 'en' | 'de',                 // default 'en'; sonst letzte User-Wahl
  title: '…',                        // Fallback-Titel wenn deckData fehlt
  onReady:  ({ pageCount, cardCount, slideCount, layoutStatus }) => {},
  onChange: (index, total) => {},
  onGutterChange: (grid) => {}
});
```

**Instanz-Methoden:** `next()` `prev()` `goTo(i)` `setMode(m)` `setTheme(t)` `setGrid(g)` `setCover(bool)` `toggleCardInfo()` `toggleFullscreen()` `setLang(l)` `destroy()`

**Daten-API (für Hosts, Apps, LLM-Agents):**
- `getDeckData()` — komplette Deck-JSON (roh)
- `getCardData(i)` — Karte i (0-basiert): `cardName, grade, power, lore, gradeReason, artworkPrompt, cardNumber`
- `getCurrentSlide()` — `{ index, kind:'cover'|'card'|'page', page, cardIdx, card }`
- `getDeckMeta()` — kuratierter Deck-Kontext: QA-Scores, `gradeDistribution`, `verdict`, `blurb`, `notes` (inkl. bekannter Bugs wie Font-Artefakte), `todos`, `topCards/worstCards`, `hashtags`, `marketingText`, `layoutStatus`
- `getCardCanvas(cardIdx, pxWidth)` → `Promise<canvas>` — Export-Vorbereitung (§19 Handover): Einzelkarten-Bitmap, on-demand in beliebiger Auflösung

**Headless (ohne UI):**
```js
const deck = await KayfabizarroViewer.loadDeck({ source, deckData, grid?, cover?, readingOrder? });
// → { pdf, deckData, cards, pageCount, cardCount, coverPages, layoutStatus,
//     getCardData(i), getCardCanvas(i, px), getCoverCanvas(px), destroy() }
```
Für Integrationen, die Karten aus mehreren Decks brauchen (Gameplay-Sim, Export-Batch).

### 2.2 Input-Map (alles instanz-gescoped, Fokus auf dem Viewer-Root)

| Input | Aktion |
|---|---|
| `←/→`, `↑/↓`, `PgUp/PgDn`, `Space` | prev / next |
| `Home` / `End` | erste / letzte Slide |
| `M` / `T` / `I` / `F` | Mode / Theme / Karten-Info / Fullscreen |
| `+` / `−`, Doppelklick | Zoom (re-rendert scharf, kein CSS-Blur) |
| `Esc` | Panel zu → Info zu → Zoom raus → (Fullscreen via Browser) |
| Swipe horizontal | prev / next |
| Twei-Finger-Trackpad / Mausrad | prev / next (Schwellwert 90, Lock 480 ms) |
| `Ctrl/Cmd + Wheel` | Zoom (Browser melden Trackpad-Pinch so) |
| Touch-Pinch (2 Pointer) | Live-Zoom (CSS), scharfes Re-Render beim Loslassen |
| Drag / Wheel bei Zoom > 1 | Pan |
| Tap-Zonen | links 22 % prev · rechts 22 % next · Mitte: Chrome togglen |

Chrome auto-hide nach 3,2 s Inaktivität (nicht bei offenem Panel/Info). `prefers-reduced-motion` respektiert.

### 2.3 Layout-Resolver (§6 Handover — Arithmetik, kein CV)

```
cover     = Override > opts.cover > (coverScore|coverQA vorhanden ? 1 : 0)
expected  = ceil(cardCount / (rows·cols)) + cover
layoutOK  = expected === pdf.numPages
```
- `layoutStatus: 'ok'` → deterministisch schneiden, Karten-Slides auf `cardCount` begrenzt
- `'needs-review'` → Page-Mode-Fallback + Banner. Banner bietet: **Apply** (Cover-Flip, wenn die Alternativ-Hypothese rechnerisch aufgeht — löst Epistemic Sabotage & World's Fair), **Cut 2×2 anyway** (`forceGrid`), **Dismiss**
- `'no-data'` → 2×2-Konvention, dezenter Hinweis
- Zusätzlich: `pdf.numPages ≠ deckData.pageCount` ⇒ needs-review (fängt Editions-Mismatch, z. B. MedKayfab WEB_v1-PDF vs. ADD-web-JSON)
- Cover-Toggle immer sichtbar im Settings-Panel (überschreibt alles, persistiert)

### 2.4 Grid-Schema & Schnitt

`{ rows, cols, margin:{x,y}, gap:{x,y}, offset:{x,y} }` — alles Fraktionen der Seitengröße.
- Default = reine Viertelung (Center-Cut, §0 MVP)
- `margin` symmetrisch, `gap` zwischen Zellen, **`offset` verschiebt das ganze Raster** (−10 %…+10 %) — nötig, weil reale Decks Header-Banner oben + Zierränder haben (Seiten sind „Sketchbook-Spreads")
- Settings-Panel: 6 Slider mit Live-Update; im Page-Mode Schnittlinien-Preview, im Card-Mode Live-Recrop; `onGutterChange` feuert nach außen
- Zellen→`cardNumber`: row-major (TL=1, TR=2, BL=3, BR=4), umschaltbar auf col-major

### 2.5 Rendering-Pipeline

- pdf.js **3.11.174** (cdnjs, gepinnt), Worker wird als **same-origin Blob** geladen (echter Worker-Thread; Cross-Origin-workerSrc fiele auf den langsamen Main-Thread-Fake-Worker zurück). **`isEvalSupported` nie deaktivieren** — ohne Eval explodiert die Renderzeit auf pattern-/funktionslastigen Seiten (World's-Fair-Cover: 54 ms vs. >45 s).
- PDF-Quelle `{url}` wird per `fetch` + Stream-Reader geladen (Progress-Balken; zugleich der Hook, über den Standalone-Builds Assets shimen)
- Render-Resilienz: Watchdog (30 s, `task.cancel()`), In-Flight-Dedupe wird auch bei Rejection geäumt, progressive Anzeige (schnelles 1536er-Bucket zuerst, Hi-Res ersetzt in place), sichtbarer Fehlerzustand statt leerer Bühne
- Seiten-Canvas-Cache: Key `page@pxBucket` (256er-Buckets, max 6144 px breit), LRU 5 Einträge, Pixel-Cap ~22 MP
- Karten-Slides croppen per CSS aus dem Seiten-Canvas (kein Pixel-Copy); Zoom re-rendert höher aufgelöst
- Lazy: aktuelle Slide ±1 vorgehalten
- **Kein WebGL/Three.js.** Nur CSS + Canvas (§0)

### 2.6 Persistenz (localStorage)

| Key | Inhalt |
|---|---|
| `kfb-viewer:prefs` | global: `{ theme, lang, showCardInfo }` |
| `kfb-viewer:deck:<sourceFile\|url\|filename>` | pro Deck: `{ cover, forceGrid, readingOrder, grid:{margin,gap,offset} }` |

### 2.7 Embedding & Scoping

- `mount()` erzeugt ein Host-`div` (100 %×100 %) mit **Shadow DOM** — kein Style-Bleed in beide Richtungen; Mehrfach-Mount kollisionsfrei
- `destroy()` räumt Listener, Canvases, pdf.js-Task und DOM ab
- Themes: Paper (warm, Grain via Canvas-Noise), Dark, Light — CSS-Variablen auf `.kv-root.t-*`

### 2.8 Fehlerfälle

- URL-Fetch scheitert (CORS/Dropbox/404) → klare Meldung + Upload-Hinweis, kein Crash
- deckData fehlt/kaputt → Viewer läuft mit Konvention, ohne Overlay/Validierung
- Passwort/leer/Portrait-PDF → pdf.js-Fehler wird als Meldung angezeigt

---

## 3. Page 1 — `KFB Deck Viewer.dc.html`

- **Testmatrix** (8 lokale Decks, `pdfs/` + `decks/`): A/B/C + 3× MedKayfab = Standard (56 c + Cover = 15 p ✓); Epistemic Sabotage + World's Fair = Abweichler (60 c, 15 p → needs-review; Cover-Flip rekonziliert). Badges zeigen den **erwarteten** Fall.
- **GitHub-Discovery:** `GET api.github.com/repos/georg-doc/kayfabizarro/contents/media/kfb` → PDFs mit JSONs gepairt (Namensbasis-Normalisierung: lowercase, non-alphanumerics raus, Präfix-Match). Fallback bei API-Fehler: statische raw-URL-Liste aus Handover §18. Rate-Limit 60 req/h unauthentifiziert.
- **Upload:** Dropzone + Picker, PDF + optionale JSON (Multi-Drop, Typen werden sortiert). JSON wird geparst und als Objekt übergeben.
- **Sprache:** EN default, DE-Toggle (Picker-Chrome); Viewer hat eigenen EN/DE-Button, beides persistiert.
- **Tweaks-Props:** `startTheme`, `startMode`, `uiLang` (Host-Ebene, via Tweaks-Panel).
- **Anchors:** `data-screen-label="Deck Picker"` / `"Viewer"`.
- Standalone-Modus: filtert die Matrix auf `window.__KFB_EMBEDDED` (s. §5).

---

## 4. Page 2 — `KFB Gameplay Stage.dc.html` (Story Table, Prototyp)

**Slots:** Quest (oben, Akzent Rust `#A6512E`) · 3 Scene-Slots (Mitte, „full stage": Neuzuweisung überschreibt) · Actor (unten, Akzent Grün `#5E8C61`, pro Spieler einer, Tabs P1–P6, „●" = belegt). Spielerzahl 1–6 umschaltbar.

**Quest-Tracker:** D6-Faces 1–6, zentriert unter der Quest-Karte. States: *future* = 38 % Opacity + Graustufen · *reached* = voll · *active* = angehoben + Rust-Schatten · *hover* = voll + Lift · Klick auf aktives Face = Schritt zurück. SVGs werden aus Pip-Koordinaten + Georgs Wobbly-Path als Data-URI generiert (`diceSrc(n)`) — funktioniert dadurch auch im Single-File-Build.

**Card-Picker:** Overlay, links Deck-Pool (lazy geladen via `loadDeck`, Status-Anzeige), rechts Kartenliste (G-Badge, Name, Power-Preview). Klick weist zu.

**Deck-Sonderfälle:** `worldsfair` und `sabotage` werden mit `cover:false` geladen (Seite 1 = Karten), damit Index→Zelle stimmt.

**Agent-Schnittstelle:** `window.KFBStageContext` — bei jedem Zug aktualisiert:
```json
{
  "players": 2, "activePlayer": 1, "questProgress": 3,
  "quest":  { "deck": "…", "deckId": "…", "cardIndex": 12, "cardNumber": 13,
              "cardName": "…", "grade": 1, "power": "…", "lore": "…",
              "gradeReason": "…", "artworkPrompt": "…" },
  "scenes": [null, {…}, {…}],
  "actors": [{ "player": 1, "card": {…} }, { "player": 2, "card": null }]
}
```
Ein Story-Agent liest den Kontext, erzählt Beats zu den liegenden Karten und kann via Picker-Logik (`assign`) neue Karten einblenden lassen.

---

## 5. Standalone-Builds (`exports/`)

- Gebaut aus den DC-Pages via Bundler + nachgelagertem **fetch-Shim-Inject**: `<script>` direkt nach `<head>` patcht `window.fetch` und liefert eingebettete Assets (PDF base64, JSON text) aus; `window.__KFB_EMBEDDED` listet sie.
- **Eingebettet: 4 Decks** (A Utopia, B Dystopia, MedKayfab Cardiology, World's Fair) ≈ 18 MB/Datei — Grund: 20-MB-Dateilimit des Projekt-Dateisystems; alle 8 wären ~34 MB. Upload + GitHub-Discovery funktionieren im Standalone unverändert (Netz vorausgesetzt).
- **Netz-Abhängigkeiten auch standalone:** pdf.js von cdnjs + Google Fonts (Archivo). Für echtes Offline: pdf.js selbst hosten/einbetten (Backlog P2).
- Rebuild-Rezept: `super_inline_html` auf die DC-Page → Shim-Skript (siehe Chat-History / `docs/BACKLOG.md` P3 „Build-Skript versionieren").

---

## 6. Abhängigkeiten & Konventionen

- **pdf.js 3.11.174** (cdnjs, `pdf.min.js` + `pdf.worker.min.js`) — einzige Runtime-Dependency des Moduls
- **Archivo** (Google Fonts) — nur Host-Pages; Modul fällt auf Helvetica/system-ui zurück
- Farb-System (Paper): BG `#F4EFE6` · Fläche `#FBF8F1` · Ink `#26221C` · Muted `#7B7368` · Akzent Rust `#A6512E` · Grün (Actor/JSON-Signal) `#5E8C61` · Würfel-Creme `#F3EAD3` / Ink `#1F1A14`
- Mono: `ui-monospace/Menlo`-Stack (keine Font-Ladung)

---

## 7. Bekannte Issues / Ehrlichkeiten

1. **World's Fair:** JSON-Kartenreihenfolge ≠ Seitenreihenfolge (Deck-Irregularität, Seite 1 = Cover+4 Karten, 15 benannte Sets). Betrifft nur Overlay-Labels, nicht den Schnitt. → Backlog: per-Deck-Mapping.
2. **MedKayfab:** Projekt-PDFs sind `WEB_v1`-Edition, JSONs beschreiben `ADD web`-Edition. Zahlen stimmen zufällig überein (56/15) — Kartentexte könnten abweichen. Resolver flaggt nur bei pageCount-Differenz.
3. **Header-Bleed:** Seiten haben Titelbanner + Zierränder → Center-Cut zeigt Nachbar-Anschnitt. Per Design akzeptiert (§0/§6); Regler `margin`+`offset` justieren, Werte persistieren pro Deck.
4. Font-Artefakte in manchen Decks (z. B. „Courier Prime" als Text auf ~24 World's-Fair-Karten) sind **Deck-Bugs**, dokumentiert in `getDeckMeta().notes/todos`.
