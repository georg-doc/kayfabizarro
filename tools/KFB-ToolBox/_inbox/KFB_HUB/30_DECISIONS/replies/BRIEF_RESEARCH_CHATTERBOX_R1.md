# BRIEF · Recherche für die Chatterbox-Stimmen · R1 · 2026-10-22 · WS0 → Web-Chat bzw. Perplexity
**Grundlage:** `replies/CHATTERBOX_VOICE_KONZEPT_R1.md` (R1.3). Bitte vorher §0–§23 lesen.
**Ziel:** belastbare Regeln und Beispiele, mit denen WS0 und WS-Audio die Stimm-Engine bauen. Keine allgemeinen Essays.

**Tier 0**
1. Je Thema **konkrete, übertragbare Regeln**: was genau, mit Zahlen wo möglich (Tonumfang, Tempo, Intervalle, Effektwerte).
2. Je Regel **ein bis zwei Hörbeispiele** (Link, Zeitstempel) und eine Zeile: Wie übertragen wir das auf KFB?
3. **Abgabe** als Markdown `RESEARCH_CHATTERBOX_R1.md`, gegliedert nach den Themen unten, je Thema höchstens eine Seite.

## Themen
1. **Cartoon Voice Acting:** Wie variieren Sprecher mehrerer Figuren (z. B. Simpsons: Castellaneta, Azaria, Cartwright) ihre Stimmen?
   - Tonlage, Stimmsitz, Rauheit, Tempo, Akzent, Catchphrase.
   - Daraus 8–10 Modulationsregeln für „ein Instrument spielt mehrere Rollen“.
2. **Fantasiesprachen in Spielen:** Animal Crossing (Animalese, Bebebese), Banjo-Kazooie, Undertale (Text-Blips je Figur), Die Sims (Simlish), Celeste, Okami, Kirby.
   - Was macht sie angenehm statt nervig (Länge, Tonhöhe, Wiederholung, Mischung)?
   - Wie unterscheiden sich Figuren?
3. **Kreaturen- bzw. Figuren-Stimmdesign in Film und Spiel:** Ork, Dämon („Mordor“), Geist, Skelett, Alien, Roboter, Kind bzw. Teenager.
   - Effektketten mit typischen Werten: Pitch und Formant, Hall-Art und -Länge, Sättigung, Filter, Ringmodulation, Chorus.
4. **Oper:** Stimmfach als Charakter-Typologie, Leitmotiv, Ensemble-Nummern, Rezitativ und Arie.
   - Beispiele aus Zauberflöte und Peter und der Wolf (Instrument je Figur).
5. **Musical:** Sprechgesang (Patter Song, gesprochene Lieder), „I want“-Song, Reprise, Ensemble-Nummer. Regeln für den Übergang von Sprechen zu Singen.
6. **Elektronische Musik mit Sprechcharakter:** Talkbox (E-Funk), Vocoder, TB-303/Acid, Portamento-Leads, Ondes Martenot, Theremin.
   - Dazu die Kölner Linie: WDR-Studio für elektronische Musik, Can bzw. Holger Czukay, Kölner Minimal-Techno.
   - Bitte klären, welche Kölner Quelle mit „Ken“ gemeint sein könnte.
   - House, Techno bzw. Minimal, E-Funk und Ambient als Stil-Register.
7. **Bach und Fuge als Regelwerk:** Thema, Antwort, Kontrasubjekt, Umkehrung, Krebs, Augmentation bzw. Diminution, Engführung, Modulation, Kanon, Variation (Goldberg).
   - Formulieren als Operationen auf Motiven, die eine Engine deterministisch ausführen kann, mit Beispiel-Notation.
8. **Emotion und Musik:** gesicherte Befunde zur Zuordnung Emotion → Modus bzw. Intervall, Tempo, Kontur, Lautstärke (z. B. Juslin & Laukka). Prüfen bzw. korrigieren der Tabelle §3.
9. **Suno für Solo-Passagen:** Prompt-Muster für einstimmige Solo-Stellen je Instrument, Ruf und Antwort, sparsame Arrangements.
   - Wie gut trennen die Stems je Instrument?
   - Hinweis: Eine WS0-Pilot-Ernte aus vorhandenen Stems ergab nur 5–15 % einstimmiges Material (`40_AUDIO/chatterbox_r1/PILOT_ERNTE_R1.md`).

**Grenzen:** nur Recherche, keine Erzeugung und keine Downloads. Quellen nennen.
