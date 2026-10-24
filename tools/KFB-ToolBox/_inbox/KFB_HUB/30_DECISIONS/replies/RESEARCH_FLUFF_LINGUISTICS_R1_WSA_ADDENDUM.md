# Research Fluff-Linguistik R1 · WSA Independent Addendum (18.10.2026)

**Status: RESEARCH / SOURCE CORRECTION CANDIDATE · nicht implementiert, kein Canon, kein Merge.**

## Anlass und Besitzstand

WS0 hat den **vollständigen** beauftragten Bericht bereits auf dem aktuellen Register-Branch geschrieben: [RESEARCH_FLUFF_LINGUISTICS_R1.md](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/RESEARCH_FLUFF_LINGUISTICS_R1.md), Git-Blob `d4f005c1c6622e30cb77b58718c311ad49eddbe3`, **66.955 Zeichen**, 0–10 einschließlich Quellen. Beim ersten Versuch, diesen Namen erneut anzulegen, meldete die GitHub-API korrekt **422: sha wasn't supplied** (Datei existiert). Kein fremder Report wurde überschrieben. Die vorliegende Ergänzung ist ein getrenntes **Peer-Review/Source-Diff**, kein Ersatz für die aktuelle WS0-Arbeit. Bestehende KFB-Audio-, Karten-, ChatterBox- und Progression-Owner bleiben unverändert. Quellenklasse: **[P]** Entwickler-/Produktion-/Norm-Original, **[N]** wörtlich geführtes Interview, **[C]** Community-/Sekundärrekonstruktion, **[E]** KFB-Einschätzung.

Die unabhängige WSA-Recherche deckte alle sieben Forschungsbereiche ab. Von besonderem Mehrwert gegenüber dem bereits umfassenden WS0-Bericht sind folgende **nachweisbare, eng begrenzte Ergänzungen**:

## 1. WoW: Entwickler bestätigt exakt die Beibehaltung des fremden Audios

**[P/N – in bestehendem Bericht ergänzen:]** Im Entwicklerinterview [„Shaping Creation From Death – How The WoW Developers Crafted Eternity’s End“](https://www.well-played.com.au/shaping-creation-from-death-how-the-wow-developers-crafted-eternitys-end/) erklärt das Team ausdrücklich, dass die Spieler die Gefühlslage der Automa **aus den Klängen erraten können**, bevor sie deren Sprache verstehen; später werden die **sichtbaren Symbole** nach und nach verständlich, **die musikalische Fremdsprache bleibt als Audio unverändert**. Diese spezielle Trennung ist im bestehenden WS0-Bericht nicht in dieser Ausführlichkeit belegt. Offiziell bestätigt auch [Blizzard, Zereth Mortis (9.2)](https://worldofwarcraft.blizzard.com/en-us/news/23762274) die musikalische Unverständlichkeit und das Cypher-Forschungssystem.

**KFB [E]:** Das ist der präziseste direkte Präzedenzfall: **Bild/Text dekodiert; Audiomelodie bleibt fremd**. Keine implizite Umschaltung auf verständliches TTS nach einer Klartextfreischaltung. Wichtig ist, dass es sich **nicht** um eine belegte dreistufige R9.1-Implementierung von Blizzard handelt (keine nachgewiesene Smurf-Stufe und keine Wortbreitenregeln).

**[C] Spielerreaktion ergänzen, aber nicht repräsentativ:** [2022 Reddit Cypher](https://www.reddit.com/r/wow/comments/tz7x1n) und [2022 Zereth Mortis](https://www.reddit.com/r/wow/comments/tbxkol) zeigen in einzelnen Beiträgen sowohl Wertschätzung der Zone/Pocopoc als auch Ärger über Research-Timegating und teilweise fehlenden Spielnutzen. Kein aggregierter Zufriedenheitswert, keine objektive „Spieler hassten das“-Aussage. Die große Differenz zu KFB: Fortschritt an **erworbenes Wissen/Karten** binden, nicht reale Wartezeiten.

## 2. Tunic: Wichtiger bisher fehlender Sonderfall „Tuneic“

**[P]** Audio-Designer **Kevin Regamey** beschreibt selbst eine **versteckte musikalische Chiffre** in den Soundeffekten/der Musik von *Tunic* (über die bekannte visuelle Trunic-Schrift hinaus): [Originaler Entwicklerthread: Tunic Audio Secrets](https://threadreaderapp.com/scrolly/1583200241222053889). Sein Konzept war eine zunächst unverständliche, aber konsistente Audio-Bedeutungsebene. **[C]** Die [Tunic-Wiki-Rekonstruktion „Tuneic“](https://tunic.wiki/books/secrets/page/tuneic) erklärt die Zuordnung von **pentatonischen Arpeggios zu englischen Phonemen** und die Verbindung zum Trunic-Rätsel. Die Entwicklerabsicht ist Quelle P, die konkrete vollständig rekonstruierte Zuordnung Quelle C; diese Ebenen nicht vermischen.

**Im bestehenden R1-Report:** „Tunic“ kommt mehrfach vor, „Tuneic“ jedoch **0-mal**. Hier lohnt ein **eigener Ergänzungsabsatz** unmittelbar zu Abschnitt 2.2.

**KFB [E]:** Direkter Vorläufer für stabile Audio-Signale mit „verstecktem Sinn“. Aber KFBs verbindlicher Stand „**ein Wort → stabiles Motiv; melodischer Satz ohne Silben**“ ist **nicht identisch** mit phonemischer Tuneic-Kodierung. Ein echtes optionales Musikkryptogramm wäre **P2 Design**, keine stillschweigend neue Pflichtmechanik oder separate Runtime.

## 3. Banjo-Kazooie: Produktionsverfahren ist besser dokumentiert als im R1-Report

**[N, Originalaussage Grant Kirkhope]** [Game Informer Interview](https://gameinformer.com/b/features/archive/2017/04/11/from-goldeneye-to-yooka-laylee--composer-grant-kirkhope-reflects-on-his-storied-career): Kirkhope ließ **Einzelsilben** aufnehmen und wählte Sample + Tonhöhe pro Abspielereignis **zufallsbasiert innerhalb definierter Bereiche**. Das präzisiert die aktuelle WS0-R1-Matrix, die „Produktionstechnik: nicht belegt“ enthält.

**KFB [E]:** Das Verfahren steht ausdrücklich **gegen** das Ziel „ein durchgehender melodischer Satz ohne hörbare Silbenschnitte“. Als Negativdonor für zu häufige Onsets wichtig, aber kein zu übernehmender Kernalgorithmus.

## 4. Clangers / BB-8: schriftliche Bedeutung vor unverständlichem Output

**[N/Creator]** Oliver Postgate bestätigt englisches **Drehbuch mit Swanee-Pfeifen-Ausführung**, nicht Sprachdatenbank: [The Guardian: Oliver Postgate](https://www.theguardian.com/media/2008/dec/09/oliver-postgate-bagpuss-clangers-ivor-the-engine). Bei **BB-8** beschreibt Ben Schwartz bereits **ausformulierte englische Dialog-Performances** als emotionales und zeitliches Produktionsgerüst, bevor die Töne zu Droid-Lauten geformt wurden: [GQ: Ben Schwartz](https://www.gq.com/story/how-ben-schwartz-became-the-voice-of-bb-8); [Sound-Designer-Gespräch zum Talkbox-Verfahren](https://archive.nerdist.com/kylo-rens-signature-force-sound-was-a-purring-kitty-say-sound-designers/?list=trending).

**KFB [E]:** Zuerst die **fertige gedruckte Kartenzeile + Performer-Intention** als SSOT, danach Audio-Satzgestus generieren. Nicht „erst zufällige Sounds, dazu improvisierte Dialoge“. Das stützt den aktuellen kartenbasierten Triplet-Vertrag.

## 5. Fluff/POS: Wortart kann nicht bloß aus Suffixen bestimmt werden

**[E / Design-Risiko, nicht als Fremdstudie ausgeben:]** Das **fixe R9-Lexikon** (fluff, fluffs, fluffed, fluffing, fluffy, fluffily, fluffery) ist bindend. Selbst korrekte Suffixregeln scheitern ohne Kontext an „news“, „glass“, „always“, „friendly“, „love“, „running“, „read“. Besonders englische Karten/Triplets benutzen absichtlich elliptische Grammatik. Deshalb sollte ein späterer Receiving Owner **nur für die tatsächlich kuratierten Card-Lines POS-Tags** oder eine kleine redaktionell prüfbare Lexemliste vorhalten, keine generative Ersetzung. Wenn unklar: Klartext/neutraler Fluff-Fallback, keinen erfundenen Neologismus.

**„bloodbath → fluffbath“ ist aktuell NICHT erlaubt:** Wäre für ein anderes Satire-Format denkbar, widerspricht aber dem KFB-R9-Fixlexikon, solange Georg nicht separat Freigabe erteilt. Bitte in §4/§9 des Hauptberichts ausdrücklich diese harte Sperre nennen.

**[P]** Der Schlümpfe-Verlag beschreibt die Morphologie der Schtroumpf-Ersatzsprache in [Dupuis: Schtroumpf vert et vert Schtroumpf](https://www.dupuis.com/les-schtroumpfs/bd/les-schtroumpfs-tome-9-schtroumpf-vert-et-vert-schtroumpf/959). Daraus folgt nicht, dass jede beliebige englische Wortfolge durch uniforme Endungsregeln noch verständlich bleibt.

## 6. Comic-/Glyph-Lizenz: Breite ist KFB-UX-Regel, keine Walker-Anforderung

**[N/Reference]** [World Wide Words: Mort Walker / Grawlix](https://www.worldwidewords.org/backissues/ww-gra1.html) unterscheidet grawlixes, jarns, quimps, nittles als grafische Comic-Konventionen. **Keine belegte Regel** 1 geheimer Buchstabe = 1 Symbol oder 1 Glyph pro Breitenwert. Die KFB-Regel **1–3 Quasi-Glyphen pro Wort, bei ~1,6em auf gemessene Klartext-Wortbreite skalieren, Interpunktion lesbar** ist **eigene** Layoutentscheidung für reflow-freies Dekodieren.

**[P, Lizenz]** [Blambot Licenses](https://blambot.com/pages/licenses): Die Gratis-/Indie-Comic-Regel deckt dynamische Game-Schrift/Webfont-/Software-Einbettung **nicht pauschal**. PottyMouth BB liegt nach dem Register-Brief **ohne KFB-Spielelizenz** vor. Die temporären eigenen Zeichenformen nicht als freigegebene Endassets ausgeben.

## 7. Lernprogress, Accessibility, technische Abgrenzung

**[P]** [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/): nicht-textliche Bedeutung benötigt Alternativen; Steuerung und Sprache müssen zugänglich sein. Der Hauptbericht behandelt Accessibility bereits – wichtiger Auditpunkt ist **kein progress-gesperrter Screenreader-Zugriff auf erforderliche Card-Line-Semantik**, keine wiederholte Live-Region pro Wort, Kontrast/Zoom und Mute.

**[P, Produktionsdesign]** [Rundisc zu Chants of Sennaar](https://www.gamedeveloper.com/design/immersing-players-in-the-culture-of-a-people-with-language-puzzler-chants-of-sennaar) und [Jon Ingold zu Heaven's Vault](https://www.thesixthaxis.com/2018/04/27/interview-talking-with-inkles-about-deciphering-ancient-language-in-heavens-vault/) zeigen den Wert kontextuell begründeter Deutungen. Eine rein optische %-Aufdeckung erzeugt weniger Einsicht als Karten-/Kontextfunde. Das ist eine **KFB-Einschätzung**, kein gemessener Spielevergleich.

**[P, Browser]** [MDN AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) empfiehlt **einen wiederverwendeten AudioContext** und [MDN Autoplay](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) User-Gesture sowie Mute/Play-Kontrollen. **Keine neue AudioRuntime für die Research-Erkenntnisse**. Klatt-Synthese als überkomplexer Phonem-Donor: [Klatt 1980](https://doi.org/10.1121/1.383940); Web-Implementation [klatt-syn](https://github.com/chdh/klatt-syn). Celeste per bewegten Formanten bleibt passend: [Kevin Regamey](https://threadreaderapp.com/scrolly/1416483583053602816).

**Kostennote / Audit [E]:** Der bestehende Bericht nennt konkrete, volatile ElevenLabs-Flash-Preis-/Latenzzahlen (z. B. $0,05/1000 Zeichen, 75 ms vs. 255 ms). Ohne **datierte tarif- und protokollspezifische Primärquelle** und reproduzierbare Vergleichsmessung sollten diese nicht zum Produktbudget werden. „Web Audio 0 € pro Zeile“ ist nur **keine externen per-Request-TTS-Gebühren**, nicht „kein Entwicklungs-/CPU-/Akkukosten“. In §7 explizit Modell-/Plan-/Datum/Network-/Cachebedingungen nachtragen oder Beträge entfernen.

## 8. Zusammengeführte Empfehlung „übernehmen“ (keine neue Kanonentscheidung)

| Priorität | Schicht | Handlung |
|---|---|---|
| P0 | Melodie | **Blizzards ausdrücklich bestätigte Unabhängigkeit von Audio und lesbarer Textphase** als Designheuristik; Melodie bleibt Musik bis zum Ende. |
| P0 | Blase | KFB-R9-Wortbreiten-Kodierung nur visuell; gleiche Zeilenhöhe, fester Originaltext, Screenreader-Plaintext. |
| P0 | Fluff | POS-redaktionell kuratierbar und **nur festes R9-Lexikon**; keine erfundenen Komposita. |
| P0 | Progress | bestehender Karten-/Deck-Fortschritt ist Besitzer, keine neue Forschungsleiste als Runtime; echte Decksong-Freischaltung separater Reward. |
| P1 | Audio | Celeste-Formantfärbung + Fujisaki-/ToBI-Phrasengesten als vereinfachte Parameter, fortlaufend statt Silben-Sampler. |
| P1 | Dramaturgie | Clangers/BB-8-Prinzip: erst Bedeutung/Performance, dann Fremdklang; Chants/Heaven's Vault für Einführungs-/Aha-Design. |
| P2 | Geheimnis | Optional verborgene Klangchiffre *Tuneic*-Art, **nicht** Pflicht für Deckvollendung. |

## 9. Explizite „vermeiden“-Ergänzungen

Keine WoW-Produktionsmethode erfinden (Soundbank vs. prozedural weiterhin **nicht belegt**); keine Tunic-Phonemzuordnung mit KFB-Wortmotiven gleichsetzen; keine zusätzlichen AudioContexts/Runtime-Owners; kein Laufzeit-POS-LLM; keine mit Neu-Komposita gepaddeten Fluffwörter; keine Ersatz-Letteringmarke/ungenehmigte PottyMouth-Fonts; kein blindes Timegating; keine neuen fixen €/ms-Versprechen; keine Grawlix-Chiffre als angeblich wissenschaftlich vorgegeben verkaufen.

## 10. Offene Fragen, die tatsächlich Georgs Produktentscheidung verlangen

1. Soll ein **identisches Wortmotiv global** über alle Figuren gelten oder **identisch relativ zur Figurentransposition** (bei Dory Flöte, Hunky Tuba)?
2. Bleibt Plaintext für Spiel-/Screenreader-Lesbarkeit **immer unmittelbar zugänglich** (Empfehlung: ja), während der Fortschritt weiter sichtbar bleibt?
3. Soll die Entschlüsselung echte **Spielerdeduktion** erfordern oder zunächst rein Karten-/Begegnungs-Fortschritt sein? Tunic/Chants können optionales Bonusdesign begründen.
4. Glyph-Finalisierung: eigenes rechtsklares KFB-Zeichensystem vs. eine später zu klärende Schriftenlizenz?

## Abgrenzung / Handoff

Das Hauptdokument des WS0 ist vollständig (0–10, Quellen) und wird **nicht dupliziert oder überschrieben**. Dieses Addendum liefert die **neuen Primärnachweise** (insbesondere Blizzard-Developer-Interview und Tuneic), eine nachweisbare Korrektur der Banjo-Methodenlücke und technische Lizenz-/POS-/Kostenpräzisierungen. Die 422-Konfliktantwort wurde korrekt ohne erzwungenes Override behandelt.

**Einziger nächster Gate:** **WS0 liest das Addendum und entscheidet, welche Belege als additive Ergänzung in den bestehenden Bericht übernommen werden;** keine automatische Runtime-Integration und keine Main-/Register-Schreibaktion durch WSA. Georg muss keine Quelle manuell transferieren.
