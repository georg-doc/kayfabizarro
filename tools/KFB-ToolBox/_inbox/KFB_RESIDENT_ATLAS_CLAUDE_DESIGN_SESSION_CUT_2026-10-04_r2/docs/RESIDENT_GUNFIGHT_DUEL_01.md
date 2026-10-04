# RESIDENT-GUNFIGHT-DUEL-01 · Fernkampf-Duell · S17

**Stand:** 2026-10-04 · candidate-only · `KFB_Resident_Atlas_S17.html#__duel`
**Dateien:** `lib/gunfight-duel-01.js` · `data/gunfight-duel-01.json` · S17 = Kopie von S16, nur die Szene `__duel` ist neu.

## Was es ist
Zwei Rig_Medium-KayKit-Figuren auf einem neutralen Testgelände. Choreografie aus Beats (wer schießt, was passiert: Fehlschuss / Ausweichen / Treffer / K.o.). Vier Skripte plus eigenes Skript im Panel. Steuerung ist der Folgeschritt.

## Georg · 2026-10-04
- Sieht gut aus. Grundlage für den Combat Slice, inklusive Treffer-Effekte.
- Blasterhaltung stimmt noch nicht → Blender (`docs/RESIDENT_GUNFIGHT_DUEL_01/BLENDER_MCP_BRIEF.md`, B1).
- **D4 aufgelöst:** keine globale Ringgröße. Das Duell ist ein Demo-Rahmen, der je Szene angepasst wird. Der Atlas liefert eine **Stage-Instanz** (Ring-Modul mit Größe nach Besetzung, Seile als Gummibänder), die Szene besetzt sie. Plan: `docs/HANDOVER_GUNFIGHT_DUEL_01.md` §D, Next Gate WSA-STAGE-01.

## Quellen
- Schuss: `kfb_action_shooting_gun_a` (Motion Library, `libs/Rig_Medium/KFB_Motion_action_i04.glb`, georg-doc-patch-3). Bindet 69/69 am Hero Man.
- Stand, Treffer, Tod, Ausweichen, Wurf, Gewehr-Oberkörper: KayKit Character Animations 1.1 (natives Rig). Mixamo-Clips aus der Motion Library dienen nur als Rückfall.
- Waffen-Zahlen: Arena `kfb-combat-def.js` (Kayfabeam → Blaster, Bamboo Rail → Gewehr, Stinger → Minigun, Würfelwurf). Maßstab = Figurhöhe / 2,6 u.
- Treffer: Knet-Puff, Squash und Zeitmodell aus Fight Sandbox 02.

## Gemessen (Hero rot gegen blau, Duell · fünf Schüsse)
- Schussbilder im Clip über den Ruck der Hand: Bild 40 und 61. **Bild 61 ist verworfen**, weil der Arm dort 101° zur Seite zeigt. Haltepose = das früheste Bild, in dem der Arm schon auf der Schusslinie liegt (≤ 8°).
- Blaster: Lauf +Z → Slot +X, Roll 75°, Griffkorrektur 23,3° (Lauf waagerecht entlang Schulter → Hand).
- Lauf gegen Geschossbahn: höchstens 3,2° bei allen 5 Schüssen (vorher 26–53°). Minigun/Gewehr: 2,8°.
- KayKit `Dodge_Left` weicht 0,69 m aus, nachgeholfen werden 0,04 m.
- Kette: 5 Schüsse = 1 Fehlschuss + 2 ausgewichen + 2 Treffer · 2 Puffs = 2 Reaktionen.
- Schutzzone fürs Gesicht (Arena C9): Bei den Chibi-Proportionen liegt die Brust in der Zone. Puffs werden aus dem Gesicht geschoben, nicht weggelassen (2× bzw. 4×).

## Offen
- Gewehr: Kein Schuss-Clip vorhanden, die linke Hand liegt ohne IK nicht am Gewehr. Rückstoß ist prozedural.
- Kein KayKit-Pistolenmodell gefunden (Suche begrenzt). Der Blaster trägt die Pistolenhaltung.
- Würfel prozedural. Das Augen-GLB der Arena ist nicht eingebunden.
- Eye-Rig im Duell nicht gesetzt.
- Bei der Minigun trägt nur die letzte Kugel das Ergebnis, die anderen laufen ein. Die Fehlschüsse des Feuerstoßes werden bei der Laufprüfung nicht gewertet.
- fps auf dem M1 nicht gemessen.
