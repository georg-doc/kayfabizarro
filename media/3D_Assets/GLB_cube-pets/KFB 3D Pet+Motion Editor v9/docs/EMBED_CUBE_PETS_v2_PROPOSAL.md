# EMBED_CUBE_PETS — Update-Vorschlag v1 → v2 (für Cowork, 2026-07-19)

Die kanonische `media/3D_Assets/GLB_cube-pets/EMBED_CUBE_PETS_v1.md` ist an mehreren Stellen
veraltet (Module, Rig-Version, Contract-Stand, fehlende Talk-/Mienenspiel-Schicht). Dies ist ein
**Redline-Vorschlag**, nichts überschrieben — Cowork liest den Code direkt und entscheidet, was in
die kanonische Fassung wandert. Reihenfolge = Priorität.

## ⚠ 0 Dringend: kanonische pet-LIBRARY.json ist STALE
`…/media/3D_Assets/pet-LIBRARY.json` steht auf **v0.2.0** (nur 7 Pets, `material.live` = Cardboard001,
kein `face`, kein `paperGold`). Die produktiven Benches lesen die lokale Working-Copy **v0.4.3**
(24 Pets, `face.stripEyes/stripSnout/facet`, `material.live` mit paperGold/tintMode).
**Bitte die aktuelle Fassung publizieren** (Georg exportiert nach dem v9-Mund-Tuning v0.4.4, dann
kommt `pet.mouth` dazu). Solange die URL stale ist, liefert jeder Fallback-Fetch den alten Look.

## 1 Module (Abschnitt 3 ersetzen)
| Alt (v1) | Neu (Stand 2026-07-19) |
|---|---|
| `pet-eye-rig.v3.js` | **`pet-eye-rig.v5.js`** — Rig-v5-Hub, beide Benches; Actor-Layer (Asymmetrie/Leben/Kinetik), `lid`-Flag. v3/v4 nur in eingefrorenen Alt-Benches. |
| `pet-motion.v1.js` | **`pet-motion.v2.js`** — + Clip-Layer (`playClip`), Trigger-Bus, Combos, Sekundär-Federn. v1 eingefroren. |
| — | **`pet-face.v1.js`** (Mienenspiel), **`pet-fx.v1.js`** (dust/star/speedlines), **`pet-mouth.v1.js`** (Talk-Münder). |

Frame-Reihenfolge (neu, wichtig): `ch.update → motion.update → face.update → mouth.update →
rig.update → fx.update`.

## 2 Augen-Rig: `googly`-Mod-Notiz korrigieren (Abschnitt 8)
Die Benches bauen die **EyeRig-Instanz direkt** (`new EyeRig(ch, {...})`) neben `mods:['emotes']`,
nicht über einen `googly`-Mod. `googly` in `pet-library.v6.js` ist der leichte Inline-Modus für
Fremd-Hosts; der volle Actor-Blick (Emote-Raum, Blink aus Contract, lidSampler) kommt aus
`pet-eye-rig.v5.js`. Für neue Apps: EyeRig direkt einbinden, Blink aus `pet-LIBRARY.eyeRig.blink`.

## 3 Neuer Abschnitt: Talk-Münder + Mienenspiel
- **Münder:** 12 Character-Animator-PNGs + Smile/Neutral unter
  `media/3D_Assets/Textures/FrizzelBob-Mouth_01/` (RAW). `pet-mouth.v1.js` legt sie per
  Surface-Fit-Plane auf den Body. Kein Lip-Sync — Visem-Shuffle im Silbentakt (`talk(on)` /
  `talkBurst(dur)`). Ruhe-Mund folgt dem Emote (`setRest`). Platzierung pro Pet = `pet.mouth
  {size, dy, sx, rot, bend}` im Aussehen-Contract (Pet-Editor v9 schreibt sie).
- **Mienenspiel:** `pet-face.v1.js` — kontinuierlicher Emote-Raum (wandert + zittert statt 6
  Presets), reaktiv. Vokabular = `motion-LIBRARY.v2.json` `face.emotes`.

## 4 Trigger-Tabelle erweitern (Abschnitt 7)
Neu über `pet-motion.v2.js`: `playClip(name,{speed,loop})` (roh, alle 8 GLB-Clips),
`trigger('drop'|'brake'|'curveL'|'curveR'|'card'|'still')` (Game-Events, Gesicht vor Körper, FX),
`combo('doubleTake'|'shiver'|'tada'|'random')`. Deklaratives Mapping = `motion-LIBRARY.v2.json`
`triggers`.

## 5 Zweiter Contract benennen
Bewegung wohnt jetzt in **`motion-LIBRARY.v2.json`** (`kfb.motion-library/2`): `motions` (Squash-
Tuning) + `clips` (Tempo) + `face` (emotes/drift/react/mouth) + `triggers`. v1 (`…/motion-LIBRARY.json`,
1.2.0) bleibt für Alt-Konsumenten. **Cowork-Entscheidung:** v2 unter dem bestehenden kanonischen
Namen publizieren (Feld `canonical` zeigt schon dorthin) und v1 als `-frozen` archivieren, oder
getrennte URLs.

## 6 Kleinkram
- Set `animals`: 24 Pets stimmen. Skalierung in den Benches 1.6 (nicht 0.82) — App-abhängig, ok.
- Fell/Textur: Look läuft NICHT über `map.repeat` (Atlas-Streifen), sondern über den object-space
  **Triplanar-Shader** in `makeMat` (Pet-Editor v8/v9, jetzt auch Motion-Editor). Abschnitt 9
  entsprechend umschreiben: „Colormap-Diagnose zeigt die Streifen; echter Look = Triplanar".
- Pfad-Hygiene bleibt (RAW-URL, nie `./assets/`) — stimmt schon, beibehalten.

---
*Quelle dieses Standes: `docs/SESSIONCUT_2026-07-19.md`, `docs/HANDOVER_editors_2026-07-19.md`.
Kein kanonisches File angefasst — Cowork übernimmt, was passt.*
