# KFB Plant Prop Lab · v2

Werkbank für Pflanzenrequisiten im Crazy-Cat-Maßstab. Stand S19.
Einstieg: **`START_HERE.md`**.

## Aufbau

    index.html          die Werkbank (drei Ansichten: Erstbeweis · Werkbank · Farbtafel)
    src/                sieben ES-Module, keine Abhängigkeit ausser three.js
    docs/               Prüfvorlage, Design-Linie, Backlog, zwei Sprint-Verträge
    proof/              Abnahmebilder S19
    CHANGELOG.md        Entscheidungshistorie (additiv)
    HOUSEKEEPING.md     Statusregister + Clean-Run-Checklisten

## Die Module

| Modul | Aufgabe |
|---|---|
| `src/kit-lab.js` | geteilter Szenenbauer des Atlas-Projekts (Viewer, Laden, Instanzieren, Audits) |
| `src/plant-inventory.js` | 72 vermessene Quellteile. Ein Inventar, keine Kandidatenliste |
| `src/plant-recipe.js` | PlantRecipe: Grammatik, Behältermessung, Bau |
| `src/plant-pattern.js` | **Register-Grammatik** + Farbklima + `probeUV()` als Urteil über den Musterweg |
| `src/plant-rig.js` | Transform-Proprig ohne Knochen: STATIC / AMBIENT / AWARE |
| `src/plant-eyes.js` | Adapter auf `pet-eye-rig.v6.js`. Kein eigenes Augensystem |
| `src/plant-light.js` | vier Lichtkalibrierungen (Tag · Abend · Interieur · Nacht) |

## Neu in v2 gegenüber v1 (Revision r1 vom selben Tag)

Das Topfmuster ist von einem Zellraster auf eine **Register-Grammatik** umgestellt
(`src/plant-pattern.js` neu geschrieben), alle zwölf Paletten folgen einer Rollenregel mit
gemessenem Kontrasttor, Biome ziehen Paletten deterministisch, und das Bedienfeld trägt die
Erklärtexte hinter „i"-Popovern. Vollständig im `CHANGELOG.md`, Eintrag **S19**.

## Lizenz und Herkunft

Code: intern. Modelle: CC0 (KayKit, Quaternius, Kenney) — **nicht in diesem Paket**, zur
Laufzeit aus `georg-doc/kayfabizarro` geladen.
