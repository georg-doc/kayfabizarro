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
