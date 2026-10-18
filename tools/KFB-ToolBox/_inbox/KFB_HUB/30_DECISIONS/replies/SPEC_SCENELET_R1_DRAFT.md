# SPEC · `kfb.scenelet/1` · Bühne/Scenelets · R1-Entwurf · 2026-10-19 · WS0
**Register:** V-548. **Status:** Entwurf, Pilot: Spielzeugsoldat mit Gewehr, dann Pirateninsel.
**Quellen:** Resident Atlas S17 (`tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/`); dort gibt es heute je Szene ein eigenes Schema (cast.js, band-module, fight, duel, disco). Vorschläge `kfb.resident-set/0.1`, `kfb.resident-stage/0.1` und `kfb-worldbuilder-scene` v1. WSB-Zeitpläne `kfb.vehicle-enter-exit/1`, Platzierungs-Grammatik R2, Prüfstand v1.2.x.

**Tier 0**
1. Ein Format für alles: Bewohner-Vignette, Band, Kampf, Duell, Disco, Diorama. Der World Builder liest dieselbe Datei.
2. Assets nur als Verweis (Manifest-ID oder Pfad + sha256), nie eingebettet. Private Assets nur in privaten Ablagen (V-538).
3. Klang, Melodie, Farben: nur Auswahl aus vorhandenen Sets bzw. Paletten (KISS). Kein Editor im Scenelet.

## 1 · Datei
```jsonc
{
  "schema": "kfb.scenelet/1",
  "id": "toy_soldier_parade_01",            // eindeutig, snake_case
  "title": "Spielzeugsoldat · Parade mit Gewehr",
  "kind": "vignette | ensemble | fight | duel | dance | diorama",
  "version": 1, "status": "draft | review | pass",
  "source": { "from": "resident-atlas-s17 | wsb-bNN | manual", "ref": "data/cast.js#toy-soldier", "converter": "ra2scenelet@0.1" },
  "units": "m", "up": "y", "forward": "+z",

  "assets": {                               // Verweise, kein Inhalt
    "toy_soldier": { "ref": "manifest:kaykit/toy_soldier@891eadf0", "sha256": "…", "private": false, "rig": "Rig_Medium" },
    "rifle":       { "ref": "dropbox:50_BLENDER/B11/…/rifle.glb", "sha256": "…", "private": true }
  },

  "actors": [{                              // alles mit Rig bzw. Clips
    "id": "soldier_a", "asset": "toy_soldier", "role": "lead",
    "p": [0,0,0], "ry": 0, "s": 1,
    "card": "B11/data/toy_soldier.figure.json",   // Augen, Lider, Mund, Clay (Prüfstand)
    "clip": "kfb_locomotion_march_rifle_a", "loop": true, "phase": 0,
    "attachments": [{ "id": "rifle_r", "asset": "rifle", "socket": "KFB_Grip", "bone": "hand.r",
                      "p": [0,0,0], "q": [0,0,0,1], "axis": "forearm" }],   // V-536
    "corrections": { "bones": { "upperarm.r": { "window": [0.4,0.9], "deg": [0,0,-24] } } },
    "audio": { "signature": [{ "on": "step", "sfx": "interactions_r1/I09_toy_step" }],
               "melody": { "leitmotif": "toy_soldier", "scale": "march_major", "instrument": "snare_fife" } }
  }],

  "props": [{ "id": "giftbox", "asset": "gift_box", "p": [1,0,0], "ry": 30, "s": 1, "role": "story | scatter | stage", "group": "nest_a" }],

  "timeline": {                             // optional; Band, Kampf, Reveal, Ein-/Aussteigen
    "clock": { "bpm": null, "fps": 30, "length": 4.0 },
    "tracks": [{ "target": "giftbox", "prop": "scale", "ease": "outBack", "keys": [[0,0],[0.4,1.1],[0.6,1]] }],
    "cues":   [{ "t": 1.2, "actor": "soldier_a", "clip": "kfb_action_present_arms_a" },
               { "t": 2.0, "marker": "impact", "hitstop": 3 }],
    "script": null                          // Duell: [{ "s": "A", "o": "hit|miss|dodge" }]
  },

  "cameras": [{ "id": "hero", "preset": "threeq | front | side | top | near_face | custom", "pos": [..], "target": [..], "fov": 35 }],
  "light":   { "rig": "kfb-stage-light.v1.1", "mood": "MOODS_MESA", "tod": "day" },
  "palette": { "set": "island-palettes/1", "entry": "biom_05_PirateCave" },

  "audio": {                                // KISS: nur Verweise auf vorhandene Sets
    "ambience": [{ "set": "atmos_dioramas_r1", "id": "A03_beach_waves", "gain": -12 }],
    "music": null
  },

  "world": {                                // für World Builder / God Mode
    "anchor": [0,0,0], "footprint": { "shape": "circle", "r": 4.0 },
    "bounds": [[-4,0,-4],[4,3,4]], "entrances": [{ "id": "front", "p": [0,0,4], "forward": [0,0,1] }],
    "placement": "grammar-r2", "tags": ["toy", "military", "parade"]
  },

  "review": { "hub": "q-…", "gates": ["G1","G2","G3","G5","G6"], "axisLines": true }
}
```

## 2 · Regeln
- **Transform:** `p` in Metern, `ry` in Grad um +Y, `s` gleichmäßig. Bei Bedarf `q` statt `ry`.
- **Clips:** Namen nach Motion-Library-IDs (`kfb_*`). Quellclip in `extras` bzw. `source`. Marken (`fire`, `release`, `impact` …) kommen aus dem GLB (`extras.kfb.markers`) und werden nicht dupliziert.
- **Anker:** kanonisch `KFB_*`, Aliase `socket_*` lesen (V-541). Waffen und Werkzeuge mit `axis: "forearm"` (V-536).
- **Boden:** Liege-Clips mit Boden-Klemme (V-541), Schweben nur, wo es die Karte sagt.
- **Licht:** nur das eine Rig (V-385), keine Extra-Lichter im Scenelet.
- **Audio/Melodie:** nur Set-ID + ID + Gain; Melodie über Leitmotiv bzw. Skala aus dem Fluff-o-lect (V-508).
- **Lebenszyklus**, wenn ein Scenelet Code braucht (Band, Duell): `mount(host, anchor, opts) · update(dt, clock) · bounds() · snapshot() · dispose()`, so wie im RA-Vorschlag.

## 3 · Konverter Resident Atlas → Scenelet (WSA)
| RA-Quelle | Scenelet |
|---|---|
| `cast.js` `RESIDENTS[]` (actor, habitat, signatureProps, reveal) | `kind: vignette`; actor → actors[0]; habitat/signatureProps → props bzw. attachments; reveal.tracks → timeline.tracks |
| `studio-seeds.js` (nodes/bones) | actors[].attachments p/q bzw. corrections.bones |
| `resident-band-module-01.json` | `kind: ensemble`; song.bpm → timeline.clock.bpm; actors{…} → actors[] mit attachments; actions → cues |
| `fight-sandbox-02.json` | `kind: fight`; clips → Motion-IDs; ring → props (stage) |
| `gunfight-duel-01.json` | `kind: duel`; fighters → actors; scripts → timeline.script |
| `resident-disco-01.json` | `kind: dance`; cast → actors; cues → timeline.cues |
| WSB-Dioramen (B32–B43) | `kind: diorama`; GLB als ein Asset + `world` aus Bühnen-Daten (entrances) |

## 4 · Bühne (Artifact, WS0)
- **Basis Prüfstand v1.2.x:** Licht, Clay, Augen, Gates; dazu Zeitleiste, mehrere Darsteller und Achsenlinien.
- **Abnahme im Artifact:** PASS/TUNE/Kommentar-Pin je Scenelet → Hub-Eintrag.
- **Editor:** Vorbild RA `edit-layer.js` (TransformControls, Snap grid/connector/mount, Undo); speichert ins Scenelet, nicht in den localStorage.
- **Design:** RA-Papier-Tokens (ink #1f2022, panel #efece6, surface #f6f4ef, line #c9c5bc, Space Grotesk + IBM Plex Mono), als CSS-Variablen. Ein Dark-Theme gibt es im RA nicht, das wird neu abgeleitet.

## 5 · Offen
- Ninja-Schwertkampf und Wrestling-Ring mit Gummiseilen gibt es im RA noch nicht; das werden neue Scenelets.
- Kameras sind im RA nur im Code; der Konverter setzt Presets.
- Asset-Manifest-IDs: Vorschlag `manifest:<pack>/<name>@<commit>` bzw. `dropbox:<pfad>` für private Assets.
