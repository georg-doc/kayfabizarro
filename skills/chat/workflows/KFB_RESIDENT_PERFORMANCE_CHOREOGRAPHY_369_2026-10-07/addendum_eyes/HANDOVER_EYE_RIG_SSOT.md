# Handover note · Eye rig needs one SSOT config per character

- **Raised by:** Georg, 2026-10-08, after reviewing #369 addendum 7.
- **Decision (Georg):** the eye rigging must become clean SSOT configs for every character. The existing configs have to be collected and updated into that SSOT.
- **Evidence from #369:**
  - In v1, the Blender lane took the generic anchored mount instead of Georg's tuned values. Every resident squinted outward.
  - In v2, the Blender lane had to collect the tuned values from three different files.
  - Goth Girl is configured somewhere else again (see §2).
- **Status:** note only. No SSOT file is built yet. This needs its own issue.

## 1 · Where eye config lives today (found 2026-10-08)

| # | File | What it holds | State |
|---|---|---|---|
| 1 | `rig-large-reviewed.v1.json` (Hub stage `toolbox/eye-rig-batch`, cloudflare-live; copy in Atlas `data/eye-rig/`) | 4 Rig_Large profiles: monstrosity, black-knight, demon-lord, orc-brute | `ADJUSTED_APPROVED` (Georg 2026-09-20). S38 review: lid colour is the shared fallback `#b58f83`, `pairConfidence` is a constant. |
| 2 | `eye-rig-medium.batch-1.json` (`tools/KFB-ToolBox/_inbox/eye-rig-medium.batch (1).json` @ main `71394636`) | 33 Rig_Medium profiles | 31 `ADJUSTED` (tuned by Georg, never exported as approved). `gothgirl` is `UNREVIEWED` and holds the class default. |
| 3 | `rig-medium-default.v0.json` | Rig_Medium class authoring default: dx 0.295, dy 0.045, ring 0.153, inset 0.4, pupil 0.34, converge 0.18 | Accepted by Georg as a start value only. |
| 4 | `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json` (blob `e87e633`, Pet Studio v5, contract 1.3.0) | **Georg's Goth Girl config:** anchor dx 0.49, dy −0.01, ring 0.32, track 0.06; pupilSize 0.34, gloss 0.9, inset 0, lidFit 0.9; lashes length 0.55, density 8, width 1.1; face `#e6cbc3` | Built on the `goth-biped` graft host, not on `facehost.v1`. Its dx and ring are in a different head unit, so they cannot be copied into the batch path as they are. |
| 5 | `eye-cleanup-01.json` / `eye-cleanup-02.json` + `*_NoEyes.glb` (EYE-CLEANUP-01/02) | Measured eye anchors (seat, normal, radius), measured skin, removed eye islands | Georg PASS for the cleanup. The `anchored-eyes.v1` mount that uses them turns each eye onto the cap normal (about 24° outward). Georg rejected that look for #369. |
| 6 | Atlas `data/cast.js` `eyesOf()` | Witch, Orc Brute, Mummy A/B use the anchored mount (#5) | So one figure can look different depending on which path loads it. |
| 7 | #369 `addendum_eyes/scripts/kfb_eyes.py` | Blender port of the batch path, with the values from #1 / #2 copied inline | Stopgap. It should read the SSOT once the SSOT exists. |

## 2 · Goth Girl

- **Georg (2026-10-08):** he configured Goth Girl differently. The #369 v2 Goth Girl uses the Medium class default, so it is **not** his look.
- **Best candidate for his config:** #4 above (the Pet Studio contract, 2026-09-16), with glossy pupils and lashes. Georg confirms whether that is the right one.
- **Migrating it** means converting the graft-host units to the facehost unit U, or re-tuning it once on the SSOT path.

## 3 · What the SSOT should be (proposal for the issue)

**One record per character**, for example `kfb.eye-config/1`, with:

- **Identity:**
  - `actorId`
  - source GLB + commit
  - `rigClass`
- **Cleanup:**
  - NoEyes file
  - removed island face counts
  - anchors (from #5)
- **Mount:**
  - one named mount path (`facehost-batch`), with the host rule written down
  - the anchors used for seat and size only, never for the look direction
- **Eye:**
  - anchor dx / dy / ring / track
  - inset
  - pupilStyle / pupilSize / gloss
  - converge / splay
  - lidFit
  - oval w / h / d / tilt
  - lashes
- **Colour:**
  - baseColor
  - `faceColorSource`: measured or explicit, never the fallback
- **Motion:** blink and life.
- **Review:**
  - `reviewState`
  - reviewer and date
  - proof render (front and ¾)

**Loading:**

- One loader for every consumer: Atlas, ToolBox, Open World, Blender.
- Class defaults (Medium / Large / Legacy) are inherited, and per-character values override them.
- Local copies are mirrors, never sources (the same rule as `kfb-pets.json`).

## 4 · Next steps

1. Open an issue "Eye rig SSOT for all characters" and decide the owner. The Atlas onboarding names the Animation Lab as the owner of Eye-Rig release.
2. Merge #1, #2, #3 and #4 into the SSOT. Keep each value with its source and `reviewState`.
3. Georg reviews:
   - Goth Girl;
   - the 31 `ADJUSTED` Medium profiles: approve or re-tune.
4. Fix the lid colour source (the S38 findings).
5. Point the Atlas `eyesOf()`, the ToolBox and Blender `kfb_eyes.py` at the SSOT. Re-render #369.
