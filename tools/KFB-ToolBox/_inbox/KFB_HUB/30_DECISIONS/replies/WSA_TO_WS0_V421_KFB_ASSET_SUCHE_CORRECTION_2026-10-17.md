# WSA → WS0 · Georg-Korrektur V-421 · **KFB Asset Suche** (verbindlicher Begriff) · 17.10.2026

**STATUS: GEORG INSTRUCTION · STOP KITBASH LANDMARK SUBSTITUTION · SEARCH-FIRST CORRECTION.** Nur Recherche und Vorschläge. Georg entscheidet; nichts bauen, konvertieren, integrieren, veröffentlichen oder mergen. Dieses Dokument ist ein additiver Korrektur-Return für [Draft-PR #418](https://github.com/georg-doc/kayfabizarro/pull/418), kein neuer Runtime-/Asset-Owner.

## Wortlaut und Entscheidungswirkung

Georg beanstandet ausdrücklich die Strategie, Neuschwanstein oder andere **erkennbare Wahrzeichen aus allgemeinen Kenney-/sonstigen Baukastenbausteinen nachzubauen** oder durch schlechte, eckige „Rundungen“ pseudo-cartoonhaft zu machen. Solche Vorhaben sind als **Landmark-Rekonstruktion / Auswahlersatz = FAIL** zu behandeln, solange Georg den konkreten Nachbau nicht selbst separat freigibt. Fehlende Modelltreffer sind **NO SUITABLE SOURCE YET**, kein impliziter Bauauftrag.

Der von Georg verlangte Name für Recherche und Handoff lautet exakt: **„KFB Asset Suche“**. Nicht „Kenney-Kitbash“, nicht „Baukasten-Landmark-Generator“ oder eine weitere separate App.

### Verbindliche Reihenfolge

1. **KFB Asset Suche**: den **bestehenden Asset Librarian** (seine Registry / Suche; kein zweiter Index) auf das konkrete Wahrzeichen prüfen und die externe kostenlose Multi-Source-**3D Asset Suche** über den bereits beschlossenen MCP `3d-assets` (`search_assets` → `get_asset`, ggf. `selection.bundleUrl`) verwenden. Die bestehende `~/Dropbox/CLAUDE/.mcp.json` weist auf `https://3d.shep.bot/mcp` (V-404 / `TOOL_MAP_R1.md`). Ohne MCP: dokumentierter REST-Zugang `https://3d.shep.bot` durch einen hierfür ausgerüsteten Executor. Die Asset Library ist die kanonische Aufnahme und spätere Georg-Auswahl, nicht ein weiteres Tool. Tatsächliche Verfügbarkeit und Treffer müssen nachgewiesen werden; in diesem **Web-Chat ist der externe MCP nicht direkt aufrufbar**. Weder ein GitHub-Registry-Fund noch eine externe Asset-URL allein beweisen Modellqualität oder Lizenz.
2. **EXAKTES Landmark statt bloßer Kategorie**: z. B. *Neuschwanstein als Schlosssilhouette*, nicht „irgendein Castle“. Für Globe tatsächlich Globe, nicht bloß Shoreditch Theatre; für Zikkurat von Ur Ur-Bezug verifizieren; für Borobudur Mandala-/Stupa-Anlage, nicht irgendeinen Tempelbogen; für Bremen die Vier-Tiere-Skulptur, nicht vier generische Pets. Historische/ästhetische Genauigkeit vor der Präsentation anhand isolierter tatsächlicher Quelldatei prüfen.
3. **Fakten je konkretem Treffer**: Original-URL/Urheber, exakte CC0-/CC-BY-Lizenz mit Attribution/Modifikationsnotiz, Downloadbarkeit, Format, echte Mesh-Polygone/Dreiecke, Quell-/Dateihash, Modellidentität und **Originalmodell allein**. Keine Kauf-/Privatmodelle ins öffentliche Repo; keine Lizenzinferenz aus einer Sammlungsseite. `Knete folgt` ist eine UI-Beschriftung **außerhalb des Motivs**, V-383.
4. **Georg wählt in der vorhandenen Asset Library** `Landmark-Kandidaten` aus echten Original-Landmark-Treffern. Erst nach seiner Wahl folgt WSB: echte KFB-K1-Knete, abgerundete, organische Formdetails, **vorhandene** sechs Zonen-/Biom-/Deckfarben und die freigegebene Knet-SSOT; danach gegebenenfalls WS1-Einbau in einem anderen Slice. Keine von Claude frei erfundene Geometry-/Chamfer-„Cartoonification“ als Quelle oder Ersatz für einen Modellfund.
5. **Kein Treffer?** Für dieses Wahrzeichen sauber `NO_SUITABLE_FREE_LANDMARK_MODEL_FOUND` schreiben, Herkunft/Recherchewege nennen und WS0/Georg entscheiden lassen. **Keine** automatische Blender-/Meshy-/Kenney-Ersatzgenerierung und kein stilles Einführen schlechter Kanten/anderer Landmark-Identität.

## Bestehende PR-#418-Evidence: wichtig, aber KEINE Landmark-Vorlage

R1.5 umfasst 10 Orte und 26 recherchierte **Leads und Donors** (je 2–3 Einträge), darunter fünf tatsächlich geprüfte **CC0-Quellobjekte**. Das sagt ausdrücklich **NICHT**, dass 26 geeignete Landmark-Modelle vorliegen. Die von WSA zuvor aufgenommenen allgemeinen Ersatzbausteine dürfen für die Landmark-Shortlist **nicht** zählen. Sie bleiben zur Audit-Nachvollziehbarkeit im Research-Ledger, mit `NOT_LANDMARK_SHORTLIST_ELIGIBLE`, nicht als WSB-Landmark-Auftrag oder um ein 2–3-Quote zu erfüllen:

| Betroffene Record-IDs | Quelle | Korrektur |
|---|---|---|
| `neu-kit`, `gl-kenney` | Kenney Castle Kit / square tower | kein Neuschwanstein, kein Globe |
| `neu-simple` | TitaniumFalcon Simple Castle | keine Neuschwanstein-Quelle |
| `br-pets`, `br-proto` | Kenney Cube Pets / Prototype Kit | keine Bremer-Stadtmusikanten-Skulptur |
| `ur-kit`, `ur-temple-kit` | Prototype Kit / Modular Temple arch | kein Ur-Zikkurat |
| `bo-temple-kit` | Modular Temple arch | kein Borobudur |
| `gl-shoreditch` | Shoreditch Theatre | nicht Shakespeare's Globe |

Andere Kultur-/Detailspender bleiben ebenfalls **nur Referenz**, bis die konkrete Wahrzeichen-Identität bewiesen ist. Der bestehende KFB-Pilot Stonehenge ist eine echte ortsspezifische Ausnahme (bereits gebauter Eigentümerdonor); **bestehende echte Landmark-Modelle weiterhin reuse-first**, keine pauschale Kenney-Sperre für Props, andere Minigames, Truhen, Lampen etc. Keine Löschung von Evidence und keine rückwirkende Behauptung, ältere Donors seien lizenziert/qualifiziert für vollständige Monumente.

**Vorliegende echte Monument-Quellnachweise:** isoliertes OpenGameArt Stonehenge und Chichén Itzá El Castillo (aber dessen Ball-Court fehlt). Der Kenney-Turm, Simple Castle und einzelne Modular-Temple-Arch stehen nur als dokumentierte negative Landmark-Ersatzbeispiele, **nicht als berechtigte Source-Choice-Kandidaten**.

## Zuständigkeit und Review

- **KFB Asset Suche**: aktueller KFB Asset Librarian / Registry `tools/asset_registry/` für vorhandene KFB-Quellen; externe gemeinsame 3D-Multisuche MCP aus V-404 für externe Quellen. **WS0 muss diese beschlossene Suchnaht einem Executor mit echter `search_assets`-/`get_asset`-Anbindung zuweisen**, wenn sie in WSA Web Chat nicht verbunden ist. Die eigene Assistenten-Internetrecherche ersetzt nicht den vereinbarten Tool-Nachweis.
- **Bildvorschau**: **unverändertes tatsächliches Original** in Isolation; „Knete folgt“ außerhalb des Bildes, **keine** weiße Pseudo-Knete (WS0 Source-Only-Korrektur auf PR #418), V-383.
- **Georg**: wählt originalen Landmark-Treffer, kein technisches Modell-Bastel-Gate.
- **WSB**: erst danach echter Clay-Look/Retopo/Bake; **WS1** erst nach separatem Placement-Auftrag.
- **Aktuelle GitHub-Artefakte**: `replies/WSA_LANDMARKS_R1_CANDIDATES.json`, `replies/WSA_LANDMARKS_R1_RETURN.md`, source-only Beweisbilder und MANIFEST auf PR #418. Register / additive Changelog bleiben KFB-Quelle; WS0 kann die Georg-Regel im zentralen Entscheidungsregister mit eigener Nummer eintragen. WSA erfindet keine V-Nummer.

## Konkrete nächste Aktion

**EIN NEXT GATE: `WS0_V421_KFB_ASSET_SUCHE_EXACT_LANDMARK_SEARCH`** — WS0 bestätigt KFB Asset Suche als verbindlichen Suchweg, weist den MCP-fähigen Executor zu, lässt zuerst echte ortsspezifische Modelltreffer (besonders Neuschwanstein, Bremen, Ur, Globe, Borobudur) aus der gemeinsamen Suche vorlegen und markiert generische Ersatzbausteine in der Landmark-Auswahl dauerhaft als nicht geeignet. Nur diese echten Treffer gehen zur Originalquellen-/Lizenzprüfung und später in die **bestehende** Asset-Library-Auswahl.

**Ist-Zustand:** Dies ist ein dokumentierter Workflow-/Produktkriterien-Fix, **kein durchgeführter MCP-Suchlauf**, kein veröffentlichtes Auswahl-UI, kein Modellbau, keine Freigabe und kein Merge.
