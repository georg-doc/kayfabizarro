# ACTIONFIGURE-MOTION-FREEPLAY-01 · RETURN

Status: IMPLEMENTATION CANDIDATE · SITE REVIEW MIRROR PLANNED
Owner: KFB ToolBox / Animation-Motion authoring
Receiving owner: PR #333

## Why this exists

Georg does not need another technical handoff. This is the concrete visual/freeplay surface.

### Who does what

**ChatGPT Web/GitHub**
- builds the prototype;
- runs source/static/browser checks;
- saves the exact tested HTML to the KFB Production Control Site;
- gives Georg one clickable review link.

**Georg**
- opens that link;
- uses WASD / Shift / Space;
- compares Jog A/B, Run A/B and Sprint A/B;
- replies with the preferred variants and anything that visibly feels wrong.

Georg does not inspect commits, branches, CI or deployment state for this gate.

## Product surface

- exact authored ActionFigure donor, isolated on neutral ground;
- no Travel Globe;
- no World #332 yet;
- central Motion State owner only;
- root/hips translation removed from presentation clips, as in the existing Motion Lab donor, so the controller remains the only world-position writer;
- smooth gait changes consume the central measured ladder;
- reverse uses the central source-backed `walkBack` rung;
- jump uses central KayKit Jump_Start / Jump_Idle / Jump_Land roles;
- A/B look choices modify only the candidate clip used by that central semantic state.

## Publication rule

For this gate, KFB Production Control Site is the primary human review transport. Cloudflare is deferred until a durable World/Hub milestone.

No Live promotion and no merge.
