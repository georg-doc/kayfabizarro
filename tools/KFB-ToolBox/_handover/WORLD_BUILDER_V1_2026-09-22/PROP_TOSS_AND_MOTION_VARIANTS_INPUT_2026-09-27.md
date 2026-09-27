# WorldBuilder consumer input · Motion variants + Brick Fish prop toss · 2026-09-27

Status: **ADDITIVE CONSUMER INPUT · NOT IMPLEMENTED**  
Owner retained: existing WorldBuilder / Travel movement and world runtime  
Source owners retained: KayKit motion sources + KFB Motion Library / ToolBox motion metadata  
Town design reference: `skills/chat/town/references/KFB_PROP_TOSS_BRICK_FISH_2026-09-27.md`

## Requirement

Future WorldBuilder character movement should not expose only one generic jump and one generic action.

Consume the existing motion sources by semantic role, while WorldBuilder remains the only movement/collision/grounding owner.

## Jump family to expose

Existing KayKit Rig_Medium source evidence already includes:
- `Jump_Start`
- `Jump_Idle`
- `Jump_Land`
- `Jump_Full_Short`
- `Jump_Full_Long`

The current Travel/WorldBuilder movement donor already discovers the full-jump candidates. Preserve that and expose a deliberate short/long choice when the active actor actually binds the clips.

KFB Motion Library v2, PR #213, additionally contains:
- `kfb_locomotion_jump_a`
- `kfb_locomotion_running_jump_a`
- `kfb_locomotion_joyful_jump_a`
- `kfb_locomotion_unarmed_jump_a`
- `kfb_locomotion_jumping_up_a`

Suggested roles:
`jump.short`, `jump.long`, `jump.running`, `jump.up`, `jump.joyful`, plus `jump.start/air/land`.

World physics owns the legal trajectory/landing. Animation supplies body performance. Root-motion clips require an explicit movement-owner handshake.

## Throw family to expose later

Preferred KFB social prop interaction uses several throw styles chosen by distance/situation.

Current v2 candidates:
- `kfb_action_baseball_pitching_a`
- `kfb_action_quarterback_pass_a`
- `kfb_action_fireball_a`

Current KayKit source evidence:
- `General/Throw`

Do not classify throw distance from filename or net root travel alone. ToolBox/Animation work must measure release hand/frame and approach/recovery before WorldBuilder selects these automatically.

Suggested roles:
`throw.quick`, `throw.short`, `throw.medium`, `throw.long`, `throw.runup`, `throw.exaggerated`.

## Brick Fish

Default future tossable prop:
**Brick Fish** — red clay brick/fish hybrid, also the recurring **Red Herring** MacGuffin/gag.

WorldBuilder does not model or register it independently. It consumes the KFB-owned asset + tossable metadata from the established asset path.

## Boundary

No second AnimationMixer owner, no second locomotion writer, no new keyboard owner and no standalone review page.

First useful proof later:
two actors in the real WorldBuilder, real Brick Fish, one close throw, one longer throw, one hit, one miss, one retaliation, clean recovery.
