# KFB · Hex-Worldbuilder Corpus

**Alles, was im Projekt zu den KayKit-Hexagon-Packs vorliegt, an einer Stelle.**
Stand 22.09.2026. Code 1:1 aus dem Projekt, nichts repariert, nichts umgeschrieben.

Dieses Paket ist kein Worldbuilder. Es ist das **Material**, aus dem einer gebaut wird:
drei lauffähige Werkzeuge, die Kachelkunde beider Packs, die Gitter- und Kantenbibliothek,
und die Protokolle der Fehlläufe, die zu den heutigen Verfahren geführt haben.

## Womit anfangen

| Frage | Datei |
|---|---|
| Was liegt überhaupt in den Packs? | `PACK_TRUTH.md` |
| Wo steht welcher Code? | `CODE_MAP.md` |
| Was lädt was, und was bricht wie? | `DEPENDENCIES.md` |
| Was sollte als Nächstes gebaut werden? | `NEXT_FIVE.md` |
| Was übergebe ich an WSA? | `HANDOVER_WSA.md` |

Zum Anfassen: `modules/KFB_Hex_Baukasten_S0/index.html` zeigt den Bestand,
`modules/KFB_Hex_Edge_Atlas_S1/index.html` die Kanten, `modules/KFB_Babel_Hex_Generator_v1/index.html`
einen fertigen Generator mit Spielmodus.

## Die drei Werkzeuge und ihre Reihenfolge

Sie bauen aufeinander auf, und die Reihenfolge ist der Inhalt.

**1 · Hex-Baukasten S0** — *Bestand → Bauteile → Regeln → Generator.* Beantwortet, was in den
Packs liegt, wie groß es ist, welche Rolle es spielt. Sieben Bauschritte von Grundriss bis
Aufbau. Die verworfene Inselkomposition (`FAIL_ISLANDS.md`) ist daran gescheitert, dass
Schritt vier vor Schritt eins kam.

**2 · Hex-Kanten-Atlas S1** — die Kantenkunde, die dem Baukasten fehlte. Sechs Kanten je
Kachel, über eine Überdeckungsprobe an fünf Fugenpunkten gemessen und gegen `TILE_EDGES`
geeicht, bevor sie etwas beschreibt, das niemand nachprüfen kann. Dazu die vier Bauvorgaben
des Herstellers, nachgebaut statt generiert.

**3 · Babel Hex-Generator v1** — was mit beidem geht: ein seedbarer Turm aus Hex-Bändern mit
gerechneten Sprungweiten, Editor, Chill & Fun, Play. Er ist zugleich der Fall, an dem die
Kantenkunde nötig wurde: seine Kachelwahl war `Math.floor(rand()*6)*60`.

## Inhalt

```
modules/KFB_Hex_Baukasten_S0/     Bank: Bestand, Rollen, Felsklassen, sieben Bauschritte
modules/KFB_Hex_Edge_Atlas_S1/    Kanten, Eichung, Kontaktbogen, Bauvorgaben, Lehren
modules/KFB_Babel_Hex_Generator_v1/  Turm, drei Modi, Sprungmathematik
modules/hexrealm/                 hex-grid.js (TILE_EDGES, Kantenmasken), atlas.js,
                                  kit-lab.js, Hex-Realm S11, Hub-Insel
mirrors/                          Spiegelseiten auf Projektebene (nur Hülle)
studies/                          GLB_hexagon_kit-Bank und zwei 2D-Hexflächen
data/                             registry-packs.json (107 Packs), hub-tiles.json
context/                          Fehler-Handoff, Postmortems, Arbeitsweise, Repo-Stand
evidence/                         19 Belegbilder aus den Prüfläufen
```

## Was NICHT drin ist, und warum

**Keine Modelle.** Projektregel 1: Assets bleiben GitHub-SourceRefs mit raw-URL. Die 447
Teile beider Packs liegen unter `media/3D_Assets/` im Repo `georg-doc/kayfabizarro` und
werden zur Laufzeit geladen. Wer dieses Paket ohne Netz öffnet, sieht die Oberfläche und
keine Geometrie — das ist beabsichtigt, nicht kaputt.

**Kein `edge-atlas.json`.** Der Kanten-Export entsteht aus der laufenden Seite
(Schema `kfb.hex-edge-atlas/3`). Er ist ein Messergebnis, kein Quelltext; ihn hier
einzufrieren hieße, eine zweite Wahrheit neben die Messung zu legen. `NEXT_FIVE.md` Punkt 1
schlägt genau das vor — dann aber als benanntes, gebackenes Artefakt mit Erzeugungsdatum.

**Kein Push.** Lieferung ist dieses ZIP plus Preview. Integration macht der Web Lead.
