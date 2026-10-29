# WS0 → WSB · K10 Runde 2: Gatling, Shotgun und Action-Figure-Gewehr sauber an FrizzleBob und die großen Figuren (V-1013) · R1 · 29.10.2026

**Tier 0**
1. **Erst das Modell, dann messen (V-648):** Für jede Waffe zuerst den Waffentyp nach `replies/WEAPON_GRIP_MODELS_R1.md` bestimmen. Dann die Ziel-Lage in einem Satz beschreiben, wie ein Mensch sie hält. Erst danach messen. Die Messung bestätigt nur.
2. **Kit-Waffen as-is (V-574, V-581, V-582):**
   - Original-Netz unverändert.
   - Je Waffe eine feste, gemessene Halterungsdrehung (`slotOffset.rotation`, mit Beleg).
   - Echte 2H-Waffen (Shotgun, Gewehre) nach den drei Clip-Familien. Ausnahmen mit eigener Entscheidung: Gatling seitlich getragen (V-1014), Action-Figure-Gewehr 1H (V-592).
   - Nur vorhandene Clips, keine neuen Keyframes (V-956).
3. **Abgabe über die eine Prüfbühne:** Knete (`kfb_clay_bpy`), ein Licht-Rig (`CANON_3D/lib/kfb_light_bpy.py`), KFB-Augen sichtbar, 0 Durchstich. Georg sieht nur Bestandenes.

**Warum:** Georg 29.10.: Die Gatling für FB und andere Figuren sowie weitere Schusswaffen wie die Shotgun sollen sauber angepasst werden. Grundlage ist das KFB Arsenal von WS1.
- Stand K10 (`50_BLENDER/K10/RETURN.md`):
  - Die Gatling ist nur am Mech eingepasst (§4, seitlich am Tragegriff).
  - Das Action-Figure-Gewehr ist entschieden: 1H an der Hüfte (V-592), bisher an der Figur aus K10 §6. An FrizzleBob fehlt es noch.
  - Die Shotgun und die übrigen Gewehre sind offen.
- Im Arsenal fehlt dem Profil „Scrap Cannon“ (Streuschuss) bisher ein Modell. Die Shotgun füllt es.

**Einstieg (lesen):**
- `50_BLENDER/K10/RETURN.md`: §1 Inventur, §4 Gatling mit `data/combatmech_minigun_mounts.json` und `_privat_kauf_asset/kfb_kit_combatmech_minigun.weapon.json`.
- KFB Arsenal R1: kayfabizarro-Branch `ws1/status`, `docs/WAFFEN_ZUORDNUNG_R1.md` (Rolle, Energie, Profil je Karte).
- FrizzleBob: nur FB_CANON (`50_BLENDER/FB/R5/R8/FB_R8_probe_A11.glb`), mit Jetpack auf dem Rücken.
  - Jetpack-Vertrag: `src/private/50_BLENDER/JETPACK/data/v910_jetpack.contract.r1.json` im Spiel-Repo, Sitz `seat_per_figure`.
  - Der Jetpack wird kleiner (Faktor 0,75 um den Rücken-Kontaktpunkt, V-1012). Prüfe beide Größen.
- Register (Branch docs/kfb-decisions-register-2026-10-11): V-574, V-581, V-582, V-592, V-648, V-866, V-956, V-965, V-970, V-990, V-1012, V-1013, V-1014.

**Auftrag (in dieser Reihenfolge):**
1. **Gatling an FrizzleBob:**
   - Modell `_privat_kauf_asset/KFB_CombatMech_Minigun.k10.glb`, seitlich getragen wie am Mech.
   - V-990 (29.10.) im Wortlaut: „Gatling für FB: kein neuer Blender-Job nötig. Vorhanden aus K10 (WSB): KFB_CombatMech_Minigun.k10.glb …, weapon.json mit Mount handslot.r und Anker-Beleg … Haltung/Flug nur mit vorhandenen Clips (Ranged_2H_Aiming als Oberkörper-Schicht + Jump_Idle, locoStates; V-956) … nur wenn der Griff an FBs Hand nicht passt, kleiner WSB-Einpass-Job nach V-581/V-582.“
   - Die Clip-Zeile aus diesem Zitat (Ranged_2H_Aiming als Oberkörper-Schicht) gilt für die Gatling nicht. Es gilt V-1014 bzw. K10 §4: Oberkörper ruhig in der Trage-Pose Running_HoldingRifle @ 0,25 s, Beine aus dem KayKit-Clip (`scripts/k10_layer_clips.py --freeze`). Ausgeschlossen sind Ranged_2H_*, flight_aim und flight_brake_recover. Beim Feuern dreht der Host die Figur um −36°.
   - Für die Gatling gilt damit die K10-§4-Haltung, die Georg am 21.10. gewählt hat (V-1014): rechte Hand am Tragegriff (`handslot.r`), seitlich getragen. Sie ersetzt für diese Waffe die Stützhand-Zeile aus V-581/V-582. Die linke Stützhand ist in K10 §4 geprüft und verworfen (`mech_aim_fit.json`).
   - Dieser Auftrag ist genau der Einpass-Fall aus V-990: Prüfe, ob der Griff an FrizzleBobs Hand passt. Nur bei sichtbarem Durchstich korrigieren, mit Beleg.
   - **Boden:** die Boden-Clips aus §4 (Idle, Laufen, Strafe L/R, Dodge, Hit A/B) mit der Trage-Pose oben.
   - **Flug:** so, wie FrizzleBob im Spiel fliegt (Jetpack-Flug, V-965, V-970). Körper-Clip aus `src/m1/locoStates.js` (Jump_Idle; Unterzustände hover, forward, boost, turn), oben die Trage-Pose. Die Flug-Familie aus §4 (KFB_FLIGHT_FAMILY_01) gilt nur für den Mech, nicht für FrizzleBob.
   - Pflicht: kein Durchstich mit Jetpack, Ohren und Bauch.
   - **Große Figur Brawl Brute** (Figurenkarte `50_BLENDER/B51/data/brawl_brute.figure.json`, im Jetpack-Vertrag `kfb_brawl_brute`, Rig_Large): Rig_Large hat keine Trage-, Strafe- oder Ranged-Clips, und die Flug-Familie gibt es nur für RigMedium. Deshalb hier **nur ein Befund, keine Einpassung**: Liste der vorhandenen Rig_Large-Clips, die eine Seitenhaltung tragen könnten, plus ein Probebild, ob die Gatling in einer davon ohne Durchstich sitzt. Ob ein Medium-Clip auf Rig_Large übertragen werden darf, entscheiden WS0 und Georg danach.
2. **Shotgun des Survivalist** (KayKit Mystery Series 6, Paket „9 - March 2024 - Survivalist“, `assets/gltf/shotgun.gltf`, Kauf, privat; die Tabelle in K10 §1 nannte fälschlich S4):
   - 2H nach V-582.
   - Die Original-Haltung des Survivalist aus dem Kit (Artwork bzw. `SOURCE/Survivalist_Source.blend`) dient nur als Referenzbild für den Satz „so hält man sie“. Der Survivalist hat noch keine Figurenkarte; Prüfbühne nur an FrizzleBob.
   - Karte mit `KFB_Muzzle` für das Arsenal-Profil Scrap Cannon.
3. **Action-Figure-Gewehr 1H an der Hüfte** an FrizzleBob, genau nach V-592: Kit-Drehung +90° Y, Versatz [0,1, 0, 0,02], Ranged_1H_Aiming/Shoot/Shooting, ausgeschlossen Ranged_1H_Reload und Ranged_2H_*. Den Versatz unverändert übernehmen; nur bei sichtbarem Durchstich an FrizzleBob korrigieren, mit Beleg (V-574, V-581).
4. **Nach Zeit**, nach demselben Muster:
   - SpaceRanger_Rifle (KayKit Mystery S4, Kauf, privat, nur in `_privat_kauf_asset/`);
   - Gun_Rifle und Gun_Sniper (Prototype Bits, CC0).

**Je Waffe zurück** (Spec `WEAPON_GRIP_MODELS_R1.md` §Abgabe je Waffe):
- Vor der Messung ein Satz „so hält man sie“.
- Danach ein Nahbild von Faust und Griff, bei 2H beide Hände inklusive Stützhand. Erst dann die Clips.
- Karte `*.weapon.json` (WSA-Format, Familien V-582) und Anker-Beleg.
- Halterung als Daten.
- Prüfbilder je Clip-Familie mit Knete.
- Liste der ausgeschlossenen Clips mit Grund.
- Private Dateien nur in `_privat_kauf_asset/` bzw. im privaten Branch, nie öffentlich.

**Danach (nicht Teil dieses Auftrags):** WSA stimmt das Gefühl in der Arena ab. Den Einbau ins Spiel macht WS0 nach Sonntag (Waffenwahl über die Aktionsleiste, V-866).

**Rückgabe:** `50_BLENDER/K10/RETURN.md` fortschreiben (neuer Abschnitt „Runde 2“), Bilder in `out/`, ein Blatt mit allen neuen Haltungen für Georg.
