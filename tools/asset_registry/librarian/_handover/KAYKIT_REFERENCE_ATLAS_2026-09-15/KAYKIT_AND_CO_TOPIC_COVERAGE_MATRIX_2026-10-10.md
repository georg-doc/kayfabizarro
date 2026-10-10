# KayKit & Co · Themenabdeckung für KFB · 2026-10-10

Owner: bestehender Asset Librarian / KayKit Reference Atlas. Nur Recherche, kein zweiter Runtime- oder Material-Owner. Dieses Dokument vergleicht **offiziell verfügbare Themen** mit **offenen KFB-Nachweisen**. Ein genanntes Video ist nicht automatisch visuell analysiert.

## Offizielle Quellen

- KayKit: https://kaylousberg.itch.io/ ; Animationen https://kaylousberg.itch.io/kaykit-character-animations ; Tools https://kaylousberg.itch.io/rpg-tools-bits ; Live Shows https://www.patreon.com/kaylousberg/posts/updates-recap-169539427
- Quaternius: https://quaternius.com/tutorials.html — 28 nummerierte Blender-Themen, nicht vollständig bildweise ausgewertet.
- Kenney: https://kenney.nl/knowledge-base ; Asset Forge https://kenney.nl/knowledge-base/asset-forge/getting-started-with-asset-forge
- Quaternius City MegaKit: https://quaternius.com/packs/downtowncitymegakit.html (modulare Gebäude und Source-Shader sind Produktfunktionen, nicht automatisch separate Tutorials).

## Priorisierte Wissenslücken

| Priorität | Thema | Verfügbare Originalliteratur | KFB-Status und tatsächlich offener Beweis |
|---|---|---|---|
| P0 | Modulare Gebäude, Module, Ursprung/Pivot, Kontakt/Snapping | Quaternius #11 Medieval House; Kenney Custom Blocks/Asset Forge; Kay Medieval Hexagon mit User Guide | WB2/World Atlas/Track Core sind vorhanden. Echte Source-Maße, Anschlüsse, Gelände-Kontakt und semantische Platzierung prüfen; R4 bleibt STOPPED |
| P0 | Gradient-, Atlas- und UV-Texturen | Quaternius #2 Gradient, #19 Atlas, #27 UV; KayKit gradient atlases | K1/H0/K2 Material vorhanden. Original-UVs und Farben unter neutral/KFB Clay isoliert gegenüberstellen |
| P0 | Figurenimport, Rigs, Prop-Anbindungen | Kay Detailed Godot; Quaternius #8 Character Rigging, #10 IK, #12 Rigging Objects; Kenney Character Import als **Kenney-spezifisch** | KayKit Native Motion PR #344 akzeptiert. Präzise Hand-/Sitz-/Equip-Transforms und Rig-Familien beweisen, keine neue Motion-Zentrale |
| P0 | Licht/Schatten/Umgebung | Kay Godot Lighting Video; bestehende KFB Environment- und Shadow-SOP | Creator-Frames fehlen; Three.js-Proof im existierenden Sky/Environment-Owner, kein zweiter Licht-Stack |
| P1 | Gesicht/Mimik/Blendshapes | Quaternius #21/22 Blendshapes; Kays ältere Gesichts-Experimente waren nur WIP | EyeRig/PetMouth/ChatterBox vorhanden. Prüfen, ob konkrete Quellmeshes Morph-Targets besitzen; keine KayKit-Gesichtsrelease erfinden |
| P1 | Walk/Run/IK/Wiggle/Transitions | Quaternius #13 Run, #23 Walk, #24 Wiggle Bones; Kay aktuelle 161 Animationen | Native Medium-Grundset bereits entschieden; offene Übergänge wie Start/Stop/Pivot/Strafe Walk und Large separat prüfen |
| P1 | Werkzeuge, Crafting, Fluff-Arbeit | Kay RPG Tools + laut Creator 28 Tool-Animationen | Fluff-Worker und Motion-Owner vorhanden; erst Actor-Tool-Clip-Grip-Kontakt isoliert nachweisen |
| P1 | Nature/Rocks/Trees/Vegetation | Quaternius #4 Trees, #18 Rocks, #20 Easy Tree; Kay Forest Nature | Plant Lab/KFB Biome vorhanden; echte Quell-Silhouetten, Grounding, Instancing und LOD prüfen |
| P1 | Stadt, Straßen, Innenräume, Fake Depth | Quaternius Downtown City SOURCE bietet Fake-Window-Interior, Vertex Wear, Simple Collisions; Kenney Asset Forge | Nur Donor-Kandidaten; Track Core/Joyride und KFB Environment bleiben Owner |
| P2 | Cel/Outlines/Palette/Trim | Quaternius #6 Outlines, #7 Palettes, #26 Cel Shader, #28 Wood Trim Sheet | KFB Clay/Ink-Kanon nicht überschreiben; als optionales isoliertes Look-A/B |
| P2 | Kartenobjekte und 3D→2D UI | Kay Board Game Bits, 2025 9-slice UI Prototyp | KFB Card/Deck und bestehende Hub-UI bleiben Owner; keine globale UI-Neuarchitektur |
| P2 | Leuchtmaterialien, VFX | Kay Holiday Bits nennt separates holiday_glow-Material | Material-/Audio-/VFX-Owner nutzen; Emission nicht mit beliebig vielen PointLights verwechseln |
| P2 | Blender-Produktion/SOP | Kay Live Shows; Quaternius 28 Tutorials; Kenney Asset Forge & UV Workflows | Einzelsegment mit Zeitstempel → Quellobjekt isolieren → reproduzierbarer Blender-MCP-Vergleich |

## Wichtige Abgrenzungen

- **VIDEO VERFÜGBAR** bedeutet nicht **TIMECODE/FRAME ANALYSIERT**. Quaternius zeigt die Themen im offiziellen Index; konkrete Einstellungen sind noch nicht gemessen.
- Kenneys Asset-Forge-Konvention von 1×1×1 m Standardblock und Pivot an der unteren Mitte ist **nur Kenney-Konvention**, nicht automatisch KayKit- oder KFB-Regel: https://kenney.nl/knowledge-base/asset-forge/importing-custom-blocks-in-asset-forge
- In der alten KayKit Coverage Matrix gelistete Lücken sind teils überholt: Der dortige 18.09.-Override meldet spätere extrahierte Furniture-, Restaurant-, Medieval-Builder- und Space-Base-Quellen. Keine aktuelle Kauf- oder Besitzbehauptung aus dem alten Status ableiten.
- Kay 2021 Facial Blendshapes und 2026 Medieval Village Exteriors/Interiors/Villagers waren in den jeweiligen Nachrichten WIP; aktuelle Veröffentlichung gesondert prüfen.
- Das Legacy-Pack 1.2 von 2022 darf nicht als Nachfolger der neu gestalteten aktuellen Character Animations 1.1 gelesen werden.
- Quaternius-Rigs sind nicht automatisch mit KayKit-Rigs kompatibel.
- Weltlogik, Kausalität, Physik, Save/Reload, Interaktionssemantik und soziale Residents sind primär **KFB-Integrationsaufgaben**, die sich nicht aus einem Asset-Creator-Tutorial allein lösen lassen.

## Nächste thematische Recherche

Empfehlung: zuerst modulares Bauen und Material-Atlas mit Quaternius/Kenney/Kay, anschließend Blendshape/Performance und reale Tool/Worker-Anbindungen. Nur Source/Research; kein Runtime-Fanout.

Der bereits offene konkrete Gate `KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01` bleibt wegen nicht auslesbarer Creator-Frames separat INPUT_BLOCKED. Weitere Research-Arbeit darf ohne Umgehung der Welt-R4-STOP-Regel fortgesetzt werden.

Tests: offizielle Quelltexte und bestehende Atlas-/MVP-Owner gelesen; **0** neue Video-Frames, **0** Blender-Render, **0** Runtime-/Browser-/Stage-Tests.
