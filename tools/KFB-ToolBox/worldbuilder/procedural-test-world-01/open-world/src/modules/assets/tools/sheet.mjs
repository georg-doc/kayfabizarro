// Contact sheet of PNGs (box-downscaled), for looking at many presets at once.
// node src/modules/assets/tools/sheet.mjs out.png cols scale a.png b.png ...
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PNG } = require('../../../../node_modules/pngjs');
const [out, colsS, scaleS, ...files] = process.argv.slice(2);
const cols = +colsS, f = +scaleS;
const imgs = files.map((p) => PNG.sync.read(fs.readFileSync(p)));
const w = Math.floor(imgs[0].width / f), h = Math.floor(imgs[0].height / f);
const rows = Math.ceil(imgs.length / cols);
const o = new PNG({ width: w * cols, height: h * rows });
imgs.forEach((im, i) => {
  const ox = (i % cols) * w, oy = Math.floor(i / cols) * h;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const acc = [0, 0, 0];
    for (let dy = 0; dy < f; dy++) for (let dx = 0; dx < f; dx++) {
      const k = ((y * f + dy) * im.width + (x * f + dx)) * 4;
      acc[0] += im.data[k]; acc[1] += im.data[k + 1]; acc[2] += im.data[k + 2];
    }
    const q = ((oy + y) * o.width + ox + x) * 4;
    o.data[q] = acc[0] / f / f; o.data[q + 1] = acc[1] / f / f; o.data[q + 2] = acc[2] / f / f; o.data[q + 3] = 255;
  }
});
fs.writeFileSync(out, PNG.sync.write(o));
