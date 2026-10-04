# KFB Integration 01 · Ausführungsbrief r1

**Status:** PROPOSED EXECUTION SCOPE · nach World-Gegencheck zu konsolidieren.
**Ziel:** ein zusammenhängender Integrationsrelease vorhandener Werkzeuge und Spiele, nicht acht parallele Neubauten.

## 1 · Produkt und Quellenhierarchie

Georg soll mit vorhandenen KFB-Modulen arbeiten und spielen können, ohne zwischen Chats Quellen, Modelle oder Transformkorrekturen zu transportieren. Astra soll diese Module lokal vorliegen haben, testen, verbinden und den genauen Arbeitsstand dauerhaft sichern.

Implementierung kommt aus dem jeweiligen Projekt-SSOT. Funktionale und visuelle Vorlagen bleiben ausdrücklich benannt; der neueste Testviewer ersetzt keine Produktarchitektur. Ein Integrations-Lock referenziert diese Quellen, der Hub zeigt ihren überprüften Zustand. Rohassets bleiben bei `georg-doc/kayfabizarro`; lokale Caches sind abgeleitete, hashgeprüfte Kopien, keine neue Assetbibliothek.

Für Runtime-Fakten gilt aktueller Code mit belegtem Test; für Produktabsicht die jüngste ausdrücklich zutreffende Nutzerentscheidung. Unauflösbare Konflikte werden benannt, nicht durch eine neue dritte Architektur kaschiert.

## 2 · Vollständige Arbeitsabdeckung

Die folgenden Lanes sind Bestandteile des Auftrags. Die Tiefe der Integration wird pro Lane ausgewiesen; eine funktionierende Verlinkung ist keine Runtime-Integration.

| Lane | In Integration 01 sicherzustellen | Nicht still damit gleichsetzen |
|---|---|---|
| BOX1 / Race / Vehicles | Bestehende Site lokal und öffentlich korrekt erreichbar; 43 gelieferte Kandidaten erhalten; vorhandener WS1-v2-Deformer, Auswahl/Shortlist, Test Lap/Countdown, Originalvergleich, Instrumente, ENV A/B. Konkrete Blocker gezielt reparieren. | Vollständige Fahrabnahme aller Modelle, neue individuelle Physik, Fahrer-Rigs. |
| Audio / Jukebox | Neu eintreffende Original-A1-Quelle übernehmen, Identität und Tests prüfen; in vorhandenes BOX1-Radio integrieren. Bestehende Jukebox/Van Metronome erhalten. | Aus Prosa neu synthetisierte Soundscape, bloß verlinktes Audio-Lab oder zweites dauerhaftes Audio-System. |
| Worldbuilding / Environment | Travel/WB0 lokal starten; POC und produktives World Recipe trennen. Vorhandene Facility-Topologie und Environment zusammen auf reale Anker abgleichen. | Race-Flow-Loop sei schon Facility, World-POC sei Travel-Terrain, Brückendressing erzeuge Kontakt. |
| Residents / Animation | Alle vorhandenen Resident-Rezepte zugänglich halten; an einem konkreten Quellrezept gemessene Pose-/Motion-Bindung und Receiving-Consumer nachweisen. | Bibliothekszugehörigkeit sei Kompatibilität; ein bewegter Darsteller beweise alle Rigs/Clips. |
| Locomotion / Combat Arena | Bestehende Ground-/Flight- und Arena-Starts reproduzieren; bekannte Input-, Root-, Kamera-, Mixer-, Treffer-/Reward-Grenzen dokumentieren und bei echten Übergaben respektieren. Arena im Hub korrekt erreichbar und mit Rückweg. | Arena und Travel seien dadurch eine nahtlose gemeinsame Welt, A2/C1 seien bereits integriert. |
| ToolBox / Studio / Rigging | Stage-First-Originalquelle im ToolBox-Owner promoten, sofern nicht inzwischen geschehen; kompletten Funktions-/Rosterbestand erhalten; einen realen authoring→export→reload→import-Ablauf prüfen. | Neuaufbau aus Screenshots, Redesign um eine QA-Figur, Ersatz des Actor-/Rig-/Face-/Pose-Owners. |
| Asset Librarian / Registries | Bestehenden Discovery-/Candidate-Handoff verwenden; konkret benötigte Assets/Packs/Abhängigkeiten auflösen, bekannte Doku-/Deploy-Drift korrigieren. | Neue Registry, neue universelle Taxonomie oder automatische L5-Freigabe. |
| KFB Hub / Recovery | Bestehenden Hub aktualisieren: geprüfte Einstiege, aussagekräftige Build-/Source-/Statusangaben und offene menschliche Entscheidungen. Ein Link zurück zum Hub ist in den benutzten Pfaden verfügbar. | Neuer Inspector-Hub statt des Produkts, still entfernte DocCheck-/Town-/andere bestehende Einträge. |

## 3 · Ein Integrationslauf mit zwei echten Gebrauchspfaden

### Pfad A · Fahrzeug wählen, fahren, hören, wiederfinden

`Hub → BOX1 → Box Stop → Fahrzeug/Profil → Test Lap → 3/2/1/GO → Fahrt + Environment + Audio → Originalvergleich → Shortlist → Reload → gleiche Auswahl → Hub`.

**WORLD:** dieselbe akzeptierte v0.8-Route mit bestehendem Facility-/Surreal-Dressing; sichtbares Fahrzeug, kompakte Radio-/Tachoinstrumente, klarer Fahrblick. Kein Wechsel zur neuen Topologie ohne deren Freigabe.

**SEQUENCE:** Ladefeedback sofort; Box Stop nur nach bereitem Host; Auswahl erst nach erfolgreichem Modell-/Profil-Laden übernehmen; Cancel erhält gültige Fahrt; Countdown erst nach Bereitschaft; Fahrinput bis GO gesperrt. Titel-/Modellfehler erhalten letzte gültige Auswahl und bieten Retry.

**LIFE:** Karosserie-/Radantwort aus echter Race-Telemetrie, keine doppelte alte und neue Visual-Response. Radio/Tacho reagieren begrenzt und beruhigen sich. Kein Dauerwackeln im Stillstand. Keine hinzugefügten Fahrer-Skelett-Rigs; source-interne statische Figuren korrekt benennen.

**FEEDBACK:** Knöpfe zeigen Fokus/Press/Busy/Erfolg/Fehler. Radio bleibt klein: Musikquelle, Weiter, Lautstärke/Mix, deutliches Mute; Details eingeklappt. Adaptive Musik und Jukebox sind alternative Musikquellen, nicht dauerhaft übereinander laufende Engines. Vehicle/Contact/Environment-SFX bleiben unabhängig von der Musikquelle. Music Off ist nicht Master Mute. Bei Sessionwechsel/Pause/Visibility gibt es keine doppelten Loops, Geistereingaben oder weiterlaufende alte Audioinstanzen.

**Audio-Eingang:** Klangrichtung ist von Georg akzeptiert, Integration autorisiert; vollständige Feature-/Gerätetestabdeckung nicht behaupten. Nach Quellenempfang Originale pinnen und die angegebenen Tests auf tatsächlichen Bytes reproduzieren. Fehlt die Lieferung noch, A1-Lane als SOURCE BLOCKED offenhalten, vorhandene Jukebox erhalten und andere freigegebene Integrationsarbeit fortsetzen. Kein Ersatz-A1 und kein pauschaler neuer Hör-Marathon. Der Gesamt-Audioauftrag bleibt dann unerledigt.

### Pfad B · Vorhandene Szene/Actor-Daten authoren und im richtigen Consumer benutzen

`Hub → Librarian/Atlas → exaktes Resident-/Prop-Rezept → vorhandene ToolBox-/Animation-Nähte für tatsächlich unterstützte Änderungen → Save/Export → Receiving-Consumer → im World/Play-Kontext sehen/benutzen → Reload → dieselbe Komposition → Hub`.

Das ist kein Zwang, jeden Export durch jede App zu schleusen. Zuerst das **bestehende Travel Atlas Pilot 01** bedienen: Lorekeeper mit Tome/lectern und Staff, sieben echte Hex-Zellen, Travel-eigener ROAD-Ansatz, Varianten VISIBLE_HEX / SEATED_HEX / NO_VISIBLE_HEX am selben sphärischen Anker. Die Referenzkomposition und die erreichbare Sammlung bleiben erhalten; das eine Fixture reduziert nicht das Produkt auf einen einzigen NPC.

**WORLD:** reale Figur, zugehörige Props und Habitat/Schwelle zusammen im Travel-Terrain; keine nur vor das Weltbild geklebte neutrale Bühne. Bezug von lokalen Exportkoordinaten zu sphärischer Welt explizit messen. Maßstab, Forward/Up, Hand-/Prop-Frames und Boden-/Oberflächenbezug müssen nach Reload stimmen.

**SEQUENCE:** Quelle wählen → echten unterstützten Export/Recipe übernehmen → Zielvalidierung → explizit platzieren → transformieren → speichern → neu laden → im PLAY erreichen. Unsupported fields führen zu sichtbarem Reject/benannter Lücke, nicht stillem Weglassen. Studio-/Animation-Änderungen benutzen deren vorhandene Exportverträge; keine neue Konfiguration nur für den Demoablauf.

**LIFE:** mindestens ein vorhandener, am konkreten Actor nachweislich bindender Idle-/Motion-Zustand; Start/Stop/Rest und Wechsel ohne doppelten Mixer. Die Bindungs-/Root-Motion-Policy bleibt beim Animation-/Consumer-Owner. Ein Standbild oder ein grüner Binding-Zähler allein erfüllt sichtbare Animation nicht.

**FEEDBACK:** Preview/Accept/Revert, Loading/Retry und Save/Restore müssen sichtbar und verlustfrei sein. Ein Slot-/Clip-/Assetfehler darf die gültige Welt nicht zerstören. Keine unbekannten rigged Parts heimlich durch generische Props ersetzen.

**Bestehende Gates:** Ground=8-Human-Gate und Atlas-Browser-QA sowie die aktuelle Travel-Freigabereihenfolge erneut am World-SSOT prüfen. Diese Übergabe hebt sie nicht auf. Bis zur erforderlichen Freigabe darf Astra vorhandene Quellen reproduzieren, Portabilität/Adapter und Roundtrips auf einem separaten Kandidaten vorbereiten, aber keine gesperrte Folgearbeit oder Production-Promotion als akzeptiert ausgeben. Ist das Receiving-Gate blockiert, das Authoring-Ergebnis separat nutzbar liefern und den fehlenden Consumer-Nachweis ausdrücklich offenlassen. Nicht behaupten, Pfad B sei dann vollständig.

### Arena im gleichen Arbeitslauf, ohne falsche Verschmelzung

Arena 5A/A1 aus seinem eigenen SSOT starten und den existierenden Bewegungs-/Combat-/Restartpfad prüfen; vom Hub erreichbar machen, eigenen State/Return sichern. Eine vorhandene gemessene Actor-/Motion-Übergabe nur dann ergänzen, wenn ihr konkreter Contract und ihre bisherige Freigabe vorliegen. A2-Kartenmodultausch und C1-Driver-Graft nicht gemeinsam verstecken; ungeprüfte Muzzle-/Release-/Foot-Policy ist ein BLOCKER für diesen Tausch.

Ein Arena-Link ist **NAVIGATION INTEGRATED**, kein Travel↔Arena-Portal und keine übertragene Weltphysik. Eine seamless Szene mit gemeinsamen Save-/Koordinaten-/Transition-Regeln ist spätere explizite Arbeit; bekannte Portal-Verträge nicht aus dem Namen ableiten. Bestehende Arena-Animation/Locomotion bleibt trotzdem Teil des lokalen und Hub-Regressionsnachweises.

## 4 · Facility und Dressing als gemeinsames Design

Die neue Facility ist keine Rückkehr zu v0.9. Es existiert bereits ein v0.10-Blockout mit MAIN/PIT, separatem SPLIT/MERGE, OVERPASS und unterer Route. Aktuellen Return lesen, keine zweite Topologie daneben erfinden.

Race definiert befahrbare Flächen, Route, Breite, Höhe, Entry/Exit, Service-/Stall-/Startframes und Support-/Clearance. Environment nutzt dieselben Frames für Boxengebäude, Tribünen, Rhythmik, Terrain und Himmel. Bei Dressing OFF bleiben Route/Kontakt identisch; eine Brückenunterfahrt darf nicht durch Terrain aufgefüllt werden. Beide Environmental Recipes beziehen sich später auf dieselbe freigegebene Facility, nicht auf zwei neu erfundene Kurse.

Der befahrbare Facility-Transfer beginnt erst nach der bestehenden menschlichen Topologie-Freigabe. Solange sie fehlt: gemeinsame Anchor-/Clearance-Planung und kontrollierter Datenadapter erlaubt, veröffentlichte BOX1-Fahrt bleibt v0.8. Der spätere hereinfallende Box-Stop-Button konsumiert den echten Pit-Entry und öffnet das vorhandene Overlay. Er erfindet keinen Boxengassenkontakt.

Die echte Stuntrampe mit Absprung, Luftphase, Landung und sicherer Umfahrung bleibt explizit erfasste Folgearbeit, nicht durch die Brückenauffahrt oder den vorhandenen Space-Sprung als erledigt markiert.

## 5 · Oberflächen und Populationen erhalten

BOX1/Atlas: vorhandene KFB-Atlas-Gestaltung, kein DocCheck-Rot. ToolBox: aktuelle Stage-First-Quelle und deren funktionale/visuelle Hierarchie, kein global erzwungenes BOX1-Dark-Theme. Historische Studio-Regeln zu Paper/Light und späteren Stage-First-Entscheidungen müssen bei Konflikt durch den ToolBox-Owner aufgelöst werden; nicht einfach den neueren Dateinamen gewinnen lassen. DocCheck-Projekte behalten ihre eigene zurückhaltende Akzentkonvention; ihre Bilder werden nicht umgefärbt.

ToolBox-Funktionen Actor/Face/Pose/Motion/Voice/Stage samt Speech/Bubbles, Resource Picker, Import/Export und vorhandenem Roster bleiben auffindbar. Der Intake nennt 35 ToolBox-Einträge, 21 Resident-Rezepte plus Ensemble, 43 BOX1-Kandidaten; vor Umsetzung aktuell nachzählen. Kein Vier-Figuren-Demoersatz. Rig-/Studio-Spezialfunktionen werden zugänglich gehalten, nicht alle innerhalb dieses Slices neugeschrieben. Such-/Filterzustände dürfen weitere Einträge einklappen, nicht löschen.

Desktop, ca. 832 px Split-Screen und für spielerseitige Bedienung schmaler Touch-Viewport sind erste Zielkontexte. Kein Zusammendrücken dreier Inspector-Spalten. Fahrt/Stage bleibt dominant. Neue UI-/Spieltexte Englisch; Produktionskommunikation Deutsch.

## 6 · Bauweise und Autonomie

Astra bestimmt sinnvolle interne Arbeitsschritte innerhalb dieses Zusammenhangs. Kein neuer Genehmigungsdialog für jeden normalen Codefix. Kein autonomes Unteragenten-Schwarmprogramm, keine neue bezahlte Infrastruktur und keine Repo-Migration aus diesem Brief. Ein aktiver Executor mit begrenztem Arbeitsplan; Claude/World liefern abgegrenzte Inputs.

Verträge zuerst **lesen**, nicht zuerst abstrahieren. A0 bleibt AssetRef / TransformSlot / Surface / Connector / RecipeEnvelope; kein ECS-/Physik-/Universal-Actor-Framework. Gemeinsamen Code erst nach echter Mehrfachnutzung und gleichen Lebenszyklus-/Semantikbedingungen extrahieren. Three-Versionen der Hosts dürfen verschieden bleiben; .160- und .184-Szenen nicht zwanghaft in denselben Objektgraphen laden. Übergreifende Grenzen transportieren unterstützte Daten, keine Renderer-/Mixer-/Controller-Instanzen.

Vorhandene Scripts/Workflows erweitern. Lokale Tests zuerst; GitHub CI als unabhängige Regression. Nicht für jede Datei einen neuen Reparatur-/Publish-Workflow erzeugen. Bei wiederholtem identischem Infrastrukturfehler Ursache eingrenzen, nicht im Minutentakt neue Releases anstoßen. Pro zusammenhängendem geprüften Release ein konsistenter Publish; Source-Commit, Build, Deployment und ausgelieferter Marker getrennt prüfen.

## 7 · Was der Abschluss enthalten muss

- Ein rekonstruierbarer lokaler Multi-Repo-Workspace mit nachgewiesenen Zugriffsrechten, konkreten Revisionen, Startwegen und Recovery-Test; keine Geheimnisse im Repo.
- Aktualisierter **bestehender** Hub mit allen Lanes und echten URLs/Versionsständen. Bestehende nicht betroffene Projekte bleiben sichtbar. Kein grüner Gesamtstatus aus einem erfolgreichen Linkcheck.
- Ausgeführte Pfade A und B einschließlich Consumer-/Save-Nachweis oder präzise benannte noch offene Teilstrecken. Wenigstens ein echter neuer Producer→Consumer-Daten-/Runtime-Nachweis; nur Startlinks und Dokumentation sind kein produktiv abgeschlossener Integrationsslice.
- Start-/Grundregression für die übrigen vorhandenen Lanes, mit Not-run-/Source-blocked-Kennzeichnung statt Fake-Demos.
- Ein kleiner Integrations-Lock und eine Release-Zusammenfassung, die auf die bestehenden Registry-IDs und Owner-Returns verweisen. Kein zweiter dauerhaft manuell gepflegter Asset-/Projektkatalog.
- Source-/Adapterdeltas, originale Returns, Testbefehle, Resultate, Screenshots und kurze reale Ablauf-/Animationscaptures. Relevant: kalter Start, mindestens 20 Navigations-/Mount-Zyklen für Eingabe/Audio/Mixer-Leaks, Quelle fehlt, Import kaputt, Revert, Reload, mobile Bedienung. Falls ein Test nicht sinnvoll ausführbar ist, konkrete Lücke nennen, nicht die Zahl simulieren.
- Per Repo reviewbare Commits/PRs, Rollbackweg und eine nächste Aktion. Vorhandene Archivierungslimits beachten. Originale unverändert behalten, keine neuen ZIP-Pakete für Georg.

## 8 · Erfolg präzise benennen

Je Lane ausweisen: SOURCE LOCATED / LOCAL BOOT TESTED / NAVIGATION INTEGRATED / DATA-ROUNDTRIP TESTED / RUNTIME-CONSUMER TESTED / PUBLIC DEPLOYED / HUMAN ACCEPTED / OPEN. Diese Grade sind Ergebnisfelder, kein neues globales Maturity-System; A0-L5 bleibt pro Consumer.

Integration 01 ist erst vollständig, wenn sein bestätigter Umfang sichtbar funktioniert, abgesichert und aus GitHub rekonstruierbar ist. Er darf als nützlicher Teilstand enden, wenn eine echte Quelle oder menschliche Freigabe fehlt; dann lautet der Abschluss **PARTIAL / BLOCKED**, mit geliefertem Nutzen und konkreter Restnaht, niemals pauschal DONE. Das Briefing selbst behauptet keine dieser Ergebnisse.
