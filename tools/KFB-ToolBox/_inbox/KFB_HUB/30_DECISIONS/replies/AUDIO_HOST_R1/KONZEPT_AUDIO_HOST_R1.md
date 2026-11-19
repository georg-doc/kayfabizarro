# KFB Audio-Host R1 · ein Mixer für Spiel, Prototypen und Module · Konzept (WS0, 19.11.2026)

**Auftrag (Georg 19.11.):** Den Audiomixer als Modul bereitstellen, damit nicht jeder seine eigenen Sounds druntermischt („ein wildes Fiasko“, Befund WS1c bei Spores und Kelp). Einheitlich für das Spiel, alle Prototypen und Module, mit Schnittstellen. Eigene Sounds eines Prototyps entstehen zentral mit ElevenLabs, niemand produziert selbst. Module nutzen nur die Reaktivität (Visualizer-Ebene mit allen Klangschichten).

## 1 · Was es schon gibt (Bestand, nicht neu bauen)
- `src/audio/kfbAudio.js`: ein AudioContext, Busse Musik/SFX/Atmo/UI → Master → Begrenzer, Stimmenkappe (`VOICE_CAP`), `play(cueId, { pos, … })`, Schleifen, Radio/Musik, Zonen-Klangbett (`setMusicZone`).
- `src/audio/mixer.js`: reine Regeln (Busse, Ducking, Schritt-Bus), `createPulseTracker` (Format `kfb.audio-presentation-pulse/1`), `audioPulses()` (Musik + Ambient).
- `src/audio/cueMap.js`: Cue-Register (Cue-ID → Bank-Set/Dateien, Pegel, Bus).
- `src/core/cueBus.js`: Ereignis-Uhr (sammeln, entdoppeln, einmal verteilen).
- WSA Audio: ElevenLabs-Produktion, LUFS-Normierung, Bank-Index (`40_AUDIO/elevenlabs_r1`, Ingest-Skripte).

**Fehlt:** ein schmaler, fester Vertrag für Module und Prototypen außerhalb des Spiels sowie ein Weg, auf dem Module Cues anmelden und bestellen.

## 2 · Der Vertrag `kfb.audio-host/1` (eine Datei `src/audio/host/audioHost.js`)
```
const audio = getAudioHost()            // immer dieselbe Instanz je Seite; im Spiel = kfbAudio, im Prototyp = eigenständiger Kern mit denselben Regeln
audio.cue(id, { pos, intensity01, kind, actor })   // Ereignis melden; der Host entscheidet Stimme, Bus, Priorität, Kappe, Ducking
audio.loop(id, { pos, level01 }) → handle.update({ pos, level01 }) / handle.stop()
audio.bed(id) · audio.profile('underwater' | 'cave' | 'indoor' | null)   // Klangbett und Raum-Profil (Tiefpass, Hall) nur über den Host
audio.register(manifest)                // Cue-Manifest des Moduls (kfb.cue-manifest/1), siehe 3
audio.pulse() → { music, ambient, sfx, layers: { bass, mid, high, beat, phrase } }   // Reaktivität für Visualizer, nur lesen
audio.radio  → { nowPlaying, pause, skip, lists }   // dasselbe Radio wie im Spiel
```
**Regeln:**
- Kein Modul legt einen eigenen AudioContext an, keine eigenen Hall-, Tiefpass- oder Ducking-Ketten. `contract-static` prüft das (Suche nach `new AudioContext` außerhalb des Hosts).
- Module melden Ereignisse, keine Pegel. Laute Ereignisse ducken Musik und Bett nach den vorhandenen Regeln (`DUCK`).
- Je Cue gibt es Priorität und Kappe. Viele gleichzeitige Kontakte (Sporen, Tang) werden zusammengefasst: höchstens N Stimmen je Cue, die lautesten zuerst, Rest als Pegel-Anhebung einer Schleife.
- Ein Szenen-Profil gilt global (unter Wasser dämpft alles, nicht nur das eigene Modul).

## 3 · Cues bestellen statt selbst bauen
- **Cue-Manifest je Modul** (`kfb.cue-manifest/1`): `{ modul, cues: [{ id, art: kontakt|schleife|bett|ui, beschreibung_en, dauer_s, varianten, bus, prioritaet, kappe }] }`.
- Fehlt ein Cue in der Bank, spielt der Host einen neutralen Platzhalter (leise, gleicher Bus) und meldet ihn als „bestellt“.
- **Bestellung:** Das Manifest geht über WS0 an WSA Audio. WSA Audio erzeugt mit ElevenLabs, normiert LUFS, legt die Dateien in die Bank und trägt `cueMap` ein. Danach klingt das Modul ohne Code-Änderung echt.
- Erste Manifeste: Musical Spores (`spore-impact-walk/car`, Myzel-Bett), Kelp (`kelp-touch-*`, Unterwasser-Bett, Blasen), Fold (`fold-*`), Pendel (Gießen/Tropfen/Trocknen/Aufdecken), Bot-Theater (Pling, Diamant).

## 4 · Reaktivität (Visualizer-Ebene)
- `pulse()` liefert Musik, Ambient und neu SFX als Bänder (Bass/Mitte/Höhe) plus Beat und Phrase, alles im Format `kfb.audio-presentation-pulse/1`.
- Module wie die Sporen-Kappen, Myzel-Wellen und HyperNorm-Flächen lesen nur hier, kein eigener Analyser.

## 5 · Prototypen und Artefakte
- Derselbe Host als eigenständiges ES-Modul ohne Spiel-Abhängigkeit. Er bringt den einen Kern mit (Busse, Kappe, Ducking, Profile, Puls), Bank-URL konfigurierbar, Radio optional.
- Demos (`ws1/demos/*`) und Artefakte binden nur `getAudioHost()` ein. Was im Prototyp funktioniert, klingt im Spiel gleich.

## 6 · Reihenfolge und Rollen
1. **WS0:** `audioHost.js` als dünne Schicht über kfbAudio (Spiel) plus eigenständiger Kern (Prototypen), Vertragstest und `contract-static`-Regel. Schalter `audiohost=r1`, aus.
2. **WS1c:** Spores und Kelp auf den Host umstellen (eigene Kontexte raus), Manifeste schreiben. Beleg: ein Kontext, kein Durcheinander, Puls läuft.
3. **WSA Audio:** Manifeste produzieren (ElevenLabs), Bank und `cueMap` füllen.
4. **Georg** hört Spores und Kelp im Prototyp und im Spiel (eine Hub-Frage mit kurzen Clips).

**Nicht:** keine zweite Musik-Engine, kein zweites Radio, keine Sounds, die Module selbst synthetisieren (außer Platzhalter im Host).
