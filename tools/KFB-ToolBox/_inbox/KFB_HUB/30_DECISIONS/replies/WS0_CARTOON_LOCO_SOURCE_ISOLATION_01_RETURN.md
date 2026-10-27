# WS0 · Gate WS0_CARTOON_LOCO_SOURCE_ISOLATION_01 · RETURN (V-889) · 27.10.2026

**Umgebung:** Blender 5.2.2 LTS (Kommandozeile, kein zweiter MCP), macOS 27.0.1, Apple M1 Max. Quellen = genau die Dateien, die das Spiel lädt: `src/assets/actors/FB_TEMPLATE_LOOK_v5b.glb` (Darsteller) und `Rig_Medium_MovementBasic.glb` (Clips), game/proc-world-ws0.

**Rig (aus Blender gelesen, nicht geraten):**
- Clip-Rig `Rig_Medium`, 23 Knochen: root, hips, spine, chest, head, upperleg/lowerleg/foot/toes .l/.r, upperarm/lowerarm/wrist/hand/handslot .l/.r.
- FB-Rig `Rig`, 47 Knochen = dieselben 23 plus ear.l/r.1–3 und IK-Steuerknochen (IK-foot, kneeIK, heelIK, handIK, foot-/toe-/heel-roll). Clips greifen über die Namen; Ohren laufen über ear-dangle, nicht über Clips.
- Spiel nutzt: Walking_B, Running_A, Running_B, Idle_A, Jump_Start/Idle/Land, Jump_Full_Short/Long (m1-gait, m1-locoActor).

**Messung (pose_motion_audit.py aus PR #456 unverändert; Hüfte = hips, Füße = foot.l/foot.r; Modell-Einheiten, 30 Bilder/s):**
| Clip | Dauer | Hüft-Wippen | Schritt | Fußhub | Fußweg je Bild im Stand |
|---|---|---|---|---|---|
| Walking_B | 0,87 s | 0,054 | 0,45 | 0,18 | 8–80 mm (ungleichmäßig → Rutschen) |
| Running_A | 0,67 s | 0,101 | 0,73 | 0,28 | 124–144 mm |
| Running_B | 0,67 s | 0,139 | 0,68 | 0,21–0,23 | 151–220 mm (ungleichmäßig) |
| Jump_Start / Full_Short / Land | 0,5 / 0,93 / 0,53 s | 0,23–0,26 | – | – | Stand ruhig (≤ 0,5 mm) |

**Befund (Kontaktbogen `75_REFS/cartoon_loco_r1/loco_source_sheet.jpg`, Seite + vorn, je 8 Bilder):** Gehen fast ohne Wippen und ohne Gewicht; die Stand-Füße laufen im Takt ungleich (sichtbares Rutschen bei Walking_B und Running_B); Sprünge ohne Ausholen-Quetschen und ohne Streckung im Absprung, Arme seitlich steif. Das ist die Lücke zum Mario-64-Gefühl: Wippen, Gewicht, Ausholen, Quetschen/Strecken, Nachschwingen.

**Werkzeuge (KEEP / HOLD / REJECT):**
- KEEP (eingebaut in Blender 5.2, geprüft vorhanden): Pose Library (Asset-Posen, aktiv), Breakdowner/Push/Relax/Blend to Neighbor, Graph Editor mit Euler-Filter, Smooth, Butterworth, Motion Paths, NLA-Bake, Rigify (nicht aktiv, für FB nicht nötig: FB hat eigene IK-Knochen).
- HOLD (nicht installiert, erst bei Bedarf mit Version/Lizenz prüfen): AnimAide, Onion-Skin-Add-on, Snow/Rain, CloudRig, Cascadeur.
- REJECT für diesen Schritt: MotionBricks (bleibt HOLD laut Paket), neue MCP-Server.

**Nächstes Gate (eins):** CARTOON_LOCO_KEYPOSES_01: Schlüsselposen als Standbilder auf FB v5b (Gehen: Kontakt/Tief/Durchgang/Hoch; Hochsprung: Ausholen-Quetschen/Absprung-Strecken/Scheitel/Landung-Quetschen; Start/Stopp/Wende je 2 Posen), Original daneben, gleiche Kamera, ein Licht-Rig, Knete. Georg nimmt die Posen ab (visual first), erst dann Animation. Spielseite: Weltlage/Kollision bleiben beim Bewegungs-Besitzer, Animation liefert nur Pose und Timing.
