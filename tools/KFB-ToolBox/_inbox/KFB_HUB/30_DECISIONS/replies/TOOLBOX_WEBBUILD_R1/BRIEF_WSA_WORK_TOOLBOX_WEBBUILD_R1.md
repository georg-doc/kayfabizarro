# Für WSA Work (ToolBox) · ToolBox lädt die gebackenen Web-Dateien aus den Figurendateien · 14.11. (Georg, V-1743, V-1760)

**Anlass (Georg 14.11.):** „die SSOTs müssen alle via toolbox updatebar sein und korrekt geladen werden!“ und „dann laden die ganzen kaykit rigs auch schneller in der toolbox“. Seit heute hat jede abgenommene Figur eine fertige Web-Datei in ihrer Figurendatei (`appearance.export`), die in reinem three.js wie im Spiel aussieht; FB ist von Georg abgenommen (Hub q672).

**Grundlage:** deine ToolBox v18 (Zweig `wsa/character-ssot-r2-toolbox` @84669eda, Draft #117 im Repo `georg-doc/KFB-Stunt-Car-Race`); Spiel-Pin neu `game/integration-r2` @83024094 (statt 8f985dbb). Speichern bleibt die Patch-Datei `kfb.character.patch/1`.

**Ziel:**
1. Hat eine Figur in `src/data/characters/<id>.character.json` einen Eintrag `appearance.export.v.web`, lädt die Vorschau diese Datei (GLTFLoader + MeshoptDecoder aus three/addons) statt die Figur aus Teilen zusammenzusetzen; Varianten aus denselben Feldern wählbar (`web_twin`, `web_agent`, `web_agent_twin`, Requisiten aus `web_requisiten` an `handslot.r`/`handslot.l` über die Extras `kfbHalterung`). Ohne Eintrag bleibt der heutige Weg.
2. Heute vorhanden (Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `assets/private` @4e87ba2d):
   - FrizzleBob: `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON.r1d.glb`, `…/FB_WEB_KANON_twin.r1d.glb`, `…/FB_WEB_KANON_agent.r1e.glb`, `…/FB_WEB_KANON_agent_twin.r1e.glb`, Requisiten in `…/_privat_kauf_asset/waffen/` (fünf Dateien, Liste in `src/data/characters/frizzlebob.character.json` `appearance.export.v.web_requisiten`).
   - Lord Hunky: `50_BLENDER/DP_WEB_KANON_R1/_privat_kauf_asset/LORD_HUNKY_WEB_KANON.r1.glb`; Lady Dory: `50_BLENDER/DP_WEB_KANON_R1/_privat_kauf_asset/LADY_DORY_WEB_KANON.r1.glb` (beide in Prüfung; Fassung r2 mit vollem Mund-Rig folgt, Pfad danach in ihrer Figurendatei).
   - alle übrigen Figuren: Platzhalter, Build folgt (heutiger Weg).
3. Mund und Gesicht steuert die ToolBox über die Knoten der Datei, nicht über ein neues Netz: 13 Mundformen `FB_Mund_<schlüssel>`, Ruheform aus `appearance.mouth.v.rest` der Figurendatei (Extras `kfbMund.ruhe` nur als Rückfall), Sprechen/Mimik mit `50_BLENDER/FB_WEB_KANON_R1/web/fb_mund.v2.js`. Eine Änderung an Mund-Ruhe, Viseme-Zuordnung oder Mimik wirkt sofort in der Vorschau und geht wie heute als Patch raus; dafür ist kein neuer Export nötig. Hunky und Dory (r1, ohne Mund-Knoten): Mund bleibt bis r2 auf dem heutigen Weg.
4. Felder, die in der Web-Datei fest gebacken sind (Körperform, Knete, Ohren, Kleidung, Mundsatz-Bilder), zeigt die ToolBox als „ändert die Web-Datei – Neu-Backen durch WSB nach Patch“ an; der Patch geht wie heute an WS0, WS0 spielt ihn ein und lässt WSB neu backen.

**Rückgabe als Kommentar in deinem Draft #117:** Site-Version, Zweig-SHA, Ladezeit FB/Hunky/Dory vorher und nachher, je Figur ein Bild ToolBox-Vorschau neben Spielbild, und ein Probe-Patch (FB Mund-Ruhe smile) mit Vorschau-Bild, ohne ihn an Georg zu schicken.
