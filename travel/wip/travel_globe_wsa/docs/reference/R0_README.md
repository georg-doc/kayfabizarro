# KFB Travel Globe · R0 Re-home

**Status:** IMPLEMENTATION (R0 abgeschlossen, keine Verhaltensaenderung)
**Datum:** 2026-09-13
**Basis:** `KFB Travel Globe v13` (Zweig aus v12, FROZEN 3.9.2026)

Dieses Paket ist die **geschlossene Quellbasis** des laufenden v13. Es enthaelt jede Datei, die
der Einstieg zum Kaltstart braucht — auch die sieben Module, die **ausserhalb** von `globe-v13/`
liegen und im Vorgaenger-Export `export-globe-v13/` fehlten.

## Kaltstart

```
cd rehome-r0/travel
python3 -m http.server 8080
# http://localhost:8080/KFB%20Travel%20Globe%20v13.dc.html
```

Ein lokaler Server ist Pflicht: der Einstieg laedt ES-Module, `file://` verbietet das.
Netz ist Pflicht: three 0.160.0 (jsDelivr), Schriften, und alle schweren Assets
(GLB, Audio, Kartenblaetter) laufen zur Laufzeit ueber `raw.githubusercontent.com/georg-doc/kayfabizarro`.

## Baum

```
travel/
  KFB Travel Globe v13.dc.html   Einstieg / Wirt
  support.js                     DC-Runtime des Design-Hosts (mitgeliefert)
  BASELINE.json                  Identitaet dieses Stands
  CONTRACT.md                    wer was besitzt (Ist-Stand, abgelesen)
  themes/                        kfb-med.css, kfb-shell.css
  globe-v13/                     84 Module + 4 JSON + hud-frame.css + rift.png
  terrain-planets-v1/            card-carrier, card-registry, kfb-pets + 2 JSON
  cardbuilder/                   kfb-card-format.js (EIN Blattformat)
  modules/                       kfb-mech-combat.js
  kfb-cartoon-deform.js          geteilt (Projektwurzel)
  kfb-deform-instanced.js        geteilt (Projektwurzel)
  asset-repo.json                986 Assets mit ghUrl — Quelle der Prop-Namen
  QA/                            R0_QA.md + R0_coldstart.png
docs/
  REHOME_DEPENDENCY_CLOSURE.md   jede Abhaengigkeit mit Kaltstart-Ergebnis
  LIVING_TRAVEL_GLOBE.md         additive Chronik dieser Linie (Saat)
  DONOR_MATRIX.md                Spender-Herkunft
  v13/                           die 9 Dokumente des v13-Stands (ARCHIVED HISTORY)
R0_RETURN.md                     die Rueckgabe
```

**Die flache Ebene `travel/` ist der Vertrag, nicht Bequemlichkeit.** `globe-v13/*.js` importiert
mit `../terrain-planets-v1/`, `../cardbuilder/`, `../modules/`, `../kfb-*.js`; `globe-landmarks.js`
und `sky-enemies.js` lesen `./asset-repo.json` **relativ zur Dokumentadresse**. Wer den Baum
umbaut, bricht diese Pfade — Umbau ist eine spaetere Scheibe, nicht R0.

## Was NICHT geaendert wurde

Keine Zeile Gameplay. Kein Charaktertausch, keine Flug-Abstimmung, kein Bad, keine Raeder, kein
Blaster, kein Three.js-Update, kein Refactoring des Wirts. Die 87 Module sind Zeichen fuer Zeichen
der Stand vom 3.9.2026.

## Standalone

`KFB_Travel_Globe_v13_STANDALONE.html` (2698 kB, gebaut 10.09.) liegt **nicht** in diesem Paket —
Groessenbudget. Sie liegt im Projekt unter `export-globe-v13/` und
`export/kfb-travel-globe-v13_2026-09-10/`. Bauweise (Blob-Kette + Importmap) steht in
`export-globe-v13/README.md`.
