# OFFENE PUNKTE R1 · KFB WS1 · konsolidiert · Stand 22.10.2026

Für den WS1-Lead. Eine Liste aus allen Sitzungsberichten; doppelte Punkte sind zusammengeführt, Erledigtes steht nur am Ende.

**Quellen (gelesen 22.10., ca. 11:30):**
- Spiel-Repo `kfb-planet-mvp` @c2e6201 (`ws1/mvp-r1`): `docs/HANDOFF_GPT_SITE_R1.md`, `SITE_SETUP.md`, `BIOME_DRIVE_R1.md`, `ws-npc/WS_NPC_STATUS.md` (§1–§11), `ws1/audits/VEHICLES_R1.md`, `VEHICLES_R1_ANKER.md`, Commit-Log seit 22.10. 00:00.
- `research/audits/`: `WATER_R1.md`, `water-r1-critic{,2,3}/CRITIC_ERGEBNIS.md`, `COMBAT_AV_R1.md`, `COMBAT_AV_R1_BACKLOG.md`, `CODE_PERF_R1.md`, `CRITIC_QA_R1.md`, `ART_DIRECTOR_R1.md` (+ `_VORSCHLAEGE`), `VFX_SFX_R1.md` (+ `_TOP10_IDEEN`).
- kayfabizarro `origin/ws1/terrain-439:WS1_STATUS.md` §121–§137 (Abgleich mit §117/§120), `origin/ws-audio/status:WS_AUDIO_STATUS.md` (§1–§12), `origin/ws-npc/status`.
- Gelände-Probe `~/kfb-ws1/probe/PROBE_SRC.md` (keine offenen Punkte darin).

**Kürzel:** WS1S = WS1_STATUS · NPC = WS_NPC_STATUS · AUD = WS_AUDIO_STATUS · CAV-B = COMBAT_AV_R1_BACKLOG · AD = ART_DIRECTOR_R1 · QA = CRITIC_QA_R1 · PERF = CODE_PERF_R1.
**Priorität:** MVP · nach MVP hoch · später. **Status:** offen · in Arbeit · wartet auf … · prüfen (Stand in den Quellen unklar).

---

## 1 · MVP-Blocker / vor Übergabe an WSA

| # | Punkt | Quelle | Zuständig | Status |
|---|---|---|---|---|
| B1 | WSA-Work-Job „GPT-Site mit allen Features“ einplanen und die vier Plattformfragen beantworten (Grenzen je Datei/gesamt/Anzahl, Edge-Funktionen + Secrets, Deploy-Auslöser, Adresse + Tester). | HANDOFF_GPT_SITE_R1 §4; WS1S §126 | WS0 → WSA | wartet auf WS0/WSA |
| B2 | Site-Laufzeit bauen: Passwort für alle Pfade, `/raw`-Proxy auf kayfabizarro, HTTP-Range für `/kfb-audio/`, MIME-Typen, `_headers` in Plattform-Caching übersetzen. | HANDOFF_GPT_SITE_R1 §2–§3 | WSA | wartet auf B1 |
| B3 | Lese-Token `ASSETS_TOKEN` (nur Contents:Read auf KFB-Stunt-Car-Race) und Site-Passwort als Plattform-Secret anlegen. | HANDOFF_GPT_SITE_R1 §2–§3; SITE_SETUP §1/§3 | Georg | wartet auf B1 |
| B4 | Neuen Stand nach `game/mvp-r1` spiegeln: PCF-Schatten (c2e6201) und Vorwärm-Fix (cc35b7e) fehlen dort (privat @f8e88ae = 384fd89). | WS1S §137; Commit-Log | WS1-Lead | erledigt mit diesem Stand (Spiegel nach dem Commit dieser Datei) |
| B5 | Volle Testreihe im Slot nach PCF und Vorwärm-Fix; dabei die Regression `vehicles-r1 data` (gecachte Racer erneut durch Look/Vorwärmen, bis 4,5 s) als behoben bestätigen. | WS1S §137 | WS1-Lead | erledigt 22.10.: Reihe PASS bis auf c2-Lidspalt, Disco-Dämon 2,5 cm (beide Backlog); vehicles-r1 data PASS nach cc35b7e |
| B6 | fps-Tabelle `test/perfMvp.mjs` nach PCF neu messen; zuletzt Bewohner+Disco „Standard“ 50 statt 60 fps (Ziel 60 fps auf Georgs Mac). | WS1S §137, §135 Plan 2; HANDOFF §5 | WS1-Lead | offen: nach PCF neu messen, nur wenn Georgs Chrome nicht läuft |
| B7 | Blinder Design- und Gameplay-Kritiker auf dem MVP-Build, danach Übergabe-Stand an WSA. | WS1S §135 Plan 5; HANDOFF §5 | WS1-Lead | erledigt 22.10.: REWORK 4,3 → Abschnitt 1b |
| B8 | Abnahme-Schild „Fahrsystem: … · M Assist · C wechselt“ steht oben mittig unter der Holzleiste; vor dem Kritiker ausblenden oder versetzen. | AD #13; `src/m2/M2Car.jsx` useKindLabel (top 14 px) | WS1-Lead | offen |
| B9 | world=probe: Spieler schwebt ab 15° Hang, Obstbäume stehen am Steilhang (Port-Fragen, seit §121 nicht als erledigt gemeldet). MVP startet auf world=probe. | WS1S §121, §124 §4 | WS1-Lead | prüfen |
| B10 | WSB-Jobs mit Priorität MVP: J-1 Oberkörper-Schussclips FB, J-2 Waffen-Halterung an FB neu messen, J-3 floorLift-Tabellen FB (Disco), J-4 Augenprofile Ritter/Dämon, J-5 Marsch Spielzeugsoldat mit Gewehr. | WS1S §130; NPC §11 | WS0 → WSB | wartet auf WS0 |
| B11 | Kampf-Umfang fürs MVP klären: Übergabe §5 nennt Arena-Module PR #24/#27 (nur #25 übernommen), Combat-AV-Prototypen und Tod-Baustein; Georg führt Tod-Baustein unter Kampf R2 (nach MVP). | HANDOFF §5; WS1S §130 J-9; Commit 851e1fd | WS1-Lead + Georg | offen |
| B12 | Georgs offene Abnahmen bündeln: L-1 Startseite/Vorhang, L-2 Disco-Augen Ritter/Dämon (PROOF), L-4 Fahrzeug-Look A im Spiel; privaten Ablageort festlegen (Vorschlag `review/abnahmen` im Stunt-Race-Repo). | WS1S §129; NPC §11 | WS0 / Georg | wartet auf WS0 |
| B13 | Karten-Pool lädt über api.github.com (anonym 60 Abfragen/h je IP): bei Spielern/Tests schnell erschöpft (22.10.: s5a livePoolLoaded „HTTP 403“). Auf Rohdatei bzw. `/raw`-Proxy der Site umstellen, Cache behalten. | `src/poolReader.js` POOL_URL | WS1-Lead (Pool-Leser: WS-NPC) | erledigt 22.10. (WS-NPC 79730bd: Rohdatei gepinnt + Blob-Prüfung im Browser; s5a/s5b PASS) |

---

## 1b · Blinder Kritiker auf dem MVP-Build (22.10., CRITIC_3D_R1) · REWORK, Mittelwert 4,3

Punkte: K1 5 · K2 4 · K3 4 · K4 3 · K5 5 · K6 4 · K7 4 · K8 5 · K9 4 · K10 5. Stopp-Regel greift (K4 < 4 nach Runde 1 → zurück zum Konzeptblatt, Bericht an WS0).
Volltext: `docs/critic/MVP_R1_CRITIC_ERGEBNIS.md` (Bilder privat in `~/kfb-ws1/research/audits/mvp-r1-critic/bilder`, enthalten gekaufte Figuren).

| # | Befund (Spieler-Sicht P1–P3) | Bild | Vorschlag Zuständig | Art |
|---|---|---|---|---|
| C1 | P1 Entwicklertexte im Spielbild: „Fahrsystem: K2B · Assist M3“, Waffen-Notiz „K10-Kitwaffe (Prototype Bits)“; Racer-Label von der Punkteleiste angeschnitten | 07, 08, 11 | Lead (V-367: Label weg nur mit Georgs Ja) | schnell |
| C2 | P1 Spielstart auf beiger Rechteck-Platte mit geraden Kanten (Weg-Platte) | 00c, 01, 03, 04 | Lead/WS1b | schnell–mittel |
| C3 | P1 Boden lauter als Held und Bühne: „Marmortapete“, Graustufen-Kontrast liegt im Boden, Zacken/Moiré in der Ferne | 01, 01b, 07, 09 | WS0 (Look-Frage) + Probe | Konzept |
| C4 | P1 Nacht: Held und Welt kaum lesbar, kein Fokus | 04, 06 | Lead (Licht-Rig Nacht/Figurenlicht) | mittel |
| C5 | P2 Stilbruch: Foto-Rost-Racer, Düsenflammen als Ring-/Kugelstapel, Plastik-Pistole, Kit-Figuren ohne Knete | 07, 08, 11, 12 | WS0 (= Georgs Punkt 2 Biom-Fahrt) | Konzept |
| C6 | P2 Erdung fehlt überall: keine Kontakt-Geometrie an Bäumen/Amphitheater, Kristall-Laternen auf Sechseck-Sockeln, Teller/Schalen/Karotte schweben | 01, 02, 05, 11 | WS1b/Lead (= Georgs Punkt 1) | mittel |
| C7 | P2 Kampf: Treffer ohne sichtbare Wirkung, Schusslinie setzt vor der Mündung ab | 09, 10 | Lead/Kampf | mittel |
| C8 | P2 Disco: Lichtflecken als flache Farbellipsen, Boxen als schwarze Quader | 06 | Lead | mittel |
| C9 | P2 Wasser: flache Folie mit gleich breitem Ufersaum/Schnittkante, Wasserfall als Vorhang mit Kugeln | 13 | WS1c + Probe (deckt sich mit 2.2) | mittel |
| C10 | P3 E2-Lider an 5/8 Gesichtern nicht erkennbar, FB-Brauen schwarze Quader | 02, 12 | WSB/ToolBox | später |
| C11 | P3 HUD-Leiste liegt über Plakat/Bühne; Anschnitte (Lorekeeper halb im Bild, Kristall wächst aus dem Hasenkopf) | 01, 05 | Lead (HUD/Kamera) | schnell |
| C12 | Paket: Kamera 1 (Übersicht 35°), 3 (Fuß), 4 (Seite), Silhouette, Spieltempo-Pass, Terrain-Diagnose fehlten im Bildsatz | – | Lead (criticShots erweitern) | schnell |

---

## 2 · Bereiche

### 2.1 Gelände-Probe (und Port world=probe)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Spieler schwebt ab 15° Hang; Obstbäume am Steilhang (= B9). | WS1S §121, §124 | WS1-Lead | MVP | prüfen |
| Sanfte Hügel sind im Spiel 1:1 zu steil; Schraffur auf Steilflächen; Farbspanne terrain3 (blasser als Probe, `low/mid`/`uT3Keep` prüfen). | WS1S §121, §124; AD Kurzurteil Spiel | WS1-Lead | nach MVP hoch | offen |
| Ferne im Spiel: Musterwand ohne Luftperspektive, grauer Himmel; Polygon-Zacken an Fernringen und Graten. | AD #1, #5; WS1S §117 | WS1-Lead | nach MVP hoch | prüfen |
| Weg als glatte Sandplatte ohne Saum und Fließfarbe. | AD #14 | WS1-Lead | später | offen |
| Felsen wie weiße Seife (Fließfarbe auf Felsen ≤ 0,25?) widerspricht Georgs Urteil vom 20.10. | AD #8; WS1S §117 | Georg | später | wartet auf Georg |
| Sonnenstand ohne Stimmung (unter 25° Richtung gold mischen); Kit-Wasser übernimmt Nachtstimmung nicht. | AD #12 | WS1-Lead | später | offen |
| Probe-Leistung Übersicht: Höhenkarte backen (−8…−10 ms). | PERF §3; WS1S §120 | WS1-Lead | später | offen |
| Probe F4: Schatten-Schalter friert 2,3 s ein; F5: `__syncDio` baut bei jedem Regler-Ereignis neu (8 ms, Diorama an ≈ 2 s). | PERF §6 | WS1-Lead | später | offen |
| Wagen schwebt noch an zwei Terrassenhängen vor Wänden; sauber nur mit Rumpf-Kollision gegen das Höhenfeld (eigener Slice). | WS1S §117; QA P1-1 | WS1-Lead | später | offen |
| Kleinere QA-Reste: Kamera bis 0,31 m am gezeichneten Boden (`max(surfAt, meshH)`), Tageszeitwechsel hängt bis 233 ms, fps-Anzeige springt, Tastenhilfe uneinheitlich, Favicon-404. | QA P3-3/-4/-6/-7/-9 | WS1-Lead | später | prüfen |
| Probe-Quellen bei jedem Probe-Push nach `ws1/probe-src` spiegeln. | WS1S §124 §5 | WS1-Lead | später | offen |

### 2.2 Wasser (WS1c)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Wasserfälle wirken wie flache Platte vor dem Fels (gerade Oberkante, Lücke zum Becken, Felslippe oben); Gischt aus Kugeln. Fix in der Probe: Fall-Netz folgt dem Fels, Zulauf-Lippe, Gischt als Knet-Wolke. | WATER_R1 Restbefund 2, Offen 1; Kritiker R1–R3 | WS1c (Probe zuerst, dann Generator) | nach MVP hoch | offen |
| Manche Flüsse enden auf trockenem Land oder in winzigen Meer-Mulden („Kapsel“); Mündung als aufgelegtes Band. Fix in der Probe (HYDRO): nur an genügend großem Meer enden, Band auffächern, Paritätstest. | WATER_R1 Restbefund 1, Offen 2 | WS1c | nach MVP hoch | offen |
| Kleinste Mulden unter Meereshöhe (< 30 m²) lesen sich mit Saum als „Auge“; beim Erzeugen weglassen. | WATER_R1 Offen 4; Kritiker R3 #5 | WS1c | nach MVP hoch | offen |
| Kein Wurfschatten des Racers auf dem Wasser (Wasser-Shader empfangen keinen Schatten; Spiel hat nur Stub). | WATER_R1 Restbefund 5, Offen 3 | WS1c | nach MVP hoch | offen |
| Am Ufer fehlen Steine und Büschel mit Kontakt (→ Vegetation, siehe 2.3). | WATER_R1 Restbefund 3 | WS1b | nach MVP hoch | offen |
| Wasser-Klänge (9 Cues, siehe 2.6) fehlen. | WATER_R1 Liste; WS1S §135 | WS0 → WS-Audio | nach MVP hoch | wartet auf WS0 |
| Seen haben fast denselben Grauwert wie das Gelände (Wertstruktur); Kit-Farben vs. Palette. | WATER_R1 Restbefund 4, Offen 5 | Georg / WS0 | später | wartet auf Georg |
| Unter Wasser zu mittelgrau; heller wäre Abweichung von der Probe (UNDER). | WATER_R1 Restbefund 6 | Georg | später | wartet auf Georg |
| Kit-Wasser in der Ferne rauscht; keine helle Schaumlinie am Ufer. | AD #15 | WS1c | später | prüfen |
| Wasser (Meer/Flüsse) fehlt in der endlosen Biom-Welt. | BIOME_DRIVE_R1 §8; V-621 | WS1c | später | offen |

### 2.3 Biom-Fahrt / Vegetation (WS1b)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Erdung: Bäume und Steine sitzen ohne Übergang auf dem Boden (keine Kontakt-Geometrie). Georg: „super wichtig nach dem MVP“. | WS1S §135; BIOME_DRIVE_R1 §7 | WS1b | nach MVP hoch | offen (Register-Eintrag bei WS0 erbeten) |
| Racer (Metall/Rost, PBR) und Cartoon-Gelände wirken wie zwei Machweisen (auch AD #4 „fotoreale Racer“). Georg-Punkt 2. | WS1S §135, §117; AD #4 | WS1b / WS1d | nach MVP hoch | offen |
| Gras steht als einzelne Halme statt in Büscheln. Georg-Punkt 3. | WS1S §135; BIOME_DRIVE_R1 §7 | WS1b | nach MVP hoch | offen |
| Ufer-Grammatik: Steine und Büschel mit Kontakt an der Wasserlinie (Kanon 17(7)). | WATER_R1 Restbefund 3 | WS1b | nach MVP hoch | offen |
| Biom-Fahrt ≥ 60 fps nicht belastbar nachgewiesen (54–58 fps unter Fremdlast); Nachmessung im ruhigen Fenster, jetzt mit PCF. | BIOME_DRIVE_R1 Kurzstatus, §8 | WS1b | nach MVP hoch | offen |
| Bäume ohne Gruppen 1:3:Rest; Silhouetten-/Diagnosepässe fehlen. | BIOME_DRIVE_R1 §7 | WS1b | später | offen |
| Schnee-Biom zeigt im Clip am Ende noch Regen (Wechsel folgt dem Biom am Wagen). | BIOME_DRIVE_R1 §7 | WS1b | später | offen |
| Bewuchs wirft komplett Schatten; Einzelauslese nur ohne Texturupload. | BIOME_DRIVE_R1 §8 | WS1b | später | offen |
| Scheinwerfer-Haken `HEADLIGHTS.daylight/dark` bei world=endless setzen (Uhr, Tunnel, MIB). | BIOME_DRIVE_R1 §8; VEHICLES_R1 §3 | WS1b | später | wartet auf Lead-Einführung |
| „Nahe der Figur ruhiger“ (Bandkontrast 12–28 m gedämpft) braucht Georgs Urteil am Bild. | BIOME_DRIVE_R1 §8 | Georg | später | wartet auf Georg |

### 2.4 Fahrzeuge (WS1d)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Regression `vehicles-r1 data` nach Hero-Umbau (= B5); Fix cc35b7e ist da, Bestätigung in der Reihe fehlt. | WS1S §137; Commit cc35b7e | WS1d / Lead | MVP | prüfen |
| Scheinwerfer-Feinabstimmung der 8 Anker (Georg: PASS, Tune später). | VEHICLES_R1_ANKER; VEHICLES_R1 §3 | WS1d | später | offen |
| Scheinwerfer-Kegel Feinschliff (Georg 23.10.: Standard, Feinschliff später): Übergang Kegel → Fleck ohne Helligkeits- und Breitensprung (Volumen wirkt schmaler, Fleck läuft zu schnell hell ein); Abnahmeplatz ohne dunkle Kästen. | Abnahme scheinwerfer5 r2; HEADLIGHTS_PHYSIK_R2 | WS1d | später | offen |
| Figuren nachts lesbar: erledigt 23.10. – Belichtung nur für Figuren (figamb, Standard) + Nacht-Mondschatten (nsh, Standard); Figurenlicht Weg 1 abgelehnt. | FIGUREN_LESBARKEIT_R2 | Lead | – | erledigt |
| Gold-Licht violett (Kritiker K2): erledigt 23.10. – Georg: Mesa-Stimmung bleibt („finde ich eigentlich ganz schön“), keine Gegenvariante. | MOODS_MESA | – | – | erledigt |
| Nacht-Mondschatten Feinschliff (Georg 23.10.: passt, später tunen): unmittelbaren Bodenkontakt unter den Figuren etwas dunkler. | Abnahme nachtschatten; NSH in M1World | Lead | später | offen |
| Staubfahne nach Georgs Vorlage (Weltkoordinaten, viele kleine Partikel, dust3=1 auf ws1/staub-probe): Richtung stimmt, Volumen fehlt; GPU-Schritt läuft. | Abnahme staubfahne; WS0_PARTICLE_FIRST… | WS1b | hoch | läuft |
| Fahr-VFX fehlen im Spiel: Landering, Sprung-Puff, Boost-Stoß, Drift-Spur, Aufprall-Stern (Modul `kfb-vfx`); Spiel-Staub als weiche Sprites ersetzen. | VFX_SFX_R1 §1, Top 10; AD #10 | WS1d | nach MVP hoch | offen |
| Erstladen mit neuen Shader-Varianten: Ödland-Käfer bis 196 ms, Abschlepp-Koloss bis 290 ms unter Volllast. | VEHICLES_R1 Offen 3 | WS1d | später | offen |
| kfb-groundfx bei „Scharf“/×2 über 0,5 ms (×2: 0,91 ms); „Scharf“ nicht gemessen. | VEHICLES_R1 §4, Offen 5 | WS1d | später | offen |
| Verformungsprofil SPACE_HAULER (Laster) ist „nicht abgestimmt“. | VEHICLES_R1 Offen 6 | WS1d | später | offen |
| Schweben kaum sichtbar bei 01, 03, 05, 11, 13; 13 wirkt eingesunken. Mehr Abstand wäre Abweichung von V-251. | VEHICLES_R1 §6 | Georg | später | wartet auf Georg |
| Idee: Boombox-Ringe synchron zur Radio-Playlist (Ring-Geber über `musicPulse()` liegt bereit). | WS1S §127; VEHICLES_R1 §4 | WS1d | später | offen (Idee) |
| Idee: Fahrer im Dach (Sitz-Anker je Racer, Lenkrad-IK, Hineinhüpfen bis zur Hüfte, Feder-Rigs) = WSB J-7. | WS1S §127, §130 J-7 | WSB / WS1d | später | offen (Idee) |

### 2.5 Bewohner / NPC (WS-NPC)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Spielzeugsoldaten ohne Gewehr, bis J-5 Marsch (Halterung oder Marsch-Clip) kommt. | NPC §11, §6 D-10; WS1S §121, §130 | WSB → WS-NPC | MVP | wartet auf WSB |
| Begrüßungsblasen zeigen nur „…“, bis WS0-Zeilen da sind (siehe 2.11). | WS1S §134; Commit c1d937d | WS0 → WS-NPC | nach MVP hoch | wartet auf WS0 |
| Dark-Fluffer-Cubes K11: 15 Boden-Cubes mit `KFB_Mouth` + `KFB_HealedEyes`, Mushroom zuerst; danach mehrere Fluffer über `fluffers[]`. | NPC §9; WS1S §123 | WS0 → WSB, dann WS-NPC | nach MVP hoch | wartet auf WSB |
| Gerücht-Kette (told-of-told) braucht Schema-Entscheid zu `kfb.world-save/1`. | NPC §6 D-7b, §11 G-2 | WS0 | später | wartet auf WS0 |
| Ort und Auslöser der Welt-Ereignisse (Geschenk-Trupp E3, MIB, UFO) im Welt-Ereignis-Host; bis dahin Platzhalter per Hash. | WS1S §133, §136 | WS1-Lead | nach MVP hoch | wartet auf WS0-Regeln |
| Band-Ort und Bot-Ort als Dioramen-Anker aus dem Gelände (heute POI/Platzhalter). | NPC §6 Lücke 4, §7 Lücke 3 | WS1-Lead | später | offen |
| Eigener Spielzeug-KO-Clip `Toy_KO`/`Toy_GetUp` (Skelett-Clips als Übergang ok). | NPC §11; WS1S §131 | WSB | später | wartet auf WSB |
| Hut-Nummern Nr. 1–6 nur in den Daten, nicht im Asset. | NPC §6 Lücke 2 | WSB | später | offen |
| Skelett-Augen: Batch-Profile AUTO_CANDIDATE, Bereinigung der Original-Augenhöhlen HUMAN_REQUIRED. | NPC §6 Lücke 1 | WSB / Georg | später | offen |
| Eigentempo von `kfb_bot_carry_a` und Ghost-Walk ungemessen (Fußgleiten möglich). | NPC §7 Lücke 1, §6 Lücke 8 | WS-NPC | später | offen |
| Treffer auf die Ork-Band nur nach Entscheid. | NPC §6 Lücke 4 | Georg / WS0 | später | wartet auf Entscheid |
| Team-Heilen mit den Hexen offen. | NPC §4 | WS0 | später | offen (Idee) |

### 2.6 Ton (WS-Audio)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Wasser-Klänge erzeugen: `water.enter.splash` S/M/L, `exit.splash`, `surface.breach`, `dive.gulp`, `kick`, `under.loop`, `bubbles`, `wade.slosh`, `skim.spray`; Ereignisse `M2EVENTS 'water'` liegen bereit. | WATER_R1 „Fehlende Klänge“; WS1S §135 | WS0, dann WS-Audio | nach MVP hoch | wartet auf WS0 |
| Ohne neuen Klang: unter Wasser Motor/Mix tiefpassen (`under().k`); Racer-Untergrund aus `M2STATE.water.mode` statt Flussnähe. | WATER_R1 „Fehlende Klänge“ | WS-Audio | nach MVP hoch | offen |
| Bewohner-Stimmen `resident_voices_r1` (2 × 4 Gründe × 2 Varianten); bis dahin Platzhalter Kalimba/Atem. | AUD §12; WS1S §134 | WS0 | nach MVP hoch | wartet auf WS0 |
| Musik-Katalog (bpm, Downbeat, Moods, Lautheit) für 14 Suno- und 24 Cozy-Titel; danach `musicPulse` auf MusicClock + Katalog-BPM, eigene Tag-/Gain-Dateien fallen weg. Heute Halb-/Doppeltempo-Risiko. | AUD §11; WS1S §128 | WS0, dann WS-Audio | nach MVP hoch | wartet auf WS0 |
| Ende-Ereignis für den Stinger L15 (`ui.gameOver`) fehlt; hängt am Tod-Baustein. | AUD §8, §10 | WS1-Lead | später | offen (mit Kampf R2) |
| Arena-K10-Ereignisse `windup`, `kill`, `block` im Spiel. | AUD §8, §10 | WS1-Lead / WSA | nach MVP hoch | prüfen (siehe B11) |
| Feinabstimmung Pegel und Mischung nach Georgs Ohr (PASS mit TUNE). | AUD §9 | WS-Audio | später | offen |
| Ungenutzte Töne: D01 arm_beeps (kein Scharf-Ereignis), A01/A03 (kein Dschungel-Biom), B11, R03b, R07. | AUD §8, §10 | WS-Audio | später | offen |
| Merge `ws-audio` nach main mit Georg. | AUD §10 | WS-Audio / Georg | später | offen |

### 2.7 Kampf
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Kampf R2: Gegner-Schaden, Baustein „eigener Tod“ (`ws1/bausteine/kfb-tod-bloedsinn`) einbauen, Nahkampf und weitere Waffen an FB (J-8). | WS1S §125, §130 J-8/J-9; Georg 22.10. | WS1-Lead + WSB | nach MVP hoch | offen |
| Schießen in Luft/Flug gesperrt, Laufen+Schießen rutscht, bis J-1 Oberkörper-Clips da sind. | WS1S §130 J-1 | WSB → WS1 | MVP | wartet auf WSB |
| Tod: „Blödsinn!“ als Claymation-Lettering (D5, Pflicht) und Kreuz-Pupillen (D3, Augen-Rig v6) = WSB J-9. | CAV-B D3, D5; WS1S §125, §130 | WSB | nach MVP hoch | wartet auf WSB |
| Tod: spieleigenes Fenster „FrizzleBob is down“ erscheint doppelt; erst nach dem Wort zeigen. | CAV-B D2 | WS1-Lead | nach MVP hoch | offen |
| Gegner-Ansage: Stauchen bei weiter Kamera kaum sichtbar, Ringe auf zwei nächste Gegner begrenzen, Stauchen über `deform`-Kanal leiten. | CAV-B A2–A4 | WS1-Lead | später | offen |
| Kamera & Bühne: Hintergrund füllt an der Kartenkante ein Drittel; Waffenleiste bleibt eingeklappt sichtbar; Magierhut verdeckt beim Zielen (Schulter-Versatz). | CAV-B B2, B3, W1 | WS1-Lead | später | offen |
| Abgang: Pop nur über Engine belegt; Gatling erzeugt viele Bänder; Gatling-Blitz einmal erst nach 182 ms. | CAV-B V1–V3 | WS1-Lead | später | offen |
| Spieler-Treffer: Unverwundbarkeit nicht sichtbar (blinzelnde Augen statt Transparenz); Treffer von hinten verdeckt. | CAV-B H2, H3 | WS1-Lead / Augen-Rig | später | offen |
| Tusche: Glanz als gleichförmige Ovale; Abfrage sieht GPU-Zulauf nicht; Freisteller nur an einem Gegnertyp geprüft. | CAV-B I1–I3 | WS1-Lead | später | offen |
| Klang: einige Schüsse noch „Piu-Piu“ (tiefer stimmen); Prüfregel R3 (Gegner ≥ 6 dB unter eigenem Schuss) je Bus messen. | CAV-B K1, K5 | WS-Audio | später | offen |
| Ereignisse: `raise` im Spiel ungehört (Slot-Konflikt); Splat-Weg dauerhaft auf `impact.wet.ink`. | CAV-B E2, E3 | WS1-Lead | später | offen |
| Werkzeug Arena: Seite lädt nach Tod neu, `serve_soldier.py` Queue, `?actor=soldier-r3d`, Hash-Sperre `gunfight.v2.js`, `hp=0` per Intervall. | CAV-B W2–W6 | WSA / Prüfer | später | offen |
| WSA-Manifest: Neuaufnahmen C01–C12 v2/v3 aufnehmen; O2_backfire v3 ausgeschlossen. | AUD §8 | WSA | später | offen |

### 2.8 Startseite / Site / GPT-Site
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| WSA-Work-Job + vier Plattformfragen (= B1). | HANDOFF §4 | WS0 → WSA | MVP | wartet auf WS0/WSA |
| Site-Laufzeit: Passwort, `/raw`, Range, MIME, Caching (= B2). | HANDOFF §2–§3 | WSA | MVP | wartet auf B1 |
| Token und Passwort-Secret (= B3). | HANDOFF §2; SITE_SETUP | Georg | MVP | wartet auf B1 |
| Stand nach `game/mvp-r1` spiegeln, je Stand Commit melden (= B4). | HANDOFF §1; WS1S §137 | WS1-Lead | MVP | offen |
| Abnahme-Schild „Fahrsystem“ unter der Holzleiste (= B8). | AD #13 | WS1-Lead | MVP | offen |
| Passt die 25-MiB-Grenze je Datei zur GPT-Plattform? Sonst Build-Grenze anpassen. | HANDOFF §2 | WSA → WS1 | MVP | wartet auf B1 |
| Build-Prüfung, die abbricht, wenn `src/private` in einem Vorschau-Build steckt. | WS1S §124 §5 | WS1-Lead | nach MVP hoch | offen |
| `build-site.mjs`: `path.join` bei absolutem `KFB_SITE_OUT`. | AUD §7 | WS1-Lead | später | prüfen |
| `orbit calmAfterRelease` rot (nur `#stage`, nicht MVP-Pfad). | WS1S §127 | WS1-Lead | später | offen |
| E-Mail-Login sobald es Spielstände gibt; „öffentlich“ erst auf Georgs Wort; `GH_READ_TOKEN` wenn kayfabizarro privat wird (V-599). | SITE_SETUP §3, §5; HANDOFF §3 | Georg / WSA | später | offen |

### 2.9 Leistung
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| fps-Tabelle nach PCF neu; Bewohner+Disco „Standard“ 50 fps → Ziel 60 (= B6). | WS1S §137 | WS1-Lead | MVP | offen |
| FB-Ohren je 22 k Dreiecke (ToolBox, kein Einbau-Fix). | WS1S §135 | WS0 → WSB | nach MVP hoch | wartet auf WS0 |
| Spiel-Diffs aus PERF §7: Kuppel nach dem Opaken zeichnen (Early-Z), Nachhol-Schritte auf 4 deckeln, Schatten in terrain3 nicht doppelt abfragen, Lichtpfützen nicht erst nach 1 s anhängen (Doppel-Kompilierung). | PERF §7 | WS1-Lead | nach MVP hoch | offen |
| Biom-Fahrt ≥ 60 fps nachweisen (siehe 2.3). | BIOME_DRIVE_R1 | WS1b | nach MVP hoch | offen |
| Erstladen-Spitzen neuer Racer; groundfx ×2 (siehe 2.4). | VEHICLES_R1 Offen 3, 5 | WS1d | später | offen |
| Probe: Höhenkarte backen, F4, F5 (siehe 2.1). | PERF §3, §6 | WS1-Lead | später | offen |

### 2.10 Figuren / Augen / ToolBox (WSB)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| J-1 Oberkörper-Schussclips FB + Halte-Idle mit Waffe, Marker `fire_s`. | WS1S §130 | WSB | MVP | wartet auf WS0 |
| J-2 Waffen-Halterung an FB neu messen (Pistole 6,9 cm, Blaster 8,4 cm Abstand Hand–Griff). | WS1S §130 | WSB | MVP | wartet auf WS0 |
| J-3 floorLift-Tabellen FB für die Disco-Clips (`fb.floorlift.json`). | WS1S §130 | WSB | MVP | wartet auf WS0 |
| J-4 Augenprofile Ritter (black_knight) und Dämon (demon_lord); heute Anker-Sitz PROOF. | WS1S §130, §124 F3 | WSB / Georg im Studio | MVP | wartet auf WS0 |
| J-5 Marsch des Spielzeugsoldaten mit Gewehr. | WS1S §121, §130 | WSB | MVP | wartet auf WS0 |
| c2: am Lidrand bleiben 10–25 px Pupille unter ±40° sichtbar (Dory/Hunky, wackelig) → Eye-Rig E2. Kein MVP-Blocker. | WS1S §137 | WSB / ToolBox | nach MVP hoch | offen |
| Disco-Dämon taucht in `kfb_dance_hip_hop_a` bis 2,5 cm in den Boden (Grenze 2 cm) → Clip oder floorLift je Clip. | WS1S §137 | WSB | später | offen |
| FB-Ohren je 22 k Dreiecke reduzieren (ToolBox). | WS1S §135 | WSB | nach MVP hoch | wartet auf WS0 |
| J-7 Fahrer im Dach (Sitz-Anker, Lenkrad-Griffe, Hüpf-Clip bis Hüfte, Feder-Rigs Ohren/Antennen). | WS1S §130 | WSB | später | offen (Idee) |
| J-8 Nahkampf und weitere Waffen an FB. | WS1S §130 | WSB | nach MVP hoch | offen |
| J-9 „Blödsinn!“-Knet-Lettering und Kreuz-Pupillen. | WS1S §130, §125 | WSB | nach MVP hoch | offen |
| Dark-Fluffer-Cubes K11 (siehe 2.5). | NPC §9 | WSB | nach MVP hoch | wartet auf WS0 |

### 2.11 Offen bei WS0 (Entscheidungen, Zeilen, Laute, Kataloge)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| WSA-Work-Job GPT-Site einplanen (= B1). | WS1S §126 | WS0 | MVP | offen |
| WSB-Jobs J-1…J-9 einplanen (J-1…J-5 MVP). | WS1S §130 | WS0 | MVP | offen |
| Abnahme-Ablage für Georg festlegen (`review/abnahmen`?) und Karten bauen (= B12). | WS1S §129 | WS0 | MVP | offen |
| Begrüßungszeilen: je Grund (cure, fight, known) 3–5 kurze deutsche Zeilen, ggf. je Figur gefärbt. | WS1S §134 | WS0 (Writers Room) | nach MVP hoch | offen |
| Stimm-Laute `resident_voices_r1` + Instrumente der Bewohner (V-508). | WS1S §134; AUD §12 | WS0 (Audio) | nach MVP hoch | offen |
| Wasser-Cues (9 Klänge). | WATER_R1; WS1S §135 | WS0 (Audio) | nach MVP hoch | offen |
| Musik-Katalog als Datei in `assets/private`; Visualizer-Form = `presentation-pulse.v1`?; Tags/Lautheit aus Katalog? | AUD §11; WS1S §128 | WS0 | nach MVP hoch | offen |
| Häufigkeit und Regeln der Welt-Ereignisse E1–E3 (MIB, UFO, Geschenk). | WS1S §133 | WS0 | nach MVP hoch | offen |
| Georgs drei Post-MVP-Punkte (Erdung, Materialsprache, Gras-Büschel) ins Register. | WS1S §135 | WS0 | nach MVP hoch | offen |
| FrizzleBob: aktueller ToolBox-Stand (neuer als 14.10.?), Skelett = Rig_Medium? | WS1S §122, §124 F1 | WS0 | nach MVP hoch | offen |
| Hexe bei 30,6 s: `samba_a` oder `house_a` (heute `house_a`). | WS1S §122, §124 F2 | WS0 | später | offen |
| told-of-told: Schema-Entscheid `kfb.world-save/1`. | NPC §6 D-7b | WS0 | später | offen |
| Wind-Modul `kfbWind.js` als `kfb.wind/1` (V-605) annehmen; Besitz WS1-Lead. | BIOME_DRIVE_R1 §1, §8 | WS0 / Lead | später | offen |
| K4/K5-Ausgaben (`50_BLENDER/K4|K5/out`) erreichbar machen. | WS1S §117, §120 | WS0 | später | prüfen |

### 2.12 Offen bei Georg (Entscheidungen)
| Punkt | Quelle | Zuständig | Priorität | Status |
|---|---|---|---|---|
| Token + Passwort-Secret für die Site (= B3). | HANDOFF §2 | Georg | MVP | wartet auf B1 |
| Kampf-Umfang im MVP (= B11). | HANDOFF §5; WS1S §130 | Georg | MVP | offen |
| Abnahmen L-1 Startseite/Vorhang, L-2 Disco-Augen, L-4 Fahrzeug-Look A. | WS1S §129 | Georg | MVP | offen |
| Unter Wasser heller als die Probe? | WATER_R1 Restbefund 6 | Georg | später | offen |
| Wasser-Wertstruktur: Kit-Farben gegen Geländepalette. | WATER_R1 Restbefund 4 | Georg | später | offen |
| Racer-Schwebehöhe sichtbarer (01, 03, 05, 11, 13)? | VEHICLES_R1 §6 | Georg | später | offen |
| Felsen: volle Fließfarbe begrenzen (AD „Seife“) gegen Urteil 20.10. | AD #8; WS1S §117 | Georg | später | offen |
| Ruhige Zone um die Figur in der Biom-Fahrt am Bild beurteilen. | BIOME_DRIVE_R1 §8 | Georg | später | offen |
| Treffer auf die Ork-Band erlauben? | NPC §6 | Georg | später | offen |
| Boost +18 % und viel Luftzeit (22–60 %) so gewollt? | QA P2-5, P3-8 | Georg | später | offen |
| Ideen später: Boombox-Ringe, Fahrer im Dach, Wind als Wegweiser (Leitwind V-605), AD-Top-10 (Fahrspur malt die Welt, Leitlinien, Notan-Prüfansicht u. a.). | WS1S §127; AD_VORSCHLAEGE; VFX_SFX_TOP10 | Georg | später | offen (Ideen) |

---

## 3 · Kürzlich erledigt (nicht mehr offen)
- Schatten PCF statt VSM (Georg „pcf nehmen“, c2e6201, −256 k Dreiecke/Bild).
- Vorwärm-Regression Racer: Fix cc35b7e (Bestätigung in der Reihe = B5).
- Nachthimmel terrain3 folgt der Tageszeit (056e470); Heldenfarbe als Einstellung, Ödland-Käfer wieder rostig-orange (1bce883).
- NPC-Culling Patrouille/Band/Bewohner (c8e55f9); combat- und c2-Test gehärtet.
- Wasser R1 gemergt (842741f, Seen rund, Mündung ohne Loch, Unterwasser, Fahren im Wasser); Fluss-Zackenfix (nur nasse Kacheln).
- Leistung R1: Amphitheater-LOD 59 k, Bodenring 32 Dreiecke, Disco nur im Bild.
- Scheinwerfer: 8 Anker PASS (J-6), Lichtfleck 7 m statt 11 m, Ferne-Aufhellung 8–40 m (6ecffe5).
- WS-NPC: E3 Geschenk-Trupp, G-1 Bot-Augen PASS, G-2 Ja (Blase + Laut gebaut, Zeilen offen), G-3 Skelett-Clips als Übergang ok, Fluffer 0,8 m, Heilschuss-Vorrang (a).
- Ton: Georg-Abnahme PASS mit TUNE; WS0-Töne L1–L15, NPC- und schwere Schritte eingebaut; Begrüßungs-Laut verdrahtet.
- Startseite mit KFB-Vorhang, Ladebalken, Ton- und Qualitätsregler; Adresse ohne Hash landet auf der Startseite.
- Probe (21.10.): QA P1 Schweben 15 % → 5 %, Spawn-Plattform, kurze Speedlines, Handy-Panel, Tempo-Beschriftung, PERF D1–D5, AD „sofort entfernen“ (Blendenflecken, Dunstlinie, Wolkenkanten, Bäume im See, Mischband).
