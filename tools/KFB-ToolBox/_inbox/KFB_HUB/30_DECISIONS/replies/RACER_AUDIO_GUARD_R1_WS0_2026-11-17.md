# Für WS0 · Racer R01 Audio abgeschlossen / Roadmap freigegeben · 17.11.2026

Eure Antwort ist übernommen: Reihenfolge, SHA-256, echte Tonmitschnitte mit Spieltakt≥0,95, Eingaben/Warten nach Spielzeit bzw Zuständen, zentrale Wasseränderungen als Kandidat und später S01 auf WSA Works Abnahmebühne/b478.

## Verifizierter Kandidat

- Repo georg-doc/KFB-Stunt-Car-Race
- Branch racer/shared-roads-main-r1 · [Draft PR139](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/139)
- Abschluss-HEAD **f319f8a17d683d0f4e5d16f84efe4bedb2a48900**
- Geprüfter Policy-Code **ea22b749a901d8ec5a43a5d3b23f7d4c26db549d**
- Stamm zuletzt1fb9f534a7363aa3a7705aa09100d4b06635522a, keine stille Aufnahme/Rebase/Merge
- [Verbindliche Roadmap](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f319f8a17d683d0f4e5d16f84efe4bedb2a48900/docs/racer-roadmap-r2/ROADMAP.md)
- [RETURN, Quellen und Tests](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f319f8a17d683d0f4e5d16f84efe4bedb2a48900/docs/repository-audio-r1/RETURN.md)

## Fix zum Übernehmen

Vier Policy-/Testdateien:
1. scripts/audio/repositoryAudio.mjs
2. scripts/audio/repository-audio.r1.json
3. test/unit/repositoryAudio.mjs
4. test/unit/audioMixer.mjs

Der Nachweis liegt absichtlich außerhalb des unveränderten Donors. Exakte81Pfade/837922Bytes, SHA-256 und Git-Blob-Pin, Freesound-Quelle, Urheber undCC0-1.0 je Datei, abgeleitet aus vorhandener HERKUNFT/LICENCE-NOTES/CREDITS. Fünf Herkunfts-/Soundtabellendateien ebenfalls gepinnt. Fremde/private/geänderte/fehlende Dateien und ersetzende Symlinks bleiben Fehler. Keine Töne gelöscht, keine pauschale vendor-Ausnahme, keine bekannte-Fehler-Ausnahme oder Abhängigkeit geändert.

Neue Gegenproben9/9 und vollständiger Mixer53/53PASS. [GitHub-CI44124595741](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44124595741): **163/163grün**, kein Rückfall. Der bislang als „bekannt“ bezeichnete noAudioInRepo-Konflikt ist tatsächlich repariert. Lokal wurde mangels gültiger Git-Verknüpfung ein temporärer Index der vollständig von GitHub gelesenen Kandidatenpfade verwendet; echter Git-Checkout wird durch CI belegt.

## Echte Tonmitschnitte

Vorhandene KampfbühneR1, beide Originalprofile, fahrton=mix, q=fast, sichtbarer Browser640×480. Eingabephasen nach dem vorhandenen M1CLOCK: Leerlauf, Beschleunigung, Boost, Bremsen, Rückwärtseingabe, Ausrollen. Abgriff am bestehenden KfbAudio-Ausgang nach Begrenzer, eine echteAudio-/Videospur, kein neuer AudioContext, keine Zusatz-Physikschritte.

- Rennwagen:12,017Spielsekunden /12,033Echtsekunden = **0,999Spieltakt**. [Video mit Ton](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f319f8a17d683d0f4e5d16f84efe4bedb2a48900/docs/repository-audio-r1/evidence/patch_vireo.webm)
- Dieselpunk:12,017 /12,310 = **0,976Spieltakt**. [Video mit Ton](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f319f8a17d683d0f4e5d16f84efe4bedb2a48900/docs/repository-audio-r1/evidence/crimson_flame_dragster.webm)
- Beide:0App-/Audiofehler,0fehlendePatch-Dateien,0registrierteDurchfälle; laufender Kontext, Drehzahl-/Reifen-/Schaltsignale, tatsächliches Boostereignis und messbarer Ausgang in allen Phasen. [Rohdaten und Zusatzchecks](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/f319f8a17d683d0f4e5d16f84efe4bedb2a48900/docs/repository-audio-r1/evidence/sound-summary.json)

Erster Rennwagenlauf mit0,419Takt ausdrücklich FAIL/nicht als Abnahme verwendet. Danach Auflösung und Prüfanzeige geändert (4Hz kompakte Anzeige statt kompletter JSON-Ausgabe je Physikschritt); kein kausaler Performancegewinn oder allgemeiner Zielgeräte-PASS daraus behauptet. Keine subjektive menschliche Hörqualitätsfreigabe. Eine separate Warmup-Shaderdiagnostik der Minimal-Konfiguration ist offen dokumentiert; nicht als Audiofehler versteckt und keine Gesamt-Renderfreigabe behauptet.

Reproduktion mit vorhandenen Tonpaketen: node test/manual/racerAudioPreview.mjs und /test/repository-audio-r1.html. Mitschnitte und Metadaten sind auf GitHub gesichert, private Quellsamples nicht veröffentlicht. Bisherige Boost-Regelprüfung aus PR134 bleibt separat.

## Weiter mit R02

Audio ist in der freigegebenen Roadmap abgeschlossen. Als Nächstes den gesamten Ruf→Gelände→Kollider→Physikfreigabe→sichtbares Modell samt Spieltakt instrumentieren, erst danach einen nachgewiesenen Engpass ändern. Die9–13sRestwartezeit sind noch offen. Danach Wasser, Fahrgefühl/S01, Messfahrt; anschließend Badewanne, Stunts, vorhandenen Fahrzeug-Blaster anschließen und Dieselpunk-Flug. Kein neuer Turm ohne Prüfung des von Georg gemeldeten fertigen Bestands.

Bitte den Audiofix nach eigener Prüfung übernehmen. Kein Auto-Merge, keine Live-/Site-Promotion. Private Racer-SiteVersion16 unverändert.
