# ToolBox / Composer connection · recommendation · V-244

Status: PLAN ONLY · 2026-10-14 · no Composer implementation or retirement executed.

**Recommendation:** keep the existing KFB ToolBox Site as the one authoring entry point. Port Production-08 first, prove Georg's assembled actor against the original, then repair and persist `kfb.pets/1`. Composer becomes a later composition workflow inside this owner. Keep PR #355 intact as a donor until its useful capabilities pass source isolation and compatibility checks.

## Division of work

| Part | Purpose / disposition |
|---|---|
| ToolBox Production-08 | Author one figure: body, face parts, lids, ears, hair, pose and motion. Existing `face-mount.v1` and pinned EyeRig v6 remain the face construction path. |
| Composer PR #355 | Later choose compatible donor body/head/attachments, inspect each source in isolation, fit and assemble a reversible actor recipe. Reuse its donor inspection, rig compatibility, mount/attachment and export capabilities only after actual source isolation. It does not replace ToolBox face authoring or become an EyeRig Studio. |
| Shared actor files | One canonical `data/actors/<id>.kfb-pets.json` per figure. ToolBox, Composer and WS1 consume the same bytes/field names. Pin `source.glb`, commit and blob. Keep v5 and v5b distinct; migrate historical mislabelled v5 explicitly by its v5b source, preserving provenance. Never silently apply another model's profile. |
| Shared modules | Use the same `face-mount.v1`, EyeRig v6, brow/nose/mouth, clay-lid, hair, ear and body modules. Composition orders these modules; it does not reimplement them. Pose/motion/composition recipes remain separately versioned references where their existing schemas require that. |
| EyeRig profiles PR #104 | Import recovered author data through a lossless field mapping into the same actor recipe; preserve original profile, identity, review state and provenance. Geometry owner remains EyeRig v6. ToolBox clay-lids is an inherited option pending consolidation with this owner, not a newly independent eye owner. |

## Save and reload contract

Use an existing, source-verified server-side Site→GitHub adapter. A visitor clicks Save; the server validates signed-in identity, fixed repo/branch and actor path, reads the current blob, writes exactly one actor file using that SHA, and reads the resulting branch head and file back. Report success only after byte-equivalent readback. On timeout: UNKNOWN → inspect; never blindly replay. A conflicting blob produces a visible conflict without overwriting. Keep JSON Import/Export. localStorage may remain a recoverable draft, never the meaning of “saved to GitHub”. The current ToolBox v3 source is static and has no such adapter; connected-app eligibility/schema and the existing donor route must be established before implementation. Do not put GitHub credentials in the client or invent a second persistence service.

## What retires, and when

After ToolBox parity, fixes, durable-save roundtrip and WS0 review pass: archive duplicate standalone authoring entry points and link Composer/EyeRig capabilities into ToolBox. Keep their source/history and accepted profiles. Retire the Composer's duplicate face authoring path only when the shared reader reproduces its accepted output. No deletions, runtime consolidation, redirects or archive changes occur under this plan. Georg reports Composer broken/wrong models; old core/static test passes do not override that product finding.

## Source facts / limits

- ToolBox: `georg-doc/kayfabizarro` source-cut head `7538d602fe100b333407bea2cc1ec59d36b48ff9`, folder `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/TOOLBOX_SOURCE_CUT_2026-10-14_r1/`. 47 source checksums rerun successfully. Georg's recipe is in `data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-14.json`; it assembles v5b, not bare v5.
- Composer: Draft PR #355, `planning/frankenstein-composer-gpt-site-2026-10-04`, observed head `bea811c19b231cfe3b2d34dcf6d85ac7d3bc2a4a`; owning `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/RETURN.md` read. Existing Site v4: https://kfb-frankenstein-composer.frizzlebob.chatgpt.site (not browser-tested here).
- EyeRig: Draft PR #104, `toolbox/eye-rig-batch-2026-09-18`, head `996a4793a829ea1d21464c897c72f4be9c195d1f`; current `tools/KFB-ToolBox/eye-rig-batch/docs/EYERIG_CURRENT_TODO_2026-10-04.md` read. Durable Medium 40/55 profiles are recovery evidence, not the newest human state; 15 missing identities are RECOVERY_OR_PROFILE_TUNE. Do not downgrade remembered later approval or auto-mark imported candidates approved.

**Next integration gate after the ToolBox gates:** WS0 reviews one lossless shared-file/reader contract and a source-isolated Composer donor. No Composer build is authorized by V-244.
