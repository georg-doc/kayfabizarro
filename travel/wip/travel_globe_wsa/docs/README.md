# KFB Travel Globe · B0

Eigenständiger Arbeitsstand des unveränderten Travel Globe v13.3 R0.

**B0 läuft. Privates Implementation-Repository: https://github.com/georg-doc/KFB-Travel-Globe. Noch keine B0-Abnahme und keine Cloudflare-URL.**

## Start

Node.js 22 oder neuer; keine Paketinstallation für Build und Funktionstests erforderlich.

```text
npm test
npm run build
npm run verify
npm run serve
```

Danach http://127.0.0.1:4173 öffnen. Internetzugang ist für die externen Laufzeitmodule und Assets erforderlich.

- `/` unveränderte R0-Laufzeit
- `/docs/` Werkstatt und Produktfolge
- `/docs/web-start.html` Einstieg für die nächste Sitzung
- `/qa/` Belege und offene Prüfungen
- `/qa/browser.html` technische Diagnose im Frame; kein Ersatz für normalen Spieltest
- `/build/identity.json` Commitstatus, Inhaltskennung und Datei-Hashes

`travel/` bleibt byte-identisch zum eingefrorenen Git-Import. Die generierte `dist/index.html` ist eine zweite Kopie des ursprünglichen Einstiegs am gleichen relativen Ressourcenpfad. Keine Bündelung, kein neues Framework, keine Änderungen an Flug oder Darstellung.

Herkunft und Prüfsummen: `B0_BASELINE.json`. Aktueller Bericht: `qa/B0/RETURN.md`. Historische R0-Aussagen stehen unverändert in `R0_RETURN.md`, `travel/QA/` und `docs/` und ersetzen keine B0-Prüfung.

## Cloudflare Pages · Build vorbereitet, Kontoverbindung offen

Ziel: privates GitHub-Repository `georg-doc/KFB-Travel-Globe`, Produktionszweig `main`, Framework `None`, Build `npm test && npm run build && npm run verify`, Ausgabeverzeichnis `dist`, Node.js 24. Keine Secrets für den Build nötig.

Die Pages-Git-Integration muss im Zielkonto eingerichtet und mit dem Repository verbunden werden. Ein privates Repository macht die ausgelieferte Pages-Site nicht privat: der WIP ist als öffentliches statisches Angebot vorgesehen. Deshalb enthält `dist/` nur Laufzeit, ausgewählte Projektdokumentation und QA; das ursprüngliche Handoff-Paket wird nicht als Ganzes veröffentlicht.

Konfiguration nach https://developers.cloudflare.com/pages/configuration/build-configuration/ (abgerufen 2026-09-13).

## Grenzen

B0 endet vor FrizzleBob, Bath/Rover, Walk, Stunt Race und weiterem Combat. MVP1 startet erst nach Georgs B0-Abnahme. Es gibt keine unabhängige Spielpositions-, Kamera- oder Asset-Eigentümerschaft außerhalb der bestehenden Verträge.

## Zusammenarbeit

Vorbereitete Aufträge für ChatGPT Web, Claude Design und Coworker: `_handover/INDEX.md`. Rückgaben mit Meta-Report unter `_inbox/`; Astra übernimmt Review, Tests und Git-/PR-/Merge-Verwaltung. Quellen/Spender bleiben getrennt von diesem Implementation-Repository.
