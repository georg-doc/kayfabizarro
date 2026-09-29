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

async function keyEvent(page, type, code, key) {
  await page.evaluate(({type,code,key}) => {
    window.dispatchEvent(new KeyboardEvent(type,{code,key,bubbles:true,cancelable:true}));
  }, {type,code,key});
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

  await keyEvent(page,'keydown','KeyW','w');
  await page.evaluate(() => window.__game.advanceBy(1.4));
  const exploreMove = await page.evaluate(() => {
    const p = window.__game.world.player;
    const Input = window.__game.mods?.input?.InputController;
    return {
      x:p.position.x, y:p.position.y, z:p.position.z, speed:p.speed, state:window.__game.state,
      controlsLocked:p.controlsLocked,
      input:{...p.input},
      peekThrottle:Input?.active?.peekThrottle?.() ?? null,
      inputActive:!!Input?.active,
    };
  });
  await keyEvent(page,'keyup','KeyW','w');
  const moved = Math.hypot(exploreMove.x-exploreStart.x, exploreMove.z-exploreStart.z);
  check('Explore player drives', moved > 2, 'distance=' + moved.toFixed(2) + ' debug=' + JSON.stringify(exploreMove));
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
  await page.evaluate(() => {
    window.__game.skipIntro();
    window.__game.advanceBy(4.0);
  });
  check('Race countdown reaches racing via fixed steps', await page.evaluate(() => window.__game.state === 'racing'), await page.evaluate(() => window.__game.state));
  const racePos0 = await page.evaluate(() => {
    const p=window.__game.world.player.position; return {x:p.x,z:p.z};
  });
  await keyEvent(page,'keydown','KeyW','w');
  await page.evaluate(() => window.__game.advanceBy(1.2));
  const raceMove = await page.evaluate(() => {
    const p=window.__game.world.player; return {x:p.position.x,z:p.position.z,speed:p.speed,state:window.__game.state};
  });
  await keyEvent(page,'keyup','KeyW','w');
  const raceMoved = Math.hypot(raceMove.x-racePos0.x, raceMove.z-racePos0.z);
  check('Race player still drives', raceMoved > 1, 'distance=' + raceMoved.toFixed(2));
  check('Race remains racing', raceMove.state === 'racing', raceMove.state);
  await page.screenshot({ path: out + '/checkpoint-a-race.png', fullPage: true });

  // Checkpoint B · real Ground consumer in the same product world.
  await page.goto(BASE + '?ground=1', { waitUntil: 'networkidle', timeout: 30000 });
  await waitFor(page, () => window.__game?.state === 'ground' && window.__game?.world?.groundPlayer?.ready === true, 30000);
  const g0 = await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Ground uses pinned ActionFigure source', g0.sourcePin === '29c7500b39d20945f4f8e73fb02fef91a055b02c', g0.sourcePin);
  check('Ground loads exact six semantic clips', JSON.stringify(g0.clips) === JSON.stringify(['Idle_A','Walking_A','Running_A','Jump_Start','Jump_Idle','Jump_Land']), JSON.stringify(g0.clips));
  check('Ground starts Idle_A', g0.currentAnimation === 'Idle_A', g0.currentAnimation);
  check('Ground owns no root-motion translation', g0.rootMotionWorldTranslation === false);

  await keyEvent(page,'keydown','KeyW','w');
  await page.evaluate(() => window.__game.advanceBy(0.9));
  const gw = await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Ground Walk moves', Math.hypot(gw.position.x-g0.position.x, gw.position.z-g0.position.z) > 0.45, JSON.stringify(gw.position));
  check('Ground Walk uses Walking_A', gw.currentAnimation === 'Walking_A', gw.currentAnimation);

  await keyEvent(page,'keydown','ShiftLeft','Shift');
  await page.evaluate(() => window.__game.advanceBy(0.65));
  const gr = await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Ground Run uses Running_A', gr.currentAnimation === 'Running_A', gr.currentAnimation);
  check('Ground Run speed reflects calibrated consumer', gr.speed > 1.8 && gr.speed < 3.2, String(gr.speed));

  await keyEvent(page,'keyup','ShiftLeft','Shift');
  await page.evaluate(() => window.__game.advanceBy(0.45));
  const gw2 = await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Run returns to Walking_A', gw2.currentAnimation === 'Walking_A', gw2.currentAnimation);

  await keyEvent(page,'keyup','KeyW','w');
  await page.waitForTimeout(450);
  const gi = await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Stop returns to Idle_A', gi.currentAnimation === 'Idle_A', gi.currentAnimation);

  await keyEvent(page,'keydown','Space',' '); await keyEvent(page,'keyup','Space',' ');
  await page.evaluate(() => window.__game.advanceBy(0.10));
  const gjs = await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Jump begins with Jump_Start', gjs.currentAnimation === 'Jump_Start', gjs.currentAnimation);
  await page.evaluate(() => window.__game.advanceBy(0.28));
  const gair=await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Air uses Jump_Idle', gair.currentAnimation === 'Jump_Idle' && gair.onGround === false, gair.currentAnimation);
  await page.evaluate(() => window.__game.advanceBy(1.25));
  const gland=await page.evaluate(() => window.__game.world.groundPlayer.report());
  check('Landing recovers to stable ground locomotion', gland.onGround === true && ['Jump_Land','Idle_A'].includes(gland.currentAnimation), gland.currentAnimation);
  await page.screenshot({ path: out + '/checkpoint-b-ground.png', fullPage: true });

  const runtimeErrors = await page.evaluate(() => window.__game.errors());
  check('runtime error collector empty', Array.isArray(runtimeErrors) && runtimeErrors.length === 0, JSON.stringify(runtimeErrors));
  check('page/console errors empty', pageErrors.length === 0, JSON.stringify(pageErrors));

  const report = { base:BASE, checks, pageErrors, testedAt:new Date().toISOString() };
  await fs.writeFile(out + '/checkpoint-report.json', JSON.stringify(report,null,2));
  console.log('RESULT', checks.filter(c=>c.pass).length + '/' + checks.length, 'PASS');
} catch (error) {
  const failure = {
    base: BASE,
    checks,
    pageErrors,
    error: String(error?.stack || error),
    testedAt: new Date().toISOString(),
  };
  await fs.writeFile(out + '/failure.json', JSON.stringify(failure,null,2));
  try { await page.screenshot({ path: out + '/failure.png', fullPage: true }); } catch {}
  console.error('BROWSER_PROOF_FAIL', failure.error);
  throw error;
} finally {
  await browser.close();
}
