# KFB Integration 01 · Additiver Changelog

Bestehende Einträge bleiben erhalten. Neue Entscheidungen, Quellenbefunde, Umsetzungen und Testergebnisse getrennt anfügen. Dieses Protokoll koordiniert den Auftrag; Projekt-Returns und deren GitHub-SSOTs bleiben maßgeblich.

## 2026-09-18 · r1 · WSA/Web-Lead · ONBOARDING PREPARED

### USER REQUEST

Georg möchte Work/Astra für einen größeren produktiven Integrationslauf mit lokalen Quellen und GitHub-Zugriff nutzen. Abdeckung: BOX1/Race/Vehicles, World/Environment, Residents/Animation, Locomotion/Arena, ToolBox/Studio/Rigging, Asset Librarian und bestehender KFB Hub. Ein World-Chat-Gegencheck mit additiven Ergänzungen ist gewünscht. Der Auftrag hier ist Vorbereitung/Onboarding, kein bereits gestarteter Astra-Run.

### SOURCE REVIEW

Aktuelle HEADs gelesen: kayfabizarro `6abb74f87e4325ee57642ed7aa79ef895dd34241`; Race `616c151b3b82c06e1e87694e3b83400746fb843b`; Travel `33c731c012c573977cccd4f62723b741f0c1e785`; Arena `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`.

Zentrale Router-/Sync-/SOP-/Astra-Regeln und Assembly A0 gelesen, beide Briefing-Postmortems berücksichtigt. Aktuelle Travel-/Arena-Startquellen, World-POC-Grenzen, ToolBox-Stage-First-/Atlas-Intake sowie Librarian-Recovery gezielt gelesen; keine volle Neuprüfung sämtlicher Quellbäume oder Clips behauptet.

Audio-A1-Original wurde am gelesenen Stand noch nicht gefunden; Georg berichtet laufenden Check-in. Nicht als dauerhaft fehlend festschreiben: Astra aktualisiert diesen Eingang beim Start. ROOT RECOVERY.md in Travel lieferte 404; tatsächlicher Einstieg ist WSA_START.md. KFB-Production-Inbox-Zugriff 404, Ursache nicht aufgelöst; keine neue Infrastruktur daraus erfunden. Live-Hub-Fetch in dieser Umgebung nicht möglich, daher kein neuer Deployment-PASS.

### PROPOSAL

Lokaler Multi-Repo-Workspace, eine ausführende Integrationsinstanz unter bestehender WSA-Leitung, kleiner Release-/Recovery-Lock auf vorhandene Quellen. Keine Monorepo-Migration, keine Universal-KFB-Engine, keine zweite Registry. Schwerpunkt auf nutzbarem BOX1-/Audiopfad und echtem Authoring→Resident→Consumer-Roundtrip; Arena/andere Module bleiben im selben lokalen Arbeitszugriff und Hub, mit ehrlicher Integrationstiefe.

### PRESERVED DECISIONS

Audio-Klangrichtung akzeptiert; v0.8-Feel erhalten; v0.9 verworfen; BOX1 zunächst ohne neue Fahrer-Rigs. Neue Facility-Topologie existiert als eigener Blockout, nicht als fertige BOX1-Fahrt. World-/Travel-/ToolBox-/Animation-/Arena-/Registry-Owner und noch offene menschliche Gates bleiben erhalten. Birthday ist archivierte Fehlhistorie, kein aktiver Integrationsconsumer. GitHub-Assets vor Duplikation, vorhandener Hub vor neuem Dashboard.

### ARTIFACTS

START_HERE.md; EXECUTION_BRIEF.md; WORKSPACE_RECOVERY.md; SOURCE_BASELINES.json; WORLD_REVIEW.md; dieser Changelog.

### IMPLEMENTATION / TESTED RESULT

Implementiert ist nur das Onboarding-Dokumentpaket. Keine Runtime geändert, kein neuer lokaler Astra-Workspace behauptet, keine anderen Sessionrechte geprüft, kein neuer Spiel-/Browser-/Hörtest, kein Hub-Neudeployment. Frühere 120/29-BOX1-Nachweise sind als historische Evidenz verlinkt und nicht als neuer Integration-01-Test ausgegeben.

### OPEN

Unabhängiger World-Gegencheck; tatsächlicher Astra-Capability-/Quellen-Preflight; ggf. aktualisierter Audio-Eingang; Freigabe der konsolidierten Laufabdeckung; erst anschließend konkrete Implementierung/Consumer-QA. Keine Automation oder Hintergrundüberwachung eingerichtet.

---

## Format für folgende Einträge

Datum · Revision · Autorrolle · PROPOSAL / DECISION / SOURCE / IMPLEMENTATION / TESTED RESULT / OPEN / SUPERSEDED.

Quelle/Commit; präzise Änderung; betroffene Dateien/Owner; was ersetzt oder unverändert bleibt; echte Test-/Deploymentnachweise; nächste konkrete Aktion. Review-Abschnitt/PR verlinken. Keine bloße Zahl ohne Befund und Geltungsbereich.

---

## 2026-09-18 · r2 · Web-/World-Lead · REVIEW + CONSOLIDATED BRIEF

### SOURCE / SANITY

Erneut gelesene HEADs: kayfabizarro `9493bce02c0e8ca39ca34c741e9a98993422ddad`; Travel `33c731c012c573977cccd4f62723b741f0c1e785`; Race `616c151b3b82c06e1e87694e3b83400746fb843b`; Arena `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`. Travel-World-Recipe/Import/Support, Pilotbrief, Atlas-Struktur-/Staffdaten und Race-v0.10-Geometrie direkt geprüft. Arena-Owner-Map bleibt als historische Quelle bezeichnet. BOX1-Abschlussnachtrag gelesen: 120/120 breit, 29/29 gepinnter Preview, Cloudflare-Marker-FAIL. Kein neuer Browserdurchlauf.

### DECISION / ACCEPTED REVIEW FINDINGS

WR01–WR07 aus WORLD_REVIEW übernommen: wirklicher S6-Consumer statt Assetpalette; explizit verlustfreier/fehleratomarer World-Roundtrip; Tangentenrahmen und Ensemblemaßstab; konkreter Handslot/Clip/Mixer; begrenzte Supportsemantik; v0.10-Korridor-/Stützen-/Gebäudereparatur vor Fahrintegration; URL-/Origin-spezifische Publishnachweise; Arena-Navigation ohne behauptetes Portal. Keine Änderung der Owner, A0, humanen Gates, Roster oder Produktidentität. Frühere Audio-/v0.8-/positive BOX1-Urteile nicht zurückgesetzt.

### IMPLEMENTATION · DOCUMENTATION ONLY

Einziger aktiver Ausführungsauftrag ist EXECUTION_BRIEF.md r2. START_HERE ist aktualisiert; WORLD_REVIEW und dieser Changelog wurden additiv fortgeschrieben. Das r1-Paket ist unter archive/r1 mit denselben Git-Blobs erhalten. SOURCE_BASELINES bleibt der explizit historische r1-Snapshot, WORKSPACE_RECOVERY unverändert. Ein Rechenbeleg zum v0.10-Gegenbeispiel liegt unter evidence/v010-source-geometry-review.json. Kein Runtime-/Asset-/Contract-/Workflow-Patch, keine neue Registry, keine Hub-UI-Neugestaltung, keine neue Ausführung gestartet.

### TESTED RESULT / LIMITS

Git-Blob-Prüfung der erhaltenen Originaltexte WORLD_REVIEW und CHANGELOG lokal bestanden. Lokale analytische Gegenprüfung: beide Stützenmittelpunkte 1.45521375 von der unteren Route bei halber Breite 3.75; Gebäude schneidet Route; zentrale freie Höhe aus Renderer-Dicken 4.60 statt 5. Quellenwerte aus gelesenen Pins übernommen; dies ist **kein** Browser-/Kontakt-/Fahrtest. Die historische Topologie-Smoke-Prüfung war für Freiraumbehauptungen unzureichend, auch in der früheren Web-Lead-Rückgabe.

Live-Abfragen der drei Cloudflare-Zielseiten in dieser Review-Umgebung fehlgeschlagen; aktueller Public-Browserstatus NOT_VERIFIED_HERE. Lokales Raw-GitHub-Netzwerk scheiterte an DNS; kein Schluss auf künftige Astra-Sessionrechte. Keine Testzahlen oder Deployfreigaben erfunden.

### OPEN / READINESS

Briefing: **READY WITH SCOPED CHANGES**, Präzisierungen in r2 konsolidiert. Ausführung: **NOT STARTED**. A1 ohne Originalquelle SOURCE BLOCKED; Pilot nach bestehendem Ground-/Atlas-Gate; Facility-Drive erst nach technischen Reparaturen und menschlichem Topologie-Gate. Ein aktiver Work-Executor beginnt mit echtem Capability-/Quellenpreflight, nicht mit neuen Quellenrekonstruktionen oder einem weiteren Gesamtplan.

---

## 2026-09-18 · r2.1 · WSA/Web-Lead · ChatGPT-Site + KFB Cloudflare

### DECISION BY GEORG

Auslieferung als echte ChatGPT-Site UND Cloudflare über den vorhandenen KFB-/Hub-Weg, nicht über githack. Derselbe GitHub-Quellstand, getrennte echte Nachweise beider Zielumgebungen. Fehlendes Site-/Deploy-Werkzeug als BLOCKED ausweisen; keine Download-/iframe-Attrappe und kein Ersatzhost. Historische githack-Nachweise bleiben erhalten, sind keine aktuelle Lieferempfehlung.

### CONCURRENT SOURCE PRESERVED

Während der Vorbereitung traf World-Review PR #54 / Merge `0ce76d66c12beea294cf9024ad65b57eb4c1141b` ein. Vor dem Schreiben erneut gelesen. Der World-konsolidierte EXECUTION_BRIEF r2, WORLD_REVIEW, r1-Archiv und World-Geometriebelege bleiben unverändert. Kein Zurücksetzen auf den früheren REVIEW PENDING-Entwurf. START_HERE r2.1 bindet den engeren DELIVERY_CONTRACT und den aktiven World-Brief zusammen. Vorgänger von START_HERE/WORKSPACE_RECOVERY unter archive/pre-delivery-r2 byte-identisch erhalten; Source-Snapshot r1 bleibt historisch.

### TESTED RESULT · ACTUAL KFB CLOUDFLARE

Bestehenden BOX1-Prüflauf einmal wiederholt, kein neuer Workflow: `kayfabizarro/35297175922`, neuer Job `105467708547`, **29/29 PASS** auf `https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/`. Tatsächlich ausgelieferte Quelle: `1d88a887fc6ff4a1fc907afe5dbdef154181b221`. Prüfung umfasst Source-Marker/Bytes, Fahrzeugwahl/Wagon, Countdown, Tastaturfahrt/Drift, Van-Metronome-/Next-Track-Playback und simulierte mobile Touch-Eingaben. Keine Page-/Console-/HTTP-Fehler. Kein physischer Gerätetest und keine automatische Georg-Abnahme.

Artefakt `10529969236`, erstellt 2026-09-18T03:16:14Z, SHA-256 `26f69e7b7d5d2105ecb8780d5c46f0c4e25e6cdefd75e19a76c07e3cff6c4687`; results.json SHA-256 `ee713f56b52c2ed3498c299ffe158860789d79041a52b4945b918152cb5e795a`. Originalbericht lokal gelesen, Desktop-Box-Stop-Screenshot angesehen. Der erste Fehlversuch desselben Runs bleibt historische Evidenz und wurde nicht umgedeutet.

### OPEN / DELIVERY BOUNDARY

Native ChatGPT-Site in dieser Web-Session nicht erstellt: kein entsprechendes Publish-Werkzeug verfügbar; Connector-Verzeichnissuche liefert keinen nativen Site-Weg. Kein Drittanbieter-Generator installiert. Diese Zielauslieferung bleibt offen und ist im tatsächlichen Work-/Sites-Kontext zu erfüllen. Erfolgreiche BOX1-Cloudflare-Prüfung ist kein fertiger Integration-01-Gesamtstand. Keine Runtime-/Assetänderung durch diese Dokumentationskorrektur; keine neue Astra-Ausführung.
