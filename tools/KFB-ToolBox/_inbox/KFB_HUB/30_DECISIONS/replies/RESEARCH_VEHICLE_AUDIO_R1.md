# RESEARCH_VEHICLE_AUDIO_R1 · Fahr- und Flugsound: visceraler und immersiver

Stand 25.10.2026 · Recherche + Code-Lesung (nur gelesen: `src/audio/kfbAudio.js`, `cueMap.js`, `engineAudio.js`, `AudioHost.jsx`, `vendor/audio/racer/engine.mjs`, `src/m2/M2Car.jsx`, `k2t.js`, `modules/vehicleRig.js`). Nichts geändert.

## Kurzfassung

1. **Grundaufbau stimmt.** KFB hat schon das, was die Branche nutzt: ein Loop-Gitter nach Drehzahl (L1–L5 mit gleichleistungs-Überblendung), Schubabschaltung, Schalt- und Fehlzündungs-Klänge, Untergrund- und Drift-Schleifen, Wind im Flug. Nötig ist Feinarbeit, kein neues System.
2. **Fehler Nr. 1: Die Tonhöhe bleibt hängen.** `gridWeights` begrenzt die Tonhöhe jeder Schleife auf ±10 % (`clamp(rpm/key,.9,1.1)`). Die Stützstellen liegen aber 1 400–1 700 U/min auseinander. Zwischen 2 860 und 3 780 U/min laufen deshalb zwei Schleifen mit fester Tonhöhe übereinander (gemessen bei 3 200 U/min: 2 860 und 3 780 gleichzeitig). Man hört zwei Motoren, die ineinander überblenden, statt eines Motors, der hochdreht. Behebung: ±25–30 % zulassen oder 6–8 Stützstellen.
3. **Fehler Nr. 2: Keine Last.** `throttle` kommt als 0/1 an (AudioHost Z. 60). Das geglättete `D.gas` aus M2Car (0,12 s) wird nicht verwendet. Spiele trennen Last und Schub (unter Last / ohne Last). Das ist der größte Unterschied zwischen „klingt nach Loop“ und „klingt nach Motor“.
4. **Für Tempo ist der Motor das falsche Mittel.** Burnout und NFS Unbound nehmen den Motor bei hohem Tempo zurück. Tempo erzählen dort Wind, Vorbeifahrten und Musik. Bei Burnout steigt zusätzlich ein endlos steigender Turbo-Ton (Shepard), und das „Infinite Gear“-Modell klettert ewig weiter.
5. **Cartoon-Regeln, die zu KFB passen:** Jedes Fahrzeug bekommt eine eigene Stimme (Burtts Podracer; Tierlaute als Schicht wie bei NFS). Jedes große Ereignis bekommt Ausholen und Nachhall (Ausholen vor dem Boost, Bass genau auf dem Squash-Bild bei der Landung). Unpassende Klänge sind erlaubt, wenn sie komisch sind (Treg Brown). Mickey-Mousing nur für Ereignisse, nie für den Dauerklang.
6. **Browser:** Für KFB reicht reines WebAudio: BiquadFilter für die Last, WaveShaper für den Boost, DelayNode für den Doppler, AudioWorklet nur bei Bedarf für Granular. Tone.js GrainPlayer und der Engine-Sound-Generator von Antonio-R1 eignen sich als Vorlage. Synthese ist laut V-448 im Code nicht gewollt, also bleibt die Bearbeitung echter Aufnahmen bzw. der ElevenLabs-Klänge.
7. **Fehlende Klänge (an WS0):** Ohne-Last-Varianten von L2–L4, eine Stimme je Racer, Vorbeifahr-Whooshes klein/groß, Wind in zwei Schichten (tiefes Grollen und hohes Pfeifen), Bass-Schlag für die Landung, Jetpack-Stoß in drei Teilen (Zündung, Schleife, Ausklang).

---

## 1 · Wie Spiele es umsetzen

| Technik | Wer / Quelle | Kern | Für KFB |
|---|---|---|---|
| **Loop-Überblendung nach Drehzahl** | Wwise-Tutorial; Unity-Forum; Magic SFX (5 Stufen + Übergänge) | Feste Schleifen bei Leerlauf/niedrig/mittel/hoch/sehr hoch, Überblendung nach Drehzahl. Eine Aufnahme bei 5 000 U/min klingt bei 4 000–6 000 noch gut, also etwa ±20 %. Spannweite eines Pkw-Viertakters etwa 900–6 000 U/min; das Spiel muss die Werte begrenzen. | KFB nutzt genau das (900/2 600/4 200/5 600, Grenze 6 400). Die Tonhöhe hält aber nur ±10 %, siehe Kurzfassung Punkt 2. |
| **Unter Last / ohne Last** | Wwise-Tutorial; SCS (LOADED/UNLOADED); Forza 5 (Wiswell); REV | Zu jeder Drehzahlstufe gibt es zwei Aufnahmen: mit Gas (Auspuff hart, obertonreich) und ohne Gas (dumpf, Blubbern, Knallen). Die Last wird aus Gas und Drehzahländerung gerechnet. | Fehlt. Ersatz bis neue Dateien da sind: Last steuert Tiefpass, Pegel und Verzerrung (SOP Schritt 2). |
| **Granular / Kolbenzyklen** | Crankcase REV; Forza Horizon 5; AudioMotors (FMOD); Burnout 4 (EA „Ginsu“) | Eine Hochdreh-Aufnahme wird in einzelne Zündzyklen zerlegt und je nach Drehzahl neu zusammengesetzt. Keine Nähte, der Charakter bleibt. REV liefert Modelle in etwa 10 Minuten statt 3–4 Tagen Loop-Arbeit. | Optional (AudioWorklet). Erst angehen, wenn die Punkte 2 und 3 der Kurzfassung erledigt sind. |
| **Schichten nach Bauteil** | Forza 5 (Motor, Ansaugung, Auspuff, Getriebe, Turbo, Kompressor); Project CARS (100+ Dateien je Auto) | Jede Schicht folgt eigenen Physikwerten. Das Getriebeheulen schwankt mit der Belastung. | KFB braucht 3 Schichten, nicht 10: Motor, Charakterstimme, Antrieb (Flamme/Düse/Lüfter). |
| **Schalten** | Forza (Motor muss als Schalt-Hinweis taugen); REV (Getriebe + Kupplung); Burtt (kurze Schalt-Übergänge fallen in schnellen Schnitten als Einziges auf) | Schaltdelle, Drehzahlsprung, kurzer Übergangsklang. | Vorhanden (O1, O4, P06, Fehlzündungs-Chance 55 %). Gut. |
| **Infinite Gear / Shepard-Turbo** | Burnout (Ben Minto) | Arcade-Autos beschleunigen schneller als ein F1-Wagen, die Drehzahl wäre sofort oben. Deshalb läuft ein Turbo-Ton, der scheinbar endlos steigt (Shepard-Risset). „Infinite Gear“ nähert sich einem Heulton und schaltet kurz davor einen Gang dazu. Gaswegnehmen oder Kurven werfen Gänge ab. | **Passt sehr gut** zum Boost und zur Höchstgeschwindigkeit. Shepard-Grundlagen liegen schon in RESEARCH_BINAURAL_SHEPARD_SPATIAL_R1. |
| **Motor bei Tempo zurücknehmen** | NFS Unbound (Criterion) | Beim Beschleunigen und Schalten führt das eigene Auto im Mix, bei hohem Tempo tritt der Motor zurück zugunsten von Fahrtwind und Vorbeifahrten. Gegen Motor-Ermüdung wird dynamisch gemischt. | Übernehmen: Motor bei Höchsttempo −4…−6 dB, Wind lauter. |
| **Stilisierte Schicht** | NFS Unbound („Samples“-Schicht, z. B. „Monster“, „Mad Scientist“) | Eine Effektschicht über dem Auto folgt Gang und Tempo. Ihr Frequenzbereich überschneidet sich nicht mit dem Motor. | **Das ist die Charakterstimme je Racer** (Abschnitt 2). |
| **Vorbeifahrten** | Burnout (Raycast nach vorn, Winkel wächst mit Tempo; nur 1 Bild getroffen = Laterne, mehrere Bilder = Brücke/Tunnel); NFS Unbound (Detektoren an Brücken, Tunneln, Objekten) | Ein Whoosh in klein oder groß, zeitlich vorgezogen, damit seine Mitte genau auf dem Vorbeiflug liegt. | Neu und mit wenig Aufwand machbar: Bäume, Felsen, Zaunpfosten, Torbögen. |
| **„Minto-Effekt“ (übertriebener Doppler)** | Burnout | Die Lautstärke steigt mit einer höheren Potenz an (schärferes Kommen und Gehen). Die Tonhöhe steigt beim Nähern und fällt danach, sodass man bei gleichem Tempo Beschleunigung hört. | Für NPC-Fahrzeuge, Flieger und Vorbeifahrten. |
| **Musik als Tempo** | Burnout 2 | Saubere und verzerrte Fassung desselben Stücks, nach Tempo überblendet. Im Boost springt es auf verzerrt, überdeckt vom Nitro-Klang. | Möglich: Jukebox-Tiefpass nach Tempo öffnen. Ducking beim Boost gibt es schon (`boostUntil`). |
| **Kamera / Nähe** | Project CARS (Helmkamera: Kammfilter + Tiefpass, reagiert auf G-Kräfte; Reifen bewusst übertrieben, damit man die Haftgrenze hört); Forza (Klang nach Lage zur Kamera) | Nah = Ansaugung und Mechanik, fern = Auspuff und Tiefpass. | Verfolgerkamera: Abstand zur Kamera steuert den Tiefpass und das Verhältnis Antrieb/Motor. |
| **Dauernd Gas und Boost** | Rocket League (Psyonix: „ein einziger Zustand aus Beschleunigen und Boosten“, 20–30 Klänge gleichzeitig, HDR-Mix) | Die Lautstärke eines Klangs hängt von anderen ab. Fehler im Mix: Motor zu leise, Boost zu laut. | Warnung: Boost nie lauter als Landung oder Crash. |
| **Eigene Klang-Identität je Aktion** | Mario Kart 8 (Splice-Analyse) | Boost, Drift, Treffer und Gefahr klingen klar verschieden. Klänge sind auf die Musik gestimmt. | Die Drift-Ladestufen 1–3 bekommen steigende Tonhöhen (Funken blau, orange, lila). |

**Doppler im Browser:** Der eingebaute Doppler-Effekt am PannerNode (`setVelocity`) wurde aus der Spezifikation und den Browsern entfernt (Firefox 63, Chromium, WebKit). Ersatz: `DelayNode.delayTime = Abstand / 343` mit sanfter Automation, oder `playbackRate` nach der Radialgeschwindigkeit. Antonio-R1 löst es per DelayNode.

## 2 · Cartoon- und Animations-Regeln: was davon zu KFB passt

| Regel | Herkunft | KFB |
|---|---|---|
| **Jedes Fahrzeug hat eine Persönlichkeit** | Ben Burtt, Podracer: echte Motoren (u. a. Porsche, Mustang) und Rennboote, Hubschrauber, Doppeldecker, sogar eine elektrische Zahnbürste, die an einer Harfensaite entlang läuft. Bearbeitet mit Kyma und einem Wavetable-Chopper. Sebulbas Pod hat einen rhythmischen Puls, Anakins Pod klingt nach schnellem Rennwagen. | **Ja.** Jeder Racer bekommt eine Charakterstimme über dem Motor: Flammen-Dragster = tiefes Grollen (Tier/Tuba), Schwebe-Racer = Summen/Theremin-Puls, Dieselpunk-Flieger = Knattern + Blech. Die Stimme folgt der Drehzahl (Tonhöhe ±) und dem Gas (Pegel). |
| **Tierlaute als Schicht unter der Maschine** | Charles Deenen (NFS-Zwischensequenzen): Bären, Tiger und Schweine unter Motoren für mehr Gefühl; später Verzerrung und Synth-Sweetener | **Ja**, sehr passend zu Knet und Fell: kurzes Knurren beim Hochdrehen, Schnauben beim Schalten. |
| **Unpassend, aber komisch** | Treg Brown (Warner): Klänge aus ihrem Zusammenhang lösen (Finger in Colaflasche = Zunge des Road Runner); beim Coyote-Crash Donnerschlag und Alarmsirene statt Becken. Mel Blanc: Die Aufgabe ist, Realismus zu trotzen, nicht ihn nachzuahmen. | **Gezielt einsetzen:** Fehlzündung als Korkenknall, Landung als Knet-„Plopp“ und Bass, Crash als Cartoon-Bonk (K06 gibt es schon). Nicht beim Dauerklang, sonst nervt es. |
| **Mickey-Mousing** | Disney-Kurzfilme: Klang und Musik exakt auf die Bewegung | **Nur für Ereignisse**, die das Bild schon betont: Squash bei der Landung, Stretch beim Boost, Flammenstoß beim Schalten, Fassrolle. Das Klang-Ereignis kommt im selben Bild wie der Deformer (der Deformer bekommt `landing`/`shift` schon aus derselben Quelle). |
| **Ausholen → Aktion → Nachhall** | Animations-Grundprinzip (Antizipation) | Vor dem Boost 120–180 ms Einatmen (Sog, Ton steigt leicht), dann Zündung, dann Ausklang. Vor schweren Mech-Schritten das Servo-Surren. |
| **Fallen pfeift abwärts** | Klassiker der Looney Tunes (Coyote fällt) | Optional: bei sehr langer Luftzeit ein leiser, abwärts gleitender Pfeifton, kurz vor der Landung abgeschnitten (Stille → Aufprall). Sparsam einsetzen, höchstens einmal pro Sprung über einer Schwelle. |
| **Echte Aufnahme als Basis, darüber Übertreibung** | Burnout (Dreck und Leben der Aufnahmen behalten, Realismus für Wirkung opfern); Forza Horizon 5 (weniger Bearbeitung als früher) | Echte bzw. ElevenLabs-Klänge sind die Basis, die Übertreibung kommt über Hüllkurven und Pegel, nicht über Synthese. |

**Was nicht passt:** Realistisches Getriebeheulen, Helmkamera mit Kammfilter, Simulation von Turbo und Kompressor, 100+ Dateien pro Auto. Das kostet viel und bringt einem Knet-Cartoon nichts.

## 3 · Im Browser umsetzbar

| Werkzeug | Was | Bewertung für KFB |
|---|---|---|
| **Vorhanden: `vendor/audio/racer/engine.mjs` (LoopGrid)** | Gleichleistungs-Gitter L1–L5, Schubabschaltung L5, Gänge, Flugprofile prop/jet/jetpack/turbine/antigrav, Wind | **Behalten.** Ändern: Tonhöhen-Grenze (±25–30 %), Last-Eingang, Wind ∝ Tempo². Die Gitter-Logik stammt aus KhazP/vf26-audio (MIT, steht in NOTICE.md). |
| **Reines WebAudio** | `BiquadFilterNode` (Last → Tiefpass/Peak), `WaveShaperNode` (Boost-Körnung), `DelayNode` (Doppler), `ConvolverNode` (Tunnel/Schlucht, Hall ist schon da), `DynamicsCompressor` (gibt es im Racer schon), `AudioParam.setTargetAtTime` für alle Glättungen | **Hauptweg.** Keine neue Bibliothek, ein AudioContext (V-598) bleibt. |
| **Tone.js `GrainPlayer`** (MIT) | Granular: `playbackRate` (Tempo durch die Datei) und `detune` (Tonhöhe) getrennt, `grainSize`, `overlap`. Lässt sich mit `Tone.setContext(ctx)` an den vorhandenen Kontext hängen. | Optional, falls die Charakterstimme weit gestimmt werden soll, ohne nach Micky-Maus zu klingen. Die ganze Bibliothek nur dafür ist schwer, als Vorlage für eigenen Worklet-Code gut. |
| **Antonio-R1/engine-sound-generator** (MIT) | Physikalisch angelehnte Motorsynthese (Baldan et al. 2015): Ansaugung, Motorblock, Auspuff getrennt; AudioWorklet + WASM; Three.js-Anbindung; Doppler per DelayNode. Demo: <http://antonio-r1.github.io/engine-sound-generator/src/engine_sound_generator/sounds_worklet_wasm.htm> | **Nur als Code-Vorlage** (Doppler, Worklet-Parameter `rpm`). Synthese widerspricht V-448 („nur echte Aufnahmen/ElevenLabs, nichts synthetisiert“, Kopf von cueMap.js). |
| **DasEtwas/enginesound** (Rust, offline) | Erzeugt synthetische Motor-WAVs. Nahtlose Schleife durch Tauschen der Hälften mit Überblendung in der Mitte. | Den **Schleifen-Trick** für die 4-s-ElevenLabs-Dateien nutzen (offline schneiden statt zwei versetzter Spuren zur Laufzeit). Die Synthese selbst nicht. |
| **Eigener Granular-Worklet** (Zündzyklen) | Wie REV und FH5: Hochdreh-Aufnahme in Zyklen schneiden, nach Drehzahl abspielen | Nur, wenn nach der SOP noch etwas fehlt. Aufwand etwa 2–3 Tage. |

## 4 · Quellen für Motor-Schleifen nach Drehzahl

| Quelle | Inhalt | Eignung |
|---|---|---|
| **ElevenLabs (bereits im Einsatz)** | KFB hat L1–L5, O1–O5, P01–P06, F1–F4, R01–R07 | **Erste Wahl.** Fehlend: Ohne-Last-Varianten (L2_off, L3_off, L4_off), Charakterstimme je Racer bei 3 Drehzahlen, Vorbeifahr-Whoosh S/L, Wind-Grollen und Wind-Pfeifen getrennt, Landungs-Bass, Jetpack-Zündung, -Schleife und -Ausklang, Mech-Servo und Hydraulik. Prompts mit konstanter Drehzahl („steady, constant RPM, no rev changes, seamless loop“). |
| OpenGameArt „Racing car engine sound loops“ (domasx2) · <https://opengameart.org/content/racing-car-engine-sound-loops> | 6 Schleifen, unterscheiden sich nur in der Tonhöhe · CC0 | Schwach, nur als Platzhalter. |
| OpenGameArt „Some sounds“ (Ziph) · <https://opengameart.org/node/166538> | Leicht cartoonhafter synthetischer Motor, gedacht für Tonhöhen-Bend + Überblendung · CC0 | Klangfarbe passt zum Cartoon, ist aber synthetisch (V-448). |
| Kenney „Sci-Fi Sounds“ · <https://opengameart.org/content/sci-fi-sounds> (auch kenney.nl) | 70 OGG, darunter Triebwerke · CC0 | Für den Schwebe-Racer und Antigrav-Akzente. |
| Freesound, Propeller-Schleife 75 Hz (TheRandomSoundByte2637) · <https://freesound.org/people/TheRandomSoundByte2637/sounds/607776/> | Zweiblatt-Wasserflugzeug bei 2 250 U/min · CC0 | **Gut für den Dieselpunk-Flieger** (Blattfrequenz = Drehzahl). |
| Freesound, Cessna 172S Überflug (gleicher Autor) · <https://freesound.org/people/TheRandomSoundByte2637/sounds/737571/> | Überflug bei 2 250 U/min · CC0 | Vorlage für Vorbeiflug und Doppler von NPC-Fliegern. |
| Freesound, Pack „Internal combustion“ (Mihacappy) · <https://freesound.org/people/Mihacappy/sounds/824890/> | Motorsäge im Leerlauf, laut Autor als Moped-Motor gut · CC0 | Schräge, cartoonhafte Motor-Quelle (Treg-Brown-Prinzip). |
| Freesound-Suche mit CC0-Filter · <https://freesound.org/search/?q=engine+loop&f=license%3A%22Creative+Commons+0%22> | Es gibt nur wenige echte Drehzahl-Schleifen unter CC0 | Zum Nachsuchen, Ausbeute gering. |
| Sonniss GDC Game Audio Bundles · <https://sonniss.com/gameaudiogdc> | 2015–2024 (+2026), zusammen ~230 GB; 2020 u. a. Automobile und Getriebe | Frei nutzbar ohne Namensnennung, aber nicht für KI-Training. Gut für Vorbeifahrten, Reifen, Blech, Jets. Trackliste über die Seite. |
| Magic Sound Effects „Car Engines“ · <https://magicsoundeffects.itch.io/car-engines> (auch Vol. 2, Aircraft, Futuristic) | 70 Schleifen in 5 Drehzahlstufen + 112 Übergänge, 14 Fahrzeuge, ab 25 $ | Bestes fertiges Format (5 Stufen + Übergänge). Lizenz: privat + ein kommerzielles Projekt. |
| Sonniss „Racing Vehicles Pass-By“ (Sonic Bat) · <https://sonniss.com/sound-effects/binaural-stereo-racing-vehicles-pass-by-bundle/> | Binaurale Vorbeifahrten (Caterham, GT) | Kostenpflichtig; Referenz für den Minto-Doppler. |

## 5 · SOP für KFB: Signale → Schichten → Regeln

### 5.0 Verfügbare Signale (schon im Code)

- **Takt** `frame(st)` aus AudioHost: `speed` (m/s), `throttle` (**0/1**, im Kessel-leer-Zustand 0,3), `brake`, `rpm01` (vehicleRig, Leerlauf 0,18, Hochschalten bei 0,93), `gear` (1–5 → Racer 1–4), `slip` (Rutschwinkel in rad), `air`, `surface`, `mode` drive/fly, `flyKind`, `vertical`.
- **Ereignisse** M2EVENTS (k2t): `takeoff {vy, speed, jump, kind}`, `landing {strength 0–1}`, `railImpact {strength, frontal}`, `driftCharge {stage 1–3}`, `driftBoost {stage}`, `twoWheel`, `trick`, `launch`, `respawn`, `nudge`. Aus vehicleRig: `shift {gear, up}`, `backfire {strength}`. Boost-Start aus M2Car.
- **Fehlt bzw. wird nicht genutzt:** geglättetes Gas (`D.gas` in M2Car) und daraus die **Last**; Abstand zur Kamera; Vorbeifahr-Treffer.

### 5.1 Fahren: 10 Schritte

1. **Last bilden:** `gas = D.gas` (geglättet), `load = clamp(gas + 2·max(0, drpm/dt) − 0,5·brake, −1, 1)`. Negativ = Schub/Schubabschaltung. An `frame()` als `load` übergeben, `throttle` nicht mehr binär.
2. **Motor-Kern (Gitter):** Tonhöhe je Schleife `rpm/key`, **Grenze ±25–30 %** statt ±10 %, damit beim Hochdrehen die Tonhöhe durchgehend steigt. Alternativ 6–8 Stützstellen. Überblendung gleichleistung (wie jetzt).
3. **Last hörbar machen** (bis Ohne-Last-Dateien da sind): Tiefpass `600 Hz + 7 kHz·max(0, load)`, Pegel ohne Last −6 dB, WaveShaper-Drive `0,2 + 0,6·max(0, load)`. Sobald es L*_off gibt: Unter-Last- und Ohne-Last-Paar nach `load` überblenden.
4. **Schalten:** beim Hochschalten 80–120 ms Delle (−9 dB, Tiefpass zu), Drehzahl springt, Flammenknall P06/O1 im selben Bild wie der Deformer-Stoß. Beim Runterschalten Zwischengas (O4). So bleibt es, nur zeitlich an den Deformer binden.
5. **Lastwechsel / Fehlzündung:** Gas weg bei `rpm01 > 0,55` → 300–900 ms Knistern (crackle-1…4) in zufälligen Abständen von 60–180 ms, dazu 1–2 Knalle (O2b/O2c) mit Flammen-VFX im selben Bild. Cartoon-Fassung: Knall darf ein Korkenknall sein.
6. **Boost (3 Teile):** Einatmen 120–180 ms (Sog, Ton +3 %) → Zündung (P04/O5) + Bass → Halten: steigender Shepard-Turbo-Ton, Tiefpass ganz offen, Motor +8 % Tonhöhe, Musik geduckt (gibt es schon) → Ausklang 400 ms. Der Boost bleibt leiser als eine harte Landung.
7. **Tempo:** Wind-Pegel ∝ `(speed/vmax)²`, Wind-Tiefpass 400 Hz → 6 kHz mit dem Tempo. Ab 70 % Höchsttempo Motor −4…−6 dB (NFS-Regel). Vorbeifahrten per Raycast nach vorn (Winkel wächst mit dem Tempo): 1 Bild getroffen = kleiner Whoosh, mehrere Bilder = großer. Den Whoosh vorziehen, damit seine Mitte auf dem Vorbeiflug liegt; Minto-Kurve für Pegel und Tonhöhe.
8. **Drift / Reifen:** R05-Pegel nach `slip` (gibt es schon), dazu Tonhöhe `0,9 + 0,25·speed01`. Ladestufen 1–3 je +3 Halbtöne (Mario-Kart-Funken). `driftBoost` = halber Boost (Zündung ohne Einatmen).
9. **Luft und Landung:** In der Luft dreht der Motor frei hoch (Drehzahl +15 %, Last 0, Tiefpass 2 kHz), Untergrund aus (gibt es schon), Wind lauter. Landung nach `strength`: Bass-Schlag 40–80 Hz + Knet-Squash + Federknarzen, im selben Bild wie der Squash-Deformer. Motor 150 ms ducken. Ab `strength > 0,55` hart (gibt es schon).
10. **Kamera und Doppler:** Abstand zur Kamera steuert den Tiefpass (nah offen, fern 3 kHz) und das Verhältnis Antrieb/Motor (nah mehr Mechanik). NPC-Fahrzeuge und Flieger mit DelayNode-Doppler (`delay = d/343`, geglättet) plus Minto-Übertreibung.

**Mix-Reihenfolge (laut → leise):** Crash/harte Landung > Boost-Zündung > Schaltknall > Motor beim Beschleunigen > Wind bei Höchsttempo > Untergrund > Musik.

### 5.2 Flug und Jetpack: 5 Regeln

1. **Wind trägt das Tempo:** zwei Schichten, tiefes Grollen ∝ Tempo und hohes Pfeifen ∝ Tempo² + |Querneigung|. Luftbremse fügt Turbulenz hinzu, Sturzflug hebt die Tonhöhe. Heute ist der Wind linear (`F3 gain = speed·(.35+…)`); auf Tempo² umstellen und den Tiefpass öffnen.
2. **Propeller (Dieselpunk):** Die Blattfrequenz ist die Drehzahl: Gas → `rate`. Beim Steigen Last hoch (Tiefpass offen), beim Sinken ohne Last + mehr Wind. Im Sturzflug ein leichtes Überdrehheulen. Vorbeiflüge von NPC-Fliegern mit Doppler.
3. **Jetpack in Stößen, nicht als Dauerklang:** jeder Stoß = Zündung (kurzer Knall) + Schleife + Ausklang (Abwürgen), jeder Stoß ±5 % anders gestimmt. Kessel leer (`boil`) → Stottern und Knistern statt Stille. Schweben = tiefer Puls, dessen Tremolo an das Wippen der Figur gekoppelt ist.
4. **Mech-Schritte:** Servo-Surren 80–120 ms vor dem Aufsetzen (Ausholen), Aufprall mit Bass 40–60 Hz, danach Hydraulikzischen. Die Servo-Tonhöhe folgt der Gliedergeschwindigkeit. Eine Jetpack-Mech-Landung ist der tiefste Bass im Spiel: alles andere 200 ms ducken.
5. **Scheitelpunkt und Fall:** Am höchsten Punkt eines langen Sprungs bzw. Fluges ein kurzer leiser Moment (Hang-Time), danach optional ein abwärts gleitender Pfeifton bis zur Landung (Coyote-Regel). Sparsam: nur über einer Luftzeit-Schwelle.

### 5.3 Reihenfolge der Umsetzung

1. Tonhöhen-Grenze ±25–30 % (eine Zahl in `gridWeights`, Fehler Nr. 1)
2. Geglättetes Gas als Last + Tiefpass/Drive (Schritte 1–3)
3. Wind ∝ Tempo², Motor bei Höchsttempo zurück (Schritt 7, Flugregel 1)
4. Landung: Bass + Squash im selben Bild (Schritt 9)
5. Boost dreiteilig mit Einatmen (Schritt 6)
6. Klangliste an WS0 (Ohne-Last-Varianten, Charakterstimmen, Whoosh, Wind-Paar, Jetpack-Stoß, Mech-Servo)
7. Vorbeifahr-Raycast + Minto-Doppler
8. Optional: Granular-Worklet

---

## Quellen

**Spiele / Postmortems / Interviews**
- Burnout-Retrospektive mit Ben Minto (Infinite Gear, Shepard-Turbo, Minto-Effekt, Vorbeifahr-Raycast, Musik-Überblendung): <https://designingsound.org/2017/08/31/burnout-a-sound-design-retrospective-with-ben-minto/>
- Vehicle engine design: Project CARS, Forza Motorsport 5, REV: <https://designingsound.org/2014/08/11/vehicle-engine-design-project-cars-forza-motorsport-5-and-rev/>
- NFS Unbound Sound Design (Motor zurück bei Tempo, Vorbeifahr-Detektoren, stilisierte Schicht): <https://80.lv/articles/a-deep-dive-into-need-for-speed-unbound-s-sound-design>
- GDC 2023 „Need for Speed: Hyperreal“ (Nathaniel Daw, nur für Mitglieder): <https://gdcvault.com/play/1029249/-Need-for-Speed-Hyperreal>
- Charles Deenen, NFS (Tierschichten, Mix für leise TV-Wiedergabe): <https://designingsound.org/2010/02/23/charles-deenen-special-need-for-speed-exclusive-interview/>
- Forza Horizon 5 Fahrzeug-Audio (Granular, Aufnahme auf der Piste): <https://www.gtplanet.net/fh5-new-audio-20210713/> · <https://jalopnik.com/heres-why-forza-horizon-5-sounds-so-good-straight-from-1847343451>
- Rocket League HDR-Audio: <https://www.rocketleague.com/news/under-the-hood--an-inside-look-at-hdr-audio-coming-to-rocket-league>
- Mario Kart 8 Audio-Analyse: <https://splice.com/blog/mario-kart-8-game-audio-fantastic/>
- Star Wars Episode I: Racer (Film-Klänge übernommen): <https://en.wikipedia.org/wiki/Star_Wars_Episode_I:_Racer>

**Middleware / Technik**
- Audiokinetic, Loop-Based Car Engine Design (Teil 1/2): <https://audiokinetic.com/loop-based-car-engine-design-with-wwise-part-1> · <https://www.audiokinetic.com/en/loop-based-car-engine-design-with-wwise-part-2>
- Audiokinetic, Engine Sound Modeling: Sampling → Granular: <https://www.audiokinetic.com/engine-sound-modeling-from-sampling-to-granular-synthesis-in-wwise>
- Audiokinetic, Racing Engine Sounds with REV: <https://www.audiokinetic.com/en/make-racing-engine-sound-based-on-rev2/> · Crankcase REV: <https://www.audiokinetic.com/products/plug-ins/crankcase-rev/>
- AudioMotors / FMOD (Granular, automatische Zyklus-Erkennung): <https://www.mcvuk.com/development/how-to-make-racing-car-engines-roar-using-audiomotors-fmod>
- BeamNG Sound (FMOD, Last-Mix je Motor): <https://wiki.beamng.com/Sound>
- Doppler aus PannerNode entfernt: <https://bugzil.la/1148354> · <https://bugs.webkit.org/show_bug.cgi?id=213360> · W3C-Diskussion: <https://lists.w3.org/Archives/Public/public-audio/2014JanMar/0174.html>

**Cartoon / Film**
- Treg Brown: <https://en.wikipedia.org/wiki/Treg_Brown> · 99% Invisible, Classic Cartoon Sound Effects: <https://99percentinvisible.org/episode/classic-cartoon-sound-effects/transcript/> · 20k Hz „Cartoon“: <https://www.20k.org/episodes/cartoon>
- Ben Burtt, Podrace: <https://dorksideoftheforce.com/posts/phantom-menace-25th-ben-burtt-explains-the-sound-behind-episode-i-01hykmy9cqvq> · <https://filmsound.org/starwars/benburtt1.htm> · Kyma bei den Podracern: <https://news.symbolicsound.com/?p=15>
- Mickey-Mousing: <https://www.studiobinder.com/blog/mickey-mousing/>

**Browser-Code**
- Antonio-R1 engine-sound-generator: <https://github.com/Antonio-R1/engine-sound-generator>
- DasEtwas/enginesound: <https://github.com/DasEtwas/enginesound>
- Tone.js GrainPlayer (API): <https://unpkg.com/browse/tone@15.1.22/build/esm/source/buffer/GrainPlayer.d.ts>
- Grundlage des KFB-Gitters: KhazP/rwanda-f1-2026-sim `vf26-audio.ts` (siehe `vendor/audio/racer/NOTICE.md`)

**Klangquellen:** siehe Tabelle in Abschnitt 4.
