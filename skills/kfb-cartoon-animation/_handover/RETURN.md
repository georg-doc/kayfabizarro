# RETURN · KFB Cartoon Animation portable skill

Status: **READY_FOR_REVIEW · DRAFT PR · NO MERGE**
Date: 2026-10-03

## Owner / source

Repository: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/kfb-cartoon-animation-skill-v3-2026-10-03`
Draft PR: **#343**
Tested skill + router implementation head: `da1640db3849593c7e69206dc9babbd3b85fba2c`

Canonical entry:
`skills/kfb-cartoon-animation/SKILL.md`

Compatibility:
`skills/kfb-cartoon-animation_v2.md`

Former v2 content:
`skills/kfb-cartoon-animation/references/legacy-v2-full.md`
with byte-identical source blob `302c56489afe1a99a4157968222aa96615c96626`.

## Outcome

The former single-file v2 animation doctrine is now packaged as one portable progressive-disclosure skill suitable for ChatGPT/Claude-style Agent Skills use.

It preserves the existing KFB motion/VFX/ink/audio/camera doctrine and adds focused references for:
- cartoon body mechanics;
- walk/jog/run/sprint;
- starts/stops/pivots and foot truth;
- Travel Modes;
- Blender rigs/actions/NLA/bake/glTF;
- runtime blend/phase/IK/warping/motion-matching strategy;
- keyboard/gamepad/mouse/touch/wheel normalization;
- acting, face/eyes and secondary motion;
- retargeting/motion-library metadata;
- validation and evidence.

## Evidence

- Site Draft audit: PASS.
- Site eval: **10/10 PASS**.
- GitHub package static: **8/8 PASS**.
- legacy v2 byte identity: PASS.
- current router/registry/Hub candidate updated on this branch.
- PR #333 runtime owner untouched.

## Stage / human surface

No Cloudflare Stage was created.
This slice changes a method/skill package, not a new playable/visual product surface; Stage would be a pseudo-human gate.

The existing ActionFigure freeplay under Motion PR #333 remains the correct visual product surface for gait look choice.

## Unresolved / deferred

- Motion PR #333 still has stale prototype-status metadata in `MOTION_STATE_CONTRACT.v1.json`; its current Recovery/Return supersede that status text.
- Georg's Jog/Run/Sprint A/B look choice remains a separate Motion-owner human gate.
- Merge of this skill PR is not authorized automatically.

## Exactly one next gate

**REVIEW_PR_343_THEN_MERGE_DECISION**

Review the portable skill package as documentation/method ownership. If accepted, merge PR #343 deliberately. Runtime gait acceptance remains separate in PR #333.
