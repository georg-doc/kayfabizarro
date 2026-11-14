# Für WSB (Mac mini) · Web-Kanon R2c: vier Katana-Clips für FB-Agent-Twin (Claude-Design-Hero-Shot) · 14.11. (Georg, V-1743, V-1766)

**Anlass:** Claude Design baut den Website-Hero-Shot „FB zerschneidet eine Deck-Seite in vier Karten“ mit `assets/private` @f10cbfc3 `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1e.glb` und dem Clip `KFB_Katana_chop_R1` (darin enthalten). Befund von Claude Design: beim tiefsten Punkt des Hiebs bleibt die Klingenspitze 36 cm über dem Boden; FB springt zwischen den Schnitten; ein Abschluss fehlt.

**Gewünscht (Claude Design, über Georg):**
1. ein tiefer Hieb oder Zug, bei dem die Klingenspitze den Boden erreicht;
2. ein waagerechter Hieb auf Hüfthöhe;
3. ein kurzer Sprint oder Dash mit gezogenem Katana;
4. eine Schlusspose: Klinge wegstecken oder abschütteln.

**Regeln:**
- Nur vorhandene Clips, unverändert übernommen (V-574, Bestand zuerst). Quellen: Stamm @0b211f2b `src/assets/actors/Rig_Medium_CombatMelee.glb` (+ MovementBasic/MovementAdvanced/General); `assets/private` @f10cbfc3 `motion_lib_r1/`, `50_BLENDER/WSB_HALTUNG_R1/clips_fb/KFB_Motion_*.v2.Rig_Medium.fb.glb`, `50_BLENDER/GEGNER_R1/_privat_kauf_asset/mixamo/`; KayKit Mystery Ninja (Quelle des Katanas `assets/private` `50_BLENDER/B50/ninja/_privat_kauf_asset/KFB_Ninja_red_katana.r1.glb`); kein eigenes Keyframing. Gibt es für einen Punkt keinen passenden Clip, ausdrücklich „fehlt“ melden statt bauen.
- Katana-Halterung, Griff und `KFB_Tip` wie in `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/waffen/KFB_Katana.r1d.glb` und der Spiel-Karte Stamm @0b211f2b `src/data/combat/k10/kfb_kit_ninja_katana.fb_r1.weapon.json`.
- Arme frei wie im Spiel (V-1733); FB-Kanon-Wache.

**Lieferung:** `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1f.glb` = r1e plus die Clips `FB_Katana_tief`, `FB_Katana_waagerecht`, `FB_Katana_dash`, `FB_Katana_wegstecken` (sonst nichts geändert); in RETURN je Clip Quelle (Bibliothek, Originalname), Länge, und für 1 und 2 die gemessene Höhe der Klingenspitze im tiefsten bzw. waagerechten Moment samt Zeitpunkt. Bildblatt: je Clip drei Momente von der Seite, Linie für den Boden.

**Rückgabe** wie r1e: Bundle, RETURN, Blatt in `replies/WEB_KANON_R2/MINI_r1f/`, Zweig `assets/wsb-fb-web-kanon-r1f` von `assets/private` @f10cbfc3. Danach Teil 4 (ML v2 R2) weiter; Dory r3 mit dem neuen Mundsatz-B-Ersatz (Stamm @0b211f2b, Georg q680) im selben Lauf wie Teil 4.
