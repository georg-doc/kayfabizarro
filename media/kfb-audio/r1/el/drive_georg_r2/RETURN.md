## Georgs Klarstellung · 28.10.2026

Georg bestätigt: **„Noch nicht vorhanden; Vergleich vorerst ohne V-903“.** Der bestehende Vergleich ohne `engine_georg_r1` ist damit ausdrücklich freigegeben. V-903 ist keine offene Rückfrage und keine Voraussetzung für diesen Vergleich mehr. Die vorhandenen `baseline_partial`-WAVs bleiben unverändert; ihr Name dokumentiert weiterhin den tatsächlichen Umfang (ohne V-903). Ältere Aussagen unten, V-903 müsse vor dem nächsten Schritt ergänzt werden, sind hiermit überholt. Historische Manifest-/Mapping-Hinweise auf den fehlenden Satz bleiben Bestandsbeschreibung, kein aktueller Blocker.

**Nächster Schritt:** tatsächliche Hörprüfung und Rollenbestätigung des vorhandenen Pakets ohne V-903. Keine neue Audioerzeugung und kein Spieleinbau durch diese Klarstellung.

---

# WSA → WS0 · V-908 · 28.10.2026

**TECHNISCHES KANDIDATENPAKET — HÖRPRÜFUNG UND ROLLENBESTÄTIGUNG OFFEN. Kein Spielcode geändert. Nicht als fertiges Sounddesign oder vollständige V-908-Abnahme behandeln.**

Owner: KFB Audio/WSA liefert Assets; WS0 besitzt Einbau, echte Fahrdaten, Raum und Timing. Repo `georg-doc/kayfabizarro`, Branch `assets/kfb-audio-r1`, Ordner `media/kfb-audio/r1/el/drive_georg_r2/`. Kein neuer Runtime-Owner, keine Site-Veröffentlichung, kein Merge.

## Geliefert

- Alle 46 Originale (662 Sekunden, 15.95 MB) vermessen und mit SHA-256 erfasst. 46 verschiedene Datei-Hashes; das beweist keine klangliche Einzigartigkeit. Keine Originaldatei geändert oder gelöscht.
- Zwölf technische Schleifen-Kandidaten: je zwei `body`, `grit`, `stutter`, `whine`, `skid`, `cockpit`; alle 4 Sekunden, FLAC PCM16 mono 44.1 kHz.
- Neun Ereignis-Kandidaten: je drei `shift`, `skid`, `stutter`; je 1.2 Sekunden, MP3 128 kbps mono. Diese Ausschnitte stammen aus Energiesprüngen; sie sind **keine bestätigten Gangwechsel/Reifen-Anschläge**. Keine erfundenen separaten Anschlag/Körper/Ausklang-Stems. `pass` nicht behauptet, Vorhandensein ungeprüft.
- `source_inventory.json` enthält für jede Quelle Spektralanteile, Schwerpunkt, Flachheit, Pegelschwankung, Kanal-Korrelation, Mono-Verlust, geeignetstes stationäres Fenster und Auswahlgrund. Vollständige Quellenliste auch in `QUELLEN.md`.
- `manifest.json`: genaue Schnittzeiten, Original-IDs, Überblendungen, Ausgabe-Hashes und Messwerte. Die Kandidaten sind nach stationären Fenstern innerhalb von Dateinamen-Hypothesen gewählt, **nicht durch Anhören**. Auch „Reserve“ bedeutet nicht „klanglich unbrauchbar“.
- `drive_georg_r2.mapping.json`: alle sechs bestehenden Presets v8/dragster/hotrod/heavy/jet/hover; Rollen, Auslöser, Referenzwerte, Überblendung, Bus, Pegel, Varianten/Jitter und Bestandsstrategie. Vorschlag, kein eingebauter Vertrag.

## Technische Nachweise

117 automatische Prüfungen bestanden, null fehlgeschlagen: Quellen-Hashes unverändert, 21 Ausgaben Mono/44.1 kHz, 21 Kodierprüfungen, 21 Ausgabe-Hashes, Index-/Mapping-Referenzen, sechs Presets und vier Lautheitsvergleiche. `validation.json` enthält einzelne Checks.

Schnitt-Lautheit −16.45 bis −16.00 LUFS; höchste 4×-Oversampling-Spitze −1.78 dBFS. FLAC-Nähte: maximaler Sprung nur 0.441 des internen 99.9%-Sample-Differenzwerts. Das ist ein numerischer Nahtnachweis, keine Garantie gegen hörbare periodische Textur oder Klangänderung. 250 ms zyklische Überblendung, kein MP3-Loop. Bei >3 dB Auslöschung im Monomittel wird der stärkere Originalkanal gewählt, keine pauschale Phasenumkehr.

21 Audio-Dateien: 2,306,071 Bytes komprimiert, 10,372,320 Bytes bei vollständiger Mono-Float-Dekodierung. Vorschlag: nur ausgewählte Varianten des aktiven Presets laden (höchstens sechs neue Loops ≈4.04 MiB), Ereignisse bedarfsgerecht. Keine gemessene Laufzeitverbesserung behauptet. Lokaler freier Speicher vor Paketierung: rund 36 GiB.

## Formatgrenze für WS0

Der aktuelle Lader in `src/audio/kfbAudio.js` verwendet ausschließlich `set.ext`. Deshalb listet der neue `sets.drive_georg_r2`-Eintrag nur die zwölf tatsächlich vorhandenen FLAC-IDs mit `ext: flac` und `gainDb: 0` (Lautheit bereits eingerechnet). Die neun MP3s stehen separat in `eventFiles` und im Manifest. **Vor Ereignis-Anbindung muss WS0 explizite Dateipfade/Endungen unterstützen oder einen getrennten homogenen Ereignissatz anlegen.** Keine MP3-ID als vermeintliche FLAC im `files`-Array. Der aktuelle Cue-Plan referenziert diesen neuen Satz nicht; kein automatischer Einbau durch diesen Auftrag.

Spielquelle gelesen: `georg-doc/KFB-Stunt-Car-Race`, `game/proc-world-ws0` @ `c3212e261433dd4f545b4a77b5e7f0c331106af1`. Bestehende R2-, Offload-, Wind-, Drift-, Brems- und Oberflächentöne bleiben bis zur Rollenprüfung erhalten. Keine neuen synthetischen Reifenklänge. `hover` erhält keine erfundene Reifenreibung; Raum und HRTF bleiben bei WS0.

## Hörproben (Dropbox, nicht öffentlich hochgeladen)

Arbeitsordner: `~/Dropbox/CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/drive_georg_r2/`.

`HOERPROBEN.html` bietet Einzelkandidaten, Links auf die unveränderten Originale und diese WAVs:

- `auditions/dragster_baseline_partial.wav`
- `auditions/dragster_candidate_layers.wav`
- `auditions/hover_baseline_partial.wav`
- `auditions/hover_candidate_layers.wav`

Je 24 Sekunden; Anfahren 0s, Schaltmarker 6/12s, Driftphase 14–19s, Gas weg 20s. Alle auf −23.00 LUFS mit Spitzen unter −6.9 dBFS, damit der Vergleich ohne unterschiedliche Lautheit/zusätzlichen Limiter möglich ist. Einzelassets bleiben auf etwa −16 LUFS.

**Offline-Materialstudien, kein Mitschnitt des Spiels und keine exakte Nachbildung seiner nichtlinearen Audiokette.** Neue Rollen unbestätigt; bestehende Schaltklänge bleiben in diesen Studien. Vollständige Gleichheit mit Mapping/Spiel wird nicht behauptet. Die künstlichen Schaltmarker der Hover-Studie autorisieren keine erfundenen Flugzeug-Gänge. Kein Test mit echten Kopfhörern/Lautsprechern oder echter Fahrphysik.

## Offene Anforderungen / nächster Schritt

1. Tatsächliches Anhören aller 46 Quellen, semantische Rollenprüfung und klangliche Auswahl fehlen. Besonders `skid`/`shift` können derzeit Mischklänge oder andere Ereignisse enthalten. Kandidaten nicht ungeprüft in echte Ereignisse verdrahten.
2. `engine_georg_r1` aus V-903 fehlt im gelesenen aktuellen Ton-Index und vorgesehenen lokalen Ordner. Die Rückfrage an Georg ist gestellt. Der geforderte vollständige A/B-Bestand kann damit nicht hergestellt werden; WAVs heißen ausdrücklich `baseline_partial`.
3. Attack/Body/Tail-Isolation und Doppler-Verfügbarkeit sind offen; technische Spektralmessung ersetzt diese Hörentscheidung nicht. Gameplay-Timing und räumliche Wirkung wurden nicht geprüft.

**Ein nächster Gate:** WS0 bzw. ein hörfähiger Audio-Prüfer bestätigt die tatsächlichen Rollen anhand des Hörpakets und ergänzt die fehlende V-903-Quelle; danach gezielte Einbindung durch WS0 einschließlich Formatgrenze. WSA hat V-908 damit technisch vorbereitet, nicht vollständig abgeschlossen.

Provenienz: von Georg bereitgestellte ElevenLabs-Downloads, Bearbeitung im Folgeauftrag V-908 angefordert. Keine neuen Generierungsaufrufe; kein eigenständig verifizierter ElevenLabs-Vertrags-/Lizenznachweis.
