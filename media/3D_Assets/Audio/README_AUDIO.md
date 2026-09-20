# README — Audio-FX (media/3D_Assets/Audio/)

**Dieser Ordner ist nicht leer. Hier liegen 1006 nutzbare CC0-Sounds.**
Wenn ein Tool oder Chat „der Audio-Ordner ist leer" meldet, ist das ein Tooling-Irrtum oder ein Pfad-Fehler — nicht die Wahrheit. Diese Datei erklärt, warum das passiert und wie man es richtig macht.

## Bestand (Stand 2026-09-02)
606 `.ogg` + 400 `.wav` = **1006 Sounds**, aufgeteilt:

| Pack | Sounds |
|---|---|
| 400 Sounds Pack | 400 |
| kenney_impact-sounds | 130 |
| kenney_interface-sounds | 100 |
| kenney_music-jingles | 86 |
| kenney_sci-fi-sounds | 73 |
| kenney_digital-audio | 63 |
| kenney_casino-audio | 55 |
| kenney_rpg-audio | 52 |
| kenney_voiceover-pack-fighter | 47 |

Lizenz: Kenney-Packs sind CC0 (frei, auch kommerziell, ohne Nennungspflicht); das „400 Sounds Pack" bringt seine eigene Lizenz mit (liegt im Pack-Ordner). Alles frei verwendbar.

## Warum Tools trotzdem „leer" sagen — zwei Fallen

**Falle 1 — GitHub zeigt den Ordner nicht.** Die Ordner-Ansicht auf github.com ist JavaScript-gerendert. Ein einfacher Seiten-Fetch (oder ein Screenshot ohne echtes Laden) sieht nur eine leere Hülle. Zusätzlich bricht die rekursive Git-Tree-API (`git/trees/main?recursive=1`) bei großen Repos ab (`truncated:true`) und lässt ganze Ordner still wegfallen. **Beides heißt nicht, dass Dateien fehlen — das Werkzeug sieht sie nur nicht.**

**Falle 2 — der Pfad ist um eine Ebene zu kurz.** Die Sounds liegen **verschachtelt**: `<pack>/Audio/<datei>`, Jingles sogar `<pack>/Audio/<gruppe>/<datei>`. Beispiel:

```
media/3D_Assets/Audio/kenney_casino-audio/Audio/card-place-1.ogg
media/3D_Assets/Audio/kenney_music-jingles/Audio/Steel jingles/jingles_STEEL05.ogg
```

Wer den Pfad ohne das `/Audio/`-Segment bildet (`…/kenney_casino-audio/card-place-1.ogg`), bekommt 404 → „nicht da". Genau dieser Fehler steckte bis 2026-09-02 in `sfx.json` und `jukebox.json` — jetzt korrigiert, alle Pfade gegen die echten Dateien aufgelöst.

## So findet und nutzt man die Sounds richtig

**Das Manifest ist die Wahrheit, nicht die Ordner-Ansicht.**
- `media/3D_Assets/Audio/sfx.json` — 13 Spiel-Events → Datei (card, land, step, roll, jump, boost, coin, hit, ui, confirm, error, win, gutterFall). Verbraucht von `travel-audio.js` via `sfx('event')`.
- `media/3D_Assets/Audio/jukebox.json` — Musik-Bett (Tracks).

**Direkt abspielen / prüfen per raw-URL** (Bytes, CORS offen, kein Rate-Limit-Problem):
```
https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/<pfad>
```
Pfad **url-encoden** — die Ordner enthalten Leerzeichen (`Steel jingles`, `400 Sounds Pack`).

**Listen, wenn nötig:** nicht den Gesamt-Repo-Tree holen (trunkiert), sondern den `Audio`-Subtree gezielt über seine Tree-SHA (`git/trees/<sha>?recursive=1`). Oder direkt die Asset Library (`KFB_AssetLibrary_v1`) öffnen und den Filter „Audio" wählen — die zeigt alle live.

## Merksatz
> Der Audio-Ordner ist nie leer — das Tool sieht ihn nur nicht. **Manifest lesen oder raw-URL bauen, und das `/Audio/`-Segment nicht vergessen.**

## Generated KFB Racer engine candidates · 2026-09-20

The historical **1006-sound CC0 inventory above is a separate pack count** and does not include the newer generated Racer candidates.

Current generated engine-audio source:

- `media/3D_Assets/Audio/KFB Racer/`
- pack guide: `media/3D_Assets/Audio/KFB Racer/README_KFB_RACER_ENGINE_AUDIO.md`
- WSA handoff: `skills/chat/workflows/KFB_RACER_ENGINE_AUDIO_PACK_2026-09-20/START_HERE.md`

These V8 / Steampunk files are generated KFB candidates with their own provenance/status. **Do not classify them as Kenney/CC0 merely because they live under the common Audio root.** The preferred human-reviewed V8 idle donor and the candidate/runtime boundary are recorded in the pack guide and manifest.
