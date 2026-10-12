# KFB Game Lab Invocation Contract v1

Invocation accepts no arguments (`focus=auto scope=current mode=discover`) or any subset of named optional parameters.

Examples:

- `KFB Game Lab`
- `KFB Game Lab help` / `-h` / `--help`: display options and quick usage; no project inspection or action
- `KFB Game Lab focus=animation`
- `KFB Game Lab scope="FrankenStein Composer"`
- `KFB Game Lab focus=gameplay scope="PR #348"`
- `KFB Game Lab focus="Town claymation" scope="Open World" mode=discover`

Modes are `discover` read-only, `build` proposal until separately authorized in an exact owner/branch, and `break` deferred opt-in isolated playtesting only.

Resolve actual target and claim status from current GitHub SSOT; scope cannot override STOP/Human gates, or confer code-write permission. `help` is side-effect-free. When no resolved current owner exists use `TARGET_UNRESOLVED` instead of choosing stale product.
