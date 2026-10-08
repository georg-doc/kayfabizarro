# Handover · Modularer Voice-Layer für KFB und den DocCheck Audio-Tutor

Stand: 2026-10-08 (Rev. 3: Hosting nach IT-Rückmeldung, KFB-Chatterbox klargestellt) · Owner: Georg · Status: **ENTWURF ZUR ABSTIMMUNG**
Gilt für: KFB (Karten-Zeremonie, Overworld-NPCs, FrizzleCrits) und den DocCheck Audio-Tutor (Wissensgalaxie v2)
Vorarbeit: `wissensgalaxie-session-2026-10-06/docs/RETURN_VOICEIO_REPAIR_2026-10-06.md` und die Hörproben in `DC AudioFeynmann/hoerproben/`

---

## 0 Kurzfassung

1. **Ein Voice-Layer, zwei Produkte.** KFB und der Audio-Tutor nutzen dieselbe Sprachkette: Text → Normalisierung → Aussprachelexikon → Stimm-Anbieter → Cache → Wiedergabe. Pro Projekt wechseln nur das Casting (wer klingt wie) und der Anbieter.
2. **Anbieter sind austauschbar.** Browser-Stimme, espeak-ng, Piper, Chatterbox-TTS und Cloud-Stimmen (Azure, Google, ElevenLabs) hängen hinter derselben Schnittstelle. Kein Inhalt und keine Oberfläche hängt an einem bestimmten Anbieter.
3. **Vorproduzieren schlägt Live-Erzeugung,** wo der Text feststeht. Kuratierte Tutor-Fragen und feste KFB-Zeilen werden einmal vertont und als Audiodatei ausgeliefert. Live erzeugt wird nur, was erst zur Laufzeit entsteht, etwa LLM-Zeilen oder Rückmeldungen.
4. **Demo-Hosting (Rev. 2):** Cloudflare ist von der DocCheck-IT abgelehnt (IP, Datenschutz, Projektschutz). Der DocCheck-Tutor läuft deshalb in einer von der IT freigegebenen Umgebung, bevorzugt im bestehenden Microsoft-Umfeld (Azure, EU-Region) oder auf DocCheck-eigenen Servern, mit Beta-Zugang über DocCheck- oder Microsoft-Login. Bis dahin wird mit vorproduzierten Audios lokal und in Claude Design demonstriert. OpenAI Sites (in der EU nicht verfügbar) und Claude-Artifacts (kein Mikrofon) scheiden weiter aus.
5. **Für KFB passt der Roboterklang ins Canon:** Mr Roboto bekommt espeak-ng, die übrigen Crits neuronale Stimmen (Piper oder Chatterbox-TTS) mit Emotion.

---

## 1 Ausgangslage

| Was | Stand |
|---|---|
| VoiceIO v0.1 im Audio-Tutor | Ein Steuerteil für Mikrofon, Spracherkennung und Sprachausgabe. Halbduplex, Neustart mit Backoff, TTS-Watchdog. 34/34 Tests grün, echter Chrome-Test durch Georg erfolgreich. |
| TTS-Adapter | Vorhanden: `DC_VOICEIO.browserTTS(window)` mit dem Vertrag `{ name, available(), speak(text, callbacks), cancel() }`. Bisher nur Browser-Stimme. |
| Normalisierung | Vorhanden (`LEXICON` im VoiceIO-Block): pCO2, HCO3, GFR, RAAS, ACE, AT1, Angiotensin II, mmHg, pH. Arbeitet bisher mit umgeschriebener Schreibweise, nicht mit Lautschrift. |
| Stimmenwahl | Seit 2026-10-08 bevorzugt: Edge-„Natural“-Stimmen, dann macOS „Premium/Verbessert“, dann lokale Standardstimmen, dann Google. |
| Hörproben | 13 MP3s: espeak-ng (3 Varianten), Piper (4 deutsche Stimmen), KFB-NPC-Satz mit espeak-ng (2) und Piper Thorsten emotional (amüsiert, betrunken, flüsternd, wütend). |
| KFB | Single-Call-Architektur ist Canon: ein LLM-Aufruf liefert vollständiges JSON (`{beats:[]}`). Karten-Zeremonie als eigenes Overlay, ein JSON-Call pro Kartenaufdeckung. Artifact-Grenzen: keine externen Fetches, Assets base64-inline, nur Session-RAM. |

---

## 2 Zielbild: die Sprachkette

```
Text (Item, Beat, Feedback)
  → Normalisierung       Abkürzungen, Zahlen, Zeichen ("×" → "mal")
  → Aussprachelexikon    Wort → Lautschrift (IPA) bzw. Ersatzschreibung
  → Casting              Sprecher → Anbieter + Stimme + Stil + Tempo
  → Anbieter             browser | espeak | piper | chatterbox | azure | google | elevenlabs
  → Cache                Schlüssel = Hash(Anbieter, Stimme, Stil, normalisierter Text)
  → Wiedergabe           über VoiceIO (Halbduplex, Watchdog, genau ein Abschluss)
  → optional Mundbild    Laute/Visemes mit Zeitstempel → Mundform der Figur
```

### 2.1 Schnittstellen (verbindlich für alle Anbieter)

```js
// Anfrage: was gesprochen werden soll
SpeechRequest = {
  text,            // sichtbarer Text (wird nie verändert angezeigt)
  speaker,         // Casting-ID, z. B. "tutor", "mr_roboto", "lady_dory"
  style,           // optional: "neutral" | "amused" | "angry" | "whisper" | …
  intensity,       // optional 0..1 (Chatterbox-TTS: Emotionsstärke)
  rate,            // optional, 1 = normal
  lang             // "de-DE"
}

// Anbieter: zwei Arten, beide hinter VoiceIO
SpeechProvider = {
  id, capabilities: { offline, streaming, styles:[…], visemes, ssmlPhoneme },
  available(),                       // true/false, ohne Netzlast
  // Variante A: liefert Audio (Piper, Chatterbox-TTS, Cloud, vorproduziert)
  synthesize(req) → { url | blob, durationMs, phonemes? , visemes? },
  // Variante B: spricht direkt (Browser-TTS)
  speak(text, callbacks), cancel()
}
```

VoiceIO bleibt der einzige Besitzer von Wiedergabe und Mikrofon. Ein Anbieter vom Typ A liefert nur Audio. VoiceIO spielt es ab und führt Token, Watchdog und Halbduplex. Der vorhandene Browser-Adapter ist Typ B und bleibt Notlösung.

### 2.2 Casting-Datei (pro Projekt eine)

```json
{
  "tutor":     { "provider": "azure",  "voice": "de-DE-…Neural", "fallback": ["piper:de_DE-thorsten-high", "browser"] },
  "mr_roboto": { "provider": "espeak", "voice": "de+klatt3", "pitch": 35, "rate": 0.95 }
}
```

Regel: Jede Figur hat eine Kette aus Haupt- und Ersatzanbietern. Fällt der Hauptanbieter aus, spricht die Figur mit dem nächsten Anbieter in der Kette weiter.

### 2.3 Aussprachelexikon (gemeinsam, getrennt nach Fachgebiet)

```json
{ "ACE":        { "ipa": "aː.tseː.ˈʔeː", "fallback": "A-Zeh-E" },
  "AT1":        { "ipa": "aː.teː.ˈʔaɪ̯ns", "fallback": "A-Te-eins" },
  "Glomerulus": { "ipa": "ɡloˈmeːʁulʊs" } }
```

- Cloud-Anbieter, die Lautschrift annehmen, bekommen `ipa`. Bei Azure und Google geht das über das SSML-`<phoneme>`-Element. Je Anbieter prüfen.
- Alle anderen Anbieter bekommen `fallback`.
- espeak-ng dient intern als Prüfwerkzeug: Es zeigt, wie ein Wort nach den Regeln gelesen würde, und macht Kandidaten für das Lexikon sichtbar. Nur intern nutzen, nicht ausliefern (GPL).
- Die IPA-Werte oben sind Platzhalter und werden beim Anlegen per Gehör geprüft.

---

## 3 Anbieter-Katalog

| Anbieter | Klang | Offline | Emotion/Stil | Lizenz / Kosten | Einsatz |
|---|---|---|---|---|---|
| Browser (Chrome) | mittel bis schwach | teils | nein | frei | Notlösung |
| Browser (Edge „Natural“) | gut | nein (Microsoft-Cloud) | nein | frei, nur in Edge | Sofort-Demo |
| espeak-ng | robotisch, gewollt künstlich | ja, auch im Browser | nur Tonhöhe, Tempo, Varianten | GPL‑3: intern frei, Ausliefern = Quellcode offenlegen | Mr Roboto, Prüfwerkzeug |
| Piper | gut, leicht synthetisch | ja (Server oder Browser) | Thorsten emotional: 8 Stile | GPL (Server-Betrieb ohne Auslieferung nach unserem Verständnis unkritisch, juristisch prüfen) | NPCs, Vorproduktion, Ersatzanbieter |
| Chatterbox-TTS Multilingual | sehr gut, ausdrucksstark | ja, braucht Grafikkarte | Emotionsstärke stufenlos, Stimmklon aus Referenzaufnahme | MIT; jede Ausgabe trägt ein unhörbares Wasserzeichen (Perth) | KFB-Crits, Vorproduktion |
| Azure Neural TTS | sehr gut | nein | Stile je Stimme | nutzungsbasiert, EU-Region wählbar | Tutor live und vorproduziert |
| Google Cloud TTS | sehr gut | nein | begrenzt | nutzungsbasiert | Alternative zu Azure |
| ElevenLabs | sehr gut, sehr natürlich | nein | stark, Stimmdesign | Abo, Nutzungsrechte je Plan prüfen | KFB-Hauptfiguren, Trailer |

Hörbeispiele für espeak-ng und Piper liegen in `hoerproben/`. Chatterbox-TTS und die Cloud-Anbieter sind noch nicht angehört. Das ist Slice S2.

---

## 4 Betriebsarten

| Art | Wann | Wie |
|---|---|---|
| **A · Vorproduziert** | Text steht vorher fest: Tutor-Fragen, feste KFB-Zeilen, Intros | Build-Skript vertont alle Zeilen. Ergebnis sind MP3/OGG und ein `audio-manifest.json` (Cache-Schlüssel → Datei, Dauer, Laute). Die App spielt nur Dateien. Läuft überall, auch in Claude Design und Artifacts (dort base64-inline). |
| **B · Live** | Text entsteht zur Laufzeit: LLM-Beats, Rückmeldungen, KI-Fragen | Ein Worker-Endpunkt `/api/tts` ruft den Anbieter mit serverseitigem Schlüssel. Antworten werden gecacht, damit gleicher Text nur einmal kostet. |
| **C · Notlösung** | Netz weg, Anbieter weg, Artifact ohne Fetch | Browser-TTS über den vorhandenen Adapter. |

Reihenfolge zur Laufzeit: Manifest-Treffer → Live → Browser. VoiceIO sieht davon nur ein Ergebnis.

---

## 5 KFB

### 5.0 Begriffe: zwei verschiedene „Chatterbox“

- **KFB-Chatterbox** = das KFB-eigene Dialogsystem. NPCs bilden Sätze aus semantischen Triplets (Baustein 1 · Verbindung · Baustein 3, z. B. „Freiheit“ · „ist letztendlich“ · „die größte Tugend“). Die Bausteine kommen aus einem Pool, der zu den Card-Decks passt und pro NPC gewichtet ist. Das LLM steuert die Textebene emergent, die Ausgabe erscheint in Sprechblasen. Bisher wird sie über die Browser-Stimme gesprochen.
- **Chatterbox-TTS** = ein Sprachausgabe-Modell von Resemble AI (siehe Katalog). Es hat mit dem KFB-System nichts zu tun und ist nur eine mögliche Stimme.

### 5.0.1 Vertonung der KFB-Chatterbox

| Weg | Wie | Klang | Läuft wo |
|---|---|---|---|
| **Bausteine vorproduziert** | Jeder Pool-Baustein wird pro NPC-Stimme einmal vertont, und zwar positionsbewusst: Baustein 1 mit weiterführender, Baustein 3 mit abschließender Betonung. Die App setzt die drei Dateien mit kurzen Pausen zusammen. | natürlich, leicht „gesetzt“. Die Pausen wirken wie Beats und passen zum Bühnen-Ton. | überall, auch offline und im claude.ai-Artifact (base64, Größe beachten) |
| **Ganzer Satz live** | Der fertige Satz geht an eine Live-Stimme (Piper auf Server oder im Browser, Cloud-Stimme). | am flüssigsten | nur mit Server oder Browser-Modell, nicht im claude.ai-Artifact |
| **Hybrid (Empfehlung)** | Ist die Zeile eine reine Triplet-Kombination aus dem Pool, kommen die Bausteine aus dem Vorrat. Formuliert das LLM frei um, spricht die Live-Stimme, und die Browser-Stimme bleibt der letzte Ausweg. | bestmöglich je Zeile | wie oben |

- Mengengerüst Bausteine: Anzahl Bausteine × Positionen (meist 1 je Slot) × NPC-Stimmen × Stimmungen. Bei 300 Bausteinen, 5 Haupt-Crits und 2 Stimmungen sind das etwa 3.000 kurze Dateien von wenigen KB. Vorab erzeugbar ohne Grafikkarte (Piper).
- Das LLM-JSON bekommt pro Beat die Triplet-IDs mit (`"triplet": ["frei_01","conn_17","tug_03"]`), damit die App weiß, ob Bausteine passen.
- Erste Hörprobe (2026-10-08): `hoerproben/kfb-triplets/`. Drei Sätze in je drei Varianten: ganzer Satz, Bausteine naiv, Bausteine positionsbewusst.


### 5.1 Integration in die Single-Call-Architektur

Kein zusätzlicher LLM-Aufruf. Der bestehende JSON-Call bekommt pro Beat zwei Felder mehr:

```json
{ "beats": [
  { "speaker": "lord_hunky", "line": "…", "style": "angry", "intensity": 0.7 },
  { "speaker": "mr_roboto",  "line": "…", "style": "neutral" }
] }
```

- Das Prompt-Schema erlaubt nur `style`-Werte aus der Casting-Datei. Unbekannte Werte fallen auf `neutral` zurück.
- Vertonung: alle Beats parallel anfragen, nacheinander abspielen. Läuft Beat 1, wird Beat 2 schon erzeugt.
- Die Untertitel zeigen weiter den Originaltext. Gesprochen wird die normalisierte Fassung.

### 5.2 Casting-Vorschlag (zur Abstimmung)

| Crit | Vorschlag Anbieter | Begründung | Georg legt fest |
|---|---|---|---|
| Mr Roboto | espeak-ng (`de+klatt3`, tiefere Tonhöhe) | Roboterklang ist hier Figur, nicht Mangel. Läuft offline und sofort. | Tonhöhe, Tempo |
| FrizzleBob | Chatterbox-TTS oder ElevenLabs | Hauptfigur, braucht die meiste Ausdrucksbreite | Stimmcharakter, Referenzaufnahme |
| Lord Hunky | Piper Thorsten emotional oder Chatterbox-TTS | Stile angry/amused vorhanden | Stilpalette |
| Lady Dory | Chatterbox-TTS (weibliche Referenzstimme) | Piper hat kaum emotionale Frauenstimmen | Referenzaufnahme |
| Mister Hobbes | Piper (andere Stimme) oder Chatterbox-TTS | Abgrenzung zu Hunky über Stimme, nicht nur Stil | Stimmcharakter |
| erweiterter Cast (17) | Piper-Stimmen + Tonhöhe/Tempo-Varianten | viele unterscheidbare Stimmen ohne Kosten | Zuordnung |

Hinweis: Die Charakterbeschreibungen der Crits stehen bewusst nicht in diesem Dokument. Sie kommen aus dem KFB-Canon und werden beim Casting nur referenziert.

### 5.3 Wo KFB-Stimmen laufen können

| Umgebung | Möglich |
|---|---|
| claude.ai-Artifact | Nur Browser-TTS oder vorproduzierte Audios, base64-inline (Größe beachten). Kein Live-Anbieter, weil externe Fetches blockiert sind. |
| kayfabizarro.pages.dev | Alles: Manifest, Live über Worker, Notlösung. Hier liegt das Ziel für die vertonte Karten-Zeremonie. |
| Claude Design (Präsentation im neuen Tab) | Vorproduzierte Audios. Live nur mit erreichbarem Worker. |

### 5.4 Mundbewegung

- **Stufe 1 (KISS):** Mund-Auf/Zu aus der Lautstärke der Wiedergabe (WebAudio-Analyser auf dem Abspiel-Element, nicht auf dem Mikrofon). Passt zu Pixel-Crits.
- **Stufe 2:** Visemes mit Zeitstempel. Azure liefert Viseme-Ereignisse. Piper und espeak-ng liefern Laute, die über eine Tabelle Mundformen zugeordnet werden. Anbindung an `kfb-cartoon-animation`.

### 5.5 Regeln

- Der Anti-Slop-Canon gilt auch gesprochen: keine Firmenfloskeln, Konflikt statt Konsens, Verdict-Refusal bleibt.
- Für das Ohr schreiben: kurze Sätze, keine Klammern, keine Abkürzungen ohne Lexikoneintrag.
- Stimmklon nur von Personen mit ausdrücklicher Einwilligung, also Georg oder beauftragte Sprecher. Keine Imitation realer Prominenter.

---

## 6 DocCheck Audio-Tutor

- VoiceIO v0.1 bleibt unverändert der Besitzer von Mikrofon und Wiedergabe. Neu ist nur der Anbieter vom Typ A hinter dem Adapter.
- **Kuratierte Items** (RAAS, Säure-Basen) werden vorproduziert, mit Lexikon-IPA. Der Cache-Schlüssel enthält die `item_version`, damit geänderte Items neu vertont werden.
- **Rückmeldungen und KI-Fragen** laufen live über `/api/tts`. Dynamische KI-Fragen bleiben Vorschau und ändern keinen Lernstand (unverändert).
- **Datenschutz:** An den Sprachanbieter gehen nur Frage- und Rückmeldetexte, nie Transkripte der Lernenden. EU-Region wählen. Abstimmung mit DocCheck-IT und Datenschutz vor dem ersten externen Beta-Test.
- **Sofort umgesetzt (2026-10-08):** Die Stimmenwahl bevorzugt Edge-„Natural“-Stimmen. Test: Wissensgalaxie über den Starter öffnen, die URL in Edge kopieren, unter Einstellungen → Entwicklermodus die Zeile „Stimme“ prüfen.

---

## 7 Plattform für die funktionale Demo (Rev. 2)

**IT-Rückmeldung 2026-10-08:** Cloudflare kommt für DocCheck nicht in Frage (IP-Themen, Datenschutz, Projektschutz). Damit gilt:

**Grundsatz:** Code und Inhalte bleiben in DocCheck-kontrollierter Umgebung. Die Sprachkette ist anbieterneutral, also hängt nichts an einem bestimmten Hoster. Gebraucht wird immer dasselbe:
1. statische Dateien (App, Audios, Manifest) über HTTPS, damit das Mikrofon dauerhaft freigegeben bleibt
2. ein kleiner Server-Teil mit zwei Endpunkten, `/api/tts` und `/api/llm`, der die Schlüssel hält
3. ein Login für Beta-Tester

### 7.1 Optionen zur Abstimmung mit der IT

| Option | Hosting | Login | Sprache/LLM | Einschätzung |
|---|---|---|---|---|
| **A · Microsoft-Umfeld** (bevorzugt, falls freigegeben) | Azure Static Web Apps oder App Service im DocCheck-Tenant, EU-Region | Entra ID (Mitarbeitende, Gäste für externe Tester) | Azure AI Speech (EU) und Claude über die API. Alternativ Claude über Azure, falls vertraglich vorhanden. | DocCheck nutzt Microsoft 365 bereits. Ein bestehender Vertrag samt Auftragsverarbeitung deckt vermutlich Hosting und Sprachdienst ab. Ein Anbieter weniger. |
| **B · DocCheck-eigene Server** | interne Staging-Umgebung | DocCheck Login | wie A, Endpunkte als kleiner Dienst | Maximale Kontrolle, passt zur Produktnähe. Aufwand und Freigabe liegen bei der IT. |
| **C · Ohne Server (Zwischenstand)** | lokal über den Starter, Claude Design (Präsentation im Tab) | keiner | nur vorproduzierte Audios, Browser-Spracherkennung, kein Live-LLM | Sofort machbar, ohne IT. Reicht für Präsentationen und interne Hörtests, nicht für externe Beta-Tester. |

Nicht mehr im Rennen für DocCheck: Cloudflare (IT), OpenAI Sites (EU), Claude-Artifacts (kein Mikrofon).

**Für KFB (privates Projekt)** gilt die IT-Entscheidung nicht automatisch. `kayfabizarro.pages.dev` bleibt möglich, sofern dort keine DocCheck-Inhalte liegen. Code, der in beiden Projekten genutzt wird (Sprachkette, VoiceIO), liegt im DocCheck-Repo. KFB nutzt eine Kopie, kein DocCheck-Hosting.

### 7.2 Aufbau (Zielbild, hosterneutral)

```
Repo (georg-doc/doccheck, lab/audio)
  ├─ statische App: Wissensgalaxie, audio-manifest.json, audio/*.mp3
  └─ api/: zwei Endpunkte, je ~50 Zeilen, als Azure Function oder kleiner Node-Dienst
       ├─ POST /api/tts  { text, speaker, style } → Audio (Cache nach Hash)
       └─ POST /api/llm  { prompt-id, input }    → JSON (nur freigegebene Prompt-Vorlagen)
  Login davor: Entra ID oder DocCheck Login
```

- Die App erkennt, ob `/api` erreichbar ist. Ohne Server läuft sie automatisch in Option C.
- `/api/llm` nimmt nur benannte Prompt-Vorlagen an, keine freien Prompts. Das schützt Schlüssel und Kosten.
- An Sprach- und LLM-Dienst gehen keine personenbezogenen Daten. Lernenden-Transkripte gehen nur an `/api/llm`, wenn die Bewertung per KI aktiv ist, und werden dort nicht gespeichert.

### 7.3 Fragen an die IT (zum Weiterleiten)

1. Ist Azure (Static Web Apps / App Service / Functions, EU-Region) im DocCheck-Tenant für eine interne Demo freigegeben? Wenn nein: welche interne Staging-Umgebung?
2. Ist Azure AI Speech (EU) als Sprachdienst freigegeben? Sonst: welcher Dienst, oder nur vorproduzierte Audios?
3. Ist die Claude-API (Anthropic) für Prompt-Aufrufe ohne personenbezogene Daten freigegeben, oder nur über einen bestimmten Weg?
4. Login für externe Beta-Tester: Entra-Gastkonten oder DocCheck Login?
5. Gibt es Vorgaben zu Logging und Speicherdauer für Audio-Cache und Tester-Zugriffe?

## 8 Slices (Reihenfolge)

| Slice | Inhalt | Ergebnis | Abhängig von |
|---|---|---|---|
| S1 ✓ | Edge-„Natural“ bevorzugen | erledigt, Hörtest durch Georg offen | – |
| S2 | **Hörbank**: eine Seite mit denselben 3 Sätzen (Medizin, Rückmeldung, KFB-NPC) in allen Anbietern | Entscheidung Tutor-Stimme und KFB-Casting | Probe-Schlüssel Azure/ElevenLabs, Chatterbox-TTS-Lauf auf Grafikkarte |
| S3 | Vorproduktion: Build-Skript + `audio-manifest.json` + Anbieter Typ A in VoiceIO | Tutor spricht kuratierte Fragen mit Wunschstimme, auch in Claude Design | S2 |
| S4 | Server-Gerüst nach IT-Freigabe (Option A oder B): Hosting + Login + `/api/tts` + `/api/llm` | geschützte Demo-URL für Beta-Tester | Antworten der IT (7.3) |
| S5 | KFB Karten-Zeremonie vertont: Beat-Felder `speaker/style/intensity`, Casting-Datei, Mund Stufe 1 | eine Kartenaufdeckung mit sprechenden Crits | S2 (Hosting KFB unabhängig von S4) |
| S6 | Aussprachelexikon mit IPA (RAAS, Säure-Basen, 20 Begriffe), Prüfung per Gehör | ACE/AT1 und Co. klingen richtig | S2 |
| S7 | Mund Stufe 2 (Visemes) | lippensynchrone Crits | S5 |

Jede Slice endet mit Hörprobe oder Demo-Link, nicht mit Architektur.

---

## 9 Nicht bauen (in diesen Slices)

- kein Full-Duplex/Barge-in, kein Wake-Word
- kein eigenes TTS-Training, kein Feintuning
- kein zweiter Wiedergabe-Besitzer neben VoiceIO
- keine Stimmklone ohne Einwilligung
- keine Auslieferung von GPL-Code (espeak-ng, Piper) im Browser eines DocCheck-Produkts ohne juristische Freigabe
- keine Lernenden-Transkripte an Sprachanbieter

---

## 10 Offene Entscheidungen (Georg)

1. **Tutor-Stimme:** Edge Natural reicht für die Demo, oder gleich eine Cloud-Stimme? (nach S2)
2. **Cloud-Anbieter Tutor:** Azure (EU-Region, Lautschrift, Visemes) oder ElevenLabs (natürlicher, Rechte prüfen)?
3. **KFB-Casting:** Zuordnung pro Crit und Referenzaufnahmen für Chatterbox-TTS
4. **Hosting:** Option A oder B für den Tutor (nach IT, siehe 7.3). KFB bleibt privat auf `pages.dev`?
5. **Grafikkarte für Chatterbox-TTS:** gemieteter Server bei Bedarf (z. B. stundenweise) oder Cloud-Dienst mit Chatterbox-TTS-Angebot

---

## 11 Abnahme je Slice

- **Hörprobe:** derselbe Satz in mindestens zwei Anbietern, Georg wählt per Gehör.
- **Technik:** `npm test` grün (VoiceIO-Tests plus neue Tests für Manifest-Treffer, Ersatzkette und Cache-Schlüssel).
- **Voice-Gate wie gehabt:** fünf Hands-free-Turns ohne Mikro-Klick, keine Überlagerung von Sprechen und Zuhören.
- **KFB:** eine Kartenaufdeckung mit mindestens drei sprechenden Crits, Verdict-Refusal hörbar erhalten.

---

## 12 Quellen

- [espeak-ng (GitHub)](https://github.com/espeak-ng/espeak-ng)
- [Piper, OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl/releases)
- [Chatterbox-TTS (Resemble AI, Hugging Face)](https://huggingface.co/ResembleAI/chatterbox/blob/refs%2Fpr%2F48/README.md)
- [Microsoft: Cloud-Stimmen in Edge](https://blogs.windows.com/msedgedev/2019/08/14/cloud-powered-voices-microsoft-edge-chromium/)
- [Azure Static Web Apps: Authentifizierung](https://learn.microsoft.com/azure/static-web-apps/authentication-authorization)
- [ChatGPT Sites: Funktionen und Grenzen (PlayCode)](https://playcode.io/blog/chatgpt-sites-explained)
- [OpenAI Sites Guide (Kingy AI)](https://kingy.ai/news/openai-sites-a-detailed-guide-to-codexs-new-hosted-website-and-app-builder/)
