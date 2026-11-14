# FB Web-Kanon · r1e: Agent und Agent mit Twin nach der handFell-Zeile · RETURN (WSB, Mac mini, 14.11.2026)

**Auftrag (WS0):** Die beiden Agent-Dateien einmal neu exportieren, nachdem die handFell-Zeile im Spiel eingebaut ist (Stamm @5cbd2bd2: eine Hand-Ecke reicht), mit der Hand-Ärmel-Nahaufnahme. Sonst nichts ändern.

**Grundlage:** lokaler Build `game/integration-r2` @5cbd2bd2 + `assets/private` @3f64e6d6, Release-Schalter. Exporter wie R2b; die Kopie der Anzug-Logik zählt jetzt wie das Spiel (`>= 1` Hand-Ecke).

| Datei (`_privat_kauf_asset/`) | Größe | sha256 (Anfang) | ersetzt |
|---|---|---|---|
| `FB_WEB_KANON_agent.r1e.glb` | 4,12 MB | 542037e62b32b912 | `FB_WEB_KANON_agent.r1d.glb` |
| `FB_WEB_KANON_agent_twin.r1e.glb` | 5,64 MB | 98f8da7501a7ce03 | `FB_WEB_KANON_agent_twin.r1d.glb` |

Beide bleiben Entwurf.

## Was anders ist
1. **Hand–Ärmel:** 244 statt 216 Dreiecke an den Händen bekommen FB-Fell.
   - Die hautfarbenen Spitzen zwischen Manschette und Hand sind an beiden Händen weg.
   - Spiel und Web decken sich (Bildpaar nah 3,4–3,7).
   - Siehe `blaetter/H1_hand_aermel_r1e.jpg`: r1d vorher, Spiel @5cbd2bd2, r1e; rechts und links, vorn und von unten.
2. **Mimik kameraL/kameraR:** Der Stamm @5cbd2bd2 enthält auch WS0s face-mount-Zeile (`browHold` raiseL/raiseR).
   - Die Posen `FB_Mimik_kameraL`/`kameraR` und `kfbMimik.posen.kameraL/R` heben deshalb jetzt eine Braue, so wie das Spiel.
   - Das kommt aus dem Spiel, nicht aus einer Änderung von mir.
   - Bildpaar Gesicht kameraL 3,2 / 3,3.

Alles andere ist wie r1d: Körper, Knete, Augen, Mund mit 13 Knoten, Plappern, die übrige Mimik, Clips, beim Agent-Twin die Waffen-Clips, Maß 1,742 m.

## Prüfung
- **Kanon-Wache** ok für beide (`data/r1e/pruefung_*.json`): Anzug mit 6 Teilen, beim Twin die Jetpack-Anker. Clips: 39 bzw. 52.
- **Bildpaare Spiel ↔ Web** (vorn / seitlich / Gesicht): Agent 1,7 / 1,6 / 3,2, Agent-Twin 1,8 / 2,2 / 3,3.
- **Bilder:** `bilder_r1e_jpg/`. Exporter: `scripts/r1e/wk_export.mjs`.
