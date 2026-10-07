// Bootstrap: game mode (all modules) or ?showcase=<module>. Each module is imported in isolation.
import { captureConsole, installDebug, markReady } from './debug';
import { Engine } from './engine';
import type { GameModule } from './types';

captureConsole();

/** Fixed module order (= update order). */
const ORDER = ['assets', 'terrain', 'roads', 'villages', 'nature', 'props', 'environment', 'character', 'camera', 'streaming', 'demo'];
const loaders = import.meta.glob('../modules/*/index.ts') as Record<string, () => Promise<{ default: GameModule }>>;

async function loadModule(id: string): Promise<GameModule | null> {
  const key = `../modules/${id}/index.ts`;
  const load = loaders[key];
  if (!load) return null;
  try {
    const m = (await load()).default;
    if (!m || m.id !== id) throw new Error(`module ${id} has no default export with id "${id}"`);
    return m;
  } catch (e) {
    console.warn(`[module:${id}] failed to import; skipped`, e);
    return null;
  }
}

function loadingText(t: string) {
  const l = document.getElementById('loading');
  if (l) l.textContent = t;
}
/** Let the browser paint the loading text before a long synchronous phase. */
const paint = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

async function main() {
  const params = new URLSearchParams(location.search);
  const showcase = params.get('showcase');
  const engine = new Engine(params, showcase ? 'showcase' : 'game');
  installDebug(engine);
  loadingText('Loading assets…');
  await engine.boot();
  engine.bootTimes.engineBooted = Math.round(performance.now());

  let ids = ORDER;
  if (showcase) {
    const self = await loadModule(showcase);
    if (!self) throw new Error(`no module "${showcase}"`);
    const uses = new Set(['assets', 'environment', showcase, ...(self.showcaseUses ?? [])]);
    ids = ORDER.filter((id) => uses.has(id));
  }
  const mods = (await Promise.all(ids.map(loadModule))).filter((m): m is GameModule => !!m);
  engine.addModules(mods);
  loadingText('Starting modules…');
  await paint();
  await engine.initModules();

  if (showcase) {
    const self = mods.find((m) => m.id === showcase);
    try {
      await self?.showcase?.(engine.ctx, params);
    } catch (e) {
      engine.fail(showcase, e, false);
    }
  }

  const sourceView=params.get('sourceView');
  if(showcase && sourceView){const [id,...name]=sourceView.split('.');const m=mods.find(m=>m.id===id);const fn=m?.cameraPresets?.[name.join('.')];if(fn)engine.cameraOverride=fn(engine.ctx);}
  loadingText('Generating the world…');
  await paint();
  engine.start();
  // build everything around the initial focus before declaring ready (clean first screenshot)
  await new Promise((r) => requestAnimationFrame(r));
  engine.chunks.buildAllNow();
  for (let i = 0; i < 3; i++) await new Promise((r) => requestAnimationFrame(r));
  engine.bootTimes.ready = Math.round(performance.now());
  engine.events.emit('ready');
  markReady();
}

main().catch((e) => {
  console.error('[core] boot failed', e);
  const l = document.getElementById('loading');
  if (l) l.textContent = 'Boot failed: ' + (e?.message ?? e);
});
