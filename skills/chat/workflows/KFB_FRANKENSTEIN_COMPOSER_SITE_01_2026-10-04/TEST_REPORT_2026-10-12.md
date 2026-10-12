# KFB FrankenStein Composer · TEST REPORT · 2026-10-12

Status: **IMPLEMENTATION_COMPLETE · STATIC/DEPLOYMENT_IDENTITY_PASS · PRIVATE_BROWSER_EXPORT_HUMAN_GATE_OPEN**

## Build identity

- Repository / Draft PR: `georg-doc/kayfabizarro#355`
- Implementation commit: `1a543618460b25044b297bd19c27d5cbaac5007a`
- Pre-evidence branch head: `de01a3c6016f429ddacd8fd216b786d83c12ad00`
- Private GPT Site: https://kfb-frankenstein-composer.frizzlebob.chatgpt.site
- Site version: `4`
- Deployment ID: `appgdep_6accdcf052a08191932de0dc00a2d4f7`
- Version ID: `appgprj_6ac2795982608191a549bb0373c5dd6c~appgver_c997921acd008191b6578e05eb77444d`
- Access: custom / owner-private; no access-mode change and no Live/public promotion.

## Automated and deployment checks — PASS

- `node --check app.js`: PASS.
- Persisted static contract suite: **22/22 PASS**.
- Authenticated private-Site HTTP fetch: `/`, `/app.js`, and `/styles.css` served successfully.
- Served private-Site bytes equal the deployed local source bytes:
  - `index.html`: SHA-256 `6819519f58bafddb901a9d5ad96a03f1d28fd420113246a9ded63ac111a07e4c`
  - `app.js`: SHA-256 `3117ec3072ab4e690b99c54d7a89402a8cbbb18fb932eb081813463350b47a7f`
  - `styles.css`: SHA-256 `daa994ce3796c227d8426fe32a972aaa813007db7aa41d68931697bcaeffc575`
- Site registry: active, latest version 4, current user role owner.

## Covered implementation

- Source isolation for GothGirl, Black Knight, pinned FrizzleBob v5, and Pencil; Eraser remains `SOURCE_REQUIRED`.
- Single Composer surface and single Three.js runtime.
- Body/head composite, rig-aware Medium/Large motion, and the pinned face stack.
- Reversible actor recipe save/export/import with primary `kfb.pets/1` retained.
- Browser-local deterministic Fassbeiner generator: seeded SDF field, isovolume mesher, welded vertices, five-bone skin, pose QA, known-bad-weight negative control, companion recipe, and binary GLB export path.
- No per-creature AI inference.

## Interactive gate — OPEN, not claimed as passed

The following must still be verified in an authenticated owner browser: WebGL render, source/composite/motion interaction, deterministic A/B/C visual output, pose deformation, negative-control behavior, binary GLB click/download/open, and JSON export/import round-trip.

Reason: the available automation browser is a separate CDP session and cannot inherit the user's already authenticated ChatGPT UI session. The managed local preview stopped before app startup because its container cannot mount `/proc` (`bwrap` environment failure). A local Playwright fallback had no browser binary, and the restricted environment blocked the Chromium download. These are QA-environment limits, not product PASS results.

Cloudflare is out of scope and is not a product path. The mistaken adapter changes were fully reverted at `de01a3c6016f429ddacd8fd216b786d83c12ad00`. No Cloudflare, Stage/public, merge, or Live claim is made.

## Owner human gate

1. Open the private GPT Site while signed in.
2. Load **GothGirl** in Source mode; switch to Composite, then Motion.
3. Select **Fassbeiner**; generate A twice with the same seed and confirm identical output; then generate B and C.
4. Select pose `stress_abduction`.
5. Enable bad weights and confirm the defect is detected; disable them and confirm PASS.
6. Export GLB and confirm the downloaded file name and that the file exists/opens.
7. Export JSON, then import it and confirm the recipe round-trip restores the selection/state.
8. Confirm no visible runtime error.

Acceptance remains pending until this gate is recorded. Draft PR #355 remains unmerged and no Live/public promotion is authorized.
