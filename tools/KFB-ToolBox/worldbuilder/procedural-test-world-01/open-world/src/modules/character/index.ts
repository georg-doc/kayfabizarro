// character module: player capsule controller, speed-matched animation, character switching. See NOTES.md.
import type { CoreContext, GameModule } from '../../core/types';
import { Player } from './player';
import { stageShowcase, showcaseCamera, presets } from './showcase';

let player: Player | null = null;
let firstUpdate = true;

const mod: GameModule = {
  id: 'character',
  showcaseUses: ['terrain', 'camera'],

  async init(ctx: CoreContext) {
    player = new Player(ctx);
    ctx.services.set('player', player);
    // provisional position at the origin until the first frame decides the real spawn (demo may call spawn()).
    // No world.heightAt() here: the first height query builds the world model (seconds) — leave that to chunk
    // building / the first frame instead of billing it to character init.
    player.place(0, 0, 0, 0);
    await player.init();
  },

  update(_dt, ctx) {
    if (!player) return;
    if (firstUpdate) {
      firstUpdate = false;
      if (ctx.mode === 'game' && !player.explicitSpawn && !ctx.services.get('demo')) {
        player.place(0, ctx.world.heightAt(0, 0) + 0.1, 0, 0);
      }
    }
    player.readInput();
  },

  lateUpdate(dt, ctx) {
    player?.lateUpdate(dt);
    if (ctx.mode === 'showcase' && ctx.params.get('showcase') === 'character') showcaseCamera(ctx, dt);
  },

  async showcase(ctx, params) {
    await stageShowcase(ctx, params);
  },

  cameraPresets: presets,
};

export default mod;
