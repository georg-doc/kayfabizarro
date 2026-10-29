# WSA Audio · zwei neue Suno-Songs, Fahrzeug-/Flugforschung und ASMR-Gebäude · Briefing R1

Stand 29.10.2026. Owner bleibt **KFB Audio & Soundscape / bestehende Audio-Site**, Branch `feature/kfb-audio-site-immersive-ws0-2026-10-26`, Draft PR #455 auf PR #365. Keine zweite Site, kein zweiter AudioContext, kein neuer Spiel-/World-Owner. Dieses Dokument ist das Briefing vor der Umsetzung.

## Auftrag in einem Satz

Zuerst zwei vorhandene Suno-Instrumentals samt Stems in Soundbeds und Radio der bestehenden Audio-Site aufnehmen; parallel den bereits vorhandenen ASMR-/Gebäude-Bestand sichtbar prüfen. Erst nach Hörvergleich werden ausgewählte Gebäudeereignisse an reale Spielereignisse angeschlossen.

## A · Song-Intake

Private Quelle: `georg-doc/KFB-Stunt-Car-Race`, Branch `assets/private`, Pin `da990fe4097c6ed7e59eda24ef2cf1acc6dbcb51`.

- `40_AUDIO/suno_r2/shepard_ascent/`: Mix `Shepard Ascent.mp3` plus neun Stems `0 Drums` bis `8 Brass`; vom Auftrag angegebene Dauer 228 s.
- `40_AUDIO/suno_r2/bouncing_busker_groove/`: Mix `Bouncing Busker Groove.mp3` plus dieselben neun Stem-Familien; vom Auftrag angegebene Dauer 198 s.
- Beide Ordner wurden am Pin mit genau zehn Dateien gelesen.
- Tatsächlicher Katalogpfad am Pin: `40_AUDIO/music_catalog_r1.json`. Er enthält derzeit fünf Einträge und noch keinen der beiden neuen Titel. Der im Eingang genannte Präfix `KFB_HUB/` ist in diesem Repo an diesem Pin nicht vorhanden.
- `Shepard Ascent` erhält zusätzlich den Vermerk **Spielmusik-Kandidat Cascade Sphere**. Das ist eine Kandidatur, keine Spielverdrahtung und kein Abnahme-PASS.

Umsetzung in der bestehenden Site:

1. Beide Master in Soundbeds und Radio sichtbar machen; Lautheit gegen die vorhandenen Titel angleichen, ohne Dynamik pauschal platt zu begrenzen.
2. Je Titel die neun vorhandenen Stems als zusammengehörige Familie führen. Vor adaptiver Schichtung Dauer, Startversatz, Samplerate/Kanäle und phasenstabile Schleifgrenze messen.
3. Masters müssen unabhängig von Stems vollständig spielbar bleiben. Fehlender oder fehlerhafter Stem darf den Titel nicht blockieren.
4. Bestehenden Mixer, MusicClock, Busse, Ducking und den einen injizierten AudioContext benutzen.

Text für WSA Audio:

> Bitte die zwei neuen Suno-Instrumentals „Shepard Ascent“ (228 s) und „Bouncing Busker Groove“ (198 s) aus `assets/private` unter `40_AUDIO/suno_r2` in Soundbeds und Radio der bestehenden Audio-Site aufnehmen. Lautheit wie die übrigen Musiktitel; je Mix die neun vorhandenen Stems für Schichtung prüfen und als gemeinsame Familie führen. Tatsächlicher Katalogpfad ist `40_AUDIO/music_catalog_r1.json`. „Shepard Ascent“ zusätzlich als Spielmusik-Kandidat der Cascade Sphere markieren, noch nicht ins Spiel verdrahten. Rückmeldung mit Revision, gemessenen Stem-Eigenschaften und hörbarer Site-Probe.

## B · Fahrzeug-, Flug-, Wind- und Sci-Fi-Forschung erneut zugestellt

Vollbericht: [Fahrzeug- und Flugsound: Recherche R1](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/df19ca4f70fc85fcfa8aadb9e318c1e40411b10a/audit/FLIGHT_VEHICLE_SOUND_DESIGN_RESEARCH_R1.md).

Für die nächste Umsetzung gelten drei Leitlinien:

1. Motoridentität, kontinuierliche Bewegung und Einzelereignisse getrennt halten. Originalen Jet-Grundkörper behalten; Last, Tempo, Wind und optionale Sci-Fi-Energie getrennt steuern.
2. Fahrtwind aus Aufnahme plus optional gefiltertem synthetischem Rauschen/Drone formen. Rollen- und Banking-Hüllkurven folgen dem tatsächlichen Manöver; kein extremes Hochpitchen der ganzen Datei.
3. Bestätigte Spielaktion und Phase liefern eine gemeinsame Zeitbasis für Audio und VFX. Keine Doppeltrigger aus Eingabe, Animation und Controller.

Der Bericht ist Recherche, kein Middleware-Auftrag und keine bereits erfolgte Hörabnahme.

## C · ASMR-/Gebäude-Bestand und bestätigte Lücke

Am privaten Pin vorhanden:

- `40_AUDIO/elevenlabs_r1/asmr_r1.json`: 40 Clips in fünf Gruppen — Knete K, Goo G, Fluff F, MIB M, 4GTN/Technik B; je Ereignis meist zwei Varianten.
- `40_AUDIO/elevenlabs_r1/asmr_r1_lufs/`: normalisierte Fassungen und Bericht mit Ziel −14 LUFS.
- `40_AUDIO/elevenlabs_r1/melee_destruction_r1_lufs/`: `G01_goo_house_crack`, `G02_goo_house_wobble`, `G03_goo_house_burst`.
- Weitere vorhandene Goo-/Trefferfamilien: Dark-Fluffer-Splat/Ooze, Materialtreffer, Trümmer-Ausklang und Partikel-/Fluff-Ereignisse.

Aktueller Stand:

- Die Quelle der Audio-Site PR #455 kennt keine `asmr_r1`- oder `goo_house`-Einträge und bietet dafür keine Hörmatrix.
- Das aktuelle Spiel `game/proc-world-ws0` @ `72fbb25d08aad1e7d669203c7b0e85ce9f69934c` besitzt allgemeine Material-, Explosion-, Fluff- und Trümmerklänge.
- Die vendorte Zerstörungslogik kann Impact, Fracture, Contact und Settle zusammenfassen. Im aktuellen Spielstand gibt es aber keinen realen Aufrufer für diese Gebäude-Kaskade; nicht-explosive Einschläge werden dort ausdrücklich als `SOURCE_GAP_NONEXPLOSIVE_IMPACT` gemeldet.
- Die speziellen ASMR- und Goo-House-Dateien sind im Spielcode nicht referenziert.

Daraus folgt für die Umsetzung:

1. In der Audio-Site zuerst eine kompakte Hörmatrix für Knete/Goo/Fluff/MIB/4GTN/Gebäude anbieten: solo, gleiche Referenzlautheit, Variante A/B, klare Quelle.
2. Vor neuer ElevenLabs-Generierung die vorhandenen 40+3 Kandidaten hören und Keep/Tune/Cut markieren.
3. Danach im Spiel nur echte Gebäudephasen anbinden: Treffer, Riss/Wackeln, Burst mit Goo-Partikeln, Nachkontakte/Settle. Ort und Stärke kommen vom Gebäude-/VFX-Owner. Wiederholte Partikelkontakte werden zusammengefasst, damit kein Plopp-Maschinengewehr entsteht.
4. Audio- und Goo-Partikelereignis erhalten dieselbe Kaskadenkennung und Zeitbasis. Die Audio-Site bleibt Werkbank; der Spielbranch bleibt Runtime-Owner.

## Abnahme und nächstes Gate

Briefing-Gate PASS, wenn WSA Audio mit einer Revision zurückmeldet:

- beide Master im Katalog/Soundbeds/Radio,
- 20 Quelldateien und neun Stems je Titel geprüft,
- hörbare Master- und Stem-Probe im bestehenden Mixer,
- ASMR-/Gebäude-Hörmatrix mit Quellenstatus,
- keine zweite Audio-Site und kein zweiter AudioContext.

Danach hört Georg zuerst die zwei Songs und die ASMR-/Gebäude-Kandidaten. Erst dieses Hörurteil öffnet die Spielverdrahtung der Gebäudeereignisse.