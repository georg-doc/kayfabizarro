# BRIEF · Work/WSA · Style Reference Browser/Viewer R2 direct repair

Status: **READY FOR CHATGPT WORK/WSA · DIRECT IMPLEMENTATION**
Date: 2026-10-06

## Executor
**ChatGPT Work/WSA**

## Execution mode
**RECOVERY · bounded UI/product repair**

No Claude Design step is required.

## Outcome

Repair the **existing** Style References view inside the existing private Asset Librarian Site so Georg can immediately see and inspect the actual tutorial/reference drawings at useful size.

Primary product test:

> Can Georg open Style References and immediately understand what is actually drawn in the selected reference without opening the original website?

If not, R2 is not done.

## Owner

**KFB Asset Registry / Asset Librarian**

Repo:
`georg-doc/kayfabizarro`

Draft PR:
**#359**

Branch:
`planning/style-reference-library-r1-surface-2026-10-05`

Existing Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Existing project:
`appgprj_6ac1afef08148191b62b95f184bf845e`

**UPDATE EXISTING SITE ONLY.**

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/RETURN.md`
5. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/STYLE_REFERENCE_BROWSER_VIEWER_R2_UX_FINDINGS_2026-10-06.md`
6. current Site project/version/source using Sites tooling

GitHub state overrides chat memory.

## Georg decision

The currently published 58-record Style Reference UX is **HUMAN FAIL**.

Do not route this through Claude Design.

This is a direct Work/WSA repair with a clearly defined target.

## What is wrong

From Georg's direct screenshots/review:

- tutorial drawings are cropped too aggressively;
- the actual reference content is not inspectable at useful size;
- the selected Inspector still exposes only a partial/cropped visual;
- filters/search/intake dominate the first viewport;
- the Asset-style grid/card model is wrong as the primary interaction for tall tutorial/reference boards;
- metadata/URL/provenance visually outweigh the reference itself;
- a user cannot judge the source without leaving the Librarian.

This is not a color/style problem. It is information hierarchy + viewer behavior.

## Required R2 product model

**Browse → inspect complete boards → zoom → collect → compare/use**

Keep Style References as its own mode inside Asset Librarian, but give it a dedicated reference-browser/viewer interaction model.

## Required desktop structure

### A · Compact browse controls

Replace the current large top chrome with:

- one compact sticky search;
- compact filter chips or collapsible filter/sidebar;
- quick filters for:
  - Curated
  - Saved
  - Inspected
  - Source / category
- `+ Add reference` as a secondary action.

Do not keep the permanent large URL-intake form in the main browse viewport.

Do not keep the editorial hero heading if it pushes actual content below the fold.

### B · Visual Gallery

Gallery is a **chooser**, not the inspection surface.

Cards should:

- use useful uncropped or minimally cropped previews;
- preserve the aspect ratio of tall reference sheets;
- show human title + creator compactly;
- show curated/discovery and inspected/saved state compactly;
- retain quick Add to Set;
- avoid raw encoded filenames when curated metadata exists.

### C · Real Reference Viewer

The selected reference visual must become the dominant object.

Implement:

- full reference image/board at useful size;
- portrait/tall-sheet friendly layout;
- Fit width;
- Fit page;
- 100%;
- zoom in/out;
- pan/scroll as needed;
- previous/next reference;
- previous/next board for multi-board sources;
- optional full-screen/lightbox;
- keyboard navigation where practical.

### D · Multi-board rule

For Etherington/tutorial references with multiple actual boards:

- retain one source/reference identity;
- expose all source boards individually inside Viewer;
- board 1 and board 2 must be fully navigable;
- never reduce the source to one cropped hero thumbnail.

If the current data record only stores one preview URL while the source page contains multiple tutorial images, extend the reference presentation data with a non-destructive `visuals[]` / equivalent presentation field.

Do not alter canonical source identity.

### E · Compact metadata/actions

Metadata becomes secondary to the image.

Keep visible but compact:

- title;
- creator;
- source/verification;
- Add to Reference Set;
- inspected state;
- notes;
- construction principles;
- related assets/references.

Put raw URLs, rights strings, source-class enums and technical provenance in collapsible/secondary detail.

### F · Compare

Implement a lightweight Compare mode if straightforward:

- 2–4 references side by side;
- each remains zoomable/inspectable enough to compare;
- Add to Set / remove;
- useful for preparing Claude/consumer reference packs.

If Compare materially risks the core Viewer, ship Viewer first and mark Compare deferred. Do not block the repair on it.

## Mobile

Preserve the existing five-icon navigation if still useful.

Style References mobile must prioritize:

- visual cards first;
- filters in a sheet/drawer;
- full-screen viewer;
- next/previous or swipe;
- persistent Add to Set;
- compact metadata.

## Data / persistence requirements

Preserve all current R1/R1.5 behavior:

- 58 built-in curated/supplementary records;
- local user cards;
- local Reference Sets;
- Notes;
- Construction Principles;
- added tags;
- reference↔asset relations;
- inspected state;
- discovery candidates;
- source isolation gate;
- `kfb.style-reference-pack/1` export.

No localStorage clearing or destructive migration.

## Source image handling

Do not mirror remote copyrighted images into GitHub.

Use existing remote source/preview/visual URLs.

Where canonical tutorial sources expose multiple images:
- resolve/persist presentation-level visual URLs as links;
- keep canonical page URL as source identity;
- do not mark inspected merely because images resolved.

## Existing Asset Librarian protections

Do not break:

- Assets;
- Motions;
- Saved Sets;
- Intake;
- 3D previews;
- shared picker;
- existing mobile nav;
- ToolBox route.

Do not redesign unrelated modes.

## Visual language

Keep current KFB Paper/Dark family.

No:
- generic SaaS dashboard;
- Pinterest clone;
- giant decorative hero;
- replacement branding;
- second navigation shell.

## Acceptance tests

R2 passes only when all are true:

1. Style References opens in the existing Site.
2. Actual reference visuals dominate the selected view.
3. A tall Etherington tutorial sheet can be viewed completely at useful scale.
4. A multi-board reference exposes each board separately.
5. Fit width / fit page / zoom works.
6. Next/previous reference works.
7. Search/filter controls no longer dominate the first viewport.
8. URL Intake is behind a secondary `+ Add reference` flow.
9. Human-readable titles replace raw encoded filenames for curated records.
10. Add to Set / inspected state remain obvious.
11. local Cards/Sets/Notes/Principles survive reload.
12. 58 built-ins remain searchable.
13. source-isolation/export logic still works.
14. Assets/Motions/Saved Sets/Intake regressions pass.
15. 3D previews still work.
16. mobile Style Reference view remains usable.
17. page errors = 0.
18. exact existing Site is updated and visibly verified.
19. no second Site.

### Human acceptance

Automated tests do not close the UX gate.

Final human question for Georg:

> Can you now actually inspect the drawings themselves comfortably inside the Librarian?

## Repair rule

After two non-improving repairs on the same local seam:
- preserve the smallest failing seam;
- Guard classifies it;
- quarantine/defer if not outcome-critical;
- continue the core Viewer repair.

Do not globally stop because Compare, one filter, or one remote image fails.

## INDEPENDENT EXECUTION

Outcome: usable visual-first Style Reference Browser/Viewer R2 in existing Site  
Builder: ChatGPT Work/WSA  
Tester: browser/integration tester  
Critic: short read-only check against Georg's screenshots + this brief  
Guard: Product Guard  
Only writer: Builder  
STOP authority: Guard only  
Human gate: Georg final visual/use review after exact Site verification

## Checkpoints

1. coherent Viewer implementation;
2. browser evidence + regressions;
3. final Return + exact Site identity.

After each GitHub write, fetch exact head + file.
Timeout = UNKNOWN until verified.

## Final Return

Must include:
- repo / branch / PR / exact head;
- exact Site project/version/deployment/source;
- changed components/files;
- before/after screenshots desktop + mobile;
- one tall tutorial reference shown completely;
- one multi-board source navigation proof;
- zoom/fit proof;
- persistence regression;
- Asset/Motion/3D regressions;
- page errors;
- unresolved/deferred items;
- exactly one next gate;
- explicit: no second Site, no merge, no Live promotion.

## Exactly one next gate

**GEORG_REVIEW_STYLE_REFERENCE_BROWSER_VIEWER_R2**
