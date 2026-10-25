# Audit Fahr- und Flug-Audio · R1 · WS0 · 25.10.2026

Geprüft wurden die Ereignisse aus `src/m2/k2t.js`, `M2Car.jsx`, `racerFlight.js`, `waterDrive.js` und `modules/vehicleRig.js`, dazu ihre Zuordnung in `src/audio/kfbAudio.js` und `cueMap.js`. Regeln kommen aus `RESEARCH_VEHICLE_AUDIO_R1.md` §2 (Cartoon) und §5 (SOP).

## Vorhanden und passend
- Motor-Gitter L1–L4, Schubabschaltung L5 mit Knallern, Schalten O1/O4, Fehlzündung (racer_r1). Seit heute mit ±28 % Tonhöhe, Last aus geglättetem Gas, langem 5. Gang und auch beim live gerufenen Auto.
- Boost und Drift-Boost (O5), Abheben (F4), Untergrund-Loops (R01–R04), Drift-Loop (R05), Drift-Laden (R06), Bremsen (R07).
- Landung weich und hart, Banden-Prall weich und hart, Nudge, Zwei-Rad, Respawn.
- Flug: Schub, Turbine, Antigrav, Fahrtwind im Flug (F3). Jetpack-Absturz (K04).
- Zerstörung: Impact-Sätze Metall, Glas, Knete, Domino, Trümmer-Nachklang.

## Lücken (neuer Satz `40_AUDIO/elevenlabs_r1/vehicle_feel_r1.json`)
| Lücke | Wirkung heute | Neu |
|---|---|---|
| Kein Ohne-Last-Motor | Gas weg klingt nur über L5, mittlere und hohe Drehzahl ohne Last fehlen | L2_low_off, L3_mid_off, L4_high_off (Motor-Code muss sie nach Last überblenden) |
| Kein Fahrtwind beim Fahren | Tempo hört man nur am Motor (Recherche: Tempo über Wind erzählen) | W01/W02 Wind niedrig und hoch, Pegel ∝ Tempo² |
| Kein Vorbeifahren | Bäume und Felsen rauschen stumm vorbei | X01 a/b klein, X02 groß (Auslöser: Abstandsprüfung im Bewuchs) |
| Landung ohne Bass auf dem Knet-Stoß | harte Landung nimmt Trümmer-Sound (K03), weiche nur Staub | H01 a/b weicher Knet-Bums, genau auf dem Squash-Bild |
| Fassrolle mit Wurf-Whoosh | generischer T03 | T10 a/b Dreh-Whoosh, T11 Landung auf den Rädern |
| Kein Ausholen vor dem Boost | Boost setzt ohne Anlauf ein (Cartoon: Ausholen → Aktion → Nachhall) | O6 Einatmen vor dem Boost |
| Kurvenneigung stumm | — | N01 Luftzischen beim starken Einlenken |
| Kleine Bodenwellen stumm | — | N02 a/b weicher Federungs-Tupfer |
| Staub-/Rauch-Puff stumm | — | D10 Staub-Puff (Landung, Sprungstart) |
| Jetpack nur als Absturz | Schub fehlt | J01–J03 Zünden, Loop, Ausgehen |
| Mech stumm | — | M01 a/b Servo und Schritt |

Bewusst nicht in diesem Satz: eine Stimme je Racer (14 Fahrzeuge, braucht erst ein Konzept je Racer) und das Soundbed (kommt aus den Mindscape-Stems).

## Einbau nach der Generierung
1. Lautheit normieren wie bisher (`_lufs`/`_norm`).
2. cueMap-Einträge anlegen und Auslöser in kfbAudio ergänzen:
   - Landungs-Bass zusätzlich zur Landung;
   - Fassrolle `trick` (tumble/spin) auf T10, Landung danach T11;
   - Boost-Einatmen 0,25 s vor dem Boost;
   - Fahrtwind aus Tempo;
   - Vorbeifahren aus dem Bewuchs-Abstand;
   - Bodenwelle aus dem Takt der Bodenhöhe;
   - Kurvenneigung aus der Gierrate.
3. Ohne-Last-Loops im Motor-Gitter nach Last überblenden.
4. Hörprobe für Georg im Hub.
