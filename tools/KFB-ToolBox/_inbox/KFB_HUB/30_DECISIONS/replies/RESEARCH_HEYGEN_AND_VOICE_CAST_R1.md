# Research · HeyGen-Guthaben und Stimmen-Besetzung für viele NPCs (R1 · 18.10.2026)

Für: Georg (Creative Lead) · Bezug: V-173 (Billboards/Hypernormalisation), V-285 (Stimmen, HeyGen-Test), V-390 (Werkzeugkarte), V-466 (Duo-Prinzip), V-467 (Hexen-Duo), V-486/V-492/V-497/V-500/V-508 (Fluff-o-lect), V-523 (ElevenLabs-Satz) · Kontext: `replies/SPEC_FLUFF_O_LECT_R1_DRAFT.md`, `replies/RESEARCH_FLUFF_LINGUISTICS_R1.md` §3 und §8

Methode: Websuche und Seitenabruf am 18.10.2026. Nichts installiert, kein Login, keine Konten, keine Downloads.

**Kennzeichnung**

- **[B]** belegt, mit Quelle (Link steht dabei bzw. im Quellenteil).
- **[B-Hersteller]** belegt, aber nur als Aussage des Anbieters (Marketing oder Hilfe-Center), nicht unabhängig geprüft.
- **[E]** Einschätzung oder Folgerung von WS0.
- **nicht belegt**: keine verlässliche Quelle gefunden.

---

## 0 · Kurzfassung

**HeyGen**

1. **HyperFrames** ist das Nützlichste aus dem HeyGen-Paket und kostet **keine** Credits. Es ist ein Open-Source-Framework (Apache 2.0), das HTML, CSS und GSAP-Animationen lokal über headless Chrome und FFmpeg zu MP4 rendert. Damit lassen sich Karten-Promos und Billboard-Clips direkt aus unseren Kartenbildern bauen [B].
2. **Avatar-Videos** kosten pro Minute: Avatar IV mit Foto 16 Credits, Avatar V 48 Credits, Video Agent 80 Credits [B-Hersteller]. Video-Übersetzung mit Lip-Sync kostet 6 bis 10 Credits pro Minute [B-Hersteller].
3. **Avatar IV** kann laut HeyGen auch Cartoon-, Tier- und 3D-Bilder animieren und eigenes Audio verwenden [B-Hersteller]. Für FrizzleBob als Ton-Hase ist das Look-Risiko hoch: Ein 2D-Bild wird verformt, und der Mund wird dazuerfunden [E]. Ein kleiner Test lohnt sich trotzdem.
4. **Am besten passt HeyGen dort, wo der Stilbruch Absicht ist:** auf dem dystopischen Billboard in der Dystopia Alley. Ein glatter, „zu perfekter“ KI-Nachrichtensprecher auf einem Bildschirm in der Knetwelt *ist* Hypernormalisation [E].
5. **VFX** (Explosionen usw.): HeyGen passt nicht. Es bietet keine Effekt-Ebenen, und die generischen Videomodelle (Seedance, Veo) liefern Realfilm-Clips ohne Alpha-Kanal [B]/[E].
6. **MCP-Zugang:** Georg trägt den Server einmal selbst ein und gibt ihn per OAuth frei: `claude mcp add --transport http -s user heygen https://mcp.heygen.com/mcp/v1/`, danach `/mcp`. Ab dann kann WS0 rund 100 Werkzeuge direkt aufrufen, und die Nutzung läuft über die **Plan-Credits** [B]. Achtung: Ist `HEYGEN_API_KEY` gesetzt, rechnen die Skills über das **separate API-Guthaben** ab [B].
7. **Lizenz:** Auf bezahlten Plänen gehört uns der Output und darf kommerziell genutzt werden. HeyGen erhält aber eine unwiderrufliche, unterlizenzierbare Lizenz an allem, was wir hochladen, **auch zum Trainieren** (ToS §3) [B]. Für unveröffentlichte Figuren-Renders muss Georg das bewusst entscheiden.

**Stimmen**

8. Die klassische Cartoon-Synchronlogik lässt sich auf Instrumente übertragen. Größe und Körper steuern **Lage und Formanten**, die Haltung steuert **Tempo, Artikulation und Ausschlag**, aus der Catchphrase wird ein **Signatur-Tick**. Instrumentenfamilien bleiben selbst bei starker Verschiebung von Tonhöhe und Skala erkennbar [B].
9. **Faustregel [E]:** Ein Instrument-Darsteller trägt **1 Hauptrolle + 2–3 benannte Nebenrollen + bis zu ~4 generische Varianten**. Zwei Rollen gelten als unterscheidbar, wenn sie sich auf **mindestens 2 von 5 Achsen** deutlich unterscheiden.
10. **Besetzungsvorschlag:** 6 Instrument-Darsteller (Horn, Flöte/Okarina, Tuba, Fagott, Singende Säge/Theremin, Chip-Synth) für 13 NPC-Typen (§B3).
11. **Echte Stimmen** (Erzähler, Promo, Songs, Performance) über ElevenLabs. Wenige eigene **Voice-Design-Basisstimmen** dienen als Ausgangspunkt, Varianten entstehen per **Voice Remix**. Für Szenen mit mehreren Figuren gibt es **Text to Dialogue**, und Georg kann über den **Voice Changer** selbst „Mel Blanc“ spielen. Kosten: TTS ≈ 1 Credit pro Zeichen, Voice Changer 1.000 Credits pro Minute [B].

---

# Teil A · HeyGen

## A1 · Was es heute gibt

### A1.1 Übersicht

| Baustein | Was es ist | Status |
|---|---|---|
| **Avatar-Engines** | Drei Engines. **Avatar III** ist die Foto-zu-Video-Pipeline, bis 4K. **Avatar IV** ist Standard, nimmt auch beliebige Bilder (`type: "image"`) und unterstützt `motion_prompt` und `expressiveness` (low/medium/high). **Avatar V** hat die höchste Wiedergabetreue, unterstützt aber **kein** Foto-Avatar und ist nur nach Eignungsprüfung je Look verfügbar ([Models](https://developers.heygen.com/models.md), [Avatar IV](https://developers.heygen.com/avatar-iv.md)) | [B] |
| **Avatar erstellen** | Vier Wege: aus einem Foto, aus einem Video (Digital Twin, mit Einwilligungsprozess), aus einem Prompt (rein synthetische Figur, bis zu 3 Referenzbilder) und Look-Packs ([Create Avatar-Index](https://heygen-1fa696a7.mintlify.site/llms.txt), [Prompt to Avatar](https://developers.heygen.com/docs/avatar-from-prompt.md)) | [B] |
| **Foto-Avatar / Talking Photo** | Ein Standbild plus Skript wird zum lippensynchronen Video. Laut Doku ist das Foto „of a real person“, und HeyGen holt dafür **keine** Einwilligung ein: Das liegt beim Nutzer ([Photo to Avatar](https://developers.heygen.com/docs/avatar-from-photo.md)) | [B] |
| **Cartoon-, Tier- und 3D-Bilder** | HeyGen nennt Avatar IV „best suited“ für Avatare, die „cartoonish, animated“ sind; Foto-zu-Video eigne sich für „dogs, cartoon characters, or 3D models“ ([Hilfe-Center Avatar IV](https://help.heygen.com/en/articles/11269603-new-feature-alert-heygen-avatar-iv-is-here)). In der Entwickler-Doku steht dazu nichts | [B-Hersteller] |
| **Eigenes Audio statt Skript** | In der Web-App kann man statt eines Skripts eine Audiodatei hochladen (Hilfe-Center Avatar IV). In der API-Doku zu `POST /v3/videos` ist **kein** Audio-Feld dokumentiert. Die Usage-Limits nennen aber „audio: 10 minutes maximum“ ([Usage Limits](https://developers.heygen.com/docs/usage-limits.md)) | Web [B-Hersteller]; API-Feldname **nicht belegt** |
| **Singen** | HeyGens „Make photo sing“-Seite sagt, Cartoon- und Anime-Porträts funktionieren, wenn ein Gesicht erkennbar ist ([HeyGen Tool](https://www.heygen.com/tool/make-photo-sing)). Eine Drittquelle nennt bis 3 Minuten je Generierung ([Artlist](https://artlist.io/ai/models/heygen-ai)) | [B-Hersteller]; Länge nur Drittquelle |
| **Transparenz** | Avatar-Videos können mit `output_format: "webm"` und Alpha-Kanal ausgegeben werden ([Digital Twin / Videos](https://developers.heygen.com/generate-avatar-video.md)) | [B] |
| **Text-zu-Video, Video Agent** | Die v3-Video-Agent-Pipeline macht aus Idee oder Skript ein fertiges Presenter-Video mit Stilen (Tags u. a. cinematic, retro-tech, handmade, print). Dauer **20–45 Minuten** je Video ([heygen-video Skill](https://developers.heygen.com/skills/heygen-video)) | [B] |
| **Templates** | Vorlagen werden im Web-Editor gebaut. Variablen: `text`, `image`, `video`, `audio`, `voice`, `character`. Pro Datensatz gibt es einen POST, z. B. eine Karte je Video. Batch-Endpunkte erlauben bis 100 Elemente ([Templates](https://developers.heygen.com/templates.md), [MCP-Übersicht](https://developers.heygen.com/mcp/overview)) | [B] |
| **Stimmen** | Stock-Stimmen, Voice Design (Prompt, bis 3 Treffer je Seed), Instant Clone (Beta, während der Vorschau kostenlos), Professional Clone (Beta, kostenpflichtig, 20+ Minuten Aufnahme), TTS ([Design a Voice](https://developers.heygen.com/docs/voices/design-voices.md), [Models](https://developers.heygen.com/models.md)). Ein Workspace kann ElevenLabs-Stimmen sperren: HeyGen nutzt also teils ElevenLabs ([MCP-Übersicht](https://developers.heygen.com/mcp/overview)) | [B] |
| **Video-Übersetzung** | 175+ Sprachen, klont standardmäßig die Originalstimme. Es gibt einen Speed-Modus und einen Precision-Modus; Precision ist für bewegte Gesichter und Seitenwinkel gedacht. Optionen: nur Audio (ohne Lip-Sync), Musikspur behalten oder entfernen, SRT/VTT, mehrere Sprecher. Abgerechnet wird nach Länge des **Quellvideos** ([Video Translate](https://developers.heygen.com/docs/video-translate.md)) | [B] |
| **Lip-Sync allein** | Video plus Audio ergibt einen neu gezeichneten Mund. Es gibt Speed- und Precision-Modus. Ob Gesang und nicht-menschliche Gesichter funktionieren, steht nicht in der Doku ([Lipsync](https://developers.heygen.com/lipsync-speed.md)) | [B]; Gesang **nicht belegt** |
| **Generische Videomodelle** | Über „Generate Assets“ bzw. das MCP-Werkzeug `create_model_video` laufen Seedance 2 und Veo 3, Bildgenerierung über `create_image_generation` ([Credits-Artikel](https://help.heygen.com/en/articles/15126059), [MCP-Übersicht](https://developers.heygen.com/mcp/overview)) | [B] |
| **Sonstiges** | AI Clipping, Füllwort-Entfernung, Brand Kits und Glossare, Ordner, Asset-Uploads ([MCP-Übersicht](https://developers.heygen.com/mcp/overview)) | [B] |
| **Ausgabe-Grenzen** | Avatar-Videos mit 25 fps, 128–4.096 px, 16:9 oder 9:16, bis 50 Szenen und bis 30 Minuten je Szene. Eingabebilder < 2K und ≤ 50 MB. Skript ≤ 5.000 Zeichen ([Usage Limits](https://developers.heygen.com/docs/usage-limits.md)) | [B] |

### A1.2 HyperFrames: was es genau ist

- **Framework, kein Avatar-Dienst.** HyperFrames ist ein Open-Source-Framework (Apache 2.0), das „HTML, CSS, media, and seekable animations“ in **deterministische MP4-Videos** verwandelt. Eine Komposition ist eine HTML-Datei mit `data-`-Attributen für Timing und Spuren. Animationen kommen aus GSAP, CSS, Lottie, Three.js, Anime.js oder WAAPI. Der Renderer springt Frame für Frame durch headless Chrome und kodiert mit FFmpeg ([GitHub](https://github.com/heygen-com/hyperframes)) [B].
- **Kosten:** laut GitHub „no per-render fees or commercial-use thresholds“. Lokales Rendern verbraucht **keine HeyGen-Credits** ([Quickstart](https://hyperframes.heygen.com/quickstart)) [B]. Optional gibt es HeyGen-Cloud-Rendering (`POST /v3/hyperframes/renders`, max. 5 pro Sekunde) und AWS Lambda; die Preise dafür sind **nicht belegt**.
- **Voraussetzungen:** Node.js 22+ und FFmpeg [B].
- **Funktionen:** Audiospuren mit Lautstärke und Ducking (Skill `/hyperframes-audio`), Untertitel- und Kinetic-Caption-Workflows, ein Shader-Übergangspaket und ein Katalog mit Blöcken [B]. Eigene TTS ist nicht eingebaut; der Skill `/media-use` kann externe TTS- und Bildmodelle einbinden [B]. Ob es Alpha- bzw. WebM-Ausgabe gibt, ist **nicht belegt**.
- **Mit Claude Code** [B], **nicht ausgeführt**:

  ```bash
  claude plugin marketplace add heygen-com/hyperframes
  claude plugin install hyperframes@hyperframes
  # oder: npx skills add heygen-com/hyperframes
  npx hyperframes init <projekt> && npx hyperframes preview && npx hyperframes render --output clip.mp4
  ```

- **[E] Bedeutung für KFB:** Unsere Karten-PNGs, die Schrift Georg Comic Pro und die PAPER- und Tinten-Farben lassen sich 1:1 als HTML-Szene animieren und sauber versioniert rendern, auch im Batch für alle Karten. Laut V-390 ist das **kein neuer Ort**, sondern ein Render-Werkzeug, dessen Ergebnisse in die Asset-Bibliothek gehen. Die Installation braucht Georgs Freigabe.

### A1.3 MCP-Server und Skills: Einrichtung und was WS0 direkt aufrufen könnte

**Remote-MCP** [B] ([MCP-Übersicht](https://developers.heygen.com/mcp/overview), [Claude-Code-Setup](https://developers.heygen.com/mcp/claude-code.md))

- Endpunkt: `https://mcp.heygen.com/mcp/v1/`. Es wird nichts lokal installiert.
- Einrichtung macht **Georg selbst**, weil WS0 sich nicht einloggt:
  1. `claude mcp add --transport http -s user heygen https://mcp.heygen.com/mcp/v1/`
  2. In Claude Code `/mcp` aufrufen, `heygen` wählen und im Browser freigeben (OAuth, einmalig).
- Abrechnung: über die bestehenden **Plan-Credits** des HeyGen-Kontos („Web plan + premium credits“). Ausnahme: `generate_model_speech` wird über OAuth/MCP je Anfrage auf ganze Abrechnungseinheiten **aufgerundet** und kann deshalb teurer sein als per API-Key [B].
- Gut 100 Werkzeuge, die für uns relevanten:

  | Zweck | Werkzeuge |
  |---|---|
  | Guthaben prüfen | `get_current_user` (Profil, Credit-Stand, Plan) |
  | Avatare | `create_avatar` (Foto/Prompt), `list_avatar_groups`, `list_avatar_looks`, `create_avatar_looks` (nicht im Free-Tier) |
  | Video | `create_video` (Avatar IV/V), `get_video` |
  | Video Agent | `create_video_agent`, `list_video_agent_styles` |
  | Templates | `list_templates`, `generate_from_template`, `create_video_batch` (≤ 100 Elemente) |
  | Stimmen | `design_voice`, `clone_voice`, `create_speech`, `list_voices` |
  | Lokalisierung | `create_video_translation`, `create_lipsync` |
  | Assets | `create_asset_upload` |
  | Generierung | `create_model_video` (Seedance/Veo), `create_image_generation` |
  | Musik/Sound | `search_audio_sounds` |

- Grenzen: Eigene (private) Avatare aus Videos echter Personen brauchen einen Consent-Link, der 24 Stunden gilt. Templates erscheinen nur, wenn sie Variablen haben, und müssen im Web-Editor (Version 4) gebaut sein.

**Skills** [B] ([Skills-Übersicht](https://developers.heygen.com/skills/overview), [Install](https://developers.heygen.com/skills/install.md))

- Drei offene Skills:

  | Skill | Was er macht | Liefert |
  |---|---|---|
  | `heygen-avatar` | Digital Twin aus Foto oder Beschreibung | `avatar_id`, `voice_id` |
  | `heygen-video` | Presenter-Video über Video Agent v3 | — |
  | `heygen-translate` | Übersetzung in 175+ Sprachen | — |

  Die Skills verketten sich über `AVATAR-<NAME>.md`-Dateien im Arbeitsordner.
- Installation: `gh skill install heygen-com/skills <skill>` (gh ≥ 2.90), `clawhub install heygen-skills` oder `git clone … ~/.claude/skills/heygen-skills`.
- **Wichtig für die Abrechnung:** Ist `HEYGEN_API_KEY` gesetzt, nehmen die Skills **immer** den CLI-Weg und rechnen als direkte API-Nutzung ab, getrennt von den Plan-Credits. Ohne Key und mit sichtbaren MCP-Werkzeugen laufen sie über die Plan-Credits [B]. Das API-Guthaben ist ein eigenständiger Kauf in US-Dollar ([Hilfe-Center API-Preise](https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained)) [B].
- **[E] Empfehlung:** Keinen API-Key setzen und nur den MCP-Weg nutzen, damit Georgs vorhandene Credits verbraucht werden. Der Skill `heygen-video` ist auf Firmen-Presenter zugeschnitten: Er fragt Zielgruppe und Produkt ab und rendert 20–45 Minuten. Für KFB sind gezielte MCP-Aufrufe (`create_video` mit fixem Bild, Audio und Stimme) kontrollierbarer. Die Skills selbst sind optional.

## A2 · Was eine Minute kostet (Credits)

Quelle: HeyGen-Hilfe-Center „How to Use Credits on HeyGen“ ([Artikel 15126059](https://help.heygen.com/en/articles/15126059)), am 18.10.2026 abgerufen, ohne Datum auf der Seite. [B-Hersteller]

| Funktion | Credits |
|---|---|
| Avatar III, Photo Look | 7 / Min |
| Avatar III, Video Look | 4 / Min |
| **Avatar IV, Photo Look** (unser Fall: Render-Bild) | **16 / Min** |
| Avatar IV, Video Look | 31 / Min |
| Avatar V (Photo und Video Look) | 48 / Min |
| Custom Expressive Motion (nur Avatar IV) | 40 / Min |
| **Video Agent, Standard** | **80 / Min** |
| Video Agent, Seedance-Modus | 240 / Min |
| Seedance 2 (Generate Assets), 720p / 1080p | 60 / 150 pro Video, beliebige Länge |
| Veo 3 (Generate Assets) | 90 pro Video |
| **Video-Übersetzung Speed mit Lip-Sync** | **6 / Min** (Quelllänge) |
| Video-Übersetzung Precision mit Lip-Sync | 10 / Min |
| Video-Übersetzung ohne Lip-Sync | 4 / Min |
| Bildgenerierung | 2 pro Bild |
| Looks generieren | 1 pro Look |
| AI Model Training | 60 pro Training |
| TTS, Voice Clone, Lip-Sync allein, Templates ohne Avatar | **nicht belegt** (die App zeigt die Kosten laut Artikel vor dem Generieren an) |

**Widersprüche und Vorbehalte**

- Der Avatar-IV-Artikel nennt für Foto-zu-Video mit eigenem Motion-Prompt einen Verbrauch im „2:1 ratio“, also ≈ 32 pro Minute. Die Tabelle oben nennt für Custom Expressive Motion 40 pro Minute. Eine Such-Zusammenfassung nannte für Video Agent 40 statt 80 pro Minute. Drittanbieter-Blogs nennen pauschal 20 pro Minute für Avatar IV und sind veraltet. **[E]** Vor jedem Batch zeigt die App den Preis an, und `get_current_user` liefert den Credit-Stand vorher und nachher. Das ist die Messung, auf die wir uns verlassen sollten.
- Studio-Videos berechnen laut Hilfe-Center nur die tatsächlichen Avatar-Sekunden [B-Hersteller].

**Pläne** [B-Hersteller] ([Credit-Pricing](https://help.heygen.com/en/articles/15125761-heygen-credit-based-pricing-explained), [Pricing](https://www.heygen.com/pricing))

| Plan | Preis | Credits / Monat | Max. Videolänge | Auflösung | Nachkauf |
|---|---|---|---|---|---|
| Creator | 29 $ | 600 | 30 Min | 1080p | keiner |
| Pro | ab 49 $ | 1.000 | 30 Min | 4K | keiner |
| Business | 149 $ + 20 $ je Sitz | 1.500 | 60 Min | 4K | 0,05 $ pro Credit |

- Monatsabos: Ungenutzte Credits rollen **einen** Abrechnungszyklus weiter. Beim Wechsel auf Free verfallen sie.
- **Georgs Plan und Credit-Stand sind nicht belegt.** Den Stand liefert `get_current_user` nach der MCP-Freigabe.

**[E] Umrechnung für 600 Credits** (Creator), jeweils für das ganze Guthaben:

| Verwendung | Ergibt |
|---|---|
| Avatar IV Foto | ≈ 37 Min |
| Avatar V | ≈ 12 Min |
| Video Agent | ≈ 7,5 Min |
| Übersetzung Speed | ≈ 100 Min Quellvideo |
| Seedance 2, 720p | 10 Clips |

## A3 · Einsatz für KFB: Bewertung je Punkt

Look-Maßstab: Knet- und Ton-Cartoon, *ein* Licht-Rig, Abnahme über die einheitliche Proof-Stufe (Licht, Ton, Augen, Presets, Gates). Sichtbare Mängel werden nicht weitergereicht.

| # | Einsatz | Machbar | Qualitätsrisiko gegen Ton-Look | Aufwand | Credits (Richtwert) |
|---|---|---|---|---|---|
| **a1** | **Karten-Promo und Billboard-Clip aus Karten-PNG bzw. -PDF** (Karte fliegt ein, Text tippt sich, Glyphe → Fluff → Klartext, Deck-Fanfare) | **Ja, mit HyperFrames** | **Gering.** Es sind unsere eigenen Pixel, Schriften und Farben, deterministisch gerendert | Mittel: eine Vorlage, danach Batch je Karte. Unsere Ton-Assets aus V-523 als Audio | **0** |
| a2 | Dasselbe über **HeyGen-Templates** (Variablen Text/Bild je Karte) | Teilweise | Mittel: HeyGen-Editor-Ästhetik, Typo und Animation weniger frei | Gering bis mittel; Vorlage im Web-Editor | ohne Avatar **nicht belegt**; mit Avatar-Szene 16 / Min |
| a3 | Dasselbe über **Video Agent** (Prompt + Karten-PDF als Anhang) | Ja, aber unpassend | **Hoch:** generative Stock- und Motion-Graphics-Szenen, nicht reproduzierbar, 20–45 Min je Video | Gering | 80 / Min |
| **a4** | **Hypernormalisation-Billboard in der Dystopia Alley**: glatter synthetischer KI-Sprecher (Prompt-Avatar „Nachrichtensprecher“) verkündet fröhlichen Unsinn | **Ja** | **Gewollt.** Der Realismus-Bruch auf einem Bildschirm in der Knetwelt ist der Witz. Er sitzt diegetisch im Billboard-Rahmen (V-220/V-223), nicht in der Welt | Gering: ein Prompt-Avatar, eigene KFB-Texte, Rahmen aus HyperFrames (Ticker, Logos) | 16 / Min (Avatar IV) bzw. 48 (V); ein 20-s-Clip ≈ 6–16 |
| **b** | **FrizzleBob als Avatar-Erzähler** aus einem Ton-Render (Foto-Avatar bzw. `type: "image"`, Audio von ElevenLabs) | **Teilweise, nur testen** | **Hoch.** Avatar IV verformt ein 2D-Standbild; Mund und Zähne eines Hasenmauls werden erfunden; die Tonoberfläche kann verschmieren; die Kamera bleibt fix; Konsistenz über mehrere Clips ist offen. Laut Hersteller ist IV für Cartoon-, Tier- und 3D-Bilder geeignet [B-Hersteller]; unabhängige Tests dazu: **nicht belegt** | Gering für den Test, hoch für Serienqualität | 16 / Min; Test 15 s ≈ 4 |
| b-alt | FrizzleBob als **eigener Render** (Blender bzw. Wireface-Mund-Rig mit Mund-Cues aus dem Audio) | Ja | Gering: echter Ton-Look, ein Licht-Rig | Hoch, aber im eigenen Werkzeug und wiederverwendbar | 0 HeyGen |
| **c** | **Musikvideo und Performance-Clips** zu Suno-Songs | **Teilweise** | Ein singendes Porträt (Avatar IV + Song-Upload) taugt als Social-Teaser; Risiko wie bei b. Ein Video mit mehreren Szenen geht nur mit Seedance oder Veo, und das sind generische Realfilm- bzw. Stil-Clips ohne Ton-Konsistenz: **hoch** | Teaser gering; volles Video hoch | Teaser 16 / Min; Seedance 60–150 pro Clip |
| c-alt | Performance in unserer Engine: Figur im Diorama, Mund-Cues aus dem Song, Kamerafahrt; Lyrics und Titel über HyperFrames | Ja | Gering | Mittel bis hoch | 0 |
| **d** | **VFX-Ebenen** (Explosion, Rauch, Funken) | **Nein** | HeyGen hat keine Effekt-Werkzeuge. Seedance/Veo liefern ganze Clips, keinen Alpha-Kanal, nicht loopbar, realistisch. Alpha gibt es nur für Avatar-Videos (WebM) [B] | – | – |
| **e** | **Lokalisierung DE/ES** | **Teilweise** | Im Spiel gibt es nichts zu übersetzen: Die NPC-Melodie ist ohne Sprache, und die Blase bleibt englisch (V-508 Punkt 10). Für Promo- und Erzählervideos ist HeyGen Translate eine schnelle Option, die die Stimme klont und den Mund nachsynchronisiert. Bei Ton-Gesichtern ist das Lip-Sync-Risiko wie bei b | Gering | 6 / Min (Speed), 10 (Precision), 4 ohne Lip-Sync |
| e-alt | Skript direkt auf DE/ES schreiben (Georg prüft) und mit derselben ElevenLabs-Stimme neu sprechen | Ja | Gering, sauberer als eine Übersetzung im Nachgang | Gering | ElevenLabs ≈ 1.000 Credits pro Minute und Sprache (§B4) |

**[E] Fazit HeyGen**

- **Lohnt sich:**
  - (1) HyperFrames für alle Karten- und Billboard-Promos, ohne Credits.
  - (2) Ein Hypernormalisation-Sprecher als bewusster Stilbruch auf Bildschirmen und Billboards.
  - (3) Translate für fertige Promovideos mit Sprecher.
- **Nur als kleiner Test:** FrizzleBob als Foto-Avatar und singende Porträts.
- **Lohnt sich nicht:** VFX, Musikvideos mit mehreren Szenen, Video Agent für Kartenclips.

**Offen für Georg:** Hat das Billboard im Spiel Ton? Weil NPCs keine echte Sprache sprechen (V-492), sind drei Varianten möglich:

- **(i) stumm mit Laufschrift:** realistisch für Billboards.
- **(ii) Avatar-Mund auf Fluff-o-lect-Melodie:** Peanuts-Effekt, Lip-Sync auf Instrument-Audio ist aber **nicht belegt**.
- **(iii) echte Sprache nur außerhalb des Spiels** (Promo).

## A4 · Lizenz und Nutzungsbedingungen

HeyGen Terms of Service, gültig ab 06.03.2025, zuletzt geändert am 15.10.2026 ([ToS](https://www.heygen.com/terms)):

| Punkt | Inhalt | Status |
|---|---|---|
| Eigentum am Output | Auf bezahlten Plänen (Creator, Pro, Business) gehören User Input und User Output dem Nutzer, „you own all rights in your User Input or User Output“ (§3). Auf Free gibt es nur eine eingeschränkte, widerrufliche Lizenz | [B] |
| Kommerzielle Nutzung | Auf bezahlten Plänen erlaubt. Free nur „personal, non-commercial, and internal evaluation purposes“, keine Werbung (§4) | [B] |
| Lizenz an HeyGen | Für unsere Inhalte erhält HeyGen eine weltweite, unentgeltliche, übertragbare, **unterlizenzierbare und unwiderrufliche** Lizenz, um den Dienst zu betreiben **und zu verbessern**, ausdrücklich auch „train or otherwise improve“ (§3). Sie gilt über das Vertragsende hinaus | [B] |
| Widerspruch | Die FAQ sagt, Nutzerdaten würden nicht zum Training genutzt ([FAQ](https://www.heygen.com/faq)). Die ToS sagen das Gegenteil. **[E]** Maßgeblich sind die ToS | [B] |
| Eigene Figuren | Wir versichern, die nötigen Rechte zu haben (§3). Bei eigenen Figuren ist das unproblematisch. **[E]** Mit jedem Upload eines unveröffentlichten FrizzleBob-Renders räumen wir HeyGen aber die obige Lizenz ein | [B] / [E] |
| KI-Kennzeichnung | Output darf nicht als rein menschlich gemacht ausgegeben werden; wo das Gesetz es verlangt, muss die KI-Herkunft offengelegt werden (§2) | [B] |
| Stock-Avatare und Stock-Stimmen im Spiel | Keine besonderen Regeln in den ToS gefunden | **nicht belegt** |
| Reale Personen | Keine Imitation ohne Erlaubnis; Fotos von Personen nur mit Einwilligung. Prompt-Avatare sind laut Doku rein synthetisch, eine Einwilligung entfällt ([Prompt to Avatar](https://developers.heygen.com/docs/avatar-from-prompt.md)) | [B] |
| Steam | Valve verlangt im Content Survey eine Offenlegung von KI-Inhalten, die in der Entwicklung erzeugt wurden („Pre-Generated“), und zeigt sie teils auf der Store-Seite an ([VGC](https://www.videogameschronicle.com/news/steam-pages-will-now-disclose-which-games-use-ai-generated-content/), [80.lv](https://80.lv/articles/steam-introduces-new-rules-for-games-with-generative-ai/)). Den aktuellen Wortlaut der Steamworks-Doku habe ich nicht geprüft | [B] (Presse) |

**[E] Folgerungen**

- Nur auf einem bezahlten Plan produzieren.
- Für das Billboard einen **synthetischen Prompt-Avatar** nehmen, keine reale Person, keinen Stock-Avatar mit unklarer Rechtslage.
- Figuren-Uploads bewusst begrenzen: ein Test-Render, kein komplettes Figurenarchiv.
- KI-Nutzung im Steam-Survey vermerken.

---

# Teil B · Cartoon-Synchron für viele NPCs

**Bindender Rahmen**

- NPCs sprechen **keine** echte Sprache. Sie „singen“ ihre Zeile als eine Melodie auf ihrem Instrument, und die Bedeutung steht in der Blase (V-492, V-500, V-508; Spec R1-01, R1-02).
- Es gilt ein Ton je Wort; nur Kartentitel und Eigennamen bekommen ein Leitmotiv (V-508 Punkt 1). Die Tonleiter kommt aus der Stimmung, nicht aus der Figur (V-508 Punkt 2, R1-07).
- Die Stimmen sollen tief und weich sein: R2 war „zu hoch und nervig“ (V-497).
- Heutige Grundbesetzung (V-497, P9):

  | Figur | Instrument | Wellenform | Grundton |
  |---|---|---|---|
  | FrizzleBob | Horn | Triangle | 110 Hz, Wah 0,35 |
  | Dory | Flöte | Sine | 220 Hz, Atem |
  | Hunky | Tuba | Triangle | 73,4 Hz |

- **Hinweis:** Der ElevenLabs-Satz `fluffolect_layer_r1` (V-523) nutzt für Gefühls-Einwürfe noch die R2-Instrumente: FrizzleBob Posaune, Dory Okarina, Hunky Fagott/Kazoo. Das sollte Georg angleichen (Frage F1).

## B1 · Wie klassisches Cartoon-Synchron funktioniert

| Quelle | Befund | Status | Lehre für uns [E] |
|---|---|---|---|
| **Mel Blanc** (Daffy Duck / Sylvester) | Laut Blancs Autobiografie beruht Sylvesters Stimme auf Daffys. Daffy wurde in der Nachbearbeitung beschleunigt bzw. leicht hochgepitcht, Sylvester blieb in normalem Tempo, mit stärkerem Lispeln ([Looney Tunes Wiki, nach Blancs Autobiografie](https://looneytunes.fandom.com/wiki/Daffy_Duck); Blanc-Zitat: Daffy „pitched up slightly“, [MeTV](https://metv.com/stories/mel-blanc-on-sylvester)). Die Quellen weichen im Detail ab | [B] (Sekundärquellen) | **Eine** Grundstimme ergibt durch Tempo und Tonhöhe in der Nachbearbeitung zwei Figuren. Das entspricht genau unseren Reglern Lage und Tempo |
| Mel Blanc: Stimme aus der Zeichnung | Zu Sylvesters Model Sheet meinte er, eine große, schlampige Katze brauche eine große, schlampige Stimme. Daffys Lispeln leitete er vom langen Schnabel ab ([MeTV](https://metv.com/stories/mel-blanc-on-sylvester)) | [B] | **Körperlogik:** Größe, Mundform und Material des Modells bestimmen die Stimme. Bei uns: Figurengröße → Lage und Formanten, Material → Klangfarbe |
| **Die Simpsons** | Wenige Sprecher tragen eine ganze Stadt: Hank Azaria über 200 Figuren, Harry Shearer etwa 172–183 ([WhatCulture](https://whatculture.com/tv/top-10-secondary-simpsons-characters-voiced-by-hank-azaria), [Bay News 9](https://baynews9.com/fl/tampa/news/2015/5/14/harry_shearer_simpsons)). Zu Dan Castellaneta gibt es nur eine unvollständige Zählung (26, ohne Einmalrollen, [HuffPost](https://www.huffingtonpost.ca/2015/01/23/simpsons-infographic-voice-actors_n_6528346.html)) | [B] (Zählweisen uneinheitlich) | Hauptfiguren bekommen die markantesten Stimmen, Nebenfiguren variieren auf weniger Achsen. Dass Stimmen ähnlich klingen, ist erlaubt, solange Bild und Kontext tragen |
| **Dee Bradley Baker** (alle Klon-Soldaten in *The Clone Wars*) | Er startet von einer Kernstimme (Rex) und gibt jedem Klon „an adjective or two“, z. B. jünger und rauer oder älter und zynischer. Schwierig sei die sehr kleine Differenzierung; bei der *Bad Batch* gehe es leichter, weil die Figuren verschiedener sind ([AWN](https://www.awn.com/news/dee-bradley-baker-discusses-voicing-clones-star-wars-clone-wars), [Wikipedia: Captain Rex](https://en.wikipedia.org/wiki/Captain_Rex)) | [B] | Ein **Basis-Patch je Darsteller** plus **1–2 Haltungs-Adjektive je Rolle**. Nur feine Unterschiede reichen nicht, es braucht mehrere Achsen |
| **Mary Robinette Kowal** (Hörbuch-Sprecherin) | Fünf Werkzeuge: **Pitch, Placement** (Resonanzort: nasal hell oder Rachen dunkel), **Pacing, Accent, Attitude**. Nicht allein auf Tonhöhe setzen; Haltung und Tempo reichen oft, Placement ist ein Bonus ([Kowal](https://maryrobinettekowal.com/journal/character-voices/)) | [B] | Tonhöhe ist der schwächste Unterscheider. Tempo und Artikulation zuerst, dann Formanten |
| Praxis-Leitfaden | Der Rhythmus definiert eine Figur oft stärker als die Tonhöhe. Pro Stimme einen Referenz-Clip mit Einstellungen anlegen und vor jeder Aufnahme anhören ([Violet Recording](https://violetrecording.com/how-to-do-character-voices-for-voice-acting/)) | [B] | Pro Rolle eine **Stimm-Karte** mit Referenzzeile, als JSON und Hörprobe |
| **Psychoakustik: Stimme** | Tonhöhe (glottale Pulsrate) und Vokaltraktlänge (Formant-Skala) sind die Haupthinweise auf Größe, Geschlecht und Alter. Schon 7 % Änderung der simulierten Vokaltraktlänge sind zuverlässig unterscheidbar (Smith & Patterson 2005, [PDF](https://www.pdn.cam.ac.uk/system/files/documents/SPjasa05.pdf)) | [B] | Lage und Formant-Faktor sind zwei **unabhängige** Größen-Regler |
| **Psychoakustik: Instrumente** | Hörer unterscheiden die akustische Skala von Instrumentenklängen, allerdings weniger genau als bei Stimmen. Die Instrumentenfamilie erkennen sie auch dann, wenn Tonhöhe und Skala weit über das Normale hinaus verschoben sind (van Dinther & Patterson 2006, JASA 120(4), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2821800)). Genaue Schwellenwerte konnte ich nicht lesen (Captcha) | [B] (Abstract-Ebene) | Ein „Horn-Darsteller“ bleibt auch als großes oder kleines Horn ein Horn. Das ist die Grundlage für „ein Instrument, viele Rollen“. Formant-Schritte deshalb gröber wählen als 7 %, z. B. ≥ 15 % |
| Vorbilder mit Instrument-Stimmen | Peanuts-Erwachsene (gedämpfte Posaune), Clangers (Swanee-Pfeife folgt der Satzmelodie eines echten Skripts), R2-D2, BB-8. Belegt in RESEARCH_FLUFF_LINGUISTICS_R1 §3.1 | [B] (dort) | Eine Instrument-Stimme mit Satzmelodie trägt Figur und Gefühl |

## B2 · Übertragung auf unsere Melodie-Stimmen

### B2.1 Sprecher-Werkzeug → Melodie-Parameter [E]

| Sprecher-Werkzeug | Melodie-Parameter (P9 bzw. `kfb.fluffolect.voice/1`) | Hinweis |
|---|---|---|
| Pitch | `baseHz` (Lage der Figur) | In V-497 nach unten begrenzt (nicht zu hoch). Eher schwacher Unterscheider (Kowal) |
| Placement / Resonanz | `formants[].hz` × **`formantScale`** (neu), `lowpassHz` | Skala < 1 = größer und dunkler, > 1 = kleiner und heller (Vokaltraktlänge) |
| Pacing / Rhythmus | **`tempo`** (neu, Faktor auf Notendauern), Pausenlänge | Stärkster Unterscheider laut Praxis |
| Artikulation | `envelope` (Attack, Release), **`articulation`** (neu: legato / portato / staccato / marcato), Glissando-Zeit | Staccato-Figuren klingen sofort anders als Legato-Figuren |
| Texture (rau, hauchig) | `breath`, **`rough`** (neu: Amplitudenmodulation 20–35 Hz bzw. Rauschbeimischung), `wah` | Rau = Ork und Monster; hauchig = Hexe, Geist |
| Vibrato | `vibrato` {rateHz, depth} | Drei Klassen: keins, warm (4–5,5 Hz) oder weit (6–7 Hz, tief) |
| Attitude | **`heatGain`** (neu: wie stark Heat den Ausschlag skaliert), Default-Emotion | Prahler = großer Ausschlag, stoische Figur = kleiner. Die Skala bleibt aus der Emotion (V-508 Punkt 2) |
| Accent | **nicht** über die Tonleiter (die gehört der Stimmung), sondern über Ornamentik: Vorschläge, Swing, Glissando-Stil | Swing-Faktor für FrizzleBob, strenges Raster für Spielzeugsoldaten |
| Catchphrase | **`tic`** (neu): kurzes Signatur-Ornament, z. B. Auftakt oder Vorschlag in den ersten Ton | **Δ-Frage F2**: Ein Tick ist Klang, der zu keinem Wort gehört. Er verletzt R1-06 nicht (Ende bleibt am letzten Wort), erweitert aber „ein Ton je Wort“ |
| Physische Logik | Größe → `baseHz` und `formantScale`; Material → `wave` und Formanten; Mundform → Mund-Cues | Frequenz-Code (RS §3.3): tief = groß und bestimmt |
| Duo / Zwilling (V-466) | **`variantOf`** (neu): gleicher Darsteller und Patch, Abstand auf genau einer Achse (z. B. ±2–3 HT und eine andere Vibrato-Klasse) | Verwandtschaft bleibt hörbar, die Figuren sind trotzdem unterscheidbar |
| Haltungs-Adjektive (Baker) | **`attitude`** (neu, z. B. `["müde","gönnerhaft"]`), nur zur Dokumentation und für die Hörprüfung | Pro Rolle eine Stimm-Karte |

Alle neuen Felder sind **additiv** zu Spec §4.3. Ohne sie verhält sich der Patch wie heute.

### B2.2 Faustregel: wie viele Figuren pro Instrument? [E]

**Fünf Achsen.** Als „deutlich verschieden“ gilt:

1. **Lage:** mindestens 4 Halbtöne Abstand.
2. **Formant-Skala:** mindestens 15 % Abstand, also rund das Doppelte der Stimm-Schwelle von 7 %, weil Instrumente schlechter unterschieden werden als Stimmen [B].
3. **Tempo:** mindestens 20 % Abstand.
4. **Artikulationsklasse:** legato / portato / staccato / marcato.
5. **Vibrato- bzw. Rauheitsklasse.**

**Regel:** Zwei benannte Rollen eines Darstellers müssen sich auf **mindestens 2 Achsen** deutlich unterscheiden und einen eigenen Tick haben.

**Kapazität eines Instrument-Darstellers:**

| Rollen | Anzahl | Anforderung |
|---|---|---|
| Hauptrolle | 1 | Basis-Patch |
| Benannte Nebenrollen | 2–3 | eigener Tick, 2-Achsen-Regel |
| Generische Varianten | bis ~4 | ohne Tick; sie müssen nur anders klingen als die benannten Rollen, nicht blind erkennbar sein |
| **Gesamt** | **≈ 6–8** | |

**Herleitung**

- Wegen V-497 (nicht zu hoch) bleibt je Darsteller etwa eine Oktave nutzbar. Das ergibt rund 3 Lagen im Abstand von 4–5 HT.
- Mit 3 Formant-Stufen, 2–3 Tempo-Klassen und 3–4 Artikulationen gäbe es rechnerisch viele Kombinationen. Baker zeigt aber, dass kleine Unterschiede in der Praxis schwer bleiben. Deshalb die konservative Zahl.
- Im Spiel ist die Identifikation entlastet: Sprechblase, Figurenfarbe und sichtbarer Sprecher tragen sie mit (R1-02). Die Stimme muss **passen und sich abheben**, aber nicht blind zuzuordnen sein.
- Die Zahlen sind **nicht gemessen**. Der Pilot in §B5 misst sie.

### B2.3 Grenzen

- Bei sehr tiefen Grundtönen unter etwa 80–100 Hz (Hunky 73 Hz, Ork, Monstrosity) braucht der Klang **kräftige Obertöne und Formanten**, sonst geht er auf Handy- und Laptop-Lautsprechern unter. Die Größe kommt dann über die Formanten, nicht über den Grundton [E]. Gemessene Werte: **nicht belegt**.
- Höchstens 2 gleichzeitige Sprecher-Stränge (R1-25). Gruppen wie Skelett-Chöre oder Bot-Schwärme brauchen deshalb einen eigenen „Chor-Patch“ (ein Strang mit Detune und Chorus), keine 6 Einzelstimmen [E].
- Kein Xylophon-„Pling-Plong“: Das wurde bei den Kampf-Sounds als oberflächlich abgelehnt (V-461). Skelette deshalb nicht über Xylophon besetzen.

## B3 · Besetzungsvorschlag (Startwerte [E], Abnahme nach Gehör)

### B3.1 Instrument-Darsteller (6)

| ID | Darsteller | Basis-Patch (Web Audio) | Rollen |
|---|---|---|---|
| **A** | Horn / Signalhorn | Triangle, Formanten ≈ 500 / 1.200 Hz, Wah möglich (P9 FrizzleBob) | FrizzleBob (H), Spielzeugsoldaten, generische NPCs |
| **B** | Flöte / Okarina | Sine + Atemrauschen (P9 Dory) | Dory (H), Hexen-Duo, generische NPCs |
| **C** | Tuba | Triangle tief, Formanten dunkel (P9 Hunky) | Hunky (H), Orks, Monstrosity |
| **D** | Fagott (Doppelrohr) | Sawtooth durch schmale, nasale Formanten | Lorekeeper (H), Skelette, generische NPCs |
| **E** | Singende Säge / Theremin | Sine, weites, langsames Vibrato, lange Portamenti | Vampir (H), später Geister und Halloween-Zone (V-469) |
| **F** | Chip-Synth | Pulse/Square, ggf. leichter Bitcrush bzw. Ringmodulation | Bots (H, 6 Farbvarianten nach V-463) |

### B3.2 Rollen-Tabelle

| NPC-Typ | Darsteller | Grundton | Formant-Skala | Vibrato / Rauheit | Tempo | Artikulation | Heat-Gain | Tick („Catchphrase“) | Haltung (Baker-Adjektive) |
|---|---|---|---|---|---|---|---|---|---|
| **FrizzleBob** | A Horn | 110 Hz (A2) [P9] | 1,00 | warm 5 Hz, leicht; Wah 0,35 [P9] | 1,0 mit Swing | legato, Glissando | 1,2 | Wah-Schleifer von unten in den ersten Ton | gerissen, Marktschreier |
| Spielzeugsoldaten | A Signalhorn | 165 Hz (E3) | 1,15 | keins | 1,1, streng im Raster | staccato, Töne auf die Naturtonreihe gerastert | 0,6 | Quart-Auftakt wie ein Signal | steif, eifrig |
| Spielzeugsoldaten Duo B (V-466) | A, `variantOf` | 147 Hz (D3) | 1,15 | keins | 1,1 | staccato | 0,6 | gleicher Tick, eine Quinte tiefer | stur |
| **Dory** | B Flöte | 220 Hz (A3) [P9] | 1,00 | warm 5,5 Hz | 1,05 | legato, Atem [P9] | 1,0 | kleiner Triller-Vorschlag bei Fragen | neugierig, flink |
| Hexe A (V-467) | B Okarina | 175 Hz (F3) | 0,90, nasaler | weit 6,5 Hz, tief | 0,9 | lange Portamenti | 1,3 | Kicher-Glissando (schnelle Abwärts-Triole) am Satzende | verschlagen |
| Hexe B (`variantOf` A) | B Okarina | 196 Hz (G3) | 0,90 | weit 7 Hz | 0,95 | portato | 1,3 | gleiches Kichern, Aufwärts-Triole | zänkisch |
| **Hunky** | C Tuba | 73,4 Hz (D2) [P9] | 1,00 | warm 4 Hz | 0,9 | weich legato | 0,8 | tiefer Vorschlag von unten | gutmütig, schwer |
| Orks | C Tuba „Growl“ | 61,7 Hz (B1), Obertöne betont | 0,85 | Rauheit 25–30 Hz statt Vibrato | 0,85 | marcato, harte Attacken | 1,3 | Knurr-Einsatz (Rauschstoß + Pitch-Drop), passend zu V-523 „Ork-Grollen als Tuba“ | grob, laut |
| Monstrosity | C Tuba + Suboktave | 55 Hz (A1) + Subharmonische, Größe über Formanten | 0,75 | sehr langsam 2 Hz, tief | 0,6 | lange Attacke, Töne überlappen | 0,7 | hörbarer Atemstoß vor der Zeile | massig, träge |
| **Lorekeeper** | D Fagott | 98 Hz (G2) | 0,95 | warm 4,5 Hz | 0,75 | legato, Fermate auf dem letzten Wort | 0,7 | Doppelschlag-Ornament am Zeilenanfang | weise, umständlich |
| Skelette | D Fagott secco | 196 Hz (G3) | 1,15 | keins | 1,25 | staccato + Klapper-Transient ≤ 20 ms (Holz/Knochen-Rauschen) | 1,1 | Zähneklapper-Triller | nervös, albern |
| **Vampir** | E Säge/Theremin | 147 Hz (D3) | 1,00 | weit 6 Hz, ±60 Cent | 0,8 | übertriebenes Legato, lange Portamenti | 1,0 | Seufzer-Abwärtsglissando | eitel, theatralisch |
| **Bots** (6 Farben) | F Chip | 131 Hz (C3); Farbvarianten über Pulsbreite (12,5 / 25 / 50 %) × 2 Lagen (C3 / G3) | 1,00 fest | keins (oder Ringmodulation 12 Hz) | 1,0 exakt | kurze Glides ≤ 10 ms, fast gestuft | 0,5 | Zwei-Ton-„Piep“ zu Beginn | mechanisch, beflissen |
| Generische NPCs | A, B oder D, deterministisch aus der NPC-ID | Darsteller-Grundton ± {4, 5} HT, nie auf der Lage einer benannten Rolle | 0,9–1,1 | Klasse aus dem Seed | 0,9–1,1 | aus dem Seed | 0,8–1,0 | **keiner** (Ticks nur für benannte Figuren) | – |

**Anmerkungen**

- **Bots:** Fast gestufte Tonhöhe weicht von R1-01 ab („Glissando, ohne harte Schnitte“). Das ist **Δ-Frage F3**. Alternative: normales Glissando, und der Roboter-Charakter kommt nur aus Wellenform und Ringmodulation.
- **Generische NPCs:** Die Varianten werden aus der NPC-ID gewürfelt und sind damit reproduzierbar (im Geist von R1-04). Gleicher NPC = gleiche Stimme.
- **FrizzleBob, Dory, Hunky** bleiben exakt wie abgenommen (P9). Neu sind nur die Felder Tick, Tempo und Heat-Gain, und auch die erst nach Georgs Freigabe.

## B4 · Echte Stimmen: Erzähler, Promo, Performance, eventuell Barks

### B4.1 ElevenLabs-Werkzeuge

| Werkzeug | Was es kann | Kosten | Status |
|---|---|---|---|
| **Voice Design** | Neue Stimme aus einer Textbeschreibung (20–1.000 Zeichen). Liefert 3 Vorschauen; Modelle `eleven_multilingual_ttv_v2` und `eleven_ttv_v3`, laut Übersicht empfohlen Eleven v4 (dann „less performative“). Ausdrücklich auch für Figuren in Spielen gedacht (Character Voice Design: „elves to elder gods“) ([API Design](https://elevenlabs.io/docs/api-reference/text-to-voice/design), [Voices](https://elevenlabs.io/docs/overview/capabilities/voices), [Blog v3](https://elevenlabs.io/blog/voice-design-v3)) | Laut Blog bezahlt man nur die Zeichen des Vorschau-Texts | [B] |
| **Voice Remix** | Verändert eine eigene, designte oder freigegebene Stimme per Prompt (Geschlecht, Akzent, Stil, Tempo, Audioqualität) in 4 Stärken: low, medium, high, max. Ergebnis ist eine neue Variante, das Original bleibt unverändert, Remixe lassen sich weiter remixen ([Voice Remixing](https://elevenlabs.io/docs/capabilities/voice-remixing)) | nach Länge des Testskripts | [B] |
| **Voice Changer** (Speech-to-Speech) | Aus einer gesprochenen Aufnahme wird eine Zielstimme. Flüstern, Lachen und Emotion bleiben erhalten; Segmente bis 5 Minuten; Modell `eleven_multilingual_sts_v2` ([Voice Changer](https://elevenlabs.io/docs/capabilities/voice-changer)) | **1.000 Credits / Min** ([Pricing](https://elevenlabs.io/pricing)) | [B] |
| **Text to Dialogue** | Dialog mit mehreren Sprechern in einem Durchgang, eine `voice_id` je Zeile. Audio-Tags als freie Regieanweisungen wie `[whispering]` oder `[auctioneer]`; ≤ 2.000 Zeichen je Anfrage; Eleven v4 empfohlen, v3 unterstützt; Ergebnis nicht deterministisch (Seed hilft) ([Text to Dialogue](https://elevenlabs.io/docs/capabilities/text-to-dialogue)) | wie TTS | [B] |
| **TTS** | Multilingual v2: 1 Credit pro Zeichen; Flash/Turbo 0,5–1 ([Pricing](https://elevenlabs.io/pricing)) | Plan-Tabelle: 10.000 Credits ≈ 10 Min, also **≈ 1.000 Credits pro Minute** | [B] / Umrechnung [E] |
| **Voice Library** | Über 10.000 Community-Stimmen. Teilen lassen sich nur Professional Clones. Die Bedingungen setzt der Besitzer (Notice Period, ggf. Zeichen-Multiplikator); für Free-Konten nicht per API ([Voice Library](https://elevenlabs.io/docs/product-guides/voices/voice-library)). Laut ElevenLabs-Voice-Guide haben alle Library-Stimmen eine freie kommerzielle Lizenz; diese Seite habe ich nur über die Suche gesehen, nicht direkt geprüft | – | [B] / teilweise ungeprüft |
| Dubbing | automatisch 2.000 Credits / Min mit Wasserzeichen bzw. 3.000 ohne; Studio 5.000 bzw. 10.000 ([Pricing](https://elevenlabs.io/pricing)) | – | [B] |
| Sound Effects / Music | 200 Credits je SFX-Generierung; Musik 900 Credits / Min | – | [B] |

**Lizenz ElevenLabs** [B] ([Hilfe-Center](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform/llms.txt))

- Alle bezahlten Pläne enthalten eine kommerzielle Lizenz, **außer für Beta-Dienste**.
- Inhalte aus einem bezahlten Abo sind dauerhaft kommerziell nutzbar.
- Inhalte aus Free (vorher oder nachher) dürfen nicht kommerziell genutzt werden und brauchen eine Namensnennung.
- Spielspezifische Regeln habe ich nicht gefunden (**nicht belegt**).
- **[E]** Vor der Produktion prüfen, ob ein genutztes Modell oder Feature als Beta markiert ist. Bei v4 und den `audio_effects` von Text to Dialogue ist das offen.

**Guthaben:** Laut V-523 hatte Georg ≈ 82.000 Credits, davon sind ≈ 10.500 verbraucht. Rest **≈ 71.000** [E], gerechnet, nicht im Konto geprüft. Das reicht für ≈ 70 Minuten TTS oder Voice Changer. Welcher Plan dahintersteht: **nicht belegt**.

**HeyGen-Stimmen:** Voice Design (bis 3 Treffer), Clone und TTS sind vorhanden (§A1.1). Für KFB bringen sie keinen Vorteil, weil ElevenLabs direkt verfügbar und feiner steuerbar ist [E]. Sinnvoll sind sie nur, wenn ein HeyGen-Avatar ohnehin eine Stimme braucht. Auch dann besser: ElevenLabs-Audio hochladen.

### B4.2 Viele Figuren aus wenigen Basisstimmen [E]

1. **Drei Basis-„Sprecher“ per Voice Design** als eigene Stimmen, nicht aus der Library. So entfällt die Abhängigkeit von Notice Periods und Besitzer-Bedingungen:
   - (a) **FrizzleBob-Erzähler** (rauer Marktschreier, warm);
   - (b) eine **helle, schnelle** Stimme (Dory-Register, Promo-Sidekick);
   - (c) eine **tiefe, gemütliche** Stimme (Hunky, Lorekeeper-Erzähler).
2. **Je Basis 2–3 Remixe** in Stärke low bis medium, mit klaren Adjektiven nach Baker: älter und brüchiger, gehetzt, gönnerhaft. Das ergibt **9–12 Figuren** aus 3 Basen, die als Familie zusammenklingen. Das ist die Simpsons-Logik: wenige Sprecher, viele Rollen.
3. **Georg als Darsteller (Mel-Blanc-Weg):** Georg spricht Zeilen mit Timing, Witz und Emotion selbst ein. Der Voice Changer legt die Ziel-Figur darüber, für 1.000 Credits pro Minute. So bleibt die menschliche Performance erhalten, und eine Person spielt alle Figuren.
4. **Szenen mit mehreren Figuren** (Stand-up, Promo-Sketch) über Text to Dialogue, mit Audio-Tags für Lachen, Flüstern und Ausrufer. Pro Abschnitt höchstens 2.000 Zeichen.
5. **Konsistenz:** Jede Figur bekommt eine Stimm-Karte mit `voice_id`, Remix-Prompt, Seed, Referenzzeile und Einstellungen. Alles wird vorab gerendert und archiviert (V-285: keine Laufzeit-TTS).
6. **Non-verbale Barks** wie Lachen, Ächzen oder Schreck sind Klang ohne Sprache. Sie stehen aber in Spannung zu V-492 („keine Sprach-Aufnahmen“). Standard bleiben die Instrument-Einwürfe aus V-523. Menschliche Barks nur, wenn Georg sie ausdrücklich will (Frage F4).

## B5 · Empfehlung und Pilot

### B5.1 Prioritäten [E]

| Prio | Maßnahme | Kosten |
|---|---|---|
| 1 | **Instrument-Besetzung** als Voice-JSON-Presets in Probe R10 (WS0). Ein Instrument-Darsteller spielt mehrere Rollen; dazu Datenfelder aus §B2.1 (additiv) | 0 Credits |
| 2 | **HyperFrames-Vorlage für Karten-Promos und Billboards** (nach Georgs Installations-Freigabe) | 0 Credits |
| 3 | **ElevenLabs-Erzähler:** 3 Basisstimmen + Remixe für Promo und Narration | wenige Tsd. Credits |
| 4 | **HeyGen-Test** (Hypernormalisation-Sprecher, FrizzleBob als Foto-Avatar) über MCP, nach Georgs OAuth | ≈ 25–40 HeyGen-Credits |
| 5 | DE/ES für Promos: direkt neu sprechen (ElevenLabs) statt im Nachgang zu übersetzen; HeyGen Translate nur für fertige Avatar-Clips | — |
| – | **Nicht machen:** VFX über HeyGen, Musikvideos mit mehreren Szenen über Seedance/Veo, Kartenclips über Video Agent | — |

### B5.2 Pilot „Ein Instrument, viele Rollen“ (klein, billig, messbar)

- **Umfang:** 2 Instrument-Darsteller × 3 Rollen:
  - **C Tuba:** Hunky, Ork, Monstrosity;
  - **D Fagott:** Lorekeeper, Skelett, ein generischer NPC.
- **Material:** 3 feste Triplet-Zeilen (Aussage, Frage, Ausruf), je in calm und debate, gerendert in Probe R10. Kein neues Werkzeug.
- **Kosten:** 0 Credits, Aufwand WS0 etwa ein halber Tag [E].
- **Messung** mit Georg plus 1–2 weiteren Hörern, blind:
  1. **Gleich oder verschieden?** Paare derselben Zeile; Ziel ≥ 90 % richtig.
  2. **Zuordnung:** Hörprobe zu Figurenbild (3 zur Wahl je Darsteller); Ziel ≥ 80 % richtig.
  3. **Passt die Figur?** Note 1–5; Ziel ≥ 4.
  4. **Nervig nach 10 Zeilen?** Ja/Nein, die Lehre aus V-497.
- **Ergebnis:** Faustregel aus §B2.2 bestätigt oder korrigiert. Danach folgt die volle Besetzung.

### B5.3 Pilot HeyGen (parallel, nach MCP-Freigabe durch Georg)

| Schritt | Inhalt | Credits | Bewertung |
|---|---|---|---|
| P-H1 | **Hypernormalisation-Billboard:** synthetischer Prompt-Avatar „Nachrichtensprecher“, 2 × 20 s, Avatar IV, eigene KFB-Texte, ElevenLabs-Stimme als Audio | ≈ 11 bei 16 / Min | Funktioniert der Stilbruch auf dem Billboard? Mit oder ohne Ton (Frage zu A3) |
| P-H2 | **FrizzleBob-Foto-Avatar:** 1 frontales Ton-Render, 15 s Erzählung, `expressiveness: low` | ≈ 4 | über die einheitliche Proof-Stufe; Ton-Oberfläche, Mund, Augen; FAIL bei sichtbarer Verschmierung |
| P-H3 | **HyperFrames-Kartenclip:** 1 Karte, 10 s, mit Reward-Sounds aus V-523 | 0 | |

- **Messung je Schritt:** Credit-Stand vorher und nachher (`get_current_user`), Wartezeit, PASS/FAIL nach Proof-Stufe.
- **Abbruch:** Fällt P-H2 durch, keine weiteren Figuren-Uploads (Lizenz §A4).

---

## C · Fragen an Georg

1. **F1** Instrument-Zuordnung angleichen? Die Melodie-Stimmen sind Horn, Flöte und Tuba (V-497), die Gefühls-Einwürfe in V-523 laufen noch auf Posaune, Okarina und Fagott/Kazoo.
2. **F2** Dürfen benannte Figuren einen kurzen **Signatur-Tick** haben, also ein Ornament ohne Wort? Das wäre eine Erweiterung von „ein Ton je Wort“ (V-508 Punkt 1).
3. **F3** Bots mit fast gestufter Tonhöhe (Ausnahme zu R1-01) oder normales Glissando?
4. **F4** Non-verbale **menschliche** Barks (Lachen, Ächzen) erlaubt, oder nur Instrument-Einwürfe?
5. **F5** Hat das Hypernormalisation-Billboard **Ton**? (i) stumm mit Laufschrift, (ii) Melodie, (iii) Sprache nur in der Promo.
6. **F6** Welcher **HeyGen-Plan** und wie viele Credits? Darf WS0 nach deiner OAuth-Freigabe die 3 Pilotschritte fahren, und darf dabei **ein** FrizzleBob-Render hochgeladen werden (HeyGen-Lizenz inkl. Training)?
7. **F7** HyperFrames installieren (Claude-Code-Plugin, Node 22 + FFmpeg)?

---

## Quellen

**HeyGen**

- MCP-Übersicht: https://developers.heygen.com/mcp/overview
- Claude-Code-Setup: https://developers.heygen.com/mcp/claude-code.md
- Skills: https://developers.heygen.com/skills/overview · https://developers.heygen.com/skills/heygen-video · https://developers.heygen.com/skills/install.md · https://github.com/heygen-com/skills
- Doku-Index: https://heygen-1fa696a7.mintlify.site/llms.txt
- Engines: https://developers.heygen.com/models.md · https://developers.heygen.com/avatar-iv.md
- Avatare: https://developers.heygen.com/photo-avatar.md · https://developers.heygen.com/docs/avatar-from-photo.md · https://developers.heygen.com/docs/avatar-from-prompt.md · https://developers.heygen.com/generate-avatar-video.md
- Templates, Übersetzung, Lip-Sync: https://developers.heygen.com/templates.md · https://developers.heygen.com/docs/video-translate.md · https://developers.heygen.com/lipsync-speed.md
- Stimmen und Limits: https://developers.heygen.com/docs/voices/design-voices.md · https://developers.heygen.com/docs/usage-limits.md
- Credits und Pläne: https://help.heygen.com/en/articles/15126059 · https://help.heygen.com/en/articles/15125761-heygen-credit-based-pricing-explained · https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained · https://www.heygen.com/pricing
- Avatar IV (Hilfe-Center): https://help.heygen.com/en/articles/11269603-new-feature-alert-heygen-avatar-iv-is-here
- Singen: https://www.heygen.com/tool/make-photo-sing · https://artlist.io/ai/models/heygen-ai (Drittquelle)
- Recht: https://www.heygen.com/terms · https://www.heygen.com/faq
- HyperFrames: https://hyperframes.heygen.com/ · https://hyperframes.heygen.com/quickstart · https://github.com/heygen-com/hyperframes

**ElevenLabs**

- Preise: https://elevenlabs.io/pricing
- Voice Design: https://elevenlabs.io/docs/api-reference/text-to-voice/design · https://elevenlabs.io/blog/voice-design-v3
- Stimmen und Library: https://elevenlabs.io/docs/overview/capabilities/voices · https://elevenlabs.io/docs/product-guides/voices/voice-library
- Werkzeuge: https://elevenlabs.io/docs/capabilities/voice-remixing · https://elevenlabs.io/docs/capabilities/voice-changer · https://elevenlabs.io/docs/capabilities/text-to-dialogue
- Recht: https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform/llms.txt

**Synchron und Psychoakustik**

- Mel Blanc: https://metv.com/stories/mel-blanc-on-sylvester · https://looneytunes.fandom.com/wiki/Daffy_Duck
- Dee Bradley Baker: https://www.awn.com/news/dee-bradley-baker-discusses-voicing-clones-star-wars-clone-wars · https://en.wikipedia.org/wiki/Captain_Rex
- Simpsons-Besetzung: https://whatculture.com/tv/top-10-secondary-simpsons-characters-voiced-by-hank-azaria · https://baynews9.com/fl/tampa/news/2015/5/14/harry_shearer_simpsons · https://www.huffingtonpost.ca/2015/01/23/simpsons-infographic-voice-actors_n_6528346.html
- Sprechtechnik: https://maryrobinettekowal.com/journal/character-voices/ · https://violetrecording.com/how-to-do-character-voices-for-voice-acting/
- Smith & Patterson 2005: https://www.pdn.cam.ac.uk/system/files/documents/SPjasa05.pdf
- van Dinther & Patterson 2006: https://pmc.ncbi.nlm.nih.gov/articles/PMC2821800 (Volltext hinter Captcha, nur Abstract-Ebene)

**Steam**

- https://www.videogameschronicle.com/news/steam-pages-will-now-disclose-which-games-use-ai-generated-content/ · https://80.lv/articles/steam-introduces-new-rules-for-games-with-generative-ai/
