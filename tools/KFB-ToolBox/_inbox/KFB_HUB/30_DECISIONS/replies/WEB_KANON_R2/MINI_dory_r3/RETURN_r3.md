# Lady Dory r3 · Mundsatz B mit Ersatzbildern · RETURN (WSB, Mac mini, 14.11.2026, Georg q680)

**Auftrag (WS0):** Dory mit dem neuen Mundsatz-B-Ersatz aus dem Stamm @0b211f2b (`src/modules/mundSaetze.js` `ERSATZ`), sonst wie r2.

| Datei (`_privat_kauf_asset/`) | Größe | sha256 (Anfang) | ersetzt |
|---|---|---|---|
| `LADY_DORY_WEB_KANON.r3.glb` | 4,57 MB | 96fb961c385e7c0e | `LADY_DORY_WEB_KANON.r2.glb` |

**Gebaut** aus dem r2-Export (gleicher Körper, Augen, Clips, Mimik, Blick-Kappe); nur der Mund ist neu zusammengesetzt, nach der Regel des Spiels: eigenes Bild des Satzes, sonst Ersatz des Satzes, sonst `closed`.

| Schlüssel | Form | Bild in r3 |
|---|---|---|
| m | mbp | closed (bleibt zu, wie im Spiel) |
| s | teeth_small | **grit** |
| ee | ee_wide | **smile_teeth** |
| f, l | th_tongue | **tongue_out** |
| woo | oo | **oh** |
| alle übrigen | eigene B-Bilder | wie r2 |

- 8 Bilder für 13 Formen, Zuordnung je Schlüssel in den Extras: `kfbMund.bild_je_schluessel`.
- Dory bewegt beim Sprechen jetzt sichtbar die Lippen (Zähne bei s/ee, Zunge bei f/l). Siehe `blaetter/D5_dory_r3.jpg`: alle 13 Formen nah und die Plapper-Schleife.
- Bildpaar Spiel ↔ Web wie r2 (3,1 / 2,6 / 4,7). Version in den Extras: `LADY_DORY_WEB_KANON.r3`.
- Daten `data/r3/`, Bilder `bilder_r3_jpg/`.
