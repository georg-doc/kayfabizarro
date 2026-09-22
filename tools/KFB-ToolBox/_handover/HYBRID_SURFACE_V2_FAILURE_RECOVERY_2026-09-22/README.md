# Hybrid Surface v2 · Failure Recovery Export

This folder is the durable failure-recovery index for the frozen v2 candidate.

The editable runtime source is intentionally preserved at its original branch paths rather than copied into a second source owner. `EXPORT_MANIFEST.json` pins every source file by blob and the frozen runtime head.

A downloadable ZIP may mirror those exact source files for offline review, but GitHub remains source truth.

Current state:
- PR #166: draft / frozen candidate
- runtime/code freeze: `7cbad52b55fb9ec2300aa4b25ca92b0997ce448a`
- public v2 deployment: **none**
- human v2 acceptance: **none**
- next gate: actor material compile census diagnostic only
