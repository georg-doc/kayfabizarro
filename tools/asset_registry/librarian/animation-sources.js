import { $, state } from './state.js';

const KAYKIT_SHARED_PACK = 'kaykit-character-animations-1-1';

function intersects(a = [], b = []) {
  const right = new Set(b);
  return a.some((value) => right.has(value));
}
function isKayKit(record) {
  return String(record?.packId || '').startsWith('kaykit-') || String(record?.path || '').includes('/KayKit_') || String(record?.path || '').includes('KayKit_');
}
function clipNames(source) {
  const rig = state.rigById?.get(source.assetId) || source.rigFacts;
  return (rig?.animationClips || []).map((clip) => clip.name).filter(Boolean);
}
function sourceLabel(source) {
  const file = String(source.name || source.path?.split('/').pop() || source.assetId);
  return file.replace(/\.(glb|gltf)$/i, '').replace(/^Rig_(Small|Medium|Large)_/i, '');
}
function uniqueClips(sources) {
  return [...new Set(sources.flatMap(clipNames))].sort((a, b) => a.localeCompare(b));
}
function sourceGroup(title, sources, onInspect, note = '') {
  const section = document.createElement('section');
  section.className = 'motion-source-group';
  const clips = uniqueClips(sources);
  const head = document.createElement('div');
  head.className = 'motion-source-head';
  const strong = document.createElement('strong');
  strong.textContent = title;
  const count = document.createElement('span');
  count.textContent = `${sources.length} source${sources.length === 1 ? '' : 's'} · ${clips.length} clips`;
  head.append(strong, count);
  section.append(head);
  if (note) {
    const p = document.createElement('p');
    p.className = 'small-note';
    p.textContent = note;
    section.append(p);
  }
  const details = document.createElement('details');
  details.className = 'motion-source-details';
  const summary = document.createElement('summary');
  summary.textContent = sources.length ? 'Show sources and clips' : 'No sources';
  details.append(summary);
  const rows = document.createElement('div');
  rows.className = 'motion-source-rows';
  for (const source of sources) {
    const row = document.createElement('div');
    row.className = 'motion-source-row';
    const copy = document.createElement('div');
    const label = document.createElement('b');
    label.textContent = sourceLabel(source);
    const names = clipNames(source);
    const meta = document.createElement('span');
    meta.textContent = `${names.length} clips${names.length ? ` · ${names.slice(0, 6).join(', ')}${names.length > 6 ? '…' : ''}` : ''}`;
    copy.append(label, meta);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiet small-button';
    button.textContent = 'Inspect source';
    button.onclick = () => onInspect?.(source.assetId);
    row.append(copy, button);
    rows.append(row);
  }
  details.append(rows);
  if (clips.length) {
    const all = document.createElement('div');
    all.className = 'motion-clip-list';
    all.textContent = clips.join(' · ');
    details.append(all);
  }
  section.append(details);
  return { section, clips };
}

export function discoverAnimationSources(record) {
  const rig = record?.rigFacts;
  const signatures = rig?.skeletonSignatures || [];
  if (!rig?.hasSkin || !signatures.length || !state.catalog || !state.rigById) {
    return { local: [], shared: [], structural: [], localClips: [], sharedClips: [], structuralClips: [] };
  }
  const candidates = state.catalog.filter((source) => {
    if (source.assetId === record.assetId || source.kind !== 'model-3d' || !['glb', 'gltf'].includes(source.format)) return false;
    const facts = state.rigById.get(source.assetId);
    return (facts?.animationCount || 0) > 0 && intersects(signatures, facts?.skeletonSignatures || []);
  });
  const local = [], shared = [], structural = [];
  for (const source of candidates) {
    const sameCollection = source.packId === record.packId && source.collectionPath === record.collectionPath;
    if (sameCollection && /\/Animations\//i.test(source.path)) local.push(source);
    else if (isKayKit(record) && (source.packId === KAYKIT_SHARED_PACK || /KayKit_Character_Animations/i.test(source.path))) shared.push(source);
    else structural.push(source);
  }
  const sort = (rows) => rows.sort((a, b) => String(a.path).localeCompare(String(b.path)));
  sort(local); sort(shared); sort(structural);
  return {
    local, shared, structural,
    localClips: uniqueClips(local), sharedClips: uniqueClips(shared), structuralClips: uniqueClips(structural),
  };
}

export function renderAnimationSources(record, onInspect) {
  const box = $('animationSources');
  if (!box) return { local: [], shared: [], structural: [], localClips: [], sharedClips: [], structuralClips: [] };
  box.replaceChildren();
  const data = discoverAnimationSources(record);
  const embedded = record.rigFacts?.animationCount || 0;
  const any = data.local.length || data.shared.length || data.structural.length;
  if (!record.rigFacts?.hasSkin || (!any && !embedded)) {
    box.hidden = true;
    return data;
  }
  box.hidden = false;
  const title = document.createElement('div');
  title.className = 'motion-library-title';
  const strong = document.createElement('strong');
  strong.textContent = 'Available motion library';
  const embeddedLabel = document.createElement('span');
  embeddedLabel.textContent = `${embedded} embedded clips in character file`;
  title.append(strong, embeddedLabel);
  box.append(title);

  if (data.local.length) {
    const local = sourceGroup('Local character animation packs', data.local, onInspect, 'Animation files shipped inside this character collection.');
    box.append(local.section);
  }
  if (data.shared.length) {
    const shared = sourceGroup('KayKit shared animation library', data.shared, onInspect, 'Exact skeleton-signature match to the shared KayKit rig library. Animation Lab v2 owns playback, attachments and final compatibility validation.');
    box.append(shared.section);
  }
  if (data.structural.length) {
    const structural = sourceGroup('Same-skeleton candidates', data.structural, onInspect, 'Structural signature match only; not a compatibility guarantee.');
    box.append(structural.section);
  }
  return data;
}
