# EyeRig current TODO · 2026-10-04

Status: **RECOVERY-AWARE · DO NOT TREAT THE 40-PROFILE EXPORT AS THE LATEST HUMAN STATE**

Owner: KFB ToolBox / EyeRig v6  
Draft PR: #104  
Unified Site: https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/

## Global presentation rule

Integrated KFB characters use **EyeRig v6 by default**.

- Untouched source eyes may be shown only in a labeled source-isolation / donor-proof view.
- Integrated Site/game/preview screenshots hide/replace source eyes and mount EyeRig v6.
- Use the newest approved/recovered actor profile when available.
- If no approved profile exists, use the existing source-derived candidate and mark `PROFILE_TUNE`.
- Do not fall back to stock eyes as the ordinary integrated presentation.
- No second eye system.

## Recovery first

The unified Site is functional, but its current Medium profile state is older than Georg's last remembered Cloudflare-Stage authoring session.

Newest durable Medium export currently found:
- `eye-rig-medium.batch (2).json`
- 40 profiles
- 2 `ADJUSTED_APPROVED`
- 37 `ADJUSTED`
- 1 `UNREVIEWED` (GothGirl)

Dropbox was re-searched on 2026-10-04. No newer Medium batch export was found. The later approval state is therefore still presumed to exist only in the old Stage origin's browser LocalStorage until Georg exports it.

**First TODO:** open the old Stage in the same browser profile and Export Batch before reclassifying Medium actors.

Old Stage:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/

## Medium · status unknown / no profile in the latest durable 40-profile export

The current Medium roster has 55 identities. These 15 are absent from the durable 40-profile export:

1. Orc Raider
2. Paladin
3. Paladin · Helmet
4. Marksman
5. Hiker
6. **Robot One**
7. **Robot Two**
8. Tiefling
9. Superhero
10. Monster Costume · Alt
11. Werewolf Man
12. Plant Warrior
13. Helper A
14. Helper B
15. Space Ranger

Treat these as **RECOVERY_OR_PROFILE_TUNE**, not automatically as never-rigged. The missing later Stage export may contain newer state.

### Active-product Medium priorities

Because they are already used by current production slices, check these first after recovery:

- **Robot One** — Fluff worker; absent from durable 40.
- **Robot Two** — Fluff worker; absent from durable 40.
- **GothGirl** — Resident; present in durable 40 but only `UNREVIEWED` there.
- **Clown** — Resident; durable state `ADJUSTED`; later approval state unknown.
- **Witch** — Resident; durable state `ADJUSTED`; later approval state unknown.
- **Lorekeeper** — Resident; durable state `ADJUSTED`; later approval state unknown.
- **Skeleton Minion** — Fluff worker; durable state `ADJUSTED`; later approval state unknown.
- **Combat Mech** — current production actor; durable state `ADJUSTED`; later approval state unknown.
- **Survivalist** — durable state `ADJUSTED`; still needs the separate per-eye/eyepatch capability when that detail slice resumes.

## Large · durable state

Current Large roster: 8.

Durably `ADJUSTED_APPROVED`:
- Monstrosity
- Black Knight
- Demon Lord
- **Orc Brute**

Still outside the durable reviewed profile set:
1. FrostGolem
2. 4GTN
3. 4GTN Forgotten
4. Clanker

These four are **PROFILE_TUNE / REVIEW** unless a newer local Stage state proves otherwise.

## Legacy · durable state

17/17 Legacy head identities have generated EyeRig candidates, but the durable file still marks them `UNREVIEWED`.

Families:
- Barbarian default / A / B / C
- Knight default / A / B / C
- Mage default / A / B / C
- Rogue default / A / B / C
- Skull

For the first 16, this is primarily **human visual review / tuning**, not missing EyeRig generation.

**Skull** remains `HUMAN_REQUIRED`: source-eye cleanup/placement is not safe for automatic completion.

## Known special follow-ups

- Survivalist: per-eye visibility / eyepatch proof.
- Farmers A/B: exact texture → actor mapping remains source-gated.
- selected Blender/NoEyes cases: source-eye cleanup still needs explicit resolution.
- appearance variants reuse geometry/profile; do not create duplicate EyeRigs merely for palette variants.

## Hub semantics

Hub labels must distinguish:
- `RECOVER` = newer Georg-authored local state may exist but is not durable;
- `PROFILE_TUNE` = actor has source/adapter path but no durable accepted profile;
- `HUMAN_REVIEW` = generated candidate exists, needs Georg visual decision;
- `HUMAN_REQUIRED` = automatic source-eye cleanup/placement is unsafe;
- `APPROVED` = durable reviewed profile exists.

Do not collapse these into one fake "not rigged" status.
