# KFB Stage → Live workflow

Status: **DECISION · FIRST ROUTE IMPLEMENTED**  
Human entry: `https://kayfabizarro.pages.dev/kfb-hub/stage/`

## In plain language

**Live** is the last accepted, dependable version.  
**Stage** is the public playground for one named candidate at a time.

A new slice never has to replace the useful version just to become testable.

## The short loop

1. A producing chat changes one bounded slice on its own branch.
2. It returns a changelog, exact revision, real tests and a Stage link.
3. Georg tests the Stage link on desktop or mobile; no GitHub handling is required.
4. Work reviews the return against the project SSOT and owner boundaries.
5. Accepted changes are merged and the Live pointer is moved deliberately.
6. Rejected or unfinished candidates stay Stage/history; Live is untouched.

## Minimum Stage card

Every Stage entry shows:

- what can be tested;
- source owner and revision/PR;
- status (`SOURCE`, `IMPLEMENTED`, `TESTED`, `HUMAN GATE`);
- one clear test question;
- a direct start link;
- a recovery/source link.

The Hub is only a navigator. Project truth remains in the named repository.

## Public URL rule

All human-facing KFB preview, Stage and Live URLs use the KFB Cloudflare publication surface:

- `https://kayfabizarro.pages.dev/kfb-hub/`
- `https://kayfabizarro.pages.dev/kfb-hub/stage/`
- or a named `kayfabizarro.pages.dev/<product-route>/` owned by the relevant tool/project.

Do **not** use raw.githack, rawcdn.githack or similar third-party GitHub-rendering/CDN URLs as active review/publication links. GitHub URLs remain correct for source, commits, PRs and recovery documents. Raw GitHub asset fetches may remain internal runtime source references where the owning contract already uses them; they are not publication surfaces.

A third-party CDN success never counts as a KFB `PUBLIC DEPLOYMENT` or browser PASS.

## Mobile rule

Mobile starts from the public Stage URL. Web/Work chats may prepare briefs, reviews and cloud work,
but local computer files are only available to desktop local work. A mobile idea therefore becomes
a small GitHub-backed slice or brief first; it does not depend on an unshared local folder.

## Promotion rule

Merging a candidate into a clearly labelled Stage path is not Georg acceptance and does not make it
Live. Promotion requires a named accepted revision and updates the Live pointer; no folder is
silently overwritten.
