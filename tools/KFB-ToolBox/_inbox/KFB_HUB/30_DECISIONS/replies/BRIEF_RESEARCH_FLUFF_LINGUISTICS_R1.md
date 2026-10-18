# Briefing · Deep Research: Fluff-Linguistik, (De)Kodierung, Sprachmelodie (R1 · 18.10.2026)

Für: Deep-Research-Lauf (WS0-Agent läuft bereits; parallel/alternativ WSA bzw. ChatGPT Deep Research).
Rückgabe: ein deutscher Bericht `RESEARCH_FLUFF_LINGUISTICS_R1.md`, Quellen als Links, Belegtes klar von Einschätzung getrennt, nichts erfinden („nicht belegt“).

## Unser Konzept (verbindlich, Register V-486, V-492, V-497, V-500, V-505, V-506)
- **Melodie statt Sprache:** NPCs sprechen keine echte Sprache. Jede Figur „singt“ ihre Zeile als eine durchgehende Melodie auf einer eigenen instrumentartigen Stimme (Web Audio: Oszillator + Formantfilter). Jedes Wort = festes Motiv (gleiches Wort = gleiche Melodie); Gefühl über Tempo, Lage, Tonleiter.
  - Prosodie: Abfall über den Satzteil, Akzente auf Inhaltswörtern, Funktionswörter tief und kurz, Anstieg vor dem Komma, Fall am Satzende, Fragen steigen.
  - Keine Silben, kein TTS (klang wie kaputte Sprachausgabe).
- **Die Sprechblase trägt die Bedeutung:** eine kartenbasierte Triplet-Zeile aus dem Kartenspiel, je Wort in drei Stufen dekodiert:
  1. Comic-Glyphen im PottyMouth-Stil, 1–3 je Wort, auf Wortbreite skaliert, einheitlicher Zeilenabstand;
  2. Fluff-Wörter nach Schlumpf-Logik je Wortart (fluff, fluffs, fluffed, fluffing, fluffy, fluffily, fluffery); Satzfluss-Wörter (because, until, you, the …) bleiben lesbar;
  3. der echte Text.
- **Fortschritt** über gesammelte Karten bzw. Begegnungen; ein vollständiges Deck dekodiert, dann spielt der echte Song.
- Referenz-Probe: https://claude.ai/artifact/Ms1RhWbn4Tu8gU9RjnQXFR (R9.1), Datei `KFB_HUB/40_AUDIO/kfb_language_r1/probe_r9.html`.

## Forschungsfragen (alle beantworten, in die Tiefe)
1. **WoW:** Wie hat World of Warcraft Sprache, Stimme, Audio und Dekodierung von Roboter- bzw. Konstrukt-Wesen umgesetzt?
   - Hauptkandidat: Shadowlands 9.2 Zereth Mortis, Automa/Progenitor-Sprache und das Forschungssystem „Cypher of the First Ones“, bei dem NPC-Text und Dialoge schrittweise lesbar werden.
   - Zusätzlich prüfen: Mechagon (BfA 8.2), Titan-Konstrukte bzw. Earthen in The War Within, Undermine falls relevant.
   - Details: Wie sah der verschlüsselte Text aus (Glyphen? Wortteile?), welche Fortschrittsstufen gab es, wie entstand die Stimme (Bearbeitung, Fantasiesprache, prozedural?), wie haben Spieler es aufgenommen?
2. **Fantasie- und Kauderwelsch-Sprache in Spielen:**
   - Simlish, Animalese, Text-Blips (Banjo-Kazooie, Undertale, Celeste), Hollow Knight, Sable, Okami, Kirby/Yoshi, Psychonauts, Ori;
   - Journey (Gesang als Kommunikation), Tunic (Schrift, die Spieler entschlüsseln), Chants of Sennaar (Sprachentschlüsselung als Kern-Gameplay), Heaven's Vault, Fez, Return of the Obra Dinn, Outer Wilds (Nomai), Lingo, Hylianisch;
   - die WoW-Rassensprachen (Wortersetzung Gemeinsprache ↔ Orcisch).
   - Je Beispiel: Technik (prozedural oder aufgenommen, Silbenbank oder Melodie), was gut und was schlecht funktioniert, was wir daraus lernen.
3. **Sprachmelodie ohne Worte:**
   - Figuren und Sendungen: R2-D2 (Ben Burtt), BB-8, WALL-E, Pingu, Minions, Teletubbies, Clangers (Pfeifsprache, Oliver Postgate), Schlümpfe-Audio, die Erwachsenen bei den Peanuts („wah wah“ per Posaune);
   - echte Pfeif- und Trommelsprachen, z. B. Silbo Gomero;
   - Intonationsforschung (Bolinger, 't Hart), Emotion über die Tonhöhenkurve (Scherer, Juslin & Laukka), Fujisaki-Modell, Abfall der Tonhöhe über den Satz, ToBI.
   - Was lässt sich technisch übernehmen?
4. **Schlumpf-Linguistik:**
   - Wie „schlumpf“ als Ersatzwort funktioniert: flexibel über Wortarten, Komposita, der Nord-Süd-Streit aus „Schtroumpf vert et vert Schtroumpf“, Analysen als Platzhalter-Wort und zu semantischer Ausbleichung.
   - Verwandte Platzhalter: Dingsbums, thingamajig, sowie Ersatz-Flüche aus Serien wie frak, smeg, frell.
   - Folgerungen für unser Lexikon: welche Wortarten, Kompositaregel (bloodbath → fluffbath?), wann bleibt es lesbar, wann kippt es in Unsinn?
5. **Grawlixes und Comic-Glyphen:**
   - Mort Walker, „Lexicon of Comicana“ (grawlix, jarns, quimps, nittles, symbolia), Blambot-Schriften;
   - Typografie von Glyphenfolgen: muss die Glyphenzahl bzw. -länge dem verdeckten Wort folgen?
6. **Fortschreitende Dekodierung als Spielmechanik:**
   - Lernen durch Wiederholung, schrittweise Aufdeck-Muster in der Oberfläche, Kryptogramm-Gefühl, Sprache als Belohnung.
   - Risiken: Frust, Lese-Ermüdung, Barrierefreiheit (Screenreader, Legasthenie, Farbe).
   - Wie führen Tunic, Chants of Sennaar und Heaven's Vault neue Spieler ein?
7. **Weitere relevante Methoden:**
   - Klangerzeugung im Browser: Tone.js, animalese.js-Varianten, Formant- und Klatt-Synthese, Vocoder/Talkbox, tonhöhengeführtes Singen;
   - Lippensynchronität aus Motiven (Mundformen ohne Phoneme);
   - Vorteil bei der Übersetzung in andere Sprachen;
   - Kosten und Latenz im Vergleich zu TTS.

## Gliederung der Rückgabe
- 0 Kurzfassung (10 Kernbefunde)
- 1–7 je Frage
- 8 „Was wir übernehmen sollten“ (priorisiert, je Bezug zu unserer Schicht: Melodie, Blasen-Glyphen, Fluff-Lexikon, Dekodier-Fortschritt)
- 9 „Was wir vermeiden sollten“
- 10 offene Fragen an Georg
- Quellenliste
