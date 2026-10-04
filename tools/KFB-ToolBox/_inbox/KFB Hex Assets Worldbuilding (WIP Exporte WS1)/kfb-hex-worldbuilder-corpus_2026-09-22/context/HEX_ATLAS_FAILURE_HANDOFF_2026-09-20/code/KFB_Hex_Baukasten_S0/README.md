# KFB · Hex-Baukasten S0

Bank, kein Spiel. Sie beantwortet vier Fragen in dieser Reihenfolge, und die Reihenfolge ist
der Punkt: **Bestand → Bauteile → Regeln → Generator.** Erst wissen, was da ist; dann sehen,
wie es aussieht; dann festlegen, was es tut; dann bauen. Die verworfene Inselkomposition
(`KFB_Free_Roam_Platformer_v1/docs/FAIL_ISLANDS.md`) ist genau daran gescheitert, dass
Schritt vier vor Schritt eins kam.

Start: `index.html`.

## Quellen

| Pack | Pfadquelle | Ref |
|---|---|---|
| KayKit Medieval Hexagon Pack 1.0 FREE | `registry/assets/v1/packs/kaykit-medieval-hexagon-pack-1-0-free.json` | main |
| KayKit Medieval Builder Pack 1.0 | `registry/assets/v1/packs/kaykit-medieval-builder-pack-1-0.json` | main |
| Rocks + Pebbles + Path Tiles by Quaternius | GitHub-Contents-API, Verzeichnislisting zur Laufzeit | main |
| Kantenmasken, Straßenlöser, Hex-Gitter | `hexrealm/lib/hex-grid.js` (nicht nachgebaut) | lokal |

Kein Asset wird kopiert. Modelle bleiben raw-URLs, Pfade kommen aus dem Registry-Shard oder
aus dem gelesenen Verzeichnis — keiner ist getippt.

## Zwei Befunde, die Arbeit gespart hätten

**Poly-Pizza-Namen lassen sich nicht raten.** Die Quaternius-Teile sind einzeln über
Poly Pizza geholt. Jeder Dateiname trägt eine Zufalls-ID:

    Pebble Round by Quaternius - icVsN3lmVy.glb
    Rock Path Square Smal by Quaternius - w4TKZMjjcw.glb

Der erste Anlauf tastete ein Namensraster ab (`Rock_1.gltf`, `Pebble_2.glb` …) und fand
nichts — nicht weil das Pack fehlte, sondern weil das Raster nicht treffen kann. Auch
`github_get_tree` half nicht: es listet in diesem Repo keine `.gltf`/`.glb`, »0 gefunden«
heißt dort nicht »nicht da«. Die Lösung ist ein echtes Verzeichnislisting über die
GitHub-Contents-API zur Laufzeit. Neue Teile tauchen beim nächsten Start von selbst auf.

**Die Familie entscheidet vor dem Maß.** Die erste Rollenzuordnung fragte zuerst »ist der
Grundriss ein Sechseck?«. Im Hexagon-Pack sitzt aber jedes Gebäude auf einem Hex-Sockel —
also maßen Burgen, Türme und Mühlen 2,0 × 2,31 und wurden zu Bodenkacheln. Der erste
Belegbogen zeigte acht Burgen als Fußboden. Das Maß darf erst entscheiden, wenn die Ordnung
des Packs nichts sagt.

## Die sieben Bauschritte

Vorbild ist ein Dungeon-Generator und die Nutzungsanleitung, die KayKit dem Pack selbst
beilegt (Promobild »Nature usage guide«).

| # | Schritt | Frage, die er beantwortet |
|---|---|---|
| 1 | Grundriss | Welche Zellen gehören dazu? Wachstum aus einer Form-Regel (Blob · Ring · Spine · Star). |
| 2 | Terrassen | Wie hoch liegt jede Zelle? **Plateaus** (Voronoi über weit auseinanderliegende Startzellen), jedes mit einer Höhe aus durchgemischter Reihenfolge. |
| 3 | Körper | Was sieht man von der Seite? Kacheln bis zur tiefsten Nachbarkante — sonst Löcher am Sprung. |
| 4 | Padding | Wie überbrücke ich zwei Stufen? Teilsechseck auf die Sprungkante, halbe Höhe. **Das Gelände liefert die Sprünge jetzt; die Teile fehlen noch — siehe Offen.** |
| 5 | Weg | Wie kommt man hindurch? A* über Nachbarn mit höchstens einer Stufe Unterschied. |
| 6 | Felsen | Wo steht Stein, in welcher Klasse? A einmal, B an Kanten, C dazwischen. |
| 7 | Aufbau | Was steht wo und warum? Landmarke mittig-hoch, Natur außen, Laufweg bleibt frei. |

Der Weg wird **vor** den Aufbauten gelegt und sperrt seine Zellen. Das ist die Lehre aus dem
Insel-FAIL: eine Fläche, die man nicht betreten kann, ohne durch die Deko zu stapfen,
erzählt nichts.

## Zwei Wegarten, nicht austauschbar

**Hex-Straßenkachel** tauscht die ganze Kachel gegen eine mit eingebackenem Sandweg; die
Rotation kommt aus der Kantenmaske in `hex-grid.js`, kein Rätselraten. **Quaternius-Pfadkachel**
liegt oben auf: flach, quadratisch, kennt kein Sechseck — also wird sie nicht gelöst, sondern
gelegt, eine je Wegzelle plus eine auf jeder Kantenmitte, auf Kachelbreite skaliert. Das ist
ein Trampelpfad über der Wiese, keine andere Wiese. `auto` nimmt die Pfadkacheln, sobald
welche im Bestand sind.

## Die Felsklassen — abgeleitet, nicht gesetzt

Drei Runden lang kamen die Grenzen aus meinem Kopf, und dreimal waren sie falsch:

1. Höhe ≥ 1,2 / 0,35 Stufen → A=0, B=0, C=13. Die Steinfamilie heißt im Pack nicht »rock«,
   sondern `mountain_*`, `hills_*`, `hill_single_*`.
2. Grundfläche ≥ 0,8 Kacheln → B übervoll mit tilegroßen Hügeln, der Rand verschwand unter
   Bergen.
3. Grundfläche ≥ 0,55 → B leer, weil zwischen 0,5 und 1,11 schlicht nichts existiert.

Eine Schwelle, die den Bestand nicht kennt, kann ihn nicht teilen. `deriveRockClasses()`
sortiert deshalb die gemessenen Grundflächen und sucht die **echten Lücken**: eine Trennstelle
ist ein Sprung um mindestens Faktor 2. Was herauskommt, kommt heraus — findet sie nur zwei
Populationen, heißt das Ergebnis »zwei Populationen«, und die dritte Regel wird als **inaktiv**
gemeldet statt weiter beworben.

| Rolle | Regel |
|---|---|
| **A · Formation** | Kachelmitte, ungedreht, einer je Plattform, höchste Terrasse. |
| **B · Cluster** | Gruppen von 2–4 auf Außenkanten und Höhensprüngen, nie einzeln. |
| **C · Scatter** | Streu auf offener Fläche, nie im Laufweg. |

Kombination: wo ein A steht, stehen zwei bis drei B am Fuß und C dazwischen. Wo nur B steht,
steht C dazwischen. C allein nur auf reiner Wiese. Der Regeln-Bildschirm zeigt die gefundenen
Trennstellen mit Faktor, der Bericht zeigt, welche Regel gelaufen ist und welche nicht.

Streuteile bleiben auf ihrer Kachel: der Versatz wird durch die gemessene halbe Ausdehnung
gedeckelt und auf Randzellen nach **innen** gefächert — außen ist Leere. Vorher ragten acht
von 51 Teilen über die Kante und warfen Schatten ins Nichts.

## Dateien

    index.html          Bank
    src/sources.js      raw-URLs, Registry-Abruf, Ladeprotokoll
    src/inventory.js    Shard-Ernte, Deduplizierung, Quaternius-Verzeichnislisting
    src/kit.js          Loader, Messung, Rollen, Felsklassen, Modulmaß
    src/generator.js    die sieben Bauschritte
    src/app.js          vier Bildschirme, ein Renderer

Licht, Schatten und Bodenkontakt kommen aus `KFB_Free_Roam_Platformer_v1/src/lighting.js` —
ein Besitzer, keine zweite Fassung. Genau die Schattenlogik, die hier geprüft wird, läuft
dort im Spiel.

## Offen

- Das **Builder Pack** ist inventarisiert, aber noch nicht in den Baukasten eingehängt: 236
  Dateien Bauteile gehören nicht in den ersten Belegbogen. Nächster Schritt.
- **Wasserkacheln** haben eine Rolle, aber noch keine Bauregel — eine schwimmende Plattform
  braucht kein Ufer, eine Hub-Insel vielleicht schon.
- **Das Höhenmodell war der eigentliche Grund, warum Bauschritt 4 nie lief.** Die Höhe war
  eine monotone Funktion des Hex-Abstands zur Mitte — Nachbarzellen liegen dann per
  Konstruktion höchstens eine Stufe auseinander. Gemessen über 16 Konfigurationen (Terrassen
  2–5 × Zellen 7/19/37/61): **null Zweistufensprünge in 14 von 16**. Ersetzt durch Plateaus.
  Der Bericht weist die Zahl der Sprünge jetzt aus.
- **Teilsechsecke fehlen im Bestand.** Gemessen: alle 128 Hex-Kacheln des Builder Packs sind
  2 × 2,309, also volle Kacheln; der einzige kleinere Kandidat im Hexagon-Pack ist
  `hex_coast_D_waterless` (1 × 1,732) — und das ist keins: das Seitenverhältnis 1,73 statt
  1,15 verrät die halbe Uferkachel, die Rollenregel verlangt deshalb neben dem kleineren
  Grundriss auch dieselbe Sechseckform. Die im Promobild gezeigten
  Teilsechsecke sind in dem, was geerntet wird, nicht vorhanden — möglicherweise liegen sie in
  den vom Kern ausgeschlossenen `tiles/square` (68) oder `objects` (30) des Builder Packs.
  Bauschritt 4 meldet das im Bericht, statt etwas Falsches zu setzen. **Offene Prüffrage.**
- **Der Hexagon-Pack-Kachelsatz hat genau eine ebene Vollkachel** (`hex_grass`): alles andere
  ist Ufer, Fluss, Straße, Kappe oder Schräge. Die Kachelvielfalt liegt im Builder Pack,
  deshalb ist »beide gemischt« die Vorgabe.
