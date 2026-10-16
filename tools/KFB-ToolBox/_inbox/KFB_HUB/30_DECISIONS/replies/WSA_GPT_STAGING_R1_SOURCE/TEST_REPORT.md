# WSA GPT Staging R1 Test Report

17.10.2026 · Builder ChatGPT Work/WSA · factual tests separate from Georg acceptance.

- Contracts: 16/16 PASS. Tests as positive passed/total strings, objects, result arrays and summary arrays; missing links, zero/failed tests, hostile link and invalid entry rejected.
- Archive integration: 18/18 PASS against synthetic source + in-memory R2. New qualified head, unchanged artifact bytes, 5-entry rollover, prior open-build access, invalid-build fallback, offline fallback, dist bundle, path rejection, concurrent sync/history. This is not a live WS1 push or a real R2 contention test.
- Sites production build PASS.
- Real WS1 latest source: 8c5bd157c6c17d44b323453e97671aeec3251187; 18,100,265 bytes, source label main@8ce5ac5. Reported upstream tests 23/23, not rerun by WSA.
- Local delivery SHA256 matches original: b216ffd2d3e8afcda718cda35a308bb8470ac08c98f613e0297f010930e71d11.
- Browser local: mobile and desktop shell, metadata, disabled current Fahrprobe, Bühne and M1 start targets; actual amphitheatre, actors and card rendered. Full-page local M1 screenshot saved. No new game behavior authored or accepted.
- Exact hosted GPT URL: https://kfb-ws1-staging.frizzlebob.chatgpt.site . Owner-private deployment succeeded. Browser without login reaches access gate; sign-in awaits Georg. HTTP service-access probe: shell200 0.394s, cold latest status200 3.938s, history200 3.810s, bundle200 3.964s. Warm latest status0.524s. Two actual qualified manifest revisions available, not five invented revisions.
- Hosted HTML is 18,101,203 bytes: Sites infrastructure adds a 938-byte Cloudflare JavaScript challenge before body close. Removing only that insertion recovers all original bytes exactly. WS1 payload is unchanged; the final HTTP response is not byte-identical. No control to suppress infrastructure injection was used.
- Actual model raw.githubusercontent.com request and actual api.github.com dialog-pool request return200 and Access-Control-Allow-Origin: *. Hosted responses have no Content-Security-Policy header. Local browser rendering shows remote model/card loading; authenticated hosted-browser raw/API runtime verification remains pending.
- Independent critic /root/staging_critic: initial REPAIR for metadata, race, old artifact access and default selection. Read-only recheck CONTINUE to hosted evidence gate after fixes. Review is not Georg acceptance; reported remaining R2 retention and head freshness limitations retained.

## Not yet proved

A fresh real WS1 push observed by an authenticated hosted browser; full hosted <=30s scene-start measurement on Georg's device; actual five real revisions; real dist bundle from WS1; user save/config/world API integration. Private staged deployment is not public game promotion or replacement of Cloudflare fallback. Exactly one next gate: Georg's private-Site browser acceptance including the next real WS1 preview update.
