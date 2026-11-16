// The warm-up, and the controls once it's done. Nothing from the warm-up is seen: an opaque cover sits over the canvas
// until the first scene stands ready at its first moment.
import { createParticleRenderer } from 'threejs-particle-fluids';
import { block as recipeBlock } from '../recipe.json';
import { App, SCENES, type SceneDef } from './app.ts';
import { loadAssets } from './assets.ts';

const frames = async (n: number) => {
  for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r));
};
const defaults = () => Object.fromEntries(recipeBlock.controls.map((c) => [c.id, c.default])) as Record<string, unknown>;

export async function boot(block: { state(changes: Record<string, unknown>): void; values: Record<string, unknown> }, progress: (share: number, words: string) => void, onLost: (info: { reason?: string; message?: string }) => void) {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const label = document.getElementById('label') as HTMLElement;
  const tip = document.getElementById('tip') as HTMLElement;
  const renderer = await createParticleRenderer({ canvas, antialias: false, alpha: false });
  const device = (renderer.backend as unknown as { device: GPUDevice }).device;
  void device.lost.then(onLost);
  device.addEventListener('uncapturederror', (e) => console.error('[webgpu]', (e as GPUUncapturedErrorEvent).error.message));

  const app = new App(renderer, canvas);
  progress(0.08, 'Loading the models');
  await app.init(await loadAssets());
  const v = { ...block.values } as Record<string, unknown>;
  const toValues = () => ({ gravity: v.gravity as number, thickness: v.thickness as number, push: v.push as number, tension: v.tension as number, showParticles: v['show-particles'] as boolean, reflections: v.reflections as boolean });
  app.values = toValues();
  app.speed = v.speed as number;
  const sceneDef = (id: unknown) => SCENES.find((s) => s.id === id) as SceneDef;

  const say = (name: string, busy: boolean) => {
    label.hidden = false;
    label.classList.toggle('busy', busy);
    (label.querySelector('.name') as HTMLElement).textContent = name;
    (label.querySelector('.k') as HTMLElement).textContent = busy ? 'loading' : `${(app.live?.world.particleCount ?? 0).toLocaleString('en-US')} particles`;
  };
  const shown = () => {
    const def = app.def;
    if (!def) return;
    say(def.name, false);
    tip.textContent = def.tip;
  };
  app.onBusy = (name) => {
    if (name) say(name, true);
  };
  // Slow even at the lowest quality: fewer particles.
  app.onTierDown = () => {
    const options = recipeBlock.controls.find((c) => c.id === 'particles')!.options!.map((o) => o.value as string);
    const at = options.indexOf(v.particles as string);
    if (at <= 0) return;
    v.particles = options[at - 1];
    block.state({ particles: v.particles });
    void app.request(sceneDef(v.scene), Number(v.particles), shown);
  };

  // Only the first scene before ready: the others are built behind it, after ready, one at a time.
  const first = sceneDef(v.scene);
  progress(0.15, `Building shaders: ${first.name.toLowerCase()}`);
  await app.request(first, Number(v.particles));
  progress(0.92, 'Getting the first frame ready');
  await app.still();
  await app.warmPlainPass();
  shown();
  await frames(2);
  await app.still();
  // Show it under the page's loader a little before ready: the canvas's first showing stalls a frame otherwise.
  document.getElementById('cover')?.remove();
  for (let i = 0; i < 20; i++) await app.still();
  app.start();

  return {
    app,
    set(id: string, value: unknown) {
      if (v[id] === value) return;
      v[id] = value;
      if (id === 'scene' || id === 'particles') void app.request(sceneDef(v.scene), Number(v.particles), shown);
      else if (id === 'speed') app.speed = value as number;
      else app.setValues(toValues());
    },
    trigger(id: string) {
      if (id === 'replay') app.replay();
      if (id === 'reset') {
        const changedScene = v.scene !== defaults().scene || v.particles !== defaults().particles;
        Object.assign(v, defaults());
        block.state(defaults());
        app.speed = v.speed as number;
        app.setValues(toValues());
        const def = sceneDef(v.scene);
        if (changedScene) {
          void app.request(def, Number(v.particles), () => {
            shown();
            app.resetView(def);
          });
        } else {
          app.replay();
          app.resetView(def);
        }
      }
    },
    visible(on: boolean) {
      app.setVisible(on);
    },
  };
}
