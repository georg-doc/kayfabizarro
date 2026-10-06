# BRIEF · Work/WSA · Import expanded Style Reference data into existing Asset Librarian

Status: **READY · DATA IMPORT / SMALL SITE UPDATE**
Date: 2026-10-06

## Executor
**ChatGPT Work/WSA**

## Outcome
Make the complete curated Style Reference corpus available in the **existing private Asset Librarian Site** without redesigning the Style References UI in this slice.

Existing Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Existing Site project:
`appgprj_6ac1afef08148191b62b95f184bf845e`

**UPDATE EXISTING SITE ONLY.**

## Owner
**KFB Asset Registry / Asset Librarian**

Repo:
`georg-doc/kayfabizarro`

PR:
**#359**

Branch:
`planning/style-reference-library-r1-surface-2026-10-05`

Read current PR/head before work.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. current `RETURN.md` in this handover folder
5. `ETHERINGTON_OFFICIAL_SEED_01.json`
6. `ETHERINGTON_OFFICIAL_SEED_02_ENVIRONMENT.json`
7. `ETHERINGTON_OFFICIAL_SEED_03_COMIC_VFX.json`
8. `ETHERINGTON_OFFICIAL_SEED_04_GRAPHIC_FX_COMIC_LANGUAGE.json`
9. `SUPPLEMENTARY_COMIC_LANGUAGE_SOURCES_01.json`
10. `GRAPHIC_FX_EMANATA_TARGET_TAXONOMY_2026-10-06.json`

Then read the exact current Site project/version/source before editing.

## Data to expose

Built-in curated corpus after this update:

- Etherington Seed 01: 13
- Environment Seed 02: 17
- Comic/VFX Seed 03: 13
- Graphic FX / Comic Language Seed 04: 10
- supplementary professional/academic sources: 5

Expected built-in source/reference records:
**58**

This count does **not** include Georg's browser-local discovery/user cards.

## Important persistence rule

The current Site stores user Reference Cards/Sets locally in the browser.

The update must:
- preserve existing user-created cards/sets;
- add/refresh built-in curated sources separately;
- never clear localStorage or overwrite user notes;
- deduplicate built-ins by stable ID;
- preserve local discovery candidates even when a curated canonical source now exists.

Where a user-created discovery card clearly points to a now-known curated source, offer/reference the curated card but do not silently delete the user's card.

## Source-class handling

Preserve distinct provenance:

- Etherington → `OFFICIAL_CREATOR_SOURCE`
- Blambot → `AUTHORITATIVE_PROFESSIONAL_LETTERING_SOURCE`
- Visual Language Lab → `AUTHORITATIVE_ACADEMIC_VISUAL_LANGUAGE_SOURCE`
- Comics Forum → `ACADEMIC_TERMINOLOGY_SOURCE`
- Comicraft → `PROFESSIONAL_COMMERCIAL_LETTERING_REFERENCE`

Do not relabel supplementary sources as Etherington.

## Graphic FX / Comic Language routing

Expose/search/tag these lanes:

- Graphic FX / Sound Words
- Dialogue Carriers
- Reaction / Performance
- Emanata
- Lettering Integration

Use the KFB proposal taxonomy only as a semantic target map.

Emanata semantic slots from current KFB proposal:
`question · exclamation · sweat-drop · tear · anger-tick · heart · sparkle · gloom-cloud`

Do not make these runtime truth or auto-generate art.

## Known current UI problem — do not redesign here

Georg's 2026-10-06 screenshot shows that the current Style Reference view is not an ideal daily browser:
- search/filter controls occupy most of the top-left;
- URL intake is mixed directly into browsing;
- a direct Blogger image URL becomes a large ugly `DISCOVERY_ONLY` card;
- the right Inspector shows a generic URL placeholder instead of a useful visual;
- the hero headline consumes substantial vertical space;
- actual reference browsing is pushed below the fold;
- browser and source-intake functions compete for attention.

**Do not solve this with a redesign in this import slice.**

Only make the expanded corpus available and keep the current UI working.

A separate Viewer/Browser R2 brief owns redesign.

## Minimal usability guard

For curated built-in records:
- show human title first;
- show creator/source class;
- show useful preview when already resolvable;
- never expose a raw encoded filename as the primary title when curated metadata exists;
- preserve `sourceInspectedInIsolation=false` until actually inspected.

Direct image URLs pasted into Intake remain discovery candidates unless they map deterministically to a known canonical curated source.

## Done when

1. existing Site project updated in place;
2. all **58 built-in curated/supplementary records** are available/searchable;
3. Seeds 01–04 and supplementary pool are deduplicated by stable ID;
4. source classes remain distinct;
5. Graphic FX / Comic Language tags are searchable;
6. KFB Emanata target vocabulary is available as metadata/filtering support, not runtime truth;
7. Georg's pre-existing local cards/sets survive reload;
8. existing Assets/Motions/Saved Sets/Intake regressions still pass;
9. exact Style References deep-link is visibly verified;
10. no second Site;
11. no Viewer/Browser redesign in this slice.

## Protected boundary

No second Site.
No new Registry.
No public mirroring of remote reference images.
No deletion of local cards.
No UI redesign.
No Open World/Resident/ChatterBox runtime write.
No merge / Live promotion.

## Exactly one next gate

**STYLE_REFERENCE_BROWSER_VIEWER_R2_DESIGN_HANDOFF_PREP**
