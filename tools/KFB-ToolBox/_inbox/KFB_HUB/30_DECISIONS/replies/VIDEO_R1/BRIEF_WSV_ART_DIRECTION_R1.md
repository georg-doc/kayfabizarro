# WSV · Art Direction R1: Gedichttypografie, Planeten-Collage, Gilliam-Cut-out · WS0 · 03.11.2026 (V-1254, V-1252, V-1240)

**Tier 0**
1. **Erst Bilder, dann Bau (V-740):** Schritt A sind vier Style-Frames, die Georg im Hub abnimmt. Schritt B, der Clip, beginnt erst nach seinem Ja.
2. **Arbeitsort:** `KFB_HUB/60_VIDEO/remotion/` mit den festen Versionen aus dem Skill `kfb-video`. Keine Spielcode-Änderung, kein Merge, nichts löschen.
3. **Quellen zuerst lesen:**
   - Recherche `replies/VIDEO_R1/RESEARCH_REMOTION_ART_DIRECTION_R1.md`, ChatGPT und Perplexity, zwei Top-10-Listen.
   - Leseregel V-1252 in `30_DECISIONS/build_decisions.py`.
   - Der Gedichtband von H15 als Gegenbeispiel: `KFB Billboard Kaleidoscope H15 Mindscape/kfb-h15-mindscape-2026-10-25/KFB_H15_Mindscape/poems.js`.

## Die drei Ebenen
1. **Gedichttypografie:**
   - Ganze Sinneinheiten bis zum Satzzeichen, höchstens zwei Zeilen, keine lesbare Wiederholung.
   - Lesezeit etwa 0,35 s je Wort plus 1,2 s. Der Effekt ist nach spätestens 20 % fertig, danach steht der Text still.
   - Einsätze auf geprüften Beat- und Phrasenzeiten. Die Audio-Energie (FFT) liefert nur Nebenakzente.
2. **Planeten-Collage:**
   - Aus den gemalten Planeten (Einzelzellen im Spiel-Stamm, `scripts/sky/build_planet_cells.py`; Quelle `assets/sky-planets-r1`).
   - Nie als Planet erkennbar: Innenausschnitte, gerissene Formen, Farbdrehung, leichte Cartoon-Verformung.
3. **Cut-out im Geist von Terry Gilliam:**
   - **Material:** Bilder aus dem gemeinfreien Bildpool (H15 `hypernorm_r3/pd_pool`, 481 Bilder) und Kartenschnipsel.
   - **Schnitt:** gerissene oder handgeschnittene Kanten mit Papierrand, harter Schatten, Papier- und Pappkörnung.
   - **Bewegung:** Gelenke wie Musterklammern, Pose-Wechsel auf Zweiern oder Dreiern. Ton und Lesetiming bleiben ungestuft.
   - **Grenze:** inspiriert, keine Kopie bekannter Python-Motive (kein großer Fuß).

## Werkzeuge
Nimm, was die Recherche als tragfähig zeigt, und prüfe jedes Repo selbst, bevor Code übernommen wird.
- **Kern:** die offiziellen Remotion-Skills (schon vendored), `@remotion/noise`, `@remotion/paths`, SVG/DOM.
- **Kandidaten:** Remotion Bits, video-shotcraft, song2mv (nur Teile), GSAP mit Frame-Adapter, das offizielle Music-Visualization-Template.
- **Version:** Alles muss mit Remotion 4.0.536 laufen. Was nicht passt, fällt weg.
- **Datei:** Jede Übernahme bekommt eine Zeile in `remotion/_licence/LICENCE_CHECK.md`, nicht im Bericht.

## Schritt A · Style-Frames (jetzt)
- **Vier Standbilder, 1920 × 1080, aus echten Kompositionen gerendert:**
  1. Gedichtzeile;
  2. Planeten-Collage;
  3. Cut-out-Figur aus Pool-Bildern mit zwei Gelenken und klappendem Mund;
  4. alle drei zusammen.
- **Gedichte:** drei feste gemeinfreie Gedichte (aus dem H15-Pool, Text lokal abgelegt, nicht live geladen).
- **Musik:** der neue Track „Reptilian Surfer“ (Surf Noir, `KFB MusicalChatterbox/Reptilian Surfer Stems/`). Die BPM schreibt WS0 gerade in `40_AUDIO/music_catalog_r1.json`.
- **Ablage und Meldung:**
  - Die Frames gehen über WS0 in den Hub, nie direkt an Georg.
  - Dazu je Frame eine Zeile: was zu sehen ist und welches Werkzeug es macht.

## Schritt B · Clip (nach Georgs Ja)
- **Umfang:** 30–45 s auf „Reptilian Surfer“. Gedichteinheiten im Takt, Planeten-Collage als Grund, zwei bis drei Cut-out-Figuren.
- **Prüfung:**
  - deterministisch: gleiches Bild bei gleicher Frame-Nummer, auch bei zufälliger Render-Reihenfolge;
  - QA-Liste aus dem Skill.
  - Die Liste „Augen“ und „Knete“ gilt hier nicht, denn Papier ist die HyperNorm- und Meta-Ebene. Knet-Figuren der Spielwelt kommen in diesem Clip nicht vor.

## Schritt C · Gemeinsames Modul (nach dem Clip)
- **Was:** Zeitlogik und Satz der Gedichte (Einheiten bilden, Lesezeit, Einsatz am Beat, Breitenanpassung) als reine TypeScript-Funktionen ohne React, mit Tests.
- **Wofür:** Später übernehmen sie die H15-Engine und der Kartenboden im Spiel. Ablage `60_VIDEO/components/poem-timing/` mit README und Beispiel.

## Zurück an WS0
- je Schritt eine Zeile in `60_VIDEO/RETURN.md`;
- Pfade der Bilder bzw. des Clips;
- verwendete Repos mit Commit;
- Offenes.

Meldung per Nachricht an die WS0-Sitzung.
