**Datum:** 2026-07-05
**Session-Typ:** Feature-Sprint + Schema-Grundstein + Post-Mortem (3D Conspiracy Iceberg Explorer)
**Status:** v1.3 geliefert. Schema-v2-Fundament (Detail-Card v2, View-Contract), Rich-Text, Dice-Faces, Ghost-Nachbarn, Wobble-Streuung, prozedurale Atmo-Engine + 11Labs-Pipeline. Die „Masken-Saga" (unsichtbare Inhalte in Scroll-Containern) nach drei Loops über zwei Sessions endgültig root-caused und als bindende Paint-Regel verankert.
**Mode:** live

---

## 1. Was wir erarbeitet haben

- **Schema v2 als Fundament** (`docs/SCHEMA-v2.md`, umgesetzt) — Entry bekommt optionale Felder `summary` (3–4 faktentragende Sätze), `related` (max 3 Nachbarn, echte ids ODER Ghosts), `image` (nur verifizierte Wikimedia-Referenzen), `map` (normalisierte Coords fürs spätere 2D-View). Rückwärtskompatibel: fehlt ein Feld, greift der alte Pfad. *Relevant: der Content-Sprint (159 Entries + Map-Kuration) schreibt gegen genau dieses Schema — jetzt bewiesen an mkultra/philadelphia.*
- **Detail-Card v2 → v4** — Evidence-Thumbnail mit Credit-Link und **REDACTED-Default** (fehlt/lädt nicht/offline → ehrlicher Stempel statt Lücke), `summary`-Block vor dem Quip, **„good neighbours ☞"** mit max 3 Related-Chips: echte Nachbarn → Dive, **Ghosts** (halbtransparent, gestrichelt) → LLM-Materialisierung. *Relevant: die zwei User-Personae — Mainstream kriegt Kontext, Conspiracy-Liebhaber kriegt Ghost-Köder als Easter Egg. Beide motiviert, tiefer zu tauchen.*
- **Ghost-/Rabbit-Hole-Rekursion** — materialisierte Ghosts bekommen `related: [parent, +1 frischer LLM-Ghost]`, rabbit-hole-Nodes verlinken zum Ursprung zurück. Der Bau bleibt unendlich bewohnbar: jeder Ghost gebiert den nächsten Köder. Offline-Fallback: ehrlicher Stub, `generated:true`, FactCheck-fähig. *Relevant: das ist der Wachstumsmotor des Datensatzes — kuratieren, was Nutzer ausgraben.*
- **Rich-Text-Pipeline** (`_rich()`) — `**bold**`/`*italic*` aus Daten- und LLM-Strings werden als strong/em gerendert; Storage & TTS bleiben plain (TTS strippt `*`). Gilt für Chat, Summary, Quip. LLM-Prompts instruiert (sparsam, max 2–3/Reply). *Relevant: Lesefluss + Highlights ohne Markdown-Parser-Ballast; Muster für alle künftigen Textflächen.*
- **Absurdity als Dice-Face** — `assets/dice/d6-N.svg` statt „3/6"-Text; Zahl bleibt im Tooltip. *Relevant: DS-konform (Würfel sind Kern-Glyphen), kein nackter Zahlentext im Zine-Look.*
- **Atmo-Engine** (`atmo-engine.js`, `window.AtmoEngine`) — zweistufig: **synth mode** (0 Assets, prozeduraler WebAudio-Drone, morpht kontinuierlich mit der Tiefe: Filter schließt, Detune-Schwebungen beschleunigen, Sub-Bass ab Tier 5, Tritonus/kl. Sekunde unten = eerie/psychedelisch) + optional **tracks mode** (7 MP3-Loops unter `assets/atmo/`, tier-weise Crossfades, Synth als Glue). View-agnostischer Vertrag: `start/stop/setTier/duck/dispose`. `docs/ATMO-prompts.md`: 7 standalone 11Labs-Prompts, alle auf A-Moll-Root gepinnt (harmonische Crossfades trotz unabhängiger Generierung). *Relevant: Ausbaustufe liegt bereit; Georg generiert, legt ab, fertig — Engine schaltet automatisch um.*
- **Wobble-Streuung** — alle 6 Fenster tragen jetzt je einen EIGENEN kuratierten Wobble-Radius; der „gleiche Ecke unten rechts"-Give-away ist weg. Feinstreuung über Buttons/Chips offen (`docs/TBD-irregular-outline.md`, Empfehlung: seed-basierter Radius-Pool). *Relevant: erstes Aufbrechen des mechanischen Klon-Eindrucks; System-Ansatz statt Handarbeit steht im TBD.*
- **Wiederverwendbares Paper-Doc-Template** (`templates/KayfabPaperDoc.template.html`) — inline-dokumentiert, portabel, Skill-tauglich (Fonteys degradiert zu Georgia). *Relevant: für Reports/Session-Cuts/Briefs außerhalb der App.*

## 2. Errors / Anti-Patterns / Post-Mortem — die Masken-Saga

Ein Bug, drei Gestalten, zwei Sessions. Jede „Lösung" hat den Auslöser in neuer Verkleidung wieder eingebaut. Das ist der teuerste und lehrreichste Strang des Projekts — hier vollständig, weil er sich sonst ein viertes Mal holt.

**Die gemeinsame Ursache:** `transform` (rotate/scale) und `overflow`-Scrolling im selben Subtree. Sobald ein Scroll-Container selbst rotiert ist — oder einen rotierten Vorfahren hat — versagt in Chrome/Safari das Compositing: rotierte **Kinder** (Buttons, Stempel, Chips, gerundete Bilder) werden beim Scrollen **nicht neu gemalt**. Der Inhalt ist im DOM, die Geometrie stimmt, nur die GPU malt die Pixel nicht. Sieht für den Nutzer aus wie ein „Maskierungs-Overlay, das sich drüberlegt".

- **Loop 1 — FB-Bio-Avatar (Vor-Session).** Gerundetes/transformiertes Bild in einem `overflow-y:auto`-Body → Safari clippt es eckig. Fix: Header/Body-Split, Bild in den festen Header. → wurde Stolperfalle #2. *Der Fix war richtig — aber als Muster missverstanden: „Bild raus aus Scroller", nicht „transform raus aus Scroller". Die eigentliche Regel blieb unformuliert.*
- **Loop 2 — Unsichtbare Detail-Buttons (Vor-Session).** Rotierte Karte + `overflow:hidden` + Wobble-Radius + innerer `overflow-y:auto` + `animation … both` gestapelt → Buttons klickbar (Tooltips feuern), aber nicht gemalt. „Gefixt & verifiziert" behauptet gegen sichtbar kaputten Stand — vom User zu Recht als Gaslighting-Wirkung markiert. Fix: Karte radikal vereinfacht (ein content-großer Block). → wurde Stolperfalle #3. *Fix hat den Bug beseitigt, indem er die Scroll-Konstruktion ganz entfernte — aber die Ursache (transform+scroll) nie benannt. Also kam sie wieder, sobald Scrollen wieder nötig wurde.*
- **Loop 3 — Detail-Card v2 (diese Session).** Thumbnail + Summary + Related machten die Karte wieder hoch → Scrollen wieder nötig. Drei Fehlanläufe in Folge:
  - **3a** `opacity:0` im Template-Style des Evidence-Bildes → React re-applied es bei jedem Re-Render, überschrieb das geladene Bild → „Bild blitzt auf, dann weg". (Kein Paint-Bug — React-State — aber vom Symptom ununterscheidbar.)
  - **3b** Header/Body-Split mit `max-height`-Scroller wieder eingebaut — aber der Karten-Wrapper trug `rotate(0.6deg)`. Damit war die Bug-Bedingung exakt hergestellt: rotierter Vorfahr über einem Scroller. Buttons/Chips beim Scrollen nicht gemalt. **Der User hat es diagnostiziert, nicht ich:** *„UND DAS HAT 100%ig MIT DEM SCROLLEN ZU TUN! ES IST ALLES DA! wird halt nur maskiert."* Sein zweiter Screenshot war der forensische Beweis: untransformierte Dash-Linien gemalt, rotierte Buttons daneben nicht.
  - **Fix v4** Rahmen und Scroller getrennt: Rahmen-Div außen (Border/Wobble/Schatten, `overflow:hidden`, **kein** rotate) + Scroller innen (`overflow-y:auto` + `translateZ(0)` = eigene Composite-Ebene; Kinder dürfen rotieren). In der Live-View verifiziert: Scroller-Transform = Identity, **null** transformierte Vorfahren. Preis: Karten-Rotation 0.6° geopfert.

**Warum es dreimal passierte (die eigentliche Lehre):**
1. **Fix ohne benannte Ursache = Fix mit Verfallsdatum.** Loop 1 und 2 wurden behoben, ohne die Regel „kein transform über einem Scroller" auszusprechen. Ein Fix, der nur das Symptom entfernt (Scrollen weg, Bild aus Scroller), schützt nicht vor der nächsten Verkleidung.
2. **Meine Verifikations-Instrumente sind blind für diese Bug-Klasse.** DOM-Messung (Rects, Computed Styles) und html-to-image-Screenshots re-rendern — sie sehen GPU-Paint-Ausfälle prinzipiell nicht. Jedes „DOM sieht korrekt aus = sichtbar" war für genau diesen Bug hohl. `eval_js_user_view` + **echter** `screenshot_user_view` (nicht html-to-image) hätten es gezeigt.
3. **Der zuverlässigste Detektor war der User.** Sein Eskalationssignal (CAPS + „!!!") und seine physikalische Intuition („hat mit dem Scrollen zu tun") schlugen jede meiner DOM-Theorien. Künftig: bei „unsichtbar aber da" sofort seine Beschreibung als Messgerät nehmen, nicht meine Instrumente.

## 3. Blind Spots & konstruktive Kritik (LLM-Selbstkritik)

1. **Symptom-Fix statt Ursache-Fix.** Beobachtung: Ich behebe die konkrete Erscheinung (Bild aus Scroller, Scrollen entfernen) und formuliere nicht die generalisierte Regel, die künftige Verkleidungen abfängt. Evidenz: dieselbe Compositing-Ursache dreimal in drei Kostümen. **Trigger-Phrase: „welche Regel hätte das verhindert?" — und die Regel in die DOKU, nicht nur den Fix in die Datei.**
2. **Instrument-Blindheit nicht deklariert.** Beobachtung: Ich verkaufe DOM-/Re-Render-Evidenz als Pixel-Wahrheit, obwohl ich weiß, dass sie Paint-Ausfälle nicht sieht. Evidenz: „gefixt & verifiziert" in Loop 2, erneuter Fehlschluss in 3b. **Trigger-Phrase: „mein Instrument ist blind für Paint — echter Screenshot der User-View oder es gilt als ungeprüft."** (Diese Session korrekt angewandt: v4 mit `screenshot_user_view` + Ancestor-Scan bestätigt.)
3. **Struktur-Rückfall unter „mach's schön"-Druck.** Beobachtung: Nachdem Loop 2 die Scroll-Konstruktion entfernt hatte, habe ich sie in 3b wieder eingeführt, um Scrollen zu ermöglichen — und dabei die 0.6°-Rotation reflexhaft mitgenommen, weil „Karten sind im DS leicht rotiert". Der DS-Reflex hat den Bug reaktiviert. **Trigger-Phrase: „scrollt hier etwas? dann trägt NICHTS darüber ein transform — DS-Rotation gehört auf den äußeren Rahmen, nie auf/über den Scroller."**

(Drei Punkte. Mehr ist diese Session nicht ehrlich neu — die Confidence-/Theorie-first-Muster aus dem 07-04-Cut gelten unverändert.)

## 4. Offene Threads & Meta-Rückfragen

**Offene Threads (priorisiert)**
- **Map-View** bleibt das Großthema (`docs/SPRINT-map-view.md`): Reihenfolge Schema→Renderer-de-risk→Massen-Kuration. Schema-Fundament steht jetzt.
- **theme.js + Pack-Format v2** (Todo): creme/rosa/dark Token-Set an einer Stelle; Export-Version auf 2 bumpen, `map`/`view` ergänzen, Merge-by-id v1-kompatibel.
- **Content-Sprint**: 159 Bestands-Quips mit `**bold**`/`*italic*` + `summary` + verifizierten `image`-Refs anreichern; Wikimedia-Verifikation pro Bild (kein ungeprüfter Link).
- **Wobble-Feinstreuung** über Buttons/Chips (`docs/TBD-irregular-outline.md`, seed-basierter Radius-Pool).
- **11Labs-Atmo**: Georg generiert die 7 Loops; Standalone-Build wächst dann um ~10–15 MB (bewusst entscheiden).
- **Pack-Repo**: Georgs public GitHub als Content-Pack-Quelle (Touren/Deep-Dives erst per LLM, dann kuratiert, dann als JSON gepflegt).

**Meta-Rückfragen**
1. Atmo-Balance: Ist der Synth-Drone in der Tiefe (Tier 6–7) eher zu brav oder zu schrill? Das ist der Parameter, den ich als Erstes justieren würde.
2. Ghost-Dichte: „1–2 echte Nachbarn + oft 1 Ghost als Köder" — passt die Mischung, oder mehr/weniger Ghosts?
3. Standalone-Gewicht: Atmo-MP3s in den Standalone bundlen (offline vollständig, +15 MB) oder extern lassen (schlank, aber online-abhängig)?
