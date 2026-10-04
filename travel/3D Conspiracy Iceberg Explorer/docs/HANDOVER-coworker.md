# Handover — Claude Coworker (Weiterentwicklung als claude.ai-Artefakt)
Projekt: **3D Conspiracy Iceberg Explorer** · Stand 2026-07-05 · **v1.3**

## Auftrag
Den Explorer als deploybares **claude.ai-Artefakt** weiterführen. Kern steht & ist verifiziert;
ab hier: Live-LLM-Betrieb, Content-Kuration (Schema v2), Politur und der **Map-View** als
zweiter Navi-Layer auf derselben Engine. **Zuerst lesen:** `docs/ENGINE.md` (Technik),
`docs/UI-UX.md` (Design-Sprache), `docs/BUILD-as-artifact.md` (1:1-Artefakt-Bau).

## Architektur in 60 Sekunden (Details: docs/ENGINE.md)
- **`iceberg-data.js`** → `window.ICEBERG_DATA` `{ cats, statuses, tiers, entries[159], tours }`.
  Entry v1: `{ id, name, tier(1-7), cat, dice(1-6), status(debunked|unclear|art|real), quip }`.
  Entry v2 (optional, `docs/SCHEMA-v2.md`): `summary`, `related[]` (ids ODER Ghosts), `image`,
  `map`. Rückwärtskompatibel. Datensatz erweitern = Entries pushen; Layout folgt automatisch.
- **`iceberg-scene.js`** → `window.IcebergScene(container, data, callbacks)`. Berg + Atmosphäre;
  `onFrame(labels, depthInfo)` liefert viewport-gecullte 2D-Labels + `{depth, tier}`. Kamera:
  `flyToEntry`, `diveBy/orbitBy/zoomBy`. **VIEW-CONTRACT** (einzige Navi-Fläche für Features):
  `goToAnchor(id)` · `anchors` · `dragging` · `suppressClick`.
- **`atmo-engine.js`** → `window.AtmoEngine`. `start/stop/setTier(0..7)/duck/dispose`. synth mode
  (0 Assets) + auto tracks mode (7 MP3s). Hört nur auf Tier.
- **DC-Logic** (im `.dc.html`): State-Maschine für Auswahl, Touren, Filter, Chat, FactCheck,
  rabbit holes, **Ghost-Materialisierung**, Import/Export, TTS, Bio, deterministisches Picking.
  **View-agnostisch** — spricht die Szene NUR über den Contract.

## LLM-Integration (Kern-Thema fürs Artefakt)
- Aufruf: `window.claude.complete({ system, messages, max_tokens })`. Im Preview teils nicht
  verfügbar → **Fallback-Sprüche sind eingebaut, nicht entfernen.** Im Artefakt nativ = FB denkt echt.
- **Direktiven-Verträge** (parsebare letzte Antwortzeile, aus Anzeige gestrippt):
  `TOUR:[id1,…]` (5–15 Stops, shallow→deep) · `GOTO:[id]` · `STATUS:[debunked|unclear|art|real]`.
- **Masken-Prompt** `_maskPrompt()`: satirical / kayfabe / analytical. Instruiert jetzt auch
  Rich-Text (`**bold**`/`*italic*`, max 2–3/Reply) und Ghost-Nachbarn. Neue Maske = hier + Select.
- **Ghost/rabbit-hole-Rekursion:** `_materializeGhost` schreibt Entry + `related:[parent, +1 Ghost]`;
  rabbit holes → `related:[origin]`. Offline → ehrlicher Stub (`generated:true`). Der Wachstumsmotor.
- Bei echtem Deploy alle LLM-Pfade live testen (Preview-Fallback verdeckt Bugs).

## Export/Import-Format (JSON) — Format-Version 1
```json
{ "kayfabizarro_iceberg": 1, "mode": "custom", "tour": ["id"],
  "filters": {"cats":{}, "statuses":{}, "minDice":1},
  "bookmarks": ["id"], "factChecks": {"id":"text"},
  "entries": [ /* nur generierte/importierte Zusatz-Nodes, inkl. v2-Felder */ ] }
```
Import graftet unbekannte Entries live (Scene-Rebuild). **Map-View: Version auf 2 bumpen**,
`map`/`view` ergänzen, Merge-by-id v1-kompatibel halten (offener Todo).

## Do / Don't (hart erkauft — docs/REVIEW-nodeclick.md, docs/cuts/2026-07-05)
- **PAINT-REGEL (bindend):** scrollt etwas, trägt NICHTS darüber ein `transform`. DS-Rotation
  auf den äußeren Rahmen; Scroller innen `translateZ(0)`. Verifikation NUR per echtem
  User-View-Screenshot — DOM/​html-to-image sind blind für Paint-Ausfälle. (Dreimal erkauft.)
- DO: Inline-Styles (DC-Konvention). Fonteys UI-Text, Baby Eliot nur Nodes, Irish Grover nur
  Headlines/Stempel. Wenige Größen (12/13/15/20). Simple Blöcke > clevere Scroll/Clip.
- DO: bei „unsichtbar aber da" → Paint-Verdacht, Konstruktion vereinfachen, echten Screenshot.
- DON'T: `support.js` anfassen (generierte Runtime). `expr-*.png` direkt croppen (nur `avatar-*`).
  Bilder in Scroll-Container (Safari clippt). Fixes stapeln vor gemessener Root-Cause.
- DS KayfaBizarro (bindend): kein Emoji, keine cleanen Icon-Fonts, Buttons als Stempel (rotiert,
  harte Papier-Schatten), Farben aus DS-Palette, Wobble-Streuung (jedes Fenster eigener Radius).

## Backlog (priorisiert)
1. **theme.js + Pack-Format v2** — creme/rosa/dark Token-Set an einer Stelle; Export→v2 (`map`/`view`).
2. **Content-Sprint** — 159 Quips mit Rich-Text + `summary` + verifizierten `image`-Refs (Wikimedia
   pro Bild prüfen, kein ungeprüfter Link). Ghost-Köder kuratieren, was Nutzer ausgraben.
3. **Map-View** („Great Awakening Chart", nativer Nachbau) — Reihenfolge: Schema (steht) →
   Renderer/View-Switch mit ~15 Platzhaltern de-risken → Massen-Kuration. `docs/SPRINT-map-view.md`.
   Beide Views teilen Engine + Features (Contract). Georgs Entscheidungen stehen (Option B, ~150–250
   Nodes, Papier-Creme zuerst, dann Themes).
4. **11Labs-Atmo** — Georg generiert 7 Loops (`docs/ATMO-prompts.md`, A-Moll-Pin) → `assets/atmo/`.
5. **Wobble-Feinstreuung** Buttons/Chips (`docs/TBD-irregular-outline.md`, seed-Pool).
6. LLM live + **BYOK-Option** (eigener Key statt window.claude). Weitere FB-Masks. Mobile/Touch.
7. **Pack-Repo:** Georgs public GitHub als Content-Pack-Quelle (LLM→kuratiert→JSON gepflegt).

## Engine-Sync-Prinzip (wichtig für Map-View)
Iceberg- und Map-View teilen **eine Engine**: derselbe Datensatz (`icebergId`↔`map`), dieselben
FB-Features (Chat, Touren, FactCheck, rabbit holes, Ghosts), dasselbe Import/Export, dieselbe Atmo.
Neue Engine-Features immer so bauen, dass beide Views sie erben — nie view-spezifisch verdrahten.
Der View-Contract (`goToAnchor/anchors/dragging/suppressClick`) ist die Naht.
