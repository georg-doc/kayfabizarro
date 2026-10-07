# RETURN · Issue #372 · KFB Theatre Curtain Recovery + Productization · Claude Design · 2026-10-07

## Status · Georg 2026-10-07: **PASS on r3** → WSA check-in (HANDOVER_WSA_THEATRE_CURTAIN_RECOVERY_2026-10-07.md)

## r3 · Georg review 2026-10-07: TUNE → PASS
- Feedback: double step where the gilt strip meets the plinth; pleats read as a folding screen (sharp zig-zag, pointed hem ends); remove the footlight bulb row.
- Done: molding ends inside a deeper plinth; finer cloth grid, slack between pins and hem weight give round folds and hanging ends; bulbs removed (light kept). Storage-buffer limit respected (tie + hem packed in one vec2 buffer). cand-01…07 recaptured with r3.

## r2 · Georg review 2026-10-07: TUNE
- Feedback: open/close crept into the end; missing swing, weight and inertia. Hem corners poked into the plinths left and right.
- Done: momentum drive replaces the smootherstep (pull, run, hard stop, small rebound; cloth keeps more momentum). Plinths flush with the opening. cand-01…07 recaptured with r2.
- Agreed next: check in r2 as the realistic baseline, then a new iteration from a detailed brief for the claymation/cartoon look with a wooden puppet-theatre stage.

## Plain result
- The real v2 donor was rendered unchanged and captured closed, mid-open (3 moving frames), open and reclosed.
- Isolation found why it looks cheap: the panels slide instead of gathering, the lower quarter is never drawn, the cloth is 85 % opaque, and there is no stage around it.
- One candidate exists: the same donor cloth kernel with gathering pins, pinch pleats, opaque oxblood velvet with motion-safe patina, and a physical aged proscenium, swag pelmet, rail, floor and footlights.
- Loading, Character Select and in-game reveal run on one module with the brief's seven states. No plaque, sign, wordmark or SVG overlay exists.
- Nothing was pushed. Georg: nothing required unless you want to choose pelmet vs. ring rail.

## Exact facts
- repo: georg-doc/kayfabizarro · read ref: main (tree `6efd7c807eaf`, 2026-10-07T03:01Z)
- recommended branch: design/theatre-curtain-recovery-2026-10-07 · **NOT COMMITTED / NOT PUSHED** (no GitHub write in this session)
- owner path for the packet: `tools/KFB-ToolBox/_inbox/KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07/`
- donor: `…/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/KFB Theatre Curtain v2.html` blob db96d54bd7618587d9f15db02a142701e0e38afc (verified)
- reference: `…/KFB Elisa B-Day Reference+Mockups/CURATIN-THREE-js - old-stage-…-387640660.webp` blob 068887825acd85d78bf27d7fdbf89066518670ec (verified)

## Files in the packet
donor/KFB Theatre Curtain v2.html (unchanged) · donor/KFB Theatre Curtain v2.html.txt (byte copy for the probe) · reference/old-theatre-reference.webp · donor-probe.html · candidate/kfb-curtain-core.js · candidate/kfb-curtain-host-demo.js · candidate/standalone.html · SOURCE_AUDIT.md · FAIL_ANALYSIS.md · KEEP_TUNE_REJECT.md · MATERIAL_LOOK_STUDY.md · CURTAIN_MODULE_CONTRACT.md · IMPLEMENTATION_HANDOFF.md · RETURN.md · CHANGELOG.md · HANDOVER_WSA_THEATRE_CURTAIN_RECOVERY_2026-10-07.md · claude-design/ (viewer + board source) · screenshots/ (39 frames). Claude Design project also holds `KFB Theatre Curtain Recovery.dc.html` (viewer) and `KFB Theatre Curtain Recovery Board.dc.html` (evidence board).

## Checks actually performed
- environment: Claude Design preview, Chromium WebGPU (`navigator.gpu` true), three 0.186.0
- donor: unchanged source, probe stepping 1/60 s, 6 frames kept (closed, mid, 2 moving, open, reclosed)
- candidate: 7-frame cycle; 12-frame use sequence (loading covered_wait, loading ready, select FrizzleBob, select Black Knight, reveal open, cover mid, closed, 3 impact frames, reveal mid, open); 10-frame material study incl. 3 moving impact frames; ring-rail variant
- moving-frame checks: cand-02/03/04, use-08/09/10, mat-08/09/10 — no stripe, crawl or flicker seen
- state machine: found and fixed a float-accumulation bug (opening never reached open_rest); after fix states traverse closed_rest → opening → open_rest → closing → closed_rest/covered_wait
- real loads: FrizzleBob v5b @93abbf22 and Black Knight @2c92dd13 loaded; Combat Mech fallback path exercised once when the FrizzleBob URL was wrong
- not performed: normal visible browser tab, mobile, low-end GPU timing, reduced-motion visual pass, fallback_reveal visual, audio

## KEEP / TUNE / REJECT
see KEEP_TUNE_REJECT.md · material selected: **P = B cloth (motion-safe macro patina) + C hardware (aged gilt/plaster/floor)**

## Critic answers (Builder self-check, not acceptance)
1. old theatre read: yes, from proscenium + pelmet + oxblood velvet + footlights
2. suspended and heavy: hangs from 9 pinned pleats per panel, gathers to the wings; open state looks heavy, mid-motion still slightly light at the hem
3. curtain over UI: yes; one small text line per state
4. fake sign / SVG overlay: absent
5. stable in motion: yes in sampled frames
6. one module for three uses: yes, same instance and states
7. KFB without clay decoration: relies on the KFB actors and stage, not on clay plaques — Georg to judge

## Unresolved
tieback (quarantined) · ring-rail readability · impact edge sliver · idle clip binding · WebGL fallback decision · FrizzleBob SOURCE_PIN_RECONCILE · performance budget

## Exactly one next gate
**WSA check-in** of this packet to `design/theatre-curtain-recovery-2026-10-07` (Georg PASS on r3, 2026-10-07). No merge, no live promotion. Then: separate claymation/wooden puppet-stage iteration from Georg's brief.
