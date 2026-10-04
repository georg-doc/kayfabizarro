# Deployment

## Einstiegspunkt

Kein einzelner. 15 gleichrangige Seiten in `source/`. Für eine Route ist
`KayKit_Dungeon_Generator_S13_2.html` der sinnvolle Standard (jüngster Stand).

## Install / Start / Build

| Schritt | Befehl |
|---|---|
| Install | **keiner** — kein npm, kein Lockfile, keine `package.json` im Original |
| Start (lokal) | `cd source && python3 -m http.server 8080` |
| Build | **keiner** — es gibt keinen Build-Schritt; für diese Checkliste wurde keiner eingeführt |
| Build-Ausgabe | entfällt · `dist/` ist in diesem Paket **nicht** angelegt, weil es nichts zu erzeugen gibt |

## Base-Path

Alle projektinternen Verweise sind **relativ** (`./lib/…`, `./scenes/…`,
`KayKit_Dungeon_Model_S13.html`). Das Paket ist damit unter jedem Unterpfad lauffähig, solange die
Ordnerstruktur von `source/` erhalten bleibt. Es gibt kein `<base>`-Tag und keine absoluten
projektinternen Pfade.

**Geprüft:** alle 15 Seiten auf projektinterne absolute Pfade (`/lib`, `/scenes`, `src="/`) —
0 Treffer.

## Asset-Basis · kanonisch extern

```js
// source/lib/kit-lab.js:10
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
```

Modelle werden **absichtlich nicht** aus dem Paket geladen: die RAW-URL ist die kanonische
Assetquelle, das Asset-Repo bleibt die einzige Wahrheit. Folgen:

- Das Paket braucht zur Laufzeit Internetzugang und einen öffentlich lesbaren Zustand des Repos.
  Das ist Absicht, kein Mangel.
- Der Pfad zeigt auf `main`, **nicht** auf eine gepinnte Revision. Ein Commit im Asset-Repo ändert
  rückwirkend, was diese Seiten laden. Das **ist** ein offener Punkt — unabhängig davon, dass die
  Assets extern bleiben. Siehe `KNOWN_ISSUES.md` §1.
- `raw.githubusercontent.com` ist kein CDN mit Liefergarantie. Wenn eine Auslieferung Zusagen
  braucht, gehört ein gepinnter Mirror davor — die URL bleibt trotzdem die kanonische Referenz.

Weitere externe Bezüge:

| Seite | Bezug |
|---|---|
| alle außer S10 | `unpkg.com/three@0.184.0` (Importmap) |
| S10 | `unpkg.com/three@0.160.1` — **abweichend**, siehe `KNOWN_ISSUES.md` §3 |
| S10 | `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-card-builder.js` |
| S10 | `raw.githubusercontent.com/…/media/kfb/AI_Kayfabe_-_ADD_web.pdf.json` |
| `tools/registry-probe.html` | `…/kayfabizarro/**bot/asset-registry-update**/registry/assets/v1` — Branch, nicht `main` |

## Redirects / Headers

Keine erforderlich. Kein Client-Router, keine History-API, also kein SPA-Fallback. Statisches
Ausliefern genügt. `.gltf`/`.glb` werden nicht aus dem Paket geliefert, also braucht es dafür
auch keine MIME-Regel.

## Offline

**Nicht offline lauffähig — beabsichtigt.** Assets laufen über die kanonische RAW-URL, nie über
`./assets/…`. Ein relativer Assetpfad wäre hier der Fehler: er funktioniert in der Vorschau und
bricht im ausgelieferten Stand.

Sollte Offline-Betrieb je verlangt werden, ist das eine **eigene Entscheidung mit Konsequenzen**
(Paket veraltet gegen das Asset-Repo, Größenbudget, zweite Wahrheit) und kein Nachziehen dieses
Exports. Welche Dateien betroffen wären, steht in `ASSET_MANIFEST.json`.

## Cloudflare Pages

Das Repo-Integrationsziel aus dem Exportauftrag ist `tools/world_atlas/_inbox/KFB_World_Atlas_v1/2026-09-17-r1/`
als **unveränderter Intake**. Bestehendes `tools/resident_atlas/` und `tools/KFB-ToolBox/` bleiben
unberührt; dieses Paket legt nichts davon an.

Größenbudget: laut am 2026-09-17 gelesener Cloudflare-Dokumentation max. 25 MiB je Site-Asset.
Die größte Datei in diesem Paket ist `CHANGELOG.md` mit 81 KB. Das Budget ist unkritisch, weil die
Modelle extern bleiben — ein weiterer Grund, sie extern zu lassen.

Trennung Quellarchiv/Web-Deploy: `source/tools/` (11 Messsonden) und `evidence/` gehören ins
Archiv, nicht zwingend in einen öffentlichen Build.

## Tokens

Kein Laufzeitcode verlangt ein GitHub-Token. Alle Bezüge sind öffentlich lesbar.
