# MINI_r1j · Web-Kanon r1j, Mund-Sitz wie im Spiel · RETURN (WSB, 15.11.2026, V-1821 Nachzug)

**Bundle:** `wsb-fb-web-kanon-r1j.bundle`, sha256 `cad51846d5dba14591b328752c06dd6794792e43319e8c9aeb1f24f902d123c2`
- Zweig `assets/wsb-fb-web-kanon-r1j` @800a85eb, ab `assets/private` @f629f89e.
- 15 Dateien, nur additiv. WSB pusht nicht.

**Messblatt:** `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1j.md`. **Blatt:** `M1_mund_r1j.jpg` (hier) mit den 13 Formen: Spiel, r1i und r1j.

## Für `appearance.export`
Alle Dateien liegen in `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/`:
- `web`: `FB_WEB_KANON.r1j.glb`
- `web_twin`: `FB_WEB_KANON_twin.r1j.glb`
- `web_agent`: `FB_WEB_KANON_agent.r1j.glb`
- `web_agent_twin`: `FB_WEB_KANON_agent_twin.r1j.glb`

Die Größen sind dieselben wie bei r1i: 4,75 / 6,12 / 4,20 / 7,29 MB.

## Was sich geändert hat
- **Nur `FB_Mund_Pivot`:** Er sitzt 0,001 u tiefer, in allen vier Dateien gleich.
- **Sonst gleich r1i:** Die Gegenprobe findet nur den Pivot und die `kfbMund`-Extras abweichend.

## Abstand Oberlippe → Nase

| Messung | Spiel | Web r1i (vorher) | Web r1j (nachher) |
|---|---|---|---|
| weit, Ruhe | 14 px | 13 px | 14 px (alle vier Dateien) |
| weit, oh | 5 px | 4 px | 5 px (alle vier Dateien) |
| nah, Oberlippe Ruhe | 395 px | 392 px | 395 px |
| nah, Oberlippe oh | 363 px | 360 px | 363 px |

## Offener Rest
- **Der Web-Mund ist rund 3 % größer als im Spiel.** Er ist 832 statt 807 px breit, und die Unterlippe sitzt nah gemessen 10 px tiefer.
- **Woher das kommt:** Der Unterschied liegt seit r1d in den Dateien und hat nichts mit dem Sitz zu tun.
- **Lösung, falls gewünscht:** Maßstab am Pivot × 0,97. Das ist ein eigener Entscheid für WS0.
