# RETURN · INFINITRA architecture + Polyfork 3D asset pool · WS0 Research R1 · 2026-11-02
Status: **DURABLE RESEARCH SAVED / WS0 HANDOFF / NO GAME OR ASSET RUNTIME IMPLEMENTATION**

## Was jetzt verfügbar ist
Zwei unabhängige konkrete Donors für **die laufende prozedurale KFB Open World** sind im bestehenden WS0 GitHub-Register quellengeprüft und dokumentiert:
1. [INFINITRA World-Architecture Research](RESEARCH_INFINITRA_ARCHITECTURE_WS0_R1_2026-11-02.md) — Positions-/Seed-Determinismus, ortsfeste Netzwerkgenerierung über Chunkgrenzen, Sparse Save-/Mutation-Overlay, LOD-/Identitätsstabilität; proprietäre Unity-Engine bleibt extern; keine Voxel-Umstellung.
2. [Polyfork Parametric Asset Pool Research](RESEARCH_POLYFORK_PARAMETRIC_ASSET_POOL_WS0_R1_2026-11-02.md) — aktuell ~2.800 free low-poly Parametric Three.js ES Modules + GLB, REST/MCP Discovery, thematische Kits, echte Asset-Quell-Isolation, rechtlicher Safeguard zu KFB Asset Librarian Distribution/Hotlinks. Kein ungeprüfter Katalogimport.
Die zuvor persistierte [THREE.LOD-/BatchedMesh-Forschung](RESEARCH_THREEJS_LOD_PROC_WORLD_WS0_R1_2026-10-30.md) bleibt der zugehörige Performance-/Renderer-Donor. Keine zweite LOD-/Clay-/Track-/Save-Runtime schaffen.

## Owner/Branch/Quelle
- **Research Owner:** bestehendes `georg-doc/kayfabizarro` WS0-Entscheidungsregister, Branch `docs/kfb-decisions-register-2026-10-11`; kein neuer PR erforderlich, kein Produktions-Branch beschreibend verändert.
- **Aktiver Product Owner:** privat `georg-doc/KFB-Stunt-Car-Race`, Integrationsstamm `game/integration-r2`, Abruf am 02.11. `d66ef79ad93afe921a61a6a41f39790d9b505b93`; am nächsten Ausführungstag erneut lesen.
- **Aktuelle Steuerung:** `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/WS0_STATE.md` (31.10. V-1077: Integration R2 Stamm; Plan V-1083/1090); Material aus `lab-docs/PROJECT_STATE.md` ist historisch und keine aktuelle Runtime-Freigabe.
- **Asset Owner:** Asset Librarian/Registry (Discovery, Provenienz); aktueller WSA-Prop-Pool-R2-Auftrag `replies/WS0_AN_WSA_V1026_PROP_POOL_R2.md` plus `kfb-place` bleiben führend, neue Polyfork-Kandidaten ohne Laufzeit-/Katalog-Freigabe.
- **INFINITRA Fremd-Quellen:** GitHub `richardbogad/INFINITRA` README blob `d2247cf2d97e2df556727601f5c9dde0db812b1c` und Lizenz blob `dc91da0de15e3237ed0edfeb3ee6436e6760ab9b`; proprietärer Engine-Kern; keine Code-Wiederverwendung.
- **Polyfork Fremd-Quellen:** offizielle Anbieter-Landing, Blog, Oktober-Lizenz, Plattformlizenz, /agents, /api, /mcp, öffentlich auffindbare einzelne Assetseiten am 02.11. browsed. Catalogue Count und Anbieter-Konditionen können sich ändern. Keine Quelle heruntergeladen, keine Login/Keys/MCP-Agenten-Verbindung.
- **PR-Status:** kein PR neu eröffnet. `kayfabizarro#447` ist bestehender benachbarter World-Composition-Recherche-Donor, `#348 R4 STOP` historische **separate** WB2-Linie, nicht aktuelles MVP.

## Was WS0 als Nächstes tatsächlich tun soll
**Nicht** den bestehenden Integrations-/Asset-Pool-R2-Werkplan verdrängen, keine neue Engine. Sobald das aktuelle WS0/WS1-Review diese Donors routet:
- INFINITRA: vorhandene kfb-place/Route-/Save-Daten auf eine kleine Reihenfolge-unabhängige Determinismusprobe + World-Change roundtrip prüfen. Keine neuen Voxels, Server oder Multiplayer-Systeme bauen.
- Polyfork: erst einen nachvollziehbaren vorhandenen Prop-/Kit-Lückenplatz wählen (max. 1–3), Originalquelle pro Objekt isoliert zeigen, GLB/.mjs/Knobs/Origin/Geometry messen, Lizenz für den **konkreten Ausgabemodus** prüfen. Nur bewiesene Kandidaten als externe Links/Metadaten in vorhandenen Librarian anbieten. GLB-/MJS-Self-hosting/Users-Export ist **nicht** automatisch lizenziert; Direkt-CDN-Abruf ist unter Bedingungen freigegeben.
- Kein Runtime-Branch beschreiben oder Source-Mesh in GitHub importieren, solange WS0 keinen passenden Teil-Slice mit Source-/License-/Quality-Gate geroutet hat.

## Nachweis, Grenzen
| Prüfungsart | Tatsächlich |
|---|---|
| KFB-GitHub Workflows/SSOT/WS0-state/Asset-brief/previous LOD reads | ausgeführt |
| INFINITRA GitHub README + LICENSE fetch | 2 Dateien gelesen; Runtime/Engine intern unzugänglich |
| Polyfork offizielle Webseiten/API-Doku/Web-Recherche | durchgeführt; dynamischer Stand, Lizenz erläutert |
| Konkrete Polyfork Asset-Originale isoliert / geometrisch untersucht | **0** |
| Polyfork GLB/MJS importiert, MCP/REST live integriert | **0** |
| Unit / Runtime / Browser / Frame / mobile Tests | **0** |
| GitHub-Doku-Dateien | **2 Research + dieser Return + additiver CHANGELOG** |
| Spiel-/KFB Asset-Librarian-/Hub-/Site-Updates | **0** |
| Neue V-Nummer / Georg-Gate | **0** |

## Unresolved
- Polyfork-Katalog und einzelne License-/Tier-Felder sind dynamisch; ältere Search-Caches können Free/Pro widersprechen. Oktober-Lizenz vor einem Einsatz direkt aus Live-Quelle pinnen, separates Platform-Distribution-Review.
- Kein Material/LOD/Assetimport, kein sichtbarer Golden, keine Pixel-/Performance-Vergleichsmessung.
- INFINITRA-Autor nennt technische Zahlen und Determinismus, die nicht unabhängig durch Engine-Quellcode/Testläufe nachprüfbar sind; das ist Research, kein Qualitätsbeleg.
- Aktueller private Game-Head kann sich nach diesem Dokument bewegen; zuerst regenerierte Source/Return- und Branch-Heads lesen.

**Exakt ein nächstes Gate:** `WS0_EXISTING_WORLD_ASSET_DONOR_TRIAGE`: WS0 ordnet beide Donors im laufenden World-/Asset-Review den **bestehenden** `kfb-place/world-save/2`-/Prop-Pool-Ownern zu und entscheidet KEEP/ADAPT/HOLD für einen kleinen tatsächlich beweisbaren Fixture. Kein neues öffentliches Stage/Site und kein Live/Merge ohne Autorität.
