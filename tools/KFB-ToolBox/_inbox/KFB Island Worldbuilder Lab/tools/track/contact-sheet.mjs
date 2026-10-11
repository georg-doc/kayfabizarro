// contact sheet from stills in one folder: node tools/track/contact-sheet.mjs <dir> <out.jpg> <cols> "file|label;file|label;…" [title] · env ASPECT (tile h/w, 0.625) and FIT=contain keep whole stills
// (headless Chrome renders a plain grid page; labels under each tile, for the steering session, not for the blind critics)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
const [dir, out, cols = '2', list, title = ''] = process.argv.slice(2), items = list.split(';').map((s) => s.split('|')), C = +cols, W = 1600, tw = Math.floor((W - 16 * (C + 1)) / C), th = Math.round(tw * (+process.env.ASPECT || 0.625));
const rows = Math.ceil(items.length / C), H = (title ? 56 : 16) + rows * (th + 46);
const html = `<html><body style="margin:0;background:#1d1b1a;font:15px -apple-system,Helvetica,sans-serif;color:#eee">${title ? `<div style="padding:16px 16px 4px;font-size:20px">${title}</div>` : ''}<div style="display:grid;grid-template-columns:repeat(${C},${tw}px);gap:16px;padding:12px 16px">${items.map(([f, l]) => `<div><img src="data:image/jpeg;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}" style="width:${tw}px;height:${th}px;object-fit:${process.env.FIT || "cover"};display:block"><div style="padding:6px 2px">${l}</div></div>`).join('')}</div></body></html>`;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage({ viewport: { width: W, height: H } }); await p.setContent(html); await p.waitForTimeout(500); await p.screenshot({ path: out, type: 'jpeg', quality: 88, fullPage: true }); await b.close(); console.log(out);
