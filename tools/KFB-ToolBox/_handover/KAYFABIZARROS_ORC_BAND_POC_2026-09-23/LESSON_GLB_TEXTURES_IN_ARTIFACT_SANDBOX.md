# Lesson · GLB textures missing in the Artifact sandbox (three.js)

Status: TESTED RESULT · 2026-09-23 · ORB-P1 review page

## Symptom

A GLB that looks correct in Blender renders **white / untextured** in the Claude Artifact review page.
Models with only material colours (e.g. the Legacy Orc B, no image textures) look fine, which makes it read like an asset problem. It isn't.

## Cause

three.js `GLTFLoader` decodes images embedded in a GLB with `ImageBitmapLoader`, which calls
`fetch(blob:…)`. The Artifact page's Content-Security-Policy does not allow `fetch()` of `blob:` URLs
(connect-src), so every embedded texture fails silently. The browser console shows:
`Refused to connect to 'blob:…' because it violates … connect-src`.

Reproduced locally by adding `<meta http-equiv="Content-Security-Policy" content="connect-src 'self'">` to the page.

## Fix (one line, before creating the loader)

```js
try { window.createImageBitmap = undefined; } catch (e) {}
```

Without `createImageBitmap`, `GLTFLoader` falls back to `TextureLoader` (an `<img>` element), which the sandbox allows.

Related: data-URI buffers are also fetched by the loader. The review page therefore ships the module as glTF-JSON and rebuilds a GLB in memory before `GLTFLoader.parse()`.

## Where else this probably applies

Any KFB three.js page hosted in a CSP-restricted frame (Artifacts; possibly the Scene Lab v3 "white bodies" and the Asset Librarian preview). Check the console for `blob:` / connect-src errors before blaming the asset.
