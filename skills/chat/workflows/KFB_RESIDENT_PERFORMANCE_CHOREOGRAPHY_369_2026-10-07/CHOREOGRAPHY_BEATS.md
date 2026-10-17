# #369 · Choreography beats

**What these are:** semantic beat grammars from the prep spec §7, mapped to body recipes. No dialogue text is in any clip.

**Notation**
- `KK:` / `ML:` / `NEW:` are clip sources.
- `fNN` = Blender scene frame at 24 fps (seconds = NN / 24). The ML / KK glTF clips were imported on a 24-fps timeline. Catalog events are at 30 fps (e.g. `offerReady` 30 @30 fps = f24).
- **Exception:** the NEW shrug is indexed by its own 30-fps sample number (peak = sample 8 = 0.27 s).
- `pose:` / `rel:` / `micro:` name layers from `data/kfb_perf_layers.json`.
- `yaw` / `pos` are runtime staging (navigation / encounter owner), never baked into a clip.

## Storyboards on real residents (EEVEE, Blender 5.2)

| Id | Encounter | Residents | File | Per-beat data |
|---|---|---|---|---|
| E1 | Fluff share (fixture `encounter.fixture.fluff-share`) | Farmer_B → Lorekeeper (M↔M) | `PREVIEWS/BEATS_E1_FluffShare_FarmerB_to_Lorekeeper.jpg` | `data/beats_E1.json` |
| E2 | Gift with held POP | Lorekeeper → Goth Girl (M↔M) | `PREVIEWS/BEATS_E2_Gift_Lorekeeper_to_GothGirl.jpg` | `data/beats_E2_E3.json` |
| E3 | Trade offer → doubt → decline | Orc Brute ↔ Farmer_B (L↔M) | `PREVIEWS/BEATS_E3_TradeDecline_OrcBrute_FarmerB.jpg` | `data/beats_E2_E3.json` |
| E4 | Repair / rebuild with Fluff | Farmer_B + Orc Brute + wheelbarrow | `PREVIEWS/BEATS_E4_RepairRebuild_FarmerB_OrcBrute.jpg` | `data/beats_E4.json` |

All 26 beats:
- head / hat / glasses mesh overlap between the two actors = **0 triangles**;
- lowest toe joint ≥ 0.014 m. Idle reference is 0.026 m (M), so the drop is ≤ 1.2 cm, during walking.

## Greeting · `approach → notice → orient → acknowledge → short reaction → resume`

| Beat | Body | Event |
|---|---|---|
| approach | locomotion (owner: navigation) | — |
| notice | KK:Idle_A + `pose:curious` (or `pose:attentive` while carrying) | PlayerApproached / EncounterBeat notice |
| orient | yaw to target; `rel:turn_toward` if < 40° | EncounterBeat orient |
| acknowledge | `micro:nod`; M wave = **KK:Waving** (native), L wave = ML:gesture_waving_gesture_a | EncounterBeat greet |
| short reaction | affect row in AFFECT_BODY_MAPPING | ReactionPulse |
| resume | settle 12 f → activity clip | RESUME_ACTIVITY |

## Gift · `approach → offer → receive → inspect → reaction → thanks → resume` (E2)

| Beat | Giver | Receiver | Measured |
|---|---|---|---|
| approach / notice | KK:Holding_C + `pose:attentive`, gift in hands | KK:Idle_A + `pose:curious` | — |
| offer | ML:gift_give_a f24 (= `offerReady` 30 @30 fps) | ML:gift_receive_a f24 | 1.14 m spacing |
| receive | gift_give f40 (`release` 50 @30) | gift_receive f32 (`grab` 40 @30, starts 10 f later) | hand-meet residual 0.016 m |
| inspect / POP | KK:Idle_A + `pose:open_soft` | KK:Holding_C + `micro:recoil`; lid POP is a **runtime prop animation** (PR #358 timing JSON) | — |
| reaction | `micro:soft_nod` | M: **KK:Cheering** (native) · L: ML:react_delighted_a | ML delighted / cheering on M hit the head → seam U1 |
| thanks / resume | KK:Walking_A away | KK:Idle_A + `pose:open_soft` | — |

## Trade · `orient → show → offer/request → exchange → inspect → pleased/doubt → resume` (E3)

| Beat | Seller | Buyer |
|---|---|---|
| orient | `pose:attentive` | `pose:curious` |
| show / offer | L: ML:gift_give_fit_a f24 (0.88 m gift) · M: gift_give_a | KK:Idle_A + `pose:attentive` |
| inspect | hold give f30 | KK:Interact f12 + `pose:curious` |
| doubt | hold | **NEW:kfb_perf_shrug_a** (peak sample 8 = 0.27 s) |
| decline / counter | ML:react_contradict_a | `pose:guarded_asym` |
| accept (alt.) | gift_give release | gift_receive → ML:idle_happy_a |
| resume | KK:Idle_A + `pose:closed_asym`, yaw away | KK:Walking_A |

**Cross-rig exchange L→M is not solved** (seam U3). E3 beat 4 shows it: the Orc's offered gift hovers above the Farmer's hat.

| Variant (`data/crossrig_handover_measure.json`) | Hand-height gap | Farmer hand gap |
|---|---|---|
| gift_give_fit (Orc) vs gift_receive (Farmer), no layers | 1.43 m | — |
| + Orc bow 45° | 0.29 m | — |
| + Farmer arms-up 30° | 0.03 m | 0.11 m (cannot hold any gift) |

Neither Large place / pick clip gets the Orc's hands below 1.08 m (`data/ground_handover_measure.json`), so a ground handover is not available either.

**Options for Georg / world design:**
- (a) a counter / stall surface at Medium hand height: Orc places, Farmer picks up, reusing existing clips;
- (b) a new Large "low give / kneel offer" clip.

## Fluff exchange · `carry/roll → stop → offer/share → transfer → reaction → continue` (E1)

| Beat | Farmer_B | Lorekeeper |
|---|---|---|
| carry → stop | KK:Holding_C + `pose:attentive`; Fluff at palms (0.19 m from palm, r 0.21) | KK:Idle_A + `pose:curious` |
| orient / greet | Holding_C + `rel:lean_toward` | `pose:attentive` + `micro:nod` |
| offer → transfer | gift_give f24 → f40 | gift_receive f24 → f32 |
| reaction | KK:Idle_A + `pose:open_soft` → ML:idle_happy_a (pleased) | Holding_C + `micro:recoil` (surprise) → `pose:open_soft` + `micro:soft_nod` (grateful) |
| continue | KK:Walking_A | Holding_C, turns to own route |

**Rolling instead of carrying:** ML:fluff_roll_push_a / steer (PR #356) stop → KK:Idle_A, then the same handover with a Small ball. A Medium ball is pushed, not handed over.

## Farmer daily work · `start → walk → source → harvest → gather → carry/roll/push → deposit → interruption → resume`

| Beat | Body | Source |
|---|---|---|
| harvest / dig | KK:Digging (Atlas pose for farmer_b), KK:Dig, ML:interaction_pull_plant_a, ML:interaction_pick_fruit_a | KK native / ML |
| gather | ML:fluff_collect_debris_a | PR #356 |
| carry | KK:Holding_A/B/C; walking: ML:holding_walk_a/b/c, box_walk | KK / ML |
| roll / push | ML:fluff_roll_push_a, roll_push_heavy_a, steer_left/right_a; Medium on Large ball `*_big_a` | PR #356 |
| team push | `roll_push_big_a` × 2–3 workers (PR #356: gap 0.30–0.37 m) | PR #356 |
| deposit | ML:fluff_place_small_a, ML:interaction_wheelbarrow_dump_a | ML |
| interruption | greeting grammar, brief-only; keep feet; `rel:turn_toward` ≤ 40° | layers |
| resume | settle → previous activity clip | — |

## Repair / rebuild · `inspect damage → fetch → carry/roll → knead/place/flatten/patch → inspect result → relief/pride/celebrate → next task` (E4)

| Beat | Rig_Medium (Farmer_B) | Rig_Large (Orc Brute) |
|---|---|---|
| inspect damage | KK:Interact f12 + `pose:curious` | ML:interaction_picking_up_object_a f48 |
| fetch / carry | KK:Holding_C + Fluff | KK:Idle_A + `pose:guarded` (waits; carries nothing) |
| knead / place | ML:fluff_place_small_a | ML:fluff_knead_press_a |
| patch / flatten | ML:fluff_patch_press_a | ML:fluff_pack_flatten_a |
| inspect result | KK:Interact + `pose:attentive` | KK:Idle_A + `pose:proud` |
| celebrate | **KK:Cheering** (native) | **KK:Flexing** (native) |
| next task | KK:Walking_A | KK:Walking_A |

**E4 limits:**
- With the Small ball the Orc knead / flatten hands float. The Large work chunk sizes from PR #356 Part 2 must be used.
- There is no damage / rebuild prop yet: a tipped KayKit wheelbarrow stands in.
- The Fluff merge → rough mass → final prop grammar from prep §9 is supported by these clips. Assembling the building itself is a later runtime-consumer job.

## Disagreement · `state → counter → (shrug / contradict) → resolve | leave`

| Step | Body |
|---|---|
| state | ML:talk_talking_a |
| counter | ML:react_contradict_a (BONGO.), ML:gesture_thoughtful_head_shake_a |
| doubt / ask back | NEW:kfb_perf_shrug_a (BOGGLE?) |
| escalate | ML:react_outraged_a; PR #358 Bizarro chain contradict → dizzy → faint |
| resolve | `pose:open_soft` + `micro:soft_nod` |
| leave | ML:react_dismiss_a (Blödsinn…) + runtime turn + walk |

## Composer notes for the integrator

- **Arbitration order** (contract §5): locomotion > gameplay action > staging > gesture > reaction > base pose > ambient.
  - Gesture clips replace the arms.
  - Base-pose layers stay underneath as COMBINE.
- **Layers on activity clips:** apply them to spine / chest / head only (not arms) unless the activity clip has free arms.
- **Native-first on Rig_Medium for raised hands:** KK:Waving and KK:Cheering. KK has no Holding / Interact / Waving clips for Rig_Large; use ML for those.
