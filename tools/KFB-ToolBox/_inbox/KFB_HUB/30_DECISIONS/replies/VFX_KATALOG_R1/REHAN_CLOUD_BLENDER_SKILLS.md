# rehan/cloud-blender-skills · Einordnung für WSB (WS0, 24.11.2026)

Quelle: https://patch.gg/rehan/cloud-blender-skills, Version 1.0.1. Das Repo (@d659b96e) wurde in einen leeren Scratch-Ordner geladen und nur gelesen; nichts installiert, nichts ausgeführt.
**Owner ist WSB.** Georg hat WSB die Links schon gegeben. Diese Seite ordnet nur ein, sie ist kein Auftrag.

## Was es ist
- **29 Skills für Coding-Agenten** (Claude Code, Codex, Gemini CLI u. a.) zum Steuern von Blender über bpy. Basis sind die blender-skills von EL4CTEO (MIT); Patch hat den Skill `blender-cloud` und Korrekturen ergänzt.
- **Lizenz:** Code MIT, Demo-Clips CC0. Ausnahme: zwei Demos zeigen CC-BY-4.0-Modelle.
- **Wo es läuft:**
  - im eigenen Blender **5.2 LTS oder neuer** (verifiziert auf 5.3); WSB hat 5.2.2, das passt;
  - optional über einen **Blender-MCP-Server** live im offenen Blender (`execute_blender_code`), also unser WSB-Weg;
  - oder auf **Patchs Cloud-Blender**: kostenpflichtig, kleine Sitzung etwa 50 Credits (≈ 0,50 $) pro Stunde, GPU-Render L40S etwa 250 Credits pro Stunde.
- **Stolperfalle Cloud als Standard:** Sobald `pch` installiert ist, laufen alle Skript-Aufrufe **standardmäßig in der Cloud** (`run_in_blender.py`). Lokal geht es nur mit `--local` oder `BAS_BACKEND=local`.
- **Weitere Voraussetzungen:** Python 3.9+ auf dem Rechner; einzelne Skripte haben eigene Bedarfe (z. B. Export mit meshopt).
- **Installation:** Plugin bzw. `install.sh` schreibt nach `~/.claude/skills` und `~/.agents/skills`. Ob und wo, entscheidet WSB.

## Bezug zu unseren Gates und zum Kanon
- **Kanon geht vor.** `CANON_3D_R1.md` §0 schreibt vor, nur mit den Kanon-Werkzeugen zu bauen: Umgebung mit `kfb_env.py` / `kfb_env_bpy`, Figuren, Material und Licht über die Proof-Stage-Module; **eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten**. Skills, die Licht, Material oder Umgebung selbst setzen, kollidieren damit und taugen höchstens als Werkzeug in einer Werkstatt.
- **Passt als Ergänzung:** Prüf- und Mess-Skills, die nichts gestalten. Allen voran `blender-asset-qa`: z-fighting, schwebende Teile, Normalen, Gewichte, Bodenhöhe. Er kann vor `kfb_env_bpy.run()` und Proof-Stage G1–G7 laufen und ersetzt sie nicht.
- **Weitere Regeln, die gelten:** Kit-Assets as-is (V-574), vorhandene Clips nutzen statt neu animieren, keine Arme im Körper (Pose-Gate), Licht = ein Rig (V-385/386), Knete statt PBR-Realismus im Vordergrund.

## Je Skill
Spalte „WSB-Nutzen“ meint Modelle, Rigs, Clips und Kits auf dem Mac mini mit Blender-MCP.

| Skill | Was er tut | WSB-Nutzen | Gate/Kanon | Anpassung | Stolperstein |
|---|---|---|---|---|---|
| blender-core | Einstieg: bpy ausführen (Cloud, MCP oder lokal), 5.x-API-Regeln, Prüfen | hoch: API-Regeln für 5.x, Verifikationsschleife | neutral | klein | Cloud ist Standard, sobald pch da ist (`--local`) |
| blender-cloud | Patchs Cloud-Blender: Sitzungen, Dateien, Vorschau, GPU-Render, Forks | gering; parallele Varianten bzw. Render ohne Mac mini | neutral | mittel | kostet Credits; Dateien gehen in Patchs Cloud; nur mit Georgs Ja |
| blender-scene-setup | Einheiten, Benennung, Collections, Asset-Bibliotheken, Aufräumen | mittel: Szenen-Audit, verwaiste Daten, Pfade | Benennung SM_/SK_ eigene Konvention, nicht unsere | klein | eigene Namensregeln nicht übernehmen |
| blender-hardsurface-modeling | Bevel, Boolean, gewichtete Normalen | gering (wir bauen aus Kits) | kollidiert mit „Kits as-is“ | mittel | – |
| blender-sculpting | prozedurale Sculpt-Pässe | gering | Knete-Look über Kanon-Module | mittel | – |
| blender-retopology-uv | Retopo, UVs, Texeldichte | mittel: KI- bzw. Meshy-Netze leichter machen | neutral | klein | – |
| blender-pbr-materials | PBR-Materialien aus Texturen | gering | kollidiert: Material über Proof-Stage bzw. Knete | groß | – |
| blender-texturing | Kantenabnutzung, Schmutz, Decals | gering | kollidiert mit Knete-Kanon | groß | – |
| blender-texture-baking | Normal-, AO-, Krümmungs-Maps, ORM | mittel: Bake für Spiel-Netze | neutral, wenn Material aus Kanon | mittel | – |
| blender-geometry-nodes | Node-Bäume aus JSON | mittel: prozedurale Hilfen | Platzierung nur über kfb_env | mittel | nicht als Platzierungs-Helfer |
| blender-character-rigging | Rigify, Skinning, Spiel-Skelette, `rig_check.py`, Stresspose | hoch: Rig-Check und Stressposen für Figuren und NPCs | passt zum Pose-Gate (keine Arme im Körper) als Zusatzprüfung | klein | KayKit-Rigs nicht umbauen; nur prüfen |
| blender-facial-shapekeys | ARKit-52-Shapes, Viseme | mittel: Mund und Viseme (FB-Mund, BNWN) | Mimik-Kanon (Avery, Brauen, Lider) geht vor | mittel | Gesichts-SSOT der Figuren beachten |
| blender-animation | Actions, Mocap-Retarget (Mixamo, BVH), Loop-Check, Root Motion, `loop_check.py` | hoch: Retarget auf Rig_Medium, Loop-Prüfung (Hänger, Sprünge) | passt zu „vorhandene Clips nutzen“ | klein | keine neuen Clips erfinden |
| blender-clothing | Kleidung, die dem Körper folgt | mittel: FB-Shirt, Garderobe | Figuren-SSOT | mittel | – |
| blender-hair-grooming | Haar, Fell, Haarkarten | gering | – | mittel | – |
| blender-game-optimization | Budgets, LODs, Draw Calls, `make_lods.py`, `mesh_stats.py` | hoch: LODs und Dreiecksbudget für Web | neutral; passt zur Kraterlod- bzw. Leistungsarbeit | klein | – |
| blender-export-pipelines | Export-Voreinstellungen (Web: GLB, meshopt, Draco, WebP) mit Prüfung | hoch: GLB-Export für das Spiel | neutral | klein | meshopt-Fix für 5.2.0 enthalten |
| blender-rendering | Cycles, EEVEE, Batch-Render | mittel: Belege rendern | Belege nur über Proof-Stage bzw. Beleg-Presets | mittel | eigene Farbverwaltung (AgX, ACES) nicht für Belege |
| blender-lighting-lookdev | Studiolicht, HDRI, Drehteller | gering | kollidiert: Licht = ein Rig | groß | – |
| blender-stylized-npr | Toon, Cel, Outlines | gering | KFB-Tuschrand über eigene Module | groß | – |
| blender-environment-kits | Gelände, Streuung nach Hang und Höhe, modulare Kits, `kit_check.py` | mittel: `kit_check` für Kit-Maße | Streuen verboten außer über kfb_env | groß (Streuen) / klein (kit_check) | – |
| blender-video-editing | Sequencer, Kamera-Tracking | gering (Video ist WSV) | – | mittel | – |
| blender-simulation | Starrkörper, Stoff, Fluide, kopflos gebacken | mittel: Vorhänge, Zerstörung als Bake | VFX-Regeln (Ursache und Richtung) | mittel | – |
| blender-time-of-day | Himmel, Sonne, Nebel, Stimmung | gering | kollidiert: ein Licht-Rig | groß | – |
| blender-weather-fx | Regen, Schnee, nasse Flächen, Blitz | gering (Wetter läuft im Spiel) | – | groß | – |
| blender-addon-development | Blender-Erweiterungen bauen | gering | – | mittel | – |
| blender-pipeline-automation | Batch über viele Dateien, Formatwandlung | hoch: Massenprüfung bzw. -export (z. B. alle Kit-GLBs) | neutral | klein | – |
| blender-asset-qa | Prüf-Gate: z-fighting, schwebende Teile, Normalen, Nicht-Mannigfaltiges, Skalierung, UVs, Gewichte, Bodenhöhe; Prüfbilder | **sehr hoch**: mechanische Vorprüfung jedes Modells | Ergänzung vor kfb_env und Proof-Stage, kein Ersatz | klein | Profile game/render; Warnungen begründen |
| blender-workflow-recipes | ganze Abläufe mit QA-Gates (Prop, Figur, Aufräumen von KI-Assets) | mittel: Vorlage für Abläufe | Abläufe nur innerhalb des Kanons | mittel | – |

## Die nützlichsten Punkte für WSB
1. **blender-asset-qa** als mechanische Vorprüfung vor den Kanon-Gates: z-fighting, schwebende Teile, Normalen, Gewichte, Bodenhöhe (passt zu „Pop-ups sitzen, nicht sinken“).
2. **blender-animation:** Retarget und `loop_check.py` für vorhandene Clips auf Rig_Medium (Hänger und Sprünge in Schleifen finden).
3. **blender-character-rigging:** `rig_check.py` und Stressposen als Zusatz zum Pose-Gate (keine Arme im Körper).
4. **blender-game-optimization und blender-export-pipelines:** LODs, Budgets und geprüfter Web-GLB-Export.
5. **blender-core:** 5.x-API-Regeln und die Schleife „ausführen, ansehen, prüfen“ über MCP. Mit `pch` auf dem Rechner immer `--local`, sonst laufen die Aufrufe kostenpflichtig in der Cloud.

**Nicht nehmen** (Kanon-Konflikt): pbr-materials, texturing, lighting-lookdev, time-of-day, stylized-npr, Streuen aus environment-kits.
