# Claude Design · RESIDENT-ANIMATION-TOOLBOX-UI-01


## Auftrag

Entwirf für einen frischen Claude-Design-Chat genau eine integrierbare Neufassung von **Resident Atlas + Animation Lab/Library** im aktuellen, freigegebenen **KFB ToolBox Design**.

Beide Bereiche nutzen dieselbe ToolBox-Shell, denselben vollständigen 3D-Inline-Editor und dieselbe Character-/Motion-Auswahl. Dies ist ein UI-/Interaction-Design-Job. Keine neue Runtime, kein neuer Atlas, kein zweites Animation Studio, kein neues ToolBox-Shell-Design und kein GitHub-Job.

## Eingabepaket

Lies zuerst aus dem öffentlichen GitHub-Stand:

1. `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/START_HERE.md`
2. dort `RETURN.md`, `TEST_REPORT.md`, `SOURCE.json`
3. `KFB_Resident_Atlas_S11.html#__graveyard`
4. `lib/edit-layer.js`
5. `data/graveyard-01.json` und `lib/graveyard.js`
6. den aktuellen KFB ToolBox Production-05 Session Cut als angenommene Funktions- und Designbasis;
7. PR #275 `georg-doc-patch-3@c9c3f9aa437e969b3ec2f0a6e9a1e87b2a2f3f1a`;
8. dort `media/3D_Assets/Animations/KFB_Motion_Library/RETURN_INTAKE_04.md`;
9. dort `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json` mit 263 eindeutigen Clips

GitHub main ist beim Briefing `51f9bc22596a0d0165f4da9e8e2ea14118466210`. Vor Beginn erneut prüfen.

Der S11-Export ist Content- und Funktionsdonor. Seine UI ist keine akzeptierte Gestaltungsvorlage.

## Clay-Look Source Lock · verbindlich, nicht neu erfinden

Der KFB-Claymation-Look **existiert bereits als Baukasten auf GitHub**. Claude Design darf in diesem Job weder einen vierten Clay-Stil noch ein isoliertes Graveyard-Materialsystem bauen. Lies und verwende die folgende Donor-Kette in dieser Reihenfolge:

1. **H0 Hirnwelt · Art Direction und Weltgrammatik**
   `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
   Zuerst: `START_HERE.md` → `HANDOVER_WSA.md` → `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md` → `docs/LIVING_CLAY.md`.
   Visuelle Referenzen: `KFB Hirnwelt H0.dc.html`, `KFB Knetwelt Look-Konzept.dc.html`, `evidence/01-h0.png` bis `04-h0.png`, `ref/claybound/web/`.
   H0 besitzt die bunt-harmonisch-weirde Diorama-/Hirnwelt-Richtung, die Fassaden-/Fensterrhythmik und die Größenstaffelung von Clay-Spuren.
2. **K2 Knet-Werkzeuge · akzeptierter Material- und Werkzeugbaukasten**
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`
   Zuerst: `START_HERE.md` → `HANDOVER_WSA.md` → `docs/LIVING_CLAY.md`.
   Ausführbare Quellen: `lab-clay/clay-material.v10.js`, `clay-relief.v4.js`, `clay-tools.v1.js`, `clay-toolmix.v1.js`, `clay-profiles.v2.js`; Prüfoberfläche: `KFB Knet-Werkzeuge K2.dc.html`.
   Status laut Paket: `ACCEPTED AS BASE`. Verwende diese Profile und Werkzeuge; keine optisch ähnliche Eigenimplementierung.
3. **T3/T3 v2 · Track-/World-Komposition**
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/` sowie der K2/T3-v2-Ordner oben.
   Relevante Quellen: `DESIGN_SPEC_T3.md`, `lab-track/KONZEPT_S4_KNETSTRANG.md`, `lab-track/track-look.v3.js` und in K2 `lab-track/track-look.v4.js`.
   T3 ist `ACCEPTED AS BASE`; T3 v2 zeigt denselben Look auf K2-Material.
4. **T4/M2 · jüngster Kompositionsdonor, falls im Chat verfügbar**
   Production-Inbox-Receipt `6d9b0cd8-bc29-4b8b-b41f-5821eef69d21`, 1.433.281 Bytes, SHA-256 `101b7c66edb259520c480a618cf064f25adf0ce4781c9f7e960eb7a13abeb93a`.
   T4 verfeinert Track, Biome, sparsame Szeneninseln und die Clay-VFX-Sprache. Dazu gehören kleine Knetkügelchen/-flocken für Schritte, Sprünge, Landungen, Reifen, Kollisionen und biomeabhängigen Staub. Fehlt das Paket im Claude-Design-Chat, bleiben H0 + K2 + T3/T3 v2 die verbindliche, vollständig auf GitHub abrufbare Baseline; kein erfundener Ersatz.

### Eigentum und Beweis

- H0 bestimmt den **Look**, K2 die **Clay-Material-/Werkzeugimplementierung**, T3/T4 die **Track-/World-Komposition**; ToolBox Production-05 bleibt der **UI-Shell-Donor**.
- Zeige vor Integration mindestens je eine unveränderte Donor-Probe für Terrain/große Architektur, Prop/Mittelgrund und Character/Feindetail.
- Eine Auswahlbox oder ein Label `Clay` ist kein Beweis. Der Session Cut muss sichtbar dieselben Materialprofile bzw. Module verwenden und sie in `SOURCE.json` mit Pfad und Ref nennen.
- Die Clay-Schichten müssen einzeln abschaltbar sein, damit Materialkosten, Schatten-/Kantenartefakte und Clipping prüfbar bleiben.
- T4-VFX werden als eigener schaltbarer Layer übernommen: ereignisgetrieben statt dauernd emittierend, gepoolt, farblich aus Biome/Untergrund abgeleitet und in `low / standard / high` begrenzt. `low` darf nur wenige Kontaktkügelchen zeigen; `off` bleibt als Performance-Fallback.
- `SPRINT_PATH_BAND_CLAY_01.md` ist derzeit kein auffindbarer GitHub-Source-Lock. Ein lokaler Sprint-Text darf deshalb nicht den vorhandenen H0/K2/T3-Baukasten ersetzen oder still neu definieren.

### Wegband-Daten · aufnehmen, aber nicht zum UI-Blocker machen

Die aktuelle Graveyard-Messung liefert folgende vorläufige Gestaltungsdaten; im Session Cut als `reported / verify against source package` kennzeichnen:

- KayKit: `path_A` + `path_B` als dichter Kern, `path_C` als Rand, `path_D` als Saum; gemeldete Flächenanteile B `0.899`, A `0.853`, C `0.629`, D `0.293`;
- Quaternius: eckige Steine ca. `0.85` für Kern, runde Platten ca. `0.65` für Rand, Einzelsteine für Saum;
- Quaternius-Höhe `0.17` gegenüber KayKit `0.10`: beim Mischen angleichen;
- die 13 Quaternius-Kacheln teilen dieselbe ca. 0,8-MB-Textur: genau einmal laden und wiederverwenden;
- Dateien über die Katalogtabelle adressieren, nicht über fehleranfällige Namen wie `Smal`;
- Flächenanteil ist die relevante Dichtemetrik, nicht die gezählte Zahl berührender Steine.

Das Wegband darf als Environment-Beispiel im Graveyard erscheinen. Es ist kein Grund, den Resident-/Animation-UI-Job um einen neuen World- oder Material-Owner zu erweitern.

## Negativreferenz · verbindlich

Im Graveyard-Edit-Modus konkurrieren derzeit drei Oberflächen für dieselbe Aufgabe:

1. ein großes dunkles Objektfenster links oben;
2. das schwebende Inline-Mini-Menü am ausgewählten Objekt;
3. der komplette rechte Bereich `STUDIO · ANFASSER` mit denselben Transform-Funktionen und langen Messlisten.

Zusätzlich steht dort `GOTH GIRL`, obwohl der aktive Kontext Graveyard/Dancing Skeletons ist. Das ist ein Kontext-Leak.

Dieses Muster ist ein **UI FAIL**. Es darf nicht verfeinert oder dekoriert, sondern muss auf eine klare Zuständigkeit reduziert werden.

## Zielbild

### Ein Edit-Owner

Das kleine Inline-Menü am selektierten 3D-Objekt ist der primäre Edit-Owner.

Es enthält konsistent und vollständig:

- Verschieben;
- Drehen;
- Skalieren;
- Welt/Lokal;
- Raster an/aus;
- Absetzen/Boden;
- Fokus;
- Rückgängig/Wiederholen;
- Auswahl schließen.

Icons brauchen Tooltip und zugänglichen Namen. Keine tool-spezifische Schwundform; dieselbe vollständige Komponente wird in Resident Atlas, ToolBox Studio, Animation Library und später WorldBuilder wiederverwendet.

### Ein optionaler Inspektor

Ausführliche Zahlen, Pfad, Quelle, Bounds, Transformwerte, Bone-Referenz und Korrekturliste liegen in **einem einklappbaren Inspektor** hinter `i` oder `Details`.

Der Inspektor ist standardmäßig geschlossen und verdeckt den 3D-View nicht. Im offenen Zustand ersetzt er keinen Inline-Control und dupliziert keine primären Buttons.

### Kontext statt Leaks

- Graveyard zeigt `Friedhof`, `Dancing Skeletons`, Actor oder Requisite.
- Ghostville, Goth Girl oder andere Szenennamen erscheinen nur, wenn genau dieser Kontext aktiv ist.
- Die rechte Kontextpalette zeigt nur die Einstellungen des aktiven Modus.
- Moduswechsel Actor/Requisite/View/Edit bleibt sichtbar, aber kompakt.

### Sichtfeld vor Metadaten

- mindestens 70 % der nutzbaren Breite gehören auf Desktop dem 3D-View;
- keine große Statusplakette wie `PROVEN` im Sichtfeld; ein kleines grünes Häkchen reicht;
- keine Messdaten-Daueranzeige;
- keine doppelte Kopfzeile oder zweite Navigation;
- Narrow View: Inspektor als Sheet/Drawer, Inline-Menü bleibt am Objekt erreichbar.

## ToolBox-Design

Nutze das freigegebene aktuelle ToolBox-Design: helle, ruhige Arbeitsfläche, abgerundete Panels, kompakte Segmente, KFB-Farben und klare Hierarchie. Keine Rückkehr zum schwarzen/gelben Legacy-Graveyard-Chrome. Inhalt kann Halloween-Farbe tragen; das Werkzeug bleibt ToolBox.

## Animation Lab / Library · verbindlicher Umfang

Die Animation Library ist kataloggetrieben. Keine Clip-Liste wird im Interface erneut von Hand gepflegt.

### Library View

- beliebigen verfügbaren Character/Rig auswählen;
- 263 Clips aus Motion Library v4 laden;
- Suche sowie Live-Filter für Gruppe, Tags, Loop/One-shot, Props, Varianten, Resident-Ideen und Combat/Reaction;
- links kompakte animierte Preview-Karten, rechts großer 3D-Preview;
- Umschaltung zwischen ruhigem Studio und echter Terrain-/World-Umgebung;
- die Terrain-/World-Ansicht rendert Terrain, aktive Residents, Nebenfiguren und verwendete Props gemeinsam im aktuellen KFB-Claymation-Look; sie ist keine graue Testfläche und kein neutraler GLB-Viewer;
- keine langen `PROVEN`- oder Statusplaketten im Sichtfeld; kleines Häkchen genügt;
- Preview-Hintergrund füllt jede Karte vollständig; keine grauen Seitenstreifen;
- Namen, redaktionelle Tags, Kommentare, Resident-Zuordnung und Signature Moves editierbar;
- Änderungen als additives JSON exportierbar/importierbar, ohne den kanonischen Katalog im Browser still zu überschreiben.

### Claymation-Prüfkontext · verbindlich

Die technische Studioansicht bleibt für Rig-, Kontakt- und Clipping-Kontrolle verfügbar. Für die visuelle Produktionsbeurteilung ist zusätzlich eine echte Claymation-World-Ansicht Pflicht:

- Gelände, Straßen-/Bodenflächen und Kontaktzone nutzen den aktuellen KFB-Claymation-Material-/Renderansatz; kein Wasserfarben-Hintergrund, keine graue Rasterkachel und kein untexturierter Platzhalterboden;
- der ausgewählte Character/Resident wird koloriert und mit seinem Claymation-Material gezeigt, nicht als weißes oder neutrales Prüfmodell;
- mindestens ein weiterer Resident wird in derselben Szene mit demselben Rendervertrag gezeigt, damit Pair-, Talk-, Reaction- und Fight-Clips im räumlichen Kontext prüfbar sind;
- Requisiten und Attachments werden mit dem passenden Claymation-Look gerendert. Ihre echte Donor-Geometrie und Socket-Zuordnung bleiben erhalten; der Look darf kein Ersatzmodell erfinden;
- Terrain, Residents und Props teilen eine konsistente Licht-/Schattenrichtung. Bekannte helle Schattenkanten, Banding, Clipping und schwebende Kontakte werden sichtbar markiert statt durch andere Hintergründe kaschiert;
- Clay-Relief/Texturmaßstab wird nach Größenklasse getrennt: grob für Terrain/große Architektur, mittel für Props, fein für Characters;
- Studio/World ist ein Darstellungswechsel derselben Auswahl und Animation, kein zweiter Szenen- oder Runtime-Owner;
- mindestens drei direkt vergleichbare Prüfzustände: Locomotion auf Clay-Terrain, Resident↔Resident-Reaktion und Resident↔Clay-Prop/Attachment.
- Locomotion, Sprung/Landung und Prop-Kontakt zeigen optional die T4-Clay-Partikelreaktion, ohne die Animation oder Kontaktprüfung zu verdecken.

Der Session Cut muss diese Claymation-World-Ansicht tatsächlich darstellen. Eine bloße Auswahlbox oder ein Label `Clay` ohne gerendertes Terrain, Residents und Props erfüllt den Auftrag nicht.

### Motion-Details und Anpassung

Der Detailbereich nutzt denselben einklappbaren Inspektor wie Resident Atlas und zeigt nur bei Bedarf:

- Dauer, Frames, Loop/One-shot, Root Motion und Travel;
- `variantOf`, Kommentar und `residentIdeas`;
- Prop-Anforderung mit Hand/Socket;
- `events.strike` oder andere Ereignismarker;
- Abspielgeschwindigkeit, Trim, Mirror und Arm-Space;
- Actor-/Terrain-Kontakt sowie erkennbare Handgelenk-/Arm-/Kopf-Clipping-Probleme.

Für die 8 Angriffe aus Intake 04 müssen die vorgeschlagenen Strike-Zeitpunkte visuell verschiebbar und prüfbar sein. Sie sind Kandidaten, keine bereits akzeptierten Gameplay-Marker.

### Gemeinsamer Clay-VFX-Eventvertrag

Animation Lab und Resident Atlas zeigen VFX nicht als fest in einen Clip eingebrannte Sonderlösung. Eine Animation/Choreografie liefert ein Ereignis; der gemeinsame Präsentationslayer rendert dazu ein Profil.

Mindestens diese Ereignisklassen müssen im Editor sichtbar, zeitlich verschiebbar und als additives JSON exportierbar sein:

- `footstep`, `jump`, `land`;
- `brickfish_throw`, `brickfish_hit`, `melee_hit`, `wrestling_impact`;
- `gift_open`, `gift_burst`, `prop_break`;
- `vehicle_contact`, `collision`, `explosion`.

Die Basisschicht besteht aus kleinen Knetkügelchen/-flocken. Optionale additive Layer sind Comic-Starburst/Impact-Zeichen, Ring/Flash und Rauch. Combat Arena, Ranged/Melee, Resident/NPC Interactions, World/Track und spätere Geschenk-Interaktionen konsumieren dieselben Eventnamen und Profile; kein Consumer erfindet einen eigenen zweiten Knet-Partikelstandard.

Ein Profil hält mindestens `event`, `effectId`, `originSocket`, `direction`, `surfaceOrBiome`, `paletteSeed`, `intensity`, `lifetime` und `qualityTier`. VFX bleiben reine Präsentation: Hit, Damage, Geschenkzustand oder Kontakt werden niemals aus sichtbaren Partikeln abgeleitet. Der Editor zeigt `off / low / standard / high` und kann Basis-Clay, Comic-Overlay und Rauch einzeln schalten.

### Props, Residents und Choreografie

- Briefcase, Rifle, Bag, Torch, IV Pole, Sword, Pistol und Knife werden über vorhandene Asset-/Attachment-Sockets zugeordnet; die Motion-Dateien enthalten diese Props absichtlich nicht.
- Ein Prop darf im Preview fehlen, ohne den gesamten Library View zu blockieren; zeige dann einen klaren, kleinen `Prop fehlt`-Status.
- Resident Atlas wählt aus derselben Library Default Walk, Talk, Idle, Reaction und Signature Move.
- Varianten mit größerem Armabstand bleiben gezielt für breite Körper filterbar.
- Sitzende Clips verlangen einen Sitz-/Cockpit-Kontext; sie dürfen nicht als normaler Stand-Loop erscheinen.
- Paar- und Kampfsequenzen können Attack/Reaction nebeneinander synchronisieren. `kfb_reaction_surprise_uppercut_a` ist die getroffene/KO-Seite, kein Angriff.
- `walking_n` wird als nicht sauberer Loop markiert; kein automatisches Kaschieren.

### Intake / Drop-Zone

Eine kompakte Drop-Zone darf lokale FBX/GLB-Clips zur Vorschau annehmen. Sie ist ein **Preview-/Intake-Eingang**, keine stillschweigende Aufnahme in die kanonische Library. Zeige vor Export klar: Dateiname, erkannter Rig-Typ, Dauer, verfügbare Animationen, notwendige Konvertierung und offene Prop-/Retarget-Fragen.

## Inhaltsschutz

Unverändert erhalten:

- vier Dancing Skeletons;
- acht Takte Tanz, Takt 9 Zerfall, Takt 10 Zusammensetzen;
- fliegende Knochen und Kollisionen als schaltbare Szeneoptionen;
- Gate- und Audio-Funktionen;
- aktuelles Resident-/Motion-/Scene-Ownership;
- Motion Library v4 mit 263 eindeutigen Clips als aktueller Katalogstand;
- Intake-04-Metadaten für Varianten, Props, Kommentare, Resident-Ideen und Strike-Kandidaten;
- vollständiger 3D-Inline-Editor-Vertrag.

Keine neue Tanzlogik, kein neues Rigging, keine neuen Halloween-Assets und keine Reparatur des Content-Packs in diesem Job.

Hinweis: Die Aussage des S11-Snapshots `PR #279 defekt` ist überholt. Für vollständige Halloween-GLBs gilt aktuell PR #279 @ `10a2c5e29bf752215dadb60b23f07253f63e9d34`; GitHub erneut prüfen.

## Abgabe

Liefere ein vollständiges, herunterladbares Session-Paket mit:

- interaktivem HTML-Artefakt im aktuellen ToolBox-Design;
- Desktop- und Narrow-Ansicht;
- den vier Zuständen View, Actor, Requisite, Edit;
- sichtbarem kompletten Inline-Menü;
- offenem und geschlossenem Inspektor;
- Library View mit realer 263-Clip-Katalogstruktur, Suche, Filtern, Character-Auswahl und animierten Preview-Karten;
- mindestens je einem sichtbaren Beispiel für Prop-Attachment, Strike-Marker, Resident-Signature-Move, sitzenden Clip und Paar-/Kampfsequenz;
- mindestens je einem sichtbaren Clay-VFX-Beispiel für Landung, Brickfish/Combat-Impact und Geschenk-Burst, mit einzeln schaltbarer Basis-/Comic-/Rauchschicht;
- echter Claymation-World-Ansicht mit gerendertem Terrain, mindestens zwei Residents und mindestens einem verwendeten Prop;
- JSON Import/Export und lokaler Intake-Drop-Zone;
- `RETURN.md` problems first;
- `SOURCE.json` mit exakten Pins;
- `TEST_REPORT.md`;
- editierbarem Quellstand und Checksummen;
- genau einem nächsten Gate.

Claude Design soll **nicht** committen, pushen, einen PR eröffnen oder den Hub pflegen. Das Paket wird über den KFB Production Inbox Upload oder als vollständiger Download an einen GitHub-fähigen Empfänger zurückgegeben.

Bevorzugte Ausführung: Claude Design Desktop, damit das vollständige Session-Paket lokal geladen, getestet und geschlossen exportiert werden kann. Desktop-Nutzung ändert nichts an der GitHub-Grenze: ohne verifizierten Connector keine Push-/PR-Aufträge.

## Prüfung

PASS, wenn Georg in Graveyard Edit sofort erkennt:

1. welches Objekt ausgewählt ist;
2. wie es verschoben, gedreht, skaliert und abgesetzt wird;
3. wie Detaildaten ein- und ausgeblendet werden;
4. dass kein zweites oder drittes Panel dieselbe Aufgabe beansprucht;
5. dass der 3D-View die Hauptfläche bleibt;
6. dass Resident Atlas und Animation Lab dieselbe Editor-Komponente verwenden;
7. dass die 263 Clips auffindbar sind, ohne das Interface mit Metadaten zu überladen;
8. dass Props, Strike-Marker und Resident-Zuordnungen verständlich bearbeitet und als JSON exportiert werden können;
9. dass Terrain, Residents und Props in der World-Ansicht sichtbar im gemeinsamen Claymation-Look gerendert werden.

Budget-Stopp: ein Designpass plus ein klar begrenzter UI-TUNE-Pass. Keine dritte Neugestaltung.
