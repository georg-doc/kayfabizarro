# KFB Sites-First Delivery Policy · 2026-10-04

Status: **CURRENT BINDING DELIVERY OVERRIDE**
Owner: KFB production coordination

## One sentence

**For Site-capable KFB tools, workbenches, authoring surfaces and MVP products, GPT Site is the primary product surface; Cloudflare is a downstream compatibility/public-acceptance mirror when required, not the default build/publish loop.**

## Default contract

```text
GitHub owner/source
→ product QA
→ GPT Site publish/update
→ exact Site URL verification
→ persist Site identity
→ optional/bounded Cloudflare KFB-Hub mirror when required
→ deliberate Live promotion only after named human gate
```

## Primary vs secondary

### Primary · GPT Site

Use for:
- daily tools;
- workbenches;
- authoring environments;
- private review products;
- Site-native World/God Mode;
- current Site-capable MVP product surfaces.

### Secondary · Cloudflare

Use for:
- formal KFB-Hub/pages.dev acceptance mirror where required;
- public/non-authenticated compatibility;
- cross-origin regression;
- legacy/recovery comparison;
- products whose named owner is actually Cloudflare.

Cloudflare is not a substitute when a Site publisher is missing.

## Existing-Site rule

If an owner already has a productive GPT Site:

**update that Site.**

Do not create:
- a second productive Site;
- a parallel Registry/runtime;
- a replacement Site merely because another executor is doing the work.

Current examples:
- EyeRig → one unified Site;
- Audio → one Audio Site;
- Asset Librarian → one Librarian Site;
- Production Hub → one Hub Site mirror.

## Publish-only gate

A publish-only Sites gate must not redesign/repair a QA-green product.

It:
1. consumes exact source;
2. publishes/updates;
3. opens exact Site URL;
4. verifies the expected revision;
5. records project/version/deployment/source identity.

If host publication fails, preserve the source and report host failure.

Do not rebuild the product to fix the host.

## Capability gap

If the current executor has no Sites publishing capability:

- persist exact Site-ready source;
- record `SITES_PUBLISHER_REQUIRED`;
- hand off to a Sites-capable executor.

Do not silently route to Cloudflare.

## Acceptance terminology

Keep distinct:
- `SITE_SOURCE_READY`
- `SITE_DEPLOYED`
- `SITE_VERIFIED`
- `CLOUDFLARE_MIRROR_DEPLOYED`
- `CLOUDFLARE_MIRROR_VERIFIED`
- `HUMAN_ACCEPTED`
- `LIVE_PROMOTED`

A Cloudflare failure does not erase a verified Site.

A Site deployment does not imply human acceptance.

## Current WorldBuilder application

WB2 remains the runtime/world owner.

The World Studio / God Mode product surface is Site-native.

Current delivery intent:

`WB2 runtime/source → World Studio GPT Site → Georg product use/review → bounded Cloudflare KFB-Hub mirror where required`

Do not spend the active MVP recovery loop repeatedly publishing Cloudflare before the Site exists.


## Cost / reasoning firewall · PUBLISH_ONLY

Site publication is a **host operation**, not a high-reasoning production task.

### Binding rule

Once a product candidate is already:

- source-complete;
- QA-green enough for the named human review;
- frozen to an exact GitHub head/runtime closure;

the remaining Site publication task becomes:

`PUBLISH_ONLY`

A `PUBLISH_ONLY` task must be routed to the **lowest-cost / lowest-reasoning executor that has the required Sites publishing capability**.

Do not spend premium/high-reasoning model credits merely to:

- create/update an existing Site deployment;
- upload/copy an exact frozen runtime closure;
- set the existing Site source/version;
- open the returned Site URL;
- record project/version/deployment/source identity;
- update Hub metadata;
- report a host-only failure.

### Forbidden escalation

Wrong:

`cheap/default executor lacks Sites capability → escalate to premium/high-reasoning model`

Correct:

`cheap/default executor lacks Sites capability → preserve exact publish packet → hand off/wait for a Sites-capable low-cost executor`

A capability gap does **not** justify a reasoning-tier upgrade.

### When premium reasoning is allowed

A premium/high-reasoning executor may only re-enter if publication reveals a **real engineering problem** that changes product code or architecture, for example:

- Site build cannot consume the frozen runtime without a code change;
- source closure is incomplete or inconsistent;
- owner/runtime conflict is discovered;
- publication exposes a reproducible product defect requiring implementation repair.

In that case the task is no longer `PUBLISH_ONLY`; it becomes a named engineering/recovery task.

### No product redesign in publish lane

A publish executor must not:

- reinterpret product scope;
- change model/provider strategy;
- refactor the game/tool;
- rebuild a Site from scratch when an owner Site exists;
- switch hosts;
- introduce another runtime/owner;
- add QA gates that were not required by the frozen publish contract.

### Required publish packet

Every expensive build/recovery run must leave a cheap-publishable packet containing at minimum:

- exact repo/branch/head;
- exact runtime/source closure;
- target existing Site project ID when known;
- expected Site URL/owner identity when known;
- publish/update instructions;
- files/assets required;
- current QA status;
- explicit human gate after publication;
- statement that no code change is authorized in `PUBLISH_ONLY`.

The goal is that the expensive reasoning run can end **before** hosting work, without requiring another expensive reasoning run merely to publish.

### Model-choice precedence

For model/reasoning spend:

1. explicit Georg instruction;
2. current cost/reasoning policy;
3. actual capability requirement;
4. generic model recommendation.

A generic recommendation may never reopen a model decision Georg already made.

