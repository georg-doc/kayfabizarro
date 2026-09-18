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
