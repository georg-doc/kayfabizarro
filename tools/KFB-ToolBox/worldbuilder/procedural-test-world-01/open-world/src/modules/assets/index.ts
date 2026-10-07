// assets module: the AssetLibrary itself is created by core (library.ts). This file is the module's showcase:
//   /?showcase=assets                → scale QA (Knight vs door, props, trees)   presets assets.lineup / door / trees …
//   /?showcase=assets&view=edges     → tile edge atlas proof                       presets assets.edges_*
//   /?showcase=assets&view=gallery   → every used family on clean ground           presets assets.gallery_*
import type { GameModule } from '../../core/types';
import { showcaseEdges, edgePresets } from './showcase-edges';
import { showcaseScale, scalePresets, tickScale } from './showcase-scale';
import { showcaseGallery, galleryPresets } from './showcase-gallery';

const mod: GameModule = {
  id: 'assets',
  showcaseUses: [],
  async showcase(ctx, params) {
    ctx.chunks.onlyChunks = new Set();
    const view = params.get('view') ?? 'scale';
    if (view === 'edges') return showcaseEdges(ctx);
    if (view === 'gallery') return showcaseGallery(ctx);
    return showcaseScale(ctx);
  },
  update(dt, ctx) {
    if (ctx.mode === 'showcase') tickScale(dt);
  },
  // Verification views span ~600 m; the environment's focus-centred edge fog would wash them out.
  // Fog is switched off for view=edges|gallery only (append &fog=1 to keep it).
  lateUpdate(_dt, ctx) {
    if (ctx.mode !== 'showcase' || ctx.params.get('fog') === '1') return;
    const v = ctx.params.get('view');
    if ((v === 'edges' || v === 'gallery') && ctx.scene.fog) ctx.scene.fog = null;
  },
  cameraPresets: {
    ...scalePresets,
    ...edgePresets,
    ...galleryPresets,
  },
};
export default mod;
