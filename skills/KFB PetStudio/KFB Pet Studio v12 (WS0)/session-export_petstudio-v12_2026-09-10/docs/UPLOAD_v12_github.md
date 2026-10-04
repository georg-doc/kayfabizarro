# Upload-Liste · Pet Studio v12 → GitHub (10.09.2026)

Ziel-Wurzel im Repo `georg-doc/kayfabizarro`: **`media/3D_Assets/build/`**.
Danach ist der Standalone eine EINZIGE Zeile weit von der Unabhängigkeit entfernt — der Anker
`window.__KFB_MODBASE` in `export/src/KFB Pet Studio v12 standalone-src.dc.html` zeigt dann auf
`https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/` statt auf die Projekt-Adresse.

## ⚠ Die Ordnerstruktur ist NICHT frei wählbar

Drei Verweise sind relativ und brechen still, wenn die Ebenen nicht stimmen:

* `pet-moustache.v1.js` und `brow-rig.v2.js` rufen **`../kfb-ink-canon.js`** → die Feder liegt EINE Ebene ÜBER `studio-v12/`.
* `pet-moustache.v1.js` ruft **`./brow-rig.v2.js`** → beide im gleichen Ordner (die Dick-Dünn-Kennlinie hat einen Eigentümer).
* `frizzlebob.v4a.js` sucht **`../assets/models/FrizzleBob_Yellow*.gltf`** → `assets/models/` ist Geschwister von `studio-v12/`.

```
media/3D_Assets/build/
  kfb-ink-canon.js
  studio-v12/   ← sieben Module + zwei Rückwege
  assets/models/   ← die zwei gelben Hasen
```

## Die Dateien

| Zielpfad unter `build/` | Größe | Warum |
|---|---|---|
| `studio-v12/brow-rig.v2.js` | 11.7 kB | Braue: Kurve + Maske + Kopfrundung + dreifache Dicke. Importiert `../kfb-ink-canon.js`. |
| `studio-v12/pet-nose.v2.js` | 6.9 kB | Knollen-Nase (Superellipsoid). Keine Importe. |
| `studio-v12/pet-moustache.v1.js` | 13.2 kB | Schnurrbart, acht Formen. Importiert `../kfb-ink-canon.js` UND `./brow-rig.v2.js` — beide müssen mit. |
| `studio-v12/weapon-mods.v1.js` | 11.7 kB | Kenney-Blaster als Waffen-Mods. Keine Importe; lädt GLB direkt aus dem Repo. |
| `studio-v12/pet-eye-rig.v6.js` | 20.3 kB | Augen-Rig mit dem öffentlichen Anker `eyeFrame()` — Braue, Nase und Bart hängen daran. |
| `studio-v12/frizzlebob.v4a.js` | 30.0 kB | Der Zweibeiner. Importiert `./gun-look.v4a.js`; sucht die Modelle unter `../assets/models/`. |
| `studio-v12/gun-look.v4a.js` | 1.9 kB | Munitions-Palette + Gun-Glow. |
| `kfb-ink-canon.js` | 21.7 kB | Die Kanon-Feder. EINE Ebene ÜBER studio-v12/ (die Module rufen `../kfb-ink-canon.js`). |
| `studio-v12/brow-rig.v1.js` | 8.3 kB | Rückweg der Braue (eine Zeile im Wirt). |
| `studio-v12/pet-nose.v1.js` | 6.2 kB | Rückweg der Nase. |
| `assets/models/FrizzleBob_Yellow.gltf` | 594.1 kB | Gelber Hase (im Asset gelb, nicht getintet) — gefunden über `../assets/models/` RELATIV ZUM MODUL. |
| `assets/models/FrizzleBob_Yellow_Gun.gltf` | 660.6 kB | Gelber Hase (im Asset gelb, nicht getintet) — gefunden über `../assets/models/` RELATIV ZUM MODUL. |

## Was NICHT hoch muss

* Die Kenney-Blaster liegen **schon** im Repo (`media/3D_Assets/kenney_blaster-kit_2.1/Models/GLB format/`, gemessen 206) — `weapon-mods.v1.js` adressiert sie direkt.
* Der Platformer-Character und die KayKit-Animationen kommen weiter aus ihren bestehenden Repo-Ordnern.
* Schriften: der Standalone lädt sie über Google Fonts, keine `@font-face` im Bündel (gemessen 0).

## Nach dem Upload (eine Zeile, dann messen)

1. Anker im Standalone-Quelltext auf jsdelivr umstellen.
2. Neu bündeln.
3. Abnahme **am Material**: `browSchema` = `kfb.brow-experiment/0.2`, `noseSchema` = `kfb.nose/0.2`,
   `moustSchema` = `kfb.moustache/0.1`, ein Waffen-Mod lädt und meldet `status OK` — nicht der Blick,
   sondern die Schemata (Lehre aus S6d).
