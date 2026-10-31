# Start WS-Himmel · Himmel, Planeten, Wolken, Stimmung · WS0 · 31.10.2026 (V-1075)
Empfänger: neue Claude-Code-Sitzung für die prozedurale Welt. Du entscheidest Gestaltungsdetails selbst und fragst Georg nicht danach; Rückgabe an WS0, nicht an Georg.

**Du fängst nicht bei null an.** Im Spiel gibt es schon Uhr, Wetter (klar, Wolken, Regen, Nebel, Wind, auto), Stimmungen über das eine Licht-Rig und eine Kuppel mit Sonne, Knet-Riesenmond, Sternen, Polarlicht und gemalten Wolken. Das baust du aus, du ersetzt es nicht.

## Ziel (V-759, V-1007, Slice S2 aus V-746)
Die Fahrt durch die endlose Welt wird mit wechselndem Himmel zum surrealen Roadtrip. Wechselt das Biom, wechselt der Himmel mit: Farbe, Wolken, Himmelskörper, Stimmung.

## Lesen, bevor du baust (`~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/`)
- `replies/KONZEPT_KFB_VERTEILER_R1.md`: Zeilen Himmel Wolken, Himmel Verlauf, Planeten, dazu die Reihenfolge. Du nutzt den einen Verteiler, keinen zweiten Zufall.
- Register V-759, V-1007, V-575 (Kanon-Gebiet 18 Himmel, Horizont, Ferne), V-800 (Paletten je Biom), V-385, V-386, V-957 (ein Licht-Rig, Figur wird vom selben Himmel beleuchtet).
- `CANON_3D/CANON_3D_R1.md`, Gebiet 18, und `replies/LIGHT_MODEL_R2.md`, `replies/COLOR_CONCEPT_R1.md`.
- Code: `src/modules/sky-drive.js` (`cloudLayer`, `uHorizon`, `uZenith`, `skyColor`, `uMoon`), `src/Planets.jsx` (ansehen, was davon taugt).

## Auftrag
1. **Atmosphären-Dirigent je Biom und Saat:** Daten statt Sonderfälle. Tageszeit, Wetter und Stimmung folgen dem einen Licht-Rig, kein zweites Licht.
2. **Verlauf aus der Palette:** Horizont und Zenit als Nachbarschaft zur Bandpalette des Bioms (`skypal=biome`, Himmel = Laub +90°), mit weichem Übergang beim Biomwechsel.
3. **Wolken prozedural:** Formen, Dichte, Schichten, Schattenseite aus der Palette gefärbt.
4. **Himmelskörper:** mehrere, mit Mindestwinkel verteilt, Größe und Farbe variiert: Knet-Riesenmond, Ringplanet, lila Planet, selten die Erde (V-1007, nicht Quaternius). Erst im Spiel-Bestand suchen.
5. **Budget:** Der Himmel darf die Bildrate kaum kosten. Vorher und nachher im selben Lauf vergleichen, nicht absolut, solange andere Sitzungen rendern.

## Grenzen
- **Arbeitsort:** privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zugriff `GIT_SSH_COMMAND="ssh -i ~/.ssh/kfb_private_assets_deploy -o IdentitiesOnly=yes"`. Worktree `~/kfb-ws0/sky-wt`, Branch `world/himmel-r1` von `origin/game/integration-r2` @58da229. Nicht auf `game/integration-r2` pushen; WS0 führt zusammen. Alles hinter einem Schalter (`sky=r1`), ohne Schalter läuft das Spiel bitgenau wie bisher.
- **Modelle:** Neue oder geänderte Modelle macht nur WSB in Blender (V-1065). Fehlt ein Himmelskörper als Modell, baue ihn als Shader oder Platzhalter und melde die Lücke an WS0.
- **Malen:** Nichts von Hand malen, was prozedural und wiederholbar sein soll: gleiche Saat, gleicher Himmel.
- **Festplatte:** rund 20 GB frei. Kein voller Fetch, kein Klon, `node_modules` per Link aus `~/kfb-ws0/kfb-mvp`, Testausgaben löschen, unter 8 GB frei anhalten und WS0 melden. Nie nach `~/KFB_GitHub_sync` holen.
- Georg tippt keine Terminalbefehle, keine Lizenzbemerkungen.

## Rückgabe an WS0 (Name in `ListAgents`: „KFB Open World Visual Terrain Recovery Lab“)
- Zuerst ein Bildblatt aus der Spielkamera, Spiel-Look: drei Biome, je Tag, Dämmerung und Nacht, je zwei Saaten, daneben der bisherige Himmel. Danach wartest du auf das Urteil, das WS0 im Hub einholt.
- Nach dem Ja: eine Fahrt als Clip über einen Biomwechsel hinweg, Testliste (`terrain-seams`, `hud-3d`, `fb-canon`), Bildraten-Vergleich, Branch und Commit, ehrlich, was nicht geprüft ist.
