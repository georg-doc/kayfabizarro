# KFB Pet Editor v9 — Ist-Stand (2026-07-19)

Fork von v8 (eingefroren), EIN Feature: **Mund-Tab** — die Character-Animator-Talk-Münder
(FrizzelBob-Mouth_01, 12 Viseme + Smile/Neutral, GitHub raw) pro Pet platzieren und in den
Aussehen-Contract schreiben. Contract-Schnitt: **Platzierung = Aussehen** (`pet.mouth`,
pet-LIBRARY.json, dieser Editor schreibt) · **Talk-Verhalten = Bewegung** (motion-LIBRARY v2
`face.mouth.rate`/restMap, Motion-Editor schreibt).

## Was neu ist
- Fünfter Tab **Mund** (links): An/Aus, Vorschau-Dropdown (alle 13 Viseme), Platzierungs-Slider
  **Größe / Höhe / Breite× / Kippung° / Bogen↑↓** (schreiben `pet.mouth {size, dy, sx, rot, bend}`
  — Bogen = Mundwinkel hoch/runter, Kippung = schiefer Mund als Charakterzug), Talk-Test.
- Anim-Leiste unten: **Talk** (Toggle) + **Grin/Pout** — Express-Presets über `mouth.express({bend,rot}, hold)`:
  fährt weich hin, klingt nach hold s auf die pet-Defaults aus. Dieselbe API steht Combos/FX im
  Motion-Layer offen (Expression-Sets = Backlog für Studio/Motion).
- Runtime: `pet-mouth.v1.js` (geteilt mit Motion-Editor v2, cache-gebustet importiert). v9-Züge:
  `sx`-Breitenfaktor, `rot`/`bend` (weich animiert, Plane mit Segmenten wird für den Bogen
  gekrümmt), `express()`-Override. Surface-Fit-Raycast wie die Augen; Mesh ist petOverlay
  (Reskin/Look-Wechsel fassen es nicht an), folgt Clip + Squash als Body-Kind.
- `_mountMouth()` bei jedem Pet-Wechsel: `pet.mouth` > `lib.mouth` (globaler Default + src-Notiz)
  > eingebauter Default (size 0.44, dy −0.52, sx 1).
- Export: normale Library-/Single-IO trägt `pet.mouth`/`lib.mouth` automatisch mit (Patch-Bump
  wie gehabt, ab v0.4.4). **Motion-Editor v2 liest `pet.mouth` beim Pet-Laden als
  Platzierungs-Default** — Workflow: hier tunen → exportieren → als `PET_EDITOR/pet-LIBRARY.json`
  committen → im Motion-Editor testen.
- Session-Key `kfb-pet-library-v9`.

## Nicht angefasst
v8-Werkzeug komplett (Look/Licht/Farbe/Gesicht, Actor-Schnitte, Rig v5, IO). Bunny-Schnauze
raus + Knubbelnase = Backlog (stripSnout im Gesicht-Tab kann die Schnauze schon löschen; der
Nasen-ERSATZ ist neu zu bauen, erst nach Sign-off).

## Nächste Schritte (Fahrplan mit Georg, 2026-07-19)
1. v9-Abnahme; FrizzleBob-Mund tiefer/breiter tunen und exportieren (Georg).
2. Motion-Editor auf EyeRig **v5** heben (Merge-Blocker; prüft zugleich das reskinLids-lid-Flag).
3. **„KFB Pet Studio v1"** — Merge beider Benches als EIN Canvas (ein Character, Tabs
   Aussehen · Motion, beide Contracts, gebündeltes IO). Eigener Auftrag, frischer Chat,
   Onboarding-Doc dann anlegen.
