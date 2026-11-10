# VFX-Fachprompts R1 · Atmosphere FX und Pyro FX (Georg 10.11.2026, aus dem Web-Chat)

Status: abgelegt, nicht gestartet. Starten erst nach der Konsolidierung der VFX-Baustellen:
- Atmosphere FX
- Fahrzeug-VFX
- Combat-/Waffen-VFX (Qualitätsdurchgang PR #111)
- Pyro FX

Dann je Prompt eine eigene Claude-Code-Sitzung auf game/integration-r2.

Empfehlung aus dem Web-Chat:
- zuerst Prompt 2 (Pyro): quellenbasierte Diagnose der vorhandenen Explosions-Bildfolge, daraus genau ein begrenzter Reparaturvorschlag (Visual-Gate der Explosion bisher nicht bestanden);
- Prompt 1 (Atmosphere): Qualitätsaudit und Tuning, kein Neuaufbau, der Fernnebel ist geschützt.

Prompt 1: KFB Real-Time Atmospheric & Volumetric FX Director (Wolken, Nebel, Tiefe, Streuung, Wetter, Wind; liest cloudField, driveAtmos, driveWeather, skyDirector, skyBake, sky-r1, kfbWind, kfb-sky-r1.json, perfBudget).
Prompt 2: KFB Stylized Pyro, Smoke & Explosion FX Director (Explosionen, Brand, Mündungsfeuer, Rauch, Staub, Einschläge, Trümmer; liest combat-fx-r2 Brief/Return, explosionSheets/Shards/Paper/Confetti, smoke-plume, fire-flipbook, fire-sparks, campfire r2, impactStar, small-burn und wall-afterburn README).

Volltext (leicht verdichtet, alle Regeln erhalten): PROMPT_ATMOSPHERE.md und PROMPT_PYRO.md in diesem Ordner.

## SkillDB-Skills (Georg 10.11., Web-Chat-Recherche, abgeglichen mit game/integration-r2)
Als Wissensbausteine in vorhandene Briefings einbetten, nicht als neue übergeordnete Projektanweisung. Reihenfolge nach erwartetem Nutzen:
1. Procedural Generation (skilldb.dev/skills/game-design-skills/procedural-generation) → KFB Procedural Scene Composition Director: Mini-Szenen mit visueller Geschichte aus vorhandenen Assets und Platzierungsregeln, deterministisch; kein neuer WorldBuilder. Erster Test: drei Scenelets mit echtem Weltkontakt.
2. Real-Time Game VFX (skilldb.dev/skills/game-art-pipeline-skills/game-vfx) → KFB Gameplay VFX & Feedback Director, zusammen mit PROMPT_PYRO und PROMPT_ATMOSPHERE; erster Test: Schuss–Treffer–Reaktion in Spielgeschwindigkeit alt gegen neu.
3. LOD Pipeline (skilldb.dev/skills/game-art-pipeline-skills/lod-pipeline) → KFB Silhouette-Preserving LOD Director; erster Test: ein Diorama aus drei Distanzen, Bild plus gemessene Ersparnis.
4. Game UI UX (skilldb.dev/skills/game-design-skills/game-ui-ux) → KFB Clay HUD Interaction Director, streng mit freigegebenen Originalassets; erster Test: HUD bei Erkunden, Kampf, Fahrt.
5. Timing & Spacing (skilldb.dev/skills/animation-principles-skills/timing-spacing) → KFB Cartoon-Claymation Motion Director (Anticipation–Impact–Overshoot–Settle, Georgs Motion-Block-Gedanke V-915), ohne den Renderer auf 12 fps zu drosseln; erster Test: derselbe Slop- oder Prop-Treffer alt gegen neu.
Empfehlung des Web-Chats: zuerst Game VFX mit den Pyro-/Atmosphäre-Prompts (konkrete Qualitätslücke), langfristig Procedural Generation.
