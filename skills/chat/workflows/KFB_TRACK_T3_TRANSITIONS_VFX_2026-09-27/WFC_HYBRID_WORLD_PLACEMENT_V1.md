# WFC für KFB · Hybrid World Placement v1

Status: **RECOMMENDED AS BOUNDED PLACEMENT SOLVER · NOT A WORLD/RACE OWNER**

## Urteil

Wave Function Collapse passt zu KFB, aber **nicht** als Generator für Fahrbahn, OSM-Route, Physikfläche oder die gesamte Welt. Es eignet sich als deterministischer Füll- und Nachbarschafts-Solver um bereits festgelegte Strukturen herum.

KFB-Reihenfolge:

`OSM/hand-authored route + Track Core + Landmarks`
→ `begehbare/physikalische Korridore sperren`
→ `WFC füllt erlaubte Zonen mit kuratierten Modulen`
→ `Gameplay-/Kontakt-/Sichtachsen-Validator`
→ `Seed + Ergebnis als JSON speichern`

## Gute KFB-Einsatzfelder

- Fassadenrhythmus aus bewiesenen KayKit-/Kenney-Fenstern, Türen, Erkern und Dachmodulen;
- Gebäudehöhenbänder und Setbacks entlang von Stadtstraßen;
- Bordstein-, Gehweg-, Zaun-, Graben- und Vegetationsfolgen außerhalb des Fahrkorridors;
- Biom-Nachbarschaften und Übergangsmodule;
- Prop-/Resident-Aktivitätsplätze mit Abstands- und Sichtregeln;
- später Dungeon-, Hex- und Diorama-Raumfüllung.

## Nicht an WFC delegieren

- Centerline, Breite, Bank, Rampen, Sprünge und Track-Anschlüsse;
- Ground-/Wheel-Contact, Collision, Camera Clearance und Run-Clear;
- OSM-Geometrie oder Landmark-Positionen;
- globale Dramaturgie, Route, Quest- oder Rennlogik;
- Material- und VFX-Runtime pro Frame.

## KFB-Kachelvertrag

Jedes zulässige Modul erhält statt bloßer Farbkanten semantische Sockets:

- `edge`: road / sidewalk / facade / garden / nature / water / void;
- `heightBand`: low / medium / tall / landmark;
- `access`: door / resident / vehicle / none;
- `clearance`: player / car / camera;
- `biome`, `paletteRole`, `clayProfile`, `vfxProfile`;
- `sourceRef`, `licenseRef`, `weight`, zulässige Rotationen/Spiegelungen;
- verbotene Nachbarn und erforderliche Nachbarn.

Track- und OSM-Zellen werden vor dem Lösen festgesetzt. WFC darf nur unbesetzte Zellen kollabieren. Ein Widerspruch führt zu lokalem Retry oder einer sichtbaren Lücke mit Diagnose — niemals zur Deformation des Fahrkorridors.

## Empfohlener erster POC

Eine 2.5D-Zone von etwa 6 × 12 Zellen entlang eines feststehenden T3-v2-Stadtübergangs:

1. Track, Bordsteinanfang, Gehweg und zwei Landmark-Anker sind fest.
2. Zehn bis fünfzehn source-bewiesene Fassaden-/Scenery-Module bilden den erlaubten Satz.
3. Drei Seeds werden erzeugt und als JSON exportiert.
4. Validatoren prüfen Route, Türzugang, Fahrzeug-/Kamera-Clearance, Höhenrhythmus und Draw-Call-Budget.
5. Nur ein Ergebnis wird im echten WorldBuilder gezeigt; die anderen bleiben Datenbeleg.

## Performance

- Generieren beim Authoring oder einmal beim Zonenladen, nicht pro Frame.
- Ergebnis cachen und über Seed/Recipe reproduzieren.
- Zunächst 2.5D/simple tiled, keine vollständige 3D-Voxelwelt.
- Instancing/LOD/Materialrollen nach dem Layout anwenden; WFC erzeugt keine eigenen Render-Owner.

## Hintergrund

Die Referenzimplementierung beschreibt WFC als lokale Muster-/Adjazenzsynthese, unterstützt Constraints und manuelle Vorgaben, weist aber für höhere Dimensionen auf Performancekosten sowie mögliche Widersprüche hin. Genau deshalb wird es hier als begrenzter Solver in einer vorgegebenen Welt eingesetzt.

Referenz: https://github.com/mxgmn/WaveFunctionCollapse
