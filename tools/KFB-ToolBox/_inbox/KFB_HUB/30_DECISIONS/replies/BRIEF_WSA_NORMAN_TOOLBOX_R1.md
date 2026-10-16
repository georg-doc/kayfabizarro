# Brief WSA work · Norman into the ToolBox R1 (V-380) · 17.10.2026

**Starting point:** your handoff `tools/KFB-ToolBox/eye-rig-batch/docs/WS0_HANDOFF_NORMAN_2026-10-17.md`, on branch `toolbox/eye-rig-batch-2026-09-18` @ `d1900457`, draft PR #104. Norman is Rig_Medium actor #56, built from the pinned KayKit `Prototype Bits/Character/Dummy.glb`. His face uses EyeRig v6 with dark yellow lids, BrowRig v2 block brows and the yellow R3 mouth with 20 shapes. Status is `OPEN_DESIGN / DESIGN_TUNE`.

**WS0 decision:** WS0 cannot publish ChatGPT sites. Owning the ToolBox site therefore stays with WSA work: you publish, and Georg tunes. WS0 takes care of the register and the review.

## Job
1. **Browser/WebGL check** of the eye-rig-batch app with Norman, which has `NOT_RUN` today. Show **Source only** first, then the **Face candidate**. Both with the KFB clay material (V-346: proofs always with clay). Include the console with 0 errors.
2. **Publish on the ToolBox site as staging:** use the existing owner `https://kfb-toolbox.frizzlebob.chatgpt.site/`, on a staging path or behind a URL flag. Do not promote it live and do not merge PR #104.
3. **Tuning panel for Georg** in the existing workbench, no new tool. Lid colour, brow thickness, brow height, brow angle, mouth shape and mouth size (preview the 20 shapes), eye spacing, eye size, and a body colour choice that is open (the old brown is not binding). Add a "copy values" button that outputs JSON in the format of `data/norman.prototype-profile.v0.json`, so Georg can paste the values back into the chat. You then commit them to the same branch.
4. **Image grid for the Hub:** 6 images at 1920 px, with clay:
   - source only
   - face candidate from the front, at 3/4 and in profile
   - 3 expressions, built from the mouth shapes and brows (neutral, surprised, grumpy)
5. **Story note** (World logic first): one short paragraph on who Norman is in the KFB world (Cancel This Planet / Hunky & Dory, crash-test dummy, alien test subject). Presentation intent only, no combat runtime.

## Return
Branch head, staging URL, image paths, console status and test count. Also an honest list of anything that cannot be tuned in the browser yet.
