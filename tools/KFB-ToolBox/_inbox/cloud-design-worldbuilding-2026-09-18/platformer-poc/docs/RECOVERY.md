# Recovery — wenn etwas nicht lädt

## Schwarzes Bild, Kopfband da, „Loading the island" bleibt stehen

Konsole öffnen. Die wahrscheinlichen drei:

1. **Netz / GitHub raw nicht erreichbar.** Alle Modelle sind SourceRefs; ohne Netz gibt es
   keine Insel. Das Ladeprotokoll steht im Motion Lab unter *Sources loaded*.
2. **Ein Pin zeigt ins Leere.** `data/actors.json → pins` und `data/pack-index.json → commit`.
   404 heißt: der Pfad existiert an diesem Commit nicht (nicht: die Datei fehlt im Repo).
3. **Modul über `raw` geladen.** raw liefert JS als `text/plain`; als Modul ergibt das einen
   schwarzen Bildschirm. Die Leser aus `kfb-rigs-embed-v3` müssen über **jsDelivr** kommen —
   `src/sources.js → EMBED_BASE`. Daten (Modelle, Verträge) über raw, Module über jsDelivr.

## Ein Aktor lässt sich nicht laden

Die Ladeanzeige nennt den Fehler und kehrt nach ~2 s zurück; der bisherige Aktor bleibt stehen.
Der Referenz-Aktor **Platformer Character** hängt an keiner externen KFB-Quelle — wenn der
nicht lädt, ist es das Netz oder der Pack-Pin, nicht der Adapter.

## Pack-Pfadindex neu erzeugen

`data/pack-index.json` ist kein Handarbeitsprodukt. Rezept:

1. Registry-Shard lesen: `registry/assets/v1/packs/platformer-game-kit-dec-2021.json`.
2. Je Asset mit `format: "gltf"` den Pfad relativ zu
   `media/3D_Assets/Platformer Game Kit - Dec 2021/` eintragen, Schlüssel ist `name`.
3. Bei doppelten Namen gewinnt `Modular Platforms/` vor `Cubes/` vor der Wurzel;
   `Character`/`Character_Gun` werden fest auf `Character/glTF/` gesetzt (die Wurzelkopie ist
   dieselbe Datei).
4. `commit` ist die `source.commit` aus dem Shard.

## Level kaputt / Figur fällt sofort

`data/level.json` ist in **Zellen** bemessen. Wer dort Weltmaße einträgt, baut eine Insel mit
doppelter Kantenlänge und Lücken, die kein Sprung schafft. Die Zellkante wird zur Laufzeit an
`Cube_Grass_Center` gemessen und steht im Motion Lab (*Cell size (measured)*).

## Gespeicherten Zustand zurücksetzen

Namensraum `kfb.free-roam.platformer-poc.v0`. In der Konsole:

```js
Object.keys(localStorage).filter(k => k.startsWith('kfb.free-roam.platformer-poc.v0'))
  .forEach(k => localStorage.removeItem(k));
```

Niemals `localStorage.clear()` — daneben liegen Stände anderer KFB-Anwendungen.

## Laufzeit befragen

`window.KFB_POC` gibt `world`, `player`, `rig`, `state`, `loadLog`, `candidates`, `arcPoints`
her. Beispiele in `tests/probe.js`.
