## Aktuell: R3 klanglich abgelehnt · vorige R2 wieder aktiv

Georgs Hörurteil: neues hohes Quietschen sehr unangenehm und unpassend, auch WS0s neue Quellen überzeugen nicht. Die neue Mischung ist **nicht freigegeben**. Voriger R2-Flugpfad wieder Standard, neues Paket deaktiviert; Quellen erhalten. Spielbranch `work/wsa-v908-racer-jetpack-r1`, [PR45](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/45), verifizierter Head **d7e6e0d1edc195bf31242596ba3981d2a00d5a84**. Frischer sichtbarer Spieltest: DIY=false, keine neuen PCM-Bytes, alter Boost, ein Context, am Ende 0 Loops, keine JS-Fehler; ein Cozy-Musikrequest abgebrochen/fehlgeschlagen. Enger Unit-/Syntaxcheck PASS. Kein Merge/Live.

**Alle Antriebe müssen satten Bass und räumlichen Klang liefern.** Kleiner Jetpack bedeutet nicht bassarm. Kreischendes Metall, Klappern und Scheppern sind erlaubt, aber kurze, sparsame und variierende Akzente statt nerviger Wiederholung. Vorherige pauschale Bassverbote in Prompts sind überholt. Quellen trocken/mono-kompatibel; Position, Bewegung und Raum im Spiel separat nachweisen. Kein Spatial-PASS behauptet.

Georg generiert die nächste Auswahl manuell. [Vier überarbeitete Prompts und Einsatzregeln](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/d7e6e0d1edc195bf31242596ba3981d2a00d5a84/audit/V931_MANUAL_JETPACK_PROMPTS_R2.md). Erst bassigen Grundlauf hören, dann Lastvariante und separate Fehlzündungs-/Metallakzente. WSA wartet auf diese Kandidaten statt weitere Generierungen oder Filterexperimente zu starten. Nächster Schritt: manuelle neue Quellen von Georg. Historische technischen Nachweise unten bleiben gültig, ersetzen das negative Hörurteil aber nicht.

---

## Aktuell: V-931 DIY-Jetpack integriert · 28.10.2026

WS0s Lieferung @9a86ab3 ist verarbeitet: jeweils Take 1 für Low/High plus alle drei Pops, technisch ausgewählt, geschnitten, eingepegelt und im vorhandenen Spiel-Flugowner angeschlossen. Originale unverändert; keine weiteren Generierungen. Verbindliche DIY-/Steampunk-/Dieselpunk-Richtung bleibt.

- Spiel: `georg-doc/KFB-Stunt-Car-Race`, Branch `work/wsa-v908-racer-jetpack-r1`, verifizierter Head **cae485668d59a79069255072493dbb6aaf325192**, [PR45](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/45).
- [Aktueller Return und nächstes Gate](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/cae485668d59a79069255072493dbb6aaf325192/audit/V931_JETPACK_RETURN_R1.md), [Messwerte](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/cae485668d59a79069255072493dbb6aaf325192/audit/V931_JETPACK_METRICS_R1.json).
- Fünf vorbereitete FLACs + Manifest: `media/kfb-audio/r1/el/jetpack_diy_r2_cut/` am geprüften Assetpin **27008d5826f67f630b07f8f2b68181dcdd74c418**; gleicher neuer Ordner in Dropbox. 731.636 Dateibytes, 2.243.808 zusätzliche PCM-Bytes. Expliziter gepinnter Loader im Spiel statt globalem Indexeintrag.
- Sichtbarer Spieltest: Normalschub/Boost nutzen getrennte Lastloops, Gleiten nur Luft; zwei Pops tatsächlich ausgelöst, dritte Variante im Lifecycle-Test. Ein Context, keine JS-/Audiofehler, keine verbleibenden Loops am Ende. Ein Cozy-Musikrequest fehlgeschlagen/abgebrochen, keine Jetpackdatei. Relevante Units, Produktionsbuild und bytegenaue Reproduktion der fünf FLACs bestanden; enger Critic CONTINUE.
- Hörvergleich lokal im KFB-Hub-Checkout: `work/v908-racer-jetpack/test/out/v908/JETPACK_DIY_R3.html`. Vorherige Aufnahme und neue Quellen im Spiel mit gleichem Gesamtpegel, fünf Einzelklänge zusätzlich. Kein öffentlicher Host behauptet.
- **Ein nächstes Gate: Georg hört den neuen Charakter und die Übergänge im Spiel; danach WS0-Übernahme/Tuning.** Der priorisierte Quellenauftrag ist erfüllt. Noch keine menschliche R3-Hörabnahme, kein Merge/Live. OSM-Langflug, Sprache unter Belastung und Elan-Manöver bleiben offen. Weitere ElevenLabs-Erzeugung erst bei konkreter Hörlücke.

---

## Georgs Freigabe und Folgeauftrag · 28.10.2026

## Aktueller Integrationsstand 28.10.2026

Georgs Grundkonzept-/Schnittfreigabe und Vergleich ohne V-903 sind umgesetzt. Dragster und Hover wurden zuerst im echten Spiel integriert und verglichen, anschließend ein persönliches Jetpack-Profil. Umsetzung durch WSA auf eigenem WS0-Reviewbranch, kein Merge und keine Live-Promotion.

- [Draft PR 45](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/45), Repo `georg-doc/KFB-Stunt-Car-Race`, Branch `work/wsa-v908-racer-jetpack-r1`, verifizierter Head `ad73ead27334def7805624ac068cf2bcdea14341` (Implementierung `2ba9f5231aa0e5f4e9d586cd5ba00b82b77c04bc`). Basis WS0 `36461d199ff037824cbe330b4ed553d8f00a7b81`.
- [Vollständiger Return und Grenzen](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ad73ead27334def7805624ac068cf2bcdea14341/audit/V908_INTEGRATION_RETURN_R1.md), [Messwerte](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ad73ead27334def7805624ac068cf2bcdea14341/audit/V908_METRICS_R1.json), [Recherche und zwei gezielte optionale ElevenLabs-Prompts](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ad73ead27334def7805624ac068cf2bcdea14341/audit/V908_RESEARCH_AND_GAPS_R1.md).
- Sechs echte Spielaufnahmen; ein AudioContext, keine protokollierten JS-/Audiofehler. Zehn Fahrzeugwechsel: fünf neue Requests, 3.528.000 PCM-Bytes stabil, maximal drei neue Loops. Jetpack: Schub/Gleiten/Boost/Kurve/Landung, Motor aus beim Gleiten, Luft bleibt, kein R2-Neustart beim Landen. Warmstart-Nachbesserung: erster Takeoff 15,4 ms, Boost 25,2 ms bis zur Audio-Planung im abschließenden Lauf (n=2, keine Lautsprecherlatenz).
- Build und relevante Unit-Regressionen bestanden; unabhängiger Critic/Guard CONTINUE nach Reparatur der Landungsnaht. Hörvergleich lokal in `work/v908-racer-jetpack/test/out/v908/SPIELVERGLEICH.html` des KFB-Hub-Checkouts, mit konstantem Pegelausgleich; keine öffentliche Abnahme-URL behauptet.
- Nächstes Gate: Gesamt-Hörabnahme durch Georg/WS0, danach WS0-Übernahme. OSM, Elan-Rollmanöver und TTS-Belastungstest offen; keine erneute Einzeldateifreigabe. Greifhaken nur spätere Konzeptnotiz. Frühere offene Aussagen zu V-903/Integrations-GO unten sind durch Georgs spätere Freigabe überholt; historische Material-/Quellrollen-Befunde bleiben erhalten.



**Grundkonzept und Schnittweise freigegeben.** Georg hat die Hörproben positiv beurteilt; keine Einzelabnahme sämtlicher Dateien erforderlich. Auswahl/Eignung der tatsächlich eingebauten Klangrollen bleibt Aufgabe des Builders. Die ältere Aufforderung unten, vor Weiterarbeit alle 46 Quellen von Georg abnehmen zu lassen oder V-903 zu ergänzen, ist nicht die aktuelle Route. Vergleich ohne V-903 bleibt freigegeben.

Nächster Auftrag: zwei unterschiedliche bestehende Fahrzeuge mit Dauerschichten und getrennten Events im Spiel vergleichen; anschließend einen Jetpack-Typ als eigenen Haupt-Locomotion-Klangprofil-Slice bearbeiten. WSA kann Recherche und Jetpack-Slice sowie nach Koordination den benannten Integrator im bestehenden WS0-Owner übernehmen. Erweiterte Primärquellen-Recherche, konkrete Timing-/Trigger-Regeln und gezielte ElevenLabs-GAP-Liste für WS0 sind Bestandteil. Greifhaken/Gripping ist nur eine spätere Konzeptnotiz, kein aktueller Physikbau.

Verbindlicher Folgeauftrag: https://github.com/georg-doc/kayfabizarro/blob/5515bf10f28760708d51204fca7ab7f9b7bced41/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WSA_AN_WS0_V908_RACER_JETPACK_FOLGEAUFTRAG_R1.md

Diese Runde sichert Planung/Freigabe; keine neue Laufzeitintegration, neue Hör-/Gameplay-Messung oder Generierung behauptet. **Nächster Schritt: den Folgeauftrag im vorhandenen Spielowner ausführen; keine erneute Konzeptfreigabe abfragen.**

---

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


## Georgs Hörfeedback und Fortsetzung R2

Georg hat den echten Spielvergleich gehört: „sehr gut“, „funktioniert besser“. **PROCEED PASS / TUNE** für die Verbesserung; keine erneute Grundkonzeptfreigabe. Der Jetpack klingt noch zu sehr nach einer dicken Engine. Das ist ein konkreter verbleibender Klangpunkt, keine Ablehnung der Schub-/Gleit-/Ereignislogik.

WSA setzt auf demselben Reviewbranch eine leichtere Zwischenmischung mit weniger P03-Motorkörper und zurückgenommener P01-Düse um und prüft sie im Spiel. WS0 erhält zusätzlich einen priorisierten ElevenLabs-Auftrag: kompakter persönlicher Jetpack-Dauerschub, luftig/mechanisch, ohne V8-/große Triebwerksanmutung. Zunächst ein Grundloop in zwei Laststufen; Schubende und Manöverakzent folgen nachrangig. Keine neue Generierung wurde bereits ausgeführt. Kein Merge oder Live-Promotion aus diesem Feedback ableiten.


## Verbindliche Klangrichtung und R2 Lieferung

Georgs Ergänzung: **alle Engines sind DIY / gebastelt / gehackt / getunt, Steampunk-/Dieselpunk, stotternd, unwuchtig und mit explosiven Pops.** Jetpack kleiner und leichter, aber dieselbe improvisierte Materialwelt; keine glatte sterile Sci-Fi-Turbine. Diese Vorgabe gilt für die Klanggestaltung aller Profile, ohne hier alle Fahrzeuge neu umzubauen.

WS0: [konkreter Auftrag mit ElevenLabs-Prompts](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/51c78f56838cf11695472bf70591a700877d4779/audit/V908_WS0_JETPACK_DIY_R2.md). Priorität zwei zusammengehörige kleine DIY-Jetpack-Lastloops und drei separate Pop-Varianten; Schubende/Manöver nachrangig. Auffällige Pops an reale Last-/Schub-/Boost-Kanten, nicht zufälliges Dauerfeuer. Keine neue Generierung durch WSA behauptet.

R2-Zwischenmischung geliefert in PR45, Branch `work/wsa-v908-racer-jetpack-r1`, verifizierter Head `51c78f56838cf11695472bf70591a700877d4779`: nur persönliches Jetpack P01 −3,9 dB / P03 −12 dB. Erneute echte Spielaufnahme, Unit-Prüfungen und unabhängiger enger Critic CONTINUE; noch keine menschliche R2-Hörfreigabe. Vergleich lokal `work/v908-racer-jetpack/test/out/v908/JETPACK_R2.html`. Historische R1-Aufnahme unverändert erhalten. Nächster produktiver Schritt: WS0 liefert die gezielten Quellen, WSA schneidet/prüft und integriert sie in den vorhandenen Flugpfad.
