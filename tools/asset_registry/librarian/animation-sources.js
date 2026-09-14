import { $, state } from './state.js';

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = './animation-sources.css';
document.head.append(style);

const KAYKIT_SHARED_PACK = 'kaykit-character-animations-1-1';
const RIG_FAMILY_RE = /^Rig_(Small|Medium|Large)$/i;

function intersects(a = [], b = []) {
  const right = new Set(b);
  return a.some((value) => right.has(value));
}
function isKayKit(record) {
  return String(record?.packId || '').startsWith('kaykit-') || String(record?.path || '').includes('/KayKit_') || String(record?.path || '').includes('KayKit_');
}
function kayKitRigFamily(record) {
  const names = (record?.rigFacts?.skins || []).map((skin) => String(skin?.name || '')).filter(Boolean);
  const exact = names.find((name) => RIG_FAMILY_RE.test(name));
  if (exact) return exact.match(RIG_FAMILY_RE)?.[0] || exact;
  return null;
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

function animationSourceCandidate(source, record) {
  return source.assetId !== record.assetId && source.kind === 'model-3d' && ['glb', 'gltf'].includes(source.format);
}

export function discoverAnimationSources(record) {
  const rig = record?.rigFacts;
  const signatures = rig?.skeletonSignatures || [];
  const empty = { rigFamily:null, local:[], shared:[], structural:[], localClips:[], sharedClips:[], structuralClips:[] };
  if (!rig?.hasSkin || !state.catalog || !state.rigById) return empty;

  const rigFamily = isKayKit(record) ? kayKitRigFamily(record) : null;
  const local = [], shared = [], structural = [];
  const claimed = new Set();

  // KayKit publishes character-specific animation packs and a shared library by explicit rig family.
  // This is stronger evidence than requiring standalone animation GLBs to repeat the character skin signature.
  if (rigFamily) {
    const familyPath = `/Animations/gltf/${rigFamily}/`;
    for (const source of state.catalog) {
      if (!animationSourceCandidate(source, record)) continue;
      const path = String(source.path || '');
      const sameCollection = source.packId === record.packId && source.collectionPath === record.collectionPath;
      if (sameCollection && path.includes(familyPath)) {
        local.push(source); claimed.add(source.assetId); continue;
      }
      if ((source.packId === KAYKIT_SHARED_PACK || /KayKit_Character_Animations/i.test(path)) && path.includes(familyPath)) {
        shared.push(source); claimed.add(source.assetId);
      }
    }
  }

  // Generic fallback remains exact skeleton-signature evidence only. It is not a compatibility decision.
  if (signatures.length) {
    for (const source of state.catalog) {
      if (claimed.has(source.assetId) || !animationSourceCandidate(source, record)) continue;
      const facts = state.rigById.get(source.assetId);
      if ((facts?.animationCount || 0) > 0 && intersects(signatures, facts?.skeletonSignatures || [])) structural.push(source);
    }
  }

  const sort = (rows) => rows.sort((a, b) => String(a.path).localeCompare(String(b.path)));
  sort(local); sort(shared); sort(structural);
  return {
    rigFamily,
    local, shared, structural,
    localClips: uniqueClips(local), sharedClips: uniqueClips(shared), structuralClips: uniqueClips(structural),
  };
}

export function renderAnimationSources(record, onInspect) {
  const box = $('animationSources');
  if (!box) return { rigFamily:null, local:[], shared:[], structural:[], localClips:[], sharedClips:[], structuralClips:[] };
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
  embeddedLabel.textContent = `${embedded} embedded clips in character file${data.rigFamily ? ` · ${data.rigFamily}` : ''}`;
  title.append(strong, embeddedLabel);
  box.append(title);

  if (data.local.length) {
    const local = sourceGroup('Local character animation packs', data.local, onInspect, `Animation files shipped inside this character collection for explicit KayKit rig family ${data.rigFamily}.`);
    box.append(local.section);
  }
  if (data.shared.length) {
    const shared = sourceGroup('KayKit shared animation library', data.shared, onInspect, `Shared KayKit sources for explicit rig family ${data.rigFamily}. Animation Lab v2 owns playback, attachments and final compatibility validation.`);
    box.append(shared.section);
  }
  if (data.structural.length) {
    const structural = sourceGroup('Same-skeleton candidates', data.structural, onInspect, 'Exact skeleton-signature match only; structural evidence, not a compatibility guarantee.');
    box.append(structural.section);
  }
  return data;
}
