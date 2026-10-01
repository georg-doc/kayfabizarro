import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE = process.env.KFB_BROWSER_BASE || 'http://127.0.0.1:4173';
const HOST = '/tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/KFB_Resident_Atlas_S15.html';
const OUT = process.env.KFB_BROWSER_OUT ||
  fileURLToPath(new URL('../evidence/ensemble-browser/', import.meta.url));

const EXPECTED = [
  { residentId: 'lorekeeper', actorId: 'lorekeeper', rigFamily: 'Rig_Medium', pose: 'Idle_A', nodes: 3 },
  { residentId: 'goth-girl', actorId: 'gothgirl', rigFamily: 'Rig_Medium', pose: 'Sit_Chair_Idle', nodes: 5 },
  { residentId: 'clown', actorId: 'clown', rigFamily: 'Rig_Medium', pose: 'Idle_B', nodes: 21 },
  { residentId: 'witch', actorId: 'witch', rigFamily: 'Rig_Medium', pose: 'Holding_B', nodes: 11 }
];

await fs.mkdir(OUT, { recursive: true });

const report = {
  schema: 'kfb.resident-chat-ensemble-browser-proof/0.1',
  url: BASE + HOST + '#__residentchat',
  pageErrors: [],
  consoleErrors: [],
  httpErrors: [],
  requestFailures: [],
  optionalReferenceHttpErrors: [],
  optionalReferenceRequestFailures: [],
  screenshots: [],
  result: 'PENDING'
};

function trackedUrl(url) {
  return (
    url.startsWith(BASE) ||
    /raw\.githubusercontent\.com|unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com/i.test(url)
  );
}

function isOptionalReference(url) {
  let pathname = '';
  try { pathname = decodeURIComponent(new URL(url, BASE).pathname).replace(/\\/g, '/'); }
  catch { return false; }
  return (
    /\/ref\/atlas\/(?:Lorekeeper|GothGirl)\.gif$/i.test(pathname) ||
    /\/(?:Clown|Witch)\/artwork\.png$/i.test(pathname)
  );
}

const browser = await chromium.launch({
  headless: false,
  args: [
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox',
    '--no-sandbox'
  ]
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1
});
const page = await context.newPage();

page.on('pageerror', (error) => report.pageErrors.push(String(error?.message || error)));
page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const text = message.text();
  if (/^Failed to load resource:/i.test(text)) return;
  if (/favicon/i.test(text)) return;
  report.consoleErrors.push(text);
});
page.on('response', (response) => {
  if (response.status() < 400) return;
  const url = response.url();
  if (/\/favicon(?:\.ico)?(?:\?|$)/i.test(url)) return;
  if (!trackedUrl(url)) return;
  const item = { url, status: response.status() };
  (isOptionalReference(url) ? report.optionalReferenceHttpErrors : report.httpErrors).push(item);
});
page.on('requestfailed', (request) => {
  const url = request.url();
  if (!trackedUrl(url)) return;
  const item = { url, errorText: request.failure()?.errorText || 'request failed' };
  (isOptionalReference(url) ? report.optionalReferenceRequestFailures : report.requestFailures).push(item);
});

async function shot(name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  report.screenshots.push(name);
}

try {
  await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 120_000 });

  await page.waitForFunction(() => {
    const chat = window.__residentChat;
    const atlas = window.__atlas;
    const cur = atlas && atlas.cur && atlas.cur();
    return !!(chat && chat.ready && cur && cur.ensemble && cur.members && cur.members.length === 4);
  }, null, { timeout: 300_000 });

  const ready = await page.evaluate(() => {
    const cur = window.__atlas.cur();
    return {
      chat: window.__residentChat.state(),
      overlayOwner: document.querySelector('#resident-chat-overlay')?.dataset.owner || null,
      members: cur.members.map((member) => {
        const actor = member.nodes.get(member.recipe.actor.id);
        return {
          residentId: member.recipe.residentId,
          actorId: member.recipe.actor.id,
          rigFamily: member.recipe.actor.rigFamily,
          pose: String(member.recipe.actor.pose),
          nodes: member.nodes.size,
          rootName: member.root?.name || null,
          rootVisible: !!member.root?.visible,
          actorPresent: !!actor,
          actorVisible: !!actor?.visible
        };
      }),
      canvas: {
        width: window.__atlas.V.renderer.domElement.clientWidth,
        height: window.__atlas.V.renderer.domElement.clientHeight
      },
      qaClass: document.querySelector('#qa')?.className || '',
      qaText: document.querySelector('#qa')?.textContent?.trim() || ''
    };
  });

  report.ready = ready;
  assert.equal(ready.overlayOwner, 'NPC-CARD-SPEC-01 createBubbles');
  assert.deepEqual(ready.members.map((m) => m.residentId), EXPECTED.map((m) => m.residentId));
  assert.equal(ready.members.reduce((sum, m) => sum + m.nodes, 0), 40);
  assert.ok(ready.canvas.width >= 900 && ready.canvas.height >= 600);
  assert.doesNotMatch(ready.qaClass, /bad/i);

  EXPECTED.forEach((expected, index) => {
    const actual = ready.members[index];
    assert.equal(actual.actorId, expected.actorId);
    assert.equal(actual.rigFamily, expected.rigFamily);
    assert.match(actual.pose, new RegExp(expected.pose));
    assert.equal(actual.nodes, expected.nodes);
    assert.equal(actual.actorPresent, true);
    assert.equal(actual.actorVisible, true);
    assert.equal(actual.rootVisible, true);
  });

  assert.equal(ready.chat.members.length, 4);
  assert.equal(ready.chat.sourceCapabilities.sourceAnimation, true);
  assert.equal(ready.chat.sourceCapabilities.mouth, false);
  assert.equal(ready.chat.sourceCapabilities.gaze, false);
  assert.equal(ready.chat.sourceCapabilities.bubble, 'NPC-CARD-SPEC-01 createBubbles');
  await shot('ensemble-ready.png');

  await page.waitForFunction(() => {
    const s = window.__residentChat?.state();
    return !!(s && s.proofTurns.length >= 1 && s.activeBubbleCount >= 1);
  }, null, { timeout: 30_000 });
  await shot('ensemble-turn-1.png');

  await page.waitForFunction(() => {
    const s = window.__residentChat?.state();
    return !!(s && s.proofTurns.length >= 2 && s.activeBubbleCount >= 2);
  }, null, { timeout: 30_000 });
  await shot('ensemble-turn-2-overlap.png');

  await page.waitForFunction(() => window.__residentChat?.state().proofDone === true, null, { timeout: 30_000 });

  const playerTurn = await page.evaluate(() =>
    window.__residentChat.interact('clown', { playerId: 'player', rng: 0.55 })
  );
  assert.equal(playerTurn.kind, 'turn');
  assert.equal(playerTurn.speakerId, 'clown');
  assert.equal(playerTurn.addresseeId, 'player');
  assert.equal(playerTurn.socialOperator, 'BINGO');
  assert.equal(playerTurn.presentationHints.handClosureToPlayer, true);

  await page.waitForTimeout(300);
  await shot('ensemble-player-clown.png');

  const final = await page.evaluate(() => ({
    state: window.__residentChat.state(),
    bodyText: document.body.innerText,
    qaClass: document.querySelector('#qa')?.className || '',
    qaText: document.querySelector('#qa')?.textContent?.trim() || ''
  }));
  report.final = final;

  assert.deepEqual(final.state.proofTurns.map((turn) => turn.speakerId), ['lorekeeper', 'witch']);
  assert.deepEqual(final.state.proofTurns.map((turn) => turn.tripletId),
    ['lorekeeper.provenance.02', 'witch.variable.01']);
  assert.equal(final.state.proofTurns[1].socialOperator, 'BOGGLE');
  assert.equal(final.state.proofTurns[1].presentationHints.reframe, true);
  assert.equal(final.state.playerTurns.length, 1);
  assert.equal(final.state.playerTurns[0].speakerId, 'clown');
  assert.equal(final.state.playerTurns[0].addresseeId, 'player');
  assert.equal(final.state.playerTurns[0].presentationHints.handClosureToPlayer, true);
  assert.ok(final.state.maxObservedBubbles >= 2, 'proof never demonstrated the soft two-bubble overlap');
  assert.ok(final.state.maxObservedBubbles <= 2, 'visible bubble budget exceeded');
  assert.deepEqual(final.state.errors, []);
  assert.doesNotMatch(final.qaClass, /bad/i);
  assert.doesNotMatch(final.bodyText, /Resident Chat STOP/i);

  assert.deepEqual(report.pageErrors, [], 'page errors');
  assert.deepEqual(report.consoleErrors, [], 'console errors');
  assert.deepEqual(report.httpErrors, [], 'source-critical HTTP errors');
  assert.deepEqual(report.requestFailures, [], 'source-critical request failures');

  report.result = 'PASS';
} catch (error) {
  report.result = 'FAIL';
  report.failure = String(error?.stack || error);
  throw error;
} finally {
  await fs.writeFile(path.join(OUT, 'ensemble-browser-proof.json'),
    JSON.stringify(report, null, 2) + '\n', 'utf8');
  await browser.close();
}
