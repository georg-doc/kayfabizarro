# NEXT GATE · PD-POOL-F1

Exactly one next gate:

## Isolated AIC transport proof

Use a **fresh Web/GitHub slice**, not Work.

1. Start from the last compiling fetcher at commit `154e573b8defacd17e836de049b3853578291f94`.
2. Do not edit Met, Commons or Internet Archive code.
3. Add only the minimum AIC request-header/transport change.
4. Verify the exact edited lines immediately after the GitHub write.
5. Run `python -m py_compile`.
6. In GitHub Actions, request AIC artwork `24645`, require `is_public_domain=true` + `image_id`, then retrieve exactly one 843 px IIIF image.
7. Record HTTP result, byte count and SHA-256.
8. Stop.

PASS means only: **AIC API + one IIIF image transport works from the GitHub runner.**

After PASS, a later slice may resume the four-source PD-POOL-01 idempotence gate. Do not combine these gates.
