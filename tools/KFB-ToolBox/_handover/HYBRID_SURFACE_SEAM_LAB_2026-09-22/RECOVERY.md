# RECOVERY · Hybrid Surface Seam Lab · 2026-09-22

## Known-good public state

Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/hybrid-surface-seam-lab/`

Source branch:
`chatgpt-web/toolbox-hybrid-seamless-macro-2026-09-22`

Draft PR:
`#171`

Deployed runtime marker:
`8a64b33a917417402b6932fc152ec9f3bcf32fb1`

Public proof:
- workflow `35676178615`
- public job `106583528203`
- **17/17 PASS**
- failed resources: 0
- page/console errors: 0
- artifact `10673850312`
- digest `sha256:0fe0a8e6a407e5a84e24a8751e2729ba5a83891b0e3b2a233d1fa451ab736509`

## Do not regress

The seam fix is specifically the tileable macro generator. Do not reintroduce the old one-shot random canvas as the default.

The old generator remains available in the Seam Lab only for A/B comparison.

## Separate unresolved issue

Hybrid v2 actor compile census is not solved by this slice. Keep PR #166 / PR #170 recovery evidence separate.

## One next gate

Georg visual review of the public **Legacy non-tileable ↔ Tileable macro** comparison.
