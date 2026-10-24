# Research · Binaural, Shepard, Frequenz-Konzepte, Spatial Audio · R1 · 24.10.2026

**Tier 0**
1. Binaural/Isochron: fertige Dateien nehmen (PD/CC0 von Commons und Freesound). Exakte Werte und Übergänge rendert **SBaGenX** oder **SynapSeq** offline als WAV. Kein Eigenbau.
2. Dystopie-Spannung: **CC0-Shepard-Loops** von Freesound als Schicht unter einem Suno-Drone. Die Intensität steuert WS-Audio. Der Peak ist ein Schnitt, kein Timing.
3. Spatial: ein Mixer, ein AudioContext. Weltobjekte über **PannerNode HRTF**. Binaurale Schicht auf einem eigenen kopffesten Bus, nie durch den Panner.

Lizenzspalte: PD/CC0 · CC BY · CC BY-SA · unklar · proprietär. Alle Seiten am 24.10.2026 geprüft. Nichts heruntergeladen.

---

## 1 · Binaural-Beat-Quellen (Audio)

| Name | URL | Lizenz | KFB | Notiz |
|---|---|---|---|---|
| Binaural Beat 96 & 104 Hz, 30 s (Inductiveload) | https://commons.wikimedia.org/wiki/File:Binaural_Beat_(96_%26_104Hz)_30s.ogg | PD | ja | 8 Hz. Reiner Sinus. Loop-Punkt prüfen. |
| Binaural Beat 98 & 102 Hz, 30 s (Inductiveload) | https://commons.wikimedia.org/wiki/File:Binaural_Beat_(98_%26_102Hz)_30s.ogg | PD | ja | 4 Hz. Gleiche Bauart. |
| Binaural Beats Theta 4 Hz (Fabrizio84) | https://freesound.org/people/Fabrizio84/sounds/457654/ | CC0 | ja | 30 min, MP3. Lange Version für Mindspace. |
| Binaural Beats Delta 440/440,5 Hz (pbabin) | https://freesound.org/people/pbabin/sounds/414271/ | CC0 | bedingt | 10 min, 0,5 Hz. Träger hoch (440 Hz), eher scharf. Geschwister 414272–414274 laut CC0-Filter, Einzelseite vor Übernahme prüfen. |
| binauralbeat_500_510 (bagustris) | https://freesound.org/people/bagustris/sounds/456736/ | CC0 (Filter) | bedingt | 10 Hz auf 500 Hz. Einzelseite noch prüfen. |
| 1.23 Hz binaural 69/70,23 Hz (itchytooth) | https://freesound.org/people/itchytooth/sounds/803742/ | CC0 (Filter) | bedingt | Sehr tiefer Träger. Einzelseite noch prüfen. |
| Binaural beats.ogg (Janka) | https://commons.wikimedia.org/wiki/File:Binaural_beats.ogg | CC BY-SA | bedingt | 10 s, 430/440 Hz. Nur Demo-Länge. |
| Pure Alpha Waves 7–12,9 Hz V3 | https://commons.wikimedia.org/wiki/File:Pure_Alpha_Waves_7_to_12,9_Hz_Binaural_Beats_V3.wav | CC BY-SA | bedingt | 9 min, 200 Hz Träger, Sweep. Namensnennung + SA auf die Datei. |
| Monroe Institute Archives (offizieller archive.org-Account) | https://archive.org/details/1997-roger-michael-poirer-audio | CC BY-NC-ND | nein | Vorträge und Seminare, keine Klangmuster. NC/ND. |
| Gateway-Experience-Uploads Dritter (z. B. TheArchivistOfCanada, „Public Domain Mark") | https://archive.org/details/gateway-experience-wave-4-track-5-nvc-2-the-gateway-tapes-no-ads | unklar | nein | Uploader ist nicht der Rechteinhaber. Das PD-Label ist selbst gesetzt. |
| „Robert Monroe – Focus" (revlin, „Attribution 3.0") | https://archive.org/details/RobertMonroe-Focus | unklar | nein | Laut Beschreibung aus der Hemi-Sync-Serie „Human Plus". Lizenz vom Uploader gesetzt. |
| Gateway Experience (Hemi-Sync-Shop) | https://hemi-sync.com/ | proprietär | nein | „Copyright © 2026 by Interstate Industries, Inc. d/b/a Hemi-Sync®". Verkauf 565,95 $. Hemi-Sync® und Gateway Experience® sind Marken. |

**Ehrlicher Befund Monroe:** Kein Gateway- oder Hemi-Sync-Audio ist frei. Frei (aber NC-ND) sind nur Vorträge aus dem Institutsarchiv. Die Konzepte selbst (Focus-Stufen, geschichtete Beats) sind nutzbar, siehe §6. Namen „Hemi-Sync" und „Gateway" nicht im Spiel verwenden.

## 2 · Generatoren und Bibliotheken (Binaural, Isochron, Monaural)

| Name | URL | Lizenz | KFB | Notiz |
|---|---|---|---|---|
| SBaGenX 3.1.0 | https://github.com/lm7137/SBaGenX · https://sbagenx.com/ | GPL-2.0 | ja (offline) | Gepflegter Fork von SBaGen. Binaural, isochron, monaural, Mix-Eingang. Ausgabe WAV/OGG/FLAC/MP3. CLI + GUI. |
| SynapSeq | https://github.com/ruanklein/synapseq · https://synapseq.org/ | GPL-3.0+ (kommerzielle Option) | ja (offline) | Textsequenzen → Audio. Binaural, monaural, isochron, Rauschen (weiß/rosa/braun), Übergangskurven, Pan/Orbit. Go-CLI und Go-API. Kein Browser-Build. |
| SBaGen 1.4.5 (Original) | https://uazu.net/sbagen/ | GPL | nein | „This project is unmaintained!" → SBaGenX nehmen. |
| Gnaural | https://sourceforge.net/projects/gnaural/ | GPL-2.0 | bedingt | Letztes Update 2022-04-08. Java/C. Nur falls SBaGenX nicht reicht. |
| Tone.js | https://github.com/Tonejs/Tone.js | MIT | bedingt | 14,8k Sterne. Nur wenn WS-Audio Tone.js schon nutzt (Tone kann den bestehenden AudioContext übernehmen). Sonst reichen native Nodes im bestehenden Mixer. |
| BinauralBeatJS (ichabodcole) | https://github.com/ichabodcole/BinauralBeatJS | unklar | nein | Keine Lizenzdatei. Letzte Pflege 2018. |
| Binaural Beat (F-Droid, Android) | https://f-droid.org/packages/com.binauralbeat/ | GPL-2.0 | nein | SBaGen-basiert. Nur Referenz für Presets. |

Die GPL gilt für das Programm. Gerenderte WAVs sind unsere Ausgabe und kommen als eigene Dateien ins Asset-Set.

**Weg:** Preset als Textdatei (SynapSeq oder SBaGenX) im Repo ablegen → offline rendern → WAV/OGG in `media/3D_Assets/Audio/<Set>/` mit `LICENCES.json`. Zur Laufzeit spielt WS-Audio nur Dateien. Keine zweite Engine.

## 3 · Shepard-Ton und Shepard–Risset-Glissando

| Name | URL | Lizenz | KFB | Notiz |
|---|---|---|---|---|
| shepard_tone_seamless (1urker) | https://freesound.org/people/1urker/sounds/456929/ | CC0 | ja | 6:40, fallend, nahtlos loopbar, Mono WAV. Erste Wahl Dystopie. |
| Rising Shepard tone 60 s take 2 (EnjoyPA) | https://freesound.org/people/EnjoyPA/sounds/130502/ | CC0 | ja | 1:00, steigend, 7 Oktaven, 10 s Periode. |
| Shepard Tones Loop (BaDoink) | https://freesound.org/people/BaDoink/sounds/575586/ | CC0 | ja | 7,4 s Loop. Kurz, für Stinger oder Schicht. |
| DescenteInfinie.ogg (Gloumouth1) | https://commons.wikimedia.org/wiki/File:DescenteInfinie.ogg | CC BY-SA | bedingt | 66 s, fallend, auf Moll-Akkord, 20 s Periode, 220 Hz. Loop 18–38 s laut Seite. Musikalischste Variante. |
| Shepard tone.ogg (Omeomi) | https://commons.wikimedia.org/wiki/File:Shepard_tone.ogg | CC BY-SA | nein | 9 s Demo. Zu kurz. |
| Weitere CC0-Treffer (21 Stück, u. a. „Endless Plane Crash Loop") | https://freesound.org/search/?q=shepard&f=license:%22Creative+Commons+0%22 | CC0 (Filter) | bedingt | Vor Übernahme Einzelseite prüfen. |
| iddan/shepard-tone (Web Audio, TS) | https://github.com/iddan/shepard-tone | unklar | nein | Keine Lizenz angegeben. Nur Referenz. |
| essy-shepard, davidnaas/shepard-tone (JS) | https://github.com/essy2017/essy-shepard · https://github.com/davidnaas/shepard-tone | unklar | nein | Keine Lizenz. |

**Beispiele aus Film und Spiel:** *Dunkirk* (Hans Zimmer) baut ganze Cues um die Shepard-Illusion, dazu eine symmetrische (verminderte) Skala ohne Auflösung. *The Dark Knight*: Das Batpod-Motorgeräusch (Richard King) ist als Shepard-Muster gebaut. *Super Mario 64*: Die endlose Treppe nutzt eine steigende Shepard-Skala. Quellen: https://en.wikipedia.org/wiki/Dunkirk_(soundtrack) · https://splice.com/blog/how-shepard-tone-works

**Praktische Parameter**
- Glissando: 7–10 Sinus-Teiltöne im Oktavabstand. Lautstärke glockenförmig über die Oktaven (Mitte etwa 200–500 Hz). Periode 10–20 s pro Oktave.
- Diskrete Skala (Motiv): Halbtonschritt alle 0,25–1 s.
- Richtung: steigend = Druck und Annäherung. Fallend = Sog und Absturz.
- Mix: Tiefpass 4–6 kHz, Hall, leise unter Musik. Auf Moll oder vermindert stimmen.
- Intensität 0–1 (WS-Audio): Pegel der Schicht, Tiefpass-Grenze, Wiedergaberate 0,9–1,15 (die Illusion versteckt die Tonhöhe), ab 0,7 eine zweite Schicht in Gegenrichtung.
- Peak mit unbekanntem Timing: Loop läuft endlos. Beim Ereignis harter Schnitt (0,5–1 s Stille) oder ein tiefer Schlag. Nie ausblenden.

## 4 · Schumann-Resonanz (7,83 Hz)

**Was es ist:** elektromagnetische Eigenschwingungen im Hohlraum zwischen Erde und Ionosphäre, angeregt durch Blitze. Grundton etwa 7,8 Hz, weitere Moden bei etwa 14, 20, 27 und 33 Hz. Das ist kein Schall. Jede Audio-Version ist eine symbolische Übersetzung.

| Name | URL | Lizenz | KFB | Notiz |
|---|---|---|---|---|
| 7.83 Hz Schumann Resonance2 (daddyjeff) | https://freesound.org/people/daddyjeff/sounds/466432/ | CC0 | nein | 10 s reiner 7,83-Hz-Ton. Unhörbar, musikalisch wertlos. |
| Solfeggio-528 Binaural Diff Schumann 7,83 (the_very_Real_Horst) | https://freesound.org/people/the_very_Real_Horst/sounds/457102/ | CC BY | bedingt | 5:28, 528-Hz-Träger mit 7,83-Hz-Differenz. Namensnennung. |
| NASA INSPIRE VLF-Proben (Sferics, Tweeks, Whistler) | https://www.spaceweather.com/glossary/inspire.html | unklar | bedingt | Echte Naturradio-Klänge als Textur („Erdrauschen"). Nutzungsbedingungen der NASA-Originalseite noch prüfen. |
| Eigenrender SBaGenX/SynapSeq | siehe §2 | eigen | ja | Träger 200/207,83 Hz. Optional leise zweites Paar 300/314,3 Hz. |

## 5 · Spatial / immersive Audio im Browser

| Name | URL | Lizenz | KFB | Notiz |
|---|---|---|---|---|
| Web Audio PannerNode, panningModel „HRTF" | https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/panningModel | W3C-Standard | ja | Faltung mit gemessenen Kopf-Impulsantworten. Baseline in allen Browsern seit 2015. Default ist „equalpower". |
| Three.js AudioListener / PositionalAudio | https://threejs.org/docs/#api/en/audio/PositionalAudio | MIT | ja | Baut auf PannerNode (HRTF) auf. Listener hängt an der Kamera. Passt zu R3F. |
| Resonance Audio Web SDK (Google) | https://github.com/resonance-audio/resonance-audio-web-sdk | Apache-2.0 | nein | Am 19.04.2026 archiviert, schreibgeschützt. Nicht neu einführen. |
| Omnitone (Google Chrome) | https://github.com/GoogleChrome/omnitone | Apache-2.0 | bedingt | Ambisonics-Dekoder + Binauralrender in Web Audio. FOA (4 Kanäle), HOA 2./3. Ordnung (9/16). Später für Ambience-Betten. |
| JSAmbisonics | https://github.com/polarch/JSAmbisonics | BSD-3-Clause | bedingt | FOA/HOA, Rotation, SOFA-HRTF. Alternative zu Omnitone. |
| Dolby Atmos | https://developer.dolby.com/platforms/html5/ | proprietär | nein (nur Konzept) | Im Browser nur als kodierte Medienwiedergabe (E-AC-3 JOC im Video-/Audio-Element, v. a. Edge/Windows und Safari/macOS). Keine Objekt-API in Web Audio. |

**„Dolby-Logik" für KFB:** Atmos trennt *Betten* (feste Kanal-Flächen) und *Objekte* (Klang + Position als Metadaten). Ein Renderer passt beides an das Abspielgerät an. Das bauen wir mit Web-Audio-Bordmitteln nach. Echtes Atmos gibt es für ein Echtzeit-Web-Spiel nicht.

**Binaural-Rendering vs. Binaural Beats:** Beides braucht Kopfhörer. HRTF-Rendering filtert *eine* Quelle für beide Ohren, damit sie aus einer Richtung kommt. Binaural Beats brauchen *getrennte* Töne pro Ohr. Läuft ein Beat durch den HRTF-Panner, hört jedes Ohr beide Töne. Dann ist der Effekt weg. Also: Beats nie spatialisieren.

**Empfohlene Architektur (ein Mixer, WS-Audio, ein AudioContext)**
- **Objekte:** weltgebundene Quellen über PositionalAudio/PannerNode. „HRTF" bei Kopfhörer-Einstellung, „equalpower" bei Lautsprechern. Listener = Kamera.
- **Betten:** Ambience als Stereo-Loops pro Biom (wie gehabt). Optional später FOA über Omnitone, mit der Kamera-Gier gedreht.
- **Kopffest:** Musik, UI und ein neuer Bus **mind** für Binaural, Isochron und Atemführung. Kein Panner, keine Mono-Summe, kein Stereo-Widener, kein Hall auf der Beat-Schicht. Limiter gekoppelt (linked).
- **Schalter Kopfhörer an/aus** im Menü: an → Binaural-Datei. Aus → isochrone oder monaurale Variante derselben Szene. Es gibt keine verlässliche Browser-API zur Kopfhörer-Erkennung.
- Ducking wie in den bestehenden WSA-Regeln. mind duckt unter Dialog, nicht unter Ambience.

## 6 · Frequenz-Konzepte musikalisch abbilden

Faustregeln: Binaural wirkt mit Träger unter etwa 1000 Hz (gut 150–400 Hz) und Differenz unter etwa 30 Hz. Puls-Raten lassen sich ins Tempo legen: **Hz × 60 = Schläge pro Minute** (z. B. 10 Hz = Sechzehntel bei 150 BPM). Suno trifft keine exakten Hz-Werte. Suno liefert das musikalische Bett. Die Frequenzschicht kommt aus Datei oder Offline-Render. Die STYLE-Zeilen stehen in der Tabelle „Suno-Lücken" (S1–S12).

| Konzept | Was (1 Zeile) | Musikalisch umsetzen | Vorhandene Quelle | Suno |
|---|---|---|---|---|
| Delta 0,5–4 Hz | langsamstes EEG-Band | Binaural 120/122,5 Hz. Puls = Viertel bei 120 BPM oder Achtel bei 60 BPM. Dunkle Fläche, Sub, kaum Transienten. | pbabin CC0 (0,5 Hz), Inductiveload PD (4 Hz) | S1 |
| Theta 4–8 Hz | Band „Dösen, Traum" | Binaural 180/186 Hz. Sechzehntel bei 60–90 BPM als leiser Glockenpuls. | Fabrizio84 CC0 (4 Hz), Inductiveload PD (4 und 8 Hz) | S1 |
| Alpha 8–12 Hz | Band „wach, entspannt" | Binaural 200/210 Hz. Tremolo 10 Hz auf Pad oder Sechzehntel bei 150 BPM, sehr leise. | Pure Alpha V3 (CC BY-SA), bagustris CC0 | S1 |
| Beta 13–30 Hz | Band „aktiv, wachsam" | Als Flattern/Tremolo 14–20 Hz auf Streichern. Für Spannung, nicht für Mindspace. | keine gute | S8 |
| Gamma ~40 Hz | schnelles Band, 40-Hz-Konzept | 40 Hz Amplitudenmodulation wird als Rauigkeit/Summen hörbar. Textur für Maschinenräume und Dystopie. | keine | S12 |
| Schumann 7,83 Hz + Moden | Erd-Ionosphäre-Resonanz (s. §4) | Binaural 200/207,83 Hz. Optional Paare für 14,3/20,8 Hz sehr leise darüber. Puls: Sechzehntel bei 117,5 BPM = 7,83 Hz, als Shimmer. VLF-Knistern als Textur. | Horst CC BY, Eigenrender | S3 |
| Monroe: Focus-Stufen | Monroes Stufen für Bewusstseinszustände (Focus 10, 12, 15, 21) | Stufen als Räume mit eigenen Namen. Jede Stufe: Beat-Rate tiefer, Bett dunkler, weniger Ereignisse. | kein freies Audio | S4 |
| Monroe: Hemi-Sync-Idee | mehrere Binaural-Paare + Rauschen, Hypothese der Frequenzfolge | Rosa Rauschen als „Brandung" mit 10-s-Schwellung. Darüber 2–3 Paare (100/104, 200/206, 300/310 Hz), deren Differenzen über Minuten gleiten. SynapSeq kann Schichten + Übergänge + Rauschen. | Eigenrender | S4 |
| Isochrone Töne | ein Ton, rhythmisch an/aus | Rechteck-Tremolo oder Sidechain-Pumpen in Rate f. Läuft auf Lautsprechern. Fallback des mind-Busses. | kein CC0 gefunden (Freesound 0 Treffer) → SBaGenX/SynapSeq | S6 |
| Monaurale Beats | zwei Töne gemischt in beiden Ohren | Hörbare Schwebung, lautsprechertauglich. Zweiter Fallback. | SBaGenX/SynapSeq | – |
| Solfeggio / 528 Hz | Zahlenreihe aus der Esoterik | 528 Hz ≈ C5 + 16 Cent → Tonzentrum C, Träger 528 Hz. | Horst CC BY (528) | S7 |
| 432 Hz | Stimmton A = 432 statt 440 | Fertigen Track um −31,8 Cent verschieben (Rate 432/440 = 0,9818 oder Offline-Pitch). Suno hält Stimmtöne nicht zuverlässig. | – | S7 + Pitch |
| Shepard–Risset | endlos steigende/fallende Tonhöhe | Siehe §3. Glissando als Schicht, diskrete Skala als Motiv. | CC0-Loops (§3) | S9 |
| Risset-Rhythmus | endloses Accelerando, rhythmischer Shepard | Zwei Drum-Loops, die beim Tempo-Verdoppeln überblenden. Suno kann das nicht endlos, nur annähernd. | nathanturczan/risset (MIDI-Generator, Lizenz ungeprüft) | S10 |
| Oktav-Illusion (Deutsch) | 400/800 Hz wechseln zwischen den Ohren | Kopfhörer-Effekt. Desorientierung als Dystopie-Stinger auf dem mind-Bus. | kein Fertigmaterial | – |
| Ganzfeld | gleichförmiger Sinnesreiz (Rotlicht + Rauschen) | Stationäres rosa Rauschen, kaum Bewegung, mit gleichförmigem Bild. Für einen „Leere"-Raum. | Rauschen aus SynapSeq/SBaGenX | S5 |
| Atem 0,1 Hz | 6 Atemzüge pro Minute | Pad-Schwellung + Filter im 10-s-Zyklus (5 s ein, 5 s aus). Bei 48 BPM = 2 Takte. Atemführung als Pegel-Automation in WS-Audio. | jede Fläche + Automation | S2 |
| Infraschall ~19 Hz | Tandy-These zum „Spuk-Frequenz"-Gefühl | Kopfhörer geben 19 Hz kaum wieder. Hörbarer Stellvertreter: tiefer Drone mit 19-Hz-Flattern, leises Grollen. | keine | S11 |

## Empfehlung

- **Mindspace, Binaural-Schicht:** Inductiveload 96/104 (8 Hz) und 98/102 (4 Hz) sofort als Loops (PD). Für lange Räume Fabrizio84 Theta (CC0). Danach eigene Presets in SynapSeq rendern: Träger 200 Hz, Gleiten 10 → 6 Hz über 5 min.
- **Mindspace, Bett + Atemführung:** Suno S2 (48 BPM, 2 Takte = 1 Atemzug). Die Atemführung ist Pegel- und Filter-Automation in WS-Audio, keine eigene Datei.
- **Mindspace, Lautsprecher-Fallback:** dieselben Presets als isochrone Version aus SBaGenX/SynapSeq. Schalter Kopfhörer an/aus.
- **Dystopie-Spannungsbett:** Suno S8 als Drone + 1urker-Shepard (CC0, fallend, 6:40) als Schicht. Intensität steuert Pegel, Tiefpass, Rate. Ab hoher Intensität EnjoyPA (steigend) dazu.
- **Dystopie-Peak:** harter Schnitt auf Stille oder ein tiefer Schlag. Kein Ausblenden. Damit ist das unbekannte Timing gelöst.
- **Musikalischere Shepard-Variante:** DescenteInfinie (Moll-Akkord) mit Namensnennung im Abspann, falls die CC0-Sinus-Loops zu technisch klingen.
- **Spatial:** PositionalAudio/PannerNode HRTF für Objekte. Neuer kopffester mind-Bus. Kein Resonance Audio (archiviert). Omnitone erst, wenn Ambience-Betten in FOA kommen.
- **Namen:** eigene Raumnamen. Kein „Hemi-Sync", kein „Gateway" im Spiel.

## Offene Punkte

1. Nutzt WS-Audio schon Tone.js? Wenn nein: native Nodes, keine neue Bibliothek.
2. Freesound-Dateien, die nur über den CC0-Filter gefunden wurden (bagustris, itchytooth, pbabin 414272–414274, weitere Shepard-Treffer): Einzelseite vor Übernahme prüfen.
3. NASA-INSPIRE-Nutzungsbedingungen auf der Originalseite prüfen, bevor VLF-Knistern ins Set geht.
4. 30-s-Sinus-Dateien von Commons: Loop-Naht (Phase) im Sound-Studio prüfen.
5. System-Spatializer (Windows Sonic, Dolby Atmos for Headphones, Apple „Stereo räumlich") können die Beat-Schicht verschmieren. Im Sound-Studio mit an/aus testen.
6. Suno-Ausgabe ist MP3 mit eigener Stereo-Bearbeitung. Nie als Träger exakter Beat-Werte nutzen.
7. Gate: Georgs Ohr im Sound-Studio. Besonders Shepard-Pegel und Dauer im Dystopie-Bereich.

## Suno-Lücken

STYLE rein musikalisch (V-362). Alle instrumental. Exakte Frequenzschichten kommen nicht aus Suno.

| ID | Name | Einsatz in KFB | STYLE |
|---|---|---|---|
| S1 | Brainwave-Fläche | Mindspace-Raum | ambient drone, instrumental, no vocals, 60 BPM, D minor, warm analog pad, slow evolving sine layers, soft sub bass, distant glass bells, long reverb, no drums, very sparse |
| S2 | Atem-Bett | Mindspace-Raum | ambient, instrumental, no vocals, 48 BPM, F major, soft string pad swelling and receding every two bars, gentle low-pass movement, felt piano single notes, airy noise wash, no drums, calm and steady |
| S3 | Erd-Resonanz | Mindspace-Raum | dark ambient, instrumental, no vocals, 117 BPM half-time feel, A minor, deep drone, faint shimmering sixteenth-note pulse, crackling radio static texture, low choir pad, wide reverb, no kick drum |
| S4 | Tiefen-Stufen | Mindspace-Raum | deep ambient, instrumental, no vocals, 50 BPM, C minor, pink noise surf swelling slowly, layered low sine drones, soft tanpura-like resonance, sustained organ pad, no percussion, minimal motion |
| S5 | Leere-Raum (Ganzfeld) | Mindspace-Raum | minimal drone, instrumental, no vocals, free tempo, static broadband noise bed, one sustained low tone, barely moving filter, no melody, no percussion, flat and uniform texture |
| S6 | Puls-Fläche | Mindspace-Raum (Lautsprecher) | ambient electronica, instrumental, no vocals, 90 BPM, E minor, pad gated in steady sixteenth notes, soft sidechain pumping, warm sub, muted bell arpeggio, no snare, hypnotic and even |
| S7 | Stimm-Fläche (für 432/528) | Mindspace-Raum | new age ambient, instrumental, no vocals, 64 BPM, C major, crystal bowl tones, soft harp, warm string pad, slow chord changes, long reverb, no drums |
| S8 | Dystopie-Drone | Spannungsbett | dark cinematic drone, instrumental, no vocals, 70 BPM, A diminished, low brass clusters, bowed metal, tremolo low strings, distant industrial hum, sub pulses, no melody, no resolution |
| S9 | Endlose Steigung | Spannungsbett | cinematic tension, instrumental, no vocals, 90 BPM, A diminished, constantly rising string ostinato, ticking clock pulse, layered brass swells, tremolo violins, building without release |
| S10 | Beschleunigung | Spannungsbett | dark electronic tension, instrumental, no vocals, 100 BPM, B minor, mechanical ticking pulse with accelerating feel, filtered toms, rising synth sweep, metallic noise bursts, no drop |
| S11 | Tief-Grollen | Spannungsbett | dark ambient, instrumental, no vocals, 60 BPM, low drone with fast flutter, sub rumble, distant metallic groans, sparse low piano hits, dry close room, no melody |
| S12 | Maschinen-Summen | Spannungsbett | industrial ambient, instrumental, no vocals, 80 BPM, F minor, buzzing amplitude-modulated synth, electrical hum, rhythmic relay clicks, cold pad, sparse low hits, steady and cold |
