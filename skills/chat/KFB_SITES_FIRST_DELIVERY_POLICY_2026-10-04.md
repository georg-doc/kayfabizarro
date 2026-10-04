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
