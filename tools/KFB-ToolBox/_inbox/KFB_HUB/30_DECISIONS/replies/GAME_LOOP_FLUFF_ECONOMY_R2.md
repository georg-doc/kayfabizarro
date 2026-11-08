# KFB Game Loop & Fluff Economy R2 · 29.10.2026

**Status: PROPOSAL / KFB Game Design Webchat · NOT DECIDED · NO RUNTIME / NO PLAYTEST.** Weiterentwicklung von `GAME_LOOP_R1.md` (15.10.), nicht dessen stillschweigende Ablösung. Ein einzelner begrenzter Design-Slice; nächste Session kann additiv R3 liefern. Keine Änderung an `DECISIONS.md` oder kanonischen Karten/Regeln vor Georgs Entscheidung.

**Owner der Konzeptdatei:** KFB_HUB / 30_DECISIONS, WS0/Georg als Design-Entscheider. **Spätere Consumer:** WS1 (bestehender World-/Progression-Owner), Combat Arena (eigener Combat-Owner), Almanac/Card-Owner, PR #356 nur als Fluff-Worker-Motion-Donor. Keine zweite Fluff-Runtime und kein zweiter Wallet-/HP-Owner.

## A · Eine Seite: Was tut der Spieler, warum und wozu?

**Spielversprechen:** Ein „chill & fun cosmic roadtrip“ durch bewohnte Knetwelten. Der Spieler wird durch Figuren, Karten, Landmarken oder kuriose Vorfälle angezogen, reist gern, interveniert nach eigener Methode und hinterlässt **eine sichtbare Veränderung**. Die Karte hält fest, *was* er erlebt hat; Fluff erlaubt, *was er als Nächstes verändern* kann. Spielspaß entsteht aus Fahrt, physischer Cartoon-Reaktion, sozialen Gegensätzen und dem überraschenden Resultat — nicht aus dem Füllen einer Leiste.

**Kernschleife (freiwillig, nicht linear):** **Entdecken → Anlass wählen → Reisen → Eingreifen (sammeln / befreien / helfen) → Fluff und/oder echte Karte erhalten → eine Entscheidung über Verwendung treffen → Ort/Resident sichtbar verändern → Almanac merkt sich Herkunft → nächste Einladung.**

| Zeitskala | Erlebbarer Ablauf | Erfolg für den Spieler |
|---|---|---|
| 5–20 Sekunden | Kügelchen springen beim Drift auf, eine Fassade platzt auf, ein NPC widerspricht oder ein kaputtes Ding nimmt wieder Form an. | Ein verständlicher, taktiler Cartoon-Effekt mit unmittelbarer Reaktion. |
| 10–20 Minuten | 1 selbstgewählter Anlass, 1 lustiger Reiseabschnitt, 1 Hauptaktion plus ggf. Nebenfund, 1 Verwendung der Beute, 1 sichtbarer Abschluss. Kein Timer. | Eine erinnerbare kleine Episode; eine Karte, eine Beziehung oder ein Platz sieht anders aus. |
| Über Tage | Neue echte Karten/Decks, Lieblingsorte, Bewohner-Reaktionen, Song/Move, Werkzeuge und reparierte Dioramen; Welt/Almanac behalten provenance und Veränderungen. | Rückkehr lohnt, ohne Daily-, Hunger- oder Pflichtgrind. |

**15-Minuten-Beispiel (Protopia ↔ Utopia-Rand, nur Designhypothese):**
0–2 min: Ein Farmer zeigt ein defektes Beet; im Hintergrund fahren Utopia-Saug-Bots Fluff zur Station. Der Spieler darf weiterfahren.
2–5 min: Fahrt/Drift mit Musik und Billboard; Windfall liefert 3 Fluff, eine kleine Fundstelle 3 weitere.
5–9 min: Spieler kann die ausbeutende Plastik-Lieferung knacken **oder** dem Farmer helfen/handeln; erste Route setzt 4 Fluff aus Kunststoff frei, zweite gewährt ungefähr gleichwertige Hilfe-Belohnung. Keine Pflicht, einen NPC zu bekämpfen.
9–12 min: Kurze Begegnung mit Farmer und Werkbank; 2 Fluff aus sozialem Abschluss, bei beiden Routen insgesamt **12** Fluff als hypothetische Session-Ausbeute. Zusätzlich 1 Holz als Materialfund.
12–15 min: Spieler **wählt**: 6 Fluff (alle sechs Story-Modes) für eine noch fehlende echte Karte bei Hexe/Alchemist **und** 3 Fluff + 1 Holz für das Beet-Reparieren (3 Rest); oder er spart für ein größeres Bauprojekt. Beet bekommt Farbe/Animation zurück, Farmer reagiert, Almanac protokolliert Fund und Eingriff. Keine explizite Quest-Erfolgsanzeige nötig, wenn die Szene eindeutig ist.
15–20 min optional: weiterfahren, Song hören oder eine neue Einladung annehmen. Die 15-Minuten-Grenze beendet niemals die freie Welt.

**Drei gleichwertige Wege zu Fortschritt:**
1. **Wanderer/Collector:** Fluff-Fallobst, Farm, Angeln, Fundstücke, kurze Geschicklichkeitsmomente, Karten entdecken.
2. **Liberator:** mit vorhandenen Waffen/Mech *ausbeuterische Goo-/Utopia-Konstruktionen* aufbrechen und gebundenen Fluff freisetzen; Goo reinigen; nicht beliebig Häuser/Residents für XP zerstören.
3. **Maker/Social:** Botengänge, Handwerk, Reparatur, Trading, NPC-Geschenke und das Kneten von Karten. Jede zentrale Karte hat einen friedlichen Erwerbsweg.

Das ist kein moralisches Dreiklassen-System. Derselbe Spieler darf pro Minute zwischen Wegen wechseln. **Zerstören kann befreien; Heilen bringt Farbe und Beziehungen zurück.** Eine bloße Explosion ohne Weltbezug ist *keine* erzählerische Befreiung.

## B · Minimalökonomie: ein ausgebbares Wallet, kein Ressourcen-Salat

**Gesicherte bestehende Semantik:** 6 Fluff-Farben = 6 Story-Modes (Tragic `#3e6a83`, Comic `#7a8d4a`, Absurd `#e9c14a`, Heroic `#d97c3a`, Mystical `#6b4e7d`, Forbidden `#a64670`). Jede Zone kann alle sechs anbieten, mit gewichteter Hauptfarbe. Bereits diskutiertes Rezept: **1 jeder Farbe → 1 noch fehlende, echte Karte**. `deckId + cardNumber` bleibt eindeutig, kein Duplikat, Card bleibt Almanac-/Provenance-Objekt statt Wallet-Gegenstand. High/Low bleibt zunächst Daten-/Look-Dimension, **keine zweite spielaktive Währung, keine Gut/Böse-Wertung**.

**Unbedingt trennen:** Die ältere Overworld-Linie nennt **Fluff = abgeleitete HP** (`4 + Summe/3` aus sechs Stats), `POP` ist dort Fortschritt. Die neueren Fluff-/Crafting-Entwürfe behandeln **sammelbaren Fluff als Wallet**. R2 verwendet für die Wirtschaft nur `collectibleFluffByStoryMode` als *Konzeptname*, nicht als freigegebenes Runtime-Schema. HP/POP werden weder abgebucht noch automatisch konvertiert. Erst vorhandene Owner klären, ob und wie dies später im HUD zusammenlebt.

### Einnahmen (alle Zahlen sind Balancing-Startwerte, nicht Register-Entscheidungen)

| Tätigkeit | Hypothetischer Ertrag | Was die Handlung zusätzlich erzählt |
|---|---:|---|
| Windfall/Bäume/Beete oder Drift durch Fluff | 2–4 Fluff | Wo Fluff wächst, wer ihn pflegt; Baum bleibt gewöhnlich erhalten, Nachwachstum. |
| kurzer NPC-Botengang/Hilfe | 2–4 Fluff **oder** echte Karte | Beziehungen und konkrete Zielorte statt Quest-Marker-Farmen. |
| kontaminierte Fläche reinigen / Goo-Bindung lösen | 2–4 **freigesetzte** Fluff | Tinte weicht, Materialfarbe und Resident-Verhalten kehren zurück. |
| vorhandene ausbeuterische Plastik-/Fabrik-Sektion zerlegen | 3–5 **freigesetzte** Fluff | Academy/Utopia-Erntekreislauf wird physisch umgekehrt; kein doppelter Reward fürs gleiche Objekt. |
| Mine, Angeln, Cartoon-Bombe, Mimic-Minibegegnung | 2–4 Fluff und ggf. 1 Material | Risiko ist cartoonige Überraschung/Zeit, nicht Bestrafung. |
| Social-/Performance-Beat oder Geschenk | 0–2 Fluff, häufig stattdessen Karte/Musik/Move | Nicht jede Aktivität muss Geld drucken. |

### Ausgaben (ebenfalls ausdrücklich PROPOSAL)

| Verwendung | Startkosten | Dauerhafter Effekt / Grenze |
|---|---:|---|
| kleine lokale Reparatur / Ent-Goo-en eines Gegenstands | 2–3 Fluff | Objekt/Resident wird sichtbar farbiger/aktiver; einmaliger Zustandswechsel statt Endlos-Farm. |
| Beet/kleines Brücken- oder Standstück instand setzen | 3 Fluff + 1 Holz | sichtbare Reparatur und neuer Anlass/Interaktion; Material = Form, Fluff = Lebendigkeit. |
| Werkbank: kleiner eigener Prop / optionaler Diorama-Ausbau | 4 Fluff + 1 Holz oder Erz | optische/personale Veränderung, kein Pflichtbau vor dem Reisen. |
| Hexenkessel/Alchemist: **noch fehlende echte Karte** | **6 Fluff (je 1 Farbe)** | Almanac mit Quellen-Receipt; vor Ausgabe vorhandene Karte prüfen; andere Kartenquellen bleiben offen. |
| NPC von Infektion reinigen (später) | 2–3 Fluff | Befall/Ink-Layer löst sich und NPC reagiert; **FUTURE_SCOPE** aus V-665/V-679, keine garantierte Implementierung. |
| kosmetische Umfärbung/kurzer Spielzeug-Effekt | 2–4 Fluff | Optionaler Spaß-Sink ohne Powercreep. |
| Eigenheilung | **nicht bepreist** | Konflikt mit `Fluff = HP` in Overworld; erst Combat-/Progression-Owner klären. |

**Holz/Erz sind keine zusätzlichen Währungen:** nur physische Form-Zutaten für bestimmte Bauvorhaben. Kein Gewicht, keine 12 Slots für Fluff; vorhandene 20 Bag-Slots sind für besondere Items, Karten im Almanac. Sammeln beim Laufen/Fahren, perspektivisch Fliegen. Ein einmal freigelegtes Fluff-Paket darf durch Zerstören/Respawn/Save-Reload nicht unendlich neu gebucht werden. Spawn-Regeneration bleibt gemütlich, aber deterministisch und bezogen auf Quellenzustand.

**Preis-Fairness-Hypothese:** Eine 15-Minuten-Sitzung soll typischerweise 8–14 Fluff ergeben; damit ist **mindestens eine bedeutsame Ausgabe** möglich, auch ohne Kampf. Ausgaben ändern sichtbare Weltzustände; Wallet-Stand allein zählt nicht als Progression. Keine Zahlung, um Inseln betreten, Dialoge führen oder die Golden Journey fortsetzen zu dürfen.

## C · Bedeutungs- und Owner-Vertrag

- **Karte:** echtes KFB-Quellobjekt + Herkunft; keine Zufallskarte ohne Deck-JSON, keine zweite Card-Identität. Botengang, Kessel und freigelegte Karte sind alternative Wege zum **selben** Canonical Card Receipt. Ein abgeschlossenes Deck darf später Song/Performance/Bonus auslösen (R1/V-279) — kein hartes Insel-Tor.
- **Fluff:** bunte, physische Knetmaterie, die in Geschichten zwischen Quelle, Bots, Fabrik, Plastik, Bruch und Reparatur kreist. Academy-Ernte → Utopia-Fertigung → mechanische Zerstörung → Fluff ist bereits als Meta-Kreislauf beschrieben (V-480). Hier keine globale Massenbilanz simulieren: sichtbare lokale Transformation und nachvollziehbare Zustände zuerst.
- **Goo:** Befall ist ein späteres Event-/Encounter-System; „heilen bringt Farbe zurück“ taugt bereits als Wirkungsidee. Keine heimliche Ausweitung von V-665 auf jetzt.
- **Resident:** reagiert auf eine konkrete Handlung, nicht als Loot-Automat. Farmer, Bot, Hexe, Lorekeeper behalten bestehende Charakter- und Memory-Owner.
- **World/Build:** WS1 konsumiert die später freizugebenden Designwerte; Construction-/Damage-/Transfer-Zustand bleiben technisch getrennt. PR #356 liefert Motion-Donors, nicht das Economy-System.
- **HUD:** maximal sechs farbige Wallet-Punkte/kompakter Fluff-Zähler bei Interaktion; keine neue permanente Leistenwand. HP, Karte, POP und Fluff müssen semantisch eindeutig sein. **Keine HUD-Implementierung in diesem Slice.**
- **PULL, DON'T GATE:** alle Inseln frei; Ausgaben bieten Lieblingsorte, Karten, soziale Reaktionen, Styling und sinnvolle Handlungen, aber kaufen keine Erlaubnis zum Weiterreisen.

## D · KFB Game Improvement Lab: Evidence Scout, fünf Perspektiven

**Evidenzart:** ausschließlich GitHub-Quellenprüfung (`EVIDENCE_SCOUT`), **NO BUILD / NO HANDS-ON PLAYTEST**. Die fünf Disziplinen sind Perspektiven **eines** Chats, keine fünf unabhängigen Tester.

| Perspektive | Befund / Beitrag |
|---|---|
| Playtester / Scout | `EXPERIENCE_GAP` für den geplanten Produktkern: R1 bietet sieben Kartenquellen, aber noch keinen klaren kurzfristigen Ausgabemoment. Im aktuellen Island-R4-Projekt ist volle Ökonomie dagegen `NOT_IN_SCOPE`, **kein bestehender Runtime-Defekt**. |
| Art Director | Reparatur/Goo-Wegnahme muss beim realen Objekt Farbe, Silhouette oder Bewohnerreaktion sichtbar verändern; keine abstrakte FX-Wolke als Ersatz für einen reparierten Ort. |
| Animation Director | Harvest, collect, knead, push, patch, celebrate aus PR #356 wiederverwenden; erst Quelle isolieren und Consumer prüfen, keine neuen Clips für R2. |
| Game Designer | Eine Sitzung benötigt einen **konkreten, selbstgewählten Grund** zum Fahren und eine nachvollziehbare Konsequenz. Karten allein als Loot oder 12-Fluff-Statbar ohne soziale Szene tragen den Roadtrip nicht. |
| 3D Developer | Ein bestehender WorldObject-Zustandswechsel + Wallet-Transaktion + vorhandener Card-/Almanac-Receipt wäre der kleinste spätere technische Beweis; getrennte Owners, idempotente Loot-Buchung, kein neues World-System. |

**Abwägung:** Destruction als Standard ist sofort spektakulär, bedroht aber Chill, Bewohnerlogik und die Aussage „Befreien“. Reiner Kurier ist sanft, lässt Knetphysik/Mech ungenutzt. **Empfehlung: Hybrid mit freier Wahl der Eingriffsform**, und jeder Eingriff endet in einer sichtbaren sozialen/baulichen Reaktion.

## E · Falsifizierbarer erster Test (erst nach eigenem Runtime-Auftrag)

Ein einziges source-gestütztes Protopia-POI mit Farmer, Beet, Fluff-Fundort, vorhandener Sammel-/Motion-Darstellung, echtem Almanac-Card-Receipt und Save/Fresh Reload. Keine zusätzliche Insel, kein universelles Crafting-System. Prüfen:
1. **10-Minuten-Frage:** Kann ein neuer Spieler ohne Tutorial selbst erkennen, warum er anhalten, helfen und wiederkommen könnte?
2. **Fairness:** Kommt er ohne Kampf in ca. 10–20 Minuten zu einer bedeutungsvollen Verwendung? Nicht jeder muss craften.
3. **Wirkung:** Erkennt er im Vorher/Nachher den tatsächlich reparierten Gegenstand und seine Reaktion, nicht nur +3 Fluff?
4. **Kontinuität:** Nach vollem Reload ist der reparierte Zustand erhalten; bereits gebuchte Beute wird nicht erneut ausgezahlt; dieselbe echte Card erscheint nur einmal.
5. **Spaß:** Welche der drei möglichen Handlungen möchte er freiwillig wiederholen? Offene Beobachtung, kein erfundener PASS.

**Teststatus dieses Dokuments:** Quellen gelesen; gedanklicher Beispiel-Budget-Check `3 + 3 + 4 + 2 = 12`, `12 - 6 - 3 = 3`; **0 Runtime-Tests, 0 Browser-Tests, 0 echte Playtests, 0 abgeglichene Balancing-Daten**.

## F · Offene Entscheidungen / Grenzen

- **D1:** Ist das sichtbare *Welt-Verändern* die bevorzugte dauerhafte Belohnung neben echter Karte/Almanac, statt primär Unlock-/Power-Fortschritt? (Designvorschlag, keine vorgespielte Entscheidung.)
- **D2:** Sechs Farben im Wallet und zunächst kein spielaktives High/Low? `FLUFF_WORLD_DRESSING_R1` favorisiert sechs Sorten; ältere High/Low-Vorschläge bleiben source-traceable.
- **D3:** „1 von jeder Farbe → fehlende Karte“ als Startrezept: angenehm oder zu mechanisch? Alternative Kartenwege bleiben wichtig.
- **D4:** Wie spiegelt sich selbst heilen in einem System, in dem ein älteres Overworld-Fluff schon HP bedeutet? **Nicht still lösen.**
- **D5:** Nachwachstempo und idempotentes Loot: erst im echten POI testbar. Keine verbindlichen Zahlen aus diesem Papier.

**Explizit OUT OF SCOPE:** 12 Waffen balancieren, 10–15 Encounters implementieren, Infectious-Goo-Runtime, vollständige Gebäudezerstörung, Map-Generation, zweites UI, App/Site/Cloudflare-Stage, R4/R5-Restart, Main-Merge.

**Genau ein nächstes Gate:** **GEORG DESIGN TUNE/PASS auf R2s Kernfrage „Spieler verändert einen konkreten Ort“ plus sechsfarbiges Wallet**. Danach einen einzigen read-only / Papier-Balancing-Pass mit 2 Alternativ-Sessions machen; Runtime nur nach separater Owner-Freigabe.

## Quellen / Konflikt-Herkunft (keine neuen Canons)

- `replies/GAME_LOOP_R1.md` – Kartenquellen, Abgabe/Deck-Song, drei Varianten; statusoffener Vorschlag.
- `replies/BRIEF_WEBCHAT_GAME_DESIGN_R1.md` – 10–20 Minuten, Chill & Fun, Bestand, 2–3 Kernmechaniken.
- `replies/FLUFF_WORLD_DRESSING_R1.md` – sechs D6-Farben, 1-von-jeder-Kartenrezept, alle Farben überall, Nachwachstum.
- `replies/CONCEPTS_FLUFF_MINIGAMES_R1/OVERVIEW.md` – v0.3–v0.7.1, Wallet/HP-Trennung, Lorekeeper, Crafting, Karten-Identität, alternative friedliche Wege.
- `replies/SPEC_FLUFF_SUCTION_R1.md` – V-480 Academy→Utopia→Plastik→Zerstörung→Fluff; V-484 UFO-Sauger.
- `replies/BACKLOG_BLACKFLUFF_INFECTION_R1.md` – V-665/V-679, späterer Befall/Heilung.
- `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` – PULL, DON'T GATE, Karten als Herkunft/Prompts statt numerischem Loot.
- `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` – Inselbeziehungen und Korrektur: Lebensbaum überall / High-Low-Mechanik nur Proposal-Level.
- `skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.md` – volle Ökonomie **LATER**, Island R4 STOP/NO MVP.
- `overworld/docs/LIVING_CONCEPT_overworld.md`, `overworld/docs/GLOSSAR_KFB.md` – älteres Overworld-Fluff als abgeleitete HP.
- `skills/chat/KFB_ACTIVE_WORK_MAP_2026-10-04.md`, PR #356 – Fluff Worker Motion/Construction-Vorgeschichte (kein Wallet-Owner).
