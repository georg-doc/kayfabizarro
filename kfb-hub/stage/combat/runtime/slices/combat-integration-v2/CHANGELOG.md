# Combat Integration V2 · Additive Changelog

## 2026-09-22 · C-MVP-A-R2 minimum playable loop

- Corrected the gate from all-actor parity to the smallest playable Combat loop.
- Kept Skeleton Mage in the verified catalog but quarantined it from the MVP runtime as `C_MVP_MAGE_ADAPTER`.
- Traced the release stop to the real graft barrel dot (`0.9788-0.9793`) never reaching the unchanged `0.985` gate.
- Consumed the donor's measured barrel axis and compensated its live yaw through player aiming; no threshold weakening or guessed muzzle.
- Added semantic visible-body bounds picking for imported skinned actors whose triangle raycast does not answer.
- Raised the full suite to **74/74 PASS** and rebuilt the 218-file package.
- Real-browser proof: 5 shots, 3 hits, 1 Warrior kill, 1 reward die, 1 Pop, 3 coin drops, Card Clear and Next-card respawn.
- Public Stage remains unchanged until the exact pushed package is verified and opened at the fixed URL.

## 2026-09-22 · C-MVP-A-R1 finite actor repair

- Proved both exact KayKit source GLBs and every visible source part have finite bounds.
- Traced the failure to missing `forwardZ` in the CA2 actor descriptors: the first admitted actor acquired a non-finite rotation and then contaminated pair separation.
- Added strict visible-geometry bounds, finite scale/transform gates, delayed admission and invalid-actor quarantine; no guessed scale fallback.
- Added graft-owned face evidence and proved outer rig, mouth, two eyes/eight visible eye meshes and gun without introducing another face owner.
- Raised the full suite from 68 to 71 passing tests; rebuilt the 217-file exact package.
- Real-browser recheck passes enemy transforms, face, desktop/narrow viewport and 22/22 audio, but release/targeting still records 0 shots/0 hits after a real target click.
- Classified R1 as PARTIAL, preserved the candidate, left `cloudflare-live` and the fixed Combat Stage unchanged, and selected exactly one R2 release/targeting gate.

## 2026-09-22 · C-MVP-A exact packaging + browser baseline

- Reconfirmed PR #5 source lock at `954f2db7484dc566e468e5ce89b0d95940d97537`.
- Re-ran 68/68 repository tests, 215-file portable build and 172/66 re-home verification.
- Packaged all 215 exact runtime blobs on `georg-doc/kayfabizarro:stage/combat-ca2-pr5-c-mvp-a-2026-09-22`.
- Resolved the previous binary transport blocker without replacing fonts or VFX.
- Captured a real-browser baseline and found two runtime blockers: missing Driver EyeRig/Mouth forwarding and non-finite KayKit enemy positions.
- Kept every Combat owner and runtime file unchanged.
- Did not claim `PUBLIC_VERIFIED`, did not start C-MVP-B, Legacy, melee or Spindle.

## 2026-09-20 · Final handoff metadata

- Validated handoff parent `95971ff0f817ef9d1280f1f235e10d0b2adc89b8`.
- GitHub Actions run 35524287323 / job 106113636457: 68/68 PASS.
- Portable build: 215 files.
- Re-home verification: 172 preserved runtime / 66 verified donor files / routes PASS.
- Added full public-stage failure-recovery export after two blocked binary transfer paths.
- No incomplete Stage mirror, Hub test link, Live promotion or runtime workaround was introduced.

## 2026-09-20 · Evidence checkpoint

- Head `ebcbde06d931e71a410d5f68bd7ade4eae8984dc`.
- Added source provenance and owner map.
- Added exact player/enemy animation map including named neutral fallbacks.
- Recorded exact-head CI: 68/68 tests, 8/8 CA2 checks; re-home 172/66 PASS.
- Corrected recovery provenance: `bd01a150…` is a recovered ChatGPT-Sites source hash, not a Git commit in `kayfabizarro`.
- Investigated direct KFB Stage packaging without adding a second runtime.
- No Race, Travel, Dungeon, Hub runtime or Live promotion performed.

## 2026-09-19 · Implementation checkpoint

- Implementation parent `6bd36e7a2da090d240ab520de9c280ac73fe12cb`.
- Integrated current FrizzleBob Driver Graft behind the bounded CA2 seam.
- Preserved Player.v2 as movement/ground owner and one DriverCA2 player mixer.
- Exposed graft muzzle anchor to existing Gunfight.
- Added exactly two verified KayKit Skeleton visual/animation adapters.
- Preserved MobBrain, Gunfight, Rewards and RunFlow ownership.
- Added `/slices/combat-integration-v2/` route and portable-build coverage.
