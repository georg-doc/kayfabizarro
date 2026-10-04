# KFB Race · v0.10 Facility Topology Blockout · RETURN

**Status:** IMPLEMENTATION CANDIDATE · TOPOLOGY ONLY · HUMAN TOPOLOGY ACCEPTANCE PENDING  
**Owner:** `georg-doc/KFB-Stunt-Car-Race`

## IMPLEMENTED

A separate browser blockout models these Race-local concepts independently:

- closed MAIN route;
- PIT/service side route;
- pit-entry SPLIT;
- pit-exit MERGE;
- mandatory elevated OVERPASS;
- independent lower MAIN segment under the bridge;
- start/finish anchor;
- service-building frame;
- four stall anchors;
- bridge-support frames.

The route deliberately self-crosses only through an explicit upper/lower crossing. Pit entry/exit remain on the flat start/finish side and are not part of the bridge.

## NOT IMPLEMENTED

- v0.8 driving/physics on this route;
- pit gameplay, rewards or repair;
- Box Stop pit-entry trigger;
- environment dressing;
- final Kenney GLB placement;
- lap/progress logic;
- A0 expansion.

## DONORS

- `V09_BROWSER_REJECTION_KENNEY_LOGIC_STUDY_2026-09-18.md` supplies the corrected mental model.
- World Atlas `Kenney_Racing_Track_S3.html` is a geometry/measurement reference only.
- No donor becomes Race topology/contact owner.

## STATIC GATE

`node test.mjs`

Checks closure, distinct split/merge, PIT endpoint attachment, separate overpass segment, clearance, stall anchors and the explicit no-A0 claim.

## BROWSER GATE

`browser-test.mjs` verifies the public page can boot, expose a passing topology audit, render labels and toggle top/isometric + pit/anchor visibility.

## HUMAN GATE

Before attaching accepted v0.8 driving, Georg only needs to answer:

1. Can mainline, pit lane, pit entry and pit exit be identified immediately?
2. Is the bridge clearly an overpass rather than a fork?
3. Is the lower route visibly independent beneath it?
4. Does the pit lane read as a service route rather than a shortcut?
5. Does the overall logic feel like the intended small Kenney-style facility?

Visual prettiness is not the gate yet.

## NEXT IF ACCEPTED

Attach the accepted v0.8 driving/contact layer to the approved topology, then move Box Stop activation from the temporary tab/button to the real pit-entry/service anchor without duplicating the overlay.
