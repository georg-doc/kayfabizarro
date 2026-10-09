# Sprint R4 · HUD + Flug-VFX → MVP Drive Loop

Stand 2026-10-09. Vorschlag, Georg entscheidet Reihenfolge und Umfang.

## Ziel

Die R3-Module laufen im MVP-Konsumenten (Island Worldbuilder Lab, r186) mit echter Figur, echtem Jetpack, Audio-Owner und KFB-Clay-Präsentation. Keine neue Spielmechanik.

Pflichtzeile für jede Brief- und Bauaufgabe dieses Sprints:

> **Clay style SSOT:** read `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` and `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` before editing geometry, materials, palettes, deformation, shadows or contact. Do not invent a replacement look.

SSOT liegt auf PR #301, Branch `work/clay-style-ssot-2026-10-01`, nicht auf main.

## Arbeitspakete

### R4-0 · Quellen beschaffen (Blocker)
Nicht gefunden in `main` und `blender-mcp/motion-forge-poc-01-2026-10-08`:
- `docs/MVP_DRIVE_LOOP_R1_PLAN.md` (§3, §3b, §4)
- `ENV_ROLES` · `src/palettes.ts` im Lab
- `kfbBlend` (laut Donor-Findings aus der road-markings-Linie)
- KFB-Mauerwerk-Familie A

Georg nennt Branch oder Pfad. Ohne Quelle: Paket bleibt `SOURCE_REQUIRED`, nicht improvisieren.

### R4-1 · K7 Knet-HUD abgleichen (zuerst)
K7 (`lab-clay/clay-hud.v1.js`, 27.09., Georg: »top!«) hat schon Tacho, Pop-Score, Rucksack-Knopf + Inventar 20 Plätze, Knet-Material v8 mit HUD-Profil in px.
- Tafel: R3 und K7 nebeneinander, gleiche Größe, gleicher Hintergrund.
- Entscheidung Georg: ein HUD-Owner. Vermutlich K7-Material + R3-Bauteile (Radio R3, Moduswechsel, Biom-Palette).
- Ergebnis: `KEEP / ADAPT / REJECT` je Teil.

### R4-2 · Knet-Textur auf Plaketten
Quelle: K7 HUD-Profil, Joyride-Slices (Georg nennt den aktuellen Slice).
- Plakette, Mulde, Knopf mit Handspuren in Pixelmaß, keine Gradienten-Simulation.
- Golden-A/B: R3 glatt | K7 | Kandidat. Urteil `MATCH / TUNE / FAIL`.

### R4-3 · Clay für 3D-Items und Rucksack-Miniatur
- `clayify()` in `kfb-backpack.js` ersetzen durch `clay-material.v10` + `clay-relief.v4` + `clay-toolmix.v1`, Profil `prop` aus `clay-profiles.v2`.
- Quellidentität bleibt (Atlas-Farben, Form). Nachweis: unverändertes Modell | v8-Golden (Profil `prop`) | Kandidat.
- Kleine Props kriegen keine Gelände-Fingerabdrücke.

### R4-4 · Echte Figur + Combat-Mech-Jetpack
- Figur aus dem MVP (FrizzleBob v5b bzw. Rig_Medium), Jetpack aus Seed World `sw-mech.js`.
- Düsen- und Trail-Anker am echten Modell setzen; `hoverPose()` an den Figur-Owner geben, nicht in die Figur schreiben.
- Skinned Mesh: kein statisches Softening.

### R4-5 · Audio-Owner
- Radio-Events (`music`, `play`, `prev`, `next`, `playlist`) an `song-transport.js` / Jukebox.
- Tafel-Platzhalter `<audio>` fällt weg.
- Offen aus K7: Musik-Puls am HUD aus dem Analyser.

### R4-6 · Flug-VFX in Clay
- Jet-Wülste und Puff gegen `lab-vfx/clay-vfx.v1.js` (Joyride J14) prüfen. Events `land`, `impact` laut SSOT.
- Speedlines bleiben additiv; Farbe aus der Biom-Rolle.

### R4-7 · Palette über ENV_ROLES
- `palette` von `createHud()` aus `ENV_ROLES` statt Biom-Hex. Biom-Hex aus `hex-archipel.r2c.js` statt vom Referenzblatt.
- Übergänge Welt: `transition-atlas.v1.js`, keine linearen Verläufe.

### R4-8 · r186-Smoke + Performance
- Module im Lab laden, Ground/Drive/Flight-Route fahren.
- Messregel (Donor-Findings §4): sichtbares, fokussiertes Fenster, Ziel-GPU, keine parallele GPU-Last. Sonst `PERFORMANCE = UNKNOWN`.

### R4-9 · Kleinkram
- Kassetten-Modell in Kenney/Quaternius suchen; sonst Platzhalter behalten.
- Radio-Front im Item-Modell prüfen.
- Senderzuordnung und Künstler mit Georg festlegen.

## Reihenfolge (Vorschlag)

R4-0 → R4-1 → R4-2 + R4-3 → R4-4 → R4-5 → R4-6 → R4-7 → R4-8. R4-9 nebenbei.

## Gates

- Nach R4-1: Owner-Entscheidung HUD.
- Nach R4-2/3: Golden-A/B-Tafel.
- Nach R4-8: Georg spielt im Lab.

## Nicht in R4

Kein neuer Renderpfad, keine eigene Audio-Engine, kein zweiter HUD-Owner, keine neue Spielmechanik, keine Comic-Contrails.
