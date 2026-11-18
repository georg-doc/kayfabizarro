# FB-Testoutfit „Spy weiß“ R1 · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0 18.11. (4), Georg. Vorgabe: FB im Spy-Anzug mit cremeweißem Jackett, roter Fliege, schwarzer Hose, Sneaker r1c ohne Socken und weißem Stummelschwanz. Korrektur: die fertige KayKit-Spy-Textur nutzen, nichts neu modellieren, nicht umfärben.

## Lieferung
- **Körper:** `_privat_kauf_asset/Suit_Spy_weiss.r1.glb` (175 KB).
  - KayKit Spy mit Textur B des Pakets (`spy_texture_B.png`: weißes Jackett, dunkle Hose, rotes Einstecktuch).
  - Aufbau wie Ranger/Mech: `Rig_Medium` + `Spy_Body`, `Spy_ArmLeft`, `Spy_ArmRight`, `Spy_LegLeft`, `Spy_LegRight`.
  - **Für `FB_KOERPER`:** `spy: { prefix: 'Spy_', extra: [], fell: true }`. Die Hände des Anzugs färbt `handFell` in FB-Fell.
  - Kopf (`Spy_Head`) und Hilfskugel entfernt.
  - Die Schuhe sind aus den Beinen entfernt (Zelle „Shoes“, je 474 Flächen); FB trägt die Sneaker.
- **Fliege:** In Textur B liegt die Fliege in der schwarzen Zelle „Bowtie + Buttons“. Nur die 238 Fliegen-Flächen (oberste Gruppe dieser Zelle, am Kragen) zeigen jetzt mit ihrer UV auf die rote Zelle „Pocket Square“, bei gleicher Lage in der Zelle. Die 82 Knopf-Flächen bleiben schwarz; die Textur ist unverändert.
- **Sneaker:** `glb/KFB_Sneaker_FB.r1c_fellknoechel.glb`, aus `KFB_Sneaker_FB.r1c.glb`.
  - Die Zonen `KFB_Sneaker_Socke` (220 Flächen) und `KFB_Sneaker_Sockenrand` (56) sind eigene Schalen ohne gemeinsame Kanten mit dem Schuh. Auch der Schuhkragen hat keinen durchgehenden Rand (mehrere Schalen). Löschen ließe darum ein offenes Loch in den Schuh, und ein sauberes Schließen ginge nur mit neuer Geometrie.
  - **Darum:** Die Socken-Röhre bleibt und trägt jetzt FB-Fell (Material `KFB_Sneaker_Knoechel`, FB_Yellow der FB-Vorlage). Sichtbar ist kein Sockenstoff mehr, sondern der Fell-Knöchel. Er schließt den Kragen und läuft unter die Hose.
  - Rig, Knoten `KFB_Sneaker_FB`, Sohle, Obermaterial und Akzent sind unverändert.
- **Schwanz und Ohren:** unverändert aus dem Spiel. Die Kanon-Wache (`fbKanonPruefen`) besteht: linkes Ohr A11, rechtes Ohr, `KFB_Tail_Bunny` sichtbar.

## Prüfung im Spiel (Stamm @ef112201, Kampfbühne)
- **Einbau nur per Routing**, genau so, wie WS0 es einbauen will:
  - `garderobe.js`: `URLS.spy`.
  - `fbAddons.js`: `FB_KOERPER.spy`, `SNEAKER_URL` auf die Fell-Knöchel-Datei.
  - `faceMountActor.js`: Sneaker auch mit Anzug, also ohne `&& !options.anzugUrl`.
  - Schalter `koerper=spy,sneaker=r1`.
- **Ergebnis:** `FB_ADDONS.anzug` ok (5 Teile), `FB_ADDONS.sneaker` ok, `FB_ADDONS.tail` ok.
- **Belege:** `belegAbnahme`, motiv `fb`.
  - `belege/spy_r1_beleg_figur_{0,60,150}.png` (vorn, schräg, von hinten mit Schwanz).
  - `belege/spy_r1_beleg_gesicht_{0,35}.png`.
  - Protokoll in `belege/beleg.json`.
- **Gesehen:** Jackett weiß mit roter Fliege und rotem Einstecktuch, schwarze Knöpfe, Hose dunkel. Hände in FB-Fell, Sneaker weiß/rot, der weiße Schwanz hinten am Jackett. Kopf, Augen und Mund unverändert.
- **A6 Handgelenk-Dreiecke:** Die Regel steckt schon in `fbAddons.handFell` (eine Hand-Ecke mit Gewicht > 0,5 macht das Dreieck zu Fell). Mit `fell: true` greift sie auch für Spy; dafür ist nichts zu ändern.

## Dateien
- `scripts/spy_weiss_bauen.py`: Körper (Blender, Hintergrund), Bericht `data/spy_weiss_bau.r1.json`.
- `scripts/sneaker_fellknoechel.py`: Sneaker, Bericht `data/sneaker_fellknoechel.r1.json`.
- `scripts/_wsb-spy-beleg.mjs`: Routing und Belege.
- Nicht geliefert: die Zwischenstände `glb/KFB_Sneaker_FB.r1c_ohnesocke*.glb` (Versuche mit Kappe, verworfen) und `scripts/sneaker_ohne_socke.py`.

## Offen
- Soll der Knöchel unter der Hose sichtbarer werden (z. B. im Spiel kürzere Hose), kann der Sneaker so bleiben.
- Soll statt des Fell-Knöchels wirklich gar nichts über dem Schuh sein: Dafür bräuchte der Schuh einen geschlossenen Kragen (neue Geometrie), nur nach Georgs Ja.
