# KFB Free Roam · Walk ↔ Drive ↔ Combat · Vorbereitung

**Datum:** 2026-09-18
**Status:** SOURCE REVIEW + USER DIRECTION + PROPOSED PREFLIGHT. Kein Runtime-Patch, keine neue Site, kein neuer Owner und kein gestarteter Astra-Lauf.
**Bezug:** bestehendes Astra Integration 01 Onboarding r3. Diese Vorbereitungsnotiz ersetzt den aktiven EXECUTION_BRIEF nicht. Ein nachfolgend angenommener Scope-/Contract-Delta muss vor dem großen Work-Lauf in genau dessen eine aktive Fassung konsolidiert werden.

## 1 · Nutzerziel und Empfehlung

Georg möchte die Race-Fahrzeuge und deren Controls/Cartoon-Präsentation auch außerhalb des BOX1-Tracks benutzen: organisches Terrain, City-Packs, Straßen/Kreuzungen, Rückwärtsfahren, Wenden, Einparken, Turbo/Drift, Bumper/Rampen und fließende Übergänge in einen suburbanen Stuntparcours. Walk→Drive→Combat soll als zusammenhängender KFB-Spielablauf vorbereitet werden. Georg bevorzugt Vorbereitung vor Astra-Start.

Empfehlung: ein begrenzter eigener Vorbereitungschat unter bestehendem Web-/WSA-Lead, kein neuer Produktowner. Aufgabe ist, vorhandene Quellen, Eingaben, Modusübergaben und einen ausführbaren Abnahmefall zu klären. Nicht im Webchat erst ein vollständiges Open-World-Spiel bauen und nicht einen zweiten Gesamtplan erzeugen. Nach dieser Klärung übernimmt Astra die zusammenhängende Implementierung, Regression und Veröffentlichung.

## 2 · Quellenbefund: zwei vorhandene Fahr-Linien unterscheiden

### BOX1 / Track Feel v0.8

Repo: `georg-doc/KFB-Stunt-Car-Race`.
Datei: `ChatGPT_web/track-environment-lab/host/feel-lab-v08.mjs`.
Gelesener Blob: `84d71552ebe17b7332b18305bb111136ec746577`.

`step()` führt den Wagen über Streckenfortschritt `state.s` und seitlichen Versatz `state.x`; Position kommt aus `core.sample(s)` plus Versatz. Orientierung folgt der Streckentangente plus Slip. Gas/Bremse erlauben bereits negative `state.speed`, aber A/D erzeugt eine Seitenkraft innerhalb dieses Streckenmodells, keine frei gewählte Fahrtrichtung im Terrain. Vorwärtslenkung, Rückwärtslenkung und Kamerabezug sind deshalb nicht durch einen neuen Rückwärtsclip allein zu lösen.

Die sichtbare Environment-Landschaft neben dem Track beweist keine befahrbare Geländeoberfläche. Q/E = richtungsbezogener Drift, Shift = Boost, Space = Hop, R = Reset im gelesenen Host. Ein-/Aussteigen darf E/R/Space nicht nebenbei neu belegen. Bestehendes BOX1/akzeptierter v0.8-Vergleich bleiben erhalten.

### Production Race / Slice 04

Datei: `race/CONTRACT.md`, Blob `d9e29a4ff6906af18684c56f87ae63b6c6a28589`.
Datei: `race/src/physics.js`, Blob `5c72c2d2dfe530eddfbf7285308b99e71e1c5d6` nicht erhoben; für diese Datei wurde der Quelltext gelesen, aber hier wird kein ungeprüfter Blobpin als Beleg verwendet.

Vorhanden: dynamisches Chassis, vier Suspension-Rays, Radlenkung, Bremsen/Drift/Hop, tatsächliche Bumper-/Breakable-/Landekontakte, Kollisionsabfragen, sicherer Checkpoint und Recovery. Physical pose/velocity hat genau einen Owner. Diese Linie ist ein konkreter Free-Drive-Spender, kein bereits akzeptierter Ersatz für BOX1-v0.8-Feel.

Im gelesenen Code ebenfalls erkennbar: feste Gravitation entlang -Y, feste Track-/Weltgrenzen, Road-ID-basierte sichere Checkpoints und regionenspezifischer Stuntabschluss. Ein unveränderter Transplant auf einen Globus ist deshalb nicht zugesagt. Nicht blind die ganze Physikwelt/Recovery/Acquisition mitnehmen.

**Pflichtentscheidung der Vorbereitung:** welche vorhandene Linie liefert die Free-Drive-Bewegung, welche die gewünschte Bedienung/Cartoon-Präsentation? Zuerst Slice-04-Physik als konkreten Spender prüfen; v0.8-Feel ist Vergleichsreferenz. Keine dritte Engine entwerfen. Noch kein Motorwechsel beschlossen.

### Travel, Atlas und Animation

Travel: `georg-doc/KFB-Travel-Globe`, aktueller Einstieg `WSA_START.md`, World-Owner aus `travel/CONTRACT.md` und WB0 `REUSE_MATRIX.md`. Dort ist DRIVE bisher deferred. Ground/Flight bleiben bestehende aktive Modi; ein neuer DRIVE-Receiver braucht einen benannten, getesteten Contract-Delta.

Vorherige Bewegungsarbeit: `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/MOVEMENT_IN_CONTEXT_REVIEW_2026-09-18.md`. Walk/Run-Varianten nicht als automatisch geordnete Tempostufen deuten; Reverse-Mechanik eines Autos nicht mit Backward-Walk eines Mechs gleichsetzen.

World Atlas: `tools/world_atlas/source/lib/kit-lab.js`, Blob `964d4187665f1786067ff5917de80df5f086fc91`. Vorhandene Quellen dort:

- `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/`
- `media/3D_Assets/kenney_city-kit-commercial_2.1/Models/GLB format/`
- `media/3D_Assets/kenney_city-kit-suburban_20/Models/GLB format/`
- zusätzlich `media/3D_Assets/kenney_city-kit-roads/Models/GLB format/`
- Stuntteile aus dem vorhandenen `kenney_racing-kit` und weiteren exakt aufgelösten Registry-Quellen.

Dies ist eine belegte Asset-/Authoring-Ausgangsbasis, keine Aussage über fertige befahrbare Stadtlayouts. Maßstäbe, Spur-/Gehwegbreiten, Bordsteine, Kurven, Collider und Gebäudefreiraum messen. GitHub-Identität/Pfad/Revision behalten, keine zweite Modellablage. Nicht allein aufgrund ähnlicher Namen eine der gemeinten City-Quellen ersetzen.

## 3 · Produktstruktur: nicht drei konkurrierende Controller

Vorgeschlagene getrennte Achsen:

- Fortbewegung: GROUND / DRIVE / FLIGHT.
- Handlung: erkunden / interagieren / zielen / kämpfen.
- Aktivität: Free Roam / Rennauftrag / Stunt-Challenge.
- Authoring: bestehendes PLAY / BUILD / GOD bleibt separat.

Combat ist eine Handlung über dem passenden Movement-Owner, kein dritter Spieler-Root. Rennen ist zunächst eine Aktivität auf derselben befahrbaren Welt, nicht automatisch ein Wechsel der Fahrzeugphysik.

Im angestrebten Travel-Consumer behält Travel Welt/Anker/Moduswechsel/Persistenz. Genau ein benannt übergebener DRIVE-Controller schreibt Fahrzeugpose/Kontakt. Race bleibt Herkunft/Owner seiner Fahr- und Stuntmodule; konkrete Receiver-Adaptionen im zuständigen Repo dokumentieren. Animation/Deformer/Audio lesen Zustand und Kontaktfakten, schreiben keine zweite physische Pose. Combat-Arena behält Schuss/Hit/Reward/Runflow-Verträge; ein Hub-Link oder das Laden ihrer Welt ist noch keine nahtlose Integration.

## 4 · Vorgeschlagene Bedienung für die erste Erprobung

Vorhandene Tasten soweit möglich erhalten. Alle folgenden Verhaltensdetails sind PROPOSAL, keine bereits akzeptierten Defaults.

- W/S: vor/zurück. Bei Fahrt entgegen der angeforderten Richtung erst kontrolliert bremsen, dann über eine stabile Null-/Neutralzone die Fahrtrichtung wechseln. Kein sofortiges Umspringen bei Restgeschwindigkeit; gleichzeitige widersprüchliche Eingaben deterministisch behandeln.
- A/D: Lenkeinschlag relativ zum Fahrzeug. Beim Rückwärtsrollen ergibt sich die umgekehrte Drehantwort aus der Bewegungsphysik; Eingabe und Gierbewegung nicht doppelt invertieren. Bei Stillstand kein automatisches Drehen des gesamten Chassis auf der Stelle.
- Rückwärtsgeschwindigkeit begrenzen und für präzises Einparken abstimmen. Zunächst kein Turbo rückwärts und kein unabsichtlich bei jeder langsamen Kurve ausgelöster Drift.
- Shift behält im Drive den Boost-Wunsch; auf Fußbewegung bedeutet es Run. Q/E-Drift und Space-Hop des vorhandenen Track-Hosts erst prüfen, nicht unbemerkt auf Handbremse/Exit umstellen.
- Drift bewusst auslösen und sauber zurück in Grip; Stadtstraßen benötigen präzise Langsamfahrt, ohne das gewollte Cartoon-Handling zu verlieren.
- Ein-/Aussteigen über die vorhandene kontextuelle Interaktionsnaht plus sichtbares Prompt. I/F/E/R-Konflikte anhand echter Hosteingaben auflösen. Keine fixe neue E-Belegung behaupten, bevor alle Empfänger geprüft sind.
- Kamera behält Fahrzeugvorne und Rückwärtsbewegung auseinander: kein automatischer 180°-Flip nur wegen negativem Tempo. Rückwärtsübersicht darf bewusst folgen/aufgezogen werden; bestehende Orbit-/Lookrechte erhalten. Combat-Eingaben nicht mit freier Kamera parallel auslösen.

Moduswechsel nur nach validiertem Übergabestand: niedriges Tempo/stabiler Bodenkontakt für normalen Ausstieg; freie Fläche links/rechts/hinter dem Wagen und Kopffreiheit prüfen; fehlt Platz, im gültigen Fahrzeugzustand bleiben. Geparkter Wagen bleibt physisch an Ort und Stelle, Fuß-Root nicht im Collider. Letzten gültigen Zustand bei Lade-/Wechselfehlern erhalten. Input, Kamera, Audio, Pose, Heading, Geschwindigkeit und belegter Sitz/Actor sind explizite Übergabedaten; kein gemeinsames Save allein aus derselben Domain ableiten.

## 5 · Cartoon-Präsentation und Clips

Vier-Rad-Fahrzeuge brauchen nicht zwangsläufig einen Reverse-Skelettclip. Signierte zurückgelegte Strecke steuert Raddrehung; echter Lenkeinschlag steuert passende Räder; Beschleunigung/Bremse/Lateralbewegung/Kontakt treiben bestehende Deformer-/Body-Reaktionen. Beim Wechsel nach rückwärts das Fahrzeugmodell nicht um 180° drehen. Vorhandene Quellen/Rig-Knoten messen; fehlende bewegliche Räder benennen statt neue Herkunft behaupten.

Mechs und laufende Spezialfahrzeuge separat behandeln: Backward-/Turn-/Idle-Clips nur bei tatsächlicher Quelle/Binding verwenden. Ein vorwärts rückwärts abgespielter Walk ist ein Experiment, kein Originalclip oder allgemeiner PASS. Root-Motion darf keinen zweiten Wegsolver erzeugen.

Vorhandene Sitz-/Driver-/DriveActing-Daten dürfen geprüft werden; keine neue Fahrer-Riggingkampagne oder erfundene Einsteigeclips. Ein früher kontrollierter Enter/Exit ohne fertige Animation ist als funktionaler Übergabeprototyp zu kennzeichnen. Bestehende BOX1-Entscheidung gegen neue Fahrer-Rigs nicht still aufheben; Travel-spezifischer Driver-Receiver ist eine gesondert belegte Naht.

## 6 · Ein zusammenhängendes Testquartier statt drei fertiger Städte

Vorschlag für den ersten integrierten Abnahmefall:

`zu Fuß zum Fahrzeug → einsteigen → aus Parkbucht rückwärts ausparken → Drei-Punkt-Wende → langsam durch Vorstadtstraße → Gelände-/Asphaltübergang → Kreuzungsdrift → kurze Boostgerade → Bumper/Rampe mit sicherem Bypass → abstellen → aussteigen → kurzes Combat-Testziel → wieder einsteigen → zurück / Save / Reload`.

Ein wiederverwendbares Fixture mit Parkfläche, T-Kreuzung oder Kreuzung, Kurven, kurzen Gebäudefronten, Gehweg, sanfter Geländeneigung und Stuntabzweig reicht zunächst. City-Packs liefern kompatibel gemessene Ausstattung; nicht drei ganze Städte vor dem Controllerbeweis bauen. Gelände-/Driveintegration bleibt echter Teil der Zielabnahme, kein dekorativer Hintergrund eines isolierten Kreis-Tracks.

Auf der kleinen sphärischen Travel-Welt müssen Ortsrahmen/Einheiten, radialer Up/Gravity-Bezug und Kontaktgeometrie explizit zueinander passen. Lokaler Physikraum mit fester Tangentenbasis wäre nur ein zu prüfender begrenzter Ansatz; Höhen-/Up-Abweichung außerhalb seines Gültigkeitsbereichs messen und Grenzverhalten definieren. Nicht einfach X/Z auf die Kugel kopieren oder nur Wagen optisch radial drehen. Unterfahrten benötigen erreichbare untere Kontakte, nicht pauschal die höchste radiale Oberfläche.

Fußgänger, Ampeln und NPC-Verkehr sind eine spätere Ausbaustufe desselben Quartiers. Die erste Stufe beweist die Spielersteuerung im normalen Straßennetz, noch keinen vollständigen Verkehrssimulator. Keine Wanted-/Polizei-/Mission-/Economy-Systeme nur aufgrund der GTA-Referenz.

Free Roam→Stunt Race: gleicher Wagen, gleiche Pose/Geschwindigkeit, derselbe Controller/Kamera-/Audiokontext; Rennauftrag fügt Checkpoints, Zeitwertung und klaren Start/Abbruch/Return hinzu. Kein ungekennzeichnetes Umschalten in den v0.8-Streckenkanal an einer Kreuzung. Ein expliziter getrennter BOX1-Event-Einstieg ist als Zwischenstand zulässig, aber kein Seamless-PASS. Vorhandene v0.10-Facility-Gegenbefunde/Owner-Gates bleiben gültig; City-Drift-Arbeit muss nicht auf deren komplette Politur warten.

## 7 · Begrenzter Vorbereitungsauftrag / Exit-Kriterium

Ein eigener Chat heißt **KFB Free Roam · Walk ↔ Drive ↔ Combat · Preparation**. Er koordiniert, besitzt aber kein neues Repo/Framework.

Er liefert innerhalb der vorhandenen Dokumentstruktur:

1. Source-/Owner-Matrix mit echten Revisionen und Delta-Liste: BOX1-Trackmotor vs Production-Race-Physik; Travel-Welt/Mode/Save; Movement/Animation/Seats; Arena-Combat; City-/Road-Assets.
2. Einen begründeten Motor-/Receiver-Vorschlag sowie konkrete Input-/Pause-/Camera-/Contact-/Scale-/Gravity-/Enter-/Exit-/Recovery-Semantik. Unklare Blobs/Originalquellen prüfen, nicht aus Dateinamen oder altem Changelog schließen.
3. Ein kleines exakt referenziertes Quartier-Fixture bzw. dessen Bauauftrag und vollständige Abnahmefolge für Reverse, Wenden, Parken, Asphalt/Terrain, Drift, Boost, Bumper/Landung und Walk-Rückweg. Nur bei einer entscheidenden Unklarheit ein begrenzter Source-basierter Test; nicht vorab die ganze Runtime neu implementieren.
4. Ein gebündeltes Delta zur einen aktiven Astra-Fassung: was gehört in den nächsten Lauf, was bleibt später, welche vorhandenen Human-Gates gelten. Kein konkurrierender aktiver Gesamtbrief.

**Fertig mit Vorbereitung**, sobald Motorwahl/Receiver, Eingaben/Übergabe, Fixture und Testkriterien eindeutig genug sind. Dann Astra für zusammenhängende Implementierung/Tests/Publikation starten. Nicht warten, bis alle City-Packs vollständig gebaut oder sämtliche Clips kuratiert sind.

Vor Astra sinnvoll parallel: aktuelle Browserbefunde, Clip-/Asset-Kuratierung und unveränderliche Quellen sichern. Nach Start: keine zwei Schreiber auf denselben Runtime-Dateien. Lauf basiert auf gepinntem Brief/Lock, parallel eintreffende LookDev-/Atlas-/Clipdaten werden explizite nächste Integrationsdeltas; keine dynamische Auftragserweiterung mitten im Lauf.

## 8 · Startprompt für den Vorbereitungschat

> @GitHub Du bist der Vorbereitungschat **KFB Free Roam · Walk ↔ Drive ↔ Combat** unter bestehender WSA-Leitung. Lies diese Datei und das aktuelle Astra-Integration-01-Onboarding r3, Travel WSA_START/Contracts, Race RECOVERY plus race/CONTRACT, den konkreten BOX1-v0.8-Host und race/src/physics.js. Prüfe danach aktuelle Arena-/Animation-/ToolBox-Quellen und die realen City/Road-Assets. Kläre zuerst streckengebundenen vs freien Fahrmotor, Reverse/Steer/Brake/Parking, Drift/Boost/Hop, sphärischen Terrainkontakt und Walk↔Drive-Übergabe. Combat ist kein neuer Movement-Root; Rennen kein stiller Physiktausch. Liefere den abgegrenzten Preflight aus §7 und genau ein konsolidierbares Delta für Astra. Keine dritte Engine, keine neue Registry, kein neues Repo, keine zweite Garage, keine automatische alte PR-Promotion. Assets immer aus vorhandenen GitHub-Quellen. Noch keinen Astra-Lauf starten und keine volle City-/Runtime-Implementierung vorwegnehmen. Georg braucht kein Terminal. Ergebnis: PREPARATION READY / READY WITH OPEN DECISIONS / BLOCKED je Naht, nicht Runtime-/Human-PASS.

## 9 · Ergebnis dieses Arbeitsschritts

SOURCE REVIEW: oben benannte Host-/Contract-/Physik-/Atlas-/WB0-Dateien gelesen; keine vollständige Source-/Runtime-/Clip-Inventur behauptet.
PROPOSAL: vorbereiten vor großem Astra-Lauf; zusammenhängendes Free-Roam-Quartier; Kontroll-/Übergabevorschläge.
IMPLEMENTATION: nur diese neue Dokumentationsdatei.
TESTED RESULT: kein neuer Browser-, Reverse-, Physik-, Terrain-, Combat- oder Deploymenttest.
UNVERÄNDERT: aktiver r3-Brief, Assets, Runtime, bisherigen Owner/Contracts und menschliche Abnahmen. Kein Astra-Start.
