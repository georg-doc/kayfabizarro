# NEXT GATE · marker-only public proof

Exactly one gate.

## Allowed change

Correct only the Stage marker:

`kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/SOURCE.json`

Replace the trailing literal `\\n` with an actual newline / valid EOF.

Mirror that exact marker to both:
- source/main Stage package;
- `cloudflare-live` publication branch.

## Required preflight before public polling

1. repository-side `JSON.parse(SOURCE.json)` PASS;
2. Git blob tail contains no literal backslash-n;
3. public `SOURCE.json` returns the expected `testedRuntimeHead = aa28a743628699271c94c1911af23d0564c6f3cc`.

## Then

Rerun the existing public proof **unchanged**.

## Forbidden in this gate

- no scene composition changes;
- no camera changes;
- no palette/fog/rim changes;
- no new landmark work;
- no OSM changes;
- no weather material work;
- no PR merge / Live promotion.

## PASS condition

Exact Cloudflare route visibly boots the expected revision and the existing public Playwright suite passes.

Only after that may Georg receive the route as a human visual gate.
