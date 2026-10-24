# Research · HeyGen-Stimmen für eine Fantasie-Sprache (R1 · 24.10.2026)

Für: Georg · Bezug: V-492, V-525, V-527, V-606/V-617, V-663, V-678, V-714, V-717, V-719 · Ergänzt `RESEARCH_HEYGEN_AND_VOICE_CAST_R1.md` (18.10.), wiederholt es nicht.
Methode: Websuche und Doku-Abruf am 24.10.2026. Keine API-Aufrufe, keine Downloads, nichts installiert.
Marken: [B] belegt (Doku), [B-H] nur Herstelleraussage, [E] Einschätzung WS0.

## Tier 0

1. HeyGen hat eine **reine Audio-API** (`POST /v3/models/audio/tts`, WAV 44,1 kHz). Der Umweg über ein Video ist unnötig. Das Modell `heygen-voice-1-turbo-free` ist **bis 30.11.2026 kostenlos**, auch über MCP [B].
2. Fantasie-Text klappt am besten mit **erzwungener Wirtssprache** (`language`) und offener Silbenschrift (it, es, pt, fi, ja-Kana). Gefühl entsteht über Satzzeichen, Wiederholung und Vokallänge. Echte Emotions-Regler gibt es nur über die ElevenLabs-v3-Route in HeyGen oder im Web-Editor.
3. Das ist ein **Δ zu V-492** („keine Silben, keine Fantasie-Wörter im Audio“). Vorschlag: eigene Schicht nur für Orte, Orakel, Fahrzeuge und HyperNorm, als ganze Phrasen und hörbar verfremdet. Erster Test 6 Zeilen × 3 Stimmen kostet 0 HeyGen-Credits.

---

## 1 · HeyGen-Stimmen heute

| Punkt | Stand | Status |
|---|---|---|
| Umfang | „300+ Stimmen, 175+ Sprachen“ laut Marketing; Entwickler-Doku sagt nur „300+“ und „dozens of languages“ | [B-H] / [B] |
| Engines | Drei: `orca` (HeyGen Voice, Standard für Katalog), `starfish` (HeyGen), `elevenlabs` mit `settings.model_id` = `eleven_v4`, `eleven_v3`, `eleven_multilingual_v2`, Flash, Turbo | [B] |
| Audio-only, Weg A | `POST /v3/models/audio/tts` (+ `/stream`). Modelle `heygen-voice-1`, `-turbo`, `-turbo-free`. Ergebnis: mono WAV, 44,1 kHz, `duration`, optional Zeichen-Zeitstempel | [B] |
| Audio-only, Weg B | `POST /v3/voices/speech` (Katalog-Stimmen, alle Engines). Ergebnis: Audio-URL (Beispiel MP3), `word_timestamps` je Wort | [B] |
| Audio-only, Web | „AI Voice Generator“: Skript, Stimme, Tempo/Betonung/Emotion/Pausen, Download als MP3 (Stand 10.10.2026) | [B-H] |
| Regler Weg A | Public-Stimmen: nur `text`, `language`, `model`. Instant-Clone: `expressiveness_boost` 0–1. Professional-Clone: `speed` 0,75–1,25, `pitch_shift` ±4 HT, `pitch_variance` 0,5–2, `seed` | [B] |
| Regler Weg B | `speed` 0,5–2, `language`/`locale`, `engine`, `input_type` text/ssml. Kein Emotions- oder Pitch-Feld | [B] |
| Regler im Avatar-Video | `speed` 0,5–1,5, `pitch` ±50 HT, `locale` | [B] |
| Markup | Nur `<break time="0.5s"/>`, nur bei Stimmen mit `support_pause`. Weitere Tags wie `<speak>` erzeugen gesprochene Artefakte | [B] |
| Emotion im Web-Editor | **Voice Director** mit 8 Presets (Excited, Casual, Calm, Cool, Serious, Funny, Angry, Sarcastic) plus freiem Text, braucht die „Panda“-Engine. **Voice Tags** über ElevenLabs v3 mit „Enhance“-Knopf. **Voice Mirror**: eigene Aufnahme überträgt Tempo und Gefühl auf eine Katalogstimme, transkribiert aber vorher | [B-H] |
| Speech-to-Speech | `POST /v3/models/audio/sts`: Aufnahme ≤ 300 s → eigene Instant-Stimme, Wörter und Timing bleiben. Abrechnung nach Länge, Satz nicht genannt. OAuth nur mit bezahltem Plan | [B] |
| Voice Design | `POST /v3/voices` liefert bis 3 Treffer je Prompt und Seed, Typ `public` oder `private`. [E] Das sieht nach Suche im Katalog aus, nicht nach echter Neuschöpfung wie bei ElevenLabs | [B] / [E] |
| Klonen | Instant-Clone aus einer Aufnahme (erste 3 Min), in der Vorschau kostenlos. Professional-Clone kostet einen Slot | [B] |
| Kosten Audio | Turbo Free: 0 bis 30.11.2026, kein Guthaben nötig, geteilte Kapazität (429 möglich). Standard und Turbo: kostenpflichtig, **Satz nicht veröffentlicht**. MCP rundet je Anfrage auf ganze Einheiten auf | [B] |
| Kosten Video (Vergleich) | Avatar III Foto 7/Min, Avatar IV Foto 16/Min, Avatar V 48/Min, Video Agent 80/Min (aus R1, heute erneut bestätigt) | [B-H] |
| Plan vs. API | MCP (OAuth) zieht Plan-Credits. API-Key zieht separates Dollar-Guthaben. Plan-Credits rollen nur **einen** Zyklus weiter | [B] |
| Limits | TTS und STS je 30 Anfragen/Min und Mitglied; Text 1–5.000 Zeichen; 10 parallele Jobs | [B] |

[E] Folge: Für die Klangschicht reicht Weg A mit Turbo Free. Weg B mit `engine: elevenlabs` + `eleven_v3` ist die einzige API-Route mit Gefühls-Tags. Ob HeyGen die Tags `[whispers]` usw. durchreicht, ist **nicht belegt**.

## 2 · Fantasie-Text in TTS

**Was mit erfundenen Wörtern passiert** [E, gestützt auf Doku]
- Neuronale TTS raten die Aussprache aus der Schreibung nach den Regeln der erkannten Sprache. Bei Kauderwelsch rät die Spracherkennung oft falsch, die Aussprache springt dann mitten im Satz. Darum `language` **immer setzen**. HeyGen prüft den Code nicht gegen den Text, man kann also `it` auf Unsinn erzwingen [B].
- Großbuchstaben-Wörter werden leicht als Abkürzung buchstabiert. Bei ElevenLabs v3/v4 heißen Großbuchstaben dagegen Betonung [B]. Für HeyGen-Modelle daher keine Versalien.
- Reine Konsonanten-Cluster (`tschk`, `brrr`) werden ausgelassen, gezischt oder buchstabiert. Silben sollten offen sein: Konsonant + Vokal.
- Zu kurze Texte sind instabil. Eine Zeile ≥ 60–80 Zeichen, mehrere Phrasen je Anfrage, dann schneiden [E].
- Ergebnis ist nicht deterministisch. `seed` gibt es nur für Professional-Clones. Mehrfach rendern und auswählen, wie ElevenLabs selbst rät [B].
- Exakte Lautschrift: ElevenLabs v4 versteht IPA in Schrägstrichen `/ˈlu.ma/`; Phonem-Tags nur `eleven_flash_v2` [B]. Ob das über HeyGens ElevenLabs-Route funktioniert: **nicht belegt**.

**Vorbilder**
- **Simlish:** Echte Sprachen (u. a. Ukrainisch, Tagalog, Navajo) wurden verworfen, weil erkennbar und schnell ermüdend. Gewonnen hat Improvisation mit Gefühl nach der Übung „Foreign Poet“ und eine kleine Liste fester Wörter [B]. Lehre: Gefühl schlägt Wortbau, und einige feste Wörter geben Wiedererkennung.
- **Animalese:** Echte Sprache in Laut-Stücke zerschnitten, beschleunigt und hochgepitcht. Lage je Figur, Stimmung verschiebt die Lage [B]. Das ist nahe an dem, was V-492 als „kaputte Sprachausgabe“ verworfen hat. Also keine Silben-Stücke, sondern **ganze Phrasen**.
- **Elbisch/Kobold-Prinzip:** Feste Lautpalette je Volk. Weich = l, m, n, w, h + a/o/u. Hart = k, g, d, r + kurze Vokale. Mystisch = lange Vokale, Hauchlaute, Pausen [E].

**Technik für KFB** [E]
1. **Eine Lautpalette je Familie**, mit einer gemeinsamen Fluff-Basis (fl-, lu, fa, mu). So bleibt „eine Sprache“ aus Chatterbox Leitsatz 6 gewahrt, nur dialektal gefärbt.
2. **Wirtssprache als Aussprache-Motor**, nicht als Akzent. Gut sind Sprachen mit durchsichtiger Schreibung: `it`/`es` (Akzentzeichen steuern die Betonung: `dindoló`), `pt` (Tilde = Nasal: `mõu`), `fi` (Doppelvokal = lang: `uuma`), `ja` mit Kana (Silbe für Silbe). Nach Chatterbox §7 bleibt der Hörtest Pflicht: Klingt es nach Karikatur einer realen Sprache? Dann Wirtssprache wechseln.
3. **Melodie über Zeichen:** `?` steigt, `!` drückt, `...` dehnt und senkt, Bindestrich hält Silben zusammen, Komma ist eine kurze Pause. Wiederholung (`tok, tok, tók!`) baut Spannung. Vokale doppeln dehnt.
4. **Keine echten Wörter.** Jedes Kunstwort gegen die Wörterbücher der Wirtssprache prüfen (automatisch, z. B. Hunspell-Listen).

**Sechs Beispielzeilen** (Entwurf, Abnahme nach Gehör)

| Gefühl | Zeile | Wirtssprache | Hinweise |
|---|---|---|---|
| fröhlich | `Ollá-bimú! Tirri-lu, lalo-wéna... huppa-lá, dindoló!` | `it` | Akzente setzen Endbetonung, Sprünge nach oben; schnelle Stimme |
| wütend | `Grónda-kka! Bra-dak, tok, tok, tók! Gorrum bá-dak!` | `es` | gerolltes r, Plosive, `!` auf kurzen Silben; keine Versalien |
| traurig | `Ahh... mõu, nãu-lena... ũ-mo, lu... lo.` | `pt` | Nasale, fallende Enden, lange Pausen; leise Stimme |
| neugierig | `ぽにら? ぬみゅ… ぽにぽにら?` (ponira? numyu… poniponira?) | `ja` | Kana statt Romaji, sonst liest es Englisch; Fragezeichen steigen |
| Orakel | `Ouuma... iluva-sae, oo-mien... häelaa, uu-lo.` | `fi` | Doppelvokale für Länge, Hauchlaute; tiefe, ruhige Stimme; später Hall nach Raum „Ritual“ |
| Fahrzeug | `Tikka-tok, tikka-tok... bru-bru-brumma! Tsu-paff. Wonnka?` | `en` | Rhythmus-Silben statt Konsonant-Clustern; danach Formant und Bandpass; Motor-Teil besser aus ElevenLabs SFX |

## 3 · Pipeline

| Schritt | Werkzeug | Automatisierbar | Hinweis |
|---|---|---|---|
| 1 Zeilen schreiben | Lautpalette + Vorlage je Gefühl | teils (Generator + Wörterbuch-Check), Auswahl durch Mensch | eine JSON-Liste je Familie: `text`, `language`, `emotion`, `voice_id` |
| 2 Stimmen wählen | `GET /v3/models/audio/voices?type=public` bzw. MCP `list_voices` | ja | Größe des Public-Katalogs für Turbo Free **nicht belegt** |
| 3 Rendern | MCP `generate_model_speech` (Turbo Free) oder `create_speech` (ElevenLabs-v3-Route) | ja | 30/Min; 18 Clips < 1 Min; 429 bei voller Free-Kapazität → warten und neu versuchen |
| 4 Laden | Audio-URL → WAV | ja | **kein Video, kein Extrahieren**. Nur beim Avatar-Weg: `ffmpeg -vn`, dann ist das Audio AAC-komprimiert |
| 5 Schneiden | Zeitstempel aus der Antwort (Wort bzw. Zeichen) | ja | Besser als `harvest_phrases.py`: Dessen Klarheits-Schwelle (`KFB_CLARITY` 0,75) trennt Sprache an stimmlosen Konsonanten. Harvest nur für Grundton, Kontur und Tonart nutzen |
| 6 Verfremden | Pitch auf Familien-Lage, Formant-Shift, Filter, Raum aus Context Genome | ja (Offline-Render) | Ziel Chatterbox Leitsatz 5: klar nicht-menschlich |
| 7 Pegeln | `lufs_set.py`, −16 LUFS | ja | derselbe Weg wie bei den ElevenLabs-Sätzen |
| 8 Manifest | Grain-JSON: Familie, Gefühl, Wirtssprache, Seed, Quelle | ja | wie Harvest-Manifest |
| 9 Abnahme | Hub-Hörkarte, blind | nein | Gefühl erkennbar? Karikatur? nervt nach 10? |

**Bonus-Weg Talkbox** [E]: Die Fantasie-Phrase dient als Modulator, ein Chatterbox-Instrument als Träger (Vocoder bzw. Talkbox; Talkbox steht schon in der Klangmatrix). Dann „spricht“ das Instrument mit Vokalformen. Die Melodie bleibt Instrument, und das passt besser zu V-492.

**Speech-to-Speech-Weg** [E]: Georg spricht Kauderwelsch selbst ein (Simlish-Methode), dann STS auf mehrere Instant-Stimmen. Risiko: STS will „klar lesbare“ Sprache und Voice Mirror transkribiert. Kauderwelsch kann daran scheitern (**nicht belegt**). Alternative mit bekanntem Preis: ElevenLabs Voice Changer, 1.000 Credits/Min.

## 4 · Videospur für HyperNormalisation

**Rahmen aus dem Register:** V-527 sagt für WSV „HeyGen ohne Avatare“. V-606 sagt: in den Zonen keine Video-Loops, Tafeln laufen live auf Canvas. HeyGen-Video gehört also in **Remotion-Clips (WS-Media)** oder liefert Standbilder bzw. Schnipsel als Material für die H15-Engine (V-617). Avatare brauchen Georgs ausdrückliches OK als Änderung zu V-527.

**Die Idee, die trägt** [E]: Ein glatter Prompt-Avatar als Nachrichtensprecher spricht die Fantasie-Sprache. Die Bedeutung läuft auf Englisch im Ticker. Das ist die Triplet-Logik als Fernsehbild: Klang ohne Sinn, Sinn in der Schrift.

| Funktion (Kostenrang) | Credits | Nutzen für HyperNorm | Status |
|---|---|---|---|
| HyperFrames (lokal) | 0 | Ticker, Logos, Rahmen, Untertitel | [B] |
| Video-Übersetzung ohne/mit Lip-Sync | 4 / 6–10 pro Min Quelle | eigene Clips umsprechen. Fantasie als Zielsprache geht nicht, Weg: Lip-Sync allein mit eigenem Audio | [B-H] |
| Lip-Sync allein (Video + eigenes Audio) | Satz **nicht belegt** | vorhandenen Sprecher-Clip auf Fantasie-Audio umsynchronisieren | [B] |
| Avatar III Foto | 7/Min | billig, steifer | [B-H] |
| **Avatar IV mit eigenem Audio** (`audio_url`, `output_format: webm` mit Alpha) | **16/Min** | **Hauptkandidat:** Sprecher spricht unser Fantasie-Audio, freigestellt für Remotion/H15. 20 s ≈ 6 Credits | [B] |
| Avatar V | 48/Min | höhere Treue, nicht nötig für Satire | [B-H] |
| Generate Assets (Seedance/Veo) | ab 12/Min, je Modell mehr | generische B-Roll-Schnipsel als Collage-Material | [B-H] |
| Video Agent | 80–240/Min | fertige Presenter-Videos, 20–45 Min Wartezeit, nicht steuerbar | [B] |

**Was nicht taugt** (aus R1, weiter gültig): Ton-Figuren wie FrizzleBob als Foto-Avatar (Mund und Ton-Oberfläche verschmieren), VFX, Musikvideos mit mehreren Szenen, Video Agent für Kartenclips, Realfilm-Clips ohne Alpha. Neu offen: ob Lip-Sync auf Fantasie-Audio sauber greift (Doku sagt nichts zu Nicht-Sprache). Reale Personen dürfen nicht imitiert werden, also nur synthetische Prompt-Avatare.

Lizenz in einer Zeile: Auf bezahlten Plänen gehört der Output uns. Uploads gehen unter HeyGens Trainings-Lizenz, also keine unveröffentlichten Figuren-Renders hochladen.

## 5 · Welches Werkzeug für welchen Job

| Aufgabe | HeyGen | ElevenLabs | Suno | Wahl [E] |
|---|---|---|---|---|
| **Fantasie-Sprachmelodie** (Phrasen mit Gefühl) | Turbo Free kostenlos bis 30.11.; viele Stimmen; Gefühl nur über Text bzw. v3-Route bzw. Web-Director | v3/v4 mit Audio-Tags und IPA, beste Gefühlssteuerung; Voice Design schafft Fantasy-Stimmen („elves to elder gods“); ≈ 1 Credit/Zeichen | Gesang in Fantasie-Silben möglich, aber als Song und schwer schneidbar | **HeyGen für Masse und Varianten, ElevenLabs v3 für Schlüsselzeilen** |
| **Instrument-artige Stimm-Melodie** | nein | SFX-Prompt (40 Credits/s, ≤ 30 s), schon Pipeline `sfx_gen.py`; Gesten je Familie | Solo-Instrument-Farmen + Harvest | **ElevenLabs SFX zuerst** (V-719), Suno nur wo SFX scheitert; Talkbox-Hybrid mit HeyGen-Phrasen |
| **Orts-/Orakel-Stimme** (V-717) | Fantasie-Flüstern als Textur unter dem Instrument | sechs Orts-Familien laut V-719 (≈ 2.800 Credits) | S3 Erd-Resonanz | ElevenLabs-Familien + HeyGen-Flüsterschicht |
| **Fahrzeug-Stimme** | nur Rhythmus-Silben als Würze | SFX für Motor, Hupe, Klappern | – | **ElevenLabs SFX**, HeyGen optional |
| **Soundbed** | nein (nur Katalog-Suche `search_audio_sounds`) | Eleven Music v2.5, 3 s–5 Min, instrumental; Stems 2/4/6 kosten 0,5–1× Generierung | stärkste Musik, aber Credits knapp | **Eleven Music testen** (V-719 B), Suno nur drei Betten |
| **HyperNorm-Bild** | Avatar IV + Alpha, 16/Min | – | – | HeyGen (nach OK zu V-527) |

## Empfehlung

1. **Erst entscheiden:** Fantasie-Sprache als eigene Schicht `voiceTexture` für `kind: locus` und `vehicle`, für Orakel und HyperNorm. Figuren-Dialog bleibt Melodie (V-492); höchstens Talkbox-Hybrid. Nur ganze Phrasen, nie Silben-Stücke.
2. **Audio direkt holen**, nicht über Video: MCP `generate_model_speech` mit `heygen-voice-1-turbo-free`. Das kostet 0 Credits bis 30.11.2026, das Fenster ist also jetzt.
3. **Erster Test (0 HeyGen-Credits):** 6 Zeilen aus §2 × 3 Public-Stimmen (tief, mittel, hell) = 18 Clips. Dazu dieselben 6 Zeilen einmal mit ElevenLabs v3 und Tags als Referenz (≈ 500 ElevenLabs-Credits).
4. **Messen** blind mit Georg + 1–2 Hörern: Gefühl erkannt (Ziel ≥ 4 von 6)? Klingt es nach einer realen Sprache (Ziel: nein)? Aussprache stabil über 3 Renders? Nervt es nach 10 Zeilen?
5. **Schneiden über Zeitstempel**, pegeln auf −16 LUFS, Manifest wie Harvest. Danach 2 Varianten verfremden: Formant/Pitch und Talkbox auf einem Chatterbox-Instrument.
6. **HyperNorm-Probe** nach OK zu V-527: ein Prompt-Avatar-Sprecher, 2 × 20 s Avatar IV mit Fantasie-Audio, WebM mit Alpha, englischer Ticker aus HyperFrames. ≈ 12 Credits, Einbau als Remotion-Clip (WS-Media).
7. **Restliche HeyGen-Plan-Credits** vor dem Verfall in Avatar-Clips für HyperNorm stecken, nicht in Video Agent. ElevenLabs bleibt Hauptquelle für Gesten und SFX, Suno nur für Songs und die drei Betten.
8. **Ablauf:** Georg gibt MCP per OAuth frei (falls noch nicht geschehen) und sagt Go im Chat. WS0 rendert, legt die Hörkarte in den Hub, Einbau erst nach PASS.

## Offene Punkte

- Δ zu **V-492** (Fantasie-Wörter im Audio), zu **V-527** (Avatare) und Rahmen **V-606** (Video nur als Remotion-Clip): Georg entscheidet.
- Georgs HeyGen-Plan, Credit-Stand und Ablaufdatum der Credits; ist der MCP schon eingerichtet?
- Kosten für TTS auf Standard-Modellen und für Lip-Sync allein: nicht veröffentlicht, im ersten Lauf über `get_current_user` vorher/nachher messen.
- Reicht HeyGen ElevenLabs-v3-Tags und IPA (`/…/`) durch? Wie groß ist der Public-Katalog für Turbo Free?
- Funktionieren STS und Voice Mirror mit Kauderwelsch? Greift Lip-Sync auf Nicht-Sprache?
- Welche Wirtssprachen sind nach dem Karikatur-Hörtest (Chatterbox §7) erlaubt?

## Quellen

- HeyGen TTS: https://developers.heygen.com/docs/voices/heygen-voice-speech.md · https://developers.heygen.com/docs/models/heygen-voice.md
- HeyGen Speech/Engines: https://developers.heygen.com/reference/generate-speech.md · https://developers.heygen.com/docs/voices/speech.md · https://developers.heygen.com/docs/voices/overview.md · https://developers.heygen.com/docs/voices/search-voices.md · https://developers.heygen.com/reference/design-a-voice.md
- HeyGen STS: https://developers.heygen.com/docs/voices/speech-to-speech.md
- HeyGen Limits/MCP/Credits: https://developers.heygen.com/docs/usage-limits.md · https://developers.heygen.com/mcp/overview · https://help.heygen.com/en/articles/15126059 · https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained
- HeyGen Audio-to-Video, Lip-Sync: https://developers.heygen.com/audio-to-video.md · https://developers.heygen.com/lipsync-speed.md
- HeyGen Web: https://help.heygen.com/en/articles/11408956-how-to-use-mirror-voice-and-direct-voice · https://www.heygen.com/blog/generate-audio-only-in-heygen · https://www.heygen.com/tool/ai-text-to-speech
- ElevenLabs: https://elevenlabs.io/docs/best-practices/prompting/pronunciation · https://elevenlabs.io/docs/best-practices/prompting/eleven-v3 · https://elevenlabs.io/docs/overview/capabilities/sound-effects · https://elevenlabs.io/docs/overview/capabilities/music · https://elevenlabs.io/blog/eleven-music-new-tools-for-exploring-editing-and-producing-music-with-ai
- Simlish: https://en.wikipedia.org/wiki/Simlish · Animalese: https://nookipedia.com/wiki/Animalese · https://matinee.co.uk/blog/video-game-languages/
