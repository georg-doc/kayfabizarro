# KFB Bots · Verschleiß-Look r1d · RETURN (WSB, 18.11.2026 spät)

**Auftrag:** Georg im Chat an WSB. Gewünscht ist ein Decal-Look für beide Bots: abgenutzt, mit Schmauchspuren und Kratzern, wie ein ramponierter Droide, aber ohne Chromglanz. Die Bots sollen wie abgenutztes Hartgummispielzeug im Claymation-Look wirken, mit körnigerer, deutlich sichtbarer Knet-Textur. Quittung im Kanal (101).
**Stand:** Basis Face-mount r1c. Keine Spieldatei geändert, Knet-Kanon unverändert.

## Denkmodell
Hartgummi nutzt sich so ab:
- Kanten und Ecken werden blass gerieben.
- Kratzer schaben hell (Gummi weißt beim Ritzen) und liegen leicht vertieft.
- Dreck sitzt in Gelenken und Falten.
- Schmauch liegt matt und pudrig in Flecken: an der Schusshand und am rechten Unterarm (links schwächer), auf der Brust (Treffer) und verstreut.
- Darüber kommt feine Knet-Körnung mit kleinen Daumendrücken.
- Alles bleibt matt, Metall 0.

## Geliefert
- `_privat_kauf_asset/KFB_q_xbot_facemount.r1d.glb` (7,7 MB) und `KFB_q_ybot_facemount.r1d.glb` (7,7 MB).
  - Je Mesh drei Texturen, alle JPEG: Farbe, Rauheit (im G-Kanal) und Normale. Körper 2048², Gelenke 1024².
  - **Neue, überlappungsfreie UVs:** Die Mixamo-UVs überlappen (Gelenke 44-fach), deshalb Smart UV mit dichter Packung. Netz, Gewichte, Skelett (65 Knochen), Clips `Idle_A`/`Walking_B`, die fünf Gesichts-Anker, Maßstab 1 und die Drehung sind unverändert wie r1c (geprüft am glTF).
  - **Mehr Ecken:** Die UV-Nähte erhöhen die Eckenzahl um etwa 28 % (X 35 434 → 45 230, Y 28 374 → 37 717), die Dreiecke bleiben gleich.
- **Skripte:**
  - `scripts/bot_verschleiss.py`: Blender 5.2.2, Cycles-Bake aus prozeduralen Knoten, Seed X 101 / Y 202.
  - `scripts/bot_verschleiss_buehne.mjs`: Bühnenprüfung vorher/nachher.
- **Daten:** `data/q_xbot_verschleiss.r1d.json`, `data/q_ybot_verschleiss.r1d.json`, `data/q_bots_verschleiss_buehne.r1d.json`.

## Geprüft
- **WS1s Abnahme-Bühne** (`tools/vfx-buehne` @a9432e0f, Platz Bots, lokale Hülle wie beim Interaktions-Lauf).
  - Tausch r1c → r1d nur per Playwright-Routing (GLB und gepacktes `.glb.json`).
  - Beide Darsteller „OK“, Knete gebacken (claySSOT bake), 0 Seitenfehler.
- **Wie die Knete die Texturen nimmt:** applyClay übernimmt `map`, `normalMap` (× srcNormalK 0,5) und `roughnessMap`. Die Rauheit bleibt dabei über 0,72, Metall wird auf 0 gesetzt. Der Knet-Bake nutzt seinen eigenen Atlas (`clayUv`) und stört die neuen UVs nicht.
- **Belege** in `belege/verschleiss_r1d/`: `BOTS_verschleiss_vorher_nachher.jpg` sowie Einzelbilder vorher/nachher (Figur, Gesicht 0/±35°).
- **Bild:**
  - Nah ist die Knet-Körnung deutlich und grob genarbt, die Kratzer sind fein und hell, alles bleibt matt, kein Glanz.
  - X Bot zeigt Schmauch an den Händen, Knien und der Brust.
  - Y Bot hat weniger Schmauch vorn, mehr am Rücken, Oberschenkel und linken Unterarm (Seed).
  - Die senkrechte Kante an Y Bots Wange stammt aus dem Mixamo-Netz und war schon in r1c.
- **Iterationen** (Probe im Temp-Ordner):
  - r1d-1: Kratzer als Zickzack-Netz, zu weiß; Schmauch kaum sichtbar.
  - r1d-2: Kratzer zu kurz, alle waagrecht. Ursache: Das Mapping skaliert vor dem Drehen, das ist jetzt in zwei Schritten getrennt.
  - r1d-3: geliefert.

## Für WS1 (Einbau)
- `src/actors/botCast.js` zeigt auf r1c (Glob, REV, BLOB). Für den Verschleiß-Look den Pfad auf `KFB_q_*bot_facemount.r1d.glb` stellen, die Blobs stehen nach dem Push in assets/private.
  - Ob r1d Standard wird oder ein Schalter (sauber/abgenutzt), entscheidet Georg/WS0.
- **Größe:** 7,7 MB statt 2,6 MB je Bot, wegen der Texturen. Wenn das zu viel ist, gehen die Gelenk-Texturen auf 512² (spart wenig) oder der Körper auf 1024² (Korn wird gröber).
- **Augen, Mund, Brauen:** unverändert, da sie über face-mount kommen (Start-Eintrag `toolbox/q_*bot.kfb-pets.json`).

## Offen
- Georgs Urteil zum Grad: mehr oder weniger Schmauch, Kratzer, Korn. Die Werte stehen oben im Skript, ein neuer Bake dauert etwa 2 Minuten je Bot.
- Löschliste: Bühnenbau `~/.kfb_tmp/vfxbuehne_bots_r3` (204 MB) und ungetracktes Prüfskript in ohren, nur mit Georgs Ja.
