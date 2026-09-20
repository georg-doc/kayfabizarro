# BUILD — die App 1:1 als claude.ai-Web-Artefakt bauen
Stand: 2026-07-05 · v1.3 · Bauanleitung für ein einzelnes, deploybares React-Artefakt

Ziel: den Explorer als **ein einziges HTML/React-Artefakt** rekonstruieren, das direkt in
claude.ai läuft — mit **nativem** `window.claude.complete` (FrizzleBob lebt dort voll).
Diese App ist hier als **Design Component (`.dc.html`)** gebaut (DC-Runtime `support.js`).
Ein claude.ai-Artefakt nutzt stattdessen plain React. Die Übersetzung ist mechanisch; diese
Doku sagt, was 1:1 übernommen wird und was sich ändert.

---

## 0. Zwei Wege
**Weg A — Standalone (offline, unverändert).** `Conspiracy Iceberg Explorer.standalone.html`
ist der self-contained Build (alle Assets/Fonts/Scripts inline). Läuft offline im Browser.
LLM: nur die eingebauten Fallback-Sprüche (kein `window.claude`). Zum Archivieren/Weitergeben.

**Weg B — claude.ai-Artefakt (live LLM, dieser Guide).** Neu als React-Single-File, damit
FrizzleBob per `window.claude.complete` echt denkt. Das ist der Deploy-Zielzustand.

---

## 1. DC → React: die Übersetzungstabelle
| DC-Konstrukt | claude.ai-Artefakt (React) |
|---|---|
| `class Component extends DCLogic` | `class Explorer extends React.Component` (identische Methoden!) |
| `renderVals()` → Template-Holes | `render()` mit JSX; dieselben Werte inline |
| `<x-dc>`-Template + `{{ hole }}` | JSX; `{{ x }}` → `{x}`, `sc-for` → `.map()`, `sc-if` → `{cond && …}` |
| `ref="{{ setFoo }}"` | `ref={this.setFoo}` |
| `onClick="{{ fn }}"` | `onClick={fn}` |
| `style="a: b; c: d"` | `style={{ a:'b', c:'d' }}` |
| `<helmet>` scripts | `<script>` im `<head>` des Artefakts |
| `support.js` (DC-Runtime) | **entfällt** — React direkt |
Die **Logik-Klasse wird fast wörtlich übernommen** (State-Maschine, `_select`, `_factCheck`,
`_materializeGhost`, `_maskPrompt`, Picking, Import/Export). Nur `renderVals()` → `render()`
mit JSX statt Holes. Das ist der Löwenanteil und der einfache Teil.

---

## 2. Datei-Struktur des Artefakts
```
<!DOCTYPE html><html><head>
  <script src="https://cdnjs…/three.js/r128/three.min.js"></script>   <!-- extern ok -->
  <script src="https://unpkg.com/react@18…"></script>                 <!-- oder Artefakt-Runtime -->
  <script src="…/babel-standalone…"></script>                          <!-- falls JSX -->
  <style> @font-face … · @keyframes … · scrollbar … </style>
</head><body>
  <div id="root"></div>
  <script>window.ICEBERG_DATA = {…}</script>   <!-- iceberg-data.js inline -->
  <script>window.IcebergScene = …</script>      <!-- iceberg-scene.js inline, UNVERÄNDERT -->
  <script>window.AtmoEngine = …</script>        <!-- atmo-engine.js inline, UNVERÄNDERT -->
  <script type="text/babel">…Explorer + ReactDOM.render…</script>
</body></html>
```
**`iceberg-scene.js` und `atmo-engine.js` werden UNVERÄNDERT inline geklebt** — sie sind
schon plain JS auf `window.*`, view-agnostisch, kennen kein DC. Nur die DC-Logic wird zu
einer React-Klasse.

---

## 3. Was 1:1 bleibt (nicht neu erfinden)
- **`iceberg-scene.js`** — Three-Welt + View-Contract (`goToAnchor/anchors/dragging/
  suppressClick`, `flyToEntry/addEntries/dispose`, `onFrame`). Komplett wiederverwenden.
- **`atmo-engine.js`** — `start/stop/setTier/duck/dispose`. Komplett wiederverwenden.
- **`iceberg-data.js`** — Datensatz. Inline als `window.ICEBERG_DATA`.
- **Alle Feature-Methoden** der Logic — Auswahl, Touren, Filter, Chat, FactCheck, rabbit
  holes, Ghost-Materialisierung, Import/Export, TTS, Picking. Wörtlich.
- **Direktiven-Verträge** — `TOUR:[ids]` · `GOTO:[id]` · `STATUS:[…]` als parsebare letzte
  Antwortzeile. Wörtlich.
- **PAINT-REGEL** (kein transform über Scrollern), Picking-Determinismus, alle Stolperfallen.

---

## 4. Was sich ändert
- **`window.claude.complete`** ist im Artefakt NATIV verfügbar → FrizzleBob denkt echt.
  Trotzdem **Fallback-Sprüche behalten** (Rate-Limits/Fehler). Signatur unverändert:
  `await window.claude.complete({ system, messages:[{role,content}], max_tokens })` → String.
- **Assets:** Avatare (`assets/mascot/avatar-*.png`) + Dice (`assets/dice/d6-N.svg`) als
  **data-URIs** inline, ODER auf Georgs GitHub hosten (`raw`/jsDelivr, CORS offen) und per
  URL referenzieren. Fürs Artefakt sind data-URIs am robustesten (offline-fest).
- **Fonts:** Baby Eliot + Fonteys PRO als base64-`@font-face` inline; Irish Grover via
  Google Fonts `@import` (extern ok). Ohne Inline degradiert Fonteys → Georgia.
- **Atmo-MP3s:** falls tracks mode gewünscht, 7 Dateien hosten (nicht base64 — zu groß) und
  `atmo-engine.js`'s Fetch-Pfad auf die URLs zeigen. Ohne sie: synth mode (0 Assets).

---

## 5. Reihenfolge (empfohlen)
1. Gerüst: HTML + React + Three-CDN + `<div id="root">`.
2. `ICEBERG_DATA`, `IcebergScene`, `AtmoEngine` inline kleben (unverändert). Prüfen: Berg
   rendert, Kamera taucht, Atmo tönt auf Klick.
3. Logic-Klasse portieren: Methoden kopieren, `renderVals()` → `render()`/JSX.
4. Assets inlinen (Avatare, Dice, Fonts).
5. LLM live testen (Chat, Tour, FactCheck, Ghost, rabbit holes) — Preview-Fallback verdeckt
   Bugs. Direktiven-Parsing gegen echte Antworten härten.
6. PAINT-REGEL & Picking gegen echten User-View-Screenshot verifizieren (nicht DOM/html-to-image).

---

## 6. Größen-/Deploy-Budget
- Ohne Atmo-MP3s, Assets als data-URI, Fonts base64: **1 File, ~1–2 MB** — komfortabel fürs
  Artefakt.
- Mit 7 Atmo-MP3s inline: **+10–15 MB** → besser hosten als bundlen.
- Three.js r128 extern (CDN) hält das File klein; für echtes Offline muss auch Three inline
  (dann Weg A / `super_inline_html`).

---

## 7. Checkliste „läuft wie das Original"
- [ ] Berg rendert, 7 Tier-Bänder, Bubbles unter Oberfläche.
- [ ] Node-Klick trifft den SICHTBAREN Node (Picking), Detail-Window korrekt.
- [ ] Detail-Card scrollt sauber (PAINT-REGEL), Buttons/Chips beim Scrollen gemalt.
- [ ] Evidence-Bild enthüllt auf load / REDACTED sonst.
- [ ] good neighbours: Dive + Ghost-Materialisierung (LLM live).
- [ ] Chat/Tour/FactCheck/rabbit holes über echtes `window.claude.complete`.
- [ ] Atmo morpht mit der Tiefe, duckt bei TTS.
- [ ] Import/Export JSON (Format-Version beachten; Map-View → v2).
- [ ] Kein Emoji, DS-Fonts, Stempel-Buttons, Wobble-Streuung.
