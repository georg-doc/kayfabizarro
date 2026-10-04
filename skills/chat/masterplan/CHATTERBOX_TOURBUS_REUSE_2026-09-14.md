# KFB · ChatterBox, Tourbus und wiederverwendbare Weltreaktionen

Stand: 14.09.2026. Auftrag: Georgs 17 Anhänge analysieren und in Masterplan sowie Town-Ideation einordnen. Den neu gewählten Truck auf grundsätzliche Bearbeitbarkeit ohne Blender prüfen, noch nicht konvertieren oder umbauen.

Status: **CURRENT_REFERENCE / kommentiertes Masterplan-Addendum**. Quellenaussage, heutiger Befund, Nutzerauswahl und Vorschlag sind getrennt. Keine neue Produktionsreihenfolge, kein Runtime-SSOT und kein neuer ChatterBox-Master.

GitHub-Prüfstand: `georg-doc/kayfabizarro@6181ac0cada6972a2454cc740a380cf3cc02397a`. [Quellenindex](../meta/CHATTERBOX_TOURBUS_SOURCE_INDEX_2026-09-14.json). [Town-Living](../town/LIVING_KFB_TOWN.md). [Gesamtmasterplan](../LIVING_MASTERPLAN.md).

## 1 · Ergebnis des Quellenabgleichs

**Die ChatterBox ist kein ungebauter Gesamtentwurf.** Die Anhänge enthalten echte v10-Implementierung, ältere Aufträge, spätere Korrekturen und noch offene Ideen. `LÄUFT` in einem historischen Return bleibt dessen Abnahmebehauptung; es ist kein heutiger Browser-PASS und keine Travel-/Arena-Abnahme.

Von den 17 Anhängen stimmen sieben mit den gezielt verglichenen Repo-Dateien im Git-Blob-Hash überein. Acht unterscheiden sich von ihren verglichenen Repo-Gegenstücken; zwei haben in dieser Prüfung kein eindeutig zugeordnetes Repo-Gegenstück. Die zwei hochgeladenen Overworld-Masterpläne sind selbst verschiedene Snapshots. Der neuere der beiden präzisiert K1: eine behauptete Zahl ist nicht dasselbe wie ein echter Spielwert. Diese Präzisierung wird nicht durch den älteren pauschalen Zahlenfilter im NIE-Hook aufgehoben.

Die mitgelieferte `HOUSEKEEPING(1).md` wurde gezielt als Chronik gelesen, insbesondere §§00-v13, 00-v9, 4y und 4z-F, nicht als heutiges Onboarding. Sie warnt selbst vor dem veralteten v10-Masterplan. Sie berichtet außerdem spätere Blasenarbeiten in v13 und weitere v14/v15-Entwicklungen. Im Repo sind die v13-Quellen und ein v14-Freeze-Paket vorhanden. Keine der Versionsnummern ersetzt die Ermittlung des tatsächlichen aufrufenden Hosts.

**Konsequenz:** die Anhänge werden als Donors ausgewertet, nicht über die Repo-Versionen kopiert. Die bestehende Grenze bleibt: Inhaltsarbeit/semantischer Upstream, Präsentation und Consumer-Spielzustand besitzen unterschiedliche Aufgaben.

## 2 · Was bereits vorliegt und was noch nicht

| Baustein | Befund | Wiederverwendung |
|---|---|---|
| `chatter-phrases.js` | Acht Fraktions-/Biomstimmen mit `ton`, `idle`, `ueber`, `antwort`, `frage`, `philo`, `spott`, `handel`, `emote` und sparsamen Tätigkeitsgedanken. Repo-Fassung ist nicht identisch zum Upload. | Stimmenstruktur und Datenfelder übernehmen; konkrete Zeilen sind nicht automatisch aktuelle Golden Samples. Kein neuer Voll-Dialogbaum. |
| `chatter-2d.js` | Quellenwahl und Textausgabe für Ambient, Antworten, Flüche und Interaktionsanlässe. Repo enthält zusätzlich einen `synthese`-Zweig. | Vorhandenen Auswahlweg adaptieren, nicht eine zweite Chatter-Laufzeit danebenbauen. Seed-Fehler aus §3 zuerst prüfen. |
| `mob-ai.js` | Verweildauer, Wahrnehmung, Lenkung, Neugier, Sozialkontakt, Antworten, Rufreaktionen und begrenzte Sprecherzahl. | Verhaltensmuster und Scheduler als Donor. Seine 64px-Welt, Kollision und Kampfaufrufe nicht als universelle 3D-KI importieren. |
| `bubble-ts.js` v10 | Bedienbare DOM/SVG-Blase, vier Formen, Messung vor Text-Reveal, Kopfanker, Totzone und Nachziehen. Upload ist byteidentisch zur verglichenen v10-Repo-Datei. | Existenz belegt, aber nicht bester ungeprüfter Exportstand. Die nachgewiesenen v13-Nachfolger zuerst lesen. |
| v13 `bubble-layout.js` + `bubble-ts.js` | Ausgeglichener Umbruch, fünf benannte Register inklusive `kayfabulate`, echte Schriftmessung und getrennte Layoutwerte sind im Code vorhanden. Die Chronik beschreibt zusätzlich die gemeinsame Canvas-Ink über SVG-Fläche/Interaktion. | Bevorzugter Vergleichskandidat für Layout/Präsentation. Kein automatischer CURRENT_TOOL-Status und kein heutiger visueller PASS. |
| `identity.js` | Name, optionale Titel, append-only erworbene Titel und Ruf-Schmähung; Titel sind keine Kampfboni. | Soziale Wiedererkennung und Besitzprinzip übernehmen. Historische Schwellen −3/−9 bleiben Consumerwerte, keine neue Town-Regel. |
| Runner / `hud-v7.js` | Tatsächliche Aufrufer für Anreden, Blasen, Identität und Story-Anlässe. Beide Uploads unterscheiden sich vom verglichenen Repo-Stand. | Aufrufer und Besitzgrenzen prüfen, nicht den alten HUD-/RPG-/Input-Stack in Travel transplantieren. |
| `narrator-2d.js` im Repo | Bereits ein Offline-Erzähler für Caption-Auswahl und Afterglow aus Spielstand vorhanden. Kein TTS-Modul. | Mechanik als Donor für Erinnerung; altes Drei-Ton-Modell und Legacy-Leveltext nicht zur aktuellen D6-/POP-Wahrheit erklären. |
| `NIE_ADAPTER_HOOK.md` | Request/Response-Form ausdrücklich HOOK, nicht gebaut. | Vertrag lesen, statt ihn erneut erfinden. Laufzeit und Annahmeprüfung sind nicht durch das Dokument geliefert. |
| TTS/STT, Wiseguy, Oracle/Slot-Machine, Sonderorte | Unterschiedliche offene Konzepte, nicht durch die sieben JS-Anhänge als fertige Gesamtfunktion belegt. | Gezielt routen; keine Liste vermeintlich bereits fertiger Apps. |

Im v13-Layout stehen `cps:34` und berechnete Standzeiten. Im v10-Overlay steht `CPS=55`; die älteren Aufgaben verlangen erst einen 15-CPS-Feinschliff. **Diese Zahlen nicht vermischen:** Reveal-Tempo, Lesezeit und Lebensdauer einer bedienbaren Blase sind verschiedene Fragen und hängen am jeweiligen Stand.

## 3 · Zwei konkrete Fallen, die nicht mitwandern dürfen

### TESTED RESULT · Card-Priorität im v10-Upload widerspricht dem Kommentar

Die angebliche Bevorzugung einer vorhandenen Card setzt:

`const w=(z&&z.card&&rnd()<0.45)?0.99:rnd();`

Die Card wird danach aber nur bei `w<0.68` verarbeitet. Der ausdrücklich vermeintlich bevorzugte Zweig überspringt also die Card. Eine Node-VM-Probe am unveränderten Upload mit Card-Marker und konstantem Zufallswert `0.1` ergab eine generische Camp-Zeile, `card:0`, `faction:1`. Die Positivkontrolle mit `0.6` ergab die Card-Lore, `card:1`.

Die gleiche problematische Bedingung wurde in der geprüften Repo-Fassung `overworld/overworld/chatter-2d.js`, Blob `fa2941fa54e1f1c0727623eabd4e97acd34b6c75`, gelesen. Der ganze Repo-Runner wurde hier nicht ausgeführt; die Aussage gilt nicht pauschal für andere Forks oder die heutige Travel-Runtime.

**Folge für eine spätere Adaption:** Card-Seed-Priorität anhand tatsächlicher Ausgabe prüfen, nicht anhand von Kommentaren oder historischen PASS-Texten. Kein Fix im Originalmodul in diesem Dokumentationsauftrag. [Reproduzierbare Probe](evidence/chatterbox-tourbus-2026-09-14/probe.cjs), [Ergebnis](evidence/chatterbox-tourbus-2026-09-14/PROBE_RESULTS.json).

### SOURCE HISTORY · Die v10-Flüsterkante darf nicht ungeprüft als erledigt gelten

Der Upload fordert `dashedPathD` und `card-dash` vom Kanon, liefert bei fehlender Fähigkeit aber eine leere Kontur. HOUSEKEEPING §4y / Naht 115 beschreibt genau diesen Fehler im damaligen geladenen Host. Spätere Einträge 121/122 führen erst Maskierung und dann die geteilte Canvas-Feder ein. Deshalb keine neue dritte Ink bauen und nicht zum älteren stillen Leerstring-Fallback zurückkehren. Der tatsächliche v13-Importpfad und seine sichtbare Kante brauchen beim Consumer eine eigene Prüfung.

Zusätzlich getestet: alle sieben hochgeladenen JS-Dateien bestehen `node --check`; im isolierten Identitätstest bleibt ein bereits verdienter Titel nach Wegfall seiner Bedingung erhalten und wird nicht nochmals gemeldet. **Syntax und isolierte Logik sind keine Browser-Abnahme.**

## 4 · Verbindung zu NPCs, Mobs, Enemies und unserem bestehenden Actor

Die Quellen liefern die Rollenfolge **NIE → Performance-Maske → ChatterBox → Bubble/Emote/TTS**. Das ist ein Routingbild, kein Anlass für vier neue Engines.

Bei Wiederverwendung bleibt der jeweilige Spielhost Eigentümer von Verhalten, Beziehung und dem Anlass. Der Textweg liefert Inhalte; die Präsentation begrenzt sichtbare Sprecher. ToolBox/Actor-Rig und Animation Lab behalten Look, gemessene Pose und ihre dokumentierten Bewegungs-/Talk-Kanäle. Ein gemeinsamer Beat kann Text und Acting auslösen, aber kein Dialogtext schreibt eigenständig Driver-Bones, Flugbewegung, Schaden oder Rewards.

Das historische Ruhebudget lautet zwei Ambient-Blasen in der Welt, eine je Zone; Antworten dürfen den Zonendeckel, nicht beliebig den Weltdeckel überschreiten. Eskalation ist begrenzt, darüber können reine Glyphen stehen. Die **eine bedienbare Blase** ist davon getrennt und bleibt bis zur Spieleraktion stehen. Für 3D sind Sichtbarkeit, Verdeckung und lesbare Distanz im Host zu prüfen. Die historischen Pixelradien sind keine passenden Weltmaße.

Der NIE-Hook enthält bereits `fallback`, `deadline_ms`, `length_budget` und `context_budget`. Die 700 ms sind dort ein Vorschlag, 200/800/2000 Zeichen historische Kontextstufen. Inhaltlicher Vorrang: **Card → unmittelbare Lage → Fraktion → Beziehung → lokale Geschichte → globaler/RSS-Kontext**. Diese Form weiterverwenden, Zahlen nicht als neue globale Defaults festschreiben.

**Vorschlag für spätere asynchrone Adaption:** Ein bereits veröffentlichter Fallback wird nicht nachträglich mitten im Satz ersetzt. Verspätete Antworten verfallen oder werden passend gecacht; ein inzwischen weggegangener Sprecher beginnt nicht wegen einer alten Anfrage erneut. Generierter Inhalt bleibt Vorschlag, nicht bestätigtes Spielerstatement.

Sprechfähigkeit sagt nichts über Freund/Feind aus. Die alten Overworld-Fraktionen und Angriffsschwellen ersetzen weder Towns Grundhaltung noch die von Georg benannte Alien-/Clown-Antagonistenrichtung. Museum-Nacht, Arena-Kampf und friedliche Town-Begegnung bleiben ausdrücklich verschiedene Kontexte.

## 5 · Triplets: v2 qualifiziert die alte enge Trennung

Der Tourbus-Anhang vom 09.09. bewahrt v1, korrigiert aber ausdrücklich dessen enge Lesart. Aktive Designrichtung:

**Actor/POV (Beat 0) → Card A / SHOW IT → Card B / SPIN IT → Card C / SELL IT → Quest/Endpanel mit Social Calls und Spieler-Closure (Beat 4).**

`Subject / Connector / Reframe` benennt die Satzrollen. Diese dürfen in einer bewusst gestalteten Kombination die drei Performance-Rollen tragen. Die Begriffe bleiben unterscheidbar, sind aber nicht voneinander isoliert. **SELL IT wird nicht durch CALL IT ersetzt.** Weder drei beliebige Satzfragmente noch drei vorausliegende World-Cards sind automatisch ein vollständig gespielter Bogen.

Fraktal: dieselbe Operation kann als Satzstreifen, Kartenfolge, Fahrt, Raumfolge oder Almanac-Neuanordnung auftreten; auch eine einzelne Card kann auf kleinerer Ebene einen vollständigen Bogen tragen. Die Spieler-Closure wird nicht vom NPC fertig erklärt. Eine hörbare Entgegnung kann nach Town J-14 sammelbar werden; dieser Besitzweg ist noch keine durch die gelieferten Dateien belegte Runtime.

Der Anhang nennt **−1 / 0 / +1 / +2 Quest Die Progress** mit POP-/Checkpoint-/Zonen-/Deck-Bezug. Die nicht bestrafende Chill-Übersetzung ist dort ein Arbeitsvorschlag: ein Rückschlag nimmt bereits gesicherte Cards, Checkpoints und POP nicht wieder weg. Konkrete Call-Tabelle, Beträge und Zeitschwellen bleiben offen. Livery-Montage und Replay buchen kein neues Ergebnis. Kein neuer Reward-Owner.

## 6 · DECISION · WaterBowser ist Georgs jetzt gewähltes Tourbus-Modell

Neuer Quellordner: `media/3D_Assets/Frankensteining/KFB Truck/`.

| Datei | Repo-Metadaten am Prüfstand |
|---|---|
| `KFB TRUCK WaterBowser.fbx` | 433804 Bytes, Blob `a3e6d777044d3ab3783d9c18483edd233dc459f2` |
| `KFB TRUCK WaterBowser.blend` | 2292689 Bytes, Blob `876e89af8cffd7b2253ee0b31a73412a06b504e2` |

**SUPERSEDES ausschließlich die aktuelle Tourbus-Modellwahl:** Der Armored Truck aus dem Anhang ist der frühere Kandidat. Seine Screenshots, Quaternius-/Lizenzangabe, GLB-Maße und vermeintlichen Heck-Möglichkeiten sind keine Belege für WaterBowser. WaterBowser wurde hier nicht binär vermessen, geladen oder gerendert. Zwei Dateien im Verzeichnis belegen keine fertigen Farbkanäle, Räderpivots oder Texturvollständigkeit. Rechte-/Herkunftsnachweis separat am neuen Modell halten.

Die generischen Tourbus-Ideen bleiben dagegen nutzbar: **Fahrt · Parken/Hub · Milestone/Kartenfund · Replay/CCTV** als Zustände desselben Fahrzeugs. Kein neuer Movement-Core je Zustand.

Heckdisplay als Vorschlag: eigene vermessene Kassette vor geeigneter Fläche statt sofort Original-UVs umzubauen. Quelle des Contents ist explizit `card`, `deckCover`, `page`, `triplet` oder `incident`. `contain`, kein Strecken oder Abschneiden; Nummernschild und dreiteilige Reklameleiste sind eigene Aufgaben. Am WaterBowser wird die geeignete Montagefläche erst ermittelt, nicht behauptet.

Ein bestätigter Slotwechsel darf kurz klappen und einrasten; kein dauerndes Textrotieren während schneller Fahrt. Eine gepinnte Livery wird nicht von einem zufälligen Fund überschrieben. Snapshot/Almanac unterscheiden `generated`, `shown`, `selected`, `mounted` und `spoken`. CCTV behält damalige sichtbare Revision, Palette, Beschriftung und gegebenenfalls Übergangsphase. Ein späterer Umbau schreibt die Vergangenheit nicht um.

## 7 · Machbarkeit ohne Blender: ja, über die vorhandene FBX-Datei

**Technischer Weg, noch nicht ausgeführt:** FBX mit Three.js `FBXLoader` lesen; Hierarchie, Maße, Texturreferenzen und Materialbelegung inventarisieren; nötige Teile/Flächen nachvollziehbar zuordnen; optional später mit `GLTFExporter` als GLB ausgeben. Beide Import-/Exportwege sind offiziell dokumentiert. Für den ersten Prüfstand kann FBX direkt geladen werden; GLB ist keine Voraussetzung für die reine Vorschau.

Frei färbbare Zonen sind **eine separate Authoring-Aufgabe**, kein automatisches Ergebnis einer Formatkonvertierung. Getrennte Teile können eigene Materialien erhalten; Geometriegruppen können Materialslots tragen. Wenn Lack, Fenster und Metall nur im selben Atlas liegen, müssen Zuordnung oder Maskierung gezielt erstellt werden. Gleich gefärbte Flächen sind nicht automatisch dieselbe semantische Zone. Räder müssen bei Bedarf inklusive lokaler Drehpunkte getrennt werden; das ist nicht aus dem Dateinamen ableitbar.

**Arbeitsvorschlag:** Astra Work für reproduzierbare Datei-/Geometrie-Aufbereitung und echte Browserkontrolle; Design beziehungsweise die bestehende ToolBox für visuelle Auswahl, Fits und JSON-Profile, sobald der benötigte Importweg dort nachgewiesen ist. Web-Chat kann Anforderungen, Skripte und Review liefern; weder ein vorhandener FBX-Import im aktuellen Studio noch ein erfolgreicher WaterBowser-Export wird hier behauptet. Keine neue generische Fahrzeug-Editor-App nötig.

Spätere zusammenhängende Abgabe: abgeleitetes Modell, Materialzonen-Zuordnung, Fit-/Mount-JSON, reproduzierbares Skript, Quellenpin, Vorher-/Nachher-Bilder und Reimportkontrolle. **Heute ausdrücklich keine Konvertierung, keine neuen Materialzonen, kein Fahrzeugumbau.**

Externe Technikquellen, geprüft 14.09.2026: [FBXLoader](https://threejs.org/docs/pages/FBXLoader.html), [GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html), [BufferGeometry / groups](https://threejs.org/docs/pages/BufferGeometry.html). Sie belegen Fähigkeiten der Bibliothek, nicht Kompatibilität dieses ungeöffneten Assets.

## 8 · Ideation und noch offene Anschlussstellen

Die konkreten Town-Szenen stehen additiv im Town-Living, nicht in einem zweiten Ideenmaster. Gemeinsame Richtung: Bus als reisender Treffpunkt/Medienfläche; NPCs reagieren auf bestätigte Ausstellung oder ein beobachtetes Ereignis; Entgegnungen werden Material für spätere Spielerhandlungen; Museum/CCTV bewahren die frühere Anordnung. Tourbus, NPC-Blase und Museumwand zeigen verwandte Inhalte, besitzen aber nicht dieselbe Runtime.

Weitere Quellenideen bleiben auffindbar: niedrig priorisierte sprechende Snacks; ein endliches Wiseguy-Duell mit drei Fehlversuchen oder ungefähr acht Sekunden und möglichem Corner-Hit; Erzähler als Figur/Datumsgerät mit MM/DD/YYYY-Walzen; Speaker's Corner, Abyss, Karaoke und Disco als offene Hooks. Keine dieser historischen Planungen wird durch diesen Import als gebaut oder als neue Priorität ausgegeben.

TTS ist optionale Ausgabe, STT im KFB-Entwurf eine freiwillige Seed-Eingabe mit Push-to-talk, kein ungeprüfter Befehlsweg. Beides fehlt als fertige Implementierung im gelieferten Paket. Alte Aussagen über garantierten Offlinebetrieb, identische Stimmenwirkung oder Browsersupport sind historische Technikbehauptungen, keine aktuelle Zusage. **DocCheck übernimmt nicht automatisch den KFB-Spielwitz, Erkennungsfehler willkommen zu heißen:** dort müssen Transkript und fachliche Aussage überprüfbar bleiben. Diese Consumergrenze ist ein Integrationsvorschlag, keine Änderung des KFB-STT-Entwurfs.

Die frühere HUD-/Blasen-Typografie wird nicht zur neuen Tool-UI-Vorgabe. Funktionale Oberflächen bleiben lesbar mit neutralen Default-Schriften; Brand-/Display-Schriften nur bewusst in ihrer Inhaltsrolle. Keine Fontdateien werden mit diesem Paket weitergegeben.

## 9 · Additive History und offene Prüfpunkte

14.09.2026 · DECISION: Georg wählt WaterBowser als Tourbus. Der alte Armored-Truck-Kandidat bleibt historische Quelle, nicht aktueller Meshvertrag.

14.09.2026 · SOURCE / REUSE: ChatterBox-Daten, Verhalten, Blasen, Identität, NIE-Hook, Caption/Afterglow und Tourbus-v2-Richtung verknüpft. Unterschiedliche Source-Stände nicht überschrieben.

14.09.2026 · TESTED RESULT: 7/7 Syntaxprüfungen; Card-Prioritätsfehler am Upload reproduziert, Card-Kontrolle und Titel-Persistenz geprüft. Kein Browser-, Hör-, 3D- oder Integrationstest.

14.09.2026 · CORRECTION: Georgs vorherige Korrektur `*planets` ist eindeutig. Für den früheren Skydome-Backlog sind **Planeten**, nicht Pflanzen, gemeint. Die Unsicherheit im vorigen Addendum ist damit aufgelöst; die dort gefundenen Plant-Dateien sind nur separater Bestand.

OFFEN: tatsächlich gewählten Blasen-/Chatter-Donor je Consumer pinnen; Seed-Priorität und gemeinsame Ink im echten Host prüfen; WaterBowser importieren und vermessen erst nach Umsetzungsauftrag; Display-Ruhezustand, Voice-Profile, Triplet-Originalpool und konkrete Ergebniszuordnung klären. Aktive Travel-/Combat-/ToolBox-Aufträge und ihre Owner bleiben unverändert.
