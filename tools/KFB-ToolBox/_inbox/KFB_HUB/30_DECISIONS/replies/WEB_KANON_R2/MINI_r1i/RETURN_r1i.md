# MINI_r1i · Web-Kanon r1i, Mund yellow_buck · RETURN (WSB, 15.11.2026, V-1821)

**Bundle:** `wsb-fb-web-kanon-r1i.bundle`, sha256 `8ae5e54d85fffffbd98b3905fdc052f86ff2911fb193190485401684a6abe771`
- Zweig `assets/wsb-fb-web-kanon-r1i` @12da5db2, ab `assets/private` @72d3701c.
- 24 Dateien, nur additiv. WSB pusht nicht.

**Messblatt:** `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1i.md`. **Blätter** liegen hier: `M1_mund_r1i.jpg` (13 Formen, Spiel ↔ Web) und `M2_ruhe_oh_r1i.jpg` (vier Dateien mit Ganzkörper, Ruhe und oh).

## Für `appearance.export`
| Feld | Pfad | MB |
|---|---|---|
| `web` | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON.r1i.glb` | 4,75 |
| `web_twin` | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_twin.r1i.glb` | 6,12 |
| `web_agent` | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent.r1i.glb` | 4,20 |
| `web_agent_twin` | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1i.glb` | 7,29 |

## Kurz
- **Getauscht:** nur die Bilder der 13 Mundknoten, nach `FORM_R4`.
  - 12 Bilder, byte-gleich mit den Spiel-PNGs @682d0f16.
  - uh, f und l haben eigene Netze; d und r teilen sich weiter `small_open`.
- **`kfbMund`:** `satz` ist `r4_yellow_buck`, `form` folgt `FORM_R4`. `fb_mund.v2.js` ist unverändert.
- **Sonst nichts geändert:** Der Vergleich Quelle ↔ r1i (Knoten, Netze, Morphs, Materialien, Clips, Skins, Extras) ergibt in allen vier Dateien **0 Abweichungen**. Die Packung bleibt, wie sie war.
- **Kanon-Wache:** Ohren, Schwanz und alle Pflichtknoten sind in allen vier Dateien da.

## Messwerte
**Spiel ↔ Web (M1):** Alle 13 Formen decken sich.

**Oberlippe → Nase**, gleiche Kamera, Pupillen gleich. Werte im 900-px-Bild:

| Mund | Spiel | Web | Abweichung Web |
|---|---|---|---|
| Ruhe | 14 px | 13 px | 1 px näher an der Nase |
| oh | 5 px | 4 px | 1 px näher an der Nase |

- Auf 312 px Augenabstand umgerechnet sind das rund 1,3 px.
- Der Mund ist im Web außerdem rund 3 % breiter.

**Woher die Abweichung kommt:** Sie liegt im Sitz des Mundes, wie er seit r1d in der Datei steht. Die neuen Bilder haben damit nichts zu tun. Nach V-574 ist der Sitz unverändert geblieben.

## Entscheid für WS0
Soll der Web-Mund 1 px tiefer sitzen? Das wäre ein einziger Wert am `FB_Mund_Pivot`, für alle vier Dateien gleich.

## Nebenbei
- Der Nachtrag zu r1h liegt mit im Zweig: `RETURN_r1h_nachtrag.md` und `data/r1h/clips.r1h.v2.json`.
- Der Spielbau für die Gegenprobe liegt in `~/kfb_work/build-r8`. Ich trage ihn auf die Löschliste ein.
