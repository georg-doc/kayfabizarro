# SimBlood · Flexikon Embed Design Donor

Status: DESIGN DONOR ONLY · 2026-09-18

Purpose:
- give Claude Design a runnable 16:9 layout donor
- reuse the current SimBlood POC interaction/renderer snapshot
- demonstrate a much lighter embed hierarchy than the current app-style POC

This folder is **not** the runtime SSOT.

## Files

- `index.html` — 16:9 embed shell
- `styles.css` — compact article-embed design donor
- `renderer-snapshot.js` — copied snapshot of the current Field Composer POC runtime
- `ui-donor.js` — design-only cell selector popover

## Important

- Pathology buttons are wired to the current POC recipes.
- Pan, wheel zoom, pinch zoom, focus and in-place labels reuse the POC renderer.
- The "Zellen" selector is intentionally a **UX placeholder only**. It is not connected to runtime filtering/focus yet.
- Current WBC source-tile rendering is evidence-only and not the future production asset representation.
- Do not promote this folder over `app/field-composer-poc/`.

## Brief

Read:
`../../_handover/BRIEF_CLAUDE_DESIGN_FLEXIKON_EMBED_v0.1.md`

## Export return

Claude Design ZIP should be placed by Georg under:
`sim-blood/_inbox/`
