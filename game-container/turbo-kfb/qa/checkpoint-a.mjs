import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173/game-container/turbo-kfb/app/';
const out = process.env.ARTIFACT_DIR || 'game-container/turbo-kfb/qa/artifacts';
await fs.mkdir(out, { recursive: true });

const checks = [];
function check(name, condition, extra = '') {
  checks.push({ name, pass: !!condition, extra });
  if (!condition) throw new Error('FAIL ' + name + (extra ? ' · ' + extra : ''));
  console.log('PASS', name, extra);
}
async function waitFor(page, fn, timeout=15000) {
  await page.waitForFunction(fn, null, { timeout });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') pageErrors.push('console: ' + m.text()); });

try {
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await waitFor(page, () => window.__game?.state === 'title');
  check('title boots', true);

  const exploreButton = page.getByRole('button', { name: 'Explore free roam' });
  check('Explore entry visible', await exploreButton.count() === 1);
  await exploreButton.click();
  await waitFor(page, () => window.__game?.state === 'explore' && window.__game?.world?.mode === 'explore');

  const exploreStart = await page.evaluate(() => {
    const w = window.__game.world;
    return {
      mode: w.mode,
      karts: w.karts.length,
      player: !!w.player,
      items: !!w.items,
      x: w.player.position.x,
      y: w.player.position.y,
      z: w.player.position.z,
      protectedErrors: window.__game.errors(),
    };
  });
  check('Explore mode active', exploreStart.mode === 'explore', exploreStart.mode);
  check('Explore has exactly one kart', exploreStart.karts === 1, String(exploreStart.karts));
  check('Explore has player kart', exploreStart.player);
  check('Race item system disabled in Explore', exploreStart.items === false);

  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1400);
  const exploreMove = await page.evaluate(() => {
    const p = window.__game.world.player;
    return { x:p.position.x, y:p.position.y, z:p.position.z, speed:p.speed, state:window.__game.state };
  });
  await page.keyboard.up('KeyW');
  const moved = Math.hypot(exploreMove.x-exploreStart.x, exploreMove.z-exploreStart.z);
  check('Explore player drives', moved > 2, 'distance=' + moved.toFixed(2));
  check('Explore keeps playable state', exploreMove.state === 'explore', exploreMove.state);
  check('Explore reports forward speed', exploreMove.speed > 1, 'speed=' + exploreMove.speed.toFixed(2));
  await page.screenshot({ path: out + '/checkpoint-a-explore.png', fullPage: true });

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await waitFor(page, () => window.__game?.state === 'title');
  await page.evaluate(() => window.__game.startRace({ characterIndex:0, difficulty:'normal', laps:1 }));
  await waitFor(page, () => window.__game?.world?.mode === 'race' && window.__game?.state === 'intro');
  const raceStart = await page.evaluate(() => ({ karts:window.__game.world.karts.length, player:!!window.__game.world.player }));
  check('Race regression has 8 karts', raceStart.karts === 8, String(raceStart.karts));
  check('Race regression has player', raceStart.player);
  await page.evaluate(() => window.__game.skipIntro());
  await waitFor(page, () => window.__game?.state === 'racing', 8000);
  const racePos0 = await page.evaluate(() => {
    const p=window.__game.world.player.position; return {x:p.x,z:p.z};
  });
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1200);
  const raceMove = await page.evaluate(() => {
    const p=window.__game.world.player; return {x:p.position.x,z:p.position.z,speed:p.speed,state:window.__game.state};
  });
  await page.keyboard.up('KeyW');
  const raceMoved = Math.hypot(raceMove.x-racePos0.x, raceMove.z-racePos0.z);
  check('Race player still drives', raceMoved > 1, 'distance=' + raceMoved.toFixed(2));
  check('Race remains racing', raceMove.state === 'racing', raceMove.state);
  await page.screenshot({ path: out + '/checkpoint-a-race.png', fullPage: true });

  const runtimeErrors = await page.evaluate(() => window.__game.errors());
  check('runtime error collector empty', Array.isArray(runtimeErrors) && runtimeErrors.length === 0, JSON.stringify(runtimeErrors));
  check('page/console errors empty', pageErrors.length === 0, JSON.stringify(pageErrors));

  const report = { base:BASE, checks, pageErrors, testedAt:new Date().toISOString() };
  await fs.writeFile(out + '/checkpoint-a-report.json', JSON.stringify(report,null,2));
  console.log('RESULT', checks.filter(c=>c.pass).length + '/' + checks.length, 'PASS');
} finally {
  await browser.close();
}
