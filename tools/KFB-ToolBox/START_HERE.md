# KFB ToolBox v1 · Start here

Status: DECISION / EXECUTION BRIEF · 2026-09-14
Koordination: Georg. ToolBox-Arbeitsbereich: `georg-doc/kayfabizarro/tools/KFB-ToolBox/`.

## Auftrag in einem Satz

Die vorhandenen drei Werkzeuge als benutzbare ToolBox veröffentlichen, mit lesbarer UI, erhaltenen Funktionen, verlustfreiem Config-Austausch und ehrlicher Kennzeichnung von WIP und offenen Prüfungen.

## Kurzer Leseweg

1. Aktuellen GitHub-HEAD, relevante PRs und lokale Änderungen prüfen.
2. Zentralen Router `skills/chat/START_HERE.md` → `REGISTRY.json` → relevante SOP-/Sync-Deltas lesen, nicht sämtliche History.
3. Hier [MASTERPLAN.md](MASTERPLAN.md), [TOOLBOX_MANIFEST.json](TOOLBOX_MANIFEST.json) und [SOURCE_AUDIT](docs/SOURCE_AUDIT.md) lesen.
4. [Aktuellen Arbeitsauftrag](_handover/TOOLBOX_V1_2026-09-14/START_HERE.md), dann SPEC, CONTRACTS und DELIVERABLES.
5. Fonts vor UI-Arbeit; MODULES nur zur gezielten Quellensuche. Export-Onboardings sind Quellen, keine pauschalen neuen Arbeitsaufträge.

## Wichtigster Befund

Das Paket enthält drei Standalone-HTMLs, fünf Dokumente und sechs Config-JSONs. Es enthält keinen separat editierbaren Modulbaum. Dokumentierte Module können eingebettet sein; ihre Existenz als lose Quelldatei hier ist NICHT bewiesen. Für nachhaltige Änderungen zuerst den Original-Modulbaum samt Build-/Exportweg erhalten oder reproduzierbar aus dem Bundle wiedergewinnen. Nicht aus den Beschreibungen neu implementieren.

## Status nicht vermischen

Studio v17 und Rigging v1 sind vom Autor als aktive Werkzeuge geliefert; Lab v2 ist WIP. Eine aktuelle ToolBox-Site, Cross-Tool-Roundtrip, Lab-Graft-Default und finales FrizzleBob-Profil sind hier noch nicht abgenommen. Der zentrale Registry-Status wird erst nach expliziter, belegter Promotion angepasst.

## Sofort weiter, nicht neu planen

Ein zusammenhängender T1-Slice: Quellen sichern → drei Werkzeuge erreichbar machen → Schrift-/Config-/Graft-Nähte schließen → Browserprüfung → Georg-Abnahme. Routinefehler innerhalb dieses Auftrags selbst beheben. Nur bei Owner-/Vertragswechsel, fehlenden entscheidenden Quellen oder wesentlicher Umfangsänderung gezielt stoppen.

## Abbruchfest arbeiten

Nach jedem sinnvollen Arbeitsschritt den aktuellen Return und CHANGELOG sichern. Vor Sessionende nennen: Branch/Commit, aktiver Einstieg, letzter Test, offene Fehler, nächste Handlung. Ein neuer Chat beginnt hier und am aktuellen Return, nicht beim Gesprächsprotokoll.

## Nachtrag 15.09.2026 · A/B-Wiedereinstieg aus dem Authoring-Workspace

[WS0-Korrekturen und konkreter Startweg](../../skills/chat/masterplan/TOOLBOX_UX_TOWN_BIRTHDAY_2026-09-15.md), Abschnitt 1, qualifizieren den historischen Paketbefund oben. Der bisherige Design-Workspace meldet unter anderem einen gebauten Recherchi und Animation Lab v3; das ist noch kein vollständig übergebener und hier abgenommener ToolBox-Stand. Erst A sichern und unabhängig starten, danach B als einen gemeinsamen UI-Piloten auf denselben Modulen bauen. Der frische Design-Chat arbeitet dafür vorzugsweise im vorhandenen Quellenprojekt; die ToolBox bleibt Empfänger für Integration und Veröffentlichung. Keine Parallelreparatur oder Rückkehr zu widerlegten CSS3D-/Messbank-Annahmen. Die Town-Geburtstags- und Kinoideen aus dem Addendum erweitern diesen Auftrag nicht.
