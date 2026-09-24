# RETURN · KFB Production Architecture v3 · complete production strands · 2026-09-24

Status: **ARCHITECTURE CANDIDATE READY · 5 STRANDS / 19 JOBS · UNMERGED · NO LIVE PROMOTION**

## Exact state

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/production-architecture-v3-2026-09-24`
- Draft PR: **#204**
- Base: `main@9431dcb8da0158a75d0988d52fc1e7a49aac21f1`
- Complete-strand checkpoint before this Return: `f10cd53c382c134910fbeaf09099e741ad0106eb`
- Public Stage created by this slice: **no**
- Live promotion: **not authorized**

## Product architecture now available

Five Hub-visible production strands are fully described:

1. **ToolBox Authoring Platform**
   - Stage-First working base / real roster;
   - EyeRig Production Studio;
   - Vehicle EyeRig through existing Vehicle FaceHost;
   - independent left/right eye authoring as an honest missing additive capability;
   - Fractal Scene + Pose Studio;
   - ToolBox Animation Studio;
   - Vehicle Motion + Driver Studio;
   - Resident Scene Studio + live Resource Picker;
   - one final ToolBox production milestone.

2. **Animation & Residents**
   - current Motion Library;
   - Blender Resident Performance Batch;
   - Pose-before-Blender rule;
   - reusable measured MotionProfiles;
   - common ToolBox/WorldBuilder consumer path.

3. **WorldBuilder / God Mode**
   - WB-W0 measured foundation;
   - authorable place;
   - live search/place;
   - fractal scene editing;
   - live locomotion/animation playground;
   - editable OSM cartoon district;
   - Race module;
   - complete God Mode construction site.

4. **Racer → World**
   - Racer Anatomy Foundation from current R3d TUNE;
   - route-driven visual track module;
   - real vehicle grounding/contact;
   - WorldBuilder/OSM bridge;
   - cartoon-world composition.

5. **Quick 3D Review**
   - small source-real visual questions directly in Chat HTML without Cloudflare/Work loops.

## Reused existing systems instead of rebuilding

Confirmed current donors/capabilities:

- **Resident Atlas S6** already has object Move/Rotate/Scale plus Bone-Posing with a rotation ring, per-Resident persistence and `<resident>.studio-patch.json` export.
- **Shared scene editor** already owns Move/Rotate/free Scale/Drop/World-Local + `kfb.scene-patch.v1`.
- **KayKit Motion Lab / KCL** already proves phase-aware Walk→Run, speed→timeScale candidates, hysteresis and measured contacts.
- **Creator/KCL research** already defines the richer semantic movement model:
  `locomotionMode + speedBand + direction + stance/equipment + grounded + action override`.
- **EyeRig v6** remains the only eye runtime; the existing EyeRig brief already defines a Vehicle FaceHost path.
- **Asset Librarian integration** already defines one context-aware Resource Picker / Library Drawer rather than a second asset index.
- **Mech & Vehicle Rig / Vehicle Lab** already provide vehicle/cockpit/presentation donors.
- **Race PR #33** remains route/banking/physics owner; WorldBuilder receives only an accepted visual/world module.

## Files in this architecture owner

- `START_HERE.md`
- `PRODUCTION_STRANDS.md`
- `STRAND_BRIEFINGS.md`
- `SELF_SERVICE_BRIEFINGS.md`
- `INPUT_LOCKS.json`
- `HUB_BRIEFING_CATALOG.json`
- `TEST_REPORT.md`
- `CHANGELOG.md`
- this `RETURN.md`
- top-level `skills/chat/START_HERE.md`
- top-level `skills/chat/CHANGELOG.md`

## Hub job state

Machine-readable catalog contains **19 jobs**.

READY now:
- Quick real-source 3D Review;
- ToolBox coherent Stage-First basis;
- TB-EYE-01 EyeRig Production Studio;
- TB-POSE-01 Fractal Scene + Pose Studio;
- TB-ANIM-01 ToolBox Animation Studio;
- AN-PERF-01 Blender Resident Performance Batch;
- AN-PROFILE-01 Motion Profile Enrichment;
- RACE-ANATOMY-01 Racer Anatomy Foundation.

Dependency-gated jobs are already fully briefed rather than left for future planning:
- Vehicle Motion + Driver Studio;
- Resident Scene Studio;
- ToolBox final Production Milestone;
- WorldBuilder Authorable Place / Place / Motion / OSM / Race / God Mode;
- Racer Visual Module / Contact.

WorldBuilder `WB-AUTHOR-01` waits only for Georg's current WB-W0 `PASS / TUNE / REJECT` on scale + traversability.

## Validation

**31/31 architecture/source checks PASS.**

Revalidated exact current GitHub heads:
- EyeRig #104 `e277c3456651d314a01adea046e0105d2a12cdd1`
- Creator/KCL #107 `fc49a336af57adb6317b74211b3318d004d96de5`
- Motion Lab #127 `7c8cc218ec46dabb20409c9e0b5368afcf5845c6`
- ToolBox #185 `2833674b36be707fa4d14c8b532faee78ef3ba28`
- Shared Editor #186 `7267185cdbdc60e576b946ee589f0b2e932c8c8b`
- WB2 #190 `5a98e674184ea4694a5ad7d696d8cc84c1618bdf`
- Blender proof #192 `b49fb6e1adde070d658e1cc21dadb3294164cb29`
- Warband #195 `9dda7957a33e69926265c1e3a69028a4b35b26f0`
- Motion Library #197 `bf0eace2332a48f0b220318ad7567c68cc6dfbad`
- WB-W0 #203 `40fe2c10959a2022694a2342482e04dd34cbe7be`
- Racer private PR #33 `71e7051b2eea1ad731912b634f44ce5ba0218736`
- Resident Atlas exact pin `10f661a542e2553b4d3433bfc5b45dfc1401e660`

## Hub/public state

The complete strand catalog is ready for consumption by the existing **HUB-CTRL PR #202 owner**.

This architecture slice deliberately does **not** fork or overwrite Hub ownership and does not publish another public Hub.

The public Hub remains:
`https://kayfabizarro.pages.dev/kfb-hub/`

Its current public content does not yet claim these new strand cards.

## Unresolved / deliberately deferred

- HUB-CTRL #202 has not yet mounted `HUB_BRIEFING_CATALOG.json`.
- Existing open-PR backlog has not been cleaned in this slice.
- Independent left/right EyeRig authoring is specified but not yet implemented.
- Animation Studio is specified from proven modules but not yet integrated as a current ToolBox product.
- WorldBuilder Authorable Place still waits on the existing WB-W0 human foundation result.
- Racer Anatomy Foundation is READY but not implemented here.

## One next architecture gate

**HUB-V3-MOUNT:** let the existing HUB-CTRL owner consume the v3 strand catalog and expose the READY/HOLD production chains in the KFB Hub in one cheap integration/publication batch.

After that, normal product work should start directly from the READY cards. No architecture check-in is required merely to obtain the next briefing.
