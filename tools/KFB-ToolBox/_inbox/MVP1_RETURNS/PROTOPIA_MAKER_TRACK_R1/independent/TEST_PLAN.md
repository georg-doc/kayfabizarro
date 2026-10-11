# Independent drivability audit plan

Status: candidate pending. No drivability PASS claimed.

The O1-v4 local vendor-j15 Track Core is byte-identical to the J16-r2 core inherited by J17. Original J17 joyride-drive.j10.js imports K2B by default; the exact inherited K2B bytes are isolated here, not rewritten.

1. Run original Track Core runChecks on actual candidate stream: orthonormal frames, arc lengths, tangent kinks, curvature steps, bank rate, profile slots, inner-edge folds, route self clearance and vehicle headroom.
2. Report width, slope, sample spacing and seam changes. The original makeFrame uses s/ds indexing; any mismatch is material and must remain visible.
3. Run original K2B stepDriver forward and reverse at 30, 60 and 120 Hz; standard 2.16 m proxy and conservative 4.1 m all-vehicle width. Record actual route completion, finite states, road reserve, impacts, rescue/takeoff events. No controller rewrite or replacement autopilot.
4. Independently inspect actual rendered mesh for road coverage and all-vehicle 7 m headroom / obstacle envelope / island socket contacts. Stream-only results cannot establish rendered world collision correctness.

Limits: successful isolated original-controller traversal is not interactive browser gameplay approval. K2B drives in prescribed route coordinates; the independent mesh audit remains required. New imagery is not physics evidence. No Golden, Merge or runtime promotion.
