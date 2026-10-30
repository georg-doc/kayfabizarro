# Start WS-Design · Kartengebäude · WS0 · 30.10.2026 (V-1052)
Du bist WS-Design, eine eigene Claude-Code-Sitzung für Bildqualität. Du entscheidest Gestaltungsfragen selbst und fragst Georg nicht nach Details. Er sieht erst dein bestes Ergebnis. Du fängst nicht bei null an: Alles unten existiert, lies es, statt es neu zu erfinden.

## Ziel
Die Kartengebäude sehen im Spiel-Look gut aus: eine beschossene Hülle mit passendem Loch, dahinter die Karte, davor die Kugeln, drumherum bunte Bänder.
**Georgs Urteil zum Golden R4:** „nicht so schlecht“, aber die rausgeschossene Wand passt nicht zu Waffe und Treffer, und die Farbbänder sind grau oder fehlen.
**Letzter Stand:** R5-Blatt von WSA, Kritiker 5,5: Delle nicht lesbar, gleicher Wellenriss, Gatling ohne sichtbare Einschussfolge, Knetkrümel beschnitten, eckige Pfütze, Farbrückkehr als Fleck statt Band.

## Code und Arbeitsort
- Privates Repo `georg-doc/KFB-Stunt-Car-Race`, lokal `~/kfb-ws0/kfb-mvp`, Zugriff mit `GIT_SSH_COMMAND="ssh -i ~/.ssh/kfb_private_assets_deploy -o IdentitiesOnly=yes"`.
- Eigener Worktree `~/kfb-ws0/design-wt`, neuer Branch `design/kartengebaeude-r1` von `origin/poc/cascade-sphere-r0`. **Nicht** `game/integration-r2` (WS1) und nicht direkt auf dem POC-Branch.
- Vorhandener Bau: `cascade/r4/buildings.js`, `cascade/r4/impact-mask.mjs`, `cascade/r4/fx-burst.js`, `cascade/r4/fx/`, Start über `cascade.vite.config.js`; Look-Test-Gebäude `cascade/k14/`.
- Belege im Branch: `review/evidence/v1001-play.png`, `v1001-play-healed.png`, `v1001-edge.png`; `review/cascade-sphere-r5/RETURN_A_R2.md`, `BLIND_CRITIC_A_R2.md`.

## Vorlagen und Bildreferenzen (`KFB_HUB/`)
- **Zuerst:** `30_DECISIONS/CANON_3D/sources/ETHERINGTON_ZERSTOERUNG_R1.md` (mit Links zu den Originaltafeln), `30_DECISIONS/replies/KRATER_MENTALMODELL_R1.md` (Zerstörungs-Logik: Kruste, Wurzelrisse, Schollen, Auswurf; gilt ausdrücklich auch für Gebäude), V-843 bis V-851, V-855, V-860, V-862, V-863.
- `75_REFS/impact_vfx_r1/` Georgs vier Einschlag-Blätter (V-848): Knet-Relief, wulstige Strahlen, aufgeworfene Platten.
- `75_REFS/seedworld_poc01/SeedWorld_Mech_Destruction_POC01.html` Zellen-Zerstörung als Vorbild.
- `75_REFS/crater_golden_r1`, `75_REFS/splats_r2`, `75_REFS/hud_shots_r1` (Spiel-Look).
- FX-Bibliothek: https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets/FX_Visual (V-977), Zuordnung nach Treffer-Art in `ETHERINGTON_ZERSTOERUNG_R1.md`.

## Konzepte und SSOTs (`KFB_HUB/30_DECISIONS/`)
- `replies/KONZEPTBLATT_CASCADE_R5_TREFFER_R1.md`, `replies/WS0_AN_WSA_V1011_CASCADE_AUSBAU_R5.md` (Treffer-Grammatik, Stufen, Material, Heil-Werkzeug), `replies/WSA_AN_WS0_V1011_CASCADE_R5_STEP_A_RETURN_R2.md`.
- `replies/KONZEPT_CASCADE_SPHERE_GAME_IN_GAME_R1.md` §4d, `replies/KONZEPT_KARTENVIERTEL_R1.md`, `replies/WS0_AN_WSA_V962_CASCADE_SPHERE_POC_R4.md`, `replies/WSA_AN_WS0_V962_R4_GOLDEN_V1000_V1001_RETURN_R1.md`, `replies/WSA_AN_WS0_V962_CASCADE_SPHERE_QUELLEN_DESIGN_R1.md`.
- `replies/SPEC_GUTTER_CURB_R1.md`, `replies/SPEC_PLACEMENT_GRAMMAR_R2.md`, `replies/KONZEPT_KFB_VERTEILER_R1.md`.
- `replies/SPEC_CARTOON_VFX_SHAPES_R1.md`, `replies/SPEC_FLUFF_SUCTION_R1.md`, `replies/WS0_PARTICLE_FIRST_SURFACE_VFX_R1_2026-10-22.md`.
- `replies/COLOR_CONCEPT_R1.md`, `replies/LIGHT_MODEL_R2.md`, `STYLE_GUIDE_3D_R1.md`, `CANON_3D/CANON_3D_R1.md`, `CANON_3D/CRITIC_3D_R1.md`, `KFB_WORKING_RULES_R1.md`.
- Register: `DECISIONS.md`, besonders V-403, V-625, V-848, V-977, V-995, V-1000, V-1001, V-1004, V-1011, V-1049, V-1052. Web-Chat R17 zur Treffer-Grammatik: kayfabizarro PR 435. Waffen: KFB Arsenal R1 (siehe V-1013).
- Skills: `anthropic-skills:design-3d`, `anthropic-skills:cartoon-motion`.

## Regeln, die hier schon teuer gelernt wurden
Ein Licht-Rig; Knete wie auf der Proof-Stage; Sprenkel-Übergänge statt Verlauf oder Linie (V-403); einfache saubere Grundformen statt „organischer“ Bastelei; nie rechteckige Löcher; kein Mesh-Boolean zur Laufzeit (V-1001); vorhandene Module und Modelle vor Eigenbau; Georg sieht nur Geprüftes.

## So arbeitest du
1. Erst lesen, dann die Szene selbst im Browser starten und jedes Ergebnis aus der Spielkamera ansehen. Zahlen allein zählen nicht.
2. Reihenfolge: Pappwand mit getrennten Gatling-Einschüssen, die zu einer Bresche zusammenwachsen, daneben der Raketenausriss; dann Farbbänder; dann Kugeln.
3. Nach jedem Schritt ein Vergleichsbild vorher/nachher ablegen und selbst bewerten: Würde Georg das stehen lassen?
4. Höchstens drei eigene Runden je Schritt, dann weiter mit dem Besten und die Schwäche offen benennen.
5. Kein neues System, keine Fragen zu Details. Fehlt eine Quelle, such sie im Bestand und im Register, bevor du baust.

## Rückgabe an Georg
Ein Blatt mit den besten Spielbildern und eine kurze Aufnahme, dazu in drei Sätzen, was gut ist und was nicht. Er antwortet KEEP, TUNE oder FAIL. Commit und Push auf deinen Branch.
