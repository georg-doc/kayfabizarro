# REHOME_DEPENDENCY_CLOSURE.md

**Status:** TESTED RESULT (Kaltstart im Design-Preview) · 2026-09-13
**Einstieg:** `travel/KFB Travel Globe v13.dc.html`
**Verfahren:** Import-Graph vom Einstieg aus transitiv aufgeloest (statische `import`/`export … from`
plus dynamische `import()`), danach der Baum kalt gestartet und **die tatsaechlich geladenen
Ressourcen** aus `performance.getEntriesByType('resource')` gegen den Graphen gehalten.

## Ergebnis in einer Zeile

**87 Module, 0 fehlende Dateien, 0 Boot-Fehler, 0 HTTP ≥ 400, 97 lokale Ressourcen — alle
unterhalb von `travel/`. Keine Datei aus dem Workspace ausserhalb des Pakets wurde geladen.**

## Der Befund, der R0 gerechtfertigt hat

Der Vorgaenger-Export `export-globe-v13/` enthielt `globe-v13/` und die Doku, aber **nicht** die
sieben Module ausserhalb, nicht die beiden Themes, nicht `support.js` und nicht `asset-repo.json`.
Als reiner Quellbaum war er also **nicht geschlossen** — nur die gebuendelte STANDALONE-Datei lief,
weil der Buendler die fehlenden Dateien aus dem Workspace mit einfaltete. Genau diese Luecke
schliesst dieses Paket.

## Module ausserhalb `globe-v13/` (im Vorgaenger-Export fehlend)

| importierende Datei | angefordert | Zweck | Herkunft | Kaltstart |
|---|---|---|---|---|
| `globe-poc.js:78` | `../terrain-planets-v1/card-carrier.js` | Pet auf Karte (v17-Aufbau) | lokal kopiert (27075 B) | PASS |
| `globe-poc.js:155` | `../terrain-planets-v1/card-registry.js` | Kartenregister + Raster | lokal kopiert (21530 B) | PASS |
| `globe-poc.js:1974` (dynamisch) | `../terrain-planets-v1/kfb-pets.js` | Pet-Bibliothek, laedt die 5 remote Pet-Module | lokal kopiert (16452 B) | PASS |
| `card-contour.js:24`, `sky-cards.js:42` | `../cardbuilder/kfb-card-format.js` | EIN Blattformat (`CARD_AR`, `fitCell`) | lokal kopiert (7711 B) | PASS |
| `fahrzeug-vertrag.js:150`, `mech-station.js:25` | `../modules/kfb-mech-combat.js` | Fahrzeug-Entwuerfe, Mech | lokal kopiert (13663 B) | PASS |
| `globe-landmarks.js:34` | `../kfb-deform-instanced.js` | Verformung auf Instanz-Attributen · **geteilt** | lokal kopiert (10579 B) | PASS |
| `pet-traegheit.js:54` | `../kfb-cartoon-deform.js` | `segmentsAlongY` · **geteilt** | lokal kopiert (10661 B) | PASS |

`kfb-cartoon-deform.js` und `kfb-deform-instanced.js` liegen an der **Projektwurzel** und werden
von mehreren Linien benutzt. Die Kopien hier sind Spender-Kopien fuer den Kaltstart, **nicht** ein
zweiter kanonischer Ort. Wer sie aendert, aendert sie an der Wurzel.

## Nicht-JS-Abhaengigkeiten

| importierende Datei | angefordert | Herkunft | Kaltstart |
|---|---|---|---|
| Einstieg (`<script src>`) | `./support.js` | DC-Runtime des Design-Hosts, 69134 B mitgeliefert | PASS (geladen) |
| Einstieg | `./themes/kfb-med.css`, `./themes/kfb-shell.css` | lokal kopiert, keine `url()`/`@import` darin | PASS (beide geladen) |
| Einstieg | `./globe-v13/hud-frame.css` | lag schon in `globe-v13/` | PASS |
| Einstieg (importmap) | `three@0.160.0` + `three/addons/` | jsDelivr CDN, **feste Version** | PASS |
| Einstieg | Google Fonts (Special Elite, Irish Grover, Baloo 2) | remote | PASS |
| `globe-landmarks.js:526`, `sky-enemies.js` | `./asset-repo.json` → Rueckfall `../asset-repo.json` | lokal kopiert (335450 B) | PASS (geladen, `travel/asset-repo.json`) |
| `komposition.js` | `./globe-v13/auswahl-georg.json` | lokal | PASS (geladen) |
| `flora.js` | `./globe-v13/flora-auswahl.json` | lokal | PASS (geladen) |
| `card-registry.js:92` | `./card-grids.json` (via `LOCAL`, neben dem Modul) | lokal (6142 B) | PASS (geladen) |
| `card-registry.js:72` | RAW `media/kfb/index.json` → Rueckfall `./kfb-index.json` | remote gewinnt; lokaler Rueckfall mitgeliefert | PASS (RAW 200; Rueckfall einzeln geprueft: 200, 3263 B) |
| `travel-audio.js:107/129` | RAW `jukebox.json`/`sfx.json` → Rueckfall `./jukebox.json`, `./sfx.json` | lokal in `globe-v13/` | Rueckfall einzeln geprueft: 200 (392 B / 370 B) |
| `portal.js:150/152` | `window.__KFB_RIFT_URL` → `./globe-v13/rift.png` → `./rift.png` | lokal (123772 B), stammt aus tinyskies `client/public/2D/rift.png` | Pfad einzeln geprueft: 200, 123772 B. **Im Bootfenster nicht angefordert** — siehe UNRESOLVED |
| `card-registry.js` | `pdfjs-dist@4.7.76` (pdf.min.mjs, pdf.worker.min.mjs) | jsDelivr, **feste Version** | nicht im Bootpfad (nur bei PDF-Kartenblatt) |

## Remote-Abhaengigkeiten (bewusst extern)

| Host | Anfragen im Bootlauf | Inhalt |
|---|---|---|
| `raw.githubusercontent.com/georg-doc/kayfabizarro` | 140 | GLB-Props, Gegner, Muenze, Gear-Icon, Kartenblaetter, `kfb-pets.json`, Audio |
| `cdn.jsdelivr.net` | 10 | three 0.160.0 + addons, die 5 Pet-Module |
| `unpkg.com` | 2 | React 18.3.1 (DC-Runtime des Hosts, nicht v13) |
| `fonts.googleapis.com` | 1 | Schriften |

Die fuenf Pet-Module (`pet-library.v6`, `pet-eye-rig.v5`, `pet-motion.v2`, `pet-face.v1`,
`pet-mouth.v1`) und `pet-surface.v1` haengen an `@main`. Nach dem Start sind
`CubePet`, `PetLibrary`, `PetMotion`, `PetFace`, `PetMouth` als Globale da — der Pet-Pfad lebt.

## Mitgeliefert, aber vom Einstieg NICHT importiert

`globe-v13/asset-inventur.js` · `globe-v13/carpet-mesh.js` · `globe-v13/flora-pruefstand.js` ·
`globe-v13/zwischenablage.js`

Vier Werkzeug-/Pruefstand-Dateien. Sie bleiben im Paket (sie gehoeren zum Stand und kosten
zusammen wenig), sind aber **kein Teil der Laufzeit-Schliessung**. Nicht als tot einstufen, ohne
die Pruefstaende zu pruefen.

## UNRESOLVED

1. **`rift.png` wurde im Bootfenster (10 s) nicht angefordert.** Der Pfad stimmt und antwortet mit
   200 — aber der Beweis, dass die Portaltextur *im Spiel* haengt, braucht einen Portal-Anflug.
   Genau diese Fehlerklasse ist am 10.09. schon einmal aufgefallen (Textur fehlte im Buendel, ohne
   Logeintrag). **Nicht** als PASS fuehren, bis ein Portal im Bild war.
2. **`@main` ist beweglich.** Sechs Laufzeit-Module und alle schweren Assets zeigen auf `main` von
   `georg-doc/kayfabizarro`. Dieser Baseline fehlt damit eine feste Asset-Revision. Vorschlag fuer
   Astra: die sechs Modul-URLs auf einen Commit/Tag pinnen.
3. **Keine gepushte Quell-Revision.** `sourceRevision` in `BASELINE.json` ist offen: der v13-Stand
   lebt im Design-Workspace. Erst der Push in `georg-doc/KFB-Travel-Globe` macht ihn zitierbar.
4. **140 RAW-Anfragen je Kaltstart.** Funktioniert, ist aber ein Ratelimit-Risiko und macht den
   Start netzabhaengig. Kein R0-Thema, ein Astra-Thema (Cache/Proxy/Pages-Mirror).
