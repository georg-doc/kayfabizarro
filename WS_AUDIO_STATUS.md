# WS_AUDIO_STATUS · Sitzung „WS-Audio“ (spielbare Version mit ganzem Ton)
Auftrag: `BRIEF_WS1_AUDIO_PLAYABLE_R1.md` (V-598). Lead: WS1 „R3F Modul-Host Vertrag“. Empfänger: WS0, Lead.
Neueste Einträge oben. Hier stehen nur Text und Zahlen. Töne, Musik und das Abnahme-Video sind privat und liegen nur lokal.

## 6 · 21.10. · Heil-Video · Schritte und Hüpfer der NPCs · Notiz Fluffer-Größe

- **Heil-Video** (Georg „ja, dreh das Heilen nach“):
  - Ablauf im Bild: windup, spit, impact, taint, drop → Schuss B → healed, burst, fade.
  - MP4 5 MB an Georg, lokale Vorschau-Kombination.
  - Ursache der Fehlschüsse vorher: Taste B zielt in Kamerarichtung, und der Teleport dreht nur die Figur. Das Profil dreht die Kamera jetzt mit (`rotateAzimuthTo`).
- **Schritte und Hüpfer** (WS-NPC baut Ereignisse aus dem echten Sohlen-Kontakt; Georg will Schritte im Ton):
  - Gelesen werden `groups.steps()`, `npc.steps()` und `fluffer.hops()`.
  - Je Quelle wird beim ersten Lesen nur gemerkt; entdoppelt über `id|foot|t` bzw. `id|t`; über 35 m still.
  - Bewohner: Audio-Site-Bänke je Boden (Gras `digital_footstep_grass`, Weg `…gravel`, Platz `foley_footstep_concrete`).
  - Skelette `C06` leise, Spielzeugsoldaten `D04` leise, Bots `C08` leise – Platzhalter, siehe Lücken.
  - Fluffer-Hopser `DF07`.
  - Test `audio`: 4 nachgestellte Schritte/Hüpfer klingen, der alte und der ferne nicht, keine Wiederholung – **PASS**.
  - Die echte Prüfung kommt nach dem Push von WS-NPC.
- **Lücken für WS0** (Bestandsaufnahme WS-NPC, übernommen):
  1. Schritte der Bewohner in Knete je Boden (Gras, Sand/Weg, Fels);
  2. Skelett-Schritt: kurzes Knochen-Tock, leiser als C06;
  3. Spielzeugsoldat: harter Plastik-Marschtritt, dazu das Ticken des Aufziehschlüssels als leise Schleife beim Gehen;
  4. Bot-Schritt: metallisches Stapfen, kombinierbar mit C08;
  5. Dark Fluffer: Goo-Gleiten/Schmatzen als Schleife zwischen den Hüpfern, dazu ein geheilter Hüpfer (heller, ohne Goo);
  6. Bot-Wut: Zorn-Piepen bzw. Überhitzen;
  7. Aufstehen nach K.o.: Knete-Rappeln;
  8. optional: Publikums- und Pausengeräusche für die Ork-Band.
- **Notiz Georg 21.10. → WS1/WS0:**
  - Die Fluffer sollen 30–40 % kleiner sein, damit sie besser zu den KayKit-Figuren passen. `heightM` 1,1 → ≈ 0,7 m.
  - Georg vergleicht gerade 1,1 / 0,8 / 0,7 m; WS-NPC setzt den Wert nach seiner Wahl.
  - Der Ton zieht mit, die Fluffer-Klänge werden 5–8 % höher.

## 5 · 21.10. · Video Gruppen-Ton (lokale Vorschau-Kombination)

**Georg 21.10.:** „mach ein Video mit dem Gruppen-Ton“.
- **Vorschau-Kombination:** terrain/probe-world + ws-npc/phase-a @4625c6e + ws-audio/r1 als Wegwerf-Ordner im Scratch, ohne Branch, ohne Push. Die Konflikte sind nur dort gelöst; offiziell bleibt die Reihenfolge des Lead.
- **Welt:** M1-Standard (`#m1,harvest,look=terrain3,npc,fluffer,patrol,band`). Die NPC-Orte sind nur dort geprüft (WS-NPC).
- **Ergebnis** (alles aus echten Spiel-Ereignissen über Taste B):
  - Skelette, Bots und Spielzeugsoldaten je hit 1–5, aggro, ko, awake, calm, fluff;
  - Dark Fluffer windup, spit, impact, taint, drop;
  - keine Seiten- oder Modulfehler, Audio 0,16 ms/Bild (p95 0,3), 26 Stimmen.
- **Nicht im Video:** das Heilen des Dark Fluffers (healed + Augen-Plopp + bunter Fluff). Der Schuss traf zweimal nicht; der Adapter ist im Test belegt.
- **Video:** MP4 17 MB an Georg (privat). Profil: `PW_GPU=1 npm run audio:video:gruppen`, nur in der Kombination lauffähig.

## 4 · 21.10. · Gruppen-Ton für die NPC-Gruppen

**Georg 21.10.:** „mach weiter mit dem Gruppen-Ton“. **Stand:** `ws-audio/r1` @6d4c43c, lokal.
**Quelle:** WS-NPC 21.10. Gelesen wird `mods.groups.events()`, ein Ringpuffer mit `{ type, id, n?, at:[x,z], tag?, t, group }`. Er wird alle 0,1 s abgefragt und über `group|type|id|t` bzw. `tag` entdoppelt. Die Ereignisse kommen nur aus der Spielerblase. Bei WS-NPC ist keine Änderung nötig.

| Gruppe | hit (Stufe n hebt an) | aggro | ko | awake | calm | fluff |
|---|---|---|---|---|---|---|
| skeleton_patrol | C06 skeleton_clatter | C06 + M02 club_whoosh (Ausholen) | C06 + C01 body_fall + M08 dizzy_stars | M09 getting_up + C06 leise | C06 leise | E05 fluff_scatter |
| toy_squad | D04 toy_plastic_bounce | X06 holster_draw (Waffe ziehen) | K06 cartoon_bonk + D04 + M08 | M09 | X06 leise (wegstecken) | E05 |
| bot_crew | C08 bot_servo | C13 bot_angry (WSA-Kampf) | C14 bot_collapse (WSA) + M08 | C08 + M09 | C08 leise | E05 |

- **Tests:**
  - `audio-mixer`: alle 18 Kombinationen haben Ton, die Stufe n wirkt, die Schlüssel stimmen – **PASS**.
  - `audio` (Browser): 18 Kombinationen direkt (26 Klänge). Danach der Abfrage-Weg wie bei WS-NPC über ein Prüfmodul `mods.groups`: 3 Ereignisse genau einmal, beim zweiten Lesen keine Wiederholung – **PASS**.
- **Zusammenführung mit WS-NPC** (für den Lead), Probe mit `git merge-tree`, ohne Last:
  - `terrain/probe-world` und `ws-npc/phase-a` stoßen schon untereinander zusammen, in `package.json` und `m1-terrain.js`. WS-NPC enthält probe-world noch nicht.
  - Dazu kommt `M1World.jsx` mit den 3 AudioHost-Zeilen.
  - Alle Teile von WS-Audio sind additiv und klein.
- **Gruppen-Lücken (an WS0, optional):**
  - ein eigenes Skelett-Knochen-Zerfallen für das K.o.;
  - ein Spielzeugsoldaten-Ruf ohne Worte;
  - ein Bot-Piepser ohne Arcade-Ton.
  - Bis dahin klingt es mit den vorhandenen Sätzen.

## 3 · 21.10. · WS0-Lieferung ws_audio_gaps_r1 eingebaut · Kampf-Video

**Georg 21.10.:** „mach ein neues Video mit dem Kampf-Ton“.
**Stand:** `ws-audio/r1` @cf59913 + Video-Profil, lokal.

**Eingebaut** (die 20 Töne von WS0; Pegel aus `ws_audio_gaps_r1_lufs/lufs_report.json`, −16 LUFS, geht vor der Spitzen-Normierung):
| Ton | Anschluss |
|---|---|
| R01–R04 hover_over grass/sand/rock/water | Racer am Boden: Schleife je Untergrund (Hang/Fels/Gras/Talboden wie `terrainDustColor`, Wasser = Fluss nah oder Meer), nach Tempo überblendet, in der Luft aus |
| R05 drift_slide_loop · R06 drift_charge | Drift: Rutschwinkel aus Lage gegen Fahrtrichtung (nur lesend); `driftCharge`-Ereignis aus k2t |
| R07 hover_brake_hiss | Bremsbeginn ab 6 m/s |
| S01 wading_steps | Schritte im Wasser statt Untergrund-Bank |
| K02 bomb_throw | K10 release Bombe |
| K03/K04/K05/K07 impact metal/glass/clay/domino | K10 contact nach `material` |
| K06 debris_tail · K08 leaves_burst | Explosion (Obstgarten und K10) · Baumtreffer am Obstgarten |
| K01 rocket_flight_loop | liegt bereit (`k10.rocketLoop`), sobald die Arena den Raketenflug meldet |
| A02 coastal_birds_loop | am Meer (Biom beach), nicht nachts |
| A01 jungle_night · A03 thunder_dry | liegen bereit; es gibt noch kein Dschungel-Biom bzw. Wetter |

- **Obstgarten V/B/N** läuft jetzt über die Kampf-Tabelle:
  - Faust: Schwung (M01) → Schlagring + Baumschütteln + Laub;
  - Blaster: Abgang in 3 Ebenen → Bolzen-Einschlag nach Flugzeit;
  - Explosion: C08 + Holzsplitter + Laub + Trümmer-Ausklang.
- **Noch offen bei WS0:** Combat-AV L1–L13, u. a. Bogen, Armbrust, Cast, Spieler-Bonk, Kill-Pop.

**Kampf-Video** (an Georg, privat; `PW_GPU=1 npm run audio:video:kampf`):
- MP4 H.264/AAC, 960×540, 20 MB, knapp 2 Minuten.
- Ton in 99,7–100 % der Bilder messbar, keine Seiten- oder Modulfehler.
- Hauptthread im Mittel 0,16–0,21 ms, p95 ≤ 0,4 ms.
- Teil 1, Obstgarten: Schuss und Explosion treffen den Baum. Die Faust trifft im Skript nicht, weil der Abstand zum Baum zu groß ist; zu hören ist dann der Schwung.
- Teil 2, Hörprobe der Arena-Waffen: per Prüfskript ausgelöst, weil die Arena noch nicht im Spiel ist. Das steht so im Bild.
- Teil 3, Fahrt: Racer über Gras/Sand, Drift-Schleife (max. 0,68), Drift-Boost und Bremszischen. Im Testfeld springt der Racer oft über Rampen.

**Tests:** `audio-mixer` PASS, `contract-static` PASS, `audio` (Browser, inkl. Untergrund-Schleifen am Boden) PASS.
**NPC-Anschluss** (WS-NPC 21.10.):
- Gruppen-Ereignisse über `mods.groups.events()`: hit, aggro, ko, awake, calm, fluff für skeleton_patrol, toy_squad und bot_crew.
- Dark Fluffer über `debug().events`. Beides wird per Polling gelesen, bei WS-NPC ist keine Änderung nötig. Den Gruppen-Ton baue ich als Nächstes ein.

## 2 · 21.10. · Kampf-Tabelle aus Combat-AV R1 im K10-Adapter

**Lead 21.10.:** Die Cue-Tabelle aus `research/audits/COMBAT_AV_R1.md` (VFX/SFX-Sitzung, Prototyp `ws1/combat-av-r1` @d408688) geht als Daten in `kfbAudio.k10`, ohne zweite Engine.
**Georg 21.10.:** „mach weiter mit der Kampf-Tabelle“.
**Stand:** `ws-audio/r1` @2c0272f, lokal.

- **Abgang je Waffe** (`WEAPON_LAUNCH`/`LAUNCH` in `src/audio/cueMap.js`):
  - gilt für die 13 Arena-Figuren, Zuordnung wie `_launchCue()`;
  - Ebenen Anschlag, Körper und Ausklang mit denselben Dateien, Pegeln, Versätzen und Tonhöhen wie der Prototyp r2.

| Waffe | Anschlag | Körper / Ausklang |
|---|---|---|
| Pistole | C05 a/b | X09_a +60 ms ×0,23 |
| Blaster | X01 a/b | C05_c +10 ms ×0,48 · X09_a +70 ms ×0,23 |
| Gewehr, Soldat r3d | C05 c/a, Tonhöhe ×0,85 | X09_a +60 ms ×0,27 |
| Gatling | C05 a/b/c ×0,42, Tonhöhe ×1,25, höchstens 9/s | dazu Schleife X02 (loopKeep), endet 180 ms nach dem letzten Schuss |
| Armbrust (Platzhalter L2) | M01_b ×0,86, Tonhöhe ×1,3 | T03_a +20 ms ×0,57 |
| Bogen (Platzhalter L1) | T03_b ×0,95, Tonhöhe ×1,15 | – |
| Zauberstab, Stab, Skelettstab, raise (Platzhalter L4) | X03 a/b ×0,67 | X09 +90 ms ×0,27 |
| Klinge | M01 a/b | Schwung immer vor dem Treffer (Regel R5) |
| Wurf, Rauchbombe | T03_a | Rauchbombe beim Aufschlag T08 (statt des fehlenden `impact.kinetic.air`) |

- **Gegner:** Der Wurf ist ein C04-Whoosh statt der Arcade-Kanone, Pegel ×0,4 (≈ −8 dB, Regel R3).
- **confirm.hit** gibt es nur bei eigenen Treffern auf Gegner, nicht bei eigenem Schaden und nicht bei der Rauchbombe.
- **Bisher stumm, jetzt mit Ton:** weaponDrop → I05; jump/land → C02/C01.
- **Weiter stumm** (Lücke): Kill/Schädel L9; Spieler-Treffer L8, bis dahin C01 punch_light leise.
- **Einsatz:** Die Bank plant 5 ms nach dem Aufruf (Regel R2 ≤ 20 ms; die Ausgabelatenz des Geräts ist nicht mitgemessen).
- **Tests:**
  - `audio-mixer`: Zuordnung aller 13 Waffen, Ebenen, Gegner −8 dB, confirm, Gatling, Rauch – **PASS**.
  - `audio` (Browser): jede Waffe spielt ihre Ebenen (Blaster 3, Pistole 2 …), Gegner 1, Klinge mit Schwung, Rauch, 12 Gatling-Schüsse mit Schleife, Bank danach ≤ 24 Stimmen – **PASS**.
- **Offen** (aus Combat-AV, nicht WS-Audio):
  - Ankündigung der Gegner, Lücke L13 Ausholen;
  - Motor-Ducking −4 dB bei schweren Treffern;
  - Lautheits-Normierung −16 LUFS durch WS0. Der Bericht hält fest, dass die Laufzeit-Normierung mit ±12 dB die Spanne von 30 LU nicht abdeckt.
- **Volle Reihe auf @2c0272f:** 33 von 48 grün, rot ist nichts.
  - g4 lief in der Kette einmal in ein Bildschirmfoto-Timeout (Last 22–24); allein ist g4 **PASS**.
  - Die übrigen 14 (g4preview … probeWater) sind auf Wunsch des Lead angehalten, damit er die Maschine bekommt. Sie folgen einzeln.
- **Anschluss im Spiel:** Die Arena-Module müssen ihre Ereignisse an `kfbAudio.k10({ type, weapon, side, target, energy, explosive, material, confirmed, position })` geben. Sobald K10 im Spiel ist, ist das eine Zeile beim Besitzer.

## 1 · 21.10. · Tier 0 steht lokal: ein Ton-Pfad, ganzer Ton auf dem Probe-Gelände

**Stand:**
- Branch `ws-audio/r1` im lokalen Repo `kfb-planet`, Commit 3929575, rebased auf `terrain/probe-world` @ba94c9d (Lead 21.10.: __RIVA behoben, Fahrzeug-Look A).
- Nicht gepusht und nicht nach main gemergt. Push erst nach WS0-Go, Merge nur mit Georg.
- Georg hat das 2-Minuten-Video mit Ton bekommen, auch als Handy-Fassung (MP4 H.264/AAC, 960×540, 17,7 MB). Die Abnahme durch sein Ohr steht noch aus.

**Volle Fassung lokal starten (ein Befehl):**
```
cd ~/kfb-ws1/kfb-planet/.claude/worktrees/affectionate-nash-61b1ea && npm run ton
```
- Öffnet `#m1,harvest,look=terrain3,world=probe` (zu Fuß).
- `npm run ton:fahrt` öffnet dasselbe mit `,car,fly` (Fahrt und Flug).
- Der Ton wird nach der ersten Taste oder dem ersten Klick hörbar.
- Unten links liegt der Knopf ♪ mit je einem Regler für Gesamt, Musik, Effekte, Atmo und UI, dazu „Ton aus“.

### Was läuft
- **Ein Ton-Pfad** (`src/audio/kfbAudio.js`):
  - genau ein AudioContext;
  - Busse Musik, SFX, Atmo und UI → Master → Sicherheitsbegrenzer → Ausgang;
  - Ducking: Musik −7 dB unter lauten SFX (Kampf, Crash, Explosion), −9 dB im Dialog, −2 dB beim Boost; die Atmo senkt sich unter Musik und Kampf selbst (kfb-ambience.v1);
  - Entfernungsdämpfung mit inverse-Abstand plus Tiefpass;
  - der Hörer sitzt an der Figur bzw. am Racer und schaut in Kamerarichtung.
- **WSA-Laufzeit-Pakete zuerst und 1:1 übernommen.** Quelle ist Audio Site 0.7.6, `kayfabizarro@945518d3`, `tools/KFB-Audio-Site/dist`; die Töne kommen aus `WSA_AUDIO_FLIGHT_CRASH_R1`.
  - Racer: Motor-Gitter L1–L5 mit Gängen und Schubabschaltung (V-378), Flug in den Arten jet, turbine und antigrav, Wind nach Tempo.
  - Kampf: C01–C18.
  - Atmo kfb-ambience.v1 (V-458, CC0).
  - Schritte (Foley- und Digital-Bänke).
  - Zwei kleine Patches, im Dateikopf vermerkt: die Atmo bekommt `moveWaterEmitters` (Quellen gleiten mit dem Hörer, statt neu zu starten); die Schritte bekommen `assetBaseUrl` und `surfaces`.
- **Tonbank** für die übrigen ElevenLabs-Sätze:
  - je Clip normalisiert (`normalize_report.json`);
  - Varianten im Wechsel, ±3 % Tonhöhe;
  - Pool mit 24 Stimmen.
- **Jukebox:**
  - Suno-Jukebox bei Fahrt und Flug, Cozy Tunes zu Fuß (V-129);
  - Zufallsfolge ohne direkte Wiederholung, 3 s Überblendung;
  - Wechsel erst nach 2,5 s im neuen Modus;
  - gestreamt, nicht dekodiert.
- **Laden:**
  - Der Ton lädt 2 s nach dem Weltstart still im Hintergrund.
  - Hörbar wird er erst nach der ersten Eingabe (Browser-Regel).
  - Zonenweises Lazy-Load gibt es noch nicht: Racer, Kampf, Atmo, Schritte und Bank laden einmal komplett (≈ 18 MB). Die Musik wird gestreamt.
- **Anschluss** (`src/audio/AudioHost.jsx`, liest nur, verändert keinen Spielzustand):
  - Modus: zu Fuß, Fahrt oder Flug;
  - Tempo, Gas, Drehzahl und Gang (vehicleRig);
  - Gangphase → Schritte, Untergrund Stein (Platz), Sand, nasser Lehm (am Fluss) oder Gras;
  - `M2EVENTS`: Abheben, Landen, Aufprall, Boost, Drift-Boost, Zwei-Rad, Trick, Respawn;
  - Obstgarten V/B/N, mit Treffer aus `HARVEST_STATE.last`;
  - Fluff gesammelt, Fundsache aufgehoben (UI);
  - Wasser des Probe-Geländes: der nächste Fluss, Fall und Meerpunkt positional; Biom-Teppich meadow/pond/beach nach Nähe zu Bergsee bzw. Meer.
- **Private Töne nie öffentlich:**
  - Sie kommen nur über den lokalen Vite-Server (`/@kfb-audio/`, `scripts/audio/vitePrivateAudio.mjs`).
  - Im Build (`dist`) steckt keine Tondatei.
  - Ohne den lokalen Server, also in dist und in der Vorschau, klingt das Spiel wie bisher: Motor und Saugarm über die öffentlichen Dateien, jetzt über den SFX-Bus.
  - Im Repo liegt keine Tondatei; das prüft `test/unit/audioMixer.mjs`.
- **Geändert in fremdem Code**, jeweils additiv und klein:
  - `M1World.jsx`: 3 Zeilen, AudioHost eingehängt;
  - `m1-terrain.js`: `hydro()` lesend;
  - `engineAudio.js` und `suckAudio.js`: Ausgang auf den SFX-Bus; in der vollen Fassung übernimmt der Racer den Motor;
  - `vite.config.js`: Ton-Server und `test/out` vom Beobachten ausgenommen.

### Zuordnung Ereignis → Datei
| Ereignis (Spiel) | Besitzer | Datei(en) |
|---|---|---|
| Fahrt: Motor nach Drehzahl/Last | WSA-Racer | L1_idle · L2_low · L3_mid · L4_high · L5_overrun (Gitter, Gänge 1–4 aus vehicleRig 1–5) |
| Fahrt: Schalten | WSA-Racer | O1_upshift · O4_downshift_blip · O2b/O2c backfire |
| Fahrt: Gas weg bei hoher Drehzahl | WSA-Racer | crackle-1…4 |
| Boost, Drift-Boost | WSA-Racer | O5_boost (Boden) · P04_boost_ignite_a/b (Flug) |
| Abheben (takeoff, launch, fly) | WSA-Racer | F4_takeoff |
| Flug Racer | WSA-Racer | P01_jet_thrust (Düse) · P02_turbine_fan (Lüfter) · P05_antigrav_hum (Schweben) + P03_exhaust_rumble + F3_wind_rush_loop |
| Schwebeflug zu Fuß | WSA-Racer | P05_antigrav_hum + P02 + F3_wind_rush_loop nach Tempo |
| Landung hart / weich, Flug-Landung | Bank | debris_crash_r1 K03_belly_landing / D06_dust_settle / D05_fluff_land |
| Aufprall hart / weich, Anstupsen | Bank | debris_crash_r1 K01_car_crunch / K06_cartoon_bonk |
| Zwei-Rad | Bank | debris_crash_r1 K02_wing_scrape |
| Trick (Fassrolle) | Bank | throwables_r1 T03_throw_whoosh |
| Respawn | Bank | beam_ufo_r2 B14_teleport_in |
| Schritte | WSA-Schritte | digital-grass · foley-concrete (Platz) · sand · wet-clay (am Fluss) · foley-gravel (steil) |
| Sprung / Landung zu Fuß | Bank | creatures_r1 C02_cloth_rustle / C01_clay_body_fall |
| V Faust (Treffer / leer) | WSA-Kampf | C03 brass_knuckles + C12 tree_shake / C04 swing_whoosh |
| B Schuss | WSA-Kampf + Bank | C05_blaster_primary + blaster_r1 X07_bolt_impact_clay (Einschlag nach Flugzeit) |
| N Explosion (Treffer / leer) | WSA-Kampf / Bank | C08_explosion_small + C15_wood_splinter / throwables_r1 T05_cartoon_explosion |
| K10 fire | WSA-Kampf | C05 blaster · C06 rocket_launch (je Waffe) |
| K10 cast / release | Bank | throwables_r1 T03_throw_whoosh / T11_brickfish_throw (Bombe: + T02_bomb_fuse_sizzle) |
| K10 Kontakt | WSA-Kampf / Bank | C01/C02 punch, C03 knuckles, C08/C09 bei explosive, C10 hit_confirm / X07_bolt_impact_clay |
| K10 weaponDrop | Bank | interactions_r1 I05_tool_drop |
| Saugarm charge / plop / swallow | suckAudio (wie bisher) | fluff_suction_r1 S01+S02 / S03–S05 / S06 |
| Dark Fluffer windup · spit · impact · taint | Bank | dark_fluffer_r1 DF01 · DF02 · DF03 · DF04 |
| Dark Fluffer drop (Fluff-Fall) | Bank | DF05_tainted_fluff_thud + DF06_tainted_fluff_sink |
| Dark Fluffer healed | Bank | DF09_heal_transform + DF10_eyes_pop_white (Augen-Plopp) + DF11_healed_happy_squeak |
| Dark Fluffer burst (bunter Fluff) · fade | Bank | DF12_colorful_fluff_release · DF14_patch_cleanse |
| Fluff gesammelt / Fundsache | Bank (UI-Bus) | reward_r1b R06b_fluff_collect / R01b_card_pickup |
| Atmo-Teppich | WSA-Atmo | meadow-1/2 (Tag) · wind-1/2 (Nacht) · pond-1/2 (am Bergsee) · Brandung wave-1…4 (am Meer) |
| Tierstimmen | WSA-Atmo | bird · chirp · cricket · frog (Zufall nach Tageszeit `tod=`) |
| Wasser positional | WSA-Atmo | river-long (Fluss) · waterfall (Fall) · wave-1…4 (Meer) |
| Farm an den Obstgärten | Bank (Atmo-Bus) | farm_r1 F01_farm_morning_atmos (Schleife, positional, nicht nachts) |
| Musik Fahrt/Flug · zu Fuß | Jukebox | music/suno-roadtrip-jukebox-v2 · music/cozy-tunes-classics |

### Was fehlt
**Töne (Bitte an WS0, nichts selbst synthetisiert):**
1. ~~Untergrund-Ton der Racer~~ geliefert (ws_audio_gaps_r1, Eintrag 3): Rollen/Schweben über Gras, Sand, Fels und Wasser-Gischt, je eine Schleife. Die Racer schweben, der Brief verlangt aber „Reifen je Untergrund“.
2. ~~Drift~~ geliefert: Rutschen bzw. Schleifen als Schleife, dazu Drift-Laden (`driftCharge`).
3. ~~Bremsen~~ geliefert: eine spielbare Schwebe-Bremse bzw. ein Luftzischen. `S2_brake_downshifts` ist nur Referenz. Hörbar ist bisher nur das Runterschalten.
4. ~~Schritte im Wasser~~ geliefert (S01).
5. Kampf: Combat-AV-Lücken L1–L13 (Prompts im Bericht COMBAT_AV_R1, u. a. Bogen, Armbrust, Cast, Spieler-Bonk, Kill-Pop, Gatling-Anlauf, Gegner-Ausholen) und die Liste der WSA aus `combat/WS0_GAPS.json` (12 Wünsche, u. a. Block, Raketen-Flug als Schleife, Bombenwurf, Metall, Glas, Lehm-Aufprall, Trümmer-Ausklang, Einzel-Domino, Laub, Obstfall).
6. Atmo: die Liste der WSA aus `ambience/WS0_REQUESTS.md` (Dschungel-Nacht, Küstenvögel, Donner trocken).

**Spiel-Anschlüsse (keine Töne, die Töne liegen bereit):**
- **Wetter:** Das Spiel hat keinen Wetterzustand. Regen, Gewitter und weather_time W04–W06 werden gekoppelt, sobald es einen gibt. Die Tageszeit ist angeschlossen (`tod=`).
- **Dioramen** (atmos_dioramas A01–A07): Auf dem Probe-Gelände gibt es noch keine Diorama-Orte.
- **Bewohner-Tätigkeiten** (farm, alchemy, creatures positional): Die Bewohner kommen mit WS-NPC.
- **Dark Fluffer:** Der Adapter ist fertig und getestet. Er liest die Ereignisse des Moduls über `mods.fluffer.debug().events`, sobald WS-NPC Phase C mit diesem Branch zusammenkommt; auf `terrain/probe-world` gibt es den Fluffer noch nicht.
- **K10:** Der Adapter `kfbAudio.k10(e)` ist fertig und getestet. In diesem Repo gibt es noch keine Arena-Module, die die Ereignisse senden. Hit-Stop und Zeit bleiben beim einen Besitzer (V-567); hier entsteht kein eigener.
- **Lazy-Load je Zone:** fehlt noch, siehe oben.
- **Schwebeflug zu Fuß:** Im Video ist kein Abheben zu Fuß zu sehen (Doppel-Leertaste im Testskript griff nicht). Der Wechsel Cozy → Suno beim Abheben ist im Browsertest belegt.

### Messwerte (headless Chromium mit GPU, 1280×720, lokaler Server)
**Hauptthread für den Ton** (je Takt, gemessen in `frame()`):
- Mittel 0,17–0,22 ms;
- p95 0,2–0,4 ms;
- einzelne Spitzen 2,4–5,6 ms, beim Anlegen neuer Wasser- bzw. Farm-Quellen;
- Ziel ≤ 1 ms je Bild ist eingehalten (Mittel und p95).

**Stimmen gleichzeitig:**
- Fahrt 22–34;
- zu Fuß 27–32, im Kampf bis 41;
- davon 19 Racer-Schleifen, die zu Fuß stumm laufen;
- Grenzen: Bank 24, Kampf 24, Atmo 24, Racer 16 Einzeltöne.

**Ladezeit:**
- Index 0,4–0,8 s;
- Musik hörbar ≤ 1 s nach der ersten Eingabe;
- Racer, Kampf, Atmo und Schritte 3,5–5,6 s, wenn der Cache warm ist, und bis 16 s, wenn sie parallel zum ersten Laden der Welt kommen;
- Bank (68 Clips) 0,5–1,7 s.

**Ausgangspegel** (RMS am Master): Fahrt ≈ −29 dBFS, zu Fuß ≈ −41 dBFS (Cozy leiser; Regler im Panel).

**Video:**
- 2 × 60 s;
- Ton in 99,9 % bzw. 99,7 % der Bilder messbar;
- 83 Schritte zu Fuß;
- 22 Fahrzeug-Ereignisse;
- keine Seitenfehler, keine Modulfehler.

### Prüfungen
- `test/unit/audioMixer.mjs` (in `npm test`): **PASS**. Geprüft werden Busse, Ducking, Regler, Musikliste je Modus mit Nachlauf, Zufallsfolge, Varianten, Entfernung, Stimmen-Pool, Zuordnung vollständig, alle 7 Dark-Fluffer-Ereignisse, die 5 K10-Ereignisse, Wasser-Ortung, Untergrund, Pfad-Schutz des Ton-Servers, keine Tondatei im Repo, jede Bank-Zeile findet echte Dateien.
- `test/audio.mjs` (Browser, `PW_GPU=1 npm run test:audio`): **PASS**. Geprüft werden: still vor der Eingabe, ein AudioContext, alle Module, Cozy zu Fuß, Schritte, Atmo + Wasser, Kampf, die Adapter K10 und Fluffer, Ducking, Stimmen-Grenze, Suno bei Fahrt, Gänge und Drehzahl, ≤ 1 ms.
- `npm test` (volle Reihe):
  - Auf @73d7790 brach die Reihe an `contract-static: debugOnlyKfbGlobals` ab. Ursache war `window.__RIVA` im Basis-Branch, nicht WS-Audio.
  - Nach dem Rebase auf @ba94c9d ist `contract-static` **PASS**, `audio-mixer` ist **PASS**.
  - Einzeln **PASS** (nur ein Test zur Zeit, Lead-Wunsch): deps, host, s0, s1, s5a, s5b, preview. s5a fiel einmal unter Last 40–80 durch und läuft allein grün.
  - Die volle Reihe kommt, sobald WS-NPC mit seiner Reihe fertig ist.
- Abnahme-Video: `PW_GPU=1 npm run audio:video`, Ausgabe nur lokal in `test/out/audio/`.
