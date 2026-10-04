# RETURN · WB2 current-main convergence + Golden corridor

Status: **PASS · WORLD READY FOR MOTION ATTACHMENT**

## Product reality

The world preflight requested for the One-Shot is complete.

The current WB2 candidate now contains one browser-proven, data-driven four-island world:
- Town hub;
- Dystopia;
- Utopia;
- Protopia.

Three inter-island routes are compiled by the existing Track Core.
The world recipe carries the Golden-Journey locations and the three future-deck/Card seed sets.
The world stays open; no quest lock blocks early exploration.

## Technical evidence

Tested implementation head:
`0841b89ae8274118687e946318458201b402c5b5`

Source:
**9/9 PASS**
run `37166355940` · job `111329943298`.

Chromium/WebGL:
**PASS**
run `37166356027` · job `111329943523`.

Artifact:
`11289583486`
`sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472`.

Resource Registry:
**PASS**
run `37166355944` · job `111329943425`.

## Reused owners

- WB2 = renderer/world/edit/support.
- R2D core = island plan/height/masks.
- Track Core = all island roads + all three inter-island connections.
- existing P1/P2 procedural environment = nature.
- `wd1-city.js / kfb-facade-rule-v1` = building/facade owner.
- R2C palette data = Town/Utopia/Dystopia/Protopia palette identity.

No second world, road, building, movement or Resident runtime was created.

## Still intentionally absent

Player / locomotion,
Taxi/Drive,
Clown and other Residents,
Orc Band/Disco runtime,
Robots/Farmers/Lorekeeper,
Lean-Memory runtime,
Stage/Live publication.

The Golden anchors already reserve their world-space targets, so those systems can attach without rebuilding the world.

## Motion dependency correction · 2026-10-04

Motion PR #344 is **already complete**.
The stale PREPARED/NOT RUN router state has been corrected in the Motion owner.

Current consumer source:
`KAYKIT_LOCO_SET_01/KFB_KAYKIT_LOCO_SET_01.v1.json`
on Motion PR #344.

Binding Medium set:
- Walk = Walking_B
- Run = Running_A
- Sprint = Running_B
- Jog = Walk↔Run speed/phase blend
- Mannequin_Medium = reviewed runtime fixture
- ActionFigure = optional compatibility smoke only

## One-Shot execution correction · 2026-10-04

`KFB-LOCO-WB2-PLAYER-01` is **not** a separate Georg-facing next gate.
It is the first internal implementation checkpoint inside the current One-Shot.

Current execution authority:
`skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/ONE_SHOT_INTEGRATION_LOCK_2026-10-04.md`.

## Exactly one next action

**WSA / Codex continues on this PR #348 through the One-Shot internal sequence until the integrated Golden Journey candidate is ready or a real blocker/stop rule is reached.**
