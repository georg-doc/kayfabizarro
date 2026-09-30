# G0 Donor Isolation Evidence

G0 records source identity before composition. This is not a visual acceptance page and creates no pseudo-human gate.

## 1 · Ground donor

- Exact PR: `georg-doc/kayfabizarro#294` @ `faf1902e06ada7a56b84660c66da11f7f784d90d`.
- Tested consumer head: `904889a10abe05e93bfac81451afc080d246bd81`.
- Source identity: `walk-controller.js` remains the sole world-position writer and consumes the stable locomotion profile.
- Existing evidence: canonical consumer 17/17, integration 10/10, Turbo baseline 29/29, Ground+Orbit 27/27 and Travel-profile browser 24/24.

## 2 · KayKit car donor

- Exact source: `car_hatchback.gltf` @ blob `0a01d2ab394731ae5d568cb607f8b880d5be4478`.
- External files: `car_hatchback.bin` @ `bc3fab7…`; `citybits_texture.png` @ `ffffc899…`.
- Parsed source nodes: one body and four wheels.
- Source contains zero animations, zero skins and no driver/occupant node.
- Decision: G1 uses this KayKit model; no Kenney Racer substitution is allowed.

## 3 · Race donor

- Exact private owner head was read back through the authenticated GitHub UI: `georg-doc/KFB-Stunt-Car-Race@df1e35b5692273e8a48eaa219697c927e2c39faa`.
- Track Lab v0.8: `RACE_FEEL_V08_CONFIG.json` and `feel-lab-v08.mjs` are pinned by Git blob and SHA-256 in the lock.
- Free Roam FR-S04-02: current Return says source-browser PASS and public-browser 62/62 PASS; human feel remains open. G0 therefore labels it a contact candidate, not a human-accepted replacement for v0.8 feel.
- The v0.8 host itself lists KayKit cars and optional Kenney race cars. G1 selects only its KayKit hatchback path and imports no Kenney mesh.

## 4 · P1a/J14 donor

- Exact J14 root is pinned on kayfabizarro main `aa6fd68…`.
- Track Core v0.12, stream-to-three v5, P1 recipe and six P1a stream parts are pinned individually.
- Combined P1a stream: 10,350,274 bytes; SHA-256 `4258c08f702cca3be77dde66d80ac66d5c65d760a48e51b088d005143cc5be09`.
- J14 is a Design Proof Candidate. Its measured pads and choreography can be reused; its k2/k2b/k3 drive loops, local Flight candidate and local input policy cannot.

## J15 decision

J15 is present and indexed, but it is not silently promoted. Its P1b/TC1 work is held for G3+ so G1 stays small and debuggable.
