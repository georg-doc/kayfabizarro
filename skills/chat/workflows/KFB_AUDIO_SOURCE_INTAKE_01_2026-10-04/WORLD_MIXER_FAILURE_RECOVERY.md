# KFB Audio Site · Musical World Mixer · FAILURE RECOVERY · 2026-10-04

**Classification:** `FROZEN_CANDIDATE · MIXER_CORE_GREEN · SOURCES_AUGMENTATION_QA_FAIL`

## Product reality

The requested Musical World Mixer itself reached a green browser candidate before the later Sources augmentation:

- implementation head: `471422243053ae695caf1578761aa3b3a45ed9aa`
- World is the default Site surface;
- Journey has 8 scenes;
- Town → Drive scene switching works;
- 4 / 8 / 16 transition control exists;
- Voice duck control exists;
- Library remains 69 / 59 / 29;
- browser run `37208076733`: **15/15 PASS**
- both Audio Site workflows at that head passed.

The visible direction is the requested clean/minimal UI.

## Later augmentation failure

After the green Mixer, the already-prepared 1,704-file SFX Library was folded into the secondary `Sources` area so it would not become another dashboard/tool.

Two repair passes on that combined browser gate were consumed.

Final frozen product head:
`2fe9701b0381c82f6defdbb745823664900fbc70`

Final run:
- run `37208558394`
- browser stopped after 6 successful Mixer checks;
- source validator PASS;
- JS syntax PASS;
- page/HTTP errors recorded by harness before stop: 0;
- artifact `11305422393`;
- digest `sha256:a4e283f70c094abf5153708fbbc09a72032838c5e36105522e5557ab802301bf`.

## Exact remaining defect

`tools/KFB-Audio-Site/audio-site.js`

Current frozen line:

`function setFadeSeconds(sec){fadeSeconds=sec;$('#world').dataset.fade=String(sec);$('[data-world-fade]').forEach(...)}`

The helper `$` returns one element. This line attempts `.forEach` on that element.

Expected recovery is one selector correction:

`$('[data-world-fade]').forEach(...)`
→
`document.querySelectorAll('[data-world-fade]').forEach(...)`

Do not broaden the recovery.

## What is already proven and should be kept

- clean/minimal Site shell;
- four primary tabs only: World / Library / Sources / Prompt;
- World as default/core;
- Journey recipe: Town / Move / Drive / Dystopia / Party / Utopia / Protopia / Reflect;
- Moshpit recipe;
- whole-master mixer architecture;
- World / Vehicle physical layers;
- Voice duck concept;
- compact 4 / 8 / 16 transition timing;
- Library simplification;
- SFX Library remains secondary/collapsed under Sources;
- one Site / one catalog / no new AudioContext owner.

## What is not claimed

- current frozen head is not browser-green;
- live `kfb-audio` Site has not been updated to this Mixer;
- no human listening acceptance of transition quality yet;
- no stem-family live morphing is claimed.

## Smallest next recovery

A fresh executor may make **only the one selector correction above**, rerun existing QA unchanged, and if green update the existing `kfb-audio` Site project.

No new Site. No Cloudflare. No redesign.
