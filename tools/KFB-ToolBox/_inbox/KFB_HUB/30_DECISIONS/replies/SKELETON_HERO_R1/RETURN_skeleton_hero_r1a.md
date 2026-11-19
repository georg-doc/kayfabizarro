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

## R1c (Georg 19.11., q782): FB-Größe im GLB, gleiches KayKit-Medium-Rig wie FB
- **Georg (q782):** „ich hatte wsb schon gesagt, dass der zu groß ist. bots=plastic soldiers. skeleton & FB -> kaykit medium rig“.
- **Der Vorschlag ×0,887 war falsch.** Er rechnete auf FBs 1,81 m mit Ohren. Das Skelett wäre damit weiter größer als FB gewesen.
- **Gemessen in den GLBs:**
  - FB ist dasselbe Rig_Medium wie das Skelett (Hüfte nativ 0,406 u), aber mit zwei Hüllen über dem Rig verkleinert: `FB_CANON` 0,6763 × `model` 0,9473 = 0,64069.
  - Das Skelett hatte keine Hülle, sein Rig war also 1,56-mal so groß wie FBs.
- **Neu:** `glb/KFB_skeleton_hero.r1b.glb` = r1a plus eine Hülle `KFB_skeleton_hero` mit genau FBs Maßstab 0,64069 (`scripts/skelett_huelle.py`, glTF-Ebene, sonst unverändert).
  - Kopf-Oberkante: Skelett 1,391 u, FB ohne Ohren 1,382 u.
  - Alle Knochenlängen sind gleich wie bei FB. FBs Clips (Fortbewegung, Kampf, Speedrun) passen 1:1, auch Schrittweite und Wurzelweg.
  - Für die Karte: dieselbe Klasse wie FB, **kein** Zusatzfaktor.
- **Bühne** (WS1-Abnahme-Bühne per Routing, Klasse wie bisher, Faktor 1):
  - Status OK, Höhe 1,31 m. FB misst dort 1,81 m mit Ohren, also etwa 1,33 m ohne Ohren. Der Y Bot misst 1,79 m.
  - Vergleich neben FB (FB nur fürs Bild neben den Bot-Platz gestellt): `belege/skeleton_hero_r1b_neben_fb_vorn.jpg`, `_hinten.jpg`, `_schraeg.jpg`; einzeln: `skeleton_hero_r1b_figur_-30.jpg`.
  - Skript `scripts/skelett_neben_fb.mjs`, Messwerte `data/skeleton_hero_buehne.r1b.json`.
- **Augen:** Das Profil `skeleton-minion` sitzt am Kopfknochen und skaliert mit, die Augen sind im Bild stimmig.
- **Bots = Plastik-Soldaten:** zur Kenntnis genommen, an den Bot-Köpfen ändere ich nichts ohne Auftrag.
- **Offen:** Karte und Spieler-Slot (WS1), Prüfung mit FBs Clips auf der Kampfbühne.
- **Löschliste:** `data/skeleton_hero_buehne_fbgroesse.json` und `belege/skeleton_hero_fbgroesse_figur_-30.jpg` (verworfener Faktor 0,887).
