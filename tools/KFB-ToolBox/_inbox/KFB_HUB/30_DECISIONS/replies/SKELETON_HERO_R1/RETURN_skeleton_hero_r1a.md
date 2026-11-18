# skeleton_hero R1a · erstes Bild · RETURN (WSB, 19.11.2026)

**Auftrag:** WS0 an WSB (Kanal 103/108): skeleton_hero, ein neutraler, popkultureller Skelett-Charakter. Er soll als verstorbene Figur spielbar sein wie FrizzleBob, mit Locomotion, Kampf und Speedrun. WSB baut Modell und Karte, zuerst ein Bild für Georg über WS0. Vorläufige ID skeleton_hero.

## Gebaut
- `glb/KFB_skeleton_hero.r1a.glb`, Skript `scripts/skelett_held.py` (Blender 5.2.2), Bericht `data/skeleton_hero.r1a.json`.
- **Basis:** KayKit Skeleton_Minion (`src/assets/actors/cast/Skeleton_Minion.glb`, Rig_Medium, 23 Knochen wie FB), ohne `Skeleton_Minion_Cloak` und ohne die Glühaugen `Skeleton_Minion_Eyes`. Die KFB-Augen kommen über das vorhandene Augen-Profil `skeleton-minion`.
- **Sneaker:** FBs Sneaker R1c (`SIEBENMEILEN_R1/glb_r1c/KFB_Sneaker_FB.r1c.glb`, mit Socke). Seine Knochen liegen auf den Millimeter genau wie Fuß, Zehen und Unterschenkel von Rig_Medium.
  - Die Gruppen wurden auf die Rig_Medium-Namen umbenannt (`footl` → `foot.l` usw.) und hängen am Skelett.
- Keine neue Geometrie, nur Zusammenbau.

## Bild (Spiel-Look)
- **Bühne:** WS1s Abnahme-Bühne (vfx-buehne @0b7d9921) per Routing. Der Bot-Platz q_xbot nimmt die Besetzung `KAYKIT('skeleton-minion')` (Augen-Profil, Rig_Medium-Clips Idle_A), der Körper wird auf das R1a-GLB umgeleitet.
- **Augen:** augenmatt-Werte zur Laufzeit gesetzt wie bei der Hunky/Dory-Demo.
- **Ergebnis:** Status OK, 0 Fehler, Höhe 2,04 m (Bühnenmaß). Belege `belege/skeleton_hero_*.jpg`.

## Offen (nach Georgs Blick)
- Karte, Dramatis-Personae-Eintrag, Spieler-Slot (WS1) und Prüfung mit FBs Clips (Locomotion, Kampf, Speedrun) auf der Kampfbühne.
- Ob die Hose und der Gürtel des Minion bleiben oder etwas Popkulturelles dazukommt (Shirt aus FBs Garderobe?), entscheidet Georg.

## Nachtrag (Georg, 19.11.): FB-Größe
- **Georg:** Das Skelett ist viel zu groß, es soll FB-Größe haben. Mit der Karten-Klasse wie FB (classScale) stand es auf der Bühne mit 2,04 m. FB steht mit 1,81 m, der Y Bot mit 1,79 m.
- **Probe:** Faktor 0,887 auf classScale ergibt 1,81 m (`data/skeleton_hero_buehne_fbgroesse.json`, Bild `belege/skeleton_hero_fbgroesse_figur_-30.jpg`).
- **Für die Karte (WS1/WS0):** skeleton_hero bekommt classScale = FB-Klasse × 0,887. Das GLB bleibt unverändert, weil das Skelett dasselbe Rig hat wie FB und die Clips gleich bleiben.
