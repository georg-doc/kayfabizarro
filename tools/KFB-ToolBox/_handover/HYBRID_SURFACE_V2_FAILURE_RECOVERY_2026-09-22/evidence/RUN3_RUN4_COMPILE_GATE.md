# Browser failure evidence · Runs 3–4

## Run 3

Workflow run: `35672017517`  
Job: `106570357717`

After donor/source/head/material preservation checks, the proof stopped at:

`FAIL visible actor shaders compiled`

Aggregate actor state:
- groups 5
- meshes 67
- decorated materials 64
- compiled markers 58
- proof-counted visible materials 63
- visible compiled markers 58
- preserved special materials 7

Repair decision: change compile census from direct node visibility to effective parent-chain visibility.

## Run 4

Workflow run: `35672227722`  
Job: `106571025025`

The same gate still reported:

`materials=64 · compiled=58 · visibleMaterials=63 · visibleCompiled=58 · preserved=7`

Successful measurements immediately before the failure included:

- target head metric `1.0929430509813036`;
- Legacy scale `0.9580576869242404`, total height `1.6845816963222648`;
- ActionFigure scale `1`, total height `2.322283020401091`;
- GothGirl scale `0.9205969171294165`, total height `2.0357667417824037`;
- FrizzleBob Driver scale `1.0444884938968744`, total height `2.6064509025497955`;
- Black Knight scale `0.7838843083215586`, total height `3.6775523513239103`;
- one shared texture UUID across environment and actors;
- procedural 3D grain contract;
- maps/colors/roughness/metalness preserved on decorated materials;
- environment shader programs compiled.

The proof throws at the actor compile gate, so screenshot and final network/console assertions after that point are not evidence.

## Stop

Run 4 is the second failed repair pass on the same gate. Candidate frozen; no third repair in this slice.
