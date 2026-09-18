# Asset Atlas S0 · Messbericht

**Gate:** A · `Platformer_Kit_Atlas_S0.html`
**Pack:** `media/3D_Assets/Platformer Game Kit - Dec 2021/` @ `eb48f50489b9e4903ec1e3d2fb1837605ce7d792`
**Stand:** 2026-09-18 · alle Zahlen zur Laufzeit im Browser gemessen, nichts aus Dateinamen übernommen.

## Verfahren

Je glTF werden die Dreiecke im Modellraum gesammelt und nach Normalenrichtung ausgewertet
(Toleranz 0,985 ≈ 10°, Ebenentoleranz 0,02, Höhenbündel 0,01):

| Frage | Messung |
|---|---|
| Lauffläche | größte nach **oben** zeigende waagerechte Ebene — ausdrücklich nicht `maxY` |
| Unterseite | nach unten zeigende Fläche in der `minY`-Ebene / Grundriss |
| Seite je Richtung | zugewandte Fläche und **flache** Fläche exakt in der Box-Seitenebene / Querschnitt |

Seitenbefund: `OPEN` (< 2 % zugewandte Fläche → dort steht gar keine Geometrie) ·
`WALL` (flach ≥ 0,85 → planflache Haut in der Zellkante) · `EDGE` (zugewandt ≥ 0,3, profiliert/überhängend) · `PARTIAL`.

## Bestand

109 glTF geladen, **109 vermessen, 0 Ladefehler**, 109 Thumbnails gerendert.
Familien: Character 2 · Cubes 8 · Enemies 4 · Level and Mechanics 40 · Modular Platforms 2D 4 ·
3D 11 · Single Height 6 · Nature 17 · Powerups and Pickups 11.

**Keine Texturen.** `textureFolds` zählt 0/0 — jedes Material ist ein farbiges
`MeshStandardMaterial` (`Green_Light`, `Dirt_1…3`, `Rock`, `Wood`). Das Pack braucht keinen
Atlas und keine Textur-Faltung; Farbe kommt aus dem Material.

## Der Befund, der das mentale Modell ändert

`Cube_Grass_Center` besteht aus **vier Dreiecken**: Deckel und Boden. **Keine einzige
Seitenwand.** Alle vier Flanken sind `OPEN`.

Das ist keine Beschädigung, sondern die Bauweise: Center-Teile sind bauartgemäß von
Nachbarn umgeben. Steht ein Center-Teil am Inselrand, schaut man in die Insel hinein.
Genau das zeigt der verworfene Project-Island-Screenshot — es war kein Platzierungs-
Feinschliff-Problem, sondern die falsche Teilewahl am Rand.

## Gemessene Grammatik (Auszug, Single Height + 3D)

| Teil | Rolle (gemessen) | Signatur +X/−X/+Z/−Z | Maß | Lauffläche Y |
|---|---|---|---|---|
| Cube_Grass_Center | CENTER | OPEN/OPEN/OPEN/OPEN | 2,00 × 2,00 × 2,00 | 1,00 |
| Cube_Grass_Side | SIDE | OPEN/OPEN/**EDGE**/OPEN | 2,00 × 2,00 × 2,12 | 1,00 |
| Cube_Grass_Corner | CORNER | OPEN/**EDGE**/**EDGE**/OPEN | 2,12 × 2,00 × 2,12 | 1,00 |
| Cube_Grass_Single | SINGLE | EDGE ×4 | 2,23 × 2,00 × 2,23 | 1,00 |
| Cube_Dirt_Center / Side / Corner | CENTER / SIDE / CORNER | wie oben, Wände statt Überhang | 2,00 × 2,00 × 2,00 | 1,00 |
| Cube_Grass_Center_Tall | PANEL_LID_TOP | — | 2,00 × **0,00** × 2,00 | 1,00 |
| Cube_Grass_Bottom_Tall | PANEL_LID_BOTTOM | — | 2,00 × **0,00** × 2,00 | keine |
| Cube_Grass_SideCenter_Tall | PANEL_WALL | OPEN/OPEN/WALL/OPEN | 2,00 × 2,00 × **0,00** | keine |
| Cube_Grass_CornerCenter_Tall | SHELL_CORNER | OPEN/WALL/WALL/OPEN | 2,00 × 2,00 × 2,00 | keine |
| Cube_Grass_SideBottom_Tall / CornerBottom_Tall | BOTTOM | eine bzw. zwei Wände | 2,00 × 2,00 × 2,00 | keine |
| Cube_Dirt_1x1Center / Cube_Grass_1x1Center | SPAN (2D) | OPEN/OPEN/geschlossen/geschlossen | 2,00 × 2,00 × 2,00 … 2,23 | 1,00 |
| Cube_Dirt_1x1End / Cube_Grass_1x1End | END | OPEN + drei geschlossene | — | 1,00 |

Die abgeleitete Rolle deckt sich bei allen Single-Height- und 2D-End-Teilen mit dem
Dateinamen. Die neun gemeldeten Abweichungen sind echte Befunde, keine Fehlklassifikation:
die „Tall"-Teile sind **kein** massiver Block-Satz, sondern ein **Mantel-Satz**.

## Maße für die Grammatik

| Fakt | Wert | Herkunft |
|---|---|---|
| Rasterschritt X | **2,000** | Modus über 21 Plattformteile (18 Treffer) |
| Rasterschritt Z | **2,000** | Modus (14 Treffer; Abweichungen sind Grasüberhänge 2,12 / 2,23) |
| Modulhöhe Single Height | **1,996** | 3 Teile |
| Modulhöhe 3D | **2,000** | 6 Teile |
| Deckel/Wandpaneele mit Dicke 0 | Cube_Dirt_Center_Tall · Cube_Grass_Center_Tall · Cube_Grass_Bottom_Tall (H 0) · Cube_Grass_SideCenter_Tall (T 0) | gemessen |
| Grasüberhang | 0,117 je profilierter Kante (2,117 statt 2,000) | gemessen |
| Pivot Plattformteile | Boxmitte (`inBoxY` 0,50), **nicht** auf der Unterkante | gemessen |
| Pivot Nature/Props | auf der Unterkante (`atBottom` true, z. B. Tree, RockPlatforms_Large) | gemessen |
| Baum | 8,626 hoch | gemessen |
| RockPlatforms_Large | 7,38 × 3,63 × 5,16, oberste waagerechte Ebene Y 3,60, Deckung 9,5 % | gemessen |

Konsequenz für die Aktor-Kalibrierung: der Plattform-Pivot liegt in der Mitte, die
Lauffläche also bei `pivotY + 1,0`. Wer Plattformen bei `y = 0` platziert und Aktoren bei
`y = 0` absetzt, produziert exakt den bekannten Schwebefehler.

## Konsequenz für S1 (Preview-Rekonstruktion)

1. Jede sichtbare Inselkante braucht ein Teil mit geschlossener Flanke in Blickrichtung
   (SIDE / CORNER / SINGLE) oder ein Wandpaneel. CENTER nur im Inneren.
2. Hohe Inseln werden als **Kiste** gebaut: Deckelpaneele oben, Wand-/Mantelteile an den
   Flanken, Bodenplatte unten — nicht als Stapel massiver Würfel.
3. Requisiten werden auf die **gemessene Laufflächen-Ebene** gesetzt, nicht auf `maxY`.
4. Grasüberhang 0,117 heißt: Kantenteile bauen 2,00 breit, der Überhang ragt nach außen —
   er ist kein zusätzlicher Rasterschritt.

## Status

`SOURCE` Pack-Index aus dem Registry-Shard, 109 Pfade, Pin `eb48f50`.
`IMPLEMENTATION` `Platformer_Kit_Atlas_S0.html` + `src/atlas/{measure,atlas-app}.js`.
`TESTED RESULT` 109/109 geladen und vermessen, 0 Fehler, 109 Thumbnails, Rollen der
Single-Height-Familie decken sich mit den Dateinamen.
`OPEN` Gate B (Preview-Rekonstruktion) nicht begonnen · `data/platformer-module-grammar.json`
noch nicht geschrieben (Export-Knopf im Atlas liefert die Rohdaten) · Screenshot-Beleg in
`docs/TEST_REPORT.md` fehlt noch · Audio bleibt eingefroren.
