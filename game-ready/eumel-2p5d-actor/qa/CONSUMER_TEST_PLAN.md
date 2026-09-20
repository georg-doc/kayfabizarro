# Consumer Test Plan · Eumel 2.5D Actor

## Gate A · isolated world-space actor

Use the existing proof:

`tools/2D Animation Studio/proofs/eumel-three2p5d-v1/`

Verify:

1. source appearance remains recognizably exact;
2. neutral bind is visually balanced;
3. legs remain attached under walk/hop;
4. shadow reads as grounded rather than a floating UI decoration;
5. yaw billboard and fixed world-facing modes both work;
6. eye gaze/blink stays attached while the actor/camera moves;
7. dispose/remount does not duplicate RAF/update owners.

## Gate B · Resident Atlas

Named candidate:

`tools/resident_atlas/modules/candidates/eumel-doccheck-project-island.module.json`

Verify:

1. consumer creates support/collision;
2. Eumel mounts at top-center/ground anchor;
3. resident module owns no world translation;
4. consumer velocity/state may drive local walk presentation;
5. interaction proxy remains consumer-defined;
6. index promotion happens only after browser evidence.

## Gate C · DocCheck Project Island

DocCheck owner handoff:

`georg-doc/doccheck/doc-animation/consumers/EUMEL_PROJECT_ISLAND_HANDOFF.md`

Verify:

1. exact KayKit environment pack is selected/pinned;
2. Eumel scale/grounding works with that 3D set;
3. camera-facing mode is appropriate for the chosen shot/gameplay;
4. DocCheck content/navigation remains consumer-owned;
5. restrained #cc0033 UI/wayfinding accent does not alter source art.

## Gate D · first KFB game

Choose one named game consumer only after Gate B.

Verify:

- one world/movement owner;
- actor module consumes state, never writes game physics;
- local eye/acting state returns cleanly to neutral;
- no copied source assets;
- consumer Return records accept/tune/reject.

## Gate E · human review

Georg checks:

- Eumel still reads as the real DocCheck mascot;
- 2.5D depth helps rather than looks like a cardboard bug;
- billboard behavior is not distracting;
- local walk/hop feels appropriate;
- scale against KayKit residents/environment;
- whether Resident Atlas promotion is useful.

Do not collapse package metadata, browser proof, consumer proof and human acceptance into one “game-ready” PASS.
