# START HERE · KFB Plant Prop Lab v2

Revision `2026-09-19-r2` · Umfang: nur Plant Prop (Auswahl C aus dem Exportformular).

## In drei Sätzen

Eine Pflanzenrequisite ist ein **Rezept** über unveränderten Quelldateien: Topf, Untersetzer
und Pflanze werden aus zwei CC0-Packs geladen, gemessen und zusammengesetzt — nichts wird
modelliert, nichts wird kopiert. Das Topfmuster ist keine Textur, sondern eine **Grammatik**
aus waagerechten Registern, die im Shader analytisch zylindrisch projiziert wird. Bewegung
und Augen sind Aufsätze auf dieselbe Requisite, keine zweiten Systeme.

## Öffnen

`index.html` in einem Browser mit WebGL2. **Kein Build, kein Server nötig** — ein
Doppelklick genügt. Alle Modelle werden zur Laufzeit von
`raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/` geladen, three.js
über unpkg mit gepinnter Version. Deshalb braucht der erste Start eine Netzverbindung und
ca. 10–20 Sekunden.

Beim Kaltstart baut die Seite den **Erstbeweis**: sechs Kompositionen nebeneinander,
Nummernmarke am Objekt, Legende unten.

## Prüfen (Clean Run)

Die Schrittliste steht in `HOUSEKEEPING.md` unter „Clean-Run-Checkliste · S18" und
„· S19". Das Kurzprogramm für die Abnahme:

1. Kaltstart → sechs Kompositionen, Konsole nur `THREE.Clock`-Deprecation.
2. Leiste „☰" → **Prüfungen**: Fehlschläge 0, Seed-Rundlauf beide Zeilen grün.
3. **Muster** → im Bericht stehen Registerstapel und sechs Tore, alle „ja".
4. **AWARE** → Augen am Topf, Blick folgt dem Zeiger.
5. **Farbtafel** → vier Lichter, Reihe vollständig im Bild.

## Lesereihenfolge der Dokumente

| Zuerst | warum |
|---|---|
| `docs/HANDOFF_WSA_S18.md` | die Prüfvorlage: Vertrag, vier tragende Entscheidungen, Risiken |
| `docs/DESIGN_LINE_TOPFMUSTER.md` | die Muster-Grammatik in vier Regeln, mit Grenzen |
| `docs/BACKLOG_PLANT_PROP.md` | was offen ist, ungeschönt, P0–P3 |
| `docs/SPRINT_19_CARTOON_DEFORMER.md` | Vertrag vor Code, **nicht gebaut** |
| `docs/SPRINT_20_LIVING_PLANTS.md` | Vertrag vor Code, **nicht gebaut** |
| `CHANGELOG.md` | die Entscheidungshistorie, additiv, neuester Eintrag oben |

Die drei `docs/*dungeon*`- und `LIGHT_CONCEPT`-Dateien betreffen den Dungeon-Generator und
liegen nur bei, weil der Umfang „docs/ komplett" lautete. Für die Plant-Prop-Abnahme sind
sie ohne Belang.

## Was NICHT im Paket ist

- **Keine Modelldatei.** Kein `.gltf`, kein `.glb`, keine Textur. Bewusst: die Packs sind
  CC0, aber ihre kanonische Fassung liegt im Asset-Repo, und eine Kopie hier wäre sofort
  eine zweite Wahrheit.
- **Kein Augensystem.** `pet-eye-rig.v6.js` wird per jsDelivr geladen.
- **Die übrigen 19 Atlas-Seiten** und ihre Module (Auswahl C).
