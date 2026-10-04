# ENGINE — technische Referenz (3D Conspiracy Iceberg Explorer)
Stand: 2026-07-05 · v1.3 · Begleitdoku zu `docs/DOKU.md` (Feature-Inventar) und `docs/UI-UX.md` (Design-Sprache)

Zweck: die view-agnostische Maschinerie so beschreiben, dass ein zweiter View (Map)
darauf aufsetzen kann, ohne Interna zu erraten. Drei Schichten: **Daten → Szene →
DC-Logic**, plus die **Atmo-Engine** als vierter, unabhängiger Dienst.

---

## 0. Schichtenmodell & Sync-Prinzip
```
iceberg-data.js   window.ICEBERG_DATA        reiner Datensatz, kein DOM, kein Three
iceberg-scene.js  window.IcebergScene        Three.js-Welt HINTER dem View-Contract
atmo-engine.js    window.AtmoEngine          WebAudio, hört nur auf setTier()
*.dc.html Logic   class Component            State-Maschine + Feature-Schicht (view-agnostisch)
```
**Bindend (Map-View):** Features (Auswahl, Touren, Filter, Chat, FactCheck, rabbit
holes, Ghosts, Import/Export, TTS, Bio) leben in der DC-Logic und sprechen die Szene
NUR über den View-Contract (§2) an. Kein Feature schreibt `targetDepth` oder liest
`_moved`/`_dragging`. So erbt jeder neue View dieselben Features automatisch.

---

## 1. Datenschicht — `window.ICEBERG_DATA`
```js
{
  cats:     { psyop: {label, wash}, tech: {...}, ... },   // 10 Kategorien, wash = DS-Farbe
  statuses: { debunked:{...}, unclear:{...}, art:{...}, real:{...} },
  tiers:    [ { n:1, label, ... }, ... 7 ],
  entries:  [ Entry, ... 159 ],
  tours:    { curated:[id,...28], ... }
}
```
### Entry-Shape
**v1 (Pflicht, alle 159):**
```js
{ id:"kebab-id", name:"MKUltra", tier:1..7, cat:"psyop",
  dice:1..6,                      // FrizzleBob Absurdity Rating → assets/dice/d6-N.svg
  status:"debunked|unclear|art|real",
  quip:"eine satirische FB-Zeile" }   // darf **bold**/*italic* tragen (→ _rich)
```
**v2 (optional, `docs/SCHEMA-v2.md` — schrittweise Kuration):**
```js
  summary:"3–4 faktentragende Sätze (Namen, Daten, Widersprüche); **bold**/*italic* ok",
  related:[ "echte-id",                         // → Dive-Chip
            {ghost:true, name:"…", cat?, tier?} ],// → halbtransparenter Ghost-Chip, LLM-materialisiert
  image:{ src, source, credit, license },       // NUR verifizierte Wikimedia-Refs; fehlt → REDACTED
  map:{ region, x, y }                           // normalisiert 0–1, Präsenz = Node im Map-View
```
**Laufzeit-Flags** (nicht im Quell-Datensatz, von der Logic gesetzt):
`generated:true` (LLM-erzeugt: Ghost, rabbit-hole, FactCheck-Reklassifikation) — wird
beim Export mitgeschrieben.

Datensatz erweitern = Entries pushen/editieren; Layout, Labels, Tier-Bänder folgen
automatisch. Neue Kategorie = in `cats` ergänzen (bekommt DS-wash), sonst fällt der
Chip auf die Parent-Kategorie zurück.

---

## 2. Szene — `new IcebergScene(container, data, callbacks)`
Three.js r128 (CDN). Baut Berg-Mesh (organisch verrauscht), Wasseroberfläche, Bubbles/
Marine-Snow, Tiefen-Fog + Kameralicht, projiziert Node-Labels nach 2D.

### Konstruktor-Callbacks
```js
{ onFrame(labels, depthInfo), onReady() }
```
- `onFrame` feuert pro RAF-Frame. `labels` = bereits **viewport-gecullte** projizierte
  Positionen `[{id, x, y, scale, opacity}]` (keine Geister außerhalb `[−60, w+60]`).
  `depthInfo = { depth(m), tier(0..7) }` — tier 0 = Oberfläche. Die DC malt daraus die
  Label-Overlays und füttert `atmo.setTier(depthInfo.tier)`.

### Kamera-Modell (geglättet, nichts springt)
- `targetDepth` / `targetAngle` / `targetRadius` — Sollwerte; die Szene lerpt.
- `diveBy(d)` / `orbitBy(a)` / `zoomBy(d)` — relative Nudges (Controls/WASD).
- `flyToEntry(id)` — Kamera + Tiefe auf einen Entry (Auswahl/Tour/GOTO).
- `minDepth()` / `maxDepth()` — Klammern.

### VIEW-CONTRACT (die einzige Navi-Fläche für Features — §6 SCHEMA-v2)
```js
goToAnchor(id)      // "surface" | "tier-N" → setzt targetDepth; ERSETZT rohe Writes
get anchors()       // [{id, short, title}] → speist die linke Rail
                    //   iceberg: surface + tier-1..7 · map (später): regions
get dragging()      // bool — Hover-Unterdrückung während Drag
get suppressClick() // bool — Klick-Guard (click feuert nach pointerup; _moved>8 = Drag)
```
Warum: der Map-View implementiert denselben Contract mit anderer Semantik (anchors =
Regionen, goToAnchor = Pan/Zoom auf Region). Die Feature-Schicht bleibt unverändert.

### Datensatz-Mutation zur Laufzeit
```js
addEntries([entry,...])   // graftet neue Nodes live an (Ghost, rabbit-hole, Import)
dispose()                 // RAF stoppen, Three-Ressourcen freigeben (Unmount!)
```

### Picking (deterministisch, game-standard — `docs/REVIEW-nodeclick.md`)
Labels sind `pointer-events:none`. EIN Handler am Container wählt den nächstliegenden
projizierten Node-Mittelpunkt (vertikal gewichtete Distanz, dy×2.2 — die Textzeile
gewinnt), Rect-Treffer schlägt Nähe, bei Gleichstand der vorderste. Nodes unter
UI-Panels sind nicht pickbar. NIE DOM-Hit-Testing, NIE `.click()`-Tests (umgeht Hit-Test).

---

## 3. Atmo-Engine — `new AtmoEngine()` (`atmo-engine.js`)
Unabhängiger WebAudio-Dienst, view-agnostisch. Kennt nur Tiefen-Tier, kein DOM.
```js
start()        // AudioContext (resume nach User-Geste — Autoplay-Policy!), Master faded ein
stop()         // Master faded aus, Context suspend
setTier(0..7)  // träge Morph-Ramps (4–6s); guardet gleiche Tier billig weg
duck(bool)     // senkt Master ~35% (FB-TTS spricht → onend unduckt)
dispose()      // Context schließen (Unmount)
```
### synth mode (Default, 0 Assets)
Layer: Brown-Noise-Wasser → Lowpass (schließt mit Tiefe) · Sub-Sine (A1, driftet ab
Tier 6 Richtung E1) · Triangle-Body (weicht mit Tiefe) · Color-Sine im Tier-Intervall
(Quinte→Quarte→gr.Terz→kl.Terz→Tritonus→kl.Sekunde) + Detune-Twin (Schwebung, Hz steigt
mit Tiefe) · Vibrato-LFO (Cent-Tiefe steigt) · Sonar-Ping durch Feedback-Delay (tiefer/
seltener mit Tiefe). Alles per `setTargetAtTime` — nichts springt.
### tracks mode (auto-Upgrade)
Liegen `assets/atmo/tier-1..7.mp3` (alle 7!) vor, dekodiert die Engine sie und crossfadet
tier-weise (3s); Synth bleibt als leiser Glue (0.12). Fehlt eine → synth mode bleibt.
Prompts + A-Moll-Pin: `docs/ATMO-prompts.md`.

---

## 4. DC-Logic — Feature-Schicht (`class Component`)
State-Maschine im `.dc.html`. Alle Features view-agnostisch; sprechen Szene via Contract.

- **Auswahl/Tour:** `_select(id, manual)` → `flyToEntry`, schließt Bio (`showBio:false`),
  synct Tour-Index. Tour: `curated` (28) · `lucky` (Shuffle) · `custom` (LLM `TOUR:[ids]`).
  Autopilot (`autopilotSecs` 3–20s).
- **Filter:** Kategorie/Status/Guide-Mode/Absurdität (⚀+). Funnel-Toggle rechts oben.
- **Chat/LLM:** `window.claude.complete({system, messages, max_tokens})`. Masken-Prompt
  `_maskPrompt()` (satirical/kayfabe/analytical). **Fallback-Sprüche eingebaut** (Preview
  ohne LLM) — NIE entfernen. Rich-Text via `_rich()` (**bold**/*italic* → strong/em).
- **Direktiven-Verträge** (parsebare letzte Antwortzeile, aus Anzeige gestrippt):
  `TOUR:[ids]` · `GOTO:[id]` · `STATUS:[debunked|unclear|art|real]`.
- **FactCheck:** `_factCheck(id)` → 3–4 ehrliche Sätze + Reklassifikation, gecacht.
- **rabbit holes:** LLM generiert Nachbar-Nodes → `addEntries` + `related:[origin]`.
- **Ghost-Materialisierung:** `_materializeGhost(parentId, ghost)` → LLM schreibt Entry,
  `related:[parent, +1 neuer Ghost]`; offline → ehrlicher Stub. `_replaceGhostRef` tauscht
  die Ghost-Ref gegen echte id.
- **Evidence-Bild:** `setEvidenceImg`-ref setzt `src` + `opacity` **imperativ** (kein
  Template-Style-opacity — React re-applied es sonst). REDACTED-Basis immer gemalt.
- **Import/Export:** JSON, Format-Version 1 (Map-View → 2 bumpen). Import graftet unbekannte
  Entries live.
- **TTS:** Browser-SpeechSynthesis, opt-in; strippt `*`; duckt Atmo.
- **Picking:** `_bindPicking/_pickAt/_applyHover` (siehe §2).

### Lebenszyklus / Fallen
- `componentWillUnmount`: `scene.dispose()` + `atmo.dispose()` + Timer clear.
- **DC-Live-Edits laden Template & Logik getrennt** → Misch-Zustände; nach Edit-Serien
  Hard-Reload. `support.js` = generierte Runtime, NIE editieren.
- **PAINT-REGEL (bindend):** scrollt etwas, trägt NICHTS darüber ein `transform`. Details
  in `docs/UI-UX.md` + `docs/REVIEW-nodeclick.md`.
