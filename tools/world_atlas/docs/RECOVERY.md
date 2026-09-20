# Recovery

## CURRENT · S14 R02 Room Blueprint · 2026-09-20

- owner: `tools/world_atlas/`
- branch: `world-atlas/dungeon-room-blueprint-s14-blender-2026-09-20`
- Draft PR: #126
- browser/editor: **15/15 PASS**
- Blender: **37 manifest instances / 39 imported objects; KFB_R02.blend saved**
- automated Linux review PNG/GLB: **FROZEN BLOCKED** after two repair passes (missing EGL after save)
- failure recovery: `../failure-recovery/S14_BLENDER_REVIEW_GATE_2026-09-20/START_HERE.md`
- current Return: `RETURN_dungeon_room_blueprint_S14_2026-09-20.md`
- human Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/dungeon-raid-v2/` — **PUBLIC VERIFIED 17/17 PASS** · run `35483284605` · job `106004849935` · `cloudflare-live@92d1fb91413457b3288db22dc7be8a487f853065`

Exactly one current gate: visually review the isolated R02 room and preserved Blender file. Do not integrate it into the BSP generator or start Tiny Treats rooms before that review.

## Startpunkt für einen neuen Chat oder Entwickler

1. `README.md`, dann `START_HERE.md` (Start über HTTP, nicht `file://`).
2. `docs/ARCHITECTURE.md` §„Das tragende Prinzip" und §„Prüfverfahren" — ohne die beiden Absätze
   wirkt der Code überprüft, wo er nur konsistent ist.
3. `docs/HANDOFF_dungeon_props_S13_3.md` — die nächste Arbeit liegt dort schon gerechnet.
4. `docs/LIGHT_CONCEPT_S13_3.md` — warum Fackeln Akzent sind und `decay 1` gewählt ist.
5. `../CHANGELOG.md` und `docs/SOURCE_github.md` sind die Entscheidungshistorie. Additiv geführt.

## Relevante Dateien für den laufenden Sprint

| Datei | Rolle |
|---|---|
| `source/KayKit_Dungeon_Generator_S13_2.html` | Seite, UI, Prüfbalken, Recipe-Export |
| `source/lib/dungeon-grid.js` | BSP, Fugenmodell, Treppe, Gates |
| `source/lib/dungeon-light.js` | Lichtrig S13.3, Flammenerkennung, Leseprobe |
| `source/lib/kit-lab.js` | Messkern, Audits, Pixelprobe — von allen Seiten geteilt |

`kit-lab.js` ist **geteilt**. Eine Änderung dort betrifft alle 15 Seiten. Nicht als tot einstufen.

## Offene Fehler

Siehe `KNOWN_ISSUES.md`. Der eine, der eine Entscheidung braucht:

- **§1 Assetbasis auf `main`** — ohne Pin ist kein Ergebnis reproduzierbar. Das blockiert jedes
  ernsthafte `AssetRef.revision`. Dass die Assets über GitHub laufen, ist dagegen entschieden und
  richtig (`DECISIONS.md`) — nur die Revision fehlt.

## Nächste konkrete Arbeit

**S13.4 · Requisiten.** Vorbereitet, nicht begonnen. Zahlen in
`docs/HANDOFF_dungeon_props_S13_3.md`: die sieben Wandrequisiten, ihre Asymmetrie als Ankerregel
(Rücken im Pivot / Standoff im Bauteil / freistehend), freier Radius je Zelle, was Überstand und
Eckschenkel wegnehmen. Vorgabe: Dichte 30 %, nur Ränder, Mitte frei.

**Offene Entscheidung davor:** Bloom (Postprocessing-Glühen auf den Flammen) oder direkt S13.4.
Georg hat diese Wahl noch nicht getroffen.

## Owner-Grenzen · unverändert

| Owner | Besitzt |
|---|---|
| Asset Registry / Librarian | Quellidentität, Provenienz. Dieses Projekt ist **nur lesender Konsument** |
| ToolBox / Atlas / Claude Design | Komposition, Messung, Rezeptkandidat, visuelle Evidenz — das hier |
| Travel / WB0 | Weltplatzierung, Kontaktinterpretation, Bodenlokomotion, Persistenz, Runtime |
| Stunt Race | Fahrzeug-/Kontaktverhalten, Track Core |
| Combat Arena | eigene Runtime-Semantik |

Dieses Projekt vergibt kein L5. Ein Bild im Atlas und ein statischer Build sind keine
Travel-Abnahme.

## Rollback

Dieses Paket **ist** der Originalexport. `source/` ist eine Bytekopie des Projektstands zum
Exportzeitpunkt, prüfbar über `../CHECKSUMS.sha256`. Ein Rollback bedeutet: `source/` erneut
auspacken und nichts anderes übernehmen.
