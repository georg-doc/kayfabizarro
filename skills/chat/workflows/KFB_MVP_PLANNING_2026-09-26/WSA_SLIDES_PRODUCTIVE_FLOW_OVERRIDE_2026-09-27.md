# WSA Slides Override · Productive Flow, not Pseudo-Human Gates · 2026-09-27

Status: **BINDING INPUT FOR NEXT WSA ARCHITECTURE / WORKFLOW SLIDES**  
Source decision: Georg, 2026-09-27  
Canonical policy: `skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`

## Slide 1 · Failure mode to remove

**Anti-pattern:** implementation stops after a small technical slice, a separate diagnostic/review HTML is created, Georg receives a table/counter/buttons, then production waits for ACCEPT/REJECT even though the artifact does not expose a meaningful product decision.

Examples to classify as internal evidence:
- owner/writer tables;
- measurement dashboards;
- contract-only mode buttons;
- isolated state-machine proofs;
- source/provenance matrices.

Message: **technical proof ≠ human gate**.


## Slide 1b · Fidelity test before any human gate

Before presenting a review artifact to Georg, ask whether it is at least representative enough to judge the real product decision.

**Invalid as blocking human gates:**
- grey-box / simplified geometry when the real WorldBuilder/product context already exists;
- generic or substitute lighting/materials/camera that hide the actual look question;
- ruckly/slow controls that prevent reliable feel judgment;
- a proxy that reproduces known shadow clipping, banding or light-seam bugs;
- a reversible mechanism that can safely proceed into the real owner after machine QA.

If the proxy requires Georg to mentally extrapolate how it might look/feel in the real product, keep it as internal evidence and continue integration.

## Slide 2 · New default production loop

`Owner source → implement in real product surface → automated/native evidence → continue integration`

Only branch to Georg review when:
- a real subjective product choice blocks the next step;
- play/feel/readability cannot be automated;
- two materially different directions need selection;
- destructive promotion/replacement needs explicit approval.

## Slide 3 · Review where the product lives

- WorldBuilder → real editable/playable WorldBuilder.
- ToolBox/Animation → real ToolBox workspace.
- Racer → driveable Racer.
- Travel → real WorldBuilder/Travel consumer movement.
- Resident → actual Resident scene/performance.
- Combat → actual combat/freeplay.

Standalone review harnesses are exceptions for missing observability, not default deliverables.

## Slide 4 · Evidence split

**Machine / agent evidence**
- CI counts;
- ownership invariants;
- source pins;
- transition contracts;
- performance numbers;
- browser boot/network checks.

**Human decisions**
- look;
- feel;
- timing/weight/readability;
- meaningful source/design alternative;
- milestone freeplay;
- irreversible promotion.

Do not expose machine evidence as a mandatory Georg task.

## Slide 5 · Proceed Pass

A pragmatic continuation signal from Georg closes the intermediate gate.

`PROCEED PASS` means:
- direction accepted sufficiently to continue;
- detailed defects stay recorded;
- no exhaustive acceptance claim;
- do not reopen the same gate unless a new blocker appears.

## Slide 6 · Stage / Hub

Stage is a durable milestone and shared/public review surface.

It is **not**:
- an end-of-slice requirement;
- a substitute for integration;
- a reason to invent a human gate.

Hub should prioritize:
- current productive action;
- real integrated review milestones;
- blockers requiring Georg.

Do not fill Today/LOOK_AT with technical diagnostics.

## Slide 7 · Travel example

`TRAVEL-MODES-01`:
- router technical evidence is green;
- accepted 400 ms Ground→Flight behavior preserved;
- owner contract is machine-verifiable;
- contract-only Stage page is not a meaningful acceptance surface.

Decision 2026-09-27:
**PROCEED PASS.**

Next:
- consume the router in real WorldBuilder/Travel mobility;
- prove real Ground/Flight continuity there;
- add Drive/Water only from source-proven adapters;
- next human review should be about the playable integrated mobility experience, not a router table.


## Slide 7b · LOOK-TORSION example

`LOOK-TORSION-01`:
- 45/45 engineering/browser checks proved the geometry mechanism;
- Georg grants **ARCHITECTURE PASS ONLY** for cumulative height-dependent torsion, anchored base and shared roof/body deformation;
- the isolated grey A/B/C WebGL page is **not** WorldBuilder/look acceptance;
- known shadow/light defects remain open;
- no final universal torsion angle is accepted from that proxy;
- the standalone Human Gate is closed and must not be recreated.

Next:
- consume the mechanism in the next clean/current WorldBuilder/world-presentation candidate;
- judge it only there with the real scene/camera and shared shadow/lighting corrections.

Message: **a mechanism may pass while the proxy review workflow fails.**

## Slide 8 · WSA role

WSA should actively reduce process friction:
- combine/remove redundant gates;
- convert technical gates to automation;
- keep one active integration path per owner;
- collapse repeated labs into product owners;
- show human decisions only where Georg's judgment changes what gets built next.

Success metric:
**integrated usable capabilities / human attention**, not number of proofs, reviews or PRs.
