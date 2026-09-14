# KFB · Infinite Canvas, Erzähler und neue Spielrichtungen

Stand: 14.09.2026
Status: DECISION für Georgs ausdrücklich genannte Gestaltungsrichtung; PROPOSAL für die nachstehenden Umsetzungsvorschläge; keine Runtime-Implementierung.
Quelle: Georgs Chat-Ergänzung nach dem WS0-Meta-Kompendium und der Meta-Narration-Sammlung.
Quellenprüfung: `georg-doc/kayfabizarro@fc287e236fba078856f503f3e6d7db4371ce5737`.

Dieses Blatt ist ein verlinktes Masterplan-Addendum, kein neuer Kanon-Master. [Canon Home Map](../meta/CANON_HOME_MAP.json) nennt gefundene Quellen und offene Zuhause. Der [Gesamtmasterplan](../LIVING_MASTERPLAN.md) und die Projekt-SSOTs behalten ihre Aufgaben. Town-J- und Lab-L-Kennungen werden hier weder ersetzt noch neu vergeben.

## 1 · DECISION: Infinite Canvas of the Tenth Art bleibt die gemeinsame Klammer

Georg verlangt, die Infinite-Canvas-Ideenwelt mit Scott McCloud, Preston Blair, Aby Warburg, Markus Gabriels Sinnfeldern und Burkhard Heims sechs Dimensionen als Bezug zur farbigen KFB-D6-Logik fraktal mitzudenken. Satirische Emergenz und Closure beim Spieler gehören dazu. Das ist nicht auf das Museum beschränkt und wird nicht als bloße spätere Museumsfunktion abgelegt.

Die historischen Bezugstexte und ihre genaue Zuordnung bleiben zu pinnen. Die folgende Zuordnung ist ein **redaktioneller Arbeitsvorschlag**, keine Behauptung über eine bereits beschlossene Gleichsetzung dieser Autoren:

| Bezugslinie | Frage für die KFB-Gestaltung |
|---|---|
| Scott McCloud | Welche Lücke zwischen Bildern oder Handlungen schließt erst der Spieler? |
| Preston Blair | Wie werden Absicht, Timing und Körperhaltung sichtbar, ohne sie zu erklären? |
| Aby Warburg | Welche Beziehung entsteht durch die Nachbarschaft und Neuordnung von Bildern? |
| Markus Gabriel / Sinnfelder | Wie verändert derselbe Gegenstand seine Bedeutung im jeweiligen Kontext? |
| Burkhard Heim / sechs Dimensionen / D6 in Farbe | Wie greifen die vorhandenen sechs KFB-Perspektiven und ihre Farbzuordnungen über Maßstäbe ineinander? |

Die konkrete Tabelle `Dimension ↔ D6-Seite ↔ Farbe ↔ Perspektive` ist hier **UNRESOLVED**. Keine sechs Farben oder Dimensionsnamen aus dem Gedächtnis ergänzen. Die vorhandene Zuordnung der sechs Story-Modes zu FB-Registern ist separat belegt und ersetzt diese noch fehlende Tabelle nicht.

**Fraktal ist eine Gestaltungsanforderung.** Die Beziehung von Figur, Karte, Page, Deck, Raum, Town und Welt muss bei Entwürfen mitgedacht werden. Das bedeutet nicht, unbemerkt jedes System auf sechs Elemente zu reduzieren oder unterschiedliche Verträge zu einem Manager zusammenzuziehen. Wiederkehrende Operationen sind beispielsweise auswählen, gegenüberstellen, umdeuten, betreten, erinnern und neu kombinieren.

**Closure bleibt beim Spieler.** Eine angebotene Lesart darf angenommen, abgelehnt oder durch eine Spielhandlung verändert werden. Satire soll aus Konstellationen und Konsequenzen entstehen, nicht aus einem nachgeschobenen Erklärsatz des NPCs. Die bestehende Lab-Sammlung bleibt Herleitung und PROPOSAL für Town, soweit Town eine konkrete Idee noch nicht übernommen hat.

## 2 · DECISION: Triplet-NPCs dürfen entspannt und unterhaltsam sein

Georgs Richtung lautet ausdrücklich `chill & fun`. NPCs sind keine dauerredenden Erklärmaschinen und nicht alle FrizzleBob mit anderem Modell. Eine Stimme hat Rolle, Blickwinkel und Situation. Stille, Zuhören, eine kurze Reaktion und Weggehen sind gültige Zustände.

**Vorschlag zur Nutzung des Bestands:** Figurenidentität und Erzählerarchetyp wählen den Blickwinkel; die Begegnung liefert Anlass und Beat; vorhandene ChatterBox-/Triplet-Bausteine setzen Sprache und Performance um. Gemeinsame Beats bedeuten keine neue zweite Dialogarchitektur und keinen zweiten Mouth-/Eye-/Talk-Owner. Eine soziale Reaktion muss keine LLM-Anfrage auslösen.

### Tatsächlich wiedergefunden

- `media/prompts/narrator/`: zwölf konkrete Tier-/Stimmen-Archetypen als Markdown, darunter Bunny/Carny, Cat/Skeptic, Fox/Trickster, Panda/Sage sowie Wabi-Sabi, Mono-no-aware, Yugen und Polyphony. Die komplette Liste und der Tree-Pin stehen in der Home Map. Vorhandensein ist keine aktuelle Integrationsabnahme.
- `media/prompts/frizzlebob_modes.md`: sechs spielbare Story-Mode-Zuordnungen plus ein ausdrücklich internes Snark-Register. Die Datei nennt sich selbst Laufzeit-Kopie des Authoring-Skills. `media/prompts/narrator/frizzlebob_modes.md` hat am Prüfstand denselben Blob. Keine dieser Kopien wird hier zum neuen Authoring-Master erklärt.
- `media/prompts/NARRATOR_PORT_B4_v1.md`: vorhandener Port-/Wiring-Referenzpfad. Aktuelle Aufrufer müssen beim Consumer geprüft werden.

### Noch nicht vollständig gepinnt

`KFB Game Sim → FrizzleCrits` ist als konkrete Source-/Caller-Kette noch nicht zugeordnet. Die erfolglosen gezielten Repo-Suchen beweisen keinen Verlust. Die aufgefundenen Narrator-Dateien belegen nicht automatisch FrizzleCrits.

Zu `Hunky & Dory / Cancel This Planet` sind einschlägige Produkt-, Voice-, Director-, Kamera- und Presentation-Dokumente in der File Library auffindbar. Ein eindeutiges editierbares GitHub-Zuhause ist damit noch nicht belegt. Die Home Map bewahrt die Titel als Suchhinweise, nicht als erfundene Repository-Pfade. Die beiden Figuren, ihre Asymmetrie und eine eigenständige Erzählerrolle bleiben getrennt. Keine vorzeitige Angleichung an FB oder generische Alien-NPCs.

## 3 · DECISION / BACKLOG: Travel-Skydome, Quaternius und UFO-Aliens

Georg möchte Quaternius-Sci-Fi-Material im Travel-Skydome in einem kommenden MVP nutzen, dazu UFO-Rigs für Carl-/Pill-Frankenstein-Aliens. Als Antagonistenrichtung benennt er diese Aliens neben den Clowns als FBs eigentliche Feinde. Konkrete Fraktionszugehörigkeiten und Encounter-Regeln folgen erst im zuständigen Spielkontrakt. CapsuleCarl als DocCheck-Presenter und Hunky/Dory werden dadurch nicht automatisch feindlich.

**Quellenfund:** `media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/`.
- `Environment/GLTF/Planet_1.gltf` bis `Planet_11.gltf` sind vorhanden.
- Ebenso `Plant_1.gltf` bis `Plant_3.gltf` sowie Bush-/Grass-Varianten.
- `Vehicles/GLTF/` enthält vier benannte Spaceships und drei Rover. Ein dediziertes UFO-Modell ist in diesem geprüften Vehicles-Teilbaum nicht gelistet; daraus folgt keine Abwesenheit im gesamten Assetbestand.
- Environment-Tree: `718d14b244f7220c42443857f9f19d1461d2f4c8`.
- Vehicles-Tree: `6b124ac6507cc187d8c3671c6050d6f460111065`.

Die Eingabe `quaternius scifi tion plants` bleibt als Suchform erhalten. Für den Skydome sind **Planeten** eine naheliegende Interpretation, Pflanzen existieren jedoch ebenfalls. Die Auswahl darf diesen Unterschied nicht still entscheiden.

**Vorschlag für einen späteren zusammenhängenden Sky-Slice:** vorhandene Planeten/Umgebung mit Deck-Mood verbinden, einen Pill-Alien mit gemessenem UFO-Fit zeigen und die Begegnung lesbar machen. Ein vollständiges neues Luftkampfsystem ist damit nicht automatisch beauftragt. Das bestehende Bath-MVP und seine Owner werden nicht erweitert.

ToolBox liefert Actor und Part-/Vehicle-Fit; Animation Lab die nachweisbar verfügbaren Bewegungs-/Talk-Kanäle; Travel behält World, Kamera und aktive Bewegung; Combat-Verhalten bleibt beim jeweiligen dokumentierten Combat-Owner. Keine neue Flugphysik im Rig.

## 4 · DECISION / BACKLOG: Pappkameraden auf Spielbrett-Basen

Georgs zusätzliche Mini-Game-Richtung: Politiker, Stars und Prominente als freigestellte Public-Domain-Fotos auf Pappaufstellern, getragen von KayKit-Spielbrett-Basen. South-Park-artig ist hier die begrenzte Cutout-Bewegung gemeint, nicht ein neuer Vollkörperrig oder eine Kopie vorhandener Serienfiguren. KFB-SFX, einfache hüpfende Bewegungen und satirische Pop-Spielstände gehören dazu.

**Gefundener Basis-Donor:** `media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/playerstand.gltf`, dazu `playerstand_blue/green/purple/red/yellow.gltf`. Passende `.bin`-Dateien müssen mitgeführt werden. Tree: `617d0d287bc5de2525feaf0ce50f56be727fa467`. Die Dateien sind lokalisiert, noch nicht vermessen oder im neuen Mini-Game gerendert.

**KISS-Umsetzungsvorschlag:** Aufsteller + Base + ein gemeinsamer Bewegungsroot. Hop, Lean, kleiner Drehimpuls, Treffer-Settle und stille Pause zuerst. Gegebenenfalls ein Talk-Puls ohne behauptetes Lippen-Sync. Kein Skinning nur für einen springenden Pappaufsteller. Vorder-/Rückseite und Seitenlesbarkeit gezielt prüfen statt unbemerkt permanent zur Kamera zu drehen.

Das Wort `Lulls` aus Georgs Eingabe bleibt als Gestaltungshinweis erhalten. Seine konkrete Rolle als Figurenname oder Bewegungs-/Pausenbegriff ist noch nicht festgelegt. Existierende Ruhe-/Idle- und KFB-SFX-Donors vor Neubau prüfen.

Die Fotos erhalten pro Datei Herkunft, Urheber soweit bekannt, konkreten Public-Domain-Nachweis und Bearbeitungshinweis. Ein prominentes Motiv macht das Foto nicht automatisch Public Domain. Erfundenes Figuren-Sprechen bleibt als satirische Inszenierung erkennbar, nicht als angebliches Originalzitat. Hier werden noch keine Fotos beschafft oder veröffentlicht.

Die Pappkameraden sind eine **zusätzliche Darstellungsform für diese Mini-Games**, kein stiller Ersatz für den gemeinsamen FB-Graft, sämtliche KayKit-NPCs oder CapsuleCarl. Spielereignisse lösen Motion, KFB-SFX und Pop beim bestehenden jeweiligen Owner aus. Kein zweites globales Punktesystem; eine konkrete Pop-Regel bleibt PROPOSAL bis zur Spielabnahme. Towns bisheriger Verzicht auf dauernde Zahlenanzeigen wird dadurch nicht aufgehoben.

## 5 · Nächster Quellenabgleich, ohne Kanon-Umzug

Der bestehende WS0-Quellenhalter kann die offenen Zuhause gezielt ergänzen: Layer Zero, Global Intent, Infinite Comic, Almanac, Game Sim/FrizzleCrits, Hunky/Dory und die D6-Dimension-Farb-Tabelle. Pro Fund genügen Originalpfad, Revision/Hash, tatsächlicher Aufrufer oder publizierte Ableitung und abweichende Kopien. Erst danach wird ein vorhandenes Zuhause bestätigt oder ein Umzug vorgeschlagen.

Keine neuen Vollkopien der Master, kein zweiter Town-Living-Stand, keine automatischen Änderungen an aktiven Spiele- oder Actor-Verträgen. Die Home Map ist der Index; dieses Addendum hält die neue Absicht und offene Vorschläge fest.

## Additive History

2026-09-14 · DECISION: Georg verankert Infinite Canvas of the Tenth Art, die fünf genannten Bezugslinien, fraktales Mitdenken, satirische Emergenz und Spieler-Closure als gemeinsame Gestaltungsrichtung.

2026-09-14 · SOURCE READ: Narrator-Dateien und FB-Mode-Map gefunden; ihre Authoring-Master und die konkrete Game-Sim/FrizzleCrits-Kette nicht vollständig gepinnt.

2026-09-14 · SOURCE LOCATED: Quaternius-Planeten/Pflanzen/Spaceships und KayKit-playerstand-Basen per Repository-Tree lokalisiert. Kein Render-/Gameplay-PASS.

2026-09-14 · BACKLOG: Sky-/UFO-Pill-Alien-Richtung und Pappkameraden-Mini-Games aufgenommen. Keine Umsetzung oder automatische Erweiterung des laufenden Bath-Slices.
