# RECOVERY · Procedural Test World 01

## Human intent

Stop using old Travel Globe as the routine locomotion test environment.

Prepare a current procedural KFB world in parallel with Locomotion and Resident work.

## Current lane

Repo:
`georg-doc/kayfabizarro`

Draft PR:
#332

Branch:
`chatgpt-web/procedural-test-world-01-2026-10-03`

Implementation head proven by CI:
`4418c0a59808e7cca183535537bee1b086e2d84a`

## Proven state

- stable B3 WorldBuilder owner set rehomed;
- Hürth-B1 procedural building zone present;
- WB2 terrain/edit owners retained;
- old wi1-play disabled in dedicated test-world entry;
- Travel/card host absent from that entry;
- wide initial edit camera;
- P1/P2 procedural nature modules present;
- source CI PASS;
- resource registry PASS.

## Travel regression conclusion

Travel's card regressions were primarily host/lifecycle coupling:
- huge serial deck startup could leave white cards;
- Ground suppressed the Flight sky update path that also pumped PDF card artwork;
- host changed repeatedly while card adapter itself stayed unchanged;
- tests protected owner/source code more than visible integrated card presentation.

Travel remains a named later consumer/donor, not the neutral test world.

## Motion boundary

Do not attach old `wi1-play`.

Current Motion owner:
PR #331.

Only attach the new central Motion consumer after:
- Blender ladder reconciliation;
- neutral ActionFigure prototype;
- Georg visual PASS.

## Exactly one next world action

Add bounded procedural nature dressing + continuous-island form seam in the same WorldBuilder owner.

No new world owner.
No Travel host.
No locomotion fork.
