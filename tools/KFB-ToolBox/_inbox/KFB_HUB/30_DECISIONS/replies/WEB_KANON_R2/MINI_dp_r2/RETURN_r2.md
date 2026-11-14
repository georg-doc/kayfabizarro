# Dramatis Personae Web-Kanon · r2: Hunky und Dory auf r1d-Stand · RETURN (WSB, Mac mini, 14.11.2026)

**Auftrag (WS0):** Hunky und Dory wie FB r1d: volles Mund-Rig, Viseme, Plappern, Mimik, Ruhe aus der Figurendatei, kappeBlick 0,5 rad in Steuerregel und Gesichts-Leerlauf. Namen r1 → r2, sonst nichts ändern.

**Grundlage:** lokaler Build `game/integration-r2` @5cbd2bd2 + `assets/private` @3f64e6d6, Release-Schalter. Körper, Knete-Atlas, Augen, Körper-Clips und Maß wie r1.

| Datei (`_privat_kauf_asset/`) | Größe | sha256 (Anfang) | ersetzt |
|---|---|---|---|
| `LORD_HUNKY_WEB_KANON.r2.glb` | 5,61 MB | b71c1d00ddc8e33a | `LORD_HUNKY_WEB_KANON.r1.glb` |
| `LADY_DORY_WEB_KANON.r2.glb` | 4,25 MB | 85562a8ba07611ab | `LADY_DORY_WEB_KANON.r1.glb` |

Steuerung im Browser mit `50_BLENDER/FB_WEB_KANON_R1/web/fb_mund.v2.js` und `lipsync-text.v1.js`. Das Modul liest Präfix und Knotennamen aus den Extras (`kfbMund.praefix` = `Hunky_` bzw. `Dory_`) und läuft unverändert mit beiden Dateien.

## Was neu ist
- **Mund:**
  - 13 Knoten `<P>Mund_<schlüssel>` (FORM aus `mundSaetze.js`) mit den Bildern des Satzes aus der Figurendatei: Hunky Satz A `gpt_a_r2`, Dory Satz B `gpt_b_r2`. Die Bilder liegen senkrecht gespiegelt wie das Kopfteil-Decal im Spiel.
  - Ruhe in den Extras: `kfbMund.ruhe = "neutral"` aus `appearance.mouth.v.rest = "closed"` (Form `closed` = Schlüssel `neutral`).
- **Dory, Satz B:**
  - Fünf Bilder fehlen im Spiel: `mbp`, `ee_wide`, `teeth_small`, `th_tongue`, `oo`. `mundSaetze.js` nimmt dafür `closed`, und so steht es auch in der Datei.
  - Dory zeigt also bei m, s, ee, f, l und woo den geschlossenen Mund und bewegt beim Sprechen kaum die Lippen (Blatt D4).
  - Satz B hat dafür eigene Bilder (`grimace`, `grit`, `laugh`, `scream`, `smirk`, `tongue_out`, `smile_teeth`), die FORM nicht nutzt. Eine Zuordnung wäre eine Spiel-Entscheidung; ich habe nichts geändert.
- **Viseme:**
  - Hunkys Figurendatei nennt Bildnamen (`closed`, `ah`, `ee_wide`, …). In `kfbMund.visemeMap` stehen sie übersetzt in Mund-Schlüssel (closed→neutral, wide→ee, small→d, mbp→m, oo→woo, teeth→s …). Das Original steht in `visemeMap_figurendatei`.
  - Dorys Figurendatei hat keine Zuordnung (`null`).
- **Sprechen und Plappern:**
  - `fb_mund.v2.js` `sag(text)` spielt die Spur des Spiel-Moduls und endet in Ruhe.
  - Clip `<P>Plappern_Schleife`: 7 s, Spur `PANGRAM.de`, Blick und Blinzeln wie bei FB. Brauen gibt es nicht, die Kopfteil-Figuren haben im Spiel kein Brauen-Rig.
  - Im Spiel sprechen Hunky und Dory nicht (`headpartActor` hat kein `say`). Mund und Plappern sind also, wie bei FB, das, was die Datei kann.
- **Mimik (Vorschlag):**
  - Das Spiel hat für Kopfteil-Figuren keine Mimik. Die 12 Clips `<P>Mimik_<art>` und `kfbMimik.posen` nehmen deshalb die Lid-Zuschläge und Mundformen aus FBs Tabelle (`faceMountActor` MIMIK). Die Lidhaut dazu ist im Spiel-Rig der jeweiligen Figur erzeugt und eingepasst.
  - Dafür bekommen die Lider vier Morphs mehr als r1: `oben_weit`, `unten_weit` (das Unterlid ist hier in Ruhe zu und kann weiter auf) sowie `oben_viertel`, `unten_viertel` (der Lidbogen zwischen Ruhe und halb ist nicht linear).
  - Größter Rest der Einpassung: zielen 1,9 / 2,3 mm bei 23 / 29 mm Ausschlag, alle anderen ≤ 1,1 mm.
  - kameraL/R haben hier keine Brauen und sehen deshalb wie Ruhe aus.
- **Blick:**
  - `kfbBlick` in den Extras: Steuerregel wie bisher, dazu Gesamtwinkel um die Hochachse ±0,5 rad (Spiel `augenR2.kappeBlick`).
  - Hunkys Gesichts-Leerlauf und Plapper-Schleife sind danach gekappt: Im Leerlauf trifft es 67 Bilder des linken Auges (bisher bis −0,525 rad).
  - Bei Dory greift die Kappe nie (Ruhe 0, Blick ≤ 0,42).
- **Gesichts-Leerlauf:** wie r1 (Einschübe smile, d, oh kurz, sonst Ruhe).

## Prüfung
- **Inhalt** (`data/r2/pruefung_*.json`): je 13 Mundknoten, 9 Lid-Morphs, 43 Clips (r1 30 + Plappern + 12 Mimik), Ruhe, Viseme, Blick-Kappe und Mimik in den Extras.
- **Bildpaare Spiel ↔ Web** (vorn / seitlich / Gesicht): Hunky 2,9 / 2,2 / 3,8, Dory 3,1 / 2,6 / 4,7. Das entspricht r1; die Abweichung kommt von der Kopfunterseite (Teil 3, figamb=2).
- **Blätter:** `blaetter/D3_hunky_r2.jpg`, `blaetter/D4_dory_r2.jpg`. Darauf alle 13 Mundformen nah, die Mimik-Vorgaben mit Lidwirkung, Plappern und Leerlauf, Spiel-Ruhe zum Vergleich.
- **Bilder:** `bilder_r2_jpg/`. Daten `data/r2/`, Skripte `scripts/r2/`.
