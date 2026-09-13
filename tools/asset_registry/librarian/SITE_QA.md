# Site QA · KFB Asset Librarian v1.2 Core

## Gate

Phase 1 passes only when all six real WSA tasks pass in Chrome with no LLM/API key.

| Task | Required result | Automated evidence |
|---|---|---|
| T1 Orc Raider | character, texture/status, pinned RAW | `t1-orc-raider.png` |
| T2 Rover | `Rover_Round.gltf`, Stunt Car Race handoff | `t2-rover-round.png` |
| T3 Rig Medium | multiple rigged+animated `Rig_Medium_*`, Animation Lab handoff | `t3-rig-medium.png` |
| T4 CapsuleCarl | player + texture + CharacterTemplate, handoff | `t4-capsulecarl.png` |
| T5 Bath / propulsion | `bath.gltf` + `SpaceRanger_Jetpack.gltf`, Frankenstein handoff | `t5-bath-propulsion.png` |
| T6 Audio | playable audio, persistent tray, Generic Runtime handoff | `t6-audio.png` |

## Additional automated checks

- Registry bootstraps from canonical generated files.
- Search remains lazy.
- 3D GLTF/GLB WebGL render is non-empty where checked.
- image preview reports dimensions.
- audio is not autoplayed.
- problem/review queue returns Registry-backed findings.
- exact pinned RAW uses the Registry source commit.
- handoff schema is `kfb.asset-handoff.v1`.
- `selectionStatus` is `candidate-only`.
- `suitabilityDecision` stays `owned-by-receiving-consumer`.
- selection survives page reload via browser-local storage.
- no browser console errors or runtime exceptions.

## Human review after CI

Georg should use the static site for the same six tasks and judge usability, density and speed. Phase 2 Claude Design A/B work starts only after this review.
