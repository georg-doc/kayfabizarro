# Für den Coworker — was am Katalog schiefliegt (Stand 2026-07-25)

Belegt, nicht behauptet: alles unten am Live-Repo `georg-doc/kayfabizarro@main` geprüft.
Reihenfolge = Wirkung. Nichts davon ist Kosmetik, jedes Item hat mich oder das Tooling Zeit gekostet.

## 1 catalog.json ist für Tooling unerreichbar

`media/3D_Assets/CATALOG/catalog.json` ist im Browser sichtbar, aber:
im Repo-Tree-Listing erscheint es nicht, und der Datei-Import verwirft es als „oversized".
Die anderen JSONs im selben Ordner (`github_status.json`, 5 KB) kommen problemlos durch.

**Fix:** die Master-JSON aufteilen und eine schlanke Laufzeit-Fassung ausgeben —
`catalog/<pack>.json` (ein File pro Pack) **plus** `catalog.min.json` mit nur den Feldern,
die eine App braucht: `name, pack, ghPath, category, subcategory, size, footprint_xz, animations`.
Hausregel im Projekt: **keine Datei über 2 MB**, Schweres per RAW-URL nachladen.
Bis das passiert, ist `INDEX.md` die faktische Quelle — ich habe daraus gebaut.

## 2 Kein `ghPath` pro Asset — der eigentliche Fehler

`github_status.json` schreibt es selbst hin: der Browser vergleicht exakte Pfade gegen den
Live-Tree, Katalog-Pfade sind aber **lokal**. Ergebnis: graue Kacheln für Assets, die live liegen.
Eine `naming_map` in einer Nebendatei repariert das nicht — die Zuordnung muss **am Asset** hängen.

**Fix:** `build_catalog.py` / `enrich_and_pack.py` schreiben pro Record:
`ghPath` (Repo-relativ), `ghUrl` (RAW) und `available: "github" | "local" | "absent"`.
Verifizierte Präfixe (von mir per Direktabruf bestätigt):

| Katalog-Pack | GitHub-Präfix |
|---|---|
| `kenney_pirate-kit` | `GLB_pirate/` |
| `kenney_hexagon-kit` | `GLB_hexagon_kit/` |
| `kenney_cube-pets_1.0` | `GLB_cube-pets/` |
| `kenney_mini-characters` | `GLB_mini_chars/` |
| `kenney_blocky-characters_20` | `GLB_blocky_chars/` |
| `kenney_graveyard-kit_5.0` | `GLB_graveyard/` |
| `kenney_nature-kit` | `kenney_nature-kit/Models/GLTF format/` |
| `kenney_survival-kit` | `kenney_survival-kit/Models/GLB format/` |
| `kenney_fantasy-town-kit_2.0` | `kenney_fantasy-town-kit_2.0/Models/GLB format/` |

## 3 Doppelte Pack-Identitäten — und eine Falle, die Assets verschluckt

Sechs Packs stehen zweimal im Katalog (einmal `kenney_*`, einmal `GLB_*`, identische Anzahl):
hexagon 72, cube-pets 24, graveyard 91, mini-chars 26, blocky-chars 18 — die „2776 Assets" sind
also überzählt. **Aber:** `kenney_pirate-kit` (72) hat **kein** `GLB_pirate`-Gegenstück im Katalog,
obwohl es im Repo genau so liegt. Wer stumpf dedupliziert, verliert die 72 Pirate-Assets.
Ich musste sie separat remappen.

**Fix:** eine kanonische Pack-Id + `aliases: []` am Pack, nicht zwei Datensätze.

## 4 `README_catalog.md` widerspricht den generierten Dateien

README: „**1.825 assets · 22 packs**", generiert 2026-07-12.
`PACK_SUMMARY.md` und `INDEX.md` desselben Tages: „**2776 assets · 42 packs**".
Wer die README liest, plant mit falschen Zahlen.

**Fix:** Zahlen aus dem Build generieren oder aus der README streichen. Eine Wahrheit, nicht zwei.

## 5 `INDEX.md` verspricht eine `path`-Spalte, liefert sie nicht

Kopfzeile: „Columns: name · size · footprint · anim · **path**" — die Spalte ist leer.
Ich parse INDEX.md, also fiel das direkt auf: Pfade müssen aus der `naming_map` rekonstruiert werden.

**Fix:** `path` (oder besser `ghPath`) wirklich ausgeben.

## 6 `github_status.json` ist handgepflegt und schon in sich widersprüchlich

`kenney_blocky-characters_20: "local"` — dieselbe Datei führt den Pack unter
`naming_map.voll_gemappt_verifiziert` als `GLB_blocky_chars/`, also live.
`assets_github: []` ist leer, obwohl es die Liste tragen soll.

**Fix:** Status **generieren**, nicht behaupten: ein Call auf die Git-Trees-API (`recursive=1`)
liefert den kompletten Baum inkl. der `.glb`; daraus `available` pro Asset setzen. Nebenbei
verschwindet damit auch der Grund für die Handpflege.

## 7 Falscher kanonischer Textur-Pfad in `voxel-terrain.js`

`const _edgeCanon = '…/media/3D_Assets/Textures/edge3.jpg'` — dort liegt die Datei **nicht**.
Kanonisch ist `media/3D_Assets/**KFB**/edge3.jpg`. Der Code fällt still auf `./edge3.jpg` zurück,
also läuft es lokal und ist im Standalone-Export tot (klassischer Pfad-Hygiene-Fall).

**Fix:** URL auf `KFB/edge3.jpg` ziehen — oder besser über `kfb-textures.json` auflösen,
dann gibt es genau eine Adressquelle.

## 8 Kleinigkeit: `GLB format/` im Repo-Top-Level

Flacher Ordner mit Mittelalter-/Hex-Terrain (`building-*`, `unit-*`, `path-*`, `river-*`),
keinem Katalog-Pack zugeordnet, laut `github_status.json` selbst als „unklar" markiert.
**Fix:** Identität vs. `GLB_hexagon_kit` klären, benennen, in den Katalog aufnehmen — oder
als bewusst-draußen markieren.

---

## Kurzfassung, die du ihm schicken kannst

> Der Katalog ist inhaltlich gut, aber als Laufzeit-Quelle noch nicht benutzbar. Vier Sachen bitte:
> **(1)** `catalog.json` splitten (pro Pack) + eine `catalog.min.json` unter 2 MB — die aktuelle
> Datei ist für Tooling zu groß und wird beim Import verworfen.
> **(2)** Pro Asset ein `ghPath` + `ghUrl` + `available` schreiben, aus der `naming_map`.
> Ohne das zeigt der Browser grau, obwohl die Datei live liegt — steht als Diagnose schon in
> `github_status.json`, ist aber nie ins Datenmodell gewandert.
> **(3)** Pack-Duplikate zu einer kanonischen Id + `aliases` zusammenführen. Vorsicht:
> `kenney_pirate-kit` liegt auf GitHub als `GLB_pirate/`, hat aber keinen `GLB_*`-Zwilling im
> Katalog — stumpfes Dedupe verliert 72 Assets.
> **(4)** `github_status.json` generieren statt handpflegen (Git-Trees-API, `recursive=1`);
> die Datei widerspricht sich aktuell selbst (blocky-chars „local" vs. naming_map „verifiziert live").
> Dazu zwei Kleinigkeiten: `README_catalog.md` nennt 1.825/22 statt 2776/42, und `INDEX.md`
> verspricht im Header eine `path`-Spalte, die leer bleibt.
> Und außerhalb des Katalogs: in `voxel-terrain.js` zeigt `_edgeCanon` auf
> `Textures/edge3.jpg` — die Datei liegt in `KFB/`. Läuft nur lokal, im Export schwarz.
