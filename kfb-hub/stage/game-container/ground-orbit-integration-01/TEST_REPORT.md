# GROUND-ORBIT-INTEGRATION-01 · Stage Test Report

Status: SOURCE REAL-BROWSER PASS · PUBLIC PROOF PENDING
Date: 2026-09-29

## Exact tested source
- branch: `chatgpt-web/kfb-container-ground-orbit-integration-01-2026-09-29`
- runtime/QA head: `9a71c79d63cd985f0ab622e4309656ab522ccea4`
- handoff head before Stage publish: `2de6b06f918666a43e449941887f5b54e7d4d7f3`

## Source evidence
Actions run `36557928700`
Artifact `11029226537`
Digest `sha256:8aadac4950f6b877cc06451613ad83788be28b47982a847d5c657ae42bf93ce3`

- Locomotion donor static: **16/16 PASS**
- Orbit integration static: **10/10 PASS**
- B2 regression: **29/29 PASS**
- Velocity locomotion: **22/22 PASS**
- Combined Velocity + Orbit: **27/27 PASS**
- runtime/page/console errors: **0**

Combined values:
- Walk 0.6109509569 u/s
- Running_A ramp 2.5867839515 u/s
- Running_B sprint 3.0240851618 u/s
- jump apex 1.2075871706 u
- sprint-jump travel 3.90 u
- Orbit drag camera displacement 7.66 u
- wheel target distance 7.50 → 3.52 u
- C recenter yaw diff 0

## Public gate
Target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-orbit-integration-01/?ground=1&groundFeel=velocity`

Do not claim PUBLIC_VERIFIED until the dedicated public Chromium workflow passes this exact revision and Hub link.


## Public Cloudflare proof

Publication source head:
`cloudflare-live@65c00aed4a9e0250b0850d1b170460d9ea66126e`

Cloudflare Pages: **SUCCESS**

Public Chromium:
- run `36559167238`;
- job `109375578354`;
- **18/18 PASS**;
- exact runtime marker `9a71c79d63cd985f0ab622e4309656ab522ccea4` PASS;
- Velocity candidate + Running_B/directional clips PASS;
- actor-scale Jump PASS;
- Orbit owner / drag / zoom / C-recenter PASS;
- public Walk / Sprint / Jump air / Land PASS;
- runtime errors 0;
- page/console errors 0;
- Hub integrated link PASS;
- artifact `11029362774`;
- digest `sha256:49b3eac2fc189a7babb5b993d03d7499e0b86b1a5f4f9ee06e951daffb9be650`.

Status: **PUBLIC VERIFIED**.
