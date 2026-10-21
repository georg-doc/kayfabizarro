// node crop.mjs in out x y w h scale
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import fs from 'fs'
const [i, o, x, y, w, h, s = 2] = process.argv.slice(2)
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w * s, height: h * s } })
await p.setContent(`<body style="margin:0;overflow:hidden"><div style="width:${w * s}px;height:${h * s}px;background:url(data:image/png;base64,${fs.readFileSync(i).toString('base64')}) -${x * s}px -${y * s}px / auto ${'X'};image-rendering:pixelated"></div></body>`.replace(`auto X`, `auto`))
await p.evaluate(([s]) => { const d = document.querySelector('div'); const im = new Image(); im.src = getComputedStyle(d).backgroundImage.slice(5, -2); return new Promise((r) => { im.onload = () => { d.style.backgroundSize = im.width * s + 'px ' + im.height * s + 'px'; r() } }) }, [s])
await p.screenshot({ path: o }); await b.close()
