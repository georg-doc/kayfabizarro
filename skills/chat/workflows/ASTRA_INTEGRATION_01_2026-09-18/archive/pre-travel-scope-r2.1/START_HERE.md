# Astra · KFB Integration 01 · Onboarding r2.1

**Stand:** 18.09.2026 · r2.1 · **WORLD REVIEW COMPLETED / READY WITH SCOPED CHANGES**.
**Einziger aktiver Ausführungsauftrag:** [EXECUTION_BRIEF.md](EXECUTION_BRIEF.md), World-konsolidierte r2, mit der verbindlichen Nutzerpräzisierung [DELIVERY_CONTRACT.md](DELIVERY_CONTRACT.md).
**Ausführung:** NOT STARTED. Briefingreife ist keine Runtime-, Geräte-, Deployment- oder menschliche Spielabnahme.

## Verbindliche Auslieferung · Georgs Korrektur

**ChatGPT-Site UND Cloudflare über KFB. Kein githack als Liefer- oder Ersatzadresse.** Beide Fassungen stammen aus demselben GitHub-Quellstand; Hosting-/Packaging-Anpassungen bleiben nachvollziehbar und erzeugen keine zweite Implementierung.

ChatGPT-Site heißt echte ausführbare Site in der dafür geeigneten ChatGPT-Zielumgebung, nicht HTML-Download, Screenshot oder externer Link. Cloudflare heißt der vorhandene KFB-Pages-/Hub-Weg:

- BOX1: `https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/`
- Hub: `https://kayfabizarro.pages.dev/kfb-hub/`

Fehlt ein erforderliches Site-/Publish-Werkzeug, dieses Ziel als BLOCKED ausweisen statt auf einen anderen Host auszuweichen. Frühere githack-URLs/Tests im unveränderten r1-Quellensnapshot und alten Returns sind ausschließlich historische Evidenz, keine aktuelle Startempfehlung. Der DELIVERY_CONTRACT ersetzt die alte CDN-Fallback-Erlaubnis, nicht die World-Korrekturen WR01–WR07 oder bestehende Owner-/Human-Gates.

**Aktueller BOX1-Auslieferungsbefund:** Der erneut ausgeführte bestehende Cloudflare-Prüflauf `kayfabizarro/35297175922`, Job `105467708547`, bestand jetzt **29/29** Prüfungen auf der tatsächlichen KFB-Cloudflare-URL. Quelle `1d88a887fc6ff4a1fc907afe5dbdef154181b221`; Artefakt `10529969236`. Der frühere Cloudflare-Fehlversuch bleibt Historie. Das ist BOX1-Zielprüfung, keine fertige Integration 01. Eine native ChatGPT-Site wurde in dieser Web-Session nicht erzeugt; das erforderliche Publish-Werkzeug ist hier nicht verfügbar.

## Ziel und Zuständigkeit

Ein größerer produktiver Integrationslauf auf den vorhandenen Quellen: BOX1/Race/Vehicles/Audio, World/Environment, Residents/Animation, ToolBox/Studio/Rigging, Arena, Librarian und der bestehende Hub. Ein gemeinsamer lokaler Multi-Repo-Arbeitsraum, keine Universal-Engine, kein Monorepo-Umzug, keine neue Registry.

Astra ist Ausführungsinstanz unter der bestehenden WSA-/Web-Lead-Leitung; Claude Design bleibt Authoring-/LookDev-Produzent. Projekt- und Modulowner bleiben unverändert. GitHub ist dauerhafte Wahrheit. Der kleine Integrations-Lock beschreibt nur die zusammen geprüften bestehenden Revisionen. Keine zweite gleichartige Astra-Session ohne Abgleich bereits beanspruchter Pfade.

## Jetzt lesen

1. Dieses Dokument → [DELIVERY_CONTRACT.md](DELIVERY_CONTRACT.md) → [aktiver Brief r2](EXECUTION_BRIEF.md).
2. [WORLD_REVIEW.md](WORLD_REVIEW.md), Abschnitt **r2 · ausgeführter World-Gegencheck**: sieben konkrete Befunde mit Quellen und Ownern. Die r1-Review-Anforderung davor bleibt unveränderte Historie.
3. [SOURCE_BASELINES.json](SOURCE_BASELINES.json): unveränderter r1-Quellensnapshot, **kein aktiver Integrations-Lock**. Review-PENDING und die damalige Preview-Adresse beschreiben nur den damaligen Zustand. Neu geprüfte Pins und Einschränkungen stehen im r2-Review; beim Work-Start HEAD/PR/Quelleneingänge erneut prüfen.
4. [WORKSPACE_RECOVERY.md](WORKSPACE_RECOVERY.md): Capability-Preflight für beide Site-Ziele, sichere Branches/Checkpoints, zweiter sauberer Wiederanlauf, Publikationsgrenzen.
5. Bestehender Router `skills/chat/START_HERE.md`, Registry, Sync-Protokoll, Production SOP, Astra-Adapter, Assembly A0 und relevante Projekt-AGENTS/Contracts. Nur relevante Deltas, keine vollständige Historienrekonstruktion.
6. [CHANGELOG.md](CHANGELOG.md): WR01–WR07 übernommen; r2.1 ergänzt nur die beiden Auslieferungsziele und den tatsächlichen BOX1-Cloudflare-Test. Frühere positive Urteile bleiben erhalten.

## Entscheidende Präzisierungen

WB0 hat derzeit einen **Asset-Palettenimport**, noch keinen vollständigen S6-Ensembleimport. Der erste neue Consumerbeweis bleibt Lorekeeper/Tome/Staff + sieben Hex-Zellen + Travel-ROAD nach dem bestehenden Ground-Gate. Persistenz, sphärischer Bezug und Handslot müssen ausdrücklich mittransportiert werden.

Der v0.10-Blockout existiert, ist aber **vor dem nächsten Topologie-Gate geometrisch zu korrigieren**: Stützen und Servicegebäude schneiden den unteren Fahrkorridor; der bisherige Audit prüft das nicht. BOX1 bleibt auf seiner akzeptierten v0.8-Fahrbasis. Keine zweite Facility bauen.

Audio A1 bleibt klanglich akzeptiert. Originalquelle bei Einstieg neu suchen; fehlende Quelle nur für diese Integrationsnaht als SOURCE BLOCKED führen. Arena-Anbindung bleibt zunächst Start/Regression/Hub-Rückweg, kein nahtloses Travel-Portal. Native ChatGPT-Site, Cloudflare, lokale Tests und menschliche Abnahme bleiben getrennte Nachweise.

## Startprompt

> Führe KFB Integration 01 als Ausführungsinstanz der bestehenden WSA-Leitung aus. Lies START_HERE r2.1, den DELIVERY_CONTRACT und den einzigen aktiven EXECUTION_BRIEF r2 aus aktuellem GitHub, danach den ausgeführten World-Gegencheck WR01–WR07. Liefere als **echte ChatGPT-Site UND Cloudflare über den bestehenden KFB Hub**, nicht über githack oder einen Ersatzhost. Prüfe echte lokale/Git-/Browser-/Netzwerk-/Site-Publish-/Deployrechte und neue Quellen, insbesondere Audio A1. Nutze lokale Checkouts, vorhandene Tests und reviewbare Branches; sichere frühe gepushte Checkpoints. Liefere die Gebrauchspfade A und B mit genauer Integrationstiefe pro Lane. Repariere die benannten Import-/Persistenz-/Facility-Lücken in ihren jeweiligen Ownern; keine Universal-Engine, neue Registry, zweite Garage oder Ersatz-Audioquelle. Bestehende humane Gates nicht selbst erteilen. Keine Fahrer-Rigs, kein v0.9-Replay, keine Birthday-Reaktivierung. Fehlende native Site-/Deployfähigkeit und unvollständige Consumerpfade bleiben PARTIAL/BLOCKED; ein Linkhub oder HTML-Download allein ist keine gelieferte ChatGPT-Site. Georg benötigt kein Terminal und keinen Transkript-Dump.

## Archiv und Grenzen

[archive/r1/START_HERE.md](archive/r1/START_HERE.md) und [archive/r1/EXECUTION_BRIEF.md](archive/r1/EXECUTION_BRIEF.md) sind byte-identische Vorgänger aus `9493bce02c0e8ca39ca34c741e9a98993422ddad`. Sie sind nicht parallel aktiv. Der vor dieser Auslieferungskorrektur gültige Start und Workspace-Regelstand ist unter `archive/pre-delivery-r2/` byte-identisch erhalten. Der ausgeführte World-Review, sein aktiver EXECUTION_BRIEF r2 und seine Geometrie-Evidenz wurden nicht überschrieben.

Dieser Eintrag richtet keine Work-Umgebung ein und startet keinen Astra-Lauf. Routinepräzisierungen sind konsolidiert; Umfangs-/Owner-/Kanonänderungen oder das Überspringen vorhandener menschlicher Gates bleiben Entscheidungen Georgs.
