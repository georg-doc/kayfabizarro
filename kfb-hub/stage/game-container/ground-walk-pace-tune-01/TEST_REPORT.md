# GROUND-WALK-PACE-TUNE-01 · Stage Test Report

Status: SOURCE REAL-BROWSER PASS · PUBLIC PROOF PENDING
Date: 2026-09-29

Tested runtime head: `d6e9d42149670af290d96fe19dfdc28095f2f337`
Run: `36582612505`
Artifact: `11040906054`
Digest: `sha256:ae9e6929c02fcf0357fb7c57228d168a64561f7b9d5f21f152ccd8f1f6a3289e`

- static: **6/6 PASS**
- Ground+Orbit regression: **27/27 PASS**
- Travel-Walk: **14/14 PASS**
- errors: 0

Travel-Walk:
- Walking_A @ **1.8×**
- target **1.0997117224 u/s**
- settled **1.0989688245 u/s**
- Running_A tier **2.7251 u/s**
- Running_B sprint **3.0254 u/s**
- release returns to Walking_A **1.1019 u/s**
- Orbit preserved.

Target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`


## Public Cloudflare proof

Publication source head:
`cloudflare-live@20c1858c2f6cdd0b48136eb8295b7c803a5e12f6`

Cloudflare Pages: **SUCCESS**

Public Chromium:
- run `36583694971`
- job `109458242652`
- **13/13 PASS**
- exact runtime marker `d6e9d42149670af290d96fe19dfdc28095f2f337` PASS
- Travel pace active
- Walking_A playback 1.8×
- public faster Walk ~1.0985 u/s
- Running_A tier retained
- Running_B Sprint retained
- release returns to faster Walking_A
- Orbit mounted
- runtime/page/console errors: 0
- Hub pace-tune link PASS
- artifact `11040747449`
- digest `sha256:8c1b6f7e9bd53d8637fc814efff2e27ca91beb80629b34d63d7c593ead353fe2`

Status: **PUBLIC VERIFIED**.
