# HANDOVER 2026-07-19 — für Cowork (Opus) und claude.ai-Engine-Chat

Stand nach der Session „Motion-Editor v2 / Pet-Editor v9 / Talk-Münder". Naht wie gehabt:
Contracts per URL, wer schreibt zählt `version` hoch. Session-Cut: `docs/SESSIONCUT_2026-07-19.md`.

## Contract-Landschaft (die Naht)
| Datei | Schema | Version | Schreibt | Liest |
|---|---|---|---|---|
| `pet-LIBRARY.json` | `kfb.pet-library/1` | 0.4.3 (0.4.4 folgt mit `pet.mouth`) | Pet-Editor v9 | Motion-Editor v2, Journey, Apps |
| `motion-LIBRARY.json` | `kfb.motion-library/1` | 1.2.0 (eingefroren für v1-Konsumenten) | — | Motion-Editor v1, Alt-Konsumenten |
| `motion-LIBRARY.v2.json` | `kfb.motion-library/2` | 2.0.0 | Motion-Editor v2 | Reise/Apps ab jetzt |

**Neu in `kfb.motion-library/2`:** `motions.secondary` (Ohren/Tail-Federn) · `clips` (Tempo der
8 GLB-Clips) · `face` (Mienenspiel: emotes/drift/react + `mouth` als Verhaltens-Fallback) ·
`triggers` (deklaratives Game-Event-Mapping drop/brake/curveL/R/card/still — Fahrwerte j/c/a).
**Neu in pet-LIBRARY (ab 0.4.4):** `pet.mouth {size, dy, sx, rot, bend}` + `lib.mouth` (Default,
src-Notiz). Platzierung = Aussehen; Talk-Tempo/Shuffle = Bewegung. Blink bleibt in pet-LIBRARY
(`eyeRig.blink`), nicht doppeln.

## Runtime-Module (geteilt, ein Code-Pfad)
`pet-library.v6.js` (Character) · `pet-eye-rig.v5.js` (**jetzt beide Benches**; v4 nur noch
eingefrorene v1-Benches) · `pet-motion.v2.js` · `pet-face.v1.js` · `pet-fx.v1.js` ·
`pet-mouth.v1.js`. Frame-Reihenfolge: `ch.update → motion.update → face.update → mouth.update →
rig.update → fx.update`.

## API-Kurzreferenz für die Engine (06-Call / Reise)
- Körper: `motion.hop/powerJump/locomotion/roomTransition/turn180/celebrate/react(kind)`
- Clips: `motion.playClip(name,{speed,loop})` — static/idle/walk/run/eat/dance/gesture±
- Game-Events: `motion.trigger('drop'|'brake'|'curveL'|'curveR'|'card'|'still')` — Gesicht VOR
  Körper, FX interpunktieren
- Combos: `motion.combo('doubleTake'|'shiver'|'tada'|'random')` (random nur auf Anforderung)
- Gesicht: `face.set(emote,{hard,hold})` · `face.nudgeGaze(gx,gy,hold)` · `face.eyePop(k)` ·
  `face.eyeOval(k,hold)` · `face.setCursor(nx,ny)` (x negieren!)
- Mund: `mouth.talk(on)` · `mouth.talkBurst(dur)` · `mouth.setRest(emote)` ·
  `mouth.express({bend,rot},hold)` — Ruhe-Mund hängt automatisch an `face.onSet`

## Was der Cowork wissen muss
1. **GitHub-Mirror syncen**, sobald Georg exportiert: `pet-LIBRARY.json` (0.4.4) und
   `motion-LIBRARY.json`-Nachfolger. Vorschlag: v2-Contract unter dem BESTEHENDEN kanonischen
   Namen publizieren (Feld `canonical` zeigt schon dorthin), v1-Kopie als
   `motion-LIBRARY.v1-frozen.json` archivieren — oder getrennte URLs; Entscheidung bei dir.
2. Mund-PNGs liegen schon im Repo (`media/3D_Assets/Textures/FrizzelBob-Mouth_01/`), Runtime
   lädt per RAW-URL — nichts zu tun.
3. `skills/session-export_v1.md` ist jetzt auch im Projekt gespiegelt.
4. **EMBED_CUBE_PETS-Redline:** `docs/EMBED_CUBE_PETS_v2_PROPOSAL.md` — Update-Vorschlag v1→v2 für
   das kanonische Briefing (Module/Rig, Talk-Münder, motion-LIBRARY v2). Enthält die dringende
   Warnung: kanonische `pet-LIBRARY.json` steht auf v0.2.0, muss auf v0.4.4 gehoben werden.

## Nächste Schritte (beschlossen)
1. Georg: v9-Abnahme + FrizzleBob-Mund tunen + Export 0.4.4. ✓ Rig-v5-Hub ist erledigt.
2. **Pet Studio v1** (frischer Chat): Merge beider Benches als EIN Canvas — ein Character,
   Tabs Aussehen · Motion, Paletten-Neuordnung von Grund auf (Onboarding:
   `docs/ONBOARDING_pet_studio.md`).
