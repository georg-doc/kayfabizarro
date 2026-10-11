# Independent driving / geometry audit R1

Final verdict: PASS for isolated original J17 inherited K2B traversal, actual native road mesh and sampled complete scene clearance / terrain attachment. Interactive world integration remains NOT_TESTED. No Golden or Merge.

Original source bytes are recorded in test_source_lock.json. The local Organ O1-v4 vendor-j15 core is byte-identical to the J16-r2 core inherited by J17. The extracted K2B controller was executed without editing its physics or substituting an autopilot.

## Actual checks

- 11/11 original Track Core checks pass. Road width 14.4 m; route length 369.813 m; grade zero. Maximum local ds deviation 0.0008813 m remains disclosed because original makeFrame indexes by s/ds.
- 12/12 original-controller traversals finish: 30/60/120 Hz, forward/reverse, original proxy width 2.16 m and conservative vehicle width 4.1 m, assist 0.8. Zero hits, rescue, takeoff or nonfinite states. Forward 9.933 s, reverse 40.633 s. Minimum all-vehicle lateral road reserve 3.68343 m.
- 7,410 rays on the actual native road/body mesh: road covers offsets ±5/±3/±2.05/0 m, no interior misses and zero track-body obstruction within 7 m overhead. Maximum road/stream deviation 2.98e-8 m. Seven exact first-edge numerical misses pass the explicit 1 mm inward retry, retained in JSON.
- Complete final evaluated scene (152 meshes) tested with 4,684 terrain/prop rays. Conservative longitudinal extent ±3.25 m and lateral extent ±3.55 m include vehicle width plus measured controller displacement. Zero overhead obstacles. Both internal docking regions (first/last 20 m, five offsets through ±10 m deck width) have terrain beneath them.
- Initial docking underside gap reached 0.05000043 m; the preserved scene_geometry_before_contact_tune.json records this TUNE. Independently rechecking the final changed geometry confirms all measured docks embed at least 0.0099995 m (approximately 1 cm). Deeper embedding reaches 1.59206 m and remains below pavement. Zero docking samples lack terrain. Final evaluated scene SHA256: `c82c54b1fba777576ad12e55579fdada38e652985b65d3706df5a49c93469923`.

## Limits / next gate

These are original-controller tests and actual mesh queries, not a browser gameplay recording. Controller contact is prescribed by the route stream; ray checks are independent sampled geometry checks, not an exact continuous convex sweep. Internal endpoints are open track docks: a complete free-drive exit, two-way network junction or transition into on-island roads is not implemented or certified. The screenshot/design itself establishes no physics proof.

Next gate: Georg reviews native source isolation plus actual neutral/clay candidate pictures. Final contact-only TUNE has passed independent recheck. The owning runtime must later exercise integration of docks, true vehicle wheels, controls, camera and world collisions before claiming complete interactive drivability.
