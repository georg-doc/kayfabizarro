# RECOVERY · WB2 convergence + Golden corridor

Status: **WORLD-CONVERGENCE-BASE-01 PASS · WORLD-MULTI-ISLAND-CORRIDOR-01 PASS**

Owner: KFB WorldBuilder / WB2  
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`  
Draft PR: **#348**  
Tested corridor implementation head: `0841b89ae8274118687e946318458201b402c5b5`

## Product reality

The current-main WB2 world base is clean and the four-island MVP corridor is now real browser-proven world data:
- KFB Town;
- Dystopia;
- Utopia;
- Protopia;
- three Track-Core `ROAD_BRIDGE` connections;
- Golden-Journey anchors;
- canonical deck/Card seed refs.

No Player, Motion, Drive or Resident runtime is mounted yet.

## Passing corridor evidence

- Source: **9/9 PASS** · run `37166355940` / job `111329943298`.
- Chromium/WebGL: **PASS** · run `37166356027` / job `111329943523`.
- Browser artifact: `11289583486`.
- Digest: `sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472`.
- Resource Registry: **PASS** · run `37166355944` / job `111329943425`.

Browser QA proves:
- 4 world nodes;
- 3 Track Core bridge connections;
- canonical future deck routing;
- required Golden-Journey anchor IDs;
- 4 island presentation groups;
- 4 existing facade/building-owner reports;
- no `wi1-play`, Travel Globe or card-start host;
- one WB2 renderer canvas;
- no unexpected page/console error gate.

## World recipe source

`WORLD_RECIPES.json` is now the corridor fixture.
The compressed island distances are explicitly MVP-scale data derived from the prior R2C directional relation, not final movement balance.

Global rule:
**PULL, DON'T GATE.**
All islands are physically explorable; later state gates Card/reward handoffs rather than world access.

## Exactly one next gate

**KAYKIT-NATIVE-BLENDER-BASELINE-01** on Motion PR #344.

After the native movement family is selected:
attach the Player to these WB2 world facts.
Then run **WSA-RES-SET-01** for Resident placement/Save/Reload.
