# KFB Six Dimensions × NATHAL × Warburg/Gabriel · Deck/Essay/JSON Donor Audit R1

**Datum:** 2026-10-18 · **Status:** RESEARCH / CURATION / DESIGN CANDIDATES, **kein** Kanon oder Integrationsauftrag.  
**Bestehender Owner:** KFB_HUB Register Research / Fractal Canvas Meta; Quelle `CONCEPT_R1.md` und `PRACTICE_LAB_R1.md` aus Draft PR #430 bleiben separat; Vorrecherche NATHAL/Heim #429 separat.  
**Rechercheflächen:** GitHub `georg-doc/kayfabizarro` main canonical **130-Deck-Registry** + einzelne `registry/assets/v1/decks/*.json` Card-Shards; Dropbox verlinkter Ordner `Krazy Kayfabizarro` und dessen MD-/PDF-/JSON-Entwürfe. Die bloße Registry-/PDF-/JSON-Existenz beweist weder Veröffentlichung noch Spielintegration.  
**Dropbox Original-Folder:** https://www.dropbox.com/scl/fo/51ss0sodi225lst7zy4ee/AGMdkkwnKIOh4yx0UEh5fd0?rlkey=6d5v5tqwr1dctfr1g86f9sao1&dl=0  
**Arbeitsprinzip:** Nach Originalkarte und realem Shard suchen. Kein erfundenes Deck, keine neuen Zahlen, kein ungeprüftes Reproduzieren von Dropbox-Entwürfen auf einer öffentlichen Stage.

## 0 · Executive Shortlist

**Priorität A – sechs sofortige Story-/Practice-Quellen:**
1. `jung_and_shinn_a_guide_to_cosmic_cringe` — innere Figuren, Schatten, Projektion und **Cryptomnesia**: Nähe zu subjektiv gewonnenem Wissen/NATHAL-inspirierter Perspektivtechnik.
2. `kayfabizarro_philosophy` — Wahrnehmung, Zeitlinien, Ontologie und Sinnfelder; 68 Karten; kein Gabriel- oder Heim-Kanon, sondern Philosophie-Nachbarschaft.
3. `project_gateway_kayfabe` — Gateway/Remote Viewing als historisch-satirisches investigatives Umfeld; Narrative Claims der Karten sind **keine unabhängigen Beweise**.
4. `medkayfab_science` — Popper, Kuhn, RCT und Placebo als epistemischer Gegenpart zur mystischen Gewissheit.
5. `kayfabizarro_monomyth_mayhem` — `Fractal Narrative` und `Quest Die` für selbsterlebte Episode, Mini-Quest und Substory; Game-Regeln weiterhin aus `Kayfabizarro_Freestyle_Rules_v18-4.md`, nicht aus jeder Card-Power ableiten.
6. Dropbox-Entwurf **Borromean Mnemosyne Dice** — der strukturell stärkste Warburg/D6-Spieltechnik-Donor, als Entwurf *neben* den aktuellen Regelvertrag legen.

**Priorität A/B – für einen weniger offensichtlichen, stärkeren R1.1-Paper-Test:**
- Dropbox Entwurf `EPISTEMIC_MISCHIEF-_Deutsch_Brainstorming_&_Ideation`, reale Karte 5 **Der Mnemosyne-Atlas**, oder `epistemic-mischief-2--h.json`, Karten 7/15/17/20/42.
- Dropbox `The Infinite Canvas & The Tenth Art` JSON, 52 Karten.
- Dropbox `Narrative Intelligence — Kayfabe Story-Wrestling Master Klass` JSON, 52 Karten.
- Dropbox `The Fractured Frame`, `Epistemic Mischief` und `warburg_mnemosyne.md` als Essay-/Methodendonors, keine eigenständigen publizierten Decks.
- Für wissenschaftliche-/metaphysische Spannungen: Dropbox `Fringe Science & Knowledge Gatekeepers` sowie `Compendium of Knowing`.

**Kernbeobachtung:** Die vorhandenen Karten führen schon drei sinnvolle Konflikte zusammen: **Erfahrung vs. Prüfung**, **Sinnfeld/Interpretation vs. Gegenstand**, **Quest-Fortschritt vs. Erinnerung**. Die sechs vorhandenen Story Modes lassen sich damit verwenden, ohne eine neue Spielmechanik einzuführen.

## 1 · Bestands- und Provenienzbefund

**GitHub:** `registry/assets/v1/decks/index.json` liefert zum Abrufzeitpunkt **130** Deck-Metadaten mit `cardCount = 6985`; `decks[]` enthält Deck-ID, Titel, Card-Zahl, JSON-/PDF-Pfade, `mappingStatus` und mögliche Registrierungsfelder. Die **Card-Shards** `registry/assets/v1/decks/{deckId}.json` enthalten `cards[].cardNumber/cardName/power/lore/mappingVerified`. Diese sind Grundlage der Karten-Pins unten, nicht spontane Titelinterpretationen. Main-Registry nicht als automatischer Nachweis von `published`, `live` oder `approved` behandeln.

**Dropbox:** Der vom Nutzer angegebene Link zeigt auf die zugängliche freigegebene Mappe `/(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro`. `PACKAGES & BOOKLETS/MD BOOKLETS (drafts)` listet 128 Einträge (davon Bücher und Nichtbücher), `PDF BOOKLETS (draft)` 13, das Workspaces-Unterverzeichnis `.../export/kayfabizarro-data/decks/` listet **387** JSON-Dateien inklusive offensichtlicher Versionen/Duplikate. Diese 387 sind **kein 387 verschiedene/unpublizierte neue Decks**. Bei den ausgewählten JSONs wurden Inhalte wirklich gelesen; Veröffentlichungsstatus bleibt **UNVERIFIED / candidate**, sofern nicht von getrenntem Publishing-Owner belegt.

**Transparenz der Auswahl:** GitHub 130 Deck-Metadaten gesichtet, 18 einzelne Karten-Shards vollständig abgerufen und relevante Karten anhand `cardName`, `power`, `lore` geprüft. Dropbox Ordnerstruktur, 12 substanzielle Markdown-Texte, 7 zusätzliche Source/Pattern-/JSON-Dateien, 6 spezielle Workspace-Deck-JSONs angeschaut. Nicht jedes PDF-Bild visuell geprüft, kein Rechteaudit aller privaten Materialien und keine automatische Publikations-Paritätsprüfung.

## 2 · GitHub – praxistaugliche Kern-Decks und belegte Karten

`GH(id)` = `https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/decks/{id}.json`. Jede `#N`-Nummer ist **wirkliche `cardNumber` aus dem geladenen Shard**, nicht ein Vorschlag für eine neue Karte. **Mapped=true** soweit nicht ausdrücklich anders angegeben.

| Rang | GitHub-Deck `deckId` | Belegte Karten (Number → Name) | Sinn im Six-Dimensions-Strang |
|---|---|---|---|
| 1 | `jung_and_shinn_a_guide_to_cosmic_cringe` | #21 **THE SHADOW**, #20 **THE CRYPTOMNESIA**, #12 **THE WISH-FULFILMENT** | *Two Witnesses*: Wissen, Selbstbild und verdeckte Herkunft einer Idee unterscheiden |
| 2 | `kayfabizarro_philosophy` | #35 **The Perception Filter**, #34 **The Quantum Observer**, #37 **The Timeline Splitter** | Gabriel-/Kant-nahe Reframings, Bewusstsein/Beobachter in philosophischer Satire, keine tatsächliche Gabriel-Formel |
| 3 | `project_gateway_kayfabe` | #2 **The Stargate Viewer**, #9 **The Gateway Process**, #10 **The Psychic Driver** | NATHAL/Monroe/Gateway als investigativer Referenzraum und „außergewöhnliche Behauptung vs. überprüfte Beobachtung“ |
| 4 | `medkayfab_science` | #5 **Popper-the-Falsifier**, #6 **Kuhn-the-Shifter**, #9 **RCT-the-Gold-Standard**, #28 **Placebo-the-Trickster** | Anker für `CHECK`, Testdesign und Quellen-Ambivalenz, nicht pauschaler Skeptiker-Gegner |
| 5 | `kayfabizarro_monomyth_mayhem` | #44 **Fractal Narrative**, #29 **Quest Die**, #30 **BLÖDSINN!**, #41 **Timeline Shift** | Unterschied zwischen innerer Verschachtelung, Quest-Spannung und Gedächtnis-Korrektur |
| 6 | `dream_wrestling_with_kayfabe_freud` | #1 **THE UNCONSCIOUS**, #45 **THE GAP**, #51 **THE PROPHETIC DREAM** | Traum/Sinn/Erinnerung und Lücke; vermeide unbegründete Deutung als wahre Zukunft |
| 7 | `epistemic_sabotage` | #16 **The Dust-Bunny Librarian**, #30 **The Ticking Tortoise**, #37 **The Silver-Haired Time-Fox** | Warburg/Quellen-Quervergleich, Zeitrhythmus und prüfbares Archiv; Satire aus Quelle statt freier Behauptung |
| 8 | `the_carnival_of_unsolved_problems_therapy` | #37 **Solo Anti-Journaling**, #40 **7-Day Witness**, #25 **Wait… What?** | optionale, niedrigschwellige Praxis-/Reflexionsrituale, nicht psychologische Diagnostik |
| 9 | `medkayfab_thinking_traps` | #37 **Flash-the-Intuition**, #15 **Blind-Spot-the-Expert**, #36 **Patient-the-Voice-Ignore** | Affekt/Intuition, Bias, subjektive Erfahrung vs. objektive Diagnose; als Erkenntnisübung |
| 10 | `medkayfab_differential_diagnosis` | #22 **Nomogram-the-Calculator**, #33 **Probabil-the-Spectrum**, #35 **Test-of-Time-the-Slow-Reveal** | Confirmation vs. Calibration; sichtbare Chancen-/Zeitprüfung, kein medizinisches Quest-Gating |
| 11 | `kayfabizarros_ontological_hazards` | #13 **The Cave of Shadows**, #8 **The Poet**, #14 **The Ivory Tower** | Platons Höhle, Sprach-/Wahrnehmungsfilter und Ontologie; **Card-Mapping unverified** im aktuellen Shard |
| 12 | `kreative_kayfab_creative_hero_journey` | #8 **The Ghost Slot**, #18 **I Remember Differently**, #25 **The Cut-Up Poet**, #27 **The Frottage Texture** | Warburg/McCloud/Lücke/Montage; **Card-Mapping unverified**, bevor integriert selbst Bild/Position prüfen |
| 13 | `unspoken_systems_kayfabizarro_meta_deck_01` | #3 **MEMORY DRIFT**, #37 **MEANING AS PERFORMANCE**, #47 **THE OBSERVER** | soziale Sinnfelder, widersprüchliche Geschichte/Beobachter; **Card-Mapping unverified** |
| 14 | `reality_redrawn` | #3 **THE PHENOMENA GOGGLES**, #4 **KAYFABE REALITY WRESTLING**, #37 **THE FALSE MEMORY OF HISTORY** | historische Konstruktion von Zeit/Wahrnehmung; Satire-Claims nicht als historische Quellen behandeln |
| 15 | `mind_traps` | #10 **WHAT WOULD NEED TO BE TRUE... ?**, #53 **EPISTEMIC SABOTAGE** | kontrolliertes Gegenbild, Fragekompetenz, Hypothesenbildung; Karte kann Manipulation als Fiktion zeigen |
| 16 | `medkayfab_neuroanatomy` | #52 **Memory Mike**, #8 **Limby the Limbic System** | empirische Kontrastfolie zur metaphorischen Hirn-/Gedächtnissprache |

**Weitere Kandidaten aus dem Index, nur Metadaten- oder Nebenbefunde, nicht dieselbe Prüfungstiefe:** `brain_flipper_image_spots`, `kayfabizarro_1_morale_ethics`, `help_i_am_a_human`, `human_nature_uncut_hilfe_ich_bin_ein_mensch`, `medkayfab_psychiatry`, `medkayfab_disease_timelines`, `kayfabizarro_monomyth_mayhem` und `wrinkle_rumble`. Die letzten fünf sind nicht automatisch „sechs Dimensionen“-Decks.

**Card-Power-Schutz:** Der `Project Gateway`-Text bei #9 behauptet satirisch, ein CIA-Bericht bestätige holografische Realität. Ein solches `lore`-Feld ist **fiktionaler Karteninhalt**, nicht ein recherchierter Behördenbefund. Ebenso sind „Timeline Splitter“ und „Quantum Observer“ Game Powers, keine überprüfte Quantenphysik. Bei `mapped=false` darf die Kartenposition nicht ohne Bild-/PDF-Abgleich in einen produktiven Stage-Fund wandern.

## 3 · Dropbox – tatsächlich gelesene Draft Booklets/Essays

**Basis-Pfad** für die folgenden zwölf Materialien:
`/(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro/PACKAGES & BOOKLETS/MD BOOKLETS (drafts)/`. Diese Texte sind **eigene Entwürfe**; nicht als publizierte Decks oder aktueller Kanon etikettieren.

| Priorität | Datei / eigener Titel | Gelesener Mechanik-/Theoriefund | Eignung |
|---|---|---|---|
| A+ | `11 ADD-ON - Borromean Mnemosyne DIY Dice v4.0.md` | DIY-Artefaktwürfel als **Bedeutungs-/Spannungskörper**, drei verknüpfte Dice, *Mnemosyne Good Neighbourhood*, benachbarte Würfelflächen als Erinnerungstafel; kann Story-/Quest-Dice sichtbar ergänzen | zentraler D6/Warburg-Donor, aber **kein automatischer Ersatz** des v18.4 Quest Dice |
| A+ | `68 FrizzleBob’s_Fractal_Almanac - Ideation. Brainstorming & Disruption Card Deck Add-On 22.md` | **Warburg's Good Neighborhood** ausdrücklich als Methode, 3 Stage-Karten, Dada/Frottage, Blocker-Perspektive | direkter Warburg/Spiel/Real-Transfer |
| A+ | `43 The Fractured Frame - Cut-Up Comics, Emergent Play, and the Impossibility of Linear Meaning - Krazy KAYFABIZARRO Komik Kard Kult v4.0.md` | Cut-up, McCloud-Gutter, Quest Die als nicht wertender Druck, Performance/Closure, Zeit/Irreversibilität | Meta-Erzählung und Comic-Geografie des Infinite Canvas |
| A | `61 FrizzleBob’s_Fractal_Almanac - COMPENDIUM_OF_KNOWING Card Deck Add-On 15.md` | Popper/Kuhn/Feyerabend, Wissenschaftsgeschichte, Methodenstreit | Kontroll-/Falsifikationsspannung zur Heim/NATHAL-Kosmologie |
| A | `52 FrizzleBob’s_Fractal_Almanac - FRINGE SCIENCE & KNOWLEDGE GATEKEEPERS Card Deck Add-On 07.md` | Sheldrake/morphic resonance, Wasser-Erinnerungsbehauptungen, Antikythera-/Inventor-Mythen; konkrete satirische Card-Mechanik „Resonance across previous Quests“ | historischer Investigativ-Arc, Claim-Status separat prüfen |
| A | `72 FrizzleBob’s_Fractal_Almanac - MEMORY_PALACE_Impact_Theory_Card Deck AddOn 25.md` | heiß/kalt-Erinnerungen, Lifeline-Stage, Flower/Stone, autobiografische/historische Story-Layer | freiwillige `AFTERGLOW`-/Erinnerungsmechanik; keine Zwangs-Traumaarbeit |
| A | `65 FrizzleBob’s_Fractal_Almanac - KOAN_KOMPENDIUM_Card Deck Add-On 20.md` | Koans, Reflexionswechsel; vorhandene Reinterpretation „same card, opposite meaning“, Zen/Advaita-Motive | NATHAL-inspirierte Inner Inquiry ohne seine proprietäre Methode zu kopieren |
| A/B | `64 FrizzleBob’s_Fractal_Almanac - GREAT_WORK_Alchemy_Card Deck Add-On 19.md` | Materie/Transformation, Jung, Hermetik, vier Stufen; physisch/symbolisch getrennt | Fluff/Crafting/Meta-Wandlung, symbolisch statt chemisch/kosmisch gleichsetzen |
| A/B | `54 FrizzleBob’s_Fractal_Almanac - critical_thinking_toolkit Card Deck Add-On 09.md` | Bias, Beweis, epistemic humility, Gegenhypothese, Bayesian Update | `CHECK`-Layer und Prediction Ledger |
| B | `49 FrizzleBob’s_Fractal_Almanac - PHILOSOPHY Card Deck Add-On 03.md` | Historischer philosophie-basierter Kartenkomplex | strukturell relevant, nicht erneut gegen jedes Kartenbild gepinnt |
| B | `08 ADD-ON - Artifact Practice & Therapy Carnival v4.0.md` | Innere Konflikte als Rollen, symbolisches Quest-Play, Beziehungs-/Perspektivtausch; kennt teils Quest-Die-Start `3` | für Two Witnesses / freiwillige Bühne, **abweichende historische Rules-Version** ≠ heutiger Standard |
| B | `20 META -  Storytelling & Play Framework v4.0.md` | human-first, Bedeutung durch Interaktion statt Erklärung; Anti-Chrome-/Anti-Protocol-Orientierung | Haltung/Performance-Donor, kein neuer Runtime-SSOT |

**Zusätzliche PDF-Materialien in Dropbox gefunden, nur Titel/Ordner geprüft:** `PDF BOOKLETS (draft)/11 ADD-ON - Borromean Mnemosyne DIY Dice v4.0.pdf`, `07 ADD-ON- Ideation & Creation v4.0.pdf`, `08 ADD-ON - Artifact Practice & Therapy Carnival v4.0.pdf`, `04 ADD-ON - Moods & Skills v4.0.pdf`, `20 META - Storytelling & Play Framework v4.0.pdf` sowie `COMIC SEMINAR 2026/The_Tenth_Art_Meaning_Under_Pressure.pdf`. Kein Bildseiten-QA, daher **nicht** als sichtbare KFB-Style-Spender bestätigt.

## 4 · Dropbox – JSON-Kandidaten, die nicht als identische IDs im Main-130-Katalog stehen

Unter `Comic Seminar PDFS/MODIFIED PROTOTYPES (PDFs, uncompressed, v05)/KAYFABIZARRO WORKSPACE/export/kayfabizarro-data/decks/` liegen 387 JSON-Dateien. Folgende Dateien **tatsächlich gelesen und JSON `cards[]` geprüft**, **nicht** einfach aus dem Dateinamen abgeleitet:

| Datei (gekürzt) | JSON-`deckTitle`, gezählte Karten | Konkrete Card-Pins | Transfer |
|---|---|---|---|
| `kayfabizzaro-infinte-canvas-tenth-art-01-add.json` | **The Infinite Canvas & The Tenth Art**, 52 | #10 *The Treachery Pipe*, #14 *Textplosion!*, #42 *Image Fixer* | McCloud, Bilderweiterung, Risiko des Übererklärens |
| `kayfabizarro-narrative-intelligence-web-v1-id-pdf.json` | **Narrative Intelligence — Kayfabe Story-Wrestling Master Klass**, 52 | #3 *The Meaning Layer*, #6 *The Data Node*, #14 *Evidence Degree*, #16 *The Conflict Map* | fraktale Erkenntniskette / Quelle → Zusammenhang |
| `epistemic-mischief-2--h.json` | **Uncle FrizzleBob's Epistemic Mischief**, 56 | #7 *DAS RESONANZ-FELD*, #15 *DIE FROTTAGE*, #17 *DIE HALBIERTE KARTE*, #20 *DIE RUPTURE-KARTE*, #42 *DER GHOST-SLOT* | Montage, Gutter, Dauerfolge einer Leerstelle |
| `epistemic-mischief-deutsch-brainstorming-ideation-add.json` | **Uncle FrizzleBob's Epistemic Mischief**, 56 | #5 *Der Mnemosyne-Atlas* | **direktester** Kartenanker für Warburg |
| `immanuel-kayfabezarro-kant-a-critique-of-pure-blodsinn-add--id.json` | **Immanuel Kayfabe-Kant & The Critique of Pure Blödsinn**, 40 | #26 *MATHEMATICAL SUBLIME*, #38 *REFUTATION OF IDEALISM* | theoretische Alternative zu idealistischen Reality-/Sinnfeldgags |
| `forbidden-firmware-ancient-conspiracy-akashic-card-deck-add--id.json` | **The Forbidden Firmware Update**, 60 | #50 *The Noosphere*, #51 *The Fifth Parameter* | spekulative Kosmologie / Grenzbegriffe, **fiktional** |
| `kayfabizarro-conspiracy-akashic-archive-www-awakeningmap-org-add--id.json` | **Midnight Riders vs The Kayfabe-Empire**, 56 | #27 *Distorted Field (Effect)*, #31 *The MK Ultra Labyrinth* | allegorische Informations-/Machtfelder, Metarecherche |

**Wichtig:** Das `epistemic-mischief-2--h.json` benennt `exhibitionRole: IGNORE`. Das gehört zur Archiv-/Ausstellungsfunktion dieses Exports, nicht zur automatischen Anweisung, das Deck zu ignorieren oder in die heutige KFB-Spielwelt einzubauen. Titelgleichheit zweier Epistemic-Mischief-JSONs beweist nicht, dass Karten/Durchzählung identisch sind.

**Weitere JSONs gefunden, nur Dateiname, nicht inhaltlich auditiert:** `kayfabizzaro-infinte-canvas-tenth-art-01-add--re.json`, `kayfabizarro-conspiracy-akashic-archive-www-awakeningmap-org-add.json`, `negotiate-the-future-1--h.json`, `narrative-sabotage-add.json`. Sie können Varianten, Duplikate oder nicht akzeptierte Exporte sein. Keine Doppelzählung.

## 5 · Der unvermutet wichtigste vorhandene technische/didaktische Donor: Mnemosyne's Quill

Neben dem neuen Six-Dimensions-R1-Entwurf liegen im verlinkten Dropbox-Bestand bereits drei **direkt inhaltlich gelesene** Quill-/Narrative-Intelligence-Module:

1. `PACKAGES & BOOKLETS/fractal-almanac/MD NARRATIVE INTELLIGENCE ENGINE/theory/warburg_mnemosyne.md` — Pathosformeln, Nachleben, Denkraum, dynamische Bildtafel.
2. `.../narrative_patterns/mnemosyne_tafel_system.md` — **Mnemosyne's Quill Tafel System v1.0**, ausdrücklich als aktive Konzept-Architektur mit Tafel-Kategorien (Zitat, Mythos, Wissenschaft, kritische Sicht etc.); Referenzdatenfelder und Board-Outputs; **kein aktueller KFB-Runtime-Owner**.
3. `.../narrative_patterns/warburg_cutup_collage_ai.md` — Warburg + Cut-up + Collage + AI-Co-Creation als generative Pattern-Grammatik.

Zusätzlicher publizierungsunklarer Text: `EXHIBITION HANNOVER/Booklets & Texte/FrizzleBobs_Fractal_Almanac_EN_v3.docx`, inhaltlich gelesen; Warburg und Cut&Play werden dort als Kernmotivation des Spiels erklärt. Nicht durch v3-Dateinamen automatisch zum heutigen SSOT erklären.

**Präferenz:** Das bereits dokumentierte Quill-Tafel-System **als Denkmuster/Daten-Donor** prüfen, bevor KFB einen neuen Karten-Editor oder eine neue Brainstorming-Runtime baut. Eine geladene Quill-Datei ist kein visuell isoliertes Produkt und kein Beleg, dass aktive KFB-Spiel-Canvas-Funktionen übernommen wurden.

## 6 · Drei konkret spielbare Donor-Konstellationen (Vorschlag, keine neue Karte/Quest)

### A · „The Two Witnesses / The Unreliable Oracle“ (NATHAL × Jung × Science)

**Existierende Quellenkarten:** `jung_and_shinn...` #21 *THE SHADOW* und #20 *THE CRYPTOMNESIA* + `medkayfab_science` #5 *Popper-the-Falsifier* (als **drei** Stage-Quellen; keines davon neu generieren).  
**Option:** `project_gateway_kayfabe` #2 *The Stargate Viewer* als Austausch der dritten Karte für einen epistemisch härteren Mystical/Forbidden-Konflikt.  
**Spielaktion:** Person A liefert intuitive Antwort, Person B fragt nach Herkunft und Gegenhypothese, dritte Karte fordert echten Gegenbeleg. Die D6-Tonart steuert Auftritt, nicht Wahrscheinlichkeiten; Quest Die folgt dramatischem Ereignis.  
**Real-Praxis:** eigenständiges zwölfminütiges `Two Witnesses` aus PR #430; jede Empfindung darf erlebt werden, externe Behauptung bleibt verifizierbar oder offen.

### B · „The Black Cloth / The Gutter“ (Warburg × Comic × Fractal D6)

**Existierende Quellenkarten:** `kreative_kayfab_creative_hero_journey` #8 *The Ghost Slot* (unverified Mapping) + `kayfabizarro_monomyth_mayhem` #44 *Fractal Narrative* + `epistemic_sabotage` #16 *The Dust-Bunny Librarian*.  
**Stärkerer Dropbox-Donor:** `epistemic-mischief-deutsch...` #5 *Der Mnemosyne-Atlas* oder aus `epistemic-mischief-2--h.json` #17 *DIE HALBIERTE KARTE* und #42 *DER GHOST-SLOT*.  
**Aktion:** 3 echte Quellenbilder in neuer Nachbarschaft arrangieren; die Leerfläche/Gutter trägt eine noch nicht erklärte Relation. Dem Publikum eine echte Closure ermöglichen.  
**Nicht:** drei zufällige Bilder plus erklärender Lore-Infoblock. Erst die Lesbarkeit der Relation testet den Donor.

### C · „The Metron Dossier / Six Ways of Misreading Reality“ (Heim × Gabriel × Science)

**Existierende Quellenkarten:** `kayfabizarro_philosophy` #35 *The Perception Filter*, #37 *The Timeline Splitter*, `medkayfab_science` #6 *Kuhn-the-Shifter*.  
**Weitere Quellenvorschläge:** Dropbox *Kant*, *Infinite Canvas* und *Compendium of Knowing*; Heims echte Originaltextstellen getrennt als Dokumentbeleg.  
**Spielaktion:** ein echter Diorama-Gegenstand bleibt derselbe, aber jede Begegnung verändert die Beziehungen in mehreren Kontexten; ein Prüfschritt widerspricht der vermeintlichen Universal-Deutung. Farben D6 sind dramaturgisch, nicht Heim-Achsen.  
**KFB-Owner:** bestehende World/Resident/Card/Quest/Almanac-Owner liefern Gegenstand, Identität und Persistenz. Kein physikalisches Metron-Simulationssystem und keine neuen Handlungsdaten in diesem Forschungszweig.

## 7 · Klare Ausschlüsse / negative Auswahl

- **Nicht** 130 registrierte PDF-Decks als 130 sicher publizierte Live-Decks bezeichnen. Site-/Stage-Verifikation nicht durchgeführt.
- **Nicht** 387 Workspace-JSON-Files als 387 eigene, neue Decks ausgeben.
- **Nicht** fremde Buchseiten, großflächige Essaypassagen oder privaten Dropbox-Quill-Code in den öffentlichen KFB-Hub kopieren.
- **Nicht** Kartenbeschreibungen, die satirisch `CIA confirmed` behaupten, als Quellenlage zitieren.
- **Nicht** bei unverified Card-Mapping eine Karte/Bildposition ohne isolierten Original-PDF-/Bildbeweis in Game übernehmen.
- **Nicht** die Entwurfsversion „Artefaktwürfel ersetzen Quest Die“ mit dem aktuellen Freestyle-v18.4-Vertrag stillschweigend verschmelzen.
- **Nicht** „Borromean Mnemosyne“ als Heim-6D-oder NATHAL-Methodenidentität deklarieren.
- **Nicht** die exakte historische Heim-Dimensions-zu-D6-Farb-Tabelle erfinden; `CANON_HOME_MAP.json` hält `null`, Vor-Strang #430.
- **Nicht** private WIP-Decks automatisch in bestehende öffentliche Asset Registry importieren (Publikationsstatus, Lizenz, Card Identity, Publisher Gate zuerst).

## 8 · Offene Fragen und genau ein Next Gate

**Offen:** Welche der 387 JSONs sind spätere, frei nutzbare eigene Source-Versionen vs. Parallel-Export/Duplikat? Wie wird der Dropbox-Card-Status im echten Publish-Owner bestätigt? Gibt es bereits eine KFB-Card-ID für den *Mnemosyne-Atlas*, die außerhalb des derzeitigen 130er Index als Quelle bindbar ist? Wie sind Bildseiten und Rechte tatsächlich? Welcher der hier genannten Quill-Tafel-Donors entspricht aktueller Quill-Source-Revisionslage? Die hier recherchierten Card-Lores sind **nicht** der wissenschaftliche Evidenzbericht zu NATHAL/Heim.

**Ein nächster produktiver Gate:** **WS0 source-critic wählt einen der drei vorhandenen Konstellationsentwürfe A/B/C und pinnt die tatsächlich erforderlichen **drei** Card-ID/PDF-Bild/Persistenz-Owner-Quellen inklusive Mapping- und Publikationsstatus; erst dann ein dokumentierter 3-Card-Paper-Test.** Georg muss bis dahin keine Dateien verschieben und nichts importieren.

## 9 · Technische Direktquellen

- Registry-Index: https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/decks/index.json
- Beispiel-Shards: https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/decks/jung_and_shinn_a_guide_to_cosmic_cringe.json ; https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/decks/kayfabizarro_philosophy.json ; https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/decks/project_gateway_kayfabe.json ; https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/decks/medkayfab_science.json ; https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/decks/kayfabizarro_monomyth_mayhem.json
- Bestehendes Meta-Design R1: https://github.com/georg-doc/kayfabizarro/pull/430
- Nathal/Heim Erst-Recherche: https://github.com/georg-doc/kayfabizarro/pull/429
- Dropbox Root (verifiziert zugänglicher Shared Folder): https://www.dropbox.com/scl/fo/51ss0sodi225lst7zy4ee/AGMdkkwnKIOh4yx0UEh5fd0?rlkey=6d5v5tqwr1dctfr1g86f9sao1&dl=0
- Verifizierte Dropbox-Text-Direktlinks wurden für die einzelnen gelesenen Texte zurückgegeben, die vollständigen Pfade sind in §§3–5 angegeben. Das Shared-Folder-Original ist der stabile Nutzer-Einstieg; keine von uns erfundenen Dropbox-Files-URLs.

**Status der Belege:** direkte Registry-/Shard-/Dropbox-Connector-Reads, redaktionell ausgewertet. Keine automatischen PDF-Seiten/Illustrationsvergleiche, keine menschliche Gameplay-Abnahme, keine unabhängige Rechte-/Publikations-Audit und kein 3D-/Stage-Produkt.
