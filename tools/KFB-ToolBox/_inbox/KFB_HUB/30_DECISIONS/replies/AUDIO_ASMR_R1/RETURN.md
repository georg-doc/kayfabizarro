# Songs und ASMR im Spiel · Rückgabe an WS0 · 31.10.2026 (V-1109)

**Branch:** `game/audio-asmr-r1` @a3e268d4, von `game/integration-r2` @bb87eb11. Nicht gemergt.
**Schalter:** ASMR nur mit `asmr=1`. Die zwei Titel laufen ohne Schalter.
**Gehört hat das niemand:** Geprüft sind Auslösung, Ort, Zeitpunkt und Pegelverlauf in der Aufnahme. Das Hörurteil fällt in Georgs Spielvergleich.

## Aufnahmen mit Ton
Alle aus der Spielkamera, Site-Look, Ton vom gepinnten Speicher, ASMR-Satz vom Testserver.

| Datei | Inhalt und Zeitpunkte (s) |
|---|---|
| `Knete.mp4` | Wagen wächst 1,2 · Squash bei Aufsetzen und Sprüngen 5,8 / 8,9 / 11,7 / 13,1 · Wagen zerfällt in Fluff 18,7 |
| `Goo.mp4` | Goo ziehen 5,7 / 9,3 · Tropfen 7,0 / 10,2 · Blubbern 7,0 · geheilt: Schnurren 14,4, Fluff frei 14,8 · Fleck weg, Reinigen 18,4 |
| `Fluff.mp4` | Ankommen 0,1 / 1,7 / 4,2 / 14,4 · Fluff fällt nach Faustschlag oder fliegt zum Saugarm 0,9 / 2,7 / 11,1 / 13,8 |
| `MiB.mp4` | Turm wächst 6,0 · Anzug 8,3 / 12,2 / 13,8 · Blitz lädt 9,0 |
| `Songs.mp4` | Shepard und Busker als Radio bei Fahrt, danach als Klangbett im Stand |
| `Ohne_Schalter_Vergleich.jpg` | links Ausgangsstand, rechts Branch, ohne Schalter |

## Ereignis-Tabelle
| Ereignis | Datei | Stelle im Code | Begrenzung |
|---|---|---|---|
| Wagen wächst (Rufen, V-533) | K04_clay_grow | `src/m1/M1World.jsx:854` | einmal je Rufen |
| MiB-Turm entsteht | K04_clay_grow | `src/npc/mibEvent.js:167` | einmal je Ereignis |
| Wagen-Squash: Landung, harter Bandenstoß | K02_clay_press | `src/audio/kfbAudio.js:368` | nur ab sichtbarem Stoß; 0,9 s Abstand |
| Figur steht auf (NPC-Gruppe `awake`) | K01_clay_knead | `src/audio/kfbAudio.js:566` | 3 s Abstand |
| Fluffer holt aus (`windup`) | G01_goo_stretch | `src/audio/kfbAudio.js:418` | 2 s Abstand |
| Goo trifft (`impact`) | G02_goo_drip | `src/audio/kfbAudio.js:418` | 2,5 s Abstand; Stärke aus `amount` |
| Fleck entsteht (`taint`) | G03_goo_bubble_pop | `src/audio/kfbAudio.js:418` | 4 s Abstand |
| Fleck verschwindet (`fade`) | G04_goo_cleanse | `src/audio/kfbAudio.js:418` | 2 s Abstand |
| Fluffer geheilt (`healed`) | F02_fluff_purr | `src/audio/kfbAudio.js:418` | 4 s Abstand |
| Fluff frei: Heilung, Gruppe | F01_fluff_rustle | `src/audio/kfbAudio.js:418`, `:566` | 1,5 s Abstand |
| Fluff fällt nach Faust oder Explosion | F01_fluff_rustle | `src/audio/kfbAudio.js:381` | 1,5 s Abstand |
| Fluff fliegt zum Saugarm | F01_fluff_rustle | `src/m1/M1World.jsx:376` | 1,5 s Abstand fasst den Saugstoß zusammen |
| Wagen zerfällt in Fluff | F01_fluff_rustle | `src/m1/M1World.jsx:856` | einmal je Ausstieg |
| Fluff kommt an (Zähler steigt) | F03_fluff_arrive | `src/audio/AudioHost.jsx:114` | 0,8 s Abstand fasst Serien zusammen |
| MiB-Agenten kommen und gehen | M01_suit_rustle | `src/npc/mibEvent.js:192` | 0,9 s Abstand, vier Agenten klingen als einer |
| Blitz lädt vor dem Strahl | M04_flash_charge | `src/npc/mibEvent.js:194` | einmal je Ereignis |

**Für alle gilt:** Bus `sfx`, immer mit Raumposition, höchstens drei Stimmen zugleich, je Materialart höchstens fünf Auslösungen in zehn Sekunden, still ab 25 m. Nichts löst je Bild oder je Partikel aus. Regeln und Prüfung: `src/audio/asmrMap.js`, `test/unit/asmrMap.mjs`.

## Was fehlt
- **Kein Ereignis im Spiel, daher nicht angeschlossen:**
  - K03 Teil rastet ein
  - M02 Sonnenbrille (die Agenten tragen im Spiel keine)
  - M03 Knopf im Ohr
  - B01 bis B05: Die Clips beschreiben einen großen alten Roboter, den gibt es im Spiel nicht
- **MiB-Grundklänge sind auf der Site still:** Der Satz `blobcorp_mib_r1` fehlt im Ton-Speicher, den `scripts/audio/remote.json` festlegt (Turm, Tür, Strahl, Fall). Das galt schon vor diesem Branch. In `MiB.mp4` hörst du deshalb nur die ASMR-Schicht. Der Satz gehört in den Speicher, bevor Georg das Ereignis beurteilt.
- **UFO:** Das Ereignis liegt auf `game/ufo-licht-r1` und ist hier nicht enthalten, also auch ohne ASMR.
- **Shepard in der Cascade Sphere:** WSA wünscht den Vergleich, der Auftrag nennt ihn nicht. Nicht gemacht.

## Punkte für den Spielvergleich
- **Pegel uneinheitlich:** Gemessen ist der Gesamtpegel direkt nach der Auslösung gegen direkt davor, das ist nur ein grober Hinweis.
  - Knet-Druck bei Fahrt: unter 4 dB, geht wohl unter dem Motor unter.
  - Goo: Nur das erste Ziehen hebt sich ab (knapp 5 dB), Tropfen, Blubbern, Reinigen, Schnurren kaum messbar.
  - Fluff: teils 8 bis 10 dB, teils kaum.
  - MiB: 4 bis 8 dB bei den späteren Klängen, Turm und erster Anzug kaum, allerdings ohne Grundklänge.
  - Der ganze Satz liegt schon 4 dB über dem übrigen Pegel der Tonbank.
- **Titel ohne Stichworte:** Die zwei Songs haben keine Biom-Stichworte. Nach einem Biom-Wechsel blendet die vorhandene Regel sie deshalb nach zwölf Sekunden aus, wenn ein passender Titel da ist. Das ist im Fahrtest einmal passiert. Stichworte habe ich nicht erfunden.
- **K01 an `awake`:** Die Zuordnung ist die schwächste der Tabelle, das Ereignis ist echt, der Klang aber „Hände kneten“. In den Aufnahmen kommt sie nicht vor, sie ist also ungehört und ungeprüft im Spiel.

## Teil C · Plan für die Gebäude (noch nicht gebaut)
Quelle: `design/kartengebaeude-r1`, `cascade/r4/runtime.js`, `core.subscribe`.
- **Riss → `G01_goo_house_crack`:** an `shell-hit`, weil dort der Riss in die Wand kommt. Je Gebäude zusammengefasst, damit Gatling-Serien nicht jedes Mal auslösen; Stärke aus `impact.radius`, Ort aus `impact` wie beim VFX-Aufruf.
- **Wackeln → `G02_goo_house_wobble`:** Die Kaskade liefert heute kein Wackel-Ereignis. Der Clip bleibt ohne Anschluss, bis WS-Design echtes Wackeln baut und meldet.
- **Ausbruch → `G03_goo_house_burst`:** an `shell-breach`, dazu `shell-enlarge` mit Abstand.
- **Kennung und Zeit:** `e.id` aus dem Kern, die der VFX-Aufruf (`fx.burst`) schon bekommt, und `e.cell` für das Gebäude. Ton startet im selben Takt wie der VFX, ohne eigene Uhr.
- **Dateien:** Die drei Clips liegen in `melee_destruction_r1_lufs`, im Index des Ton-Speichers stehen sie nicht. Vor dem Anschluss also ein Pin wie beim ASMR-Satz.

## Ohne Schalter
- **Ton:** Der Satz steht ohne `asmr=1` nicht im Index, keine Datei wird geladen (Protokoll: null Abrufe, null Auslösungen). Neu sind nur die zwei Titel.
- **Bild:** gleich. Die Abweichung Ausgang gegen Branch liegt im selben Bereich wie Ausgang gegen Ausgang.
- **Programmliste:** kein neuer benannter Programmname. Die Zahl wird beim Laden festgelegt und schwankt bei beiden Ständen von Lauf zu Lauf (110 bis 117). In einem Durchgang lagen beide exakt gleich bei 115. Ein Lauf-gegen-Lauf-Vergleich der Liste taugt deshalb nicht als scharfer Beweis, Zählwerte kommen in Stufe B. Der Diff enthält keinen Shader- oder Material-Code.
- **Eine Änderung für MiB auch ohne Schalter:** Die Ton-Anbindung wandelt Positionen jetzt in die Form, die `play` erwartet. Heute ohne Wirkung, weil der MiB-Satz fehlt.

## Tests
- PASS: `test/unit/asmrMap.mjs` (neu), `test/unit/engineR2.mjs`, `test/contract-static.mjs`
- FAIL auf diesem Rechner, gleich auf dem Ausgangsstand: `test/unit/audioMixer.mjs` (`siteCopyOnlyWithSite`, `bankFilesExist`), hier fehlen Zwischenspeicher und private Ablage. Die ASMR-Einträge habe ich aus `bankFilesExist` ausgenommen, damit der Test auf WS1 nicht deswegen rot wird.
- Nicht gelaufen: Pflichtliste (läuft beim Merge), `test/audio.mjs` (braucht die private Ablage am Standardpfad), ein voller Site-Build. `scripts/audio/asmr-copy.mjs` prüft alle 40 Dateien gegen den Stand @1c186978 (im Probelauf geprüft, kopiert hat es noch nicht).
- Eigene Aufnahme und Vergleich: `test/audio-asmr.mjs`, `test/audio-asmr-gleich.mjs`.

## Gemeinsame Dateien, die ich angefasst habe
`src/audio/kfbAudio.js`, `src/audio/cueMap.js`, `src/audio/AudioHost.jsx`, `src/m1/M1World.jsx`, `src/npc/mibEvent.js`, `scripts/site/build-site.mjs`, `scripts/audio/vitePrivateAudio.mjs`, `test/unit/audioMixer.mjs`.
Eingetragen in `replies/AUDIO_ROUTING_R1.md` (Tier 0 Nr. 3).
