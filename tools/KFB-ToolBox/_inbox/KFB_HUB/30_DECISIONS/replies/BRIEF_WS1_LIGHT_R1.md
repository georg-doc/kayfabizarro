# Briefing WS1 · Licht L1 · Diorama-Licht, Lichtstimmung, Schatten (V-329)

Stand 16.10.2026 · WS0 → WS1 · beantwortet WS1_STATUS §38.2 und WS0-Intake #404 (`replies/WS0_INTAKE_WS1_DIORAMA_LIGHTING_R1_2026-10-15.md`).
Grundlagen (schon recherchiert, kein Neustart): `replies/WSA_LIGHT_STUDY_C_R1.md` + `replies/light-presets.json` (J17-Werte gemessen, E50-Abendvorschlag), PR #403 `research/kfb-world-lighting-color-cohesion-r1-2026-10-15` (Quellen-Audit, Fallen), `LESSONS_SHADOWS.md` (Branch `work/clay-style-ssot-2026-10-01`), V-305 Farbgenerator `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js`, V-286 Meshy-Tönung 18 %, `BILLBOARD_STANDARD_R2.md`.

## Ziel
Ein Licht für das ganze Spiel, das sich wie ein beleuchtetes Diorama anfühlt: warmes Tageslicht als Basis, Lichtstimmung je Deck/Story-Mode und Tageszeit, viele kleine lokale Lichtquellen aus den Bühnen selbst (Laternen, Neon, Kristall, Fackeln, Monitore) – und **wenige echte Schatten**, weil Echtzeit-Schatten teuer sind (Georg).

## Regeln
1. **Ein Licht-Schreiber:** der WS1-R3F-Host schreibt Sonne, Hemisphäre, Fill, Himmel, Nebel, Exposure, Schatten. Bühnen liefern nur Daten (Preset, Story-Seed, lokale Lichtpunkte). Keine zweite Licht-/Kamera-/Renderer-Instanz.
2. **Ein Zeit-Parameter** `timeOfDay` (0–1) steuert Sonnenwinkel, -farbe, -stärke und Hemisphäre stufenlos; drei Ankerstimmungen:
   - **Tag** = J17-Referenz: Sonne #fff4e6 / 2,9, Hemi #eef4fa / #9a8a78 / 1,05, Gegenlicht #ffe6d6 / 0,6, Sonnenrichtung Elevation ≈ 49°, Azimut ≈ −53° (light-presets.json). WS1 vergleicht das mit seinem heutigen Bühnenlicht (Hemi 1,25, Sonne 1,8, NoToneMapping) und schlägt die Tonemapping-Wahl vor (J17 = ACES).
   - **Goldene Stunde** = E50-Vorschlag: Sonne #ffd3ae warm, Hemi/Boden/Fill neutral wie J17 (nicht alle Rollen orange), Stärken halb zwischen Abend und Tag.
   - **Story-Nacht:** gedämpfte kühle Hemisphäre, Sonne fast aus; Lesbarkeit kommt aus den lokalen Lichtern. Karte, Augen, Mund, Sprechblase bleiben lesbar.
   - Später optional: **surreal** als Akzent, erst nach Tag/Nacht-PASS.
3. **Farbe aus dem Generator (V-305):** Himmel-, Nebel- und Hemi-Tönung aus `fromStoryMode`/`fromHue` der jeweiligen Bühne bzw. des Decks; Meshy-Texturen bleiben zu 82 % original (V-286). **Die gedruckte Karte wird nie umgefärbt** (kein Grading auf Billboard/Bildfläche). Grading, falls überhaupt, ganz zuletzt.
   - **Tageszeit × Palette (Ergänzung zu V-305):** Tag = Himmel/Nebel genau aus der Generator-Rolle `sky`; Goldene Stunde = dieselbe Rolle, in OKLCH um höchstens 25° Richtung Orange gedreht und leicht entsättigt; Nacht = Helligkeit L × 0,35, Buntheit × 0,5, Farbton Richtung Blau. Nebel folgt immer der tatsächlich gezeigten Horizontfarbe. So bleibt jede Bühne in jeder Tageszeit ihre eigene Palette.
4. **Schatten sparsam:**
   - genau **ein** Schatten werfendes Licht (Sonne), eng angepasster, texel-gerasteter PCFSoft-Frustum um die Spielfläche (LESSONS_SHADOWS; kein VSM wegen Kontakt-Lecks);
   - Schatten werfen nur Figuren, Fahrzeug und wenige Leit-Requisiten; **Meshy-Dioramen werfen keine Echtzeit-Schatten** (ihre Texturen enthalten schon gemaltes Licht/AO), sie empfangen den Figurenschatten;
   - für **alle** Figuren weiche Kontaktschatten (contact-ao wie bei FB, jetzt auch KayKit, V-203), damit niemand schwebt, auch nachts;
   - lokale Lichter werfen **keine** Schatten;
   - Gesichter empfangen keine Schatten (wie heute bei FB: Gesicht `shadowOff`), damit Augen und Mund lesbar bleiben.
   - Hinweis: Die Web-Chat-Recherche schlug „jede Figur und jedes Requisit wirft“ vor – hier gilt Georgs Linie (wenige Schatten, Performance).
   - Sonnenrichtung: WS1s heutige Sonne kommt von der anderen Seite (Azimut ≈ +39°); für L1 auf die J17-Richtung (≈ −53°) umstellen und im Bildpaar zeigen.
5. **Lokale Lichtquellen (Diorama-Charme):**
   - je Bühne `practicals[]` im Slot-/Bühnen-JSON (`kfb.stage-descriptor/1`): Position, Farbe, Reichweite, Stärke, Typ (Laterne, Neon, Kristall, Fackel, Monitor), optional Flackern;
   - Umsetzung: emissives Material am Objekt + **kleiner Pool** von höchstens 4–6 PointLights ohne Schatten, nächstgelegene zur Kamera/Figur aktiv (wie der vorhandene Tunnel-Lampenpool);
   - nachts tragen diese Lichter die Szene; tags fast unsichtbar.
6. **Kamera:** dieselbe StageOrbitCam, feste Marken Totale / Two-Shot / Karte / Gesicht, 16:9 und 9:16 (Karte in 9:16 nicht abschneiden).

## Kleinster Auftrag (L1) – parallel zu M2, ohne M2 umzuordnen
- **Host:** die bestehende Zwei-Figuren-Dialogszene (FB + GothGirl, echte Karte, Billboard).
- **Bühnen:** dazu zwei schon gelieferte Meshy-Bühnen mit vielen Lichtquellen: **Goblin-Bank v2** (Lampen, Tresor-Gold) und **Atlantis** (Kristall, Portal-Leuchten); WS0 trägt deren `practicals[]` nach, wenn WS1 das Format bestätigt.
- **Bildreihe:** je Bühne Tag / Goldene Stunde / Nacht an identischer Kamera, 16:9 und 9:16.
- **Abnahme-Raster (V-310/V-312):**
  - G1 Augen, Mund, Sprechblase, Kartenkanten und Marginalien in allen drei Stimmungen lesbar;
  - G2 keine schwebenden Figuren (Kontaktschatten sichtbar), kein Überstrahlen (< 0,1 % Figurenpixel geclippt);
  - G3 Meshy-Textur erkennbar original, Karte unverändert;
  - G4 Nacht: mindestens zwei lokale Lichtinseln sichtbar, Figuren davor lesbar;
  - G5 Kosten: Lichtanzahl, Schatten-Pass-Zeit, Draw Calls, Frametime vorher/nachher; Ziel 60 fps auf Georgs M4.
- **Prüfen:** schlank, Diff + kurzer Browser-Smoke. **Abnahme:** Georg live über `https://ws1-preview.kayfabizarro.pages.dev/` (V-314) plus die Bildreihe.

## Nicht in L1
Wetter, voller Tageslauf in Echtzeit, HDRI-Import (nur wenn ein Mangel sichtbar wird, dann ein isoliertes CC0-HDRI), Metatheater-/Pop-up-Kulissen (eigener späterer Pilot, `replies/WS0_METATHEATRE_POPUP_DIORAMA_INTAKE_R1_2026-10-15.md`), alle übrigen Bühnen (nach L1-PASS per Preset übertragen).
