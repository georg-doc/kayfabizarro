# KFB Clay Production System · ToolBox, Resident Atlas und Farbwelt

Status: **CURRENT BRIEFING · EXECUTION NOT STARTED**  
Owner: bestehende KFB ToolBox / Resident Atlas / World presentation owners  
Datum: 2026-09-28

## Ziel

Die akzeptierte H0/K1/T3-Clay-Linie wird als ein wiederverwendbares Produktionssystem zugänglich:

1. ToolBox authorisiert Clay-Material, Texturklasse, Distanzband und Vorschau;
2. Resident Atlas authorisiert Character-Look, Pose sowie Sitz-/Cockpit-Fit;
3. ein gemeinsamer semantischer Palette-/Seed-/Biome-/Light-/Mood-Vertrag hält World, Racer, Residents, Vehicles und HUD farblich zusammen.

Es entsteht kein neues Hub- oder Studio-Design und kein zweiter Material-, Rig-, Vehicle- oder World-Owner.

## Lesereihenfolge

1. [ToolBox Clay Look Authoring](TOOLBOX_CLAY_LOOK_AUTHORING_BRIEF.md)
2. [Resident Atlas · Cockpit und Seated Rig](RESIDENT_ATLAS_COCKPIT_SEATED_RIG_BRIEF.md)
3. [Farb-, Licht- und Mood-Vertrag v1](COLOR_MOOD_PALETTE_CONTRACT_V1.md)
4. [Quellen](SOURCE.json)

## Produktionsreihenfolge

1. **CLAY-TOOL-01:** vorhandene Production-03-Oberfläche um genau ein Clay/Look-Modul ergänzen; Original/Clay A/B und JSON-Export.
2. **SEAT-FIT-01:** Resident Atlas mit einem FrizzleBob-Driver-zu-`kart-oobi`-Fit beweisen; GothGirl als Rig_Medium-Gegenprobe. Keine Fahrphysik.
3. **COLOR-01:** gemeinsame semantische Rollen und fünf reproduzierbare Seed-Presets in ToolBox/World-Vorschau prüfen.
4. Erst danach übernehmen World/Racer/Combat die exportierten Profile über kleine Adapter.

## Harte Grenzen

- H0/K1/T3 `clay-material.v8.js`, `clay-profiles.v2.js` und `clay-relief.v2.js` sind die aktuellen Donors; nicht parallel neu erfinden.
- KayKit-/Kenney-Farben werden als gemessene Quellrollen gemappt, nicht pauschal übermalt.
- Resident Atlas authorisiert Figur/Pose/Fit. Vehicle Lab/Racer authorisieren Fahrzeug, Radkontakt, Physik und Consumer-Kamera.
- Motion Lab authorisiert Clipbindung/-übergänge. Atlas darf Clips zur Prüfung abspielen, wird aber kein zweiter Movement-Owner.
- Pro Asset-Klasse ein Profil; keine Slider-Flut pro Mesh.
- UI bleibt kompakt. Bühne zuerst; Messwerte und LLM-Doku hinter dem vorhandenen Info-/Docs-Layer.
- Keine Live-Promotion ohne echten Consumer-Beweis.

## Erfolgsbild

Ein Nutzer kann in derselben Produktionslinie:

- Character/Vehicle/House/Road/Terrain als Original oder Clay vergleichen;
- Profile und Seed-Mood wechseln, ohne semantische Lesbarkeit zu verlieren;
- einen Character korrekt in einen gemessenen Sitz-/Cockpit-Rahmen bringen;
- Look-, Pose- und Fit-Profile als kleine JSON-Verträge exportieren;
- dieselben Profile in World/Racer konsumieren, ohne dort neue Slider oder geratenes Tuning anzulegen.

