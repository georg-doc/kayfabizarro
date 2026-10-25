# Konzeptblatt · Farbrollen V-803 · WSB · WS0 · 25.10.2026

Vorlage `CANON_3D/KONZEPTBLATT_R1.md`; bei diesem Job geht es um Farbrollen statt einer Szene. Szenenfelder (Geschichte, Gruppen, Besetzung) bleiben bei den einzelnen Dioramen, wie sie abgenommen sind.

| Feld | Inhalt |
|---|---|
| `one_sentence` | Jedes Bauteil trägt nur noch Rollen statt fertiger Farben, damit die Laufzeit es in der Biom-Palette des Ortes färbt und es zu Gelände, Bäumen und Fluids passt. |
| `palette_roles` | Rollen und Codes nur aus `replies/COLOR_CONCEPT_R1.md` → „Nachtrag 25.10. · Ausroll-Rollen“ und „Rollen-Codes im COLOR_1-Kanal“. Die Codes 0–5 von B9 bleiben; neu sind 6–16 und 255 = keine Rolle. COLOR_1 trägt die Standardrolle; die surreale Umbelegung macht WS1 zur Laufzeit. |
| `color_script` | Grundton 60 % Boden-/Wandrollen, 30 % Fels, Holz und Rahmen (`strang`, Code 4, ist die Rahmenrolle laut Tabelle), 10 % Akzent nur `pad` (Code 5) am Fokus des Dioramas; Bögen und Krone `tower` (1), Laub 6–8, Fläche `cloud` (12), Wasser (13) nach Tabelle. Lichtstimmung: das eine Rig, unverändert. Verboten: fremde Farben, eingebackene Schatten oder Verläufe in COLOR_0. |
| `form_dna` | unverändert; es wird keine Form angefasst. |
| `life_anchor` | unverändert (bei den Dioramen, wie abgenommen). |
| `cameras` | Proof-Stage mit `kfb_clay_bpy`: die 4 Kritiker-Kameras; Bildpaare mit Canyon-Palette und einer gewürfelten Palette aus `kfb-cartoon-palette.js` `random(seed)` (Seed im Dateinamen, kein eigener Zufall in Blender); Licht über `kfb_light_bpy`. Die Bildpaare im Spiel macht WS1. |
| `reference` | Hub q222 (Gelände) und q220 (Bäume zweifarbig); Golden Samples `replies/COLOR_HARMONY_R1/bilder/01_j17_*`. |

**Antworten auf deine fünf Fragen**
1. **Code-Tabelle:** steht jetzt in `COLOR_CONCEPT_R1.md` (siehe oben). Ein Teil ohne Rolle bekommt 255.
2. **Gehaltene Teile und Kostümteile** (K10, B16, die Wurfwaffen aus B41, B23): in diesem Job keine Rollen, sie bleiben vorerst wie geliefert. V-803 nennt sie nicht; ob sie später umgetönt werden, ist ein offener Georg-Entscheid (V-286 nennt Requisiten). Die Explosionen und Krater aus B41 bekommen Rollen (VFX).
3. **Fassungen:** neue Fassungen neben die alten in die Quellordner (`*_r803`), dazu ein neues Übergabe-Paket `HANDOFF_R2`; der Asset-Pass jedes Teils bekommt das Feld Rollenfarbe aktualisiert (Gate M5). HANDOFF_R1 bleibt unverändert, bis WS1 umstellt.
4. **Meshy-Texturen** (V-286): COLOR_1 markiert die Tönungsbereiche, die Laufzeit tönt dort nur sanft. Ausnahme Amphitheater: Die Bögen werden nach Rollen umgefärbt (V-402).
5. **Bildpaare:** ja, Proof-Stage mit `kfb_clay_bpy`, Canyon-Palette und eine gewürfelte Palette.

**Reihenfolge:** B9 (Codes nur abbilden) → B3, B20, B48, B51 → die Dioramen aus Liste 2 → VFX B19 und B41 (nur Explosionen und Krater). Abgabe je Gruppe: Gate grün, blinder Kritiker, dann Georg.

**Prüffragen vor dem Bau:**
- Trägt jedes Teil genau einen Code?
- Ist COLOR_0 weiß?
- Bleiben STEINKIT, Figuren (auch Figuren-Akzente, eigener späterer Job), Waffen und Fluff unberührt?

**Nachtrag V-808 (WS0, 25.10.):** Codes gelten je zusammenhängender Fläche (Mehrheit der Textur-Codes; Ausnahmen aus V-806 gehen vor). Genau ein Fokus-Teil je Bühne trägt `pad`: der ganze Rahmen samt Bildschirmkante, ohne Rahmen das zentrale Wahrzeichen. Der Rahmen ist damit nicht mehr `strang` (Code 4).

**Nachtrag V-809 (WS0, 25.10., Georg q230):** Auf Meshy-Bühnen gilt für Rollen-Teile „voll“: Zug 1,0 auf Farbton und Sättigung, Helligkeit und gemalte Zeichnung bleiben. Der Satz „die Laufzeit tönt dort nur sanft“ gilt für Meshy-Rollen-Teile nicht mehr; Deckel ΔE00 ≤ 18 und das Maß sanft 8–18 entfallen für sie. Teile mit wenig Sättigung (braun-grau) bekommen eine Verlaufs-Abbildung Helligkeit → Rollen-Farbton als Option in `kfb_clay_bpy` (Kanon-Vorschlag r809, nicht in COLOR_0 oder in die Textur gebacken). Vergleichsblätter: je Bühne vorher/nachher, eine Palette (Canyon), Beschriftung ohne Fachbegriffe.

**Nachtrag V-812 (WS0, 25.10.):** Codes je Bauteil: Spiel-Mesh an Knickkanten über 40° getrennt, große Bauteile (über 15 %) nach Richtung geteilt, an die Stein-IDs gerastet (V-406 bleibt). Code aus der Geometrie (Oberseite top, steil hill[0], schlank tower), B9-Mehrheit nur als Rest; Ausnahmen V-806 und ein Fokus (V-808) gelten. Ersetzt die 35°-Zeile aus V-808.

**Nachtrag V-814 (WS0, 25.10.):** Nach Runde 4 (Stopp-Regel) Probe einer neuen Richtung auf Theater, Mesa und Utopia Stage: Code je Bauteil nur aus Geometrie und Textur-Grundfarbe, ohne B9-Mehrheit; Fokus von WS0 benannt (Bühnenrahmen; Mesa nach Kandidaten-Blatt). Neun nicht sauber einfärbbare Bühnen vorerst nicht im Spiel, außer dem Gefängnis (Georg q232).
