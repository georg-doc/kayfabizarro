# Konzeptblatt · Goo-Vorstadt (Zerstörung) · R1 · 2026-10-21 · WS0

> **TUNE Georg 22.10. (V-625):** Die übernommenen Häuser sind **nicht schwarz, sondern in Graustufen**, als hätte jemand die Farbe gestohlen. Die Farbe kommt mit den Fluff-Kugeln zurück. Das gilt überall, wo unten „schwarz“ oder „Tusche“ steht.

> **Georg 22.10. (V-629):** Zwei Bautypen.
> - **Utopia-Einheitsbau** aus den Kenney-Sets Commercial, Industrial und Suburban: kantig, gleichförmig, modular. Das sind die übernommenen Blöcke (grau). Aus den Modulen entstehen größere Blöcke, und sie lassen sich leicht vorbrechen.
> - **Gute Behausung der NPCs** aus KayKit City: rund, verspielt, Einzelhäuser.
> - Straßen, Bordsteine und Gehwege bleiben Joyride-Standard. Kenney Roads nur für Kreisverkehr, Brücken, Auffahrten und Überführungen.
> - Beide Kits im selben Knete-Material (J17). Der Kontrast entsteht über die Formsprache und über Grau gegen Farbe.
Felder vollständig in `concept.json`. **Use what works:** Grundlage ist die Joyride-Stadt (J15 `transition-atlas.v1.js`, J17 Clay v8 + Soften, `houseLOD`/`flatNoCast`, Style Guide §7). Nicht neu erfinden.

**Ein Satz:** Diese Szene zeigt eine freundliche Vorstadt, in der einzelne Häuser von den Black Fluffern mit Zensur-Goo überzogen sind, weil Utopia dort folgsame Bewohner hält, und der Spieler soll zuerst das tropfende schwarze Haus zwischen den bunten Knethäusern sehen.

**Geschichte:** Die Black Fluffer bauen und übernehmen Wohnblocks als gemütliches Gefängnis (Utopia-Sozialbau, Matrix): drinnen flimmert der Fernseher, die Bewohner leben ein bequemes, folgsames NPC-Dasein. Wer ein Goo-Haus zerstört, befreit sie – sie fliehen empört und schimpfen, aus den Mauern flattern Monster, das Haus zerfällt zu buntem Fluff. Zerstörung = Reinigung, nicht Töten (passt zu V-583/V-595).

**Bildidee:** Eine sonnige Vorstadtstraße mit Bürgersteig, Laternen und Ampel; mittendrin ein glänzend-schwarzes, tropfendes Haus mit warmem Fernsehlicht in den Fenstern.

**Fokus und Leserichtung:** Goo-Haus → Straße und Bürgersteig → bunte Nachbarn → Ampel-Kreuzung.

**Übernahme aus Joyride:**
- Bordstein, Stadtsockel und Gehwegplatten wie in `transition-atlas.v1.js`.
- Häuser KayKit `building_A–H` (SC 4,1, Höhenrhythmus) plus Kenney City (knetig übersetzt).
- Möbel-Takt: Laterne 21 m, Baum versetzt, Bank + Mülleimer 42 m, Hydrant 63 m.
- **Laternen** mit `yaw.streetlight = π/2`, alle zur Straße ausgerichtet (Georg).
- **Ampeln:** KayKit `trafficlight_A/B/C`, neu an Kreuzungen. Signal zur ankommenden Spur, gleiche prop-guard-Regel.
- Clay-Look der Häuser: J17 `clay-material.v8` (Profil house) + `clay-soften` (RC.facade.h0).
- Leistung: `houseLOD` (InstancedMesh je Quelle, `claySeed`), `flatNoCast`, hiDist 55.

**Neu gegenüber Joyride:**
- Straßen**raster** statt einer Strecke: Vorstadt mit Kreuzung, T, Ecke und Sackgasse mit Wendeschleife (Style Guide §7), lockere Zeilen, Vorgärten.
- Goo-Häuser: Tusche `#1f1a14` mit Glanz, Tropfen an Traufen, warmes TV-Fensterlicht als Materialfarbe.

**Zerstörung:**
- Nur in der Nähe des Spielers zerstörbar.
- Baustein-Typen einmal vorgebrochen, instanziert, keine Laufzeit-Bruchphysik.
- Stücke ≤ 2 s, dann bunter Fluff.
- Budget ≤ 2 ms, ≤ 200 Stücke, Rauch nach V-514 §3.

**Beats:** heil → wabbelt und reißt → bricht (Monster flattern raus, Bewohner fliehen und schimpfen) → Fluff.

**Vermeiden:**
- RKIT-Test-Hub-Look (V-014)
- eigene Lampen mit harten Schatten (V-429)
- OSM-Häuser
- sockelFold und curbAir (J13)

**Phasen:**
1. Look-Test WSB (K14).
2. WS1 Straßengenerator.
3. Zerstörung + Fluff.
4. Bewohner und Monster.

**Prüffragen:**
- Ist das Goo-Haus aus der Spielkamera sofort lesbar?
- Stehen Laternen und Ampeln richtig zur Straße?
- Ist der Clay-Look gleich J17 (Bildvergleich `chase-straight.jpg`)?
- Liegt die Straßenzone ins Gelände eingepasst, ohne harte Kante?
