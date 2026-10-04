# Project Node · Combat Arena

Status: CURRENT_PROJECT_SSOT
Repository: `georg-doc/KFB-Combat-Arena`
Local entry: `WSA_START.md`
ChatGPT Web entry: `ChatGPT_web/START_HERE.md`

Combat Arena owns its own gameplay/runtime implementation. It may consume actor, animation, asset and shared KFB production references, but those donors do not become Combat movement/combat/world owners.

## Start order

1. central `skills/chat/START_HERE.md` + current shared delta;
2. Combat `WSA_START.md`;
3. current Combat living/contract/handover for the named slice;
4. current Return/Inbox result;
5. current branch/PR/test state.

## Sync

Consumer contract: `skills/chat/consumers/combat-web-chat.md`.
Local sync cursor should live in the Combat repo rather than duplicating central docs.

## Current caution

Do not infer the active Combat slice from this central node. Combat's own current GitHub state is authoritative and may advance independently.


## Current recovery pointer · 2026-09-22

Combat implementation truth remains in `georg-doc/KFB-Combat-Arena`.

Current bounded lane:

- PR #7 · branch `chatgpt-web/ca2-04-melee-vfx-sfx-2026-09-20`
- current handoff head: `f773dbeb0cfa09fa7e1bd72a4323130b2c0eff06`
- recovery/orientation file: `slices/ca2-melee-lab/CA2_NOW_NEXT.md`
- Return: `slices/ca2-melee-lab/RETURN.md`
- current result: **CA2-SWORD-01 IMPLEMENTED · Rig_Medium · CI PASS · PUBLIC PROOF FAILED ×2 · CANDIDATE PRESERVED**
- final-head CI: run `35673541360` / job `106575115480` · **98/98 tests PASS · portable build 234 files · re-home 172 preserved / 66 verified / routes PASS**
- current weapon candidate: exact Skeleton Warrior + exact `Skeleton_Blade.gltf` + real `Melee_1H_Attack_Chop` + existing swept contact / AttackLedger
- directional axes: **DEFERRED_MINOR**, not a blocker
- productive PR #5 Skeleton attack remains the old unarmed punch until human visual acceptance

Public Stage state:

- intended Sword-01 child route is **NOT PUBLIC_VERIFIED**
- public QA run `35672704030` failed twice because the exact `SOURCE.json` child route returned Hub fallback HTML instead of the pinned JSON marker
- attempt 1: job `106572514291`, artifact `10672111627`
- attempt 2: job `106573050384`, artifact `10671063958`
- two-pass stop applied; automatic Sword-01 public QA is frozen
- canonical publication failure recovery: `georg-doc/kayfabizarro/kfb-hub/stage/combat/ca2-sword-01/failure-recovery/RECOVERY.md`

Exactly one next gate:

> **CA2-SWORD-01-PUB-F1** — publication observability only. Prove the exact public `SOURCE.json` child route returns the pinned JSON marker before rerunning browser QA.

After publication is restored, the human visual gate remains Blade mount + body clearance + readable real 1H strike. Only after that may consequence wiring proceed, followed by Legacy and then Rig_Large/2H.

Deferred context for Legacy, Black Knight Large/2H, the human-rejected shield attachment, Pencil/Brush and later weapon profiles is preserved in `slices/ca2-melee-lab/DEFERRED_RIG_WEAPON_NOTES.md` in the Combat repository.

## CA2-LEGACY-00 handoff · 2026-09-22

A new bounded source/readiness lane is stacked on the preserved PR #7 melee work:

- Draft PR #10 · branch `chatgpt-web/ca2-legacy-00-readiness-2026-09-22`
- final head: `663f0610eb960f322d67b078f1302d0c6178d1c2`
- final CI: run `35678737011` / job `106590778036`
- **106/106 tests PASS**
- portable build **241 files**
- re-home **172 preserved runtime / 66 verified donor files / routes PASS**
- no Arena runtime file changed
- no new Stage route was created

Pinned Legacy readiness:

- 4 bodies · 17 heads · 24 weapons · 6-bone / 30-clip `Rig_Legacy`
- first ranged source candidate: **Rogue + common Crossbow + `Shoot(2h)`**
- first melee source candidate: **Knight + common Sword + `Attack(1h)`**
- Medium clips are forbidden on Legacy; PR #7 contact core remains the later melee consumer
- ToolBox keeps appearance/assembly/EyeRig ownership; Arena keeps movement, targeting, damage, enemy lifecycle and rewards

The Sword-01 Cloudflare failure remains a separate frozen publication issue. CA2-LEGACY-00 does not reopen or modify it.

Exactly one next gate for the Legacy lane:

> **KLR-EYE-VIS-01** — human Front + 3/4 review of the 17 Legacy heads. Knight default and Rogue default must be accepted/adjusted before runtime integration; Skull may remain unsupported.

After that gate, start **CA2-LEGACY-01R** only.



## WEB-COMBAT-FB-PLAYER-01 recovery · 2026-10-01

A stacked FrizzleBob player-presentation candidate is preserved on the Combat owner:

- Draft PR #11 · branch `chatgpt-web/combat-fb-player-v5-2026-10-01`
- frozen recovery head: `4eb2d063af96d2e528f84a5bb20cc967f26f8fdb`
- classification: **ARCHIVED_FAILED_CANDIDATE**
- Settings implementation retained: `Driver v4` and `FB v5b + Ear v5`
- source/boot/owner/Settings evidence passes; repository suite **80/80 PASS**; browser pass 2 **24/29 PASS**
- ranged input remains **UNPROVEN**: the QA pointer probe produced 0 shots; integrated headless screenshots also timed out
- no v5 Stage route was created; the existing public C-MVP-A-R2 / Driver-v4 Stage remains the public Combat baseline
- full recovery: `slices/combat-fb-player-v5/START_HERE.md` in Combat PR #11

Exactly one next gate: **FB-V5-RANGED-INPUT-PROBE-01** — instrument identical real-pointer delivery on Driver v4 and v5b before any further full-browser rerun. No third repair of the frozen acceptance gate.


## Parallel planning lane · CARD-HEX COMBAT ASCENT benchmark · 2026-10-04

This does **not** replace the current Combat runtime owner/state. It is a planning-only stacked benchmark above the current source-proven Brawl/Combat work.

Owner repo: `georg-doc/KFB-Combat-Arena`  
Draft PR: **#18**  
Branch: `planning/card-hex-combat-ascent-benchmark-2026-10-04`  
Head: `c75c943d41c3a691821df4855253423259302ce2`  
Stacked base: PR #17 @ `e391536fb8307a11ccd09dd6f0b04a7e2110542d`

Read in PR #18:
- `slices/card-hex-combat-ascent-benchmark/START_HERE.md`
- `slices/card-hex-combat-ascent-benchmark/BENCHMARK_CONTRACT.json`

Concept:
Combat Card stages + three source-proven KayKit Hex families + Babel jump-assist **MECHANISM** + S17 ranged-duel choreography + pending common Blender Duel freeze + existing Arena combat/VFX/SFX/reward owners.

Provider comparison:
Sol/Work vs Astra/Work vs Claude Coworker on one identical implementation contract; Claude Design Level 5 as a separate visual/level-authoring comparison.

Do not start provider implementation branches until one common Blender Duel state is frozen. Do not write into the active WB2 World One-Shot from this lane.

Reserved future comparison route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/combat/card-hex-ascent-benchmark/` · NOT DEPLOYED.
