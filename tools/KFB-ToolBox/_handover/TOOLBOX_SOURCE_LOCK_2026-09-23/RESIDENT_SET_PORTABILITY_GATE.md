# ToolBox · Resident Set Portability Gate · 2026-09-23

Status: **CURRENT P0 BEFORE CLAUDE DESIGN**

## Why this gate exists

Human review across three parallel ChatGPT HTML-preview lanes has repeatedly shown the same failure class:

- model source resolves in one context but not in the exported/review HTML;
- textures disappear or external maps are not found;
- a replacement/fallback model appears instead of the intended source;
- pose/grounding is lost;
- prop attachments or multi-actor composition are lost.

Georg reports roughly ten such preview failures collected across the current chats.

This is now treated as one shared **preview portability problem**, not ten unrelated asset bugs.

The existing browser-3D skill already states the core export rule:

**canonical RAW URLs only; relative `./assets/...` paths are a bug for standalone review transport.**

But URL correctness alone is not enough. We must prove that a complete known-good resident setup survives the review/export boundary.

## New order

Do not start with isolated characters.

Before Claude Design ToolBox integration, prove complete Resident Atlas combinations.

### Set A · Goth Girl

Resident:
`goth-girl`

Why:
- normal rigged character;
- real texture/material path;
- existing animation;
- seated pose;
- stool;
- pose-first grounding / `sitOn`.

This catches:
model + texture + animation + posed grounding + simple scene relation.

### Set B · Orc Warband

Resident:
`orc-warband`

Why:
- Legacy rig;
- multi-part character assembly;
- two-character vignette;
- legacy textures;
- weapons/props;
- attachment rules;
- animation on more than one figure.

This catches:
legacy assembly + texture dependencies + multi-actor + prop attachment + motion.

### Set C · Animatronic

Resident:
`animatronic`

Why:
- two-character vignette;
- explicit texture-variant path;
- guitars / prop relations;
- pose and attachment logic;
- existing custom motion/hold evidence.

This catches:
texture override + multi-actor + complex prop/pose transport.

## Source truth

Use the Resident Atlas as the donor, not hand-recreated copies:

- `tools/resident_atlas_s6/data/cast.js`
- `tools/resident_atlas_s6/lib/atlas.js`
- `tools/resident_atlas_s6/docs/ASSET_MANIFEST.json`
- `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`

Asset policy from the Atlas manifest remains binding:

- exact GitHub source path;
- exact source revision where pinned;
- canonical RAW runtime URL;
- no copied local replacement asset store.

## Review requirement

Build one zero-install review:

`TOOLBOX_RESIDENT_SET_PORTABILITY_REVIEW.html`

For each of the three sets provide:

1. **Donor** — the Resident Atlas setup as source/reference.
2. **Imported** — the same set loaded through the ToolBox/review transport.
3. **Export → reload** — save/export the set state, reload it, compare again.

The review must make failures visible rather than substituting placeholders.

Per set show:

- actor model loaded? yes/no;
- expected texture(s) loaded? yes/no;
- correct source revision/path?
- correct actor count?
- correct pose?
- ground contact?
- prop count?
- prop attachment/placement?
- animation/clip?
- export/reload preserved?

## Hard failure rules

A set is FAIL if:

- an intended model is replaced by a sign/card/primitive;
- a texture silently falls back to flat/default material;
- an external texture dependency is unresolved;
- actor count changes;
- pose is reset;
- a prop loses its attachment;
- an exported set cannot reload to the same visible arrangement.

Do not repair a failed donor by recreating it from prose.

## What comes after

Only after all three resident sets survive the HTML transport do we resume:

1. three FrizzleBob lineage review;
2. complete Studio roster;
3. Stage-First ToolBox integration;
4. Claude Design UI refinement.

The existing good Stage-First UI concept remains useful. It is simply not allowed to sit on top of an unproven asset transport layer.

## One next gate

**TB-RESIDENT-PORTABILITY-01**

Prove Goth Girl + Orc Warband + Animatronic across donor → review import → export/reload.

No Claude Design.
No combined ToolBox rebuild.
No Cloudflare.
No Work.
