# R28 · Website docking delivery

R28 source delivery complete; R28b experiment follows separately, not accepted yet.

Private game-repo branch: `wsa/infiniterooms-r28-website-20261115`
Delivery SHA: `7ebd6d27c6e716920b6ded8904693711028cdc24`
Source: permitted R27 `c106d7cd74f1609426586439055c8f8b5a6e3b61` (contains R25 Escher circuit), copied as an isolated source project under `infiniterooms/`, with all 1226 required source/asset files. Main game paths unchanged; no merge. Generated dist, old evidence screenshots and Site hosting binding intentionally omitted. `npm ci && npm test && npm run build` inside `infiniterooms/`.

- [Source](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms)
- [Source inventory](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/SOURCE.json)
- [Map JSON](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/site-map.json)
- [Map JPG, 76 KB](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/site-map.jpg)
- [Existing/missing interfaces](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/INTERFACES.md)

`setTime`, external `setCamera`, foreign-wall replacement, and Website hit subscriptions for both destruction hosts are missing. Exact current owners/internal functions and smallest proposed seams are described; none newly implemented. Patch/WebGPU and tunnel/Rapier remain distinct. Full source inventory was read back at the delivery SHA. The old R25/R27 commit identifiers were Site-local and not found in the game repo; this delivery gives them an actual game-repo branch/checkpoint.

Private Site remains on its newer source; R27 delivery does not downgrade it. Current Dungeon startframe investigation (R39) is separate. No new performance, R28b view quality or Remotion capture acceptance is claimed here.
