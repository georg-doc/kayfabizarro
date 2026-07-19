# KFB Pet Motion Editor v2 — Ist-Stand (2026-07-19)

Auftrag: Motion-Editor v2 mit (1) allen 8 Kenney-GLB-Clips, (2) Eye-Acting/Mienenspiel
(`uploads/SPRINT_mienenspiel.md`), (3) Trigger für In-Game-Animationen + FX, (4) ergonomischerem
UI. Entscheidung Georg: alles in einem Wurf, Abstands-Regler in die Bench, Event-Buttons statt
Fahr-Simulation, DAW-Bottom-Bar, EIN Contract v2. Dazu: Sekundär-Motion (Ohren/Tail/Geweih) und
kreative Augen-FX (Pop/Oval-Bounce).

## Architektur (4 Layer + FX)

```
Layer 1  GLB-Clips        ch.mixer direkt (playClip)          pet-motion.v2.js
Layer 2  Körper prozedural Squash/Stretch-Schicht (wie v1)     pet-motion.v2.js
Layer 3  Gesicht           Mienenspiel (Drift+Tremor, reaktiv) pet-face.v1.js
Layer 4  Sekundär          Follow-Through-Federn auf Knoten    pet-motion.v2.js
FX       dust/star/lines   Cel-Partikel, Interpunktion         pet-fx.v1.js
```

Frame-Reihenfolge (VERTRAG): `ch.update` → `motion.update` → `face.update` → `rig.update` → `fx.update`.

## Die Module

**`pet-motion.v2.js`** — Fork von v1 (v1 eingefroren, v1-Editor läuft weiter). Neu:
- `playClip(name,{speed,loop})` / `stopClip()`: roher Zugriff auf alle 8 Clips (static/idle/walk/
  run/eat/dance/gesture±) am Trigger-Aliasing von `pet-library.v6.js` vorbei. `CLIPS`, `CLIP_DEFAULTS`.
- Trigger-Bus `trigger(name)`: `drop` (surprised hart + Augen-Pop + Fall/Impact + Stern+Staub),
  `brake` (sad + Augen-Oval + Skid mit Nase-Kippen + Staub), `curveL/R` (Blick nach außen + Lean),
  `card` (Blick-Glance + Mini-Pop + Bob), `still` (Drift). Reihenfolge immer: Augen → Gesicht →
  Körper → FX ("Ändert sich das Gesicht, bevor der Körper reagiert? Erwartet: ja").
  Deklaratives Mapping `TRIGGER_INFO` wandert in den Contract.
- Combos `combo(name)`: `doubleTake` (wegschauen → Snap + Pop), `shiver` (abklingende Zitter-Feder),
  `tada` (happy hart + 2 Sterne + powerJump + celebrate), `random` = Baukasten Anticipation →
  Aktion → Recover, gewürfelt NUR auf Anforderung (Briefing: Zufall ist der Feind von lebendig).
- Sekundär-Motion `initParts()`: sucht benannte Knoten (`ear|tail|antler|horn|wing|tusk|trunk|mane`),
  hängt Follow-Through-Federn dran (Anregung aus y-/yaw-Geschwindigkeit, ADDITIV pro Frame NACH dem
  Mixer — kein Kampf mit den Clips). Keine Knoten gefunden → stiller Skip + console.info.
  Tuning: `motions.secondary` (amp/freq/damp) im Contract.
- FX-Hooks: Staub bei Landungen ab height≥0.3, Speedlines in transitionOut/In, Staub bei Ankunft.

**`pet-face.v1.js`** — das Mienenspiel. Kern aus dem Sprint: 6 Emote-Anker (Contract-Werte) sind
VOKABULAR, nicht Auswahl — der Zielpunkt im (lidUpper, lidLower, slant, gaze)-Raum WANDERT
(Drift neutral↔thinking via Sinus-Noise) und ZITTERT fein (tweakbar, „ob das Zittern lustig wird,
ist eine Bildfrage"). `set(emote,{hard,hold})` = Reaktion: hard = Attack ~1 Frame (Augen schneller
als Körper), hält, released zurück in den Drift. `nudgeGaze()` für Kurve/Karte. `setCursor()` =
Blick folgt Cursor, löst sich nach 2,4 s. Augen-Skala-Federn: `eyePop(k)` (unterdämpft, ploppt auf
+ bounct zurück) und `eyeOval(k,hold)` (y-Stauchung + leichtes x-Plus). Treibt das EyeRig NUR über
Public API: `applyEmote` + `setGazeFollow(true)`+`pointTo` (kontinuierlich statt enum-GAZES);
`e.scale` pro Auge ist frei (rig.scale macht nur die Squash-Kompensation). Rig unangetastet.

**`pet-fx.v1.js`** — Cel-Partikel im Papier-Look: `dust` (Puffs in Papiertönen + Boden-Ring),
`star` (Comic-Impact-Stern als Canvas-Sprite, Gold + Tusche-Outline, easeOutBack-Pop),
`speedlines` (Emitter, Striche fliegen entgegen). Alles life+fn, settlet in Ruhe, disposed sauber.

## Contract v2 — `motion-LIBRARY.v2.json` (`kfb.motion-library/2`, v2.0.0)

`motions` unverändert aus v1.2.0 (+`secondary`) · `clips` (Tempo je Clip) · `face` (emotes/drift/
react; blink bleibt in pet-LIBRARY.json, nicht doppeln) · `triggers` (deklaratives Event-Mapping).
Bench liest: Session (`kfb-motion-library-v2`) → `motion-LIBRARY.v2.json` → `motion-LIBRARY.json`
(v1, nur motions). Export schreibt Schema 2; Import nimmt beide. Wer schreibt, zählt hoch.

## Bench-UI (DAW)

- **Pad-Bar unten**, 5 Gruppen: GLB-Clips (teal, Klick=an/aus) · Motions (die 10 aus v1 +
  „Sekundär" als Tuning-Eintrag) · Gesicht (6 Emotes + Pop! + Drift-Toggle, gold) · Events (rot) ·
  Combos (grün). Klick = auslösen + zum Tunen wählen (gelber Unterstrich = gewählt).
- **Rechts**: Tuning der Auswahl (Motion-Slider / Clip-Tempo / Face-Drift+React) + „▶ nochmal" +
  Global: **Abstands-Regler** (0 = Mitmoderator unten links, blickt den Spieler an; 1 = Vehikel
  draußen; stufenlos, Blick+Kamera-Ziel wandern mit; Default 0.15), Squash-Master, Glättung,
  Toggles Blick/FX/Matte, Reset.
- Cursor über der Bühne = Blick folgt (x negiert — InfiniteJourney-Falle), löst sich in Ruhe auf.

## Abnahme gegen das Sprint-Briefing

1. Regler auf 0 → er blickt dich an, Lider lesbar. 2. Regler ziehen → wandert stufenlos (kein
Sprung). 3. Eine Minute zusehen (Drift an) → der eigentliche Test, Zitter-Amplitude ist tweakbar.
4. „Bremse" → Gesicht reagiert vor dem Körper (face.set feuert vor dem Skid-Tween). 5. Kurve 2× →
Drift+Tremor liegen über allem, nie zweimal exakt dasselbe Gesicht.

## Nachtrag (2026-07-19, gleiche Session): Dropdown + Talk-Muender + Responsive

- **Pet-Dropdown (alle 24)** im Global-Panel: Liste aus `assetNotes.petsAll24` des Pet-Contracts.
  `loadPet(id)` = Character neu laden, EyeRig neu bauen, Face/Mouth/Motion umhängen,
  Sekundär-Teile neu scannen. Contract-Regel wie Pet-Editor v6: `pet.color` = Übersteuerung
  (flach umgefärbt), ohne color = native Kenney-Colormap (Augen-Schalen sind eh gestript).
- **`pet-mouth.v1.js` — Talking Mouths (kein Lip-Sync)**: die 12 Character-Animator-PNGs
  (`media/3D_Assets/Textures/FrizzelBob-Mouth_01/`, GitHub raw) auf einer Surface-Fit-Plane
  (Raycast wie EyeRig, Body-Kind → folgt Clip+Squash). Talk = Visem-Shuffle im Silbentakt
  (offen häufig, M/F/W-oo ~25%, Mikro-Pausen auf neutral), jeder Wechsel ploppt (Snap statt
  Crossfade). Ruhe-Mund folgt dem Mienenspiel via `PetFace.onSet` (restMap: happy→smile,
  surprised→oh …). API: `talk(on)`, `talkBurst(dur)`, `setRest(emote)`, `setParams`, `refit()`.
  Bench: „Talk“-Pad (Gesicht-Gruppe) + Tuning Größe/Höhe/Tempo. Contract v2 `face.mouth`.
  Schnauzen-Pets (pig …): Höhe-Regler; Bunny-Schnauzen-Chirurgie + Knubbelnase = Pet-Editor-
  Scope (stripSnout existiert dort), bewusst NICHT hier. Per-Pet-Mundlage (`mouth.perPet`) = Backlog.
- **Responsive/Chat-Preview**: unter 920px Canvas-Breite kompakter Modus (schmaleres Tuning-
  Panel, kleinere Pads); Pad-Bar scrollt horizontal.


- Sekundär-Teile hängen an GLB-Knoten-NAMEN; ob Kenneys bunny getrennte ear-Knoten hat, zeigt die
  Konsole (`[pet-motion.v2] Sekundär-Teile: …`). Ohne Knoten kein Ohren-Wackeln — dann wäre der
  nächste Schritt ein Mesh-Split wie stripEyes (Chirurgie in pet-library), erst nach Sign-off.
- Kurven-/Lean-Vorzeichen sind Bench-getunt, im Spiel gegen echte Fahrwerte prüfen.
- **Contract-Look (Nachtrag 2026-07-19, Bug-Fix):** die Bench rendert jetzt den vollen object-space
  **Triplanar-Clay-Shader** aus `material.live` (portiert aus Pet-Editor v8/v9 = geteiltes `makeMat`).
  Papier-Textur + Relief + paperGold-Tönung 1:1 wie im Aussehen-Editor. Kanonische pet-LIBRARY.json
  ist stale v0.2.0 → Cowork muss v0.4.4 publizieren (`docs/EMBED_CUBE_PETS_v2_PROPOSAL.md`).
- Mund-Default-Lage (`dy` −0.52) passt nicht für jedes Pet (große Schnauzen verdecken) — per
  Regler justieren; per-Pet-Werte in den Contract heben, wenn die Reise sie braucht.
- v1-Editor + Contract v1 bleiben unangetastet (Konsumenten migrieren, wenn v2 abgenommen ist).
- Dev-Falle bleibt: viele Hot-Reloads → Zombie-Renderer → harter Reload.
