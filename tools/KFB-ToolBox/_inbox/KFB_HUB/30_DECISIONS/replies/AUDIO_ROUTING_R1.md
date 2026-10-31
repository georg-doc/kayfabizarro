# Audio-Routing R1 · alle Tonquellen im Spiel · WS0 · 26.10.2026 (V-841)

**Tier 0**
1. Ein Besitzer: `src/audio/kfbAudio.js` (ein AudioContext, Busse music / sfx / ui, Master, Stumm, Lautstärke-Regler). Jede Tonquelle läuft über diesen Graphen; nichts spielt daneben.
2. Nie zwei Musiken gleichzeitig: Song-Video > Zonen-Bett > globales Bett. Stimme (KnuckleBob) duckt Musik und Motor.
3. Neue Quellen werden hier eingetragen, bevor sie ins Spiel gehen (Datei, Ablage, Bus, Regel).

## Quellen und Regeln
| Quelle | Ablage | Bus | Regel |
|---|---|---|---|
| Globales Bett zu Fuß | kfb-audio r1 `music/cozy` | music | Modus-Latch (2,5 s), Titel nach Biom/Tageszeit-Tags |
| Globales Bett Fahrt/Flug | `music/mindscape` (S2, S3; V-811) | music | statt Radio-Titeln; `radio=suno` = alte Jukebox |
| Zonen-Bett Mindscape-Kuppel | `music/mindscape` | music | `setMusicZone('mindscape')` beim Eintritt, aus an der Tür (V-835) |
| Zonen-Bett Café | `music/cafe/Cafe Absurde.m4a` (S16, Georg) | music | `setMusicZone('cafe')` im Ring, aus beim Verlassen (V-836/V-841) |
| Song-Video Café-Plakatwand | privat `60_VIDEO/genius_loci_cafe_r1/absinthe_apricot.mp4` | music (`attachMusicElement`) | direkt davor; pausiert das Bett (`musicPause`), KnuckleBob schweigt (`LOCUS.video`) |
| KnuckleBob Fahrzeug-Seele | `soul/vehicle_soul_r1` (48) | ui (`attachVoiceElement`) | Plakette, `voiceHold` duckt Musik und Motor; KB-Knopf = stumm |
| KnuckleBob Genius Loci | `soul/genius_loci_cafe_r1` (29, ohne ankunft_04) | ui | dieselbe Plakette, eigener Pool, schweigt während Song-Video |
| KnuckleBob TV-Spots Straßenrand | beide Soul-Sätze | ui | stumm aus der Ferne, Ton unter 12 m, dann `voiceHold` |
| Fahrzeug- und Welt-SFX | `el/`, `site/` | sfx | Ereignisse (V-807), Präsenz-Schleifen |
| HyperNorm-Engine H15 (Kuppel) | `site-extra/h15` (Claude Design) | – | eigener Ton aus (Soundbed, Binaural; Jukebox nicht gestartet); Klang trägt das Mindscape-Bett |
| Orakel-Clips (Bild-im-Bild) | `heygen/` | ui | clipPip, unverändert |
| Songs Shepard Ascent, Bouncing Busker Groove (V-1109) | `georg-doc/kayfabizarro@fae628c2`, `media/kfb-audio/r1/suno_r2/*.m4a`; Katalog `assets/private` @1c186978 | music | in den Listen Radio (`suno`) und Klangbett (`mindscape`), nie im Kuppel-Bett; feste Korrektur −1,6 und −1,7 dB vor den Bussen; kein Beat-Sync, Tempo und Tonart sind Schätzungen; Stems bleiben privat |
| ASMR-Satz `asmr_r1_lufs`, 40 Clips (V-1109) | `assets/private` @1c186978, `40_AUDIO/elevenlabs_r1/asmr_r1_lufs/`, Prüfsummen in `scripts/audio/asmr-pin.json`; Site: `/kfb-asmr/` | sfx | nur mit `asmr=1`; nur an echten Ereignissen, immer mit Raumposition; Abstand je Klang, höchstens drei zugleich, begrenzte Menge je Zeitfenster; nie je Bild oder Partikel, keine Dauerfläche; Dateien unverändert |

## Offen
- Raumklang in der Kuppel (Gedichtzeilen aus ihrer Richtung, Claude-Design-Idee 2).
- Weitere Song-Videos auf Werbetafeln: gleiche Regel wie die Café-Plakatwand.
