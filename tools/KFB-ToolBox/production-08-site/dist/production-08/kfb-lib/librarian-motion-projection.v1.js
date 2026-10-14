/* kfb-lib/librarian-motion-projection.v1.js · mock adapter for the Asset Librarian (tools/asset_registry/librarian/)
   Projects each clip of the ONE canonical manifest into a derived `motion` discovery row. It is a projection, not a catalog:
   rows are rebuilt from the loaded manifest each time; unknown future fields ride along under `sourceFacts`. */

export const ROW_SCHEMA = 'kfb.librarian.motion-row/0.1';

export function projectMotion(clip, ctx) {
  const ed = ctx.patch && ctx.patch.motions ? ctx.patch.motions[clip.id] : null;
  const sheet = ctx.sheetBase ? ctx.sheetBase + 'sheets/' + clip.group + '/' + clip.id + '.png' : null;
  const known = new Set(['id', 'label_de', 'group', 'rigs', 'durationSec', 'fps', 'frames', 'rootMotion', 'travelMetersPerCycle', 'facingYawDeg', 'contacts', 'library', 'sourceFbx']);
  const extra = {}; for (const [k, v] of Object.entries(clip)) if (!known.has(k)) extra[k] = v;
  return {
    schema: ROW_SCHEMA,
    assetId: 'motion:' + clip.id,
    motionId: clip.id,
    name: (ed && ed.displayName) || clip.label_de || clip.id,
    nameSource: ed && ed.displayName ? 'editorial patch' : clip.label_de ? 'label_de' : 'id',
    type: 'animation-source',
    kind: 'motion',
    group: clip.group,
    tags: (ed && ed.tags) || [],
    rigs: clip.rigs,
    compatibility: 'per actor · Animation Library measures track binding',
    durationSec: clip.durationSec, fps: clip.fps, frames: clip.frames,
    loop: clip.loop, loopPoseDiffDeg: clip.loopPoseDiffDeg,
    movement: { rootMotion: clip.rootMotion, travelMetersPerCycle: clip.travelMetersPerCycle, facingYawDeg: clip.facingYawDeg },
    contacts: clip.contacts,
    runtimeSource: clip.library,
    preview: sheet,
    seat: /needs a seat/i.test(clip.notes || '') || undefined,
    pairedWith: clip.pairedWith || undefined,
    release: clip.events && clip.events.release ? { frame: clip.events.release.frame, hand: clip.events.release.hand, status: 'candidate · runtime confirmation required' } : undefined,
    provenance: { catalogPath: ctx.catalogPath, catalogVersion: ctx.version, pin: ctx.pin, pr: ctx.pr, notice: ctx.notice, rawFbx: 'not distributed · private archive' },
    sourceFacts: extra,
    links: { animationLibrary: '?motion=' + encodeURIComponent(clip.id) + (ctx.actorId ? '&actor=' + encodeURIComponent(ctx.actorId) : ''), librarian: '?asset=' + encodeURIComponent('motion:' + clip.id) },
  };
}

export function projectAll(cat, ctx) { return cat.clips.map((c) => projectMotion(c, ctx)); }

export function parseLink(search) {
  const u = new URLSearchParams(search || '');
  const asset = u.get('asset'), motion = u.get('motion') || (asset && asset.startsWith('motion:') ? asset.slice(7) : null);
  return { motion, actor: u.get('actor'), asset };
}
