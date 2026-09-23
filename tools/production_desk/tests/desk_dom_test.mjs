// Behavioural DOM test for KFB_PRODUCTION_DESK_V0.html (jsdom). Not a syntax check:
// it runs the page script, feeds it registries and asserts what Georg would see.
// Usage: node desk_dom_test.mjs <desk.html> <registryDir>   (needs jsdom on NODE_PATH)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { JSDOM } = require('jsdom');

const [,, htmlPath, regDir] = process.argv;
const HTML = readFileSync(htmlPath, 'utf8');
const FILES = ['manifest','lanes','briefings','reviews','standards','wsa','tools','problems'];
const baseReg = Object.fromEntries(FILES.map(f => [f, JSON.parse(readFileSync(join(regDir, f + '.json'), 'utf8'))]));
const LIVE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/bot/production-desk-update/registry/production/v1/';
const CANON = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/registry/production/v1/';

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  PASS', msg); } else { fail++; console.log('  FAIL', msg); } }
const tick = (ms = 30) => new Promise(r => setTimeout(r, ms));

function makeDom({ routes = {}, clipboard = null, html = HTML } = {}) {
  const clip = { text: null };
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://desk.local/',
    beforeParse(w) {
      w.fetch = (url) => {
        const hit = Object.keys(routes).find(k => url === k);
        if (!hit) return Promise.resolve({ ok: false, status: 404, json: async () => ({}), text: async () => '' });
        const body = routes[hit];
        return Promise.resolve({ ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(body)), text: async () => String(body) });
      };
      Object.defineProperty(w.navigator, 'clipboard', { value: clipboard === false ? undefined : {
        writeText: (t) => { clip.text = t; return Promise.resolve(); } }, configurable: true });
      w.document.execCommand = () => false;
    }
  });
  return { dom, w: dom.window, d: dom.window.document, clip };
}
function liveRoutes(reg, base = LIVE) { return Object.fromEntries(FILES.map(f => [base + f + '.json', reg[f]])); }
const cards = (d, b) => [...d.querySelectorAll(`#b-${b} .card`)];

console.log('1 · offline: embedded snapshot is shown honestly');
{
  const { d } = makeDom();
  await tick();
  ok(d.getElementById('srcBadge').textContent === 'Eingebauter Stand', 'badge says embedded');
  ok(!d.getElementById('srcBanner').hidden, 'embedded banner visible');
  ok(cards(d, 'LOOK_AT').length === baseReg.manifest.counts.LOOK_AT, 'LOOK_AT cards match registry');
  ok(cards(d, 'RUNNING').length === baseReg.manifest.counts.RUNNING, 'RUNNING cards match registry');
  ok(cards(d, 'CAN_START').length === baseReg.manifest.counts.CAN_START, 'CAN_START cards match registry');
  ok(cards(d, 'WAITING').length === baseReg.manifest.counts.WAITING, 'WAITING cards match registry');
  const travel = d.querySelector('[data-lane="travel"]');
  ok(travel && /Zuletzt bekannt/.test(travel.textContent), 'external Travel lane marked "Zuletzt bekannt"');
  ok(!/\bPR\b|#185|2833674/.test(d.querySelector('.buckets').textContent), 'no PR numbers / SHAs on card faces');
}

console.log('2 · LIVE registry wins and is labelled Live');
{
  const live = JSON.parse(JSON.stringify(baseReg));
  const mover = live.lanes.lanes.find(l => l.bucket !== 'LOOK_AT' && l.freshness !== 'CLOSED');
  mover.bucket = 'LOOK_AT'; mover.yourAction = mover.yourAction || 'Anschauen';
  live.manifest.contentHash = 'live-hash';
  live.manifest.checkedAt = new Date().toISOString();
  const { d } = makeDom({ routes: liveRoutes(live) });
  await tick();
  ok(d.getElementById('srcBadge').textContent === 'Live', 'badge says Live');
  ok(d.getElementById('srcBanner').hidden, 'no fallback banner in Live mode');
  ok(cards(d, 'LOOK_AT').length === baseReg.manifest.counts.LOOK_AT + 1, 'Live data re-buckets a lane');
}

console.log('3 · LIVE down, main available → Hauptstand');
{
  const canon = JSON.parse(JSON.stringify(baseReg)); canon.manifest.checkedAt = new Date().toISOString();
  const { d } = makeDom({ routes: liveRoutes(canon, CANON) });
  await tick();
  ok(d.getElementById('srcBadge').textContent === 'Hauptstand', 'badge says Hauptstand');
}

console.log('4 · polling picks up a new LIVE state without reload');
{
  const routes = {};
  const { w, d } = makeDom({ routes });
  await tick();
  ok(d.getElementById('srcBadge').textContent === 'Eingebauter Stand', 'starts embedded');
  const live = JSON.parse(JSON.stringify(baseReg)); live.manifest.contentHash = 'new'; live.manifest.checkedAt = new Date().toISOString();
  Object.assign(routes, liveRoutes(live));
  w.KFBProductionDesk.poll(); await tick();
  ok(d.getElementById('srcBadge').textContent === 'Live', 'switched to Live after poll');
}

console.log('5 · drawer + copy start prompt');
{
  const curtain = baseReg.lanes.lanes.find(l => l.id === 'curtain');
  const routes = { [curtain.brief.rawUrl]: 'ECHTE STARTNACHRICHT' };
  const { d, clip } = makeDom({ routes });
  await tick();
  const card = d.querySelector('[data-lane="curtain"]');
  card.querySelector('.btn.primary').click(); await tick();
  ok(clip.text === 'ECHTE STARTNACHRICHT', 'copies the real brief text from GitHub');
  card.click(); await tick();
  ok(d.getElementById('drawer').classList.contains('open'), 'drawer opens on card click');
  ok(/Technische Details/.test(d.getElementById('drawerBody').textContent), 'tech details are tucked into the drawer');
}
{
  const { d, clip } = makeDom();
  await tick();
  d.querySelector('[data-lane="vfx-sfx"] .btn.primary').click(); await tick();
  ok(/^Bitte lies diese Datei/.test(clip.text || '') && /github\.com/.test(clip.text), 'falls back to a link when brief fetch fails');
}
{
  const { d } = makeDom({ clipboard: false });
  await tick();
  d.querySelector('[data-lane="billboard"] .btn.primary').click(); await tick();
  const ta = d.getElementById('manualCopy');
  ok(ta && !ta.hidden && ta.value.length > 0, 'when clipboard is blocked, text is shown for manual copy');
}

console.log('6 · stale warning');
{
  const old = JSON.parse(JSON.stringify(baseReg));
  old.manifest.checkedAt = old.manifest.generatedAt = '2026-01-01T00:00:00Z';
  const { d } = makeDom({ routes: liveRoutes(old) });
  await tick();
  ok(!d.getElementById('staleBanner').hidden, 'stale banner shown for old state');
}

console.log('7 · Web-Chat launcher');
{
  const { w, d } = makeDom();
  await tick();
  d.getElementById('lf-project').value = 'Racer-Anatomie';
  d.getElementById('lf-project').dispatchEvent(new w.Event('input'));
  const t = d.getElementById('lf-out').value;
  ok(/Racer-Anatomie/.test(t) && /GitHub gewinnt/.test(t) && /Zwei erfolglose/.test(t) && /Cloudflare/.test(t), 'launcher text carries the standard rules');
}

console.log('8 · no data at all fails visibly');
{
  const empty = HTML.replace(/<script id="embedded-registry" type="application\/json">[\s\S]*?<\/script>/,
                             '<script id="embedded-registry" type="application/json"></script>');
  const { d } = makeDom({ html: empty });
  await tick();
  ok(d.getElementById('srcBadge').textContent === 'Kein Stand', 'shows "Kein Stand" instead of pretending');
}

console.log('9 · Werkzeuge + Suche');
{
  const reg = JSON.parse(JSON.stringify(baseReg));
  reg.tools.tools[1].available = false;
  reg.manifest.contentHash = 'tools'; reg.manifest.checkedAt = new Date().toISOString();
  const { w, d } = makeDom({ routes: liveRoutes(reg) });
  await tick();
  const tools = [...d.querySelectorAll('#tools .tool')];
  ok(tools.length === reg.tools.tools.length, 'every configured tool is listed');
  ok(tools.filter(t => t.getAttribute('href')).length === reg.tools.tools.length - 1, 'only reachable tools are links');
  ok(/Gerade nicht erreichbar/.test(tools[1].textContent), 'unreachable tool says so');
  ok(d.querySelectorAll('#archive li').length === reg.tools.archive.length, 'archive listed');
  const s = d.getElementById('search'); s.value = 'librarian'; s.dispatchEvent(new w.Event('input'));
  const visible = [...d.querySelectorAll('.tool, .card')].filter(n => !n.classList.contains('hidden-by-search'));
  ok(visible.length >= 1 && visible.every(n => /librarian/i.test(n.textContent)), 'search filters cards and tools');
  ok(d.title === 'KFB Hub' && d.getElementById('jetzt') && d.getElementById('werkzeuge') && d.getElementById('archiv'), 'one page: Jetzt · Werkzeuge · Archiv');
}

console.log('10 · Öffnen-Knopf für Prüfseiten');
{
  const { d } = makeDom();
  await tick();
  const withReview = baseReg.lanes.lanes.filter(l => l.review && l.review.available);
  ok(withReview.length > 0, 'fixture has lanes with published reviews');
  for (const l of withReview) {
    const a = [...d.querySelectorAll(`[data-lane="${l.id}"] a.btn`)].find(x => x.href === l.review.url);
    ok(!!a, `${l.id}: button links to the published review`);
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
