# KFB Bots · Gesicht r3 · RETURN (WSB, 18.11.2026 spät)

**Auftrag:** Georg im Chat, Korrektur zu r2/r2b:
- Die Brauen sitzen direkt auf den Lidern. Sie sollen cartoonig höher sitzen und frei schweben, das gilt für beide.
- Augen und Lider stehen zu weit aus dem Kopf. Die innere Lidnaht soll klein sein, die Pupillen dürfen bei normalem Blick nicht im Kopf oder in den Lidern verschwinden.
- Die Tube-Brauen von Y Bot sind innen hart abgeschnitten. Stattdessen bekommt sie dieselben Blockbrauen, nur schlanker.
- Die Lider sollen dasselbe Material wie der Kopf haben, nur etwas dunkler.

## Geliefert
- **Körper r1f** (`_privat_kauf_asset/KFB_q_{x,y}bot_facemount.r1f.glb`): r1d (Verschleiß) plus Blockbrauen `Carl_Brow_L/R` aus FB_TEMPLATE_LOOK_v5b.
  - 2,2 cm über dem Anker, 1,2 cm frei vor der Stirn, Maßstab 1,5 × Ankerabstand.
  - X Bot volle Größe, Y Bot volle Länge mit 65 % Höhe.
  - Skript `scripts/bot_blockbrauen.py` (neu: hoch, frei, breite, dicke), Berichte `data/q_*bot_blockbrauen.r1f.json`.
- **Start-Einträge** `toolbox/q_*bot.kfb-pets.json` (meta.r3):
  - eye.inset 0,2;
  - parts.brows = original (Blockbrauen), parts.mouth = off;
  - Y Bot lids.l −0,4 → −0,2;
  - source.glb → r1f.
- r1e ist damit überholt.

## Geprüft
- **Bühne:** WS1s Abnahme-Bühne, Körper r1f per Routing, Eintragswerte per Routing im Bühnen-Bündel. Beide OK, 0 Fehler.
- **Tiefe:** 0,15 und 0,25 verglichen (`belege/gesicht_r3/BOTS_tiefe_015_025.jpg`), geliefert 0,2.
  - X Bot: Lider liegen eng an, die Pupillen bleiben sichtbar.
  - Y Bot: Mit tieferem Auge steht das weit offene Unterlid vom Augapfel ab. Mit l −0,2 ist das kleiner, aber nicht ganz weg. Feinabstimmung im Studio.
- **Belege** `belege/gesicht_r3/`: X/Y 0° und ±35°.

## Nicht im Eintrag lösbar (an WS0, Kanal 106)
- **Lid-Material:** Die Lider (`kfb-clay-lid`) sind eine Kopie des schlichten EyeRig-Lidmaterials. Die Spiel-Knete überspringt sie absichtlich (claySSOT `SKIP_DEFAULT` enthält „lid“). Darum haben sie nicht die Körnung des Kopfes. Gleiches Material wie der Kopf, nur dunkler, braucht eine Kanon- oder Code-Änderung.
- **Pupillen:** siehe r2b. Der Klarlack des EyeRig spiegelt den Himmel.
