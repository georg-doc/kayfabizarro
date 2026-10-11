import { openLab } from '../stage1/browser.mjs';
const pts = JSON.parse(process.argv[2] ?? '[[1000,870],[950,900],[1100,800]]');
const { page, close } = await openLab('shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=0&seat=open');
await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
await page.screenshot({ path: '/private/tmp/claude-501/-Users-georgv-westphalen-Dropbox-CLAUDE/8e9628eb-6463-4d95-87a1-8aeb38050353/scratchpad/pick.jpg', type: 'jpeg' });
const r = await page.evaluate((pts) => pts.map(([x, y]) => ({ x, y, hits: window.__kfb.pick(x, y) })), pts);
console.log(JSON.stringify(r, null, 1)); await close();
