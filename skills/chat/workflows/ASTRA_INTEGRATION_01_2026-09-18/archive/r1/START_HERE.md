# Astra · KFB Integration 01 · Onboarding

**Stand:** 18.09.2026 · r1
**Status:** ONBOARDING PREPARED · WORLD REVIEW PENDING · EXECUTION NOT STARTED
**Auftraggeber:** Georg. **Koordinationsort:** bestehender KFB-Produktionsrouter `skills/chat/`.

## Ergebnis, nicht bloß Aufräumen

Eine gemeinsam betreibbare KFB-Arbeitsbasis: lokale, reproduzierbare Quellen; funktionsfähige bestehende Sites; echte Verbindungen zwischen ausgewählten Produzenten und Consumern; aktualisierter KFB Hub; Wiederaufnahme ohne Chatprotokoll. Kein neues Dashboard als Ersatz für funktionierende Werkzeuge und Spiele.

Georg möchte sein Work/Astra-Kontingent jetzt für einen größeren produktiven Integrationslauf nutzen. Er nennt ausdrücklich BOX1/Race/Vehicles, World/Environment, Residents/Animation, Locomotion/Combat Arena, ToolBox/Studio/Rigging, Asset Librarian und den vorhandenen Hub. Keine dieser Lanes darf bei der Bestands- oder Ergebnisübersicht verschwinden. Das bedeutet jedoch nicht, alle Engines in einer Session zu verschmelzen.

## Eine Integrationsleitung, kein neuer Universal-Owner

Astra arbeitet als ausführende Integrationsinstanz innerhalb der bestehenden WSA-Leitung. Georg/Web-Lead entscheiden Produktumfang und Abnahme; Claude Design bleibt Authoring-/LookDev-Produzent. Bestehende Owner werden nicht ersetzt. Eine laufende andere Astra-Session wird nicht parallel mit demselben Schreibbereich gestartet: erst Checkpoint/Scope abgleichen.

**Zentralisieren:** Arbeitszugriff, reproduzierbarer Gesamtstand, Build-/Test-Orchestrierung, Übergaben und Hub-Navigation.
**Nicht zentralisieren:** sämtliche Physik, Weltkoordinaten, Kamera, AnimationMixer, Actor-Look oder Registry in eine neue Runtime.

Der lokale Arbeitsordner ist ein Multi-Repo-Workspace, kein neuer SSOT und kein Auftrag zum Monorepo-Umzug. GitHub bleibt dauerhafte Wahrheit, pro Verantwortung mit genau einem Owner. Ein kleiner Integrations-Lock beschreibt nur, welche bestehenden Revisionen zusammen geprüft wurden. Er ersetzt weder Asset-Registry noch Projekt-Contracts.

## Leseweg für Astra

1. Dieses Dokument und [WORLD_REVIEW.md](WORLD_REVIEW.md), insbesondere nachgetragene Befunde.
2. [SOURCE_BASELINES.json](SOURCE_BASELINES.json): beim Briefing tatsächlich gelesene Revisionen und konkrete Einstiegspfade. Snapshot, kein bereits getesteter Integrations-Lock.
3. [EXECUTION_BRIEF.md](EXECUTION_BRIEF.md): Produktabläufe, Scope, Abnahme und Grenzen.
4. [WORKSPACE_RECOVERY.md](WORKSPACE_RECOVERY.md): lokale Arbeit, sichere Git-Synchronisation und Wiederanlauf.
5. Bestehende zentrale Regeln: `skills/chat/START_HERE.md`, `REGISTRY.json`, `SYNC_PROTOCOL.md`, `PRODUCTION_SOP.md`, `adapters/chatgpt-astra.md` und Assembly A0. Nur relevante Deltas der langen Living-/History-Dateien lesen.
6. Aktuelles HEAD, offene aufgabenrelevante PRs/Branches, lokale Änderungen und aktuelle Start-/Return-Dateien jedes tatsächlich bearbeiteten Owners prüfen. Bei Teilbereichsarbeit dessen AGENTS/Verträge lesen.

Die Quellenkarte verkürzt die Suche, friert aber die Entwicklung anderer Chats nicht ein. Neu eingehende Audio-Dateien zuerst am wirklichen GitHub-Stand suchen. Ein höherer Versionsname oder ein neuer Inbox-Ordner ist noch keine Promotion.

## Freigabestatus dieses Pakets

Georg hat die Vorbereitung dieses Onboardings beauftragt. Hierdurch wurde noch kein Work-Run gestartet, kein lokaler Astra-Workspace eingerichtet und kein Zugriff in einer anderen Session bestätigt.

Der World-Chat soll den Entwurf unabhängig prüfen und additiv ergänzen. Astra darf einen kurzen read-only Capability-/Quellen-Preflight vorbereiten. Der teure Cross-Owner-Implementierungslauf beginnt nach aufgelöstem World-Gegencheck oder einer ausdrücklichen Entscheidung Georgs, ohne ihn zu starten. Ein fehlender Review rechtfertigt keine weitere endlose Recherche.

Der Gegencheck erteilt keine menschliche Topologie-/Fahr-/Klang-/Visual-Abnahme. Bereits akzeptiertes Audio und v0.8-Feel werden nicht erneut pauschal zur Abstimmung gestellt.

## Startprompt für die Work-/Astra-Session

> Du führst **KFB Integration 01** als Ausführungsinstanz der bestehenden WSA-Leitung durch. Lies dieses START_HERE und die verlinkten Dateien aus aktuellem GitHub. Prüfe World-Review, echte Berechtigungen, lokale Arbeitsumgebung und neu eingegangene Quellen, insbesondere Audio A1. Nutze lokale Repo-Checkouts und die vorhandenen Build-/Testwege, nicht hunderte Datei-Connector-Roundtrips oder immer neue Einmal-Workflows. Arbeite auf reviewbaren aufgabenbezogenen Branches, lasse fremde lokale Änderungen unangetastet und sichere Fortschritt früh auf GitHub. Liefere einen zusammenhängenden nutzbaren Integrationsstand mit realen Producer→Consumer-Nachweisen und dem aktualisierten bestehenden KFB Hub, keine neue Universal-Engine und kein bloßes Link-Dashboard. Respektiere die Scope-/Abnahmegrenzen im EXECUTION_BRIEF. Keine Fahrer-Rigs in BOX1, kein v0.9-Replay, keine Birthday-Reaktivierung, keine erfundenen Assets oder Audio-Nachbauten. Nicht ausgeführte Tests bleiben offen. Georg benötigt weder Terminalbefehle noch ein erneutes Gesprächsarchiv.

## Praktisches Erfolgsbild

Georg öffnet den bestehenden Hub, erreicht die korrekt bezeichnete Race-/Box-Stop-Site sowie die bestehenden World-, ToolBox-, Atlas-, Librarian- und Arena-Einstiege, und kann mindestens die im Brief definierten tatsächlichen Integrationspfade benutzen. Ein neuer Arbeitsprozess stellt denselben geprüften Zustand aus GitHub wieder her und kennt den nächsten konkreten Schritt. Ein Chat darf enden, ohne dass dadurch Arbeit oder Zuständigkeit neu erfunden werden muss.

**Noch nicht vorhanden:** Integration-01-Implementierung, Astra-Workspace-/Permission-PASS, World-Gegencheck, neuer Gesamt-Browser-PASS. Dieses Paket ist der ausführbare Auftrag, nicht dessen Ergebnis.
