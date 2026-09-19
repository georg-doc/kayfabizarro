# POSTMORTEM · TE-01 public Stage publication

## SOURCE

The candidate is the source-backed Race TE-01 OSM depth + KFB Ink proof. It preserves Free-Roam C0 as physical owner and adds presentation-only Ground/Landuse depth separation plus semantic Ink/Bend contours.

## ATTEMPTS

The initial public attempt packaged the tested runtime on `kayfabizarro` main but did not place it on the designated Cloudflare publication branch. That attempt failed at the deployment marker.

Repair pass 1 mirrored the exact package to `cloudflare-live@07c47e1` and reran the exact public proof. The marker still failed for the full 42 × 10 s polling window.

Repair pass 2 used a GitHub Contents-API write on `cloudflare-live`, producing `66bd170`, specifically to ensure a normal branch content commit existed. The exact public proof again failed for the full polling window.

## WORKING PARTS

- Race runtime and ownership contract: **PASS**.
- Hürth C1 browser regression: **26/26 PASS**.
- continuous corridor browser regression: **17/17 PASS**.
- TE-01 depth/Ink browser suite: **17/17 PASS**.
- local packaged Stage mirror: **22/22 PASS**.
- 10 exact runtime file blobs are pinned and preserved.
- publication package exists on `cloudflare-live`.
- old canonical Stunt World route was not overwritten.

## FAILURE EVIDENCE

Observed only:

- attempt 1 public job: deployment-marker check failed before browser boot;
- attempt 2 public job: deployment-marker check failed before browser boot;
- attempt 3 public job: deployment-marker check failed before browser boot;
- each public attempt polled the exact TE-01 `DEPLOYMENT.json` for 42 × 10 seconds;
- no public visual/browser acceptance was reached;
- no public TE-01 screenshot exists because the browser stage was never entered.

## PROVEN CAUSES

- **PROVEN:** the first public attempt targeted repository main while the binding workflow requires the lean Cloudflare publication branch.
- **PROVEN:** after correcting that, Git contains the exact candidate on `cloudflare-live`, but the public route still did not expose the expected marker within either repair window.
- **PROVEN:** the failure is upstream of WebGL/runtime boot; the public job stops at deployment discovery.

## HYPOTHESES

Not promoted to fact:

- Cloudflare Pages may no longer be consuming `cloudflare-live` as the authoritative production branch.
- the Git integration/webhook may be stalled or disabled;
- the Pages project may be building from another repository/ref or an older deployment;
- a platform-side build may be failing before publication.

No Cloudflare control-plane connector is available in this chat, so none of those hypotheses is verified.

## SALVAGE

Keep the Race implementation, all local evidence, Stage package, public proof script and the two publication-branch commits. Do not rebuild the runtime or Ink system to solve a deployment-marker failure.

## LESSONS LEARNED

**Error:** the first publication write went to main instead of the designated lean publication branch.  
**Rule:** resolve the actual Cloudflare publication branch before creating a human Stage link.  
**Early test:** fetch/verify one immutable `DEPLOYMENT.json` marker before running WebGL/browser QA.

**Error:** Git-side retries continued without Cloudflare control-plane evidence.  
**Rule:** after two Git-side repair passes, stop and inspect the hosting control plane.  
**Early test:** confirm the Pages production branch/latest deployment ID before the second retry.

## TESTED RESULT

Runtime/local mirror: PASS.  
Cloudflare public deployment: FAIL / NOT DEPLOYED OR NOT OBSERVABLY DEPLOYED.  
Georg acceptance: NOT RUN.

## OPEN

The only blocked seam is the Cloudflare publication control plane.
