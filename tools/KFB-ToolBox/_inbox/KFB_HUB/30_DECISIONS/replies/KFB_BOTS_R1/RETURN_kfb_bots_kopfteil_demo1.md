# KFB Bots · Demo „Hunky und Dory auf den Bots“ · RETURN (WSB, 18.11.2026 spät)

**Auftrag:** Georg im Chat, als Experiment: Lord Hunkys und Lady Dorys bestehende Köpfe kommen unten abgerundet als Kopfersatz auf den X Bot (Hunky) und den Y Bot (Dory), passend skaliert an der Halskugel, die Bot-Köpfe werden weggenommen. Augenstiele und Antennen mit Dangle, KFB-Münder und die Augen in den Einfassungen bleiben. Der Kopf soll nicht zu groß sein, aber cartoonig.

## Geliefert
- `_privat_kauf_asset/KFB_q_xbot_hunky.demo1.glb` (10,6 MB, sha256 b0c78d1dc77470ee…) und `KFB_q_ybot_dory.demo1.glb` (10,8 MB, sha256 1c2ca186bd1d6449…).
  - **Körper:** Bot r1d (Verschleiß), Ecken mit Kopf-Gewicht > 0,5 entfernt. Halskugel, Skelett `mixamorig` und Clips Idle_A/Walking_B bleiben, die Gesichts-Anker der Bots sind entfernt.
  - **Kopf:** `MeshyModels/_alien_head_parts_r1/*_Head.part.glb` unverändert, als Knochen-Zweig unter `mixamorigHead`: `KFB_Kopfadapter` → `<Name>_Head` (Wurzel) → `head_part` → `eyestalk.l/r` bzw. `eyestalk.c`/`antenna.l/r`, Rollen erhalten. Anker `KFB_Eye_*`/`KFB_Mouth_anchor` an den Stielknochen.
  - **Halsschnitt unten abgerundet:** Die offene Schleife (Hunky 510 Ecken, Radius 0,22 L; Dory 315, 0,15 L) wird nach dem Verschweißen der Randecken (1e-5) mit einer Kuppel aus 6 Ringen geschlossen. Tiefe 0,45 bzw. 0,6 × Radius, Gewicht head_part, ein einheitlicher Texturpunkt vom Hinterkopf.
  - **Größe:** Kopfhöhe ohne Stiele ≈ 0,47–0,49 m (Hunky 0,50 m breit, Dory 0,46 m), Skala 0,49 bzw. 0,50 gegenüber dem Kopfteil-Rahmen. Die Kuppel steckt 2,5 cm in der Halskugel. Gesamthöhe ≈ 2,05 / 2,11 m (Bot 1,80 m).
  - **Kopf-Adapter:** Der Figuren-Lader setzt `node(root).position = headOffset` und `.scale = headScale` im Rahmen des Elternknotens. Der Adapter trägt die Skala k = Skala / headScale (Hunky 0,544, Dory 0,541), darum gelten Hunkys und Dorys Rezept-Tunables unverändert (headScale 0,9 / 0,925, headOffset). Augen, Sockel, Lidhaut und Mund kommen also ohne neue Werte aus dem Rezept.
- **Skripte:** `scripts/bot_kopfteil.py` (Blender 5.2.2) und `scripts/bot_kopfteil_buehne.mjs` (Bühnenlauf). Daten `data/kopfteil_*.demo1.json`, `data/kopfteil_demo1_buehne.json`.

## Geprüft
- **three.js:** Adapter-Skala, Wurzel-Lage = headOffset, Wurzel-Skala = headScale, beide Clips vorhanden, Kopf-Hülle in Weltmaß wie oben.
- **WS1s Abnahme-Bühne** (vfx-buehne @a9432e0f, Spiel-Look, Knete gebacken), nur per Routing:
  - Der Bot-Platz bekommt die Karten-Optionen von lord_hunky / lady_dory (headpartActor über figureCard, Variante e2-edge80) und als Clip-Datei das Bot-GLB (Mixamo Idle_A).
  - Die sha256 der Varianten werden gegen die Demo-Körper getauscht, die Varianten-Körper von raw.githubusercontent auf die Demo-GLBs umgeleitet.
  - **Ergebnis:** beide Darsteller „OK“ (Kartenprüfung bestanden), 0 Seitenfehler. Augen in den Sockeln, Lidhaut, Mund, Stiele und Antennen sind da, die Körper spielen Mixamo Idle_A.
- **Belege** `belege/kopfteil_demo1/`: Figur ±30°, Gesicht 0° und ±35° je Figur.
- **Nicht geprüft:** Dangle in Bewegung (nur Standbilder), Gehen (headpartActor kennt keine Clip-Bibliothek), Kampf-Clips.

## Für einen echten Einbau (WS1/WS0)
1. **Figuren-Variante** `kfb.figure-variant/1` je Figur (base lord_hunky / lady_dory, body.glb = Demo-GLB nach dem Push, mit sha256). Das ist der vorgesehene Weg, nur der Körper wird getauscht.
2. **headpartActor:** Clips aus dem Körper-GLB bzw. der Bot-Bibliothek (Mixamo) statt `Rig_Medium_General.glb`, wenn der Körper `mixamorig` hat, dazu `clipsDazu`/`spiele` wie faceMountGlbActor, damit Gehen und Bibliothek laufen.
3. Ob das Größenverhältnis passt, entscheidet Georg. Die Skala ist ein Zahlenwert im Skript (Adapter) bzw. headScale im Rezept.
