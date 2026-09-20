# Source Snapshot

Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/ca2-02-ranged-calibration-2026-09-20`  
Recovery parent: `19b7699a5b79a296ebc818256b200129a7a8254e`  
PR #135 remains Draft.

## Public accepted baseline
- runtime `a5e09d6744f4a26e63a5f7e706be8a631459d28d`
- public run/job `35489658278 / 106022296782` · 55/55 PASS
- publication `cloudflare-live@cf15f612e6a700608564cadbded4302ba59b1af2`
- Stage `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

## Failed Pass 1
- runtime `d32b71d800a8d5ffc7c58828b1544e6d47731143`
- gate head `78b0dc20c858017e94c443c1e068aa38893fd261`
- X delta `-5°` → effective `[-19,77,0]`
- Aim pitch **+12.471°**
- FAIL ±3.5° gate
- run/job `35490564334 / 106024650939`
- artifact `10598807248`

## Failed Pass 2
- runtime `155becf16a467f125ee44958b2f2a295dbe27cd0`
- gate head `ec2693055a465dee050d3127bd7d3263d8f94276`
- X delta `+1.5°` → effective `[-12.5,77,0]`
- Aim pitch **+5.151°**
- FAIL ±3.5° gate
- run/job `35490701005 / 106025001031`
- artifact `10598967232`

Neither failed runtime was published.
