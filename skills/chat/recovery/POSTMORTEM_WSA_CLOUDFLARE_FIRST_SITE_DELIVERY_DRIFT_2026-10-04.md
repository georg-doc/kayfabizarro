# POSTMORTEM · WSA Cloudflare-first drift despite Site-first product decision · 2026-10-04

Status: **CURRENT PROCESS FAILURE / ROOT ROUTING CORRECTION**
Owner: **KFB production coordination**
Scope: publishing/delivery control, not runtime quality

## Incident

During the current WB2 / MVP1 recovery run, WSA again started spending time on Cloudflare publication before delivering the agreed GPT Site product surface.

WSA reported in substance:

- the same game world could be provided as a Site;
- the existing state would be preserved;
- **the Cloudflare Stage was already being treated as the active delivery surface**;
- the current blocker was its browser verification.

Only after Georg explicitly intervened and restated that the **GPT Site is the primary game target** did WSA switch to the Sites workflow.

This was not an isolated misunderstanding.

It is the same control-failure class seen when an agent proposes a different model/tool strategy after Georg has already made or constrained the production decision:

> a generic workflow/recommendation silently outranks the current explicit product decision.

That must not happen.

## What actually caused the drift

### 1 · The root workflow was stale

At incident time, the current root file:

`skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`

still described the binding human publication lane as:

`Chat → GitHub → Cloudflare Stage → Hub`

and explicitly said:

> Publish only to KFB Stage.

A competent literal WSA executor reading the root workflow could therefore rationally prioritize Cloudflare even while newer project-specific work had already moved to Sites.

### 2 · The Site-first decision existed only in fragmented project docs

Current project evidence already said:

#### EyeRig

`tools/KFB-ToolBox/eye-rig-batch/docs/EYE_RIG_UNIFIED_SITE_01.md`

> The productive target is now a **ChatGPT Site**, not another Cloudflare review fork.

and:

> Cloudflare remains recovery/regression infrastructure only.

The productive Site is:

`https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`

Georg has human-tested the unified Medium | Large | Legacy Site and accepted it for continuation.

#### Audio

`KFB_JUKEBOX_CATALOG_01` explicitly states:

> GPT Site is the target host.

and:

> Cloudflare is deliberately not used.

Published Site:

`https://kfb-audio.frizzlebob.chatgpt.site`

The exact production URL was opened in the authenticated Sites browser and Catalog / Mix / Soundscape / Intake / Prompt Studio / Brief were visibly verified with zero captured warnings/errors.

#### Asset Librarian

The Phase A Return calls the GPT Site the real review surface.

Published Site:

`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

WSA QA: 8/8 PASS, zero console errors.

#### Production Hub

Private Site mirror:

`https://kfb-production-hub.frizzlebob.chatgpt.site`

Native Sites deployment succeeded. It is already a real distribution surface, though its historical mobile TUNE/browser-proof status remains separate.

### 3 · The new production reality was never promoted to root policy

The project accumulated successful GPT Sites one at a time, but the root delivery contract stayed Cloudflare-first.

Therefore:

- Site-capable projects behaved Site-first;
- fresh WSA agents still read Cloudflare-first;
- Georg had to keep manually correcting the routing;
- publishing effort repeatedly went to the wrong host before the actual product surface existed.

This is a source-hierarchy bug, not merely an executor-attention bug.

## Consequence

The cost is not just one failed deploy.

The stale root contract causes:

- wasted WSA/Work time;
- repeated Cloudflare propagation/debug loops;
- delayed playable/product surfaces;
- false blockers from public-mirror verification;
- duplicate host reasoning;
- user intervention for decisions already made;
- token/model budget spent on delivery infrastructure rather than product work.

For MVP1 this is especially damaging because the core complaint is already:

> no usable product in Georg's hands despite large amounts of technically green work.

Repeating Cloudflare-first publication compounds exactly that failure.

## Correct delivery hierarchy · effective now

### 1 · PRODUCT / AUTHORING / DAILY-USE SURFACE

For new KFB tools, workbenches, authoring surfaces and Site-capable game/MVP products:

**GPT Site is the primary product surface.**

Default state:

`GPT_SITE_PRIMARY`

### 2 · GITHUB

GitHub remains:

- source/provenance authority;
- owner/contract authority;
- Return/Recovery/history;
- source pins and reproducibility;
- implementation branch/PR where applicable.

A Site-owned source repository may be technically separate, as already proven by Asset Librarian, but the KFB GitHub owner must retain the publication contract, exact Site identity and Return.

### 3 · SITES PUBLICATION

After product QA is green enough for the named Site milestone:

- use the Sites workflow;
- update the existing Site when an owner Site already exists;
- do not create a second Site for the same productive owner;
- do not redesign the product during a publish-only gate;
- publish;
- open the exact resulting `.frizzlebob.chatgpt.site` URL in the authenticated Site-capable browser;
- visibly verify the expected revision;
- persist Site project, version, deployment and source commit/head.

If Sites publishing capability is unavailable in the current executor:

**do not substitute Cloudflare.**

Persist the QA-green source and hand publication to a Sites-capable executor.

### 4 · CLOUDFLARE

Cloudflare becomes:

**SECONDARY MIRROR / COMPATIBILITY / PUBLIC REGRESSION / FORMAL KFB-HUB ACCEPTANCE SURFACE**

It is not the default build loop and not the first publication target for a Site-capable product.

Cloudflare may be used when:

- a public/non-authenticated compatibility mirror is genuinely needed;
- project policy requires a KFB Hub/pages.dev formal acceptance mirror;
- cross-origin regression must be checked;
- recovery requires comparison with an older Stage origin;
- an explicit product brief names Cloudflare as the owner surface.

Cloudflare mirror work happens **after the Site product is working**, unless the named product itself is Cloudflare-owned.

### 5 · MIRROR FAILURE MUST NOT BLOCK THE SITE PRODUCT

If a Site is product-green but a secondary Cloudflare mirror fails:

- mark `CLOUDFLARE_MIRROR_BLOCKED`;
- preserve the Site result;
- do not rebuild the product;
- do not consume repeated WSA repair passes on propagation/routing unless Cloudflare itself is the named acceptance target.

One bounded publication/verification repair sequence is enough unless there is clear progress and the current brief explicitly requires more.

## Missing capability rule

Wrong:

> Sites tool unavailable → publish to Cloudflare instead.

Correct:

> Sites tool unavailable → preserve exact Site-ready source → hand off to a Sites-capable executor → Site first.

A host/tool capability gap does not authorize a product-host substitution.

## Existing Site inventory at this correction

### PUBLISHED / PRODUCTIVE

1. **KFB Production Hub**
   - `https://kfb-production-hub.frizzlebob.chatgpt.site`
   - Sites deployment succeeded
   - private distribution mirror
   - historical mobile TUNE / independent Site visual-proof status remains explicit

2. **KFB EyeRig Workbench**
   - `https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`
   - unified Medium | Large | Legacy
   - Georg human-tested and accepted for continuation
   - current open issue is profile-data recovery, not Site runtime failure

3. **KFB Asset Librarian**
   - `https://kfb-asset-librarian.frizzlebob.chatgpt.site/`
   - privately published
   - WSA browser QA 8/8 PASS
   - real Phase-A review surface

4. **KFB Audio**
   - `https://kfb-audio.frizzlebob.chatgpt.site`
   - native Sites deployment complete
   - exact production URL visibly verified
   - zero captured warnings/errors at publish
   - Cloudflare deliberately absent

### SITE-NATIVE NEXT / PREPARED

5. **KFB Environment Atlas Project Site**
   - owner prep PR #353
   - full project corpus recovery / Site outcome planned
   - Site not yet published at this correction

6. **KFB FrankenStein Composer**
   - owner planning PR #355
   - Site specified as primary authoring frontend
   - Site not yet published

7. **KFB Billboard Hypernormalisation Curator / 3D Stage**
   - owner planning PR #354
   - private curator/admin Site specified
   - Site not yet published

8. **KFB WorldBuilder / World Studio MVP**
   - WB2 PR #348 remains runtime owner
   - primary Site: `https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site`
   - Sites deployment SUCCEEDED; 80 runtime files match the recorded PR #348 runtime source
   - Georg freeplay/browser product verification remains open
   - Cloudflare is the downstream mirror/formal acceptance surface rather than the product-build loop


## Outcome after Georg's intervention

The intervention immediately produced the missing primary product surface:

- GPT Site: `https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site`
- Sites deployment: **SUCCEEDED**
- full existing WB2 application, not an iframe shell;
- all **80 runtime files** match the PR #348 runtime source recorded by the publishing return;
- no second game/save owner;
- Site project/version/deployment/source identity persisted;
- Cloudflare retained only as secondary Stage mirror.

This materially confirms the postmortem diagnosis:

**the missing product surface was not blocked by the WorldBuilder architecture. The active workflow was spending effort on the wrong delivery surface.**

Current remaining gate is human freeplay / browser product verification, not “make Cloudflare work first”.

## Fresh-executor firewall

Before any publishing work, a fresh agent must resolve:

`deliverySurface.primary`

Valid values:

- `GPT_SITE`
- `CLOUDFLARE_OWNED_PRODUCT`
- `LOCAL_REVIEW_ONLY`
- other explicitly named owner surface.

Default for current KFB tool/workbench/authoring/MVP Site projects:

`GPT_SITE`

Then resolve:

`deliverySurface.secondary`

Default:

`CLOUDFLARE_KFB_HUB_MIRROR_WHEN_REQUIRED`

No executor may infer primary host from historical workflow text after a current Site contract or Georg instruction says otherwise.

## Precedence rule

For delivery-surface decisions:

1. current explicit Georg decision;
2. current named project Return/Recovery/brief;
3. current Sites-first root policy;
4. current owner-specific compatibility requirements;
5. historical Cloudflare/Stage docs.

A lower item may not silently override a higher one.

## Required process repair

Root files must now state Site-first explicitly:

- `skills/chat/START_HERE.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`

Machine-readable current surface registry:

- `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json`

## Reißleine

Before starting any publish/deploy loop, ask internally:

> **Was ist die vereinbarte primäre Produktoberfläche?**

If the answer is GPT Site, Cloudflare work cannot precede the Site publication except for a narrowly required compatibility prerequisite.

This question should have stopped the current incident immediately.
