# Vehicle Deformer Lab v2 · source receipt

Status: **SOURCE RECEIVED · STATIC PASS · LOCAL BROWSER BOOT PASS · HUMAN VISUAL ACCEPTANCE PENDING**  
Received: 2026-09-19  
Source: Georg's Dropbox export `KFB Cartoon Vehicle Deformer Lab v2/WSA_Vehicles_v2_2026-09-18/`

## Scope received

- 32 source files, 829,311 bytes before this receipt;
- 61 declared ground fixtures;
- 10 declared flight fixtures;
- 23 deterministic motion sequences;
- current ground presentation seam: `kfb.cartoon-vehicle-deformer/2`;
- flight tab and flight plan present, but no flight-motion implementation.

The Markdown files inside the export are source material from the producing workspace. They were
reviewed as evidence and planning input; they were not treated as new instructions for this intake.

## Checks run on the received bytes

- 14 JavaScript files: syntax PASS with Node.js;
- 3 JSON files: parse PASS;
- aggregate SHA-256 over the sorted pre-receipt file-hash list:
  `b44c089ec41e28712466e752269191bac43c44abdeba310e78e259991dcb2472`;
- local HTTP cold start of `KFB Cartoon Vehicle Deformer Lab v2.dc.html`: PASS;
- `car-hatchback`: 4 measured wheels, idle readout visible;
- flight tab: 10 fixtures listed, `airplane-a` loaded, motion selector disabled and the missing
  flight deformer stated explicitly.

These checks prove source integrity, syntax and one browser boot path. They do not prove all 23
sequences visually, every external model URL, mobile authoring usability, Race integration or
Georg acceptance.

## Owner boundary

ToolBox owns this authoring/intake source. Race, Travel and later gameplay consumers keep their own
physics and runtime ownership. A consumer may read the deformer signals; it must not let this module
write vehicle contact pose or collision geometry.

## Next gate

1. Stage the presentation-only deformer on the existing OSM drive without changing its physics.
2. Georg checks the visible read for acceleration, braking, turning, drift and landing.
3. Build flight motion as Vehicle Lab v3 from the dedicated TinySkies/Travel brief; do not label the
   current flight tab implemented.
