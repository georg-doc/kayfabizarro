# Für WSB (Mac mini, Blender MCP) · Web-Kanon r1i: FB-Mund yellow_buck in alle FB-Web-Dateien · 15.11. (Georg q709, V-1821)

**Kern (3 Zeilen):**
1. Georg hat für FB den neuen Mund „yellow_buck“ gewählt (Hub q709). Im Spiel trägt FB ihn seit heute (Figurendatei, Stamm `game/integration-r2` @682d0f16).
2. Alle FB-Web-Dateien haben die 13 Mundformen als Knoten eingebacken (seit r1d) und zeigen deshalb noch den alten Satz `gpt_a_r2`. ToolBox, Website und Spiel laden dieselben Dateien (V-1743).
3. Lieferung: die vier FB-Web-Dateien als r1i, je nur mit den Bildern der 13 Mundknoten aus dem neuen Satz, sonst nichts geändert, mit einem Messblatt.

**Grundlage:** `assets/private` @72d3701c. Stamm `game/integration-r2` @682d0f16. Pfade ohne Präfix liegen in `assets/private`, Ordner `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/`.

| Feld in `appearance.export` | Quelle heute | Ziel |
|---|---|---|
| `web` (Georg q672) | `FB_WEB_KANON.r1d.glb` | `FB_WEB_KANON.r1i.glb` |
| `web_twin` | `FB_WEB_KANON_twin.r1d.glb` | `FB_WEB_KANON_twin.r1i.glb` |
| `web_agent` | `FB_WEB_KANON_agent.r1e.glb` | `FB_WEB_KANON_agent.r1i.glb` |
| `web_agent_twin` | `FB_WEB_KANON_agent_twin.r1h.glb` (neuester Stand, Messblatt `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1h.md`) | `FB_WEB_KANON_agent_twin.r1i.glb` |

| Teil | Bestand (geprüfter Pfad) |
|---|---|
| Mund-Rig in der Datei | 13 Knoten `FB_Mund_<schlüssel>` unter `FB_Mund_Pivot`, Extras `userData.kfbMund` (Beschreibung `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1d.md`), Modul `50_BLENDER/FB_WEB_KANON_R1/web/fb_mund.v2.js` |
| Neue Mundbilder | Stamm `src/assets/actors/mouths-r4-yellow_buck/*.png` (gleiche 512er Fläche und Anker wie Satz A) |
| Zuordnung Schlüssel → Bild | Stamm `src/modules/mundSaetze.js`, `FORM_R4` (wie `FORM`, dazu s = grimace, uh = mid_open, f = fv, l = l_th) |
| Sitz, Größe, Ruhe | Stamm `src/data/characters/frizzlebob.character.json` `appearance.mouth.v` (unverändert: size 0.5, dy −0.58, dx −0.032, lift 0.03, rest neutral) |

**Regeln:**
- In jeder der vier Dateien nur die Bilder der 13 Mundknoten tauschen, genau nach `FORM_R4`. Sitz, Größe, Ruhe, Knotennamen, Clips, Körper, Augen und Packung bleiben wie in der Quelle (V-574).
- R4 hat eigene Bilder für uh, f und l; teilen Formen kein Bild mehr (bisher d/uh/r und f/l), bekommen sie eigene Netze.
- In `userData.kfbMund` `satz` auf `r4_yellow_buck` setzen und `form` nach `FORM_R4` nachführen. `fb_mund.v2.js` nennt den alten Satz nur im Kommentar und bleibt unverändert.
- Gegenprobe Spiel ↔ Web wie in r1d: alle 13 Formen mit gleicher Kamera von vorn als ein Blatt (an `web`), im Spiel mit dem heutigen Stamm (Schalter `muender4` ist übernommen). Für die drei anderen Dateien genügt je ein Blatt Ruhe | oh.
- Abstand Oberlippe → Nase beim „oh“ messen (Spiel heute: Ruhe 20 px, oh 9 px im 1000-px-Bild bei Augenabstand 312 px) und im Web gleich halten.
- FB-Kanon-Wache (beide Ohren, Schwanz), Größe jeder Datei im Messblatt.

**Rückgabe:** Git-Bundle mit Zweig `assets/wsb-fb-web-kanon-r1i` von `assets/private` @72d3701c, RETURN `RETURN_r1i.md` in `KFB_HUB/30_DECISIONS/replies/WEB_KANON_R2/MINI_r1i/` mit den Blättern. WS0 pusht, trägt die vier r1i-Pfade in `appearance.export` der Figurendatei ein und gibt r1i an Claude Design weiter.
