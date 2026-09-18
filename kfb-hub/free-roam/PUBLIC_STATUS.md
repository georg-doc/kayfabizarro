# KFB Free Roam · public playtest status

## CURRENT · FR-S04-02 · 18.09.2026

**IMPLEMENTED · SOURCE BROWSER PASS · PUBLIC BROWSER PASS · HUMAN FEEL REVIEW OPEN**

- Permanent entry: https://kayfabizarro.pages.dev/kfb-hub/free-roam/
- Current immutable version: https://kayfabizarro.pages.dev/kfb-hub/free-roam/versions/fr-s04-02/
- Preserved rejected predecessor: https://kayfabizarro.pages.dev/kfb-hub/free-roam/versions/fr-s04-01/

Race implementation: PR #6 / merge `63cb97d5e321700e55f7658104b42c9c09d97d70`. Tested source `a7a48a8c6e1589a18134aa619e2be22d79124c32`, source run `35365197941`, artifact `10555832979`: 9 drive-intent tests + **33 source-browser checks PASS**.

Actual public delivery: kayfabizarro run `35367513758`, attempt 2, job `105675602369`, artifact `10556454159`, artifact SHA-256 `4b5a9ed3e8c4f950b49aeb136160e6e605cac5232c8d035a4c5090d6d69f27a9`: **62/62 checks PASS** on the real KFB Cloudflare host. The first attempt ended before WebGL because the immutable path had not propagated yet; Pages then completed successfully and the unchanged proof passed on rerun.

Public coverage includes:
- exact source identity + actual delivered bytes for all executable mirror files;
- permanent navigator current pointer and all comparison links;
- WebGL boot, 652 baked Travel contact triangles, 113 dry probes;
- radius-48 playable / radius-56 recovery area with zero circular-fence colliders;
- corrected A/D semantic and physical steering plus real chassis rotation;
- reverse stays negative after engagement without neutral/reversal chatter;
- candidate reverse steering assist, bounded reverse speed and no reverse boost;
- Orbit drag-right uses the Ground-compatible yaw convention;
- >10 forward boost, continuous 180-tick curve without stuck/outside recovery;
- Hop, pause/blur input clearing, reset, raw Slice-04 comparison, local up budget, narrow viewport and return to the hub;
- no script errors.

**Human acceptance remains PENDING.** Automated browser evidence does not decide whether steering weight, reverse feel, camera feel, speed, hills or jumps are enjoyable on Georg's machine.

FR-S04-01 remains immutable historical evidence but is explicitly **human-rejected/superseded** for A/D/camera convention, reverse wobble, trap-prone behavior and circular boundary.

Not implemented by FR-S04-02: Walk↔Drive handoff, parked vehicle/save restore, city traffic, Combat, audio transfer, driver rig or the next defined stunt-ramp slice. Existing Travel and BOX1 owners remain unchanged.
