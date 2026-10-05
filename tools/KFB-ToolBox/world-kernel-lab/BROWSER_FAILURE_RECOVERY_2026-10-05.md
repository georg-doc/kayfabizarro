# FAILURE RECOVERY · local Chromium visual gate · 2026-10-05

Status: **TOOL / ENVIRONMENT BLOCKER · CANDIDATE PRESERVED**

## Gate

Obtain a local visual screenshot of the World Kernel Lab browser POC before Site publication.

## Attempt 1

Local HTTP server started and `index.html` was reachable.
Headless Chromium screenshot command did not return before the execution timeout.

Observed logs included D-Bus connection errors.
No screenshot evidence was accepted.

## Attempt 2

Retried with a bounded timeout and headless flags.

Result:
- process exit: timeout;
- EGL/ANGLE initialization failed;
- messages included `EGL_NOT_INITIALIZED`, `xcb_connect() failed`, and GPU process exit;
- no valid screenshot produced.

## Proven cause vs hypothesis

Proven:
- the current container Chromium environment cannot initialize the required display/GL stack for this capture path;
- local HTTP source itself is reachable;
- Node core tests and JS syntax checks pass.

Not proven:
- no product/browser defect in the POC has been reproduced;
- final GPT Site Worker, Canvas or localStorage behavior remains unverified.

## Stop decision

Two bounded attempts on the same local browser-capture gate produced no progress.
Stop local browser repair here.

Do not:
- alter the POC merely to satisfy this container;
- add browser-specific workarounds to product source;
- substitute Cloudflare;
- claim browser PASS.

## Salvage map

KEEP:
- all POC source;
- 6/6 deterministic tests;
- 3/3 JS syntax checks;
- HTTP entrypoint fetch;
- Site publish packet.

DEFER:
- visual/browser verification to the actual GPT Site host.

## Exactly one next gate

**PUBLISH_ONLY:** a Sites-capable executor publishes the frozen source unchanged and opens the exact private Site URL. That environment becomes the next browser gate.
