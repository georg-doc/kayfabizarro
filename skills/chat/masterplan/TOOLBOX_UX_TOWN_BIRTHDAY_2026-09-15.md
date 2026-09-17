> **2026-09-18 STATUS OVERRIDE:** Birthday-specific execution in this addendum is **FAIL / OUTDATED / ARCHIVED HISTORY**. Do not use sections 3 or Birthday execution language as current scope. ToolBox UX observations and Makerspace/cinema ideas may remain reference/donor material only after current-owner verification. Current ToolBox brief: `tools/KFB-ToolBox/_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md`.

# ToolBox UX · Wiedereinstieg, Geburtstagsauftakt und Town-Kino

Stand: 15.09.2026. Kommentiertes Masterplan-Addendum, kein neuer Runtime- oder Town-SSOT.

Quelle: Georgs in diesem Chat übermitteltes WS0-Onboarding `ONBOARDING_TOOLBOX_UX_CHAT_v1.md` und seine anschließenden Gestaltungswünsche. Die Aussagen über den laufenden Claude-Design-Workspace sind **SOURCE REPORT von WS0**, keine hier wiederholte Browserprüfung. Neue Szenenbehandlungen sind **PROPOSAL**, ausdrücklich übernommene Nutzerrichtungen sind **DECISION / DIRECTION**. Keine neuen Town-J-Kennungen.

Repo-Abgleich: `georg-doc/kayfabizarro@525288d67a9fdfd94caacf19e47b4ba333dc1ca2`. [Gesamtmasterplan](../LIVING_MASTERPLAN.md) · [Town-Living](../town/LIVING_KFB_TOWN.md) · [ToolBox-Einstieg](../../../tools/KFB-ToolBox/START_HERE.md).

## 1 · ToolBox: gleicher Authoring-Workspace, frischer Chat, A vor B

**Bestätigte Richtung:** A und B bleiben zwei getrennt abgenommene Ergebnisse. **Empfohlener und zur direkten Verwendung formulierter Arbeitsort:** ein frischer Chat im bestehenden Claude-Design-Projekt, das die lebenden Quellen enthält. Das volle alte Gespräch wird nicht weiter belastet. Die ToolBox übernimmt anschließend den geprüften Export, sie baut die Werkzeuge nicht parallel nach.

**A: vollständiger, kaltstartfähiger Quellstand mit echtem Delta.** Vor dem UI-Umbau den jetzt funktionierenden Stand unverändert sichern. Das Delta erklärt die Änderungen; der vollständige relevante Laufzeitbedarf macht sie übernehmbar. Vergleich gegen die unveränderlich gepinnte Referenz `tools/KFB-ToolBox/kfb-rigs-embed-v3/` am oben genannten Repo-Commit, nicht ausschließlich gegen eine möglicherweise inzwischen bearbeitete lokale Kopie gleichen Namens. Die lokale `export/`-Fassung ist zuerst auf Identität zu prüfen.

Drei Belege getrennt liefern: Daten erhalten; Felder tatsächlich angewandt; Darstellung sichtbar gleich. A wird im leeren Exportordner geprüft, ohne versteckte Workspace-Nachbarn und warme Caches. Bereits bestätigte Fehler nicht blind nochmals reparieren. Beim R1-Abgleich ausschließlich die sechs erlaubten PartRig-Felder übertragen und den Rückgabestatus auswerten; keine Prüfung abschalten.

**B: ein gemeinsamer, workfloworientierter UI-Pilot auf denselben Modulen.** Select → Shape & Look → Attach & Fit → Motion & Talk → Export. Carl wählen, Originalnase einstellen, benannte Materialzone färben, Talk und Ruhe prüfen, Profil exportieren und im unabhängigen Embed vergleichen. Dann derselbe vollständige Weg am FB-Driver mit Graft-Parts und vorhandenem Clip. Kein flächendeckendes Redesign aller Werkzeuge vor diesem Beweis.

B besitzt die gemeinsame Bedienung und Session-Führung, nicht neue Rig- oder Materialwahrheiten. Vier Ausgaben unterscheiden: **Profil speichern · Consumer-Paket · Vorschaubild · Video**. GLB ist nicht automatisch prozedurales Actor-Verhalten. Welche HTML-Flächen eine Aufnahme tatsächlich enthält, muss am gelieferten Render-/Capture-Weg geprüft werden. Keine ungespeicherten Entwürfe verlieren, kein geteilter Materialcache wird durch einen Einzel-Actor-Farbregler verändert, kein zweiter Mixer durch einen Tabwechsel gestartet.

Prüfgrößen aus WS0: 1440×900, 1024×768, 768×1024, 390×844; zusätzlich geteiltes Fenster und Browserzoom. Roboto mit System-Fallback für die Bedienoberfläche, keine Brand-Schrift in Reglern oder Messwerten. Artwork und Wortmarke bleiben eigene Flächen. UI und neue spielerseitige Texte englisch, Arbeitsdokumente deutsch.

Routineablage, Links, Manifeste und Prüflisten selbstständig bündeln. Rückfragen nur bei echten Produkt-, Owner-, Contract-, Kosten- oder Quellenentscheidungen. Bestehender Arbeitsauftrag bleibt ein zusammenhängender A/B-Auftrag, keine erneute Reihe von Einzeltickets.

### Quellenkorrekturen aus WS0, nicht zurück auf den alten Annahmestand fallen

| Thema | Korrigierter Status nach WS0 |
|---|---|
| Recherchewürfel / Recherchi | Gebaut im Workspace, sechs Materialschächte mit bedienbarem HTML; **kein CSS3DRenderer**. Den früheren CSS3D-Vorbehalt nicht auf diesen Bau anwenden. Die genaue HTML-/Input-Brücke bleibt im Export zu lesen, nicht aus BoxGeometry abzuleiten. |
| Recherchi-Messbank | Die im Studio-Kommentar behauptete separate Messbank existiert laut WS0 nicht. Vorhandene Werkzeuge und die Zwei-Figuren-Probe dürfen Prüfmittel sein; keine fehlende Recherchi-Datei erfinden. |
| Animation Lab | Workspace meldet v3 statt des früheren v2-WIP. `Walking_A` meldet 69/69 gebundene Spuren am Graft, 0/69 an Carl. Das ist der benannte Vergleich, keine generelle Compatibility-Abnahme aller Clips. |
| Studio / Rigging | Studio meldet vier Bewohnerklassen Graft, Carl, Pilli, Recherchi; Rigging Lab meldet Farben und Oberflächen für 21 Carl-Zonen. Noch kein hier neu verifizierter ToolBox-Release. |
| Librarian | Georgs jüngste Rückgabe und der gelesene Merge benennen **Asset Librarian v1.5**, Commit `525288d6…`. Die frühere pauschale v4-Angabe nicht als Release-Pin fortführen. Fester Einstieg laut Rückgabe: `https://kayfabizarro.pages.dev/asset-librarian/`. Browser-/Cloudflare-PASS sind in dieser Runde berichtete Ergebnisse, nicht selbst wiederholt. |

P0 abgerundete Würfelecken, P1 Schwebehöhe und P3 Mund im Chat-Feld bleiben laut `BRIEFING_PROP_ASSETS_v1.md` offen. Prop-Motion-Vorrat, Bleistift/Radiergummi und Dance sind nachgeordnet; sie blockieren A/B nicht. Ein gemeinsamer Bauweg heißt nicht, Graft-, Carl-, Cube-Pet- und Prop-Klassen zwangsweise durch dieselbe Mount-Funktion zu schicken. Bestehende Leser und Kanal-Owner erhalten.

### Starttext für den frischen Design-Chat

> Arbeite im bestehenden Claude-Design-Projekt mit den lebenden Quellen. Lies dort `ONBOARDING_TOOLBOX_UX_CHAT_v1.md`, den relevanten Einstieg in `CLAUDE.md` und das vorhandene Delta-/UX-Paket. Ergebnis A zuerst: unveränderten aktuellen Stand sichern, echtes Delta gegen die gepinnte GitHub-Referenz ermitteln, vollständigen Laufzeitbedarf exportieren und aus einem leeren Ordner starten. Die lokale Exportkopie ist nur dann die Baseline, wenn ihre Identität belegt ist. Recherchi ist laut WS0 gebaut; keinen CSS3D-Umbau und kein erfundenes Recherchi-Lab ansetzen. Nach separater A-Abnahme Ergebnis B: UX-Kritik am echten Carl-Weg und ein gemeinsamer Pilot auf denselben Modulen, einschließlich Profil-/Session-/Export-Verhalten. Danach FB-Gegenprobe. Keine Einzelfreigaben für Routineablage. ToolBox bleibt Empfänger für Integration und Veröffentlichung. Town-Geburtstag und Kino sind keine Zusatzaufträge dieser UX-Runde.

## 2 · Übergaben: kleiner Einstieg, große Quellen nur bei Bedarf

**Empfohlener Arbeitsweg:** kurzes Delta im Chat plus konkreter GitHub-Dateipfad und Commit. Unveröffentlichte Übergabe als einzelne Markdown-Datei; kompletter ZIP-Export für Sicherung und tatsächliche Codeübernahme. Nicht denselben Volltext gleichzeitig einkopieren, anhängen und erneut abrufen.

Ein sinnvoller Einstieg nennt fünf Dinge: Quelle/Revision, Auftrag, neue Änderungen, offene Entscheidung, erster Lesepfad. Keine universelle Wort- oder Token-Grenze. Ein Anhang ist kein kontextfreier Speicher: OpenAI beschreibt für Enterprise sowohl eingefügten Dateitext als auch selektive Suche. Daraus wird hier **keine** genaue Grenze oder Kostenersparnis für Georgs Modell/Tarif abgeleitet. Auch abgerufener GitHub-Text ist gelesener Kontext. Einsparung entsteht durch gezielte Auswahl, nicht durch den Speicherort allein.

GitHub bleibt für unsere gemeinsame Produktion der dauerhafte Referenzort. Der alte `HOUSEKEEPING`-Einstieg warnt bereits ausdrücklich vor Volllektüre und fordert START/PROJEKTE/MODULE vor gezielter Chroniksuche. Das wird hier fortgesetzt, nicht als neues Orchestrierungssystem ersetzt.

## 3 · Geburtstagsauftakt: die neue Spielerfigur betritt Town

**DECISION / DIRECTION von Georg:** Wortmarke oben, bunte Subline und Pet-Select-Wheel aus dem vorhandenen RollerCoaster-Vorbild wiederverwenden. Figuren sitzen oder schweben auf KFB-Cards. FrizzleBob ist die ursprüngliche spielbare Figur. Zu Elisas 18. Geburtstag kommt die von ihr wählbare Figur als besondere neue Spielerkarte hinzu; der Start führt in KFB Town als Hub.

**Namensdisziplin:** Die Asset-Reihe heißt **KayKit**, Autor **Kay Lousberg**. Audioformen wie K-Kid/K-Kids sind keine neuen Produktnamen. Der bisherige Assetname im Librarian-Stand ist **GothGirl**. Georg sagt im Transkript Ghost Girl; bis zu einer ausdrücklich anders gemeinten Figurenwahl die Zuordnung zu GothGirl prüfen, nicht einen Ghost-Charakter erfinden oder Dateien umbenennen. FrizzleBob ist der gemeinsame Driver-Graft, nicht der alte Cube-Hase. Cube-Pets und eigenständige Würfel-/Prop-Characters bleiben unterscheidbar.

**SOURCE LOCATED, historisch:** `skills/KFB Setup Game Design/KFB Design-Bootstrap_v02/MODULE.md`, §2, beschreibt `build/rollercoaster-v10/pet-select.v7.js`, `class PetSelect(stage, opts)`, Ausgang `onSelect(petId)` nach `select → celebrate → transition`. Genannt sind horizontales Karussell, Overshoot, zum Spieler gedrehtes Fokus-Pet, schwebendes Kartenpodest und erst nach der Bewegung erscheinende Blase. Eingebunden war es als `rc-pet-select` in Rollercoaster Ride v11.

Das belegt einen benannten Wiederverwendungsweg, **nicht** den aktuellen Code von Georgs v13-Screen. V13-Quellpfad, Wortmarken-/Subline-Module und dessen Renderer-Abhängigkeiten müssen vom Original-Owner gepinnt werden. Keine stille Herabstufung auf v11 und keine Übernahme seiner alten Pet-Liste oder Narrator-Freischaltbedingung. Keine Renderer-Migration für die Übernahme des Auswahlablaufs.

**PROPOSAL für eine vollständige Inszenierung:** ruhiger Start mit FB auf seiner Card; neue Sonderkarte fährt ins Wheel und wendet sich; GothGirl wird sichtbar, ein kurzer Geburtstagscue betont die 18 und führt wieder in ruhige Auswahl. Vorschlag für Copy: “Happy 18th Birthday, Elisa!” und optional “Birthday Edition”. „Super Rare“ ist Georgs Gestaltungsanregung, noch keine festgelegte Seltenheitsökonomie. Kein Zufallsgewinn, Kaufzwang oder Grind für das Geschenk.

Die neue Figur wird hervorgehoben, aber nicht gegen Elisas Wahl automatisch zum Avatar. Vorschau, bestätigte Auswahl und Start in Town sind getrennte Ereignisse. Geburtstagscue ist überspringbar und bei Bedarf wieder abspielbar. Kein Datum oder serverseitiger Freischaltzeitpunkt ist bekannt; einen solchen nicht aus der Zahl 18 erfinden. Die 18 bezeichnet den Geburtstag, keinen Character-Level. Ein noch fehlender Surf-Clip ist kein Grund für eine misslungene Zwangspose: zunächst gemessene Stand-/Hover-Platzierung auf der Card.

**Erster möglicher Town-Lieferbogen, kein neuer Auftrag an ToolBox:** Einstieg → Geburtstagscue → zwei wählbare Figuren → mit der bestätigten Figur in die kleine Siedlung starten → eine freiwillige Begegnung. Regenbogen, Luftballons und Feststimmung gehören zur Geburtstagsvariante, nicht zur Umdeutung der gesamten Town in einen Jahrmarkt.

Die vorige Chat-Idee einer abgeflachten Globe-Landfläche bleibt **PROPOSAL**, keine vermessene Terrainentscheidung und kein neuer Controllerauftrag. Ebenso keine neue Lotzahl oder Hex-Kachelpflicht. Der hier geprüfte Town-Pfad trägt weiterhin den früheren Stand mit §11; spätere Town-Sessions vor Geometrieentscheidungen synchronisieren. Keine alte Datei über deren aktuelle Arbeit schreiben.

## 4 · Makerspace und Town-Kino / Autokino

**DECISION / DIRECTION:** Ein Außenraum beim Makerspace kann Leinwand, optional einen alten Filmprojektor, dezente Lichtinszenierung und ein paar Fahrzeuge als Treffpunkt tragen. Dort sollen Filme, YouTube, bedienbares HTML, Three.js-Beispiele und der bestehende PDF-/Card-Viewer Platz finden. Gemeinsame TikTok-/Doomscrolling-Abende sind ein späterer Ausblick.

**SOURCE REFERENCE:** Die früheren Overworld-Dokumente beschreiben schon `MediaSurface { ar, type: card|video|three|html, src, frame }` und einen Reveal-Einstieg. Status dort: entschieden, nicht damit schon als universeller Web-Player gebaut. Der genaue frühere Academy-Embed ist noch nicht gepinnt. Vor Neubau diese Quellen und den jetzt gebauten Recherchi-Inputweg lesen. Die Leinwand bekommt keinen zweiten PDF-Viewer und keine neue Actor-Produktion.

**PROPOSAL für die räumliche Rolle:** tagsüber Werkstatt und Demonstrationsfläche, abends derselbe Ort als Kino. Die Fahrzeuge machen das Autokino erkennbar; kein vollständig neues Verkehrs-/Parkspiel nötig. Der Turm bleibt Orientierung, der Makerspace behält seine Aufgabe. Ein Projektormodell ist Ausstattung, keine Voraussetzung für eine funktionierende Leinwand.

**Bedienung vor Illusion:** Anschauen, bewusst in Inhalt eintreten, danach wieder in Town zurückkehren. Textfokus und Demo-Eingabe dürfen nicht gleichzeitig Town-Bewegung steuern. Optional dieselbe Fläche frontal vergrößern, ohne das Dokument oder den Entwurf neu zu laden. Seitenverhältnis aus dem Inhalt, nicht alles in das Kartenformat pressen. Fremde HTML-Seiten können Einbettung untersagen; dafür einen ehrlichen externen Öffnungsweg vorsehen, nicht einen angeblich bedienbaren Screenshot. YouTube nutzt den vorgesehenen Playerweg. Die Technik wird am tatsächlichen Donor geprüft, nicht vorab auf CSS3D, Materialtexturen oder einen Universal-iframe festgelegt.

Regenbogen, Feiercues und Projektorlicht dürfen Look/Feel ergänzen, ersetzen aber nicht die Lesbarkeit. Keine pauschale globale Aufhellung der Travel-Welt für eine Leinwand.

**Scope:** Ort mit NPC-Publikum und lokalem Player ist nicht automatisch eine synchronisierte gemeinsame Sitzung. Echtes gemeinsames Anschauen braucht später ausdrücklich Sitzungs-/Playback-Synchronisation. Das wird getrennt geplant und blockiert den Geburtstagsstart nicht. Towns Runtime, ChatterBox, Actor-Module und Medien-Consumer behalten ihre Owner.

## 5 · Quellen und Statusgrenzen

- WS0-Handoff vom 15.09.2026: von Georg vollständig im Chat bereitgestellt. Autorbericht über seinen Workspace, keine hier erhaltene komplette Codebasis.
- `tools/KFB-ToolBox/AGENTS.md`, `START_HERE.md`, `docs/CONTRACTS.md`: vorhandene Owner-, Quellen- und Exportgrenzen.
- `skills/KFB Setup Game Design/KFB Design-Bootstrap_v02/MODULE.md`, §2: gezielte historische Pet-Select-Provenienz. Kein aktueller globaler Bootstrap.
- `skills/chat/town/START_HERE.md` und `LIVING_KFB_TOWN.md`: ein Town-Living-Stand; dieses Addendum liefert Zulauf und Abgleich, keine neue J-Liste.
- Asset Librarian v1.5: Merge `525288d67a9fdfd94caacf19e47b4ba333dc1ca2`, vorherige Nutzerrückgabe; Discovery/Framing nicht mit Animation-Lab-Kompatibilität gleichsetzen.
- Hochgeladener `MASTERPLAN_overworld` §4.2 Content-Surfaces: historische Konzeptquelle, nicht heutiger Town-Vertrag.
- OpenAI, Dateiverarbeitung: https://help.openai.com/en/articles/10029836-optimizing-file-uploads-in-chatgpt-enterprise . Nur das dort beschriebene Prinzip verwendet, keine Tarif-/Tokenzahlen übertragen.
- Offizielle Schreibweisen: https://kaylousberg.com/game-assets .
- Einbettungsgrenze: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors .
- YouTube-Player: https://developers.google.com/youtube/iframe_api_reference .

## Additiver Changelog

2026-09-15 · SOURCE REPORT: drei WS0-Korrekturen aufgenommen: gebauter Recherchi ohne CSS3D; fehlende behauptete Recherchi-Messbank; getrennte A-/B-Abnahmen mit gemeinsamer JSON-/Session-Seite in B. Keine neue Browserprüfung.

2026-09-15 · DIRECTION: A vor B bestätigt; frischer Chat im bestehenden Authoring-Projekt als konkreter Startweg formuliert. ToolBox bleibt späterer Empfänger. Gepinnte Baseline statt bloß gleichnamigem lokalen Export empfohlen.

2026-09-15 · CORRECTION: Librarian-v4-Annahme aus dem früheren Briefing durch gemeldeten und per Merge lokalisierten v1.5-Stand präzisiert. KayKit/Kay Lousberg geschrieben; GothGirl-Zuordnung vor abweichender Namensvergabe beachten.

2026-09-15 · DIRECTION / PROPOSAL: Geburtstagsfigur und Pet-Select-Reuse sowie Makerspace-Kino aufgenommen. Die detaillierte Inszenierung bleibt Vorschlag; weder Town-Layout noch aktive Runtime-Owner verändert.

2026-09-15 · NOT TESTED: keine Codebasis exportiert, kein UI-Pilot gebaut, kein Geburtstagsscreen, keine Kino- oder Multiplayer-Runtime und kein Deployment durch diese Dokumentationsrunde.
