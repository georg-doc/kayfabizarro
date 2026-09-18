/* Prüfsonden für den POC — kein Test-Framework, kein Build. In die Konsole der laufenden
   Seite einfügen (oder per <script type="module"> nachladen) und das Ergebnis aus
   `window.__probe` lesen. Genau diese Sonden haben den Testbericht erzeugt.

   Sie fahren die ECHTE Laufzeit: Tasten werden als KeyboardEvent geschickt, damit derselbe
   Eingabepfad läuft wie beim Spielen. Wer stattdessen `player.input` setzt, misst nichts —
   der Loop überschreibt es im nächsten Bild. */

const frame = () => new Promise((r) => requestAnimationFrame(r));
const wait = async (n) => { for (let i = 0; i < n; i++) await frame(); };
const key = (k, down) => window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key: k, bubbles: true }));

/* 1 · Assistierte Sprünge: springt n-mal auf das jeweils bestbewertete Ziel und zählt,
      wie oft die Figur dort ankommt, wo der Assist es angekündigt hat. */
export async function probeChill(n = 12) {
  const K = window.KFB_POC, P = K.player;
  const settle = async (max = 600) => { for (let i = 0; i < max; i++) { await frame(); if (P.grounded && P.state !== 'JUMP_START' && P.stateTime > 0.25) return true; } return false; };
  const log = []; let ok = 0, miss = 0;
  await settle();
  for (let i = 0; i < n; i++) {
    const c = K.candidates(P, K.world);
    if (!c.length) { log.push('DEAD END on ' + (P.ground && P.ground.id)); P.yaw += 1.3; await settle(); continue; }
    const from = P.ground && P.ground.id, d = c[0].dist, drop = c[0].drop;
    P.requestJump();
    for (let j = 0; j < 30; j++) { await frame(); if (P.state === 'AIRBORNE') break; }
    const want = P.assist ? P.assist.target : '(manual)';
    await settle(700);
    const got = P.ground && P.ground.id;
    want === got ? ok++ : miss++;
    log.push(`${from} -> ${want} = ${got} d${d.toFixed(1)} drop${drop.toFixed(1)}`);
    P.yaw += 1.1 + i * 0.37;
    await wait(12);
  }
  return { log, ok, miss, stats: { ...P.stats } };
}

/* 2 · Manuelle Sprünge im Game Mode: Anlauf bis an die Kante, Absprung an der Kante. */
export async function probeGame(pairs = [['hub', 'step_s'], ['hub', 'step_e'], ['hub', 'step_w']]) {
  const K = window.KFB_POC, P = K.player;
  document.querySelector('.seg span[data-m="game"]').click();
  await wait(4);
  const log = []; let ok = 0;
  for (const [a, b] of pairs) {
    const from = K.world.byId.get(a), to = K.world.byId.get(b);
    const dx = to.center.x - from.center.x, dz = to.center.z - from.center.z, L = Math.hypot(dx, dz);
    P.pos.set(from.center.x - dx / L * from.half.x * 0.8, from.top, from.center.z - dz / L * from.half.y * 0.8);
    P.vel.set(0, 0, 0); P.grounded = true; P.ground = from; P.assist = null;
    P.yaw = Math.atan2(dx, dz);
    await wait(4);
    key('w', 1); key('Shift', 1);
    let g = 0;
    while (g++ < 300) {
      await frame();
      const ex = from.half.x - Math.abs(P.pos.x - from.center.x), ez = from.half.y - Math.abs(P.pos.z - from.center.z);
      if (Math.min(ex, ez) < 0.8 || !P.grounded) break;
    }
    key(' ', 1); await frame(); key(' ', 0); key('w', 0); key('Shift', 0);
    let h = 0;
    while (h++ < 160) { await frame(); if (P.grounded && P.state !== 'JUMP_START') break; }
    const got = P.ground && P.ground.id;
    if (got === b) ok++;
    log.push(`${a} -> ${b}: ${got}`);
  }
  document.querySelector('.seg span[data-m="chill"]').click();
  return { log, ok, of: pairs.length };
}

/* 3 · Bouncer: erreicht der Absprung die Arena-Oberkante? */
export async function probeBouncer() {
  const K = window.KFB_POC, P = K.player;
  const launch = K.world.byId.get('launch'), arena = K.world.byId.get('arena');
  P.pos.set(launch.center.x - 2, launch.top, launch.center.z);
  P.vel.set(0, 0, 0); P.grounded = true; P.ground = launch; P.yaw = Math.PI / 2;
  let maxY = P.pos.y;
  key('w', 1);
  for (let i = 0; i < 130; i++) { await frame(); maxY = Math.max(maxY, P.pos.y); }
  key('w', 0);
  return { bounces: P.stats.bounces, maxY: +maxY.toFixed(2), arenaTop: arena.top, reached: maxY >= arena.top - 0.2 };
}

/* 4 · Aktorwechsel: mountet jeden `proof`-Aktor und liest seinen Bericht. */
export async function probeActors() {
  const K = window.KFB_POC;
  const out = [];
  for (const def of K.roster.groups.flatMap((g) => g.actors).filter((a) => a.proof)) {
    const btn = [...document.querySelectorAll('.actors .actor')].find((x) => x.textContent.startsWith(def.name));
    if (!btn) { out.push({ id: def.id, error: 'kein Knopf' }); continue; }
    btn.click();
    for (let i = 0; i < 900; i++) { await new Promise((r) => setTimeout(r, 100)); if (!K.state.busy) break; }
    const a = K.state.actor;
    out.push({ id: K.state.actorId, info: a && a.info(), clips: a ? a.clipNames.length : 0, notes: a && a.notes });
  }
  return out;
}

export async function probeAll() {
  const r = { chill: await probeChill(12), game: await probeGame([['hub', 'step_s'], ['hub', 'step_e'], ['step_e', 'stone_ne'], ['hub', 'step_w']]), bouncer: await probeBouncer(), actors: await probeActors() };
  console.log(JSON.stringify(r, null, 2));
  return r;
}

window.KFB_PROBE = { probeChill, probeGame, probeBouncer, probeActors, probeAll };
