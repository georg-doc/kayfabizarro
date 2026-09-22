# TEST REPORT · Hybrid Surface v2 frozen candidate

Status: **FAILURE RECOVERY · NO PUBLIC V2 CLAIM**

## Runs

- Run 1 `35671624437` / job `106569164335`: FAIL · Legacy head proxy lookup.
- Run 2 `35671823766` / job `106569756919`: FAIL · proof snapshot missing source pin.
- Run 3 `35672017517` / job `106570357717`: FAIL · actor compile census 58/63.
- Run 4 `35672227722` / job `106571025025`: FAIL · same actor compile census 58/63 after visibility repair.

## Run 4 checks observed PASS before stop

- HTTP 200
- runtime ready
- no runtime error at readiness
- exact Dungeon recipe
- 69 Dungeon placements
- 71 source meshes
- exact World Atlas pin
- exact predecessor RGB brush donor pin
- five exact actors
- all five exact head proxies matched
- head-size calibration exists
- all head metrics normalized within 1.5%
- Legacy final total height < Medium median
- Black Knight final total height > Medium median
- environment WORLD projection
- actors OBJECT projection
- one environment texture
- one actor texture
- same shared texture UUID
- surface contract textureCount = 1
- grain contract = procedural 3D
- environment map/color/roughness/metalness preservation
- actor map/color/roughness/metalness preservation
- source roughness distribution not globally clamped
- environment shader compile coverage

## Failure

`visible actor shaders compiled`

Observed:
`materials=64 · compiled=58 · visibleMaterials=63 · visibleCompiled=58 · preserved=7`

The proof threw at this point. Therefore later screenshot, 832px, failed-resource and page/console-error checks did **not** execute in Run 4 and are not claimed.

## Artifact state

Run 4 uploaded no evidence artifact. Source and workflow logs remain available through GitHub run/job references.

## Test conclusion

The candidate has substantial proven working subsystems but the browser proof is **FAIL**, so no v2 Stage/public acceptance is allowed.
