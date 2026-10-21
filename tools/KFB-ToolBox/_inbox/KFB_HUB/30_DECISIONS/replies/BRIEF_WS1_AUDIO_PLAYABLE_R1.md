# BRIEF · Spielbare Version mit Ton: Fahrt, Flug, Atmo, Kampf, Musik · R1 · 2026-10-21 · WS0
**Register:** V-598. Baut auf V-128/V-129 (ein AudioContext, Suno-Jukebox), V-378 (Motor-Raster), V-448 (Foley vor Synthese), V-458 (Atmo), V-461 (geschichtete Töne) auf.
**Owner:** eine neue, parallele Claude-Code-Sitzung „WS-Audio“. Der WS1-Lead startet sie mit diesem Brief (Georg 21.10.: „möglichst bald eine spielbare Version mit dem ganzen Audio- und Soundbett“). Sie fasst nur das Audio-Modul und seine Anschlüsse an; Merge nur mit Georg.

**Tier 0**
1. **Ein Ton-Pfad:** ein AudioContext, ein Mixer mit Bussen (Musik, SFX, Atmo, UI), Ducking und Entfernungsdämpfung. Keine zweite Audio-Engine; vorhandene WSA-Laufzeit-Pakete zuerst (use what works).
2. **Nur vorhandene Töne,** nichts Neues synthetisieren. Echte Aufnahmen und ElevenLabs-Sätze gehen vor Synthese (V-448). Fehlt etwas: Liste an WS0, WS0 erzeugt es.
3. **Abnahme durch Georgs Ohr:** spielbar auf dem neuen Gelände plus 2-Minuten-Video mit Ton. Georg sieht nur, was bei dir ohne Fehler läuft.

## Block
**Quellen** (alles im privaten Repo `georg-doc/KFB-Stunt-Car-Race`, Branch `assets/private`, `README_PRIVATE_ASSETS.md`; Zugang über `gh`-Login bzw. eigenen Lese-Schlüssel):
- **WSA-Laufzeit-Pakete:** `40_AUDIO/elevenlabs_r1/WSA_AUDIO_RUNTIME_RACER_COMBAT_R1_2026-10-18.zip`, `WSA_AUDIO_FLIGHT_CRASH_R1_…zip`, `WSA_RACER_FLIGHT_HD_RUNTIME_R1_…zip`.
  - Inhalt: Motor-Schichten L2/L3/L5, Bremsen und Runterschalten, Tunnel-Loop, Antigrav-Hum u. a. als OGG, mit Laufzeit-Code.
  - **Zuerst prüfen und übernehmen.**
- **ElevenLabs-Sätze** `40_AUDIO/elevenlabs_r1/<set>/*.mp3` mit `<set>.json` (Beschreibung) und `<set>_norm/normalize_report.json` (Pegel je Clip). Sätze:
  - racer, propulsion, flight, hyperdrive, debris_crash;
  - combat, blaster, throwables, detonator;
  - atmos_dioramas, weather_time, farm, creatures, interactions;
  - fluff_economy, fluff_suction, fluffolect_layer, reward, ufo_harvest, beam_ufo, tank_bubbles, blobcorp_mib;
  - dark_fluffer, alchemy.
- **Musik:**
  - `music/suno-roadtrip-jukebox-v2/` (Georgs Suno-Instrumentals) für Fahrt und Flug;
  - `music/cozy-tunes-classics/` (gekauft, nur im Spiel) zu Fuß bzw. auf den Inseln (V-129).
- **Schritte:** Foley- und Digital-Bänke aus der Audio Site 0.7.6 (V-448). Fehlen sie im Branch, an WS0 melden.

**Zuordnung:**
- **Boden-Fahrt:** Motor nach Drehzahl und Last (Schichten L2/L3/L5 überblendet, V-378), Reifen je Untergrund, Bremsen, Drift, Landung.
- **Flug:** Antigrav-Hum und Wind nach Tempo, Schub-Stöße, Abheben, Landen, Crash (debris_crash).
- **Atmo:**
  - Klangteppich je Biom bzw. Diorama (atmos_dioramas, farm) plus zufällige Einzeltöne;
  - Wetter- und Tageszeit-Kopplung (weather_time, V-458);
  - Bewohner-Tätigkeiten positional (farm, alchemy, creatures).
- **Kampf:** an die K10-Ereignisse der Arena-Module anhängen (fire, cast, release, Kontakt, weaponDrop): combat, blaster, throwables, detonator.
- **Dark Fluffer** (WS-NPC Phase C): dark_fluffer an Ausholen, Spucken, Fleck, Fluff-Fall, Heilen, Augen-Plopp, bunten Fluff.
- **Musik:** Jukebox mit Zufallsfolge und Überblendung. Sie läuft bei Fahrt und Flug und wechselt zu Fuß auf Cozy Tunes. Unter lauten SFX und Dialog wird sie abgesenkt. Ein Regler je Bus im Panel.

**Technik:**
- Lazy-Load je Zone, höchstens N gleichzeitige Stimmen, Pool für Einzeltöne.
- Start nach der ersten Eingabe (Browser-Regel).
- Hauptthread ≤ 1 ms je Bild für Audio.

**Grenzen:**
- Private Töne und Musik **nie** ins öffentliche Repo `kayfabizarro` und nie in eine öffentliche Vorschau.
- Die volle Fassung läuft lokal auf dem WS1-Mac bzw. aus einem privaten Build. Öffentliche Vorschau ohne Musik bzw. ohne gekaufte Töne.
- Laufzeit-Code nur auf `ws-audio/*`. Push nach WS0-Go; den Deploy-Key nur mit Georgs Bestätigung in deiner Sitzung.

**Meldung:** `WS_AUDIO_STATUS.md` auf `ws-audio/status` mit:
- Zuordnungstabelle Ereignis → Datei;
- was fehlt;
- Messwerte;
- wie Georg die volle Fassung lokal startet (ein Befehl).
