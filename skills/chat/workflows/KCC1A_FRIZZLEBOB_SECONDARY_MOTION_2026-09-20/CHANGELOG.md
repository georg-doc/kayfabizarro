# KCC-1A · FrizzleBob Secondary Motion Facts · additive changelog

## 2026-09-20 · Race presentation facts adapter

### DECISION

Prepare FrizzleBob Race dangle/flutter as a **pure presentation-facts seam** before choosing or modifying any replacement ear geometry.

The adapter consumes only the current Stunt Race presentation hooks and returns bounded dimensionless root/tip/flutter targets. Race keeps vehicle/root/contact physics; KayKit Motion Lab keeps character motion; the existing FrizzleBob graft keeps head/face ownership; `actor-wobble.v1.js` remains the spring-behavior donor.

### IMPLEMENTATION

Added:

- `tools/KFB-ToolBox/kfb-rigs-embed-v3/secondary-motion/race-secondary-facts.v1.js`
- deterministic seed/time flutter with no hidden clock or randomness;
- zero-output rest state;
- bounded root/tip/impact/airflow facts;
- scalar and vector angular-velocity compatibility;
- no input mutation or state accumulation.

### HTML BENCH

Added:

`kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/`

The branch bench exposes the exact current Race signals with Rest / Cruise / Crosswind / Brake / Impact presets, normalized outputs and a deterministic flutter trace.

It explicitly renders **no ear mesh** and contains a no-placeholder guard.

### EVIDENCE

Workflow run `35529859288`:

- Node contract: **28/28 PASS**
- local Chromium/Playwright: **15/15 PASS**
- total: **43/43 PASS**
- failed HTTP/resources: **0**
- page/console errors: **0**

Artifact `10611241424`:
- `desktop.png`
- `browser.json`
- digest `sha256:803cee1e83d31f0a24353fb268acdc74b2a4bfbcac259efd4572340d2eb50eb4`

### DROPBOX / SOURCE RECON

The 2026-09-20 Cologne copy of the older FrizzleBob v2 Animation Lab briefing is text-identical to the already inspected copy; it is not a newer owner.

No admissible 3D Eraser/Radiergummi source was found in Dropbox. Rubber Duck 2D assets and a Rubber Ball POC are not substitutes.

### PUBLICATION

The intended Cloudflare route remains **NOT PUBLIC_VERIFIED**.

KCC-0 public run `35528646651` showed that the public host returned the KFB root page instead of the exact new Stage marker. KCC-1A therefore remains branch/local-browser evidence only and is not promoted to main/public Stage.

### PR

Stacked Draft PR #148 on top of KCC-0 / PR #147.

No auto-merge.

### NEXT GATE

KCC-1B · Ear Source Isolation + Choice:

1. current FrizzleBob ear donor alone;
2. at least one real alternative donor alone;
3. measurements + front/side/¾ comparison;
4. Georg chooses the source before integration.
