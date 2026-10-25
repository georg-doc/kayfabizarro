# Briefing für Claude Design · H15 Mindscape · Runde 2 (M4 Boden + Übergänge, M5 Leistung) · WS0 · 25.10.2026 (V-757, V-758, Georg q202)

**Stand 25.10. nachts (WS0):** WS0 hat in H15 eine Zeile behoben (soundbed.js: Hall-Impuls in der Kontext-Rate statt 24 kHz, sonst bricht der Browser ab; öffentlicher Pin 5eb6aeb). Bitte diese Zeile in deine H15-Datei übernehmen bzw. auf diesem Stand weiterarbeiten.

**Tier 0**
1. **Georg hat Runde 1 gesehen** (M1 „top“) und deine Empfehlungen in q202 angenommen. Diese Runde hat zwei Teile:
   - **M5 Qualitätsregler:** zuerst abgeben, reine Technik;
   - **M4 Boden und Übergänge:** in zwei Schritten. Erst Bilder, die Georg abnimmt (V-740), dann die Engine-Änderung.

   Die Clips kommen in einer eigenen Runde. Arbeite in deiner H15-Datei weiter, nur additiv; H13 und H14 bleiben unberührt.
2. **Der Bildpool ist öffentlich** (Georg q202, dein Weg a):
   - H15 liegt mit `hypernorm_r3/pd_pool/` (481 Bilder) im öffentlichen Repo `georg-doc/kayfabizarro`, Zweig `tools/h15-mindscape-2026-10-25` @`b77e30661ab2a3b3e40c3c08854a98289f77c49b`, Ordner `tools/KFB-ToolBox/_inbox/KFB_Billboard_Kaleidoscope_H15_Mindscape_2026-10-25/`. jsDelivr liefert Manifest und Bilder an diesem Pin (geprüft: 200).
   - WS0-Lokalmessung (Mac, Preview ohne Sound, nicht im DROP): Seite lädt, 3D 100 fps, WS0-Pool 481/481, alte Landkarten 20/20, 6 Gedichte gefunden.
3. **Abgenommen wird am Bild:** Die Engine-Änderung für M4 beginnt erst nach Georgs Abnahme der Bilder aus Schritt A. Danach ist der Vergleich der gebauten Bilder mit diesen Frames das Gate.

## M5 · Qualitätsregler (zuerst)
- Der Regler setzt die gemessenen fps in Stufen um: DPR 2 → 1,5 → 1, Schalen 2 → 1 → 0, Gedichtband jedes 2. → 3. Frame, Hall aus. Er schaltet nur auf Taktgrenzen um, die Stufe steht im UI.
- **Ziel:** im DROP mindestens 30 fps auf dem MacBook und dem Mac mini, mindestens 24 fps auf Georgs Handy. Das sind die Zielgeräte (q202). Das fps-Formular aus deinem OFFEN_UND_FRAGEN bitte mit deinen Werten vorausfüllen.
- Der Worker-Teil (OffscreenCanvas) kommt nicht in dieser Runde.

## M4 · Schritt A: Bilder zur Abnahme (vor jedem Bau)
- **Storyboard Durchflug, 4–8 Keyframes:** Die Kamera fliegt durch Schale B, B wächst auf den Wandradius, die alte Wand wird zur innersten Schale, und der nächste Seed übernimmt. Der Moment fällt auf den DROP. Je Keyframe eine Zeile für Kamera, Schalen und Ton.
  - Ton: Das Soundbed läuft mit, ein Filter öffnet sich zum DROP hin, kurzer Sog. Ein AudioContext.
  - Obergrenze (V-726): höchstens Wand plus 2 Schalen live, eine Stufe Rekursion. Ältere Schalen werden beim Übergang entsorgt.
- **1–2 Style-Frames „Boden in der Sphäre“:**
  - Eine KFB-Karte aus dem KFB-Kartenpool (KFBCorpus bzw. `data/h6-card-crops.json`), nicht die alten Landkarten. Gewählt wird die Karte aus dem Deck der laufenden Einstellung, sonst per Seed.
  - Sie liegt als atmendes Relief aus Knetkugeln, rund und eng zugeschnitten (Georg 24.10.).
  - Höhe aus der Helligkeit (Probe R1) oder aus vorberechneten Höhenkarten von WS0 (Probe R2, Depth Pro). Referenzen `hypernorm_r3/proben/r2_3_boden.jpg` und `r3_2_explosion.jpg` im Material-Zweig `design/claude-design-r3` von `georg-doc/KFB-Stunt-Car-Race`.
  - Die Kugeln stieben auf, wenn die Kamera im Autopilot tief darüber gleitet bzw. der Blick im Rabbit-Hole-Modus darauf ruht, und finden zurück (Probe R3).
- **Ein versteckter Auslöser** für den Rabbit-Hole-Modus, der denselben Durchflug startet: eine Pupille, ein Fernsehbild, eine gemalte Tür oder eine kleine Kugel in der Kugel. Ein Bild.
- **Kandidaten Röhrenfernseher und Tür:** je 2–3 Bilder mit Quelle. Nur CC0- bzw. `_FREE`-Pakete oder Laden zur Laufzeit an einem Pin ohne Kopie. Keine Kauf-Assets ins öffentliche Verzeichnis. Das KFB-Auge nur über EyeRig v6 bzw. `mountGraft()`, kein Nachbau.

Diese Bilder gehen über Georg in den Hub. Nach seiner Abnahme folgt Schritt B.

## M4 · Schritt B: Engine (nach Abnahme)
- Boden und Durchflug nach den abgenommenen Frames, ein Renderer.
- **360°-Film aus dem Bake:** Wand, Schalen und Band je Frame mit einer Würfelkamera aufnehmen und nach Equirect umrechnen.
  - Ausgabe als Equirect-2:1-PNG-Bildfolge mit Manifest und Seed. Video-Encoding und Spatial-Media-Metadaten macht WS0.
  - Karten und WS0-Pool kommen mit in den Bake (q202). Die alten Landkarten dafür als feste Liste (Titel und Revision), damit der Film je Seed deterministisch ist.

## Grenzen
- Nichts umbauen, was H14 teilt (Planung, Songform, Bake, `BAKE_SRC`), außer additiv für Karten und WS0-Pool im Bake.
- Gedichte nur im Original und in gemeinfreien Übersetzungen (q202).
- Kanon: Für den Knet-Boden gelten Licht aus einem Rig und Knet-Kugeln aus Probe R3. Die Collage-Sphäre selbst folgt der Engine, nicht CANON_3D.
- Kein Effekt ohne Bildidee, keine Sci-Fi-Kitsch-Panels.

## Zurück
- **M5:** `RETURN_M5.md` (Ehrlichkeitsformat) mit dem fps-Formular.
- **M4 Schritt A:** Storyboard, Style-Frames, Auslöser- und Kandidatenbilder plus kurze Übersicht.
- **M4 Schritt B:** `RETURN_M4.md`, eine Bildfolge bzw. Bildschirmaufnahme von Boden und Durchflug (20–30 s), eine 360°-Bildfolge mit Seed.
- Jeweils als Export-Ordner. Georg legt ihn in Dropbox ab, WS0 übernimmt.
