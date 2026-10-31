# Start WS-Weltwissen · Karten als Wissen und Gespräch mit dem Spieler · WS0 · 31.10.2026 (V-1075)
Empfänger: neue Claude-Code-Sitzung für den Spielkern. Du entscheidest Details selbst; Rückgabe an WS0, nicht an Georg.

**Du fängst nicht bei null an.** Georg hat beide Entwürfe freigegeben (Hub q313, q317). Sie sind deine Vorgabe, lies sie zuerst. Karten und Weltwissen sind das Hauptziel des Spiels (V-1049).

## Lesen, bevor du baust (`~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies/`)
- `WELTWISSEN_MODELL_R1.md` und `GESPRAECH_SPIELER_R1.md`: die beiden Vorgaben.
- `TRIPLET_SSOT_R1.md` §2, §2b, §4: Zeilen, Satzbild, Rufe. Das Spiel erzeugt keinen Text. Kein inhaltliches Matching.
- `GAME_LOOP_R1.md`. Register V-1066, V-1067, V-1070, V-602, V-699, V-712, V-1039, V-1049. V-1039 gilt, nur Primär bleibt im Gespräch erreichbar (V-1067).
- Spiel-Code auf `origin/game/integration-r2`: `src/npc/npcMemory.js`, `src/world/worldSave.js`, `src/npc/tratschSim.js`, `src/npc/residentLife.js`, `src/dialog/ssotLines.js`, `src/BubbleHost.jsx`, `src/hud/cardFlight.js`, `src/Dialog.jsx` (die großen Antwortflächen, die ersetzt werden), `docs/ws-npc/KARTEN_TRATSCH_KONZEPT_R1.md` §3, §5, §8.
- HUD v6 von WS1: Branch `comms/ws0-ws1`, `assets/hud_v6/KFB_HUD_v5_WS0/`, darin Zustand `mode=talk`, `states/08_gespraech.png`, `rueckgabe/NACHRICHT_WS0_sprechblasen.md`, Kritik `assets/hud_v6/HUD_V5_KRITIK_R1.md` §5. Sprechblasen nur aus dem Spiel-Code `BubbleHost.jsx`, nicht neu entwerfen (V-887, V-992).

## Auftrag: der erste Beweis, nichts darüber hinaus
Eine Szene in der Welt mit einem Ort, drei Figuren und einer freigespielten Karte:
1. **Weltwissen:** Jede Figur führt ihre Kartenliste im vorhandenen Lean Memory (Spielstand `kfb.world-save`, das Schema gehört WS1 bzw. WS0; Änderung als Vorschlag melden). Kein Besitzer und keine Lage einer Karte wird verfolgt; Geländekarten liegen ohnehin an festen Plätzen (q241), daher kommt die Richtung beim Ortstipp.
2. **Zeuge:** Wird die Karte freigespielt, bekommen Figuren in Sichtweite den Eintrag „gesehen“, derselbe Mechanismus wie `onCured`. In der nächsten Begegnung erzählen sie weiter, mit Quelle, als Triplet. Rufe zeigen nur die Haltung und entscheiden nicht, ob eine Karte wandert.
3. **Gespräch mit dem Spieler:** in der Welt, kein eigener Bildschirm. Ansprechen, Gesprächs-Stellung und Blicke nach V-780 (±40°, keine neue Kamera), Zuschauer werfen ein, zwei bis vier Antwort-Blasen an deiner Figur, Karten-Vorschau in der Blase klickbar, das Gespräch wartet.
4. **Auftrag und Ortstipp:** Figur bittet um eine fehlende Karte ihres Decks, Zuschauer mit eigenem Eintrag zeigt die Richtung, „Merken“ setzt den Zielhinweis. Clip `kfb_gesture_pointing_a` ansehen, Geste nur mit freier Hand (V-729), passt er nicht, melde die Lücke an WSB.
5. **Karte spielen:** Almanach als Hand, Karte fliegt in die Blase (vorhandener Kartenflug), Figur antwortet aus ihrer Liste und tauscht eine Karte.
6. **Schießen statt antworten:** Waffe bleibt erreichbar, beendet das Gespräch, vorhandene Warnen-Drohen-KO-Logik, Zuschauer werden Zeugen.

**Prüfung:** Zwei Läufe mit verschiedenen Karten zeigen dieselbe Figur sichtbar verschieden. Ein Lauf endet mit Schießen.

## Grenzen
- **Arbeitsort:** privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zugriff `GIT_SSH_COMMAND="ssh -i ~/.ssh/kfb_private_assets_deploy -o IdentitiesOnly=yes"`. Worktree `~/kfb-ws0/wissen-wt`, Branch `game/weltwissen-r1` von `origin/game/integration-r2` @58da229. Hinter Schalter `wissen=r1`, ohne Schalter bitgenau wie bisher. Kein HUD-Umbau: WS1 baut HUD v6 auf `game/integration-r2`, du fügst nur den Gesprächs-Zustand hinzu und holst dir regelmäßig den neuesten Stand. Absprache über WS0.
- Zusammenführen: Nach Georgs KEEP holst du den neuesten Stand von `game/integration-r2`, lässt die feste Testliste laufen (`terrain-seams`, `hud-3d`, `fb-canon`) und pushst hinter deinem Schalter selbst dorthin. Kein Warten auf einen Termin.
- **Modelle und Clips:** nur WSB (V-1065), Lücken melden.
- **Text:** nur aus Kartendaten und abgenommenen Triplet-Sets, Rückfall nach Konzept §3.1. Sätze im Spiel auf Englisch, Anrede neutral.
- **Festplatte:** rund 20 GB frei. Kein voller Fetch, kein Klon, `node_modules` per Link, Testausgaben löschen, unter 8 GB frei anhalten und WS0 melden. Nie nach `~/KFB_GitHub_sync` holen.
- Keine Quest-Maschine, keine Themen-Tags, kein Moralwert. Gesichter im Bild selbst prüfen (V-1046).

## Rückgabe an WS0 (Name in `ListAgents`: „KFB Open World Visual Terrain Recovery Lab“)
Zuerst nach Punkt 1 und 2 eine kurze Meldung mit den Protokollen beider Läufe. Am Ende Spielaufnahmen mit Spiel-Look, Branch und Commit, Testliste, ehrlich, was nicht geprüft ist. WS0 legt es Georg im Hub vor.
