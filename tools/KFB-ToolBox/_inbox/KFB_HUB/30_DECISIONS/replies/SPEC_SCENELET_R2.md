# SPEC · `kfb.scenelet/1` · R2 · 2026-10-19 · WS0
**Register:** V-548, V-550, V-555, V-557, V-558, V-559. **Ersetzt:** `SPEC_SCENELET_R1_DRAFT.md` (bleibt als Verlauf).
**Eingearbeitet:** alle 24 Anmerkungen von WSB (`50_BLENDER/V548_SCENELET/ANMERKUNGEN_WSB_SPEC_SCENELET_R1.md`), die Lieferungen B44 Fluff-Farm, B46 Bleistift/Radiergummi und Ork-Band r1 sowie die Besetzungsliste (V-559).
**Status:** gültig für neue Lieferungen. Bestand R1 (B44, B46, Ork-Band) bleibt lesbar; der Lader füllt fehlende Felder mit den Vorgaben unten auf.

**Tier 0**
1. Ein Format für alles: Vignette, Ensemble/Band, Kampf, Duell, Tanz, Diorama. Bühne, World Builder und Spiel lesen dieselbe Datei.
2. Assets nur als Verweis mit sha256 über die **Original-GLB**, nie eingebettet. Privates nur in privaten Ablagen (V-538).
3. Darsteller kommen aus **einer** Besetzungsliste (`cast`); Scenelets verweisen nur auf Darsteller-ID + Rolle (V-559).

---

## 1 · Kopf
```jsonc
{
  "schema": "kfb.scenelet/1", "rev": 2,
  "id": "fluff_farm_01", "title": "KayKit Fluff-Farm",
  "kind": "vignette | ensemble | fight | duel | dance | diorama",
  "version": 1, "status": "draft | review | pass",
  "source": { "from": "wsb-b44 | resident-atlas-s17 | manual", "ref": "50_BLENDER/B44", "decision": "V-549", "converter": "ra2scenelet@0.2" },
  "units": "u", "m_per_u": 0.616381042,     // (1) "u" = KayKit-Rig-Einheit; "m" erlaubt
  "space": "gltf",                          // (2) Pflicht; Altbestand B39: "blender_zup"
  "up": "y", "forward": "+z",
  "clock": { "fps": 30 }                    // (23) Vorgabe 30; alle Zeiten in Sekunden, Bilder nur wo „_f“ im Feldnamen steht
}
```
- **(1) Einheiten:** `units` ist `"u"` (Vorgabe für WSB-Lieferungen) oder `"m"`. Bei `"u"` ist `m_per_u` Pflicht. Alle Längenfelder einer Datei haben dieselbe Einheit; Felder mit Suffix `_u` bzw. `_m` sind ausdrücklich und werden nicht umgerechnet.
- **(2) Achsen:** `space` ist Pflicht im Kopf und in jedem eigenständigen Zeitplan- bzw. Anker-Block, der aus einer anderen Quelle stammt. Der Lader rechnet `"blender_zup"` nach glTF um (x, z, −y).

## 2 · Assets
```jsonc
"assets": {
  "pencil": {
    "ref": "dropbox:50_BLENDER/B46/props/KFB_Prop_Pencil.r1.glb",
    "b64": "scenelet/pencil.glb.b64.txt",   // Lieferform für Artifacts (+33 %)
    "sha256": "8e3934d6…",                  // (22) über die Original-GLB
    "bytes": 412345, "private": false,
    "license": "CC0 1.0", "credit": null,   // (19) CC-BY: credit Pflicht, Bühne und Hub zeigen ihn
    "preview": false,                       // (20) true = Nur-Vorschau, nie als Spiel-Asset übernehmen
    "rig": "Rig_Medium | Rig_Large | Rig_Legacy | KFB_Squash | none"
  }
}
```
- **(20) Vorschau-Dateien:** `*.preview.glb`, `*_hoverNN.preview.glb`, `*.liegend.preview.glb`, `KFB_CraterPreview_*` haben immer `preview: true`. Lader und Konverter lehnen `preview: true` außerhalb der Bühne ab.
- **(22) Größe:** Private Base64 nur in private Artifacts. Für Einzel-Assets ab 2 MB liefert WSB zusätzlich eine Draco-Fassung, wenn die Gates danach gleich bleiben.

## 3 · Besetzung (`cast`, neu, V-559)
Eine globale Liste unter `KFB_HUB/60_CAST/cast.r1.json`. Darsteller werden **einmal** optimiert (Augen, Lider, Clay, Rig, Clip-Satz, Karte) und dann in vielen Szenen besetzt.
```jsonc
// 60_CAST/cast.r1.json
{ "schema": "kfb.cast/1",
  "actors": {
    "skeleton_warrior": { "asset": "manifest:kaykit/skeletons/Skeleton_Warrior@…", "card": "…/skeleton_warrior.figure.json",
                          "clips": ["Idle_A","kfb_skeleton_dance_a","kfb_melee_chop"], "license": "CC0", "private": false },
    "monstrosity":      { "asset": "…", "card": "…", "clips": ["…"], "private": true } } }
```
Im Scenelet:
```jsonc
"actors": [
  { "id": "skel_1", "cast": "skeleton_warrior", "role": "dancer", "faction": null, "variant": { "seed": 3, "palette": null },
    "p": [0,0,0], "ry": 0, "s": 1, "clip": "kfb_skeleton_dance_a", "loop": true, "phase": 0.25 }
]
```
- `cast` ersetzt `asset` + `card`, wenn ein Darsteller aus der Liste kommt. Lokale Darsteller (nur in dieser Szene) gehen weiter über `assets` + `card`.
- **Mehrfachauftritt:** dieselbe `cast`-ID mehrfach, Unterschiede über `variant.seed` (Phase, kleine Pose- bzw. Farbvarianz) und `variant.palette`.
- **Rolle und Fraktion:** `role` ist frei (lead, dancer, guard, trash_mob, …). `faction` ist `"allianz" | "horde" | null` (V-558), die Zuordnung je Figur steht in der Fraktions-Tabelle im Cast, nicht in jeder Szene.
- **Besetzungstabelle** (Ansicht): Figur → Szenen → Rolle, Clips, Requisiten. Die Bühne erzeugt sie aus allen Scenelets.

## 4 · Darsteller-Felder
```jsonc
{
  "id": "trumpeter", "cast": "orc_legacy_a", "role": "musician",
  "p": [1.2,0,0.4], "ry": -20, "s": 1,
  "card": null,                                 // nur ohne cast; Augen-Sitz steht in der Karte: eyeRig.seat = "cap" | "center" (5)
  "clip": "trumpet_groove", "loop": true, "phase": 0,
  "palette": { "set": "role-variants/1", "entry": "throne_gold" },     // (16) Überschreibung je Darsteller bzw. Requisite
  "attachments": [{
    "id": "trumpet", "asset": "trumpet",
    "figure_socket": "KFB_Grip", "prop_socket": "KFB_Grip",          // (6) zweiteilig
    "bone": "hand.r",                                                  // (6) lowerarm.r für Läufe (Blaster), hand.r für Wurfkörper und Instrumente
    "axis": "forearm",                                                 // V-536
    "p": [0,0,0], "q": [0,0,0,1]
  }],
  "corrections": { "mode": "baked", "bones": { "upperarm.r": { "window_f": [62,70], "ramp_f": 6, "deg_local": [0,0,24] } } },  // (15)
  "stretch": { "bone": "upperarm.l", "max": 2.27, "in_f": 5, "out_f": 5, "overshoot": 0.08 }    // V-555 Gummiarm, nur Rig_Legacy
}
```
- **(5) Anker-Aliase** (der Lader liest alle, schreibt nur kanonisch):

| kanonisch | Aliase |
|---|---|
| `KFB_Grip`, `KFB_Muzzle`, `KFB_Tip`, `KFB_Mic_Head`, `KFB_Mouthpiece`, `KFB_Bell` | `socket_grip`, `socket_muzzle`, … |
| `KFB_Entry`, `KFB_Seat_Rig_Medium`, `KFB_Hover_FL/FR/BL/BR` | `kfb_entry`, `kfb_seat_rig_medium`, `kfb_hover_FL…` |
| `KFB_Eye_L/R/C_anchor` (Sitz center) | `eye_anchor.l/r` (Sitz cap) |

- **(6) Elternknochen:** Läufe (Blaster, Gewehr, Trichter) an `lowerarm.*`, damit die Mündung auf der Unterarmachse bleibt, auch wenn das Handgelenk knickt. Wurfkörper, Instrumente und Werkzeuge an `hand.*`.
- **(15) Korrekturen:** `mode: "baked"` (Vorgabe, WSB backt in den Clip; das Feld ist dann nur Nachweis) oder `"runtime"` (Laufzeit wendet an). Fenster in Bildern (`window_f`, `ramp_f`), Achse lokal am Knochen.
- **(17) Schattierungs-Textur:** Bei Rollen-Materialien setzt die Bühne `baseColorFactor` und lässt eine vorhandene Graustufen-`baseColorTexture` stehen (Rollenfarbe × Textur).
- **Mehrere Darsteller mit gemischten Augen-Sitzen** in einer Datei muss die Bühne ab R2 können (je Darsteller eigene Karte).

## 5 · Requisiten
```jsonc
"props": [{ "id": "bomb_1", "asset": "fluff_bomb", "p": [1,0,0], "ry": 30, "s": 1,
            "role": "story | scatter | stage", "group": "nest_a",
            "pose": "ground | float",                  // (21) Fundstück-Pose (V-437)
            "palette": { "set": "fluff/1", "entry": "fluff_0" } }]   // (16)
```

## 6 · Clips und Marken
- **(3) Marken-Ort:** im GLB unter `animations[i].extras.kfb.markers = { "release": 0.62, … }`, Sekunden ab Clipbeginn. WSB schreibt sie beim Anhängen der Clips (b31_addclips). Sidecar-JSONs (B40, B41) werden einmalig übernommen und bleiben als Nachweis.
- **(4) Rig-übergreifend:** Marken gelten pro Clip-Name. Abweichungen optional als `extras.kfb.markers_by_rig = { "Rig_Large": { "release": 0.70 } }`.
- **(24) Clip-IDs:** KayKit- und Mixamo-Originalnamen bleiben im GLB (`Throw`, `Hit_A`, `Idle_A`, `Sit_Chair_Idle`). `kfb_*`-IDs sind Aliase im Clip-Katalog `60_CAST/clips.r1.json` (`{ "kfb_throw_overhand": ["Throw","kfb_throw_throwing"] }`). Scenelets dürfen beide Namen verwenden; der Lader löst über den Katalog auf.

## 7 · Zeitleiste
```jsonc
"timeline": {
  "clock": { "bpm": 100, "phase": 0.465, "length": 8.0 },      // fps aus dem Kopf
  "tracks": [
    { "type": "keys",       "target": "giftbox", "prop": "scale", "ease": "outBack", "keys": [[0,0],[0.4,1.1],[0.6,1]] },
    { "type": "path",       "target": "projectile_1", "kind": "arc",                  // (8)
      "from": [0,1.2,0], "to": [6,0,0], "time_s": 0.9, "arc_apex_above_line_u": 1.4, "spin_deg_s": 540, "wobble": 0.1 },
    { "type": "squash",     "target": "throne", "squash_pct": 18, "duration_s": 0.35,  // (10)
      "overshoot": { "cycles": 2, "damping": 0.55 }, "pivot": "KFB_Pivot" },
    { "type": "procedural", "target": "throne", "node": "KFB_Pivot", "kind": "bob | spin | sway",   // (11)
      "bob_amp_u": 0.05, "bob_period_s": 2.4, "spin_deg_s": 0, "phase_random": true },
    { "type": "height",     "target": "wall_e_3_4_N", "keys": [[0,3.6],[1.2,0]] }     // B47 Umbau
  ],
  "cues": [
    { "t": 1.2, "actor": "soldier_a", "clip": "kfb_action_present_arms_a" },
    { "marker": "release", "actor": "thrower", "detach": "bomb_r", "spawn": "projectile_1" },      // (7)
    { "t": 2.0, "actor": "pickup_bot", "grab": "loot_1", "to": "hand.r" },                          // (7)
    { "t": 2.0, "marker": "impact", "hitstop_f": 3 },                                               // (12) Bilder bei clock.fps
    { "t": 2.4, "actor": "dodger", "root_offset": [0.6,0,0], "at_s": 2.4 },                          // (9) nie still zurückschnappen
    { "t": 3.0, "actor": "kaeptn", "eyes": "rest | half | closed" }                                  // (13)
  ],
  "script": null,                                              // Duell: [{ "s": "A", "o": "hit|miss|dodge" }]
  "vehicle": { "format": "kfb.vehicle-enter-exit/1", "ref": "50_BLENDER/B39/…", "space": "blender_zup" }   // (14)
}
```
- **(14) Ein- und Aussteigen:** `kfb.vehicle-enter-exit/1` bleibt eigenes Unterformat und wird als Verweis eingebunden; Phasen in Bildern, `hidden` / `visible_from` gelten wie dort.

## 8 · Welt
```jsonc
"world": {
  "anchor": [0,0,0], "footprint": { "shape": "circle", "r_u": 6.5 },
  "entrances": [{ "id": "front", "p": [0,0,6], "forward": [0,0,1] }],
  "seats": [{ "id": "seat_empty_1", "p": [2,0,1], "ry": 200 }, { "id": "seat_large_1", "p": [-2,0,1], "ry": 160 }],   // B48
  "stamps": [{ "heightmap": "B41/crater_a.png", "encoding": "16bit, 0.5 = 0", "scale_u": 0.6, "extent_u": 3, "fade": { "from": 1, "to": 0, "s": 6 } }],  // (18)
  "decals": [{ "image": "B41/scorch_a.png", "diameter_u": 2.2, "fade_s": 8 }],                                                                           // (18)
  "loot_origin": "KFB_Loot_Origin",
  "placement": "grammar-r2", "tags": ["farm","cozy"],
  "terrain": { "biome": "meadow", "palette": { "set": "island-palettes/1", "entry": "biom_02_Meadow" } },
  "sky": "skydome:day_soft", "light": { "rig": "kfb-stage-light.v1.1", "mood": "MOODS_MESA", "tod": "day" }
}
```
- Georgs Regel für die Bühne: immer mit Gelände, Himmel, Licht und Texturen. Die neutrale Hohlkehle gibt es nur als Option.

## 9 · Kameras, Audio, Abnahme
- `cameras[]`: `preset` threeq | front | side | top | near_face | custom (`pos`, `target`, `fov`).
- `audio`: nur Set-ID + ID + Gain (z. B. `{ "set": "farm_r1", "id": "F01_farm_morning_atmos_a", "gain": -12 }`); Melodie über Leitmotiv bzw. Skala aus dem Fluff-o-lect (V-508).
- `review`: `{ "hub": "q123", "gates": ["G1","G2","G3","G5","G6"], "qa": ["a","b","c","d","e","f","g","h"] }`.

## 10 · QA-Liste (V-520, Stand R2)
(a) Löcher · (b) Normalen/UV · (c) Augen-Zustände inkl. Lidfarbe = gemessene Haut · (d) Platzierung, 0 Durchdringung · (e) Georgs Vorgabe wörtlich · (f) ein Look · **(g) Material folgt Flächen, nicht Dreiecken** · **(h) Werkzeug bzw. Instrument wird wirklich benutzt (Mund, Hand, Fell; Nahbild je Schlag)**. Prüfbögen von Darstellern mit Werkzeug zeigen eine Spiel- bzw. Arbeits-Pose, nicht die T-Pose.

## 11 · Konverter RA → Scenelet
Wie R1 §3. Neu: Der Konverter schreibt `units: "u"` mit `m_per_u`, `space: "gltf"`, löst RA-Darsteller über `cast` auf (statt Kopien) und setzt Kamera-Presets.

## 12 · Rückwärts-Verträglichkeit
- R1-Dateien ohne `rev` gelten als R1. Vorgaben: `units "m"`, `space "gltf"`, `clock.fps 30`, `corrections.mode "baked"`, `attachments.socket` → `figure_socket` + `prop_socket` mit demselben Namen.
- B44, B46 und Ork-Band r1 haben schon `units "u"` + `space`; sie laufen ohne Änderung.
