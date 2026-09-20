# 3D Conspiracy Iceberg Explorer — Dokumentation
Stand: 2026-07-04 · **Version: v1.3** (Atmo-Engine: tiefen-morphender Underwater-Drone + Tracks-Pipeline)

## Was ist das?
Immersiver Three.js-3D-Explorer für den Conspiracy Iceberg mit Uncle FrizzleBob
(KayfaBizarro) als satirisch-investigativem Guide. Keine Truther-App: jede
Verschwörung ist getaggt, gewürfelt (Absurdität ⚀–⚅) und gestempelt
(DEBUNKED / UNCLEAR / ART PIECE / DECLASSIFIED) — Medienkompetenz im Fellmantel.
Gedacht als deploybares **claude.ai-Artefakt** (LLM-Chat/Touren/FactCheck live).

## Dateien
| Datei | Rolle |
|---|---|
| `Conspiracy Iceberg Explorer.dc.html` | Haupt-Design-Component (Template + Logic, ~990 Zeilen) |
| `iceberg-data.js` | `window.ICEBERG_DATA` — **159 Entries**, 7 Tiers (24/24/24/24/24/22/17), 10 Kategorien, 4 Status, kuratierte Tour (28 Stops). **v2-Felder optional** (`summary`/`related`/`image`/`map`, s. `docs/SCHEMA-v2.md`); mkultra & philadelphia tragen sie als Referenz |
| `iceberg-scene.js` | `window.IcebergScene` — Three.js-Szene (r128 via CDN): Berg-Mesh, Wasser, Bubbles, Tiefen-Atmosphäre, Kamera, Label-Projektion **+ Viewport-Culling** |
| `support.js` | DC-Runtime (generiert — NICHT anfassen; ältere Version, Komponenten sind dagegen gebaut) |
| `Conspiracy Iceberg Explorer.standalone.html` | Self-contained Offline-Build (alle Assets inline) — zum Weitergeben/Archiv |
| `assets/mascot/avatar-*.png` | Runde Avatare (zentrierter 256px-Crop, Möhre sichtbar) — smug / psychedelic / cosmic-panic / weeping |
| `assets/mascot/expr-*.png` | Original-Plates (Karopapier + Doodles eingebacken — NIE direkt in runden Frames; nur Quelle für avatar-Crops) |
| `assets/dice/`, `assets/paper-grain.svg` | genutzte DS-Assets (Würfel-Refs im Code = Absurdity-Faces, Papier-Grain als Chat-BG) |
| `assets/kit/`, `assets/stamps/` | DS-Kit (frames, tapes, badge) + Stempel (bingo/blodsinn/humbug/pwyw) — für Map-View & Marginalia eingeplant |
| `assets/atmo/tier-1..7.mp3` | **optional** — Georgs 11Labs-Loops; Präsenz aller 7 = Atmo-Tracks-Mode (sonst synth) |
| `fonts/` | Baby Eliot (Nodes), Fonteys PRO (UI/Body, 400/700/Italic). Irish Grover (Headlines) via Google-Fonts. **Clobberin/Coalfield entfernt (unused).** |
| `atmo-engine.js` | `window.AtmoEngine` — prozedurale WebAudio-Unterwasser-Atmo (synth mode, 0 Assets): Brown-Noise-Wasser, A-Drone, Intervall-Morph (Quinte→Tritonus→kl. Sekunde), Detune-Schwebungen, Sonar-Pings mit Feedback-Delay; je tiefer desto düsterer/psychedelischer (`setTier(0..7)`, träge Ramps). Liegen `assets/atmo/tier-1..7.mp3` vor (11Labs, s. `docs/ATMO-prompts.md`) → auto **tracks mode** mit Crossfades, Synth als Glue. `duck()` senkt bei FB-TTS ab |
| `docs/` | diese Doku · `ENGINE.md` (Technik-Referenz) · `UI-UX.md` (Design-Sprache) · `BUILD-as-artifact.md` (1:1-Artefakt-Bau) · Handovers · `REVIEW-nodeclick.md` (Paint-Saga forensisch) · `SCHEMA-v2.md` (bindend) · `ATMO-prompts.md` · `TBD-irregular-outline.md` · `SPRINT-map-view.md` · `cuts/` (Session-Cuts) |
| `Schema v2 Reader.dc.html` | HTML-Reader des Schemas mit Live-Beispiel-Cards (Wikimedia-Thumb + Redacted-Demo) |
| `templates/KayfabPaperDoc.template.html` | wiederverwendbares Paper-Doc-Template, inline-dokumentiert, portabel (Skill-tauglich; Fonteys degradiert zu Georgia) |

## Feature-Inventar (Version-Check ✓ = implementiert & verifiziert)
### 3D-Welt
- ✓ Eisberg-Mesh (organisch verrauscht), Wasseroberfläche, Tier-Bänder 1–7
- ✓ Tiefen-Atmosphäre: arktisch hell → tiefblau/dunkel; Fog + Kameralicht
- ✓ Bubbles/Marine-Snow (rund, erst unter der Oberfläche)
- ✓ Controls: Drag = orbit + dive · Scroll = Zoom · W A S D · ←/→ Tour · Space = Play/Pause
- ✓ Node-Labels: Baby Eliot, Tier-Pastellcodierung (Eisweiß→Gletscherblau), Ink-Outline, Fade nach Distanz/Winkel
- ✓ **Deterministisches Picking** (v1.1): Labels `pointer-events:none`, Nearest-Center-Picker am Container, Viewport-Culling (keine Geister-Hitboxen), Dekluttering (keine zwei Labels überlappen) → Klick trifft immer den sichtbaren Node

### UI (Comic/Zine-Look, entschlackt)
- ✓ Narrator-Box links oben: Wortmarke „FrizzleBob's Kayfa[Bizarro]Iceberg" (Link → kayfabizarro.pages.dev), zeigt beim Tauchen Tier-Info + Tiefe (m)
- ✓ Tier-Zahlen 1–7 + ↑-Surface-Button linksbündig darunter
- ✓ Detail-Window rechts daneben: Kategorie, Tier, Quip („— FrizzleBob"), Absurdität, Status-Stempel (klickbar = FactCheck) + Buttons **check / ☆ save / rabbit holes…** — **v1.1: einfacher content-großer Block** (keine Scroll-/Clip-Konstruktion → kein Paint-Ausfall)
- ✓ **v1.2 Detail-Card v2:** Evidence-Thumb (nur geprüfte Wikimedia-Referenzen, Credit-Link) mit **REDACTED-Default** (fehlend/Ladefehler/offline → gleicher Stempel); `summary`-Block (3–4 Sätze, faktentragend) vor dem Quip; **good neighbours ☞** max 3 Related-Chips — echte Nachbarn → Dive, **Ghosts** (halbtransparent, gestrichelt) → LLM-Materialisierung via `_materializeGhost` (Offline-Fallback: ehrlicher Stub, `generated:true`, Ghost-Ref wird durch echte id ersetzt). **v1.2.2-Rebuild (Detail-Window v3):** EIN content-großer Flow — kein Header/Body-Split, keine Masken-Ebenen (Falle #3); Karte scrollt nur als Ganzes (`max-height: calc(100vh - 190px)`, greift nur auf kurzen Screens). Evidence-Slot: REDACTED-Basis immer gemalt, Bild liegt drüber und wird **imperativ** per `el.style.opacity` auf `onload` enthüllt — opacity darf NICHT im Template-Style stehen (React re-applied sie sonst bei jedem Re-Render) und KEINE CSS-Transition tragen (hängte als ewig laufende CSSTransition bei computed 0). `onerror` → bleibt redacted, kein State/forceUpdate. Bio schließt automatisch bei Node-Selektion (`_select` → `showBio: false`); Bio offen blendet Detail aus, letzter Klick gewinnt
- ✓ **v1.2.3 PAINT-REGEL (BINDEND, Detail-Window v4):** Ein scrollender Container darf **niemals** selbst ein `transform` tragen oder einen transformierten VORFAHREN haben — Chrome malt beim Scrollen rotierte KINDER (Buttons, Stempel, Chips) nicht neu: Inhalt bleibt im DOM, Pixel fehlen („maskiert"; Beweis: untransformierte Dash-Linien wurden gemalt, rotierte Buttons daneben nicht). Konstruktion: Rahmen-Div außen (Border/Wobble-Radius/Schatten, `overflow: hidden`, KEIN rotate) + Scroller innen (`overflow-y: auto` + `transform: translateZ(0)` = eigene Composite-Ebene; Kinder dürfen rotieren). Karten-Rotation (0.6deg) dafür geopfert; Entrance-Wiggle ohne `both` (Transform darf nach Animationsende nicht stehen bleiben). **DOM-Checks/Screenshots können diesen Bug-Typ nicht sehen** (Geometrie stimmt, GPU malt nicht; html-to-image re-rendert) — bei Scroll-Änderungen immer die zwei Invarianten prüfen: `getComputedStyle(scroller).transform` = identity/none-artig UND kein Vorfahr mit `transform !== 'none'`
- ✓ **v1.2.4:** (a) **Absurdity als Dice-Face** — `assets/dice/d6-N.svg` statt „3/6"-Text in der Detail-Card (Tooltip behält Zahl). (b) **Rich-Text-Pipeline**: `_rich()` rendert `**bold**`/`*italic*` aus Daten- und LLM-Strings als strong/em — Storage & TTS bleiben plain (TTS strippt `*`); gilt für Chat, Summary, Quip; `_maskPrompt` instruiert LLM zu sparsamer Auszeichnung (max 2–3/Reply); Bestands-Quips werden im Content-Sprint angereichert. (c) **Ghost-/rabbit-hole-Nachbarn**: materialisierte Ghosts bekommen `related: [parent, +1 frischer LLM-Ghost-Köder]`, rabbit-hole-Nodes `related: [origin]` — der Bau bleibt rekursiv bewohnbar. (d) **Wobble-Streuung**: alle 6 Fenster (Banner, Detail, Bio, Search-Dropdown, Filter, Cockpit) tragen jetzt je einen EIGENEN kuratierten Radius — der „gleiche Ecke unten rechts"-Give-away ist weg; Buttons/Chips-Streuung siehe docs/TBD-irregular-outline.md (offen). (e) Neue DS-Assets kopiert: `assets/kit/` (frames, tapes, badge), `assets/stamps/` (bingo/blodsinn/humbug/pwyw)
- ✓ **v1.3 Atmo:** ♪-Toggle im Cockpit-Header (rechts neben Speaker, gleicher Hand-SVG-Stil); startet erst auf Klick (Autoplay-Policy: AudioContext braucht Geste). `_onFrame` füttert `setTier` (guarded, billig); TTS duckt die Atmo automatisch (`u.onend` → unduck); Unmount disposed. FB kommentiert an/aus in Voice. Ausbaustufe dokumentiert in `docs/ATMO-prompts.md`: 7 standalone 11Labs-Prompts, alle auf **A-Moll-Root gepinnt**, damit tier-weise Crossfades trotz unabhängiger Generierung harmonisch bleiben
- ✓ **v1.2 View-Contract** (docs/SCHEMA-v2.md §6): Szene kapselt `goToAnchor` / `anchors` / `dragging` / `suppressClick` — Feature-Schicht schreibt kein `targetDepth` und liest keine `_moved`/`_dragging`-Interna mehr (Vorarbeit „eine Engine, zwei Views")
- ✓ Suche + Filter kombiniert rechts oben (Funnel-Icon-Toggle; Chips: Kategorie, Status, Guide-Mode, Absurdität ⚀+)
- ✓ FB-Cockpit rechts unten: draggable, Minify (runder FB-Button + Mini-Controls + Toast-Untertitel), Chat, `< ▶ >`, Modus-Dropdown mit Counter „(2/159)", Header-Icons: Speaker (TTS) / ⇩ Export / ⇧ Import / ▾ Minify
- ✓ Bio-Window (Klick auf FB-Avatar): fester Header (Avatar cycled Moods) + scrollender Body, „Cut & Play Comics"-Link, „Stay fluffy."-Signatur
- ✓ Control-Hints links unten (transparent, Hover = voll)

### FrizzleBob / LLM (`window.claude.complete` — voll im deployten Artefakt; hier Fallback)
- ✓ Chat mit Masken-Systemprompt; Guide-Mode im UI umschaltbar (satirical / kayfabe / analytical)
- ✓ Tour-Builder per Chat (`TOUR:[ids]`), `GOTO:[id]`
- ✓ FrizzleFactCheck (Stempel/Check-Button): 3–4 Sätze, ehrliche Re-Klassifikation (`STATUS:[…]`), gecacht
- ✓ „rabbit holes…": LLM generiert Nachbar-Nodes, live an den Berg gepfropft
- ✓ FB-Expression folgt Tauchtiefe (smug → psychedelic → cosmic panic → weeping)
- ✓ TTS via Browser-SpeechSynthesis, opt-in

### Touren & Session
- ✓ Curated Descent (28 Stops) · I Feel Lucky (Shuffle) · Custom (LLM-gebaut)
- ✓ Autopilot (Play/Pause, Tweak `autopilotSecs` 3–20s)
- ✓ Export/Import JSON: Tour, Filter, Bookmarks, FactChecks, generierte Entries

### Tweaks (Host-Panel)
- `fbMask` (enum, Default für Guide-Mode) · `autopilotSecs` (range)

## Gelöste Stolperfallen (NICHT wieder einbauen!)
1. **Mascot-PNGs enthalten Karopapier/Doodles.** Nie `expr-*.png` mit CSS croppen — immer die fertigen `avatar-*.png` (zentrierter Crop) verwenden.
2. **Safari clippt runde/transformierte Bilder in Scroll-Containern eckig.** Bilder nie in `overflow-y:auto` → Muster: fester Header + scrollender Body (Bio-Window).
3. **„Unsichtbar aber klickbar" = Paint-/Compositing-Verdacht, nicht CSS.** Computed Styles beweisen keine Pixel. **Konsolidierte PAINT-REGEL (dreimal erkauft — Bio-Bild/Buttons/Card-v2, `docs/cuts/2026-07-05` §2):** *scrollt ein Container, trägt weder er noch ein Vorfahr ein `transform`* — sonst malt Chrome/Safari rotierte Kinder (Buttons/Stempel/Chips) beim Scrollen nicht neu. DS-Rotation auf den äußeren Rahmen; Scroller innen `translateZ(0)`. Verifikation NUR per echtem User-View-Screenshot (DOM/​html-to-image sind blind). Siehe `docs/REVIEW-nodeclick.md` (Nachtrag 2).
4. **Klick-Ziel ≠ sichtbarer Node** kam von Geister-Labels (kein Viewport-Cull) + DOM-Hit-Test-Lotterie. Fix: Viewport-Cull in der Scene + zentraler Nearest-Picker.
5. **DC-Live-Edits laden Template & Logik getrennt** → Misch-Zustände auf der laufenden Seite (z. B. leere Buttons). Nach Edit-Serien Hard-Reload; transiente ≠ persistente Symptome.
6. ALLCAPS vermeiden; „Uncle FrizzleBob" CamelCase; UI-Text = Fonteys, wenige Größen (12/13/15/20px). Borders 1.5–3px, kein Vollschwarz bei dünnen Linien.

## Lizenz/DS
KayfaBizarro Design System (CC BY-NC-SA 4.0). Inline-Styles only (DC-Konvention).
