import { openLab } from './browser.mjs';
const { page, close } = await openLab('world=mvp1&shot=1' + (process.argv[2] ? '&' + process.argv[2] : ''));
console.log(JSON.stringify(await page.evaluate(() => window.__kfb.qcheckFragments('protopia').map((f) => ({ id: f.id, edge: f.hard?.edge?.pass, seam: [f.hard?.edge?.seamGapMax, f.hard?.edge?.seamNormalDegMax], g: [f.q5.ground.transitionOver45, f.q5.ground.folds, f.q5.ground.transAt.slice(0, 6)], u: [f.q5.under.transitionOver45, f.q5.under.folds, (f.q5.under.transAt || []).slice(0, 3)] })))));
await close();
