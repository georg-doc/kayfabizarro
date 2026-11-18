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
- **Abnahme-Bühne (Nachtrag, Georgs Ja zum Install):** `three.quarks` 0.17.1 per `npm install --no-save` in den Mac-mini-Worktree geholt; package.json und Lockfile sind unverändert. `tools/vfx-buehne` @a9432e0f gebaut und mit `packe.mjs` gepackt. Weil die Bühnenseite nicht im Repo liegt, hat sie eine schlichte lokale Hülle bekommen: `#buehne`, Leinwand, Meldung, leere Bedienelemente.
  - **Ablauf:** Je Clip `__kfbVfxBuehne.botClip(name)` an beiden Bots, Blick `abnahme({ figur: 'q_xbot', ansicht: 'figur', schwenk: -60 })`, Bilder bei 30 % und 70 % der Dauer. Skript `scripts/bibliothek_buehne_interaktion.mjs`, Daten `data/bibliothek_buehne_interaktion.r1.json`.
  - **Ergebnis:** Alle 34 Clips laden und spielen an X Bot und Y Bot. Status beider Darsteller „OK“, 0 Seitenfehler. Die Körper bleiben heil, Knie und Füße stehen beim Knien am Boden.
  - **Belege:** `belege/interaktion_r1/BOTS_interaktion_uebersicht.jpg` (9 Clips) und `BOTS_interaktion_blatt_1–4.jpg` (alle 34, je 2 Bilder).
  - **Erwartbar:** Klettern und Hängen laufen in der Luft, weil die Bühne weder Leiter noch Wand noch Kante hat. Schieben läuft aus dem Bild (Weg, siehe 2.). Die Kamera folgt dem Weg nicht.

## Hinweise für WS1
1. **Lücke 1, gerade gehen mit Kiste:** „Box Walk Arc“ hat keinen Bogen-Regler und kein In Place; der Clip läuft 1,45 m im Linksbogen und dreht 30°. Gerade gibt es nur „Jogging With Box“ (In Place, Regler Stride). Das „Farming Pack“ (25 Clips) erscheint bei den Suchen „Box Walk“, „Box Turn“ und „Push Stop“. Was darin liegt, zeigt Mixamo nicht an. Ich habe es nicht geladen; prüfen nur auf Wunsch.
2. **Mit Weg statt In Place** (Mixamo bietet hier kein In Place): Push_Heavy_B läuft 3,2 m vor, Push_Start 1,4 m, Carry_Box_Walk_Arc 1,45 m. Klettern und Hängen (Climb_Ledge_Pull_Up, Climb_Ladder_To_Top, Hang_Braced_To_Crouch) heben die Hüfte bis 1,6 m.
3. **Gedreht:** Push_Start/Push_Stop ±50°, Pull_Start/Pull_Stop ±84°, Climb_Onto_Box 40°, Climb_Down 110°, Crouch_To_Stand −30°. Beim Aneinanderhängen die Wurzel nachführen.
4. **Hängende Clips:** Climb_Wall_Down startet mit der Hüfte auf 2,28 m, Hang_Idle auf 1,22 m und Hang_Shimmy auf 1,59 m. Die Figur muss an die Kante gesetzt werden.
5. **Jump_Onto_Box:** Die Hüfte steigt bis 1,41 m und endet wieder auf Starthöhe, ohne Vorwärtsweg. Auf der Bühne steht der Bot am Ende wieder auf dem Boden. Damit er oben auf der Kiste steht, muss das Spiel die Wurzel um die Kistenhöhe anheben.
6. **„Climbing (Wandzyklus)“ aus Abschnitt 1** ist bei Mixamo „Ladder Climb Two Steps At A Time“, also eine Leiter, keine Wand. Die Bildzahl passt zu `kfb_climb_up_a` (90). Für die Wand gibt es Climb_Wall_Up/Down.

## Offen (für WS0)
- `three.quarks` ist auf dem Mac mini nachinstalliert (Georgs Ja, 18.11.). WSB kann die Abnahme-Bühne künftig selbst bauen.
- Löschliste: 34 ungetrackte Kopien im Private-Worktree des Mac mini, ein abgebrochener Bühnenbau (204 MB) und der neue Bühnenbau `~/.kfb_tmp/vfxbuehne_bots_r2` (204 MB). Eingetragen in `BLINDE_KRITIK_R1/LOESCHLISTE.md`.
