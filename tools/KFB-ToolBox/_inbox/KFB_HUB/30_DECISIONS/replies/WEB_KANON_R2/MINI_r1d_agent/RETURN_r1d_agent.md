# FB Web-Kanon · R2b: Agent mit Jetpack Twin und fünf Requisiten · RETURN (WSB, Mac mini, 14.11.2026, V-1743/V-1755)

**Auftrag (WS0, Georg):** Für Claude Design FB im Spy-Anzug mit dem Jetpack Twin in einer Datei, dazu Ninja-Katana, Spy-Pistole mit Silencer, Action-Figure-Shotgun, Gatling und Martiniglas als eigene Web-Dateien.

**Grundlage:** lokaler Build `game/integration-r2` @e5acb971a + `assets/private` @30c4f387, Release-Schalter. Regeln wie r1d: Mund als voller Rig-Teil, Mimik, Plappern, Ruhe aus den Extras, Maß, Knete, Kanon-Wache.

## Dateien (`_privat_kauf_asset/`)
| Datei | Größe | Stand |
|---|---|---|
| `FB_WEB_KANON_agent_twin.r1d.glb` | 5,64 MB | Entwurf (wie der Agent) |
| `waffen/KFB_Katana.r1d.glb` | 65 KB | wie im Spiel |
| `waffen/KFB_ActionFigure_Shotgun.r1d.glb` | 107 KB | wie im Spiel („Scattershot“) |
| `waffen/KFB_Gatling.r1d.glb` | 279 KB | wie im Spiel |
| `waffen/KFB_Spy_Pistole_Silencer.r1d.glb` | 81 KB | nicht im Spiel; Halterung aus A6, Clips als Vorschlag |
| `waffen/KFB_Martini.r1d.glb` | 66 KB | nicht im Spiel; Halterung als Vorschlag |

sha256 in `SHA256SUMS.r2b.txt`. Die fünf Requisiten sind ungepackt, GLTFLoader lädt sie ohne Decoder. Die Figur braucht wie bisher den MeshoptDecoder.

Mitgeliefert im Zweig: die A6-Quellen `50_BLENDER/WSB_REIHE_R1/6_SPY/waffen/KFB_Spy_Gun.r1.glb` und `KFB_Martini.r1.glb`, je mit Karte und Prüfdatei. Neu in `web/`:
- `fb_mund.v2.js`: wie `fb_mund.js`, aber `sag()` endet wie im Spiel immer mit der Ruheform, ohne Smile-Ausnahme (WS0 14.11.).
- `fb_mund_beispiel.v2.html`: Lade-Beispiel dazu.

## 1 · Agent mit Jetpack Twin
- **Aufbau:**
  - Spy-Anzug: Logik von `attachFbAnzug` wie bei `FB_WEB_KANON_agent`, mit Fliege, Fell an den Händen, ohne Shirt.
  - Jetpack: die Twin-Variante des Spiels (`jetvar=twin`), aufgeklappt wie in Twin r1d.
  - Die Anker liegen auf den Millimeter wie in `FB_WEB_KANON_twin.r1d.glb`: `KFB_Jetpack_Anchor` (0; 0,586; −0,197), `KFB_Thrust_L/R`.
- **Rest wie r1d:**
  - 13 Mundknoten, Ruhe `neutral` in den Extras, Plapper-Schleife, 12 Mimik-Clips, Gesichts-Leerlauf.
  - Insgesamt 52 Clips: 39 wie r1d, dazu 5 Waffen-Aktionen und 8 Haltungen, siehe unten.
- **Kanon-Wache:** ok. Beide Ohren, links A11, Schwanz, Anzug mit 6 Teilen, Jetpack-Anker; Höhe 1,742 m.
- **Bildpaar Spiel ↔ Web** (vorn / seitlich / Gesicht): 1,7 / 2,1 / 3,2. Siehe `blaetter/V1_agent_twin_r1d.jpg`.
- **Hand–Ärmel nah (A6-Befund 1)**, gleiches Blatt, untere Zeile:
  - **Nicht sauber.** Zwischen Manschette und Hand stehen an beiden Händen spitze hautfarbene Dreiecke.
  - Im Spiel ist es genauso (Bildpaar 3,4 / 3,5 vorn).
  - Ursache wie in A6: `attachFbAnzug` → `handFell` gibt einem Dreieck erst dann FB-Fell, wenn mindestens 2 Ecken überwiegend an Hand-Knochen hängen; die Handgelenk-Dreiecke liegen knapp darunter.
  - Ich habe die Datei nicht anders gebaut als das Spiel. Die Abhilfe ist eine Zeile Spiel-Logik (Vorschlag A6: Dreieck = Hand, sobald eine Ecke > 0,5 an hand* hängt). Danach exportiere ich neu.

## 2 · Requisiten
Jede Datei hat denselben Aufbau:
- **Wurzel → `KFB_Griff`:** sitzt am Handslot. Darunter `KFB_Halterung` mit der Halterung aus der Spielkarte, darunter das Kit-Teil unverändert (V-574).
- **Anker:** bei Schusswaffen `KFB_Muendung`, beim Katana `KFB_Tip`.
- **Extras an der Wurzel:**
  - `kfbHalterung`: Slot, Versatz, Drehung, three-Name `handslotr`/`handslotl`;
  - `kfbWaffe`: Name, Spielkarte, Halten-Vorgabe des Spiels, Clips, Zielwinkel, Anker.
- **Anhängen in three.js:** `fig.getObjectByName('handslotr').add(requisit.scene)`, die Halterung ist schon gesetzt.
- **Herkunft:**
  - Katana, Shotgun und Gatling sind direkt aus dem laufenden Spiel genommen: ausgerüstet, die feste Halterung samt Waffe kopiert, Mündungsfeuer weggelassen.
  - Das Katana ist wie im Spiel aus dem Spender herausgelöst (`katanaFromDonor`: `kfb_katana_native` + `KFB_Tip`).
  - Material: Kit-Material des Spiels als Standard-PBR.

### Waffe → Clips (alle in `FB_WEB_KANON_agent_twin.r1d.glb`)
Halten heißt im Spiel: Bild bei *s* Sekunden des Quell-Clips für die Masken-Knochen, gehalten über dem Ruhe-Clip (`weaponHoldPose.js`). In der Datei gibt es das in zwei Formen:
- `FB_Halten_<waffe>`: nur die Masken-Knochen;
- `FB_Halten_<waffe>_Idle_A`: Idle_A mit ersetzten Masken-Knochen, also das, was das Spiel im Stehen zeigt.

| Requisit | Halterung (Spielkarte) | Halten | Aktion |
|---|---|---|---|
| Katana | handslot.r, ohne Versatz | `FB_Halten_katana(_Idle_A)` = Melee_Blocking @0,2 s, 12 Knochen | `KFB_Katana_diagonal_R1` (Treffer 0,47 s), `KFB_Katana_stab_R1` (0,4 s), `KFB_Katana_chop_R1` (0,6 s): KayKit-Originale wie im Spiel |
| Action-Figure-Shotgun | handslot.r, (0,1; 0; 0,02), Ry +90° | `FB_Halten_spreadshot(_Idle_A)` = Ranged_1H_Aiming @0,267 s, 7 Knochen | `KFB_SpreadShot_1H_R1` = Ranged_1H_Shoot, Abgang 0,267 s; Zielen: Figur −1,32° |
| Gatling | handslot.r, (0; 0; 0,155), Drehung aus fb_r2 | `FB_Halten_gatling(_Idle_A)` = Running_HoldingRifle @0,25 s, 13 Knochen (Seitentrage) | kein Körper-Clip (Spiel: Ranged-Clips ausgeschlossen); Feuern = Clip `KFB_Laeufe_drehen` in der Gatling-Datei (3 U/s, Spiel 18 Schuss/s); Zielen: Figur −35° |
| Spy-Pistole mit Silencer | handslot.r, Ry +90° (A6) | Vorschlag wie die Spiel-Pistole: `FB_Halten_pistole(_Idle_A)` = Ranged_1H_Aiming @0 s, rechter Arm | Vorschlag wie die Spiel-Pistole: `Ranged_1H_Shoot_mb1` (Motion Blocks, Abgang 0,3 s) |
| Martini | handslot.l, Vorschlag: Glas in Idle_A aufrecht, Stiel (22 % der Glashöhe) in der Faust | kein Clip (Idle_A) | keine |

Die Haltungen haben genau so viele Spuren wie im Spiel gemessen (36 / 21 / 39).

## Prüfung
- **Bildpaar je Requisit**, FB-Agent-Twin mit dem Requisit, gleicher Clip zur gleichen Zeit (`blaetter/W1_requisiten_r1d.jpg`):
  - Spielseite: Spielfigur mit Spiel-Halterung.
  - Mittlere Abweichung 2,0–2,7 (Katana 2,7 / 2,4, Shotgun 2,0 / 2,0, Gatling 2,4 / 2,3).
  - Der Handslot liegt in allen Bildern auf den Millimeter gleich.
- **Spy-Pistole und Martini** sind nicht im Spiel, also nur Web: Halten und Schuss bzw. Ruhe und Reden. Dazu nah in `blaetter/W2_hand_nah_r1d.jpg`: Martini-Stiel in der linken Faust, Pistole am Griff.
- **Bilder:** `bilder_r2b_jpg/`. Daten in `data/r2b/`, Skripte in `scripts/r2b/`.

## Offen
1. Hand–Ärmel-Dreiecke (siehe oben): Spiel-Logik, WS0 entscheidet.
2. Spy-Pistole und Martini: Halterung und Clips sind Vorschläge, solange sie nicht im Spiel sind.
