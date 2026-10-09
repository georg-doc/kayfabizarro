# HANDOVER · Asset Librarian · „GitHub ist die Wahrheit, ohne Token-Chat“ · 2026-10-08

An: die Sitzung, die den KFB Asset Librarian und die Asset Registry betreut
Repo: `georg-doc/kayfabizarro` (öffentlich) · Librarian: `tools/asset_registry/librarian/` · Registry: `tools/asset_registry/` · Workflow: `.github/workflows/asset-registry.yml`
Von: Claude Code, Steuer-Sitzung Island Worldbuilder (im Auftrag von Georg)

## Georgs Ziel in einem Satz

Was auf GitHub liegt, ist in der Asset Library zu sehen: ohne dass Georg einen Chat bitten muss, etwas zu aktualisieren, und mit einem Refresh-Knopf, der den neuesten Stand holt.

Dasselbe Problem hatte der Hub, der keine aktuellen Infos zeigte. Für den Hub ist das inzwischen über GitHub gelöst. Für die Asset Library gilt jetzt dasselbe Versprechen.

## Ist-Stand (geprüft am 2026-10-08)

| Punkt | Befund |
| --- | --- |
| Registry-Build | Läuft automatisch bei jedem Push nach `main` unter `media/3D_Assets/**` und anderen Wurzeln. Letzter Lauf heute 13:39 nach Georgs Upload (`bot/asset-registry-update` @ `721efa84`). |
| Librarian „live“-Modus | Voreinstellung. Liest `raw.githubusercontent.com/…/bot/asset-registry-update/registry/assets/v1`. **Grundsätzlich aktuell.** |
| Librarian „canonical“-Modus | Liest `main`. Dort ist die Registry **seit 2026-09-19 nicht aktualisiert**: Der Bot darf keinen PR öffnen (Repo-Policy), und Bot-PRs wurden nie gemergt (#69, #70, #102 geschlossen). |
| ZIP-Pakete | Die Registry indexiert `.glb .gltf .fbx .obj .blend …`, **keine ZIPs**. Ein hochgeladenes ZIP ist bis zum Auspacken unsichtbar. Aktueller Fall: `media/3D_Assets/Ultimate Nature Pack by Quaternius(1).zip` (CC0, 150 Modelle). |
| Auspacken | Passiert heute nur von Hand oder per Chat. Das kostet Token, und es vergisst sich. |
| Öffentliche APIs ohne Token | `git/trees/main?recursive=1`: 27.170 Einträge, nicht abgeschnitten, 9,4 MB. `raw.githubusercontent.com` liefert CORS `*`. Rate-Limit ohne Token: 60 Anfragen pro Stunde und IP, das reicht mit Cache. |

## Auftrag

### 1 · ZIPs automatisch auspacken (Server, ohne Chat)

Ein Workflow `asset-unpack.yml` erkennt auf `main` jede ZIP unter `media/**`, neben der noch kein gleichnamiger Ordner liegt, und arbeitet sie so ab:
- Er packt sie **auf derselben Ebene** aus, Ordnername = ZIP-Name.
- Er schreibt das Inventar `<PACK>_UNPACK_<Datum>.json` im bestehenden Schema `kfb.asset-pack-unpack/1`, wie bei Tiny Treats und KayKit.
- Er schreibt nicht direkt nach `main`, sondern auf den Bot-Branch, damit der Registry-Build ihn gleich mitnimmt, oder als eigener PR.
- **Sicherheit:** nur Pfade unter `media/`, kein `..`, keine absoluten Pfade, nie überschreiben, `__MACOSX` und `.DS_Store` überspringen.
- Eine fertige Vorlage, die auf einem `asset-unpack/**`-Branch mit Auftragsdatei arbeitet, liegt bei Georg: `KFB Island Worldbuilder Lab/deliveries/github-asset-unpack/asset-unpack.yml`. Sie lässt sich auf „neue ZIP erkannt“ umbauen.
- Hinweis: Die Claude-Code-GitHub-Verbindung durfte keine Workflow-Datei anlegen (403). Das muss eine Sitzung mit Workflow-Rechten tun, oder Georg lädt die Datei im Web hoch.

### 2 · Bot-Ergebnis ohne Handarbeit nach `main`

Variante wählen und dokumentieren:
- **a) Mit PR:** Repo-Einstellung „Allow GitHub Actions to create and approve pull requests“ an (Settings → Actions → General). Bot-PRs mit Auto-Merge, wenn Tests und `validate.py` grün sind.
- **b) Ohne PR:** Den Live-Branch offiziell zur Lese-Wahrheit erklären; dann ist `canonical` nur noch ein eingefrorener Abnahmestand.

Ziel: Es gibt keinen Zustand mehr, in dem `main` wochenlang hinterherhinkt, ohne dass es jemand sieht.

### 3 · Refresh-Knopf und Frische-Anzeige im Librarian (Browser, ohne Token)

- **Refresh:** lädt `manifest.json` neu, mit Cache-Bust `?t=…`. Achtung: raw-CDN cacht etwa 5 Minuten. Dazu kommt ein Commit-Pin-Pfad über die Commit-SHA, der jeden Cache umgeht.
- **Frische-Zeile**, immer sichtbar:
  - „Registry gebaut aus Commit X (Datum) · Repo-Stand jetzt: Commit Y (Datum)“;
  - Quelle: `api.github.com/repos/georg-doc/kayfabizarro/commits/main`, ohne Token;
  - bei X ≠ Y: „Neuer Stand wird gebaut“ oder „Registry veraltet“;
  - optional der Workflow-Status über `/actions/workflows/asset-registry.yml/runs?branch=main&per_page=1` (öffentlich, ohne Token).
- **Neu seit dem letzten Build:** Dateien, die im Live-Baum (`git/trees`, nur `media/`-Teilbaum, zwischengespeichert nach Commit-SHA) liegen, aber noch nicht in der Registry stehen, erscheinen als eigene Liste „Neu, Details folgen“. ZIPs ohne ausgepackten Ordner bekommen das Kennzeichen „ZIP, noch nicht ausgepackt“.
- **Optional:** den Inhalt einer ZIP direkt im Browser ansehen (JSZip über `raw.githubusercontent.com`, CORS ok), ohne sie auszupacken.

### 4 · Gleiches Muster für Hub und Production-Seiten

Erzeugte Status-Dateien werden per Action bei jedem Push gebaut. Die Seiten lesen live von GitHub, mit Frische-Zeile und Refresh. Chats sind nur noch für Entscheidungen nötig, nie zum „Aktualisieren“.

## Abnahme (Georg prüft, PASS/FAIL)

1. Georg lädt eine ZIP per „Add files via upload“ nach `media/3D_Assets/`. Innerhalb weniger Minuten erscheinen ohne Chat:
   - der ausgepackte Ordner auf derselben Ebene;
   - die Inventar-Datei;
   - die Modelle im Librarian (live).
2. Der Refresh-Knopf zeigt den neuen Stand. Die Frische-Zeile nennt die Commit-SHA und das Datum von Repo und Registry.
3. `canonical` hinkt nicht mehr unbemerkt hinterher: entweder Auto-Merge (2a) oder klar als Abnahmestand gekennzeichnet (2b).
4. Erster echter Fall: Das Quaternius-Paket ist ausgepackt und im Librarian sichtbar, mit seinen Varianten (`_Autumn`, `_Snow`, `_Dead`) und CC0.

## Nicht machen

- Keine generierten Registry-Dateien direkt nach `main` pushen, wenn Variante 2a gewählt ist (bestehende Regel des Workflows).
- Keine Token im Browser, keine privaten Schlüssel in Seiten.
- Bestehende Registry-Schemas, Rig-Facts und Consumer-Handoffs nicht umbauen, nur ergänzen.
- Den Asset-Bestand nicht anfassen, außer dem Auspacken. Keine Konvertierung oder Umbenennung von Quelldateien.
