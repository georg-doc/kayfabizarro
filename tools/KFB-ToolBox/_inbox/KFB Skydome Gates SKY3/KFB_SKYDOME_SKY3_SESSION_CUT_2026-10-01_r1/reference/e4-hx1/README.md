# E4 · HX1-Integration (Referenz, nicht eigenständig lauffähig)

`KFB Hex-Kosmos HX1 Sky.dc.html` + `lab-hex/hex-island.v5.js` sind die E4-Fassung aus dem Projekt »KFB Animation Lab«: Kopie von HX1 v2 mit sechs Haken für den EnvironmentHost.

Hängt am Himmel noch an **v1**: `import { createEnvironmentHost } from '../lab-sky/env-host.v1.js'` und `import * as CF from '../lab-sky/cloud-family.v1.js'` (Zeilen 36–37).

Fehlt in diesem Cut (Welt, nicht Himmel): `vendor-hex/hex-grid.js`, `vendor-j15/lab-track/core/{track-core.v012.mjs, stream-to-three.v5.mjs}`, `vendor-ra15/lib/{band-module.js, clay/clay-soften.v1.js}`, `lab-hex/cosmos-route.v1.js`, Katalog `lab-hex/hx0-catalog.v1.json`, KayKit-Hex-Modelle (RAW). Quellen siehe `github.md` des Projekts (Screen map HX0/HX1).

Umstieg auf SKY3: die zwei Importe auf `env-host.v3.js` / `cloud-family.v3.js` heben, `CF.buildFamily(THREE, lobes, { seed, ao })` (ohne `count`), `host.setSpindleEnds` und `host.setPlanets` an die HX1-Bedienung hängen, dann 0/4/12/24 in der Kamera »Kosmos« neu messen.
