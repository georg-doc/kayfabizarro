# Combat Arena · Web Stage masterplan

Status: **WEB SLICE REVIEW SURFACE · NOT ARENA RUNTIME SSOT**  
Stable route: `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`

## Authority boundary

- **Implementation SSOT:** `georg-doc/KFB-Combat-Arena`.
- **Runtime integrator:** WSA/local lead.
- **This surface owns only:** isolated Web-slice review pages, source receipts, evidence links and human-gate state.
- **This surface never owns:** Arena Player movement/root/ground, Gunfight/release, Host camera, rewards/runflow or productive actor lifecycle.

## Current lane

| Slice | Outcome | State | Dependency |
|---|---|---|---|
| CA2-00 | exact source / actor candidate report | prepared in Combat CA2 handover | none |
| CA2-01 | isolated actor selector + profile contract POC | branch browser verified · public gate next | Motion Lab donor evidence |
| CA2-02 | ranged grip / muzzle / release calibration | HOLD | CA2-00 source report |
| CA2-03 | two KayKit enemy adapter profiles | HOLD | accepted actor/clip profiles |
| SKY-01 | host-neutral spindle sky module | prepared separately | none |

## CA2-01 rules

1. FrizzleBob Driver Graft uses the already proven Motion Lab donor and graft reader.
2. GothGirl uses the exact pinned KayKit model.
3. Legacy FrizzleBob stays explicitly available, but this shared Stage does not copy its Arena-private model; it is shown source-only rather than with substitute geometry.
4. Other Rig_Medium names remain HOLD until CA2-00 pins their exact source and required gates.
5. `?actor=<id>` is deterministic for review, but no Arena save/localStorage is written.
6. No world movement, physics, combat, rewards or Arena save state exist in this POC.

## Publication rule

Source branch → browser evidence → lean `cloudflare-live` mirror → exact `kayfabizarro.pages.dev` route → human gate. No auto-merge and no Live Arena promotion.
