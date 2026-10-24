# KFB Counselor/Oracle · Recherche R1 · 2026-10-24
**Status:** Recherche, keine Entscheidung. Basis für eine Spec "Oracle-Persona" neben dem Charakter-Register.
**Bezug:** Mindspaces (6 Räume, 1 Engine), `CHATTERBOX_SPEC_R2.md` (Feld `chatter` in `character.json`), Genius-Loci-Orte.

## Tier 0
1. Zuerst **Mirror Chamber als Text-Orakel**: ein Ort spricht, stellt nur Spiegel- und Clean-Fragen, nimmt eine KFB-Karte als Bildanker.
2. Persona als **JSON neben `character.json`** (§2.5). Fragezüge sind Daten, nicht Prompt-Prosa. Stimme anfangs wortlos (Chatterbox) plus Textblase.
3. Live-Stimme erst danach, als **ein Bus im bestehenden Mixer**, mit langsamem Turn-Taking (§3).

## 1 · Gesprächsmuster: spiegeln statt raten

Gemeinsamer Kern aller Methoden: Wörter des Spielers wörtlich zurückgeben, keine eigenen Deutungen, kurze Fragen, Pausen aushalten, der Spieler bestimmt Richtung und Tempo.
### 1.1 Clean Language (David Grove)
Kern: nur die Wörter des Spielers benutzen, eigene Begriffe vermeiden. Zwei Fragen machen etwa die Hälfte einer Sitzung aus: "Welche Art von X?" und "Gibt es noch etwas zu X?". Typischer Satzbau: "Und [Wörter des Spielers] ... und wenn [Wörter], dann ...?"
- "Und wenn es *ein Nebel im Kopf* ist, was für ein Nebel ist das?"
- "Und gibt es noch etwas zu diesem Nebel?"
- "Und wo ist dieser Nebel?"
- "Und wie ist er? Wie groß? Welche Farbe?"
- "Und dieser Nebel ist wie ... was?"
- "Und was möchte geschehen?"
- "Und was braucht der Nebel, damit das geschehen kann?"

**Nicht aufdringlich durch:** null eigene Metaphern, keine Bewertung, die Frage ist fast leer. Für ein LLM leicht prüfbar: jedes Inhaltswort der Antwort muss im Spielertext vorkommen.
### 1.2 Reflektives Zuhören / Motivational Interviewing (OARS)
Kern: **O**ffene Fragen, **A**nerkennen, **R**eflektieren, **S**ummieren. Faustregel: mehr Reflexionen als Fragen (etwa 2:1). Reflexionen sind Aussagen, keine Fragen. Typen: einfach (umformulieren), komplex (Bedeutung ahnen), doppelseitig (beide Seiten, "und zugleich"), verstärkt, Satz weiterführen.
- "Was beschäftigt dich gerade am meisten?"
- (einfach) "Du bist müde von dem Projekt."
- (komplex) "Es klingt, als ob es weniger um Arbeit geht als um Sinn."
- (doppelseitig) "Ein Teil von dir will weg, und ein anderer Teil hängt daran."
- (Satz weiterführen) "... und vielleicht fehlt dir dabei jemand, der zuschaut."
- (summieren) "Also: die Idee lockt, der Zeitpunkt nicht, und du willst es nicht verlieren. Hab ich was vergessen?"

**Nicht aufdringlich durch:** keine Ratschläge ohne Erlaubnis ("Magst du eine Idee hören, oder lieber weiter sortieren?"), Autonomie betonen ("Das entscheidest du").
### 1.3 Focusing (Gendlin)
Sechs Schritte: Raum schaffen · Felt Sense · Griff (Wort/Bild) · Resonieren · Fragen · Empfangen. Kern: Antwort aus dem Körpergefühl, nicht aus dem Kopf. Langsamkeit ist Teil der Methode.
- "Nimm dir einen Moment. Was ist gerade da, wenn du fragst: Wie geht es mir?"
- "Stell das kurz neben dich. Was ist noch da?"
- "Wenn du eines davon nimmst: Wie fühlt sich das *als Ganzes* an?"
- "Gibt es ein Wort oder Bild, das dazu passt?"
- "Passt *schwer und grau*? Oder ist es etwas anderes?"
- "Was macht es so *schwer und grau*?"
- "Was bräuchte es?"

**Nicht aufdringlich durch:** der Spieler prüft selbst ("passt das?"), das Orakel korrigiert nie.
### 1.4 Aktive Imagination (Jung, nach R. Johnson)
Vier Schritte: Figur einladen · Dialog · eigene Haltung einbringen · konkret machen (kleines Ritual). Hillman: Inneres als Figuren mit Gesicht, Stimme, Namen behandeln; beim Bild bleiben statt deuten.
- "Wer oder was taucht auf, wenn du an das denkst?"
- "Wie sieht die Figur aus? Was trägt sie?"
- "Frag sie, was sie will. Was antwortet sie?"
- "Was möchtest du ihr sagen?"
- "Was gibt sie dir mit? Oder was nimmt sie mit?"
- "Was wäre eine kleine Geste, um das festzuhalten? (Stein legen, Karte umdrehen, Licht anzünden)"

**Nicht aufdringlich durch:** das Orakel spielt nie die Figur selbst, es fragt nur nach ihr. Keine Deutung ("das ist dein Schatten") außer der Spieler fragt.
### 1.5 Bildbasierte Wahrnehmungsarbeit (NATHAL-ähnlich)
Zu "NATHAL" fand sich keine Quelle. Für KFB reicht das gemeinsame Muster aus Imaginations-, Psychodrama- und Kunstdidaktik-Methoden: inneres Bild scharf stellen, Standort wechseln, Rollentausch, blinde Flecken durch Randfragen.
- "Was siehst du? Was ist im Vordergrund, was am Rand?"
- "Geh drei Schritte zurück. Was ändert sich?"
- "Schau von oben. Von hinten. Was ist von dort anders?"
- "Wenn du das Bild *wärst*: wie fühlt es sich an?"
- "Was im Bild hast du noch nicht angeschaut?"
- "Wo ist es dunkel oder unscharf?"
- "Wer fehlt im Bild?"

**Nicht aufdringlich durch:** Perspektiv-Wechsel als Spielzug (Kamera), nicht als Belehrung. Passt direkt in die 3D-Engine: das Orakel kann die Kamera im Mindspace wirklich drehen.
### 1.6 Rick-Rubin-Stil (Tetragrammaton, "The Creative Act")
Belegt: sehr kurze Ein-Satz-Fragen, Neugier statt Widerspruch ("Wie bist du dahin gekommen?", "Warum ist das so?"), langsame, lange Gespräche, Haltung des Nichtwissens. Pausen als Taktik ist nicht explizit belegt, passt aber zum Format.
- "Wie hat das angefangen?"
- "Was hast du da bemerkt?"
- "Wie bist du dahin gekommen?"
- "Was fühlt sich daran lebendig an?"
- "Was wäre, wenn du nichts davon wissen müsstest?"
- "Und dann?"
- (Schweigen, 4–8 s)

**Nicht aufdringlich durch:** Neugier ohne Ziel, keine Zusammenfassung, kein Urteil. Ideal für Creative Atelier.
### 1.7 Orakel / Tarot als projektiver Anstoß
Kern: die Karte ist ein mehrdeutiges Bild; der Spieler deutet, das Orakel fragt. Ziehen als Ritual (Kayfabe).
- "Was siehst du zuerst auf dieser Karte?"
- "Welche Figur auf der Karte bist du gerade?"
- "Was tut sie gleich als Nächstes?"
- "Was steht außerhalb des Bildrands?"
- "Wenn die Karte zu deiner Frage spricht: was sagt sie?"
- "Dreh sie um (Umkehrung). Was ändert sich?"

**Nicht aufdringlich durch:** keine fixe Bedeutungsliste vorlesen. Die Karte liefert nur Bild, Titel, Stichworte.
### 1.8 Oblique Strategies (Eno/Schmidt, 1975)
Kern: kryptische Anweisung, bricht Muster, gibt keinen Inhalt vor (z. B. "Honour thy error as a hidden intention"). Für KFB eigene Sätze im Fluff-o-lect-Ton schreiben, nicht das Original zitieren.
- "Was wäre der Fehler als Absicht?"
- "Mach es kleiner."
- "Was würde dein ältester Freund tun?"
- "Nur ein Element. Welches?"
- "Dreh die Reihenfolge um."
- "Was ist das Langweiligste daran? Fang dort an."

**Nicht aufdringlich durch:** ein Satz, dann Schweigen. Spieler darf "nächste Karte" sagen.
### 1.9 Regeln für die LLM-Persona (aus allen Methoden)
| Regel | Umsetzung |
|---|---|
| Kurz | max. 1–2 Sätze, max. 1 Frage je Zug |
| Wörtlich | Schlüsselwörter des Spielers zitieren; Lint: neue Metaphern zählen |
| Kein Rat | Rat nur nach expliziter Bitte und mit Erlaubnisfrage |
| Reflex vor Frage | Verhältnis Reflexion:Frage ≈ 2:1 |
| Pause | nach tiefer Frage Schweigen; Ort reagiert mit Klang statt Text |
| Ausstieg | jederzeit "genug" → Orakel schließt mit 1 Satz Summe + Geste |
| Kayfabe | Orakel bleibt Ort/Wesen; spricht über sich in Bildern ("Der Brunnen hört zu.") |

## 2 · Persona-Design
### 2.1 Persona je Mindspace-Raum
| Raum | Ton | Tempo / Stille | Fragestil (Hauptzüge) | Sinnesanker | Spooky |
|---|---|---|---|---|---|
| Living Garden | warm, leise | sehr langsam, Atem-Takt 4–6 s | Focusing, einfache Reflexion | Wind, Blätter, Atem-Pad | 0 |
| Creative Atelier | neugierig, verspielt | mittel, kurze Pausen | Rubin, Oblique, "und dann?" | Papier, Kreide, Bild-Nachbarschaften (Warburg-Wand) | 0–1 |
| Mirror Chamber | ruhig, präzise | langsam, lange Stille | Clean Language, Perspektivwechsel | Spiegel, Glasharfe, Echo | 1 |
| Dream Passage | sanft, traumlogisch | fließend | aktive Imagination, "was passiert dann?" | Portale, Wasser, Rückwärts-Klänge | 1–2 |
| Fractal Vision | staunend, assoziativ | wellenförmig | Bild-Verwandlung, "was wird daraus?" | Muster, Farbverlauf, Obertöne | 1–2 |
| Threshold Observatory | feierlich, zweideutig | langsam, Stille als Spannung | Tarot, konkurrierende Deutungen ("die Akademie sagt ..., der Demon Lord sagt ... und du?") | Sterne, Kehlgesang, tiefe Drones | 2–3 |

Spooky-Skala: 0 = gemütlich · 1 = geheimnisvoll · 2 = leicht unheimlich (Echo, falsche Wiederholung) · 3 = dystopisch-sanft (der Ort "kennt" dich zu gut, bleibt aber freundlich).
### 2.2 Genius Loci als Orakel
- Das Orakel ist **eine Figur im Register** mit `kind: "place"` (oder `"vehicle"`). Es hat Gedächtnis (was der Spieler hier gesagt hat) und eine Sprachmelodie (`chatter`).
- Ort-Kayfabe: "Ich bin der Brunnen. Ich habe viele Fragen gehört. Deine klingt nach ..." (nur Spielerwörter).
- Gedächtnis sparsam: max. 3 Bilder/Wörter vom letzten Besuch. Rückkehr-Frage: "Letztes Mal war hier *ein Nebel*. Ist er noch da?"
- Fahrzeuge: kurze Fahrt-Orakel (eine Frage pro Etappe), Ton aus dem Fahrzeug-Charakter.
### 2.3 Leichte Anpassung durch den Spieler
Nur 4 Regler, keine Persona-Editor-Wüste:
1. **Gestalt** (aus Ort-Liste: Brunnen, Spiegel, Teleskop, Baum, Automat, Fahrzeug)
2. **Stimme**: wortlos / Flüstern / Sprache (Live)
3. **Tempo**: ruhig · normal · knapp
4. **Spuk**: 0–3 (Deckel je Raum)
Optional ein Name. Alles andere kommt aus dem Raum.
### 2.4 Karten als Bild-Prompt
- Karte = `{imageRef, title, keywords[3–5], deckId}`. Das Orakel bekommt **nur** Titel + Stichworte + Bildbeschreibung, keine fertige Deutung.
- Ablauf: Spieler zieht (oder wählt) Karte → Orakel fragt "Was siehst du zuerst?" → weiter mit Clean-/Bildfragen auf Spielerwörter.
- Deck-Bindung je Raum (`cardHooks`): z. B. Threshold zieht aus Lore-Decks, Atelier aus Bild-Decks (Warburg-Nachbarschaft = 3 Karten nebeneinander, "Was verbindet sie?").
### 2.5 JSON-Schema (Vorschlag, neben `character.json`)
Datei: `CHARACTERS_R1/characters/<id>/counselor.json` (Stimme/Melodie bleibt in `character.json → chatter`).
```json
{
  "id": "oracle_mirror_well",
  "kind": "place",
  "characterRef": "mirror_well",
  "roomAffinity": ["mirror_chamber", "dream_passage"],
  "persona": {
    "selfImage": "alter Brunnen, der Fragen sammelt",
    "tone": "ruhig, präzise, freundlich",
    "speaksAbout": "sich selbst in Bildern, nie über Fakten",
    "forbidden": ["Rat ohne Erlaubnis", "Diagnose", "eigene Metaphern"]
  },
  "voice": {
    "mode": "melody",
    "modes": ["melody", "whisper", "speech"],
    "chatterRef": "character.json#chatter",
    "ttsVoiceId": null,
    "bus": "voice"
  },
  "moves": {
    "weights": { "clean": 0.4, "reflect": 0.3, "perspective": 0.2, "oblique": 0.1 },
    "maxSentences": 2,
    "maxQuestionsPerTurn": 1,
    "reflectToQuestionRatio": 2.0
  },
  "pacing": {
    "preReplyPauseMs": [1200, 2500],
    "postDeepQuestionSilenceMs": [4000, 8000],
    "userTurnTimeoutS": 12,
    "breathSyncBpm": 6
  },
  "spooky": { "level": 1, "max": 3, "devices": ["echo_word", "slow_repeat"] },
  "cardHooks": { "decks": ["dream_deck"], "drawOn": "enter|ask", "spread": 1 },
  "memory": { "keepTokens": 3, "scope": "place" },
  "custom": { "playerName": null, "form": "well", "tempo": "calm", "spooky": 1 }
}
```

## 3 · Live-Stimme im Browser
### 3.1 Optionen (Stand Okt. 2026, Preise aus Sekundärquellen, vor Budget prüfen)
| Anbieter | Verbindung | Latenz | Kosten grob | Turn-Taking | Passt für KFB |
|---|---|---|---|---|---|
| **OpenAI Realtime** (`gpt-realtime-2.1`, `-mini`) | WebRTC direkt aus Browser; Server holt Ephemeral Key (`/v1/realtime/client_secrets`), Browser schickt SDP an `/v1/realtime/calls`; Events über DataChannel `oai-events` | speech-to-speech, typisch < 1 s | ca. 0,06–0,30 $/min (flagship), 0,02–0,10 $/min (mini) | `semantic_vad` mit `eagerness: low` oder `server_vad` mit `silence_duration_ms`; VAD abschaltbar (Push-to-talk) | stark: ein Modell, eigene Persona per Prompt |
| **ElevenLabs Agents** | JS/React SDK, Voice standardmäßig WebRTC; private Agents per Server-Token | ähnlich (< 1 s beworben) | ca. 0,08 $/min Basis + LLM; real 0,12–0,40 $/min | `turn_timeout` 1–30 s, `soft_timeout_config` (Füllsatz), `silence_end_call_timeout`, `max_duration_seconds` | stark bei Stimmqualität/Voice-Design; Turn-Settings passen zur Meditation |
| **Gemini Live API** | WebSocket aus Browser mit Ephemeral Token | < 1 s | laut Drittquelle sehr günstig (ca. 0,02 $/min Output), unbestätigt | eigene VAD | günstigste Option, Prüfen |
| **Kette selbst bauen** (STT → LLM z. B. Claude → TTS) | eigener Server | 1,5–3 s | variabel | volle Kontrolle | passt zu ruhigem Tempo: Latenz stört hier weniger |

Hinweis: Für ein meditatives Orakel ist Latenz unkritischer als üblich. 1,5–2 s Pause wirkt dort gewollt.
### 3.2 Architektur: ein Mixer, Stimme = ein Bus
```
Mic ─getUserMedia─► (Echo-Cancel an) ─► WebRTC/WS ─► Anbieter
Anbieter ─Remote-Stream─► <audio muted> (Chrome-Workaround)
          └► ctx.createMediaStreamSource(stream) ─► voiceBus(Gain) ─► [Panner HRTF am Orakel-Ort] ─► master
Musik/Soundbed ─► musicBus ─┐
SFX ─► sfxBus ──────────────┼► master ─► Ducking-Compressor ─► destination
Chatterbox-Melodie ─► voiceBus
```
- **Ein AudioContext** im Spiel. Remote-Stimme wird `MediaStreamAudioSourceNode` und hängt am `voiceBus`.
- Chrome-Eigenheit: Remote-WebRTC-Stream liefert in Web Audio oft Stille, wenn er nicht zusätzlich an ein (stummes) `<audio>`-Element hängt. Bekannter Workaround; bei Echo-Problemen über `MediaStreamAudioDestinationNode` routen.
- **Ducking:** wenn Orakel spricht, `musicBus` −6 bis −9 dB (Sidechain per AnalyserNode-Pegel oder Event "response.audio.started").
- **Räumlich:** Orakelstimme mit `PannerNode` (`panningModel: "HRTF"`) am Ort-Objekt → der Ort spricht wirklich von dort.
- **Text-Variante** nutzt denselben Bus: Chatterbox-Melodie spielt, Textblase zeigt Inhalt (Spec R2, Leitsatz 1).
- **Raum-FX** (Hall, Glas-Shimmer) als Insert am `voiceBus`, je Mindspace umgeschaltet.
### 3.3 Turn-Taking und Stille (ruhiges Tempo)
| Problem | Lösung |
|---|---|
| Orakel unterbricht Nachdenken | OpenAI `semantic_vad` + `eagerness: "low"`; ElevenLabs `turn_timeout` 10–20 s |
| Orakel antwortet zu schnell | Antwort bewusst 1–2,5 s verzögern (Client puffert, oder Prompt "beginne mit kurzer Pause") |
| Lange Stille vom Spieler | kein Nachhaken per Text; nach 12–20 s ein Klang (Glocke, Atem-Pad hebt sich); nach ~40 s eine sanfte Wiederholung der letzten Spielerwörter |
| Spieler will nur schweigen | Taste "nur zuhören" = Mic aus, Ort atmet weiter |
| Kosten bei Stille | Verbindung nach N s Stille in Ruhezustand (ElevenLabs `silence_end_call_timeout`); Wiederaufnahme per Taste |
| Barge-in | erlauben (`interrupt_response: true`), Orakel verstummt sofort, Melodie blendet aus |
| Sitzungslänge | Deckel 10–15 min (Kosten + Dramaturgie), Abschluss-Ritual |

## 4 · Wortlose Orakel-Stimmen
### 4.1 Wie Spiele Sprache aus Klang bauen
| Spiel | Technik | Lehre für KFB |
|---|---|---|
| Undertale-Prinzip | kurzer Blip je Buchstabe, eigener Klang je Figur | minimalste Variante, für Nebenorte |
| Animal Crossing (Animalese) | jeder Buchstabe/Silbe = kurzes Lautsample, stark beschleunigt; Tonhöhe je Figur, Stimmung verschiebt Pitch, Tempo folgt Textlauf | Silbenrhythmus aus Text ableiten, Identität über Pitch |
| Banjo-Kazooie | echte, kurze Gibberish-Aufnahmen je Figur, wiederholt (Kostengrund) | wenige starke Samples reichen |
| Celeste | Synth-Ton + Formant-EQ, automatisiert für Vokalwechsel; Gefühl über Pitch-Verlauf; nie dieselbe Silbe zweimal; Ende synchron zum Textaufbau (FMOD) | genau das Chatterbox-Prinzip, Formanten als Vokal-Illusion |
| Journey | einzige Kommunikation ist ein Ruf (Chime), musikalisch, wirkt auf die Welt | Orakel-Ruf als Antwort und als Weg-Signal |
### 4.2 Was nach "vergessener Zivilisation" klingt
- **Chor-Pads** (vokalisch, ohne Text, langsam): Ehrfurcht, Weite.
- **Obertongesang / Kehlgesang**: ein Grundton, darüber singende Obertöne. Uralt, unmenschlich-menschlich. Kultur abstrahieren (Spec R2 §12).
- **Glasharmonika / Glasharfe / Klangschale**: kristallin, "Spiegel". Ideal Mirror Chamber.
- **Okarina / Knochenflöte / Gefäßflöte**: einfache Tonleiter, archaisch, freundlich.
- **Rückwärts-Vokale, umgekehrter Hall**: Traum, Zeitverkehrung. Dream Passage.
- **Steinresonanz, tiefe Drones, Didgeridoo-artige Formanten**: Erdtempel, Threshold.
- Melodik: pentatonisch oder modal (Dorisch, Phrygisch), freie Zeit, viel Hall, langsame Glissandi. Eventrate niedrig (2–4/s statt 3–7/s im Alltag).
### 4.3 Sechs ElevenLabs-SFX-Prompts (Regeln aus Spec R2: ≥ 0,8 s, ein Ereignis, `no words, no speech, no reverb`, lokal schneiden, −16 LUFS)
1. `Glass harmonica single sung phrase, three rising notes, soft bowed glass, breathy vowel-like tone, no words, no speech, no reverb, 3 seconds`
2. `Ancient clay ocarina short questioning motif, four notes ending on a rising interval, airy, intimate, no words, no speech, no reverb, 2 seconds`
3. `Deep overtone throat singing drone with a slowly moving whistled overtone melody, single breath, no words, no speech, no reverb, 5 seconds`
4. `Wordless choir of low voices humming one open vowel chord swelling and fading, temple stone feel, no words, no speech, no reverb, 4 seconds`
5. `Reversed breathy female vowel phrase, soft attack swelling into a cut-off, dreamlike, no words, no speech, no reverb, 2 seconds`
6. `Singing stone bowl struck once, warm low hum with a wavering vowel-like resonance, slow decay, no words, no speech, no reverb, 4 seconds`
### 4.4 Sechs Suno-STYLE-Zeilen (rein musikalisch)
1. `ambient, glass harmonica, soft wordless female vocalise, slow, pentatonic, free time, airy pads, intimate`
2. `ritual drone, overtone singing, throat singing, low strings, sparse frame drum, dorian, meditative, spacious`
3. `ethereal choir, wordless humming, ocarina lead, stone resonance, slow tempo, modal, reverent, minimal`
4. `dream ambient, reversed vocals, tape swells, celesta, soft synth pads, floating, no beat, gentle`
5. `ancient folk ambient, bone flute, clay vessel drum, whispered vocal textures, phrygian, slow, mysterious`
6. `cosmic drone, deep male vocal drone, crystal bowls, shimmering high harmonics, very slow, vast, calm`

## 5 · Räumliche Audio-Wegführung
### 5.1 Vorbilder
| Spiel | Mittel | Prinzip |
|---|---|---|
| BotW/TotK Shrine-Sensor | Piepen wird lauter und schneller, je näher; wird zum "Herzschlag"; Spieler schaltet es selbst ein | Rhythmus = Distanz, opt-in |
| Journey | Ruf (Chime) als einzige Sprache; Berg als sichtbares Ziel; Musik baut einen Bogen | Klang + Sichtziel, Musik folgt Fortschritt |
| Thief | echte Schallausbreitung, Türen dämpfen, Emitter mit Musikschnipseln hinter Ecken | Dämpfung/Verdeckung als Richtungsinfo |
| Barrierefreiheit (allg.) | Audio-Beacons für Ziel und Objekte | ein klarer, wiedererkennbarer Ton je Ziel |
### 5.2 Mindspace-Soundbed als Beacon (Web Audio)
- **Schichten nach Distanz:** fern nur tiefe Drone (gut über Distanz, wenig Richtung) → mittel Melodie-Fragment des Orakels (Richtung hörbar) → nah volles Soundbed + Binaural-Schicht.
- **PannerNode HRTF** je Mindspace-Quelle; `distanceModel: "inverse"`, großer `maxDistance`, `rolloffFactor` klein für die Drone, größer für Details.
- **Ruf und Antwort:** Spieler ruft (Taste) → Orakel-Ort antwortet mit seinem Motiv aus seiner Richtung (Journey-Prinzip, kein HUD).
- **Rhythmus-Hinweis optional:** Puls der Drone wird bei Annäherung schneller (Shrine-Sensor), opt-in als Komfort.
- **Tiefpass nach Verdeckung:** Hügel/Wände zwischen Spieler und Ort = `BiquadFilter` lowpass (Thief-Gefühl, billig per Raycast).
- **Binaurale Schicht** (zwei Sinustöne mit kleiner Frequenzdifferenz, nur über Kopfhörer wirksam) erst nah zuschalten, nicht als Wegweiser: sie hat keine Richtung. Mit `ChannelMerger` hart L/R, an Panner vorbei.
- Kein Gradient-Übergang zwischen Welt und Mindspace: Klangschichten durchdringen sich körnig (Speckle-Prinzip V-403, auf Audio übertragen: Grains statt Crossfade).

## 6 · Meditatives Labyrinth
### 6.1 Labyrinth vs. Irrgarten
| | Labyrinth (unikursal) | Irrgarten (Maze) |
|---|---|---|
| Wege | ein Weg, keine Entscheidungen | Verzweigungen, Sackgassen |
| Haltung | gehen, loslassen | lösen, suchen |
| Klassisch | kretisch: 7 Umgänge (antike Münzen ab ~430 v. Chr.) | Hecken-Irrgärten |
| Chartres | 11 Umgänge, 4 Quadranten, 28 Kehren, 13. Jh. | – |
| Drei Phasen (Artress/Veriditas) | Loslassen (hinein) · Empfangen (Mitte) · Zurückkehren (hinaus); oft plus "Erinnern" davor | – |
### 6.2 Kombination mit Prozedur-Generator und Mindspace
- **Generator erzeugt unikursal:** ein Hamilton-Pfad durch das Raster (z. B. Spirale/Meander-Faltung oder klassische "Saatmuster"-Konstruktion für 7er/11er) statt Maze-Algorithmus. Gleiche Engine, Parameter `branching: 0`.
- **Hybrid:** Außenring Irrgarten (Suchen, leichte Spannung), innen unikursal (Ruhe). Übergang = Schwelle, an der das Orakel einmal spricht.
- **Tempo:** Weglänge statt Rätsel. Gehgeschwindigkeit leicht gedrosselt, Kamera tief, Atem-Pad im Takt der Schritte.
- **Klang:** Soundbed näher je Umgang (Beacon von 5.2 umgekehrt: man hört die Mitte, kommt aber nur über den langen Weg hin). Jede Kehre ein leiser Glockenton (28 Kehren = Tonleiter-Zyklus).
- **Reveal:** Mitte = Mindspace-Raum (z. B. Mirror Chamber). Orakel fragt nur dort ("Empfangen"). Rückweg: eine Summe in Spielerwörtern, dann Stille.
- **Fragen nach Phase:** hinein = Focusing "Raum schaffen" · Mitte = Clean/Bild · hinaus = "Was nimmst du mit?"

## Empfehlung für KFB
1. **Slice 1: Mirror Chamber, Text-Orakel.** Ein Genius-Loci-Ort (Spiegelbrunnen), Textblase + Chatterbox-Melodie, LLM mit Zug-Gewichten aus `counselor.json`.
2. Züge zuerst: Clean Language + einfache/doppelseitige Reflexion + eine Perspektiv-Frage. Lint im Code: max. 2 Sätze, 1 Frage, keine neuen Metaphern, kein Rat.
3. Karten-Einstieg: eine Karte ziehen → "Was siehst du zuerst?". Ein Deck reicht für Slice 1.
4. `counselor.json` als neues Register-Feld neben `character.json`; Stimme bleibt im `chatter`-Profil.
5. Spieler-Anpassung nur 4 Regler (Gestalt, Stimme, Tempo, Spuk).
6. Wortlose Orakel-Melodie: Familie "Glas" (Glasharmonika/Klangschale) für Mirror Chamber, Material per ElevenLabs/Suno (§4.3/4.4), Bandbreiten-Test nur mit Georgs Go.
7. **Slice 2: Live-Stimme** über OpenAI Realtime (WebRTC, `semantic_vad` low) oder ElevenLabs Agents (Turn-Timeouts). Kurzer A/B-Hörtest beider mit identischem Persona-Prompt.
8. Stimme immer als `voiceBus` im einen AudioContext, HRTF am Ort, Ducking der Musik.
9. Slice 3: Beacon-Schichten für Mindspace-Orte (Drone fern, Motiv mittel, Bett nah) + Ruf-Antwort.
10. Slice 4: unikursales Labyrinth vor der Mirror Chamber (Loslassen–Empfangen–Zurückkehren).

## Offene Punkte
1. Welcher Ort ist das erste Orakel (eigener Spiegelbrunnen oder bestehende Genius-Loci-Figur)?
2. LLM für Text-Orakel: Claude über eigenen Server oder gleich Realtime-Modell (gleiche Persona für Text und Stimme)?
3. Sprache: Orakel-Text Englisch (wie Blasen, V-650) oder Deutsch/Spielerwahl?
4. Gedächtnis: nur Sitzung oder pro Ort über Besuche (Speicherung, 3 Wörter)?
5. Spuk-Level 3 (dystopisch): nur Threshold Observatory oder als Spielerwahl überall?
6. Budget Live-Stimme: Deckel pro Sitzung und Tag; Anbieterwahl nach Hörtest.
7. "NATHAL": genaue Quelle/Methode von Georg, falls eine bestimmte Schule gemeint ist.
8. Eigene Oblique-Karten im Fluff-o-lect schreiben (Deck "Schräge Winke")?

## Quellen (Auswahl)
Clean Language: wikipedia "Clean_language", cleanlanguage.com · MI/OARS: UW CHAMP OARS-PDF, mass.gov MI-Workbook · Focusing: focusing.org/sixsteps · Aktive Imagination: wikipedia "Active_imagination", R. Johnson "Inner Work" · Rubin: conversationswithtyler.com, enterpriseam.com · Oblique Strategies: wikipedia.
OpenAI Realtime: developers.openai.com Guides realtime-webrtc + realtime-vad, forasoft.com (Preise) · ElevenLabs: elevenlabs.io/docs eleven-agents conversation-flow + JS-SDK, getmacha.com (Preise) · Gemini: ai.google.dev ephemeral-tokens · Chrome-Workaround: discourse.threejs.org, docs.atmoky.com/known-issues.
Animalese: nookipedia · Celeste: thegamer.com (Regamey/PowerUpAudio) · Shrine-Sensor: zeldawiki.wiki · Journey: wikipedia · Thief: PC Gamer/Gamebanshee · Labyrinth: wikipedia "Labyrinth", veriditas.org.
