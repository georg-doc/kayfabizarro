# Mapping auf KFB Assembly Contract A0

**Gelesene Contract-Fassung:** `georg-doc/kayfabizarro@main`
`skills/chat/masterplan/KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md`, gelesen 2026-09-17T20:34Z.

Der Contract verlangt ausdrücklich: keine erfundenen Pflichtfelder, keine fiktiven AssetRefs für
generierte Geometrie, keine `stunt`/`landing`-Rollen ohne realen Anwendungsfall. Dieses Mapping
hält sich daran und benennt Lücken als Lücken.

## Vorbemerkung: dieses Projekt erzeugt heute keine A0-Rezepte

Es gibt **keinen** `RecipeEnvelope` im Code. Was existiert, ist der Recipe-JSON-Export von S13.2 —
ein projekteigenes Format, kein A0-Envelope. Das Mapping unten ist daher zweierlei:
belegte Entsprechung (was A0-Semantik bereits trägt) und benannte Lücke (was fehlt).

## 2.1 AssetRef

| A0-Feld | Belegt durch | Wert / Befund |
|---|---|---|
| `id` | Bauteilname | z. B. `wall_doorway`, `hex_coast_B`, `barrier` — eindeutig je Pack |
| `sourceRepo` | `lib/kit-lab.js:10` | `georg-doc/kayfabizarro` |
| `sourcePath` | `PACKS[pack].base + name + ext` | vollständig auflösbar, 23 Basispfade |
| `revision` / Blob-Identität | — | **`null`.** Die RAW-URL zeigt auf `main`. Keine gepinnte Revision, keine Blob-SHA. Siehe `KNOWN_ISSUES.md` §1 |
| `relationship` | Vokabular aus A0 §2.1 | `same_collection` (alle Teile eines Packs) · `reference_demo` (die Promobilder in `media/3D_Assets/*/contents*.png`, die als Lichtvorlage dienten) |
| `evidenceStatus` | Ladeversuch + Messung | belegbar je Name: bestätigt/nicht existent. Dungeon 46/86 Kandidaten, Racing 33/112, Hex 87, Forest 105, Tools 49, City 41 |

**Lücke:** ohne `revision` ist `AssetRef` nach A0-Maßstab unvollständig. Relationship ist nicht
Kompatibilität — das gilt hier uneingeschränkt: ein geladenes Teil beweist nur, dass die Datei
existiert.

## 2.2 TransformSlot

Benannte Nähte existieren **als Regel, nicht als Datensatz**. Das ist der wesentliche Unterschied zu
A0, das Slots als Liste mit `id`/`parentRef`/`position` erwartet.

| Naht | Wo | Belegte Werte |
|---|---|---|
| Dungeon-Fuge (Kante zwischen zwei Zellen) | `dungeon-grid.js` | kanonischer Schlüssel `min(a,b)|max(a,b)`, `run`, `mid`, `level` — pro Fuge im Recipe-JSON **exportiert** |
| Wandmontage der Fackel | `dungeon-grid.js` / `dungeon-light.js` | Montageachse von `torch_mounted` ist die einseitige (0,55 gegen 0,62); Abstand = gemessene Außenfläche der jeweiligen Wand |
| Kerzenecke | `dungeon-grid.js` | Zellecke an zwei Wänden, Standoff je Achse aus der gemessenen Außenfläche (gegen Nennmaß steckte die Kerze bei `wall_pillar` 0,12 in der Wand) |
| Flammenpunkt | `dungeon-light.js` | Schwerpunkt der Flammendreiecke am UV-Schwerpunkt; Fuß aus den **indizierten** Dreiecken (`computeBoundingBox()` ignoriert den Index) |
| Hex-Kachelkante 0–5 | `hex-grid.js` | `TILE_EDGES`, Klassen g/s/w, Drehsinn +60° je `rotDeg(1)` |
| Straßenanschluss | `road-solver.js` | gemessenes Höhenprofil je Kachelkante: Asphalt 0,07, Bordstein 0,10 |
| Bordsteinplatz | `kit-lab.js` `kerbSlots()` | aus der Anschlusstabelle abgeleitet: geschlossene Seite = Bordstein, offene = Fahrbahn; 34 von 72 belegt |
| Kettenglied mit Höhe | `track-chain.js` | `y` wird durch die Kette getragen |

`forward`/`up`-Konvention: projektweit three.js-Standard (Y oben, rechtshändig), Deckflächen auf
`y = 0`. Für Hex explizit gemessen: pointy-top, 2,0 × 2,309, Zeilenschritt ¾ Höhe.

**Lücke:** kein Slot trägt eine A0-`id`. Slots sind implizit aus dem Gitter gerechnet. Für Pilot A
(`Lorekeeper + lectern + staff`) liefert dieses Projekt **nichts** — es gibt hier keine Figur,
keine Hand- oder Prop-Slots.

## 2.3 Surface

| A0-Feld | Befund |
|---|---|
| `id` / `geometryRef` | Bodenzelle im Dungeon (`floor_*_large`, Modul gemessen), Hex-Deckfläche `y = 0`, Fahrbahnfläche je Straßenkachel |
| `roles[]` | `support` — belegt: `auditGround`/`snapToSurface` raycasten jede Requisite auf die Fläche darunter und verifizieren Kontakt (S2 31/31, S4 25/25, S5 39/39, 0 unverified) |
| | `walkable` — **nur geometrisch**, nicht als Laufoberfläche. Die Strahlprobe belegt, dass ein Strahl in Türhöhe durch eine Tür kommt und durch eine Wand nicht (7/7 bzw. 53/53). Das ist Durchlässigkeit, keine Locomotion |
| | `drivable`/`road` — belegt für die Racing-/Straßenketten über `measureSurface` (liest die `road`-Vertices je Kachelkante) und `auditLanes` (prüft Spurpunkte, nicht Boxen; die Boxprüfung meldete falsches Grün) |
| `priority` | **nicht vorhanden.** Wird nicht erfunden — A0 führt `priority` als Travel-Adapter-Tiebreaker, nicht als Atlas-Datum |
| `normalPolicy` | **nicht vorhanden** als Feld. Faktisch: Deckflächen sind achsparallel nach +Y |
| `materialHint` | vorhanden als Messwert, nicht als Feld: Pack liefert `roughness 0.45`, korrigiert auf 0,95 / `metalness 0`; Bodenfarbe aus der gemessenen Verge-Farbe der Kacheln |
| `connectorRefs[]` | im Dungeon implizit: jede Bodenzelle kennt ihre vier Fugen |

**Nicht vergeben:** `landing`, `stunt`, `deck`, `bridge`. `bridge` wäre für S3b (Rampe über
Boxengasse) verlockend, aber A0 §5 untersagt genau diese Bestückung ohne realen akzeptierten
Anwendungsfall. `auditClearance` belegt Freiraum, nicht eine Brückenrolle.

## 2.4 Connector

Der belegteste Teil dieses Projekts.

| Connector | `kind` | Gemessene Geometrie | `capabilityTags[]` |
|---|---|---|---|
| Dungeon-Tür | portal | Öffnung **1,90 breit, mittig**, Sturz geschlossen, Wandteil 4 × 4 × 1; Türblatt `wall_doorway_door` wird aus der Instanz entfernt | durchlässig für Strahl **und** Körper |
| Dungeon-Gitter (`gate`) | portal, gesperrt | sichtbar, nicht begehbar; gesetzt auf der zweiten Fuge eines schon verbundenen Paares | sichtbar, gesperrt |
| Brüstung (`barrier`) | Balkonkante | gemessen 4,00 × 1,10 × 0,50, 0,50 schmal mit Lücken zwischen den Pfosten; Restlücke zur Wand 2,90 Stirnfläche | **Strahl durchlässig, Körper nicht** — in allen Pixel-/Strahlproben Auskunft statt Gate |
| Treppe | Ebenenwechsel | gemessener Hub 4,05; obere Ebene endet **auf** der Kopffuge (gerader Zug, kein Eckteil, volle 4 für `wall_doorway`) | Ebenenwechsel |
| Hex-Kante | Kachelanschluss | 6 Kanten je Kachel, Klassen g/s/w; Sand liegt auf genau den zwei Kanten, die den Wasserlauf flankieren | Straße / Fluss / Ufer |
| Straßenanschluss | road port | Höhenprofil Asphalt 0,07 / Bordstein 0,10; `roadStart` +0,13 versetzt, `roadCrossing` +0,50 | Fahrbahn |
| Kettenglied | track entry/exit | Kette schließt; `auditJoints` prüft den realen Spalt zwischen aufeinanderfolgenden Teilen | Strecke |

Der `barrier`-Fall ist der inhaltlich interessanteste für A0: derselbe Connector ist für einen
Strahl offen und für einen Körper zu. Ein einziges Boolean „passierbar" kann ihn nicht abbilden.
Genau dafür sind `capabilityTags[]` gedacht — das ist eine belegte Anforderung aus einem echten
Bauteil, kein erfundenes Feld.

## 2.5 RecipeEnvelope

Existiert nicht. Der S13.2-Export hat diese Form:

```text
id, pack, licence, seed, params, grid,
metrics {MOD, WALL_H, WALL_THICK, HUB, stair, frames},
levels, cells[], seams[{key, level, a, b, run, mid, kind, part, into}],
regions[], corners[], torches[], stair, checks, probe, placements[]
```

Entsprechung und Lücke:

| A0-Feld | Im S13.2-Export |
|---|---|
| `recipe.id` | `id: 'kaykit-dungeon-s13-2'` — Typ-Id, nicht Instanz-Id |
| `recipe.kind` | fehlt; wäre `scene` |
| `recipe.schemaVersion` / `revision` | **fehlen beide** |
| `recipe.status` / `maturity` | fehlen. Faktisch **L3–L4**: assembliert und evidenziert, als Regel ausdrückbar |
| `recipe.consumerTargets[]` | fehlt. Es gibt keinen getesteten Konsumenten, also **kein L5** |
| `recipe.assetRefs[]` | `pack` + `seams[].part` + `placements` — auflösbar, aber ohne `revision` |
| `recipe.slots[]` | `seams[]` ist die nächste Entsprechung (key/run/mid/level) |
| `recipe.surfaces[]` | `cells[]` + `levels` — Rollen nicht benannt |
| `recipe.connectors[]` | `seams[].kind` (`door`/`gate`/`rail`/`solid`/`open`) + `stair` |
| `recipe.variants[]` | fehlt |
| `recipe.evidence[]` | `checks` + `probe` — inhaltlich vorhanden, anders benannt |
| `recipe.notes` | fehlt |

**Generierte Geometrie:** Der Dungeon-Grundriss ist gerechnet, nicht autoriert. Nach A0 §5 bekommt
er **keine** fiktiven AssetRefs; reproduzierbar ist er über `seed` + `params` + `grid` +
Generatorversion. Eine Generatorversion fehlt im Export — das ist eine echte, benennbare Lücke.

## Reifegrad nach A0 §3

| Gegenstand | Grad | Begründung |
|---|---|---|
| Pack-Inventare und Maße | **L2** | konkrete Quellkandidaten mit Messevidenz; ohne `revision` nicht höher |
| Hex-Kachelmodell (`TILE_EDGES`) | **L4** | als wiederverwendbare Regel/Datentabelle ausgedrückt, gegen Geometrie gegengeprüft |
| Dungeon-Generator S13.2/S13.3 | **L4** | Assembly als Regel, 108 Grundrisse, zwei unabhängige Proben |
| Alles davon in Travel / Race / Combat | **kein L5** | kein empfangender Konsument hat geladen oder getestet. L5 vergibt nur der Konsument |

## Was A0 hier **nicht** bekommt

Kein Pilot A: keine Figur, kein `seat`/`hand`-Slot, kein `Lorekeeper`. Kein Pilot B: keine
Track-DNA, kein Flow Loop. Keine `stunt`-Semantik. Kein zweiter Renderer und kein zweiter World
Builder — die Vorschau dieses Projekts bleibt Vorschau.
