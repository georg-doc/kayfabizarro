# Handover — KayfaBizarro Viewer v1 → Claude Coworker (Lead)

**Von:** Claude Design (Fable 5) · **An:** Claude Coworker (Lead) · **Datum:** Session-Cut v1, Juli 2026
**Auftraggeber-Briefing:** `uploads/KAYFABIZARRO_VIEWER_HANDOVER.md` (Georg, v1.3) — bitte zuerst lesen, es ist die Spec.
**Vollständige technische Doku:** `docs/KFB_VIEWER_V1_DOKU.md` · **Backlog:** `docs/BACKLOG.md`

## Was existiert

1. **`kfb-viewer.js` (v1.1.0)** — das Viewer-Modul exakt nach Briefing: single-file vanilla JS, Shadow DOM, CSS+Canvas (pdf.js 3.11.174/cdnjs), `KayfabizarroViewer.mount(el, opts)`, Page-+Card-Mode, Paper/Dark/Light, arithmetischer selbstvalidierender Layout-Resolver, Karten-Overlay mit progressiver Disclosure (Power/Lore → Grade-Rationale/Art-Prompt), komplette Input-Map, per-Deck-Persistenz, Daten-API + headless `loadDeck()`.
2. **`KFB Deck Viewer.dc.html`** — Picker-Host: Testmatrix (8 Decks), GitHub-Discovery (Contents-API + statischer Fallback), Upload-Dropzone, EN/DE.
3. **`KFB Gameplay Stage.dc.html`** — Story-Table-Prototyp: Quest-Slot + D6-Progress-Tracker (1–6, Georgs SVG-Faces), 3 überschreibbare Scene-Slots, Actor-Slot mit Player-Tabs (1–6). Tischzustand strukturiert in `window.KFBStageContext`.
4. **`exports/*_standalone.html`** — Single-File-Builds (je ~18 MB, 4 Decks eingebettet via fetch-Shim).

## DoD-Status (Briefing §15)

| # | Kriterium | Status |
|---|---|---|
| 1 | GitHub-raw-Load + Upload, Paper-Theme | ✅ (raw-Umbau implizit: Discovery liefert `download_url`) |
| 2 | Page-+Card-Mode, Live-Toggle | ✅ |
| 3 | Standard-Deck B/C korrekt geschnitten + gemappt | ✅ |
| 4 | Abweichler → needs-review, Page-Fallback, kein Crash | ✅ (Epistemic Sabotage + World's Fair) |
| 5 | Overlay zeigt cardName/power/lore | ✅ (+ gradeReason/artworkPrompt) |
| 6 | Gutter-Live-Preview, Keyboard/Swipe/Mobile, 16+ Seiten flüssig | ✅ (LRU-Cache, lazy ±1) |
| 7 | Scharf auf jedem Zoom | ✅ (Re-Render statt CSS-Skalierung) |
| 8 | `mount()` ohne Style-Bleed, `destroy()` ohne Leak | ✅ (Shadow DOM; Listener/Canvas-Cleanup) |
| 9 | Reading-Order visuell verifiziert | ✅ Deck B S.2 TL = „The Doomsday Clock" → row-major bestätigt |

## Bewusste Erweiterungen gegenüber Briefing (bitte reviewen)

- **`grid.offset {x,y}`** (Shift-Slider): Die realen Seiten sind Sketchbook-Spreads mit Top-Header + Zierrand — symmetrische Margins können das Raster nicht unter den Header schieben. Center-Cut bleibt Default, API-Form `{margin,gap,offset}`, fließt durch `onGutterChange`.
- **Cover-Flip-Suggestion im needs-review-Banner:** wenn `ceil(cards/4)+(1−cover) === pages`, wird „Seite 1 als Karten werten" mit einem Klick angeboten (rekonziliert beide Test-Abweichler). Vom User explizit gewünschter manueller Override.
- **PDF-Load via `fetch`+Stream** statt pdf.js-URL-Transport: gleicher Progress, aber shimbar für Standalone-Builds.
- **Daten-API + `loadDeck()`**: für LLM-Agents/Integrationen (User-Anforderung dieser Session).
- **pageCount-Kreuzcheck** PDF↔JSON → needs-review bei Editions-Mismatch.

## Offene Fragen an Georg

1. `RAF`-Semantik (Briefing §17) — korreliert mit Extra-Seiten?
2. World's Fair: JSON-Kartenreihenfolge ≠ Seitenreihenfolge — Mapping pflegen oder JSON neu extrahieren?
3. MedKayfab: `WEB_v1`-PDFs vs. `ADD web`-JSONs — gleiche Kartentexte? Sonst passende JSONs liefern.
4. Repo-Inventar `media/kfb`: liegen alle Testmatrix-Decks dort in genau diesen Editionen? (Discovery-Pairing dann verifizierbar.)

## Schnelltest (5 min)

1. `KFB Deck Viewer.dc.html` öffnen → Deck B → Cover, `→` → „The Doomsday Clock" TL, `I` → Detail scrollen.
2. World's Fair → Banner „needs review" → **Apply** → 60 Karten im Card-Mode.
3. Settings (Zahnrad): Margin/Shift-Slider ziehen → Live-Recrop; Werte überleben Reload.
4. `KFB Gameplay Stage.dc.html` → Quest-Slot → Deck laden → Karte spielen → Würfel klicken → `window.KFBStageContext` in Console prüfen.
5. `exports/KFB_Deck_Viewer_standalone.html` lokal öffnen (nur 4 Decks in der Matrix = korrekt).

## Nächste Schritte

Siehe `docs/BACKLOG.md` — P1: Batch-Check-Skript über alle Deck-JSONs, Export-Modul (PNG/ZIP/Karten-PDF; `getCardCanvas` liegt bereit), GitHub-Pairing-Verifikation.
