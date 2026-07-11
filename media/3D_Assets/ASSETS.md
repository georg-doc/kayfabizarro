# ASSETS — 3D-Props für den KFB-Tisch (optimiert)

**Stand 2026-07-10.** CC0/CC-BY-GLBs (Poly-Pizza-Herkunft), Texturen gestrippt + gepruned → web-ready. **Roh** in `3D Assets/`, **optimiert** in `3D Assets/optimized/` (die hier nutzen). Alle GLB, direkt per `GLTFLoader` ladbar.

## Cel-Reskin-Pipeline (WICHTIG — nicht roh nutzen)

Die Original-Materialien/Texturen sind gestrippt; das ist Absicht. Jeder Prop wird in die KFB-DNA gebracht:

1. GLB laden (`GLTFLoader`).
2. Original-Material ersetzen durch **`MeshToonMaterial` + quantisierte `gradientMap`** (NearestFilter → harte Cel-Bänder).
3. **Inverted-Hull-Tusche-Outline** (Linienbreite fällt mit Distanz).
4. Wo Fläche gebraucht: **Papier/Karton/Aquarell-Textur** drauf (handgemacht, wonky).
5. Story-Mode-Farbe tintet über die eine `mood()`-Quelle (Rim-Light in Mode-Ink).

→ Damit wird aus jeder Fremd-Geometrie ein KFB-Cel-Objekt. Casino-Politur vermeiden (Prime Directive §10 des Handovers).

## Die Props (optimiert, ihre Rolle)

| Datei (`optimized/`) | Größe | Rolle im Tisch |
|---|---|---|
| `quaternius_cc0-table-1411.glb` | 65 KB | **Tisch-Basis** (Schneidematte drauf legen). |
| `arunangshubanerjee-dice-4550.glb` | 48 KB | **Story-Mode-D6** (gerollt → Mood-Wash). |
| `plaggy_cc0-scissors-590.glb` · `…yellow-scissors…` · `tilixia-summer-scissors…` | 47–102 KB | **Scheren** = die wörtliche Cut-and-Play-Geste am Tischrand. |
| `pixellabs-knife-3728.glb` | 988 KB | **Cutter/Messer** = Schneidewerkzeug (Requisit). |
| `pixellabs-stairs-3764.glb` | 1,0 MB | **Quest-Progress-Leiter.** Marker klettert 1→6. Positionen: 6 gleichverteilte Punkte entlang der Treppen-Diagonale (aus der Bounding-Box beim Laden berechnen), Marker auf Stufenhöhe skalieren. Bei 6 = Finale. |
| `pixellabs-poison-bottle-3548.glb` | 1,1 MB | **Tusche-Fläschchen** (Poison/Totenkopf = Mood-Prop) + Träger fürs **Ink/Outline-View-Toggle**. |
| `quaternius_cc0-bald-rabbit-1274.glb` | 753 KB | **FrizzleBob-Platzhalter** (Hase). Später der Erzähler/King-Avatar. |
| `jerryblessed-book-4923.glb` | 5 KB | **Regelbuch / FSQ** (diegetisches Requisit, §Wand). |
| `pixellabs-dead-tree-3551.glb` | 1,1 MB | Atmosphäre/Mood (optional). |

Zusammen ~5 MB. **Hosting:** wie die Decks — nach `media/kfb/models/` auf GitHub, per URL referenziert (CORS `*`, Pages/raw). 

## Lizenz

`quaternius_cc0-*` = CC0 (frei). Die anderen (pixellabs, plaggy, tilixia, arunangshubanerjee) auf **CC-BY** prüfen → ggf. Attribution nötig.

## Card-Kit (`3D Assets/3D Card Kit - Fantasy [Standard]/`)

Begrenzt nützlich: ~30 **Fantasy**-Karten als glTF/OBJ/FBX + Renders + CardBack. Die Kunst ist Fantasy, NICHT KFB — nicht verwenden (unsere Karten-Art kommt aus dem PDF). Höchstens: die **Karten-Rahmen-/Bevel-Geometrie** als Referenz für ein 3D-Kartenobjekt (mit unseren PDF-Crops neu texturiert), und der **CardBack** als Referenz für §11.3 (Back-Textur). Eine Karte ist aber ein abgeschrägter Quad — trivial selbst gebaut. Nicht groß reininvestieren.

## Backlog (optional, NICHT jetzt)

Die schweren Kulissen-Modelle (`optimized/`: `…fantasy` 21,8 MB, `…house` 14,7 MB, `…castle` ×2 ~13 MB, `…pirate-ship` 12 MB, `…packaging`/`…paper-bag` ~12 MB) blieben groß, weil sie **hochpoly** sind (Textur-Strip half nicht). Sie sind Kulissen, keine Tisch-Props → für Phase 1 nicht gebraucht. Falls eins davon (z. B. Papiertüte für Karton-DNA) rein soll: **Geometrie-Dezimierung (Simplify-Pass, meshoptimizer)** — auf Anfrage.
