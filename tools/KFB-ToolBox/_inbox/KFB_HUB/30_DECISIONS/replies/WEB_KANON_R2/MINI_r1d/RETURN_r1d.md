# FB Web-Kanon · r1d (Mund als voller Rig-Teil) · RETURN (WSB, Mac mini, 14.11.2026, V-1751/V-1753)

**Auftrag (WS0, Web-Kanon R2 Teil 1):** Ruhe-Mund geschlossen (Georg q668: „offener mund ist falsch“). Der Mund bleibt ein voll steuerbarer Teil des Rigs, und alles, womit FB im Spiel spricht und Mimik macht, liegt in der Datei oder als beigelegtes Modul.

**Grundlage:** lokaler Build `game/integration-r2` @9b18f5acd + `assets/private` @b76ac864, Release-Schalter. Die Figurendatei hat `appearance.mouth.v.rest = "neutral"`. Im Spiel gemessen: Mund `neutral`, Satz `gpt_a_r2`, Halte-Ruhe `neutral`.

| Datei (`_privat_kauf_asset/`) | Größe | sha256 (Anfang) | ersetzt |
|---|---|---|---|
| `FB_WEB_KANON.r1d.glb` | 4,67 MB | 133066d15cad96c1 | `FB_WEB_KANON.r1b.glb` |
| `FB_WEB_KANON_twin.r1d.glb` | 6,04 MB | bde06b2286a57f2d | `FB_WEB_KANON_twin.r1c.glb` |
| `FB_WEB_KANON_agent.r1d.glb` | 4,12 MB | b96f5a1fbb570547 | `FB_WEB_KANON_agent.r1b.glb` (bleibt Entwurf) |

Dazu in `web/`:
- `fb_mund.js`: Steuerung für Form, Ruhe, Viseme, Sprechen aus Text und Mimik.
- `lipsync-text.v1.js`: das Spiel-Modul, byte-gleich (Git-Blob 7b981a94 = `src/vendor/fb/kfb-lib/lipsync-text.v1.js` @9b18f5acd).
- `fb_mund_beispiel.html`: Lade-Beispiel mit Knöpfen.

Körper, Knete, Augen, Körper-Clips und Maß sind wie r1b/r1c. Neu ist nur der Mund- und Sprech-Umfang.

## Mund in der Datei
- **13 Knoten** `FB_Mund_<schlüssel>` unter `FB_Mund_Pivot`, genau die Schlüssel aus `src/modules/mundSaetze.js` FORM: neutral, smile, m, d, s, ee, uh, ah, oh, r, f, woo, l.
  - Gezeigt wird genau einer (Skalierung 1), die anderen stehen auf 0.
  - Gleiche Bilder teilen ein Netz: d/uh/r = `small_open`, f/l = `th_tongue`. Es sind also 10 Bilder für 13 Formen.
- **Ruhe nicht im Netz festgelegt:** Extras am Wurzelknoten, in three `userData.kfbMund`:
  - `ruhe: "neutral"` aus `appearance.mouth.v.rest`;
  - `satz: "gpt_a_r2"`, `visemeMap` aus der Figurendatei, `form` (Schlüssel → Bild), `knoten`.
  - Ändert die ToolBox die Ruheform, genügt ein anderer Extras-Eintrag bzw. ein anderer Aufruf von `form()`; ein neuer Export ist nicht nötig.
  - Beim Laden zeigt die Datei `neutral` (geschlossen).
- **Gegenprobe Spiel ↔ Web**, alle 13 Formen mit gleicher Kamera (`blaetter/M1_mund_r1d.jpg`):
  - Form, Lage und Ausrichtung decken sich.
  - Die mittlere Abweichung liegt nah am Mund bei rund 18 (0–255). Sie kommt fast ganz von der dunkleren Kopfunterseite im Web; das ist der Kopfschatten aus Teil 3, nicht der Mund.

## Fähigkeit im Spiel → in der Datei
| Im Spiel (Quelle) | In der Datei / im Modul | Stand |
|---|---|---|
| Ruhe-Mund aus der Figurendatei (faceMountActor `holdRest`, `mouth.rest`) | `kfbMund.ruhe`, Knoten `FB_Mund_neutral`; `fb_mund.ruhe()` | da |
| 13 Mundformen des Satzes (`mouth.setTex(key)`) | `FB_Mund_<schlüssel>`; `fb_mund.form(key)` | da |
| Viseme-Zuordnung closed/open/wide/round/smile (`appearance.mouth.v.visemeMap`) | `kfbMund.visemeMap`; `fb_mund.viseme(name)` | da |
| Sprechen aus Text (`say` → `textToTrack` → `lipTick`, erstes Bild sofort) | `lipsync-text.v1.js` unverändert; `fb_mund.sag(text, {lang, rate})`, Takt über `update(dt)` | da |
| Lippen-Spur aus anderer Quelle (Phonem-Liste) | `fb_mund.spiele(track)` | da |
| Sprech-Schleife (Mund wechselt im Sprechrhythmus) | Clip `FB_Plappern_Schleife`, 7 s, nahtlos: Spur des Spiel-Moduls für `PANGRAM.de` (52 Laute), Brauen-Leben, Blick, 2× Blinzeln | da |
| Brauen-Leben beim Sprechen (face-mount `browLife`) | im Plapper-Clip nach der Spiel-Rechnung, gemessen an FBs Brauen (siehe unten) | da |
| Körper-Gesten zum Reden | `kfb_gesture_talking_a`, `kfb_gesture_pointing_a`, `kfb_gesture_waving_gesture_a`, `kfb_gesture_standing_greeting_a`, dazu `kfb_gesture_taunt_a` (`.fb`-Fassungen aus WSB_HALTUNG_R1) | da (seit r1b) |
| 12 Mimik-Vorgaben (faceMountActor `MIMIK`) | Clips `FB_Mimik_<art>` (gehaltene Pose, 1 s); Werte in `kfbMimik.posen`; `fb_mund.mimik(art)` weich wie im Spiel (0,05 s), Mimik-Mund nur, wenn FB nicht spricht | da |
| Gesichts-Leerlauf | `FB_Gesicht_Leerlauf`, 12 s; Einschübe smile 5,0–6,2 s und d 8,6–9,4 s, sonst Ruhe `neutral` | da |
| Blick (`lookAt`, Blick-Feder) | Knoten `FB_Auge_L/R_Blick`, Formel wie R1 (Euler XYZ (−ny·0,5, nx·0,5), Kappe 0,42 rad) | Knoten da, keine Funktion in `fb_mund.js` |
| Blinzeln (`blinkNow`, Zufalls-Blinzeln) | Morph `zu` (stückweise über `oben_halb`/`unten_halb`), in den Gesichts-Clips | Morph da, keine Funktion |
| Zufalls-Plappern `talk()` (pet-mouth) | nur als feste Spur im Plapper-Clip | **fehlt** als Zufall |
| Mimik-Vorrang (kurz vor Dauer vor Leerlauf, mit Dauer) | eine aktive Pose in `fb_mund.js` | **fehlt**: der Aufrufer entscheidet |
| Ohnmacht (Lider zu, traurige Brauen) | aus Morph `zu` und Brauen-Messung `sad@1` (in `data/r1d/export_log_fb.json`) zusammensetzbar | **fehlt** als eigene Pose |
| Brauen-Reaktionen ohne Sprechen (`browReact` raiseL/raiseR/skeptic/furrow/both, zufällig) | nur `both`/`raiseL` im Plapper-Clip | **fehlt** als einzelne Clips |
| Ohren-Federkette (ear-dangle) | Knochen da, keine Physik | **fehlt** (wie R1) |

## Mimik: wie gemessen
- **Lider:**
  - Für jede Vorgabe hat das Spiel-Rig selbst die Lidhaut erzeugt, mit Grundstellung plus Zuschlag je Auge.
  - Daraus sind die Gewichte der Lid-Morphs angepasst (kleinste Quadrate, 0…1).
  - Neuer Morph `oben_weit` (Oberlid −0,2, für treffer/entdecken).
  - Ein Unterlid weiter auf (−0,08) bewegt die Lidhaut im Spiel nicht; dafür gibt es keinen Morph.
  - Größter Rest: 1,9 mm bei 10,9 mm Ausschlag (grimmig), warten 1,7/21 mm, zielen 0,7/28 mm; treffer, gelangweilt und die Mund-Vorgaben 0.
  - Lid-Morphs jetzt: `oben_halb`, `oben_zu`, `unten_halb`, `unten_zu`, `zu`, `oben_weit`.
- **Brauen:**
  - face-mount `browHold(art, k)` und `browLife(0)` bei stehender Uhr, Lage und Drehung der Knoten `FB_Braue_L/R_Pivot` abgelesen.
  - Eine laufende Zufallsreaktion wurde vorher auf Hülle 0 gesetzt.
- **Mund:** die Form der Vorgabe (grimmig s, treffer/entdecken oh, kamera smile, gelangweilt m, mund_*), sonst Ruhe.
- **Gegenprobe** (`blaetter/M2_mimik_r1d.jpg`): alle 12 Vorgaben, Spiel gegen Web, mittlere Abweichung 3,1–3,3. Das Gesicht in Ruhe liegt bei 3,2.
- **Seiten:** „links“ in der Spiel-Tabelle (Index 0, z. B. zielen 0,36) ist im Bild links, in der Datei also `FB_Lidhaut_R`, FBs rechtes Auge.

## Prüfung
- **Kanon-Wache** ok für alle drei Dateien (`data/r1d/pruefung_*.json`):
  - beide Ohren, links A11, Schwanz;
  - FB und Twin mit Shirt, Agent mit Anzug und Fliege;
  - Twin mit `KFB_Jetpack_Anchor`, `KFB_Jetpack_Twin`, `KFB_Thrust_L/R`.
- **Inhalt:** 39 Clips (26 wie bisher + Plappern + 12 Mimik), Höhe 1,742 m, alle unter 8 MB.
- **Bildpaare Spiel ↔ Web** (vorn / seitlich / Gesicht, 0–255):
  - FB 2,5 / 2,0 / 3,2 (r1b 2,5 / 2,7 / 3,2);
  - Twin 2,5 / 2,6 / 3,2 (r1c 2,5 / 2,6 / 3,2);
  - Agent 1,7 / 1,6 / 3,2.
- **Lade-Beispiel** mit Playwright geprüft: Form ah, Mimik grimmig mit Übergang, `sag()` bis zur Ruhe, Plapper-Schleife. Keine Fehler; nur das Symbol der Seite fehlt (404).
- **Blätter:**
  - `M1_mund_r1d.jpg` (13 Formen);
  - `M2_mimik_r1d.jpg` (12 Vorgaben);
  - `M3_plappern_r1d.jpg` (Schleife und `sag()`);
  - `V1_twin_agent_r1d.jpg`.
- **Bilder:** `bilder_r1d_jpg/<fb|twin|agent>/`, Spiel und Web je Ansicht, Form und Mimik.

## Hinweise für WS0 (Spiel-Punkte, nichts geändert)
1. **kameraL/kameraR:** Das Spiel ruft `browHold('raiseL'|'raiseR', 0,8)`. `browHold` kennt nur sad, furrow und both, die Brauen bleiben dort also in Ruhe. So ist es gemessen und so steht es in der Datei. Soll eine Braue hoch, wäre das eine Spiel-Änderung.
2. **Ende nach „!“:** Laut Auftrag endet `fb_mund.sag()` mit `smile` bei „!“, sonst mit Ruhe. Im Spiel endet FB heute immer mit Ruhe: `lipTick` nimmt `holdRest()`, sobald ein Ruhe-Mund gesetzt ist, und das ist jetzt `neutral`. Soll die Datei sich wie das Spiel verhalten, ist das eine Zeile in `fb_mund.js`.

## Einbau
- WS0 trägt die r1d-Dateien in `appearance.export.web`, `web_twin` und `web_agent` ein.
- Laden wie bisher: `GLTFLoader` + `MeshoptDecoder`.
- Gesicht wahlweise:
  - über die Clips: `FB_Gesicht_Leerlauf`, `FB_Plappern_Schleife`, `FB_Mimik_*`;
  - über `fb_mund.js`: nach `mixer.update(dt)` `mund.update(dt)` aufrufen.

## Ordner
- `_privat_kauf_asset/`
- `web/`
- `blaetter/`
- `bilder_r1d_jpg/`
- `data/r1d/`: Export-Logs mit allen Messwerten, Phase 2, Prüfung, Metrik, `cfg_fb.json`
- `scripts/r1d/`: Exporter mit Mimik-Messung, Phase 2 mit allen Formen, Plappern und Mimik, Packen, Prüfung, Bilder, Metrik, Test des Lade-Beispiels; `web/view2.html` = Betrachter mit `form`/`mimik`/`sag`

Die PNG-Fassung der Bilder (`bilder_r1d/`, 63 MB) liegt nur lokal und ist nicht im Zweig.
