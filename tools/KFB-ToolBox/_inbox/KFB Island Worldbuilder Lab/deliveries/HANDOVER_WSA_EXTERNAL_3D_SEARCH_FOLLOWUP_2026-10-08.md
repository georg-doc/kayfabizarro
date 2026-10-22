# FOLGEAUFTRAG · WSA-Work · Externe 3D-Suche in die Asset Library · 2026-10-08

An: WSA-Work, im Anschluss an `HANDOVER_ASSET_LIBRARIAN_LIVE_REPO_2026-10-08.md` (ZIPs automatisch auspacken, Refresh, Frische-Anzeige)
Von: Claude Code, Steuer-Sitzung Island Worldbuilder (im Auftrag von Georg)

## Worum es geht

Georg möchte, dass One-Shots und MVP-Arbeiten schnell passende Modelle finden: zuerst im eigenen Bestand, dann über eine externe Suche über 20 Quellen. Ein Fund soll ohne Umwege in die Asset Library übernommen werden können.

**Den Arbeitsauftrag gibt es schon:** `WORK_WSA_IMPLEMENTATION_BRIEF.md` (Links unten), Stand „READY TO RUN“, noch nicht gestartet. Bitte diesen Auftrag ausführen und dabei die Ergänzungen unten berücksichtigen.

## Reihenfolge

1. Zuerst das Live-Repo-Handover: ZIPs automatisch auspacken, Bot-Ergebnis automatisch übernehmen, Refresh-Knopf.
2. Dann diesen Auftrag. Sein Schritt „Import → Registry → Library findet es“ (Phase C) läuft danach ohne Handarbeit.

## Links, kommentiert

**Vorhandene Planung im Repo**

| Link | Was | Wofür |
| --- | --- | --- |
| [WORK_WSA_IMPLEMENTATION_BRIEF.md](https://github.com/georg-doc/kayfabizarro/blob/planning/asset-librarian-external-3d-search-r1-2026-10-07/tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/WORK_WSA_IMPLEMENTATION_BRIEF.md) | **der eigentliche Arbeitsauftrag**: Phasen 0, A–D, Rollen, Abnahme-Matrix mit 21 Punkten | ausführen |
| [START_HERE.md](https://github.com/georg-doc/kayfabizarro/blob/planning/asset-librarian-external-3d-search-r1-2026-10-07/tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/START_HERE.md) | Einstieg, Audit des Donors | zuerst lesen |
| [TEST_REPORT.md](https://github.com/georg-doc/kayfabizarro/blob/planning/asset-librarian-external-3d-search-r1-2026-10-07/tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/TEST_REPORT.md) | was beim Audit getestet wurde | Ausgangsstand |
| [SHORT_HANDOVER_WSA_MVP_PLANNING.md](https://github.com/georg-doc/kayfabizarro/blob/planning/asset-librarian-external-3d-search-r1-2026-10-07/tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/SHORT_HANDOVER_WSA_MVP_PLANNING.md) | **Planungsregel für One-Shots**: Lücke prüfen → eigener Bestand → externe Suche → isoliert prüfen → behalten, anpassen oder verwerfen | in jede One-Shot-Planung übernehmen |
| [ULTRATEX_TEXTURE_ADAPTATION_DONOR_NOTE.md](https://github.com/georg-doc/kayfabizarro/blob/planning/asset-librarian-external-3d-search-r1-2026-10-07/tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/ULTRATEX_TEXTURE_ADAPTATION_DONOR_NOTE.md) | KI-Texturen (UltraTex) | **nicht Teil dieses Auftrags**: braucht NVIDIA-GPU, nur als spätere Notiz |
| [Asset Library (Code)](https://github.com/georg-doc/kayfabizarro/tree/main/tools/asset_registry/librarian) | bestehende Seite, liest die Registry live vom Bot-Branch (`state.js` → `LIVE_REGISTRY_BASE`) | die vorhandene Seite erweitern, keine zweite |

**Externer Dienst**

| Link | Was | Wofür |
| --- | --- | --- |
| [arielshad/3d-asset-server](https://github.com/arielshad/3d-asset-server) | Open-Source-Suchserver (Apache-2.0) über 20 Quellen, auditiert @ `c5c408d1` | Quelle der Adapter; nicht nachbauen |
| [3d.shep.bot](https://3d.shep.bot/) | gehostete Version, Web-Oberfläche | zum Ausprobieren für Georg |
| [/v1/search](https://3d.shep.bot/v1/search?q=pine+tree&type=model&free=true) | REST-Suche | Library-Suche direkt aus dem Browser |
| [/v1/providers](https://3d.shep.bot/v1/providers) | Liste der Quellen mit Status | Quellen-Anzeige |
| [/openapi.json](https://3d.shep.bot/openapi.json) | API-Beschreibung | **GPT-Action** für den Asset-Librarian-GPT ohne eigenen Server |
| [/docs](https://3d.shep.bot/docs) · [/llms.txt](https://3d.shep.bot/llms.txt) · [/AGENTS.md](https://3d.shep.bot/AGENTS.md) | Doku für Menschen und Agenten | Nachschlagen |
| `https://3d.shep.bot/mcp` | MCP-Endpunkt (Streamable HTTP) | **Claude-Code-Sitzungen**: `claude mcp add --transport http 3d-assets https://3d.shep.bot/mcp`. Bei Georg ist er schon eingetragen. |

## Heute geprüft (2026-10-08)

- Die REST-Suche antwortet **ohne Token**, mit `access-control-allow-origin: *`. Die Library kann also direkt aus dem Browser suchen, ohne eigenen Proxy.
- Treffer enthalten Quelle, Titel, Lizenz als Objekt (Name, URL, kommerziell ja/nein, Namensnennung ja/nein), „direkt ladbar“ ja/nein, Formate und Quellseite.
  - Beispiel „pine tree“: Poly Haven `Pine Tree 01` (CC0, glTF), 3DAssets.dev `Stylized Pine Tree Tall` (CC0, GLB), Polyfork `Tall Pine Tree` (Royalty Free, GLB).
- Der Endpunkt hat ein Rate-Limit; die Header `RateLimit-*` werden geliefert. Zwischenspeichern und sparsam abfragen.
- **Achtung, alte Pfade:** `/api/...` gibt 404. Die aktuellen Pfade beginnen mit `/v1/...`. Der Brief vom 7.10. nennt den Vertrag nur allgemein, also Phase 0 gegen `/openapi.json` prüfen.

## Ergänzungen zum bestehenden Brief

1. **Externe Suche im Browser:** Die Library ruft `/v1/search` direkt auf, weil CORS offen ist. Server und Proxy sind nur nötig, wenn Vorschaubilder nicht eingebettet werden dürfen. Dann gilt die Regel aus dem Brief: Link zeigen statt spiegeln.
2. **Übernahme über denselben Weg wie Georgs Uploads:** Ein ausgewählter, direkt ladbarer CC0-Fund wird in einer vertrauenswürdigen Umgebung geladen (Hash, Bytes, Quelle, Lizenz) und als Paket unter `media/3D_Assets/<Quelle>_<Titel>/` abgelegt, plus `kfb.external-asset-intake/1`. Danach übernehmen automatisches Auspacken (bei ZIP) und Registry-Build. Keine Sonderwege und kein Nebenverzeichnis.
3. **Maßstab (neu, Kontrakt K2):** Externe Modelle bekommen bei der Übernahme eine gemessene Größenangabe in H (Medium-Figur) und MacroCell, keine Meter. Quelle: `KFB Island Worldbuilder Lab/docs/SCALE_CONTRACT_K2.md` (Georg kann die Datei mitgeben). Im Intake genügen zwei Felder: `measuredHeight` (Einheit der Quelle) und `scaleHint` („Faustwert ≈ x H“). Die Prüfung macht der jeweilige Konsument.
4. **Für One-Shots ohne Library:** Agenten dürfen den Dienst direkt nutzen, Claude Code über MCP und der GPT über die OpenAPI-Action. Dabei gelten dieselben Regeln (Planungsregel oben): isoliert prüfen, Lizenz ist eine Angabe der Quelle, erst die Übernahme macht ein KFB-Asset daraus.
5. **Erster echter Fall aus dem eigenen Bestand:** Das Quaternius Ultimate Nature Pack (CC0, liegt als ZIP in `media/3D_Assets/`) sollte nach dem Live-Repo-Handover in der Library auftauchen. Ein externer Testfall für Phase C: ein CC0-Nadelbaum von Poly Haven oder 3DAssets.dev, weil der gerade für die Inseln gebraucht wird.

## Abnahme für Georg (zusätzlich zur Matrix im Brief)

- In der Library gibt es neben „Assets“ einen Reiter „Externe Suche“. „Kiefer“ oder „pine“ liefert Treffer aus mehreren Quellen, mit Lizenz und „direkt ladbar“ ja/nein.
- Ein Klick auf „Übernehmen“ bei einem CC0-Fund bringt ihn nach wenigen Minuten als normales Asset in die Library, ohne Chat.
- Fällt der externe Dienst aus, funktioniert die normale Library unverändert weiter.

## Nicht machen

- Keine zweite Seite und kein zweites Verzeichnis neben der Registry.
- Keine Token im Browser.
- Externe Lizenzangaben nicht als geprüft darstellen.
- UltraTex nicht einbauen.
- Keine Merges nach `main` ohne Georg, kein Live.
