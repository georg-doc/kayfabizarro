# ITHappy Creative Characters · Licence Guard for KFB

**Date:** 2026-09-15  
**Status:** SOURCE-BASED LICENCE READING / PROJECT GUARD. Not legal advice and not a new KFB owner contract.  
**Scope:** paid ITHappy assets under the current One-Time Purchase / Standard Licence; free assets have a separate policy.

## Current official source facts

The ITHappy One-Time Purchase Licence Agreement is currently marked **last updated 7 September 2026**.

For paid assets under the Standard Licence it explicitly permits:

- commercial and non-commercial games/applications/other Products;
- modifying and adapting the Assets;
- distributing and selling Products that incorporate the Assets;
- third-party work on Products under the Licensee's direct control, subject to the licence terms;
- five team seats per single licence purchase unless otherwise agreed.

It explicitly prohibits, among other things:

- resale/redistribution/commercial exploitation of the Assets as standalone items;
- sublicensing/transferring the licence without permission;
- using the Assets as input to generative-AI programs or including them in generative-AI datasets;
- standalone sale/distribution of rendered 2D images outside the permitted Product/promotional context.

Modifying an Asset does not transfer ownership of the underlying Asset or expand the licence beyond the permitted Product use.

Official source:
`https://ithappystudios.com/one-time-purchase-licence-agreement/`

## KFB interpretation for paid Creative Characters

### ALLOWED UNDER THE CURRENT TEXT · high confidence

For KFB Products, the licence text supports conventional modification workflows such as:

- Cartoon Deformer / lattice / bend / squash / stretch / proportional deformation;
- mesh edits and cleanup;
- material, palette and texture adaptation;
- re-rigging or adding KFB rig/attachment metadata;
- animation adaptation;
- combining/recombining compatible purchased character parts;
- Frankensteining purchased ITHappy parts into a KFB character used inside a KFB game/application;
- creating KFB-specific variants from purchased assets for use inside the licensed Product.

These are all best treated as `ADAPTED/MODIFIED LICENSED ASSETS`, not as newly owned standalone KFB asset IP.

### IMPORTANT DISTRIBUTION GUARD

The final KFB game/application may contain the modified assets, but KFB must not become a way for users to obtain the ITHappy assets or derivatives as standalone reusable 3D files.

Therefore:

- **internal/private ToolBox:** conventional deformation/rigging/frankensteining is within the normal Product-development workflow;
- **shipping game/runtime:** modified assets embedded in the Product are within the stated licence grant;
- **public ToolBox with GLB/FBX/OBJ export:** LICENCE REVIEW REQUIRED before exposing ITHappy-derived geometry, because a reusable exported model could become standalone redistribution rather than mere incorporation into the Product;
- **selling/downloading a KFB character pack made from ITHappy parts:** do not do this under the ordinary Standard Licence without written permission.

### GENERATIVE-AI GUARD

Current Section 4.1(d) prohibits using the licensed Assets as inputs to generative-AI programs.

For KFB this means:

- deterministic Three.js/Blender/cartoon-deformer code: **OK in principle**;
- conventional Blender modifiers, rigging, scripted mesh transforms, material tools: **OK in principle**;
- asking an LLM to write generic deformation/adapter code without receiving the ITHappy mesh/textures: **OK in principle**;
- uploading the ITHappy mesh, texture, screenshots/renders derived specifically for asset transformation, or other asset content to Gemini/Meshy/another generative-AI system as input: **NOT covered by the current Standard Licence**;
- if an AI-assisted asset-processing workflow is desired, obtain written permission or the appropriate dedicated licence first.

## Free-pack difference

The official Free Asset Usage Policy is stricter for free assets: modified derivatives may only be distributed as part of a Final Product, and on-demand / do-it-yourself services are expressly prohibited. Therefore the free 30-asset Creative Characters pack is suitable for internal technical measurement and a contained KFB test Product, but should not be used as the basis for a public asset-export/customization service.

## Recommended KFB rule

For ITHappy onboarding:

`licensed source -> conventional KFB deformation/rigging/frankensteining -> embedded KFB Product`

is the safe default path.

Keep these paths separate:

`source asset` / `modified internal working asset` / `embedded runtime asset` / `publicly exportable asset`.

Only the last category requires an explicit additional licence decision before exposure.

## Status vocabulary

- **SOURCE FACT:** modification/adaptation and incorporation into Products are explicitly permitted for paid Standard-Licence assets; standalone redistribution and generative-AI input are prohibited.
- **PROJECT INTERPRETATION:** Cartoon Deformer, KFB rigging and Frankensteining are acceptable conventional modifications when the result remains incorporated in KFB Products rather than redistributed as a standalone asset.
- **UNRESOLVED / ASK ITHAPPY IF NEEDED:** public ToolBox/export workflows that let end users extract reusable ITHappy-derived 3D files; any workflow that sends asset content to generative AI.
