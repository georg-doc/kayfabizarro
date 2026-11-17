# WSA Patch · Zwei Decks in der Kartenreise R1

17.11.2026 · privat, kein Merge.

Site-Artefaktquelle: `1272557850c952167e17a503e551b27ba17a8e0b` (kein Game-GitHub-Head). Basis `f206cb848106e48573e88e4397d8b0b218a7f7dc`.
Private Veröffentlichung erfolgreich: `appgdep_6afcab40f3d081918accf09ed7c9a604`.
Gespeicherte Version: `appgprj_6af7435fa7b48191a1739992fa8ffed7~appgver_70a9b6a205a08191890f81b84ef21add`.
Ansicht: https://kfb-infiniterooms.frizzlebob.chatgpt.site/stream-lab/

## Ergebnis

Die bestehende, physisch durchgehende Fünf-Raum-Kartenreise führt nun durch zwei echte Decks: Räume 1–2 Forget Utopia, Räume 3–5 Ignore Dystopia. Die ersten beiden Raumidentitäten und Motive bleiben erhalten. Übersicht und Guide-Ziele zeigen die Deck-Zuordnung (FU / ID). Freier Rückweg, Scroll-/Ziel-Guide in beide Richtungen, sichere Mittelspur, Notfall-Rückkehr, aktueller Reset und optionaler echter HeroMan-Blaster bleiben beim bisherigen Raumplan.

Deck-ID und Kartennummer werden gemeinsam aufgelöst. Gleich nummerierte Karten verschiedener Decks verwenden getrennte URLs, Textur-Leases und Raumzustände. Unbekannte/falsche Manifest- oder Kartenreferenzen werden abgewiesen, nicht durch die erste Karte des ersten Decks ersetzt. Native Bruch-, Kollisions-, CombatPlayer-, VFX- und Audio-Besitzer unverändert. Keine Portale oder verpflichtenden Kämpfe. Höchstens drei geladene Räume; bestehende Karten- und Snapshot-Budgets unverändert.

## Kartenquelle

Ignore Dystopia ist im bestehenden Spielkatalog `src/data/cards/kfb-card-packs.r1.json` eingetragen. Dessen festgelegter Quellstand ist `georg-doc/kayfabizarro` @ `8799ce51e757ba30a9fa1ab2016a8e402d08f90e`.
Manifest: `decks-ssot/ignore_dystopia/manifest.json`, Git-Blob `1058b43683a377f8d2b857ad95550d5b5239d37b`.

Alle 56 vollständigen Kartenbilder aus dem vorhandenen WS0-Bau-Cache kopiert. Sämtliche Git-Blob-Hashes und Dateigrößen gegen das festgelegte GitHub-Verzeichnis geprüft, sämtliche Bildmaße gegen das Manifest geprüft; zusätzlich SHA-256-Belege. Neue Kartenbilder insgesamt 7.977.220 Byte. Im Spielstamm nichts geändert. Runtime lädt nur die gebackenen Site-Dateien, nicht von GitHub.

Übernommen sind das Manifest und die vollständigen Kartenbilder. Cover-/Motiv-/Page-Galerie sind nicht Teil dieses Anschlusses. Forget Utopia wurde nicht ersetzt.

## Prüfungen

4/4 neue Zwei-Deck-Tests, 7/7 bestehende Pfadtests, 12/12 Checkpoint-/Raumzustandsprüfungen bestanden; Produktions-Build erfolgreich.

Reale Rapier-Kapsel durch beide Decks und zurück. Separate Bruchzustände bleiben nach Entladen/Wiederladen erhalten; Kartentexturen bleiben an ihre tatsächlichen Deck-IDs gebunden. Fremder Deckzustand wird abgewiesen. Neue Treffer nach Wiederkehr und lokaler Reset funktionieren; Reset im Dystopie-Raum verändert den gespeicherten Utopie-Bruch nicht. Höchstens drei Raumbesitzer, Kartenbudget eingehalten, alle Textur-Leases/Collider/Bodies nach Dispose freigegeben.

Lokal im Browser: Guide 1 → 3 (Ignore Dystopia), ein echter Blaster-Schuss, ein bestätigter Kontakt, 42 entfernte Voxel. Zurück nach Raum 1 (Forget Utopia): sämtliche Dystopie-Räume entladen. Erneut Raum 3: derselbe Bruch mit 42 entfernten Voxeln wiederhergestellt, keine wiederholten Trümmer. Der native Bruchgraph entscheidet über die Zahl nötiger Schüsse; der Test setzt keinen garantierten Bruch nach genau einem Schuss voraus.

Belege in der Site-Quelle: `docs/handoffs/two-deck-r1/RETURN.md`, `source-index.json`, `asset-verification.json`, `tests.txt`, `regression-tests.txt`, `state-tests.txt`, `build.txt`, `live-proof.json`.
Code: `streaming/decks.mjs`, `streaming/plan.mjs`, `stream-lab/main.mjs` unter `probes/patch-transfer-r1/`.

## Grenzen / Nächste Schritte

Zustand gilt weiter für die laufende Sitzung, nicht nach Browser-Neustart. Layout bleibt die feste gerade Modulfolge; prozedurale Raum-/Verbindungsanordnung folgt separat. Streaming-Pfad zeigt Originalkarten; HN-/Farbbänder-Dissolve über mehrere Räume und räumliche Audio-Nachbarschaft bleiben offen. Kontrollierter Performance-/Langzeit-Nachtest unter geringer Rechnerlast bleibt offen; dieser Funktionsnachweis ist kein Performance-PASS.

Kein Game-Merge. Einbau in den Stamm bleibt WS0 nach Georgs PASS. Aktualisierte Roadmap im selben Ordner: `WSA_ROADMAP_ENDLESS_DUNGEON_SURFACE_STATE_R1_2026-11-17.md`.
