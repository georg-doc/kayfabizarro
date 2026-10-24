# Additive proposal-core changelog

## 2026-10-22

- Reused PR #416 / existing ToolBox proposal core; no new owner.
- Verify immutable base file + source blob and reconstruct exact requested edits on readback.
- Return verified field diff, GitHub branch URL, immutable commit URL and base-to-commit compare URL only after checks pass.
- Add 3 regression tests; 39/39 local deterministic tests pass. Hosted integration remains unavailable.
- Preserve private ToolBox v11/source 53028aa47de97cf1c5791cdc72501212a5785094, all canonical cards, register branch and existing UI. No deployment or merge.
