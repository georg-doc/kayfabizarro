# DEPLOYMENT · KFB Resident Atlas S6

| Feld | Wert |
|---|---|
| Einstiegspunkt | `KFB_Resident_Atlas_S6.html` |
| Install-Befehl | keiner |
| Build-Befehl | keiner (statische ES-Module, Import-Map) |
| Build-Ausgabe | keine; `source/` **ist** `dist/` |
| Start lokal | `python3 -m http.server 8080` und `http://localhost:8080/KFB_Resident_Atlas_S6.html` |
| Base-Path | relativ. Die Seite lädt `./lib/*.js` und `./data/cast.js` relativ zu sich; sie funktioniert unter jedem Unterpfad. |
| Asset-Basis | absolute Raw-URLs (`raw.githubusercontent.com`), **nicht** der Site-Pfad. Unterpfad-Deployment betrifft die Assets nicht. |
| Redirects/Headers | keine erforderlich. Kein Router, keine History-API. |

## Echte externe Abhängigkeiten

| Host | Was | Fallback |
|---|---|---|
| `unpkg.com` | three.js 0.184.0 + drei Addons (OrbitControls, TransformControls, GLTFLoader, SkeletonUtils) über Import-Map | keiner gebaut. Für ein netzunabhängiges Deployment müssten die fünf Dateien nach `vendor/` kopiert und die Import-Map umgehängt werden. Das ist eine kleine, aber echte Aufgabe und nicht erledigt. |
| `raw.githubusercontent.com` | 119 Modellpfade + 2 Texturen am gepinnten Commit | **Kein Fallback, und keiner vorgesehen: alle Assets via GitHub ist die Entscheidung.** Ohne Netz bleibt die Bühne leer, und der Status meldet die Fehlpfade statt Platzhalter zu zeigen. |

## Integration ins Repo (Vorgabe aus dem Exportauftrag)

S6 zuerst als **unveränderter Intake** ablegen:

```text
tools/resident_atlas/_inbox/KFB_Resident_Atlas_S6/2026-09-17-r1/
```

Den bestehenden Bestand unter `tools/resident_atlas/` mit Route `/resident-atlas/` **nicht** überschreiben. Erst nach Paritätsprüfung gezielt übernehmen.

## Cloudflare-Pages-Budget

Für dieses Paket unkritisch, und zwar strukturell: es referenziert die Modelle statt sie zu deployen. Die größte Nutzdatei ist `data/cast.js`. Das 25-MiB-Limit je Site-Asset (Doku-Stand 2026-09-17) wird von diesem Export nicht berührt — es betrifft die Frage, ob KayKit-Originalpacks in den Site-Build gehören, und die ist hier nicht entschieden.

## Nicht durchgeführt

`GITHUB PUSH: NOT PERFORMED` · `PUBLIC DEPLOYMENT: NOT PERFORMED`. Deep-Link, Reload und Asset-Laden unter einem echten Unterpfad sind **nicht** getestet — siehe `TEST_REPORT.md`.