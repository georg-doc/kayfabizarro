# KFB · NotebookLM Narrative Architecture & Game Design Document — Quellengestützter Review R1

**Reviewstand:** 19.10.2026 · **Status:** INDEPENDENT DOCUMENT REVIEW / DESIGN / NO CANON / NO RUNTIME.  
**Input:** Vom Nutzer als Google-Drive-Export zugänglich gemachte 15-seitige Datei `Kayfabizarro World: Narrative Architecture & Game Design Document.docx`, Kapitel 1–8. Dokument im Chat gelesen und mit den aktuellen GitHub-Quellen abgeglichen; nicht als selbstständige, autorisierte neue KFB-Architektur verifiziert. Original-Datei wurde **nicht** verändert.  
**Owner:** bestehende KFB_HUB-Register-Research-/Fractal-Canvas-Lane. Keine neue Quest-, World-, Card-, NPC-, Almanac-, Audio- oder Quill-Laufzeit.  
**Belegkonvention:** `DOC p.N §X.Y` = tatsächlich gelesener NotebookLM-Export, Abschnitt/Seite; `GH-Kn` = unten aufgeführte verifizierte GitHub-Provenienz (exakter Pfad + Branch).  
**Bewertung:** **DESIGN SYNTHESIS STRONG / CANON & RUNTIME DRIFT MATERIAL / SOURCE CRITIC REQUIRED BEFORE INTEGRATION**.

## 0. Executive Verdict

Das NotebookLM-Dokument ist eine gut strukturierte Synthese aus zuvor in KFB bereits getrennt erforschten Feldern: Heim, NATHAL, Warburg, Gabriel, Fractal Almanac, Story-D6, Quest-Die und drei konkrete Spielproben. Stärken: Wiederverwendung eines einzigen Gegenstandes unter unterschiedlichen sozialen und historischen Beziehungen; dreiteilige Warburg-Bühne; deutliche Quellenrollen; Spielphilosophie `Pull, Don't Gate`.

**Nicht als technische Spezifikation übernehmen:** Das Exportdokument beschreibt zahlreiche DESIGN-Vorschläge in deklarativer Engine-Sprache `shall`, `engine implements`, `state lock`, `trigger`, `JSON Specification`. Diese sind **nicht** durch die bestehenden Game-Owner, Karten-ID-Register oder echte Laufzeittests belegt. Einige Aussagen widersprechen konkreten aktuellen KFB-Entscheidungen. Der Bericht ist am stärksten, wenn er als **Inspirations- und Hypothesen-Dossier** verstanden wird.

**Leitverbesserung:** Drei unabhängige Schichten ausweisen:
1. **Vorgefundene Story-/Game-Quellen und konkrete Assets** (`SOURCE / DECISION`);
2. **Wissenschaftliche, historische und Anbieterbehauptungen**, jeweils mit passendem Evidenzlabel (`EXTERNAL MODEL/CLAIM/DATA`);
3. **Freiwillig testbare Spielangebote** (`DESIGN PROPOSAL / NOT BUILT`).

**Ein Objekt + zwei wirklich verschiedene Handlungskontexte + eine echte Quellenkarte + eine reversible oder sichtbare Konsequenz** ist wertvoller als ein globales `SenseFieldMasks`-Runtime-Framework.

## 1. Was direkt behalten werden sollte

| NotebookLM-Dokument | Strong Point | Warum source-kompatibel |
|---|---|---|
| S. 1–2, §1.2–1.3 | Trennung `KFB-ORIGIN / KFB-LORE / KFB-DESIGN / EXTERNAL-THEORY / EXTERNAL-CLAIM / UNRESOLVED` | Richtige Idee: Fiktion, Anbietertexte, historische Modelle und Messdaten auseinanderhalten; in R1 jedoch `EMPIRICAL-EVIDENCE` als eigene Klasse ergänzen [GH-K4] |
| S. 7–9, §4.2 | **Ein Fluff-Baum / mehrere Sinn- und Rollenbeziehungen** | Entspricht bereits beschlossenem Georg-Fractal-Intent, Gabriel als Perspektiv-/Beziehungsanregung, aber nicht als bloß subjektive „Welt“ [GH-K1, K3] |
| S. 9, §4.3 | Dreiteilige Warburg-Tafel mit offenem Gutter | Wiederverwendet existierende 3-Scene-Slot-Regel und Bildnachbarschaft; keine zweite Card Runtime [GH-K2, K3] |
| S. 11–12, §6.2–6.4 | Drei eng unterscheidbare **DESIGN Probes** | Gleiche `Two Witnesses / Black Cloth / Metron Dossier` Konzepte liegen bereits in PR #430 und #433 als Entwürfe und Kartenquellen vor [GH-K4, K5] |
| S. 13–14, §7 | Vier konkrete analoge Übungsanlässe | Als **unabhängige KFB-Kreativitätsübungen** dokumentiert; nicht NATHAL-Schulung oder wissenschaftlicher Interventionserfolg [GH-K6] |
| S. 14–15, §8 | `Pull, Don't Gate`, lebendiges cartoonhaftes Diorama | Im bestehenden Big Picture und in der Story Recovery ausdrücklich gewollt [GH-K3, K7] |

**Kreativer Gewinn:** Der Spieler kann durch das Ausprobieren einer Handlung die Auslegung desselben Gegenstandes verändern. Das macht Gabriel/Warburg **sichtbar**, statt sie nur als Infokarten zu zitieren. Ein weiteres positives Detail ist die explizite Zurückweisung eines `consciousness score`.

## 2. Konfliktregister — SOURCE / DRIFT / REPAIR

### F1 · P0 — Fluff Incident wird zur faktisch abgeschlossenen Ursache des Inselzerfalls (DOC S. 4 §2.3)

**DOC behauptet:** Der Incident „caused a structural cosmic rupture, fracturing the world into isolated, comic-panel-like world fragments“.  
**GitHub:** `META_NARRATIVE_R1.md` kennzeichnet die Ur-Insel-/Fragmentierungsfolge als **GAL Proposal / not settled chronology**, und die genaue Ursache/Verkettung des Incidents ausdrücklich **OPEN**; die Story Recovery verbietet vorschnelle Kanonisierung [GH-K7, K8].  
**Korrektur:** `The Fluff Incident is a source-backed Genesis framing. Whether it physically or socially fractured the world is a narrative hypothesis, not established KFB canon.` Fraktale Dioramen dürfen aus Montage, Warburg, Comic-Gutter oder Entdeckung entstehen, ohne einer konkreten kosmologischen Ursache zugeordnet zu werden.

### F2 · P0 — TARDIS-UFO-Innenraum / Garten als gegenwärtig implementierte Basis (DOC S. 3 §2.2)

**DOC:** Lady Dorys „mobile base ... contains impossible, non-Euclidean spatial geometry, housing living botanical sanctuaries, chaotic archives“.  
**GitHub:** V-252 und aktuelle Fluff-Übersicht sehen zunächst **UFO-Cockpit als Dialogbühne / keine Innenräume und keinen Traktorstrahl jetzt** vor. Größere Innenräume/Garten/TARDIS-Raum-Graph sind ein **späterer DESIGN-Vorschlag**, den Georg als mögliche Zukunftsrichtung notiert hat [GH-K8].  
**Korrektur:** Als **long-term lore/design direction** verwenden; keine aktuelle reale Bühne/asset/prototypische Funktion behaupten.

### F3 · P0 — Aus dem Quest Die wird eine zusätzliche State Machine mit sofortigem Reset (DOC S. 6–7 §3.3–3.4)

**DOC:** `Quest Die == 6 → immediate State Lock → automatic Almanac logging → Diorama teardown → next stage`.  
**GitHub:** Die analogen Freestyle Rules v18.4 sagen `bei 6 → Finale im **nächsten Zug**`; Story Die ist per Turn gewürfelt, Quest Die wird **bewusst als Dramaturgieentscheidung** bewegt und ist *kein Zufallswürfel*, `+2/+1/0/−1`. Der digitale Quest-/Almanac-Owner ist eigenständig; die Konzeption PR #430 verlangt gerade **keine neue zweite Progression** [GH-K2, K4].  
**Korrektur:** Das DOC-Diagramm **nur als illustrative Konzeptskizze** bezeichnen; Lock/Commit/Reset als **nicht spezifiziert** und **nicht als Standard- oder Runtime-Vertrag** auflisten. Weder automatisch jede Szene abbauen noch Kartenlog-Einträge ohne echte Begegnung schreiben.

### F4 · P0 — Erfundenes „KFB-CARD-DECK-01-#14“, State-/Event-IDs und neue Ressourcen (DOC S. 8–9 §4.2)

**DOC JSON:** `gameObjectId: OBJ_FLUFF_TREE_01`, `provenanceRegistryId: KFB-CARD-DECK-01-#14`, `dioramaLocation: KFB_TOWN_SQUARE`, `INCREMENT_HUNKY_RESOURCE_METER`, `DECREASE_ENVIRONMENTAL_FRICTION`, `UPDATE_QUEST_DIE_VECTOR`, `TRIGGER_FLUFF_FLOURISH_ANIMATION`.  
**GitHub:** keine dieser IDs und kein vorliegender Owner-Vertrag wurden in der R1-Source-Audit nachgewiesen. Die echten Karten sind `deckId+cardNumber` und im PDF/Registry belegt. Die drei Fluff-Währungen (`wallet`, `score`, altes `HP`) und ihre Besitzer sind ausdrücklich ungeklärt; eine zusätzliche Hunky-Resource-Bar darf nicht automatisch geschaffen werden [GH-K5, K8].  
**Korrektur:** Den JSON-Block als **synthetisches, nicht ausführbares Pseudobeispiel mit NICHT VERIFIZIERTEN IDENTIFIERN** deklarieren oder aus dem Import als `Sample Code` herausnehmen. Bei späterem Source-Schema nur echte über GitHub gepinnte IDs, existierende World-/Card-/Quest-Owner und tatsächlich überprüfte Events.

### F5 · P1 — Fraktaler Stack inkonsistent, und Welt wird zu linearer Pipeline (DOC S. 4–5 §2.4)

**DOC:** „8-stage / 7-transition Fraktal Translation Stack“, später `7-layer` für die acht genannten Elemente `DECK → WORLD → CARD → DIORAMA → CHARACTER → DIALOGUE → MEDIA → ALMANAC`. Die Zahl wechselt von 8 Stages zu 7 Layers.  
**GitHub:** `Deck → world/biome → Card → POI/encounter → Resident worldview → Triplet/dialogue → Billboard/media → Almanac memory → recombination` ist **fraktale Erzählgrammatik, kein synchrones technisches Datenflussprotokoll** [GH-K3].  
**Korrektur:** „Nichtlineare Übersetzungs- und Kontextbeziehungen über Skalen“ statt „7-layer runtime stack“; `recombination`, `Resident worldview` und `POI` nicht still entfernen.

### F6 · P1 — Gabriel wird auf „Dynamische Property-Masks“ reduziert (DOC S. 7–8 §4.2)

**DOC:** „Context-Masked Component Architecture“ als angebliche mechanische Adaption, die Eigenschaften und Event-Trigger je `SenseField` umschaltet.  
**Quellen:** Gabriels Sinnfelder sind **nicht nur subjektive Perspektiven**, sondern in seinem philosophischen Realismus tatsächliche Bereiche, in denen Gegenstände erscheinen; siehe PR #430 [GH-K4].  
**Korrektur:** Ein Objekt kann je Feld **anders relevant**, anders nutzbar und in andere Beziehungen gestellt sein. Das heißt **nicht**, dass eine Bewohnerperspektive automatisch tatsächliche Materialeigenschaften/Physics verändert. Game-Design-Metapher ist gut, aber semantischer Kontext sollte **im Verhalten/Questzustand** des bestehenden Besitzers auftauchen, nicht durch neuen globalen Maskenmanager.

### F7 · P1 — KFB Story-Mode-D6 wird zu fixierter Erkenntnis-Engine (DOC S. 5–6 §3.3)

**DOC:** Die sechs D6-Faces `drive player choices and scene transitions` und erzeugen `epistemic filter`.  
**GitHub:** Die sechs Farben und Genres stammen aus bestehenden D6-/Fluff-Quellen. Die sechs zugeordneten Erkenntnisfragen (`Tragic/TRACE`, `Mystical/PATTERN` usw.) sind **neu als DESIGN und frei kombinierbar** markiert. Jeder D6-Story-Mode kann mit **jeder** der sechs Erkenntnisaktionen vorkommen. Eine starre 1:1-Bindung ist keine Entscheidung [GH-K4, K6].  
**Korrektur:** `Storymode = dramaturgical invitation, independent optional inquiry action`, kein Pflichttutorial, kein „Mystical muss Pattern“.

### F8 · P1 — NATHAL®/Supra-Dialog® als angeblich implementiertes KFB-UI (DOC S. 10–11 §5.2–5.4)

**DOC:** `The Supra-Dialog® is implemented as an internal decision-support UI`; `open-source cognitive mechanics`; separate `Dual Energy Entities`.  
**Quellen:** Die bisherige KFB-NATHAL-Recherche beruht auf öffentlichen Anbieterbeschreibungen und enthält **keinen Nachweis für die lizenzierte Übernahme eines proprietären Methodenpakets oder seiner konkreten Originalsequenz**. Unser `Two Witnesses` ist ausdrücklich eigenständig entworfen, **nicht** der NATHAL-Supra-Dialog [GH-K6, K9]. `open-source` würde zudem einen tatsächlichen Softwarelizenz-/Freigabestatus implizieren, der für diesen Text nicht existiert.  
**Korrektur:** Eigene `Two Witnesses`-Dialogidee benennen, vom Originaltrainingskontext getrennt; NATHAL®/Supra-Dialog® nur als **forschungs- und inspirationsbezogene Fremdmethode** verlinken. Optionaler Fokus auf Imagination, Affekt und kreative Assoziation, nicht ein klinisch wirksames Diagnostik-UI.

### F9 · P1 — E.B.E.-/Geruchs-/„höhere Ethik“-Pflichten unzureichend belegt (DOC S. 11 §5.4)

**DOC:** „Olfactory & Entity Contact (E.B.E. Parameters)“ als Proximity-Kanal; ausdrückliche `in accordance with dedicated NATHAL seminar protocols`; Kontaktpersonen hätten `vastly superior ... ethical capabilities`; daraus werden verpflichtende Verhaltensregeln abgeleitet.  
**GitHub:** Aus der früheren in PR #429 tatsächlich gesicherten Literaturübersicht ergibt sich **keine reproduzierte/dokumentierte NATHAL-Seminar-Spezifikation**, die solche detaillierten KFB-Spielpflichten begründet. Die Research-Quelle verweist auf außergewöhnliche Anbieterbehauptungen, nicht auf experimentell gesicherte E.B.E.-Parameter [GH-K9]. 
**Korrektur:** Entweder die behauptete **konkrete Anbieter-Quelle und den exakten Originalwortlaut** prüfen, oder diese Aussagen als **DESIGN-only, speculative alien-encounter inspirations / SOURCE_UNVERIFIED** klassifizieren. Olfaktorische Signale können auf üblichen Bildschirm-/Audio-Geräten nicht ausgegeben werden; keine zusätzliche Hardware- oder Angstregulationspflicht daraus ableiten. Auch in-universe können mächtige Aliens fragwürdig sein – die Academy hat gerade keine nachgewiesene moralische Überlegenheit.

### F10 · P1 — Anbieterbehauptungen werden im Quellenkatalog als Faktenkorpus aufgewertet (DOC S. 1–2 §1.2)

**DOC:** Kategorie `EXTERNAL-THEORY` bündelt `peer-reviewed physics models`, Heim und Gabriel/Warburg; unter NATHAL steht „Jena EEG Replication (2024)“, 11.000 Seiten, 33 Skripte und das Kozyrev-Patent.  
**GitHub:** PR #429 identifiziert *Mathematics 12(21), 3308 (2024)* als **Review**, nicht als nachweislich abgeschlossenes kontrolliertes EEG-Primärprotokoll. Claims zu 2024-Haffelder/Jena und außergewöhnlichen Manuskriptursprüngen sind **Provider Claims / UNSUPPORTED as causal evidence**. Ein behauptetes Patent dokumentiert ggf. eine Anmeldung, nicht Wirksamkeit.  
**Korrektur:** Theorie und peer-reviewed Empirie trennen; `NATHAL CLAIMS` nicht als `HEIM PHYSICS PROOF` behandeln; eine eigenständige Kategorie `EMPIRICAL-EVIDENCE` plus `SOURCE UNAVAILABLE` ergänzen. Ein *physikalisches Modell* ist kein hinreichender Nachweis realer Physik.

### F11 · P2 — Seltene sinnliche/spielerische NATHAL-Aspekte werden mechanisch überschrieben (DOC S. 10–11 §5)

**DOC:** Imagination → Witness A „Opportunistic Potential“, Witness B „Blind Spot Detection“, danach External Verification.  
**Bewertung:** Als rationales Kreativitätsformat brauchbar, aber ein etwas generischer Pro-Contra-Dialog. Er verengt die eigentlich spannende **subjektive Überraschung, Körperempfindung, ästhetische Farbe/Ton, Bildentstehung, emotionales Paradox und Offenheit** auf eine Risiko-/Opportunity-Checkliste.  
**Korrektur:** Den eigenständigen Praxisansatz **zweiphasig** halten: (1) freiwilliger bild-/sinnesbezogener, affektiver Explorationsteil – überraschende innerliche Antworten zulassen; (2) erst **bei überprüfbaren externen Behauptungen** ein klarer Evidenzcheck. Nicht jedes Spiel-/Kunst-Erlebnis braucht eine Falsifikation. Keine Behauptung einer realen übersinnlichen Fähigkeit.

### F12 · P2 — Verwechslung von optischer Wissenschaftsstrenge und Spielfreude (DOC alle Kapitel)

**DOC-Ton:** `shall`, `mandatory implementation`, `strictly forbidden`, `neurophysiological`, `engine`, häufig automatische State-/UI-Gates und normativ formulierte Sicherheit.  
**GitHub-Intent:** KFB soll eine **chill/fun lebendige Spielzeugwelt** sein, in der menschliche Beziehung, Satire, Körper/Bewegung, musikalischer Auftritt und vom Spieler geschlossene Bild-/Situationslücken die Einstiegsebene bilden [GH-K3].  
**Korrektur:** Wissenschaftliche Sauberkeit als **Schicht der redaktionellen Quellenkritik** bewahren; **fiktional dürfen die Academy, Hunky, Dory und NPCs metaphysische Konzepte für wahr halten**, die sie nicht wissenschaftlich beweisen können. Keine pauschale Entzauberung sämtlicher Spielmagie; keine reale Wirksamkeitsbehauptung. Drei sichtbare Handlungen statt drei Absätze „epistemischer Containment“-Chrome.

## 3. Quellenaudit versus Dokumentableitung – was ist tatsächlich neu?

**Erkennbar aus existierenden GitHub-Dons (kein neuer NotebookLM-Durchbruch):**
- Story/Quest D6 samt `+2/+1/0/−1`, Genres und Farben [GH-K2/K8];
- Warburg als `3-slot`-Board und Comic Closure [GH-K1/K4];
- Gabriel derselbe Baum in unterschiedlichen sozialen Beziehungen [GH-K4];
- `LOCATE/TRACE/RELATE/ASK/CHECK/ACT & REMEMBER`, in der Vorarbeit als **freie Designaktionen** [GH-K4];
- `Two Witnesses`, `Black Cloth`, `Metron Dossier` inklusive konkreter Card-Pins [GH-K4/K5];
- circa 12-minütige Perspektivenübung, circa 7-minütige Tafelübung, Prediction Ledger [GH-K6];
- `Pull, Don't Gate` und Toy-World-Ausrichtung [GH-K3].

**Primär redaktionelle Eigenleistung des NotebookLM-Exports:** formal gegliederte 8-Kapitel-Folge mit Taxonomie, ASCIIs, tabellarischem Vergleich, zusammenfassenden Umsetzungsfragen. Gute Kommunikationshilfe – **keine automatisch verifizierte neue Owner-Schnittstelle**.

**Von NotebookLM neu/zu stark behauptet, nicht zu übernehmen:** konkrete technische JSON-IDs, `SenseFieldMasks` als Runtime-System, exakte automatische Quest-Resolution, ausgeformte E.B.E.-Parameter, eindeutige Fluff-Incident-Ursache.

**Nicht erhaltene wichtige Offenheit:** historische Heim-6D ↔ KFB D6/Farb-Zuordnung weiterhin `UNRESOLVED` [GH-K1]. Quill/Warburg-Bestand aus Dropbox und die bereits vorhandenen `Borromean Mnemosyne Dice` als zusätzliche Donors sind im NotebookLM-Export nicht im selben Maß ausgewertet wie die drei anderen Prüfideen; das ist eine **inhaltliche Gelegenheit**, keine Pflicht zur Erweiterung des Systems.

## 4. Handlungsskizze nach dem Review – eine Szene, nicht ein neues Framework

**Szenenidee `The Harvested Meaning` / DESIGN-only.**

**Bild und Raum:** Eine **tatsächlich registrierte Karte**, die später durch echte PDF-/Card-Bildprüfung ausgewählt wird, wird auf einem bestehenden Diorama-/Scene-POI gezeigt. Ohne realen Bildbeleg kein erfundenes `KFB-CARD-DECK-01-#14`.

**Beat 1:** Lord Hunky verlangt aus nachvollziehbarem Eigeninteresse die Fluff-Ernte. Kein mit Story erklärte Regierungstabelle, sondern eine konkrete Aktion/Requisite.

**Beat 2:** Dory reagiert nicht mit einer Universalerklärung über Liebe, sondern versucht dieselbe Sache mit einem anderen konkreten Gebrauch zu erhalten. Sie kann inkonsequent, abgelenkt oder fehlerhaft sein. Zwei Rollen/Handlungsabsichten, gleiche reale Asset-Identität.

**Beat 3:** Das dritte Bild / eine Archivspur **ändert die Bedeutung**, ohne eine Pflichtvorlesung. Spieler entdeckt, wie das Bild in die drei Szene-Slots passt. Das offene Gutter darf ungelöst bleiben.

**Beat 4:** Spieler wählt einen kleinen **sichtbaren** Eingriff, Schweigen oder Weitergehen. Ein Konsequenzpunkt wird – wenn Owner verifiziert – über bestehende Welt-/Resident-/Almanac-Kanäle angeboten. Der Quest Die **kann** diese dramatische Handlung rahmen; er darf ohne echten Besitzer keine State-Maschine überschreiben.

**Design-Frage für den Paper Test:** Erkennt ein Mensch ohne Nach-Erklärung, dass **dasselbe Objekt gleichzeitig Ressource, Beziehung und Geschichtszeugnis** sein kann, und erzeugt das eine Entscheidung, die Spaß macht?

**Prüfkriterien, noch nicht getestet:**
1. Drei Originalbild-/Card-Identitäten oder ein echter Szenengegenstand samt gültigem Source-Pin, kein Fantasie-Donor.
2. Mindestens zwei **deutlich verschiedene** Spielerhandlungen/Interpretationen aus **gleichem** Objekt.
3. Dritter Quellkontext verändert die Wahrnehmung – nicht nur Farbe oder Tooltip.
4. Keine erfundene neue Ressource/Save-/Quest-State-Machine.
5. Kein verpflichtendes Breathing-/Trance-/spirituelles Diagnostikspiel.
6. Spieler kann nach wenigen Minuten eine in sich verständliche Handlung beschreiben; `PASS` erst nach wirklichem Test.

**Empfohlene Reihenfolge:** (a) Warburg-Triade mit drei source-geprüften echten Karten auf Papier; (b) derselbe Gegenstand in drei Figurenfeldern; (c) erst dann über digitale Ton-/Farb-/Raumtransformationen nachdenken. Keine neue Game-Laufzeit in diesem Review.

## 5. Knapper Reparaturleitfaden für den NotebookLM-Wissensbestand

Am besten das **Original-DOCX nicht still verändern**, sondern als eigenständige, ausdrücklich zu zitierende **KFB Source/Design Critic Note** mit importieren oder durch klar gekennzeichnete additive R1.1-Revision ersetzen.

**Nota bene an NotebookLM / allen Folge-Chats:**
- `This NotebookLM export is a synthesis, not an authority for canon, implementation, or new scientific validation.`
- `Do not treat illustrative JSON IDs, event names, Card IDs, metering systems or UI actions as existent or approved.`
- `Fluff Incident causality, TARDIS room graph and High/Low behavior remain source-specific proposals.`
- `Quest Die 6 means the analog finale follows the next turn; no automatic immediate cleanup is a current source rule.`
- `Supra-Dialog is a provider term; our Two Witnesses exercise is an independent creative proposal.`
- `Treat E.B.E. sensory/ethical encounter requirements as source-unverified until exact documentary source is pinned.`
- `Heim 6D ↔ KFB color mapping is unknown; Gabriel's Sinnfelder are not just private player opinions.`
- `NATHAL 2024 Mathematics article is a review; claimed EEG replication lacks verified primary protocol.`
- `Allow magical, metaphysical, emotionally rich fiction as fiction; avoid asserting its real-world validation.`
- `Game acceptance = source-backed identity + observable action + voluntary play + actual test, not a polished diagram.`

## 6. Source pins (exact GitHub paths read for this review)

- [GH-K0] `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md` @ `main` (aktueller Workflow/NO MVP/STOP für Island R4).
- [GH-K1] `skills/chat/masterplan/FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md` @ `docs/kfb-decisions-register-2026-10-11`: Georgs bestätigte künstlerische Herkunft und `UNRESOLVED`.
- [GH-K2] `Kayfabizarro_Freestyle_Rules_v18-4.md` @ Register: zwei Würfel, **Finale next turn**, bewusstes Quest Move.
- [GH-K3] `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` @ Register: lebenige Toy-World, skalenübergreifende Übersetzung, Residents, `Pull, Don't Gate`.
- [GH-K4] `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/KFB_SIX_DIMENSIONS_FRACTAL_D6_R1/CONCEPT_R1.md` @ `research/kfb-six-dimensions-fractal-d6-r1-2026-10-18`, PR #430: drei getrennte Sechsen, Gabriel/Warburg/NATHAL, drei Gameplay-Richtungen.
- [GH-K5] `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/RESEARCH_KFB_SIX_DIMENSIONS_DECKS_R1/DECK_DONOR_AUDIT_R1.md` @ `research/kfb-six-dimensions-deck-donors-r1-2026-10-18`, PR #433: echte Card Pins / PDF-Paritätsrisiken.
- [GH-K6] `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/KFB_SIX_DIMENSIONS_FRACTAL_D6_R1/PRACTICE_LAB_R1.md` @ PR #430: eigene freiwillige reale Übungen.
- [GH-K7] `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` @ Register: Recovery, R4 STOP, Genesis-Grenzen.
- [GH-K8] `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/META_NARRATIVE_R1.md` und `CONCEPTS_FLUFF_MINIGAMES_R1/OVERVIEW.md` @ Register: Fluff-Genesis, UFO-TARDIS noch später, IDs, keine neuen Ressourcen.
- [GH-K9] `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/RESEARCH_NATHAL_HEIM_R1/RESEARCH_NATHAL_HEIM_R1.md` @ `research/kfb-nathal-heim-consciousness-r1-2026-10-18`, PR #429: Forschung / beanspruchte EEG-/Anbieterwirkungen vs Primärbelege.
- [GH-K10] `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/NOTEBOOKLM_NATHAL_HEIM_D6_R1/NOTEBOOKLM_KFB_KOSMOLOGIE_GAME_CONTEXT_R1.md` @ `research/kfb-nathal-six-dimensions-notebooklm-r1-2026-10-19`, PR #436: separater KFB NotebookLM-Kontext, Stand vor NotebookLM-generiertem DOCX.
- [GH-K11] `skills/chat/meta/CANON_HOME_MAP.json` @ Register: `exactHistoricalD6DimensionColorMapping:null`; Autorenschaft vs Veröffentlichungs- vs Consumer-Parität ausdrücklich getrennt.

## 7. Offenes / genau ein nächstes Gate

**EIN GATE:** **WS0 Source/Design Critic** prüft die zwölf konkreten `F1..F12`-Divergenzen gegen die als `GH-K*` gepinnten Originale; bestätigt nur die nachweislich korrekten Rücksetzungen (etwa Incident- und UFO-Status, Quest-Finale, illustrative JSON-IDs) und pinnt **ein** wirkliches drei-Karten-/Diorama-Probeobjekt mit aktuellen Asset-/Owner-/Bildnachweisen für einen **späteren** freiwilligen Papiertest.

Der Workshop-Bericht wird ohne Merge/Autopromotion als **korrigierende Referenz**, nicht als neue UI-/Lore-/Quest-SSOT, additiv gespeichert. Kein ungetesteter Befund wird „Gameplay PASS“ genannt.
