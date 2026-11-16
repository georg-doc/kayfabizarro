# WSB → WS0 · Bestandsfrage: frühere Geschenk-, Debatten-, Fluff- und Tischszenen (16.11.2026, Kopie der Nachricht von 01:03)

Abgelegt am 17.11., weil die Nachricht über die Sitzungsbrücke womöglich nicht angekommen ist.

Georg erinnert sich richtig, nur stammt die Runde nicht aus KFB_HUB/50_BLENDER. Es ist der Auftrag #369 „Resident Performance + Character Choreography“ vom 07./08.10. Ausgeführt hat ihn Claude Cowork mit Blender MCP auf dem Mac mini, in Blender 5.2.2.

Fundort: Repo georg-doc/kayfabizarro, Zweig blender/resident-performance-choreography-2026-10-07 (Kopf abd6b117, 08.10.), Ordner skills/chat/workflows/KFB_RESIDENT_PERFORMANCE_CHOREOGRAPHY_369_2026-10-07/. In assets/private liegt nichts davon, Hub-Nummern gab es damals noch nicht. Die Abnahmen stehen jeweils im Addendum.

1. Bodenübergabe mit Auspacken (Szene 369_GROUND_HANDOVER, addendum_ground_handover_loot/)
   - Figuren: Orc Brute (Rig_Large) und Farmer B (Rig_Medium).
   - Ablauf:
     - Der Ork trägt ein rundes Knete-Geschenk und setzt es ab.
     - Die Farmerin kommt zu Fuß (Walking_A), schiebt den Deckel auf (ML-Clip opening_a_lid).
     - Die Box spuckt: Squash und Stretch, Knete-Klumpen fliegen heraus, die Beute materialisiert über der Box als Knete-Zwilling mit leuchtender Auflösekante.
     - Beide springen mit Dodge_Backward zurück.
   - Requisiten: Geschenk, Beute Karte oder Radio.
   - Abnahme: Georg 07.10., PASS WITH TUNE.
   - Bilder: Claude outputs/GROUND_HANDOVER_orc_to_farmer(_v2).jpg, GROUND_HANDOVER_loot_reveal_v3.jpg, LOOT_*, R7_/R8_*_sheet.jpg.
   - Skripte und Daten: kfb369_gift.py, kfb369_reveal_r8.py, ground_handover_r8_timeline_recipe.json.
   - GIFT_LINEUP.jpg zeigt Ork und Farmerin, hier mit Hut auf dem Kopf, neben 7 Geschenkboxen.
2. Geschenk-Erscheinen und Fluff-Zauber (addendum_appear_fluff_spell/)
   - Inhalt: eine gemeinsame „Ankunft“-Grammatik (kfb_appear.py) für Auspacken und Zauber; kfb369_gift_appear.py, kfb369_fluff_spell_r5.py.
   - Abnahme: Georg 07.10., als Basis angenommen (FIRST PASS).
   - Bilder: PREVIEWS/GIFT_APPEAR_CARD|RADIO_CAM1.jpg, FLUFF_SPELL_r5_*.jpg, SPELL_AUDITION_farmer.jpg; dazu in Claude outputs FLUFF_TRADE_r1_* (Fangen, Kneten) und FLUFF_FORM_r2_*.
3. Beat-Szenen E1–E4 (PREVIEWS/BEATS_*.jpg, data/beats_E*.json)
   - E1 Fluff teilen: Farmer B → Lorekeeper.
   - E2 Geschenk: Lorekeeper → Goth Girl.
   - E3 Handel abgelehnt: Orc Brute ↔ Farmer B.
   - E4 Reparieren und Wiederaufbau: Farmer B ↔ Orc Brute.
   - Dazu SHEET_AFFECT, SHEET_SOCIAL und SHEET_WORK je Farmer B (Medium) und Orc Brute (Large), außerdem der neue Clip kfb_perf_shrug_a an 4 Residents.
4. Debatten (addendum_debate/ r1, addendum_debate_r2/)
   - r2 ist eine Talk-Engine mit 12 Videos: polite_chat, heated_argument, dogged_vs_absent, speakers_corner, dazu die r2b-Ausgänge (geht weg, Patt, Zustimmung, Zwischenrufer, Ausbruch, verlassen).
   - Status: r2 FIRST PASS mit r2b auf Georgs Wunsch vom 08.10.
   - Daten: talk_pool.json, talk_rules.json, talk_runs/.
5. Tanz-Engine (addendum_dance/)
   - 19 Clips an beiden Rigs; Videos DANCE_A_disco_freestyle, B_line_unison_canon, C_dance_off.
   - Status: FIRST PASS vom 08.10., Georgs Durchsicht stand noch aus.
6. Brickfish-Wurf (addendum_brickfish/)
   - Videos BRICKFISH_A_hit_retaliation, B_long_miss.
   - Status: FIRST PASS vom 08.10., die Look-Entscheidung stand noch aus.

Tisch und Essen, Ork mit Brot: Dazu habe ich keine fertige Szene gefunden. Übrig ist nur das Skript Claude outputs/kfb_table_stool.py vom 08.10.:
- „rev 5, Georg 2026-10-08: chairs failed; use a stool without backrest“;
- KayKit Sit_Chair_Idle mit Hocker aus dem Dungeon Pack (Sitzhöhe 0,477), Large aus Medium übertragen;
- Sitz und Tisch werden je Bild auf Durchdringung geprüft.
- Es baut auf den Modulen kfb_forge, kfb_table_activity und kfb_table_activity_k2 auf. Die liegen weder in der Dropbox noch auf dem #369-Zweig, auch auf keinem anderen Zweig in kayfabizarro oder KFB-Stunt-Car-Race. Bilder dazu habe ich auch keine gefunden.
- Wahrscheinlich ist das nur in der damaligen Cowork-Sitzung bzw. in Blender-Arbeitsdateien geblieben. Das weiß Georg oder die Cowork-Sitzung.

Bei uns verwandt:
- KULTURTECHNIKEN_R1 Teil B: Technik „geschenke“ mit g1–g8 (Chest_Open = Auspacken, PickUp_Table, Interact, Holding, Box Idle …) samt Beleg BELEG_geschenke_teilB.jpg; d3–d5 sitzen auf dem Hocker aus B34 (KFB_Ship_Table_Stools.r1.glb, Oberkante 0,50 u). Für r1h ließe sich der Hocker also für d3/d4 nutzen.
- Im Spiel: src/npc/giftReveal.js (Trupp aus dem Geschenk, Present_Base → UnwrappedBase mit Pop); die Scenelets ra_lorekeeper_desk_01 (am Pult) und die Hexe mit Werktisch (RA).
- B3 Bäckerei-Diorama mit Brot (Tiny Treats), B32 „Mahlen am Tisch“.

Gesucht habe ich in 50_BLENDER/*, assets/private, game/integration-r2, ~/.kfb_tmp, ~/kfb_work, in der ganzen Dropbox nach Dateinamen und in allen Zweigen von kayfabizarro und KFB-Stunt-Car-Race.
