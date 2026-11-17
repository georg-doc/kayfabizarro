# Combat VFX R3 · actual verification

2026-11-17 · WSA Combat-VFX → WS0. No artistic AA/AAA acceptance; no merge or Live promotion.

## Source checkpoints

- Original donor checkpoint842204913cf917571b1fd9e19c5454db0be1e43a.
- Complete original/authoring closure667bcea1181f536ea7c7e7fb81af09e4f065b1b2.
- Runtime C8 checkpoint1255741f766afa5dcfba1a91df3f02cbd5525466:119 frozen source files fetched at exact commit and SHA matched;67changed files, no unexpected removal. Receipt `docs/combat-aa-r3/checkpoints/RUNTIME_SOURCE_MANIFEST.json` and `RUNTIME_REMOTE_CHECKPOINT.json` record exact roster.
- Final evidence/proof-entry/Return commits follow; their exact branch head is recorded separately after verification.

## CPU / source execution

Root ran29focused Node tests: presentation14, body4, birth-clock8, actual audio playback3. All PASS. The audio test executes the actual `play()` function both unminified and through the production esbuild minifier; the latter reproduced the observed `(plays++) is not a function` before the explicit statement terminator and passes afterward. This is a playback-call regression test, not a listening verdict.

Root also ran the actual source fixtures `test/combat-stage/{weaponCarrier,projectiles,weaponDynamics,muzzle-directions,volley,native-donor-closure,native-soldat-handoff,native-explosives}.r3.mjs`: all PASS. These execute verified GLB parsing/anchors/axes, actual barrel spin with no extra shots, six scatter paths/grouped damage, deterministic23-file donor closure/corruption rejection, native target→death→q748 storage→Fluff source handoff and native explosive mode/readiness gates. Root ran `git diff --check` PASS.

Native-source child separately ran applied shotgun release preflight and6bridge volley tests: six actual endpoints, one grouped target delivery, one fire event, no duplicate reference muzzle when AA/original owns; normal fallback still emits once. Exact grenade/clown SHA verified. These are CPU/source results, not an all-weapons GPU pass.

Reproduce focused suites with existing Three dependencies and an isolated esbuild installation:

```
KFB_ESBUILD_MODULE=/absolute/path/to/esbuild/lib/main.js node --experimental-vm-modules --test test/unit/combatAAPresentationR3.mjs test/unit/combatAABodyR3.mjs test/unit/combatAABirthClockR3.mjs test/unit/combatAudioPlaybackR3.mjs
```

The build used isolated esbuild0.25.0. Shared WS0 dependencies/private sources were read-only; no installation into them. Optional game-dev CLI was unavailable earlier; repository-native checks were used. No full CI/full repository build PASS is claimed.

## Actual native original proof

Fresh full navigation after HMR teardown failure: native build `native-originals-r3-c8-20261117`, source mode `originals`, pistol, actual M1 game camera55°. Four real native releases and four real wall contacts; errors[]. Raw Quarks original six-system recipe sourceScale1/profileChangedfalse; raw Effekseer original seed7 with no host scale/rotation/tint. AA fire/hit suppression and raw source handles remain separate.

Film: `03-originals-native-c8-kfb-camera.webm`, SHA256 `ed4c1f1321ca51cc39e61738a562cd64eef17806080b172292ceb9bf33089d95`,4238344B,183decoded original frames/5.12s. Not AI-generated, not a normalized30/60fps export. No stable60fps claim. Full native DOM receipt is `evidence/native-originals-c8.json`; current original source/runtime bytes remain receipt-pinned. Soundless Effekseer audit blocks native audio creation, existing mixer contexts1. Source/runtime hash integrity is distinct from an independent aesthetic/fidelity verdict.

Earlier native original proof:4fire/4hit,120actualframes/5.09s; retained separately. Neither original proof is derivative quality acceptance.

## Independent critic / Guard

C2–C8 immutable reviews retained; C6 had no independent grade. C7: pistol muzzle7,flight6,material7,timing7,tail6,camera5,audioNP,stability7; overall technical3 from Gatling playback/recording abort. Former C5 weapon pop not reproduced in five current near shots. Own current native C7-AA clip confirmed actual integration but weak gameplay-scale effect.

C8 final bounded art strategy: all observed pistol form/energy categories remain below8 (muzzle6,flight6,stone6,tail6,camera5), timing/audio/full stabilityNP. Independent Gatling regression is narrowly closed: successful recording completion, correct new Gatling Blob/file, no observed plays error. Actual original frame counts in its Stage captures are68–96over6.4s; no cadence or timing acceptance inferred from resampling. Root's first background C8 clip had only27frames and is explicitly excluded from fluidity claims.

Independent Guard: QUARANTINE the derived energy/readability seam; end this repair loop, no C9 tiny retune. Preserve exact source and failure evidence; require a genuinely authored alternate ballistic donor/design. Original-only Site proof and owning Return continue independently. Every relevant category must individually reach8; NP cannot pass and no average is used.

## Native body / explosive limits

Actual native C8 body lane attempt:3real AA shots,0body contacts; genuine soldier remained HP3/Treffer0. The14s recording is a MISS diagnostic, not a melt proof. CPU q748 handoff tests do not close this visible aiming/contact gate. Workbench's initial body placement also missed its measured shot axis; target moved to z.15, but corrected workbench GPU handoff was not established in this run. No fake damage or substitute Goo was added.

Fresh native fixture now exposes8ready basic choices after exact canonical grenade/clown model-path fallback; rocket is the existing Gatling secondary. Actual native C8 grenade/bomb/rocket explosion and body cascade GPU acceptance remain unproven. Uzi has no verified model/card; no substitute used. All basic weapon quality matrix is incomplete.

HMR of the full existing R3F/Rapier world produced teardown errors and stale fixture readiness. Fresh full navigation restored source proof. This is recorded as a development-host limitation, not hidden as an effects PASS. No normal-game Effekseer attachment or postprocessing/HDR acceptance is inferred from the explicit native fixture attachment.

## Site proof scope

Existing private World-Studio Site receives an original-only entry, not the failed AA defaults. Eight source assets/5354128B, original recipes on one host renderer/audio graph, day/night and diagnostic cameras. No AA Quarks pool allocated in that entry. Original native film is `preload=none`, accessible separately while the3D curtain loads. Local full-navigation readiness approximately4.3s in this run; no instant-load or general performance SLA. One original fire/hit with contexts1/plays5/errors[] actually tested after the minified audio fix.

The exact hosted URL/build must be verified after deployment and recorded in the final Return. Native film and workbench camera are explicitly distinguished.


Additional factual closure limit: Stopping the native Vite server printed shader diagnostic source in the long HMR session; exact cause and occurrence time are unknown. No GPU shader clearance is claimed. Root-owned preview servers8850/8807/8860 were stopped; this does not alter the existing NP/failed classification.
