# Schema v2 — „Ein Datensatz, zwei Views"
Stand: 2026-07-04 · Status: **UMGESETZT in v1.2** (Detail-Card v2 + View-Contract; Beispiele mkultra/philadelphia live in `iceberg-data.js`)

Deckt ab: Entry-Erweiterungen (`summary`, `related`, `image`), Map-Modell,
Theme-Tokens, Pack-/Import-Format v2, View-Contract. Alle v1-Felder bleiben
unverändert gültig — jedes neue Feld ist optional, Bestandsdaten laufen ohne
Migration weiter.

---

## 1 · Entry v2

```js
{
  // ——— v1, unverändert ———
  id: "mkultra", name: "MKUltra", tier: 2, cat: "psyop",
  dice: 3, status: "real",
  quip: "The CIA dosed civilians with LSD. Declassified. …",

  // ——— NEU in v2 (alle optional) ———
  summary: "3–4 Sätze. Sachlicher Kontext VOR dem Quip. …",
  related: [ "stargate", "paperclip",
             { ghost: true, name: "Operation Midnight Climax", cat: "psyop", tier: 3 } ],
  image: { src, source, credit, license } | null,
  map: { region: "deep-state", x: 0.31, y: 0.62 } | null
}
```

**Feldregeln**

- `summary` — 3–4 Sätze, Englisch, FB-Ton aber **faktentragend**: Namen, Daten,
  Widersprüche. Zwei Leseebenen: Mainstream bekommt Kontext, Kenner finden
  Easter Eggs (konkrete Subprojekt-Namen, Aktenzeichen, Randfiguren). Der Quip
  bleibt FBs Spin *danach*. Fehlt `summary` → Card zeigt wie bisher nur Quip.
- `related` — **max 3**, Mix: 1–2 existierende IDs + oft 1 Ghost als Köder.
  Bewusst tier-übergreifend (Warburg: gute Nachbarschaft). Fehlt → Zeile
  ausgeblendet.
- `map` — Anwesenheit = Node erscheint im Map-View. Koordinaten normalisiert
  0–1 (renderunabhängig). `tier` vorhanden = erscheint im Iceberg. Ein Entry
  kann eins von beiden oder beides haben → **eine** Collection, zwei Views.
  *(Abweichung vom Sprint-Sketch: keine separate `nodes`-Collection mit
  `icebergId`-Verlinkung. Ein Entry = eine Identität; Detail-Card, Bookmarks,
  FactChecks, Touren funktionieren dann automatisch in beiden Views. Map-only
  Nodes sind Entries ohne `tier`.)*

### Ghost-Notation

```js
{ ghost: true, name: "Operation Midnight Climax", cat: "psyop", tier: 3, hint: "optional teaser" }
```

- Ghosts haben **keine `id`** — sie existieren nur als Verweis in `related`.
- UI: halbtransparenter Chip. Klick → LLM materialisiert den Entry über den
  vorhandenen rabbit-holes-Pfad (inkl. Fallback ohne LLM), vergibt `id`,
  ersetzt die Ghost-Referenz durch die echte ID, pfropft den Node an
  (Iceberg: `tier`; Map: passende `region`).
- `cat`/`tier` am Ghost sind Platzierungs-Hints für die Materialisierung.

---

## 2 · Bilder + Redacted-Default

```js
image: {
  src:     "https://commons.wikimedia.org/wiki/Special:FilePath/DeclassifiedMKULTRA.jpg?width=480",
  source:  "https://commons.wikimedia.org/wiki/File:DeclassifiedMKULTRA.jpg",
  credit:  "CIA — public domain",
  license: "pd"            // "pd" | "cc-by" | "cc-by-sa" | "cc0"
}
```

**Grundhaltung: Redacted ist der Normalfall, kein Fehler.**
- `image: null`, fehlendes Feld, Ghost, Ladefehler, offline, CSP-Block →
  identischer **REDACTED-Platzhalter** (Stempel-Look, on-brand).
- Ein Bild wird nur eingetragen, wenn im Kurations-Pass geprüft:
  **richtiges Motiv + Lizenz + Attribution**. Falsches Bild > kein Bild? Nein —
  umgekehrt. Abstrakte Nodes bleiben ehrlich redacted.
- **Referenz, nie Bytes**: nichts wird eingebacken (1000 × 20 KB = tot).
  Quelle der Wahl: Wikimedia Commons (offenes CORS, stabile
  `Special:FilePath`-Redirects, `?width=480` für Thumb-Größe).
- `credit` + `source`-Link werden unter dem Thumb angezeigt (CC-Pflicht;
  bei PD trotzdem guter Stil).

---

## 3 · Map-Modell

```js
// Teil desselben Datensatzes (Pack oder window.ICEBERG_DATA-Erweiterung)
regions: [
  { id: "secret-space", label: "Secret Space Program", cx: 0.72, cy: 0.28, r: 0.11, wash: "mystic" },
  { id: "deep-state",   label: "The Deep State",       cx: 0.30, cy: 0.60, r: 0.13, wash: "blood" }
],
links: [ ["mkultra", "stargate"], ["mkultra", "paperclip"] ]   // gezeichnete Hand-Linien
```

- `wash` referenziert die Watercolor-Palette (mystic/blood/tragic/comic/heroic/
  forbidden/clinical/rabbit) statt roher Hexwerte → Theme-fähig.
- `links` sind rein visuell (Verbindungslinien auf der Map); `related` ist die
  semantische Nachbarschaft in der Detail-Card. Oft deckungsgleich, nicht zwingend.
- Regionen werden im Map-View zu Sprungmarken (ersetzt die Tier-Zahlen-Rail).

---

## 4 · Theme-Tokens (eine Stelle, beide Views)

`theme.js` → `window.KAYFAB_THEMES`, aktives Theme via State/Tweak:

```js
{
  creme: { paper: "#f3ead3", paperSub: "#ece1c0", ink: "#1f1a14", inkSoft: "#3a342a",
           inkFaint: "#7d7364", accent: "#c2412c", stampYellow: "#f0c948",
           worldBg: "#0a1420",                       // 3D-Himmel / Map-Desk
           washes: { mystic: "#6b4e7d", blood: "#c2412c", tragic: "#3e6a83",
                     comic: "#7a8d4a", heroic: "#d97c3a", forbidden: "#a64670",
                     clinical: "#4f8a85", rabbit: "#e9c14a" } },
  rosa: { /* Hommage ans Original — Map-Fokus */ },
  dark: { /* … */ }
}
```

- UI-Schale + beide Renderer lesen **nur** aus dem aktiven Token-Set.
- 3D-Erlebniswelt (arktisch→abyss) bleibt in v1-Creme unangetastet; Themes
  greifen zuerst auf Map + UI-Papier. Kein Hardcode-Hex mehr in neuen Features.

---

## 5 · Pack-Format v2 (Import/Export + GitHub-Workflow)

```json
{
  "format": "kayfab-pack",
  "version": 2,
  "kind": "core | map | tour | deepdive | session",
  "meta": { "title": "…", "author": "…", "updated": "2026-07-04" },

  "entries":    [ /* voll oder partiell — Merge by id */ ],
  "regions":    [ … ],
  "links":      [ … ],
  "tours":      { "…": ["id", …] },

  "factChecks": { }, "bookmarks": [ ], "filters": { }, "view": "iceberg | map"
}
```

- **Merge by id**: Pack-Entry mit bekannter `id` überschreibt feldweise
  (kuratiertes Update), unbekannte `id` wird angehängt. Ghosts in `related`
  werden aufgelöst, wenn ein Pack die echte `id` liefert.
- **v1-Kompatibilität**: Session-Exporte ohne `format`-Feld werden als v1
  erkannt und weiter importiert.
- **Ladekette** (App): baked-in Core → `fetch` Pack-URL (Repo/jsDelivr, wo CSP
  erlaubt — feature-detect, still scheitern) → File-Import als universeller
  Fallback (funktioniert auch im claude.ai-Artefakt).
- **Workflow**: LLM generiert in Session (rabbit holes / Deep Dives / Touren)
  → Export → Kuration → Commit ins public Repo → Clients ziehen beim nächsten
  Fetch/Import.

---

## 6 · View-Contract (Refactor-Ziel)

Ist-Kopplung (gemessen, v1.1): `new IcebergScene(el, data, {onFrame})`,
`dispose`, `flyToEntry`, `addEntries`, `targetDepth =`, Reads von
`_moved`/`_dragging`. Daraus wird das formale Interface:

```js
// Jede View (IcebergScene, MapScene) implementiert:
constructor(mountEl, data, { onFrame, onUserMove })
dispose()
flyToEntry(id)                 // iceberg: Kamera-Dive · map: pan+zoom
addEntries(entries)            // Live-Anpfropfen (rabbit holes, Ghosts)
goToAnchor(anchorId)           // ersetzt rohe targetDepth-Writes
get anchors()                  // [{id, short, title}] → speist die linke Rail
                               // iceberg: tier-1…7 + surface · map: regions
get dragging()                 // Hover-Unterdrückung während Drag
get suppressClick()            // Klick-Guard (Click feuert nach pointerup)
// onFrame(labels, navInfo):
//   labels:  [{id, x, y, scale, alpha}]  (Projektion → DOM-Labels, wie bisher)
//   navInfo: {mode:"iceberg", depth, tier} | {mode:"map", region, zoom}
```

View-agnostisch (bleibt geteilt im Component): Auswahl/Detail, Touren,
Autopilot, Filter/Suche, Chat/LLM-Direktiven, FactCheck, rabbit holes,
Bookmarks, Import/Export, TTS, Labels-DOM + Nearest-Picker + Dekluttering.
View-spezifisch: Rendering, Projektion, Kamera/Navigation, Anchor-Semantik.

---

## 7 · Durchexerzierte Beispiele

### A — Voll ausgebaut, mit verifiziertem PD-Bild

```js
{ id: "mkultra", name: "MKUltra", tier: 2, cat: "psyop", dice: 3, status: "real",
  summary: "From 1953 to 1973 the CIA ran a human-experimentation program across 80+ universities, hospitals and prisons — LSD on unwitting civilians, hypnosis, sensory deprivation. Director Richard Helms ordered the files destroyed in 1973; a misfiled box of 20,000 financial records surfaced through FOIA in 1977 and blew it open. Subproject 68 ran at McGill under Ewen Cameron — then president of the World Psychiatric Association — who called weeks-long drug comas 'psychic driving'. The Church Committee confirmed the rest under oath.",
  quip: "The CIA dosed civilians with LSD. Declassified. This is why nobody trusts the word 'blödsinn'.",
  related: [ "stargate", "paperclip",
             { ghost: true, name: "Operation Midnight Climax", cat: "psyop", tier: 3 } ],
  image: { src: "https://commons.wikimedia.org/wiki/Special:FilePath/DeclassifiedMKULTRA.jpg?width=480",
           source: "https://commons.wikimedia.org/wiki/File:DeclassifiedMKULTRA.jpg",
           credit: "CIA — public domain", license: "pd" },
  map: { region: "deep-state", x: 0.31, y: 0.62 } }
```
*Easter Eggs für Kenner: Subproject 68, „psychic driving", die fehlgeleitete
Aktenkiste. Ghost „Midnight Climax" (CIA-Bordelle in San Francisco, echtes
Subprojekt) als Köder — materialisiert auf Klick.*

### B — Redacted (kein verifiziertes Bild), Related nur bestehend + Ghost

```js
{ id: "philadelphia", name: "Philadelphia Experiment", tier: 2, cat: "tech", dice: 5, status: "debunked",
  summary: "In 1943 the destroyer escort USS Eldridge allegedly turned invisible and teleported from Philadelphia to Norfolk, fusing sailors into the hull. The entire mythology traces to one man — Carl 'Carlos Allende' Allen — who mailed annotated copies of a UFO book to the Office of Naval Research in 1955. The ship's deck logs show the Eldridge was never in Philadelphia that day. Allende confessed the hoax in 1969, then retracted the confession.",
  quip: "The Navy teleported a ship, and the only witness kept changing his story. Hm.",
  related: [ "montauk",
             { ghost: true, name: "The Varo Edition", cat: "media", tier: 4 } ],
  image: null }   // → REDACTED-Platzhalter. Ehrlich: kein verifiziertes Motiv.
```

### C — Map-only Entry (kein `tier` → nur im Map-View)

```js
{ id: "solar-flash", name: "The Great Solar Flash", cat: "space", dice: 6, status: "debunked",
  summary: "…", quip: "…",
  map: { region: "ascension", x: 0.52, y: 0.12 } }
```

---

## 8 · Offene Punkte (nicht blockierend)

- Redacted-Platzhalter-Gestaltung (Stempel-Varianten?) → Detail-Card-Ausbau.
- `rosa`/`dark`-Tokenwerte konkret → Theme-Sprint (M-Ende).
- Repo-Name/Struktur für Content-Packs → wenn Georg das Repo anlegt.
