// Side-by-side comparison sheet (reference left, renders right), composed in headless Chrome (no image libs needed).
// node tools/env/compare.mjs <out.jpg> <title> <refImage> <render1> [render2 …]   (labels from file names)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const [out, title, ref, ...renders] = process.argv.slice(2);
const b64 = (f) => 'data:image/' + (f.endsWith('.png') ? 'png' : f.endsWith('.webp') ? 'webp' : 'jpeg') + ';base64,' + fs.readFileSync(f).toString('base64');
const W = 2600, Hh = 1100, cols = renders.length > 2 ? 2 : 1;
const html = `<html><body style="margin:0;background:#f3efe6;font:600 22px system-ui;color:#2b2340">
<div style="padding:14px 20px">${title}</div>
<div style="display:flex;gap:16px;padding:0 20px">
 <div style="flex:0 0 1300px"><div style="font-size:16px;margin-bottom:6px">${process.env.REF_LABEL ?? "Vorlage (Georgs Blatt)"}</div><img src="${b64(ref)}" style="width:1300px;border-radius:8px"></div>
 <div style="flex:1;display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px">${renders.map((r) => `<div><div style="font-size:16px;margin-bottom:6px">${path.basename(r).replace(/\.(jpg|png)$/, '').replace(/_/g, ' ')}</div><img src="${b64(r)}" style="width:100%;border-radius:8px"></div>`).join('')}</div>
</div></body></html>`;
const CH = ['/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'];
const browser = await chromium.launch({ executablePath: CH[0], headless: true });
const page = await (await browser.newContext({ viewport: { width: W, height: Hh }, deviceScaleFactor: 1 })).newPage();
await page.setContent(html); await page.waitForTimeout(500);
await page.screenshot({ path: out, type: 'jpeg', quality: 88, fullPage: true });
await browser.close(); console.log('ok', out);
