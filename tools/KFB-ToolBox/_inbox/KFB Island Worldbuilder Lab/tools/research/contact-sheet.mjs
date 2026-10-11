// Contact sheet of a folder of jpgs (rows = name prefix groups), composed in headless Chrome. node contact-sheet.mjs <dir> <out.jpg> [cols]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const [dir, out, cols = '4'] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f)).sort();
const b64 = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
const html = `<html><body style="margin:0;background:#222;font:12px system-ui;color:#ddd"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px;padding:4px">${files.map((f) => `<div><img src="${b64(f)}" style="width:100%"><div>${f}</div></div>`).join('')}</div></body></html>`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true });
const page = await (await browser.newContext({ viewport: { width: 2000, height: 1000 } })).newPage();
await page.setContent(html); await page.waitForTimeout(500); await page.screenshot({ path: out, type: 'jpeg', quality: 85, fullPage: true }); await browser.close(); console.log('ok', files.length);
