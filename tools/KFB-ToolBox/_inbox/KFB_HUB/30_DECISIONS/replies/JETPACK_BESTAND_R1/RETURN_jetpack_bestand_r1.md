# Jetpack-Bestand R1 · Bau · RETURN (WSB, 17.11.2026)

**Auftrag:** Georg im Chat bei WSB am 17.11., Bau freigegeben von WS0 nach dem Befund (`BEFUND_jetpack_bestand_r1.md` §4).
Teile:
- Düsenstrahl richtig;
- echter Schwebe-Loop;
- Manöver mit Cartoon-Dehnung;
- Ohren folgen der Flugphysik;
- mit und ohne Waffe;
- Rauch;
- Ton-Liste.

**Spielcode:** nicht angefasst. Was im Code nachzuziehen ist, steht unten unter „Für WS0“.

## 1 · Düsen-Anker (Strahl nach unten)
Neue Dateien in `glb/`. Die alten bleiben unverändert.
- `KFB_Jetpack_Diesel_gross.r2.duese.glb` (Standard)
- `KFB_Jetpack_Rocket_gross.r7.duese.glb`
- `KFB_Jetpack_Twin.r1c.glb`

In allen drei zeigt +Z der Düsen-Anker jetzt entlang der Glockenachse aus der Öffnung, also nach unten im Pack-Raum. Die Glockenachse ist aus der Geometrie gemessen (`scripts/glocke.mjs`). Lage, Netze und Materialien sind unverändert (geprüft: gleiche Netz-, Vertex-, Material- und Knotenzahl).

Welt mit dem Sitz fb-broad, Haltung aus dem Clip (`data/schub_r2.json`):

| | vorher | nachher |
|---|---|---|
| Schweben | (0; 0,30; −0,95), schräg nach hinten oben | (0,03; −0,95; −0,30), nach unten |
| Boost | (0; 0,89; −0,45), über den Kopf | (0; −0,45; −0,89), nach hinten unten |

- Beleg: `belege/JETPACK_BESTAND_R1_duese_vorher_nachher.jpg`.
- Details und sha256: `data/duese_r1.json`.

Der Rauch (`dustTrail.createThrustSmoke`) nimmt in `jetpack.js` dieselbe Anker-Richtung (+Z, Z. 117) und folgt damit ohne Änderung.

## 2 · Flug-Clips r2 (neu, Namen `jet_*`)
Dateien in `_privat_kauf_asset/`:
- `KFB_JetFlight.r2c.RigMedium.glb`: 17 Clips;
- `KFB_JetFlight.r2c.RigLarge.glb`: 9 Clips, ohne Waffe, weil das Spiel für Large keine Waffen-Haltung hat;
- Liste: `clips.r2c.Rig*.json`.

Gebaut mit `scripts/flug_r2.mjs`. Behälter ist das Skelett und die Puppe aus `KFB_Flight.r1h`. Die Posen sind Drehungen je Knochen in Körperachsen. Die Wurzel bleibt still, nur `hips` wippt.

| Clip | Art | Inhalt |
|---|---|---|
| `jet_hover` | Schleife 2 s | Wippen; Beine gegeneinander versetzt (rechts 0,6 π später); Knie und Füße schwingen nach; Arme locker abgespreizt mit Verzögerung; Dehnung ±2,5 % |
| `jet_cruise` | Schleife 2 s | Beine hängen vor dem Strahl, Scherenschlag gegenphasig; Brust offen, Kopf hoch |
| `jet_boost` | Schleife 1 s | gestreckt 1,06–1,08; Beine geschlossen entlang der Körperachse; Schub-Zittern |
| `jet_dive` | Schleife 2 s | Kopf voraus, Rücken hohl, gestreckt 1,03–1,05 |
| `jet_bank_left` / `_right` | Schleife 2 s | in die Kurve gebogen; Kopf schaut hinein; inneres Bein stärker angewinkelt; Außenarm balanciert. Rechts ist der Spiegel von links. |
| `jet_roll` | Schleife 1 s | Hocke, gestaucht 0,89–0,91. Die Fassrolle selbst dreht das Spiel (FLY_KIN). |
| `jet_brake` | einmal 1,2 s | Extreme: Ausholen 0,12 s, Bremsen 0,34 s (Beine nach vorn gerissen, Arme vor, Stauchung 0,9), Überschwingen 0,72 s, Ende = Schwebe-Pose |
| `jet_land_prepare` | einmal 1,0 s | Ausholen 0,3 s, landebereit 0,75 s (Beine gestreckt, Arme zur Balance, Blick nach unten) |
| `*_waffe` (Medium) | wie oben | `chest` und Arme aus Kit `Ranged_2H_Aiming` (Bild 0), Rest wie ohne Waffe |

Weitere Eigenschaften:
- **Kartoon-Dehnung:** `spine` skaliert volumentreu, der Kopf ist gegenskaliert und bleibt fest.
- **Schleifen:** aus ganzzahligen Harmonischen gebaut, die Naht ist exakt (letztes Bild = erstes).
- **Ohren:** keine Spuren im Clip, die Laufzeit-Federn bleiben zuständig.

## 3 · Arm-Gate an FB
Werkzeug: `scripts/gate_r2.mjs` mit `arm-gate.v1`.

Messung vorher:
- Die Kit-Armwinkel stecken bei FB 6–14 cm im Rumpf. FB ist breiter als die Kit-Puppe.
- Zum Vergleich FBs eigene Clips: `Idle_A` 2,5 cm, `kfb_idle_happy_a` 3,8 cm, das heutige `flight_idle_hover` 7,0 cm (`data/gate_fb_referenz.json`).

Korrektur:
- Je Clip und Seite die kleinste Öffnung der Oberarme nach außen, bis kein Bild tiefer steckt als FBs `Idle_A` (Grenze 1,46 % der Höhe).
- Ergebnis (`data/arm_korr_r2.json`): Schweben 32°, Reiseflug 44°, Boost 48°, Sturz 36°, Kurve innen 52° / außen 12°, Rolle 4°, Bremsen 44°, Landen 32°.
- Eingebacken in r2c. Für Large übernommen, dort nicht gemessen.

Gate r2c (`data/gate_r2c.json`):
- Alle 9 Clips ohne Waffe PASS, höchstens 2,5 cm.
- Die Waffen-Varianten stecken 3,9–4,1 cm. Das ist die unveränderte Kit-Gewehrhaltung, die das Spiel heute im Flug schon so überblendet. Nicht korrigiert.

## 4 · Ohren im Flug
Werkzeug: `scripts/ohren_r2.mjs`. Es nutzt die Ohren-Federung des Spiels (`ear-dangle.v1` und `fb-default.ear-rig.json`, Kopien in `stage/vendor_spiel/`) mit dem Wind wie in faceMountActor und jetpack.js (Deckel 45).

Ablauf: Schweben, Reiseflug 10 m/s, Boost 20 m/s, Bremsen in 0,5 s, Schweben.

| Ohrspitze gegen den Kopf | scale 1 (heute) | scale 8 (`#flugohren=r1`) |
|---|---|---|
| Schweben | 0,5–7° | 0,5–7° |
| Reiseflug | 8° nach hinten | 32° |
| Boost | 35° | 64° |
| Bremsen | nach vorn geschleudert bis 57° (bei 3,8 s), dann zurück | 39° |

Bewertung:
- Die Ohren folgen schon heute der Flugphysik.
- Bei Reisetempo und scale 1 ist das schwach.
- `belege/JETPACK_BESTAND_R1_ohren_flug.jpg`: oben scale 1, unten scale 8.

## 5 · Ton-Liste
`data/tonliste_r2.md`: je Zustand, was heute läuft, was im Bestand liegt (z. B. `F3_wind_rush_loop`, `fly.jet.stop`) und was neu fehlt (Schwebe-Tuckern, Boost-Aufheulen, Sturz-Pfeifen, Kurven-Wusch, Rollen-Wirbel, Gegenschub). Einmal-Zeitpunkte stehen in `extreme_s`.

## 6 · Blinder Kritiker (ein Lauf, nur Bilder)
Gesamturteil: **REWORK**, beschränkt auf `roll` und `bank_right`. Die anderen 7 Clips PASS.

Meine Prüfung der beiden REWORK-Punkte:
- **`bank_right`:** Der Kritiker sah keine Seitenneigung. Das kam vom schrägen Kamerawinkel. Genau von vorn und von hinten sind links und rechts saubere Spiegelbilder (`belege/JETPACK_BESTAND_R1_kurven_frontal.jpg`). Keine Änderung.
- **`roll`, „keine Drehung“:** gewollt. Die Fassrolle dreht `m1-locoActor` (FLY_KIN), der Clip liefert nur die Hocke.
- **`roll`, „loser roter Ring“:** Das ist der Ring des unveränderten Düsen-Effekts im Strahl, kein Pack-Teil. Er ist auch in den Vorher-Bildern zu sehen. Hinweis an WS0.

Offene Hinweise des Kritikers (nicht umgesetzt):
- Sturz: Füße streifen den Strahlrand.
- Bremsen: Oberkörper im Extrem stärker zurück; im Spiel kommt FLY_KIN dazu.
- Landen: Beine strecken sich zu wenig zum Boden.
- Boost: Ohren klumpen bei scale 8 auf dem Kopf.

## Für WS0 (Code gehört WS0)
1. **Düsen:** Verträge Diesel, Rocket und Twin auf die neuen glb zeigen lassen (`data/duese_r1.json`). `jetpack.js` kann bei `dir [0,0,1]` bleiben.
2. **Clips:** Paket `KFB_JetFlight.r2c.Rig*.glb` laden, z. B. FLIGHT_URLS um den Glob erweitern, und FLY_CLIPS umstellen: hover `jet_hover`, glide `jet_cruise`, boost `jet_boost`, dive `jet_dive`, stall `jet_brake`, bankL/R `jet_bank_left/right`, land `jet_land_prepare`, roll `jet_roll`. FLY_ONCE um `jet_brake` und `jet_land_prepare` ergänzen.
   - FB trägt eigene `flight_*`-Clips; deshalb neue Namen, eingebettete Clips gewinnen in `need()`.
3. **Waffe:** Ohne Waffe den Oberkörper-Overlay (Ranged_2H_Aiming, upperShare 0,95) im Flug ausschalten, sonst bleiben die Arme in Gewehrhaltung. Mit Waffe entweder wie heute überblenden oder die `*_waffe`-Clips direkt spielen.
4. **Ohren:** Vorschlag `FLUG_OHREN` an (scale 8) als Flug-Standard. Am Boost auf Klumpen achten.
5. **Effekt:** Ring im Düsenstrahl prüfen (`kfb-flight-vfx`). Er sitzt bei hohem Schub sichtbar unter der Düse.
6. **Ton:** Liste in `data/tonliste_r2.md`.

## Ablage
- Skripte: `scripts/` (anker_r1, glocke, schub_r2, flug_r2, vorschau_r2, film_r2, gate_r2, ohren_r2).
- Bühnen-Kopien: `stage/` (arm-gate.v1.js, kfb-flight-vfx.js, vendor_spiel/).
- Belege: `belege/` mit drei Clip-Bögen, Waffen-Bogen, Kurven frontal und bewegten Vorschauen `belege/clips_r2c/*.webp` (Schweben, Boost, Kurve, Bremsen).
- Löschliste: Zwischenstände r2 und r2b sind eingetragen.
