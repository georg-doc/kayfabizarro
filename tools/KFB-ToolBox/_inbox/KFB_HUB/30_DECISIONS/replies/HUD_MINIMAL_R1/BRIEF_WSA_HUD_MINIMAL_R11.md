# Für WSA HUD · HUD Minimal R11: Georgs Richtung nach R9b · 14.11. (Georg, V-1742)

**Georgs Entscheidung (14.11., wörtlich):** „HUD erstmal mit cleanen panels/overlays, unseren 3D heros und claymation fluff balls (sind noch viel zu sehr plastikbälle) und claybound-style buttons.“

**Damit gilt für R11 (auf Basis R9b, Stand @e4e68fea):**
1. **Panels und Overlays:** die ruhigen, flachen Flächen und Kanten aus R9b bleiben die Grundlage.
2. **Icons:** zurück zu unseren 3D-Hero-Icons (N32 r2, `hud-hero.r1.json`) in Originalfarben mit dezentem Schatten unten rechts, wie im Brief R1 (V-1498, V-1503, V-670/V-671); keine neue Icon-Familie; Glyphen nur für Tätigkeiten ohne Asset (V-1498); die Radio-Glyphen radio_glyphs_fixed_r2 bleiben (V-1575).
3. **Fluff-Kugeln:** Knete statt Plastik – Oberfläche, Glanz und Farbe wie die Knete-Fluff-Kugeln im Spiel und im Clay-Kit (`src/data/hud/kfb-clay-kit.r2.json`, `fluffy.webp`), in unseren sechs Fluff-Farben (V-1722), alle gleich groß auf einer Linie, Zahlen weiß auf der Kugel (V-1576).
4. **Knöpfe im Claybound-Stil:** weiche, dicke Knete-Knöpfe mit leichter Wölbung und Kante, Beschriftung bzw. Icon eingesetzt – Bildvorlage https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WEBSITE_R1/refs/ref_claybound_menu.jpg (nur Haltung und Material, keine fremden Assets); Zustände Ruhe, Hover, Klick mit dem Cartoon-Deformer (V-1519).
5. **Unverändert aus Brief R1:** Plätze nach HUD_BELEGUNG_R1 – kein Teil wandert (Leben bleibt oben rechts beim Kopfradio, grün→rot ohne Herz, V-1575/V-1668); Georgs Radio-Gehäuse radios_r2 höchstens umgefärbt; Raster `hud-screen.r1.json`; alles aus dem Skin `hud-skins.r2.json`.

**Rückgabe:** zuerst drei Stilrahmen (Tag, Nacht, Kampf) auf einem echten Spiel-Screenshot, daneben R9b und die Definitionsbilder (ref_claybound_menu.jpg, Clay-Kit-Fluff-Kugel), die Knopf-Zustände Ruhe/Hover/Klick als kurze Bewegung und die Liste Teil → Quelle, als Bild in PR #49; vor der Hub-Frage schaut WSV mit Art-Direction-Auftrag drauf (V-1519), dann wählt Georg im Hub. Danach Skin `minimal` als JSON-Vorschlag im Format von `hud-skins.r2.json` mit Asset-Satz (Sprite-Sheets mit Raster und geschnittene PNGs @1x/@2x), Einbau macht WS0. Die FPS-Ebene (R10) ruht bis zum Ego/Schulter-Schalter (V-1710, WS0).
