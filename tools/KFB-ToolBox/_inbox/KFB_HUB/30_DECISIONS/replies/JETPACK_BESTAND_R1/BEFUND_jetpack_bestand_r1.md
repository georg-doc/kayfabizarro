# Jetpack-Bestand R1 · Schritt (a): Befundblatt ohne Änderungen (WSB, 17.11.2026)

**Anlass:** Georg im Chat bei WSB am 17.11. (Wortlaut in `replies/WSB_KANAL/WSB_AN_WS0_2026-11-17.md` §9 und §15). WS0 einverstanden: erst Befund, dann Bau-Auftrag.
**Grundlage:**
- Spiel-Stamm @787a373b: `m1-locoActor.js` (Flug-Clips je Zustand), `jetpack.js` (Modell, Düsen, Rauch, Ton), `vendor/vfx/kfb-flight-vfx.js` (Schub-Effekt);
- FB Web-Kanon twin r1j;
- Jetpack-Verträge Diesel r2 (Standard), Rocket r7 und Twin r1b.
**Ordner:** `50_BLENDER/JETPACK_BESTAND_R1/`. Absichtlich nicht `JETPACK_R1`, denn der Name gehört im Repo schon den Jetpack-Bauten einer anderen Sitzung.

## 1 · Flug-Clips (`data/flugmess_twin_r1j_b.json`, `scripts/flugmess.mjs`)
Das Spiel spielt je Flugzustand einen Clip (`m1-locoActor.js` FLY_CLIPS):
- Schweben `flight_idle_hover`;
- Gleiten und Rolle `flight_cruise` (`flight_roll_reaction` steht auf HOLD);
- Boost `flight_boost`, Sturz `flight_dive`;
- Bremsen `flight_brake_recover` (einmal, letztes Bild gehalten);
- Kurve links/rechts `flight_bank_left/right`;
- Landen `flight_land_prepare` (einmal).

Die Clips stammen aus WSB FLIGHT_FAMILY_01 (31.10.); ihre Quelle ist der Mech-Satz `KFB_FLIGHT_SELF_01`.

| Befund | Messung | Folge |
|---|---|---|
| **Gleiche Grundbewegung in sechs Zuständen** | Schweben, Gleiten, Boost, Sturz, Kurve L/R: Beine 30,5°, Rumpf 16,4°, identische Sinuskurve (Unterschenkel 0 → 30,5° → 0) | Die Zustände unterscheiden sich im Körper nicht; die Lage kommt nur aus der Kippung im Code (FLY_KIN) |
| **Beine schwingen gleichphasig** | linker und rechter Unterschenkel gleiche Kurve, kein Versatz | wirkt steif und mechanisch („starre Beinhaltung“) |
| **Arme stehen** | 0,03° in allen Flug-Clips außer Bremsen | Absicht der Quelle: Der Oberkörper ist die Waffenhaltung (fliegen im Anschlag); im Flug ohne Waffe wirkt das starr |
| **Ohren ohne Spur** | 0 Ohr-Spuren in allen Flug-Clips | Ohren nur über die Laufzeit-Physik des Spiels (earEnv); im Spiel prüfen |
| **Loop-Naht** | Pose erstes ↔ letztes Bild ≤ 0,04°, Kurve beginnt und endet im Umkehrpunkt | Rechnerisch geschlossen. Dass es nicht wie ein Loop wirkt, liegt eher an der reinen, gleichförmigen Sinusbewegung ohne Versatz und Nachschwung als an einem Sprung |
| **Bremsen und Landen** | Tempo-Sprung an der Naht bis 1 745°/s | nur einmal gespielt (FLY_ONCE), daher kein Loop-Fehler; der Übergang ins Halten sollte weich sein |

## 2 · Düsenstrahl (`belege/JETPACK_BESTAND_R1_duesenstrahl.jpg`, `scripts/schub.mjs`)
- **Nachgestellt mit dem Effekt-Modul des Spiels**, unverändert: Düsen wie `jetpack.js` (Anker `KFB_Thrust_*`, offset 0, `dir [0,0,1]`), Schub Schweben 0,14 und Boost 1.
- **Befund:** Der Effekt stößt entlang +Z der Düsen-Anker aus. Bei allen drei Jetpacks zeigt dieses +Z **nach hinten** statt nach unten:

| Jetpack | Düse(n) | Lage der Düse im Pack | +Z im Brustknochen-Raum (Sitz) |
|---|---|---|---|
| Diesel r2 (Standard) | `KFB_Thrust_0` | oben hinten (y 0,23, z −0,35) | (0; 0,20; −0,98) nach hinten und leicht nach oben |
| Rocket r7 | `KFB_Thrust_0` | unten (y −0,21) | (0; 0,10; −0,99) nach hinten |
| Twin r1b (WSB) | `KFB_Thrust_L/R` | unten an den Tanks (y −0,18) | (0; 0,10; −0,99) nach hinten |

- **Im Flug-Clip** kippt die Achse mit dem Körper: Schweben (0; 0,30; −0,95), Boost **(0; 0,89; −0,45)**. Beim Boost schießt der Strahl steil nach oben, über Kopf und Ohren. Das ist Georgs „wie drauf, nicht nach unten weg“.
- **Ursache:** die Ausrichtung der Anker; die Verträge sagen „lokal +Z = Schubrichtung“. Der Effekt selbst ist in Ordnung.
- **Lösungswege** (Entscheid WS0):
  - (1) Anker in den Dateien so drehen, dass +Z entlang der Düsenglocke nach unten zeigt (Daten; Twin ist von WSB, Diesel und Rocket von der anderen Sitzung);
  - (2) in `jetpack.js` je Variante eine Strahlrichtung im Pack-Raum statt `[0,0,1]` übergeben (Code).
  - Beim Diesel sitzt die Trichterdüse oben hinten; dort ist die Glockenachse zu prüfen, bevor man „unten“ festlegt.
- **Rauch:** `dustTrail.createThrustSmoke` nimmt dieselben Anker und hat damit dieselbe Richtung; er ist schon gepoolt.

## 3 · Ton (Bestand)
- `jetpack.js` spielt den Satz `jetpack_diy_r2_cut`: Zünden und Boost als Pop, Schub-Schleife (low), Boost-Schleife (high). Die Lautstärke folgt Schub und Boost.
- Das Hochschalten zwischen Zuständen ist nur über Boost abgebildet; eigene Töne je Zustand (Bremsen, Landen, Rolle) gibt es nicht.

## 4 · Vorschlag für den Bau-Auftrag (Entscheid WS0 mit Georg)
1. **Düsen:** Strahl nach unten (Anker oder Code, siehe oben), in Ruhe klein, im Schub lang; Rauch aus denselben Ankern. Default-Jetpack (Diesel) zuerst.
2. **Schwebe-Loop neu** (Blender): Beine mit Phasenversatz und Nachschwung, Arme locker pendelnd (ohne Waffe), Rumpf-Atmung; nahtlos.
3. **Manöver als Extremposen** (Blender): Kurve, Barrel Roll, Sturz, Boost, Bremsen. Klar unterschiedliche Körperhaltungen statt einer gemeinsamen Sinuskurve, mit Cartoon-Stauchung im Umkehrpunkt.
4. **Mit Waffe und ohne Waffe:** zwei Oberkörper-Schichten, damit Fliegen im Anschlag weiter geht.
5. **Ohren:** Laufzeit-Physik im Spiel prüfen; in den Clips höchstens leichte Grundhaltung je Manöver.
6. **Ton parallel:** je Zustand (Schweben, Gleiten, Boost, Bremsen, Rolle, Landen) Schleife bzw. Einzelton, Übergänge weich.
