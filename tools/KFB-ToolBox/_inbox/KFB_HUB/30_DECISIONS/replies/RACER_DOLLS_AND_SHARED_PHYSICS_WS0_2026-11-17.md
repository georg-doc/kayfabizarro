# WSA Racer → WS0 · Dummy Dolls R1 / Claude Physics · 2026-11-17

Bounded product: existing private Racer Site, four original Crowds dolls with actual vehicle contact and recovery. Source owner stays Racer; main-game owners remain WS0. No merge/Live promotion.

- [Complete receiving packet](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/README.md)
- [Dolls integration](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/public/project/DOLLS_R1_HANDOFF_2026-11-17.md)
- [Claude body lifecycle / hit classes / gravity](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/public/project/SHARED_PHYSICS_CLAUDE_REPLY_2026-11-17.md)
- [Original CC0 mannequin](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/public/assets/crowds/mannequin.glb) and [admission/source lock](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/donor/crowds/HOST_ADMISSION.json)
- [Tester](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/evidence/dolls-r1/TESTER_RETURN.md), [Guard](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/evidence/dolls-r1/GUARD_RETURN.md), [Browser](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/616012e55c86731ed995437c2c72ba39b43e3ca8/_inbox/RACER_DOLLS_R1_2026-11-17/evidence/dolls-r1/BROWSER_QA.md)

Receiving repo georg-doc/KFB-Stunt-Car-Race, branch racer/kern-r1, exact verified head `616012e55c86731ed995437c2c72ba39b43e3ca8`. Packet34files + owner Return/Living State updates. Binary downloaded back as base64 and matched exact source bytes/SHA2560edd01b2d8f6c3e071c0569aacd40e56efd643214d607604e726553f5cd3ac88. Main-game integration branch untouched; no new PR/auto-merge.

Existing GPT Site https://kfb-racer-open-world.frizzlebob.chatgpt.site, version8, source main `5e79582d9cb343cec34f54bf366b96084bdd8803`, deployment `appgdep_6afba8dcc0cc81918fb49ba74fe2f091` SUCCEEDED, saved version `appgprj_6afb696ed0748191adfb37df6e9cdac8~appgver_e913147c929c8191985927a84d1e4fdb`. Owner-only audience unchanged. Exact authenticated HTTP200: Werkstatt2026-11-17.4 and matching original mannequin. Browser hosted session reached expected private sign-in gate; interaction proof is matching local source.

Implemented: four source mannequins, original17-batch renderer/sixclips, actualRecastWASM/Detour patrol, pre-solver car-shape sweep transfers same body to dynamic mode, actual positive car manifold confirms hit, static-supported getup then reattach one agent. One world.step and physics owner. Whole-root toppling, not jointed limb ragdoll. Reset/toggle/dispose bounded; hibernation at80m before streamed terrain eviction. Terrain/roads/WFC/material owners retained.

Claude: window.__kfbRacer.contacts().physics.acquire exposes own create/remove body/collider methods, no world.step. dummy_doll physical only; domino/chip/die6/dieN/meeple/pawn/chess/card/soldier/baum/busch recipe only. Both collider masks exclude real-car contact for recipes; physical classes cannot submit recipe loss. Recipe loss still request-only0 pending owner action. Sharedgravity9.81m/s²;13.5authoredthrow factor0.85245 for sameballisticheight/range, flight17.3%longer; actual carvelocity unchanged. Fix accepted:false counting in Claude adapter. Pencil first; textured car look variant remains open.

Tests: independentdolls10/10,lease4/4,port7/7PASS; existinghost/forest7/swap/network/regression27/buildPASS. Actualbrowser819.419Ns/5contacts → getup → walk,4agents/5bodies; toggle5→1→5; Desktop1280x800/mobile390x844. No human audio/look approval/deviceFPS promise.

OpenP2: earlier roadside fall unexplained/notreproduced by3exactterraincases orfinalbrowser; retained, notclaimedfixed. Fourfigures/one bounded area only.

**One next gate:** WS0 receives existing adapters and genuine asset, proves WALK→actual car hit→supported RECOVER→WALK in main-game host, returns exact Receiving-Commit/test evidence. Claude may concurrently wire one recipe class through scoped lease. Active exchange [#133](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/133).
