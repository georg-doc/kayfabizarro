# Paste-ready · KFB Travel Mode Bridge v1 · Fresh Web Chat

@GitHub

Prepare the KFB Ground ↔ Animated Card Flight mobility bridge.

Read current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
5. `tools/KFB-ToolBox/_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/START_HERE.md`
6. current `georg-doc/KFB-Travel-Globe`:
   - `WSA_START.md`
   - `travel/CONTRACT.md`
   - exact current main head.

GitHub state overrides this brief if newer.

Do **TMB-0 only**.

No runtime implementation.

Verify and pin:
- `travel/globe-v13/carpet.js`
- `travel/globe-v13/flight-controls.js`
- `travel/globe-v13/camera-rig.js`
- `travel/terrain-planets-v1/card-carrier.js`
- `site/world-builder/runtime-mode.js`
- `site/world-builder/ground-controller.js`
- `site/world-builder/movement-lab.js`
- Motion Lab PR #127 / current exact head
- Studio `cardrider.v1.js` as measurement/pose donor only
- historical Surf rejection / rigid-card rejection.

Important product decision:

The first Flight vehicle is the **exact animated Travel CardCarrier**.

Do NOT use the flat/hard Frankenstein reference card.

Architecture:
- Ground owner remains Ground;
- Flight owner remains `carpet.js`;
- later Drive retains its own owner;
- transition layer owns only intent/handoff/presentation choreography;
- exactly one movement writer at all times.

Prepare:
1. `SOURCE_REUSE_MATRIX.md`
2. minimal `MOBILITY_TRANSITION_CONTRACT_v0.md`
3. additive CHANGELOG/RETURN
4. exactly one next gate: TMB-1 animated CardCarrier + one real Rig_Medium ActionFigure passenger.

Record the double-Space concept but do not implement it:
- first Space remains immediate Ground jump;
- second fresh Space in the candidate window requests Flight;
- do not delay single jump.

Record landing concept but do not implement:
- intentional descend + valid support + low AGL → Ground;
- ordinary low flight must not auto-land.

No WorldBuilder integration.
No Racer integration.
No Work/WSA.
No Cloudflare publication.

After every GitHub write fetch exact branch head and intended files.

STOP after TMB-0.
