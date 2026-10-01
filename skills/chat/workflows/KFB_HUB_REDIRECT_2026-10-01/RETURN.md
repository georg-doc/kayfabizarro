# KFB Hub redirect · Return

Status: IMPLEMENTED ON BRANCH · NOT MERGED · NOT PUBLIC VERIFIED

## Goal

Keep the familiar current Hub UI while making the historical root URL `https://kayfabizarro.pages.dev/kfb-hub/` forward to the current Production Control owner at `https://kfb-production-control.frizzlebob.chatgpt.site/`.

## Owner and boundary

- Owner: KFB Production Control root plus the compatibility entrypoint `kfb-hub/index.html`.
- The redirect applies only to the old `/kfb-hub/` root document.
- Child routes such as `/kfb-hub/stage/`, `/kfb-hub/pruefen/` and asset/runtime files stay untouched.
- Production Control already renders the accepted Hub UX through `/runtime/hub-approved`; it does not load the redirected legacy root and therefore does not create a loop.

## Changed files

- `kfb-hub/index.html`
- `skills/chat/START_HERE.md`
- `skills/chat/CHANGELOG.md`
- this Return

## Checks

- redirect target is absolute HTTPS;
- JavaScript `location.replace` preserves query and fragment;
- meta-refresh and a normal anchor provide no-script fallbacks;
- no child route or Cloudflare deployment configuration changed.

## Next gate

Merge the PR, wait for the existing kayfabizarro publication workflow, then open both URLs and verify: legacy root forwards once; Production Control shows the accepted current Hub UI.
