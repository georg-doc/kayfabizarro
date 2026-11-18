# Dieselpunk-Cabrio „Skyline“ R1a · Modell, Anker, Fahrzeug-Entwurf · RETURN (WSB, 19.11.2026)

**Auftrag:** Georg im Chat, Prio 1 seiner Meshy-Jobs (`MeshyModels/KFB Meshy WSB jobs/Meshy_AI_FC2_Skyline_…_texture.glb`).
- Cabrio für uns anpassen und das Mesh optimieren.
- FrizzleBob als Fahrer einpassen (Sitzkante, Füße in Sneakern an den Pedalen, Lenkrad bei Bedarf länger), dazu orc_brute.
- Ein- und Aussteige-Clip mit Nachfedern, Fahrdynamik mit Cartoon-Deformern und weichen Ohren.
- Anker für Scheinwerfer, Antriebsdüsen hinten und Bremslichter (wie bei WSA Racers Dieselpunk-Racern).
- Seitenbemalung zuerst abschaltbar, später ein abgegriffenes KFB-Logo auf beiden Seiten (Georg liefert ggf. ein PNG).
- Ziel: Standardfahrzeug, weil man die Figur sieht.

## Stufe 1 (dieses RETURN)
- **Modell** `_privat_meshy/KFB_Cabrio_Skyline.r1a.glb` (6,8 MB), Skript `scripts/cabrio_bau.py`, Bericht `data/cabrio_bau.r1a.json`.
  - 1 069 967 → 100 000 Dreiecke (Decimate), Texturen 2048² als WebP 85.
  - Front (Roh −X) auf glTF +Z, links = +X wie die Racer.
  - Länge wie die Racer: Halblänge 4,04 u, Maßstab 4,27 auf das Roh-Modell. Unterkante 0,1 u über dem Boden, Box c (0, 1,33, 0), h (2,41, 1,23, 4,04).
- **Anker** (Knoten im GLB, Lage aus den Ansichten, am Netz nachgeschärft):
  - `KFB_Headlight_L/R` (große Rundscheinwerfer), `KFB_Foglight_L/R` (Stoßstangen-Leuchten);
  - `KFB_Brake_L/R/C` (Flossenenden und Mitte);
  - `KFB_Thrust_Exhaust` (Dreier-Auspuff hinten unten, Richtung −Z);
  - `KFB_Hover_FL/FR/RL/RR` (Unterseite der vier Turbinen-Gondeln).
  - Belege `belege/r1a_anker_*.png` (gelb Licht, rot Bremse, blau Düse, grün Schwebe).
- **Bremslichter:** 789 Flächen mit Rotanteil an den Rücklichtern tragen das Material `brake_light`. Das kennt `patch-car-model` und lässt es beim Bremsen rot leuchten.
- **Fahrzeug-Entwurf** `data/cabrio_skyline.kfb-vehicle.r1a.json` im Format von `kfb-vehicle-rig.r1.json`: box, hover, cam wie rustwing_cruiser, glow, thrust-Anker, headlights, brakeLights, Klasse racer. `driver` ist noch leer.
- **Bild** (Workbench, Lage- und Formprüfung, nicht Spiel-Look): `belege/r1a_schraeg.png`, `r1a_seite.png`, Vergleich `roh_meshy_schraeg.png`.

## Nächste Stufen
1. **Sitz und Fahrer** wie TUB_R6:
   - Sitzpunkt auf der Fahrerbank (links), Lenkrad-Mitte und -Neigung, Pedale;
   - FrizzleBob (Medium) und orc_brute (Large) mit `kfb_cabrio_drive_ik` (Fahr-Clip as-is, Wurzel, Arme per IK);
   - Lenkrad bei Bedarf länger (Säule), Füße an den Pedalen.
2. **Einsteigen und Aussteigen** wie TUB r7 (`kfb_cabrio_enter` / `kfb_cabrio_exit`: Bogen, Landung im Sitz, Nachfedern des Autos als eigene Spur), Medium und Large.
3. **Seitenbemalung:** Textur-Variante ohne Schriftzug, Sterne und Totenkopf (übermalt mit der Lackschicht daneben), danach das KFB-Logo beidseitig, gespiegelt, abgegriffen.
4. **Prüfung im Spiel** (`racer=` über den Fahrzeug-Eintrag, Routing). Fahrdynamik, Deformer und Ohren sind WS1, VFX an den Ankern WS1/WSV (Kanal 110).

## R1b (Georg 19.11.): Anmutung wie die anderen Dieselpunk-Racer, Oldtimer-Farben
- **Georg:** Teils gröber als die anderen Modelle. Ramponierung, leichte Verformungen und kleine Netzfehler sind verzeihlich. Er möchte eine bessere Farbkombination mit Oldtimer-Charakter, gern als Farbvariante für den Spieler. Fenster, Chrom und Material sollen wie bei den anderen Dieselpunk-Gefährten aussehen (gleiche Modellserie).
- **Befunde:**
  - Die Racer sind ebenfalls ein Meshy-Netz mit etwa 100k Dreiecken, ein Material, Texturen 2048/1024/2048.
  - Im Spiel macht `src/look/vehicleLook.js` den gemeinsamen Look für alle Racer: Metall × 0,35, Rauheit ≥ 0,5, Himmel-Boden-Spiegelung, Grundhelligkeit angeglichen, Heldenfarbe als Spieler-Einstellung. Das Cabrio bekommt diesen Look automatisch, sobald es wie ein Racer geladen wird (es hat Grund-, Normalen- und Metall-Rauheits-Karte).
  - Meine Bilder in R1a waren Blender-Vorschauen ohne diesen Look.
  - Das Gröbere kam aus Meshys Normalenkarte: Sie gehört zum 1-Mio-Netz und passt nicht zum reduzierten.
- **Normalen neu:** `_privat_meshy/KFB_Cabrio_Skyline.r1b.glb`, Normalenkarte vom 1-Mio-Netz auf das 100k-Netz gebacken (Cycles, selected to active, 2048²). Vergleich `belege/normale_vorher_r1a.png` / `normale_nachher_r1b.png`: Haube, Tür und Kotflügel sind ruhiger. Skript `scripts/cabrio_bau.py` (neuer Schalter normal_neu).
- **Farbvarianten** (`scripts/cabrio_farben.py`, Weg wie V-945, nur das Grundfarb-Bild wechselt):
  - Je Texel werden Lage und Richtung gebacken.
  - **Seitenbemalung aus:** heller, unbunter Schriftzug, Sterne und Totenkopf auf den Seitenflächen zwischen den Gondeln, aus der umgebenden Lackschicht aufgefüllt (59 573 Texel). Wirkt übermalt, wie Georg es zulässt.
  - **Zweifarbig im Oldtimer-Stil:** über der Gürtellinie (1,52 u) Creme oder Weiß, darunter die Farbe. Der Helligkeitsverlauf bleibt (Kratzer, Schmutz, Ränder). Chrom (Stoßstangen, Scheibenrahmen), Scheiben, Sitze, Rost, Gondeln und Unterboden bleiben.
  - Varianten in `_privat_meshy/farben_r1b/`: **Mint/Creme**, **Kirschrot/Creme**, **Himmelblau/Weiß**, **Grau ohne Schriftzug**; Original r1b mit Schriftzug. Bogen `belege/Cabrio_Farbbogen_r1b.png` (Blender-Licht, nicht Spiel-Look).
- **Für WS1:**
  - Fahrzeug-Eintrag `data/cabrio_skyline.kfb-vehicle.r1b.json` mit Farbliste.
  - Standardfarbe nach Georgs Wahl.
  - Die übrigen als Farbwahl, z. B. neben der Heldenfarbe, mit Grundbild-Tausch wie `virtual:kfb-v945`.
