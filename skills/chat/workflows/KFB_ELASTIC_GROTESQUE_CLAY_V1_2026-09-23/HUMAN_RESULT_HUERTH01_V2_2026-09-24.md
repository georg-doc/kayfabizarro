# HUMAN RESULT · Hürth 01 V2 · 2026-09-24

Reviewed: the unchanged tested V2 (@`0c59e92d`) at `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`, real Chrome.

## Verdict

**TUNE ONCE → then V2 is the basis for further development.**

Georg: the basic direction looks good. Fix the points below, give the roofs a small overhang, and this becomes the foundation.

## Findings (Georg, from his screenshots)

1. **Doors and windows ignore the rounded form.** They sit as flat plates that do not follow the bowed wall; at the base a door plate stands off the curved wall surface.
2. **Light/shadow artefacts.** Alternating bright/dark stripes and patches ("clipping mask" look) on the roofs and clearly on the ground. Reads as shadow acne / self-shadow banding.
3. **Road seams.** Where road pieces meet, the ribbons are not joined cleanly; wedge-shaped corners/slivers appear at junctions (marked in his last screenshot).
4. **Roofs sit on top instead of belonging.** Make each roof slightly larger than the wall top, a small overhang only, so the base is no longer wider than the roof.

## Scope of the one tune

- 1: place doors/windows on the deformed wall surface (position + normal from the final bowed shell), slightly inset or flush, never floating.
- 2: fix at the light/shadow setup (shadow bias / normal bias / shadow map fit, receive/cast per layer) — do not change the palette or geometry to hide it.
- 3: fix at the road ribbon/junction build so ribbons and junction patches share edges; no overlapping wedges, no gaps.
- 4: small uniform roof overhang derived from the final wall top outline.

Unchanged: V2 form grammar, palette `KFB_WONKY_90S_CLAY_V1`, OSM source, comparison panels.

## Views stay switchable (Georg, same review)

- **Elastic Grotesque Clay is the new DEFAULT view, not the only canon.**
- The existing views (Clean, Cartoon, Grotesque) remain available at any time through a view switch. Do not remove, deprecate or stop maintaining them; every consumer (City Lab, landmarks, look composition) keeps the switch.
- **This tune optimizes Elastic Grotesque Clay only.** The other views are not tuned now; they just must keep working unchanged.

## Review

Publish the tuned app unchanged as a wrapper under `kfb-hub/pruefen/huerth-look/` (replace the base commit) — no bundle, no substitute preview.
For Georg name each fix as one checkable sentence about what is different in the picture.

## After ACCEPT

The tuned V2 is the form-language basis. Continue with `LOOK_COMPOSITION_01_2026-09-24.md` (slice LC-01).

## Start text for the chat

```
Read on PR #194 branch: skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/HUMAN_RESULT_HUERTH01_V2_2026-09-24.md and LOOK_COMPOSITION_01_2026-09-24.md. Apply skills/session-entry-use-what-works_v1.md. Start from the tested V2 @0c59e92d, change nothing else. Elastic Grotesque Clay becomes the default view; Clean/Cartoon/Grotesque stay switchable and untouched. Do the one tune (doors/windows on the curved wall, shadow banding, road junction wedges, small roof overhang), browser-test it, publish it unchanged via the wrapper at kfb-hub/pruefen/huerth-look/ on cloudflare-live, update CHAT_RECOVERY_CURRENT.md, then stop and report four picture-checkable sentences.
```
