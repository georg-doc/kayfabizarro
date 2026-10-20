# BRIEF WS1 · 3D-Kanon: Recherche + Werkzeuge · R1 · 2026-10-20 · WS0
**Register:** V-563 (Kanon ist Pflicht), V-564 (Bodenfarbe + Schatten). **Owner:** WS1. Arbeite mit **parallelen neuen Claude-Code-Chats** (Georg 20.10.) und koordiniere sie selbst; #439 läuft daneben weiter.

**Tier 0**
1. Lies `30_DECISIONS/CANON_3D/CANON_3D_R1.md`. Alles Gestalterische in 3D folgt diesem Kanon, das gilt auch für deine Spielszenen. Fehlt Wissen, wird es recherchiert und als Regel eingetragen.
2. **Zuerst E Einpassung** (Georgs Hauptproblem): Dioramen und Scenelets liegen auf dem Terrain herum, mit anderen Farben, Texturen, anderem Licht und anderer Geometrie. Sie werden ins Terrain eingepasst und als ein Gesamtbild gestaltet (Kanon Gebiet 15). Danach **A Recherche** R1–R3, dann R4–R8 (`CANON_3D/RESEARCH_BACKLOG_R1.md`), und **B Werkzeuge** W1–W4.
3. **Abgabe je Paket:**
   - Datei in `CANON_3D/sources/` (Recherche) bzw. Code mit Tests;
   - Meldung in `WS1_STATUS`;
   - WS0 trägt sie in den Kanon ein. Kein Merge auf main ohne Georg.

## Block
**Parallel-Chats (Vorschlag, du entscheidest):**
- Chat 1: R1 + R3 (Inszenierung, Set-Dressing);
- Chat 2: R2 + R4 (Etherington-Originale, Farbtheorie);
- Chat 3: W1 + W2;
- Chat 4: W3 + W4.

Jeder Chat bekommt diesen Brief + den Kanon als Startlektüre.

**E · Einpassung ins Terrain (Kanon Gebiet 15):**
- **Laufzeit-Einpassung:**
  - Das Terrain läuft in jede Szene hinein, mit Schürze bzw. Erdkeil am Sockel und `footprint`-Absenkung.
  - Die Szene nimmt die Rollen-Töne der Biom-Palette des Terrains an; Meshy- und Kit-Farben werden auf Rollen umgetönt.
  - Ein Knet-Material, eingebackenes Licht bzw. AO wird entfernt, nur das eine Rig.
  - Ränder laufen über Steinbänder (Grammatik §4) und Sprenkel in beide Richtungen aus.
- **Probe:** eine bestehende Szene (Vorschlag Ork-Band, PASS-Bestand) vorher/nachher im echten Terrain aus Spielkamera und den 4 Kritiker-Kameras.
- **Messung** mit W1-Export + `kfb_env` (B1, E1/E2, M1–M3).
- **Recherche-Frage dazu in R1:** Wie verschmelzen stilisierte Spiele handgebaute Sets mit prozeduralem Gelände (Tiny Glade, Townscaper, Animal Crossing, Ghibli-Layouts)?

**A · Recherche:**
- **Format je Ergebnis:**
  - Regeln in Zahlen mit Quelle;
  - „gilt für KFB“ oder „nicht übernommen, weil …“;
  - am Ende ein Vorschlag: welcher Gate-Test bzw. welches Kritiker-Kriterium die Regel prüft.
- **Quellen:** Bildtafeln und Bücher sinngemäß in eigenen Worten, keine langen Zitate.
- **R1 Inszenierung** ist das Wichtigste: Fokus, Leserichtung, Hell-Dunkel-Massen, Tiefenstaffel und Silhouette aus festen Spielkameras.

**B · Werkzeuge:**
- **W1 Laufzeit-Gate:** Ein Export `tools/env-export.mjs` schreibt jede Spielszene bzw. Bühne als `kfb.env-scene/1` (Format im Kopf von `CANON_3D/lib/kfb_env.py`). Danach läuft `python3 CANON_3D/lib/kfb_env.py <json>` im Testlauf.
  - Deine `src/world/grammar.js` ist die Vorlage für die Prüfer; Toleranzen identisch halten.
  - Abweichungen meldest du, nicht still angleichen.
- **W2 Sprenkel:**
  - `kfb-speckle-transition.v1` (V-403) als einzige Fassung in den Hub (`CANON_3D/lib/`), mit Quellzeile;
  - dazu ein kurzer Prüfer: kein Verlauf, kein Alpha, drei Größen.
- **W3 Validator** für Scenelet, Figurenkarte und Besetzung (`kfb.scenelet/1`, `cast.r1.json`, `*.figure.json`):
  - Pflichtfelder;
  - `eyeRig` vorhanden (V-391);
  - cast-IDs auflösbar;
  - Clips aus `clips.r1.json`.
- **W4 Bewegung + VFX:**
  - Prüfung Squash ≤ 8 % (Stürze nach V-180) und Reihenfolge Augen → Kopf → Körper (Kopf 2–4 Frames nach den Augen);
  - die V-499-Checkliste als automatischer Test, soweit messbar;
  - der Rest geht als Liste an den Kritiker.

**Entscheidungen, die du umsetzt (V-564):**
- **Boden:** Farbflächen nach Georgs Terrain-Design vom 19.10. aus der Stimmung (V-441). Satte Grüntöne als Boden sind gesperrt. Der größte edgePalette-Anteil gilt nur noch für Schürze und Steine am Bühnenrand.
- **Schatten:** echte Shadow-Map-Schatten aus dem einen Rig, getönt nach der Palette des Empfängers (castShadowTint), Kontakt mit max statt Summe. Keine Blob- oder Scheiben-Schatten. Das steht nicht im Widerspruch zu LIGHT_MODEL_R2: eine Sonne, ein Schatten, nur eingefärbt.

**Regeln:**
- Ports und Branches wie bisher.
- `KFB Open World/` nie anfassen.
- Nur selbst geprüfte Ergebnisse melden.
- **Kritiker:** In Phase 1 (bis es läuft) prüft der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md` jede 3D-Lieferung, also auch deine Szenen-Clips.
