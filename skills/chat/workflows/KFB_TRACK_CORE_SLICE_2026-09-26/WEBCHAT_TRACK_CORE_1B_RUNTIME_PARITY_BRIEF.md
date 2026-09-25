# TRACK-CORE-1B · Web authoritative implementation + runtime parity brief · 2026-09-26

**Executing agent:** **ChatGPT Web + GitHub**  
**Owner:** `georg-doc/KFB-Stunt-Car-Race`  
**Starts after:** TRACK-CORE-0 · Georg language decision · TRACK-CORE-1A Blender proof  
**Outcome:** one authoritative Track Core consumed by Race/runtime/editor paths, with parity against the Blender oracle  
**Visual redesign:** NO

## Preconditions

Do not start until GitHub contains:

- completed geometry census;
- final frame/slot/parameter/marking/piece contracts;
- Georg's language decision;
- Blender proof fixtures + actual tests;
- exact source pins.

If authoritative JavaScript is **not** Georg's selected direction, adapt this brief to the selected one-core language while preserving the no-duplicate-solver rule.

---

# Goal

Implement the **one Track Core** below RouteRecipe.

Conceptually:

```text
RouteRecipe
→ piece generators
→ canonical frames
→ parameter curves
→ canonical slot surface
→ marking layer
→ structure/socket metadata
→ consumers:
   - Race render
   - Race colliders/contact data
   - editor preview
   - Blender/GLB evidence
```

There is only one geometric truth.

---

# 1 · Reuse before implementation

Web first re-opens the exact current consumers classified by TRACK-CORE-0.

Do not create a convenient new demo runtime if an existing Race consumer can be adapted.

Explicitly preserve:

- current movement/contact owner;
- current camera owner;
- current recovery owner;
- RouteRecipe owner;
- OSM/WorldBuilder owner boundaries.

---

# 2 · Implement centre-line pieces

Implement only from the approved Piece schema.

Minimum proof set:

- STRAIGHT;
- CURVE_EASE / BANK_EASE;
- OFFSET_S;
- CHICANE;
- HAIRPIN_180;
- STREET_TO_TRACK;
- GRADE / CREST / DIP / BRIDGE_APPROACH;
- LOOP;
- FUNNEL / LANE_TAKEOVER;
- SPLIT / MERGE as required by the acceptance fixture.

The authoritative implementation returns the canonical frame stream.

No piece gets its own mesh sweep.

---

# 3 · Implement canonical slot surface once

One surface generator consumes:

- canonical frames;
- canonical slot profile;
- parameter curves.

Prove the same path generates:

- street;
- race track;
- narrow stunt lane;
- bridge drive deck;
- barriers/no barriers;
- curb/walkway variants.

No monkey-patch profile switching.

No host mesh rebuild.

---

# 4 · Implement one marking renderer

One marking path consumes frame + marking data.

Support current contract styles:

- STREET;
- TRACK;
- MAG.

Style changes are blends/visibility curves over `s`.

Do not cut host lines to make another track visible.

---

# 5 · Collider/contact parity

Race physics remains owner of contact behavior.

The Track Core must provide the same geometric truth to the collider/contact consumer.

Prove:

- render top = contact top within tolerance;
- gaps have no phantom surface;
- street↔track transition has no hidden step;
- banking/grade match render frames;
- stunt piece sockets expose the expected contact seam.

Do not retune vehicle physics in this gate.

---

# 6 · Blender oracle parity

Use TRACK-CORE-1A fixtures as independent comparison.

For identical RouteRecipe/piece data compare:

- frame positions;
- tangents/up/right;
- arc length;
- curvature facts;
- bank/grade;
- slot values;
- marking offsets;
- endpoint frames;
- exported visible geometry where practical.

Report maximum/mean errors rather than “looks same”.

---

# 7 · Rebuild the RKIT-11 acceptance scene

Use the frozen RKIT-11 geometry only as source/reference.

Reconstruct:

- Mülheimer Brücke driveable deck from Track Core;
- Pylon Loop as a piece on the same core;
- lane takeover as parameter curves;
- markings through the common marking layer;
- Rhein-Hüpfer sockets/ramps where the source contract permits.

Allowed separate landmark shell:

- pylons;
- cables;
- portal;
- non-driveable identity geometry.

Forbidden old hacks:

- monkey-patched section profile;
- separate bridge drive sweep;
- separate loop road sweep;
- host-line mesh cuts;
- special ad-hoc transition frame fields.

The visual acceptance question is whether the core can recreate the useful scene without those hacks.

---

# 8 · Runtime / browser proof

Run repository-native tests first, then real browser tests on the existing Race host.

At minimum prove:

- route builds deterministically;
- full generated surface loads;
- current car can drive ordinary core track;
- street↔track section;
- bank/grade;
- one M1/M2 transition;
- one split/bypass if included;
- recovery remains owned by Race;
- no page/console/resource errors;
- no second movement/camera/audio owner.

A browser PASS is not Georg acceptance.

---

# 9 · Editor/World seam

Do not build the full editor.

Expose enough deterministic API/data so the future simple editor can submit RouteRecipe/piece parameters and get the same core output.

Document:

- input;
- output;
- rebuild trigger;
- serialization;
- stable ids/sockets.

OSM road centre lines must be able to feed the same piece/frame path later.

---

# 10 · Migration classification

Update the TRACK-CORE-0 census with actual results:

- which old sweep paths are now superseded;
- which remain test/reference donors;
- which runtime consumer was adapted;
- which files must not be deleted yet.

Do not mass-delete legacy source in the same proof unless explicitly authorized.

---

# Evidence / return

Return:

- repo / branch / PR / exact head;
- changed files;
- actual static test counts;
- browser test counts;
- Blender parity numbers;
- screenshots/visible proof;
- RKIT-11 before/core comparison;
- `SOURCE.json`;
- `TEST_REPORT.md`;
- `RETURN.md`;
- additive changelog;
- unresolved items;
- one next gate.

No auto-merge.

No Live promotion.

## Done when

One route/piece dataset produces consistent render/contact/Blender evidence without parallel geometry solvers.

## Exactly one next gate

**TRACK-CORE-2 · Claude Design transition visual grammar**, unless a core correctness blocker remains.
