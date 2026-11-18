# KFB Bots · Interaktions-Clips R1 · RETURN (WSB, 18.11.2026 abends)

**Auftrag:** WS1 Q-193 (`bots/r1` @4d54f40d, `docs/bots/INTERAKTIONEN_SUCHAUFTRAG_R1.md`), von Georg im Chat an WSB gegeben („ws1 hat mixamo jobs für dich“).
**Stand:** Basis `assets/private` @f7e4f8f3 (enthält die Bot-Lieferung @d5fbcab2). Keine Spieldatei geändert.

## Geladen
34 Clips per Claude in Chrome aus Georgs Mixamo-Konto: Figur X Bot, FBX Without Skin, 30 fps, keine Keyframe-Reduktion, In Place wo Mixamo es anbietet. Die Regler blieben auf Mixamos Voreinstellung.
- **Karten und Kisten:** Lifting, Picking Up Object, Lifting Object, Putting Down, Box Idle, Box Walk Arc, Box Turn (rechts und links), Jogging With Box (In Place).
- **Schieben und Ziehen:** Push Start, Push (241 Bilder, „Pushing Heavy Object“), Push Stop, Pull Heavy Object Start / Schleife (In Place) / Stop, Pulling Lever, Closing A Lid.
- **Klettern:** Climbing (Onto A Box), Box Jump, Climbing (Pulling Up To A Ledge), Climbing To Top, Climbing Up Wall und Climbing Down Wall (beide In Place), Hanging Idle, Braced Hang, Braced Hang To Crouch, Braced Hang Shimmy rechts und links (In Place), Climbing Down, Kneeling Down, Standing, Crouch To Stand.
- **Dazu:** Climbing (Quelle von `kfb_climb_up_a`, 90 Bilder) und Kneeling Idle (129 Bilder, wie `kfb_idle_kneeling_a`).
- **Zählung:** WS1 nennt 33; mit beiden Shimmy-Richtungen sind es 34.

## Geliefert
- `bibliothek/KFB_Bot_<Name>.glb` (34 Dateien, 4,8 MB). Gleiche Form wie die 76 vorhandenen Clips: nur Animation, Skelett `mixamorig` ohne Objektdrehung, Maßstab 1, Wege in Metern. Benannt sprechend (Carry_Box_Idle, Push_Start, Climb_Onto_Box, Hang_Shimmy_L …). Die Namen stoßen mit keinem vorhandenen zusammen.
- `bibliothek/README.md`: neue Tabelle „Interaktion R1“ mit Datei, Zweck, Mixamo-Quelle, Dauer, Hüfthöhe am Start, Hüftweg und Drehung.
- **Skripte:** `scripts/bibliothek_namen_interaktion.json` (Quelle → Name), `scripts/bibliothek_pruefen.mjs` (three.js-Prüfung). Der Export lief mit dem vorhandenen `scripts/bibliothek_export.py`.
- **Daten:** `data/bibliothek_export_interaktion.r1.json`, `data/bibliothek_pruefung_interaktion.r1.json`.
- `BIBLIOTHEK_STAND_R1.md`: Nachtrag.

## Geprüft
- **three.js** (GLTFLoader gegen `KFB_q_ybot_facemount.r1c.glb`): Alle Spuren aller 34 Clips treffen Bot-Knochen (0 fremd). Die Hüfte steht in Metern (Stehen ≈ 1,0 m, Knien 0,53 m).
- **Richtig erwischt:** Bei gleichen Mixamo-Namen habe ich vor jedem Download die Beschreibung und die Bildzahl im Mixamo-Fenster geprüft. Die Bewegung selbst habe ich in Mixamos Vorschau an der Figur gesehen.
- **Abnahme-Bühne nicht gelaufen:** Der Bau von `tools/vfx-buehne` (@a9432e0f) bricht auf dem Mac mini ab, weil das Paket `three.quarks` fehlt (neu in package.json). Installieren wäre ein Download; den mache ich nicht ohne Georgs Ja. Die Bühnenbilder macht deshalb WS1, die Bühne liest die neuen Dateien ohne Code-Änderung.

## Hinweise für WS1
1. **Lücke 1, gerade gehen mit Kiste:** „Box Walk Arc“ hat keinen Bogen-Regler und kein In Place; der Clip läuft 1,45 m im Linksbogen und dreht 30°. Gerade gibt es nur „Jogging With Box“ (In Place, Regler Stride). Das „Farming Pack“ (25 Clips) erscheint bei den Suchen „Box Walk“, „Box Turn“ und „Push Stop“. Was darin liegt, zeigt Mixamo nicht an. Ich habe es nicht geladen; prüfen nur auf Wunsch.
2. **Mit Weg statt In Place** (Mixamo bietet hier kein In Place): Push_Heavy_B läuft 3,2 m vor, Push_Start 1,4 m, Carry_Box_Walk_Arc 1,45 m. Klettern und Hängen (Climb_Ledge_Pull_Up, Climb_Ladder_To_Top, Hang_Braced_To_Crouch) heben die Hüfte bis 1,6 m.
3. **Gedreht:** Push_Start/Push_Stop ±50°, Pull_Start/Pull_Stop ±84°, Climb_Onto_Box 40°, Climb_Down 110°, Crouch_To_Stand −30°. Beim Aneinanderhängen die Wurzel nachführen.
4. **Hängende Clips:** Climb_Wall_Down startet mit der Hüfte auf 2,28 m, Hang_Idle auf 1,22 m und Hang_Shimmy auf 1,59 m. Die Figur muss an die Kante gesetzt werden.
5. **Jump_Onto_Box:** Die Hüfte steigt bis 1,41 m und endet wieder auf Starthöhe, ohne Vorwärtsweg. Ob der Bot oben steht, zeigt erst die Bühne.
6. **„Climbing (Wandzyklus)“ aus Abschnitt 1** ist bei Mixamo „Ladder Climb Two Steps At A Time“, also eine Leiter, keine Wand. Die Bildzahl passt zu `kfb_climb_up_a` (90). Für die Wand gibt es Climb_Wall_Up/Down.

## Offen (für WS0)
- `three.quarks` fehlt im Mac-mini-Worktree. Damit WSB die Abnahme-Bühne bauen kann, braucht es ein `npm install` (Download, also Georgs Ja).
- Löschliste: 34 ungetrackte Kopien im Private-Worktree des Mac mini und ein abgebrochener Bühnenbau (204 MB), eingetragen in `BLINDE_KRITIK_R1/LOESCHLISTE.md`.
