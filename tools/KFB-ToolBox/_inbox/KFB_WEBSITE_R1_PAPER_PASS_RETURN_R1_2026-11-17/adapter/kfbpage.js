// KFB paper pass: the sheet under the pencil and the watercolour look. It gives the paper's tone and tooth and draws the pencil outline that
// both looks leave to it (found from depth). The two passes are Patch's, used unchanged: vendor/patch-coloured-pencil/src/page.js (blob 23213d95)
// and vendor/patch-watercolour/src/page.js (blob 3dfa47d1), code MIT, art CC0. This file is only the adapter:
//   - it is the host's ONE final path while it is on: render(scene, camera) replaces the host's own final render call, it is never run after it;
//   - both sheets are made once per renderer and kept (the sources have no dispose); only one is used per frame;
//   - it puts the renderer's clear colour back. The sources end on the screen (target null): a host that ends on its own target cannot use this as is.
import { createPage as pencilPage } from './vendor/patch-coloured-pencil/src/page.js'
import { createPage as washPage } from './vendor/patch-watercolour/src/page.js'

export function createPaper(THREE, { renderer } = {}) {
  const pages = {}, colour = new THREE.Color(); let kind = null
  const page = (k) => pages[k] || (pages[k] = k === 'wash' ? washPage(renderer) : pencilPage(renderer))
  return {
    set(k) { kind = k === 'pencil' || k === 'wash' ? k : null; if (kind) page(kind).resize(); return kind },   // null: off, the host renders as before
    get kind() { return kind },
    resize() { for (const p of Object.values(pages)) p.resize() },   // from the host's own resize
    // returns false when it is off, so the host can write: paper.render(scene, camera) || renderer.render(scene, camera)
    render(scene, camera) { if (!kind) return false; renderer.getClearColor(colour); const alpha = renderer.getClearAlpha(); page(kind).render(scene, camera); renderer.setClearColor(colour, alpha); return true },
    report: () => ({ kind, made: Object.keys(pages) }),
  }
}
