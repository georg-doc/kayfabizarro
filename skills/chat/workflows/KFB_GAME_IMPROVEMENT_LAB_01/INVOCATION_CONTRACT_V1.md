# KFB Game Lab · Invocation Contract v1

Status: **SOURCE PREPARED · PRIVATE SKILLS-ONLY PLUGIN CREATED · NO PLAYTEST EXECUTED**

Use `KFB Game Lab [help | focus=<optional topic> scope=<optional target> mode=<optional mode>]` in Webchat. Flexible German-language instructions are valid.

| Argument | Default | Examples | Action |
| --- | --- | --- | --- |
| `focus` | `auto` | `animation`, `art`, `gameplay`, `narrative`, `claymation`, `performance`, quoted free text | Narrow observation, not the slice's acceptance boundary |
| `scope` | `current` | `"FrankenStein Composer"`, `"PR #348"`, `"issue #360"`, explicit repo/ref | Resolve one real project/owner/branch from current GitHub |
| `mode` | `discover` | `discover`, `build`, `break` | `discover` is read-only; `build` requires separate write authorization; `break` is DEFERRED |
| `help` | On demand | `KFB Game Lab help`, `-h`, `--help` | Display options and a short guide, without querying GitHub or running agents/tests |

Examples:
```text
KFB Game Lab help
KFB Game Lab
KFB Game Lab focus=animation
KFB Game Lab scope="FrankenStein Composer"
KFB Game Lab focus=gameplay scope="PR #348"
```

`scope` does not override project STOP/Human gates, and `focus` does not make unimplemented future features test failures. If `scope=current` cannot be resolved, respond `TARGET_UNRESOLVED`; never silently assign a production writer. Breaker tests require an exact isolated disposable environment and authorization. Parameter `mode=build` alone **does not** confer GitHub write permission.

The five roles (Playtester, Art Director, Animation Director, Game Designer, 3D Developer) are coordinated perspectives until genuinely independently invoked and evidenced. Project SSOT/GitHub head outrank plugin-local snapshots.

Private plugin: https://chatgpt.com/plugins/plugins_6acd274ca7848191bc9e657220ce5b18
